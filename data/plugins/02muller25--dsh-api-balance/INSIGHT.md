# dsh-api-balance

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c27c8b6](https://github.com/02Muller25/dsh-api-balance/tree/c27c8b61acf97714ab08d99f97b7be3a9007e52e)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance)
<!-- END META -->

> **实现功能**：在 DSH Web 输入框旁轮询显示 DeepSeek API 余额与可用状态。

> **核心亮点**：把账户余额置于会话输入附近并可配置刷新频率。详见[Q01](#research-q01)。

> **风险与缺陷**：凭证作为外部命令字符串参数、无路由内身份检查及重叠轮询可能影响安全/新鲜度；外围与真实利用待测。详见[Q02](#research-q02)和[Q03](#research-q03)。

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
  - [Q01 · 余额读数提供什么决策信息，前后端各做什么？](#detail-section-11)
  - [Q02 · 密钥只留在宿主进程的声明有什么实际边界？](#detail-section-12)
  - [Q03 · 请求失败和刷新模式如何影响数据新鲜度？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复成本分别是什么？](#detail-section-14)
  - [Q05 · 能否降低密钥暴露与刷新竞态而保留即时余额价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：操作者在发起对话前快速查看指定 DeepSeek key 的余额状态。详见[Q01](#research-q01)。

手工进 DeepSeek 控制台查余额；插件在 dock 即时查询/定时刷新。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 查询 | 取指定 key 余额 | 外部 curl 携 key |
| 展示 | dock 余额/旧值 | 单账户/可能过期 |
| 刷新 | 手动和周期 | 多窗口叠加 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DEEPSEEK_API_KEY/credentials | 必需 | 认证余额 API | 无余额 |
| webServer/shell/curl | 必需 | Host 路由/网络请求 | 查询失败 |
| Web slots/localStorage | 展示/偏好 | dock 与刷新设置 | 无界面/偏好失效 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | web profile 挂载 | dock 加载 |
| 刷新 | 手动/长周期 | 核时间戳和 stale |
| 故障 | 分层排凭证/curl/上游 | 停轮询并轮换可疑 key |

**效果与成本**

#### 成本

| 阶段 | 具体动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 安装 web bundle、配 key/curl | 本地磁盘/配置；现金价格未知 | 凭证与权限审核工时未知 | 安装或认证失败需排查/卸载 |
| 持续 | 每浏览器定时 Host→curl→API 查询 | 网络/进程/上游限额；余额 API 计费未知 | 核读数与过期状态，工时未知 | 最短 5 秒，多标签叠加请求未知 |
| 失败恢复 | 处理 curl/解析/凭证错误及旧数据 | 重试网络资源；若泄密需轮换 key，费用未知 | 查日志、轮换/验证凭证及恢复显示，工时未知 | 错误频率和恢复时间未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| dock 读数 | 余额请求和展示 | 真实账户准确性 |
| 可配刷新 | 手动/周期/localStorage | 多标签资源/逆序行为 |
| 凭证 | 前端不直接取 key | 进程参数/外围授权边界 |

> **思考**：凭证作为外部命令字符串参数、无路由内身份检查及重叠轮询可能影响安全/新鲜度；外围与真实利用待测。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把账户余额置于会话输入附近并可配置刷新频率。详见[Q01](#research-q01)。

把账户余额置于会话输入附近并可配置刷新频率。详见[Q01](#research-q01)。

前后端功能明晰，但外部命令携带 bearer 和并发轮询缺序号/缓存控制是明显审查点。详见[Q02](#research-q02)至[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

凭证作为外部命令字符串参数、无路由内身份检查及重叠轮询可能影响安全/新鲜度；外围与真实利用待测。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离环境核凭证执行与路由权限，使用低频或手动刷新，再评估真实账户接入。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认余额查询/UI；key 被拼进外部 curl 命令，作者“不出宿主进程”表述不成立。真实路由外围认证/进程可见性未测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、lib/index.js、lib/client.js、package.json；未运行 DSH、curl 或余额 API，也未使用真实凭证。旧 META 复用。
- 下一步：隔离假 key 和模拟余额服务核 Host 凭证/进程参数、路由身份、HTTP/JSON 错误、乱序/多标签刷新及旧值提示。

**分析版本**

- **仓库**：[02Muller25/dsh-api-balance](https://github.com/02Muller25/dsh-api-balance)
- **版本号**：0.2.1（[固定提交 c27c8b6](https://github.com/02Muller25/dsh-api-balance/tree/c27c8b61acf97714ab08d99f97b7be3a9007e52e)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

Host 内部 HTTP、共享短缓存与响应序号可能减少凭证暴露和乱序覆盖；以假 key/多窗口对照证伪。详见[Q05](#research-q05)。

隔离假 key 和模拟余额服务核 Host 凭证/进程参数、路由身份、HTTP/JSON 错误、乱序/多标签刷新及旧值提示。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 346 | 327 | 16 | — |
| .md | source | 1 | 89 | — | — | 928 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+created%3A2026-09-20T04%3A25%3A13.285Z..2026-10-20T04%3A25%3A13.285Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T04%3A25%3A13.285Z..2026-10-20T04%3A25%3A13.285Z)



统计日期：2026-10-20。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**Web 余额读数能否保持新鲜并避免凭证和重复请求的额外风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 余额读数提供什么决策信息，前后端各做什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件在 dsh Web 输入框 dock 显示余额、可用状态和更新时间，客户端挂载即请求并按手动/预设/自定义间隔刷新，刷新失败保留旧数并标 stale。Host 注册 GET /api/abal-balance，请求时解析 DEEPSEEK_API_KEY、调用 DeepSeek 余额接口并返回简化 JSON。仅显示该 API 账号状态，不等于 dsh 整体模型预算或本会话可用额度；余额接口实际字段、计费与多 key 情形未核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/README.md#L1-L19)

作者 UI 与失败行为说明

<details>
<summary>查看原文（19行）</summary>

````text
# api-balance

实时显示 DeepSeek API 账户余额的 DeepSeek Harness（dsh web）插件。
Real-time DeepSeek API account balance readout for the DeepSeek Harness web GUI.

在会话输入框下方的读数带（`conversation.composer.dock`）显示：

```
API 余额 CNY 18.22 · 可用 · 14:32:05 更新
```

![效果示意图](docs/screenshot.svg)

- 每 30 秒自动刷新（挂载时立即查询一次）
- **刷新模式可选**：手动刷新 / 每 10 秒 / 每 30 秒 / 每 1 分钟 / 每 5 分钟 / 自定义间隔；选择「自定义…」会弹出输入窗口（范围 **5–3600 秒**，含校验与错误提示），偏好保存在浏览器 localStorage，刷新页面后仍保留
- 手动模式下点击「刷新」按钮即时刷新；自定义间隔确认后即时生效
- 刷新失败时保留上次数据并显示黄色「刷新失败」，悬停可见具体原因，下一次自动轮询自动恢复
- 余额不可用时显示红色「不可用」
- API 密钥通过 dsh 的 credentials 服务按需解析（`DEEPSEEK_API_KEY`），**不出宿主进程**
````

</details>

**依据 2 · 源码核查**：[lib/index.js:11-64](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L11-L64)

Host 查询/映射

<details>
<summary>查看原文（54行）</summary>

```text
async function fetchBalance(ctx) {
  const credentials = ctx.get('credentials')
  if (!credentials) return { ok: false, step: 'credentials', error: 'credentials service unavailable' }
  const cred = await credentials.resolve('DEEPSEEK_API_KEY')
  if (!cred) return { ok: false, step: 'credential', error: 'DEEPSEEK_API_KEY is not configured' }
  const shell = ctx.get('shell')
  if (!shell) return { ok: false, step: 'shell', error: 'shell service unavailable' }
  let workspaceRoot = ''
  const sandboxPolicy = ctx.get('sandboxPolicy')
  if (sandboxPolicy !== undefined) {
    try {
      const resolved = sandboxPolicy.resolve()
      if (resolved && typeof resolved === 'object' && typeof resolved.workspaceRoot === 'string') {
        workspaceRoot = resolved.workspaceRoot
      }
    } catch (err) {
      console.error('[api-balance] sandboxPolicy.resolve failed: ' + String((err && err.message) || err))
    }
  }
  // The curl call is a read-only network request with no file effects; run it
  // unconfined (danger-full-access) so the platform sandbox runner is
  // bypassed entirely — the same path verified working for this endpoint.
  const spec = shell.resolve({
    command: `${CURL} -s -m 20 -H "Authorization: Bearer ${cred.value}" "${BALANCE_URL}"`,
    timeoutMs: 25000,
    stdoutMaxBytes: 65536,
    sandboxPolicy: { mode: 'danger-full-access', workspaceRoot },
  })
  const result = await shell.run(spec)
  if (result.exitCode !== 0) {
    const detail = (result.stderr.text || '').trim().slice(0, 300)
    return { ok: false, step: 'curl', error: 'exit ' + String(result.exitCode) + (detail ? ': ' + detail : '') }
  }
  let data
  try {
    data = JSON.parse(result.stdout.text)
  } catch (err) {
    return { ok: false, step: 'parse', error: 'unparseable response: ' + result.stdout.text.trim().slice(0, 300) }
  }
  const balances = Array.isArray(data.balance_infos)
    ? data.balance_infos.map((b) => ({
        currency: String(b.currency ?? ''),
        total: String(b.total_balance ?? ''),
        granted: String(b.granted_balance ?? ''),
        toppedUp: String(b.topped_up_balance ?? ''),
      }))
    : []
  return {
    ok: true,
    isAvailable: data.is_available === true,
    balances,
    fetchedAt: new Date().toISOString(),
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:86-107](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js#L86-L107)

客户端刷新

<details>
<summary>查看原文（22行）</summary>

```text
			var refresh = React.useCallback(function () {
				fetch("/api/abal-balance", { cache: "no-store" }).then(function (response) {
					return response.json();
				}).then(function (res) {
					setView(function (prev) {
						if (res && res.ok === true) return { kind: "data", data: res, stale: false, error: null };
						var error = String((res && res.error) || "empty response");
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				}, function (err) {
					setView(function (prev) {
						var error = String((err && err.message) || err);
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				});
			}, []);
			React.useEffect(function () {
				refresh();
				if (config.mode === "manual") return undefined;
				var id = setInterval(refresh, config.seconds * 1000);
				return function () { clearInterval(id); };
			}, [refresh, config.mode, config.seconds]);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:133-165](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js#L133-L165)

旧值与状态展示

<details>
<summary>查看原文（33行）</summary>

```text
				body = React.createElement("span", { key: "loading", style: mutedStyle }, "查询中…");
			} else if (view.kind === "error") {
				body = [
					React.createElement("span", { key: "err", style: badStyle }, "获取失败"),
					React.createElement("span", { key: "errmsg", style: mutedStyle, title: String(view.error) }, String(view.error))
				];
			} else {
				var data = view.data;
				if (!data || data.ok !== true || !Array.isArray(data.balances) || data.balances.length === 0) {
					var emptyError = String((data && data.error) || "empty response");
					body = [
						React.createElement("span", { key: "err", style: badStyle }, "获取失败"),
						React.createElement("span", { key: "errmsg", style: mutedStyle, title: emptyError }, emptyError)
					];
				} else {
					var cells = [];
					for (var i = 0; i < data.balances.length; i++) {
						var b = data.balances[i];
						cells.push(React.createElement("span", { key: b.currency || "cur", style: amtStyle }, b.currency + " " + b.total));
					}
					var updated = data.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString() : "";
					body = [
						React.createElement("span", { key: "label" }, "API 余额"),
						React.createElement("span", { key: "sp1", style: mutedStyle }, "·")
					].concat(cells, [
						React.createElement("span", { key: "sp2", style: mutedStyle }, "·"),
						data.isAvailable
							? React.createElement("span", { key: "avail", style: okStyle }, "可用")
							: React.createElement("span", { key: "avail", style: badStyle }, "不可用"),
						React.createElement("span", { key: "time", style: mutedStyle }, updated ? updated + " 更新" : "")
					]);
					if (view.stale) {
						body.push(React.createElement("span", { key: "stale", style: warnStyle, title: String(view.error) }, "刷新失败"));
```

</details>

#### 缺口

- 真实账户/多密钥账户对应关系未知
  **影响：**单个读数可能误导整体可用性
  **进一步探讨：**隔离测试账户核 key 与余额响应

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 密钥只留在宿主进程的声明有什么实际边界？

**研究主题：**功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

源码从 credentials 服务按每次请求解析 key，前端 JSON 不直接返回 key；但构造 shell.resolve 的 command 字符串时将 Bearer 值原文插入 curl 命令，并以 danger-full-access 运行，不能严格称密钥“不出宿主进程”：至少进入所派生 curl 命令/进程的命令参数，具体系统进程可见性待测。没有参数化传递/日志遮盖证明；如果凭证值包含 shell 元字符，命令字符串还存在解释边界，实际注入取决于 shell.resolve 执行语义。源码中路由自身未见请求身份检查，外层 Web 认证与跨站策略必须单独核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-32](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/README.md#L19-L32)

作者不出进程及 sandbox 声明

<details>
<summary>查看原文（14行）</summary>

```text
- API 密钥通过 dsh 的 credentials 服务按需解析（`DEEPSEEK_API_KEY`），**不出宿主进程**

## 架构

| 文件 | 平台 | 作用 |
| --- | --- | --- |
| `lib/index.js` | Host | 注册精确路由 `GET /api/abal-balance`；每次请求实时解析凭证并 curl `https://api.deepseek.com/user/balance` |
| `lib/client.js` | Client (web) | 手工编写的 `window.__ModuleLoader__.load` 格式 bundle（dsh web 的标准客户端包格式，无需构建管线）；在输入框读数带渲染余额，每 30s `fetch` 刷新 |
| `lib/client.d.ts` | — | 客户端类型占位 |

依赖的宿主服务：`webServer`、`credentials`、`shell`、`sandboxPolicy`（均为 dsh 标准服务）。
客户端侧仅依赖 `react`（种子模块）与 `slots` 服务。

> 说明：curl 调用以 `danger-full-access` 策略运行 —— 它是只读网络请求、无文件副作用，绕过平台沙箱 runner 是刻意的（在 Windows ACL 受限令牌下该请求已验证会失败）。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:11-39](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L11-L39)

key 拼进 curl 命令及 unconfined 执行

<details>
<summary>查看原文（29行）</summary>

```text
async function fetchBalance(ctx) {
  const credentials = ctx.get('credentials')
  if (!credentials) return { ok: false, step: 'credentials', error: 'credentials service unavailable' }
  const cred = await credentials.resolve('DEEPSEEK_API_KEY')
  if (!cred) return { ok: false, step: 'credential', error: 'DEEPSEEK_API_KEY is not configured' }
  const shell = ctx.get('shell')
  if (!shell) return { ok: false, step: 'shell', error: 'shell service unavailable' }
  let workspaceRoot = ''
  const sandboxPolicy = ctx.get('sandboxPolicy')
  if (sandboxPolicy !== undefined) {
    try {
      const resolved = sandboxPolicy.resolve()
      if (resolved && typeof resolved === 'object' && typeof resolved.workspaceRoot === 'string') {
        workspaceRoot = resolved.workspaceRoot
      }
    } catch (err) {
      console.error('[api-balance] sandboxPolicy.resolve failed: ' + String((err && err.message) || err))
    }
  }
  // The curl call is a read-only network request with no file effects; run it
  // unconfined (danger-full-access) so the platform sandbox runner is
  // bypassed entirely — the same path verified working for this endpoint.
  const spec = shell.resolve({
    command: `${CURL} -s -m 20 -H "Authorization: Bearer ${cred.value}" "${BALANCE_URL}"`,
    timeoutMs: 25000,
    stdoutMaxBytes: 65536,
    sandboxPolicy: { mode: 'danger-full-access', workspaceRoot },
  })
  const result = await shell.run(spec)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:66-91](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L66-L91)

路由与返回

<details>
<summary>查看原文（26行）</summary>

```text
export default {
  name: 'api-balance',
  inject: ['webServer', 'credentials', 'shell'],
  apply(ctx) {
    ctx.webServer.register({
      kind: 'exact',
      path: '/api/abal-balance',
      handler: async (req, res) => {
        let payload
        try {
          payload = await fetchBalance(ctx)
        } catch (err) {
          const message = err && err.message ? err.message : String(err)
          console.error('[api-balance] handler failed: ' + message)
          payload = { ok: false, step: 'throw', error: message }
        }
        const body = JSON.stringify(payload)
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(body)
      },
    })
  },
}
```

</details>

#### 缺口

- 外层 Web 路由认证/同源边界未知
  **影响：**未经授权的余额读取范围未定
  **进一步探讨：**目标部署核带/不带会话凭证的请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 请求失败和刷新模式如何影响数据新鲜度？

**研究主题：**功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Host curl 超时设 20 秒/运行超时 25 秒、stdout 最大 64 KiB；非零退出、解析失败返回 ok:false 但 HTTP 始终 200。客户端只看 JSON ok，成功刷新数据，失败时旧值保留并标 stale；手动模式无轮询，自动模式可从 10 秒到自定义 5–3600 秒，偏好存浏览器 localStorage。当前客户端未见请求序号/取消控制，5/10 秒周期可与最长 25 秒请求交叠，后返回的旧请求可能覆盖较新结果；这是一条静态竞态风险，未运行。服务端也未限流/缓存，每位客户端独立轮询可叠加上游请求。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:33-49](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L33-L49)

超时/失败分支

<details>
<summary>查看原文（17行）</summary>

```text
  const spec = shell.resolve({
    command: `${CURL} -s -m 20 -H "Authorization: Bearer ${cred.value}" "${BALANCE_URL}"`,
    timeoutMs: 25000,
    stdoutMaxBytes: 65536,
    sandboxPolicy: { mode: 'danger-full-access', workspaceRoot },
  })
  const result = await shell.run(spec)
  if (result.exitCode !== 0) {
    const detail = (result.stderr.text || '').trim().slice(0, 300)
    return { ok: false, step: 'curl', error: 'exit ' + String(result.exitCode) + (detail ? ': ' + detail : '') }
  }
  let data
  try {
    data = JSON.parse(result.stdout.text)
  } catch (err) {
    return { ok: false, step: 'parse', error: 'unparseable response: ' + result.stdout.text.trim().slice(0, 300) }
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:66-87](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L66-L87)

始终 200

<details>
<summary>查看原文（22行）</summary>

```text
export default {
  name: 'api-balance',
  inject: ['webServer', 'credentials', 'shell'],
  apply(ctx) {
    ctx.webServer.register({
      kind: 'exact',
      path: '/api/abal-balance',
      handler: async (req, res) => {
        let payload
        try {
          payload = await fetchBalance(ctx)
        } catch (err) {
          const message = err && err.message ? err.message : String(err)
          console.error('[api-balance] handler failed: ' + message)
          payload = { ok: false, step: 'throw', error: message }
        }
        const body = JSON.stringify(payload)
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(body)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:10-45](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js#L10-L45)

刷新偏好

<details>
<summary>查看原文（36行）</summary>

```text
		// ---- refresh preference (localStorage-backed, survives page reloads) ----
		var STORAGE_KEY = "dsh.api-balance.refresh";
		var DEFAULT_CONFIG = { mode: "auto", seconds: 30 };
		var MIN_SECONDS = 5;
		var MAX_SECONDS = 3600;
		var PRESETS = [
			{ value: "manual", label: "手动刷新" },
			{ value: 10, label: "每 10 秒" },
			{ value: 30, label: "每 30 秒" },
			{ value: 60, label: "每 1 分钟" },
			{ value: 300, label: "每 5 分钟" },
			{ value: "custom", label: "自定义…" }
		];
		function clampSeconds(value) {
			var n = parseInt(value, 10);
			if (!isFinite(n)) return DEFAULT_CONFIG.seconds;
			if (n < MIN_SECONDS) return MIN_SECONDS;
			if (n > MAX_SECONDS) return MAX_SECONDS;
			return n;
		}
		function loadConfig() {
			try {
				var raw = localStorage.getItem(STORAGE_KEY);
				if (!raw) return { mode: DEFAULT_CONFIG.mode, seconds: DEFAULT_CONFIG.seconds };
				var parsed = JSON.parse(raw);
				if (!parsed || typeof parsed !== "object") return { mode: DEFAULT_CONFIG.mode, seconds: DEFAULT_CONFIG.seconds };
				return {
					mode: parsed.mode === "manual" ? "manual" : "auto",
					seconds: clampSeconds(parsed.seconds)
				};
			} catch (err) {
				return { mode: DEFAULT_CONFIG.mode, seconds: DEFAULT_CONFIG.seconds };
			}
		}
		function saveConfig(config) {
			try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch (err) {}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:86-107](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js#L86-L107)

请求与轮询

<details>
<summary>查看原文（22行）</summary>

```text
			var refresh = React.useCallback(function () {
				fetch("/api/abal-balance", { cache: "no-store" }).then(function (response) {
					return response.json();
				}).then(function (res) {
					setView(function (prev) {
						if (res && res.ok === true) return { kind: "data", data: res, stale: false, error: null };
						var error = String((res && res.error) || "empty response");
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				}, function (err) {
					setView(function (prev) {
						var error = String((err && err.message) || err);
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				});
			}, []);
			React.useEffect(function () {
				refresh();
				if (config.mode === "manual") return undefined;
				var id = setInterval(refresh, config.seconds * 1000);
				return function () { clearInterval(id); };
			}, [refresh, config.mode, config.seconds]);
```

</details>

**依据 5 · 作者声明**：[README.md:14-17](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/README.md#L14-L17)

作者刷新模式

```text
- 每 30 秒自动刷新（挂载时立即查询一次）
- **刷新模式可选**：手动刷新 / 每 10 秒 / 每 30 秒 / 每 1 分钟 / 每 5 分钟 / 自定义间隔；选择「自定义…」会弹出输入窗口（范围 **5–3600 秒**，含校验与错误提示），偏好保存在浏览器 localStorage，刷新页面后仍保留
- 手动模式下点击「刷新」按钮即时刷新；自定义间隔确认后即时生效
- 刷新失败时保留上次数据并显示黄色「刷新失败」，悬停可见具体原因，下一次自动轮询自动恢复
```

#### 缺口

- 目标多标签/请求竞态与上游限流未知
  **影响：**读数新鲜度/流量成本可能被低估
  **进一步探讨：**慢响应与多窗口并发模拟对照请求顺序

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复成本分别是什么？

**研究主题：**效果与总成本、采用判断

#### 完整回答

首次需装到目标 web profile，确认凭证服务中恰是应看的 DeepSeek key、curl 与 Host 服务可用；现金安装价格未见，人工配置/审核工时未知。持续模式每个浏览器挂载及轮询都会请求 Host，Host 每次重新解 key 并启 curl 发网络请求；周期最短 5 秒，API 余额查询的配额/收费/网络资源未由材料证明，应标未知。失败恢复需区分未配 key、shell/curl/网络/JSON 解析/上游响应，并核旧值 stale；若 key 泄漏需轮换凭证和审日志，工时与费用未知。不能因“只读查询”断言无风险或零成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-32](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/README.md#L14-L32)

刷新与依赖

<details>
<summary>查看原文（19行）</summary>

```text
- 每 30 秒自动刷新（挂载时立即查询一次）
- **刷新模式可选**：手动刷新 / 每 10 秒 / 每 30 秒 / 每 1 分钟 / 每 5 分钟 / 自定义间隔；选择「自定义…」会弹出输入窗口（范围 **5–3600 秒**，含校验与错误提示），偏好保存在浏览器 localStorage，刷新页面后仍保留
- 手动模式下点击「刷新」按钮即时刷新；自定义间隔确认后即时生效
- 刷新失败时保留上次数据并显示黄色「刷新失败」，悬停可见具体原因，下一次自动轮询自动恢复
- 余额不可用时显示红色「不可用」
- API 密钥通过 dsh 的 credentials 服务按需解析（`DEEPSEEK_API_KEY`），**不出宿主进程**

## 架构

| 文件 | 平台 | 作用 |
| --- | --- | --- |
| `lib/index.js` | Host | 注册精确路由 `GET /api/abal-balance`；每次请求实时解析凭证并 curl `https://api.deepseek.com/user/balance` |
| `lib/client.js` | Client (web) | 手工编写的 `window.__ModuleLoader__.load` 格式 bundle（dsh web 的标准客户端包格式，无需构建管线）；在输入框读数带渲染余额，每 30s `fetch` 刷新 |
| `lib/client.d.ts` | — | 客户端类型占位 |

依赖的宿主服务：`webServer`、`credentials`、`shell`、`sandboxPolicy`（均为 dsh 标准服务）。
客户端侧仅依赖 `react`（种子模块）与 `slots` 服务。

> 说明：curl 调用以 `danger-full-access` 策略运行 —— 它是只读网络请求、无文件副作用，绕过平台沙箱 runner 是刻意的（在 Windows ACL 受限令牌下该请求已验证会失败）。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:11-49](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L11-L49)

每次解析 key/派生请求

<details>
<summary>查看原文（39行）</summary>

```text
async function fetchBalance(ctx) {
  const credentials = ctx.get('credentials')
  if (!credentials) return { ok: false, step: 'credentials', error: 'credentials service unavailable' }
  const cred = await credentials.resolve('DEEPSEEK_API_KEY')
  if (!cred) return { ok: false, step: 'credential', error: 'DEEPSEEK_API_KEY is not configured' }
  const shell = ctx.get('shell')
  if (!shell) return { ok: false, step: 'shell', error: 'shell service unavailable' }
  let workspaceRoot = ''
  const sandboxPolicy = ctx.get('sandboxPolicy')
  if (sandboxPolicy !== undefined) {
    try {
      const resolved = sandboxPolicy.resolve()
      if (resolved && typeof resolved === 'object' && typeof resolved.workspaceRoot === 'string') {
        workspaceRoot = resolved.workspaceRoot
      }
    } catch (err) {
      console.error('[api-balance] sandboxPolicy.resolve failed: ' + String((err && err.message) || err))
    }
  }
  // The curl call is a read-only network request with no file effects; run it
  // unconfined (danger-full-access) so the platform sandbox runner is
  // bypassed entirely — the same path verified working for this endpoint.
  const spec = shell.resolve({
    command: `${CURL} -s -m 20 -H "Authorization: Bearer ${cred.value}" "${BALANCE_URL}"`,
    timeoutMs: 25000,
    stdoutMaxBytes: 65536,
    sandboxPolicy: { mode: 'danger-full-access', workspaceRoot },
  })
  const result = await shell.run(spec)
  if (result.exitCode !== 0) {
    const detail = (result.stderr.text || '').trim().slice(0, 300)
    return { ok: false, step: 'curl', error: 'exit ' + String(result.exitCode) + (detail ? ': ' + detail : '') }
  }
  let data
  try {
    data = JSON.parse(result.stdout.text)
  } catch (err) {
    return { ok: false, step: 'parse', error: 'unparseable response: ' + result.stdout.text.trim().slice(0, 300) }
  }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:86-107](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js#L86-L107)

客户端周期

<details>
<summary>查看原文（22行）</summary>

```text
			var refresh = React.useCallback(function () {
				fetch("/api/abal-balance", { cache: "no-store" }).then(function (response) {
					return response.json();
				}).then(function (res) {
					setView(function (prev) {
						if (res && res.ok === true) return { kind: "data", data: res, stale: false, error: null };
						var error = String((res && res.error) || "empty response");
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				}, function (err) {
					setView(function (prev) {
						var error = String((err && err.message) || err);
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				});
			}, []);
			React.useEffect(function () {
				refresh();
				if (config.mode === "manual") return undefined;
				var id = setInterval(refresh, config.seconds * 1000);
				return function () { clearInterval(id); };
			}, [refresh, config.mode, config.seconds]);
```

</details>

#### 缺口

- 余额 API 当前限流/计费/价格未核
  **影响：**持续现金与失败恢复成本未知
  **进一步探讨：**由服务商官方资料及隔离账户确认限额与成本

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否降低密钥暴露与刷新竞态而保留即时余额价值？

**研究主题：**新假设与验证、采用判断

#### 完整回答

已知固定源码通过可见 curl 命令字符串传 Bearer，客户端无请求序号，多个窗口可产生重叠请求；贡献是无需手查即可在 dock 看余额。设计假设：改用 Host 内部 HTTPS 客户端通过 header 值传 key、加同源路由认证/短时共享缓存并对客户端响应设请求序号，可保留读数及时性，同时减少进程参数暴露和重复请求/逆序覆盖。条件是目标 Host 有可控 HTTP API 与身份上下文；代价是缓存失效策略、错误提示和请求状态管理。最小对照用假 key、故意乱序响应、两浏览器标签、短周期与网络失败，分别量测 key 在进程/日志可见性、上游请求数、展示结果时间戳和恢复时间。若 key 仍可从系统观察面取得、乱序后仍显示旧值、请求数未降低或新鲜度不可接受，则假设被证伪；此方案不是固定版已有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:11-39](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L11-L39)

当前凭证与请求方式

<details>
<summary>查看原文（29行）</summary>

```text
async function fetchBalance(ctx) {
  const credentials = ctx.get('credentials')
  if (!credentials) return { ok: false, step: 'credentials', error: 'credentials service unavailable' }
  const cred = await credentials.resolve('DEEPSEEK_API_KEY')
  if (!cred) return { ok: false, step: 'credential', error: 'DEEPSEEK_API_KEY is not configured' }
  const shell = ctx.get('shell')
  if (!shell) return { ok: false, step: 'shell', error: 'shell service unavailable' }
  let workspaceRoot = ''
  const sandboxPolicy = ctx.get('sandboxPolicy')
  if (sandboxPolicy !== undefined) {
    try {
      const resolved = sandboxPolicy.resolve()
      if (resolved && typeof resolved === 'object' && typeof resolved.workspaceRoot === 'string') {
        workspaceRoot = resolved.workspaceRoot
      }
    } catch (err) {
      console.error('[api-balance] sandboxPolicy.resolve failed: ' + String((err && err.message) || err))
    }
  }
  // The curl call is a read-only network request with no file effects; run it
  // unconfined (danger-full-access) so the platform sandbox runner is
  // bypassed entirely — the same path verified working for this endpoint.
  const spec = shell.resolve({
    command: `${CURL} -s -m 20 -H "Authorization: Bearer ${cred.value}" "${BALANCE_URL}"`,
    timeoutMs: 25000,
    stdoutMaxBytes: 65536,
    sandboxPolicy: { mode: 'danger-full-access', workspaceRoot },
  })
  const result = await shell.run(spec)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:66-91](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js#L66-L91)

路由行为

<details>
<summary>查看原文（26行）</summary>

```text
export default {
  name: 'api-balance',
  inject: ['webServer', 'credentials', 'shell'],
  apply(ctx) {
    ctx.webServer.register({
      kind: 'exact',
      path: '/api/abal-balance',
      handler: async (req, res) => {
        let payload
        try {
          payload = await fetchBalance(ctx)
        } catch (err) {
          const message = err && err.message ? err.message : String(err)
          console.error('[api-balance] handler failed: ' + message)
          payload = { ok: false, step: 'throw', error: message }
        }
        const body = JSON.stringify(payload)
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        })
        res.end(body)
      },
    })
  },
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:86-107](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js#L86-L107)

当前刷新控制

<details>
<summary>查看原文（22行）</summary>

```text
			var refresh = React.useCallback(function () {
				fetch("/api/abal-balance", { cache: "no-store" }).then(function (response) {
					return response.json();
				}).then(function (res) {
					setView(function (prev) {
						if (res && res.ok === true) return { kind: "data", data: res, stale: false, error: null };
						var error = String((res && res.error) || "empty response");
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				}, function (err) {
					setView(function (prev) {
						var error = String((err && err.message) || err);
						return prev.kind === "data" ? { kind: "data", data: prev.data, stale: true, error: error } : { kind: "error", error: error };
					});
				});
			}, []);
			React.useEffect(function () {
				refresh();
				if (config.mode === "manual") return undefined;
				var id = setInterval(refresh, config.seconds * 1000);
				return function () { clearInterval(id); };
			}, [refresh, config.mode, config.seconds]);
```

</details>

#### 缺口

- 目标 Host HTTP/认证接口及缓存可行性未知
  **影响：**提议方案需目标版本适配
  **进一步探讨：**隔离原型验证接口与身份语义

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
