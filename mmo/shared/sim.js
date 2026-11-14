// GERADO por mmo/tools/extract.py a partir de mmo/client/game.html. Não edite à mão.
// ============================================================ básicos
const T = 32; let VW = 17, VH = 13;
const $ = id => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const SAVE_KEY = 'brumaval-save-v1';
const ONLINE = true; // cliente do Brumaval Online
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R = Math.random;
const ri = (a,b) => a + Math.floor(R()*(b-a+1));
const clamp = (v,a,b) => v<a?a:v>b?b:v;
const cheb = (a,b) => Math.max(Math.abs(a.x-b.x), Math.abs(a.y-b.y));
const hash2 = (x,y) => { let h = (x*374761393 + y*668265263) | 0; h = (h ^ (h>>>13)) * 1274126177; return (h ^ (h>>>16)) >>> 0; };


// ============================================================ tiles
const G=0,PATH=1,WATER=2,TREE=3,STONE=4,WALL=5,SAND=6,SWAMP=7,CAVE=8,CWALL=9,DOWN=10,UP=11,WOOD=12,BUSH=13,ROCK=14,FLOW=15,BRIDGE=16,DOOR=17,PINE=18,BONES=19;
const BLOCKS = new Set([WATER,TREE,WALL,CWALL,BUSH,ROCK,PINE]);
const TALL = new Set([TREE,WALL,CWALL,BUSH,ROCK,PINE]);
const BASE_OF = {[TREE]:G,[PINE]:G,[BUSH]:G,[ROCK]:G,[WALL]:STONE,[CWALL]:CAVE};
const SAFE = new Set([STONE,WOOD,DOOR]);
const MINI = {[G]:'#4d7a36',[FLOW]:'#4d7a36',[PATH]:'#a0805a',[WATER]:'#2b5a86',[TREE]:'#2c5a26',[PINE]:'#22462a',[STONE]:'#8a8478',[WALL]:'#c9bfa8',[SAND]:'#c9ad74',[SWAMP]:'#45532f',[CAVE]:'#5a4e44',[CWALL]:'#1b1612',[DOWN]:'#ffd54a',[UP]:'#ffd54a',[WOOD]:'#7a5634',[BUSH]:'#3a6a30',[ROCK]:'#7d7a72',[BRIDGE]:'#8a6a42',[DOOR]:'#7a5634',[BONES]:'#5a4e44'};

const CFL=20,CWL=21,CARPET=22,DIRT=23,RWALL=24,SHROOM=25,WEBF=26,NWALL=27,EGGS=28,SUP=29,SDOWN=30,GATE=31,HOLE=32,NHOLE=33;
for(const t of [CWL,RWALL,NWALL]){ BLOCKS.add(t); TALL.add(t); }
Object.assign(BASE_OF,{[CWL]:CFL,[RWALL]:DIRT,[NWALL]:WEBF});
Object.assign(MINI,{[CFL]:'#4a4744',[CWL]:'#24211e',[CARPET]:'#6a1a1a',[DIRT]:'#3a2a1c',[RWALL]:'#160e08',[SHROOM]:'#3a6a5a',[WEBF]:'#3a3632',[NWALL]:'#161412',[EGGS]:'#8a8478',[SUP]:'#ffd54a',[SDOWN]:'#ffd54a',[GATE]:'#ffd54a',[HOLE]:'#ffd54a',[NHOLE]:'#ffd54a'});
const ROOF = {[CWL]:['#58524a','#4a453e'],[RWALL]:['#3e2a1a','#4e3622'],[NWALL]:['#3c3832','#8a857a']};
const ASH=34,CRACK=35,LAVA=36,ASHPATH=37,BASALT=38,ENTR=39,BOAT=40,OBS=41,DTREE=42,BWALL=43,MWALL=44,EMBER=45;
for(const t of [LAVA,BOAT,OBS,DTREE,BWALL,MWALL]) BLOCKS.add(t);
for(const t of [OBS,DTREE,BWALL,MWALL]) TALL.add(t);
Object.assign(BASE_OF,{[OBS]:ASH,[DTREE]:ASH,[BWALL]:BASALT,[MWALL]:CRACK});
Object.assign(ROOF,{[BWALL]:['#2e2826','#3e3430'],[MWALL]:['#2a1e18','#7a3416']});
SAFE.add(BASALT);
Object.assign(MINI,{[ASH]:'#5a4a40',[CRACK]:'#5a3a2a',[LAVA]:'#e0501a',[ASHPATH]:'#7a6e66',[BASALT]:'#3a3434',[ENTR]:'#ffd54a',[BOAT]:'#7a5634',[OBS]:'#1a1418',[DTREE]:'#2a1e18',[BWALL]:'#141110',[MWALL]:'#120c08',[EMBER]:'#8a3a1a'});
const MOSS=46,FFLOW=47,FSTONE=48,FSHROOM=49,ROTF=50,GTREE=51,HEDGE=52,CRYST=53,CRYW=54,LOGW=55,RING=56;
for(const t of [GTREE,HEDGE,CRYST,CRYW,LOGW]){ BLOCKS.add(t); TALL.add(t); }
Object.assign(BASE_OF,{[GTREE]:MOSS,[HEDGE]:FSTONE,[CRYST]:MOSS,[CRYW]:MOSS,[LOGW]:WOOD});
Object.assign(ROOF,{[GTREE]:['#1f4a22','#2c6a2e'],[HEDGE]:['#2e6a32','#3e8a42'],[CRYW]:['#2e2e4a','#7ac8e0'],[LOGW]:['#3e7a3a','#2e6a32']});
SAFE.add(FSTONE);
Object.assign(MINI,{[MOSS]:'#3f7a3a',[FFLOW]:'#4a8a52',[FSTONE]:'#6a7068',[FSHROOM]:'#4a7a6a',[ROTF]:'#3a2e40',[GTREE]:'#1a3e1e',[HEDGE]:'#24502a',[CRYST]:'#9ae0ff',[CRYW]:'#22223a',[LOGW]:'#4a3018',[RING]:'#ffd54a'});
// ---- Invernália (gelo) e Coralina (fundo do mar)
const SNOW=57,SNOWP=58,IPINE=59,IWALL=60,ICEF=61,DRIFT=62,SANDF=63,CORAL=64,KELP=65,REEFW=66,NACRE=67,BUBBLE=68,ABYSS=69,HULL=70,IENT=71,SENT=72;
for(const t of [IPINE,IWALL,CORAL,REEFW,HULL]){ BLOCKS.add(t); TALL.add(t); }
Object.assign(BASE_OF,{[IPINE]:SNOW,[IWALL]:ICEF,[CORAL]:SANDF,[REEFW]:ABYSS,[HULL]:WOOD});
Object.assign(ROOF,{[IWALL]:['#a8c8e0','#d8ecf8'],[REEFW]:['#2a3a4a','#3a5a6a'],[HULL]:['#3a2614','#5a3a1c']});
SAFE.add(NACRE);
Object.assign(MINI,{[SNOW]:'#d8e4ec',[SNOWP]:'#b0a490',[IPINE]:'#2a4a3a',[IWALL]:'#6a8aa8',[ICEF]:'#a8d0e8',[DRIFT]:'#e8f0f8',[SANDF]:'#b8a878',[CORAL]:'#c0506a',[KELP]:'#4a7a5a',[REEFW]:'#1a2a36',[NACRE]:'#d8d0e0',[BUBBLE]:'#9ae0ff',[ABYSS]:'#2a3440',[HULL]:'#3a2614',[IENT]:'#ffd54a',[SENT]:'#ffd54a'});
const LINKS_T = new Set([DOWN,UP,SUP,SDOWN,GATE,HOLE,NHOLE,ENTR,RING,IENT,SENT]);
function makeNoise(W,H,cell,rng){
  const gw=Math.ceil(W/cell)+2, gh=Math.ceil(H/cell)+2, g=new Float32Array(gw*gh);
  for(let i=0;i<g.length;i++) g[i]=rng();
  const sm=t=>t*t*(3-2*t);
  return (x,y)=>{const fx=x/cell,fy=y/cell,ix=Math.floor(fx),iy=Math.floor(fy),tx=sm(fx-ix),ty=sm(fy-iy);
    const a=g[iy*gw+ix],b=g[iy*gw+ix+1],c=g[(iy+1)*gw+ix],d=g[(iy+1)*gw+ix+1];
    return a+(b-a)*tx+(c-a)*ty+(a-b-c+d)*tx*ty;};
}


// ============================================================ mapas
const TOWN = {cx:42, cy:32, x0:34, x1:50, y0:25, y1:39};
function genOverworld(){
  const W=84,H=64,rng=mulberry32(20240611),t=new Uint8Array(W*H);
  const inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const set=(x,y,v)=>{if(inb(x,y))t[y*W+x]=v}, get=(x,y)=>t[y*W+x];
  const n1=makeNoise(W,H,6,rng), n2=makeNoise(W,H,5,rng), n3=makeNoise(W,H,4,rng);
  const {cx:CX,cy:CY}=TOWN;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    let v = rng()<0.07?FLOW:G;
    const north=y<CY-12, south=y>CY+11, west=x<CX-16;
    if(north){ if(n1(x,y)>0.42) v=rng()<0.55?PINE:TREE; else if(rng()<0.05) v=BUSH; }
    else if(south){ const s=n2(x,y); if(s>0.42) v=SWAMP; if(s>0.7) v=WATER; else if(rng()<0.05) v=BUSH; else if(v!==SWAMP&&rng()<0.04) v=TREE; }
    else if(west){ if(n3(x,y)>0.6) v=ROCK; else if(rng()<0.03) v=ROCK; else if(rng()<0.03) v=TREE; }
    else { if(n1(x,y)>0.78) v=TREE; else if(rng()<0.025) v=BUSH; }
    if(x<2||y<2||x>=W-2||y>=H-2) v = north?PINE: south?WATER: west?ROCK: TREE;
    t[y*W+x]=v;
  }
  // lago a nordeste
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const dx=(x-68)/7, dy=(y-13)/5, d=dx*dx+dy*dy;
    if(d<1) set(x,y,WATER); else if(d<1.6 && !BLOCKS.has(get(x,y))) set(x,y,SAND);
  }
  // cidade de Pedraluz
  const {x0:X0,x1:X1,y0:Y0,y1:Y1}=TOWN;
  for(let y=Y0-3;y<=Y1+3;y++) for(let x=X0-3;x<=X1+3;x++) set(x,y, rng()<0.08?FLOW:G);
  for(let y=Y0;y<=Y1;y++) for(let x=X0;x<=X1;x++) set(x,y,(x===X0||x===X1||y===Y0||y===Y1)?WALL:STONE);
  for(let d=-1;d<=1;d++){ set(CX+d,Y0,STONE); set(CX+d,Y1,STONE); set(X0,CY+d,STONE); set(X1,CY+d,STONE); }
  const building=(a,b,c,d,dx,dy)=>{for(let y=b;y<=d;y++)for(let x=a;x<=c;x++)set(x,y,(x===a||x===c||y===b||y===d)?WALL:WOOD);set(dx,dy,DOOR);};
  building(X0+1,Y0+1,X0+7,Y0+6, X0+4,Y0+6);   // templo
  building(X1-7,Y0+1,X1-1,Y0+6, X1-4,Y0+6);   // loja
  set(CX+3,CY+3,WATER); set(CX+4,CY+3,WATER); set(CX+3,CY+4,WATER); set(CX+4,CY+4,WATER); // chafariz
  // caminhos
  const carve=(x,y,x1,y1)=>{ for(let i=0;i<500&&(x!==x1||y!==y1);i++){
      if(x!==x1&&(y===y1||rng()<0.5)) x+=Math.sign(x1-x); else y+=Math.sign(y1-y);
      const c=get(x,y); if(SAFE.has(c)||c===WALL||c===CWL||LINKS_T.has(c)) continue; set(x,y,c===WATER?BRIDGE:PATH); } };
  carve(CX,Y0,CX-4,5); carve(CX,Y1,CX+3,H-5); carve(X1,CY,W-5,CY+2); carve(X0,CY,6,CY);
  // entrada da cripta
  const DX=10, DY=10;
  for(let y=DY-3;y<=DY+3;y++) for(let x=DX-3;x<=DX+3;x++){
    const edge = Math.abs(x-DX)===3||Math.abs(y-DY)===3;
    set(x,y, edge && !(y===DY+3 && Math.abs(x-DX)<=1) ? ROCK : G);
  }
  carve(16,CY,DX,DY+4); set(DX,DY+3,PATH); set(DX,DY+2,PATH); set(DX,DY+1,PATH); set(DX,DY,DOWN);
  // castelo abandonado (colinas a oeste)
  for(let y=15;y<=28;y++) for(let x=2;x<=12;x++) set(x,y, rng()<0.07?ROCK:G);
  for(let y=18;y<=25;y++) for(let x=2;x<=9;x++) set(x,y,CWL);
  for(const [x,y] of [[10,18],[10,19],[10,24],[10,25],[2,17],[3,17],[8,17],[9,17]]) set(x,y,CWL);
  const GX=5, GY=25; set(GX,GY,GATE); set(GX,GY+1,PATH); carve(GX,GY+1,X0-1,CY);
  // toca sob a árvore velha (bosque ao norte)
  const HX=28, HY=8;
  for(let y=HY-3;y<=HY+3;y++) for(let x=HX-3;x<=HX+3;x++) set(x,y,G);
  for(const [dx,dy] of [[-1,-2],[0,-2],[1,-2],[-2,-1],[2,-1],[-1,-1],[1,-1],[0,-1]]) set(HX+dx,HY+dy,TREE);
  set(HX,HY,HOLE); set(HX,HY+1,PATH); carve(HX,HY+1,CX,Y0-1);
  // ninho no pântano (sul)
  const NX=62, NY=55;
  for(let y=NY-3;y<=NY+3;y++) for(let x=NX-3;x<=NX+3;x++) set(x,y, rng()<0.5?SWAMP:G);
  for(const [dx,dy] of [[-2,-2],[2,-2],[-3,0],[3,0],[-2,2],[2,2]]) set(NX+dx,NY+dy,BUSH);
  set(NX,NY,NHOLE); set(NX,NY-1,PATH); carve(NX,NY-1,CX,Y1+1);
  // flood fill: tudo que não conecta vira árvore
  const seen=new Uint8Array(W*H), st=[CY*W+CX]; seen[st[0]]=1;
  while(st.length){const i=st.pop(),x=i%W,y=(i/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!inb(nx,ny))continue;const j=ny*W+nx;if(seen[j]||BLOCKS.has(t[j]))continue;seen[j]=1;st.push(j);}}
  for(let i=0;i<W*H;i++) if(!seen[i]&&!BLOCKS.has(t[i])) t[i]= t[i]===SWAMP?WATER:TREE;
  return {id:'over', name:'Brumaval', W,H,t, dark:false, links:{[DY*W+DX]:{map:'cave',x:6,y:7}}, spawn:{x:TOWN.x0+4,y:TOWN.y0+3}, castleGate:{x:GX,y:GY}, hole:{x:HX,y:HY}, nestHole:{x:NX,y:NY}};
}
function genCave(){
  const W=60,H=46,rng=mulberry32(7771);let t=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++) t[i]=rng()<0.45?CWALL:CAVE;
  const idx=(x,y)=>y*W+x;
  for(let it=0;it<5;it++){const n=new Uint8Array(W*H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||t[idx(nx,ny)]===CWALL)c++;}
      n[idx(x,y)]=(c>=5||x<1||y<1||x>=W-1||y>=H-1)?CWALL:CAVE;}
    t=n;}
  for(let y=3;y<=9;y++)for(let x=3;x<=9;x++)t[idx(x,y)]=CAVE;
  // conecta: BFS a partir da escada, mantém só a região alcançável
  const dist=new Int32Array(W*H).fill(-1), q=[idx(6,6)]; dist[q[0]]=0;
  for(let h=0;h<q.length;h++){const i=q[h],x=i%W,y=(i/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=idx(x+dx,y+dy);if(x+dx<0||y+dy<0||x+dx>=W||y+dy>=H)continue;if(dist[j]>=0||t[j]===CWALL)continue;dist[j]=dist[i]+1;q.push(j);}}
  let far=0; for(let i=0;i<W*H;i++){ if(t[i]===CAVE&&dist[i]<0) t[i]=CWALL; if(dist[i]>dist[far]) far=i; }
  const bx=far%W, by=(far/W)|0;
  for(let y=by-4;y<=by+4;y++)for(let x=bx-4;x<=bx+4;x++){ if(x<1||y<1||x>=W-1||y>=H-1)continue; if((x-bx)**2+(y-by)**2<=17) t[idx(x,y)]=CAVE; }
  for(let i=0;i<W*H;i++) if(t[i]===CAVE && rng()<0.025) t[i]=BONES;
  t[idx(6,6)]=UP;
  return {id:'cave', name:'Cripta Esquecida', W,H,t, dark:true, links:{[idx(6,6)]:{map:'over',x:10,y:11}}, boss:{x:bx,y:by}, dist, maxDist:dist[far]};
}
function bfsDist(t,W,H,sx,sy){
  const dist=new Int32Array(W*H).fill(-1), q=[sy*W+sx]; dist[q[0]]=0; let far=q[0];
  for(let h=0;h<q.length;h++){ const i=q[h],x=i%W,y=(i/W)|0; if(dist[i]>dist[far]) far=i;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue; const j=ny*W+nx; if(dist[j]>=0||BLOCKS.has(t[j])) continue; dist[j]=dist[i]+1; q.push(j);} }
  return {dist, far, maxDist:dist[far]};
}
// caverna orgânica (autômato celular) com tema próprio
function genCA(id,name,W,H,seed,floor,wall,deco,decoP,o={}){
  const rng=mulberry32(seed); let t=new Uint8Array(W*H); const idx=(x,y)=>y*W+x;
  for(let i=0;i<W*H;i++) t[i]=rng()<0.45?wall:floor;
  for(let it=0;it<5;it++){ const n=new Uint8Array(W*H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){ let c=0; for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){ const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H||t[idx(nx,ny)]===wall) c++; }
      n[idx(x,y)]=(c>=5||x<1||y<1||x>=W-1||y>=H-1)?wall:floor; }
    t=n; }
  for(let y=3;y<=9;y++)for(let x=3;x<=9;x++) t[idx(x,y)]=floor;
  let b=bfsDist(t,W,H,6,6);
  for(let i=0;i<W*H;i++) if(t[i]===floor&&b.dist[i]<0) t[i]=wall;
  const bx=b.far%W, by=(b.far/W)|0;
  for(let y=by-4;y<=by+4;y++)for(let x=bx-4;x<=bx+4;x++){ if(x<1||y<1||x>=W-1||y>=H-1) continue; if((x-bx)**2+(y-by)**2<=17) t[idx(x,y)]=floor; }
  const lights=[{x:6,y:6,r:70}];
  for(let i=0;i<W*H;i++) if(t[i]===floor && rng()<decoP && Math.abs(i%W-6)+Math.abs(((i/W)|0)-6)>3){ t[i]=deco; lights.push({x:i%W,y:(i/W)|0,r:50}); }
  t[idx(6,6)]=SUP; if(o.exit) t[idx(bx,by)]=SDOWN;
  b=bfsDist(t,W,H,6,6);
  return {id,name,W,H,t,dark:true,links:{},boss:o.exit?null:{x:bx,y:by},exit:o.exit?{x:bx,y:by}:null,far:{x:bx,y:by},dist:b.dist,maxDist:b.maxDist,lights};
}
// andares de castelo: salas ligadas por corredores, tochas nas paredes
function genCastleFloor(id,name,W,H,seed,o){
  const WL=o.wall||CWL, FL=o.floor||CFL, CP=o.carpet||CARPET;
  const rng=mulberry32(seed), t=new Uint8Array(W*H).fill(WL), rooms=[];
  if(o.hall) rooms.push({x:(W-o.hall.w)>>1, y:2, w:o.hall.w, h:o.hall.h, hall:true});
  for(let tries=0; rooms.length<o.n && tries<800; tries++){
    const w=5+(rng()*6|0), h=4+(rng()*4|0), x=2+(rng()*(W-w-4)|0), y=2+(rng()*(H-h-4)|0);
    if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y)) continue; rooms.push({x,y,w,h});
  }
  const cen=r=>({x:r.x+(r.w>>1), y:r.y+(r.h>>1)});
  for(const r of rooms) for(let y=r.y;y<r.y+r.h;y++) for(let x=r.x;x<r.x+r.w;x++) t[y*W+x]=FL;
  for(let i=1;i<rooms.length;i++){
    const a=cen(rooms[i]); let best=null,bd=1e9;
    for(let j=0;j<i;j++){ const c=cen(rooms[j]), d=Math.abs(a.x-c.x)+Math.abs(a.y-c.y); if(d<bd){ bd=d; best=c; } }
    let x=a.x,y=a.y;
    if(rng()<0.5){ while(x!==best.x){t[y*W+x]=FL;x+=Math.sign(best.x-x);} while(y!==best.y){t[y*W+x]=FL;y+=Math.sign(best.y-y);} }
    else { while(y!==best.y){t[y*W+x]=FL;y+=Math.sign(best.y-y);} while(x!==best.x){t[y*W+x]=FL;x+=Math.sign(best.x-x);} }
  }
  for(const r of rooms) if(r.hall || rng()<0.35){ const cy=r.y+(r.h>>1); for(let x=r.x+1;x<r.x+r.w-1;x++) t[cy*W+x]=CP; }
  const bottom=rooms.reduce((a,r)=>(r.y+r.h>a.y+a.h?r:a));
  const entry={x:bottom.x+(bottom.w>>1), y:bottom.y+bottom.h-1};
  t[entry.y*W+entry.x]=o.entryTile;
  let b=bfsDist(t,W,H,entry.x,entry.y), exit=null;
  if(o.exitTile){ let bestR=null,bd=-1; for(const r of rooms){ if(r===bottom) continue; const c=cen(r), d=b.dist[c.y*W+c.x]; if(d>bd){ bd=d; bestR=r; } }
    exit={x:bestR.x+(bestR.w>>1), y:bestR.y}; t[exit.y*W+exit.x]=o.exitTile; }
  const torch=new Set(), lights=[];
  for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++){ const i=y*W+x; if(t[i]===WL && t[i+W]!==WL && rng()<0.13){ torch.add(i); lights.push({x,y:y+1,r:95}); } }
  b=bfsDist(t,W,H,entry.x,entry.y);
  const hall=rooms.find(r=>r.hall);
  return {id,name,W,H,t,dark:true,darkA:.74,links:{},dist:b.dist,maxDist:b.maxDist,entry,exit,torch,lights,boss:hall?{x:hall.x+(hall.w>>1),y:hall.y+(hall.h>>1)}:null};
}
// ---- Terras Queimadas: a ilha de Cinzaforte
function genAsh(){
  const W=90,H=70,rng=mulberry32(4040),t=new Uint8Array(W*H);
  const inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H, set=(x,y,v)=>{ if(inb(x,y)) t[y*W+x]=v; }, get=(x,y)=>t[y*W+x];
  const n1=makeNoise(W,H,7,rng), n2=makeNoise(W,H,5,rng);
  const CX=45, CY=35, X0=37, X1=53, Y0=28, Y1=42;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    let v = rng()<0.12?CRACK:ASH;
    if(n1(x,y)>0.7) v=LAVA; else if(n2(x,y)>0.68) v=OBS; else if(rng()<0.035) v=DTREE; else if(rng()<0.02) v=OBS;
    if(x<4) v=WATER; else if(x>=W-2||y<2||y>=H-2) v=OBS;
    t[y*W+x]=v;
  }
  for(let y=Y0-3;y<=Y1+3;y++) for(let x=X0-3;x<=X1+3;x++) set(x,y,rng()<0.1?CRACK:ASH);
  for(let y=Y0;y<=Y1;y++) for(let x=X0;x<=X1;x++) set(x,y,(x===X0||x===X1||y===Y0||y===Y1)?BWALL:BASALT);
  for(let d=-1;d<=1;d++){ set(CX+d,Y0,BASALT); set(CX+d,Y1,BASALT); set(X0,CY+d,BASALT); set(X1,CY+d,BASALT); }
  const building=(a,b,c,d,dx,dy)=>{ for(let y=b;y<=d;y++) for(let x=a;x<=c;x++) set(x,y,(x===a||x===c||y===b||y===d)?BWALL:WOOD); set(dx,dy,DOOR); };
  building(X0+1,Y0+1,X0+7,Y0+6, X0+4,Y0+6);
  building(X1-7,Y0+1,X1-1,Y0+6, X1-4,Y0+6);
  set(CX+3,CY+3,LAVA); set(CX+4,CY+3,LAVA); set(CX+3,CY+4,LAVA); set(CX+4,CY+4,LAVA);
  const carve=(x,y,x1,y1)=>{ for(let i=0;i<600&&(x!==x1||y!==y1);i++){
      if(x!==x1&&(y===y1||rng()<0.5)) x+=Math.sign(x1-x); else y+=Math.sign(y1-y);
      const c=get(x,y); if(SAFE.has(c)||c===BWALL||LINKS_T.has(c)||c===WATER) continue; set(x,y,ASHPATH); } };
  // cais a oeste
  for(let y=CY-4;y<=CY+4;y++) for(let x=4;x<=7;x++) set(x,y,ASH);
  for(let x=2;x<=4;x++) set(x,CY,BRIDGE); set(2,CY+1,BOAT);
  set(5,CY,ASHPATH); carve(5,CY,X0-1,CY);
  // entradas das masmorras
  const ENTS=[{x:20,y:12,gap:'S'},{x:72,y:12,gap:'S'},{x:18,y:58,gap:'N'},{x:72,y:58,gap:'N'},{x:84,y:35,gap:'W'}];
  // fosso de lava em volta do vulcão
  for(let y=24;y<=46;y++) for(let x=74;x<=88;x++){ const d=Math.hypot(x-84,y-35); if(d>=5&&d<6.6) set(x,y,LAVA); }
  for(const e of ENTS){
    for(let y=e.y-3;y<=e.y+3;y++) for(let x=e.x-3;x<=e.x+3;x++){
      const edge=Math.abs(x-e.x)===3||Math.abs(y-e.y)===3;
      const gap=(e.gap==='S'&&y===e.y+3&&Math.abs(x-e.x)<=1)||(e.gap==='N'&&y===e.y-3&&Math.abs(x-e.x)<=1)||(e.gap==='W'&&x===e.x-3&&Math.abs(y-e.y)<=1);
      set(x,y, edge&&!gap ? OBS : (rng()<0.2?CRACK:ASH));
    }
    set(e.x,e.y,ENTR);
    const ox=e.gap==='W'?e.x-1:e.x, oy=e.gap==='S'?e.y+1:e.gap==='N'?e.y-1:e.y; set(ox,oy,ASHPATH);
    const gx=e.gap==='W'?X1+1:CX, gy=e.gap==='W'?CY:(e.y<CY?Y0-1:Y1+1);
    carve(ox,oy,gx,gy);
  }
  const seen=new Uint8Array(W*H), st=[CY*W+CX]; seen[st[0]]=1;
  while(st.length){ const i=st.pop(),x=i%W,y=(i/W)|0; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(!inb(nx,ny)) continue; const j=ny*W+nx; if(seen[j]||BLOCKS.has(t[j])) continue; seen[j]=1; st.push(j); } }
  for(let i=0;i<W*H;i++) if(!seen[i]&&!BLOCKS.has(t[i])) t[i]=OBS;
  return {id:'ash', name:'Terras Queimadas', W,H,t, dark:false, town:true, oob:OBS, region:'ash', links:{},
    spawn:{x:X0+4,y:Y0+3}, dock:{x:6,y:CY}, boatman:{x:5,y:CY-1}, ents:ENTS, townRect:{x0:X0,x1:X1,y0:Y0,y1:Y1},
    enter:'Depois de três dias no mar, o barco atraca em Cinzaforte. O ar cheira a enxofre.'};
}
// ---- Bosque Encantado: Lunária
function genFae(){
  const W=88,H=68,rng=mulberry32(5150),t=new Uint8Array(W*H);
  const inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H, set=(x,y,v)=>{ if(inb(x,y)) t[y*W+x]=v; }, get=(x,y)=>t[y*W+x];
  const n1=makeNoise(W,H,6,rng), n2=makeNoise(W,H,8,rng);
  const CX=44, CY=34, X0=36, X1=52, Y0=27, Y1=41;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    let v = rng()<0.08?FFLOW:MOSS;
    if(n1(x,y)>0.62) v=GTREE; else if(n2(x,y)>0.74) v=WATER; else if(rng()<0.015) v=CRYST; else if(rng()<0.03) v=FSHROOM;
    if(x>=W-4) v=WATER; else if(x<2||y<2||y>=H-2) v=GTREE;
    t[y*W+x]=v;
  }
  for(let y=Y0-3;y<=Y1+3;y++) for(let x=X0-3;x<=X1+3;x++) set(x,y,rng()<0.15?FFLOW:MOSS);
  for(let y=Y0;y<=Y1;y++) for(let x=X0;x<=X1;x++) set(x,y,(x===X0||x===X1||y===Y0||y===Y1)?HEDGE:FSTONE);
  for(let d=-1;d<=1;d++){ set(CX+d,Y0,FSTONE); set(CX+d,Y1,FSTONE); set(X0,CY+d,FSTONE); set(X1,CY+d,FSTONE); }
  const building=(a,b,c,d,dx,dy)=>{ for(let y=b;y<=d;y++) for(let x=a;x<=c;x++) set(x,y,(x===a||x===c||y===b||y===d)?LOGW:WOOD); set(dx,dy,DOOR); };
  building(X0+1,Y0+1,X0+7,Y0+6, X0+4,Y0+6);
  building(X1-7,Y0+1,X1-1,Y0+6, X1-4,Y0+6);
  set(CX+3,CY+3,WATER); set(CX+4,CY+3,WATER); set(CX+3,CY+4,WATER); set(CX+4,CY+4,WATER);
  const carve=(x,y,x1,y1)=>{ for(let i=0;i<600&&(x!==x1||y!==y1);i++){
      if(x!==x1&&(y===y1||rng()<0.5)) x+=Math.sign(x1-x); else y+=Math.sign(y1-y);
      const c=get(x,y); if(SAFE.has(c)||c===HEDGE||c===LOGW||LINKS_T.has(c)) continue; set(x,y,c===WATER?BRIDGE:PATH); } };
  // cais a leste
  for(let y=CY-4;y<=CY+4;y++) for(let x=W-8;x<=W-5;x++) set(x,y,MOSS);
  for(let x=W-5;x<=W-3;x++) set(x,CY,BRIDGE); set(W-3,CY+1,BOAT);
  set(W-6,CY,PATH); carve(W-6,CY,X1+1,CY);
  const ENTS=[{x:18,y:14,gap:'S',tile:HOLE},{x:70,y:14,gap:'S',tile:RING},{x:44,y:60,gap:'N',tile:HOLE}];
  for(const e of ENTS){
    for(let y=e.y-3;y<=e.y+3;y++) for(let x=e.x-3;x<=e.x+3;x++){
      const edge=Math.abs(x-e.x)===3||Math.abs(y-e.y)===3;
      const gap=(e.gap==='S'&&y===e.y+3&&Math.abs(x-e.x)<=1)||(e.gap==='N'&&y===e.y-3&&Math.abs(x-e.x)<=1);
      set(x,y, edge&&!gap ? GTREE : (rng()<0.25?FFLOW:MOSS));
    }
    set(e.x,e.y,e.tile);
    const oy=e.gap==='S'?e.y+1:e.y-1; set(e.x,oy,PATH);
    carve(e.x,oy,CX,e.y<CY?Y0-1:Y1+1);
  }
  const seen=new Uint8Array(W*H), st=[CY*W+CX]; seen[st[0]]=1;
  while(st.length){ const i=st.pop(),x=i%W,y=(i/W)|0; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(!inb(nx,ny)) continue; const j=ny*W+nx; if(seen[j]||BLOCKS.has(t[j])) continue; seen[j]=1; st.push(j); } }
  for(let i=0;i<W*H;i++) if(!seen[i]&&!BLOCKS.has(t[i])) t[i]=GTREE;
  return {id:'fae', name:'Bosque Encantado', W,H,t, dark:false, town:true, oob:GTREE, region:'fae', links:{},
    spawn:{x:X0+4,y:Y0+3}, dock:{x:W-6,y:CY}, boatman:{x:W-6,y:CY-1}, ents:ENTS, townRect:{x0:X0,x1:X1,y0:Y0,y1:Y1},
    enter:'O barco sobe um rio entre árvores gigantes e atraca em Lunária. Vaga-lumes piscam no ar.'};
}
const MAPS = {};
MAPS.over = genOverworld();
MAPS.cave = genCave();
// ---- masmorras com andares (o chefe fica no último andar)
{ const C=MAPS.cave; C.name='Cripta Esquecida (andar 1)'; C.far={...C.boss}; C.exit={...C.boss}; C.t[C.boss.y*C.W+C.boss.x]=SDOWN; C.boss=null; C.mult=1;
  Object.assign(C,{lights:[{x:6,y:6,r:70}], enter:'Você desce para a Cripta Esquecida. O ar é frio e cheira a pó.'}); }
