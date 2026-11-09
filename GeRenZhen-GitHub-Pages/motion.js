/* One-shot reveals use one observer; GSAP is optional and loaded after first paint. */
let libraryPromise;
function loadScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.async=true;script.onload=resolve;script.onerror=reject;document.head.append(script);});}
function loadMotionLibrary(){return libraryPromise??=(loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js').then(()=>loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js')).then(()=>{window.gsap.registerPlugin(window.ScrollTrigger);return window.gsap;}).catch(()=>null));}
export function initPortfolioMotion(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return()=>{};
 let disposed=false,gsap=null;const cleanups=[],animations=new Set(),pending=new Map(),touched=new Set();
 const run=(el,from,to,duration=1400,delay=0,hold=false)=>{
 if(!el||disposed)return;touched.add(el);el.style.willChange='transform';
 const done=()=>{if(!hold){el.style.removeProperty('clip-path');el.style.removeProperty('transform');}el.style.removeProperty('will-change');};
 if(gsap){let tween;tween=gsap.fromTo(el,from,{...to,duration:duration/1000,delay:delay/1000,ease:'power4.inOut',onComplete:()=>{done();if(!hold)animations.delete(tween);}});animations.add(tween);}
 else {const animation=el.animate([from,to],{duration,delay,easing:'cubic-bezier(.76,0,.18,1)',fill:'both'});animations.add(animation);animation.onfinish=()=>{done();if(!hold){animation.cancel();animations.delete(animation); }};}
 };
 const reveal=(el,delay=0)=>run(el,{clipPath:'inset(100% 0% 0% 0%)',transform:'translateY(95px) scale(.93)' },{clipPath:'inset(0% 0% 0% 0%)',transform:'translateY(0px) scale(1)'},1900,delay);
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const callback=pending.get(entry.target);pending.delete(entry.target);observer.unobserve(entry.target);callback?.();}},{rootMargin:'0px 0px -6% 0px'});
 const observe=(el,callback)=>{pending.set(el,callback);observer.observe(el);};cleanups.push(()=>observer.disconnect());
 const hero=document.querySelector('.graphicHero');
 // Start immediately; never cover a page that has already waited for a CDN.
 if(hero&&window.scrollY<innerHeight*.4&&!location.hash){
 const curtain=document.createElement('div');curtain.className='openingStage';curtain.setAttribute('aria-hidden','true');curtain.innerHTML='<div class="openingPanel openingPanelTop"></div><div class="openingPanel openingPanelBottom"></div><div class="openingIdentity"><span>WHH<span class="openingDot">.</span></span><small>VISUAL / DESIGN / PORTFOLIO</small><i></i></div>';document.body.append(curtain);
 const identity=curtain.querySelector('.openingIdentity');
 const idAnimation=identity.animate([{opacity:0,transform:'translateY(45px) scale(.86)',clipPath:'inset(100% 0 0 0)'},{offset:.45,opacity:1,transform:'translateY(0px) scale(1)',clipPath:'inset(0% 0 0 0)'},{offset:.7,opacity:1,transform:'translateY(0px) scale(1)',clipPath:'inset(0% 0 0 0)'},{opacity:0,transform:'translateY(-40px) scale(1.08)',clipPath:'inset(0% 0 100% 0)'}],{duration:1500,easing:'cubic-bezier(.76,0,.18,1)',fill:'both'});animations.add(idAnimation);
 run(curtain.querySelector('.openingPanelTop'),{transform:'translateY(0%)'},{transform:'translateY(-101%)'},1650,1000,true);
 run(curtain.querySelector('.openingPanelBottom'),{transform:'translateY(0%)'},{transform:'translateY(101%)'},1650,1150,true);
 const timer=setTimeout(()=>{curtain.remove();idAnimation.cancel();animations.delete(idAnimation);},2850);cleanups.push(()=>{clearTimeout(timer);curtain.remove();});
 hero.classList.add('heroOpening');cleanups.push(()=>hero.classList.remove('heroOpening'));
 const title=hero.querySelector('h1');title.classList.add('motionHeroTitle');
 [...title.children].forEach((el,i)=>run(el,{clipPath:'inset(100% 0% 0% 0%)',transform:'translateY(120%) scaleX(.48) scaleY(1.55) rotate(3deg)'},{clipPath:'inset(0% 0% 0% 0%)',transform:'translateY(0%) scaleX(1) scaleY(1) rotate(0deg)'},2350,1050+i*160));
 reveal(hero.querySelector('.graphicEdition'),1500);reveal(hero.querySelector('.discipline'),1850);reveal(hero.querySelector('.graphicMonogram'),2050);reveal(hero.querySelector('.heroBottom'),2200);
 const heroTimer=setTimeout(()=>hero.classList.remove('heroOpening'),4200);cleanups.push(()=>clearTimeout(heroTimer));
 }
 const headings=['WORK EXPERIENCE','SELECTED FIELDS','E-COMMERCE','3D RENDERING','GLOBAL DESIGN','PHOTOGRAPHY'];
 document.querySelectorAll('.postHeroSurface > section:not(.hero)').forEach((section,index)=>{
 const mask=document.createElement('div');mask.className='motionHeadingMask';const heading=document.createElement('h2');heading.className='motionHeading';heading.textContent=headings[index]||'SELECTED WORKS';mask.append(heading);section.prepend(mask);cleanups.push(()=>mask.remove());
 // Reserve heading layout immediately; skip hiding content already scrolled past.
 if(section.getBoundingClientRect().bottom<0)return;
 heading.style.clipPath='inset(0% 100% 0% 0%)';
 observe(mask,()=>{run(heading,{transform:'translateX(-20%) translateY(125%) scaleY(1.6) rotate(2deg)' ,clipPath:'inset(0% 100% 0% 0%)'},{transform:'translateX(0%) translateY(0%) scaleY(1) rotate(0deg)' ,clipPath:'inset(0% 0% 0% 0%)'},2100);reveal(section.querySelector('.sectionTop'),120);});
 section.querySelectorAll('.experiencePortrait,.experienceBio,.careerJob,.resumePortraitCol,.resumeBlock,.luminousCard,.realDetailStrip,.renderTile,.overseasCard,.photographyCard').forEach((item,k)=>{
 item.classList.add('motionCard');if(item.getBoundingClientRect().bottom<0)return;item.style.clipPath='inset(100% 0% 0% 0%)';observe(item,()=>reveal(item,450+(k%6)*130));cleanups.push(()=>{item.style.removeProperty('clip-path');item.style.removeProperty('transform');item.style.removeProperty('will-change');});
 });
 });
 const footer=document.querySelector('.portfolioFooter');if(footer){footer.querySelectorAll('.footerThanks>span').forEach((line,i)=>{line.style.clipPath='inset(100% 0 0 0)';observe(line,()=>run(line,{clipPath:'inset(100% 0 0 0)',transform:'translateY(110%) scaleX(.75)'},{clipPath:'inset(0% 0 0 0)',transform:'translateY(0%) scaleX(1)'},2100,i*160));cleanups.push(()=>{line.style.removeProperty('clip-path');line.style.removeProperty('transform');});});observe(footer.querySelector('.footerBottom'),()=>reveal(footer.querySelector('.footerBottom'),450));}
 // Only visible desktop images own a scrub animation; release it as soon as they leave.
 const startParallax=()=>{
 if(disposed||!gsap||!matchMedia('(min-width:901px) and (pointer:fine)').matches||navigator.connection?.saveData)return;
 const active=new Map();const io=new IntersectionObserver(entries=>{for(const entry of entries){const img=entry.target;if(entry.isIntersecting&&!active.has(img)){img.classList.add('motionParallax');const tween=gsap.fromTo(img,{yPercent:-3,scale:1.08},{yPercent:3,scale:1.08,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:1.3}});active.set(img,tween);}else if(!entry.isIntersecting&&active.has(img)){const tween=active.get(img);tween.scrollTrigger.kill();tween.kill();active.delete(img);img.style.removeProperty('transform');img.classList.remove('motionParallax');}}});
 document.querySelectorAll('.realRenderImage,.photographyCard img').forEach(img=>io.observe(img));cleanups.push(()=>{io.disconnect();active.forEach((tween,img)=>{tween.scrollTrigger.kill();tween.kill();img.style.removeProperty('transform');img.classList.remove('motionParallax');});active.clear();});
 };
 // Fetch optional scroll tooling only when a visual gallery approaches.
 const libraryObserver=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;libraryObserver.disconnect();if(!disposed&&!navigator.connection?.saveData)loadMotionLibrary().then(lib=>{if(disposed)return;gsap=lib;startParallax();});},{rootMargin:'250px 0px'});
 const gallery=document.querySelector('.renderGallery');if(gallery)libraryObserver.observe(gallery);cleanups.push(()=>libraryObserver.disconnect());
 const cleanup=()=>{disposed=true;cleanups.splice(0).forEach(fn=>fn());animations.forEach(a=>a.kill?a.kill():a.cancel());animations.clear();pending.clear();touched.forEach(el=>{el.style.removeProperty('clip-path');el.style.removeProperty('transform');el.style.removeProperty('will-change');});touched.clear();};
 const onReduce=()=>{if(reduced.matches)cleanup();};reduced.addEventListener('change',onReduce);return()=>{cleanup();reduced.removeEventListener('change',onReduce);};
}
