const $=s=>document.querySelector(s);
const main=$('#main');
const KEY='toutchie-posts-v1',DRAFT='toutchie-draft-v1';
const categories=['Tecnologia','Cultura','Games','Devaneios'];
const config=window.BLOG_CONFIG||{};
const shared=Boolean(config.supabaseUrl&&config.supabasePublishableKey);
let posts=[],filter='Todos',query='';
const samples=[
 {id:'welcome',title:'O futuro é brega. E a gente também.',category:'Cultura',author:'Toutchie',created_at:'2026-11-21T12:00:00Z',excerpt:'Um manifesto por uma internet menos comportada. Mais cor, mais personalidade e muito mais ruído.',body:'# Bem-vindo à frequência\n\nJá teve a sensação de que todos os sites ficaram iguais? Aqui a gente resolveu girar o botão para o outro lado.\n\n## Bom gosto é opcional. Ter algo a dizer, não.\n\nEste é um espaço para cultura, tecnologia, jogos e pensamentos que não cabem numa caixinha.\n\n> Se a internet é uma cidade, este blog é o letreiro piscando num beco.\n\nPuxe uma cadeira. A transmissão começou.'},
 {id:'bugs',title:'Até o neon tem bug.',category:'Tecnologia',author:'Toutchie',created_at:'2026-11-20T12:00:00Z',excerpt:'Entre código, café e um teste que só falha na sexta-feira: pequenas crônicas de quem constrói a internet.',body:'# Até o neon tem bug\n\nUma interface bonita começa uma conversa. Uma interface que funciona mantém essa conversa viva.\n\n## Teste o caminho improvável\n\nExperimente uma busca sem resultado, uma conexão que cai e um texto maior do que o esperado. É aí que a experiência revela sua qualidade.\n\n> O futuro também precisa de QA.'},
 {id:'games',title:'Mais uma noite em Night City.',category:'Games',author:'Toutchie',created_at:'2026-11-19T12:00:00Z',excerpt:'Cidades imaginárias, escolhas difíceis e a vontade de explorar só mais uma rua antes de desligar.',body:'# Mais uma noite em Night City\n\nAlguns mundos ficam na nossa cabeça mesmo depois que a tela apaga.\n\n## A cidade como personagem\n\nEntre propagandas gigantes e pequenas histórias, a atmosfera faz o trabalho que um mapa sozinho nunca faria.\n\nEste é um post de demonstração. O próximo pode ser seu.'}
];
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{toast('Não foi possível salvar neste navegador. Exporte uma cópia.');return false;}}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function markdown(text=''){return text.split(/\n\s*\n/).map(part=>{if(part.startsWith('### '))return '<h3>'+esc(part.slice(4))+'</h3>';if(part.startsWith('## '))return '<h2>'+esc(part.slice(3))+'</h2>';if(part.startsWith('# '))return '<h2>'+esc(part.slice(2))+'</h2>';if(part.startsWith('> '))return '<blockquote>'+esc(part.slice(2))+'</blockquote>';return '<p>'+esc(part)+'</p>';}).join('');}
function imageUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
function date(p){return new Date(p.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});}
function minutes(p){return Math.max(1,Math.ceil(p.body.split(/\s+/).length/200));}
function toast(msg){$('#toast').textContent=msg;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',5500);}
async function api(path,options={}){const res=await fetch(config.supabaseUrl.replace(/\/$/,'')+'/rest/v1/posts'+path,{...options,headers:{apikey:config.supabasePublishableKey,'Content-Type':'application/json',Prefer:'return=representation',...options.headers},signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error('Não foi possível acessar as postagens compartilhadas ('+res.status+').');return res.status===204?[]:res.json();}
async function load(){const local=read(KEY,[]);posts=shared?await api('?select=*&deleted_at=is.null&order=created_at.desc&limit=500'):[...local,...samples.filter(p=>!local.some(saved=>saved.id===p.id))].filter(p=>!p.deleted_at);}
function card(p){const art=p.category==='Tecnologia'?'tech':p.category==='Games'?'games':'culture';const word=p.category==='Tecnologia'?'SYSTEM_':p.category==='Games'?'PLAY AGAIN':'NO RULES';return `<a class="card" href="#/post/${encodeURIComponent(p.id)}"><div class="card-art ${art}">${imageUrl(p.cover)?`<img loading="lazy" src="${esc(imageUrl(p.cover))}" alt="">`:`<b>${word}</b>`}</div><div class="card-body"><div class="meta"><span>${esc(p.category)}</span><span>${minutes(p)} MIN</span></div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div><div class="card-bottom"><span>POR ${esc(p.author)}</span><span>${esc(date(p))}</span></div></a>`;}
function renderCards(){const visible=posts.filter(p=>(filter==='Todos'||p.category===filter)&&[p.title,p.excerpt,p.author,p.body].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase()));$('#cards').innerHTML=visible.length?visible.map(card).join(''):'<p class="empty">Nenhum sinal por aqui. Tente outra busca ou publique sua primeira postagem.</p>';$('#count').textContent=String(visible.length).padStart(2,'0')+' TRANSMISSÕES';}
function home(){main.innerHTML=`<section class="hero"><div><p class="eyebrow">Uma frequência fora do padrão</p><h1>ALTO VOLUME.<br><em>BAIXO FILTRO.</em><br><span class="outline">ZERO REGRAS.</span></h1><p class="intro">Tecnologia, cultura e os bugs da vida.<br>Um pequeno pedaço da internet com neon demais e nenhuma vontade de ser discreto.</p><div class="actions"><a class="button yellow" href="#feed">Sintonizar o blog</a><a class="button ghost" href="#/sobre">Conhecer a frequência</a></div></div><div class="hero-art"><img src="assets/images/hero.svg" alt="Ilustração vetorial de uma personagem com cabelo roxo, óculos rosa e jaqueta amarela"><div class="art-label"><span>UNDERGROUND BROADCAST</span><span>✦ STAY WEIRD</span></div></div></section><div class="ticker" aria-hidden="true"><div>${Array(4).fill('<span>✦ HIGH TECH, LOW LIFE</span><span>MAU GOSTO. BOAS IDEIAS.</span><span>✦ NÃO ALIMENTE O ALGORITMO</span>').join('')}</div></div><section id="feed" class="feed"><div class="section-top"><div><p class="eyebrow">Interceptamos estes sinais</p><h2>ÚLTIMAS <span>TRANSMISSÕES</span></h2><p id="count"></p></div><label style="margin:0"><span class="save-status">Buscar na frequência</span><input id="search" class="search" type="search" placeholder="O que você procura?" value="${esc(query)}"></label></div><div class="filters" aria-label="Filtrar por categoria">${['Todos',...categories].map(c=>`<button class="chip ${filter===c?'active':''}" data-filter="${c}" aria-pressed="${filter===c}">${c}</button>`).join('')}</div><div id="cards" class="cards"></div></section><section class="banner"><div><h2>TEM ALGO FAZENDO BARULHO AÍ?</h2><p>Ideias estranhas são bem-vindas. Sua próxima transmissão começa aqui.</p></div><a class="button pink" href="#/editor">+ Escrever postagem</a></section>`;renderCards();$('#search').addEventListener('input',e=>{query=e.target.value;renderCards();});document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderCards();}));}
function article(id){const p=posts.find(p=>p.id===id);if(!p){main.innerHTML='<section class="page"><h1>Sinal perdido.</h1><p>Esta postagem não foi encontrada.</p><a class="button" href="#/">Voltar ao blog</a></section>';return;}main.innerHTML=`<article class="page article-page"><a class="eyebrow" href="#/">Voltar às transmissões</a><h1>${esc(p.title)}</h1><p class="meta">${esc(p.category)} · ${esc(p.author)} · ${esc(date(p))} · ${minutes(p)} MIN</p>${imageUrl(p.cover)?`<img class="article-cover" src="${esc(imageUrl(p.cover))}" alt="Capa da postagem">`:''}<div class="article-body">${markdown(p.body)}</div><hr><div class="actions article-actions"><button type="button" class="button danger" id="delete-post">Excluir publicação</button><a class="button ghost" href="#/">Mais transmissões</a></div></article>`;$('#delete-post').addEventListener('click',()=>deletePost(p));}
async function deletePost(post){
  if(!window.confirm('Excluir a publicação "'+post.title+'"? '+(shared?'Ela deixará de aparecer para todos.':'Ela deixará de aparecer neste navegador.')))return;
  const button=$('#delete-post');button.disabled=true;button.textContent='Excluindo…';
  try{
    const archived={...post,deleted_at:new Date().toISOString()};
    if(shared){
      const result=await api('?id=eq.'+encodeURIComponent(post.id)+'&deleted_at=is.null',{method:'PATCH',body:JSON.stringify({deleted_at:archived.deleted_at})});
      if(!Array.isArray(result)||!result.length)throw Error('Exclusão não confirmada. Atualize as políticas do banco conforme o README.');
    }else{
      const local=read(KEY,[]);const remaining=local.filter(p=>p.id!==post.id);
      if(!store(KEY,[archived,...remaining]))return;
    }
    posts=posts.filter(p=>p.id!==post.id);
    location.hash='#/';toast('Publicação excluída da listagem.');
  }catch(err){toast(err.message||'Não foi possível excluir. Tente novamente.');}
  finally{button.disabled=false;button.textContent='Excluir publicação';}
}
function dataFromForm(){return {...Object.fromEntries(new FormData($('#post-form'))),author:'Antonieta'};}
function updatePreview(){const d=dataFromForm();$('#preview').innerHTML=`<span class="meta">${esc(d.category)} · Antonieta</span><h2>${esc(d.title||'Seu título aparece aqui')}</h2><p>${esc(d.excerpt||'Uma breve chamada para sua postagem.')}</p>${imageUrl(d.cover)?`<img class="article-cover" src="${esc(imageUrl(d.cover))}" alt="Prévia da capa">`:''}${markdown(d.body||'O começo de uma nova transmissão…')}`;if(store(DRAFT,d))$('#draft-status').textContent='Rascunho salvo neste navegador.';}
function validPost(p){return p&&typeof p.id==='string'&&p.id.length<=100&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=140&&typeof p.body==='string'&&p.body.trim().length>0&&p.body.length<=40000&&typeof p.author==='string'&&p.author.length<=60&&typeof p.excerpt==='string'&&p.excerpt.length<=280&&categories.includes(p.category)&&Number.isFinite(Date.parse(p.created_at))&&(!p.cover||typeof p.cover==='string'&&p.cover.length<=2000);}
function exportPosts(){const blob=new Blob([JSON.stringify(read(KEY,[]),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='toutchie-postagens.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function editor(){const d=read(DRAFT,{});main.innerHTML=`<section class="page"><p class="eyebrow">Microfone aberto</p><h1>NOVA <em>TRANSMISSÃO.</em></h1><p>Escreva, veja a prévia e coloque sua ideia na frequência.</p><div class="notice">${shared?'PUBLICAÇÃO COMPARTILHADA · Qualquer visitante pode enviar um post, sem login.':'MODO LOCAL · Os posts ficam apenas neste navegador. Para compartilhar com todos, configure o banco conforme o README. Exporte uma cópia para guardar seus textos.'}</div><div class="editor-grid"><form id="post-form" class="panel"><label>Título<input name="title" required maxlength="140" value="${esc(d.title||'')}" placeholder="Uma ideia impossível de ignorar"></label><p class="fixed-author">Autoria: <strong>Antonieta</strong></p><label>Categoria<select name="category">${categories.map(c=>`<option ${d.category===c?'selected':''}>${c}</option>`).join('')}</select></label><label>Resumo<textarea name="excerpt" required maxlength="280" style="min-height:95px" placeholder="A chamada que aparece no blog">${esc(d.excerpt||'')}</textarea></label><label>URL da imagem de capa (opcional, HTTPS)<input name="cover" type="url" maxlength="2000" value="${esc(d.cover||'')}" placeholder="https://..."></label><label>Conteúdo<textarea name="body" required maxlength="40000" placeholder="Use # para títulos, ## para subtítulos e > para citações. Separe os parágrafos por uma linha vazia.">${esc(d.body||'')}</textarea></label><p class="save-status" id="draft-status">Rascunho salvo automaticamente enquanto você escreve.</p><div class="actions"><button class="primary" type="submit">${shared?'Publicar para todos':'Publicar neste navegador'}</button><button class="icon-btn" type="button" id="clear-draft">Limpar rascunho</button></div></form><aside class="panel preview"><p class="eyebrow">Prévia ao vivo</p><div id="preview"></div></aside></div>${!shared?'<div class="panel" style="margin-top:28px"><h2>Seus arquivos</h2><p>Exporte os posts locais ou importe um backup JSON. Importações aparecem apenas neste navegador.</p><button id="export" class="button ghost">Exportar postagens</button><label class="import-label">Importar postagens<input id="import" type="file" accept="application/json,.json"></label></div>':''}</section>`;updatePreview();$('#post-form').addEventListener('input',updatePreview);$('#clear-draft').addEventListener('click',()=>{store(DRAFT,{});editor();});$('#post-form').addEventListener('submit',async e=>{e.preventDefault();const button=e.submitter;const d=dataFromForm();if(d.cover&&!imageUrl(d.cover)){toast('Use uma URL HTTPS válida para a capa.');return;}const p={...d,title:d.title.trim(),author:d.author.trim(),excerpt:d.excerpt.trim(),body:d.body.trim(),id:crypto.randomUUID(),created_at:new Date().toISOString()};if(!validPost(p)){toast('Confira título, nome, resumo e conteúdo.');return;}button.disabled=true;button.textContent='Transmitindo…';try{if(shared){await api('',{method:'POST',body:JSON.stringify(p)});await load();}else{if(!store(KEY,[p,...read(KEY,[])]))return;await load();}store(DRAFT,{});location.hash='#/post/'+encodeURIComponent(p.id);toast(shared?'Sua postagem está no ar para todos.':'Postagem salva neste navegador. Exporte para guardar uma cópia.');}catch(err){toast(err.message+' Seu rascunho continua salvo.');}finally{button.disabled=false;button.textContent=shared?'Publicar para todos':'Publicar neste navegador';}});if(!shared){$('#export').addEventListener('click',exportPosts);$('#import').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>3000000)throw Error('O arquivo deve ter no máximo 3 MB.');const data=JSON.parse(await file.text());if(!Array.isArray(data)||data.length>500||!data.every(validPost))throw Error('Backup inválido: confira o formato e os limites no README.');const merged=new Map(read(KEY,[]).map(p=>[p.id,p]));data.forEach(p=>merged.set(p.id,p));if(store(KEY,[...merged.values()])){await load();toast('Backup importado neste navegador.');}}catch(err){toast(err.message);}e.target.value='';});}}
function about(){main.innerHTML=`<section class="page"><p class="eyebrow">Manifesto da frequência</p><h1>A INTERNET<br>MERECE <em>PERSONALIDADE.</em></h1><div class="article-body"><p>ToutchieToYou é um blog independente para ideias que fazem barulho: tecnologia, cultura, jogos e os devaneios entre uma coisa e outra.</p><blockquote>Mais neon. Menos piloto automático.</blockquote><h2>Um exagero muito bem calculado</h2><p>Rosa choque nos óculos. Amarelo na jaqueta. Roxo no cabelo. A referência vira uma mistura de fanzine, terminal e pôster colado num beco futurista.</p><h2>O microfone está aberto</h2><p>Não existe conta ou nível de usuário. No modo compartilhado, qualquer visitante pode publicar. No modo local, você pode experimentar, escrever e exportar seus posts.</p><h2>Seu ritmo também importa</h2><p>O botão FX no topo desliga os efeitos. A preferência de movimento reduzido do seu dispositivo também é respeitada.</p><a class="button pink" href="#/editor">Começar uma transmissão</a></div></section>`;}
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

