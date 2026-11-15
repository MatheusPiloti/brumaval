// Mesma coisa que extract.py, em Node (não precisa de Python): extrai do cliente online (mmo/client/game.html)
// o que o servidor precisa para rodar o mundo e gera mmo/shared/sim.js. O servidor chama isto sozinho ao iniciar.
'use strict';
const fs = require('fs');
const path = require('path');

function extract(root) {
  root = root || path.resolve(__dirname, '..', '..');
  const src = fs.readFileSync(path.join(root, 'mmo/client/game.html'), 'utf8');
  const js = src.slice(src.indexOf('// ============================================================ básicos'));
  const H = '// ============================================================ ';
  const sec = (a, b) => { const i = js.indexOf(H + a); if (i < 0) throw new Error('seção ' + a); const j = js.indexOf(H + b, i); if (j < 0) throw new Error('seção ' + b); return js.slice(i, j); };
  const fn = name => { const i = js.indexOf('\nfunction ' + name + '(') + 1; if (i <= 0) throw new Error(name); let depth = 0; const k = js.indexOf('{', i);
    for (let p = k; p < js.length; p++) { if (js[p] === '{') depth++; else if (js[p] === '}') { depth--; if (depth === 0) return js.slice(i, p + 1) + '\n'; } } throw new Error(name); };
  const reg = js.match(/const REG_ITEMS=.*?\n/); if (!reg) throw new Error('REG_ITEMS');
  const a = js.indexOf('// ---- escadas/buracos que fecham um corredor'), b = js.indexOf('fixLinkChokes();') + 'fixLinkChokes();'.length;
  const parts = [sec('básicos', 'tiles'), sec('tiles', 'mapas'), sec('mapas', 'classes'), sec('classes', 'itens'), sec('itens', 'raridade'), sec('raridade', 'ícones 32×32'),
    sec('ícones 32×32', 'monstros'), sec('monstros', 'estado'), sec('estado', 'inventário'), sec('mundo: entidades', 'A* (4 direções)'), sec('A* (4 direções)', 'movimento'),
    reg[0], fn('randomGearId'), fn('roll'), js.slice(a, b)];
  const out = '// GERADO por mmo/tools/extract.py a partir de mmo/client/game.html. Não edite à mão.\n' + parts.join('\n') + `
;({T, MAPS, TOWN, MON, ITEMS, CLASSES, BLOCKS, LINKS_T, SAFE, TALL, tileAt, passPlayer:(m,x,y)=>!BLOCKS.has(tileAt(m,x,y)), passMon:(m,x,y)=>{const t=tileAt(m,x,y); return !BLOCKS.has(t)&&!LINKS_T.has(t)&&!(m.town&&SAFE.has(t));},
  cornerBlocked:(m,x,y,dx,dy)=>dx&&dy&&BLOCKS.has(tileAt(m,x+dx,y))&&BLOCKS.has(tileAt(m,x,y+dy)), findPath, los, cheb, setupWorld, get spawns(){ return spawns; }, get npcs(){ return npcs; },
  makeItem, rollRarity, randomGearId, monRegion, roll, player, mulberry32, hash2, R, ri})
`;
  fs.mkdirSync(path.join(root, 'mmo/shared'), { recursive: true });
  fs.writeFileSync(path.join(root, 'mmo/shared/sim.js'), out, 'utf8');
  return out.length;
}
module.exports = extract;
if (require.main === module) console.log('mmo/shared/sim.js', Math.round(extract(process.argv[2]) / 1024), 'KB');
