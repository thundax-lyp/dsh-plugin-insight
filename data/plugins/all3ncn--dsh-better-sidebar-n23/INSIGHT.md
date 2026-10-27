# DSH Better Sidebar N23

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ca9694b](https://github.com/All3nCN/dsh-better-sidebar-N23/tree/ca9694b4d232ff47eefec07e395b23eef0766831)

<!-- BEGIN META -->
[![npm 30d 1,125](https://img.shields.io/static/v1?label=npm+30d&message=1%2C125&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@all3cn/dsh-better-sidebar-n23)
<!-- END META -->

> **实现功能**：为DSH提供文件编辑预览、真实终端、Git、浏览器与可扩展双面板工作台。

> **核心亮点**：现有工作台把文件、终端和Git交接集中到DSH旁；fork可识别增量是布局提交策略、外壳与模块兼容，整体设计归上游，不能全部计为原创。[Q01](#research-q01)

> **风险与缺陷**：src/lib刻意分轨意味着“源码有修复”不能证明发布包具有同一修复；发布fs.write也没有版本比较或cwd写入边界。兼容与编辑可靠性应先于功能广度判断。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 完整工作台相对外部编辑器与上游插件增加了什么？](#detail-section-11)
  - [Q02 · 实际发布入口如何注册文件、终端和Git能力，副作用在哪里？](#detail-section-12)
  - [Q03 · 发布lib与src分轨会怎样影响核心价值和成本？](#detail-section-13)
  - [Q04 · 怎样设计可证伪的改进并界定采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在对话旁完成文件检查、终端与Git操作的开发者；需接受插件以本机权限执行操作。

对照外部编辑器/终端以及直接使用上游dsh-better-sidebar。未做同条件性能/业务效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作台与扩展注册 | 同屏编辑预览与第三方tab | 兼容宿主服务；主体设计继承上游 |
| PTY与Git | 执行shell、差异与版本操作 | 真实系统副作用，不是权限隔离 |
| 文件写入 | 保存编辑结果 | 发布lib无原文件版本比较，需人工防冲突 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node≥20及声明DSH peer范围 | 启动必需 | 加载插件服务 | 作者验证0.1.1-rc.2；≥0.2兼容未知 |
| node-pty原生组件 | 终端操作必需 | 创建真实shell | 构建失败时终端降级不可用 |
| 无旧同名插件双挂载 | 启动必需 | 避免重复注册 | 先移除旧挂载；备份profile |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 备份并安装 | 用户在匹配宿主装包 | 旧包不重复挂载 |
| 加载工作台 | 插件挂载服务/前端 | 面板与会话上下文一致 |
| 在副本检查保存/终端/Git | 用户操作并核对磁盘和差异 | 未保存或结果冲突时停止覆盖并人工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 前端依赖与PTY构建资源 | 兼容核对和备份profile | 金额与耗时未测 |
| 持续使用 | shell进程与文件预览资源 | 审查差异及终端输出 | 无同任务净节时数据 |
| 失败恢复 | 残留进程/临时文件与重新构建资源 | 核对磁盘、恢复备份、处理双轨 | 不提供写入前版本检查；恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同屏交接 | 作者功能与发布路由支持 | 端到端合格交付耗时 |
| 拖拽优化 | 作者描述释放时提交策略 | 同负载掉帧改善幅度 |
| 安全与兼容 | 发布lib有Host/Origin检查 | 不等于文件沙箱或新宿主兼容 |

> **思考**：src/lib刻意分轨意味着“源码有修复”不能证明发布包具有同一修复；发布fs.write也没有版本比较或cwd写入边界。兼容与编辑可靠性应先于功能广度判断。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：现有工作台把文件、终端和Git交接集中到DSH旁；fork可识别增量是布局提交策略、外壳与模块兼容，整体设计归上游，不能全部计为原创。[Q01](#research-q01)

现有工作台把文件、终端和Git交接集中到DSH旁；fork可识别增量是布局提交策略、外壳与模块兼容，整体设计归上游，不能全部计为原创。[Q01](#research-q01)

服务化tab/viewer接口便于扩展；实际lib具来源检查、PTY限额与原子替换，但宽路径权限、无保存版本比较及双轨重建是重要取舍。需保留上游MIT归属，并验证编译产物与源码同步。

<a id="detail-section-5"></a>

### 1.4 主要限制

src/lib刻意分轨意味着“源码有修复”不能证明发布包具有同一修复；发布fs.write也没有版本比较或cwd写入边界。兼容与编辑可靠性应先于功能广度判断。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察发布源与运行产物同步、宿主范围；如自行评估，只在备份的小仓库试验文件/Git/PTY，不用它承担工作区隔离。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查发布入口及关键副作用；上游设计与fork改动已区分；源产物分轨和运行兼容仍限制采用。

- 已检查：作者 README、包清单、源码路径 README.md、UPSTREAM.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：对同一宿主/大对话做布局性能对照，逐项验收文件保存冲突、PTY退出、Git差异和禁用后清理；本轮未执行。

**分析版本**

- **仓库**：[All3nCN/dsh-better-sidebar-N23](https://github.com/All3nCN/dsh-better-sidebar-N23)
- **版本号**：0.1.0（[固定提交 ca9694b](https://github.com/All3nCN/dsh-better-sidebar-N23/tree/ca9694b4d232ff47eefec07e395b23eef0766831)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为分离拖拽临时视觉状态与最终持久化提交，并用统一可重建源消除产物漂移；在相同大对话负载下检验帧耗时和构建一致性，收益消失或布局回归即否定。[Q04](#research-q04)

对同一宿主/大对话做布局性能对照，逐项验收文件保存冲突、PTY退出、Git差异和禁用后清理；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 508 | — | — | 3034 |
| .js | source | 6 | 63962 | 54830 | 10686 | — |
| .mjs | source | 1 | 143 | 99 | 31 | — |
| .ts | source | 48 | 9125 | 5747 | 2916 | — |
| .tsx | source | 27 | 7036 | 5328 | 1458 | — |
| .mjs | test | 2 | 56 | 46 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/All3nCN/dsh-better-sidebar-N23/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/All3nCN/dsh-better-sidebar-N23/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A11.437Z..2026-10-23T07%3A58%3A11.437Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/All3nCN/dsh-better-sidebar-N23/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A58%3A11.437Z..2026-10-23T07%3A58%3A11.437Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：完整工作台fork如何减少交接，发布lib和源码分轨怎样限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 完整工作台相对外部编辑器与上游插件增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是需要在DSH对话旁直接检查文件、预览结果、使用终端与Git的开发者；交付是文件修改及差异能被人工检查并完成提交等操作，不是仅出现一个侧栏。README列举编辑器、真实终端、Git、浏览器、后台任务和双工作区；它们减少切换应用的可能性有机制依据，但没有本轮任务耗时证据。归属必须收窄：UPSTREAM明确整体设计来自omdsh-dev的dsh-better-sidebar，fork主要增量为拖拽时不逐帧更新会话布局、外壳布局和模块加载兼容。不能将全套工作台算作fork原创；与直接使用上游相比，本次能识别的是界面和兼容适配取舍，尚没有同条件性能优势结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-24](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/README.md#L3-L24)

作者功能和上游归属界定任务与基线。

<details>
<summary>查看原文（22行）</summary>

```text
一个服务化的侧边栏框架 + 一套开箱即用的 DSH 完整工作台。本包是开源插件
[dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)（MIT）的社区
fork，在 `@all3cn` 作用域下独立发版；上游致谢见 [UPSTREAM.md](./UPSTREAM.md)。

[English](./README_EN.md) | 中文

## 功能一览

- **文件工作台**：资源管理器（懒加载目录树、软链接按目标类型展示）+ CodeMirror
  编辑器；图片 / Markdown / HTML / PDF / Office 内联预览
- **真实终端**：xterm.js + node-pty 真实 shell，断线重连回放；可选为模型注入
  `terminal_*` 工具
- **Git 面板**：真 diff + VSCode 式 diff tab、历史、右键暂存 / 提交 / 还原
- **内嵌浏览器**：多开网页 tab，后退 / 前进 / 刷新；内容运行在沙箱 iframe
- **后台任务页**：subagent 拓扑 + 后台任务（退出码 / 实时输出 / 强制终止）
- **双工作区**：右侧栏 + 底部面板，拖 Tab 拆分 / 合并分栏（可跨面板）
- **外壳重构**：全宽 48px 顶栏 + VSCode 式活动栏（activity rail）+ 全局控制区，
  对话与工作台并存的 IDE 布局
- **服务化 API**：通过 `ctx.betterSidebar` 开放给所有插件——
  `registerTab` / `registerFileViewer` 注册侧边栏页面与文件预览器，内置 tab 与
  第三方插件走同一套注册接口，能力完全对等
- **会话隔离**：布局 / Tab / 面板按会话持久化；多语言（zh / en）跟随 DSH 语言
```

</details>

**依据 2 · 作者声明**：[UPSTREAM.md:14-36](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/UPSTREAM.md#L14-L36)

列明fork改动，避免把继承机制计为原创。

<details>
<summary>查看原文（23行）</summary>

```text
implementation belongs to the upstream authors under the MIT license.

## Fork changes relative to upstream 0.12.3

1. During a right/bottom panel drag, fixed panels follow the pointer but do
   not write `--dsh-sidebar-width`/`--dsh-sidebar-height`. The central DSH
   conversation only resizes once when the persisted store value commits on
   pointer release. This prevents full-transcript reflow and frame skips.
2. The standard composer card is overridden to an 8px radius.
3. At a right-panel container width up to 320px, tab captions, close
   controls, and badges collapse to icon-only tabs; the native `title`
   remains available.
4. (2026-08-22, DSH core compat) newer DSH cores removed the
   `window.__DSH_MODULES__` page global: the shell kernel enrolls the
   ClientModuleSystem as the `modules` Cordis service, so lazy chunks
   (terminal/editor) failed with `chunk "editor": client module system
   unavailable`. `src/client/chunk-loader.ts` resolves the system through a
   context-bound instance (`bindModuleSystem`, called from
   `src/client/index.tsx` via optional `ctx.get?.("modules")`) with the
   legacy global kept as fallback for older cores.
5. (2026-08-31) Shell refactor: full-width 48px header, VSCode-style activity
   rail, global controls; workbench completed (see README feature list).
   Validated against DSH `0.1.1-rc.2`.
```

</details>

#### 缺口

- 未取得同宿主同任务的上游/外部编辑器对照
  **影响**：不能确认切换成本和拖拽性能净收益
  **进一步探讨**：用相同大型会话和文件任务测量掉帧、交付耗时与人工操作

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实际发布入口如何注册文件、终端和Git能力，副作用在哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package.main与exports指向lib/index.js，实际接线需以已发布lib为准。lib要求webServer、sessions、webRuntime、tools；请求携带sessionId，通过会话cwd确定Git和终端上下文，文件树可读取传入绝对路径。HTTP trust fence校验Host为loopback或受信任域并拒绝浏览器cross-site/origin不匹配；这是请求来源防线，不是文件权限沙箱。fs.write要求绝对路径，先写同路径临时文件再rename，当前实现没有expected版本比较，cwd虽取出但不限定可写路径，因此“会话隔离”不能解释成工作区外不可写。PTY与Git都有真实系统副作用，外部用户或模型工具入口应按本机开发者权限管理。分层服务接口可借鉴，但移植必须同时处理生命周期释放和宿主模块系统。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-23](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/package.json#L15-L23)

运行入口明确指向lib，不能拿较新src替代运行证明。

```text
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./invariant": {
      "types": "./lib/types/invariant.d.ts",
      "default": "./lib/invariant.js"
    },
```

**依据 2 · 源码核查**：[lib/index.js:2274-2282](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js#L2274-L2282)

运行半区服务注入。

```text
/** Plugin identity for cordis.yml rows. */
const name = "dsh-better-sidebar";
/** Services required before mounting: the webserver routes, the session store, the web runtime's trusted hosts, and the tool registry. */
const inject = [
	"webServer",
	"sessions",
	"webRuntime",
	"tools"
];
```

**依据 3 · 源码核查**：[lib/index.js:391-405](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js#L391-L405)

来源信任检查的具体范围。

<details>
<summary>查看原文（15行）</summary>

```text
function isTrustedApiRequest(request, trustedHosts) {
	const host = header(request.headers, "host");
	if (host === void 0) return false;
	const hostUrl = parseAuthority(host);
	if (hostUrl === void 0) return false;
	if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false;
	if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = header(request.headers, "origin");
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2406-2419](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js#L2406-L2419)

绝对路径写入及临时文件替换，无版本比较或cwd边界。

<details>
<summary>查看原文（14行）</summary>

```text
		"fs.write": async (payload) => {
			const { cwd } = cwdOf(payload);
			const path = requireAbsolute(requireString(payload, "path"));
			const content = requireString(payload, "content");
			const tmp = `${path}.dsh-sidebar-tmp-${process.pid}`;
			try {
				await mkdir(dirname(path), { recursive: true });
				await writeFile(tmp, content, "utf8");
				await rename(tmp, path);
			} catch (error) {
				await rm(tmp, { force: true }).catch(() => {});
				throw new SidebarError("fs-error", `cannot write "${path}": ${error instanceof Error ? error.message : String(error)}`, 400);
			}
			return { ok: true };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发布lib与src分轨会怎样影响核心价值和成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

最影响采用的不是功能数量，而是维护者明示src在健壮性修复领先、lib在外壳布局领先。UPSTREAM记录重建前必须先把外壳更改回写src，否则布局可能丢失；所以仅审查src中的安全实现或成功编译并不能证明实际包已有相同修复。此次已直接读lib的信任和写入路径，确认请求防线存在，但没有将它扩展为完整安全审计。兼容声明针对DSH 0.1.1-rc.2且peer范围小于0.2.0；新宿主用户不能默认兼容。首次还有node-pty原生构建、编辑器和前端依赖负担；持续使用有真实shell进程及文件/Git操作，失败恢复需要核对未保存文件、临时文件和后台进程。现金和人工时间均未测，不应以MIT许可证推断总成本为零。

#### 证据与依据

**依据 1 · 作者声明**：[UPSTREAM.md:38-56](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/UPSTREAM.md#L38-L56)

源与构建分轨及重建风险是作者明确维护状态。

<details>
<summary>查看原文（19行）</summary>

```text
## Source / build note

Both `src/` and the shipped `lib/` bundle are tracked. They were
intentionally synchronized by hand (the fork checkout does not carry the
upstream tsdown/tsc build toolchain). Keep them synchronized: run the
upstream build in a dependency-complete checkout, then copy/commit `lib/`;
or explicitly review the intentionally mirrored compiled change.

## src/lib split-track state (2026-09-01 rollback incident)

- `src/` has been restored with the upstream 0.17.1 A-class robustness /
  security fixes (the `src/` half of the original A-class absorption).
- `lib/` intentionally stays on the accepted shell-refactor version: the shell
  CSS (three-zone bar, activity rail, compact header) was hand-mirrored into
  the compiled bundles and has not yet been written back to `src/`.
- Therefore `src/` and `lib/` are intentionally split-track: `src/` is ahead
  on robustness fixes, `lib/` is ahead on shell layout. Runtime behavior is
  governed by `lib/`, not `src/`.
- Before any full `tsc` + `tsdown` rebuild, the shell changes must first be
```

</details>

**依据 2 · 作者声明**：[README.md:26-39](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/README.md#L26-L39)

声明兼容与避免旧包双挂载的安装约束。

<details>
<summary>查看原文（14行）</summary>

````text
## 兼容性

针对 DSH（DeepSeek Harness）`0.1.1-rc.2` 验证；peer 依赖声明为
`@deepseek-ai/* >= 0.1.0-rc.6 < 0.2.0`。要求 Node.js >= 20。

## 安装

前置：已装好 DSH（`dsh web` 可正常运行）。

```sh
dsh plugin --profile web add @all3cn/dsh-better-sidebar-n23
```

包内声明了 `dsh.bundle.patch`（[cordis.patch.yml](./cordis.patch.yml)），CLI 的
````

</details>

**依据 3 · 源码核查**：[lib/index.js:2406-2419](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js#L2406-L2419)

写入不带并发版本防护，影响恢复成本。

<details>
<summary>查看原文（14行）</summary>

```text
		"fs.write": async (payload) => {
			const { cwd } = cwdOf(payload);
			const path = requireAbsolute(requireString(payload, "path"));
			const content = requireString(payload, "content");
			const tmp = `${path}.dsh-sidebar-tmp-${process.pid}`;
			try {
				await mkdir(dirname(path), { recursive: true });
				await writeFile(tmp, content, "utf8");
				await rename(tmp, path);
			} catch (error) {
				await rm(tmp, { force: true }).catch(() => {});
				throw new SidebarError("fs-error", `cannot write "${path}": ${error instanceof Error ? error.message : String(error)}`, 400);
			}
			return { ok: true };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1006-1033](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js#L1006-L1033)

终端创建真实pty并施加数量上限。

<details>
<summary>查看原文（28行）</summary>

```text
	* @throws {SidebarError} pty-error when the per-session cap is reached.
	*/
	open(sessionId, tabId, cwd, cols, rows) {
		const key = `${sessionId}:${tabId}`;
		this.cancelClose(key);
		const existing = this.sessions.get(key);
		if (existing !== void 0 && !existing.exited && existing.cwd === cwd) return existing;
		if (existing !== void 0) this.close(key);
		for (const [candidate, handle] of [...this.sessions]) if (handle.sessionId === sessionId && handle.exited) this.close(candidate);
		if (this.keysOf(sessionId).length >= this.maxPerSession) throw new SidebarError("pty-error", `terminal limit reached (${this.maxPerSession}) for this session`, 400);
		const handle = {
			key,
			sessionId,
			tabId,
			cwd,
			pty: this.nodePty.spawn(this.shell, shellSpawnArgs(), {
				name: "xterm-256color",
				cols: Math.max(2, Math.floor(cols)),
				rows: Math.max(2, Math.floor(rows)),
				cwd,
				env: { ...process.env }
			}),
			transcript: "",
			exited: false
		};
		handle.pty.onData((data) => {
			handle.transcript += data;
			if (handle.transcript.length > TRANSCRIPT_LIMIT$1) handle.transcript = handle.transcript.slice(handle.transcript.length - TRANSCRIPT_LIMIT$1);
```

</details>

#### 缺口

- src/lib具体安全修复差异未穷尽
  **影响**：不能宣称整个发布包继承最新健壮性修复
  **进一步探讨**：逐变更对照发布入口与src，冻结产物摘要后复核关键副作用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样设计可证伪的改进并界定采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是把布局拖动中的临时视觉状态与持久化布局提交分离，并配合单一可重建发布源，可以保留fork所追求的拖拽流畅性，同时减少src/lib漂移造成的回归。推导分别来自作者的拖拽改造与分轨记录，不能将尚未同步的源码方案当现有能力。最小验证同一大对话/多tab负载比较逐帧布局提交、当前发布包、统一源构建包，记录帧耗时、布局最终值和加载一致性；若性能没有提升或统一构建不能复现外壳，则不支持假设。当前建议observe：已有可用场景，但对需要可靠写入和新宿主兼容的人，发布/源码一致性缺口阻碍扩大试用。熟悉旧宿主的开发者若自行试验，应在备份的小仓库核对文件与Git操作，停用后确保shell退出；它不适合作为受限文件浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[UPSTREAM.md:16-24](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/UPSTREAM.md#L16-L24)

拖动只在释放时提交布局的局部机制是推导依据。

```text
## Fork changes relative to upstream 0.12.3

1. During a right/bottom panel drag, fixed panels follow the pointer but do
   not write `--dsh-sidebar-width`/`--dsh-sidebar-height`. The central DSH
   conversation only resizes once when the persisted store value commits on
   pointer release. This prevents full-transcript reflow and frame skips.
2. The standard composer card is overridden to an 8px radius.
3. At a right-panel container width up to 320px, tab captions, close
   controls, and badges collapse to icon-only tabs; the native `title`
```

**依据 2 · 作者声明**：[UPSTREAM.md:38-56](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/UPSTREAM.md#L38-L56)

发布源分轨提供维护改进的具体反例。

<details>
<summary>查看原文（19行）</summary>

```text
## Source / build note

Both `src/` and the shipped `lib/` bundle are tracked. They were
intentionally synchronized by hand (the fork checkout does not carry the
upstream tsdown/tsc build toolchain). Keep them synchronized: run the
upstream build in a dependency-complete checkout, then copy/commit `lib/`;
or explicitly review the intentionally mirrored compiled change.

## src/lib split-track state (2026-09-01 rollback incident)

- `src/` has been restored with the upstream 0.17.1 A-class robustness /
  security fixes (the `src/` half of the original A-class absorption).
- `lib/` intentionally stays on the accepted shell-refactor version: the shell
  CSS (three-zone bar, activity rail, compact header) was hand-mirrored into
  the compiled bundles and has not yet been written back to `src/`.
- Therefore `src/` and `lib/` are intentionally split-track: `src/` is ahead
  on robustness fixes, `lib/` is ahead on shell layout. Runtime behavior is
  governed by `lib/`, not `src/`.
- Before any full `tsc` + `tsdown` rebuild, the shell changes must first be
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2406-2419](https://github.com/All3nCN/dsh-better-sidebar-N23/blob/ca9694b4d232ff47eefec07e395b23eef0766831/lib/index.js#L2406-L2419)

文件写入权限范围决定采用条件。

<details>
<summary>查看原文（14行）</summary>

```text
		"fs.write": async (payload) => {
			const { cwd } = cwdOf(payload);
			const path = requireAbsolute(requireString(payload, "path"));
			const content = requireString(payload, "content");
			const tmp = `${path}.dsh-sidebar-tmp-${process.pid}`;
			try {
				await mkdir(dirname(path), { recursive: true });
				await writeFile(tmp, content, "utf8");
				await rename(tmp, path);
			} catch (error) {
				await rm(tmp, { force: true }).catch(() => {});
				throw new SidebarError("fs-error", `cannot write "${path}": ${error instanceof Error ? error.message : String(error)}`, 400);
			}
			return { ok: true };
```

</details>

#### 缺口

- 统一构建与性能对照未实施
  **影响**：假设不能计入fork已实现贡献
  **进一步探讨**：冻结同负载对照并核对产物与源码一致

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
