# dsh-token-bi

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[270ccee](https://github.com/361533652/dsh-token-bi/tree/270cceef087f17fde08645099af1aefd63c2f0f4)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：汇总 DSH 本机会话 token，用日期、模型、工作目录、调用树和逐轮明细查看用量。

> **核心亮点**：将公开会话服务的用量整理为交叉筛选和下钻入口，纯折叠与IO分离、活跃优先减少手工汇总；效益在排查便利，未证明精确账单或节费。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：搜索和标题事件使用启发式估算并混入普通总量，不能无条件称只统计上报；冷会话按createdAt缓存，外层强刷不必失效内层，可能继续陈旧。[Q03](#research-q03)

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
  - [Q01 · 跨会话看板比单会话统计增加什么？](#detail-section-11)
  - [Q02 · 来源、去重与多维汇总如何接线？](#detail-section-12)
  - [Q03 · 总量真只含上报吗，缓存是否可强刷？](#detail-section-13)
  - [Q04 · 采用与恢复总成本是什么？](#detail-section-14)
  - [Q05 · 能否以来源分账和修订令牌建立可信总量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多项目和父子会话用户可用跨会话看板定位用量异常，token不是货币账单。[Q01](#research-q01)

逐会话统计和手工日志汇总可取得原始信息；插件主要改变多维排查效率，需独立核对计量与新鲜度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 跨会话总览 | 看本机用量变化 | 含特定估算，非现金账单 |
| 日期模型cwd筛选 | 定位消耗来源 | 事件来源和时区口径一致 |
| 父子调用树 | 分清自身与子会话 | 子会话独立统计 |
| 逐轮下钻 | 核对turn-step用量 | 明细展示截断，原数据另查 |
| CSV导出 | 外部复核会话数据 | 保留当前窗口与计量边界 |
| 缓存报告接口 | 复用聚合 | 冷日志键与强刷边界需注意 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer与客户端slots | 启动必需 | 路由与全局面板 | 不可用 |
| sessions与sessionQuery | 数据必需 | 活跃与冷会话 | 对应来源缺失 |
| provider usage与事件格式 | 精确部分必需 | token折叠 | 未上报不可见或走特定估算 |
| 时区偏移 | 日期解释必需 | 本地分日 | 默认Host时区，历史DST未核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装并重启 | 全局Token面板出现 |
| 查看 | 用户选时间模型cwd | 汇总与明细对应 |
| 核对 | 用户下钻并对照原日志 | 来源、估算与缓存已解释 |
| 导出 | 用户导出当前窗口会话 | 保留口径，不当货币账单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host内存和历史读取，费用未知 | 安装重启与样本核对 | 需sessionQuery和Web |
| 持续使用 | 缓存、汇总渲染资源未测 | 解释估算、未知和父子口径 | token不等于现金 |
| 失败恢复 | 重读与重载资源未知 | 回原日志核对、检查缓存 | 强刷不保证冷缓存失效 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨会话入口 | 公开服务合并与下钻 | 真实历史覆盖与性能 |
| 样本去重 | 同turn-step替换 | 对官方投影逐桶一致 |
| 总量 | 含上报及特定估算 | 精确对账与误差 |
| 新鲜度 | 活跃seq与外层TTL | 冷日志变化识别 |

> **思考**：搜索和标题事件使用启发式估算并混入普通总量，不能无条件称只统计上报；冷会话按createdAt缓存，外层强刷不必失效内层，可能继续陈旧。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将公开会话服务的用量整理为交叉筛选和下钻入口，纯折叠与IO分离、活跃优先减少手工汇总；效益在排查便利，未证明精确账单或节费。[Q01](#research-q01) [Q02](#research-q02)

将公开会话服务的用量整理为交叉筛选和下钻入口，纯折叠与IO分离、活跃优先减少手工汇总；效益在排查便利，未证明精确账单或节费。[Q01](#research-q01) [Q02](#research-q02)

usage纯函数、观察finally释放及同键构建合并有明确可复用性；文档承诺需跟实现来源一致，缓存修订必须覆盖实际可变对象。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

搜索和标题事件使用启发式估算并混入普通总量，不能无条件称只统计上报；冷会话按createdAt缓存，外层强刷不必失效内层，可能继续陈旧。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先选含搜索、标题与重试的脱敏会话，逐桶核对官方投影，再测试冷日志追加后的刷新。当前用它找排查线索，精确支出仍回供应商账单。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

跨会话汇总有源码支持；总量含特定估算事件且冷缓存新鲜度有限，尚未对照Host实际计量。来源分账方案为假设。

- 已检查：作者 README、包清单、源码路径 lib/usage.mjs、lib/collector.mjs、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定用量折叠、collector、Host路由与面板入口源码；未读用户日志、执行测试或真实宿主。
- 下一步：固定事件集对照官方投影、估算分桶、冷日志追加强刷、父子和时区窗口、服务访问策略，未执行。

**分析版本**

- **仓库**：[361533652/dsh-token-bi](https://github.com/361533652/dsh-token-bi)
- **版本号**：0.1.0（[固定提交 270ccee](https://github.com/361533652/dsh-token-bi/tree/270cceef087f17fde08645099af1aefd63c2f0f4)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将上报、估算、未知分账并绑定持久日志修订，强刷两层缓存；以官方投影差分与冷日志追加验证，检测成本过高或用户仍混淆则否定。未实现。[Q05](#research-q05)

固定事件集对照官方投影、估算分桶、冷日志追加强刷、父子和时区窗口、服务访问策略，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2138 | 1939 | 112 | — |
| .mjs | source | 2 | 851 | 713 | 70 | — |
| .md | source | 2 | 596 | — | — | 5490 |
| .mjs | test | 9 | 1055 | 846 | 123 | — |
| .cjs | test | 1 | 72 | 48 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/361533652/dsh-token-bi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/361533652/dsh-token-bi/issues?q=is%3Aissue+created%3A2026-09-24T05%3A55%3A33.130Z..2026-10-24T05%3A55%3A33.130Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/361533652/dsh-token-bi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T05%3A55%3A33.130Z..2026-10-24T05%3A55%3A33.130Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验跨会话token排查的价值及估算混入、冷会话缓存边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话看板比单会话统计增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向有多个项目、模型和父子会话的DSH用户，想定位哪天、哪个工作目录或子代理带来用量变化。合格结果是能从总量下钻到原会话并解释计量来源，而不是把token直接视作货币支出。相对逐会话查看，日期、模型、cwd和调用树交叉汇总提供具体排查入口；相对自行导日志，公开sessionQuery读取和CSV导出减少整理。作者声明不做金额估算，合理地区分token与供应商账单，不能据模型token占比判定哪个模型最贵。独立节时和成本优化结果没有验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-5](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/README.md#L3-L5)

作者定位跨会话补充层，明确其参照。

```text
**DeepSeek Harness 的 token 消耗看板** —— 把散落在各个会话里的用量汇总成一张表：每天烧了多少、哪个模型最贵、哪些工作目录在消耗、父子会话各占几成、每一轮具体花在哪。

DSH 自带单会话的 token 统计，但没有跨会话的视图。这个插件补上这一层，并对齐 Host 自己的计量口径，不会出现"插件显示的数字和会话里对不上"。
```

**依据 2 · 源码核查**：[lib/client.js:1973-1990](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/client.js#L1973-L1990)

全局main和侧栏注册说明汇总界面实际入口。

<details>
<summary>查看原文（18行）</summary>

```text
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'token-bi: dictionaries');
        const t = ctx.locale.bind(NS);
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {};
          const tag = document.createElement('style');
          tag.dataset.plugin = 'dsh-token-bi';
          tag.dataset.pluginCss = 'dsh-token-bi/page.css';
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return () => tag.remove();
        }, 'token-bi: styles');
        ctx.slots.inject('main', () => {
          breadcrumb('slot:main');
          return ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS }, TokenBiPage);
        });
        ctx.slots.inject('sidebar.panellist', () => {
          breadcrumb('slot:sidebar.panellist');
          return ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 5, label: () => t('panel'), locale: NS }, PanelIcon);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源、去重与多维汇总如何接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

collector合并内存sessions与sessionQuery持久记录，同ID活跃优先；活跃缓存以seq和时区偏移构成修订。usage读取assistant/message或assistant/attempt的usage，对同turn-step后到样本先减旧桶再加新桶，并调整模型与日期归属。它能避免把一个step的多次结算样本重复累加，但这个投影口径不必等于供应商对所有失败尝试的收费。路由报告缓存以时区和窗口为键，10秒过期并合并同键构建请求；单会话下钻按需读取，冷观察结果在finally释放。纯折叠与IO分离值得复用，需宿主事件schema、sessionQuery与Web slots兼容。没有执行官方tokenUsage对照，因此源码注释的“对齐Host”仍是待独立验证主张。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage.mjs:197-233](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/usage.mjs#L197-L233)

turn-step替换和模型日期桶调整形成计量机制。

<details>
<summary>查看原文（37行）</summary>

```text
      case 'assistant/message':
      case 'assistant/attempt': {
        const usage = usageOf(event);
        if (usage === undefined) break;
        const turn = event.data?.turn;
        const step = event.data?.step;
        if (typeof turn !== 'number' || typeof step !== 'number') break;
        const buckets = bucketsOf(usage);
        const key = `${turn}:${step}`;
        const previous = slots.get(key);
        const route = routeOf(event);
        const provider = route?.provider ?? previous?.provider ?? 'unknown';
        const model = route?.model ?? previous?.model ?? 'unknown';
        const routeKey = `${provider}\u0000${model}`;
        const stamp = time ?? previous?.time ?? firstTime ?? 0;
        const day = localDay(stamp, offset);

        if (previous !== undefined) {
          subtract(totals, previous.buckets);
          subtract(bucketFor(previous.routeKey), previous.buckets);
          const previousDay = days.get(previous.day);
          if (previousDay !== undefined) subtract(previousDay, previous.buckets);
          const row = rows[previous.index];
          row.input -= previous.buckets.input;
          row.output -= previous.buckets.output;
          row.cacheRead -= previous.buckets.cacheRead;
          row.cacheWrite -= previous.buckets.cacheWrite;
        }

        add(totals, buckets);
        add(bucketFor(routeKey), buckets);
        let dayBucket = days.get(day);
        if (dayBucket === undefined) {
          dayBucket = zero();
          days.set(day, dayBucket);
        }
        add(dayBucket, buckets);
```

</details>

**依据 2 · 源码核查**：[lib/collector.mjs:188-231](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/collector.mjs#L188-L231)

活跃优先、缓存与冷观察释放体现来源整合。

<details>
<summary>查看原文（44行）</summary>

```text
    for (const session of liveSessions) {
      const header = headerOf(session);
      if (header.id.length === 0) continue;
      liveIds.add(header.id);
      const revision = `${session.seq}:${offsetMinutes}`;
      const cached = this.cache.get(header.id);
      if (cached !== undefined && cached.revision === revision && cached.live) {
        records.push(cached.record);
        continue;
      }
      try {
        const record = summarizeSession(header, session.snapshotEvents(), offsetMinutes, true);
        this.cache.set(header.id, { revision, live: true, record });
        records.push(record);
      } catch (error) {
        errors.push({ id: header.id, message: messageOf(error) });
      }
    }

    const query = service(this.ctx, 'sessionQuery');
    if (query !== undefined && typeof query.listSessions === 'function') {
      let listed = [];
      try {
        listed = await query.listSessions();
      } catch (error) {
        errors.push({ id: '*', message: messageOf(error) });
      }
      const cold = listed.filter((entry) => {
        const id = entry?.header?.id;
        return typeof id === 'string' && !liveIds.has(id);
      });
      const results = await mapLimit(cold, this.readConcurrency, async (entry) => {
        const header = headerOf({ header: entry.header });
        const revision = `${header.createdAt}:${offsetMinutes}`;
        const cached = this.cache.get(header.id);
        if (cached !== undefined && !cached.live && cached.revision === revision) return cached.record;
        try {
          const observation = await query.observeSession(header.id, { projectionMode: 'none' });
          try {
            const record = summarizeSession(header, observation.events, offsetMinutes, false);
            this.cache.set(header.id, { revision, live: false, record });
            return record;
          } finally {
            observation[Symbol.dispose]?.();
```

</details>

**依据 3 · 源码核查**：[index.js:42-58](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/index.js#L42-L58)

报告TTL与同键构建合并支持缓存设计判断。

<details>
<summary>查看原文（17行）</summary>

```text
  const readReport = (offsetMinutes, rangeDays, force) => {
    const key = cacheKey(offsetMinutes, rangeDays);
    if (!force && cached !== undefined && cached.key === key && Date.now() - cached.at < REPORT_TTL_MS) {
      return Promise.resolve(cached.report);
    }
    if (building !== undefined && building.key === key) return building.promise;
    const promise = collector
      .collect({ offsetMinutes, rangeDays })
      .then((report) => {
        cached = { at: Date.now(), key, report };
        return report;
      })
      .finally(() => {
        if (building?.promise === promise) building = undefined;
      });
    building = { key, promise };
    return promise;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 总量真只含上报吗，缓存是否可强刷？

**研究主题**：缺陷与关键质疑

#### 完整回答

实现并非所有总量只来自provider上报。web/deepseek-search-llm-request按query长度估输入并固定输出180，session/title-llm-request同样估输入并固定输出20，两者直接加进totals、models和days，行上才标estimated=true。因此含这些事件时README的“不估算、全对齐Host”不能无条件成立；明细标估算不等于顶部总量已分账。另一个边界是冷会话revision仅取header.createdAt和offset，日志被别进程追加但创建时间不变时会复用旧记录。refresh=1绕过的是外层报告缓存，collect仍调用readAll并复用冷缓存，不能保证强刷得到新冷日志。实际日志是否出现估算事件及多进程追加未验证，应按条件描述。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage.mjs:266-302](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/usage.mjs#L266-L302)

搜索事件的长度估算和固定输出直接加总。

<details>
<summary>查看原文（37行）</summary>

```text
      case 'web/deepseek-search-llm-request': {
        const stamp = time ?? firstTime ?? 0;
        const day = localDay(stamp, offset);
        const provider = 'deepseek-official';
        const model = event.data?.body?.model ?? 'deepseek-v4-flash';
        const routeKey = `${provider}\u0000${model}`;
        const query = event.data?.body?.messages?.[0]?.content?.[0]?.text ?? '';
        const inputEst = Math.max(30, Math.ceil(query.length / 2) + 40);
        const outputEst = 180;
        const buckets = { input: inputEst, output: outputEst, cacheRead: 0, cacheWrite: 0 };

        add(totals, buckets);
        add(bucketFor(routeKey), buckets);
        let dayBucket = days.get(day);
        if (dayBucket === undefined) {
          dayBucket = zero();
          days.set(day, dayBucket);
        }
        add(dayBucket, buckets);

        const cleanQuery = query.replace(/^Perform a web search for the query:\s*/i, '').trim();
        rows.push({
          turn: currentTurn,
          step: currentStep,
          time: stamp,
          day,
          provider,
          model,
          kind: 'search',
          note: cleanQuery || 'web_search',
          input: buckets.input,
          output: buckets.output,
          cacheRead: 0,
          cacheWrite: 0,
          total: total(buckets),
          estimated: true,
        });
```

</details>

**依据 2 · 源码核查**：[lib/usage.mjs:305-340](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/usage.mjs#L305-L340)

标题请求估算也加入总量并只在行标estimated。

<details>
<summary>查看原文（36行）</summary>

```text
      case 'session/title-llm-request': {
        const stamp = time ?? firstTime ?? 0;
        const day = localDay(stamp, offset);
        const route = event.data?.route;
        const provider = route?.provider ?? 'unknown';
        const model = route?.model ?? 'unknown';
        const routeKey = `${provider}\u0000${model}`;
        const promptText = event.data?.messages?.[0]?.content?.[0]?.text ?? '';
        const inputEst = Math.max(30, Math.ceil(promptText.length / 2) + 30);
        const outputEst = 20;
        const buckets = { input: inputEst, output: outputEst, cacheRead: 0, cacheWrite: 0 };

        add(totals, buckets);
        add(bucketFor(routeKey), buckets);
        let dayBucket = days.get(day);
        if (dayBucket === undefined) {
          dayBucket = zero();
          days.set(day, dayBucket);
        }
        add(dayBucket, buckets);

        rows.push({
          turn: currentTurn,
          step: currentStep,
          time: stamp,
          day,
          provider,
          model,
          kind: 'title',
          note: 'title_generation',
          input: buckets.input,
          output: buckets.output,
          cacheRead: 0,
          cacheWrite: 0,
          total: total(buckets),
          estimated: true,
```

</details>

**依据 3 · 源码核查**：[lib/collector.mjs:219-228](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/collector.mjs#L219-L228)

冷缓存键没有日志尾序号或更新时间。

<details>
<summary>查看原文（10行）</summary>

```text
      const results = await mapLimit(cold, this.readConcurrency, async (entry) => {
        const header = headerOf({ header: entry.header });
        const revision = `${header.createdAt}:${offsetMinutes}`;
        const cached = this.cache.get(header.id);
        if (cached !== undefined && !cached.live && cached.revision === revision) return cached.record;
        try {
          const observation = await query.observeSession(header.id, { projectionMode: 'none' });
          try {
            const record = summarizeSession(header, observation.events, offsetMinutes, false);
            this.cache.set(header.id, { revision, live: false, record });
```

</details>

**依据 4 · 源码核查**：[index.js:42-50](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/index.js#L42-L50)

强制刷新只绕外层cached，继续调用collector。

```text
  const readReport = (offsetMinutes, rangeDays, force) => {
    const key = cacheKey(offsetMinutes, rangeDays);
    if (!force && cached !== undefined && cached.key === key && Date.now() - cached.at < REPORT_TTL_MS) {
      return Promise.resolve(cached.report);
    }
    if (building !== undefined && building.key === key) return building.promise;
    const promise = collector
      .collect({ offsetMinutes, rangeDays })
      .then((report) => {
```

#### 缺口

- 估算事件与冷日志追加在实际部署的覆盖未知。
  **影响**：无法估计总量偏差和陈旧频率。
  **进一步探讨**：用含两类事件的fixture和外进程追加日志核对顶部、明细与强刷结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用与恢复总成本是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

成本单位是一次可解释并定位到原会话的用量异常排查。首次安装重启、确认所有本机历史可见，持续读日志和渲染多维汇总、人工解释缓存与估算，失败后核对原日志或重载清缓存都要计入。没有自己的持久数据库降低迁移负担，但不等于不消耗Host内存与读取资源；费用和规模耗时未知。路由返回标题、cwd、会话ID和错误详情，实际谁能访问由宿主访问控制决定，本次未核查，不宜默认所有本地报告都可外露。考虑到主张与总量来源差距及冷缓存限制，先观察并核对样本，未区分上报和估算前不建议用顶部总量作精确核算或预算优化依据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/collector.mjs:181-244](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/collector.mjs#L181-L244)

读多个来源、缓存与错误聚合解释资源和复核成本。

<details>
<summary>查看原文（64行）</summary>

```text
  async readAll(offsetMinutes) {
    const sessions = service(this.ctx, 'sessions');
    const liveSessions = typeof sessions?.list === 'function' ? sessions.list() : [];
    const liveIds = new Set();
    const records = [];
    const errors = [];

    for (const session of liveSessions) {
      const header = headerOf(session);
      if (header.id.length === 0) continue;
      liveIds.add(header.id);
      const revision = `${session.seq}:${offsetMinutes}`;
      const cached = this.cache.get(header.id);
      if (cached !== undefined && cached.revision === revision && cached.live) {
        records.push(cached.record);
        continue;
      }
      try {
        const record = summarizeSession(header, session.snapshotEvents(), offsetMinutes, true);
        this.cache.set(header.id, { revision, live: true, record });
        records.push(record);
      } catch (error) {
        errors.push({ id: header.id, message: messageOf(error) });
      }
    }

    const query = service(this.ctx, 'sessionQuery');
    if (query !== undefined && typeof query.listSessions === 'function') {
      let listed = [];
      try {
        listed = await query.listSessions();
      } catch (error) {
        errors.push({ id: '*', message: messageOf(error) });
      }
      const cold = listed.filter((entry) => {
        const id = entry?.header?.id;
        return typeof id === 'string' && !liveIds.has(id);
      });
      const results = await mapLimit(cold, this.readConcurrency, async (entry) => {
        const header = headerOf({ header: entry.header });
        const revision = `${header.createdAt}:${offsetMinutes}`;
        const cached = this.cache.get(header.id);
        if (cached !== undefined && !cached.live && cached.revision === revision) return cached.record;
        try {
          const observation = await query.observeSession(header.id, { projectionMode: 'none' });
          try {
            const record = summarizeSession(header, observation.events, offsetMinutes, false);
            this.cache.set(header.id, { revision, live: false, record });
            return record;
          } finally {
            observation[Symbol.dispose]?.();
          }
        } catch (error) {
          errors.push({ id: header.id, message: messageOf(error) });
          return undefined;
        }
      });
      for (const record of results) if (record !== undefined) records.push(record);
    }

    const present = new Set(records.map((record) => record.id));
    for (const id of [...this.cache.keys()]) if (!present.has(id)) this.cache.delete(id);

    return { records, errors };
```

</details>

**依据 2 · 源码核查**：[index.js:62-83](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/index.js#L62-L83)

路由按参数返回报告和会话详情，函数内无独立访问授权检查。

<details>
<summary>查看原文（22行）</summary>

```text
  const serve = async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname.replace(/\/+$/, '');
    const offsetMinutes = parseOffset(url.searchParams.get('offset'));
    const rangeDays = parseRange(url.searchParams.get('days'));
    try {
      if (path === `${ROUTE}/report`) {
        sendJson(res, 200, await readReport(offsetMinutes, rangeDays, url.searchParams.get('refresh') === '1'));
        return;
      }
      if (path === `${ROUTE}/session`) {
        const id = url.searchParams.get('id');
        if (typeof id !== 'string' || id.length === 0) {
          sendJson(res, 400, { error: 'a session id is required' });
          return;
        }
        sendJson(res, 200, await collector.sessionDetail(id, offsetMinutes));
        return;
      }
      sendJson(res, 404, { error: `unknown route ${path}` });
    } catch (error) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
```

</details>

#### 缺口

- 宿主访问策略、历史规模性能和排查节时未核查。
  **影响**：不能确定报告隐私与净效率。
  **进一步探讨**：先核对服务暴露范围，再用脱敏历史测首次和重复读取与人工查找。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否以来源分账和修订令牌建立可信总量？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的计量来源分账，保留provider_reported与estimated两个平行桶，缺usage另列unknown，不把估算合并到可对账总量；同时冷缓存绑定持久日志尾序号或宿主修订令牌，强刷显式失效两层缓存。推导来自Q03的两个独立缺口，新增代价是报告Schema、CSV兼容和宿主修订获取成本。最小验证以固定事件集逐桶对照官方投影，再追加冷会话事件要求强刷可见；若修订检测需完整读日志而抵消缓存收益，或使用者仍混淆估算总量，就不能认为方案完整成立。当前未实现，不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/usage.mjs:273-284](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/usage.mjs#L273-L284)

估算加到普通桶是来源分账的推导依据。

<details>
<summary>查看原文（12行）</summary>

```text
        const inputEst = Math.max(30, Math.ceil(query.length / 2) + 40);
        const outputEst = 180;
        const buckets = { input: inputEst, output: outputEst, cacheRead: 0, cacheWrite: 0 };

        add(totals, buckets);
        add(bucketFor(routeKey), buckets);
        let dayBucket = days.get(day);
        if (dayBucket === undefined) {
          dayBucket = zero();
          days.set(day, dayBucket);
        }
        add(dayBucket, buckets);
```

</details>

**依据 2 · 源码核查**：[lib/collector.mjs:219-228](https://github.com/361533652/dsh-token-bi/blob/270cceef087f17fde08645099af1aefd63c2f0f4/lib/collector.mjs#L219-L228)

创建时间缓存键是日志修订令牌的推导依据。

<details>
<summary>查看原文（10行）</summary>

```text
      const results = await mapLimit(cold, this.readConcurrency, async (entry) => {
        const header = headerOf({ header: entry.header });
        const revision = `${header.createdAt}:${offsetMinutes}`;
        const cached = this.cache.get(header.id);
        if (cached !== undefined && !cached.live && cached.revision === revision) return cached.record;
        try {
          const observation = await query.observeSession(header.id, { projectionMode: 'none' });
          try {
            const record = summarizeSession(header, observation.events, offsetMinutes, false);
            this.cache.set(header.id, { revision, live: false, record });
```

</details>

#### 缺口

- 宿主持久修订令牌可用性与分账交互未验证。
  **影响**：无法确认新缓存与展示成本。
  **进一步探讨**：先核查sessionQuery元数据契约并做事件集差分原型。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
