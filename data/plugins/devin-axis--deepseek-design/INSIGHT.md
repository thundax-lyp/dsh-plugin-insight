# DeepSeek Design 分发与贡献入口

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[62ee529](https://github.com/Devin-AXIS/deepseek-design/tree/62ee529e84423ba63e823b23860293a43b6eb03b)

<!-- BEGIN META -->
[![GitHub ★ 1,604](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C604&color=yellow&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design)
<!-- END META -->

> **实现功能**：面向DSH分发Design、PPT和Video三个独立可编辑Studio插件。

> **核心亮点**：[Q01](#research-q01)、[Q03](#research-q03) 贡献在同一上游契约的独立任务分发与本地可编辑交付，而非根再提供一个引擎；不重复计子包模板与工具数量。

> **风险与缺陷**：[Q02](#research-q02)、[Q03](#research-q03) 文件可编辑、保存原子性和有限校验不等于业务成果合格，根镜像可读也不能证明全部构建对应；需选定子包和实际验收范围。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 根目录是安装对象还是分发入口？](#detail-section-15)
  - [Q02 · 共享机制怎样支撑AI与手动编辑循环？](#detail-section-16)
  - [Q03 · 可编辑工作流的贡献与采用条件是什么？](#detail-section-17)
  - [Q04 · 跨AI与手动交接清单能否减少错误覆盖？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要选择可编辑设计能力的创作者通过根入口了解独立包与工作区交接。

聊天生成后使用独立编辑器，或直接使用上游Studio是参照；本轮没有运行同条件比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分发与贡献路由 | 选择创作子包并回流上游 | 根无独立运行包 |
| 共享可编辑契约 | 组织AI与人工交接 | 代表机制可查，需逐包验收 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 具体子包与匹配DSH | 真正执行能力 | 根不可代替安装包 |
| 上游Studio与工作区 | 文件编辑与预览 | 核对版本与备份 |
| 用途许可核对 | 确认采用范围 | 超范围先取适用授权 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 按成果选子包 | 用户确认设计/幻灯片/视频 | 不默认全装 |
| 副本工作区试用 | 用户确认真实文件可重开 | 不写原件 |
| 按成果独立验收 | 用户核对内容/布局/导出 | 回原编辑器与备份 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 按需包、Node/DSH，未知 | 选包、版本和许可核对，未知 |
| 持续 | 模型/素材/渲染，未知 | 设计或视频验收，未知 |
| 失败恢复 | 重生成/备份，未知 | 冲突协调、原编辑器恢复，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 按需选创作能力 | 独立包与共享契约 | 根不独立执行 |
| 可编辑成果交接 | 子包文件/草稿/预览机制 | 各任务真实验收与构建一致性 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) 文件可编辑、保存原子性和有限校验不等于业务成果合格，根镜像可读也不能证明全部构建对应；需选定子包和实际验收范围。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03) 贡献在同一上游契约的独立任务分发与本地可编辑交付，而非根再提供一个引擎；不重复计子包模板与工具数量。

[Q01](#research-q01)、[Q03](#research-q03) 贡献在同一上游契约的独立任务分发与本地可编辑交付，而非根再提供一个引擎；不重复计子包模板与工具数量。

可借鉴分发与贡献回上游的单一代码源治理，但必须保留SOURCE_COMMIT和构建映射；代码量包含分发bundle不能当原创开发量。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q02](#research-q02)、[Q03](#research-q03) 文件可编辑、保存原子性和有限校验不等于业务成果合格，根镜像可读也不能证明全部构建对应；需选定子包和实际验收范围。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 根入口观察并用于选包；真正试用请进入具体子包范围，不把根源码可见当可安装或无限商用。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查分发定位和代表机制，未安装运行；共同交接清单是假设。

- 已检查：作者 README、包清单、源码路径 README.md、LICENSE、source/plugins/deepseek-idesign/src/client.tsx、packages/deepseek-idesign/lib/index.js、source/plugins/deepseek-ivideo/src/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根作为分发系统研究；代表性读取设计client/分发lib与视频runtime，不代表三个包全量审计或真实宿主验收。
- 下一步：先只选一包核对保存与重开，再做并发修改对照；构建一致性按上游commit独立检查，尚未执行。

**分析版本**

- **仓库**：[Devin-AXIS/deepseek-design](https://github.com/Devin-AXIS/deepseek-design)
- **版本号**：未声明（[固定提交 62ee529](https://github.com/Devin-AXIS/deepseek-design/tree/62ee529e84423ba63e823b23860293a43b6eb03b)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是以目标摘要、选区和验收标准绑定跨AI/手动交接，用并发变更对照错误覆盖和人工分钟；无改善则停止。

先只选一包核对保存与重开，再做并发修改对照；构建一致性按上游commit独立检查，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 1519 | — | — | 13693 |
| .js | source | 73 | 237667 | 211004 | 26033 | — |
| .tsx | source | 5 | 352 | 320 | 4 | — |
| .ts | source | 27 | 2742 | 2503 | 32 | — |
| .mjs | source | 1 | 49 | 41 | 0 | — |
| .mjs | test | 1 | 231 | 216 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根分发的共同创作交接贡献及独立子包的边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 根目录是安装对象还是分发入口？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

根项目是iPolloWork面向DSH的聚焦分发和贡献入口，实际安装是deepseek-idesign、deepseek-ippt和deepseek-ivideo三个独立包；根没有package.json，不能直接视为第四个可安装插件。面向需要AI生成后继续视觉精调的创作者，交付是工作区中可保存、继续编辑的设计或视频项目，原办法是聊天生成截图/HTML后另开编辑器。三个包目录隔离且共用上游契约，设计与PPT/video应按任务选择，不为获取一项能力安装全部。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-68](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/README.md#L48-L68)

独立包、目录隔离与共享Studio归属。

<details>
<summary>查看原文（21行）</summary>

```text
## 三个独立插件，一套创作系统

| 插件 | 面向场景 | 核心能力 |
| --- | --- | --- |
| [`deepseek-idesign`](https://www.npmjs.com/package/deepseek-idesign) | 网站、App 原型、海报、信息卡、数据报告、杂志与其他非幻灯片设计 | Design 模板市场、桌面/移动预览、可视化元素编辑、主题与设计令牌、选区 Ask AI |
| [`deepseek-ippt`](https://www.npmjs.com/package/deepseek-ippt) | 演示文稿与幻灯片 | 独立 PPT 模板市场、逐页编辑、可视化精调、选区 Ask AI、PDF/PPTX 导出 |
| [`deepseek-ivideo`](https://www.npmjs.com/package/deepseek-ivideo) | 动态视觉、产品演示、数据故事与短视频 | HyperFrames 时间线、主题组件与统一变量表单、28 个 Video 模板、选区 Ask AI、自动校验、视频导出 |

三个插件可以单独安装，也可以一起使用。它们共享 iPolloWork Studio 契约和模板协议，但项目目录彼此隔离，因此不会相互覆盖。只安装所选 npm 包，不会下载另外两个插件。

## 核心特性

- **Harness 原生界面**：Design 与 PPT 作为独立视图出现在 DeepSeek Harness 对话中，不需要启动 iPolloWork 桌面端。
- **AI 与手动编辑并存**：既能让 AI 完整生成或重构，也能在画布中直接修改单个元素和全局主题。
- **选区级 Ask AI**：选中元素后，插件把明确的文件、定位信息和当前样式整理为对话草稿；由用户确认后再发送，不会自动提交。
- **真实项目文件**：作品保存在 Harness 工作区，而不是封闭的云端画布或不可编辑截图。
- **模板市场**：Design 与 PPT 拥有各自的精选模板入口；网站和海报不会混入 PPT，幻灯片也不会混入 Design。
- **可逆编辑**：支持保存、撤销和文件变更冲突检测，降低 AI 与手动编辑同时发生时的覆盖风险。
- **设计系统能力**：通过设计令牌统一管理颜色、字体、背景、圆角、阴影、间距和组件视觉语言。
- **独立安装**：每个 npm 包都包含所需的浏览器资源，只安装选择的能力，不把完整 iPolloWork 主项目带入 Harness。
- **原生 Video 工作流**：iVideo 直接复用 HyperFrames 时间线、可视化编辑、预览、校验与导出，不维护第二套视频引擎。
```

</details>

**依据 2 · 作者声明**：[README.md:271-283](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/README.md#L271-L283)

根分发与上游唯一代码源的明确说明。

<details>
<summary>查看原文（13行）</summary>

````text
## Repository model

```text
packages/               Complete, installable plugin builds
source/plugins/         DeepSeek Harness adapter sources
source/shared/          Shared Studio protocol and types
SOURCE_COMMIT           Matching iPolloWork source commit
repository.json         Package and provenance manifest
```

[iPolloWork](https://github.com/Devin-AXIS/iPolloWork) is the single source of truth for product code. [`deepseek-design`](https://github.com/Devin-AXIS/deepseek-design) is the focused distribution and contribution entry point for Harness users.

Pull requests may update `source/` or this README. Accepted changes are imported into iPolloWork as a reviewable upstream pull request. After that pull request is merged, all three plugins are rebuilt from shared Studio sources and synchronized back here. Do not edit generated runtime files under `packages/` directly.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 共享机制怎样支撑AI与手动编辑循环？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

已抽查iDesign client同源与source双校验后把选区写入草稿，用户确认后发送；实际分发lib对文件限定工作区父目录realpath，携带baseUpdatedAt且非force时以mtime检查冲突，然后临时文件rename保存。iVideo对应runtime管理每会话项目、starts共享启动、view leases和仅owned进程回收。这些是不同子包的具体机制，不存在根统一注册函数；共同工作流来自上游Studio与适配器约定。source镜像的相对导入保留上游布局，不把镜像可读当成可在根直接构建；packages构建产物与SOURCE_COMMIT需在变更时单独核对。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-idesign/src/client.tsx:23-45](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-idesign/src/client.tsx#L23-L45)

选区到草稿的真实接线。

<details>
<summary>查看原文（23行）</summary>

```text
  function StudioView({ sessionId, useWorkspaces, inputActions }: ConvViewProps) {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const workspace = useWorkspaces((state) => state.items.find((item) => item.sessionIds.includes(sessionId)));
    const projectId = `${String(sessionId)}${options.projectSuffix ?? ""}`;

    React.useEffect(() => {
      const receive = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
        if (!isDesignStudioHostMessage(event.data)) return;
        if (event.data.type === "ask-document-ai") {
          inputActions.setDraft([
            `Help me improve the current ${options.studioTitle} document.`,
            `Project: design/${projectId}`,
            "Read manifest.json, then read its entry file and linked design-tokens.css before editing.",
            "Preserve the existing structure unless I request a redesign.",
            "My requested change:",
          ].join("\n"));
          return;
        }
        inputActions.setDraft(designStudioAskAiPrompt(event.data.request));
      };
      window.addEventListener("message", receive);
      return () => window.removeEventListener("message", receive);
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-idesign/lib/index.js:3653-3701](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/lib/index.js#L3653-L3701)

分发文件路径与条件mtime/临时替换。

<details>
<summary>查看原文（49行）</summary>

```text
async function verifiedWritePath$1(root, requested, prefix, studioTitle) {
	const relativePath = safeRelativePath$1(requested, prefix, studioTitle);
	const target = resolve(root, relativePath);
	if (!inside(root, target)) throw new StudioHttpError(403, "File path escaped the workspace.");
	let canonicalParent = root;
	for (const segment of relativePath.split("/").slice(0, -1)) {
		const next = resolve(canonicalParent, segment);
		const existing = await lstat(next).catch((error) => {
			if (errorCode(error) === "ENOENT") return null;
			throw error;
		});
		if (!existing) await mkdir(next).catch((error) => {
			if (errorCode(error) !== "EEXIST") throw error;
		});
		else if (!existing.isDirectory() && !existing.isSymbolicLink()) throw new StudioHttpError(400, `${studioTitle} folder path is not a directory.`);
		canonicalParent = await realpath(next);
		if (!inside(root, canonicalParent)) throw new StudioHttpError(403, "Symbolic links outside the workspace are not allowed.");
	}
	return resolve(canonicalParent, basename(target));
}
async function readStudioText(input) {
	const path = await verifiedExistingPath$1(input.root, input.requested, input.prefix, input.studioTitle);
	const info = await stat(path);
	if (!info.isFile()) throw new StudioHttpError(400, `${input.studioTitle} path is not a file.`);
	if (info.size > input.maxBytes) throw new StudioHttpError(413, `${input.studioTitle} file is too large.`);
	return {
		path: input.requested,
		content: await readFile(path, "utf8"),
		bytes: info.size,
		updatedAt: info.mtimeMs
	};
}
async function writeStudioText(input) {
	if (Buffer.byteLength(input.content) > input.maxBytes) throw new StudioHttpError(413, `${input.studioTitle} file is too large.`);
	const path = await verifiedWritePath$1(input.root, input.requested, input.prefix, input.studioTitle);
	const current = await stat(path).catch((error) => {
		if (errorCode(error) === "ENOENT") return null;
		throw error;
	});
	if (!input.force && input.baseUpdatedAt != null && current && Math.abs(current.mtimeMs - input.baseUpdatedAt) > .5) throw new StudioHttpError(409, input.conflictMessage ?? `${input.studioTitle} changed since it was loaded. Reload before saving.`);
	const temporary = resolve(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
	try {
		await writeFile(temporary, input.content, {
			encoding: "utf8",
			flag: "wx"
		});
		await rename(temporary, path);
	} finally {
		await unlink(temporary).catch(() => void 0);
```

</details>

**依据 3 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:193-226](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L193-L226)

视频租约与固定参数校验。

<details>
<summary>查看原文（34行）</summary>

```text
  async release(input: { workspaceRoot: string; sessionId: string; viewId: string }) {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    const preview = this.previews.get(identity.key);
    if (!preview) return;
    preview.leases.delete(input.viewId);
    if (preview.leases.size === 0) this.scheduleIdle(identity.key, preview);
  }

  async stop(input: { workspaceRoot: string; sessionId: string }) {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await this.starts.get(identity.key)?.catch(() => undefined);
    const preview = this.previews.get(identity.key);
    if (preview) await this.stopPreview(identity.key, preview);
  }

  async validate(input: { workspaceRoot: string; sessionId: string; signal?: AbortSignal }): Promise<VideoValidationResult> {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
    const result = await this.runCommand(
      ["check", identity.projectPath, "--json", "--samples", "5", "--max-issues", "40"],
      identity.projectPath,
      input.signal,
    );
    let report: JsonValue = null;
    try {
      report = JSON.parse(result.stdout.trim());
    } catch {
      report = null;
    }
    return {
      ok: result.exitCode === 0,
      exitCode: result.exitCode,
      report,
      output: (result.stderr.trim() || result.stdout.trim()).slice(-MAX_OUTPUT_CHARS),
```

</details>

**依据 4 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:405-415](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L405-L415)

只回收拥有的预览进程。

<details>
<summary>查看原文（11行）</summary>

```text
  private scheduleIdle(key: string, preview: ManagedPreview) {
    this.clearIdle(preview);
    preview.idleTimer = setTimeout(() => {
      if (preview.leases.size === 0 && this.previews.get(key) === preview) this.removePreview(key, preview);
    }, this.idleMs);
  }

  private removePreview(key: string, preview: ManagedPreview, stop = true) {
    this.clearIdle(preview);
    if (this.previews.get(key) === preview) this.previews.delete(key);
    if (stop && preview.owned) killOwnedProcess(preview.child);
```

</details>

#### 缺口

- 没有全量核对上游镜像与构建输出对应
  **影响**：不能对整个分发的供应链一致性作保证
  **进一步探讨**：按SOURCE_COMMIT和构建流程核对适配器、共享模块及各包输出摘要

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 可编辑工作流的贡献与采用条件是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

根项目识别的贡献是把上游同一套Studio按DSH创作任务拆成独立包，统一真实文件与会话交接，避免只交不可编辑截图；不把三个子包能力加总为根独立新引擎。最关键限制是可编辑不等于合格，选区定位会过期、条件mtime不等于事务、视频采样检查不覆盖全片，必须由用户分别验收响应布局、内容和导出。首次有Node/DSH和包版本配置，持续有模型、素材、渲染和人工复核，失败可保留HTML/CSS项目回原编辑器；总费用与分钟未测。固定LICENSE只列个人非商业/少于3人的内部非商业等有限用途，并对3人及以上、外部服务、付费客户交付等列书面授权条件，根的source available不应被读作无限商业复用。建议把根作为选包资料观察，实际试用在选定子包副本执行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-77](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/README.md#L60-L77)

工作流、文件与环境主张。

<details>
<summary>查看原文（18行）</summary>

```text
- **Harness 原生界面**：Design 与 PPT 作为独立视图出现在 DeepSeek Harness 对话中，不需要启动 iPolloWork 桌面端。
- **AI 与手动编辑并存**：既能让 AI 完整生成或重构，也能在画布中直接修改单个元素和全局主题。
- **选区级 Ask AI**：选中元素后，插件把明确的文件、定位信息和当前样式整理为对话草稿；由用户确认后再发送，不会自动提交。
- **真实项目文件**：作品保存在 Harness 工作区，而不是封闭的云端画布或不可编辑截图。
- **模板市场**：Design 与 PPT 拥有各自的精选模板入口；网站和海报不会混入 PPT，幻灯片也不会混入 Design。
- **可逆编辑**：支持保存、撤销和文件变更冲突检测，降低 AI 与手动编辑同时发生时的覆盖风险。
- **设计系统能力**：通过设计令牌统一管理颜色、字体、背景、圆角、阴影、间距和组件视觉语言。
- **独立安装**：每个 npm 包都包含所需的浏览器资源，只安装选择的能力，不把完整 iPolloWork 主项目带入 Harness。
- **原生 Video 工作流**：iVideo 直接复用 HyperFrames 时间线、可视化编辑、预览、校验与导出，不维护第二套视频引擎。

## 快速开始

### 环境要求

- Node.js `^22.19.0` 或 `>=24.0.0`
- DeepSeek Harness 当前版本及其插件管理所需的 pnpm

DeepSeek Harness 仍处于开发者预览阶段，可能出现兼容性变更。请优先使用最新版本，详见其[官方项目](https://github.com/deepseek-ai/deepseek-harness)。
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-idesign/lib/index.js:3685-3701](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/lib/index.js#L3685-L3701)

条件冲突检查限定可逆编辑承诺。

<details>
<summary>查看原文（17行）</summary>

```text
async function writeStudioText(input) {
	if (Buffer.byteLength(input.content) > input.maxBytes) throw new StudioHttpError(413, `${input.studioTitle} file is too large.`);
	const path = await verifiedWritePath$1(input.root, input.requested, input.prefix, input.studioTitle);
	const current = await stat(path).catch((error) => {
		if (errorCode(error) === "ENOENT") return null;
		throw error;
	});
	if (!input.force && input.baseUpdatedAt != null && current && Math.abs(current.mtimeMs - input.baseUpdatedAt) > .5) throw new StudioHttpError(409, input.conflictMessage ?? `${input.studioTitle} changed since it was loaded. Reload before saving.`);
	const temporary = resolve(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
	try {
		await writeFile(temporary, input.content, {
			encoding: "utf8",
			flag: "wx"
		});
		await rename(temporary, path);
	} finally {
		await unlink(temporary).catch(() => void 0);
```

</details>

**依据 3 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:208-226](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L208-L226)

固定5样本的检查范围。

<details>
<summary>查看原文（19行）</summary>

```text
  async validate(input: { workspaceRoot: string; sessionId: string; signal?: AbortSignal }): Promise<VideoValidationResult> {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
    const result = await this.runCommand(
      ["check", identity.projectPath, "--json", "--samples", "5", "--max-issues", "40"],
      identity.projectPath,
      input.signal,
    );
    let report: JsonValue = null;
    try {
      report = JSON.parse(result.stdout.trim());
    } catch {
      report = null;
    }
    return {
      ok: result.exitCode === 0,
      exitCode: result.exitCode,
      report,
      output: (result.stderr.trim() || result.stdout.trim()).slice(-MAX_OUTPUT_CHARS),
```

</details>

**依据 4 · 源码核查**：[LICENSE:15-53](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/LICENSE#L15-L53)

固定许可文本限定用途。

<details>
<summary>查看原文（39行）</summary>

```text
2. Permitted Uses

You may use and modify the Software without prior written authorization only
for the limited uses below:

  a. Individual Personal Use by one natural person for that person's own
     non-commercial work, learning, research, evaluation, or testing; and
  b. Small Internal Use by fewer than three total Users solely for internal,
     non-commercial evaluation, testing, or operations.

Small Internal Use is permitted only when the Software and its functionality
are not sold, hosted for, provided to, or otherwise made available to
customers, clients, or other external third parties. The three-User threshold
is measured across all people who access, operate, deploy, administer, or
benefit from a shared deployment of the Software, whether they are employees,
contractors, founders, collaborators, or other personnel.

3. Prior Written Authorization Required

You must obtain prior written authorization from the Licensor before You do
any of the following:

  a. use the Software with three or more total Users, regardless of whether
     the use is personal, internal, commercial, non-commercial, individual,
     organizational, hosted, local, private, or public;
  b. provide the Software or its functionality to any external third party as
     a hosted, managed, cloud, SaaS, single-tenant, or multi-tenant service;
  c. sell, rent, lease, sublicense, resell, or distribute the Software for a
     fee or other commercial advantage, whether by an individual or an
     organization;
  d. incorporate the Software as a material component of a product or service
     offered to external third parties for revenue or other commercial
     advantage;
  e. use the Software to provide paid customer delivery, implementation,
     customization, operation, consulting, or outsourcing services;
  f. use the Software in any paid, revenue-generating, resale, white-label,
     agency, marketplace, or customer-facing context; or
  g. remove, alter, obscure, hide, or replace the iPolloWork brand attribution
     required by Section 4.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 跨AI与手动交接清单能否减少错误覆盖？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将会话、文件内容摘要、选区与人工验收标准组成跨Studio交接清单，在AI修改前核对目标版本，并把导出与项目版本关联。推导自Q02的草稿/条件冲突和Q03的可编辑但未验收缺口；增量是状态与成果交接，不再新增设计引擎。最小试验各选一个网页和短片任务，注入同时手改与目标元素移动，对照现有流程和清单的错误对象修改、覆盖与人工分钟。若无错误下降或负担超过恢复收益，停止；没有真实用户材料前不称生产插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-idesign/src/client.tsx:32-42](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-idesign/src/client.tsx#L32-L42)

草稿承载目标但本段未绑定内容摘要。

<details>
<summary>查看原文（11行）</summary>

```text
        if (event.data.type === "ask-document-ai") {
          inputActions.setDraft([
            `Help me improve the current ${options.studioTitle} document.`,
            `Project: design/${projectId}`,
            "Read manifest.json, then read its entry file and linked design-tokens.css before editing.",
            "Preserve the existing structure unless I request a redesign.",
            "My requested change:",
          ].join("\n"));
          return;
        }
        inputActions.setDraft(designStudioAskAiPrompt(event.data.request));
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-idesign/lib/index.js:3692-3699](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/lib/index.js#L3692-L3699)

mtime条件与保存不代替跨步语义目标校验。

```text
	if (!input.force && input.baseUpdatedAt != null && current && Math.abs(current.mtimeMs - input.baseUpdatedAt) > .5) throw new StudioHttpError(409, input.conflictMessage ?? `${input.studioTitle} changed since it was loaded. Reload before saving.`);
	const temporary = resolve(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
	try {
		await writeFile(temporary, input.content, {
			encoding: "utf8",
			flag: "wx"
		});
		await rename(temporary, path);
```

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
