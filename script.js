// VIP-MODE-PANEL safe demo script
const colors = [
  {name:'RED', css:'#ff4d4f', text:'#fff'},
  {name:'GREEN', css:'#2ecc71', text:'#061224'},
  {name:'BLUE', css:'#33b5e5', text:'#fff'},
  {name:'YELLOW', css:'#ffd166', text:'#061224'},
  {name:'PURPLE', css:'#9b59b6', text:'#fff'}
];

const randomizeBtn = document.getElementById('randomizeBtn');
const pullBtn = document.getElementById('pullBtn');
const previewNumber = document.getElementById('previewNumber');
const previewSize = document.getElementById('previewSize');
const previewColor = document.getElementById('previewColor');

const finalNumber = document.getElementById('finalNumber');
const finalSize = document.getElementById('finalSize');
const finalColor = document.getElementById('finalColor');

const historyList = document.getElementById('historyList');

const popSound = document.getElementById('popSound');

let nextIndex = 1;
let lastResult = null;
let currentPreview = null;

function intBetween(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

function pickRandom(){
  const size = Math.random() < 0.5 ? 'BIG' : 'SMALL';
  const number = (size==='BIG') ? intBetween(5,9) : intBetween(0,4);
  const color = colors[Math.floor(Math.random()*colors.length)];
  const id = Math.floor(Math.random()*9000)+1000;
  return { size, number, color, id };
}

function showPreview(obj){
  previewNumber.textContent = String(obj.number);
  previewSize.textContent = obj.size;
  previewColor.textContent = obj.color.name;
  previewColor.style.background = obj.color.css;
  previewColor.style.color = obj.color.text;
  animate(previewNumber);
}

function animate(el){
  el.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:400,easing:'ease'});
}

function revealFinal(){
  if(!currentPreview) currentPreview = pickRandom();
  finalNumber.textContent = String(currentPreview.number);
  finalSize.textContent = currentPreview.size;
  finalColor.textContent = currentPreview.color.name;
  finalColor.style.background = currentPreview.color.css;
  finalColor.style.color = currentPreview.color.text;
  animate(finalNumber);

  // play sound
  try{ popSound.currentTime = 0; popSound.play(); }catch(e){ /* ignore */ }

  addToHistory({
    index: nextIndex++,
    size: currentPreview.size,
    number: currentPreview.number,
    color: currentPreview.color.name,
    prev: lastResult ? (lastResult.size + ' ' + lastResult.number + ' ' + lastResult.color) : '—'
  });

  lastResult = { size: currentPreview.size, number: currentPreview.number, color: currentPreview.color.name };
  currentPreview = null;

  // reset preview
  previewNumber.textContent = '—';
  previewSize.textContent = '—';
  previewColor.textContent = '----';
}

function addToHistory(entry){
  const el = document.createElement('div');
  el.className = 'history-item';
  el.innerHTML = '<div>#' + entry.index + ' • Prev: ' + entry.prev + '</div><div>' + entry.size + ' • ' + entry.number + ' • ' + entry.color + '</div>';
  historyList.prepend(el);
  while(historyList.children.length>50) historyList.removeChild(historyList.lastChild);
}

// UI wiring
randomizeBtn.addEventListener('click', ()=>{
  currentPreview = pickRandom();
  showPreview(currentPreview);
});

pullBtn.addEventListener('click', ()=>{
  revealFinal();
});

// Active users popup
const activeBtn = document.getElementById('activeBtn');
const activePopup = document.getElementById('activePopup');
const closePopup = document.getElementById('closePopup');
const activeNumber = document.getElementById('activeNumber');

// show popup with a number over ten thousand
activeBtn.addEventListener('click', ()=>{
  // generate a friendly large number > 10000
  const n = 10000 + Math.floor(Math.random()*5000) + 235;
  activeNumber.textContent = n.toLocaleString();
  activePopup.classList.remove('hidden');
});

closePopup.addEventListener('click', ()=> activePopup.classList.add('hidden'));

// keyboard shortcuts
document.addEventListener('keydown', (e)=>{
  if(e.key==='r' || e.key==='R') randomizeBtn.click();
  if(e.key==='p' || e.key==='P') pullBtn.click();
});

// seed demo history
(function seed(){
  addToHistory({ index: nextIndex++, size:'BIG', number:7, color:'RED', prev:'—' });
  addToHistory({ index: nextIndex++, size:'SMALL', number:3, color:'GREEN', prev:'BIG 7 RED' });
})();
