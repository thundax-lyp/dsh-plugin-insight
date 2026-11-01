# Reactive Resume

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1343865](https://github.com/reactive-resume/reactive-resume/tree/13438656a919c6cfab5e2aa39449582e9b887a78)

<!-- BEGIN META -->
[![GitHub ★ 45,116](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45%2C116&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/reactive-resume/reactive-resume)
<!-- END META -->

> **功能**：用于编写简历与求职信、检查文档并跟踪求职申请的开源应用。

> **亮点**：[Q02](#research-q02) 将结构化履历编辑与 MCP 连接，外部助手可在认证后定向更新和获取下载链接，相对手工复制提供可编程入口，不证明节时或招聘结果。

> **主要限制**：[Q03](#research-q03) 说明 patch 可覆盖内容并影响公开页面，而预期版本参数可选；认证与事务保护不能验证事实或代替用户审阅。

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
  - [Q01 · 它是什么，用户与依赖是什么？](#detail-section-11)
  - [Q02 · MCP 如何从请求到实际文档修改和导出？](#detail-section-12)
  - [Q03 · 误写、隐私、并发和故障边界是什么？](#detail-section-13)
  - [Q04 · 成本、效果及可证伪假设是什么？](#detail-section-14)
  - [Q05 · 谁可试用、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需要编写并反复修订求职材料的用户，合格结果是事实准确、文件可读且符合实际岗位。

用户可用文档编辑器和岗位表手工维护履历；本次未比较真实节时或就业结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 简历编辑与管理 | 创建和修订求职文档 | 内容真实性和公开状态须由用户核对 |
| MCP 定向修改 | 授权助手提交 JSON Patch | 版本检查参数可选，可能覆盖内容 |
| PDF 下载 | 获取生成的简历文件 | 需要有效短期链接，视觉结果未验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可用应用服务和账户 | 使用服务必需 | 保存个人文档 | 无法访问或保存 |
| 有效 API 密钥或 bearer | MCP 必需 | 认证助手请求 | 返回未授权 |
| PostgreSQL 和持久存储 | 自托管必需 | 保存账户、文档和上传 | 无法可靠存储 |
| AI 模型提供者 | AI 功能才需要 | 生成和建议 | 可能收费，数据政策由提供者决定 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在独立账户使用虚构履历 | 确认数据与公开状态 |
| 编辑 | 用户或获授权助手读取并修改文档 | 校对每项事实和差异 |
| 导出 | 用户生成并打开 PDF | 内容、页面与格式均正确 |
| 失败 | 用户停止写入并核对历史 | 使用已核实文档恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务或自托管资源 | 配置账户、权限与内容 | 时间和费用未知 |
| 持续使用 | 存储及可选模型费用 | 事实、隐私和排版复核 | 每项任务成本未知 |
| 失败恢复 | 备份及重试资源 | 检查历史、修改和文件 | 回退成功率未知 |
| 退出 | 导出和保留文件资源 | 核对个人数据和服务政策 | 上游留存与迁移成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化修改 | 认证后 API 与事务路径存在 | 助手生成事实是否准确 |
| 文件导出 | 下载 token 与 PDF 生成路径存在 | 实际排版、节时或录用效果 |

> **思考**：[Q03](#research-q03) 说明 patch 可覆盖内容并影响公开页面，而预期版本参数可选；认证与事务保护不能验证事实或代替用户审阅。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将结构化履历编辑与 MCP 连接，外部助手可在认证后定向更新和获取下载链接，相对手工复制提供可编程入口，不证明节时或招聘结果。

[Q02](#research-q02) 将认证传入用户范围 API 和事务；[Q03](#research-q03) 指出版本参数可选及公开修改副作用，不能由结构验证推断事实正确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 说明 patch 可覆盖内容并影响公开页面，而预期版本参数可选；认证与事务保护不能验证事实或代替用户审阅。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先在独立账户用虚构履历核对保存、变更和 PDF；版本、公开状态或事实不明时停止外部写入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 MCP 认证、定向修改和导出路径；实际 DSH 接入、文件质量及业务效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、apps/server/src/http/app.ts、apps/server/src/mcp/handler.ts、apps/server/src/mcp/auth.ts、apps/server/src/mcp/server.ts、packages/mcp/src/tools.ts、packages/mcp/src/tool-meta.ts、packages/api/src/features/resume/crud.ts、packages/api/src/features/resume/service.ts、packages/api/src/features/documents/exports.ts、apps/server/src/http/resume-pdf.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查 MCP 路由、简历 patch 与 PDF 下载；未审计全部 Web、移动端、AI 提供者和部署安全。
- 下一步：在隔离服务和虚构履历下验证 MCP 鉴权、修改冲突、公开状态、恢复和 PDF 视觉；记录时间和结果。

**分析版本**

- **仓库**：[reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume)
- **版本号**：6.0.10（[固定提交 1343865](https://github.com/reactive-resume/reactive-resume/tree/13438656a919c6cfab5e2aa39449582e9b887a78)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设修改前展示差异和公开状态可减少误写，须以虚构数据对照错误率、耗时和回退，尚未验证。

在隔离服务和虚构履历下验证 MCP 鉴权、修改冲突、公开状态、恢复和 PDF 视觉；记录时间和结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 111 | 35943 | — | — | 340335 |
| .ts | source | 699 | 91426 | 77763 | 6369 | — |
| .tsx | source | 558 | 111790 | 101407 | 4445 | — |
| .js | source | 3 | 49 | 40 | 5 | — |
| .mjs | test | 21 | 7045 | 6812 | 117 | — |
| .mts | source | 3 | 249 | 227 | 19 | — |
| .mjs | source | 17 | 1124 | 1038 | 47 | — |
| .cjs | source | 2 | 90 | 83 | 5 | — |
| .ts | test | 329 | 50175 | 45856 | 1237 | — |
| .tsx | test | 112 | 13424 | 12308 | 206 | — |
| .md | example | 2 | 180 | — | — | 3902 |
| .ts | example | 7 | 565 | 492 | 24 | — |
| .md | test | 1 | 48 | — | — | 446 |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 56](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=56&color=737b86&logo=github)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 91](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=91&color=737b86&logo=github)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认简历应用和其 MCP 接口如何帮助用户创建、修改和导出履历，以及认证、隐私、修改副作用和结果质量的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么，用户与依赖是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

Reactive Resume 是独立的简历和求职文档应用，提供 Web、移动端和 MCP 服务，不是原生 DSH 插件。用户可创建和编辑简历、求职信，追踪申请，按作者说明可导入、导出或分享；外部助手若通过 MCP 使用它，需要可访问的服务和有效认证。合格结果是履历事实准确、格式可读、目标岗位材料可交付；工具保存成功不代表求职效果。自托管需要数据库和持久上传存储，AI 功能另依赖模型提供者。此处未运行 DSH 与 MCP 的组合或实际安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-18](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/README.md#L11-L18)

作者定义产品用途。

```text
  <h1>Reactive Resume</h1>

  <p>Reactive Resume is a free and open-source resume builder for writing resumes and cover letters, checking your work, and tracking job applications.</p>

  <p>
    <a href="https://rxresu.me"><strong>Get Started</strong></a>
    ·
    <a href="https://docs.rxresu.me"><strong>Learn More</strong></a>
```

**依据 2 · 作者声明**：[README.md:69-73](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/README.md#L69-L73)

创建、导出和可选 AI 成本说明。

```text
---

Create a free account, import an existing resume or start fresh, and see the finished page as you write. Download a PDF, Word, Markdown, or JSON file, or share your resume with a public link. You can also run the whole application on your own infrastructure.

You own your data. The codebase is open source under the MIT license, with no tracking, no ads, and no paid tier. Optional AI features use a provider you connect; hosting and provider usage may have their own costs.
```

**依据 3 · 作者声明**：[README.md:136-147](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/README.md#L136-L147)

导入导出和 MCP 能力声明。

<details>
<summary>查看原文（12行）</summary>

```text
**Import, Export, and Sharing**

- Import Reactive Resume JSON, JSON Resume, LinkedIn data exports, PDF, and Word files
- JSON, LinkedIn, and readable PDF imports work without AI; Word imports require a connected provider
- Export resumes and letters as PDF, Word (DOCX), Markdown, or JSON
- Share resumes through public links with optional password protection and view/download statistics
- REST API and MCP server for document management, imports, exports, checks, and application workflows

**Privacy and Control**

- Self-host with Docker, Vercel, Cloudflare Workers, or a 1-click deploy on Hostinger
- No tracking or ads; export your account data or delete your account
```

</details>

**依据 4 · 源码核查**：[package.json:1-23](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/package.json#L1-L23)

私有多包应用工作区和运行时。

<details>
<summary>查看原文（23行）</summary>

```text
{
	"name": "reactive-resume",
	"description": "Reactive Resume is a free and open-source resume builder that makes it easy to create, update, and share your resume.",
	"version": "6.0.10",
	"private": true,
	"license": "MIT",
	"author": {
		"name": "Amruth Pillai",
		"email": "amruth@rxresu.me",
		"url": "https://amruthpillai.com"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/reactive-resume/reactive-resume.git"
	},
	"engines": {
		"node": "24.x"
	},
	"packageManager": "pnpm@12.16.1",
	"workspaces": [
		"apps/*",
		"packages/*",
		"tooling"
```

</details>

**依据 5 · 作者声明**：[README.md:329-336](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/README.md#L329-L336)

自托管依赖。

```text
### Docker and Kubernetes

The application needs:

- **PostgreSQL** — Accounts, documents, applications, and assistant conversations
- **Upload storage** — A persistent local directory or an S3-compatible bucket, such as SeaweedFS
- **Redis** (optional) — Shared coordination across instances and resumable assistant replies
- **SMTP** (optional) — Verification and password-reset emails
```

**依据 6 · 源码核查**：[apps/server/src/mcp/auth.ts:9-15](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/mcp/auth.ts#L9-L15)

MCP 要求有效 API 密钥或 bearer 认证。

```text
export async function authenticateRequest(request: Request) {
	// MCP accepts API keys and bearer tokens; share their priority and validation with its oRPC tools.
	const headers = new Headers(request.headers);
	headers.delete("cookie");
	const authentication = await resolveAuthenticationFromRequestHeaders(headers);
	if (authentication) return authentication;
	throw new AuthError();
```

#### 缺口

- 实际 DSH 宿主是否能配置并使用该 MCP 服务
  **影响**：决定能否在 DSH 中完成具体操作
  **进一步探讨**：在独立账户与虚构资料上检查连接和读写

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 如何从请求到实际文档修改和导出？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

HTTP 服务将 /mcp/* 交给 handleMcp，它限制来源和方法、校验认证并创建逐请求 MCP 服务器。服务器以用户认证构造 API router client，注册工具；apply_resume_patch 解析输入并调用 resume.patch。受保护 API 将当前用户 ID 和可选 expectedUpdatedAt 传给服务，事务内按用户选取并锁住文档，检查锁及版本，再校验并应用 JSON Patch，成功后发更新通知。PDF 工具先读取用户的简历并签发下载链接；下载路由验证 token 后为指定用户生成文件。相对纯文档编辑器加人工复制，这提供可编程的定向编辑和导出路径，但真实 DSH 接入、文档质量及下载文件视觉未验证，工具动作可能改动公开简历。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/http/app.ts:138-142](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/http/app.ts#L138-L142)

MCP 路由接线。

```text
	app.get("/api/uploads/*", (c) => handleUpload(c.req.raw));
	app.get("/uploads/*", (c) => handleUpload(c.req.raw));
	app.get("/schema.json", () => handleSchemaJson());
	app.get("/openapi.json", () => handleOpenApiDocument());
	app.all("/mcp/*", (c) => handleMcp(c.req.raw, client(c)));
```

**依据 2 · 源码核查**：[apps/server/src/mcp/handler.ts:24-46](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/mcp/handler.ts#L24-L46)

来源、认证、限流和服务器传输。

<details>
<summary>查看原文（23行）</summary>

```text
export async function handleMcp(request: Request, trustedClient = "unknown") {
	let server: McpServer | undefined;
	let transport: WebStandardStreamableHTTPServerTransport | undefined;
	try {
		const origin = request.headers.get("origin");
		if (origin !== null && !TRUSTED_ORIGINS.includes(origin)) {
			return errorResponse(403, "Origin is not allowed. Use the configured application origin or a native MCP client.");
		}
		if (request.method !== "POST") {
			return errorResponse(405, "This stateless MCP endpoint accepts POST requests.", { Allow: "POST" });
		}
		await consumeMcpRequestLimit(trustedClient);
		const authentication = await authenticateRequest(request);
		await consumeMcpUserLimit(authentication.user.id);
		const resHeaders = new Headers(responseHeaders);
		server = createMcpServer(request, authentication, trustedClient, resHeaders);
		transport = new WebStandardStreamableHTTPServerTransport({
			enableJsonResponse: true,
			// Larger files use authenticated upload references rather than base64 in JSON-RPC.
			maxRequestBodySize: 4 * 1024 * 1024,
		});
		await server.connect(transport);
		const response = await transport.handleRequest(request);
```

</details>

**依据 3 · 源码核查**：[apps/server/src/mcp/server.ts:19-47](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/mcp/server.ts#L19-L47)

请求身份传给 router client。

<details>
<summary>查看原文（29行）</summary>

```text
function createRequestClient(
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
```

</details>

**依据 4 · 源码核查**：[apps/server/src/mcp/server.ts:50-79](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/mcp/server.ts#L50-L79)

注册工具与资源。

<details>
<summary>查看原文（30行）</summary>

```text
export function createMcpServer(
	request: Request,
	authentication: RequestAuthentication,
	trustedClient: string,
	resHeaders: Headers,
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
	headers.delete("cookie");
	registerResources(server, client);
	registerTools(server, client, headers, authentication);
	registerParityTools(server, client, headers, {
		authentication,
		resHeaders,
		trustedClient,
		locale: getRequestLocale(request),
		signal: request.signal,
	});
	registerPrompts(server, client);
```

</details>

**依据 5 · 源码核查**：[packages/mcp/src/tools.ts:165-170](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/mcp/src/tools.ts#L165-L170)

修改工具执行 API patch。

```text
		[T.patchResume]: withErrorHandling("patching resume", async (params) => {
			const { operations } = params;
			const resume = await client.resume.patch(resumeDto.patch.input.parse(params));
			const summary = operations.map((op) => `${op.op} ${op.path}`).join(", ");

			return text(`Applied ${operations.length} operation(s) to "${resume.name}": ${summary}`, resume);
```

**依据 6 · 源码核查**：[packages/api/src/features/resume/crud.ts:180-214](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/resume/crud.ts#L180-L214)

受保护 API 调用用户范围内的服务。

<details>
<summary>查看原文（35行）</summary>

```text
	patch: protectedProcedure
		.route({
			method: "PATCH",
			path: "/resumes/{id}",
			tags: ["Resumes"],
			operationId: "patchResume",
			summary: "Patch resume data",
			description:
				"Applies JSON Patch (RFC 6902) operations to partially update a resume's data. This allows small, targeted changes (e.g. updating a single field) without sending the entire resume object. Locked resumes cannot be patched. Requires authentication.",
			successDescription: "The patched resume with its full data.",
		})
		.input(resumeDto.patch.input)
		.use(resumeMutationRateLimit)
		.output(resumeDto.patch.output)
		.errors({
			RESUME_LOCKED: { status: 403, message: "Unlock the resume first." },
			INVALID_PATCH_OPERATIONS: {
				message:
					"The patch operations are invalid or would produce an invalid resume. Fix the operations and try again.",
				status: 400,
			},
			RESUME_VERSION_CONFLICT: {
				message: "The resume changed after this patch was generated. Read the resume again and regenerate the patch.",
				status: 409,
			},
		})
		.handler(({ context, input }) =>
			resumeService.patch({
				id: input.id,
				userId: context.user.id,
				operations: input.operations,
				...(input.expectedUpdatedAt ? { expectedUpdatedAt: input.expectedUpdatedAt } : {}),
				...(input.proposalApplications ? { proposalApplications: input.proposalApplications } : {}),
				...(input.proposalSafety ? { proposalSafety: input.proposalSafety } : {}),
			}),
```

</details>

**依据 7 · 源码核查**：[packages/api/src/features/resume/service.ts:201-238](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/resume/service.ts#L201-L238)

事务行锁、用户、锁、可选版本检查与 patch。

<details>
<summary>查看原文（38行）</summary>

```text
async function applyResumePatchTx(
	client: DbOrTx,
	input: {
		id: string;
		userId: string;
		operations: JsonPatchOperation[];
		expectedUpdatedAt?: Date;
		proposalApplications?: ProposalApplications;
		proposalSafety?: "v1";
	},
) {
	const [existing] = await client
		.select({
			name: schema.resume.name,
			data: schema.resume.data,
			isLocked: schema.resume.isLocked,
			updatedAt: schema.resume.updatedAt,
		})
		.from(schema.resume)
		.where(activeResumeWhere(input.id, input.userId))
		.for("update");

	if (!existing) throw new ORPCError("NOT_FOUND");
	if (existing.isLocked) throw new ORPCError("RESUME_LOCKED", { status: 403 });
	assertResumeVersion(existing.updatedAt, input.expectedUpdatedAt);
	await assertCurrentClientWrite(client, {
		userId: input.userId,
		document: { kind: "resume", id: input.id },
		proposalSafety: input.proposalSafety,
	});

	input.operations.forEach(assertValidPatchPointers);

	let patchedData: ResumeData;
	const storedData = parseStoredResumeData(existing.data);

	try {
		patchedData = applyResumePatches(storedData, input.operations);
```

</details>

**依据 8 · 源码核查**：[packages/api/src/features/resume/service.ts:905-927](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/resume/service.ts#L905-L927)

事务与更新通知。

<details>
<summary>查看原文（23行）</summary>

```text
	patch: async (input: {
		id: string;
		userId: string;
		operations: JsonPatchOperation[];
		expectedUpdatedAt?: Date;
		proposalApplications?: ProposalApplications;
		proposalSafety?: "v1";
	}) => {
		const resume = await db
			.transaction((tx) => applyResumePatchTx(tx, input))
			.catch(async (error: unknown) => {
				throw error instanceof CurrentClientRequired ? await refuseOlderClient(input) : error;
			});

		await notifyResumeUpdated({
			type: "resume.updated",
			resumeId: resume.id,
			userId: input.userId,
			updatedAt: resume.updatedAt.toISOString(),
			mutation: "patch",
		});

		return resume;
```

</details>

**依据 9 · 源码核查**：[packages/mcp/src/tools.ts:97-108](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/mcp/src/tools.ts#L97-L108)

PDF 工具先读取简历并签发链接。

<details>
<summary>查看原文（12行）</summary>

```text
		[T.getResume]: withErrorHandling("getting resume", async ({ id }) => {
			const resume = await client.resume.getById({ id });

			return text(JSON.stringify(resume.data, null, 2), resume);
		}),

		[T.downloadResumePdf]: withErrorHandling("creating PDF download URL", async ({ id }) => {
			const resume = await client.resume.getById({ id });
			const user = authentication?.user ?? (await resolveUserFromRequestHeaders(requestHeaders));
			if (!user) throw new ORPCError("UNAUTHORIZED");

			const signedUrl = createResumePdfDownloadUrl({ resumeId: id, userId: user.id });
```

</details>

**依据 10 · 源码核查**：[apps/server/src/http/resume-pdf.ts:18-40](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/http/resume-pdf.ts#L18-L40)

验证下载 token 并为用户生成文件。

<details>
<summary>查看原文（23行）</summary>

```text
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
```

</details>

#### 缺口

- 目标 DSH 版本的 MCP 客户端、网络与导出文件实际表现
  **影响**：决定该路径能否被用户完成
  **进一步探讨**：在隔离服务与虚构履历中执行读写、冲突和导出核验

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 误写、隐私、并发和故障边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

服务拒绝不受信来源、非 POST 和无有效身份请求，工具可读取和修改用户简历；这些措施不能保证外部助手不会错误修改或泄露数据。修改前服务按用户筛选并锁行，检查锁与版本；expectedUpdatedAt 是可选输入，因此并非每次调用都自动携带调用者预期版本。工具说明明确 patch 可覆盖或删除内容，公开简历的修改也会改变公开内容。下载链接缺少或无效返回 401，过期返回 410，渲染失败返回错误；文件可读性和内容真实性仍需人工核验。应用自托管、分享、模型服务和个人资料保留的全部权限与隐私未在本轮审计。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/mcp/handler.ts:24-43](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/mcp/handler.ts#L24-L43)

来源、认证与请求大小限制。

<details>
<summary>查看原文（20行）</summary>

```text
export async function handleMcp(request: Request, trustedClient = "unknown") {
	let server: McpServer | undefined;
	let transport: WebStandardStreamableHTTPServerTransport | undefined;
	try {
		const origin = request.headers.get("origin");
		if (origin !== null && !TRUSTED_ORIGINS.includes(origin)) {
			return errorResponse(403, "Origin is not allowed. Use the configured application origin or a native MCP client.");
		}
		if (request.method !== "POST") {
			return errorResponse(405, "This stateless MCP endpoint accepts POST requests.", { Allow: "POST" });
		}
		await consumeMcpRequestLimit(trustedClient);
		const authentication = await authenticateRequest(request);
		await consumeMcpUserLimit(authentication.user.id);
		const resHeaders = new Headers(responseHeaders);
		server = createMcpServer(request, authentication, trustedClient, resHeaders);
		transport = new WebStandardStreamableHTTPServerTransport({
			enableJsonResponse: true,
			// Larger files use authenticated upload references rather than base64 in JSON-RPC.
			maxRequestBodySize: 4 * 1024 * 1024,
```

</details>

**依据 2 · 源码核查**：[packages/api/src/features/resume/service.ts:201-225](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/resume/service.ts#L201-L225)

用户范围、行锁、锁状态及可选版本参数。

<details>
<summary>查看原文（25行）</summary>

```text
async function applyResumePatchTx(
	client: DbOrTx,
	input: {
		id: string;
		userId: string;
		operations: JsonPatchOperation[];
		expectedUpdatedAt?: Date;
		proposalApplications?: ProposalApplications;
		proposalSafety?: "v1";
	},
) {
	const [existing] = await client
		.select({
			name: schema.resume.name,
			data: schema.resume.data,
			isLocked: schema.resume.isLocked,
			updatedAt: schema.resume.updatedAt,
		})
		.from(schema.resume)
		.where(activeResumeWhere(input.id, input.userId))
		.for("update");

	if (!existing) throw new ORPCError("NOT_FOUND");
	if (existing.isLocked) throw new ORPCError("RESUME_LOCKED", { status: 403 });
	assertResumeVersion(existing.updatedAt, input.expectedUpdatedAt);
```

</details>

**依据 3 · 源码核查**：[packages/api/src/features/resume/crud.ts:201-214](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/resume/crud.ts#L201-L214)

版本冲突及可选 expectedUpdatedAt。

<details>
<summary>查看原文（14行）</summary>

```text
			RESUME_VERSION_CONFLICT: {
				message: "The resume changed after this patch was generated. Read the resume again and regenerate the patch.",
				status: 409,
			},
		})
		.handler(({ context, input }) =>
			resumeService.patch({
				id: input.id,
				userId: context.user.id,
				operations: input.operations,
				...(input.expectedUpdatedAt ? { expectedUpdatedAt: input.expectedUpdatedAt } : {}),
				...(input.proposalApplications ? { proposalApplications: input.proposalApplications } : {}),
				...(input.proposalSafety ? { proposalSafety: input.proposalSafety } : {}),
			}),
```

</details>

**依据 4 · 作者声明**：[packages/mcp/src/tool-meta.ts:310-315](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/mcp/src/tool-meta.ts#L310-L315)

工具提示修改和公开副作用。

```text
			"",
			`This is the primary way to edit resume content. Use \`${T.getResume}\` first to inspect the`,
			"current structure, and `resume://_meta/schema` to understand valid paths and types.",
			"",
			"Supported operations: add, remove, replace, move, copy, test.",
			"Can remove or overwrite existing content; edits to a public resume change its published content.",
```

**依据 5 · 源码核查**：[apps/server/src/http/resume-pdf.ts:18-25](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/http/resume-pdf.ts#L18-L25)

缺少、错误与过期 token 拒绝。

```text
export async function handleResumePdfDownload(request: Request, id: string) {
	const searchParams = new URL(request.url).searchParams;
	const token = searchParams.get("token");
	if (!token) return text("Unauthorized", 401);

	const verification = verifyResumePdfDownloadToken({ resumeId: id, token });
	if (!verification.ok)
		return verification.reason === "expired" ? text("Download link expired", 410) : text("Unauthorized", 401);
```

**依据 6 · 源码核查**：[packages/api/src/features/documents/exports.ts:30-56](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/documents/exports.ts#L30-L56)

文件生成和渲染失败处理。

<details>
<summary>查看原文（27行）</summary>

```text
	const filename = `${getDefaultFileName({ name, slug: "", data }, target)}.${format}`;
	let body: File;
	try {
		if (format === "json") body = new File([JSON.stringify(json, null, 2)], filename, { type: "application/json" });
		else if (format === "pdf") {
			const { createResumePdfFile } = await import("@reactive-resume/pdf/server");
			body = await createResumePdfFile({
				data,
				filename,
				uploadOrigin: env.APP_URL,
				renderOptions: { includeCoverLetterHeader },
			});
		} else {
			const { getResumeSectionTitle } = await import("@reactive-resume/pdf/section-title");
			const resolveTitle = (id: string) => getResumeSectionTitle(data, id);
			if (format === "md") body = new File([buildMarkdown(data, resolveTitle)], filename, { type: "text/markdown" });
			else {
				const blob =
					format === "odt"
						? await (await import("@reactive-resume/odt")).buildOdt(data, resolveTitle, { includeCoverLetterHeader })
						: await (await import("@reactive-resume/docx")).buildDocx(data, resolveTitle, { includeCoverLetterHeader });
				body = new File([blob], filename, { type: blob.type });
			}
		}
	} catch (error) {
		console.error("[document export] Rendering failed", error);
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Couldn't generate the document. Try again." });
```

</details>

#### 缺口

- 真实外部助手行为、第三方模型数据处理与冲突恢复效果
  **影响**：可能影响个人资料和已公开履历
  **进一步探讨**：先用虚构数据核查模型政策、修改预览及回滚

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、效果及可证伪假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

开源代码和作者托管免费声明不意味着使用零成本：自托管需数据库、存储、运行与备份，AI 服务可能收费；反复检查事实、排版、授权和错误恢复均有人力成本。没有同任务对照证明它能节省时间或提高录用率。可提出未验证假设：外部助手执行 patch 前展示变更差异及公开状态，再由用户确认，可能减少意外覆盖；它新增确认时间且不能自行验证履历真实性。可使用虚构履历比较直接修改与差异确认，测错误覆盖率、完成时间和回退成功率；无改善或负担不可接受即否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-73](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/README.md#L69-L73)

服务声明及外部提供者可能产生费用。

```text
---

Create a free account, import an existing resume or start fresh, and see the finished page as you write. Download a PDF, Word, Markdown, or JSON file, or share your resume with a public link. You can also run the whole application on your own infrastructure.

You own your data. The codebase is open source under the MIT license, with no tracking, no ads, and no paid tier. Optional AI features use a provider you connect; hosting and provider usage may have their own costs.
```

**依据 2 · 作者声明**：[README.md:329-336](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/README.md#L329-L336)

自托管数据库和存储条件。

```text
### Docker and Kubernetes

The application needs:

- **PostgreSQL** — Accounts, documents, applications, and assistant conversations
- **Upload storage** — A persistent local directory or an S3-compatible bucket, such as SeaweedFS
- **Redis** (optional) — Shared coordination across instances and resumable assistant replies
- **SMTP** (optional) — Verification and password-reset emails
```

**依据 3 · 作者声明**：[packages/mcp/src/tool-meta.ts:310-315](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/mcp/src/tool-meta.ts#L310-L315)

patch 可能覆盖内容和影响公开页面。

```text
			"",
			`This is the primary way to edit resume content. Use \`${T.getResume}\` first to inspect the`,
			"current structure, and `resume://_meta/schema` to understand valid paths and types.",
			"",
			"Supported operations: add, remove, replace, move, copy, test.",
			"Can remove or overwrite existing content; edits to a public resume change its published content.",
```

#### 缺口

- 同任务的总费用、人工耗时和错误恢复结果
  **影响**：不能计算单位合格履历成本
  **进一步探讨**：比较同一虚构任务的完整用时和人工修订

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用、何时退出？

**研究主题**：采用判断

#### 完整回答

需要针对岗位反复修订履历且能核实事实的人，可先在独立账户用虚构数据试用应用，确认保存及 PDF 内容，再考虑是否连接可信助手。相比文档编辑器和手工复制，该应用提供结构化编辑和可编程修改及导出，但未证明招聘收益或节时。若修改覆盖内容、公开状态不清、预期版本不匹配或导出不完整，应停止外部写入，核对历史并回到已验证的独立文档；涉及真实个人资料前应核实部署方与模型服务的数据政策。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/tools.ts:165-170](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/mcp/src/tools.ts#L165-L170)

外部工具可实际提交 patch。

```text
		[T.patchResume]: withErrorHandling("patching resume", async (params) => {
			const { operations } = params;
			const resume = await client.resume.patch(resumeDto.patch.input.parse(params));
			const summary = operations.map((op) => `${op.op} ${op.path}`).join(", ");

			return text(`Applied ${operations.length} operation(s) to "${resume.name}": ${summary}`, resume);
```

**依据 2 · 源码核查**：[packages/api/src/features/resume/crud.ts:201-214](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/api/src/features/resume/crud.ts#L201-L214)

版本冲突与可选检查。

<details>
<summary>查看原文（14行）</summary>

```text
			RESUME_VERSION_CONFLICT: {
				message: "The resume changed after this patch was generated. Read the resume again and regenerate the patch.",
				status: 409,
			},
		})
		.handler(({ context, input }) =>
			resumeService.patch({
				id: input.id,
				userId: context.user.id,
				operations: input.operations,
				...(input.expectedUpdatedAt ? { expectedUpdatedAt: input.expectedUpdatedAt } : {}),
				...(input.proposalApplications ? { proposalApplications: input.proposalApplications } : {}),
				...(input.proposalSafety ? { proposalSafety: input.proposalSafety } : {}),
			}),
```

</details>

**依据 3 · 作者声明**：[packages/mcp/src/tool-meta.ts:310-315](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/packages/mcp/src/tool-meta.ts#L310-L315)

公开文档变更风险。

```text
			"",
			`This is the primary way to edit resume content. Use \`${T.getResume}\` first to inspect the`,
			"current structure, and `resume://_meta/schema` to understand valid paths and types.",
			"",
			"Supported operations: add, remove, replace, move, copy, test.",
			"Can remove or overwrite existing content; edits to a public resume change its published content.",
```

**依据 4 · 源码核查**：[apps/server/src/http/resume-pdf.ts:18-25](https://github.com/reactive-resume/reactive-resume/blob/13438656a919c6cfab5e2aa39449582e9b887a78/apps/server/src/http/resume-pdf.ts#L18-L25)

下载认证和过期检查。

```text
export async function handleResumePdfDownload(request: Request, id: string) {
	const searchParams = new URL(request.url).searchParams;
	const token = searchParams.get("token");
	if (!token) return text("Unauthorized", 401);

	const verification = verifyResumePdfDownloadToken({ resumeId: id, token });
	if (!verification.ok)
		return verification.reason === "expired" ? text("Download link expired", 410) : text("Unauthorized", 401);
```

#### 缺口

- 用户环境中保存、版本恢复和导出是否正确
  **影响**：决定是否能够安全采用
  **进一步探讨**：在独立账户完成试写、回滚和视觉核对

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
