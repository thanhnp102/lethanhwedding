const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8');
function run(url,label){
  const dom=new JSDOM(html,{url,runScripts:'dangerously',pretendToBeVisual:true});
  const w=dom.window, d=w.document;
  console.log(`\n=== ${label} ===`);
  console.log('flag hiển thị:', d.getElementById('langFlag').textContent);
  console.log('active opt:', [...d.querySelectorAll('.langopt')].filter(o=>o.classList.contains('active')).map(o=>o.getAttribute('data-lang')).join(','));
  console.log('menu open ban đầu:', d.getElementById('langMenu').classList.contains('open'));
  // mở menu
  d.getElementById('langBtn').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  console.log('sau bấm cờ, menu open:', d.getElementById('langMenu').classList.contains('open'));
  // chọn EN
  d.querySelector('.langopt[data-lang=en]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  console.log('sau chọn EN -> flag:', d.getElementById('langFlag').textContent, '| submit:', d.getElementById('rsvpSubmit').textContent, '| url:', w.location.search);
}
run('https://x/','VI mặc định');
run('https://x/?lang=en','EN mặc định');
