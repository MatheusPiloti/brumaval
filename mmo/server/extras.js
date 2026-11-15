// Grupo (party), denúncias, baús e arenas de chefe (solo e em grupo).
// server.js cuida do mundo; este arquivo recebe dele o que precisa (X) e devolve os ganchos que ele chama.
'use strict';
const fs = require('fs');
const path = require('path');

// ---- ajustes fáceis de mudar
const PARTY_MAX = 5;
const SOLO_CD = 30 * 60 * 1000;        // espera individual depois de vencer um chefe solo
const GROUP_CD = 4 * 60 * 60 * 1000;   // espera individual depois de vencer o chefe de grupo
const SOLO_TIME = 15 * 60 * 1000;      // tempo para vencer um chefe solo
const GROUP_TIME = 12 * 60 * 1000;     // tempo para vencer o chefe de grupo
const GROUP_LVL = 30;                  // nível mínimo para o chefe de grupo
const GROUP_BOSS = 'colosso';
const LEAVE_AFTER_WIN = 60 * 1000;     // depois da vitória, todos saem sozinhos em 1 minuto
const EXCL_CHANCE = 0.35, EXCL_PITY = 4; // chance do amuleto exclusivo; garantido na 4ª vitória sem ele
const RESTART_BONUS_MIN = 20;          // depois de cada reinício: experiência e saque em dobro por 20 minutos
const REPORT_REASONS =['Xingamento ou assédio', 'Trapaça ou programa externo', 'Nome ofensivo', 'Golpe ou roubo', 'Bug ou problema no jogo', 'Outro'];

