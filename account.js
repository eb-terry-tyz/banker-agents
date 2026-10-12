/* ============ 用户管理界面（账户中心）+ 外观主题 ============ */

const ACCOUNT = {
  version:'v1.2.0',
  build:'2026.09.24 · build 2418',
  balance:328.50,
  theme: localStorage.getItem('cc-theme') || 'light',
  accent: localStorage.getItem('cc-accent') || 'navy',
  pane:'overview',
  payAmount:100,
  payChannel:'alipay',
  settings:{
    notifyTask:true, notifyReview:true, notifyReg:false,
    exportFmt:'PDF', marketColor:'cn', dataPoint:'close',
  },
  memory:{
    chatOn:true, crossProject:false, feedbackOn:true,
    sessions:3, size:'42.6 MB', knowledge:12, templates:8,
  },
  ledger:[
    {t:'09-23 14:02', txt:'文因互联 · 招股书章节生成（按次）', amt:-8.00},
    {t:'09-22 09:11', txt:'账户充值 · 加油站', amt:+200.00},
    {t:'09-21 16:40', txt:'FactSet · 境外债数据单次取数', amt:-12.00},
  ],
  evoLog:[
    {v:'v1.2.0', t:'2026-09-20', txt:'行业分类引擎升级：申万 / 中证 / GBICS 三套归类置信度平均 +3.2pp；新增用户修正反哺。'},
    {v:'v1.1.0', t:'2026-09-08', txt:'估值模型支持蒙特卡洛（10,000 次）与三场景交叉验证；WACC 参数全部可追溯。'},
    {v:'v1.0.0', t:'2026-08-30', txt:'首个版本：项目 / Session 文件管理、招股书撰写与审校、资本市场日报、MCP 资源池。'},
  ],
};

/* ---------- 主题 ---------- */
function resolveTheme(mode){
  if(mode==='system') return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return mode==='dark' ? 'dark' : 'light';
}
function applyTheme(mode, silent){
  ACCOUNT.theme = mode;
  localStorage.setItem('cc-theme', mode);
  document.documentElement.dataset.theme = resolveTheme(mode);
  syncThemeUI();
  if(!silent) toast(`外观已切换为${mode==='light'?'浅色':mode==='dark'?'深色':'跟随系统'}`, 'ok');
}
function applyAccent(acc, silent){
  ACCOUNT.accent = acc;
  localStorage.setItem('cc-accent', acc);
  document.documentElement.dataset.accent = acc;
  if(!silent) toast(`强调色已切换为${acc==='navy'?'深海军蓝':'哑光橄榄绿'}`, 'ok');
}
function syncThemeUI(){
  const dark = document.documentElement.dataset.theme==='dark';
  const q = qs('#themeQuick');
  if(q) q.innerHTML = icon(dark?'clock':'shieldC', 16);
}

