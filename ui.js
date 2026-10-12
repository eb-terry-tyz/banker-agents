/* ============ 顶栏 / 侧栏 / 会话 / 路由 ============ */

function projById(id){ return PROJECTS.find(p=>p.id===id); }

/* ---------- 顶栏导航 ---------- */
const NAVS = [
  { k:'dash',      label:'工作台' },
  { k:'files',     label:'项目文件' },
  { k:'review',    label:'待审队列', badge:true },
  { k:'artifacts', label:'产物中心' },
  { k:'mcp',       label:'MCP 资源池' },
];
function renderTopbar(){
  const nav = qs('#tbNav');
  nav.innerHTML = NAVS.map(n=>{
    const b = n.badge && S.reviews.length ? `<span class="bdg">${S.reviews.length}</span>` : '';
    const on = (S.view===n.k || (n.k==='files'&&S.view==='wizard')) ? ' on':'';
    return `<button class="${on}" data-nav="${n.k}">${n.label}${b}</button>`;
  }).join('');
  qsa('[data-nav]',nav).forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.nav;
    if(k==='files') S.dir='';
    S.view=k; render();
  }));
  renderQuota();
}

/* ---------- 侧栏：项目空间 + 目录树 ---------- */
const PROJ_MAX_SHOW = 8;
function renderSidebar(){
  const sb = qs('#sb');
  if(S.projCollapsed===undefined) S.projCollapsed=false;
  if(S.projShowAll===undefined)   S.projShowAll=false;
  const shown = S.projCollapsed ? []
    : (S.projShowAll || PROJECTS.length<=PROJ_MAX_SHOW ? PROJECTS : PROJECTS.slice(0,PROJ_MAX_SHOW));
  const projHtml = shown.map(p=>{
    const on = p.id===S.proj ? ' on':'';
    const avas = p.members.slice(0,3).map((m,i)=>`<div class="ava" style="background:${['#3A6E9B','#3E8E63','#B08A2E','#8E74A8'][i%4]}">${esc(m)}</div>`).join('');
    const n = S.files[p.id].filter(f=>!f.folder).length;
    const assetLines = p.asset.match(/.{1,2}/g).join('<br>');
    return `<div class="proj${on}" data-proj="${p.id}">
      <div class="proj-ic"><span>${assetLines}</span><i class="pdot" style="background:${p.color}"></i></div>
      <div class="proj-body">
        <div class="proj-top"><span class="proj-n">${esc(p.name)}</span></div>
        <div class="proj-d">${esc(p.deal)} · ${esc(p.desc)}</div>
        <div class="proj-meta">
          <span class="m">${n} 个文件</span><span class="m">·</span><span class="m">${esc(p.updated)}</span>
          <div class="avas">${avas}</div>
        </div>
      </div>
    </div>`;
  }).join('');
  const moreBtn = (!S.projCollapsed && PROJECTS.length>PROJ_MAX_SHOW)
    ? `<div class="proj-more" id="projMore">${icon('chevD',12)} ${S.projShowAll?'收起列表':'展开全部 '+PROJECTS.length+' 个项目'}</div>` : '';

  sb.innerHTML = `
  <div class="sb-sec">
    <div class="sb-h2">
      <span class="proj-chev${S.projCollapsed?'':' open'}" id="projChev" title="折叠 / 展开项目列表">${icon('chevR',12)}</span>
      <b class="sp-link" id="projSpaceLink" title="打开项目空间总览">项目空间<span class="proj-cnt">${PROJECTS.length}</span></b>
      <button class="mini-btn" id="newProjBtn" title="新建项目">${icon('plus',12)}新建</button>
    </div>
    ${projHtml}
    ${moreBtn}
    ${S.projCollapsed?'':`<div class="sb-tip">${icon('shieldC',14)}<div>项目 = 独立 Session，材料与对话<b>跨项目不串味</b>；切换项目即切换会话。</div></div>`}
  </div>
  <div class="sb-sec">
    <div class="sb-h2">
      <span style="display:flex;color:var(--accent-soft-ink)">${icon('zap',12)}</span>
      <b>工作目录 · 目录即工作</b>
    </div>
    <div class="tree" id="tree"></div>
  </div>`;

  qsa('[data-proj]',sb).forEach(el=>el.addEventListener('click',()=>{
    if(S.proj!==el.dataset.proj){ S.proj=el.dataset.proj; S.dir=''; addChatMsg('ai', `已切换到「${projById(S.proj).name}」Session（#${uid().toUpperCase().slice(0,4)}），上下文已隔离。`); }
    S.view='files'; render();
  }));
  qs('#projChev').addEventListener('click',e=>{ e.stopPropagation(); S.projCollapsed=!S.projCollapsed; renderSidebar(); });
  qs('#projSpaceLink').addEventListener('click',()=>{ S.view='space'; render(); });
  const pm=qs('#projMore'); if(pm) pm.addEventListener('click',()=>{ S.projShowAll=!S.projShowAll; renderSidebar(); });
  qs('#newProjBtn').addEventListener('click',e=>{
    const r=e.currentTarget.getBoundingClientRect();
    ctxMenu(r.left,r.bottom+6,[
      {k:'dir',label:'新建文件夹（当前项目）',icon:'folder',onClick:newFolderModal},
      {k:'proj',label:'新建项目',icon:'plus',onClick:newProjectModal},
    ]);
  });
  renderTree();
}

