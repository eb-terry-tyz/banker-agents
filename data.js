/* ============ CapitalCore 模拟数据 ============ */

const USER = { name:'沈亦舟', dept:'投行部', title:'保荐代表人', plan:'投行版', planPrice:'¥899 / 月' };
const QUOTA = { used:1286, total:5000 };

const PROJECTS = [
  { id:'p1', name:'启衡科技 IPO', asset:'股票', deal:'科创板 IPO', desc:'二轮问询回复阶段 · 保荐人', color:'#c0392b', updated:'今天 09:32', members:['沈','陆','周','韩'] },
  { id:'p2', name:'临港城投 MTN', asset:'债券', deal:'NAFMII 中期票据', desc:'注册中 · 募集说明书撰写', color:'#1e8449', updated:'昨天 17:10', members:['沈','钱'] },
  { id:'p3', name:'华岚产业并购基金二期', asset:'股权投资', deal:'PE 基金', desc:'投后管理期 · 3 个在投项目', color:'#b7950b', updated:'09-19', members:['沈','韩','许'] },
];

/* dir: 所在子文件夹；folder:true 表示文件夹行 */
const FILES = {
  p1: [
    { dir:'', name:'招股书', folder:true, n:3, time:'今天 09:12' },
    { dir:'', name:'尽调底稿', folder:true, n:4, time:'昨天 16:40' },
    { dir:'', name:'财务模型', folder:true, n:3, time:'今天 07:40' },
    { dir:'', name:'日报', folder:true, n:3, time:'今天 08:05' },
    { dir:'', name:'申报材料', folder:true, n:2, time:'09-19' },
    { dir:'招股书', name:'启衡科技招股说明书（初稿）.docx', size:'2.4 MB', time:'今天 09:12', status:'wait', ver:'v3', from:'场景 · 招股书撰写' },
    { dir:'招股书', name:'可比招股书对比分析.xlsx', size:'682 KB', time:'09-22', status:'ok', ver:'v2', from:'场景 · 招股书撰写', content:'可比公司 中芯国际 华海清科 拓荆科技 章节结构' },
    { dir:'招股书', name:'排版质检报告.pdf', size:'1.1 MB', time:'09-22', status:'ok', ver:'v1', from:'场景 · 质检引擎' },
    { dir:'尽调底稿', name:'尽调清单（含行业专项）.xlsx', size:'356 KB', time:'昨天 17:20', status:'ok', ver:'v5', from:'场景 · 尽调底稿管理' },
    { dir:'尽调底稿', name:'审计报告 2022-2024.pdf', size:'8.9 MB', time:'09-02', status:'parse', ver:'v1', from:'上传 · 已解析', content:'营业收入 48,207.3 万元 净利润 9,842.6 毛利率' },
    { dir:'尽调底稿', name:'法律尽调报告.docx', size:'3.2 MB', time:'09-20', status:'ok', ver:'v2', from:'上传' },
    { dir:'尽调底稿', name:'股东穿透核查报告.pdf', size:'2.0 MB', time:'昨天 16:40', status:'ok', ver:'v2', from:'场景 · 股东穿透' },
    { dir:'财务模型', name:'DCF 估值模型.xlsx', size:'1.8 MB', time:'09-21', status:'ok', ver:'v4', from:'场景 · 估值模型', content:'WACC 9.8% FCFF 永续增长率 2.5% 敏感性' },
    { dir:'财务模型', name:'可比公司 comps 表.xlsx', size:'640 KB', time:'今天 07:40', status:'ok', ver:'v12', from:'定时 · comps 自动更新', content:'PE PB PS EV/EBITDA 中位数 拓荆 华海清科' },
    { dir:'财务模型', name:'杜邦分析.xlsx', size:'410 KB', time:'09-18', status:'draft', ver:'v1', from:'场景 · 财务分析' },
    { dir:'日报', name:'资本市场日报 2026-09-23.html', size:'86 KB', time:'今天 08:05', status:'ok', ver:'v1', from:'定时 · 资本市场日报', content:'上证指数 北向资金 IPO 上会 破发' },
    { dir:'日报', name:'资本市场日报 2026-09-22.html', size:'84 KB', time:'昨天 08:03', status:'ok', ver:'v1', from:'定时 · 资本市场日报' },
    { dir:'日报', name:'在审排队表 0922.xlsx', size:'220 KB', time:'昨天', status:'ok', ver:'v9', from:'场景 · 排队表' },
    { dir:'申报材料', name:'申报清单核对表.xlsx', size:'96 KB', time:'09-19', status:'draft', ver:'v2', from:'场景 · 申报汇编' },
    { dir:'申报材料', name:'工商档案（启衡科技）.pdf', size:'5.6 MB', time:'09-12', status:'parse', ver:'v1', from:'上传 · 已解析', content:'股权结构 董事 监事 历史沿革' },
    { dir:'', name:'协调会纪要 0920.docx', size:'88 KB', time:'09-20', status:'ok', ver:'v1', from:'上传' },
  ],
  p2: [
    { dir:'', name:'募集说明书', folder:true, n:2, time:'昨天' },
    { dir:'', name:'尽调', folder:true, n:2, time:'09-17' },
    { dir:'', name:'投资者画像', folder:true, n:1, time:'09-16' },
    { dir:'募集说明书', name:'临港城投 MTN 募集说明书（草稿）.docx', size:'1.9 MB', time:'昨天 17:10', status:'draft', ver:'v2', from:'场景 · 募集书撰写' },
    { dir:'募集说明书', name:'募集资金用途核查表.xlsx', size:'120 KB', time:'09-21', status:'ok', ver:'v1', from:'场景 · 合规核查' },
    { dir:'尽调', name:'发行人尽调报告.docx', size:'2.8 MB', time:'09-17', status:'ok', ver:'v3', from:'场景 · 发行人尽调' },
    { dir:'尽调', name:'关联方核查表.xlsx', size:'310 KB', time:'09-16', status:'ok', ver:'v2', from:'场景 · 关联核查' },
    { dir:'投资者画像', name:'银行间投资者画像库.xlsx', size:'1.2 MB', time:'09-16', status:'ok', ver:'v8', from:'场景 · 投资者画像', content:'银行理财 公募 保险资管 农金 申购偏好' },
    { dir:'', name:'银行间市场日报 2026-09-22.html', size:'78 KB', time:'昨天 08:02', status:'ok', ver:'v1', from:'定时 · 银行间日报' },
  ],
  p3: [
    { dir:'', name:'投决会', folder:true, n:2, time:'09-18' },
    { dir:'', name:'投后跟踪', folder:true, n:2, time:'09-15' },
    { dir:'', name:'LP 报告', folder:true, n:2, time:'09-01' },
    { dir:'投决会', name:'华岚二期 IC Memo（芯测科技）.pptx', size:'6.4 MB', time:'09-18', status:'wait', ver:'v2', from:'场景 · IC Memo' },
    { dir:'投决会', name:'访谈纪要 · 创始人 0912.docx', size:'150 KB', time:'09-12', status:'ok', ver:'v1', from:'场景 · 访谈管理' },
    { dir:'投后跟踪', name:'被投企业经营数据 2026Q2.xlsx', size:'880 KB', time:'09-15', status:'ok', ver:'v6', from:'场景 · 投后管理' },
    { dir:'投后跟踪', name:'对赌回购风险信号扫描.pdf', size:'660 KB', time:'09-10', status:'ok', ver:'v3', from:'场景 · 投后监控' },
    { dir:'LP 报告', name:'基金业绩月报 2026-08.pdf', size:'2.2 MB', time:'09-01', status:'ok', ver:'v1', from:'场景 · 基金财务', content:'NAV IRR MOIC DPI TVPI' },
    { dir:'LP 报告', name:'LP 门户访问统计.xlsx', size:'96 KB', time:'09-01', status:'ok', ver:'v5', from:'场景 · LP 维护' },
    { dir:'', name:'项目漏斗 Pipeline.xlsx', size:'420 KB', time:'09-08', status:'ok', ver:'v7', from:'场景 · Sourcing' },
  ],
};