const floorsOf = (key, n, mk) => { const ids=[]; for(let i=1;i<=n;i++){ const id=(i===1&&key!=='castle')?key:(key+i); if(key==='cave'&&i===1){ ids.push('cave'); continue; } MAPS[id]=mk(id,i,i===n); ids.push(id); } return ids; };
const DUNGEONS = {
  nest: floorsOf('nest',2,(id,i,last)=>Object.assign(genCA(id,'Ninho de Seda (andar '+i+')',50,40,5151+i*17,WEBF,NWALL,EGGS,0.035,{exit:!last}),
          {darkA:.85, mult:[1,1,1.45][i], glow:last?'rgba(120,210,80,':null, enter:'Você desce para o Ninho de Seda. Fios grudam na sua roupa.'})),
  den:  floorsOf('den',3,(id,i,last)=>Object.assign(genCA(id,'Toca das Raízes (andar '+i+')',52,40,6262+i*17,DIRT,RWALL,SHROOM,0.03,{exit:!last}),
          {darkA:.86, mult:[1,1,1.35,1.75][i], glow:last?'rgba(200,215,255,':null, enter:'Você entra na Toca das Raízes. Algo uiva lá no fundo.'})),
  castle: floorsOf('castle',4,(id,i,last)=>Object.assign(
          last ? genCastleFloor(id,'Castelo Abandonado (torre, andar 4)',36,28,7575,{n:4,hall:{w:13,h:9},entryTile:SDOWN})
               : genCastleFloor(id,'Castelo Abandonado (andar '+i+')',46,34,7373+i*101,{n:9,entryTile:i===1?GATE:SDOWN,exitTile:SUP}),
          {mult:[1,1,1.25,1.5,1.8][i], glow:last?'rgba(230,60,40,':null, enter:'Você atravessa o portão do Castelo Abandonado. Algumas tochas ainda queimam.'})),
  cave: floorsOf('cave',5,(id,i,last)=>Object.assign(genCA(id,'Cripta Esquecida (andar '+i+')',46,36,9090+i*31,CAVE,CWALL,BONES,0.03,{exit:!last}),
          {darkA:.93, lights:[{x:6,y:6,r:70}], mult:[1,1,1.25,1.5,1.8,2.1][i], glow:last?'rgba(140,70,200,':null})),
};
for(const ids of Object.values(DUNGEONS)) for(const id of ids){ const M=MAPS[id]; if(!M.far) M.far=M.exit||M.boss; }
// ---- cais de Pedraluz (leste)
{ const O=MAPS.over, W=O.W, py=TOWN.cy+2;
  for(let y=py-4;y<=py+4;y++) for(let x=78;x<=81;x++){ const i=y*W+x; O.t[i]= x>=80?WATER:(O.t[i]===PATH?PATH:G); }
  O.t[py*W+78]=PATH; O.t[py*W+79]=PATH; O.t[py*W+80]=BRIDGE; O.t[py*W+81]=BRIDGE; O.t[(py+1)*W+81]=BOAT;
  O.dock={x:79,y:py}; O.boatman={x:79,y:py-1}; O.town=true; O.enter='O barco atraca no cais de Pedraluz.'; }
MAPS.ash = genAsh();
const FIRE = {darkA:.8, region:'ash', oob:MWALL};
const mkFloors=(key,n,fn)=>{ const ids=[]; for(let i=1;i<=n;i++){ const id=key+i; MAPS[id]=Object.assign(fn(id,i,i===n), FIRE, {mult:[1,1,1.2,1.4,1.6][i]}, i===n?{glow:'rgba(255,90,30,'}:{}); ids.push(id); } return ids; };
const ASHD = {
  forge: mkFloors('forge',2,(id,i,last)=> last
    ? genCastleFloor(id,'Forja dos Diabretes (andar '+i+')',38,30,8101,{n:5,hall:{w:13,h:9},entryTile:SUP,wall:BWALL,floor:BASALT,carpet:CRACK})
    : genCastleFloor(id,'Forja dos Diabretes (andar '+i+')',46,34,8100+i,{n:9,entryTile:GATE,exitTile:SDOWN,wall:BWALL,floor:BASALT,carpet:CRACK})),
  magma: mkFloors('magma',2,(id,i,last)=>genCA(id,'Fendas de Magma (andar '+i+')',52,40,8200+i*13,CRACK,MWALL,EMBER,0.03,{exit:!last})),
  necro: mkFloors('necro',3,(id,i,last)=> last
    ? genCastleFloor(id,'Necrópole de Cinzas (andar '+i+')',38,30,8303,{n:5,hall:{w:13,h:9},entryTile:SUP,wall:BWALL,floor:ASH,carpet:ASHPATH})
    : genCastleFloor(id,'Necrópole de Cinzas (andar '+i+')',46,34,8300+i,{n:9,entryTile:i===1?GATE:SUP,exitTile:SDOWN,wall:BWALL,floor:ASH,carpet:ASHPATH})),
  dragon: mkFloors('dragon',3,(id,i,last)=>genCA(id,'Ninho dos Dragões (andar '+i+')',56,44,8400+i*17,CRACK,MWALL,EMBER,0.025,{exit:!last})),
  volc: mkFloors('volc',4,(id,i,last)=>genCA(id,'Coração do Vulcão (andar '+i+')',52,42,8500+i*19,BASALT,MWALL,EMBER,0.04,{exit:!last})),
};
for(const ids of Object.values(ASHD)) for(const id of ids){ const M=MAPS[id]; if(!M.far) M.far=M.exit||M.boss; }
MAPS.fae = genFae();
const mkFae=(key,n,props,fn)=>{ const ids=[]; for(let i=1;i<=n;i++){ const id=key+i; MAPS[id]=Object.assign(fn(id,i,i===n), {region:'fae'}, props, {mult:[1,1,1.3,1.5][i]}, i===n?{glow:props.glowCol}:{}); ids.push(id); } return ids; };
const FAED = {
  grotto: mkFae('grotto',2,{darkA:.8,oob:CRYW,glowCol:'rgba(255,150,240,'},(id,i,last)=>genCA(id,'Gruta das Fadas (andar '+i+')',50,40,9300+i*7,MOSS,CRYW,FSHROOM,0.04,{exit:!last})),
  glade:  mkFae('glade',2,{darkA:.5,oob:GTREE,glowCol:'rgba(160,230,255,'},(id,i,last)=>genCA(id,'Clareira dos Faunos (andar '+i+')',54,42,9400+i*7,MOSS,GTREE,FFLOW,0.03,{exit:!last})),
  heart:  mkFae('heart',3,{darkA:.88,oob:RWALL,glowCol:'rgba(170,80,230,'},(id,i,last)=>genCA(id,'Coração do Bosque Sombrio (andar '+i+')',52,42,9500+i*7,ROTF,RWALL,FSHROOM,0.03,{exit:!last})),
};
for(const ids of Object.values(FAED)) for(const id of ids){ const M=MAPS[id]; if(!M.far) M.far=M.exit||M.boss; }
// ---- cidades novas: mesmo formato de Lunária (cidade murada no centro, cais a oeste, 5 entradas de masmorra)
function genRegionTown(c){
  const W=88,H=68,rng=mulberry32(c.seed),t=new Uint8Array(W*H);
  const inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H, set=(x,y,v)=>{ if(inb(x,y)) t[y*W+x]=v; }, get=(x,y)=>t[y*W+x];
  const n1=makeNoise(W,H,6,rng), n2=makeNoise(W,H,8,rng);
  const CX=44, CY=34, X0=36, X1=52, Y0=27, Y1=41;
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    let v=c.ground(rng);
    if(n1(x,y)>0.62) v=c.tree; else if(n2(x,y)>0.74) v=c.pond; else if(rng()<c.decoP) v=c.deco;
    if(x<4) v=c.sea; else if(x>=W-2||y<2||y>=H-2) v=c.tree;
    t[y*W+x]=v;
  }
  for(let y=Y0-3;y<=Y1+3;y++) for(let x=X0-3;x<=X1+3;x++) set(x,y,c.ground(rng));
  for(let y=Y0;y<=Y1;y++) for(let x=X0;x<=X1;x++) set(x,y,(x===X0||x===X1||y===Y0||y===Y1)?c.wall:c.floor);
  for(let d=-1;d<=1;d++){ set(CX+d,Y0,c.floor); set(CX+d,Y1,c.floor); set(X0,CY+d,c.floor); set(X1,CY+d,c.floor); }
  const building=(a,b,cc,d,dx,dy)=>{ for(let y=b;y<=d;y++) for(let x=a;x<=cc;x++) set(x,y,(x===a||x===cc||y===b||y===d)?c.bwall:WOOD); set(dx,dy,DOOR); };
  building(X0+1,Y0+1,X0+7,Y0+6, X0+4,Y0+6);
  building(X1-7,Y0+1,X1-1,Y0+6, X1-4,Y0+6);
  set(CX+3,CY+3,c.townPond); set(CX+4,CY+3,c.townPond); set(CX+3,CY+4,c.townPond); set(CX+4,CY+4,c.townPond);
  const carve=(x,y,x1,y1)=>{ for(let i=0;i<600&&(x!==x1||y!==y1);i++){
      if(x!==x1&&(y===y1||rng()<0.5)) x+=Math.sign(x1-x); else y+=Math.sign(y1-y);
      const k=get(x,y); if(SAFE.has(k)||k===c.wall||k===c.bwall||LINKS_T.has(k)||k===WATER&&x<4) continue; set(x,y,k===WATER?BRIDGE:c.path); } };
  for(let y=CY-4;y<=CY+4;y++) for(let x=4;x<=7;x++) set(x,y,c.ground(rng));
  for(let x=2;x<=4;x++) set(x,CY,BRIDGE); set(2,CY+1,BOAT);
  set(5,CY,c.path); carve(5,CY,X0-1,CY);
  const ENTS=[{x:20,y:12,gap:'S'},{x:70,y:12,gap:'S'},{x:18,y:57,gap:'N'},{x:70,y:57,gap:'N'},{x:80,y:34,gap:'W'}];
  for(const e of ENTS){
    for(let y=e.y-3;y<=e.y+3;y++) for(let x=e.x-3;x<=e.x+3;x++){
      const edge=Math.abs(x-e.x)===3||Math.abs(y-e.y)===3;
      const gap=(e.gap==='S'&&y===e.y+3&&Math.abs(x-e.x)<=1)||(e.gap==='N'&&y===e.y-3&&Math.abs(x-e.x)<=1)||(e.gap==='W'&&x===e.x-3&&Math.abs(y-e.y)<=1);
      set(x,y, edge&&!gap ? c.tree : c.ground(rng));
    }
    set(e.x,e.y,c.ent);
    const ox=e.gap==='W'?e.x-1:e.x, oy=e.gap==='S'?e.y+1:e.gap==='N'?e.y-1:e.y; set(ox,oy,c.path);
    const gx=e.gap==='W'?X1+1:CX, gy=e.gap==='W'?CY:(e.y<CY?Y0-1:Y1+1);
    carve(ox,oy,gx,gy);
  }
  const seen=new Uint8Array(W*H), st=[CY*W+CX]; seen[st[0]]=1;
  while(st.length){ const i=st.pop(),x=i%W,y=(i/W)|0; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(!inb(nx,ny)) continue; const j=ny*W+nx; if(seen[j]||BLOCKS.has(t[j])) continue; seen[j]=1; st.push(j); } }
  for(let i=0;i<W*H;i++) if(!seen[i]&&!BLOCKS.has(t[i])) t[i]=c.tree;
  return {id:c.id, name:c.name, W,H,t, dark:false, town:true, oob:c.tree, region:c.id, links:{},
    spawn:{x:X0+4,y:Y0+3}, dock:{x:6,y:CY}, boatman:{x:5,y:CY-1}, ents:ENTS, townRect:{x0:X0,x1:X1,y0:Y0,y1:Y1}, enter:c.enter};
}
MAPS.ice = genRegionTown({id:'ice', name:'Fiordes Gelados', seed:7070, ground:r=>r()<0.1?DRIFT:SNOW, tree:IPINE, pond:ICEF, deco:DRIFT, decoP:0.02, sea:WATER,
  wall:WALL, floor:STONE, bwall:WALL, townPond:ICEF, path:SNOWP, ent:IENT, enter:'O quebra-gelo abre caminho pelo fiorde e atraca em Invernália. O vento corta como faca.'});
MAPS.sea = genRegionTown({id:'sea', name:'Recife Profundo', seed:9090, ground:r=>r()<0.08?KELP:SANDF, tree:CORAL, pond:REEFW, deco:BUBBLE, decoP:0.012, sea:REEFW,
  wall:REEFW, floor:NACRE, bwall:REEFW, townPond:BUBBLE, path:PATH, ent:SENT, enter:'O sino de mergulho desce devagar e para dentro da grande bolha de ar de Coralina.'});
MAPS.sea.tint='rgba(20,90,160,.17)';
const mkReg=(key,n,region,props,fn)=>{ const ids=[]; for(let i=1;i<=n;i++){ const id=key+i; MAPS[id]=Object.assign(fn(id,i,i===n), {region}, props, {mult:[1,1,1.2,1.4,1.6][i]}, i===n?{glow:props.glowCol}:{}); ids.push(id); } return ids; };
const ICED = {
  icecave: mkReg('icecave',2,'ice',{darkA:.72,oob:IWALL,glowCol:'rgba(150,210,255,'},(id,i,last)=>genCA(id,'Cavernas de Gelo Azul (andar '+i+')',52,40,9600+i*7,ICEF,IWALL,DRIFT,0.04,{exit:!last})),
  ship: mkReg('ghostship',3,'ice',{darkA:.86,oob:HULL,glowCol:'rgba(120,230,200,'},(id,i,last)=> last
    ? genCastleFloor(id,'Navio Fantasma (cabine do capitão)',38,30,9703,{n:5,hall:{w:13,h:9},entryTile:SUP,wall:HULL,floor:WOOD,carpet:ICEF})
    : genCastleFloor(id,'Navio Fantasma (porão '+i+')',46,34,9700+i,{n:9,entryTile:i===1?GATE:SUP,exitTile:SDOWN,wall:HULL,floor:WOOD,carpet:ICEF})),
  wyrm: mkReg('wyrmnest',3,'ice',{darkA:.6,oob:IWALL,glowCol:'rgba(220,240,255,'},(id,i,last)=>genCA(id,'Ninho das Serpes Brancas (andar '+i+')',56,44,9800+i*11,SNOW,IWALL,DRIFT,0.03,{exit:!last})),
  keep: mkReg('frostkeep',4,'ice',{darkA:.7,oob:IWALL,glowCol:'rgba(160,200,255,'},(id,i,last)=> last
    ? genCastleFloor(id,'Fortaleza dos Gigantes de Gelo (torre)',38,30,9904,{n:5,hall:{w:13,h:9},entryTile:SUP,wall:IWALL,floor:ICEF,carpet:SNOW})
    : genCastleFloor(id,'Fortaleza dos Gigantes de Gelo (andar '+i+')',46,34,9900+i,{n:9,entryTile:i===1?GATE:SUP,exitTile:SDOWN,wall:IWALL,floor:ICEF,carpet:SNOW})),
  aurora: mkReg('aurorarift',3,'ice',{darkA:.55,oob:IWALL,glowCol:'rgba(140,255,200,'},(id,i,last)=>genCA(id,'Fenda da Aurora (andar '+i+')',52,42,9950+i*13,ICEF,IWALL,DRIFT,0.03,{exit:!last})),
};
const SEAD = {
  coral: mkReg('coralgarden',2,'sea',{darkA:.55,oob:CORAL,tint:'rgba(20,90,160,.17)',glowCol:'rgba(255,140,170,'},(id,i,last)=>genCA(id,'Jardim de Corais (andar '+i+')',52,40,10100+i*7,SANDF,CORAL,KELP,0.04,{exit:!last})),
  wreck: mkReg('wreck',3,'sea',{darkA:.8,oob:HULL,tint:'rgba(20,90,160,.17)',glowCol:'rgba(255,210,90,'},(id,i,last)=> last
    ? genCastleFloor(id,'Naufrágio do Galeão Dourado (tombadilho)',38,30,10203,{n:5,hall:{w:13,h:9},entryTile:SUP,wall:HULL,floor:WOOD,carpet:SANDF})
    : genCastleFloor(id,'Naufrágio do Galeão Dourado (andar '+i+')',46,34,10200+i,{n:9,entryTile:i===1?GATE:SUP,exitTile:SDOWN,wall:HULL,floor:WOOD,carpet:SANDF})),
  temple: mkReg('sunktemple',3,'sea',{darkA:.8,oob:REEFW,tint:'rgba(20,90,160,.17)',glowCol:'rgba(90,220,200,'},(id,i,last)=> last
    ? genCastleFloor(id,'Templo Afundado (santuário)',38,30,10303,{n:5,hall:{w:13,h:9},entryTile:SUP,wall:REEFW,floor:ABYSS,carpet:NACRE})
    : genCastleFloor(id,'Templo Afundado (andar '+i+')',46,34,10300+i,{n:9,entryTile:i===1?GATE:SUP,exitTile:SDOWN,wall:REEFW,floor:ABYSS,carpet:NACRE})),
  trench: mkReg('trench',3,'sea',{darkA:.93,oob:REEFW,tint:'rgba(10,40,90,.2)',glowCol:'rgba(170,255,120,'},(id,i,last)=>genCA(id,'Fossa Abissal (andar '+i+')',54,42,10400+i*11,ABYSS,REEFW,KELP,0.02,{exit:!last})),
  lair: mkReg('levlair',4,'sea',{darkA:.86,oob:REEFW,tint:'rgba(10,60,120,.2)',glowCol:'rgba(90,170,255,'},(id,i,last)=>genCA(id,'Covil do Kraken (andar '+i+')',56,44,10500+i*13,ABYSS,REEFW,KELP,0.03,{exit:!last})),
};
for(const D of [ICED,SEAD]) for(const ids of Object.values(D)) for(const id of ids){ const M=MAPS[id]; if(!M.far) M.far=M.exit||M.boss; }
// bolhas de ar espalhadas no fundo do mar
{ const r=mulberry32(4242); for(const ids of Object.values(SEAD)) for(const id of ids){ const M=MAPS[id]; let n=Math.floor(M.W*M.H/230), tries=0;
  while(n>0&&tries++<4000){ const x=1+Math.floor(r()*(M.W-2)), y=1+Math.floor(r()*(M.H-2)), k=y*M.W+x, tt=M.t[k]; if(BLOCKS.has(tt)||LINKS_T.has(tt)||SAFE.has(tt)) continue;
    if(M.entry&&Math.abs(M.entry.x-x)+Math.abs(M.entry.y-y)<3) continue; if(M.exit&&Math.abs(M.exit.x-x)+Math.abs(M.exit.y-y)<3) continue; if(M.boss&&Math.abs(M.boss.x-x)+Math.abs(M.boss.y-y)<3) continue; M.t[k]=BUBBLE; n--; } } }
// ---- cidades maiores: o muro cresce e entra uma fileira de 4 casinhas embaixo para os NPCs (vale para as cinco cidades)
function expandTown(M, rc, cfg){ const W=M.W, H=M.H, t=M.t, set=(x,y,v)=>{ if(x>=0&&y>=0&&x<W&&y<H) t[y*W+x]=v; };
  const CX=Math.round((rc.x0+rc.x1)/2), CY=Math.round((rc.y0+rc.y1)/2), X0=rc.x0-4, X1=rc.x1+4, Y0=rc.y0-2, Y1=rc.y1+3;
  for(let y=Y0-2;y<=Y1+2;y++) for(let x=X0-2;x<=X1+2;x++){ if(x<0||y<0||x>=W||y>=H) continue; const k=t[y*W+x];
    if(x<X0||x>X1||y<Y0||y>Y1){ if(BLOCKS.has(k)&&k!==BOAT) set(x,y,cfg.ground[(hash2(x*7+3,y*13+W)%100)<cfg.alt?1:0]); } else set(x,y,cfg.floor); }
  for(let y=Y0;y<=Y1;y++) for(let x=X0;x<=X1;x++) if(x===X0||x===X1||y===Y0||y===Y1) set(x,y,cfg.wall);
  for(let d=-1;d<=1;d++){ set(CX+d,Y0,cfg.floor); set(CX+d,Y1,cfg.floor); set(X0,CY+d,cfg.floor); set(X1,CY+d,cfg.floor); }
  const B=(a,b,c,d,dx,dy)=>{ for(let y=b;y<=d;y++) for(let x=a;x<=c;x++) set(x,y,(x===a||x===c||y===b||y===d)?cfg.bwall:WOOD); set(dx,dy,DOOR); };
  B(X0+1,Y0+1,X0+7,Y0+6, X0+4,Y0+6); B(X1-7,Y0+1,X1-1,Y0+6, X1-4,Y0+6);
  for(const hx of [X0+1,X0+6,X0+14,X0+19]) B(hx,Y1-5,hx+4,Y1-1, hx+2,Y1-5);
  for(const [dx,dy] of [[3,1],[4,1],[3,2],[4,2]]) set(CX+dx,CY+dy,cfg.pond);
  rc.x0=X0; rc.x1=X1; rc.y0=Y0; rc.y1=Y1; if(rc.cx!=null){ rc.cx=CX; rc.cy=CY; } if(M.spawn){ M.spawn.x=X0+4; M.spawn.y=Y0+3; } }
expandTown(MAPS.over, TOWN, {ground:[G,FLOW], alt:8, floor:STONE, wall:WALL, bwall:WALL, pond:WATER});
expandTown(MAPS.ash, MAPS.ash.townRect, {ground:[ASH,CRACK], alt:10, floor:BASALT, wall:BWALL, bwall:BWALL, pond:LAVA});
expandTown(MAPS.fae, MAPS.fae.townRect, {ground:[MOSS,FFLOW], alt:15, floor:FSTONE, wall:HEDGE, bwall:LOGW, pond:WATER});
expandTown(MAPS.ice, MAPS.ice.townRect, {ground:[SNOW,DRIFT], alt:10, floor:STONE, wall:WALL, bwall:WALL, pond:ICEF});
expandTown(MAPS.sea, MAPS.sea.townRect, {ground:[SANDF,KELP], alt:8, floor:NACRE, wall:REEFW, bwall:REEFW, pond:BUBBLE});
for(const m of Object.values(MAPS)) m.explored = new Uint8Array(m.W*m.H);
const tileAt=(m,x,y)=>(x<0||y<0||x>=m.W||y>=m.H)?(m.oob??(m.dark?CWALL:TREE)):m.t[y*m.W+x];
function arrivalNear(m,x,y){ for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]){ const nx=x+dx,ny=y+dy, tt=tileAt(m,nx,ny); if(!BLOCKS.has(tt)&&!LINKS_T.has(tt)) return {x:nx,y:ny}; } return {x,y:y+1}; }
function connect(a,ax,ay,b,bx,by){ const A=MAPS[a],B=MAPS[b]; A.links[ay*A.W+ax]={map:b,...arrivalNear(B,bx,by)}; B.links[by*B.W+bx]={map:a,...arrivalNear(A,ax,ay)}; }
{ const O=MAPS.over, D=DUNGEONS;
  const chain=(ids)=>{ for(let i=0;i<ids.length-1;i++){ const A=MAPS[ids[i]], B=MAPS[ids[i+1]], e=B.entry||{x:6,y:6}; connect(ids[i],A.exit.x,A.exit.y,ids[i+1],e.x,e.y); } };
  connect('over',O.castleGate.x,O.castleGate.y,D.castle[0],MAPS[D.castle[0]].entry.x,MAPS[D.castle[0]].entry.y);
  connect('over',O.hole.x,O.hole.y,D.den[0],6,6);
  connect('over',O.nestHole.x,O.nestHole.y,D.nest[0],6,6);
  for(const ids of Object.values(D)) chain(ids); }
{ const A=MAPS.ash, keys=['forge','magma','necro','dragon','volc'];
  keys.forEach((k,i)=>{ const ids=ASHD[k], F=MAPS[ids[0]], e=F.entry||{x:6,y:6}; connect('ash',A.ents[i].x,A.ents[i].y,ids[0],e.x,e.y);
    for(let j=0;j<ids.length-1;j++){ const P=MAPS[ids[j]], Q=MAPS[ids[j+1]], qe=Q.entry||{x:6,y:6}; connect(ids[j],P.exit.x,P.exit.y,ids[j+1],qe.x,qe.y); } }); }

{ const F=MAPS.fae, keys=['grotto','glade','heart'];
  keys.forEach((k,i)=>{ const ids=FAED[k]; connect('fae',F.ents[i].x,F.ents[i].y,ids[0],6,6);
    for(let j=0;j<ids.length-1;j++){ const P=MAPS[ids[j]]; connect(ids[j],P.exit.x,P.exit.y,ids[j+1],6,6); } }); }

for(const [reg,D] of [['ice',ICED],['sea',SEAD]]){ const A=MAPS[reg];
  Object.keys(D).forEach((k,i)=>{ const ids=D[k], F=MAPS[ids[0]], e=F.entry||{x:6,y:6}; connect(reg,A.ents[i].x,A.ents[i].y,ids[0],e.x,e.y);
    for(let j=0;j<ids.length-1;j++){ const P=MAPS[ids[j]], Q=MAPS[ids[j+1]], qe=Q.entry||{x:6,y:6}; connect(ids[j],P.exit.x,P.exit.y,ids[j+1],qe.x,qe.y); } }); }
function zoneName(m,x,y){
  if((m.id==='ice'||m.id==='sea')&&m.townRect){ const r=m.townRect; return (x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1)?(m.id==='ice'?'Invernália':'Coralina'):m.name; }
  if(m.id==='fae'){ const r=m.townRect; return (x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1)?'Lunária':'Bosque Encantado'; }
  if(m.id==='ash'){ const r=m.townRect; return (x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1)?'Cinzaforte':'Terras Queimadas'; }
  if(m.id!=='over') return m.name;
  const {x0,x1,y0,y1,cx,cy}=TOWN;
  if(x>=x0&&x<=x1&&y>=y0&&y<=y1) return 'Pedraluz';
  if(y<cy-12) return x>cx+14?'Lago Espelho':'Bosque dos Pinheiros';
  if(y>cy+11) return 'Pântano Cinzento';
  if(x<cx-16) return 'Colinas Partidas';
  return 'Campos de Pedraluz';
}


// ============================================================ classes
const CLASSES = {
  guerreiro:{name:'Guerreiro', desc:'Linha de frente. Muita vida e defesa; espadas, machados e escudo.', hp0:100,hpLv:22,mp0:15,mpLv:4, atkLv:1.2, magLv:0.2, defLv:0.8, crit:0, as:1100, range:1, wk:['blade'], start:['club','tunic','woodshield'], look:{hair:'#4a2e1a'}},
  cacador:{name:'Caçador', desc:'Ataca de longe com arco. Crítico alto; não usa escudo.', hp0:90,hpLv:15,mp0:20,mpLv:7, atkLv:1.0, magLv:0.4, defLv:0.5, crit:4, as:1150, range:4, wk:['bow'], noShield:true, start:['shortbow','tunic'], look:{hood:'#4f5a2c'}},
  feiticeiro:{name:'Feiticeiro', desc:'Fogo e raios: o maior dano mágico. Pouca vida; precisa de distância.', hp0:80,hpLv:9,mp0:40,mpLv:16, atkLv:0.4, magLv:1.6, defLv:0.4, crit:0, as:1200, range:4, wk:['wand'], start:['emberwand','tunic'], look:{hat:'#3a2a6a'}},
  xama:{name:'Xamã', desc:'Magia da natureza: a cura mais forte, gelo que deixa lento e raízes que prendem.', hp0:80,hpLv:10,mp0:40,mpLv:15, atkLv:0.4, magLv:1.4, defLv:0.4, crit:0, as:1200, range:4, wk:['staff'], start:['oakstaff','tunic'], look:{hood:'#2f5a3a'}},
  monge:{name:'Monge', desc:'Artes marciais. Socos rápidos, combos e meditação; não usa escudo.', hp0:95,hpLv:17,mp0:20,mpLv:7, atkLv:1.1, magLv:0.5, defLv:0.6, crit:3, as:750, range:1, wk:['fist'], noShield:true, start:['wraps','tunic'], look:{bald:true, band:'#c03a2a'}},
};
const CLASS_ORDER = ['guerreiro','cacador','feiticeiro','xama','monge'];
const MAGES = ['feiticeiro','xama'];


