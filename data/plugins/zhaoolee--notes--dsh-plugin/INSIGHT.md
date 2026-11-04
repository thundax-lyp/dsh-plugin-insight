# DSH Notes Export

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[416035c](https://github.com/zhaoolee/notes/tree/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhaoolee/dsh-notes) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zhaoolee/dsh-notes)
<!-- END META -->

> **功能**：把整理后的对话导出为工作区便签，或通过演示服务渲染为图片。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示统一工具连接两种导出，[Q03](#research-q03) 的条件更新保留未修改字段；不证明内容保真或节时。

> **主要限制**：[Q02](#research-q02) 的缺省路径会发送 Markdown 到演示服务且只生成图片；[Q03](#research-q03) 的 409 重试不能解决成功后响应丢失导致的新建重复。

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
  - [Q01 · 用户用它导出什么，和手工复制相比改变了什么？](#detail-section-11)
  - [Q02 · 工具怎样选择目标、认证并发送？](#detail-section-12)
  - [Q03 · 工作区写入和失败重试能保证不重复吗？](#detail-section-13)
  - [Q04 · 隐私、资源和采用条件是什么？](#detail-section-14)
  - [Q05 · 如何设计可证伪的故障恢复改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要将对话整理成可编辑便签或分享图片的 DSH 用户，可以调用统一导出工具。

用户也可以手工复制到便签应用，或自行在可信服务生成图片；本包主要整合模型工具与服务请求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作区新建 | 保存整理后的 Markdown | 需可信服务和认证，提交后丢响应可能重复 |
| 工作区更新 | 按 ID 修改已有便签 | 版本冲突重读，仍需回读验证 |
| 图片导出 | 生成本地 PNG | 无 baseUrl 时会向演示地址发送内容 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools 服务 | Host 工具需要 | 注册并调用导出 | 宿主兼容未实测 |
| 可信便签地址及凭据 | 工作区写入需要 | 读取和保存账户工作区 | 缺凭据时拒绝 |
| 可访问的演示服务器 | 图片分支需要 | 渲染 Markdown | 未配置 baseUrl 时自动选择，可覆盖地址 |
| 临时目录 | 图片分支需要 | 保存 PNG | 写入失败无法返回本地文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对导出类型、目的地和内容 | 敏感内容或目标不明时停止 |
| 整理 | 智能体生成 Markdown | 用户核对范围和标题 |
| 导出 | 工具请求工作区或图片接口 | 检查返回 action、server 与 ID/路径 |
| 验收 | 用户回读内容与分类 | 超时先查已有记录，不盲目新建重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主及服务费用未知 | 配置可信地址和认证 | 未配置地址会走公网演示 |
| 持续 | 模型整理、网络及存储费用未知 | 核对内容和分类 | 没有保真或节时对照 |
| 失败恢复 | 查询、重试和文件管理成本未知 | 确认是否已经创建 | 丢响应后新建可能重复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一出口 | 按地址分发至便签或图片 | 宿主和服务实际可用性 |
| 并发处理 | 409 后重读重试 | 响应丢失时是否重复 |
| 本地图片 | 临时文件和路径 | 远端保存期限及访问范围 |

> **思考**：[Q02](#research-q02) 的缺省路径会发送 Markdown 到演示服务且只生成图片；[Q03](#research-q03) 的 409 重试不能解决成功后响应丢失导致的新建重复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示统一工具连接两种导出，[Q03](#research-q03) 的条件更新保留未修改字段；不证明内容保真或节时。

[Q02](#research-q02) 的客户端与 Host 分层和 [Q03](#research-q03) 的版本比较清晰；新建跨调用缺稳定操作 ID，不能把冲突处理当完整恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的缺省路径会发送 Markdown 到演示服务且只生成图片；[Q03](#research-q03) 的 409 重试不能解决成功后响应丢失导致的新建重复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议已有可信便签服务的用户先用非敏感短文本核实目的地、内容与结果；超时后先回查再决定是否重试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向核查固定源码与分发入口；真实宿主、服务端行为和恢复假设未验证。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/package.json、dsh-plugin/README.md、dsh-plugin/src/index.ts、dsh-plugin/src/notes-client.ts、dsh-plugin/lib/index.js 及固定范围 inventory；组件：dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧场景、机制、范围、分发、依赖、成本、采用、价值、工程、贡献、质疑和假设；检查 Host 入口、客户端请求、冲突重试及 lib 入口路径。未运行插件、网络或测试，未审计整个 notes 后端及线上服务。
- 下一步：在隔离宿主和测试服务验证缺省分支、凭据、409、提交后断线、输出回读与临时文件清理。

**分析版本**

- **仓库**：[zhaoolee/notes](https://github.com/zhaoolee/notes)
- **版本号**：0.1.2（[固定提交 416035c](https://github.com/zhaoolee/notes/tree/416035cdccd0226aa94f045e8474b45bfd533961)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出稳定操作 ID 与结果未知时回读确认的未验证方案；服务不支持查询或收益不抵成本时否定。

在隔离宿主和测试服务验证缺省分支、凭据、409、提交后断线、输出回读与临时文件清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 509 | 463 | 48 | — |
| .md | source | 1 | 134 | — | — | 1331 |
| .ts | source | 3 | 808 | 656 | 69 | — |
| .ts | test | 3 | 758 | 668 | 41 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhaoolee/notes/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/zhaoolee/notes/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhaoolee/notes/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查对话导出的目的地选择、认证、写入和结果未知时的恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户用它导出什么，和手工复制相比改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想把一段对话整理成便签的 DSH 用户，可以让智能体准备 Markdown 后调用同一个工具。配置便签服务时该工具新建或按 ID 更新工作区便签；未配置服务地址时则发送到演示服务渲染 PNG，结果不是可编辑工作区便签。手工复制到便签应用也能完成类似任务；这里的增量是统一模型工具入口和两类输出，不保证模型整理的内容完整、结果更好或节省时间。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/README.md:1-13](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/README.md#L1-L13)

作者介绍工作区和图片两种输出。

<details>
<summary>查看原文（13行）</summary>

```text
# @zhaoolee/dsh-notes

DeepSeek Harness 插件：把用户对话导出为锤子便签。

Host 面工具插件。安装后，智能体获得一个 `notes_export_conversation` 工具，**分级模式**
工作：

1. **已配置便签服务**（`NOTES_API_BASE_URL` + Token 或用户名密码）：把对话内容整理成
   Markdown 后调用，工具通过便签服务 API 在当前账号的云端工作区**新建**一张便签，或按
   `note_id` **更新**已有便签，返回便签 ID、标题和可打开的前端链接。
2. **未配置任何用户信息**：回退到默认演示服务器 `https://notes.fangyuanxiaozhan.com` 的
   匿名导出接口，把对话渲染成锤子便签长图 PNG 保存到本地并返回文件路径——开箱即用尝鲜，
   但**不能写入便签列表**（匿名模式没有账号工作区）。
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:53-70](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/index.ts#L53-L70)

工具描述与 Markdown 输入。

<details>
<summary>查看原文（18行）</summary>

```text
const TOOL_DESCRIPTION = [
  "当用户要求把当前对话、聊天记录或一段内容导出为锤子便签时使用。",
  "把对话内容整理成 Markdown 传给 markdown（建议第一行用 # 写标题，便签标题取自正文第一行）。",
  "分级模式：配置了 NOTES_API_BASE_URL（+ NOTES_API_TOKEN 或用户名密码）时，把对话作为便签写入当前账号云端工作区（新建或按 note_id 更新），返回便签链接；",
  "未配置任何用户信息时，回退到默认演示服务器 notes.fangyuanxiaozhan.com 的匿名导出接口，把对话渲染成锤子便签长图 PNG 返回本地文件路径（尝鲜用，不能写入便签列表）。",
  "note_id/folder/starred/pinned 仅在写入模式生效；theme 仅在图片模式生效。",
].join(" ");

export function apply(ctx: Context, config: Config): void {
  ctx.tools.register(
    defineTool({
      name: "notes_export_conversation",
      description: TOOL_DESCRIPTION,
      parameters: {
        markdown: {
          type: "string",
          required: true,
          description: "对话内容整理后的 Markdown 全文（建议首行 # 标题）。",
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:140-183](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/index.ts#L140-L183)

按服务地址选择导出路径。

<details>
<summary>查看原文（44行）</summary>

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
```

</details>

#### 缺口

- 未在真实任务对照手工复制
  **影响**：无法量化时间或内容保真
  **进一步探讨**：用固定短对话比较原文、导出内容和人工修订时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具怎样选择目标、认证并发送？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host apply 注册 notes_export_conversation；执行时只依据配置或环境中的 baseUrl 是否存在选择路径，即使已有其他凭据但没有 baseUrl 也会选择图片路径。图片路径使用可覆盖的 demoServer，缺省为公网演示地址，将整理后的完整 Markdown POST 到 /api/export，再将收到的 PNG 写入临时目录并返回路径、可能的链接和 server。配置 baseUrl 则使用 token 或用户名密码申请 token，读写该服务的工作区；缺认证会报错，不回退图片。服务端的保存、访问权限和公开链接实际策略未独立核验。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:23-24](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/index.ts#L23-L24)

依赖宿主 tools 服务。

```text
export const name = "notes-export";
export const inject = ["tools"];
```

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:61-70](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/index.ts#L61-L70)

注册工具并接收 Markdown。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  ctx.tools.register(
    defineTool({
      name: "notes_export_conversation",
      description: TOOL_DESCRIPTION,
      parameters: {
        markdown: {
          type: "string",
          required: true,
          description: "对话内容整理后的 Markdown 全文（建议首行 # 标题）。",
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:140-183](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/index.ts#L140-L183)

选择两种路径与调用。

<details>
<summary>查看原文（44行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/notes-client.ts:22-25](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L22-L25)

内置演示服务地址。

```text
const MAX_MUTATION_ATTEMPTS = 4;

/** 未配置便签服务时回退的默认演示服务器。 */
export const DEFAULT_DEMO_SERVER = "https://notes.fangyuanxiaozhan.com";
```

**依据 5 · 源码核查**：[dsh-plugin/src/notes-client.ts:57-74](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L57-L74)

baseUrl 和演示服务的解析。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[dsh-plugin/src/notes-client.ts:264-316](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L264-L316)

获取 token 与缺少凭据时拒绝。

<details>
<summary>查看原文（53行）</summary>

```text
  /** 用用户名/密码向 /api/auth/skill-token 申请稳定 Token（仅内存，不落盘）。 */
  private async requestSkillToken(signal?: AbortSignal): Promise<string> {
    const response = await this.fetchImpl(
      `${this.baseUrl}/api/auth/skill-token`,
      {
        method: "POST",
        signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: this.config.password,
          username: this.config.username,
        }),
      },
    );
    const payload = (await this.readResponsePayload(response)) as
      | { token?: unknown }
      | null;

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? String((payload as { error: unknown }).error)
          : `Skill Token 申请失败（HTTP ${response.status}）`;
      throw new NotesApiError(message, response.status, payload);
    }

    if (
      !payload ||
      typeof payload.token !== "string" ||
      !payload.token.startsWith("notes_sk_v1.")
    ) {
      throw new NotesApiError("服务端未返回有效的 Skill Token。");
    }

    return payload.token;
  }

  /** 解析可用 Token：显式 Token 优先，否则用账号密码申请并缓存。 */
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
```

</details>

**依据 7 · 源码核查**：[dsh-plugin/src/notes-client.ts:470-493](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L470-L493)

图片请求携带 Markdown。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 8 · 源码核查**：[dsh-plugin/src/notes-client.ts:200-210](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L200-L210)

PNG 写入独立临时文件。

<details>
<summary>查看原文（11行）</summary>

```text
/** 把 PNG 字节写入临时目录并返回绝对路径（图片模式输出）。 */
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
```

</details>

#### 缺口

- 没有访问真实服务或核查服务端存储和隐私政策
  **影响**：无法确认服务可用性及实际保留时间
  **进一步探讨**：使用隔离服务验证请求和访问权限，并核对服务政策。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工作区写入和失败重试能保证不重复吗？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

写入先获取工作区和 updatedAt，再根据 noteId 修改现有便签或创建新 UUID，保留更新时未提供的分类、星标及置顶字段，最后 PUT 整个工作区并带 expectedUpdatedAt。服务明确返回 409 时会重新读取后最多尝试四次；响应成功后直接返回 ID 和时间，没有再次 GET 验证内容。若服务已提交但响应在网络丢失，调用方无法从报错知道结果，尤其新建重试会生成另一 UUID，可能重复；409 乐观比较不能提供跨调用幂等。应先核对服务中的记录再决定是否重试，服务端是否真正执行条件写需另行验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/notes-client.ts:153-181](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L153-L181)

新建生成随机 ID。

<details>
<summary>查看原文（29行）</summary>

```text
/** 新建便签的对象形状，与 createWorkspaceNote 一致。 */
function createNoteDocument(
  workspace: NoteWorkspace,
  options: {
    folderId: string | null;
    isStarred: boolean;
    markdown: string;
    now: number;
    pinned: boolean;
  },
): NoteDocument {
  const firstNormalOrder = workspace.notes.reduce(
    (smallest, note) => Math.min(smallest, note.normalOrder),
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

**依据 2 · 源码核查**：[dsh-plugin/src/notes-client.ts:330-355](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L330-L355)

读取及条件写入接口。

<details>
<summary>查看原文（26行）</summary>

```text
    token: string,
    signal?: AbortSignal,
  ): Promise<WorkspacePayload> {
    return this.apiJson<WorkspacePayload>(token, "/api/workspace", {}, signal);
  }

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

  /**
   * 把对话内容导出为便签：新增或按 noteId 更新。读改写遇到 409 时自动重读
   * 并重试，最多 4 次，不盲目覆盖整个工作区。
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/notes-client.ts:367-405](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L367-L405)

读取工作区、更新目标和可选字段。

<details>
<summary>查看原文（39行）</summary>

```text
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
          existing.pinnedAt = input.pinned ? now : null;
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/notes-client.ts:410-455](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L410-L455)

新建、提交、成功返回和仅 409 重试。

<details>
<summary>查看原文（46行）</summary>

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
```

</details>

#### 缺口

- 未在真实服务注入提交后断线或并发冲突
  **影响**：不能确认服务端条件写和重复发生频率
  **进一步探讨**：隔离服务模拟 409、成功后丢响应及回读，核对 ID 和内容。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 隐私、资源和采用条件是什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

对话整理、传输、图片渲染与后续人工检查可能耗费模型、网络和时间，具体金额未知；图片模式另产生临时 PNG，工作区模式可能发送整个工作区。默认地址分支会将 Markdown 发送公网，若对话敏感或目标不明确，不应触发；本地私有文件权限不能代表远端服务不留存。适合已有可信服务的用户先用非敏感短样本，核对实际 server、输出类型、内容和分类；发送超时、返回类型不符或结果未回读时停止自动重试，先检查已有记录，必要时回到手工复制。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:140-168](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/index.ts#L140-L168)

未配置地址的演示图片路径与 server 回显。

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

**依据 2 · 源码核查**：[dsh-plugin/src/notes-client.ts:200-210](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L200-L210)

临时文件以 0600 标志写入。

<details>
<summary>查看原文（11行）</summary>

```text
/** 把 PNG 字节写入临时目录并返回绝对路径（图片模式输出）。 */
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
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/notes-client.ts:336-350](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L336-L350)

工作区写入携带整个 workspace。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 4 · 作者声明**：[dsh-plugin/README.md:107-115](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/README.md#L107-L115)

作者披露默认外发与本地临时文件权限。

```text
## 隐私提示

未配置便签服务时，工具会把对话内容发送到默认演示服务器
`https://notes.fangyuanxiaozhan.com` 的**匿名导出接口**用于渲染图片（该接口不留存内容
到任何账号工作区，且无法写入便签列表）。涉及敏感对话时，请配置自己的便签服务
（`NOTES_API_BASE_URL` + 凭据）后使用，避免内容经过公共服务器。

匿名导出的本地 PNG 会写入系统临时目录下随机创建的私有子目录；在支持 POSIX 权限的
系统中，目录仅允许当前用户访问（`0700`），图片仅允许当前用户读写（`0600`）。
```

#### 缺口

- 真实服务费用、数据处理和导出保真未知
  **影响**：无法确认总成本或安全保留范围
  **进一步探讨**：核对目标服务策略，并在隔离账号用非敏感材料回读。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何设计可证伪的故障恢复改进？

**研究主题**：新假设与验证

#### 完整回答

可探索由客户端预先固定操作 ID，提交后若响应丢失则查询该 ID 的最终结果，再允许用户决定是否重试。现有代码已有工作区版本比较和 409 重读，但没有跨调用稳定新建 ID；假设的增量是识别结果未知与回读确认，不是把冲突重试当成恰好一次。用提交后断线、409 和本地文件写失败的隔离实验比较重复数和恢复时间；若服务无法按 ID 查询或收益不抵额外状态与成本，则否定此方案。目前无实现或试验。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/notes-client.ts:173-181](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L173-L181)

新建时生成 UUID。

```text
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

**依据 2 · 源码核查**：[dsh-plugin/src/notes-client.ts:429-455](https://github.com/zhaoolee/notes/blob/416035cdccd0226aa94f045e8474b45bfd533961/dsh-plugin/src/notes-client.ts#L429-L455)

成功直接返回，只有 409 重试。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

#### 缺口

- 假设没有服务支持或测试
  **影响**：不能宣称能消除重复
  **进一步探讨**：以隔离服务模拟确认丢失并记录重复和恢复代价。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
