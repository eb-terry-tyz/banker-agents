/* ============ 场景向导引擎 + 深度场景 ============ */

/* ---------- 调度日志模拟 ---------- */
function pipeline(box, calls, onDone){
  if(!box) return;
  box.style.display='block';
  box.innerHTML=`<div class="lh">${icon('zap',12)} 智能调度 · MCP 编排日志（用户无需配置任何 Key）</div>`;
  let i=0;
  const step=()=>{
    if(i>=calls.length){
      box.insertAdjacentHTML('beforeend',`<div class="log-line ok">${icon('check',12)} 编排完成 · 产物已回填工作台 <span class="lk">${nowT()}</span></div>`);
      box.scrollTop=1e4; useQuota(4+calls.length*2);
      if(onDone) onDone();
      return;
    }
    const c=calls[i++];
    const id='lg'+uid();
    box.insertAdjacentHTML('beforeend',`<div class="log-line" id="${id}"><span class="spin"></span><span>调用 ${esc(c[0])} · ${esc(c[1])}…</span></div>`);
    box.scrollTop=1e4;
    setTimeout(()=>{
      const el=document.getElementById(id);
      if(el) el.innerHTML=`${icon('check',12)}<span>${esc(c[0])} · ${esc(c[1])}</span><span class="lk">✓ ${(c[2]||0.8)}s · ${esc(c[3]||'完成')}</span>`;
      step();
    }, 550+Math.random()*650);
  };
  step();
}
const logboxHtml=()=>`<div class="logbox" id="wizLog" style="display:none"></div>`;
const getLog=()=>qs('#wizLog');

/* ---------- 向导引擎 ---------- */
function openWizard(leaf, path){
  const cfg = WIZ[leaf.wiz] || genericCfg(leaf);
  S.wiz = { leaf, path:path||leaf.label, cfg, step:0, ctx:{}, ready:cfg.steps.map(()=>false) };
  S.view='wizard';
  render();
}
function syncFoot(){
  const w=S.wiz; if(!w) return;
  const prev=qs('#wPrev'), next=qs('#wNext'); if(!prev) return;
  prev.disabled = w.step===0;
  const last = w.step===w.cfg.steps.length-1;
  next.disabled = !w.ready[w.step];
  next.innerHTML = last? icon('check',14)+'&nbsp;完成并退出' : '下一步&nbsp;'+icon('arrowR',14);
  const h=qs('#wHint'); if(h) h.innerHTML = w.cfg.steps[w.step].hint||'';
}
function renderWizard(main){
  const w=S.wiz; if(!w){ S.view='dash'; render(); return; }
  const leaf=w.leaf, mcpList=leaf.mcps.split(' · ');
  const steps=w.cfg.steps;
  main.innerHTML=`<div class="wrap" style="max-width:1060px">
    <div class="wiz-head">
      <div>
        <div class="path">${icon('zap',12)} ${esc(w.path)}</div>
        <h2>${esc(leaf.label)}</h2>
        <div class="desc">${esc(leaf.desc)}</div>
      </div>
      <div class="wiz-mcp">
        <div class="z">${icon('shieldC',13)} 零连接 · 平台已自动挂载 ${mcpList.length} 个 MCP，无需任何配置</div>
        <div class="chips">${mcpList.map(m=>`<span class="chip"><span class="lk">${icon('lock',10)}</span>${esc(m)}</span>`).join('')}</div>
      </div>
    </div>
    <div class="stepper" id="wizStepper"></div>
    <div class="wiz-body" id="wizBody"></div>
    <div class="wiz-foot">
      <button class="btn btn-ghost" id="wPrev">${icon('chevR',13)} 上一步</button>
      <span class="hint" id="wHint"></span>
      <button class="btn btn-pri" id="wNext">下一步</button>
    </div>
  </div>`;
  qs('#wizStepper').innerHTML = steps.map((s,i)=>
    `${i>0?`<span class="stp-line${i<=w.step?' done':''}"></span>`:''}
     <div class="stp${i===w.step?' act':i<w.step?' done':''}">
       <span class="n">${i<w.step?icon('check',12):i+1}</span><span class="t">${esc(s.t)}</span>
     </div>`).join('');
  qs('#wPrev').addEventListener('click',()=>{ if(w.step>0){w.step--; renderWizard(main);} });
  qs('#wNext').addEventListener('click',()=>{
    if(!w.ready[w.step]) return;
    if(w.step===steps.length-1){ S.wiz=null; S.dir=''; S.view='files'; render(); toast('场景执行完毕，产物已归入项目','ok'); }
    else { w.step++; renderWizard(main); }
  });
  const api={
    ctx:w.ctx,
    setReady(b){ w.ready[w.step]=b; syncFoot(); },
    finish(b){ const last=w.step===steps.length-1; w.ready[w.step]=b; syncFoot(); },
  };
  steps[w.step].body(qs('#wizBody'), api, main);
  syncFoot();
}
const stepHead=(t,d)=>`<div class="step-t">${icon('chevR',13)}${esc(t)}</div><div class="step-d">${esc(d)}</div>`;
const runZone=(label)=>`<div class="run-zone"><button class="btn btn-blue" data-run>${icon('zap',14)} ${esc(label)}</button></div>${logboxHtml()}<div class="result-zone" id="wizRes" style="display:none"></div>`;
const bindRun=(root,api,calls,onDone,label)=>{
  const btn=qs('[data-run]',root);
  btn.addEventListener('click',()=>{
    btn.disabled=true; btn.innerHTML=`<span class="spin" style="border-color:#9cc4e3;border-top-color:transparent"></span> 执行中…`;
    api.setReady(false);
    pipeline(getLog(), calls, ()=>{
      btn.disabled=false; btn.innerHTML=icon('refresh',14)+' 重新执行';
      qs('#wizRes',root).style.display='block';
      if(onDone) onDone(qs('#wizRes',root));
      api.setReady(true);
    });
  });
};