// ============================================================ itens
const ITEMS = {
  gold:      {name:'Moedas de ouro', stack:true, icon:'gold'},
  dagger:    {name:'Faca', slot:'weapon', wk:'any', atk:3, price:10, lvl:1, icon:'dagger', look:'#c9ccd2'},
  club:      {name:'Clava', slot:'weapon', wk:'blade', atk:6, price:40, lvl:1, icon:'club', look:'#7a5634'},
  shortsword:{name:'Espada Curta', slot:'weapon', wk:'blade', atk:10, price:150, lvl:3, icon:'sword', look:'#d6dae0'},
  axe:       {name:'Machado de Guerra', slot:'weapon', wk:'blade', atk:15, price:450, lvl:6, icon:'axe', look:'#b9bec6'},
  hammer:    {name:'Martelo de Guerra', slot:'weapon', wk:'blade', atk:19, sell:500, lvl:10, icon:'hammer', look:'#8a8e96'},
  runeblade: {name:'Lâmina Rúnica', slot:'weapon', wk:'blade', atk:24, sell:1500, lvl:15, icon:'rune', look:'#7fd0ff'},
  shortbow:  {name:'Arco Curto', slot:'weapon', wk:'bow', atk:5, price:30, lvl:1, icon:'bow', look:'#8a5a2a'},
  longbow:   {name:'Arco Longo', slot:'weapon', wk:'bow', atk:10, price:180, lvl:4, icon:'bow', look:'#6a4020'},
  yewbow:    {name:'Arco de Teixo', slot:'weapon', wk:'bow', atk:15, price:520, lvl:8, icon:'bow', look:'#4a3018'},
  windbow:   {name:'Arco do Vento', slot:'weapon', wk:'bow', atk:22, sell:1400, lvl:14, icon:'bow', look:'#7fd0c0'},
  emberwand: {name:'Varinha de Brasa', slot:'weapon', wk:'wand', atk:4, mag:2, price:30, lvl:1, icon:'wand', look:'#e0603a'},
  sparkwand: {name:'Varinha de Faíscas', slot:'weapon', wk:'wand', atk:7, mag:5, price:220, lvl:4, icon:'wand', look:'#ffd54a'},
  flamescepter:{name:'Cetro Flamejante', slot:'weapon', wk:'wand', atk:11, mag:9, price:560, lvl:8, icon:'wand', look:'#ff7a2a'},
  voidwand:  {name:'Varinha do Vazio', slot:'weapon', wk:'wand', atk:15, mag:14, sell:1400, lvl:14, icon:'wand', look:'#b06aff'},
  oakstaff:  {name:'Cajado de Carvalho', slot:'weapon', wk:'staff', atk:4, mag:2, price:30, lvl:1, icon:'staff', look:'#8ad06a'},
  froststaff:{name:'Cajado de Geada', slot:'weapon', wk:'staff', atk:7, mag:5, price:220, lvl:4, icon:'staff', look:'#9ad8ff'},
  mossstaff: {name:'Cajado Musgoso', slot:'weapon', wk:'staff', atk:11, mag:9, price:560, lvl:8, icon:'staff', look:'#5ab04a'},
  ancientstaff:{name:'Cajado Ancestral', slot:'weapon', wk:'staff', atk:15, mag:14, sell:1400, lvl:14, icon:'staff', look:'#e0d070'},
  wraps:     {name:'Faixas de Pano', slot:'weapon', wk:'fist', atk:3, price:10, lvl:1, icon:'fist', look:'#e8e0cc'},
  leatherfists:{name:'Manoplas de Couro', slot:'weapon', wk:'fist', atk:7, price:160, lvl:3, icon:'fist', look:'#9a6430'},
  ironclaws: {name:'Garras de Ferro', slot:'weapon', wk:'fist', atk:12, price:480, lvl:7, icon:'fist', look:'#a4aab3'},
  dragonfists:{name:'Punhos do Dragão', slot:'weapon', wk:'fist', atk:18, sell:1400, lvl:14, icon:'fist', look:'#d04a2a'},
  tunic:     {name:'Túnica', slot:'armor', def:1, price:8, lvl:1, icon:'armor', look:'#7a5a3a'},
  leather:   {name:'Armadura de Couro', slot:'armor', def:4, price:60, lvl:2, icon:'armor', look:'#9a6430'},
  apprenticerobe:{name:'Manto de Aprendiz', slot:'armor', def:2, mag:2, price:90, lvl:2, cls:MAGES, icon:'robe', look:'#3a3a7a'},
  gi:        {name:'Gi de Treino', slot:'armor', def:3, atk:2, price:90, lvl:2, cls:['monge'], icon:'armor', look:'#e8e0cc'},
  chain:     {name:'Cota de Malha', slot:'armor', def:8, price:320, lvl:6, cls:['guerreiro','cacador','monge'], icon:'armor', look:'#9aa0a8'},
  arcanerobe:{name:'Manto Arcano', slot:'armor', def:5, mag:5, sell:700, lvl:9, cls:MAGES, icon:'robe', look:'#5a2a8a'},
  plate:     {name:'Armadura de Placas', slot:'armor', def:13, sell:900, lvl:12, cls:['guerreiro','cacador'], icon:'armor', look:'#cdd3dc'},
  woodshield:{name:'Escudo de Madeira', slot:'shield', def:3, price:35, lvl:1, icon:'shield', look:'#8a5d33'},
  ironshield:{name:'Escudo de Ferro', slot:'shield', def:6, price:220, lvl:5, icon:'shield', look:'#9ea4ad'},
  towershield:{name:'Escudo Torre', slot:'shield', def:10, sell:700, lvl:12, cls:['guerreiro'], icon:'shield', look:'#5a6a8a'},
  grimoire:  {name:'Grimório', slot:'shield', def:2, mag:3, price:140, lvl:3, cls:MAGES, icon:'book', look:'#6a2a2a'},
  cap:       {name:'Capuz de Couro', slot:'helmet', def:1, price:20, lvl:1, icon:'helmet', look:'#8a5a2a'},
  ironhelm:  {name:'Elmo de Ferro', slot:'helmet', def:4, price:160, lvl:5, icon:'helmet', look:'#a4aab3'},
  boots:     {name:'Botas de Couro', slot:'boots', def:1, price:30, lvl:1, icon:'boots', look:'#5a3a22'},
  fastboots: {name:'Botas Velozes', slot:'boots', def:2, speed:35, sell:600, lvl:10, icon:'boots', look:'#3a8a6a'},
  copperamulet:{name:'Amuleto de Cobre', slot:'amulet', hp:15, price:60, lvl:1, icon:'amulet', look:'#c87a3a'},
  silveramulet:{name:'Amuleto de Prata', slot:'amulet', mp:30, price:180, lvl:4, icon:'amulet', look:'#d8dce4'},
  bonecharm: {name:'Talismã de Ossos', slot:'amulet', crit:3, sell:400, lvl:8, icon:'amulet', look:'#e8e2d0'},
  kingseye:  {name:'Olho do Rei', slot:'amulet', mag:5, crit:3, sell:1800, lvl:16, icon:'amulet', look:'#c06aff'},
  silkrobe:  {name:'Manto de Seda Negra', slot:'armor', def:4, mag:4, sell:500, lvl:7, cls:MAGES, icon:'robe', look:'#2a2030'},
  fangnecklace:{name:'Colar de Presas', slot:'amulet', atk:3, crit:2, sell:700, lvl:9, icon:'amulet', look:'#e8e2d0'},
  usurperhelm:{name:'Elmo do Usurpador', slot:'helmet', def:7, hp:30, sell:1100, lvl:13, icon:'helmet', look:'#c9a440'},
  smallbag:  {name:'Bolsa de Couro', slot:'bag', slots:8, price:150, lvl:1, icon:'bag', look:'#8a5a2a', noRarity:true},
  bigbag:    {name:'Mochila de Aventureiro', slot:'bag', slots:14, price:700, lvl:8, icon:'bag', look:'#5a6a3a', noRarity:true},
  magicbag:  {name:'Mochila Encantada', slot:'bag', slots:20, sell:1500, lvl:15, icon:'bag', look:'#6a3a9a', noRarity:true},
  obsidiansword:{name:'Espada de Obsidiana', slot:'weapon', wk:'blade', atk:32, price:4500, lvl:35, icon:'sword', look:'#5a4a7a'},
  flameaxe:  {name:'Machado Ígneo', slot:'weapon', wk:'blade', atk:42, sell:3000, lvl:55, icon:'axe', look:'#ff7a2a'},
  dragonblade:{name:'Lâmina Dracônica', slot:'weapon', wk:'blade', atk:55, sell:8000, lvl:75, icon:'rune', look:'#ff5a3a'},
  obsidianbow:{name:'Arco de Obsidiana', slot:'weapon', wk:'bow', atk:30, price:4500, lvl:35, icon:'bow', look:'#3a2a4a'},
  flamebow:  {name:'Arco Chamejante', slot:'weapon', wk:'bow', atk:40, sell:3000, lvl:55, icon:'bow', look:'#ff7a2a'},
  dragonbow: {name:'Arco de Osso de Dragão', slot:'weapon', wk:'bow', atk:52, sell:8000, lvl:75, icon:'bow', look:'#e8d8b0'},
  obsidianwand:{name:'Varinha de Obsidiana', slot:'weapon', wk:'wand', atk:20, mag:20, price:4500, lvl:35, icon:'wand', look:'#8a6aff'},
  magmawand: {name:'Cetro de Magma', slot:'weapon', wk:'wand', atk:26, mag:28, sell:3000, lvl:55, icon:'wand', look:'#ffb02a'},
  dragonwand:{name:'Varinha do Dragão', slot:'weapon', wk:'wand', atk:32, mag:38, sell:8000, lvl:75, icon:'wand', look:'#ff3a2a'},
  obsidianstaff:{name:'Cajado de Obsidiana', slot:'weapon', wk:'staff', atk:20, mag:20, price:4500, lvl:35, icon:'staff', look:'#8a6aff'},
  ashstaff:  {name:'Cajado das Cinzas', slot:'weapon', wk:'staff', atk:26, mag:28, sell:3000, lvl:55, icon:'staff', look:'#d8d0c8'},
  dragonstaff:{name:'Cajado Dracônico', slot:'weapon', wk:'staff', atk:32, mag:38, sell:8000, lvl:75, icon:'staff', look:'#ff3a2a'},
  obsidianfists:{name:'Manoplas de Obsidiana', slot:'weapon', wk:'fist', atk:26, price:4500, lvl:35, icon:'fist', look:'#3a2a4a'},
  magmafists:{name:'Punhos de Magma', slot:'weapon', wk:'fist', atk:35, sell:3000, lvl:55, icon:'fist', look:'#ff8a2a'},
  dragonclaws:{name:'Garras de Dragão', slot:'weapon', wk:'fist', atk:46, sell:8000, lvl:75, icon:'fist', look:'#c0301a'},
  obsidianarmor:{name:'Armadura de Obsidiana', slot:'armor', def:20, price:5000, lvl:35, cls:['guerreiro','cacador','monge'], icon:'armor', look:'#3a2a4a'},
  flamerobe: {name:'Manto Ígneo', slot:'armor', def:9, mag:10, price:5000, lvl:35, cls:MAGES, icon:'robe', look:'#c0401a'},
  scalearmor:{name:'Couraça de Escamas', slot:'armor', def:28, hp:80, sell:5000, lvl:60, cls:['guerreiro','cacador','monge'], icon:'armor', look:'#a0301a'},
  dragonrobe:{name:'Manto do Dragão', slot:'armor', def:14, mag:18, sell:5000, lvl:60, cls:MAGES, icon:'robe', look:'#7a101a'},
  obsidianshield:{name:'Escudo de Obsidiana', slot:'shield', def:16, price:4000, lvl:35, icon:'shield', look:'#3a2a4a'},
  scaleshield:{name:'Escudo de Escamas', slot:'shield', def:24, sell:4500, lvl:60, cls:['guerreiro'], icon:'shield', look:'#a0301a'},
  flamegrimoire:{name:'Grimório Flamejante', slot:'shield', def:6, mag:10, price:4500, lvl:40, cls:MAGES, icon:'book', look:'#c0401a'},
  obsidianhelm:{name:'Elmo de Obsidiana', slot:'helmet', def:10, price:3500, lvl:35, icon:'helmet', look:'#3a2a4a'},
  dragonhelm:{name:'Elmo Dracônico', slot:'helmet', def:14, hp:60, sell:4000, lvl:60, icon:'helmet', look:'#a0301a'},
  obsidianboots:{name:'Botas de Obsidiana', slot:'boots', def:6, speed:20, price:3500, lvl:35, icon:'boots', look:'#3a2a4a'},
  emberboots:{name:'Botas de Brasa', slot:'boots', def:8, speed:45, sell:4000, lvl:60, icon:'boots', look:'#ff7a2a'},
  emberamulet:{name:'Amuleto de Brasa', slot:'amulet', hp:80, mag:6, price:5000, lvl:40, icon:'amulet', look:'#ff7a2a'},
  ignivareye:{name:'Olho de Ignivar', slot:'amulet', atk:12, mag:12, crit:6, sell:15000, lvl:85, icon:'amulet', look:'#ffd54a'},
  dragonbag: {name:'Mochila de Couro de Dragão', slot:'bag', slots:28, sell:6000, lvl:50, icon:'bag', look:'#a0301a', noRarity:true},
  hp2:       {name:'Poção de Vida Forte', stack:true, heal:350, price:150, icon:'potion', look:'#ff2a4a'},
  mp2:       {name:'Poção de Mana Forte', stack:true, mana:220, price:120, icon:'potion', look:'#2a8aff'},
  ironwoodsword:{name:'Espada de Carvalho-Ferro', slot:'weapon', wk:'blade', atk:22, price:1800, lvl:22, icon:'sword', look:'#8a9a6a'},
  faeblade:  {name:'Lâmina Feérica', slot:'weapon', wk:'blade', atk:28, sell:1400, lvl:30, icon:'rune', look:'#ff9af0'},
  sylvanbow: {name:'Arco Silvestre', slot:'weapon', wk:'bow', atk:20, price:1800, lvl:22, icon:'bow', look:'#5a8a3a'},
  faebow:    {name:'Arco das Fadas', slot:'weapon', wk:'bow', atk:26, sell:1400, lvl:30, icon:'bow', look:'#ff9af0'},
  dewwand:   {name:'Varinha de Orvalho', slot:'weapon', wk:'wand', atk:12, mag:12, price:1800, lvl:22, icon:'wand', look:'#9ae0ff'},
  dustwand:  {name:'Varinha de Pó de Fada', slot:'weapon', wk:'wand', atk:16, mag:16, sell:1400, lvl:30, icon:'wand', look:'#ff9af0'},
  rootstaff: {name:'Cajado de Raiz-Viva', slot:'weapon', wk:'staff', atk:12, mag:12, price:1800, lvl:22, icon:'staff', look:'#7ad04a'},
  druidstaff:{name:'Cajado do Druida', slot:'weapon', wk:'staff', atk:16, mag:16, sell:1400, lvl:30, icon:'staff', look:'#c8f0a0'},
  barkfists: {name:'Manoplas de Casca', slot:'weapon', wk:'fist', atk:17, price:1800, lvl:22, icon:'fist', look:'#6a4a2a'},
  thornfists:{name:'Punhos de Espinho', slot:'weapon', wk:'fist', atk:22, sell:1400, lvl:30, icon:'fist', look:'#5a8a3a'},
  barkarmor: {name:'Armadura de Casca', slot:'armor', def:12, price:1800, lvl:22, cls:['guerreiro','cacador','monge'], icon:'armor', look:'#6a4a2a'},
  sylvanrobe:{name:'Manto Silvestre', slot:'armor', def:5, mag:6, price:1800, lvl:22, cls:MAGES, icon:'robe', look:'#3a7a4a'},
  guardianarmor:{name:'Armadura do Guardião', slot:'armor', def:16, hp:40, sell:1400, lvl:30, cls:['guerreiro','cacador','monge'], icon:'armor', look:'#4a6a3a'},
  queenrobe: {name:'Manto da Rainha Fada', slot:'armor', def:7, mag:9, sell:1400, lvl:30, cls:MAGES, icon:'robe', look:'#d070c0'},
  rootshield:{name:'Escudo de Raiz', slot:'shield', def:9, price:1500, lvl:22, icon:'shield', look:'#5a3a22'},
  leafcrown: {name:'Coroa de Folhas', slot:'helmet', def:5, mag:3, price:1500, lvl:25, icon:'helmet', look:'#5a9a3a'},
  mossboots: {name:'Botas de Musgo', slot:'boots', def:3, speed:25, price:1600, lvl:25, icon:'boots', look:'#4a7a3a'},
  dewamulet: {name:'Amuleto do Orvalho', slot:'amulet', hp:30, mp:50, price:2000, lvl:25, icon:'amulet', look:'#9ae0ff'},
  faebag:    {name:'Bolsa de Seda Feérica', slot:'bag', slots:18, sell:2500, lvl:25, icon:'bag', look:'#d070c0', noRarity:true},
  hp:        {name:'Poção de Vida', stack:true, heal:80, price:25, icon:'potion', look:'#d23a3a'},
  mp:        {name:'Poção de Mana', stack:true, mana:50, price:20, icon:'potion', look:'#3a6ad2'},
  rattail:   {name:'Rabo de Rato', stack:true, sell:2, icon:'tail'},
  fang:      {name:'Presa de Cobra', stack:true, sell:6, icon:'fang'},
  pelt:      {name:'Pele de Lobo', stack:true, sell:9, icon:'pelt', look:'#8a8c92'},
  silk:      {name:'Seda de Aranha', stack:true, sell:14, icon:'silk'},
  claw:      {name:'Garra de Urso', stack:true, sell:18, icon:'fang', look:'#3a2a1c'},
  bearpelt:  {name:'Pele de Urso', stack:true, sell:30, icon:'pelt', look:'#6a4528'},
  bandana:   {name:'Bandana Rasgada', stack:true, sell:8, icon:'silk', look:'#a03a2a'},
  wing:      {name:'Asa de Morcego', stack:true, sell:6, icon:'wing'},
  bone:      {name:'Osso Antigo', stack:true, sell:5, icon:'bone'},
  crown:     {name:'Coroa das Criptas', stack:true, sell:2000, icon:'crown'},
  ember:     {name:'Brasa Viva', stack:true, sell:60, icon:'dust', look:'#ff7a2a'},
  imphorn:   {name:'Chifre de Diabrete', stack:true, sell:90, icon:'fang', look:'#3a1a1a'},
  magmacore: {name:'Núcleo de Magma', stack:true, sell:180, icon:'dust', look:'#ffb02a'},
  ashbone:   {name:'Osso Calcinado', stack:true, sell:110, icon:'bone'},
  dragonscale:{name:'Escama de Dragão', stack:true, sell:300, icon:'pelt', look:'#b0301a'},
  dragonheart:{name:'Coração de Dragão', stack:true, sell:5000, icon:'heart'},
  fairydust: {name:'Pó de Fada', stack:true, sell:30, icon:'dust', look:'#ff9af0'},
  crystalshard:{name:'Fragmento de Cristal', stack:true, sell:40, icon:'dust', look:'#9ae0ff'},
  faunhorn:  {name:'Chifre de Fauno', stack:true, sell:45, icon:'fang', look:'#c8b090'},
  oakheart:  {name:'Cerne de Carvalho', stack:true, sell:80, icon:'pelt', look:'#6a4a2a'},
  queenwing: {name:'Asa da Rainha Fada', stack:true, sell:1500, icon:'wing'},
  hellfur:   {name:'Pelo Infernal', stack:true, sell:45, icon:'pelt', look:'#3a1a1a'},
  stinger:   {name:'Ferrão Ardente', stack:true, sell:50, icon:'fang', look:'#e0802a'},
  venomgland:{name:'Glândula de Veneno', stack:true, sell:20, icon:'fang', look:'#7ad04a'},
  silverfang:{name:'Presa Prateada', stack:true, sell:60, icon:'fang', look:'#d8dce4'},
  crest:     {name:'Brasão Rasgado', stack:true, sell:25, icon:'silk', look:'#a03a2a'},
  wispdust:  {name:'Pó de Fogo-Fátuo', stack:true, sell:15, icon:'dust', look:'#a0ffd0'},
};
// ---- calças, anéis, aljavas, livro e mochila inicial
Object.assign(ITEMS, {
  basicbag:  {name:'Mochila Simples', slot:'bag', slots:20, price:20, lvl:1, icon:'bag', look:'#7a5634', noRarity:true},
  leatherlegs:{name:'Calça de Couro', slot:'legs', def:1, price:20, lvl:1, icon:'legs', look:'#7a5a3a'},
  chainlegs: {name:'Calça de Malha', slot:'legs', def:3, price:220, lvl:6, cls:['guerreiro','cacador','monge'], icon:'legs', look:'#9aa0a8'},
  platelegs: {name:'Calça de Placas', slot:'legs', def:6, sell:600, lvl:15, cls:['guerreiro','cacador'], icon:'legs', look:'#cdd3dc'},
  sylvanlegs:{name:'Calça Silvestre', slot:'legs', def:4, mag:2, price:1500, lvl:22, icon:'legs', look:'#3a7a4a'},
  barklegs:  {name:'Calça de Casca', slot:'legs', def:6, price:1700, lvl:25, cls:['guerreiro','cacador','monge'], icon:'legs', look:'#6a4a2a'},
  obsidianlegs:{name:'Calça de Obsidiana', slot:'legs', def:9, price:4000, lvl:35, cls:['guerreiro','cacador','monge'], icon:'legs', look:'#3a2a4a'},
  flamelegs: {name:'Calça Ígnea', slot:'legs', def:5, mag:6, price:4000, lvl:35, cls:MAGES, icon:'legs', look:'#c0401a'},
  dragonlegs:{name:'Calça Dracônica', slot:'legs', def:12, hp:50, sell:4500, lvl:60, icon:'legs', look:'#a0301a'},
  copperring:{name:'Anel de Cobre', slot:'ring', hp:10, price:50, lvl:1, icon:'ring', look:'#c87a3a'},
  strengthring:{name:'Anel da Força', slot:'ring', atk:3, price:400, lvl:10, icon:'ring', look:'#c03a2a'},
  arcanering:{name:'Anel Arcano', slot:'ring', mag:4, mp:20, price:400, lvl:10, icon:'ring', look:'#6a6aff'},
  dewring:   {name:'Anel do Orvalho', slot:'ring', hp:40, regen:2, price:1800, lvl:25, icon:'ring', look:'#9ae0ff'},
  emberring: {name:'Anel de Brasa', slot:'ring', atk:5, crit:4, price:4500, lvl:40, icon:'ring', look:'#ff7a2a'},
  dragonring:{name:'Anel do Dragão', slot:'ring', atk:8, mag:8, crit:3, sell:6000, lvl:70, icon:'ring', look:'#ffd54a'},
  leatherquiver:{name:'Aljava de Couro', slot:'shield', ok:'quiver', atk:2, price:40, lvl:1, icon:'quiver', look:'#8a5a2a'},
  reinforcedquiver:{name:'Aljava Reforçada', slot:'shield', ok:'quiver', atk:4, crit:2, price:600, lvl:15, icon:'quiver', look:'#6a4a2a'},
  faequiver: {name:'Aljava Feérica', slot:'shield', ok:'quiver', atk:7, crit:3, price:2000, lvl:25, icon:'quiver', look:'#ff9af0'},
  emberquiver:{name:'Aljava de Brasa', slot:'shield', ok:'quiver', atk:10, crit:4, price:4500, lvl:40, icon:'quiver', look:'#ff7a2a'},
  leafbook:  {name:'Livro das Folhas', slot:'shield', ok:'book', def:4, mag:6, price:1700, lvl:22, cls:MAGES, icon:'book', look:'#3a7a4a'},
});
Object.assign(ITEMS, {
  warscepter:{name:'Cetro de Guerra', slot:'weapon', wk:'wand', hands:2, atk:9, mag:10, price:650, lvl:12, icon:'staff', look:'#c06aff'},
  stormscepter:{name:'Cetro das Tempestades', slot:'weapon', wk:'wand', hands:2, atk:18, mag:26, sell:1600, lvl:30, icon:'staff', look:'#fff07a'},
  archscepter:{name:'Cetro do Arquimago', slot:'weapon', wk:'wand', hands:2, atk:30, mag:46, sell:6000, lvl:60, icon:'staff', look:'#ff5aff'},
  greatoak:  {name:'Cajado Grande de Carvalho', slot:'weapon', wk:'staff', hands:2, atk:9, mag:10, price:650, lvl:12, icon:'staff', look:'#5ab04a'},
  elderwood: {name:'Cajado do Bosque Antigo', slot:'weapon', wk:'staff', hands:2, atk:18, mag:26, sell:1600, lvl:30, icon:'staff', look:'#c8f0a0'},
  eldertree: {name:'Cajado do Ancião', slot:'weapon', wk:'staff', hands:2, atk:30, mag:46, sell:6000, lvl:60, icon:'staff', look:'#ffd54a'},
  ironquarter:{name:'Bastão de Ferro', slot:'weapon', wk:'fist', hands:2, atk:15, atkspd:-15, price:700, lvl:12, icon:'quarter', look:'#a4aab3'},
  faequarter:{name:'Bastão Feérico', slot:'weapon', wk:'fist', hands:2, atk:28, atkspd:-15, sell:1600, lvl:30, icon:'quarter', look:'#ff9af0'},
  dragonquarter:{name:'Bastão do Dragão', slot:'weapon', wk:'fist', hands:2, atk:54, atkspd:-15, sell:6000, lvl:60, icon:'quarter', look:'#c0301a'},
});
for(const id of ['shortbow','longbow','yewbow','windbow','sylvanbow','faebow','obsidianbow','flamebow','dragonbow','axe','hammer','flameaxe']) ITEMS[id].hands=2;
for(const d of Object.values(ITEMS)) if(d.slot==='shield' && !d.ok) d.ok = d.icon==='book' ? 'book' : 'shield';
Object.assign(ITEMS.smallbag,{slots:8}); Object.assign(ITEMS.bigbag,{slots:26}); Object.assign(ITEMS.magicbag,{slots:32}); Object.assign(ITEMS.faebag,{slots:30}); Object.assign(ITEMS.dragonbag,{slots:40});
CLASSES.cacador.start=['shortbow','tunic','leatherquiver'];
const SLOTS = [['amulet','Colar'],['helmet','Elmo'],['bag','Mochila'],['weapon','Arma'],['armor','Armadura'],['shield','Mão esq.'],['ring','Anel'],['legs','Calça'],['boots','Botas']];
const SLOT_ORDER = {weapon:0,armor:1,shield:2,helmet:3,legs:4,boots:5,amulet:6,ring:7,bag:8};


// ============================================================ raridade
const RAR = ['Comum','Incomum','Raro','Épico','Lendário'];
const RAR_COL = ['#d8d0bc','#5fd068','#4fa3ff','#c06aff','#ff9a2a'];
const RAR_SELL = [1,2,3.5,6,10];
const LEG_SUFFIX = ['da Aurora','do Abismo','dos Antigos','da Tempestade','do Último Rei','das Brumas'];
const AFF = {
  atk:{l:'ataque',min:1,max:3,sc:1}, mag:{l:'poder mágico',min:1,max:3,sc:1}, def:{l:'defesa',min:1,max:2,sc:1},
  hp:{l:'vida máxima',min:8,max:20,sc:1}, mp:{l:'mana máxima',min:6,max:15,sc:1},
  crit:{l:'chance de crítico',min:1,max:3,pct:1}, critdmg:{l:'dano crítico',min:8,max:20,pct:1},
  atkspd:{l:'velocidade de ataque',min:4,max:10,pct:1}, lifesteal:{l:'roubo de vida',min:1,max:3,pct:1},
  regen:{l:'regeneração de vida',min:1,max:2,sc:.5}, speed:{l:'velocidade de movimento',min:8,max:18},
};
const AFF_SLOT = {weapon:['atk','crit','critdmg','atkspd','lifesteal'], weaponMag:['mag','crit','critdmg','atkspd','mp'],
  armor:['def','hp','mp','regen','mag'], shield:['def','hp','crit','mag','regen'], helmet:['def','hp','mp','mag','crit'],
  boots:['speed','def','hp','regen'], legs:['def','hp','regen','speed'], ring:['atk','mag','crit','critdmg','hp','mp','lifesteal'], amulet:['hp','mp','crit','critdmg','mag','atk','lifesteal','regen']};
function rollRarity(lvl, boss){
  const luck=1+lvl/20, w=[60,25,10*luck,4*luck,1*luck]; if(boss){ w[0]=0; w[1]=0; }
  let r=R()*w.reduce((a,b)=>a+b); for(let i=0;i<5;i++){ if((r-=w[i])<0) return i; } return 0;
}
function makeItem(id, r=0, il=1){
  const d=ITEMS[id], it={id, n:1, r, a:[]};
  if(!d.slot || r===0 || d.noRarity){ it.r=0; return it; }
  const pool=[...((d.slot==='weapon'&&(d.wk==='wand'||d.wk==='staff'))||d.ok==='book' ? AFF_SLOT.weaponMag : d.ok==='quiver' ? AFF_SLOT.weapon : AFF_SLOT[d.slot])];
  const tm=[0,1,1.25,1.5,2][r];
  for(let i=0;i<r && pool.length;i++){
    const k=pool.splice(Math.floor(R()*pool.length),1)[0], A=AFF[k], sc=A.sc?1+il*A.sc/8:1;
    it.a.push({k, v:Math.max(1,Math.round((A.min+R()*(A.max-A.min))*sc*tm))});
  }
  if(r===4) it.s=LEG_SUFFIX[ri(0,LEG_SUFFIX.length-1)];
  return it;
}
function canUse(d, cls=player.cls){
  const C=CLASSES[cls]; if(!d.slot) return true;
  if(d.slot==='weapon' && d.wk!=='any' && !C.wk.includes(d.wk)) return false;
  if(d.cls && !d.cls.includes(cls)) return false;
  if(d.slot==='shield'){ if(d.ok==='quiver') return cls==='cacador'; if(C.noShield) return false; }
  return true;
}
function restrictText(d){
  if(d.slot==='weapon' && d.wk!=='any') return 'só '+CLASS_ORDER.filter(c=>CLASSES[c].wk.includes(d.wk)).map(c=>CLASSES[c].name).join(', ');
  if(d.cls) return 'só '+d.cls.map(c=>CLASSES[c].name).join(', ');
  if(d.slot==='shield') return d.ok==='quiver' ? 'só Caçador' : 'Caçador e Monge não usam escudo';
  return '';
}
const itemName = it => ITEMS[it.id].name + (it.s?' '+it.s:'');
const sellPrice = it => { const d=ITEMS[it.id]; return Math.floor((d.sell ?? Math.floor((d.price||0)*0.4)) * RAR_SELL[it.r||0]); };
function statLines(it){
  const d=ITEMS[it.id], s=[];
  if(d.atk) s.push('Ataque +'+d.atk); if(d.mag) s.push('Magia +'+d.mag); if(d.def) s.push('Defesa +'+d.def);
  if(d.hp) s.push('Vida +'+d.hp); if(d.mp) s.push('Mana +'+d.mp); if(d.crit) s.push('Crítico +'+d.crit+'%'); if(d.speed) s.push('Velocidade +'+d.speed); if(d.slots) s.push('Capacidade: '+d.slots+' itens'); if(d.hands===2) s.push('Duas mãos'); if(d.atkspd) s.push('Vel. de ataque '+(d.atkspd>0?'+':'')+d.atkspd+'%'); if(d.regen) s.push('Regeneração +'+d.regen);
  if(d.heal) s.push('Cura '+d.heal); if(d.mana) s.push('Mana +'+d.mana);
  if(bladeKind(d)) s.push(BLADE_TXT[bladeKind(d)]);
  if(d.warm===true) s.push('Protege do frio dos Fiordes'); if(d.warm>1) s.push('Aquece por 10 min (protege do frio)'); if(d.gill) s.push('Debaixo d\'água, o fôlego dura o dobro'); if(d.air) s.push('Enche o fôlego debaixo d\'água');
  if(d.ammo){ s.push('Flecha: '+AMMO[d.ammo].txt); s.push('Só Caçador · nível '+(d.lvl||1)+' · gasta 1 por tiro'); s.push(player.ammo===it.id?'Ativa (clique para voltar à comum)':'Clique para usar'); }
  if(d.set&&SETS[d.set]){ const S=SETS[d.set], have=Object.values(player.eq||{}).filter(x=>x&&ITEMS[x.id]?.set===d.set).length; s.push(S.name+' ('+have+'/4)'); s.push('2 peças: '+setBonusTxt(S.b2)); s.push('4 peças: '+setBonusTxt(S.b4)); }
  return s;
}
const affLine = a => '+'+a.v+(AFF[a.k].pct?'%':'')+' '+AFF[a.k].l;
function itemSub(it, opts={}){
  const d=ITEMS[it.id], parts=[];
  if(it.r) parts.push(`<span class="rn r${it.r}">${RAR[it.r]}</span>`);
  const sl=statLines(it); if(sl.length) parts.push(sl.join(', '));
  for(const a of it.a||[]) parts.push(`<span class="aff">${affLine(a)}</span>`);
  if(d.slot){ if(!canUse(d)) parts.push(`<span class="bad">${restrictText(d)}</span>`); if((d.lvl||1)>player.level) parts.push(`<span class="bad">requer nível ${d.lvl}</span>`); }
  if(!d.slot && !d.heal && !d.mana && opts.sell!==false) parts.push('vende por '+sellPrice(it)+' ouro');
  return parts.join(' · ');
}

