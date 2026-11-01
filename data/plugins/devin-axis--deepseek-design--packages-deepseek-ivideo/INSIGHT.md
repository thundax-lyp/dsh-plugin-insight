# deepseek-ivideo

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0a55f5e](https://github.com/Devin-AXIS/deepseek-design/tree/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo)

<!-- BEGIN META -->
[![GitHub ★ 1,661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/deepseek-design) [![npm 30d 1,023](https://img.shields.io/static/v1?label=npm+30d&message=1%2C023&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-ivideo) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-ivideo)
<!-- END META -->

> **功能**：在 DeepSeek Harness 对话中编辑、预览和导出视频。

> **亮点**：[Q01](#research-q01) 会话中提供视频视图；[Q02](#research-q02) 工作区绑定和模型校验为可解释接线，编辑渲染继承打包运行时。

> **主要限制**：[Q03](#research-q03) 失败回滚是尽力操作，[Q04](#research-q04) 0.2.x 超出 peer 上界；视频效果未验收。

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
  - [Q01 · 谁使用视频工作台，与独立编辑器及手工导出相比改变什么？](#detail-section-11)
  - [Q02 · 入口如何绑定工作区、模板和校验结果？](#detail-section-12)
  - [Q03 · 模板替换与失败、权限和取消有何边界？](#detail-section-13)
  - [Q04 · 如何选择兼容宿主并试用，成本和退出是什么？](#detail-section-14)
  - [Q05 · 已有限制校验下，怎样帮助用户判断是否可交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户希望在对话和视频时间线之间迭代短视频。

用户可在独立视频编辑器中编辑和导出，再手动转交素材。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话视频视图 | 打开编辑工作台 | 需要注册工作区与兼容 Web 宿主 |
| 模板切换 | 应用内置模板 | 失败仅尽力恢复 |
| 模型校验 | 返回受限采样报告 | 不等于成片质量验收 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| Node >=22 和兼容 DSH Web | 必需 | 注册视图和服务 | 无法按声明接入 |
| 注册工作区 | 必需 | 定位会话视频文件 | 请求拒绝 |
| 打包 HyperFrames 与浏览器依赖 | 编辑和预览需要 | 渲染及校验 | 环境异常需排障 |
| 可信素材及模型 | 按任务需要 | 内容生成 | 成本和质量需核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核 peer、授权与工作区并备份 | 不兼容则停止 |
| 编辑 | 选模板或从空白创建 | 核项目和预览 |
| 验证 | 调模型校验并查看报告 | 未知或失败不当通过 |
| 导出 | 用户观看导出结果 | 逐段复看并保留备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 浏览器及存储需求未知 | 核版本与素材授权 | peer 上界限制 |
| 编辑 | 计算、渲染和模型费用未知 | 时间线调整 | 成片效果未测 |
| 失败 | 备份存储成本未知 | 检查恢复及重新导出 | 失败恢复不保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话集成 | 视图与工作区参数接线 | 宿主实际兼容 |
| 校验 | 有限采样与结构化结果 | 整片质量和成功导出 |
| 模板替换 | 暂存、锁与尽力恢复 | 每种故障都恢复 |

> **思考**：[Q03](#research-q03) 失败回滚是尽力操作，[Q04](#research-q04) 0.2.x 超出 peer 上界；视频效果未验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 会话中提供视频视图；[Q02](#research-q02) 工作区绑定和模型校验为可解释接线，编辑渲染继承打包运行时。

[Q02](#research-q02) 校验采样有限；[Q03](#research-q03) 恢复失败可能被吞掉，不能假定旧文件必然恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 失败回滚是尽力操作，[Q04](#research-q04) 0.2.x 超出 peer 上界；视频效果未验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 确认 peer 范围后在隔离工作区备份并试一段视频；审查成片再使用，失败时手动核对恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查入口、模板和校验代表路径；未运行宿主或真实导出。

- 已检查：作者 README、包清单、源码路径 packages/deepseek-ivideo/README.md、packages/deepseek-ivideo/lib/client.js、packages/deepseek-ivideo/lib/index.js、packages/deepseek-ivideo/lib/runtime-BI3St-zK.js、packages/deepseek-ivideo/package.json 及固定范围 inventory；组件：packages/deepseek-ivideo。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定组件的 README、清单、客户端、服务入口与运行时代表路径；未运行目标、宿主、模型、浏览器或视频导出。
- 下一步：[Q05](#research-q05) 先确认现有 Studio 有无等价收据，再在故障样片上比较。

**分析版本**

- **仓库**：[Devin-AXIS/deepseek-design](https://github.com/Devin-AXIS/deepseek-design)
- **版本号**：0.5.0（[固定提交 0a55f5e](https://github.com/Devin-AXIS/deepseek-design/tree/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设将检查范围、项目和成片绑定为收据帮助决定是否审片；尚未验证。

[Q05](#research-q05) 先确认现有 Studio 有无等价收据，再在故障样片上比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 276 | 244970 | 228521 | 15187 | — |
| .md | source | 10 | 615 | — | — | 5458 |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对视频会话接线、模板替换、校验与兼容条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用视频工作台，与独立编辑器及手工导出相比改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:13-17、19-31 描述在对话里生成、编辑并预览视频，素材与项目保存在工作区。相比切换独立视频编辑器和手工转交内容，client.js:125-148 确有注册 Video 会话视图并嵌入 Studio iframe；编辑和渲染能力继承打包的 HyperFrames 而非本组件独创。没有真实用户时间或成片质量对照，不能据此声称提高效率或视频质量。

#### 证据与依据

**依据 1 · 作者声明**：[packages/deepseek-ivideo/README.md:13-31](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/README.md#L13-L31)

作者描述场景及内置能力。

<details>
<summary>查看原文（19行）</summary>

```text
## 让 DeepSeek Harness 真正拥有视频创作能力

`deepseek-ivideo` 将 iPolloWork 的同一个 Video Studio 作为原生 **Video** 视图加入 DeepSeek Harness。它直接复用 iPolloWork 的 `VideoPanel` 和定制 HyperFrames 时间线、可视化编辑器、动画系统、预览及视频导出能力，不维护第二套编辑器、顶部栏或渲染链路。

你可以让 Harness 从对话生成或修改整段视频，也可以在画面中选中标题、图片、素材或其他元素，通过 **Ask AI** 只修改当前对象。所有操作仍落在当前工作区的真实 HTML、CSS、素材和项目文件中，可继续手动精调、预览和导出。

### 核心能力

- DeepSeek Harness 对话中的原生 **Video** 视图
- HyperFrames 时间线、可视化编辑、动画、素材和实时预览
- 28 个内置可编辑 Video 模板
- 跟随主题的可复用组件库，可从 Studio 直接加入时间线
- 统一的组件变量表单与 AI 可读数据契约
- 西班牙、美国、美国六边形、世界、气泡和流向等 6 类地图组件
- 整段视频与选区级 **Ask AI**
- `ipollowork_video_validate` 自动校验工具
- HyperFrames 原生视频导出
- 每个工作区会话独立运行，空闲自动回收
- 真实项目保存在 `video/<sessionId>/`
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-ivideo/lib/client.js:125-148](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/client.js#L125-L148)

注册会话视图并嵌入 Studio。

<details>
<summary>查看原文（24行）</summary>

```text
			const query = new URLSearchParams({
				workspaceId: String(workspace.workspaceId),
				sessionId: String(sessionId),
				viewId: viewIdRef.current
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				style: shellStyle,
				"aria-label": "iVideo by iPolloWork",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
					ref: iframeRef,
					title: "iVideo by iPolloWork",
					src: `/ipollowork-video/studio/?${query.toString()}`,
					style: frameStyle,
					sandbox: "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
				})
			});
		}
		function apply(ctx) {
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "ipollowork-video-studio",
				order: 22,
				label: "Video"
			}, VideoView));
```

</details>

#### 缺口

- 未做真实任务及质量对照
  **影响**：不能证明节时与成片质量
  **进一步探讨**：用同素材比较独立编辑器和会话工作台。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口如何绑定工作区、模板和校验结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

client.js:125-148 把 workspaceId、sessionId 和 viewId 传入 iframe；index.js:83-90、126-150 校验 API token、解析已注册工作区并调用模板应用；index.js:165-205 将模型校验工具绑定工作区与 session，再传取消信号并返回结果。runtime:16848-16870 调用 check，限制采样 5、问题 40，解析失败可返回 report=null，ok 仅由退出码判断。导出路径和渲染器整体未逐行核查，不能把工具成功当成最终视频品质或导出成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepseek-ivideo/lib/client.js:125-148](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/client.js#L125-L148)

会话视图与 iframe 参数。

<details>
<summary>查看原文（24行）</summary>

```text
			const query = new URLSearchParams({
				workspaceId: String(workspace.workspaceId),
				sessionId: String(sessionId),
				viewId: viewIdRef.current
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
				style: shellStyle,
				"aria-label": "iVideo by iPolloWork",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
					ref: iframeRef,
					title: "iVideo by iPolloWork",
					src: `/ipollowork-video/studio/?${query.toString()}`,
					style: frameStyle,
					sandbox: "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
				})
			});
		}
		function apply(ctx) {
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "ipollowork-video-studio",
				order: 22,
				label: "Video"
			}, VideoView));
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-ivideo/lib/index.js:83-90](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/index.js#L83-L90)

API token 与会话接线。

```text
async function handleApi(runtime, ctx, req, res, url) {
	requireStudioToken(req, TOKEN_HEADER, runtime.token, STUDIO_TITLE);
	const action = url.pathname.slice(`${ROUTE_ROOT}/api`.length);
	if (req.method === "GET" && action === "/session") {
		const workspaceId = url.searchParams.get("workspaceId")?.trim();
		const rawSessionId = url.searchParams.get("sessionId")?.trim();
		if (!workspaceId || !rawSessionId) throw new StudioHttpError(400, "Missing workspaceId or sessionId.");
		sendJson(res, 200, await session(runtime, workspaceRoot(ctx, workspaceId), rawSessionId, url.searchParams.get("viewId")?.trim()));
```

**依据 3 · 源码核查**：[packages/deepseek-ivideo/lib/index.js:126-150](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/index.js#L126-L150)

模板目录及应用入口。

<details>
<summary>查看原文（25行）</summary>

```text
	if (req.method === "GET" && action === "/templates") {
		const workspaceId = url.searchParams.get("workspaceId")?.trim();
		if (!workspaceId) throw new StudioHttpError(400, "Missing workspaceId.");
		workspaceRoot(ctx, workspaceId);
		sendJson(res, 200, templateCatalog(await bundledTemplates(runtime)));
		return;
	}
	if (req.method === "GET" && action === "/template-cover") {
		const workspaceId = url.searchParams.get("workspaceId")?.trim();
		const templateId = url.searchParams.get("templateId")?.trim();
		if (!workspaceId || !templateId) throw new StudioHttpError(400, "Missing workspaceId or templateId.");
		workspaceRoot(ctx, workspaceId);
		await streamTemplateCover(res, templateById(await bundledTemplates(runtime), templateId));
		return;
	}
	if (req.method === "POST" && action === "/template") {
		const body = await requestObject(req);
		sendJson(res, 200, await applyTemplate({
			runtime,
			workspaceRoot: workspaceRoot(ctx, stringField(field(body, "workspaceId"), "workspaceId")),
			sessionId: stringField(field(body, "sessionId"), "sessionId"),
			templateId: stringField(field(body, "templateId"), "templateId"),
			viewId: typeof field(body, "viewId") === "string" ? String(field(body, "viewId")).trim() : void 0
		}));
		return;
```

</details>

**依据 4 · 源码核查**：[packages/deepseek-ivideo/lib/index.js:165-205](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/index.js#L165-L205)

校验工具传参、信号及结果。

<details>
<summary>查看原文（41行）</summary>

```text
function validationTool(runtime, ctx) {
	return defineTool({
		name: "ipollowork_video_validate",
		description: "Validate the editable HyperFrames video belonging to one DeepSeek Harness workspace and conversation session.",
		parameters: {
			workspaceId: {
				type: "string",
				required: true,
				description: "DeepSeek Harness workspace id."
			},
			sessionId: {
				type: "string",
				required: true,
				description: "Conversation session id owning video/<sessionId>."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: true
			},
			render: (_args, value) => [{
				type: "text",
				text: JSON.stringify(value, null, 2)
			}]
		},
		timeoutMs: 12e4,
		async execute(args, exec) {
			const root = workspaceRoot(ctx, args.workspaceId);
			const result = await runtime.manager.validate({
				workspaceRoot: root,
				sessionId: sessionId(args.sessionId),
				signal: exec.signal
			});
			return {
				ok: result.ok,
				exitCode: result.exitCode,
				report: result.report,
				output: result.output,
				project: videoProjectDirectory(args.sessionId)
			};
```

</details>

**依据 5 · 源码核查**：[packages/deepseek-ivideo/lib/runtime-BI3St-zK.js:16848-16870](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/runtime-BI3St-zK.js#L16848-L16870)

固定 check 参数与有限结果。

<details>
<summary>查看原文（23行）</summary>

```text
	async validate(input) {
		const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
		await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
		const result = await this.runCommand([
			"check",
			identity.projectPath,
			"--json",
			"--samples",
			"5",
			"--max-issues",
			"40"
		], identity.projectPath, input.signal);
		let report = null;
		try {
			report = JSON.parse(result.stdout.trim());
		} catch {
			report = null;
		}
		return {
			ok: result.exitCode === 0,
			exitCode: result.exitCode,
			report,
			output: (result.stderr.trim() || result.stdout.trim()).slice(-32e3)
```

</details>

#### 缺口

- 未验证导出链、环境和结果
  **影响**：源码未证明成片成功
  **进一步探讨**：隔离会话运行校验及导出并核验产物。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模板替换与失败、权限和取消有何边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

index.js:37-79 对同工作区会话加操作锁，先停运行器再尝试模板替换；失败后尝试重新启动并重新抛错。runtime:16677-16708 验证模板、重命名旧项目为备份、安装后再验证，失败时清理并尝试恢复；恢复 rename 的异常被吞掉，因而不能保证失败时旧项目必然恢复。runtime:16434-16443 检查 token 和相对路径，index.js:93-105 限读取项目目录；runCommand:16999-17019 为取消注册终止自有子进程，但不证明整个浏览器或渲染任务均已停止。切换前应自行备份并检查实际项目状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepseek-ivideo/lib/index.js:37-79](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/index.js#L37-L79)

停预览、串行替换与失败重启。

<details>
<summary>查看原文（43行）</summary>

```text
async function applyTemplate(input) {
	const id = sessionId(input.sessionId);
	const template = templateById(await bundledTemplates(input.runtime), input.templateId);
	const operationKey = `${input.workspaceRoot}:${videoProjectId(id)}`;
	return withOperationLock(input.runtime.switches, operationKey, async () => {
		const projectsRoot = dirname((await input.runtime.manager.start({
			workspaceRoot: input.workspaceRoot,
			sessionId: id
		})).projectPath);
		await input.runtime.manager.stop({
			workspaceRoot: input.workspaceRoot,
			sessionId: id
		});
		try {
			return await applyBundledTemplate({
				operations: input.runtime.operations,
				operationKey,
				template,
				projectsRoot,
				projectId: videoProjectId(id),
				prepareStaged: async (directory) => {
					await writeFile(resolve(directory, "brief.json"), `${JSON.stringify({
						title: template.manifest.title,
						templateId: template.manifest.id,
						createdBy: "deepseek-harness"
					}, null, 2)}\n`, "utf8");
				},
				validateInstalled: async () => {
					if (!allowsVideoTemplate(templateManifestV1Schema.parse(JSON.parse(await readFile(resolve(projectsRoot, videoProjectId(id), "manifest.json"), "utf8"))))) throw new StudioHttpError(409, "The installed template is not an iVideo template.");
					return input.runtime.manager.start({
						workspaceRoot: input.workspaceRoot,
						sessionId: id,
						viewId: input.viewId
					});
				}
			});
		} catch (error) {
			await input.runtime.manager.start({
				workspaceRoot: input.workspaceRoot,
				sessionId: id,
				viewId: input.viewId
			}).catch(() => void 0);
			throw error;
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-ivideo/lib/runtime-BI3St-zK.js:16677-16708](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/runtime-BI3St-zK.js#L16677-L16708)

暂存、验证及尽力恢复。

<details>
<summary>查看原文（32行）</summary>

```text
			const stagedManifest = templateManifestV1Schema.parse(JSON.parse(await readFile(resolve(staged, "manifest.json"), "utf8")));
			if (stagedManifest.id !== input.template.manifest.id || stagedManifest.version !== input.template.manifest.version) throw new StudioHttpError(409, "Template changed while it was being applied.");
			if (input.prepareStaged) await input.prepareStaged(staged);
			else await writeFile(resolve(staged, "brief.json"), "{}\n", "utf8");
			const current = await lstat(target).catch((error) => {
				if (errorCode(error) === "ENOENT") return null;
				throw error;
			});
			if (current) {
				if (!current.isDirectory() || current.isSymbolicLink()) throw new StudioHttpError(409, "The current Studio project path is not replaceable.");
				await rename(target, backup);
				movedCurrent = true;
			}
			await rename(staged, target);
			installedNew = true;
			const result = await input.validateInstalled();
			if (movedCurrent) await rm(backup, {
				recursive: true,
				force: true
			});
			return result;
		} catch (error) {
			await rm(staged, {
				recursive: true,
				force: true
			});
			if (installedNew) await rm(target, {
				recursive: true,
				force: true
			});
			if (movedCurrent) await rename(backup, target).catch(() => void 0);
			throw error;
```

</details>

**依据 3 · 源码核查**：[packages/deepseek-ivideo/lib/runtime-BI3St-zK.js:16434-16443](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/runtime-BI3St-zK.js#L16434-L16443)

令牌与路径检查。

<details>
<summary>查看原文（10行）</summary>

```text
function requireStudioToken(req, header, expected, studioTitle) {
	if (req.headers[header] !== expected) throw new StudioHttpError(403, `${studioTitle} request is not authorized.`);
}
function safeRelativePath(value, prefix, studioTitle) {
	const normalized = value.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
	if (!normalized || isAbsolute(normalized) || normalized.includes("\0")) throw new StudioHttpError(400, `Invalid ${studioTitle} file path.`);
	if (normalized.split("/").some((part) => !part || part === "." || part === "..")) throw new StudioHttpError(400, `Invalid ${studioTitle} file path.`);
	const prefixRoot = prefix.replace(/\/+$/, "");
	if (normalized !== prefixRoot && !normalized.startsWith(`${prefixRoot}/`)) throw new StudioHttpError(403, `${studioTitle} can only access the workspace ${prefixRoot} folder.`);
	return normalized;
```

</details>

**依据 4 · 源码核查**：[packages/deepseek-ivideo/lib/index.js:93-105](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/index.js#L93-L105)

读取约束到会话项目目录。

<details>
<summary>查看原文（13行）</summary>

```text
	if (req.method === "GET" && action === "/file") {
		const workspaceId = url.searchParams.get("workspaceId")?.trim();
		const rawSessionId = url.searchParams.get("sessionId")?.trim();
		const path = url.searchParams.get("path")?.trim();
		if (!workspaceId || !rawSessionId || !path) throw new StudioHttpError(400, "Missing workspaceId, sessionId, or path.");
		const id = sessionId(rawSessionId);
		sendJson(res, 200, await readStudioText({
			root: workspaceRoot(ctx, workspaceId),
			requested: path,
			prefix: videoProjectDirectory(id),
			studioTitle: STUDIO_TITLE,
			maxBytes: MAX_TEXT_BYTES
		}));
```

</details>

**依据 5 · 源码核查**：[packages/deepseek-ivideo/lib/runtime-BI3St-zK.js:16999-17019](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/runtime-BI3St-zK.js#L16999-L17019)

取消信号关联命令子进程。

<details>
<summary>查看原文（21行）</summary>

```text
	async runCommand(args, cwd, signal) {
		const child = this.spawnCommand(args, cwd);
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (chunk) => {
			stdout = appendBounded(stdout, chunk.toString());
		});
		child.stderr.on("data", (chunk) => {
			stderr = appendBounded(stderr, chunk.toString());
		});
		return new Promise((resolvePromise, reject) => {
			const abort = () => killOwnedProcess(child);
			signal?.addEventListener("abort", abort, { once: true });
			child.once("error", reject);
			child.once("exit", (code) => {
				signal?.removeEventListener("abort", abort);
				resolvePromise({
					exitCode: code ?? 1,
					stdout,
					stderr
				});
```

</details>

#### 缺口

- 未故障注入和完整安全审计
  **影响**：回滚与进程清理不能保证
  **进一步探讨**：备份后注入文件替换和重启失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何选择兼容宿主并试用，成本和退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:39-41 要求 Node >=22，72-79 的 DSH peer 上界为 <0.2.0-0，不能将 0.2.x 宿主视为清单支持；README:35-37 说明打包自带定制 HyperFrames，依赖清单还包含浏览器、图像及原生运行库。渲染耗时、算力、存储和模型费用均未测，模板覆盖与素材授权需用户自行审查。先在符合 peer 的隔离工作区备份项目、试一段无敏感素材的视频，核实预览、校验和导出；出现加载失败、结果未知或替换错误时停止并核查备份，不推断自动恢复成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepseek-ivideo/package.json:39-41](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/package.json#L39-L41)

Node 下限。

```text
  "license": "SEE LICENSE IN LICENSE",
  "engines": {
    "node": ">=22"
```

**依据 2 · 源码核查**：[packages/deepseek-ivideo/package.json:58-79](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/package.json#L58-L79)

浏览器、原生依赖与宿主 peer 范围。

<details>
<summary>查看原文（22行）</summary>

```text
  "dependencies": {
    "@hono/node-server": "^1.8.0",
    "@puppeteer/browsers": "^3.0.6",
    "adm-zip": "^0.5.16",
    "compare-versions": "^6.1.1",
    "esbuild": "^0.25.12",
    "fontkit": "^2.0.4",
    "hono": "^4.0.0",
    "onnxruntime-node": "1.23.2",
    "open": "^10.0.0",
    "postcss": "^8.5.8",
    "puppeteer-core": "^25.2.1",
    "sharp": "^0.34.5"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-runtime": ">=0.0.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.0.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.0.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-workspace": ">=0.0.1-rc.1 <0.2.0-0",
    "react": "^18.2.0"
```

</details>

**依据 3 · 作者声明**：[packages/deepseek-ivideo/README.md:35-37](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/README.md#L35-L37)

作者说明打包运行时。

```text
## 安装并启动

要求 Node.js 22 或更高版本。发布包内置从 iPolloWork 主仓库构建的定制 HyperFrames 运行时，当前源版本为 `0.8.140`；不会在安装时另外下载同名公共 npm 版本。
```

**依据 4 · 源码核查**：[packages/deepseek-ivideo/lib/runtime-BI3St-zK.js:16685-16708](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/runtime-BI3St-zK.js#L16685-L16708)

替换失败可能需要手工确认恢复。

<details>
<summary>查看原文（24行）</summary>

```text
			if (current) {
				if (!current.isDirectory() || current.isSymbolicLink()) throw new StudioHttpError(409, "The current Studio project path is not replaceable.");
				await rename(target, backup);
				movedCurrent = true;
			}
			await rename(staged, target);
			installedNew = true;
			const result = await input.validateInstalled();
			if (movedCurrent) await rm(backup, {
				recursive: true,
				force: true
			});
			return result;
		} catch (error) {
			await rm(staged, {
				recursive: true,
				force: true
			});
			if (installedNew) await rm(target, {
				recursive: true,
				force: true
			});
			if (movedCurrent) await rename(backup, target).catch(() => void 0);
			throw error;
```

</details>

#### 缺口

- 未测各操作系统、依赖安装与费用
  **影响**：兼容性、耗时和恢复成本未知
  **进一步探讨**：符合 peer 的隔离宿主试用并检查备份与成片。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有限制校验下，怎样帮助用户判断是否可交付？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有校验已提供 ok、exitCode、JSON report 和截断输出，且通过 5 个样本与 40 条问题限制；再加一个通过标记没有增量。未验证设想是将本次导出与项目版本绑定的检查收据交给用户，明确列出检查范围、未覆盖时间段、导出文件摘要、可人工复看的代表帧及失败／未知项，帮助决定继续审片还是重新导出。不得将采样通过当整片质量保证。对照现有工具报告，用尾段错帧、缺字体、过期导出和无效 JSON 注入比较漏判与审片时间；若无法确认项目与成片对应、增益不明显或增加大量人工负担，则否定。先查 Studio 界面是否已有等价收据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepseek-ivideo/lib/index.js:165-205](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/index.js#L165-L205)

现有校验工具返回字段。

<details>
<summary>查看原文（41行）</summary>

```text
function validationTool(runtime, ctx) {
	return defineTool({
		name: "ipollowork_video_validate",
		description: "Validate the editable HyperFrames video belonging to one DeepSeek Harness workspace and conversation session.",
		parameters: {
			workspaceId: {
				type: "string",
				required: true,
				description: "DeepSeek Harness workspace id."
			},
			sessionId: {
				type: "string",
				required: true,
				description: "Conversation session id owning video/<sessionId>."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: true
			},
			render: (_args, value) => [{
				type: "text",
				text: JSON.stringify(value, null, 2)
			}]
		},
		timeoutMs: 12e4,
		async execute(args, exec) {
			const root = workspaceRoot(ctx, args.workspaceId);
			const result = await runtime.manager.validate({
				workspaceRoot: root,
				sessionId: sessionId(args.sessionId),
				signal: exec.signal
			});
			return {
				ok: result.ok,
				exitCode: result.exitCode,
				report: result.report,
				output: result.output,
				project: videoProjectDirectory(args.sessionId)
			};
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-ivideo/lib/runtime-BI3St-zK.js:16848-16870](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/lib/runtime-BI3St-zK.js#L16848-L16870)

现有采样、限制及 JSON 解析回退。

<details>
<summary>查看原文（23行）</summary>

```text
	async validate(input) {
		const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
		await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
		const result = await this.runCommand([
			"check",
			identity.projectPath,
			"--json",
			"--samples",
			"5",
			"--max-issues",
			"40"
		], identity.projectPath, input.signal);
		let report = null;
		try {
			report = JSON.parse(result.stdout.trim());
		} catch {
			report = null;
		}
		return {
			ok: result.exitCode === 0,
			exitCode: result.exitCode,
			report,
			output: (result.stderr.trim() || result.stdout.trim()).slice(-32e3)
```

</details>

**依据 3 · 作者声明**：[packages/deepseek-ivideo/README.md:63-69](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/packages/deepseek-ivideo/README.md#L63-L69)

作者描述用户编辑与导出步骤。

```text
1. 在项目目录中启动 DeepSeek Harness。
2. 创建对话并打开 **Video** 视图。
3. 点击顶部 **模板** 选择一个视频模板，或从空白项目开始。
4. 在对话中让 AI 生成或修改视频；也可以选中画面元素后点击 **Ask AI**。
5. 在时间线中预览并精调，最后使用 HyperFrames 原生导出功能生成视频。

**Ask AI** 只会把经过校验的文件、元素定位、文字、素材和样式信息写入当前对话草稿，不会自动发送或直接执行。
```

#### 缺口

- 未穷尽 Studio UI、没有收据原型
  **影响**：增量和用户收益未知
  **进一步探讨**：先核界面等价功能，再比较故障样片。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
