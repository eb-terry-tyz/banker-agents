/* ============ 核心工具 ============ */

const S = {
  view:'dash',            // dash | files | review | artifacts | mcp | wizard
  proj:'p1',              // 当前项目
  dir:'',                 // 当前子文件夹
  leaf:null,              // 当前目录叶节点
  wiz:null,               // 向导运行态
  chatOpen:true,
  openNodes:new Set(['stock','ipo','ipo-ib']),
  reviews:JSON.parse(JSON.stringify(REVIEWS)),
  artifacts:JSON.parse(JSON.stringify(ARTIFACTS)),
  files:JSON.parse(JSON.stringify(FILES)),
  trash:[],
  quota:{...QUOTA},
  sort:{key:'time',asc:false},
};

/* ---------- 基础 ---------- */
const qs  = (s,el)=> (el||document).querySelector(s);
const qsa = (s,el)=> Array.from((el||document).querySelectorAll(s));
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = ()=> Math.random().toString(36).slice(2,8);
const nowT = ()=>{ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${p(d.getHours())}:${p(d.getMinutes())}`; };
const today = ()=> '今天 ' + nowT();

/* ---------- 图标 ---------- */
const ICONS = {
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chevR:'<path d="M9 6l6 6-6 6"/>',
  chevD:'<path d="M6 9l6 6 6-6"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  upload:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
  download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
  edit:'<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  history:'<path d="M3 3v5h5M3.05 13A9 9 0 106 5.3L3 8"/><path d="M12 7v5l4 2"/>',
  more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  folder:'<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',
  file:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  shieldC:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 11.5l2 2 4-4"/>',
  db:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.7-4 3-9 3s-9-1.3-9-3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>',
  send:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
  spark:'<path d="M12 3l1.9 5.7L19.5 11l-5.6 2.3L12 19l-1.9-5.7L4.5 11l5.6-2.3L12 3z"/>',
  bell:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  warn:'<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h16.9a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  arrowR:'<path d="M5 12h14M12 5l7 7-7 7"/>',
  filter:'<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>',
  users:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  chat:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
  doc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
  xls:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 15l4-6 3 3 5-7"/>',
  pie:'<path d="M21.2 15.9A10 10 0 118.1 2.8"/><path d="M22 12A10 10 0 0012 2v10z"/>',
  build:'<rect x="4" y="2" width="16" height="20" rx="1.5"/><path d="M9 22v-4h6v4M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2"/>',
  refresh:'<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  ext:'<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6M10 14L21 3"/>',
  zap:'<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  flask:'<path d="M9 3h6M10 3v6l-5.5 9A2 2 0 006 21h12a2 2 0 001.5-3L14 9V3"/><path d="M7.5 15h9"/>',
};
function icon(name, size, cls){
  size = size||16;
  return `<svg class="${cls||''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||ICONS.file}</svg>`;
}

/* ---------- 文件工具 ---------- */
const EXT = n => (n.split('.').pop()||'').toLowerCase();
function fic(name, folderFlag, sz){
  const ext = folderFlag ? 'folder' : EXT(name);
  const label = folderFlag ? icon('folder',16) : ext.slice(0,4);
  return `<div class="fic ${ext}" title="${esc(name)}">${label}</div>`;
}
const ST = { ok:['ok','已归档'], wait:['wait','待审'], draft:['draft','草稿'], parse:['parse','已解析'] };
const stHtml = k => { const v = ST[k]||ST.draft; return `<span class="st ${v[0]}"><span class="dot"></span>${v[1]}</span>`; };
function fmtSize(b){ if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(0)+' KB'; return (b/1048576).toFixed(1)+' MB'; }
function sortBy(arr,key,asc){
  return arr.slice().sort((a,b)=>{
    let va=a[key], vb=b[key];
    if(key==='name'){ return asc? va.localeCompare(vb,'zh') : vb.localeCompare(va,'zh'); }
    if(key==='size'){ va=a.folder?1e9:parseSize(va); vb=b.folder?1e9:parseSize(vb); }
    if(key==='time'){ va=timeKey(va); vb=timeKey(vb); }
    if(va===vb) return 0;
    if(asc) return va>vb?1:-1;
    return va<vb?1:-1;
  });
}
function parseSize(s){ if(!s) return 0; const m=String(s).match(/([\d.]+)\s*(KB|MB|B)/i); if(!m) return 0; const n=parseFloat(m[1]); return /mb/i.test(m[2])? n*1048576 : n*1024; }
function timeKey(t){
  t = t||''; const d = new Date();
  if(t.startsWith('今天')) return d.getTime()+999;
  if(t.startsWith('昨天')) return d.getTime()-864e5+999;
  const m = t.match(/^(\d{2})-(\d{2})/);
  if(m) return new Date(d.getFullYear(), +m[1]-1, +m[2]).getTime();
  if(/^\d{2}:\d{2}$/.test(t)) return d.getTime();
  return 0;
}

