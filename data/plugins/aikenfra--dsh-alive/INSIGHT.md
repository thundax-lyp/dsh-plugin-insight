# dsh-alive

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d17acfa](https://github.com/AikenFra/dsh-alive/tree/d17acfa8689666d799c94e196020a3efed11ad0a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AikenFra/dsh-alive) [![npm 30d 832](https://img.shields.io/static/v1?label=npm+30d&message=832&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-alive) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-alive)
<!-- END META -->

> **实现功能**：在会话头部显示本地 DSH 插件端点的 15 秒轮询可达状态。

> **核心亮点**：极简本地可达性显示，初次加载即测、卸载清轮询。详见[Q02](#research-q02)。

> **风险与缺陷**：标题称“DeepSeek 服务状态”，实际仅测本地路由；无超时/响应体验证且兼容范围止于 <0.2.0。详见[Q01](#research-q01)、[Q03](#research-q03)。

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
  - [Q01 · 在线红绿点实际证明哪一层可用？](#detail-section-11)
  - [Q02 · 插件怎样进入宿主且如何清理轮询？](#detail-section-12)
  - [Q03 · 零 token 与及时性/可靠性有什么边界？](#detail-section-13)
  - [Q04 · 安装与版本依赖是否适合现行宿主？](#detail-section-14)
  - [Q05 · 若要采纳，怎样改进健康语义与验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户想知道浏览器是否还能连本地 DSH Web 进程。

浏览器自身对 Web 连接的错误提示；此包增加常驻红绿点。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| ping | 本地可达 | 非模型健康 |
| 轮询 | 15 秒刷新 | 无超时 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| webServer | ping 路由 | 红点 |
| slots/React | 头部显示 | 无组件 |
| 浏览器 fetch | 轮询 | 红点或旧状态 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 加载 | 测路由/slot | 点可见 |
| 故障 | 断 Web/上游 | 仅 Web 故障变红 |
| 兼容 | 0.1/0.2 对照 | 无报错 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | Web profile 重启 | slot 兼容 |
| 使用 | 每标签 15 秒 HTTP | 挂起请求 |
| 维护 | DSH API 演化 | 0.2.x |

| 结果 | 源码支持 | 不能推出 |
| --- | --- | --- |
| 绿点 | ping 返回 2xx | 模型在线 |
| 零 token | 无模型调用 | 零 HTTP 开销 |
| 离线 | fetch 非 2xx/异常 | DSH 所有功能坏 |

> **思考**：标题称“DeepSeek 服务状态”，实际仅测本地路由；无超时/响应体验证且兼容范围止于 <0.2.0。详见[Q01](#research-q01)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：极简本地可达性显示，初次加载即测、卸载清轮询。详见[Q02](#research-q02)。

极简本地可达性显示，初次加载即测、卸载清轮询。详见[Q02](#research-q02)。

后端固定 200 JSON，前端仅查 r.ok；未设超时/响应体检验，轮询可重叠。

<a id="detail-section-5"></a>

### 1.4 主要限制

标题称“DeepSeek 服务状态”，实际仅测本地路由；无超时/响应体验证且兼容范围止于 <0.2.0。详见[Q01](#research-q01)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅以“本地 DSH Web 端点可达”解释，并在固定版本上做故障矩阵。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

零模型 token 可由源码支持，但红绿点不代表模型或账户健康；0.2.x 兼容未覆盖。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/index.js、client/client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅 README、package、host/client 两文件；未启动 DSH。
- 下一步：模拟 2xx 错误页、慢请求、断 Web 与断上游；测试旧版/新版 slot。

**分析版本**

- **仓库**：[AikenFra/dsh-alive](https://github.com/AikenFra/dsh-alive)
- **版本号**：0.1.2（[固定提交 d17acfa](https://github.com/AikenFra/dsh-alive/tree/d17acfa8689666d799c94e196020a3efed11ad0a)）
- **版本日期**：2026-09-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分层健康标签与超时/响应校验可减少误报；未实现。详见[Q05](#research-q05)。

模拟 2xx 错误页、慢请求、断 Web 与断上游；测试旧版/新版 slot。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 80 | 68 | 6 | — |
| .md | source | 1 | 89 | — | — | 639 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AikenFra/dsh-alive/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AikenFra/dsh-alive/issues?q=is%3Aissue+created%3A2026-09-22T06%3A02%3A16.808Z..2026-10-22T06%3A02%3A16.808Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AikenFra/dsh-alive/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A02%3A16.808Z..2026-10-22T06%3A02%3A16.808Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：厘清零 token 心跳可证明的健康层级与宿主兼容性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在线红绿点实际证明哪一层可用？

**研究主题**：场景与需求

#### 完整回答

浏览器每 15 秒 fetch 本机 DSH 的 /dsh-alive/ping；若 HTTP 响应 ok 就显示在线。后端无模型请求、数据库或上游检测，因此绿色只证明浏览器当前能连到提供插件路由的 Web 进程，不证明 DeepSeek 模型、账户余额、推理服务或其他 DSH 功能可用。前端 title 写“DeepSeek 服务状态”比实际检测范围宽，README“服务挂了立刻变红”也受 15 秒检测周期制约。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:7-20](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/dsh/index.js#L7-L20)

固定返回 ok 的进程内端点。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (scope) => {
      scope.webServer.register({
        kind: 'exact',
        path: '/dsh-alive/ping',
        handler: async (req, res) => {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          })
          res.end(JSON.stringify({ ok: true, ts: Date.now() }))
        },
      })
```

</details>

**依据 2 · 源码核查**：[client/client.js:15-30](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L15-L30)

15 秒 fetch 与状态判定。

<details>
<summary>查看原文（16行）</summary>

```text
  function OnlineDot() {
    const [status, setStatus] = react.useState('checking')
    react.useEffect(() => {
      let alive = true
      const tick = async () => {
        try {
          const r = await fetch('/dsh-alive/ping', { cache: 'no-store' })
          if (alive) setStatus(r.ok ? 'online' : 'offline')
        } catch (e) {
          if (alive) setStatus('offline')
        }
      }
      tick()
      const timer = setInterval(tick, PING_INTERVAL)
      return () => { alive = false; clearInterval(timer) }
    }, [])
```

</details>

**依据 3 · 源码核查**：[client/client.js:39-43](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L39-L43)

展示标题。

```text
    const map = { online: '在线', offline: '离线', checking: '检测中…' }
    return react.createElement('span', { style: st.wrap, title: 'DeepSeek 服务状态（每 15 秒自动检测，不消耗 token）' },
      react.createElement('span', { style: { ...st.dot, ...st[status] } }),
      ' ' + (map[status] || ''),
    )
```

**依据 4 · 作者声明**：[README.md:11-21](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/README.md#L11-L21)

作者在线/立刻表述。

<details>
<summary>查看原文（11行）</summary>

```text
在会话窗口右上角常驻显示 **● 在线 / ● 离线** 状态点，每 15 秒自动检测一次。**完全不调用 LLM，零 token 消耗**——只是浏览器对本地服务做一次进程内的 HTTP 心跳。

An always-visible **● Online / ● Offline** indicator in the conversation header, auto-refreshed every 15 seconds. It costs **zero tokens** — the browser simply polls a process-local HTTP endpoint.

## 功能 / Features

- ✅ 会话头部右上角常驻状态点（绿色 = 在线，红色 = 离线，黄色 = 检测中）
- ✅ 每 15 秒自动检测，无需手动刷新
- ✅ **零 token 消耗**：纯进程内 ping，不调用任何 LLM
- ✅ 开箱即用，无需任何配置
- ✅ 服务挂了立刻变红点，恢复后自动变回绿点
```

</details>

#### 缺口

- 未运行断网/上游故障场景。
  **影响**：显示延迟和误解程度未实测。
  **进一步探讨**：分别断 Web 进程与模型上游对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件怎样进入宿主且如何清理轮询？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

host half 在 webServer 可用时注册 exact /dsh-alive/ping，client half 通过 slots 注入会话头 utilities 组件。React useEffect 初始触发一次 tick，之后 15 秒 interval，卸载时清 interval 且以 alive 标志避免旧请求更新状态。后端注册未保存或返回 route disposer，也未限制 HTTP method；能否由宿主自动清理取决于 inject 作用域契约，热重载重复路由需验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:4-23](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/dsh/index.js#L4-L23)

后端注入和 route 注册。

<details>
<summary>查看原文（20行）</summary>

```text
export const name = 'dsh-alive'
export const inject = []

export function apply(ctx, config = {}) {
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (scope) => {
      scope.webServer.register({
        kind: 'exact',
        path: '/dsh-alive/ping',
        handler: async (req, res) => {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          })
          res.end(JSON.stringify({ ok: true, ts: Date.now() }))
        },
      })
    })
  }
}
```

</details>

**依据 2 · 源码核查**：[client/client.js:17-30](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L17-L30)

轮询/卸载逻辑。

<details>
<summary>查看原文（14行）</summary>

```text
    react.useEffect(() => {
      let alive = true
      const tick = async () => {
        try {
          const r = await fetch('/dsh-alive/ping', { cache: 'no-store' })
          if (alive) setStatus(r.ok ? 'online' : 'offline')
        } catch (e) {
          if (alive) setStatus('offline')
        }
      }
      tick()
      const timer = setInterval(tick, PING_INTERVAL)
      return () => { alive = false; clearInterval(timer) }
    }, [])
```

</details>

**依据 3 · 源码核查**：[client/client.js:46-54](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L46-L54)

slot 注入。

```text
  function apply(ctx) {
    ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'dsh-alive',
      order: 999,
      label: () => '在线状态',
      locale: NS,
    }, OnlineDot))
  }
```

**依据 4 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/cordis.patch.yml#L1-L4)

bundle 声明。

```text
# dsh-alive: mount the zero-token online status indicator.
- insert:
    - id: dsh-alive
      name: 'dsh-alive'
```

#### 缺口

- 未见宿主 webServer 自动清理契约。
  **影响**：热重载重复 path 行为未知。
  **进一步探讨**：固定宿主下卸载/重载并查路由。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 零 token 与及时性/可靠性有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

请求只打本地 ping，源码没有 LLM 调用，所以该检测本身不产生模型 token；但仍有每浏览器标签每 15 秒一次 HTTP 往返。fetch 无显式超时，若请求悬挂，前端保留旧状态且 interval 可并发发新请求。HTTP 200 但响应体不校验，代理/错误页若仍 2xx 也会显示在线；相反路由消失但 Web 本体正常则显示离线。适合解释为“插件端点可达”而不是端到端健康。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:10-19](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/dsh/index.js#L10-L19)

静态响应。

<details>
<summary>查看原文（10行）</summary>

```text
      scope.webServer.register({
        kind: 'exact',
        path: '/dsh-alive/ping',
        handler: async (req, res) => {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          })
          res.end(JSON.stringify({ ok: true, ts: Date.now() }))
        },
```

</details>

**依据 2 · 源码核查**：[client/client.js:19-29](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L19-L29)

无超时且只查 r.ok。

<details>
<summary>查看原文（11行）</summary>

```text
      const tick = async () => {
        try {
          const r = await fetch('/dsh-alive/ping', { cache: 'no-store' })
          if (alive) setStatus(r.ok ? 'online' : 'offline')
        } catch (e) {
          if (alive) setStatus('offline')
        }
      }
      tick()
      const timer = setInterval(tick, PING_INTERVAL)
      return () => { alive = false; clearInterval(timer) }
```

</details>

**依据 3 · 作者声明**：[README.md:31-39](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/README.md#L31-L39)

作者零 token 机制。

````text
## 工作原理 / How it works

```
浏览器页面 --(每 15s fetch)--> GET /dsh-alive/ping --> dsh 服务进程（直接应答）
                              | 零 LLM 调用，零 token
```

- **后端**：注册一个进程内 HTTP 端点 `GET /dsh-alive/ping`，立即返回 `{"ok":true}`，不经过任何模型。
- **前端**：通过 dsh 的 slot 系统注入一个小组件到 `conversation.session.header.utilities`，用 `setInterval` 每 15 秒轮询一次 ping 端点，根据响应更新状态点。
````

#### 缺口

- 未测请求挂起与多标签页。
  **影响**：旧状态持续时间和 HTTP 开销未知。
  **进一步探讨**：模拟慢请求/2xx 代理页/多标签。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与版本依赖是否适合现行宿主？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package 0.1.2、Node>=18，客户端依赖 DSH slots 的 conversation.session.header.utilities，后端依赖 webServer；包内 compatibility 声明 DSH >=0.1.0-rc.6 <0.2.0，README 也只列旧版本测试。对 0.2.x 不宜从截图或旧声明推断可用。组件和端点简单，但要维护 slot/API 版本与每页轮询。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-41](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/package.json#L1-L41)

版本与依赖。

<details>
<summary>查看原文（41行）</summary>

```text
{
  "name": "dsh-alive",
  "version": "0.1.2",
  "description": "Zero-token online status indicator for the DeepSeek Harness (dsh) web UI. 零 token 在线状态指示器：在会话头部常驻显示 ● 在线 / ● 离线，每 15 秒自动检测一次，不消耗 token。",
  "type": "module",
  "main": "./dsh/index.js",
  "exports": {
    ".": "./dsh/index.js",
    "./client": "./client/client.js",
    "./package.json": "./package.json"
  },
  "files": ["dsh", "client", "cordis.patch.yml"],
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "status",
    "online",
    "health",
    "indicator",
    "heartbeat",
    "在线状态"
  ],
  "license": "MIT",
  "author": "AikenFra",
  "homepage": "https://github.com/AikenFra/dsh-alive#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AikenFra/dsh-alive.git"
  },
  "bugs": {
    "url": "https://github.com/AikenFra/dsh-alive/issues"
  },
  "engines": {
    "node": ">=18"
  },
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "inject": ["@deepseek-ai/dsh-client-ui-conversation"], "platform": "web" },
    "compatibility": {
      "dsh": ">=0.1.0-rc.6 <0.2.0",
```

</details>

**依据 2 · 源码核查**：[package.json:37-49](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/package.json#L37-L49)

兼容范围。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "inject": ["@deepseek-ai/dsh-client-ui-conversation"], "platform": "web" },
    "compatibility": {
      "dsh": ">=0.1.0-rc.6 <0.2.0",
      "dshReleases": {
        "0.1.2-alpha.5": "compatible",
        "0.1.2-rc.1": "compatible",
        "0.1.3-alpha.1": "compatible"
      }
    }
  }
}
```

</details>

**依据 3 · 作者声明**：[README.md:70-74](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/README.md#L70-L74)

作者测试版本。

```text
## 兼容性 / Compatibility

- 测试于 `dsh 0.1.0-rc.6`（`web` profile）
- 依赖 dsh 的 slot 系统（`conversation.session.header.utilities`）与 `webServer` 服务注入，要求 dsh web 客户端框架版本匹配

```

**依据 4 · 源码核查**：[client/client.js:46-54](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L46-L54)

slot 名称。

```text
  function apply(ctx) {
    ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'dsh-alive',
      order: 999,
      label: () => '在线状态',
      locale: NS,
    }, OnlineDot))
  }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 若要采纳，怎样改进健康语义与验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

若只是看本地页面与服务进程是否相通，可在旧版测试 profile 试用并把标签明确写为“本地 DSH 服务可达”；断 Web 进程、禁用路由与断模型上游三种注入故障应显示不同结论。超时控制、响应体校验和多层健康检查可作为未来改进假设，当前未实现；若要验证模型真实可用，必然需要非零网络/可能模型成本。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:10-19](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/dsh/index.js#L10-L19)

当前静态 ping。

<details>
<summary>查看原文（10行）</summary>

```text
      scope.webServer.register({
        kind: 'exact',
        path: '/dsh-alive/ping',
        handler: async (req, res) => {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          })
          res.end(JSON.stringify({ ok: true, ts: Date.now() }))
        },
```

</details>

**依据 2 · 源码核查**：[client/client.js:19-43](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js#L19-L43)

当前二态反馈与标题。

<details>
<summary>查看原文（25行）</summary>

```text
      const tick = async () => {
        try {
          const r = await fetch('/dsh-alive/ping', { cache: 'no-store' })
          if (alive) setStatus(r.ok ? 'online' : 'offline')
        } catch (e) {
          if (alive) setStatus('offline')
        }
      }
      tick()
      const timer = setInterval(tick, PING_INTERVAL)
      return () => { alive = false; clearInterval(timer) }
    }, [])

    const st = {
      wrap: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', padding: '2px 10px', borderRadius: '10px', background: 'rgba(128,128,128,0.14)', cursor: 'default' },
      dot: { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
      online: { background: '#22c55e', boxShadow: '0 0 6px #22c55e88' },
      offline: { background: '#ef4444', boxShadow: '0 0 6px #ef444488' },
      checking: { background: '#f59e0b' },
    }
    const map = { online: '在线', offline: '离线', checking: '检测中…' }
    return react.createElement('span', { style: st.wrap, title: 'DeepSeek 服务状态（每 15 秒自动检测，不消耗 token）' },
      react.createElement('span', { style: { ...st.dot, ...st[status] } }),
      ' ' + (map[status] || ''),
    )
```

</details>

**依据 3 · 源码核查**：[package.json:37-49](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/package.json#L37-L49)

版本界限。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": { "inject": ["@deepseek-ai/dsh-client-ui-conversation"], "platform": "web" },
    "compatibility": {
      "dsh": ">=0.1.0-rc.6 <0.2.0",
      "dshReleases": {
        "0.1.2-alpha.5": "compatible",
        "0.1.2-rc.1": "compatible",
        "0.1.3-alpha.1": "compatible"
      }
    }
  }
}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
