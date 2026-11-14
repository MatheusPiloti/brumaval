// GERADO por mmo/tools/extract.py a partir de src/game.html. Não edite à mão.
(function(root){
// ============================================================ básicos
const T = 32; let VW = 17, VH = 13;
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


const DIR4=[[1,0],[-1,0],[0,1],[0,-1]], DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];

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
const passPlayer=(m,x,y)=>!BLOCKS.has(tileAt(m,x,y));
const passMon=(m,x,y)=>{const t=tileAt(m,x,y); return !BLOCKS.has(t)&&!LINKS_T.has(t)&&!(m.town&&SAFE.has(t));};
const cornerBlocked=(m,x,y,dx,dy)=>dx&&dy&&BLOCKS.has(tileAt(m,x+dx,y))&&BLOCKS.has(tileAt(m,x,y+dy));
const W={T,MAPS,TOWN,BLOCKS,LINKS_T,SAFE,tileAt,passPlayer,passMon,cornerBlocked,mulberry32,hash2,cheb,DUNGEONS:typeof DUNGEONS!=='undefined'?DUNGEONS:null};
if(typeof module!=='undefined') module.exports=W; else root.BrumavalWorld=W;
})(typeof window!=='undefined'?window:globalThis);
