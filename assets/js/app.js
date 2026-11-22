const $=s=>document.querySelector(s);
const main=$('#main');
const DRAFT='toutchie-draft-v1';
const categories=['Tecnologia','Cultura','Games','Devaneios'];
const config=window.BLOG_CONFIG||{};
const githubRepository=config.githubRepository||'';
const postsPath=config.postsPath||'data/posts.json';
const apiBaseUrl=(config.apiBaseUrl||'').replace(/\/$/,'');
let postsSha='',posts=[],filter='Todos',query='';
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{toast('Não foi possível salvar neste navegador. Exporte uma cópia.');return false;}}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function markdown(text=''){return text.split(/\n\s*\n/).map(part=>{if(part.startsWith('### '))return '<h3>'+esc(part.slice(4))+'</h3>';if(part.startsWith('## '))return '<h2>'+esc(part.slice(3))+'</h2>';if(part.startsWith('# '))return '<h2>'+esc(part.slice(2))+'</h2>';if(part.startsWith('> '))return '<blockquote>'+esc(part.slice(2))+'</blockquote>';return '<p>'+esc(part)+'</p>';}).join('');}
function imageUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
function date(p){return new Date(p.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});}
function minutes(p){return Math.max(1,Math.ceil(p.body.split(/\s+/).length/200));}
function toast(msg){$('#toast').textContent=msg;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',5500);}
async function load(){const res=await fetch(postsPath+'?v='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error('Não foi possível carregar as postagens publicadas.');const data=await res.json();posts=(Array.isArray(data)?data:data.posts||[]).filter(validPost).sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at));}
async function writePost(method,payload){
  if(!apiBaseUrl)throw Error('A URL da API ainda não foi configurada.');
  const headers={'Content-Type':'application/json'};
  if(method==='DELETE'){const password=window.prompt('Senha de administração:');if(!password)throw Error('Operação cancelada.');headers.Authorization='Bearer '+password;}
  const result=await fetch(apiBaseUrl+'/api/posts',{method,headers,body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)});
  if(!result.ok){const err=await result.json().catch(()=>({}));throw Error(err.error||'Não foi possível atualizar a postagem.');}
}
function card(p){const art=p.category==='Tecnologia'?'tech':p.category==='Games'?'games':'culture';const word=p.category==='Tecnologia'?'SYSTEM_':p.category==='Games'?'PLAY AGAIN':'NO RULES';return `<a class="card" href="#/post/${encodeURIComponent(p.id)}"><div class="card-art ${art}">${imageUrl(p.cover)?`<img loading="lazy" src="${esc(imageUrl(p.cover))}" alt="">`:`<b>${word}</b>`}</div><div class="card-body"><div class="meta"><span>${esc(p.category)}</span><span>${minutes(p)} MIN</span></div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div><div class="card-bottom"><span>POR ${esc(p.author)}</span><span>${esc(date(p))}</span></div></a>`;}
function renderCards(){const visible=posts.filter(p=>(filter==='Todos'||p.category===filter)&&[p.title,p.excerpt,p.author,p.body].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()));$('#cards').innerHTML=visible.length?visible.map(card).join(''):'<p class="empty">Nenhum sinal por aqui. Tente outra busca ou publique sua primeira postagem.</p>';$('#count').textContent=String(visible.length).padStart(2,'0')+' TRANSMISSÕES';}
function home(){main.innerHTML=`<section class="hero"><div><p class="eyebrow">Uma frequência fora do padrão</p><h1>ALTO VOLUME.<br><em>BAIXO FILTRO.</em><br><span class="outline">ZERO REGRAS.</span></h1><p class="intro">Tecnologia, cultura e os bugs da vida.<br>Um pequeno pedaço da internet com neon demais e nenhuma vontade de ser discreto.</p><div class="actions"><a class="button yellow" href="#feed">Sintonizar o blog</a><a class="button ghost" href="#/sobre">Conhecer a frequência</a></div></div><div class="hero-art"><img src="assets/images/hero.svg" alt="Ilustração vetorial de uma personagem com cabelo roxo, óculos rosa e jaqueta amarela"><div class="art-label"><span>UNDERGROUND BROADCAST</span><span>✦ STAY WEIRD</span></div></div></section><div class="ticker" aria-hidden="true"><div>${Array(4).fill('<span>✦ HIGH TECH, LOW LIFE</span><span>MAU GOSTO. BOAS IDEIAS.</span><span>✦ NÃO ALIMENTE O ALGORITMO</span>').join('')}</div></div><section id="feed" class="feed"><div class="section-top"><div><p class="eyebrow">Interceptamos estes sinais</p><h2>ÚLTIMAS <span>TRANSMISSÕES</span></h2><p id="count"></p></div><label style="margin:0"><span class="save-status">Buscar na frequência</span><input id="search" class="search" type="search" placeholder="O que você procura?" value="${esc(query)}"></label></div><div class="filters" aria-label="Filtrar por categoria">${['Todos',...categories].map(c=>`<button class="chip ${filter===c?'active':''}" data-filter="${c}" aria-pressed="${filter===c}">${c}</button>`).join('')}</div><div id="cards" class="cards"></div></section><section class="banner"><div><h2>TEM ALGO FAZENDO BARULHO AÍ?</h2><p>Ideias estranhas são bem-vindas. Sua próxima transmissão começa aqui.</p></div><a class="button pink" href="#/editor">+ Escrever postagem</a></section>`;renderCards();$('#search').addEventListener('input',e=>{query=e.target.value;renderCards();});document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderCards();}));}
function article(id){const p=posts.find(p=>p.id===id);if(!p){main.innerHTML='<section class="page"><h1>Sinal perdido.</h1><p>Esta postagem não foi encontrada.</p><a class="button" href="#/">Voltar ao blog</a></section>';return;}main.innerHTML=`<article class="page article-page"><a class="eyebrow" href="#/">Voltar às transmissões</a><h1>${esc(p.title)}</h1><p class="meta">${esc(p.category)} · ${esc(p.author)} · ${esc(date(p))} · ${minutes(p)} MIN</p>${imageUrl(p.cover)?`<img class="article-cover" src="${esc(imageUrl(p.cover))}" alt="Capa da postagem">`:''}<div class="article-body">${markdown(p.body)}</div><hr><div class="actions article-actions"><button type="button" class="button danger" id="delete-post">Excluir publicação</button><a class="button ghost" href="#/">Mais transmissões</a></div></article>`;$('#delete-post').addEventListener('click',()=>deletePost(p));}
async function deletePost(post){
  if(!window.confirm('Excluir a publicação "'+post.title+'" do JSON publicado?'))return;
  const button=$('#delete-post');button.disabled=true;button.textContent='Excluindo…';
  try{
    await writePost('DELETE',{id:post.id});posts=posts.filter(p=>p.id!==post.id);
    location.hash='#/';toast('Publicação excluída da listagem.');
  }catch(err){toast(err.message||'Não foi possível excluir. Tente novamente.');}
  finally{button.disabled=false;button.textContent='Excluir publicação';}
}
function dataFromForm(){const form=new FormData($('#post-form'));return {title:String(form.get('title')||''),category:String(form.get('category')||''),excerpt:String(form.get('excerpt')||''),cover:String(form.get('cover')||''),body:String(form.get('body')||''),author:'Antonieta'};}
function updatePreview(){const d=dataFromForm();$('#preview').innerHTML=`<span class="meta">${esc(d.category)} · Antonieta</span><h2>${esc(d.title||'Seu título aparece aqui')}</h2><p>${esc(d.excerpt||'Uma breve chamada para sua postagem.')}</p>${imageUrl(d.cover)?`<img class="article-cover" src="${esc(imageUrl(d.cover))}" alt="Prévia da capa">`:''}${markdown(d.body||'O começo de uma nova transmissão…')}`;if(store(DRAFT,d))$('#draft-status').textContent='Rascunho salvo neste navegador.';}
function validPost(p){return p&&typeof p.id==='string'&&p.id.length<=100&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=140&&typeof p.body==='string'&&p.body.trim().length>0&&p.body.length<=40000&&typeof p.author==='string'&&p.author.length<=60&&typeof p.excerpt==='string'&&p.excerpt.length<=280&&categories.includes(p.category)&&Number.isFinite(Date.parse(p.created_at))&&(!p.cover||typeof p.cover==='string'&&p.cover.length<=2000);}
function editor(){const d=read(DRAFT,{});if(Object.prototype.hasOwnProperty.call(d,'github-token')){delete d['github-token'];store(DRAFT,d);}main.innerHTML=`<section class="page"><p class="eyebrow">Painel editorial</p><h1>NOVA <em>TRANSMISSÃO.</em></h1><p>Salve diretamente em <code>data/posts.json</code>; o GitHub Pages republica o blog depois do commit.</p><div class="editor-grid"><form id="post-form" class="panel"><label>Título<input name="title" required maxlength="140" value="${esc(d.title||'')}" placeholder="Uma ideia impossível de ignorar"></label><p class="fixed-author">Autoria: <strong>Antonieta</strong></p><label>Categoria<select name="category">${categories.map(c=>`<option ${d.category===c?'selected':''}>${c}</option>`).join('')}</select></label><label>Resumo<textarea name="excerpt" required maxlength="280" style="min-height:95px" placeholder="A chamada que aparece no blog">${esc(d.excerpt||'')}</textarea></label><label>URL da imagem de capa (opcional, HTTPS)<input name="cover" type="url" maxlength="2000" value="${esc(d.cover||'')}" placeholder="https://..."></label><label>Conteúdo<textarea name="body" required maxlength="40000" placeholder="Use # para títulos, ## para subtítulos e > para citações. Separe os parágrafos por uma linha vazia.">${esc(d.body||'')}</textarea></label><p class="save-status" id="draft-status">Rascunho salvo automaticamente neste navegador; o post só é publicado ao enviar.</p><div class="actions"><button class="primary" type="submit">Salvar e publicar</button><button class="icon-btn" type="button" id="clear-draft">Limpar rascunho</button></div></form><aside class="panel preview"><p class="eyebrow">Prévia ao vivo</p><div id="preview"></div></aside></div></section>`;updatePreview();$('#post-form').addEventListener('input',updatePreview);$('#clear-draft').addEventListener('click',()=>{store(DRAFT,{});editor();});$('#post-form').addEventListener('submit',async e=>{e.preventDefault();const button=e.submitter;const d=dataFromForm();if(d.cover&&!imageUrl(d.cover)){toast('Use uma URL HTTPS válida para a capa.');return;}const p={...d,title:d.title.trim(),author:d.author.trim(),excerpt:d.excerpt.trim(),body:d.body.trim(),id:crypto.randomUUID(),created_at:new Date().toISOString()};if(!validPost(p)){toast('Confira título, nome, resumo e conteúdo.');return;}button.disabled=true;button.textContent='Salvando no GitHub…';try{await writePost('POST',{post:p});posts=[p,...posts];store(DRAFT,{});location.hash='#/post/'+encodeURIComponent(p.id);toast('Postagem salva no GitHub. O Pages será atualizado em instantes.');}catch(err){toast((err.message||'Não foi possível publicar.')+' Seu rascunho continua salvo.');}finally{button.disabled=false;button.textContent='Salvar e publicar';}});}
function about(){main.innerHTML=`<section class="page"><p class="eyebrow">Manifesto da Antonieta</p><h1>AS <em>BABADEIRAS</em><br>DE NIGHT CITY.</h1><div class="article-body"><p>Oi, antonets! Eu sou a Antonieta, e criei este cantinho para a gente conversar sobre tudo o que está acontecendo nessa cidade que nunca desliga as luzes — porque, convenhamos, em Night City uma semana sem fofoca, drama ou novidade tecnológica é praticamente férias.</p><blockquote>Se aconteceu sob neon, se teve look, lágrima, caos ou plot twist: a gente comenta.</blockquote><h2>Um blog para as minhas antonets</h2><p>Tem notícia quente, cultura pop de madrugada, games que viram assunto no grupo, tendências duvidosas e aquelas pequenas cenas da vida que pedem um texto dramático, uma música triste e talvez um glitter a mais.</p><p>É bem aquela energia dos blogs dos anos 2010: opinião sem cerimônia, internet como diário, títulos chamativos e a sensação de que estamos todas reunidas no quarto depois da aula — só que agora com prédios gigantes, hologramas e taxis voando do lado de fora.</p><h2>Chega mais, gata</h2><p>Este espaço é para acompanhar, rir, surtir um pouquinho e transformar o barulho da cidade em história. Pega seu energético, ajusta o brilho da tela e vem ficar por dentro das babadeiras.</p><p>Com carinho, neon e zero discrição,<br><strong>Antonieta ✦</strong></p><a class="button pink" href="#/">Ler as transmissões</a></div></section>`;}
function route(){const hash=location.hash||'#/';if(hash==='#feed'){if(!$('#feed'))home();$('#feed').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return;}if(hash==='#/editor')editor();else if(hash==='#/sobre')about();else if(hash.startsWith('#/post/')){try{article(decodeURIComponent(hash.slice(7)));}catch{article('');}}else home();window.scrollTo(0,0);}
let effects=read('toutchie-fx',true);function applyEffects(){document.body.classList.toggle('effects-off',!effects);$('#effects').textContent='FX '+(effects?'ON':'OFF');$('#effects').setAttribute('aria-pressed',String(effects));}$('#effects').addEventListener('click',()=>{effects=!effects;store('toutchie-fx',effects);applyEffects();});applyEffects();
// Continuous sparks, including when the pointer is stationary.
const cursorMotion=matchMedia('(prefers-reduced-motion: reduce)');
const cursorFine=matchMedia('(pointer:fine)');
const cursorState={x:0,y:0,inside:false,last:0,frame:0};
const cursorElement=$('#cursor');
function cursorEnabled(){return effects&&!cursorMotion.matches&&cursorFine.matches&&cursorState.inside&&!document.hidden;}
function cursorSpark(){
  const s=document.createElement('span');
  s.className='spark';s.setAttribute('aria-hidden','true');
  s.textContent=Math.random()>.5?'✦':'·';
  const angle=Math.random()*Math.PI*2,distance=16+Math.random()*44;
  s.style.left=cursorState.x+'px';s.style.top=cursorState.y+'px';
  s.style.setProperty('--dx',Math.cos(angle)*distance+'px');
  s.style.setProperty('--dy',Math.sin(angle)*distance+18+'px');
  s.style.setProperty('--spin',(Math.random()*180-90)+'deg');
  s.style.setProperty('--life',(450+Math.random()*450)+'ms');
  s.style.fontSize=(10+Math.random()*13)+'px';
  s.style.color=['var(--pink)','var(--yellow)','var(--cyan)'][Math.floor(Math.random()*3)];
  document.body.append(s);
  s.addEventListener('animationend',()=>s.remove(),{once:true});
  setTimeout(()=>s.remove(),1000);
}
function stopCursor(){
  cursorState.inside=false;document.body.classList.remove('custom-cursor');
  cancelAnimationFrame(cursorState.frame);cursorState.frame=0;
  document.querySelectorAll('.spark').forEach(s=>s.remove());
}
function animateCursor(time){
  cursorState.frame=0;
  const active=cursorEnabled();document.body.classList.toggle('custom-cursor',active);
  if(active&&time-cursorState.last>85){cursorState.last=time;cursorSpark();cursorSpark();}
  if(cursorState.inside&&!document.hidden)cursorState.frame=requestAnimationFrame(animateCursor);
}
function startCursor(){if(!cursorState.frame&&cursorState.inside&&!document.hidden)cursorState.frame=requestAnimationFrame(animateCursor);}
window.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'){stopCursor();return;}
  cursorState.x=e.clientX;cursorState.y=e.clientY;cursorState.inside=true;
  cursorElement.style.transform='translate3d('+(e.clientX-14)+'px,'+(e.clientY-14)+'px,0)';
  startCursor();
});
document.documentElement.addEventListener('pointerleave',stopCursor);
window.addEventListener('blur',stopCursor);
window.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&cursorEnabled())for(let i=0;i<9;i++)cursorSpark();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCursor();});
cursorMotion.addEventListener('change',()=>{if(cursorMotion.matches)stopCursor();});
cursorFine.addEventListener('change',()=>{if(!cursorFine.matches)stopCursor();});
$('#year').textContent=new Date().getFullYear();window.addEventListener('hashchange',route);
(async()=>{main.innerHTML='<section class="page"><p class="eyebrow">Sintonizando transmissões…</p></section>';try{await load();route();}catch(err){main.innerHTML='<section class="page"><h1>Interferência no sinal.</h1><p>'+esc(err.message)+'</p><p>Confira a configuração do banco e recarregue a página.</p><button class="button" id="retry">Tentar novamente</button></section>';$('#retry').addEventListener('click',()=>location.reload());}})();

