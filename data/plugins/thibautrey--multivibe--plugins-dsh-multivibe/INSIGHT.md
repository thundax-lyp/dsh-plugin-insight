# MultiVibe Companion for DSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4a07797](https://github.com/thibautrey/multivibe/tree/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe)

<!-- BEGIN META -->
[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/thibautrey/multivibe)
<!-- END META -->

> **功能**：连接 DSH 与 MultiVibe 网关，并查看可用模型及连接状态。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将模型发现、容量确认和宿主 provider 接线集中；推理由既有适配器承担，实际收益尚未测量。

> **主要限制**：[Q03](#research-q03) 的凭据与设置变更跨服务且补偿可能失败；[Q02](#research-q02) 的目录成功不证明模型请求、工具或费用正常。

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
  - [Q01 · 谁需要这个连接助手，相对手动配置 provider 增加什么？](#detail-section-11)
  - [Q02 · 模型发现与 provider 构造证明了什么？](#detail-section-12)
  - [Q03 · 连接中途失败时配置与凭据能否原子回滚？](#detail-section-13)
  - [Q04 · 哪些人可更改连接，断开是否删除所有凭据？](#detail-section-14)
  - [Q05 · 什么条件下可以试用，何时停止或恢复？](#detail-section-15)
  - [Q06 · 显式记录能力验证结果能否减少误把目录当作可用性证明？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用 MultiVibe 网关与 DSH 的操作者可在面板中发现模型并配置受管理的 provider。

使用者也可手工查询网关并配置宿主 provider；实际节时和恢复负担未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型发现 | 查询并展示网关目录 | 认证 GET 不证明推理或工具能力 |
| 连接配置 | 创建受管理 provider | 需要有效容量、独立密钥与可写宿主服务 |
| 连接恢复 | 处理 pending 的部分操作 | 跨服务补偿可能因冲突而失败 |
| 凭据保留 | 断开时避免误删共享引用 | 默认保留，上游密钥须另行管理 |
| 只读工具 | 给模型查看状态和目录 | 不提供配置写入或推理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 启动需要 | Host、适配器、凭据与设置 | 无法假定可用 |
| MultiVibe 网关和专用密钥 | 发现与连接需要 | 查询目录和后续模型请求 | 不可达或认证失败时不能使用 |
| 明确模型容量 | 配置需要 | 写入 context 和输出上限 | 缺失时拒绝连接 |
| Desktop 或回环 Web | 配置写操作需要 | 限制管理请求来源 | 远端界面只读 |
| 上游密钥及其他 profile 核查 | 删除凭据时需要 | 防止误删共享引用或遗留密钥 | 当前可见表单不能证明全局无引用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认网关、专用密钥与隔离 profile | 可信地址与权限清楚 |
| 发现 | 用户查询模型并核对容量 | 缺容量时先确认，不猜测 |
| 连接 | 用户写入受管理 provider | 回读状态并检查待恢复记录 |
| 验证与退出 | 用户获授权后做短请求或断开 | 核费用、凭据保留及上游密钥 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网关及模型费用未知 | 确认端点、密钥和容量 | 需兼容宿主 |
| 持续 | 推理、网络和服务费用未知 | 核目录、配置与实际能力 | 目录不保证推理 |
| 恢复 | 重试与服务资源未知 | 对照 journal、provider 和凭据 | 跨服务补偿可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型发现 | 发起认证目录 GET 并规范字段 | 实际推理与工具能力 |
| 配置保护 | 版本、所有权检查及 pending 补偿 | 所有故障下的自动恢复 |
| 凭据管理 | 宿主凭据引用及默认保留 | 全 profile 引用与上游撤销 |

> **思考**：[Q03](#research-q03) 的凭据与设置变更跨服务且补偿可能失败；[Q02](#research-q02) 的目录成功不证明模型请求、工具或费用正常。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将模型发现、容量确认和宿主 provider 接线集中；推理由既有适配器承担，实际收益尚未测量。

[Q03](#research-q03) 使用持久 pending、版本与所有权检查处理跨服务写入；这提供明确恢复入口，但不是原子提交。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的凭据与设置变更跨服务且补偿可能失败；[Q02](#research-q02) 的目录成功不证明模型请求、工具或费用正常。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议已有网关者在隔离 profile 使用专用密钥试配置，确认容量、状态与费用后再做获授权测试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持目录发现、配置与条件性补偿；网关推理、真实宿主与恢复效果未经本次验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-multivibe/README.md、plugins/dsh-multivibe/package.json、plugins/dsh-multivibe/src/index.mjs、plugins/dsh-multivibe/src/gateway.mjs、plugins/dsh-multivibe/src/routes.mjs、plugins/dsh-multivibe/src/companion.mjs 及固定范围 inventory；组件：plugins/dsh-multivibe。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查 Host 注册、网关发现、配置及凭据补偿、路由和只读工具；未全面审计客户端或宿主认证，不运行目标或网关。
- 下一步：在隔离 profile 使用测试网关，注入凭据写入、设置冲突和进程中断，逐阶段回读 pending、provider 和凭据。

**分析版本**

- **仓库**：[thibautrey/multivibe](https://github.com/thibautrey/multivibe)
- **版本号**：0.1.1（[固定提交 4a07797](https://github.com/thibautrey/multivibe/tree/4a07797ffd23a52350ab0519371a91f7e0c01700)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出主动测试后的能力收据，需验证其是否比手工记录更少误判且值得费用。

在隔离 profile 使用测试网关，注入凭据写入、设置冲突和进程中断，逐阶段回读 pending、provider 和凭据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1247 | 1235 | 13 | — |
| .md | source | 1 | 102 | — | — | 1334 |
| .mjs | source | 5 | 494 | 466 | 13 | — |
| .jsx | source | 1 | 418 | 411 | 9 | — |
| .mjs | test | 6 | 802 | 765 | 40 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/thibautrey/multivibe/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查模型目录发现、provider 配置和凭据恢复的真实接线与边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个连接助手，相对手动配置 provider 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 MultiVibe 网关和 DSH 的使用者可以通过面板发现模型并配置一个受管理的 provider，再在宿主正常模型选择器中使用。作者称其为连接助手，配置和凭据管理是宿主接口的组合；包声明 bundle，Host 注入 credential、connection、tools、llm 与 settings，注册对应路由和两个只读工具。相比手动查询模型并填写 provider，它把目录读取、容量确认和恢复入口集中起来；模型推理仍由宿主既有适配器承担，不能把接线说成新的推理引擎或已验证省时。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-multivibe/README.md:1-14](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/README.md#L1-L14)

作者说明对象、依赖和边界。

<details>
<summary>查看原文（14行）</summary>

```text
# MultiVibe Companion for DSH

Connect DSH to a MultiVibe gateway and inspect available models and connection status.

A connection companion with a **MultiVibe global panel in the sidebar**, using the official Harness panel and plugin-manager contracts. The plugin reuses DSH's `llm-pi-ai` provider for inference and exposes two read-only tools. It does not import provider OAuth tokens, administer MultiVibe, or execute inference during discovery.

## Compatibility

- Node.js 22 or later.
- DSH SDK `0.2.0-rc.2` or compatible `0.2.x`, with the official connection, credentials, settings, tools, LLM and `llm-pi-ai` packages composed.
- Desktop or a loopback DSH Web interface is required to change the connection. Remote Web pages are read-only.
- A running MultiVibe gateway, normally `http://127.0.0.1:1455`. Use the public gateway port, never the loopback control-plane port `1456`.

Peer dependencies explicitly include the tested prerelease branch. Compatibility with older Harness releases is not claimed.
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-multivibe/package.json:1-14](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/package.json#L1-L14)

包身份和导出。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-multivibe",
  "version": "0.1.1",
  "description": "Connect DSH to a MultiVibe gateway and inspect available models and connection status.",
  "type": "module",
  "license": "Apache-2.0",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-multivibe/package.json:49-67](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/package.json#L49-L67)

bundle 与客户端。

<details>
<summary>查看原文（19行）</summary>

```text
  },
  "publishConfig": {
    "access": "public"
  },
  "dsh": {
    "manifestVersion": 1,
    "engines": {
      "dsh": "^0.2.0-rc.2"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-multivibe/src/index.mjs:1-12](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/index.mjs#L1-L12)

Host 服务注入与注册。

<details>
<summary>查看原文（12行）</summary>

```text
import Schema from '@deepseek-ai/schemastery';
import { credentialKey } from '@deepseek-ai/dsh-credentials';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { createCompanion } from './companion.mjs';
import { registerCompanion } from './routes.mjs';

export const name = 'dsh-multivibe';
export const inject = ['credentials', 'connection', 'tools', 'llm', 'settings'];
export const Config = Schema.object({});

export function apply(ctx) {
  registerCompanion(ctx, createCompanion(ctx, { stateKey: credentialKey(name, 'connection') }), defineTool);
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-multivibe/src/routes.mjs:57-66](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/routes.mjs#L57-L66)

只读及操作者配置路由。

<details>
<summary>查看原文（10行）</summary>

```text
  for (const endpoint of ['status', 'catalog']) {
    ctx.connection.fetch.register({ path: `/api/multivibe/${endpoint}`, methods: ['GET'], requestBody: 'buffered',
      fetch: request => json(() => endpoint === 'status' ? companion.status() : companion.catalog(request.signal)) });
  }
  for (const endpoint of ['discover', 'connect', 'disconnect', 'recover']) {
    ctx.connection.fetch.register({ path: `/api/multivibe/${endpoint}`, methods: ['POST'], requestBody: 'streaming',
      fetch: request => json(async () => {
        assertLocalMutation(request);
        return companion[endpoint](await readInput(request), request.signal);
      }) });
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-multivibe/src/routes.mjs:77-96](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/routes.mjs#L77-L96)

两个只读模型工具。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.tools.register(makeTool({
    name: 'multivibe_status', description: 'Read whether the operator-configured MultiVibe model provider is connected. Does not configure providers, reveal credentials, run inference, or access administration.',
    parameters: {}, output, timeoutMs: 12_000, isConcurrencySafe: () => true,
    execute: safeExecute(async (_args, exec) => {
      exec.signal.throwIfAborted();
      const state = await companion.status();
      return { connected: state.connected, recoveryRequired: state.pending, provider: state.connection?.providerId ?? null,
        protocol: state.connection?.protocol ?? null, configuredModels: state.connection?.modelCount ?? 0 };
    }),
  }));
  ctx.tools.register(makeTool({
    name: 'multivibe_models', description: 'List routable models from the operator-configured MultiVibe gateway using its dedicated proxy key. Capabilities not returned by the gateway remain unknown. Read-only; no inference or admin access.',
    parameters: { search: { type: 'string', description: 'Optional case-insensitive model ID/name filter.' }, limit: { type: 'integer', description: 'Maximum number of returned models, clamped to 1–100; default 50.' } },
    output, timeoutMs: 12_000, isConcurrencySafe: () => true,
    execute: safeExecute(async (args, exec) => {
      const catalog = await companion.catalog(exec.signal);
      const search = typeof args.search === 'string' ? args.search.slice(0, 256).toLowerCase() : '';
      const matches = catalog.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(search));
      const limit = Math.max(1, Math.min(100, Number.isSafeInteger(args.limit) ? args.limit : 50));
      return { models: matches.slice(0, limit), total: matches.length, truncated: matches.length > limit };
```

</details>

#### 缺口

- 没有用户配置任务对照
  **影响**：不能量化手动配置成本或实际改善
  **进一步探讨**：在隔离 profile 对照手工配置与助手的完整步骤和恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型发现与 provider 构造证明了什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

网关 URL 只接受根或 /v1，远端要求 HTTPS，本机回环可用 HTTP；发现通过带代理密钥的 GET /v1/models，拒绝重定向，设置超时与响应限制。目录标准化保留可识别模型和其声明的容量，所选模型缺上下文或输出上限时要求提供明确数值，且输出不得超过上下文。随后构造引用宿主凭据的 provider；status 检查配置一致和凭据是否存在。这些证明请求与配置流程，不证明网关真实推理、工具调用、图片或计费正常；目录返回的容量也仍是上游声明。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:12-23](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L12-L23)

URL 限制。

<details>
<summary>查看原文（12行）</summary>

```text
export function normalizeGatewayURL(value) {
  if (typeof value !== 'string' || value.length > 2048) throw new CompanionError('INVALID_URL', 'Enter a valid MultiVibe gateway URL.');
  let url;
  try { url = new URL(value.trim()); } catch { throw new CompanionError('INVALID_URL', 'Enter a valid MultiVibe gateway URL.'); }
  if (url.username || url.password || url.search || url.hash) throw new CompanionError('INVALID_URL', 'Credentials, query strings and fragments are not allowed in the gateway URL.');
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const loopback = host === 'localhost' || host === '::1' || (isIP(host) === 4 && host.startsWith('127.'));
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) throw new CompanionError('INSECURE_URL', 'Use HTTPS for remote gateways. HTTP is allowed only on loopback.');
  const pathname = url.pathname.replace(/\/+$/, '');
  if (pathname !== '' && pathname !== '/v1') throw new CompanionError('INVALID_URL', 'Use the public MultiVibe gateway root or its /v1 endpoint.');
  return { origin: url.origin, baseURL: `${url.origin}/v1` };
}
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:38-60](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L38-L60)

目录标准化与可用字段。

<details>
<summary>查看原文（23行）</summary>

```text
export function normalizeModels(payload) {
  const raw = Array.isArray(payload?.data) ? payload.data : payload?.models;
  const entries = Array.isArray(raw) ? raw.map(value => [undefined, value]) : raw && typeof raw === 'object' ? Object.entries(raw) : [];
  if (entries.length > 4096) throw new CompanionError('INVALID_CATALOG', 'The gateway returned too many models.', 502);
  const models = new Map();
  for (const [key, item] of entries) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const id = key ?? item.id;
    if (typeof id !== 'string' || !id || id.length > 256 || /[\u0000-\u0020\u007f]/.test(id) || models.has(id)) continue;
    const metadata = item.metadata && typeof item.metadata === 'object' ? item.metadata : {};
    const output = item.output_modalities ?? metadata.output_modalities;
    if (Array.isArray(output) && output.length && !output.includes('text')) continue;
    const model = { id, name: label(item.name ?? item.display_name ?? item.displayName ?? metadata.display_name, id) };
    const contextWindow = capacity(item.contextWindow ?? item.context_window ?? item.context_length ?? item.max_input_tokens ?? item.limit?.context ?? metadata.context_window);
    const maxTokens = capacity(item.maxTokens ?? item.maxOutputTokens ?? item.max_output_tokens ?? item.max_tokens ?? item.limit?.output ?? metadata.max_output_tokens);
    if (contextWindow) model.contextWindow = contextWindow;
    if (maxTokens) model.maxTokens = maxTokens;
    const input = item.inputModalities ?? item.input_modalities ?? item.input ?? metadata.input_modalities;
    if (Array.isArray(input)) model.inputModalities = [...new Set(input.filter(x => x === 'text' || x === 'image'))];
    models.set(id, model);
  }
  if (!models.size) throw new CompanionError('EMPTY_CATALOG', 'No routable models were returned for this API key.', 502);
  return [...models.values()].sort((a, b) => a.id.localeCompare(b.id));
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:63-78](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L63-L78)

所选模型、容量和 provider。

<details>
<summary>查看原文（16行）</summary>

```text
export function buildProvider({ baseURL, credentialRef, protocol, models, selectedIds, capacities = {} }) {
  normalizeGatewayURL(baseURL);
  if (!/^MULTIVIBE_DSH_[A-F0-9]{32}$/.test(credentialRef)) throw new CompanionError('INVALID_CREDENTIAL', 'Invalid managed credential reference.');
  if (!['openai-completions', 'openai-responses'].includes(protocol)) throw new CompanionError('INVALID_PROTOCOL', 'Select Chat Completions or Responses.');
  if (!Array.isArray(selectedIds) || !selectedIds.length || selectedIds.length > 256 || new Set(selectedIds).size !== selectedIds.length) throw new CompanionError('INVALID_SELECTION', 'Select between 1 and 256 distinct models.');
  const catalog = new Map(models.map(model => [model.id, model]));
  const configured = selectedIds.map(id => {
    const model = catalog.get(id);
    if (!model) throw new CompanionError('UNKNOWN_MODEL', 'A selected model is no longer in the gateway catalog.');
    const contextWindow = model.contextWindow ?? capacity(capacities[id]?.contextWindow);
    const maxTokens = model.maxTokens ?? capacity(capacities[id]?.maxTokens);
    if (!contextWindow || !maxTokens) throw new CompanionError('MISSING_CAPACITY', `Confirm the context and output limits for ${id} before connecting.`);
    if (maxTokens > contextWindow) throw new CompanionError('INVALID_CAPACITY', 'Output limit cannot exceed the context window.');
    return { id: model.id, name: model.name, contextWindow, maxTokens, ...(model.inputModalities?.length ? { input: model.inputModalities } : {}) };
  });
  return { displayName: 'MultiVibe', api: protocol, baseURL, apiKeyEnv: credentialRef, models: configured, retryPolicy: { mode: 'normal', maxRetries: 0 } };
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:81-97](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L81-L97)

认证 GET、超时与重定向处理。

<details>
<summary>查看原文（17行）</summary>

```text
export async function requestJSON(url, { apiKey, fetchImpl = globalThis.fetch, signal, timeoutMs = 10_000, maxBytes = 2_000_000 } = {}) {
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const headers = { Accept: 'application/json', ...(apiKey ? { Authorization: `Bearer ${validateApiKey(apiKey)}` } : {}) };
  let response;
  try {
    response = await fetchImpl(url, { method: 'GET', redirect: 'manual', signal: combined, headers });
  } catch {
    if (signal?.aborted) throw new CompanionError('CANCELLED', 'The request was cancelled.', 499);
    if (timeout.aborted) throw new CompanionError('TIMEOUT', 'The gateway did not respond in time.', 504);
    throw new CompanionError('UNREACHABLE', 'Cannot reach the MultiVibe gateway. Check its URL and TLS configuration.', 502);
  }
  if (response.status >= 300 && response.status < 400) { await response.body?.cancel(); throw new CompanionError('REDIRECT_REJECTED', 'Gateway redirects are not followed. Enter its final trusted URL.', 502); }
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 401 || response.status === 403) throw new CompanionError('UNAUTHORIZED', 'The proxy API key was rejected.', 401);
    throw new CompanionError('GATEWAY_ERROR', `The gateway returned HTTP ${response.status}.`, 502);
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:120-125](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L120-L125)

模型发现路径。

```text
export async function discoverGateway({ baseURL, apiKey, fetchImpl, signal }) {
  const gateway = normalizeGatewayURL(baseURL);
  const key = validateApiKey(apiKey);
  const models = normalizeModels(await requestJSON(`${gateway.baseURL}/models`, { apiKey: key, fetchImpl, signal }));
  if (JSON.stringify(models).includes(key)) throw new CompanionError('INVALID_CATALOG', 'The gateway returned unsafe model metadata.', 502);
  return { baseURL: gateway.baseURL, models };
```

**依据 6 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:103-119](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L103-L119)

检查配置与凭据后发现模型。

<details>
<summary>查看原文（17行）</summary>

```text
  function checkRevision(input, state) {
    if (!input || !Number.isSafeInteger(input.revision) || input.revision !== state.revision) throw conflict();
  }
  async function discover(input, signal) {
    return discoverGateway({ baseURL: input?.baseURL, apiKey: input?.apiKey, fetchImpl, signal });
  }
  async function active() {
    const state = await read();
    if (!state.connection || state.pending) throw new CompanionError('NOT_CONNECTED', 'Connect MultiVibe in Settings > Plugins > MultiVibe first.');
    if (!isDeepStrictEqual(currentProvider(state.connection), state.connection.providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The managed provider was edited outside the companion. Restore it or disconnect manually.', 409);
    const secret = await ctx.credentials.resolve(state.connection.credentialRef);
    if (!secret?.value) throw new CompanionError('MISSING_CREDENTIAL', 'The managed proxy API key is not configured.', 401);
    return { ...state.connection, apiKey: secret.value };
  }
  async function catalog(signal) {
    const connection = await active();
    return discoverGateway({ baseURL: connection.baseURL, apiKey: connection.apiKey, fetchImpl, signal });
```

</details>

#### 缺口

- 没有连接实际网关或执行推理
  **影响**：不能证明路由、工具能力、延迟或收费
  **进一步探讨**：使用专用低权限密钥在隔离 profile 做获授权的最小请求并核对费用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 连接中途失败时配置与凭据能否原子回滚？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

不能把整个过程视作跨服务原子事务。连接先校验版本、发现模型和占用状态，分配凭据引用并持久记录 pending，然后依次写 credential、修改 settings、读回比较，最后清除 pending。失败时尝试移除拥有的 provider 和新凭据；补偿失败则报告需要恢复，recover 再按 journal 执行。移除前核对 provider 原始配置和继承状态，避免覆盖外部更改；版本冲突也拒绝继续。进程内队列串行化操作，但跨进程及底层服务故障的实际行为没有运行证据，恢复也可能因外部修改或凭据仍被引用而停下。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:9-30](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L9-L30)

进程内队列与持久状态记录。

<details>
<summary>查看原文（22行）</summary>

```text
export function createCompanion(ctx, { stateKey = 'dsh-multivibe/connection', fetchImpl = globalThis.fetch, clock = Date.now, random = randomBytes } = {}) {
  let queue = Promise.resolve();
  const serialize = action => {
    const result = queue.then(action);
    queue = result.catch(() => {});
    return result;
  };
  async function read() {
    const record = await ctx.credentials.readRecord(stateKey);
    if (!record) return emptyState();
    const state = record.payload;
    if (record.kind !== 'grant' || !state || !Number.isSafeInteger(state.revision) || state.revision < 0 || !Object.hasOwn(state, 'connection') || !Object.hasOwn(state, 'pending')) {
      throw new CompanionError('INVALID_STATE', 'The saved companion state could not be read safely.', 503);
    }
    return state;
  }
  async function update(change) {
    await ctx.credentials.modifyRecord(stateKey, record => {
      const state = record?.kind === 'grant' ? record.payload : emptyState();
      if (!state || !Number.isSafeInteger(state.revision)) throw new CompanionError('INVALID_STATE', 'The saved companion state could not be read safely.', 503);
      return { kind: 'grant', payload: change(state) };
    });
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:127-141](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L127-L141)

版本、pending 与完成记录。

<details>
<summary>查看原文（15行）</summary>

```text
  async function acquire(input, pending, requiredConnection) {
    await update(state => {
      checkRevision(input, state);
      if (state.pending) throw new CompanionError('RECOVERY_REQUIRED', 'An incomplete operation needs recovery before another change.', 409);
      if (requiredConnection === false && state.connection) throw new CompanionError('ALREADY_CONNECTED', 'Disconnect the existing managed provider before connecting another gateway.', 409);
      if (requiredConnection === true && !state.connection) throw new CompanionError('NOT_CONNECTED', 'No managed provider is connected.');
      return { ...state, revision: state.revision + 1, pending };
    });
  }
  async function finish(pending, connection) {
    await update(state => {
      if (state.pending?.id !== pending.id) throw conflict();
      const retainedCredentialRefs = new Set(state.retainedCredentialRefs ?? []);
      if (pending.kind === 'disconnect' && pending.removeCredential !== true) retainedCredentialRefs.add(pending.connection.credentialRef);
      return { revision: state.revision + 1, connection, pending: null, retainedCredentialRefs: [...retainedCredentialRefs] };
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:144-164](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L144-L164)

所有权检查和补偿。

<details>
<summary>查看原文（21行）</summary>

```text
  async function removeOwnedProvider(connection) {
    const form = formFor(connection.settingsNs);
    const value = form.user?.providers?.[connection.providerId];
    if (value === undefined && form.value?.providers?.[connection.providerId] === undefined) return;
    if (!isDeepStrictEqual(value, connection.providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider changed outside the companion. No configuration or credential was removed.', 409);
    // Unset restores inheritance, so never acquire a provider ID already present in base/value.
    if (form.base?.providers?.[connection.providerId] !== undefined) throw new CompanionError('PROVIDER_MODIFIED', 'An inherited provider now uses this ID. Remove the managed provider manually.', 409);
    await ctx.settings.mutate(connection.settingsNs, [{ op: 'unset', path: ['providers', connection.providerId] }], form.revision);
    if (formFor(connection.settingsNs).value?.providers?.[connection.providerId] !== undefined) throw new CompanionError('RECOVERY_REQUIRED', 'The provider removal did not complete.', 409);
  }
  async function removeUnusedCredential(ref) {
    const marker = JSON.stringify(ref);
    if (forms().some(form => JSON.stringify(form.value).includes(marker))) throw new CompanionError('CREDENTIAL_IN_USE', 'Another configuration references the managed credential. It was not removed.', 409);
    await ctx.credentials.unset(ref);
  }
  async function compensate(pending) {
    await removeOwnedProvider(pending.connection);
    // Fresh failed connects compensate their own new secret. Established disconnects
    // preserve it unless explicitly requested: settings views cannot prove global non-use.
    if (pending.kind === 'connect' || pending.removeCredential === true) await removeUnusedCredential(pending.connection.credentialRef);
    await finish(pending, null);
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:166-200](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L166-L200)

连接顺序与失败恢复。

<details>
<summary>查看原文（35行）</summary>

```text
  async function connect(input, signal) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (state.connection) throw new CompanionError('ALREADY_CONNECTED', 'Disconnect the existing managed provider before connecting another gateway.', 409);
      if (state.pending) throw new CompanionError('RECOVERY_REQUIRED', 'Recover the incomplete operation first.', 409);
      const providerId = validateProviderId(input.providerId);
      if (!(await namespaces()).some(item => item.settingsNs === input.settingsNs)) throw new CompanionError('PROVIDER_UNAVAILABLE', 'Select an available configurable model adapter.');
      const discovered = await discover(input, signal);
      const form = formFor(input.settingsNs);
      if (form.value?.providers?.[providerId] !== undefined || form.base?.providers?.[providerId] !== undefined || (await ctx.llm.listProviders()).some(item => item.id === providerId)) {
        throw new CompanionError('PROVIDER_EXISTS', 'That provider ID already exists. Choose a new ID; existing providers are never overwritten.', 409);
      }
      const credentialRef = `MULTIVIBE_DSH_${random(16).toString('hex').toUpperCase()}`;
      const description = await ctx.credentials.describe(credentialRef);
      if (description.configured || !description.writable) throw new CompanionError('CREDENTIAL_READ_ONLY', 'A new writable credential reference could not be allocated.', 403);
      const providerConfig = buildProvider({ ...input, models: discovered.models, baseURL: discovered.baseURL, credentialRef });
      const connection = { providerId, settingsNs: input.settingsNs, credentialRef, baseURL: discovered.baseURL, providerConfig, connectedAt: clock() };
      const pending = { id: random(16).toString('hex'), kind: 'connect', connection };
      signal?.throwIfAborted();
      await acquire(input, pending, false);
      try {
        await ctx.credentials.set(credentialRef, input.apiKey.trim());
        await ctx.settings.mutate(input.settingsNs, [{ op: 'set', path: ['providers', providerId], value: providerConfig }], form.revision);
        if (!isDeepStrictEqual(currentProvider(connection), providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider did not accept the exact managed configuration.', 409);
        await finish(pending, connection);
      } catch (error) {
        const latest = await read();
        if (!latest.pending && latest.connection?.credentialRef === credentialRef) return status();
        try { await compensate(pending); } catch {
          throw new CompanionError('RECOVERY_REQUIRED', 'The operation could not be safely restored. Use Recover in the companion; no unrelated provider is overwritten.', 409);
        }
        if (error instanceof CompanionError) throw error;
        if (error?.name === 'SettingsConflictError' || error?.code === 'SETTINGS_CONFLICT') throw conflict();
        throw new CompanionError('CONNECT_FAILED', 'DSH rejected the provider configuration. The managed changes were restored.', 503);
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:205-228](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L205-L228)

断开和恢复。

<details>
<summary>查看原文（24行）</summary>

```text
  async function disconnect(input) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (!state.connection) throw new CompanionError('NOT_CONNECTED', 'No managed provider is connected.');
      // Check ownership before storing any journal or changing the credential.
      const form = formFor(state.connection.settingsNs);
      const absent = form.user?.providers?.[state.connection.providerId] === undefined && form.value?.providers?.[state.connection.providerId] === undefined;
      if (!absent && !isDeepStrictEqual(currentProvider(state.connection), state.connection.providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider was edited outside the companion. No configuration or credential was removed.', 409);
      const pending = { id: random(16).toString('hex'), kind: 'disconnect', connection: state.connection, removeCredential: input.removeCredential === true };
      await acquire(input, pending, true);
      try { await compensate(pending); } catch {
        throw new CompanionError('RECOVERY_REQUIRED', 'Disconnect is incomplete. Use Recover to finish removing only the managed provider and unused credential.', 409);
      }
      return status();
    });
  }
  async function recover(input) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (!state.pending) return status();
      await compensate(state.pending);
      return status();
```

</details>

#### 缺口

- 未做中断、服务失败或跨进程竞争实验
  **影响**：不能保证所有部分状态都能自动恢复
  **进一步探讨**：在隔离配置逐阶段注入失败并回读 provider、凭据和 pending。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些人可更改连接，断开是否删除所有凭据？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

写操作通过 DSH connection 路由再检查 Host 回环、可选 Origin 同源和 JSON；这些检查依赖宿主连接服务已完成其认证边界，不构成独立于宿主的完整沙箱。供模型调用的工具只有状态和目录查询，不暴露配置修改接口。断开默认保留凭据引用，只有显式选择删除时才检查可见 settings 是否仍引用并尝试 unset；该检查范围是可见表单，不证明其他 profile 或隐藏配置无引用，也不会撤销网关端密钥。用户必须单独确认凭据共享和上游密钥生命周期。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-multivibe/src/routes.mjs:3-24](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/routes.mjs#L3-L24)

写操作 authority、Origin 和内容类型检查。

<details>
<summary>查看原文（22行）</summary>

```text
const loopback = hostname => hostname === 'localhost' || hostname === '[::1]' || /^127\.(?:\d{1,3}\.){2}\d{1,3}$/.test(hostname);
export function assertLocalMutation(request) {
  // The real Connection bridge uses http://dsh.internal for relative HTTP URLs.
  // Host has already passed its authority/authentication fence; never trust forwarded headers.
  const host = request.headers.get('host');
  let authority;
  try {
    if (!host) throw new Error('missing authority');
    authority = new URL(`http://${host}`);
    if (authority.username || authority.password || authority.pathname !== '/' || authority.search || authority.hash) throw new Error('invalid authority');
  } catch { throw new CompanionError('REMOTE_READ_ONLY', 'Connection changes require a valid loopback HTTP authority.', 403); }
  if (!loopback(authority.hostname)) throw new CompanionError('REMOTE_READ_ONLY', 'Connection changes are available only in Desktop or a loopback DSH interface.', 403);
  const origin = request.headers.get('origin');
  if (origin) {
    let sameOrigin = false;
    try {
      const parsed = new URL(origin);
      sameOrigin = ['http:', 'https:'].includes(parsed.protocol) && parsed.host === authority.host;
    } catch { /* Opaque or malformed origins are not trusted. */ }
    if (!sameOrigin) throw new CompanionError('ORIGIN_REJECTED', 'Cross-origin configuration changes are not allowed.', 403);
  }
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) throw new CompanionError('INVALID_REQUEST', 'Send a JSON request.', 415);
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-multivibe/src/routes.mjs:57-66](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/routes.mjs#L57-L66)

路由区分只读与写操作。

<details>
<summary>查看原文（10行）</summary>

```text
  for (const endpoint of ['status', 'catalog']) {
    ctx.connection.fetch.register({ path: `/api/multivibe/${endpoint}`, methods: ['GET'], requestBody: 'buffered',
      fetch: request => json(() => endpoint === 'status' ? companion.status() : companion.catalog(request.signal)) });
  }
  for (const endpoint of ['discover', 'connect', 'disconnect', 'recover']) {
    ctx.connection.fetch.register({ path: `/api/multivibe/${endpoint}`, methods: ['POST'], requestBody: 'streaming',
      fetch: request => json(async () => {
        assertLocalMutation(request);
        return companion[endpoint](await readInput(request), request.signal);
      }) });
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-multivibe/src/routes.mjs:77-96](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/routes.mjs#L77-L96)

模型可调用的状态和目录工具。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.tools.register(makeTool({
    name: 'multivibe_status', description: 'Read whether the operator-configured MultiVibe model provider is connected. Does not configure providers, reveal credentials, run inference, or access administration.',
    parameters: {}, output, timeoutMs: 12_000, isConcurrencySafe: () => true,
    execute: safeExecute(async (_args, exec) => {
      exec.signal.throwIfAborted();
      const state = await companion.status();
      return { connected: state.connected, recoveryRequired: state.pending, provider: state.connection?.providerId ?? null,
        protocol: state.connection?.protocol ?? null, configuredModels: state.connection?.modelCount ?? 0 };
    }),
  }));
  ctx.tools.register(makeTool({
    name: 'multivibe_models', description: 'List routable models from the operator-configured MultiVibe gateway using its dedicated proxy key. Capabilities not returned by the gateway remain unknown. Read-only; no inference or admin access.',
    parameters: { search: { type: 'string', description: 'Optional case-insensitive model ID/name filter.' }, limit: { type: 'integer', description: 'Maximum number of returned models, clamped to 1–100; default 50.' } },
    output, timeoutMs: 12_000, isConcurrencySafe: () => true,
    execute: safeExecute(async (args, exec) => {
      const catalog = await companion.catalog(exec.signal);
      const search = typeof args.search === 'string' ? args.search.slice(0, 256).toLowerCase() : '';
      const matches = catalog.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(search));
      const limit = Math.max(1, Math.min(100, Number.isSafeInteger(args.limit) ? args.limit : 50));
      return { models: matches.slice(0, limit), total: matches.length, truncated: matches.length > limit };
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:136-164](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L136-L164)

默认保留及可见 settings 引用检查。

<details>
<summary>查看原文（29行）</summary>

```text
  async function finish(pending, connection) {
    await update(state => {
      if (state.pending?.id !== pending.id) throw conflict();
      const retainedCredentialRefs = new Set(state.retainedCredentialRefs ?? []);
      if (pending.kind === 'disconnect' && pending.removeCredential !== true) retainedCredentialRefs.add(pending.connection.credentialRef);
      return { revision: state.revision + 1, connection, pending: null, retainedCredentialRefs: [...retainedCredentialRefs] };
    });
  }
  async function removeOwnedProvider(connection) {
    const form = formFor(connection.settingsNs);
    const value = form.user?.providers?.[connection.providerId];
    if (value === undefined && form.value?.providers?.[connection.providerId] === undefined) return;
    if (!isDeepStrictEqual(value, connection.providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider changed outside the companion. No configuration or credential was removed.', 409);
    // Unset restores inheritance, so never acquire a provider ID already present in base/value.
    if (form.base?.providers?.[connection.providerId] !== undefined) throw new CompanionError('PROVIDER_MODIFIED', 'An inherited provider now uses this ID. Remove the managed provider manually.', 409);
    await ctx.settings.mutate(connection.settingsNs, [{ op: 'unset', path: ['providers', connection.providerId] }], form.revision);
    if (formFor(connection.settingsNs).value?.providers?.[connection.providerId] !== undefined) throw new CompanionError('RECOVERY_REQUIRED', 'The provider removal did not complete.', 409);
  }
  async function removeUnusedCredential(ref) {
    const marker = JSON.stringify(ref);
    if (forms().some(form => JSON.stringify(form.value).includes(marker))) throw new CompanionError('CREDENTIAL_IN_USE', 'Another configuration references the managed credential. It was not removed.', 409);
    await ctx.credentials.unset(ref);
  }
  async function compensate(pending) {
    await removeOwnedProvider(pending.connection);
    // Fresh failed connects compensate their own new secret. Established disconnects
    // preserve it unless explicitly requested: settings views cannot prove global non-use.
    if (pending.kind === 'connect' || pending.removeCredential === true) await removeUnusedCredential(pending.connection.credentialRef);
    await finish(pending, null);
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:205-217](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L205-L217)

断开时的显式删除选择与恢复状态。

<details>
<summary>查看原文（13行）</summary>

```text
  async function disconnect(input) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (!state.connection) throw new CompanionError('NOT_CONNECTED', 'No managed provider is connected.');
      // Check ownership before storing any journal or changing the credential.
      const form = formFor(state.connection.settingsNs);
      const absent = form.user?.providers?.[state.connection.providerId] === undefined && form.value?.providers?.[state.connection.providerId] === undefined;
      if (!absent && !isDeepStrictEqual(currentProvider(state.connection), state.connection.providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider was edited outside the companion. No configuration or credential was removed.', 409);
      const pending = { id: random(16).toString('hex'), kind: 'disconnect', connection: state.connection, removeCredential: input.removeCredential === true };
      await acquire(input, pending, true);
      try { await compensate(pending); } catch {
        throw new CompanionError('RECOVERY_REQUIRED', 'Disconnect is incomplete. Use Recover to finish removing only the managed provider and unused credential.', 409);
```

</details>

#### 缺口

- 未实际验证宿主认证、多 profile 引用和网关撤销
  **影响**：不能证明本机权限、全局凭据未使用或远端密钥已撤销
  **进一步探讨**：核宿主配置与上游密钥，隔离 profile 测试保留和删除选择。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下可以试用，何时停止或恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 及 Node、运行的 MultiVibe 网关、可配置模型适配器和专用代理密钥；作者要求 Desktop 或回环 Web 进行写操作。操作者可先确认网关身份、模型 ID 及容量，用隔离 profile 配置，再在获授权且可承担费用的条件下做一次普通短请求；模型目录或 connected 状态都不是推理验收。若证书或端点不可信、模型容量无法确认、状态提示需恢复、外部修改导致所有权不符或费用超出范围，应停止修改、按 pending 处理并回原有 provider；凭据是否保留以及上游是否撤销须人工核对。现金费用和配置／恢复人时未知。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-multivibe/README.md:7-14](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/README.md#L7-L14)

作者声明宿主、网关及回环条件。

```text
## Compatibility

- Node.js 22 or later.
- DSH SDK `0.2.0-rc.2` or compatible `0.2.x`, with the official connection, credentials, settings, tools, LLM and `llm-pi-ai` packages composed.
- Desktop or a loopback DSH Web interface is required to change the connection. Remote Web pages are read-only.
- A running MultiVibe gateway, normally `http://127.0.0.1:1455`. Use the public gateway port, never the loopback control-plane port `1456`.

Peer dependencies explicitly include the tested prerelease branch. Compatibility with older Harness releases is not claimed.
```

**依据 2 · 源码核查**：[plugins/dsh-multivibe/package.json:38-67](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/package.json#L38-L67)

Node 与宿主配置声明。

<details>
<summary>查看原文（30行）</summary>

```text
    "url": "https://github.com/thibautrey/multivibe/issues"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "multivibe",
    "gateway",
    "models"
  ],
  "engines": {
    "node": ">=22.0.0"
  },
  "publishConfig": {
    "access": "public"
  },
  "dsh": {
    "manifestVersion": 1,
    "engines": {
      "dsh": "^0.2.0-rc.2"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:63-75](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L63-L75)

模型容量确认。

<details>
<summary>查看原文（13行）</summary>

```text
export function buildProvider({ baseURL, credentialRef, protocol, models, selectedIds, capacities = {} }) {
  normalizeGatewayURL(baseURL);
  if (!/^MULTIVIBE_DSH_[A-F0-9]{32}$/.test(credentialRef)) throw new CompanionError('INVALID_CREDENTIAL', 'Invalid managed credential reference.');
  if (!['openai-completions', 'openai-responses'].includes(protocol)) throw new CompanionError('INVALID_PROTOCOL', 'Select Chat Completions or Responses.');
  if (!Array.isArray(selectedIds) || !selectedIds.length || selectedIds.length > 256 || new Set(selectedIds).size !== selectedIds.length) throw new CompanionError('INVALID_SELECTION', 'Select between 1 and 256 distinct models.');
  const catalog = new Map(models.map(model => [model.id, model]));
  const configured = selectedIds.map(id => {
    const model = catalog.get(id);
    if (!model) throw new CompanionError('UNKNOWN_MODEL', 'A selected model is no longer in the gateway catalog.');
    const contextWindow = model.contextWindow ?? capacity(capacities[id]?.contextWindow);
    const maxTokens = model.maxTokens ?? capacity(capacities[id]?.maxTokens);
    if (!contextWindow || !maxTokens) throw new CompanionError('MISSING_CAPACITY', `Confirm the context and output limits for ${id} before connecting.`);
    if (maxTokens > contextWindow) throw new CompanionError('INVALID_CAPACITY', 'Output limit cannot exceed the context window.');
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:166-200](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L166-L200)

连接和恢复提示。

<details>
<summary>查看原文（35行）</summary>

```text
  async function connect(input, signal) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (state.connection) throw new CompanionError('ALREADY_CONNECTED', 'Disconnect the existing managed provider before connecting another gateway.', 409);
      if (state.pending) throw new CompanionError('RECOVERY_REQUIRED', 'Recover the incomplete operation first.', 409);
      const providerId = validateProviderId(input.providerId);
      if (!(await namespaces()).some(item => item.settingsNs === input.settingsNs)) throw new CompanionError('PROVIDER_UNAVAILABLE', 'Select an available configurable model adapter.');
      const discovered = await discover(input, signal);
      const form = formFor(input.settingsNs);
      if (form.value?.providers?.[providerId] !== undefined || form.base?.providers?.[providerId] !== undefined || (await ctx.llm.listProviders()).some(item => item.id === providerId)) {
        throw new CompanionError('PROVIDER_EXISTS', 'That provider ID already exists. Choose a new ID; existing providers are never overwritten.', 409);
      }
      const credentialRef = `MULTIVIBE_DSH_${random(16).toString('hex').toUpperCase()}`;
      const description = await ctx.credentials.describe(credentialRef);
      if (description.configured || !description.writable) throw new CompanionError('CREDENTIAL_READ_ONLY', 'A new writable credential reference could not be allocated.', 403);
      const providerConfig = buildProvider({ ...input, models: discovered.models, baseURL: discovered.baseURL, credentialRef });
      const connection = { providerId, settingsNs: input.settingsNs, credentialRef, baseURL: discovered.baseURL, providerConfig, connectedAt: clock() };
      const pending = { id: random(16).toString('hex'), kind: 'connect', connection };
      signal?.throwIfAborted();
      await acquire(input, pending, false);
      try {
        await ctx.credentials.set(credentialRef, input.apiKey.trim());
        await ctx.settings.mutate(input.settingsNs, [{ op: 'set', path: ['providers', providerId], value: providerConfig }], form.revision);
        if (!isDeepStrictEqual(currentProvider(connection), providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider did not accept the exact managed configuration.', 409);
        await finish(pending, connection);
      } catch (error) {
        const latest = await read();
        if (!latest.pending && latest.connection?.credentialRef === credentialRef) return status();
        try { await compensate(pending); } catch {
          throw new CompanionError('RECOVERY_REQUIRED', 'The operation could not be safely restored. Use Recover in the companion; no unrelated provider is overwritten.', 409);
        }
        if (error instanceof CompanionError) throw error;
        if (error?.name === 'SettingsConflictError' || error?.code === 'SETTINGS_CONFLICT') throw conflict();
        throw new CompanionError('CONNECT_FAILED', 'DSH rejected the provider configuration. The managed changes were restored.', 503);
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-multivibe/src/companion.mjs:205-228](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/companion.mjs#L205-L228)

断开与恢复。

<details>
<summary>查看原文（24行）</summary>

```text
  async function disconnect(input) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (!state.connection) throw new CompanionError('NOT_CONNECTED', 'No managed provider is connected.');
      // Check ownership before storing any journal or changing the credential.
      const form = formFor(state.connection.settingsNs);
      const absent = form.user?.providers?.[state.connection.providerId] === undefined && form.value?.providers?.[state.connection.providerId] === undefined;
      if (!absent && !isDeepStrictEqual(currentProvider(state.connection), state.connection.providerConfig)) throw new CompanionError('PROVIDER_MODIFIED', 'The provider was edited outside the companion. No configuration or credential was removed.', 409);
      const pending = { id: random(16).toString('hex'), kind: 'disconnect', connection: state.connection, removeCredential: input.removeCredential === true };
      await acquire(input, pending, true);
      try { await compensate(pending); } catch {
        throw new CompanionError('RECOVERY_REQUIRED', 'Disconnect is incomplete. Use Recover to finish removing only the managed provider and unused credential.', 409);
      }
      return status();
    });
  }
  async function recover(input) {
    return serialize(async () => {
      const state = await read();
      checkRevision(input, state);
      if (!state.pending) return status();
      await compensate(state.pending);
      return status();
```

</details>

#### 缺口

- 未运行网关、真实宿主或推理
  **影响**：无法确认兼容、收费、用户收益与恢复耗时
  **进一步探讨**：隔离 profile 对照一次短任务、状态和服务商费用。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 显式记录能力验证结果能否减少误把目录当作可用性证明？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设是在用户主动执行受限测试后记录模型 ID、协议、测试时间、环境和覆盖能力，并与仅发现的目录条目并列显示；结果过期或配置改变后标为需重测。相对现有仅目录和配置状态，该收据可能帮助区分可路由声明与真实请求，但需要用户同意、可能产生费用、也不能覆盖所有工具或后续网关变化。应与现有手工验证记录对照，比较用户误判率、费用和维护时间；若普通记录已足够或过期结果引起误导，则不引入。没有原型与实验。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-multivibe/src/gateway.mjs:120-125](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/gateway.mjs#L120-L125)

目录发现只执行 models 查询。

```text
export async function discoverGateway({ baseURL, apiKey, fetchImpl, signal }) {
  const gateway = normalizeGatewayURL(baseURL);
  const key = validateApiKey(apiKey);
  const models = normalizeModels(await requestJSON(`${gateway.baseURL}/models`, { apiKey: key, fetchImpl, signal }));
  if (JSON.stringify(models).includes(key)) throw new CompanionError('INVALID_CATALOG', 'The gateway returned unsafe model metadata.', 502);
  return { baseURL: gateway.baseURL, models };
```

**依据 2 · 源码核查**：[plugins/dsh-multivibe/src/routes.mjs:77-96](https://github.com/thibautrey/multivibe/blob/4a07797ffd23a52350ab0519371a91f7e0c01700/plugins/dsh-multivibe/src/routes.mjs#L77-L96)

模型工具提供状态与目录。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.tools.register(makeTool({
    name: 'multivibe_status', description: 'Read whether the operator-configured MultiVibe model provider is connected. Does not configure providers, reveal credentials, run inference, or access administration.',
    parameters: {}, output, timeoutMs: 12_000, isConcurrencySafe: () => true,
    execute: safeExecute(async (_args, exec) => {
      exec.signal.throwIfAborted();
      const state = await companion.status();
      return { connected: state.connected, recoveryRequired: state.pending, provider: state.connection?.providerId ?? null,
        protocol: state.connection?.protocol ?? null, configuredModels: state.connection?.modelCount ?? 0 };
    }),
  }));
  ctx.tools.register(makeTool({
    name: 'multivibe_models', description: 'List routable models from the operator-configured MultiVibe gateway using its dedicated proxy key. Capabilities not returned by the gateway remain unknown. Read-only; no inference or admin access.',
    parameters: { search: { type: 'string', description: 'Optional case-insensitive model ID/name filter.' }, limit: { type: 'integer', description: 'Maximum number of returned models, clamped to 1–100; default 50.' } },
    output, timeoutMs: 12_000, isConcurrencySafe: () => true,
    execute: safeExecute(async (args, exec) => {
      const catalog = await companion.catalog(exec.signal);
      const search = typeof args.search === 'string' ? args.search.slice(0, 256).toLowerCase() : '';
      const matches = catalog.models.filter(model => `${model.id} ${model.name}`.toLowerCase().includes(search));
      const limit = Math.max(1, Math.min(100, Number.isSafeInteger(args.limit) ? args.limit : 50));
      return { models: matches.slice(0, limit), total: matches.length, truncated: matches.length > limit };
```

</details>

#### 缺口

- 没有能力测试收据或用户对照
  **影响**：不能证明误判减少或收益高于费用
  **进一步探讨**：对照手工记录和候选收据，测试网关或配置变化后的用户判断。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
