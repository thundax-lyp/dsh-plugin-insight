# dsh-weekly-panel

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[5ee6b1d](https://github.com/514006234/dsh-weekly-check/tree/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将外部 DSH 插件周榜代理到 Web 主面板，展示排行、模型与推荐位并复制安装命令。

> **核心亮点**：把外部榜单接入 DSH Web 槽位，提供可复制安装命令和只读数据代理；不是榜单生产者。详见[Q01](#research-q01)。

> **风险与缺陷**：重试无法强制上游刷新且宿主旧值回退被客户端当正常新数据；未经校验 repo 进入粘贴命令、非 reciprocal 一律标赞助。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 周榜插件服务什么用户任务，实际交付到哪里？](#detail-section-11)
  - [Q02 · 请求边界与缓存降级如何工作？](#detail-section-12)
  - [Q03 · “重试强制重取”和旧数据提示是否兑现？](#detail-section-13)
  - [Q04 · 远端数据怎样影响安装命令与赞助标识？](#detail-section-14)
  - [Q05 · 部署、维护与恢复的资源投入是什么？](#detail-section-15)
  - [Q06 · 如何让榜单的“新鲜度”和复制动作可被可靠判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web 内查看插件周榜与免费模型状态，减少切换页面；安装与效率待核。详见[Q01](#research-q01)。

网页原榜单已存在；本项需证明内嵌便捷性大于缓存不透明与输入核对成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| TOP10/免费模型 | 查看周榜 | 上游数据与缓存年龄需核 |
| 重试 | 绕过前端 TTL | 不能强制宿主上游刷新 |
| 安装复制 | 生成命令文本 | 未校验 repo，用户须先核对 |
| 推荐位 | 展示合作条目 | 缺失 kind 默认标赞助 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web webServer/slots | 必需 | 路由与面板 | 无法接入 |
| GitHub Pages latest.json | 当前数据必需 | 榜单来源 | 旧缓存或失败态 |
| 浏览器 fetch/clipboard | 体验必需 | 取数据/复制 | 数据失败或 prompt 降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 部署 | 安装包或 profile 拷贝并重启 | 主面板/侧栏入口出现 |
| 查榜 | 打开侧栏周榜 | 查看时间、TOP10、免费模型 |
| 复制 | 对原生bundle 点“装” | 先核 owner/repo 后粘贴 |
| 故障 | 重试或打开完整榜单 | 注意宿主缓存可能仍为旧值 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web 与上游网络，金额未知 | 安装、重启；耗时未知 | 注册表收录未核 |
| 持续使用 | 上游 GitHub Pages、两级内存缓存 | 判断数据年龄、核对命令 | stale 未向 UI 传达 |
| 失败恢复 | 可显示缓存或错误，损失未知 | 重试、转完整榜单、检查上游 | 重试不能穿透 30 分钟宿主缓存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 榜单内嵌 | 主面板和侧栏代码 | 目标宿主真实布局 |
| 缓存降级 | 宿主 stale 返回 | 用户能否认出旧数据：当前不能 |
| 安装引导 | 复制命令 | repo 输入安全和安装成功率 |

> **思考**：重试无法强制上游刷新且宿主旧值回退被客户端当正常新数据；未经校验 repo 进入粘贴命令、非 reciprocal 一律标赞助。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把外部榜单接入 DSH Web 槽位，提供可复制安装命令和只读数据代理；不是榜单生产者。详见[Q01](#research-q01)。

把外部榜单接入 DSH Web 槽位，提供可复制安装命令和只读数据代理；不是榜单生产者。详见[Q01](#research-q01)。

本地同源防护、单飞和旧缓存可借鉴；需打通缓存元数据与 UI，并校验远端 repo/kind。详见[Q02](#research-q02)及[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

重试无法强制上游刷新且宿主旧值回退被客户端当正常新数据；未经校验 repo 进入粘贴命令、非 reciprocal 一律标赞助。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅作非关键周榜浏览观察；复制安装命令及赞助内容前核原始仓库和数据，关键决策待修正新鲜度提示。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持面板、代理和缓存机制；“强制重取”仅越过前端缓存，stale 旧数据不提示，远端 repo 与赞助 kind 缺校验；目标宿主未运行。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weekly-panel/README.md、packages/dsh-weekly-panel/package.json、packages/dsh-weekly-panel/lib/index.js、packages/dsh-weekly-panel/lib/client.js 及固定范围 inventory；组件：packages/dsh-weekly-panel。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交子包 README、manifest、Host/Client；未执行目标代码、作者测试、宿主或远端实时数据；META 为旧基线。
- 下一步：目标宿主测部署/重启和槽位，缓存 5/30 分钟与上游失败、stale 可见性、repo 特殊字符、赞助 kind 缺失、外链/剪贴板降级。

**分析版本**

- **仓库**：[514006234/dsh-weekly-check](https://github.com/514006234/dsh-weekly-check)
- **版本号**：0.6.0（[固定提交 5ee6b1d](https://github.com/514006234/dsh-weekly-check/tree/5ee6b1d8aa90a1dab83c30db96838482331db304)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是将数据年龄和 stale 显示到面板、明确刷新语义，并限制 repo 与赞助分类输入，以契约矩阵和目标宿主体验验收。详见[Q06](#research-q06)。

目标宿主测部署/重启和槽位，缓存 5/30 分钟与上游失败、stale 可见性、repo 特殊字符、赞助 kind 缺失、外链/剪贴板降级。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 863 | 647 | 168 | — |
| .md | source | 1 | 95 | — | — | 1643 |
| .mjs | source | 3 | 1017 | 849 | 86 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/514006234/dsh-weekly-check/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：周榜集成是否在可控数据边界内提供可信、可恢复的插件发现体验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 周榜插件服务什么用户任务，实际交付到哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它把外部周榜的 TOP10、免费模型统计和推荐位放进 DSH Web 主面板，侧栏图标负责切换，适合已在 DSH 中查找插件的用户。它不是榜单数据生产者；宿主只代理固定 latest.json，客户端只读展示。价值是减少离开 DSH 查榜单的切换，实际节省时间及榜单质量未测。README 称“真实可安装”，但 package private:true，注册表收录仍是申请状态，实际分发可达性须分开验证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weekly-panel/README.md:1-28](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/README.md#L1-L28)

作者列面板、TOP10、一键复制、免费模型和赞助功能

<details>
<summary>查看原文（28行）</summary>

````text
# dsh-weekly-panel

把《DSH 插件周榜》搬进 DSH 侧边栏的**真实可安装 DSH 插件**（本仓库 `packages/` 下的子包）。

在线周报：https://514006234.github.io/dsh-weekly-check/

## 它长什么样

两扇门，都是框架里的**流内布局**——整份 CSS **零处 `position:fixed`**（`tools/gate.mjs` 会逐字核对），所以它不会遮挡对话区：

- **侧边栏图标行**里的 `📊 周榜`（`sidebar.panellist`，`order 15`）——点一下把中间整列切成本面板；图标自带 `active` 高亮
- **中间整列面板**（`main` 槽，`key = dsh-weekly`）

面板内容：

- 摘要：收录项目数 + 更新时间
- **TOP 10**：中文名、`owner/repo`、实时星数（≥1000 显示 `1.2k`）、较上期涨星（涨绿跌橙；**没数据就不显示，而不是显示 0**）
- **一键安装**：形态为 `原生bundle` 的条目带一个「装」按钮，点击把 `dsh plugin add <repo>` 复制进剪贴板；剪贴板不可用时降级为弹窗让你手动复制（不抛异常、不白屏）
- **免费模型**：可用 `x/y`、已下线数、地区墙数（有限流 / 上游波动时一并列出）
- **本期推荐**：仅当 `latest.json` 里有非空 `sponsors` 数组时显示。**付了钱的标「赞助」，免费互推的标「互推」**——没付钱的不写成赞助
- 两个外链：**打开完整榜单**、**商务合作**

拿不到数据时显示中文失败提示（含具体原因）+「重试」按钮，外链按钮仍然保留——**不白屏**。

## 组成

```
package.json          dsh.bundle.patch + dsh.client（可安装的关键）
````

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/package.json:1-21](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/package.json#L1-L21)

私有包与 Web client manifest

<details>
<summary>查看原文（21行）</summary>

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
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": ["slots"]
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:452-513](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L452-L513)

客户端从数据渲染排行、模型和推荐位

<details>
<summary>查看原文（62行）</summary>

```text
      var data = isObject(CACHE.data) ? CACHE.data : null;
      var phase = CACHE.phase;
      var plugins = asList(data && data.plugins);
      var sorted = plugins.slice().sort(function (a, b) { return (numOf(b && b.stars) || 0) - (numOf(a && a.stars) || 0); });
      var top = sorted.slice(0, TOP_N);
      var stat = isObject(data && data.stat) ? data.stat : null;
      var sponsors = asList(data && data.sponsors);

      var body = [];
      if (data === null) {
        if (phase === 'error') {
          body.push(h('div', { className: 'dwp-empty', key: 'fail' },
            h('div', { className: 'dwp-empty-title' }, '暂时拿不到周报数据'),
            CACHE.reason === '' ? null : h('div', { className: 'dwp-empty-reason' }, CACHE.reason),
            h('button', { type: 'button', className: 'dwp-retry', onClick: retry }, '重试'),
          ));
        } else {
          body.push(h('div', { className: 'dwp-empty', key: 'loading' }, '正在读取周报…'));
        }
      } else {
        body.push(h('div', { className: 'dwp-summary', key: 'summary' },
          h('b', null, plugins.length + ' 个插件'),
          h('span', null, '更新 ' + dateOf(data)),
          h('span', null, '·'),
          h('span', null, '只读数据'),
        ));
        if (phase === 'error') {
          body.push(h('div', { className: 'dwp-warn', key: 'warn' },
            '刷新失败，先显示上次数据' + (CACHE.reason === '' ? '' : '（' + CACHE.reason + '）')));
        }
        body.push(h('div', { className: 'dwp-section', key: 'top' },
          h('div', { className: 'dwp-section-title' }, '插件 TOP ' + TOP_N),
          top.length === 0
            ? h('div', { className: 'dwp-empty' }, '本期还没有插件数据')
            : top.map(function (row, index) {
                return h(TopRow, { key: repoOf(row) || nameOf(row), index: index, row: row });
              }),
        ));
        body.push(h('div', { className: 'dwp-section', key: 'models' },
          h('div', { className: 'dwp-section-title' }, '免费模型'),
          stat === null
            ? h('div', { className: 'dwp-empty' }, '免费模型数据暂缺')
            : h('div', { className: 'dwp-models' },
                h('span', { className: 'dwp-chip is-ok' }, '可用 ', h('b', null, (numOf(stat.ok) || 0) + '/' + (numOf(stat.total) || 0))),
                h('span', { className: 'dwp-chip is-warn' }, '已下线 ', h('b', null, String(numOf(stat.gone) || 0))),
                h('span', { className: 'dwp-chip is-warn' }, '地区墙 ', h('b', null, String(numOf(stat.region) || 0))),
                (numOf(stat.limited) || 0) > 0
                  ? h('span', { className: 'dwp-chip' }, '限流 ', h('b', null, String(numOf(stat.limited) || 0)))
                  : null,
                (numOf(stat.flaky) || 0) > 0
                  ? h('span', { className: 'dwp-chip' }, '上游波动 ', h('b', null, String(numOf(stat.flaky) || 0)))
                  : null,
              ),
        ));
        if (sponsors.length > 0) {
          body.push(h('div', { className: 'dwp-section dwp-section-sponsor', key: 'sponsors' },
            h('div', { className: 'dwp-section-title' }, '本期推荐（付费标「赞助」，免费互推标「互推」）'),
            sponsors.map(function (s) {
              return h(SponsorCard, { key: repoOf(s) || nameOf(s), sponsor: s });
            }),
          ));
        }
```

</details>

#### 缺口

- 目标 DSH 安装和真实用户查找效率未测
  **影响**：不能证明安装普适可用或效率收益
  **进一步探讨**：目标宿主安装并比较从周榜查到目标插件的操作时长

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求边界与缓存降级如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主注册 GET /weekly-panel/data，仅接收 loopback 与同源请求；上游固定为一个 GitHub Pages JSON URL。30 分钟内存缓存、并发单飞、10 秒超时、约 4 MiB 文本上限；失败时若有旧缓存返回 stale:true，没缓存返回 ok:false。客户端另有 5 分钟内存 TTL，复用数据。代码机制可核，但本轮未执行作者门禁或目标宿主，不能把门禁说明当独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:26-67](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L26-L67)

固定上游、loopback/同源与方法防护

<details>
<summary>查看原文（42行）</summary>

```text
/** 唯一允许的出站地址（静态门禁 tools/gate.mjs 会逐字核对）。 */
export const UPSTREAM_URL = 'https://514006234.github.io/dsh-weekly-check/latest.json'
/** 内存缓存时长：30 分钟。 */
export const CACHE_TTL_MS = 30 * 60 * 1000
/** 单次上游请求的超时（毫秒）。 */
export const FETCH_TIMEOUT_MS = 10000
/** 本插件唯一的路由。 */
export const ROUTE_DATA = '/weekly-panel/data'

const MAX_BYTES_HINT = 4 * 1024 * 1024

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
  return true
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:85-139](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L85-L139)

缓存、单飞、超时和过大响应处理

<details>
<summary>查看原文（55行）</summary>

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
      } finally {
        if (timer) clearTimeout(timer)
      }
    })()

    inflight = task
    try {
      return await task
    } finally {
      if (inflight === task) inflight = null
    }
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:146-165](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L146-L165)

HTTP 代理与 stale 回退

<details>
<summary>查看原文（20行）</summary>

```text
  async function handleData(request, response) {
    if (!guard(request, response, 'GET')) return
    let result
    try {
      result = await load(false)
    } catch (err) {
      // 双保险：load 内部已经吞过异常，这里再兜一层，确保不会有异常逃到 HTTP 栈
      result = { data: null, reason: errorText(err) }
    }
    if (!result || !result.data) {
      json(response, 200, { ok: false, reason: (result && result.reason) || '上游暂时不可用' })
      return
    }
    json(response, 200, {
      ok: true,
      cached: result.cached === true,
      stale: result.stale === true,
      ageMs: typeof result.ageMs === 'number' ? result.ageMs : 0,
      data: result.data,
    })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:220-265](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L220-L265)

客户端缓存及请求

<details>
<summary>查看原文（46行）</summary>

```text
    function requestData(done, opts) {
      var force = !!(opts && opts.force);
      if (typeof fetch !== 'function') {
        CACHE = { phase: 'error', data: CACHE.data, reason: '当前环境不支持 fetch', at: CACHE.at };
        if (typeof done === 'function') done();
        return;
      }
      if (INFLIGHT) return;
      if (!force && CACHE.phase === 'ok' && (Date.now() - CACHE.at) < CLIENT_TTL_MS) return;

      INFLIGHT = true;
      CACHE = { phase: 'loading', data: CACHE.data, reason: '', at: CACHE.at };

      var finish = function () {
        INFLIGHT = false;
        if (typeof done === 'function') done();
      };

      try {
        fetch(DATA_ROUTE, { credentials: 'same-origin', headers: { accept: 'application/json' } })
          .then(function (res) {
            if (!res || res.ok !== true || typeof res.json !== 'function') {
              throw new Error('宿主半返回 HTTP ' + (res && res.status ? res.status : '?'));
            }
            return res.json();
          })
          .then(function (body) {
            if (body && body.ok === true && isObject(body.data)) {
              CACHE = { phase: 'ok', data: body.data, reason: '', at: Date.now() };
              return;
            }
            CACHE = { phase: 'error', data: CACHE.data, reason: textOf2(body && body.reason, '宿主半没有返回可用数据'), at: CACHE.at };
          })
          .catch(function (err) {
            CACHE = {
              phase: 'error',
              data: CACHE.data,
              reason: err && err.message ? String(err.message) : '请求失败',
              at: CACHE.at,
            };
          })
          .then(finish, finish);
      } catch (err) {
        CACHE = { phase: 'error', data: CACHE.data, reason: err && err.message ? String(err.message) : '请求失败', at: CACHE.at };
        finish();
      }
```

</details>

**依据 5 · 作者声明**：[packages/dsh-weekly-panel/README.md:51-63](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/README.md#L51-L63)

作者说明数据链路与边界

<details>
<summary>查看原文（13行）</summary>

```text
- **唯一出站地址**就是 `UPSTREAM_URL` 这一个 https 常量（门禁会把文件里所有 URL 字面量列出来比对），不转发任何请求参数或请求头
- 不写任何文件、不读任何本地文件、不读环境变量、不接触任何凭据
- 上游失败时：有旧缓存就继续返回旧数据并标 `stale:true`；连旧缓存都没有才返回 `{ok:false, reason}`
- `handleData` 吞掉所有异常：任何情况下都以 JSON 答复，**绝不把异常抛进 HTTP 栈**

## 装法（两种，如实说明）

1. **从插件注册表装**（推荐）：本项目已向上游 `awesome-dsh-plugin` 提交收录申请，
   收录后可以在 DSH 界面内的插件市场里搜索安装。
2. **手动部署本机 profile**：`node tools/deploy-panel.mjs --pkg dsh-weekly-panel`
   （备份 → 拷贝真实目录 → 追加 `dsh.profile.bundles` → 校验 JSON 无 BOM → 出错自动回滚；
   撤销用 `--uninstall`）。

```

</details>

#### 缺口

- 目标宿主防护、重绑边界和网络故障未实测
  **影响**：只能确认源码意图，不能承诺生产安全
  **进一步探讨**：在隔离目标宿主测 Host/Origin/方法矩阵、超时及缓存

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “重试强制重取”和旧数据提示是否兑现？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

两处契约有落差。重试只把客户端 requestData 的 force 设为 true，使其绕过 5 分钟前端缓存；宿主 handleData 固定调用 load(false)，30 分钟内仍直接给宿主缓存，所以不能保证强制重取上游。宿主 stale:true 传给客户端后，客户端只查 ok 与 data，直接将 phase 置 ok；其“刷新失败、先显示上次数据”警告只在客户端请求本身失败时出现，上游失败而宿主给旧值时不会出现。用户可能误把旧周榜当新数据。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weekly-panel/README.md:73-77](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/README.md#L73-L77)

作者写重试可强制重取

````text

## 测试

```bash
node tools/gate.mjs          # 静态门禁 28 项 + 宿主半运行时契约（零网络，假 fetch/假 req/res）
````

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:220-249](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L220-L249)

force 仅绕过客户端缓存且丢弃 stale

<details>
<summary>查看原文（30行）</summary>

```text
    function requestData(done, opts) {
      var force = !!(opts && opts.force);
      if (typeof fetch !== 'function') {
        CACHE = { phase: 'error', data: CACHE.data, reason: '当前环境不支持 fetch', at: CACHE.at };
        if (typeof done === 'function') done();
        return;
      }
      if (INFLIGHT) return;
      if (!force && CACHE.phase === 'ok' && (Date.now() - CACHE.at) < CLIENT_TTL_MS) return;

      INFLIGHT = true;
      CACHE = { phase: 'loading', data: CACHE.data, reason: '', at: CACHE.at };

      var finish = function () {
        INFLIGHT = false;
        if (typeof done === 'function') done();
      };

      try {
        fetch(DATA_ROUTE, { credentials: 'same-origin', headers: { accept: 'application/json' } })
          .then(function (res) {
            if (!res || res.ok !== true || typeof res.json !== 'function') {
              throw new Error('宿主半返回 HTTP ' + (res && res.status ? res.status : '?'));
            }
            return res.json();
          })
          .then(function (body) {
            if (body && body.ok === true && isObject(body.data)) {
              CACHE = { phase: 'ok', data: body.data, reason: '', at: Date.now() };
              return;
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:442-450](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L442-L450)

重试按钮传前端 force

```text
      /** 按 TTL 校验一次：没过期就不发请求（反复挂载不会反复打宿主半路由）。 */
      function refresh() {
        requestData(afterLoad);
      }

      /** 强制重取：只给「重试」按钮用。 */
      function retry() {
        requestData(afterLoad, { force: true });
      }
```

**依据 4 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:102-107](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L102-L107)

宿主缓存命中直接返回

```text
    }
    if (inflight) return inflight

    const task = (async () => {
      let timer = null
      try {
```

**依据 5 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:146-165](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L146-L165)

handleData 固定 load(false) 且返回 stale

<details>
<summary>查看原文（20行）</summary>

```text
  async function handleData(request, response) {
    if (!guard(request, response, 'GET')) return
    let result
    try {
      result = await load(false)
    } catch (err) {
      // 双保险：load 内部已经吞过异常，这里再兜一层，确保不会有异常逃到 HTTP 栈
      result = { data: null, reason: errorText(err) }
    }
    if (!result || !result.data) {
      json(response, 200, { ok: false, reason: (result && result.reason) || '上游暂时不可用' })
      return
    }
    json(response, 200, {
      ok: true,
      cached: result.cached === true,
      stale: result.stale === true,
      ageMs: typeof result.ageMs === 'number' ? result.ageMs : 0,
      data: result.data,
    })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:471-481](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L471-L481)

警告只认本地 phase error

<details>
<summary>查看原文（11行）</summary>

```text
      } else {
        body.push(h('div', { className: 'dwp-summary', key: 'summary' },
          h('b', null, plugins.length + ' 个插件'),
          h('span', null, '更新 ' + dateOf(data)),
          h('span', null, '·'),
          h('span', null, '只读数据'),
        ));
        if (phase === 'error') {
          body.push(h('div', { className: 'dwp-warn', key: 'warn' },
            '刷新失败，先显示上次数据' + (CACHE.reason === '' ? '' : '（' + CACHE.reason + '）')));
        }
```

</details>

#### 缺口

- 未实测用户误判频率与周榜更新窗口
  **影响**：不能量化错误决策成本
  **进一步探讨**：用假时钟和目标 UI 验证 5/30 分钟及 stale 可见性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远端数据怎样影响安装命令与赞助标识？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

上游 JSON 是可变的外部输入。TopRow 仅要求 repo 非空且 kind 为原生bundle，就把未经 owner/repo 格式校验的 repo 串拼到 dsh plugin add 命令并复制/提示用户粘贴终端；没有自动执行，但若上游字段含 shell 特殊字符，粘贴命令可产生意外效果，故应验证格式并做命令安全呈现。SponsorCard 仅将 kind===reciprocal 标互推，其余任何值含缺失都标赞助；“没付钱不写成赞助”依赖上游数据正确并未被客户端校验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:277-315](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L277-L315)

原样拼接并复制安装命令，无自动执行

<details>
<summary>查看原文（39行）</summary>

```text
    function copyInstall(repo, ev) {
      var cmd = 'dsh plugin add ' + repo;
      var btn = ev && ev.currentTarget ? ev.currentTarget : null;
      function done() {
        if (!btn) return;
        var old = btn.textContent;
        btn.textContent = '已复制';
        btn.classList.add('is-done');
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove('is-done');
        }, 1500);
      }
      function fallback() {
        try { window.prompt('复制下面的命令，粘到终端执行：', cmd); } catch (err) { /* 连 prompt 都没有就算了 */ }
      }
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cmd).then(done, fallback);
          return;
        }
        if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
          var ta = document.createElement('textarea');
          ta.value = cmd;
          ta.setAttribute('readonly', '');
          ta.style.width = '1px';
          ta.style.height = '1px';
          ta.style.opacity = '0';
          ta.style.border = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done();
          return;
        }
        fallback();
      } catch (err) { fallback(); }
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:317-346](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L317-L346)

repo 非空与原生bundle 即给安装按钮

<details>
<summary>查看原文（30行）</summary>

```text
    function TopRow(props) {
      var row = props.row;
      var repo = repoOf(row);
      var delta = deltaOf(row);
      var installable = repo !== '' && textOf2(row && row.kind, '') === '原生bundle';
      return h('div', { className: 'dwp-row' },
        h('span', { className: 'dwp-rank' }, String(props.index + 1)),
        h('span', { className: 'dwp-row-main' },
          h('span', { className: 'dwp-name', title: nameOf(row) }, nameOf(row)),
          repo === ''
            ? null
            : h('a', {
                className: 'dwp-repo',
                href: githubUrl(repo),
                target: '_blank',
                rel: 'noopener noreferrer',
                title: githubUrl(repo),
              }, repo),
        ),
        h('span', { className: 'dwp-row-side' },
          h('span', { className: 'dwp-star' }, starText(row && row.stars)),
          delta === null || delta === 0 ? null : h('span', { className: deltaClass(delta) }, deltaText(delta)),
        ),
        installable
          ? h('button', {
              type: 'button',
              className: 'dwp-install',
              title: '复制安装命令：dsh plugin add ' + repo,
              onClick: function (ev) { copyInstall(repo, ev); },
            }, '装')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:351-365](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L351-L365)

非 reciprocal 统一标赞助

<details>
<summary>查看原文（15行）</summary>

```text
    function SponsorCard(props) {
      var s = props.sponsor;
      var repo = repoOf(s);
      var cn = textOf2(s && s.cn, '');
      var tier = textOf2(s && s.tier, '');
      // 付费的写「赞助」，免费互推的写「互推」——商务页上公开承诺过「没付钱就不会写成赞助」。
      // 这跟榜单排序一样属于对外承诺，不是排版细节。
      var recip = textOf2(s && s.kind, '') === 'reciprocal';
      return h('div', { className: 'dwp-sponsor' },
        h('div', { className: 'dwp-sponsor-top' },
          h('span', { className: 'dwp-sponsor-badge' + (recip ? ' is-recip' : '') }, recip ? '互推' : '赞助'),
          h('span', { className: 'dwp-sponsor-name' }, nameOf(s)),
          repo === ''
            ? null
            : h('a', { className: 'dwp-repo', href: githubUrl(repo), target: '_blank', rel: 'noopener noreferrer', title: githubUrl(repo) }, repo),
```

</details>

**依据 4 · 作者声明**：[packages/dsh-weekly-panel/README.md:16-22](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/README.md#L16-L22)

作者给出安装和赞助承诺

```text
- 摘要：收录项目数 + 更新时间
- **TOP 10**：中文名、`owner/repo`、实时星数（≥1000 显示 `1.2k`）、较上期涨星（涨绿跌橙；**没数据就不显示，而不是显示 0**）
- **一键安装**：形态为 `原生bundle` 的条目带一个「装」按钮，点击把 `dsh plugin add <repo>` 复制进剪贴板；剪贴板不可用时降级为弹窗让你手动复制（不抛异常、不白屏）
- **免费模型**：可用 `x/y`、已下线数、地区墙数（有限流 / 上游波动时一并列出）
- **本期推荐**：仅当 `latest.json` 里有非空 `sponsors` 数组时显示。**付了钱的标「赞助」，免费互推的标「互推」**——没付钱的不写成赞助
- 两个外链：**打开完整榜单**、**商务合作**

```

#### 缺口

- 当前 latest.json 的治理与恶意输入防护未查
  **影响**：不能声称已出现攻击或错误赞助
  **进一步探讨**：用负例测试 repo 字符与 kind 缺失并加 allowlist/schema

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署、维护与恢复的资源投入是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

运行依赖 DSH Web 的 webServer、slots 和浏览器 fetch；上游 GitHub Pages 是持续可用性依赖。README 给注册表安装愿景和本机 profile 拷贝部署路径，并明确需重启 DSH；插件 package 标 private，市场可达性尚未证实。现金价格不明；主要成本是部署/升级、外部数据不可用时检查缓存年龄以及错误命令/赞助数据的人工核对。故目前适合非关键的榜单浏览试用，榜单决策或复制命令前应核官方仓库。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/package.json:1-28](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/package.json#L1-L28)

private 包、Web 注入和测试脚本

<details>
<summary>查看原文（28行）</summary>

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
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": ["slots"]
    }
  },
  "scripts": {
    "gate": "node tools/gate.mjs",
    "render-test": "node tools/render-test.mjs",
    "readme-check": "node tools/readme-check.mjs",
    "test": "node tools/gate.mjs && node tools/render-test.mjs",
```

</details>

**依据 2 · 作者声明**：[packages/dsh-weekly-panel/README.md:65-83](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/README.md#L65-L83)

作者描述注册表申请、手动部署、重启和限制

<details>
<summary>查看原文（19行）</summary>

````text

**任何界面改动都必须完全重启 DSH**——客户端 bundle 是在启动时快照的，不重启就一定看不到。

已知限制：

- 面板只读：不写文件、不读本地文件；数据是 30 分钟粒度的（上游周报每周一更新），面板不做实时刷新，点「重试」可强制重取
- 外链用 `<a target="_blank">`，能否新开标签取决于宿主 webview 的弹窗策略；被挡住时链接地址也写在 `title` 里可复制
- 一键安装只对 `原生bundle` 形态显示——外部应用 / Skill 给了命令也跑不通，所以不给

## 测试

```bash
node tools/gate.mjs          # 静态门禁 28 项 + 宿主半运行时契约（零网络，假 fetch/假 req/res）
node tools/render-test.mjs   # 客户端 UI 自检 78 项（假 react + 假 ctx，模拟点击/剪贴板/降级）
npm test                     # 两个都跑
npm run check                # 语法检查
```

两个脚本**全绿退出 0，有失败退出非 0**。
````

</details>

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:173-222](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L173-L222)

webServer 注册与注入兜底

<details>
<summary>查看原文（50行）</summary>

```text
  }
}

const defaultStore = createStore()

/** 默认实例的 HTTP 入口（供测试与 apply 复用）。 */
export const handleData = defaultStore.handleData
/** 看默认实例的缓存内容（测试用）。 */
export const peekCache = defaultStore.peekCache
/** 清默认实例的缓存（测试用）。 */
export const clearCache = defaultStore.clearCache

function warn(ctx, err) {
  const logger = ctx && ctx.logger
  const sink = (logger && (logger.warn || logger.info)) || (typeof console !== 'undefined' ? console.warn : null)
  if (!sink) return
  try { sink.call(logger || console, '[dsh-weekly-panel] ' + errorText(err)) } catch { /* 日志失败也不能影响加载 */ }
}

/**
 * 注册路由。优先直接用已在位的 webServer；不在位则用 ctx.inject 等它出现。
 * 注册失败不抛异常——插件加载不能因为一个只读面板而中断。
 */
export function apply(ctx) {
  const store = createStore()
  const route = {
    kind: 'exact',
    path: ROUTE_DATA,
    handler: (req, res) => { store.handleData(req, res) },
  }

  let server = null
  try { server = ctx && ctx.webServer ? ctx.webServer : null } catch { server = null }

  if (server && typeof server.register === 'function') {
    try {
      if (typeof ctx.effect === 'function') {
        ctx.effect(() => {
          const dispose = server.register(route)
          return () => { try { if (typeof dispose === 'function') dispose() } catch { /* 忽略 */ } }
        }, 'dsh-weekly-panel: GET ' + ROUTE_DATA)
      } else {
        server.register(route)
      }
      return
    } catch (err) {
      warn(ctx, err)
    }
  }

```

</details>

**依据 4 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:238-265](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L238-L265)

前端依赖代理路由

<details>
<summary>查看原文（28行）</summary>

```text
      try {
        fetch(DATA_ROUTE, { credentials: 'same-origin', headers: { accept: 'application/json' } })
          .then(function (res) {
            if (!res || res.ok !== true || typeof res.json !== 'function') {
              throw new Error('宿主半返回 HTTP ' + (res && res.status ? res.status : '?'));
            }
            return res.json();
          })
          .then(function (body) {
            if (body && body.ok === true && isObject(body.data)) {
              CACHE = { phase: 'ok', data: body.data, reason: '', at: Date.now() };
              return;
            }
            CACHE = { phase: 'error', data: CACHE.data, reason: textOf2(body && body.reason, '宿主半没有返回可用数据'), at: CACHE.at };
          })
          .catch(function (err) {
            CACHE = {
              phase: 'error',
              data: CACHE.data,
              reason: err && err.message ? String(err.message) : '请求失败',
              at: CACHE.at,
            };
          })
          .then(finish, finish);
      } catch (err) {
        CACHE = { phase: 'error', data: CACHE.data, reason: err && err.message ? String(err.message) : '请求失败', at: CACHE.at };
        finish();
      }
```

</details>

#### 缺口

- 当前注册表收录、价格和宿主兼容性未核
  **影响**：不能给安装承诺或实际维护时长
  **进一步探讨**：在目标 DSH 与注册表核安装、升级/卸载及断网恢复

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何让榜单的“新鲜度”和复制动作可被可靠判断？

**研究主题**：新假设与验证、采用判断

#### 完整回答

改进假设是把宿主 cached/stale/ageMs 贯通到面板，显示实际数据年龄和上游失败原因；“重试”需把经过防护的显式刷新信号传宿主或清楚改名为“重读本地缓存”。对 repo 先限制 owner/repo 字符集，命令用显式引用并让用户确认；推荐位的 kind 缺失要显示未分类而非赞助。以缓存时钟矩阵、恶意 repo 样例、缺失 kind 样例、真实宿主安装与用户可理解性作为验收。以上是未实现设想，不计入当前功能。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:146-165](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js#L146-L165)

已有 stale/ageMs 响应字段

<details>
<summary>查看原文（20行）</summary>

```text
  async function handleData(request, response) {
    if (!guard(request, response, 'GET')) return
    let result
    try {
      result = await load(false)
    } catch (err) {
      // 双保险：load 内部已经吞过异常，这里再兜一层，确保不会有异常逃到 HTTP 栈
      result = { data: null, reason: errorText(err) }
    }
    if (!result || !result.data) {
      json(response, 200, { ok: false, reason: (result && result.reason) || '上游暂时不可用' })
      return
    }
    json(response, 200, {
      ok: true,
      cached: result.cached === true,
      stale: result.stale === true,
      ageMs: typeof result.ageMs === 'number' ? result.ageMs : 0,
      data: result.data,
    })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:246-249](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L246-L249)

前端当前丢弃 stale/ageMs

```text
          .then(function (body) {
            if (body && body.ok === true && isObject(body.data)) {
              CACHE = { phase: 'ok', data: body.data, reason: '', at: Date.now() };
              return;
```

**依据 3 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:277-279](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L277-L279)

命令拼接点

```text
    function copyInstall(repo, ev) {
      var cmd = 'dsh plugin add ' + repo;
      var btn = ev && ev.currentTarget ? ev.currentTarget : null;
```

**依据 4 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:358-362](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js#L358-L362)

赞助默认分支

```text
      var recip = textOf2(s && s.kind, '') === 'reciprocal';
      return h('div', { className: 'dwp-sponsor' },
        h('div', { className: 'dwp-sponsor-top' },
          h('span', { className: 'dwp-sponsor-badge' + (recip ? ' is-recip' : '') }, recip ? '互推' : '赞助'),
          h('span', { className: 'dwp-sponsor-name' }, nameOf(s)),
```

#### 缺口

- 替代设计未实现或测试
  **影响**：不能据此提高当前评分
  **进一步探讨**：小范围原型及契约测试后复评

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
