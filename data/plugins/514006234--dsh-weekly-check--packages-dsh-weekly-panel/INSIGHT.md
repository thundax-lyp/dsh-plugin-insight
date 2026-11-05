# DSH 插件周榜面板

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7458be0](https://github.com/514006234/dsh-weekly-check/tree/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/514006234/dsh-weekly-check)
<!-- END META -->

> **功能**：在 DSH 侧栏查看插件周榜、免费模型摘要与推荐，并复制安装命令。

> **亮点**：[Q01](#research-q01) 把排行榜摘要带入宿主并提供复制入口。

> **主要限制**：[Q03](#research-q03) 回环代理不能保证远程访问和榜单实时性。

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
  - [Q01 · 侧栏能替代哪些打开周报的步骤？](#detail-section-11)
  - [Q02 · 上游故障时会显示什么数据？](#detail-section-12)
  - [Q03 · 远程 DSH 访问能复用本机路由吗？](#detail-section-13)
  - [Q04 · 如何先试用而不执行外部命令？](#detail-section-14)
  - [Q05 · 显著显示数据年龄能避免误把旧榜当新榜吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 内查周榜的读者可从侧栏进入。

直接打开网页可看完整榜单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 榜单 | 在 DSH 看摘要 | 依赖上游 |
| 复制 | 取得安装命令 | 安装由用户另行发起 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 插槽 | 必需 | 挂载面板 | 用网页 |
| 固定 Pages | 刷新需要 | 读取 JSON | 旧缓存或错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 进入 | 点侧栏图标 | 核对数据 |
| 退出 | 禁用或开外链 | 不依赖面板 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络开销未知 | 安装耗时未知 | 依赖 Web |
| 持续 | 请求开销未知 | 核对耗时未知 | 缓存可能旧 |
| 恢复 | 重试未知 | 排障未知 | 可直接开网页 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 榜单摘要 | 已注册面板与代理 | 实际节省时间 |

> **思考**：[Q03](#research-q03) 回环代理不能保证远程访问和榜单实时性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把排行榜摘要带入宿主并提供复制入口。

单飞和旧缓存让上游失效有明确可检查分支。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 回环代理不能保证远程访问和榜单实时性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只看摘要和来源，再决定是否复制命令。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅固定子包源码，未运行宿主或站点。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weekly-panel/README.md、packages/dsh-weekly-panel/lib/client.js、packages/dsh-weekly-panel/lib/index.js 及固定范围 inventory；组件：packages/dsh-weekly-panel。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定子包源码，未运行宿主或站点。
- 下一步：对同批读者模拟缓存故障

**分析版本**

- **仓库**：[514006234/dsh-weekly-check](https://github.com/514006234/dsh-weekly-check)
- **版本号**：0.6.0（[固定提交 7458be0](https://github.com/514006234/dsh-weekly-check/tree/7458be01e286763e81b24473e800acc3548ad7be)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 验证明确标记数据年龄是否有帮助。

对同批读者模拟缓存故障

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 863 | 647 | 168 | — |
| .md | source | 1 | 95 | — | — | 1643 |
| .mjs | source | 3 | 1017 | 849 | 86 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/514006234/dsh-weekly-check/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/514006234/dsh-weekly-check/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/514006234/dsh-weekly-check/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查周报数据从来源到侧栏的路径、数据新鲜度及安装行为。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 侧栏能替代哪些打开周报的步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

正在 DSH 找插件的读者可直接看摘要、TOP 10 与外链。安装按钮的作用是复制命令，实际安装仍由人发起。相比另开周报，面板减少一次页面切换，但不能证明榜单代表可用性。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weekly-panel/README.md:11-23](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/README.md#L11-L23)

面板显示和复制行为

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:277-312](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/client.js#L277-L312)

复制及回退

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

#### 缺口

- 未比较查找效率
  **影响**：收益范围不明
  **进一步探讨**：对照打开周报的查找时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 上游故障时会显示什么数据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主缓存 30 分钟，复用正在运行的请求；上游非成功或解析失败可回上次缓存并带 stale 与 ageMs，没有历史才报错。大小限制在读完文本后，限制解析但不是流式内存上限。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:98-127](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/index.js#L98-L127)

缓存、单飞、大小和旧数据

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

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:26-35](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/index.js#L26-L35)

固定上游及时限

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 未运行上游和缓存模拟
  **影响**：无法确认不同故障下界面提示
  **进一步探讨**：测试冷缓存、旧缓存与损坏 JSON

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远程 DSH 访问能复用本机路由吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

路由要求回环对端与回环 Host，并拒绝跨站标志；Origin 未发送时仍可能接受回环 GET，有 Origin 时比较 host。不能用这个路由直接兼容远端浏览器访问，也不能当成账户鉴权。榜单数据来自固定上游，不能证明所列模型可用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:37-65](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/index.js#L37-L65)

回环、来源和方法限制

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

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:105-120](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/index.js#L105-L120)

固定请求及对象校验

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

#### 缺口

- 反代行为和上游条目未验
  **影响**：不能确认远程访问可用
  **进一步探讨**：隔离测试回环和反代拓扑

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何先试用而不执行外部命令？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用兼容 Web profile 访问侧栏，比较面板摘要与原周报。在查看数据前先确认宿主可访问固定 Pages。可只浏览与复制，另行核对包来源；路由或加载不通则使用外链，禁用面板。安装与维护时间未知。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weekly-panel/README.md:25-34](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/README.md#L25-L34)

宿主路由和客户端槽位

<details>
<summary>查看原文（10行）</summary>

````text
## 组成

```
package.json          dsh.bundle.patch + dsh.client（可安装的关键）
cordis.patch.yml      bundle 形态：把自身 insert 成一行
lib/index.js          宿主半：唯一路由 GET /weekly-panel/data（只读、30 分钟内存缓存）
lib/client.js         客户端半：手写 bundle，注册 main（中间整列面板）+ sidebar.panellist（图标行）
tools/gate.mjs        静态门禁 + 宿主半运行时契约（零网络）
tools/render-test.mjs 客户端 UI 自检（假 react + 假 ctx，模拟点击与剪贴板）
README.md             本文件
````

</details>

**依据 2 · 源码核查**：[packages/dsh-weekly-panel/lib/client.js:597-611](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/client.js#L597-L611)

实际注册两个槽位

<details>
<summary>查看原文（15行）</summary>

```text
          return slots.register(
            { name: MAIN_SLOT, key: PANEL_KEY },
            WeeklyPanel,
          );
        });

        // 2) 侧边栏图标行（list 槽；id 必须等于 main 的 key，"Each list id addresses the matching main panel"）
        slots.inject(PANEL_SLOT, function () {
          return slots.register(
            { name: PANEL_SLOT, id: PANEL_KEY, order: PANEL_ORDER, label: ENTRY_LABEL },
            PanelIcon,
          );
        });
      } catch (err) {
        var logger = ctx && ctx.logger;
```

</details>

#### 缺口

- 未安装宿主
  **影响**：兼容性未确认
  **进一步探讨**：对支持槽位的测试 profile 验证进入和退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显著显示数据年龄能避免误把旧榜当新榜吗？

**研究主题**：新假设与验证

#### 完整回答

已有宿主 ageMs 和 stale，试验让卡片标题提示具体数据年龄。对照正常和上游断连时读者对当前榜单的判断；若错误不降或干扰读数就放弃。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weekly-panel/lib/index.js:120-127](https://github.com/514006234/dsh-weekly-check/blob/7458be01e286763e81b24473e800acc3548ad7be/packages/dsh-weekly-panel/lib/index.js#L120-L127)

返回数据年龄和陈旧标志

```text
        cache = { data: body, at: now() }
        return { data: body, cached: false, stale: false, ageMs: 0 }
      } catch (err) {
        // 失败时优先继续用旧缓存（明确标 stale），实在没有才如实报错
        if (cache.data !== null) {
          return { data: cache.data, cached: true, stale: true, ageMs: now() - cache.at, reason: errorText(err) }
        }
        return { data: null, cached: false, stale: false, reason: errorText(err) }
```

#### 缺口

- 没有读者数据
  **影响**：提示收益未知
  **进一步探讨**：对同批读者模拟缓存故障

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
