// Servidor do Brumaval online (etapa 1: mundo compartilhado).
// Cuida de contas, personagens, posição de todos, movimento validado, escadas, barcos e chat.
// O navegador só pede ações ("andar para a direita", "falar") e mostra o que o servidor manda.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { WebSocketServer } = require('ws');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const ADMINS = new Set((process.env.ADMIN_USERS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
const MAX_CHARS = 5;
// ADM: os usuários de ADMIN_USERS; se essa lista estiver vazia, a primeira conta criada no servidor vira ADM.
const isAdm = acc => ADMINS.has(acc) || !!(db.accounts[acc] && db.accounts[acc].adm);
const TICK = 50;

// ---------------------------------------------------------------- mundo (mesmos mapas do cliente)
try { execFileSync('python3', [path.join(ROOT, 'mmo/tools/extract.py')], { stdio: 'ignore' }); } catch (e) { console.warn('Aviso: não consegui regenerar shared/world.js (python3). Usando o arquivo existente.'); }
const W = require('../shared/world.js');
const { MAPS, TOWN, tileAt, passPlayer, cornerBlocked, cheb } = W;
const TOWNS = ['over', 'ash', 'fae', 'ice', 'sea'];
const BOAT_LVL = { over: 0, fae: 25, ash: 50, ice: 70, sea: 90 };
const CLASSES = ['guerreiro', 'cacador', 'feiticeiro', 'xama', 'monge'];
const townRect = id => id === 'over' ? TOWN : MAPS[id] && MAPS[id].townRect;
function inTown(id, x, y) { const r = townRect(id); return !!(r && x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1); }
const stepDur = lvl => Math.max(140, 250 - lvl * 3);

// ---------------------------------------------------------------- dados (arquivos JSON gravados com segurança)
fs.mkdirSync(DATA_DIR, { recursive: true });
function loadJson(name, def) { try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8')); } catch (e) { return def; } }
const db = { accounts: loadJson('accounts.json', {}), chars: loadJson('characters.json', {}) };
let dirty = false;
function flush() {
  if (!dirty) return; dirty = false;
  for (const [name, obj] of [['accounts.json', db.accounts], ['characters.json', db.chars]]) {
    const f = path.join(DATA_DIR, name), tmp = f + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(obj)); fs.renameSync(tmp, f);
  }
}
setInterval(flush, 3000);
const markDirty = () => { dirty = true; };

function hashPass(pass, salt) { return crypto.scryptSync(pass, salt, 64).toString('hex'); }
const norm = s => String(s || '').trim().toLowerCase();
const cleanText = (s, n) => String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, n);
const validUser = u => /^[a-z0-9_]{3,20}$/.test(u);
const validName = n => /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ']{2,15}$/.test(n) && !/  /.test(n);

// ---------------------------------------------------------------- estado em memória
const sessions = new Map();   // token -> conta
const online = new Map();     // id do personagem -> jogador no mundo
let nextConn = 1;

function charList(acc) { return Object.values(db.chars).filter(c => c.owner === acc).map(c => ({ id: c.id, name: c.name, cls: c.cls, level: c.level, map: c.map, online: online.has(c.id) })); }
function pub(p) { return { id: p.id, name: p.name, cls: p.cls, level: p.level, x: p.x, y: p.y, dir: p.dir, map: p.map, adm: p.adm || undefined }; }
function send(ws, msg) { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); }
function toMap(map, msg, except) { const s = JSON.stringify(msg); for (const p of online.values()) if (p.map === map && p !== except && p.ws.readyState === 1) p.ws.send(s); }
function toAll(msg) { const s = JSON.stringify(msg); for (const p of online.values()) if (p.ws.readyState === 1) p.ws.send(s); }
function blockedByPlayer(map, x, y, self) {
  if (inTown(map, x, y)) return false; // dentro da cidade dá para passar por outros jogadores
  for (const p of online.values()) if (p !== self && p.map === map && p.x === x && p.y === y) return true;
  return false;
}
function freeNear(map, x, y, self) {
  const M = MAPS[map];
  for (let r = 0; r < 6; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue; const a = x + dx, b = y + dy;
    if (passPlayer(M, a, b) && !M.links[b * M.W + a] && !blockedByPlayer(map, a, b, self)) return { x: a, y: b };
  }
  return { x, y };
}
function saveChar(p) { const c = db.chars[p.id]; if (!c) return; Object.assign(c, { map: p.map, x: p.x, y: p.y, dir: p.dir, level: p.level, lastSeen: Date.now() }); markDirty(); }

