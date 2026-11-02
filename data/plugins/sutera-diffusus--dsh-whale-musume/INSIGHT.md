# dsh-whale-musume

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9ce976e](https://github.com/Sutera-Diffusus/dsh-whale-musume/tree/9ce976e6bfd95c46b643ef1bc74d70c166a04571)

<!-- BEGIN META -->
[![GitHub ★ 194](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=194&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sutera-Diffusus/dsh-whale-musume) [![npm 30d 3,967](https://img.shields.io/static/v1?label=npm+30d&message=3%2C967&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-musume) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-musume)
<!-- END META -->

> **功能**：为DSH桌面与Web界面提供鲸鱼娘桌宠、工作姿态、互动养成及可选天气、余额和语音联动。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 工作状态驱动的可配置陪伴和装饰/无障碍分层有整合价值，静态素材、状态机及设置通过原生双端插件交付；没有新增推理或结果验证。

> **主要限制**：[Q03](#research-q03) 默认toolPose仍读工具文本，绝对不读业务DOM表述不成立；可选天气会外联，success只是DOM退场启发式，不能当权威任务收据。

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
  - [Q01 · 桌宠为谁解决什么问题，是否改变代理能力？](#detail-section-11)
  - [Q02 · 宿主、浏览器、状态和设置怎样接线，失败如何退化？](#detail-section-12)
  - [Q03 · 默认隐私与成功姿态能否按宣传理解？](#detail-section-13)
  - [Q04 · 如何判断值得安装，如何验证更可信而安静的状态提示？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好看板娘的个人DSH用户，在编码等待与工作切换看安静姿态并互动；成功是少干扰且满足偏好，不是提升代码正确率。

原DSH工作卡/结果与无桌宠界面；独立随机动画桌宠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 状态桌宠 | 陪伴与工作提示 | DOM启发式非成功收据 |
| 设置/养成 | 偏好互动 | 页面本地存储非隔离vault |
| 文本姿态/关键词 | 内容相关反应 | toolPose默认开，keywords默认关 |
| 天气/余额/TTS | 可选生活/服务提示 | 城市触发外联、余额需本机代理、语音需独立服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18及兼容DSH webServer/ModuleLoader/React | 必需 | 资源和客户端启动 | 版本门禁/装载失败需核，不保证当前兼容 |
| slots | 设置需要 | 配置面板 | 注册失败warn，核心装载分离 |
| 包内生成素材/CSS/JS | 必需 | 本地动画 | 路由/资源失败刷新排查 |
| 浏览器存储与DOM观察允许 | 基本体验条件 | 偏好/工作提示 | 文本读取按开关核，存储失败回默认 |
| 城市/天气网络、余额代理、MiMo服务 | 可选 | 天气/金额/播报 | 默认关闭/城市空，费用隐私另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选范围 | 独立profile核宿主契约和素材 | 作者静态兼容不代实机 |
| 默认试用 | 装载并刷新，核设置/网络/内容开关 | 不需要的toolPose也关 |
| 对照工作 | 历史错误/切会话/焦点与原工具结果比较 | 不拿姿态作成功授权 |
| 退出 | 卸载并刷新，按需备份/清偏好 | 回原界面，未证热卸载完整 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/素材下载 | 版本/隐私偏好核验 | 金额工时未知 |
| 持续 | 动画/图片/全树观察、本地存储 | 误提示复核/版本维护 | CPU内存帧率未测 |
| 可选/失败 | 天气外联/TTS服务/余额代理 | 单独配置，资源故障刷新或卸载 | 上游收费与恢复量未知，MIT不等总成本0 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作陪伴 | DOM信号驱动/消抖与姿态设置 | 用户喜欢/少干扰 |
| 安静/隐私 | 额外能力多数默认关、装饰a11y分离 | 默认toolPose读文本、全模式零联网不成立 |
| 成功提示 | 工具消失且未识别错误推success | 任务真实成功、漏错率/延迟 |

> **思考**：[Q03](#research-q03) 默认toolPose仍读工具文本，绝对不读业务DOM表述不成立；可选天气会外联，success只是DOM退场启发式，不能当权威任务收据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 工作状态驱动的可配置陪伴和装饰/无障碍分层有整合价值，静态素材、状态机及设置通过原生双端插件交付；没有新增推理或结果验证。

[Q02](#research-q02) 资源与可选设置/TTS失败隔离及历史错误消抖值得借鉴；[Q03](#research-q03) 内容授权、观测未知和默认宣传需与实际路径一致，boot重试/统一清理仍需实机核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认toolPose仍读工具文本，绝对不读业务DOM表述不成立；可选天气会外联，success只是DOM退场启发式，不能当权威任务收据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 偏好桌宠的个人用户可独立profile关闭额外能力窄试，工具文本读取单独确认；不喜欢/干扰或错提示即退回原界面，不以立绘作验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定入口/客户端装载设置TTS、呈现层状态/内容/天气/余额/a11y/观察路径定向检查；未全审所有动画/养成算法或开发脚本，未运行目标/宿主/网络及用户实验。

- 已检查：作者 README、包清单、源码路径 README.md、assets/dsh-whale-moe.js、cordis.patch.yml、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读固定宿主入口、客户端引导/设置/桥接与呈现层关键路径，未审所有素材/算法/发布脚本，未安装、运行、访问上游或当前npm验证。
- 下一步：[Q04](#research-q04) 独立profile对照DOM/事件和原界面，网络/内容读取、故障刷新/卸载、焦点与资源/偏好分别验，尚未执行。

**分析版本**

- **仓库**：[Sutera-Diffusus/dsh-whale-musume](https://github.com/Sutera-Diffusus/dsh-whale-musume)
- **版本号**：2.5.0（[固定提交 9ce976e](https://github.com/Sutera-Diffusus/dsh-whale-musume/tree/9ce976e6bfd95c46b643ef1bc74d70c166a04571)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 待验证会话/运行ID状态事件、未知态与独立内容授权能否减少误成功而不增加干扰/维护成本，以当前消抖和原界面为基线。

[Q04](#research-q04) 独立profile对照DOM/事件和原界面，网络/内容读取、故障刷新/卸载、焦点与资源/偏好分别验，尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 6414 | — | — | 72855 |
| .js | source | 4 | 6874 | 6240 | 359 | — |
| .mjs | source | 23 | 4079 | 3588 | 323 | — |
| .mjs | test | 28 | 4487 | 3845 | 265 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Sutera-Diffusus/dsh-whale-musume/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Sutera-Diffusus/dsh-whale-musume/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Sutera-Diffusus/dsh-whale-musume/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌宠状态与隐私边界是否支撑个人偏好试用，怎样不误当任务成功？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠为谁解决什么问题，是否改变代理能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是喜欢看板娘的DSH桌面/Web个人用户，任务是在编码等待间看工作/休息姿态并进行轻互动，验收应是偏好满足、状态提示不过度误导且不干扰输入，而非代码更正确。基线是无桌宠的原界面，或独立随机动画桌宠。贡献是把宿主可见工作信号、姿态、设置和本地养成接起来；没有新增模型推理、代码执行工具或真实任务验收机制。

README强调工作时安静、默认装饰及额外能力关闭，这是作者设计目标，不是已测用户体验。package的bundle patch+client与宿主静态路由构成原生DSH插件，非纯素材资源包；生成素材与开发发布脚本不能扩充为运行时工具能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-37](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/README.md#L27-L37)

作者的动机与三项设计目标。

<details>
<summary>查看原文（11行）</summary>

```text
## 为什么是鲸鱼娘

大部分桌宠要么只是「会动的图」，要么会在你专注时抢注意力。鲸鱼娘的三条硬规则：

| 原则 | 具体做法 |
|---|---|
| **不打断你** | 工作态（有工具在跑）**绝不弹话、不乱切姿势**；所有闲聊、关怀、播报都只在待机时发生 |
| **不抢你的焦点** | 默认是纯装饰：`aria-hidden`、不拦截键盘、不覆盖业务 DOM、不改任何内置包文件；连焦点都要你主动开无障碍模式才拿得到 |
| **不给你添隐私负担** | 无遥测、不上传、默认零外部请求；台词播报、关键词感知、余额、无障碍这些会读内容/金额的功能**全部默认关闭** |

而且她是**真的会看你在干什么**：不是定时随机换图，而是读取宿主的结构化标记（工具卡状态、会话运行标记、终端块）来判断你在忙什么，再决定摆哪个姿势、要不要闭嘴。
```

</details>

**依据 2 · 源码核查**：[package.json:1-28](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/package.json#L1-L28)

2.5.0及实际发布入口/资源。

<details>
<summary>查看原文（28行）</summary>

```text
{
  "name": "dsh-whale-musume",
  "version": "2.5.0",
  "description": "鲸鱼娘桌面宠物（看板娘 / desktop pet mascot）for DeepSeek Harness：陪你写代码的 whale-girl 桌宠，桌面端与 Web 双端支持",
  "publishConfig": {
    "access": "public"
  },
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "assets/generated",
    "assets/dsh-whale-moe.css",
    "assets/dsh-whale-moe.js",
    "assets/whale-moe-core.js",
    "assets/peek-calibration.json",
    "cordis.patch.yml"
  ],
  "scripts": {
    "test": "node --test test/*test.mjs",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/cordis.patch.yml#L1-L9)

宿主bundle接线。

```text
# dsh-whale-musume bundle patch —— 把鲸鱼娘桌宠叠加到 profile 组合上(零侵入)。
# 单包双面(dsh.bundle + dsh.client):
#   · 宿主插件(worker 侧):注册 /api/dsh-whale-musume/assets 只读静态资源路由,
#     把包内 assets(CSS / JS / generated/*.webp / 校准表)供给浏览器;
#   · 浏览器插件(dsh.client):注入鲸鱼娘样式与状态机脚本,资源根指向上述路由,
#     首次挂载自动唤醒看板娘;全部资源本地加载,无外部请求、无遥测。
- insert:
    - id: dsh-whale-musume
      name: dsh-whale-musume
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主、浏览器、状态和设置怎样接线，失败如何退化？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

宿主注入webServer注册只读资源路由，normalize后做目录前缀判断，响应CSS/JS/图片/校准表并effect注销路由。该检查是词法范围检查，不能据此宣称通用realpath沙箱；这里服务包内可信资源而非用户任意目录。浏览器ModuleLoader工厂按CSS→core→presenter获取并注入内联script，改写资源根，boot标志防重复；获取未检查res.ok且失败仅warn、标志已置true，同页修复资源后未见重置重试逻辑，应刷新重新装载。

工作信号由DOM查询而非权威代理事件流：tool/thinking连续300ms消抖，消失后主页4秒/工作台8秒保持；历史错误baseline与首次settle避免重载旧失败惊吓，工作台tool退场且无已识别error记录success时间。设置slots注册看板娘项，独立try/catch隔离失败；可选MiMo TTS监听交互台词且默认关，只有现成xiaomiMimoTts服务时play，播放失败被吞不影响桌宠。

MutationObserver监听整个documentElement的attributes/childList/subtree并schedule；已经看到资源路由与TTS监听注销，但本研究未证明所有呈现层observer/全局timer/DOM有统一卸载补偿，不能从局部effect推出热卸载完整。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:24-65](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/lib/index.js#L24-L65)

静态路由/词法范围/注销。

<details>
<summary>查看原文（42行）</summary>

```text
/** 把请求参数 f 解析为 assets 目录内的安全路径;越界返回 null。 */
function safeResolve(rel) {
  const target = path.normalize(path.join(ASSETS_DIR, rel));
  if (target !== ASSETS_DIR && !target.startsWith(ASSETS_DIR + path.sep)) return null;
  return target;
}

export async function apply(ctx) {
  // 必须走 inject —— apply 运行时刻 webserver 的 fiber 可能尚未创建
  ctx.inject(["webServer"], (wctx) => {
    const webServer = wctx.get("webServer");
    const dispose = webServer.register({
      kind: "exact",
      path: "/api/dsh-whale-musume/assets",
      handler: async (req, res) => {
        try {
          const url = new URL(req.url, "http://127.0.0.1");
          // f 的值可能带形如 ?v=3 的版本尾巴(表现层拼 URL 时追加),剥掉再解析
          const rel = (url.searchParams.get("f") ?? "").split("?")[0];
          const file = safeResolve(rel);
          if (file === null || !existsSync(file) || !statSync(file).isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("not found");
            return;
          }
          const type = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
          res.writeHead(200, {
            "Content-Type": type,
            "Cache-Control": "public, max-age=3600",
          });
          createReadStream(file).pipe(res);
        } catch (error) {
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(String(error?.message ?? error));
        }
      },
    });
    wctx.effect(() => dispose, "dsh-whale-musume: 静态资源路由");
  });

  ctx.logger?.info?.("dsh-whale-musume: 已挂载(资源路由 /api/dsh-whale-musume/assets)");
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:14-61](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/lib/client.js#L14-L61)

装载、防重与失败处理。

<details>
<summary>查看原文（48行）</summary>

```text
window.__ModuleLoader__.load({
  id: "dsh-whale-musume",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    var React = require("react");
    var jsxRuntime = require("react/jsx-runtime");
    var jsx = jsxRuntime.jsx;
    var jsxs = jsxRuntime.jsxs;

    const BASE = "/api/dsh-whale-musume/assets?f=";
    const BOOT_FLAG = "__dshWhaleMusumeBooted";
    const MIMO_TTS_EVENT = "dsh-whale-musume:interaction-line";

    function injectStyle(text) {
      const el = document.createElement("style");
      el.setAttribute("data-dsh-whale-musume", "css");
      el.textContent = text;
      document.head.appendChild(el);
    }

    function injectScript(text) {
      const el = document.createElement("script");
      el.setAttribute("data-dsh-whale-musume", "js");
      el.textContent = text;
      document.body.appendChild(el);
    }

    async function boot() {
      if (window[BOOT_FLAG]) return;
      window[BOOT_FLAG] = true;
      try {
        const css = await (await fetch(BASE + "dsh-whale-moe.css")).text();
        injectStyle(css);
        const core = await (await fetch(BASE + "whale-moe-core.js")).text();
        injectScript(core);
        const raw = await (await fetch(BASE + "dsh-whale-moe.js")).text();
        const presenter = raw
          .replace('var ASSET_ROOT = "/assets/generated/";', 'var ASSET_ROOT = "' + BASE + 'generated/";')
          /* 旧版还有一处 ANIM_ROOT 替换，但 presenter 里从来没有这个常量
             （assets/anim/*.webm 未被引用），那处 replace 永不命中，已删除以免误导。 */
          .replace('fetch("/assets/peek-calibration.json")', 'fetch("' + BASE + 'peek-calibration.json")');
        injectScript(presenter);
      } catch (error) {
        console.warn("[dsh-whale-musume] 资源加载失败:", error);
      }
    }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:638-696](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/lib/client.js#L638-L696)

设置、TTS和工厂副作用。

<details>
<summary>查看原文（59行）</summary>

```text

    function registerMimoTtsBridge(ctx) {
      ctx.effect(() => {
        const playInteractionLine = (event) => {
          const enabled = MascotValue("mimoTts", "0") !== "0";
          const text = event && event.detail && typeof event.detail.text === "string" ? event.detail.text.trim() : "";
          if (!enabled || text.length === 0) return;
          const tts = ctx.get("xiaomiMimoTts");
          if (tts === undefined || typeof tts.play !== "function") return;
          try {
            const playback = tts.play(text);
            if (playback && typeof playback.catch === "function") playback.catch(() => {});
          } catch {
            /* 可选播放失败不影响桌宠交互。 */
          }
        };
        window.addEventListener(MIMO_TTS_EVENT, playInteractionLine);
        return () => window.removeEventListener(MIMO_TTS_EVENT, playInteractionLine);
      }, "dsh-whale-musume: 可选 MiMo TTS 桥接");
    }

    function registerSettings(ctx) {
      const slots = ctx.slots !== undefined ? ctx.slots : ctx.get("slots");
      if (slots === undefined) {
        console.warn("[dsh-whale-musume] slots 服务不可用，跳过设置面板注册（桌宠本体不受影响）");
        return;
      }
      slots.inject("settings.section", () => slots.register(
        { name: "settings.section", id: "mascot", order: 6, label: "看板娘", children: { "settings.mascot.item": { kind: "list", scope: "root" } } },
        (props) => jsx(MascotSection, { ...props, ctx })
      ));
      slots.inject("settings.mascot.item", () => slots.register(
        { name: "settings.mascot.item", id: "mascot-prefs", order: 0 },
        () => jsx(MascotPrefRows, { ctx })
      ));
    }

    function apply(ctx) {
      /* 此桥接完全可选：既不注入也不强制依赖 MiMo TTS。 */
      try {
        registerMimoTtsBridge(ctx);
      } catch (e) {
        console.warn("[dsh-whale-musume] MiMo TTS 联动注册失败，桌宠本体不受影响", e);
      }
      /* 设置面板是增强项：注册失败也要保证桌宠本体正常出现。 */
      try {
        registerSettings(ctx);
      } catch (e) {
        console.warn("[dsh-whale-musume] 设置面板注册失败，桌宠本体不受影响", e);
      }
    }

    exports.apply = apply;
    exports.inject = ["slots"];

    /* 0.2.0-rc.2 的客户端模块系统是惰性 CJS：执行 bundle 只注册 factory，
       「包括 CSS 注入在内的副作用都发生在 factory 物化期」。引导因此放在
       factory 体内（物化即注入样式与脚本），apply 只负责 TTS 桥接与设置面板注册。 */
    boot();
```

</details>

**依据 4 · 源码核查**：[assets/dsh-whale-moe.js:2027-2078](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L2027-L2078)

信号消抖与success推断。

<details>
<summary>查看原文（52行）</summary>

```text
  function collectSignals() {
    var now = Date.now();
    var view = detectView();
    var rawTool = toolVisible();
    var rawThinking = anyVisible(SIGNAL_BANKS.thinking);
    /* 消抖：信号必须连续存在 300ms 才算数；消失后按场景保持——
       主页 4s、工作台 8s。工作台的工具面板在任务间会短暂空白，
       拉长保持时间让工作姿势在整段工作期间钉住，不再反复切换。 */
    var goneHold = view === "workbench" ? 8000 : 4000;
    var wasRawTool = memory.toolRawSeen;
    if (rawTool) {
      if (!memory.toolSeenAt) memory.toolSeenAt = now;
      memory.toolRawSeen = true;
    } else {
      memory.toolSeenAt = 0;
      /* 只在下沿记录“开始消失的时刻”，中间回来又消失则重新起算 */
      if (wasRawTool || !memory.toolGoneAt) memory.toolGoneAt = now;
      memory.toolRawSeen = false;
    }
    var wasRawThinking = memory.thinkingRawSeen;
    if (rawThinking) {
      if (!memory.thinkingSeenAt) memory.thinkingSeenAt = now;
      memory.thinkingRawSeen = true;
    } else {
      memory.thinkingSeenAt = 0;
      if (wasRawThinking || !memory.thinkingGoneAt) memory.thinkingGoneAt = now;
      memory.thinkingRawSeen = false;
    }
    /* 关键：信号短暂消失又回来时，seenAt 会归零重算。不能因此把
       active 直接打回 false —— 只要没离开满 goneHold，就一直钉在工作态。 */
    var toolActive = rawTool
      ? (now - memory.toolSeenAt >= 300 || (memory.toolGoneAt !== 0 && now - memory.toolGoneAt < goneHold))
      : memory.toolGoneAt !== 0 && now - memory.toolGoneAt < goneHold;
    var thinkingActive = rawThinking
      ? (now - memory.thinkingSeenAt >= 300 || (memory.thinkingGoneAt !== 0 && now - memory.thinkingGoneAt < goneHold))
      : memory.thinkingGoneAt !== 0 && now - memory.thinkingGoneAt < goneHold;
    var errorActive = errorVisible();
    memory.lastErrorActive = errorActive;
    if (view === "workbench" && memory.toolWasActive && !toolActive && !errorActive) memory.lastSuccessAt = now;
    memory.toolWasActive = toolActive;
    var dense = countVisible(SIGNAL_BANKS.code) >= 3;
    /* Workbench uses exactly two moods: busy (tool/thinking/success/failure)
       vs calm (idle rotation). The old "waiting" sweat pose no longer fires. */
    return {
      view: view,
      waiting: false,
      thinking: thinkingActive,
      tool: toolActive,
      successAt: anyVisible(SIGNAL_BANKS.success) ? now : memory.lastSuccessAt,
      error: errorActive,
      curiousAt: memory.viewChangedAt,
      lastInteraction: memory.lastInteractionAt,
```

</details>

**依据 5 · 源码核查**：[assets/dsh-whale-moe.js:3653-3671](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L3653-L3671)

全树observer及启动。

<details>
<summary>查看原文（19行）</summary>

```text
    function init() {
      safeReconcile();
      observer = new root.MutationObserver(schedule);
      observer.observe(doc.documentElement, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  }

  root.__dshWhaleMoeVersion = "2.5.0";
  root.__dshWhaleMoeDebug = { state: "boot", pose: null, line: "", view: "home" };
  start();
  schedulePreload();
  watchComeback();
})(typeof window === "undefined" ? null : window);
```

</details>

**依据 6 · 源码核查**：[assets/dsh-whale-moe.js:3386-3410](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L3386-L3410)

养成日记本地存储，截留80项。

<details>
<summary>查看原文（25行）</summary>

```text

  /* ── 成长日记（v1.9.0）────────────────────────────────────────────────
     养成数据原本只能重置、不能回看。这里按时间记下关键节点（升级、羁绊、
     成就、首次互动），设置面板据此渲染一条时间线。只留在 localStorage，
     不上传；同一天同类事件只记一条，避免刷屏。 */
  var JOURNAL_MAX = 80;
  var JOURNAL_KEY = "whale-moe:journal";

  function readJournal() {
    try {
      var raw = root.localStorage.getItem(JOURNAL_KEY);
      if (!raw) return [];
      var list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function writeJournal(list) {
    try {
      root.localStorage.setItem(JOURNAL_KEY, JSON.stringify(list.slice(-JOURNAL_MAX)));
    } catch (e) { /* 容量或隐私模式下失败都无所谓 */ }
  }

  function journalAdd(kind, text) {
    if (!text) return;
```

</details>

**依据 7 · 源码核查**：[assets/dsh-whale-moe.js:2604-2613](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L2604-L2613)

schedule合并事件并延迟reconcile，非每次变更即时全扫。

<details>
<summary>查看原文（10行）</summary>

```text
  function schedule() {
    root.__dshWhaleMoeScheduleCalls = (root.__dshWhaleMoeScheduleCalls || 0) + 1;
    root.__dshWhaleMoeScheduleSkipped = (root.__dshWhaleMoeScheduleSkipped || 0) + (scheduled || memory.failed ? 1 : 0);
    if (scheduled || memory.failed) return;
    scheduled = true;
    root.setTimeout(function () {
      scheduled = false;
      safeReconcile();
    }, DEBOUNCE_MS);
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认隐私与成功姿态能否按宣传理解？

**研究主题**：缺陷与关键质疑

#### 完整回答

“不读业务DOM/无外部请求”不能当所有模式的绝对保证。默认toolPose开，detectToolPose读最后一个工具候选节点textContent，长度2..4000后按词映射姿态；因此关闭keywords并不等完全不读取文本。错误判断还读取新错误节点最多80字符进入页面debug对象。keywords默认关闭，打开后扫对话节点前2000字符并本地匹配；这些源码路径不证明向模型或作者上传，但共享页面上下文不是隔离存储。

余额显式开关默认关，开后每60秒访问浏览器所在机器127.0.0.1:3020/balance，取账户金额，失败静默、pending依fetch完成；没有该请求超时分支。远程Web页面的浏览器回环并非远端宿主服务，缺代理不能解读为金额0。城市留空不请求天气；设置城市后经Open-Meteo地理编码/天气HTTPS请求，城市/坐标及可选key会进入URL，带超时与失败后重试窗口。MiMo TTS的上游隐私/费用由另一个服务决定，本包只桥接，不把其能力或保障继承过来。

姿态是可见DOM的启发式，不是权威成功收据：卡片被移除、切视图/虚拟列表或未匹配错误可能让tool消失被当success，历史baseline也可能漏掉加载期真实问题。300ms/8秒等稳定策略减少闪烁但会延迟，不能用来批准部署或认定任务成功。默认aria-hidden避免读屏噪音，开启a11y才增加Tab/button属性，实际键盘冲突和动画性能仍需宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[assets/dsh-whale-moe.js:2317-2353](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L2317-L2353)

默认读工具卡文本及tool状态调用。

<details>
<summary>查看原文（37行）</summary>

```text
  function toolPoseEnabled() {
    try { return root.localStorage.getItem("whale-moe:toolPose") !== "0"; } catch (e) { return true; }
  }

  function detectToolPose() {
    if (!toolPoseEnabled()) return "";
    try {
      var nodes = doc.querySelectorAll('[data-role="tool"], [data-tool="true"], [data-tool-card="true"], [data-running], [data-state="ongoing"]');
      if (!nodes || !nodes.length) return "";
      /* 取最后一个：通常是最新的那个工具 */
      var node = nodes[nodes.length - 1];
      var text = String(node.textContent || "").toLowerCase();
      if (text.length < 2 || text.length > 4000) return "";
      for (var i = 0; i < TOOL_POSES.length; i += 1) {
        var entry = TOOL_POSES[i];
        for (var j = 0; j < entry.words.length; j += 1) {
          if (text.indexOf(entry.words[j]) !== -1) return entry.pose;
        }
      }
    } catch (e) { /* ignore */ }
    return "";
  }

  function statePose(computed, view) {
    if (dragState && dragState.moved) return "pick-up";
    /* 忙时情绪让位：running 优先，仅点击互动专用的两个姿势可覆盖 */
    var busy = BUSY_STATES[computed.state] === 1;
    var moodOk = !busy || memory.moodPose === "work-pat" || memory.moodPose === "work-ram";
    if (memory.moodUntil > Date.now() && memory.moodPose && moodOk) return memory.moodPose;
    if (computed.state === "idle") return "idle-cute";
    if (computed.state === "tool") {
      var tp = detectToolPose();
      if (tp) return tp;
    }
    return computed.pose;
  }

```

</details>

**依据 2 · 源码核查**：[assets/dsh-whale-moe.js:1952-1992](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L1952-L1992)

错误基线与debug摘录。

<details>
<summary>查看原文（41行）</summary>

```text
    var baseline = memory.errorBaseline;
    var firstPass = baseline === null;
    if (firstPass) baseline = memory.errorBaseline = [];
    var now = Date.now();
    if (!memory.bootedAt) memory.bootedAt = now;
    var settling = (now - memory.bootedAt) < SETTLE_MS;
    var live = [];
    for (var i = 0; i < SIGNAL_BANKS.error.length; i += 1) {
      var nodes = doc.querySelectorAll(SIGNAL_BANKS.error[i]);
      for (var j = 0; j < nodes.length; j += 1) {
        var n = nodes[j];
        /* Historical DSH log clusters carry data-state="error" for a failed
           step that already finished; they are records, not live failures. */
        if (typeof n.closest === "function" && n.closest('[class*="dshLogCluster"]')) continue;
        /* First pass + loading settle window: seed every error node seen during
           the initial load as history, so a reload never opens in the error
           pose (DSH mounts conversation history after the first reconcile). */
        if (firstPass || settling) { if (baseline.indexOf(n) === -1) baseline.push(n); continue; }
        if (baseline.indexOf(n) !== -1) continue;
        if (!isVisible(n)) continue;
        var meaningful = n.getAttribute("role") === "alert"
          || n.getAttribute("aria-invalid") === "true"
          || (n.textContent || "").trim().length > 0;
        if (!meaningful) continue;
        memory.lastErrorMatches.push({
          sel: SIGNAL_BANKS.error[i],
          tag: n.tagName,
          cls: String(n.className).slice(0, 120),
          txt: (n.textContent || "").trim().slice(0, 80),
          role: n.getAttribute("role"),
          ariaInvalid: n.getAttribute("aria-invalid")
        });
        live.push(n);
      }
    }

    if (live.length === 0) { memory.errorSeenAt = 0; return false; }
    if (!memory.errorSeenAt) memory.errorSeenAt = now;

    /* Moved on = the conversation advanced past the error: a new thinking or
       tool burst started after the error, or a success completed after it.
```

</details>

**依据 3 · 源码核查**：[assets/dsh-whale-moe.js:2573-2596](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L2573-L2596)

对话关键词本地扫描。

<details>
<summary>查看原文（24行）</summary>

```text
    root.__dshWhaleMoeKeywordScans = (root.__dshWhaleMoeKeywordScans || 0) + 1;
    if (keywordScanTimer) root.clearTimeout(keywordScanTimer);
    keywordScanTimer = root.setTimeout(function () {
      keywordScanTimer = null;
      root.__dshWhaleMoeKeywordRuns = (root.__dshWhaleMoeKeywordRuns || 0) + 1;
      var nodes = doc.querySelectorAll('[data-slot="conversation.chat.node"]');
      for (var i = nodes.length - 1; i >= 0; i -= 1) {
        var text = (nodes[i].textContent || "").slice(0, 2000);
        if (!text) continue;
        var id = core.matchKeyword(text, keywordsEnabled());
        root.__dshWhaleMoeKeywordMatched = id;
        if (!id) continue;
        var line = say("keyword", id);
        root.__dshWhaleMoeKeywordLine = line;
        if (KEYWORD_POSES[id]) showMood(KEYWORD_POSES[id], 3000, true);
        if (line) {
          addUsageStat("keywords", 1);
          applyQuestSignal("keyword", 1);
          showLine(line);
        }
        if (id === "thanks") {
          var out = applyGrowth({ type: "thanks" }, Date.now(), 0);
          if (out.unlocks.length) burst("🏅");
        }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:71-89](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/lib/client.js#L71-L89)

敏感能力默认关。

<details>
<summary>查看原文（19行）</summary>

```text
    function MascotValue(key, fallback) {
      try { const v = window.localStorage.getItem("whale-moe:" + key); return v === null ? fallback : v; } catch (e) { return fallback; }
    }
    function MascotPrefRow({ label, prefKey, compact }) {
      /* 涉及额外读取或外部能力的功能默认关闭。 */
      const defaultOff = prefKey === "mimoTts" || prefKey === "keywords" || prefKey === "balance" ||
        prefKey === "balanceDetail" || prefKey === "a11y";
      const [isOn, setIsOn] = React.useState(MascotValue(prefKey, defaultOff ? "0" : "1") !== "0");
      return jsxs("div", { style: compact ? { alignItems: "center", display: "flex", gap: "8px", justifyContent: "space-between", minWidth: 0, padding: "6px 0" } : MASCOT_ROW_STYLE, children: [jsx("span", { style: compact ? { fontSize: "12px", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } : undefined, children: label }), jsx("button", {
        type: "button", role: "switch",
        "aria-checked": isOn,
        style: { alignItems: "center", background: isOn ? "var(--dsw-static-accent, #4da3ff)" : "var(--dsw-alias-border-l3, #c9cdd6)", border: "none", borderRadius: "999px", cursor: "pointer", display: "flex", height: "24px", justifyContent: isOn ? "flex-end" : "flex-start", padding: "3px", transition: "background 160ms ease", width: "44px" },
        onClick: (event) => {
          event.stopPropagation();
          event.preventDefault();
          const next = !isOn;
          try { window.localStorage.setItem("whale-moe:" + prefKey, next ? "1" : "0"); } catch (e) {}
          setIsOn(next);
          window.dispatchEvent(new CustomEvent("whale-moe-prefs-change", { detail: { key: prefKey, value: next ? "1" : "0" } }));
```

</details>

**依据 5 · 源码核查**：[assets/dsh-whale-moe.js:3094-3148](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L3094-L3148)

回环余额条件、失败及无局部超时。

<details>
<summary>查看原文（55行）</summary>

```text
  var BALANCE_ENDPOINT = "http://127.0.0.1:3020/balance";
  var BALANCE_POLL_MS = 60000;           /* 与代理侧缓存时长对齐 */
  var BALANCE_ANNOUNCE_MS = 30 * 60 * 1000;
  var BALANCE_CALM_ANNOUNCE_MS = 6 * 60 * 60 * 1000;  /* 充裕时几乎不提 */
  var balanceState = {
    at: 0, ok: false, amount: null, currency: "CNY",
    tier: "unknown", announcedAt: 0, pending: false
  };

  function balanceEnabled() {
    try { return root.localStorage.getItem("whale-moe:balance") === "1"; } catch (e) { return false; }
  }

  function applyBalancePayload(data) {
    if (!data || data.ok !== true) { balanceState.ok = false; return; }
    var list = data.balances;
    if (!list || !list.length) { balanceState.ok = false; return; }
    var b = core.pickBalanceAccount(list, "CNY") || {};
    var amount = Number(b.totalBalance);
    if (!isFinite(amount)) { balanceState.ok = false; return; }
    balanceState.ok = true;
    balanceState.amount = amount;
    balanceState.currency = b.currency || "CNY";
    balanceState.tier = core.balanceTier(amount);
    root.__dshWhaleMoeBalance = {
      ok: true, amount: amount,
      currency: balanceState.currency,
      tier: balanceState.tier
    };
    /* 沿用既有的低余额通道（立绘 + 成就），只是判定改由真实金额得出 */
    if (balanceState.tier === "critical" || balanceState.tier === "empty") {
      try { root.localStorage.setItem("dsh.balance.low", "1"); } catch (e) { /* ignore */ }
    } else {
      try { root.localStorage.removeItem("dsh.balance.low"); } catch (e) { /* ignore */ }
    }
  }

  function refreshBalance(now) {
    if (!balanceEnabled()) return;
    if (balanceState.pending) return;
    if (now - balanceState.at < BALANCE_POLL_MS) return;
    balanceState.at = now;
    balanceState.pending = true;
    var done = function () { balanceState.pending = false; };
    try {
      root.fetch(BALANCE_ENDPOINT, { cache: "no-store", credentials: "omit" })
        .then(function (res) {
          if (!res || !res.ok) throw new Error("balance-unavailable");
          return res.json();
        })
        .then(function (data) { applyBalancePayload(data); done(); })
        .catch(function () { balanceState.ok = false; done(); });
    } catch (e) {
      balanceState.ok = false;
      done();
```

</details>

**依据 6 · 源码核查**：[assets/dsh-whale-moe.js:2655-2735](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L2655-L2735)

天气URL/超时与城市门控。

<details>
<summary>查看原文（81行）</summary>

```text
  function weatherJson(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      var timer = root.setTimeout(function () {
        if (ctrl) ctrl.abort();
        reject(new Error("weather timeout"));
      }, timeoutMs || 7000);
      root.fetch(url, { signal: ctrl ? ctrl.signal : undefined, headers: { Accept: "application/json" } }).then(function (res) {
        if (!res.ok) throw new Error("weather http " + res.status);
        return res.json();
      }).then(function (json) {
        root.clearTimeout(timer);
        resolve(json);
      }).catch(function (error) {
        root.clearTimeout(timer);
        reject(error);
      });
    });
  }

  function weatherKeyParam() {
    var key = readWeather("weatherKey").trim();
    return key ? "&apikey=" + encodeURIComponent(key) : "";
  }

  function geocodeCity(city) {
    var url = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=zh&format=json" + weatherKeyParam();
    return weatherJson(url, 8000).then(function (json) {
      if (!json || !json.results || !json.results.length) throw new Error("city not found");
      return { lat: Number(json.results[0].latitude), lon: Number(json.results[0].longitude), name: json.results[0].name || city };
    });
  }

  function fetchWeather(city, key) {
    var useCity = (city || readWeather("weatherCity")).trim();
    if (!useCity) return Promise.reject(new Error("no city"));
    var cached = weatherState.coords;
    var coordsP = cached ? Promise.resolve(cached) : geocodeCity(useCity);
    return coordsP.then(function (coords) {
      weatherState.coords = coords;
      writeCoords(coords);
      var url = "https://api.open-meteo.com/v1/forecast?latitude=" + coords.lat + "&longitude=" + coords.lon + "&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto" + weatherKeyParam();
      return weatherJson(url, 8000).then(function (json) {
        if (!json || !json.current) throw new Error("no current weather");
        weatherState.current = {
          temp: Number(json.current.temperature_2m),
          code: String(json.current.weather_code),
          wind: Number(json.current.wind_speed_10m || 0),
          humidity: Number(json.current.relative_humidity_2m || 0)
        };
        weatherState.fetchedAt = Date.now();
        weatherState.retryAt = 0;
        weatherState.nextRefreshAt = weatherState.fetchedAt + WEATHER_REFRESH_MIN + Math.floor(Math.random() * (WEATHER_REFRESH_MAX - WEATHER_REFRESH_MIN));
        weatherState.status = "ok";
        schedule();
        return weatherState.current;
      });
    });
  }

  function weatherEnsure(force) {
    var now = Date.now();
    var city = readWeather("weatherCity").trim();
    if (!city) return Promise.resolve(null);
    if (weatherState.city !== city || weatherState.key !== readWeather("weatherKey")) {
      weatherState.city = city;
      weatherState.key = readWeather("weatherKey");
      weatherState.coords = null;
      writeCoords(null);
    }
    var fresh = weatherState.current && now - weatherState.fetchedAt < WEATHER_DATA_MS;
    if (force || (!fresh && now >= weatherState.nextRefreshAt && now >= weatherState.retryAt)) {
      return fetchWeather(city).catch(function () {
        weatherState.status = "error";
        weatherState.retryAt = now + 60 * 60000;
        return null;
      });
    }
    return Promise.resolve(weatherState.current);
  }

```

</details>

**依据 7 · 源码核查**：[assets/dsh-whale-moe.js:3321-3340](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L3321-L3340)

可选无障碍属性。

<details>
<summary>查看原文（20行）</summary>

```text
  function a11yEnabled() {
    try { return root.localStorage.getItem("whale-moe:a11y") === "1"; } catch (e) { return false; }
  }

  function applyA11y(node) {
    if (!node) return;
    if (a11yEnabled()) {
      node.removeAttribute("aria-hidden");
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
      node.setAttribute("aria-label", selfName() + "，按 Enter 摸头，方向键移动位置");
    } else {
      node.setAttribute("aria-hidden", "true");
      node.removeAttribute("role");
      node.removeAttribute("tabindex");
      node.removeAttribute("aria-label");
    }
  }

  function ensureLiveRegion(rootNode) {
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何判断值得安装，如何验证更可信而安静的状态提示？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

仅对偏好桌宠且可接受页面内容观察的个人用户，先在独立profile保留所有额外能力关闭、toolPose也按隐私需求关闭，检查工作/闲置、历史失败、切换会话与输入焦点；姿态仅作装饰提示，最终状态回原工具结果。安装前核宿主版本/包资源，缺图或boot失败刷新，持续不稳则卸载插件并刷新回原界面，保留需要的本地偏好/养成后再清理本地存储。

成本包含安装与版本契约核对、图片加载/动画/全树观察资源、误提示复核和偏好维护；现金/CPU/GPU/内存/工时均未测，不用MIT或无默认API推总费用0。开启天气增加外部请求，余额另需代理，TTS另需服务与相应成本。package明确部分宿主兼容来自静态契约+作者单测，未在真实Electron复跑，不能把compatible表当本研究验收。

可检验假设是用带会话/运行ID的宿主状态事件替代全局DOM推断，缺信号显示未知而非自动success，并给内容读取单独开关及请求列表；本版已有消抖/历史基线，假设应比较它们之外的收益。与原界面及当前桌宠对照历史错误/短工具/切会话/虚拟列表/中断/离线资源，测错误成功率、漏错、提示延迟、干扰次数、焦点及帧/内存和主观偏好。若事件依赖难维护、原界面已足够或无偏好收益，不增加复杂度，更不把陪伴变成性能提升承诺。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:37-72](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/package.json#L37-L72)

Node/DSH版本与兼容证据层级。

<details>
<summary>查看原文（36行）</summary>

```text
    "dsh": ">=0.1.0-rc.6 <0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "slots"
      ]
    },
    "compatibility": {
      "dshReleases": {
        "0.1.1-rc.2": "compatible",
        "0.1.2-alpha.4": "unknown",
        "0.1.2-alpha.5": "unknown",
        "0.1.2-rc.1": "compatible",
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.2": "compatible"
      },
      "note": "0.2.0-rc.2 已在隔离 profile 上完成安装、加载与 DOM 契约验收。0.2.1-rc.1 / 0.2.1-rc.2 的 compatible 来自对 tag dsh-v0.2.1-rc.2 的静态契约核对加本仓库单元测试，尚未在真实 Electron 桌面端复跑。自 DSH 0.2.1-alpha.4 起，安装门禁优先读顶层 engines.dsh（未声明才回落 peerDependencies）；本包没有 DSH peer，因此必须声明 engines.dsh。说明见 docs/desktop-0.2.1-rc.2-contract.md。"
    }
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "mascot",
    "desktop-pet",
    "whale-girl",
    "cute"
  ],
  "repository": {
    "type": "git",
```

</details>

**依据 2 · 源码核查**：[lib/client.js:43-60](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/lib/client.js#L43-L60)

首次加载失败处理。

<details>
<summary>查看原文（18行）</summary>

```text
    async function boot() {
      if (window[BOOT_FLAG]) return;
      window[BOOT_FLAG] = true;
      try {
        const css = await (await fetch(BASE + "dsh-whale-moe.css")).text();
        injectStyle(css);
        const core = await (await fetch(BASE + "whale-moe-core.js")).text();
        injectScript(core);
        const raw = await (await fetch(BASE + "dsh-whale-moe.js")).text();
        const presenter = raw
          .replace('var ASSET_ROOT = "/assets/generated/";', 'var ASSET_ROOT = "' + BASE + 'generated/";')
          /* 旧版还有一处 ANIM_ROOT 替换，但 presenter 里从来没有这个常量
             （assets/anim/*.webm 未被引用），那处 replace 永不命中，已删除以免误导。 */
          .replace('fetch("/assets/peek-calibration.json")', 'fetch("' + BASE + 'peek-calibration.json")');
        injectScript(presenter);
      } catch (error) {
        console.warn("[dsh-whale-musume] 资源加载失败:", error);
      }
```

</details>

**依据 3 · 源码核查**：[assets/dsh-whale-moe.js:2027-2078](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L2027-L2078)

待对照当前启发式基线。

<details>
<summary>查看原文（52行）</summary>

```text
  function collectSignals() {
    var now = Date.now();
    var view = detectView();
    var rawTool = toolVisible();
    var rawThinking = anyVisible(SIGNAL_BANKS.thinking);
    /* 消抖：信号必须连续存在 300ms 才算数；消失后按场景保持——
       主页 4s、工作台 8s。工作台的工具面板在任务间会短暂空白，
       拉长保持时间让工作姿势在整段工作期间钉住，不再反复切换。 */
    var goneHold = view === "workbench" ? 8000 : 4000;
    var wasRawTool = memory.toolRawSeen;
    if (rawTool) {
      if (!memory.toolSeenAt) memory.toolSeenAt = now;
      memory.toolRawSeen = true;
    } else {
      memory.toolSeenAt = 0;
      /* 只在下沿记录“开始消失的时刻”，中间回来又消失则重新起算 */
      if (wasRawTool || !memory.toolGoneAt) memory.toolGoneAt = now;
      memory.toolRawSeen = false;
    }
    var wasRawThinking = memory.thinkingRawSeen;
    if (rawThinking) {
      if (!memory.thinkingSeenAt) memory.thinkingSeenAt = now;
      memory.thinkingRawSeen = true;
    } else {
      memory.thinkingSeenAt = 0;
      if (wasRawThinking || !memory.thinkingGoneAt) memory.thinkingGoneAt = now;
      memory.thinkingRawSeen = false;
    }
    /* 关键：信号短暂消失又回来时，seenAt 会归零重算。不能因此把
       active 直接打回 false —— 只要没离开满 goneHold，就一直钉在工作态。 */
    var toolActive = rawTool
      ? (now - memory.toolSeenAt >= 300 || (memory.toolGoneAt !== 0 && now - memory.toolGoneAt < goneHold))
      : memory.toolGoneAt !== 0 && now - memory.toolGoneAt < goneHold;
    var thinkingActive = rawThinking
      ? (now - memory.thinkingSeenAt >= 300 || (memory.thinkingGoneAt !== 0 && now - memory.thinkingGoneAt < goneHold))
      : memory.thinkingGoneAt !== 0 && now - memory.thinkingGoneAt < goneHold;
    var errorActive = errorVisible();
    memory.lastErrorActive = errorActive;
    if (view === "workbench" && memory.toolWasActive && !toolActive && !errorActive) memory.lastSuccessAt = now;
    memory.toolWasActive = toolActive;
    var dense = countVisible(SIGNAL_BANKS.code) >= 3;
    /* Workbench uses exactly two moods: busy (tool/thinking/success/failure)
       vs calm (idle rotation). The old "waiting" sweat pose no longer fires. */
    return {
      view: view,
      waiting: false,
      thinking: thinkingActive,
      tool: toolActive,
      successAt: anyVisible(SIGNAL_BANKS.success) ? now : memory.lastSuccessAt,
      error: errorActive,
      curiousAt: memory.viewChangedAt,
      lastInteraction: memory.lastInteractionAt,
```

</details>

**依据 4 · 源码核查**：[assets/dsh-whale-moe.js:3653-3671](https://github.com/Sutera-Diffusus/dsh-whale-musume/blob/9ce976e6bfd95c46b643ef1bc74d70c166a04571/assets/dsh-whale-moe.js#L3653-L3671)

观察范围与资源成本来源。

<details>
<summary>查看原文（19行）</summary>

```text
    function init() {
      safeReconcile();
      observer = new root.MutationObserver(schedule);
      observer.observe(doc.documentElement, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  }

  root.__dshWhaleMoeVersion = "2.5.0";
  root.__dshWhaleMoeDebug = { state: "boot", pose: null, line: "", view: "home" };
  start();
  schedulePreload();
  watchComeback();
})(typeof window === "undefined" ? null : window);
```

</details>

#### 缺口

- 未运行插件/宿主/浏览器、资源故障/性能/用户偏好对照或统一卸载验证
  **影响**：只能评机制和边界，不能确认当前宿主兼容、安静体验、零额外联网或净效益
  **进一步探讨**：在独立profile经单独授权做离线资源与DOM/会话矩阵，逐项查看网络和资源/焦点，主观偏好与正确性分开记录。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
