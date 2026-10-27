# dsh-douyin-webview

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[52e1d55](https://github.com/535408248-oss/dsh-douyin-webview/tree/52e1d551a8ede5d7d3cbeb4157fca8655be2f401)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/535408248-oss/dsh-douyin-webview)
<!-- END META -->

> **功能**：在 DSH 桌面页脚打开可拖拽的抖音 Electron webview，使用桌面浏览器租约。

> **亮点**：把桌面浏览器租约接成可常驻拖动的站点窗口，而 Host 半无服务逻辑；价值在娱乐便利。详见[Q01](#research-q01)。

> **主要限制**：失败提示称可点“⟳ 重试”，标题栏没有该按钮；main/preload 安全契约由作者描述而本仓库未提供，不能独立确认。详见[Q04](#research-q04)与[Q02](#research-q02)。

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
  - [Q01 · 此插件解决什么界面任务，桌面/Web 边界是什么？](#detail-section-11)
  - [Q02 · webview 租约、导航与登录态如何接线？](#detail-section-12)
  - [Q03 · 窗口交互和全屏方案对使用有什么代价？](#detail-section-13)
  - [Q04 · 失败状态与恢复提示是否有可执行操作？](#detail-section-14)
  - [Q05 · 部署与运营依赖怎么影响适用范围？](#detail-section-15)
  - [Q06 · 如何验证这类外部站点嵌入值得保留？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：桌面 DSH 同屏观看抖音；Web 页签只有不支持提示。详见[Q01](#research-q01)。

桌面独立浏览器可播放抖音；嵌入需证明同屏便利超过 guest 资源、遮挡和第三方账户成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 边界 |
| --- | --- | --- |
| 租约 webview | 站点嵌入 | 宿主安全契约未核 |
| 大小/拖拽 | 同屏摆放 | 实际遮挡待测 |
| 自动重挂 | 窗口毁坏后恢复 | 最多三次；一般失败无可见重试 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必要性 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH Desktop dshDesktop.browser | 必需 | 租约和 guest | 只显示不支持 |
| 抖音站点/网络 | 必需 | 视频与登录 | 加载失败 |
| slots 与 Electron webview | 必需 | 按钮/面板 | 无入口或无法挂载 |

#### 启动步骤

| 步骤 | 动作 | 判据或恢复 |
| --- | --- | --- |
| 安装 | desktop profile 增包 | 侧栏出现抖音按钮 |
| 打开 | 点按钮并等待租约/页面 | 状态变 ready |
| 操作 | 拖动/切大小/站内全屏 | 不挡关键控件 |
| 失败 | 关闭再开 | 当前无可见 ⟳ 重试按钮 |

**效果与成本**

#### 成本

| 阶段 | 资源与现金成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 首次 | DSH Desktop、网络和抖音账号；金额未知 | 安装、登录、授权理解 | 宿主桥版本未核 |
| 持续 | guest CPU/内存/带宽未知 | 调位置、管理遮挡 | 第三方站点变化 |
| 故障 | 播放失败或登录丢失风险 | 关闭重开、排查桥/站点 | 当前提示有无效重试 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 窗口体验 | 侧栏按钮、拖拽/大小和 guest | 实际视频播放与低干扰 |
| 登录态 | 固定 workspace/partition 租约使用 | 跨重启持久与隔离 |
| 失败恢复 | 关闭释放与最多三次自动重挂 | 错误提示中的重试不存在 |

> **思考**：失败提示称可点“⟳ 重试”，标题栏没有该按钮；main/preload 安全契约由作者描述而本仓库未提供，不能独立确认。详见[Q04](#research-q04)与[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把桌面浏览器租约接成可常驻拖动的站点窗口，而 Host 半无服务逻辑；价值在娱乐便利。详见[Q01](#research-q01)。

raw DOM 避免侧栏 transform 截断，租约清理集中；guest 内 Fullscreen API 重写侵入性高且依赖宿主/站点版本。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

失败提示称可点“⟳ 重试”，标题栏没有该按钮；main/preload 安全契约由作者描述而本仓库未提供，不能独立确认。详见[Q04](#research-q04)与[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在桌面、允许个人娱乐且愿核第三方账户/资源风险的非关键环境观察。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核页脚面板、租约调用与释放；宿主主进程契约未本轮验证，失败提示指向不存在的重试按钮，真实站点/宿主未测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、manifest、Host/Client；未运行目标插件、宿主、抖音站点或第三方响应；旧 META 仅复用。
- 下一步：真实 Desktop/Web、租约/分区/权限、抖音播放与登录、弹窗导航、全屏、窄窗拖动、失败恢复与资源测量。

**分析版本**

- **仓库**：[535408248-oss/dsh-douyin-webview](https://github.com/535408248-oss/dsh-douyin-webview)
- **版本号**：0.1.0（[固定提交 52e1d55](https://github.com/535408248-oss/dsh-douyin-webview/tree/52e1d551a8ede5d7d3cbeb4157fca8655be2f401)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是补齐可执行恢复控件、绑定宿主安全契约版本并测导航/登录/全屏及资源成本。详见[Q06](#research-q06)。

真实 Desktop/Web、租约/分区/权限、抖音播放与登录、弹窗导航、全屏、窄窗拖动、失败恢复与资源测量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1027 | 580 | 398 | — |
| .md | source | 1 | 53 | — | — | 366 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/535408248-oss/dsh-douyin-webview/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面内嵌抖音是否以可验证的租约边界提供可恢复、低干扰的使用体验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 此插件解决什么界面任务，桌面/Web 边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它让桌面 DSH 的侧栏页脚按钮打开常驻、可拖拽调大小的抖音 webview，意在工作时同屏观看。Host apply 为空，浏览器页签仍能看到按钮，但没有 dshDesktop.browser 桥时仅展示不支持说明。README 把嵌入动机归于抖音 iframe 拒绝策略；本轮没有直接检查抖音当前响应头，不能把该外部事实当独立验证。效益是娱乐便利，不是工作产出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-16](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/README.md#L1-L16)

作者定位、桌面依赖与 iframe 动机

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-douyin-webview

An embedded Douyin window docked in the DSH sidebar footer — watch Douyin in the
bottom-left corner while you keep working.

> **Desktop only.** The panel needs DSH's Desktop renderer: it mounts a real
> Electron `<webview>` through the preload bridge (`dshDesktop.browser.acquire`),
> which does not exist in a browser tab. In the Web UI the sidebar button still
> appears, and the panel explains why it cannot work.

## Why a webview and not an iframe

`douyin.com` answers with `X-Frame-Options: DENY` and a CSP `frame-ancestors`
list that does not include `127.0.0.1`, so an iframe is rejected outright. A
`<webview>` is a separate renderer guest, which `frame-ancestors` cannot reach —
that is the whole reason this plugin exists.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-24](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/index.js#L1-L24)

Host 空壳

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * dsh-douyin-webview — host half.
 *
 * Deliberately empty of behaviour. Everything this plugin does happens in the
 * renderer, because the machinery it needs is already in the Desktop main
 * process and is reached through the preload bridge, not through a Cordis
 * service:
 *
 *   - the guest lease API is `dshDesktop.browser.{acquire,release,onOpenRequested}`
 *     (`D:\Deepseek harness\resources\app.asar` → `lib/preload-app.cjs`,
 *     `createDesktopBrowserBridge()`), backed by
 *     `ipcMain.handle("dsh-desktop:browser-acquire", …)` in `lib/main.js`;
 *   - the webview attachment checks live in `DesktopBrowserGuests.bind()`.
 *
 * There is no host route to add and no host service to register, so this file
 * exists only because a bundle row needs a mountable module: `package.json`
 * points `main` at it and `cordis.patch.yml` inserts the row.
 */
export const name = 'dsh-douyin-webview';
export const inject = [];

/** Mount nothing on the host; the client half owns the whole feature. */
export function apply() {
  // Intentionally empty. See the file header for why there is no host work.
```

</details>

**依据 3 · 源码核查**：[lib/client.js:984-1000](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L984-L1000)

页脚槽位注册

<details>
<summary>查看原文（17行）</summary>

```text
    function apply(ctx) {
      installStyle();
      if (typeof ctx?.slots?.inject !== 'function' || typeof ctx?.slots?.register !== 'function') {
        console.error('[dsh-douyin-webview] 没有 slots 服务，面板未挂载');
        return;
      }
      // `sidebar.footer.action` is declared by @deepseek-ai/dsh-client-ui-sidebar
      // (`lib/client.js:403` renders it, `:515` hands it `{ wide }`); registering
      // into an undeclared slot throws `slot "…" is not declared`, hence `inject`.
      ctx.slots.inject(SLOT, function* () {
        yield ctx.slots.register({ name: SLOT, id: ID, priority: 10 }, DouyinToggle);
      });
    }

    exports.inject = ['slots'];
    exports.apply = apply;
    return module.exports;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:722-727](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L722-L727)

无桌面桥时明确不支持

```text
      async function mount() {
        if (disposed || !active) return;
        bridge = desktopBrowser();
        if (bridge === null) {
          status('unsupported', '只有 DSH 桌面版窗口（dsh-app://app）才有 dshDesktop.browser');
          return;
```

#### 缺口

- 未在目标 DSH 桌面或抖音实时站点测试
  **影响**：不能证明视频可播、iframe 当前不可嵌或生产力收益
  **进一步探讨**：目标桌面与普通 Web 分别挂载并核页面行为

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · webview 租约、导航与登录态如何接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端向桌面 preload 桥 acquire 固定 workspace 租约，webview 初始 src 为 about:blank#lease 并设 partition，再在初始 dom-ready 调 loadURL 到抖音主页；关闭时摘节点、取消新窗订阅并 release。毁坏事件最多自动重挂三次。README 称分区可保登录，但持续到进程重启取决于宿主实现，插件仓库未含 main/preload 代码，本轮不能核租约签发、权限拒绝或隔离承诺。新窗请求回调的 URL 会在同一 guest 加载，代码未限定为抖音域名；有效边界由未检查的宿主桥执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:722-778](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L722-L778)

租约取得、webview 属性与新窗回调

<details>
<summary>查看原文（57行）</summary>

```text
      async function mount() {
        if (disposed || !active) return;
        bridge = desktopBrowser();
        if (bridge === null) {
          status('unsupported', '只有 DSH 桌面版窗口（dsh-app://app）才有 dshDesktop.browser');
          return;
        }
        status('leasing', '正在申请 webview 租约…');
        let held;
        try {
          held = await bridge.acquire(WORKSPACE);
        } catch (error) {
          status('error', String(error?.message ?? error));
          return;
        }
        if (disposed || !active) {
          try {
            await bridge.release(held.lease);
          } catch {
            /* nothing to do */
          }
          return;
        }
        reservation = held;
        status('attaching', '正在挂载抖音窗口…');

        const node = document.createElement('webview');
        node.className = 'dyw-frame';
        // Parity with @deepseek-ai/dsh-client-ui-sidebar-browser/lib/client.js:1336-1342:
        // `allowpopups` lets the guest reach `setWindowOpenHandler` (the main process
        // always answers `{ action: "deny" }`, but it first sends us
        // `browserOpenRequested` for http/https targets); `data-sidebar-browser-frame`
        // is the marker the shell's shortcut bridge looks for.
        // Electron's own UA carries `Electron/<version>`, and douyin.com gates parts of
        // its player on the UA string. Present as plain desktop Chrome instead.
        node.setAttribute(
          'useragent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        );
        node.setAttribute('name', held.lease);
        node.setAttribute('allowpopups', '');
        node.setAttribute('data-sidebar-browser-frame', 'webview');
        // The lease id IS the fragment; `params.src.slice(12)` in the main process reads it.
        node.setAttribute('src', `about:blank#${held.lease}`);
        node.setAttribute('partition', held.partition);
        // New-window links: the main process denies the popup and tells us the URL
        // instead. Follow it in this same guest rather than losing the click.
        try {
          unsubscribeOpen = bridge.onOpenRequested(held.lease, (url) => {
            if (disposed || element !== node) return;
            node.loadURL(url).catch(() => {
              /* a denied or aborted follow-up is not worth a visible error */
            });
          });
        } catch {
          unsubscribeOpen = null;
        }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:823-865](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L823-L865)

首页导航与最多三次重挂

<details>
<summary>查看原文（43行）</summary>

```text
        node.addEventListener(
          'dom-ready',
          () => {
            if (disposed || element !== node) return;
            remounts = 0;
            status('ready', '');
            node.loadURL(HOME).catch((error) => {
              if (disposed || element !== node) return;
              if (error?.code === 'ERR_ABORTED') return;
              status('error', String(error?.message ?? error));
            });
          },
          { once: true },
        );
        node.addEventListener('did-fail-load', (event) => {
          if (disposed || element !== node) return;
          if (!event.isMainFrame || event.errorCode === -3) return;
          status('error', `${event.errorDescription ?? 'load failed'} (${event.errorCode})`);
        });
        node.addEventListener(
          'destroyed',
          () => {
            if (disposed || element !== node) return;
            element = null;
            // The main process's releaseAll already dropped this lease.
            reservation = null;
            if (!active) return;
            if (remounts >= MAX_REMOUNTS) {
              status('error', '窗口被反复销毁（宿主窗口可能刚刷新过），已停止自动重挂');
              return;
            }
            remounts += 1;
            status('attaching', `窗口被销毁，正在重挂（第 ${remounts} 次）…`);
            setTimeout(() => {
              if (active && !disposed) void mount();
            }, 400);
          },
          { once: true },
        );

        element = node;
        host.appendChild(node);
        syncFit();
```

</details>

**依据 3 · 源码核查**：[lib/client.js:692-720](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L692-L720)

节点/租约清理

<details>
<summary>查看原文（29行）</summary>

```text
      function detach() {
        if (typeof unsubscribeOpen === 'function') {
          try {
            unsubscribeOpen();
          } catch {
            /* the preload bridge already dropped it */
          }
        }
        unsubscribeOpen = null;
        const held = element;
        element = null;
        if (held === null) return;
        try {
          held.remove();
        } catch {
          /* already gone */
        }
      }

      async function release() {
        const held = reservation;
        reservation = null;
        if (held === null || bridge === null) return;
        try {
          await bridge.release(held.lease);
        } catch {
          /* the main process already dropped it (releaseAll) */
        }
      }
```

</details>

**依据 4 · 作者声明**：[README.md:31-39](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/README.md#L31-L39)

分区和全屏说明

```text
## Notes

- The `partition` comes from the Desktop guest lease, so the Douyin login
  survives panel close/reopen. Keep the partition persistent (see
  `dsh-侧栏浏览器分区持久化`) if you want it to survive a restart too.
- Douyin's own `⛶` control is intercepted and re-implemented in-page: Electron's
  `WEB_VIEW_ATTRIBUTES` has no `allowfullscreen`, so the native request would be
  silently denied. The shim rewrites the Fullscreen API inside the guest and
  scales the video to the panel's own viewport.
```

#### 缺口

- 目标宿主 main/preload 的租约、安全策略和持久分区未检查
  **影响**：不能独立确认登录态跨重启、安全隔离或 URL 限制
  **进一步探讨**：检查匹配宿主版本并在隔离环境测跳转/分区/权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 窗口交互和全屏方案对使用有什么代价？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

面板由 raw DOM 挂 document.body，默认大窗，尺寸切换后小窗靠左下、大窗靠右上；标题栏拖动有边界/磁吸，窗口 resize 会回归规范角。为了让站点全屏按钮能在 guest 内工作，插件在 dom-ready 注入脚本，重写多个 Fullscreen API 原型、添加双击与 Escape 行为。这绕开的是 UI 接口而非本轮核实的宿主权限政策，可能随抖音 DOM、Electron 或浏览器 API 变化失效；还可能与站点自有全屏行为冲突。真实播放/操作遮挡未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:291-345](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L291-L345)

默认大窗与尺寸切换

<details>
<summary>查看原文（55行）</summary>

```text
    function createDockDom(onClose, onGeometry) {
      const dock = document.createElement('div');
      dock.className = 'dyw-dock';
      dock.setAttribute('data-phase', 'idle');
      // Hidden until placed: the CSS default corner is (0,0) and one frame of a
      // black panel there is plainly visible.
      dock.style.visibility = 'hidden';

      const bar = document.createElement('div');
      bar.className = 'dyw-bar';

      // Two steps, both 16:9 and both inside the window: "小" is a fixed 500×281
      // box, "大" is as wide as a 16:9 box can be without reaching the title bar
      // or the sidebar's foot row. Every open starts at "大" (用户 m04903, restated
      // by 用户 m05305), and the badge below is the only thing that changes it.
      const SIZES = [
        ['1', '小窗口'],
        ['3', '大窗口'],
      ];
      // 用户 m05305「我记得说过默认打开抖音的时候是打窗口吧？，你现在显示的是小窗口」:
      // every open starts at the 「大」 step — nothing is read back from storage, so a
      // previous click on 小窗口 can no longer make the next open come up small.
      // 用户 m04903 asked for this default in the first place.
      dock.setAttribute('data-size', '3');

      const size = document.createElement('span');
      size.className = 'dyw-bar-size';
      // The badge names the size a click lands on, not the current one: the user
      // asked for the two words to be swapped because this control means "switch",
      // so reading the destination off the badge is the whole point.
      // 用户 m05342「把小窗口改成标题改成 切换大窗口    大窗口标题改成 切换小窗口」: the
      // verb is spelled out in front of it, so nobody can read the badge as the
      // current state — 用户 m05305 had just been tripped up by exactly that.
      const nextSize = (value) => SIZES[(SIZES.findIndex(([id]) => id === value) + 1) % SIZES.length];
      size.textContent = '切换' + nextSize(dock.getAttribute('data-size'))[1];
      size.title = '点击切换尺寸（小窗口 / 大窗口）';
      size.style.cursor = 'pointer';
      size.addEventListener('click', () => {
        const next = nextSize(dock.getAttribute('data-size'));
        // Switching size used to re-clamp from wherever the panel happened to be
        // *after* the box changed, so "大 → 小" landed somewhere new every time:
        // the larger box had already been pushed away from the edge and the small
        // box kept that pushed corner. Each step now owns a fixed corner instead:
        // small bottom-left, large top-right (see homeCorner).
        // The new step's own corner, read *after* the attribute flips: homeCorner
        // reads both data-size and the current rect, so computing it first would
        // send the panel to the corner of the step it is leaving.
        dock.setAttribute('data-size', next[0]);
        size.textContent = '切换' + nextSize(next[0])[1];
        measure();
        const home = homeCorner(dock.getBoundingClientRect());
        const back = clamp(dock.getBoundingClientRect(), home.x, home.y);
        place(back.x, back.y, true);
        onGeometry?.();
      });
```

</details>

**依据 2 · 源码核查**：[lib/client.js:462-520](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L462-L520)

窗口定位、磁吸边界

<details>
<summary>查看原文（59行）</summary>

```text
      function homeCorner(rect) {
        if (dock.getAttribute('data-size') === '3') {
          return { x: window.innerWidth - rect.width, y: topInset() };
        }
        return { x: 0, y: footTop() - rect.height };
      }

      function bounds(rect) {
        const rail = sidebarWidth(dock) + 8;
        const top = topInset();
        // Flush edges, no 8px reserve: homeCorner parks the small step on the
        // window's bottom-left corner and a clamp that pulled it 8px back would
        // undo that. minX is 0, not 8, for the same reason — the panel is allowed
        // to sit over the sidebar's empty lower half.
        const maxX = Math.max(0, window.innerWidth - rect.width);
        // The large step is maximised: it already spans every pixel between the
        // title bar and the foot row, so a vertical drag has nowhere to go. Pin it
        // to the top instead of letting it slide inside an 8px sliver (the user:
        // "大窗口的时候怎么还能上下移动？"). Horizontal freedom stays.
        const maximised = dock.getAttribute('data-size') === '3';
        return {
          minX: 0,
          rail: rail <= maxX ? rail : null,
          maxX,
          minY: top,
          maxY: maximised ? top : Math.max(top, footTop() - rect.height),
        };
      }

      function clamp(rect, x, y) {
        const box = bounds(rect);
        return {
          x: Math.min(Math.max(box.minX, x), box.maxX),
          y: Math.min(Math.max(box.minY, y), box.maxY),
        };
      }

      /** Magnetic: an axis only sticks once it is within SNAP px of an edge. */
      function snap(rect, x, y) {
        const SNAP = 48;
        const box = bounds(rect);
        const stick = (value, edges) => {
          const clamped = Math.min(Math.max(box.minX, value), box.maxX);
          let best = clamped;
          let bestGap = SNAP + 1;
          for (const edge of edges) {
            if (typeof edge !== 'number') continue;
            const gap = Math.abs(value - edge);
            if (gap <= SNAP && gap < bestGap) {
              best = edge;
              bestGap = gap;
            }
          }
          return best;
        };
        return {
          x: stick(x, [box.minX, box.rail, box.maxX]),
          y: stick(y, [box.minY, box.maxY]),
        };
```

</details>

**依据 3 · 源码核查**：[lib/client.js:542-586](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L542-L586)

拖拽与 resize

<details>
<summary>查看原文（45行）</summary>

```text
      let drag = null;
      bar.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        if (event.target instanceof Element && event.target.closest('button, .dyw-bar-size') !== null) return;
        const rect = dock.getBoundingClientRect();
        drag = { id: event.pointerId, dx: event.clientX - rect.left, dy: event.clientY - rect.top };
        dock.setAttribute('data-dragging', 'true');
        try {
          bar.setPointerCapture(event.pointerId);
        } catch {
          /* capture is best-effort; the drag overlay keeps the moves coming */
        }
        event.preventDefault();
      });
      bar.addEventListener('pointermove', (event) => {
        if (drag === null || event.pointerId !== drag.id) return;
        place(event.clientX - drag.dx, event.clientY - drag.dy, false);
      });
      const endDrag = (event) => {
        if (drag === null || event.pointerId !== drag.id) return;
        drag = null;
        dock.removeAttribute('data-dragging');
        const rect = dock.getBoundingClientRect();
        const stuck = snap(rect, rect.left, rect.top);
        place(stuck.x, stuck.y, true);
        onGeometry?.();
      };
      bar.addEventListener('pointerup', endDrag);
      bar.addEventListener('pointercancel', endDrag);

      // A window state change (maximise, restore, a resize, the rail collapsing)
      // sends each step back to its canonical corner instead of clamping it in
      // place. Self-unsubscribes once the dock is gone.
      const onResize = () => {
        if (!dock.isConnected) {
          window.removeEventListener('resize', onResize);
          return;
        }
        measure();
        const home = homeCorner(dock.getBoundingClientRect());
        const back = clamp(dock.getBoundingClientRect(), home.x, home.y);
        place(back.x, back.y, false);
        onGeometry?.();
      };
      window.addEventListener('resize', onResize);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:779-821](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L779-L821)

guest 全屏 API 注入

<details>
<summary>查看原文（43行）</summary>

```text
        node.addEventListener('dom-ready', () => {
          if (disposed || element !== node) return;
          syncFit();
          // Douyin's own fullscreen button calls the HTML fullscreen API, which the
          // shell denies for every guest: `configureSession` installs
          // `setPermissionRequestHandler((_c, _p, cb) => cb(false))` on this
          // partition, and Electron's `WebContents::OnEnterFullscreenModeForTab`
          // returns early when `!allowed` — so the click is swallowed with no error.
          // Emulate it inside the guest instead: the requested element is pinned to
          // the guest's own viewport, which IS "the douyin window" — the desktop
          // window never changes size, so this is not the whole-app fullscreen the
          // user rejected. Injected into the guest's main world on every dom-ready
          // so the page's own enter/exit path keeps working (SPA re-renders included).
          const shim = '(function(){if(window.__dywFs)return;window.__dywFs=1;'
            + 'var d=document,c=null,st=null,s=d.createElement("style");'
            + 's.textContent=".dyw-fs{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;margin:0!important;transform:none!important;object-fit:cover!important;z-index:2147483647!important;background:#000!important}";'
            + 'function e(){if(!s.isConnected)(d.head||d.documentElement).appendChild(s)}'
            + 'function f(el){try{d.dispatchEvent(new Event("fullscreenchange"))}catch(x){}try{d.dispatchEvent(new Event("webkitfullscreenchange"))}catch(x){}if(el){try{el.dispatchEvent(new Event("fullscreenchange"))}catch(x){}try{el.dispatchEvent(new Event("webkitfullscreenchange"))}catch(x){}}}'
            + 'function u(el){if(!el)return;el.classList.remove("dyw-fs");if(st&&st.p){try{st.p.insertBefore(el,st.n)}catch(x){try{st.p.appendChild(el)}catch(y){}}}st=null}'
            + 'function a(el){e();if(c&&c!==el)u(c);c=el;el.classList.add("dyw-fs");'
            + 'try{var q=el.getBoundingClientRect();if(q.width<innerWidth*0.9||q.height<innerHeight*0.9){st={p:el.parentNode,n:el.nextSibling};d.body.appendChild(el)}}catch(x){}'
            + 'f(el)}'
            + 'function r(){var el=c;u(c);c=null;f(el)}'
            + 'function pick(){try{var l=d.querySelectorAll("video");for(var i=0;i<l.length;i++){var b=l[i].getBoundingClientRect();if(b.width>160&&b.height>90&&b.bottom>0&&b.top<innerHeight&&b.right>0&&b.left<innerWidth)return l[i]}}catch(x){}return d.documentElement}'
            + 'window.__dywToggle=function(){if(c)r();else a(pick())};'
            + 'var p=Element.prototype;'
            + '["requestFullscreen","webkitRequestFullscreen","webkitRequestFullScreen","mozRequestFullScreen","msRequestFullscreen"].forEach(function(n){if(p[n])p[n]=function(){a(this);return Promise.resolve()}});'
            + 'var v=window.HTMLVideoElement&&HTMLVideoElement.prototype;'
            + 'if(v){v.webkitEnterFullscreen=function(){a(this)};v.webkitExitFullscreen=function(){r()};'
            + 'try{Object.defineProperty(v,"webkitSupportsFullscreen",{get:function(){return true},configurable:true})}catch(x){}'
            + 'try{Object.defineProperty(v,"webkitDisplayingFullscreen",{get:function(){return c===this},configurable:true})}catch(x){}}'
            + 'd.exitFullscreen=function(){r();return Promise.resolve()};'
            + 'd.webkitExitFullscreen=function(){r();return Promise.resolve()};'
            + 'try{Object.defineProperty(d,"fullscreenElement",{get:function(){return c},configurable:true})}catch(x){}'
            + 'try{Object.defineProperty(d,"webkitFullscreenElement",{get:function(){return c},configurable:true})}catch(x){}'
            + 'try{Object.defineProperty(d,"fullscreenEnabled",{get:function(){return true},configurable:true})}catch(x){}'
            + 'try{Object.defineProperty(d,"webkitFullscreenEnabled",{get:function(){return true},configurable:true})}catch(x){}'
            + 'd.addEventListener("dblclick",function(ev){var t=ev.target;if(t&&t.closest&&t.closest("input,textarea,[contenteditable]"))return;ev.preventDefault();window.__dywToggle()},true);'
            + 'd.addEventListener("keydown",function(ev){if(ev.key==="Escape"&&c){ev.stopPropagation();r()}},true);'
            + '})();';
          node.executeJavaScript(shim, true).catch(() => {
            /* a guest mid-navigation refuses the call; the next dom-ready retries */
          });
```

</details>

#### 缺口

- 站点和 Electron 版本兼容、键盘/拖拽可访问性未核
  **影响**：不能保证全屏或布局稳定
  **进一步探讨**：目标宿主测试登录、播放、双击/原站按钮、Escape、窄窗和辅助操作

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 失败状态与恢复提示是否有可执行操作？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

失败提示明确说点标题栏右上角“⟳ 重试”，但标题栏实际只 append 尺寸切换、间隔、状态点和“× 收起”；没有可见刷新按钮，也没有调用 controller.reload 的 UI。于是加载失败后用户只能关闭再打开或使用外部方式重载，提示会误导。首次租约申请失败也只置 error，不自动重试。持续打开 guest 的 CPU/网络/账户隐私成本未量化，不宜承诺低干扰。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:347-380](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L347-L380)

标题栏不含重试控件

<details>
<summary>查看原文（34行）</summary>

```text
      // The bar carries exactly two controls: the size badge and "收起". Douyin's
      // own fullscreen control still works — the shim in mount() emulates the HTML
      // fullscreen API inside the guest — it just has no mirror button up here.
      // 用户 m04844: the badge moves to the far left, and right of the spacer sit
      // just the status dot and 收起. The dot mirrors 酷狗's: it is grey while the
      // guest loads and turns green once the page is ready, because paintDock
      // already stamps data-phase on the dock after every state change.
      const gap = document.createElement('span');
      gap.className = 'dyw-bar-gap';

      const dot = document.createElement('span');
      dot.className = 'dyw-bar-dot';
      dot.title = '抖音网页正在加载';

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'dyw-bar-btn';
      close.title = '收起';
      close.textContent = '×';
      close.addEventListener('click', onClose);

      const body = document.createElement('div');
      body.className = 'dyw-body';

      const host = document.createElement('div');
      host.className = 'dyw-host';

      const hint = document.createElement('div');
      hint.className = 'dyw-hint';

      bar.append(size, gap, dot, close);
      body.append(host, hint);
      dock.append(bar, body);
      document.body.appendChild(dock);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:637-642](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L637-L642)

失败提示要求点 ⟳

```text
      if (state.phase === 'error') {
        dom.hint.append(
          el('b', null, '抖音窗口挂载失败'),
          el('code', null, state.detail || '未知错误'),
          el('span', null, '点标题栏右上角的 ⟳ 重试。'),
        );
```

**依据 3 · 源码核查**：[lib/client.js:729-735](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L729-L735)

租约失败只置 error

```text
        status('leasing', '正在申请 webview 租约…');
        let held;
        try {
          held = await bridge.acquire(WORKSPACE);
        } catch (error) {
          status('error', String(error?.message ?? error));
          return;
```

**依据 4 · 源码核查**：[lib/client.js:868-885](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L868-L885)

控制器有 reload 但未在界面接线

<details>
<summary>查看原文（18行）</summary>

```text
      return {
        async open() {
          if (disposed || active) return;
          active = true;
          remounts = 0;
          await mount();
        },
        async close() {
          if (!active) return;
          active = false;
          detach();
          await release();
          status('idle', '');
        },
        reload() {
          if (element === null) return;
          element.reload?.();
        },
```

</details>

#### 缺口

- 真实错误发生率和关闭重开是否能恢复未测
  **影响**：不能估计故障时间或资源成本
  **进一步探讨**：加显式重试按钮后测 acquire/加载失败恢复和资源占用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署与运营依赖怎么影响适用范围？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

包声明 Web client 注入 slots，但功能实依赖特定 DSH Desktop preload 桥和 webview guest；普通 Web 只能看不支持提示。硬编码抖音首页与桌面 Chrome 131 UA，站点改版、反嵌入策略或宿主升级都可能影响；登录态属于第三方站点分区，应由用户明确理解持久性与账号风险。作者给出 desktop profile 安装命令，但本轮未检查包注册表可达性。建议仅在允许个人娱乐且宿主/站点版本经验证的环境观察试用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-37](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/package.json#L1-L37)

manifest/Web client 与包版本

<details>
<summary>查看原文（37行）</summary>

```text
{
  "name": "dsh-douyin-webview",
  "version": "0.1.0",
  "type": "module",
  "description": "An embedded Douyin window docked in the DSH sidebar: a real Electron webview guest, so douyin.com's X-Frame-Options: DENY no longer applies.",
  "license": "MIT",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "douyin",
    "webview",
    "desktop"
  ],
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots"
      ]
    }
  }
```

</details>

**依据 2 · 作者声明**：[README.md:43-49](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/README.md#L43-L49)

作者给出安装命令

````text
## Install

```sh
dsh plugin --profile desktop add dsh-douyin-webview
```

or list the package in your profile's `dsh.profile.bundles`.
````

**依据 3 · 源码核查**：[lib/client.js:90-93](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L90-L93)

固定首页与 workspace

```text
    const HOME = 'https://www.douyin.com/';
    /** Guest storage identity; the same string always maps to the same partition. */
    const WORKSPACE = 'dsh-douyin-webview';
    const STYLE_ID = 'dsh-douyin-webview-style';
```

**依据 4 · 源码核查**：[lib/client.js:755-766](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L755-L766)

硬编码 User-Agent 和租约属性

<details>
<summary>查看原文（12行）</summary>

```text
        // Electron's own UA carries `Electron/<version>`, and douyin.com gates parts of
        // its player on the UA string. Present as plain desktop Chrome instead.
        node.setAttribute(
          'useragent',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        );
        node.setAttribute('name', held.lease);
        node.setAttribute('allowpopups', '');
        node.setAttribute('data-sidebar-browser-frame', 'webview');
        // The lease id IS the fragment; `params.src.slice(12)` in the main process reads it.
        node.setAttribute('src', `about:blank#${held.lease}`);
        node.setAttribute('partition', held.partition);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:127-132](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L127-L132)

桥 API 检查

```text
    function desktopBrowser() {
      const bridge = globalThis.dshDesktop?.browser;
      if (bridge === null || typeof bridge !== 'object') return null;
      if (typeof bridge.acquire !== 'function' || typeof bridge.release !== 'function') return null;
      return bridge;
    }
```

#### 缺口

- 安装可达性、抖音服务条款、登录隔离和资源用量未查
  **影响**：不能给企业合规或稳定性结论
  **进一步探讨**：目标环境核安装、host 版本、账户策略与监测指标

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何验证这类外部站点嵌入值得保留？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向：给失败态提供可见重试并真正接 controller.reload 或重新 acquire；把宿主租约安全契约和分区持久性绑定到可检版本，给 guest 导航做清晰域名/确认策略；考虑关闭时资源释放、减轻遮挡以及告知登录数据驻留。验收矩阵应覆盖桌面/Web、首次/失败/重挂/重启、弹窗、新导航、双击全屏、窗口尺寸和实际 CPU/内存/带宽。当前推荐观察，不把这些设想计为已有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:637-642](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L637-L642)

目前失败态提示与控件不一致

```text
      if (state.phase === 'error') {
        dom.hint.append(
          el('b', null, '抖音窗口挂载失败'),
          el('code', null, state.detail || '未知错误'),
          el('span', null, '点标题栏右上角的 ⟳ 重试。'),
        );
```

**依据 2 · 源码核查**：[lib/client.js:770-775](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L770-L775)

新窗 URL 交桥加载

```text
          unsubscribeOpen = bridge.onOpenRequested(held.lease, (url) => {
            if (disposed || element !== node) return;
            node.loadURL(url).catch(() => {
              /* a denied or aborted follow-up is not worth a visible error */
            });
          });
```

**依据 3 · 源码核查**：[lib/client.js:903-908](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/lib/client.js#L903-L908)

销毁释放接口

```text
        async dispose() {
          disposed = true;
          active = false;
          detach();
          await release();
        },
```

**依据 4 · 作者声明**：[README.md:6-9](https://github.com/535408248-oss/dsh-douyin-webview/blob/52e1d551a8ede5d7d3cbeb4157fca8655be2f401/README.md#L6-L9)

作者桌面限定

```text
> **Desktop only.** The panel needs DSH's Desktop renderer: it mounts a real
> Electron `<webview>` through the preload bridge (`dshDesktop.browser.acquire`),
> which does not exist in a browser tab. In the Web UI the sidebar button still
> appears, and the panel explains why it cannot work.
```

#### 缺口

- 改进和真实验收均未实现
  **影响**：不能据此提高当前贡献分
  **进一步探讨**：先加最小 UI 修复并在目标版本做隔离测试

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
