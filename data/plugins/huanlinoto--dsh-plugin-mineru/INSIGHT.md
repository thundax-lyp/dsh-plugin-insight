# MinerU文档解析桥

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[374edb9](https://github.com/HuanLinOTO/dsh-plugin-mineru/tree/374edb93b9543a4040aed88f122ddf1ecbd6812e)

<!-- BEGIN META -->
[![GitHub ★ 52](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=52&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HuanLinOTO/dsh-plugin-mineru) [![npm 30d 1,575](https://img.shields.io/static/v1?label=npm+30d&message=1%2C575&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-mineru) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huanlin/dsh-plugin-mineru)
<!-- END META -->

> **功能**：把本地文档上传到外部MinerU服务，通过DSH模型工具查询异步任务并返回Markdown/结果路径。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)五模型工具、配置凭据与异步轮询/文本截断/JSON路径适配，非新OCR。

> **主要限制**：[Q03](#research-q03)上传范围与数据服务身份、取消不撤远端、整读和临时留存无预算；[Q02](#research-q02)completed和首stem不证明完整可用。

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
  - [Q01 · 谁需要该文档解析桥，插件和MinerU分别贡献什么？](#detail-section-11)
  - [Q02 · 实际如何读文件上传、等待和返回，身份与失败在哪处理？](#detail-section-12)
  - [Q03 · 资源、数据出界、取消和结果保留有哪些采用门槛？](#detail-section-13)
  - [Q04 · 下一步应验证什么差异化，而非再包装OCR？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是原生DSH双端插件@huanlin/dsh-plugin-mineru 0.4.2，不是OCR引擎或通用Skill。它面向已有MinerU服务、要让模型读取本地PDF/办公文档的人，提供健康、异步提交、状态、结果及一键解析五工具；成功是目标页内容和表格公式可用、可追溯且未漏页，不是completed状态。

手工MinerU API/CLI与复制结果；OCR和版面解析已有引擎提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 上传解析 | 本地文档交引擎 | 本地整读/外部服务 |
| 轮询 | 查询异步任务 | 取消等待不撤远端 |
| 结果 | 首stem Markdown/完整JSON | 内容质量须核原件 |
| 截断 | 控制内联字符 | tmp留存非资源预算 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
|---|---|---|---|
| DSH工具服务/宿主文件权限 | 必需 | 注册与本地读取 | 不能取URL直接解析 |
| MinerU兼容API/baseURL | 必需 | 实际解析/存储 | 插件不提供引擎部署 |
| 凭据/可信网络 | 按部署 | Bearer/数据传输 | 可选key不等服务认证 |
| 人工原件核验 | 采用前提 | 页/表格公式完整性 | completed不验内容 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 核可信API/留存/本地权限 | 不上传敏感原件 |
| 探活 | 配URL和凭据后health | 健康不等解析质量 |
| 小样 | 提交并记task_id，查状态/结果 | failed查上游，超时不盲目重投 |
| 核验 | 对原件逐页并检查全部stem/JSON | 首stem不等完整交付 |
| 退出 | 停本地等待、查远端并清临时归属 | 取消不撤销/删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 服务/GPU/模型/网络金额未知 | 部署/协议/认证 | 插件不含引擎 |
| 持续 | token/上传/响应/磁盘未知 | 核页/表格公式 | 字符截断非资源预算 |
| 故障 | 远端继续计算/重复上传未知 | 按任务ID找回 | 无远端取消/持久账本 |
| 退出 | 上游和tmp留存未知 | 人工确认清理 | 停插件不自动删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 适配 | 上传/状态/结果真实调用 | 实际部署兼容 |
| 模型输出 | 首stem文本/完整JSON路径 | 页覆盖/准确率 |
| 大文本 | 截断并写tmp | 总内存磁盘上限 |
| 取消 | 中断本地HTTP/等待 | 远端撤销/清理 |

> **思考**：[Q03](#research-q03)上传范围与数据服务身份、取消不撤远端、整读和临时留存无预算；[Q02](#research-q02)completed和首stem不证明完整可用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)五模型工具、配置凭据与异步轮询/文本截断/JSON路径适配，非新OCR。

[Q02](#research-q02)分步task_id和一键轮询可借鉴；应分离等待取消/远端撤销、内联字符/真实资源预算及完成状态/质量验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)上传范围与数据服务身份、取消不撤远端、整读和临时留存无预算；[Q02](#research-q02)completed和首stem不证明完整可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)观察；可信服务和可丢弃小样前提下人工核验，不敏感批量无人值守。

用扫描件/多表格/公式/多stem样本对照现有MinerU人工调用，记录覆盖错误、误引、上传重复、恢复人工、token及总费用；注入超时/failed/空结果，若回执不能降低错误和找回成本，或增加的人审超过收益则停止。现阶段建议观察；已有可信服务者可先验证小文档，不能将缺少质量验收的文本直接当业务事实。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态执行链可追，外部服务/数据边界和质量成本未验，观察而非无人值守采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client.ts、src/index.ts、src/tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、入口配置凭据/注册、client真实读文件和HTTP/轮询、tools参数映射及提交/状态/结果/一键/截断、RPC健康路线；未全审设置UI/上游MinerU引擎。
- 下一步：只读固定源码，未运行安装目标/Host/MinerU或上传文档；部署和质量/故障/成本均未独立验。

**分析版本**

- **仓库**：[HuanLinOTO/dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru)
- **版本号**：0.4.2（[固定提交 374edb9](https://github.com/HuanLinOTO/dsh-plugin-mineru/tree/374edb93b9543a4040aed88f122ddf1ecbd6812e)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)当前可借鉴的是异步任务和输出截断的薄适配，但completed只表示引擎状态，首stem Markdown也不等完整交付。独立假设：增加任务/源文件摘要、请求页范围、全部stem、解析覆盖及输出资产位置的回执，由人确认漏页/表格公式，再交模型引用，可能减少错误引用和中断后重复上传。这是本研究提出的未验证方向，不计当前创新分。

用扫描件/多表格/公式/多stem样本对照现有MinerU人工调用，记录覆盖错误、误引、上传重复、恢复人工、token及总费用；注入超时/failed/空结果，若回执不能降低错误和找回成本，或增加的人审超过收益则停止。现阶段建议观察；已有可信服务者可先验证小文档，不能将缺少质量验收的文本直接当业务事实。

只读固定源码，未运行安装目标/Host/MinerU或上传文档；部署和质量/故障/成本均未独立验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 597 | — | — | 7903 |
| .js | source | 2 | 2039 | 1927 | 181 | — |
| .ts | source | 11 | 2374 | 2038 | 220 | — |
| .tsx | source | 1 | 213 | 184 | 9 | — |
| .ts | test | 2 | 542 | 466 | 20 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/HuanLinOTO/dsh-plugin-mineru/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分引擎与适配贡献，核文件出界、异步执行及结果质量和恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要该文档解析桥，插件和MinerU分别贡献什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH双端插件@huanlin/dsh-plugin-mineru 0.4.2，不是OCR引擎或通用Skill。它面向已有MinerU服务、要让模型读取本地PDF/办公文档的人，提供健康、异步提交、状态、结果及一键解析五工具；成功是目标页内容和表格公式可用、可追溯且未漏页，不是completed状态。

基线是人工调MinerU API/CLI并搬运结果到对话。插件贡献是配置/凭据和模型工具适配、异步轮询、Markdown截断及结果路径返回。OCR、版面识别和格式兼容是外部MinerU能力，README列出的格式不能当本插件独立准确率或当前部署兼容证明。没有真实用户任务/质量对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-9](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/README.md#L9-L9)

作者把文档转换能力归于MinerU。

```text
DSH 插件：向模型暴露 [MinerU](https://github.com/opendatalab/MinerU) 文档解析工具。MinerU 可将 PDF、图片、DOCX、PPTX、XLSX 等文件转换为结构化的 Markdown / JSON。
```

**依据 2 · 作者声明**：[README.md:44-64](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/README.md#L44-L64)

作者五工具及输入本地文档/JSON结果主张。

<details>
<summary>查看原文（21行）</summary>

```text
## 工具

### `mineru_parse_document`（推荐）

解析本地文档并返回提取出的 markdown。内部自动完成：提交文件 → 轮询至完成 → 返回 markdown。大多数解析任务用这个即可。

### `mineru_submit_parse_job`

异步提交解析任务，立即返回 `task_id`。适合大文档或并行批量提交。

### `mineru_get_parse_status`

轮询异步任务状态，返回 `pending` / `processing` / `completed` / `failed`。

### `mineru_get_parse_result`

获取已完成任务的结果。内联返回 markdown（过大则截断），并将完整结构化 JSON 存到 `raw_result_path`。

### `mineru_health`

检查服务器健康状态、版本、队列深度与并发容量。
```

</details>

**依据 3 · 源码核查**：[package.json:1-36](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/package.json#L1-L36)

名称版本许可、Host入口与bundle。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "@huanlin/dsh-plugin-mineru",
  "version": "0.4.2",
  "publishConfig": {
    "access": "public"
  },
  "keywords": [
    "dsh-plugin"
  ],
  "description": "DSH plugin exposing MinerU document parsing tools to the model, with a web UI settings page for the API base URL.",
  "type": "module",
  "license": "AGPL-3.0",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/",
    "locale/",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
```

</details>

**依据 4 · 源码核查**：[src/index.ts:140-174](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/index.ts#L140-L174)

真实注册工具及配置/RPC接线。

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx: Context, config: EntryConfig = {} as EntryConfig): void {
  // Fail loud at load when the composition layers provide no baseURL.
  let resolved = resolveConfig(config)
  let client = makeClient(ctx, resolved)

  // Re-read the volatile references on every access; a committed settings
  // edit hot-swaps the in-memory client without re-registering tools.
  const getResolved = (): ResolvedConfig => {
    const next = resolveConfig(config)
    if (JSON.stringify(next) !== JSON.stringify(resolved)) {
      resolved = next
      client = makeClient(ctx, next)
      ctx.logger.info(`dsh-mineru: config updated, baseURL=${next.baseURL}`)
    }
    return resolved
  }
  const getClient = (): MinerUClient => {
    void getResolved()
    return client
  }

  // 1. Register tools (once; getters make them see live config).
  registerTools(ctx, getClient, getResolved)

  // 2. Settings presentation policy: this plugin ships its own configuration
  //    card on the Plugins page (`plugins.row.config`, browser side), so
  //    suppress the schema-generated page. Values persist per profile under
  //    the entry id via the settings service.
  ctx.inject(['settings'], (sctx) => {
    sctx.effect(() => sctx.settings.configure({ auto: false }, ctx.fiber))
  })

  // 3. RPC: health probe for the browser configuration card (`/api` Fetch route).
  registerRpc(ctx, { getClient })
}
```

</details>

#### 缺口

- 无真实扫描件/表格公式漏页率及持续需求证据。
  **影响**：能接通API不证明内容可直接引用或优于现有MinerU操作。
  **进一步探讨**：对同文档人工API与DSH适配比较页覆盖、错误与总耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实际如何读文件上传、等待和返回，身份与失败在哪处理？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

入口要求非空baseURL，配置支持热换client；凭据先由credentials.resolve取值，失败或无值再读同名环境变量。HTTP客户端可附Bearer，带key时拒绝重定向、不带key时follow；baseURL并没有HTTPS或目标地址允许列表校验。浏览器配置探活不是独立解析执行器。

submitTask先原生readFile整文件、Blob/FormData上传POST /tasks，期望202；状态和结果GET用encodeURIComponent(taskId)。request转发工具取消并设置每次HTTP超时，检查状态及JSON content-type，JSON仅类型断言不做运行时响应校验。读文件发生在request的取消检查前，没有本插件workspace限定、大小预检或流式上传保证。

一键工具捕获当前config/client，提交后pollUntilDone；completed/failed结束，轮询超时在一次状态HTTP之后检查，非精确总墙钟硬上限。failed返回任务错误，completed再取结果，只取第一个file stem的Markdown；没有非空/页覆盖质量验收。异步get_result另外把完整结构化JSON写临时文件，一键工具不写该raw_result_path。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:100-162](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/index.ts#L100-L162)

非空URL、凭据回退及热换/工具真实注册。

<details>
<summary>查看原文（63行）</summary>

```text
function resolveConfig(entry: EntryConfig): ResolvedConfig {
  const baseURL = live(entry.baseURL)
  if (typeof baseURL !== 'string' || baseURL === '') {
    throw new Error('dsh-mineru: config "baseURL" is required. Set it on the plugin\'s configure page in the DSH GUI Plugins list or in cordis.patch.yml.')
  }
  return {
    baseURL,
    apiKeyEnv: live(entry.apiKeyEnv) ?? 'MINERU_API_KEY',
    defaultBackend: live(entry.defaultBackend) ?? 'pipeline',
    defaultParseMethod: live(entry.defaultParseMethod) ?? 'auto',
    defaultLang: live(entry.defaultLang) ?? 'ch',
    pollIntervalMs: live(entry.pollIntervalMs) ?? 2000,
    pollTimeoutMs: live(entry.pollTimeoutMs) ?? 600000,
    requestTimeoutMs: live(entry.requestTimeoutMs) ?? 60000,
    maxMdOutputChars: live(entry.maxMdOutputChars) ?? 200000,
  }
}

function makeClient(ctx: Context, resolved: ResolvedConfig): MinerUClient {
  return new MinerUClient({
    baseURL: resolved.baseURL,
    timeoutMs: resolved.requestTimeoutMs,
    apiKeyResolver: async () => {
      try {
        const credentials = ctx.get('credentials') as
          | { resolve?: (ref: string) => Promise<{ value: string } | undefined> }
          | undefined
        if (credentials?.resolve) {
          const hit = await credentials.resolve(resolved.apiKeyEnv)
          if (hit?.value) return hit.value
        }
      } catch {
        // credentials service not available; fall through to env
      }
      const envVal = process.env[resolved.apiKeyEnv]
      return envVal && envVal.length > 0 ? envVal : undefined
    },
  })
}

export function apply(ctx: Context, config: EntryConfig = {} as EntryConfig): void {
  // Fail loud at load when the composition layers provide no baseURL.
  let resolved = resolveConfig(config)
  let client = makeClient(ctx, resolved)

  // Re-read the volatile references on every access; a committed settings
  // edit hot-swaps the in-memory client without re-registering tools.
  const getResolved = (): ResolvedConfig => {
    const next = resolveConfig(config)
    if (JSON.stringify(next) !== JSON.stringify(resolved)) {
      resolved = next
      client = makeClient(ctx, next)
      ctx.logger.info(`dsh-mineru: config updated, baseURL=${next.baseURL}`)
    }
    return resolved
  }
  const getClient = (): MinerUClient => {
    void getResolved()
    return client
  }

  // 1. Register tools (once; getters make them see live config).
  registerTools(ctx, getClient, getResolved)
```

</details>

**依据 2 · 源码核查**：[src/client.ts:130-170](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/client.ts#L130-L170)

整文件读取及表单构造。

<details>
<summary>查看原文（41行）</summary>

```text
export async function buildFormData(filePath: string, params: ParseParams): Promise<FormData> {
  const buffer = await readFile(filePath)
  const fileName = basename(filePath)
  const mime = mimeTypeForExt(extname(fileName))
  const blob = new Blob([buffer], { type: mime })

  const form = new FormData()
  form.append('files', blob, fileName)

  const appendBool = (key: string, val: boolean | undefined) => {
    if (val !== undefined) form.append(key, String(val))
  }
  const appendStr = (key: string, val: string | undefined) => {
    if (val !== undefined) form.append(key, val)
  }
  const appendInt = (key: string, val: number | undefined) => {
    if (val !== undefined) form.append(key, String(val))
  }

  appendStr('backend', params.backend)
  appendStr('parse_method', params.parse_method)
  appendStr('effort', params.effort)
  appendStr('server_url', params.server_url)
  appendBool('formula_enable', params.formula_enable)
  appendBool('table_enable', params.table_enable)
  appendBool('image_analysis', params.image_analysis)
  appendBool('return_md', params.return_md)
  appendBool('return_middle_json', params.return_middle_json)
  appendBool('return_model_output', params.return_model_output)
  appendBool('return_content_list', params.return_content_list)
  appendBool('return_images', params.return_images)
  appendBool('response_format_zip', params.response_format_zip)
  appendBool('return_original_file', params.return_original_file)
  appendInt('start_page_id', params.start_page_id)
  appendInt('end_page_id', params.end_page_id)

  if (params.lang_list !== undefined) {
    for (const lang of params.lang_list) form.append('lang_list', lang)
  }

  return form
```

</details>

**依据 3 · 源码核查**：[src/client.ts:189-292](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/client.ts#L189-L292)

真实提交/GET、Bearer/redirect、状态JSON检查、取消超时及轮询。

<details>
<summary>查看原文（104行）</summary>

```text

  async health(signal: AbortSignal): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/health', undefined, signal, [200])
  }

  async submitTask(filePath: string, params: ParseParams, signal: AbortSignal): Promise<TaskSubmitResponse> {
    const form = await buildFormData(filePath, params)
    return this.request<TaskSubmitResponse>('POST', '/tasks', form, signal, [202])
  }

  async getTaskStatus(taskId: string, signal: AbortSignal): Promise<TaskStatusResponse> {
    return this.request<TaskStatusResponse>('GET', `/tasks/${encodeURIComponent(taskId)}`, undefined, signal, [200])
  }

  async getTaskResult(taskId: string, signal: AbortSignal): Promise<TaskResultResponse> {
    return this.request<TaskResultResponse>('GET', `/tasks/${encodeURIComponent(taskId)}/result`, undefined, signal, [200])
  }

  private async request<T>(
    method: string,
    path: string,
    body: FormData | undefined,
    parentSignal: AbortSignal,
    acceptedStatuses: number[],
  ): Promise<T> {
    parentSignal.throwIfAborted()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)
    const onParentAbort = () => controller.abort()
    parentSignal.addEventListener('abort', onParentAbort, { once: true })

    try {
      const apiKey = this.apiKeyResolver ? await this.apiKeyResolver() : undefined
      parentSignal.throwIfAborted()

      const headers: Record<string, string> = {}
      if (apiKey) headers['authorization'] = `Bearer ${apiKey}`

      const response = await fetch(`${this.baseURL}${path}`, {
        method,
        headers,
        body,
        signal: controller.signal,
        redirect: apiKey ? 'error' : 'follow',
      })

      const status = response.status

      if (!acceptedStatuses.includes(status)) {
        let errorBody: unknown
        try {
          errorBody = await response.json()
        } catch {
          try {
            errorBody = await response.text()
          } catch {
            errorBody = null
          }
        }
        throw new MinerUError(
          `MinerU ${method} ${path} returned ${status}`,
          status,
          errorBody,
        )
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        throw new MinerUError(
          `MinerU ${method} ${path} returned non-JSON content-type: ${contentType}`,
          status,
          null,
        )
      }

      return (await response.json()) as T
    } finally {
      clearTimeout(timeoutId)
      parentSignal.removeEventListener('abort', onParentAbort)
    }
  }
}

export async function pollUntilDone(
  client: MinerUClient,
  taskId: string,
  opts: { intervalMs: number; timeoutMs: number; signal: AbortSignal },
): Promise<TaskStatusResponse> {
  const deadline = Date.now() + opts.timeoutMs
  for (;;) {
    opts.signal.throwIfAborted()
    const status = await client.getTaskStatus(taskId, opts.signal)
    if (status.status === 'completed' || status.status === 'failed') return status
    if (Date.now() >= deadline) {
      throw new MinerUError(
        `Polling timed out after ${opts.timeoutMs}ms for task ${taskId}`,
        408,
        status,
      )
    }
    await sleep(opts.intervalMs, opts.signal)
  }
}
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:563-618](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/tools.ts#L563-L618)

一键执行实际提交轮询failed/completed与首项结果。

<details>
<summary>查看原文（56行）</summary>

```text
    timeoutMs: 900000,
    execute: async (args: unknown, exec: ToolRunContext) => {
      const a = args as ParseToolArgs & { poll_timeout_ms?: number }
      exec.signal.throwIfAborted()

      const cfg = config()
      const c = client()
      const submit = await c.submitTask(a.file_path, toParseParams(a, cfg), exec.signal)

      const pollTimeoutMs = a.poll_timeout_ms ?? cfg.pollTimeoutMs
      const finalStatus = await pollUntilDone(c, submit.task_id, {
        intervalMs: cfg.pollIntervalMs,
        timeoutMs: pollTimeoutMs,
        signal: exec.signal,
      })

      if (finalStatus.status === 'failed') {
        return {
          task_id: submit.task_id,
          status: 'failed' as const,
          error: finalStatus.error ?? 'Task failed without error message',
        }
      }

      const result = await c.getTaskResult(submit.task_id, exec.signal)
      const fileStems = Object.keys(result.results)
      const firstStem = fileStems[0]
      const firstResult = firstStem !== undefined ? result.results[firstStem] : undefined
      const mdContent = firstResult?.md_content ?? ''

      const { content, truncated, fullMdPath } = await maybeTruncateMd(mdContent, cfg.maxMdOutputChars, submit.task_id)

      const out: {
        task_id: string
        status: 'completed' | 'failed'
        backend?: string
        version?: string
        file_stems?: string[]
        md_content?: string
        md_truncated?: boolean
        full_md_path?: string
        error?: string
      } = {
        task_id: submit.task_id,
        status: 'completed' as const,
      }
      if (result.backend) out.backend = result.backend
      if (result.version) out.version = result.version
      if (fileStems.length > 0) out.file_stems = fileStems
      if (content) out.md_content = content
      if (truncated) out.md_truncated = truncated
      if (fullMdPath) out.full_md_path = fullMdPath
      return out
    },
  }))
}
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:447-478](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/tools.ts#L447-L478)

异步结果完整JSON落盘及首项内联。

<details>
<summary>查看原文（32行）</summary>

```text
      exec.signal.throwIfAborted()
      const result: TaskResultResponse = await client().getTaskResult(a.task_id, exec.signal)
      const fileStems = Object.keys(result.results)
      const firstStem = fileStems[0]
      const firstResult = firstStem !== undefined ? result.results[firstStem] : undefined
      const mdContent = firstResult?.md_content ?? ''

      const rawResultPath = join(tmpdir(), `mineru-result-${a.task_id}.json`)
      await writeFile(rawResultPath, JSON.stringify(result, null, 2), 'utf8')

      const { content, truncated, fullMdPath } = await maybeTruncateMd(mdContent, config().maxMdOutputChars, a.task_id)

      const out: {
        task_id: string
        backend?: string
        version?: string
        file_stems?: string[]
        md_content?: string
        md_truncated?: boolean
        full_md_path?: string
        raw_result_path?: string
      } = {
        task_id: a.task_id,
        raw_result_path: rawResultPath,
      }
      if (result.backend) out.backend = result.backend
      if (result.version) out.version = result.version
      if (fileStems.length > 0) out.file_stems = fileStems
      if (content) out.md_content = content
      if (truncated) out.md_truncated = truncated
      if (fullMdPath) out.full_md_path = fullMdPath
      return out
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 资源、数据出界、取消和结果保留有哪些采用门槛？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

本地文件上传到配置服务，文件路径由工具参数给出，读权限取决于Host进程。没有在此读取路径设置workspace隔离或文件大小上限；敏感文档应先核服务归属、访问范围和上游留存政策。Bearer可选并不等服务已认证，明文HTTP也未被禁止。

maxMdOutputChars只限制返回文本字符，不限制原始文件、JSON响应、服务端算力或磁盘。超长Markdown写系统tmp下按taskId命名的文件，get_result总写完整JSON；未见该路径上的私有权限/工作区归属或清理机制，任务ID也参与本地命名。未测试可利用性，不由此声称已发生越权。

AbortSignal可停止本地HTTP/轮询等待，没有撤销远端任务的接口调用，也不清除已上传文档/结果或临时文件。任务ID可用于分步查询，但插件没有持久任务账本/重启自动恢复；一键提交后若断开前未交付task_id，人工找回依赖外部服务。部署、GPU/模型/网络/存储、模型token和人工核文档金额均未知，不能填0。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:130-137](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/client.ts#L130-L137)

文件整读上传，读取本身未带signal或workspace/size限定。

```text
export async function buildFormData(filePath: string, params: ParseParams): Promise<FormData> {
  const buffer = await readFile(filePath)
  const fileName = basename(filePath)
  const mime = mimeTypeForExt(extname(fileName))
  const blob = new Blob([buffer], { type: mime })

  const form = new FormData()
  form.append('files', blob, fileName)
```

**依据 2 · 源码核查**：[src/client.ts:189-292](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/client.ts#L189-L292)

实际只提交/查询/结果与取消等待，无远端撤销链。

<details>
<summary>查看原文（104行）</summary>

```text

  async health(signal: AbortSignal): Promise<HealthResponse> {
    return this.request<HealthResponse>('GET', '/health', undefined, signal, [200])
  }

  async submitTask(filePath: string, params: ParseParams, signal: AbortSignal): Promise<TaskSubmitResponse> {
    const form = await buildFormData(filePath, params)
    return this.request<TaskSubmitResponse>('POST', '/tasks', form, signal, [202])
  }

  async getTaskStatus(taskId: string, signal: AbortSignal): Promise<TaskStatusResponse> {
    return this.request<TaskStatusResponse>('GET', `/tasks/${encodeURIComponent(taskId)}`, undefined, signal, [200])
  }

  async getTaskResult(taskId: string, signal: AbortSignal): Promise<TaskResultResponse> {
    return this.request<TaskResultResponse>('GET', `/tasks/${encodeURIComponent(taskId)}/result`, undefined, signal, [200])
  }

  private async request<T>(
    method: string,
    path: string,
    body: FormData | undefined,
    parentSignal: AbortSignal,
    acceptedStatuses: number[],
  ): Promise<T> {
    parentSignal.throwIfAborted()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)
    const onParentAbort = () => controller.abort()
    parentSignal.addEventListener('abort', onParentAbort, { once: true })

    try {
      const apiKey = this.apiKeyResolver ? await this.apiKeyResolver() : undefined
      parentSignal.throwIfAborted()

      const headers: Record<string, string> = {}
      if (apiKey) headers['authorization'] = `Bearer ${apiKey}`

      const response = await fetch(`${this.baseURL}${path}`, {
        method,
        headers,
        body,
        signal: controller.signal,
        redirect: apiKey ? 'error' : 'follow',
      })

      const status = response.status

      if (!acceptedStatuses.includes(status)) {
        let errorBody: unknown
        try {
          errorBody = await response.json()
        } catch {
          try {
            errorBody = await response.text()
          } catch {
            errorBody = null
          }
        }
        throw new MinerUError(
          `MinerU ${method} ${path} returned ${status}`,
          status,
          errorBody,
        )
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.includes('application/json')) {
        throw new MinerUError(
          `MinerU ${method} ${path} returned non-JSON content-type: ${contentType}`,
          status,
          null,
        )
      }

      return (await response.json()) as T
    } finally {
      clearTimeout(timeoutId)
      parentSignal.removeEventListener('abort', onParentAbort)
    }
  }
}

export async function pollUntilDone(
  client: MinerUClient,
  taskId: string,
  opts: { intervalMs: number; timeoutMs: number; signal: AbortSignal },
): Promise<TaskStatusResponse> {
  const deadline = Date.now() + opts.timeoutMs
  for (;;) {
    opts.signal.throwIfAborted()
    const status = await client.getTaskStatus(taskId, opts.signal)
    if (status.status === 'completed' || status.status === 'failed') return status
    if (Date.now() >= deadline) {
      throw new MinerUError(
        `Polling timed out after ${opts.timeoutMs}ms for task ${taskId}`,
        408,
        status,
      )
    }
    await sleep(opts.intervalMs, opts.signal)
  }
}
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:90-99](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/tools.ts#L90-L99)

按taskId在tmp写完整Markdown再截断内联。

<details>
<summary>查看原文（10行）</summary>

```text
export async function maybeTruncateMd(md: string, maxChars: number, taskId: string): Promise<TruncateResult> {
  if (md.length <= maxChars) return { content: md, truncated: false }
  const fullMdPath = join(tmpdir(), `mineru-${taskId}.md`)
  await writeFile(fullMdPath, md, 'utf8')
  return {
    content: md.slice(0, maxChars) + `\n\n... [truncated; full content saved to ${fullMdPath}]`,
    truncated: true,
    fullMdPath,
  }
}
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:447-478](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/tools.ts#L447-L478)

完整JSON临时文件保留。

<details>
<summary>查看原文（32行）</summary>

```text
      exec.signal.throwIfAborted()
      const result: TaskResultResponse = await client().getTaskResult(a.task_id, exec.signal)
      const fileStems = Object.keys(result.results)
      const firstStem = fileStems[0]
      const firstResult = firstStem !== undefined ? result.results[firstStem] : undefined
      const mdContent = firstResult?.md_content ?? ''

      const rawResultPath = join(tmpdir(), `mineru-result-${a.task_id}.json`)
      await writeFile(rawResultPath, JSON.stringify(result, null, 2), 'utf8')

      const { content, truncated, fullMdPath } = await maybeTruncateMd(mdContent, config().maxMdOutputChars, a.task_id)

      const out: {
        task_id: string
        backend?: string
        version?: string
        file_stems?: string[]
        md_content?: string
        md_truncated?: boolean
        full_md_path?: string
        raw_result_path?: string
      } = {
        task_id: a.task_id,
        raw_result_path: rawResultPath,
      }
      if (result.backend) out.backend = result.backend
      if (result.version) out.version = result.version
      if (fileStems.length > 0) out.file_stems = fileStems
      if (content) out.md_content = content
      if (truncated) out.md_truncated = truncated
      if (fullMdPath) out.full_md_path = fullMdPath
      return out
```

</details>

**依据 5 · 源码核查**：[src/index.ts:78-88](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/index.ts#L78-L88)

默认轮询/HTTP/内联字符配置。

<details>
<summary>查看原文（11行）</summary>

```text
export const Config = z.object({
  baseURL: z.string().description('MinerU API base URL (e.g. http://host:18000). Required.').volatile(),
  apiKeyEnv: z.string().role('credential-ref').default('MINERU_API_KEY').volatile(),
  defaultBackend: z.union(['pipeline', 'vlm-engine', 'hybrid-engine', 'vlm-http-client', 'hybrid-http-client']).default('pipeline').volatile(),
  defaultParseMethod: z.union(['auto', 'txt', 'ocr']).default('auto').volatile(),
  defaultLang: z.string().default('ch').volatile(),
  pollIntervalMs: z.number().default(2000).volatile(),
  pollTimeoutMs: z.number().default(600000).volatile(),
  requestTimeoutMs: z.number().default(60000).volatile(),
  maxMdOutputChars: z.number().default(200000).volatile(),
}) as unknown as z<EntryConfig>
```

</details>

#### 缺口

- 服务收费/算力、文档留存和删除、宿主授权、临时文件清理成本未知。
  **影响**：不宜据潜在省时推广到敏感材料或大批量无人值守。
  **进一步探讨**：先确认服务身份和留存，限定可丢弃文档，测内存/磁盘并演练远端清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 下一步应验证什么差异化，而非再包装OCR？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

当前可借鉴的是异步任务和输出截断的薄适配，但completed只表示引擎状态，首stem Markdown也不等完整交付。独立假设：增加任务/源文件摘要、请求页范围、全部stem、解析覆盖及输出资产位置的回执，由人确认漏页/表格公式，再交模型引用，可能减少错误引用和中断后重复上传。这是本研究提出的未验证方向，不计当前创新分。

用扫描件/多表格/公式/多stem样本对照现有MinerU人工调用，记录覆盖错误、误引、上传重复、恢复人工、token及总费用；注入超时/failed/空结果，若回执不能降低错误和找回成本，或增加的人审超过收益则停止。现阶段建议观察；已有可信服务者可先验证小文档，不能将缺少质量验收的文本直接当业务事实。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:68-81](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/tools.ts#L68-L81)

默认页范围/返回选项与请求映射。

<details>
<summary>查看原文（14行）</summary>

```text
function toParseParams(args: ParseToolArgs, config: ResolvedConfig): ParseParams {
  return {
    backend: args.backend ?? config.defaultBackend,
    parse_method: args.parse_method ?? config.defaultParseMethod,
    lang_list: args.lang_list ?? [config.defaultLang],
    formula_enable: args.formula_enable ?? true,
    table_enable: args.table_enable ?? true,
    return_md: true,
    return_middle_json: args.return_middle_json ?? false,
    return_content_list: args.return_content_list ?? false,
    return_images: args.return_images ?? false,
    start_page_id: args.start_page_id ?? 0,
    end_page_id: args.end_page_id ?? 99999,
  }
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:563-618](https://github.com/HuanLinOTO/dsh-plugin-mineru/blob/374edb93b9543a4040aed88f122ddf1ecbd6812e/src/tools.ts#L563-L618)

failed与completed首stem取值，没有质量门禁。

<details>
<summary>查看原文（56行）</summary>

```text
    timeoutMs: 900000,
    execute: async (args: unknown, exec: ToolRunContext) => {
      const a = args as ParseToolArgs & { poll_timeout_ms?: number }
      exec.signal.throwIfAborted()

      const cfg = config()
      const c = client()
      const submit = await c.submitTask(a.file_path, toParseParams(a, cfg), exec.signal)

      const pollTimeoutMs = a.poll_timeout_ms ?? cfg.pollTimeoutMs
      const finalStatus = await pollUntilDone(c, submit.task_id, {
        intervalMs: cfg.pollIntervalMs,
        timeoutMs: pollTimeoutMs,
        signal: exec.signal,
      })

      if (finalStatus.status === 'failed') {
        return {
          task_id: submit.task_id,
          status: 'failed' as const,
          error: finalStatus.error ?? 'Task failed without error message',
        }
      }

      const result = await c.getTaskResult(submit.task_id, exec.signal)
      const fileStems = Object.keys(result.results)
      const firstStem = fileStems[0]
      const firstResult = firstStem !== undefined ? result.results[firstStem] : undefined
      const mdContent = firstResult?.md_content ?? ''

      const { content, truncated, fullMdPath } = await maybeTruncateMd(mdContent, cfg.maxMdOutputChars, submit.task_id)

      const out: {
        task_id: string
        status: 'completed' | 'failed'
        backend?: string
        version?: string
        file_stems?: string[]
        md_content?: string
        md_truncated?: boolean
        full_md_path?: string
        error?: string
      } = {
        task_id: submit.task_id,
        status: 'completed' as const,
      }
      if (result.backend) out.backend = result.backend
      if (result.version) out.version = result.version
      if (fileStems.length > 0) out.file_stems = fileStems
      if (content) out.md_content = content
      if (truncated) out.md_truncated = truncated
      if (fullMdPath) out.full_md_path = fullMdPath
      return out
    },
  }))
}
```

</details>

#### 缺口

- 回执和覆盖校验是否有效未验证。
  **影响**：方向不能计作已实现的新工作流或经济结构。
  **进一步探讨**：在固定文档和故障对照中测错误/恢复/全部成本，并设停止阈值。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