/* ---------- 目录树 ---------- */
function walkTree(nodes, path, cb){
  nodes.forEach(n=>{
    const p = path.concat(n.label);
    if(n.kids){
      cb(n,p,false);
      walkTree(n.kids,p,cb);
    } else cb(n,p,true);
  });
}
function renderTree(){
  const el = qs('#tree');
  el.innerHTML = TREE.map(n=>nodeHtml(n,[])).join('');
  // 绑定
  qsa('[data-node]',el).forEach(r=>r.addEventListener('click',e=>{
    e.stopPropagation();
    const id=r.dataset.node;
    S.openNodes.has(id)?S.openNodes.delete(id):S.openNodes.add(id);
    renderTree();
  }));
  qsa('[data-leaf]',el).forEach(r=>r.addEventListener('click',e=>{
    e.stopPropagation();
    let found=null, path=[];
    walkTree(TREE,[],(n,p,isLeaf)=>{ if(isLeaf&&n.id===r.dataset.leaf){found=n;path=p;} });
    if(found) openWizard(found, path.join(' / '));
  }));
}
function nodeHtml(n, path){
  const open = S.openNodes.has(n.id);
  const isRole = !!n.role;
  const head = isRole
    ? `<div class="trole" data-node="${n.id}"><span>${esc(n.label)}</span><span style="flex:1;height:1px;background:var(--line2)"></span></div>`
    : `<div class="trow" data-node="${n.id}">
         <span class="tw">${icon('chevR',12)}</span>
         ${n.dot?`<span class="tdot ${n.dot}"></span>`:''}
         <span>${esc(n.label)}</span>
         ${n.tag?`<span class="tag ${n.tagCls}" style="margin-left:2px">${esc(n.tag)}</span>`:''}
       </div>`;
  const kids = n.kids.map(k=>k.kids?nodeHtml(k,path.concat(n.label)):`
    <div class="tleaf" data-leaf="${k.id}" title="${esc(k.mcps)}">
      ${icon('zap',12)}<span class="nm">${esc(k.label)}</span><span class="arr">${icon('arrowR',12)}</span>
    </div>`).join('');
  return `<div class="tnode${open?' open':''}" id="tn-${n.id}">${head}<div class="tkids">${kids}</div></div>`;
}