function warp(p, map, x, y, text) {
  const from = p.map; const spot = freeNear(map, x, y, p);
  toMap(from, { t: 'leave', id: p.id }, p);
  p.map = map; p.x = spot.x; p.y = spot.y; p.queue.length = 0; p.next = Date.now() + 300;
  send(p.ws, { t: 'warp', map, x: p.x, y: p.y, text: text || null, others: [...online.values()].filter(o => o !== p && o.map === map).map(pub) });
  toMap(map, { t: 'join', p: pub(p) }, p); saveChar(p);
}

// ---------------------------------------------------------------- movimento (com fila curta para esconder a latência)
function tryStep(p, dx, dy, seq) {
  dx = Math.sign(dx | 0); dy = Math.sign(dy | 0); if (!dx && !dy) return;
  const M = MAPS[p.map], nx = p.x + dx, ny = p.y + dy;
  p.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
  if (!passPlayer(M, nx, ny) || cornerBlocked(M, p.x, p.y, dx, dy) || blockedByPlayer(p.map, nx, ny, p)) {
    send(p.ws, { t: 'fix', x: p.x, y: p.y, map: p.map, seq }); return;
  }
  const dur = Math.round(p.step * (dx && dy ? 1.4 : 1));
  p.x = nx; p.y = ny; p.next = Date.now() + dur - 25;
  toMap(p.map, { t: 'mv', id: p.id, x: nx, y: ny, dir: p.dir, dur }, p);
  send(p.ws, { t: 'ack', seq, x: nx, y: ny });
  p.moved = true;
  const link = M.links[ny * M.W + nx];
  if (link) setTimeout(() => { if (online.get(p.id) === p && p.x === nx && p.y === ny && p.map === M.id) warp(p, link.map, link.x, link.y); }, dur);
}
setInterval(() => {
  const now = Date.now();
  for (const p of online.values()) {
    if (p.queue.length && now >= p.next) { const s = p.queue.shift(); tryStep(p, s.dx, s.dy, s.seq); }
    if (p.moved && now - (p.savedAt || 0) > 5000) { p.moved = false; p.savedAt = now; saveChar(p); }
  }
}, TICK);

// ---------------------------------------------------------------- chat e comandos
function chat(p, text, ch) {
  text = cleanText(text, 200); if (!text) return;
  const now = Date.now(); p.chatT = Math.max(p.chatT || 0, now - 2100);
  if (p.chatT > now) { send(p.ws, { t: 'sys', text: 'Calma: espere um pouco antes de mandar outra mensagem.' }); return; }
  p.chatT += 700;
  if (text[0] === '/') return command(p, text);
  const msg = { t: 'chat', ch, id: p.id, from: p.name, level: p.level, text };
  if (ch === 'mundo') { if (p.level < 5 && !p.adm) { send(p.ws, { t: 'sys', text: 'O canal Mundo libera no nível 5. Use o canal Local.' }); return; } toAll(msg); }
  else { for (const o of online.values()) if (o.map === p.map && cheb(o, p) <= 9) send(o.ws, msg); }
}
function command(p, text) {
  const [cmd, ...a] = text.slice(1).split(/\s+/); const c = cmd.toLowerCase();
  const reply = t => send(p.ws, { t: 'sys', text: t });
  if (c === 'quem' || c === 'online') return reply('Online (' + online.size + '): ' + [...online.values()].map(o => o.name + ' (' + o.level + ')').join(', '));
  if (!p.adm) return reply('Comando desconhecido. Comandos: /quem');
  if (c === 'nivel') { const n = Math.max(1, Math.min(500, a[0] | 0)); p.level = n; p.step = stepDur(n); saveChar(p); send(p.ws, { t: 'you', level: n, step: p.step }); toMap(p.map, { t: 'lvl', id: p.id, level: n }, p); return reply('Nível ajustado para ' + n + '.'); }
  if (c === 'ir') { const id = a[0]; const M = MAPS[id]; if (!M) return reply('Mapa não existe. Exemplos: over, ash, fae, ice, sea, cave.'); const x = a[1] != null ? a[1] | 0 : (M.spawn || M.dock || { x: M.W >> 1 }).x, y = a[2] != null ? a[2] | 0 : (M.spawn || M.dock || { y: M.H >> 1 }).y; return warp(p, id, x, y, 'Você foi para ' + (M.name || id) + '.'); }
  if (c === 'trazer') { const nm = norm(a.join(' ')); const o = [...online.values()].find(o => norm(o.name) === nm); if (!o) return reply('Ninguém com esse nome online.'); return warp(o, p.map, p.x, p.y, 'Um administrador puxou você.'); }
  if (c === 'aviso') { const t = cleanText(a.join(' '), 200); if (t) toAll({ t: 'sys', text: 'Aviso: ' + t, big: true }); return; }
  reply('Comandos de ADM: /nivel N · /ir mapa [x y] · /trazer nome · /aviso texto · /quem');
}

