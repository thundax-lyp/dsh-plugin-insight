# dsh-builtin-browser

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3698c76](https://github.com/wqty123/dsh-browser/tree/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54)

<!-- BEGIN META -->
[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wqty123/dsh-browser) [![npm 30d 30,360](https://img.shields.io/static/v1?label=npm+30d&message=30%2C360&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-builtin-browser) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-builtin-browser)
<!-- END META -->

> **功能**：在 DSH 中为模型提供浏览器导航、页面操作和可选远程观看。

> **亮点**：[Q01](#research-q01) 将浏览器动作纳入任务会话与宿主工具。

> **主要限制**：[Q02](#research-q02) 只读画面仍可含敏感数据，需验证身份和会话边界。

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
  - [Q01 · Agent 怎样连接浏览器？](#detail-section-11)
  - [Q02 · 远程观看与浏览器操作权限是什么关系？](#detail-section-12)
  - [Q03 · 如何试用并退出？](#detail-section-13)
  - [Q04 · 怎样减少误开预览？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需让 DSH Agent 操作浏览器并由人随时接手的开发者。

手工打开浏览器，复制页面数据并执行交互。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 浏览工具 | 在任务中导航或操作页面 | 需载体与权限 |
| 远程预览 | 查看被动画面 | 默认关闭且可能含登录数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 加载浏览器服务和工具 | 回到人工浏览 |
| 可用载体 | 必需 | 打开和操作网页 | 检查桥与运行时 |
| 远程观看开关 | 仅预览需要 | 允许返回帧 | 关闭保持只读端点不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离 profile 并关闭远程观看 | 选择无登录页面 |
| 核对 | 操作者验证任务会话和载体 | 记录浏览器和日志 |
| 退出 | 用户关闭测试并检查进程 | 按需移除插件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时和磁盘资源未知 | 准备载体与配置 | 未实测 |
| 持续 | 浏览进程与预览带宽 | 核对登录和权限 | 取决于载体 |
| 恢复 | 重新准备资源未知 | 关闭标签和进程 | 需要读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 浏览 | 工具和任务会话接线 | 实际网页兼容 |
| 预览 | 按会话返回被动帧 | 跨用户边界 |

> **思考**：[Q02](#research-q02) 只读画面仍可含敏感数据，需验证身份和会话边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将浏览器动作纳入任务会话与宿主工具。

[Q01](#research-q01) 根模块发现和浏览器服务装配分工明确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 只读画面仍可含敏感数据，需验证身份和会话边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从无登录页面开始。若要开远程观看，先核对 [Q02](#research-q02) 的权限和身份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持主要装配和预览路径，未运行宿主或载体。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/browser-electron/preview-route.js、lib/tool-browser/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件的组合、工具及远程预览代表源码，未执行目标。
- 下一步：隔离验证任务浏览器、权限、远程帧和退出。

**分析版本**

- **仓库**：[wqty123/dsh-browser](https://github.com/wqty123/dsh-browser)
- **版本号**：0.5.6（[固定提交 3698c76](https://github.com/wqty123/dsh-browser/tree/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 限定共享会话并验证是否减少误开。

隔离验证任务浏览器、权限、远程帧和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 3566 | — | — | 77006 |
| .js | source | 32 | 16520 | 10828 | 5693 | — |
| .mjs | source | 10 | 2312 | 1581 | 597 | — |
| .ts | source | 30 | 16193 | 9511 | 6083 | — |
| .mjs | test | 78 | 11638 | 8480 | 2310 | — |
| .mjs | example | 3 | 272 | 187 | 73 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/wqty123/dsh-browser/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器工具怎样连接载体并划定远程观看边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Agent 怎样连接浏览器？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在 DSH 操作网页的用户可让 Agent 使用浏览工具，并在支持的载体上查看或接手。bundle 分别挂载浏览器服务、Electron 提供方及模型工具；根条目提供客户端模块发现。工具按任务取得会话并把生命周期与 Agent 关联。作者区分桌面侧栏、自托管窗口和系统浏览器。相对手工往返浏览器，宿主能将导航与读取变为工具调用。不同载体的登录和标签隔离不能从统一工具接口直接推定。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:24-43](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/cordis.patch.yml#L24-L43)

实际挂载结构

<details>
<summary>查看原文（20行）</summary>

```text
- insert:
    # Root row. The host's client-module scan resolves a loader row's specifier
    # to a PACKAGE ROOT; a row named after a subpath is skipped, and this package
    # would then have no row to read its `dsh.client` declaration from — the
    # browser would work while its settings panel never appeared. This row is
    # inert (see src/index.ts) and exists only to name the package.
    - id: dsh-builtin-browser
      name: dsh-builtin-browser

    - id: browser
      name: dsh-builtin-browser/browser

    - id: browser-electron
      name: dsh-builtin-browser/browser-electron
      config:
        viewHost: !!js ctx.get('electronViewHost')

    - id: tool-browser
      name: dsh-builtin-browser/tool-browser
      # The tool layer's own switches. The `config` key is what makes them reachable at all:
```

</details>

**依据 2 · 源码核查**：[lib/tool-browser/index.js:166-213](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/lib/tool-browser/index.js#L166-L213)

任务会话和生命周期

<details>
<summary>查看原文（48行）</summary>

```text
 * carries an agent, the session's lifetime is tied to the agent's scoped
 * context: it closes automatically when the agent (DSH session) is disposed,
 * so sessions and their windows never leak after a task ends.
 * @param browser - the seam service.
 * @param state - the calling context's tool state.
 * @param key - the task key (see {@link taskKey}).
 * @param agent - the calling agent, when any (its ctx owns the session).
 * @returns the task's session id.
 */
async function ensureSession(browser, state, key, agent) {
    const existing = state.sessionsByTask.get(key);
    if (existing !== undefined) {
        // The human closing a browser window ends that session, so a cached id can
        // be stale: never hand a dead session back to a tool call.
        if (browser.exists(existing))
            return existing;
        state.sessionsByTask.delete(key);
    }
    const pending = state.pendingOpens.get(key);
    if (pending !== undefined)
        return pending;
    // The task key rides along as the session label so the window title shows
    // which task's page is currently visible to the human.
    const opening = browser.open(key).then(session => {
        // Tie the session's lifetime to the agent's scoped context FIRST: when
        // the agent (and its DSH session) is disposed, the effect's disposer
        // runs and closes the browser session. Registration happens once per
        // session (only on first open for the key). If the agent is already
        // gone, close the fresh session instead of leaking it.
        state.sessionsByTask.set(key, session);
        state.pendingOpens.delete(key);
        try {
            if (agent?.ctx !== undefined) {
                agent.ctx.effect(() => () => {
                    const current = state.sessionsByTask.get(key);
                    if (current === undefined)
                        return;
                    state.sessionsByTask.delete(key);
                    void browser.close(current).catch(() => { });
                });
            }
            else if (key === 'default') {
                // Agentless / CLI probe: close the session on process exit so the
                // window is not orphaned.
                // One hook for the whole process, not one listener per session: a default session can
                // be created repeatedly (a CLI probe does), and each registration lived for the life of
                // the process — so the listener list grew without bound and Node warned at eleven.
                registerExitCleanup(() => browser.close(session).catch(() => { }));
```

</details>

**依据 3 · 作者声明**：[README.md:64-86](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/README.md#L64-L86)

作者说明载体与工具

<details>
<summary>查看原文（23行）</summary>

```text
## 载体:自动选择,也可指定

| 载体 | 何时使用 |
| --- | --- |
| 桌面侧栏 | 外壳支持可驱动的 `<webview>` 且已装 bridge(默认优先) |
| 自托管窗口 | 侧栏不可用或未装 bridge;Web 端总是这一种 |
| 本机 Chrome / Edge | 设置里显式指定 |

侧栏原本有两种"要人先动手"的情况——列没打开、会话不在前台。0.5.2 起都由插件自己处理:没有展开就展开,会话不在前台就请求外壳显示它。取舍与边界见[已知限制](docs/limitations.md)。

## 工具(`dsh_browser_*`,35 个)

| 组 | 工具 |
| --- | --- |
| 打开与导航 | `open` `back` `forward` `refresh` `list_tabs` `switch_tab` `close_tab` |
| 读页面 | `snapshot` `a11y` `content` `scrape` `screenshot` `challenge` |
| 操作 | `click` `click_sequence` `type` `key` `scroll` `execute` |
| 表单 | `fill` `set_value` `clear` `check` `select` `get_value` |
| 会话 | `session` `reset` `reset_session` `restrict` `auth` |
| 记录 | `history` `visited` `replay` |
| 其它 | `wait` `download` |

参数、输出与示例见[工具参考](docs/tool-reference.md)。
```

</details>

#### 缺口

- 未执行任何载体或跨任务登录测试
  **影响**：无法判断任务隔离及接手体验
  **进一步探讨**：在无登录的隔离环境验证两任务导航和切换

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程观看与浏览器操作权限是什么关系？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

预览帧只接受 GET，检查 sameOrigin 与实时开关，要求已知会话，调用被动截图并返回私有无缓存响应。画面可能含已登录信息，当前 handler 的会话存在校验不能替代部署的用户鉴权或资源所有权。预览开关独立于模型工具限制。工具限制对只读工具和 restrict 有例外，需按实际权限验证页面读取与点击。

#### 证据与依据

**依据 1 · 源码核查**：[lib/browser-electron/preview-route.js:65-95](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/lib/browser-electron/preview-route.js#L65-L95)

预览请求检查及被动截图

<details>
<summary>查看原文（31行）</summary>

```text
export async function handlePreviewFrame(request, response, settings, browser) {
    if (request.method !== 'GET') {
        replyJson(response, 405, { error: 'method-not-allowed' });
        return;
    }
    // The host's own pages only. A live browser frame can contain a CAPTCHA or logged-in content, so
    // the endpoint is not something a cross-origin page may pull even with the switch on.
    if (!sameOrigin(request)) {
        replyJson(response, 403, { error: 'not-same-origin' });
        return;
    }
    // The host's consent, checked per request rather than cached: switching sharing off must take
    // effect on the next frame, not on the next restart.
    if (settings.get().remoteView.enabled !== true) {
        replyJson(response, 403, { error: 'remote-view-disabled' });
        return;
    }
    const url = new URL(request.url ?? '/', 'http://localhost');
    const session = url.searchParams.get('session') ?? '';
    if (session === '') {
        replyJson(response, 400, { error: 'session-required' });
        return;
    }
    // A session the plugin did not hand out is not a session. This is the only identifier a caller
    // may supply; no carrier handle, view id, port or CDP target is accepted anywhere.
    if (!browser.exists(session)) {
        replyJson(response, 404, { error: 'no-such-session' });
        return;
    }
    try {
        const frame = await browser.capturePassive(session);
```

</details>

**依据 2 · 源码核查**：[lib/browser-electron/preview-route.js:109-128](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/lib/browser-electron/preview-route.js#L109-L128)

帧响应及失败

<details>
<summary>查看原文（20行）</summary>

```text
        response.writeHead(200, {
            'content-type': mime,
            'content-length': bytes.length,
            // A frame is a moment, never a cached answer: replaying the last one would show the viewer a
            // picture that claims to be live.
            'cache-control': 'no-store, private',
            'x-content-type-options': 'nosniff',
            'cross-origin-resource-policy': 'same-origin',
            'x-captured-at': String(Date.now()),
        });
        response.end(bytes);
    }
    catch (error) {
        // BROWSER_PREVIEW_UNAVAILABLE is the expected "cannot draw this right now" (hidden or minimized
        // window, capture timeout). Anything else is still a refusal to serve an image, and the viewer
        // treats both the same way: show paused, do not retry in a tight loop.
        const code = error?.code;
        replyJson(response, 503, {
            error: code === 'BROWSER_PREVIEW_UNAVAILABLE' ? 'preview-unavailable' : 'capture-failed',
            retryable: true,
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:43-62](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/cordis.patch.yml#L43-L62)

部署限制的例外

<details>
<summary>查看原文（20行）</summary>

```text
      # The tool layer's own switches. The `config` key is what makes them reachable at all:
      # without it nothing at the plugin level could set them, so the operator allow-list the
      # READMEs describe was unreachable in every factory deployment.
      #
      # Every field is optional, so an empty mapping uses the defaults:
      #
      #   allowedActions: operator-level allow-list of browser tool names, applied to every
      #     task in the deployment (a task can still narrow it further with dsh_browser_restrict).
      #     READ_ONLY_TOOLS and dsh_browser_restrict are never blocked, whatever the list says.
      #   timeoutMs: cooperative per-call budget in ms (default 60000).
      #   tabTools: whether the tab-management tools are registered (default true).
      #
      # To restrict a deployment, replace this with, for example:
      #   config:
      #     allowedActions: [dsh_browser_snapshot, dsh_browser_a11y, dsh_browser_content, dsh_browser_click]
      #
      # The settings panel's "What the agent may do" switches are a SEPARATE layer with the
      # same property — the model cannot lift them either — and they need no patch file at
      # all. The list above restricts every task in a deployment; those three switches
      # restrict what any task may do on this installation, and need no YAML.
```

</details>

**依据 4 · 源码核查**：[lib/tool-browser/index.js:63-92](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/lib/tool-browser/index.js#L63-L92)

工具允许判据

<details>
<summary>查看原文（30行）</summary>

```text
export const READ_ONLY_TOOLS = new Set([
    // Tools that only observe.
    'dsh_browser_snapshot', 'dsh_browser_a11y', 'dsh_browser_content', 'dsh_browser_scrape',
    'dsh_browser_screenshot', 'dsh_browser_get_value', 'dsh_browser_wait', 'dsh_browser_challenge',
    'dsh_browser_list_tabs', 'dsh_browser_session', 'dsh_browser_history', 'dsh_browser_visited',
    // dsh_browser_auth reads cookies out of the browser: an observation, and one the
    // credentials switch gates on its own (see credentials.allowRead in the settings).
    // dsh_browser_auth is deliberately NOT here. It reads cookies on "flush" but WRITES them on
    // "restore", to arbitrary domains, which is an action like any other — exempting the tool
    // would let a task that restricted its own actions rewrite the shared browser's logins.
    //
    // Getting out of a bad state, or lifting the restriction itself. Without these a task
    // that restricted everything could neither recover nor be released.
    'dsh_browser_restrict', 'dsh_browser_reset_session', 'dsh_browser_reset',
]);
function assertAllowed(state, toolName, task) {
    // dsh_browser_restrict must stay usable, or a task that restricted everything
    // could never lift it again.
    // An allow-list is a statement about ACTIONS, so it must not take away the ability to
    // look, or to get out of a bad state. The tool description and both READMEs promise
    // that read-only tools are never blocked; before this they were, because only
    // dsh_browser_restrict itself was exempt — a narrow list then locked dsh_browser_history,
    // dsh_browser_reset_session and dsh_browser_auth away with no way back.
    if (READ_ONLY_TOOLS.has(toolName) || toolName === 'dsh_browser_restrict')
        return;
    const config = state.configRestrictedTo;
    if (config !== undefined && !config.includes(toolName)) {
        throw new Error(`browser action "${toolName}" is restricted by the plugin configuration (allow-list: ${config.join(', ')})`);
    }
    const allowed = state.restrictedByTask.get(task);
```

</details>

**依据 5 · 作者声明**：[README.md:90-98](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/README.md#L90-L98)

作者告知预览内容范围

```text
## 远程观看(默认关闭)

从另一台设备用 DSH 时,浏览器在主机屏幕上。主机在设置里打开 `remoteView.enabled` 后,面板给出一个**只读**画面:2 fps、JPEG 质量 70、等比缩放到 1280×720 内、一帧一请求(慢网络自然降速)、不落盘、不进入聊天或模型上下文。不转发点击/键盘/滚轮。

关闭时**不出现浮动入口、也不发任何诊断请求**;在设置页打开「远程观看」开关后,入口**立刻**出现——不需要刷新页面,也不需要快捷键(手机上没有)。

三个端点,仅同源:`GET /dsh-builtin-browser/browser-view/sessions`、`GET …/browser-view/frame?session=…`、`GET /dsh-builtin-browser/bridge-status`。

画面可能包含验证码、账户信息或登录后内容——打开前请确认这是你要看的页面。
```

#### 缺口

- 未核对宿主认证、代理及跨用户请求
  **影响**：无法保证已登录页面不会被不应访问者看到
  **进一步探讨**：用虚拟登录页面对照不同会话、来源和已授权请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

当前包名 dsh-builtin-browser。作者说明桌面和 Web 的安装独立，载体依赖适用桥、本机浏览器或自托管运行时。建议先在独立 profile 保持远程观看关闭，使用无身份信息的页面核对导航及会话关闭。持续成本含运行时资源、准备和排障，远程帧另有带宽。退出后检查标签、进程、profile 和远程开关，版本命令仅按固定说明参考。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-31](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/README.md#L22-L31)

独立安装和更新说明

<details>
<summary>查看原文（10行）</summary>

````text
## 安装

两端是两份独立安装,**更新一端不会带上另一端**。

更新已装版本要两步(DSH 0.2.1-alpha.2 起对已装包再 `add` 会报 `already-installed`):

```sh
dsh plugin --profile <profile> remove dsh-builtin-browser
dsh plugin --profile <profile> add dsh-builtin-browser@0.5.6
```
````

</details>

**依据 2 · 作者声明**：[README.md:64-72](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/README.md#L64-L72)

载体依赖

```text
## 载体:自动选择,也可指定

| 载体 | 何时使用 |
| --- | --- |
| 桌面侧栏 | 外壳支持可驱动的 `<webview>` 且已装 bridge(默认优先) |
| 自托管窗口 | 侧栏不可用或未装 bridge;Web 端总是这一种 |
| 本机 Chrome / Edge | 设置里显式指定 |

侧栏原本有两种"要人先动手"的情况——列没打开、会话不在前台。0.5.2 起都由插件自己处理:没有展开就展开,会话不在前台就请求外壳显示它。取舍与边界见[已知限制](docs/limitations.md)。
```

**依据 3 · 作者声明**：[README.md:119-127](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/README.md#L119-L127)

作者描述运行时准备状态

```text

完整明细(按轮次,含每处修复的原因与证据)见 [CHANGELOG.md](CHANGELOG.md)。

| 版本 | 日期 | 主题 |
| --- | --- | --- |
| **0.5.6** | 2026-11-03 | **「装好即可用」可见、可修**:设置页顶部新增**就绪状态**(当前载体 / 内置运行时 / 桌面桥,按载体给结论,且**已安装与在运行分开**——桌面端没开是最常见的坏状态),`failed` 时给「准备内置浏览器」按钮且**真能重试**(此前的记忆化尝试让失败一次就成了终局);新端点 `runtime-status`(读)与 `runtime-provision`(按写操作准入,立即返回,面板轮询);设置页文案跟随运行时切换语言;修掉 `description` 与桌面桥里 38 处 `閳?`/`鈥?` 乱码 |
| **0.5.5** | 2026-11-03 | **预览是只读的**:取帧不再经 `ensureSidebar`(旧桥会按键+打字),只读 `list`,面板不再被顶到前台;浮标几何、关闭键、层级与 `img[hidden]` 修正(修 #46);**远程观看改为设置里的开关,点了立刻生效**(手机没有快捷键);bridge 修复命令指向包内真实路径(修 #40 第四项)。内容与 0.5.4 相同 |
| **0.5.4** | 2026-11-03 | 与 0.5.5 同内容的另一份发布(npm 上可取到;本仓库没有为它建 release) |
| **0.5.3** | 2026-11-03 | **安装不再依赖网络**:去掉 `postinstall`,Electron 运行时改为首次需要时才准备且永不失败安装(修 #41/#42 的市场安装失败);安装器先验应用身份再动手,校验先于删除(修 #40);观看入口按需挂载、翻译与主题令牌修正 |
```

**依据 4 · 源码核查**：[lib/tool-browser/index.js:190-213](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/lib/tool-browser/index.js#L190-L213)

生命周期接线

<details>
<summary>查看原文（24行）</summary>

```text
        // Tie the session's lifetime to the agent's scoped context FIRST: when
        // the agent (and its DSH session) is disposed, the effect's disposer
        // runs and closes the browser session. Registration happens once per
        // session (only on first open for the key). If the agent is already
        // gone, close the fresh session instead of leaking it.
        state.sessionsByTask.set(key, session);
        state.pendingOpens.delete(key);
        try {
            if (agent?.ctx !== undefined) {
                agent.ctx.effect(() => () => {
                    const current = state.sessionsByTask.get(key);
                    if (current === undefined)
                        return;
                    state.sessionsByTask.delete(key);
                    void browser.close(current).catch(() => { });
                });
            }
            else if (key === 'default') {
                // Agentless / CLI probe: close the session on process exit so the
                // window is not orphaned.
                // One hook for the whole process, not one listener per session: a default session can
                // be created repeatedly (a CLI probe does), and each registration lived for the life of
                // the process — so the listener list grew without bound and Node warned at eleven.
                registerExitCleanup(() => browser.close(session).catch(() => { }));
```

</details>

#### 缺口

- 未安装运行时或验证载体清理
  **影响**：无法量化使用成本和退出残留
  **进一步探讨**：隔离 profile 比较各实际支持载体并核对退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少误开预览？

**研究主题**：新假设与验证

#### 完整回答

在已有全局共享开关之外，可让操作者确认共享的具体任务会话并显示当前被观看状态。用含虚拟登录信息和普通页面的两任务，对照全局与会话选择，测错共享及接手延迟。若误共享不降或妨碍正常操作，撤回。

#### 证据与依据

**依据 1 · 源码核查**：[lib/browser-electron/preview-route.js:76-95](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/lib/browser-electron/preview-route.js#L76-L95)

当前开关和会话检查

<details>
<summary>查看原文（20行）</summary>

```text
    // The host's consent, checked per request rather than cached: switching sharing off must take
    // effect on the next frame, not on the next restart.
    if (settings.get().remoteView.enabled !== true) {
        replyJson(response, 403, { error: 'remote-view-disabled' });
        return;
    }
    const url = new URL(request.url ?? '/', 'http://localhost');
    const session = url.searchParams.get('session') ?? '';
    if (session === '') {
        replyJson(response, 400, { error: 'session-required' });
        return;
    }
    // A session the plugin did not hand out is not a session. This is the only identifier a caller
    // may supply; no carrier handle, view id, port or CDP target is accepted anywhere.
    if (!browser.exists(session)) {
        replyJson(response, 404, { error: 'no-such-session' });
        return;
    }
    try {
        const frame = await browser.capturePassive(session);
```

</details>

**依据 2 · 作者声明**：[README.md:90-98](https://github.com/wqty123/dsh-browser/blob/3698c7629fb1fee4a7a7af35f7a6266a20bb1d54/README.md#L90-L98)

既有共享入口和敏感风险

```text
## 远程观看(默认关闭)

从另一台设备用 DSH 时,浏览器在主机屏幕上。主机在设置里打开 `remoteView.enabled` 后,面板给出一个**只读**画面:2 fps、JPEG 质量 70、等比缩放到 1280×720 内、一帧一请求(慢网络自然降速)、不落盘、不进入聊天或模型上下文。不转发点击/键盘/滚轮。

关闭时**不出现浮动入口、也不发任何诊断请求**;在设置页打开「远程观看」开关后,入口**立刻**出现——不需要刷新页面,也不需要快捷键(手机上没有)。

三个端点,仅同源:`GET /dsh-builtin-browser/browser-view/sessions`、`GET …/browser-view/frame?session=…`、`GET /dsh-builtin-browser/bridge-status`。

画面可能包含验证码、账户信息或登录后内容——打开前请确认这是你要看的页面。
```

#### 缺口

- 未走查全客户端及使用情况
  **影响**：无法确认新增交互有益
  **进一步探讨**：先核对实际权限，再做双任务对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