/* ---------- 新建项目 ---------- */
function newProjectModal(){
  openModal({
    title:'新建项目（自动开启独立 Session）',
    body:`
      <label class="inp-lab">项目名称</label>
      <input class="inp" id="npName" style="width:100%" placeholder="如：某科技 IPO / 某 MTN / 某基金二期">
      <div class="grid2 mt14">
        <div><label class="inp-lab">资产类型</label>
          <select class="inp" id="npAsset" style="width:100%"><option>股票</option><option>债券</option><option>股权投资</option></select></div>
        <div><label class="inp-lab">交易 / 基金类型</label>
          <input class="inp" id="npDeal" style="width:100%" placeholder="如：科创板 IPO"></div>
      </div>
      <p class="muted mt14" style="font-size:12px">${icon('shieldC',13)} 项目内对话、材料、MCP 调用历史与产物全部独立；可邀请项目组成员共享。</p>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-pri" id="npOk">创建项目</button>`,
    onMount:(b,id)=>{
      qs('#npOk').addEventListener('click',()=>{
        const name = qs('#npName').value.trim();
        if(!name){ toast('请输入项目名称','warn'); return; }
        const asset = qs('#npAsset').value, deal = qs('#npDeal').value.trim()||asset;
        const pid = 'p'+(PROJECTS.length+1)+uid();
        PROJECTS.push({ id:pid, name, asset, deal, desc:'新项目', color:asset==='股票'?'#c0392b':asset==='债券'?'#1e8449':'#b7950b', updated:today(), members:['沈'] });
        S.files[pid]=[]; S.chatsInit=Object.assign(S.chatsInit||{},{});
        CHATS[pid]=[ { role:'ai', text:`「${name}」Session 已建立。上传材料或从左侧目录选择场景开始工作。` } ];
        S.proj=pid; S.dir=''; S.view='files';
        S.projCollapsed=false; S.projShowAll=true;
        closeModal(id); render();
        toast(`项目「${esc(name)}」已创建，Session 隔离已开启`,'ok');
      });
    }
  });
}

/* ---------- 路由 ---------- */
function setView(v){ S.view=v; render(); }
function render(){
  renderTopbar(); renderSidebar();
  const main = qs('#main');
  switch(S.view){
    case 'dash':      main.innerHTML = viewDash();      mountDash();      break;
    case 'space':     main.innerHTML = viewSpace();     mountSpace();     break;
    case 'files':     viewFiles(main);                                   break;
    case 'review':    main.innerHTML = viewReview();    mountReview();    break;
    case 'artifacts': main.innerHTML = viewArtifacts(); mountArtifacts(); break;
    case 'mcp':       main.innerHTML = viewMcp();       mountMcp();       break;
    case 'account':   main.innerHTML = viewAccount();   mountAccount();   break;
    case 'wizard':    renderWizard(main);                                break;
  }
  main.scrollTop = 0;
  renderChat();
}

