# dsh-weknora-archive

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[46079ec](https://github.com/AAAlenwow/dsh-weknora-archive/tree/46079ecb3554239797b1dcbe2e82f74a21adb9a1)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：抽取 DSH 本地会话，规则生成 Markdown 摘要并写入 WeKnora 知识库。

> **核心亮点**：提供 DSH 会话抽取与 WeKnora 写侧编排，规则摘要无需 LLM；检索与嵌入效果仍依赖 WeKnora。详见[Q02](#research-q02)。

> **风险与缺陷**：dry_run 在创建库之后才生效，摘要直接引用用户文本/命令且无凭据脱敏；短 ID 和固定 100 项列表限制去重可靠性。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 会话归档要交付什么，哪些数据应被允许离开本机？](#detail-section-11)
  - [Q02 · 本地会话怎样增量变成知识库文档，增量属于谁？](#detail-section-12)
  - [Q03 · dry_run、脱敏和增量去重有哪些正确性边界？](#detail-section-13)
  - [Q04 · 安装、持续归档和失败恢复的代价是什么？](#detail-section-14)
  - [Q05 · 如何把预览变为真正可审阅交付并验证净价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地会话沉淀为可检索知识，需要项目/会话身份、敏感内容审阅和远端解析验收。

手工选会话、脱敏后导入 WeKnora，或官方只读检索插件；本包加写侧自动化，但缺预审和强身份。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| archive_session | 批量写库 | 可能上传未经脱敏内容 |
| dry_run | 预估上传篇数 | 缺库时仍可能远端创建 |
| status/list | 查询项目和库 | 文档列表单页 100 |
| create_knowledge_base | 建库 | 需后续 embedding 配置 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| Node>=24、DSH tools | 注册与 zstd | 插件不工作 |
| 会话文件可读 | 抽取 | 跳过或失败 |
| WeKnora scoped API key 与兼容路由 | 建库/上传 | 失败或错库 |
| KB embedding | 文档解析检索 | 上传成功仍可能不可检索 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 准备 | 确认会话范围与已有目标库 | 无敏感数据 |
| 预览 | 当前 dry_run 只看数量，避免缺库 | 注意仍可建库 |
| 归档 | 授权后逐篇上传 | 标题与数量正确 |
| 验收 | 查解析与检索、审敏感内容 | 可检索且无 canary 泄漏 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 首次 | 会话根、API key、目标库/embedding | 配置和权限审核 |
| 持续 | 解压 CPU、HTTP 上传、存储与嵌入 | 每篇可检索成本 |
| 恢复 | 模糊目录、冲突、解析与隐私整改 | 返工时间 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 自动归档 | 会话读取与逐篇上传 | 解析后可检索率 |
| 增量 | 标题/短 ID 比较与 409 跳过 | 碰撞与 >100 文档正确率 |
| 隐私 | 配置 key 独立使用 | 会话正文脱敏，实际未实现 |

> **思考**：dry_run 在创建库之后才生效，摘要直接引用用户文本/命令且无凭据脱敏；短 ID 和固定 100 项列表限制去重可靠性。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供 DSH 会话抽取与 WeKnora 写侧编排，规则摘要无需 LLM；检索与嵌入效果仍依赖 WeKnora。详见[Q02](#research-q02)。

提供 DSH 会话抽取与 WeKnora 写侧编排，规则摘要无需 LLM；检索与嵌入效果仍依赖 WeKnora。详见[Q02](#research-q02)。

会话读取用同步 zstd 解压和 JSONL 容错；工具注册为 Cordis effect。上传和建库是远端副作用，dry_run 仅避开逐篇上传。错误由 client 附响应片段，fail 仅截 X-API-Key 字符串，无法形式化证明不含其它敏感响应。

<a id="detail-section-5"></a>

### 1.4 主要限制

dry_run 在创建库之后才生效，摘要直接引用用户文本/命令且无凭据脱敏；短 ID 和固定 100 项列表限制去重可靠性。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅无敏感样本指定已存在知识库先试用，人工审摘要并核远端解析；含密钥历史会话暂不自动上传。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持写入编排；dry_run 可能建库、摘要无凭据脱敏、去重覆盖有限；未运行远端。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/archive.js、lib/session-reader.js、lib/summarizer.js、lib/client.js、lib/config.js、test/mock.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、包、配置、会话读取、摘要、编排、HTTP 客户端与测试源码；未运行插件、测试或上传。
- 下一步：隔离实例用假密钥、同前 8 位 ID、101 文档、活会话与解析失败，测远端副作用、泄漏、误去重和可检索率。

**分析版本**

- **仓库**：[AAAlenwow/dsh-weknora-archive](https://github.com/AAAlenwow/dsh-weknora-archive)
- **版本号**：0.2.0（[固定提交 46079ec](https://github.com/AAAlenwow/dsh-weknora-archive/tree/46079ecb3554239797b1dcbe2e82f74a21adb9a1)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可先本地脱敏并审阅带强会话身份的摘要，再幂等上传、验解析；用 canary、碰撞与 >100 文档对照，尚未实现。详见[Q05](#research-q05)。

隔离实例用假密钥、同前 8 位 ID、101 文档、活会话与解析失败，测远端副作用、泄漏、误去重和可检索率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 932 | 693 | 181 | — |
| .md | source | 1 | 124 | — | — | 1170 |
| .mjs | test | 1 | 158 | 140 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+created%3A2026-09-22T05%3A32%3A22.965Z..2026-10-22T05%3A32%3A22.965Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-weknora-archive/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A32%3A22.965Z..2026-10-22T05%3A32%3A22.965Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断 DSH 会话归档的增量正确性、隐私边界与可审阅采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话归档要交付什么，哪些数据应被允许离开本机？

**研究主题：**场景与需求

#### 完整回答

本插件把 DSH 本地会话抽成 Markdown 摘要，写到配置的 WeKnora 知识库，补足作者所述只读检索插件的写侧。合格结果应绑定正确项目/会话、只上传经用户认可且已脱敏的内容、可检查解析状态，并对重试不重复或误跳过。README 称不上传第三方且凭据值不完整收录，但本轮只核固定源码，未验部署端可信性和真实数据分类。手工筛选、脱敏后上传或现有知识库导入是基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/README.md#L5-L16)

作者功能描述。

<details>
<summary>查看原文（12行）</summary>

```text
把 DSH（DeepSeek Harness）会话**增量归档**进 [WeKnora](https://github.com/Tencent/WeKnora) 知识库的 host 端插件。是官方只读插件 `@wxg-prc-cpg/dsh-weknora`（4 个检索工具）的**写入侧互补**。

## 功能

| 工具 | 说明 |
|---|---|
| `weknora_archive_session` | 归档某个项目的 DSH 会话：定位会话目录 → 解压 `session.v3.jsonl.zstd` → 提取对话 → 启发式总结（模板：主题/决策/产出/细节/遗留）→ 按文档标题去重后上传；知识库不存在时按项目名自动新建；首次归档附 `00_项目总览.md`；支持 `dry_run` 预览 |
| `weknora_archive_status` | 只读：列出本机会话项目目录与会话数，查看目标知识库内已归档文档与解析状态 |
| `weknora_archive_list_knowledge_bases` | 只读：列出该凭据可见的知识库 |
| `weknora_archive_create_knowledge_base` | 新建知识库（注意：新建库可能需在 WeKnora 端配置 embedding 模型，否则文档解析失败） |

工具名前缀可通过 `toolPrefix` 配置（默认 `weknora_archive`）。工具描述中英双语。
```

</details>

**依据 2 · 作者声明**：[README.md:39-47](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/README.md#L39-L47)

作者隐私和 API 声称。

```text
## 隐私说明

- 会话数据**只发往你自己配置的 WeKnora 实例**，插件不经过任何第三方服务。
- API key 只用于请求头 `X-API-Key`，**绝不写入日志、异常信息、工具结果或本文档**；日志输出前统一走 `redactConfig()` 脱敏。
- 总结为**启发式规则生成（无 LLM 参与）**，凭据类内容不收录完整值。

## API 兼容性

认证头为 `X-API-Key`（非 Bearer），路由中横线风格：`GET/POST /knowledge-bases`、`GET /knowledge-bases/{id}/knowledge`、`POST /knowledge`（multipart 上传 Markdown）、`POST /knowledge/{id}/reparse`。**以你的 WeKnora 实际 API 为准**；若有出入只需调整 `lib/client.js`。
```

**依据 3 · 源码核查**：[lib/index.js:43-101](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/index.js#L43-L101)

实际归档工具及 dry_run。

<details>
<summary>查看原文（59行）</summary>

```text
  // 1. Archive a project's sessions (extract → summarize → upload, incremental).
  definitions.push({
    name: `${resolved.toolPrefix}_session`,
    description: '把当前机器上某个 DSH 项目的会话增量归档进 WeKnora 知识库：解压会话存储 → 启发式总结 → 按标题去重后上传（知识库不存在时自动按项目名新建）。Archive a DSH project\'s sessions into a WeKnora knowledge base incrementally: decompress session storage, summarize, dedupe by document title, upload (auto-creates the knowledge base when absent). Use when the user says 归档/archive sessions/更新知识库.',
    parameters: {
      type: 'object',
      properties: {
        project_keyword: { type: 'string', description: '项目目录名关键词，如 "my-app"；模糊匹配 sessions 目录。Project directory keyword to match.' },
        knowledge_base_id: { type: 'string', description: '可选：目标知识库 id；缺省按配置或按项目名自动匹配/新建。' },
        dry_run: { type: 'boolean', description: '可选：只统计将要归档的会话，不上传。Preview without uploading.' },
      },
      required: ['project_keyword'],
      additionalProperties: false,
    },
    timeoutMs: resolved.uploadTimeoutMs,
    isConcurrencySafe: () => false,
    output: {
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean' },
          knowledge_base_id: { type: 'string' },
          created: { type: 'boolean' },
          uploaded_count: { type: 'integer' },
          skipped_count: { type: 'integer' },
          detail: { type: 'string' },
        },
        required: ['ok'],
        additionalProperties: false,
      },
      render: (_args, value) => [{ type: 'text', text: value.detail ?? JSON.stringify(value) }],
    },
    async execute(args) {
      try {
        const result = await archiveProject({ client, config: resolved }, {
          projectKeyword: args.project_keyword,
          knowledgeBaseId: args.knowledge_base_id,
          dryRun: args.dry_run === true,
        });
        if (!result.ok) return { ok: false, detail: result.error };
        return {
          ok: true,
          knowledge_base_id: result.knowledgeBaseId,
          created: result.created,
          uploaded_count: result.uploaded.length,
          skipped_count: result.skippedCount,
          detail: [
            `项目 ${result.project} (${result.projectDir})`,
            `知识库 ${result.knowledgeBaseId}${result.created ? '（新建）' : ''}`,
            `${result.dryRun ? '预览：将上传' : '已上传'} ${result.uploaded.length} 篇，跳过已归档 ${result.skippedCount} 篇（共 ${result.totalSessions} 个会话）`,
            result.overview ? `总览文档：${result.overview}` : null,
            ...result.uploaded.map((entry) => `- ${entry.title} (${entry.chars} chars)`),
          ].filter(Boolean).join('\n'),
        };
      } catch (error) {
        return fail(error);
      }
    },
  });
```

</details>

**依据 4 · 源码核查**：[lib/session-reader.js:74-115](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/session-reader.js#L74-L115)

抽取用户和助手文本。

<details>
<summary>查看原文（42行）</summary>

```text
/**
 * Read one session file and extract ordered plain conversation text.
 * @returns {{ sessionId: string, messages: Array<{role: 'user'|'assistant', text: string}>, bytes: number }}
 */
export function readSessionText(sessionFilePath) {
  const compressed = readFileSync(sessionFilePath);
  const jsonl = decompressConcatenatedFrames(compressed);
  const sessionId = sessionFilePath.split('/').at(-2) ?? '';
  const messages = [];
  for (const line of jsonl.split('\n')) {
    if (line.trim() === '') continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue; // tolerate trailing partial lines on live sessions
    }
    if (event?.type === 'user/message') {
      const text = (event?.data?.content ?? [])
        .filter((block) => block?.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n');
      if (text.trim() !== '') messages.push({ role: 'user', text });
    } else if (ASSISTANT_EVENTS.has(event?.type)) {
      // v4 keeps the final reply in data.message.content (same shape as
      // user/message) and uses data.stream only for incremental deltas;
      // v3 carried the text directly in the stream entries.
      const blocks = event?.data?.message?.content
        ?? (event?.data?.stream ?? []).map((entry) => entry?.chunk ?? entry);
      const text = (blocks ?? [])
        .filter((block) => block?.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('');
      if (text.trim() !== '') {
        const last = messages.at(-1);
        if (last?.role === 'assistant') last.text += `\n${text}`;
        else messages.push({ role: 'assistant', text });
      }
    }
  }
  return { sessionId, messages, bytes: compressed.length };
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地会话怎样增量变成知识库文档，增量属于谁？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

session-reader 列项目和 v4/v3 压缩会话，解多 zstd frame 并抽用户/助手文字；summarizer 用规则选主题、命令、路径和少量“决策”行，非 LLM 摘要。archiveProject 模糊匹配项目目录，按明确/配置/项目名定位知识库，使用前 8 位会话 ID 拼文档标题，查已有标题后逐篇上传并在首次空库加总览。相对手工导入的增量是 DSH 读取、规则摘要、知识库自动选择/创建和标题去重的编排；WeKnora 检索、嵌入和解析效果归外部服务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/session-reader.js:17-53](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/session-reader.js#L17-L53)

多帧解压与 v4/v3 文件优先。

<details>
<summary>查看原文（37行）</summary>

```text
/** zstd frame magic number (little-endian 0xFD2FB528). */
const ZSTD_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);

/**
 * Decompress a file made of MANY concatenated zstd frames.
 *
 * dsh >= 0.2 writes one frame per flush instead of a single stream, so
 * `zstdDecompressSync` only returns the first frame (session metadata) and
 * silently drops every conversation event after it. Walk the buffer and
 * decompress at each magic offset instead.
 *
 * @param {Buffer} buf raw file bytes
 * @returns {string} concatenated decompressed text
 */
function decompressConcatenatedFrames(buf) {
  const parts = [];
  let pos = 0;
  // Frames are dense; a failed offset just means a magic byte inside payload
  // data, so keep scanning rather than giving up on the first error.
  while (pos < buf.length) {
    const idx = buf.indexOf(ZSTD_MAGIC, pos);
    if (idx === -1) break;
    try {
      parts.push(zstdDecompressSync(buf.subarray(idx)));
    } catch {
      // Not a real frame boundary — skip this byte and rescan.
    }
    pos = idx + 1;
  }
  return Buffer.concat(parts).toString('utf8');
}

/** Session file names, newest format first. */
const SESSION_FILES = ['session.v4.jsonl.zstd', 'session.v3.jsonl.zstd'];

/** Assistant event names carrying the reply stream. */
const ASSISTANT_EVENTS = new Set(['assistant/message', 'assistant/attempt']);
```

</details>

**依据 2 · 源码核查**：[lib/session-reader.js:74-139](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/session-reader.js#L74-L139)

会话文本提取与排序。

<details>
<summary>查看原文（66行）</summary>

```text
/**
 * Read one session file and extract ordered plain conversation text.
 * @returns {{ sessionId: string, messages: Array<{role: 'user'|'assistant', text: string}>, bytes: number }}
 */
export function readSessionText(sessionFilePath) {
  const compressed = readFileSync(sessionFilePath);
  const jsonl = decompressConcatenatedFrames(compressed);
  const sessionId = sessionFilePath.split('/').at(-2) ?? '';
  const messages = [];
  for (const line of jsonl.split('\n')) {
    if (line.trim() === '') continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue; // tolerate trailing partial lines on live sessions
    }
    if (event?.type === 'user/message') {
      const text = (event?.data?.content ?? [])
        .filter((block) => block?.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n');
      if (text.trim() !== '') messages.push({ role: 'user', text });
    } else if (ASSISTANT_EVENTS.has(event?.type)) {
      // v4 keeps the final reply in data.message.content (same shape as
      // user/message) and uses data.stream only for incremental deltas;
      // v3 carried the text directly in the stream entries.
      const blocks = event?.data?.message?.content
        ?? (event?.data?.stream ?? []).map((entry) => entry?.chunk ?? entry);
      const text = (blocks ?? [])
        .filter((block) => block?.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('');
      if (text.trim() !== '') {
        const last = messages.at(-1);
        if (last?.role === 'assistant') last.text += `\n${text}`;
        else messages.push({ role: 'assistant', text });
      }
    }
  }
  return { sessionId, messages, bytes: compressed.length };
}

/**
 * List sessions of one project with mtime and size metadata.
 * @returns Array<{ sessionId: string, dir: string, filePath: string, mtimeMs: number, size: number }>
 */
export function listSessions(sessionsRoot, projectDir) {
  const base = join(sessionsRoot, projectDir);
  const out = [];
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filePath = SESSION_FILES
      .map((name) => join(base, entry.name, name))
      .find((candidate) => existsSync(candidate));
    if (!filePath) continue;
    let stats;
    try {
      stats = statSync(filePath);
    } catch {
      continue;
    }
    out.push({ sessionId: entry.name, dir: entry.name, filePath, mtimeMs: stats.mtimeMs, size: stats.size });
  }
  return out.sort((a, b) => a.mtimeMs - b.mtimeMs);
}
```

</details>

**依据 3 · 源码核查**：[lib/summarizer.js:99-165](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/summarizer.js#L99-L165)

规则摘要模板。

<details>
<summary>查看原文（67行）</summary>

```text
export function summarizeSession(session, { projectName = 'project', maxChars = 8000 } = {}) {
  const lines = [];
  const userTurns = session.messages.filter((m) => m.role === 'user');
  const assistantTurns = session.messages.filter((m) => m.role === 'assistant');
  const contentful = session.messages.filter((m) => !isNoise(m.text));

  // Only user lines that survive scaffolding removal can describe the topic.
  const userIntent = userTurns.flatMap((turn) => meaningfulLines(turn.text));

  const decisions = [];
  const details = new Set();
  const commands = new Set();
  const paths = new Set();
  for (const message of contentful) {
    for (const match of message.text.matchAll(COMMAND_PATTERN)) commands.add(clip(match[1], 120));
    for (const match of message.text.matchAll(PATH_PATTERN)) {
      if (!match[0].includes('node_modules')) details.add(clip(match[0], 160));
    }
  }
  // Decisions come from user lines too, but keep only those that read like a
  // statement of intent rather than a fragment of a longer system block.
  for (const line of userIntent) {
    if (decisions.length >= 8) break;
    if (line.length < 12) continue;
    if (/[.。!！?？]$/.test(line) || line.includes('：') || line.includes(': ')) {
      decisions.push(clip(line, 200));
    }
  }
  const toolNames = new Set();
  for (const turn of assistantTurns) {
    for (const match of turn.text.matchAll(/\b(?:weknora_[a-z_]+|todo_write|subagent|workflow|bash|read|write|edit|grep|glob)\b/g)) {
      toolNames.add(match[1]);
    }
  }

  // Topic: the first real user lines, longest-first within the opening turns.
  const topics = userIntent.slice(0, 3).map((line) => clip(line, 120));
  const chars = session.messages.reduce((sum, m) => sum + m.text.length, 0);
  const idTail = String(session.sessionId ?? '').replace(/^session-/, '');
  const shortId = idTail.length > 8 ? idTail.slice(0, 8) : idTail;
  const title = `会话总结: ${projectName}_${shortId}`;

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`- **主题**: ${topics.length > 0 ? topics.join(' / ') : '(无用户输入)'}`);
  lines.push(`- **体量**: ${session.messages.length} 条消息 / 约 ${chars} 字符${assistantTurns.length === 0 ? '；[派工型会话：仅任务书无回复]' : ''}`);
  if (decisions.length > 0) {
    lines.push('- **关键决策与结论**:');
    for (const decision of decisions.slice(0, 8)) lines.push(`  1. ${decision}`);
  }
  if (commands.size > 0) {
    lines.push('- **产出与命令**:');
    for (const command of [...commands].slice(0, 6)) lines.push(`  - \`${command}\``);
  }
  if (paths.size > 0) {
    lines.push('- **重要细节（路径/端口/配置）**:');
    for (const path of [...paths].slice(0, 8)) lines.push(`  - ${path}`);
  }
  if (toolNames.size > 0) lines.push(`- **使用的工具**: ${[...toolNames].slice(0, 12).join(', ')}`);
  lines.push('- **未完成/遗留**: 以会话末尾为准，未发现显式遗留事项' );
  lines.push('');
  lines.push('> 由 dsh-weknora-archive 启发式总结生成（无 LLM 参与）；凭据类内容一律未收录完整值。');

  let markdown = lines.join('\n');
  if (markdown.length > maxChars) markdown = `${markdown.slice(0, maxChars)}\n…(截断)`;
  return { title, markdown };
}
```

</details>

**依据 4 · 源码核查**：[lib/archive.js:40-83](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L40-L83)

项目和知识库选择、去重。

<details>
<summary>查看原文（44行）</summary>

```text
export async function archiveProject(deps, options) {
  const { client, config, log } = deps;
  const { matchProjectDirs } = await import('./session-reader.js');
  const dirs = matchProjectDirs(config.sessionsDir, options.projectKeyword);
  if (dirs.length === 0) {
    return { ok: false, error: `no session project dir matches keyword "${options.projectKeyword}" under ${config.sessionsDir}` };
  }
  if (dirs.length > 1) {
    return { ok: false, error: `keyword "${options.projectKeyword}" is ambiguous, matches: ${dirs.join(', ')}` };
  }
  const projectDir = dirs[0];
  // dsh encodes a project path by collapsing `/`, `\` and `:` into a single `-`
  // (see session-persistence-jsonl/format.ts), wrapping the slug in `--…--`.
  // `--data--` is the project `data`; `--Users-me-demo--` is `Users/me/demo`.
  const projectName = projectDir.replace(/^-+|-+$/g, '').split('-').filter(Boolean).at(-1) ?? projectDir;
  const sessions = listSessions(config.sessionsDir, projectDir);

  // Resolve target knowledge base (explicit id → config default → match by name → create).
  let knowledgeBaseId = options.knowledgeBaseId || config.knowledgeBaseId;
  let created = false;
  if (!knowledgeBaseId) {
    const bases = await client.listKnowledgeBases();
    const matched = bases.find((kb) => kb?.name === projectName);
    if (matched) {
      knowledgeBaseId = matched.id;
    } else {
      const result = await client.createKnowledgeBase(projectName, `DSH session archive for ${projectDir} (by dsh-weknora-archive)`);
      knowledgeBaseId = result?.id ?? result?.data?.id ?? '';
      created = true;
    }
  }
  if (!knowledgeBaseId) return { ok: false, error: 'could not resolve or create a target knowledge base' };

  const existing = await client.listKnowledge(knowledgeBaseId);
  const existingTitles = new Set(existing.map((doc) => doc?.title ?? doc?.knowledge_title ?? ''));
  // WeKnora titles a document after the uploaded FILE, so the library shows
  // `data_xxx.md` while the intended title is `会话总结: data_xxx`. Compare on
  // the session key so both spellings deduplicate.
  const isArchived = (title) => {
    if (existingTitles.has(title)) return true;
    const key = title.replace(/^会话总结: /, '').replace(/\.md$/i, '');
    return [...existingTitles].some((existingTitle) =>
      existingTitle.replace(/\.md$/i, '').endsWith(key));
  };
```

</details>

**依据 5 · 源码核查**：[lib/archive.js:85-150](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L85-L150)

上传与首次总览。

<details>
<summary>查看原文（66行）</summary>

```text
  const uploaded = [];
  const skipped = [];
  const isFirstRun = existingTitles.size === 0;
  for (const session of sessions) {
    const title = sessionDocTitle(projectName, session.sessionId);
    if (isArchived(title)) {
      skipped.push(session.sessionId);
      continue;
    }
    const text = readSessionText(session.filePath);
    if (text.messages.length === 0) {
      skipped.push(session.sessionId);
      continue;
    }
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
    }
    const filename = `${sessionDocTitle(projectName, session.sessionId).replace(/^会话总结: /, '')}.md`;
    try {
      await client.uploadKnowledge({ knowledgeBaseId, title, content: summary.markdown, filename });
      uploaded.push({ sessionId: session.sessionId, title, filename, chars: summary.markdown.length });
    } catch (err) {
      // WeKnora answers 409 duplicate_file when a same-named document already
      // exists. The pre-upload title check misses it whenever a previous run
      // uploaded before its document became listable, so treat it as a skip
      // rather than aborting the whole pass.
      if (err?.status === 409) {
        skipped.push(session.sessionId);
        continue;
      }
      throw err;
    }
  }

  // First run also contributes a project overview.
  let overview = null;
  if (isFirstRun && !options.dryRun && uploaded.length > 0) {
    overview = summarizeProjectOverview({ projectName, projectDir, sessions, summaries: uploaded });
    try {
      await client.uploadKnowledge({
        knowledgeBaseId,
        title: overview.title,
        content: overview.markdown,
        filename: '00_项目总览.md',
      });
    } catch (err) {
      if (err?.status !== 409) throw err;   // an existing overview is fine
      overview = null;
    }
  }

  log?.info(`dsh-weknora-archive: ${projectName} → kb ${knowledgeBaseId}: ${uploaded.length} uploaded, ${skipped.length} skipped`);
  return {
    ok: true,
    knowledgeBaseId,
    created,
    project: projectName,
    projectDir,
    totalSessions: sessions.length,
    uploaded,
    skippedCount: skipped.length,
    overview: overview ? overview.title : null,
    dryRun: Boolean(options.dryRun),
  };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dry_run、脱敏和增量去重有哪些正确性边界？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

dry_run 只在 archiveProject 的逐会话上传前判断，缺省知识库选择/创建已经发生，所以预览可能创建远端库；它也不返回将上传摘要正文供审阅。summarizer 把用户首轮、命令和路径直接裁切到文档，没有凭据值识别/替换代码，README“凭据类内容不收录完整值”与实现不符；如果文本中有 token、口令或 URL 参数，可能作为主题/命令被上传。标题只取会话 ID 前 8 位，已有文档列表只请求 page_size=100 且未翻页，项目名取编码目录最后一段；这些都使去重身份和完整性有限。409 只当跳过，但不能证明上传后的索引/解析成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/archive.js:57-102](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L57-L102)

远端创建早于 dry_run 判断。

<details>
<summary>查看原文（46行）</summary>

```text
  // Resolve target knowledge base (explicit id → config default → match by name → create).
  let knowledgeBaseId = options.knowledgeBaseId || config.knowledgeBaseId;
  let created = false;
  if (!knowledgeBaseId) {
    const bases = await client.listKnowledgeBases();
    const matched = bases.find((kb) => kb?.name === projectName);
    if (matched) {
      knowledgeBaseId = matched.id;
    } else {
      const result = await client.createKnowledgeBase(projectName, `DSH session archive for ${projectDir} (by dsh-weknora-archive)`);
      knowledgeBaseId = result?.id ?? result?.data?.id ?? '';
      created = true;
    }
  }
  if (!knowledgeBaseId) return { ok: false, error: 'could not resolve or create a target knowledge base' };

  const existing = await client.listKnowledge(knowledgeBaseId);
  const existingTitles = new Set(existing.map((doc) => doc?.title ?? doc?.knowledge_title ?? ''));
  // WeKnora titles a document after the uploaded FILE, so the library shows
  // `data_xxx.md` while the intended title is `会话总结: data_xxx`. Compare on
  // the session key so both spellings deduplicate.
  const isArchived = (title) => {
    if (existingTitles.has(title)) return true;
    const key = title.replace(/^会话总结: /, '').replace(/\.md$/i, '');
    return [...existingTitles].some((existingTitle) =>
      existingTitle.replace(/\.md$/i, '').endsWith(key));
  };

  const uploaded = [];
  const skipped = [];
  const isFirstRun = existingTitles.size === 0;
  for (const session of sessions) {
    const title = sessionDocTitle(projectName, session.sessionId);
    if (isArchived(title)) {
      skipped.push(session.sessionId);
      continue;
    }
    const text = readSessionText(session.filePath);
    if (text.messages.length === 0) {
      skipped.push(session.sessionId);
      continue;
    }
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
```

</details>

**依据 2 · 源码核查**：[lib/summarizer.js:105-164](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/summarizer.js#L105-L164)

用户行、命令、路径直接进文档，未见脱敏。

<details>
<summary>查看原文（60行）</summary>

```text
  // Only user lines that survive scaffolding removal can describe the topic.
  const userIntent = userTurns.flatMap((turn) => meaningfulLines(turn.text));

  const decisions = [];
  const details = new Set();
  const commands = new Set();
  const paths = new Set();
  for (const message of contentful) {
    for (const match of message.text.matchAll(COMMAND_PATTERN)) commands.add(clip(match[1], 120));
    for (const match of message.text.matchAll(PATH_PATTERN)) {
      if (!match[0].includes('node_modules')) details.add(clip(match[0], 160));
    }
  }
  // Decisions come from user lines too, but keep only those that read like a
  // statement of intent rather than a fragment of a longer system block.
  for (const line of userIntent) {
    if (decisions.length >= 8) break;
    if (line.length < 12) continue;
    if (/[.。!！?？]$/.test(line) || line.includes('：') || line.includes(': ')) {
      decisions.push(clip(line, 200));
    }
  }
  const toolNames = new Set();
  for (const turn of assistantTurns) {
    for (const match of turn.text.matchAll(/\b(?:weknora_[a-z_]+|todo_write|subagent|workflow|bash|read|write|edit|grep|glob)\b/g)) {
      toolNames.add(match[1]);
    }
  }

  // Topic: the first real user lines, longest-first within the opening turns.
  const topics = userIntent.slice(0, 3).map((line) => clip(line, 120));
  const chars = session.messages.reduce((sum, m) => sum + m.text.length, 0);
  const idTail = String(session.sessionId ?? '').replace(/^session-/, '');
  const shortId = idTail.length > 8 ? idTail.slice(0, 8) : idTail;
  const title = `会话总结: ${projectName}_${shortId}`;

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`- **主题**: ${topics.length > 0 ? topics.join(' / ') : '(无用户输入)'}`);
  lines.push(`- **体量**: ${session.messages.length} 条消息 / 约 ${chars} 字符${assistantTurns.length === 0 ? '；[派工型会话：仅任务书无回复]' : ''}`);
  if (decisions.length > 0) {
    lines.push('- **关键决策与结论**:');
    for (const decision of decisions.slice(0, 8)) lines.push(`  1. ${decision}`);
  }
  if (commands.size > 0) {
    lines.push('- **产出与命令**:');
    for (const command of [...commands].slice(0, 6)) lines.push(`  - \`${command}\``);
  }
  if (paths.size > 0) {
    lines.push('- **重要细节（路径/端口/配置）**:');
    for (const path of [...paths].slice(0, 8)) lines.push(`  - ${path}`);
  }
  if (toolNames.size > 0) lines.push(`- **使用的工具**: ${[...toolNames].slice(0, 12).join(', ')}`);
  lines.push('- **未完成/遗留**: 以会话末尾为准，未发现显式遗留事项' );
  lines.push('');
  lines.push('> 由 dsh-weknora-archive 启发式总结生成（无 LLM 参与）；凭据类内容一律未收录完整值。');

  let markdown = lines.join('\n');
  if (markdown.length > maxChars) markdown = `${markdown.slice(0, maxChars)}\n…(截断)`;
  return { title, markdown };
```

</details>

**依据 3 · 作者声明**：[README.md:39-44](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/README.md#L39-L44)

作者凭据脱敏声称。

```text
## 隐私说明

- 会话数据**只发往你自己配置的 WeKnora 实例**，插件不经过任何第三方服务。
- API key 只用于请求头 `X-API-Key`，**绝不写入日志、异常信息、工具结果或本文档**；日志输出前统一走 `redactConfig()` 脱敏。
- 总结为**启发式规则生成（无 LLM 参与）**，凭据类内容不收录完整值。

```

**依据 4 · 源码核查**：[lib/archive.js:11-33](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L11-L33)

8 字符会话键。

<details>
<summary>查看原文（23行）</summary>

```text
/** Doc title convention must match the session-archive skill: `会话总结: <project>_<sessionId8>`. */
export function sessionDocTitle(projectName, sessionId) {
  // Session ids look like `session-<uuid>` or a bare `<uuid>`; both carry a
  // long `session-` prefix that a plain slice(0, 8) would swallow whole.
  const tail = String(sessionId).replace(/^session-/, '');
  const short = tail.length > 8 ? tail.slice(0, 8) : tail;
  return `会话总结: ${projectName}_${short}`;
}

/**
 * Compute which sessions are new relative to existing document titles.
 * @returns string[] of sessionIds not yet archived.
 */
export function findNewSessions(sessions, existingTitles) {
  const known = new Set([...existingTitles].map((title) => String(title).split('_').at(-1)));
  return sessions
    .map((session) => session.sessionId)
    .filter((id) => {
      const tail = String(id).replace(/^session-/, '');
      const short = tail.length > 8 ? tail.slice(0, 8) : tail;
      return !known.has(short);
    });
}
```

</details>

**依据 5 · 源码核查**：[lib/archive.js:73-115](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L73-L115)

标题去重与 409。

<details>
<summary>查看原文（43行）</summary>

```text
  const existing = await client.listKnowledge(knowledgeBaseId);
  const existingTitles = new Set(existing.map((doc) => doc?.title ?? doc?.knowledge_title ?? ''));
  // WeKnora titles a document after the uploaded FILE, so the library shows
  // `data_xxx.md` while the intended title is `会话总结: data_xxx`. Compare on
  // the session key so both spellings deduplicate.
  const isArchived = (title) => {
    if (existingTitles.has(title)) return true;
    const key = title.replace(/^会话总结: /, '').replace(/\.md$/i, '');
    return [...existingTitles].some((existingTitle) =>
      existingTitle.replace(/\.md$/i, '').endsWith(key));
  };

  const uploaded = [];
  const skipped = [];
  const isFirstRun = existingTitles.size === 0;
  for (const session of sessions) {
    const title = sessionDocTitle(projectName, session.sessionId);
    if (isArchived(title)) {
      skipped.push(session.sessionId);
      continue;
    }
    const text = readSessionText(session.filePath);
    if (text.messages.length === 0) {
      skipped.push(session.sessionId);
      continue;
    }
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
    }
    const filename = `${sessionDocTitle(projectName, session.sessionId).replace(/^会话总结: /, '')}.md`;
    try {
      await client.uploadKnowledge({ knowledgeBaseId, title, content: summary.markdown, filename });
      uploaded.push({ sessionId: session.sessionId, title, filename, chars: summary.markdown.length });
    } catch (err) {
      // WeKnora answers 409 duplicate_file when a same-named document already
      // exists. The pre-upload title check misses it whenever a previous run
      // uploaded before its document became listable, so treat it as a skip
      // rather than aborting the whole pass.
      if (err?.status === 409) {
        skipped.push(session.sessionId);
        continue;
```

</details>

**依据 6 · 源码核查**：[lib/client.js:75-78](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/client.js#L75-L78)

文档列表固定 page_size=100。

```text
  /** GET /knowledge-bases/{id}/knowledge?page_size=100 — list documents. */
  listKnowledge(knowledgeBaseId) {
    return this.request('GET', `/knowledge-bases/${encodeURIComponent(knowledgeBaseId)}/knowledge?page_size=100`)
      .then((body) => Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []));
```

#### 缺口

- 未用假密钥、同前缀 ID 和超 100 文档测试。
  **影响：**实际泄漏及误去重频率未知。
  **进一步探讨：**隔离 mock 注入 canary、前缀碰撞和 101 篇文档，核输出及上传。
- 未验 WeKnora 解析完成。
  **影响：**上传成功不代表可检索。
  **进一步探讨：**上传后轮询解析并检索 canary 文档。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续归档和失败恢复的代价是什么？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.2.0 MIT、Node>=24，声明 DSH 0.1.7-alpha.1/web；需要本地会话文件和可写的 WeKnora scoped key、接口匹配及 embedding 配置。每次归档同步读取/解压会话并对每篇做 HTTP 上传，启发式摘要免 LLM token，但仍有 CPU/网络/WeKnora 存储/嵌入成本。摘要上限默认 8000 字符、请求与上传超时分别 30/120 秒；正在写的会话可能部分读取或被跳过。失败恢复须区分目录模糊、配置、上传冲突、远端解析和重复，真实单位成功文档成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-46](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/package.json#L1-L46)

版本、运行时与兼容声明。

<details>
<summary>查看原文（46行）</summary>

```text
{
  "name": "dsh-weknora-archive",
  "version": "0.2.0",
  "description": "Incrementally archive DSH sessions into a WeKnora knowledge base (Tencent WeKnora RAG): extract, summarize, dedupe, upload. 把 DSH 会话增量归档进 WeKnora 知识库（写入侧互补官方只读 dsh-weknora 插件）。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "weknora",
    "knowledge-base",
    "session-archive",
    "rag"
  ],
  "license": "MIT",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "lib",
    "test",
    "README.md"
  ],
  "engines": {
    "node": ">=24.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": "0.1.7-alpha.1",
      "profiles": [
        "web"
      ]
    }
  },
  "scripts": {
    "test": "node test/mock.test.mjs"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AAAlenwow/dsh-weknora-archive.git"
```

</details>

**依据 2 · 源码核查**：[lib/config.js:8-16](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/config.js#L8-L16)

超时与长度默认。

```text
const DEFAULTS = {
  baseUrl: '',
  apiKey: '',
  knowledgeBaseId: '',
  sessionsDir: '',
  maxSummaryChars: 8000,
  requestTimeoutMs: 30_000,
  uploadTimeoutMs: 120_000,
  toolPrefix: 'weknora_archive',
```

**依据 3 · 源码核查**：[lib/archive.js:40-55](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L40-L55)

项目目录模糊匹配。

<details>
<summary>查看原文（16行）</summary>

```text
export async function archiveProject(deps, options) {
  const { client, config, log } = deps;
  const { matchProjectDirs } = await import('./session-reader.js');
  const dirs = matchProjectDirs(config.sessionsDir, options.projectKeyword);
  if (dirs.length === 0) {
    return { ok: false, error: `no session project dir matches keyword "${options.projectKeyword}" under ${config.sessionsDir}` };
  }
  if (dirs.length > 1) {
    return { ok: false, error: `keyword "${options.projectKeyword}" is ambiguous, matches: ${dirs.join(', ')}` };
  }
  const projectDir = dirs[0];
  // dsh encodes a project path by collapsing `/`, `\` and `:` into a single `-`
  // (see session-persistence-jsonl/format.ts), wrapping the slug in `--…--`.
  // `--data--` is the project `data`; `--Users-me-demo--` is `Users/me/demo`.
  const projectName = projectDir.replace(/^-+|-+$/g, '').split('-').filter(Boolean).at(-1) ?? projectDir;
  const sessions = listSessions(config.sessionsDir, projectDir);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:36-58](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/client.js#L36-L58)

HTTP 调用与失败状态。

<details>
<summary>查看原文（23行）</summary>

```text
  async request(method, path, { json, timeoutMs, expect = [200] } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs ?? this.requestTimeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.headers(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
        body: json !== undefined ? JSON.stringify(json) : undefined,
        signal: controller.signal,
      });
      const text = await response.text();
      if (!expect.includes(response.status)) {
        throw new WeknoraApiError(response.status, method, path, text.slice(0, 300));
      }
      try {
        return text === '' ? {} : JSON.parse(text);
      } catch {
        return { raw: text };
      }
    } finally {
      clearTimeout(timer);
    }
  }
```

</details>

**依据 5 · 源码核查**：[lib/archive.js:85-150](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L85-L150)

逐篇同步上传。

<details>
<summary>查看原文（66行）</summary>

```text
  const uploaded = [];
  const skipped = [];
  const isFirstRun = existingTitles.size === 0;
  for (const session of sessions) {
    const title = sessionDocTitle(projectName, session.sessionId);
    if (isArchived(title)) {
      skipped.push(session.sessionId);
      continue;
    }
    const text = readSessionText(session.filePath);
    if (text.messages.length === 0) {
      skipped.push(session.sessionId);
      continue;
    }
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
    }
    const filename = `${sessionDocTitle(projectName, session.sessionId).replace(/^会话总结: /, '')}.md`;
    try {
      await client.uploadKnowledge({ knowledgeBaseId, title, content: summary.markdown, filename });
      uploaded.push({ sessionId: session.sessionId, title, filename, chars: summary.markdown.length });
    } catch (err) {
      // WeKnora answers 409 duplicate_file when a same-named document already
      // exists. The pre-upload title check misses it whenever a previous run
      // uploaded before its document became listable, so treat it as a skip
      // rather than aborting the whole pass.
      if (err?.status === 409) {
        skipped.push(session.sessionId);
        continue;
      }
      throw err;
    }
  }

  // First run also contributes a project overview.
  let overview = null;
  if (isFirstRun && !options.dryRun && uploaded.length > 0) {
    overview = summarizeProjectOverview({ projectName, projectDir, sessions, summaries: uploaded });
    try {
      await client.uploadKnowledge({
        knowledgeBaseId,
        title: overview.title,
        content: overview.markdown,
        filename: '00_项目总览.md',
      });
    } catch (err) {
      if (err?.status !== 409) throw err;   // an existing overview is fine
      overview = null;
    }
  }

  log?.info(`dsh-weknora-archive: ${projectName} → kb ${knowledgeBaseId}: ${uploaded.length} uploaded, ${skipped.length} skipped`);
  return {
    ok: true,
    knowledgeBaseId,
    created,
    project: projectName,
    projectDir,
    totalSessions: sessions.length,
    uploaded,
    skippedCount: skipped.length,
    overview: overview ? overview.title : null,
    dryRun: Boolean(options.dryRun),
  };
```

</details>

**依据 6 · 作者声明**：[README.md:55-59](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/README.md#L55-L59)

作者已知解析/活会话边界。

```text
## 已知边界

- 总结是启发式抽取，不是 LLM 精炼；追求质量可在归档前手工润色。
- 正在运行的会话文件可能解压失败，会被跳过（下次归档自动补上）。
- 新建库的 embedding 配置需在 WeKnora 端完成（PUT 接口会静默丢弃 embedding 字段）。
```

#### 缺口

- 无真实会话量下的资源和成功解析对照。
  **影响：**无法计算每篇可检索摘要成本。
  **进一步探讨：**固定样本记录解压/上传/嵌入时间、字节与人工审核。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何把预览变为真正可审阅交付并验证净价值？

**研究主题：**新假设与验证、采用判断

#### 完整回答

当前不宜对含敏感内容的会话直接全自动上传；先对无敏感样本指定已存在知识库，手工审阅摘要并核解析结果。新的未实现假设是两阶段归档：第一阶段纯本地生成带完整会话 ID、项目路径哈希和脱敏 canary 检测结果的清单及摘要，第二阶段用户选定后以幂等键上传并轮询解析；比现行 dry_run+标题去重可减少意外建库、泄漏和误跳过。固定含假密钥、8 位前缀碰撞、101 篇与解析失败样本，对照误泄漏、误去重、可检索率、人工分钟和额外请求。

#### 证据与依据

**依据 1 · 源码核查**：[lib/archive.js:11-33](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L11-L33)

当前短会话 ID。

<details>
<summary>查看原文（23行）</summary>

```text
/** Doc title convention must match the session-archive skill: `会话总结: <project>_<sessionId8>`. */
export function sessionDocTitle(projectName, sessionId) {
  // Session ids look like `session-<uuid>` or a bare `<uuid>`; both carry a
  // long `session-` prefix that a plain slice(0, 8) would swallow whole.
  const tail = String(sessionId).replace(/^session-/, '');
  const short = tail.length > 8 ? tail.slice(0, 8) : tail;
  return `会话总结: ${projectName}_${short}`;
}

/**
 * Compute which sessions are new relative to existing document titles.
 * @returns string[] of sessionIds not yet archived.
 */
export function findNewSessions(sessions, existingTitles) {
  const known = new Set([...existingTitles].map((title) => String(title).split('_').at(-1)));
  return sessions
    .map((session) => session.sessionId)
    .filter((id) => {
      const tail = String(id).replace(/^session-/, '');
      const short = tail.length > 8 ? tail.slice(0, 8) : tail;
      return !known.has(short);
    });
}
```

</details>

**依据 2 · 源码核查**：[lib/archive.js:57-103](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/archive.js#L57-L103)

当前预览在建库之后且不展示正文。

<details>
<summary>查看原文（47行）</summary>

```text
  // Resolve target knowledge base (explicit id → config default → match by name → create).
  let knowledgeBaseId = options.knowledgeBaseId || config.knowledgeBaseId;
  let created = false;
  if (!knowledgeBaseId) {
    const bases = await client.listKnowledgeBases();
    const matched = bases.find((kb) => kb?.name === projectName);
    if (matched) {
      knowledgeBaseId = matched.id;
    } else {
      const result = await client.createKnowledgeBase(projectName, `DSH session archive for ${projectDir} (by dsh-weknora-archive)`);
      knowledgeBaseId = result?.id ?? result?.data?.id ?? '';
      created = true;
    }
  }
  if (!knowledgeBaseId) return { ok: false, error: 'could not resolve or create a target knowledge base' };

  const existing = await client.listKnowledge(knowledgeBaseId);
  const existingTitles = new Set(existing.map((doc) => doc?.title ?? doc?.knowledge_title ?? ''));
  // WeKnora titles a document after the uploaded FILE, so the library shows
  // `data_xxx.md` while the intended title is `会话总结: data_xxx`. Compare on
  // the session key so both spellings deduplicate.
  const isArchived = (title) => {
    if (existingTitles.has(title)) return true;
    const key = title.replace(/^会话总结: /, '').replace(/\.md$/i, '');
    return [...existingTitles].some((existingTitle) =>
      existingTitle.replace(/\.md$/i, '').endsWith(key));
  };

  const uploaded = [];
  const skipped = [];
  const isFirstRun = existingTitles.size === 0;
  for (const session of sessions) {
    const title = sessionDocTitle(projectName, session.sessionId);
    if (isArchived(title)) {
      skipped.push(session.sessionId);
      continue;
    }
    const text = readSessionText(session.filePath);
    if (text.messages.length === 0) {
      skipped.push(session.sessionId);
      continue;
    }
    const summary = summarizeSession(text, { projectName, maxChars: config.maxSummaryChars });
    if (options.dryRun) {
      uploaded.push({ sessionId: session.sessionId, title, dryRun: true, chars: summary.markdown.length });
      continue;
    }
```

</details>

**依据 3 · 源码核查**：[lib/summarizer.js:105-164](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/summarizer.js#L105-L164)

当前摘要无脱敏。

<details>
<summary>查看原文（60行）</summary>

```text
  // Only user lines that survive scaffolding removal can describe the topic.
  const userIntent = userTurns.flatMap((turn) => meaningfulLines(turn.text));

  const decisions = [];
  const details = new Set();
  const commands = new Set();
  const paths = new Set();
  for (const message of contentful) {
    for (const match of message.text.matchAll(COMMAND_PATTERN)) commands.add(clip(match[1], 120));
    for (const match of message.text.matchAll(PATH_PATTERN)) {
      if (!match[0].includes('node_modules')) details.add(clip(match[0], 160));
    }
  }
  // Decisions come from user lines too, but keep only those that read like a
  // statement of intent rather than a fragment of a longer system block.
  for (const line of userIntent) {
    if (decisions.length >= 8) break;
    if (line.length < 12) continue;
    if (/[.。!！?？]$/.test(line) || line.includes('：') || line.includes(': ')) {
      decisions.push(clip(line, 200));
    }
  }
  const toolNames = new Set();
  for (const turn of assistantTurns) {
    for (const match of turn.text.matchAll(/\b(?:weknora_[a-z_]+|todo_write|subagent|workflow|bash|read|write|edit|grep|glob)\b/g)) {
      toolNames.add(match[1]);
    }
  }

  // Topic: the first real user lines, longest-first within the opening turns.
  const topics = userIntent.slice(0, 3).map((line) => clip(line, 120));
  const chars = session.messages.reduce((sum, m) => sum + m.text.length, 0);
  const idTail = String(session.sessionId ?? '').replace(/^session-/, '');
  const shortId = idTail.length > 8 ? idTail.slice(0, 8) : idTail;
  const title = `会话总结: ${projectName}_${shortId}`;

  lines.push(`# ${title}`);
  lines.push('');
  lines.push(`- **主题**: ${topics.length > 0 ? topics.join(' / ') : '(无用户输入)'}`);
  lines.push(`- **体量**: ${session.messages.length} 条消息 / 约 ${chars} 字符${assistantTurns.length === 0 ? '；[派工型会话：仅任务书无回复]' : ''}`);
  if (decisions.length > 0) {
    lines.push('- **关键决策与结论**:');
    for (const decision of decisions.slice(0, 8)) lines.push(`  1. ${decision}`);
  }
  if (commands.size > 0) {
    lines.push('- **产出与命令**:');
    for (const command of [...commands].slice(0, 6)) lines.push(`  - \`${command}\``);
  }
  if (paths.size > 0) {
    lines.push('- **重要细节（路径/端口/配置）**:');
    for (const path of [...paths].slice(0, 8)) lines.push(`  - ${path}`);
  }
  if (toolNames.size > 0) lines.push(`- **使用的工具**: ${[...toolNames].slice(0, 12).join(', ')}`);
  lines.push('- **未完成/遗留**: 以会话末尾为准，未发现显式遗留事项' );
  lines.push('');
  lines.push('> 由 dsh-weknora-archive 启发式总结生成（无 LLM 参与）；凭据类内容一律未收录完整值。');

  let markdown = lines.join('\n');
  if (markdown.length > maxChars) markdown = `${markdown.slice(0, maxChars)}\n…(截断)`;
  return { title, markdown };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:75-119](https://github.com/AAAlenwow/dsh-weknora-archive/blob/46079ecb3554239797b1dcbe2e82f74a21adb9a1/lib/client.js#L75-L119)

列表/上传及解析 API。

<details>
<summary>查看原文（45行）</summary>

```text
  /** GET /knowledge-bases/{id}/knowledge?page_size=100 — list documents. */
  listKnowledge(knowledgeBaseId) {
    return this.request('GET', `/knowledge-bases/${encodeURIComponent(knowledgeBaseId)}/knowledge?page_size=100`)
      .then((body) => Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []));
  }

  /**
   * POST /knowledge-bases/{id}/knowledge/file — upload one Markdown document.
   *
   * This deployment exposes the multipart upload under the knowledge-base
   * scoped `/knowledge/file` route (taken from the WeKnora web client's own
   * request), not the flat `/knowledge` route used by the upstream docs.
   */
  async uploadKnowledge({ knowledgeBaseId, title, content, filename }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.uploadTimeoutMs);
    const path = `/knowledge-bases/${encodeURIComponent(knowledgeBaseId)}/knowledge/file`;
    try {
      const form = new FormData();
      form.append('file', new Blob([new TextEncoder().encode(content)], { type: 'text/markdown' }),
        filename ?? `${title}.md`);
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: this.headers(),
        body: form,
        signal: controller.signal,
      });
      const text = await response.text();
      if (response.status !== 200 && response.status !== 201) {
        throw new WeknoraApiError(response.status, 'POST', path, text.slice(0, 300));
      }
      try {
        return JSON.parse(text);
      } catch {
        return { raw: text };
      }
    } finally {
      clearTimeout(timer);
    }
  }

  /** POST /knowledge/{id}/reparse — retry parsing a failed document. */
  reparse(knowledgeId) {
    return this.request('POST', `/knowledge/${encodeURIComponent(knowledgeId)}/reparse`, { expect: [200, 201, 202] });
  }
```

</details>

#### 缺口

- 两阶段审阅、强身份与脱敏未实现。
  **影响：**不能算当前创新或收益。
  **进一步探讨：**用 canary 和规模/失败矩阵做对照，核净人工与可检索文档。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
