/* ============ 场景 B 审校 / C 日报 / 财务分析 / 估值 / 通用 ============ */

/* ---------- 场景 B · 招股书审校质检 ---------- */
const WIZ_QC={
  steps:[
  { t:'导入', hint:'TextIn 解析待审招股书与原始材料',
    body(el,api){
      el.innerHTML=stepHead('① 导入待审文件','上传待审招股书 + 原始材料（审计报告 / 法律意见书 / 工商档案），系统自动建立比对基准。')
        +`<div class="grid2 mb14">
            <div class="dropzone" style="padding:22px">${icon('doc',20)}<div class="mt8"><b>待审招股书</b></div><div class="small">招股说明书（初稿）.docx</div></div>
            <div class="dropzone" style="padding:22px">${icon('folder',20)}<div class="mt8"><b>原始材料包</b></div><div class="small">审计报告 / 法律意见书 / 工商档案</div></div>
          </div>
          <div style="text-align:center"><button class="btn btn-blue" data-run>${icon('zap',14)} 解析并建立比对基准</button></div>
          ${logboxHtml()}<div class="result-zone" id="wizRes" style="display:none"></div>`;
      const btn=qs('[data-run]',el);
      btn.addEventListener('click',()=>{
        btn.disabled=true; api.setReady(false);
        pipeline(getLog(),[
          ['TextIn xParse','docx.parse · 招股书','1.6','9 章 / 48,632 字'],
          ['TextIn xParse','pdf.parse · 审计报告','2.0','126 数据点'],
          ['TextIn xParse','docx.parse · 法律意见书','1.3','关联方 12 家'],
          ['质检引擎','baseline.build','0.8','比对基准就绪'],
        ],()=>{
          qs('#wizRes',el).style.display='block';
          qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>比对基准已建立</b><div>3 份原始材料结构化完成，共 189 个可比对项</div></div></div>`;
          api.setReady(true);
        });
      });
    }},
  { t:'阅读汇总', hint:'分章节摘要 + 风险点 + 潜在遗漏',
    body(el,api){
      el.innerHTML=stepHead('② 阅读汇总','对招股书全文做分章节摘要、关键数据提取与遗漏扫描。')
        +runZone('生成阅读汇总')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['文因互联','summary.byChapter ×9','2.4','摘要完成'],
        ['文因互联','risk.extract','1.5','风险点 7 项'],
        ['质检引擎','omission.scan','1.1','潜在遗漏 2 项'],
      ],res=>{
        res.innerHTML=`<table class="tbl"><thead><tr><th>章节</th><th>摘要要点</th><th>关键数据</th></tr></thead><tbody>
        <tr><td><b>业务与技术</b></td><td class="muted">PECVD/ALD 双产品线，12 英寸占比提升至 68%</td><td class="muted">在手订单 9.8 亿</td></tr>
        <tr><td><b>风险因素</b></td><td class="muted">客户集中、技术迭代、存货减值三大风险披露充分</td><td class="muted">前五客户 61.3%</td></tr>
        <tr><td><b>财务会计信息</b></td><td class="muted">三年一期营收 CAGR 24.3%，经营现金流为正</td><td class="muted">营收 48,207.3 万</td></tr>
        <tr><td><b>募集资金运用</b></td><td class="muted">两个募投项目，其中二期扩产 8.4 亿</td><td class="muted">总募投 12.0 亿</td></tr>
        </tbody></table>
        <div class="iss warn" style="background:var(--gold-soft);color:#8a6d08;margin-top:10px">${icon('warn',14)}<div><b>潜在遗漏提示</b><div>① 未披露报告期后事项（9 月新增专利 3 项）；② 募投项目环评批复文号未列示</div></div></div>`;
      });
    }},
  { t:'差异比对', hint:'财务 / 股权 / 关联方 / 诉讼 / 知产 与原始件逐项比对',
    body(el,api){
      el.innerHTML=stepHead('③ 与原始材料差异比对','招股书数据逐项回对审计报告、法律意见书与工商档案。')
        +runZone('运行差异比对')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['质检引擎','diff(财务 vs 审计报告)','2.8','差异 2 处'],
        ['企查查','diff(股权 vs 工商档案)','1.2','一致'],
        ['质检引擎','diff(关联方 vs 法律意见书)','1.9','差异 1 处'],
        ['智慧芽','patent.check','0.9','专利 47 项一致'],
      ],res=>{
        res.innerHTML=`<table class="tbl"><thead><tr><th>比对项</th><th>招股书</th><th>原始材料</th><th>结论</th></tr></thead><tbody>
        <tr><td><b>营业收入 2024</b></td><td>48,215.6 万</td><td>48,207.3 万（审计）</td><td><span class="tag t-eq">差异 8.3 万 · 必改</span></td></tr>
        <tr><td><b>应收账款周转率</b></td><td>2.35</td><td>2.31（审计附注）</td><td><span class="tag t-eq">口径不一致 · 必改</span></td></tr>
        <tr><td>股本结构</td><td>12,000 万股</td><td>12,000 万股（工商）</td><td><span class="tag t-on">一致</span></td></tr>
        <tr><td><b>关联方家数</b></td><td>11 家</td><td>12 家（法律意见书）</td><td><span class="tag t-pe">漏 1 家 · 建议核实</span></td></tr>
        <tr><td>专利清单</td><td>47 项</td><td>47 项（智慧芽）</td><td><span class="tag t-on">一致</span></td></tr>
        </tbody></table>`;
      });
    }},
  { t:'文法质检', hint:'全半角 / 错别字 / 长难句 / 术语一致性 / 引用规范',
    body(el,api){
      el.innerHTML=stepHead('④ 标点文法与引用检查','按申报文件文风规范执行标点、文法与法规引用检查。')
        +runZone('运行文法质检')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['质检引擎','punct.check','0.9','全半角混用 13'],
        ['质检引擎','grammar.check','1.8','长难句 4 / 错别字 1'],
        ['质检引擎','term.consistency','1.2','术语不一致 2 组'],
        ['北大法宝','cite.check(法规版本)','1.4','引用 38 条全部有效'],
      ],res=>{
        res.innerHTML=`
        <div class="iss must">${icon('warn',14)}<div><b>【必改】错别字 1 处</b><div>第六章「辐(幅)度较大的波动」— P112</div></div></div>
        <div class="iss sug">${icon('edit',14)}<div><b>【建议】全半角标点混用 13 处</b><div>括号、逗号全半角混用，集中于第四、七章</div></div></div>
        <div class="iss sug">${icon('edit',14)}<div><b>【建议】长难句 4 处（>80 字）</b><div>第四章风险披露 2 处、第七章 2 处，建议拆分</div></div></div>
        <div class="iss tip">${icon('check',14)}<div><b>【提示】术语统一建议</b><div>「子公司/附属公司」「客户 A / A 客户」各混用若干处</div></div></div>`;
      });
    }},
  { t:'审校报告', hint:'分级问题清单，可一键定位修改',
    body(el,api){
      el.innerHTML=stepHead('⑤ 生成分级审校报告','必改 / 建议 / 提示三级问题清单，全部带原文定位。')
        +`<div class="grid2">
            ${[['必改','3','var(--red)','数据差异 2 + 错别字 1'],['建议','7','var(--gold)','引用跳号 / 长难句 / 术语'],['提示','9','#93a3b4','格式与体例优化']].map(x=>`
            <div class="dcard" style="border-left:4px solid ${x[2]}"><div class="dh">${x[0]} <b style="font-size:20px;color:${x[2]}">${x[1]}</b> 项</div><div class="dm">${x[3]}</div></div>`).join('')}
          </div>
          <div class="mt14" style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-ghost" id="qcExp">${icon('download',14)} 导出审校报告</button>
            <button class="btn btn-pri" id="qcSub">${icon('shieldC',14)} 送审（连同问题清单）</button>
          </div>
          <div class="result-zone" id="wizRes" style="display:none"></div>`;
      api.setReady(true);
      el.querySelector('#qcExp').addEventListener('click',()=>toast('《招股书审校报告 0923.pdf》已导出至产物中心','ok'));
      el.querySelector('#qcSub').addEventListener('click',()=>{
        if(S.reviews.some(r=>r.scenario==='招股书审校质检')){ toast('审校报告已在待审队列','warn'); return; }
        S.reviews.unshift({id:'r'+uid(),name:'招股书审校报告 0923.pdf',ext:'pdf',scenario:'招股书审校质检',proj:S.proj,time:today(),
          mcps:['TextIn xParse','质检引擎','北大法宝'],diff:'必改 3 / 建议 7 / 提示 9；差异项已定位至章节页码。'});
        renderTopbar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>已送审</b><div>审校报告进入待审队列，签核后归档至项目文件夹。</div></div></div>`;
        toast('审校报告已送审','ok');
      });
    }},
]};

/* ---------- 场景 C · 资本市场日报 ---------- */
const WIZ_DAILY={
  steps:[
  { t:'选模板', hint:'模板各数据格标注期望数据，支持上传自定义模板',
    body(el,api){
      el.innerHTML=stepHead('① 选择日报模板','模板引擎按数据格自动寻源；也可上传团队惯用模板。')
        +`<div class="grid2">
            <label class="opt on" data-tpl="A股资本市场日报"><input type="radio" name="tpl" checked><div><b>A 股资本市场日报</b><p>指数 / 北向 / 板块 / 成交额 / IPO 表现 —— ECM 每天第一件事</p></div></label>
            <label class="opt" data-tpl="银行间债市日报"><input type="radio" name="tpl"><div><b>银行间债市日报</b><p>资金面 / 回购利率 / 现券成交 / 收益率曲线 / 信用利差</p></div></label>
          </div>
          <div class="dropzone mt14" style="padding:18px">${icon('upload',16)} 上传自定义日报模板（html / xlsx）— 每格可标注期望数据源</div>`;
      qsa('[data-tpl]',el).forEach(o=>o.addEventListener('click',()=>{
        qsa('[data-tpl]',el).forEach(x=>{x.classList.remove('on');x.querySelector('input').checked=false;});
        o.classList.add('on'); o.querySelector('input').checked=true;
        api.ctx.tpl=o.dataset.tpl; api.setReady(true);
      }));
      api.ctx.tpl='A股资本市场日报'; api.setReady(true);
    }},
  { t:'寻源', hint:'寻源提示器按数据类型自动匹配 MCP，缺失时给出替代路径',
    body(el,api){
      el.innerHTML=stepHead('② 自动寻源','按模板数据格逐一匹配数据源；当前投行版套餐可直接编排。')
        +runZone('运行寻源提示器')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['寻源提示器','match(指数 → westock)','0.4','匹配'],
        ['寻源提示器','match(北向 → Wind)','0.4','匹配'],
        ['寻源提示器','match(IPO 排队 → 巨潮资讯)','0.5','匹配'],
        ['寻源提示器','match(私募排排净值)','0.3','无匹配 ⚠'],
        ['寻源提示器','match(同业询价记录)','0.3','无匹配 ⚠'],
      ],res=>{
        res.innerHTML=`<table class="tbl"><thead><tr><th>模板数据格</th><th>匹配数据源</th><th>状态</th></tr></thead><tbody>
        <tr><td>A 股指数 / 板块 / 成交额</td><td><span class="chip">${icon('db',9)} westock / Wind / 通达信</span></td><td><span class="tag t-on">已就绪</span></td></tr>
        <tr><td>北向资金</td><td><span class="chip">${icon('db',9)} Wind</span></td><td><span class="tag t-on">已就绪</span></td></tr>
        <tr><td>IPO 在审 / 过会率</td><td><span class="chip">${icon('db',9)} 巨潮资讯 + westock</span></td><td><span class="tag t-on">已就绪</span></td></tr>
        <tr><td><b>私募排排 · 私募净值指数</b></td><td class="muted">套餐内无匹配源</td><td><span class="tag t-off">缺源</span></td></tr>
        <tr><td><b>同业询价记录</b></td><td class="muted">内部系统数据</td><td><span class="tag t-off">缺源</span></td></tr>
        </tbody></table>`;
      });
    }},
  { t:'缺源处理', hint:'缺源不阻断：升级 / 按次付费 / 上传本地数据 / 跳过',
    body(el,api){
      el.innerHTML=stepHead('③ 处理 2 个缺源数据格','寻源提示器不是报错，而是告诉你缺什么、可以怎么补。')
        +`<div class="dcard mb14"><div class="dh">${icon('warn',14)} 缺源 1 · 私募排排净值指数</div>
          <div class="mt8">
            <label class="opt" style="margin-bottom:7px"><input type="radio" name="g1" value="up" checked><div><b>上传今日 CSV / Excel</b><p>上传后该格自动回填并保留时点标注</p></div></label>
            <label class="opt" style="margin-bottom:7px"><input type="radio" name="g1" value="pay"><div><b>按次付费解锁 ¥8 / 次</b><p>从私募排排数据源单次取数</p></div></label>
            <label class="opt"><input type="radio" name="g1" value="skip"><div><b>暂时跳过该格</b><p>日报中该格显示「数据待补」</p></div></label>
          </div></div>
          <div class="dcard"><div class="dh">${icon('warn',14)} 缺源 2 · 同业询价记录</div>
          <div class="mt8">
            <label class="opt" style="margin-bottom:7px"><input type="radio" name="g2" value="up"><div><b>上传本地文件</b><p>导出内部询价系统记录后上传</p></div></label>
            <label class="opt" style="margin-bottom:7px"><input type="radio" name="g2" value="skip" checked><div><b>暂时跳过该格</b><p>明日再补，不影响其他数据格生成</p></div></label>
          </div></div>
          <div class="mt14"><button class="btn btn-blue" id="gOk">${icon('check',14)} 应用并继续</button></div>
          <div class="result-zone" id="wizRes" style="display:none"></div>`;
      el.querySelector('#gOk').addEventListener('click',()=>{
        const g1=qs('input[name="g1"]:checked',el).value, g2=qs('input[name="g2"]:checked',el).value;
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>缺源处理完成</b><div>私募净值：${g1==='up'?'已接收上传文件（模拟）· 自动回填':g1==='pay'?'已按次付费解锁（模拟 ¥8）':'跳过，标记待补'}；同业询价：${g2==='up'?'已接收上传文件（模拟）':'跳过，标记待补'}</div></div></div>`;
        api.setReady(true);
      });
      api.setReady(false);
    }},
  { t:'回填预览', hint:'涨红跌绿（A 股惯例），每格附数据时点',
    body(el,api){
      el.innerHTML=stepHead('④ 模板回填预览','模板引擎按格回填，配色遵循中国市场惯例（可按项目切换）。')
        +runZone('回填模板并校验时点')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['westock','getIndex · 上证/深成/创业板/科创50','0.8','4 组'],
        ['Wind','getNorthFlow','0.6','+37.2 亿'],
        ['巨潮资讯','getIPOReview · 今日上会','0.9','3 家 2 过'],
        ['模板引擎','fill(cells ×18)','0.5','18/18 格回填'],
      ],res=>{
        res.innerHTML=`<table class="tbl daily-tbl"><thead><tr><th>指标</th><th class="num">数值</th><th class="num">涨跌</th><th>时点</th></tr></thead><tbody>
        <tr><td>上证指数</td><td class="num"><b>3,247.32</b></td><td class="num up">▲ +0.58%</td><td class="muted">15:00 收盘</td></tr>
        <tr><td>深证成指</td><td class="num"><b>10,481.66</b></td><td class="num up">▲ +0.71%</td><td class="muted">15:00 收盘</td></tr>
        <tr><td>创业板指</td><td class="num"><b>2,156.09</b></td><td class="num down">▼ -0.12%</td><td class="muted">15:00 收盘</td></tr>
        <tr><td>科创 50</td><td class="num"><b>986.44</b></td><td class="num up">▲ +1.02%</td><td class="muted">15:00 收盘</td></tr>
        <tr><td>北向资金净流入</td><td class="num"><b>+37.2 亿</b></td><td class="num up">▲ 连续 3 日净流入</td><td class="muted">Wind 15:05</td></tr>
        <tr><td>两市成交额</td><td class="num"><b>9,591 亿</b></td><td class="num">环比 +6.2%</td><td class="muted">15:00</td></tr>
        <tr><td>IPO 审核</td><td colspan="2">3 家上会 · <b>2 家过会</b> · 过会率 66.7%</td><td class="muted">巨潮 16:10</td></tr>
        <tr><td>私募净值指数（缺源）</td><td colspan="2" class="muted">数据待补</td><td class="muted">—</td></tr>
        </tbody></table>
        <p class="muted small mt8">${icon('db',11)} 每格标注数据源与时点；日报为内部产物，无需人审，直接归档。</p>`;
      });
    }},
  { t:'定时生成', hint:'可设每日盘后定时刷新，新日报自动落入项目文件夹',
    body(el,api){
      el.innerHTML=stepHead('⑤ 归档与定时','生成今日日报并归入项目「日报」文件夹；可开启每交易日自动生成。')
        +`<label class="opt on mb14" id="dCron" style="cursor:pointer"><input type="checkbox" checked id="dCronBox"><div><b>每交易日 17:30 自动生成并归档</b><p>盘后数据齐备后自动跑全流程，缺源自动沿用本页设置</p></div></label>
          <div style="display:flex;gap:10px"><button class="btn btn-pri" id="dGen">${icon('zap',14)} 生成今日日报并归档</button></div>
          <div class="result-zone" id="wizRes" style="display:none"></div>`;
      el.querySelector('#dCronBox').addEventListener('change',e=>{
        el.querySelector('#dCron').classList.toggle('on', e.target.checked);
      });
      api.setReady(true);
      el.querySelector('#dGen').addEventListener('click',()=>{
        const cron=el.querySelector('#dCronBox').checked;
        const name=`资本市场日报 2026-09-23.html`;
        if(!S.files[S.proj].some(f=>f.name===name))
          S.files[S.proj].push({dir:'日报',name,size:'86 KB',time:today(),status:'ok',ver:'v1',from:cron?'定时 · 资本市场日报':'场景 · 资本市场日报',content:'上证 北向 IPO 过会'});
        S.artifacts.unshift({id:'a'+uid(),name,ext:'html',proj:S.proj,scen:'资本市场日报（自动）',mcps:['westock','Wind','巨潮资讯'],time:today(),size:'86 KB'});
        if(cron && !TASKS.some(t=>t.name==='资本市场日报')) TASKS.unshift({id:'t'+uid(),name:'资本市场日报',cron:'每交易日 17:30',on:true,next:'明日 17:30',proj:S.proj});
        renderSidebar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>日报已归档</b><div>文件落入「${esc(projById(S.proj).name)} / 日报」${cron?'，定时任务已开启（每交易日 17:30）':''}。</div></div></div>`;
        toast('日报已生成并归档','ok');
      });
    }},
]};

