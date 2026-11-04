# Cue Omni Reader Guard

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0e6b629](https://github.com/sensedeal/cue-skills/tree/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sensedeal/cue-skills) [![npm 30d 107](https://img.shields.io/static/v1?label=npm+30d&message=107&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader-guard) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-omni-reader-guard)
<!-- END META -->

> **功能**：在 DeepSeek Harness 调用 Omni Reader 解析前检查 URL、文件根与审批策略。

> **亮点**：[Q01](#research-q01) 把 URL 和本地源策略移入模型工具调用前，提供可配置的默认拒绝。

> **主要限制**：[Q02](#research-q02) 仅检查主机字符串和词法路径，另有 IPv6、通配域及根目录语义缺口。

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
  - [Q01 · 管理员能用这个 Guard 限制哪些调用？](#detail-section-11)
  - [Q02 · 私网、主机和文件策略有什么实际边界？](#detail-section-12)
  - [Q03 · 如何试用审批策略并验证不误放？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 Omni Reader 的 DSH 管理员希望对模型解析调用实施可配置入口策略。

让模型遵循提示词，或在外部代理和 OS 按最终连接与权限隔离。前置 Guard 可显式拦截应用调用，后两层能约束实际目的地。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 前置监听 | 拦截特定解析工具 | 精确工具名且 Host 挂载 |
| 源分类 | 支持主机和本地根策略 | 不解析 DNS 或 realpath |
| 审批请求 | 返回 ask 决策 | Host 决定是否执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools API | 必需 | 装配 pre-execute | 工具调用不会受此策略检查 |
| Omni parse 精确工具名 | 实际使用需 | 匹配被保护调用 | 其他入口单独处理 |
| Host approval 服务 | ask 策略需 | 处理临时许可 | 先实测拒绝行为 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 管理员挂载 Guard 并设严格白名单 | 固定到隔离 profile |
| 试验 | 管理员回放已知允许和拒绝请求 | 核派发及最终地址 |
| 退出 | 管理员停解析入口并回读 | 未确认前不开放实际服务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离环境费用未知 | 配置域、根和 Host | 先不接生产 |
| 持续 | 排障成本未知 | 维护规则与外部环境 | 规则不能替代下游隔离 |
| 失败 | 恢复费用未知 | 检查审批、DNS、挂载和日志 | 误配时停解析入口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 应用层控制 | 入口策略可拒绝或请求同意 | 真实 Host 调度和旁路 |
| 默认收敛 | 空本地根、未知域拒绝 | 最终连接和真实路径 |

> **思考**：[Q02](#research-q02) 仅检查主机字符串和词法路径，另有 IPv6、通配域及根目录语义缺口。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把 URL 和本地源策略移入模型工具调用前，提供可配置的默认拒绝。

[Q02](#research-q02) 策略模块可单独核查；默认拒绝降低误配概率，但规则与 README 通配语义不一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 仅检查主机字符串和词法路径，另有 IPv6、通配域及根目录语义缺口。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用隔离测试验证应用层门槛。若要约束下游流量，必须另外确认实际网络和文件权限。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码支持应用层判定，真实 Host 审批与 DNS、重定向和文件边界尚未验收。

- 已检查：作者 README、包清单、源码路径 dsh/cue-omni-reader-guard/README.zh-CN.md、dsh/cue-omni-reader-guard/cordis.patch.yml、dsh/cue-omni-reader-guard/index.js、dsh/cue-omni-reader-guard/policy.js、dsh/cue-omni-reader-guard/package.json 及固定范围 inventory；组件：dsh/cue-omni-reader-guard。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包，核 manifest、补丁、入口和纯策略。没有运行测试、Host 或外部桥。
- 下一步：在隔离网络验证 URL 别名、IPv6 字面量、DNS/重定向、链接路径、无审批和错误工具名。

**分析版本**

- **仓库**：[sensedeal/cue-skills](https://github.com/sensedeal/cue-skills)
- **版本号**：0.1.5（[固定提交 0e6b629](https://github.com/sensedeal/cue-skills/tree/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照 Guard 和下游目的地复核，测越界和误拒绝，效果不改善即退出。

在隔离网络验证 URL 别名、IPv6 字面量、DNS/重定向、链接路径、无审批和错误工具名。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 203 | 158 | 32 | — |
| .md | source | 2 | 138 | — | — | 909 |
| .js | test | 1 | 107 | 89 | 22 | — |
| .mjs | test | 1 | 70 | 49 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sensedeal/cue-skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/sensedeal/cue-skills/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sensedeal/cue-skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这个前置 Guard 能控制哪些 Omni Reader 调用，有哪些独立于它的安全边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 管理员能用这个 Guard 限制哪些调用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有 Omni Reader 的 DSH 管理员，可以在模型发出解析请求前限制目的主机及本地路径。补丁挂载本包，apply 注册 tools/pre-execute，策略只匹配 mcp__omni__parse，检查 arguments.source 或 url；放行时继续 waterfall，拒绝或询问时返回决策，处理器异常时返回拒绝。缺 source/url 则放行让下游 schema 验证，其他工具也原样进入后续处理。默认未知域拒绝、私网检查开、本地允许根空，实际覆盖取决于此监听器已挂载且请求走同一工具名。相比提示词要求先询问，它新增程序化决策；直接跑 MCP bridge 或改名绕开了这一监听范围。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/cue-omni-reader-guard/README.zh-CN.md:5-19](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/README.zh-CN.md#L5-L19)

作者声明工具范围与决策。

<details>
<summary>查看原文（15行）</summary>

```text
一个可选的 **DeepSeek Harness** bundle,用于加固 Omni Reader 的 `parse` 工具。它注册一个 `tools/pre-execute` 监听器,门控 `mcp__omni__parse`,使模型无法静默解析任意 URL。请在 [`@cueai/dsh-omni-reader`](../cue-omni-reader) wiring bundle **之后/旁边**安装它。

## 它做什么

在 `mcp__omni__parse` 调用派发前,护栏会对 `source` 分类:

| source | 结果 |
|---|---|
| **私网 / 回环 / 链路本地 / 云元数据主机**(`10/8`、`172.16/12`、`192.168/16`、`127/8`、`169.254.169.254`、`100.64/10`、`fe80::`、`fc00::`、`::1`、`localhost`、`*.local`、`metadata…`) | **deny**(SSRF 护栏) |
| **白名单主机**(`allowList`) | **allow** |
| 其它外部主机 | `policyForUnknown` —— `deny`(默认)、`ask` 或 `allow` |
| **显式配置的 `allowedRoots` 内的本地路径** | **allow** |
| **`allowedRoots` 之外的本地路径,或未配置 `allowedRoots`** | **deny**(fail-closed) |

其它工具原样放行(护栏只针对 `mcp__omni__parse`)。它同时门控 `source` 参数与 `url` 别名(Bridge 1.5+ 二者只取其一)。
```

</details>

**依据 2 · 源码核查**：[dsh/cue-omni-reader-guard/cordis.patch.yml:13-23](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/cordis.patch.yml#L13-L23)

默认挂载策略。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: cue-omni-reader-guard
      name: '@cueai/dsh-omni-reader-guard'
      config:
        blockPrivate: true
        allowList: []
        # OPT-IN: authorize local files by setting explicit absolute root(s).
        #   allowedRoots: [!!js process.cwd()]
        # Default (empty) denies all local file sources.
        policyForUnknown: deny   # deny | ask | allow
        consentReason: '解析外部 URL 前请确认(将消耗 Cue 积分)'
```

</details>

**依据 3 · 源码核查**：[dsh/cue-omni-reader-guard/index.js:12-28](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/index.js#L12-L28)

真实 pre-execute 接线和异常拒绝。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = 'cue-omni-reader-guard'
export const inject = ['tools']

export function apply(ctx, config = {}) {
  const opts = normalizeOpts(config)

  return ctx.tools.on('tools/pre-execute', async (exec, next) => {
    try {
      const decision = decideTool(exec, opts)
      if (decision.kind === 'allow') return next()
      return decision
    } catch (err) {
      // fail-closed: an unexpected guard error must not let the call through
      return { kind: 'deny', reason: `cue-omni-reader-guard error: ${(err && err.message) || 'unknown'}` }
    }
  })
}
```

</details>

**依据 4 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:163-175](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L163-L175)

精确工具名、参数别名和下游校验。

<details>
<summary>查看原文（13行）</summary>

```text
// Decide for a DSH tool execution: only Omni parse calls are gated; every
// other tool is allowed through untouched. The parse tool accepts exactly one
// of `source`/`url` (the url alias, Bridge 1.5+), so gate on either.
export function decideTool(exec, rawOpts = {}) {
  if (!exec || exec.name !== 'mcp__omni__parse') {
    return { kind: 'allow' }
  }
  const source = exec.arguments && (exec.arguments.source ?? exec.arguments.url)
  if (source === undefined || source === null) {
    return { kind: 'allow' } // no source argument; let the bridge schema handle it
  }
  return classifySource(source, rawOpts)
}
```

</details>

#### 缺口

- 未用真实宿主验证 waterfall 或旁路入口
  **影响**：不能证明所有解析请求走此监听器
  **进一步探讨**：隔离 profile 回放精确工具名、别名及直连路径，核实际派发

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 私网、主机和文件策略有什么实际边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

策略从 URL.hostname 取字符串，再检查 IP 和保留名字；没有 DNS 查询、连接目的 IP 和重定向复核。普通 DNS 域可以解析到私网，首个 URL 的允许决策不能约束后续跳转。按 URL 和 Node isIP 的接口，IPv6 URL hostname 带方括号，而代码未剥括号就调用 isIP，可能不进入 IPv6 私网判断；即便默认未知域拒绝挡住它，配置 allow 或 ask 时也应单独验证。README 说 *.x 只匹配子域，源码还允许 x 本身。文件路径用 resolve 与字符串前缀，允许根只校验数组，未强制其为绝对路径、未 realpath；相对值及符号链接需要更深一层控制。安装 Guard 可以增加应用层门槛，但仍要配合下游网络和文件访问约束。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:15-26](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L15-L26)

hostname 值未规范化括号就走 Node IP 判断。

<details>
<summary>查看原文（12行）</summary>

```text
export function parseHostOf(source) {
  try {
    const host = new URL(source.trim()).hostname.toLowerCase()
    return host || null
  } catch {
    return null
  }
}

export function isIpLiteral(host) {
  return isIP(host) !== 0
}
```

</details>

**依据 2 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:41-61](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L41-L61)

只检查字面 IP 和已知保留名。

<details>
<summary>查看原文（21行）</summary>

```text
export function isPrivateIPv6(ip) {
  const lower = ip.toLowerCase()
  return (
    lower === '::' || lower === '::1' ||
    lower.startsWith('fe80:') ||           // link-local
    /^(fc|fd)[0-9a-f]/.test(lower)         // unique-local fc00::/7
  )
}

export function isPrivateHost(host) {
  if (isIP(host) === 4) return isPrivateIPv4(host)
  if (isIP(host) === 6) return isPrivateIPv6(host)
  return false
}

export function isReservedHostname(host) {
  return (
    host === 'localhost' ||
    host.endsWith('.local') ||
    /(^|\.)(localhost|metadata|metadata\.google\.internal)$/i.test(host)
  )
```

</details>

**依据 3 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:64-85](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L64-L85)

通配根域与词法路径边界。

<details>
<summary>查看原文（22行）</summary>

```text
export function inAllowlist(host, allowList = []) {
  for (const raw of allowList) {
    const entry = String(raw).trim().toLowerCase()
    if (!entry) continue
    const suffix = entry.replace(/^\*\./, '')
    if (entry.startsWith('*.')) {
      if (host.endsWith('.' + suffix) || host === suffix) return true
    } else if (host === entry || host.endsWith('.' + entry)) {
      // a bare domain also admits its subdomains
      return true
    }
  }
  return false
}

export function isUnderRoot(absPath, roots) {
  const p = resolve(absPath)
  for (const root of roots || []) {
    const r = resolve(String(root))
    if (p === r || p.startsWith(r.endsWith(sep) ? r : r + sep)) return true
  }
  return false
```

</details>

**依据 4 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:98-129](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L98-L129)

配置形状与本地路径判定。

<details>
<summary>查看原文（32行）</summary>

```text
export function normalizeOpts(raw = {}) {
  const d = defaultOpts()
  const o = { ...d, ...raw }
  if (!Array.isArray(o.allowList)) throw new Error('allowList must be an array')
  if (!Array.isArray(o.allowedRoots)) throw new Error('allowedRoots must be an array')
  if (!(o.blockPrivate === true || o.blockPrivate === false)) {
    throw new Error('blockPrivate must be a boolean')
  }
  if (!['deny', 'ask', 'allow'].includes(o.policyForUnknown)) {
    throw new Error("policyForUnknown must be 'deny' | 'ask' | 'allow'")
  }
  // Fail-closed: no implicit root. An empty allowedRoots denies local files
  // until the deployment config authorizes an explicit absolute directory.
  return o
}

export function classifySource(source, rawOpts = {}) {
  const o = normalizeOpts(rawOpts)
  const value = typeof source === 'string' ? source.trim() : source

  if (!isHttpSource(value)) {
    // treat as a local path. Fail-closed on an empty allowedRoots: no implicit
    // cwd. The deployment must authorize an explicit absolute directory.
    if (typeof value === 'string' && isUnderRoot(value, o.allowedRoots)) {
      return { kind: 'allow' }
    }
    return {
      kind: 'deny',
      reason: o.allowedRoots.length
        ? 'local source is outside the allowed roots'
        : 'no allowedRoots configured; set allowedRoots to authorize local files',
    }
```

</details>

**依据 5 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:132-160](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L132-L160)

URL 只做首个主机和政策判定。

<details>
<summary>查看原文（29行）</summary>

```text
  const host = parseHostOf(value)
  if (!host) {
    return { kind: 'deny', reason: 'unparseable URL' }
  }

  if (o.blockPrivate && (isPrivateHost(host) || isReservedHostname(host))) {
    return {
      kind: 'deny',
      reason: `URL host "${host}" is private/local/reserved (SSRF guard). ` +
        'Only public allow-listed hosts may be parsed.',
    }
  }

  if (inAllowlist(host, o.allowList)) {
    return { kind: 'allow' }
  }

  switch (o.policyForUnknown) {
    case 'allow':
      return { kind: 'allow' }
    case 'ask':
      return { kind: 'ask', reason: o.consentReason }
    case 'deny':
    default:
      return {
        kind: 'deny',
        reason: `URL host "${host}" is not allow-listed and policyForUnknown=deny.`,
      }
  }
```

</details>

**依据 6 · 作者声明**：[dsh/cue-omni-reader-guard/README.zh-CN.md:33-38](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/README.zh-CN.md#L33-L38)

通配域和根的作者说明。

```text
| 字段 | 类型 | 默认 | 含义 |
|---|---|---|---|
| `blockPrivate` | boolean | `true` | 拒绝私网/保留主机(SSRF 门禁) |
| `allowList` | string[] | `[]` | 免同意的宿主/域名(裸域名也放行其子域;`*.x` 仅子域) |
| `allowedRoots` | string[] | `[]`(本地文件**被拒**) | 本地 `source` 必须落在其中的绝对目录。**须显式设置**才允许本地解析;空 = fail-closed |
| `policyForUnknown` | `'deny'`\|`'ask'`\|`'allow'` | `'deny'` | 不在 `allowList` 的外部主机的结果 |
```

#### 缺口

- 未实际回放 IPv6、DNS、跳转和 symlink
  **影响**：不能宣称 Guard 具有网络沙箱强度
  **进一步探讨**：以无敏感权限环境核地址分类、跳转后 IP 和真实路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用审批策略并验证不误放？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

应先隔离 profile，配置一个可控公开域和单个非敏感目录，使用默认拒绝测试放行及拦截。ask 只是插件返回的决策，作者说需要 Host approval 服务给 allowed-once；本包没有实现该服务，必须观察无 approval 或拒绝时工具是否真的未执行。操作负担是维护域和根、复查 Host 版本、验证下游网络，并处理误拦。若不能核对出口、审批或日志，应关闭 Omni 解析入口，保留正常手工查阅。可比较仅用 Guard 与 Guard 加下游最终目的地复核，记录越界可达率及合法请求拒绝率；若越界未降或正常流程破坏则停止推广。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/cue-omni-reader-guard/README.zh-CN.md:41-61](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/README.zh-CN.md#L41-L61)

作者说明配置、approval 契约和范围。

<details>
<summary>查看原文（21行）</summary>

````text
示例:放行一个可信 API 主机,其余需同意。

```yaml
config:
  blockPrivate: true
  allowList: ['api.example.com']
  policyForUnknown: ask
```

## 验证

```sh
node --test dsh/cue-omni-reader-guard/test/policy.test.js
python3 scripts/verify_dsh_bundles.py
```

## 说明

- `ask` 需要 DSH 的 approval 服务返回 `allowed-once`;没有则退化为 deny(fail-closed)——见 `tools/pre-execute` 瀑布契约。
- 这是护栏,不是沙箱:它过滤主机与本地根,**不**改写参数。把 `allowedRoots` 收到最小,无人值守 agent 建议用 `deny` + 显式 `allowList`。
- 核心策略(`policy.js`)是纯 Node(`node:url`/`node:net`),所以安全逻辑无需活 DSH 即可测试。
````

</details>

**依据 2 · 源码核查**：[dsh/cue-omni-reader-guard/policy.js:145-160](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/policy.js#L145-L160)

未知域的拒绝、询问或放行。

<details>
<summary>查看原文（16行）</summary>

```text
  if (inAllowlist(host, o.allowList)) {
    return { kind: 'allow' }
  }

  switch (o.policyForUnknown) {
    case 'allow':
      return { kind: 'allow' }
    case 'ask':
      return { kind: 'ask', reason: o.consentReason }
    case 'deny':
    default:
      return {
        kind: 'deny',
        reason: `URL host "${host}" is not allow-listed and policyForUnknown=deny.`,
      }
  }
```

</details>

**依据 3 · 源码核查**：[dsh/cue-omni-reader-guard/index.js:18-26](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/index.js#L18-L26)

决策由宿主处理。

```text
  return ctx.tools.on('tools/pre-execute', async (exec, next) => {
    try {
      const decision = decideTool(exec, opts)
      if (decision.kind === 'allow') return next()
      return decision
    } catch (err) {
      // fail-closed: an unexpected guard error must not let the call through
      return { kind: 'deny', reason: `cue-omni-reader-guard error: ${(err && err.message) || 'unknown'}` }
    }
```

**依据 4 · 源码核查**：[dsh/cue-omni-reader-guard/package.json:11-22](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-omni-reader-guard/package.json#L11-L22)

dsh-tools peer 与运行时。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {},
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "^0.1.1-rc.2"
  },
  "engines": {
    "node": ">=20.12"
  },
```

</details>

#### 缺口

- 未做真实审批或可控出站复核
  **影响**：不能核实际审批链、风险和运维成本
  **进一步探讨**：检查测试输入的派发日志、流量和错误恢复

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
