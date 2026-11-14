"""Transforma uma cópia do jogo solo (src/game.html -> mmo/client/game.html) no cliente online.
Uso: cp src/game.html mmo/client/game.html && python3 mmo/tools/make_online.py
Nesta etapa: monstros e combate rodam em cada navegador (cada um vê os seus); posição, escadas, barcos,
chat, visual e o progresso do personagem ficam no servidor."""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
f=os.path.join(ROOT,'mmo/client/game.html'); s=open(f,encoding='utf-8').read()
assert 'const ONLINE' not in s, 'já convertido'
def rep(a,b,count=1):
    global s
    n=s.count(a); assert n==count,(n,a[:100]); s=s.replace(a,b)
NET=open(os.path.join(ROOT,'mmo/tools/online.js'),encoding='utf-8').read()
rep("const SAVE_KEY = 'brumaval-save-v1';","const SAVE_KEY = 'brumaval-save-v1';\nconst ONLINE = true; // cliente do Brumaval Online")
# chat embaixo do registro + estilos
rep('    <div class="log" id="log" aria-live="polite"></div>','    <div class="log" id="log" aria-live="polite"></div>\n    <form class="chatbar" id="chatBar" hidden autocomplete="off"><select id="chatCh" aria-label="Canal"><option value="local">Local</option><option value="mundo">Mundo</option></select><input id="chatIn" maxlength="200" placeholder="Enter para falar · /quem" aria-label="Mensagem"><button type="submit">Falar</button></form>')
rep(".log div{padding:1px 0}",".log div{padding:1px 0}\n.log .chat{color:#ffe14a}.log .chatw{color:#ffb86a}\n.chatbar{display:flex;gap:6px;flex:none}.chatbar input{flex:1;min-width:0}.chatbar select{width:auto}\n.linkbtn{background:none;border:0;padding:0;color:var(--accent);text-decoration:underline;cursor:pointer;font:inherit}\n[data-p=bot],#btnAfk,#btnSave,#btnAdm,#btnGal,#btnLogout{display:none!important}")
# progresso salvo no servidor
rep("function save(){ if(!running) return;","function save(){ if(!running) return; if(ONLINE){ netSave(); return; }")
# passo: avisa o servidor (na torre o andar é só seu)
rep("  startStep(player,nx,ny,Math.round(stats().stepDur*(dx&&dy?1.4:1))); return true;\n}",
    "  if(ONLINE&&cur.id!=='tower'&&!netSend({t:'step',dx,dy,seq:++Net.seq})) return false;\n  startStep(player,nx,ny,Math.round(stats().stepDur*(dx&&dy?1.4:1))); return true;\n}")
rep("  if(link){ changeMap(link.map, link.x, link.y); return; }","  if(link){ if(!ONLINE) changeMap(link.map, link.x, link.y); return; }")
rep("if(!player.dead) occ.set(player.y*W+player.x,player); }","if(!player.dead) occ.set(player.y*W+player.x,player); if(ONLINE) for(const o of Net.others.values()) if(o.map===cur.id&&!inTownRect(cur,o.x,o.y)) occ.set(o.y*W+o.x,o); }")
# outros jogadores na tela
rep("  for(const n of npcs) if(n.map===m.id) ents.push(n);","  for(const n of npcs) if(n.map===m.id) ents.push(n);\n  if(ONLINE) for(const o of Net.others.values()) if(o.map===m.id) ents.push(o);")
rep("      if(e===player) drawPlayer(ctx,sx,sy); else if(e.kind==='mon') drawMonster(ctx,e,sx,sy); else drawNpc(ctx,e,sx,sy); }",
    "      if(e===player) drawPlayer(ctx,sx,sy); else if(e.kind==='mon') drawMonster(ctx,e,sx,sy); else if(e.kind==='pc') drawOther(ctx,e,sx,sy); else drawNpc(ctx,e,sx,sy); }")
rep("-(e===player?(cosOn('mount')?27:13):(e.kind==='npc'&&e.look!=='chest'&&e.look!=='portal')?13:0);",
    "-(e===player?(cosOn('mount')?27:13):e.kind==='pc'?(e.mount?27:13):(e.kind==='npc'&&e.look!=='chest'&&e.look!=='portal')?13:0);")
rep("    const showName = e.kind==='npc' || e===target || e.def?.boss || e===player;\n    if(e.kind!=='npc'){",
    "    const showName = e.kind==='npc' || e.kind==='pc' || e===target || e.def?.boss || e===player;\n    if(e.kind!=='npc'&&e.kind!=='pc'){")
rep("const name=e===player?player.name:e.kind==='npc'?e.name:e.def.name; const col=e===player?(COSK[player.cos?.name]?.c||'#9fe08a'):e.kind==='npc'?'#9cc3ee':'#ff8a7a';",
    "const name=e===player?player.name:e.kind==='npc'||e.kind==='pc'?e.name:e.def.name; const col=e===player?(COSK[player.cos?.name]?.c||'#9fe08a'):e.kind==='pc'?(COSK[e.nameCol]?.c||'#9fe08a'):e.kind==='npc'?'#9cc3ee':'#ff8a7a';")
rep("  // barras e nomes por cima","  if(ONLINE) drawSpeech();\n  // barras e nomes por cima")
rep("  updatePlayer(dt);","  updatePlayer(dt); if(ONLINE){ updateOthers(dt); updateSpeech(dt); }")
# barco: o servidor leva (o ouro sai daqui)
rep("if(act==='go' && d && player.gold>=d.cost && player.level>=d.lvl){","if(ONLINE&&act==='go'&&d){ closeDialog(); if(player.gold<d.cost||player.level<d.lvl) return; player.gold-=d.cost; uiDirty=true; netSend({t:'travel',to:d.map,level:player.level}); return; }\n      if(act==='go' && d && player.gold>=d.cost && player.level>=d.lvl){")
# Enter abre o chat
rep("  if(e.target.tagName==='INPUT') return;\n  if(!running) return;\n  const k=e.code;",
    "  if(e.target.tagName==='INPUT') return;\n  if(!running) return;\n  const k=e.code;\n  if(ONLINE&&(k==='Enter'||k==='NumpadEnter')&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='SELECT'){ e.preventDefault(); keys.clear(); $('chatIn').focus(); return; }")
rep("$('btnChars').addEventListener('click', async ()=>{ if(!running) return;","$('btnChars').addEventListener('click', async ()=>{ if(!running) return; if(ONLINE){ netSave(true); netSend({t:'logout'}); leaveOnlineWorld(); return; }")
# visual do jogador vai para o servidor (os outros veem roupa, montaria e equipamento)
rep("  if(cosOn('mount')) drawRiderHero(c,x,y,o,player.phase,player.face||1); else drawHero(c,x,y,o,player.phase,player.moving);",
    "  if(ONLINE&&c===ctx) netLook(o);\n  if(cosOn('mount')) drawRiderHero(c,x,y,o,player.phase,player.face||1); else drawHero(c,x,y,o,player.phase,player.moving);")
rep("fixLinkChokes();\nsetupWorld();\nstartScreen();","fixLinkChokes();\nsetupWorld();\n"+NET+"\nif(ONLINE) onlineStart(); else startScreen();")
rep("const boot = data => { if(data && data.save){ begin(data.save); } };","const boot = data => { if(!ONLINE && data && data.save){ begin(data.save); } };")
rep("window.__game = {","window.__game = {Net, netSend, get speech(){return speech}, ")
open(f,'w',encoding='utf-8').write(s); print('cliente online pronto')
