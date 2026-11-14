// ============================================================ online: conexão com o servidor
// O servidor guarda contas, personagens (progresso), posição de todos, escadas, barcos, chat e o visual de cada um.
// Nesta etapa os monstros e o combate rodam no navegador de cada jogador (cada um vê os seus).
const Net={ws:null, token:null, user:null, chars:[], charId:null, seq:0, others:new Map(), online:0, adm:false, retry:0, bye:false, inWorld:false};
const TOKEN_KEY='brumaval-online-token', CHAR_KEY='brumaval-online-char';
function netUrl(){ const s=(window.BRUMAVAL_ONLINE||{}).server; if(s) return s.replace(/^http/,'ws').replace(/\/$/,'')+'/ws'; return (location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws'; }
function netSend(m){ if(Net.ws&&Net.ws.readyState===1){ Net.ws.send(JSON.stringify(m)); return true; } return false; }
function netConnect(){ return new Promise((ok,fail)=>{ let done=false; const ws=new WebSocket(netUrl()); Net.ws=ws;
  ws.onopen=()=>{ done=true; Net.retry=0; ok(ws); }; ws.onerror=()=>{ if(!done){ done=true; fail(new Error('Não foi possível conectar ao servidor.')); } };
  ws.onmessage=e=>{ let m; try{ m=JSON.parse(e.data); }catch(_){ return; } try{ netOn(m); }catch(err){ console.error(err); } }; ws.onclose=()=>netClosed(ws); }); }
const sget=k=>{ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }, sset=(k,v)=>{ try{ v==null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v); }catch(e){} };
function netClosed(ws){ if(ws!==Net.ws||Net.bye) return;
  if(Net.inWorld&&Net.retry<8){ Net.retry++; if(Net.retry===1) log('Conexão perdida. Reconectando…','dmg'); setTimeout(async()=>{ try{ await netConnect(); netSend({t:'resume',token:Net.token,char:Net.charId}); }catch(e){ netClosed(Net.ws); } }, Math.min(5000,600*Net.retry)); return; }
  if(Net.inWorld) leaveOnlineWorld('A conexão com o servidor caiu.'); else onlineStart('A conexão com o servidor caiu.'); }

// ---- progresso: o personagem inteiro é guardado no servidor (no máximo a cada 8 s, e na hora ao sair)
let netSaveT=0, saveTimer=null;
function netSave(now2){ if(!Net.inWorld||!running) return; const go=()=>{ saveTimer=null; netSaveT=Date.now(); netSend({t:'save', data:serialize()}); };
  if(now2) { clearTimeout(saveTimer); go(); return; } if(saveTimer) return; const wait=Math.max(0,8000-(Date.now()-netSaveT)); saveTimer=setTimeout(go,wait); }
// ---- visual: o que os outros veem (roupa, equipamento, montaria) e a velocidade do passo
let lookKey='', lookT=0;
function netLook(o){ if(!Net.inWorld||now-lookT<400) return; lookT=now; const {dir,...lk}=o, mount=cosOn('mount')?.type||null, st=stats();
  const msg={t:'look', look:lk, mount, name:player.cos?.name||null, level:player.level, spd:st.stepDur}; const k=JSON.stringify(msg); if(k===lookKey) return; lookKey=k; netSend(msg); }
// trocas de mapa feitas aqui (renascer, sair da torre) avisam o servidor; as que vêm do servidor não
let netWarping=false; { const _cm=changeMap; changeMap=function(id,x,y,msg){ _cm(id,x,y,msg); if(Net.inWorld&&!netWarping&&id!=='tower'&&MAPS[id]) netSend({t:'sync', map:id, x:player.x, y:player.y}); }; }

// ---- outros jogadores
function classLook(cls){ const C=CLASSES[cls]||CLASSES.guerreiro, L=C.look, eq={}; for(const id of C.start) eq[ITEMS[id].slot]=ITEMS[id];
  return {skin:'#e0b48a', hair:L.bald?null:(L.hair||'#4a2e1a'), hood:L.hood, wizhat:L.hat, band:L.band, body:eq.armor?.look||'#6a6a5a', shield:eq.shield?.ok==='shield'?eq.shield.look:null, weapon:eq.weapon?.look, legs:'#3e3428', wk:eq.weapon?.icon==='quarter'?'staff':eq.weapon?.wk, hs:L.bald?'bald':CLASS_HS[cls]}; }
function addOther(p){ const o={kind:'pc', id:p.id, name:p.name, cls:p.cls, level:p.level, adm:p.adm, map:p.map||cur.id, x:p.x, y:p.y, px:p.x, py:p.y, dir:p.dir||'down', face:1, moving:false, mt:0, mdur:1, phase:R(), hp:1, maxHp:1,
  lk:p.look||classLook(p.cls), mount:p.mount||null, nameCol:p.nameCol||null}; Net.others.set(p.id,o); battleKey=null; return o; }
function updateOthers(dt){ for(const o of Net.others.values()){ o.phase+=dt/(o.moving?260:900); if(o.moving){ o.mt+=dt; if(o.mt>=o.mdur) o.moving=false; } } }
function drawOther(c,o,x,y){ if(o.mount){ drawCreatureArt(c,{type:o.mount, phase:o.phase*0.7, face:o.face||1},x,y+3); drawRiderHero(c,x,y-9,o.lk,o.phase,o.face||1); }
  else drawHero(c,x,y,{...o.lk,dir:o.dir},o.phase,o.moving); }

// ---- mensagens do servidor
function netOn(m){
  switch(m.t){
    case 'auth': Net.token=m.token; Net.user=m.user; Net.chars=m.chars; Net.adm=!!m.adm; sset(TOKEN_KEY,m.token); if(!Net.inWorld) onlineChars(); break;
    case 'autherr': if(m.expired){ sset(TOKEN_KEY,null); Net.token=null; if(Net.inWorld){ leaveOnlineWorld('Sua sessão expirou. Entre de novo.'); return; } onlineLogin(); return; } { const el=$('authMsg'); if(el) el.textContent=m.text; for(const b of document.querySelectorAll('#loginForm button')) b.disabled=false; } break;
    case 'err': { const el=$('charMsg'); if(el&&!running){ el.textContent=m.text; const b=$('btnNew'); if(b) b.disabled=false; } else log(m.text,'sys'); } break;
    case 'chars': Net.chars=m.chars; if(!running) onlineChars(); break;
    case 'enter': enterOnline(m); break;
    case 'join': if(m.p.map===cur.id) addOther(m.p); break;
    case 'leave': Net.others.delete(m.id); battleKey=null; break;
    case 'mv': { const o=Net.others.get(m.id); if(!o) break; if(o.moving){ o.px=o.x; o.py=o.y; } startStep(o,m.x,m.y,m.dur); o.dir=m.dir; break; }
    case 'turn': { const o=Net.others.get(m.id); if(o) o.dir=m.dir; break; }
    case 'look': { const o=Net.others.get(m.id); if(o){ o.lk=m.look||o.lk; o.mount=m.mount||null; o.nameCol=m.name||null; o.level=m.level||o.level; } break; }
    case 'lvl': { const o=Net.others.get(m.id); if(o) o.level=m.level; break; }
    case 'ack': break;
    case 'fix': if(m.map===cur.id){ player.x=player.px=m.x; player.y=player.py=m.y; player.moving=false; player.path=null; player.follow=false; } break;
    case 'roster': { if(m.map!==cur.id) break; Net.others.clear(); for(const p of m.others) addOther(p); battleKey=null; break; }
    case 'warp': { Net.others.clear(); netWarping=true; try{ changeMap(m.map,m.x,m.y,m.text||undefined); } finally { netWarping=false; } for(const p of m.others) addOther(p); battleKey=null; break; }
    case 'chat': { const who=(m.ch==='mundo'?'[Mundo] ':'')+m.from+' ['+m.level+']'; log(who+': '+m.text, m.ch==='mundo'?'chatw':'chat');
      const sp=m.id===Net.charId?player:Net.others.get(m.id); if(sp&&(sp===player||sp.map===cur.id)&&m.ch!=='mundo') say(sp,m.from,m.text); break; }
    case 'sys': log(m.text, m.big?'lvl':'sys'); break;
    case 'you': if(m.level&&m.level!==player.level){ player.level=m.level; player.xp=Math.max(player.xp,totalXp(m.level)); const st=stats(); player.hp=st.maxHp; player.mp=st.maxMp; buildActions(); netSave(); } uiDirty=true; skillsDirty=true; break;
    case 'count': Net.online=m.online; onlineBadge(); break;
    case 'kicked': Net.bye=true; leaveOnlineWorld(m.text); break;
    case 'pong': Net.ping=Date.now()-m.at; onlineBadge(); break;
  }
}
// ---- falas em cima da cabeça
let speech=[];
function say(e,from,text){ speech=speech.filter(s=>s.e!==e); speech.push({e,map:cur.id,from,text:text.length>60?text.slice(0,58)+'…':text,t:0,life:2600+Math.min(4000,text.length*60)}); }
function drawSpeech(){ ctx.save(); ctx.textAlign='center'; ctx.font='600 11px "Pixelify Sans", monospace';
  for(const s of speech){ if(s.map!==cur.id) continue; const r=rpos(s.e), x=Math.round(r.x*T-cam.x)+16, y=Math.round(r.y*T-cam.y)-34; ctx.globalAlpha=clamp((s.life-s.t)/400,0,1);
    for(const [i,l] of [[0,s.from+' diz:'],[1,s.text]]){ ctx.fillStyle='#000'; ctx.fillText(l,x+1,y+i*12-11); ctx.fillStyle=i?'#ffe14a':'#f0c030'; ctx.fillText(l,x,y+i*12-12); } }
  ctx.restore(); }
function updateSpeech(dt){ for(const s of speech) s.t+=dt; speech=speech.filter(s=>s.t<s.life); }

// ---- tela inicial online: entrar, criar conta, escolher personagem
async function onlineStart(note){
  running=false; Net.inWorld=false; $('startScreen').hidden=false; $('startBody').innerHTML='<p class="hint">Conectando ao servidor…</p>';
  if(!Net.ws||Net.ws.readyState!==1){ try{ Net.bye=false; await netConnect(); }catch(e){ $('startBody').innerHTML=`<p class="bad">${esc(e.message)}</p><p class="hint">${esc(netUrl())}</p><div class="row"><button type="button" id="btnRetry">Tentar de novo</button></div>`; $('btnRetry').onclick=()=>onlineStart(); return; } }
  const tk=sget(TOKEN_KEY); if(tk){ Net.token=tk; netSend({t:'resume',token:tk}); if(note) setTimeout(()=>{ const el=$('charMsg'); if(el) el.textContent=note; },300); return; }
  onlineLogin(note);
}
function onlineLogin(note){
  const body=$('startBody');
  body.innerHTML=`<p class="hint" style="margin-top:0"><b>Brumaval Online</b>: todos no mesmo mundo. Versão de teste.</p>
    <form id="loginForm" novalidate>
      <label class="f" for="user">Usuário</label><input type="text" id="user" autocomplete="username" maxlength="20" required>
      <label class="f" for="pass" style="margin-top:8px">Senha</label><input type="password" id="pass" autocomplete="current-password" minlength="6" maxlength="100" required>
      <div class="row"><button class="primary" type="submit" id="btnLogin">Entrar</button><button type="button" id="btnSignup">Criar conta</button></div>
      <p class="hint" id="authMsg" role="status">${note?esc(note):''}</p>
    </form>`;
  const val=()=>[$('user').value.trim().toLowerCase(), $('pass').value], busy=b=>{ for(const x of document.querySelectorAll('#loginForm button')) x.disabled=b; }, msg=t=>{ $('authMsg').textContent=t; };
  $('loginForm').addEventListener('submit',e=>{ e.preventDefault(); const [u,p]=val(); if(!u||!p) return msg('Preencha usuário e senha.'); busy(true); msg('Entrando…'); netSend({t:'login',user:u,pass:p}); });
  $('btnSignup').addEventListener('click',()=>{ const [u,p]=val(); if(!/^[a-z0-9_]{3,20}$/.test(u)) return msg('Usuário: 3 a 20 letras minúsculas, números ou _.'); if(p.length<6) return msg('A senha precisa ter pelo menos 6 caracteres.'); busy(true); msg('Criando conta…'); netSend({t:'register',user:u,pass:p}); });
  $('user').focus();
}
function onlineChars(){
  $('startScreen').hidden=false; const L=Net.chars||[], full=L.length>=5, body=$('startBody');
  body.innerHTML=`<p class="hint" style="margin-top:0">Conta <b>${esc(Net.user||'')}</b> · <button type="button" class="linkbtn" id="btnOut">sair da conta</button></p>`+
    (L.length?`<div class="list" id="charList">${L.map(c=>`<div class="it" style="grid-template-columns:minmax(0,1fr) auto"><div class="meta"><b>${esc(c.name)}</b><small>${(CLASSES[c.cls]||CLASSES.guerreiro).name} · nível ${c.level} · ${esc(MAPS[c.map]?.name||'')}</small></div><div class="btns"><button class="primary" data-play="${c.id}" type="button">Jogar</button><button data-del="${c.id}" type="button">Apagar</button></div></div>`).join('')}</div>`:'')+
    (full?'<p class="hint">Limite de 5 personagens por conta.</p>':`<h2 style="margin-top:14px;font-size:16px">Novo personagem</h2><label class="f" for="heroName">Nome</label><input type="text" id="heroName" maxlength="16" placeholder="Nome do personagem (único no servidor)" autocomplete="off">${classPicker()}
     <div class="row"><button class="primary" id="btnNew" type="button">Criar e jogar</button></div>`)+`<p class="hint" id="charMsg" role="status"></p>`;
  const msg=t=>{ $('charMsg').textContent=t; };
  $('btnOut').onclick=()=>{ sset(TOKEN_KEY,null); Net.token=null; Net.bye=true; try{ Net.ws.close(); }catch(e){} Net.ws=null; onlineStart(); };
  if(!full){ bindClassPicker(); $('btnNew').addEventListener('click',()=>{ const nm=$('heroName').value.trim(); if(!nm) return msg('Escolha um nome.'); $('btnNew').disabled=true; msg('Criando…'); netSend({t:'create',name:nm,cls:chosenClass}); });
    $('heroName').addEventListener('keydown',e=>{ if(e.key==='Enter') $('btnNew').click(); }); }
  $('charList')?.addEventListener('click',e=>{ const p=e.target.closest('[data-play]'), d=e.target.closest('[data-del]');
    if(p){ p.disabled=true; msg('Entrando no mundo…'); netSend({t:'play',id:p.dataset.play}); }
    if(d){ if(d.dataset.armed!=='1'){ d.dataset.armed='1'; d.textContent='Confirmar'; msg('Clique em "Confirmar" para apagar esse personagem para sempre.'); return; } netSend({t:'delete',id:d.dataset.del}); } });
}
function enterOnline(m){ const y=m.you; Net.charId=y.id; Net.online=m.online||0; Net.others.clear(); sset(CHAR_KEY,y.id); lookKey='';
  const place=()=>{ netWarping=true; try{ if(cur.id!==y.map) changeMap(y.map,y.x,y.y,'Você está em '+(MAPS[y.map]?.name||y.map)+'.'); else { player.x=player.px=y.x; player.y=player.py=y.y; } } finally { netWarping=false; } player.moving=false; player.path=null; };
  if(Net.inWorld&&running){ place(); for(const p of m.others) addOther(p); if(Net.retry) log('Conectado de novo.','sys'); Net.retry=0; onlineBadge(); return; }
  Net.inWorld=true; // antes do begin, para o save inicial já ir ao servidor
  chosenClass=y.cls;
  if(y.save&&y.save.level){ begin({...y.save, name:y.name, cls:y.cls, map:y.map, x:y.x, y:y.y}); }
  else { begin(null, y.name); }
  place(); reveal(); miniDirty=true; uiDirty=true; skillsDirty=true;
  for(const p of m.others) addOther(p); Net.retry=0; onlineBadge();
  $('chatBar').hidden=false; log('Você está no Brumaval Online. Aperte Enter para falar. Canal Mundo a partir do nível 5. /quem lista quem está online. Nesta versão, cada jogador vê os próprios monstros.','npc'); }
function leaveOnlineWorld(note){ Net.inWorld=false; running=false; Net.others.clear(); speech=[]; $('chatBar').hidden=true; onlineStart(note); }
function onlineBadge(){ const el=$('acct'); if(!el) return; el.hidden=false; el.textContent='online · '+Net.online+(Net.online===1?' jogador':' jogadores')+(Net.ping!=null?' · '+Net.ping+' ms':''); }
setInterval(()=>{ if(Net.inWorld) netSend({t:'ping',at:Date.now()}); },5000);
addEventListener('pagehide',()=>{ if(Net.inWorld) netSave(true); });
function sendChat(){ const i=$('chatIn'), t=i.value.trim(); if(!t){ i.blur(); return; } if(!netSend({t:'say',text:t,ch:$('chatCh').value})) log('Sem conexão com o servidor.','sys'); i.value=''; i.blur(); }
$('chatBar').addEventListener('submit',e=>{ e.preventDefault(); sendChat(); });
$('chatIn').addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.target.value=''; e.target.blur(); } e.stopPropagation(); });