/* ---------- Toast ---------- */
function toast(msg, type){
  const root = qs('#toastRoot');
  const el = document.createElement('div');
  el.className = 'toast ' + (type||'');
  const ic = type==='ok'?'check':type==='err'?'x':type==='warn'?'warn':'spark';
  const col = type==='ok'?'var(--green)':type==='err'?'var(--red)':type==='warn'?'var(--gold)':'var(--blue)';
  el.innerHTML = `<span style="color:${col};display:flex">${icon(ic,15)}</span><span>${msg}</span>`;
  root.appendChild(el);
  setTimeout(()=>{ el.style.transition='.3s'; el.style.opacity='0'; el.style.transform='translateX(24px)'; setTimeout(()=>el.remove(),320); }, 3400);
}

/* ---------- 弹窗 ---------- */
let _modalCount = 0;
function openModal(opt){
  const root = qs('#modalRoot');
  const id = 'm'+(++_modalCount);
  const w = opt.wide?' wide':'';
  const html = `
  <div class="mask" id="${id}">
    <div class="modal${w}">
      <div class="modal-h"><b>${opt.title||''}</b><button class="icon-btn x" data-close="${id}" style="width:30px;height:30px">${icon('x',14)}</button></div>
      <div class="modal-b" id="${id}-b">${opt.body||''}</div>
      ${opt.foot===null?'':`<div class="modal-f">${opt.foot||`<button class="btn btn-ghost" data-close="${id}">关闭</button>`}</div>`}
    </div>
  </div>`;
  root.insertAdjacentHTML('beforeend', html);
  const mask = qs('#'+id);
  mask.addEventListener('mousedown', e=>{ if(e.target===mask && opt.maskClose!==false) closeModal(id); });
  qsa('[data-close]',mask).forEach(b=>b.addEventListener('click',()=>closeModal(id)));
  if(opt.onMount) opt.onMount(qs('#'+id+'-b'), id, mask);
  return id;
}
function closeModal(id){ const m = typeof id==='string'? qs('#'+id) : id; if(m) m.remove(); }
function closeAllModals(){ qs('#modalRoot').innerHTML=''; }

/* ---------- 右键 / 下拉菜单 ---------- */
function ctxMenu(x, y, items){
  const root = qs('#menuRoot');
  root.innerHTML = '';
  const m = document.createElement('div');
  m.className = 'menu';
  m.innerHTML = items.map(it=>{
    if(it==='-') return '<div class="msep"></div>';
    if(it.head) return `<div class="mhead">${esc(it.head)}</div>`;
    return `<div class="mi ${it.red?'red':''}" data-k="${it.k||''}">${it.icon?icon(it.icon,14):''}<span>${esc(it.label)}</span></div>`;
  }).join('');
  root.appendChild(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
  m.style.top  = Math.min(y, innerHeight - r.height - 8) + 'px';
  const close = ()=>{ root.innerHTML=''; document.removeEventListener('mousedown', onDoc, true); };
  const onDoc = e=>{ if(!m.contains(e.target)) close(); };
  setTimeout(()=>document.addEventListener('mousedown', onDoc, true), 0);
  qsa('.mi', m).forEach(mi=>{
    mi.addEventListener('click', ()=>{
      const it = items.find(t=>t!=='-' && t.k===mi.dataset.k);
      close(); if(it && it.onClick) it.onClick();
    });
  });
  return close;
}
function closeMenu(){ qs('#menuRoot').innerHTML=''; }

/* ---------- 配额 ---------- */
function useQuota(n){
  S.quota.used += n;
  renderQuota();
}
function renderQuota(){
  const q = S.quota, pct = Math.min(100, q.used/q.total*100);
  qs('#tbQuota').innerHTML =
    `<div class="qt"><span title="本月 MCP 调用量">本月调用</span><b>${q.used.toLocaleString()} / ${q.total.toLocaleString()}</b></div>
     <div class="qbar"><i style="width:${pct}%"></i></div>`;
}
