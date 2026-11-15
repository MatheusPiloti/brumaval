// Quests: motor no servidor. O conteúdo (histórias, passos, objetos) fica em questdata.js.
// O progresso é guardado no personagem (db.chars[id].qd) e só o servidor avança os passos.
'use strict';

const CITY = { over: 'Pedraluz', fae: 'Lunária', ash: 'Cinzaforte', ice: 'Invernália', sea: 'Coralina' };
const TIDE_EVERY = 10 * 60000, TIDE_LOW = 3 * 60000; // maré baixa: 3 minutos a cada 10, igual para todo o servidor

module.exports = function quests(X) {
  const { S, db, online, send, toAll, toMap, markDirty, mobsApi, EX } = X;
  const { MAPS, MON, cheb, R } = S;
  const D = require('./questdata.js');
  const QS = D.QUESTS, QK = Object.fromEntries(QS.map(q => [q.id, q])), OBJ = D.OBJECTS;
  const NPC = Object.fromEntries(S.npcs.map(n => [n.id, n]));
  const sys = (p, text, big) => send(p.ws, { t: 'sys', text, big: !!big });
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const hash = s => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  let forceTide = null; // ADM: /quest mare força maré baixa (para testes)
  const lowTide = () => forceTide != null ? forceTide : Date.now() % TIDE_EVERY < TIDE_LOW;

  // ---------------------------------------------------------------- objetos: posição calculada uma vez, a partir de um ponto conhecido do mapa
  function anchorOf(o) {
    const M = MAPS[o.map]; if (!M) return null; const a = o.at || {};
    if (a.npc && NPC[a.npc]) return { x: NPC[a.npc].x, y: NPC[a.npc].y };
    if (a.boss) { const sp = S.spawns.find(s => s.type === a.boss && s.map === o.map); if (sp) return { x: sp.x, y: sp.y }; }
    if (a.mob) { const list = S.spawns.filter(s => s.type === a.mob && s.map === o.map); if (list.length) { const sp = list[(a.i || 0) % list.length]; return { x: sp.x, y: sp.y }; } }
    if (a.x != null) return { x: a.x, y: a.y };
    if (M.spawn) return { x: M.spawn.x, y: M.spawn.y };
    const any = S.spawns.filter(s => s.map === o.map); if (any.length) { const sp = any[hash(o.id) % any.length]; return { x: sp.x, y: sp.y }; }
    return null;
  }
  const taken = new Set();
  for (const n of S.npcs) taken.add(n.map + ':' + n.x + ',' + n.y);
  for (const sp of S.spawns) taken.add(sp.map + ':' + sp.x + ',' + sp.y);
  function place(o) {
    const M = MAPS[o.map], A = anchorOf(o); if (!M || !A) return null;
    const want = o.d == null ? 3 : o.d, seen = new Set([A.x + ',' + A.y]); let frontier = [A], dist = 0, best = [];
    const ok = (x, y) => x > 0 && y > 0 && x < M.W - 1 && y < M.H - 1 && S.passPlayer(M, x, y) && !M.links[y * M.W + x] && !S.LINKS_T.has(S.tileAt(M, x, y)) && !taken.has(o.map + ':' + x + ',' + y);
    while (frontier.length && dist < 40) {
      const cand = frontier.filter(t => ok(t.x, t.y) && (dist > 0 || want === 0));
      if (dist >= want && cand.length) { best = cand; break; }
      const next = [];
      for (const t of frontier) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = t.x + dx, y = t.y + dy, k = x + ',' + y; if (seen.has(k)) continue; seen.add(k);
        if (x < 0 || y < 0 || x >= M.W || y >= M.H || !S.passPlayer(M, x, y)) continue; next.push({ x, y });
      }
      frontier = next; dist++;
    }
    if (!best.length) return null;
    const t = best[hash(o.id) % best.length]; taken.add(o.map + ':' + t.x + ',' + t.y);
    // os vizinhos também ficam reservados, para dois objetos não ficarem colados um no outro
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) taken.add(o.map + ':' + (t.x + dx) + ',' + (t.y + dy));
    return t;
  }
  for (const [id, o] of Object.entries(OBJ)) { o.id = id; const t = place(o); if (!t) { console.warn('quest: sem lugar para o objeto', id, 'em', o.map); continue; } o.x = t.x; o.y = t.y; }

  // ---------------------------------------------------------------- estado do personagem
  const QD = c => { const q = c.qd || (c.qd = {}); q.a ??= {}; q.done ??= {}; q.f ??= {}; q.titles ??= []; q.cos ??= []; return q; };
  const charOf = p => db.chars[p.id];
  const has = (c, f) => !!QD(c).f[f];
  const hasAll = (c, list) => (list || []).every(f => has(c, f));
  const stepOf = (q, a) => q.steps[a.s];
  const cityName = id => CITY[id] || id;
  const npcName = id => (NPC[id] ? NPC[id].name : id);
  const where = id => (NPC[id] ? (NPC[id].map === 'over' ? 'Pedraluz' : cityName(NPC[id].map)) : '');

  function available(c, q, lvl) {
    const d = QD(c); if (d.done[q.id] || d.a[q.id]) return false;
    if ((q.req || []).some(r => !d.done[r])) return false;
    if (!hasAll(c, q.reqFlags)) return false;
    if (q.reqFn && !q.reqFn(d)) return false;
    return lvl >= (q.lvl || 1);
  }
  function startHidden(p, c) { // baús selados e a quest final começam sozinhos quando as pistas estão juntas
    let any = false;
    for (const q of QS) if (q.hidden && available(c, q, p.level)) { QD(c).a[q.id] = newProg(q); any = true; sys(p, (q.startMsg || 'Nova quest: ' + q.name + '.'), true); }
    if (any) markDirty(); return any;
  }
  const newProg = q => ({ s: 0, n: {}, at: Date.now() });

  // texto do passo atual, para o painel
  function goalOf(c, q, a) {
    const st = stepOf(q, a); if (!st) return '';
    const n = a.n || {}, parts = [];
    if (st.t === 'kill') {
      for (const [type, k] of Object.entries(st.need || {})) parts.push((MON[type] ? MON[type].name : type) + ' ' + Math.min(n[type] || 0, k) + '/' + k);
      for (const it of st.items || []) parts.push(it.name + ' ' + Math.min(n['i:' + it.k] || 0, it.n) + '/' + it.n);
    }
    if (st.t === 'seq' || st.t === 'all' || st.t === 'set') { const total = st.t === 'seq' ? st.order.length : st.t === 'set' ? st.right.length : st.objs.length; parts.push((a.seq ? a.seq.length : 0) + '/' + total); }
    const g = typeof st.goal === 'function' ? st.goal(QD(c)) : st.goal || '';
    return g + (parts.length ? ' · ' + parts.join(' · ') : '');
  }
  function visibleObjs(c) {
    const out = new Set(), d = QD(c);
    for (const [qid, a] of Object.entries(d.a)) { const q = QK[qid]; const st = q && stepOf(q, a); if (!st) continue;
      if (st.obj) out.add(st.obj); for (const o of st.objs || []) out.add(o);
      if (st.t === 'seq') for (const o of new Set(st.order)) out.add(o); }
    return [...out].filter(id => OBJ[id] && OBJ[id].x != null);
  }
  function marks(c, lvl) { // "!" = tem quest para pegar; "?" = um passo de quest está esperando nesse NPC
    const m = {}, d = QD(c);
    for (const q of QS) if (!q.hidden && q.giver && available(c, q, lvl)) m[q.giver] = m[q.giver] || '!';
    for (const [qid, a] of Object.entries(d.a)) { const st = QK[qid] && stepOf(QK[qid], a); if (st && st.npc && ['talk', 'choice', 'answer'].includes(st.t)) m[st.npc] = '?'; }
    return m;
  }
  function pushState(p) {
    const c = charOf(p); if (!c) return; startHidden(p, c); const d = QD(c);
    const list = Object.entries(d.a).map(([qid, a]) => { const q = QK[qid]; if (!q) return null;
      const st = stepOf(q, a); return { id: qid, name: q.name, city: q.city, tier: q.tier || 0, goal: goalOf(c, q, a), step: a.s + 1, steps: q.steps.length, at: st && st.npc ? npcName(st.npc) + (NPC[st.npc] ? ' (' + where(st.npc) + ')' : '') : null }; }).filter(Boolean);
    const avail = QS.filter(q => !q.hidden && q.giver && available(c, q, p.level + 3)).map(q => ({ name: q.name, tier: q.tier, lvl: q.lvl, who: npcName(q.giver), city: where(q.giver) }));
    const done = QS.filter(q => d.done[q.id]).map(q => q.name);
    const objs = visibleObjs(c).map(id => { const o = OBJ[id]; return { id, map: o.map, x: o.x, y: o.y, look: o.look, name: o.name }; });
    send(p.ws, { t: 'qstate', list, avail, done, total: QS.filter(q => !q.hidden).length, marks: marks(c, p.level), objs, titles: d.titles, cos: d.cos, pass: passes(c) });
  }
  // viagem de barco liberada para a cidade de um NPC que um passo de quest pede para visitar (mesmo abaixo do nível do barco)
  function passes(c) { const out = new Set(); for (const [qid, a] of Object.entries(QD(c).a)) { const st = QK[qid] && stepOf(QK[qid], a); if (st && st.npc && NPC[st.npc]) out.add(NPC[st.npc].map); } return [...out]; }

  // ---------------------------------------------------------------- prêmios
  const CLS_WEAPON = { guerreiro: 'blade', cacador: 'bow', feiticeiro: 'wand', xama: 'staff', monge: 'fist' };
  function baseFor(spec, cls, lv) {
    if (spec.base && S.ITEMS[spec.base]) return spec.base;
    const slot = spec.slot || 'weapon', wk = CLS_WEAPON[cls] || 'blade';
    const list = Object.entries(S.ITEMS).filter(([k, d]) => d.slot === slot && !d.excl && !k.startsWith('set_') && (d.lvl || 0) <= lv &&
      (slot !== 'weapon' || d.wk === wk || (d.wk === 'any' && false)) && (!d.cls || d.cls === 'any' || String(d.cls).includes(cls)));
    list.sort((a, b) => (b[1].lvl || 0) - (a[1].lvl || 0)); return list.length ? list[0][0] : null;
  }
  function makeReward(p, spec) {
    if (spec.id && !S.ITEMS[spec.id]?.slot) return { id: spec.id, n: spec.n || 1, r: 0, a: [] };
    const lv = spec.lv || p.level, id = baseFor(spec, p.cls, lv); if (!id) return null;
    S.player.cls = p.cls; const it = S.makeItem(id, spec.r == null ? 4 : spec.r, lv); delete it.s; if (spec.nm) it.nm = spec.nm; if (spec.bound !== false) it.bound = true; return it;
  }
  function regionLoot(p, region, lv, n) { // Baú Selado: equipamento da região do baú, mesmo longe dela
    const out = [{ id: 'gold', n: 1000 + lv * 150, r: 0, a: [] }];
    S.player.cls = p.cls;
    for (let i = 0; i < n; i++) { const id = S.randomGearId(lv, region); if (id) { const it = S.makeItem(id, i === 0 ? 4 : 3, lv); out.push(it); } }
    return out;
  }
  function give(p, g, title) {
    if (!g) return; const c = charOf(p), d = QD(c), msg = { t: 'qreward', items: [], title: title || null };
    if (g.gold) msg.gold = g.gold; if (g.xp) msg.xp = g.xp;
    for (const spec of g.items || []) { const it = makeReward(p, spec); if (it) msg.items.push(it); }
    if (g.loot) msg.items.push(...regionLoot(p, g.loot.region, g.loot.lv, g.loot.n || 3));
    for (const f of g.flags || []) d.f[f] = Date.now();
    if (g.title && !d.titles.includes(g.title)) { d.titles.push(g.title); msg.newTitle = g.title; }
    if (g.cos && !d.cos.includes(g.cos)) { d.cos.push(g.cos); msg.newCos = g.cos; }
    if (g.chest) EX.grantChest(p, g.chest, 1);
    if (g.text) msg.text = g.text;
    markDirty();
    if (msg.gold || msg.xp || msg.items.length || msg.newTitle || msg.newCos || msg.text) send(p.ws, msg);
    if (g.toAll) toAll({ t: 'sys', text: g.toAll.replace('{name}', p.name), big: true });
    if (g.bonusHour) EX.extendBonus(60);
  }

  // ---------------------------------------------------------------- avanço dos passos
  function advance(p, q, a, noGive) {
    const c = charOf(p), d = QD(c), st = stepOf(q, a);
    if (st && st.give && !noGive) give(p, st.give);
    a.s++; a.n = {}; delete a.seq; delete a.rot;
    // passos que só valem com uma pista/escolha: pula quando não se aplicam
    while (a.s < q.steps.length) { const nx = q.steps[a.s];
      if ((nx.ifFlag && !has(c, nx.ifFlag)) || (nx.ifNot && has(c, nx.ifNot))) { a.s++; continue; } break; }
    if (a.s >= q.steps.length) return finish(p, q);
    markDirty();
    const nx = q.steps[a.s];
    if (nx.t === 'rotate') a.rot = Object.fromEntries(nx.objs.map((o, i) => [o, (nx.target[i] + 1 + (hash(p.id + o) % (nx.states.length - 1))) % nx.states.length]));
    sys(p, 'Quest ' + q.name + ': ' + (typeof nx.goal === 'function' ? nx.goal(d) : nx.goal));
    pushState(p);
  }
  function finish(p, q) {
    const c = charOf(p), d = QD(c), a = d.a[q.id]; delete d.a[q.id]; d.done[q.id] = Date.now(); markDirty();
    const ch = a && a.ch && q.choiceFinal ? q.choiceFinal[a.ch] : null;
    give(p, { ...(q.reward || {}), items: [...((q.reward || {}).items || []), ...((ch && ch.items) || [])], title: (ch && ch.title) || (q.reward || {}).title, cos: (ch && ch.cos) || (q.reward || {}).cos }, 'Quest concluída: ' + q.name);
    if (ch && ch.flags) for (const f of ch.flags) d.f[f] = Date.now();
    sys(p, 'Quest concluída: ' + q.name + '!', true);
    if (q.tier === 3) toAll({ t: 'sys', text: p.name + ' concluiu a quest "' + q.name + '"!', big: false });
    pushState(p);
  }

  // ---------------------------------------------------------------- conversa com NPC (só quando há "!" ou "?" nele)
  const P = s => (Array.isArray(s) ? s : [s]).filter(Boolean);
  const say = (st, d) => P(typeof st.say === 'function' ? st.say(d) : st.say);
  function dlg(p, ref, title, text, opts, extra) { send(p.ws, { t: 'qdlg', ref, title, text: P(text), opts: opts || [], ...(extra || {}) }); }
  function nearNpc(p, id) { const n = NPC[id]; return n && n.map === p.map && cheb(p, n) <= 4; }
  function talk(p, npcId) {
    const c = charOf(p); if (!c || !nearNpc(p, npcId)) return dlg(p, npcId, npcName(npcId), [], [], { none: true });
    const d = QD(c), lvl = p.level, entries = [];
    for (const [qid, a] of Object.entries(d.a)) { const q = QK[qid], st = q && stepOf(q, a); if (st && st.npc === npcId && ['talk', 'choice', 'answer'].includes(st.t)) entries.push({ kind: 'step', q, a, st }); }
    for (const q of QS) if (!q.hidden && q.giver === npcId && available(c, q, lvl)) entries.push({ kind: 'offer', q });
    if (!entries.length) return dlg(p, npcId, npcName(npcId), [], [], { none: true });
    if (entries.length > 1 && !p.qPick) return dlg(p, npcId, npcName(npcId), ['"O que você quer saber?"'], entries.map((e, i) => ({ k: 'pick:' + (i + 1), label: (e.kind === 'offer' ? 'Nova quest: ' : '') + e.q.name, primary: e.kind === 'step' })), { other: true });
    const e = entries[Math.min(Math.max(0, (p.qPick || 1) - 1), entries.length - 1)]; p.qPick = 0;
    if (e.kind === 'offer') return dlg(p, npcId, e.q.name, [...P(typeof e.q.intro === 'function' ? e.q.intro(d) : e.q.intro), '<lvl>' + (e.q.tier === 1 ? 'Fácil' : e.q.tier === 2 ? 'Média' : 'Complexa') + ' · nível ' + e.q.lvl + '+'], [{ k: 'accept:' + e.q.id, label: 'Aceitar', primary: true }, { k: 'close', label: 'Agora não' }], { other: true });
    const { q, st } = e;
    if (st.t === 'talk') return dlg(p, npcId, q.name, say(st, d), [{ k: 'adv:' + q.id + ':' + e.a.s, label: (typeof st.btn === 'function' ? st.btn(d) : st.btn) || 'Continuar', primary: true }], { other: true });
    if (st.t === 'choice') return dlg(p, npcId, q.name, say(st, d), st.opts.map(o => ({ k: 'ch:' + q.id + ':' + e.a.s + ':' + o.k, label: o.label, primary: true })).concat([{ k: 'close', label: 'Pensar mais' }]), { other: true });
    if (st.t === 'answer') return dlg(p, npcId, q.name, P(st.ask), [{ k: 'close', label: 'Depois' }], { other: true, input: { k: 'ans:' + q.id + ':' + e.a.s, ph: st.ph || 'Sua resposta' } });
  }
  function onOpt(p, ref, k) {
    const c = charOf(p); if (!c) return; const d = QD(c), [kind, qid, sIdx, extra] = String(k).split(':');
    if (kind === 'pick') { p.qPick = (qid | 0); return talk(p, ref); }
    if (kind === 'accept') { const q = QK[qid]; if (!q || q.hidden || !nearNpc(p, q.giver) || !available(c, q, p.level)) return;
      d.a[q.id] = newProg(q); markDirty(); sys(p, 'Quest aceita: ' + q.name + '. ' + (typeof q.steps[0].goal === 'function' ? q.steps[0].goal(d) : q.steps[0].goal)); if (q.steps[0].t === 'rotate') { const st = q.steps[0]; d.a[q.id].rot = Object.fromEntries(st.objs.map((o, i) => [o, (st.target[i] + 1) % st.states.length])); } return pushState(p); }
    const q = QK[qid], a = q && d.a[qid]; if (!a || a.s !== (sIdx | 0)) return; const st = stepOf(q, a);
    if (kind === 'adv' && st.t === 'talk' && nearNpc(p, st.npc)) return advance(p, q, a);
    if (kind === 'ch' && st.t === 'choice' && nearNpc(p, st.npc)) { const o = st.opts.find(x => x.k === extra); if (!o) return;
      a.ch = o.k; if (o.give) give(p, o.give); if (o.say) dlg(p, ref, q.name, P(o.say), [{ k: 'close', label: 'Continuar' }]);
      if (o.skip) { a.s += o.skip; return advance(p, q, a, true); } return advance(p, q, a); }
  }
  function onAnswer(p, ref, k, v) {
    const c = charOf(p); if (!c) return; const d = QD(c), [kind, qid, sIdx] = String(k).split(':'); if (kind !== 'ans') return;
    const q = QK[qid], a = q && d.a[qid]; if (!a || a.s !== (sIdx | 0)) return; const st = stepOf(q, a); if (st.t !== 'answer') return;
    if (st.npc ? !nearNpc(p, st.npc) : !nearObj(p, st.obj)) return;
    const now = Date.now(); if (now - (p.qAnsT || 0) < 1500) return; p.qAnsT = now;
    if (st.ans.map(norm).includes(norm(v))) { dlg(p, ref, q.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
    dlg(p, ref, q.name, P(st.wrong || '"Não… não é isso."'), [{ k: 'close', label: 'Pensar mais' }], { input: { k, ph: st.ph || 'Sua resposta' } });
  }

  // ---------------------------------------------------------------- objetos (pedras, alavancas, túmulos, baús escondidos…)
  function nearObj(p, id) { const o = OBJ[id]; return o && o.map === p.map && o.x != null && cheb(p, o) <= 2; }
  function spawnNear(p, type, n) { if (!type || !n) return; try { mobsApi.gmSummon(p, type, n); } catch (e) {} }
  function onObj(p, id) {
    const c = charOf(p), o = OBJ[id]; if (!c || !o) return; if (!nearObj(p, id)) return sys(p, 'Chegue mais perto.');
    const now = Date.now(); if (now - (p.qObjT || 0) < 400) return; p.qObjT = now;
    const d = QD(c);
    for (const [qid, a] of Object.entries(d.a)) {
      const q = QK[qid], st = q && stepOf(q, a); if (!st) continue;
      const refs = new Set([st.obj, ...(st.objs || []), ...(st.order || [])]); if (!refs.has(id)) continue;
      if (o.when === 'tide' && !lowTide()) return dlg(p, id, o.name, [o.tideSay || 'A maré está alta: a água cobre tudo. Volte na maré baixa (3 minutos a cada 10; um aviso aparece no chat).'], [{ k: 'close', label: 'Certo' }]);
      if (st.lock && !hasAll(c, st.lock.flags)) return dlg(p, id, o.name, P(st.lock.say), [{ k: 'close', label: 'Certo' }]);
      if (st.t === 'obj') { dlg(p, id, o.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
      if (st.t === 'answer') return dlg(p, id, o.name, P(st.ask), [{ k: 'close', label: 'Depois' }], { input: { k: 'ans:' + q.id + ':' + a.s, ph: st.ph || 'Sua resposta' } });
      if (st.t === 'seq') { a.seq = a.seq || []; const want = st.order[a.seq.length];
        if (id === want) { a.seq.push(id); markDirty();
          if (a.seq.length >= st.order.length) { dlg(p, id, o.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
          dlg(p, id, o.name, [st.okSay ? st.okSay(a.seq.length, st.order.length) : o.name + ' brilha. (' + a.seq.length + '/' + st.order.length + ')'], [{ k: 'close', label: 'Certo' }]); return pushState(p); }
        a.seq = []; markDirty(); spawnNear(p, st.fail && st.fail.mob, st.fail && st.fail.n);
        dlg(p, id, o.name, P(st.failSay || 'Nada acontece… a ordem estava errada. Comece de novo.'), [{ k: 'close', label: 'Certo' }]); return pushState(p); }
      if (st.t === 'all') { a.seq = a.seq || []; if (a.seq.includes(id)) return dlg(p, id, o.name, [st.againSay || 'Este já está feito.'], [{ k: 'close', label: 'Certo' }]);
        a.seq.push(id); markDirty();
        if (a.seq.length >= st.objs.length) { dlg(p, id, o.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
        dlg(p, id, o.name, [st.okSay ? st.okSay(a.seq.length, st.objs.length, id) : 'Feito. (' + a.seq.length + '/' + st.objs.length + ')'], [{ k: 'close', label: 'Certo' }]); return pushState(p); }
      if (st.t === 'set') { a.seq = a.seq || []; if (a.seq.includes(id)) return dlg(p, id, o.name, [st.againSay || 'Este já está aceso.'], [{ k: 'close', label: 'Certo' }]);
        if (!st.right.includes(id)) { a.seq = []; markDirty(); spawnNear(p, st.fail && st.fail.mob, st.fail && st.fail.n); dlg(p, id, o.name, P(st.failSay), [{ k: 'close', label: 'Certo' }]); return pushState(p); }
        a.seq.push(id); markDirty();
        if (a.seq.length >= st.right.length) { dlg(p, id, o.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
        dlg(p, id, o.name, [st.okSay ? st.okSay(a.seq.length, st.right.length) : 'Certo. (' + a.seq.length + '/' + st.right.length + ')'], [{ k: 'close', label: 'Certo' }]); return pushState(p); }
      if (st.t === 'hotcold') { const target = st.objs[hash(p.id + q.id) % st.objs.length];
        if (id === target) { dlg(p, id, o.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
        const T = OBJ[target], dist = Math.max(Math.abs(T.x - o.x), Math.abs(T.y - o.y)), ds = st.objs.filter(x => x !== target).map(x => Math.max(Math.abs(T.x - OBJ[x].x), Math.abs(T.y - OBJ[x].y))).sort((x, y) => x - y);
        const rank = ds.indexOf(dist), word = rank <= 1 ? 'QUENTE! O sininho está bem perto daqui.' : rank <= 3 ? 'Morno… está mais ou menos perto.' : 'Frio. Bem longe daqui.';
        return dlg(p, id, o.name, ['Você mexe no cogumelo. Uma vozinha de fada ri: "' + word + '"'], [{ k: 'close', label: 'Certo' }]); }
      if (st.t === 'rotate') { a.rot = a.rot || Object.fromEntries(st.objs.map((x, i) => [x, (st.target[i] + 1) % st.states.length]));
        a.rot[id] = ((a.rot[id] || 0) + 1) % st.states.length; markDirty();
        const okN = st.objs.filter((x, i) => a.rot[x] === st.target[i]).length;
        let prefix = 0; for (let i = 0; i < st.objs.length && a.rot[st.objs[i]] === st.target[i]; i++) prefix++;
        if (okN === st.objs.length) { dlg(p, id, o.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); return advance(p, q, a); }
        const facing = st.states[a.rot[id]];
        return dlg(p, id, o.name, [st.status ? st.status(facing, okN, prefix, st.objs.length) : 'Agora aponta para ' + facing + '.'], [{ k: 'close', label: 'Certo' }]); }
      if (st.t === 'awaken') { dlg(p, id, o.name, say(st, d), [{ k: 'awaken:' + q.id, label: 'Abrir o portal', primary: true }, { k: 'close', label: 'Ainda não' }]); return; }
    }
    if (o.idle) return dlg(p, id, o.name, P(o.idle), [{ k: 'close', label: 'Certo' }]);
  }
  function onAwaken(p, qid) { const c = charOf(p), a = c && QD(c).a[qid], q = QK[qid]; if (!a || !q) return; const st = stepOf(q, a); if (!st || st.t !== 'awaken' || !nearObj(p, st.obj)) return;
    if (EX.enterAwakened(p)) advance(p, q, a); }

  // ---------------------------------------------------------------- monstros mortos: contagem, itens de quest e chefes
  function onKill(m, ranked) {
    const ids = new Set((ranked || []).map(r => r[0]));
    for (const id of [...ids]) { const pt = EX.partyOfId(id); if (pt) for (const mid of pt.members) { const o = online.get(mid); if (o && o.map === m.map && cheb(o, m) <= 15) ids.add(mid); } }
    for (const id of ids) {
      const p = online.get(id), c = db.chars[id]; if (!p || !c) continue; const d = QD(c); let changed = false;
      for (const [qid, a] of Object.entries(d.a)) {
        const q = QK[qid], st = q && stepOf(q, a); if (!st) continue;
        if (st.t === 'boss' && m.type === st.type && (!st.awak || (m.sp && m.sp.awak))) { if (st.say) dlg(p, null, q.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); advance(p, q, a); continue; }
        if (st.t !== 'kill') continue;
        a.n = a.n || {};
        if (st.need && st.need[m.type] && (a.n[m.type] || 0) < st.need[m.type]) { a.n[m.type] = (a.n[m.type] || 0) + 1; changed = true; }
        for (const it of st.items || []) { const key = 'i:' + it.k; if (!it.from.includes(m.type) || (a.n[key] || 0) >= it.n) continue;
          if (R() < (it.ch || 0.3)) { a.n[key] = (a.n[key] || 0) + 1; changed = true; send(p.ws, { t: 'qitem', name: it.name, n: a.n[key], of: it.n }); } }
        const done = Object.entries(st.need || {}).every(([t, k]) => (a.n[t] || 0) >= k) && (st.items || []).every(it => (a.n['i:' + it.k] || 0) >= it.n);
        if (done) { if (st.say) dlg(p, null, q.name, say(st, d), [{ k: 'close', label: 'Continuar' }]); advance(p, q, a); changed = false; }
      }
      if (changed) { markDirty(); pushStateSoon(p); }
    }
  }
  const soon = new Map();
  function pushStateSoon(p) { if (soon.has(p.id)) return; soon.set(p.id, setTimeout(() => { soon.delete(p.id); if (online.get(p.id) === p) pushState(p); }, 700)); }

  // ---------------------------------------------------------------- maré (Naufrágio): avisa quem está no Recife
  let wasLow = lowTide();
  setInterval(() => { const low = lowTide(); if (low === wasLow) return; wasLow = low;
    const text = low ? 'A maré está baixando no Recife: o tombadilho do Naufrágio fica a seco por 3 minutos.' : 'A maré subiu de novo no Recife.';
    for (const o of online.values()) if (o.map === 'sea' || /^wreck/.test(o.map)) sys(o, text); }, 5000);

  // ---------------------------------------------------------------- ganchos
  function onMessage(p, m) {
    if (m.t !== 'quest') return false;
    const a = m.a;
    if (a === 'talk') talk(p, String(m.npc || ''));
    else if (a === 'opt') { const k = String(m.k || ''); if (k.startsWith('awaken:')) onAwaken(p, k.slice(7)); else onOpt(p, String(m.ref || ''), k); }
    else if (a === 'ans') onAnswer(p, String(m.ref || ''), String(m.k || ''), String(m.v || '').slice(0, 80));
    else if (a === 'obj') onObj(p, String(m.id || ''));
    else if (a === 'state') pushState(p);
    else if (a === 'title') { const c = charOf(p); if (!c) return true; const d = QD(c); d.title = d.titles.includes(m.k) ? m.k : null; markDirty(); }
    else if (a === 'abandon') { const c = charOf(p); if (!c) return true; const q = QK[String(m.id || '')]; if (q && !q.hidden && QD(c).a[q.id]) { delete QD(c).a[q.id]; markDirty(); sys(p, 'Quest abandonada: ' + q.name + '. Você pode pegar de novo com ' + npcName(q.giver) + '.'); pushState(p); } }
    return true;
  }
  function command(p, c, a) {
    if (!p.adm || c !== 'quest') return false;
    const ch = charOf(p), d = QD(ch), sub = a[0];
    if (sub === 'reset') { ch.qd = {}; ch.bcd = {}; markDirty(); sys(p, 'Quests zeradas.'); pushState(p); return true; }
    if (sub === 'pular' || sub === 'skip') { const qid = a[1] || Object.keys(d.a)[0]; const q = QK[qid], ap = d.a[qid]; if (!q || !ap) { sys(p, 'Quest não ativa.'); return true; } advance(p, q, ap); return true; }
    if (sub === 'dar' || sub === 'give') { const q = QK[a[1]]; if (!q) { sys(p, 'Quest desconhecida: ' + QS.map(x => x.id).join(' ')); return true; } d.a[q.id] = newProg(q); markDirty(); pushState(p); sys(p, 'Quest ativa: ' + q.name); return true; }
    if (sub === 'flag') { d.f[a[1]] = Date.now(); markDirty(); pushState(p); sys(p, 'Pista ' + a[1] + ' marcada.'); return true; }
    if (sub === 'feita' || sub === 'done') { for (const id of a.slice(1)) if (QK[id]) { d.done[id] = Date.now(); delete d.a[id]; } markDirty(); pushState(p); sys(p, 'Marcadas como feitas.'); return true; }
    if (sub === 'mare') { forceTide = forceTide ? null : true; sys(p, forceTide ? 'Maré baixa forçada (teste).' : 'Maré volta ao normal.'); return true; }
    if (sub === 'mob') { const sp = S.spawns.find(s => s.type === a[1] && (!a[2] || s.map === a[2])); if (!sp) { sys(p, 'Esse monstro não nasce em lugar nenhum.'); return true; } X.warp(p, sp.map, sp.x, sp.y, 'Você foi até ' + (MON[a[1]] ? MON[a[1]].name : a[1]) + '.'); return true; }
    if (sub === 'obj') { const o = OBJ[a[1]]; if (!o) { sys(p, 'Objetos: ' + Object.keys(OBJ).join(' ')); return true; } X.warp(p, o.map, o.x + 1, o.y, 'Você foi até ' + o.name + '.'); return true; }
    sys(p, '/quest dar ID · /quest pular [ID] · /quest flag NOME · /quest feita ID… · /quest obj ID · /quest reset · estado: ' + JSON.stringify({ a: d.a, f: Object.keys(d.f) }).slice(0, 300));
    return true;
  }
  function onEnter(p) { pushState(p); }
  function onMapChange(p) { /* objetos são enviados com o estado */ }
  const canTravel = (p, to) => { const c = charOf(p); return !!c && passes(c).includes(to); };
  return { onMessage, onKill, onEnter, onMapChange, command, pushState, canTravel, objects: OBJ, quests: QS, lowTide };
};
