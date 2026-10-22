# cute-fat-fish-pet / src

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e53f63e](https://github.com/12we21/cute-fat-fish-pet/tree/e53f63e67227671aca092e3334c8611e29b880b6/src)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)
<!-- END META -->

> **实现功能**：DSH 插件半侧的动画桌宠，提供 Web/桌面宠物、文字对话和可选屏幕能力；独立 Windows 版另有语音等功能。

> **核心亮点**：把 VP9-alpha 动画、桌面交互和 DSH 会话模型对话组合成宠物插件。详见[Q01](#research-q01)。

> **风险与缺陷**：发布 lib 与 TS 的能力不同；可选屏幕观察会保存截图/附件并交宿主模型，local 标签不单独保证目的地，关闭不取消在途且路由准入依外层。详见[Q04](#research-q04)、[Q05](#research-q05)、[Q06](#research-q06)。

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
  - [Q01 · 这个 src 子目录插件提供什么？](#detail-section-11)
  - [Q02 · 对话后端与桌面 Helper 如何分工？](#detail-section-12)
  - [Q03 · 隐私、性能和安装成本怎样评估？](#detail-section-13)
  - [Q04 · 发布入口是否等同TS，看屏幕链实际上在哪里？](#detail-section-14)
  - [Q05 · 屏幕送往哪里，关掉监测和卸载清理的边界是什么？](#detail-section-15)
  - [Q06 · 路由、自动下载和进程停止有哪些采用条件？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想在 DSH Web 或桌面显示动画宠物，并与当前模型或本地桌面模型互动。

DSH 原生状态展示或独立 Windows 桌宠；本组件嵌入 DSH，并非独立版全功能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 动画/漫步 | 陪伴 | 资源/性能 |
| 聊天 | 与宠物对话 | Web/桌面后端不同 |
| 桌面 | helper 窗口 | Electron 可自动下载 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH 0.2.0-rc.1+ | Host/client API | 兼容未知 |
| VP9-alpha 浏览器 | 动画 | 降级未知 |
| Electron/Ollama/在线 provider | 桌面/对话 | 按模式降级 |

#### 隔离试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| Web | 观察动画/聊天 | 模型路径清楚 |
| 桌面 | 核 Electron 来源 | 下载可见/可控 |
| 隐私 | 切屏幕/在线模式 | 出站符合选择 |

**效果与成本**

#### 成本

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 安装 | 整仓约 68MB | 慢网超时 |
| 运行 | VP9-alpha/GPU、Electron | 性能未知 |
| 聊天 | Ollama 或 DSH provider | 模式需核对 |

#### 效果

| 项 | 代码支持 | 未知 |
| --- | --- | --- |
| 动画桌宠 | WebM/helper | 真实视觉/性能 |
| 对话 | DSH llm + helper Ollama | UI 路由清晰度 |
| 看屏幕 | 作者声明可选 | 端到端权限/出站 |

> **思考**：发布 lib 与 TS 的能力不同；可选屏幕观察会保存截图/附件并交宿主模型，local 标签不单独保证目的地，关闭不取消在途且路由准入依外层。详见[Q04](#research-q04)、[Q05](#research-q05)、[Q06](#research-q06)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 VP9-alpha 动画、桌面交互和 DSH 会话模型对话组合成宠物插件。详见[Q01](#research-q01)。

把 VP9-alpha 动画、桌面交互和 DSH 会话模型对话组合成宠物插件。详见[Q01](#research-q01)。

Host 路由、记忆/LLM 与 Electron helper 通过 bridge 共用配置；helper 缺 Electron 时自动下载。

<a id="detail-section-5"></a>

### 1.4 主要限制

发布 lib 与 TS 的能力不同；可选屏幕观察会保存截图/附件并交宿主模型，local 标签不单独保证目的地，关闭不取消在途且路由准入依外层。详见[Q04](#research-q04)、[Q05](#research-q05)、[Q06](#research-q06)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；仅可信本机、明确模型及附件目的地的无敏感环境可小样评估，屏幕观察与自动 Electron 下载需分别明确配置及残留清理。详见[Q05](#research-q05)、[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

组件边界与 Host/Helper 路径可核；网页对话直接用 DSH 当前模型，README 的本地/在线与“仅在线模型才离机”说法需限定，桌面 Helper 可自动下载 Electron。

- 已检查：作者 README、包清单、源码路径 src/README.zh-CN.md、src/package.json、src/src/host/index.ts、src/src/host/chat.ts、src/src/host/helper-process.ts、src/runtime/electron-helper/main.js、src/lib/index.js、README.md 及固定范围 inventory；组件：src。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 src 插件组件 README、package、Host 对话/Helper；不运行宠物、下载 Electron 或抓屏。 父侧追加审阅实际发布 src/lib/index.js 的屏幕观察与路由，TS 不覆盖该发布专属补丁。
- 下一步：目标 DSH Web/桌面真实动画、模型模式、Electron 下载、屏幕可选性和网络/性能监测。

**分析版本**

- **仓库**：[12we21/cute-fat-fish-pet](https://github.com/12we21/cute-fat-fish-pet)
- **版本号**：1.2.3（[固定提交 e53f63e](https://github.com/12we21/cute-fat-fish-pet/tree/e53f63e67227671aca092e3334c8611e29b880b6)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

首次外部下载、在线记忆发送与屏幕能力单独显式提示并作出站测试，可提高可理解性；待实机。详见[Q03](#research-q03)。

目标 DSH Web/桌面真实动画、模型模式、Electron 下载、屏幕可选性和网络/性能监测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 17928 | 15530 | 2258 | — |
| .md | source | 3 | 418 | — | — | 7243 |
| .mjs | source | 2 | 454 | 329 | 102 | — |
| .ts | source | 33 | 8986 | 6565 | 2013 | — |
| .ts | test | 17 | 3130 | 2499 | 349 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+created%3A2026-09-22T06%3A20%3A14.777Z..2026-10-22T06%3A20%3A14.777Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A20%3A14.777Z..2026-10-22T06%3A20%3A14.777Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实子目录插件的 Web/桌面宠物、对话后端和网络/安装边界，避免混入独立 Windows 版。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个 src 子目录插件提供什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

这是 cute-fat-fish-pet 仓库的 DSH 插件组件，而非根目录独立 Windows 产品。它含 106 个透明 VP9 WebM 动画、Web/桌面宠物、漫步交互、文字对话和碎碎念；README 明确排除独立版的离线语音识别、Edge TTS 与控制台。包有 Host/client 双入口和 Electron helper，数据根为 DSH_HOME/dsh-pet，包名改为 cute-fat-fish-pet 后路径/路由保留旧前缀。动画数量和视觉效果是作者陈述，本轮未逐帧/实机核验；组件材料不能外推独立版功能。

#### 证据与依据

**依据 1 · 作者声明**：[src/README.zh-CN.md:1-45](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/README.zh-CN.md#L1-L45)

作者说明插件能力、与独立版区别及数据根。

<details>
<summary>查看原文（45行）</summary>

````text
# 蓝毛小女仆

一个 **DeepSeek Harness** 桌宠插件：**106 个手绘透明动画**、桌面漫步、点击反应，可以接
本地 **Ollama** 或 DSH 会话自带的在线模型聊天，可选看屏幕吐槽。

这个目录是本项目的**插件半侧**。独立 Windows 版（同一个角色，另含离线语音识别、Edge TTS、
控制台和安装包）在仓库根目录，见[根 README](https://github.com/12we21/cute-fat-fish-pet/blob/main/README.zh-CN.md)。

## 安装

```bash
dsh plugin --profile web add github:12we21/cute-fat-fish-pet#path:/src
```

不需要构建：`lib/` 里已经是编好的宿主与客户端产物。

> **注意：这条命令会拉整个仓库的 tarball，约 68 MB。** 106 个动画占了绝大部分。慢网下可能
> 超时，超时就先克隆再用本地路径装：

```bash
git clone --depth 1 https://github.com/12we21/cute-fat-fish-pet
dsh plugin --profile web add ./cute-fat-fish-pet/src
```

## 你会得到什么

- **106 个手绘动画** —— 带真实 alpha 通道的 VP9-alpha `webm`，叠在你的壁纸上。待机呼吸、
  打瞌睡又被惊醒、跳舞、撸猫、吃东西、过节，点一下就有对应的反应。
- **桌面漫步** —— 她自己走来走去，也会看鼠标：拖她、点她，她都会有反应。
- **聊天** —— 在 DSH 网页界面里跟她说话。可以指向本机 **Ollama** 模型，也可以走你当前
  DSH 会话已经在用的在线模型；有一个全局开关切「只用本地 / 只用 DSH / 本地优先」。
- **碎碎念** —— 她能冒一句由你当前会话模型生成的一句话。
- **可选看屏幕** —— 配合内置的原生抓屏组件，她可以看看你屏幕上是什么并吐槽。不开就是不开。

## 这一半**没有**什么

插件是独立版的子集。下面这些只在独立 Windows 版里，插件里没有：

- 离线语音识别（sherpa-onnx + SenseVoice）
- Edge TTS 朗读
- 单页控制台

## 数据放在哪

聊天记忆和你的配置覆盖都在 `$DSH_HOME/dsh-pet/` 下。除非你把聊天指向在线模型，否则没有
````

</details>

**依据 2 · 源码核查**：[src/package.json:1-81](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/package.json#L1-L81)

Host/client exports、运行时目录和组件包。

<details>
<summary>查看原文（81行）</summary>

```text
{
  "name": "cute-fat-fish-pet",
  "version": "1.2.3",
  "description": "「可爱大肥鱼桌宠」的桌宠本体（宿主半侧入口）：待机动画、随机动作、桌面漫步、陪聊与看屏幕。由 Mikolu 独立开发和维护；早期基础架构来自上游 dsh-pet 0.3.0（MIT，作者 PC2005-cloud）。",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "desktop-pet",
    "pet",
    "floating-widget",
    "web-ui",
    "cordis",
    "react"
  ],
  "homepage": "https://github.com/12we21/cute-fat-fish-pet#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/12we21/cute-fat-fish-pet.git"
  },
  "bugs": {
    "url": "https://github.com/12we21/cute-fat-fish-pet/issues"
  },
  "_comment": [
    "=============== 包清单说明（1.1.0 独立仓库） ===============",
    "type: module —— 本包是 ESM",
    "main: lib/index.js —— 宿主半侧入口（Cordis 插件：name/inject/apply）",
    "exports['./client'] —— 浏览器半侧入口，DSH 模块系统按它提供 /plugins/cute-fat-fish-pet/client.js",
    "★ 硬约束：lib/client.js 里 window.__ModuleLoader__.load({ id }) 的 id 必须等于本清单的 name（见 src/src/client/index.ts 的注释）。不符时宿主侧毫无报错，只是 Web 半边永远不注册（loader 提示 loaded without registering \"<name>\" via __ModuleLoader__.load）——2026-10-10 从 dsh-pet 改名时漏改，已修。",
    "dsh.bundle.patch —— 声明本包是 bundle，patch 文件是 cordis.patch.yml（安装后自动进层栈）",
    "dsh.client —— 声明浏览器半侧的注入依赖和平台（web）",
    "files —— npm publish 只发这些目录/文件（assets/webm 播放资源（VP9-alpha，浏览器 Chrome/Edge/Firefox 与桌面模式共用））",
    "scripts.ensure:electron —— 自动下载 Electron（装到没预装 Electron 的机器时用）",
    "scripts.test —— 单元素测试（用 node 自带的类型擦除，不需要额外依赖）。已知：上游的 routes / work-status-lifecycle / displays 三个文件要 DSH 宿主包（@deepseek-ai/*），本仓库不带，会报 ERR_MODULE_NOT_FOUND；host-liveness 里有 2 条断言查上游构建脚本（scripts/start-desktop.mjs、scripts/prepack-check.js），本仓库没有这两个文件。其余文件应全绿。",
    "peerDependencies —— 运行时由宿主（DSH）提供的模块，本包不打包它们",
    "上游的构建/发布流水线（tsdown、prepare、prepack、typecheck、lint）不随本仓库分发：本仓库的构建入口在仓库根的 package.json（build/build.mjs 等）",
    "================================================"
  ],
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets/webm",
    "runtime/electron-helper",
    "assets/fonts",
    "assets/pic",
    "assets/memes",
    "assets/config.jsonc",
    "scripts/ensure-electron.mjs",
    "cordis.patch.yml"
  ],
  "scripts": {
    "ensure:electron": "node scripts/ensure-electron.mjs",
    "test": "node --test \"src/**/*.test.ts\""
  },
  "license": "MIT",
  "author": "Mikolu",
  "dependencies": {
    "@electron-internal/extract-zip": "^1.0.5",
    "@electron/get": "^5.1.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
```

</details>

**依据 3 · 源码核查**：[src/src/host/index.ts:474-535](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/index.ts#L474-L535)

desktop helper 由 Host 管理。

<details>
<summary>查看原文（62行）</summary>

```text
  let helper: HelperProcess | undefined;
  let startRetryTimer: NodeJS.Timeout | undefined;
  let electronEnsure: Promise<void> | undefined;
  let disposed = false;
  /** 「无图形环境」提示只在进程生命周期内打一次，避免守护循环刷屏 */
  let displayWarned = false;

  /** 用已确认存在的 Electron 路径拉起桌面 Helper（每只桌面宠物一个局部小窗口）。 */
  const launchHelper = (electronPath: string | undefined): void => {
    if (helper || disposed) return;
    if (!hasDesktopPet) return; // 无宠物显示在桌面（display 含 desktop/both）：不启动
    const port = typeof ctx.webServer?.port === 'number' ? ctx.webServer.port : 0;
    if (!port || port <= 0) {
      // webServer 可能尚未完成监听（OS 分配端口时 port 短暂为 0）：延迟重试。
      if (!startRetryTimer) {
        startRetryTimer = setTimeout(() => {
          startRetryTimer = undefined;
          launchHelper(electronPath);
        }, 500);
        startRetryTimer.unref?.();
      }
      return;
    }
    const origin = `http://127.0.0.1:${port}`;
    // 桌面渲染端也从同一份 handlePetRoute 拿成品配置（每只宠物一个局部小窗口；经管道，不走 HTTP——
    // DSH Desktop 2.0.3+ 会拦插件自拉进程的裸 HTTP 请求，浏览器访问闸门只放行带令牌的请求）
    const configUrl = `${origin}${ROUTE_PREFIX}/config`;
    helper = new HelperProcess(
      {
        electronPath,
        env: {
          DSH_PET_CONFIG_URL: configUrl,
          DSH_PET_SCALE: '1',
          // 打开 bridge 协议：main.js 注册 dsh-pet-bridge scheme，把渲染端请求经管道转给宿主
          DSH_PET_BRIDGE: '1',
          // 每只桌面宠物一个局部小窗口：透传宠物列表（[{id,size}]）
          DSH_PET_PETS: JSON.stringify(desktopPetList()),
        },
        // bridge 协议处理器 = HTTP 路由同一份 handlePetRoute（业务逻辑唯一，两端天然一致）；
        // 素材过文件路径（main.js 自行读盘），json/text 过 body
        bridgeHandler: async (req) => {
          const result = await handlePetRoute(req.url ?? '/', req.method ?? 'GET', req.body);
          if (result.kind === 'file') {
            // file 分支恒 200（404/400 已由 text 分支表达）
            return { id: req.id, status: 200, contentType: result.contentType, file: result.file };
          }
          if (result.kind === 'text') {
            return { id: req.id, status: result.status, contentType: 'text/plain; charset=utf-8', body: result.body };
          }
          return {
            id: req.id,
            status: result.status,
            contentType: 'application/json; charset=utf-8',
            body: JSON.stringify(result.obj),
          };
        },
      },
      ctx.logger ?? console,
    );
    try {
      helper.start();
      ctx.logger?.info?.(`dsh-pet desktop helper started (config: ${configUrl})`);
```

</details>

#### 缺口

- 未运行 Web/桌面宠物或核 106 动画全量质量。
  **影响：**视觉、性能和语音/聊天体验未知。
  **进一步探讨：**在目标 DSH 分别验证 Web/桌面模式和资产解码，限定只评插件半侧。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 对话后端与桌面 Helper 如何分工？

**研究主题：**功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Web/Host 的 /chat 路径调用 generateChat，直接使用 agentDefaultModel.currentSelection 与 ctx.llm，拼上用户输入和本地记忆；因此当前代码中的网页对话由 DSH 选中模型驱动。Ollama 调用路径位于 Electron helper 的 main.js，服务桌面宠物本地文本模型；README 一句“在 DSH 网页界面可以指向本机 Ollama 或当前在线模型”未由 Host Web/chat 路径直接证明，需目标 UI 实测配置流。桌面 helper 先找本机 Electron，无则若有图形环境自动异步下载 43.3.0（默认 npmmirror，可配置镜像）到 DSH_HOME/electron；此行为与 README“除非在线模型，否则没有任何东西离开电脑”不完全一致，至少会有外部下载请求。helper 的配置变更重启有等待与队列、崩溃重启/熔断路径，但本轮未做实机。

#### 证据与依据

**依据 1 · 源码核查**：[src/src/host/chat.ts:68-109](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/chat.ts#L68-L109)

Web/Host 对话取当前 DSH 模型并调用 llm。

<details>
<summary>查看原文（42行）</summary>

```text
): Promise<ChatGenerateResult> {
  let sel: { provider: string; model: string };
  try {
    sel = ctx.agentDefaultModel.currentSelection();
  } catch {
    return { ok: false, reason: 'provider-missing', message: '当前对话未配置模型' };
  }
  if (!sel?.provider || !sel?.model) {
    return { ok: false, reason: 'provider-missing', message: '当前对话未配置模型' };
  }
  const llm = (ctx as { llm?: { stream(o: unknown): AsyncIterable<unknown> } }).llm;
  if (!llm || typeof llm.stream !== 'function') {
    return { ok: false, reason: 'generate-error', message: 'LLM 服务不可用' };
  }

  // 历史 → dsh-llm 消息：user 经 createUserMessage（plugin 来源），assistant 经 createAssistantMessage
  const historyMessages = history.map((m) =>
    m.role === 'user'
      ? createUserMessage({
          content: [{ type: 'text', text: m.content }],
          source: { kind: 'user' },
        })
      : createAssistantMessage({
          content: [{ type: 'text', text: m.content }],
          source: { provider: sel.provider, model: sel.model },
        }),
  );

  const deadline = AbortSignal.timeout(TIMEOUT_MS);
  // 仅当模型声明支持 reasoning effort（含 "off"）时才传，否则省略：
  // 无 reasoning 元数据的模型（如 reasoningEfforts: false）显式传 off 会被
  // dsh-llm 判为 UNSUPPORTED_REASONING_EFFORT 并折叠成空流（表现为"模型未返回文本"）。
  const supportsOff = await supportsReasoningOff(ctx, sel.provider, sel.model);
  // 配图：池非空才把清单与指令附进 user 正文（空池 = 关闭配图，正文与旧行为逐字一致）
  const wantImage = pool.length > 0;
  const options = {
    provider: sel.provider,
    model: sel.model,
    messages: [
      ...historyMessages,
      createUserMessage({
        content: [{ type: 'text', text: wantImage ? userText + imageInstruction(pool) : userText }],
```

</details>

**依据 2 · 源码核查**：[src/runtime/electron-helper/main.js:1002-1039](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/runtime/electron-helper/main.js#L1002-L1039)

桌面 helper Ollama 本地 HTTP 路径。

<details>
<summary>查看原文（38行）</summary>

```text
const PET_OLLAMA_BASE = String(process.env.DSH_PET_OLLAMA || 'http://127.0.0.1:11434').replace(/\/+$/, '');
function petOllamaCall(pathname, opts) {
  const http = require('node:http');
  const o = opts && typeof opts === 'object' ? opts : {};
  return new Promise((resolve) => {
    let data = null;
    if (o.body !== null && o.body !== undefined) {
      try { data = JSON.stringify(o.body); } catch (e) { return resolve({ ok: false, error: 'bad-body' }); }
    }
    const headers = data === null ? {} : { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data) };
    const req = http.request(PET_OLLAMA_BASE + pathname, { method: o.method || 'GET', headers, timeout: Number(o.timeoutMs) || 4000 }, (res) => {
      let d = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(d || '{}');
          const good = res.statusCode >= 200 && res.statusCode < 300;
          resolve(good ? { ok: true, json: j } : { ok: false, error: 'http-' + res.statusCode, json: j });
        } catch (e) { resolve({ ok: false, error: 'bad-json' }); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (e) => resolve({ ok: false, error: String((e && e.message) || e) }));
    if (data !== null) req.write(data);
    req.end();
  });
}

// 本机装了哪些模型 / 现在常驻哪些（右键菜单用它列选项；**只读**，不改任何东西）
ipcMain.handle('pet:list-models', async () => {
  const [tags, ps] = await Promise.all([petOllamaCall('/api/tags'), petOllamaCall('/api/ps')]);
  const models = ((tags.json && tags.json.models) || [])
    .map((m) => ({ name: String((m && m.name) || ''), size: Number(m && m.size) || 0 }))
    .filter((m) => m.name);
  const loaded = ((ps.json && ps.json.models) || []).map((m) => String((m && m.name) || '')).filter(Boolean);
  if (!models.length) return { ok: false, error: tags.error || 'ollama-unreachable' };
  return { ok: true, models, loaded };
```

</details>

**依据 3 · 源码核查**：[src/src/host/index.ts:543-575](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/index.ts#L543-L575)

桌面模式缺 Electron 时自动下载。

<details>
<summary>查看原文（33行）</summary>

```text
   *  （不 spawn 子进程，CLI node 与 DSH Desktop 均适用），下载完成后自动拉起。 */
  const startHelper = (): void => {
    if (helper || electronEnsure || disposed) return;
    if (!hasDesktopPet) return; // 无宠物显示在桌面（display 含 desktop/both）：不启动
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        ctx.logger?.warn?.(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
    }
    const found = resolveElectronPath();
    if (found) {
      launchHelper(found);
      return;
    }
    console.warn(`[dsh-pet] Electron not found, downloading to ${defaultElectronExe()} ...`);
    electronEnsure = ensureElectronDownload()
      .then((path) => {
        if (path) {
          launchHelper(path);
        } else {
          console.warn(
            '[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.',
          );
        }
      })
      .finally(() => {
```

</details>

**依据 4 · 源码核查**：[src/src/host/helper-process.ts:163-249](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/helper-process.ts#L163-L249)

默认 npmmirror、下载/解压 Electron。

<details>
<summary>查看原文（87行）</summary>

```text
  /** Electron 版本号（默认 43.3.0，可被 DSH_PET_ELECTRON_VERSION 覆盖）。 */
  version?: string;
  /** 下载镜像（默认 npmmirror，可被 DSH_PET_ELECTRON_MIRROR 覆盖）。 */
  mirror?: string;
  /** 单次下载超时（默认 10 分钟）。 */
  timeoutMs?: number;
}

/**
 * 进程内下载并解压 Electron 到 $DSH_HOME/electron。
 * 不 spawn 子进程：在 CLI node 与 Electron 宿主（DSH Desktop）里都可用，
 * 修复原 ensure-electron.mjs 用 process.execPath 调脚本导致宿主重复拉起的问题。
 * 已存在则原样返回；失败返回 undefined（不影响 DSH 与浏览器 overlay）。
 */
export async function ensureElectronDownload(options: EnsureElectronOptions = {}): Promise<string | undefined> {
  const version = options.version || process.env.DSH_PET_ELECTRON_VERSION || '43.3.0';
  const mirror = options.mirror || process.env.DSH_PET_ELECTRON_MIRROR || 'https://npmmirror.com/mirrors/electron/';
  const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
  const targetDir = electronLandingDir();
  const exe = defaultElectronExe();
  if (existsSync(exe)) return exe;

  // 下载日志用 console 直出（ctx.logger 在部分宿主不映射到终端，排障时看不到）。
  const log = (message: string): void => console.log(`[dsh-pet] ${message}`);
  const warn = (message: string): void => console.warn(`[dsh-pet] ${message}`);
  const startedAt = Date.now();

  log(`Electron not found, downloading v${version} (${PLAT}-${process.arch}) ...`);
  mkdirSync(targetDir, { recursive: true });

  try {
    // 官方 @electron/get 下载：负责 URL 拼装、镜像、SHA256 校验（sumchecker）、下载缓存
    // （同一版本只下载一次，之后命中缓存秒回）。超时用 AbortController 传给 fetch。
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(new Error(`Electron download timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
    timer.unref?.();
    let nextLogAt = Date.now() + 3000;
    try {
      const zipPath = await downloadArtifact({
        version: `v${version}`,
        artifactName: 'electron',
        // platform/arch 不传：@electron/get 用宿主平台与架构自动推断
        // （getHostArch 还处理 arm → armv7l 特例，比显式传 process.arch 更准）
        mirrorOptions: { mirror: mirror.replace(/\/$/, '') + '/' },
        downloadOptions: {
          signal: controller.signal,
          quiet: true, // 关掉 @electron/get 自己的进度条（stdout 走宿主日志，不进 bridge 协议）
          getProgressCallback: async (progress: { transferred: number; total: number | null }) => {
            const now = Date.now();
            if (!progress.total || now < nextLogAt) return;
            nextLogAt = now + 3000;
            log(
              `downloading ${(progress.transferred / 1024 / 1024).toFixed(1)}MB / ${(progress.total / 1024 / 1024).toFixed(1)}MB`,
            );
          },
        },
      });
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      log(`download complete (${seconds}s), extracting to ${targetDir} ...`);
      // 官方 @electron-internal/extract-zip 解压（electron 43 官方安装同款）：
      // 纯 Node + native binding，跨平台一致，正确处理 symlink 与文件权限，
      // 不需要系统 unzip/tar/powershell，也没有我们手写的平台适配链。
      await extract(zipPath, { dir: targetDir });
      if (!existsSync(exe)) {
        throw new Error(`Electron zip extracted, but ${ELECTRON_REL} not found`);
      }
      const readySeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      log(`ready in ${readySeconds}s: ${exe}`);
      return exe;
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    warn(`ensure failed: ${error instanceof Error ? error.message : String(error)}`);
    warn('desktop pet unavailable. Set DSH_PET_ELECTRON_PATH to an existing Electron, or retry later.');
    return undefined;
  }
}

export function defaultLaunch(options: HelperOptions = {}): { command: string; args: string[] } {
  const electronPath = resolveElectronPath([options.electronPath]);
  if (!electronPath) {
    throw new Error('dsh-pet: cannot resolve Electron executable. Set DSH_PET_ELECTRON_PATH or install electron.');
  }
```

</details>

**依据 5 · 作者声明**：[src/README.zh-CN.md:24-43](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/README.zh-CN.md#L24-L43)

作者描述 Web/Ollama 与本地数据。

<details>
<summary>查看原文（20行）</summary>

```text

## 你会得到什么

- **106 个手绘动画** —— 带真实 alpha 通道的 VP9-alpha `webm`，叠在你的壁纸上。待机呼吸、
  打瞌睡又被惊醒、跳舞、撸猫、吃东西、过节，点一下就有对应的反应。
- **桌面漫步** —— 她自己走来走去，也会看鼠标：拖她、点她，她都会有反应。
- **聊天** —— 在 DSH 网页界面里跟她说话。可以指向本机 **Ollama** 模型，也可以走你当前
  DSH 会话已经在用的在线模型；有一个全局开关切「只用本地 / 只用 DSH / 本地优先」。
- **碎碎念** —— 她能冒一句由你当前会话模型生成的一句话。
- **可选看屏幕** —— 配合内置的原生抓屏组件，她可以看看你屏幕上是什么并吐槽。不开就是不开。

## 这一半**没有**什么

插件是独立版的子集。下面这些只在独立 Windows 版里，插件里没有：

- 离线语音识别（sherpa-onnx + SenseVoice）
- Edge TTS 朗读
- 单页控制台

## 数据放在哪
```

</details>

#### 缺口

- 未在目标环境验证 Web 的 Ollama 切换与下载真实请求。
  **影响：**不能确认 UI 是否有额外代理路径，也无法估算下载频率。
  **进一步探讨：**隔离 profile 分别选 Web/桌面、本地/在线，监测目标地址与模型路由。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐私、性能和安装成本怎样评估？

**研究主题：**依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

README 给出的 GitHub 子目录安装需下载整个约 68MB 仓库，资产播放另需浏览器 VP9-alpha 解码；桌面显示还需要 Electron，缺失时可能自动下载并启动 helper。在线 DSH 模型对话会传送用户输入和最近记忆给所选 provider；本机 Ollama 路径仅在相应模式下应本地化，不能笼统说数据永远留本地。可选“看屏幕”属于高隐私能力，配置/抓取与出站的实际端到端链本轮未验，不应仅凭 README 承诺。先在隔离 profile 明确选择 display/web、模型模式和屏幕开关，观察网络/权限/CPU-GPU/磁盘，再决定采用；建议把首次 Electron 下载和在线发送范围明确前置提示。

父侧已补读实际发布版屏幕链，具体开关、出站与保留边界见[Q04](#research-q04)至[Q06](#research-q06)，不再仅以“未实测”留空。

#### 证据与依据

**依据 1 · 作者声明**：[src/README.zh-CN.md:8-45](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/README.zh-CN.md#L8-L45)

作者说明 68MB 安装、动画、聊天与可选看屏幕。

<details>
<summary>查看原文（38行）</summary>

````text

## 安装

```bash
dsh plugin --profile web add github:12we21/cute-fat-fish-pet#path:/src
```

不需要构建：`lib/` 里已经是编好的宿主与客户端产物。

> **注意：这条命令会拉整个仓库的 tarball，约 68 MB。** 106 个动画占了绝大部分。慢网下可能
> 超时，超时就先克隆再用本地路径装：

```bash
git clone --depth 1 https://github.com/12we21/cute-fat-fish-pet
dsh plugin --profile web add ./cute-fat-fish-pet/src
```

## 你会得到什么

- **106 个手绘动画** —— 带真实 alpha 通道的 VP9-alpha `webm`，叠在你的壁纸上。待机呼吸、
  打瞌睡又被惊醒、跳舞、撸猫、吃东西、过节，点一下就有对应的反应。
- **桌面漫步** —— 她自己走来走去，也会看鼠标：拖她、点她，她都会有反应。
- **聊天** —— 在 DSH 网页界面里跟她说话。可以指向本机 **Ollama** 模型，也可以走你当前
  DSH 会话已经在用的在线模型；有一个全局开关切「只用本地 / 只用 DSH / 本地优先」。
- **碎碎念** —— 她能冒一句由你当前会话模型生成的一句话。
- **可选看屏幕** —— 配合内置的原生抓屏组件，她可以看看你屏幕上是什么并吐槽。不开就是不开。

## 这一半**没有**什么

插件是独立版的子集。下面这些只在独立 Windows 版里，插件里没有：

- 离线语音识别（sherpa-onnx + SenseVoice）
- Edge TTS 朗读
- 单页控制台

## 数据放在哪

聊天记忆和你的配置覆盖都在 `$DSH_HOME/dsh-pet/` 下。除非你把聊天指向在线模型，否则没有
````

</details>

**依据 2 · 源码核查**：[src/package.json:53-100](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/package.json#L53-L100)

资源目录、Electron 获取依赖和宿主 peer。

<details>
<summary>查看原文（48行）</summary>

```text
  },
  "files": [
    "lib",
    "src",
    "assets/webm",
    "runtime/electron-helper",
    "assets/fonts",
    "assets/pic",
    "assets/memes",
    "assets/config.jsonc",
    "scripts/ensure-electron.mjs",
    "cordis.patch.yml"
  ],
  "scripts": {
    "ensure:electron": "node scripts/ensure-electron.mjs",
    "test": "node --test \"src/**/*.test.ts\""
  },
  "license": "MIT",
  "author": "Mikolu",
  "dependencies": {
    "@electron-internal/extract-zip": "^1.0.5",
    "@electron/get": "^5.1.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
  },
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.0-rc.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
```

</details>

**依据 3 · 源码核查**：[src/src/host/chat.ts:87-115](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/chat.ts#L87-L115)

记忆和用户输入进入模型消息。

<details>
<summary>查看原文（29行）</summary>

```text
          content: [{ type: 'text', text: m.content }],
          source: { kind: 'user' },
        })
      : createAssistantMessage({
          content: [{ type: 'text', text: m.content }],
          source: { provider: sel.provider, model: sel.model },
        }),
  );

  const deadline = AbortSignal.timeout(TIMEOUT_MS);
  // 仅当模型声明支持 reasoning effort（含 "off"）时才传，否则省略：
  // 无 reasoning 元数据的模型（如 reasoningEfforts: false）显式传 off 会被
  // dsh-llm 判为 UNSUPPORTED_REASONING_EFFORT 并折叠成空流（表现为"模型未返回文本"）。
  const supportsOff = await supportsReasoningOff(ctx, sel.provider, sel.model);
  // 配图：池非空才把清单与指令附进 user 正文（空池 = 关闭配图，正文与旧行为逐字一致）
  const wantImage = pool.length > 0;
  const options = {
    provider: sel.provider,
    model: sel.model,
    messages: [
      ...historyMessages,
      createUserMessage({
        content: [{ type: 'text', text: wantImage ? userText + imageInstruction(pool) : userText }],
        source: { kind: 'user' },
      }),
    ],
    system,
    // 不显式限 maxTokens：与碎碎念同因——推理模型把思考计入预算，显式小上限会截断正文；
    // 不传由 dsh-llm 按适配器 defaultMaxTokens 兜底，对话短回复输出仍短。
```

</details>

**依据 4 · 源码核查**：[src/src/host/helper-process.ts:176-249](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/helper-process.ts#L176-L249)

Electron 下载来源和落地路径。

<details>
<summary>查看原文（74行）</summary>

```text
 */
export async function ensureElectronDownload(options: EnsureElectronOptions = {}): Promise<string | undefined> {
  const version = options.version || process.env.DSH_PET_ELECTRON_VERSION || '43.3.0';
  const mirror = options.mirror || process.env.DSH_PET_ELECTRON_MIRROR || 'https://npmmirror.com/mirrors/electron/';
  const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
  const targetDir = electronLandingDir();
  const exe = defaultElectronExe();
  if (existsSync(exe)) return exe;

  // 下载日志用 console 直出（ctx.logger 在部分宿主不映射到终端，排障时看不到）。
  const log = (message: string): void => console.log(`[dsh-pet] ${message}`);
  const warn = (message: string): void => console.warn(`[dsh-pet] ${message}`);
  const startedAt = Date.now();

  log(`Electron not found, downloading v${version} (${PLAT}-${process.arch}) ...`);
  mkdirSync(targetDir, { recursive: true });

  try {
    // 官方 @electron/get 下载：负责 URL 拼装、镜像、SHA256 校验（sumchecker）、下载缓存
    // （同一版本只下载一次，之后命中缓存秒回）。超时用 AbortController 传给 fetch。
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(new Error(`Electron download timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );
    timer.unref?.();
    let nextLogAt = Date.now() + 3000;
    try {
      const zipPath = await downloadArtifact({
        version: `v${version}`,
        artifactName: 'electron',
        // platform/arch 不传：@electron/get 用宿主平台与架构自动推断
        // （getHostArch 还处理 arm → armv7l 特例，比显式传 process.arch 更准）
        mirrorOptions: { mirror: mirror.replace(/\/$/, '') + '/' },
        downloadOptions: {
          signal: controller.signal,
          quiet: true, // 关掉 @electron/get 自己的进度条（stdout 走宿主日志，不进 bridge 协议）
          getProgressCallback: async (progress: { transferred: number; total: number | null }) => {
            const now = Date.now();
            if (!progress.total || now < nextLogAt) return;
            nextLogAt = now + 3000;
            log(
              `downloading ${(progress.transferred / 1024 / 1024).toFixed(1)}MB / ${(progress.total / 1024 / 1024).toFixed(1)}MB`,
            );
          },
        },
      });
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      log(`download complete (${seconds}s), extracting to ${targetDir} ...`);
      // 官方 @electron-internal/extract-zip 解压（electron 43 官方安装同款）：
      // 纯 Node + native binding，跨平台一致，正确处理 symlink 与文件权限，
      // 不需要系统 unzip/tar/powershell，也没有我们手写的平台适配链。
      await extract(zipPath, { dir: targetDir });
      if (!existsSync(exe)) {
        throw new Error(`Electron zip extracted, but ${ELECTRON_REL} not found`);
      }
      const readySeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      log(`ready in ${readySeconds}s: ${exe}`);
      return exe;
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    warn(`ensure failed: ${error instanceof Error ? error.message : String(error)}`);
    warn('desktop pet unavailable. Set DSH_PET_ELECTRON_PATH to an existing Electron, or retry later.');
    return undefined;
  }
}

export function defaultLaunch(options: HelperOptions = {}): { command: string; args: string[] } {
  const electronPath = resolveElectronPath([options.electronPath]);
  if (!electronPath) {
    throw new Error('dsh-pet: cannot resolve Electron executable. Set DSH_PET_ELECTRON_PATH or install electron.');
  }
```

</details>

#### 缺口

- 未执行屏幕抓取、数据出站或高负载动画测试。
  **影响：**隐私和资源成本难以定量，推荐限隔离试用。
  **进一步探讨：**在不同开关组合做网络日志/权限、缓存、帧率和内存监测。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 发布入口是否等同TS，看屏幕链实际上在哪里？

**研究主题：**功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

src/package.json的main/default export是lib/index.js，发布包显式包含lib和src。固定发布lib有独立local patch 3看屏幕闭包、定时器、聊天控制词和模型附件调用；src/src/host/index.ts的现有宿主路由实现没有该段（搜索swRun/screen-watch未命中），因此只审TS不足以描述当前发布插件。README明确插件子集也含可选看屏幕，不应因TS没有就判承诺未闭合。

发布lib默认running=false、brain=dsh、trigger=manual，5秒timer按intervalSec默认12秒节流。非force先判断running才抓屏；用户说“点评一下”等会force单次，即使自动监测关闭也可抓屏，这是主动单次语义。说“看着点”等写running=true，停止词写false。开关不是宿主独立权限弹窗，而是聊天文字控制；写配置失败被吞，控制回复先返回，不能以气泡文字保证状态已经落盘。

#### 证据与依据

**依据 1 · 源码核查**：[src/package.json:45-67](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/package.json#L45-L67)

发布入口/文件。

<details>
<summary>查看原文（23行）</summary>

```text
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets/webm",
    "runtime/electron-helper",
    "assets/fonts",
    "assets/pic",
    "assets/memes",
    "assets/config.jsonc",
    "scripts/ensure-electron.mjs",
    "cordis.patch.yml"
  ],
  "scripts": {
    "ensure:electron": "node scripts/ensure-electron.mjs",
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:1966-2027](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L1966-L2027)

发布专属默认状态与写盘。

<details>
<summary>查看原文（62行）</summary>

```text
	const SW_DIR = join(userRoot, "screen-watch");
	const SW_STATE = join(SW_DIR, "state.json");
	const SW_PS1 = join(SW_DIR, "capture.ps1");
	// [local patch 5] 抓屏提速：优先用同目录下的原生 SwCapture.exe（单次 90~180ms），
	// 缺了它才退回 PowerShell 版 capture.ps1（单次 900~1140ms——纯 powershell.exe 冷启动就要 349ms，
	// 这正是"开着监测就卡"的固定开销大头）。两个实现产出同样的 512 位十六进制签名。
	const SW_EXE = join(SW_DIR, "SwCapture.exe");
	const SW_SHOT = join(SW_DIR, "shot.jpg");
	const SW_SID = "screen-watch";
	const SW_PWSH = (process.env.SystemRoot || "C:/Windows") + "/System32/WindowsPowerShell/v1.0/powershell.exe";
	const SW_PS1_TEXT = Buffer.from("IyBkc2gtcGV0IHNjcmVlbiB3YXRjaDogY2FwdHVyZSBvbmUgZnJhbWUgKyBwcmludCBhIDE2eDE2IGdyYXlzY2FsZSBzaWduYXR1cmUgKDUxMiBoZXggY2hhcnMpLgojCiMgVXNhZ2U6IHBvd2Vyc2hlbGwuZXhlIC1Ob1Byb2ZpbGUgLU5vbkludGVyYWN0aXZlIC1FeGVjdXRpb25Qb2xpY3kgQnlwYXNzIC1GaWxlIGNhcHR1cmUucHMxCiMgICBUaGUgb3V0cHV0IEpQRUcgcGF0aCBjb21lcyBmcm9tIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBEU0hfUEVUX1NIT1QuCiMgICBzdGRvdXQgPSA1MTIgaGV4IGNoYXJzICgyNTYgYnl0ZXMgb2YgZ3JheXNjYWxlIHNhbXBsZXMpLCB1c2VkIGZvciBjaGVhcCBjaGFuZ2UgZGV0ZWN0aW9uLgojICAgT24gZmFpbHVyZTogbm90aGluZyBvbiBzdGRvdXQgYW5kIGEgbm9uLXplcm8gZXhpdC4KIwojIERlbGliZXJhdGUgY2hvaWNlcyAoYm90aCB3ZXJlIHJlYWwgYnVncyBmb3VuZCB0aGUgaGFyZCB3YXkpOgojICAgMS4gQVNDSUktb25seSBjb21tZW50cy4gV2luZG93cyBQb3dlclNoZWxsIDUuMSByZWFkcyBhIEJPTS1sZXNzIGZpbGUgYXMgQU5TSTsgbm9uLUFTQ0lJCiMgICAgICBjb21tZW50IGJ5dGVzIGdvdCBtaXMtZGVjb2RlZCBhbmQgc3dhbGxvd2VkIHRoZSBuZXh0IGNvZGUgbGluZS4KIyAgIDIuIE5vIHBhcmFtKCkgYmxvY2suIFBvd2VyU2hlbGwgdmFyaWFibGUgbmFtZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmUgKCRPdXQgdnMgJG91dCBjbG9iYmVyZWQKIyAgICAgIGVhY2ggb3RoZXIpLCBhbmQgYW4gYWR2YW5jZWQtZnVuY3Rpb24gcGFyYW1ldGVyIHdpdGhvdXQgUG9zaXRpb24gYmluZHMgb25seSBieSBuYW1lLgojICAgICAgUmVhZGluZyBhbiBlbnYgdmFyIGF2b2lkcyBwYXJhbWV0ZXIgYmluZGluZyBlbnRpcmVseS4KCiRUYXJnZXRQYXRoID0gJGVudjpEU0hfUEVUX1NIT1QKaWYgKC1ub3QgJFRhcmdldFBhdGgpIHsKICAgIFtDb25zb2xlXTo6RXJyb3IuV3JpdGVMaW5lKCdkc2gtcGV0IGNhcHR1cmU6IERTSF9QRVRfU0hPVCBpcyBub3Qgc2V0JykKICAgIGV4aXQgMgp9Cgp0cnkgewogICAgQWRkLVR5cGUgLUFzc2VtYmx5TmFtZSBTeXN0ZW0uRHJhd2luZwogICAgQWRkLVR5cGUgLUFzc2VtYmx5TmFtZSBTeXN0ZW0uV2luZG93cy5Gb3JtcwoKICAgICR2cyA9IFtTeXN0ZW0uV2luZG93cy5Gb3Jtcy5TeXN0ZW1JbmZvcm1hdGlvbl06OlZpcnR1YWxTY3JlZW4KICAgIGlmICgkdnMuV2lkdGggLWxlIDAgLW9yICR2cy5IZWlnaHQgLWxlIDApIHsgZXhpdCAxIH0KCiAgICAkZnVsbCA9IE5ldy1PYmplY3QgU3lzdGVtLkRyYXdpbmcuQml0bWFwKCR2cy5XaWR0aCwgJHZzLkhlaWdodCkKICAgICRnZnggPSBbU3lzdGVtLkRyYXdpbmcuR3JhcGhpY3NdOjpGcm9tSW1hZ2UoJGZ1bGwpCiAgICAkZ2Z4LkNvcHlGcm9tU2NyZWVuKCR2cy5YLCAkdnMuWSwgMCwgMCwgJGZ1bGwuU2l6ZSkKICAgICRnZnguRGlzcG9zZSgpCgogICAgIyAxNngxNiBncmF5c2NhbGUgc2lnbmF0dXJlIChsb2NhbCBjaGFuZ2UgZGV0ZWN0aW9uIG9ubHk7IG5ldmVyIHNlbnQgdG8gYSBtb2RlbCkKICAgICRzaWcgPSBOZXctT2JqZWN0IFN5c3RlbS5EcmF3aW5nLkJpdG1hcCgxNiwgMTYpCiAgICAkc2lnR2Z4ID0gW1N5c3RlbS5EcmF3aW5nLkdyYXBoaWNzXTo6RnJvbUltYWdlKCRzaWcpCiAgICAkc2lnR2Z4LkludGVycG9sYXRpb25Nb2RlID0gW1N5c3RlbS5EcmF3aW5nLkRyYXdpbmcyRC5JbnRlcnBvbGF0aW9uTW9kZV06OkhpZ2hRdWFsaXR5QmljdWJpYwogICAgJHNpZ0dmeC5EcmF3SW1hZ2UoJGZ1bGwsIDAsIDAsIDE2LCAxNikKICAgICRzaWdHZnguRGlzcG9zZSgpCiAgICAkc2IgPSBOZXctT2JqZWN0IFN5c3RlbS5UZXh0LlN0cmluZ0J1aWxkZXIKICAgIGZvciAoJHkgPSAwOyAkeSAtbHQgMTY7ICR5KyspIHsKICAgICAgICBmb3IgKCR4ID0gMDsgJHggLWx0IDE2OyAkeCsrKSB7CiAgICAgICAgICAgICRjID0gJHNpZy5HZXRQaXhlbCgkeCwgJHkpCiAgICAgICAgICAgICRsdW0gPSBbaW50XSgwLjI5OSAqICRjLlIgKyAwLjU4NyAqICRjLkcgKyAwLjExNCAqICRjLkIpCiAgICAgICAgICAgIFt2b2lkXSRzYi5BcHBlbmQoJGx1bS5Ub1N0cmluZygneDInKSkKICAgICAgICB9CiAgICB9CiAgICAkc2lnLkRpc3Bvc2UoKQoKICAgICMgVGhlIGZyYW1lIHRoYXQgZ29lcyB0byB0aGUgbW9kZWw6IHdpZHRoLWNhcHBlZCBKUEVHIChzbWFsbCBieXRlcywgbG93IHRva2VuIGNvc3QpCiAgICAkbWF4VyA9IDEyODAKICAgICRzY2FsZSA9IFtNYXRoXTo6TWluKDEuMCwgJG1heFcgLyAkZnVsbC5XaWR0aCkKICAgICRvdyA9IFtpbnRdKCRmdWxsLldpZHRoICogJHNjYWxlKTsgaWYgKCRvdyAtbHQgMSkgeyAkb3cgPSAxIH0KICAgICRvaCA9IFtpbnRdKCRmdWxsLkhlaWdodCAqICRzY2FsZSk7IGlmICgkb2ggLWx0IDEpIHsgJG9oID0gMSB9CiAgICAkc2NhbGVkID0gTmV3LU9iamVjdCBTeXN0ZW0uRHJhd2luZy5CaXRtYXAoJG93LCAkb2gpCiAgICAkc2NhbGVHZnggPSBbU3lzdGVtLkRyYXdpbmcuR3JhcGhpY3NdOjpGcm9tSW1hZ2UoJHNjYWxlZCkKICAgICRzY2FsZUdmeC5JbnRlcnBvbGF0aW9uTW9kZSA9IFtTeXN0ZW0uRHJhd2luZy5EcmF3aW5nMkQuSW50ZXJwb2xhdGlvbk1vZGVdOjpIaWdoUXVhbGl0eUJpY3ViaWMKICAgICRzY2FsZUdmeC5EcmF3SW1hZ2UoJGZ1bGwsIDAsIDAsICRvdywgJG9oKQogICAgJHNjYWxlR2Z4LkRpc3Bvc2UoKQogICAgJGZ1bGwuRGlzcG9zZSgpCgogICAgJHN0cmVhbSA9IFtTeXN0ZW0uSU8uRmlsZV06OkNyZWF0ZSgkVGFyZ2V0UGF0aCkKICAgIHRyeSB7CiAgICAgICAgJHNjYWxlZC5TYXZlKCRzdHJlYW0sIFtTeXN0ZW0uRHJhd2luZy5JbWFnaW5nLkltYWdlRm9ybWF0XTo6SnBlZykKICAgIH0KICAgIGZpbmFsbHkgewogICAgICAgICRzdHJlYW0uRGlzcG9zZSgpCiAgICB9CiAgICAkc2NhbGVkLkRpc3Bvc2UoKQoKICAgIFdyaXRlLU91dHB1dCAkc2IuVG9TdHJpbmcoKQogICAgZXhpdCAwCn0KY2F0Y2ggewogICAgW0NvbnNvbGVdOjpFcnJvci5Xcml0ZUxpbmUoJ2RzaC1wZXQgY2FwdHVyZTogJyArICRfLkV4Y2VwdGlvbi5NZXNzYWdlKQogICAgZXhpdCAxCn0K", "base64").toString("utf8");
	const SW_DEFAULT = {
		brain: "dsh",
		trigger: "manual",
		verbosity: "auto",
		running: false,
		intervalSec: 12,
		minGapSec: 20,
		changeThreshold: 10,
		maxCallsPerHour: 60,
		localProvider: "ollama",
		localModel: "",
		localApi: "http://127.0.0.1:11434"
	};
	const SW_RT = {
		sig: null,
		seq: 0,
		lastCall: 0,
		lastTick: 0,
		once: false,
		calls: [],
		busy: false,
		lastResult: null
	};
	const swCfg = () => {
		try {
			return Object.assign({}, SW_DEFAULT, JSON.parse(readFileSync(SW_STATE, "utf8")));
		} catch (e) {
			return Object.assign({}, SW_DEFAULT);
		}
	};
	// [local patch 4] 把监测配置的读取口子交给模块级生成函数：全局大脑与屏幕监测读同一份 state.json
	PET_BRAIN_READ = () => swCfg();
	const swSave = async (patch) => {
		const next = Object.assign({}, swCfg(), patch);
		try {
			mkdirSync(SW_DIR, { recursive: true });
			await writeFile(SW_STATE, JSON.stringify(next, null, 2), "utf8");
		} catch (e) {
			void e;
		}
		return next;
	};
	const swEnsurePs1 = async () => {
		try {
			mkdirSync(SW_DIR, { recursive: true });
			if (!existsSync(SW_PS1) || readFileSync(SW_PS1, "utf8") !== SW_PS1_TEXT) await writeFile(SW_PS1, SW_PS1_TEXT, "utf8");
			return true;
		} catch (e) {
			return false;
		}
	};
```

</details>

**依据 3 · 源码核查**：[src/lib/index.js:2225-2267](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2225-L2267)

开关先于capture，force例外。

<details>
<summary>查看原文（43行）</summary>

```text
	const swRun = async (opts) => {
		const force = Boolean(opts && opts.force);
		const cfg = swCfg();
		if (SW_RT.busy) return { ok: false, reason: "busy" };
		// 关着又不是手动强制 → 连屏都不抓。抓屏必须发生在开关判断之后：
		// 否则"关着"的时候每 5 秒还是会拍一张存到本地（用户以为关了却还在拍，不可接受）。
		if (!force && !cfg.running) return { ok: false, reason: "not-running" };
		SW_RT.busy = true;
		try {
			if (!(await swEnsurePs1())) return await swRecord({ ok: false, reason: "no-script" });
			const sig = await swCapture();
			if (!sig) return await swRecord({ ok: false, reason: "capture-failed" });
			const mad = swMad(SW_RT.sig, sig);
			SW_RT.sig = sig;
			const changed = mad >= (Number(cfg.changeThreshold) || 10);
			if (!force && !changed) return { ok: true, spoke: false, reason: "no-change", mad };
			if (!force && cfg.verbosity === "manual") return { ok: true, spoke: false, reason: "manual-mode", mad };
			const now = Date.now();
			if (!force && now - SW_RT.lastCall < Math.max(5, Number(cfg.minGapSec) || 20) * 1000) return { ok: true, spoke: false, reason: "throttled", mad };
			if (!swBudget(now, cfg)) return await swRecord({ ok: false, reason: "budget" });
			SW_RT.lastCall = now;
			SW_RT.calls.push(now);
			// [local patch 5] 到这里才真的需要那帧图：原生抓屏分两步，签名不落盘，JPEG 现拍现用。
			// [发布版补丁 V5] 抓屏之前先确认「这条路的模型看得懂图」：没有就直说，
			//  省下一次 SwCapture，也免得多花一次视觉额度。
			if (cfg.brain === "dsh" && !(await swSelection(cfg))) {
				const why = "还没配看屏幕的模型：去控制台「联网模型」里填「视觉模型」（比如 deepseek-flash），或者把大脑切成「本地模型」。";
				swSpeak("waiting", why);
				return await swRecord({ ok: false, reason: "no-vision-model", message: why });
			}
			if (!(await swShot())) return await swRecord({ ok: false, reason: "capture-failed" });
			const verdict = await swJudge(cfg, force);
			if (verdict.error) return await swRecord({ ok: false, reason: "judge-failed", message: verdict.error });
			const speak = force || cfg.verbosity === "chatty" ? verdict.say.length > 0 : verdict.react === true && verdict.say.length > 0;
			if (!speak) return await swRecord({ ok: true, spoke: false, reason: "nothing-notable", mad, react: verdict.react, say: verdict.say });
			const how = swSpeak(verdict.emotion, verdict.say);
			return await swRecord({ ok: true, spoke: true, emotion: verdict.emotion, say: verdict.say, how, mad });
		} finally {
			SW_RT.busy = false;
		}
	};
	/* [互动@2] 联网模型的实际配置（独立模式下是 <app>/../standalone/online.json）。
	 *  只用来**如实报名字**，读不到就当没配。 */
```

</details>

**依据 4 · 源码核查**：[src/lib/index.js:2310-2367](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2310-L2367)

文字控制与timer。

<details>
<summary>查看原文（58行）</summary>

```text
		const t = String(raw || "").trim();
		if (!t) return null;
		/* [互动@2] 先认「问句 + 档位词」，由代码如实回答（放在长度闸门和「换本地 / 换在线」
		 *  之前：以前「你现在是本地模型吗」会被当成切换命令，直接把人家的档位改掉）。 */
		if (t.length <= 60 && /还是|吗|呢|是不是|什么|哪个|哪一|？|\?/.test(t) && /在线|离线|联网|本机|本地|自动择优|模型|大脑|上网|网上/.test(t) && !/^(换|用|切|改|开始|停止|别|帮|给|把|让)/.test(t)) return swModeText();
		if (t.length > 24) return null;
		const has = (list) => list.some((k) => t.indexOf(k) >= 0);
		if (has(["监测状态", "什么模式", "当前模式", "监测模式"])) return swStatusText();
		if (has(["别看了", "停下", "关闭监测", "停止监测", "别盯着"])) {
			void swSave({ running: false });
			return "好，我不看了～";
		}
		if (has(["看着点", "开始监测", "盯着", "开始看", "帮我看着", "看着我玩"])) {
			void swSave({ running: true, trigger: "watch" });
			return "好嘞，我盯着啦，有高光我就喊你～";
		}
		if (has(["点评一下", "看看现在", "现在什么情况", "帮我看一下"])) {
			void swRun({ force: true }).then((r) => {
				if (r && !r.ok) void swSpeak("thinking", "呜……我现在看不了屏幕（" + String(r.reason) + "）");
			});
			return "让我看看屏幕…马上给你点评～";
		}
		if (has(["换本地", "用本地", "本地模型"])) {
			void swSave({ brain: "local" });
			return "好，改用本地模型看（它没起服务的话我会告诉你）～";
		}
		if (has(["自动择优", "自动选", "自动模式", "自己选"])) {
			void swSave({ brain: "auto" });
			return "好，本地能看就用本地，不行我自己换在线～";
		}
		if (has(["换在线", "用在线", "换回默认", "用默认模型"])) {
			void swSave({ brain: "dsh" });
			return "好，换回默认模型～";
		}
		if (has(["碎碎念模式", "多说点", "话多一点"])) {
			void swSave({ verbosity: "chatty" });
			return "那我话就多一点咯～";
		}
		if (has(["只说高光", "只说重点", "少说点"])) {
			void swSave({ verbosity: "auto" });
			return "好，我只在关键时候出声～";
		}
		if (has(["只听我的", "别自动说", "安静模式"])) {
			void swSave({ verbosity: "manual" });
			return "好，你不叫我我就不说话～";
		}
		return null;
	};
	ctx.effect(() => {
		const id = setInterval(() => {
			const cfg = swCfg();
			const now = Date.now();
			if (now - SW_RT.lastTick < Math.max(5, Number(cfg.intervalSec) || 12) * 1000) return;
			SW_RT.lastTick = now;
			void swRun().catch(() => {});
		}, 5000);
		return () => clearInterval(id);
	}, "dsh-pet: screen watch (local patch 3)");
```

</details>

**依据 5 · 源码核查**：[src/src/host/index.ts:635-645](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/src/host/index.ts#L635-L645)

TS直接进入业务路由无同段闭包。

<details>
<summary>查看原文（11行）</summary>

```text
  const handlePetRoute = async (rawUrl: string, method: string, body?: string): Promise<RouteResult> => {
    const url = new URL(rawUrl, 'http://localhost');
    const rest = decodeURIComponent(url.pathname.slice(ROUTE_PREFIX.length + 1));

    // 成品配置：/dsh-pet-7340/config（GET 读取合并成品 / PUT 保存用户层 / DELETE 恢复默认）
    if (rest === 'config') {
      if (method === 'GET') {
        // 唯一配置入口：readAllConfig 返回绝对正确的完成品聚合（{ main:{...}, test1:{...} }），
        // 浏览器/桌面/设置页直接消费，无需任何校验/兜底
        try {
          return { kind: 'json', status: 200, obj: readAllConfig(configPaths) };
```

</details>

**依据 6 · 源码核查**：[README.md:125-125](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/README.md#L125-L125)

插件子集承诺。

```text
This half of the project is a **subset** of the standalone build: all 106 animations, wandering, click reactions, chat through local **Ollama** or the DSH online models, and optional screen watching are in it. The offline speech recognition, the Edge TTS voice and the console window are **not** — those come with the installer and the zip above.
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 屏幕送往哪里，关掉监测和卸载清理的边界是什么？

**研究主题：**缺陷与关键质疑、效果与总成本、新假设与验证

#### 完整回答

抓屏路径是userRoot/screen-watch，原生SwCapture.exe存在则先--sig、真需推理再--shot；否则写内嵌PowerShell并CopyFromScreen抓整个VirtualScreen，缩到宽1280的JPEG存shot.jpg，签名阶段就已落盘。平均亮度差/minGap/每小时默认60次预算能减少推理，但不能称“不说话就不截图”。manual表达模式在抓签名之后返回，PowerShell分支此时仍留图。

swJudge把shot.jpg读入attachments.saveImages，再向ctx.llm.stream传image附件。local/auto通过localApi/api/tags确认名称基部存在，实际选择provider/localModel仍走宿主llm，不能仅凭local标签承诺绝不外发；auto本地不可用会落到宿主默认选择。dsh若ctx提供onlineVisionReady则要求ready并选online，否则取agentDefaultModel.currentSelection，未见这里检查该默认模型视觉能力。因此“没配视觉模型不启用”是特定适配器条件下的保护，不能覆盖所有宿主路径。

关闭running可阻止新的非force轮；已开始swRun没有运行中取消信号，90秒LLM timeout独立，不会因后来关开关或dispose立刻撤销。截图spawn未设超时/持有句柄用于清理，busy可被挂住；dispose清timer和helper不等同撤销在途截图/LLM。当前未见shot.jpg和保存的附件在该链被删除，state还存lastResult，保留期由用户/宿主存储决定。建议只对已确认数据目的地启用，关监测后也核在途和残留。进一步研究带授权来源/数据目的地/取消与保留期的观察会话，对比关闭中途、无视觉默认模型、local provider映射错误、capture卡死等反例，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.js:2036-2083](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2036-L2083)

capture/shot无超时。

<details>
<summary>查看原文（48行）</summary>

```text
	const swCapture = () => new Promise((done) => {
		try {
			const native = swHasExe();
			const child = spawn(native ? SW_EXE : SW_PWSH, native ? ["--sig"] : ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", SW_PS1], {
				windowsHide: true,
				env: Object.assign({}, process.env, { DSH_PET_SHOT: SW_SHOT })
			});
			let out = "";
			child.stdout.on("data", (d) => { out += String(d); });
			child.stderr.on("data", () => {});
			child.on("error", () => done(null));
			child.on("close", (code) => {
				const hex = String(out).trim().split(/\s+/).pop() || "";
				done(code === 0 && /^[0-9a-f]{512}$/.test(hex) ? hex : null);
			});
		} catch (e) {
			done(null);
		}
	});
	/**
	 * 只在真要送模型时才把当前帧落盘成 JPEG。
	 * PowerShell 版是"抓签名那一趟顺手写盘"；原生版拆成两趟：签名（约 90ms，每 intervalSec 一次）
	 * 不落盘，只有判定"画面真的变了"才再跑一次 --shot（约 180ms）写 shot.jpg。
	 * 拿不到 JPEG 就当作抓屏失败，绝不让模型看上一帧的旧图。
	 */
	const swShot = async () => {
		if (!swHasExe()) return true; // PowerShell 版在 --sig 那一趟已经写过 shot.jpg
		try {
			const ok = await new Promise((done) => {
				try {
					const child = spawn(SW_EXE, ["--shot"], {
						windowsHide: true,
						env: Object.assign({}, process.env, { DSH_PET_SHOT: SW_SHOT })
					});
					child.stdout.on("data", () => {});
					child.stderr.on("data", () => {});
					child.on("error", () => done(false));
					child.on("close", (code) => done(code === 0));
				} catch (e) {
					done(false);
				}
			});
			return ok && existsSync(SW_SHOT);
		} catch (e) {
			return false;
		}
	};
	/** 平均绝对亮度差（0~255）。用均值而不是"差异字节个数"：她自己那扇窗一直在动，
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2100-2168](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2100-L2168)

选择和附件模型路径。

<details>
<summary>查看原文（69行）</summary>

```text
	const swOllamaUp = async (cfg) => {
		try {
			const want = String(cfg.localModel || "").split(":")[0];
			if (!want) return false;
			const res = await fetch(String(cfg.localApi || "http://127.0.0.1:11434") + "/api/tags", { signal: AbortSignal.timeout(2500) });
			if (!res.ok) return false;
			const j = await res.json();
			const list = Array.isArray(j && j.models) ? j.models : [];
			return list.some((m) => String(m && m.name || "").split(":")[0] === want);
		} catch (e) {
			return false;
		}
	};
	const swSelection = async (cfg) => {
		try {
			if (cfg.brain === "local" || cfg.brain === "auto") {
				const model = String(cfg.localModel || "");
				if (model && await swOllamaUp(cfg)) return { provider: String(cfg.localProvider || "ollama"), model };
				if (cfg.brain === "local") return null;
			}
			// [发布版补丁 V4] 在线档：只有视觉（看图那个模型）真的配齐了才走在线；
			//  没配就返回 null，让 swRun 明说「还没配」，绝不把 JPEG 塞给纯文本模型瞎编。
			//  ctx 里没有这个能力（真跑在 DSH 插件里）⇒ 保持原样走下面那条老路。
			if (cfg.brain === "dsh") {
				const ready = typeof ctx.get === "function" ? ctx.get("onlineVisionReady") : void 0;
				if (typeof ready === "function") {
					if (!ready()) return null;
					return { provider: "online", model: "" }; // 具体模型名由 online.mjs 的视觉目标决定
				}
			}
			const s = ctx.agentDefaultModel.currentSelection();
			return s && s.provider && s.model ? { provider: s.provider, model: s.model } : null;
		} catch (e) {
			return null;
		}
	};
	const SW_SYSTEM = "你是主人桌面上形影不离的 Q 版蓝发小女仆，此刻正看着主人的屏幕。你说话自然、短短一句、带点俏皮；不说教、不解释自己、不提 AI。";
	const swJudge = async (cfg, force) => {
		const llm = ctx.llm;
		const att = typeof ctx.get === "function" ? ctx.get("attachments") : void 0;
		const sel = await swSelection(cfg);
		if (!llm || typeof llm.stream !== "function" || !att || !sel) return { error: cfg.brain === "local" ? "本地模型不可用：Ollama 没在跑，或还没拉下 " + String(cfg.localModel || "(未配置 localModel)") : "模型或附件服务不可用" };
		let ref;
		try {
			const saved = await att.saveImages([{ data: new Uint8Array(readFileSync(SW_SHOT)), mediaType: "image/jpeg", name: "screen.jpg" }]);
			ref = saved && saved[0];
		} catch (e) {
			return { error: "截图入附件失败：" + (e instanceof Error ? e.message : String(e)) };
		}
		if (!ref) return { error: "截图入附件失败" };
		const ask = force ? "主人让你现在点评一下屏幕上的情况。" : "这是主人此刻的屏幕。判断有没有值得点评的高光时刻、失误，或者卡住受挫。";
		const prompt = ask + '只回一行 JSON：{"react":true|false,"emotion":"success|error|thinking|waiting|result|working","say":"不超过40字的中文点评"}。没什么可说的就 react=false、say 留空。';
		const assembler = new BlockAssembler();
		try {
			for await (const chunk of llm.stream({
				provider: sel.provider,
				model: sel.model,
				messages: [createUserMessage({
					content: [{ type: "image", attachment: ref }, { type: "text", text: prompt }],
					source: { kind: "user" }
				})],
				system: SW_SYSTEM,
				temperature: 1,
				signal: AbortSignal.timeout(90000)
			})) assembler.push(chunk);
		} catch (e) {
			return { error: e instanceof Error ? e.message : String(e) };
		}
		const text = assembler.blocks().filter((b) => b.type === "text").map((b) => b && typeof b.text === "string" ? b.text : "").join("").trim();
```

</details>

**依据 3 · 源码核查**：[src/lib/index.js:2225-2267](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2225-L2267)

调用时序与预算。

<details>
<summary>查看原文（43行）</summary>

```text
	const swRun = async (opts) => {
		const force = Boolean(opts && opts.force);
		const cfg = swCfg();
		if (SW_RT.busy) return { ok: false, reason: "busy" };
		// 关着又不是手动强制 → 连屏都不抓。抓屏必须发生在开关判断之后：
		// 否则"关着"的时候每 5 秒还是会拍一张存到本地（用户以为关了却还在拍，不可接受）。
		if (!force && !cfg.running) return { ok: false, reason: "not-running" };
		SW_RT.busy = true;
		try {
			if (!(await swEnsurePs1())) return await swRecord({ ok: false, reason: "no-script" });
			const sig = await swCapture();
			if (!sig) return await swRecord({ ok: false, reason: "capture-failed" });
			const mad = swMad(SW_RT.sig, sig);
			SW_RT.sig = sig;
			const changed = mad >= (Number(cfg.changeThreshold) || 10);
			if (!force && !changed) return { ok: true, spoke: false, reason: "no-change", mad };
			if (!force && cfg.verbosity === "manual") return { ok: true, spoke: false, reason: "manual-mode", mad };
			const now = Date.now();
			if (!force && now - SW_RT.lastCall < Math.max(5, Number(cfg.minGapSec) || 20) * 1000) return { ok: true, spoke: false, reason: "throttled", mad };
			if (!swBudget(now, cfg)) return await swRecord({ ok: false, reason: "budget" });
			SW_RT.lastCall = now;
			SW_RT.calls.push(now);
			// [local patch 5] 到这里才真的需要那帧图：原生抓屏分两步，签名不落盘，JPEG 现拍现用。
			// [发布版补丁 V5] 抓屏之前先确认「这条路的模型看得懂图」：没有就直说，
			//  省下一次 SwCapture，也免得多花一次视觉额度。
			if (cfg.brain === "dsh" && !(await swSelection(cfg))) {
				const why = "还没配看屏幕的模型：去控制台「联网模型」里填「视觉模型」（比如 deepseek-flash），或者把大脑切成「本地模型」。";
				swSpeak("waiting", why);
				return await swRecord({ ok: false, reason: "no-vision-model", message: why });
			}
			if (!(await swShot())) return await swRecord({ ok: false, reason: "capture-failed" });
			const verdict = await swJudge(cfg, force);
			if (verdict.error) return await swRecord({ ok: false, reason: "judge-failed", message: verdict.error });
			const speak = force || cfg.verbosity === "chatty" ? verdict.say.length > 0 : verdict.react === true && verdict.say.length > 0;
			if (!speak) return await swRecord({ ok: true, spoke: false, reason: "nothing-notable", mad, react: verdict.react, say: verdict.say });
			const how = swSpeak(verdict.emotion, verdict.say);
			return await swRecord({ ok: true, spoke: true, emotion: verdict.emotion, say: verdict.say, how, mad });
		} finally {
			SW_RT.busy = false;
		}
	};
	/* [互动@2] 联网模型的实际配置（独立模式下是 <app>/../standalone/online.json）。
	 *  只用来**如实报名字**，读不到就当没配。 */
```

</details>

**依据 4 · 源码核查**：[src/lib/index.js:2356-2367](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2356-L2367)

timer disposer只clearInterval。

<details>
<summary>查看原文（12行）</summary>

```text
		return null;
	};
	ctx.effect(() => {
		const id = setInterval(() => {
			const cfg = swCfg();
			const now = Date.now();
			if (now - SW_RT.lastTick < Math.max(5, Number(cfg.intervalSec) || 12) * 1000) return;
			SW_RT.lastTick = now;
			void swRun().catch(() => {});
		}, 5000);
		return () => clearInterval(id);
	}, "dsh-pet: screen watch (local patch 3)");
```

</details>

**依据 5 · 源码核查**：[src/lib/index.js:3015-3021](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L3015-L3021)

最终卸载只stopHelper。

```text
	ctx.effect(() => () => {
		disposed = true;
		stopHelper("dsh-host-stop");
	});
	startHelper();
}

```

#### 缺口

- 宿主attachments保存策略与localProvider实际解析后的网络目的地
  **影响：**无法从本插件local标签保证数据只在本机/定期删除
  **进一步探讨：**只读同版本宿主provider/附件契约并核明确保留期及目标映射

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 路由、自动下载和进程停止有哪些采用条件？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

HTTP前缀注册将req.url/method/body直接交handlePetRoute，发布插件这一层未见peer/Host/Origin或令牌身份检查。config GET/PUT/DELETE和chat GET/POST因此依赖宿主外层访问控制；chatWithPet开头就swControl，若可达POST/chat可用文字开启监测或强制抓一帧。不能把它只称资产只读路由，也不能在未核宿主可达性时宣称远程已可利用。桌面helper管道复用业务函数另有本地通道边界，不能拿管道隔离替HTTP授权。

缺Electron会自动下载默认43.3.0，默认镜像npmmirror，可由环境变量覆盖，10分钟AbortController后解压到DSH_HOME/electron；已存在exe直接复用，此处不核版本或文件摘要。downloadArtifact依赖的校验行为需另核，不能说这里完全无上游校验。下载失败保留可能部分目录，后续若只以exe存在判断可产生恢复问题；不执行下载核查。

helper stopAndWait用于需重启路径，有3秒等待/升级kill，最终卸载stop只发kill不等退出，依赖helper宿主存活检测等兜底。适合可信本机宿主、能确认模型/附件目的地并接受Electron和截图持久数据的读者；对外暴露宿主需先核上层鉴权和路由权限，关闭并清理数据需区分停止新轮、在途请求、文件保留三个层面。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.js:1738-1750](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L1738-L1750)

聊天先走控制词。

<details>
<summary>查看原文（13行）</summary>

```text
	/** 与某只宠物对话：截取最近记忆 → 生成回复 → 写入记忆 → 返回 {reply,ts}。
	*  供 /chat 端点（POST）与 /chat 命令共用同一条路径（锁内读写，防两端交错写盘）。
	*  配图（chatImageEnabled 开启时）：把表情包清单交给模型按语境选一张，命中池内才随回复带回。 */
	const chatWithPet = async (petId, text) => withMemoryLock(async () => {
		const petCtlReply = swControl(text);
		if (petCtlReply) return {
			ok: true,
			reply: petCtlReply,
			ts: Date.now()
		};
		const cfg = readAllConfig(configPaths);
		const rounds = memoryRounds(petId, cfg);
		const conf = (findPetInstance(cfg, petId) ?? { conf: cfg.main ?? {} }).conf;
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2372-2410](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2372-L2410)

可写配置路由。

<details>
<summary>查看原文（39行）</summary>

```text
	const handlePetRoute = async (rawUrl, method, body) => {
		const url = new URL(rawUrl, "http://localhost");
		const rest = decodeURIComponent(url.pathname.slice(ROUTE_PREFIX.length + 1));
		if (rest === "config") {
			if (method === "GET") try {
				return {
					kind: "json",
					status: 200,
					obj: readAllConfig(configPaths)
				};
			} catch (e) {
				return {
					kind: "json",
					status: 500,
					obj: { error: e instanceof Error ? e.message : String(e) }
				};
			}
			if (method === "PUT") try {
				const parsed = JSON.parse(body ?? "");
				let existing;
				try {
					existing = JSON.parse(await readFile(userConfigPath, "utf8"));
				} catch {}
				const clean = saveUserConfig(parsed, existing);
				if (!clean) return {
					kind: "json",
					status: 400,
					obj: { error: "invalid pet config: expected { pets:[{name?,id,size,balanceEnabled,display,position:{corner,marginX,marginY}}] }（display 为 web/desktop/both/none 之一；可选顶层 notificationsEnabled / whisperImageEnabled / chatImageEnabled 布尔）" }
				};
				await mkdir(userRoot, { recursive: true });
				await writeFile(userConfigPath, JSON.stringify(clean, null, 2), "utf8");
				syncDesktop();
				return {
					kind: "json",
					status: 200,
					obj: readAllConfig(configPaths)
				};
			} catch {
				return {
```

</details>

**依据 3 · 源码核查**：[src/lib/index.js:2538-2580](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2538-L2580)

chat读写。

<details>
<summary>查看原文（43行）</summary>

```text
		if (rest === "chat") {
			const petId$1 = String(url.searchParams.get("pet") ?? "");
			try {
				if (method === "GET") {
					const cfg = readAllConfig(configPaths);
					const mem = await readMemory();
					const bucket = mem[findPetInstance(cfg, petId$1)?.entry ?? petId$1] ?? {};
					const list = (bucket[petId$1]?.messages ?? []).slice();
					const rounds = memoryRounds(petId$1, cfg);
					return {
						kind: "json",
						status: 200,
						obj: {
							ok: true,
							messages: list.slice(-rounds * 2),
							rounds
						}
					};
				}
				if (method === "POST") {
					const parsed = JSON.parse(body ?? "null") ?? {};
					const text = typeof parsed.text === "string" ? parsed.text.trim() : "";
					if (!text) return {
						kind: "json",
						status: 200,
						obj: {
							ok: false,
							reason: "bad-request",
							message: "消息为空"
						}
					};
					if (text.length > 2e3) return {
						kind: "json",
						status: 200,
						obj: {
							ok: false,
							reason: "bad-request",
							message: "消息过长（限 2000 字）"
						}
					};
					const result = await chatWithPet(petId$1, text);
					return {
						kind: "json",
```

</details>

**依据 4 · 源码核查**：[src/lib/index.js:2809-2824](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L2809-L2824)

HTTP无本地准入直接分派。

<details>
<summary>查看原文（16行）</summary>

```text
	};
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: ROUTE_PREFIX,
		handler: async (req, res) => {
			try {
				const body = req.method === "PUT" || req.method === "POST" ? await readBody(req) : void 0;
				const result = await handlePetRoute(req.url ?? "/", req.method ?? "GET", body);
				if (result.kind === "json") sendJson(res, result.status, result.obj, result.headers);
				else if (result.kind === "text") sendText(res, result.status, result.body);
				else sendFile(res, result.file, result.contentType);
			} catch (e) {
				sendJson(res, 500, { error: e instanceof Error ? e.message : String(e) });
			}
		}
	}), "dsh-pet: /dsh-pet-7340 asset route");
```

</details>

**依据 5 · 源码核查**：[src/lib/index.js:1208-1257](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L1208-L1257)

自动下载/解压。

<details>
<summary>查看原文（50行）</summary>

```text
async function ensureElectronDownload(options = {}) {
	const version = options.version || process.env.DSH_PET_ELECTRON_VERSION || "43.3.0";
	const mirror = options.mirror || process.env.DSH_PET_ELECTRON_MIRROR || "https://npmmirror.com/mirrors/electron/";
	const timeoutMs = options.timeoutMs ?? 10 * 60 * 1e3;
	const targetDir = electronLandingDir();
	const exe = defaultElectronExe();
	if (existsSync(exe)) return exe;
	const log = (message) => console.log(`[dsh-pet] ${message}`);
	const warn = (message) => console.warn(`[dsh-pet] ${message}`);
	const startedAt = Date.now();
	log(`Electron not found, downloading v${version} (${PLAT}-${process.arch}) ...`);
	mkdirSync(targetDir, { recursive: true });
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(new Error(`Electron download timed out after ${timeoutMs}ms`)), timeoutMs);
		timer.unref?.();
		let nextLogAt = Date.now() + 3e3;
		try {
			const zipPath = await downloadArtifact({
				version: `v${version}`,
				artifactName: "electron",
				mirrorOptions: { mirror: mirror.replace(/\/$/, "") + "/" },
				downloadOptions: {
					signal: controller.signal,
					quiet: true,
					getProgressCallback: async (progress) => {
						const now = Date.now();
						if (!progress.total || now < nextLogAt) return;
						nextLogAt = now + 3e3;
						log(`downloading ${(progress.transferred / 1024 / 1024).toFixed(1)}MB / ${(progress.total / 1024 / 1024).toFixed(1)}MB`);
					}
				}
			});
			const seconds = ((Date.now() - startedAt) / 1e3).toFixed(1);
			log(`download complete (${seconds}s), extracting to ${targetDir} ...`);
			await extract(zipPath, { dir: targetDir });
			if (!existsSync(exe)) throw new Error(`Electron zip extracted, but ${ELECTRON_REL} not found`);
			const readySeconds = ((Date.now() - startedAt) / 1e3).toFixed(1);
			log(`ready in ${readySeconds}s: ${exe}`);
			return exe;
		} finally {
			clearTimeout(timer);
		}
	} catch (error) {
		warn(`ensure failed: ${error instanceof Error ? error.message : String(error)}`);
		warn("desktop pet unavailable. Set DSH_PET_ELECTRON_PATH to an existing Electron, or retry later.");
		return void 0;
	}
}
function defaultLaunch(options = {}) {
```

</details>

**依据 6 · 源码核查**：[src/lib/index.js:1388-1418](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L1388-L1418)

两种停止方式。

<details>
<summary>查看原文（31行）</summary>

```text
	/** 停止 helper：发 SIGTERM 即返回，**不等它退出**。宿主退出/插件卸载路径用它——
	*  宿主马上就没了（Windows 有 job 对象、POSIX 有 helper 自己的 host-liveness 兜底，见 issue #56）。
	*  **停止后要立刻重启的场景必须用 stopAndWait()**，否则新旧进程会短暂重叠（issue #64）。 */
	stop(reason = "plugin-disposed") {
		this.stopping = true;
		if (this.restartTimer) clearTimeout(this.restartTimer);
		this.restartTimer = void 0;
		this.logger.debug?.(`dsh-pet desktop helper stopping (${reason})`);
		const child = this.child;
		if (!child) return;
		child.kill();
	}
	/**
	* 停止 helper 并**等它真正退出**（issue #64）：原实现只发一次 SIGTERM 就返回、紧接着 spawn 新进程，
	* 而 Electron 收到 SIGTERM 后关窗、销毁 GPU/动画合成器是异步的（几百 ms 起）——旧窗口（旧大小）
	* 还没消失、新窗口（新大小）已经画出来，桌面上就短暂出现"两只宠物"。
	*   ① 先置 `stopping`（由 stop() 完成）：守护逻辑不得把这次主动停止误判成崩溃去自动重启；
	*   ② 只等 `exit`，**不等 `close`**：stdio 管道关闭远早于进程真正退出（实测 SIGTERM 后 ~10ms 就触发）；
	*   ③ 超时（默认 3s）升级 SIGKILL；SIGKILL 后再给 1s 宽限，仍未退出就放弃等待——
	*      配置保存绝不能因为一个退不掉的子进程而被无限挂住。
	*/
	async stopAndWait(reason = "plugin-disposed", timeoutMs = HELPER_STOP_TIMEOUT_MS) {
		this.stop(reason);
		const child = this.child;
		if (!child) return;
		await waitForChildExit(child, timeoutMs, () => {
			this.logger.warn?.(`dsh-pet desktop helper 未在 ${timeoutMs}ms 内退出，升级 SIGKILL（${reason}）`);
			try {
				child.kill("SIGKILL");
			} catch {}
		});
```

</details>

**依据 7 · 源码核查**：[src/lib/index.js:3015-3021](https://github.com/12we21/cute-fat-fish-pet/blob/e53f63e67227671aca092e3334c8611e29b880b6/src/lib/index.js#L3015-L3021)

卸载stop。

```text
	ctx.effect(() => () => {
		disposed = true;
		stopHelper("dsh-host-stop");
	});
	startHelper();
}

```

#### 缺口

- 同版本宿主前缀路由的外层鉴权/监听范围与Electron依赖下载校验
  **影响：**决定实际攻击可达性与供应链保证，插件层缺检查不等已证实外部攻击
  **进一步探讨：**只读宿主webServer准入和锁定依赖下载实现，分别核权限与校验责任

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
