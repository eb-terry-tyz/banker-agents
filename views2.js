/* ============ 视图：待审队列 / 产物中心 / MCP 资源池 ============ */

/* ---------------- 待审队列 ---------------- */
function viewReview(){
  const cards = S.reviews.map(r=>`
    <div class="rev-card">
      ${fic(r.name)}
      <div class="rev-main">
        <div class="rn">《${esc(r.name)}》</div>
        <div class="rev-meta">
          <span class="tag t-tool">${icon('zap',11)} ${esc(r.scenario)}</span>
          <span class="tag t-gray">${esc(projById(r.proj).name)}</span>
          <span class="muted small">${icon('clock',12)} ${esc(r.time)}</span>
          <span class="chip">${icon('db',10)} ${r.mcps.map(esc).join(' · ')}</span>
        </div>
        <div class="rev-diff">${icon('search',13)} ${esc(r.diff)}</div>
      </div>
      <div class="rev-acts">
        <button class="btn btn-ghost btn-sm" data-prev="${r.id}">${icon('eye',13)} 预览</button>
        <button class="btn btn-danger btn-sm" data-rej="${r.id}">驳回</button>
        <button class="btn btn-pri btn-sm" data-appr="${r.id}">${icon('shieldC',13)} 确认签字</button>
      </div>
    </div>`).join('');
  return `<div class="wrap">
    <div class="crumb"><b>待审队列</b><span class="sep">·</span><span>人审不可绕过：申报 / 对外类产物须持牌人确认后落盘</span></div>
    ${cards || `<div class="card"><div class="empty">${icon('check',20)}<div class="mt8">太好了，当前没有待审文件</div></div></div>`}
  </div>`;
}
function mountReview(){
  qsa('[data-prev]').forEach(el=>el.addEventListener('click',()=>{
    const r=S.reviews.find(x=>x.id===el.dataset.prev);
    previewModal({name:r.name, from:'场景 · '+r.scenario});
  }));
  qsa('[data-appr]').forEach(el=>el.addEventListener('click',()=>approveModal(el.dataset.appr)));
  qsa('[data-rej]').forEach(el=>el.addEventListener('click',()=>rejectModal(el.dataset.rej)));
}
function approveModal(id){
  const r=S.reviews.find(x=>x.id===id);
  openModal({
    title:`持牌人确认 ·《${esc(r.name)}》`,
    body:`
      <div class="license">
        <div class="lg-t">${icon('shieldC',17)} 持牌人员签核</div>
        <p class="note2">本文件为申报 / 对外类产物。确认后文件将落盘归档至「${esc(projById(r.proj).name)}」项目，并记录签核人与时间，全程留痕可审计。</p>
        <label class="opt mt8" id="licCk" style="margin-top:10px">
          <input type="checkbox" id="licBox">
          <div><b>本人系持牌人员，已逐项核对数据来源与质检结论</b>
          <p>来源：${r.mcps.join(' / ')} · ${esc(r.diff.slice(0,40))}…</p></div>
        </label>
        <label class="inp-lab mt14">签名（输入姓名以确认）</label>
        <input class="inp" id="licName" style="width:100%" placeholder="请输入持牌人姓名">
      </div>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-pri" id="apprOk" disabled>${icon('check',13)} 确认并归档</button>`,
    onMount:(b,mid)=>{
      const box=qs('#licBox'), name=qs('#licName'), ok=qs('#apprOk');
      const chk=()=>{ ok.disabled=!(box.checked && name.value.trim()); };
      box.addEventListener('change',chk); name.addEventListener('input',chk);
      ok.addEventListener('click',()=>{
        S.reviews=S.reviews.filter(x=>x.id!==id);
        S.files[r.proj].push({dir:'', name:r.name, size:'—', time:today(), status:'ok', ver:'v1', from:'已签核 · '+r.scenario});
        S.artifacts.unshift({...r, ext:EXT(r.name), time:today(), size:'—'});
        closeModal(mid); render();
        toast(`《${esc(r.name)}》已由 ${esc(name.value.trim())} 签核归档`,'ok');
        addChatMsg('ai',`《${r.name}》已完成持牌人签核（${name.value.trim()} · ${today()}），落入项目文件并计入产物中心。`,'签核留痕');
      });
    }
  });
}
function rejectModal(id){
  const r=S.reviews.find(x=>x.id===id);
  openModal({
    title:`驳回 ·《${esc(r.name)}》`,
    body:`<label class="inp-lab">驳回原因（将反馈给场景重跑）</label>
      <textarea class="inp" id="rejWhy" style="width:100%;min-height:90px" placeholder="如：第三节财务数据与审计报告口径不一致，请重新取数"></textarea>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-danger" id="rejOk">驳回</button>`,
    onMount:(b,mid)=>qs('#rejOk').addEventListener('click',()=>{
      const why=qs('#rejWhy').value.trim();
      if(!why){ toast('请填写驳回原因','warn'); return; }
      S.reviews=S.reviews.filter(x=>x.id!==id);
      S.files[r.proj].push({dir:'', name:r.name, size:'—', time:today(), status:'draft', ver:'v1', from:'已驳回 · 待修改'});
      closeModal(mid); render();
      toast(`《${esc(r.name)}》已驳回，退回场景修改`,'warn');
      addChatMsg('ai',`《${r.name}》被驳回：「${why}」。已加入重跑队列，建议先核对数据源口径。`);
    })
  });
}

