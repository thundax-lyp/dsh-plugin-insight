# dsh-boo550wt-animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[edc756f](https://github.com/456erddgr/dsh-boo550wt-animation/tree/edc756f37fa59ba10818a0f9aee489b7241e8005)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation)
<!-- END META -->

> **实现功能**：为DSH提供可配置开机遮罩，可播放视频、图片、网页和内置游戏，并支持预览与跳过。

> **核心亮点**：通过插件扩展点组织可预览、可跳过启动内容，不修改安装包；3D底座与资产继承上游。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：同源HTML配allow-scripts/allow-same-origin且写路由未见局部信任校验，装饰扩大宿主能力；资源与启动代价未测。见 [Q03](#research-q03)。

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
  - [Q01 · 核心价值及归属是什么？](#detail-section-11)
  - [Q02 · 配置、遮罩和媒体怎样实现？](#detail-section-12)
  - [Q03 · 信任与启动成本有哪些边界？](#detail-section-13)
  - [Q04 · 可验证什么改进，当前如何采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望个性化启动的用户，以可跳过且不妨碍应用就绪为交付；主观偏好非生产效率。

无动画、静态图或系统启动内容是简单替代；未证明长游戏/3D对生产任务有价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 启动遮罩 | 个性化展示 | guard/跳过需真实验收 |
| 自定义媒体 | 视频/图像/网页播放 | HTML信任面不同，不能当纯素材 |
| 上传/预览 | 管理素材并预看 | 来源控制与目录需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/index-inject/客户端设置 | 启动必需 | 早期遮罩和配置 | 兼容未验收可能挡界面 |
| 可信素材与可写目录 | 自定义必需 | 上传/播放/设置 | 不可信HTML不宜加载 |
| 浏览器媒体/WebGL/自动播放 | 对应模式必需 | 视频/3D/音频 | 需静音回退与guard |
| 显式来源/认证边界 | 暴露路由必需 | 控制配置/文件访问 | 未验收不远程暴露 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户选择可信短素材并预览 | 不保存也可检视退出 |
| 2 | 用户启动测试Esc/按钮/超时 | 应用可及时操作 |
| 3 | 用户禁用并检查配置/上传目录 | 无残留遮罩，异常恢复默认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包素材、磁盘与GPU资源未知 | 可信素材和权限配置 | 未下载/运行全部vendor |
| 持续使用 | 启动播放/纹理/音频 | 等待、跳过与维护 | 冷启动/内存未测 |
| 失败恢复 | 素材清理/重启资源未知 | guard/禁用/路径核对 | 不保证profile全隔离 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个性化 | 四模式与预览路径 | 用户愿意持续使用 |
| 退出 | Esc/guard/finish存在 | 真实全路径可操作 |
| 内容隔离 | iframe有sandbox属性 | 同源脚本边界与宿主控制 |

> **思考**：同源HTML配allow-scripts/allow-same-origin且写路由未见局部信任校验，装饰扩大宿主能力；资源与启动代价未测。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：通过插件扩展点组织可预览、可跳过启动内容，不修改安装包；3D底座与资产继承上游。见 [Q01](#research-q01)、[Q02](#research-q02)。

通过插件扩展点组织可预览、可跳过启动内容，不修改安装包；3D底座与资产继承上游。见 [Q01](#research-q01)、[Q02](#research-q02)。

Range与显式退出清理可借鉴；上传原子发布/去重来自已有设计。需把不可信HTML与宿主分源、写路由显式信任校验；大vendor不应代表原创工程量。

<a id="detail-section-5"></a>

### 1.4 主要限制

同源HTML配allow-scripts/allow-same-origin且写路由未见局部信任校验，装饰扩大宿主能力；资源与启动代价未测。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；只在可信素材隔离环境先验收路由、HTML、跳过与禁用，不需要个性化者不启用。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

有界源码支持遮罩/媒体/上传接线；3D资产、宿主信任与启动性能未验证；最小权限内容为假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/config.js、lib/inject.js、lib/media.js、lib/upload.js、lib/games.js、THIRD-PARTY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone后按固定提交git show抽读9个文本blob；BOUNDED-SNAPSHOT与inventory仅已检查子集，不是完整LOC；未读取vendor媒体/全部client，不运行目标代码或播放。
- 下一步：隔离宿主核未认证路由、HTML同源能力、媒体失败、首屏/跳过/guard/禁用；记录CPU/GPU/内存与用户继续意愿。

**分析版本**

- **仓库**：[456erddgr/dsh-boo550wt-animation](https://github.com/456erddgr/dsh-boo550wt-animation)
- **版本号**：1.7.2（[固定提交 edc756f](https://github.com/456erddgr/dsh-boo550wt-animation/tree/edc756f37fa59ba10818a0f9aee489b7241e8005)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的静态默认/独立来源HTML与显式路由信任边界，可能保留个性化并缩小权限；隔离实验测兼容与退出。见 [Q04](#research-q04)。

隔离宿主核未认证路由、HTML同源能力、媒体失败、首屏/跳过/guard/禁用；记录CPU/GPU/内存与用户继续意愿。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：3359ccbf29bf0dccd6822e3bae0922829a8a9bd3812516d28e20a661d2d3adf7。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 2679 | 2084 | 403 | — |
| .md | source | 2 | 278 | — | — | 4639 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+created%3A2026-09-26T03%3A38%3A09.834Z..2026-10-26T03%3A38%3A09.834Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A38%3A09.834Z..2026-10-26T03%3A38%3A09.834Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可跳过开机内容是否提供足够个性化价值，且不把启动装饰扩成不透明的宿主脚本/文件入口？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 核心价值及归属是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合主动希望个性化启动体验、愿意增加装饰等待的DSH用户。合格结果是内容按配置展示且可即时跳过、异常不阻挡应用；它不提高模型质量，也不能把遮罩时间当DSH真实启动进度。相比修改应用安装包，插件通过宿主index-inject与设置页接线，支持视频/图像/网页/游戏，属于展示集成。3D引擎、相机、模型与时间轴主要继承earth-migration/three.js，第三方声明明确本包增量为开机页与中文讲解/通知，不将大型vendor资产算原创。个性化需求没有独立用户证据，允许保留为主观偏好。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/README.md#L1-L15)

作者四种模式和启动行为

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-boo550wt-animation

给 **DeepSeek Harness** 加一段开机动画：打开 DSH 时全屏展示一段内容，播完（或者按 `Esc`）才进入界面。

支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
| `video` | 视频（默认：自带的 550W 风格动画，16.6 秒） | 播完自动进入 |
| `image` | 图片 | 显示 `durationMs` 后进入 |
| `web` | 网页（URL 或本地 HTML 文件） | 页面发完成消息，或超时 |
| `game` | 内置内容（两部流浪地球 3D 讲解 + 五款小游戏） | 通关 / 讲完自动进入 |

素材来源有两条路：**直接上传**（设置面板里点选或拖入文件，存进插件自己的目录），或**填绝对路径**指向你已有的文件。视频默认**带声音播放**。

```

</details>

**依据 2 · 源码核查**：[THIRD-PARTY.md:6-24](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/THIRD-PARTY.md#L6-L24)

上游归属与本包增量

<details>
<summary>查看原文（19行）</summary>

```text
## The Earth Migration Project

- Source: https://github.com/oxomkbk/earth-migration
- Licence: MIT (`vendor/earth-migration/LICENSE`)
- Vendored at: `vendor/earth-migration/`
- Used for both 3D boot scenes:

  | 文件 | 用在哪 |
  | --- | --- |
  | `index.html` / `beyond.html` / `ignite.html` | 上游原样保留，供离线核对 |
  | `beyond-boot.html` | 本包自己的「流浪地球 2.0」开机讲解页（第二部） |
  | `js/app.js`、`js/fx/*`、`css/app.css` | 第一部（行星发动机计划） |
  | `js/beyond/*`、`css/beyond.css` | 第二部（从发动机到银河） |
  | `assets/` | 两部共用的贴图、模型、星空 |

  上游的引擎、相机、着色器、模型与章节时间轴都没有改动，第二部的状态栏与
  事件日志也保持原样；本包只新增了两个开机页（`ignite.html` 的中文讲解层、
  `beyond-boot.html`），负责自动播放、中文解说、播完通知宿主页。自由查看的
  入口仍是上游自己的 EXPLORE 按钮与 F 键。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:21-30](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/index.js#L21-L30)

启动前遮罩注入方式

<details>
<summary>查看原文（10行）</summary>

```text
 * Two injection mechanisms:
 *
 *   1. `webserver/index-inject` rows (one `style`, one body `script`) that
 *      mount the overlay. The Desktop shell renders these rows in the page
 *      before `__DSH_BOOT_READY__` settles, i.e. before the client module
 *      loader starts, so the overlay is already up when the first application
 *      frame is painted. The script fetches /config at startup so the latest
 *      user settings apply on every boot.
 *   2. A client module (`dsh.client`) that adds a "开机动画" section to the
 *      Settings panel and edits the same /config endpoint.
```

</details>

#### 缺口

- 没有用户偏好或重复使用数据
  **影响**：无法判断装饰价值是否抵消等待
  **进一步探讨**：比较无动画/短视频/长内容的跳过率与用户继续意愿

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置、遮罩和媒体怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host在/boot-animation提供配置、媒体、上传与preview路由，启动页注入样式和body脚本；脚本再读最新配置，宿主在遮罩下面正常加载。视频以媒体事件结束，图像/网页有时限，Esc/按钮与guard调用finish，清监听和计时后淡出。serveFile支持Range，上传流写临时文件、hash去重并rename发布，避免每次重复素材堆积。可借鉴的是独立preview不先保存、明确跳过和媒体Range；不过本轮仅9个文本blob有界快照，未读/下载vendor媒体与全部client，不确认3D运行和资产完整性，统计是抽读子集LOC。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:92-107](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/index.js#L92-L107)

配置写入路径

<details>
<summary>查看原文（16行）</summary>

```text
      if (req.method === "GET" || req.method === "HEAD") {
        const settings = await loadSettings();
        sendJson(res, 200, publicSettings(settings));
        return;
      }
      if (req.method === "POST" || req.method === "PUT") {
        let raw;
        try {
          raw = await readJson(req);
        } catch {
          sendJson(res, 400, { error: "invalid JSON body" });
          return;
        }
        const next = normalizeConfig({ ...defaults, ...raw });
        const saved = await saveSettings(next);
        sendJson(res, saved ? 200 : 500, saved ? publicSettings(next) : { error: "could not save settings" });
```

</details>

**依据 2 · 源码核查**：[lib/inject.js:187-192](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/inject.js#L187-L192)

Esc退出

```text
  function onKeyDown(event) {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      finish();
    }
```

**依据 3 · 源码核查**：[lib/inject.js:222-240](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/inject.js#L222-L240)

finish清理与淡出

<details>
<summary>查看原文（19行）</summary>

```text
  function finish() {
    if (finished) return;
    finished = true;
    if (guard !== null) clearTimeout(guard);
    if (hintTimer !== null) clearTimeout(hintTimer);
    guard = null;
    hintTimer = null;
    disarmGesture();
    window.removeEventListener("keydown", onKeyDown, true);
    if (media !== null) {
      media.removeEventListener("ended", finish);
      media.removeEventListener("loadedmetadata", onMetadata);
      media.removeEventListener("error", onMediaError);
      if (typeof media.pause === "function") { try { media.pause(); } catch (ignored) { /* ignore */ } }
    }
    window.removeEventListener("message", onGameMessage);
    layer.setAttribute("data-dsh-boo550wt-animation", "done");
    layer.classList.add("dsh-boo550wt-animation-out");
    fade = setTimeout(unmount, CONFIG.fadeMs);
```

</details>

**依据 4 · 源码核查**：[lib/media.js:18-38](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/media.js#L18-L38)

Range解析

<details>
<summary>查看原文（21行）</summary>

```text
export function parseRange(header, size) {
  if (typeof header !== "string" || header.length === 0) return { kind: "full" };
  const match = /^bytes=(.*)$/i.exec(header.trim());
  if (match === null) return { kind: "unsatisfiable" };
  const spec = match[1].split(",")[0].trim();
  const parts = /^(\d*)-(\d*)$/.exec(spec);
  if (parts === null) return { kind: "unsatisfiable" };
  const rawStart = parts[1];
  const rawEnd = parts[2];
  if (rawStart === "" && rawEnd === "") return { kind: "unsatisfiable" };
  if (rawStart === "") {
    const suffix = Number(rawEnd);
    if (!Number.isFinite(suffix) || suffix <= 0) return { kind: "unsatisfiable" };
    const start = Math.max(0, size - suffix);
    return { kind: "range", start, end: size - 1 };
  }
  const start = Number(rawStart);
  if (!Number.isFinite(start) || start >= size) return { kind: "unsatisfiable" };
  const end = rawEnd === "" ? size - 1 : Math.min(Number(rawEnd), size - 1);
  if (!Number.isFinite(end) || end < start) return { kind: "unsatisfiable" };
  return { kind: "range", start, end };
```

</details>

**依据 5 · 源码核查**：[lib/upload.js:4-15](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/upload.js#L4-L15)

上传临时文件与去重机制声明

<details>
<summary>查看原文（12行）</summary>

```text
 * Users can upload their own video / image / html for the boot animation from
 * the Settings panel. Uploads land in a dedicated directory next to the
 * settings file, with a `.meta.json` ledger (title + sha256) so identical
 * re-uploads return the existing entry instead of piling up copies.
 *
 * Disciplines (borrowed from dsh-plugin-wallpaper-engine):
 *   - Stream to a `.tmp` file while hashing; rename is the atomic publish.
 *   - Backpressure: pause the request when the write buffer fills.
 *   - On client abort / error / timeout, destroy the stream and clean the
 *     `.tmp` — never leave an open handle or a partial file behind.
 *   - The meta ledger is written atomically and read through a non-throwing
 *     reader; a broken or missing ledger degrades to {}.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 信任与启动成本有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

关键质疑是装饰功能扩大了宿主信任面。已抽读handler直接处理配置写入、上传和删除，入口未见统一connection信任校验；是否由外层宿主补齐本轮未验证。上传HTML按同源text/html提供，web/game iframe同时allow-scripts与allow-same-origin，还允许表单/弹窗，因此不能将sandbox属性当不可信HTML的强隔离。用户需只使用可信本地内容；不把此静态风险写成已利用漏洞。资源上，默认带声音且遮罩等待内容；长3D/GPU/资产下载、上传最高512MiB均可能增加负担，实际启动/内存未知。configPath无DSH_HOME时落homedir，uploadDir却回process.cwd，不能承诺所有数据都profile隔离。首次素材选择和权限检查、持续启动等待及升级、失败清理/恢复都需人工，金额与耗时未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:92-107](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/index.js#L92-L107)

handler配置写入未见局部鉴权

<details>
<summary>查看原文（16行）</summary>

```text
      if (req.method === "GET" || req.method === "HEAD") {
        const settings = await loadSettings();
        sendJson(res, 200, publicSettings(settings));
        return;
      }
      if (req.method === "POST" || req.method === "PUT") {
        let raw;
        try {
          raw = await readJson(req);
        } catch {
          sendJson(res, 400, { error: "invalid JSON body" });
          return;
        }
        const next = normalizeConfig({ ...defaults, ...raw });
        const saved = await saveSettings(next);
        sendJson(res, saved ? 200 : 500, saved ? publicSettings(next) : { error: "could not save settings" });
```

</details>

**依据 2 · 源码核查**：[lib/index.js:155-189](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/index.js#L155-L189)

上传/删除与HTML同源服务

<details>
<summary>查看原文（35行）</summary>

```text
    if (path === `${BASE}/uploads`) {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { allow: "GET, HEAD", "cache-control": "no-store" });
        res.end();
        return;
      }
      sendJson(res, 200, { uploads: listUploads() });
      return;
    }

    if (path === `${BASE}/upload`) {
      handleUpload(req, res);
      return;
    }

    if (path === `${BASE}/upload-remove`) {
      handleRemove(req, res);
      return;
    }

    if (path.startsWith(`${BASE}/uploads/`)) {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { allow: "GET, HEAD", "cache-control": "no-store" });
        res.end();
        return;
      }
      const name = decodeURIComponent(path.slice(`${BASE}/uploads/`.length));
      const file = resolveUpload(name);
      if (file === null) {
        res.writeHead(404, { "cache-control": "no-store" });
        res.end();
        return;
      }
      const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
      await serveFile(file, req, res, ext === "html" ? "text/html; charset=utf-8" : undefined);
```

</details>

**依据 3 · 源码核查**：[lib/inject.js:368-385](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/inject.js#L368-L385)

iframe权限组合

<details>
<summary>查看原文（18行）</summary>

```text
    } else if (mode === "web") {
      var frame = doc.createElement("iframe");
      frame.className = "dsh-boo550wt-animation-frame";
      frame.setAttribute("allow", "autoplay; fullscreen");
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
      frame.src = cfg.url;
      layer.appendChild(frame);
      media = frame;
      window.addEventListener("message", onGameMessage);
      // Key events inside the frame never reach this window, so bring the
      // focus back and accept an Esc relayed by the frame's own script.
      releaseFrameFocus(frame);
      armGuard(cfg.durationMs);
    } else if (mode === "game") {
      var frame2 = doc.createElement("iframe");
      frame2.className = "dsh-boo550wt-animation-frame";
      frame2.setAttribute("allow", "autoplay; fullscreen");
      frame2.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
```

</details>

**依据 4 · 源码核查**：[lib/config.js:29-32](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/config.js#L29-L32)

配置路径回落

```text
/** Where the user-editable settings file lives. */
export function configPath() {
  const home = process.env.DSH_HOME?.trim() || homedir();
  return join(home, "boot-animation-settings.json");
```

**依据 5 · 源码核查**：[lib/upload.js:31-33](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/upload.js#L31-L33)

上传限额

```text
export const UPLOAD_MAX_BYTES = 512 * 1024 * 1024;
const CONTROL_MAX_BYTES = 1024 * 1024;
const BODY_IDLE_MS = 60_000;
```

**依据 6 · 源码核查**：[lib/upload.js:55-60](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/upload.js#L55-L60)

上传目录回落

```text
/** Directory holding uploaded assets; created on demand. */
export function uploadDir() {
  const base = process.env.DSH_HOME?.trim() || process.cwd();
  const dir = join(base, "boot-animation-uploads");
  mkdirSync(dir, { recursive: true });
  return dir;
```

#### 缺口

- 当前宿主外层来源控制、HTML能力和冷启动性能未验收
  **影响**：不支持远程暴露或不可信内容采用
  **进一步探讨**：隔离宿主核对未认证访问、可信/不可信内容与首屏跳过时延

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可验证什么改进，当前如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是将静态视频/图像设为最小权限默认，把HTML放独立来源且去allow-same-origin，并在路由显式调用宿主信任校验，能保留个性化而减少不必要能力。依据Q03的同源脚本和写接口，代价是部分自定义页面集成功能不再可用。最小实验在隔离宿主比较原方案/最小权限方案的素材兼容、首屏到可操作时长、跳过成功与跨源访问，未取得用户偏好前不扩展更多内容。若安全边界无法实现或用户只要无动画更方便，就停止该方向。当前建议观察，先验收路由与HTML信任、禁用恢复和启动guard；偏好不足者直接不启用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/inject.js:368-393](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/inject.js#L368-L393)

web/game权限与guard接点

<details>
<summary>查看原文（26行）</summary>

```text
    } else if (mode === "web") {
      var frame = doc.createElement("iframe");
      frame.className = "dsh-boo550wt-animation-frame";
      frame.setAttribute("allow", "autoplay; fullscreen");
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
      frame.src = cfg.url;
      layer.appendChild(frame);
      media = frame;
      window.addEventListener("message", onGameMessage);
      // Key events inside the frame never reach this window, so bring the
      // focus back and accept an Esc relayed by the frame's own script.
      releaseFrameFocus(frame);
      armGuard(cfg.durationMs);
    } else if (mode === "game") {
      var frame2 = doc.createElement("iframe");
      frame2.className = "dsh-boo550wt-animation-frame";
      frame2.setAttribute("allow", "autoplay; fullscreen");
      frame2.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
      frame2.src = cfg.url;
      layer.appendChild(frame2);
      media = frame2;
      window.addEventListener("message", onGameMessage);
      releaseFrameFocus(frame2);
      // cfg.maxSeconds already carries the Host's ceiling for this content: the
      // longer of the user's setting and the film's own length.
      armGuard(cfg.maxSeconds * 1000);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:92-107](https://github.com/456erddgr/dsh-boo550wt-animation/blob/edc756f37fa59ba10818a0f9aee489b7241e8005/lib/index.js#L92-L107)

路由写入口

<details>
<summary>查看原文（16行）</summary>

```text
      if (req.method === "GET" || req.method === "HEAD") {
        const settings = await loadSettings();
        sendJson(res, 200, publicSettings(settings));
        return;
      }
      if (req.method === "POST" || req.method === "PUT") {
        let raw;
        try {
          raw = await readJson(req);
        } catch {
          sendJson(res, 400, { error: "invalid JSON body" });
          return;
        }
        const next = normalizeConfig({ ...defaults, ...raw });
        const saved = await saveSettings(next);
        sendJson(res, saved ? 200 : 500, saved ? publicSettings(next) : { error: "could not save settings" });
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
