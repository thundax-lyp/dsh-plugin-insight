# DSH Browser Control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e916303](https://github.com/angelky7/dsh-browser-control/tree/e916303a920dcb15515ea826d6bde905e596e396)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/angelky7/dsh-browser-control) [![npm 30d 2,875](https://img.shields.io/static/v1?label=npm+30d&message=2%2C875&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@angelky7/dsh-browser-control) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@angelky7/dsh-browser-control)
<!-- END META -->

> **功能**：用原生DSH工具和本地WebSocket桥控制真实Chrome扩展，提供设置启停、策略与本地锁。

> **亮点**：[Q02](#research-q02)、[Q04](#research-q04)原生设置/工具接线、模型默认拒只读策略、扩展持久硬锁、写操作超时/掉线unknown及有限CDP重放，较裸控制接口有可解释边界。

> **主要限制**：[Q03](#research-q03)公开默认token、HTTP绕模型策略、Cookie只读仍敏感；[Q04](#research-q04)发送后取消只停等待却分类not_started/重试安全，可能误导副作用恢复，不可当浏览器已停止。

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
  - [Q01 · 原生浏览器控制给谁什么增量？](#detail-section-11)
  - [Q02 · 启停、策略和命令怎样真正走到CDP？](#detail-section-12)
  - [Q03 · Token/Origin和只读档分别保护哪一条入口？](#detail-section-13)
  - [Q04 · 取消与失败回执能否支持安全重试和退出？](#detail-section-14)
  - [Q05 · 生产方向应怎样利用已有锁和副作用回执？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：@angelky7/dsh-browser-control1.7.2是原生DSH Host bundle加独立Chrome扩展，模型工具经本地WS桥接已有真实浏览器，扩展用chrome.debugger/CDP执行。目标是需要Agent在自己已有登录态网站读取/交互的人；合格结果是正确tab/页面上的任务、可解释的人机权限与失败，而不是标签分组或工具多。原生插件不需额外MCP server，但仍依DSH的Node运行环境、pnpm安装与独立扩展，README“无需Node/npx/Python”只能理解为无需额外MCP运行栈。

DSH原生读取、Playwright/CDP/MCP与手工浏览；真实profile和CDP是Chrome能力，非新沙箱/身份隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生浏览工具 | 复用真实Chrome/CDP | 明确tab/权限，非主账号安全沙箱 |
| 模型策略 | readOnly/allowScript | 只模型面，cookies读仍敏感 |
| HTTP/WS | 本地桥接/脚本直控 | token/Origin范围，公开默认需改 |
| popup硬锁 | 本地人拦后续浏览命令 | 不撤在途动作/本机cleanup |
| 错误回执 | timeout/掉线unknown提示 | 发送后cancelled分类缺陷 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH工具/设置/cordis与pnpm | 必需 | 原生bundle/配置 | 宿主版本schema兼容需核 |
| 独立Chrome扩展>=对应协议 | 必需 | 真实CDP执行 | 离线/不兼容不能由工具注册补足 |
| debugger与真实profile | 必需 | DOM/输入/cookies | 等于触及真实账号，非新隔离 |
| 两端长随机token/可信本地边界 | 本文前提 | WS/HTTP身份 | dsh-local公开，不作秘密 |
| 专用shotsDir与人工恢复 | 文件/故障必需 | 截图/清理/副作用核 | cleanup删目录所有普通文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离profile/专用目录、改token | 保留Host批准，不接秘密 |
| 加载 | bundle与扩展分别装/核protocol | 端口在线非任务通过 |
| 只读 | 开readOnly/关脚本、明确tabId | cookies/readOnly仍需秘密边界 |
| 故障 | 锁定、取消/超时后查页面 | 当前cancelled不信重试安全 |
| 退出 | 停桥卸扩展撤debugger、确认站点结果 | 不自动撤在途CDP/已发提交 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/机器/模型金额未知 | 双装、token、协议/权限/目录配置 | 无额外MCP不等零依赖 |
| 持续 | 浏览器/截图/token未知 | 站点/扩展版本、策略与结果核对 | 无净节时实测 |
| 故障 | 未完成动作/文件资源未知 | 取消后查真实页面和重复提交 | 当前回执不能放心重试 |
| 退出 | 留存未知 | 停桥/锁/卸扩展、人工核专用目录 | 关闭不撤站点副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生控制 | 工具→WS→硬锁/CDP | 全任务/站点兼容与收益 |
| 策略 | 模型默认拒只读/脚本与独立硬锁 | HTTP持token仍可绕模型策略 |
| 恢复 | 写timeout/link_lost报unknown | cancelled却not_started矛盾 |
| 接管 | popup硬锁与软hold不同 | 在途停止/文档焦点一致 |

> **思考**：[Q03](#research-q03)公开默认token、HTTP绕模型策略、Cookie只读仍敏感；[Q04](#research-q04)发送后取消只停等待却分类not_started/重试安全，可能误导副作用恢复，不可当浏览器已停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)、[Q04](#research-q04)原生设置/工具接线、模型默认拒只读策略、扩展持久硬锁、写操作超时/掉线unknown及有限CDP重放，较裸控制接口有可解释边界。

扩展本地硬锁读失败冻结、模型策略默认拒、HTTP认证及有限CDP重放值得借鉴；权限层与结果层必须分开，取消分类需按是否已发送而非错误词统一推断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)公开默认token、HTTP绕模型策略、Cookie只读仍敏感；[Q04](#research-q04)发送后取消只停等待却分类not_started/重试安全，可能误导副作用恢复，不可当浏览器已停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察。隔离profile/长随机token/只读无秘密任务起步，HTTP token严格控；发送后取消一律先查真实页面，不信当前not_started。修复回执并验故障后再扩大写任务，敏感流程回手工。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持原生bridge/策略/硬锁设计，同时确认取消回执语义矛盾；当前观察，未执行浏览器/攻击/任务或verify。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、extension/background.js、extension/manifest.json、lib/index.js、package.json、src/errors.ts、src/index.ts、src/policy.ts、src/server.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package/patch、src Config/生命周期/设置与工具controller、policy完整白名单、server监听/认证/WS/发送/取消/清理、errors模型文案/分类，扩展硬锁/接收/CDP重放/目标/cookie/原始CDP；对照发行lib取消分类。未全审所有工具/AX/上传/网络/hold视觉与全部verify。
- 下一步：只读固定源码，未运行build/verify/Host/扩展/浏览器或攻击；一般冒烟为scope_boundary，取消矛盾静态确认但实际损害未复现，真实收益未知。

**分析版本**

- **仓库**：[angelky7/dsh-browser-control](https://github.com/angelky7/dsh-browser-control)
- **版本号**：1.7.2（[固定提交 e916303](https://github.com/angelky7/dsh-browser-control/tree/e916303a920dcb15515ea826d6bde905e596e396)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的发送/开始/完成/未知操作回执与文档代际绑定，以取消/重连/焦点故障集对照误重试/错目标和人审成本。

只读固定源码，未运行build/verify/Host/扩展/浏览器或攻击；一般冒烟为scope_boundary，取消矛盾静态确认但实际损害未复现，真实收益未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1779 | — | — | 45810 |
| .js | source | 10 | 8914 | 7389 | 1412 | — |
| .ts | source | 7 | 3115 | 2423 | 563 | — |
| .mjs | source | 30 | 5326 | 4131 | 927 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/angelky7/dsh-browser-control/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/angelky7/dsh-browser-control/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/angelky7/dsh-browser-control/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核真实浏览器执行、双入口策略与取消/重试副作用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生浏览器控制给谁什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

@angelky7/dsh-browser-control1.7.2是原生DSH Host bundle加独立Chrome扩展，模型工具经本地WS桥接已有真实浏览器，扩展用chrome.debugger/CDP执行。目标是需要Agent在自己已有登录态网站读取/交互的人；合格结果是正确tab/页面上的任务、可解释的人机权限与失败，而不是标签分组或工具多。原生插件不需额外MCP server，但仍依DSH的Node运行环境、pnpm安装与独立扩展，README“无需Node/npx/Python”只能理解为无需额外MCP运行栈。

相对独立Playwright/MCP浏览器，复用用户profile减少另登录步骤、可见标签便于人观察；代价是直接触及真实账号和浏览器状态。CDP、浏览器身份/会话和DSH工具服务是继承依赖；本组件增量是原生设置启停/工具、桥接鉴权、模型策略与扩展硬锁、错误副作用状态。公开网页只读若原生fetch已足够，不应增加debugger权限。

Root只加载Host半部，扩展要另行解压加载，最低Chrome116且incognito禁用；tool与扩展capabilities版本契约不能由同版本号代验收。本次不执行verify或真实浏览器，作者功能与安装30秒不当独立效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-61](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/README.md#L28-L61)

作者定位/与MCP对比。

<details>
<summary>查看原文（34行）</summary>

````text
## 这是什么

不是无头浏览器，不是 Puppeteer——是你的**真实 Chrome**，带着你的登录态、你的 cookies。AI 通过 Chrome DevTools Protocol 驱动标签页，你可以在屏幕上看到每一步操作。

```
你对 AI 说一句话
      ↓
Agent 调用 browser_* 工具
      ↓
DSH 插件（WebSocket 桥）
      ↓
Chrome 扩展（CDP 驱动）
      ↓
你的真实浏览器执行操作
      ↓
结果返回给 Agent
```

## 和 MCP 浏览器方案的区别

市面上已经有 Playwright MCP、Puppeteer MCP、browser-use 等，它们的共同点：启动一个**自己下载的全新浏览器实例**。本项目走的是另一条路：

| | 本项目 | Playwright / Puppeteer MCP |
|---|---|---|
| 浏览器 | 你正在用的真实 Chrome | 自动下载的独立实例 |
| 登录态 / Cookies | ✅ 全部继承，无需重新登录 | ❌ 每次全新 profile |
| 过验证码 / 扫码登录 | 你的会话已经登录，基本不遇到 | 经常卡在登录墙 |
| 可见性 | 屏幕上实时可见，agent 新建的标签自动归进 `DSH` 分组，随时鼠标接管 | 无头运行或独立窗口 |
| 环境依赖 | 无需 Node / npx / Python | 需要 npx 或 uvx 运行时 |
| 接入方式 | 加载扩展 + 设置页开关 | 编辑 MCP 客户端 JSON 配置 |
| 磁盘占用 | 复用现有 Chrome，零新增 | 额外下载数百 MB 浏览器 |
| 集成深度 | dsh 原生插件（状态页 / 清理按钮；设置页卡片由宿主版本决定，见下） | 通用 MCP server |

一句话：**要 AI 用"你自己的"浏览器干活（已登录的 B 站、知乎、淘宝后台），用本项目；要做跨浏览器、跨应用的通用自动化测试，用 MCP。**
````

</details>

**依据 2 · 作者声明**：[README.md:63-80](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/README.md#L63-L80)

扩展另装与插件安装前置。

<details>
<summary>查看原文（18行）</summary>

```text
## 下载

| 文件 | 说明 |
|---|---|
| [DSH-Browser-Control-v1.7.2.zip](https://github.com/angelky7/dsh-browser-control/releases/download/v1.7.2/DSH-Browser-Control-v1.7.2.zip) | Chrome 扩展（解压后加载；这一版新增 cdp 通道与 capabilities 握手，**必须重装——也是最后一次因功能更新而重装**，此后 CDP 层新能力只更 dsh 插件） |
| [dsh-browser-control-plugin-v1.7.2.zip](https://github.com/angelky7/dsh-browser-control/releases/download/v1.7.2/dsh-browser-control-plugin-v1.7.2.zip) | dsh 插件（离线兜底，在线装直接用方式 A/B） |

## 安装 Chrome 扩展（30 秒）

下载 zip → 解压到固定文件夹（别删）→ Chrome 打开 `chrome://extensions` → 开启「开发者模式」→ 点「加载已解压的扩展程序」→ 选解压后的文件夹。

工具栏出现鲸鱼图标 → 绿点呼吸 = 已连接。需要 Chrome 116+。

## 安装 dsh 插件

📦 本包是 bundle 包（package.json 中 `dsh.bundle.patch` 指向 `cordis.patch.yml`）。`dsh plugin` 安装成功后会自动把它加入 profile 的 `dsh.profile.bundles`，重启即加载。

前置：`dsh plugin` 转发给 pnpm，需要 pnpm 在 PATH 上；首次使用会自动初始化目标 profile。
```

</details>

**依据 3 · 源码核查**：[package.json:1-41](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/package.json#L1-L41)

原生bundle/版本/许可。

<details>
<summary>查看原文（41行）</summary>

```text
{
  "name": "@angelky7/dsh-browser-control",
  "description": "Local WebSocket bridge between dsh and the DSH Browser Control browser extension, with model-facing browser_* tools and a Settings-managed on/off switch",
  "version": "1.7.2",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./invariant": {
      "types": "./lib/types/invariant.d.ts",
      "default": "./lib/invariant.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib/index.js",
    "lib/invariant.js",
    "lib/types/**/*.js",
    "lib/types/**/*.d.ts",
    "README.md",
    "README.en.md",
    "llms.txt",
    "LICENSE"
  ],
  "license": "AGPL-3.0-only",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json && tsdown",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "check": "npm run typecheck && npm run build && publint",
    "verify": "node verify/verify_config_patch.mjs && node verify/verify_peers.mjs && node verify/verify_surface.mjs && node verify/verify_tab_groups.mjs && node verify/verify_tabs_close_many.mjs && node verify/verify_cdp_retry.mjs && node verify/verify_snapshot_ax.mjs && node verify/verify_hard_lock.mjs && node verify/verify_policy.mjs && node verify/verify_cookies.mjs && node verify/verify_extension_e2e.mjs && node verify/verify_plugin.mjs legacy && node verify/verify_plugin.mjs conflict && node verify/verify_plugin.mjs new && node verify/verify_http.mjs && node verify/verify_errors.mjs && node verify/verify_hold.mjs && node verify/verify_protocol.mjs && node verify/verify_bundle_http.mjs && node verify/verify_nav_report.mjs && node verify/verify_nav_landing.mjs && node verify/verify_render_contract.mjs && node verify/verify_press_events.mjs && node verify/verify_nav_timeout.mjs && node verify/verify_nav_waituntil.mjs && node verify/verify_archive.mjs && node verify/verify_windows.mjs && node verify/verify_history_nav.mjs && node verify/verify_metrics_throttle.mjs && node verify/verify_compat_matrix.mjs"
  },
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:8-14](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/cordis.patch.yml#L8-L14)

真实原生加载和默认token。

```text
- insert:
    - id: browser-bridge
      name: '@angelky7/dsh-browser-control'
      config:
        enabled: true
        port: 9777
        token: dsh-local
```

**依据 5 · 源码核查**：[extension/manifest.json:1-33](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/manifest.json#L1-L33)

debugger权限/最低Chrome/非隐私。

<details>
<summary>查看原文（33行）</summary>

```text
{
  "manifest_version": 3,
  "name": "DSH Browser Control",
  "short_name": "DSH Bridge",
  "version": "1.7.2",
  "description": "让 DeepSeek Harness (dsh) 通过本地桥接服务控制浏览器：导航、读内容、执行 JS、点击、输入、按键、截图。",
  "minimum_chrome_version": "116",
  "permissions": [
    "debugger",
    "tabs",
    "tabGroups",
    "storage",
    "alarms"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "DSH Browser Control",
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "incognito": "not_allowed"
}
```

</details>

**依据 6 · 源码核查**：[src/index.ts:1875-1887](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/index.ts#L1875-L1887)

真实工具注册与生命周期。

<details>
<summary>查看原文（13行）</summary>

```text
	})

	// Activation converges loudly so a bad port fails the plugin at load;
	// later settings commits degrade to recorded errors instead.
	controller.reconcile(resolved, { throwOnError: resolved.enabled }).catch((error) => {
		throw new Error(`browser-bridge: ${errorMessage(error)}`)
	})

	applyBrowserTools(ctx, controller)
	ctx.effect(() => () => {
		void controller.stop()
	}, 'browser-bridge: server lifecycle')
}
```

</details>

#### 缺口

- 真实站点/登录态任务效果与扩展/Host组合兼容未验。
  **影响**：不能按作者对比断言优于所有MCP或任务省时。
  **进一步探讨**：独立profile对照原生fetch/已配置浏览器工具完成一个无敏感任务并记录人审。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启停、策略和命令怎样真正走到CDP？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Config默认enabled=true、9777、公开token dsh-local、readOnly=false、allowScript=true。reconcile遇端口/token/目录变更先停旧server再起新，关闭时不监听；设置兼容旧register与新schema投影，失败可回profile权威配置，不代表每个Host版本都实测。模型工具controller.execute先policyGate，再server.execute带exec.signal；只读白名单默认拒新命令，allowScript只拦eval，本机cleanup也单独过模型闸门。只读不是秘密脱敏：cookies.get被允许且实际Network.getCookies回原值，页面/网络/截图同样可能敏感。

server给每调用randomUUID，pending先登记，向扩展发command；扩展handleBridgeMessage直接runCommand，先读本地hardLock，接着holdRefusal，再找COMMANDS执行。硬锁状态读失败按冻结，解锁仅runtime消息popup路径，WS命令表无解锁原语；它拦的是后续命令，不撤已在CDP运行的动作。hold是页面DOM软浮层，模型可撤且导航可丢，不是等价安全开关。

CDP真实withCDP attach后执行，遇detached只在闭包第一条CDP调用失败时重attach重试一次，后续调用失败不重放整串点击/输入，降低重复风险但不能证明第一条已发写调用绝无副作用。没有指定tab时resolveTab用lastFocusedWindow激活页，否则第一tab，操作者焦点变化可能改目标，推荐明确tabId并每次核页面。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:112-120](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/index.ts#L112-L120)

真实默认配置。

```text
export const Config: z<Config> = z.object({
	enabled: z.boolean().default(true),
	port: z.number().step(1).min(1024).max(65_535).default(9777),
	token: z.string().default('dsh-local'),
	shotsDir: z.string().default('dsh-browser-shots'),
	readOnly: z.boolean().default(false),
	allowScript: z.boolean().default(true),
})

```

**依据 2 · 源码核查**：[src/index.ts:249-274](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/index.ts#L249-L274)

reconcile停旧/起新。

<details>
<summary>查看原文（26行）</summary>

```text
	private async reconcileNow(config: ResolvedConfig): Promise<void> {
		const shotsDir = path.resolve(config.shotsDir)
		const key = config.enabled ? `${config.port}|${config.token}|${shotsDir}` : ''
		if (key === this.serverKey) return
		const previous = this.server
		this.server = undefined
		this.serverKey = ''
		await previous?.stop()
		if (!config.enabled) {
			this.lastError = undefined
			return
		}
		const server = new BridgeServer({ port: config.port, token: config.token, shotsDir, log: this.log })
		try {
			await server.start()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.lastError = `桥接启动失败（端口 ${config.port}）: ${message}`
			this.log(this.lastError!)
			throw error instanceof Error ? error : new Error(message)
		}
		this.server = server
		this.serverKey = key
		this.lastError = undefined
	}

```

</details>

**依据 3 · 源码核查**：[src/index.ts:286-325](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/index.ts#L286-L325)

模型策略与cleanup真实闸门。

<details>
<summary>查看原文（40行）</summary>

```text
	async execute(command: string, params: Record<string, unknown>, signal: AbortSignal, timeoutMs?: number): Promise<unknown> {
		this.policyGate(command, params)
		const server = this.server
		if (server === undefined) {
			throw classify(command, new Error(
				this.lastError ?? '浏览器控制未启用 —— 在 profile 的 cordis.patch.yml 里给 browser-bridge 配 enabled: true（dsh 0.1.7+ 的宿主也会在设置 → 插件 自动列出本插件开关；0.1.2 及更早的宿主没有这张卡片，只能改配置文件）',
			))
		}
		return server.execute(command, params, timeoutMs === undefined ? { signal } : { signal, timeoutMs })
	}

	/**
	 * Refuse a command the local policy forbids, before anything is sent or deleted.
	 *
	 * The gate sits above the link and above the filesystem, not inside either: a
	 * refused command must not leave a side effect behind. Reading `current` on every
	 * call is what makes a settings edit take effect live.
	 * @param command - extension command name, or a `LOCAL_DESTRUCTIVE_COMMANDS` name.
	 * @param params - the command's params: action-bearing commands (`hold`) need them so a
	 *   read-only action (`status`) is not judged by the command name alone.
	 */
	private policyGate(command: string, params?: Record<string, unknown>): void {
		const refusal = policyRefusal(command, {
			readOnly: this.current?.readOnly === true,
			allowScript: this.current?.allowScript !== false,
		}, params)
		if (refusal !== undefined) throw new BridgeError(command, 'blocked_by_policy', 'not_started', refusal)
	}

	/**
	 * Delete generated artifacts using the currently resolved directories;
	 * works while the bridge is stopped because it never touches the socket.
	 * @returns counts and names of what was removed.
	 */
	async cleanup(): Promise<{ shotsRemoved: number; scratchRemoved: readonly string[] }> {
		// cleanup() 不经过 execute()，所以它必须自己站一次闸门：否则只读档下
		// 模型仍能用 browser_cleanup 删掉用户的整个截图目录。
		this.policyGate('cleanup')
		const dir = this.shotsDir
		if (dir === undefined) throw classify('cleanup', new Error('browser-bridge is not configured yet —— 浏览器控制尚未加载配置，无法确定清理目录'))
```

</details>

**依据 4 · 源码核查**：[src/policy.ts:20-40](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/policy.ts#L20-L40)

只读白名单含cookies.get。

<details>
<summary>查看原文（21行）</summary>

```text
/** 只读档允许的命令：读页面、读扩展自己的缓冲、或者把页面**内容**落到本机文件。 */
export const READ_ONLY_ALLOWED: ReadonlySet<string> = new Set([
	// 身份与链路探测
	'ping', 'browser.info',
	// 读页面
	'content', 'find', 'snapshot', 'screenshot', 'pdf', 'wait',
	// 读扩展采集到的缓冲
	'tabs.list', 'console.log', 'network.log',
	// 读窗口清单（几何/状态/tabIds）；open/update/close/moveTab 改窗口，不在此列
	'windows.list',
	// 读浏览器自己的状态（cookie 是凭据，但 get 不改任何东西；set/remove 不在此列）
	'cookies.get',
	// 读性能计数器（Performance.getMetrics）：纯粹读，重试无损害；节流（emulate
	// 的 network/cpu 参数）改页面加载行为，emulate 整体仍是写命令，不在此列。
	'metrics',
])

/**
 * 会执行**任意页面脚本**的扩展命令。这条与只读档分开管，因为用户可能想「可以读、
 * 也可以点，但别在我页面里跑任意 JS」——`browser_evaluate` 能绕开其他所有工具做的事。
 */
```

</details>

**依据 5 · 源码核查**：[src/policy.ts:86-106](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/policy.ts#L86-L106)

真实默认拒绝/脚本/hold策略。

<details>
<summary>查看原文（21行）</summary>

```text
	if (!flags.allowScript && SCRIPT_COMMANDS.has(command)) {
		return `在页面里执行任意脚本已被关闭（allowScript: false）：命令 ${command} 被拒绝，没有向浏览器发出任何操作。`
			+ `要读页面内容请改用 browser_read / browser_snapshot / browser_find；确实需要执行脚本时，${CONFIG_HINT}之后再说。`
	}
	if (flags.readOnly && LOCAL_DESTRUCTIVE_COMMANDS.has(command)) {
		return `只读模式已开启（readOnly: true）：命令 ${command} 会删除本机保存的截图与临时文件，删除不可逆，所以已被拒绝，没有任何文件被删除。`
			+ `只读档的含义是「什么都不要改」，清理属于改动；要释放磁盘请由用户自己关掉 readOnly，${CONFIG_HINT}。不要原地重试本命令。`
	}
	// `hold` 带动作：on/off 改页面 DOM，status 只读（读 session 条目 + 探页面上那层还在不在），
	// 所以只读档放行 status——只读档不该连「看一眼浮层现在是什么状态」都不让。
	const isReadOnlyAction = command === 'hold' && params?.action === 'status'
	if (flags.readOnly && PAGE_MUTATING_COMMANDS.has(command) && !isReadOnlyAction) {
		return `只读模式已开启（readOnly: true）：命令 ${command} 会往页面里插入一层接管浮层（改页面 DOM），已被拒绝，没有向浏览器发出任何操作。`
			+ `浮层是给用户看的提示层，不是安全边界；只读档里连这种「只是提示」的改动也一并拒绝。要开浮层请由用户关掉 readOnly，${CONFIG_HINT}不要原地重试本命令。`
	}
	if (flags.readOnly && !READ_ONLY_ALLOWED.has(command) && !isReadOnlyAction) {
		return `只读模式已开启（readOnly: true）：命令 ${command} 会改变页面或浏览器状态，已被拒绝，没有向浏览器发出任何操作。`
			+ `只读模式下可用的工具是读页面与读日志那几类；要放开写操作，${CONFIG_HINT}不要原地重试本命令。`
	}
	return undefined
}
```

</details>

**依据 6 · 源码核查**：[src/server.ts:249-294](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L249-L294)

UUID/pending/发送与signal。

<details>
<summary>查看原文（46行）</summary>

```text
   * Send one command to the connected extension and await its result.
   * Throws while no extension is linked; the rejection message names the fix.
   */
  async execute(command: string, params: Record<string, unknown>, options: BridgeExecuteOptions = {}): Promise<unknown> {
    const socket = this.clientSocket
    if (socket === undefined) {
      throw classify(command, new Error('no browser extension connected — open the browser that has the DSH Browser Control extension installed'))
    }
    const timeoutMs = Math.min(MAX_COMMAND_TIMEOUT_MS, Math.max(1, options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS))
    const signal = options.signal
    if (signal?.aborted) throw new Error(`browser command cancelled before send: ${command}`)
    const id = randomUUID()
    const entry: PendingEntry = {
      command,
      resolve: () => {},
      reject: () => {},
      timer: setTimeout(() => {
        if (!this.pending.delete(id)) return
        entry.reject(new Error(`browser command timed out after ${timeoutMs}ms: ${command}`))
      }, timeoutMs),
    }
    const result = new Promise<unknown>((resolve, reject) => {
      entry.resolve = resolve
      entry.reject = reject
    })
    if (signal !== undefined) {
      entry.onAbort = (): void => {
        if (!this.pending.delete(id)) return
        entry.reject(new Error(`browser command cancelled: ${command}`))
      }
      signal.addEventListener('abort', entry.onAbort, { once: true })
    }
    this.pending.set(id, entry)
    this.log(`-> ${command} (${id})`)
    socket.write(encodeTextFrame(JSON.stringify({ type: 'command', id, command, params })))
    try {
      return await result
    } catch (error) {
      // One choke point: everything above this line that can fail is a link or
      // extension failure, and the caller needs to know whether the page may
      // already have been changed. See src/errors.ts.
      throw classify(command, error)
    } finally {
      clearTimeout(entry.timer)
      if (entry.onAbort !== undefined && signal !== undefined) signal.removeEventListener('abort', entry.onAbort)
    }
```

</details>

**依据 7 · 源码核查**：[extension/background.js:748-783](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L748-L783)

实际runCommand/硬锁/软hold/目标解析。

<details>
<summary>查看原文（36行）</summary>

```text

function handleBridgeMessage(msg) {
	if (msg.type === 'ping') { send({ type: 'pong', t: msg.t }); return; }
	if (msg.type === 'command' && typeof msg.id === 'string') {
		runCommand(msg.command, msg.params ?? {})
			.then((result) => send({ type: 'result', id: msg.id, ok: true, result }))
			.catch((err) => send({ type: 'result', id: msg.id, ok: false, error: String((err && err.message) || err) }));
	}
}

async function runCommand(command, params) {
	await syncHardLock();
	if (hardLocked) throw new Error(hardLockRefusal(command));
	const handler = COMMANDS[command];
	if (!handler) throw new Error(`unknown command: ${command}`);
	// 接管浮层上的「中止操作」：只拦写页面那四条，且只在页面上的浮层还在时拦
	//（页面一导航浮层就没了，那时把存储里那条清掉并放行，不许假装还挡着）。
	const held = await holdRefusalFor(command, params);
	if (held !== null) throw new Error(held);
	return handler(params);
}

/* ------------------------------------------------------------ tab helpers */

async function resolveTab(tabId) {
	if (tabId !== undefined && tabId !== null) {
		const tab = await chrome.tabs.get(tabId);
		return tab;
	}
	const [focused] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	if (focused) return focused;
	const all = await chrome.tabs.query({});
	if (all.length > 0) return all[0];
	throw new Error('no tab available');
}

```

</details>

**依据 8 · 源码核查**：[extension/background.js:251-263](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L251-L263)

锁读失败冻结。

<details>
<summary>查看原文（13行）</summary>

```text
	if (hardLockLoaded) return;
	try {
		const stored = await chrome.storage.local.get([HARD_LOCK_KEY]);
		hardLocked = stored[HARD_LOCK_KEY] === true;
		hardLockReason = 'user';
		hardLockLoaded = true;
	} catch (err) {
		// 读不到锁的状态时按「锁着」处理。panic switch 唯一的失败方式就是「以为锁着
		// 其实没锁」，而 fail-open 恰好是那种失败；这里宁可让模型多做一次询问。
		// 不置 hardLockLoaded：下一条命令再读一次，存储恢复后自愈。
		// 用户仍然能解：弹窗那条通道走的是内存里的 setHardLock，不依赖这次读。
		hardLocked = true;
		hardLockReason = 'unreadable';
```

</details>

**依据 9 · 源码核查**：[extension/background.js:2703-2718](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L2703-L2718)

实际popup解锁路径。

<details>
<summary>查看原文（16行）</summary>

```text
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
	if (msg?.type === 'bridgeStatus') {
		sendResponse({ state: wsState, cfg, helloInfo, lastError, locked: hardLocked, lockReason: hardLocked ? hardLockReason : 'none' });
		return false;
	}
	if (msg?.type === 'lockSet') {
		// The lock is set from the popup only (see the local-lock section): this
		// channel cannot be reached by the bridge, so "unlock from the browser"
		// is enforced by where the code lives, not by who asks nicely.
		// Fail closed: only an explicit `locked: false` unlocks, so a malformed
		// message cannot quietly unfreeze the browser.
		setHardLock(msg.locked !== false)
			.then((locked) => sendResponse({ locked }))
			.catch((err) => sendResponse({ locked: hardLocked, error: String((err && err.message) || err) }));
		return true;
	}
```

</details>

**依据 10 · 源码核查**：[extension/background.js:1190-1201](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L1190-L1201)

实际有限CDP重放。

<details>
<summary>查看原文（12行）</summary>

```text
	const call = (method, params) => { sends++; return dbgSend(tabId, method, params); };
	await ensureAttached(tabId);
	const started = sends;
	try {
		return await fn(call);
	} catch (error) {
		if (error?.code !== 'cdp_detached' || sends > started + 1) throw error;
		await ensureAttached(tabId);
		return fn(call);
	}
}

```

</details>

**依据 11 · 源码核查**：[extension/background.js:333-345](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L333-L345)

真实cookie读取。

<details>
<summary>查看原文（13行）</summary>

```text
async function cmdCookiesGet(params) {
	const tab = await resolveTab(params.tabId);
	const domain = typeof params.domain === 'string' && params.domain.length > 0 ? params.domain.toLowerCase() : null;
	return withCDP(tab.id, async (send) => {
		await send('Network.enable').catch(() => {});
		const res = await send('Network.getCookies', { urls: [tab.url] })
			.catch((e) => { throw new Error(`Network.getCookies failed: ${e.message}`); });
		const all = Array.isArray(res && res.cookies) ? res.cookies : [];
		const cookies = (domain ? all.filter((c) => String(c.domain || '').toLowerCase().includes(domain)) : all)
			.map(cookiesNormalize)
			.sort((a, b) => a.name.localeCompare(b.name) || a.domain.localeCompare(b.domain));
		return { tabId: tab.id, url: tab.url, count: cookies.length, total: all.length, cookies };
	});
```

</details>

#### 缺口

- 全部工具/hold页面/第一CDP写失效时序与焦点竞争未运行。
  **影响**：不能把硬锁/有限重试当事务取消或零重复。
  **进一步探讨**：用两个测试tab/焦点变化和CDP首/后调用失败，核实际目标/动作/硬锁拒绝。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Token/Origin和只读档分别保护哪一条入口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

WS要求token、回环Host和可信Origin。tokenMatches恒时等长比较，Origin允许空、任意浏览器扩展scheme及回环HTTP(S)，不固定扩展ID；所以是持有token和本地可达的信任域，不是证明真实特定扩展。默认dsh-local公开且启动只是告警，不强制生成随机秘密，安装前应改两端一致长随机token。默认只监听127.0.0.1能缩网络范围，但同用户/本地进程与profile可读秘密仍须信任，不能称多用户授权平台。

HTTP /api/command与/api/cleanup确实要同token（Bearer/X-Token/query），无CORS放行，/和/api/status免认证回状态/截图目录等。关键是HTTP直接server.execute/cleanup，绕模型controller.policyGate，所以readOnly/allowScript只管模型工具面；有token者仍能发原始cdp、eval或删本地截图。扩展硬锁能拦经扩展的浏览动作，不能拦插件本机cleanup。该划分文档有说明，是显式边界，不能把模型只读当整个bridge安全只读。

cleanupArtifacts删除shotsDir内所有普通文件，并清cwd匹配pattern文件，不只验证每件是本插件生成；shotsDir必须专用且无重要文件，权限/存储归属需人核。CDP debug权限可接当前tab cookies/任意脚本/原始协议，真实账号内容可进入模型与本地文件，没有统一DLP或站点级批准策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.ts:463-490](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L463-L490)

WS实际token/Host/Origin。

<details>
<summary>查看原文（28行）</summary>

```text

  private handleUpgrade(req: http.IncomingMessage, socket: net.Socket): void {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (url.pathname !== '/ws') {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      socket.destroy()
      return
    }
    if (!tokenMatches(url.searchParams.get('token') ?? '', this.options.token)) {
      this.log('websocket rejected: bad token')
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
      return
    }
    // A WebSocket handshake is not CORS-guarded, so a page could dial 127.0.0.1 freely if
    // it had a token to present. Origin and Host pin it down: no web-scheme caller, and no
    // hostname that resolves back to the loopback via rebinding.
    if (!isLoopbackHost(String(req.headers.host ?? ''))) {
      this.log(`websocket rejected: host ${req.headers.host}`)
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      socket.destroy()
      return
    }
    const origin = typeof req.headers.origin === 'string' ? req.headers.origin : ''
    if (!isTrustedUpgradeOrigin(origin)) {
      this.log(`websocket rejected: origin ${origin}`)
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      socket.destroy()
```

</details>

**依据 2 · 源码核查**：[src/server.ts:635-661](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L635-L661)

恒时token与实际Origin允许范围。

<details>
<summary>查看原文（27行）</summary>

```text
function tokenMatches(presented: string, expected: string): boolean {
  const a = Buffer.from(presented, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * `Host` must name the loopback address this server binds. Rejecting anything else is
 * what stops a rebinding setup (a public hostname resolving to 127.0.0.1) from reaching
 * the bridge through the browser.
 */
function isLoopbackHost(host: string): boolean {
  const withoutPort = host.replace(/:\d+$/, '')
  return withoutPort === '127.0.0.1' || withoutPort === 'localhost' || withoutPort === '[::1]' || withoutPort === '::1'
}

/**
 * An `Origin` of a web scheme means a page opened the socket — WebSocket handshakes are
 * not covered by CORS, so that has to be refused here. Extension schemes (`chrome-extension:`
 * etc.) and non-browser clients that send no Origin at all are accepted.
 */
function isTrustedUpgradeOrigin(origin: string): boolean {
  if (origin === '') return true
  if (/^(?:chrome|moz|ms|safari)-extension:\/\//.test(origin)) return true
  return /^https?:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::\d+)?$/.test(origin)
}
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:8-14](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/cordis.patch.yml#L8-L14)

公开默认token。

```text
- insert:
    - id: browser-bridge
      name: '@angelky7/dsh-browser-control'
      config:
        enabled: true
        port: 9777
        token: dsh-local
```

**依据 4 · 源码核查**：[src/server.ts:336-395](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L336-L395)

HTTP认证/免认证状态/直接命令与cleanup。

<details>
<summary>查看原文（60行）</summary>

```text
   * Whether a request carries the bridge token, the same credential the WebSocket
   * upgrade checks. Accepted forms: `Authorization: Bearer <token>`, `X-Token: <token>`
   * and `?token=<token>` (the query form exists for curl and for the status page).
   */
  private authorized(req: http.IncomingMessage, url: URL): boolean {
    const authorization = req.headers.authorization
    const header = typeof authorization === 'string' && /^bearer\s+/i.test(authorization)
      ? authorization.replace(/^bearer\s+/i, '')
      : typeof req.headers['x-token'] === 'string'
        ? (req.headers['x-token'] as string)
        : ''
    const presented = header.length > 0 ? header : (url.searchParams.get('token') ?? '')
    return tokenMatches(presented, this.options.token)
  }

  private rejectUnauthenticated(res: http.ServerResponse, route: string): void {
    this.log(`http ${route}: rejected (missing or wrong token)`)
    this.respondJson(res, 401, {
      ok: false,
      error: 'unauthorized: pass the bridge token as "Authorization: Bearer <token>", "X-Token: <token>" or ?token=<token>',
    })
  }

  private handleHttp(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url ?? '/', 'http://localhost')
    if (req.method === 'OPTIONS') {
      // No cross-origin access is granted any more: the status page is same-origin and
      // the extension only ever talks over the WebSocket. Answering a preflight without
      // `Access-Control-Allow-Origin` is what makes the browser block the real request.
      res.writeHead(204)
      res.end()
      return
    }
    if (url.pathname === '/api/status' && req.method === 'GET') {
      this.respondJson(res, 200, { ok: true, ...this.status, wsUrl: `ws://127.0.0.1:${this.options.port}/ws`, shotsDir: path.resolve(this.options.shotsDir) })
      return
    }
    if (url.pathname === '/api/cleanup' && req.method === 'POST') {
      // Deletes files, so it authenticates like the command endpoint does.
      if (!this.authorized(req, url)) {
        this.rejectUnauthenticated(res, 'POST /api/cleanup')
        return
      }
      void this.cleanup().then(
        (result) => this.respondJson(res, 200, { ok: true, ...result }),
        (error) => this.respondJson(res, 500, { ok: false, error: errorMessage(error) }),
      )
      return
    }
    if (url.pathname === '/api/command' && req.method === 'POST') {
      // Reaches the extension command table (eval / click / input / screenshot), so it
      // used to be the whole attack surface; 127.0.0.1 alone never was a boundary.
      if (!this.authorized(req, url)) {
        this.rejectUnauthenticated(res, 'POST /api/command')
        return
      }
      this.handleCommandRequest(req, res)
      return
    }
    if (url.pathname === '/' && req.method === 'GET') {
```

</details>

**依据 5 · 源码核查**：[extension/background.js:1443-1448](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L1443-L1448)

原始CDP真实透传。

```text
async function cmdCdp(params) {
	if (!params.method || typeof params.method !== 'string') throw new Error('params.method is required');
	if (!/^[A-Z][A-Za-z]+\.[A-Za-z]+$/.test(params.method)) throw new Error(`params.method must look like "Domain.method" — got ${JSON.stringify(params.method)}`);
	const tab = await resolveTab(params.tabId);
	return withCDP(tab.id, (send) => send(params.method, params.params ?? {}));
}
```

**依据 6 · 源码核查**：[src/server.ts:129-146](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L129-L146)

cleanup实际删除范围。

<details>
<summary>查看原文（18行）</summary>

```text
export async function cleanupArtifacts(options: { shotsDir: string; scratchDir?: string }): Promise<CleanupResult> {
	await mkdir(options.shotsDir, { recursive: true })
	const shotsEntries = await readdir(options.shotsDir, { withFileTypes: true })
	let shotsRemoved = 0
	for (const entry of shotsEntries) {
		if (!entry.isFile()) continue
		await rm(path.join(options.shotsDir, entry.name))
		shotsRemoved += 1
	}
	const scratchDir = options.scratchDir ?? process.cwd()
	const scratchEntries = await readdir(scratchDir, { withFileTypes: true }).catch(() => [])
	const scratchRemoved: string[] = []
	for (const entry of scratchEntries) {
		if (!entry.isFile() || !SCRATCH_FILE_PATTERN.test(entry.name)) continue
		await rm(path.join(scratchDir, entry.name))
		scratchRemoved.push(entry.name)
	}
	return { shotsRemoved, scratchRemoved }
```

</details>

**依据 7 · 作者声明**：[README.md:186-198](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/README.md#L186-L198)

作者明示模型面策略不限制HTTP。

<details>
<summary>查看原文（13行）</summary>

````text
### 不想让它点，只想让它看：只读档与脚本开关

profile 覆盖层里给 `browser-bridge` 配两项（完整写法见 [dsh-config/README.md](dsh-config/README.md#两个闸门)）：

```yaml
config:
  readOnly: true      # 只读：点击/输入/按键/导航/滚动/标签页操作/视口模拟全拒
  allowScript: false  # 再把 browser_evaluate（在页面里跑任意 JS）关掉
```

被拦的命令**不会发到浏览器**（零副作用），错误码 `blocked_by_policy`，文案写明改哪个字段。
注意 `readOnly` 单独打开**不等于**拿掉了任意脚本能力：`browser_evaluate` 能做其它工具能做的所有事，
所以「能不能执行脚本」是单独一项。这两个开关只管模型那条工具面，HTTP 面（带 token）不受影响。
````

</details>

#### 缺口

- 各Host运行环境秘密访问/扩展身份、完整HTTP/WS防护未实测。
  **影响**：不能将默认token+回环当足够保密或宣称已被攻击。
  **进一步探讨**：隔离profile核错token/Origin/HTTP绕模型策略和专用目录；无可信本地边界就停用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 取消与失败回执能否支持安全重试和退出？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

server超时/abort仅从pending移除并reject，发出后的帧没有取消消息到扩展；浏览器runCommand可能继续，迟到结果因pending消失被忽略。断线/新连接替换也failAllPending，不能因此撤销页面动作。错误分类对写命令timeout/link_lost/command_failed报unknown，并把先只读观察/不直接重试写入模型可见message，是有价值的工程契约。

但同一个classify对cancelled一律落not_started，不区分发送前与发送后。effectClause把not_started明确写“没有动到页面，重试安全”，hint还说按需重发，与前述已发帧仍执行的机制矛盾；构建lib/index.js也保留同分类。这是源码确认的副作用回执缺陷，未复现实际重复提交。不能在Agent停止后根据此文案重做写任务，必须回页面/站点结果核查。

首次需原生包、Chrome扩展debugger权限、长随机token和可丢弃profile，配置启停/锁/HTTP信任边界；持续有模型、浏览器/截图/日志磁盘与人工核副作用/版本，金额未知。关闭enabled会停桥拒pending，扩展/页面已做动作和本机文件不自动清理，popup硬锁也不是kill已运行脚本。退出先硬锁/停桥、确认站点真实结果、卸扩展撤debugger、按专用目录核清理，回手工或其他已验工具。AGPL许可另按用途核，不把开源等同所有部署无责任。当前观察，取消语义修复并故障验收后再扩大使用。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.ts:249-294](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L249-L294)

发送后abort/timeout仅删pending。

<details>
<summary>查看原文（46行）</summary>

```text
   * Send one command to the connected extension and await its result.
   * Throws while no extension is linked; the rejection message names the fix.
   */
  async execute(command: string, params: Record<string, unknown>, options: BridgeExecuteOptions = {}): Promise<unknown> {
    const socket = this.clientSocket
    if (socket === undefined) {
      throw classify(command, new Error('no browser extension connected — open the browser that has the DSH Browser Control extension installed'))
    }
    const timeoutMs = Math.min(MAX_COMMAND_TIMEOUT_MS, Math.max(1, options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS))
    const signal = options.signal
    if (signal?.aborted) throw new Error(`browser command cancelled before send: ${command}`)
    const id = randomUUID()
    const entry: PendingEntry = {
      command,
      resolve: () => {},
      reject: () => {},
      timer: setTimeout(() => {
        if (!this.pending.delete(id)) return
        entry.reject(new Error(`browser command timed out after ${timeoutMs}ms: ${command}`))
      }, timeoutMs),
    }
    const result = new Promise<unknown>((resolve, reject) => {
      entry.resolve = resolve
      entry.reject = reject
    })
    if (signal !== undefined) {
      entry.onAbort = (): void => {
        if (!this.pending.delete(id)) return
        entry.reject(new Error(`browser command cancelled: ${command}`))
      }
      signal.addEventListener('abort', entry.onAbort, { once: true })
    }
    this.pending.set(id, entry)
    this.log(`-> ${command} (${id})`)
    socket.write(encodeTextFrame(JSON.stringify({ type: 'command', id, command, params })))
    try {
      return await result
    } catch (error) {
      // One choke point: everything above this line that can fail is a link or
      // extension failure, and the caller needs to know whether the page may
      // already have been changed. See src/errors.ts.
      throw classify(command, error)
    } finally {
      clearTimeout(entry.timer)
      if (entry.onAbort !== undefined && signal !== undefined) signal.removeEventListener('abort', entry.onAbort)
    }
```

</details>

**依据 2 · 源码核查**：[src/server.ts:599-622](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L599-L622)

断线停止pending并非远端取消。

<details>
<summary>查看原文（24行）</summary>

```text
  private closeClientSocket(code: number, reason: string): void {
    const socket = this.clientSocket
    if (socket === undefined) return
    this.clientSocket = undefined
    this.hello = undefined
    this.connectedAt = undefined
    this.failAllPending(new Error('the browser extension disconnected mid-command'))
    try {
      socket.write(encodeCloseFrame(code, reason))
      socket.end()
      setTimeout(() => socket.destroy(), 500).unref()
    } catch {
      socket.destroy()
    }
    if (reason.length > 0) this.log(`extension disconnected (${reason})`)
  }

  private failAllPending(error: Error): void {
    for (const [, entry] of this.pending) {
      clearTimeout(entry.timer)
      entry.reject(error)
    }
    this.pending.clear()
  }
```

</details>

**依据 3 · 源码核查**：[src/errors.ts:116-137](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/errors.ts#L116-L137)

模型可见not_started明确重试安全。

<details>
<summary>查看原文（22行）</summary>

```text
function effectClause(effectState: EffectState): string {
	switch (effectState) {
		case 'unknown':
			return 'effectState=unknown：动作可能已经落到页面上，先用只读工具看当前状态，再决定要不要重做，不要直接重试'
		case 'committed':
			return 'effectState=committed：动作已经生效'
		default:
			return 'effectState=not_started：这次调用没有动到页面，重试安全'
	}
}

/** 带分类的桥接错误；`message` 面向模型，`toJSON()` 面向程序。 */
export class BridgeError extends Error {
	readonly code: BridgeErrorCode
	readonly effectState: EffectState
	readonly hint: string
	readonly command: string
	/** 原始失败描述：HTTP 面的 `error` 字段就是它，不含我们追加的契约文案。 */
	readonly detail: string

	constructor(command: string, code: BridgeErrorCode, effectState: EffectState, message: string) {
		super(`[${code}] ${message} — ${effectClause(effectState)}。下一步：${HINTS[code]}`)
```

</details>

**依据 4 · 源码核查**：[src/errors.ts:160-193](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/errors.ts#L160-L193)

实际cancelled默认not_started，写timeout才unknown。

<details>
<summary>查看原文（34行）</summary>

```text
 * 保证多次包裹不会把 code 洗掉。
 */
export function classify(command: string, error: unknown): BridgeError {
	if (error instanceof BridgeError) return error
	const raw = error instanceof Error ? error.message : String(error)
	// 扩展弹窗的锁把「这条命令根本没发出去」写在文本前缀上（结果帧里只有 error 一个
	// 字符串可以带信息）。先认它，并把标记从给模型看的那句话里剥掉：它不该跟着
	// 落到上下文中。认不出前缀的那些（老扩展、别的失败）照原路走。
	const locked = raw.startsWith(LOCKED_BY_USER_MARKER) ? 'locked_by_user' as const
		: raw.startsWith(LOCK_UNREADABLE_MARKER) ? 'lock_unreadable' as const
			: raw.startsWith(HOLD_ABORTED_MARKER) ? 'held_by_user' as const
				: undefined
	const markerLength = locked === 'locked_by_user' ? LOCKED_BY_USER_MARKER.length
		: locked === 'lock_unreadable' ? LOCK_UNREADABLE_MARKER.length
			: locked === 'held_by_user' ? HOLD_ABORTED_MARKER.length
				: 0
	const message = locked ? raw.slice(markerLength).trim() : raw
	// 写操作一旦超时或掉线，结果就是未知的；读操作永远可以安全重试。
	const unknownIsPossible = isWriteCommand(command)
	let code: BridgeErrorCode
	if (locked !== undefined) code = locked
	else if (/no browser extension connected/.test(message)) code = 'extension_offline'
	else if (/disconnected mid-command|browser-bridge stopped/.test(message)) code = 'link_lost'
	else if (/timed out after/.test(message)) code = 'command_timeout'
	else if (/cancelled/.test(message)) code = 'cancelled'
	else if (/尚未加载配置|not configured yet/.test(message)) code = 'not_configured'
	else if (/未启用|not enabled|桥接启动失败|listen EADDR|settings integration/.test(message)) code = 'bridge_disabled'
	else code = 'command_failed'
	const effectState: EffectState = code === 'command_timeout' || code === 'link_lost'
		? (unknownIsPossible ? 'unknown' : 'not_started')
		: code === 'command_failed'
			? (unknownIsPossible ? 'unknown' : 'not_started')
			: 'not_started'
	return new BridgeError(command, code, effectState, message)
```

</details>

**依据 5 · 源码核查**：[lib/index.js:196-208](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/lib/index.js#L196-L208)

发行执行代码同样分类。

<details>
<summary>查看原文（13行）</summary>

```text
	const markerLength = locked === "locked_by_user" ? 23 : locked === "lock_unreadable" ? 24 : locked === "held_by_user" ? 21 : 0;
	const message = locked ? raw.slice(markerLength).trim() : raw;
	const unknownIsPossible = isWriteCommand(command);
	let code;
	if (locked !== void 0) code = locked;
	else if (/no browser extension connected/.test(message)) code = "extension_offline";
	else if (/disconnected mid-command|browser-bridge stopped/.test(message)) code = "link_lost";
	else if (/timed out after/.test(message)) code = "command_timeout";
	else if (/cancelled/.test(message)) code = "cancelled";
	else if (/尚未加载配置|not configured yet/.test(message)) code = "not_configured";
	else if (/未启用|not enabled|桥接启动失败|listen EADDR|settings integration/.test(message)) code = "bridge_disabled";
	else code = "command_failed";
	return new BridgeError(command, code, code === "command_timeout" || code === "link_lost" ? unknownIsPossible ? "unknown" : "not_started" : code === "command_failed" ? unknownIsPossible ? "unknown" : "not_started" : "not_started", message);
```

</details>

**依据 6 · 源码核查**：[src/index.ts:249-274](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/index.ts#L249-L274)

关闭先停旧server。

<details>
<summary>查看原文（26行）</summary>

```text
	private async reconcileNow(config: ResolvedConfig): Promise<void> {
		const shotsDir = path.resolve(config.shotsDir)
		const key = config.enabled ? `${config.port}|${config.token}|${shotsDir}` : ''
		if (key === this.serverKey) return
		const previous = this.server
		this.server = undefined
		this.serverKey = ''
		await previous?.stop()
		if (!config.enabled) {
			this.lastError = undefined
			return
		}
		const server = new BridgeServer({ port: config.port, token: config.token, shotsDir, log: this.log })
		try {
			await server.start()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.lastError = `桥接启动失败（端口 ${config.port}）: ${message}`
			this.log(this.lastError!)
			throw error instanceof Error ? error : new Error(message)
		}
		this.server = server
		this.serverKey = key
		this.lastError = undefined
	}

```

</details>

**依据 7 · 源码核查**：[package.json:1-41](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/package.json#L1-L41)

AGPL与bundle分发。

<details>
<summary>查看原文（41行）</summary>

```text
{
  "name": "@angelky7/dsh-browser-control",
  "description": "Local WebSocket bridge between dsh and the DSH Browser Control browser extension, with model-facing browser_* tools and a Settings-managed on/off switch",
  "version": "1.7.2",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./invariant": {
      "types": "./lib/types/invariant.d.ts",
      "default": "./lib/invariant.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib/index.js",
    "lib/invariant.js",
    "lib/types/**/*.js",
    "lib/types/**/*.d.ts",
    "README.md",
    "README.en.md",
    "llms.txt",
    "LICENSE"
  ],
  "license": "AGPL-3.0-only",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json && tsdown",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "check": "npm run typecheck && npm run build && publint",
    "verify": "node verify/verify_config_patch.mjs && node verify/verify_peers.mjs && node verify/verify_surface.mjs && node verify/verify_tab_groups.mjs && node verify/verify_tabs_close_many.mjs && node verify/verify_cdp_retry.mjs && node verify/verify_snapshot_ax.mjs && node verify/verify_hard_lock.mjs && node verify/verify_policy.mjs && node verify/verify_cookies.mjs && node verify/verify_extension_e2e.mjs && node verify/verify_plugin.mjs legacy && node verify/verify_plugin.mjs conflict && node verify/verify_plugin.mjs new && node verify/verify_http.mjs && node verify/verify_errors.mjs && node verify/verify_hold.mjs && node verify/verify_protocol.mjs && node verify/verify_bundle_http.mjs && node verify/verify_nav_report.mjs && node verify/verify_nav_landing.mjs && node verify/verify_render_contract.mjs && node verify/verify_press_events.mjs && node verify/verify_nav_timeout.mjs && node verify/verify_nav_waituntil.mjs && node verify/verify_archive.mjs && node verify/verify_windows.mjs && node verify/verify_history_nav.mjs && node verify/verify_metrics_throttle.mjs && node verify/verify_compat_matrix.mjs"
  },
```

</details>

#### 缺口

- 真实取消后CDP效果、断线重连/新扩展替换和全部工具结果未测。
  **影响**：缺陷来自代码矛盾，不称已发生实际重复副作用或完整兼容。
  **进一步探讨**：无副作用测试表单中延迟点击/输入后取消，比较页面实际结果与模型错误；修后以发送前/后分段验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 生产方向应怎样利用已有锁和副作用回执？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可验证方向是把发送前/已发送/扩展已开始/完成/未知分阶段记录到浏览器操作ID，取消在已发送后保留unknown，并按明确tab与文档代际绑定动作；硬锁仍作为本地人控制的新命令闸，不能替代在途状态。基线是当前UUID pending、模型可见effectState、扩展硬锁和有限CDP重放；增量是让Agent在停止/重连后少做错重试，而不是扩工具列表。

最小对照用无敏感本地测试页，一台Host/扩展两个tab，注入发送前取消、发送后取消、CDP首/后调用失效、超时、断线与焦点切换。指标是错误not_started、重复动作/错tab、真实完成率、需要人工确认次数和恢复时间。要保留扩展开始/结束原件及页面业务状态，不能只看HTTP或工具报成功。

若扩展无法提供可靠文档/动作状态，保持unknown要求人工检查，不编造恰好一次；若目标仅只读内容，原生fetch/快照已经足够且回执复杂性无收益，停止扩展。该方向未验证，不计现有机制或经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.ts:249-294](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/server.ts#L249-L294)

当前UUID/pending和取消缺口基线。

<details>
<summary>查看原文（46行）</summary>

```text
   * Send one command to the connected extension and await its result.
   * Throws while no extension is linked; the rejection message names the fix.
   */
  async execute(command: string, params: Record<string, unknown>, options: BridgeExecuteOptions = {}): Promise<unknown> {
    const socket = this.clientSocket
    if (socket === undefined) {
      throw classify(command, new Error('no browser extension connected — open the browser that has the DSH Browser Control extension installed'))
    }
    const timeoutMs = Math.min(MAX_COMMAND_TIMEOUT_MS, Math.max(1, options.timeoutMs ?? DEFAULT_COMMAND_TIMEOUT_MS))
    const signal = options.signal
    if (signal?.aborted) throw new Error(`browser command cancelled before send: ${command}`)
    const id = randomUUID()
    const entry: PendingEntry = {
      command,
      resolve: () => {},
      reject: () => {},
      timer: setTimeout(() => {
        if (!this.pending.delete(id)) return
        entry.reject(new Error(`browser command timed out after ${timeoutMs}ms: ${command}`))
      }, timeoutMs),
    }
    const result = new Promise<unknown>((resolve, reject) => {
      entry.resolve = resolve
      entry.reject = reject
    })
    if (signal !== undefined) {
      entry.onAbort = (): void => {
        if (!this.pending.delete(id)) return
        entry.reject(new Error(`browser command cancelled: ${command}`))
      }
      signal.addEventListener('abort', entry.onAbort, { once: true })
    }
    this.pending.set(id, entry)
    this.log(`-> ${command} (${id})`)
    socket.write(encodeTextFrame(JSON.stringify({ type: 'command', id, command, params })))
    try {
      return await result
    } catch (error) {
      // One choke point: everything above this line that can fail is a link or
      // extension failure, and the caller needs to know whether the page may
      // already have been changed. See src/errors.ts.
      throw classify(command, error)
    } finally {
      clearTimeout(entry.timer)
      if (entry.onAbort !== undefined && signal !== undefined) signal.removeEventListener('abort', entry.onAbort)
    }
```

</details>

**依据 2 · 源码核查**：[src/errors.ts:160-193](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/src/errors.ts#L160-L193)

effectState分类基线。

<details>
<summary>查看原文（34行）</summary>

```text
 * 保证多次包裹不会把 code 洗掉。
 */
export function classify(command: string, error: unknown): BridgeError {
	if (error instanceof BridgeError) return error
	const raw = error instanceof Error ? error.message : String(error)
	// 扩展弹窗的锁把「这条命令根本没发出去」写在文本前缀上（结果帧里只有 error 一个
	// 字符串可以带信息）。先认它，并把标记从给模型看的那句话里剥掉：它不该跟着
	// 落到上下文中。认不出前缀的那些（老扩展、别的失败）照原路走。
	const locked = raw.startsWith(LOCKED_BY_USER_MARKER) ? 'locked_by_user' as const
		: raw.startsWith(LOCK_UNREADABLE_MARKER) ? 'lock_unreadable' as const
			: raw.startsWith(HOLD_ABORTED_MARKER) ? 'held_by_user' as const
				: undefined
	const markerLength = locked === 'locked_by_user' ? LOCKED_BY_USER_MARKER.length
		: locked === 'lock_unreadable' ? LOCK_UNREADABLE_MARKER.length
			: locked === 'held_by_user' ? HOLD_ABORTED_MARKER.length
				: 0
	const message = locked ? raw.slice(markerLength).trim() : raw
	// 写操作一旦超时或掉线，结果就是未知的；读操作永远可以安全重试。
	const unknownIsPossible = isWriteCommand(command)
	let code: BridgeErrorCode
	if (locked !== undefined) code = locked
	else if (/no browser extension connected/.test(message)) code = 'extension_offline'
	else if (/disconnected mid-command|browser-bridge stopped/.test(message)) code = 'link_lost'
	else if (/timed out after/.test(message)) code = 'command_timeout'
	else if (/cancelled/.test(message)) code = 'cancelled'
	else if (/尚未加载配置|not configured yet/.test(message)) code = 'not_configured'
	else if (/未启用|not enabled|桥接启动失败|listen EADDR|settings integration/.test(message)) code = 'bridge_disabled'
	else code = 'command_failed'
	const effectState: EffectState = code === 'command_timeout' || code === 'link_lost'
		? (unknownIsPossible ? 'unknown' : 'not_started')
		: code === 'command_failed'
			? (unknownIsPossible ? 'unknown' : 'not_started')
			: 'not_started'
	return new BridgeError(command, code, effectState, message)
```

</details>

**依据 3 · 源码核查**：[extension/background.js:748-783](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L748-L783)

实际扩展硬锁与tab默认。

<details>
<summary>查看原文（36行）</summary>

```text

function handleBridgeMessage(msg) {
	if (msg.type === 'ping') { send({ type: 'pong', t: msg.t }); return; }
	if (msg.type === 'command' && typeof msg.id === 'string') {
		runCommand(msg.command, msg.params ?? {})
			.then((result) => send({ type: 'result', id: msg.id, ok: true, result }))
			.catch((err) => send({ type: 'result', id: msg.id, ok: false, error: String((err && err.message) || err) }));
	}
}

async function runCommand(command, params) {
	await syncHardLock();
	if (hardLocked) throw new Error(hardLockRefusal(command));
	const handler = COMMANDS[command];
	if (!handler) throw new Error(`unknown command: ${command}`);
	// 接管浮层上的「中止操作」：只拦写页面那四条，且只在页面上的浮层还在时拦
	//（页面一导航浮层就没了，那时把存储里那条清掉并放行，不许假装还挡着）。
	const held = await holdRefusalFor(command, params);
	if (held !== null) throw new Error(held);
	return handler(params);
}

/* ------------------------------------------------------------ tab helpers */

async function resolveTab(tabId) {
	if (tabId !== undefined && tabId !== null) {
		const tab = await chrome.tabs.get(tabId);
		return tab;
	}
	const [focused] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	if (focused) return focused;
	const all = await chrome.tabs.query({});
	if (all.length > 0) return all[0];
	throw new Error('no tab available');
}

```

</details>

**依据 4 · 源码核查**：[extension/background.js:1190-1201](https://github.com/angelky7/dsh-browser-control/blob/e916303a920dcb15515ea826d6bde905e596e396/extension/background.js#L1190-L1201)

有限重放基线。

<details>
<summary>查看原文（12行）</summary>

```text
	const call = (method, params) => { sends++; return dbgSend(tabId, method, params); };
	await ensureAttached(tabId);
	const started = sends;
	try {
		return await fn(call);
	} catch (error) {
		if (error?.code !== 'cdp_detached' || sends > started + 1) throw error;
		await ensureAttached(tabId);
		return fn(call);
	}
}

```

</details>

#### 缺口

- 分阶段回执能否降低真实任务误重试且不增加过高运维未知。
  **影响**：不是已实现方向或已证明用户需求。
  **进一步探讨**：先有界故障对照，再以实际任务/人审决定是否继续。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
