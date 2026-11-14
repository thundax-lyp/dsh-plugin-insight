# Our Free Model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[edfdaf2](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15)

<!-- BEGIN META -->
[![GitHub ★ 72,723](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=72%2C723&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中接入匿名与已配置的模型通道，提供组合路由、设置面板和本地转发。

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 说明，统一路由将目录发现和部分提交前故障处理放进同一宿主适配器。相对手工重发，组合可以先暂存推理片段，在符合推进判据时换候选。[Q02](#research-q02) 核实新版将上游适配的空工具历史清理接进出站请求。

> **主要限制**：[Q03](#research-q03) 显示，匿名额度断路器会在生成候选推进结果前抛错，有可用的后续通道时也可能提前结束。[Q02](#research-q02) 的清理依赖请求形状和工具声明，外部服务接受情况与多轮工具结果仍待对照。

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
  - [Q01 · 从一个已配置端点切到本插件，宿主侧增加哪些实际入口，目录是否能证明生成可用？](#detail-section-11)
  - [Q02 · 新版怎样清理匿名通道的工具历史，哪些请求仍可能越过清理？](#detail-section-12)
  - [Q03 · 首候选失效或断路器已打开时，组合什么时候会推进？](#detail-section-13)
  - [Q04 · 更新提示、包管理器升级归属与 Gemini 余额出网有哪些实际变化？](#detail-section-14)
  - [Q05 · 公开样例试用和退出的完整负担是什么？](#detail-section-15)
  - [Q06 · 如何让组合自动回退服从单个任务的数据接收方限制？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 反复用公开样例比较模型的开发者，可以从同一会话选择匿名或已授权模型，并检查正文、结束状态和工具参数。

原办法是在独立 profile 中配置一个已获准端点，需要比较或遇到故障时手动更换。已有端点能够稳定交付同一任务时，增加通道的维护成本可能超过切换便利。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型路由 | 在 DSH 选择匿名或自配模型 | 依赖宿主 llm，目录可先于生成可用性 |
| 组合候选 | 在提交答案前尝试其他模型 | 部分失败可以推进，前置断路器可能结束组合 |
| 工具历史兼容 | 整理受影响的匿名 Chat 请求 | 触发条件受工具声明和通道限制 |
| 设置与转发 | 查询状态、调整模型和接入本地客户端 | 面板需 Web 服务，回环与 LAN 默认关闭 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH profile 与 llm | 插件入口必需 | 注册适配器和模型目录 | 宿主入口等待服务 |
| Web 服务 | 面板必需 | 设置、事件与重载确认 | 面板路由延后加载，适配器独立注册 |
| credentials、commands 与 llm | 账号渠道必需 | 加载内置账号渠道包 | 该作用域等待服务 |
| Bun 与允许的网络出口 | 默认 OpenCode 免费推理路径必需 | 生成请求 | 目录仍可能列出，推理可能返回配置错误或拒绝 |
| 转发 Key | 启用回环转发时必需 | 保护目录与推理接口 | 缺失或错误时返回 401 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者核对发行制品、宿主与既有端点配置 | 保留独立 profile 和可退回的原端点 |
| 加载 | 选择一个已确认接收条件的模型通道 | 选择器看到模型后继续检查生成 |
| 验收 | 比较公开文本和多轮工具样例 | 检查有效正文、正常结束、工具参数和实际接收方 |
| 恢复与退出 | 记录故障并停用 bundle 与新增监听 | 切回并重新确认原端点，另核对上游留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 运行环境及网络资源 | 核对包版本、宿主、Bun 和接收条件 | 实际安装时间未知 |
| 持续使用 | 按实际请求数和上游条款计 | 核查生成、接收方、账号及代理 | 余额与合格任务现金成本未知 |
| 失败恢复 | 耗时和已发送请求按上游处理 | 识别断路、换回原端点并复核工具结果 | 候选接管频率未知 |
| 退出 | 原端点继续产生调用资源 | 停用新增入口和清理配置 | 上游留存与退出时间未核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 选择模型 | 统一发现与可用性筛选有固定源码 | 实际生成可用率 |
| 故障切换 | 提交前、符合判据的候选可交给后续项 | 任务办结率、额外调用与时延 |
| 多轮工具历史 | 特定匿名 Chat 请求移除空列表或已失效的历史工具 | 线上拒绝率与工具参数准确性 |
| 维护 | 配额查询继承通道出口，重载确认可持久化 | 代理实测与跨页面并发下的提示频率 |

> **思考**：[Q03](#research-q03) 显示，匿名额度断路器会在生成候选推进结果前抛错，有可用的后续通道时也可能提前结束。[Q02](#research-q02) 的清理依赖请求形状和工具声明，外部服务接受情况与多轮工具结果仍待对照。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 说明，统一路由将目录发现和部分提交前故障处理放进同一宿主适配器。相对手工重发，组合可以先暂存推理片段，在符合推进判据时换候选。[Q02](#research-q02) 核实新版将上游适配的空工具历史清理接进出站请求。

[Q02](#research-q02) 的打包代码和源模块均实现了兼容改动，方便追查分发接线。[Q04](#research-q04) 的确认接口校验当前重载时间并尝试持久化，仍可能有多个页面读到同一待确认状态。包管理器归属检查可阻挡第二写入者，依赖本地标记可读。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，匿名额度断路器会在生成候选推进结果前抛错，有可用的后续通道时也可能提前结束。[Q02](#research-q02) 的清理依赖请求形状和工具声明，外部服务接受情况与多轮工具结果仍待对照。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议保留原端点，在核实接收条件与分发后以公开样例核对单通道正文、工具参数和停止条件。目录可见却持续生成失败、组合中断或接收方无法追溯时，退出组件并切回原端点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

统一模型注册、部分提交前候选切换、新增工具历史处理和维护接口均可在固定源码追踪。匿名断路器抛错仍可中止组合。按请求约束实际接收方属于待验证设计。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、index.js、src/core.js、README.md、src/adapter.js、src/upstream.js、src/o2a.js、src/o2a/toolshape.js、src/egress.js、client.js、src/updater.js、vendor/channel-pack/pack.js、packages/desktop/src-tauri/src/lib.rs、src/model-test.js、src/store.js、src/forward.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查范围是 DSH 宿主入口、匿名目录和路由、工具形状、转发、重载与同轮变更涉及的 Gemini 余额接线。桌面与独立服务作为分离入口核对，作者线上套餐、条款、全部通道与宿主实际运行未核对。
- 下一步：在同一受控任务比较单端点和组合，分别制造候选失败、既有断路和首块后失败。记录正文、工具结果和每个接收端实际收到的请求，再按 [Q06](#research-q06) 加入不同授权集合和故意过期映射。

**分析版本**

- **仓库**：[Ebony-Vinyl/dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model)
- **版本号**：2.8.3（[固定提交 edfdaf2](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出按单个任务授权的接收方集合检查每个候选，只有实际目标可识别且获许时才允许发送。以误放、误拦、合格任务与维护时间的差异验证这项设想。

在同一受控任务比较单端点和组合，分别制造候选失败、既有断路和首块后失败。记录正文、工具结果和每个接收端实际收到的请求，再按 [Q06](#research-q06) 加入不同授权集合和故意过期映射。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 102 | 42848 | 31392 | 9895 | — |
| .md | source | 102 | 9041 | — | — | 166842 |
| .mjs | source | 218 | 116601 | 102054 | 12955 | — |
| .tsx | source | 20 | 3063 | 2868 | 65 | — |
| .ts | source | 2 | 251 | 242 | 0 | — |
| .md | example | 1 | 8 | — | — | 159 |
| .mjs | example | 2 | 1551 | 1126 | 358 | — |

</details>

**活跃度**

[![Issue 未关闭 146](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=146&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 291](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=291&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 312](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=312&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DeepSeek Harness 中，公开样例的多模型比较能否因统一入口、候选切换和兼容修补而少做重复工作，同时验收工具历史、失败恢复和数据接收方边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从一个已配置端点切到本插件，宿主侧增加哪些实际入口，目录是否能证明生成可用？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

在 DSH 中反复用同一份公开任务比较模型的开发者，可以在会话内选匿名或已授权通道，逐项检验有效正文、正常结束与工具参数。原先要逐一配置端点、失败后手动重试。根包补丁添加宿主模块，宿主用同一个运行时适配器注册常规与地区路由；发现入口重新取清单后按成员投影。非空新清单写缓存，失败时从旧条目重建，必要时落到内置模型；成员表通常过滤不可用项，但当匿名模型全部被判不可用时又保留候选，然后继续应用隐藏和地区规则。周期刷新也关闭推理探测，因此看到候选只代表目录机制保留了它。模型实际生成仍由上游完成。独立服务有自己的启动命令和数据目录，在 DSH 侧比较时应使用插件入口。若一个端点已经稳定通过相同任务，增加目录和通道切换未必划算。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-20](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/package.json#L15-L20)

根包和客户端的导出位置。

```text
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
```

**依据 2 · 源码核查**：[cordis.patch.yml:5-8](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/cordis.patch.yml#L5-L8)

束装补丁以裸包名挂载。

```text
- insert:
    - id: our-free-model
      name: 'dsh-our-free-model'
      config: {}
```

**依据 3 · 源码核查**：[index.js:490-513](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/index.js#L490-L513)

通过 llm 服务注册适配器，并从成员表生成发现结果。

<details>
<summary>查看原文（24行）</summary>

```text
  const runForwarded = modelRuntime.complete

  // ── registration ────────────────────────────────────────────────────────────
  const routes = () => Object.keys(state().membership)
  const registration = ctx.llm.registerAdapter([ROUTE_MAIN, ROUTE_REGION], adapter)
  ctx.llm.registerConfigurableProviders?.([
    { provider: ROUTE_MAIN, displayName: ROUTE_LABELS[ROUTE_MAIN], settingsNs: ctx.fiber?.entry?.options?.id ?? name, settingsPath: [] },
  ])

  // Advertise a probe endpoint for the in-app "detect models" button. It offers
  // what the picker itself advertises — a model the gateway refuses to route at
  // all must not be addable to a profile just because it still appears in the
  // upstream listing. Automatic availability probing is disabled by owner
  // policy, so discovery refreshes the listing only.
  ctx.llm.registerModelDiscovery?.(ctx.fiber?.entry?.options?.id ?? name, async () => {
    await refreshCatalog({ probe: false, force: true })
    const advertised = new Set(Object.values(state().membership).flat())
    return modelRuntime.catalog
      .filter(entry => advertised.has(entry.id))
      .map(entry => ({
        id: entry.id,
        name: entry.name,
        contextWindow: entry.contextWindow,
        maxTokens: entry.maxOutput,
```

</details>

**依据 4 · 源码核查**：[src/core.js:424-455](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/core.js#L424-L455)

匿名清单失败回退缓存，再合并其余目录。

<details>
<summary>查看原文（32行）</summary>

```text
  async function refreshCatalogOnce({ probe, force, throttleListing }) {
    const sources = {};
    let ids = [];
    if (throttleListing === true && !force && Date.now() - lastListingAt < LISTING_MIN_INTERVAL_MS && freeCatalog.length > 0) {
      ids = freeCatalog.map((entry) => entry.id);
      sources.free = { ok: true, count: freeCatalog.length, skipped: "recent" };
    } else {
      try {
        ids = parseListing(await fetchListing());
        lastListingAt = Date.now();
      } catch (error) {
        if (!disposed) logger.warn?.(`our-free-model: model listing refresh failed (${error?.message ?? error}); keeping the cached catalog`);
      }
    }
    if (disposed) return { catalog, sources };
    if (ids.length > 0) {
      freeCatalog = buildCatalog(ids);
      catalogStore.update({ at: Date.now(), entries: freeCatalog.map((entry) => entry.id) });
      catalogStore.flush();
      settings.update({ catalogSyncedAt: Date.now() });
    } else {
      freeCatalog = materializeCatalog(catalogStore.get().entries ?? []);
    }
    if (sources.free === void 0) sources.free = { ok: ids.length > 0, count: freeCatalog.length };
    sources.sealed = await refreshSealedRoster();
    if (disposed) return { catalog, sources };
    sources.kilo = { ok: await refreshKiloRoster(), count: kiloCatalog.length };
    if (disposed) return { catalog, sources };
    mergeCatalogs();
    if (probe) await refreshAvailability(force);
    emitTopology();
    return { catalog, sources };
```

</details>

**依据 5 · 源码核查**：[src/core.js:692-715](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/core.js#L692-L715)

缓存回建及成员过滤的反例。

<details>
<summary>查看原文（24行）</summary>

```text
function materializeCatalog(ids) {
  const rebuilt = buildCatalog(ids);
  return rebuilt.length > 0 ? rebuilt : FALLBACK_CATALOG;
}
function computeMembership(catalog, availabilitySnapshot, settings) {
  const expose = settings?.exposeRegionModels !== false;
  const verdictOf = (entry) => modelAvailability(entry.id, availabilitySnapshot, Boolean(entry.channel)).availability;
  const probeable = catalog.filter((entry) => !entry.channel);
  const refusedAll = probeable.length > 0 && probeable.every((entry) => verdictOf(entry) === STATE.unavailable);
  let usable = catalog.filter((entry) => verdictOf(entry) !== STATE.unavailable);
  if (refusedAll) usable = catalog;
  const main = [];
  const region = [];
  for (const entry of usable) {
    if (isModelHidden(entry, settings)) continue;
    const verdict = verdictOf(entry);
    if (verdict !== STATE.regionBlocked) main.push(entry.id);
    else if (expose) region.push(entry.id);
  }
  const membership = {};
  if (main.length > 0) membership[ROUTE_MAIN2] = main;
  if (region.length > 0) membership[ROUTE_REGION2] = region;
  return membership;
}
```

</details>

**依据 6 · 源码核查**：[index.js:1653-1681](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/index.js#L1653-L1681)

定时刷新读取清单，不发生成探测。

<details>
<summary>查看原文（29行）</summary>

```text

  if (!managed) {
    every(() => {
      void feed.poll()
      const hours = settings.get().updateCheckHours ?? 6
      if (hours > 0) void updater.check().then(() => pushUpdate(false)).catch(() => {})
    }, () => positiveOr(settings.get().feedPollMinutes, 30, 5) * 60_000)
  }
  // Automatic availability probing is disabled by owner policy. This loop only
  // refreshes the listing and reads the egress; the interval keeps its setting
  // name for upgrade compatibility. `/reprobe` is the only path that still asks
  // for a probe, and it is driven by a manual button.
  every(() => {
    void (async () => {
      await watchEgress()
      // throttleListing: the periodic round may keep the cached roster when it
      // just refreshed — the upstream listing is read at most once per window.
      await refreshCatalog({ probe: false, throttleListing: true })
    })().catch(error => logger.warn?.(`our-free-model: periodic refresh failed (${error?.message ?? error})`))
  }, () => positiveOr(settings.get().probeIntervalMinutes, 15, 1) * 60_000)
  // A failing egress watch means the network is down, which is worth one line —
  // and only the first of a streak, or a dead link would write every two minutes
  // until the next restart. A success resets the flag for the next outage.
  let egressWarned = false
  every(() => {
    void watchEgress()
      .then(() => {
        egressWarned = false
        // url-test re-ranks on its own 5-minute cycle; the node shown on the
```

</details>

**依据 7 · 作者声明**：[README.md:103-119](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/README.md#L103-L119)

作者说明独立服务另有端口和数据目录。

<details>
<summary>查看原文（17行）</summary>

````text

仓库现在提供两个入口：下文安装的是 **DSH 插件**；`packages/standalone` 是
**无需安装 DSH 的独立本地服务**。从完整源码仓库运行：

```powershell
npm run start:standalone
```

独立服务默认使用 `~/.our-free-model` 和端口 `18900`，拥有自己的 API Key，
不读取插件数据。支持匿名/Kilo、EAC 和十个账号渠道，提供
Chat Completions、Responses API，以及独立网页管理（概览、模型、用量、聚合渠道、路由、
EAC、客户端与订阅、资源库、API 接入、设置与**插件中心**）。
插件中心与桌面端共用一套签名市场：渠道、增强与页面插件在此安装、启停、配置与卸载，
页面插件会直接出现在侧边栏的「插件」分组里。
启动后打开终端打印的一次性管理链接即可使用；账号在独立页面登录，也可手动导入插件账号备份。
启动、参数与验证见 [独立服务说明](packages/standalone/README.md)。
独立服务的安装制品与 Release 尚未发布。
````

</details>

#### 缺口

- 没有相同宿主与相同公开任务的端点对照记录
  **影响**：只能判断入口与步骤变化，无法量化复用收益
  **进一步探讨**：在独立 profile 留着原端点，比较正文、结束状态、工具参数与人工切换次数

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 新版怎样清理匿名通道的工具历史，哪些请求仍可能越过清理？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

匿名候选构造请求体后先交给增强扩展，再调用 applyFingerprint，而 EAC、Kilo、聚合和扩展通道跳过这个处理。applyFingerprint 从打包的 src/o2a.js 调用重命名与补全函数。Chat 形状中，带真实声明工具时才进入 sanitizeToolHistory；对本来就是空数组的 tool_calls 删除字段，对重放中不可保留的调用记录 ID，再移除匹配的工具结果。全部旧调用被移除时，只有符合条件且正文、推理字段都空的行才被删。这个修补减少了出站 Chat 历史的两类空形状，同时也可能丢弃不在当前工具声明中的历史结果，改变模型所见上下文。没有声明真实工具便绕过这一清理，且已为空的调用数组所在空行仅移除字段，不进入集合。项目源码注释将同样的兼容规则归于 opencode2api，不能把该规则计为项目原创新；这里可确认的工作是把同一修补接入本插件构建产物。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.js:515-530](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L515-L530)

明确增强钩子与出站指纹整形的执行顺序和通道边界。

<details>
<summary>查看原文（16行）</summary>

```text
      const recovering = attempt === 1
      const savingsSink = {}
      let payload = payloadFor(attemptMessages, attemptBudget, recovering ? [] : warnings, savingsSink)
      attemptSavings = savingsSink.report ?? null
      // Enhancement extensions see the harness body after every lane's own
      // shaping but before the free lane's fingerprint — they rewrite the
      // caller's request, not the camouflage. Fail-open inside the runtime.
      if (this.deps.extensionRuntime?.applyRequestHooks !== undefined) {
        payload = await this.deps.extensionRuntime.applyRequestHooks(payload, { model: entry.id, wire, sessionId: session })
      }
      // The absorbed channels have no tool-name gate; their models see the
      // caller's tools exactly as declared, so the fingerprint pass is free-lane
      // only. The aggregate lane is somebody else's gateway entirely — renaming
      // its tools to this lane's gate placeholders would break the caller's calls.
      // An extension channel shaped its own body in its sandbox.
      const renameMap = sealed || kilo || aggregate || extension ? new Map() : applyFingerprint(payload, wire === 'messages' ? 'claude' : style === 'flat')
```

</details>

**依据 2 · 源码核查**：[src/upstream.js:68-89](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/upstream.js#L68-L89)

生产代码导入打包的 o2a 模块。

<details>
<summary>查看原文（22行）</summary>

```text
// src/o2a/ 八个模块（官方资产内联）打成单文件；开发/测试直接跑仓库里的产物。
import {
  BASE62_ALPHABET,
  CANONICAL_SESSION_RE,
  CLIENT_UA,
  DESCENDING_TIME_RE,
  O2A_VERSION,
  ToolRenameMap,
  canonicalSessionID,
  ensureChatUsage,
  ensureV2CompletionLimit,
  gatewayHeaders as o2aGatewayHeaders,
  injectOfficialPrompt,
  isOfficialSessionID,
  officialTool,
  phaseAgeMs,
  randomID,
  randomProjectID,
  renameAndCompleteTools,
  renamableToolName,
  sessionPhaseMs,
} from './o2a.js'
```

</details>

**依据 3 · 源码核查**：[src/upstream.js:497-515](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/upstream.js#L497-L515)

调用实际重命名与补全函数。

<details>
<summary>查看原文（19行）</summary>

```text

  // 1. Official system prompt (the reference injects before shaping tools).
  injectOfficialPrompt(body, shape)

  // 2.+3. Tool pass: rename client tools, append the official set. Tools that
  // already carry the verbatim official definition are declared officials —
  // kept as-is and not duplicated — so repeated shaping stays a no-op.
  const tools = Array.isArray(body.tools) ? body.tools : []
  const keep = new Set()
  for (const tool of tools) {
    const name = renamableToolName(shape, tool)
    if (name !== null && carriesOfficialDefinition(tool, name, shape)) {
      keep.add(name)
    }
  }
  const { renames, injected } = renameAndCompleteTools(body, shape, { keep })

  // 4b. The injected officials need the placeholder note.
  if (injected.length > 0) noteInjectedTools(body, shape, injected)
```

</details>

**依据 4 · 源码核查**：[src/o2a.js:626-651](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/o2a.js#L626-L651)

只有声明工具时清理，正文与推理字段的保留判据。

<details>
<summary>查看原文（26行）</summary>

```text
  payload.tools = shaped;
  rewriteToolReferences(payload, shape, renames);
  const known = new Set(officialUsed);
  for (const wire of renames.keys()) known.add(wire);
  if (declaredClientTools > 0) sanitizeToolHistory(payload, shape, known);
  dropDanglingToolChoice(payload, shape, known);
  return { renames, injected, known };
}
function chatMessageHasContent(message) {
  const keys = ["content", "reasoning_content", "reasoning"];
  for (const key of keys) {
    const value = message[key];
    if (typeof value === "string") {
      if (value !== "") return true;
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length > 0) return true;
      continue;
    }
    if (value !== null && typeof value === "object") {
      if (Object.keys(value).length > 0) return true;
      continue;
    }
    if (value !== void 0 && value !== null) return true;
  }
```

</details>

**依据 5 · 源码核查**：[src/o2a.js:670-734](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/o2a.js#L670-L734)

空字段、历史调用与匹配结果的实际修改。

<details>
<summary>查看原文（65行）</summary>

```text
      const message = messages2[i];
      if (!message || typeof message !== "object") continue;
      if (Array.isArray(message.tool_calls)) {
        const kept = [];
        let touched = message.tool_calls.length === 0;
        for (const call of message.tool_calls) {
          const fate = fateOf(call?.function?.name);
          if (fate.verdict === "keep") {
            kept.push(call);
            continue;
          }
          if (fate.verdict === "rename") {
            const fn = call.function ?? {};
            kept.push({ ...call, function: { ...fn, name: fate.official } });
            touched = true;
            continue;
          }
          if (typeof call?.id === "string" && call.id !== "") droppedCalls2.add(call.id);
          touched = true;
        }
        if (touched) {
          if (kept.length === 0) {
            const { tool_calls: _emptied, ...rest } = message;
            messages2[i] = rest;
            if (message.tool_calls.length > 0 && message.function_call === void 0) emptied.add(rest);
          } else {
            messages2[i] = { ...message, tool_calls: kept };
          }
          changed2 = true;
        }
      }
      const current = messages2[i];
      if (current.function_call && typeof current.function_call === "object") {
        const fate = fateOf(current.function_call.name);
        if (fate.verdict === "rename") {
          messages2[i] = { ...current, function_call: { ...current.function_call, name: fate.official } };
          changed2 = true;
        } else if (fate.verdict === "drop") {
          if (typeof current.function_call.name === "string") droppedFunctions.add(current.function_call.name);
          const { function_call: _dropped, ...rest } = current;
          messages2[i] = rest;
          changed2 = true;
        }
      }
      const row = messages2[i];
      if (row.role === "tool" && typeof row.tool_call_id === "string" && droppedCalls2.has(row.tool_call_id)) {
        messages2.splice(i, 1);
        i -= 1;
        changed2 = true;
      }
      if (row.role === "function" && typeof row.name === "string" && droppedFunctions.has(row.name)) {
        messages2.splice(i, 1);
        i -= 1;
        changed2 = true;
      }
    }
    if (emptied.size > 0) {
      for (let i = messages2.length - 1; i >= 0; i -= 1) {
        if (emptied.has(messages2[i]) && !chatMessageHasContent(messages2[i])) {
          messages2.splice(i, 1);
          changed2 = true;
        }
      }
    }
    if (changed2 && messages2.length === 0) payload.messages = [];
```

</details>

**依据 6 · 源码核查**：[src/o2a/toolshape.js:142-168](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/o2a/toolshape.js#L142-L168)

源码注解说明移植来源及空行判据。

<details>
<summary>查看原文（27行）</summary>

```text
 * Does a chat row still carry something after its ghost calls were removed?
 *
 * Mirrors opencode2api v1.4.7's chatMessageHasContent: an emptied call row
 * that also has no text or reasoning is dropped, rather than left as an empty
 * assistant message the free tier may refuse.
 */
function chatMessageHasContent(message) {
  const keys = ['content', 'reasoning_content', 'reasoning']
  for (const key of keys) {
    const value = message[key]
    if (typeof value === 'string') {
      if (value !== '') return true
      continue
    }
    if (Array.isArray(value)) {
      if (value.length > 0) return true
      continue
    }
    if (value !== null && typeof value === 'object') {
      if (Object.keys(value).length > 0) return true
      continue
    }
    if (value !== undefined && value !== null) return true
  }
  return false
}

```

</details>

#### 缺口

- 没有同一批多轮工具任务的回放和真实上游响应
  **影响**：不能量化拒绝率或断言工具语义完整
  **进一步探讨**：用受控端点比较生成请求体，覆盖无声明、已空字段、缺失工具和保留推理四种样例，再核对工具回传和正文

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 首候选失效或断路器已打开时，组合什么时候会推进？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

组合按候选链迭代，暂存提交前的块，遇到非空文本或工具增量才提交；推理块和空白文本不提交。同一次候选结束且未提交时，外层要看到 advance 为真才试下一项；已提交后直接结束组合分支。匿名额度断路器仍在单候选流靠前位置抛错，此时外层直接等待迭代器，异常不经过 advance 分支，因而后面即使有独立通道也可能没有机会接管。等待窗口是本地拒绝重试的条件，上游额度和条款另行决定。默认 OpenCode 免费推理 POST 还需找到 Bun executable，缺失会生成配置错误；目录等非 POST 可经其他网络路径成功。这解释了为何只验证发现接口不能验收这个组合。候选按各自通道发送，跨通道故障转移还要考虑接收方变化。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.js:285-330](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L285-L330)

外层按提交点与 advance 决定是否尝试下一候选。

<details>
<summary>查看原文（46行）</summary>

```text
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `the chain "${entry.name}" has no model available on this egress`, code: CODE.server } } }
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = committed ? await iterator.next() : await nextOrSilence(iterator, CHAIN_SILENCE_MS)
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
          held.length = 0
        }
      }
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
    }
    rejectedTurn(candidates.length)
    yield { type: 'finish', reason: { kind: 'error', failure: {
      message: `the chain "${entry.name}" exhausted every candidate: ${tried.join('; ')}`,
      code: CODE.server,
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:382-396](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L382-L396)

匿名断路器前置抛出额度异常。

<details>
<summary>查看原文（15行）</summary>

```text
    const freeLane = !sealed && !kilo && !aggregate && !extension && !isComboEntry(entry) && !isSubscriptionEntry(entry)
    if (freeLane) {
      // The quota breaker: a window the upstream opened on this egress is a
      // wall no model/session/UA choice moves (issue #767 measured exactly
      // that), so the lane refuses locally instead of feeding the wall another
      // request. `重试` here means changing the exit or waiting for `retryAt`.
      const gate = this.deps.freeLaneGate?.()
      if (gate?.ok === false) {
        const when = Number.isFinite(gate.retryAt) ? new Date(gate.retryAt).toISOString() : 'until the exit changes'
        throw new UpstreamError(
          `the OpenCode free quota window is open on this egress${gate.message ? `: ${gate.message}` : ''} — retry after ${when}, or switch the lane's exit proxy; Kilo and extension channels are unaffected`,
          CODE.quota,
          { ...(Number.isFinite(gate.retryAt) ? { providerRetryAfterMs: Math.max(1000, gate.retryAt - Date.now()) } : {}), laneQuota: true, laneState: gate.state })
      }
    }
```

</details>

**依据 3 · 源码核查**：[src/adapter.js:986-994](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L986-L994)

文本、工具与推理块的提交判据。

```text
function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
}
```

**依据 4 · 源码核查**：[src/adapter.js:543-569](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L543-L569)

候选可交给不同上游与传输。

<details>
<summary>查看原文（27行）</summary>

```text
      const request = (sealed
        ? postSealedTurn(this.deps, payload, controller.signal, value => channel.push(value))
        : kilo
          ? postKiloStreamed({ body: payload, signal: controller.signal, onData: value => channel.push(value) })
          : aggregate
            ? postAggregateStreamed({
              config: settings.aggregate ?? {},
              providerId: entry.providerId,
              modelId: entry.modelId,
              body: payload,
              session,
              signal: controller.signal,
              onData: value => channel.push(value),
            })
            : extension
              ? this.deps.extensionRuntime.prepareChat(entry, payload, session)
                .then(prepared => postCompatibleStreamed({
                  ...prepared,
                  signal: controller.signal,
                  onData: value => channel.push(value),
                }))
              : postStreamed({
          path: endpointFor(entry.id), body: payload, session,
          attributionUserAgent: snapshot.attributionUserAgent,
          signal: controller.signal,
          onData: value => channel.push(value),
        }))
```

</details>

**依据 5 · 源码核查**：[src/egress.js:225-254](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/egress.js#L225-L254)

列举读取路径与推理所需 Bun 及缺失时的配置错误。

<details>
<summary>查看原文（30行）</summary>

```text
    // The read still leaves through the lane's own exit. An address chosen to
    // move this lane is not un-chosen by the request being a GET: borrowing the
    // real one for the roster would advertise a different client than the turns
    // use. The global relay already carries it (its HTTP path, below); a custom
    // or environment address needs the tunnel here.
    if (!isPost) {
      if (laneProxy !== null && freeLaneProxy !== null) return laneProxiedFetch(url, init, laneProxy)
      if (laneProxy !== null && relay === null) return laneProxiedFetch(url, init, laneProxy)
      if (relay !== null) return relayFetch(url, init, relay)
      return fetch(url, init)
    }
    const executable = findBunExecutable()
    if (!executable) {
      // This sentence is the user's only answer until they install Bun, so it
      // carries the fix inline, bilingually, without an "upstream failed" wrap.
      const error = new Error('OpenCode 免费车道推理需要本机 Bun：请安装 Bun（https://bun.sh 或 npm i -g bun）后重试，或把 Bun 可执行文件路径写入 OUR_FREE_MODEL_BUN 环境变量。/ Install Bun or set OUR_FREE_MODEL_BUN to its executable path (OUR_FREE_MODEL_FREE_TRANSPORT=node restores the legacy transport).')
      error.laneConfig = true
      throw error
    }
    if (relay?.dead) throw new Error('the configured egress relay is not running')
    // With no explicit proxy, the Bun worker inherits this process's
    // HTTP_PROXY/HTTPS_PROXY/NO_PROXY — Bun honors them natively, which is
    // exactly the configuration issue #708's script used.
    const proxy = freeLaneProxy !== null || relay !== null ? laneProxy?.href : undefined
    if (url instanceof Request) {
      const request = new Request(url, init)
      const body = request.body ? new Uint8Array(await request.arrayBuffer()) : undefined
      return bunFetch(request.url, { ...init, method: request.method, headers: request.headers, body, signal: request.signal, redirect: request.redirect }, { executable, proxy })
    }
    return bunFetch(url, init, { executable, proxy })
```

</details>

#### 缺口

- 未在真实会话用相同出口制造连续限流并重试
  **影响**：只能确认路径，无法量化失败与接管频率
  **进一步探讨**：用受控端点分开记录首轮候选返回错误、复用已开断路器和输出后失败，核对后续端点是否收到请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 更新提示、包管理器升级归属与 Gemini 余额出网有哪些实际变化？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

新版将重载确认从浏览器 origin 的本地缓存延伸到服务端配置。页面拿到元数据后依据 reloadNoticeSeen 和本地记录决定提示，再把当前时间戳 POST 回宿主；宿主只接受匹配当前重载的正整数，刷新配置后检查写失败。首次迁移会把没有相伴确认字段的旧 reloadedAt 采用为已见，避免进程重启换端口时重放旧提示，也可能消化一个从未收到的历史提醒。同时打开的多个页面在服务端写回前可各自读取同一未确认值，源码不提供跨页面原子的恰好一次保证。升级器现在从最近的 node_modules 反推 profile，对带 scope 的路径也寻找同一层的 pnpm 锁与安装标记，命中归属便在动事务前返回冲突，读不到标记则无法据此拒绝。账号渠道另在有 credentials、commands、llm 的子作用域加载打包入口；Gemini 余额缓存失效或强制查询时，RPC 现在把渠道 network.fetch 交给请求，复用已配置出口。修补针对这一查询，未证明所有渠道请求或代理异常下都走同一出口。桌面高 DPI 窗口与托盘 WebView 变更在独立壳，不归入 DSH 插件效果。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:169-185](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/index.js#L169-L185)

旧设置确认的迁移条件。

<details>
<summary>查看原文（17行）</summary>

```text

  if (generation > 1) {
    settings.update({ reloadedAt: Date.now(), reloadCount: generation - 1 })
    settings.flush()
  } else {
    // Before issue #761 the only "already seen" marker lived in the browser's
    // origin-scoped localStorage. A settings file from that build can carry an
    // old reloadedAt with no acknowledgement beside it; adopting it here keeps
    // a plain process restart (a new desktop port is a new origin) from
    // replaying a stale notice. A genuinely new reload writes a new timestamp.
    const stored = settings.get()
    const at = Number(stored.reloadedAt ?? 0)
    const seen = Number(stored.reloadNoticeSeen ?? 0)
    if (Number.isSafeInteger(at) && at > 0 && seen === 0) {
      settings.update({ reloadNoticeSeen: at })
      settings.flush()
    }
```

</details>

**依据 2 · 源码核查**：[client.js:8374-8393](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/client.js#L8374-L8393)

客户端提示条件和确认调用。

<details>
<summary>查看原文（20行）</summary>

```text
    function reloadNoticePlan(meta, cached) {
      const at = Number(meta?.reloadedAt ?? 0)
      if (!Number.isFinite(at) || at <= 0) return { at: 0, show: false }
      const seen = Number(meta?.reloadNoticeSeen ?? 0)
      if (seen === at) return { at, show: false }
      if (cached !== undefined && cached !== null && String(at) === String(cached)) return { at, show: false }
      return { at, show: true }
    }

    /** Show the toast at most once, and retry any missing server acknowledgement. */
    async function announceReloadNotice(meta, cached, { show, ack, remember }) {
      const plan = reloadNoticePlan(meta, cached)
      if (plan.at <= 0) return { ...plan, shown: false }
      remember(plan.at)
      if (plan.show) show(plan)
      if (Number(meta?.reloadNoticeSeen ?? 0) !== plan.at) {
        try { await ack(plan.at) } catch { /* retry on the next check without repeating the toast */ }
      }
      return { ...plan, shown: plan.show }
    }
```

</details>

**依据 3 · 源码核查**：[index.js:1981-1997](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/index.js#L1981-L1997)

元数据接口与确认端点的匹配和落盘失败响应。

<details>
<summary>查看原文（17行）</summary>

```text
      if (method === 'GET' && routePath === '/meta') {
        return send(200, { ...deps.meta(), feed: { fetchedAt: deps.announcements.view().fetchedAt, source: deps.announcements.view().source, error: deps.announcements.view().error }, update: deps.update.status() })
      }
      if (method === 'POST' && routePath === '/reload-notice/ack') {
        const body = await readJson(req)
        const at = body?.at
        const current = Number(deps.settings.get().reloadedAt ?? 0)
        // Only the timestamp this process announced may be acknowledged: an
        // older page or a hand-written request must not pre-mark a future
        // reload as seen.
        if (typeof at !== 'number' || !Number.isSafeInteger(at) || at <= 0 || at !== current) {
          return send(400, { error: 'at must match the current reloadedAt' })
        }
        deps.settings.update({ reloadNoticeSeen: at })
        deps.settings.flush()
        if (deps.settings.writeFailed === true) return send(500, { error: 'could not persist settings' })
        return send(200, { ok: true, reloadNoticeSeen: at })
```

</details>

**依据 4 · 源码核查**：[src/updater.js:859-879](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/updater.js#L859-L879)

从 node_modules 定位 profile 再检查归属。

<details>
<summary>查看原文（21行）</summary>

```text
export function isPackageManagerOwned(pkgDir, packageName = PACKAGE_NAME) {
  const profileDir = profileDirOf(pkgDir)
  const lockfile = readTextFile(path.join(profileDir, 'pnpm-lock.yaml'))
  if (lockfile !== undefined && lockfileDeclaresPackage(lockfile, packageName)) return true
  const modules = readTextFile(path.join(profileDir, 'node_modules', '.modules.yaml'))
  return modules !== undefined && modulesHoistsPackage(modules, packageName)
}

/**
 * The profile root a package directory belongs to.
 *
 * A bare install is <profile>/node_modules/<name>; a scoped one is
 * <profile>/node_modules/@scope/<name>. Walking to node_modules instead of
 * counting two parents keeps both layouts pointed at the profile, where pnpm
 * writes its lockfile and .modules.yaml (issue #773).
 */
export function profileDirOf(pkgDir) {
  let dir = path.resolve(pkgDir)
  while (dir !== path.dirname(dir) && path.basename(dir) !== 'node_modules') dir = path.dirname(dir)
  return path.dirname(dir)
}
```

</details>

**依据 5 · 源码核查**：[src/updater.js:1129-1141](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/updater.js#L1129-L1141)

命中归属时在升级事务前拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
    if (upgradeLocks.has(this.deps.pkgDir)) throw new Error('an upgrade is already running')
    // A package-manager-owned copy is refused before any transaction state is
    // touched or a manifest is fetched: the in-app upgrader would be a second
    // writer on a directory pnpm replaces atomically, which corrupts the
    // install on Windows.
    if (isPackageManagerOwned(this.deps.pkgDir)) {
      throw Object.assign(new Error(PACKAGE_MANAGER_REFUSAL), { statusCode: 409 })
    }
    this.reconcileRecovery()
    const priorState = this.loadUpgradeState()
    if (['installing', 'activating', 'recovery-required'].includes(priorState?.phase)) {
      throw new Error(`previous upgrade requires recovery; restore the verified backup in ${this.backupDir} and restart before upgrading again`)
    }
```

</details>

**依据 6 · 源码核查**：[index.js:1123-1142](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/index.js#L1123-L1142)

渠道包的实际加载与宿主依赖。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.inject(['credentials', 'commands', 'llm'], scoped => {
    let stopped = false
    scoped.effect(() => () => { stopped = true }, 'our-free-model: channel pack')
    // Dynamic import: the pack's own imports (the kernel's llm and credential
    // modules) are host-provided, and a composition that lacks them must still
    // load this plugin's free lane. `pack.js` is the bundled form of the
    // vendored tree (see scripts/build-channel-pack.mjs) — one file, so the
    // release manifest stays inside its file cap.
    void import('./vendor/channel-pack/pack.js').then(pack => {
      if (stopped) return
      pack.apply(scoped, {
        disableOpencode: true,
        outlet: { active: egressActive, fetch: egressFetch },
      })
      channelPack = { state: 'ready', error: '' }
      logger.info?.('our-free-model: free-channel pack mounted (10 account providers)')
    }).catch(error => {
      if (stopped) return
      channelPack = { state: 'failed', error: String(error?.message ?? error).slice(0, 300) }
      logger.warn?.(`our-free-model: free-channel pack unavailable (${channelPack.error})`)
```

</details>

**依据 7 · 源码核查**：[vendor/channel-pack/pack.js:65536-65545](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/vendor/channel-pack/pack.js#L65536-L65545)

发布使用的渠道包把出口实现接到 RPC 配置。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.effect(() => () => {
    void geminiSigStore.flush().catch(() => {
    });
  });
  registerChannelPackRpc(ctx, pool, lobsterai, qoder, qoderCn, trae, cline, loomy, raccoon, minimax, zcode, gemini, modelAdapters, {
    ...config,
    // ⚠️ 配额等附属查询必须复用同一出口；省略会让 gemini-credits 回落到裸 fetch。
    fetcher: network.fetch
  });
  mountOpenAiGateway(ctx, pool);
```

</details>

**依据 8 · 源码核查**：[vendor/channel-pack/pack.js:58736-58749](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/vendor/channel-pack/pack.js#L58736-L58749)

Gemini 查询分支传递 fetcher。

<details>
<summary>查看原文（14行）</summary>

```text
        }
        if (req.provider === GEMINI.id) {
          const values = await collectCreditBalances(accounts, GEMINI, {
            resolve: (ref) => ctx.credentials.resolve(ref),
            fetchBalanceDetailed: async (credential) => {
              const { balance, error, tier } = await fetchGeminiCreditBalance(credential, GEMINI, {
                force: req.force === true,
                ...config.fetcher === void 0 ? {} : { fetcher: config.fetcher }
              });
              const extra = tier === void 0 ? void 0 : { accountTier: { label: tier.label, title: `${tier.name}\uFF08${tier.id}\uFF09` } };
              return {
                balance,
                ...error === void 0 ? {} : { error },
                ...extra === void 0 ? {} : { extra }
```

</details>

**依据 9 · 源码核查**：[vendor/channel-pack/pack.js:54033-54044](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/vendor/channel-pack/pack.js#L54033-L54044)

缓存判断与实际配额请求。

<details>
<summary>查看原文（12行）</summary>

```text
async function fetchGeminiCreditBalance(credential, _product = GEMINI, options = {}) {
  const token = credential.access_token ?? "";
  if (token === "") return { balance: null, error: GEMINI_UNAUTHORIZED_MESSAGE };
  const now = options.now?.() ?? Date.now();
  if (options.force !== true) {
    const cached2 = cache2.get(token);
    if (cached2 !== void 0 && now - cached2.at < GEMINI_QUOTA_CACHE_TTL_MS) return cached2.result;
  }
  const result = await requestQuota(credential, options.fetcher ?? fetch);
  cache2.set(token, { at: now, result });
  return result;
}
```

</details>

**依据 10 · 源码核查**：[packages/desktop/src-tauri/src/lib.rs:114-142](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/packages/desktop/src-tauri/src/lib.rs#L114-L142)

独立桌面壳的窗口和 WebView 处理。

<details>
<summary>查看原文（29行）</summary>

```text
/// 150–200% scaling a 1280×800 window can be taller than a 1920×1200 screen
/// once the taskbar is removed; `center()` then places the bottom under the
/// taskbar and the sidebar footer is cut off (issue #766). Clamp both the
/// initial size and the minimum to the logical work area so the window can
/// always fit.
fn fit_window_to_work_area(
    work: (u32, u32),
    scale: f64,
    desired: (f64, f64),
    minimum: (f64, f64),
) -> ((f64, f64), (f64, f64)) {
    let scale = if scale.is_finite() && scale > 0.0 { scale } else { 1.0 };
    let work_width = (work.0 as f64 / scale).max(1.0);
    let work_height = (work.1 as f64 / scale).max(1.0);
    let min_width = minimum.0.min(work_width);
    let min_height = minimum.1.min(work_height);
    let width = desired.0.min(work_width).max(min_width);
    let height = desired.1.min(work_height).max(min_height);
    ((width, height), (min_width, min_height))
}

/// Hide or show the WebView2 child together with the window.
///
/// `WebviewWindow::hide()` only hides the native window; the WebView2
/// controller keeps `IsVisible(true)` and keeps compositing the page's
/// infinite CSS animations (issue #804). `Webview::hide()` reaches
/// `ICoreWebView2Controller::SetIsVisible(false)` through wry, so the GPU
/// process can go idle while the app stays in the tray.
fn set_main_webview_visible(app: &tauri::AppHandle, visible: bool) {
```

</details>

#### 缺口

- 未运行升级、设置写失败或有代理的余额请求
  **影响**：不能量化维护负担降低，也不能保证宿主权限和网络行为
  **进一步探讨**：分别用双页面、只读配置、scoped 安装和受控代理测试提示重复、冲突响应及配额请求实际去向

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 公开样例试用和退出的完整负担是什么？

**研究主题**：效果与总成本、采用判断、场景与需求

#### 完整回答

可以保留既有端点，在隔离 profile 仅选择一个已确认接收条件的通道。根包清单声明版本 2.8.3、private 和宿主 peer 范围；作者另声明 scoped npm 名及 Release 对应关系，并明确同名无 scope 包另有来源。当前只审阅固定 Git，尚无制品字节及宿主兼容对照。文本测试只查正常结束、非空正文和意外工具，还需独立比对多轮工具参数。据固定默认值，回环及局域网转发都关闭。回环监听启用后有无 Key 的健康检查，以及需凭据的模型和生成端点。现金与资源开销取决于各上游的计费、请求重放次数与运行环境，人工要承担制品核对、接收方许可和失败检查，二者都无同任务测量。若清单可见却无法生成、回退提前失败，或请求去向不能核对，就禁用该 bundle 与新增监听，切回原端点；清除本地配置与确认上游留存条件是两个动作。因采用证据仍限固定源码，结论保留观察。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-9](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/package.json#L1-L9)

源码中的包版本和分发声明。

```text
{
  "name": "dsh-our-free-model",
  "version": "2.8.3",
  "private": true,
  "type": "module",
  "description": "Our Free Model — 在 dsh 里装上这个插件即可，无需登录、注册或填 API Key，就能使用包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型，桌面端另有 EAC 协付渠道；2.0 起接入 LobsterAI、Qoder、TRAE、Cline、Loomy、Raccoon、MiniMax、ZCode、Gemini 十个账号渠道（原有匿名免费通道保留）（登录、账号池、积分领取、本地 OpenAI 网关与局域网转发、数据看板与运行日志），六页毛玻璃界面统一呈现。",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Ebony-Vinyl/dsh-our-free-model.git"
```

**依据 2 · 源码核查**：[package.json:122-141](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/package.json#L122-L141)

Node 范围、挂载与宿主 peer 依赖。

<details>
<summary>查看原文（20行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": []
    }
  },
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-commands": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.4"
```

</details>

**依据 3 · 作者声明**：[README.md:121-134](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/README.md#L121-L134)

作者对 scoped npm 包、Release 和无 scope 包来源的区分。

<details>
<summary>查看原文（14行）</summary>

````text
## 安装

> **⚠️ 不要安装 npm 上那个裸名的 `dsh-our-free-model`。**
>
> npm 上的 `dsh-our-free-model` 包**不是本仓库发布的**。它由第三方打包，内容与本仓库
> 不一致：`index.js`、`client.js` 被改动，并额外包含本仓库从未有过的
> `src/channel-visibility.js`。装到它得不到本项目审核过的构建，也拿不到本仓库的签名
> 清单校验与应用内升级。
>
> 本仓库自己发布的是带 scope 的 **`@ebony-vinyl/dsh-our-free-model`**，与 Release 的
> `dsh-our-free-model-<版本>.tgz` 同源、同版本。只想走 npm 时可以装它：
>
> ```
> dsh plugin --profile web add @ebony-vinyl/dsh-our-free-model@2.8.3
````

</details>

**依据 4 · 源码核查**：[src/model-test.js:22-42](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/model-test.js#L22-L42)

文本测试的检查和失败路径。

<details>
<summary>查看原文（21行）</summary>

```text
    if (chunk.type === 'tool-call-delta' || (chunk.type === 'block-end' && chunk.block?.type === 'tool-call'))
      throw new UpstreamError('Text test returned an unexpected tool call', CODE.server)
    if (chunk.type === 'usage') usage = chunk.usage
    if (chunk.type === 'finish') {
      if (chunk.upstreamFinish !== undefined && !['stop', 'end_turn', 'stop_sequence'].includes(chunk.upstreamFinish))
        throw new UpstreamError('Text test did not finish normally: ' + String(chunk.upstreamFinish), CODE.server)
      if (chunk.reason?.kind !== 'stop')
        throw new UpstreamError(chunk.reason?.failure?.message ?? chunk.reason?.kind ?? 'Text test did not finish normally', chunk.reason?.failure?.code ?? CODE.server)
      finished = true
    }
  }
  if (!finished) throw new UpstreamError('Text test ended without a normal finish', CODE.empty)
  if (!text.trim()) throw new UpstreamError('Text test returned no response text', CODE.empty)
  const ended = now()
  const measured = decodeWindow(firstFrame === undefined ? 0 : ended - firstFrame, windowTokens(usage, sawReasoning), true)
  return {
    totalMs: ended - started, latencyMs: ended - started,
    ttftMs: firstFrame === undefined ? ended - started : firstFrame - started,
    outputTokens: usage?.outputTokens ?? 0, reasoningTokens: usage?.reasoningTokens ?? 0,
    tokensPerSecond: measured.tps, sample: text.slice(0, 60), text: text.slice(0, 2000),
  }
```

</details>

**依据 5 · 源码核查**：[src/store.js:188-206](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/store.js#L188-L206)

回环、局域网转发和渠道网关默认值。

<details>
<summary>查看原文（19行）</summary>

```text
  /** Serve the OpenAI-compatible forward listener for other local harnesses. */
  forward: {
    enabled: false,
    host: '127.0.0.1',
    port: 18899,
    /** Reach that listener from other machines on the network; off by default,
     *  binds a routable address, and demands a key of its own (`forwardLanKey`). */
    lan: { enabled: false, port: 0 },
  },
  /** Route inference/probe traffic through an outlet. `mode: 'subscription'`
   *  spawns a local mihomo that load-balances a Clash subscription; `mode:
   *  'client'` dials one http/https/socks5/socks5h URL directly. Off by
   *  default — requests go straight out until this is turned on. */
  egress: { enabled: false, mode: 'subscription', url: '', mihomoPath: '' },
  /** Expose the absorbed channels' OpenAI gateway (the pack's loopback
   *  listener) to other machines under this plugin's own key. Off by default:
   *  a LAN listener is a door, and doors stay shut until asked for. */
  chanGateway: {
    relay: { enabled: false, host: '127.0.0.1', port: 18326, key: '' },
```

</details>

**依据 6 · 源码核查**：[src/forward.js:361-394](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/forward.js#L361-L394)

健康检查与推理、目录的鉴权边界。

<details>
<summary>查看原文（34行）</summary>

```text
    // Liveness only, and deliberately before the key check: a caller probing
    // whether the port is up must not need the key to get an answer. It gets a
    // count of nothing — the model roster is what the authenticated routes serve.
    if (path === '/' || path === '/health') {
      json(res, 200, health())
      return
    }
    const googleKey = req.headers['x-goog-api-key'] ?? url.searchParams.get('key')
    const googleAuthorized = gemini && typeof settings.key === 'string' && settings.key !== ''
      && keyMatches(googleKey, settings.key)
    if (!authorized(req, settings.key) && !googleAuthorized) {
      if (gemini) { geminiError(res, 401, 'missing or invalid API key'); return }
      openAiError(res, 401, 'invalid_request_error', 'missing or invalid API key')
      return
    }
    if (gemini) {
      await serveCompletion(req, res, complete, geminiEndpoint({ readBody, json, modelRows, route: gemini, url }), heartbeatMs, trace)
      return
    }
    if (req.method === 'GET' && (path === '/v1/models' || path === '/models')) {
      json(res, 200, { object: 'list', data: modelRows() })
      return
    }
    if (req.method === 'POST' && (path === '/v1/chat/completions' || path === '/chat/completions')) {
      await serveCompletion(req, res, complete, chatCompletions, heartbeatMs, trace, { optimize })
      return
    }
    if (req.method === 'POST' && (path === '/v1/responses' || path === '/responses')) {
      await serveCompletion(req, res, complete, responsesEndpoint, heartbeatMs, trace, { optimize })
      return
    }
    if (req.method === 'POST' && (path === '/v1/messages' || path === '/messages')) {
      await serveCompletion(req, res, complete, messagesEndpoint, heartbeatMs, trace, { optimize })
      return
```

</details>

#### 缺口

- 没有核对制品、外部条款与相同任务的调用成本
  **影响**：只能做准备和退出判断，难以推荐持续采用
  **进一步探讨**：在核实同版本制品及服务条款后用公开样例比较端点请求数、合格结果、处理时间与退出步骤

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何让组合自动回退服从单个任务的数据接收方限制？

**研究主题**：新假设与验证

#### 完整回答

目前组合可按一次任务的候选配置和失败判据自动派发，但候选分派代码按通道选择不同传输，给所有候选一个相同的任务输入条件不等于用户批准了每个接收方。可以尝试在生成首个请求体之前为任务设置有版本的接收方集合，并在进入候选之前解析应发往的实际服务。候选映射不明或不在集合便拒发，给出明确原因并继续检查剩余候选，所有候选均拒绝时返回未发送。这样的限制或能保留已批准渠道间的自动回退，同时减少误发；映射失效、别名或负载转发可能使系统误拒或错放。可比较原始组合和受限组合在模拟公开及受限标签下的接收端请求日志、成功率、额外配置和故意过期映射时的失败，若无法降低误发或使已许可任务显著失效率升高则否定当前设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.js:282-307](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L282-L307)

候选计划交给 runSingle 的入口。

<details>
<summary>查看原文（26行）</summary>

```text
    const candidates = comboChain(entry, snapshot.catalog, snapshot.routing ?? {})
    if (candidates.length === 0) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `the chain "${entry.name}" has no model available on this egress`, code: CODE.server } } }
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = committed ? await iterator.next() : await nextOrSilence(iterator, CHAIN_SILENCE_MS)
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:530-569](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/edfdaf2cb64bb39c7c682b90c96ef9e3fef3be15/src/adapter.js#L530-L569)

进入具体渠道传输前可约束，传输实际分支随候选变化。

<details>
<summary>查看原文（40行）</summary>

```text
      const renameMap = sealed || kilo || aggregate || extension ? new Map() : applyFingerprint(payload, wire === 'messages' ? 'claude' : style === 'flat')
      const controller = new AbortController()
      const onAbort = () => controller.abort(options.signal?.reason)
      options.signal?.addEventListener('abort', onAbort, { once: true })
      const remainingMs = Math.max(1, policy.totalTimeoutMs - (attemptStarted - started))
      let expired = false
      const timeoutMs = recovering ? Math.min(policy.maxContinuationMs, remainingMs) : remainingMs
      const timer = policy.enabled ? setTimeout(() => {
        expired = true
        controller.abort()
      }, timeoutMs) : undefined
      timer?.unref?.()
      const channel = createChannel()
      const request = (sealed
        ? postSealedTurn(this.deps, payload, controller.signal, value => channel.push(value))
        : kilo
          ? postKiloStreamed({ body: payload, signal: controller.signal, onData: value => channel.push(value) })
          : aggregate
            ? postAggregateStreamed({
              config: settings.aggregate ?? {},
              providerId: entry.providerId,
              modelId: entry.modelId,
              body: payload,
              session,
              signal: controller.signal,
              onData: value => channel.push(value),
            })
            : extension
              ? this.deps.extensionRuntime.prepareChat(entry, payload, session)
                .then(prepared => postCompatibleStreamed({
                  ...prepared,
                  signal: controller.signal,
                  onData: value => channel.push(value),
                }))
              : postStreamed({
          path: endpointFor(entry.id), body: payload, session,
          attributionUserAgent: snapshot.attributionUserAgent,
          signal: controller.signal,
          onData: value => channel.push(value),
        }))
```

</details>

#### 缺口

- 候选与最终服务的映射准确性、维护工时与可恢复性未知
  **影响**：仍属未验证方案，不能计入项目现有贡献
  **进一步探讨**：用可记录请求的两个受控端点与人为配置过期的映射做同任务对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