// ícones de itens desenhados em código
const iconCache = {};
function iconCanvasOld(id){
  const c=document.createElement('canvas'); c.width=c.height=24; const g=c.getContext('2d'); const d=ITEMS[id]; const L=d.look||'#ccc';
  const r=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  switch(d.icon){
    case 'quarter': for(let i=0;i<18;i++) r('#6a4a2a',3+i,21-i,2,2); r(L,2,19,4,4); r(L,19,2,4,4); r(L,10,10,4,4); break;
    case 'legs': r(L,6,3,12,4); r(L,6,7,5,15); r(L,13,7,5,15); r('rgba(0,0,0,.3)',11,7,2,8); r('#2a1a10',6,20,5,2); r('#2a1a10',13,20,5,2); break;
    case 'ring': g.strokeStyle='#c9a440'; g.lineWidth=2.5; g.beginPath(); g.arc(12,14,6,0,7); g.stroke(); g.fillStyle=L; g.beginPath(); g.arc(12,7,3.5,0,7); g.fill(); r('#ffffff',11,6,1,1); break;
    case 'quiver': for(let i=0;i<12;i++) r('#5a3a1c',6+i,18-i,4,4); r(L,8,8,6,12); for(const fx of [14,17,20]) { r('#e8e0cc',fx,2,2,6); r('#c03a2a',fx,1,2,2); } break;
    case 'bag': r('#2a1a10',4,7,16,15); r(L,5,8,14,13); r(L,7,4,10,4); r('rgba(0,0,0,.25)',5,13,14,2); r('#c9a440',11,14,3,3); r('#2a1a10',9,3,6,2); break;
    case 'kheart': g.fillStyle='#4a1a40'; g.beginPath(); g.moveTo(12,21); g.bezierCurveTo(1,13,4,3,12,8); g.bezierCurveTo(20,3,23,13,12,21); g.fill(); g.fillStyle='#a03a8a'; g.beginPath(); g.moveTo(12,19); g.bezierCurveTo(3,12,5,5,12,9); g.bezierCurveTo(19,5,21,12,12,19); g.fill();
      g.strokeStyle='#a03a8a'; g.lineWidth=2; g.beginPath(); g.moveTo(12,20); g.quadraticCurveTo(8,23,4,21); g.moveTo(12,20); g.quadraticCurveTo(17,24,21,20); g.stroke(); for(const [px,py] of [[9,10],[14,9],[11,14],[15,13]]) r('#f0c8e0',px,py,2,2); break;
    case 'krakeye': g.strokeStyle='#c9a440'; g.lineWidth=1.5; g.beginPath(); g.arc(12,6,6,Math.PI*0.1,Math.PI*0.9,true); g.stroke(); g.fillStyle='#c9a440'; g.beginPath(); g.ellipse(12,15,9,6,0,0,7); g.fill(); g.fillStyle='#2a5a9a'; g.beginPath(); g.ellipse(12,15,7.5,4.6,0,0,7); g.fill();
      g.fillStyle='#ffe07a'; g.beginPath(); g.ellipse(12,15,4.4,3.6,0,0,7); g.fill(); r('#120a10',11,12,2,6); r('#ffffff',14,13,1,1); break;
    case 'dragoneye': g.strokeStyle='#c9a440'; g.lineWidth=1.5; g.beginPath(); g.arc(12,6,6,Math.PI*0.1,Math.PI*0.9,true); g.stroke(); g.fillStyle='#5a1a10'; g.beginPath(); g.moveTo(2,15); g.quadraticCurveTo(12,4,22,15); g.quadraticCurveTo(12,26,2,15); g.fill();
      g.fillStyle='#ffb02a'; g.beginPath(); g.ellipse(12,15,6,4.4,0,0,7); g.fill(); g.fillStyle='#ffe07a'; g.beginPath(); g.ellipse(12,15,3.6,3,0,0,7); g.fill(); r('#1a0a06',11,11,2,8); break;
    case 'fairywing': for(const [cx,cy,rx,ry,a,col] of [[9,9,6,8,-.5,'#ff9af0'],[15,9,6,8,.5,'#9ae0ff'],[9,17,4,5,.4,'#c8a0ff'],[15,17,4,5,-.4,'#fff0a0']]){ g.fillStyle=col; g.globalAlpha=.85; g.beginPath(); g.ellipse(cx,cy,rx,ry,a,0,7); g.fill(); } g.globalAlpha=1; r('#4a2a3a',11,6,2,14); r('#ffffff',7,6,1,1); r('#ffffff',16,7,1,1); break;
    case 'prism': { const gr=g.createLinearGradient(4,4,20,20); gr.addColorStop(0,'#a0ffd0'); gr.addColorStop(.5,'#9ad8ff'); gr.addColorStop(1,'#ff9af0'); g.fillStyle=gr; g.beginPath(); g.moveTo(12,2); g.lineTo(21,12); g.lineTo(12,22); g.lineTo(3,12); g.fill(); g.strokeStyle='rgba(255,255,255,.8)'; g.lineWidth=1; g.beginPath(); g.moveTo(12,2); g.lineTo(12,22); g.moveTo(3,12); g.lineTo(21,12); g.stroke(); break; }
    case 'icecrown': r('#9ac8e8',3,13,18,7); for(const [x0,h] of [[3,8],[7,11],[11,13],[15,11],[19,8]]){ g.fillStyle='#e8f4fc'; g.beginPath(); g.moveTo(x0,13); g.lineTo(x0+1.5,13-h); g.lineTo(x0+3,13); g.fill(); } r('#3a8ad8',11,15,3,3); r('#ffffff',5,15,2,1); r('#ffffff',17,15,2,1); break;
    case 'tusk': g.fillStyle='#f0e8d0'; g.beginPath(); g.moveTo(6,3); g.quadraticCurveTo(4,16,14,21); g.lineTo(17,19); g.quadraticCurveTo(9,14,10,3); g.fill(); r('#c8b890',6,3,4,2); g.fillStyle='#f0e8d0'; g.beginPath(); g.moveTo(15,3); g.quadraticCurveTo(13,13,20,18); g.lineTo(21,16); g.quadraticCurveTo(17,12,18,3); g.fill(); r('#c8b890',15,3,3,2); break;
    case 'pearl': g.fillStyle='#e8c8b0'; g.beginPath(); g.ellipse(12,16,10,6,0,0,Math.PI); g.fill(); g.fillStyle='#c8a890'; g.beginPath(); g.ellipse(12,16,10,2,0,0,7); g.fill(); g.fillStyle=L; g.beginPath(); g.arc(12,12,5,0,7); g.fill(); r('#ffffff',10,9,2,2); r('rgba(255,255,255,.4)',13,13,2,1); break;
    case 'heart': g.fillStyle='#c0201a'; g.beginPath(); g.moveTo(12,21); g.bezierCurveTo(1,13,4,3,12,8); g.bezierCurveTo(20,3,23,13,12,21); g.fill(); r('#ff6a5a',7,8,3,2); break;
    case 'dust': for(let i=0;i<14;i++){ const a=i*2.4, rr=2+i*0.6; r(i%3?L:'#ffffff',12+Math.cos(a)*rr,12+Math.sin(a)*rr,2,2); } break;
    case 'bow': g.strokeStyle=L; g.lineWidth=3; g.beginPath(); g.arc(4,12,14,-1.0,1.0); g.stroke(); g.strokeStyle='#e8e0cc'; g.lineWidth=1; g.beginPath(); g.moveTo(4+14*Math.cos(-1),12+14*Math.sin(-1)); g.lineTo(4+14*Math.cos(1),12+14*Math.sin(1)); g.stroke(); r('#c8a070',6,11,12,2); r('#e8e8e8',17,10,3,4); break;
    case 'wand': for(let i=0;i<10;i++) r('#4a2e1a',5+i,19-i,2,2); g.fillStyle=L; g.beginPath(); g.arc(17,6,4,0,7); g.fill(); r('#ffffff',16,4,2,2); break;
    case 'staff': for(let i=0;i<16;i++) r('#6a4a2a',3+i,21-i,2,2); g.fillStyle=L; g.beginPath(); g.arc(19,5,4.5,0,7); g.fill(); r('#ffffff',18,3,2,2); break;
    case 'fist': r(L,5,8,14,11); r(L,5,5,3,4); r(L,9,4,3,5); r(L,13,4,3,5); r(L,17,5,3,4); r('rgba(0,0,0,.3)',5,15,14,2); r('#2a2018',7,19,10,3); break;
    case 'hammer': for(let i=0;i<13;i++) r('#5a3a1c',5+i,20-i,2,2); r(L,12,2,10,8); r('#e8ecf0',12,2,10,2); break;
    case 'robe': r(L,6,4,12,17); r(L,4,18,16,3); r(L,2,6,4,8); r(L,18,6,4,8); r('#ffd54a',11,4,2,14); r('#13100d',9,3,6,2); break;
    case 'book': r('#2a1810',4,3,16,19); r(L,5,4,14,17); r('#e8dcb8',17,5,2,15); r('#ffd54a',9,9,6,6); r(L,10,10,4,4); break;
    case 'amulet': g.strokeStyle='#c9a440'; g.lineWidth=1.5; g.beginPath(); g.arc(12,8,7,Math.PI*0.1,Math.PI*0.9,true); g.stroke(); g.fillStyle='#c9a440'; g.beginPath(); g.arc(12,16,5,0,7); g.fill(); g.fillStyle=L; g.beginPath(); g.arc(12,16,3.2,0,7); g.fill(); r('#ffffff',11,14,1,1); break;
    case 'gold': r('#8a6410',5,13,10,6); r('#f0c44a',5,12,10,5); r('#8a6410',9,8,10,6); r('#ffd86a',9,7,10,5); r('#fff1b0',11,8,3,1); break;
    case 'dagger': r('#5a3a22',5,17,3,4); r('#8a7a4a',4,15,6,2); for(let i=0;i<8;i++) r(L,8+i,14-i,2,2); break;
    case 'club': for(let i=0;i<12;i++) r(i>7?'#5a3a1c':L,6+i,18-i,i>7?4:3,i>7?4:3); break;
    case 'sword': case 'rune': r('#5a3a22',4,18,3,3); r('#c9a440',3,15,7,2); for(let i=0;i<12;i++) r(L,7+i,13-i,2,2); if(d.icon==='rune'){g.globalAlpha=.4;for(let i=0;i<12;i++) r('#bff0ff',6+i,12-i,4,4);g.globalAlpha=1;} break;
    case 'axe': for(let i=0;i<14;i++) r('#6a4a2a',5+i,19-i,2,2); r(L,13,3,7,9); r('#e8ecf0',18,3,2,9); break;
    case 'armor': r(L,5,5,14,15); r('#000',5,5,14,1); g.globalAlpha=.25; r('#000',11,6,2,14); g.globalAlpha=1; r(L,2,6,4,7); r(L,18,6,4,7); r('#13100d',9,4,6,3); break;
    case 'shield': r('#2a2018',4,3,16,18); r(L,5,4,14,15); r(L,7,19,10,2); r('#e0d6b8',11,6,2,11); break;
    case 'helmet': r(L,5,7,14,10); r(L,7,5,10,3); r('#13100d',8,13,8,3); r('#fff',8,7,3,1); break;
    case 'boots': r(L,5,6,5,13); r(L,5,16,9,4); r(L,13,6,5,13); r(L,13,16,9,4); r('#000',5,19,17,1); break;
    case 'arrow': for(let i=0;i<13;i++) r('#8a6a3a',4+i,19-i,2,2); r(L,15,3,6,2); r(L,19,3,2,6); r(L,17,5,2,2); r('#e8e0cc',3,17,2,4); r('#e8e0cc',5,19,4,2); r('#c8b890',2,20,3,2); break;
    case 'potion': r('#d8d0bc',10,3,4,4); r('#6a4a2a',10,2,4,2); r('#e8e4dc',6,7,12,13); r(L,7,10,10,9); r('#ffffff',8,10,2,4); break;
    case 'tail': g.strokeStyle='#d88a9a'; g.lineWidth=2; g.beginPath(); g.moveTo(4,20); g.quadraticCurveTo(20,20,14,8); g.quadraticCurveTo(10,2,18,4); g.stroke(); break;
    case 'fang': g.fillStyle=d.look||'#f2ecd8'; g.beginPath(); g.moveTo(7,4); g.lineTo(17,4); g.lineTo(12,21); g.fill(); r('#c8bfa8',7,4,10,2); break;
    case 'pelt': g.fillStyle=L; g.beginPath(); g.ellipse(12,12,9,7,0.3,0,7); g.fill(); r(L,3,6,4,4); r(L,17,15,4,4); r(L,3,15,3,3); r(L,18,5,3,3); break;
    case 'silk': g.strokeStyle=d.look||'#f0ece0'; g.lineWidth=1; for(let i=0;i<4;i++){g.beginPath();g.arc(12,12,3+i*3,0,7);g.stroke();} g.beginPath(); for(let a=0;a<6;a++){g.moveTo(12,12);g.lineTo(12+Math.cos(a)*11,12+Math.sin(a)*11);} g.stroke(); break;
    case 'wing': g.fillStyle='#3b3040'; g.beginPath(); g.moveTo(3,8); g.lineTo(21,6); g.lineTo(18,12); g.lineTo(14,10); g.lineTo(11,16); g.lineTo(8,11); g.lineTo(3,14); g.fill(); break;
    case 'bone': r('#e8e2d0',6,11,12,3); r('#e8e2d0',4,9,4,3); r('#e8e2d0',4,13,4,3); r('#e8e2d0',16,9,4,3); r('#e8e2d0',16,13,4,3); break;
    case 'crown': r('#c9a020',4,10,16,9); r('#f0c84a',4,6,3,6); r('#f0c84a',10,4,4,8); r('#f0c84a',17,6,3,6); r('#c03a5a',11,12,3,3); r('#3a8ad0',6,13,2,2); r('#3a8ad0',16,13,2,2); break;
  }
  return c;
}
function iconURLOld(id){ return iconCache[id]||(iconCache[id]=iconCanvasOld(id).toDataURL()); }

// ============================================================ ícones 32×32 com a identidade de cada ilha
// Cada região tem um "kit" (metal, madeira, couro, pano, detalhe, gema) e um enfeite próprio.
const KIT={
  stone:{name:'Pedraluz', m:['#4a4c54','#8a8e96','#d0d4da'], w:['#3e2814','#6e4a28','#a0723e'], l:['#3e2414','#7a4a24','#b07a42'], c:['#4a3e30','#8a7656','#c4b088'], a:['#8a6a22','#d8b04a'], gem:['#2a5aa0','#7ab8f8'], o:'#160e08', motif:'stitch'},
  crypt:{name:'Cripta e Castelo', m:['#24222c','#4a4858','#8a88a0'], w:['#2a1c14','#4a3222','#6a4a32'], l:['#2a1c22','#4a2e3a','#6e4a5a'], c:['#2a1a34','#4a2a5a','#7a4a8a'], a:['#8a6a22','#e0b84a'], gem:['#6a2aa0','#c88af8'], o:'#0c0a10', motif:'skull'},
  fae:  {name:'Lunária', m:['#2e5244','#6a9a80','#c0e8cc'], w:['#2e4a1a','#5a8a32','#9ad05a'], l:['#3a2a18','#6a4a2a','#9a7044'], c:['#1e4a2a','#3a7a44','#7ac07a'], a:['#c0508a','#ffb0e8'], gem:['#2a8ac0','#bff0ff'], o:'#0c1a0e', motif:'leaf'},
  fire: {name:'Cinzaforte', m:['#141016','#3a2e3e','#7a6a8a'], w:['#160e0a','#3a2216','#5e3a22'], l:['#4a1208','#962a14','#d4582a'], c:['#300e0e','#701e14','#b0401e'], a:['#d0400a','#ffd04a'], gem:['#d0300a','#ffe07a'], o:'#080404', motif:'crack'},
  ice:  {name:'Invernália', m:['#4a6a88','#9ac0dc','#f0faff'], w:['#3e4c5a','#6e8090','#aebccc'], l:['#9a9284','#d8d0c0','#ffffff'], c:['#2a4a6a','#5a84b0','#a8d0f0'], a:['#7ab0d8','#ffffff'], gem:['#2a6ad0','#a8e4ff'], o:'#0c1622', motif:'frost'},
  sea:  {name:'Coralina', m:['#5a4a6e','#b0a4c8','#f6eeff'], w:['#7a1e30','#cc4c64','#ff9c8c'], l:['#2e3c4c','#5c6e80','#9aaebe'], c:['#124a4c','#248a7c','#5ad8c4'], a:['#2aa8a0','#c8fff0'], gem:['#e0d8f0','#ffffff'], o:'#08121c', motif:'bubble'},
};
const RX=[[/Obsidiana|Dragão|Dracônic|Ígne|Magma|Brasa|Ignivar|Escamas|Chamejante|Flamejante|Cinzas|Infernal|Diabrete/,'fire'],
  [/Feéric|Fada|Silvestre|Orvalho|Casca|Raiz|Folhas|Musgo|Druida|Carvalho|Espinho|Fauno/,'fae'],
  [/Gelo|Glacial|Nevasca|Inverno|Boreal|Ieti|Geada|Aurora|Neve|Pele/,'ice'],
  [/Coral|Pérola|Concha|Maré|Abissal|Barbatana|Tubarão|Guelras|Kraken/,'sea'],
  [/Rúnic|do Rei|Usurpador|Ossos|Torre|Placas|Seda Negra|Coroa das Criptas|Presas/,'crypt']];
const MAT_REGION={rattail:'stone',fang:'stone',pelt:'stone',silk:'crypt',claw:'stone',bearpelt:'stone',bandana:'stone',wing:'crypt',bone:'crypt',crown:'crypt',crest:'crypt',wispdust:'stone',venomgland:'stone',silverfang:'stone',
  ember:'fire',imphorn:'fire',magmacore:'fire',ashbone:'fire',dragonscale:'fire',dragonheart:'fire',hellfur:'fire',stinger:'fire',fairydust:'fae',crystalshard:'fae',faunhorn:'fae',oakheart:'fae',queenwing:'fae'};
function itemRegion(id){ const d=ITEMS[id]; if(!d) return 'stone';
  if(d.set&&SETS[d.set]) return SETS[d.set].lvl<=15?'stone':SETS[d.set].lvl<=40?'fire':'ice';
  if(MAT_REGION[id]) return MAT_REGION[id];
  for(const [re,rg] of RX) if(re.test(d.name)&&(rg==='crypt'||(d.lvl||1)>=20||!d.slot)) return rg;
  if(d.warm||id==='frostfur'||id==='walrustusk'||id==='icecore'||id==='frostscale'||id==='auroraglass') return 'ice';
  if(d.air||['crabshell','pearl','jellygel','sharktooth','abysscore','levheart'].includes(id)) return 'sea';
  const L=d.lvl||1; return L<20?'stone':L<35?'fae':L<70?'fire':L<90?'ice':'sea'; }
