/* ============ 视图：工作台 / 文件 / 待审 / 产物 / MCP ============ */

/* ---------------- 工作台 ---------------- */
function viewDash(){
  const p = projById(S.proj);
  const fileCount = Object.values(S.files).reduce((a,b)=>a+b.filter(f=>!f.folder).length,0);
  const kpi = (ic,cls,num,label,view)=>`
    <div class="kpi" data-goto="${view}">
      <div class="kpi-ic ${cls}">${icon(ic,20)}</div>
      <div><b>${num}</b><span>${label}</span></div>
    </div>`;
  const quick = (leafId,cls,ic,t,d)=>`
    <div class="q-item" data-ql="${leafId}">
      <div class="q-ic ${cls}">${icon(ic,18)}</div>
      <div style="min-width:0"><b>${t}</b><p>${d}</p></div>
      <span class="arr">${icon('arrowR',15)}</span>
    </div>`;
  return `<div class="wrap">
    <div class="banner">
      <div>
        <h2>早上好，${esc(USER.name)} · ${esc(USER.dept)}</h2>
        <div class="bm">2026 年 9 月 23 日 周三 · 当前项目：<b>${esc(p.name)}</b>（${esc(p.deal)}）· 工作目录已按你的角色就绪</div>
      </div>
      <div class="b-act">
        <button class="btn btn-w" id="goFiles">${icon('folder',14)} 项目文件</button>
        <button class="btn btn-w2" id="goReview">${icon('shieldC',14)} 处理待审（${S.reviews.length}）</button>
      </div>
    </div>

    <div class="kpis">
      ${kpi('folder','kpi-i1',PROJECTS.length,'进行中项目','files')}
      ${kpi('shieldC','kpi-i2',S.reviews.length,'待审文件（须持牌人确认）','review')}
      ${kpi('zap','kpi-i3',S.quota.used.toLocaleString(),'本月 MCP 调用 / '+S.quota.total.toLocaleString(),'mcp')}
      ${kpi('grid','kpi-i4',S.artifacts.length,'累计 AI 产物','artifacts')}
    </div>

    <div class="grid2 mt14">
      <div class="card">
        <div class="card-h"><b>常用功能 · 点击即进入向导</b><span class="rt">${icon('lock',12)} MCP 由平台自动挂载</span></div>
        <div class="card-b">
          <div class="quick-grid">
            ${quick('prospectus','qi-1','doc','招股说明书撰写','材料导入 → 行业分类 → 拉可比 → 初稿 → 质检')}
            ${quick('prospectus-qc','qi-2','check','招股书审校质检','差异比对 · 标点文法 · 分级问题清单')}
            ${quick('fin','qi-3','chart','公司财务分析','五大维度 · 杜邦 · 同业对比 · 自动成文')}
            ${quick('val','qi-4','pie','估值模型 DCF','WACC 测算 · 敏感性 · 蒙特卡洛')}
            ${quick('daily','qi-5','cal','资本市场日报','模板寻源 · 自动回填 · 定时刷新')}
            ${quick('dx-comps','qi-6','refresh','comps 自动更新','可比估值表周 / 月更 · 定时任务')}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-h"><b>定时任务</b><span class="rt"><button class="mini-btn" data-goto="mcp">数据源状态</button></span></div>
          <div class="card-b tight" id="taskList">${TASKS.map(t=>taskRow(t)).join('')}</div>
        </div>
        <div class="card">
          <div class="card-h"><b>最近动态</b></div>
          <div class="card-b tight">
            ${ACTIVITY.map(a=>`<div class="act-line"><span class="act-t">${a.t}</span><span>${a.txt}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
function taskRow(t){
  return `<div class="task-row">
    <div style="min-width:0;flex:1"><div class="tn">${esc(t.name)} <span class="tag t-daily" style="margin-left:4px">${t.proj==='p2'?'临港城投':'启衡 IPO'}</span></div>
    <div class="tc">${esc(t.cron)} · 下次：${t.next}</div></div>
    <button class="switch${t.on?' on':''}" data-task="${t.id}"><i></i></button>
  </div>`;
}
function mountDash(){
  qs('#goFiles').addEventListener('click',()=>{ S.dir=''; setView('files'); });
  qs('#goReview').addEventListener('click',()=>setView('review'));
  qsa('[data-goto]').forEach(el=>el.addEventListener('click',()=>setView(el.dataset.goto)));
  qsa('[data-ql]').forEach(el=>el.addEventListener('click',()=>{
    let found=null,path=[];
    walkTree(TREE,[],(n,p,isLeaf)=>{ if(isLeaf&&n.id===el.dataset.ql){found=n;path=p;} });
    if(found) openWizard(found,path.join(' / ')); else toast('场景开发中','warn');
  }));
  qsa('[data-task]').forEach(sw=>sw.addEventListener('click',()=>{
    const t = TASKS.find(x=>x.id===sw.dataset.task);
    t.on=!t.on;
    qs('#taskList').innerHTML = TASKS.map(x=>taskRow(x)).join('');
    bindTasks();
    toast(`定时任务「${t.name}」已${t.on?'开启':'暂停'} · ${t.cron}`,'ok');
  }));
}
function bindTasks(){
  qsa('[data-task]').forEach(sw=>sw.addEventListener('click',()=>{
    const t = TASKS.find(x=>x.id===sw.dataset.task);
    t.on=!t.on;
    qs('#taskList').innerHTML = TASKS.map(x=>taskRow(x)).join('');
    bindTasks();
    toast(`定时任务「${t.name}」已${t.on?'开启':'暂停'} · ${t.cron}`,'ok');
  }));
}

/* ---------------- 项目文件 ---------------- */
function viewFiles(main){
  const p = projById(S.proj);
  const all = S.files[S.proj];
  let rows = all.filter(f=>f.dir===S.dir);
  const q = (S._fq||'').toLowerCase();
  if(q) rows = all.filter(f=>!f.folder && ((f.name+' '+(f.content||'')).toLowerCase().includes(q)));
  rows = sortBy(rows, S.sort.key, S.sort.asc);
  const foldersFirst = rows.slice().sort((a,b)=>(b.folder?1:0)-(a.folder?1:0));

  main.innerHTML = `<div class="wrap">
    <div class="crumb">
      <a data-crumb="">项目空间</a><span class="sep">/</span><b data-crumb-root title="拖拽文件到此处可移回根目录">${esc(p.name)}</b>
      ${S.dir?`<span class="sep">/</span><b>${esc(S.dir)}</b>`:''}
      <span class="tag t-on" style="margin-left:6px">${icon('shieldC',11)} Session 隔离中</span>
      ${q?`<span class="tag t-blue">搜索：“${esc(S._fq)}”</span>`:''}
    </div>

    <div class="fbar">
      <button class="btn btn-pri" id="fUpload">${icon('upload',14)} 上传</button>
      <input type="file" id="fFile" multiple style="display:none">
      <div style="position:relative">
        <button class="btn btn-ghost" id="fNew">${icon('plus',14)} 新建</button>
      </div>
      <button class="btn btn-ghost" id="fSort">${icon('filter',14)} 排序</button>
      <span class="grow"></span>
      ${S.trash.length?`<button class="btn btn-ghost" id="fTrash" style="color:var(--sub)">${icon('trash',13)} 回收站 ${S.trash.length}</button>`:''}
      <input class="inp" id="fSearch" placeholder="项目内全文搜索（TextIn 索引）…" value="${esc(S._fq||'')}">
    </div>

    <div class="fdrop" id="fDrop">
      ${icon('upload',22)} &nbsp;拖拽文件到此处，或 <b>点击选择</b> / 粘贴上传 —— 支持 pdf · word · excel · ppt · jpg · html 全类型批量上传，解析后即可全文搜索
    </div>

    <div class="card mt14">
      <div class="card-b" style="padding:6px 14px 10px">
        ${rows.length?`<table class="tbl zebra">
        <thead><tr>
          <th style="width:46%">文件名</th><th>状态</th><th>大小</th><th>修改时间</th><th>版本 / 来源</th><th style="width:120px"></th>
        </tr></thead>
        <tbody id="fileRows">
          ${foldersFirst.map(f=>fileRow(f)).join('')}
        </tbody></table>`
        :`<div class="empty">${q?'没有匹配的文件':'此文件夹为空，拖拽文件上传或从场景生成产物'}</div>`}
      </div>
    </div>
  </div>`;

  mountFiles();
}
function fileRow(f){
  if(f.folder){
    const n = (S.files[S.proj].filter(x=>x.dir===f.name&&!x.folder)).length;
    return `<tr data-folder="${esc(f.name)}" title="可拖拽文件到该文件夹">
      <td><div class="fname" data-open-dir="${esc(f.name)}">${fic('',true)}<div><span class="nm">${esc(f.name)}</span><span class="sub2">${n} 个文件 · ${esc(f.time)}</span></div></div></td>
      <td><span class="tag t-gray">文件夹</span></td><td class="muted">—</td><td class="muted">${esc(f.time)}</td>
      <td class="muted">${icon('shieldC',12)} 项目内</td>
      <td><div class="rowact">
        <button class="mini-ic" data-fmenu="${esc(f.name)}" data-ftype="folder">${icon('more',14)}</button>
      </div></td></tr>`;
  }
  const ext = EXT(f.name);
  return `<tr draggable="true" data-file="${esc(f.name)}">
    <td><div class="fname" data-prev="${esc(f.name)}">${fic(f.name)}<div style="min-width:0"><span class="nm">${esc(f.name)}</span><span class="sub2">${esc(f.from||'')}</span></div></div></td>
    <td>${stHtml(f.status)}</td>
    <td class="muted num">${esc(f.size||'—')}</td>
    <td class="muted">${esc(f.time)}</td>
    <td class="muted"><b style="color:var(--accent-soft-ink)">${esc(f.ver||'v1')}</b></td>
    <td><div class="rowact">
      <button class="mini-ic" title="在线编辑" data-edit="${esc(f.name)}">${icon('edit',13)}</button>
      <button class="mini-ic" title="共享" data-share="${esc(f.name)}">${icon('share',13)}</button>
      <button class="mini-ic" title="更多" data-fmenu="${esc(f.name)}" data-ftype="file">${icon('more',14)}</button>
    </div></td></tr>`;
}

function mountFiles(){
  const main = qs('#main');
  const drop = qs('#fDrop'), fileInp = qs('#fFile');
  drop.addEventListener('click',()=>fileInp.click());
  qs('#fUpload').addEventListener('click',()=>fileInp.click());
  fileInp.addEventListener('change',e=>{ addUploadedFiles(Array.from(e.target.files).map(f=>f.name)); fileInp.value=''; });
  // 拖拽上传（仅系统文件）；行内拖拽走文件移动逻辑
  ['dragover','dragenter'].forEach(ev=>main.addEventListener(ev,e=>{
    e.preventDefault();
    if(S._drag || !(e.dataTransfer && [...(e.dataTransfer.types||[])].includes('Files'))) return;
    showDragMask();
  }));
  ['dragleave','drop'].forEach(ev=>main.addEventListener(ev,e=>{ if(ev==='drop'||e.target===main) hideDragMask(); }));
  main.addEventListener('drop',e=>{
    e.preventDefault(); hideDragMask();
    if(S._drag) return; // 行内拖拽由文件夹行处理
    const fs = Array.from(e.dataTransfer.files||[]);
    if(fs.length) addUploadedFiles(fs.map(f=>f.name), fs.map(f=>f.size));
  });
  // 行内拖拽：开始/结束（委托到表体，行刷新后仍有效）
  const tb = qs('#fileRows');
  if(tb){
    tb.addEventListener('dragstart',e=>{
      const tr=e.target.closest('tr[data-file]'); if(!tr) return;
      S._drag=tr.dataset.file;
      tr.classList.add('dragging');
      try{ e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain','cc-file:'+tr.dataset.file); }catch(_){}
    });
    tb.addEventListener('dragend',()=>{
      qsa('.dragging').forEach(x=>x.classList.remove('dragging'));
      qsa('.drop-hint').forEach(x=>x.classList.remove('drop-hint'));
      S._drag=null;
    });
  }
  bindFolderDrop();
  qs('#fNew').addEventListener('click',e=>{ const r=e.currentTarget.getBoundingClientRect(); ctxMenu(r.left,r.bottom+6,[
    {k:'dir',label:'新建文件夹',icon:'folder',onClick:newFolderModal},
    '-',
    {k:'doc',label:'在线文档（腾讯文档）',icon:'doc',onClick:()=>newOnlineDoc('docx')},
    {k:'xls',label:'在线表格（金山文档）',icon:'xls',onClick:()=>newOnlineDoc('xlsx')},
    {k:'ppt',label:'在线幻灯片（腾讯文档）',icon:'grid',onClick:()=>newOnlineDoc('pptx')},
  ]);});
  qs('#fSort').addEventListener('click',e=>{ const r=e.currentTarget.getBoundingClientRect(); ctxMenu(r.left,r.bottom+6,[
    {head:'排序方式'},
    {k:'time',label:'修改时间',icon:S.sort.key==='time'?'check':'clock',onClick:()=>{S.sort.key='time';renderMainOnly();}},
    {k:'name',label:'文件名',icon:S.sort.key==='name'?'check':'file',onClick:()=>{S.sort.key='name';renderMainOnly();}},
    {k:'size',label:'大小',icon:S.sort.key==='size'?'check':'db',onClick:()=>{S.sort.key='size';renderMainOnly();}},
    '-',
    {k:'asc',label:S.sort.asc?'当前：降序 ↑':'当前：升序 ↓',icon:'filter',onClick:()=>{S.sort.asc=!S.sort.asc;renderMainOnly();}},
  ]);});
  const fs2 = qs('#fTrash'); if(fs2) fs2.addEventListener('click',trashModal);
  const si = qs('#fSearch');
  si.addEventListener('input',()=>{ S._fq=si.value.trim(); refreshFileRows(); });
  si.addEventListener('keydown',e=>{ if(e.key==='Enter') renderMainOnly(); });

  qsa('[data-open-dir]').forEach(el=>el.addEventListener('click',()=>{ S.dir=el.dataset.openDir; S._fq=''; renderMainOnly(); }));
  qsa('[data-prev]').forEach(el=>el.addEventListener('click',()=>previewModal(findFile(el.dataset.prev))));
  qsa('[data-edit]').forEach(el=>el.addEventListener('click',()=>editModal(findFile(el.dataset.edit))));
  qsa('[data-share]').forEach(el=>el.addEventListener('click',()=>shareModal(findFile(el.dataset.share))));
  qsa('[data-fmenu]').forEach(el=>el.addEventListener('click',e=>{
    e.stopPropagation();
    const name=el.dataset.fmenu, isF=el.dataset.ftype==='folder';
    const r=el.getBoundingClientRect();
    fileMenu(r.right-180, r.bottom+4, name, isF);
  }));
}
function renderMainOnly(){ viewFiles(qs('#main')); }
function refreshFileRows(){
  const p=projById(S.proj), all=S.files[S.proj];
  let rows=all.filter(f=>f.dir===S.dir);
  const q=(S._fq||'').toLowerCase();
  if(q) rows=all.filter(f=>!f.folder&&((f.name+' '+(f.content||'')).toLowerCase().includes(q)));
  rows=sortBy(rows,S.sort.key,S.sort.asc).sort((a,b)=>(b.folder?1:0)-(a.folder?1:0));
  const tb=qs('#fileRows');
  if(!tb) return renderMainOnly();
  tb.innerHTML = rows.length? rows.map(f=>fileRow(f)).join('') : `<tr><td colspan="6"><div class="empty">没有匹配的文件</div></td></tr>`;
  bindRowEvents();
}
function bindRowEvents(){
  qsa('[data-open-dir]').forEach(el=>el.addEventListener('click',()=>{ S.dir=el.dataset.openDir; S._fq=''; renderMainOnly(); }));
  qsa('[data-prev]').forEach(el=>el.addEventListener('click',()=>previewModal(findFile(el.dataset.prev))));
  qsa('[data-edit]').forEach(el=>el.addEventListener('click',()=>editModal(findFile(el.dataset.edit))));
  qsa('[data-share]').forEach(el=>el.addEventListener('click',()=>shareModal(findFile(el.dataset.share))));
  qsa('[data-fmenu]').forEach(el=>el.addEventListener('click',e=>{
    e.stopPropagation();
    const r=el.getBoundingClientRect();
    fileMenu(r.right-180, r.bottom+4, el.dataset.fmenu, el.dataset.ftype==='folder');
  }));
  bindFolderDrop();
}
/* 文件夹行 / 面包屑根目录 作为拖拽目标 */
function bindFolderDrop(){
  const targets = [...qsa('tr[data-folder]')];
  targets.forEach(t=>{
    if(t._dndBound) return; t._dndBound=true;
    t.addEventListener('dragover',e=>{
      if(!S._drag) return;
      e.preventDefault(); e.stopPropagation();
      t.classList.add('drop-hint');
    });
    t.addEventListener('dragleave',()=>t.classList.remove('drop-hint'));
    t.addEventListener('drop',e=>{
      if(!S._drag) return;
      e.preventDefault(); e.stopPropagation();
      t.classList.remove('drop-hint');
      const name=S._drag; S._drag=null;
      moveFileTo(name, t.dataset.folder);
    });
  });
  // 文件夹内部视图：拖到面包屑项目名 = 移回根目录
  const root = qs('[data-crumb-root]');
  if(root && S.dir && !root._dndBound){
    root._dndBound=true;
    root.addEventListener('dragover',e=>{ if(!S._drag) return; e.preventDefault(); root.classList.add('drop-hint'); });
    root.addEventListener('dragleave',()=>root.classList.remove('drop-hint'));
    root.addEventListener('drop',e=>{
      if(!S._drag) return;
      e.preventDefault(); root.classList.remove('drop-hint');
      const name=S._drag; S._drag=null; moveFileTo(name,'');
    });
  }
}
function moveFileTo(name, dir){
  const f=findFile(name);
  if(!f){ toast('未找到该文件','err'); return; }
  if(f.dir===dir){ toast(`已在「${dir||'根目录'}」中`,'warn'); return; }
  f.dir=dir; f.time=today(); f.from=(f.from||'').replace(/^移动 · /,'');
  renderMainOnly(); renderSidebar();
  toast(`《${esc(name)}》已移动到「${dir||'根目录'}」`,'ok');
}
function findFile(name){ return S.files[S.proj].find(f=>f.name===name&&!f.folder); }

let _dragMask=null;
function showDragMask(){
  if(_dragMask) return;
  _dragMask=document.createElement('div');
  _dragMask.className='drag-mask';
  _dragMask.innerHTML=`<div class="in">${icon('upload',22)} 释放以上传到「${esc(projById(S.proj).name)} / ${esc(S.dir||'根目录')}」</div>`;
  document.body.appendChild(_dragMask);
}
function hideDragMask(){ if(_dragMask){ _dragMask.remove(); _dragMask=null; } }

function addUploadedFiles(names, sizes){
  const list = S.files[S.proj];
  let added=0;
  names.forEach((n,i)=>{
    if(list.some(f=>f.name===n&&!f.folder)) return;
    const ext=EXT(n);
    list.push({ dir:S.dir, name:n, size:sizes&&sizes[i]?fmtSize(sizes[i]):(200+Math.floor(Math.random()*4000)+' KB'),
      time:today(), status:(['pdf','docx','doc','xlsx','pptx'].includes(ext)?'parse':'ok'), ver:'v1',
      from:'上传'+(['pdf','docx','doc','xlsx','pptx'].includes(ext)?' · TextIn 解析中':''), _new:true });
    added++;
  });
  if(!added){ toast('同名文件已存在','warn'); return; }
  toast(`已上传 ${added} 个文件到「${esc(S.dir||'根目录')}」`,'ok');
  useQuota(added*2);
  renderMainOnly(); renderSidebar();
  setTimeout(()=>{ list.filter(f=>f._new).forEach(f=>{ f._new=false; f.status=ST[f.status]?f.status:'ok'; if(f.status==='parse') f.from='上传 · 已解析（可全文搜索）'; }); renderMainOnly(); }, 1600);
}

function newOnlineDoc(ext){
  const names={docx:'未命名文档',xlsx:'未命名表格',pptx:'未命名幻灯片'};
  const name=`${names[ext]}.${ext}`;
  S.files[S.proj].push({dir:S.dir,name,size:'12 KB',time:today(),status:'draft',ver:'v1',from:'新建 · 在线编辑'});
  toast(`已新建《${name}》，双击可在线编辑`,'ok');
  renderMainOnly();
  const f=findFile(name); if(f) editModal(f,true);
}

/* 新建文件夹（当前项目 · 当前所在层级） */
function newFolderModal(){
  const p=projById(S.proj);
  const where=esc(p.name)+(S.dir?' / '+esc(S.dir):'');
  openModal({
    title:`新建文件夹 · ${where}`,
    body:`
      <label class="inp-lab">文件夹名称</label>
      <input class="inp" id="nfName" style="width:100%" placeholder="如：问询回复 / 三方底稿" value="新建文件夹">
      <p class="muted small mt14">${icon('shieldC',13)} 文件夹归属当前项目 Session；产物归档与拖拽移动均以文件夹为目标，支持嵌套。</p>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-pri" id="nfOk">${icon('folder',13)} 创建文件夹</button>`,
    onMount:(b,id)=>{
      const inp=qs('#nfName'); inp.focus(); inp.select();
      const ok=()=>{
        const name=inp.value.trim();
        if(!name){ toast('请输入文件夹名称','warn'); return; }
        if(/[\\/:*?"<>|]/.test(name)){ toast('名称不能包含 \\ / : * ? " < > |','err'); return; }
        if(S.files[S.proj].some(f=>f.dir===S.dir&&f.name===name)){ toast('同名文件夹已存在','err'); inp.focus(); return; }
        S.files[S.proj].push({dir:S.dir,name,folder:true,n:0,time:today()});
        closeModal(id);
        if(S.view==='files') renderMainOnly();
        renderSidebar();
        toast(`已在「${where}」创建文件夹「${esc(name)}」`,'ok');
      };
      qs('#nfOk').addEventListener('click',ok);
      inp.addEventListener('keydown',e=>{ if(e.key==='Enter') ok(); });
    }
  });
}

function fileMenu(x,y,name,isFolder){
  const items = isFolder? [
    {k:'open',label:'打开',icon:'folder',onClick:()=>{S.dir=name;S._fq='';renderMainOnly();}},
    {k:'share',label:'共享给项目组',icon:'share',onClick:()=>shareModal({name:name+'/',folder:true})},
  ] : [
    {k:'prev',label:'预览',icon:'eye',onClick:()=>previewModal(findFile(name))},
    {k:'edit',label:'在线编辑',icon:'edit',onClick:()=>editModal(findFile(name))},
    {k:'ren',label:'重命名',icon:'edit',onClick:()=>inlineRename(name)},
    '-',
    {k:'move',label:'移动 / 复制到…',icon:'folder',onClick:()=>moveModal(name)},
    {k:'share',label:'共享…',icon:'share',onClick:()=>shareModal(findFile(name))},
    {k:'ver',label:'查看历史版本',icon:'history',onClick:()=>versionModal(findFile(name))},
    {k:'dl',label:'下载',icon:'download',onClick:()=>toast(`《${esc(name)}》开始下载`,'ok')},
    '-',
    {k:'del',label:'删除（移入回收站）',icon:'trash',red:true,onClick:()=>deleteFile(name)},
  ];
  ctxMenu(x,y,items);
}

function inlineRename(name){
  const tr = qs(`tr[data-file="${CSS.escape(name)}"]`); if(!tr) return;
  const td = tr.querySelector('td');
  const old = name;
  td.innerHTML = `<input class="ren-inp" value="${esc(old)}">`;
  const inp = td.querySelector('input');
  inp.focus(); inp.select();
  const commit = ()=>{
    const nv = inp.value.trim();
    if(!nv){ td.innerHTML=''; renderMainOnly(); return; }
    if(/[\\/:*?"<>|]/.test(nv)){ toast('文件名不能包含 \\ / : * ? " < > |','err'); inp.focus(); return; }
    const f = findFile(old);
    if(f){ if(findFile(nv)&&nv!==old){ toast('同名文件已存在','err'); inp.focus(); return; } f.name=nv; }
    renderMainOnly(); toast(`已重命名为《${esc(nv)}》`,'ok');
  };
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape') renderMainOnly(); });
  inp.addEventListener('blur',commit);
}
function deleteFile(name){
  const i = S.files[S.proj].findIndex(f=>f.name===name&&!f.folder);
  if(i<0) return;
  const f = S.files[S.proj][i];
  openModal({
    title:'删除文件', body:`<p>《<b>${esc(name)}</b>》将移入回收站，保留 <b>30 天</b>，期间可恢复。</p>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-danger" id="delOk">${icon('trash',13)} 移入回收站</button>`,
    onMount:(b,id)=>qs('#delOk').addEventListener('click',()=>{
      S.files[S.proj].splice(i,1);
      S.trash.push({...f, proj:S.proj, delAt:today()});
      closeModal(id); renderMainOnly(); renderSidebar();
      toast('已移入回收站，30 天内可恢复','ok');
    })
  });
}
function trashModal(){
  openModal({
    title:`回收站（保留 30 天 · ${S.trash.length} 项）`,
    body: S.trash.length? S.trash.map((t,i)=>`
      <div class="sh-row">${fic(t.name)}<div style="min-width:0"><b style="font-size:13px">${esc(t.name)}</b>
      <div class="muted small">${esc(projById(t.proj).name)} · 删除于 ${esc(t.delAt)}</div></div>
      <span style="margin-left:auto;display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" data-restore="${i}">恢复</button>
        <button class="btn btn-danger btn-sm" data-purge="${i}">彻底删除</button></span></div>`).join('')
      : '<div class="empty">回收站为空</div>',
    onMount:(b,id)=>{
      qsa('[data-restore]',b).forEach(el=>el.addEventListener('click',()=>{
        const t=S.trash.splice(+el.dataset.restore,1)[0];
        S.files[t.proj].push(t);
        closeModal(id); renderMainOnly(); renderSidebar(); toast(`《${esc(t.name)}》已恢复`,'ok');
      }));
      qsa('[data-purge]',b).forEach(el=>el.addEventListener('click',()=>{
        const t=S.trash.splice(+el.dataset.purge,1)[0];
        closeModal(id); toast(`《${esc(t.name)}》已彻底删除`,'warn'); trashModal();
      }));
    }
  });
}
function moveModal(name){
  const p=projById(S.proj);
  const dirs=[...new Set(S.files[S.proj].map(f=>f.dir).filter(d=>d)),'(根目录)'];
  const others=PROJECTS.filter(x=>x.id!==S.proj);
  openModal({
    title:`移动 / 复制 ·《${esc(name)}》`,
    body:`
      <label class="inp-lab">当前项目内目标文件夹</label>
      ${dirs.map(d=>`<label class="opt" style="margin-bottom:8px"><input type="radio" name="mv" value="${esc(d==='(根目录)'?'':d)}" ${d==='(根目录)'?'checked':''}><div><b>${esc(d)}</b><p>本项目</p></div></label>`).join('')}
      <label class="inp-lab mt14">跨项目（需二次确认，防止 Session 串味）</label>
      ${others.map(o=>`<label class="opt" style="margin-bottom:8px"><input type="radio" name="mv" value="proj:${o.id}"><div><b>${esc(o.name)}</b><p>${esc(o.deal)} · 跨项目移动将弹出确认</p></div></label>`).join('')}
    `,
    foot:`<button class="btn btn-ghost" data-close>取消</button>
      <button class="btn btn-blue" id="mvCopy">复制</button>
      <button class="btn btn-pri" id="mvMove">移动</button>`,
    onMount:(b,id)=>{
      const get=()=>qs('input[name="mv"]:checked',b).value;
      const apply=(cut)=>{
        const v=get();
        const f=findFile(name); if(!f) return;
        if(v.startsWith('proj:')){
          openModal({ title:'跨项目移动确认',
            body:`<p>将《<b>${esc(name)}</b>》移动到「<b>${esc(projById(v.slice(5)).name)}</b>」？</p><p class="muted mt8">跨项目移动会改变其 Session 归属，历史版本随文件迁移，原项目的对话上下文不会跟随。</p>`,
            foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-pri" id="xmOk">确认移动</button>`,
            onMount:(b2,id2)=>qs('#xmOk').addEventListener('click',()=>{
              const idx=S.files[S.proj].indexOf(f);
              S.files[S.proj].splice(idx,1);
              f.dir=''; S.files[v.slice(5)].push(f);
              closeModal(id2); closeModal(id); renderMainOnly(); renderSidebar();
              toast(`已移动到「${esc(projById(v.slice(5)).name)}」`,'ok');
            })});
          return;
        }
        if(cut) f.dir=v; else S.files[S.proj].push({...f,dir:v,ver:'v1',time:today(),from:'复制'});
        closeModal(id); renderMainOnly(); renderSidebar();
        toast(cut?`已移动到「${esc(v||'根目录')}」`:`已复制到「${esc(v||'根目录')}」`,'ok');
      };
      qs('#mvMove').addEventListener('click',()=>apply(true));
      qs('#mvCopy').addEventListener('click',()=>apply(false));
    }
  });
}
function shareModal(f){
  if(!f) return;
  const p=projById(S.proj);
  const members=[{n:'陆嘉言',r:'编辑'},{n:'周敏',r:'评论'},{n:'韩叙',r:'查看'}];
  openModal({
    title:`共享 ·《${esc(f.name)}》`,
    body:`
      <p class="muted small" style="margin-bottom:10px">${icon('shieldC',13)} 项目「${esc(p.name)}」成员默认可见；共享给项目外成员需管理员审批。</p>
      ${members.map((m,i)=>`<div class="sh-row"><div class="ava" style="background:${['#1e8449','#8e5bb8','#b7950b'][i]}">${esc(m.n[0])}</div><b style="font-size:13px">${esc(m.n)}</b>
        <span class="muted small">${i===0?'ECM · 项目组':''}</span>
        <select style="margin-left:auto"><option ${m.r==='查看'?'selected':''}>查看</option><option ${m.r==='评论'?'selected':''}>评论</option><option ${m.r==='编辑'?'selected':''}>编辑</option></select></div>`).join('')}
      <label class="inp-lab mt14">邀请项目外成员（邮箱，需审批）</label>
      <div style="display:flex;gap:8px"><input class="inp" style="flex:1" placeholder="name@firm.com"><button class="btn btn-ghost" onclick="toast('已发送审批请求','warn')">邀请</button></div>
    `,
    onMount:(b,id)=>{}
  });
}
function versionModal(f){
  if(!f) return;
  const vN = parseInt((f.ver||'v1').slice(1))||1;
  const vs=[]; for(let i=vN;i>=1;i--) vs.push({v:'v'+i, t:i===vN?(f.time||'刚刚'):`历史 · ${i} 版前`, by:i%2?'AI 场景生成':'沈亦舟'});
  openModal({
    title:`历史版本 ·《${esc(f.name)}》`,
    body: vs.map(v=>`<div class="ver-row"><b class="vv">${v.v}</b>
      <div><div style="font-size:13px">${v.by}</div><div class="vt">${v.t}</div></div>
      ${v.v===('v'+vN)?`<span class="tag t-blue" style="margin-left:auto">当前版本</span>`:`<span style="margin-left:auto;display:flex;gap:6px"><button class="btn btn-ghost btn-sm" data-rb="${v.v}">对比</button><button class="btn btn-pri btn-sm" data-rb2="${v.v}">回滚</button></span>`}
    </div>`).join(''),
    onMount:(b,id)=>{
      qsa('[data-rb]',b).forEach(el=>el.addEventListener('click',()=>toast('版本对比视图：差异 12 处（新增 8 / 删除 4）')));
      qsa('[data-rb2]',b).forEach(el=>el.addEventListener('click',()=>{
        f.ver=el.dataset.rb2; closeModal(id); renderMainOnly();
        toast(`已回滚至 ${el.dataset.rb2}`,'ok');
      }));
    }
  });
}
function previewModal(f){
  if(!f) return;
  const ext=EXT(f.name);
  let body='';
  if(ext==='html'){
    body=`<div style="border:1px solid var(--line);border-radius:10px;overflow:hidden">
      <div style="background:#f6f9fc;padding:8px 14px;font-size:11.5px;color:var(--faint);border-bottom:1px solid var(--line)">资本市场日报 · 数据时点 2026-09-23 15:00 · 涨红跌绿</div>
      <div style="padding:14px 18px">
        <table class="tbl daily-tbl"><thead><tr><th>指数</th><th class="num">收盘</th><th class="num">涨跌幅</th><th class="num">成交额</th></tr></thead>
        <tbody>
        <tr><td>上证指数</td><td class="num">3,247.32</td><td class="num up">+0.58%</td><td class="num">4,215 亿</td></tr>
        <tr><td>深证成指</td><td class="num">10,481.66</td><td class="num up">+0.71%</td><td class="num">5,376 亿</td></tr>
        <tr><td>创业板指</td><td class="num">2,156.09</td><td class="num down">-0.12%</td><td class="num">2,148 亿</td></tr>
        <tr><td>科创 50</td><td class="num">986.44</td><td class="num up">+1.02%</td><td class="num">612 亿</td></tr>
        </tbody></table>
        <p class="muted small mt8">北向资金 <b class="up">+37.2 亿</b> · IPO：3 家上会 2 家过会 · 数据源：westock / Wind / 通达信</p>
      </div></div>`;
  } else if(ext==='xlsx'){
    body=`<table class="tbl"><thead><tr><th>公司</th><th class="num">PE (TTM)</th><th class="num">PB</th><th class="num">PS</th><th class="num">EV/EBITDA</th></tr></thead>
      <tbody>
      <tr><td>华海清科</td><td class="num">58.2</td><td class="num">6.8</td><td class="num">12.1</td><td class="num">31.4</td></tr>
      <tr><td>拓荆科技</td><td class="num">72.5</td><td class="num">8.2</td><td class="num">15.6</td><td class="num">38.9</td></tr>
      <tr><td>中微公司</td><td class="num">64.1</td><td class="num">7.5</td><td class="num">13.8</td><td class="num">35.2</td></tr>
      <tr><td style="font-weight:700">中位数</td><td class="num" style="font-weight:700;color:var(--navy)">64.1</td><td class="num" style="font-weight:700;color:var(--navy)">7.5</td><td class="num" style="font-weight:700;color:var(--navy)">13.8</td><td class="num" style="font-weight:700;color:var(--navy)">35.2</td></tr>
      </tbody></table>`;
  } else if(ext==='pptx'){
    body=`<div style="border:1px solid var(--line);border-radius:10px;aspect-ratio:16/9;background:linear-gradient(135deg,#123c63,#2e86c1);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:30px">
      <div style="font-size:11px;opacity:.75;letter-spacing:2px">INVESTMENT COMMITTEE MEMO</div>
      <div style="font-size:22px;font-weight:700;margin-top:8px">芯测科技 · B 轮投资建议</div>
      <div style="font-size:12.5px;opacity:.85;margin-top:10px">投后估值 18.5 亿 · 预期 IRR 27.4% · MOIC 3.2x</div></div>`;
  } else {
    body=`<div class="docprev">
      <h3>第一节 释义与重大事项提示</h3><p>本募集说明书所用简称释义与本公司招股说明书保持一致……</p>
      <div class="src-note">${icon('db',11)} 本段引用：审计报告 2022-2024（P12-P18）· 北大法宝《证券法》第八十一条</div>
      <h3>第二节 发行概况</h3><p>本次拟公开发行不超过 4,200 万股人民币普通股……</p>
      <h3>第三节 财务会计信息</h3><p>报告期各期，公司营业收入分别为 31,204.5 万元、39,876.1 万元与 48,207.3 万元……</p>
      <div class="src-note">${icon('db',11)} 数据点来源：审计报告 · 逐科目可追溯</div>
    </div>`;
  }
  openModal({ title:`预览 ·《${esc(f.name)}》`, wide:true,
    body,
    foot:`<span class="lf">${icon('db',11)} 浏览器内直接预览，无需下载 · 由 ${esc(f.from||'上传')} 产生</span>
      <button class="btn btn-ghost" data-close>关闭</button><button class="btn btn-pri" id="pvEdit">${icon('edit',13)} 在线编辑</button>`,
    onMount:(b,id)=>qs('#pvEdit').addEventListener('click',()=>{ closeModal(id); editModal(f); })
  });
}
function editModal(f, isNew){
  if(!f) return;
  const ext=EXT(f.name);
  openModal({ title:`在线编辑 ·《${esc(f.name)}》`, wide:true,
    body:`
      <div class="muted small mb14" style="display:flex;gap:12px;align-items:center">
        <span class="tag t-blue">腾讯文档引擎</span><span>多人实时协同 · @提及 · 评论批注</span>
        <span style="margin-left:auto">${icon('users',12)} 陆嘉言、周敏 在线</span>
      </div>
      <div class="docprev" contenteditable="true" id="edArea" style="min-height:260px;outline:none">
        <h3>${esc(f.name.replace(/\.[^.]+$/,''))}</h3>
        <p>在此编辑正文。AI 生成的段落可直接「插入到当前文档」，并保留来源标注。</p>
        <p style="color:var(--faint);font-size:12px">— 示例正文，演示协同编辑能力 —</p>
      </div>`,
    foot:`<span class="lf">每次编辑自动留版本</span>
      <button class="btn btn-ghost" data-close>取消</button>
      <button class="btn btn-pri" id="edSave">保存新版本</button>`,
    onMount:(b,id)=>qs('#edSave').addEventListener('click',()=>{
      const v=parseInt((f.ver||'v1').slice(1))||1;
      f.ver='v'+(v+1); f.status='ok'; f.time=today(); f.from='在线编辑';
      closeModal(id); renderMainOnly();
      toast(`已保存 ${f.ver} · 版本历史可回滚`,'ok');
    })
  });
}

/* ---------------- 项目空间总览页 ---------------- */
function viewSpace(){
  const assetTagCls = a => a==='股票'?'t-eq':a==='债券'?'t-debt':a==='股权投资'?'t-pe':'t-daily';
  const totalFiles = Object.values(S.files).reduce((a,b)=>a+b.filter(f=>!f.folder).length,0);
  const cards = PROJECTS.map(p=>{
    const n = S.files[p.id].filter(f=>!f.folder).length;
    const avas = p.members.slice(0,4).map((m,i)=>`<div class="ava" style="background:${['#3A6E9B','#3E8E63','#B08A2E','#8E74A8'][i%4]}">${esc(m)}</div>`).join('');
    const assetLines = p.asset.match(/.{1,2}/g).join('<br>');
    return `<div class="sp-card${p.id===S.proj?' on':''}" data-sp="${p.id}">
      <div class="sp-top">
        <div class="proj-ic"><span>${assetLines}</span><i class="pdot" style="background:${p.color}"></i></div>
        <div class="tt"><b>${esc(p.name)}</b><div class="dt">${esc(p.deal)}</div></div>
        <span class="tag ${assetTagCls(p.asset)}">${esc(p.asset)}</span>
      </div>
      <p class="sp-desc">${esc(p.desc)}</p>
      <div class="sp-meta">
        <span>${icon('file',12)} ${n} 个文件</span><span>·</span>
        <span>${icon('clock',12)} ${esc(p.updated)}</span><span>·</span>
        <div class="avas">${avas}</div>
        <span>${p.members.length} 名成员</span>
      </div>
      <div class="sp-go">进入项目 ${icon('arrowR',13)}</div>
    </div>`;
  }).join('');
  return `<div class="wrap">
    <div class="sp-head">
      <div>
        <h2>项目空间</h2>
        <div class="sub">一级文件夹 = 项目 = 独立 Session · 材料、对话、产物与 MCP 调用历史跨项目不串味</div>
      </div>
      <div class="acts">
        <div class="sp-stats">
          <span class="chip">${icon('folder',11)} ${PROJECTS.length} 个项目</span>
          <span class="chip">${icon('file',11)} ${totalFiles} 个文件</span>
          <span class="chip">${icon('shieldC',11)} Session 全部隔离</span>
        </div>
        <button class="btn btn-pri" id="spNew">${icon('plus',14)} 新建项目</button>
      </div>
    </div>
    <div class="sp-grid">
      ${cards}
      <div class="sp-card sp-new" id="spNewTile">
        <div style="text-align:center">${icon('plus',22)}<b>新建项目</b><p>自动开启独立 Session，可邀请项目组成员共享</p></div>
      </div>
    </div>
  </div>`;
}
function mountSpace(){
  qsa('[data-sp]').forEach(el=>el.addEventListener('click',()=>{
    const pid = el.dataset.sp;
    if(S.proj!==pid){ S.proj=pid; S.dir=''; addChatMsg('ai', `已切换到「${projById(S.proj).name}」Session（#${uid().toUpperCase().slice(0,4)}），上下文已隔离。`); }
    S.view='files'; render();
  }));
  qs('#spNew').addEventListener('click', newProjectModal);
  qs('#spNewTile').addEventListener('click', newProjectModal);
}
