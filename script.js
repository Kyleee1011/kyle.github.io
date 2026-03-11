/* ══════════════════════════════════════
   WELCOME SCREEN
══════════════════════════════════════ */
(function(){
  const overlay=document.getElementById('welcomeScreen');
  const tw=document.getElementById('welcomeTypewriter');
  if(!overlay||!tw)return;
  const url='kylejustinedimla.com';
  let i=0;
  const typeInterval=setInterval(()=>{
    if(i<=url.length){tw.textContent=url.slice(0,i)+'|';i++}
    else{clearInterval(typeInterval);tw.textContent=url}
  },200);
  setTimeout(()=>{
    overlay.classList.add('fade-out');
    setTimeout(()=>overlay.remove(),900);
  },3400);
})();

/* ══════════════════════════════════════
   FLOATING BLOBS — Scroll Parallax
══════════════════════════════════════ */
(function(){
  const blobs=[
    {el:document.getElementById('blob1'),ix:-4,iy:0},
    {el:document.getElementById('blob2'),ix:-4,iy:0},
    {el:document.getElementById('blob3'),ix:20,iy:-8},
    {el:document.getElementById('blob4'),ix:20,iy:-8}
  ];
  window.addEventListener('scroll',function(){
    const s=window.pageYOffset;
    blobs.forEach((b,idx)=>{
      if(!b.el)return;
      const xOff=Math.sin(s/100+idx*.5)*340;
      const yOff=Math.cos(s/100+idx*.5)*40;
      b.el.style.transform=`translate(${b.ix+xOff}px,${b.iy+yOff}px)`;
    });
  });
})();

/* ══════════════════════════════════════
   AOS — Scroll Animation System
══════════════════════════════════════ */
(function(){
  function initAOS(){
    const els=document.querySelectorAll('[data-aos]');
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const delay=parseInt(e.target.getAttribute('data-aos-delay')||'0',10);
          setTimeout(()=>e.target.classList.add('aos-animate'),delay);
        }
      });
    },{threshold:0.08});
    els.forEach(el=>{
      const dur=el.getAttribute('data-aos-duration');
      if(dur)el.style.transitionDuration=dur+'ms';
      obs.observe(el);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAOS);
  else initAOS();
})();

/* ══════════════════════════════════════
   TYPEWRITER — Hero Subtitle
══════════════════════════════════════ */
(function(){
  const el=document.getElementById('heroTypewriter');
  if(!el)return;
  const WORDS=['Software Engineer','IT Support Specialist','System Administrator'];
  const TYPE_SPEED=100,ERASE_SPEED=50,PAUSE=2000;
  let wi=0,ci=0,typing=true,text='';
  function tick(){
    if(typing){
      if(ci<WORDS[wi].length){text+=WORDS[wi][ci];ci++;el.textContent=text;setTimeout(tick,TYPE_SPEED)}
      else setTimeout(()=>{typing=false;tick()},PAUSE);
    }else{
      if(ci>0){text=text.slice(0,-1);ci--;el.textContent=text;setTimeout(tick,ERASE_SPEED)}
      else{wi=(wi+1)%WORDS.length;typing=true;tick()}
    }
  }
  tick();
})();

/* ══════════════════════════════════════
   NAVBAR — Scroll Effects
══════════════════════════════════════ */
(function(){
  const nav=document.getElementById('mainNav');
  const links=document.querySelectorAll('.nav-links a');
  const sections=document.querySelectorAll('section[id]');
  window.addEventListener('scroll',()=>{
    const st=window.scrollY;
    if(nav)nav.classList.toggle('scrolled',st>20);
    let cur='';
    sections.forEach(s=>{if(st>=s.offsetTop-300)cur=s.id});
    links.forEach(a=>{
      const h=a.getAttribute('href').replace('#','');
      a.classList.toggle('active',h===cur);
    });
  });
})();