const hashStr=s=>{ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; };
function iconPost(g,K,sparkle){
  const im=g.getImageData(0,0,32,32), D=im.data, A=i=>D[i*4+3];
  for(let i=0;i<1024;i++){ if(D[i*4+3]>=110) D[i*4+3]=255; else D[i*4+3]=0; }
  const op=new Uint8Array(1024); for(let i=0;i<1024;i++) op[i]=A(i)?1:0;
  const at=(x,y)=>x<0||y<0||x>31||y>31?0:op[y*32+x];
  const mix=(i,t,k)=>{ D[i*4]=D[i*4]+(t-D[i*4])*k; D[i*4+1]=D[i*4+1]+(t-D[i*4+1])*k; D[i*4+2]=D[i*4+2]+(t-D[i*4+2])*k; };
  for(let y=0;y<32;y++) for(let x=0;x<32;x++){ const i=y*32+x; if(!op[i]) continue;
    if(!at(x-1,y)||!at(x,y-1)) mix(i,255,.22); else if(!at(x+1,y)||!at(x,y+1)) mix(i,0,.22); }
  const oc=[parseInt(K.o.slice(1,3),16),parseInt(K.o.slice(3,5),16),parseInt(K.o.slice(5,7),16)];
  for(let y=0;y<32;y++) for(let x=0;x<32;x++){ const i=y*32+x; if(op[i]) continue; if(at(x-1,y)||at(x+1,y)||at(x,y-1)||at(x,y+1)){ D[i*4]=oc[0]; D[i*4+1]=oc[1]; D[i*4+2]=oc[2]; D[i*4+3]=255; } }
  g.putImageData(im,0,0);
  if(sparkle) for(const [sx,sy] of sparkle){ g.fillStyle='#ffffff'; g.fillRect(sx,sy-1,1,3); g.fillRect(sx-1,sy,3,1); g.fillStyle='rgba(255,255,255,.6)'; g.fillRect(sx-2,sy,1,1); g.fillRect(sx+2,sy,1,1); }
}
const iconCache2={};
function iconURL2(id){
  if(iconCache2[id]) return iconCache2[id];
  const d=ITEMS[id], rg=itemRegion(id), K=KIT[rg], h=hashStr(id), rn=mulberry32(h), v=h%6, lv=d.lvl||1, hi=lv>=60||d.sell>=5000;
  const TR=d.set?d.look:K.a[1], L=d.set?(K.motif==='stitch'?K.l[1]:K.motif==='frost'?K.c[1]:K.m[1]):(d.look||K.m[1]);
  const c=document.createElement('canvas'); c.width=c.height=32; const g=c.getContext('2d');
  const r=(col,x,y,w,hh)=>{ g.fillStyle=col; g.fillRect(x,y,w,hh); };
  const P=(col,pts)=>{ g.fillStyle=col; g.beginPath(); g.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) g.lineTo(pts[i],pts[i+1]); g.closePath(); g.fill(); };
  const ln=(col,x0,y0,x1,y1,w=2)=>{ g.strokeStyle=col; g.lineWidth=w; g.lineCap='round'; g.beginPath(); g.moveTo(x0,y0); g.lineTo(x1,y1); g.stroke(); };
  const qc=(col,x0,y0,cx,cy,x1,y1,w=2)=>{ g.strokeStyle=col; g.lineWidth=w; g.lineCap='round'; g.beginPath(); g.moveTo(x0,y0); g.quadraticCurveTo(cx,cy,x1,y1); g.stroke(); };
  const ci=(col,x,y,rad)=>{ g.fillStyle=col; g.beginPath(); g.arc(x,y,rad,0,7); g.fill(); };
  const el=(col,x,y,rx,ry,a=0)=>{ g.fillStyle=col; g.beginPath(); g.ellipse(x,y,rx,ry,a,0,7); g.fill(); };
  const gem=(x,y,rad,cols)=>{ const G=cols||K.gem; ci(G[0],x,y,rad); ci(G[1],x-rad*0.3,y-rad*0.3,rad*0.45); };
  const leaf=(x,y,a,s=1)=>{ el(K.w[1],x,y,3*s,1.6*s,a); ln(K.w[2],x-Math.cos(a)*2*s,y-Math.sin(a)*2*s,x+Math.cos(a)*2*s,y+Math.sin(a)*2*s,0.8); };
  const spike=(x,y,a,len,col)=>{ const cx=Math.cos(a), cy=Math.sin(a), px=-cy, py=cx; P(col||K.m[2],[x+px*1.6,y+py*1.6, x-px*1.6,y-py*1.6, x+cx*len,y+cy*len]); };
  const motifOn=(x,y,s=1)=>{ // pequeno enfeite da região num ponto
    if(K.motif==='leaf'){ leaf(x-2*s,y,-.6,s*0.9); leaf(x+2*s,y,.6,s*0.9); }
    else if(K.motif==='crack'){ r(K.a[0],x-1,y-2,1,2); r(K.a[1],x,y,1,2); r(K.a[0],x+1,y+2,1,1); }
    else if(K.motif==='frost'){ spike(x,y,-Math.PI/2,4*s,'#e8f8ff'); spike(x-2,y,-Math.PI/2-0.6,3*s,'#c8ecff'); spike(x+2,y,-Math.PI/2+0.6,3*s,'#c8ecff'); }
    else if(K.motif==='bubble'){ ci(K.a[1],x,y,1.6*s); ci(K.a[0],x+2,y-2,1.1*s); }
    else if(K.motif==='skull'){ ci('#e8e0d0',x,y,2.2*s); r('#1a1210',x-1,y-1,1,1); r('#1a1210',x+1,y-1,1,1); }
    else { r(K.a[1],x,y,1,1); r(K.a[1],x-2,y,1,1); r(K.a[1],x+2,y,1,1); } };
  let spark=null; const kind=d.icon;
  const blade=()=>{ const curve=v%3===1, wide=v%3===2, bw=wide?4.2:3;
      const tipX=27, tipY=4;
      if(curve){ qc(K.m[0],11,21,24,18,tipX,tipY,bw+1.2); qc(L,11,21,24,18,tipX,tipY,bw); qc(K.m[2],12,19,22,15,tipX-1,tipY+1,1); }
      else { ln(K.m[0],11,21,tipX,tipY,bw+1.2); ln(L,11,21,tipX,tipY,bw); ln(K.m[2],12,19,tipX-1,tipY+1,1); if(v%2) ln(K.m[0],13,19,23,9,0.9); }
      if(K.motif==='crack') for(let k=0;k<4;k++) r(k%2?K.a[1]:K.a[0],14+k*3,17-k*3,1,1);
      if(K.motif==='frost'){ spike(25,8,-0.2,4,'#e8f8ff'); spike(20,13,0.3,3,'#e8f8ff'); }
      if(K.motif==='leaf'){ qc(K.w[1],11,21,15,14,18,15,1.2); leaf(17,14,-0.5,0.8); }
      if(K.motif==='bubble'){ ci(K.a[1],22,12,1.2); ci(K.a[1],25,8,0.9); } };
  const hilt=(gx,gy)=>{ const ga=v%2?K.a:K.m; ln(ga[0],gx-5,gy-5,gx+5,gy+5,3.2); ln(ga[1],gx-4,gy-4,gx+4,gy+4,1.6);
      ln(K.l[0],gx-1,gy+1,gx-6,gy+6,3); ln(K.l[1],gx-1,gy+1,gx-6,gy+6,1.6); for(let k=0;k<3;k++) r(K.l[2],gx-2-k*2,gy+2+k*2,1,1);
      if(K.motif==='skull') motifOn(gx-7,gy+7,0.9); else gem(gx-7,gy+7,2.2,v%3===0?K.gem:K.a);
      if(K.motif==='leaf'){ leaf(gx-5,gy-6,-1.2,0.9); leaf(gx+6,gy+5,0.3,0.9); }
      if(K.motif==='frost'){ spike(gx-5,gy-5,-2.3,3,'#e8f8ff'); spike(gx+5,gy+5,0.8,3,'#e8f8ff'); }
      if(K.motif==='bubble'){ qc(K.w[1],gx-5,gy-5,gx-8,gy-9,gx-6,gy-11,1.4); qc(K.w[1],gx+5,gy+5,gx+9,gy+7,gx+11,gy+5,1.4); }
      if(K.motif==='crack'){ spike(gx-5,gy-5,-2.4,3,K.m[0]); spike(gx+5,gy+5,0.8,3,K.m[0]); } };
  switch(kind){
    case 'sword': case 'rune': blade(); hilt(10,21); if(kind==='rune'){ for(let k=0;k<3;k++) r(K.gem[1],15+k*3,15-k*3,1,1); } if(hi) spark=[[24,5]]; break;
    case 'dagger': ln(K.m[0],12,20,22,10,3.6); ln(L,12,20,22,10,2.4); ln(K.m[2],13,18,21,10,0.9); hilt(11,21); break;
    case 'axe': { ln(K.w[0],6,28,22,6,3.4); ln(K.w[1],6,28,22,6,2); for(let k=0;k<3;k++) r(K.l[1],8+k*2,24-k*3,2,1);
      const dbl=v%3===0; P(K.m[0],[18,5,29,2,30,14,22,12]); P(L,[19,6,28,4,28.5,12.5,22,11]); ln(K.m[2],28,4,28.5,12,1);
      if(dbl) { P(K.m[0],[18,8,10,4,9,12,16,12]); P(L,[17,8.5,11,5.5,10.5,11,16,11]); }
      if(K.motif==='crack'){ r(K.a[1],24,7,1,3); r(K.a[0],25,10,1,2); } if(K.motif==='frost'){ spike(29,13,1.2,4,'#e8f8ff'); spike(29,3,-0.8,3,'#e8f8ff'); }
      if(K.motif==='leaf'){ leaf(21,13,0.4); leaf(15,15,-0.4,0.8); } if(K.motif==='bubble'){ ci(K.w[1],25,8,2); ci(K.a[1],25,8,1); } if(K.motif==='skull') motifOn(22,9,0.9);
      gem(7,27,1.8,K.a); if(hi) spark=[[27,4]]; break; }
    case 'club': case 'hammer': { ln(K.w[0],6,28,20,10,3.6); ln(K.w[1],6,28,20,10,2.2); for(let k=0;k<3;k++) r(K.l[2],8+k*2,25-k*2,2,1);
      const mace=kind==='hammer'&&(/Maça/.test(d.name)||(!/Martelo/.test(d.name)&&v%2===1));
      if(kind==='club'){ ln(K.w[0],15,16,25,6,8.5); ln(K.w[1],15,16,25,6,6.5); ln(K.w[2],16,13,24,6,1.4); for(const [sx,sy] of [[19,8],[24,11],[21,14],[26,6]]) r(K.m[1],sx,sy,2,2); }
      else if(mace){ ci(K.m[0],23,8,6.4); ci(L,23,8,5); ci(K.m[2],21,6,1.6); for(let k=0;k<8;k++){ const a=k/8*Math.PI*2; spike(23+Math.cos(a)*5,8+Math.sin(a)*5,a,3,K.m[1]); } }
      else { P(K.m[0],[14,7,22,1,30,10,22,16]); P(L,[15,7,22,2.5,28.5,10,22,14.5]); ln(K.m[2],22,3,28,9,1); r(K.a[1],20,7,2,2); }
      motifOn(22,16,0.9); gem(7,27,1.8,K.a); if(hi) spark=[[26,4]]; break; }
    case 'bow': { const W=K.w; qc(W[0],7,3,22,16,7,29,4.2); qc(L||W[1],7,3,22,16,7,29,2.6); qc(W[2],8,5,19,15,9,13,1);
      ln('#e8e0cc',7,3,7,29,0.9); if(v%2){ qc(W[1],7,3,4,1,3,4,1.6); qc(W[1],7,29,4,31,3,28,1.6); }
      r(K.l[1],15,14,4,5); r(K.l[2],15,15,4,1); motifOn(9,4,0.8); motifOn(9,28,0.8); if(hi) spark=[[20,10]]; break; }
    case 'wand': { ln(K.w[0],6,27,20,12,3.4); ln(K.w[1],6,27,20,12,2); r(K.a[1],15,16,2,2); r(K.a[1],11,20,2,2);
      const G=[d.look||K.gem[0],'#ffffff']; ci(K.a[0],22,9,5.2); ci(G[0],22,9,3.8); ci('rgba(255,255,255,.7)',21,8,1.4);
      if(K.motif==='leaf'){ leaf(18,5,-0.8); leaf(27,12,0.6); } else if(K.motif==='crack'){ spike(22,9,-0.9,8,K.m[0]); spike(22,9,0.2,7,K.m[0]); ci(G[0],22,9,3.4); }
      else if(K.motif==='frost'){ spike(22,5,-1.6,6,'#e8f8ff'); spike(26,8,-0.6,5,'#e8f8ff'); } else if(K.motif==='bubble'){ ci(K.a[1],28,4,1.4); ci(K.a[1],29,9,1); } else if(K.motif==='skull') motifOn(22,9,1);
      { const sv=(h>>4)%3; if(sv===1){ g.strokeStyle=K.a[1]; g.lineWidth=1.4; g.beginPath(); g.arc(22,9,6.4,3.4,6.0); g.stroke(); } else if(sv===2){ for(let k=0;k<4;k++){ const a=k*Math.PI/2+0.78; spike(22+Math.cos(a)*4,9+Math.sin(a)*4,a,2.6,K.a[1]); } } }
      spark=[[26,5]]; break; }
    case 'staff': { ln(K.w[0],4,30,21,10,3.6); ln(K.w[1],4,30,21,10,2.2); for(let k=0;k<3;k++) r(K.l[1],9+k*2,23-k*2,2,2);
      const G=d.look||K.gem[0];
      if(K.motif==='leaf'){ qc(K.w[1],21,10,18,3,24,2,1.8); qc(K.w[1],21,10,29,9,28,4,1.8); ci(G,24,6,3.4); ci('#ffffff',23,5,1); leaf(18,3,-1); leaf(29,10,0.5); }
      else if(K.motif==='crack'){ P(K.m[0],[18,12,22,1,25,8,30,3,27,12]); ci(G,24,8,3.2); ci(K.a[1],23,7,1.2); }
      else if(K.motif==='frost'){ P('#c8ecff',[20,11,24,0,28,10]); P('#ffffff',[22,8,24,2,25,8]); spike(27,8,-0.5,4,'#e8f8ff'); spike(20,10,-2.4,3,'#e8f8ff'); }
      else if(K.motif==='bubble'){ qc(K.w[1],21,10,21,3,18,1,2); qc(K.w[1],21,10,27,6,29,3,2); qc(K.w[1],21,10,25,2,24,0,1.6); ci(K.gem[0],24,7,2.8); ci('#ffffff',23,6,1); }
      else { ci(K.m[0],23,7,5.4); ci(K.a[0],23,7,4.2); ci(G,23,7,3); ci('#ffffff',22,6,1); if(K.motif==='skull') motifOn(23,13,0.8); }
      { const sv=(h>>4)%3; if(sv===1){ g.strokeStyle=K.a[1]; g.lineWidth=1.6; g.beginPath(); g.arc(23,7,6.5,2.2,5.6); g.stroke(); } else if(sv===2){ for(const a of [-2.2,-1.2,-0.2]) spike(23+Math.cos(a)*5,7+Math.sin(a)*5,a,3,K.a[1]); } }
      spark=[[27,3]]; break; }
    case 'quarter': { ln(K.w[0],4,28,28,4,3.6); ln(L,4,28,28,4,2.4); for(const t of [0.1,0.5,0.9]){ const x=4+24*t, y=28-24*t; ln(K.l[0],x-2,y+2,x+2,y-2,4); ln(K.a[1],x-2,y+2,x+2,y-2,1.4); }
      motifOn(16,10,0.8); if(hi) spark=[[26,6]]; break; }
    case 'fist': { const claw=/Garra/.test(d.name);
      P(K.l[0],[7,15,9,9,23,9,26,13,26,24,9,26]); P(L,[8,15,10,10,22,10,25,14,25,23,10,25]); for(let k=0;k<4;k++){ el(K.m[0],11+k*4,10,2.2,2.6); el(K.m[1],11+k*4,10,1.6,2); }
      r(K.l[1],9,23,16,3); r(K.a[1],9,24,16,1);
      if(claw) for(let k=0;k<3;k++){ spike(13+k*5,9,-1.35,8,K.m[2]); }
      else for(let k=0;k<4;k++) r(K.m[2],10+k*4,8,2,2);
      motifOn(18,18,0.9); if(hi) spark=[[25,10]]; break; }
    case 'armor': { const chain=/Cota|Malha/.test(d.name), plate=/Placas|Couraça|Peitoral|Armadura de|Escamas/.test(d.name)&&!/Couro/.test(d.name);
      if(/Túnica/.test(d.name)){ P(K.o,[7,6,12,4,20,4,25,6,27,14,23,14,23,28,9,28,9,14,5,14]); P(K.c[1],[8,7,12,5,20,5,24,7,26,13,22,13,22,27,10,27,10,13,6,13]); P(K.c[0],[13,5,16,10,19,5]); r(K.l[0],10,19,12,2); for(let y=8;y<26;y+=3) r(K.c[2],16,y,1,1); break; }
      if(d.name==='Gi de Treino'){ P(K.o,[6,6,12,4,20,4,26,6,27,14,23,14,23,28,9,28,9,14,5,14]); P('#e8e0cc',[7,7,12,5,20,5,25,7,26,13,22,13,22,27,10,27,10,13,6,13]); P('#c8bea8',[12,5,19,17,16,17,12,9]); r('#2a2a2a',10,17,12,3); r('#2a2a2a',18,19,3,5); break; }
      const body=d.set?(K.motif==='stitch'?K.l:K.m):K.motif==='stitch'&&!plate&&!chain?K.l:K.m;
      P(K.o,[5,8,11,4,21,4,27,8,25,16,23,15,23,28,9,28,9,15,7,16]); P(body[1],[6,8,11,5,21,5,26,8,24,15,22,14,22,27,10,27,10,14,8,15]);
      el(body[2],11,7,3,1.5); r(body[0],15,6,2,21);
      { const pv=v%3; if(pv===1){ spike(7,9,-2.5,5,body[2]); spike(25,9,-0.6,5,body[2]); } else if(pv===2){ el(body[0],7,10,3.6,2.4,-0.5); el(body[0],25,10,3.6,2.4,0.5); el(body[1],7,9,3,1.8,-0.5); el(body[1],25,9,3,1.8,0.5); } }
      r(TR,10,21,12,2); if(d.set){ r(TR,10,8,2,2); r(TR,20,8,2,2); }
      if(hi&&!d.set) gem(16,14,2);
      if(chain) for(let y=10;y<26;y+=2) for(let x=11;x<22;x+=2) r(((x+y)%4)?K.m[2]:K.m[0],x+(y%4?1:0),y,1,1);
      if(plate) for(let y=11;y<26;y+=4) r(body[0],10,y,12,1);
      if(K.motif==='stitch'){ for(let y=9;y<26;y+=3){ r(K.c[2],12,y,1,1); r(K.c[2],19,y,1,1); } r(K.a[1],15,21,2,2); }
      if(K.motif==='leaf'){ leaf(7,9,-0.6,1.1); leaf(25,9,0.6,1.1); leaf(16,13,1.57,0.9); }
      if(K.motif==='crack'){ for(let y=8;y<25;y+=3) r(K.l[1],11+((y*3)%9),y,2,2); r(K.a[0],13,16,1,3); r(K.a[1],14,19,1,2); r(K.a[0],19,12,1,2); }
      if(K.motif==='frost'){ el(K.l[2],11,6,5,2.6); el(K.l[2],21,6,5,2.6); el(K.l[1],16,5,4,2); r(K.c[2],10,24,12,2); }
      if(K.motif==='bubble'){ el(K.w[1],8,9,3.2,2.4,-0.5); el(K.w[1],24,9,3.2,2.4,0.5); for(let k=0;k<3;k++) el(K.m[2],16,12+k*5,3.5,1.6); }
      if(K.motif==='skull'){ motifOn(16,14,1); r(K.a[1],10,22,12,1); }
      if(d.hp>=60||hi) spark=[[22,7]]; break; }
    case 'robe': { P(K.o,[9,4,23,4,27,12,24,12,26,29,6,29,8,12,5,12]); P(L,[10,5,22,5,26,11,23,11,25,28,7,28,9,11,6,11]);
      r(K.c[0],15,5,2,23); r(K.a[0],9,15,14,2); r(K.a[1],15,15,2,2); P(K.c[2],[13,5,16,9,19,5]);
      if(K.motif==='leaf'){ for(let k=0;k<4;k++) leaf(9+k*5,27,0.3*(k%2?1:-1),0.9); } else if(K.motif==='crack'){ for(let k=0;k<5;k++) P(K.a[k%2],[7+k*4,28,9+k*4,22-k%2*2,11+k*4,28]); }
      else if(K.motif==='frost'){ r('#ffffff',7,26,19,3); el('#ffffff',16,5,6,2); } else if(K.motif==='bubble'){ for(let k=0;k<4;k++) ci(K.a[1],10+k*4,26-k%2,1.3); } else if(K.motif==='skull') motifOn(16,21,1); else { for(let y=18;y<27;y+=3) r(K.c[2],11,y,1,1); }
      if(hi) spark=[[21,8]]; break; }
    case 'helmet': { const crown=/Coroa/.test(d.name), cap=/Capuz|Gorro|Faixa|Chapéu/.test(d.name);
      if(/Chapéu/.test(d.name)){ P(K.o,[4,24,28,24,22,18,17,2,13,9,10,18]); P(L,[5,23,27,23,21,17,17,4,14,10,11,18]); r(TR,10,18,13,2); motifOn(16,13,0.9); }
      else if(crown){ r(K.m[0],6,16,20,9); r(L,7,17,18,7); if(d.set) r(TR,7,22,18,2); for(let k=0;k<5;k++){ if(K.motif==='frost') spike(8+k*4,17,-Math.PI/2,6+(k%2?3:0),'#e8f8ff'); else if(K.motif==='leaf') leaf(8+k*4,15,-1.57+(k-2)*0.3,1); else P(K.a[1],[6+k*4,17,8+k*4,9+(k%2)*3,10+k*4,17]); } gem(16,20,2); }
      else if(cap){ el(K.o,16,16,11,11); el(L,16,16,10,10); r(K.o,6,17,20,10); r(L,7,17,18,9); el('#1a120c',16,22,6,4.5); if(K.motif==='frost'){ el('#ffffff',16,24,11,3.4); } else r(d.set?TR:K.l[2],7,17,18,1); motifOn(16,9,0.9); }
      else { el(K.o,16,15,11,11); el(L,16,15,10,10); r(K.o,5,15,22,12); r(L,6,15,20,11); r('#120c08',9,16,14,4); r(K.m[0],15,15,2,10); el(K.m[2],12,9,3,2); if(d.set) r(TR,6,13,20,2);
        if(K.motif==='crack'){ qc('#e8d8b0',8,10,3,6,4,1,2.2); qc('#e8d8b0',24,10,29,6,28,1,2.2); } if(K.motif==='frost'){ el(K.l[2],16,26,12,3); } if(K.motif==='leaf'){ leaf(9,7,-0.8); leaf(23,7,0.8); } if(K.motif==='bubble'){ el(K.w[1],16,5,6,2.5); } if(K.motif==='skull'){ r(K.a[1],6,15,20,1); }
        if(K.motif==='stitch') for(let k=0;k<5;k++) r(K.a[1],8+k*4,24,1,1); }
      if(hi||crown) spark=[[24,8]]; break; }
    case 'legs': { P(K.o,[7,4,25,4,26,28,18,28,16,13,14,28,6,28]); P(L,[8,5,24,5,25,27,19,27,16,11,13,27,7,27]); r(K.l[0],8,5,16,3); r(TR,15,5,2,3); if(d.set){ r(TR,8,22,6,2); r(TR,18,22,6,2); }
      if(K.motif==='stitch'){ for(let y=10;y<26;y+=3){ r(K.c[2],10,y,1,1); r(K.c[2],22,y,1,1); } } if(K.motif==='frost'){ r('#ffffff',7,24,7,3); r('#ffffff',19,24,7,3); }
      if(K.motif==='crack'){ r(K.a[0],10,14,1,4); r(K.a[1],21,17,1,3); } if(K.motif==='leaf'){ leaf(10,12,1.2); leaf(22,15,-1.2); } if(K.motif==='bubble'){ el(K.m[2],11,20,2.5,1.5); el(K.m[2],21,20,2.5,1.5); } if(K.motif==='skull') r(K.a[1],8,8,16,1);
      if(hi) spark=[[23,8]]; break; }
    case 'boots': { P(K.o,[9,3,19,3,19,19,28,22,28,28,7,28,8,19]); P(L,[10,4,18,4,18,20,27,23,27,27,8,27,9,19]); r(K.l[0],8,25,20,3); r(TR,10,9,8,2);
      if(K.motif==='frost') el('#ffffff',14,5,7,3); if(K.motif==='crack'){ for(let k=0;k<3;k++) P(K.a[k%2],[12+k*5,26,14+k*5,20,16+k*5,26]); } if(K.motif==='leaf'){ leaf(10,8,-0.4); leaf(18,10,0.5); }
      if(K.motif==='bubble'){ el(K.w[1],22,22,3,2); ci(K.a[1],26,18,1.2); } if(K.motif==='stitch'){ for(let y=6;y<20;y+=3) r(K.c[2],15,y,1,1); } if(K.motif==='skull') r(K.a[1],9,15,9,1);
      if(d.speed>=30) { ln(K.a[1],2,12,6,12,1); ln(K.a[1],1,16,6,16,1); } if(hi) spark=[[17,6]]; break; }
    case 'shield': { const round=v%2===0;
      if(round){ ci(K.o,16,16,13); ci(L,16,16,12); ci(K.m[0],16,16,9); ci(L,16,16,8); } else { P(K.o,[4,4,28,4,28,15,16,30,4,15]); P(L,[5,5,27,5,27,15,16,29,5,15]); P(K.m[0],[8,8,24,8,24,15,16,25,8,15]); P(L,[9,9,23,9,23,15,16,24,9,15]); }
      if(K.motif==='leaf'){ leaf(13,15,-0.8,1.3); leaf(19,15,0.8,1.3); leaf(16,11,-1.57,1.1); } else if(K.motif==='crack'){ P(K.a[0],[16,9,19,15,16,22,13,15]); P(K.a[1],[16,12,17.5,15,16,19,14.5,15]); }
      else if(K.motif==='frost'){ for(let k=0;k<3;k++){ const a=k/3*Math.PI; ln('#ffffff',16-Math.cos(a)*6,16-Math.sin(a)*6,16+Math.cos(a)*6,16+Math.sin(a)*6,1.6); } } else if(K.motif==='bubble'){ for(let k=0;k<5;k++){ const a=-Math.PI*0.9+k*0.45; ln(K.w[2],16,21,16+Math.cos(a)*7,21+Math.sin(a)*7,1.4); } }
      else if(K.motif==='skull') motifOn(16,15,1.4); else { r(K.a[1],15,8,2,16); r(K.a[1],9,14,14,2); for(const [x,y] of [[7,7],[24,7],[7,14],[24,14]]) r(K.m[2],x,y,1,1); }
      if(hi) spark=[[24,6]]; break; }
    case 'book': { r(K.o,5,4,22,25); r(L,6,5,20,23); r('#e8e0cc',24,6,2,21); r(K.c[0],6,5,3,23); r(K.a[1],6,5,20,1); r(K.a[1],6,27,20,1); motifOn(16,16,1.4); gem(16,16,2.6); r(K.a[0],22,14,4,4); spark=[[22,7]]; break; }
    case 'quiver': { ln(K.o,8,28,20,8,9); ln(L,8,28,20,8,7); ln(K.l[0],8,28,20,8,2); for(const [fx,col] of [[17,'#e8e0cc'],[21,K.a[1]],[25,'#e8e0cc']]){ ln('#6a4a2a',fx-2,10,fx+1,3,1.2); P(col,[fx,1,fx+3,3,fx+1,6]); } motifOn(13,19,0.9); break; }
    case 'ring': { g.strokeStyle=K.o; g.lineWidth=5; g.beginPath(); g.arc(16,19,8,0,7); g.stroke(); g.strokeStyle=K.a[0]; g.lineWidth=3.4; g.beginPath(); g.arc(16,19,8,0,7); g.stroke(); g.strokeStyle=K.a[1]; g.lineWidth=1.2; g.beginPath(); g.arc(16,19,8,3.6,5.4); g.stroke();
      const G=[d.look||K.gem[0],'#ffffff']; P(K.o,[16,4,22,10,16,15,10,10]); P(G[0],[16,5,21,10,16,14,11,10]); r('#ffffff',14,8,2,2); motifOn(16,27,0.7); spark=[[21,5]]; break; }
    case 'amulet': { g.strokeStyle=K.a[0]; g.lineWidth=1.6; g.beginPath(); g.arc(16,9,9,Math.PI*0.12,Math.PI*0.88,true); g.stroke();
      const sh=v%3, G=d.look||K.gem[0];
      if(sh===0){ ci(K.a[0],16,20,7.4); ci(G,16,20,5.2); ci('#ffffff',14,18,1.4); } else if(sh===1){ P(K.a[0],[16,10,23,19,16,30,9,19]); P(G,[16,13,21,19,16,27,11,19]); r('#ffffff',14,16,2,2); }
      else { el(K.a[0],16,20,6,8); el(G,16,21,4,6); r('#ffffff',14,17,2,2); }
      motifOn(16,11,0.8); spark=[[22,15]]; break; }
    case 'bag': { const big=d.slots>=26;
      if(v%2===0){ P(K.o,[6,10,26,10,28,29,4,29]); P(L,[7,11,25,11,27,28,5,28]); el(K.o,16,10,8,4); el(L,16,10,7,3); r(K.l[0],13,6,6,4); ln(K.a[0],9,10,23,10,1.6); }
      else { r(K.o,5,8,22,21); r(L,6,9,20,19); r(K.l[0],6,9,20,8); r(K.o,6,17,20,1); r(K.a[1],14,15,4,4); r(K.l[0],10,3,12,2); r(K.l[0],10,3,2,6); r(K.l[0],20,3,2,6); }
      if(K.motif==='stitch') for(let k=0;k<6;k++) r(K.c[2],8+k*3,25,1,1); if(K.motif==='frost') r('#ffffff',5,25,22,3); if(K.motif==='leaf'){ leaf(9,20,0.4); leaf(23,22,-0.4); } if(K.motif==='crack') { r(K.a[0],10,20,1,4); r(K.a[1],21,21,1,3); } if(K.motif==='bubble'){ el(K.w[1],22,22,2.4,2); ci(K.gem[1],10,22,1.6); } if(K.motif==='skull') motifOn(16,22,1);
      if(big) spark=[[24,12]]; break; }
    case 'potion': { const t=id.endsWith('3')?3:id.endsWith('2')?2:1, liq=d.look||'#d23a3a';
      if(d.air){ ci(K.o,16,19,10); ci('rgba(200,240,255,1)',16,19,9); ci(liq,16,20,6); for(const [bx,by,br] of [[12,16,1.6],[19,13,1.2],[15,11,1]]) ci('#ffffff',bx,by,br); r(K.o,13,4,6,6); r('#c8b890',14,5,4,4); break; }
      if(t===1){ ci(K.o,16,20,9); ci('#e8f0f4',16,20,8); ci(liq,16,21,6.4); r(K.o,13,6,6,7); r('#e8f0f4',14,7,4,6); r('#8a5a2a',13,4,6,3); }
      else if(t===2){ P(K.o,[12,4,20,4,20,10,26,20,24,29,8,29,6,20,12,10]); P('#e8f0f4',[13,5,19,5,19,11,25,20,23,28,9,28,7,20,13,11]); P(liq,[9,18,23,18,24,20,22,27,10,27,8,20]); r('#c9a440',12,9,8,2); r('#8a5a2a',13,2,6,3); }
      else { P(K.o,[16,2,24,10,26,22,16,30,6,22,8,10]); P('#e8f4ff',[16,4,23,11,25,22,16,28,7,22,9,11]); P(liq,[9,16,23,16,24,22,16,27,8,22]); P('#c9a440',[16,1,19,4,16,7,13,4]); qc('#c9a440',8,11,2,8,4,3,1.4); qc('#c9a440',24,11,30,8,28,3,1.4); }
      if(d.warm>1){ P('#ffd04a',[14,24,16,17,18,24]); P('#ff7a1a',[15,24,16,20,17,24]); }
      r('#ffffff',11,14,2,4); if(t===3) spark=[[24,6]]; break; }
    case 'arrow': { const A=d.ammo; ln('#6a4a2a',5,27,22,10,2); P('#e8e0cc',[3,27,8,24,9,29]); P('#c8b890',[6,29,4,24,8,25]);
      const hc=AMMO[A]?.col||K.m[1];
      if(A==='pierce'){ P(K.m[0],[20,12,29,3,22,10]); ln(K.m[2],22,10,29,3,1); }
      else if(A==='frost'){ P('#e8f8ff',[19,11,29,3,24,14]); P('#9ad8ff',[19,11,27,4,23,12]); spike(27,9,0.3,4,'#e8f8ff'); }
      else if(A==='fire'){ P('#ffd04a',[19,12,28,4,24,13]); P('#ff7a1a',[20,8,24,1,25,9]); P('#ffd04a',[25,12,31,7,27,14]); }
      else if(A==='blast'){ P(K.m[1],[21,11,28,4,24,12]); ci('#3a2a2a',20,12,3.5); r('#ffb02a',22,8,1,2); }
      else if(A==='shock'){ P('#fff07a',[20,11,28,3,24,12]); ln('#fff07a',24,6,27,9,1); ln('#fff07a',27,9,25,11,1); }
      else if(A==='drain'){ P('#c0304a',[20,11,28,3,23,12]); P('#c0304a',[23,7,26,4,24,9]); }
      else if(A==='poison'){ P('#5a9a3a',[20,11,28,3,23,12]); ci('#7ad04a',26,9,1.2); ci('#7ad04a',25,12,1); }
      else { P(hc,[20,11,28,3,23,12]); ln('#ffffff',22,10,28,3,0.8); }
      break; }
    case 'tail': qc('#d0a0a0',6,26,4,10,16,8,3.4); qc('#a07070',16,8,26,6,26,16,2.4); qc('#e8c0c0',6,24,5,12,14,9,1); break;
    case 'fang': { const col=d.look||'#f0e8d0'; P(K.o,[10,3,22,3,20,15,16,29,12,15]); P(col,[11,4,21,4,19,15,16,27,13,15]); r('#ffffff',12,5,2,8); r('rgba(0,0,0,.18)',18,5,2,10); break; }
    case 'pelt': { const col=d.look||K.l[1]; P(K.o,[6,6,12,8,16,4,20,8,26,6,25,14,28,22,22,22,20,28,12,28,10,22,4,22,7,14]); P(col,[7,7,12,9,16,5,20,9,25,7,24,14,27,21,22,21,19,27,13,27,10,21,5,21,8,14]);
      for(let k=0;k<10;k++) r('rgba(255,255,255,.25)',9+((k*7)%14),9+((k*5)%15),2,1); break; }
    case 'silk': { ci(K.o,16,17,10); ci('#e8e4dc',16,17,9); g.strokeStyle='#b8b0a0'; g.lineWidth=1; for(let k=0;k<4;k++){ g.beginPath(); g.arc(16,17,2+k*2,0,7); g.stroke(); } for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; ln('#b8b0a0',16,17,16+Math.cos(a)*9,17+Math.sin(a)*9,0.8); }
      if(d.look) { r(d.look,6,22,20,4); } break; }
    case 'wing': { P(K.o,[16,10,30,4,28,12,30,18,24,16,22,24,18,18,12,24,10,16,4,18,6,12,2,4]); P(d.look||'#4a3a4a',[16,11,28,6,26,12,28,17,23,15,21,22,17,17,13,22,11,15,5,17,7,12,4,6]); for(const x of [8,24]) ln('#6a5a6a',16,11,x,8,1); break; }
    case 'bone': { ln(K.o,8,24,24,8,6); ln('#e8e0d0',8,24,24,8,4); for(const [x,y] of [[6,22],[10,26],[22,6],[26,10]]) ci('#e8e0d0',x,y,3.2); ln('#ffffff',10,20,20,10,1); break; }
    case 'dust': { const col=d.look||K.a[1]; P(K.o,[9,12,23,12,27,29,5,29]); P(K.l[1],[10,13,22,13,26,28,6,28]); ln(K.a[0],9,14,23,14,1.6); el(K.o,16,10,6,3.4); el(col,16,10,5,2.6);
      for(let k=0;k<7;k++){ const a=k*0.9; r(k%2?'#ffffff':col,16+Math.cos(a)*(4+k),7-Math.abs(Math.sin(a))*(2+k*0.6),1,1); } spark=[[22,5]]; break; }
    case 'tusk': qc('#f4ecd8',7,4,4,22,20,27,5); qc('#ffffff',7,5,5,18,15,24,1.4); qc('#f4ecd8',18,4,16,16,26,22,4); r('#a89870',5,3,5,3); r('#a89870',16,3,5,3); break;
    case 'pearl': { el(K.o,16,22,13,7); el('#e8c8b0',16,22,12,6); el('#c8a890',16,20,12,2.4); ci(K.o,16,15,6.4); ci(d.look||'#3a3a5a',16,15,5.4); ci('#ffffff',14,13,1.6); ci('rgba(255,255,255,.5)',18,17,1); spark=[[22,10]]; break; }
    case 'prism': { P(K.o,[16,1,27,14,16,31,5,14]); P('#a0ffd0',[16,3,25,14,16,16,7,14]); P('#9ad8ff',[7,14,16,16,16,28]); P('#ff9af0',[25,14,16,16,16,28]); ln('#ffffff',16,3,16,28,0.8); spark=[[22,6],[9,22]]; break; }
  }
  const known=['sword','rune','dagger','axe','club','hammer','bow','wand','staff','quarter','fist','armor','robe','helmet','legs','boots','shield','book','quiver','ring','amulet','bag','potion','arrow','tail','fang','pelt','silk','wing','bone','dust','tusk','pearl','prism'];
  if(!known.includes(kind)){ // ícones desenhados à mão no formato antigo: ampliados para 32×32 com o mesmo acabamento
    g.imageSmoothingEnabled=false; g.drawImage(iconCanvasOld(id),0,0,24,24,2,2,28,28); spark=[[25,5]]; }
  iconPost(g,K,spark);
  return iconCache2[id]=c.toDataURL();
}
function iconURL(id){ return ITEMS[id]?.tome ? tomeIconURL(id) : iconURL2(id); }


