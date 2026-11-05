# beautiCode DSH Bridge

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3bd3964](https://github.com/starsstreaming/beautiCode/tree/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 102](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=102&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/starsstreaming/beautiCode) [![npm 30d 13,609](https://img.shields.io/static/v1?label=npm+30d&message=13%2C609&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/beauticode-dsh) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/beauticode-dsh)
<!-- END META -->

> **功能**：在 DSH 提供本地媒体背景、主题与渲染桥接。

> **亮点**：[Q01](#research-q01) 想在 DSH 使用图片或视频背景的用户可通过设置面板或背景命令应用素材。固定入口加载 UI、Agent surface 和浏览器注入器，apply 路由更新 generation 并广播给连接客户端。相比外部托盘控制，界面成为宿主内入口。

> **主要限制**：[Q02](#research-q02) apply 使用回环 Host 与 Bearer 令牌校验，常量时间比较后检查载荷。返回 ok 发生在广播后，不能单独证明某个客户端渲染完成；ack 路由另行记录回执，需核对 generation 和客户端。UI 边界与宿主外层身份仍需验证。

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
  - [Q01 · DSH 子插件提供什么？](#detail-section-11)
  - [Q02 · 令牌成功和页面可见成功有何差别？](#detail-section-12)
  - [Q03 · 如何试用与恢复？](#detail-section-13)
  - [Q04 · 如何避免旧回执确认新背景？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要宿主内背景设置的用户。

通过外部控制器或手工 CSS 设置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 背景 | 图片与视频 | 需客户端确认 |
| 主题 | 在宿主管理 | 依赖兼容 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 宿主路由和 UI | 默认界面 |
| 本地媒体 | 必需 | 渲染素材 | 用默认背景 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 测试 profile | 选小图 |
| 验证 | 应用清除和回执 | 检查可读性 |
| 退出 | 清除并禁用 | 核对页面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 媒体资源未知 | 准备素材 | 未测 |
| 持续 | 视频解码开销未知 | 检查资源 | 按素材 |
| 退出 | 恢复成本未知 | 保留主题 | 读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主设置 | 固定入口与广播 | 渲染效果 |
| 回执 | 有独立 ack | 多客户端一致性 |

> **思考**：[Q02](#research-q02) apply 使用回环 Host 与 Bearer 令牌校验，常量时间比较后检查载荷。返回 ok 发生在广播后，不能单独证明某个客户端渲染完成；ack 路由另行记录回执，需核对 generation 和客户端。UI 边界与宿主外层身份仍需验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 想在 DSH 使用图片或视频背景的用户可通过设置面板或背景命令应用素材。固定入口加载 UI、Agent surface 和浏览器注入器，apply 路由更新 generation 并广播给连接客户端。相比外部托盘控制，界面成为宿主内入口。

[Q02](#research-q02) apply 使用回环 Host 与 Bearer 令牌校验，常量时间比较后检查载荷。返回 ok 发生在广播后，不能单独证明某个客户端渲染完成；ack 路由另行记录回执，需核对 generation 和客户端。UI 边界与宿主外层身份仍需验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) apply 使用回环 Host 与 Bearer 令牌校验，常量时间比较后检查载荷。返回 ok 发生在广播后，不能单独证明某个客户端渲染完成；ack 路由另行记录回执，需核对 generation 和客户端。UI 边界与宿主外层身份仍需验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试 DSH profile 中用小图片试导入、应用和清除，确认输入框及代码可读，随后测试短视频和关闭窗口。运行费用来自本机解码，大小与帧率带来的资源开销待测。卸载前清除背景并备份主题配置，读回宿主界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、integrations/deepseek-harness/index.mjs 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：验证令牌、generation 和清除。

**分析版本**

- **仓库**：[starsstreaming/beautiCode](https://github.com/starsstreaming/beautiCode)
- **版本号**：1.0.28（[固定提交 3bd3964](https://github.com/starsstreaming/beautiCode/tree/3bd396478e9ada7ddcb9c883a991c6ca7e59998d)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 按客户端及 generation 对照当前请求和回执，模拟延迟旧 ack 和客户端退出。只有目标客户端当前代确认才报告成功，比较误成功与等待时长，若无改善则调整。

验证令牌、generation 和清除。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 3417 | 3190 | 71 | — |
| .js | source | 7 | 4138 | 3670 | 252 | — |
| .md | source | 1 | 66 | — | — | 1302 |
| .mjs | test | 12 | 5974 | 5370 | 267 | — |
| .mjs | example | 1 | 74 | 67 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/starsstreaming/beautiCode/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 背景插件怎样控制应用和回执？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 子插件提供什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

想在 DSH 使用图片或视频背景的用户可通过设置面板或背景命令应用素材。固定入口加载 UI、Agent surface 和浏览器注入器，apply 路由更新 generation 并广播给连接客户端。相比外部托盘控制，界面成为宿主内入口。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/index.mjs:1-18](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L1-L18)

宿主入口依赖

<details>
<summary>查看原文（18行）</summary>

```text
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerAgentSurfaces } from "./agent.mjs";
import { resolvePluginBaseUrl } from "./host-apply.mjs";
import { createBeauticodeUi } from "./ui-host.mjs";
import { canvasImagePath, iceFrostImagePath, normalizeAtmosphere } from "./presets.mjs";
import { createBrowserInjection, isAllowedLoopbackHost } from "./browser-injection.mjs";

export const name = "beauticode-bridge";
export const inject = ["webServer"];
export const bridgeProtocol = 4;

const here = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const REVISION_PATTERN = /^[a-f0-9]{64}$/;
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/index.mjs:487-517](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L487-L517)

广播状态

<details>
<summary>查看原文（31行）</summary>

```text
      ctx.webServer.register({
        kind: "exact",
        path: "/__beauticode/apply",
        handler: async (req, res) => {
          if (req.method !== "POST") {
            res.writeHead(405).end();
            return;
          }
          if (!(await authorized(req, tokenFile))) {
            sendJson(res, 401, { ok: false, error: "未授权的请求。" });
            return;
          }
          const body = await readJson(req);
          if (!validApplyPayload(body)) {
            sendJson(res, 400, { ok: false, error: "背景载荷无效。" });
            return;
          }
          current = {
            generation: body.generation,
            media: body.media,
            imageUrl: body.media === "clear" ? null : body.imageUrl,
            videoUrl: body.media === "video" ? body.videoUrl : null,
            startAt: body.media === "video" ? body.startAt ?? null : null,
          };
          const atmosphere = normalizeAtmosphere(body.atmosphere);
          if (atmosphere) current.atmosphere = atmosphere;
          if (body.media === "clear") modes.fish = false;
          for (const state of clientStates.values()) state.render = null;
          broadcast({ type: "apply", ...current });
          if (body.media === "clear") broadcast({ type: "mode", ...modes });
          sendJson(res, 200, { ok: true });
```

</details>

**依据 3 · 作者声明**：[README.md:99-106](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L99-L106)

作者说明设置和命令

````text
### 只给 DeepSeek Harness 用

```sh
npx beauticode-dsh
dsh web
```

装好插件后，打开 DSH「设置」，左侧导航会多出「背景」一项，不需要托盘。也可以在对话里输入 `/bg <文件路径>`、`/bg-theme <名称>`、`/bg-clear`，或直接让 AI 帮你换背景。
````

#### 缺口

- 未运行客户端渲染
  **影响**：可读性及真实回执未知
  **进一步探讨**：合成背景验证多个窗口

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 令牌成功和页面可见成功有何差别？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

apply 使用回环 Host 与 Bearer 令牌校验，常量时间比较后检查载荷。返回 ok 发生在广播后，不能单独证明某个客户端渲染完成；ack 路由另行记录回执，需核对 generation 和客户端。UI 边界与宿主外层身份仍需验证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/index.mjs:91-107](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L91-L107)

令牌检查

<details>
<summary>查看原文（17行）</summary>

```text
async function authorized(req, tokenFile) {
  if (!isAllowedLoopbackHost(req?.headers?.host)) return false;
  const match = /^Bearer\s+(.+)$/i.exec(String(req.headers.authorization || "").trim());
  if (!match) return false;
  let expected;
  try {
    expected = (await fs.readFile(tokenFile, "utf8")).trim();
  } catch {
    return false;
  }
  if (!TOKEN_PATTERN.test(expected)) return false;
  const actualBuffer = Buffer.from(match[1], "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/index.mjs:487-517](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L487-L517)

请求接受和广播

<details>
<summary>查看原文（31行）</summary>

```text
      ctx.webServer.register({
        kind: "exact",
        path: "/__beauticode/apply",
        handler: async (req, res) => {
          if (req.method !== "POST") {
            res.writeHead(405).end();
            return;
          }
          if (!(await authorized(req, tokenFile))) {
            sendJson(res, 401, { ok: false, error: "未授权的请求。" });
            return;
          }
          const body = await readJson(req);
          if (!validApplyPayload(body)) {
            sendJson(res, 400, { ok: false, error: "背景载荷无效。" });
            return;
          }
          current = {
            generation: body.generation,
            media: body.media,
            imageUrl: body.media === "clear" ? null : body.imageUrl,
            videoUrl: body.media === "video" ? body.videoUrl : null,
            startAt: body.media === "video" ? body.startAt ?? null : null,
          };
          const atmosphere = normalizeAtmosphere(body.atmosphere);
          if (atmosphere) current.atmosphere = atmosphere;
          if (body.media === "clear") modes.fish = false;
          for (const state of clientStates.values()) state.render = null;
          broadcast({ type: "apply", ...current });
          if (body.media === "clear") broadcast({ type: "mode", ...modes });
          sendJson(res, 200, { ok: true });
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/index.mjs:567-586](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L567-L586)

独立回执入口

<details>
<summary>查看原文（20行）</summary>

```text
      // Same-origin render/mode receipt from the injected browser client —
      // deliberately NOT gated by authorized()/tokenFile like /apply, /mode,
      // /status. Guarded by isSameOrigin() plus binding to a live SSE
      // session for the given clientId; clientId is a public correlation
      // id, not a secret.
      ctx.webServer.register({
        kind: "exact",
        path: "/__beauticode/ack",
        handler: async (req, res) => {
          if (req.method !== "POST" || !isSameOrigin(req)) {
            res.writeHead(req.method === "POST" ? 403 : 405).end();
            return;
          }
          const body = await readJson(req);
          const state = clientStates.get(body.clientId);
          if (!clients.has(body.clientId) || !state) {
            sendJson(res, 400, { ok: false, error: "渲染回执无效。" });
            return;
          }
          if (body.kind === "render") {
```

</details>

#### 缺口

- 未测过期回执和断开的客户端
  **影响**：无法保证视觉成功
  **进一步探讨**：模拟丢 ack、旧 generation 和多窗口

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在测试 DSH profile 中用小图片试导入、应用和清除，确认输入框及代码可读，随后测试短视频和关闭窗口。运行费用来自本机解码，大小与帧率带来的资源开销待测。卸载前清除背景并备份主题配置，读回宿主界面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:99-116](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L99-L116)

DSH 和管理入口

<details>
<summary>查看原文（18行）</summary>

````text
### 只给 DeepSeek Harness 用

```sh
npx beauticode-dsh
dsh web
```

装好插件后，打开 DSH「设置」，左侧导航会多出「背景」一项，不需要托盘。也可以在对话里输入 `/bg <文件路径>`、`/bg-theme <名称>`、`/bg-clear`，或直接让 AI 帮你换背景。

### 检查与单独管理

```sh
beauticode-desktop all status
beauticode-desktop all health
beauticode-desktop <dsh|codex|workbuddy|cursor|doubao> <install|status|uninstall|health>
```

`status` / `health` 为只读；`install` 会跳过未安装的客户端；单独卸载用宿主命令，例如 `beauticode-desktop cursor uninstall`。
````

</details>

**依据 2 · 作者声明**：[README.md:118-127](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L118-L127)

作者声明安全及媒体选择

<details>
<summary>查看原文（10行）</summary>

```text
## 安全边界

* 所有注入只走 `127.0.0.1` 本机调试端口或官方插件接口，不改客户端二进制
* 应用前校验、应用后回读验证，失败自动回滚，不会静默画坏页面
* 守护只对启动不足 10 秒且已确认身份的进程做一次受控重启，不会无限重启、不碰无关进程
* 导入媒体只读你主动选择的本地文件；控制通道使用随机令牌

## 关于本地媒体

beautiCode 只读取你主动选择的本地图片和视频。项目不提供番剧、电影或其他受版权保护的内容。请只导入你拥有或有权使用的媒体文件，并遵守当地法律与内容版权要求。
```

</details>

#### 缺口

- 未试装、测资源和卸载
  **影响**：平台兼容与清理未知
  **进一步探讨**：先拍摄合成页面对照并记录 CPU

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何避免旧回执确认新背景？

**研究主题**：新假设与验证

#### 完整回答

按客户端及 generation 对照当前请求和回执，模拟延迟旧 ack 和客户端退出。只有目标客户端当前代确认才报告成功，比较误成功与等待时长，若无改善则调整。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/index.mjs:504-517](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L504-L517)

当前代广播

<details>
<summary>查看原文（14行）</summary>

```text
          current = {
            generation: body.generation,
            media: body.media,
            imageUrl: body.media === "clear" ? null : body.imageUrl,
            videoUrl: body.media === "video" ? body.videoUrl : null,
            startAt: body.media === "video" ? body.startAt ?? null : null,
          };
          const atmosphere = normalizeAtmosphere(body.atmosphere);
          if (atmosphere) current.atmosphere = atmosphere;
          if (body.media === "clear") modes.fish = false;
          for (const state of clientStates.values()) state.render = null;
          broadcast({ type: "apply", ...current });
          if (body.media === "clear") broadcast({ type: "mode", ...modes });
          sendJson(res, 200, { ok: true });
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/index.mjs:567-586](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/integrations/deepseek-harness/index.mjs#L567-L586)

回执入口

<details>
<summary>查看原文（20行）</summary>

```text
      // Same-origin render/mode receipt from the injected browser client —
      // deliberately NOT gated by authorized()/tokenFile like /apply, /mode,
      // /status. Guarded by isSameOrigin() plus binding to a live SSE
      // session for the given clientId; clientId is a public correlation
      // id, not a secret.
      ctx.webServer.register({
        kind: "exact",
        path: "/__beauticode/ack",
        handler: async (req, res) => {
          if (req.method !== "POST" || !isSameOrigin(req)) {
            res.writeHead(req.method === "POST" ? 403 : 405).end();
            return;
          }
          const body = await readJson(req);
          const state = clientStates.get(body.clientId);
          if (!clients.has(body.clientId) || !state) {
            sendJson(res, 400, { ok: false, error: "渲染回执无效。" });
            return;
          }
          if (body.kind === "render") {
```

</details>

#### 缺口

- 上层已有等价关联程度未知
  **影响**：收益待核对
  **进一步探讨**：先走查控制器再做延迟回执

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