const REVIEWS = [
  { id:'r1', name:'启衡科技招股说明书（初稿）.docx', ext:'docx', scenario:'招股说明书智能撰写', proj:'p1', time:'今天 09:12',
    mcps:['文因互联','TextIn xParse','企查查'], diff:'与审计报告数据差异 2 处（营业收入 2024 / 应收账款周转率）；排版必改 1 处：目录交叉引用；数据点 126 个已全部标注来源。' },
  { id:'r2', name:'DCF 估值报告（启衡科技）.pdf', ext:'pdf', scenario:'估值模型 DCF / DDM', proj:'p1', time:'今天 08:46',
    mcps:['聚源','Wind','Gangtise'], diff:'WACC 参数 5 项均可追溯；敏感性矩阵已交叉校验；估值区间 33.5–39.2 元 / 股。' },
  { id:'r3', name:'华岚二期 IC Memo（芯测科技）.pptx', ext:'pptx', scenario:'投决会 IC Memo', proj:'p3', time:'09-18 15:20',
    mcps:['文因互联','Gangtise'], diff:'IRR / MOIC 测算口径已核对；风险因素章节引用访谈纪要 3 条。' },
];

const ARTIFACTS = [
  { id:'a1', name:'资本市场日报 2026-09-23.html', ext:'html', proj:'p1', scen:'资本市场日报（自动）', mcps:['westock','Wind','通达信'], time:'今天 08:05', size:'86 KB' },
  { id:'a2', name:'启衡科技财务分析报告.pdf', ext:'pdf', proj:'p1', scen:'公司财务分析', mcps:['聚源','Wind','Gangtise'], time:'09-21 14:02', size:'3.1 MB' },
  { id:'a3', name:'DCF 估值模型.xlsx', ext:'xlsx', proj:'p1', scen:'估值模型 DCF / DDM', mcps:['聚源','Gangtise'], time:'09-21 16:30', size:'1.8 MB' },
  { id:'a4', name:'启衡科技招股说明书（初稿）.docx', ext:'docx', proj:'p1', scen:'招股说明书智能撰写', mcps:['文因互联','TextIn xParse'], time:'今天 09:12', size:'2.4 MB' },
  { id:'a5', name:'银行间市场日报 2026-09-22.html', ext:'html', proj:'p2', scen:'银行间市场日报', mcps:['Wind','westock'], time:'昨天 08:02', size:'78 KB' },
  { id:'a6', name:'临港城投募集说明书（草稿）.docx', ext:'docx', proj:'p2', scen:'募集说明书撰写', mcps:['文因互联','TextIn'], time:'昨天 17:10', size:'1.9 MB' },
  { id:'a7', name:'华岚二期 IC Memo（芯测科技）.pptx', ext:'pptx', proj:'p3', scen:'投决会 IC Memo', mcps:['文因互联','Gangtise'], time:'09-18 15:20', size:'6.4 MB' },
  { id:'a8', name:'基金业绩月报 2026-08.pdf', ext:'pdf', proj:'p3', scen:'基金财务（NAV / IRR）', mcps:['聚源','腾讯文档'], time:'09-01 09:00', size:'2.2 MB' },
  { id:'a9', name:'股东穿透核查报告.pdf', ext:'pdf', proj:'p1', scen:'股东穿透核查报告', mcps:['天眼查','启信慧眼'], time:'昨天 16:40', size:'2.0 MB' },
];