// ============================================================ monstros
const MON = {
  crystalstag:{name:'Cervo de Cristal', lvl:24, hp:220, atk:60, def:14, xp:190, step:300, as:1300, sight:6, col:'#c8b090', loot:[['gold',.6,15,40],['crystalshard',.5,1,2]]},
  gnomebandit:{name:'Gnomo Trapaceiro', lvl:26, hp:180, atk:55, def:12, xp:200, step:340, as:1400, sight:7, col:'#5a7a3a', ranged:{range:4,cd:2600,min:40,max:60,color:'#c9a440'}, loot:[['gold',.9,20,60],['hp',.1,1,1],['fairydust',.2,1,1]]},
  hopshroom:{name:'Cogumelo Saltitante', lvl:22, hp:160, atk:50, def:10, xp:160, step:360, as:1300, sight:5, col:'#d0402a', poison:{ch:.3,dmg:8,ticks:4}, loot:[['gold',.5,10,30],['fairydust',.25,1,1]]},
  pixie:   {name:'Fada Travessa', lvl:28, hp:160, atk:60, def:18, xp:240, step:240, as:1200, sight:7, col:'#ff9af0', ranged:{range:4,cd:2000,min:50,max:75,color:'#ff9af0'}, loot:[['gold',.7,20,50],['fairydust',.5,1,2]]},
  glowmoth:{name:'Mariposa Luminosa', lvl:29, hp:220, atk:80, def:14, xp:260, step:280, as:1300, sight:7, col:'#e8d890', ranged:{range:4,cd:3200,min:40,max:60,color:'#fff0a0',slow:2000}, loot:[['gold',.6,20,50],['fairydust',.4,1,1],['mp',.1,1,1]]},
  fairyqueen:{name:'Rainha Fada Lirael', lvl:32, hp:8000, atk:155, def:31, xp:9000, step:300, as:1400, sight:9, col:'#ff9af0', boss:true, respawn:600000,
            ranged:{range:5,cd:2600,min:130,max:190,color:'#ff9af0'}, ab:{brood:{type:'pixie',cd:8000,max:5}, rain:{cd:6000,n:6,dmg:110,kind:'fairy'}, phases:[{at:.5,summon:'glowmoth',n:2,say:'Fadas, protejam-me!',enrage:true}]},
            loot:[['gold',1,600,1100],['fairydust',1,3,6],['queenwing',1,1,1],['faebag',.25,1,1],['hp2',1,1,3]]},
  faun:    {name:'Fauno', lvl:34, hp:320, atk:110, def:20, xp:340, step:300, as:1200, sight:6, col:'#8a6a4a', loot:[['gold',.8,30,80],['faunhorn',.4,1,1]]},
  faunpiper:{name:'Fauno Flautista', lvl:35, hp:260, atk:80, def:18, xp:360, step:340, as:1400, sight:7, col:'#8a6a4a', ranged:{range:5,cd:3000,min:70,max:100,color:'#a0e0ff',slow:2500}, loot:[['gold',.8,30,80],['faunhorn',.3,1,1],['mp',.12,1,1]]},
  treant:  {name:'Guardião de Carvalho', lvl:37, hp:900, atk:150, def:30, xp:480, step:560, as:1800, sight:5, col:'#5a3a22', loot:[['gold',.8,40,100],['oakheart',.4,1,1],['hp2',.06,1,1]]},
  elderfaun:{name:'Silvano, o Fauno Ancião', lvl:38, hp:11000, atk:210, def:35, xp:14000, step:320, as:1300, sight:9, col:'#8a6a4a', boss:true, respawn:720000, charge:true,
            ranged:{range:5,cd:2600,min:160,max:220,color:'#a0e0ff',slow:3000}, ab:{phases:[{at:.7,summon:'faun',n:3,say:'Dancem, meus filhos!'},{at:.4,summon:'treant',n:2,say:'O bosque responde ao meu chamado!',enrage:true}]},
            loot:[['gold',1,900,1600],['faunhorn',1,2,4],['oakheart',1,1,2],['faebag',.3,1,1],['hp2',1,2,3]]},
  darkdryad:{name:'Dríade Sombria', lvl:42, hp:380, atk:120, def:24, xp:460, step:340, as:1400, sight:7, col:'#2f5a3a', ranged:{range:5,cd:2600,min:110,max:160,color:'#7ad04a',poison:{dmg:14,ticks:4}}, loot:[['gold',.8,40,110],['fairydust',.4,1,2],['mp2',.05,1,1]]},
  rottreant:{name:'Treant Apodrecido', lvl:45, hp:1300, atk:200, def:36, xp:650, step:600, as:1900, sight:5, col:'#3a2a1a', poison:{ch:.3,dmg:18,ticks:5}, loot:[['gold',.9,60,150],['oakheart',.6,1,2],['hp2',.1,1,1]]},
  shadowfairy:{name:'Fada Sombria', lvl:44, hp:300, atk:140, def:22, xp:480, step:230, as:1200, sight:7, col:'#9a6aff', ranged:{range:4,cd:2000,min:100,max:150,color:'#9a6aff'}, loot:[['gold',.7,40,100],['fairydust',.6,1,2]]},
  oakking: {name:'Morgrath, o Carvalho Corrompido', lvl:48, hp:15000, atk:255, def:40, xp:26000, step:640, as:1900, sight:8, col:'#3a2a1a', boss:true, respawn:1200000,
            ab:{rain:{cd:5500,n:6,dmg:160,kind:'thorn'}, phases:[{at:.7,summon:'rottreant',n:2,say:'Raízes, levantem-se!'},{at:.4,summon:'darkdryad',n:3,say:'O bosque inteiro apodrece comigo!',enrage:true}]},
            loot:[['gold',1,1800,3000],['oakheart',1,3,5],['faebag',.4,1,1],['hp2',1,3,5],['mp2',1,2,3]]},
  hellhound:{name:'Cão Infernal', lvl:40, hp:240, atk:230, def:24, xp:380, step:300, as:1200, sight:7, col:'#3a1814', poison:{ch:.25,dmg:14,ticks:4,fire:true}, loot:[['gold',.7,30,80],['hellfur',.5,1,1],['ember',.15,1,1]]},
  firescorp:{name:'Escorpião de Fogo', lvl:42, hp:300, atk:250, def:34, xp:420, step:420, as:1400, sight:6, col:'#c0501a', poison:{ch:.3,dmg:16,ticks:4,fire:true}, loot:[['gold',.7,30,90],['stinger',.5,1,1],['hp',.1,1,1]]},
  imp:     {name:'Diabrete', lvl:48, hp:300, atk:300, def:28, xp:480, step:280, as:1100, sight:7, col:'#c0402a', loot:[['gold',.8,40,110],['imphorn',.4,1,1],['ember',.2,1,1]]},
  pyroimp: {name:'Diabrete Piromante', lvl:50, hp:260, atk:220, def:26, xp:520, step:360, as:1300, sight:7, col:'#ff7a2a', ranged:{range:5,cd:2400,min:180,max:260,color:'#ff7a2a'}, loot:[['gold',.8,40,110],['imphorn',.3,1,1],['ember',.4,1,1],['mp2',.06,1,1]]},
  overseer:{name:'Capataz Infernal', lvl:54, hp:900, atk:400, def:40, xp:820, step:450, as:1500, sight:6, col:'#8a1a1a', loot:[['gold',.9,80,200],['imphorn',.5,1,2],['hp2',.08,1,1]]},
  forgemaster:{name:'Grimbal, o Mestre-Forja', lvl:56, hp:9000, atk:480, def:46, xp:15000, step:420, as:1500, sight:8, col:'#c0402a', boss:true, respawn:900000,
            ab:{brood:{type:'imp',cd:9000,max:5}, rain:{cd:7000,n:5,dmg:110}, phases:[{at:.4,summon:'overseer',n:2,say:'Alimentem a forja!',enrage:true}]},
            loot:[['gold',1,1500,3000],['ember',1,3,6],['imphorn',1,2,4],['hp2',1,2,4]]},
  salamander:{name:'Salamandra', lvl:58, hp:450, atk:380, def:34, xp:600, step:340, as:1300, sight:6, col:'#e0602a', poison:{ch:.3,dmg:22,ticks:4,fire:true}, loot:[['gold',.7,60,150],['ember',.4,1,2]]},
  magmael: {name:'Elemental de Magma', lvl:62, hp:1100, atk:460, def:50, xp:900, step:540, as:1700, sight:6, col:'#3a2420', ranged:{range:4,cd:3000,min:220,max:320,color:'#ff9a2a'}, loot:[['gold',.8,80,200],['magmacore',.3,1,1],['ember',.5,1,2]]},
  cinderbat:{name:'Morcego de Brasa', lvl:60, hp:380, atk:360, def:30, xp:580, step:240, as:1100, sight:7, col:'#5a2a1a', loot:[['gold',.6,50,130],['wing',.5,1,2],['ember',.2,1,1]]},
  magmaheart:{name:'Coração de Magma', lvl:66, hp:11000, atk:550, def:55, xp:20000, step:560, as:1700, sight:8, col:'#3a2420', boss:true, respawn:1200000,
            ranged:{range:5,cd:3200,min:300,max:420,color:'#ffb02a'}, ab:{rain:{cd:5000,n:7,dmg:140}, phases:[{at:.6,summon:'magmael',n:2,say:'A terra ferve!'},{at:.3,summon:'magmael',n:3,say:'QUEIME!',enrage:true}]},
            loot:[['gold',1,2000,3500],['magmacore',1,2,4],['hp2',1,2,4],['mp2',1,2,4]]},
  charskel:{name:'Esqueleto Carbonizado', lvl:68, hp:700, atk:480, def:48, xp:720, step:440, as:1400, sight:6, col:'#3a302a', undead:true, loot:[['gold',.8,80,200],['ashbone',.5,1,2]]},
  emberwraith:{name:'Espectro de Brasa', lvl:72, hp:600, atk:380, def:70, xp:800, step:400, as:1500, sight:7, col:'#ff9a5a', undead:true, ranged:{range:5,cd:2600,min:300,max:420,color:'#ff9a5a'}, loot:[['gold',.7,80,200],['ember',.5,1,2],['mp2',.1,1,1]]},
  ashghoul:{name:'Carniçal de Cinzas', lvl:74, hp:1500, atk:600, def:55, xp:1100, step:500, as:1600, sight:6, col:'#6a6058', undead:true, poison:{ch:.3,dmg:30,ticks:5}, loot:[['gold',.9,100,260],['ashbone',.6,1,3],['hp2',.1,1,1]]},
  ashwidow:{name:'Viúva das Cinzas', lvl:76, hp:14000, atk:660, def:62, xp:28000, step:420, as:1600, sight:8, col:'#e8e0d8', undead:true, boss:true, respawn:1500000,
            ranged:{range:6,cd:2800,min:380,max:520,color:'#ff9a5a',slow:2500}, ab:{rain:{cd:6000,n:6,dmg:180}, phases:[{at:.7,summon:'emberwraith',n:3,say:'Meus convidados chegaram.'},{at:.4,summon:'charskel',n:4,say:'Ninguém sai do meu luto!',enrage:true}]},
            loot:[['gold',1,3000,5000],['ashbone',1,3,6],['hp2',1,3,5]]},
  dragonling:{name:'Dragonete', lvl:78, hp:900, atk:600, def:60, xp:850, step:340, as:1300, sight:7, col:'#d04a2a', breath:{range:3,cd:6000,min:200,max:300}, loot:[['gold',.8,100,250],['dragonscale',.2,1,1]]},
  youngdragon:{name:'Dragão Jovem', lvl:82, hp:2400, atk:760, def:72, xp:1500, step:520, as:1700, sight:7, col:'#b0301a', breath:{range:3,cd:5000,min:380,max:520}, loot:[['gold',1,200,500],['dragonscale',.5,1,2],['hp2',.15,1,1]]},
  cultist: {name:'Cultista do Dragão', lvl:80, hp:900, atk:450, def:55, xp:900, step:420, as:1500, sight:7, col:'#7a1a1a', ranged:{range:6,cd:2500,min:380,max:500,color:'#ff5a2a'}, loot:[['gold',.9,120,280],['ember',.4,1,2],['mp2',.15,1,1]]},
  pyraxis: {name:'Pyraxis, a Dragoa Escarlate', lvl:86, hp:18000, atk:800, def:78, xp:40000, step:420, as:1600, sight:9, col:'#c0201a', boss:true, respawn:1800000,
            breath:{range:4,cd:4500,min:600,max:800}, ab:{rain:{cd:5500,n:8,dmg:230}, phases:[{at:.7,summon:'dragonling',n:3,say:'Filhotes, à caça!'},{at:.4,summon:'youngdragon',n:1,say:'GRRAAAAAH!',enrage:true}]},
            loot:[['gold',1,5000,8000],['dragonscale',1,3,6],['hp2',1,3,5]]},
  lavadrake:{name:'Draco de Lava', lvl:88, hp:2000, atk:820, def:80, xp:1500, step:380, as:1500, sight:7, col:'#ff6a1a', breath:{range:3,cd:4500,min:450,max:600}, loot:[['gold',.9,200,450],['dragonscale',.4,1,1],['magmacore',.3,1,1]]},
  obsgolem:{name:'Golem de Obsidiana', lvl:90, hp:4200, atk:1000, def:110, xp:2200, step:620, as:1900, sight:5, col:'#1e1820', loot:[['gold',1,250,600],['magmacore',.5,1,2],['hp2',.2,1,1]]},
  flamecaller:{name:'Arauto das Chamas', lvl:92, hp:1400, atk:600, def:70, xp:1600, step:420, as:1500, sight:7, col:'#ff8a2a', ranged:{range:6,cd:2300,min:520,max:680,color:'#ffd54a'}, loot:[['gold',.9,200,450],['ember',.6,2,3],['mp2',.2,1,1]]},
  ignivar: {name:'Ignivar, o Dragão Ancestral', lvl:96, hp:28000, atk:1000, def:95, xp:70000, step:440, as:1700, sight:9, col:'#3a1410', boss:true, respawn:2700000,
            breath:{range:4,cd:4000,min:800,max:1100}, ab:{rain:{cd:4500,n:10,dmg:320}, phases:[{at:.75,summon:'lavadrake',n:2,say:'Você ousa entrar no meu vulcão?'},{at:.5,summon:'flamecaller',n:3,say:'Arautos! Queimem este verme!',enrage:true},{at:.25,summon:'obsgolem',n:2,say:'EU SOU O FOGO!'}]},
            loot:[['gold',1,10000,15000],['dragonheart',1,1,1],['ignivareye',.5,1,1],['dragonbag',.5,1,1],['hp2',1,4,6]]},
  spiderling:{name:'Aranhiço', lvl:4, hp:26, atk:9, def:2, xp:14, step:300, as:1200, sight:6, col:'#4a3426', poison:{ch:.2,dmg:3,ticks:3}, loot:[['gold',.4,1,4],['silk',.2,1,1]]},
  weaver:  {name:'Aranha Tecelã', lvl:6, hp:70, atk:12, def:6, xp:48, step:460, as:1500, sight:7, col:'#5a4a6a', ranged:{range:4,cd:3000,min:8,max:14,color:'#f0ece0',slow:2500}, loot:[['gold',.7,6,14],['silk',.6,1,2],['venomgland',.2,1,1],['mp',.08,1,1]]},
  queen:   {name:'Rainha da Seda', lvl:11, hp:2000, atk:40, def:17, xp:2400, step:460, as:1600, sight:8, col:'#3a2448', boss:true, respawn:300000, poison:{ch:.35,dmg:7,ticks:5},
            ranged:{range:5,cd:3600,min:22,max:36,color:'#7ad04a',poison:{dmg:6,ticks:5}}, ab:{brood:{type:'spiderling',cd:9000,max:5},phases:[{at:.4,summon:'weaver',n:2,say:'Minhas tecelãs!',enrage:true}]},
            loot:[['gold',1,250,450],['silkrobe',.6,1,1],['smallbag',.35,1,1],['venomgland',1,2,4],['silk',1,3,6],['hp',1,1,3]]},
  direwolf:{name:'Lobo Sombrio', lvl:8, hp:95, atk:20, def:8, xp:68, step:320, as:1300, sight:7, col:'#3a3a48', loot:[['gold',.6,5,15],['pelt',.6,1,2],['silverfang',.05,1,1]]},
  wisp:    {name:'Fogo-Fátuo', lvl:8, hp:45, atk:10, def:22, xp:55, step:400, as:1400, sight:7, col:'#a0ffd0', ranged:{range:4,cd:2600,min:12,max:20,color:'#a0ffd0'}, loot:[['wispdust',.5,1,2],['mp',.12,1,1],['gold',.4,3,10]]},
  matriarch:{name:'Presa-de-Lua, a Matriarca', lvl:16, hp:3300, atk:56, def:23, xp:5500, step:290, as:1200, sight:8, col:'#c8ccd8', boss:true, respawn:420000,
            ab:{phases:[{at:.75,summon:'direwolf',n:3,say:'Auuuuuu!'},{at:.45,summon:'direwolf',n:3,say:'Auuuuuuuu!'},{at:.2,summon:'direwolf',n:4,say:'AUUUUUUUUU!',enrage:true}]},
            loot:[['gold',1,400,700],['fangnecklace',.6,1,1],['bigbag',.25,1,1],['silverfang',1,1,2],['pelt',1,3,5],['hp',1,2,3]]},
  guarddog:{name:'Mastim de Guerra', lvl:10, hp:115, atk:24, def:10, xp:82, step:330, as:1300, sight:6, col:'#5a4030', loot:[['gold',.5,5,12],['pelt',.4,1,1]]},
  archer:  {name:'Arqueiro Renegado', lvl:11, hp:90, atk:14, def:9, xp:88, step:420, as:1500, sight:7, col:'#4a5a2a', ranged:{range:5,cd:2200,min:16,max:28,color:'#e8c890',arrow:true}, loot:[['gold',.9,12,30],['crest',.2,1,1],['longbow',.05,1,1],['hp',.1,1,1]]},
  knight:  {name:'Cavaleiro Caído', lvl:13, hp:220, atk:34, def:22, xp:175, step:520, as:1600, sight:6, col:'#5a6070', undead:true, loot:[['gold',.9,20,45],['crest',.3,1,1],['ironshield',.05,1,1],['chain',.04,1,1],['hammer',.02,1,1],['hp',.15,1,1],['bigbag',.015,1,1]]},
  usurper: {name:'Lorde Varek, o Usurpador', lvl:21, hp:5000, atk:70, def:31, xp:11000, step:420, as:1500, sight:8, col:'#7a1a1a', boss:true, respawn:600000, charge:true,
            ab:{phases:[{at:.7,summon:'archer',n:3,say:'Guardas! A mim!'},{at:.45,summon:'knight',n:2,say:'Vocês não vão tomar meu trono!',enrage:true},{at:.2,summon:'knight',n:3,say:'Este castelo é MEU!'}]},
            loot:[['gold',1,800,1400],['usurperhelm',.6,1,1],['bigbag',.3,1,1],['magicbag',.1,1,1],['crest',1,2,3],['plate',.3,1,1],['hp',1,2,4],['mp',1,1,3]]},
  dummy:   {name:'Boneco de Treino', lvl:1, hp:50000, atk:0, def:0, xp:0, step:99999, as:99999, sight:0, col:'#c8a060', loot:[], dummy:true},
  rat:     {name:'Rato', lvl:1, hp:20, atk:5, def:1, xp:10, step:560, as:1600, sight:5, col:'#8a8580', loot:[['gold',.7,1,4],['rattail',.45,1,1]]},
  cobra:   {name:'Cobra', lvl:2, hp:40, atk:9, def:3, xp:22, step:520, as:1500, sight:5, col:'#5f8f3a', poison:{ch:.3,dmg:3,ticks:5}, loot:[['gold',.6,2,6],['fang',.5,1,1],['hp',.05,1,1]]},
  wolf:    {name:'Lobo', lvl:3, hp:45, atk:11, def:4, xp:25, step:340, as:1400, sight:6, col:'#7d7f86', loot:[['gold',.5,2,8],['pelt',.6,1,1]]},
  spider:  {name:'Aranha Gigante', lvl:4, hp:75, atk:15, def:6, xp:40, step:440, as:1500, sight:6, col:'#2b2420', poison:{ch:.35,dmg:5,ticks:5}, loot:[['gold',.6,5,12],['silk',.5,1,2],['hp',.08,1,1]]},
  bandit:  {name:'Bandido', lvl:6, hp:95, atk:18, def:9, xp:55, step:420, as:1500, sight:6, col:'#8a3a2a', loot:[['gold',.9,10,30],['bandana',.4,1,1],['club',.1,1,1],['leather',.08,1,1],['woodshield',.1,1,1],['cap',.1,1,1],['shortsword',.04,1,1],['hp',.15,1,1],['smallbag',.03,1,1]]},
  bear:    {name:'Urso Pardo', lvl:7, hp:140, atk:24, def:11, xp:80, step:480, as:1700, sight:5, col:'#6a4528', loot:[['gold',.5,5,15],['claw',.6,1,2],['bearpelt',.3,1,1]]},
  bat:     {name:'Morcego', lvl:8, hp:50, atk:14, def:4, xp:35, step:260, as:1200, sight:7, col:'#3b3040', loot:[['gold',.5,3,8],['wing',.4,1,2]]},
  skeleton:{name:'Esqueleto', lvl:10, hp:100, atk:24, def:14, xp:90, step:460, as:1500, sight:6, col:'#dcd6c4', undead:true, loot:[['gold',.8,10,25],['bone',.7,1,2],['ironhelm',.05,1,1],['ironshield',.04,1,1],['shortsword',.08,1,1],['mp',.12,1,1]]},
  ghoul:   {name:'Carniçal', lvl:13, hp:200, atk:32, def:16, xp:160, step:520, as:1600, sight:6, col:'#6f7f5a', undead:true, poison:{ch:.3,dmg:8,ticks:5}, loot:[['gold',.9,20,50],['bone',.5,1,3],['chain',.04,1,1],['plate',.015,1,1],['axe',.03,1,1],['fastboots',.02,1,1],['hp',.2,1,1],['mp',.15,1,1]]},
  boss:    {name:'Rei das Criptas', lvl:26, hp:7000, atk:84, def:35, xp:20000, step:480, as:1700, sight:8, col:'#6a3d8a', undead:true, boss:true, respawn:900000,
            ranged:{range:5, cd:3000, min:55, max:90}, ab:{phases:[{at:.7,summon:'skeleton',n:3,say:'Levantem-se, meus servos!'},{at:.45,summon:'ghoul',n:3,say:'A cripta não perdoa.',enrage:true},{at:.2,summon:'ghoul',n:4,say:'O TRONO É ETERNO!'}]},
            loot:[['gold',1,1500,2500],['magicbag',.4,1,1],['crown',1,1,1],['runeblade',.25,1,1],['kingseye',.5,1,1],['towershield',.2,1,1],['hp',1,2,4]]},
};

const BOSSES=[{type:'queen',lvl:10,where:'Ninho de Seda, pântano ao sul · andar 2'},{type:'matriarch',lvl:15,where:'Toca das Raízes, bosque ao norte · andar 3'},{type:'usurper',lvl:20,where:'Castelo Abandonado, a oeste · torre, andar 4'},{type:'boss',lvl:25,where:'Cripta Esquecida, a noroeste · andar 5'},
  {type:'fairyqueen',lvl:30,where:'Gruta das Fadas, Bosque Encantado (noroeste) · andar 2'},{type:'elderfaun',lvl:35,where:'Clareira dos Faunos, Bosque Encantado (nordeste) · andar 2'},{type:'oakking',lvl:45,where:'Coração do Bosque Sombrio, Bosque Encantado (sul) · andar 3'},
  {type:'forgemaster',lvl:50,where:'Forja dos Diabretes, Terras Queimadas (noroeste) · andar 2'},{type:'magmaheart',lvl:60,where:'Fendas de Magma, Terras Queimadas (nordeste) · andar 2'},
  {type:'ashwidow',lvl:70,where:'Necrópole de Cinzas, Terras Queimadas (sudoeste) · andar 3'},{type:'pyraxis',lvl:80,where:'Ninho dos Dragões, Terras Queimadas (sudeste) · andar 3'},
  {type:'ignivar',lvl:90,where:'Coração do Vulcão, Terras Queimadas (leste) · andar 4'}];
// ---- Invernália
Object.assign(MON, {
  frostwolf:{name:'Lobo da Geada', lvl:70, hp:900, atk:420, def:50, xp:700, step:280, as:1200, sight:7, col:'#e8f0f8', loot:[['gold',.8,100,250],['frostfur',.5,1,1],['warmpot',.05,1,1]]},
  walrus:  {name:'Morsa Guerreira', lvl:72, hp:1600, atk:520, def:70, xp:900, step:520, as:1600, sight:6, col:'#8a6e5a', charge:true, loot:[['gold',.8,120,280],['walrustusk',.4,1,1],['hp2',.08,1,1]]},
  yeti:    {name:'Ieti', lvl:76, hp:2200, atk:640, def:66, xp:1100, step:460, as:1600, sight:6, col:'#f0f4f8', loot:[['gold',.9,150,320],['frostfur',.6,1,2],['hp2',.1,1,1]]},
  icewraith:{name:'Espírito da Nevasca', lvl:78, hp:900, atk:380, def:50, xp:1000, step:300, as:1400, sight:7, col:'#c8e8ff', ranged:{range:5,cd:2400,min:380,max:500,color:'#c8e8ff',slow:2000}, loot:[['gold',.7,120,260],['icecore',.3,1,1],['mp2',.1,1,1]]},
  drowned: {name:'Marinheiro Afogado', lvl:80, hp:1300, atk:560, def:64, xp:1100, step:420, as:1400, sight:6, col:'#7a9aa0', loot:[['gold',1,180,380],['icecore',.15,1,1],['hp2',.1,1,1]]},
  frostserpent:{name:'Serpe Branca', lvl:84, hp:2600, atk:720, def:76, xp:1500, step:420, as:1600, sight:7, col:'#e8f4ff', breath:{range:3,cd:4800,min:420,max:560}, loot:[['gold',.9,200,420],['frostscale',.4,1,1],['hp2',.12,1,1]]},
  icegiant:{name:'Gigante de Gelo', lvl:88, hp:4400, atk:950, def:100, xp:2100, step:600, as:1900, sight:6, col:'#9ac8e8', charge:true, loot:[['gold',1,260,560],['icecore',.5,1,2],['hp2',.2,1,1]]},
  auroraspirit:{name:'Espectro da Aurora', lvl:92, hp:1500, atk:600, def:72, xp:1700, step:300, as:1400, sight:8, col:'#a0ffd0', ranged:{range:6,cd:2200,min:520,max:700,color:'#a0ffd0'}, loot:[['gold',.8,200,420],['auroraglass',.18,1,1],['mp2',.2,1,1]]},
  walrusking:{name:'Tusko, o Rei das Morsas', lvl:78, hp:16000, atk:760, def:80, xp:30000, step:480, as:1600, sight:9, col:'#7a5e4a', boss:true, respawn:1500000, charge:true,
            ab:{phases:[{at:.6,summon:'walrus',n:3,say:'Manada! Esmaguem o intruso!',enrage:true}]},
            loot:[['gold',1,4000,7000],['walrustusk',1,3,5],['yetibag',.3,1,1],['hp2',1,3,5]]},
  frozencaptain:{name:'Capitão Hálvar, o Congelado', lvl:84, hp:20000, atk:820, def:85, xp:42000, step:420, as:1500, sight:9, col:'#5a7a8a', boss:true, respawn:1800000,
            ranged:{range:5,cd:2600,min:520,max:700,color:'#c8e8ff',slow:2500}, ab:{rain:{cd:5500,n:7,dmg:260,kind:'frost'}, phases:[{at:.7,summon:'drowned',n:3,say:'Tripulação, ao convés!'},{at:.35,summon:'icewraith',n:2,say:'O mar me prendeu. Agora prende você!',enrage:true}]},
            loot:[['gold',1,5000,8000],['icecore',1,2,4],['yeticoat',.35,1,1],['hp2',1,3,5]]},
  wyrmmother:{name:'Alvaneve, a Mãe-Serpe', lvl:88, hp:24000, atk:900, def:88, xp:52000, step:440, as:1600, sight:9, col:'#f4faff', boss:true, respawn:2100000,
            breath:{range:4,cd:4200,min:650,max:850}, ab:{rain:{cd:5000,n:8,dmg:280,kind:'frost'}, phases:[{at:.6,summon:'frostserpent',n:2,say:'Meus filhos, despertem!',enrage:true}]},
            loot:[['gold',1,6000,9000],['frostscale',1,3,6],['frostring',.4,1,1],['hp2',1,4,6]]},
  frostqueen:{name:'Ysolde, Rainha da Geada', lvl:94, hp:30000, atk:1000, def:95, xp:66000, step:420, as:1500, sight:9, col:'#c8e0ff', boss:true, respawn:2400000,
            ranged:{range:6,cd:2200,min:700,max:950,color:'#e8f4ff',slow:3000}, ab:{rain:{cd:4500,n:10,dmg:320,kind:'frost'}, phases:[{at:.7,summon:'icewraith',n:3,say:'O inverno nunca termina.'},{at:.4,summon:'icegiant',n:2,say:'Gigantes! Defendam a coroa!',enrage:true}]},
            loot:[['gold',1,8000,12000],['icecore',1,4,6],['frostcrown',.4,1,1],['yetibag',.4,1,1],['hp3',1,3,5]]},
  aurorath:{name:'Aurorath, o Olho do Céu', lvl:100, hp:36000, atk:1100, def:100, xp:80000, step:400, as:1500, sight:9, col:'#a0ffd0', boss:true, respawn:2700000,
            ranged:{range:6,cd:2000,min:800,max:1050,color:'#a0ffd0'}, ab:{rain:{cd:4000,n:12,dmg:340,kind:'aurora'}, phases:[{at:.75,summon:'auroraspirit',n:3,say:'As luzes do céu se voltam contra você.'},{at:.4,summon:'auroraspirit',n:4,say:'BRILHE COMIGO!',enrage:true}]},
            loot:[['gold',1,10000,15000],['auroraglass',1,2,4],['auroraamulet',.5,1,1],['hp3',1,4,6]]},
  // ---- Coralina
  giantcrab:{name:'Caranguejo Gigante', lvl:95, hp:3000, atk:900, def:120, xp:2000, step:560, as:1600, sight:6, col:'#d0503a', loot:[['gold',.9,250,520],['crabshell',.5,1,1],['airpot',.1,1,2]]},
  eel:     {name:'Enguia Elétrica', lvl:97, hp:1500, atk:700, def:80, xp:1900, step:300, as:1300, sight:7, col:'#e8d050', ranged:{range:4,cd:2200,min:600,max:780,color:'#fff07a',slow:1500}, loot:[['gold',.8,220,460],['pearl',.12,1,1],['airpot',.1,1,1]]},
  jelly:   {name:'Água-Viva Gigante', lvl:99, hp:1800, atk:650, def:70, xp:2000, step:420, as:1400, sight:6, col:'#ff9ad0', poison:{ch:.35,dmg:60,ticks:5}, loot:[['gold',.7,200,420],['jellygel',.5,1,2]]},
  pirate:  {name:'Pirata Afogado', lvl:102, hp:2600, atk:950, def:95, xp:2400, step:420, as:1400, sight:7, col:'#5a7a7a', loot:[['gold',1,350,700],['pearl',.2,1,1],['hp3',.08,1,1]]},
  fishpriest:{name:'Sacerdote Escamado', lvl:106, hp:2200, atk:760, def:90, xp:2600, step:440, as:1500, sight:7, col:'#3a9a8a', ranged:{range:6,cd:2300,min:700,max:900,color:'#5ad0c0'}, loot:[['gold',.9,300,620],['pearl',.3,1,1],['mp3',.1,1,1]]},
  shark:   {name:'Tubarão-Martelo', lvl:110, hp:4200, atk:1200, def:110, xp:3200, step:300, as:1400, sight:7, col:'#7a8a9a', charge:true, loot:[['gold',1,350,700],['sharktooth',.5,1,1],['hp3',.1,1,1]]},
  angler:  {name:'Peixe-Lanterna Abissal', lvl:114, hp:3000, atk:1000, def:100, xp:3400, step:380, as:1500, sight:8, col:'#2a3a4a', ranged:{range:5,cd:2400,min:800,max:1000,color:'#d0ff6a'}, loot:[['gold',.9,350,700],['abysscore',.2,1,1],['mp3',.1,1,1]]},
  abyssal: {name:'Horror Abissal', lvl:120, hp:6500, atk:1400, def:130, xp:4500, step:560, as:1800, sight:6, col:'#3a2a5a', loot:[['gold',1,500,900],['abysscore',.4,1,1],['hp3',.15,1,1]]},
  crabking:{name:'Karkinos, o Caranguejo-Rei', lvl:100, hp:32000, atk:1100, def:140, xp:60000, step:520, as:1700, sight:9, col:'#e0603a', boss:true, respawn:2100000,
            ab:{rain:{cd:5000,n:8,dmg:340,kind:'tide'}, phases:[{at:.6,summon:'giantcrab',n:3,say:'Pinças à frente!',enrage:true}]},
            loot:[['gold',1,9000,13000],['crabshell',1,4,6],['shellhelm',.4,1,1],['hp3',1,3,5]]},
  piratequeen:{name:'Capitã Maré-Negra', lvl:106, hp:36000, atk:1200, def:110, xp:70000, step:420, as:1400, sight:9, col:'#2a3a3a', boss:true, respawn:2400000,
            ranged:{range:6,cd:2200,min:850,max:1100,color:'#ffd54a'}, ab:{phases:[{at:.7,summon:'pirate',n:3,say:'Abordagem, cães do mar!'},{at:.35,summon:'shark',n:2,say:'Os tubarões sempre vêm quando há sangue!',enrage:true}]},
            loot:[['gold',1,12000,18000],['pearl',1,2,4],['sharkbag',.35,1,1],['hp3',1,3,5]]},
  tidepriest:{name:'Abyssor, o Sumo-Sacerdote', lvl:112, hp:40000, atk:1250, def:115, xp:82000, step:440, as:1500, sight:9, col:'#2a8a7a', boss:true, respawn:2700000,
            ranged:{range:6,cd:2000,min:900,max:1150,color:'#5ad0c0',slow:2500}, ab:{rain:{cd:4500,n:10,dmg:380,kind:'tide'}, phases:[{at:.7,summon:'fishpriest',n:3,say:'Irmãos, cantem para as profundezas!'},{at:.35,summon:'eel',n:3,say:'A maré sobe!',enrage:true}]},
            loot:[['gold',1,13000,19000],['pearl',1,3,5],['tiderobe',.35,1,1],['pearlring',.3,1,1],['mp3',1,3,5]]},
  trencheye:{name:'O Olho da Fossa', lvl:118, hp:46000, atk:1350, def:125, xp:96000, step:600, as:1800, sight:9, col:'#4a2a6a', boss:true, respawn:3000000,
            ranged:{range:6,cd:2000,min:1000,max:1250,color:'#d0ff6a'}, ab:{rain:{cd:4200,n:12,dmg:420,kind:'tide'}, phases:[{at:.7,summon:'angler',n:3,say:'Olhe para mim.'},{at:.35,summon:'abyssal',n:2,say:'A escuridão tem fome.',enrage:true}]},
            loot:[['gold',1,15000,22000],['abysscore',1,3,5],['abyssplate',.35,1,1],['hp3',1,4,6]]},
  tentacle:{name:'Tentáculo do Kraken', lvl:120, hp:5200, atk:950, def:90, xp:800, step:9999, as:1300, sight:4, col:'#8a3a7a', rooted:true, grab:true, life:16000, loot:[]},
  leviathan:{name:'Kraken das Profundezas', lvl:126, hp:80000, atk:1500, def:140, xp:150000, step:900, as:1700, sight:10, col:'#7a2a5a', boss:true, respawn:3600000,
            ranged:{range:6,cd:2800,min:900,max:1200,color:'#2a1a3a',slow:2500},
            ab:{kraken:{slam:{cd:4200,dmg:1100},tent:{cd:8000,n:3,max:6},ink:{cd:15000}}, phases:[{at:.75,say:'O mar inteiro se agita!'},{at:.5,say:'GRRROOOOOM!',enrage:true},{at:.25,summon:'tentacle',n:4,say:'Mais braços do que você pode contar!'}]},
            loot:[['gold',1,25000,35000],['levheart',1,1,1],['leviathanscale',.5,1,1],['hp3',1,5,8]]},
});
BOSSES.push({type:'walrusking',lvl:75,where:'Cavernas de Gelo Azul, Fiordes Gelados (noroeste) · andar 2'},{type:'frozencaptain',lvl:80,where:'Navio Fantasma, Fiordes Gelados (nordeste) · porão 3'},
  {type:'wyrmmother',lvl:85,where:'Ninho das Serpes Brancas, Fiordes Gelados (sudoeste) · andar 3'},{type:'frostqueen',lvl:90,where:'Fortaleza dos Gigantes de Gelo, Fiordes Gelados (sudeste) · torre'},
  {type:'aurorath',lvl:95,where:'Fenda da Aurora, Fiordes Gelados (leste) · andar 3'},
  {type:'crabking',lvl:95,where:'Jardim de Corais, Recife Profundo (noroeste) · andar 2'},{type:'piratequeen',lvl:100,where:'Naufrágio do Galeão Dourado, Recife Profundo (nordeste) · tombadilho'},
  {type:'tidepriest',lvl:105,where:'Templo Afundado, Recife Profundo (sudoeste) · santuário'},{type:'trencheye',lvl:112,where:'Fossa Abissal, Recife Profundo (sudeste) · andar 3'},
  {type:'leviathan',lvl:120,where:'Covil do Kraken, Recife Profundo (leste) · andar 4'});