// ---------------------------------------------------------------- conexões
function enterWorld(conn, id) {
  const c = db.chars[id]; if (!c || c.owner !== conn.acc) return send(conn.ws, { t: 'err', text: 'Personagem não encontrado.' });
  for (const o of online.values()) if (o.owner === conn.acc) { send(o.ws, { t: 'kicked', text: 'Sua conta entrou em outro lugar.' }); leaveWorld(o); try { o.ws.close(); } catch (e) {} }
  if (!MAPS[c.map]) { c.map = 'over'; c.x = MAPS.over.spawn.x; c.y = MAPS.over.spawn.y; }
  const p = { id: c.id, owner: conn.acc, name: c.name, cls: c.cls, level: c.level || 1, map: c.map, x: c.x, y: c.y, dir: c.dir || 'down', ws: conn.ws, queue: [], next: 0, adm: isAdm(conn.acc) };
  p.step = stepDur(p.level); const s = freeNear(p.map, p.x, p.y, p); p.x = s.x; p.y = s.y;
  online.set(p.id, p); conn.player = p;
  send(conn.ws, { t: 'enter', you: { ...pub(p), step: p.step }, others: [...online.values()].filter(o => o !== p && o.map === p.map).map(pub), online: online.size });
  toMap(p.map, { t: 'join', p: pub(p) }, p);
  toAll({ t: 'count', online: online.size });
  console.log(new Date().toISOString(), 'entrou', p.name, '(' + conn.acc + ')', 'online:', online.size);
}
function leaveWorld(p) {
  if (!p || online.get(p.id) !== p) return;
  saveChar(p); online.delete(p.id); toMap(p.map, { t: 'leave', id: p.id }); toAll({ t: 'count', online: online.size });
  console.log(new Date().toISOString(), 'saiu', p.name, 'online:', online.size);
}
function onMessage(conn, m) {
  const ws = conn.ws, p = conn.player;
  switch (m.t) {
    case 'register': {
      const u = norm(m.user), pw = String(m.pass || '');
      if (!validUser(u)) return send(ws, { t: 'autherr', text: 'Usuário: 3 a 20 letras minúsculas, números ou _.' });
      if (pw.length < 6 || pw.length > 100) return send(ws, { t: 'autherr', text: 'A senha precisa ter pelo menos 6 caracteres.' });
      if (db.accounts[u]) return send(ws, { t: 'autherr', text: 'Esse usuário já existe.' });
      const salt = crypto.randomBytes(16).toString('hex'), first = !ADMINS.size && !Object.values(db.accounts).some(x => x.adm);
      db.accounts[u] = { salt, hash: hashPass(pw, salt), created: Date.now(), adm: first || undefined }; markDirty(); if (first) console.log('Primeira conta do servidor virou ADM:', u);
      return login(conn, u);
    }
    case 'login': {
      const u = norm(m.user), a = db.accounts[u];
      if (!a || !crypto.timingSafeEqual(Buffer.from(a.hash, 'hex'), Buffer.from(hashPass(String(m.pass || ''), a.salt), 'hex'))) return send(ws, { t: 'autherr', text: 'Usuário ou senha incorretos.' });
      return login(conn, u);
    }
    case 'resume': { const acc = sessions.get(String(m.token || '')); if (!acc) return send(ws, { t: 'autherr', text: 'Sessão expirada. Entre de novo.', expired: true }); conn.acc = acc; conn.token = m.token; send(ws, { t: 'auth', user: acc, token: m.token, chars: charList(acc), adm: isAdm(acc) }); if (m.char && db.chars[m.char]?.owner === acc) enterWorld(conn, m.char); return; }
  }
  if (!conn.acc) return send(ws, { t: 'autherr', text: 'Entre na sua conta primeiro.' });
  switch (m.t) {
    case 'create': {
      const name = cleanText(m.name, 16).replace(/\s+/g, ' '), cls = String(m.cls || '');
      if (!validName(name)) return send(ws, { t: 'err', text: 'Nome: 3 a 16 letras (pode ter espaço).' });
      if (!CLASSES.includes(cls)) return send(ws, { t: 'err', text: 'Classe inválida.' });
      if (charList(conn.acc).length >= MAX_CHARS) return send(ws, { t: 'err', text: 'Limite de ' + MAX_CHARS + ' personagens por conta.' });
      if (Object.values(db.chars).some(c => norm(c.name) === norm(name))) return send(ws, { t: 'err', text: 'Já existe um personagem com esse nome.' });
      const id = 'c' + crypto.randomBytes(6).toString('hex'), s = MAPS.over.spawn;
      db.chars[id] = { id, owner: conn.acc, name, cls, level: 1, map: 'over', x: s.x, y: s.y, dir: 'down', created: Date.now() }; markDirty();
      send(ws, { t: 'chars', chars: charList(conn.acc) }); return enterWorld(conn, id);
    }
    case 'delete': { const c = db.chars[m.id]; if (c && c.owner === conn.acc && !online.has(c.id)) { delete db.chars[m.id]; markDirty(); } return send(ws, { t: 'chars', chars: charList(conn.acc) }); }
    case 'play': return enterWorld(conn, String(m.id || ''));
    case 'logout': leaveWorld(p); conn.player = null; return send(ws, { t: 'chars', chars: charList(conn.acc) });
  }
  if (!p) return;
  switch (m.t) {
    case 'step': if (p.queue.length < 3) p.queue.push({ dx: m.dx, dy: m.dy, seq: m.seq | 0 }); else send(ws, { t: 'fix', x: p.x, y: p.y, map: p.map, seq: m.seq | 0 }); return;
    case 'stop': p.queue.length = 0; return;
    case 'turn': if (['up', 'down', 'left', 'right'].includes(m.dir)) { p.dir = m.dir; toMap(p.map, { t: 'turn', id: p.id, dir: p.dir }, p); } return;
    case 'say': return chat(p, m.text, m.ch === 'mundo' ? 'mundo' : 'local');
    case 'travel': {
      const to = String(m.to || ''), M = MAPS[p.map];
      if (!TOWNS.includes(to) || to === p.map || !M.boatman || cheb(p, M.boatman) > 3) return send(ws, { t: 'sys', text: 'Fale com o barqueiro no porto para viajar.' });
      if (p.level < BOAT_LVL[to]) return send(ws, { t: 'sys', text: 'Você precisa do nível ' + BOAT_LVL[to] + ' para essa viagem.' });
      const D = MAPS[to]; return warp(p, to, D.dock.x, D.dock.y, D.enter || ('Você chega a ' + D.name + '.'));
    }
    case 'ping': return send(ws, { t: 'pong', at: m.at });
  }
}
function login(conn, acc) {
  const token = crypto.randomBytes(24).toString('hex'); sessions.set(token, acc); conn.acc = acc; conn.token = token;
  send(conn.ws, { t: 'auth', user: acc, token, chars: charList(acc), adm: isAdm(acc) });
}