const ACTIVITY = [
  { t:'09:12', txt:'<b>文因互联</b> 生成《启衡科技招股说明书（初稿）》· 已进入<b>待审队列</b>', proj:'p1' },
  { t:'09:02', txt:'<b>TextIn xParse</b> 解析「审计报告 2022-2024.pdf」· 42 页 · 126 个数据点', proj:'p1' },
  { t:'08:46', txt:'<b>估值模型</b> 完成 DCF 敏感性分析（3×3 矩阵）· 送审', proj:'p1' },
  { t:'08:05', txt:'定时任务 · <b>资本市场日报</b> 自动生成并归档', proj:'p1' },
  { t:'昨天 16:40', txt:'<b>天眼查</b> 数据更新 · 《股东穿透核查报告》升级至 v2', proj:'p1' },
  { t:'昨天 14:15', txt:'沈亦舟 完成持牌人确认签字 ·《可比 IPO 表现跟踪 0922》', proj:'p1' },
];

const TASKS = [
  { id:'t1', name:'资本市场日报', cron:'每交易日 17:30', on:true, next:'今日 17:30', proj:'p1' },
  { id:'t2', name:'comps 自动更新', cron:'每周一 08:00', on:true, next:'09-28 08:00', proj:'p1' },
  { id:'t3', name:'监管新规速递', cron:'每日 09:00', on:false, next:'—', proj:'p1' },
  { id:'t4', name:'银行间市场日报', cron:'每交易日 08:00', on:true, next:'明日 08:00', proj:'p2' },
];

const PLAN_TIERS = [
  { name:'免费版', price:'¥0', desc:'westock / 腾讯文档 等基础数据 + 协作，每日限量', user:'试用、学生' },
  { name:'专业版', price:'¥299 / 月', desc:'+ Wind / 聚源 / 北大法宝 / 企查查 / TextIn，含招股书撰写、财务分析、日报', user:'独立顾问、小团队' },
  { name:'投行版', price:'¥899 / 月', desc:'+ 文因互联 / 巨潮资讯 / 智慧芽 / Gangtise，估值模型全开', user:'投行部 / ECM / DCM 主力', cur:true },
  { name:'机构版', price:'按席位议价', desc:'全 MCP 含 FactSet / 新华财经，可选私有化部署', user:'券商 / 律所 / 审计机构' },
];

