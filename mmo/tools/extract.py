"""Extrai do cliente online (mmo/client/game.html) o que o servidor precisa para rodar o mundo:
mapas, classes, itens, raridade, monstros, posições de nascimento (setupWorld) e o A*.
Gera mmo/shared/sim.js, que o servidor executa num contexto isolado (vm) sem tela.
O servidor roda este script sozinho ao iniciar."""
import re, os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src=open(os.path.join(ROOT,'mmo/client/game.html'),encoding='utf-8').read()
js=src[src.index('// ============================================================ básicos'):]
H='// ============================================================ '
def sec(a,b):
    i=js.index(H+a); j=js.index(H+b,i); return js[i:j]
def fn(name):  # uma função de nível de topo inteira, pelo nome
    i=js.index('\nfunction '+name+'(')+1; depth=0; k=js.index('{',i)
    for p in range(k,len(js)):
        if js[p]=='{': depth+=1
        elif js[p]=='}':
            depth-=1
            if depth==0: return js[i:p+1]+'\n'
    raise Exception(name)
basic=sec('básicos','tiles')
estado=sec('estado','inventário')
parts=[basic, sec('tiles','mapas'), sec('mapas','classes'), sec('classes','itens'), sec('itens','raridade'), sec('raridade','ícones 32×32'),
       sec('ícones 32×32','monstros'), sec('monstros','estado'), estado, sec('mundo: entidades','A* (4 direções)'), sec('A* (4 direções)','movimento'),
       re.search(r"const REG_ITEMS=.*?\n",js).group(0), fn('randomGearId'), fn('roll'),
       js[js.index('// ---- escadas/buracos que fecham um corredor'):js.index('fixLinkChokes();')+len('fixLinkChokes();')]]
out="// GERADO por mmo/tools/extract.py a partir de mmo/client/game.html. Não edite à mão.\n"+'\n'.join(parts)+"""
;({T, MAPS, TOWN, MON, ITEMS, CLASSES, BLOCKS, LINKS_T, SAFE, TALL, tileAt, passPlayer:(m,x,y)=>!BLOCKS.has(tileAt(m,x,y)), passMon:(m,x,y)=>{const t=tileAt(m,x,y); return !BLOCKS.has(t)&&!LINKS_T.has(t)&&!(m.town&&SAFE.has(t));},
  cornerBlocked:(m,x,y,dx,dy)=>dx&&dy&&BLOCKS.has(tileAt(m,x+dx,y))&&BLOCKS.has(tileAt(m,x,y+dy)), findPath, los, cheb, setupWorld, get spawns(){ return spawns; }, get npcs(){ return npcs; },
  makeItem, rollRarity, randomGearId, monRegion, roll, player, mulberry32, hash2, R, ri})
"""
os.makedirs(os.path.join(ROOT,'mmo/shared'),exist_ok=True)
open(os.path.join(ROOT,'mmo/shared/sim.js'),'w',encoding='utf-8').write(out)
print('mmo/shared/sim.js', len(out)//1024, 'KB')