// ---------------------------------------------------------------- HTTP: entrega a página do jogo e aceita a conexão em tempo real
function page() {
  const game = fs.readFileSync(path.join(ROOT, 'mmo/client/game.html'), 'utf8');
  return `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#13100d">\n<title>Brumaval Online</title>\n<script>window.BRUMAVAL_CONFIG={};window.BRUMAVAL_ONLINE={server:''};</script>\n${game}\n</html>\n`;
}
let pageCache = null;
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') {
    if (!pageCache || process.env.DEV) pageCache = page();
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache', 'x-content-type-options': 'nosniff' }); return res.end(pageCache);
  }
  if (url === '/health') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true, online: online.size })); }
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Não encontrado');
});
const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 4096 });
const perIp = new Map();
wss.on('connection', (ws, req) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const n = (perIp.get(ip) || 0) + 1; if (n > 8) { ws.close(1013, 'muitas conexões'); return; } perIp.set(ip, n);
  const conn = { id: nextConn++, ws, acc: null, player: null, msgs: 0, win: Date.now() };
  ws.on('message', raw => {
    const now = Date.now(); if (now - conn.win > 1000) { conn.win = now; conn.msgs = 0; } if (++conn.msgs > 40) return;
    let m; try { m = JSON.parse(raw); } catch (e) { return; } if (!m || typeof m.t !== 'string') return;
    try { onMessage(conn, m); } catch (e) { console.error('erro na mensagem', m.t, e); }
  });
  ws.on('close', () => { leaveWorld(conn.player); perIp.set(ip, (perIp.get(ip) || 1) - 1); });
  ws.isAlive = true; ws.on('pong', () => { ws.isAlive = true; });
});
setInterval(() => { for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; ws.ping(); } }, 30000);
function shutdown() { for (const p of online.values()) saveChar(p); dirty = true; flush(); process.exit(0); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
server.listen(PORT, HOST, () => console.log(`Brumaval online em http://${HOST}:${PORT} · ${Object.keys(MAPS).length} mapas · dados em ${DATA_DIR}${ADMINS.size ? ' · ADM: ' + [...ADMINS].join(', ') : ''}`));