/* ---------- 项目会话面板 ---------- */
let CHAT_STORE = null;
function chatStore(){
  if(!CHAT_STORE){ CHAT_STORE = {}; Object.keys(CHATS).forEach(k=>CHAT_STORE[k]=CHATS[k].slice()); }
  return CHAT_STORE;
}
function renderChat(){
  const el = qs('#chatPanel');
  el.classList.toggle('collapsed', !S.chatOpen);
  const ct = qs('#chatToggle');
  ct.classList.toggle('on', false);
  ct.classList.toggle('reveal', !S.chatOpen);
  ct.innerHTML = S.chatOpen ? icon('chat',17) : icon('chat',15)+'<span>展开会话</span>';
  if(!S.chatOpen) return;
  const p = projById(S.proj);
  const msgs = chatStore()[S.proj]||[];
  const body = qs('#chatBody');
  body.innerHTML = `
    <div class="chat-h">${icon('chat',16)}<b>项目会话</b><span class="chip">${esc(p.name)}</span>
      <span class="st2 tag t-on">${icon('shieldC',11)} Session 隔离</span>
      <button class="mini-ic" id="chatCollapse" title="向右收起会话面板" style="margin-left:6px;width:26px;height:26px">${icon('chevR',13)}</button></div>
    <div class="chat-msgs" id="chatMsgs">
      ${msgs.map(m=>msgHtml(m)).join('')}
    </div>
    <div class="chat-chips">
      ${['汇总项目进展','今日待审有哪些','生成今日日报'].map(c=>`<span class="cchip">${c}</span>`).join('')}
    </div>
    <div class="chat-inp">
      <input class="inp" id="chatInput" placeholder="对当前项目提问…">
      <button class="btn btn-pri" id="chatSend" style="padding:8px 12px">${icon('send',14)}</button>
    </div>`;
  const box = qs('#chatMsgs');
  box.scrollTop = box.scrollHeight;
  const send = ()=> sendChat();
  qs('#chatSend').addEventListener('click', send);
  qs('#chatInput').addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });
  qs('#chatCollapse').addEventListener('click', ()=>{ S.chatOpen=false; renderChat(); });
  qsa('.cchip',body).forEach(c=>c.addEventListener('click',()=>{ qs('#chatInput').value=c.textContent; sendChat(); }));
}
function msgHtml(m){
  if(m.role==='me') return `<div class="msg me">${esc(m.text)}</div>`;
  return `<div class="msg ai">${esc(m.text)}${m.src?`<span class="msrc">${icon('db',10)} 来源：${esc(m.src)}</span>`:''}</div>`;
}
function addChatMsg(role, text, src){
  chatStore()[S.proj] = (chatStore()[S.proj]||[]).concat([{role,text,src}]);
  if(S.chatOpen) renderChat();
}
function sendChat(){
  const inp = qs('#chatInput');
  const q = inp.value.trim();
  if(!q) return;
  inp.value='';
  addChatMsg('me', q);
  // 思考动画
  const box = qs('#chatMsgs');
  box.insertAdjacentHTML('beforeend','<div class="msg ai" id="thinkMsg"><div class="think"><i></i><i></i><i></i></div></div>');
  box.scrollTop = box.scrollHeight;
  setTimeout(()=>{
    const t = qs('#thinkMsg'); if(t) t.remove();
    addChatMsg('ai', chatReply(q), '平台统一凭证 · MCP 调用留痕可审计');
  }, 900);
}
function chatReply(q){
  const has = k => q.includes(k);
  if(has('待审')){
    const n = S.reviews.length;
    return `当前待审 ${n} 件：\n` + S.reviews.map(r=>`· 《${r.name}》（${r.scenario}）`).join('\n') + `\n\n申报类产物须持牌人确认签字后方可落盘归档。`;
  }
  if(has('日报')){
    return `「资本市场日报」定时任务已开启（每交易日 17:30）。\n今日日报 08:05 已生成归档：上证 +0.58%、北向 +37.2 亿、3 家上会 2 家过会。\n\n如需新增数据格，我可自动寻源；缺源时会提示升级套餐或上传本地数据。`;
  }
  if(has('招股书')){
    return `《启衡科技招股说明书（初稿）》v3 已完成：\n· 行业归类：申万 电子—半导体设备（置信度 92%）\n· 可比招股书 5 份（章节级结构抽取）\n· 126 个数据点全部标注来源\n· 排版质检：必改 1 / 建议 3 / 提示 5\n\n初稿已进入待审队列，等待持牌人确认。`;
  }
  if(has('估值')){
    return `DCF 主要结果：WACC 9.8%，永续增长 2.5%，每股价值 38.2 元；comps 交叉验证 35.6 元。\n估值区间 33.5–39.2 元 / 股，敏感性矩阵与三场景已校验，报告已送审。`;
  }
  if(has('进展')||has('汇总')){
    return `「启衡科技 IPO」项目进展：\n· 招股书初稿 v3 待审（差异 2 处已标注）\n· 二轮问询回复：业务部分完成 80%\n· comps 表今晨 07:40 定时更新至 v12\n· 下一步：确认初稿 → 更新申报清单`;
  }
  return `收到。我可以在当前项目 Session 内：\n· 执行左侧目录的场景（招股书 / 尽调 / 估值 / 日报…）\n· 解析上传材料并标注来源\n· 汇总项目进展与待审事项\n\n所有结论均标注数据来源（法规 / 公告 / 数据库），申报类产物需持牌人确认后落盘。`;
}

/* ---------- 布局：侧栏拖宽 / 会话面板收起 ---------- */
const SB_W_DEFAULT=274, SB_W_MIN=220, SB_W_MAX=420;
function initLayout(){
  const grip = qs('#sbGrip');
  const applyW = w=>{
    S.sbW=w;
    document.documentElement.style.setProperty('--sbw', w+'px');
  };
  const saved = parseInt(localStorage.getItem('cc-sbw'));
  applyW(saved>=SB_W_MIN&&saved<=SB_W_MAX ? saved : SB_W_DEFAULT);
  let dragging=false, sx=0, sw=0;
  grip.addEventListener('mousedown', e=>{
    e.preventDefault();
    dragging=true; sx=e.clientX; sw=S.sbW;
    grip.classList.add('active'); document.body.classList.add('resizing');
  });
  document.addEventListener('mousemove', e=>{
    if(!dragging) return;
    applyW(Math.max(SB_W_MIN, Math.min(SB_W_MAX, sw + (e.clientX - sx))));
  });
  document.addEventListener('mouseup', ()=>{
    if(!dragging) return;
    dragging=false;
    grip.classList.remove('active'); document.body.classList.remove('resizing');
    localStorage.setItem('cc-sbw', S.sbW);
  });
  grip.addEventListener('dblclick', ()=>{
    applyW(SB_W_DEFAULT);
    localStorage.setItem('cc-sbw', SB_W_DEFAULT);
    toast('侧栏宽度已复位');
  });
  // 会话面板：左缘手柄向右收起（收起后顶栏右上角出现「展开会话」按钮）
  const cg = qs('#chatGrip');
  qs('#cgIc').innerHTML = icon('chevR',13);
  cg.addEventListener('click', ()=>{ S.chatOpen=false; renderChat(); });
}

