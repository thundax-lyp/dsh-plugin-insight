# Notes

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[416035c](https://github.com/zhaoolee/notes/tree/416035cdccd0226aa94f045e8474b45bfd533961)

<!-- BEGIN META -->
[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes)
<!-- END META -->

> **功能**：提供便签编辑、主题排版与图片、Markdown 和网站导出。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 将编辑、主题截图和网站包组织在一个应用中；效果未对照。

> **主要限制**：[Q02](#research-q02) Web 写入未带服务端可选版本，整工作区并发保存可能覆盖。

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
  - [Q01 · 根应用为谁组织什么任务，与子插件及普通 Markdown 有何区别？](#detail-section-11)
  - [Q02 · 本地与云端如何保存，能否防止多端覆盖？](#detail-section-12)
  - [Q03 · 图片和网站导出的执行链、依赖和失败边界是什么？](#detail-section-13)
  - [Q04 · 什么条件下可以试用，遇到冲突或失败怎样退出？](#detail-section-14)
  - [Q05 · 如何验证工作区版本冲突处理是否减少内容丢失？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人内容作者用 Markdown 编辑便签并生成分享材料。

普通 Markdown 编辑器与手工排版也可完成文字和分享；本应用集成便签组织与多个输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 便签编辑 | 保存并整理文字 | 云端需账号，多端保护未接线 |
| 图片导出 | 页面截图分享 | 依赖 Chromium 和页面资源 |
| 网站包 | 生成 Hugo 与静态 ZIP | 需 Hugo，部署另行完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 与前后端依赖 | 自托管必需 | 构建和服务 | 无法运行对应服务 |
| 账号及文件存储 | 云工作区必需 | 账户数据持久化 | 本地稿不等于云备份 |
| Chromium | 图片导出必需 | 页面渲染截图 | 缺失返回错误 |
| Hugo | 网站 ZIP 操作必需 | 生成静态文件 | 缺失返回错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份源稿与存储 | 确认恢复路径 |
| 编辑 | 单端编辑并保存 | 核对本地或云状态 |
| 导出 | 生成图片或网站 ZIP | 核对正文和图片 |
| 恢复 | 保存失败回原稿 | 手动比较并重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 服务与存储费用未知 | 配置与备份 | 宿主兼容未测 |
| 持续 | 浏览器计算及存储费用未知 | 排版与核稿 | 未测单位成本 |
| 恢复 | 资源与损失未知 | 比较稿件并重新导出 | 并发结果未复现 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地和云保存 | 静态写入路径 | 多端一致性 |
| 图片导出 | 渲染与截图路径 | 排版质量与速度 |
| 网站包 | Hugo 构建与 ZIP 返回 | 实际部署与站点质量 |

> **思考**：[Q02](#research-q02) Web 写入未带服务端可选版本，整工作区并发保存可能覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 将编辑、主题截图和网站包组织在一个应用中；效果未对照。

[Q02](#research-q02) 单实例序列化与原子重命名不能代替多端版本前置；[Q03](#research-q03) 截图复用页面但依赖浏览器。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Web 写入未带服务端可选版本，整工作区并发保存可能覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先以单活动编辑端和非敏感稿件试用，保留源稿并核对导出；多端状态不明时停止云写入并比较副本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核查保存和导出代表路径，未运行应用或插件。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/lib/workspace-save.ts、src/lib/auth.ts、server/index.ts、server/auth.ts、server/site-publishing/route.ts、server/site-publishing/build.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根 README、包清单、本地与云端保存、截图与网站导出；未穷尽 UI、外网、公众号和安全路径；DSH 子组件另行研究。
- 下一步：在隔离环境验证双端冲突、崩溃恢复、导出资源和网站 ZIP，记录真实产物。

**分析版本**

- **仓库**：[zhaoolee/notes](https://github.com/zhaoolee/notes)
- **版本号**：1.15.1（[固定提交 416035c](https://github.com/zhaoolee/notes/tree/416035cdccd0226aa94f045e8474b45bfd533961)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设客户端强制前置版本并保留冲突副本能降低无提示丢稿，尚未验证。

在隔离环境验证双端冲突、崩溃恢复、导出资源和网站 ZIP，记录真实产物。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 7933 | — | — | 141370 |
| .ts | test | 39 | 15164 | 13937 | 357 | — |
| .js | source | 3 | 509 | 463 | 48 | — |
| .ts | source | 68 | 20446 | 17268 | 432 | — |
| .md | example | 1 | 86 | — | — | 1053 |
| .md | test | 3 | 366 | — | — | 1958 |
| .mjs | source | 7 | 3476 | 3033 | 36 | — |
| .tsx | source | 25 | 12974 | 11747 | 65 | — |
| .ts | example | 1 | 255 | 252 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/zhaoolee/notes/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根便签应用的保存、导出与多端覆盖边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根应用为谁组织什么任务，与子插件及普通 Markdown 有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根工程是 Web 便签应用，作者描述多便签、主题、图片、Markdown 分享和私有化部署；其 DSH 子目录是另一个独立组件，不能把子插件的工具调用当根应用身份。普通 Markdown 编辑器也能编辑和分享；此处增量是把便签组织、预览和多种导出方式组合起来，实际视觉质量、耗时与用户收益未经对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-34](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/README.md#L13-L34)

作者列出功能和宿主集成。

<details>
<summary>查看原文（22行）</summary>

```text





- 一个锤子便签风格的导出器，预览与图片导出支持**暖白纸感**、**深夜便签**、**iPhone 备忘录深浅模式**和 **Bear 极简排版**。
- 可用来分享与openclaw的对话记录。
- 完美复刻锤子便签网页版和PC版，支持多便签，分类存储。
- 支持Docker一键私有化部署
- 纯WEB应用，无需安装任何App，打开即用
- 支持PC端和手机版，多端数据同步，支持公网部署
- 支持图片插入。
- 支持一键粘贴到公众号助手。
- 支持直接导出便签为图片，或复制为markdown格式进行分享。
- 自带浏览器持久化，关闭页面也不会丢失数据。
- 开源免费，可私有化部署。
- 工匠精神沁入AI，可以通过AI Skill直接调用工具，生成便签。
- 支持自定义底部标识（点击即可编辑）
- API原生封装支持Hermes Agent，OpenClaw直接通过skill驱动管理便签
- 支持 DeepSeek Harness（DSH），让智能体将对话导出为锤子便签。
- 支持接入DeepSeek润色书写内容，语法标点检查，重点加粗，复杂概念通俗化释义。
- 支持一键下载包含图片的Markdown资源包
```

</details>

**依据 2 · 源码核查**：[package.json:1-18](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/package.json#L1-L18)

根应用私有包及构建入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "notes",
  "private": true,
  "version": "1.15.1",
  "license": "Apache-2.0",
  "type": "module",
  "scripts": {
    "backend": "tsx server/index.ts",
    "backend:watch": "tsx watch server/index.ts",
    "dev": "node scripts/dev.mjs",
    "dev:frontend": "vite --host 127.0.0.1 --port 15173",
    "dev:docker": "vite --host 0.0.0.0 --port 15173",
    "build": "npm run typecheck && npm run build:server && vite build",
    "build:static": "npm run typecheck:app && vite build",
    "build:server": "tsc -p tsconfig.server.json",
    "typecheck": "npm run typecheck:app && npm run typecheck:server && npm run typecheck:feedback",
    "typecheck:app": "tsc --noEmit -p tsconfig.json",
    "typecheck:server": "tsc --noEmit -p tsconfig.server.json",
```

</details>

#### 缺口

- 缺真实任务对照
  **影响**：不能量化组合功能的净收益
  **进一步探讨**：比较相同稿件的编辑、导出和修复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地与云端如何保存，能否防止多端覆盖？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

匿名手动保存写本地，登录且水合完成后排队提交整个工作区。Web 的 saveCloudWorkspace PUT 只发送 workspace，没有 expectedUpdatedAt；服务端虽实现可选版本比对，字段省略时绕过比对，后写入的完整工作区可能覆盖另一个编辑端，未实际复现。服务端写入以进程内队列串行，临时文件加 rename；这一队列不证明跨进程互斥。保存失败、崩溃和多端一致性仍需在部署中验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/workspace-save.ts:176-197](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/src/lib/workspace-save.ts#L176-L197)

匿名与登录写入分流。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 实际写入流程：
 * - 匿名：立即写入 localStorage，绝不触碰云端。
 * - 已登录且已完成水合：清除 debounce 定时器后立即提交最新 store 快照。
 * - 会话加载/水合完成前：直接跳过，避免用本地旧数据覆盖云端。
 */
export function performManualWorkspaceSave(
  options: ManualWorkspaceSaveOptions,
): ManualWorkspaceSaveOutcome {
  if (!options.isLoggedIn) {
    options.persistLocalWorkspace(options.getLatestWorkspace());
    return "anonymous-persisted";
  }

  if (!options.isCloudHydrated) {
    return "skipped-before-hydration";
  }

  options.clearPendingCloudSave();
  options.markCloudSyncing?.();
  options.enqueueCloudSave(options.getLatestWorkspace());
  return "cloud-enqueued";
```

</details>

**依据 2 · 源码核查**：[src/lib/auth.ts:206-227](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/src/lib/auth.ts#L206-L227)

Web 请求只发送 workspace。

<details>
<summary>查看原文（22行）</summary>

```text
export function getCloudWorkspace(): Promise<CloudWorkspace> {
  return requestJson<CloudWorkspace>(
    "/api/workspace",
    undefined,
    "读取云端便签失败。",
  );
}

export function saveCloudWorkspace(
  workspace: NoteWorkspace,
): Promise<CloudWorkspace> {
  return requestJson<CloudWorkspace>(
    "/api/workspace",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspace }),
    },
    "保存云端便签失败。",
  );
```

</details>

**依据 3 · 源码核查**：[server/index.ts:4839-4879](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/index.ts#L4839-L4879)

PUT 可选版本与冲突响应。

<details>
<summary>查看原文（41行）</summary>

```text
app.put(
  "/api/workspace",
  async (
    request: Request<Record<string, never>, unknown, WorkspaceRequestBody>,
    response: Response,
  ) => {
    const user = await requireWorkspaceUser(request, response);

    if (!user) {
      return;
    }

    const expectedUpdatedAt = request.body?.expectedUpdatedAt;

    if (
      expectedUpdatedAt !== undefined &&
      expectedUpdatedAt !== null &&
      (typeof expectedUpdatedAt !== "number" ||
        !Number.isFinite(expectedUpdatedAt))
    ) {
      response.status(400).json({
        error: "expectedUpdatedAt 必须是服务端返回的时间戳或 null。",
      });
      return;
    }

    try {
      response.json(
        await notesDataStore.saveWorkspace(
          user.id,
          request.body?.workspace,
          Date.now(),
          expectedUpdatedAt,
        ),
      );
    } catch (error) {
      response.status(error instanceof WorkspaceConflictError ? 409 : 400).json({
        error: error instanceof Error ? error.message : "云端工作区保存失败。",
        ...(error instanceof WorkspaceConflictError
          ? { updatedAt: error.updatedAt }
          : {}),
```

</details>

**依据 4 · 源码核查**：[server/auth.ts:925-955](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/auth.ts#L925-L955)

缺少前置版本时条件不触发。

<details>
<summary>查看原文（31行）</summary>

```text
  async saveWorkspace(
    userId: string,
    value: unknown,
    now = Date.now(),
    expectedUpdatedAt?: number | null,
  ): Promise<StoredWorkspace> {
    return this.runExclusive(async () => {
      const workspace = parseNoteWorkspace(JSON.stringify(value));

      if (!workspace) {
        throw new Error("云端工作区数据格式无效。");
      }

      const database = await this.readDatabase();
      const currentUpdatedAt = database.workspaces[userId]?.updatedAt ?? null;

      if (
        expectedUpdatedAt !== undefined &&
        currentUpdatedAt !== expectedUpdatedAt
      ) {
        throw new WorkspaceConflictError(currentUpdatedAt);
      }

      const stored = {
        updatedAt: Math.max(now, (currentUpdatedAt ?? 0) + 1),
        workspace,
      };
      database.workspaces[userId] = stored;
      await this.writeDatabase(database);
      return stored;
    });
```

</details>

**依据 5 · 源码核查**：[server/auth.ts:585-638](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/auth.ts#L585-L638)

JSON 文件原子替换与实例级队列。

<details>
<summary>查看原文（54行）</summary>

```text
export class NotesDataStore {
  readonly databasePath: string;
  private operationQueue: Promise<unknown> = Promise.resolve();

  constructor(dataDirectory: string) {
    this.databasePath = path.join(dataDirectory, "notes-data.json");
  }

  private async readDatabase(): Promise<AuthDatabase> {
    try {
      return parseDatabase(
        JSON.parse(await fs.readFile(this.databasePath, "utf8")) as unknown,
      );
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return createEmptyDatabase();
      }

      throw error;
    }
  }

  private async writeDatabase(database: AuthDatabase): Promise<void> {
    await fs.mkdir(path.dirname(this.databasePath), { recursive: true });
    const temporaryPath = `${this.databasePath}.${randomBytes(6).toString("hex")}.tmp`;

    try {
      await fs.writeFile(
        temporaryPath,
        `${JSON.stringify(database, null, 2)}\n`,
        {
          encoding: "utf8",
          mode: 0o600,
        },
      );
      await fs.rename(temporaryPath, this.databasePath);
    } finally {
      await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    }
  }

  private runExclusive<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operationQueue.then(operation, operation);
    this.operationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
```

</details>

#### 缺口

- 未测试多端写入和多进程部署
  **影响**：不能确定覆盖频率或恢复效果
  **进一步探讨**：隔离环境同时编辑并观察最终内容和冲突提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图片和网站导出的执行链、依赖和失败边界是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

图片请求把 Markdown 送到渲染页面，等待编辑器和资源，再截取便签并保存；依赖 Playwright Chromium 和部署资源。网站导出要求同源检查与用户，限制并发，构建 Hugo 文件及静态 public，打 ZIP 响应；生成包不等于已部署网站。失败会返回错误，真实图片完整性、浏览器版本、Hugo 环境和外部资源情况尚未验证。首次自托管需服务、存储及配置，持续承担计算和人工核稿；失败恢复应保留源 Markdown 并重新核对图片，金额与耗时未知。

#### 证据与依据

**依据 1 · 源码核查**：[server/index.ts:3429-3452](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/index.ts#L3429-L3452)

渲染、资源等待与截图。

<details>
<summary>查看原文（24行）</summary>

```text
async function renderNotePng(markdown: string, renderUrl: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage({
    deviceScaleFactor: exportDeviceScaleFactor,
    viewport: { width: 1280, height: 960 },
  });

  try {
    await page.goto(renderUrl, {
      waitUntil: "domcontentloaded",
    });

    const editor = page.locator("#markdown-editor");
    await editor.waitFor();
    await editor.fill(markdown);
    await waitForAssets(page);

    const noteSheet = page.locator(".note-sheet");
    await noteSheet.waitFor();
    await waitForStableHeight(noteSheet);
    return await screenshotNoteSheet(noteSheet);
  } finally {
    await page.close();
  }
```

</details>

**依据 2 · 源码核查**：[server/index.ts:4885-4926](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/index.ts#L4885-L4926)

导出图片和缺 Chromium 的错误。

<details>
<summary>查看原文（42行）</summary>

```text
app.post(
  "/api/export",
  async (
    request: Request<Record<string, never>, unknown, ExportRequestBody>,
    response: Response,
  ) => {
    try {
      const body = request.body || {};
      const theme = resolveTheme(body);
      const renderUrl = getRenderUrl(request, theme, resolveFooterConfig(body));
      const markdown = normalizeRenderableImageUrls(
        await resolveMarkdown(body),
        request,
        renderUrl,
      );
      const requestedFilename = resolveExportFilename(body.filename);

      const pngBuffer = await renderNotePng(markdown, renderUrl);
      const storedExport = await persistExport(request, requestedFilename, pngBuffer);

      response.setHeader("Content-Type", "image/png");
      response.setHeader("Content-Disposition", `inline; filename="${storedExport.filename}"`);
      response.setHeader("X-Export-Path", storedExport.path);
      response.setHeader("X-Export-Url", storedExport.url);
      response.setHeader("X-Export-Theme", theme);
      response.send(pngBuffer);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to export note image";
      const isBrowserInstallError =
        message.includes("Executable doesn't exist") ||
        message.includes("Please run the following command");

      console.error("Export request failed:", error);

      response.status(error instanceof UnsupportedExportThemeError ? 400 : 500).json({
        error: message,
        hint: isBrowserInstallError
          ? "Run `npx playwright install chromium` on this machine."
          : undefined,
      });
    }
```

</details>

**依据 3 · 源码核查**：[server/site-publishing/route.ts:15-43](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/site-publishing/route.ts#L15-L43)

认证、并发、超时及 ZIP 返回。

<details>
<summary>查看原文（29行）</summary>

```text
  return async (request: Request, response: Response): Promise<void> => {
    response.setHeader("Cache-Control", "no-store");
    if (!options.isSameOrigin(request)) { response.status(403).json({ error: "请从本站打开网站发布面板。" }); return; }
    const user = await options.getUser(request, response);
    if (!user) return;
    if (running.has(user.id) || running.size >= 2) { response.status(429).json({ error: "已有网站导出正在进行，请稍后再试。" }); return; }
    let parsed;
    try { parsed = validateSiteExportRequest(request.body); } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "网站设置不正确。" }); return;
    }
    running.add(user.id);
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 120_000);
    const disconnect = () => { if (!response.writableFinished) controller.abort(); };
    response.on("close", disconnect);
    try {
      const entries = await buildSiteEntries(parsed, {
        rootDirectory: options.rootDirectory, signal: controller.signal,
        readImage: createSiteImageReader({ imagesDirectory: options.imagesDirectory, publicDirectory: options.publicDirectory, publicOrigin: options.publicOrigin(request) }),
      });
      controller.signal.throwIfAborted();
      const buffer = options.createZip(entries);
      response.setHeader("Content-Type", "application/zip");
      response.setHeader("Content-Disposition", 'attachment; filename="notes-hugo-site.zip"');
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.send(buffer);
    } catch (error) {
      if (response.destroyed) return;
      response.status(controller.signal.aborted ? 504 : 422).json({ error: controller.signal.aborted ? "网站生成超时，请减少便签或图片后重试。" : error instanceof Error ? error.message : "网站生成失败，请重试。" });
```

</details>

**依据 4 · 源码核查**：[server/site-publishing/build.ts:190-208](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/site-publishing/build.ts#L190-L208)

构建说明和 Hugo 子进程依赖。

<details>
<summary>查看原文（19行）</summary>

```text
  add(".gitignore", "/public/\n/resources/\n/.hugo_build.lock\n");
  add("README.md", `# ${settings.title.replace(/[\r\n]/g, " ")}\n\n使用 notes 生成的 Hugo 网站，样式：经典便签博客。\n\n站点地址：${siteAddress}\n\n## 直接部署静态文件\n\n${deploymentDescription}\n\n## 修改后重新构建\n\n安装 Hugo Extended 0.162.1 或兼容版本，在本目录运行 hugo。运行 hugo server 可本地预览。站点域名或子路径变化时，先修改 hugo.json 的 baseURL（未填写域名时它是部署根路径）并重新构建，不能只移动旧的 public/。文章与图片位于 content/<栏目>/<文章ID>/。\n\n## GitHub Pages\n\n将源码提交到独立仓库，在 Settings → Pages 中将 Source 设置为 GitHub Actions。包内工作流会构建并发布。项目站点 basePath 通常应为 /仓库名/，自定义域名按实际路径配置。上传文件时请包含隐藏的 .github/ 目录。已有网站的子路径部署需要由现有主机或主站发布流程合并 public/，不能直接用本包覆盖主站。\n\n## 内容与模板\n\n仅导出本次勾选的便签。原始 HTML 以文字保留；Hugo shortcode 按原文展示，不执行。网站分类独立于便签文件夹。搜索使用本地索引，无需外部服务。模板参考 https://github.com/zhaoolee/zhaoolee.github.io，个人统计、广告与域名未携带。\n`);
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "notes-hugo-build-"));
  try {
    for (const [filename, data] of files) {
      const destination = path.join(temporary, filename);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.writeFile(destination, data);
    }
    options.signal.throwIfAborted();
    try {
      await execFileAsync(options.hugoBinary ?? process.env.HUGO_BIN ?? "hugo", ["--source", temporary, "--destination", path.join(temporary, "public"), "--gc", "--minify"], {
        cwd: temporary, timeout: 60_000, maxBuffer: 512 * 1024, signal: options.signal,
        env: { PATH: process.env.PATH, HOME: temporary, TMPDIR: temporary, HUGO_CACHEDIR: path.join(temporary, ".cache"), HUGO_ENVIRONMENT: "production" },
      });
    } catch (error) {
      if (options.signal.aborted) throw error;
      if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new Error("服务端未安装 Hugo，请安装 Hugo Extended 0.162.1 后重试，或更新服务镜像。");
      throw new Error("Hugo 网站构建失败，请检查便签内容或联系管理员查看运行环境。", { cause: error });
```

</details>

#### 缺口

- 未执行长文、图片、Hugo 和截图
  **影响**：不能证明输出完整或费用可控
  **进一步探讨**：固定文稿对比图片和 ZIP 文件并测试缺依赖。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下可以试用，遇到冲突或失败怎样退出？

**研究主题**：采用判断

#### 完整回答

希望将文字便签排版分享的单人用户，可先用非敏感稿件在一个活动编辑端核对本地及云副本，再检查图片、站点 ZIP 的全文和资源。多端编辑前先确认保护版本的实现，当前 Web 写入未传此字段，因此不应把服务端可选校验当作已接入。截图失败或外部资源缺失时保留源稿并回到 Markdown 与手工导出；生成网站包后另行审阅，不把生成视为发布。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/auth.ts:214-227](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/src/lib/auth.ts#L214-L227)

前端写入无版本字段。

<details>
<summary>查看原文（14行）</summary>

```text
export function saveCloudWorkspace(
  workspace: NoteWorkspace,
): Promise<CloudWorkspace> {
  return requestJson<CloudWorkspace>(
    "/api/workspace",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspace }),
    },
    "保存云端便签失败。",
  );
```

</details>

**依据 2 · 源码核查**：[server/auth.ts:938-954](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/auth.ts#L938-L954)

服务端校验在提供版本时才发生。

<details>
<summary>查看原文（17行）</summary>

```text
      const database = await this.readDatabase();
      const currentUpdatedAt = database.workspaces[userId]?.updatedAt ?? null;

      if (
        expectedUpdatedAt !== undefined &&
        currentUpdatedAt !== expectedUpdatedAt
      ) {
        throw new WorkspaceConflictError(currentUpdatedAt);
      }

      const stored = {
        updatedAt: Math.max(now, (currentUpdatedAt ?? 0) + 1),
        workspace,
      };
      database.workspaces[userId] = stored;
      await this.writeDatabase(database);
      return stored;
```

</details>

**依据 3 · 源码核查**：[server/site-publishing/route.ts:25-43](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/site-publishing/route.ts#L25-L43)

生成结果为下载 ZIP 和失败响应。

<details>
<summary>查看原文（19行）</summary>

```text
    running.add(user.id);
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 120_000);
    const disconnect = () => { if (!response.writableFinished) controller.abort(); };
    response.on("close", disconnect);
    try {
      const entries = await buildSiteEntries(parsed, {
        rootDirectory: options.rootDirectory, signal: controller.signal,
        readImage: createSiteImageReader({ imagesDirectory: options.imagesDirectory, publicDirectory: options.publicDirectory, publicOrigin: options.publicOrigin(request) }),
      });
      controller.signal.throwIfAborted();
      const buffer = options.createZip(entries);
      response.setHeader("Content-Type", "application/zip");
      response.setHeader("Content-Disposition", 'attachment; filename="notes-hugo-site.zip"');
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.send(buffer);
    } catch (error) {
      if (response.destroyed) return;
      response.status(controller.signal.aborted ? 504 : 422).json({ error: controller.signal.aborted ? "网站生成超时，请减少便签或图片后重试。" : error instanceof Error ? error.message : "网站生成失败，请重试。" });
```

</details>

#### 缺口

- 未测用户恢复与多端编辑
  **影响**：无法断言退出无损
  **进一步探讨**：先备份并演练离线、双端冲突和图片还原。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证工作区版本冲突处理是否减少内容丢失？

**研究主题**：新假设与验证

#### 完整回答

一个未实现的方向是让 Web 写入携带读取时的版本，409 时保留本地稿和云稿并提示选择或合并。服务器已有可选前置版本，因此新增价值是客户端接线与冲突恢复，不是声称服务器缺少校验。隔离对照单端、双端不同便签、双端同便签及离线重连，记录无提示丢稿、误报和合并负担；若内容无提示消失或额外负担超过收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/auth.ts:214-227](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/src/lib/auth.ts#L214-L227)

当前 Web 未发送前置版本。

<details>
<summary>查看原文（14行）</summary>

```text
export function saveCloudWorkspace(
  workspace: NoteWorkspace,
): Promise<CloudWorkspace> {
  return requestJson<CloudWorkspace>(
    "/api/workspace",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspace }),
    },
    "保存云端便签失败。",
  );
```

</details>

**依据 2 · 源码核查**：[server/auth.ts:925-955](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/auth.ts#L925-L955)

可选服务端版本条件。

<details>
<summary>查看原文（31行）</summary>

```text
  async saveWorkspace(
    userId: string,
    value: unknown,
    now = Date.now(),
    expectedUpdatedAt?: number | null,
  ): Promise<StoredWorkspace> {
    return this.runExclusive(async () => {
      const workspace = parseNoteWorkspace(JSON.stringify(value));

      if (!workspace) {
        throw new Error("云端工作区数据格式无效。");
      }

      const database = await this.readDatabase();
      const currentUpdatedAt = database.workspaces[userId]?.updatedAt ?? null;

      if (
        expectedUpdatedAt !== undefined &&
        currentUpdatedAt !== expectedUpdatedAt
      ) {
        throw new WorkspaceConflictError(currentUpdatedAt);
      }

      const stored = {
        updatedAt: Math.max(now, (currentUpdatedAt ?? 0) + 1),
        workspace,
      };
      database.workspaces[userId] = stored;
      await this.writeDatabase(database);
      return stored;
    });
```

</details>

**依据 3 · 源码核查**：[server/index.ts:4865-4879](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/server/index.ts#L4865-L4879)

冲突映射 409。

<details>
<summary>查看原文（15行）</summary>

```text
    try {
      response.json(
        await notesDataStore.saveWorkspace(
          user.id,
          request.body?.workspace,
          Date.now(),
          expectedUpdatedAt,
        ),
      );
    } catch (error) {
      response.status(error instanceof WorkspaceConflictError ? 409 : 400).json({
        error: error instanceof Error ? error.message : "云端工作区保存失败。",
        ...(error instanceof WorkspaceConflictError
          ? { updatedAt: error.updatedAt }
          : {}),
```

</details>

#### 缺口

- 前置版本接线及冲突交互尚未验证
  **影响**：无法判断丢稿率或用户负担
  **进一步探讨**：按上述双端场景对照并留存双方原稿。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
