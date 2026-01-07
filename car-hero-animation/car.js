const FRAME_COUNT = 40; // number of frames available in /img/ezgif-split (001...040)
const IMAGE_PATH = './img/ezgif-split/ezgif-frame-';
const IMAGE_EXT = '.jpg';

const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
const loadingEl = document.getElementById('loading');
const loadingPercent = document.getElementById('loading-percent');

let dpr = Math.max(1, window.devicePixelRatio || 1);
let images = [];
let imagesLoaded = 0;
let isReady = false;

// Scroll state
let rafId = null;
let scrollY = 0;
let targetFrame = 0;
let currentFrame = 0;
let needsRender = false;

const heroSection = document.querySelector('.hero');

function pad(num, size = 3){
  let s = String(num);
  while(s.length < size) s = '0' + s;
  return s;
}

function buildImageSrc(i){
  // frames numbered 1..FRAME_COUNT
  return `${IMAGE_PATH}${pad(i)}${IMAGE_EXT}`;
}

function preloadAll(){
  const promises = [];
  for(let i=1;i<=FRAME_COUNT;i++){
    promises.push(new Promise((resolve)=>{
      const img = new Image();
      img.src = buildImageSrc(i);
      img.onload = ()=>{
        images[i] = img; // keep 1-based index for clarity
        imagesLoaded++;
        const pct = Math.round((imagesLoaded/FRAME_COUNT)*100);
        loadingPercent.textContent = pct + '%';
        resolve(img);
      };
      img.onerror = ()=>{
        // still resolve to avoid blocking — create placeholder
        const placeholder = document.createElement('canvas');
        placeholder.width = 1600; placeholder.height = 900;
        const phCtx = placeholder.getContext('2d');
        phCtx.fillStyle = '#050505'; phCtx.fillRect(0,0,placeholder.width,placeholder.height);
        images[i] = placeholder;
        imagesLoaded++;
        const pct = Math.round((imagesLoaded/FRAME_COUNT)*100);
        loadingPercent.textContent = pct + '%';
        resolve(placeholder);
      };
    }));
  }
  return Promise.all(promises);
}

function setCanvasSize(){
  dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

function updateProgress(){
  const rect = heroSection.getBoundingClientRect();
  const vh = window.innerHeight;
  // progress relative to hero section: 0 (top of section visible) to 1 (section scrolled past)
  const totalScrollable = (rect.height - vh);
  let progress = 0;
  if(totalScrollable > 0){
    progress = clamp((window.scrollY - (rect.top + window.scrollY - rect.top)) / totalScrollable, 0, 1);
  }
  // Alternative robust calculation: distance scrolled inside hero
  const heroTop = window.scrollY + rect.top;
  const scrolledInside = clamp((window.scrollY - heroTop) / (rect.height - vh), 0, 1);
  // Use scrolledInside
  progress = scrolledInside;

  // Map to frames 1..FRAME_COUNT
  targetFrame = (FRAME_COUNT - 1) * progress + 1; // 1-based
  needsRender = true;
  // update overlays
  updateOverlays(progress);
}

function updateOverlays(progress){
  const overlays = document.querySelectorAll('.overlay');
  overlays.forEach(el=>{
    const start = parseFloat(el.dataset.start) || 0;
    const end = parseFloat(el.dataset.end) || 1;
    const t = clamp((progress - start) / (end - start), 0, 1);
    // apply easing
    const eased = t<0.5?2*t*t: -1 + (4 - 2*t)*t; // simple easeInOutQuad
    el.style.opacity = eased>0?String(eased):'0';
    // subtle translate for motion
    const move = (1 - eased) * 12;
    el.style.transform = `translateY(${ -move }px)`;
  });
}

function lerp(a,b,t){return a + (b-a)*t}

function draw(){
  if(!isReady) return;
  // Smoothly animate currentFrame towards targetFrame
  currentFrame = lerp(currentFrame, targetFrame, 0.18);
  const index = Math.round(currentFrame);
  const img = images[index] || images[1];
  // clear
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // draw with 'contain' behavior preserving aspect ratio and centering
  const cw = canvas.width / dpr;
  const ch = canvas.height / dpr;
  const iw = img.width || img.naturalWidth || cw;
  const ih = img.height || img.naturalHeight || ch;
  const scale = Math.min(cw / iw, ch / ih);
  const drawW = iw * scale;
  const drawH = ih * scale;
  const dx = (cw - drawW) / 2;
  const dy = (ch - drawH) / 2;
  try{
    ctx.drawImage(img, 0,0, iw, ih, dx, dy, drawW, drawH);
  }catch(e){
    // fallback clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0,0,cw,ch);
  }
}

function loop(){
  if(needsRender){
    draw();
    needsRender = false;
  }
  rafId = requestAnimationFrame(loop);
}

function onScroll(){
  // Single listener minimal work: mark that progress needs update
  scrollY = window.scrollY;
  updateProgress();
}

function onResize(){
  setCanvasSize();
  needsRender = true;
}

// Init sequence
function init(){
  setCanvasSize();
  preloadAll().then(()=>{
    isReady = true;
    // hide loader
    loadingEl.style.display = 'none';
    // show canvas
    canvas.style.visibility = 'visible';
    // ensure starting frame
    currentFrame = 1; targetFrame = 1; needsRender = true;
    // render first image immediately
    draw();
    // start RAF loop
    if(!rafId) loop();
    // attach single scroll listener
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onResize);
    // initial overlay update
    updateProgress();
  }).catch((err)=>{
    console.error('Image preload error',err);
  });
}

// Kick-off
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else init();