Object.assign(ITEMS, {
  // poções e utilidades
  hp3:       {name:'Poção de Vida Suprema', stack:true, heal:900, price:450, shop:['merchant4','merchant5'], icon:'potion', look:'#ff5a8a'},
  mp3:       {name:'Poção de Mana Suprema', stack:true, mana:550, price:350, shop:['merchant4','merchant5'], icon:'potion', look:'#5ab0ff'},
  warmpot:   {name:'Poção Quente', stack:true, warm:600000, price:40, shop:'merchant4', icon:'potion', look:'#ff9a3a'},
  airpot:    {name:'Poção de Fôlego', stack:true, air:true, price:50, shop:'merchant5', icon:'potion', look:'#9ae0ff'},
  // materiais
  frostfur:  {name:'Pelo Gélido', stack:true, sell:120, icon:'pelt', look:'#e8f0f8'},
  walrustusk:{name:'Presa de Morsa', stack:true, sell:200, icon:'fang', look:'#f0e8d0'},
  icecore:   {name:'Núcleo de Gelo', stack:true, sell:260, icon:'dust', look:'#9ad8ff'},
  frostscale:{name:'Escama Alva', stack:true, sell:380, icon:'pelt', look:'#f4faff'},
  auroraglass:{name:'Vidro da Aurora', stack:true, sell:900, icon:'dust', look:'#a0ffd0'},
  crabshell: {name:'Casco de Caranguejo', stack:true, sell:300, icon:'pelt', look:'#d0503a'},
  pearl:     {name:'Pérola Negra', stack:true, sell:600, icon:'dust', look:'#3a3a5a'},
  jellygel:  {name:'Gel de Água-Viva', stack:true, sell:220, icon:'dust', look:'#ff9ad0'},
  sharktooth:{name:'Dente de Tubarão', stack:true, sell:420, icon:'fang', look:'#e8e8e0'},
  abysscore: {name:'Núcleo Abissal', stack:true, sell:800, icon:'dust', look:'#6a3aaa'},
  levheart:  {name:'Coração do Kraken', stack:true, sell:20000, icon:'kheart', look:'#7a2a5a'},
  // equipamento de Invernália (nível 70+)
  furcap:    {name:'Gorro de Pele', slot:'helmet', def:10, hp:40, warm:true, price:6000, shop:'merchant4', lvl:70, icon:'helmet', look:'#e8dcc8'},
  yeticoat:  {name:'Casaco de Ieti', slot:'armor', def:30, hp:100, warm:true, sell:6000, lvl:75, icon:'armor', look:'#f0f4f8'},
  snowboots: {name:'Botas de Neve', slot:'boots', def:9, speed:30, warm:true, sell:5000, lvl:78, icon:'boots', look:'#e8f0f8'},
  frostring: {name:'Anel do Inverno', slot:'ring', mag:10, hp:60, sell:9000, lvl:85, icon:'ring', look:'#9ad8ff'},
  frostcrown:{name:'Coroa da Geada', slot:'helmet', def:16, mag:12, hp:80, warm:true, sell:16000, lvl:94, icon:'helmet', look:'#c8e0ff'},
  auroraamulet:{name:'Amuleto da Aurora', slot:'amulet', atk:10, mag:16, crit:4, sell:20000, lvl:98, icon:'amulet', look:'#a0ffd0'},
  yetibag:   {name:'Mochila de Pele de Ieti', slot:'bag', slots:34, sell:8000, lvl:75, icon:'bag', look:'#f0f4f8', noRarity:true},
  glacialsword:{name:'Espada de Gelo Eterno', slot:'weapon', wk:'blade', atk:60, sell:9000, lvl:80, icon:'sword', look:'#9ad8ff'},
  glacialaxe:{name:'Machado Glacial', slot:'weapon', wk:'blade', atk:59, sell:9000, lvl:80, icon:'axe', look:'#9ad8ff'},
  glacialmaul:{name:'Martelo Glacial', slot:'weapon', wk:'blade', atk:60, sell:9000, lvl:80, icon:'hammer', look:'#9ad8ff'},
  borealbow: {name:'Arco Boreal', slot:'weapon', wk:'bow', hands:2, atk:57, sell:9000, lvl:80, icon:'bow', look:'#a0ffd0'},
  blizzardwand:{name:'Varinha da Nevasca', slot:'weapon', wk:'wand', atk:35, mag:42, sell:9000, lvl:80, icon:'wand', look:'#c8e8ff'},
  winterstaff:{name:'Cajado do Inverno', slot:'weapon', wk:'staff', atk:35, mag:42, sell:9000, lvl:80, icon:'staff', look:'#c8e8ff'},
  iceclaws:  {name:'Garras de Gelo', slot:'weapon', wk:'fist', atk:50, sell:9000, lvl:80, icon:'fist', look:'#9ad8ff'},
  // equipamento de Coralina (nível 90+)
  gillneck:  {name:'Colar de Guelras', slot:'amulet', hp:60, gill:true, price:12000, shop:'merchant5', lvl:90, icon:'amulet', look:'#5ad0c0'},
  shellhelm: {name:'Elmo de Concha', slot:'helmet', def:16, hp:80, sell:12000, lvl:100, icon:'helmet', look:'#e8c8b0'},
  abyssplate:{name:'Couraça Abissal', slot:'armor', def:36, hp:150, sell:16000, lvl:110, cls:['guerreiro','cacador','monge'], icon:'armor', look:'#3a2a5a'},
  tiderobe:  {name:'Manto da Maré', slot:'armor', def:17, mag:24, sell:16000, lvl:105, cls:MAGES, icon:'robe', look:'#2a8a7a'},
  pearlring: {name:'Anel de Pérola', slot:'ring', mp:100, mag:8, sell:12000, lvl:105, icon:'ring', look:'#e8e0f0'},
  leviathanscale:{name:'Olho do Kraken', slot:'amulet', def:10, hp:150, atk:12, mag:12, gill:true, sell:30000, lvl:120, icon:'krakeye', look:'#2a5a9a'},
  sharkbag:  {name:'Bolsa de Couro de Tubarão', slot:'bag', slots:36, sell:10000, lvl:100, icon:'bag', look:'#7a8a9a', noRarity:true},
  coralblade:{name:'Lâmina de Coral', slot:'weapon', wk:'blade', atk:70, sell:12000, lvl:100, icon:'sword', look:'#e07a50'},
  abyssaxe:  {name:'Machado Abissal', slot:'weapon', wk:'blade', atk:69, sell:12000, lvl:100, icon:'axe', look:'#6a3aaa'},
  pearlmace: {name:'Maça de Pérola', slot:'weapon', wk:'blade', atk:70, sell:12000, lvl:100, icon:'hammer', look:'#e8e0f0'},
  finbow:    {name:'Arco de Barbatana', slot:'weapon', wk:'bow', hands:2, atk:66, sell:12000, lvl:100, icon:'bow', look:'#5ad0c0'},
  tidewand:  {name:'Varinha da Maré', slot:'weapon', wk:'wand', atk:40, mag:50, sell:12000, lvl:100, icon:'wand', look:'#5ad0c0'},
  coralstaff:{name:'Cajado de Coral', slot:'weapon', wk:'staff', atk:40, mag:50, sell:12000, lvl:100, icon:'staff', look:'#e07a50'},
  shellfists:{name:'Punhos de Concha', slot:'weapon', wk:'fist', atk:58, sell:12000, lvl:100, icon:'fist', look:'#e8c8b0'},
});
// armas novas também caem dos chefes e monstros de cada região
for(const [type,ids] of [['walrusking',['glacialaxe','glacialmaul']],['frozencaptain',['glacialsword','blizzardwand']],['wyrmmother',['borealbow','winterstaff']],['frostqueen',['iceclaws','snowboots']],
  ['crabking',['shellfists','pearlmace']],['piratequeen',['coralblade','finbow']],['tidepriest',['tidewand','coralstaff']],['trencheye',['abyssaxe','shellhelm']]]) for(const id of ids) MON[type].loot.push([id,.25,1,1]);
for(const [type,ids] of [['icegiant',['glacialmaul','glacialaxe']],['auroraspirit',['blizzardwand','winterstaff']],['frostserpent',['borealbow','iceclaws']],['yeti',['yeticoat','snowboots']],
  ['abyssal',['abyssaxe','abyssplate']],['fishpriest',['tidewand','coralstaff']],['shark',['finbow','coralblade']],['pirate',['pearlmace','shellfists']]]) for(const id of ids) MON[type].loot.push([id,.012,1,1]);
Object.assign(ITEMS.ignivareye,{icon:'dragoneye'}); Object.assign(ITEMS.queenwing,{icon:'fairywing'}); Object.assign(ITEMS.auroraglass,{icon:'prism'}); Object.assign(ITEMS.frostcrown,{icon:'icecrown'}); Object.assign(ITEMS.walrustusk,{icon:'tusk'}); Object.assign(ITEMS.pearl,{icon:'pearl',look:'#3a3a5a'});



// ============================================================ estado
let cur = MAPS.over;
const player = {kind:'player', x:0,y:0, px:0,py:0, moving:false, mt:0, mdur:1, dir:'down', face:1, phase:0,
  name:'Aventureiro', cls:'guerreiro', buffs:{fury:0}, bossKills:{}, slowT:0, depot:{gold:0,items:[]}, level:1, xp:0, hp:100, mp:30, gold:0, inv:[], eq:{}, atkCd:0, spellCd:{}, path:null, follow:false, pending:null, poison:null, regT:0, dead:false, flash:0, lastHit:0};
let timers = [];
let target = null, monsters = [], spawns = [], corpses = [], decals = [], floats = [], projectiles = [], particles = [];
const quests = {wolves:{state:0,count:0}, king:{state:0}, fae:{state:0,base:0}, ash:{state:0,base:0}};
const LEARNQ = {fae:{lvl:25, item:'fairydust', n:10, boss:'fairyqueen', intro:'O bosque guarda segredos para quem o respeita.'},
                ash:{lvl:45, item:'ember', n:10, item2:'hellfur', n2:5, intro:'O fogo só ensina quem sobrevive a ele.'}};
let npcs = [];
let trauma = 0, running = false, hover = null, dialogRef = null, saveT = 0;
const keys = new Set();


Object.assign(ITEMS, {
  hatchet:   {name:'Machadinha', slot:'weapon', wk:'blade', atk:7, price:50, lvl:1, icon:'axe', look:'#a4aab3'},
  mace:      {name:'Maça de Ferro', slot:'weapon', wk:'blade', atk:13, price:400, lvl:5, icon:'hammer', look:'#9aa0a8'},
  blackaxe:  {name:'Machado de Ferro Negro', slot:'weapon', wk:'blade', atk:22, sell:1500, lvl:15, icon:'axe', look:'#4a4a5a'},
  runemace:  {name:'Maça Rúnica', slot:'weapon', wk:'blade', atk:23, sell:1500, lvl:15, icon:'hammer', look:'#7fd0ff'},
  ironwoodaxe:{name:'Machado de Carvalho-Ferro', slot:'weapon', wk:'blade', atk:21, price:1800, lvl:22, icon:'axe', look:'#8a9a6a'},
  ironwoodmaul:{name:'Martelo de Carvalho-Ferro', slot:'weapon', wk:'blade', atk:22, price:1800, lvl:22, icon:'hammer', look:'#8a9a6a'},
  faeaxe:    {name:'Machado Feérico', slot:'weapon', wk:'blade', atk:27, sell:1400, lvl:30, icon:'axe', look:'#ff9af0'},
  faemace:   {name:'Maça Feérica', slot:'weapon', wk:'blade', atk:28, sell:1400, lvl:30, icon:'hammer', look:'#ff9af0'},
  obsidianaxe:{name:'Machado de Obsidiana', slot:'weapon', wk:'blade', atk:31, price:4500, lvl:35, icon:'axe', look:'#5a4a7a'},
  obsidianmaul:{name:'Martelo de Obsidiana', slot:'weapon', wk:'blade', atk:32, price:4500, lvl:35, icon:'hammer', look:'#5a4a7a'},
  flamesword:{name:'Espada Ígnea', slot:'weapon', wk:'blade', atk:42, sell:3000, lvl:55, icon:'sword', look:'#ff7a2a'},
  magmamaul: {name:'Martelo de Magma', slot:'weapon', wk:'blade', atk:42, sell:3000, lvl:55, icon:'hammer', look:'#ffb02a'},
  dragonaxe: {name:'Machado Dracônico', slot:'weapon', wk:'blade', atk:54, sell:8000, lvl:75, icon:'axe', look:'#ff5a3a'},
  dragonmaul:{name:'Martelo Dracônico', slot:'weapon', wk:'blade', atk:55, sell:8000, lvl:75, icon:'hammer', look:'#c0301a'},
});
const C_ONLY=['cacador'];
Object.assign(ITEMS, {
  arrow_poison:{name:'Flecha de Veneno', stack:true, ammo:'poison', lvl:5,  price:3,  cls:C_ONLY, icon:'arrow', look:'#7ad04a'},
  arrow_pierce:{name:'Flecha Perfurante', stack:true, ammo:'pierce', lvl:8,  price:3,  cls:C_ONLY, icon:'arrow', look:'#d8dce4'},
  arrow_frost: {name:'Flecha de Gelo',    stack:true, ammo:'frost',  lvl:12, price:4,  cls:C_ONLY, icon:'arrow', look:'#9ad8ff'},
  arrow_silver:{name:'Flecha de Prata',   stack:true, ammo:'silver', lvl:15, price:4,  cls:C_ONLY, icon:'arrow', look:'#f0f0ff'},
  arrow_fire:  {name:'Flecha Incendiária',stack:true, ammo:'fire',   lvl:20, price:6,  cls:C_ONLY, icon:'arrow', look:'#ff7a2a'},
  arrow_drain: {name:'Flecha Sanguessuga',stack:true, ammo:'drain',  lvl:25, price:7,  cls:C_ONLY, icon:'arrow', look:'#c0304a'},
  arrow_blast: {name:'Flecha de Pólvora',  stack:true, ammo:'blast',  lvl:35, price:10, cls:C_ONLY, icon:'arrow', look:'#ffb02a'},
  arrow_shock: {name:'Flecha de Trovão',  stack:true, ammo:'shock',  lvl:45, price:12, cls:C_ONLY, icon:'arrow', look:'#fff07a'},
});
const AMMO={
  poison:{txt:'envenena: 5 de dano por segundo durante 5 s (25% do golpe cada)', col:'#7ad04a'},
  pierce:{txt:'ignora 50% da defesa do alvo', col:'#d8dce4', pen:0.5},
  frost: {txt:'deixa o alvo lento por 2,5 s', col:'#9ad8ff'},
  silver:{txt:'+35% de dano contra mortos-vivos', col:'#f0f0ff'},
  fire:  {txt:'queima: 4 s de fogo (35% do golpe por segundo)', col:'#ff7a2a'},
  drain: {txt:'cura você em 20% do dano causado', col:'#c0304a'},
  blast: {txt:'explode e acerta quem está em volta do alvo (45%)', col:'#ffb02a'},
  shock: {txt:'18% de chance de atordoar o alvo por 1,2 s (+30% de dano)', col:'#fff07a'},
};
const canUseAmmo=d=>!d.cls||d.cls.includes(player.cls);
function arrowFx(ak, tg, D, base, st){
      if(ak==='poison') tg.dot={dmg:Math.max(1,Math.round(D*0.25)), ticks:5, t:1000, col:'#7ad04a'};
      if(ak==='fire'){ tg.dot={dmg:Math.max(1,Math.round(D*0.35)), ticks:4, t:1000, col:'#ff9a3a'}; burst(tg,'#ff7a2a',6,50); }
      if(ak==='frost'&&!tg.def.dummy){ tg.slowT=Math.max(tg.slowT||0, tg.def.boss?1200:2500); floatAt(tg,'LENTO','#9ad8ff'); }
      if(ak==='drain'){ const v=Math.round(D*0.2); if(v>0){ player.hp=Math.min(st.maxHp,player.hp+v); floatAt(player,'+'+v,'#c0304a'); } }
      if(ak==='blast'){ for(const m of monsters.filter(m=>m!==tg&&!m.dead&&m.map===cur.id&&cheb(m,tg)<=1)){ const r2=rollP(base*0.45, m.dfn, st, 0, false); hitMonster(m,r2.d,r2.crit,'#ffb02a'); }
        const c=rpos(tg); for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; particles.push({map:cur.id,x:c.x*T+16,y:c.y*T+16,vx:Math.cos(a)*100,vy:Math.sin(a)*100,t:0,life:300,color:i%2?'#ffb02a':'#ff5a2a',size:3}); } }
  if(ak==='shock'&&!tg.dead&&!tg.def.dummy&&arrowFx.spell&&R()<0.18){ const t=tg.def.boss?600:1200; tg.rootT=Math.max(tg.rootT||0,t); tg.cd=Math.max(tg.cd,0)+t; tg.rcd=Math.max(tg.rcd||0,t); floatAt(tg,'ATORDOADO!','#ffd54a'); }
}
function spellArrow(tg, mul, st, x0, y0, delay=0){
  const go=()=>{ if(tg.dead||tg.map!==cur.id) return; const am=ammoId(), ak=am?ITEMS[am].ammo:null; if(am){ takeItem(am,1); if(countItem(am)<=0){ log('Acabou o estoque de '+ITEMS[am].name+'. Usando flechas comuns.','sys'); player.ammo=null; } }
    const a=x0!=null?{x:x0,y:y0}:rpos(player), b=rpos(tg), base=st.atk*mul*(st.spMul||1)*(ak==='silver'&&tg.def.undead?1.35:1);
    projectiles.push({map:cur.id,x0:a.x*T+16,y0:a.y*T+14,x1:b.x*T+16,y1:b.y*T+14,t:0,dur:170,color:ak?AMMO[ak].col:'#e8c890',arrow:true,onHit:()=>{ if(tg.dead) return;
      const r=rollP(base, tg.dfn*(ak==='pierce'?AMMO.pierce.pen:1), st, 0, false); hitMonster(tg, r.d, r.crit, r.crit?'#ffd54a':(ak?AMMO[ak].col:'#e8c890')); leech(r.d,st); if(ak&&!tg.dead){ arrowFx.spell=true; arrowFx(ak,tg,r.d,base,st); arrowFx.spell=false; } }}); };
  if(delay>0) timers.push({t:delay, fn:go}); else go(); }
function fanLanes(){ const tg=target&&!target.dead&&target.map===cur.id?target:null; let dx, dy;
  if(tg){ dx=Math.sign(tg.x-player.x); dy=Math.sign(tg.y-player.y); } if(!dx&&!dy){ const D={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[player.dir]||[0,1]; [dx,dy]=D; }
  const px=-dy, py=dx, lanes=[];
  for(const o of [-1,0,1]){ const sx=player.x+px*o, sy=player.y+py*o; const L=[];
    for(let k=1;k<=6;k++){ const x=sx+dx*k, y=sy+dy*k; if(BLOCKS.has(tileAt(cur,x,y))) break; L.push({x,y}); } lanes.push(L); }
  return {lanes, dx, dy}; }
function fanVolley(st, mul){ const {lanes}=fanLanes(); let hits=0;
  for(const L of lanes){ if(!L.length) continue; const end=L[L.length-1], a=rpos(player); projectiles.push({map:cur.id,x0:a.x*T+16,y0:a.y*T+14,x1:end.x*T+16,y1:end.y*T+14,t:0,dur:220,color:'#e8c890',arrow:true,onHit:()=>{}});
    for(const m of monsters.filter(m=>!m.dead&&m.map===cur.id&&!m.def.dummy&&L.some(q=>q.x===m.x&&q.y===m.y))){ hits++; const d=Math.max(1,Math.abs(m.x-player.x),Math.abs(m.y-player.y)); timers.push({t:30*d, fn:()=>{ if(!m.dead) spellHit(m, st.atk*mul, st, {color:'#ffe08a'}); }}); } }
  return hits; }
function inTownRect(m,x,y){ const r=m.id==='over'?TOWN:m.townRect; return !!(r&&m.town&&x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1); }
function climateTick(dt){
  player.inkT=Math.max(0,(player.inkT||0)-dt);
  const reg=cur.region||cur.id, st=stats();
  if(reg==='ice' && !inTownRect(cur,player.x,player.y)){ player.coldT=(player.coldT??3000)-dt;
    if(player.coldT<=0){ player.coldT=3000;
      if(!(player.buffs.warm>0) && !st.warm){ const wp=allItems().find(i=>i.id==='warmpot'); if(wp) useItem(wp);
        else { hurtPlayer(Math.max(1,Math.round(st.maxHp*0.025)),'Frio'); floatAt(player,'frio','#c8e8ff'); if(!player.coldWarn||now-player.coldWarn>30000){ player.coldWarn=now; log('Você está congelando! Use Poção Quente ou equipamento de pele (Gorro de Pele, Casaco de Ieti, Botas de Neve).','dmg'); } } } } }
  if(reg==='sea'){ if(player.air==null) player.air=100;
    const bub=[[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>tileAt(cur,player.x+dx,player.y+dy)===BUBBLE);
    if(inTownRect(cur,player.x,player.y)||bub) player.air=Math.min(100,player.air+dt/25);
    else { player.air=Math.max(0,player.air-dt/(st.gill?900:450));
      if(player.air<25){ const ap=allItems().find(i=>i.id==='airpot'); if(ap) useItem(ap); }
      if(player.air<=0){ player.drownT=(player.drownT||0)-dt; if(player.drownT<=0){ player.drownT=1000; hurtPlayer(Math.max(1,Math.round(st.maxHp*0.05)),'Afogamento'); floatAt(player,'sem ar!','#9ae0ff');
        if(!player.airWarn||now-player.airWarn>20000){ player.airWarn=now; log('Seu ar acabou! Volte para uma bolha de ar, para a cidade ou beba uma Poção de Fôlego.','dmg'); } } } } }
  else player.air=100;
}
function ammoId(){ const id=player.ammo; return id&&ITEMS[id]?.ammo&&countItem(id)>0?id:null; }
function setAmmo(id){ if(id&&!ITEMS[id]?.ammo) return; if(id&&player.level<(ITEMS[id].lvl||1)){ log(ITEMS[id].name+' exige nível '+ITEMS[id].lvl+'.','sys'); return; }
  player.ammo=id||null; log(id?'Flecha ativa: '+ITEMS[id].name+' ('+countItem(id)+').':'Flecha ativa: comum (infinita).','sys'); uiDirty=true; renderBot(); save(); }
// ---- tipos de arma do guerreiro: espada (penetra armadura), clava (golpe atordoante), machado (acerta em volta)
const bladeKind=d=>!d||d.wk!=='blade'?null:(d.icon==='axe'?'axe':(d.icon==='club'||d.icon==='hammer')?'club':'sword');
const BLADE={sword:{pen:0.5}, club:{bashCh:0.22, bashMul:1.7, stun:1300}, axe:{splash:0.55}};
const BLADE_TXT={sword:'Espada: ignora 50% da defesa do alvo (um alvo só)', club:'Clava: 22% de chance de golpe atordoante (+70% de dano e atordoa 1,3 s)', axe:'Machado: acerta também quem está em volta do alvo (55% do dano)'};
// ---- conjuntos (sets) por classe: 3 por classe, 4 peças cada, com bônus de 2 e 4 peças
const SETS={};
{ const T=[15,40,70], tier=(a,t)=>a[t-1];
  const DEF={heavy:{helmet:[5,11,16],armor:[11,21,30],legs:[6,12,17],boots:[3,7,10]}};
  const mulDef={guerreiro:1, cacador:0.8, monge:0.75, feiticeiro:0.45, xama:0.5};
  const NAMES={guerreiro:{helmet:'Elmo',armor:'Peitoral',legs:'Grevas',boots:'Botas'}, cacador:{helmet:'Capuz',armor:'Colete',legs:'Calças',boots:'Botas'},
    feiticeiro:{helmet:'Chapéu',armor:'Manto',legs:'Calças',boots:'Sapatos'}, xama:{helmet:'Coroa',armor:'Manto',legs:'Calças',boots:'Sandálias'}, monge:{helmet:'Faixa',armor:'Gi',legs:'Calças',boots:'Sandálias'}};
  const ICON={helmet:'helmet',armor:'armor',legs:'legs',boots:'boots'};
  const EXTRA={
    guerreiro:{helmet:{hp:[10,25,50]}, armor:{hp:[20,50,100]}},
    cacador:{helmet:{crit:[1,2,3]}, armor:{atk:[2,4,7]}, legs:{atk:[1,3,5]}},
    feiticeiro:{helmet:{mag:[2,5,8]}, armor:{mag:[4,9,15],mp:[20,50,90]}, legs:{mag:[2,4,7]}},
    xama:{helmet:{mag:[2,4,7]}, armor:{mag:[3,8,13],mp:[15,40,70]}, legs:{hp:[15,35,60]}, boots:{regen:[1,1,2]}},
    monge:{helmet:{atk:[1,2,4]}, armor:{atk:[2,5,8]}, legs:{atkspd:[3,5,8]}}};
  const BONUS={
    guerreiro:[{def:[2,4,6]},{hp:[40,100,180],def:[3,6,10]}],
    cacador:[{crit:[2,3,4]},{atk:[4,8,14],crit:[2,3,5]}],
    feiticeiro:[{mag:[3,6,10]},{mag:[5,10,18],mp:[50,120,220]}],
    xama:[{mag:[2,5,8]},{mag:[4,9,15],hp:[40,90,160],regen:[1,2,3]}],
    monge:[{atk:[2,4,6]},{atk:[4,8,14],atkspd:[6,10,15]}]};
  const LIST={
    guerreiro:[['vanguarda','da Vanguarda','#b8bec8'],['bastiao','do Bastião Rubro','#a83a30'],['tita','do Titã Estelar','#8ab0ff']],
    cacador:[['batedor','do Batedor','#6a7a3a'],['falcoeiro','do Falcoeiro','#b08a4a'],['tempestade','do Caçador das Tormentas','#5ac0d0']],
    feiticeiro:[['pirologo','do Pirólogo','#b04a2a'],['raios','do Tecelão de Raios','#e0c040'],['eclipse','do Arquimago do Eclipse','#7a4ac0']],
    xama:[['andarilho','do Andarilho do Bosque','#4a8a4a'],['mares','do Guardião das Marés','#3a8ab0'],['oraculo','do Oráculo da Geada','#b0e0ff']],
    monge:[['novico','do Noviço do Templo','#d8c8a0'],['jade','do Punho de Jade','#3ab07a'],['sol','do Mestre do Sol Nascente','#ffb03a']]};
  const PRICE={helmet:900,armor:1400,legs:1000,boots:800}, SELL={helmet:[0,1400,4200],armor:[0,2600,7500],legs:[0,1700,5000],boots:[0,1300,4000]};
  for(const [cls,sets] of Object.entries(LIST)) sets.forEach(([key,of,col],ti)=>{ const t=ti+1, sid=cls+'_'+key, pieces=[];
    for(const slot of ['helmet','armor','legs','boots']){ const id='set_'+sid+'_'+slot, d={name:NAMES[cls][slot]+' '+of, slot, def:Math.max(1,Math.round(tier(DEF.heavy[slot],t)*mulDef[cls])), lvl:T[ti], cls:[cls], icon:(slot==='armor'&&MAGES.includes(cls))?'robe':ICON[slot], look:col, set:sid};
      if(slot==='boots') d.speed=[10,20,30][ti];
      for(const [k,v] of Object.entries(EXTRA[cls][slot]||{})) d[k]=tier(v,t);
      if(t===1) d.price=PRICE[slot]; else d.sell=SELL[slot][ti];
      ITEMS[id]=d; pieces.push(id); }
    const b=BONUS[cls].map(o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,tier(v,t)])));
    SETS[sid]={name:'Conjunto '+of.replace(/^(da|do|de) /,''), cls, lvl:T[ti], pieces, b2:b[0], b4:b[1]}; }); }
const SET_STAT={atk:'ataque',mag:'magia',def:'defesa',hp:'vida',mp:'mana',crit:'% crítico',atkspd:'% vel. de ataque',regen:'regeneração'};
const setBonusTxt=o=>Object.entries(o).map(([k,v])=>'+'+v+(k==='crit'||k==='atkspd'?'':' ')+SET_STAT[k]).join(', ');

// ---- habilidades (skills)
const SKILLS=[['ml','Nível mágico'],['melee','Armas'],['fist','Punhos'],['dist','Distância']];
const SKILL_RATE={ guerreiro:{ml:6,melee:1,fist:3,dist:3}, cacador:{ml:2.5,melee:3,fist:3,dist:1}, monge:{ml:2.5,melee:3,fist:1,dist:3},
  feiticeiro:{ml:1,melee:3,fist:3,dist:3}, xama:{ml:1,melee:3,fist:3,dist:3} };
const SKILL_DEF=()=>Object.fromEntries(SKILLS.map(([k])=>[k,{lv:k==='ml'?0:10,p:0}]));
const skillNeed=(k,lv)=>Math.round((k==='ml'?120*Math.pow(1.1,lv):30*Math.pow(1.1,lv-10))*((SKILL_RATE[player.cls]||SKILL_RATE.guerreiro)[k]||3));
const skillLv=k=>player.skills?.[k]?.lv ?? (k==='ml'?0:10);
const skillMul=k=>!k?1:(k==='ml'?1+skillLv('ml')*0.015:1+(skillLv(k)-10)*0.015);
function weaponSkill(){ const d=ITEMS[player.eq.weapon?.id]; if(!d) return 'fist'; if(d.wk==='bow') return 'dist'; if(d.wk==='fist') return 'fist'; if(d.wk==='wand'||d.wk==='staff') return null;
  return 'melee'; }
function mainSkill(){ const c=player.cls; if(MAGES.includes(c)) return 'ml'; if(c==='monge') return 'fist'; if(c==='cacador') return 'dist'; return weaponSkill()||'melee'; }
let skillsDirty=true, castHealMul=1;
function train(k, pts){ if(!k||!player.skills) return; const S=player.skills[k]; S.p+=pts; let up=false;
  while(S.p>=skillNeed(k,S.lv)){ S.p-=skillNeed(k,S.lv); S.lv++; up=true; }
  if(up){ const nm=SKILLS.find(s=>s[0]===k)[1]; log('Você avançou para '+nm.toLowerCase()+' '+S.lv+'.','lvl'); floatAt(player,nm+' '+S.lv+'!','#9fd0ff',true); }
  skillsDirty=true; }
function renderSkills(){ skillsDirty=false; const el=$('skills'); if(!el||!player.skills) return; const main=mainSkill(), w=weaponSkill();
  el.innerHTML=SKILLS.map(([k,nm])=>{ const S=player.skills[k], need=skillNeed(k,S.lv), pct=Math.min(99,Math.floor(S.p/need*100)); const hot=k===main||(k===w&&k!==main);
    return `<div class="sk${hot?' hot':''}" title="${esc(nm)} ${S.lv}: ${pct}% para o próximo · ${k==='ml'?'sobe gastando mana':'sobe atacando com '+(k==='dist'?'arco':k==='fist'?'os punhos':'espadas, machados e clavas')}"><span>${nm}</span><b>${S.lv}</b><i><u style="width:${pct}%"></u></i></div>`; }).join('')
    +`<p class="hint" style="margin:4px 0 0">Dano: +${Math.round((skillMul(main)-1)*100)}% (${SKILLS.find(s=>s[0]===main)[1].toLowerCase()}) · Cura: +${Math.round((skillMul('ml')-1)*100)}%</p>`; }

// ---- bestiário
const BEST_T=d=>d.boss?[1,3,5]:[10,100,500];
const bestKills=t=>player.bestiary?.[t]||0;
const bestStage=t=>{ const T=BEST_T(MON[t]), k=bestKills(t); return k>=T[2]?3:k>=T[1]?2:k>=T[0]?1:0; };
function monRegion(t){ const sp=spawns.find(s=>s.type===t); if(!sp) return 'other'; const M=MAPS[sp.map]; return ['ash','fae','ice','sea'].includes(M.region)?M.region:['ash','fae','ice','sea'].includes(sp.map)?sp.map:'over'; }
function monWhere(t){ return [...new Set(spawns.filter(s=>s.type===t).map(s=>MAPS[s.map].name.replace(/ \(.*\)$/,'')))].join(', ')||'invocado por chefes'; }
const chanceTxt=c=>c>=0.5?'comum':c>=0.15?'incomum':c>=0.04?'semi-raro':c>=0.01?'raro':'muito raro';
let bestTab='over', bestSel=null;
function openBestiary(){
  const all=Object.keys(MON).filter(t=>!MON[t].dummy).filter(t=>spawns.some(s=>s.type===t)||bestKills(t)>0);
  const R={over:'Pedraluz',fae:'Lunária',ash:'Cinzaforte',ice:'Invernália',sea:'Coralina'};
  const list=all.filter(t=>monRegion(t)===bestTab).sort((a,b)=>(MON[a].boss?1:0)-(MON[b].boss?1:0)||(MON[a].lvl||0)-(MON[b].lvl||0));
  const done=all.filter(t=>bestStage(t)===3).length, known=all.filter(t=>bestKills(t)>0).length;
  let body;
  if(bestSel){ const t=bestSel, d=MON[t], st=bestStage(t), T=BEST_T(d), k=bestKills(t);
    body=`<div class="bst-d"><h3>${k?esc(d.name):'???'}${d.boss?' <small class="rn r4">Chefe</small>':''}</h3>
      <p class="hint" style="margin:0 0 6px">${k} morto${k===1?'':'s'} · etapas: ${T.join(' / ')}</p>
      <div class="bst-bar"><i style="width:${Math.min(100,k/T[2]*100)}%"></i>${T.map((x,i)=>`<b style="left:${x/T[2]*100}%" class="${k>=x?'on':''}"></b>`).join('')}</div>
      ${st>=1?`<div class="kv"><span>Nível</span><b>${d.lvl}</b><span>Vida</span><b>${fmtN(d.hp)}</b><span>Experiência</span><b>${fmtN(d.xp)}</b><span>Onde vive</span><b>${esc(monWhere(t))}</b></div>`:`<p class="hint">Derrote ${T[0]} para ver nível, vida, experiência e onde vive.</p>`}
      ${st>=2?`<h4>Saque</h4><div class="bst-loot">${d.loot.map(([id,ch])=>`<span><img alt="" src="${iconURL(id)}">${esc(ITEMS[id].name)} <small>${chanceTxt(ch)}</small></span>`).join('')}</div>`:(st>=1?`<p class="hint">Derrote ${T[1]} para ver o saque.</p>`:'')}
      ${st>=3?`<p class="good" style="margin-top:8px">Completo: você causa +5% de dano a esta criatura.</p>`:`<p class="hint">Complete (${T[2]}) para causar +5% de dano a esta criatura.</p>`}
      <div class="row"><button data-act="back" type="button">Voltar à lista</button></div></div>`;
  } else body=`<div class="tabs">${Object.entries(R).map(([k,l])=>`<button data-act="btab" data-t="${k}" aria-pressed="${bestTab===k}">${l}</button>`).join('')}</div>
    <div class="bst">${list.map(t=>{ const d=MON[t], k=bestKills(t), st=bestStage(t), T=BEST_T(d), nx=st<3?T[st]:T[2];
      return `<button type="button" class="bst-i${st===3?' done':''}" data-act="bsel" data-t="${t}"><span class="nm">${k?esc(d.name):'???'}${d.boss?' ★':''}</span><small>${k?'nível '+d.lvl+' · ':''}${k}/${nx}</small><span class="st">${[1,2,3].map(i=>`<i class="${st>=i?'on':''}"></i>`).join('')}</span></button>`; }).join('')}</div>`;
  openDialog(player,'Bestiário',`<p class="hint" style="margin-top:0">Conhecidas: ${known}/${all.length} · completas: ${done}. Cada criatura tem 3 etapas: informações, saque e completo (+5% de dano contra ela).</p>${body}<div class="row"><button data-act="close" type="button">Fechar</button></div>`,(act,ds)=>{
    if(act==='close'){ bestSel=null; return closeDialog(); }
    if(act==='btab'){ bestTab=ds.t; bestSel=null; } if(act==='bsel') bestSel=ds.t; if(act==='back') bestSel=null; openBestiary(); });
}
function bestiaryKill(t){ if(!player.bestiary) player.bestiary={}; const before=bestStage(t); player.bestiary[t]=(player.bestiary[t]||0)+1; const now2=bestStage(t);
  if(now2>before) log(now2===3?'Bestiário: '+MON[t].name+' completo! +5% de dano contra essa criatura.':'Bestiário: nova etapa de '+MON[t].name+' ('+now2+'/3).','lvl'); }
