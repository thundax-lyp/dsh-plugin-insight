# Reactive Resume

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[77f5580](https://github.com/reactive-resume/reactive-resume/tree/77f5580a67d1e4379978e80410e0cd02ea3fd446)

<!-- BEGIN META -->
[![GitHub ★ 45,386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45%2C386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/reactive-resume/reactive-resume)
<!-- END META -->

> **功能**：独立简历/求职文档应用，以认证MCP/API编辑用户文档、保留版本并生成PDF导出。

> **亮点**：[Q02](#research-q02)结构化履历的认证可编程编辑、版本与客户端同步；[Q04](#research-q04)短链接连接实际渲染导出，非录用或事实保证。

> **主要限制**：[Q03](#research-q03)预期版本可选、写可影响公开，恢复不撤外流；[Q04](#research-q04)链接非冻结版本，PDF缺字/告警和真实排版仍须人验。

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
  - [Q01 · 它是什么，如何帮助求职材料维护而不夸大效果？](#detail-section-11)
  - [Q02 · 助手请求怎样带着用户身份真实改简历？](#detail-section-12)
  - [Q03 · 冲突、公开和恢复的实际保证到哪里？](#detail-section-13)
  - [Q04 · PDF真正怎样生成和交付，隐私/成本有什么边界？](#detail-section-14)
  - [Q05 · 下一步怎样验证比可编程编辑更可靠的交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Reactive Resume6.1.0是独立Web/服务应用及MCP接口，根包为private workspace，不是DSH原生插件或单个Skill。它面向需要维护、修改、导出和分享简历/求职信并追踪申请的人；外部助手可经MCP操作用户文档，DSH若接入也只是兼容客户端。合格结果是事实准确、目标岗位匹配、文件可读且公开范围符合本人意愿，不是保存成功或录用保证。

Web/文档编辑器与手工AI复制，账户/DB、JSON Patch、PDF引擎为已有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| MCP编辑 | 结构化文档修改 | 凭据scope/事实人验 |
| 行锁/版本 | 冲突/历史 | 版本参数可选 |
| 分享 | 公开页面 | 改正文影响公开/外流难撤 |
| PDF | 签名短链/真实渲染 | 非一次性/冻结版本/视觉验收 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| 应用服务/账户/API或OAuth凭据 | MCP必需 | 认证文档操作 | 非原生DSH插件 |
| Node24/PostgreSQL/上传持久存储 | 自托管必需 | 文档账户/素材 | Redis/SMTP按部署可选 |
| Forme/字体图片资源 | PDF必需 | 真实渲染 | 缺字体/告警须核 |
| 模型provider/本人事实核验 | AI按需 | 建议/编辑 | 可收费，schema不验事实 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 隔离 | 虚构履历/私有账户和只读key | 核当前账户/分享状态 |
| 读取 | MCP读文档/updatedAt | 不盲写旧上下文 |
| 修改 | 核差异后带版本小patch | 409重读，不盲重试 |
| 交付 | 下载并逐页核PDF/事实/字形 | 链接非冻结文档 |
| 恢复退出 | 核历史/Web、撤key和公开链接 | 不能撤外部已下载件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 服务/自托管金额未知 | 配账户/权限/素材 | 无付费层非总费0 |
| 持续 | DB/上传/字体/模型未知 | 事实/岗位/排版核查 | 求职净效益未测 |
| 故障 | 重试/历史/补导出未知 | 核冲突和当前版本 | 恢复不撤公开传播 |
| 退出 | 导出/备份留存未知 | 撤key/分享/迁移 | 上游政策须另核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化编辑 | 用户范围真实patch/版本 | 履历事实正确/净省时 |
| 冲突/恢复 | 行锁/可选版本/历史路径 | 真实并发/全撤销 |
| PDF | 真Forme引擎/字节与告警 | 视觉/缺字/可交付 |
| 求职材料 | 维护分享渠道 | 录用/岗位匹配效果 |

> **思考**：[Q03](#research-q03)预期版本可选、写可影响公开，恢复不撤外流；[Q04](#research-q04)链接非冻结版本，PDF缺字/告警和真实排版仍须人验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)结构化履历的认证可编程编辑、版本与客户端同步；[Q04](#research-q04)短链接连接实际渲染导出，非录用或事实保证。

[Q02](#research-q02)账户权限贯穿工具和事务、同事务版本；[Q03](#research-q03)可选版本非强防旧写，[Q04](#research-q04)签名URL非版本冻结/视觉验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)预期版本可选、写可影响公开，恢复不撤外流；[Q04](#research-q04)链接非冻结版本，PDF缺字/告警和真实排版仍须人验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)独立账户虚构数据/只读起步，版本+差异核后小写，PDF逐页验；不明退Web和本机已验文档。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前源码支持MCP→账户事务/历史和签名下载→Forme渲染；独立账户虚构数据受限试用，无运行/视觉/求职效果验证。

- 已检查：作者 README、包清单、源码路径 README.md、apps/server/src/http/app.ts、apps/server/src/http/resume-pdf.ts、apps/server/src/mcp/auth.ts、apps/server/src/mcp/handler.ts、apps/server/src/mcp/server.ts、package.json、packages/api/src/context.ts、packages/api/src/features/agent/proposal-applications.ts、packages/api/src/features/resume/crud.ts、packages/api/src/features/resume/export.ts、packages/api/src/features/resume/pdf-download-url.ts、packages/api/src/features/resume/service.ts、packages/mcp/src/tool-meta.ts、packages/mcp/src/tools.ts、packages/pdf/src/forme/render.ts、packages/pdf/src/server.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：当前固定版重核旧12 findings；核MCP路由认证/权限/oRPC、代表resume patch行锁事务/历史/公开/恢复及下载签名/Forme真实渲染；未全审所有Web/移动端/AI/上传字体网络/共享与部署安全，不据统计覆盖冒充审计。
- 下一步：只读固定源码，不运行应用/测试/MCP/账号/模型/PDF或浏览器；无独立视觉/隐私/就业/成本验证。

**分析版本**

- **仓库**：[reactive-resume/reactive-resume](https://github.com/reactive-resume/reactive-resume)
- **版本号**：6.1.0（[固定提交 77f5580](https://github.com/reactive-resume/reactive-resume/tree/77f5580a67d1e4379978e80410e0cd02ea3fd446)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)写前版本/公开差异和写后导出件/告警签收，故障对照验误写/误公开/返工，未实现不加分。

只读固定源码，不运行应用/测试/MCP/账号/模型/PDF或浏览器；无独立视觉/隐私/就业/成本验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 126 | 39565 | — | — | 370267 |
| .ts | source | 815 | 110623 | 94421 | 8185 | — |
| .tsx | source | 616 | 135927 | 124583 | 4944 | — |
| .js | source | 3 | 49 | 40 | 5 | — |
| .mjs | test | 58 | 18609 | 17996 | 260 | — |
| .mjs | source | 25 | 2136 | 1928 | 115 | — |
| .mts | source | 3 | 265 | 240 | 21 | — |
| .cjs | source | 2 | 90 | 83 | 5 | — |
| .ts | test | 389 | 67893 | 62652 | 1502 | — |
| .tsx | test | 146 | 21404 | 19716 | 333 | — |
| .ts | example | 12 | 988 | 897 | 46 | — |
| .md | example | 3 | 236 | — | — | 5463 |
| .md | test | 1 | 67 | — | — | 672 |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=45&color=737b86&logo=github)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 86](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=86&color=737b86&logo=github)](https://github.com/reactive-resume/reactive-resume/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核独立应用真实账户范围编辑/恢复与PDF渲染链，明确事实/公开/版本和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么，如何帮助求职材料维护而不夸大效果？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Reactive Resume6.1.0是独立Web/服务应用及MCP接口，根包为private workspace，不是DSH原生插件或单个Skill。它面向需要维护、修改、导出和分享简历/求职信并追踪申请的人；外部助手可经MCP操作用户文档，DSH若接入也只是兼容客户端。合格结果是事实准确、目标岗位匹配、文件可读且公开范围符合本人意愿，不是保存成功或录用保证。

相对文档编辑器+岗位表/复制AI文本，增量是结构化文档、账户内可编程编辑、版本/公开状态和PDF等出口。模型生成能力另由用户所配provider，渲染来自Forme/字体资源；接口与数据库不验证履历事实。自托管需Node24/PostgreSQL/持久上传，Redis/SMTP按部署可选；作者无付费层/无追踪主张不是当前托管服务、现金/隐私政策独立核验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-18](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/README.md#L11-L18)

作者独立简历/求职文档应用定位。

```text
  <h1>Reactive Resume</h1>

  <p>Reactive Resume is a free and open-source resume builder for writing resumes and cover letters, checking your work, and tracking job applications.</p>

  <p>
    <a href="https://rxresu.me"><strong>Get Started</strong></a>
    ·
    <a href="https://docs.rxresu.me"><strong>Learn More</strong></a>
```

**依据 2 · 作者声明**：[README.md:69-75](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/README.md#L69-L75)

作者导出/分享/自托管与费用主张。

```text
---

Create a free account, import an existing resume or start fresh, and see the finished page as you write. Download a PDF, Word, Markdown, or JSON file, or share your resume with a public link. You can also run the whole application on your own infrastructure.

You own your data. The codebase is open source under the MIT license, with no tracking, no ads, and no paid tier. Optional AI features use a provider you connect; hosting and provider usage may have their own costs.

![Reactive Resume v6 editor with Write, Design, and Check modes and a live PDF preview](docs/images/getting-started/editor-overview.webp)
```

**依据 3 · 作者声明**：[README.md:329-337](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/README.md#L329-L337)

作者自托管资源依赖。

```text
### Docker and Kubernetes

The application needs:

- **PostgreSQL** — Accounts, documents, applications, and assistant conversations
- **Upload storage** — A persistent local directory or an S3-compatible bucket, such as SeaweedFS
- **Redis** (optional) — Shared coordination across instances and resumable assistant replies
- **SMTP** (optional) — Verification and password-reset emails

```

**依据 4 · 源码核查**：[package.json:1-23](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/package.json#L1-L23)

private workspace6.1.0/MIT/Node24。

<details>
<summary>查看原文（23行）</summary>

```text
{
	"name": "reactive-resume",
	"description": "Reactive Resume is a free and open-source resume builder that makes it easy to create, update, and share your resume.",
	"version": "6.1.0",
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

**依据 5 · 源码核查**：[apps/server/src/mcp/server.ts:50-79](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/mcp/server.ts#L50-L79)

真实MCP建服/资源工具与读写发现。

<details>
<summary>查看原文（30行）</summary>

```text

export function createMcpServer(
	request: Request,
	authentication: RequestAuthentication,
	trustedClient: string,
	resHeaders: Headers,
) {
	const server = new McpServer(buildMcpServerInfo(appVersion, env.APP_URL), {
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
```

</details>

#### 缺口

- 实际DSH组合/服务可用性、真实求职需求和节时/录用效果未验。
  **影响**：不能当安装即用DSH插件或招聘成效保证。
  **进一步探讨**：隔离账户虚构材料，对照手工编辑/导出，核目标和全部费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 助手请求怎样带着用户身份真实改简历？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

HTTP /mcp/*进入handleMcp：拒非可信Origin、仅POST、IP/用户限流，authenticateRequest移cookie仅收API key/OAuth；每请求建stateless transport(4MiB JSON)并finally关闭。oRPC client带已解析authentication，传播request.signal到操作上下文，注册真实工具。API key/Bearer有read/write/delete权限，旧无显式scope凭据可为全权限；protectedProcedure按method/operationId检查权限和已有账户binding一致，不等每份文档/每次写独立人审。

patch工具实际解析参数调用client.resume.patch，API把context.user.id传service。service在db.transaction内按文档id+userId+未trashed定位，SELECT FOR UPDATE、拒locked、校可选版本，验证patch指针/结果schema后真正UPDATE data并同事务writeVersion。事务后notifyResumeUpdated给客户端；这支持账户内结构化小修改/版本可回查，不证明原文事实、AI理由或视觉结果正确。请求取消向下传播也不等已提交数据库回滚，返回中断需重新读版本判断。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/http/app.ts:143-146](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/http/app.ts#L143-L146)

实际/mcp路由。

```text
	app.get("/uploads/*", (c) => handleUpload(c.req.raw));
	app.get("/schema.json", () => handleSchemaJson());
	app.get("/openapi.json", () => handleOpenApiDocument());
	app.all("/mcp/*", (c) => handleMcp(c.req.raw, client(c)));
```

**依据 2 · 源码核查**：[apps/server/src/mcp/handler.ts:24-46](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/mcp/handler.ts#L24-L46)

Origin/POST/认证限流与transport执行。

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

**依据 3 · 源码核查**：[apps/server/src/mcp/handler.ts:68-78](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/mcp/handler.ts#L68-L78)

错误/transport finally清理。

<details>
<summary>查看原文（11行）</summary>

```text
		return errorResponse(500, `MCP request failed. Retry or contact support with diagnostic ID ${diagnosticId}.`);
	} finally {
		// JSON responses are complete before handleRequest resolves; no standalone streams remain.
		try {
			if (server) await server.close();
			else if (transport) await transport.close();
		} catch {
			console.error("[MCP] Transport cleanup failed");
		}
	}
}
```

</details>

**依据 4 · 源码核查**：[apps/server/src/mcp/auth.ts:9-16](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/mcp/auth.ts#L9-L16)

实际删cookie只走API/bearer认证。

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

**依据 5 · 源码核查**：[apps/server/src/mcp/server.ts:19-47](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/mcp/server.ts#L19-L47)

真实oRPC客户端上下文/取消传播。

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
```

</details>

**依据 6 · 源码核查**：[packages/api/src/context.ts:41-75](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/context.ts#L41-L75)

API/Bearer权限来源与旧scope回退。

<details>
<summary>查看原文（35行）</summary>

```text
async function getAuthenticationFromBearerToken(headers: Headers): Promise<RequestAuthentication | null> {
	try {
		const authHeader = headers.get("authorization");
		if (!authHeader?.startsWith("Bearer ")) return null;
		const payload = await verifyOAuthToken(authHeader.slice(7));
		if (!payload.sub) return null;
		const result = await findActiveUser(payload.sub);
		if (!result) return null;
		const scopes = typeof payload.scope === "string" ? payload.scope.split(/\s+/) : [];
		const explicitPermissions = scopes.filter((scope) => scope.startsWith("api:"));
		// Existing grants used identity scopes for account-wide access. Explicit
		// application scopes opt into least privilege without breaking those grants.
		const permissions = explicitPermissions.length
			? fullPermissions.filter((permission) => scopes.includes(`api:${permission}`))
			: fullPermissions;
		return { user: result, method: "bearer", permissions };
	} catch {
		return null;
	}
}

async function getAuthenticationFromApiKey(apiKey: string): Promise<RequestAuthentication | null> {
	try {
		const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
		if (!result.key || !result.valid) return null;
		const activeUser = await findActiveUser(result.key.referenceId);
		if (!activeUser) return null;
		const statements: unknown = result.key.permissions;
		const apiPermissions = statements && typeof statements === "object" && "api" in statements ? statements.api : [];
		const permissions =
			statements == null
				? fullPermissions
				: fullPermissions.filter((permission) => Array.isArray(apiPermissions) && apiPermissions.includes(permission));
		return { user: activeUser, method: "apiKey", permissions };
	} catch {
```

</details>

**依据 7 · 源码核查**：[packages/api/src/context.ts:136-187](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/context.ts#L136-L187)

实际read/write/delete/账户绑定/权限守卫。

<details>
<summary>查看原文（52行）</summary>

```text
 * The scope a route needs. Moving a document to Trash removes it like a delete, so its RPC and REST aliases need
 * `delete` too. MCP tools check the same rule before calling a procedure.
 */
export function requiredPermission(route: { method?: string | undefined; operationId?: string | undefined }) {
	if (route.method === "GET") return "read";
	if (route.method === "DELETE" || /^(delete|bulkDelete|purge|trash)|^putDocumentTrash$/i.test(route.operationId ?? ""))
		return "delete";
	return "write";
}

/**
 * Why a credential can't do something, in the words the settings use. API keys are either read-only or full, so a key
 * missing a permission is a read-only key; OAuth connections keep the scope names their consent screen granted.
 */
export function missingPermissionMessage(method: string | undefined, permission: string) {
	if (method === "apiKey")
		return "This API key is read-only. Create a key with read, write and delete access in Settings → AI & developer.";
	return `This credential needs the api:${permission} permission. Use a credential that includes it.`;
}

export const protectedProcedure = publicProcedure
	.route({
		spec: (operation) => ({ ...operation, security: [{ apiKey: [] }, { bearerAuth: [] }, { cookieAuth: [] }] }),
	})
	.use(({ context, procedure, next }) => {
		if (!context.user) {
			context.resHeaders?.set(
				"WWW-Authenticate",
				`Bearer resource_metadata="${env.APP_URL}/.well-known/oauth-protected-resource"`,
			);
			throw new ORPCError("UNAUTHORIZED", {
				message: "Sign-in required. Send a valid API key in the x-api-key header or an OAuth bearer token.",
			});
		}
		const permission = requiredPermission(procedure["~orpc"].route);
		// A page sends the account it was rendered for. If a cookie changed after that page loaded (another tab signed
		// out or signed in), a queued autosave must fail instead of writing the old account's text into the new one.
		// Every known binding must agree with the authenticated user: the request envelope (cookie-level) and the
		// per-item binding a batch item may carry. A batch cannot relabel one item with another account's live scope.
		const bindings = [context.reqHeaders.get("x-account-id"), context.rpcItemAccountId].filter(
			(value): value is string => Boolean(value),
		);
		if (permission !== "read" && bindings.some((accountId) => accountId !== context.user?.id))
			throw new ORPCError("CONFLICT", {
				message: "This page belongs to a different account now. Reload and try again.",
			});
		if (!context.authentication?.permissions.includes(permission)) {
			context.resHeaders?.set("WWW-Authenticate", `Bearer error="insufficient_scope", scope="api:${permission}"`);
			throw new ORPCError("FORBIDDEN", {
				message: missingPermissionMessage(context.authentication?.method, permission),
			});
		}
```

</details>

**依据 8 · 源码核查**：[packages/mcp/src/tools.ts:165-171](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/mcp/src/tools.ts#L165-L171)

真实patch客户端调用。

```text
		[T.patchResume]: withErrorHandling("patching resume", async (params) => {
			const { operations } = params;
			const resume = await client.resume.patch(resumeDto.patch.input.parse(params));
			const summary = operations.map((op) => `${op.op} ${op.path}`).join(", ");

			return text(`Applied ${operations.length} operation(s) to "${resume.name}": ${summary}`, resume);
		}),
```

**依据 9 · 源码核查**：[packages/api/src/features/resume/crud.ts:216-224](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/crud.ts#L216-L224)

用户id/operations/可选版本交service。

```text
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

**依据 10 · 源码核查**：[packages/api/src/features/resume/service.ts:214-305](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/service.ts#L214-L305)

行锁/验证/真实UPDATE和同事务版本。

<details>
<summary>查看原文（92行）</summary>

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
	} catch (error) {
		if (error instanceof ResumePatchError) {
			throw new ORPCError("INVALID_PATCH_OPERATIONS", {
				status: 400,
				message: describeResumePatchError(error),
				data: { code: error.code, index: error.index, operation: error.operation },
			});
		}

		throw new ORPCError("INVALID_PATCH_OPERATIONS", {
			status: 400,
			message: error instanceof Error ? error.message : "Failed to apply patch operations",
		});
	}

	patchedData = parseWritableResumeData(patchedData);
	await adoptEmbeddedLetters(client, {
		userId: input.userId,
		resumeId: input.id,
		resumeName: existing.name,
		data: patchedData,
	});
	// The version guard is the ms-precision JS check above, under the SELECT ... FOR UPDATE lock.
	// Never compare expectedUpdatedAt in SQL: rows stamped by Postgres now() (defaultNow() on
	// insert) carry microseconds, while JS Dates are ms-truncated — SQL equality then matches
	// zero rows and every guarded patch on a fresh resume reports a version conflict forever.
	const [resume] = await client
		.update(schema.resume)
		.set({ data: patchedData })
		.where(activeUnlockedResumeWhere(input.id, input.userId))
		.returning(resumeColumns);

	if (!resume) {
		if (input.expectedUpdatedAt) throw resumeVersionConflict(existing.updatedAt);
		throw new ORPCError("NOT_FOUND");
	}
	const sourceIds = await saveProposalApplications(client, {
		userId: input.userId,
		document: { kind: "resume", id: input.id },
		applications: input.proposalApplications,
		conflict: () => resumeVersionConflict(existing.updatedAt),
	});
	if (sourceIds !== undefined) resume.aiOperationIds = sourceIds;

	// Checkpoint every patch (AI/API edit) atomically within the same transaction as the edit.
	// ponytail: a multi-patch agent turn writes one row per patch; 90-day retention bounds it.
	await writeVersion(client, {
		resumeId: resume.id,
		userId: input.userId,
		data: resume.data,
		aiOperationIds: resume.aiOperationIds,
		kind: "ai",
	});

```

</details>

**依据 11 · 源码核查**：[packages/api/src/features/resume/service.ts:985-1009](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/service.ts#L985-L1009)

真实事务和提交后notify。

<details>
<summary>查看原文（25行）</summary>

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
	},

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 冲突、公开和恢复的实际保证到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

expectedUpdatedAt在MCP schema为optional，API也仅有值时传下去；行锁能串行化写入并校传入版本，不能判断一个未传版本的助手是否基于旧内容。建议每次先read再带updatedAt patch，冲突409重读并让人核差异，不能盲重试。locked防写、schema/JSON Patch合法性也不证明履历真或所有修改可逆。

当前还有proposalSafety/应用提案来源检查：遇某些旧客户端可能错误套用的编辑时拒不带v1写，带v1直接通过该兼容门；它不是每次写都必经本人批准。MCP update可改isPublic/slug等，内容patch会即时影响已公开页面；公开读路径检查public/owner/密码，但已有下载/分享副本不能撤回。不要把Tool destructiveHint当真正审批。

patch同事务记版本，restore真实先记before-restore、用当前版本条件update历史data/AI来源，再记restored；保留旧版本是恢复材料，restore自身也可能冲突/失败，且此链恢复内容不等撤销已公开传播或所有元数据。超时未获响应先读当前状态/历史，不自动再套patch。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/tool-meta.ts:316-353](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/mcp/src/tool-meta.ts#L316-L353)

内容公开副作用/expectedUpdatedAt可选/提示非强审批。

<details>
<summary>查看原文（38行）</summary>

```text
			"Can remove or overwrite existing content; edits to a public resume change its published content.",
			"",
			"Common path examples:",
			"  /basics/name                          — Change the name",
			"  /basics/headline                      — Change the headline",
			"  /summary/content                      — Replace summary (HTML string)",
			"  /sections/experience/items/-           — Append a new experience item",
			"  /sections/experience/items/0/company   — Update first experience's company",
			"  /sections/skills/items/-               — Append a new skill",
			"  /metadata/template                     — Change the template (e.g. 'azurill', 'bronzor', 'onyx')",
			"  /metadata/design/colors/primary        — Change the primary color (rgba string)",
			"  /sections/interests/hidden              — Hide/show a section",
			"  /sections/experience/items/0/dates      — Set dates: { start, end, present } with years or",
			"                                            year-months ('2022' or '2022-03')",
			"",
			"Dates: write `dates`; the text in `period` (or `date` for awards, certifications and",
			"publications) is rewritten from it in the resume's locale, so an edit to the text alone is lost.",
			"Important: HTML content fields (description, summary.content) must use valid HTML.",
			"New items must include a valid UUID as `id` and `hidden: false`.",
			`Locked resumes cannot be patched. Ask the user before unlocking with \`${T.unlockResume}\`.`,
		].join("\n"),
		outputSchema: toWireObjectSchema(resumeDto.patch.output),
		// Converted twice: the published schema lists every JSON type for nested patch values too.
		inputSchema: wireInput(
			wireInput(z.strictObject({ id: resumeIdSchema, operations: resumePatchOperationsSchema })).extend({
				expectedUpdatedAt: z.iso
					.datetime({ offset: true })
					.optional()
					.describe(
						"updatedAt from the latest read_resume. Rejects changes when document has changed since that read.",
					),
				proposalApplications: resumeDto.patch.input.shape.proposalApplications,
				proposalSafety: resumeDto.patch.input.shape.proposalSafety,
			}),
		),
		annotations: { ...WRITE_NON_IDEMPOTENT, destructiveHint: true, openWorldHint: true },
	},
	[T.updateResume]: {
```

</details>

**依据 2 · 源码核查**：[packages/api/src/features/resume/crud.ts:216-224](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/crud.ts#L216-L224)

版本条件可选传递。

```text
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

**依据 3 · 源码核查**：[packages/api/src/features/resume/service.ts:229-243](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/service.ts#L229-L243)

locked/行锁下可选版本与proposalSafety调用。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[packages/api/src/features/agent/proposal-applications.ts:241-267](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/agent/proposal-applications.ts#L241-L267)

真实兼容写保护及v1跳过该门。

<details>
<summary>查看原文（27行）</summary>

```text
export async function assertCurrentClientWrite(
	tx: Reader,
	input: { userId: string; document: ProposalDocument; proposalSafety: "v1" | undefined },
) {
	if (input.proposalSafety === "v1") return;
	const threads = await documentThreads(tx, input.userId, input.document);
	if (threads.length === 0) return;
	const reader = await documentReader(tx, input.userId, input.document);
	for (const thread of threads) {
		const rows = await tx
			.select({ uiMessage: schema.agentMessage.uiMessage })
			.from(schema.agentMessage)
			.where(and(eq(schema.agentMessage.threadId, thread.id), eq(schema.agentMessage.userId, input.userId)));
		for (const { uiMessage } of rows) {
			const message = uiMessage as unknown as UIMessage;
			if (!Array.isArray(message?.parts)) continue;
			for (const output of proposalSets(message)) {
				const reworded = output.edits.some((edit) => edit.edited);
				const blockedTailoring =
					input.document.kind === "resume" &&
					!tailoringAllows(message, output, reader?.madeFor ?? null) &&
					output.edits.some((edit) => edit.status !== "accepted");
				if (reworded || blockedTailoring) throw new CurrentClientRequired();
			}
		}
	}
}
```

</details>

**依据 5 · 源码核查**：[packages/mcp/src/tool-meta.ts:356-367](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/mcp/src/tool-meta.ts#L356-L367)

公开链接及isPublic可写schema。

<details>
<summary>查看原文（12行）</summary>

```text
			"Update a resume's settings (display name, URL slug, tags, public visibility, download buttons), its web page's Share settings (showInSearchEngines, hideContactDetails, isPrimary), or replace its whole content with `data`.",
			"Ask the user before turning on showInSearchEngines or turning off hideContactDetails: both make personal details easier for strangers to find.",
			`For content edits prefer \`${T.patchResume}\` with expectedUpdatedAt, which changes only what it targets and avoids overwriting concurrent changes.`,
			`Locked resumes cannot be updated. Ask the user before unlocking with \`${T.unlockResume}\`.`,
			"To set a share password, `api_resume_set_password` opens the resume in the app.",
			"",
			"Always returns your canonical share URL (`{app}/{username}/{slug}`). Anonymous viewers can use it only when `isPublic` is true; password protection from the web app still applies.",
		].join("\n"),
		outputSchema: toWireObjectSchema(
			resumeDto.update.output
				.pick({ id: true, name: true, slug: true, tags: true, isPublic: true, hasPassword: true })
				.extend({ shareUrl: z.string() }),
```

</details>

**依据 6 · 源码核查**：[packages/api/src/features/resume/service.ts:687-709](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/service.ts#L687-L709)

实际public与密码读守卫。

<details>
<summary>查看原文（23行）</summary>

```text
			passwordHash: schema.resume.password,
			hasPassword: sql<boolean>`${schema.resume.password} IS NOT NULL`,
		});

		if (
			!resume ||
			(input.requirePublic && !resume.isPublic) ||
			(input.expectedResumeId && resume.id !== input.expectedResumeId)
		)
			throw new ORPCError("NOT_FOUND");

		const viewer = input.currentUserId ? { id: input.currentUserId } : null;
		assertCanView(resume, viewer);

		if (requiresPassword(resume, viewer) && !hasResumeAccess(input.requestHeaders, resume.id, resume.passwordHash)) {
			throw new ORPCError("NEED_PASSWORD", {
				status: 401,
				data: { username: input.username, slug: input.slug },
			});
		}

		if (shouldCountForStatistics(resume, viewer))
			await countVisit({ kind: "view", resumeId: resume.id, trustedClient: input.trustedClient });
```

</details>

**依据 7 · 源码核查**：[packages/api/src/features/resume/service.ts:578-614](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/service.ts#L578-L614)

实际before/条件update/restored版本恢复路径。

<details>
<summary>查看原文（37行）</summary>

```text
		restore: async (input: { resumeId: string; versionId: string; userId: string; proposalSafety?: "v1" }) => {
			// Check lock state before loading or validating historical data so locked resumes fail without expensive work.
			const current = await resumeService.getById({ id: input.resumeId, userId: input.userId });
			if (current.isLocked) throw new ORPCError("RESUME_LOCKED", { status: 403 });

			const version = await getVersion(input);

			// Capture the pre-restore state first so the restore itself is undoable.
			// A named version's name goes with both snapshots, so History says which version was restored.
			const restoredName = version.name || undefined;
			await writeVersion(db, {
				resumeId: input.resumeId,
				userId: input.userId,
				data: current.data,
				aiOperationIds: current.aiOperationIds,
				kind: "before-restore",
				...(restoredName ? { name: restoredName } : {}),
			});

			const updated = await resumeService.update({
				id: input.resumeId,
				userId: input.userId,
				data: version.data,
				aiOperationIds: version.aiOperationIds,
				expectedUpdatedAt: current.updatedAt,
				skipAutoSnapshot: true,
				...(input.proposalSafety ? { proposalSafety: input.proposalSafety } : {}),
			});

			await writeVersion(db, {
				resumeId: input.resumeId,
				userId: input.userId,
				data: updated.data,
				aiOperationIds: updated.aiOperationIds,
				kind: "restored",
				...(restoredName ? { name: restoredName } : {}),
			});
```

</details>

#### 缺口

- 真实并发/恢复/公开页和历史保留策略未端到端验。
  **影响**：不能把有历史当一键全撤销，公开数据可能已外流。
  **进一步探讨**：虚构履历演练旧版本/无版本、公开切换和恢复失败，核当前内容与外部副本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · PDF真正怎样生成和交付，隐私/成本有什么边界？

**研究主题**：功能与机制、效果与总成本、采用判断

#### 完整回答

downloadResumePdf先账户内getById再发HMAC签名短链接，token含resumeId/userId/issuedAt/expiry，默认10分钟；GET下载持token验证后以签名userId重新取当前文档并渲染，不需要同一浏览器cookie。因此链接应视作短时凭据，既非一次性也不绑定文档版本，生成链接后再改文档可能下载到新内容，不能当冻结签收件。

createResumePdfDownload核用户文档/限流并lazy加载Forme服务，createResumePdfFile解析数据，加载字体/图片，renderHostTree→toFormeDocument→engine.renderSerializedDocWithLayout再取pdf bytes封File。缺字体会pdf-text-loss报错，而没有字形的字符可能替成?并警告；存在页面缺陷warnings也不等全部阻下载。因此真实PDF需打开逐页核中文/符号/图片/分页/事实，不能用Content-Type/服务返回代替视觉验收。

首次服务/自托管资源、持续DB/上传/字体网络/可选AI token和人核事实排版、故障历史/补导出、退出数据保留迁移金额与工时未知。作者无付费层不等总成本0；可先虚构数据、私有文档/只读key起步，写时核差异/版本/公开状态，保本机导出后再决定真实敏感履历。此研究未审计图片下载/全部AI及上传数据政策，退出要撤key/公开链接并核服务器备份留存。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/tools.ts:103-117](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/mcp/src/tools.ts#L103-L117)

真实账户读取后生成下载URL。

<details>
<summary>查看原文（15行）</summary>

```text
		[T.downloadResumePdf]: withErrorHandling("creating PDF download URL", async ({ id }) => {
			const resume = await client.resume.getById({ id });
			const user = authentication?.user ?? (await resolveUserFromRequestHeaders(requestHeaders));
			if (!user) throw new ORPCError("UNAUTHORIZED");

			const signedUrl = createResumePdfDownloadUrl({ resumeId: id, userId: user.id });

			return json({
				resumeId: id,
				name: resume.name,
				downloadUrl: signedUrl.url,
				expiresAt: signedUrl.expiresAt,
				expiresInSeconds: signedUrl.expiresInSeconds,
				contentType: "application/pdf",
			});
```

</details>

**依据 2 · 源码核查**：[packages/api/src/features/resume/pdf-download-url.ts:5-16](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/pdf-download-url.ts#L5-L16)

TTL10分钟/签名payload字段。

<details>
<summary>查看原文（12行）</summary>

```text
// Long enough to click, short enough that a leaked link is useless soon after.
const TTL_SECONDS = 10 * 60;

type PdfDownloadTokenPayload = {
	v: 1;
	resumeId: string;
	userId: string;
	expiresAt: number;
	issuedAt: number;
};

type CreateResumePdfDownloadUrlInput = {
```

</details>

**依据 3 · 源码核查**：[packages/api/src/features/resume/pdf-download-url.ts:69-113](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/pdf-download-url.ts#L69-L113)

签名链接发行和真实验证/过期。

<details>
<summary>查看原文（45行）</summary>

```text
	const expiresInSeconds = TTL_SECONDS;
	const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);
	const payload = encodeJson({
		v: 1,
		resumeId,
		userId,
		expiresAt: expiresAt.getTime(),
		issuedAt: now.getTime(),
	} satisfies PdfDownloadTokenPayload);
	const token = `${payload}.${sign(payload)}`;
	const url = new URL(`/api/resumes/${encodeURIComponent(resumeId)}/pdf`, env.APP_URL);
	url.searchParams.set("token", token);

	return {
		url: url.toString(),
		expiresAt: expiresAt.toISOString(),
		expiresInSeconds,
	};
}

export function verifyResumePdfDownloadToken({
	resumeId,
	token,
	now = new Date(),
}: VerifyResumePdfDownloadTokenInput): VerifyResumePdfDownloadTokenResult {
	const [payload, signature, extra] = token.split(".");
	if (!payload || !signature || extra !== undefined) return { ok: false, reason: "malformed" };
	if (!safeEquals(signature, sign(payload))) return { ok: false, reason: "invalid_signature" };

	try {
		const parsed = parsePayload(decodeJson(payload));
		if (!parsed) return { ok: false, reason: "malformed" };
		if (parsed.resumeId !== resumeId) return { ok: false, reason: "resume_mismatch" };
		if (parsed.expiresAt <= now.getTime()) return { ok: false, reason: "expired" };

		return {
			ok: true,
			resumeId: parsed.resumeId,
			userId: parsed.userId,
			expiresAt: new Date(parsed.expiresAt).toISOString(),
		};
	} catch {
		return { ok: false, reason: "malformed" };
	}
}
```

</details>

**依据 4 · 源码核查**：[apps/server/src/http/resume-pdf.ts:18-41](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/apps/server/src/http/resume-pdf.ts#L18-L41)

token GET→当前用户文档PDF响应。

<details>
<summary>查看原文（24行）</summary>

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
	if (target && target !== "resume") return text("Not Found", 404);

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
```

</details>

**依据 5 · 源码核查**：[packages/api/src/features/resume/export.ts:19-46](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/export.ts#L19-L46)

真实getById/限流/lazy Forme/错误。

<details>
<summary>查看原文（28行）</summary>

```text
export async function createResumePdfDownload(input: CreateResumePdfDownloadInput) {
	const resume = await resumeService.getById({ id: input.id, userId: input.userId });
	await consumePdfExportLimit(input);
	const data = parseStoredResumeData(resume.data);
	const filename = `${getDefaultFileName({ name: resume.name, slug: resume.slug, data })}.pdf`;

	try {
		// Lazy-load the PDF renderer (@reactive-resume/pdf → the Forme WASM engine and
		// the icon drawings) only when a PDF is actually exported, instead of at server
		// boot. Keeps cold starts light on constrained/slow-disk hosts.
		const { createResumePdfFile } = await import("@reactive-resume/pdf/server");
		const body = await createResumePdfFile({ data, filename, uploadOrigin: env.APP_URL });

		return {
			headers: {
				"content-disposition": contentDisposition(filename),
			},
			body,
		};
	} catch (error) {
		if (error instanceof Error && error.cause === "pdf-text-loss") {
			throw new ORPCError("BAD_REQUEST", { message: error.message });
		}
		console.error("[PDF API] Failed to render resume PDF", { resumeId: input.id, error });
		throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Couldn't generate the resume PDF. Try again." });
	}
}

```

</details>

**依据 6 · 源码核查**：[packages/pdf/src/server.tsx:24-38](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/pdf/src/server.tsx#L24-L38)

真实解析/渲染/字体检查与PDF File。

<details>
<summary>查看原文（15行）</summary>

```text
export const createResumePdfFile = async ({
	filename,
	uploadOrigin,
	...input
}: CreateResumePdfFileOptions): Promise<File> => {
	const result = await renderResume(forme, {
		...input,
		data: parseResumeData(input.data),
		readImage: (source) => readServerImage(source, uploadOrigin),
		webFontBaseUrl: process.env.WEB_FONT_BASE_URL,
	});
	// Characters no font can draw print as "?" rather than failing the file; the editor names them.
	assertPdfFonts(result);
	return new File([result.pdf as Uint8Array<ArrayBuffer>], filename, { type: "application/pdf" });
};
```

</details>

**依据 7 · 源码核查**：[packages/pdf/src/forme/render.ts:355-368](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/pdf/src/forme/render.ts#L355-L368)

文档元素进入真实渲染。

<details>
<summary>查看原文（14行）</summary>

```text
export function renderResume(engine: FormeEngine, input: RenderResumeInput): Promise<RenderedResume> {
	const { data } = input;
	return renderResumeElement(
		engine,
		createElement(ResumeDocument, {
			data,
			template: input.template ?? data.metadata.template,
			...(input.renderOptions ? { renderOptions: input.renderOptions } : {}),
		}),
		input.readImage,
		input.webFontBaseUrl,
	);
}

```

</details>

**依据 8 · 源码核查**：[packages/pdf/src/forme/render.ts:373-438](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/pdf/src/forme/render.ts#L373-L438)

加载素材/字体/实际engine draw。

<details>
<summary>查看原文（66行）</summary>

```text
export async function renderResumeElement(
	engine: FormeEngine,
	element: ReactElement,
	readImage?: (source: string) => Promise<Uint8Array>,
	webFontBaseUrl?: string,
): Promise<RenderedResume> {
	const data = (element.props as { data?: ResumeData }).data;
	// Font downloads start first: they're the largest wait, and the tree needs only the icons.
	const fontsLoaded = loadFonts(data ? resumeFontRequests(data) : [], webFontBaseUrl);
	let tree = renderHostTree(element);
	// Icons load on first use: a tree that asked for new ones is drawn again once they arrive.
	if (await loadRequestedIcons()) tree = renderHostTree(element);
	const [{ fonts, warnings: fontWarnings, missing }, { images, warnings: imageWarnings }] = await Promise.all([
		fontsLoaded,
		loadImages(imageSources(tree), readImage),
	]);

	const breakBeforeListItems = new Set<number>();
	const splitListItems = new Set<number>();
	const breakBeforeNodes = new Set<string>();
	const presenceAheadNodes = new Map<string, number>();
	// Every pass draws the same text, so the fonts are prepared once, from the first pass's document.
	let formeFonts: typeof fonts | undefined;
	const missingGlyphs = new Set<string>();
	const missingGlyphWarnings = new Set<string>();
	const glyphSubstitutions = new Map<string, Set<string>>();
	const layOutOnce = async (keepNestedRowsWhole: boolean) => {
		const convert = (freeFormHeights?: (number | undefined)[]) =>
			toFormeDocument(tree, {
				images,
				keepNestedRowsWhole,
				breakBeforeListItems,
				splitListItems,
				breakBeforeNodes,
				presenceAheadNodes,
				freeFormHeights,
			});
		// Forme rewrites the font entries it's given (bytes to base64), so each render gets its own.
		const render = async ({ document }: ConvertedDocument) => {
			if (!formeFonts) {
				const { prepareFont } = engine;
				const text = prepareFont ? documentText(document) : "";
				formeFonts = prepareFont
					? await Promise.all(
							fonts.map(async (font) => ({ ...font, src: await prepareFont(font.src as Uint8Array, text) })),
						)
					: fonts;
			}
			const preparedFonts = formeFonts;
			const draw = (input: FormeDocument) =>
				engine.renderSerializedDocWithLayout({ ...input, fonts: preparedFonts.map((font) => ({ ...font })) });
			if (missingGlyphs.size) await substituteMissingGlyphs(document, missingGlyphs, draw, glyphSubstitutions);
			let result = await draw(document);
			const uncovered = uncoveredCharacters(result.warnings);
			if (uncovered.size) {
				for (const character of uncovered) missingGlyphs.add(character);
				for (const warning of result.warnings)
					if (uncoveredCharacters([warning]).size) missingGlyphWarnings.add(warning);
				// shortcut: Forme 0.29 measures missing glyphs before substituting "?"; remove this retry when fixed upstream.
				if (await substituteMissingGlyphs(document, missingGlyphs, draw, glyphSubstitutions))
					result = await draw(document);
			}
			return result;
		};
		let converted = convert();
		let result = await render(converted);
```

</details>

**依据 9 · 源码核查**：[packages/pdf/src/forme/render.ts:47-56](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/pdf/src/forme/render.ts#L47-L56)

缺字体报错。

<details>
<summary>查看原文（10行）</summary>

```text
};

/** A failed font download would print the resume in other fonts: the file waits for a retry instead. */
export function assertPdfFonts({ missingFonts }: Pick<RenderedResume, "missingFonts">) {
	if (missingFonts.length > 0)
		throw new Error(`Fonts could not be loaded: ${missingFonts.join(", ")}. Retry the export.`, {
			cause: "pdf-text-loss",
		});
}

```

</details>

**依据 10 · 源码核查**：[packages/pdf/src/forme/render.ts:510-525](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/pdf/src/forme/render.ts#L510-L525)

页面缺陷warnings和实际PDF bytes结果。

<details>
<summary>查看原文（16行）</summary>

```text
	}
	if (entryPaginationRepairs(result.layout, splitListItems).orphans.length > 0)
		warnings.push("render defect: the engine couldn't keep an entry header with its content");
	if (misplacesABox(result))
		warnings.push("render defect: the engine couldn't place a box; a page may be laid out wrong");

	return {
		pdf: result.pdf,
		pageMap: extractPageMap(result.layout),
		missingFonts: [...new Set(missing)],
		layout: result.layout,
		warnings: [
			...new Set([...fontWarnings, ...imageWarnings, ...warnings, ...result.warnings, ...missingGlyphWarnings]),
		],
	};
}
```

</details>

#### 缺口

- 未生成打开PDF，字体/图像/隐私/模型数据和总费用未验。
  **影响**：不可据机制推荐直接发布真实履历或保证无文本/分页损失。
  **进一步探讨**：虚构多语言简历逐页验PDF与原JSON/版本，测过期/变更后下载、事实及全部成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 下一步怎样验证比可编程编辑更可靠的交付？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：写前强制读取版本并向人展示内容/公开状态差异，写后把版本摘要与导出件摘要/字体与分页告警一起签收，可能减少旧内容覆盖、误公开和“导出成功=正确交付”错误。现有行锁/历史/签名链接可作基础，但不把它们当已实现这套人审或事实校验，也不计未实现创新。

对照手工Web与MCP编辑虚构履历，加入同文档并发、不同账户切换、含缺字/长段/图片、签链接后改文档与恢复失败；测事实错误、误公开、差异确认率、导出缺陷、总耗时/模型费与恢复人工。若错误/返工不降或签收耗时抵消收益则否定。现阶段可在独立账户/虚构数据受限试用，只读起步，关键事实/公开或版本不明退回Web人工和本机已验文档。

#### 证据与依据

**依据 1 · 源码核查**：[packages/api/src/features/resume/service.ts:229-243](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/service.ts#L229-L243)

可选版本/行锁为强读改签收起点。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/api/src/features/resume/pdf-download-url.ts:69-88](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/api/src/features/resume/pdf-download-url.ts#L69-L88)

签名件只绑定id/user/时间非版本。

<details>
<summary>查看原文（20行）</summary>

```text
	const expiresInSeconds = TTL_SECONDS;
	const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);
	const payload = encodeJson({
		v: 1,
		resumeId,
		userId,
		expiresAt: expiresAt.getTime(),
		issuedAt: now.getTime(),
	} satisfies PdfDownloadTokenPayload);
	const token = `${payload}.${sign(payload)}`;
	const url = new URL(`/api/resumes/${encodeURIComponent(resumeId)}/pdf`, env.APP_URL);
	url.searchParams.set("token", token);

	return {
		url: url.toString(),
		expiresAt: expiresAt.toISOString(),
		expiresInSeconds,
	};
}

```

</details>

**依据 3 · 源码核查**：[packages/pdf/src/forme/render.ts:510-525](https://github.com/reactive-resume/reactive-resume/blob/77f5580a67d1e4379978e80410e0cd02ea3fd446/packages/pdf/src/forme/render.ts#L510-L525)

实际告警和PDF产物可作签收输入。

<details>
<summary>查看原文（16行）</summary>

```text
	}
	if (entryPaginationRepairs(result.layout, splitListItems).orphans.length > 0)
		warnings.push("render defect: the engine couldn't keep an entry header with its content");
	if (misplacesABox(result))
		warnings.push("render defect: the engine couldn't place a box; a page may be laid out wrong");

	return {
		pdf: result.pdf,
		pageMap: extractPageMap(result.layout),
		missingFonts: [...new Set(missing)],
		layout: result.layout,
		warnings: [
			...new Set([...fontWarnings, ...imageWarnings, ...warnings, ...result.warnings, ...missingGlyphWarnings]),
		],
	};
}
```

</details>

#### 缺口

- 差异/导出签收是否减少错误未验证。
  **影响**：不把提出方向计入当前创新或就业效果。
  **进一步探讨**：按上述固定虚构样本/故障对照设置返工和总成本停止条件。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