/* ══════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════ */
(function(){
  const btn=document.getElementById('hamburgerBtn');
  const nav=document.getElementById('navLinks');
  if(!btn||!nav)return;
  btn.addEventListener('click',()=>{
    nav.classList.toggle('mobile-open');
    btn.classList.toggle('open');
    const icon=btn.querySelector('i');
    icon.className=nav.classList.contains('mobile-open')?'fas fa-times':'fas fa-bars';
    document.body.style.overflow=nav.classList.contains('mobile-open')?'hidden':'';
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('mobile-open');btn.classList.remove('open');
    btn.querySelector('i').className='fas fa-bars';
    document.body.style.overflow='';
  }));
})();

/* ══════════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t)window.scrollTo({top:t.offsetTop-80,behavior:'smooth'});
  });
});

/* ══════════════════════════════════════
   PORTFOLIO TABS
══════════════════════════════════════ */
(function(){
  const btns=document.querySelectorAll('.tab-btn[data-tab]');
  const panels=document.querySelectorAll('.tab-panel');
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      panels.forEach(p=>p.classList.remove('active'));
      const target=document.getElementById('tab-'+btn.getAttribute('data-tab'));
      if(target){
        target.classList.add('active');
        target.querySelectorAll('[data-aos]').forEach(el=>{
          el.classList.remove('aos-animate');
          setTimeout(()=>el.classList.add('aos-animate'),50);
        });
      }
    });
  });
})();

/* ══════════════════════════════════════
   SEE MORE / SEE LESS PROJECTS
══════════════════════════════════════ */
let showingAll=false;
function toggleProjects(){
  showingAll=!showingAll;
  const activeTabPanel = document.querySelector('.tab-panel.active');
  const extras=activeTabPanel ? activeTabPanel.querySelectorAll('.extra-project') : document.querySelectorAll('.extra-project');
  const btn=document.getElementById('seeMoreBtn');
  extras.forEach((card,i)=>{
    if(showingAll){
      card.style.display='';
      card.style.opacity='0';card.style.transform='translateY(20px)';
      setTimeout(()=>{card.style.transition='opacity .4s,transform .4s';card.style.opacity='1';card.style.transform='translateY(0)';
        card.querySelectorAll('[data-aos]').forEach(el=>el.classList.add('aos-animate'));
        card.classList.add('aos-animate');
      },i*80);
    }else{card.style.display='none'}
  });
  if(btn){
    btn.querySelector('span').textContent=showingAll?'See Less':'See More';
    btn.querySelector('i').style.transform=showingAll?'rotate(180deg)':'';
  }
}

/* ══════════════════════════════════════
   IMAGE LIGHTBOX
══════════════════════════════════════ */
const lbOverlay=document.getElementById('lightboxOverlay');
const lbImg=document.getElementById('lightboxImg');
const lbClose=document.getElementById('lightboxClose');
const lbPrev=document.getElementById('lightboxPrev');
const lbNext=document.getElementById('lightboxNext');
const lbCounter=document.getElementById('lightboxCounter');
const lbContent=document.querySelector('.lightbox-content');
let lbImages=[],lbIdx=0;

function openLightbox(card){
  const attr=card.getAttribute('data-images');
  if(!attr)return;
  lbImages=attr.split(',').map(s=>s.trim());
  lbIdx=0;
  
  lbOverlay.classList.add('active');
  document.body.style.overflow='hidden';
  
  lbContent.classList.remove('show');
  showLB(true);
}

function showLB(isInitial=false){
  if(!isInitial) {
    lbImg.classList.add('switching');
    setTimeout(() => {
      updateLBContent();
      lbImg.classList.remove('switching');
    }, 250);
  } else {
    updateLBContent();
    setTimeout(() => lbContent.classList.add('show'), 50);
  }
}

function updateLBContent(){
  lbImg.src=lbImages[lbIdx];
  lbCounter.textContent=(lbIdx+1)+' / '+lbImages.length;
  lbPrev.style.display=lbImages.length>1?'flex':'none';
  lbNext.style.display=lbImages.length>1?'flex':'none';
}

function closeLB(){
  lbContent.classList.remove('show');
  lbOverlay.classList.remove('active');
  setTimeout(()=>{document.body.style.overflow=''}, 400);
}

