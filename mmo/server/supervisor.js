// Liga o servidor do Brumaval Online e o mantém atualizado sozinho.
// A cada 3 minutos olha se o GitHub (matheuspiloti/brumaval, branch main) tem versão nova; se tiver,
// baixa, troca os arquivos (sem mexer em contas e personagens), avisa os jogadores e religa o servidor.
// O túnel (link público) não é reiniciado, então o link continua o mesmo.
'use strict';
const { spawn, execFileSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = 'matheuspiloti/brumaval', BRANCH = 'main';
const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const VERSION_FILE = path.join(DATA_DIR, 'version.txt');
const CHECK_MS = +process.env.UPDATE_EVERY_MS || 3 * 60 * 1000;
const say = (...a) => console.log(new Date().toLocaleTimeString('pt-BR'), '[atualizador]', ...a);

function get(url, asBuffer) { return new Promise((ok, fail) => {
  https.get(url, { headers: { 'User-Agent': 'brumaval-servidor', Accept: asBuffer ? '*/*' : 'application/vnd.github+json' } }, res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) { res.resume(); return get(res.headers.location, asBuffer).then(ok, fail); }
    if (res.statusCode !== 200) { res.resume(); return fail(new Error('HTTP ' + res.statusCode)); }
    const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => ok(asBuffer ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8')));
  }).on('error', fail).setTimeout(30000, function () { this.destroy(new Error('tempo esgotado')); }); }); }

let child = null, stopping = false, updating = false;
function start() {
  child = spawn(process.execPath, [path.join(__dirname, 'server.js')], { cwd: __dirname, stdio: ['inherit', 'inherit', 'inherit', 'ipc'], env: process.env });
  child.on('exit', code => { child = null; if (stopping) return; say('servidor parou (' + code + '). Ligando de novo...'); setTimeout(start, 1500); });
}
function stopChild() { return new Promise(res => { if (!child) return res(); const c = child; const t = setTimeout(() => { try { c.kill(); } catch (e) {} }, 8000);
  c.once('exit', () => { clearTimeout(t); res(); }); try { c.send('shutdown'); } catch (e) { c.kill(); } }); }

async function latestSha() { const j = JSON.parse(await get(`https://api.github.com/repos/${REPO}/commits/${BRANCH}`)); return j.sha; }
function localSha() { try { return fs.readFileSync(VERSION_FILE, 'utf8').trim(); } catch (e) { return null; } }

async function applyUpdate(sha) {
  if (fs.existsSync(path.join(ROOT, '.git'))) { // instalado com git (VPS)
    execFileSync('git', ['-C', ROOT, 'fetch', '-q', 'origin', BRANCH]); execFileSync('git', ['-C', ROOT, 'reset', '-q', '--hard', 'origin/' + BRANCH]);
  } else { // instalado pelo .zip (Windows): baixa o .zip e copia por cima, sem tocar em data/ e node_modules/
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'brumaval-')); const zip = path.join(tmp, 'b.zip');
    fs.writeFileSync(zip, await get(`https://codeload.github.com/${REPO}/zip/refs/heads/${BRANCH}`, true));
    execFileSync('tar', ['-xf', zip, '-C', tmp]);
    const top = fs.readdirSync(tmp).map(n => path.join(tmp, n)).find(p => fs.statSync(p).isDirectory());
    const skip = new Set([path.join(top, 'mmo', 'server', 'data'), path.join(top, 'mmo', 'server', 'node_modules')]);
    fs.cpSync(top, ROOT, { recursive: true, force: true, filter: src => ![...skip].some(s => src === s || src.startsWith(s + path.sep)) });
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  try { execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--omit=dev', '--no-audit', '--no-fund'], { cwd: __dirname, stdio: 'ignore', shell: process.platform === 'win32' }); } catch (e) { say('aviso: npm install falhou:', e.message); }
  fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(VERSION_FILE, sha);
}

async function check() {
  if (updating) return; updating = true;
  try {
    const sha = await latestSha(), have = localSha();
    if (!have) { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(VERSION_FILE, sha); say('versão atual:', sha.slice(0, 7)); }
    else if (sha !== have) {
      say('versão nova no GitHub:', sha.slice(0, 7), '(estava', have.slice(0, 7) + '). Atualizando...');
      try { child && child.send({ t: 'notice', text: 'O servidor vai atualizar agora. Você reconecta sozinho em alguns segundos.' }); } catch (e) {}
      await new Promise(r => setTimeout(r, 3000));
      await applyUpdate(sha);
      stopping = true; await stopChild(); stopping = false; start();
      say('atualizado para', sha.slice(0, 7) + '.');
    }
  } catch (e) { say('não consegui verificar atualizações agora:', e.message); }
  updating = false;
}

process.on('SIGINT', async () => { stopping = true; await stopChild(); process.exit(0); });
process.on('SIGTERM', async () => { stopping = true; await stopChild(); process.exit(0); });
start();
setTimeout(check, 15000); setInterval(check, CHECK_MS);
