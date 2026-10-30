# DeepSeekGUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1e913d8](https://github.com/See-Sol-Lab/DeepSeekGUI/tree/1e913d8b38b23df083bd6d3852b623f93210360a)

<!-- BEGIN META -->
[![GitHub ★ 273](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/See-Sol-Lab/DeepSeekGUI)
<!-- END META -->

> **功能**：第三方DSH Fork桌面工作台，沿用真实模型工具循环并接入可见内嵌浏览器；页面目标、有效权限、网络地址和业务完成是不同边界。

> **亮点**：统一桌面托管和真实内嵌浏览器、分mode工具/目标与网络检查组合；已有护栏范围见[Q03](#research-q03)，独立能力主表只列本轮已核操作。

> **主要限制**：Full access内部不发审批，但approveSubmission未填URL导致正常非空页面敏感动作误拒的源码条件；一般模式不一概失败。role/name/URL/facts不等业务对象，clicked/submitted不等服务受理，SSRF不等网页可信或整机隔离，见[Q03](#research-q03)。

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
  - [Q01 · 真实对象、应用版本和桌面启动增量是什么？](#detail-section-11)
  - [Q02 · 模型工具如何真的回到下一模型，浏览器如何落到可见pane？](#detail-section-12)
  - [Q03 · 定位、审批与SSRF分别防什么，动作回包还缺什么？](#detail-section-13)
  - [Q04 · 依赖、真实本地残留与退出成本怎么界定？](#detail-section-14)
  - [Q05 · 可采用范围及超出现有机制的新方向怎么证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH会话旁查看代码与公开网页的用户；本轮只核代表链，不扩到README全部Git/PR/记忆/迁移功能，见[Q01](#research-q01)。

原生DSH Web加编辑器/独立浏览器与既有自动化工具；底座Loop/Playwright/Chromium和标准隔离配置不算新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面托管/pane | 同窗加载Harness与外部网页 | overlay可省略，成品与全局隔离未验证 |
| browser_navigate | 打开URL回最终地址/标题 | URL/DNS/proxy检查，不等页面可信/业务无副作用 |
| browser_snapshot | 输出可访问树/文本与refs | refs role/name、page/URL，非业务不可变身份 |
| browser_screenshot | 获取页面图像为本地PNG | 隐藏/错误页面可失败，写磁盘/输入模型的隐私成本 |
| browser_wait | 有上界等待页面 | 时间过去不等任务成功 |
| browser_tabs | 查看/选择/管理浏览页 | 非任意桌面程序控制，目标切换要重新核 |
| browser_click | 点击定位元素 | 只读拒绝；后果启发式升级审批，敏感分支Full access正常非空URL可被helper误拒 |
| browser_type | 向元素填入文本 | 是页面交互非只读；pressEnter走helper，Full access误拒条件见Q03 |
| browser_scroll | 滚动页面/元素 | 按交互mode gate，不作业务完成依据 |
| browser_keyboard | 发送按键 | 可提交键走helper，Full access误拒条件见Q03；任意JS后果未穷审 |
| browser_hover | 悬停目标 | 页面交互有mode边界，不代表无副作用 |
| browser_submit | 对目标执行提交动作 | 一般模式审批；Full access不调reason可在正常页面误拒；submitted非受理证明 |
| 底座模型工具循环 | 将真实工具结果再交模型决策 | 沿用DSH，不是GUI独创新推理或任务正确保证 |

**流程与依赖**

桌面/Harness/profile资源需匹配，模型/浏览器/CDP/网络与资料权限按所选功能；完整四列表见[Q04](#research-q04)。

启动/挂载→会话模型工具循环→browser实际pane→人核结果/退出；完整活动步骤表见[Q01](#research-q01)，结果回流见[Q02](#research-q02)。

**效果与成本**

首次固定版本/独立home/副本；持续模型/截图/浏览资源，失败未知写结果先对账，退出核子进程与资料；现金与人工四阶段表见[Q04](#research-q04)。

可见目标/权限/网络门与工具回包能辅助操作，不能证明业务成功或节省总工时；效果四项表见[Q03](#research-q03)。

> **思考**：Full access内部不发审批，但approveSubmission未填URL导致正常非空页面敏感动作误拒的源码条件；一般模式不一概失败。role/name/URL/facts不等业务对象，clicked/submitted不等服务受理，SSRF不等网页可信或整机隔离，见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一桌面托管和真实内嵌浏览器、分mode工具/目标与网络检查组合；已有护栏范围见[Q03](#research-q03)，独立能力主表只列本轮已核操作。

保留caller到native pane、检查IP再连接、一般审批后facts复比与loop回流；Full access helper误拒须先修/核；避免把通道token、sandbox配置、工具字符串或退出注释提升为全局保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

Full access内部不发审批，但approveSubmission未填URL导致正常非空页面敏感动作误拒的源码条件；一般模式不一概失败。role/name/URL/facts不等业务对象，clicked/submitted不等服务受理，SSRF不等网页可信或整机隔离，见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只读会话与复制workspace先核代码/公开网页任务，明确模型和页面数据流；不基于本轮直接授权Git/PR或真实网页写入，见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源闭合桌面spawn/UI settle、底座工具结果回下一模型、browser注册→bridge/CDP/native pane及关键权限/网络callee。未运行/验编译发行物或全审大Fork；限独立home/复制workspace有效只读试用。

- 已检查：作者 README、包清单、源码路径 README.md、apps/deepseekgui/browser-plugin/cordis.patch.yml、apps/deepseekgui/browser-plugin/package.json、apps/deepseekgui/browser-plugin/src/browser.ts、apps/deepseekgui/browser-plugin/src/gate.ts、apps/deepseekgui/browser-plugin/src/index.ts、apps/deepseekgui/browser-plugin/src/pane.ts、apps/deepseekgui/browser-plugin/src/proxy.ts、apps/deepseekgui/browser-plugin/src/ssrf.ts、apps/deepseekgui/browser-plugin/src/tools.ts、apps/deepseekgui/package.json、apps/deepseekgui/src/browser-pane-runtime.ts、apps/deepseekgui/src/control-bridge.ts、apps/deepseekgui/src/dsh-service.ts、apps/deepseekgui/src/launcher-state.ts、apps/deepseekgui/src/main.ts、apps/deepseekgui/tsconfig.json、package.json、packages/boot/app-boot/src/profile.ts、packages/bundle/base/cordis.patch.yml、packages/core/agent-loop/src/agent.ts、packages/core/agent-loop/src/index.ts、packages/core/agent-loop/src/tool-calls.ts、packages/core/session/src/index.ts、packages/core/session/src/surface.ts、packages/core/tools/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：INVENTORY按表列TS/TSX/JS及变体/MD统计，含大Fork底座、测试/示例与第三方/生成候选，非原创量；未列语言不计，不造数量。固定摘要/身份已核，无正式identity旧稿。只读桌面真实入口/构建、底座循环、browser工具与pane/权限/SSRF/局部退出；未执行目标/模型/浏览器/测试，未全审Git/PR/记忆/更新搬家、usage/计费控制、所有授权/协议/平台或编译物。
- 下一步：独立home和受控站点比原生组合的目标/授权/真实后置结果；注入同页换对象/审批后变化/丢响应并测重复写、恢复工时与资源，见[Q05](#research-q05)。

**分析版本**

- **仓库**：[See-Sol-Lab/DeepSeekGUI](https://github.com/See-Sol-Lab/DeepSeekGUI)
- **版本号**：1.2.1（桌面应用；根DSH工作区0.2.1-rc.2，browser插件0.2.1）（[固定提交 1e913d8](https://github.com/See-Sol-Lab/DeepSeekGUI/tree/1e913d8b38b23df083bd6d3852b623f93210360a)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修Full access helper的URL误拒；在已有审批后facts复比之外做有限业务的后置事实核验和未知结果对账；受控基线/指标/停止条件见[Q05](#research-q05)。

独立home和受控站点比原生组合的目标/授权/真实后置结果；注入同页换对象/审批后变化/丢响应并测重复写、恢复工时与资源，见[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

本表仅统计列出的语言/文件，含Fork底座与测试/示例等；未列语言不计，不据规模推原创量、实现工时或用户价值。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4369 | 423398 | — | — | 6138375 |
| .mjs | source | 59 | 5512 | 4499 | 639 | — |
| .mjs | test | 12 | 3125 | 2951 | 74 | — |
| .ts | source | 2698 | 483605 | 338194 | 115339 | — |
| .ts | test | 2259 | 621098 | 542663 | 32337 | — |
| .mjs | example | 32 | 1737 | 1481 | 132 | — |
| .ts | example | 104 | 4914 | 3949 | 542 | — |
| .md | test | 230 | 4764 | — | — | 30671 |
| .js | source | 11 | 1287 | 969 | 267 | — |
| .tsx | source | 376 | 63116 | 49666 | 10489 | — |
| .tsx | test | 316 | 104395 | 91552 | 5306 | — |
| .cts | source | 5 | 304 | 197 | 82 | — |
| .cjs | source | 6 | 209 | 130 | 54 | — |
| .cjs | example | 3 | 69 | 64 | 5 | — |
| .js | example | 26 | 546 | 443 | 82 | — |
| .md | example | 17 | 416 | — | — | 5353 |
| .js | test | 5 | 977 | 851 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/See-Sol-Lab/DeepSeekGUI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/See-Sol-Lab/DeepSeekGUI/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/See-Sol-Lab/DeepSeekGUI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：限定桌面/底座循环/浏览器代表链核直接贡献、采用失败与生产方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实对象、应用版本和桌面启动增量是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

DeepSeekGUI是第三方DSH Fork桌面工作台，不是把整个root安装为单plugin。应用apps/deepseekgui为1.2.1，root工作区/DSH为0.2.1-rc.2，内置browser插件又为0.2.1；不将单版本当各包/线上发行统一。主入口lib/main.js由rootDir src→outDir lib的TS构建对应src/main.ts；固定树未见该应用lib/main.js，故本轮核源码接线而非已编译发行物等价。

面向希望同一窗口处理代码会话和网页的DSH用户，本轮限桌面启动、底座真工具循环与内嵌浏览器代表链，不因README Git/PR/记忆/搬家/更新列表就全计已核可用能力。默认launcher managed home/web；launch解析profile与可用overlay，browser/workbench/skills等找不到可省略，不能只凭包在树中许每次都挂载。真实main spawn launch.command/args/env，拿readiness/会话凭据、设置httpOnly/strict cookie、loadURL到Harness view，再等官方UI和客户端settle。启动/插件settle健康不等模型任务成功；恢复机制/所有安全边界本轮未全审。桌面chrome view有隔离/禁Node/sandbox/preload，外部网页pane另partition且不配该preload；不据这些配置承诺所有工具有OS沙箱。

| 步骤 | 执行者与动作 | 结果/失败 |
|---|---|---|
| 启动 | 桌面选home/profile，解析overlay并spawnDSH | 缺可选插件可能降级；发行物与资源需匹配 |
| 挂载 | loadURL后等UI/客户端settle | 不是只看HTTP，但仍非任务验收 |
| 会话 | 底座模型流→工具→结果→下一步 | 继承DSH，不算新推理算法 |
| 网页 | browser工具→pane bridge/CDP或独立Edge | locator/权限/SSRF各有条件，见Q02/3 |
| 交接/退出 | 人核代码/网页结果，停后台/浏览器 | 动作回包不是业务完成，保留差异/残留 |

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/package.json:1-18](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/package.json#L1-L18)

真实应用版本/main。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@see-sol-lab/deepseekgui",
  "description": "DeepSeek-native Harness-first desktop host and Workbench foundation",
  "version": "1.2.1",
  "private": true,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/See-Sol-Lab/DeepSeekGUI.git",
    "directory": "apps/deepseekgui"
  },
  "type": "module",
  "main": "lib/main.js",
  "license": "SEE LICENSE IN LICENSE",
  "devDependencies": {
    "@types/node": "^22.20.0",
    "@types/ws": "8.18.1",
    "@xterm/addon-fit": "^0.11.0",
    "@xterm/xterm": "^6.0.0",
```

</details>

**依据 2 · 源码核查**：[package.json:1-33](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/package.json#L1-L33)

根DSH工作区版本不等应用。

<details>
<summary>查看原文（33行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-root",
  "version": "0.2.1-rc.2",
  "license": "MIT",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.28.5",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "workspaces": [
    "vendor/*",
    "packages/*/*",
    "native/system",
    "native/system/packages/*",
    "apps/*",
    "website"
  ],
  "scripts": {
    "prepare:primary-runtime": "tsx scripts/primary-runtime/prepare.ts",
    "build": "tsx scripts/build.ts",
    "build:artifacts": "tsx scripts/build.ts --scope artifacts",
    "build:check": "tsx scripts/build.ts --scope check",
    "build:bench": "npm run build:native-system && npm run build:lib && tsdown --config-loader native --config benchmarks/tsdown.config.ts",
    "build:official": "tsx scripts/build.ts --profile official",
    "build:lib": "pnpm run build:lib:host && pnpm run build:lib:client",
    "build:lib:host": "node --max-old-space-size=4096 ./node_modules/typescript/bin/tsc -b tsconfig.host.json && tsdown --config-loader native --env.DSH_BUILD_FACE host",
    "build:lib:client": "tsc -b tsconfig.client.json && tsdown --config-loader native --env.DSH_BUILD_FACE client",
    "build:web": "pnpm --filter @deepseek-ai/dsh-web-frontend run build",
    "build:deepseekgui": "tsc -b apps/deepseekgui apps/deepseekgui/browser-plugin apps/deepseekgui/workbench-plugin apps/deepseekgui/skills-plugin && tsdown --config apps/deepseekgui/workbench-plugin/tsdown.config.ts && tsdown --config apps/deepseekgui/skills-plugin/tsdown.config.ts",
    "dev:deepseekgui": "tsc -b apps/deepseekgui && electron apps/deepseekgui",
    "generate:desktop-icon": "tsx scripts/generate-desktop-icon.ts",
    "generate:update-manifest": "tsx scripts/generate-update-manifest.ts",
```

</details>

**依据 3 · 源码核查**：[apps/deepseekgui/tsconfig.json:1-12](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/tsconfig.json#L1-L12)

实际TS src→lib构建映射。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib",
    "tsBuildInfoFile": "lib/tsconfig.tsbuildinfo",
    "lib": ["ES2024", "DOM", "DOM.Iterable"]
  },
  "include": [
    "src"
  ]
}
```

</details>

**依据 4 · 源码核查**：[apps/deepseekgui/browser-plugin/package.json:1-24](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/package.json#L1-L24)

独立browser版本/模块与bundle。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "@see-sol-lab/deepseekgui-browser",
  "description": "DeepSeekGUI browser capability: embedded in-window pane (CDP) or headed Edge, driven over playwright-core with an SSRF gate.",
  "version": "0.2.1",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "locale/*.json",
    "lib",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/src/launcher-state.ts:127-135](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/launcher-state.ts#L127-L135)

默认managed/web实际状态。

```text
 * @returns 新用户的默认状态。
 */
export function defaultLauncherState(): LauncherStateV1 {
  return {
    schemaVersion: 1,
    active: { home: { kind: 'managed' }, profile: 'web' },
    pending: null,
    lastKnownGood: null,
    lastBootFailure: null,
```

**依据 6 · 源码核查**：[apps/deepseekgui/src/dsh-service.ts:608-655](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/dsh-service.ts#L608-L655)

真实overlay选择/缺项可省及命令argv。

<details>
<summary>查看原文（48行）</summary>

```text
  const settingsPatch = overlayOf(BUNDLED_PLUGINS.settings)
  // 内置浏览器（B3-11）：解析不了就不带——没有它只是少了 browser_* 工具。
  // 额外那个条件是**互斥闸**：profile 自己已经把这个包列进 bundles（用户手动
  // 装过），overlay 就由那一层负责，launcher 不再插第二遍——同一个 loader id
  // 插两次会让官方 loader 抛 duplicate 并硬退出，见 {@link profileBundlesInclude}。
  const browserPatch = overlayOf(
    BUNDLED_PLUGINS.browser,
    () => !profileBundlesInclude(options.dshHome, options.profile, BUNDLED_PLUGINS.browser.pkg),
  )
  // Workbench 产品插件（B3-P1）：解析不了就不带 overlay——没有它只是少了
  // DeepSeekGUI 品牌与 Workbench 标识，官方 UI 照常完整。Compatibility View
  // 由 overlayOf 那道闸统一跳过，这里不再单独判断。
  const workbenchPatch = overlayOf(BUNDLED_PLUGINS.workbench)
  // 技能管理器（B7-P4）：解析不了就不带 overlay——没有它只是设置页里少了
  // 「Skill」分区；官方技能根与会话照常。
  const skillsPatch = overlayOf(BUNDLED_PLUGINS.skills)
  return resolveDshCommand({
    packaged: options.packaged,
    ...options.root === undefined ? {} : { root: options.root },
    ...options.packagedExecutable === undefined ? {} : { packagedExecutable: options.packagedExecutable },
    ...options.resourcesPath === undefined ? {} : { resourcesPath: options.resourcesPath },
    ...options.packagedCwd === undefined ? {} : { packagedCwd: options.packagedCwd },
    ...options.nodeExecutable === undefined ? {} : { nodeExecutable: options.nodeExecutable },
    managedHome: options.managedHome === true,
    elevated: options.elevated === true,
    developerMode: options.developerMode === true,
    dshHome: options.dshHome,
    args: [
      '--profile', options.profile,
      // 皮肤 overlay 必须留在 dsh 自己的选项区内，紧跟 --profile。
      // dsh 的用法是 `dsh [options] [command] [args...]`：它把自身选项之后
      // 的一切**原样转交给 profile 的 app**，所以放到 --host/--port 后面
      // 会被当成给 web app 的参数转走，启动时报 unknown option（实机抓获）。
      ...themePatch === undefined ? [] : ['--patch', themePatch],
      // 目录选择器 overlay 与皮肤并列，同样留在 dsh 自己的选项区内。
      // `--patch` 按 argv 顺序叠加，两条 overlay 互不相干：皮肤只改 token，
      // 这条只换 picker 那一行。
      ...pickerPatch === undefined ? [] : ['--patch', pickerPatch],
      // 设置分区 overlay（P8-D39）：只注册 settings.section，别的不碰。
      ...settingsPatch === undefined ? [] : ['--patch', settingsPatch],
      // 内置浏览器 overlay（B3-11）：注册 browser_* 工具族。
      ...browserPatch === undefined ? [] : ['--patch', browserPatch],
      // Workbench overlay（B3-P1）：注册 DeepSeekGUI 品牌与 Workbench 标识。
      ...workbenchPatch === undefined ? [] : ['--patch', workbenchPatch],
      // 技能管理器 overlay（B7-P4）：只注册 settings.section 一个分区。
      ...skillsPatch === undefined ? [] : ['--patch', skillsPatch],
      '--host', options.host ?? DEFAULT_HOST,
      '--port', String(options.port ?? DEFAULT_PORT),
```

</details>

**依据 7 · 源码核查**：[apps/deepseekgui/src/main.ts:966-984](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/main.ts#L966-L984)

实际spawn/凭据提取，非仅声明。

<details>
<summary>查看原文（19行）</summary>

```text
      // 每个新 spawn 都换新的一次性 token：旧 token/cookie 立即失效。
      service.launchToken = null
      harnessSessionCookie = null
      const spawned = spawn(launch.command, launch.args, {
        cwd: launch.cwd,
        env: { ...launch.env, DEEPSEEKGUI_SESSION_DELETE_PUBLIC_KEY: sessionDeletionKeys.publicKey.export({ type: 'spki', format: 'pem' }).toString() },
        stdio: 'pipe',
        windowsHide: true,
      })
      // spawn 失败（如 PATH 无 node）只走 error 事件；once() 在目标发出
      // 'error' 时自动拒绝，两个监听器的互相解绑也由它负责。
      await once(spawned, 'spawn')
      service.child = spawned
      service.bootSettled = false
      service.logPath = join(app.getPath('userData'), 'dsh-service.log')
      const log = createServiceLogWriter(service.logPath)
      service.log = log
      // Credentials are extracted from complete lines before logs or console output.
      readHarnessOutput(spawned.stdout, (token) => {
```

</details>

**依据 8 · 源码核查**：[apps/deepseekgui/src/main.ts:1078-1093](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/main.ts#L1078-L1093)

真实cookie/loadURL/client settle。

<details>
<summary>查看原文（16行）</summary>

```text
        httpOnly: true,
        sameSite: 'strict',
      })
      harnessSessionCookie = cookie
      const params = new URLSearchParams()
      // D39：控制桥参数只随 DeepSeekGUI 自己加载的页面下发（见 controlBridgeParam）。
      if (controlBridgeParam !== undefined) params.set('deepseekgui-control', controlBridgeParam)
      const query = params.size === 0 ? '' : `?${params.toString()}`
      await view.webContents.loadURL(`${baseUrl}/${query}`)
      // 下一代健康不能只看 HTTP：官方 UI 挂载 + DeepSeekGUI client 插件
      // settle（theme plugin 的 apply 成功标记）都必须成立。第三方坏插件
      // 会让 loader 拒绝整轮 composition 或卡在 boot——这条失败链正是
      // Plugin Mutation Recovery 要兜住的（P6 6.8）。
      await waitForClientSettle(view, workbenchViewMode === 'workbench')
      // boot 全部完成：此后的子进程退出才是运行中的意外崩溃。
      service.bootSettled = true
```

</details>

**依据 9 · 源码核查**：[apps/deepseekgui/src/main.ts:1511-1519](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/main.ts#L1511-L1519)

桌面chrome隔离配置。

```text
  // Desktop Chrome：本地受信任 renderer（顶栏 + 菜单 + Harness 面板）。
  chromeView = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: join(MODULE_DIR, 'chrome', 'preload.cjs'),
    },
  })
```

**依据 10 · 源码核查**：[apps/deepseekgui/src/main.ts:1276-1286](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/main.ts#L1276-L1286)

实际外部网页pane partition/无专用preload配置。

<details>
<summary>查看原文（11行）</summary>

```text
  if (browserPaneView !== undefined && !browserPaneView.webContents.isDestroyed()) return browserPaneView
  // 重建路径（上一块 pane 的 webContents 已死但对象还挂着）：先把旧的两块
  // 一起摘干净再造新的，否则旧关闭钮会永远浮在窗口上并泄漏 webContents。
  if (browserPaneView !== undefined || browserPaneCloseView !== undefined) destroyBrowserPane(win)
  const view = new WebContentsView({
    webPreferences: {
      // 无 preload、无 node：这块 view 只渲染外部网页，与官方 view 同一
      // 安全姿势;操作全部经 CDP 从插件侧注入。
      partition: BROWSER_PANE_PARTITION,
      sandbox: true,
    },
```

</details>

#### 缺口

- 未构建/运行签名发行物及完整恢复/全部自研模块，未有用户频率/收益对照。
  **影响**：不能把README稳定性、构建设置或庞大代码统计当成品可用性和原创技术贡献。
  **进一步探讨**：匹配平台固定成品，在独立home/复制workspace核启停、已挂插件与一条网页只读任务；Git/PR等另行核，先不扩权限。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型工具如何真的回到下一模型，浏览器如何落到可见pane？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认web模板实际包含base与web-app，base挂agent-loop；factory注册并创建ReactLoopAgent。turn循环递增step，构造请求时session.deriveMessages与toolHistory进入LLM stream；模型toolCalls交executeToolCalls→scheduler prepare/dispatch→tools.resolveExecution→真正tool.execute。完成的tool/result带call/result message进入session surface，deriveMessages投影回message，下一step重建请求；无toolCalls或concludesTurn等结束。由此闭合真实工具结果反馈，非只注册工具名；这是沿用DSH底座，不把它算DeepSeekGUI独创Agent算法，也不把completed等同任务正确。

browser overlay真正insert插件；apply在enabled时建facade并注册读/交互工具，插件dispose异步close。实际browser_navigate执行gate后facade.navigate；navigate先ensure，内嵌模式用env中的127.0.0.1地址+pane专用token调用/control/browser-pane。Shell桥按pane/account/其他通道分别选token、验证header并把pane请求交handlePaneRequest；桥只绑定回环，pane token不是全控制台凭据。facade.ensure启动SSRF proxy，经paneEnsure/SetProxy取得CDP端点和目标URL，再connectOverCDP并只找对应pane；实际main创建WebContentsView。没有env/禁embedded时可启动独立浏览器，兼容性未运行验证。导航返回finalURL/title，snapshot来自a11y并缓存ref，截图会写本地PNG，不是只打开了一个不可操控静态窗口。

#### 证据与依据

**依据 1 · 源码核查**：[packages/boot/app-boot/src/profile.ts:183-187](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/boot/app-boot/src/profile.ts#L183-L187)

默认web模板含base/web-app。

```text
  web: {
    bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app'],
  },
  headless: {
    bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless'],
```

**依据 2 · 源码核查**：[packages/bundle/base/cordis.patch.yml:523-529](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/bundle/base/cordis.patch.yml#L523-L529)

base实际挂loop。

```text
    - id: agent-loop
      name: '@deepseek-ai/dsh-agent-loop'
      config:
        agents: []

    # The sandboxed filesystem provider. `cwd` defaults to `process.cwd()`; an
    # overlay can pin another workspace.
```

**依据 3 · 源码核查**：[packages/core/agent-loop/src/index.ts:383-391](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/index.ts#L383-L391)

factory实际注册。

```text
      yield () => ownership.dispose().finally(() => {
        unregisterInbox()
        unregisterTurnBoundary()
      })
    }, 'agentLoop.transactions()')
    ctx.effect(() => ctx.agents.setFactory(this), 'agentLoop.setFactory()')
    ctx.systemPrompt.variable('provider', context => context.agent?.options.provider)
    ctx.systemPrompt.variable('model', context => context.agent?.options.model)

```

**依据 4 · 源码核查**：[packages/core/agent-loop/src/index.ts:600-608](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/index.ts#L600-L608)

实际ReactLoopAgent构造。

```text
    }
    const untrack = this.ownership.track(dispose)
    try {
      unfollowOwner = ownerCtx.effect(function* () {
        const created = machine = new ReactLoopAgent(loopCtx, id, options, session)
        machineReady.resolve()
        // Adopt the scope on its original fiber so it cannot unload before teardown.
        // A loop already unloading during minting owns the provisional scope itself.
        if (!INACTIVE_STATES.has(loopCtx.fiber.state)) {
```

**依据 5 · 源码核查**：[packages/core/agent-loop/src/agent.ts:315-340](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/agent.ts#L315-L340)

真实step循环。

<details>
<summary>查看原文（26行）</summary>

```text
      while (true) {
        signal.throwIfAborted()
        const step = phase.step + 1
        const decision = await this.preStep(target, { turn, step })
        if (decision.kind === 'reject') {
          turnEnds = { kind: 'blocked' }
          return false
        }
        if (turnEnds && decision.messages.length === 0) break
        // A removed waking message or an enter decision rewritten to empty
        // still owns the initial turn boundary, but it spends no model call.
        if (phase.step === 0 && decision.messages.length === 0) {
          turnEnds = { kind: 'completed' }
          return false
        }
        signal.throwIfAborted()
        this.session.append('step/start', { turn, step })
        phase.step = step
        const toolRecovery = new ToolCallRecovery()
        const stopRecovery = this.ctx.on('session/event', (session, event) => {
          if (session === this.session) toolRecovery.observe(event)
        })
        try {
          // max-tokens is sticky: once any step hits the ceiling, later steps
          // that complete normally must not downgrade the turn outcome.
          const stepEnd = await this.step(decision)
```

</details>

**依据 6 · 源码核查**：[packages/core/agent-loop/src/agent.ts:442-455](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/agent.ts#L442-L455)

真实LLM stream。

<details>
<summary>查看原文（14行）</summary>

```text
      const request = this.buildRequest(config, preparedCall, assembly.tools, { turn, step }, startsRequestSeries, signal)
      const live = new AssistantStreamAttempt(
        this.session.id,
        ++this.assistantAttemptCounter,
        () => ++this.assistantStreamRevision,
        turn,
        step,
        (frame) => { this.dispatch.emit('agent/assistant-stream', { frame }) },
      )
      let started = false
      try {
        const stream = preparedCall?.stream(request) ?? this.loopCtx.llm.stream(request)
        signal.throwIfAborted()
        live.start()
```

</details>

**依据 7 · 源码核查**：[packages/core/agent-loop/src/agent.ts:550-555](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/agent.ts#L550-L555)

工具执行与继续/结束条件。

```text
        if (toolCalls.length === 0) return { kind: 'completed' }
        const { concluded } = await executeToolCalls(
          this.loopCtx, turn, step, toolCalls, signal,
          context => this.inbox.splice('next-step', this.inbox.nextStep.length, 0, [context]),
        )
        return concluded ? { kind: 'completed' } : null
```

**依据 8 · 源码核查**：[packages/core/agent-loop/src/agent.ts:681-703](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/agent.ts#L681-L703)

session消息/工具历史进入下一request。

<details>
<summary>查看原文（23行）</summary>

```text
      || previousContext.systemPromptUpdate !== requestContext.systemPromptUpdate) {
      session.append('request/context', requestContext)
    }
    signal.throwIfAborted()

    // canonicalHeader is shallow; append logs a detached snapshot, not these local values.
    deepFreeze(header)
    const boundaryMessages = session.deriveMessages()
    for (const message of boundaryMessages) {
      if (this.frozenMessages.has(message)) continue
      deepFreeze(message)
      this.frozenMessages.add(message)
    }
    Object.freeze(boundaryMessages)
    const request = markAgentLoopRequest(Object.freeze({
      ...header.config,
      messages: boundaryMessages,
      toolHistory: session.toolHistory(),
      ...header.tools !== undefined ? { tools: header.tools } : {},
      sessionId: this.session.id,
      signal,
    }))
    return request
```

</details>

**依据 9 · 源码核查**：[packages/core/agent-loop/src/tool-calls.ts:150-176](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/tool-calls.ts#L150-L176)

真实scheduler/有序结果提交。

<details>
<summary>查看原文（27行）</summary>

```text
      if (slot === undefined) break
      const call = group[committed]
      const result = slot.needsPost
        ? await ctx.tools[TOOL_RUNTIME_SCHEDULER].finalize(slot.exec, slot.result)
        : ctx.tools[TOOL_RUNTIME_SCHEDULER].finish(slot.exec, slot.result)
      // oxlint-disable-next-line typescript/no-non-null-assertion -- bounded index
      appendToolResult(session, turn, step, call!.block, result, callSeqs[committed]!)
      for (const context of result.additionalContexts ?? []) acceptContext(context)
      concluded ||= result.concludesTurn === true
      committed++
    }
  }

  const inFlight = new Map<number, Promise<number>>()

  const startCall = async (index: number): Promise<void> => {
    // oxlint-disable-next-line typescript/no-non-null-assertion -- bounded index
    const call = group[index]!
    callSeqs[index] = appendToolCall(session, turn, step, call.block)
    started++
    const prepared = await ctx.tools[TOOL_RUNTIME_SCHEDULER].prepare(call.exec)
    throwSchedulerFailure()
    switch (prepared.kind) {
      case 'dispatch': {
        const promise = ctx.tools[TOOL_RUNTIME_SCHEDULER].dispatch(prepared.exec).then(
          (outcome) => {
            slots[index] = { exec: prepared.exec, result: outcome.result, needsPost: outcome.kind === 'post-result' }
```

</details>

**依据 10 · 源码核查**：[packages/core/tools/src/index.ts:1583-1595](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/tools/src/index.ts#L1583-L1595)

真实工具body执行/错误回包。

<details>
<summary>查看原文（13行）</summary>

```text
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
      return toolErrorResult(error)
```

</details>

**依据 11 · 源码核查**：[packages/core/agent-loop/src/tool-calls.ts:276-289](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/agent-loop/src/tool-calls.ts#L276-L289)

实际tool/result写session。

<details>
<summary>查看原文（14行）</summary>

```text
): void {
  const message = createToolResultMessage({
    callId: block.id,
    content: result.content,
    isError: result.isError,
  })
  session.append('tool/result', {
    turn, step,
    message,
    ...result.error?.info ? { error: result.error.info } : {},
    // The tool's private presentation payload (e.g. a result-time diff),
    // persisted so a UI bridge reproduces the card on replay.
    ...result.meta !== undefined ? { meta: result.meta } : {},
  }, { surfaceOp: 'append', sourceEventSeqs: [callSeq] })
```

</details>

**依据 12 · 源码核查**：[packages/core/session/src/surface.ts:140-150](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/session/src/surface.ts#L140-L150)

tool/result投影message。

<details>
<summary>查看原文（11行）</summary>

```text
    case 'assistant/message': {
      if (event.data.message.content.length === 0) return null
      return event.data.message
    }
    case 'tool/result': {
      return event.data.message
    }
    default:
      // A non-surface event (boundary, attempt, log-only record) projects to
      // no message. Merge-extensible union: no assertNever here.
      return null
```

</details>

**依据 13 · 源码核查**：[packages/core/session/src/index.ts:984-1004](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/packages/core/session/src/index.ts#L984-L1004)

实际deriveMessages包含当前surface。

<details>
<summary>查看原文（21行）</summary>

```text
  deriveMessages(): Message[] {
    const surface = this.surface
    const nodes = surface.nodes
    const generation = surface.contentGeneration
    if (generation !== this.derivedGeneration) {
      this.derived = []
      this.derivedNodes = 0
      this.derivedGeneration = generation
    }
    for (const seq of nodes.slice(this.derivedNodes)) {
      // Surface sequences are built from this.log — seq is always a valid
      // index by construction. The non-null assertion expresses that invariant.
      // oxlint-disable-next-line typescript/no-non-null-assertion
      const msg = this.deriveEventMessage(this.log[seq]!)
      // A surface node is one of the five message-producing types, but an
      // empty-content assistant/message (a max-tokens step that hosts only
      // usage) derives to null and must not enter the transcript.
      if (msg) this.derived.push(msg)
    }
    this.derivedNodes = nodes.length
    return [...this.derived]
```

</details>

**依据 14 · 源码核查**：[apps/deepseekgui/browser-plugin/cordis.patch.yml:10-12](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/cordis.patch.yml#L10-L12)

browser真实composition插入。

```text
- insert:
    - id: deepseekgui-browser
      name: '@see-sol-lab/deepseekgui-browser'
```

**依据 15 · 源码核查**：[apps/deepseekgui/browser-plugin/src/index.ts:75-102](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/index.ts#L75-L102)

enabled/实际facade/工具注册/dispose。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  try {
    applyInner(ctx, config)
  } catch (error) {
    console.error(`[deepseekgui-browser] apply failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function applyInner(ctx: Context, config: Config): void {
  if (config.enabled === false) return
  // B3-11: inside DeepSeekGUI the shell hands us its pane bridge via env — the
  // tools then drive the Codex-style in-window pane. Outside DeepSeekGUI (or
  // with embedded=false) the same tools drive a separate headed Edge window.
  const bridge = config.embedded === false ? null : paneBridgeFromEnv(process.env)
  const browser = new DeepSeekGUIBrowser({
    lookup: { lookup: nodeLookup },
    ...config.channel !== undefined && config.channel !== '' ? { channel: config.channel } : {},
    ...config.headless !== undefined ? { headless: config.headless } : {},
    ...config.screenshotDir !== undefined && config.screenshotDir !== '' ? { screenshotDir: config.screenshotDir } : {},
    ...bridge !== null ? { paneBridge: bridge } : {},
  })
  applyBrowserTools(ctx, browser)
  applyInteractionTools(ctx, browser)
  // effect disposer：fiber 销毁时关闭浏览器与代理（cordis 清理语义）。
  ctx.effect(() => {
    return () => { void browser.close() }
  })
}
```

</details>

**依据 16 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:129-139](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L129-L139)

navigate实际tool body/错误输出。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(args, exec) {
      await enforceGate(ctx, 'browser_navigate', exec)
      try {
        const result = await facade.navigate(args.url, boundedNumber(args.timeout_ms, 30_000, 1_000, NAVIGATE_TIMEOUT_MAX_MS))
        return { status: 'ok', final_url: result.finalUrl, title: result.title }
      } catch (error) {
        return { status: 'error', final_url: '', title: '', reason: error instanceof Error ? error.message : String(error) }
      }
    },
  }))

```

</details>

**依据 17 · 源码核查**：[apps/deepseekgui/browser-plugin/src/pane.ts:29-57](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/pane.ts#L29-L57)

bridge解析/实际header+HTTP请求。

<details>
<summary>查看原文（29行）</summary>

```text
 */
export function paneBridgeFromEnv(env: Record<string, string | undefined>): PaneBridge | null {
  const raw = env.DEEPSEEKGUI_BROWSER_BRIDGE
  if (raw === undefined || raw === '') return null
  const hash = raw.indexOf('#')
  if (hash <= 0 || hash === raw.length - 1) return null
  const host = raw.slice(0, hash)
  const token = raw.slice(hash + 1)
  // Loopback only: refuse anything that is not 127.0.0.1:<port>.
  if (!/^127\.0\.0\.1:\d{1,5}$/.test(host)) return null
  return { origin: `http://${host}`, token }
}

/** POST one action to the pane endpoint; throws on transport or HTTP error. */
async function paneCall(bridge: PaneBridge, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await fetch(`${bridge.origin}/control/browser-pane`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-deepseekgui-control-token': bridge.token,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`browser-pane bridge: HTTP ${String(response.status)}`)
  const data: unknown = await response.json()
  return typeof data === 'object' && data !== null ? data as Record<string, unknown> : {}
}

/**
```

</details>

**依据 18 · 源码核查**：[apps/deepseekgui/src/control-bridge.ts:139-164](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/control-bridge.ts#L139-L164)

真实独立token与pane路由调用。

<details>
<summary>查看原文（26行）</summary>

```text
      // 三条通道各自一把钥匙：pane 认 paneToken，account 认 accountToken，其余认 controlToken。
      const paneRoute = request.method === 'POST' && request.url === '/control/browser-pane'
      const accountRoute = request.method === 'POST' && request.url === '/control/account'
      const expected = paneRoute ? paneToken : accountRoute ? accountToken : controlToken
      if (request.headers['x-deepseekgui-control-token'] !== expected) {
        reply(404, { error: 'not found' })
        return
      }
      if (request.method === 'GET' && request.url !== undefined && request.url.startsWith('/control/model')) {
        // 条件拉取。`?since=<revision>` 时内容未变只回小包
        // `{ revision, changed: false }`；无 since 或已变化回全量模型。
        const since = parseModelSinceParam(new URL(request.url, 'http://127.0.0.1').searchParams.get('since'))
        const model = deps.buildModel()
        if (since !== undefined && since === model.revision) {
          reply(200, { revision: model.revision, changed: false })
          return
        }
        reply(200, { revision: model.revision, changed: true, model })
        return
      }
      if (paneRoute) {
        const body = await readBody(request, PANE_BODY_MAX_BYTES)
        if (body === null) { reply(400, { error: 'invalid JSON' }); return }
        const answer = await deps.handlePaneRequest(body)
        reply(answer.status, answer.body)
        return
```

</details>

**依据 19 · 源码核查**：[apps/deepseekgui/src/control-bridge.ts:193-203](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/control-bridge.ts#L193-L203)

回环listen/env注入。

<details>
<summary>查看原文（11行）</summary>

```text
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  /* v8 ignore next 3 -- listening 之后 address() 必为 AddressInfo */
  if (address === null || typeof address === 'string') {
    throw new Error('control bridge failed to report a listening address')
  }
  // 桥地址 + **pane 专用**凭证经 env 注入我们自己 spawn 的 DSH 子进程
  // （dsh-service 的 inheritedEnv 透传 process.env），browser-plugin 由此
  // 找到 pane 通道。只进子进程环境，不落盘、不进任何窗口。
  deps.env.DEEPSEEKGUI_BROWSER_BRIDGE = `127.0.0.1:${String(address.port)}#${paneToken}`
```

</details>

**依据 20 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:394-412](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L394-L412)

实际启动proxy和内嵌/外部browser分支。

<details>
<summary>查看原文（19行）</summary>

```text
    let proxy: SsrfProxy | undefined
    let launched: Browser | null = null
    try {
      proxy = await startSsrfProxy(this.options.lookup)
      this.proxy = proxy
      if (this.closed) throw new Error('browser instance has been disposed')
      if (this.options.paneBridge !== undefined) {
        await this.attachPane(this.options.paneBridge, proxy)
        return
      }
      const browser = await chromium.launch({
        ...this.options.channel !== undefined ? { channel: this.options.channel } : {},
        ...this.options.headless !== undefined ? { headless: this.options.headless } : {},
      })
      launched = browser
      this.browser = browser
      this.context = await browser.newContext({
        proxy: { server: `http://127.0.0.1:${proxy.port}` },
        viewport: { width: 1280, height: 800 },
```

</details>

**依据 21 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:439-463](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L439-L463)

代理设置/CDP/只选择指定pane。

<details>
<summary>查看原文（25行）</summary>

```text
  private async attachPane(bridge: PaneBridge, proxy: SsrfProxy): Promise<void> {
    const { cdpPort, paneUrl } = await paneEnsure(bridge)
    await paneSetProxy(bridge, `http=127.0.0.1:${String(proxy.port)};https=127.0.0.1:${String(proxy.port)}`)
    // `noDefaults` 是必须的：没有它，Playwright 接管每个已有页面时会按
    // context 默认值下发 Emulation.setEmulatedMedia（colorScheme 缺省
    // "light"），把官方 UI 与 backdrop 的 prefers-color-scheme 一并钉成浅
    // 色——系统深色下即"深壁纸 + 黑字"（issue #5，关 pane 也不恢复，因为
    // 连接一直挂着）。带上它，默认 context（= 主界面所在的 Electron 默认
    // session）跳过全部默认 override；pane 在独立 partition，不受影响。
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${String(cdpPort)}`, { noDefaults: true })
      .catch((error: unknown) => { throw cdpConnectFailure(cdpPort, error) })
    // The shell awaits the pane's navigation before replying, so the URL is
    // committed on its side; CDP page state can still trail it by a tick, so
    // one short retry covers the gap instead of failing the whole tool call.
    let pane = findPaneByUrl(browser, paneUrl)
    if (pane === undefined) {
      await new Promise((resolve) => { setTimeout(resolve, 250) })
      pane = findPaneByUrl(browser, paneUrl)
    }
    if (pane === undefined) {
      // Disconnect only — connectOverCDP's close() never kills the shell.
      await browser.close().catch(() => undefined)
      throw new Error('embedded browser pane not found over CDP')
    }
    this.browser = browser
```

</details>

#### 缺口

- 未运行模型/页面，未展开全部底座权限、loop错误重试或所有bridge路由/编译工件。
  **影响**：闭合源码链只能证明实现路径，不保证各平台/模型/插件组合真成功，也不许pane密钥边界代表整机隔离。
  **进一步探讨**：独立home做无害只读网页定位，核真实浏览器动作、tool/result确回下一模型并能停止；另测丢bridge/插件缺项/模型错误的显式结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 定位、审批与SSRF分别防什么，动作回包还缺什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

权限不是“所有提交总先问”。sandboxModeOf取sandboxPolicy.resolve(session)，服务缺失回read-only；read-only拒绝交互/submit，L0 navigate/snapshot等可过。一般模式中敏感submit调ApprovalService并按allowed-once等结果门控，缺channel拒绝；danger-full-access的enforceGate内部直接填allowed-once而不问，但实际敏感调用还必须过approveSubmission，不能就此认定会执行。该helper令approvedUrl初值为空，仅reason回调执行时填facade.currentUrl；Full access分支不调用reason，随后读正常非空currentUrl与空串比较即抛“page changed”。稳定Full access/正常非空页面下，这是固定源码可推的误拒条件，未执行复现。submit、敏感click、type+Enter和可提交keyboard均经此helper；一般审批模式会执行reason/填URL，不把它们也一概判失败。click先按交互门，检查目标tag/type/role/label/inForm，submit/后果词或检查失败升级审批，审批后再比目标facts一致才click；键盘可提交键也有分类。这个检查确有作用，不能再把“加审批后目标检查”当未来新功能。

但目标facts是页面可见/结构启发式，不验证任意JS处理器的真实外部后果；同URL/同role/name不等同一业务对象。snapshot refs只映射role/name，检查同page/URL，歧义可见匹配拒绝，导航清ref；selector/role/text另有路径，不能泛化成所有locator都必须绑定先前快照。它们最终调Playwright locator.click；browser_submit同样是点击并回submitted字符串，click回clicked，不提供独立后置业务成功证据。某个正常await返回或模型继续推理不证明表单已受理、数据已保存/支付完成；本轮没有复现错误或利用。

网络侧navigate先校验URL/DNS，goto后再验最终URL；resolveChecked任一地址命中blocked就拒绝。HTTP proxy验证并用checked IP，CONNECT限允许端口并netConnect到checked IP，pane实际setProxy带<-loopback>避免默认回环绕过。它降低访问私网/重绑定风险，不是网页内容可信、prompt注入、账号授权或业务只读证明，不能因L0叫读而保证服务器对GET绝无副作用。

| 效果 | 已核实现 | 不能推出 |
|---|---|---|
| 目标线索 | ref page/URL、唯一可见、审批后facts复比 | 不变业务对象/全部定位强绑定 |
| 权限区分 | 只读拒交互、一般模式敏感审批；Full access正常页面helper误拒条件 | 所有模式成功提交/任意JS后果都识别 |
| 网络边界 | URL/DNS/checked-IP proxy/回环绕过禁用 | 整机沙箱/页面可信或内容不出网 |
| 动作反馈 | Playwright动作/导航结果与tool message | 业务完成或未知结果可盲目重放 |

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:23-46](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L23-L46)

有效mode与审批service实际请求。

<details>
<summary>查看原文（24行）</summary>

```text
/** Effective sandbox mode; missing policy service fails safe to read-only. */
function sandboxModeOf(ctx: Context, agent: Agent | undefined): 'read-only' | 'workspace-write' | 'danger-full-access' {
  const policy = ctx.sandboxPolicy
  if (policy === undefined) return 'read-only'
  if (agent === undefined) return policy.resolve().mode
  return policy.resolve({ session: agent.session }).mode
}

/** L2 approval helper: missing service yields null → gate fails closed. */
async function approvalOutcomeOf(
  ctx: Context,
  exec: { agent?: Agent; callId: ToolCallId; signal: AbortSignal },
  toolName: string,
  reason: string,
): Promise<'allowed-once' | 'rejected' | 'cancelled' | 'unavailable' | null> {
  const approval = ctx.approval
  if (approval === undefined || exec.agent === undefined) return null
  return approval.request({
    agent: exec.agent,
    toolName,
    callId: exec.callId,
    reason,
    signal: exec.signal,
  })
```

</details>

**依据 2 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:55-84](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L55-L84)

只读早拒与Full access跳审批真实条件。

<details>
<summary>查看原文（30行）</summary>

```text
export async function enforceGate(
  ctx: Context,
  toolName: string,
  exec: { agent?: Agent; callId: ToolCallId; signal: AbortSignal },
  reason: string | (() => Promise<string>) = '',
): Promise<void> {
  exec.signal.throwIfAborted()
  if (sandboxModeOf(ctx, exec.agent) === 'read-only' && checkBrowserAction(toolName, 'read-only', null).kind === 'deny') {
    throw new Error(toolName + ' refused in a read-only session: browser interaction changes the outside world')
  }
  let outcome: Awaited<ReturnType<typeof approvalOutcomeOf>> = null
  // DeepSeekGUI (2026-09-29): Full access is the preset "without approval
  // prompts" — its `never` policy would reject the ask, so an L2 action is
  // allowed without one. Browser actions carry no red-warning concern.
  if (requiresApproval(toolName) && sandboxModeOf(ctx, exec.agent) === 'danger-full-access') {
    outcome = 'allowed-once'
  } else if (requiresApproval(toolName)) {
    const detail = typeof reason === 'function' ? await reason() : reason
    exec.signal.throwIfAborted()
    outcome = await approvalOutcomeOf(ctx, exec, toolName, detail)
  }
  exec.signal.throwIfAborted()
  const decision = checkBrowserAction(toolName, sandboxModeOf(ctx, exec.agent), outcome)
  if (decision.kind === 'deny') {
    const detail = decision.reason === 'read-only-session'
      ? 'refused in a read-only session: browser interaction changes the outside world'
      : decision.reason === 'approval-unavailable'
        ? 'refused: no approval channel is available (fail closed)'
        : 'refused: the user did not approve this action'
    throw new Error(`${toolName} ${detail}`)
```

</details>

**依据 3 · 源码核查**：[apps/deepseekgui/browser-plugin/src/gate.ts:74-81](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/gate.ts#L74-L81)

点击后果分类启发式。

```text
export function clickNeedsApproval(facts: ClickTargetFacts | null): boolean {
  // Could not read the element: it might be anything, so fail closed.
  if (facts === null) return true
  if (facts.type === 'submit' || facts.type === 'image') return true
  // A <button> inside a form submits it unless it opts out with type="button".
  if (facts.tag === 'button' && facts.inForm && facts.type !== 'button') return true
  if (facts.role === 'button' && facts.inForm) return true
  return CONSEQUENTIAL_WORDS.some(word => facts.label.includes(word))
```

**依据 4 · 源码核查**：[apps/deepseekgui/browser-plugin/src/gate.ts:94-107](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/gate.ts#L94-L107)

提交键/工具等级分类。

<details>
<summary>查看原文（14行）</summary>

```text
  if (keys.split('+').pop() === ' ') return true
  const last = keys.trim().toLowerCase().split('+').pop()?.trim() ?? ''
  return last === 'enter' || last === 'numpadenter' || last === 'return' || last === 'space'
}

/** Tools that mutate external state and require approval (form submit / send / login). */
export const L2_TOOLS = ['browser_submit'] as const

/** Classify a tool name into its gate level; unknown tools refuse (fail closed). */
export function browserToolLevel(toolName: string): BrowserToolLevel {
  if ((B2_READ_TOOLS as readonly string[]).includes(toolName)) return 'L0-read'
  if ((M3_INTERACT_TOOLS as readonly string[]).includes(toolName)) return 'L1-interact'
  if ((L2_TOOLS as readonly string[]).includes(toolName)) return 'L2-sensitive'
  return 'L1-interact' // unknown browser_* tools are treated as interactive
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/browser-plugin/src/gate.ts:146-175](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/gate.ts#L146-L175)

实际等级门/审批结果。

<details>
<summary>查看原文（30行）</summary>

```text
export function checkBrowserAction(
  toolName: string,
  sandboxMode: SandboxMode,
  approvalOutcome: 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable' | null,
): GateDecision {
  const level = browserToolLevel(toolName)
  switch (level) {
    case 'L0-read':
      return { kind: 'allow' }
    case 'L1-interact':
      // Browser interaction mutates external state: never in read-only.
      return sandboxMode === 'read-only'
        ? { kind: 'deny', reason: 'read-only-session' }
        : { kind: 'allow' }
    case 'L2-sensitive':
      // L2 ⊃ L1: submitting posts data to a remote origin, which is strictly
      // more consequential than the clicks L1 already refuses here. Without
      // this line a read-only session refused browser_click yet allowed
      // browser_submit the moment the user tapped the approval card.
      if (sandboxMode === 'read-only') {
        return { kind: 'deny', reason: 'read-only-session' }
      }
      if (approvalOutcome === null || approvalOutcome === 'unavailable') {
        return { kind: 'deny', reason: 'approval-unavailable' }
      }
      return approvalOutcome === 'allowed-once'
        ? { kind: 'allow' }
        : { kind: 'deny', reason: 'approval-rejected' }
  }
}
```

</details>

**依据 6 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:309-319](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L309-L319)

approveSubmission仅reason填URL；Full access跳reason后正常非空URL与空比较误拒，源码条件未实测。

<details>
<summary>查看原文（11行）</summary>

```text
async function approveSubmission(
  ctx: Context, exec: { agent?: Agent; callId: ToolCallId; signal: AbortSignal }, facade: BrowserFacade, target: string,
): Promise<void> {
  let approvedUrl = ''
  await enforceGate(ctx, 'browser_submit', exec, async () => {
    approvedUrl = await facade.currentUrl()
    return submitApprovalReason(new URL(approvedUrl).origin, target)
  })
  const currentUrl = await facade.currentUrl()
  exec.signal.throwIfAborted()
  if (currentUrl !== approvedUrl) throw new Error('The browser page changed while approval was pending; take a new snapshot and ask again')
```

</details>

**依据 7 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:461-471](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L461-L471)

type+Enter实际进入敏感审批callee。

<details>
<summary>查看原文（11行）</summary>

```text
      // L1 gate always; Enter additionally passes the L2 approval door, since
      // "type then Enter" is how a form actually gets submitted. Without this
      // the L2 gate was advisory: the model could submit any form by asking
      // browser_type to press Enter instead of calling browser_submit.
      await enforceGate(ctx, 'browser_type', exec)
      if (pressEnter) {
        await approveSubmission(ctx, exec, facade, locatorLabel(locatorArgs))
      }
      exec.signal.throwIfAborted()
      await facade.type(locatorOf(locatorArgs), args.text, args.clear_first ?? true, pressEnter)
      return { typed: `${args.text.length} characters` }
```

</details>

**依据 8 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:522-529](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L522-L529)

可提交keyboard实际进入敏感审批callee。

```text
      // Same door as browser_type's press_enter: Enter is how a focused form
      // gets submitted, so it cannot be a silent L1 keystroke.
      if (keystrokeCanSubmit(args.keys)) {
        await approveSubmission(ctx, exec, facade, `keyboard: ${args.keys}`)
      }
      exec.signal.throwIfAborted()
      await facade.keyboard(args.keys)
      return { pressed: args.keys }
```

**依据 9 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:249-288](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L249-L288)

tabs真实list/new/switch/close执行。

<details>
<summary>查看原文（40行）</summary>

```text
    name: 'browser_tabs',
    description: 'Manage browser tabs: list, new, switch, close. Switching by index requires the browser_snapshot-level view; index 0 is the first tab.',
    parameters: {
      action: { type: 'string', required: true, description: 'One of: list, new, switch, close.' },
      index: { type: 'number', description: 'Tab index for switch/close. Defaults to the current tab.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          tabs: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                index: { type: 'number', required: true },
                url: { type: 'string', required: true },
                title: { type: 'string', required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => [{ type: 'text', text: formatTabs(value) }],
    },
    timeoutMs: 30_000,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      await enforceGate(ctx, 'browser_tabs', exec)
      if (args.index !== undefined && (!Number.isSafeInteger(args.index) || args.index < 0)) throw new Error('tab index must be a non-negative integer')
      if (args.action === 'switch') {
        await facade.tabs('switch')
        await facade.selectTab(args.index ?? 0)
        return { tabs: await facade.tabs('list') }
      }
      const action = args.action === 'list' ? 'list' : args.action === 'new' ? 'new' : args.action === 'close' ? 'close' : 'list'
      return { tabs: await facade.tabs(action, action === 'close' ? args.index : undefined) }
```

</details>

**依据 10 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:407-420](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L407-L420)

敏感click审批后facts比较，再执行。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      await enforceGate(ctx, 'browser_click', exec)
      // A click can press the very button browser_submit would, so the promise
      // "submitting asks first" only holds if consequential clicks go through
      // the same door. Judged from the element itself, not from the tool name.
      const target = await facade.inspectClickTarget(locatorOf(args))
      if (clickNeedsApproval(target)) {
        await approveSubmission(ctx, exec, facade, locatorLabel(args))
        const confirmed = await facade.inspectClickTarget(locatorOf(args))
        if (confirmed === null || JSON.stringify(confirmed) !== JSON.stringify(target)) throw new Error('The click target changed or could not be verified after approval; take a new snapshot')
      }
      exec.signal.throwIfAborted()
      await facade.click(locatorOf(args), args.button === 'right' ? 'right' : 'left')
      return { clicked: locatorLabel(args) }
```

</details>

**依据 11 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:573-578](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L573-L578)

submit实际点击与submitted输出。

```text
    async execute(args, exec) {
      const target = locatorLabel(args)
      await approveSubmission(ctx, exec, facade, target)
      exec.signal.throwIfAborted()
      await facade.submit(locatorOf(args))
      return { submitted: target }
```

**依据 12 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:542-580](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L542-L580)

ref page/URL/唯一可见及其他locator路径。

<details>
<summary>查看原文（39行）</summary>

```text
  private resolveLocator(loc: ElementLocator, page: Page): import('playwright-core').Locator {
    if (loc.selector !== undefined && loc.selector !== '') return page.locator(loc.selector)
    if (loc.role !== undefined && loc.role !== '') {
      return page.getByRole(loc.role as never, loc.name !== undefined && loc.name !== '' ? { name: loc.name } : {})
    }
    if (loc.ref !== undefined && loc.ref !== '') {
      if (this.refPage !== page || this.refUrl !== page.url()) throw new Error('snapshot references belong to another page; take a new browser_snapshot')
      const entry = this.refTable.get(loc.ref)
      if (entry !== undefined && entry.role !== '') {
        return page.getByRole(entry.role as never, { name: entry.name, exact: true })
      }
    }
    if (loc.text !== undefined && loc.text !== '') return page.getByText(loc.text, { exact: false })
    throw new Error('locator: none of ref/text/selector/role resolved to an element — snapshot the page first')
  }

  /**
   * The one element an interaction acts on: the first VISIBLE match.
   *
   * Three failures of the old "first match, wait until actionable" rule, all
   * from one site that renders every card of every page into the DOM and
   * lets pagination toggle visibility (2026-09-11 manual test round 3):
   * text "查看详情" on page 2 resolved to a hidden page-1 card and waited the
   * full timeout for it to become visible; a CSS selector matching 213 cards
   * threw a strict-mode violation listing them; and a name that matched
   * nothing at all also sat for the full timeout. Now: nothing attached
   * within a short window → "no element matches"; matches but none visible →
   * says so with the count; otherwise the first visible one, in document
   * order — what "click the first card" means.
   * @param loc - the model-facing locator.
   * @param page - the target page.
   * @returns a locator pinned to exactly one visible element.
   */
  private async resolveTarget(loc: ElementLocator, page: Page): Promise<import('playwright-core').Locator> {
    const matches = this.resolveLocator(loc, page)
    const target = await firstVisibleMatch(matches, describeLocator(loc))
    if (loc.ref !== undefined && !loc.selector && !loc.role && await matches.filter({ visible: true }).count() !== 1) {
      throw new Error('snapshot reference matches multiple visible elements; use a unique selector or text instead')
    }
```

</details>

**依据 13 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:584-587](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L584-L587)

真实Playwright click。

```text
  async click(loc: ElementLocator, button: 'left' | 'right'): Promise<void> {
    await this.ensure()
    const page = this.activePage()
    await (await this.resolveTarget(loc, page)).click({ button })
```

**依据 14 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:672-698](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L672-L698)

submit与导航真实校验/结果。

<details>
<summary>查看原文（27行）</summary>

```text
  async submit(loc: ElementLocator): Promise<void> {
    await this.ensure()
    await (await this.resolveTarget(loc, this.activePage())).click()
  }

  async navigate(url: string, timeoutMs: number): Promise<{ finalUrl: string; title: string }> {
    await this.ensure()
    // The gate: hygiene + resolve + check BEFORE the browser moves.
    const verdict = await validateNavigationTarget(url, this.options.lookup)
    if (!verdict.ok) {
      throw new Error(`navigation blocked: ${verdict.detail}`)
    }
    const page = this.activePage()
    // A new address opens the panel (#22); a bridge hiccup here must not
    // fail the navigation the user asked for.
    if (this.options.paneBridge !== undefined) await paneReveal(this.options.paneBridge).catch(() => undefined)
    this.refTable.clear()
    this.refPage = null
    await page.goto(url, { timeout: timeoutMs, waitUntil: 'domcontentloaded' })
    const finalUrl = page.url()
    // Post-navigation re-check of the settled URL (redirect hops were each
    // re-validated by the proxy; this is the last-hop confirmation).
    const settled = await validateNavigationTarget(finalUrl, this.options.lookup)
    if (!settled.ok) {
      throw new Error(`navigation landed on a blocked target: ${settled.detail}`)
    }
    return { finalUrl, title: await page.title() }
```

</details>

**依据 15 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:714-722](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L714-L722)

snapshot refs的实际缓存绑定。

```text
    }
    const nodes = cdpTreeToNodes(await cdpAccessibilityTree(page), maxDepth)
    // Cache the ref → (role, name) table so interaction tools can resolve
    // snapshot refs into ARIA locators without re-reading the tree.
    this.refTable.clear()
    collectRefs(nodes, this.refTable)
    this.refPage = page
    this.refUrl = page.url()
    return { title: await page.title(), url: page.url(), nodes, text: await pageText(page) }
```

**依据 16 · 源码核查**：[apps/deepseekgui/browser-plugin/src/ssrf.ts:201-234](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/ssrf.ts#L201-L234)

DNS全部地址检查到verdict。

<details>
<summary>查看原文（34行）</summary>

```text
export async function resolveChecked(host: string, lookup: HostLookup): Promise<TargetVerdict> {
  let ips: readonly string[]
  try {
    ips = await lookup.lookup(host)
  } catch (error) {
    return { ok: false, reason: 'invalid-host', detail: `DNS resolution failed for ${host}: ${error instanceof Error ? error.message : String(error)}` }
  }
  if (ips.length === 0) {
    return { ok: false, reason: 'invalid-host', detail: `DNS resolution returned no addresses for ${host}` }
  }
  const blocked = ips.find(ip => isBlockedIp(ip))
  if (blocked !== undefined) {
    return { ok: false, reason: 'blocked-ip', detail: `host ${host} resolves to a blocked address (${blocked})` }
  }
  return { ok: true, host, ips }
}

/**
 * The complete navigation gate: hygiene → resolve → check. Every navigation
 * (including each redirect hop) runs this before bytes move.
 * @param input - the URL string.
 * @param lookup - DNS injection.
 * @param maxLength - URL length bound.
 * @returns the final verdict with the checked IPs for connect-by-IP.
 */
export async function validateNavigationTarget(
  input: string,
  lookup: HostLookup,
  maxLength = 2048,
): Promise<TargetVerdict> {
  const hygiene = validateUrlHygiene(input, maxLength)
  if (!hygiene.ok) return hygiene
  return resolveChecked(hygiene.host, lookup)
}
```

</details>

**依据 17 · 源码核查**：[apps/deepseekgui/browser-plugin/src/proxy.ts:199-228](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/proxy.ts#L199-L228)

HTTP校验并checked IP转发。

<details>
<summary>查看原文（30行）</summary>

```text
  const absolute = /^https?:\/\//i.test(request.url)
    ? request.url
    : `http://${request.headers.host ?? 'invalid'}${request.url}`
  const verdict = await validateNavigationTarget(absolute, lookup)
  if (response.destroyed || response.writableEnded) return
  if (!verdict.ok) {
    response.writeHead(502, { 'content-type': 'text/html; charset=utf-8' })
    response.end(blockedPage(verdict.detail))
    return
  }
  const target = verdict.ips[0]
  if (target === undefined) {
    response.writeHead(502).end('no address')
    return
  }
  let upstreamUrl: URL
  try {
    upstreamUrl = new URL(absolute)
  } catch {
    response.writeHead(502).end('bad target')
    return
  }
  const forwarded = httpRequest({
    // The original hostname stays the HTTP authority; `lookup` below is what
    // decides which address the socket actually reaches.
    host: upstreamUrl.hostname,
    // The target's own port, not a hardcoded 80 — `http://host:8080/` used to
    // be dialled on 80. Port is not the SSRF axis here (the connection always
    // goes to the already-validated IP); the CONNECT path stays 443-only
    // because a raw tunnel is opaque, while this request is one we compose.
```

</details>

**依据 18 · 源码核查**：[apps/deepseekgui/browser-plugin/src/proxy.ts:271-290](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/proxy.ts#L271-L290)

CONNECT端口/校验/指定IP连接。

<details>
<summary>查看原文（20行）</summary>

```text
  const authority = parseConnectAuthority(target)
  if (authority === null || !ALLOWED_CONNECT_PORTS.has(authority.port)) {
    clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n')
    clientSocket.destroy()
    return
  }
  const { host, port } = authority
  const verdict = await validateNavigationTarget(`https://${toUrlAuthority(host)}/`, lookup)
  if (!verdict.ok) {
    clientSocket.write(`HTTP/1.1 502 Bad Gateway\r\nX-DeepSeekGUI-Block: ${escapeHtml(verdict.detail)}\r\n\r\n`)
    clientSocket.destroy()
    return
  }
  const checkedIp = verdict.ips[0]
  if (checkedIp === undefined) {
    clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n')
    clientSocket.destroy()
    return
  }
  const upstream = netConnect({ host: checkedIp, port })
```

</details>

**依据 19 · 源码核查**：[apps/deepseekgui/src/browser-pane-runtime.ts:10-12](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/browser-pane-runtime.ts#L10-L12)

实际proxy禁止loopback隐式绕过。

```text
export function configureBrowserPaneProxy(session: Pick<Session, 'setProxy'>, proxyRules: string): Promise<void> {
  return session.setProxy({ proxyRules, proxyBypassRules: '<-loopback>' })
}
```

#### 缺口

- 未覆盖SSRF/重定向/WebSocket全部协议、网页脚本后果、审批UI身份/并发目标变化及Full access误拒条件实测。
  **影响**：不宜把该浏览器直接用于无人监督的真实外部写操作；网络与审批绿态不足以承担对象/业务结果保证。
  **进一步探讨**：先在受控正常非空页面核Full access和一般审批两模式helper，再测同URL换对象、同名目标、普通标签带远端副作用、审批后变化与丢响应，独立看真实服务状态；未知结果先对账，勿自动重放。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、真实本地残留与退出成本怎么界定？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

应用与Harness/profile/plugins/原生运行时必须匹配，现有源构建不是发行签名/Windows与实验Linux兼容验证。已核路径需所选模型账户/API、网络与浏览器/CDP；内嵌pane使用Electron，外部模式需可启动的浏览器channel/playwright-core。完整工具系统可改本地文件/运行命令，浏览器只读不自动限制其他工具；本轮只建议明确有效只读会话和复制workspace，真实权限策略另核。

截图实际mkdir screenshotDir并以wx/0600写PNG，隐私/磁盘成本不能因pane非Node就忽略；导航与所选模型会接收网络内容，README也明确任务上下文可发配置模型服务。退出有真实proceedQuit等待controller.stop/terminal cancel及platform dispose，stopService委托stopProcess。Windows通常taskkill /T /F，但失败回直接child.kill不保证孙进程；POSIX直接kill，宽限后SIGKILL/最终拒绝超时，不是所有平台全树必停。browser.close等launchQueue后清refs、paneHide、关闭CDP连接/外部browser与proxy；内嵌关闭是断开和收起，不当杀Shell或撤销网页外部动作。插件dispose用void调用close亦不证明所有退出阶段都已await。源码有清理路径不等机器上无残留，本轮没测卸载/资料搬家。

| 依赖/条件 | 是否必需 | 用途 | 缺失/不满足 |
|---|---|---|---|
| 匹配桌面/Harness/profile/资源 | 该桌面链必需 | 子进程、官方UI、overlays | 部分可选插件降级，发行/构建需对应 |
| 模型账户/API与权限 | 模型任务需 | 推理/工具决策 | 路由/登录/付费可失败；工具回包不等任务成功 |
| Browser/CDP/网络 | 浏览功能需 | 内嵌pane或外部browser | bridge/启动/目标被拒须显示，不能假装已浏览 |
| 本地资料与工作区/磁盘 | 使用/截图需 | 会话/作品/本地PNG | 需保全已有文件，不能许自动全清 |

| 阶段 | 现金与资源 | 人工与时间 | 已知/未知 |
|---|---|---|---|
| 首次 | 应用/运行时/浏览器、模型现金未知 | 固定版本/独立home/副本、确认当前mode与插件 | 未装包/真启动，时长未知 |
| 持续 | 模型输入/浏览流量/截图磁盘 | 逐任务核目标/结果、管理截图与会话 | 无净节时/费用/真实用户数据 |
| 失败恢复 | 未知外部写结果、残留进程/代理/partial本地改动 | 先看页面/服务真实状态、工具结果/文件diff，再恢复 | 协议失败不证明无执行，不盲目重放 |
| 退出 | 会话、代码/截图/配置与账号状态可能残留 | 等退出/核进程、保存作品与收据，按实际资料范围清理 | 不许全平台无孙进程/远端回滚/统一卸载保证 |

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/browser-plugin/package.json:25-42](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/package.json#L25-L42)

playwright/Host peers与私有插件依赖。

<details>
<summary>查看原文（18行）</summary>

```text
    "@deepseek-ai/schemastery": "workspace:~",
    "playwright-core": "^1.62.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "workspace:~",
    "@deepseek-ai/dsh-tools": "workspace:*"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "workspace:~",
    "@deepseek-ai/dsh-agent": "workspace:*",
    "@deepseek-ai/dsh-llm": "workspace:*",
    "@deepseek-ai/dsh-sandbox-policy": "workspace:*",
    "@deepseek-ai/dsh-tools": "workspace:*",
    "@deepseek-ai/dsh-user-approval": "workspace:*",
    "@deepseek-ai/schemastery": "workspace:~",
    "typescript": "^5.0.0"
  }
}
```

</details>

**依据 2 · 源码核查**：[README.md:160-166](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/README.md#L160-L166)

作者对本地资料/模型与网络行为的声明，不当独立隐私验证。

```text

文档里也保留了上游 Harness 的开发教程和插件开发参考。

## 数据与隐私

托管环境中的凭据、设置、会话与全局记忆保存在应用本地数据目录；Windows 默认为 `%APPDATA%\DeepSeekGUI\dsh`。项目记忆保存在所选工作区的 `<文件夹名>.memory.md` 中。模型请求会将当前任务所需的上下文发送到你配置的模型服务；浏览网页、Git / PR、插件管理和更新检查也会访问相应网络服务。

```

**依据 3 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:737-755](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L737-L755)

真实截图错误和本地PNG写入。

<details>
<summary>查看原文（19行）</summary>

```text
    } catch (error) {
      // A hidden or not-yet-composited pane has no bitmap; say so instead of
      // surfacing Playwright's "0 width" (DS 验房 2026-09-06).
      const message = error instanceof Error ? error.message : String(error)
      if (/0 width|0 height/u.test(message)) {
        // The panel is collapsed (the user closed it): a hidden view has no
        // bitmap. The panel is the user's to open — say so instead of
        // popping it (2026-09-11 manual test #22).
        throw new Error('the embedded browser pane is hidden (the user collapsed it), so there is nothing to capture; ask the user to open the browser panel (the globe button), then retry — navigating to a new address also opens it')
      }
      throw error
    }
    const { mkdirSync, writeFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    mkdirSync(this.options.screenshotDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const file = join(this.options.screenshotDir, `browser-${stamp}-${randomUUID()}.png`)
    writeFileSync(file, buffer, { flag: 'wx', mode: 0o600 })
    return file
```

</details>

**依据 4 · 源码核查**：[apps/deepseekgui/src/main.ts:634-654](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/main.ts#L634-L654)

真实退出等待/失败显示，不凭注释许无进程。

<details>
<summary>查看原文（21行）</summary>

```text
async function proceedQuit(finish: () => void = () => { app.quit() }): Promise<void> {
  if (quitting) return
  quitting = true
  try {
    await controller?.stop()
    // 终端清理必须被等待：cancel 的 taskkill 整树完成之后才 app.quit，
    // "Quit 后无子进程"是等待过的事实，不是赶时间窗的巧合。
    if (terminalOperation !== undefined) {
      await terminalOperation.cancel()
      terminalOperation = undefined
    }
    // 平台页的登录态要在退出前清干净（失败只记日志，不挡退出）。
    await platformView?.dispose().catch((error: unknown) => { console.error('[deepseekgui] 平台页清理失败', error) })
    terminalWindow?.destroy()
    terminalWindow = undefined
    tray?.destroy()
    tray = undefined
    usageControl?.dispose()
  } catch (error) {
    quitting = false
    if (!SMOKE) dialog.showErrorBox(desktopLocaleZh() ? '退出尚未完成' : 'Shutdown did not finish', redactSecrets(String(error)))
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/src/main.ts:853-869](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/main.ts#L853-L869)

stopService实际委托进程停止。

<details>
<summary>查看原文（17行）</summary>

```text
async function stopService(): Promise<void> {
  const child = service.child
  if (child === undefined) return
  service.stopped = true
  try {
    await stopProcess(child, undefined, undefined, undefined, desktopLocaleZh())
  } catch (error) {
    // 没能停下来就不能假装停了：保留 child 引用，让后续状态如实反映进程
    // 还活着，并把失败抛给调用方决定怎么办（提示用户，还是强制退出）。
    service.stopped = false
    throw error
  }
  service.child = undefined
  service.stopped = false
  // 账号状态与平台会话属于那一代 Harness：停了就作废，等下一代重新推。
  desktopAccount?.reset()
  if (signInUsageTimer !== undefined) { clearTimeout(signInUsageTimer); signInUsageTimer = undefined }
```

</details>

**依据 6 · 源码核查**：[apps/deepseekgui/src/dsh-service.ts:931-978](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/src/dsh-service.ts#L931-L978)

Windows整树/失败降级、POSIX与最终超时。

<details>
<summary>查看原文（48行）</summary>

```text
export function stopProcess(
  child: ChildProcess,
  timeoutMs = STOP_TIMEOUT_MS,
  // 可注入的整树终止器（测试用）；默认 taskkill /T /F。windowsHide：
  // taskkill 是控制台子系统二进制，打包 GUI（无控制台）下不加会每次
  // 终止都闪一个黑框。
  spawnTreeKill: (pid: number) => ChildProcess = pid => spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true }),
  hardTimeoutMs = STOP_HARD_TIMEOUT_MS,
  zh = true,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve()
      return
    }
    let settled = false
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
    }, timeoutMs)
    // 最终期限：SIGKILL 也可能失败（权限不足、进程卡在不可中断的系统调用）。
    // 原先只等 exit 事件，那种情况下 quit / restart 会永远等下去。
    const hardTimer = setTimeout(() => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reject(new ProcessStopError(zh
        ? `子进程（pid ${String(child.pid ?? 'unknown')}）在 ${String(hardTimeoutMs)}ms 内没有退出`
        : `The child process (pid ${String(child.pid ?? 'unknown')}) did not exit within ${String(hardTimeoutMs)}ms`))
    }, hardTimeoutMs)
    child.once('exit', () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      clearTimeout(hardTimer)
      resolve()
    })
    if (process.platform === 'win32' && child.pid !== undefined) {
      const killer = spawnTreeKill(child.pid)
      // taskkill 不可用（error）或非零退出（权限不足等）而目标仍在运行时，
      // 回退为直接终止子进程；树内孙进程此时无法保证。
      killer.once('error', () => child.kill())
      killer.once('exit', (code) => {
        if (code !== 0 && child.exitCode === null && child.signalCode === null) child.kill()
      })
      return
    }
    child.kill()
  })
```

</details>

**依据 7 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:869-889](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L869-L889)

真实pane/CDP/proxy关闭与边界。

<details>
<summary>查看原文（21行）</summary>

```text
  async close(): Promise<void> {
    this.closed = true
    await this.launchQueue?.catch(() => undefined)
    this.refTable.clear()
    this.refPage = null
    // Pane mode: collapse the pane in the shell, then just disconnect —
    // connectOverCDP's close() drops the session without killing the shell.
    if (this.panePage !== null && this.options.paneBridge !== undefined) {
      await paneHide(this.options.paneBridge).catch(() => undefined)
    }
    this.panePage = null
    if (this.browser !== null) {
      await this.browser.close().catch(() => undefined)
      this.browser = null
      this.context = null
    }
    if (this.proxy !== null) {
      await this.proxy.close().catch(() => undefined)
      this.proxy = null
    }
    this.launchQueue = null
```

</details>

**依据 8 · 源码核查**：[apps/deepseekgui/browser-plugin/src/index.ts:98-102](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/index.ts#L98-L102)

dispose调用void close，不是所有退出await证明。

```text
  // effect disposer：fiber 销毁时关闭浏览器与代理（cordis 清理语义）。
  ctx.effect(() => {
    return () => { void browser.close() }
  })
}
```

#### 缺口

- 未测安装/模型账单/跨平台退出或全部账号数据/更新/迁移成本。
  **影响**：不能将稳定标题或有清理代码当低维护/无残留的生产承诺，实际总成本和退出责任仍需小范围量化。
  **进一步探讨**：独立资料目录核启动、模型/浏览用量、截图/文件前后diff和退出进程；涉及外部写先在受控站点验证后置事实，再决定权限。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可采用范围及超出现有机制的新方向怎么证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可试的是同窗口只读代码/公开网页定位和可见工具轨迹，不把浏览器动作字符串或UI/进程健康当自主业务交付。已有真loop、SSRF指定IP、分mode审批、敏感点击审批后facts复比、ref page/URL与歧义拒绝已经存在；新增相同护栏或把底座loop重新包装，不构成新生产方向。

先修approveSubmission在Full access未填approvedUrl造成误拒的条件，并对照一般审批/只读拒绝，属于现有插件修复、不计未来创新。其后可证伪方向只限浏览器任务后置核验：绑定当前业务对象/目标与授权范围，区分动作已发起、结果待核、独立事实已证实，必要时读回受控服务状态；不因clicked/submitted或模型自述就让后续步骤当成功。它要超出当前元素facts复比/截图ref与全局任务状态，不是再造一个任务面板。对于丢响应或同页内容变化，先对账再恢复，不能承诺协议层知道业务未执行。适合能获得后置查询接口/允许独立核验的有限业务；无法读回就unknown/人工，不许额外模型编个绿色结果。

最低对照使用受控菜单/表单及模拟业务服务：普通标签按钮有写副作用、同URL对象替换、审批后DOM改、动作成功但前端超时、动作await正常但服务拒绝、重复响应。比较原生DSH+浏览器/现有DeepSeekGUI/增加核验层，同模型预算；独立服务日志与人工事实判答案。记录误目标、越范围、假成功、重复写、人工恢复分钟、模型/浏览资源和维护投入；假成功/重复写不得高于基线，不能新增数据损失。若当前护栏已覆盖全部、没有真实用户需求或核验层增加工时而不减少错结果，则停止独立插件，把必要修复留在现有browser插件。

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:309-319](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L309-L319)

approveSubmission仅reason填URL；Full access跳reason后正常非空URL与空比较误拒，源码条件未实测。

<details>
<summary>查看原文（11行）</summary>

```text
async function approveSubmission(
  ctx: Context, exec: { agent?: Agent; callId: ToolCallId; signal: AbortSignal }, facade: BrowserFacade, target: string,
): Promise<void> {
  let approvedUrl = ''
  await enforceGate(ctx, 'browser_submit', exec, async () => {
    approvedUrl = await facade.currentUrl()
    return submitApprovalReason(new URL(approvedUrl).origin, target)
  })
  const currentUrl = await facade.currentUrl()
  exec.signal.throwIfAborted()
  if (currentUrl !== approvedUrl) throw new Error('The browser page changed while approval was pending; take a new snapshot and ask again')
```

</details>

**依据 2 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:461-471](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L461-L471)

type+Enter实际进入敏感审批callee。

<details>
<summary>查看原文（11行）</summary>

```text
      // L1 gate always; Enter additionally passes the L2 approval door, since
      // "type then Enter" is how a form actually gets submitted. Without this
      // the L2 gate was advisory: the model could submit any form by asking
      // browser_type to press Enter instead of calling browser_submit.
      await enforceGate(ctx, 'browser_type', exec)
      if (pressEnter) {
        await approveSubmission(ctx, exec, facade, locatorLabel(locatorArgs))
      }
      exec.signal.throwIfAborted()
      await facade.type(locatorOf(locatorArgs), args.text, args.clear_first ?? true, pressEnter)
      return { typed: `${args.text.length} characters` }
```

</details>

**依据 3 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:522-529](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L522-L529)

可提交keyboard实际进入敏感审批callee。

```text
      // Same door as browser_type's press_enter: Enter is how a focused form
      // gets submitted, so it cannot be a silent L1 keystroke.
      if (keystrokeCanSubmit(args.keys)) {
        await approveSubmission(ctx, exec, facade, `keyboard: ${args.keys}`)
      }
      exec.signal.throwIfAborted()
      await facade.keyboard(args.keys)
      return { pressed: args.keys }
```

**依据 4 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:249-288](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L249-L288)

tabs真实list/new/switch/close执行。

<details>
<summary>查看原文（40行）</summary>

```text
    name: 'browser_tabs',
    description: 'Manage browser tabs: list, new, switch, close. Switching by index requires the browser_snapshot-level view; index 0 is the first tab.',
    parameters: {
      action: { type: 'string', required: true, description: 'One of: list, new, switch, close.' },
      index: { type: 'number', description: 'Tab index for switch/close. Defaults to the current tab.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          tabs: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                index: { type: 'number', required: true },
                url: { type: 'string', required: true },
                title: { type: 'string', required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => [{ type: 'text', text: formatTabs(value) }],
    },
    timeoutMs: 30_000,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      await enforceGate(ctx, 'browser_tabs', exec)
      if (args.index !== undefined && (!Number.isSafeInteger(args.index) || args.index < 0)) throw new Error('tab index must be a non-negative integer')
      if (args.action === 'switch') {
        await facade.tabs('switch')
        await facade.selectTab(args.index ?? 0)
        return { tabs: await facade.tabs('list') }
      }
      const action = args.action === 'list' ? 'list' : args.action === 'new' ? 'new' : args.action === 'close' ? 'close' : 'list'
      return { tabs: await facade.tabs(action, action === 'close' ? args.index : undefined) }
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:407-420](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L407-L420)

当前已含审批后目标facts复核。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      await enforceGate(ctx, 'browser_click', exec)
      // A click can press the very button browser_submit would, so the promise
      // "submitting asks first" only holds if consequential clicks go through
      // the same door. Judged from the element itself, not from the tool name.
      const target = await facade.inspectClickTarget(locatorOf(args))
      if (clickNeedsApproval(target)) {
        await approveSubmission(ctx, exec, facade, locatorLabel(args))
        const confirmed = await facade.inspectClickTarget(locatorOf(args))
        if (confirmed === null || JSON.stringify(confirmed) !== JSON.stringify(target)) throw new Error('The click target changed or could not be verified after approval; take a new snapshot')
      }
      exec.signal.throwIfAborted()
      await facade.click(locatorOf(args), args.button === 'right' ? 'right' : 'left')
      return { clicked: locatorLabel(args) }
```

</details>

**依据 6 · 源码核查**：[apps/deepseekgui/browser-plugin/src/tools.ts:573-578](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/tools.ts#L573-L578)

当前提交输出不是独立业务确认。

```text
    async execute(args, exec) {
      const target = locatorLabel(args)
      await approveSubmission(ctx, exec, facade, target)
      exec.signal.throwIfAborted()
      await facade.submit(locatorOf(args))
      return { submitted: target }
```

**依据 7 · 源码核查**：[apps/deepseekgui/browser-plugin/src/browser.ts:542-580](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1e913d8b38b23df083bd6d3852b623f93210360a/apps/deepseekgui/browser-plugin/src/browser.ts#L542-L580)

已有ref/唯一可见能力与未来业务对象核验区别。

<details>
<summary>查看原文（39行）</summary>

```text
  private resolveLocator(loc: ElementLocator, page: Page): import('playwright-core').Locator {
    if (loc.selector !== undefined && loc.selector !== '') return page.locator(loc.selector)
    if (loc.role !== undefined && loc.role !== '') {
      return page.getByRole(loc.role as never, loc.name !== undefined && loc.name !== '' ? { name: loc.name } : {})
    }
    if (loc.ref !== undefined && loc.ref !== '') {
      if (this.refPage !== page || this.refUrl !== page.url()) throw new Error('snapshot references belong to another page; take a new browser_snapshot')
      const entry = this.refTable.get(loc.ref)
      if (entry !== undefined && entry.role !== '') {
        return page.getByRole(entry.role as never, { name: entry.name, exact: true })
      }
    }
    if (loc.text !== undefined && loc.text !== '') return page.getByText(loc.text, { exact: false })
    throw new Error('locator: none of ref/text/selector/role resolved to an element — snapshot the page first')
  }

  /**
   * The one element an interaction acts on: the first VISIBLE match.
   *
   * Three failures of the old "first match, wait until actionable" rule, all
   * from one site that renders every card of every page into the DOM and
   * lets pagination toggle visibility (2026-09-11 manual test round 3):
   * text "查看详情" on page 2 resolved to a hidden page-1 card and waited the
   * full timeout for it to become visible; a CSS selector matching 213 cards
   * threw a strict-mode violation listing them; and a name that matched
   * nothing at all also sat for the full timeout. Now: nothing attached
   * within a short window → "no element matches"; matches but none visible →
   * says so with the count; otherwise the first visible one, in document
   * order — what "click the first card" means.
   * @param loc - the model-facing locator.
   * @param page - the target page.
   * @returns a locator pinned to exactly one visible element.
   */
  private async resolveTarget(loc: ElementLocator, page: Page): Promise<import('playwright-core').Locator> {
    const matches = this.resolveLocator(loc, page)
    const target = await firstVisibleMatch(matches, describeLocator(loc))
    if (loc.ref !== undefined && !loc.selector && !loc.role && await matches.filter({ visible: true }).count() !== 1) {
      throw new Error('snapshot reference matches multiple visible elements; use a unique selector or text instead')
    }
```

</details>

#### 缺口

- 没有受控业务任务对照、真实用户愿持续使用/支付或后置核验净益。
  **影响**：只能支持有限只读试用；独立生产插件方向仍为待证假说，不把设计或大仓体量当价值。
  **进一步探讨**：先取得合法受控任务与独立服务真值，设错误/恢复工时/总投入阈值，不获净益则停。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
