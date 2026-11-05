# DeepSeek Harness GenUI

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[d24d91e](https://github.com/pengyue-polaron/deepseek-harness-genui/tree/d24d91e3b6462aae498fa8452abcb44e3c53e9d5)

<!-- BEGIN META -->
[![GitHub ★ 124](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=124&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pengyue-polaron/deepseek-harness-genui) [![npm 30d 2,099](https://img.shields.io/static/v1?label=npm+30d&message=2%2C099&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-genui) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-genui)
<!-- END META -->

> **功能**：以可保存任务状态和受控桥接的生成应用承接多轮任务

> **亮点**：[Q01](#research-q01) 将选择和后续动作组织为可回读任务状态。

> **主要限制**：[Q03](#research-q03) 需验证跨会话隔离、撤权及回退时状态边界。

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
  - [Q01 · 可复核贡献是什么？](#detail-section-11)
  - [Q02 · 隔离和恢复如何实现？](#detail-section-12)
  - [Q03 · 有哪些权限限制？](#detail-section-13)
  - [Q04 · 怎样采用和退出？](#detail-section-14)
  - [Q05 · 哪些结果否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需跨轮保留多个相关选择。

文本列出选择并反复确认。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文本列出选择并反复确认。 | 可直接比较 | 保留人工步骤 |
| DeepSeek Harness GenUI | 将选择和后续动作组织为可回读任务状态。 | 需验证跨会话隔离、撤权及回退时状态边界。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 沙箱应用借受控桥保存 session 状态和请求权限。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户需跨轮保留多个相关选择。 | 保留原流程 |
| 试验 | 沙箱应用借受控桥保存 session 状态和请求权限。 | 观察固定版本 |
| 复核 | 先测无外部权限表单，再测撤权与回退。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 保存多项选择并在下一轮准确继续 | 保存和回读可在减少重述时维持状态准确。 | 先测无外部权限表单，再测撤权与回退。 |

> **思考**：[Q03](#research-q03) 需验证跨会话隔离、撤权及回退时状态边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将选择和后续动作组织为可回读任务状态。

有 iframe、CSP、能力校验及故障版本入口。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 需验证跨会话隔离、撤权及回退时状态边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先测无外部权限表单，再测撤权与回退。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的保存多项选择并在下一轮准确继续。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/runtime/server.ts、src/client/index.tsx、src/runtime/external.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的保存多项选择并在下一轮准确继续。未执行目标代码或实际宿主验证。
- 下一步：以模拟端点记录请求次数和唯一标记。

**分析版本**

- **仓库**：[pengyue-polaron/deepseek-harness-genui](https://github.com/pengyue-polaron/deepseek-harness-genui)
- **版本号**：0.15.2（[固定提交 d24d91e](https://github.com/pengyue-polaron/deepseek-harness-genui/tree/d24d91e3b6462aae498fa8452abcb44e3c53e9d5)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 保存和回读可在减少重述时维持状态准确。

以模拟端点记录请求次数和唯一标记。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 1262 | — | — | 15755 |
| .md | example | 1 | 62 | — | — | 514 |
| .js | source | 3 | 5857 | 5620 | 300 | — |
| .mjs | source | 9 | 952 | 879 | 24 | — |
| .ts | source | 33 | 4826 | 4428 | 66 | — |
| .tsx | source | 3 | 1040 | 976 | 3 | — |
| .ts | test | 24 | 4889 | 4580 | 63 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/pengyue-polaron/deepseek-harness-genui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：保存多项选择并在下一轮准确继续

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可复核贡献是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在日程等多选任务中可在表单保存选择，由后续 Agent 回读。区别于文字反复确认，重点是应用的保存结果而非画面。最小验收是三项选择精确回读，且保存不触发日历写入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-55](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/README.md#L31-L55)

作者区分状态保存和外部动作

<details>
<summary>查看原文（25行）</summary>

```text
## Where It Helps

Use an interface when the user needs to see a complex relationship or make several connected choices. Plain questions, rewriting, summaries, and simple lists should stay in prose.

<table>
  <tr>
    <td><strong>Pick calendar slots</strong><br><br>Select useful writing blocks and save them to the task. A later calendar action remains separate and permission-gated.</td>
    <td><img src="https://raw.githubusercontent.com/pengyue-polaron/deepseek-harness-genui/main/screenshots/en/calendar-planner.jpg" width="280" alt="English interface for choosing three writing slots"></td>
  </tr>
  <tr>
    <td><strong>Explore photosynthesis</strong><br><br>Move four causal controls and see the limiting step change immediately.</td>
    <td><img src="https://raw.githubusercontent.com/pengyue-polaron/deepseek-harness-genui/main/screenshots/en/photosynthesis-explorer.jpg" width="280" alt="English interactive photosynthesis model with four causal controls"></td>
  </tr>
  <tr>
    <td><strong>Trace a code path</strong><br><br>Turn a source-grounded CLI explanation into a local explorer of files, functions, and branches.</td>
    <td><img src="https://raw.githubusercontent.com/pengyue-polaron/deepseek-harness-genui/main/screenshots/en/code-path-explorer.jpg" width="280" alt="English source-grounded code path explorer returned from a CLI request"></td>
  </tr>
</table>

## The Core Loop

1. The Agent writes and builds a React + TypeScript app for the current task.
2. The user saves meaningful values such as selections, form answers, drafts, or progress.
3. A later Agent turn reads those values and continues the task.
4. Connected tools and public HTTPS routes must be declared. Harness asks for task-scoped access, and undeclared calls are blocked.
```

</details>

**依据 2 · 源码核查**：[src/runtime/server.ts:313-349](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L313-L349)

按 artifact 与 session 读取和更新 JSON 状态

<details>
<summary>查看原文（37行）</summary>

```text
          if (action === 'state/read') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            if (capability.mode === 'verification') return json(res, 200, { found: false }, req)
            const state = await registry.readState(artifactId, capability.sessionId)
            const found = state !== undefined && Object.hasOwn(state.values, input.key)
            json(res, 200, { found, ...(found ? { value: state.values[input.key] } : {}) }, req)
            return
          }
          if (action === 'state/write') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            const serialized = JSON.stringify(input.value)
            if (serialized === undefined) throw new Error('state value must be JSON')
            const nextValueBytes = Buffer.byteLength(serialized)
            if (capability.mode === 'verification') {
              json(res, 200, { ok: true, persisted: false }, req)
              return
            }
            await registry.updateState(artifactId, capability.sessionId, state => {
              const currentSerialized = JSON.stringify(state[input.key as string])
              const currentValueBytes = currentSerialized === undefined ? 0 : Buffer.byteLength(currentSerialized)
              if (nextValueBytes > 64 * 1024 && nextValueBytes > currentValueBytes) {
                throw new Error('state value cannot grow beyond 64 KiB')
              }
              const next = { ...state, [input.key as string]: input.value }
              const currentKeyCount = Object.keys(state).length
              const nextKeyCount = Object.keys(next).length
              const currentBytes = Buffer.byteLength(JSON.stringify(state))
              const nextBytes = Buffer.byteLength(JSON.stringify(next))
              if (nextKeyCount > MAX_STATE_KEYS && nextKeyCount > currentKeyCount) {
                throw new Error(`task state cannot exceed ${MAX_STATE_KEYS} keys`)
              }
              if (nextBytes > MAX_STATE_BYTES && nextBytes > currentBytes) {
                throw new Error(`task state cannot exceed ${MAX_STATE_BYTES} bytes`)
              }
              return next
            })
            json(res, 200, { ok: true, persisted: true }, req)
```

</details>

#### 缺口

- 跨轮可见与存储耐久性需分开验证。
  **影响**：减少选择在对话中重述和丢失。
  **进一步探讨**：保留三组显式期望值。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 隔离和恢复如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Web 客户端在 sandbox iframe 里呈现应用，服务端以 bearer 与 artifact 匹配能力。状态验证模式允许模拟写但不持久化，运行故障上报可返回回退版本。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:798-803](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/client/index.tsx#L798-L803)

iframe 仅启用 scripts 和 modals

```text
        ) : (
          <div id={bodyId} className="dsh-genui-body" data-genui-modal-background hidden={collapsed} aria-hidden={modalOpen || undefined}>
            <div className="dsh-genui-frame-shell">
              {frameReadyToOpen ? <iframe ref={frameRef} key={frameKey} className="dsh-genui-frame" title={displayTitle} sandbox="allow-scripts allow-modals" referrerPolicy="no-referrer" onError={() => setFrameState('failed')} /> : null}
              <div className="dsh-genui-loading" hidden={frameState !== 'loading' || permissionLoadFailed} role="status" aria-live="polite">{t('app.loading')}</div>
              <div className="dsh-genui-frame-error" hidden={frameState !== 'failed' && !permissionLoadFailed} role="alert">
```

**依据 2 · 源码核查**：[src/runtime/server.ts:304-330](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L304-L330)

鉴权和验证模式

<details>
<summary>查看原文（27行）</summary>

```text
        if (req.method === 'POST' && relative[0] === 'api' && relative.length >= 3) {
          const [, artifactId = '', ...actionParts] = relative
          const capability = capabilities.resolve(bearer(req) ?? '', artifactId)
          if (capability === undefined) return json(res, 401, { error: 'invalid or expired artifact capability' }, req)
          const action = actionParts.join('/')
          if (HOST_CONTROL_ACTIONS.has(action) && !acceptsHostControlRequest(req)) {
            return json(res, 403, { error: 'sandboxed apps cannot perform host control actions' }, req)
          }
          const input = await body(req)
          if (action === 'state/read') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            if (capability.mode === 'verification') return json(res, 200, { found: false }, req)
            const state = await registry.readState(artifactId, capability.sessionId)
            const found = state !== undefined && Object.hasOwn(state.values, input.key)
            json(res, 200, { found, ...(found ? { value: state.values[input.key] } : {}) }, req)
            return
          }
          if (action === 'state/write') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            const serialized = JSON.stringify(input.value)
            if (serialized === undefined) throw new Error('state value must be JSON')
            const nextValueBytes = Buffer.byteLength(serialized)
            if (capability.mode === 'verification') {
              json(res, 200, { ok: true, persisted: false }, req)
              return
            }
            await registry.updateState(artifactId, capability.sessionId, state => {
```

</details>

**依据 3 · 源码核查**：[src/runtime/server.ts:352-360](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L352-L360)

故障上报与回退版本

```text
          if (action === 'version/report-runtime-failure') {
            if (capability.mode === 'verification') return json(res, 403, { error: 'runtime failures cannot be reported during verification' }, req)
            if (typeof input.version_id !== 'string') throw new Error('version_id is required')
            const recovery = await registry.reportRuntimeFailure(artifactId, input.version_id)
            json(res, 200, {
              reported: true,
              failed_version_id: recovery.failedVersionId,
              ...(recovery.fallbackVersionId === undefined ? {} : { fallback_version_id: recovery.fallbackVersionId }),
            }, req)
```

#### 缺口

- 回退源版本不代表回滚外部副作用。
  **影响**：分开处理界面和任务状态。
  **进一步探讨**：在候选版本保存前后分别注入故障。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有哪些权限限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

服务拒绝 sandbox 页面直接做 host control，授权按版本能力定义查找并记录指纹。外部调用限定无凭证 HTTPS URL，解析后拒绝私网地址。应用选择、批准和真正副作用是不同阶段。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime/server.ts:304-310](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L304-L310)

过期 token 和 host control 检查

```text
        if (req.method === 'POST' && relative[0] === 'api' && relative.length >= 3) {
          const [, artifactId = '', ...actionParts] = relative
          const capability = capabilities.resolve(bearer(req) ?? '', artifactId)
          if (capability === undefined) return json(res, 401, { error: 'invalid or expired artifact capability' }, req)
          const action = actionParts.join('/')
          if (HOST_CONTROL_ACTIONS.has(action) && !acceptsHostControlRequest(req)) {
            return json(res, 403, { error: 'sandboxed apps cannot perform host control actions' }, req)
```

**依据 2 · 源码核查**：[src/runtime/server.ts:363-370](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L363-L370)

以版本能力 ID 校验授权

```text
          if (action === 'permission/grant') {
            if (capability.mode === 'verification') return json(res, 403, { error: 'permissions cannot be granted during verification' }, req)
            if (typeof input.version_id !== 'string' || typeof input.capability_id !== 'string') throw new Error('version_id and capability_id are required')
            const version = await registry.getVersion(artifactId, input.version_id)
            const requested = capabilityById(version, input.capability_id)
            if (requested === undefined) return json(res, 404, { error: 'requested permission no longer exists' }, req)
            await registry.grantCapability(artifactId, capability.sessionId, requested.id, {
              fingerprint: capabilityFingerprint(requested),
```

**依据 3 · 源码核查**：[src/runtime/external.ts:29-39](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/external.ts#L29-L39)

公开域名和地址判断

<details>
<summary>查看原文（11行）</summary>

```text
async function publicAddress(hostname: string): Promise<{ address: string; family: 4 | 6 }> {
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || isIP(hostname) !== 0) {
    throw new Error('external requests require a public HTTPS hostname')
  }
  const addresses = await lookup(hostname, { all: true, verbatim: true })
  if (addresses.length === 0 || addresses.some(item => isPrivateAddress(item.address))) {
    throw new Error('external hostname does not resolve exclusively to public addresses')
  }
  const selected = addresses[0]
  if (selected === undefined || (selected.family !== 4 && selected.family !== 6)) throw new Error('external hostname could not be resolved')
  return { address: selected.address, family: selected.family }
```

</details>

**依据 4 · 源码核查**：[src/runtime/external.ts:68-74](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/external.ts#L68-L74)

HTTPS 和无 URL 凭证限制

```text
export async function requestExternal(input: ExternalRequestInput, signal: AbortSignal): Promise<ExternalResponse> {
  const url = new URL(input.url)
  if (url.protocol !== 'https:' || url.username !== '' || url.password !== '' || url.hash !== '') {
    throw new Error('external requests require a credential-free HTTPS URL')
  }
  const resolved = await publicAddress(url.hostname)
  const headers = buildExternalHeaders(input)
```

#### 缺口

- 现有静态检查不足以确认各种代理部署下的授权。
  **影响**：需测试撤权和跨会话访问。
  **进一步探讨**：同时测试无 token、过期、其他 session 和私网域名。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者限定 Web profile 与 Node 版本，并说明 WASM 本地编译。先以无工具表单验证存取，记录构建时间、版本占用和授权成本，再加模拟外部端点。退出先保存选择和所需应用文件，解绑插件后确认收据与旧链接处理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-29](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/README.md#L20-L29)

作者给出宿主和安装条件

<details>
<summary>查看原文（10行）</summary>

````text
## Install

Requires Node.js `^22.19.0 || ^24.0.0` and a supported DeepSeek Harness Web profile.

```sh
dsh plugin --profile web add dsh-plugin-genui
dsh --profile web
```

v0.15.2 supports Harness `0.2.1-rc.2` (npm `latest` checked on 2026-10-23) and `0.2.1-rc.3` (`next`), alongside the previously tested hosts. See the [compatibility report](docs/compatibility-2026-10-23.md) for validation and source-install instructions. Inline, Canvas, fullscreen, and localhost are supported. TUI/headless profiles are not supported. The local compiler uses WebAssembly and needs no install-script approval. Plugin users do not need Chrome or Chromium.
````

</details>

**依据 2 · 源码核查**：[src/runtime/server.ts:321-349](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L321-L349)

状态键和大小约束

<details>
<summary>查看原文（29行）</summary>

```text
          if (action === 'state/write') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            const serialized = JSON.stringify(input.value)
            if (serialized === undefined) throw new Error('state value must be JSON')
            const nextValueBytes = Buffer.byteLength(serialized)
            if (capability.mode === 'verification') {
              json(res, 200, { ok: true, persisted: false }, req)
              return
            }
            await registry.updateState(artifactId, capability.sessionId, state => {
              const currentSerialized = JSON.stringify(state[input.key as string])
              const currentValueBytes = currentSerialized === undefined ? 0 : Buffer.byteLength(currentSerialized)
              if (nextValueBytes > 64 * 1024 && nextValueBytes > currentValueBytes) {
                throw new Error('state value cannot grow beyond 64 KiB')
              }
              const next = { ...state, [input.key as string]: input.value }
              const currentKeyCount = Object.keys(state).length
              const nextKeyCount = Object.keys(next).length
              const currentBytes = Buffer.byteLength(JSON.stringify(state))
              const nextBytes = Buffer.byteLength(JSON.stringify(next))
              if (nextKeyCount > MAX_STATE_KEYS && nextKeyCount > currentKeyCount) {
                throw new Error(`task state cannot exceed ${MAX_STATE_KEYS} keys`)
              }
              if (nextBytes > MAX_STATE_BYTES && nextBytes > currentBytes) {
                throw new Error(`task state cannot exceed ${MAX_STATE_BYTES} bytes`)
              }
              return next
            })
            json(res, 200, { ok: true, persisted: true }, req)
```

</details>

#### 缺口

- 退出文件与授权留存未知。
  **影响**：成本来自构建、人工授权和回退。
  **进一步探讨**：记录冷启和卸载后状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些结果否定采用？

**研究主题**：新假设与验证

#### 完整回答

对照文字、纯表单与受控工具表单，记录准确回读、重输次数、可用时间。损坏候选验证稳定版本，撤回授权后重复动作。若其他会话可读、未授权动作成功、回退丢失可用版本，或录入时间未改善，则按失败项收窄采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime/server.ts:313-349](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L313-L349)

状态读写和验证模式可分别测试

<details>
<summary>查看原文（37行）</summary>

```text
          if (action === 'state/read') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            if (capability.mode === 'verification') return json(res, 200, { found: false }, req)
            const state = await registry.readState(artifactId, capability.sessionId)
            const found = state !== undefined && Object.hasOwn(state.values, input.key)
            json(res, 200, { found, ...(found ? { value: state.values[input.key] } : {}) }, req)
            return
          }
          if (action === 'state/write') {
            if (typeof input.key !== 'string' || input.key.length > 128) throw new Error('invalid state key')
            const serialized = JSON.stringify(input.value)
            if (serialized === undefined) throw new Error('state value must be JSON')
            const nextValueBytes = Buffer.byteLength(serialized)
            if (capability.mode === 'verification') {
              json(res, 200, { ok: true, persisted: false }, req)
              return
            }
            await registry.updateState(artifactId, capability.sessionId, state => {
              const currentSerialized = JSON.stringify(state[input.key as string])
              const currentValueBytes = currentSerialized === undefined ? 0 : Buffer.byteLength(currentSerialized)
              if (nextValueBytes > 64 * 1024 && nextValueBytes > currentValueBytes) {
                throw new Error('state value cannot grow beyond 64 KiB')
              }
              const next = { ...state, [input.key as string]: input.value }
              const currentKeyCount = Object.keys(state).length
              const nextKeyCount = Object.keys(next).length
              const currentBytes = Buffer.byteLength(JSON.stringify(state))
              const nextBytes = Buffer.byteLength(JSON.stringify(next))
              if (nextKeyCount > MAX_STATE_KEYS && nextKeyCount > currentKeyCount) {
                throw new Error(`task state cannot exceed ${MAX_STATE_KEYS} keys`)
              }
              if (nextBytes > MAX_STATE_BYTES && nextBytes > currentBytes) {
                throw new Error(`task state cannot exceed ${MAX_STATE_BYTES} bytes`)
              }
              return next
            })
            json(res, 200, { ok: true, persisted: true }, req)
```

</details>

**依据 2 · 源码核查**：[src/runtime/server.ts:352-370](https://github.com/pengyue-polaron/deepseek-harness-genui/blob/d24d91e3b6462aae498fa8452abcb44e3c53e9d5/src/runtime/server.ts#L352-L370)

版本恢复和授权入口可测试

<details>
<summary>查看原文（19行）</summary>

```text
          if (action === 'version/report-runtime-failure') {
            if (capability.mode === 'verification') return json(res, 403, { error: 'runtime failures cannot be reported during verification' }, req)
            if (typeof input.version_id !== 'string') throw new Error('version_id is required')
            const recovery = await registry.reportRuntimeFailure(artifactId, input.version_id)
            json(res, 200, {
              reported: true,
              failed_version_id: recovery.failedVersionId,
              ...(recovery.fallbackVersionId === undefined ? {} : { fallback_version_id: recovery.fallbackVersionId }),
            }, req)
            return
          }
          if (action === 'permission/grant') {
            if (capability.mode === 'verification') return json(res, 403, { error: 'permissions cannot be granted during verification' }, req)
            if (typeof input.version_id !== 'string' || typeof input.capability_id !== 'string') throw new Error('version_id and capability_id are required')
            const version = await registry.getVersion(artifactId, input.version_id)
            const requested = capabilityById(version, input.capability_id)
            if (requested === undefined) return json(res, 404, { error: 'requested permission no longer exists' }, req)
            await registry.grantCapability(artifactId, capability.sessionId, requested.id, {
              fingerprint: capabilityFingerprint(requested),
```

</details>

#### 缺口

- 未复现宿主与外部动作。
  **影响**：需用实际状态和副作用验证权限。
  **进一步探讨**：以模拟端点记录请求次数和唯一标记。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