module.exports = function extras(X) {
  const { S, db, online, send, toAll, warp, markDirty, mobsApi, DATA_DIR, cleanText, norm, TOWNS, simCtx } = X;
  const { MAPS, MON, cheb, R, ri } = S;
  const sys = (p, text, big) => send(p.ws, { t: 'sys', text, big: !!big });
  const charOf = p => db.chars[p.id];
  const fmtWait = ms => { const m = Math.ceil(ms / 60000); return m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min'; };

  // ================================================================ grupo
  const parties = new Map(); let nextParty = 1;
  const partyOf = p => (p && p.party ? parties.get(p.party) || null : null);
  const partyOfId = id => partyOf(online.get(id));
  const members = pt => [...pt.members].map(id => online.get(id)).filter(Boolean);
  function partyState(pt) {
    return { t: 'party', id: pt.id, leader: pt.leader, members: members(pt).map(o => ({ id: o.id, name: o.name, cls: o.cls, level: o.level, map: o.map, hp: o.hp ?? null, maxHp: o.maxHp ?? null, dead: !!o.dead })) };
  }
  function pushParty(pt) { const st = partyState(pt), k = JSON.stringify(st); if (k === pt.last) return; pt.last = k; for (const o of members(pt)) o.ws.readyState === 1 && o.ws.send(k); }
  setInterval(() => { for (const pt of parties.values()) pushParty(pt); }, 1000);
  function toParty(pt, msg) { for (const o of members(pt)) send(o.ws, msg); }
  const findOnline = name => { const n = norm(name); return [...online.values()].find(o => norm(o.name) === n) || null; };

  function invite(p, name) {
    const o = findOnline(name);
    if (!o) return sys(p, 'Não há ninguém online com o nome "' + cleanText(name, 20) + '".');
    if (o === p) return sys(p, 'Você não pode se convidar.');
    const pt = partyOf(p);
    if (pt && pt.leader !== p.id) return sys(p, 'Só o líder do grupo pode convidar.');
    if (pt && pt.members.size >= PARTY_MAX) return sys(p, 'O grupo já está cheio (' + PARTY_MAX + ' pessoas).');
    if (partyOf(o)) return sys(p, o.name + ' já está em outro grupo.');
    o.invites = o.invites || new Map(); o.invites.set(p.id, Date.now());
    send(o.ws, { t: 'pinv', from: p.id, name: p.name, level: p.level, cls: p.cls });
    sys(o, p.name + ' convidou você para um grupo. Aceite no painel Grupo ou digite /aceitar.');
    sys(p, 'Convite enviado para ' + o.name + '.');
  }
  function accept(p, fromId) {
    if (!fromId && p.invites && p.invites.size) fromId = [...p.invites.keys()].pop();
    const t = p.invites && p.invites.get(fromId); if (p.invites) p.invites.delete(fromId);
    send(p.ws, { t: 'pinvdel', from: fromId });
    if (!t || Date.now() - t > 120000) return sys(p, 'Esse convite não vale mais.');
    const L = online.get(fromId); if (!L) return sys(p, 'Quem convidou já saiu do jogo.');
    if (p.inst || L.inst) return sys(p, 'Não dá para entrar em grupo dentro de uma arena.');
    let pt = partyOf(L);
    if (pt && pt.leader !== L.id) return sys(p, 'Esse convite não vale mais.');
    if (partyOf(p)) leave(p, true);
    if (!pt) { pt = { id: nextParty++, leader: L.id, members: new Set([L.id]) }; parties.set(pt.id, pt); L.party = pt.id; }
    if (pt.members.size >= PARTY_MAX) return sys(p, 'O grupo já está cheio.');
    pt.members.add(p.id); p.party = pt.id;
    toParty(pt, { t: 'sys', text: p.name + ' entrou no grupo.' }); pt.last = null; pushParty(pt);
  }
  function decline(p, fromId) { if (p.invites) p.invites.delete(fromId); send(p.ws, { t: 'pinvdel', from: fromId }); const L = online.get(fromId); if (L) sys(L, p.name + ' recusou o convite.'); }
  function leave(p, quiet) {
    const pt = partyOf(p); if (!pt) return; pt.members.delete(p.id); p.party = null; send(p.ws, { t: 'party', id: null });
    if (!quiet) sys(p, 'Você saiu do grupo.');
    if (pt.members.size <= 1) { for (const o of members(pt)) { o.party = null; send(o.ws, { t: 'party', id: null }); sys(o, 'O grupo acabou.'); } parties.delete(pt.id); return; }
    if (pt.leader === p.id) { pt.leader = [...pt.members][0]; const nl = online.get(pt.leader); if (nl) toParty(pt, { t: 'sys', text: nl.name + ' agora é o líder do grupo.' }); }
    toParty(pt, { t: 'sys', text: p.name + ' saiu do grupo.' }); pt.last = null; pushParty(pt);
  }
  function kick(p, id) { const pt = partyOf(p); if (!pt || pt.leader !== p.id || id === p.id || !pt.members.has(id)) return; const o = online.get(id); if (o) { sys(o, 'Você foi removido do grupo.'); leave(o, true); } }
  function promote(p, id) { const pt = partyOf(p); if (!pt || pt.leader !== p.id || !pt.members.has(id)) return; pt.leader = id; const o = online.get(id); toParty(pt, { t: 'sys', text: (o ? o.name : '?') + ' agora é o líder do grupo.' }); pt.last = null; pushParty(pt); }
  function partyChat(p, text) {
    const pt = partyOf(p); if (!pt) return sys(p, 'Você não está em um grupo. Convide alguém no painel Grupo.');
    logChat(p, 'grupo', text); toParty(pt, { t: 'chat', ch: 'grupo', id: p.id, from: p.name, level: p.level, text });
  }
  function onPartyMsg(p, m) {
    if (m.a === 'invite') return invite(p, String(m.name || ''));
    if (m.a === 'accept') return accept(p, String(m.from || ''));
    if (m.a === 'decline') return decline(p, String(m.from || ''));
    if (m.a === 'leave') return leave(p);
    if (m.a === 'kick') return kick(p, String(m.id || ''));
    if (m.a === 'lead') return promote(p, String(m.id || ''));
  }

  // ================================================================ denúncias
  const REP_FILE = path.join(DATA_DIR, 'reports.json');
  let reports = []; try { reports = JSON.parse(fs.readFileSync(REP_FILE, 'utf8')); } catch (e) {}
  let repDirty = false;
  setInterval(() => { if (!repDirty) return; repDirty = false; const tmp = REP_FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(reports, null, 1)); fs.renameSync(tmp, REP_FILE); }, 3000);
  const chatLog = [];
  function logChat(p, ch, text) { chatLog.push({ t: Date.now(), id: p.id, name: p.name, map: p.map, ch, text }); if (chatLog.length > 400) chatLog.shift(); }
  function report(p, m) {
    const now = Date.now(); if (now - (p.repT || 0) < 30000) return sys(p, 'Espere um pouco antes de mandar outra denúncia.');
    const reason = REPORT_REASONS.includes(m.reason) ? m.reason : 'Outro';
    const text = cleanText(m.text, 600), tname = cleanText(m.name, 20);
    if (!text && !tname) return sys(p, 'Escreva o que aconteceu.');
    const tc = tname ? Object.values(db.chars).find(c => norm(c.name) === norm(tname)) : null;
    if (tname && !tc && reason !== 'Bug ou problema no jogo') return sys(p, 'Não achei nenhum personagem chamado "' + tname + '". Confira o nome.');
    p.repT = now;
    const id = (reports.length ? reports[reports.length - 1].id : 0) + 1;
    const ctx = chatLog.filter(l => (tc && l.id === tc.id) || (l.map === p.map && now - l.t < 10 * 60000)).slice(-25).map(l => new Date(l.t).toISOString().slice(11, 19) + ' [' + l.ch + '] ' + l.name + ': ' + l.text);
    reports.push({ id, at: new Date(now).toISOString(), by: { acc: p.owner, name: p.name }, target: tc ? { name: tc.name, acc: tc.owner, id: tc.id } : (tname ? { name: tname } : null), reason, text, map: p.map, x: p.x, y: p.y, chat: ctx, done: false });
    if (reports.length > 2000) reports.splice(0, reports.length - 2000);
    repDirty = true;
    sys(p, 'Denúncia #' + id + ' enviada. Obrigado: um administrador vai olhar.');
    for (const o of online.values()) if (o.adm && o !== p) sys(o, 'Nova denúncia #' + id + ': ' + p.name + (tc ? ' → ' + tc.name : '') + ' (' + reason + '). Digite /denuncia ' + id + ' para ver.');
    console.log(new Date().toISOString(), 'denúncia #' + id, p.name, '->', tc ? tc.name : tname || '-', reason);
  }
  function admReports(p, a) {
    if (a[0]) { const r = reports.find(x => x.id === (a[0] | 0)); if (!r) return sys(p, 'Denúncia não encontrada.');
      if (a[1] === 'ok') { r.done = true; repDirty = true; return sys(p, 'Denúncia #' + r.id + ' marcada como resolvida.'); }
      sys(p, '#' + r.id + ' · ' + r.at.slice(0, 16).replace('T', ' ') + ' · ' + r.by.name + ' (' + r.by.acc + ')' + (r.target ? ' → ' + r.target.name + (r.target.acc ? ' (' + r.target.acc + ')' : '') : '') + ' · ' + r.reason + ' · ' + r.map + ' ' + r.x + ',' + r.y + (r.done ? ' · resolvida' : ''));
      if (r.text) sys(p, 'Relato: ' + r.text);
      for (const l of r.chat.slice(-12)) sys(p, '  ' + l);
      return sys(p, 'Para marcar como resolvida: /denuncia ' + r.id + ' ok');
    }
    const open = reports.filter(r => !r.done).slice(-10);
    if (!open.length) return sys(p, 'Nenhuma denúncia em aberto.');
    sys(p, 'Denúncias em aberto (' + reports.filter(r => !r.done).length + '):');
    for (const r of open) sys(p, '#' + r.id + ' · ' + r.at.slice(5, 16).replace('T', ' ') + ' · ' + r.by.name + (r.target ? ' → ' + r.target.name : '') + ' · ' + r.reason);
    sys(p, 'Detalhes: /denuncia N');
  }

  // ================================================================ baús
  const CHESTS = { chest1: 'Baú de Madeira', chest2: 'Baú de Ferro', chest3: 'Baú das Brumas' };
  const chestsOf = c => c.chests || (c.chests = {});
  function grantChest(p, id, n = 1) { const c = charOf(p); if (!c) return; chestsOf(c)[id] = (chestsOf(c)[id] || 0) + n; markDirty(); send(p.ws, { t: 'gotitem', item: { id, n, r: 0, a: [] } }); }
  function onLooted(p, it) { if (!it || !CHESTS[it.id]) return; const c = charOf(p); if (!c) return; chestsOf(c)[it.id] = (chestsOf(c)[it.id] || 0) + (it.n || 1); markDirty(); }
  const regionFor = lv => lv >= 90 ? 'sea' : lv >= 70 ? 'ice' : lv >= 50 ? 'ash' : lv >= 25 ? 'fae' : 'over';
  function gear(p, lv, minR, forceR) {
    S.player.cls = p.cls || 'guerreiro';
    const id = S.randomGearId(Math.max(1, lv), regionFor(lv)); if (!id) return null;
    const r = forceR != null ? forceR : Math.max(minR, S.rollRarity(lv + 15, false));
    return S.makeItem(id, r, lv);
  }
  const potTier = lv => lv >= 70 ? ['hp3', 'mp3'] : lv >= 35 ? ['hp2', 'mp2'] : ['hp', 'mp'];
  function rollChest(p, id) {
    const lv = Math.max(1, p.level | 0), out = [], [hp, mp] = potTier(lv); let jackpot = null;
    const add = it => { if (it) out.push(it); return it; };
    if (id === 'chest1') {
      add({ id: 'gold', n: 50 + lv * ri(15, 40), r: 0, a: [] }); add({ id: hp, n: ri(3, 8), r: 0, a: [] });
      if (R() < 0.5) add({ id: mp, n: ri(2, 5), r: 0, a: [] });
      add(gear(p, lv, 1));
      const x = R(); if (x < 0.006) jackpot = add(gear(p, lv, 4, 4)); else if (x < 0.05) jackpot = add(gear(p, lv, 3, 3));
    } else if (id === 'chest2') {
      add({ id: 'gold', n: 200 + lv * ri(40, 90), r: 0, a: [] }); add({ id: hp, n: ri(6, 12), r: 0, a: [] }); add({ id: mp, n: ri(4, 8), r: 0, a: [] });
      add(gear(p, lv, 2)); add(gear(p, lv, 2));
      const x = R(); if (x < 0.025) jackpot = add(gear(p, lv, 4, 4)); else if (x < 0.15) jackpot = add(gear(p, lv, 3, 3));
    } else {
      add({ id: 'gold', n: 500 + lv * ri(100, 200), r: 0, a: [] }); add({ id: hp, n: ri(10, 20), r: 0, a: [] }); add({ id: mp, n: ri(8, 15), r: 0, a: [] });
      add(gear(p, lv, 3)); add(gear(p, lv, 3)); add(gear(p, lv, 3));
      if (R() < 0.15) jackpot = add(gear(p, lv, 4, 4));
      for (const it of out) if (S.ITEMS[it.id] && S.ITEMS[it.id].slot) it.s = 'do Colosso'; // equipamento do Baú das Brumas leva o nome do chefe
    }
    return { items: out, jackpot };
  }
  function openChest(p, id) {
    if (!CHESTS[id]) return;
    const c = charOf(p); if (!c) return;
    if ((chestsOf(c)[id] || 0) < 1) return send(p.ws, { t: 'chestres', id, err: 'Este baú não pode ser aberto: ele não veio do servidor.' });
    const now = Date.now(); if (now - (p.chestT || 0) < 700) return send(p.ws, { t: 'chestres', id, err: 'Calma: um baú de cada vez.' }); p.chestT = now;
    chestsOf(c)[id]--; markDirty();
    const { items, jackpot } = rollChest(p, id);
    send(p.ws, { t: 'chestres', id, items, jackpot: jackpot ? items.indexOf(jackpot) : -1 });
    if (jackpot && jackpot.r >= 4) toAll({ t: 'sys', text: p.name + ' encontrou um item Lendário (' + (S.ITEMS[jackpot.id]?.name || jackpot.id) + ') em um ' + CHESTS[id] + '!', big: true });
  }

  // ================================================================ arenas de chefe (instâncias)
  const insts = new Map(); let nextInst = 1;
  let soloList = null;
  function bossTable() {
    if (soloList) return soloList;
    let B = []; try { B = require('vm').runInContext('BOSSES', simCtx) || []; } catch (e) {}
    const seen = new Set(B.map(b => b.type));
    for (const t in MON) if (MON[t].boss && !MON[t].group && !seen.has(t) && t !== 'tentacle') B.push({ type: t, lvl: Math.max(1, (MON[t].lvl || 1) - 1) });
    soloList = B.filter(b => MON[b.type] && !MON[b.type].group).map(b => ({ type: b.type, lvl: b.lvl })).sort((a, b) => a.lvl - b.lvl);
    return soloList;
  }
  const cdOf = c => c.bcd || (c.bcd = {});
  const cdLeft = (p, type) => { const c = charOf(p); return c ? Math.max(0, (cdOf(c)[type] || 0) - Date.now()) : 0; };
  function bossInfo(p) {
    return { t: 'blist', list: bossTable().map(b => ({ type: b.type, lvl: b.lvl, cd: cdLeft(p, b.type) })),
      group: { type: GROUP_BOSS, lvl: GROUP_LVL, cd: cdLeft(p, GROUP_BOSS), size: partyOf(p) ? partyOf(p).members.size : 1, leader: !partyOf(p) || partyOf(p).leader === p.id, max: PARTY_MAX, time: GROUP_TIME, soloTime: SOLO_TIME } };
  }
  const sendBossCds = p => send(p.ws, { t: 'bosses', list: [...bossTable().map(b => b.type), GROUP_BOSS].map(type => ({ type, cd: cdLeft(p, type) })) });

  function makeInst(type, group, names) {
    const id = nextInst++, map = 'arena#' + id, A = simCtx.makeArena(map, group);
    A.region = S.monRegion(type) === 'other' ? 'over' : S.monRegion(type);
    MAPS[map] = A;
    const inst = { id, map, type, group, players: new Set(), ret: new Map(), started: Date.now(), ends: Date.now() + (group ? GROUP_TIME : SOLO_TIME), done: false, leaveAt: 0, names };
    insts.set(id, inst); return inst;
  }
  function bring(p, inst) {
    inst.ret.set(p.id, { map: p.map, x: p.x, y: p.y }); inst.players.add(p.id); p.inst = inst.id;
    const A = MAPS[inst.map];
    send(p.ws, { t: 'inst', map: inst.map, big: inst.group, name: A.name, region: A.region, ends: inst.ends, type: inst.type, group: inst.group });
    warp(p, inst.map, A.spawn.x + ri(-2, 2), A.spawn.y, inst.group ? 'Vocês entram no Salão das Brumas. Derrotem o Colosso antes que o tempo acabe!' : 'Você entra na arena. Derrote ' + MON[inst.type].name + ' antes que o tempo acabe!');
  }
  function exitInst(p, text, noWarp) {
    const inst = insts.get(p.inst); p.inst = null; if (!inst) return;
    const ret = inst.ret.get(p.id); inst.players.delete(p.id); inst.ret.delete(p.id);
    send(p.ws, { t: 'inst', map: null });
    if (!noWarp && ret && MAPS[ret.map]) warp(p, ret.map, ret.x, ret.y, text || 'Você sai da arena.');
    if (!inst.players.size) destroy(inst);
  }
  function destroy(inst) { insts.delete(inst.id); mobsApi.clearMap(inst.map); delete MAPS[inst.map]; }
  const retPos = p => { const inst = p.inst && insts.get(p.inst); return inst ? inst.ret.get(p.id) || null : null; };

  function enterSolo(p, type) {
    const b = bossTable().find(x => x.type === type); if (!b) return sys(p, 'Chefe desconhecido.');
    if (p.level < b.lvl) return sys(p, MON[type].name + ' exige nível ' + b.lvl + '.');
    const cd = cdLeft(p, type); if (cd > 0) return sys(p, 'Você poderá enfrentar ' + MON[type].name + ' de novo em ' + fmtWait(cd) + '.');
    const inst = makeInst(type, false, [p.name]); bring(p, inst);
    const A = MAPS[inst.map]; mobsApi.spawnAt(inst.map, type, A.bossAt.x, A.bossAt.y, {}, { inst: inst.id });
    console.log(new Date().toISOString(), 'arena', p.name, type);
  }
  function enterGroup(p, awak) {
    const pt = partyOf(p);
    if (pt && pt.leader !== p.id) return sys(p, 'Só o líder do grupo pode abrir o Salão das Brumas.');
    const list = pt ? members(pt) : [p], go = [], why = [];
    for (const o of list) {
      const cd = awak ? 0 : cdLeft(o, GROUP_BOSS);
      if (o.level < GROUP_LVL) why.push([o, 'precisa do nível ' + GROUP_LVL]);
      else if (cd > 0) why.push([o, 'só pode voltar em ' + fmtWait(cd)]);
      else if (o.inst) why.push([o, 'já está em uma arena']);
      else if (o.dead) why.push([o, 'está morto']);
      else if (o.map !== p.map || cheb(o, p) > 12) why.push([o, 'precisa estar perto do portal']);
      else go.push(o);
    }
    if (!go.includes(p)) { const w = why.find(x => x[0] === p); return sys(p, 'Você não pode entrar: ' + (w ? w[1] : 'tente de novo') + '.'); }
    for (const [o, w] of why) { sys(o, 'Você ficou de fora do Salão das Brumas: ' + w + '.'); if (o !== p) sys(p, o.name + ' ficou de fora: ' + w + '.'); }
    const n = go.length, avg = go.reduce((s, o) => s + o.level, 0) / n, d = MON[GROUP_BOSS], r = Math.max(0.5, avg / d.lvl);
    const k = Math.pow(r, 1.3) * (awak ? 1.25 : 1), hp = Math.round(d.hp * Math.pow(r, 1.35) * (0.2 + 0.16 * n) * (awak ? 1.6 : 1));
    const inst = makeInst(GROUP_BOSS, true, go.map(o => o.name)); inst.awak = !!awak;
    for (const o of go) bring(o, inst);
    const A = MAPS[inst.map];
    mobsApi.spawnAt(inst.map, GROUP_BOSS, A.bossAt.x, A.bossAt.y, { hp, maxHp: hp, atk: Math.round(d.atk * k), dfn: Math.round(d.def * Math.pow(r, 0.9)), xp: Math.round(d.xp * Math.pow(r, 1.3)), mult: k, summonMul: k }, { inst: inst.id, awak: !!awak });
    console.log(new Date().toISOString(), awak ? 'colosso desperto' : 'salão das brumas', go.map(o => o.name).join(', '), 'nível médio', Math.round(avg));
    return true;
  }
  function onBossMsg(p, m) {
    if (m.a === 'list') { send(p.ws, bossInfo(p)); return sendBossCds(p); }
    if (m.a === 'leave') { if (p.inst) exitInst(p, 'Você sai da arena.'); return; }
    if (m.a === 'enter') {
      if (p.inst) return sys(p, 'Você já está numa arena.');
      if (p.dead) return;
      const type = String(m.type || '');
      if (type === GROUP_BOSS) { if (!TOWNS.includes(p.map)) return sys(p, 'Use o Portal das Brumas, na cidade.'); return enterGroup(p); }
      // cada chefe tem o seu portal no lugar onde ele ficava: é preciso estar ao lado dele
      if (!S.spawns.some(sp => sp.type === type && sp.map === p.map && cheb(sp, p) <= 3)) return sys(p, 'Vá até o portal de ' + (MON[type] ? MON[type].name : 'esse chefe') + ', no lugar onde ele ficava.');
      return enterSolo(p, type);
    }
  }
  function exclusiveFor(p) {
    const id = 'xamulet_' + (S.ITEMS['xamulet_' + p.cls] ? p.cls : 'guerreiro'), d = S.ITEMS[id];
    S.player.cls = p.cls; const it = S.makeItem(id, 4, Math.max(30, p.level)); delete it.s;
    const A = S.AFF || (() => { try { return require('vm').runInContext('AFF', simCtx); } catch (e) { return null; } })();
    const u = A && A[d.excl] ? A[d.excl] : { min: 10, max: 15 };
    it.a.push({ k: d.excl, v: ri(u.min, u.max) }); it.bound = true; return it;
  }
  // chamado pelos monstros quando um chefe morre
  function onKill(m) {
    const inst = m.sp && m.sp.inst && insts.get(m.sp.inst); if (!inst || inst.done || m.type !== inst.type) return;
    inst.done = true; inst.leaveAt = Date.now() + LEAVE_AFTER_WIN;
    setTimeout(() => { if (insts.get(inst.id) === inst) mobsApi.clearMobs(inst.map); }, 0); // os lacaios somem junto com o chefe
    const now = Date.now(), cdv = inst.awak ? 0 : inst.group ? GROUP_CD : SOLO_CD;
    for (const id of inst.players) {
      const o = online.get(id), c = db.chars[id]; if (!c) continue;
      if (cdv) cdOf(c)[inst.type] = now + cdv; markDirty(); if (!o) continue;
      send(o.ws, { t: 'inst', map: inst.map, won: true, leaveAt: inst.leaveAt, ends: inst.ends, type: inst.type, group: inst.group, big: inst.group, name: MAPS[inst.map].name, region: MAPS[inst.map].region });
      if (inst.group) {
        grantChest(o, 'chest3', 1);
        c.gpity = (c.gpity || 0) + 1;
        if (R() < EXCL_CHANCE || c.gpity >= EXCL_PITY) { c.gpity = 0; const it = exclusiveFor(o); send(o.ws, { t: 'gotitem', item: it, excl: true });
          toAll({ t: 'sys', text: o.name + ' recebeu o ' + S.ITEMS[it.id].name + ', um amuleto exclusivo do Colosso das Brumas!', big: true }); }
        else sys(o, 'O amuleto exclusivo não veio desta vez (garantido em no máximo ' + (EXCL_PITY - c.gpity) + ' vitória' + (EXCL_PITY - c.gpity > 1 ? 's' : '') + ').');
      } else grantChest(o, 'chest2', 1);
      sys(o, 'Vitória! Você sai da arena em 1 minuto (ou use o botão Sair). Próxima vez: daqui a ' + fmtWait(cdv) + '.', true);
      sendBossCds(o);
    }
    if (inst.group) toAll({ t: 'sys', text: 'O grupo de ' + inst.names.join(', ') + (inst.awak ? ' derrotou o Colosso das Brumas Desperto! As brumas se desfazem por uma hora: experiência e saque em dobro para todos!' : ' derrotou o Colosso das Brumas!'), big: true });
  }
  setInterval(() => { const now = Date.now();
    for (const inst of [...insts.values()]) {
      if (!inst.done && now > inst.ends) { for (const id of [...inst.players]) { const o = online.get(id); if (o) exitInst(o, 'O tempo acabou: as brumas expulsam você da arena.'); } if (insts.has(inst.id)) destroy(inst); }
      else if (inst.done && now > inst.leaveAt) { for (const id of [...inst.players]) { const o = online.get(id); if (o) exitInst(o, 'Você sai da arena com a vitória.'); } if (insts.has(inst.id)) destroy(inst); }
      else for (const id of [...inst.players]) if (!online.has(id)) { inst.players.delete(id); if (!inst.players.size) destroy(inst); }
    } }, 1000);

  // ================================================================ reinício do servidor: bônus para todos e Baú de Ferro para quem caiu junto
  // A cada 15 s (e ao desligar) o servidor anota quem está online. Ao ligar de novo, quem estava na lista ganha um Baú de Ferro
  // (quando entrar) e todos têm experiência e saque em dobro por RESTART_BONUS_MIN minutos.
  const ONLINE_FILE = path.join(DATA_DIR, 'online.json'), COMP_FILE = path.join(DATA_DIR, 'compensation.json');
  let bonusEnd = Date.now() + RESTART_BONUS_MIN * 60000;
  let comp = {}; try { comp = JSON.parse(fs.readFileSync(COMP_FILE, 'utf8')) || {}; } catch (e) {}
  try { const o = JSON.parse(fs.readFileSync(ONLINE_FILE, 'utf8')); for (const id of o.ids || []) if (db.chars[id]) comp[id] = o.at || Date.now(); } catch (e) {}
  const saveJson = (file, obj) => { try { const tmp = file + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(obj)); fs.renameSync(tmp, file); } catch (e) { console.error('não consegui salvar', file, e.message); } };
  saveJson(COMP_FILE, comp);
  if (Object.keys(comp).length) console.log('Reinício: ' + Object.keys(comp).length + ' personagem(ns) vão ganhar um Baú de Ferro ao entrar.');
  const writeOnline = () => saveJson(ONLINE_FILE, { at: Date.now(), ids: [...online.keys()] });
  writeOnline(); setInterval(writeOnline, 15000); // a lista antiga já foi usada: começa de novo vazia
  const bonusMul = () => (Date.now() < bonusEnd ? 2 : 1);
  const bonusLeft = () => Math.max(0, bonusEnd - Date.now());
  setTimeout(() => { if (Date.now() >= bonusEnd - 1000) toAll({ t: 'sys', text: 'O bônus de experiência e saque em dobro acabou. Bom jogo!', big: true }); }, RESTART_BONUS_MIN * 60000);
  function restartWelcome(p) {
    if (bonusLeft() > 0) { send(p.ws, { t: 'bonus', until: Date.now() + bonusLeft() });
      sys(p, 'Desculpe pela reinicialização do servidor! Para compensar: experiência e saque em dobro para todos por mais ' + fmtWait(bonusLeft()) + '.', true); }
    if (comp[p.id]) { delete comp[p.id]; saveJson(COMP_FILE, comp); grantChest(p, 'chest2', 1);
      sys(p, 'Você estava online quando o servidor reiniciou. Pedimos desculpas: aqui está um Baú de Ferro.', true); }
  }

  // ================================================================ ganchos para o server.js
  function command(p, c, a, raw) {
    if (c === 'denunciar' || c === 'report') { const name = a[0] || ''; return report(p, { name, reason: 'Outro', text: a.slice(1).join(' ') || '(sem detalhes, enviado pelo chat)' }), true; }
    if (c === 'convidar' || c === 'invite') return invite(p, a.join(' ')), true;
    if (c === 'aceitar') return accept(p, null), true;
    if (c === 'sairgrupo') return leave(p), true;
    if (c === 'g' || c === 'grupo') return partyChat(p, cleanText(a.join(' '), 200)), true;
    if (p.adm && c === 'denuncias') return admReports(p, []), true;
    if (p.adm && c === 'denuncia') return admReports(p, a), true;
    return false;
  }
  function onMessage(p, m) {
    switch (m.t) {
      case 'party': onPartyMsg(p, m); return true;
      case 'report': report(p, m); return true;
      case 'chest': openChest(p, String(m.id || '')); return true;
      case 'boss': onBossMsg(p, m); return true;
    }
    return false;
  }
  function onEnter(p) { sendBossCds(p); send(p.ws, { t: 'party', id: null }); restartWelcome(p); }
  function onLeave(p) { leave(p, true); if (p.inst) exitInst(p, null, true); }
  function onMapChange(p) { const inst = p.inst && insts.get(p.inst); if (inst && p.map !== inst.map) exitInst(p, null, true); }
  function onState(p, m) {
    if ('hp' in m) p.hp = Math.max(0, m.hp | 0); if ('maxHp' in m) p.maxHp = Math.max(1, m.maxHp | 0);
  }
  // quest final: uma hora de bônus para todos (soma ao que já houver)
  function extendBonus(min) { bonusEnd = Math.max(bonusEnd, Date.now()) + min * 60000; toAll({ t: 'bonus', until: bonusEnd }); setTimeout(() => { if (Date.now() >= bonusEnd - 1000) toAll({ t: 'sys', text: 'As brumas voltaram. O bônus de experiência e saque acabou.', big: true }); }, bonusEnd - Date.now() + 500); }
  function enterAwakened(p) { if (p.inst) { sys(p, 'Você já está numa arena.'); return false; } return !!enterGroup(p, true); }
  return { grantChest, extendBonus, enterAwakened, command, onMessage, onEnter, onLeave, onMapChange, onState, onLooted, onKill, partyOfId, partyChat, logChat, retPos, REPORT_REASONS, bonusMul, onShutdown: writeOnline };
};