/* ---------- 头像菜单 / 快捷主题 ---------- */
function initAccountChrome(){
  const user = qs('#tbUser');
  user.addEventListener('click', ()=>{
    const r = user.getBoundingClientRect();
    ctxMenu(r.left-40, r.bottom+8, [
      {k:'acct', label:'账户与设置', icon:'users', onClick:()=>{ S.view='account'; render(); }},
      {k:'theme', label:'切换浅色 / 深色外观', icon:'shieldC', onClick:()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')},
      {k:'upd', label:'检查更新', icon:'refresh', onClick:()=>toast('已是最新版本 '+ACCOUNT.version,'ok')},
      '-',
      {k:'out', label:'退出登录', icon:'x', red:true, onClick:logoutConfirm},
    ]);
  });
  qs('#themeQuick').addEventListener('click', ()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  syncThemeUI();
}
function logoutConfirm(){
  openModal({
    title:'退出登录',
    body:`<p style="font-size:13.5px">确认退出当前账号「${esc(USER.name)}」？</p><p class="muted mt8" style="font-size:12px">项目文件与 Session 记忆保留在云端；本机外观偏好保留。演示环境刷新页面即可重新进入。</p>`,
    foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-danger" id="loOk">退出登录</button>`,
    onMount:(b,id)=>qs('#loOk').addEventListener('click',()=>{
      closeModal(id); toast('已退出登录（演示环境）','warn');
    })
  });
}

/* ---------- 账户中心视图 ---------- */
const ACCT_NAV=[
  {k:'overview', label:'账户概览', icon:'users'},
  {k:'balance',  label:'余额与加油站', icon:'db'},
  {k:'settings', label:'设置', icon:'edit'},
  {k:'memory',   label:'记忆与进化', icon:'history'},
  {k:'look',     label:'外观', icon:'eye'},
  {k:'about',    label:'版本 · 帮助与反馈', icon:'shieldC'},
];
function acctPane(){ return ACCOUNT.pane; }
function viewAccount(){
  const nav = ACCT_NAV.map(n=>`
    <div class="acct-item${ACCOUNT.pane===n.k?' on':''}" data-pane="${n.k}">
      <span class="ai">${icon(n.icon,15)}</span>${n.label}
    </div>`).join('');
  return `<div class="wrap">
    <div class="crumb"><b>账户中心</b><span class="sep">·</span><span>用户管理 · ${esc(USER.name)}（${esc(USER.dept)}）</span></div>
    <div class="acct-grid">
      <div class="acct-nav card">
        <div class="acct-profile">
          <div class="ava">沈</div>
          <b>${esc(USER.name)}</b>
          <span>${esc(USER.dept)} · ${esc(USER.title)}</span>
          <span class="tag t-pe" style="margin-top:6px">${icon('shieldC',11)} ${esc(USER.plan)} · ${esc(USER.planPrice)}</span>
        </div>
        ${nav}
        <div style="height:1px;background:var(--line2);margin:6px 8px"></div>
        <div class="acct-item" data-logout><span class="ai" style="color:var(--danger)">${icon('x',15)}</span>退出登录</div>
      </div>
      <div class="acct-main card" id="acctMain"></div>
    </div>
  </div>`;
}
function mountAccount(){
  qsa('[data-pane]').forEach(el=>el.addEventListener('click',()=>{
    ACCOUNT.pane=el.dataset.pane; renderAcctPane();
    qsa('[data-pane]').forEach(x=>x.classList.toggle('on', x.dataset.pane===ACCOUNT.pane));
  }));
  const lo=qs('[data-logout]'); if(lo) lo.addEventListener('click', logoutConfirm);
  renderAcctPane();
}
function renderAcctPane(){
  const el = qs('#acctMain'); if(!el) return;
  const k = ACCOUNT.pane;
  if(k==='overview') el.innerHTML = paneOverview();
  if(k==='balance')  el.innerHTML = paneBalance();
  if(k==='settings') el.innerHTML = paneSettings();
  if(k==='memory')   el.innerHTML = paneMemory();
  if(k==='look')     el.innerHTML = paneLook();
  if(k==='about')    el.innerHTML = paneAbout();
  wirePane(el, k);
}

/* ---- 概览 ---- */
function paneOverview(){
  const pct = Math.min(100, S.quota.used/S.quota.total*100);
  return `
  <div class="acct-h"><b>账户概览</b><span class="sub">${ACCOUNT.version} · ${ACCOUNT.build}</span></div>
  <div class="grid2">
    <div class="dcard">
      <div class="dh">${icon('db',14)} 余额（按次付费）</div>
      <div class="balance-hero"><b>¥ ${ACCOUNT.balance.toFixed(2)}</b><span>RMB</span></div>
      <div class="dm">用于超额 MCP 调用（文因互联撰写、FactSet 海外数据等），余额不足时可在加油站充值。</div>
      <button class="btn btn-pri btn-sm mt8" data-goto-balance>前往加油站</button>
    </div>
    <div class="dcard">
      <div class="dh">${icon('zap',14)} 本月套餐用量</div>
      <div class="mt8"><div class="progress"><i style="width:${pct}%"></i></div></div>
      <div class="dm">MCP 调用 ${S.quota.used.toLocaleString()} / ${S.quota.total.toLocaleString()} 次 · ${esc(USER.plan)}（${esc(USER.planPrice)}）<br>待审文件 ${S.reviews.length} 件 · 累计产物 ${S.artifacts.length} 份</div>
      <button class="btn btn-ghost btn-sm mt8" data-plan>查看 / 升级套餐</button>
    </div>
  </div>
  <div class="dcard mt14">
    <div class="dh">${icon('users',14)} 项目组成员（共享范围）</div>
    <div class="dm">陆嘉言（ECM · 编辑）· 周敏（法务 · 评论）· 韩叙（PE · 查看）<br>共享给项目外成员需管理员审批；跨项目数据严格隔离。</div>
  </div>`;
}
/* ---- 余额与加油站 ---- */
function paneBalance(){
  const amts=[50,100,200,500];
  const tips={50:'体验',100:'常用',200:'推荐',500:'团队'};
  return `
  <div class="acct-h"><b>余额与加油站</b><span class="sub">按次付费 MCP 调用的预付余额</span></div>
  <div class="dcard" style="border-left:3px solid var(--accent-2)">
    <div class="dh">${icon('db',14)} 当前余额</div>
    <div class="balance-hero"><b>¥ ${ACCOUNT.balance.toFixed(2)}</b><span>RMB</span></div>
    <div class="dm">用于超额调用：文因互联 撰写（¥8 / 次）· FactSet 海外数据（¥12 / 次）等高成本 MCP。</div>
  </div>
  <div class="mt18">
    <label class="inp-lab">加油站 · 选择充值金额</label>
    <div class="amt-grid">
      ${amts.map(a=>`<div class="amt${ACCOUNT.payAmount===a?' on':''}" data-amt="${a}"><b>¥${a}</b><span>${tips[a]}</span></div>`).join('')}
    </div>
    <label class="inp-lab mt14">支付方式</label>
    <div class="grid2">
      ${[['alipay','支付宝','默认'],['wx','微信支付',''],['corp','对公转账','可开增值税专用发票']].map(c=>`
      <label class="opt${ACCOUNT.payChannel===c[0]?' on':''}" style="margin-bottom:8px"><input type="radio" name="paych" value="${c[0]}" ${ACCOUNT.payChannel===c[0]?'checked':''}>
      <div><b>${c[1]}</b>${c[2]?`<p>${c[2]}</p>`:''}</div></label>`).join('')}
    </div>
    <button class="btn btn-pri mt14" id="payOk">${icon('zap',14)} 立即充值 ¥${ACCOUNT.payAmount}</button>
  </div>
  <div class="mt18">
    <label class="inp-lab">最近账变</label>
    <table class="tbl zebra"><thead><tr><th>时间</th><th>说明</th><th class="num">金额（元）</th></tr></thead>
    <tbody>${ACCOUNT.ledger.map(l=>`<tr><td class="muted" style="white-space:nowrap">${esc(l.t)}</td><td>${esc(l.txt)}</td>
    <td class="num" style="color:${l.amt>0?'var(--ok)':'var(--sub)'};font-weight:600">${l.amt>0?'+':''}${l.amt.toFixed(2)}</td></tr>`).join('')}</tbody></table>
  </div>`;
}
function paneSettings(){
  const s=ACCOUNT.settings;
  const swRow=(id,label,desc,on)=>`
    <div class="task-row"><div style="min-width:0;flex:1"><div class="tn">${label}</div><div class="tc">${desc}</div></div>
    <button class="switch${on?' on':''}" data-sw="${id}"><i></i></button></div>`;
  return `
  <div class="acct-h"><b>设置</b><span class="sub">通知与工作偏好</span></div>
  <div class="dcard"><div class="dh">${icon('bell',14)} 通知</div>
    <div class="card-b tight" style="padding:4px 0 0">
    ${swRow('notifyTask','定时任务完成通知','日报 / comps 等定时产物生成完成后提醒',s.notifyTask)}
    ${swRow('notifyReview','待审文件提醒','有新的申报类产物进入待审队列时提醒',s.notifyReview)}
    ${swRow('notifyReg','监管新规推送','北大法宝 / 法研 新规速递（每日 09:00）',s.notifyReg)}
    </div></div>
  <div class="dcard mt14"><div class="dh">${icon('edit',14)} 工作偏好</div>
    <div class="grid2 mt8">
      <div><label class="inp-lab">默认导出格式</label>
        <select class="inp" style="width:100%" data-sel="exportFmt">
          <option ${s.exportFmt==='PDF'?'selected':''}>PDF</option><option ${s.exportFmt==='Word'?'selected':''}>Word</option><option ${s.exportFmt==='在线文档'?'selected':''}>在线文档</option>
        </select></div>
      <div><label class="inp-lab">数据时点</label>
        <select class="inp" style="width:100%" data-sel="dataPoint">
          <option value="close" ${s.dataPoint==='close'?'selected':''}>最新收盘</option><option value="now" ${s.dataPoint==='now'?'selected':''}>实时</option><option value="month" ${s.dataPoint==='month'?'selected':''}>本月末</option>
        </select></div>
    </div>
    <label class="inp-lab mt14">涨跌配色</label>
    <div class="seg" data-seg="marketColor">
      <button class="${s.marketColor==='cn'?'on':''}" data-v="cn">A 股惯例（涨红跌绿）</button>
      <button class="${s.marketColor==='intl'?'on':''}" data-v="intl">国际惯例（涨绿跌红）</button>
    </div>
  </div>`;
}
function paneMemory(){
  const m=ACCOUNT.memory;
  const swRow=(id,label,desc,on)=>`
    <div class="task-row"><div style="min-width:0;flex:1"><div class="tn">${label}</div><div class="tc">${desc}</div></div>
    <button class="switch${on?' on':''}" data-msw="${id}"><i></i></button></div>`;
  return `
  <div class="acct-h"><b>记忆与进化</b><span class="sub">Session 记忆 · 知识沉淀 · 模型进化日志</span></div>
  <div class="grid2">
    <div class="dcard"><div class="dh">${icon('history',14)} 项目记忆（Session）</div>
      <div class="dm">${m.sessions} 个 Session · 占用 ${m.size} · 保留策略 30 天<br>对话、上传材料解析结果与 MCP 调用历史按项目隔离，跨项目不串味。</div>
      <div class="progress mt8"><i style="width:34%"></i></div>
      <button class="btn btn-danger btn-sm mt14" data-clear-mem>清空当前项目记忆</button>
    </div>
    <div class="dcard"><div class="dh">${icon('spark',14)} 知识沉淀</div>
      <div class="dm">行业分类人工修正反哺 <b>${m.knowledge}</b> 条 · 模板偏好 <b>${m.templates}</b> 份<br>沉淀内容仅用于改进你自己的场景配方，不上传共享。</div>
    </div>
  </div>
  <div class="dcard mt14"><div class="dh">${icon('shieldC',14)} 记忆策略</div>
    <div class="card-b tight" style="padding:4px 0 0">
    ${swRow('chatOn','对话记忆','记住当前项目会话上下文，30 天滚动',m.chatOn)}
    ${swRow('crossProject','跨项目知识沉淀','默认关闭以保持 Session 隔离',m.crossProject)}
    ${swRow('feedbackOn','行业分类修正反哺','你的手动归类修正用于改进引擎置信度',m.feedbackOn)}
    </div></div>
  <div class="dcard mt14"><div class="dh">${icon('zap',14)} 进化日志</div>
    <div class="card-b tight" style="padding:4px 0 0">
    ${ACCOUNT.evoLog.map(e=>`<div class="evo-row"><span class="ev">${e.v}</span><div><div>${e.txt}</div><div class="tc" style="font-size:10.5px;color:var(--faint)">${e.t}</div></div></div>`).join('')}
    </div></div>`;
}
function paneLook(){
  const t=ACCOUNT.theme, a=ACCOUNT.accent;
  return `
  <div class="acct-h"><b>外观</b><span class="sub">主题 · 强调色 · 预览即时生效</span></div>
  <div class="dcard">
    <div class="dh">${icon('eye',14)} 主题</div>
    <div class="seg mt8" data-seg="theme">
      <button class="${t==='light'?'on':''}" data-v="light">浅色</button>
      <button class="${t==='dark'?'on':''}" data-v="dark">深色</button>
      <button class="${t==='system'?'on':''}" data-v="system">跟随系统</button>
    </div>
    <div class="theme-prev mt14">
      <div class="tp tp-light ${resolveTheme(t)==='light'?'on':''}" data-tp="light"><div class="pv-mini"></div><b>浅色 · 米白玻璃</b></div>
      <div class="tp tp-dark ${resolveTheme(t)==='dark'?'on':''}" data-tp="dark"><div class="pv-mini"></div><b>深色 · 乌墨玻璃</b></div>
    </div>
    <p class="muted small mt8">明亮模式使用米白 / 浅灰（#F4F5F7），深色模式使用深邃乌黑（#131417），均避开纯黑纯白，长时间阅读不刺眼。</p>
  </div>
  <div class="dcard mt14">
    <div class="dh">${icon('chart',14)} 强调色（10% 点缀）</div>
    <div class="seg mt8" data-seg="accent">
      <button class="${a==='navy'?'on':''}" data-v="navy">深海军蓝</button>
      <button class="${a==='olive'?'on':''}" data-v="olive">哑光橄榄绿</button>
    </div>
    <p class="muted small mt8">低饱和同色系点缀：进行中 / 加急使用浅蓝底深蓝字，已完成使用浅绿底深绿字，其余区域保持中性灰阶。</p>
  </div>`;
}
function paneAbout(){
  return `
  <div class="acct-h"><b>版本 · 帮助与反馈</b><span class="sub">${ACCOUNT.build}</span></div>
  <div class="dcard" style="display:flex;align-items:center;gap:14px">
    <div class="logo"><svg viewBox="0 0 36 36" width="44" height="44"><rect x="1" y="1" width="34" height="34" rx="10" fill="url(#lg2)"/><rect x="9.5" y="14" width="4" height="12" rx="1.5" fill="#fff" opacity=".95"/><rect x="16" y="8.5" width="4" height="17.5" rx="1.5" fill="#fff" opacity=".82"/><rect x="22.5" y="17" width="4" height="9" rx="1.5" fill="#fff" opacity=".66"/><defs><linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1d5c8f"/><stop offset="1" stop-color="#0f3057"/></linearGradient></defs></svg></div>
    <div style="flex:1"><b style="font-size:15px">CapitalCore 资本智核</b>
      <div class="muted small">版本 ${ACCOUNT.version} · ${ACCOUNT.build} · 桌面工作台</div></div>
    <button class="btn btn-ghost" id="chkUpd">${icon('refresh',13)} 检查更新</button>
  </div>
  <div class="grid2 mt14">
    <div class="help-card" data-help="手册"><span class="q-ic qi-1">${icon('doc',16)}</span><div><b>使用手册</b><p>场景向导 · 文件管理 · 待审流转</p></div></div>
    <div class="help-card" data-help="快捷键"><span class="q-ic qi-4">${icon('zap',16)}</span><div><b>快捷键</b><p>⌘K 全局搜索 · ⌘N 新建项目</p></div></div>
    <div class="help-card" data-help="反馈"><span class="q-ic qi-3">${icon('chat',16)}</span><div><b>帮助与反馈</b><p>问题反馈 · 功能建议 · 顾问支持</p></div></div>
    <div class="help-card" data-help="状态"><span class="q-ic qi-2">${icon('shieldC',16)}</span><div><b>服务状态</b><p>MCP 资源池全部节点运行正常</p></div></div>
  </div>
  <div class="dcard mt14" style="border-left:3px solid var(--danger)">
    <div class="dh" style="color:var(--danger)">${icon('x',14)} 登录 / 退出登录</div>
    <div class="dm">当前账号：${esc(USER.name)}（${esc(USER.dept)} · ${esc(USER.title)}）· 登录于 本机</div>
    <button class="btn btn-danger btn-sm mt8" data-logout2>退出登录</button>
  </div>`;
}

/* ---- 面板交互 ---- */
function wirePane(el, k){
  if(k==='overview'){
    const gb=qs('[data-goto-balance]',el); if(gb) gb.addEventListener('click',()=>{ACCOUNT.pane='balance';renderAcctPane();qsa('[data-pane]').forEach(x=>x.classList.toggle('on',x.dataset.pane==='balance'));});
    const pl=qs('[data-plan]',el); if(pl) pl.addEventListener('click',planModal);
  }
  if(k==='balance'){
    qsa('.amt',el).forEach(a=>a.addEventListener('click',()=>{
      ACCOUNT.payAmount=+a.dataset.amt;
      qsa('.amt',el).forEach(x=>x.classList.toggle('on',x===a));
    }));
    qsa('input[name=paych]',el).forEach(r=>r.addEventListener('change',()=>ACCOUNT.payChannel=r.value));
    const ok=qs('#payOk',el); if(ok) ok.addEventListener('click',()=>{
      ACCOUNT.balance+=ACCOUNT.payAmount;
      ACCOUNT.ledger.unshift({t:'今天 '+nowT(),txt:'账户充值 · 加油站',amt:+ACCOUNT.payAmount});
      toast(`充值成功：¥ ${ACCOUNT.payAmount.toFixed(2)}（${ACCOUNT.payChannel==='alipay'?'支付宝':ACCOUNT.payChannel==='wx'?'微信支付':'对公转账'} · 演示）`,'ok');
      renderAcctPane();
    });
  }
  if(k==='settings'){
    qsa('[data-sw]',el).forEach(sw=>sw.addEventListener('click',()=>{
      const id=sw.dataset.sw; ACCOUNT.settings[id]=!ACCOUNT.settings[id];
      sw.classList.toggle('on',ACCOUNT.settings[id]);
      toast('设置已保存','ok');
    }));
    qsa('[data-sel]',el).forEach(s=>s.addEventListener('change',()=>{ACCOUNT.settings[s.dataset.sel]=s.value;toast('设置已保存','ok');}));
    const seg=qs('[data-seg="marketColor"]',el);
    qsa('button',seg).forEach(b=>b.addEventListener('click',()=>{
      ACCOUNT.settings.marketColor=b.dataset.v;
      qsa('button',seg).forEach(x=>x.classList.toggle('on',x===b));
      toast(b.dataset.v==='cn'?'涨跌配色：A 股惯例（涨红跌绿）':'涨跌配色：国际惯例（涨绿跌红）','ok');
    }));
  }
  if(k==='memory'){
    qsa('[data-msw]',el).forEach(sw=>sw.addEventListener('click',()=>{
      const id=sw.dataset.msw; ACCOUNT.memory[id]=!ACCOUNT.memory[id];
      sw.classList.toggle('on',ACCOUNT.memory[id]);
      if(id==='crossProject'&&ACCOUNT.memory[id]) toast('已开启跨项目沉淀：注意这可能弱化 Session 隔离','warn');
      else toast('记忆策略已更新','ok');
    }));
    const cm=qs('[data-clear-mem]',el);
    if(cm) cm.addEventListener('click',()=>{
      openModal({title:'清空当前项目记忆',
        body:`<p style="font-size:13px">将清空「${esc(projById(S.proj).name)}」的对话记忆与材料解析缓存（文件本身保留）。此操作不可撤销。</p>`,
        foot:`<button class="btn btn-ghost" data-close>取消</button><button class="btn btn-danger" id="cmOk">确认清空</button>`,
        onMount:(b,id)=>qs('#cmOk').addEventListener('click',()=>{closeModal(id);toast('当前项目记忆已清空','ok');})});
    });
  }
  if(k==='look'){
    const tseg=qs('[data-seg="theme"]',el);
    qsa('button',tseg).forEach(b=>b.addEventListener('click',()=>{ applyTheme(b.dataset.v); renderAcctPane(); }));
    qsa('[data-tp]',el).forEach(tp=>tp.addEventListener('click',()=>{ applyTheme(tp.dataset.tp); renderAcctPane(); }));
    const aseg=qs('[data-seg="accent"]',el);
    qsa('button',aseg).forEach(b=>b.addEventListener('click',()=>{ applyAccent(b.dataset.v); renderAcctPane(); }));
  }
  if(k==='about'){
    const cu=qs('#chkUpd',el);
    if(cu) cu.addEventListener('click',()=>{
      cu.disabled=true; cu.innerHTML=`<span class="spin" style="border-color:#9cc4e3;border-top-color:transparent"></span> 检查中…`;
      setTimeout(()=>{ cu.disabled=false; cu.innerHTML=icon('check',13)+' 已是最新版本'; toast('已是最新版本 '+ACCOUNT.version,'ok'); },1400);
    });
    qsa('[data-help]',el).forEach(h=>h.addEventListener('click',()=>{
      const m={手册:'使用手册已在浏览器新窗口打开（演示）',快捷键:'⌘K / Ctrl+K 全局搜索 · ⌘N 新建项目（演示）',反馈:'反馈通道已打开，感谢你的建议（演示）',状态:'全部 20 个 MCP 节点运行正常'};
      toast(m[h.dataset.help]||'已打开（演示）');
    }));
    const lo=qs('[data-logout2]',el); if(lo) lo.addEventListener('click',logoutConfirm);
  }
}
