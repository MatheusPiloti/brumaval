// Monstros compartilhados: o servidor cria, move, faz atacar, renascer e soltar saque.
// Segue as mesmas regras do jogo (src/game.html: updateMonster, bossTick, killMonster), mas com vários jogadores.
'use strict';
module.exports = function createMobs(S, io, ctx) {
  // io: { players(map) -> [{id,x,y,dead,cls,name}], toMap(map,msg,exceptId), toPlayer(id,msg) }
  const { MAPS, MON, cheb, los, findPath, passMon, R, ri } = S;
  const mobs = new Map();          // id -> monstro
  const corpses = new Map();       // id -> corpo
  let nextId = 1, nextCorpse = 1, now = Date.now();
  const spawns = S.spawns.filter(sp => MON[sp.type] && !MON[sp.type].dummy).map(sp => ({ map: sp.map, type: sp.type, x: sp.x, y: sp.y, mob: null, timer: 0 }));
  const byMap = new Map(); for (const sp of spawns) { if (!byMap.has(sp.map)) byMap.set(sp.map, []); byMap.get(sp.map).push(sp); }

  // ---- ocupação: monstros e jogadores não se sobrepõem
  let occMap = null; const occ = new Map();
  function rebuild(map) { occ.clear(); occMap = map; const W = MAPS[map].W;
    for (const m of mobs.values()) if (m.map === map) occ.set(m.y * W + m.x, m);
    for (const p of io.players(map)) if (!p.dead) occ.set(p.y * W + p.x, p); }
  ctx.occupied = function (mapId, x, y, ignore) { if (mapId !== occMap) rebuild(mapId); const e = occ.get(y * MAPS[mapId].W + x); return !!e && e !== ignore; };
  const occupied = (map, x, y, ign) => ctx.occupied(map, x, y, ign);

  const pub = m => ({ id: m.id, map: m.map, type: m.type, x: m.x, y: m.y, hp: m.hp, maxHp: m.maxHp, dfn: m.dfn, xp: m.xp, mult: m.mult, name: m.name || undefined, face: m.face });
  function spawn(sp, o = {}) {
    const d = MON[sp.type], M = MAPS[sp.map], mult = (d.boss || sp.temp) ? 1 : (M.mult || 1);
    const m = { id: nextId++, type: sp.type, def: d, map: sp.map, x: sp.x, y: sp.y, sp, face: R() < 0.5 ? -1 : 1,
      hp: Math.round(d.hp * mult), maxHp: Math.round(d.hp * mult), atk: Math.round(d.atk * mult), dfn: Math.round(d.def * (1 + (mult - 1) * 0.5)),
      xp: Math.round(d.xp * mult * (mult > 1 ? 1.1 : 1)), mult, state: 'idle', cd: 0, rcd: 2000, think: R() * 2000, react: 0, stepEnd: 0, stuck: 0, ph: {}, dmg: new Map(), born: now, ...o };
    sp.mob = m; mobs.set(m.id, m); if (occMap === m.map) occ.set(m.y * MAPS[m.map].W + m.x, m);
    io.toMap(m.map, { t: 'msp', m: pub(m) }); return m;
  }
  function summon(type, near, n) { let made = 0;
    for (let tries = 0; tries < 40 && made < n; tries++) { const x = near.x + ri(-2, 2), y = near.y + ri(-2, 2); const M = MAPS[near.map];
      if (!passMon(M, x, y) || occupied(near.map, x, y)) continue; const m = spawn({ map: near.map, type, x, y, temp: true, owner: near }); m.state = 'chase'; made++; } }
  function step(m, nx, ny, dur) { if (occMap === m.map) { const W = MAPS[m.map].W; if (occ.get(m.y * W + m.x) === m) occ.delete(m.y * W + m.x); occ.set(ny * W + nx, m); }
    if (nx !== m.x) m.face = nx > m.x ? 1 : -1; m.x = nx; m.y = ny; m.stepEnd = now + dur; io.toMap(m.map, { t: 'mm', id: m.id, x: nx, y: ny, dur }); }
  const moving = m => now < m.stepEnd;
  function remove(m) { mobs.delete(m.id); if (m.sp) m.sp.mob = null; if (occMap === m.map) { const k = m.y * MAPS[m.map].W + m.x; if (occ.get(k) === m) occ.delete(k); } io.toMap(m.map, { t: 'md', id: m.id }); }

  // ---- alvo: quem bateu por último (se ainda estiver por perto) ou o jogador mais perto que ele enxerga
  function pickTarget(m, list) { const M = MAPS[m.map]; let best = null, bd = 1e9;
    const a = m.aggro && list.find(p => p.id === m.aggro && !p.dead && cheb(m, p) <= m.def.sight + 3);
    if (a && los(M, m, a)) return a;
    for (const p of list) { if (p.dead) continue; const d = cheb(m, p); if (d <= m.def.sight && d < bd && los(M, m, p)) { bd = d; best = p; } } return best; }

  // ---- ataques: o jogo de quem foi atacado aplica a defesa e os efeitos (igual ao modo solo)
  function hitPlayer(m, p, msg) { io.toPlayer(p.id, { ...msg, id: m.id, src: m.name || m.def.name }); }
  function fields(map, list) { io.toMap(map, { t: 'fields', map, list }); }
  function fireRain(m, rn, tg) { io.toMap(m.map, { t: 'mtalk', id: m.id, kind: rn.kind || 'fire' });
    const L = []; for (let i = 0; i < rn.n; i++) { const x = i === 0 ? tg.x : tg.x + ri(-2, 2), y = i === 0 ? tg.y : tg.y + ri(-2, 2); L.push([x, y, rn.dmg, 2400, 1000, rn.kind || 'fire']); } fields(m.map, L); }
  function breath(m, br, tg) { const d = cheb(m, tg), dmg = Math.round(ri(br.min, br.max) * m.mult);
    io.toMap(m.map, { t: 'mbreath', id: m.id, tx: tg.x, ty: tg.y });
    const L = []; for (let k = 1; k <= d; k++) L.push([Math.round(m.x + (tg.x - m.x) * k / d), Math.round(m.y + (tg.y - m.y) * k / d), Math.round(br.min * m.mult * 0.35), 2600, 0, 'fire']); fields(m.map, L);
    hitPlayer(m, tg, { t: 'matk', kind: 'breath', dmg }); }
  function krakenTick(m, dt, K, tg) { if (!tg || cheb(m, tg) > 11) return;
    m.slamT = (m.slamT ?? 2500) - dt; m.tentT = (m.tentT ?? 3500) - dt; m.inkCd = (m.inkCd ?? 9000) - dt;
    if (m.slamT <= 0) { m.slamT = K.slam.cd * (m.enraged ? 0.7 : 1); const dmg = Math.round(K.slam.dmg * m.mult); io.toMap(m.map, { t: 'mtalk', id: m.id, text: 'GOLPE DE TENTÁCULO!' }); const L = [];
      if (R() < 0.5) { const dx = tg.x - m.x, dy = tg.y - m.y, Ln = Math.max(1, Math.hypot(dx, dy)); for (let k = 1; k <= 9; k++) L.push([Math.round(m.x + dx / Ln * k), Math.round(m.y + dy / Ln * k), dmg, 500, 1100, 'tentacle']); }
      else for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) L.push([tg.x + ox, tg.y + oy, dmg, 500, 1150, 'tentacle']); fields(m.map, L); }
    if (m.tentT <= 0) { m.tentT = K.tent.cd * (m.enraged ? 0.7 : 1); const alive = [...mobs.values()].filter(x => x.type === 'tentacle' && x.map === m.map).length, n = Math.min(K.tent.n + (m.hp / m.maxHp < .25 ? 2 : 0), K.tent.max - alive);
      if (n > 0) { const spots = []; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { if (!dx && !dy) continue; const x = tg.x + dx, y = tg.y + dy; if (passMon(MAPS[m.map], x, y) && !occupied(m.map, x, y)) spots.push({ x, y }); }
        for (let k = 0; k < n && spots.length; k++) { const p = spots.splice(Math.floor(R() * spots.length), 1)[0]; const s = spawn({ map: m.map, type: 'tentacle', x: p.x, y: p.y, temp: true, owner: m }); s.state = 'chase'; } io.toMap(m.map, { t: 'mtalk', id: m.id, text: 'TENTÁCULOS!' }); } }
    if (m.inkCd <= 0) { m.inkCd = K.ink.cd; for (const p of io.players(m.map)) if (!p.dead && cheb(m, p) <= 11) io.toPlayer(p.id, { t: 'ink', id: m.id, src: m.def.name }); } }
  function bossTick(m, dt, tg) { const a = m.def.ab; if (!a) return; const k = m.hp / m.maxHp;
    if (a.kraken) krakenTick(m, dt, a.kraken, tg);
    if (a.rain && tg) { m.rainT = (m.rainT ?? a.rain.cd) - dt; if (m.rainT <= 0) { m.rainT = a.rain.cd * (m.enraged ? 0.75 : 1); fireRain(m, a.rain, tg); } }
    for (const ph of a.phases || []) if (k <= ph.at && !m.ph[ph.at]) { m.ph[ph.at] = 1; io.toMap(m.map, { t: 'mtalk', id: m.id, text: ph.say, say: true, enrage: !!ph.enrage });
      if (ph.summon) summon(ph.summon, m, ph.n); if (ph.enrage) m.enraged = true; }
    if (a.brood) { m.broodT = (m.broodT ?? a.brood.cd) - dt; if (m.broodT <= 0) { m.broodT = a.brood.cd; const alive = [...mobs.values()].filter(x => x.sp.owner === m).length; if (alive < a.brood.max) { summon(a.brood.type, m, 2); io.toMap(m.map, { t: 'mtalk', id: m.id, text: 'Ovos eclodem!' }); } } } }

  // ---- um passo de inteligência (mesmas regras do jogo)
  function update(m, dt, list) {
    const d0 = m.def; if (d0.life && now - m.born > d0.life) { remove(m); return; }
    if (d0.rooted) m.rootT = 1e9;
    if (m.dot) { m.dot.t -= dt; if (m.dot.t <= 0) { const D = m.dot; D.t = 1000; if (--D.ticks <= 0) m.dot = null; damage(m, D.dmg, D.by, false, D.col || '#7ad04a', true); if (!mobs.has(m.id)) return; } }
    m.cd -= dt; m.think -= dt; m.rcd -= dt; m.slowT = (m.slowT || 0) - dt; m.rootT = (m.rootT || 0) - dt;
    const M = MAPS[m.map], tg = pickTarget(m, list), d = tg ? cheb(m, tg) : 99;
    const fromSpawn = Math.abs(m.x - m.sp.x) + Math.abs(m.y - m.sp.y), mv = moving(m);
    const stepTo = path => { if (m.rootT > 0) return; if (path && path.length) { step(m, path[0].x, path[0].y, d0.step * (m.slowT > 0 ? 1.8 : 1)); m.stuck = 0; } else m.stuck += dt; };
    switch (m.state) {
      case 'idle':
        if (tg) { m.state = 'alert'; m.react = 300 + R() * 250; break; }
        if (!mv && m.think <= 0) { m.think = 1500 + R() * 2600; const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], [dx, dy] = dirs[ri(0, 3)], nx = m.x + dx, ny = m.y + dy;
          if (passMon(M, nx, ny) && !occupied(m.map, nx, ny, m) && Math.abs(nx - m.sp.x) + Math.abs(ny - m.sp.y) <= 4) step(m, nx, ny, d0.step * 1.6); }
        if (m.hp < m.maxHp && m.think <= 0) m.hp = Math.min(m.maxHp, m.hp + 1);
        break;
      case 'alert': m.react -= dt; if (m.react <= 0) m.state = 'chase'; break;
      case 'chase': {
        if (!tg || d > d0.sight + 5 || fromSpawn > 18 || m.stuck > 6000) { if (!tg && m.lostT == null) m.lostT = now; if (tg || now - m.lostT > 1500) { m.state = 'return'; m.stuck = 0; m.charging = 0; m.lostT = null; } break; }
        m.lostT = null;
        if (d0.boss) bossTick(m, dt, tg); if (!mobs.has(m.id)) return;
        const rg = d0.ranged;
        if (rg && d <= rg.range && d > 0 && m.rcd <= 0 && los(M, m, tg)) { m.rcd = rg.cd; const dmg = Math.round(ri(rg.min, rg.max) * m.mult);
          io.toMap(m.map, { t: 'mshot', id: m.id, to: tg.id, tx: tg.x, ty: tg.y, col: rg.color || '#c06aff', arrow: !!rg.arrow }, tg.id);
          hitPlayer(m, tg, { t: 'matk', kind: 'ranged', dmg, col: rg.color || '#c06aff', arrow: !!rg.arrow, slow: rg.slow || 0, poison: rg.poison || null, web: m.type === 'queen' || m.type === 'weaver' || m.type === 'spider' }); }
        m.chargeCd = (m.chargeCd || 0) - dt;
        const br = d0.breath; if (br) { m.brT = (m.brT ?? br.cd * 0.5) - dt; if (m.brT <= 0 && d <= br.range && d > 0 && los(M, m, tg)) { m.brT = br.cd; breath(m, br, tg); } }
        if (d0.charge && !m.charging && m.chargeCd <= 0 && d >= 2 && d <= 5 && los(M, m, tg)) { m.charging = 5; m.chargeCd = 8000; io.toMap(m.map, { t: 'mtalk', id: m.id, text: 'INVESTIDA!' }); }
        if (d <= 1) { m.charging = 0;
          if (m.cd <= 0) { m.cd = d0.as * (m.enraged ? 0.65 : 1); hitPlayer(m, tg, { t: 'matk', kind: 'melee', atk: m.atk, mul: m.chargeHit ? 1.5 : 1, poison: d0.poison || null, grab: !!d0.grab }); m.chargeHit = false; } }
        else if (!mv) {
          if (rg && !d0.boss && d <= rg.range - 1 && los(M, m, tg)) break;
          const path = findPath(M, m.x, m.y, (x, y) => Math.max(Math.abs(x - tg.x), Math.abs(y - tg.y)) <= 1, tg.x, tg.y, passMon, 350, m);
          if (m.charging > 0 && path && path.length && !(m.rootT > 0)) { step(m, path[0].x, path[0].y, 85); m.charging--; if (path.length <= 1) { m.charging = 0; m.cd = 0; m.chargeHit = true; } }
          else if (path && path.length) stepTo(path);
          else if (!(m.rootT > 0)) { const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({ x: m.x + dx, y: m.y + dy })).filter(p => passMon(M, p.x, p.y) && !occupied(m.map, p.x, p.y, m) && Math.max(Math.abs(p.x - tg.x), Math.abs(p.y - tg.y)) < d).sort((a, b) => Math.hypot(a.x - tg.x, a.y - tg.y) - Math.hypot(b.x - tg.x, b.y - tg.y));
            if (opts.length) step(m, opts[0].x, opts[0].y, d0.step * (m.slowT > 0 ? 1.8 : 1)); else m.stuck += dt; }
        }
        break; }
      case 'return':
        if (tg && fromSpawn < 12) { m.state = 'chase'; break; }
        if (!mv) {
          if (fromSpawn <= 1) { m.state = 'idle'; if (m.hp < m.maxHp) { m.hp = m.maxHp; io.toMap(m.map, { t: 'mh', id: m.id, hp: m.hp, maxHp: m.maxHp }); } m.ph = {}; m.enraged = false; m.dmg.clear(); m.aggro = null; break; }
          const path = findPath(M, m.x, m.y, (x, y) => x === m.sp.x && y === m.sp.y, m.sp.x, m.sp.y, passMon, 800, m); stepTo(path);
          if (m.stuck > 4000) { m.x = m.sp.x; m.y = m.sp.y; m.state = 'idle'; m.stuck = 0; io.toMap(m.map, { t: 'mm', id: m.id, x: m.x, y: m.y, dur: 1 }); }
        }
        break;
    }
  }

  // ---- dano vindo dos jogadores
  function damage(m, dmg, by, crit, col, quiet) {
    if (!mobs.has(m.id)) return; dmg = Math.max(0, Math.min(5e6, dmg | 0)); if (!dmg) return;
    m.hp -= dmg; if (by) { m.dmg.set(by, (m.dmg.get(by) || 0) + dmg); m.aggro = by; }
    if (m.state === 'idle' || m.state === 'return') m.state = 'chase';
    io.toMap(m.map, { t: 'mh', id: m.id, hp: Math.max(0, m.hp), maxHp: m.maxHp, dmg, crit: !!crit, col: col || null, by: by || null, dot: !!quiet });
    if (m.hp <= 0) kill(m);
  }
  function kill(m) {
    const d = m.def, temp = !!m.sp.temp, lv = d.lvl + Math.round((m.mult - 1) * 10);
    remove(m); if (!temp) m.sp.timer = d.respawn || (25000 + R() * 15000);
    const total = [...m.dmg.values()].reduce((a, b) => a + b, 0) || 1, xp = temp ? m.xp / 2 : m.xp;
    const ranked = [...m.dmg.entries()].sort((a, b) => b[1] - a[1]), top = ranked[0]?.[0] || null;
    const items = [];
    if (!temp) {
      const players = io.players(m.map), topP = players.find(p => p.id === top);
      for (const [id, ch, a, b] of d.loot) if (R() < ch) items.push(S.ITEMS[id].slot ? S.makeItem(id, S.rollRarity(lv, d.boss), lv) : { id, n: Math.max(1, Math.round(ri(a, b))) });
      const extra = d.boss ? 3 : (R() < (0.04 + lv * 0.006) ? 1 : 0);
      if (topP) S.player.cls = topP.cls || 'guerreiro';
      for (let i = 0; i < extra; i++) { const id = S.randomGearId(lv, S.monRegion(m.type)); if (id) items.push(S.makeItem(id, S.rollRarity(lv, d.boss), lv)); }
    }
    for (const [pid, dm] of ranked) { const share = dm / total; io.toPlayer(pid, { t: 'kill', id: m.id, type: m.type, boss: !!d.boss, temp, xp: Math.max(1, Math.round(xp * share)), top: pid === top, items: items.length ? items.map(i => (i.n > 1 ? i.n + ' ' : '') + (S.ITEMS[i.id]?.name || i.id)) : null }); }
    const c = { id: nextCorpse++, map: m.map, x: m.x, y: m.y, type: m.type, items, t: now, life: items.length ? 120000 : 15000 };
    corpses.set(c.id, c); io.toMap(m.map, { t: 'corpse', c });
  }

  // ---- mensagens dos jogadores
  function onHit(p, msg) { const m = mobs.get(msg.id); if (!m || m.map !== p.map || cheb(m, p) > 12) return; damage(m, msg.dmg, p.id, msg.crit, msg.col); }
  function onEffect(p, msg) { const m = mobs.get(msg.id); if (!m || m.map !== p.map || cheb(m, p) > 12) return; const v = msg.v;
    if (msg.k === 'slowT' || msg.k === 'rootT') { if (!(m.def.rooted)) m[msg.k] = Math.max(m[msg.k] || 0, Math.min(15000, +v || 0)); }
    else if (msg.k === 'cd' || msg.k === 'rcd') m[msg.k] = Math.max(m[msg.k] || 0, Math.min(15000, +v || 0));
    else if (msg.k === 'dot' && v && typeof v === 'object') m.dot = { dmg: Math.max(1, Math.min(5e5, v.dmg | 0)), ticks: Math.max(1, Math.min(20, v.ticks | 0)), t: 1000, col: typeof v.col === 'string' ? v.col.slice(0, 9) : null, by: p.id }; }
  function onKnock(p, msg) { const m = mobs.get(msg.id); if (!m || m.map !== p.map || m.def.boss || moving(m) || cheb(m, p) > 2) return;
    const dx = Math.sign(m.x - p.x), dy = Math.sign(m.y - p.y), nx = m.x + dx, ny = m.y + dy; if (passMon(MAPS[m.map], nx, ny) && !occupied(m.map, nx, ny, m)) step(m, nx, ny, 140); }
  function onLoot(p, msg) { const c = corpses.get(msg.cid); if (!c || c.map !== p.map || cheb(c, p) > 1) return null; const i = msg.i | 0; if (i < 0 || i >= c.items.length) return null;
    const it = c.items.splice(i, 1)[0]; io.toMap(c.map, { t: 'corpse', c }); return it; }
  function snapshot(map) { return { t: 'mobs', map, list: [...mobs.values()].filter(m => m.map === map).map(pub), corpses: [...corpses.values()].filter(c => c.map === map) }; }

  // ---- relógio: só os mapas com gente andam; o renascimento conta sempre
  function tick(dt) { now = Date.now();
    for (const sp of spawns) if (!sp.mob) { sp.timer -= dt; if (sp.timer <= 0) { const pl = io.players(sp.map); const near = pl.some(p => Math.abs(p.x - sp.x) + Math.abs(p.y - sp.y) <= 9);
      if (!near && !occupied(sp.map, sp.x, sp.y)) spawn(sp); else sp.timer = 3000; } }
    for (const [map, list0] of byMap) { const list = io.players(map); if (!list.length) continue; rebuild(map);
      for (const m of [...mobs.values()]) if (m.map === map) update(m, dt, list); }
    for (const m of [...mobs.values()]) if (!byMap.has(m.map) && io.players(m.map).length) update(m, dt, io.players(m.map));
    for (const c of [...corpses.values()]) if (now - c.t > c.life) { corpses.delete(c.id); io.toMap(c.map, { t: 'corpserm', id: c.id }); } }
  for (const sp of spawns) spawn(sp);
  return { tick, onHit, onEffect, onKnock, onLoot, snapshot, mobs, spawns, corpses, damage };
};
