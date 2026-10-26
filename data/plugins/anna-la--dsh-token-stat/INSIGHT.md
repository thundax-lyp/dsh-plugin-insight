# dsh-token-stat

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[679a537](https://github.com/Anna-la/dsh-token-stat/tree/679a537f0c01be0b20f87677b173a1b7120c2b6b)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：读取DSH会话日志累计token用量，按模型和日期展示，并保留报告及归档账本。

> **核心亮点**：独立归档让用量可跨日志删除保留，设置页和目录迁移降低长期维护门槛。[Q03](#research-q03) 主要贡献是生命周期组织，计量语义沿用既有usage。

> **风险与缺陷**：模型工具只汇总当前folds，设置视图和报表合并归档；已删除会话可能造成入口口径不同。[Q04](#research-q04) 缓存字段和重试账单也不能由源码计数直接推断。

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
  - [Q01 · 用户应拿这些统计做什么判断？](#detail-section-11)
  - [Q02 · 历史扫描、实时事件和归档如何连接？](#detail-section-12)
  - [Q03 · 相比单次用量显示，归档账本新增什么？](#detail-section-13)
  - [Q04 · 哪些口径或实现差异会误导累计结果？](#detail-section-14)
  - [Q05 · 启动、存储迁移与清空操作有哪些前提？](#detail-section-15)
  - [Q06 · 完整账本的资源负担和工程边界是什么？](#detail-section-16)
  - [Q07 · 统一来源口径与覆盖率标记能否改善预算判断？](#detail-section-17)
  - [Q08 · 哪些人值得试用，哪些判断应暂停？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合查看长期模型用量构成和日期趋势的DSH维护者；交付为可核对用量账本。

参照单请求usage显示和手工日志回放；比较机制和生命周期，未测节时或账单一致性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 历史与实时累计 | 长期用量趋势 | 仅供应商已上报usage；顺序替换语义 |
| 归档保留 | 删除日志后保持历史 | archive损坏后缺原日志不能重建 |
| 设置页和工具 | 查看分项与趋势 | 工具当前未合并仅归档存在会话 |
| 迁移与清空 | 管理账本 | 清空会持久忽略既有会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node文件与zstd API | 日志解析必需 | 历史回放 | 压缩日志可能无法读取 |
| DSH sessions及事件 | 实时必需 | 会话封存与增量 | 只能保留可扫日志或已有归档 |
| settings/webServer/Web slots | 界面及配置必需 | 查看与管理报告 | 相应入口降级 |
| 独立可写报告目录 | 账本必需 | 保存三文件 | 保存失败仅日志提示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装并重启profile | 扫描状态和目录可见 |
| 2 | 核对已知会话分项及缓存口径 | JSON与设置数值一致 |
| 3 | 删除测试日志后对比工具与设置 | 如入口不同先停止计费性使用 |
| 4 | 先备份再迁移或清空 | 确认ignored语义及恢复办法 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 全量日志I/O和归档；金额未知 | 核对扫描覆盖及分项；耗时未知 | 日志规模决定资源负担 |
| 持续使用 | fold内存、节流写盘、15秒UI刷新 | 校验缺usage与口径 | 性能未测 |
| 失败恢复 | 备份与重新回放 | 处理损坏归档、遗漏与ignored | 删除原日志后不能完整重建历史 |
| 迁移退出 | 独立报告目录仍保留 | 备份三文件并核对迁移 | 跨卷重建而非保证原子迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 长期趋势 | 按模型日期聚合及归档机制 | 实际账单精度和遗漏率 |
| 跨删除连续性 | 归档保留会话最后值 | 工具与设置能否一致 |
| 使用成本 | 不修改原会话日志 | 首扫耗时、维护工时和节约金额 |

> **思考**：模型工具只汇总当前folds，设置视图和报表合并归档；已删除会话可能造成入口口径不同。[Q04](#research-q04) 缓存字段和重试账单也不能由源码计数直接推断。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：独立归档让用量可跨日志删除保留，设置页和目录迁移降低长期维护门槛。[Q03](#research-q03) 主要贡献是生命周期组织，计量语义沿用既有usage。

独立归档让用量可跨日志删除保留，设置页和目录迁移降低长期维护门槛。[Q03](#research-q03) 主要贡献是生命周期组织，计量语义沿用既有usage。

纯折叠函数、按会话归档和实时缓冲易于测试与复用；独立存储隔离宿主清理。非事务多文件写入、损坏归档静默退化及多入口聚合分叉需要补强。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型工具只汇总当前folds，设置视图和报表合并归档；已删除会话可能造成入口口径不同。[Q04](#research-q04) 缓存字段和重试账单也不能由源码计数直接推断。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议需长期用量趋势的维护者受控试用并核对多入口一致性；暂不用于财务结算或精确账单。[Q08](#research-q08)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认源码中的累计、归档和展示机制；累计工具与设置存在聚合路径差异，账单精度和效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.mjs、lib/client.js、lib/index.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核查核心折叠、归档、扫描、工具和前端路径；未运行日志回放、测试或真实宿主。
- 下一步：固定已知usage样本，含相邻重试、乱序、缺字段和已删除会话，对照设置、工具及JSON三入口；再比供应商账单，不以累计数冒充金额。

**分析版本**

- **仓库**：[Anna-la/dsh-token-stat](https://github.com/Anna-la/dsh-token-stat)
- **版本号**：1.0.0（[固定提交 679a537](https://github.com/Anna-la/dsh-token-stat/tree/679a537f0c01be0b20f87677b173a1b7120c2b6b)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是统一归档聚合并显示覆盖率及字段口径，可改善预算诊断可信度；以入口一致性和用户误判率验证。[Q07](#research-q07)

固定已知usage样本，含相邻重试、乱序、缺字段和已删除会话，对照设置、工具及JSON三入口；再比供应商账单，不以累计数冒充金额。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 2449 | 1959 | 327 | — |
| .js | source | 2 | 721 | 645 | 43 | — |
| .md | source | 1 | 143 | — | — | 1810 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Anna-la/dsh-token-stat/issues?q=is%3Aissue+created%3A2026-09-23T07%3A59%3A08.760Z..2026-10-23T07%3A59%3A08.760Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Anna-la/dsh-token-stat/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A59%3A08.760Z..2026-10-23T07%3A59%3A08.760Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨会话token账本能支持什么使用判断，折叠语义、归档一致性及账单边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户应拿这些统计做什么判断？

**研究主题**：场景与需求

#### 完整回答

面向希望查看DSH长期模型用量构成与日期趋势的个人或维护者。合格输出是有来源范围、扫描状态和分类口径的累计用量，不是供应商精确账单或团队成本归因。README把累计输入、缓存读写、输出及模型日期明细作为交付；源码确实折叠usage并生成Markdown/JSON。原有办法是查看单次usage或自己回放日志，该插件把历史折叠、归档与设置页串联。作者称99.5%消息有usage是其材料声明，本轮没有独立复算此比例。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/README.md#L1-L15)

作者界定长期累计和只读日志。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-token-stat

DeepSeek Harness 插件：统计使用 DSH 以来**累计 token 用量**，并按**模型 / 日期**区分明细；统计结果在**设置页**直接点击查看，**数据保存目录可在设置页在线更改**。

- 零运行时依赖（不 import 任何 `@deepseek-ai/*`，`dsh plugin add` 后无需构建、无需 allowBuilds 授权）
- 不修改任何会话数据，只读会话日志做折叠统计
- 数据来自会话日志中供应商上报的精确 usage（与官方 `dsh-token-meter` 同一数据源）
- 同一 `(turn, step)` 步内的重试/重复上报只计最后一次采样，不重复计数
- **数据隔离**：报告默认写入 `~/.dsh-token-stat`（可用 `$DSH_TOKEN_STAT_DATA_DIR` 覆盖），
  完全位于 `DSH_HOME` 之外 —— 官方对 `profiles` / `storages` / `sessions`
  等目录的任何清理、重装都不会误删本插件的数据

## 安装（粘贴仓库地址即装）

本仓库根 `package.json` 声明了 `dsh.bundle`（补丁层 `cordis.patch.yml`）与
```

</details>

**依据 2 · 源码核查**：[index.mjs:142-185](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L142-L185)

用量分桶和会话折叠结构。

<details>
<summary>查看原文（44行）</summary>

```text
function bucketTotal(b) {
  return b.inputTokens + b.outputTokens + b.cacheReadTokens + b.cacheWriteTokens
}

function addBuckets(target, b) {
  target.inputTokens += b.inputTokens
  target.outputTokens += b.outputTokens
  target.cacheReadTokens += b.cacheReadTokens
  target.cacheWriteTokens += b.cacheWriteTokens
}

function subBuckets(target, b) {
  target.inputTokens -= b.inputTokens
  target.outputTokens -= b.outputTokens
  target.cacheReadTokens -= b.cacheReadTokens
  target.cacheWriteTokens -= b.cacheWriteTokens
}

function num(v) {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0
}

/** 本地时区日期 YYYY-MM-DD。 */
export function dayKey(timeMs) {
  const d = new Date(typeof timeMs === 'number' ? timeMs : Date.now())
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function modelKey(provider, model) {
  return `${provider}::${model}`
}

/** 新建一个会话的折叠状态。 */
export function createFold() {
  return {
    models: new Map(), // modelKey -> { provider, model, requests, input, output, cacheRead, cacheWrite }
    days: new Map(),   // 'YYYY-MM-DD' -> { requests, input, output, cacheRead, cacheWrite }
    last: null,        // { turn, step, key, day, buckets }
    route: null,       // 最近一次 request/context 的 { provider, model }
    messageCount: 0,   // 处理的 assistant/message 事件总数
    usageCount: 0,     // 带 usage 的 assistant/message 事件总数
    usageCalls: 0,     // 去重后的 usage 采样数(按 turn/step)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 历史扫描、实时事件和归档如何连接？

**研究主题**：功能与机制

#### 完整回答

启动时加载archive.json，再扫描内存会话和磁盘日志；没有磁盘文件才回退sessionPersistence。每会话seal后接受实时session/event，扫描未完成时缓冲事件；归档按会话ID覆盖并保留已删除会话。模型优先message.source，再用最近路由，缺失落unknown。相邻相同turn/step采样先减旧桶再加新桶，因此是替换语义而非把重试都相加。snapshotFoldValues把当前fold与归档中不在当前列表的会话合并；该合并用于设置视图和落盘。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:232-279](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L232-L279)

模型归属与相邻步替换。

<details>
<summary>查看原文（48行）</summary>

```text
      const data = event.data || {}
      const msg = data.message || {}
      const source = msg.source || {}
      fold.messageCount += 1
      const usage = data.usage
      if (!usage || typeof usage !== 'object') return fold
      fold.usageCount += 1

      // 模型归属: 优先消息自带 source,退回最近路由,最后 unknown
      const provider = typeof source.provider === 'string' && source.provider
        ? source.provider
        : (fold.route?.provider || 'unknown')
      const model = typeof source.model === 'string' && source.model
        ? source.model
        : (fold.route?.model || 'unknown')
      if (fold.route === null && provider !== 'unknown') {
        fold.route = { provider, model }
      }

      const buckets = {
        inputTokens: num(usage.inputTokens),
        outputTokens: num(usage.outputTokens),
        cacheReadTokens: num(usage.cacheReadTokens),
        cacheWriteTokens: num(usage.cacheWriteTokens),
      }
      const turn = data.turn
      const step = data.step
      const sameStep = fold.last !== null && fold.last.turn === turn && fold.last.step === step
      const key = modelKey(provider, model)
      const day = dayKey(event.time)

      if (sameStep) {
        // 同一步重试/重复上报: 替换旧采样,不重复计数
        const prev = fold.last
        const prevModel = fold.models.get(prev.key)
        if (prevModel) subBuckets(prevModel, prev.buckets)
        const prevDay = fold.days.get(prev.day)
        if (prevDay) subBuckets(prevDay, prev.buckets)
      } else {
        fold.usageCalls += 1
        ensureDay(fold, day).requests += 1
        ensureModel(fold, provider, model).requests += 1
      }

      addBuckets(ensureModel(fold, provider, model), buckets)
      addBuckets(ensureDay(fold, day), buckets)
      fold.last = { turn, step, key, day, buckets }
      return fold
```

</details>

**依据 2 · 源码核查**：[index.mjs:787-795](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L787-L795)

归档和当前视图合并。

```text
  /** 快照来源 = 当前 folds + 归档中已不在当前列表的会话(删除后仍计入)。 */
  function snapshotFoldValues() {
    for (const [id, fold] of folds) archiveSetFold(id, fold)
    const values = [...folds.values()]
    for (const [id, fold] of archive) if (!folds.has(id)) values.push(fold)
    return values
  }

  /**
```

**依据 3 · 源码核查**：[index.mjs:930-985](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L930-L985)

磁盘及服务回退路径。

<details>
<summary>查看原文（56行）</summary>

```text

  // ----- 历史扫描 -----
  async function scanAll() {
    scanning = true
    try {
      // 1) 当前内存中的 live 会话(最新、可能尚未落盘)
      if (sessionsSvc && typeof sessionsSvc.list === 'function') {
        for (const session of sessionsSvc.list()) seal(session.id, session.events)
      }

      // 2) 磁盘直扫(权威): <DSH_HOME>/sessions/<项目>/<会话>/session*.{zstd,jsonl}
      //    不依赖会话服务是否就绪,覆盖已关闭/已删除项目(日志仍在磁盘)。
      const files = walkSessionFiles(sessionsRoot)
      if (files.length > 0) {
        let sealedFromDisk = 0
        for (const file of files) {
          const id = path.basename(path.dirname(file))
          if (!id || sealed.has(id)) continue
          try {
            const events = await parseSessionFile(file)
            if (!sealed.has(id)) {
              seal(id, events)
              sealedFromDisk += 1
            }
          } catch (error) {
            lastScanError = error
            logger.warn?.('[token-stat] 读取会话文件失败,已跳过:', file, String(error))
          }
        }
        logger.info?.(
          `[token-stat] 磁盘直扫完成: 会话文件 ${files.length} 个,新封存 ${sealedFromDisk},共 ${sealed.size} 个(归档 ${archive.size} 条)`,
        )
      } else {
        // 3) 兜底: 非文件型后端(SQLite 等)走持久化服务
        if (persistenceSvc && typeof persistenceSvc.list === 'function') {
          let headers
          try {
            headers = await persistenceSvc.list()
          } catch (error) {
            lastScanError = error
          }
          for (const header of headers || []) {
            const id = header?.id
            if (!id || sealed.has(id)) continue
            try {
              const { events } = await persistenceSvc.readFrom(id, 0)
              if (!sealed.has(id)) seal(id, events)
            } catch (error) {
              lastScanError = error
              logger.warn?.('[token-stat] 读取会话失败,已跳过:', id, String(error))
            }
          }
          logger.info?.('[token-stat] 持久化服务扫描完成,共封存会话', sealed.size, '个(归档', archive.size, '条)')
        }
      }

```

</details>

**依据 4 · 源码核查**：[index.mjs:1150-1159](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L1150-L1159)

实时事件和启动扫描接线。

<details>
<summary>查看原文（10行）</summary>

```text
  // ----- 实时监听(global: true 接收所有会话,含子 agent) -----
  ctx.on('session/created', (session) => {
    if (session?.id && !sealed.has(session.id)) seal(session.id, session.events)
  })
  ctx.on('session/event', onSessionEvent, { global: true })

  // 启动历史扫描(异步,不阻塞加载)
  void scanAll()

  logger.info?.('[token-stat] 插件已就绪,开始统计历史 token 用量')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比单次用量显示，归档账本新增什么？

**研究主题**：贡献与相对优势

#### 完整回答

增量主要在跨会话、跨已删除日志生命周期的统计连续性，以及把报表、设置页、目录迁移组织为本地账本。单次请求usage无法自行提供长期历史保留，临时日志脚本也需要用户维护归档。核心聚合与SVG图表不是新的计量算法；同turn/step最后值语义继承作者明确参照的token-meter口径，不能算独立发明。可借鉴的是把原始日志只读消费与独立报告存储分开。其业务价值取决于使用者需要长期趋势，而非只想看当前请求。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:752-770](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L752-L770)

独立归档及ignored集合。

<details>
<summary>查看原文（19行）</summary>

```text
  const archive = new Map()
  /** 被「清空插件数据库」标记为忽略的会话 id(清空后不再从磁盘重新导入) */
  const ignored = new Set()
  let archivePath = path.join(reportDir, 'archive.json')
  loadArchiveSync()

  function loadArchiveSync() {
    try {
      const raw = fsSync.readFileSync(archivePath, 'utf8')
      const doc = JSON.parse(raw)
      for (const [id, obj] of Object.entries(doc.sessions || {})) {
        const fold = deserializeFold(obj)
        if (id && fold) archive.set(id, fold)
      }
      for (const id of doc.ignored || []) if (typeof id === 'string') ignored.add(id)
    } catch {
      /* 首次运行或归档损坏: 从空开始 */
    }
  }
```

</details>

**依据 2 · 源码核查**：[index.mjs:775-795](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L775-L795)

按会话归档和历史保留。

<details>
<summary>查看原文（21行）</summary>

```text
   * 局部/截断文件导致快照变小,拒绝用较小值覆盖,保证账本永不缩水。
   */
  function archiveSetFold(id, fold) {
    if (!fold) return
    const prev = archive.get(id)
    if (prev && fold.usageCalls < prev.usageCalls) {
      logger.warn?.('[token-stat] 归档拒绝较小快照(可能是截断文件):', id, prev.usageCalls, '->', fold.usageCalls)
      return
    }
    archive.set(id, fold)
  }

  /** 快照来源 = 当前 folds + 归档中已不在当前列表的会话(删除后仍计入)。 */
  function snapshotFoldValues() {
    for (const [id, fold] of folds) archiveSetFold(id, fold)
    const values = [...folds.values()]
    for (const [id, fold] of archive) if (!folds.has(id)) values.push(fold)
    return values
  }

  /**
```

</details>

**依据 3 · 作者声明**：[README.md:69-83](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/README.md#L69-L83)

作者解释统计口径和来源。

<details>
<summary>查看原文（15行）</summary>

````text
   `report.md` + `report.json` + `archive.json`（可在设置页卡片里随时改目录，
   三个文件会一起迁移）。

## 配置（可选，均为默认值）

```yaml
- insert:
    - id: token-stat
      name: token-stat
      config:
        enabled: true        # 总开关
        reportDir: ''        # 报告目录,默认 ~/.dsh-token-stat(DSH_HOME 之外)
        writeMd: true        # 写 Markdown 报告 report.md
        writeJson: true      # 写 JSON 快照 report.json
        debounceMs: 2000     # 实时事件落盘最小间隔
````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些口径或实现差异会误导累计结果？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把该总量直接当账单。bucketTotal把输入、输出、缓存读写相加，供应商字段是否互斥及重试是否计费未独立核对。sameStep只比较fold.last，因此A步、B步、再次A步的乱序重复并不全局去重，缺失turn/step也可能把连续消息视为同一步。更具体的是模型工具snapshotNow调用buildSnapshot(folds.values())，而设置视图用snapshotFoldValues()；仅在归档存在、当前fold缺失的已删除会话可能出现在设置页而不在工具报告中。这是静态路径差异而非已复现故障。若使用者依赖工具回答累计总量，必须先对照报告文件。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:142-144](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L142-L144)

总量简单相加四桶。

```text
function bucketTotal(b) {
  return b.inputTokens + b.outputTokens + b.cacheReadTokens + b.cacheWriteTokens
}
```

**依据 2 · 源码核查**：[index.mjs:257-278](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L257-L278)

仅上一采样键参与替换。

<details>
<summary>查看原文（22行）</summary>

```text
      const turn = data.turn
      const step = data.step
      const sameStep = fold.last !== null && fold.last.turn === turn && fold.last.step === step
      const key = modelKey(provider, model)
      const day = dayKey(event.time)

      if (sameStep) {
        // 同一步重试/重复上报: 替换旧采样,不重复计数
        const prev = fold.last
        const prevModel = fold.models.get(prev.key)
        if (prevModel) subBuckets(prevModel, prev.buckets)
        const prevDay = fold.days.get(prev.day)
        if (prevDay) subBuckets(prevDay, prev.buckets)
      } else {
        fold.usageCalls += 1
        ensureDay(fold, day).requests += 1
        ensureModel(fold, provider, model).requests += 1
      }

      addBuckets(ensureModel(fold, provider, model), buckets)
      addBuckets(ensureDay(fold, day), buckets)
      fold.last = { turn, step, key, day, buckets }
```

</details>

**依据 3 · 源码核查**：[index.mjs:885-887](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L885-L887)

设置视图合并归档。

```text

  /** 给设置页桥/工具用的当前统计视图(纯数据)。 */
  function statsView() {
```

**依据 4 · 源码核查**：[index.mjs:1012-1018](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L1012-L1018)

模型工具仅使用当前folds。

```text
  if (toolsSvc && typeof toolsSvc.register === 'function') {
    const snapshotNow = () => {
      const snap = buildSnapshot(folds.values())
      const meta = snapshotMeta()
      return renderMarkdown(snap, { ...meta, reportPath: mdPath })
    }
    const tool = {
```

#### 缺口

- 供应商usage互斥关系和重试计费语义未核实
  **影响**：不能推导真实账单或供应商间成本比较
  **进一步探讨**：将同批请求供应商账单与原始usage分项对齐。
- 已删除会话在工具与设置累计中的差异未执行验证
  **影响**：累计查询存在潜在口径分裂
  **进一步探讨**：准备仅归档存在的会话对照工具、设置视图和report.json。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、存储迁移与清空操作有哪些前提？

**研究主题**：依赖、兼容与流程

#### 完整回答

服务端使用Node内置fs、zlib和DSH事件服务，未声明运行时外部库；zstd日志路径需要可用的内置解压API。前端依赖Web slots与React，设置桥依赖settings和webServer；缺服务会降级，不能以服务探测成功代替界面可用。报告目录位于DSH_HOME之外，迁移先rename三个文件，跨卷失败后由save重建。清空不是仅删报表，而是将已知会话加入ignored，从此重新扫描也不会恢复它们；退出插件仍保留报告文件。应先备份archive和ignored，再操作清空或迁移。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:346-354](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L346-L354)

zstd解码路径。

```text
export function decodeSessionBuffer(fileName, buffer) {
  if (/\.zstd$/i.test(fileName)) {
    if (typeof zlib.zstdDecompressSync !== 'function') throw new Error('当前 Node 不支持 zstd(需要 Node >= 22.5)')
    const { frames } = scanZstdFrames(buffer)
    const parts = frames.map(({ start, end }) => zlib.zstdDecompressSync(buffer.subarray(start, end)))
    return Buffer.concat(parts, parts.reduce((n, p) => n + p.length, 0)).toString('utf8')
  }
  return buffer.toString('utf8')
}
```

**依据 2 · 源码核查**：[index.mjs:685-705](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L685-L705)

报告目录迁移为逐文件rename。

<details>
<summary>查看原文（21行）</summary>

```text
async function migrateReportData(fromDir, toDir) {
  if (fromDir === toDir) return false
  let fromStat = null
  try {
    fromStat = await stat(fromDir)
  } catch {
    return false
  }
  if (!fromStat.isDirectory()) return false
  await mkdir(toDir, { recursive: true })
  let moved = 0
  for (const fileName of ['report.md', 'report.json', 'archive.json']) {
    const src = path.join(fromDir, fileName)
    const dst = path.join(toDir, fileName)
    try {
      await rename(src, dst)
      moved += 1
    } catch {
      // 源文件不存在 / 跨卷(EXDEV)等情况: 保留原文件,后面 save() 会在新目录重建
    }
  }
```

</details>

**依据 3 · 源码核查**：[index.mjs:799-810](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L799-L810)

清空会标记忽略。

<details>
<summary>查看原文（12行）</summary>

```text
  function clearDatabase() {
    for (const id of folds.keys()) ignored.add(id)
    for (const id of archive.keys()) ignored.add(id)
    folds.clear()
    sealed.clear()
    pending.clear()
    archive.clear()
    logger.info?.('[token-stat] 插件数据库已清空(归档置零;历史会话已标记忽略,不会自动重新导入)')
    void save()
  }

  const ensure = (id) => {
```

</details>

**依据 4 · 源码核查**：[index.mjs:709-735](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L709-L735)

服务与报告路径初始化。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx, config) {
  const logger = ctx.logger ?? console
  if (config.enabled === false) {
    logger.info?.('[token-stat] 已在配置中禁用 (enabled: false)')
    return
  }

  const dshHome = resolveDshHome()
  // 报告目录可在运行时通过设置页/配置变更(见 applyConfiguredDir),故用 let
  let reportDir = normalizeReportDir(config.reportDir)
  let mdPath = path.join(reportDir, 'report.md')
  let jsonPath = path.join(reportDir, 'report.json')

  // ----- 运行时服务探测(信息用;settings/webServer 的实际接线走下端 ctx.inject) -----
  const sessionsSvc = ctx.get('sessions')
  const persistenceSvc = ctx.get('sessionPersistence')
  const toolsSvc = ctx.get('tools')
  const settingsSvc = ctx.get('settings')
  const webServerSvc = ctx.get('webServer')
  logger.info?.(
    `[token-stat] 已加载 reportDir=${reportDir}, ` +
    `sessions=${sessionsSvc ? 'ok' : 'n/a'}, persistence=${persistenceSvc ? 'ok' : 'n/a'}, ` +
    `tools=${toolsSvc ? 'ok' : 'n/a'}, settings=${settingsSvc ? 'ok' : 'n/a'}, webServer=${webServerSvc ? 'ok' : 'n/a'}`,
  )

  // ----- 会话折叠状态 -----
  /** sessionId -> fold */
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完整账本的资源负担和工程边界是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

首次需要回放全部可见历史日志并写独立归档；持续有内存fold、事件缓冲、节流写入和前端15秒刷新。现金、扫描耗时、内存占用没有同环境测量；不能从零第三方依赖推断零资源成本。常规事件保存经saveQueue串行化，但save对报告与archive分别直接writeFile，文件组没有原子事务；损坏归档加载被catch后从空开始，已删除日志的历史可能无法重建。防缩水比较usageCalls而非所有用量桶，也不保证每个报表一致。工程亮点是纯折叠函数可独立回放、独立归档和节流保存，复用时需补真实事件顺序与故障恢复检验。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:758-784](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L758-L784)

归档失败退化和防缩水条件。

<details>
<summary>查看原文（27行）</summary>

```text
  function loadArchiveSync() {
    try {
      const raw = fsSync.readFileSync(archivePath, 'utf8')
      const doc = JSON.parse(raw)
      for (const [id, obj] of Object.entries(doc.sessions || {})) {
        const fold = deserializeFold(obj)
        if (id && fold) archive.set(id, fold)
      }
      for (const id of doc.ignored || []) if (typeof id === 'string') ignored.add(id)
    } catch {
      /* 首次运行或归档损坏: 从空开始 */
    }
  }

  /**
   * 写入归档账本: 同一 id 覆盖更新(不重复计数)。
   * 保险: 会话日志是追加式的,折叠的 usageCalls 只会增长 —— 若读到的是
   * 局部/截断文件导致快照变小,拒绝用较小值覆盖,保证账本永不缩水。
   */
  function archiveSetFold(id, fold) {
    if (!fold) return
    const prev = archive.get(id)
    if (prev && fold.usageCalls < prev.usageCalls) {
      logger.warn?.('[token-stat] 归档拒绝较小快照(可能是截断文件):', id, prev.usageCalls, '->', fold.usageCalls)
      return
    }
    archive.set(id, fold)
```

</details>

**依据 2 · 源码核查**：[index.mjs:891-915](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L891-L915)

保存与节流写队列。

<details>
<summary>查看原文（25行）</summary>

```text
  async function save() {
    const meta = snapshotMeta()
    try {
      await mkdir(reportDir, { recursive: true })
      // 先把当前 folds 同步进归档,再写报告与归档(归档是删除会话后仍保留用量的关键)
      for (const [id, fold] of folds) archiveSetFold(id, fold)
      if (config.writeJson) {
        await writeFile(jsonPath, renderJson(buildSnapshot(snapshotFoldValues()), { ...meta, reportPath: jsonPath }), 'utf8')
      }
      if (config.writeMd) {
        await writeFile(mdPath, renderMarkdown(buildSnapshot(snapshotFoldValues()), { ...meta, reportPath: mdPath }), 'utf8')
      }
      await writeFile(archivePath, renderArchive(archive, ignored), 'utf8')
    } catch (error) {
      logger.warn?.('[token-stat] 保存报告失败:', error)
    }
  }

  function scheduleSave() {
    if (saveTimer) return
    saveTimer = setTimeout(() => {
      saveTimer = null
      saveQueue = saveQueue.then(save).catch(() => {})
    }, Math.max(50, config.debounceMs || 2000))
  }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:354-376](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/lib/client.js#L354-L376)

前端获取与轮询。

<details>
<summary>查看原文（23行）</summary>

```text
          const res = await fetch(`${BRIDGE}/stats`, { credentials: "same-origin" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const body = await res.json();
          if (!body || body.ok !== true || !body.value || !body.value.snapshot) {
            throw new Error("桥返回了意外的数据结构");
          }
          setState({ status: "ready", value: body.value });
          // 仅在用户没在输入时用服务端配置回填目录输入框
          if (!dirTouched.current && body.value.meta) {
            const configured = body.value.meta.reportDirConfigured;
            setDirInput(typeof configured === "string" ? configured : "");
          }
        } catch (error) {
          setState({ status: "error", error: error && error.message ? error.message : String(error) });
        }
      }, []);

      react.useEffect(() => {
        void load();
        const timer = setInterval(() => {
          if (open) void load();
        }, 15000);
        return () => clearInterval(timer);
```

</details>

#### 缺口

- 大型会话集扫描与失败恢复没有资源数据
  **影响**：不能给出单位使用成本或可扩展性结论
  **进一步探讨**：在固定会话规模记录首扫时间、峰值内存、写盘量和中断后的恢复差异。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 统一来源口径与覆盖率标记能否改善预算判断？

**研究主题**：新假设与验证

#### 完整回答

从工具与设置使用不同fold集合、缺usage被忽略以及缓存字段语义不明，可以推导未验证假设：统一所有展示的归档合并接口，并同时显示来源覆盖率、缺usage数量、字段计量约定和时间边界，可降低错误账单解读。增量是把一个累计数变成可审计用量口径，而非加入未经校准价格。最小验证用含删除、乱序、缺usage和缓存字段的固定日志比较各入口一致性，再让使用者完成同一预算诊断任务。若可解释性改善却增加误判或维护成本，或覆盖率不能反映遗漏，不应据此升级为计费系统。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:183-185](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L183-L185)

消息与usage计数支持覆盖率信号。

```text
    messageCount: 0,   // 处理的 assistant/message 事件总数
    usageCount: 0,     // 带 usage 的 assistant/message 事件总数
    usageCalls: 0,     // 去重后的 usage 采样数(按 turn/step)
```

**依据 2 · 源码核查**：[index.mjs:885-887](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L885-L887)

聚合视图现状。

```text

  /** 给设置页桥/工具用的当前统计视图(纯数据)。 */
  function statsView() {
```

**依据 3 · 源码核查**：[index.mjs:1012-1018](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L1012-L1018)

工具入口存在另一聚合路径。

```text
  if (toolsSvc && typeof toolsSvc.register === 'function') {
    const snapshotNow = () => {
      const snap = buildSnapshot(folds.values())
      const meta = snapshotMeta()
      return renderMarkdown(snap, { ...meta, reportPath: mdPath })
    }
    const tool = {
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 哪些人值得试用，哪些判断应暂停？

**研究主题**：采用判断

#### 完整回答

建议需要长期模型用量趋势、愿意核对report.json与设置页的维护者试用；先用已知小日志验证分项和删除保留，再核对工具回答。不要用于财务结算、精确重试计费或跨供应商单位成本决策。若工具和设置累计不一致，应先统一口径再扩大使用。当前只有源码证据，未执行作者自检脚本或真实宿主；推荐trial，重大累计用途须完成Q04的对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-44](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/README.md#L31-L44)

作者提供查询、清空及归档行为。

<details>
<summary>查看原文（14行）</summary>

```text
下全部历史会话并增量累计。

## 使用

1. **设置页查看（推荐）**：打开「设置 → 插件 → 可配置」，找到
   **Token 用量统计**卡片，点击展开即显示：
   - 累计总量（输入 / 缓存读取 / 缓存写入 / 输出 / 总计，含占比）
   - 按模型明细表（请求数、各类 token）
   - 按日期（近 14 天）
   - 数据目录、扫描时间等元信息，并可点「重新扫描」。
   卡片数据由插件自带的桥 `/api/token-stat/stats` 提供（仅回环地址可访问，
   外部请求一律 403），每 15 秒自动刷新。
   - **「可视化」**：点击弹出窗口内浮层面板（非全屏），3 张手写 SVG 图表
     （零第三方依赖，主题与设置页一致，悬停显示精确数值）：
```

</details>

**依据 2 · 源码核查**：[index.mjs:1012-1018](https://github.com/Anna-la/dsh-token-stat/blob/679a537f0c01be0b20f87677b173a1b7120c2b6b/index.mjs#L1012-L1018)

限制依赖模型工具聚合路径。

```text
  if (toolsSvc && typeof toolsSvc.register === 'function') {
    const snapshotNow = () => {
      const snap = buildSnapshot(folds.values())
      const meta = snapshotMeta()
      return renderMarkdown(snap, { ...meta, reportPath: mdPath })
    }
    const tool = {
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
