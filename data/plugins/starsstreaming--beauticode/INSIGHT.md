# beautiCode

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3bd3964](https://github.com/starsstreaming/beautiCode/tree/3bd396478e9ada7ddcb9c883a991c6ca7e59998d)

<!-- BEGIN META -->
[![GitHub ★ 102](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=102&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/starsstreaming/beautiCode)
<!-- END META -->

> **功能**：跨 AI 客户端管理本地图片、视频和主题背景。

> **亮点**：[Q01](#research-q01) 有多个 AI 桌面客户端的用户可从统一管理入口为各客户端应用本地媒体。核心事务持有 store、媒体与 HostApplier，串行执行 snapshot、写入、应用及回读；DSH 插件是其中一种适配。相比逐客户端手配 CSS，这套核心复用素材和事务。

> **主要限制**：[Q02](#research-q02) 核心在回读未通过时触发回滚，catch 也尝试恢复；真实页面与磁盘状态依赖适配器实现和宿主可达。媒体通过携带令牌的 URL 提供，URL 日志和客户端进程需要保护。作者称通过 CDP 注入，因此仅核心事务不能证明所有客户端安全与识别正确。

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
  - [Q01 · 根项目如何管理跨客户端皮肤？](#detail-section-11)
  - [Q02 · 回滚和本机控制有什么边界？](#detail-section-12)
  - [Q03 · 如何判断日常收益？](#detail-section-13)
  - [Q04 · 如何减少宿主掉线后的误恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用多个兼容 AI 桌面客户端的用户。

各客户端独立设置或手工注入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 媒体 | 多端主题 | 依赖适配器 |
| 事务 | 应用及回读 | 宿主需在线 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容客户端 | 必需 | 接受背景 | 保留默认 |
| 本地媒体 | 必需 | 素材 | 小图试验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 选单客户端 | 备份配置 |
| 验证 | 小图及失败恢复 | 对照页面 |
| 退出 | 清除和停控制器 | 检查进程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 资源未知 | 配置单适配器 | 未测 |
| 持续 | 解码和升级成本未知 | 维护兼容 | 按平台 |
| 退出 | 清理时间未知 | 读回界面 | 验证恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一管理 | 事务接口 | 多端效果 |
| 恢复 | 源码回滚 | 真实页面一致性 |

> **思考**：[Q02](#research-q02) 核心在回读未通过时触发回滚，catch 也尝试恢复；真实页面与磁盘状态依赖适配器实现和宿主可达。媒体通过携带令牌的 URL 提供，URL 日志和客户端进程需要保护。作者称通过 CDP 注入，因此仅核心事务不能证明所有客户端安全与识别正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 有多个 AI 桌面客户端的用户可从统一管理入口为各客户端应用本地媒体。核心事务持有 store、媒体与 HostApplier，串行执行 snapshot、写入、应用及回读；DSH 插件是其中一种适配。相比逐客户端手配 CSS，这套核心复用素材和事务。

[Q02](#research-q02) 核心在回读未通过时触发回滚，catch 也尝试恢复；真实页面与磁盘状态依赖适配器实现和宿主可达。媒体通过携带令牌的 URL 提供，URL 日志和客户端进程需要保护。作者称通过 CDP 注入，因此仅核心事务不能证明所有客户端安全与识别正确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 核心在回读未通过时触发回滚，catch 也尝试恢复；真实页面与磁盘状态依赖适配器实现和宿主可达。媒体通过携带令牌的 URL 提供，URL 日志和客户端进程需要保护。作者称通过 CDP 注入，因此仅核心事务不能证明所有客户端安全与识别正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 选固定发行物与一个兼容客户端，在独立配置下先使用小图，记录改前改后输入和代码可读性，再比较视频的资源开销。根项目还依赖各客户端调试接口，升级需重新核对。退出前清除主题、停控制器并检查相关进程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/core/src/apply-transaction.ts、packages/core/src/media-server.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：核对媒体令牌、断连和回滚。

**分析版本**

- **仓库**：[starsstreaming/beautiCode](https://github.com/starsstreaming/beautiCode)
- **版本号**：1.0.1（[固定提交 3bd3964](https://github.com/starsstreaming/beautiCode/tree/3bd396478e9ada7ddcb9c883a991c6ca7e59998d)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照当前回滚结果，试验将磁盘恢复和页面确认分别标记，并在宿主重连后再次检查。用应用时掉线、验证时掉线和成功场景比较误报，若无改善则撤回。

核对媒体令牌、断连和回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 3282 | — | — | 42119 |
| .mjs | source | 43 | 10701 | 9707 | 457 | — |
| .js | source | 25 | 7941 | 7133 | 525 | — |
| .mjs | test | 27 | 7664 | 6922 | 288 | — |
| .mjs | example | 1 | 74 | 67 | 5 | — |
| .ts | source | 71 | 16195 | 13966 | 1379 | — |
| .js | test | 45 | 7741 | 7108 | 282 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/starsstreaming/beautiCode/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨客户端背景应用如何验证并恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目如何管理跨客户端皮肤？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

有多个 AI 桌面客户端的用户可从统一管理入口为各客户端应用本地媒体。核心事务持有 store、媒体与 HostApplier，串行执行 snapshot、写入、应用及回读；DSH 插件是其中一种适配。相比逐客户端手配 CSS，这套核心复用素材和事务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-49](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L27-L49)

作者定义根工具和适配表

<details>
<summary>查看原文（23行）</summary>

```text
## 它是什么？

beautiCode 是一个本地动态皮肤工具：把图片、视频或带氛围特效的壁纸，注入到你正在使用的 AI 编程客户端界面背后。代码、输入框和按钮照常工作——它不是把窗口变成播放器，而是让画面待在对话和工作区后面。

皮肤有两个来源：

* **皮肤中心**：在线目录，浏览、搜索、一键安装经过审核的皮肤，下载到本机后自动应用
* **本地导入**：从系统文件夹里挑你自己的图片或视频（JPG / JPEG / PNG / WebP / AVIF，MP4 / MOV）

导入的内容都可以存成命名主题，随时切换；视频主题会记住上次播放进度。


## 支持的客户端

| 客户端 | 接入方式 | 平台 | 状态 |
|---|---|---|---|
| **DeepSeek Harness** | Cordis 插件，设置页内嵌「背景」面板 | Windows | ✅ 推荐，无需托盘 |
| **Codex Desktop** | 托盘 or 本机 CDP 注入 | Windows | ✅ 支持 |
| **WorkBuddy** | 官方 CDP 开关 + 守护注入 | Windows / macOS | ✅ 支持 |
| **Cursor** | 桌面 CDP 守护 | Windows | ✅ 支持（基线 3.18.9） |
| **豆包** | 桌面 CDP 守护 | Windows | ✅ 支持（基线 2.29.12） |

beautiCode 不会修改任何客户端的安装文件，也不替厂商发布补丁——DSH 走官方插件接口，桌面客户端走 `127.0.0.1` 本机调试端口注入，可随时干净卸载。
```

</details>

**依据 2 · 源码核查**：[package.json:1-29](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/package.json#L1-L29)

根 workspace 与 CLI、托盘及适配器主入口

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "beauticode",
  "version": "1.0.1",
  "private": true,
  "type": "module",
  "description": "Local image/video backgrounds for DeepSeek Harness (also Codex Desktop). Unofficial.",
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "npm run build -w @beauticode/core && npm run build -w @beauticode/adapter-codex && npm run build -w @beauticode/adapter-dsh && npm run build -w @beauticode/adapter-workbuddy && npm run build -w @beauticode/adapter-desktop-cdp && npm run build -w @beauticode/adapter-cursor && npm run build -w @beauticode/adapter-doubao",
    "test": "npm run test -w @beauticode/core && npm run test -w @beauticode/adapter-codex && npm run test -w @beauticode/adapter-dsh && npm run test -w @beauticode/adapter-workbuddy && npm run test -w @beauticode/adapter-desktop-cdp && npm run test -w @beauticode/adapter-cursor && npm run test -w @beauticode/adapter-doubao && npm run test -w beauticode-desktop && npm run test -w beauticode-linux",
    "typecheck": "npm run build -w @beauticode/core && npm run typecheck -w @beauticode/adapter-codex && npm run typecheck -w @beauticode/adapter-dsh && npm run typecheck -w @beauticode/adapter-workbuddy && npm run build -w @beauticode/adapter-desktop-cdp && npm run typecheck -w @beauticode/adapter-cursor && npm run typecheck -w @beauticode/adapter-doubao",
    "discover": "node scripts/beauticode.mjs discover",
    "bc": "node scripts/beauticode.mjs",
    "smoke:live": "npm run build && node scripts/live-smoke.mjs",
    "tray": "npm run build && powershell -NoProfile -ExecutionPolicy Bypass -File apps/tray/start-tray.ps1 -SkipBuild",
    "installer:windows": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-windows-installer.ps1",
    "plugin:pack": "node scripts/pack-dsh-plugin.mjs",
    "plugin:publish": "node scripts/pack-dsh-plugin.mjs --publish",
    "plugin:pack-codex": "node scripts/pack-codex-plugin.mjs",
    "desktop:pack": "node scripts/pack-desktop-aggregate.mjs",
    "wb:runner": "node scripts/wb-cdp-runner.mjs",
    "wb:setup": "node scripts/wb-setup.mjs",
    "cursor:runner": "node scripts/desktop-cdp-runner.mjs --host cursor",
    "cursor:setup": "node scripts/desktop-cdp-setup.mjs --host cursor",
    "doubao:runner": "node scripts/desktop-cdp-runner.mjs --host doubao",
    "doubao:setup": "node scripts/desktop-cdp-setup.mjs --host doubao",
```

</details>

**依据 3 · 源码核查**：[packages/core/src/apply-transaction.ts:85-103](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/apply-transaction.ts#L85-L103)

核心生命周期

<details>
<summary>查看原文（19行）</summary>

```text
export interface ApplyTransactionHooks {
  /**
   * Runs after the renderer has acknowledged the new background and the media
   * handles have been promoted, but before the rollback snapshot is cleared.
   * Throwing keeps the whole apply recoverable.
   */
  beforeFinalize?: (manifest: BackgroundManifest) => Promise<void>;
  /** Best-effort cleanup for state created by beforeFinalize. */
  onRollback?: () => Promise<void>;
}

/**
 * Orchestrates snapshot → disk commit → media stage → host apply → verify →
 * finalize/rollback. Disk success is never treated as user-visible success when
 * a host applier is configured.
 *
 * Codex Desktop CSP blocks connect-src/img-src/media-src to http://127.0.0.1,
 * so live inject embeds media as data: URLs (CSP allows data: and blob:).
 * Loopback media hub remains staged for diagnostics / non-Codex hosts.
```

</details>

**依据 4 · 源码核查**：[packages/core/src/apply-transaction.ts:136-150](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/apply-transaction.ts#L136-L150)

排他操作

<details>
<summary>查看原文（15行）</summary>

```text
  async run(
    input: ApplyInput,
    hooks: ApplyTransactionHooks = {},
  ): Promise<ApplyResult> {
    if (this.#busy) {
      return {
        ok: false,
        error: "Another background apply is already in progress.",
        rolledBack: false,
      };
    }
    this.#busy = true;
    try {
      return await this.store.withExclusiveMutation(() =>
        this.#runExclusive(input, hooks),
```

</details>

#### 缺口

- 未运行任一适配器
  **影响**：跨客户端效果未知
  **进一步探讨**：先单客户端合成背景

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 回滚和本机控制有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

核心在回读未通过时触发回滚，catch 也尝试恢复；真实页面与磁盘状态依赖适配器实现和宿主可达。媒体通过携带令牌的 URL 提供，URL 日志和客户端进程需要保护。作者称通过 CDP 注入，因此仅核心事务不能证明所有客户端安全与识别正确。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/apply-transaction.ts:212-250](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/apply-transaction.ts#L212-L250)

验证失败回滚

<details>
<summary>查看原文（39行）</summary>

```text
        let verify = await measure("rendererVerify", () =>
          this.host!.verify(
            {
              generation: manifest.generation,
              media: manifest.background?.type ?? "clear",
            },
            { deadlineMs: this.verifyDeadlineMs },
          ),
        );
        if (
          verify.status !== "pass" &&
          manifest.background?.type === "video" &&
          isRetryableRenderVerifyFailure(verify.status, verify.reason)
        ) {
          await measure("hostApplyRetry", () => this.host!.apply(payload));
          verify = await measure("rendererVerifyRetry", () =>
            this.host!.verify(
              {
                generation: manifest.generation,
                media: manifest.background?.type ?? "clear",
              },
              { deadlineMs: this.verifyDeadlineMs },
            ),
          );
        }
        if (verify.status !== "pass") {
          await measure("rollback", () => this.#rollback(snapshot!, staged));
          staged = null;
          snapshot = null;
          // Field reports used to show only the renderer's final state.
          // Appending the server-side phase costs shows which stage ate the
          // deadline without needing the local import-timing log.
          const phaseSummary = Object.entries(phases)
            .map(([name, ms]) => `${name}=${ms}ms`)
            .join(",");
          return {
            ok: false,
            error: `Live verify did not pass (${verify.status}): ${verify.reason}；事务阶段=${phaseSummary}`,
            rolledBack: true,
```

</details>

**依据 2 · 源码核查**：[packages/core/src/apply-transaction.ts:277-298](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/apply-transaction.ts#L277-L298)

异常恢复结果

<details>
<summary>查看原文（22行）</summary>

```text
      let rolledBack = false;
      if (snapshot) {
        try {
          await measure("rollback", () => this.#rollback(snapshot!, staged));
          staged = null;
          snapshot = null;
          rolledBack = true;
        } catch {
          await this.#abortPair(staged);
          staged = null;
        }
      } else {
        await this.#abortPair(staged);
        staged = null;
      }
      if (finalizeStarted && hooks.onRollback) {
        await measure("finalizeRollback", () => hooks.onRollback!()).catch(() => {});
      }
      return {
        ok: false,
        error: message,
        rolledBack,
```

</details>

**依据 3 · 源码核查**：[packages/core/src/media-server.ts:24-51](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/media-server.ts#L24-L51)

媒体令牌和 URL

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Loopback authenticated media server (multi-asset).
 *
 * Adapted from Fei-Away/Codex-Dream-Skin `media-server.mjs` @ 865b906 (MIT).
 * See THIRD_PARTY_NOTICES.md.
 *
 * Auth: unguessable path token AND (header token OR ?t= query token).
 * Query tokens are required for <img>/<video src> which cannot set headers.
 * Bind: 127.0.0.1 only.
 */

export interface MediaAssetHandle {
  kind: "image" | "video";
  filePath: string;
  size: number;
  identity: string;
  device: number;
  inode: number;
  mtimeMs: number;
  ctimeMs: number;
  mime: string;
  validation: MediaValidationMode;
  token: string;
  route: string;
  /** Base URL without query token. */
  url: string;
  /** URL safe for media element src (includes ?t=). */
  srcUrl: string;
```

</details>

**依据 4 · 作者声明**：[README.md:118-123](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L118-L123)

作者安全声明

```text
## 安全边界

* 所有注入只走 `127.0.0.1` 本机调试端口或官方插件接口，不改客户端二进制
* 应用前校验、应用后回读验证，失败自动回滚，不会静默画坏页面
* 守护只对启动不足 10 秒且已确认身份的进程做一次受控重启，不会无限重启、不碰无关进程
* 导入媒体只读你主动选择的本地文件；控制通道使用随机令牌
```

#### 缺口

- 宿主识别和实际回滚未测
  **影响**：磁盘恢复不保证页面已恢复
  **进一步探讨**：用掉线、媒体替换和回执超时测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何判断日常收益？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选固定发行物与一个兼容客户端，在独立配置下先使用小图，记录改前改后输入和代码可读性，再比较视频的资源开销。根项目还依赖各客户端调试接口，升级需重新核对。退出前清除主题、停控制器并检查相关进程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-49](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L39-L49)

支持客户端和方式

<details>
<summary>查看原文（11行）</summary>

```text
## 支持的客户端

| 客户端 | 接入方式 | 平台 | 状态 |
|---|---|---|---|
| **DeepSeek Harness** | Cordis 插件，设置页内嵌「背景」面板 | Windows | ✅ 推荐，无需托盘 |
| **Codex Desktop** | 托盘 or 本机 CDP 注入 | Windows | ✅ 支持 |
| **WorkBuddy** | 官方 CDP 开关 + 守护注入 | Windows / macOS | ✅ 支持 |
| **Cursor** | 桌面 CDP 守护 | Windows | ✅ 支持（基线 3.18.9） |
| **豆包** | 桌面 CDP 守护 | Windows | ✅ 支持（基线 2.29.12） |

beautiCode 不会修改任何客户端的安装文件，也不替厂商发布补丁——DSH 走官方插件接口，桌面客户端走 `127.0.0.1` 本机调试端口注入，可随时干净卸载。
```

</details>

**依据 2 · 作者声明**：[README.md:71-116](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/README.md#L71-L116)

安装及管理

<details>
<summary>查看原文（46行）</summary>

````text
## 安装

### 直接复制发给你的Agent（最省事）

```sh
请在我的电脑上运行 npm install -g beauticode-desktop --foreground-scripts && beauticode-desktop all install 安装最新版 beautiCode，不要关闭正在运行的客户端、保留工作内容。异常请用 beauticode-desktop all status / all health 诊断并处理，确保各宿主的守护已安装并能自动注入。返回 ok:true 即成功；未安装的客户端显示 skipped、客户端未启动显示 wait-for-launch 均属正常。最后简短汇报：安装结果、未解决的问题、以及如何打开背景。
```

### 一个命令接管所有已装客户端（Windows）（手动安装）

```sh
npm install -g beauticode-desktop --foreground-scripts
beauticode-desktop all install
```

`all install` 会检测本机已安装的客户端，逐一套上后台接线，并为已检测到的客户端创建带背景的开始菜单快捷方式；它不会替你启动客户端。首次启用 CDP 的客户端请用新快捷方式启动一次。

### Linux（x64，独立包 `beauticode-linux`）

```sh
sudo apt install zenity          # 文件选择器（KDE 可用 kdialog）
npm install -g beauticode-linux --foreground-scripts
beauticode-linux all install
beauticode-linux all status
```

支持 Codex（ChatGPT 桌面版）、Cursor、WorkBuddy；需要 Node.js 22+。守护写入 `~/.config/autostart`，「(背景)」启动项写入 `~/.local/share/applications`，不需要 root。Linux 没有托盘，雨窗等内置动态氛围主题暂不可用；详见 [packages/beauticode-linux/README.md](packages/beauticode-linux/README.md)。

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

**依据 3 · 源码核查**：[packages/core/src/apply-transaction.ts:96-103](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/apply-transaction.ts#L96-L103)

适配边界

```text
/**
 * Orchestrates snapshot → disk commit → media stage → host apply → verify →
 * finalize/rollback. Disk success is never treated as user-visible success when
 * a host applier is configured.
 *
 * Codex Desktop CSP blocks connect-src/img-src/media-src to http://127.0.0.1,
 * so live inject embeds media as data: URLs (CSP allows data: and blob:).
 * Loopback media hub remains staged for diagnostics / non-Codex hosts.
```

#### 缺口

- 未运行发行物或测资源
  **影响**：实际维护成本未知
  **进一步探讨**：单客户端验证后逐个扩展

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何减少宿主掉线后的误恢复？

**研究主题**：新假设与验证

#### 完整回答

对照当前回滚结果，试验将磁盘恢复和页面确认分别标记，并在宿主重连后再次检查。用应用时掉线、验证时掉线和成功场景比较误报，若无改善则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/apply-transaction.ts:363-388](https://github.com/starsstreaming/beautiCode/blob/3bd396478e9ada7ddcb9c883a991c6ca7e59998d/packages/core/src/apply-transaction.ts#L363-L388)

回滚包含宿主验证

<details>
<summary>查看原文（26行）</summary>

```text
  async #rollback(
    snapshot: BackgroundSnapshot,
    staged: StagedMediaPair | null,
  ): Promise<void> {
    await this.#abortPair(staged);
    const restored = await this.store.restoreSnapshot(snapshot);
    let restoredMedia: StagedMediaPair | null = null;
    try {
      restoredMedia = await this.#stageMediaFor(restored);
      let runtimeVideoPath: string | null = null;
      if (!this.offline && this.host) {
        const payload = await this.#buildPayload(restored, restoredMedia);
        runtimeVideoPath = payload.video?.localPath ?? null;
        try {
          await this.host.apply(payload);
          await this.host.verify(
            {
              generation: restored.generation,
              media: restored.background?.type ?? "clear",
            },
            { deadlineMs: Math.min(this.verifyDeadlineMs, 5_000) },
          );
        } catch {
          // Disk rollback is authoritative. A stopped/restarting host will be
          // healed from active on its next watch connection.
        }
```

</details>

#### 缺口

- 现有 UI 如何表达待恢复未知
  **影响**：可能已有等价提示
  **进一步探讨**：走查后注入断连

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