/* ---------------- 产物中心 ---------------- */
let _artFilter='全部';
function viewArtifacts(){
  const types=['全部','docx','xlsx','pdf','pptx','html'];
  const list=_artFilter==='全部'? S.artifacts : S.artifacts.filter(a=>a.ext===_artFilter);
  return `<div class="wrap">
    <div class="crumb"><b>产物中心</b><span class="sep">·</span><span>AI 产物与生成场景双向关联，可追溯 MCP 调用链</span></div>
    <div class="fchips">${types.map(t=>`<span class="fchip${t===_artFilter?' on':''}" data-at="${t}">${t==='全部'?'全部类型':t.toUpperCase()}</span>`).join('')}</div>
    <div class="art-grid">
      ${list.map(a=>`
      <div class="art">
        <div class="art-top">${fic(a.name)}<div style="min-width:0"><div class="an">${esc(a.name)}</div><div class="am">${esc(projById(a.proj).name)} · ${esc(a.time)} · ${esc(a.size||'')}</div></div></div>
        <div class="art-chips">
          <span class="tag t-tool">${icon('zap',10)} ${esc(a.scen)}</span>
          ${a.mcps.map(m=>`<span class="chip">${icon('db',9)}${esc(m)}</span>`).join('')}
        </div>
        <div class="art-acts">
          <button class="btn btn-ghost btn-sm" data-aprev="${a.id}" style="flex:1;justify-content:center">${icon('eye',12)} 预览</button>
          <button class="btn btn-blue btn-sm" data-aarch="${a.id}" style="flex:1;justify-content:center">${icon('folder',12)} 归档</button>
          <button class="btn btn-ghost btn-sm" data-adl="${a.id}">${icon('download',12)}</button>
        </div>
      </div>`).join('') || '<div class="empty" style="grid-column:1/-1">该类型暂无产物</div>'}
    </div>
  </div>`;
}
function mountArtifacts(){
  qsa('[data-at]').forEach(el=>el.addEventListener('click',()=>{ _artFilter=el.dataset.at; renderMainOnlyArtifacts(); }));
  qsa('[data-aprev]').forEach(el=>el.addEventListener('click',()=>{
    const a=S.artifacts.find(x=>x.id===el.dataset.aprev);
    previewModal({name:a.name, from:'场景 · '+a.scen});
  }));
  qsa('[data-adl]').forEach(el=>el.addEventListener('click',()=>{
    const a=S.artifacts.find(x=>x.id===el.dataset.adl);
    toast(`《${esc(a.name)}》开始下载`,'ok');
  }));
  qsa('[data-aarch]').forEach(el=>el.addEventListener('click',()=>{
    const a=S.artifacts.find(x=>x.id===el.dataset.aarch);
    archiveModal(a);
  }));
}
/* 归档弹窗：先选项目，再选项目内文件夹 */
function archiveModal(a){
  const dirsOf=pid=>{const s=[];S.files[pid].forEach(f=>{if(f.folder&&f.dir==='')s.push(f.name);});return s;};
  let pid=a.proj, dir='';
  openModal({
    title:`归档到项目 ·《${esc(a.name)}》`,
    body:`<div id="arBody"></div>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-pri" id="arOk">${icon('folder',13)} 归档</button>`,
    onMount(b,id){
      const paint=()=>{
        const dirs=dirsOf(pid);
        qs('#arBody',b).innerHTML=`
          <label class="inp-lab">目标项目</label>
          ${PROJECTS.map(p=>`<label class="opt${p.id===pid?' on':''}" style="margin-bottom:8px"><input type="radio" name="ar" value="${p.id}" ${p.id===pid?'checked':''}><div><b>${esc(p.name)}</b><p>${esc(p.deal)}</p></div></label>`).join('')}
          <label class="inp-lab mt14">目标文件夹（归档后仍可在项目内拖拽移动）</label>
          <div class="fchips" style="margin-bottom:2px">
            <span class="fchip${dir===''?' on':''}" data-d="">根目录</span>
            ${dirs.map(d=>`<span class="fchip${d===dir?' on':''}" data-d="${esc(d)}">${icon('folder',11)} ${esc(d)}</span>`).join('')}
          </div>
          ${dirs.length?'':'<p class="muted small mt8">该项目暂无子文件夹，将归档到根目录；新建文件夹后可拖拽移入。</p>'}`;
        qsa('input[name="ar"]',b).forEach(r=>r.addEventListener('change',()=>{pid=r.value;dir='';paint();}));
        qsa('.fchip[data-d]',b).forEach(c=>c.addEventListener('click',()=>{
          dir=c.dataset.d;
          qsa('.fchip[data-d]',b).forEach(x=>x.classList.toggle('on',x.dataset.d===dir));
        }));
      };
      paint();
      qs('#arOk').addEventListener('click',()=>{
        S.files[pid].push({dir, name:a.name, size:a.size||'—', time:today(), status:'ok', ver:'v1', from:'产物归档 · '+a.scen});
        closeModal(id);
        toast(`已归档至「${esc(projById(pid).name)}${dir?' / '+esc(dir):''}」`,'ok');
      });
    }
  });
}
function renderMainOnlyArtifacts(){ qs('#main').innerHTML=viewArtifacts(); mountArtifacts(); }

