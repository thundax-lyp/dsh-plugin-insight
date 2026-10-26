# Reactive Resume

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[5d247c5](https://github.com/reactive-resume/reactive-resume/tree/5d247c59de925b04e6e658300524812c7f544ec4)

<!-- BEGIN META -->
[![GitHub ★ 44,843](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44%2C843&color=yellow&logo=github&style=flat)](https://github.com/reactive-resume/reactive-resume)
<!-- END META -->

> **实现功能**：开源简历与求职应用，组织编辑、导出、内容检查、AI建议及投递记录。

> **核心亮点**：相对Word加独立岗位表，将结构化履历、设计/检查和投递文档组织在同流程，并以Schema/JSON Patch暴露Agent接口；不证明招聘结果改善。[Q01](#research-q01)

> **风险与缺陷**：规则分数/关键词匹配不等跨ATS兼容或录用概率，AI分隔符封装不保证事实与指令安全，保存接口存在也不等离线恢复已验收。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 它是什么类型，简历工作流增加了什么？](#detail-section-11)
  - [Q02 · 草稿、导出和MCP如何管理状态与身份？](#detail-section-12)
  - [Q03 · 检查和AI改善的承诺到哪里？](#detail-section-13)
  - [Q04 · 怎样可控试用，什么假设值得验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复按岗位调整履历、求职信及跟踪投递版本的用户；独立应用，MCP可供Agent连接。[Q01](#research-q01)

文本编辑器/Word写简历、浏览器检查PDF、表格跟踪岗位；同履历和岗位比较错误、返工与时间，不比较录用率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|简历编辑/导出|结构化求职文档|事实与PDF需用户验收|
|岗位/内容检查|定位规则及词项缺口|不是录用概率|
|MCP接入|Agent文档管理|API/Bearer身份与权限|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|应用账号或自托管环境|必需|编辑与持久化|先用脱敏本地样本|
|正确履历与岗位信息|内容判断必需|事实与相关性|人工核实后导入|
|模型/搜索provider|AI/搜索时必需|可选辅助|使用确定性编辑检查|
|数据权限与备份|试用必需|防公开分享与丢失|先关闭分享、验证恢复|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|导入虚构履历|用户核对字段|保留原数据|
|编辑检查并导出|用户核实事实及提取顺序|切换模板/修正|
|断网恢复再下载|用户确认版本一致|查未保存状态，不重复投递|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|账号或自托管运行资源|导入、事实与模板校对|部署/整理工时|
|持续|可选模型/搜索及存储|按岗位修订和验收|每合格文档总成本|
|失败恢复|备份、重试及版本恢复|核对草稿、导出和已发文档|冲突恢复与工时|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|文档流程|保存状态与结构化工具|真实节时与恢复|
|内容检查|规则/词项与PDF范围|跨ATS表现|
|AI辅助|数据封装及作者接受/拒绝流程|事实保持与录用收益|

> **思考**：规则分数/关键词匹配不等跨ATS兼容或录用概率，AI分隔符封装不保证事实与指令安全，保存接口存在也不等离线恢复已验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对Word加独立岗位表，将结构化履历、设计/检查和投递文档组织在同流程，并以Schema/JSON Patch暴露Agent接口；不证明招聘结果改善。[Q01](#research-q01)

相对Word加独立岗位表，将结构化履历、设计/检查和投递文档组织在同流程，并以Schema/JSON Patch暴露Agent接口；不证明招聘结果改善。[Q01](#research-q01)

明确未保存状态、私有短期下载和MCP去cookie身份边界值得复用；移植须保留用户归属、导出一致性与最终文件验收。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

规则分数/关键词匹配不等跨ATS兼容或录用概率，AI分隔符封装不保证事实与指令安全，保存接口存在也不等离线恢复已验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先以虚构/脱敏履历试用非AI编辑、导出和检查，验收权限与PDF再接模型；不用规则分替代事实或招聘效果判断。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持状态/身份及检查接口；真实保存恢复、PDF与AI质量未验证；最终PDF事实门假设未验证。

- 已检查：作者 README、包清单、源码路径 apps/server/src/mcp/server.ts、apps/server/src/mcp/auth.ts、apps/server/src/http/resume-pdf.ts、apps/web/src/features/resume/builder/draft.ts、packages/api/src/features/resume/checks.ts、packages/api/src/features/ai/data-block.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定提交抽读草稿状态、MCP认证/接线、PDF下载及内容/岗位检查接口；inventory仅子集，未审计全部模板、渲染、存储与AI模型流程，未执行。
- 下一步：用虚构履历核对权限、断网恢复、冲突、导出提取顺序、AI事实变更和公开链接；独立记录文档质量与总成本。

**分析版本**

- **仓库**：[reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume)
- **版本号**：6.0.6（[固定提交 5d247c5](https://github.com/reactive-resume/reactive-resume/tree/5d247c59de925b04e6e658300524812c7f544ec4)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用导出PDF文本顺序和履历事实差异作AI修改放行门，降低最终文档错误；同履历/岗位对照错误与修正时间，无改善则否定。[Q04](#research-q04)

用虚构履历核对权限、断网恢复、冲突、导出提取顺序、AI事实变更和公开链接；独立记录文档质量与总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：85e0a56ed0c409e362b4620ca7a3e5f93219ace2c30320f06fe3d77540e05165。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 6 | 1100 | 883 | 71 | — |
| .md | source | 1 | 402 | — | — | 2889 |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=grey&logo=github&style=flat)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 44](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=44&color=grey&logo=github&style=flat)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+created%3A2026-09-26T03%3A38%3A15.707Z..2026-10-26T03%3A38%3A15.707Z) [![近30天关闭 75](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=75&color=grey&logo=github&style=flat)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A38%3A15.707Z..2026-10-26T03%3A38%3A15.707Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：结构化简历流程如何改善文档控制，保存、检查与Agent接口的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么类型，简历工作流增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是独立简历/求职应用，可提供REST/MCP，不是DSH专用插件。对象是需要反复按岗位调整简历、求职信并记录投递版本的人，合格交付是事实真实、版式可读、可提取且与岗位相关的文档，不能把ATS分数当录用概率。README描述Write/Design/Check、模板、版本、求职追踪及逐条接受AI改动，支持把编辑和检查放在同一数据模型中。相对Word加独立岗位表格，贡献是结构化数据复用、设计/检查与已发送文档关联；相对通用Agent直接写简历，MCP给出JSON Patch和Schema资源，降低接口歧义。模板数量、开源与免费声明不是招聘效果证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:79-134](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/README.md#L79-L134)

作者功能与流程范围

<details>
<summary>查看原文（56行）</summary>

```text
## Features

**Write, Design, and Check**

- Redesigned editor with inline content editing and click-to-select on the page
- Live PDF preview and browser downloads powered by Forme, rendered in a background worker
- Rich text, custom sections, drag-and-drop ordering, and structured dates with consistent formatting
- Autosave, local recovery of unsaved resume drafts, and up to 200 undo steps
- Phone and tablet layouts, keyboard shortcuts, and a searchable command bar

**Templates and Customization**

- 18 templates, including the new Porygon and Smeargle, previewed with your own content
- One-column, two-column, and ATS-safe template filters
- Font presets, custom fonts, colors, spacing, A4 and Letter paper, and left or right sidebars
- Fit overflowing content by adjusting density, margins, and text size
- Custom Styles written as Semantic CSS, with an element picker on the page

**Resume Checks**

- Readability checks with findings pinned to the relevant lines
- Job-posting keyword matching and a view of the text hiring software reads
- Checks on the exported PDF, plus an optional AI writing review
- A public [ATS checker](https://rxresu.me/ats-checker) that reads PDFs in your browser without an account

**Documents and Cover Letters**

- One searchable library for resumes and letters, with tags, sorting, and grid or list views
- Standalone cover letters with their own editor, exports, and version history
- Link a letter to a resume to keep its sender details and design in sync, or customize it independently
- Automatic and named versions you can preview and restore
- Trash with Undo and a 30-day recovery window

**Job Applications**

- List, Board, Insights, and Calendar views for tracking applications from Saved to Offer
- Save jobs from a URL or pasted posting; optional keyword search through Firecrawl, Tavily, or Exa
- Tailor a resume and draft a cover letter for a saved job
- Track contacts, notes, follow-ups, application outcomes, and the documents you sent
- Schedule interviews, export calendar events, and import or export applications as CSV

**AI Assistant**

- Assistant beside your resume or letter, with conversations tied to that document
- Proposed edits show what changes and why; accept or reject each suggestion
- Improve selected text, review writing, and draft letters from a resume and job posting
- Connect OpenAI, Anthropic, Google Gemini, OpenRouter, Ollama, or other supported providers and compatible endpoints
- Optional web search and page reading; self-hosters can configure shared AI and web-access providers

**Import, Export, and Sharing**

- Import Reactive Resume JSON, JSON Resume, LinkedIn data exports, PDF, and Word files
- JSON, LinkedIn, and readable PDF imports work without AI; Word imports require a connected provider
- Export resumes and letters as PDF, Word (DOCX), Markdown, or JSON
- Share resumes through public links with optional password protection and view/download statistics
- REST API and MCP server for document management, imports, exports, checks, and application workflows
```

</details>

**依据 2 · 源码核查**：[apps/server/src/mcp/server.ts:55-68](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/apps/server/src/mcp/server.ts#L55-L68)

工具约束、Schema和JSON Patch指导

<details>
<summary>查看原文（14行）</summary>

```text
) {
	const server = new McpServer(buildMcpServerInfo(appVersion), {
		instructions: [
			"Reactive Resume holds the user's resumes, cover letters and job applications.",
			`Find resume IDs with \`${MCP_TOOL_NAME.listResumes}\` and read one with \`${MCP_TOOL_NAME.getResume}\`; the resume JSON Schema is the \`resume://_meta/schema\` resource.`,
			`Edit resume content with JSON Patch through \`${MCP_TOOL_NAME.patchResume}\`, and change a resume's name, slug, tags or public visibility with \`${MCP_TOOL_NAME.updateResume}\`.`,
			`Track job applications with the application tools, starting from \`${MCP_TOOL_NAME.listApplications}\`.`,
			`Get a short-lived PDF link with \`${MCP_TOOL_NAME.downloadResumePdf}\`; export cover letters with \`${MCP_TOOL_NAME.exportCoverLetter}\`.`,
			"Tools named api_* expose the rest of the Reactive Resume API. Tools that involve passwords, API keys or AI provider keys return a link to finish in the app.",
		].join(" "),
	});

	const client = createRequestClient(request, authentication, trustedClient, resHeaders);
	const headers = new Headers(request.headers);
```

</details>

#### 缺口

- 缺少相同岗位简历任务的交付时间和错误率对照
  **影响**：不能证明文档正确、保存可靠或求职收益
  **进一步探讨**：用虚构简历和已知岗位对照文本编辑器/PDF基线，检查事实、提取顺序、恢复和总时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 草稿、导出和MCP如何管理状态与身份？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

draft模块显式区分idle/saving/saved/offline/error，持有pendingResume、saveFailed和deferredRemoteResume，并提供retrySave/undo等动作；这支持不把网络失败当已保存的设计意图，但本项未逐行审计整个保存执行与冲突合并，不能承诺离线无丢失。PDF下载先验证短期token与resumeId，再按verification.userId导出，设置private no-store/no-referrer并区分过期410、未授权401和限流429，较公开固定链接更易约束。MCP认证主动去cookie，只接受共享API key/Bearer解析结果，工具客户端保留authentication并融合取消signal；敏感密码/密钥操作指向应用完成。这些都是积极的身份边界，实际多用户越权、token轮换及导出一致性仍须运行验收。

#### 证据与依据

**依据 1 · 源码核查**：[apps/web/src/features/resume/builder/draft.ts:34-103](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/apps/web/src/features/resume/builder/draft.ts#L34-L103)

草稿状态和恢复接口

<details>
<summary>查看原文（70行）</summary>

```text
type ResumeUpdateMutation = "sync" | "create" | "update" | "patch" | "lock" | "password" | "delete";
type ResumeUpdateEvent = { mutation: ResumeUpdateMutation };

/**
 * `offline`: the browser is offline; changes are kept on this device and sent when it reconnects.
 * `error`: the server rejected or couldn't be reached while online; changes are kept on this device
 * and the editor offers Retry.
 */
type SaveStatus = "idle" | "saving" | "saved" | "offline" | "error";

type UpdateResumeDataOptions = {
	/**
	 * Identifies the field being edited. Consecutive edits to the same field within a second merge into
	 * one undo step, so typing a sentence undoes as a whole.
	 */
	coalesceKey?: string;
	/** Always a step of its own (structural actions such as adding, moving or deleting). */
	newStep?: boolean;
	/**
	 * Merges into the current step whenever the previous edit had the same key, however long ago: one action
	 * made of several edits, such as Fit to one page, undoes as a whole.
	 */
	sameStep?: boolean;
};

type ResumeStoreState = {
	resume: Resume | null;
	resumeId?: string | undefined;
	isReady: boolean;
	saveStatus: SaveStatus;
	// Undo/redo stacks of `ResumeData` references. Immer's immutable updates share structure, so a
	// step costs only the parts that changed.
	undoStack: ResumeData[];
	redoStack: ResumeData[];
};

type ResumeStoreActions = {
	initialize: (resume: Resume | null) => void;
	reset: () => void;
	replaceResumeFromServer: (resume: Resume) => void;
	updateResumeData: (fn: (draft: WritableDraft<ResumeData>) => void, options?: UpdateResumeDataOptions) => void;
	patchResume: (fn: (draft: WritableDraft<Resume>) => void) => void;
	mergeResumeMetadata: (resume: Resume) => void;
	setSaveStatus: (status: SaveStatus) => void;
	undo: () => void;
	redo: () => void;
	/** Sends the latest unsaved changes again, e.g. from the "Not saved · Retry" status. */
	retrySave: () => void;
};

type ResumeStore = ResumeStoreState & ResumeStoreActions;

type Runtime = {
	abortController: AbortController;
	queryClient?: QueryClient;
	hasPendingLocalChanges: boolean;
	isSaving: boolean;
	pendingResume?: Resume | undefined;
	/** The last save failed; don't loop on it. Cleared by the next edit, Retry, reconnecting or success. */
	saveFailed: boolean;
	slowSaveToastId?: string | undefined;
	syncResume: ReturnType<typeof debounce<(resume: Resume) => void>>;
	beforeUnloadHandler?: () => void;
	onlineHandler?: () => void;
	deferredRemoteResume?: Resume | undefined;
	deferredFocusHandler?: (() => void) | undefined;
	/** This visit's saves share one autosave version in History. */
	sessionId: string;
};

```

</details>

**依据 2 · 源码核查**：[apps/server/src/http/resume-pdf.ts:1-50](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/apps/server/src/http/resume-pdf.ts#L1-L50)

下载token及私有响应

<details>
<summary>查看原文（50行）</summary>

```text
import { createResumePdfDownload, verifyResumePdfDownloadToken } from "@reactive-resume/api/features/resume/export";

const downloadHeaders = {
	"Cache-Control": "private, no-store",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "no-referrer",
};

const text = (body: string, status: number, extra: Record<string, string> = {}) =>
	new Response(body, { status, headers: { ...downloadHeaders, ...extra } });

function errorStatus(error: unknown) {
	const code = typeof error === "object" && error && "code" in error ? (error as { code?: unknown }).code : undefined;
	if (code === "TOO_MANY_REQUESTS" || code === "RATE_LIMIT_EXCEEDED") return 429;
	return code === "NOT_FOUND" ? 404 : 500;
}

export async function handleResumePdfDownload(request: Request, id: string) {
	const searchParams = new URL(request.url).searchParams;
	const token = searchParams.get("token");
	if (!token) return text("Unauthorized", 401);

	const verification = verifyResumePdfDownloadToken({ resumeId: id, token });
	if (!verification.ok)
		return verification.reason === "expired" ? text("Download link expired", 410) : text("Unauthorized", 401);
	// Links made before letters left resumes may ask for the resume's cover letter, which is now a letter of its own.
	const target = searchParams.get("target");
	if (target && target !== "resume") return text("Not found", 404);

	try {
		const resHeaders = new Headers();
		const download = await createResumePdfDownload({ id, userId: verification.userId, resHeaders });

		return new Response(download.body, {
			headers: {
				...Object.fromEntries(resHeaders),
				"Content-Type": download.body.type || "application/pdf",
				"Content-Disposition": download.headers["content-disposition"],
				...downloadHeaders,
			},
		});
	} catch (error) {
		const status = errorStatus(error);
		if (status === 500) console.error("[PDF Download]", { name: error instanceof Error ? error.name : "Unknown" });
		const reset =
			typeof error === "object" && error && "data" in error ? (error.data as { reset?: number })?.reset : undefined;
		if (status !== 429) return text("Couldn't generate the resume PDF. Try again.", status);
		return text("Too many PDF exports. Try again in a few minutes.", 429, {
			"Retry-After": String(reset ? Math.max(1, Math.ceil((reset - Date.now()) / 1000)) : 60),
		});
```

</details>

**依据 3 · 源码核查**：[apps/server/src/mcp/auth.ts:9-16](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/apps/server/src/mcp/auth.ts#L9-L16)

MCP排除cookie认证

```text
export async function authenticateRequest(request: Request) {
	// MCP accepts API keys and bearer tokens; share their priority and validation with its oRPC tools.
	const headers = new Headers(request.headers);
	headers.delete("cookie");
	const authentication = await resolveAuthenticationFromRequestHeaders(headers);
	if (authentication) return authentication;
	throw new AuthError();
}
```

**依据 4 · 源码核查**：[apps/server/src/mcp/server.ts:20-48](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/apps/server/src/mcp/server.ts#L20-L48)

工具请求身份与取消

<details>
<summary>查看原文（29行）</summary>

```text
	request: Request,
	authentication: RequestAuthentication,
	trustedClient: string,
	resHeaders: Headers,
): RouterClient<typeof MCP_ROUTER> {
	const reqHeaders = new Headers(request.headers);
	reqHeaders.delete("cookie");
	return createRouterClient(MCP_ROUTER, {
		interceptors: [
			(options) => {
				request.signal.throwIfAborted();
				return options.next({
					...options,
					signal: options.signal ? AbortSignal.any([request.signal, options.signal]) : request.signal,
				});
			},
			onError((error) => {
				console.error("[MCP oRPC]", { name: error instanceof Error ? error.name : "Unknown" });
			}),
		],
		context: () => ({
			locale: getRequestLocale(request),
			reqHeaders,
			resHeaders,
			trustedClient,
			authentication,
		}),
	});
}
```

</details>

#### 缺口

- 保存冲突、token范围及实际导出一致性未运行验证
  **影响**：不能证明文档正确、保存可靠或求职收益
  **进一步探讨**：用虚构简历和已知岗位对照文本编辑器/PDF基线，检查事实、提取顺序、恢复和总时间

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 检查和AI改善的承诺到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

checks将内容lint和岗位term matching作为确定性功能，并返回findings/score；PDF接口声明25MB、最多30页且报告truncation/skipped，说明结果有显式覆盖范围。关键词匹配只反映词项存在，并不证明经验真实或匹配招聘者判断；规则得分也不代表所有ATS供应商解析一致，更不能推导面试/录用率。AI dataBlock替换<<<>>>标记防止不可信文本提前闭合分隔，但这只是结构封装，不证明模型不会服从求职文案中的指令。作者声明AI建议可接受/拒绝，用户仍须逐项核实不能凭空新增经历。没有真实招聘反馈时，贡献应限定为编辑/可读性辅助。

#### 证据与依据

**依据 1 · 源码核查**：[packages/api/src/features/resume/checks.ts:24-47](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/packages/api/src/features/resume/checks.ts#L24-L47)

确定性内容检查与分数

<details>
<summary>查看原文（24行）</summary>

```text
	.route({
		method: "GET",
		path: "/resumes/{id}/checks",
		tags: ["Resumes"],
		operationId: "getResumeChecks",
		summary: "Check resume content for ATS issues",
		description:
			"Runs the editor's deterministic contact, date, layout, heading and writing checks. Respects ignored findings saved on the resume.",
	})
	.input(z.object({ id: z.string().min(1) }))
	.output(
		z.object({
			findings: z.array(finding).readonly(),
			ignored: z.array(finding).readonly(),
			counts: z.object({ error: z.number(), warning: z.number(), info: z.number() }),
			totalRules: z.number(),
			passedRules: z.number(),
			score: z.number(),
			categories: z.record(z.enum(ATS_CATEGORIES), z.object({ total: z.number(), passed: z.number() })),
		}),
	)
	.handler(async ({ input, context }) =>
		lintResumeForAts((await resumeService.getById({ id: input.id, userId: context.user.id })).data),
	);
```

</details>

**依据 2 · 源码核查**：[packages/api/src/features/resume/checks.ts:49-73](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/packages/api/src/features/resume/checks.ts#L49-L73)

PDF覆盖上限和截断声明

<details>
<summary>查看原文（25行）</summary>

```text
export const checkPdf = publicProcedure
	.route({
		method: "POST",
		path: "/pdf-checks",
		tags: ["Checks"],
		operationId: "createPdfCheck",
		summary: "Check a PDF for ATS readability",
		description:
			"Multipart PDF upload, up to 25 MB. Processes at most 30 pages, reports truncation and skipped checks, and stores nothing. Rate limited per client address. No authentication required.",
	})
	.input(z.object({ file: z.file().max(25_000_000), jobDescription: z.string().max(20_000).optional() }))
	.output(
		pdfCheckSchema.extend({
			fullText: z.string().describe("Extracted text in reading order, for the optional AI review."),
		}),
	)
	.use(pdfAnalysisRateLimit)
	.handler(async ({ input, signal }) => {
		const raw = await extractPdf(input.file, signal);
		return {
			...analyzePdfResume(raw, input.jobDescription ? { jobDescription: input.jobDescription } : {}),
			fullText: buildExtractedDocument(raw).fullText,
		};
	});

```

</details>

**依据 3 · 源码核查**：[packages/api/src/features/resume/checks.ts:76-109](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/packages/api/src/features/resume/checks.ts#L76-L109)

岗位term matching

<details>
<summary>查看原文（34行）</summary>

```text
		method: "POST",
		path: "/resumes/{id}/job-matches",
		tags: ["Checks"],
		operationId: "createResumeJobMatch",
		summary: "Match resume terms to a job posting",
		description:
			"Runs the editor's deterministic term matching and respects terms hidden on this resume. No AI provider is needed.",
	})
	.input(z.object({ id: z.string().min(1), jobDescription: z.string().trim().min(1).max(20_000) }))
	.output(
		z.object({
			found: z.array(jobTermSchema.extend({ label: z.string() })),
			missing: z.array(jobTermSchema.extend({ label: z.string() })),
			total: z.number(),
		}),
	)
	.handler(async ({ input, context }) => {
		const { data } = await resumeService.getById({ id: input.id, userId: context.user.id });
		const hidden = new Set(data.metadata.check?.hiddenTerms ?? []);
		const terms = matchJobDescription({ jobDescription: input.jobDescription, resumeText: buildMarkdown(data) })
			.terms.filter((term) => !hidden.has(term.term))
			.map((term) => ({
				...term,
				label:
					surfaceFormsOf(term.term)
						.map((form) => input.jobDescription.match(new RegExp(RegExp.escape(form), "i"))?.[0])
						.find(Boolean) ?? term.term,
			}));
		return {
			found: terms.filter((term) => term.resumeCount > 0),
			missing: terms.filter((term) => term.resumeCount === 0),
			total: terms.length,
		};
	});
```

</details>

**依据 4 · 源码核查**：[packages/api/src/features/ai/data-block.ts:1-6](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/packages/api/src/features/ai/data-block.ts#L1-L6)

分隔符转义不是模型指令安全证明

```text
/** Untrusted text can't end a data block early (or open a new one) by containing the markers. */
export const inertMarkers = (text: string) => text.replaceAll("<<<", "‹‹‹").replaceAll(">>>", "›››");

/** Text the model must treat as data, between `<<<NAME_START>>>` and `<<<NAME_END>>>`. */
export const dataBlock = (name: string, text: string) =>
	`<<<${name}_START>>>\n${inertMarkers(text)}\n<<<${name}_END>>>`;
```

#### 缺口

- 跨ATS解析、AI事实保持和实际招聘结果未独立验证
  **影响**：不能证明文档正确、保存可靠或求职收益
  **进一步探讨**：用虚构简历和已知岗位对照文本编辑器/PDF基线，检查事实、提取顺序、恢复和总时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样可控试用，什么假设值得验证？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断、新假设与验证

#### 完整回答

建议用虚构或充分脱敏履历先试用非AI编辑/导出和岗位检查，确认数据权限、PDF提取顺序与本地恢复，再决定是否接模型或公开分享。云使用依赖账号和服务，自托管承担数据库/存储/更新与备份；AI与可选搜索另有provider及调用费用，不能由no paid tier推断无成本。首次是数据导入、字段校对和模板适配，持续是岗位调整与事实复核，失败恢复需核对草稿、服务版本和导出文件，具体费用/时间未知。未验证假设是以导出PDF的文本顺序与履历事实差异作为AI修改放行门，比只评编辑器JSON/关键词更能减少最终交付错误。对照同虚构履历、岗位和模型预算，核查事实新增、提取遗漏、阅读顺序、人工修正时间；若不减少错误或明显增加总时间，则否定。不以此假设宣称提高录用率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-65](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/README.md#L63-L65)

作者成本与数据控制声明

```text
Create a free account, import an existing resume or start fresh, and see the finished page as you write. Download a PDF, Word, Markdown, or JSON file, or share your resume with a public link. You can also run the whole application on your own infrastructure.

You own your data. The codebase is open source under the MIT license, with no tracking, no ads, and no paid tier. Optional AI features use a provider you connect; hosting and provider usage may have their own costs.
```

**依据 2 · 作者声明**：[README.md:120-140](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/README.md#L120-L140)

模型、搜索、自托管和分享路径

<details>
<summary>查看原文（21行）</summary>

```text
**AI Assistant**

- Assistant beside your resume or letter, with conversations tied to that document
- Proposed edits show what changes and why; accept or reject each suggestion
- Improve selected text, review writing, and draft letters from a resume and job posting
- Connect OpenAI, Anthropic, Google Gemini, OpenRouter, Ollama, or other supported providers and compatible endpoints
- Optional web search and page reading; self-hosters can configure shared AI and web-access providers

**Import, Export, and Sharing**

- Import Reactive Resume JSON, JSON Resume, LinkedIn data exports, PDF, and Word files
- JSON, LinkedIn, and readable PDF imports work without AI; Word imports require a connected provider
- Export resumes and letters as PDF, Word (DOCX), Markdown, or JSON
- Share resumes through public links with optional password protection and view/download statistics
- REST API and MCP server for document management, imports, exports, checks, and application workflows

**Privacy and Control**

- Self-host with Docker, Vercel, Cloudflare Workers, or a 1-click deploy on Hostinger
- No tracking or ads; export your account data or delete your account
- Passkeys, two-factor authentication, and linked sign-in providers
```

</details>

**依据 3 · 源码核查**：[packages/api/src/features/resume/checks.ts:49-73](https://github.com/reactive-resume/reactive-resume/blob/5d247c59de925b04e6e658300524812c7f544ec4/packages/api/src/features/resume/checks.ts#L49-L73)

PDF检查支持导出验收推导

<details>
<summary>查看原文（25行）</summary>

```text
export const checkPdf = publicProcedure
	.route({
		method: "POST",
		path: "/pdf-checks",
		tags: ["Checks"],
		operationId: "createPdfCheck",
		summary: "Check a PDF for ATS readability",
		description:
			"Multipart PDF upload, up to 25 MB. Processes at most 30 pages, reports truncation and skipped checks, and stores nothing. Rate limited per client address. No authentication required.",
	})
	.input(z.object({ file: z.file().max(25_000_000), jobDescription: z.string().max(20_000).optional() }))
	.output(
		pdfCheckSchema.extend({
			fullText: z.string().describe("Extracted text in reading order, for the optional AI review."),
		}),
	)
	.use(pdfAnalysisRateLimit)
	.handler(async ({ input, signal }) => {
		const raw = await extractPdf(input.file, signal);
		return {
			...analyzePdfResume(raw, input.jobDescription ? { jobDescription: input.jobDescription } : {}),
			fullText: buildExtractedDocument(raw).fullText,
		};
	});

```

</details>

#### 缺口

- PDF/事实放行门没有对照结果及使用成本数据
  **影响**：不能证明文档正确、保存可靠或求职收益
  **进一步探讨**：用虚构简历和已知岗位对照文本编辑器/PDF基线，检查事实、提取顺序、恢复和总时间

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