/* ---------- 全局搜索 ---------- */
function initGlobalSearch(){
  const inp = qs('#gSearchInput'), drop = qs('#gsDrop');
  qs('#gsIco').innerHTML = icon('search',15);
  inp.addEventListener('input', ()=>{
    const q = inp.value.trim().toLowerCase();
    if(!q){ drop.classList.remove('open'); drop.innerHTML=''; return; }
    const items = [];
    Object.keys(S.files).forEach(pid=>{
      S.files[pid].forEach(f=>{
        const hay = (f.name+' '+(f.content||'')).toLowerCase();
        if(!f.folder && hay.includes(q))
          items.push({t:'file', label:f.name, sub:projById(pid).name + (f.dir?' / '+f.dir:''), icon:fic(f.name), pid, file:f});
      });
    });
    walkTree(TREE,[],(n,p,isLeaf)=>{ if(isLeaf&&n.label.toLowerCase().includes(q)) items.push({t:'leaf',label:n.label,sub:'场景 · '+p.join(' / '),icon:icon('zap',13),leaf:n,path:p}); });
    MCP_GROUPS.forEach(g=>g.items.forEach(m=>{ if(m.name.toLowerCase().includes(q)) items.push({t:'mcp',label:m.name,sub:'MCP · '+g.cat,icon:icon('db',13)}); }));
    const files = items.filter(i=>i.t==='file').slice(0,5);
    const leafs = items.filter(i=>i.t==='leaf').slice(0,4);
    const mcps  = items.filter(i=>i.t==='mcp').slice(0,3);
    let html = '';
    if(files.length) html += `<div class="gs-group">文件（项目内全文索引）</div>` + files.map((f,i)=>`<div class="gs-item" data-gs="file" data-i="${i}">${f.icon}<span>${esc(f.label)}</span><small>${esc(f.sub)}</small></div>`).join('');
    if(leafs.length) html += `<div class="gs-group">工作场景</div>` + leafs.map((f,i)=>`<div class="gs-item" data-gs="leaf" data-i="${i}"><span style="color:var(--blue);display:flex">${f.icon}</span><span>${esc(f.label)}</span><small>${esc(f.sub)}</small></div>`).join('');
    if(mcps.length)  html += `<div class="gs-group">MCP 资源</div>` + mcps.map(f=>`<div class="gs-item"><span style="color:var(--gold);display:flex">${f.icon}</span><span>${esc(f.label)}</span><small>${esc(f.sub)}</small></div>`).join('');
    if(!html) html = `<div class="empty" style="padding:24px">没有匹配「${esc(inp.value)}」的结果</div>`;
    drop.innerHTML = html;
    drop.classList.add('open');
    drop._data = {files,leafs};
    qsa('[data-gs]',drop).forEach(el=>el.addEventListener('click',()=>{
      const d = drop._data;
      if(el.dataset.gs==='file'){
        const f = d.files[+el.dataset.i];
        S.proj=f.pid; S.dir=f.file.dir; S.view='files'; render();
      } else {
        const f = d.leafs[+el.dataset.i];
        openWizard(f.leaf, f.path.join(' / '));
      }
      drop.classList.remove('open'); inp.value='';
    }));
  });
  inp.addEventListener('blur', ()=> setTimeout(()=>drop.classList.remove('open'),180));
  qs('#planTag').addEventListener('click', planModal);
  qs('#tbQuota').addEventListener('click', planModal);
  qs('#chatToggle').innerHTML = icon('chat',17);
  qs('#chatToggle').addEventListener('click', ()=>{ S.chatOpen=!S.chatOpen; renderChat(); });
}
