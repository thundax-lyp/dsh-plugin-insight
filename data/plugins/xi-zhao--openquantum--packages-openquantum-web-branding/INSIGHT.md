# OpenQuantum Web Branding

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0da563f](https://github.com/xi-zhao/OpenQuantum/tree/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding)

<!-- BEGIN META -->
[![GitHub ★ 71](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=71&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xi-zhao/OpenQuantum)
<!-- END META -->

> **功能**：用宿主扩展点替换OpenQuantum品牌和浏览器/PWA元信息

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 可安装呈现模块，不是量子计算能力。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 打包遗漏风险与脚本热卸载不恢复，简化设置隐藏其他section。

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
  - [Q01 · 独立子包与量子科研根项目有何区别？](#detail-section-11)
  - [Q02 · 品牌、设置与桌面呈现怎样生效？](#detail-section-12)
  - [Q03 · 打包和退出有哪些具体反证？](#detail-section-13)
  - [Q04 · 安装、资源和回退要准备什么？](#detail-section-14)
  - [Q05 · 怎样证伪品牌与简化的增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要OpenQuantum品牌的DSH分发维护者想避免直接改上游UI。

原DSH品牌或手工修改上游HTML/CSS。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 品牌和元信息 | logo/title/PWA和sidebar/hero | 不新增科研/认证功能 |
| 可选简化设置/提示 | 空模型引导和三类设置导航 | 其他section隐藏，错误目录保原selector |
| 桌面呈现包装 | compatibility及托盘/图标 | 额外Host扩展，条件恢复schedule |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=24和完整assets/import文件 | 必需 | 读取资产与Host模块 | files遗漏风险先核pack |
| DSH Web webServer与UI slot服务 | Web必需 | tapIndex/路由/品牌 | 旧版走特定CSS需适配 |
| desktopRuntime/security/settings | Desktop可选 | auth URL与托盘包装 | 第三方Host不保证扩展 |
| 原profile及全刷新退路 | 采用前置 | 还原脚本/样式/设置导航 | 热卸载不自动撤observer |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 检查打包import/assets，保profile | 默认先不启minimal设置 |
| 核界面 | logo/PWA及全部必需设置、空/失败model目录 | 任务仍由原宿主 |
| 退出 | 停插件、完整刷新/桌面重启核原UI | PWA图标缓存另刷新 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 静态资产与兼容Host资源未知 | 核打包和配置耗时未知 | 首次时间/费用未知 |
| 持续 | observer、目录RPC与上游适配资源未知 | 维护slot/selector和版本耗时未知 | 无自身付费计算不等维护为0 |
| 恢复 | 页面/PWA缓存与桌面进程未知 | 全刷新/重启核原设置恢复耗时未知 | 退出耗时未知，不需删会话数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 品牌接线 | 真实slot/index/assets | 跨宿主呈现和易用性未验 |
| 模型提示 | 空目录严格判据和失败保selector | 实际RPC版本兼容未运行 |
| 退出 | 路由effect和schedule条件恢复 | 已加载页observer/样式需刷新，pack未验 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 打包遗漏风险与脚本热卸载不恢复，简化设置隐藏其他section。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 可安装呈现模块，不是量子计算能力。

逐一读品牌Host/client/Desktop/旧版适配实现，未执行目标。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 打包遗漏风险与脚本热卸载不恢复，简化设置隐藏其他section。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 先隔离核pack依赖和完整刷新回退，再考虑分发。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的判断独立branding包实际改哪些界面及其打包、兼容和退出边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 packages/openquantum-web-branding/package.json、packages/openquantum-web-branding/README.md、packages/openquantum-web-branding/client.js、packages/openquantum-web-branding/index.mjs、packages/openquantum-web-branding/desktop.mjs、packages/openquantum-web-branding/dsh-0.1.0.mjs、packages/openquantum-web-branding/cordis.patch.yml 及固定范围 inventory；组件：packages/openquantum-web-branding。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的判断独立branding包实际改哪些界面及其打包、兼容和退出边界。未执行目标代码或实际宿主验证。
- 下一步：以设置可达/原UI恢复为底线，保截图与独立构建产物清单

**分析版本**

- **仓库**：[xi-zhao/OpenQuantum](https://github.com/xi-zhao/OpenQuantum)
- **版本号**：0.1.0（[固定提交 0da563f](https://github.com/xi-zhao/OpenQuantum/tree/0da563fa87c6592a8923d2eb98eea80f484d2151)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 易用性需以原任务/设置可达性对照，当前未测。

以设置可达/原UI恢复为底线，保截图与独立构建产物清单

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 210 | 194 | 9 | — |
| .mjs | source | 4 | 527 | 467 | 26 | — |
| .md | source | 1 | 38 | — | — | 303 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/xi-zhao/OpenQuantum/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断独立branding包实际改哪些界面及其打包、兼容和退出边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立子包与量子科研根项目有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

真实type plugin，@openquantum/harness-web-branding0.1.0，仅把OpenQuantum名称、logo、tagline、浏览器/PWA元信息接到DSH Web；量子Skill/计算/MCP属于root，不归该包。相比手改上游UI，它通过tapIndex和品牌slot提供独立替换，支持缺slot旧版CSS适配。可选minimalUi/minimalSettings还提供空模型提示、简化设置导航/标题栏；desktop export包装托盘/窗口显示，这些是呈现增量，不改量子算法或会话数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openquantum-web-branding/package.json:1-39](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/package.json#L1-L39)

实际包身份与Web入口

<details>
<summary>查看原文（39行）</summary>

```text
{
  "name": "@openquantum/harness-web-branding",
  "version": "0.1.0",
  "description": "OpenQuantum branding and PWA metadata for the native DeepSeek Harness web UI",
  "license": "MIT",
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "files": [
    "assets",
    "client.js",
    "desktop.mjs",
    "cordis.patch.yml",
    "identity.mjs",
    "index.mjs",
    "README.md"
  ],
  "exports": {
    ".": "./index.mjs",
    "./client": "./client.js",
    "./desktop": "./desktop.mjs",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "keywords": [
```

</details>

**依据 2 · 作者声明**：[packages/openquantum-web-branding/README.md:1-24](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/README.md#L1-L24)

独立品牌范围

<details>
<summary>查看原文（24行）</summary>

````text
# OpenQuantum Web Branding

An installable DeepSeek Harness Web plugin that applies the OpenQuantum name,
tagline, logo, browser metadata and PWA manifest through Harness-native host and
client extension seams. It does not replace the Harness Web application.

The Client Plugin fills `sidebar.brand.mark` and `sidebar.brand.name` in both
Web and Desktop, including the collapsed sidebar, and reuses the same mark in
`conversation.hero.brand.mark`. The Host Plugin supplies
the shared assets, styles, product copy and browser metadata through `tapIndex`.
Sidebar branding does not depend on the upstream SVG shape or DOM nesting.

The Desktop `minimalUi` composition also uses the native model Slot to show a
setup hint when the Host model catalog is empty. Configured providers and failed
catalog reads retain the original selector. This reads the public catalog RPC;
it does not alter saved models or Session history.

```bash
dsh plugin --profile web add github:xi-zhao/OpenQuantum#path:/packages/openquantum-web-branding
```

The full OpenQuantum quantum-research distribution remains available from the
repository root. This package intentionally exposes only the independently
installable Web branding module.
````

</details>

**依据 3 · 源码核查**：[packages/openquantum-web-branding/client.js:168-205](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/client.js#L168-L205)

真实slot注入

<details>
<summary>查看原文（38行）</summary>

```text
    function apply(ctx) {
      if (globalThis.document?.querySelector('meta[name="openquantum-minimal-ui"][content="true"]')) {
        showModelSetupHint(ctx);
      }
      if (globalThis.document?.querySelector('meta[name="openquantum-minimal-settings"][content="true"]')) {
        installMinimalSettings(ctx);
      }
      ctx.slots.inject("sidebar.brand.mark", () =>
        ctx.slots.inject("sidebar.brand.name", function* () {
          yield ctx.slots.register(
            { name: "sidebar.brand.mark", priority: -1000 },
            OpenQuantumBrandMark,
          );
          yield ctx.slots.register(
            { name: "sidebar.brand.name", priority: -1000 },
            OpenQuantumBrandName,
          );
        }),
      );
      ctx.slots.inject("conversation.hero.brand.mark", () =>
        ctx.slots.register(
          { name: "conversation.hero.brand.mark", priority: -1000 },
          OpenQuantumBrandMark,
        ),
      );
      ctx.slots.inject("settings.onboarding", () =>
        ctx.slots.register(
          {
            name: "settings.onboarding",
            id: "welcome-notice",
            order: -1000,
            priority: -1000,
          },
          SuppressUpstreamDeveloperNotice,
        ),
      );
    }

```

</details>

#### 缺口

- 本轮未在实际Web/Desktop挂载
  **影响**：不能保证所有宿主版本呈现一致或品牌提升可用性
  **进一步探讨**：先用无真实会话的隔离Host核logo、标题、manifest及模型提示

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 品牌、设置与桌面呈现怎样生效？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host启动同步读assets，tapIndex以marker去重，缺</head>抛错，替换title并注meta/style/script，静态路由仅GET/HEAD、no-cache。client按priority-1000注sidebar/hero品牌。minimalUi并发读models/providers，只有groups空、无failures且无active provider才显示设置模型提示；失败保原选择器，generation/disposed拒旧RPC，事件变化刷新。minimalSettings只展示general/models/openquantum-capabilities三类section，原表单/凭据写入仍宿主；并覆盖标题栏。desktop包装runtime.schedule强制compatibility，给auth URL、icon/tray labels并监听locale，dispose仅当当前仍自己wrapper才恢复原schedule。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openquantum-web-branding/index.mjs:265-327](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/index.mjs#L265-L327)

tapIndex和HTML/路由链

<details>
<summary>查看原文（63行）</summary>

```text
export function brandHarnessIndex(html) {
  if (html.includes(BRAND_MARKER)) {
    return html;
  }

  if (!html.includes("</head>")) {
    throw new Error("OpenQuantum branding requires a Harness HTML head");
  }

  const titled = /<title>[^<]*<\/title>/.test(html)
    ? html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${OPENQUANTUM_BRAND.name}</title>`,
      )
    : html.replace(
        "</head>",
        `<title>${OPENQUANTUM_BRAND.name}</title></head>`,
      );
  return titled.replace(
    "</head>",
    `${BRAND_METADATA}\n${BRAND_STYLES}\n<script defer src="/openquantum-branding.js" ${BRAND_MARKER}></script>\n</head>`,
  );
}

export const name = "openquantum-web-branding";
export const inject = ["webServer"];

function staticAssetHandler(contentType, body) {
  return (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { allow: "GET, HEAD" });
      response.end();
      return;
    }

    response.writeHead(200, {
      "cache-control": "no-cache",
      "content-length": Buffer.byteLength(body),
      "content-type": contentType,
    });
    response.end(request.method === "HEAD" ? undefined : body);
  };
}

export function apply(ctx, { minimalUi = false, minimalSettings = false } = {}) {
  ctx.effect(
    () => ctx.webServer.tapIndex((html) => {
      let branded = brandHarnessIndex(html);
      for (const [enabled, marker] of [[minimalUi, "openquantum-minimal-ui"], [minimalSettings, "openquantum-minimal-settings"]]) {
        if (enabled && !branded.includes(`name="${marker}"`)) {
          branded = branded.replace("</head>", `<meta name="${marker}" content="true" />\n</head>`);
        }
      }
      return branded;
    }),
    "openquantum: native Harness Web branding",
  );
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: "exact",
        path: "/favicon.svg",
        handler: staticAssetHandler(
```

</details>

**依据 2 · 源码核查**：[packages/openquantum-web-branding/client.js:26-94](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/client.js#L26-L94)

空目录提示判据与清理

<details>
<summary>查看原文（69行）</summary>

```text
    function showModelSetupHint(ctx) {
      ctx.slots.inject("conversation.input.model", () => {
        const fiber = ctx.inject(["connection", "remote", "locale", "modelDirectories", "sessions"], (scope) => {
          function ModelSetupHint({ available }) {
            const locale = React.useSyncExternalStore(
              (notify) => scope.locale.subscribe(notify),
              () => scope.locale.getSnapshot(),
            );
            return available ? h("span", { style: { fontSize: 13, opacity: 0.65 } },
              locale.active.startsWith("zh")
                ? "请在设置 → 模型中添加模型"
                : "Add a model in Settings → Models",
            ) : null;
          }
          scope.effect(() => {
            let generation = 0;
            let disposed = false;
            let removeHint;
            const hide = () => {
              removeHint?.();
              removeHint = undefined;
            };
            const refresh = async () => {
              const request = ++generation;
              try {
                const [response, providers] = await Promise.all([
                  scope.connection.api.llm.models({}), scope.connection.api.llm.providers({}),
                ]);
                if (disposed || request !== generation) return;
                const catalog = response.ok && providers.ok ? response.value : null;
                // A failed catalog or an existing provider retains the native
                // selector and its diagnostics. Never rewrite Session history.
                const empty = catalog?.groups.length === 0 && catalog.failures.length === 0 &&
                  !providers.value.providers.some(provider => provider.active);
                if (empty) {
                  removeHint ??= scope.slots.register(
                    {
                      name: "conversation.input.model", priority: -1000,
                      inject: (sessionId) => {
                        const available = scope.sessions.subagentAddress(sessionId) === undefined;
                        // Retain the native per-session composer block even when
                        // this hint is mounted before the original selector.
                        if (available) scope.modelDirectories.directoryFor(sessionId);
                        return { available };
                      },
                    }, ModelSetupHint,
                  );
                } else hide();
              } catch {
                if (!disposed && request === generation) hide();
              }
            };
            const stop = [
              scope.remote.$on("llm/adapters-updated", refresh),
              scope.remote.$on("settings/document-updated", refresh),
              scope.remote.$on("credentials/updated", refresh),
              scope.on("connection/reset", () => { hide(); void refresh(); }),
            ];
            void refresh();
            return () => {
              disposed = true;
              stop.forEach((dispose) => dispose());
              hide();
            };
          }, "openquantum: empty model catalog hint");
        });
        return () => fiber.dispose();
      });
    }
```

</details>

**依据 3 · 源码核查**：[packages/openquantum-web-branding/client.js:99-165](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/client.js#L99-L165)

实际设置筛选与覆盖

<details>
<summary>查看原文（67行）</summary>

```text
    function installMinimalSettings(ctx) {
      ctx.slots.inject("sidebar.settings", () => {
        const fiber = ctx.inject(["locale", "connection"], (scope) => {
          const { Modal, IconSettingsOutline16 } = require("@deepseek-ai/dsh-client-ui-primitives");
          scope.effect(() => scope.locale.register("settings", {
            zh: { trigger: "设置", title: "设置", close: "关闭", "general.nav": "通用设置",
              "connection.error": "连接异常", "connection.retry": "立即重连", "connection.connecting": "自动重连中",
              "connection.reconnect": "连接异常，点击立即重连", "connection.restart": "连接中断，正在自动重试，点击立即重连" },
            en: { trigger: "Settings", title: "Settings", close: "Close", "general.nav": "General",
              "connection.error": "Disconnected", "connection.retry": "Reconnect now", "connection.connecting": "Reconnecting",
              "connection.reconnect": "Disconnected, reconnect now", "connection.restart": "Reconnecting automatically, reconnect now" },
          }), "OpenQuantum settings chrome");
          const t = scope.locale.bind("settings");
          function MinimalSettings({ wide, renderSlot }) {
            const [open, setOpen] = React.useState(false);
            const [selected, select] = React.useState("general");
            const trigger = React.useRef(null);
            const navigation = React.useRef(null);
            React.useEffect(() => { if (open) navigation.current?.querySelector("button")?.focus(); }, [open]);
            React.useSyncExternalStore(
              (notify) => {
                const stopSlots = scope.slots.subscribe("settings.section", notify);
                const stopLocale = scope.locale.subscribe(notify);
                return () => { stopSlots(); stopLocale(); };
              },
              () => `${scope.slots.getVersion("settings.section")}:${scope.locale.getSnapshot().revision}`,
            );
            const sections = scope.slots.entriesOfSlot("settings.section")
              .filter(entry => ["general", "models", "openquantum-capabilities"].includes(entry.options.id))
              .map(entry => ({ id: entry.options.id, label: typeof entry.options.label === "function"
                ? entry.options.label() : entry.options.label }));
            const active = sections.some(section => section.id === selected) ? selected : sections[0]?.id;
            const close = () => { setOpen(false); trigger.current?.focus(); };
            return h(React.Fragment, null,
              h("button", { className: "oq-settings-trigger", ref: trigger, type: "button",
                "aria-label": t("trigger"), "aria-haspopup": "dialog", "aria-expanded": open, onClick: () => setOpen(true) },
                h(IconSettingsOutline16, { size: 20 }), wide && t("trigger")),
              h(Modal, { open, onClose: close, title: t("title"), closeLabel: t("close"),
                className: "oq-settings", contentClassName: "oq-settings-content",
              },
                h("nav", { className: "oq-settings-nav", ref: navigation }, ...sections.map(section => h("button", { key: section.id, type: "button",
                  "aria-current": section.id === active ? "page" : undefined, onClick: () => select(section.id) }, section.label)),
                  h("a", { className: "oq-settings-license", href: "https://github.com/xi-zhao/OpenQuantum/blob/main/THIRD_PARTY_NOTICES.md", target: "_blank", rel: "noreferrer" }, "OpenQuantum · © / MIT")),
                active && renderSlot("settings.section", { close }, { only: active }),
              ),
            );
          }
          scope.slots.register({ name: "sidebar.settings", priority: -1000,
            children: {
              "settings.section": { kind: "list", scope: "root" },
              "settings.action": { kind: "list", scope: "root" },
              "settings.onboarding": { kind: "list", scope: "root" },
            },
          }, MinimalSettings);
          scope.slots.inject("settings.section", () => scope.slots.register({
            name: "settings.section", id: "general", order: 0, label: () => t("general.nav"),
            children: { "settings.general.item": { kind: "list", scope: "root" } },
          }, ({ renderSlot }) => renderSlot("settings.general.item", {})));
        });
        return () => fiber.dispose();
      });
      // Preserve native window geometry and traffic lights without its developer menu.
      ctx.slots.inject("shell.overlay", () => ctx.slots.register({
        name: "shell.overlay", id: "desktop-frame-titlebar", priority: -1000,
      }, () => h("div", { className: "oq-desktop-titlebar" }, "OpenQuantum")));
    }

```

</details>

**依据 4 · 源码核查**：[packages/openquantum-web-branding/desktop.mjs:12-54](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/desktop.mjs#L12-L54)

schedule包装与条件恢复

<details>
<summary>查看原文（43行）</summary>

```text
export function installDesktopPresentation(runtime, authenticatedUrl = url => url, readLocale = () => undefined) {
  const original = runtime.schedule;
  const schedule = spec => {
    const url = new URL(spec.url);
    url.searchParams.set("dsh-desktop-mode", "compatibility");
    return original.call(runtime, {
      ...spec, mode: "compatibility", url: authenticatedUrl(url.href), iconPath, trayIcons,
      productName: "OpenQuantum", windowTitle: "OpenQuantum",
      readTrayMenu(languages) {
        const preference = readLocale();
        const locale = [preference, ...languages].filter(value => typeof value === "string")
          .map(value => value.toLowerCase().split("-")[0]).find(value => value === "zh" || value === "en") ?? "zh";
        return {
          openLabel: locale === "zh" ? "打开 OpenQuantum" : "Open OpenQuantum",
          quitLabel: locale === "zh" ? "退出 OpenQuantum" : "Quit OpenQuantum",
          showContributions: false,
          showModeSwitch: false,
        };
      },
    });
  };
  runtime.schedule = schedule;
  return () => { if (runtime.schedule === schedule) runtime.schedule = original; };
}

export function apply(ctx) {
  // The settings owner is a Desktop composition choice, independent of optional
  // copy/hint overrides on the shared web-branding plugin.
  ctx.inject(["webServer"], scope => {
    scope.effect(() => scope.webServer.tapIndex(html => html.includes('name="openquantum-minimal-settings"')
      ? html : html.replace("</head>", '<meta name="openquantum-minimal-settings" content="true" />\n</head>')),
    "OpenQuantum Desktop settings navigator");
  });
  ctx.effect(() => installDesktopPresentation(ctx.get("desktopRuntime"),
    url => ctx.openquantumWebSecurity.authenticatedUrl(url),
    () => ctx.settings.get("locale")?.preference), "OpenQuantum Desktop presentation");
  ctx.on("settings/updated", namespace => {
    // The source-built OpenQuantum shell provides this presentation interface.
    // Original third-party Desktop hosts retain their own native menu policy.
    if (namespace === "locale") ctx.desktopRuntime.refreshTrayMenu?.();
  });
  // The shell mounts after decoration. Profile disposal waits for shell cleanup;
  // restoring this method can run alongside cleanup of the existing shell.
```

</details>

#### 缺口

- 实际slot冲突、RPC变化及桌面菜单扩展兼容未运行
  **影响**：错误宿主版本可能丢设置入口或保留错误提示，不能以注册成功代替界面验收
  **进一步探讨**：逐项模拟空目录/失败/已有provider及热卸载，核原选择器、设置和托盘

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 打包和退出有哪些具体反证？

**研究主题**：缺陷与关键质疑

#### 完整回答

入口index.mjs直接import ./dsh-0.1.0.mjs，但package.files未列该文件；固定树中模块存在，尚未pack，不断言已发布tarball坏，独立打包安装必须核是否遗漏依赖。旧样式依赖特定DSH SVG viewBox/:has等装饰选择器，不能称全版本只用原生slot。brandCopyScript对整个document做文本替换/展开details并建MutationObserver，未保存disposer；热停Host路由不撤已打开页的脚本、style、标题或文本修改，需整页刷新。minimalSettings隐藏其他section和upstream welcome notice是设计取舍，第三方设置可能暂不可达。品牌不提供认证、量子工具或模型配置正确性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openquantum-web-branding/index.mjs:1-7](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/index.mjs#L1-L7)

直接依赖旧版样式模块

```text
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { legacyBrandStyles } from "./dsh-0.1.0.mjs";
import { OPENQUANTUM_BRAND } from "./identity.mjs";

```

**依据 2 · 源码核查**：[packages/openquantum-web-branding/package.json:10-19](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/package.json#L10-L19)

files未列dsh-0.1.0.mjs

<details>
<summary>查看原文（10行）</summary>

```text
  "files": [
    "assets",
    "client.js",
    "desktop.mjs",
    "cordis.patch.yml",
    "identity.mjs",
    "index.mjs",
    "README.md"
  ],
  "exports": {
```

</details>

**依据 3 · 源码核查**：[packages/openquantum-web-branding/dsh-0.1.0.mjs:1-17](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/dsh-0.1.0.mjs#L1-L17)

有限旧版CSS

<details>
<summary>查看原文（17行）</summary>

```text
// DSH Desktop 2.0.0 / Harness 0.1.0-rc.6 has no brand Slots. This
// version adapter owns the upstream decorative selectors. It is applied
// through tapIndex without removing React nodes or replacing native callbacks.
// Validate both selectors against the pinned client packages when upgrading.
export const legacyBrandStyles = `
  /* 2.0.0 has no brand slots. Style its two decorative marks through tapIndex;
     keep the original buttons, handlers and React-owned SVG nodes intact. */
  :root { --oq-lockup: url("/openquantum/lockup.svg"); --oq-mark: url("/openquantum/mark.svg"); }
  :root[style*="color-scheme: dark"] { --oq-lockup: url("/openquantum/lockup-inverse.svg"); --oq-mark: url("/openquantum/mark-inverse.svg"); }
  [data-slot="sidebar"] button:has(> svg[viewBox="0 0 182 24"]) { background-image: var(--oq-lockup); background-position: left center; background-repeat: no-repeat; background-size: contain; }
  [data-slot="sidebar"] button > svg[viewBox="0 0 182 24"] { visibility: hidden; }
  [data-slot="sidebar"] button:has(> svg[viewBox="0 0 23.16 17.04"]):not(:hover) { background-image: var(--oq-mark); background-position: center; background-repeat: no-repeat; background-size: 24px; }
  [data-slot="sidebar"] button > svg[viewBox="0 0 23.16 17.04"] { visibility: hidden; }
  [data-phase="hero"] span:has(> svg[viewBox="0 0 23.16 17.04"]) { background-image: var(--oq-mark); background-position: center; background-repeat: no-repeat; background-size: contain; }
  [data-phase="hero"] span > svg[viewBox="0 0 23.16 17.04"] { visibility: hidden; }

`;
```

</details>

**依据 4 · 源码核查**：[packages/openquantum-web-branding/index.mjs:101-166](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/index.mjs#L101-L166)

全页文本修改与无退出handle的observer

<details>
<summary>查看原文（66行）</summary>

```text
      const parent = node.parentElement;
      // The pinned layout restores its build-time product title after mounting.
      // Keep a session title intact while adapting only the product suffix.
      if (parent?.tagName === "TITLE") {
        const title = node.nodeValue.replace(/(^| — )DeepSeek Harness$/, "$1${OPENQUANTUM_BRAND.name}");
        if (title !== node.nodeValue) node.nodeValue = title;
        return;
      }
      const headline = parent?.previousElementSibling?.textContent?.trim();
      if (
        !${minimalUi} &&
        parent !== null &&
        heroPreviewLabels.has(node.nodeValue) &&
        heroHeadlines.has(headline)
      ) {
        parent.remove();
        return;
      }

      const replacement = replacements[node.nodeValue];
      if (replacement !== undefined) node.nodeValue = replacement;
      return;
    }

    for (const child of node.childNodes) replaceText(child);
  }

  function revealProviderConnectionSettings(node) {
    const element = node.nodeType === Node.ELEMENT_NODE
      ? node
      : node.parentElement;
    if (element === null) return;

    const candidates = [];
    if (element.matches?.("details")) candidates.push(element);
    for (const details of element.querySelectorAll?.("details") ?? []) {
      candidates.push(details);
    }
    for (const details of candidates) {
      const summary = details.querySelector(":scope > summary");
      if (connectionSettingLabels.has(summary?.textContent?.trim())) {
        details.open = true;
      }
    }
  }

  function enhance(node) {
    replaceText(node);
    if (!${minimalUi}) revealProviderConnectionSettings(node);
  }

  enhance(document.documentElement);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") {
        enhance(record.target);
        continue;
      }
      for (const node of record.addedNodes) enhance(node);
    }
  }).observe(document.documentElement, {
    characterData: true,
    childList: true,
    subtree: true,
  });
})();`;
```

</details>

**依据 5 · 源码核查**：[packages/openquantum-web-branding/client.js:123-130](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/client.js#L123-L130)

设置section筛选

```text
              },
              () => `${scope.slots.getVersion("settings.section")}:${scope.locale.getSnapshot().revision}`,
            );
            const sections = scope.slots.entriesOfSlot("settings.section")
              .filter(entry => ["general", "models", "openquantum-capabilities"].includes(entry.options.id))
              .map(entry => ({ id: entry.options.id, label: typeof entry.options.label === "function"
                ? entry.options.label() : entry.options.label }));
            const active = sections.some(section => section.id === selected) ? selected : sections[0]?.id;
```

#### 缺口

- pack产物、真实热卸载和上游UI变动未测试
  **影响**：独立安装可能缺模块而启动失败；热卸载可能继续品牌/文案修改，设置隐藏影响运维
  **进一步探讨**：先检查产物包含import依赖，隔离核卸载后全刷新与原UI恢复，不用于替代任何安全控制

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、资源和回退要准备什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Node>=24、DSH Web webServer及声明renderer/sidebar/conversation/settings，还需完整assets。普通cordis patch只插Web Host，desktop额外需desktopRuntime/openquantumWebSecurity/settings并依赖源构建的presentation扩展，第三方桌面菜单可能保原样。先明确是否启minimalUi/minimalSettings，保留原配置，不把branding包当root安装。资源是静态图标、浏览器observer与模型目录查询；无自身付费计算，但维护selector/slot兼容和桌面打包需人工。退出禁插件并完整刷新页面，桌面重启核schedule/菜单恢复；PWA快捷方式/图标缓存可能需手工刷新，不删会话/模型数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openquantum-web-branding/package.json:7-38](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/package.json#L7-L38)

Node和Web依赖

<details>
<summary>查看原文（32行）</summary>

```text
  "engines": {
    "node": ">=24"
  },
  "files": [
    "assets",
    "client.js",
    "desktop.mjs",
    "cordis.patch.yml",
    "identity.mjs",
    "index.mjs",
    "README.md"
  ],
  "exports": {
    ".": "./index.mjs",
    "./client": "./client.js",
    "./desktop": "./desktop.mjs",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/openquantum-web-branding/cordis.patch.yml:1-4](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/cordis.patch.yml#L1-L4)

默认仅Host插入

```text
- insert:
    - id: openquantum-web-branding
      name: '@openquantum/harness-web-branding'
      inject: [webServer]
```

**依据 3 · 源码核查**：[packages/openquantum-web-branding/desktop.mjs:3-10](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/desktop.mjs#L3-L10)

Desktop依赖

```text
export const name = "openquantum-desktop-branding";
export const inject = ["desktopRuntime", "openquantumWebSecurity", "settings"];
const iconPath = fileURLToPath(new URL("assets/desktop-icon-512.png", import.meta.url));
const trayIcons = Object.freeze({
  templatePath: fileURLToPath(new URL("assets/tray-iconTemplate.png", import.meta.url)),
  bluePath: fileURLToPath(new URL("assets/tray-icon-color.png", import.meta.url)),
});

```

**依据 4 · 源码核查**：[packages/openquantum-web-branding/index.mjs:309-327](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/index.mjs#L309-L327)

可选minimal参数

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx, { minimalUi = false, minimalSettings = false } = {}) {
  ctx.effect(
    () => ctx.webServer.tapIndex((html) => {
      let branded = brandHarnessIndex(html);
      for (const [enabled, marker] of [[minimalUi, "openquantum-minimal-ui"], [minimalSettings, "openquantum-minimal-settings"]]) {
        if (enabled && !branded.includes(`name="${marker}"`)) {
          branded = branded.replace("</head>", `<meta name="${marker}" content="true" />\n</head>`);
        }
      }
      return branded;
    }),
    "openquantum: native Harness Web branding",
  );
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: "exact",
        path: "/favicon.svg",
        handler: staticAssetHandler(
```

</details>

#### 缺口

- 本轮未安装/pack/刷新验证，兼容维护耗时与PWA刷新结果未知
  **影响**：不能承诺任意DSH可即装即退或不影响设置可达性
  **进一步探讨**：先隔离Web检查产物与所有原设置，失败即恢复原profile和完整刷新

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪品牌与简化的增量？

**研究主题**：新假设与验证

#### 完整回答

固定宿主比较原界面与品牌包，核同一任务下模型配置、会话/文件和第三方设置是否可达，记录误认与操作步骤；品牌变化本身不推科研效率。加入缺assets/遗漏模块、无head HTML、catalog失败、多个slot提供者、locale更新及热卸载，核失败留原界面和全刷新恢复。若隐藏必要设置、破坏标题/文案或独立包无法加载，停用本包回上游UI；量子任务效果另评root。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openquantum-web-branding/client.js:52-75](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/client.js#L52-L75)

目录失败保原选择器

<details>
<summary>查看原文（24行）</summary>

```text
                  scope.connection.api.llm.models({}), scope.connection.api.llm.providers({}),
                ]);
                if (disposed || request !== generation) return;
                const catalog = response.ok && providers.ok ? response.value : null;
                // A failed catalog or an existing provider retains the native
                // selector and its diagnostics. Never rewrite Session history.
                const empty = catalog?.groups.length === 0 && catalog.failures.length === 0 &&
                  !providers.value.providers.some(provider => provider.active);
                if (empty) {
                  removeHint ??= scope.slots.register(
                    {
                      name: "conversation.input.model", priority: -1000,
                      inject: (sessionId) => {
                        const available = scope.sessions.subagentAddress(sessionId) === undefined;
                        // Retain the native per-session composer block even when
                        // this hint is mounted before the original selector.
                        if (available) scope.modelDirectories.directoryFor(sessionId);
                        return { available };
                      },
                    }, ModelSetupHint,
                  );
                } else hide();
              } catch {
                if (!disposed && request === generation) hide();
```

</details>

**依据 2 · 源码核查**：[packages/openquantum-web-branding/index.mjs:265-286](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/index.mjs#L265-L286)

缺head和去重可测

<details>
<summary>查看原文（22行）</summary>

```text
export function brandHarnessIndex(html) {
  if (html.includes(BRAND_MARKER)) {
    return html;
  }

  if (!html.includes("</head>")) {
    throw new Error("OpenQuantum branding requires a Harness HTML head");
  }

  const titled = /<title>[^<]*<\/title>/.test(html)
    ? html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${OPENQUANTUM_BRAND.name}</title>`,
      )
    : html.replace(
        "</head>",
        `<title>${OPENQUANTUM_BRAND.name}</title></head>`,
      );
  return titled.replace(
    "</head>",
    `${BRAND_METADATA}\n${BRAND_STYLES}\n<script defer src="/openquantum-branding.js" ${BRAND_MARKER}></script>\n</head>`,
  );
```

</details>

**依据 3 · 源码核查**：[packages/openquantum-web-branding/desktop.mjs:30-35](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-branding/desktop.mjs#L30-L35)

条件恢复可测

```text
      },
    });
  };
  runtime.schedule = schedule;
  return () => { if (runtime.schedule === schedule) runtime.schedule = original; };
}
```

#### 缺口

- 没有本轮可用性对照或pack安装结果
  **影响**：不能把统一品牌或少导航项当已验证更易用
  **进一步探讨**：以设置可达/原UI恢复为底线，保截图与独立构建产物清单

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