/* ---------- 财务分析 ---------- */
const WIZ_FIN={
  steps:[
  { t:'取数', hint:'上传审计报告或按代码从聚源 / Wind 拉取三年一期标准财报',
    body(el,api){
      el.innerHTML=stepHead('① 取数','从数据库直接拉取，或解析已上传的审计报告 —— 数据可追溯至报表科目。')
        +`<div class="grid2 mb14">
          <label class="opt on" style="cursor:pointer"><input type="radio" name="src" checked><div><b>按证券代码拉取</b><p>启衡科技（拟上市）· 三年一期 · 聚源 / Wind</p></div></label>
          <label class="opt" style="cursor:pointer"><input type="radio" name="src"><div><b>上传审计报告取数</b><p>沿用项目内已解析的《审计报告 2022-2024.pdf》（126 数据点）</p></div></label>
          </div>`
        +runZone('拉取三年一期财报')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      qsa('input[name="src"]',el).forEach(r=>r.addEventListener('change',()=>{
        qsa('.opt',el).forEach(o=>o.classList.remove('on'));
        r.closest('.opt').classList.add('on');
      }));
      bindRun(el,api,[
        ['恒生聚源','finstat.pull(三年一期)','1.6','52 张报表'],
        ['Wind','finstat.verify','0.9','与聚源交叉核验一致'],
      ],res=>{
        res.innerHTML=`<table class="tbl"><thead><tr><th>科目</th><th class="num">2022</th><th class="num">2023</th><th class="num">2024</th><th class="num">2025H1</th></tr></thead><tbody>
        <tr><td>营业收入（万元）</td><td class="num">31,204.5</td><td class="num">39,876.1</td><td class="num">48,207.3</td><td class="num">28,614.8</td></tr>
        <tr><td>归母净利润（万元）</td><td class="num">5,102.4</td><td class="num">7,488.9</td><td class="num">9,842.6</td><td class="num">6,077.2</td></tr>
        <tr><td>毛利率</td><td class="num">36.8%</td><td class="num">39.5%</td><td class="num">41.2%</td><td class="num">42.6%</td></tr>
        <tr><td>经营现金流（万元）</td><td class="num">3,341.2</td><td class="num">6,052.8</td><td class="num">8,901.4</td><td class="num">4,410.6</td></tr>
        </tbody></table>`;
      });
    }},
  { t:'计算指标', hint:'五大维度全自动计算 + 杜邦三因素拆解',
    body(el,api){
      el.innerHTML=stepHead('② 五大维度指标计算','盈利 / 营运 / 偿债 / 成长 / 现金流全套指标 + ROE 杜邦拆解。')
        +runZone('计算指标与杜邦拆解')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['计算引擎','ratios.calc(盈利/营运/偿债/成长/现金流)','1.2','38 项指标'],
        ['计算引擎','dupont.roe 三因素','0.8','净利率 × 周转 × 权益乘数'],
      ],res=>{
        res.innerHTML=`<div class="radar-wrap">
          ${radar(['盈利','营运','偿债','成长','现金流'],[82,58,71,88,64])}
          <div style="flex:1;min-width:280px">
          <table class="tbl"><thead><tr><th>维度</th><th>核心指标</th><th class="num">2024</th><th class="num">行业中位</th></tr></thead><tbody>
          <tr><td>盈利</td><td>ROE / 毛利率</td><td class="num"><b>26.8% / 41.2%</b></td><td class="num muted">18.2% / 34.8%</td></tr>
          <tr><td>营运</td><td>应收周转 / 存货周转</td><td class="num"><b>2.31 / 1.42</b></td><td class="num muted">3.42 / 2.15</td></tr>
          <tr><td>偿债</td><td>资产负债率 / 流动比率</td><td class="num"><b>46.2% / 1.86</b></td><td class="num muted">42.1% / 1.95</td></tr>
          <tr><td>成长</td><td>营收 CAGR / 净利 CAGR</td><td class="num"><b>24.3% / 38.9%</b></td><td class="num muted">15.6% / 18.2%</td></tr>
          <tr><td>现金流</td><td>净现比 / FCF（万元）</td><td class="num"><b>0.90 / 6,842</b></td><td class="num muted">0.95 / —</td></tr>
          </tbody></table>
          <p class="muted small mt8">杜邦：ROE 26.8% = 净利率 20.4% × 总资产周转 0.62 × 权益乘数 2.12（2023→2024 提升主要由净利率驱动）</p>
          </div></div>`;
      });
    }},
  { t:'同业对比', hint:'行业分类引擎自动选可比公司，高亮偏离项',
    body(el,api){
      el.innerHTML=stepHead('③ 同业横向对比','按申万「半导体设备」选 5 家可比，偏离行业基准 ±1 个标准差自动高亮。')
        +runZone('拉取可比并对比')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['恒生聚源','comps.select(申万=半导体设备, 市值相近 ×5)','1.1','5 家'],
        ['Wind','ratios.pull ×5','1.6','指标拉取'],
        ['计算引擎','benchmark.compare','0.8','偏离 3 项'],
      ],res=>{
        res.innerHTML=`<table class="tbl"><thead><tr><th>公司</th><th class="num">毛利率</th><th class="num">净利率</th><th class="num">ROE</th><th class="num">应收周转</th><th class="num">研发占比</th></tr></thead><tbody>
        <tr><td><b>启衡科技</b></td><td class="num" style="background:var(--gold-soft);font-weight:800">41.2%</td><td class="num"><b>20.4%</b></td><td class="num" style="background:var(--gold-soft);font-weight:800">26.8%</td><td class="num" style="background:var(--danger-bg);font-weight:800">2.31</td><td class="num"><b>11.8%</b></td></tr>
        <tr><td class="muted">华海清科</td><td class="num muted">44.1%</td><td class="num muted">18.9%</td><td class="num muted">15.2%</td><td class="num muted">3.85</td><td class="num muted">13.2%</td></tr>
        <tr><td class="muted">拓荆科技</td><td class="num muted">38.6%</td><td class="num muted">9.8%</td><td class="num muted">8.4%</td><td class="num muted">2.96</td><td class="num muted">18.5%</td></tr>
        <tr><td class="muted">微导纳米</td><td class="num muted">33.2%</td><td class="num muted">7.1%</td><td class="num muted">6.8%</td><td class="num muted">3.12</td><td class="num muted">16.1%</td></tr>
        <tr><td><b>行业中位数</b></td><td class="num"><b>34.8%</b></td><td class="num"><b>12.4%</b></td><td class="num"><b>12.1%</b></td><td class="num"><b>3.42</b></td><td class="num"><b>14.8%</b></td></tr>
        </tbody></table>
        <p class="muted small mt8">高亮 = 显著偏离：毛利率 <b style="color:var(--gold)">高于中位 6.4pp</b>（审核关注点）· 应收周转 <b style="color:var(--red)">低于中位 1.11</b></p>`;
      });
    }},
  { t:'异常诊断', hint:'异常扫描 + 问询预判，直接对接问询函财务回复',
    body(el,api){
      el.innerHTML=stepHead('④ 财务异常诊断与问询预判','扫描七类异常信号，预判审核问询关注点。')
        +runZone('运行异常扫描')+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['计算引擎','anomaly.scan(7 类信号)','1.3','命中 3 项'],
        ['Gangtise','inquiry.predict · 历史问询匹配','1.7','同类案例 14 份'],
        ['企查查','relatedparty.check','0.8','关联交易占比 4.2%'],
      ],res=>{
        res.innerHTML=`
        <div class="iss must">${icon('warn',14)}<div><b>毛利率高于行业中位 6.4pp（问询概率 高）</b><div>同类公司被问询率 71%，建议提前准备成本结构与定价依据说明</div></div></div>
        <div class="iss must">${icon('warn',14)}<div><b>应收账款周转 2.31 低于行业 3.42（问询概率 高）</b><div>2024 应收余额 20,890 万，账期集中在 9–12 月，建议披露期后回款</div></div></div>
        <div class="iss sug">${icon('edit',14)}<div><b>研发费用资本化比例 18% 偏高（问询概率 中）</b><div>行业普遍费用化处理，建议说明资本化条件与同业口径</div></div></div>
        <div class="iss tip">${icon('check',14)}<div><b>通过项</b><div>商誉 0 · 非经常性损益占比 1.8% · 关联交易 4.2% · 现金流与净利匹配度 0.90</div></div></div>`;
      });
    }},
  { t:'成文', hint:'自动撰写报告，可直接插入招股书 MD&A / 问询回复 / 尽调报告',
    body(el,api){
      el.innerHTML=stepHead('⑤ 财务分析报告成文','自动成文含图表与来源标注；FCF / ROIC / 增长率等参数可直接喂给估值模型。')
        +`<div class="docprev">
            <h3>启衡科技财务分析报告（摘要）</h3>
            <p>报告期内公司营业收入由 31,204.5 万元增长至 48,207.3 万元，CAGR 24.3%；毛利率由 36.8% 提升至 41.2%，主要受益于 12 英寸设备占比提升与规模效应……</p>
            <div class="src-note">${icon('db',11)} 来源：审计报告 2022-2024 · 聚源 / Wind（2026-09-23 取数）· 可比公司：华海清科 / 拓荆科技 / 微导纳米</div>
            <p>杜邦拆解显示 ROE 提升由净利率驱动；应收周转低于行业中位数，已列入问询预判清单……</p>
          </div>
          <div class="mt14" style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-ghost" id="finIns">${icon('doc',13)} 插入在线文档</button>
            <button class="btn btn-pri" id="finSub">${icon('shieldC',13)} 生成报告并送审</button>
          </div>
          <div class="result-zone" id="wizRes" style="display:none"></div>`;
      api.setReady(true);
      el.querySelector('#finIns').addEventListener('click',()=>toast('已插入当前在线文档，保留来源标注','ok'));
      el.querySelector('#finSub').addEventListener('click',()=>{
        if(S.reviews.some(r=>r.scenario==='公司财务分析')){ toast('财务分析报告已在待审队列','warn'); return; }
        S.reviews.unshift({id:'r'+uid(),name:'启衡科技财务分析报告.pdf',ext:'pdf',scenario:'公司财务分析',proj:S.proj,time:today(),
          mcps:['聚源','Wind','Gangtise'],diff:'38 项指标可追溯至报表科目；异常 2+1 项已列入问询预判。'});
        renderTopbar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>已送审</b><div>签核后归档；FCF / ROIC / 增长率参数已同步至估值模型，无需重算。</div></div></div>`;
        toast('财务分析报告已送审，参数已贯通至估值模型','ok');
      });
    }},
]};

/* ---------- 估值模型 ---------- */
const WIZ_VAL={
  steps:[
  { t:'取数', hint:'与公司财务分析数据贯通，避免重复录入与口径不一致',
    body(el,api){
      el.innerHTML=stepHead('① 取数（自动贯通）','以下参数由「公司财务分析」直接喂入，无需重算。')
        +runZone('校验贯通参数')
        +`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['调度引擎','load(财务分析 · 输出)','0.6','参数 8 项贯通'],
        ['恒生聚源','fcf.series(2022–2025H1)','0.9','序列就绪'],
      ],res=>{
        res.innerHTML=`<div class="grid2">
          ${[['FCFF（2024，万元）','12,480','财务分析 · 现金流维度'],['ROIC','14.2%','财务分析 · 盈利维度'],['营收 CAGR（3y）','28.3%','财务分析 · 成长维度'],['资本结构 D/E','0.42','财务分析 · 偿债维度'],['β（回归 2y）','1.32','Wind · 周频'],['无风险利率','2.24%','Wind · 10Y 国债']].map(p=>`
          <div class="param"><div><b style="font-size:13px">${p[0]}</b><div class="src">${icon('db',10)} 来源：${p[1]&&p[2]}</div></div><span class="pv">${p[1]}</span></div>`).join('')}
        </div>`;
      });
    }},
  { t:'选法', hint:'按行业 / 阶段推荐方法组合，多方法交叉验证',
    body(el,api){
      el.innerHTML=stepHead('② 选择估值方法','引擎推荐：DCF + 相对估值交叉验证（成长期半导体设备）。')
        +`<div class="grid2">
          <label class="opt on" data-m="dcf"><input type="checkbox" checked><div><b>DCF 现金流折现 <span class="tag t-on" style="margin-left:4px">推荐</span></b><p>成长型 / 有明确预测 —— FCFF + 终值</p></div></label>
          <label class="opt on" data-m="comps"><input type="checkbox" checked><div><b>相对估值 comps <span class="tag t-on" style="margin-left:4px">推荐</span></b><p>可比上市公司 PE / PB / PS / EV-EBITDA</p></div></label>
          <label class="opt" data-m="ddm" style="opacity:.55"><input type="checkbox" disabled><div><b>DDM 股利折现 <span class="tag t-gray">不适用</span></b><p>未进入稳定分红阶段</p></div></label>
          <label class="opt" data-m="asset" style="opacity:.55"><input type="checkbox" disabled><div><b>资产基础法 <span class="tag t-gray">不适用</span></b><p>轻资产科技企业不适用</p></div></label>
        </div>`;
      qsa('[data-m]',el).forEach(o=>{
        if(o.querySelector('input').disabled) return;
        o.addEventListener('click',e=>{
          if(e.target.tagName==='INPUT') return;
          const cb=o.querySelector('input'); cb.checked=!cb.checked; o.classList.toggle('on',cb.checked);
          api.setReady(qsa('[data-m] .opt.on',el).length>0 || qsa('.opt.on',el).length>0);
        });
        o.querySelector('input').addEventListener('change',()=>o.classList.toggle('on',o.querySelector('input').checked));
      });
      api.setReady(true);
    }},
  { t:'建模', hint:'WACC 每个参数可追溯、可手动覆盖；模型在在线表格中协同',
    body(el,api){
      el.innerHTML=stepHead('③ WACC 测算与建模','关键参数全部带来源；模型落位在线表格，支持多人调参与版本留痕。')
        +runZone('测算 WACC 并建模')
        +`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['Wind','rf(10Y) / β / ERP','0.8','参数刷新'],
        ['计算引擎','wacc.calc','0.4','WACC = 9.8%'],
        ['Gangtise','fcf.forecast(5y + 终值)','1.9','预测就绪'],
      ],res=>{
        res.innerHTML=`<div class="wacc mb14"><span>${icon('chart',20)}</span><div><div style="font-size:11px;opacity:.8;letter-spacing:1px">WACC（加权平均资本成本）</div><b>9.8%</b></div>
          <div style="margin-left:auto;text-align:right;font-size:11.5px;opacity:.9">rf 2.24% × β 1.32 × ERP 6.5%<br>税后债务成本 3.1% · D/E 0.42 → E 权重 70.4%</div></div>
        <table class="tbl"><thead><tr><th>年份</th><th class="num">FCFF 预测（万元）</th><th class="num">增长率</th><th class="num">折现值</th></tr></thead><tbody>
        <tr><td>2026E</td><td class="num">15,842</td><td class="num">+27.1%</td><td class="num">14,429</td></tr>
        <tr><td>2027E</td><td class="num">19,961</td><td class="num">+26.0%</td><td class="num">16,561</td></tr>
        <tr><td>2028E</td><td class="num">24,592</td><td class="num">+23.2%</td><td class="num">18,601</td></tr>
        <tr><td>2029E</td><td class="num">29,412</td><td class="num">+19.6%</td><td class="num">20,275</td></tr>
        <tr><td>2030E</td><td class="num">34,121</td><td class="num">+16.0%</td><td class="num">21,468</td></tr>
        <tr><td>终值（g=2.5%）</td><td class="num muted">—</td><td class="num muted">—</td><td class="num"><b>318,206</b></td></tr>
        <tr><td><b>企业价值 / 股权价值</b></td><td class="num" colspan="2"><b>409,540 / 386,210 万元</b></td><td class="num"><b>DCF 38.2 元/股</b></td></tr>
        </tbody></table>
        <p class="muted small mt8">comps 交叉验证：可比 PE 中位 64.1× → 隐含 35.6 元 / 股 · 模型已同步至「财务模型 / DCF 估值模型.xlsx」v5</p>`;
      });
    }},
  { t:'验证', hint:'敏感性 + 三场景 + 蒙特卡洛，给出区间而非单点',
    body(el,api){
      el.innerHTML=stepHead('④ 敏感性 / 场景 / 蒙特卡洛','关键变量敏感性 + 乐观 / 中性 / 悲观三场景 + 概率模拟。')
        +runZone('运行敏感性矩阵与蒙特卡洛（10,000 次）')
        +`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['计算引擎','sensitivity(WACC × g)','0.7','3×3 矩阵'],
        ['Gangtise','montecarlo(10,000 次)','2.2','P10–P90 收敛'],
      ],res=>{
        const M=[[36.9,39.8,43.2],[34.1,36.8,39.9],[31.4,33.8,36.6]];
        res.innerHTML=`<table class="tbl sens"><thead><tr><th class="rc">每股价值（元）</th><th class="rc">g = 2.0%</th><th class="rc">g = 2.5%</th><th class="rc">g = 3.0%</th></tr></thead><tbody>
        ${['WACC 9.3%','WACC 9.8%','WACC 10.3%'].map((r,i)=>`<tr><th class="rc">${r}</th>${M[i].map((v,j)=>`<td class="${i===1&&j===1?'hl':''}">${v}</td>`).join('')}</tr>`).join('')}
        </tbody></table>
        <div class="grid2 mt14">
          <div class="dcard" style="border-left:4px solid var(--green)"><div class="dh">乐观场景</div><div class="dm">国产替代加速 · 42.1 元 / 股</div></div>
          <div class="dcard" style="border-left:4px solid var(--blue)"><div class="dh">中性场景（基准）</div><div class="dm">36.8 元 / 股</div></div>
          <div class="dcard" style="border-left:4px solid var(--red)"><div class="dh">悲观场景</div><div class="dm">下游资本开支收缩 · 29.5 元 / 股</div></div>
          <div class="dcard" style="border-left:4px solid var(--gold)"><div class="dh">蒙特卡洛（10,000 次）</div><div class="dm">P10 = 31.2 · P50 = 36.4 · P90 = 41.5 元 / 股</div></div>
        </div>`;
      });
    }},
  { t:'成文', hint:'多方法交叉验证给出估值区间，贴合投行实务',
    body(el,api){
      el.innerHTML=stepHead('⑤ 估值报告成文','多方法汇总交叉验证，给出估值区间与结论。')
        +`<div class="wacc hero-ok mb14"><span>${icon('pie',20)}</span>
            <div><div style="font-size:11px;opacity:.85;letter-spacing:1px">估值区间（多方法交叉验证）</div><b>33.5 – 39.2 元 / 股</b></div>
            <div style="margin-left:auto;text-align:right;font-size:11.5px;opacity:.9">DCF 38.2 · comps 35.6<br>蒙特卡洛 P10–P90：31.2–41.5</div></div>
          <table class="tbl"><thead><tr><th>方法</th><th>核心假设</th><th class="num">结果</th><th>权重</th></tr></thead><tbody>
          <tr><td><b>DCF</b></td><td class="muted">WACC 9.8% · g 2.5%</td><td class="num">38.2 元</td><td>60%</td></tr>
          <tr><td><b>comps</b></td><td class="muted">可比 PE 中位 64.1×（折价 20%）</td><td class="num">35.6 元</td><td>40%</td></tr>
          </tbody></table>
          <div class="mt14" style="display:flex;gap:10px">
            <button class="btn btn-ghost" id="valXls">${icon('xls',13)} 打开在线模型协同</button>
            <button class="btn btn-pri" id="valSub">${icon('shieldC',13)} 生成估值报告送审</button>
          </div>
          <div class="result-zone" id="wizRes" style="display:none"></div>`;
      api.setReady(true);
      el.querySelector('#valXls').addEventListener('click',()=>toast('已在在线表格打开 DCF 模型（v5）· 参数可追溯','ok'));
      el.querySelector('#valSub').addEventListener('click',()=>{
        if(S.reviews.some(r=>r.scenario==='估值模型 DCF / DDM'&&r.time===today()&&r.name.includes('0923'))){ toast('今日估值报告已在待审队列','warn'); return; }
        S.reviews.unshift({id:'r'+uid(),name:'DCF 估值报告 0923.pdf',ext:'pdf',scenario:'估值模型 DCF / DDM',proj:S.proj,time:today(),
          mcps:['聚源','Wind','Gangtise'],diff:'WACC 5 项参数可追溯；3×3 敏感性与蒙特卡洛已校验；区间 33.5–39.2 元。'});
        renderTopbar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>已送审</b><div>估值报告进入待审队列；模型文件 v5 已存入「财务模型」文件夹。</div></div></div>`;
        toast('估值报告已送审','ok');
      });
    }},
]};

/* ---------- 通用场景向导 ---------- */
function genericCfg(leaf){
  const mcps=leaf.mcps.split(' · ');
  return { steps:[
  { t:'上传材料', hint:'TextIn 解析后进入项目 Session',
    body(el,api){
      el.innerHTML=stepHead('① 上传相关材料','上传本场景所需材料；没有材料也可直接执行（仅用数据源）。')
        +`<div class="dropzone" id="gDrop">${icon('upload',20)}<div class="mt8">拖拽材料到此处，或点击选择</div></div>
          <div class="mt14" style="text-align:center"><button class="btn btn-ghost btn-sm" id="gSkip">跳过上传，直接执行</button></div>`;
      el.querySelector('#gDrop').addEventListener('click',()=>{ api.setReady(true); toast('已选择示例材料（演示）','ok'); });
      el.querySelector('#gSkip').addEventListener('click',()=>{ api.setReady(true); });
      api.setReady(false);
    }},
  { t:'配置参数', hint:'按场景配方预置，可调整',
    body(el,api){
      el.innerHTML=stepHead('② 场景配置','以下参数按「'+leaf.label+'」场景配方预置，可直接调整。')
        +`<div class="grid2">
            <div><label class="inp-lab">报告期间</label><select class="inp" style="width:100%"><option>三年一期（2022 – 2025H1）</option><option>最近两年</option></select></div>
            <div><label class="inp-lab">输出格式</label><select class="inp" style="width:100%"><option>Word（.docx）</option><option>PDF</option><option>在线文档</option></select></div>
            <div><label class="inp-lab">数据截止</label><select class="inp" style="width:100%"><option>最新（2026-09-22）</option><option>本月末</option></select></div>
            <div><label class="inp-lab">人审要求</label><select class="inp" style="width:100%"><option>申报类 · 强制持牌人签核</option><option>内部使用 · 免签核</option></select></div>
          </div>`;
      api.setReady(true);
    }},
  { t:'执行编排', hint:'后台按 DAG 串/并行调用 MCP，失败自动重试降级',
    body(el,api){
      el.innerHTML=stepHead('③ 执行场景配方','调度层按配方编排 MCP，中间结果自动回填。')
        +runZone('执行 '+leaf.label)+`<div class="result-zone" id="wizRes" style="display:none"></div>`;
      bindRun(el,api,[
        ['场景路由器','loadRecipe("'+leaf.id+'")','0.3','配方就绪 · '+mcps.length+' 个 MCP'],
        ...mcps.map(m=>[m, 'invoke · '+(leaf.label.length>10?'数据拉取':'工具调用'),'0.9','成功']),
        ['编排引擎','aggregate · 聚合校验','0.6','完成'],
      ],res=>{
        res.innerHTML=`<div class="dcard" style="border-left:4px solid var(--green)"><div class="dh">${icon('doc',15)} 《${esc(leaf.label)} · 产出文件（${today().slice(3)}）.docx》</div>
          <div class="dm">MCP 调用链：${mcps.map(esc).join(' → ')} · 全程留痕 · 中间结果已存 Session</div></div>`;
      });
    }},
  { t:'预览产物', hint:'浏览器内直接预览，不必下载',
    body(el,api){
      el.innerHTML=stepHead('④ 预览产物','浏览器内直接预览，可一键插入在线文档或转存其他项目。')
        +`<div class="docprev"><h3>${esc(leaf.label)}（预览）</h3>
          <p>本文件由场景「${esc(leaf.label)}」生成，数据均标注来源与取数时点……</p>
          <div class="src-note">${icon('db',11)} 调用链：${mcps.map(esc).join(' · ')} · 生成于 ${today()}</div>
          <p>正文按交易所 / 协会规范模板组织，含风险提示、依据与结论段落……</p></div>`;
      api.setReady(true);
    }},
  { t:'人审归档', hint:'申报 / 对外类产物须持牌人确认后落盘',
    body(el,api){
      el.innerHTML=stepHead('⑤ 送审归档','产物进入待审队列，签核后落入项目文件夹并计入产物中心。')
        +`<div class="mt8" style="display:flex;gap:10px">
            <button class="btn btn-pri" id="gSub">${icon('shieldC',14)} 提交待审队列</button>
            <button class="btn btn-ghost" id="gArc">免签核 · 直接入项目</button>
          </div><div class="result-zone" id="wizRes" style="display:none"></div>`;
      api.setReady(true);
      el.querySelector('#gSub').addEventListener('click',()=>{
        const name=`${leaf.label} · 产出（0923）.docx`;
        S.reviews.unshift({id:'r'+uid(),name,ext:'docx',scenario:leaf.label,proj:S.proj,time:today(),mcps:mcps,diff:'来源标注完整；质检引擎校验通过（0 必改）。'});
        renderTopbar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>已进入待审队列</b><div>顶栏「待审队列」可完成签核。</div></div></div>`;
        toast('已提交待审队列','ok');
      });
      el.querySelector('#gArc').addEventListener('click',()=>{
        const name=`${leaf.label} · 产出（0923）.docx`;
        S.files[S.proj].push({dir:'',name,size:'—',time:today(),status:'ok',ver:'v1',from:'场景 · '+leaf.label});
        S.artifacts.unshift({id:'a'+uid(),name,ext:'docx',proj:S.proj,scen:leaf.label,mcps:mcps,time:today(),size:'—'});
        renderSidebar();
        qs('#wizRes',el).style.display='block';
        qs('#wizRes',el).innerHTML=`<div class="iss" style="background:var(--green-soft);color:var(--green)">${icon('check',14)}<div><b>已归档至项目</b><div>文件与生成场景双向关联，可追溯 MCP 调用链。</div></div></div>`;
        toast('已直接归档至项目文件夹','ok');
      });
    }},
]};
}

/* ---------- 注册表 ---------- */
const WIZ={
  prospectus:WIZ_PROSPECTUS,
  prospectusQc:WIZ_QC,
  daily:WIZ_DAILY,
  fin:WIZ_FIN,
  valuation:WIZ_VAL,
};

/* ---------- 启动 ---------- */
function boot(){
  initLayout();
  initGlobalSearch();
  initAccountChrome();
  render();
  setTimeout(()=>toast('欢迎回来，沈亦舟 · 投行版套餐已就绪，全部 MCP 零配置可用','ok'), 600);
}
boot();