if(lbClose)lbClose.addEventListener('click',closeLB);
if(lbOverlay)lbOverlay.addEventListener('click',e=>{if(e.target===lbOverlay||e.target===lbContent)closeLB()});
if(lbPrev)lbPrev.addEventListener('click',e=>{e.stopPropagation();lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;showLB()});
if(lbNext)lbNext.addEventListener('click',e=>{e.stopPropagation();lbIdx=(lbIdx+1)%lbImages.length;showLB()});
document.addEventListener('keydown',e=>{
  if(!lbOverlay||!lbOverlay.classList.contains('active'))return;
  if(e.key==='Escape')closeLB();
  if(e.key==='ArrowLeft'){lbIdx=(lbIdx-1+lbImages.length)%lbImages.length;showLB()}
  if(e.key==='ArrowRight'){lbIdx=(lbIdx+1)%lbImages.length;showLB()}
});

/* ══════════════════════════════════════
   CONTACT FORM (FormSubmit)
══════════════════════════════════════ */
(function(){
  const form=document.getElementById('contactForm');
  const btn=document.getElementById('submitBtn');
  const msg=document.getElementById('successMessage');
  if(!form)return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    btn.disabled=true;btn.querySelector('span').textContent='Sending...';
    const data={name:document.getElementById('name').value,email:document.getElementById('email').value,message:document.getElementById('message').value};
    try{
      const res=await fetch('https://formsubmit.co/ajax/dimlakylejustine@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
      if(res.ok){msg.style.display='block';form.reset();setTimeout(()=>msg.style.display='none',5000)}
    }catch(err){alert('Message sent! Thank you.');form.reset()}
    finally{btn.disabled=false;btn.querySelector('span').textContent='Send Message'}
  });
})();

/* ══════════════════════════════════════
   CHATBOT (Netlify Functions + Gemini)
══════════════════════════════════════ */
(function(){
  const container=document.getElementById('chatContainer');
  const toggle=document.getElementById('chatToggleBtn');
  const close=document.getElementById('closeChatBtn');
  const input=document.getElementById('chatInput');
  const send=document.getElementById('chatSendBtn');
  const messages=document.getElementById('chatMessages');

  toggle?.addEventListener('click',()=>{container.classList.toggle('active');if(container.classList.contains('active'))input.focus()});
  close?.addEventListener('click',()=>container.classList.remove('active'));

  function getCtx(){
    let c='You are the AI representative for Kyle Justine C. Dimla.\nINSTRUCTIONS:\n1. Answer based on the resume below.\n2. Use bullet points for lists and bold for key skills.\n3. Be professional and concise.\n--- RESUME ---\n';
    ['About','Portfolio','Contact'].forEach(id=>{const el=document.getElementById(id);if(el)c+='['+id.toUpperCase()+']\n'+el.innerText.replace(/\s+/g,' ').trim()+'\n\n'});
    return c;
  }
  function fmt(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<strong>$1</strong>').replace(/^\s*[-*]\s+(.*)$/gm,'• $1')}
  function addMsg(t,isUser,type){const d=document.createElement('div');d.className='message '+(isUser?'user':'bot '+(type||''));if(isUser||type==='loading')d.textContent=t;else d.innerHTML=fmt(t);messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}

  async function sendMsg(){
    const t=input.value.trim();if(!t)return;
    addMsg(t,true);input.value='';
    const ld=addMsg('Thinking...',false,'loading');
    try{
      const r=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,context:getCtx()})});
      const d=await r.json();messages.removeChild(ld);
      if(d.error)addMsg('Error: '+d.error,false);
      else addMsg(d.candidates?.[0]?.content?.parts?.[0]?.text||'No response.',false);
    }catch(err){messages.removeChild(ld);addMsg('System Error: Unable to reach AI server.',false)}
  }
  send?.addEventListener('click',sendMsg);
  input?.addEventListener('keypress',e=>{if(e.key==='Enter')sendMsg()});
})();
