# DSH Weekly Panel

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[97df76a](https://github.com/514006234/dsh-weekly-check/tree/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/514006234/dsh-weekly-check)
<!-- END META -->

> **功能**：在DSH主面板显示插件周榜、模型可用性与赞助信息。

> **亮点**：[Q02](#research-q02)只读缓存接入与主面板入口是可核查的集成便利，未识别出相对公开周榜本身的新研究能力。

> **主要限制**：[Q01](#research-q01)、[Q03](#research-q03)网页已提供同样内容，缓存陈旧不能当最新；低频用户可能无需额外安装。

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
  - [Q01 · 周榜内嵌面板解决什么重复问题，网页是否已经足够？](#detail-section-11)
  - [Q02 · 客户端和宿主如何取得并展示周榜？](#detail-section-12)
  - [Q03 · 缓存和来源可用性会不会掩盖数据陈旧？](#detail-section-13)
  - [Q04 · 只读是否足以支持低负担采用？](#detail-section-14)
  - [Q05 · 如何判断内嵌入口值得保留而不是多一个维护负担？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是经常查看DSH生态周榜的用户，在宿主内读TOP10、模型可用性与赞助信息。合格结果是读到有更新时间和来源链接的公开榜单，不是装上推荐即获得收益。原办法直接打开GitHub Pages榜单即可，面板只减少切出宿主的操作；对偶尔查看者，浏览器书签通常足够。没有材料证明周榜热度预测插件适用性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 周榜查看 | 浏览TOP10和模型信息 | 依赖公开JSON与宿主槽位 |
| 缓存降级 | 复用成功数据 | 上游失败显示陈旧状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web和slots/webServer | 必需 | 页面与路由 | 面板不可用 |
| GitHub Pages网络 | 首次获取必需 | 公共数据 | 无缓存则显示错误 |
| 本地包分发 | 必需 | private组件接入 | 不能假定npm安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户加载本地组件 | 槽位出现 |
| 2 | 用户打开周榜 | 数据与时间可读 |
| 3 | 核对陈旧标记 | 失败则访问来源网站 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包和宿主资源 | 本地加载 | 时间未知 |
| 持续 | HTTP与内存 | 查看数据日期 | 无模型调用链 |
| 失败恢复 | 重新请求 | 打开原网站 | 无业务状态迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主内读取周榜 | 路由与槽位 | 是否优于书签 |
| 失败展示 | stale和reason | 宿主组合兼容 |

> **思考**：[Q01](#research-q01)、[Q03](#research-q03)网页已提供同样内容，缓存陈旧不能当最新；低频用户可能无需额外安装。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)只读缓存接入与主面板入口是可核查的集成便利，未识别出相对公开周榜本身的新研究能力。

可注入fetch/时钟的store、单飞和陈旧缓存适合复用。读取全文后限长不是流式限流，移植时要保持同源边界和显式陈旧提示。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01)、[Q03](#research-q03)网页已提供同样内容，缓存陈旧不能当最新；低频用户可能无需额外安装。

<a id="detail-section-6"></a>

### 1.5 使用建议

经常查看DSH周榜的本地用户可试用主面板入口。相比浏览器书签它主要省一次切页，榜单筛选质量和节时收益没有独立验证。若很少看榜或面板数据陈旧，就停用并直接打开来源网站。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weekly-panel/README.md、packages/dsh-weekly-panel/package.json、packages/dsh-weekly-panel/lib/index.js、packages/dsh-weekly-panel/lib/client.js 及固定范围 inventory；组件：packages/dsh-weekly-panel。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[514006234/dsh-weekly-check](https://github.com/514006234/dsh-weekly-check)
- **版本号**：0.6.0（[固定提交 97df76a](https://github.com/514006234/dsh-weekly-check/tree/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)以同内容书签为对照检验主动拉取面板的价值，假设未验证。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 863 | 647 | 168 | — |
| .md | source | 1 | 95 | — | — | 1643 |
| .mjs | source | 3 | 1017 | 849 | 86 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/514006234/dsh-weekly-check/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/514006234/dsh-weekly-check/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/514006234/dsh-weekly-check/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH Weekly Panel的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 周榜内嵌面板解决什么重复问题，网页是否已经足够？

**研究主题**：场景与需求、采用判断

#### 完整回答

目标是经常查看DSH生态周榜的用户，在宿主内读TOP10、模型可用性与赞助信息。合格结果是读到有更新时间和来源链接的公开榜单，不是装上推荐即获得收益。原办法直接打开GitHub Pages榜单即可，面板只减少切出宿主的操作；对偶尔查看者，浏览器书签通常足够。没有材料证明周榜热度预测插件适用性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:33-42](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/client.js#L33-L42)

面板、上游网站与TOP10常量明确

<details>
<summary>查看原文（10行）</summary>

```text
    var MAIN_SLOT = 'main';               // 框架 keyed 槽：中间主列（已占用 key 只有 conversation）
    var PANEL_SLOT = 'sidebar.panellist'; // 框架 list 槽：侧边栏全局面板图标行
    var PANEL_KEY = 'dsh-weekly';
    var PANEL_ORDER = 15;                 // 图标行排序（周榜在工作台 20 之前）
    var ENTRY_LABEL = '📊 周榜';           // 图标行显示名
    var DATA_ROUTE = '/weekly-panel/data';
    var SITE_URL = 'https://514006234.github.io/dsh-weekly-check/';
    var SPONSOR_URL = 'https://514006234.github.io/dsh-weekly-check/sponsor/';
    var TOP_N = 10;
    var CLIENT_TTL_MS = 5 * 60 * 1000;    // 客户端内存缓存 5 分钟（服务端另有 30 分钟缓存）
```

</details>

#### 缺口

- 查看频率和用户真实需求强度未量化。
  **影响**：没有用户频繁查看周榜的直接记录，便利需求可能低频。
  **进一步探讨**：让实际读榜用户记录一周查看频率，对照书签完成找插件任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 客户端和宿主如何取得并展示周榜？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

宿主提供GET /weekly-panel/data，只有固定的GitHub Pages JSON出站地址；createStore将30分钟缓存和单飞请求封装为可注入工厂，客户端用main和sidebar.panellist槽挂载。客户端另缓存5分钟，显示TOP10而非执行生态研究。贡献是公开内容在宿主的只读接入及失败降级，不是榜单算法创新。相对浏览器，主要增量为局部便利。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:23-33](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/index.js#L23-L33)

固定上游与只读路由

<details>
<summary>查看原文（11行）</summary>

```text
export const name = 'dsh-weekly-panel'
export const inject = ['webServer']

/** 唯一允许的出站地址（静态门禁 tools/gate.mjs 会逐字核对）。 */
export const UPSTREAM_URL = 'https://514006234.github.io/dsh-weekly-check/latest.json'
/** 内存缓存时长：30 分钟。 */
export const CACHE_TTL_MS = 30 * 60 * 1000
/** 单次上游请求的超时（毫秒）。 */
export const FETCH_TIMEOUT_MS = 10000
/** 本插件唯一的路由。 */
export const ROUTE_DATA = '/weekly-panel/data'
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:85-103](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/index.js#L85-L103)

缓存和单飞

<details>
<summary>查看原文（19行）</summary>

```text
export function createStore(options = {}) {
  const fetchImpl = options.fetchImpl || ((url, init) => fetch(url, init))
  const now = options.now || (() => Date.now())
  const ttlMs = typeof options.ttlMs === 'number' ? options.ttlMs : CACHE_TTL_MS

  let cache = { data: null, at: 0 }
  let inflight = null

  /**
   * 取数据。永不抛异常，返回值描述结果：
   *   { data, cached, stale, ageMs }          —— 成功（可能来自缓存）
   *   { data:null, reason }                   —— 既没有缓存也拿不到
   */
  async function load(force = false) {
    const age = now() - cache.at
    if (!force && cache.data !== null && age < ttlMs) {
      return { data: cache.data, cached: true, stale: false, ageMs: age }
    }
    if (inflight) return inflight
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:31-42](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/client.js#L31-L42)

实际槽位与客户端缓存

<details>
<summary>查看原文（12行）</summary>

```text
     * v0.3.0：抽屉时代结束——sidebar.footer.action 不再注册，
     * 只保留 中间主列面板（main）+ 侧边栏图标行（sidebar.panellist）两扇门。 */
    var MAIN_SLOT = 'main';               // 框架 keyed 槽：中间主列（已占用 key 只有 conversation）
    var PANEL_SLOT = 'sidebar.panellist'; // 框架 list 槽：侧边栏全局面板图标行
    var PANEL_KEY = 'dsh-weekly';
    var PANEL_ORDER = 15;                 // 图标行排序（周榜在工作台 20 之前）
    var ENTRY_LABEL = '📊 周榜';           // 图标行显示名
    var DATA_ROUTE = '/weekly-panel/data';
    var SITE_URL = 'https://514006234.github.io/dsh-weekly-check/';
    var SPONSOR_URL = 'https://514006234.github.io/dsh-weekly-check/sponsor/';
    var TOP_N = 10;
    var CLIENT_TTL_MS = 5 * 60 * 1000;    // 客户端内存缓存 5 分钟（服务端另有 30 分钟缓存）
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缓存和来源可用性会不会掩盖数据陈旧？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

上游失败时返回上一次成功缓存且stale=true，无缓存时返回明确reason，因此界面应把陈旧而非“最新”传给用户。guard限制loopback与同源及GET，但该部署边界也使远程反向代理情境需单独核查。读取完整响应后才比较4MB阈值，只能拒绝超大文本继续解析，不能据此声称有流式内存上限。客户端注释还保留抽屉时代描述，而实际常量和后续注释已改为主面板，应以接线为准。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:37-65](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/index.js#L37-L65)

请求来源和方法边界

<details>
<summary>查看原文（29行）</summary>

```text
/** 仅 loopback + 同源；否则拒绝（DNS rebinding 防护）。 */
function isLoopbackRequest(req, requireOrigin = false) {
  const addr = req.socket && req.socket.remoteAddress
  if (addr !== '127.0.0.1' && addr !== '::1' && addr !== '::ffff:127.0.0.1') return false
  const host = req.headers && req.headers.host
  if (typeof host !== 'string') return false
  let hostUrl
  try { hostUrl = new URL('http://' + host) } catch { return false }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return !requireOrigin
  try { return new URL(origin).host === hostUrl.host } catch { return false }
}

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

function guard(req, res, method) {
  if (!isLoopbackRequest(req)) {
    json(res, 403, { ok: false, code: 'forbidden' })
    return false
  }
  if (req.method !== method) {
    json(res, 405, { ok: false, code: 'method-not-allowed' })
    return false
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:110-127](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/index.js#L110-L127)

响应长度检查与stale fallback

<details>
<summary>查看原文（18行）</summary>

```text
        const res = await fetchImpl(UPSTREAM_URL, {
          method: 'GET',
          headers: { accept: 'application/json' },
          signal: controller ? controller.signal : undefined,
        })
        if (!res || res.ok !== true) throw new Error('上游 HTTP ' + (res && res.status ? res.status : '?'))
        const text = typeof res.text === 'function' ? await res.text() : null
        if (text !== null && text.length > MAX_BYTES_HINT) throw new Error('上游响应过大')
        const body = text !== null ? JSON.parse(text) : await res.json()
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('上游返回的不是 JSON 对象')
        cache = { data: body, at: now() }
        return { data: body, cached: false, stale: false, ageMs: 0 }
      } catch (err) {
        // 失败时优先继续用旧缓存（明确标 stale），实在没有才如实报错
        if (cache.data !== null) {
          return { data: cache.data, cached: true, stale: true, ageMs: now() - cache.at, reason: errorText(err) }
        }
        return { data: null, cached: false, stale: false, reason: errorText(err) }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:29-38](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/client.js#L29-L38)

实际槽位契约

<details>
<summary>查看原文（10行）</summary>

```text
     * 契约区：DSH 版本敏感的东西集中在这里。
     * ===================================================================
     * v0.3.0：抽屉时代结束——sidebar.footer.action 不再注册，
     * 只保留 中间主列面板（main）+ 侧边栏图标行（sidebar.panellist）两扇门。 */
    var MAIN_SLOT = 'main';               // 框架 keyed 槽：中间主列（已占用 key 只有 conversation）
    var PANEL_SLOT = 'sidebar.panellist'; // 框架 list 槽：侧边栏全局面板图标行
    var PANEL_KEY = 'dsh-weekly';
    var PANEL_ORDER = 15;                 // 图标行排序（周榜在工作台 20 之前）
    var ENTRY_LABEL = '📊 周榜';           // 图标行显示名
    var DATA_ROUTE = '/weekly-panel/data';
```

</details>

#### 缺口

- 未核查所有反向代理及宿主槽位版本组合。
  **影响**：特定宿主槽位及代理部署是否兼容未逐项检查，限制适用环境。
  **进一步探讨**：核对目标宿主main/sidebar.panellist注册接口及代理请求头，不将loopback条件外推远程部署。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 只读是否足以支持低负担采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

没有模型调用或本地凭据操作，持续资源是周期HTTP请求与内存缓存；用户仍需从本地私有包路径安装，因为package标private。失败时可直接打开相同公开网站，不存在本面板创建的业务数据迁移，但初次接入和宿主兼容排查并非零时间。对经常追榜的本地DSH用户可试用，对偶尔读榜用户不必为此安装。金额、安装耗时和访问频率没有实测，不虚构节省。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/package.json:1-16](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/package.json#L1-L16)

private与宿主client声明

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-weekly-panel",
  "version": "0.6.0",
  "private": true,
  "description": "把《DSH 插件周榜》搬进侧边栏：只读的周报抽屉（TOP10 / 免费模型可用性 / 赞助位）",
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:98-127](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/index.js#L98-L127)

请求缓存及失败退路

<details>
<summary>查看原文（30行）</summary>

```text
  async function load(force = false) {
    const age = now() - cache.at
    if (!force && cache.data !== null && age < ttlMs) {
      return { data: cache.data, cached: true, stale: false, ageMs: age }
    }
    if (inflight) return inflight

    const task = (async () => {
      let timer = null
      try {
        const controller = typeof AbortController === 'function' ? new AbortController() : null
        if (controller) timer = setTimeout(() => { try { controller.abort() } catch { /* 忽略 */ } }, FETCH_TIMEOUT_MS)
        const res = await fetchImpl(UPSTREAM_URL, {
          method: 'GET',
          headers: { accept: 'application/json' },
          signal: controller ? controller.signal : undefined,
        })
        if (!res || res.ok !== true) throw new Error('上游 HTTP ' + (res && res.status ? res.status : '?'))
        const text = typeof res.text === 'function' ? await res.text() : null
        if (text !== null && text.length > MAX_BYTES_HINT) throw new Error('上游响应过大')
        const body = text !== null ? JSON.parse(text) : await res.json()
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('上游返回的不是 JSON 对象')
        cache = { data: body, at: now() }
        return { data: body, cached: false, stale: false, ageMs: 0 }
      } catch (err) {
        // 失败时优先继续用旧缓存（明确标 stale），实在没有才如实报错
        if (cache.data !== null) {
          return { data: cache.data, cached: true, stale: true, ageMs: now() - cache.at, reason: errorText(err) }
        }
        return { data: null, cached: false, stale: false, reason: errorText(err) }
```

</details>

#### 缺口

- 本地分发是否稳定及安装维护时间未测。
  **影响**：private本地包的安装与升级负担未测，不能声称开箱即用。
  **进一步探讨**：核对维护者提供的本地分发方式，在目标profile记录安装、升级与移除路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何判断内嵌入口值得保留而不是多一个维护负担？

**研究主题**：新假设与验证

#### 完整回答

从“同一份JSON、两个读取入口”推导未验证假设：只在用户主动打开面板时拉取，并保持可见更新时间，可能比常驻推送更符合低频需求。用同一榜单内容对照书签与面板，让用户找一个适用插件，记录访问步骤、陈旧误读和最终选择时间；如果面板没有减少办结时间或增加误读，则不继续扩展。该方向不把Star或赞助位当质量评分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:38-42](https://github.com/514006234/dsh-weekly-check/blob/97df76aaa7fe6d2c9abd4fd9c721e3b4c4ff46fa/packages/dsh-weekly-panel/lib/client.js#L38-L42)

相同来源和缓存使同内容对照可行

```text
    var DATA_ROUTE = '/weekly-panel/data';
    var SITE_URL = 'https://514006234.github.io/dsh-weekly-check/';
    var SPONSOR_URL = 'https://514006234.github.io/dsh-weekly-check/sponsor/';
    var TOP_N = 10;
    var CLIENT_TTL_MS = 5 * 60 * 1000;    // 客户端内存缓存 5 分钟（服务端另有 30 分钟缓存）
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
