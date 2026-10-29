/* Rivela opening animation: runs once per browsing session. */
(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const key='rivela-intro-seen';try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1')}catch(e){}
const intro=document.createElement('div');intro.className='rivela-intro';intro.setAttribute('aria-hidden','true');
const content=document.createElement('div');content.className='rivela-intro-content';
const word=document.createElement('span');word.className='rivela-intro-word';word.textContent='Rivela';
const slogan=document.createElement('span');slogan.className='rivela-intro-tagline';slogan.textContent='il tuo valore finalmente visibile';
content.append(word,slogan);intro.append(content);document.body.prepend(intro);
setTimeout(()=>intro.remove(),3800);
})();