/* ---------------- MCP 资源池 ---------------- */
function viewMcp(){
  const total=MCP_GROUPS.reduce((a,g)=>a+g.items.length,0);
  const on=MCP_GROUPS.reduce((a,g)=>a+g.items.filter(i=>i.status).length,0);
  return `<div class="wrap">
    <div class="mcp-banner">
      <div class="shield">${icon('shieldC',22)}</div>
      <div style="flex:1">
        <b style="font-size:15px">零连接 · 即点即用</b>
        <p class="muted small" style="margin-top:2px">平台统一采购并托管全部 MCP 凭证（KMS 加密），按订阅档位自动挂载。你不需要配置任何 API Key —— 共 ${total} 个资源，${on} 个已接入，其余经适配层接入中。</p>
      </div>
      <button class="btn btn-pri" id="planBtn2">${icon('chart',14)} 查看 / 升级套餐</button>
    </div>
    ${MCP_GROUPS.map(g=>`
      <div class="mcp-cat">${esc(g.cat)}<span class="ln"></span><span class="muted" style="font-weight:400;letter-spacing:0">${g.items.length} 个</span></div>
      <div class="card"><div class="card-b" style="padding:4px 14px 8px">
      <table class="tbl zebra">
        <thead><tr><th>MCP / 数据源</th><th>状态</th><th>最低档位</th><th>核心能力</th><th>主要服务场景</th></tr></thead>
        <tbody>${g.items.map(m=>`
          <tr>
            <td><b style="font-size:13px">${esc(m.name)}</b></td>
            <td>${m.status?`<span class="tag t-on">${icon('check',10)} 已接入</span>`:`<span class="tag t-off">${icon('clock',10)} 适配中 · 待对接</span>`}</td>
            <td>${m.tier==='机构版'?`<span class="tag t-pe">${icon('lock',10)} ${m.tier}</span>`:m.tier==='投行版'?`<span class="tag t-blue">${esc(m.tier)}</span>`:`<span class="tag t-gray">${esc(m.tier)}</span>`}</td>
            <td class="muted">${esc(m.cap)}</td>
            <td class="muted">${esc(m.scen)}</td>
          </tr>`).join('')}</tbody>
      </table></div></div>`).join('')}
    <p class="muted small mt14">${icon('refresh',12)} 新增 / 替换 MCP 只需写入适配器（统一工具签名），上层场景配方零改动；单点故障自动重试与降级，不阻断流程。</p>
  </div>`;
}
function mountMcp(){
  qs('#planBtn2').addEventListener('click',planModal);
}
function planModal(){
  openModal({
    title:'订阅与用量',
    body:`
      <div class="muted small mb14">当前：<b style="color:var(--gold)">投行版 · ${USER.planPrice}</b> · 本月 MCP 调用 ${S.quota.used.toLocaleString()} / ${S.quota.total.toLocaleString()} 次，超额部分按次 / 按 Token 计费。</div>
      <div class="progress mb14"><i style="width:${Math.min(100,S.quota.used/S.quota.total*100)}%"></i></div>
      ${PLAN_TIERS.map(t=>`
        <div class="opt" style="margin-bottom:9px;${t.cur?'border-color:var(--gold);background:var(--gold-soft)':''}">
          <div style="flex:1">
            <b>${esc(t.name)} ${t.cur?'<span class="tag t-pe" style="margin-left:4px">当前</span>':''}</b>
            <span style="float:right;font-weight:700;color:var(--navy)">${esc(t.price)}</span>
            <p>${esc(t.desc)}</p>
            <p class="small" style="color:var(--faint)">典型用户：${esc(t.user)}</p>
          </div>
          ${t.cur?'':`<button class="btn ${t.name==='机构版'?'btn-ghost':'btn-blue'} btn-sm" data-upg="${esc(t.name)}" style="align-self:center">${t.name==='免费版'?'降级':'升级'}</button>`}
        </div>`).join('')}
    `,
    onMount:(b,id)=>qsa('[data-upg]',b).forEach(el=>el.addEventListener('click',()=>{
      closeModal(id); toast(`${el.dataset.upg}开通申请已提交，客户经理将在 1 个工作日内联系`,'ok');
    }))
  });
}
