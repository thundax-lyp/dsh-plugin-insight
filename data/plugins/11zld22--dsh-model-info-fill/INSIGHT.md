# dsh-model-info-fill

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d377291](https://github.com/11zld22/dsh-model-info-fill/tree/d377291f5ef8ad2bccbd54e26e641b9d89016bba)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)
<!-- END META -->

> **实现功能**：从models.dev按模型名补自定义供应商缺失容量、图片和思考声明，展示冲突、未匹配与旧猜档待确认。

> **核心亮点**：将模型目录、冲突/未知档区分与宿主补缺保存联结，降低重复能力配置。详见[Q01](#research-q01)。

> **风险与缺陷**：目录未到即自动填默认且以后不覆盖；命中缺容量也fallback，配置/遗漏偏好非事务，HTTP自检不等身份认证。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
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

供应商文档手填、宿主模型目录是替代，自动补减少接线但不检测真实能力。

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

### 1.3 工程贡献

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

匹配和缺项策略源码可查；大容量默认与启动竞态/双存储、结构HTTP信任限制采用，来源计划为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/catalog.js、src/client.js、test/catalog.test.mjs、test/settings-compat.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定全部宿主入口及catalog匹配/补缺关键段、客户端slots定位和两测试样本；不运行目标，不把目录声明作当前模型真值。
- 下一步：进一步从慢目录、缺容量命中、受限变体、偏好写失败和并发设置探讨来源收据。

**分析版本**

- **仓库**：[11zld22/dsh-model-info-fill](https://github.com/11zld22/dsh-model-info-fill)
- **版本号**：0.2.4（[固定提交 d377291](https://github.com/11zld22/dsh-model-info-fill/tree/d377291f5ef8ad2bccbd54e26e641b9d89016bba)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究逐字段exact/归一/默认来源收据与catalog-ready确认计划，用慢目录和受限变体反例比较错误填值。当前未验证。详见[Q05](#research-q05)。

进一步从慢目录、缺容量命中、受限变体、偏好写失败和并发设置探讨来源收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 127 | — | — | 2350 |
| .js | source | 3 | 2058 | 1835 | 88 | — |
| .mjs | test | 2 | 1038 | 974 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+created%3A2026-09-22T05%3A44%3A11.980Z..2026-10-22T05%3A44%3A11.980Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A44%3A11.980Z..2026-10-22T05%3A44%3A11.980Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定版本目录辅助补全如何避免猜档，默认填值/启动/保存和HTTP信任边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型信息补全减少哪类配置劳动？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向在DSH llm-pi-ai中维护自定义供应商模型的用户，把模型名对应的上下文、输出、图片和离散思考档填写从手查改为目录辅助。合格变更应来源和匹配对象明确、保留手填字段、缺失与冲突不冒充已验证能力。它不创建供应商、不提供baseURL/key，也不证明中转实际支持上游全部能力。

简单替代是按实际供应商文档手工填写或宿主自带模型目录。贡献是models.dev数据转换、模型归一匹配、逐字段一致性/缺项策略与设置保存界面的组合。明确“reasoning=true不等离散档”、旧猜档人工确认值得借鉴，不是新模型能力检测技术；未调用模型做真实能力探测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/README.md#L3-L12)

作者范围。

<details>
<summary>查看原文（10行）</summary>

```text
DeepSeek Harness 插件。给自定义供应商里的模型，按名字从 [models.dev](https://models.dev) 补全缺失字段：

- 上下文窗口 `contextWindow`
- 输出上限 `maxTokens`
- 思考档位 `reasoningEfforts`
- 图片声明 `input`

百科里没有的模型会套你设的默认值；已经手填过的字段不会覆盖；百科写不清楚的字段宁可留空 —— 只标明「会思考」而没有离散档位时**不会**替你编出 `minimal` / `low` / `medium` / `high`（见 [档位未写明](#档位未写明)）。

不会根据 models.dev 创建供应商（没有 Base URL / API Key）。百科只用来查模型能力。
```

</details>

**依据 2 · 作者声明**：[README.md:54-62](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/README.md#L54-L62)

未写档和旧猜测区分。

```text
### 档位未写明

百科能对上名字，也标明模型会思考，但没有离散档位时，会出现在这里。四种情况：只写了 `reasoning: true`、只有思考开关（`toggle`）、只有 token 预算（`budget_tokens`）、档位名 DSH 不认（比如 `none` / `default`）。插件不会替它们编造 `minimal` / `low` / `medium` / `high`。

这些模型「保持未声明」保存就完全不写 `reasoningEfforts`：自定义模型不会在会话里提供思考档，也不会因为一个并不存在的档位被拒绝。按供应商文档选「指定档位」勾好再保存，才会写入；确认不会思考就选「不会思考」。已经写过的 `reasoningEfforts` 不会被覆盖。

### 疑似旧版本代填，请确认

0.2.0 之前的版本对「百科只标明会思考」的模型会代填 `minimal` / `low` / `medium` / `high`。已经写进配置的值不会被自动改写，所以这些模型（配置里正好是那四档、百科却写明没有档位）会单独列出来。点「确认保留」留下这四档，并记下确认，这条离开待确认；点「清掉档位」删掉这些档位；勾成别的档位后点「确认档位」。
```

**依据 3 · 源码核查**：[src/catalog.js:319-347](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/catalog.js#L319-L347)

多候选逐字段一致。

<details>
<summary>查看原文（29行）</summary>

```text
export function lookupCatalogModel(models, id) {
  const rows = catalogCandidates(models, id)
  if (rows.length === 0) return undefined
  if (rows.length === 1) return rows[0]
  const context = agreedField(rows, (row) => row.contextWindow ?? null)
  const output = agreedField(rows, (row) => row.maxOutput ?? null)
  const input = agreedField(rows, (row) => row.input ?? null)
  const thinking = agreedField(rows, (row) => row.thinkingLevels ?? null)
  const gap = agreedField(rows, (row) => row.thinkingGap ?? null)
  const name = agreedField(rows, (row) => row.name ?? null)
  const conflicts = {
    context: context.conflict,
    output: output.conflict,
    input: input.conflict,
    thinking: thinking.conflict,
  }
  if (!conflicts.context && !conflicts.output && !conflicts.input && !conflicts.thinking) return rows[0]
  return {
    id: rows[0].id,
    name: name.conflict ? undefined : name.value,
    provider: '',
    contextWindow: context.conflict ? null : context.value,
    maxOutput: output.conflict ? null : output.value,
    input: input.conflict ? null : input.value,
    thinkingLevels: thinking.conflict ? null : thinking.value,
    thinkingGap: thinking.conflict ? 'conflict' : gap.value,
    ambiguous: true,
    candidateCount: rows.length,
    conflicts,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程目录、补全与保存如何衔接？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

入口硬依赖settings/timer，读旧settings.get或新describe行；models.dev/api.json拉取后解析各provider模型limit/modalities/reasoning，保存在DSH_HOME/models-dev.json。模型名先大小写无关精确ID，后去provider前缀与冒号变体匹配，多个候选冲突字段null并不自动填。fill只补缺容量/输入/思考与name，buildFillOps后按当前revision settings.mutate，监听配置事件再自动补缺，store.filling挡本实例递归。

供应商默认reasoning只在未设时写，strict要求所有nextModels支持wanted，不满足显示blocked；模型保存还维护保持未声明等偏好。前端slots显示footer和provider卡片，新旧配置API、schema枚举与provider命名限制需匹配；peer只列React不代表不依赖宿主。远程models.dev是第三方能力目录，不应当成当前供应商合同。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:26-38](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L26-L38)

服务和缓存路径。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'dsh-model-info-fill'
export const inject = ['settings', 'timer']

const FETCH_TIMEOUT_MS = 60_000
const PREFIX = '/plugins/models-dev-catalog'

function dataDir() {
  const configured = process.env.DSH_HOME?.trim()
  return configured || join(homedir(), '.dsh')
}

function catalogPath() {
  return join(dataDir(), 'models-dev.json')
```

</details>

**依据 2 · 源码核查**：[src/index.js:81-88](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L81-L88)

旧/新settings读取。

```text
  const readConfig = () => {
    const settings = ctx.settings
    if (typeof settings.get === 'function') return settings.get(LLM_PI_AI_NS)
    const row = settings.describe().find((item) => String(item.ns) === LLM_PI_AI_NS)
    if (!row || !row.value || typeof row.value !== 'object') {
      throw new Error(`Settings for ${LLM_PI_AI_NS} are unavailable`)
    }
    return row.value
```

**依据 3 · 源码核查**：[src/index.js:133-152](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L133-L152)

拉取解析缓存。

<details>
<summary>查看原文（20行）</summary>

```text
  const refreshCatalog = async () => {
    if (store.refreshing) return store.file
    store.refreshing = true
    try {
      const response = await fetch(MODELS_DEV_URL, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      store.file = {
        version: CATALOG_VERSION,
        updatedAt: new Date().toISOString(),
        autoFill: store.file.autoFill !== false,
        defaults: parseDefaults(store.file.defaults),
        confirmedLegacy: store.file.confirmedLegacy ?? [],
        omittedReasoning: store.file.omittedReasoning ?? [],
        models: parseModelsDev(data),
      }
      await persist()
```

</details>

**依据 4 · 源码核查**：[src/index.js:165-205](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L165-L205)

mutation/revision/事件。

<details>
<summary>查看原文（41行）</summary>

```text
  const fillSettings = async (onlyProvider) => {
    const settings = ctx.settings
    const config = readConfig()
    const { ops, filledProviders, reasoning } = buildFillOps(
      config,
      store.file.models,
      onlyProvider,
      store.file.defaults,
      store.file.omittedReasoning,
    )
    if (ops.length === 0) {
      return { ok: true, filled: 0, providers: [], reasoning, skipped: true }
    }
    if (store.filling) {
      return { ok: true, filled: 0, providers: [], reasoning, skipped: true }
    }
    store.filling = true
    try {
      await settings.mutate(LLM_PI_AI_NS, ops, llmRevision())
      return { ok: true, filled: filledProviders.length, providers: filledProviders, reasoning }
    } finally {
      store.filling = false
    }
  }

  const maybeAutoFill = () => {
    if (store.file.autoFill === false) return
    ctx.timeout(() => {
      fillSettings().catch((error) => {
        ctx.logger?.warn?.(`[models-dev-catalog] auto-fill failed: ${messageOf(error)}`)
      })
    }, 0)
  }

  const settingsEvent = typeof ctx.settings.get === 'function'
    ? 'settings/updated'
    : 'settings/document-updated'
  ctx.on(settingsEvent, (ns) => {
    if (String(ns) !== LLM_PI_AI_NS) return
    if (store.filling) return
    maybeAutoFill()
```

</details>

**依据 5 · 源码核查**：[src/catalog.js:288-302](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/catalog.js#L288-L302)

模型匹配。

<details>
<summary>查看原文（15行）</summary>

```text
function catalogKey(id) {
  const raw = String(id ?? '').trim().toLowerCase()
  if (!raw) return ''
  const tail = raw.split('/').filter(Boolean).pop() ?? raw
  return tail.split(':')[0].trim()
}

function catalogCandidates(models, id) {
  const raw = String(id ?? '').trim().toLowerCase()
  if (!raw || !Array.isArray(models)) return []
  const exact = models.filter((item) => item?.id?.toLowerCase() === raw)
  if (exact.length > 0) return exact
  const key = catalogKey(raw)
  if (!key) return []
  return models.filter((item) => catalogKey(item?.id) === key)
```

</details>

**依据 6 · 源码核查**：[src/catalog.js:105-115](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/catalog.js#L105-L115)

严格默认档交集。

<details>
<summary>查看原文（11行）</summary>

```text
export function planProviderReasoning(profile, nextModels, configured, strict = true) {
  const wanted = THINKING_LEVELS.includes(configured) ? configured : null
  const declared = typeof profile?.reasoning === 'string' ? profile.reasoning.trim() : ''
  const current = THINKING_LEVELS.includes(declared) ? declared : null
  if (wanted === null || current !== null) return { wanted, current, level: null, blocked: [] }
  const blocked = []
  for (const entry of nextModels) {
    if (supportedThinkingLevels(entry).includes(wanted)) continue
    blocked.push(typeof entry?.id === 'string' ? entry.id.trim() : '')
  }
  return { wanted, current, level: blocked.length === 0 || strict === false ? wanted : null, blocked }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缺失默认、启动与信任有哪些风险？

**研究主题：**缺陷与关键质疑

#### 完整回答

匹配到模型但容量缺失且无冲突时也会用fallback，而不只“完全未匹配才默认”；初始默认上下文262144/output32768是配置假定，不能当模型实测上限。去前缀/变体能提高命中，但可能把供应商定制/量化/受限变体视为同模型；若只有一个候选，逐字段一致性无法发现此误认。已有字段不覆盖会保留旧错误，升级目录不会自动修正原先默认填值，变更出处需另核对。

启动start调用refreshCatalog而不await，随即maybeAutoFill。空缓存/旧缓存配慢网络时，默认值可能先入设置，后远程数据到达因字段非缺失而不替换。cache persist直接writeFile无原子替换/队列，保存偏好、刷新及模型设置+omitted标记跨两存储非事务，写失败可能留下配置已变但“保持未声明”未记住。HTTP信任函数直接loopback放行，其余只比较Origin.host与Host，不验证cookie/用户；不能单靠同源证明身份。无body大小上限的readJsonBody也扩大可访问入口资源面，实际外部可达仍依宿主/反代。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.js:381-417](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/catalog.js#L381-L417)

命中缺字段仍用fallback且只补缺。

<details>
<summary>查看原文（37行）</summary>

```text
  const conflicts = hit?.conflicts ?? {}
  if (missingCapacity(next.contextWindow)) {
    // Disagreeing copies: leave the field missing instead of copying one gateway.
    if (!conflicts.context) {
      next.contextWindow = hit?.contextWindow ?? fallback.contextWindow
      changed = true
    }
  }
  if (missingCapacity(next.maxTokens)) {
    if (!conflicts.output) {
      next.maxTokens = hit?.maxOutput ?? fallback.maxTokens
      changed = true
    }
  }
  if (missingInput(next.input)) {
    if (!conflicts.input) {
      next.input = hit ? sanitizeInput(hit.input) : defaultsInput(fallback)
      changed = true
    }
  }
  if (missingReasoning(next.reasoningEfforts)) {
    // A catalog hit that states no discrete level declares nothing, and an
    // off-only level set is invalid DSH config. Both leave the field unset: an
    // empty object would be refused, so drop it and let a missing field stay missing.
    // An explicit 「保持未声明」 is the same: do not invent the unmatched defaults.
    const omit = options?.omitReasoning === true
    const value = omit || (hit && hit.thinkingLevels === null)
      ? undefined
      : reasoningEffortsFromLevels(hit ? hit.thinkingLevels : fallback.thinkingLevels)
    if (value === undefined) {
      if (next.reasoningEfforts !== undefined) {
        delete next.reasoningEfforts
        changed = true
      }
    } else {
      next.reasoningEfforts = value
      changed = true
```

</details>

**依据 2 · 源码核查**：[src/index.js:317-334](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L317-L334)

启动刷新不await就自动补。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => {
    let disposed = false
    const start = async () => {
      try {
        await loadCache()
      } catch (error) {
        ctx.logger?.warn?.(`[models-dev-catalog] failed to load cache: ${messageOf(error)}`)
        store.file = emptyCatalogFile()
      }
      if (disposed) return
      if (catalogIsStale(store.file.updatedAt)) {
        refreshCatalog().catch((error) => {
          ctx.logger?.warn?.(`[models-dev-catalog] refresh failed: ${messageOf(error)}`)
        })
      }
      maybeAutoFill()
    }
    start()
```

</details>

**依据 3 · 源码核查**：[src/index.js:114-118](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L114-L118)

直接覆盖缓存。

```text
  const persist = async () => {
    const path = catalogPath()
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, `${JSON.stringify(store.file)}\n`, 'utf8')
  }
```

**依据 4 · 源码核查**：[src/index.js:296-307](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L296-L307)

配置与偏好两次持久化。

<details>
<summary>查看原文（12行）</summary>

```text
        const ops = buildModelSaveOps(readConfig(), body, store.file.defaults, store.file.models)
        await ctx.settings.mutate(LLM_PI_AI_NS, ops, llmRevision())
        const reasoningCleared = ops.some((op) => op.op === 'unset' && op.path.at(-1) === 'reasoning')
        const mode = typeof body.thinkingMode === 'string' ? body.thinkingMode : ''
        if (mode === 'unset' || mode === 'levels' || mode === 'none') {
          const current = store.file.omittedReasoning
          const next = mode === 'unset'
            ? rememberLegacyConfirmation(current, body.provider, body.id)
            : forgetLegacyConfirmation(current, body.provider, body.id)
          if (next.join('\0') !== parseConfirmedLegacy(current).join('\0')) {
            store.file.omittedReasoning = next
            await persist()
```

</details>

**依据 5 · 源码核查**：[src/index.js:53-71](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L53-L71)

loopback/同host判断与无上限body。

<details>
<summary>查看原文（19行）</summary>

```text
function isTrustedRequest(req) {
  const address = req.socket?.remoteAddress || ''
  if (address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1') return true
  const host = req.headers?.host || ''
  const origin = req.headers?.origin || ''
  if (!origin) return false
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
```

</details>

#### 缺口

- 当前部署宿主是否额外鉴权这些exact插件路由未在源码内闭合
  **影响：**不能把Origin/Host自检说成访问者认证
  **进一步探讨：**核对宿主连接准入和反代拓扑，限制非受信访问者

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试、工程和成本证据能说明什么？

**研究主题：**工程质量与复用、效果与总成本

#### 完整回答

纯catalog层与宿主接线分离，模型冲突和保持未声明可独立复核；settings-compat mock以revision递增并断言mutate收到期望值，支持新旧接线分支的可检查性，但不是实际宿主升级兼容或目录真实准确率。目录请求60秒signal超时但JSON解析/响应体没有专门体积限额；刷新失败保留已有内存，损坏本地cache在start warn后reset空，默认补全风险需与恢复一起看。

首次是备份DSH_HOME/模型设置、核对当前供应商能力和默认值，再同步目录；持续有过期七天刷新/手动更新网络和设置事件计算，无独立模型调用费，但错误context/maxTokens会造成请求失败或截断等业务成本。恢复要比对原配置、清掉错误补值再补，宿主迁移不能只降级插件回滚；缓存偏好也要备份。节省查文档工时和错误率无同任务对照，不能填百分比。

#### 证据与依据

**依据 1 · 源码核查**：[test/settings-compat.test.mjs:5-38](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/test/settings-compat.test.mjs#L5-L38)

mock revision与新旧settings。

<details>
<summary>查看原文（34行）</summary>

```text
function harness(legacy, missing = false, options = {}) {
  const routes = new Map()
  const events = new Map()
  const timers = []
  const writes = []
  let revision = 4
  const config = { providers: { custom: { models: [{ id: 'unknown-x' }] } } }
  const settings = {
    describe() {
      return missing ? [] : [{ ns: 'llm-pi-ai', revision, value: config }]
    },
    async mutate(ns, ops, expectedRevision) {
      assert.equal(ns, 'llm-pi-ai')
      assert.equal(expectedRevision, revision)
      writes.push(ops)
      for (const op of ops) {
        assert.equal(op.op, 'set')
        let parent = config
        for (const key of op.path.slice(0, -1)) parent = parent[key]
        parent[op.path.at(-1)] = op.value
      }
      revision++
    },
  }
  if (legacy) settings.get = () => config
  const webServer = { register({ path, handler }) { routes.set(path, handler) } }
  apply({
    settings,
    get(name) { return name === 'webServer' ? webServer : undefined },
    on(name, handler) { events.set(name, handler) },
    effect(fn, label) {
      if (label?.startsWith('models-dev-catalog: /')) fn()
      if (options.cache && label === 'models-dev-catalog: cache') fn()
    },
```

</details>

**依据 2 · 源码核查**：[test/catalog.test.mjs:29-54](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/test/catalog.test.mjs#L29-L54)

合成目录样本。

<details>
<summary>查看原文（26行）</summary>

```text
const SAMPLE = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    models: {
      'gpt-4o': {
        id: 'gpt-4o',
        name: 'GPT-4o',
        limit: { context: 128000, output: 16384 },
        modalities: { input: ['text', 'image'], output: ['text'] },
        reasoning: false,
      },
    },
  },
  zhipuai: {
    id: 'zhipuai',
    name: 'Zhipu AI',
    models: {
      'glm-5.2': {
        id: 'glm-5.2',
        name: 'GLM-5.2',
        limit: { context: 1048576, output: 131072 },
        modalities: { input: ['text'] },
        reasoning: true,
        reasoning_options: [{ type: 'effort', values: ['off', 'low', 'high', 'max'] }],
      },
```

</details>

**依据 3 · 源码核查**：[src/index.js:133-152](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L133-L152)

目录网络和解析。

<details>
<summary>查看原文（20行）</summary>

```text
  const refreshCatalog = async () => {
    if (store.refreshing) return store.file
    store.refreshing = true
    try {
      const response = await fetch(MODELS_DEV_URL, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      store.file = {
        version: CATALOG_VERSION,
        updatedAt: new Date().toISOString(),
        autoFill: store.file.autoFill !== false,
        defaults: parseDefaults(store.file.defaults),
        confirmedLegacy: store.file.confirmedLegacy ?? [],
        omittedReasoning: store.file.omittedReasoning ?? [],
        models: parseModelsDev(data),
      }
      await persist()
```

</details>

**依据 4 · 源码核查**：[src/index.js:319-332](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L319-L332)

缓存坏后默认路径。

<details>
<summary>查看原文（14行）</summary>

```text
    const start = async () => {
      try {
        await loadCache()
      } catch (error) {
        ctx.logger?.warn?.(`[models-dev-catalog] failed to load cache: ${messageOf(error)}`)
        store.file = emptyCatalogFile()
      }
      if (disposed) return
      if (catalogIsStale(store.file.updatedAt)) {
        refreshCatalog().catch((error) => {
          ctx.logger?.warn?.(`[models-dev-catalog] refresh failed: ${messageOf(error)}`)
        })
      }
      maybeAutoFill()
```

</details>

**依据 5 · 作者声明**：[README.md:99-107](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/README.md#L99-L107)

存储迁移/过期作者说明。

```text
| `~/.dsh/models-dev.json` | 百科缓存、自动补全开关、未匹配默认值（含默认档位与「严格」开关），以及记下的「保持未声明」 |
| DSH 0.1.6：`~/.dsh/settings.yaml` 的 `llm-pi-ai` | 被补全或手改的模型字段 |
| DSH 0.1.7：当前 profile 的插件配置 | 被补全或手改的模型字段 |

若设置了 `DSH_HOME`，缓存写到 `$DSH_HOME/models-dev.json`。

插件同时支持 DSH 0.1.6 的旧设置接口和 0.1.7 的配置表单接口。升级宿主前请备份整个 `DSH_HOME`；新版宿主会迁移旧设置，不能仅靠降级程序回滚数据。

无缓存或超过 7 天会在启动后后台刷新。缓存结构版本（`version`）变更时，旧缓存也会被当作过期并自动重拉，不需要手动点「更新」。拉取失败沿用旧缓存；没有缓存时用默认值，不阻断保存。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前采用和进一步探讨从何入手？

**研究主题：**新假设与验证、采用判断

#### 完整回答

先观察，核心是缺证据时仍填大容量默认、启动自动补全与目录到达竞态、配置与遗漏偏好非事务，以及本地路由鉴权仅结构判断。维护者可在有备份个人profile中关自动补全、先等目录同步再看匹配/冲突/未声明后手动补，实际供应商文档优先；不宜对未知变体整库无审阅默认启用。错误匹配/填值、供应商默认档不支持或恢复后自动回写时停止批量补并从备份比较。

可继续研究逐字段来源收据与待确认补全计划，把exact/归一/默认、目录hash/版本、供应商/变体和用户手填来源分开；启动前明确catalog-ready或用户允许默认，不将猜测直接持久化。基线为当前直接补缺与手工文档，固定反例含慢目录启动、无容量命中、同名不同provider、变体受限、偏好写失败与并发设置变化，比较错误字段、恢复步骤及核对工时。它是未验证方向，不称现有插件已具备能力真值。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.js:369-417](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/catalog.js#L369-L417)

当前缺字段填充。

<details>
<summary>查看原文（49行）</summary>

```text
export function fillModelEntry(entry, models, defaults = emptyDefaults(), options = {}) {
  if (!entry || typeof entry !== 'object') return { model: entry, changed: false, matched: false }
  const id = typeof entry.id === 'string' ? entry.id.trim() : ''
  if (!id) return { model: entry, changed: false, matched: false }

  const next = clonePlain(entry)
  next.id = id
  const hit = lookupCatalogModel(models, id)
  const matched = Boolean(hit)
  let changed = false
  const fallback = parseDefaults(defaults)

  const conflicts = hit?.conflicts ?? {}
  if (missingCapacity(next.contextWindow)) {
    // Disagreeing copies: leave the field missing instead of copying one gateway.
    if (!conflicts.context) {
      next.contextWindow = hit?.contextWindow ?? fallback.contextWindow
      changed = true
    }
  }
  if (missingCapacity(next.maxTokens)) {
    if (!conflicts.output) {
      next.maxTokens = hit?.maxOutput ?? fallback.maxTokens
      changed = true
    }
  }
  if (missingInput(next.input)) {
    if (!conflicts.input) {
      next.input = hit ? sanitizeInput(hit.input) : defaultsInput(fallback)
      changed = true
    }
  }
  if (missingReasoning(next.reasoningEfforts)) {
    // A catalog hit that states no discrete level declares nothing, and an
    // off-only level set is invalid DSH config. Both leave the field unset: an
    // empty object would be refused, so drop it and let a missing field stay missing.
    // An explicit 「保持未声明」 is the same: do not invent the unmatched defaults.
    const omit = options?.omitReasoning === true
    const value = omit || (hit && hit.thinkingLevels === null)
      ? undefined
      : reasoningEffortsFromLevels(hit ? hit.thinkingLevels : fallback.thinkingLevels)
    if (value === undefined) {
      if (next.reasoningEfforts !== undefined) {
        delete next.reasoningEfforts
        changed = true
      }
    } else {
      next.reasoningEfforts = value
      changed = true
```

</details>

**依据 2 · 源码核查**：[src/index.js:317-334](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L317-L334)

启动先后。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => {
    let disposed = false
    const start = async () => {
      try {
        await loadCache()
      } catch (error) {
        ctx.logger?.warn?.(`[models-dev-catalog] failed to load cache: ${messageOf(error)}`)
        store.file = emptyCatalogFile()
      }
      if (disposed) return
      if (catalogIsStale(store.file.updatedAt)) {
        refreshCatalog().catch((error) => {
          ctx.logger?.warn?.(`[models-dev-catalog] refresh failed: ${messageOf(error)}`)
        })
      }
      maybeAutoFill()
    }
    start()
```

</details>

**依据 3 · 源码核查**：[src/index.js:296-307](https://github.com/11zld22/dsh-model-info-fill/blob/d377291f5ef8ad2bccbd54e26e641b9d89016bba/src/index.js#L296-L307)

双存储保存。

<details>
<summary>查看原文（12行）</summary>

```text
        const ops = buildModelSaveOps(readConfig(), body, store.file.defaults, store.file.models)
        await ctx.settings.mutate(LLM_PI_AI_NS, ops, llmRevision())
        const reasoningCleared = ops.some((op) => op.op === 'unset' && op.path.at(-1) === 'reasoning')
        const mode = typeof body.thinkingMode === 'string' ? body.thinkingMode : ''
        if (mode === 'unset' || mode === 'levels' || mode === 'none') {
          const current = store.file.omittedReasoning
          const next = mode === 'unset'
            ? rememberLegacyConfirmation(current, body.provider, body.id)
            : forgetLegacyConfirmation(current, body.provider, body.id)
          if (next.join('\0') !== parseConfirmedLegacy(current).join('\0')) {
            store.file.omittedReasoning = next
            await persist()
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