/* MCP 资源池（tier: 最低可用档位） */
const MCP_GROUPS = [
  { cat:'法律检索', items:[
    { name:'北大法宝 pkulaw', status:1, tier:'专业版', cap:'法律法规 / 案例 / 司法观点全文检索', scen:'尽调合规核查、问询函法规引用、法律意见书' },
    { name:'法研 fyopen-lawsearch', status:1, tier:'专业版', cap:'法律法规检索', scen:'合规审查、新规速递' },
    { name:'华宇元典 yuandian-mcp', status:1, tier:'专业版', cap:'法律数据 / 裁判文书', scen:'诉讼仲裁核查、案例分析' },
  ]},
  { cat:'金融数据', items:[
    { name:'Wind wind-finance', status:1, tier:'专业版', cap:'全市场行情 / 财务 / 宏观', scen:'comps、日报、估值、行业基准' },
    { name:'恒生聚源 gildata', status:1, tier:'专业版', cap:'财务 / 行业数据库', scen:'财务分析、行业毛利率基准' },
    { name:'腾讯自选股 westock', status:1, tier:'免费版', cap:'A / 港 / 美股行情财报研报', scen:'日报、comps、投资者画像' },
    { name:'通达信 tdx-connector', status:1, tier:'免费版', cap:'行情 / 技术指标', scen:'板块涨跌、技术面' },
    { name:'同舟金融研究 tongzhou', status:1, tier:'专业版', cap:'投研数据', scen:'行业研究、comps' },
    { name:'新华财经', status:0, tier:'机构版', cap:'438 万宏观 / 18 万法规 / 10 亿司法 / 62 万标的', scen:'国家级合规基座、宏观日报' },
  ]},
  { cat:'工商画像', items:[
    { name:'企查查 qcc-company', status:1, tier:'专业版', cap:'工商 / 股权 / 关联方', scen:'历史沿革、关联交易、股东穿透' },
    { name:'天眼查 tyc-mcp', status:1, tier:'专业版', cap:'工商 / 风险 / 股权穿透', scen:'穿透核查、同业竞争' },
    { name:'启信慧眼 qixinhuiyan', status:1, tier:'专业版', cap:'企业信用 / 关联图谱', scen:'尽调、认购对象穿透' },
  ]},
  { cat:'公告 / 文档', items:[
    { name:'巨潮资讯', status:0, tier:'投行版', cap:'全市场公告 / 招股书全文检索', scen:'可比招股书对比、问询函案例库' },
    { name:'TextIn xParse', status:1, tier:'专业版', cap:'PDF / 扫描件智能解析为结构化', scen:'原始材料导入、招股书差异比对' },
  ]},
  { cat:'智能撰写', items:[
    { name:'文因互联', status:0, tier:'投行版', cap:'招股书 / 募集书 / ABS 说明书专业撰写', scen:'招股书初稿、募集说明书、质控核查' },
    { name:'Gangtise 投研 / Fin MCP', status:1, tier:'投行版', cap:'投研 / 量化回测 / 因子', scen:'估值模型、盈利预测' },
  ]},
  { cat:'海外 / 知产', items:[
    { name:'FactSet', status:0, tier:'机构版', cap:'海外基本面 / 共识 / 供应链', scen:'境外债、二次上市、跨境并购' },
    { name:'智慧芽 patspat-search', status:1, tier:'投行版', cap:'专利 / 文献检索', scen:'科创属性核查、知识产权章节' },
  ]},
  { cat:'在线协作', items:[
    { name:'腾讯文档 tencent-docs', status:1, tier:'免费版', cap:'在线文档 / 表格新建编辑', scen:'项目内在线协作、日报编辑' },
    { name:'金山文档 kdocs', status:1, tier:'免费版', cap:'在线文档 / 表格', scen:'底稿协作、模板填写' },
  ]},
];

/* 项目会话种子 */
const CHATS = {
  p1: [ { role:'ai', text:'已进入「启衡科技 IPO」项目 Session（#A1F3）。\n材料库：审计报告、法律尽调、工商档案均已解析就绪。\n\n可从左侧目录选择场景执行，或直接对我说需求。', src:'Session 隔离 · 跨项目不串味' } ],
  p2: [ { role:'ai', text:'已进入「临港城投 MTN」项目 Session（#B7C2）。\n\n提示：募集说明书草稿为 v2，问询答复材料尚未上传。' } ],
  p3: [ { role:'ai', text:'已进入「华岚产业并购基金二期」项目 Session（#C9D4）。\n\nIC Memo（芯测科技）正在待审队列中，等待持牌人确认。' } ],
};

