# A-share-Ai 公开看板

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)

源码版本：[7774b74](https://github.com/hyqibot/A-share-Ai/tree/7774b74c0c73b43752081540011ffa567fe2e2b9)

<!-- BEGIN META -->
[![GitHub ★ 134](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=134&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyqibot/A-share-Ai)
<!-- END META -->

> **功能**：固定仓提供浏览器看板、静态历史报告和分析样例，实时数据及交易执行由仓外链路提供或声称。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将持仓、历史表和性能图分视图呈现，并提供固定报表入口。可证实的是前端组织与读取。

> **主要限制**：[Q03](#research-q03) 报表与示例无法证明实盘成交、模型训练与效果，部分示例可把随机收益记入知识库。[Q02](#research-q02) 动态结果也缺可核后端。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 哪些公开产物可供读者检查，能否证明交易？](#detail-section-11)
  - [Q02 · 看板从哪里取数，实时断开与回退怎样处理？](#detail-section-12)
  - [Q03 · 交易和训练宣称能核对到哪一层？](#detail-section-13)
  - [Q04 · 只读研究需要哪些条件，成本与退出如何界定？](#detail-section-14)
  - [Q05 · 在展示端标明数据来源和状态是否能减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向核对作者公开展示内容和数据出处的研究读者。可与原始记录或独立报告对照，公开页先供观察。

[Q01](#research-q01) 对照仅阅读固定报告、人工查证底表及动态聚合页面，分别统计来源可回查性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 静态报告 | 查历史展示口径 | 成交和策略未验证 |
| 看板 | 按接口返回显示信息 | 实际服务与来源未知 |
| 样例说明 | 阅读模型调用与简单模拟 | 与商业 EXE 分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 固定 HTML 及图片 | 静态查阅需要 | 查报告和布局 | 回到固定源码 |
| 浏览器、CDN 和外部数据服务 | 动态页面需要 | 读取及绘制 | 仅看固定报告 |
| EXE、账号及模型配置 | 作者另列 | 所称交易端 | 公开材料无法独立核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定 | 读者选报告与提交 | 日期和文件可复核 |
| 对照 | 分开静态、动态和样例 | 来源缺失时记录未知 |
| 结束 | 保留可引用证据 | 不以实时标题或排名证明成交 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 静态材料大小可查，浏览和外部服务成本未知 | 查报告日期和源码 | 未请求端点 |
| 持续使用 | 浏览缓存与动态带宽未知 | 核对来源、刷新和失败情况 | 无读者用时测量 |
| 失败恢复 | 重读报告或使用离线数据的资源未知 | 查数据版本，清理测试浏览器环境 | 服务异常时仅能返回固定资料 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 历史展示 | 固定表头、日期、图像和入口 | 原始输入和收益口径 |
| 动态展示 | 有请求、推送及缓存逻辑 | 实际数据新鲜度和准确性 |
| 分析样例 | 有模型调用和简化结果记录 | 实盘执行和模型效果 |

> **思考**：[Q03](#research-q03) 报表与示例无法证明实盘成交、模型训练与效果，部分示例可把随机收益记入知识库。[Q02](#research-q02) 动态结果也缺可核后端。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将持仓、历史表和性能图分视图呈现，并提供固定报表入口。可证实的是前端组织与读取。

[Q02](#research-q02) 真实加载入口在 HTML 内联脚本，日级历史单独引用 JS。[Q03](#research-q03) 区分代码样例的模拟数据与外部交易产品。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 报表与示例无法证明实盘成交、模型训练与效果，部分示例可把随机收益记入知识库。[Q02](#research-q02) 动态结果也缺可核后端。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从固定材料只读核查，保留日期与来源。需要真实成交、外部服务或策略证据时停止外推。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定材料支持公开客户端、静态报告及示例逻辑。实际服务、市场数据、交易执行及策略效果没有核实。

- 已检查：作者 README、包清单、源码路径 docs/index.html、docs/reports/report.html、docs/reportsall/report.html、newver.md、docs/portfolio.html、docs/js/history.js、docs/sw.js、README.md、codes/调用大模型api训练股票交易的方法含代码.md、docs/js/cache-helper.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定公开根树的浏览器入口、报告、财务 JSON 结构和 Markdown 示例。未请求外部配置地址或市场行情，未执行代码、EXE、模型、交易或浏览器。
- 下一步：[Q05](#research-q05) 使用合成数据和固定报告对照展示状态，不使用实际市场或账户。检查旧缓存、错误和不同日期呈现。

**分析版本**

- **仓库**：[hyqibot/A-share-Ai](https://github.com/hyqibot/A-share-Ai)
- **版本号**：未声明（[固定提交 7774b74](https://github.com/hyqibot/A-share-Ai/tree/7774b74c0c73b43752081540011ffa567fe2e2b9)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可试验给数据状态、来源和截至时间增加可核标签，以读者误判和找出处时间与现有页对照。

[Q05](#research-q05) 使用合成数据和固定报告对照展示状态，不使用实际市场或账户。检查旧缓存、错误和不同日期呈现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 2969 | — | — | 26056 |
| .js | source | 7 | 1071 | 869 | 96 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/hyqibot/A-share-Ai/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：公开仓树能给研究读者提供哪些可核对的展示与数据，其边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些公开产物可供读者检查，能否证明交易？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

读者可对照两份固定 HTML 排行、收益和回撤图、交易样式表，并区分独立的历史与持仓页面。根树另有固定财务 JSON，已查展示页的请求没有读这个文件。作者的版本说明把该文件的读取归到 EXE 路径，固定公开树没有可复核的 EXE 读取实现。根树未见 DSH 安装或执行接线，已实现部分主要是展示客户端，静态报告和表格可用于核对页面如何呈现。

#### 证据与依据

**依据 1 · 源码核查**：[docs/index.html:235-242](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L235-L242)

页面导航连接各类产物。

```text
        <div class="header">
            <h1>Ai-A股交易机器——真实账户秒级交易；Ai自主决策、自我发现、自我训练、自我进化</h1>
            <div class="header-nav">
                <a href="history.html">日级历史收益率</a>
                <a href="index.html">实时决策日志</a>
                <a href="portfolio.html">实时投资组合</a>
                <a href="reports/report.html">Ai历史排行(基金运作)</a>
                <a href="reportsall/report.html">Ai历史排行(全市场)</a>
```

**依据 2 · 源码核查**：[docs/reports/report.html:29-38](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/reports/report.html#L29-L38)

固定第一份报告图和指标表头。

<details>
<summary>查看原文（10行）</summary>

```text
<h2>图表</h2>
<h3>资产曲线</h3>
<img src='backtest_report_20251108_152132_equity.png' alt='资产曲线'>
<h3>回撤曲线</h3>
<img src='backtest_report_20251108_152132_drawdown.png' alt='回撤曲线'>
<h3>月度收益率分布</h3>
<img src='backtest_report_20251108_152132_monthly.png' alt='月度收益率'>
<h2>关键指标</h2>
<table>
<tr><th>模型名称</th><th>最大回撤</th><th>最大回撤率</th><th>夏普比率</th></tr>
```

</details>

**依据 3 · 源码核查**：[docs/reportsall/report.html:29-38](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/reportsall/report.html#L29-L38)

第二份报告独立图与指标表。

<details>
<summary>查看原文（10行）</summary>

```text
<h2>图表</h2>
<h3>资产曲线</h3>
<img src='backtest_report_20251110_025846_equity.png' alt='资产曲线'>
<h3>回撤曲线</h3>
<img src='backtest_report_20251110_025846_drawdown.png' alt='回撤曲线'>
<h3>月度收益率分布</h3>
<img src='backtest_report_20251110_025846_monthly.png' alt='月度收益率'>
<h2>关键指标</h2>
<table>
<tr><th>模型名称</th><th>最大回撤</th><th>最大回撤率</th><th>夏普比率</th></tr>
```

</details>

**依据 4 · 源码核查**：[docs/reports/report.html:664-666](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/reports/report.html#L664-L666)

报告内有交易记录样式表头。

```text
<h2>交易记录</h2>
<table>
<tr><th>日期</th><th>股票</th><th>操作</th><th>价格</th><th>数量</th><th>手续费</th><th>模型</th></tr>
```

**依据 5 · 作者声明**：[newver.md:188-190](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/newver.md#L188-L190)

作者将财务 JSON 的消费归入 EXE 路径。

```text
1、修改两个数据文件的优先读取目录
   实时行情数据代码文件 stock_codes.conf 优先从exe运行目录读取，便于随时更新，如读取失败从原路径读取。
   财务数据文件financial_data.json也是优先从exe运行目录下的stock_data读取，便于更新，如读取失败从exe解压的临时目录下的stock_data读取。
```

#### 缺口

- 报表的输入、撮合原始记录、费用和计算口径没有可复现链。
  **影响**：报表自报的历史表现无法据此归因模型或核实成交。
  **进一步探讨**：以带生成信息的同一固定报告对照展示，不把图、价格或排行作成交证据。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 看板从哪里取数，实时断开与回退怎样处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

实际首页从配置获得基地址，用内联 Socket.IO 收推送，断开标记后每十秒尝试 GET performance_full，失败仅记日志，已经绘制的图可能还在。组合页在断开时每小时重新拉取，push 事件触发重新取数。组合的统计按模型缓存五分钟，持仓走另一个请求。日级历史独立读取，失败清空图并显示错误。Service Worker 对命中 API 规则的请求走网络，失败返回 503，其余缓存静态资产。单独的 dashboard.js 和 portfolio.js 并非这两个页面的加载入口。

#### 证据与依据

**依据 1 · 源码核查**：[docs/index.html:520-552](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L520-L552)

首页内联连接和错误退让。

<details>
<summary>查看原文（33行）</summary>

```text
            if (typeof io !== 'undefined' && !isLocalhost) {
                console.log('🚀 尝试连接 Socket.IO 服务器:', SOCKET_URL);
                
                socket = io(SOCKET_URL, {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    reconnectionAttempts: 10, // Tailscale 可能需要更多重试
                    transports: ['websocket', 'polling'], // 优先 WebSocket，失败时降级到 polling
                    timeout: 10000, // Tailscale 可能需要更长的超时
                    autoConnect: true,
                    forceNew: false,
                    // 对于 HTTPS/WSS，确保正确处理证书
                    rejectUnauthorized: false // Tailscale 使用自签名证书时需要
                });
                
                // 连接成功
                socket.on('connect', () => {
                    useSocketIO = true;
                    console.log('✅ Socket.IO 连接成功！');
                    console.log('   - 服务器地址:', SOCKET_URL);
                    console.log('   - 传输方式:', socket.io.engine.transport.name);
                    console.log('   - 使用实时推送模式');
                });
                
                // 连接失败
                socket.on('connect_error', (error) => {
                    useSocketIO = false;
                    console.warn('⚠️ Socket.IO 连接失败，降级到 HTTP 轮询模式');
                    console.warn('   错误信息:', error.message);
                    console.warn('   将继续使用 HTTP 轮询获取数据');
                });
                
```

</details>

**依据 2 · 源码核查**：[docs/index.html:553-576](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L553-L576)

断开及推送处理。

<details>
<summary>查看原文（24行）</summary>

```text
                // 断开连接
                socket.on('disconnect', (reason) => {
                    useSocketIO = false;
                    console.warn('⚠️ Socket.IO 断开连接:', reason);
                    console.warn('   将切换到 HTTP 轮询模式');
                });
                
                // 接收服务器确认
                socket.on('connection_success', (data) => {
                    console.log('✅ 服务器确认连接:', data);
                });
                
                // 接收性能数据更新
                socket.on('performance_update', (data) => {
                    if (chart) {
                        applyPerformanceChart(chart, data);
                    }
                });
                
                // 接收日志更新（实时推送）
                socket.on('new_log', (data) => {
                    const logContainer = document.getElementById('logContainer');
                    if (logContainer) {
                        addLogEntry(logContainer, data);
```

</details>

**依据 3 · 源码核查**：[docs/index.html:967-998](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L967-L998)

HTTP 性能读取、无缓存及失败只写日志。

<details>
<summary>查看原文（32行）</summary>

```text
        // HTTP轮询获取数据（GitHub Pages 的主要数据获取方式）
        function fetchPerformanceData() {
            // 如果 Socket.IO 可用，跳过 HTTP 轮询（由 Socket.IO 推送）
            if (useSocketIO && socket && socket.connected) {
                return;
            }
            
            const url = `${API_BASE}/api/performance_full`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                cache: 'no-store'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (chart) {
                        applyPerformanceChart(chart, data);
                    }
                })
                .catch(error => {
                    console.error('❌ 获取性能数据失败:', error.message);
                });
```

</details>

**依据 4 · 源码核查**：[docs/index.html:1034-1049](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L1034-L1049)

实际启动十秒轮询。

<details>
<summary>查看原文（16行）</summary>

```text
        // 启动初始化过程
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化图表
            const chartInitInterval = setInterval(() => {
                const newChart = initChart();
                if (newChart) {
                    chart = newChart;
                    clearInterval(chartInitInterval);
                    console.log('图表初始化完成');
                    // 初始化后立即获取一次数据
                    fetchPerformanceData();
                    // 开始定时轮询（每10秒）
                    // 注意：如果 Socket.IO 连接成功，HTTP 轮询会被跳过
                    setInterval(fetchPerformanceData, 10000);
                }
            }, 1000);
```

</details>

**依据 5 · 源码核查**：[docs/portfolio.html:350-389](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/portfolio.html#L350-L389)

组合推送重新取数、失败每小时刷新。

<details>
<summary>查看原文（40行）</summary>

```text
                    socket.on('connect', function() {
                        useSocketIO = true;
                        console.log('✅ SocketIO连接成功，portfolio数据将实时推送');
                        // SocketIO连接成功后，清除定时刷新
                        if (refreshInterval) {
                            clearInterval(refreshInterval);
                            refreshInterval = null;
                        }
                    });
                    
                    socket.on('disconnect', function() {
                        useSocketIO = false;
                        console.log('⚠️ SocketIO连接断开，将使用定时刷新');
                        // SocketIO断开后，启用定时刷新
                        if (!refreshInterval) {
                            refreshInterval = setInterval(function() {
                                loadData();
                            }, 3600000); // 3600秒 = 1小时
                            console.log('📊 启用定时刷新：每3600秒（1小时）刷新一次');
                        }
                    });
                    
                    socket.on('connect_error', function(error) {
                        useSocketIO = false;
                        console.warn('⚠️ SocketIO连接失败，将使用定时刷新:', error);
                        // 连接失败后，启用定时刷新
                        if (!refreshInterval) {
                            refreshInterval = setInterval(function() {
                                loadData();
                            }, 3600000); // 3600秒 = 1小时
                            console.log('📊 启用定时刷新：每3600秒（1小时）刷新一次');
                        }
                    });
                    
                    // 监听portfolio更新事件
                    socket.on('portfolio_update', function(data) {
                        console.log('📊 收到portfolio更新推送:', data);
                        // 自动刷新数据
                        loadData();
                    });
```

</details>

**依据 6 · 源码核查**：[docs/portfolio.html:474-483](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/portfolio.html#L474-L483)

按模型读取本地统计缓存。

<details>
<summary>查看原文（10行）</summary>

```text
        async function loadStatistics(model) {
            try {
                const cacheKey = `statistics_${model || 'all'}`;
                
                // 先尝试从缓存获取统计数据
                if (window.CacheHelper) {
                    const cachedStats = window.CacheHelper.get(cacheKey);
                    if (cachedStats) {
                        const stats = cachedStats;
                        const statsGrid = document.getElementById('statsGrid');
```

</details>

**依据 7 · 源码核查**：[docs/portfolio.html:510-520](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/portfolio.html#L510-L520)

从外部取统计并缓存五分钟。

<details>
<summary>查看原文（11行）</summary>

```text
                const url = `${API_BASE}/api/trade_statistics${model ? '?model_name=' + encodeURIComponent(model) : ''}`;
                const response = await fetch(url, { mode: 'cors' });
                const result = await response.json();
                
                if (result.status === 'success' && result.data) {
                    const stats = result.data;
                    
                    // 缓存统计数据（5分钟）
                    if (window.CacheHelper) {
                        window.CacheHelper.set(cacheKey, stats, 5 * 60 * 1000);
                    }
```

</details>

**依据 8 · 源码核查**：[docs/portfolio.html:552-573](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/portfolio.html#L552-L573)

持仓数据另外请求。

<details>
<summary>查看原文（22行）</summary>

```text
            const body = document.getElementById('positionsBody');
            body.innerHTML = '<tr><td colspan="8" class="loading">正在加载...</td></tr>';
            
            try {
                const url = `${API_BASE}/api/current_positions${model ? '?model_name=' + encodeURIComponent(model) : ''}`;
                const response = await fetch(url, { mode: 'cors' });
                const result = await response.json();
                
                if (result.status === 'success') {
                    if (result.data.length === 0) {
                        body.innerHTML = '<tr><td colspan="8" class="empty">暂无持仓数据</td></tr>';
                        return;
                    }
                    
                    body.innerHTML = result.data.map(pos => `
                        <tr>
                            <td>${pos.model_name}</td>
                            <td>${pos.symbol}</td>
                            <td>${formatNumber(pos.quantity)}</td>
                            <td>${formatCurrency(pos.avg_price)}</td>
                            <td>${formatCurrency(pos.current_price)}</td>
                            <td class="text-right">${formatCurrency(pos.market_value)}</td>
```

</details>

**依据 9 · 源码核查**：[docs/js/history.js:241-270](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/js/history.js#L241-L270)

日级数据来源和失败清空。

<details>
<summary>查看原文（30行）</summary>

```text
    try {
        const url = `${API_BASE}${HISTORY_ENDPOINT}${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url, { mode: 'cors', cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result && result.status === 'error') {
            throw new Error(result.message || '接口返回错误');
        }
        const records = (result && result.data) || [];
        const series = (result && result.series) || {};
        const modelCount = Object.keys(series).length;
        const pointCount = Object.values(series).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0);

        renderChart(series);
        renderSummary(series);
        renderTable(records);

        if (!modelCount) {
            setStatus('暂无历史数据（可先运行几轮交易）', 'warn');
        } else {
            setStatus(`已加载 ${modelCount} 个模型、共 ${pointCount} 个日级数据点（logs/trades.db）`, 'ok');
        }
    } catch (error) {
        console.error('加载日级历史收益失败:', error);
        emptyChart('加载失败');
        renderSummary({});
        if (body) {
            body.innerHTML = `<tr><td colspan="8" class="error">加载失败: ${error.message}<br>请确认交易程序已启动，且 config.js 中的 API_BASE_URL 可访问</td></tr>`;
        }
        setStatus('加载失败: ' + error.message, 'error');
```

</details>

**依据 10 · 源码核查**：[docs/sw.js:72-112](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/sw.js#L72-L112)

API 失败返回 503，静态资源优先缓存。

<details>
<summary>查看原文（41行）</summary>

```text
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // 检查是否是不应该缓存的路径
    const shouldNotCache = NO_CACHE_PATHS.some(path => url.href.includes(path));
    
    // API 调用：直接通过网络获取，不使用缓存
    if (shouldNotCache) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // 网络失败时，返回错误信息
                    return new Response(
                        JSON.stringify({ error: '网络连接失败，请检查网络' }),
                        {
                            status: 503,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                })
        );
        return;
    }
    
    // 静态资源：使用缓存优先策略
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // 如果缓存中有，返回缓存
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // 否则从网络获取
                return fetch(event.request)
                    .then((response) => {
                        // 只缓存成功的 GET 请求
                        if (response.status === 200 && event.request.method === 'GET') {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
```

</details>

#### 缺口

- 固定仓树内没有对应 API 的服务端实现和记录来源。
  **影响**：即使收到数据也无法确认截至时间、记录完整性或是否实盘。
  **进一步探讨**：隔离浏览器接固定 mock 响应，分别注入中断、空值、延迟和旧缓存，核对页面状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 交易和训练宣称能核对到哪一层？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 将实盘、iClaw 控制和 Windows EXE 作为作者产品说明，并声明 EXE 商业闭源。公开代码示例是 Markdown，展示股票下载、技术分析和模型 API，某段把未来收益写进样例特征并一同提交分析。另一段在数据不足或异常时生成随机收益，再将结果记进知识库。固定树未见可运行交易后台、券商下单回执或模型权重更新路径。固定样例既不能证明有真实执行，也不支持外推示例策略。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-35](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/README.md#L31-L35)

作者宣称实时行情和自动执行。

```text
💹 **实时行情**：集成实时A股数据，供ai使用并用于实际交易
💹 **历史行情+财务数据**：集成A股历史行情和财务数据，供ai分析和训练
🎯 **智能交易**：基于AI分析生成买卖信号并全自动执行交易
🌈 **多种策略**：包括趋势跟踪、均线策略、技术指标策略、量化套利策略等，完全由ai自动选择并不断进化
📊 **实时监控**：UI界面实时显示收益曲线和交易日志
```

**依据 2 · 作者声明**：[README.md:72-78](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/README.md#L72-L78)

作者将安装和交易账户列为 EXE 路径。

```text
**安装及启动**
    项目已打包成windows桌面exe，可直接运行，获取方法：前往https://hyqibot.com/card-shop.html 捐赠相应期限的服务卡*2(需2张服务卡，项目能力不断加强）即可获得，如需接入实盘需拥有合规通道并自行完成或有要求的相关报备。有疑问可发送您的github地址（必需）+简短介绍到：hyqi@tradey.dpdns.org，更多信息，可点：https://www.hyqibot.com/  有永久免token费的龙虾iclaw赠送。    

   启动方法很简单：傻瓜式，无需python基础
   下载Releases安装包，解压，将user_config.json.example重命名为user_config.json，填写参数
   需要用到的参数有几类：1）真实交易账户需合规接入，比如机构自有通道或各大券商QMT；2）自选股票池通达信本地路径；3）deepseek等大模型api-key；4）licence：hyqibot
   填好参数保存，右键以管理员身份运行解压好的exe文件，图形界面上点击启动交易即可。
```

**依据 3 · 作者声明**：[README.md:146-166](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/README.md#L146-L166)

作者给出的开源与闭源分界。

<details>
<summary>查看原文（21行）</summary>

```text
📜 许可证条款
1. 开源核心模块（MIT 许可证）

开源部分源代码（位于本仓库 ./codes目录下）基于 MIT 许可证 授权，你享有以下权利：

自由使用、复制、修改、合并、发布、分发、再授权及出售开源核心代码的副本；

将开源核心代码集成到个人 / 商业项目（包括闭源项目），但需保留原始版权声明和 MIT 许可证文本。

完整许可证文本：LICENSE

2. 商业闭源模块
商业模块（包括但不限于打包成exe文件内嵌的所有模块）受版权保护，基于 商业许可证 提供，核心条款如下：

使用需获得有效商业授权（联系我们获取订阅 / 授权方案）；

禁止未经授权分发、反编译、逆向工程或转售商业模块；

商业模块仅可与本项目的开源核心模块搭配使用，不可单独使用或集成到其他未授权项目。

完整商业许可证详情：LICENSE-COMMERCIAL（购买授权后提供）
```

</details>

**依据 4 · 源码核查**：[codes/调用大模型api训练股票交易的方法含代码.md:229-246](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/codes/%E8%B0%83%E7%94%A8%E5%A4%A7%E6%A8%A1%E5%9E%8Bapi%E8%AE%AD%E7%BB%83%E8%82%A1%E7%A5%A8%E4%BA%A4%E6%98%93%E7%9A%84%E6%96%B9%E6%B3%95%E5%90%AB%E4%BB%A3%E7%A0%81.md#L229-L246)

训练段调用 API 生成分析及记录样本。

<details>
<summary>查看原文（18行）</summary>

```text
        # 每月创建一个训练样本
        for i in range(60, len(stock_data), 21):  # 约每月
            if i + 10 >= len(stock_data):
                break
                
            historical_data = stock_data.iloc[i-60:i]  # 过去60天
            future_performance = stock_data.iloc[i:i+10]  # 未来10天
            
            sample = self._create_training_sample(
                symbol, historical_data, future_performance
            )
            samples.append(sample)
            
            # 调用API生成专业分析
            analysis = self.api.analyze_stock_data(sample['features'], "technical")
            sample['expert_analysis'] = analysis
            
            self.training_history.append(sample)
```

</details>

**依据 5 · 源码核查**：[codes/调用大模型api训练股票交易的方法含代码.md:251-265](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/codes/%E8%B0%83%E7%94%A8%E5%A4%A7%E6%A8%A1%E5%9E%8Bapi%E8%AE%AD%E7%BB%83%E8%82%A1%E7%A5%A8%E4%BA%A4%E6%98%93%E7%9A%84%E6%96%B9%E6%B3%95%E5%90%AB%E4%BB%A3%E7%A0%81.md#L251-L265)

未来数据标签进入特征对象。

<details>
<summary>查看原文（15行）</summary>

```text
    def _create_training_sample(self, symbol: str, historical: pd.DataFrame, future: pd.DataFrame) -> Dict:
        """创建单个训练样本"""
        latest = historical.iloc[-1]
        future_return = (future['Close'].iloc[-1] / future['Close'].iloc[0] - 1) * 100
        
        # 特征工程
        features = {
            'symbol': symbol,
            'close': latest['Close'],
            'volume': latest['Volume'],
            'price_change_5d': (latest['Close'] / historical['Close'].iloc[-5] - 1) * 100,
            'price_change_20d': (latest['Close'] / historical['Close'].iloc[-20] - 1) * 100,
            'volume_ratio': latest['Volume'] / historical['Volume'].mean(),
            'future_return': future_return
        }
```

</details>

**依据 6 · 源码核查**：[codes/调用大模型api训练股票交易的方法含代码.md:745-776](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/codes/%E8%B0%83%E7%94%A8%E5%A4%A7%E6%A8%A1%E5%9E%8Bapi%E8%AE%AD%E7%BB%83%E8%82%A1%E7%A5%A8%E4%BA%A4%E6%98%93%E7%9A%84%E6%96%B9%E6%B3%95%E5%90%AB%E4%BB%A3%E7%A0%81.md#L745-L776)

样例模拟和随机收益退让。

<details>
<summary>查看原文（32行）</summary>

```text
        # 这里可以连接模拟交易API或使用历史数据回测
        # 简化版：基于后续价格变化评估决策质量
        
        import yfinance as yf
        import random
        
        # 模拟未来5天的表现
        future_days = 5
        current_price = current_data['technical_setup']['price']
        
        try:
            # 获取未来数据（在实际应用中需要等待真实数据）
            future_data = yf.download(symbol, period=f"{future_days+5}d")
            if len(future_data) > future_days:
                future_price = future_data['Close'].iloc[future_days]
                returns = (future_price / current_price - 1) * 100
            else:
                # 模拟收益（实际使用时应该用真实数据）
                returns = random.uniform(-10, 10)
        except:
            returns = random.uniform(-5, 5)
        
        # 从分析中提取决策
        decision = self._extract_decision_from_analysis(analysis)
        
        return {
            "symbol": symbol,
            "decision": decision,
            "entry_price": current_price,
            "returns": returns,
            "holding_period": future_days,
            "timestamp": current_data['timestamp']
```

</details>

**依据 7 · 源码核查**：[codes/调用大模型api训练股票交易的方法含代码.md:779-789](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/codes/%E8%B0%83%E7%94%A8%E5%A4%A7%E6%A8%A1%E5%9E%8Bapi%E8%AE%AD%E7%BB%83%E8%82%A1%E7%A5%A8%E4%BA%A4%E6%98%93%E7%9A%84%E6%96%B9%E6%B3%95%E5%90%AB%E4%BB%A3%E7%A0%81.md#L779-L789)

将样例收益写入知识库。

<details>
<summary>查看原文（11行）</summary>

```text
    def _save_learning_to_knowledge_base(self, symbol: str, current_data: Dict, analysis: str, trade_result: Dict):
        """将学习成果保存到知识库"""
        
        self.knowledge_base.save_trading_pattern(
            symbol=symbol,
            market_condition=current_data['market_condition'],
            technical_setup=current_data['technical_setup'],
            decision=trade_result['decision'],
            outcome=trade_result['returns'],
            reasoning=analysis
        )
```

</details>

#### 缺口

- 闭源 EXE、券商桥接、训练权重、风控、成交和合规状态均未核。
  **影响**：无法评价真实执行、费用及模型表现，样例随机结果和未来特征会混淆对照。
  **进一步探讨**：若仅检验研究方法，用固定合成样例标注已知结果和禁止未来信息，查是否能完全复现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 只读研究需要哪些条件，成本与退出如何界定？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

只读核查可比较固定 HTML 和同目录图，不需调用模型和券商。动态浏览器入口另依赖远端 JSON、跨域条件和 Chart.js 等 CDN，并启用 Service Worker。记录人工核对时间、重复刷新与缓存年龄，保留报告日期和提交。如果必须取得独立数据来源才能回答，停止于公开源码。需要复核动态断网时可用离线固定样本，结束后关闭临时浏览器环境。作者的商业 EXE 和服务条件单列为未核，不作本次运行依赖。

#### 证据与依据

**依据 1 · 源码核查**：[docs/index.html:7-11](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L7-L11)

动态页面实际载入配置及 CDN。

```text
    <script src="config.js"></script>
    <script src="js/sw-helper.js"></script>
    <script src="js/cache-helper.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/socket.io/4.0.0/socket.io.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
```

**依据 2 · 源码核查**：[docs/reports/report.html:29-38](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/reports/report.html#L29-L38)

静态报告引用本地图片。

<details>
<summary>查看原文（10行）</summary>

```text
<h2>图表</h2>
<h3>资产曲线</h3>
<img src='backtest_report_20251108_152132_equity.png' alt='资产曲线'>
<h3>回撤曲线</h3>
<img src='backtest_report_20251108_152132_drawdown.png' alt='回撤曲线'>
<h3>月度收益率分布</h3>
<img src='backtest_report_20251108_152132_monthly.png' alt='月度收益率'>
<h2>关键指标</h2>
<table>
<tr><th>模型名称</th><th>最大回撤</th><th>最大回撤率</th><th>夏普比率</th></tr>
```

</details>

**依据 3 · 源码核查**：[docs/index.html:1001-1019](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L1001-L1019)

实际注册 Service Worker。

<details>
<summary>查看原文（19行）</summary>

```text
        // 注册 Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('./sw.js')
                    .then(function(registration) {
                        console.log('✅ Service Worker 注册成功:', registration.scope);
                        // 检查是否有更新
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    console.log('🔄 发现 Service Worker 更新，将在刷新后生效');
                                }
                            });
                        });
                    })
                    .catch(function(error) {
                        console.warn('⚠️ Service Worker 注册失败:', error);
                    });
```

</details>

**依据 4 · 源码核查**：[docs/js/cache-helper.js:15-46](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/js/cache-helper.js#L15-L46)

本地缓存写入和过期清理。

<details>
<summary>查看原文（32行）</summary>

```text
    // 设置缓存
    set(key, value, expiry) {
        try {
            const item = {
                value: value,
                expiry: Date.now() + (expiry || this.CACHE_EXPIRY.config),
                timestamp: Date.now()
            };
            localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(item));
        } catch (e) {
            console.warn('缓存设置失败:', e);
        }
    },
    
    // 获取缓存
    get(key) {
        try {
            const itemStr = localStorage.getItem(this.CACHE_PREFIX + key);
            if (!itemStr) return null;
            
            const item = JSON.parse(itemStr);
            
            // 检查是否过期
            if (Date.now() > item.expiry) {
                localStorage.removeItem(this.CACHE_PREFIX + key);
                return null;
            }
            
            return item.value;
        } catch (e) {
            console.warn('缓存读取失败:', e);
            return null;
```

</details>

**依据 5 · 作者声明**：[README.md:72-78](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/README.md#L72-L78)

作者另述 EXE 与账号配置。

```text
**安装及启动**
    项目已打包成windows桌面exe，可直接运行，获取方法：前往https://hyqibot.com/card-shop.html 捐赠相应期限的服务卡*2(需2张服务卡，项目能力不断加强）即可获得，如需接入实盘需拥有合规通道并自行完成或有要求的相关报备。有疑问可发送您的github地址（必需）+简短介绍到：hyqi@tradey.dpdns.org，更多信息，可点：https://www.hyqibot.com/  有永久免token费的龙虾iclaw赠送。    

   启动方法很简单：傻瓜式，无需python基础
   下载Releases安装包，解压，将user_config.json.example重命名为user_config.json，填写参数
   需要用到的参数有几类：1）真实交易账户需合规接入，比如机构自有通道或各大券商QMT；2）自选股票池通达信本地路径；3）deepseek等大模型api-key；4）licence：hyqibot
   填好参数保存，右键以管理员身份运行解压好的exe文件，图形界面上点击启动交易即可。
```

#### 缺口

- 未访问任何市场端点，价格和商用条款未核，也没有试用耗时或持续维护样本。
  **影响**：仅能判断静态阅读和动态依赖类别，无法量化服务费用。
  **进一步探讨**：记录读取和交叉核对分钟、固定文件大小及 mock 失败后的恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 在展示端标明数据来源和状态是否能减少误判？

**研究主题**：新假设与验证

#### 完整回答

当前图表在请求失败后可保留，组合统计可来自缓存，历史页会清空并提示错误。可试验让每个视图显式区分固定报表、接口返回（实时性待核）、可回退缓存和不可用状态，标明最后成功获取时间、数据期及可追溯记录。用同一批固定样本给读者盲测，记录把历史数据当实时、把空响应当无交易及找原始出处的比例和耗时。

#### 证据与依据

**依据 1 · 源码核查**：[docs/index.html:985-998](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/index.html#L985-L998)

首页失败不重绘，旧图可保留。

<details>
<summary>查看原文（14行）</summary>

```text
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (chart) {
                        applyPerformanceChart(chart, data);
                    }
                })
                .catch(error => {
                    console.error('❌ 获取性能数据失败:', error.message);
                });
```

</details>

**依据 2 · 源码核查**：[docs/portfolio.html:474-483](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/portfolio.html#L474-L483)

统计可用本地缓存。

<details>
<summary>查看原文（10行）</summary>

```text
        async function loadStatistics(model) {
            try {
                const cacheKey = `statistics_${model || 'all'}`;
                
                // 先尝试从缓存获取统计数据
                if (window.CacheHelper) {
                    const cachedStats = window.CacheHelper.get(cacheKey);
                    if (cachedStats) {
                        const stats = cachedStats;
                        const statsGrid = document.getElementById('statsGrid');
```

</details>

**依据 3 · 源码核查**：[docs/js/history.js:258-270](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/js/history.js#L258-L270)

历史区分无数据与请求失败。

<details>
<summary>查看原文（13行）</summary>

```text
        if (!modelCount) {
            setStatus('暂无历史数据（可先运行几轮交易）', 'warn');
        } else {
            setStatus(`已加载 ${modelCount} 个模型、共 ${pointCount} 个日级数据点（logs/trades.db）`, 'ok');
        }
    } catch (error) {
        console.error('加载日级历史收益失败:', error);
        emptyChart('加载失败');
        renderSummary({});
        if (body) {
            body.innerHTML = `<tr><td colspan="8" class="error">加载失败: ${error.message}<br>请确认交易程序已启动，且 config.js 中的 API_BASE_URL 可访问</td></tr>`;
        }
        setStatus('加载失败: ' + error.message, 'error');
```

</details>

**依据 4 · 源码核查**：[docs/reportsall/report.html:29-38](https://github.com/hyqibot/A-share-Ai/blob/7774b74c0c73b43752081540011ffa567fe2e2b9/docs/reportsall/report.html#L29-L38)

固定报表是不同类型的展示产物。

<details>
<summary>查看原文（10行）</summary>

```text
<h2>图表</h2>
<h3>资产曲线</h3>
<img src='backtest_report_20251110_025846_equity.png' alt='资产曲线'>
<h3>回撤曲线</h3>
<img src='backtest_report_20251110_025846_drawdown.png' alt='回撤曲线'>
<h3>月度收益率分布</h3>
<img src='backtest_report_20251110_025846_monthly.png' alt='月度收益率'>
<h2>关键指标</h2>
<table>
<tr><th>模型名称</th><th>最大回撤</th><th>最大回撤率</th><th>夏普比率</th></tr>
```

</details>

#### 缺口

- 没有做界面试验，也未证实后端能供可靠的数据时戳和来源。
  **影响**：标注可能误报或增加理解负担，显示的时间须区分采集与返回。
  **进一步探讨**：故意插入旧缓存、请求失败和标称日期冲突，看来源识别与判断质量是否改善。

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)
