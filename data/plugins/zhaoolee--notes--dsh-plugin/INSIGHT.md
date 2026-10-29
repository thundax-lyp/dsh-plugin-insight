# DSH Notes 对话导出

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[878cfab](https://github.com/zhaoolee/notes/tree/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 315](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=315&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes) [![npm 30d 848](https://img.shields.io/static/v1?label=npm+30d&message=848&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhaoolee/dsh-notes) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhaoolee/dsh-notes)
<!-- END META -->

> **功能**：将 Agent 整理的 Markdown 写入便签服务，或经匿名渲染生成本地 PNG 长图。

> **亮点**：统一工具连接笔记与图片两类输出，云端更新保留未传字段并带乐观版本比较；减少接线但不证明节时或原文完整。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：未配baseUrl会把完整markdown发公网演示渲染，图片不是可编辑笔记；409重试也不能解决保存后响应丢失，盲重试新建可能重复。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 工具类型和相对复制粘贴的贡献是什么？](#detail-section-11)
  - [Q02 · 写入与图片两条链怎样接线，失败是否幂等？](#detail-section-12)
  - [Q03 · 地址、凭据和本地文件有什么工程与隐私边界？](#detail-section-13)
  - [Q04 · 如何验证一张合格便签，总成本和建议是什么？](#detail-section-14)
  - [Q05 · 哪个恢复设计假设值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望把对话整理成可编辑便签或分享长图的DSH用户，可使用统一工具，但要明确输出类型与发送目的地。见[Q01](#research-q01)。

基线是复制粘贴、手工建便签/分类与截图；输入是Agent整理稿而非原始会话，保真需另验。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 新建云端便签 | 保存整理后的markdown | 需baseUrl/认证；不是逐字会话备份 |
| 按ID更新 | 替换正文并可改分类/星标/置顶 | 未传字段保留，409重读最多四次 |
| 匿名导出PNG | 生成可分享长图并本地保存 | 未配地址默认公网渲染，不能写便签列表 |
| 返回目的地与位置 | 给server/action/ID或文件 | 不含提交后独立回读保证 |

**流程与依赖**

需宿主tools、可信API及凭据或明确接受匿名渲染的网络目的地；完整表见[Q04](#research-q04)。

明确类型和服务器，先小样导出再回读，未知提交先查已知ID而非盲重试；步骤见[Q04](#research-q04)。

**效果与成本**

模型整理、workspace传输、渲染和人工复核费用/时间未知；阶段表见[Q04](#research-q04)。

实现统一出口和有限冲突重试，不保证结果保真、服务可用或不重复；效果见[Q04](#research-q04)。

> **思考**：未配baseUrl会把完整markdown发公网演示渲染，图片不是可编辑笔记；409重试也不能解决保存后响应丢失，盲重试新建可能重复。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一工具连接笔记与图片两类输出，云端更新保留未传字段并带乐观版本比较；减少接线但不证明节时或原文完整。见[Q01](#research-q01)、[Q02](#research-q02)。

客户端与宿主层分离、条件写和明确输出类型可借鉴；新建无外部稳定幂等ID、成功后未GET回读，图片字节与临时副本依赖服务和用户管理。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

未配baseUrl会把完整markdown发公网演示渲染，图片不是可编辑笔记；409重试也不能解决保存后响应丢失，盲重试新建可能重复。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有可信便签服务者可用非敏感短对话试导出，回读内容/分类/实际server；类型不符、内容遗漏或超时重复时停自动流程，先核对已有ID，退回复制粘贴。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生工具与两条API接线有源码依据；目标宿主、服务隔离、渲染和端到端完整性未运行。可在可信服务及非敏感小样本范围试用，未来恢复方案未实现。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/package.json、dsh-plugin/README.md、dsh-plugin/cordis.patch.yml、dsh-plugin/src/index.ts、dsh-plugin/src/notes-client.ts、dsh-plugin/src/types.ts、dsh-plugin/lib/index.js、dsh-plugin/lib/notes-client.js 及固定范围 inventory；组件：dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整阅读dsh-plugin的src/index与notes-client及包/patch，并定向核对lib分发路径；未检查整个notes后端、在线演示或真实账号，不执行导出。
- 下一步：后续在临时工作区用正常/409/保存后断线及PNG落盘失败样本核对重复、保留字段和真实内容；不把作者端到端测试说明当本轮结果。

**分析版本**

- **仓库**：[zhaoolee/notes](https://github.com/zhaoolee/notes)
- **版本号**：0.1.2（[固定提交 878cfab](https://github.com/zhaoolee/notes/tree/878cfab47a87183524d7f0ddd6b7b791181c0801)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是稳定操作ID加结果未知/回读确认状态，可减少断线后的重复导出；以提交后断线、409和本地写失败比较重复与恢复时间，服务无支持时先给可核对ID不假装exactly-once。见[Q05](#research-q05)。

后续在临时工作区用正常/409/保存后断线及PNG落盘失败样本核对重复、保留字段和真实内容；不把作者端到端测试说明当本轮结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 509 | 463 | 48 | — |
| .md | source | 1 | 134 | — | — | 1331 |
| .ts | source | 3 | 808 | 656 | 69 | — |
| .ts | test | 3 | 758 | 668 | 41 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhaoolee/notes/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/zhaoolee/notes/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhaoolee/notes/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对话导出写到哪里，并发与未知提交如何影响合格结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具类型和相对复制粘贴的贡献是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH Host工具插件，apply通过ctx.tools.register定义notes_export_conversation，bundle插入notes-export行。它不提供便签服务本身，也不从宿主直接读取原始会话事件；工具输入是Agent整理后的markdown。因此“导出对话”实际是用户授权后由Agent选写内容，再经客户端写入或渲染，不是可证明逐字完整的会话备份。

目标人群是希望把一段对话整理成可继续编辑或分享便签的用户。基线是复制到编辑器、手工建便签/分类，再另截图。插件增加统一工具参数，把markdown与目标便签ID、文件夹、星标、置顶或图片主题传到API，返回可打开位置。节省接线有实现依据，整理是否遗漏、主题是否合适和实际时间节省还需验收。

它有两种不同交付物：配置服务地址时写当前账号工作区，新建或更新；没有地址时去默认演示服务器渲染PNG并写本地临时文件，不会在云端便签列表建一张。用户要的是可编辑笔记时，导出长图并不算同一个结果；提示词或工具成功不能掩盖交付类型变化。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:63-100](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L63-L100)

真实工具注册和参数，不读取原始会话。

<details>
<summary>查看原文（38行）</summary>

```text
    defineTool({
      name: "notes_export_conversation",
      description: TOOL_DESCRIPTION,
      parameters: {
        markdown: {
          type: "string",
          required: true,
          description: "对话内容整理后的 Markdown 全文（建议首行 # 标题）。",
        },
        note_id: {
          type: "string",
          description: "（写入模式）更新已有便签时传它的 ID（来自上一次导出的 note_id）。",
        },
        folder: {
          type: "string",
          description:
            "（写入模式）文件夹 ID 或精确名称；none/null/未分类 表示清除分类。省略时新建便签归为未分类。",
        },
        starred: {
          type: "boolean",
          description: "（写入模式）是否加星。",
        },
        pinned: {
          type: "boolean",
          description: "（写入模式）是否置顶。",
        },
        theme: {
          type: "string",
          enum: [...EXPORT_THEMES],
          description: "（图片模式）便签主题，默认 default。",
        },
      },
      output: {
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            action: {
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:140-168](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L140-L168)

未配置走图片输出。

<details>
<summary>查看原文（29行）</summary>

```text
      timeoutMs: 60_000,
      execute: async (args, exec): Promise<ExportToolOutput> => {
        try {
          const configuredBaseUrl = readConfiguredBaseUrl(config);

          if (!configuredBaseUrl) {
            // 分级模式 2：未配置 → 默认演示服务器匿名导出图片。
            const demoServer = resolveDemoServer(config);
            const client = new NotesClient({ baseUrl: demoServer });
            const title = extractNoteTitle(args.markdown);
            const image = await client.exportImage(
              {
                markdown: args.markdown,
                theme: args.theme,
                filename: `${toSafeFilename(title)}.png`,
              },
              exec.signal,
            );
            const filePath = await savePngToTempFile(image.png, title);

            return {
              action: "exported-image",
              note_id: null,
              title,
              url: image.url,
              file_path: filePath,
              updated_at: null,
              server: demoServer,
            };
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:171-196](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L171-L196)

配置服务时写便签。

<details>
<summary>查看原文（26行）</summary>

```text
          // 分级模式 1：已配置 → 写入便签列表。
          const serviceConfig = resolveServiceConfig(config);
          const client = new NotesClient(serviceConfig);
          const result = await client.exportNote(
            {
              markdown: args.markdown,
              noteId: args.note_id,
              folder: args.folder,
              starred: args.starred,
              pinned: args.pinned,
            },
            exec.signal,
          );

          return {
            action: result.action,
            note_id: result.noteId,
            title: result.title,
            url: result.url,
            file_path: null,
            updated_at: result.updatedAt,
            server: result.server,
          };
        } catch (error) {
          if (error instanceof NotesApiError) {
            throw new Error(`导出便签失败：${error.message}`);
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/cordis.patch.yml:4-7](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/cordis.patch.yml#L4-L7)

bundle插入Host插件。

```text
- insert:
    - id: notes-export
      name: "@zhaoolee/dsh-notes"
      config: {}
```

#### 缺口

- 没有真实用户导出完整性和时间对照
  **影响**：不能称自动保真或节时已实现
  **进一步探讨**：用户先给应保留内容清单，对比原会话与便签，记录遗漏和修订时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写入与图片两条链怎样接线，失败是否幂等？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

写入模式先解析Token，再GET整个workspace，按note_id更新已有非回收站便签，或生成随机UUID新建；未传folder/starred/pinned时更新保留原值。随后PUT整个workspace并带expectedUpdatedAt，只有收到409时重新读后最多四次尝试。并发保护依赖服务端真实执行版本比较，本插件源码能证明有条件提交参数，不能证明部署服务一定按约定隔离并发。

409重试与未知结果不是一回事。PUT已在服务端保存但响应丢失时，此处抛网络错误，未查询已写状态；新建的UUID在单次处理内部生成，没有给调用者可复用的幂等请求键。用户/宿主重新调用新建会再生成另一个ID，可能重复便签。源码没有把超时明确包装成“可能已保存”，也不做提交后GET校验。收到成功响应就返回ID/title/url，updated_at缺失时还回本地now，故不能将所有返回时间当服务端回读的持久时间。已知ID更新比重新新建容易核对，但也要先读实际内容。

图片模式POST markdown到/api/export，成功后读取全部响应字节和X-Export-Url，写入私有临时目录再返回本地路径。若服务端已生成图片、但本地写失败，工具仍失败，线上图片可能已存在；再次尝试可能重复生成。客户端未验证PNG签名/内容类型或限制arrayBuffer最大体积，依赖目标服务返回合理内容。图片成功只证明字节写到文件，不证明长文没有裁切或中文渲染正确。

这两条链都传递exec.signal并有60秒工具超时，但取消不等于撤销远端写入。结果未知时应先核对工作区或已知导出链接，再决定是否重试，而不是“报错就一定没写”。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/notes-client.ts:357-404](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L357-L404)

workspace读改和已有便签更新。

<details>
<summary>查看原文（48行）</summary>

```text
  async exportNote(
    input: ExportNoteInput,
    signal?: AbortSignal,
  ): Promise<ExportResult> {
    const markdown = input.markdown.trim();

    if (!markdown) {
      throw new NotesApiError("便签内容不能为空。");
    }

    const token = await this.resolveToken(signal);
    const now = Date.now();

    for (let attempt = 1; attempt <= MAX_MUTATION_ATTEMPTS; attempt += 1) {
      const loaded = await this.loadWorkspace(token, signal);
      const workspace: NoteWorkspace = loaded.workspace ?? {
        activeNoteId: "",
        folders: [],
        notes: [],
        version: 1,
      };

      let noteId: string;
      let action: "created" | "updated";

      if (input.noteId) {
        const existing = workspace.notes.find(
          (candidate) => candidate.id === input.noteId,
        );

        if (!existing) {
          throw new NotesApiError(`未找到便签：${input.noteId}`);
        }

        if (existing.deletedAt !== null) {
          throw new NotesApiError("回收站中的便签不能修改。");
        }

        existing.markdown = markdown;
        existing.updatedAt = now;

        if (input.folder !== undefined) {
          existing.folderId = resolveFolderId(workspace, input.folder);
        }
        if (input.starred !== undefined) {
          existing.isStarred = input.starred;
        }
        if (input.pinned !== undefined) {
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/notes-client.ts:410-458](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L410-L458)

随机新建、条件PUT、仅409重试与响应返回。

<details>
<summary>查看原文（49行）</summary>

```text
      } else {
        const folderId =
          input.folder === undefined
            ? null
            : resolveFolderId(workspace, input.folder);
        const note = createNoteDocument(workspace, {
          folderId,
          isStarred: input.starred === true,
          markdown,
          now,
          pinned: input.pinned === true,
        });

        workspace.activeNoteId = note.id;
        workspace.notes = [note, ...workspace.notes];
        noteId = note.id;
        action = "created";
      }

      try {
        const stored = await this.saveWorkspace(
          token,
          loaded.updatedAt,
          workspace,
          signal,
        );

        return {
          action,
          noteId,
          title: extractNoteTitle(markdown),
          url: buildNoteUrl(this.baseUrl, noteId),
          filePath: null,
          updatedAt: stored.updatedAt ?? now,
          server: this.baseUrl,
        };
      } catch (error) {
        if (
          error instanceof NotesApiError &&
          error.status === 409 &&
          attempt < MAX_MUTATION_ATTEMPTS
        ) {
          continue;
        }

        throw error;
      }
    }

```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/notes-client.ts:166-181](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L166-L181)

新建使用UUID。

<details>
<summary>查看原文（16行）</summary>

```text
    0,
  );
  const newestPinnedAt = workspace.notes.reduce(
    (latest, note) => Math.max(latest, note.pinnedAt ?? 0),
    0,
  );

  return {
    id: randomUUID(),
    markdown: options.markdown,
    createdAt: options.now,
    updatedAt: options.now,
    normalOrder: firstNormalOrder - 1,
    pinnedAt: options.pinned ? Math.max(options.now, newestPinnedAt + 1) : null,
    folderId: options.folderId,
    isStarred: options.isStarred,
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/notes-client.ts:466-508](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L466-L508)

匿名导出和响应字节/链接。

<details>
<summary>查看原文（43行）</summary>

```text
  async exportImage(
    input: ExportImageInput,
    signal?: AbortSignal,
  ): Promise<ImageExportResult> {
    const markdown = input.markdown.trim();

    if (!markdown) {
      throw new NotesApiError("便签内容不能为空。");
    }

    const body: Record<string, string> = { markdown };

    if (input.theme) {
      body.theme = input.theme;
    }
    if (input.filename) {
      body.filename = input.filename;
    }

    const response = await this.fetchImpl(`${this.baseUrl}/api/export`, {
      method: "POST",
      signal,
      headers: {
        Accept: "image/png",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await this.readResponsePayload(response);
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? String((payload as { error: unknown }).error)
          : `图片导出失败（HTTP ${response.status}）`;
      throw new NotesApiError(message, response.status, payload);
    }

    const png = new Uint8Array(await response.arrayBuffer());
    const url = response.headers.get("X-Export-Url");
    const theme = response.headers.get("X-Export-Theme") ?? input.theme ?? "default";

    return { png, url, theme };
```

</details>

**依据 5 · 源码核查**：[dsh-plugin/src/index.ts:138-158](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L138-L158)

超时、signal和图片落盘顺序。

<details>
<summary>查看原文（21行）</summary>

```text
        ],
      },
      timeoutMs: 60_000,
      execute: async (args, exec): Promise<ExportToolOutput> => {
        try {
          const configuredBaseUrl = readConfiguredBaseUrl(config);

          if (!configuredBaseUrl) {
            // 分级模式 2：未配置 → 默认演示服务器匿名导出图片。
            const demoServer = resolveDemoServer(config);
            const client = new NotesClient({ baseUrl: demoServer });
            const title = extractNoteTitle(args.markdown);
            const image = await client.exportImage(
              {
                markdown: args.markdown,
                theme: args.theme,
                filename: `${toSafeFilename(title)}.png`,
              },
              exec.signal,
            );
            const filePath = await savePngToTempFile(image.png, title);
```

</details>

#### 缺口

- 服务器实际并发、未知提交与PNG渲染未执行验证
  **影响**：不能保证不重复或已持久回读
  **进一步探讨**：在临时服务模拟409、保存后断线和落盘失败，按已知ID核对实际工作区。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 地址、凭据和本地文件有什么工程与隐私边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

配置优先插件config再环境变量。模式选择只检查baseUrl是否存在，没有地址即用demoServer或内置公网演示站；即使用户只配了token但漏baseUrl，也仍走图片模式。配置地址但缺凭据则明确报错，不静默改去演示站。这个区分对首次使用很重要：未配置不是离线，也不意味着仅在用户电脑内渲染。

图片分支把用户提交的完整markdown发送给目标渲染服务，并可能得到公开URL。README说匿名接口不写账号工作区，这不等于不经过外部服务器或已证明日志、临时图片没有保留；本组件没有检查远端部署留存。敏感内容应配置自己信任的服务，在发送前决定内容，而不是导出完再解释。工具本身没有独立确认对话应发去哪一方，授权与可见提示需依赖Agent/宿主使用流程。

凭据优先用稳定Bearer Token，没有时用用户名密码申请skill-token，仅在NotesClient实例内缓存Promise；每次工具execute新建client，所以不能把它概括为跨工具调用的一次登录缓存。客户端代码不把新Token另存磁盘，但原配置/环境的存放仍归宿主管理。baseUrl只trim和去尾斜线，未强制HTTPS或做独立目标白名单；实际网络信任应由部署者确认。

PNG临时目录由mkdtemp生成，文件wx写入0600，降低本地同机其他用户读写机会；POSIX模式不能代替Windows ACL评估。文件没有自动删除生命周期，远端URL和本地PNG都是额外副本。退出插件停止后续工具调用，不自动删笔记、图片、服务日志或撤销Token。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/notes-client.ts:54-77](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L54-L77)

地址和默认演示解析。

<details>
<summary>查看原文（24行）</summary>

```text
  return trimmed ? trimmed : undefined;
}

/**
 * 只读取用户显式配置的便签服务地址（插件 config → 环境变量），未配置返回
 * undefined 且不报错——调用方据此选择「写入便签」还是「匿名导出图片」。
 */
export function readConfiguredBaseUrl(
  explicit?: Partial<NotesServiceConfig>,
): string | undefined {
  return normalizeBaseUrl(explicit?.baseUrl ?? readEnv("NOTES_API_BASE_URL"));
}

/** 未配置 baseUrl 时使用的默认演示服务器（config → 环境变量 → 内置默认值）。 */
export function resolveDemoServer(
  explicit?: Partial<NotesServiceConfig>,
): string {
  return (
    normalizeBaseUrl(explicit?.demoServer ?? readEnv("NOTES_DEMO_SERVER")) ??
    DEFAULT_DEMO_SERVER
  );
}

/**
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:140-149](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L140-L149)

只用baseUrl区分模式。

<details>
<summary>查看原文（10行）</summary>

```text
      timeoutMs: 60_000,
      execute: async (args, exec): Promise<ExportToolOutput> => {
        try {
          const configuredBaseUrl = readConfiguredBaseUrl(config);

          if (!configuredBaseUrl) {
            // 分级模式 2：未配置 → 默认演示服务器匿名导出图片。
            const demoServer = resolveDemoServer(config);
            const client = new NotesClient({ baseUrl: demoServer });
            const title = extractNoteTitle(args.markdown);
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/notes-client.ts:305-329](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L305-L329)

Token优先及实例内缓存。

<details>
<summary>查看原文（25行）</summary>

```text
  resolveToken(signal?: AbortSignal): Promise<string> {
    if (this.config.token) {
      return Promise.resolve(this.config.token);
    }

    if (!this.config.username || !this.config.password) {
      return Promise.reject(
        new NotesApiError(
          "缺少认证信息。请设置 NOTES_API_TOKEN，或提供 NOTES_API_USERNAME/" +
            "NOTES_API_PASSWORD 以自动申请 Token。",
        ),
      );
    }

    if (!this.tokenPromise) {
      this.tokenPromise = this.requestSkillToken(signal).catch((error) => {
        this.tokenPromise = null;
        throw error;
      });
    }

    return this.tokenPromise;
  }

  private async loadWorkspace(
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/index.ts:171-175](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L171-L175)

每次execute新建客户端。

```text
          // 分级模式 1：已配置 → 写入便签列表。
          const serviceConfig = resolveServiceConfig(config);
          const client = new NotesClient(serviceConfig);
          const result = await client.exportNote(
            {
```

**依据 5 · 源码核查**：[dsh-plugin/src/notes-client.ts:201-211](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L201-L211)

本地私有临时PNG。

<details>
<summary>查看原文（11行）</summary>

```text
export async function savePngToTempFile(
  png: Uint8Array,
  title: string,
): Promise<string> {
  const safeTitle = title.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 60) || "note";
  const directory = await mkdtemp(path.join(tmpdir(), "dsh-notes-"));
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeTitle}.png`;
  const filePath = path.join(directory, filename);
  await writeFile(filePath, png, { flag: "wx", mode: 0o600 });
  return filePath;
}
```

</details>

**依据 6 · 源码核查**：[dsh-plugin/src/notes-client.ts:486-506](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L486-L506)

完整markdown发送及可能公开URL。

<details>
<summary>查看原文（21行）</summary>

```text
      method: "POST",
      signal,
      headers: {
        Accept: "image/png",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await this.readResponsePayload(response);
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? String((payload as { error: unknown }).error)
          : `图片导出失败（HTTP ${response.status}）`;
      throw new NotesApiError(message, response.status, payload);
    }

    const png = new Uint8Array(await response.arrayBuffer());
    const url = response.headers.get("X-Export-Url");
    const theme = response.headers.get("X-Export-Theme") ?? input.theme ?? "default";
```

</details>

#### 缺口

- 默认公网部署日志、图片寿命与账号隔离未独立核实
  **影响**：不能承诺不留存或全账号严格隔离
  **进一步探讨**：敏感使用前核对目标服务留存/授权，或使用自己管理的实例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证一张合格便签，总成本和建议是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可给已有可信便签服务的用户有限试用建议，先用不含敏感信息的短对话，明确要云端可编辑便签还是PNG，核对标题、完整内容、文件夹和实际服务。普通导出参数有清晰作用，退出可回复制粘贴；不能据此升级持续安装或任意云服务可用性。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools与兼容Cordis/Schema运行时 | 启动必需 | 注册工具和参数 | 源码存在不证明目标宿主加载 |
| 可信baseUrl和Token或用户名密码 | 云端写入必需 | 当前账号workspace | 地址未配去演示图片；只配地址报错 |
| 演示渲染服务、网络与临时目录 | 未配地址图片路径必需 | 生成并保存PNG | 内容会出网，本地失败不撤销远端副本 |
| Agent整理和用户核对 | 合格结果必需 | 确保无遗漏及正确交付类型 | 不是逐字会话备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户明确输出类型与目的服务器 | 敏感内容不默认发演示站 |
| 试导出 | Agent提交非敏感短markdown | 返回server/action与预期一致 |
| 回读 | 用户打开便签/PNG核对内容与格式 | 不只看工具成功文本 |
| 更新 | 复用已知note_id并检查保留字段 | 冲突/超时先核对远端实际状态 |
| 退出 | 停用工具，按需删副本/撤Token | 云笔记与PNG生命周期另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务/网络与配置资源未知 | 选服务、配凭据、试内容 | 公网演示可用性未测 |
| 持续使用 | 模型整理、整workspace传输与渲染未知 | 复核遗漏和格式 | 不能推算节时比例 |
| 失败恢复 | 重读workspace/重复图片资源未知 | 核对未知提交、去重复 | 409有重试，超时不等于回滚 |
| 升级退出 | 副本保存与清理成本未知 | 删图、删笔记、撤凭据 | 停用不撤远端状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一导出 | 工具连接workspace或图片API | 目标服务真实可用性 |
| 更新并发保护 | expectedUpdatedAt与409最多四次 | 服务端原子比较及未知提交 |
| 格式和完整性 | 输入markdown可返回便签位置 | Agent整理遗漏与长图渲染 |
| 总效率 | 减少部分手工API接线 | 同任务总耗时与纠错负担 |

遇到输出类型不符、意外发送公网、超时后疑似重复或原内容被遗漏，应停止自动导出，先回读已有ID/文件再处理，必要时退回手工复制。图片不能满足可编辑便签需求时，不把模式降级当成功。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:53-60](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L53-L60)

工具说明区分输出模式。

```text
const TOOL_DESCRIPTION = [
  "当用户要求把当前对话、聊天记录或一段内容导出为锤子便签时使用。",
  "把对话内容整理成 Markdown 传给 markdown（建议第一行用 # 写标题，便签标题取自正文第一行）。",
  "分级模式：配置了 NOTES_API_BASE_URL（+ NOTES_API_TOKEN 或用户名密码）时，把对话作为便签写入当前账号云端工作区（新建或按 note_id 更新），返回便签链接；",
  "未配置任何用户信息时，回退到默认演示服务器 notes.fangyuanxiaozhan.com 的匿名导出接口，把对话渲染成锤子便签长图 PNG 返回本地文件路径（尝鲜用，不能写入便签列表）。",
  "note_id/folder/starred/pinned 仅在写入模式生效；theme 仅在图片模式生效。",
].join(" ");

```

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:140-196](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L140-L196)

两分支实际输出。

<details>
<summary>查看原文（57行）</summary>

```text
      timeoutMs: 60_000,
      execute: async (args, exec): Promise<ExportToolOutput> => {
        try {
          const configuredBaseUrl = readConfiguredBaseUrl(config);

          if (!configuredBaseUrl) {
            // 分级模式 2：未配置 → 默认演示服务器匿名导出图片。
            const demoServer = resolveDemoServer(config);
            const client = new NotesClient({ baseUrl: demoServer });
            const title = extractNoteTitle(args.markdown);
            const image = await client.exportImage(
              {
                markdown: args.markdown,
                theme: args.theme,
                filename: `${toSafeFilename(title)}.png`,
              },
              exec.signal,
            );
            const filePath = await savePngToTempFile(image.png, title);

            return {
              action: "exported-image",
              note_id: null,
              title,
              url: image.url,
              file_path: filePath,
              updated_at: null,
              server: demoServer,
            };
          }

          // 分级模式 1：已配置 → 写入便签列表。
          const serviceConfig = resolveServiceConfig(config);
          const client = new NotesClient(serviceConfig);
          const result = await client.exportNote(
            {
              markdown: args.markdown,
              noteId: args.note_id,
              folder: args.folder,
              starred: args.starred,
              pinned: args.pinned,
            },
            exec.signal,
          );

          return {
            action: result.action,
            note_id: result.noteId,
            title: result.title,
            url: result.url,
            file_path: null,
            updated_at: result.updatedAt,
            server: result.server,
          };
        } catch (error) {
          if (error instanceof NotesApiError) {
            throw new Error(`导出便签失败：${error.message}`);
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/notes-client.ts:430-458](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L430-L458)

冲突有限重试与未知网络错误。

<details>
<summary>查看原文（29行）</summary>

```text
        const stored = await this.saveWorkspace(
          token,
          loaded.updatedAt,
          workspace,
          signal,
        );

        return {
          action,
          noteId,
          title: extractNoteTitle(markdown),
          url: buildNoteUrl(this.baseUrl, noteId),
          filePath: null,
          updatedAt: stored.updatedAt ?? now,
          server: this.baseUrl,
        };
      } catch (error) {
        if (
          error instanceof NotesApiError &&
          error.status === 409 &&
          attempt < MAX_MUTATION_ATTEMPTS
        ) {
          continue;
        }

        throw error;
      }
    }

```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/notes-client.ts:201-211](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L201-L211)

PNG额外副本。

<details>
<summary>查看原文（11行）</summary>

```text
export async function savePngToTempFile(
  png: Uint8Array,
  title: string,
): Promise<string> {
  const safeTitle = title.replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 60) || "note";
  const directory = await mkdtemp(path.join(tmpdir(), "dsh-notes-"));
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}-${safeTitle}.png`;
  const filePath = path.join(directory, filename);
  await writeFile(filePath, png, { flag: "wx", mode: 0o600 });
  return filePath;
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪个恢复设计假设值得验证？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴的是服务逻辑与宿主工具分离、只修改显式字段、条件workspace提交以及输出server/action，让写入目的地和交付类型可追。它适用于具有整对象版本API的导出适配，迁移要确认服务端同样执行expectedUpdatedAt，不能只复制客户端重试。

由保存后响应丢失缺少核对入口推导一个未验证假设：把用户本次导出绑定稳定操作ID，区分prepared、可能已保存、回读确认三种状态，并在未知结果时查原ID而不是新建，可减少重复笔记及人工查重。图片也应区分远端已生成与本地已保存，不能只给统一失败。

最小验证对正常、409、提交后断线、返回畸形和本地写失败分别比较当前流程与带稳定ID/回读方案；记录重复条目、误覆盖、未知状态、合格内容及人工恢复时间。只有重复和未知减少且服务复杂度可接受才继续；若服务器本来没有可查询幂等接口，应先选简单“返回已知ID并明确结果未知”的退路，而非假装客户端可独自保证exactly-once。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/notes-client.ts:336-352](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L336-L352)

条件提交接口。

<details>
<summary>查看原文（17行）</summary>

```text
  private async saveWorkspace(
    token: string,
    expectedUpdatedAt: number | null,
    workspace: NoteWorkspace,
    signal?: AbortSignal,
  ): Promise<WorkspacePayload> {
    return this.apiJson<WorkspacePayload>(
      token,
      "/api/workspace",
      {
        method: "PUT",
        body: JSON.stringify({ expectedUpdatedAt, workspace }),
      },
      signal,
    );
  }

```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/notes-client.ts:410-458](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/notes-client.ts#L410-L458)

新ID与响应错误边界。

<details>
<summary>查看原文（49行）</summary>

```text
      } else {
        const folderId =
          input.folder === undefined
            ? null
            : resolveFolderId(workspace, input.folder);
        const note = createNoteDocument(workspace, {
          folderId,
          isStarred: input.starred === true,
          markdown,
          now,
          pinned: input.pinned === true,
        });

        workspace.activeNoteId = note.id;
        workspace.notes = [note, ...workspace.notes];
        noteId = note.id;
        action = "created";
      }

      try {
        const stored = await this.saveWorkspace(
          token,
          loaded.updatedAt,
          workspace,
          signal,
        );

        return {
          action,
          noteId,
          title: extractNoteTitle(markdown),
          url: buildNoteUrl(this.baseUrl, noteId),
          filePath: null,
          updatedAt: stored.updatedAt ?? now,
          server: this.baseUrl,
        };
      } catch (error) {
        if (
          error instanceof NotesApiError &&
          error.status === 409 &&
          attempt < MAX_MUTATION_ATTEMPTS
        ) {
          continue;
        }

        throw error;
      }
    }

```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:150-158](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/dsh-plugin/src/index.ts#L150-L158)

远端图片与本地落盘分阶段。

```text
            const image = await client.exportImage(
              {
                markdown: args.markdown,
                theme: args.theme,
                filename: `${toSafeFilename(title)}.png`,
              },
              exec.signal,
            );
            const filePath = await savePngToTempFile(image.png, title);
```

#### 缺口

- 稳定操作ID和回读方案未实现
  **影响**：不能宣称已解决重复导出
  **进一步探讨**：先验证服务端支持，再做故障样本比较。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