/* ============ 工作目录树（目录即工作） ============ */
function L(id, label, mcps, wiz, desc){ return { id, label, mcps, wiz:wiz||'', desc:desc||'' }; }

const TREE = [
{ id:'stock', label:'股票', dot:'d-eq', tag:'股票', tagCls:'t-eq', kids:[
  { id:'ipo', label:'IPO 首次公开发行', kids:[
    { id:'ipo-ib', label:'投行部', role:true, kids:[
      L('prospectus','招股说明书智能撰写','文因互联 · 巨潮资讯 · TextIn · 企查查','prospectus','行业分类 → 拉可比 → 模板初稿 → 排版质检'),
      L('prospectus-qc','招股书审校质检','TextIn · 质检引擎 · 聚源','prospectusQc','差异比对 · 标点文法 · 分级问题清单'),
      L('ipo-due','尽调清单与底稿管理','企查查 · 天眼查 · 北大法宝','','通用+行业专项清单 · 问题跟踪 · 穿透核查'),
      L('ipo-val','估值报告与盈利预测','Wind · 聚源 · Gangtise','valuation','收益法 / 市场法 · 敏感性分析 · 盈利预测审核'),
      L('ipo-file','申报材料汇编','腾讯文档 · 质检引擎','','按交易所清单自动汇编 · 目录校验 · 命名规范'),
      L('ipo-inq-biz','问询函回复（业务部分）','巨潮资讯 · 北大法宝','','历史问询案例匹配 · 要点提取 · 专项核查'),
    ]},
    { id:'ipo-ecm', label:'ECM', role:true, kids:[
      L('daily','资本市场日报（自动）','westock · Wind · 通达信','daily','模板寻源 · 自动回填 · 定时刷新'),
      L('ipo-queue','在审及发行排队表','巨潮资讯 · westock','','各板块在审 / 过会 / 注册 / 发行 · 过会率统计'),
      L('ipo-perf','可比 IPO 表现跟踪','westock · Wind','','首日 / 30 日表现 · 行业对比 · 破发统计'),
      L('ipo-window','发行窗口建议书','westock · Wind','','投资者情绪 · 预路演反馈 · 窗口量化建议'),
      L('ipo-book','簿记建档管理','腾讯文档 · 质检引擎','','订单汇总 · 定价配售 · 绿鞋执行记录'),
      L('ipo-stab','后市稳价与破发应对','westock · 腾讯文档','','上市 30 日稳价日志 · 破发应对方案'),
    ]},
    { id:'ipo-law', label:'发行律师', role:true, kids:[
      L('ipo-legal','法律意见书撰写','北大法宝 · 企查查 · 智慧芽','','沿革 / 同业竞争 / 关联交易 / 诉讼章节模板化'),
      L('ipo-pierce','股东穿透核查报告','天眼查 · 启信慧眼 · 北大法宝','','多层穿透至最终自然人 · 合规性核查'),
      L('ipo-inq-law','问询函法律部分回复','巨潮资讯 · 华宇元典','','案例库匹配 · 专项法律意见'),
    ]},
    { id:'ipo-audit', label:'审计师', role:true, kids:[
      L('ipo-audit-r','审计报告与内控审计','聚源 · Wind · TextIn','','三年一期 · 内控 · 非经常性损益 · 指标表'),
      L('ipo-inq-fin','问询函财务部分回复','聚源 · Gangtise · 北大法宝','','毛利率异常 · 减值底稿 · 会计政策专项'),
      L('ipo-bench','行业财务基准库','聚源 · Wind','','毛利率 / 周转率基准 · 横向对比 · 异常预警'),
    ]},
  ]},
  { id:'ma', label:'并购重组 M&A', kids:[
    { id:'ma-fa', label:'投行部 · 财顾', role:true, kids:[
      L('ma-pitch','交易撮合 Pitchbook','企查查 · Wind · Gangtise','','标的筛选 · 买卖方推介 · 协同效应测算'),
      L('ma-val','估值报告（三方法）','Wind · 聚源 · Gangtise','valuation','收益法 / 市场法 / 资产基础法 · 备考报表'),
      L('ma-report','重大资产重组报告书','文因互联 · TextIn · 巨潮资讯','','重组报告书 · 方案论证 · 独财顾问报告'),
    ]},
    { id:'ma-ib', label:'投行部', role:true, kids:[ L('ma-insider','内幕信息知情人登记','腾讯文档 · 质检引擎','','登记表 · 停复牌申请 · 敏感期管理') ]},
    { id:'ma-ecm', label:'ECM', role:true, kids:[ L('ma-support','配套融资发行方案','westock · 腾讯文档','','询价公告 · 配售结果 · 锁定期管理') ]},
    { id:'ma-law', label:'发行律师', role:true, kids:[
      L('ma-legal','重组法律意见书','北大法宝 · 企查查 · 华宇元典','','标的资产尽调 · 交易协议审查'),
      L('ma-samr','经营者集中申报','北大法宝 · 法研','','反垄断申报 · 外资准入 · 过渡期损益'),
    ]},
    { id:'ma-audit', label:'审计师', role:true, kids:[ L('ma-pro','备考财务报表审核','聚源 · Wind · TextIn','','备考合并 · 业绩承诺审核 · 商誉减值测试') ]},
  ]},
  { id:'refi', label:'再融资', kids:[
    { id:'refi-ib', label:'投行部', role:true, kids:[ L('refi-plan','再融资方案设计','Wind · 北大法宝 · 聚源','','品种选择建议 · 规模测算 · 募投合规核查') ]},
    { id:'refi-ecm', label:'ECM', role:true, kids:[
      L('refi-comp','可比再融资案例库','巨潮资讯 · westock','','定增 / 可转债案例 · 折价率 · 锁定期对比'),
      L('refi-issue','发行公告与配售结果','腾讯文档 · 质检引擎','','申购 · 中签率 · 缴款通知 · 回拨方案'),
    ]},
    { id:'refi-law', label:'发行律师', role:true, kids:[ L('refi-pierce','认购对象穿透核查','天眼查 · 启信慧眼 · 北大法宝','','穿透至最终持有人 · 战投认定意见') ]},
    { id:'refi-audit', label:'审计师', role:true, kids:[ L('refi-fund','前次募集资金专项报告','聚源 · TextIn','','前募使用情况 · 效益测算审核') ]},
  ]},
  { id:'eq-other', label:'其他股票场景', kids:[
    L('eq-spin','分拆上市方案','Wind · 企查查 · 文因互联','','投行部 · 分拆方案 · 母公司备考'),
    L('eq-cdr','CDR 存托凭证法律意见','北大法宝 · FactSet','','发行律师 · 存托协议 · 境外基础股票安排'),
    L('eq-intro','介绍上市方案','北大法宝 · 企查查','','投行部 · 同股不同权 · 上市资格核查'),
    L('eq-dual','转板 / 二次上市','FactSet · 文因互联 · 巨潮资讯','','投行部 · 港股二次上市 · SEC 注册辅助'),
  ]},
]},
{ id:'debt', label:'债券', dot:'d-debt', tag:'债券', tagCls:'t-debt', kids:[
  { id:'corp', label:'公司债 / 企业债', kids:[
    { id:'corp-dcm', label:'投行 · DCM', role:true, kids:[
      L('corp-prospectus','募集说明书撰写','文因互联 · TextIn · 北大法宝','','模板生成 · 募集资金用途合规核查'),
      L('corp-due','发行人尽调报告','企查查 · 天眼查 · 聚源','','发行人尽调 · 关联方核查 · 评级沟通'),
      L('corp-trustee','受托管理事务报告','腾讯文档 · 质检引擎','','年度受托 · 付息兑付公告 · 临时报告'),
      L('corp-fund','募集资金专项报告','聚源 · TextIn','','募集资金使用情况专项核查'),
    ]},
    { id:'corp-book', label:'DCM', role:true, kids:[ L('corp-road','路演发行与簿记','腾讯文档 · 质检引擎','','路演材料 · 询价记录 · 配售结果公告') ]},
    { id:'corp-law', label:'发行律师', role:true, kids:[ L('corp-witness','簿记见证法律意见','北大法宝 · 法研','','发行合规意见 · 簿记见证（交易所强制）') ]},
  ]},
  { id:'fin', label:'金融债', kids:[
    { id:'fin-dcm', label:'DCM', role:true, kids:[ L('fin-apply','金融债发行申请文件','文因互联 · 腾讯文档','','募集书 · 发行公告 · 承销团协议') ]},
    { id:'fin-law', label:'发行律师', role:true, kids:[ L('fin-charter','章程决议合规核查','北大法宝 · 企查查','','合规意见 · 章程决议 · 金融许可证核查') ]},
    { id:'fin-audit', label:'审计师', role:true, kids:[ L('fin-car','资本充足率测算','聚源 · Wind','','审计报告 · 监管指标合规说明') ]},
  ]},
  { id:'nafmii', label:'债务融资工具 NAFMII', kids:[
    { id:'na-lead', label:'投行 · 主承', role:true, kids:[ L('na-reg','注册文件编制','文因互联 · TextIn · 聚源','','注册报告 · 募集书 · 推荐函 · 评级报告') ]},
    { id:'na-dcm', label:'DCM', role:true, kids:[
      L('na-daily','银行间市场日报','Wind · westock · 通达信','daily','资金面 · 收益率曲线 · 发行日历'),
      L('na-track','一级发行跟踪表','Wind · westock','','发行日历 · 中标利率 · 认购倍数 · 边际利率'),
      L('na-inv','投资者画像库','westock · 腾讯文档','','银行理财 / 公募 / 保险资管申购偏好'),
      L('na-book','簿记现场管理','腾讯文档 · 北大法宝','','集体决策记录 · 应急处理 · 律师见证'),
    ]},
    { id:'na-law', label:'发行律师', role:true, kids:[ L('na-legal','注册 / 发行合规意见','北大法宝 · 华宇元典','','法律意见书 · 律师见证簿记') ]},
  ]},
  { id:'ebcb', label:'可交换债 / 可转债', kids:[
    L('eb-prospectus','EB 募集说明书','文因互联 · westock · TextIn','','投行 · DCM · 换股价 / 质押安排'),
    L('eb-pledge','股票质押合规意见','北大法宝 · 企查查','','发行律师 · 质押 / 换股 / 减持合规'),
    L('eb-title','标的股票权属核查','聚源 · 天眼查','','审计师 · 股东方审计 · 权属核查'),
  ]},
  { id:'abs', label:'资产证券化 ABS', kids:[
    { id:'abs-mgr', label:'投行 · 管理人', role:true, kids:[
      L('abs-struct','交易结构设计','Gangtise · 聚源 · TextIn','','基础资产尽调 · 现金流预测 · 信用增级'),
      L('abs-plan','计划说明书与标准条款','文因互联 · 北大法宝','','计划书 · 资产买卖 / 服务 / 托管协议'),
      L('abs-serv','存续期管理','腾讯文档 · 质检引擎','','循环购买日志 · 信用触发事件跟踪'),
    ]},
    { id:'abs-law', label:'发行律师', role:true, kids:[ L('abs-iso','破产隔离法律意见','北大法宝 · 华宇元典 · 企查查','','真实出售 · 破产隔离 · 合法性认定') ]},
    { id:'abs-audit', label:'审计师', role:true, kids:[ L('abs-cf','现金流预测审核报告','聚源 · Gangtise','','预测审核 · 基础资产审计 · 专项审计') ]},
  ]},
  { id:'ovs', label:'境外债', kids:[
    L('ovs-oc','发行通函 / 招债书','文因互联 · FactSet','','投行 · DCM · OC / 路演材料 / 定价公告'),
    L('ovs-rating','国际评级沟通','FactSet · Wind','','标普 / 穆迪 / 惠誉沟通材料'),
    L('ovs-keepwell','维好协议与备案','北大法宝 · 法研','','发行律师 · 发改委外债备案 · 外汇登记'),
    L('ovs-gaap','IFRS / US GAAP 审计','聚源 · FactSet · TextIn','','审计师 · IFRS / US GAAP · SOX 404'),
  ]},
  { id:'innov', label:'创新品种', kids:[
    L('in-green','绿色项目目录核验','北大法宝 · 法研','','投行 · DCM · 绿债目录匹配 · 年度绿债报告'),
    L('in-sci','科创属性核查','智慧芽 · 聚源 · 企查查','','律师 / 审计 · 科创认定 · 专利 · 研发占比'),
    L('in-panda','熊猫债境内合规','北大法宝 · 新华财经','','发行律师 · 境外机构境内发行合规'),
  ]},
]},
{ id:'tools', label:'核心分析工具', dot:'d-tool', tag:'工具', tagCls:'t-tool', kids:[
  L('fin','公司财务分析','聚源 · Wind · westock · Gangtise','fin','五大维度 · 杜邦拆解 · 同业对比 · 异常诊断 · 自动成文'),
  L('val','估值模型 DCF / DDM','Wind · 聚源 · Gangtise · 文因互联','valuation','DCF / DDM / comps / 可比交易 · WACC · 敏感性 / 蒙特卡洛'),
]},
{ id:'pe', label:'股权投资 PE / VC', dot:'d-pe', tag:'PE/VC', tagCls:'t-pe', kids:[
  { id:'pe-raise', label:'募集', role:true, kids:[
    L('pe-ppm','基金募集（PPM / LPA）','腾讯文档 · 金山文档','','PPM / LPA · LP 名单 · 募资路演'),
    L('pe-lp','LP 维护','腾讯文档 · 金山文档','','定期报告 · LP 门户 · capital call / distribution'),
  ]},
  { id:'pe-invest', label:'投资', role:true, kids:[
    L('pe-src','项目 sourcing 与立项','企查查 · 同舟 · 腾讯文档','','deal flow 跟踪 · 项目漏斗 · 立项报告'),
    L('pe-dd','尽职调查（业务/财务/法律）','企查查 · 天眼查 · 聚源 · 北大法宝','','三大尽调 · 复用跨部门底稿与穿透'),
    L('pe-interview','访谈记录管理','腾讯文档 · TextIn','','管理层 / 客户 / 专家纪要 · 结构化要点'),
    L('pe-val','估值分析','聚源 · Wind · Gangtise','valuation','DCF / comps / 可比交易 · 敏感性分析'),
    L('pe-ic','投决会 IC Memo','文因互联 · Gangtise · 腾讯文档','','投资建议书 · IRR / MOIC 测算 · 上会材料'),
    L('pe-spa','投资协议起草（SPA / SHA）','北大法宝 · 华宇元典 · 文因互联','','条款库 · 对赌 / 回购 / 反稀释 / 领售随售'),
  ]},
  { id:'pe-mgmt', label:'投后管理', role:true, kids:[
    L('pe-post','投后管理','聚源 · Wind · 财务分析','','经营跟踪 · 对赌回购风险信号监控'),
    L('pe-fund','基金财务（NAV / IRR）','聚源 · Gangtise · 腾讯文档','','NAV 估值 · capital call · LP 报表'),
  ]},
  { id:'pe-exit', label:'退出', role:true, kids:[ L('pe-exit','退出管理','Wind · westock · 巨潮资讯','','IPO / 并购 / 回购方案 · 退出测算 · Carry 分配') ]},
]},
{ id:'daily-x', label:'跨场景日常', dot:'d-daily', tag:'日常', tagCls:'t-daily', kids:[
  { id:'dx-ib', label:'投行部', role:true, kids:[
    L('dx-weekly','项目进度周报','腾讯文档 · westock','','进度跟踪 · 承销统计 · 排名'),
    L('dx-research','行业研究与产业链 Map','同舟 · Wind · Gangtise','','行业报告 · 产业链梳理 · 标的库'),
    L('dx-comps','comps 自动更新','Wind · 聚源 · westock','','可比估值表周 / 月更 · 定时刷新'),
    L('dx-pitch','常备 Pitchbook','同舟 · 腾讯文档','','行业 pitchbook · 交易案例库'),
    L('dx-reg','监管动态跟踪','北大法宝 · 巨潮资讯 · 法研','','新规速递 · 问询案例库 · 审核节奏'),
    L('dx-crm','客户跟踪 CRM','腾讯文档','','拜访纪要 · 项目机会漏斗'),
  ]},
  { id:'dx-ecm', label:'ECM', role:true, kids:[
    L('dx-ecm-daily','ECM 市场日报','westock · Wind · 通达信','daily','指数 / 北向 / 成交额 / IPO 表现'),
    L('dx-inv','投资者画像库','westock · Wind','','公募 / 私募 / 保险 / 社保 / QFII 画像'),
    L('dx-rank','承销排名','Wind · westock','','行业排名 · 份额分析 · 项目毛利'),
  ]},
  { id:'dx-dcm', label:'DCM', role:true, kids:[
    L('dx-dcm-daily','债市日报','Wind · westock · 通达信','daily','资金面 / 回购 / 利差 / 收益率曲线'),
    L('dx-sec','二级成交跟踪','Wind · 通达信','','活跃券成交 · 信用 / 行业利差'),
    L('dx-pri','一级发行跟踪与投资者库','Wind · westock · 腾讯文档','','发行日历 · 中标利率 · 投资者库'),
  ]},
  { id:'dx-law', label:'发行律师', role:true, kids:[
    L('dx-law-week','法规更新周报','北大法宝 · 法研 · 华宇元典','','新规速递 · 监管动态 · 案例汇总'),
    L('dx-tpl','文件模板库','腾讯文档 · 金山文档','','意见书 / 协议 / 报告书模板管理'),
    L('dx-inq','问询案例库','巨潮资讯 · 华宇元典','','历史问询检索 · 回复要点'),
  ]},
  { id:'dx-audit', label:'审计师', role:true, kids:[
    L('dx-wp','底稿模板','腾讯文档 · 金山文档','','函证 / 监盘 / 抽样 / 内控底稿'),
    L('dx-cas','准则跟踪','北大法宝 · 法研','','新收入 / 租赁 / 金融工具准则提示'),
    L('dx-bench','行业财务基准库','聚源 · Wind','','毛利率 / 周转率基准 · 横向对比'),
  ]},
]},
];
