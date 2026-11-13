"""Extrai do cliente online (mmo/client/game.html) o que o servidor online precisa: tiles, mapas, classes, itens e monstros.
Gera mmo/shared/world.js, que o servidor usa para conhecer os mesmos mapas do cliente.
Rode de novo sempre que os mapas do cliente mudarem (o servidor faz isso sozinho ao iniciar)."""
import re, os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src=open(os.path.join(ROOT,'mmo/client/game.html'),encoding='utf-8').read()
js=src[src.index('// ============================================================ básicos'):]
def sec(a,b):
    i=js.index('// ============================================================ '+a); j=js.index('// ============================================================ '+b,i); return js[i:j]
basic=sec('básicos','tiles')
basic='\n'.join(l for l in basic.split('\n') if not re.search(r"document|getContext|ctx\.|SAVE_KEY",l))
chk=js[js.index('// ---- escadas/buracos que fecham um corredor'):js.index('fixLinkChokes();')+len('fixLinkChokes();')]
dirs=re.search(r'const DIR4=.*?;\n',js).group(0)
parts=[basic, sec('tiles','mapas'), sec('mapas','classes'), dirs, chk]
out="""// GERADO por mmo/tools/extract.py a partir de src/game.html. Não edite à mão.
(function(root){
"""+'\n'.join(parts)+"""
const passPlayer=(m,x,y)=>!BLOCKS.has(tileAt(m,x,y));
const passMon=(m,x,y)=>{const t=tileAt(m,x,y); return !BLOCKS.has(t)&&!LINKS_T.has(t)&&!(m.town&&SAFE.has(t));};
const cornerBlocked=(m,x,y,dx,dy)=>dx&&dy&&BLOCKS.has(tileAt(m,x+dx,y))&&BLOCKS.has(tileAt(m,x,y+dy));
const W={T,MAPS,TOWN,BLOCKS,LINKS_T,SAFE,tileAt,passPlayer,passMon,cornerBlocked,mulberry32,hash2,cheb,DUNGEONS:typeof DUNGEONS!=='undefined'?DUNGEONS:null};
if(typeof module!=='undefined') module.exports=W; else root.BrumavalWorld=W;
})(typeof window!=='undefined'?window:globalThis);
"""
os.makedirs(os.path.join(ROOT,'mmo/shared'),exist_ok=True)
open(os.path.join(ROOT,'mmo/shared/world.js'),'w',encoding='utf-8').write(out)
print('mmo/shared/world.js', len(out)//1024, 'KB')