/* ---------- 雷达图 ---------- */
function radar(labels, vals){
  const cx=110, cy=98, R=72;
  const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/labels.length; return [cx+r*Math.cos(a), cy+r*Math.sin(a)];};
  const ring=f=>`<polygon points="${labels.map((_,i)=>pt(i,R*f).join(',')).join(' ')}" fill="none" stroke="var(--radar-grid)"/>`;
  const poly=vals.map((v,i)=>pt(i,R*Math.min(100,v)/100).join(',')).join(' ');
  const labs=labels.map((l,i)=>{const [x,y]=pt(i,R+17);return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="var(--radar-label)">${l}</text>`;}).join('');
  const dots=vals.map((v,i)=>{const [x,y]=pt(i,R*Math.min(100,v)/100);return `<circle cx="${x}" cy="${y}" r="3.2" fill="var(--accent-2)"/>`;}).join('');
  return `<svg width="222" height="200" viewBox="0 0 222 200">${[1,.66,.33].map(ring).join('')}<polygon points="${poly}" fill="var(--radar-fill)" stroke="var(--accent-2)" stroke-width="2"/>${dots}${labs}</svg>`;
}

/* ============ 场景 A · 招股说明书智能撰写 ============ */
const SAMPLE_DOCS=[
  {n:'审计报告 2022-2024.pdf', m:'42 页 · 126 个数据点 · 逐科目结构化'},
  {n:'法律尽调报告.docx', m:'18 章节 · 关联方 12 家 · 诉讼 0 起'},
  {n:'工商档案（启衡科技）.pdf', m:'股权结构 4 层 · 董监高 9 人'},
  {n:'业务与技术资料.pptx', m:'产品线 5 条 · 客户 23 家结构化'},
];
const WIZ_PROSPECTUS={
  steps:[
  { t:'上传材料', hint:'TextIn xParse 自动解析 PDF / 扫描件为结构化数据',
    body(el,api){
      el.innerHTML=stepHead('① 上传拟上市公司材料','拖拽导入审计报告 / 法律尽调 / 业务资料 / 工商档案，解析后数据点可逐科目追溯。')
        +`<div class="dropzone" id="pzDrop">${icon('upload',20)}<div class="mt8">拖拽材料到此处，或 <b>点击选择</b>（支持 pdf / word / ppt / 扫描件）</div></div>
          <div class="mt14" style="text-align:center"><button class="btn btn-ghost btn-sm" id="pzDemo">${icon('db',13)} 载入示例材料（启衡科技 IPO）</button></div>
          ${logboxHtml()}<div class="result-zone" id="wizRes" style="display:none"></div>`;
      el.querySelector('#pzDrop').addEventListener('click',()=>el.querySelector('#pzDemo').click());
      el.querySelector('#pzDemo').addEventListener('click',()=>{
        api.ctx.docs=SAMPLE_DOCS;
        pipeline(getLog(),[
          ['TextIn xParse','pdf.parse · 审计报告','2.1','42 页 / 126 数据点'],
          ['TextIn xParse','docx.parse · 法律尽调','1.4','18 章节'],
          ['TextIn xParse','pdf.parse · 工商档案','1.8','股权 4 层'],
          ['TextIn xParse','pptx.parse · 业务资料','0.9','5 条产品线'],
        ],()=>{
          qs('#wizRes',el).style.display='block';
          qs('#wizRes',el).innerHTML=`<div class="parsed-list">${SAMPLE_DOCS.map(d=>`
            <div class="pl">${fic(d.n)}<div><span class="pn">${esc(d.n)}</span><span class="pm" style="display:block">${esc(d.m)}</span></div>
            <span class="rt tag t-on">${icon('check',10)} 已解析</span></div>`).join('')}
            <p class="muted small mt8">${icon('db',11)} 解析结果已写入项目 Session，仅当前项目可见。</p></div>`;
          api.setReady(true);
        });
        api.setReady(false);
      });
    }},
  { t:'行业分类', hint:'行业分类引擎默认输出三套分类，可手动修正并反哺引擎',
    body(el,api){
      el.innerHTML=stepHead('② 行业分类','不先定行业就无法拉可比。引擎输入公司名 + 主营，输出三套行业归类与置信度。')
        +`<div class="grid2 mb14">
            <div class="dcard"><div class="dh">公司名称</div><div class="dm"><b>启衡科技（江苏）股份有限公司</b></div></div>
            <div class="dcard"><div class="dh">主营业务</div><div class="dm">半导体前道核心设备 PECVD / ALD 的研发、生产与销售</div></div>
          </div>`
        +runZone('运行行业分类引擎')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['行业分类引擎','classify(申万 / 中证 / GBICS)','1.6','三套归类 + 置信度'],
        ['企查查','getBusinessScope','0.7','主营交叉验证'],
      ],res=>{
        res.innerHTML=`<div style="display:flex;gap:12px;flex-wrap:wrap">
          ${[['申万行业','电子 — 半导体设备',92],['中证行业','半导体',89],['GBICS','信息技术 — 半导体设备与材料',87]].map(c=>`
          <div class="classcard"><div class="sys">${c[0]}</div><div class="v">${c[1]}</div>
          <div class="muted small">置信度 ${c[2]}%</div><div class="classbar"><i style="width:${c[2]}%"></i></div></div>`).join('')}
        </div>
        <div class="mt14"><label class="inp-lab">归类修正（可选，修正结果将反哺引擎）</label>
        <select class="inp" style="width:100%"><option>维持引擎归类：电子 — 半导体设备（推荐）</option><option>电子 — 半导体材料</option><option>机械 — 专用设备</option><option>手动输入其他行业…</option></select></div>`;
        api.ctx.industry='电子 — 半导体设备';
      });
    }},
  { t:'拉可比招股书', hint:'章节级结构抽取，差异可定位到段落',
    body(el,api){
      el.innerHTML=stepHead('③ 检索同行业可比招股书','按行业 + 板块 + 时间检索近期已上市招股书，抽取章节结构用于对比与模板对齐。')
        +`<div class="fchips" style="margin-bottom:10px">
            <span class="fchip on">板块：科创板</span><span class="fchip">板块：全部</span>
            <span class="fchip on">时间：近 24 个月</span><span class="fchip">含创业板</span></div>`
        +runZone('检索并解析可比招股书')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      qsa('.fchip',el).forEach(c=>c.addEventListener('click',()=>c.classList.toggle('on')));
      const comps=[
        ['华海清科','688120.SH','2022-06','36.6 亿','92%'],
        ['拓荆科技','688072.SH','2022-04','28.1 亿','90%'],
        ['中微公司（注册稿对比）','688012.SH','2019-07','—','81%'],
        ['微导纳米','688147.SH','2023-01','15.8 亿','88%'],
        ['精智达','688627.SH','2023-07','11.2 亿','76%'],
      ];
      bindRun(el,api,[
        ['巨潮资讯','searchProspectus(行业=半导体设备)','1.9','命中 5 份'],
        ['TextIn xParse','prospectus.parse ×5','4.2','章节结构抽取完成'],
        ['文因互联','structure.align','1.1','相似度打分'],
      ],res=>{
        res.innerHTML=`<table class="tbl"><thead><tr><th style="width:36px"></th><th>公司</th><th>代码</th><th>上市 / 注册</th><th>募资额</th><th>章节结构相似度</th></tr></thead>
        <tbody>${comps.map((c,i)=>`<tr class="comp-row"><td><input type="checkbox" ${i<3?'checked':''}></td><td><b>${c[0]}</b></td><td class="muted">${c[1]}</td><td class="muted">${c[2]}</td><td class="muted num">${c[3]}</td><td><b style="color:var(--navy)">${c[4]}</b></td></tr>`).join('')}</tbody></table>
        <p class="muted small mt8">${icon('db',11)} 每条对比将标注来源招股书 + 章节页码，可直接跳转原文。</p>`;
        api.ctx.comps=3;
      });
    }},
  { t:'生成初稿', hint:'文因互联按模板分章节生成，数据回填自审计材料，逐点标注来源',
    body(el,api){
      el.innerHTML=stepHead('④ 生成招股书初稿','按交易所模板分章节生成，财务数据自动回填自解析后的审计报告。')
        +runZone('开始生成初稿（约 1–2 分钟）')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      const chapters=['释义与重大事项提示','概览','本次发行概况','风险因素','发行人基本情况','业务与技术','同业竞争与关联交易','财务会计信息与管理层分析','募股资金运用'];
      bindRun(el,api,[
        ['文因互联','prospectus.init(模板=科创板)','0.8','章节树加载'],
        ...chapters.map((c,i)=>['文因互联',`generateChapter(${i+1}/${chapters.length}) · ${c}`,'1.2'+i%3,'完成']),
        ['企查查','getShareholders','0.6','股本结构回填'],
        ['质检引擎','source.annotate','1.4','126 个数据点标注来源'],
      ],res=>{
        res.innerHTML=`<div class="parsed-list">
          ${chapters.map(c=>`<div class="chap"><span class="ck">${icon('check',13)}</span>${c}<span class="cw">已生成 · 数据已回填</span></div>`).join('')}
        </div>
        <div class="dcard mt14" style="border-left:4px solid var(--green)">
          <div class="dh">${icon('doc',15)} 启衡科技招股说明书（初稿）.docx</div>
          <div class="dm">9 章 · 48,632 字 · 126 个数据点全部标注来源 · 已自动存入「招股书」文件夹（待审状态）</div>
        </div>`;
        api.ctx.doc='启衡科技招股说明书（初稿）.docx';
      });
    }},
  { t:'排版质检', hint:'质检引擎：章节层级 / 页眉页脚 / 字号 / 图表编号 / 数据一致性',
    body(el,api){
      el.innerHTML=stepHead('⑤ 排版与文法质检','对标交易所申报文件规范，逐项检查排版与数据一致性。')
        +runZone('运行质检引擎')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['质检引擎','layout.check · 章节层级 / 页眉页脚 / 字号','1.7','问题 5 处'],
        ['质检引擎','punct.check · 全半角 / 标点','0.9','混用 13 处'],
        ['TextIn xParse','diff(招股书 vs 审计报告)','2.6','差异 2 处'],
        ['北大法宝','cite.check · 法规引用版本','1.2','全部有效'],
      ],res=>{
        res.innerHTML=`
        <div class="iss must">${icon('warn',14)}<div><b>【必改】数据一致性：营业收入 2024</b><div>招股书 48,215.6 万元 vs 审计报告 48,207.3 万元，差异 8.3 万元 —— 定位：第八章第二节表 8-2</div></div></div>
        <div class="iss sug">${icon('edit',14)}<div><b>【建议】目录交叉引用 2 处跳号</b><div>图 4-3 后直接图 4-5；表 6-2 引用指向表 6-4</div></div></div>
        <div class="iss sug">${icon('edit',14)}<div><b>【建议】全半角标点混用 13 处</b><div>集中在第四、七章，括号与逗号全半角不一致</div></div></div>
        <div class="iss sug">${icon('edit',14)}<div><b>【建议】术语统一</b><div>「子公司 / 附属公司」混用 6 处，建议统一为「子公司」</div></div></div>
        <div class="iss tip">${icon('check',14)}<div><b>【提示】其余 5 项提示级问题</b><div>图表编号格式、页眉分隔符、字号层级等，不影响申报</div></div></div>
        <p class="muted small mt8">${icon('db',11)} 问题清单支持一键定位到段落后修改；必改项修复后方可送审。</p>`;
      });
    }},
  { t:'人审归档', hint:'人审不可绕过：申报类产物须持牌人确认签字后落盘',
    body(el,api){
      el.innerHTML=stepHead('⑥ 提交人审','初稿与质检报告将进入「待审队列」，由持牌保荐代表人确认签字后正式归档。')
        +`<div class="dcard" style="border-left:4px solid var(--gold)">
            <div class="dh">${icon('shieldC',15)} 送审摘要</div>
            <div class="dm">
              产物：《启衡科技招股说明书（初稿）.docx》+《排版质检报告》<br>
              场景链路：上传材料 → 行业分类（电子—半导体设备 92%）→ 可比招股书 3 份 → 9 章初稿 → 质检（必改 1 / 建议 3 / 提示 5）<br>
              MCP 调用：TextIn xParse · 巨潮资讯 · 文因互联 · 企查查 · 北大法宝（全程留痕）
            </div>
          </div>
          <div class="mt14" style="display:flex;gap:10px">
            <button class="btn btn-pri" id="pzSubmit">${icon('shieldC',14)} 提交待审队列</button>
            <button class="btn btn-ghost" id="pzSave">暂存草稿</button>
          </div>
          <div class="result-zone" id="wizRes" style="display:none"></div>`;
      api.setReady(true);
      el.querySelector('#pzSubmit').addEventListener('click',()=>{
        S.reviews.unshift({id:'r'+uid(),name:'启衡科技招股说明书（初稿 v2）.docx',ext:'docx',scenario:'招股说明书智能撰写',proj:S.proj,time:today(),
          mcps:['文因互联','TextIn xParse','企查查'],diff:'必改 1 处已标注（营业收入 2024 差异）；建议 3 / 提示 5；126 个数据点来源已核。'});
        renderTopbar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>已进入待审队列</b><div>可在顶栏「待审队列」完成持牌人签核；签核后自动落入项目「招股书」文件夹。</div></div></div>`;
        toast('已提交待审队列，等待持牌人确认','ok');
        api.setReady(true);
      });
      el.querySelector('#pzSave').addEventListener('click',()=>{
        S.files[S.proj].push({dir:'招股书',name:'启衡科技招股说明书（初稿 v2）.docx',size:'2.4 MB',time:today(),status:'draft',ver:'v4',from:'场景 · 招股书撰写'});
        renderSidebar(); toast('已暂存草稿至「招股书」文件夹','ok');
      });
    }},
]};
