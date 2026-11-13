"""Transforma a cópia do jogo (mmo/client/game.html) no cliente online. Roda uma vez só."""
import os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
f=os.path.join(ROOT,'mmo/client/game.html'); s=open(f,encoding='utf-8').read()
assert 'const ONLINE' not in s, 'já convertido'
def rep(a,b,count=1):
    global s
    n=s.count(a); assert n==count,(n,a[:100]); s=s.replace(a,b)
NET=open(os.path.join(ROOT,'mmo/tools/online.js'),encoding='utf-8').read()
rep("const SAVE_KEY = 'brumaval-save-v1';","const SAVE_KEY = 'brumaval-save-v1';\nconst ONLINE = true; // cliente do Brumaval Online")
# chat embaixo do registro
rep('    <div class="log" id="log" aria-live="polite"></div>','    <div class="log" id="log" aria-live="polite"></div>\n    <form class="chatbar" id="chatBar" hidden autocomplete="off"><select id="chatCh" aria-label="Canal"><option value="local">Local</option><option value="mundo">Mundo</option></select><input id="chatIn" maxlength="200" placeholder="Enter para falar · /quem" aria-label="Mensagem"><button type="submit">Falar</button></form>')
rep(".log div{padding:1px 0}",".log div{padding:1px 0}\n.log .chat{color:#ffe14a}.log .chatw{color:#ffb86a}\n.chatbar{display:flex;gap:6px;flex:none}.chatbar input{flex:1;min-width:0}.chatbar select{width:auto}\n.linkbtn{background:none;border:0;padding:0;color:var(--accent);text-decoration:underline;cursor:pointer;font:inherit}\n.bl.pc{display:grid;grid-template-columns:minmax(0,1fr);gap:1px;padding:4px 8px;border:1px solid var(--line);border-radius:4px;background:var(--panel-2)}.bl.pc .bn{color:#9fe08a}.bl.pc small{color:var(--muted)}\n[data-p=bot],[data-p=quests],[data-p=bosses],#btnAfk,#btnSave,#btnAdm,#btnGal,#btnLogout{display:none!important}")
# sem save local; servidor guarda a posição
rep("function save(){ if(!running) return;","function save(){ if(ONLINE||!running) return;")
# passo: velocidade do servidor e aviso ao servidor
rep("s.stepDur=Math.round(Math.max(140,250-L*3-s.speed)*(player.slowT>0?1.6:1)*(B.wind>0?0.75:1));",
    "s.stepDur=Math.round((ONLINE?Net.step:Math.max(140,250-L*3-s.speed))*(player.slowT>0?1.6:1)*(B.wind>0?0.75:1));")
rep("  startStep(player,nx,ny,Math.round(stats().stepDur*(dx&&dy?1.4:1))); return true;\n}",
    "  if(ONLINE&&!netSend({t:'step',dx,dy,seq:++Net.seq})) return false;\n  startStep(player,nx,ny,Math.round(stats().stepDur*(dx&&dy?1.4:1))); return true;\n}")
# escadas: quem troca de mapa é o servidor
rep("  if(link){ changeMap(link.map, link.x, link.y); return; }","  if(link){ if(!ONLINE) changeMap(link.map, link.x, link.y); return; }")
# outros jogadores bloqueiam fora da cidade
rep("if(!player.dead) occ.set(player.y*W+player.x,player); }","if(!player.dead) occ.set(player.y*W+player.x,player); if(ONLINE) for(const o of Net.others.values()) if(o.map===cur.id&&!inTownRect(cur,o.x,o.y)) occ.set(o.y*W+o.x,o); }")
# desenho dos outros jogadores e nomes
rep("  for(const n of npcs) if(n.map===m.id) ents.push(n);","  for(const n of npcs) if(n.map===m.id) ents.push(n);\n  if(ONLINE) for(const o of Net.others.values()) if(o.map===m.id) ents.push(o);")
rep("      if(e===player) drawPlayer(ctx,sx,sy); else if(e.kind==='mon') drawMonster(ctx,e,sx,sy); else drawNpc(ctx,e,sx,sy); }",
    "      if(e===player) drawPlayer(ctx,sx,sy); else if(e.kind==='mon') drawMonster(ctx,e,sx,sy); else if(e.kind==='pc') drawOther(ctx,e,sx,sy); else drawNpc(ctx,e,sx,sy); }")
rep("    const showName = e.kind==='npc' || e===target || e.def?.boss || e===player;\n    if(e.kind!=='npc'){",
    "    const showName = e.kind==='npc' || e.kind==='pc' || e===target || e.def?.boss || e===player;\n    if(e.kind!=='npc'&&e.kind!=='pc'){")
rep("const name=e===player?player.name:e.kind==='npc'?e.name:e.def.name; const col=e===player?'#9fe08a':e.kind==='npc'?'#9cc3ee':'#ff8a7a';",
    "const name=e===player?player.name:e.kind==='npc'||e.kind==='pc'?e.name:e.def.name; const col=e===player||e.kind==='pc'?'#9fe08a':e.kind==='npc'?'#9cc3ee':'#ff8a7a';")
# falas na tela e atualização dos outros
rep("  // barras e nomes por cima","  if(ONLINE) drawSpeech();\n  // barras e nomes por cima")
rep("  updatePlayer(dt);","  updatePlayer(dt); if(ONLINE){ updateOthers(dt); updateSpeech(dt); }")
rep("function renderBattle(){","function renderBattle(){ if(ONLINE) return renderBattleOnline();")
# barqueiro: o servidor faz a viagem (de graça durante o teste)
rep("${player.gold<d.cost||player.level<d.lvl?'disabled':''}>Viajar (${d.cost} ouro)</button>","${(!ONLINE&&player.gold<d.cost)||player.level<d.lvl?'disabled':''}>Viajar${ONLINE?' (grátis no teste)':` (${d.cost} ouro)`}</button>")
rep("if(act==='go' && d && player.gold>=d.cost && player.level>=d.lvl){","if(ONLINE&&act==='go'&&d){ closeDialog(); netSend({t:'travel',to:d.map}); return; }\n      if(act==='go' && d && player.gold>=d.cost && player.level>=d.lvl){")
# Enter abre o chat
rep("  if(e.target.tagName==='INPUT') return;\n  if(!running) return;\n  const k=e.code;",
    "  if(e.target.tagName==='INPUT') return;\n  if(!running) return;\n  const k=e.code;\n  if(ONLINE&&(k==='Enter'||k==='NumpadEnter')&&e.target.tagName!=='BUTTON'&&e.target.tagName!=='SELECT'){ e.preventDefault(); keys.clear(); $('chatIn').focus(); return; }")
# botão Personagens volta à lista sem recarregar
rep("$('btnChars').addEventListener('click', async ()=>{ if(!running) return;","$('btnChars').addEventListener('click', async ()=>{ if(!running) return; if(ONLINE){ netSend({t:'logout'}); leaveOnlineWorld(); return; }")
# início: sem monstros locais nesta etapa, tela de login online
rep("fixLinkChokes();\nsetupWorld();\nstartScreen();","fixLinkChokes();\nsetupWorld();\nif(ONLINE){ for(const m of monsters) m.dead=true; monsters.length=0; spawns.length=0; }\n"+NET+"\nif(ONLINE) onlineStart(); else startScreen();")
open(f,'w',encoding='utf-8').write(s); print('cliente online pronto')
