# DSH Claude Provider

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8bf8d13](https://github.com/MoFeng2223/dsh-claude-provider/tree/8bf8d131a54f609167676bb6d4db82c35d18f077)

<!-- BEGIN META -->
[![GitHub ★ 35](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MoFeng2223/dsh-claude-provider) [![npm 30d 3,281](https://img.shields.io/static/v1?label=npm+30d&message=3%2C281&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mofeng2223/dsh-claude-provider) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mofeng2223/dsh-claude-provider)
<!-- END META -->

> **功能**：在 DSH 模型设置中添加 Claude 供应商、获取模型目录并配置推理档位。

> **亮点**：专用表单把 Claude 类型、目录分页与已知模型默认值接入现有 provider 设置。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：固定模型表可以覆盖端点声明的容量；设置、类型标记和凭据分步提交，后一步失败后应回读。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 专用 Claude 入口与宿主普通自定义供应商有什么差异？](#detail-section-11)
  - [Q02 · 目录请求如何处理分页、密钥、容量与上游不兼容？](#detail-section-12)
  - [Q03 · 如何在失败时回退，怎样检验按端点标记来源比固定容量表更稳妥？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复接入 Claude Messages 兼容供应商的 DSH 用户，希望少填目录和容量。

宿主普通自定义模型供应商表单或手工配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Claude 模型表单 | 配置供应商与推理档 | 写宿主 settings |
| 目录查询 | 获取模型名和容量 | 已知模型可被固定表覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH llm、settings、credentials | 配置需要 | 保存和发现 | 回到原生表单 |
| Claude 兼容地址与可撤销 key | 发现需要 | 读取目录 | 手填受信模型 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户填地址与模型 | 验证真实端点 |
| 退出 | 回读并按需清理两处设置与凭据 | 恢复原生模型页 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 目录访问及模型开销未知 | 校验地址、容量和 key | 失败后回读分步写入 |
| 持续 | 模型按上游计费 | 核对容量和推理档 | 未实测收益 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 目录接入 | 分页及已知值 | 模型生成与额度 |

> **思考**：固定模型表可以覆盖端点声明的容量；设置、类型标记和凭据分步提交，后一步失败后应回读。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：专用表单把 Claude 类型、目录分页与已知模型默认值接入现有 provider 设置。[Q01](#research-q01) [Q02](#research-q02)

分页上限、响应大小和去重清楚；同名容量覆盖与非原子设置写入需运行验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

固定模型表可以覆盖端点声明的容量；设置、类型标记和凭据分步提交，后一步失败后应回读。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

用低权限可撤销 key 在受信测试端点做短生成，失败时核对设置与凭据并切回普通表单。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持设置、目录和提交边界；宿主兼容、生成和费用未验。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、lib/client.js、src/index.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读固定 Host 发现、Web 表单与插件挂载。未运行宿主、模型或目录服务。
- 下一步：模拟重复游标、目录容量与固定表冲突，以及类型或凭据写入失败。

**分析版本**

- **仓库**：[MoFeng2223/dsh-claude-provider](https://github.com/MoFeng2223/dsh-claude-provider)
- **版本号**：0.6.6（[固定提交 8bf8d13](https://github.com/MoFeng2223/dsh-claude-provider/tree/8bf8d131a54f609167676bb6d4db82c35d18f077)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在表单并列标注端点、固定表和手工容量的来源，可能降低代理端点同名异配的误用。[Q03](#research-q03)

模拟重复游标、目录容量与固定表冲突，以及类型或凭据写入失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 475 | — | — | 2865 |
| .js | source | 3 | 6111 | 5397 | 711 | — |
| .mjs | source | 3 | 356 | 298 | 7 | — |
| .js | test | 2 | 515 | 478 | 15 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/MoFeng2223/dsh-claude-provider/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：配置多个 Claude 兼容端点时，专用表单和自动发现可以减少哪些操作，又会留下哪些部分提交及错误预设？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 专用 Claude 入口与宿主普通自定义供应商有什么差异？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

专用表单针对反复配置 Claude Messages 端点的人。它停用官方 ui-settings-models 行并用相同的 models 分区接管，保存时仍写宿主 llm-pi-ai 的 providers，协议设为 anthropic-messages；另写 Claude 类型标记和独立凭据。模型发现只拦特定命名空间和 API 标记，内置 anthropic 回原 discovery，其他调用也按原方法执行。收益是填表与发现便捷，真正模型调用由宿主适配完成。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/cordis.patch.yml#L1-L5)

插入插件并停用原模型设置行。

```text
- insert:
    - id: dsh-claude-provider
      name: '@mofeng2223/dsh-claude-provider'
- id: ui-settings-models
  disabled: true
```

**依据 2 · 源码核查**：[lib/client.js:1735-1766](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/lib/client.js#L1735-L1766)

写宿主 profile、插件类型标记和凭据。

<details>
<summary>查看原文（32行）</summary>

```text
			const createOnce = async () => {
				const keyRef = deriveKeyRef(route);
				const storesKey = keyValue.length > 0;
				if (!committed) {
					const profile = {
						...displayName.length === 0 ? {} : { displayName },
						...storesKey ? { apiKeyEnv: keyRef } : {},
						api: isAdaptiveClaude ? "anthropic-messages" : protocol,
						baseURL: normalizedBaseURL,
						models: models.map((model) => isAdaptiveClaude ? withNativeClaudeModel(model) : { ...model }),
						...isAdaptiveClaude ? { reasoning: "high" } : {}
					};
					const written = await operations.writeSettings(NS$1, [{
						op: "set",
						path: ["providers", route],
						value: isAdaptiveClaude ? withNativeClaudeProfile(profile) : profile
					}], openedAt);
					if (written.kind !== "written") return written.kind === "conflict" ? t("conflict") : written.message;
					setCommitted(true);
				}
				if (isAdaptiveClaude) {
					const typed = await operations.writeSettings(CLAUDE_PROVIDER_SETTINGS_NS, [{
						op: "set",
						path: ["providerTypes", route],
						value: CLAUDE_PROVIDER_TYPE
					}], void 0);
					if (typed.kind !== "written") return typed.kind === "conflict" ? t("conflict") : typed.message;
				}
				if (storesKey) {
					const stored = await operations.storeCredential(keyRef, keyValue);
					if (stored !== void 0) return stored;
				}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:5680-5688](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/lib/client.js#L5680-L5688)

注册 models 设置分区。

```text
			}, "ui-settings-models: pushed invalidations");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "models",
				order: 10,
				label: () => t("nav"),
				inject: injected,
				children: {
					"settings.models.provider-card": {
```

**依据 4 · 源码核查**：[src/index.js:240-266](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/src/index.js#L240-L266)

有条件拦截模型发现，释放时检查仍是自身 wrapper。

<details>
<summary>查看原文（27行）</summary>

```text
function installClaudeModelDiscovery(ctx) {
  const llm = ctx.llm
  const upstream = llm.discoverModels
  // DSH 0.1.2-alpha moved caller cancellation to a third positional
  // parameter; `request.signal` no longer exists. Forward it verbatim.
  // Only the plugin's own Claude surfaces send CLAUDE_DISCOVERY_API, so every
  // other provider — generic anthropic-messages routes included — keeps the
  // stock discovery behavior.
  const wrapped = async function (settingsNs, request, signal) {
    if (settingsNs !== PI_AI_SETTINGS_NS || request?.api !== CLAUDE_DISCOVERY_API) {
      return upstream.call(this, settingsNs, request, signal)
    }
    // The built-in Anthropic route already has pi-ai's catalog and should keep
    // using it. The plugin extension is only for hand-declared Claude routes.
    if (request.provider === 'anthropic') {
      return upstream.call(this, settingsNs, { ...request, api: 'anthropic-messages' }, signal)
    }
    if (typeof request.baseURL !== 'string' || request.baseURL.length === 0) {
      throw new Error('Claude 模型目录：请先填写 API 地址')
    }
    const apiKey = await discoveryApiKey(ctx, request)
    return discoverAnthropicModels({ baseURL: request.baseURL, apiKey, signal })
  }
  llm.discoverModels = wrapped
  ctx.effect(() => () => {
    if (llm.discoverModels === wrapped) llm.discoverModels = upstream
  })
```

</details>

#### 缺口

- 未验目标宿主安装和禁用后官方分区恢复
  **影响**：不能保证替换与回退适用于所有宿主
  **进一步探讨**：用隔离 profile 验证专用与内置表单切换

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录请求如何处理分页、密钥、容量与上游不兼容？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

Host 用显式 key，或用已保存 provider 的引用从凭据服务或进程环境解析，并向用户配置的 HTTP(S) 地址发 x-api-key。每页限制 4 MiB，总页数最多 100；按 id 去重，has_more 没有可用推进游标会报错。返回结构缺 data、非 JSON、HTTP 错误均可失败。对已知 ID 的本地表会覆盖接口返回的 contextWindow/maxTokens，代理复用同名但容量较低时，配置可能高估能力。目录能返回列表，不能证明该 key 可对该模型成功生成或预设推理档适配。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:62-99](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/src/index.js#L62-L99)

构造 models URL、限制协议和读取大小。

<details>
<summary>查看原文（38行）</summary>

```text
export function anthropicModelsUrl(baseURL) {
  const raw = requireNonEmptyString(baseURL, 'baseURL').trim()
  let url
  try {
    url = new URL(raw)
  } catch (error) {
    throw new Error('Claude 模型目录：API 地址不是有效 URL', { cause: error })
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Claude 模型目录：API 地址只能使用 http 或 https')
  }
  const path = url.pathname.replace(/\/+$/, '')
  url.pathname = /\/v1$/i.test(path) ? `${path}/models` : `${path}/v1/models`
  url.search = ''
  url.hash = ''
  return url
}

async function readBoundedResponse(response, url) {
  const declared = Number(response.headers.get('content-length') ?? Number.NaN)
  if (Number.isFinite(declared) && declared > MAX_DISCOVERY_RESPONSE_BYTES) {
    await response.body?.cancel()
    throw new Error(`Claude 模型目录：${url} 返回内容超过 4 MiB`)
  }
  if (response.body === null) return ''
  const reader = response.body.getReader()
  const chunks = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_DISCOVERY_RESPONSE_BYTES) {
        throw new Error(`Claude 模型目录：${url} 返回内容超过 4 MiB`)
      }
      chunks.push(value)
    }
```

</details>

**依据 2 · 源码核查**：[src/index.js:112-155](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/src/index.js#L112-L155)

读接口容量后已知 ID 覆盖，构建认证头。

<details>
<summary>查看原文（44行）</summary>

```text
/** Parse one Anthropic `/v1/models` page into DSH discovery rows. */
export function readAnthropicModelPage(body) {
  const data = body?.data
  if (!Array.isArray(data)) {
    throw new Error('Claude 模型目录：接口返回中没有 data 数组')
  }
  const models = []
  for (const raw of data) {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) continue
    const id = nonEmptyString(raw.id)
    if (id === undefined) continue
    const name = nonEmptyString(raw.display_name, raw.name)
    const contextWindow = positiveInteger(raw.max_input_tokens, raw.context_window, raw.context_length)
    const maxTokens = positiveInteger(raw.max_tokens, raw.max_output_tokens)
    models.push({
      id,
      ...name === undefined ? {} : { name },
      ...contextWindow === undefined ? {} : { contextWindow },
      ...maxTokens === undefined ? {} : { maxTokens },
    })
  }
  return {
    models,
    hasMore: body?.has_more === true,
    lastId: nonEmptyString(body?.last_id),
  }
}

/** Fill a discovered row's capacities from the recorded Claude model table. */
export function withKnownModelMetadata(model) {
  const known = CLAUDE_KNOWN_MODELS[model?.id]
  if (known === undefined) return model
  return { ...model, contextWindow: known.contextWindow, maxTokens: known.maxTokens }
}

function discoveryHeaders(apiKey) {
  const value = requireNonEmptyString(apiKey, 'apiKey').trim()
  if (value.length === 0) throw new Error('Claude 模型目录：请先填写 API 密钥')
  try {
    return new Headers({
      accept: 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': value,
    })
```

</details>

**依据 3 · 源码核查**：[src/index.js:167-212](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/src/index.js#L167-L212)

网络、游标、去重及分页退出。

<details>
<summary>查看原文（46行）</summary>

```text
export async function discoverAnthropicModels({ baseURL, apiKey, signal, fetchImpl = globalThis.fetch }) {
  if (typeof fetchImpl !== 'function') throw new Error('Claude 模型目录：当前运行环境没有 fetch')
  const endpoint = anthropicModelsUrl(baseURL)
  const headers = discoveryHeaders(apiKey)
  const models = []
  const seen = new Set()
  let afterId
  for (let page = 0; page < MAX_DISCOVERY_PAGES; page += 1) {
    if (signal?.aborted) throw new Error('Claude 模型目录：获取已取消')
    const url = new URL(endpoint)
    if (afterId !== undefined) url.searchParams.set('after_id', afterId)
    let response
    try {
      response = await fetchImpl(url, { method: 'GET', headers, signal })
    } catch (error) {
      if (signal?.aborted) throw new Error('Claude 模型目录：获取已取消', { cause: error })
      throw new Error(`Claude 模型目录：无法连接 ${url.origin}`, { cause: error })
    }
    const text = await readBoundedResponse(response, url.href)
    let body
    try {
      body = JSON.parse(text)
    } catch (error) {
      throw new Error(`Claude 模型目录：${url.href} 未返回 JSON`, { cause: error })
    }
    if (!response.ok) {
      const detail = responseErrorMessage(body)
      throw new Error(
        `Claude 模型目录：${url.href} 返回 ${response.status}`
        + `${response.status === 401 || response.status === 403 ? '，请检查 API 密钥' : ''}`
        + `${detail === undefined ? '' : `：${detail}`}`,
      )
    }
    const parsed = readAnthropicModelPage(body)
    for (const model of parsed.models) {
      if (seen.has(model.id)) continue
      seen.add(model.id)
      models.push(withKnownModelMetadata(model))
    }
    if (!parsed.hasMore) return models
    if (parsed.lastId === undefined || parsed.lastId === afterId) {
      throw new Error('Claude 模型目录：分页响应缺少有效的 last_id')
    }
    afterId = parsed.lastId
  }
  throw new Error(`Claude 模型目录：分页超过 ${MAX_DISCOVERY_PAGES} 页`)
```

</details>

**依据 4 · 源码核查**：[src/index.js:215-231](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/src/index.js#L215-L231)

密钥来源优先级和缺失错误。

<details>
<summary>查看原文（17行）</summary>

```text
function configuredCredentialRef(ctx, provider) {
  if (typeof provider !== 'string' || provider.length === 0) return undefined
  const section = ctx.get('settings')?.describe().find(entry => entry.ns === PI_AI_SETTINGS_NS)?.value
  const profile = section?.providers?.[provider]
  const ref = profile?.apiKeyEnv
  return typeof ref === 'string' && ref.length > 0 ? ref : undefined
}

async function discoveryApiKey(ctx, request) {
  if (typeof request.apiKey === 'string' && request.apiKey.trim().length > 0) return request.apiKey
  const ref = configuredCredentialRef(ctx, request.provider)
  if (ref === undefined) throw new Error('Claude 模型目录：请先填写 API 密钥')
  const value = (await ctx.get('credentials')?.resolve(ref))?.value ?? process.env[ref]
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Claude 模型目录：未找到已保存的凭据 ${ref}`)
  }
  return value
```

</details>

#### 缺口

- 未连接真实端点或验证反向代理的容量与证书
  **影响**：不能确认生成权限或安全地使用任意配置地址
  **进一步探讨**：用授权测试端点对照 mock 重复页、错误及短生成

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何在失败时回退，怎样检验按端点标记来源比固定容量表更稳妥？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

创建按顺序写 profile、类型标记、凭据，后一步失败可能留下前一步，因此退出应核对两处设置与凭据。首次配置成本从手写转为校验地址、模型和凭据；重复发现的网络调用和实际模型费用未测。建议用可撤销 key 和受信测试地址，先对照一个已知模型和一个普通 provider。可以将接口容量、固定表值和人工覆盖分别显示，再比较当前默认在代理容量偏离时的错误配置数；如果正常路由的误提示和操作负担增大而错误没有下降，就保留现有方式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1735-1766](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/lib/client.js#L1735-L1766)

分步提交，后续失败时前步可能已完成。

<details>
<summary>查看原文（32行）</summary>

```text
			const createOnce = async () => {
				const keyRef = deriveKeyRef(route);
				const storesKey = keyValue.length > 0;
				if (!committed) {
					const profile = {
						...displayName.length === 0 ? {} : { displayName },
						...storesKey ? { apiKeyEnv: keyRef } : {},
						api: isAdaptiveClaude ? "anthropic-messages" : protocol,
						baseURL: normalizedBaseURL,
						models: models.map((model) => isAdaptiveClaude ? withNativeClaudeModel(model) : { ...model }),
						...isAdaptiveClaude ? { reasoning: "high" } : {}
					};
					const written = await operations.writeSettings(NS$1, [{
						op: "set",
						path: ["providers", route],
						value: isAdaptiveClaude ? withNativeClaudeProfile(profile) : profile
					}], openedAt);
					if (written.kind !== "written") return written.kind === "conflict" ? t("conflict") : written.message;
					setCommitted(true);
				}
				if (isAdaptiveClaude) {
					const typed = await operations.writeSettings(CLAUDE_PROVIDER_SETTINGS_NS, [{
						op: "set",
						path: ["providerTypes", route],
						value: CLAUDE_PROVIDER_TYPE
					}], void 0);
					if (typed.kind !== "written") return typed.kind === "conflict" ? t("conflict") : typed.message;
				}
				if (storesKey) {
					const stored = await operations.storeCredential(keyRef, keyValue);
					if (stored !== void 0) return stored;
				}
```

</details>

**依据 2 · 源码核查**：[src/index.js:123-145](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/src/index.js#L123-L145)

上游值和固定容量覆盖形成对照。

<details>
<summary>查看原文（23行）</summary>

```text
    const name = nonEmptyString(raw.display_name, raw.name)
    const contextWindow = positiveInteger(raw.max_input_tokens, raw.context_window, raw.context_length)
    const maxTokens = positiveInteger(raw.max_tokens, raw.max_output_tokens)
    models.push({
      id,
      ...name === undefined ? {} : { name },
      ...contextWindow === undefined ? {} : { contextWindow },
      ...maxTokens === undefined ? {} : { maxTokens },
    })
  }
  return {
    models,
    hasMore: body?.has_more === true,
    lastId: nonEmptyString(body?.last_id),
  }
}

/** Fill a discovered row's capacities from the recorded Claude model table. */
export function withKnownModelMetadata(model) {
  const known = CLAUDE_KNOWN_MODELS[model?.id]
  if (known === undefined) return model
  return { ...model, contextWindow: known.contextWindow, maxTokens: known.maxTokens }
}
```

</details>

**依据 3 · 作者声明**：[README.md:78-80](https://github.com/MoFeng2223/dsh-claude-provider/blob/8bf8d131a54f609167676bb6d4db82c35d18f077/README.md#L78-L80)

作者说明卸载保留官方模型配置和凭据。

````text
```

Uninstalling the plugin does not delete official model settings or stored credentials. Existing Claude providers remain ordinary custom `anthropic-messages` providers, and their saved reasoning levels and adaptive thinking settings remain effective. The dedicated Claude add/edit interface, paginated model discovery, and automatic defaults are no longer available; the official model discovery feature remains available.
````

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
