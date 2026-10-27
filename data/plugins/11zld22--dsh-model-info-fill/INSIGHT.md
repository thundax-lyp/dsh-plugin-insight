# dsh-model-info-fill

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[de7dc7a](https://github.com/11zld22/dsh-model-info-fill/tree/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/11zld22/dsh-model-info-fill)
<!-- END META -->

> **实现功能**：从models.dev按模型名补自定义供应商缺失容量、图片和思考声明，展示冲突、未匹配与旧猜档待确认。

> **核心亮点**：将模型目录、冲突/未知档区分与宿主补缺保存联结，降低重复能力配置。详见[Q01](#research-q01)。

> **风险与缺陷**：目录未到即自动填默认且以后不覆盖；命中缺容量也fallback，配置/遗漏偏好非事务，HTTP自检不等身份认证。详见[Q03](#research-q03)。

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
  - [Q01 · 模型信息补全减少哪类配置劳动？](#detail-section-11)
  - [Q02 · 远程目录、补全与保存如何衔接？](#detail-section-12)
  - [Q03 · 缺失默认、启动与信任有哪些风险？](#detail-section-13)
  - [Q04 · 测试、工程和成本证据能说明什么？](#detail-section-14)
  - [Q05 · 当前采用和进一步探讨从何入手？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH自定义模型维护者希望减少手查能力字段，仍以实际供应商能力为准。详见[Q01](#research-q01)。

面向在DSH llm-pi-ai中维护自定义供应商模型的用户，把模型名对应的上下文、输出、图片和离散思考档填写从手查改为目录辅助。合格变更应来源和匹配对象明确、保留手填字段、缺失与冲突不冒充已验证能力。它不创建供应商、不提供baseURL/key，也不证明中转实际支持上游全部能力。

简单替代是按实际供应商文档手工填写或宿主自带模型目录。贡献是models.dev数据转换、模型归一匹配、逐字段一致性/缺项策略与设置保存界面的组合。明确“reasoning=true不等离散档”、旧猜档人工确认值得借鉴，不是新模型能力检测技术；未调用模型做真实能力探测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 目录匹配 | 候选能力字段 | 变体/默认需核 |
| 补缺与默认档 | 少手工配置 | 启动竞态/全模型交集 |
| 未声明/冲突确认 | 减少猜档 | 偏好保存非事务 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| settings/timer与模型slots | 自动补/GUI | ABI需匹配 |
| models.dev目录 | 能力候选 | 非供应商真值 |
| 受控HTTP准入 | 修改配置 | 结构同源非身份 |
| 设置与cache备份 | 恢复 | 迁移不能只降版本 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份并关自动补 | 用户 | 不抢先写默认 |
| 同步目录看冲突 | 用户 | 版本和模型对应 |
| 按供应商核准再补 | 用户 | 缺证据不猜 |
| 保存后比对配置 | 用户 | reasoning默认全模型支持 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH_HOME备份/目录网络 | 审阅默认及供应商文档 | 先备份模型设置；文档核对工时未知 |
| 持续使用 | 目录过期刷新/设置计算 | 纠错和能力核对，节时未知 | 无独立模型调用；目录刷新网络和错误配置损失未量化 |
| 失败恢复 | 原设置/缓存备份 | 清错值、处理宿主迁移 | 插件回退不等宿主迁移回滚；恢复时间未知 |

#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 少手查字段 | 目录补缺 | 默认不是能力真值 |
| 少猜思考档 | 未声明与冲突留空 | 变体/供应商仍可能错配 |
| 保存衔接 | settings revision | 偏好双存储非事务 |

> **思考**：目录未到即自动填默认且以后不覆盖；命中缺容量也fallback，配置/遗漏偏好非事务，HTTP自检不等身份认证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将模型目录、冲突/未知档区分与宿主补缺保存联结，降低重复能力配置。详见[Q01](#research-q01)。

将模型目录、冲突/未知档区分与宿主补缺保存联结，降低重复能力配置。详见[Q01](#research-q01)。

纯catalog与新旧settings适配易核查；需catalog-ready、原子cache和身份/来源契约。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

目录未到即自动填默认且以后不覆盖；命中缺容量也fallback，配置/遗漏偏好非事务，HTTP自检不等身份认证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；个人有备份profile关自动补，目录同步完成后逐项手动审阅再补，实际供应商优先。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/catalog.js、src/index.js、test/catalog.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定全部宿主入口及catalog匹配/补缺关键段、客户端slots定位和两测试样本；不运行目标，不把目录声明作当前模型真值。
- 下一步：进一步探讨应按本项缺口执行：核对宿主连接准入和反代拓扑，限制非受信访问者

**分析版本**

- **仓库**：[11zld22/dsh-model-info-fill](https://github.com/11zld22/dsh-model-info-fill)
- **版本号**：0.3.0（[固定提交 de7dc7a](https://github.com/11zld22/dsh-model-info-fill/tree/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究逐字段exact/归一/默认来源收据与catalog-ready确认计划，用慢目录和受限变体反例比较错误填值。当前未验证。详见[Q05](#research-q05)。

进一步探讨应按本项缺口执行：核对宿主连接准入和反代拓扑，限制非受信访问者

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 135 | — | — | 2223 |
| .js | source | 5 | 1882 | 1574 | 170 | — |
| .mjs | source | 1 | 88 | 78 | 10 | — |
| .mjs | test | 5 | 1104 | 985 | 40 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+created%3A2026-09-22T15%3A11%3A48.078Z..2026-10-22T15%3A11%3A48.078Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A11%3A48.078Z..2026-10-22T15%3A11%3A48.078Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本目录辅助补全如何避免猜档，默认填值/启动/保存和HTTP信任边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型信息补全减少哪类配置劳动？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在DSH llm-pi-ai中维护自定义供应商模型的用户，把模型名对应的上下文、输出、图片和离散思考档填写从手查改为目录辅助。合格变更应来源和匹配对象明确、保留手填字段、缺失与冲突不冒充已验证能力。它不创建供应商、不提供baseURL/key，也不证明中转实际支持上游全部能力。

简单替代是按实际供应商文档手工填写或宿主自带模型目录。贡献是models.dev数据转换、模型归一匹配、逐字段一致性/缺项策略与设置保存界面的组合。明确“reasoning=true不等离散档”、旧猜档人工确认值得借鉴，不是新模型能力检测技术；未调用模型做真实能力探测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/README.md#L3-L12)

当前固定版本复核。作者范围。

<details>
<summary>查看原文（10行）</summary>

```text
DeepSeek Harness 插件。按模型名从 [models.dev](https://models.dev) 查出客观参数，补进自定义供应商的模型行：

- 上下文窗口 `contextWindow`
- 输出上限 `maxTokens`
- 图片能力 `input`
- 显示名 `name`（仅在本地为空时）

**不写思考档位。** DSH 0.2 起，宿主的模型编辑里已经有「推理等级」：一个开关加每个档位对应的 API 值，并且会校验档位与写入值。插件只把百科对该模型的说法显示成一行只读提示（「会思考：low / medium / high」或「不思考」），**不写** `reasoningEfforts`，也**不写**供应商的 `reasoning`。

**也不写占位默认值。** 留空的上下文 / 输出上限本来就由宿主的 `defaultContextWindow` / `defaultMaxTokens` 回退，插件只写百科真正给出的值 —— 写 262144 进去和留空效果一样，只会把「不知道」伪装成「知道」。
```

</details>

**依据 2 · 作者声明**：[README.md:54-62](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/README.md#L54-L62)

当前固定版本复核。未写档和旧猜测区分。

```text

为什么先认供应商：models.dev 里 9000 多条模型中有 1200 多个 id 重复出现（同一个模型被几十家转售），其中约 900 个的上下文档位互相冲突（`glm-5.3` 有 32 条记录、5 种上下文）。只按名字全局比对时，常用模型要么永远「参数不一致」补不上，要么抄了别家网关的数字。认准自己那条供应商记录后，冲突基本消失。

同一组候选里有多条记录时，**逐字段**求值：只有所有记录都一样的字段才会被写；对不上的字段跳过，并在「有分歧」里列出候选。

## 填什么

| 字段 | 条件 | 写入 |
|---|---|---|
```

**依据 3 · 源码核查**：[src/catalog.js:1-12](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/catalog.js#L1-L12)

当前固定版本复核。多候选逐字段一致。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * The models.dev catalog: the fetch shape, the cached file, and the small
 * host/URL helpers the cache and the matcher both need.
 */

export const MODELS_DEV_URL = 'https://models.dev/api.json'

/** Cache schema. Bumped when the parsed shape changes, so an old cache is re-fetched. */
export const CATALOG_VERSION = 3

export const LLM_PI_AI_NS = 'llm-pi-ai'
export const STALE_MS = 7 * 24 * 60 * 60 * 1000
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程目录、补全与保存如何衔接？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口硬依赖settings/timer，读旧settings.get或新describe行；models.dev/api.json拉取后解析各provider模型limit/modalities/reasoning，保存在DSH_HOME/models-dev.json。模型名先大小写无关精确ID，后去provider前缀与冒号变体匹配，多个候选冲突字段null并不自动填。fill只补缺容量/输入/思考与name，buildFillOps后按当前revision settings.mutate，监听配置事件再自动补缺，store.filling挡本实例递归。

供应商默认reasoning只在未设时写，strict要求所有nextModels支持wanted，不满足显示blocked；模型保存还维护保持未声明等偏好。前端slots显示footer和provider卡片，新旧配置API、schema枚举与provider命名限制需匹配；peer只列React不代表不依赖宿主。远程models.dev是第三方能力目录，不应当成当前供应商合同。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:26-38](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L26-L38)

当前固定版本复核。服务和缓存路径。

<details>
<summary>查看原文（13行）</summary>

```text
function dataDir() {
  const configured = process.env.DSH_HOME?.trim()
  return configured || join(homedir(), '.dsh')
}

function catalogPath() {
  return join(dataDir(), 'models-dev.json')
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}

```

</details>

**依据 2 · 源码核查**：[src/index.js:81-88](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L81-L88)

当前固定版本复核。旧/新settings读取。

```text
    inflight: null,
  }

  const readConfig = () => {
    const settings = ctx.settings
    if (typeof settings.get === 'function') return settings.get(LLM_PI_AI_NS)
    const row = settings.describe().find((item) => String(item.ns) === LLM_PI_AI_NS)
    if (!row || !row.value || typeof row.value !== 'object') {
```

**依据 3 · 源码核查**：[src/index.js:133-152](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L133-L152)

当前固定版本复核。拉取解析缓存。

<details>
<summary>查看原文（20行）</summary>

```text
  const loadCache = async () => {
    try {
      const raw = JSON.parse(await readFile(catalogPath(), 'utf8'))
      store.file = parseCatalogFile(raw)
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        store.file = emptyCatalogFile()
        return
      }
      throw error
    }
  }

  const refreshCatalog = async () => {
    // One fetch at a time: an explicit refresh that lands while the start-up
    // refresh is still running waits for it instead of answering the old cache.
    if (store.inflight) return store.inflight
    store.refreshing = true
    store.inflight = (async () => {
      try {
```

</details>

**依据 4 · 源码核查**：[src/index.js:165-205](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L165-L205)

当前固定版本复核。mutation/revision/事件。

<details>
<summary>查看原文（41行）</summary>

```text
          aliases: store.file.aliases,
          ignored: store.file.ignored,
        }
        await persist()
        return store.file
      } finally {
        store.refreshing = false
        store.inflight = null
      }
    })()
    return store.inflight
  }

  /**
   * Write the fill for the current config. Only an explicit action reaches this
   * function; nothing fills on a settings event, so the model form's revision is
   * never invalidated behind the user's back.
   * @param {{ provider?: string, ids?: string[] }} options
   */
  const fillSettings = async (options) => {
    if (store.filling) return { ok: true, filled: 0, providers: [], fields: 0, skipped: true }
    if (store.file.models.length === 0) return { ok: true, filled: 0, providers: [], fields: 0, empty: true }
    store.filling = true
    try {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const plan = buildFillOps(readConfig(), store.file, options)
        if (plan.ops.length === 0) return { ok: true, filled: 0, providers: [], fields: 0 }
        if (writesReasoning(plan.ops)) throw new Error('refused to write a thinking level')
        try {
          await ctx.settings.mutate(LLM_PI_AI_NS, plan.ops, revisionOf())
          return { ok: true, filled: plan.providers.length, providers: plan.providers, fields: plan.fields }
        } catch (error) {
          // A conflict means someone else wrote first; recompute against the
          // config we can now read instead of replaying a stale model list.
          if (error?.code === 'SETTINGS_CONFLICT') continue
          throw error
        }
      }
      return { ok: false, conflict: true, filled: 0, providers: [], fields: 0, error: '配置刚被改动，请重试' }
    } finally {
      store.filling = false
```

</details>

**依据 5 · 源码核查**：[src/catalog.js:1-12](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/catalog.js#L1-L12)

当前固定版本复核。模型匹配。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * The models.dev catalog: the fetch shape, the cached file, and the small
 * host/URL helpers the cache and the matcher both need.
 */

export const MODELS_DEV_URL = 'https://models.dev/api.json'

/** Cache schema. Bumped when the parsed shape changes, so an old cache is re-fetched. */
export const CATALOG_VERSION = 3

export const LLM_PI_AI_NS = 'llm-pi-ai'
export const STALE_MS = 7 * 24 * 60 * 60 * 1000
```

</details>

**依据 6 · 源码核查**：[src/catalog.js:105-115](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/catalog.js#L105-L115)

当前固定版本复核。严格默认档交集。

<details>
<summary>查看原文（11行）</summary>

```text
  const options = Array.isArray(entry.reasoning_options) ? entry.reasoning_options : []
  for (const option of options) {
    const record = asRecord(option)
    if (!record || record.type !== 'effort' || !Array.isArray(record.values)) continue
    const declared = new Set()
    for (const value of record.values) {
      if (value === null) {
        declared.add('off')
        continue
      }
      const level = textOf(value).toLowerCase()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缺失默认、启动与信任有哪些风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

匹配到模型但容量缺失且无冲突时也会用fallback，而不只“完全未匹配才默认”；初始默认上下文262144/output32768是配置假定，不能当模型实测上限。去前缀/变体能提高命中，但可能把供应商定制/量化/受限变体视为同模型；若只有一个候选，逐字段一致性无法发现此误认。已有字段不覆盖会保留旧错误，升级目录不会自动修正原先默认填值，变更出处需另核对。

启动start调用refreshCatalog而不await，随即maybeAutoFill。空缓存/旧缓存配慢网络时，默认值可能先入设置，后远程数据到达因字段非缺失而不替换。cache persist直接writeFile无原子替换/队列，保存偏好、刷新及模型设置+omitted标记跨两存储非事务，写失败可能留下配置已变但“保持未声明”未记住。HTTP信任函数直接loopback放行，其余只比较Origin.host与Host，不验证cookie/用户；不能单靠同源证明身份。无body大小上限的readJsonBody也扩大可访问入口资源面，实际外部可达仍依宿主/反代。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.js:1-12](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/catalog.js#L1-L12)

当前固定版本复核。命中缺字段仍用fallback且只补缺。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * The models.dev catalog: the fetch shape, the cached file, and the small
 * host/URL helpers the cache and the matcher both need.
 */

export const MODELS_DEV_URL = 'https://models.dev/api.json'

/** Cache schema. Bumped when the parsed shape changes, so an old cache is re-fetched. */
export const CATALOG_VERSION = 3

export const LLM_PI_AI_NS = 'llm-pi-ai'
export const STALE_MS = 7 * 24 * 60 * 60 * 1000
```

</details>

**依据 2 · 源码核查**：[src/index.js:317-334](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L317-L334)

当前固定版本复核。启动刷新不await就自动补。

<details>
<summary>查看原文（18行）</summary>

```text
      await guard(req, res, async () => {
        if (method(req, res, 'GET')) return
        const url = urlOf(req)
        const rows = searchCatalog(store.file, url.searchParams.get('q') ?? '', Number(url.searchParams.get('limit')) || 20)
        send(res, 200, { ok: true, rows })
      })
    })

    return true
  }

  ctx.effect(() => {
    let disposed = false
    const start = async () => {
      try {
        await loadCache()
      } catch (error) {
        ctx.logger?.warn?.(`[models-dev-catalog] failed to load cache: ${messageOf(error)}`)
```

</details>

**依据 3 · 源码核查**：[src/index.js:114-118](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L114-L118)

当前固定版本复核。直接覆盖缓存。

```text
    const built = buildStatus(currentConfig(), store.file)
    return {
      ok: true,
      updatedAt: store.file.updatedAt,
      modelCount: store.file.models.length,
```

**依据 4 · 源码核查**：[src/index.js:296-307](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L296-L307)

当前固定版本复核。配置与偏好两次持久化。

<details>
<summary>查看原文（12行）</summary>

```text
    route(`${PREFIX}/ignore`, async (req, res) => {
      await guard(req, res, async () => {
        if (method(req, res, 'POST')) return
        const body = await readJsonBody(req).catch(() => ({}))
        const provider = textOf(body.provider)
        const id = textOf(body.id)
        const key = entryKey(provider, id)
        if (!isProviderKey(provider) || !key) {
          send(res, 400, { ok: false, error: 'provider and model id are required' })
          return
        }
        const ignored = new Set(store.file.ignored)
```

</details>

**依据 5 · 源码核查**：[src/index.js:53-71](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L53-L71)

当前固定版本复核。loopback/同host判断与无上限body。

<details>
<summary>查看原文（19行）</summary>

```text
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const text = Buffer.concat(chunks).toString('utf8').trim()
  if (!text) return {}
  return JSON.parse(text)
}

function urlOf(req) {
  try {
    return new URL(req.url ?? '/', 'http://127.0.0.1')
  } catch {
```

</details>

#### 缺口

- 当前部署宿主是否额外鉴权这些exact插件路由未在源码内闭合
  **影响**：不能把Origin/Host自检说成访问者认证
  **进一步探讨**：核对宿主连接准入和反代拓扑，限制非受信访问者

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试、工程和成本证据能说明什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

纯catalog层与宿主接线分离，模型冲突和保持未声明可独立复核；settings-compat mock以revision递增并断言mutate收到期望值，支持新旧接线分支的可检查性，但不是实际宿主升级兼容或目录真实准确率。目录请求60秒signal超时但JSON解析/响应体没有专门体积限额；刷新失败保留已有内存，损坏本地cache在start warn后reset空，默认补全风险需与恢复一起看。

首次是备份DSH_HOME/模型设置、核对当前供应商能力和默认值，再同步目录；持续有过期七天刷新/手动更新网络和设置事件计算，无独立模型调用费，但错误context/maxTokens会造成请求失败或截断等业务成本。恢复要比对原配置、清掉错误补值再补，宿主迁移不能只降级插件回滚；缓存偏好也要备份。节省查文档工时和错误率无同任务对照，不能填百分比。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-38](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/README.md#L5-L38)

当前固定版本复核。mock revision与新旧settings。

<details>
<summary>查看原文（34行）</summary>

````text
- 上下文窗口 `contextWindow`
- 输出上限 `maxTokens`
- 图片能力 `input`
- 显示名 `name`（仅在本地为空时）

**不写思考档位。** DSH 0.2 起，宿主的模型编辑里已经有「推理等级」：一个开关加每个档位对应的 API 值，并且会校验档位与写入值。插件只把百科对该模型的说法显示成一行只读提示（「会思考：low / medium / high」或「不思考」），**不写** `reasoningEfforts`，也**不写**供应商的 `reasoning`。

**也不写占位默认值。** 留空的上下文 / 输出上限本来就由宿主的 `defaultContextWindow` / `defaultMaxTokens` 回退，插件只写百科真正给出的值 —— 写 262144 进去和留空效果一样，只会把「不知道」伪装成「知道」。

## 安装

```sh
dsh plugin --profile web add github:11zld22/dsh-model-info-fill
```

装完重启 DSH。桌面版把 `--profile web` 换成 `--profile desktop`。打开 **设置 → 模型** 即可使用。

本机开发用 `link` 安装：`dsh plugin --profile desktop add link:F:\path\to\dsh-models-dev-catalog`，改完代码重启 DSH 生效。

## 怎么用

底部「模型信息补全」一行显示百科同步时间与模型数量，右侧三个按钮：

| 按钮 | 作用 |
|---|---|
| **更新** | 重新拉取 models.dev |
| **补全全部缺失** | 把所有能补的字段一次写进配置 |
| **详情** | 展开面板：供应商的百科身份、可补数量，以及下面各分区 |

芯片按需展开对应分区：

| 芯片 | 含义 |
|---|---|
| **可补全 N** | 百科命中，且该模型有缺失字段；逐条列出「将写入 …」，可单独补一条 |
````

</details>

**依据 2 · 源码核查**：[test/catalog.test.mjs:29-54](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/test/catalog.test.mjs#L29-L54)

当前固定版本复核。合成目录样本。

<details>
<summary>查看原文（26行）</summary>

```text
  assert.deepEqual(row.input, ['text', 'image'])
  assert.deepEqual(row.reasoningLevels, ['off', 'low', 'medium', 'high'])
  assert.equal(row.reasoning, true)
})

test('parseCatalogPayload ignores a document that is not an object', () => {
  assert.deepEqual(parseCatalogPayload(null), { providers: [], models: [] })
  assert.deepEqual(parseCatalogPayload('nope'), { providers: [], models: [] })
})

test('parseCatalogPayload reads effort values, including the null Off entry', () => {
  const { models } = parseCatalogPayload({
    p: {
      id: 'p',
      name: 'P',
      api: 'https://p.example/v1',
      models: {
        a: { id: 'a', reasoning: true, reasoning_options: [{ type: 'effort', values: [null, 'low', 'high'] }] },
        b: { id: 'b', reasoning: true, reasoning_options: [{ type: 'effort', values: ['none', 'high'] }] },
        c: { id: 'c', reasoning: true, reasoning_options: [{ type: 'toggle' }] },
        d: { id: 'd', reasoning: true, reasoning_options: [{ type: 'budget_tokens', min: 1, max: 8 }] },
        e: { id: 'e', reasoning: true },
        f: { id: 'f', reasoning: false },
      },
    },
  })
```

</details>

**依据 3 · 源码核查**：[src/index.js:133-152](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L133-L152)

当前固定版本复核。目录网络和解析。

<details>
<summary>查看原文（20行）</summary>

```text
  const loadCache = async () => {
    try {
      const raw = JSON.parse(await readFile(catalogPath(), 'utf8'))
      store.file = parseCatalogFile(raw)
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        store.file = emptyCatalogFile()
        return
      }
      throw error
    }
  }

  const refreshCatalog = async () => {
    // One fetch at a time: an explicit refresh that lands while the start-up
    // refresh is still running waits for it instead of answering the old cache.
    if (store.inflight) return store.inflight
    store.refreshing = true
    store.inflight = (async () => {
      try {
```

</details>

**依据 4 · 源码核查**：[src/index.js:319-332](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L319-L332)

当前固定版本复核。缓存坏后默认路径。

<details>
<summary>查看原文（14行）</summary>

```text
        const url = urlOf(req)
        const rows = searchCatalog(store.file, url.searchParams.get('q') ?? '', Number(url.searchParams.get('limit')) || 20)
        send(res, 200, { ok: true, rows })
      })
    })

    return true
  }

  ctx.effect(() => {
    let disposed = false
    const start = async () => {
      try {
        await loadCache()
```

</details>

**依据 5 · 作者声明**：[README.md:99-107](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/README.md#L99-L107)

当前固定版本复核。存储迁移/过期作者说明。

```text
## 更新日志

### 0.3.0 · 只补百科事实，不再写思考档位

重写了匹配与写入范围，净删约 2500 行。

- **不写思考档位**：不写 `reasoningEfforts`，也不写供应商的 `reasoning`。DSH 0.2 起宿主自己就有推理等级编辑（开关 + 每档 API 值 + 校验），插件只把百科对该模型的说法显示成一行只读提示。
- **不写占位默认值**：未匹配的模型不再被填上 262144 / 32768 这类数字。留空本来就由宿主的 `defaultContextWindow` / `defaultMaxTokens` 回退，写死只会把「不知道」伪装成「知道」。
- **先认供应商，再认名字**：用 `baseURL` 可注册域、`apiKeyEnv`、路由名先锁定 models.dev 里对应的那家，再做精确 id、网关命名空间（`opencode-zen-free/beam-free` → `opencode` 的 `beam-free`）、裸名比对。本机 49 个模型里「参数不一致」从遍地降到 0，「未匹配」从 9 条降到 6 条。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前采用和进一步探讨从何入手？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，核心是缺证据时仍填大容量默认、启动自动补全与目录到达竞态、配置与遗漏偏好非事务，以及本地路由鉴权仅结构判断。维护者可在有备份个人profile中关自动补全、先等目录同步再看匹配/冲突/未声明后手动补，实际供应商文档优先；不宜对未知变体整库无审阅默认启用。错误匹配/填值、供应商默认档不支持或恢复后自动回写时停止批量补并从备份比较。

可继续研究逐字段来源收据与待确认补全计划，把exact/归一/默认、目录hash/版本、供应商/变体和用户手填来源分开；启动前明确catalog-ready或用户允许默认，不将猜测直接持久化。基线为当前直接补缺与手工文档，固定反例含慢目录启动、无容量命中、同名不同provider、变体受限、偏好写失败与并发设置变化，比较错误字段、恢复步骤及核对工时。它是未验证方向，不称现有插件已具备能力真值。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.js:1-12](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/catalog.js#L1-L12)

当前固定版本复核。当前缺字段填充。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * The models.dev catalog: the fetch shape, the cached file, and the small
 * host/URL helpers the cache and the matcher both need.
 */

export const MODELS_DEV_URL = 'https://models.dev/api.json'

/** Cache schema. Bumped when the parsed shape changes, so an old cache is re-fetched. */
export const CATALOG_VERSION = 3

export const LLM_PI_AI_NS = 'llm-pi-ai'
export const STALE_MS = 7 * 24 * 60 * 60 * 1000
```

</details>

**依据 2 · 源码核查**：[src/index.js:317-334](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L317-L334)

当前固定版本复核。启动先后。

<details>
<summary>查看原文（18行）</summary>

```text
      await guard(req, res, async () => {
        if (method(req, res, 'GET')) return
        const url = urlOf(req)
        const rows = searchCatalog(store.file, url.searchParams.get('q') ?? '', Number(url.searchParams.get('limit')) || 20)
        send(res, 200, { ok: true, rows })
      })
    })

    return true
  }

  ctx.effect(() => {
    let disposed = false
    const start = async () => {
      try {
        await loadCache()
      } catch (error) {
        ctx.logger?.warn?.(`[models-dev-catalog] failed to load cache: ${messageOf(error)}`)
```

</details>

**依据 3 · 源码核查**：[src/index.js:296-307](https://github.com/11zld22/dsh-model-info-fill/blob/de7dc7abf7c13fc3f5f93b08cb96380c7d3ab621/src/index.js#L296-L307)

当前固定版本复核。双存储保存。

<details>
<summary>查看原文（12行）</summary>

```text
    route(`${PREFIX}/ignore`, async (req, res) => {
      await guard(req, res, async () => {
        if (method(req, res, 'POST')) return
        const body = await readJsonBody(req).catch(() => ({}))
        const provider = textOf(body.provider)
        const id = textOf(body.id)
        const key = entryKey(provider, id)
        if (!isProviderKey(provider) || !key) {
          send(res, 400, { ok: false, error: 'provider and model id are required' })
          return
        }
        const ignored = new Set(store.file.ignored)
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