const AUTO_PENALTY=0.5;  // caça automática: metade da experiência e do saque
const XP_RATE=1;
// curva de experiência: o tempo por nível cresce devagar (meta: nível 25 em ~8 h jogando manualmente e nível 50 em ~22 h; o dobro na caça automática)
const XP_TABLE=[0,0]; for(let k=1;k<=400;k++) XP_TABLE[k+1]=XP_TABLE[k]+Math.round(2445*Math.pow(k,1.3)*Math.min(1,k/10));
const totalXp = L => XP_TABLE[Math.max(1,Math.min(401,L|0))];
const oldTotalXp = L => 50*(L-1)*L;  // XP total para chegar ao nível L
function stats(){
  const C=CLASSES[player.cls]||CLASSES.guerreiro, L=player.level;
  const s={atk:4+Math.floor(L*C.atkLv), mag:Math.floor(L*C.magLv), def:1+Math.floor(L*C.defLv), hp:0, mp:0, crit:5+C.crit, critdmg:150, atkspd:0, lifesteal:0, regen:0, speed:0};
  for(const k in player.eq){ const it=player.eq[k]; if(!it) continue; const d=ITEMS[it.id];
    for(const f of ['atk','mag','def','hp','mp','crit','speed','regen','lifesteal','atkspd']) if(d[f]) s[f]+=d[f];
    for(const a of it.a||[]) s[a.k]+=a.v; }
  { const cnt={}; for(const k in player.eq){ const d=ITEMS[player.eq[k]?.id]; if(d?.set) cnt[d.set]=(cnt[d.set]||0)+1; }
    for(const [sid,n] of Object.entries(cnt)){ const S=SETS[sid]; if(!S) continue; if(n>=2) for(const [k,v] of Object.entries(S.b2)) s[k]+=v; if(n>=4) for(const [k,v] of Object.entries(S.b4)) s[k]+=v; } }
  s.warm=Object.values(player.eq).some(it=>it&&ITEMS[it.id]?.warm===true); s.gill=Object.values(player.eq).some(it=>it&&ITEMS[it.id]?.gill);
  const B=player.buffs||{}; if(B.fury>0) s.def=Math.round(s.def*1.2); if(B.ironskin>0) s.def=Math.round(s.def*1.5); if(B.bark>0) s.def=Math.round(s.def*1.4);
  if(B.wind>0) s.atkspd+=15; if(B.eagle>0) s.crit+=20; if(B.tiger>0){ s.atkspd+=35; s.crit+=5; } if(B.haste>0) s.atkspd+=40; if(B.balance>0) s.lifesteal+=15;
  s.maxHp=C.hp0+L*C.hpLv+s.hp; s.maxMp=C.mp0+L*C.mpLv+s.mp; applyMods(s); s.critCh=Math.min(60,s.crit);
  s.stepDur=Math.round(Math.max(140,250-L*3-s.speed)*(player.slowT>0?1.6:1)*(B.wind>0?0.75:1)*mountSpeed()); s.as=Math.round(C.as/(1+s.atkspd/100)); s.cls=C;
  return s;
}
function attackRange(st){ const wk=ITEMS[player.eq.weapon?.id]?.wk; return (st.cls.range>1 && st.cls.wk.includes(wk)) ? st.cls.range : 1; }


// ============================================================ mundo: entidades
function makeSpawn(map, type, x, y){ spawns.push({map, type, x, y, mon:null, timer:0}); }
function spawnMonster(sp){
  const d=MON[sp.type]; const mult=(d.boss||sp.temp)?1:(MAPS[sp.map].mult||1);
  const m={kind:'mon', type:sp.type, def:d, map:sp.map, x:sp.x, y:sp.y, px:sp.x, py:sp.y, moving:false, mt:0, mdur:1, face:R()<.5?-1:1, phase:R(),
    hp:Math.round(d.hp*mult), maxHp:Math.round(d.hp*mult), atk:Math.round(d.atk*mult), dfn:Math.round(d.def*(1+(mult-1)*0.5)), xp:Math.round(d.xp*mult*(mult>1?1.1:1)), mult, state:'idle', cd:0, rcd:2000, think:R()*2000, react:0, flash:0, sp, dead:false, stuck:0, ph:{}};
  sp.mon=m; monsters.push(m); if(typeof occMap!=='undefined'&&occMap===sp.map&&sp.map===cur.id) occ.set(m.y*cur.W+m.x,m); return m;
}
function setupWorld(){
  const rng=mulberry32(4242); const O=MAPS.over, C=MAPS.cave;
  const pick=(m, n, ok, type)=>{ let tries=0, got=0; while(got<n && tries<5000){ tries++; const x=1+Math.floor(rng()*(m.W-2)), y=1+Math.floor(rng()*(m.H-2)); const tt=m.t[y*m.W+x];
      if(BLOCKS.has(tt)||(m.town&&SAFE.has(tt))||LINKS_T.has(tt)||tt===BRIDGE||(m.dist&&m.dist[y*m.W+x]<0)) continue; if(!ok(x,y)) continue; if(spawns.some(s=>s.map===m.id&&Math.abs(s.x-x)+Math.abs(s.y-y)<3)) continue; makeSpawn(m.id,type,x,y); got++; } };
  const {cx,cy}=TOWN; const dT=(x,y)=>Math.hypot(x-cx,y-cy);
  pick(O,14,(x,y)=>dT(x,y)>11&&dT(x,y)<22&&y>=cy-11&&y<=cy+11,'rat');
  pick(O,10,(x,y)=>y<cy-15&&x<cx+14&&x>18,'wolf');
  pick(O,4,(x,y)=>y<cy-10&&x>cx+14,'bear');
  pick(O,7,(x,y)=>y>cy+13,'cobra');
  pick(O,6,(x,y)=>y>cy+17,'spider');
  pick(O,7,(x,y)=>x<cx-18&&y>15&&Math.hypot(x-10,y-10)>6,'bandit');
  const dr=(M,x,y)=>M.dist[y*M.W+x]/M.maxDist, farB=(M,x,y)=>Math.hypot(x-M.far.x,y-M.far.y)>5;
  const bossAt=(id,type)=>{ const M=MAPS[id]; makeSpawn(id,type,M.boss.x,M.boss.y); };
  const D=DUNGEONS, F=id=>MAPS[id];
  // Ninho de Seda
  { const M=F(D.nest[0]); pick(M,8,(x,y)=>dr(M,x,y)>0.15,'spiderling'); pick(M,7,(x,y)=>dr(M,x,y)>0.2,'spider'); pick(M,6,(x,y)=>dr(M,x,y)>0.35,'weaver'); }
  { const M=F(D.nest[1]); pick(M,6,(x,y)=>dr(M,x,y)>0.15,'spiderling'); pick(M,8,(x,y)=>dr(M,x,y)>0.2&&farB(M,x,y),'spider'); pick(M,7,(x,y)=>dr(M,x,y)>0.3&&farB(M,x,y),'weaver'); bossAt(D.nest[1],'queen'); }
  // Toca das Raízes
  { const M=F(D.den[0]); pick(M,7,(x,y)=>dr(M,x,y)>0.12,'wolf'); pick(M,5,(x,y)=>dr(M,x,y)>0.3,'direwolf'); pick(M,5,(x,y)=>dr(M,x,y)>0.2,'wisp'); }
  { const M=F(D.den[1]); pick(M,8,(x,y)=>dr(M,x,y)>0.15,'direwolf'); pick(M,4,(x,y)=>dr(M,x,y)>0.25,'bear'); pick(M,6,(x,y)=>dr(M,x,y)>0.2,'wisp'); }
  { const M=F(D.den[2]); pick(M,8,(x,y)=>dr(M,x,y)>0.15&&farB(M,x,y),'direwolf'); pick(M,3,(x,y)=>dr(M,x,y)>0.25&&farB(M,x,y),'bear'); pick(M,5,(x,y)=>dr(M,x,y)>0.2&&farB(M,x,y),'wisp'); bossAt(D.den[2],'matriarch'); }
  // Castelo Abandonado
  { const M=F(D.castle[0]); pick(M,10,(x,y)=>dr(M,x,y)>0.15,'bandit'); pick(M,5,(x,y)=>dr(M,x,y)>0.3,'guarddog'); }
  { const M=F(D.castle[1]); pick(M,7,(x,y)=>dr(M,x,y)>0.15,'archer'); pick(M,4,(x,y)=>dr(M,x,y)>0.2,'guarddog'); pick(M,4,(x,y)=>dr(M,x,y)>0.4,'knight'); }
  { const M=F(D.castle[2]); pick(M,6,(x,y)=>dr(M,x,y)>0.15,'knight'); pick(M,6,(x,y)=>dr(M,x,y)>0.15,'archer'); pick(M,3,(x,y)=>dr(M,x,y)>0.3,'guarddog'); }
  { const M=F(D.castle[3]); pick(M,4,(x,y)=>dr(M,x,y)>0.2&&farB(M,x,y),'knight'); pick(M,3,(x,y)=>dr(M,x,y)>0.2&&farB(M,x,y),'archer'); bossAt(D.castle[3],'usurper'); }
  // Cripta Esquecida
  D.cave.forEach((id,i)=>{ const M=F(id), last=i===D.cave.length-1, ok=(x,y)=>!last||farB(M,x,y);
    pick(M,7,(x,y)=>dr(M,x,y)>0.12&&ok(x,y),'bat'); pick(M,i<2?11:8,(x,y)=>dr(M,x,y)>0.2&&ok(x,y),'skeleton'); pick(M,i<2?6:9,(x,y)=>dr(M,x,y)>0.4&&ok(x,y),'ghoul');
    if(last) bossAt(id,'boss'); });
  // ---- Terras Queimadas
  { const A=MAPS.ash, r=A.townRect, out=(x,y)=>x<r.x0-6||x>r.x1+6||y<r.y0-6||y>r.y1+6;
    pick(A,12,(x,y)=>out(x,y)&&y<35,'hellhound'); pick(A,12,(x,y)=>out(x,y)&&y>=35,'firescorp'); pick(A,6,(x,y)=>Math.hypot(x-20,y-12)<14&&Math.hypot(x-20,y-12)>5,'imp'); }
  const AF=(k,i)=>MAPS[ASHD[k][i]];
  const fill=(k,i,list,boss)=>{ const M=AF(k,i); for(const [type,n,minD] of list) pick(M,n,(x,y)=>dr(M,x,y)>(minD||0.15)&&(!boss||farB(M,x,y)),type); if(boss) bossAt(M.id,boss); };
  fill('forge',0,[['imp',10],['pyroimp',6,0.25]]);
  fill('forge',1,[['imp',6],['pyroimp',5],['overseer',3,0.3]],'forgemaster');
  fill('magma',0,[['salamander',9],['cinderbat',7]]);
  fill('magma',1,[['salamander',7],['magmael',6,0.3],['cinderbat',5]],'magmaheart');
  fill('necro',0,[['charskel',10]]);
  fill('necro',1,[['charskel',8],['emberwraith',6,0.25]]);
  fill('necro',2,[['emberwraith',4],['ashghoul',4],['charskel',3]],'ashwidow');
  fill('dragon',0,[['dragonling',10],['cultist',5,0.3]]);
  fill('dragon',1,[['dragonling',7],['youngdragon',4,0.35],['cultist',6]]);
  fill('dragon',2,[['youngdragon',5],['cultist',5],['dragonling',5]],'pyraxis');
  fill('volc',0,[['lavadrake',6],['flamecaller',6]]);
  fill('volc',1,[['lavadrake',7],['obsgolem',3,0.35],['flamecaller',6]]);
  fill('volc',2,[['lavadrake',6],['obsgolem',4],['flamecaller',6]]);
  fill('volc',3,[['lavadrake',4],['obsgolem',3],['flamecaller',4]],'ignivar');
  // ---- Bosque Encantado
  { const F=MAPS.fae, r=F.townRect, out=(x,y)=>x<r.x0-6||x>r.x1+6||y<r.y0-6||y>r.y1+6;
    pick(F,10,(x,y)=>out(x,y)&&y<34,'crystalstag'); pick(F,9,(x,y)=>out(x,y)&&x<44,'gnomebandit'); pick(F,10,(x,y)=>out(x,y)&&y>=34,'hopshroom'); }
  const FF=(k,i)=>MAPS[FAED[k][i]];
  const fillF=(k,i,list,boss)=>{ const M=FF(k,i); for(const [type,n,minD] of list) pick(M,n,(x,y)=>dr(M,x,y)>(minD||0.15)&&(!boss||farB(M,x,y)),type); if(boss) bossAt(M.id,boss); };
  fillF('grotto',0,[['pixie',9],['hopshroom',6],['glowmoth',5,0.3]]);
  fillF('grotto',1,[['pixie',8],['glowmoth',6]],'fairyqueen');
  fillF('glade',0,[['faun',10],['faunpiper',5,0.25]]);
  fillF('glade',1,[['faun',7],['faunpiper',6],['treant',4,0.3]],'elderfaun');
  fillF('heart',0,[['shadowfairy',8],['darkdryad',6,0.25]]);
  fillF('heart',1,[['darkdryad',7],['shadowfairy',6],['rottreant',3,0.35]]);
  fillF('heart',2,[['rottreant',4],['darkdryad',5],['shadowfairy',4]],'oakking');
  // ---- Fiordes Gelados e Recife Profundo
  for(const [reg,list] of [['ice',[['frostwolf',12,(x,y,r)=>y<r.y0-6],['walrus',8,(x,y,r)=>y>r.y1+6],['yeti',6,(x,y,r)=>x>r.x1+8]]],['sea',[['giantcrab',10,(x,y,r)=>y<r.y0-6],['eel',8,(x,y,r)=>y>r.y1+6],['jelly',8,(x,y,r)=>x>r.x1+8]]]]){
    const M=MAPS[reg], r=M.townRect, out=(x,y)=>x>8&&(x<r.x0-6||x>r.x1+6||y<r.y0-6||y>r.y1+6); for(const [type,n,f] of list) pick(M,n,(x,y)=>out(x,y)&&f(x,y,r),type); }
  const fillR=(D,k,i,list,boss)=>{ const M=MAPS[D[k][i]]; for(const [type,n,minD] of list) pick(M,n,(x,y)=>dr(M,x,y)>(minD||0.15)&&(!boss||farB(M,x,y)),type); if(boss) bossAt(M.id,boss); };
  fillR(ICED,'icecave',0,[['frostwolf',9],['walrus',6,0.3]]);
  fillR(ICED,'icecave',1,[['walrus',8],['frostwolf',6]],'walrusking');
  fillR(ICED,'ship',0,[['drowned',10],['icewraith',4,0.3]]);
  fillR(ICED,'ship',1,[['drowned',9],['icewraith',6]]);
  fillR(ICED,'ship',2,[['drowned',5],['icewraith',4]],'frozencaptain');
  fillR(ICED,'wyrm',0,[['yeti',8],['frostserpent',4,0.3]]);
  fillR(ICED,'wyrm',1,[['frostserpent',7],['yeti',6]]);
  fillR(ICED,'wyrm',2,[['frostserpent',6],['yeti',4]],'wyrmmother');
  fillR(ICED,'keep',0,[['yeti',7],['icewraith',6]]);
  fillR(ICED,'keep',1,[['icegiant',5],['icewraith',7]]);
  fillR(ICED,'keep',2,[['icegiant',7],['icewraith',5]]);
  fillR(ICED,'keep',3,[['icegiant',4],['icewraith',4]],'frostqueen');
  fillR(ICED,'aurora',0,[['auroraspirit',8],['icewraith',6]]);
  fillR(ICED,'aurora',1,[['auroraspirit',10],['icegiant',3,0.35]]);
  fillR(ICED,'aurora',2,[['auroraspirit',8],['icegiant',3]],'aurorath');
  fillR(SEAD,'coral',0,[['giantcrab',9],['jelly',7]]);
  fillR(SEAD,'coral',1,[['giantcrab',8],['jelly',5],['eel',4,0.3]],'crabking');
  fillR(SEAD,'wreck',0,[['pirate',10],['eel',4,0.3]]);
  fillR(SEAD,'wreck',1,[['pirate',9],['shark',3,0.35]]);
  fillR(SEAD,'wreck',2,[['pirate',5],['shark',3]],'piratequeen');
  fillR(SEAD,'temple',0,[['fishpriest',8],['jelly',6]]);
  fillR(SEAD,'temple',1,[['fishpriest',9],['eel',6]]);
  fillR(SEAD,'temple',2,[['fishpriest',5],['eel',4]],'tidepriest');
  fillR(SEAD,'trench',0,[['angler',9],['jelly',6]]);
  fillR(SEAD,'trench',1,[['angler',8],['abyssal',3,0.35]]);
  fillR(SEAD,'trench',2,[['angler',5],['abyssal',3]],'trencheye');
  fillR(SEAD,'lair',0,[['shark',8],['eel',6]]);
  fillR(SEAD,'lair',1,[['shark',7],['abyssal',4,0.3]]);
  fillR(SEAD,'lair',2,[['abyssal',6],['shark',6]]);
  fillR(SEAD,'lair',3,[['abyssal',4],['shark',4]],'leviathan');
  for(const s of spawns) spawnMonster(s);
  const {x0,x1,y0}=TOWN;
  npcs=[
    {kind:'npc', id:'priest', name:'Irmã Lúcia', map:'over', x:x0+4, y:y0+2, look:'priest'},
    {kind:'npc', id:'merchant', name:'Doran, o Mercador', map:'over', x:x1-4, y:y0+2, look:'merchant'},
    {kind:'npc', id:'guard', name:'Capitão Bento', map:'over', x:TOWN.cx-3, y:y0+7, look:'guard'},
  ];
  { const O=MAPS.over, A=MAPS.ash, r=A.townRect;
    npcs.push({kind:'npc', id:'boat', name:'Capitã Odila', map:'over', x:O.boatman.x, y:O.boatman.y, look:'boatman'},
      {kind:'npc', id:'boat2', name:'Capitão Brás', map:'ash', x:A.boatman.x, y:A.boatman.y, look:'boatman'},
      {kind:'npc', id:'priest2', name:'Irmã Brasa', map:'ash', x:r.x0+4, y:r.y0+2, look:'firepriest', town:'Cinzaforte'},
      {kind:'npc', id:'merchant2', name:'Varga, a Ferreira', map:'ash', x:r.x1-4, y:r.y0+2, look:'smith'},
      {kind:'npc', id:'depot', name:'Depósito', map:'over', x:TOWN.x0+21, y:TOWN.y1-3, look:'chest'},
      {kind:'npc', id:'depot2', name:'Depósito', map:'ash', x:r.x0+4, y:r.y1-3, look:'chest'},
      {kind:'npc', id:'firesage', name:'Mestre Ígnio', map:'ash', x:r.x1-4, y:r.y1-3, look:'firesage'}); }
  { const F=MAPS.fae, q=F.townRect;
    npcs.push({kind:'npc', id:'boat3', name:'Barqueira Lis', map:'fae', x:F.boatman.x, y:F.boatman.y, look:'boatman'},
      {kind:'npc', id:'priest3', name:'Druida Aurélia', map:'fae', x:q.x0+4, y:q.y0+2, look:'druid', town:'Lunária'},
      {kind:'npc', id:'merchant3', name:'Pip, o Mercador Gnomo', map:'fae', x:q.x1-4, y:q.y0+2, look:'gnome'},
      {kind:'npc', id:'depot3', name:'Depósito', map:'fae', x:q.x0+4, y:q.y1-3, look:'chest'},
      {kind:'npc', id:'sage', name:'Mestra Sylva', map:'fae', x:q.x1-4, y:q.y1-3, look:'sage'}); }
  for(const [reg,n,town,boat,priest,merch] of [['ice',4,'Invernália','Capitão Ulfar','Irmã Neve','Gunnhild, a Peleteira'],['sea',5,'Coralina','Mestre Ondino, o Sineiro','Sacerdotisa Pérola','Escamílio, o Mercador']]){
    const M=MAPS[reg], q=M.townRect;
    npcs.push({kind:'npc', id:'boat'+n, name:boat, map:reg, x:M.boatman.x, y:M.boatman.y, look:'boatman'},
      {kind:'npc', id:'priest'+n, name:priest, map:reg, x:q.x0+4, y:q.y0+2, look:'priest', town},
      {kind:'npc', id:'merchant'+n, name:merch, map:reg, x:q.x1-4, y:q.y0+2, look:'merchant'},
      {kind:'npc', id:'depot'+n, name:'Depósito', map:reg, x:q.x0+4, y:q.y1-3, look:'chest'},
      {kind:'npc', id:'spellmaster'+n, name:reg==='ice'?'Arquimaga Hrefna':'Oráculo Maréleo', map:reg, x:q.x1-4, y:q.y1-3, look:reg==='ice'?'icemage':'seamage'}); }
  npcs.push({kind:'npc', id:'spellmaster', name:'Mestre Aldric, o Arcanista', map:'over', x:TOWN.x0+16, y:TOWN.y1-3, look:'mage'},
    {kind:'npc', id:'towerportal', name:'Torre das Brumas', map:'over', x:TOWN.cx, y:TOWN.cy, look:'portal'},
    {kind:'npc', id:'tailor', name:'Celina, a Alfaiate', map:'over', x:TOWN.x0+3, y:TOWN.y1-3, look:'tailor'},
    {kind:'npc', id:'forger', name:'Bruna, a Forjadora', map:'over', x:TOWN.x0+8, y:TOWN.y1-3, look:'smith'});
  for(const [reg,n,tl,fg] of [['ash',2,'Cinzia, a Costureira','Fornalho, o Forjador'],['fae',3,'Lírio, o Tecelão','Tálio, o Forjador'],['ice',4,'Sigrid, a Peleteira','Bjorn, o Forjador'],['sea',5,'Nácar, a Tecelã','Coralino, o Forjador']]){ const q=MAPS[reg].townRect;
    npcs.push({kind:'npc', id:'forger'+n, name:fg, map:reg, x:q.x0+8, y:q.y1-3, look:'smith'}, {kind:'npc', id:'tailor'+n, name:tl, map:reg, x:q.x0+16, y:q.y1-3, look:'tailor'}); }
  for(const n of npcs){ n.px=n.x; n.py=n.y; n.moving=false; n.mt=0; n.mdur=1; n.phase=R(); n.dir='down'; }
  placeDummies();
}
function freeSpot(id,x0,y0){ const M=MAPS[id]; for(let r=0;r<6;r++) for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue; const x=x0+dx, y=y0+dy;
    if(passPlayer(M,x,y)&&!LINKS_T.has(tileAt(M,x,y))&&!M.links[y*M.W+x]&&!npcs.some(n=>n.map===id&&n.x===x&&n.y===y)&&!spawns.some(s=>s.map===id&&s.x===x&&s.y===y)) return {x,y}; } return {x:x0,y:y0}; }
let occ=new Map(), occMap=null;
function rebuildOcc(){ occ=new Map(); occMap=cur.id; const W=cur.W; for(const m of monsters) if(!m.dead&&m.map===cur.id) occ.set(m.y*W+m.x,m); for(const n of npcs) if(n.map===cur.id) occ.set(n.y*W+n.x,n); if(!player.dead) occ.set(player.y*W+player.x,player); if(ONLINE) for(const o of Net.others.values()) if(o.map===cur.id&&!inTownRect(cur,o.x,o.y)) occ.set(o.y*W+o.x,o); }
function occupied(mapId,x,y,ignore){
  if(mapId===occMap&&mapId===cur.id){ const e=occ.get(y*cur.W+x); return !!e && e!==ignore && !e.dead && !(e===player&&player.dead) && e.x===x && e.y===y; }
  if(!player.dead && player.x===x&&player.y===y&&cur.id===mapId&&ignore!==player) return true;
  for(const m of monsters) if(!m.dead&&m.map===mapId&&m.x===x&&m.y===y&&m!==ignore) return true;
  for(const n of npcs) if(n.map===mapId&&n.x===x&&n.y===y) return true;
  return false;
}
const passPlayer=(m,x,y)=>!BLOCKS.has(tileAt(m,x,y));
const passMon=(m,x,y)=>{const t=tileAt(m,x,y); return !BLOCKS.has(t)&&!LINKS_T.has(t)&&!(m.town&&SAFE.has(t));};


// ============================================================ A* (4 direções)
const DIR4=[[1,0],[-1,0],[0,1],[0,-1]], DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function findPath(m, sx, sy, goal, hx, hy, pass, maxN=1500, ignore, noOcc, diag){
  if(goal(sx,sy)) return [];
  const W=m.W, start=sy*W+sx, gS=new Map([[start,0]]), from=new Map(), heap=[];
  const h=diag?(x,y)=>{ const a=Math.abs(x-hx), b=Math.abs(y-hy); return Math.max(a,b)+0.4*Math.min(a,b); }:(x,y)=>Math.abs(x-hx)+Math.abs(y-hy);
  const push=(f,i)=>{heap.push([f,i]);let k=heap.length-1;while(k>0){const p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;[heap[p],heap[k]]=[heap[k],heap[p]];k=p;}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let k=0;for(;;){const l=2*k+1,r=l+1;let s=k;if(l<heap.length&&heap[l][0]<heap[s][0])s=l;if(r<heap.length&&heap[r][0]<heap[s][0])s=r;if(s===k)break;[heap[s],heap[k]]=[heap[k],heap[s]];k=s;}}return top;};
  push(h(sx,sy),start); let n=0;
  while(heap.length && n++<maxN){
    const [,i]=pop(); const x=i%W, y=(i/W)|0;
    if(goal(x,y)){ const out=[]; let c=i; while(c!==start){ out.push({x:c%W,y:(c/W)|0}); c=from.get(c);} return out.reverse(); }
    const g=gS.get(i);
    for(const [dx,dy] of (diag?DIR8:DIR4)){
      const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=m.W||ny>=m.H) continue;
      if(!pass(m,nx,ny)) continue;
      if(dx&&dy&&cornerBlocked(m,x,y,dx,dy)) continue;
      if(!noOcc&&occupied(m.id,nx,ny,ignore)) continue;
      const j=ny*W+nx, ng=g+(dx&&dy?1.4:1);
      if(ng < (gS.get(j)??1e9)){ gS.set(j,ng); from.set(j,i); push(ng+h(nx,ny), j); }
    }
  }
  return null;
}
function los(m,a,b){ let x0=a.x,y0=a.y; const x1=b.x,y1=b.y, dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx=x0<x1?1:-1, sy=y0<y1?1:-1; let err=dx+dy;
  for(;;){ if(x0===x1&&y0===y1) return true; if(!(x0===a.x&&y0===a.y) && TALL.has(tileAt(m,x0,y0)) && tileAt(m,x0,y0)!==BUSH) return false; const e2=2*err; if(e2>=dy){err+=dy;x0+=sx;} if(e2<=dx){err+=dx;y0+=sy;} } }


const REG_ITEMS={over:['stone','crypt'],fae:['fae'],ash:['fire'],ice:['ice'],sea:['sea']};

function randomGearId(lv, reg){
  let pool=Object.keys(ITEMS).filter(id=>{ const d=ITEMS[id]; return d.slot && d.slot!=='bag' && (d.lvl||1)<=lv+2 && (d.lvl||1)>=lv-20; });
  const ok=REG_ITEMS[reg]; if(ok){ const local=pool.filter(id=>ok.includes(itemRegion(id))); if(local.length) pool=local; }
  const mine=pool.filter(id=>canUse(ITEMS[id]));
  const src=(mine.length && R()<0.65) ? mine : pool;
  return src[Math.floor(R()*src.length)];
}

function roll(atk,def){ if(R()<0.07) return {miss:true}; let d=atk*20/(20+def)*(0.85+R()*0.3); const crit=R()<0.06; if(crit) d*=1.6; return {d:Math.max(1,Math.round(d)),crit}; }

// ---- escadas/buracos que fecham um corredor: abre um desvio ao lado para dar para passar sem trocar de andar
let chokesFixed=[];
function fixLinkChokes(){
  for(const m of Object.values(MAPS)) for(const k of Object.keys(m.links)){
    const i=+k, x=i%m.W, y=(i/m.W)|0;
    const ok=(a,b)=>a>0&&b>0&&a<m.W-1&&b<m.H-1&&!BLOCKS.has(tileAt(m,a,b))&&!m.links[b*m.W+a];
    const nb=DIR4.map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>ok(a,b)); if(nb.length<2) continue;
    const need=new Set(nb.slice(1).map(([a,b])=>b*m.W+a)), seen=new Set([nb[0][1]*m.W+nb[0][0]]), q=[nb[0]];
    for(let h=0;h<q.length&&need.size;h++){ const [a,b]=q[h]; for(const [dx,dy] of DIR4){ const c=a+dx, d=b+dy, j=d*m.W+c; if(seen.has(j)||!ok(c,d)) continue; seen.add(j); need.delete(j); q.push([c,d]); } }
    if(!need.size) continue;
    const floor=tileAt(m,nb[0][0],nb[0][1]), vert=nb.some(([a])=>a===x);
    const sides = vert ? [[1,0],[-1,0]] : [[0,1],[0,-1]];
    for(const [sx,sy] of sides){
      const cells = vert ? [[x+sx,y-1],[x+sx,y],[x+sx,y+1]] : [[x-1,y+sy],[x,y+sy],[x+1,y+sy]];
      if(cells.some(([a,b])=>a<=0||b<=0||a>=m.W-1||b>=m.H-1||m.links[b*m.W+a])) continue;
      for(const [a,b] of cells) if(BLOCKS.has(tileAt(m,a,b))) m.t[b*m.W+a]=floor;
      chokesFixed.push(m.id+'@'+x+','+y); break;
    }
  }
}
fixLinkChokes();
;({T, MAPS, TOWN, MON, ITEMS, CLASSES, BLOCKS, LINKS_T, SAFE, TALL, tileAt, passPlayer:(m,x,y)=>!BLOCKS.has(tileAt(m,x,y)), passMon:(m,x,y)=>{const t=tileAt(m,x,y); return !BLOCKS.has(t)&&!LINKS_T.has(t)&&!(m.town&&SAFE.has(t));},
  cornerBlocked:(m,x,y,dx,dy)=>dx&&dy&&BLOCKS.has(tileAt(m,x+dx,y))&&BLOCKS.has(tileAt(m,x,y+dy)), findPath, los, cheb, setupWorld, get spawns(){ return spawns; }, get npcs(){ return npcs; },
  makeItem, rollRarity, randomGearId, monRegion, roll, player, mulberry32, hash2, R, ri})
