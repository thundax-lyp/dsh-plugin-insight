# Molio DSH 知识库插件

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[d3f8111](https://github.com/zhuzhaoyun/Molio/tree/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio)

<!-- BEGIN META -->
[![GitHub ★ 442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhuzhaoyun/Molio) [![npm 30d 522](https://img.shields.io/static/v1?label=npm+30d&message=522&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio)
<!-- END META -->

> **功能**：让 DSH 通过只读工具列出、搜索和读取 Molio 本地知识库。

> **亮点**：[Q01](#research-q01)把已有daemon只读能力以五个原生DSH工具接入，减少资料切换。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)active库可漂移，只读不等内容不外发；远程需独立访问控制，force不是token预算。

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
  - [Q01 · DSH接入改变了什么知识任务？](#detail-section-11)
  - [Q02 · 搜索与原文沿什么边界返回？](#detail-section-12)
  - [Q03 · 只读为何仍有采用条件？](#detail-section-13)
  - [Q04 · 如何试用，下一步增量是否值得做？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Molio资料用户在DSH做研究/写作/问答。

手工复制资料、Molio界面或CLI/MCP。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| status/列库 | 连接诊断/明确id | 可能包含库路径 |
| 文件树/搜索 | 资料定位 | 索引非绝对最新 |
| 读原文 | 核来源用于回答 | 文本/大小与模型预算 |
| 远程URL | NAS/其他daemon | 独立网络鉴权/传输 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH/Node | 必需 | 原生工具注册 | 实装未验 |
| Molio daemon与vault | 必需 | 搜索/原文服务 | 健康错误/无库拒绝 |
| cwd无关的固定vault id | 建议 | 避免active漂移 | 默认库随界面改变 |
| 网络控制/许可 | 远程/商业场景 | 安全连接与采用条件 | 需另核部署及条款 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 副本小库/本机daemon | status和列库正确 |
| 定位 | Agent显式id搜索 | 核来源和truncated |
| 读原文 | Agent小文本读取 | 人工核片段/引用 |
| 异常退出 | 停读取回界面/CLI | 保留披露记录不撤销外发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | daemon/磁盘/构建 | 安装和资料授权 | 耗时未测 |
| 持续 | 索引/模型token | 来源核查/库管理 | 费用与净节时未知 |
| 失败恢复 | 服务/索引资源 | 判断错库/过期/断连 | 真实恢复未验 |
| 退出 | 原库仍保留 | 移除工具/清披露记录 | 已外发不可撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 对话取资料 | 五工具实际接线 | 研究质量/节时 |
| 只读 | 仅GET端点 | 非数据不外发 |
| 检索与原文 | FTS/LIKE和读取保护 | 召回/绝对最新 |
| 失败解释 | 类型映射/limit校验 | 取消宿主分类 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)active库可漂移，只读不等内容不外发；远程需独立访问控制，force不是token预算。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)把已有daemon只读能力以五个原生DSH工具接入，减少资料切换。

[Q02](#research-q02)limit校验、错误映射、signal、真实路径/大小保护和FTS实现；不宣称绝对取消/最新。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)active库可漂移，只读不等内容不外发；远程需独立访问控制，force不是token预算。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)本机小库固定id，先搜索再核原文，异常回界面/CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

插件全部工具/辅助源码与同提交daemon读/搜索关键链静态核查，未运行DSH/daemon/模型。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-molio/README.md、packages/dsh-plugin-molio/package.json、packages/dsh-plugin-molio/cordis.patch.yml、packages/dsh-plugin-molio/src/index.ts、packages/dsh-plugin-molio/src/daemon-client.ts、packages/dsh-plugin-molio/src/vault-resolver.ts、packages/dsh-plugin-molio/src/read-service.ts、packages/dsh-plugin-molio/src/errors.ts、packages/dsh-plugin-molio/src/tools/common.ts、packages/dsh-plugin-molio/src/tools/kb-read.ts、packages/dsh-plugin-molio/src/tools/kb-search.ts、packages/dsh-plugin-molio/src/tools/kb-tree.ts、packages/dsh-plugin-molio/src/tools/kb-vaults.ts、packages/dsh-plugin-molio/src/tools/molio-status.ts、apps/daemon/src/core/knowledge.ts、apps/daemon/src/core/vault-search.ts、apps/daemon/src/routes/knowledge.ts、apps/daemon/src/core/encoding.ts、apps/daemon/src/server.ts、LICENSE 及固定范围 inventory；组件：packages/dsh-plugin-molio。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧稿，完整子包工具源码并定向读同提交daemon知识读取/搜索/挂接/大小策略；非整个Molio平台审计。
- 下一步：本机status/固定id/重名/切active/外改/取消/大文件矩阵及人工同任务基线。

**分析版本**

- **仓库**：[zhuzhaoyun/Molio](https://github.com/zhuzhaoyun/Molio)
- **版本号**：0.1.0（[固定提交 d3f8111](https://github.com/zhuzhaoyun/Molio/tree/d3f8111be1a37bba024e54176f131477b446c681)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)会话固定vault/来源版本收据可探索，须先与现有显式id比较，无差异则否定。

本机status/固定id/重名/切active/外改/取消/大文件矩阵及人工同任务基线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 502 |
| .ts | source | 11 | 579 | 448 | 88 | — |
| .ts | test | 3 | 490 | 421 | 29 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/zhuzhaoyun/Molio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核DSH原生只读工具对知识任务的增量及daemon依赖边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH接入改变了什么知识任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有Molio资料、希望在DSH研究写作问答的用户，提供状态、列库、树、搜索、读原文五个模型工具。相对复制文件内容，模型可先定位再读取；相对Molio CLI/MCP，增量是原生DSH tools注册与相同错误/数据出口，知识库实现继承daemon，不能把整个Molio平台算本子包贡献。插件没有run/SSE问答链，也不替DSH选择模型或生成最终答案；成功判据是明确来源的正确文本进入任务，非工具能返回JSON。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-molio/README.md:1-11](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/README.md#L1-L11)

作者场景/只读/前提。

<details>
<summary>查看原文（11行）</summary>

```text
# dsh-plugin-molio

让 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/dsh) 直接读取你的 [Molio](https://github.com/zhuzhaoyun/Molio) 本地知识库：在 dsh 对话中列出知识库、浏览文件树、全文搜索、读取原文，AI 基于你的积累做研究、写作与问答。

全部工具**只读**——插件不会修改你的知识库。

## 前置条件

1. Molio 桌面端（或 Docker/NAS 部署）已启动，其本地 daemon 默认监听 `http://127.0.0.1:3100`
2. Molio 中已创建至少一个知识库（vault）
3. dsh `>= 0.2.0-rc.2`
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/index.ts:13-35](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/index.ts#L13-L35)

五工具真实注册。

<details>
<summary>查看原文（23行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis';
import { DaemonClient } from './daemon-client.js';
import { registerKbRead } from './tools/kb-read.js';
import { registerKbSearch } from './tools/kb-search.js';
import { registerKbTree } from './tools/kb-tree.js';
import { registerKbVaults } from './tools/kb-vaults.js';
import { registerMolioStatus } from './tools/molio-status.js';

/** Cordis plugin name used by loader diagnostics. */
export const name = 'molio-kb';

/** 宿主服务依赖：tools 注册表就绪后才 apply。 */
export const inject = ['tools'];

/** 注册全部 Molio 知识库工具（5 个，全只读）。 */
export function apply(ctx: Context): void {
  const client = new DaemonClient();
  registerMolioStatus(ctx, client);
  registerKbVaults(ctx, client);
  registerKbTree(ctx, client);
  registerKbSearch(ctx, client);
  registerKbRead(ctx, client);
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-molio/src/daemon-client.ts:1-16](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/daemon-client.ts#L1-L16)

CLI继承与只读HTTP范围。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * DaemonClient — Molio daemon HTTP API 的薄客户端（只读子集）。
 *
 * 移植自 apps/cli/src/daemon-client.ts，设计红线相同：插件不含任何知识库
 * 逻辑（路径穿越防护、编码检测、大文件拒绝等全在 daemon 侧），本文件只做
 * fetch 封装 + 类型化错误映射（DaemonError）。
 *
 * 与 CLI 版的差异：
 * - 只保留只读端点（health / vaults / active-vault / tree / files / search），
 *   不含 run/SSE（本插件不做 AI 问答）；
 * - 每个方法接受调用方 AbortSignal（dsh 工具管线经 exec.signal 传递取消），
 *   未传时用默认超时兜底。
 *
 * 基址解析：MOLIO_DAEMON_URL（显式覆盖，支持远程/NAS/Docker 部署）
 *        → http://127.0.0.1:${MOLIO_PORT ?? 3100}（daemon 默认端口）
 */
```

</details>

#### 缺口

- 真实研究写作质量和手工/CLI基线未测。
  **影响**：不能声称召回或效率提高。
  **进一步探讨**：同一库同一问题比较可核引用与人工操作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索与原文沿什么边界返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

resolveVault先精确id，再忽略大小写名称；重名报错，省略时每次读daemon active vault。search执行校验limit1..100，再GET搜索返回results/truncated；read把路径整体编码传HTTP，daemon解码并按vault解析、realpath后验证含分隔符的根路径，再执行编码检测和大小策略。固定daemon搜索是SQLite FTS，短于3字符用LIKE，初次建库/正在构建会等待，命中会检查文件变更并有限重查；不是插件自带向量RAG。

原文非文本返回说明，soft cap默认50MiB，force可读中间档但超过默认256MiB hard cap仍拒绝；实际值可由daemon环境覆盖。客户端把HTTP/连接/文件大错误转可读错误，所有请求都是GET。exec.signal传入fetch，未传才使用15秒/health5秒timeout；有signal时不叠加客户端定时器，外层工具timeout才是另一层，不能宣称总15秒上限。取消经guarded重包Error，实际宿主是否保留取消分类尚未验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-molio/src/vault-resolver.ts:16-50](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/vault-resolver.ts#L16-L50)

id/名称/active解析。

<details>
<summary>查看原文（35行）</summary>

```text
export async function resolveVault(
  client: DaemonClient,
  vaultArg?: string,
  signal?: AbortSignal,
): Promise<Vault> {
  if (vaultArg !== undefined && vaultArg.trim() !== '') {
    const vaults = await client.listVaults(signal);
    const arg = vaultArg.trim();

    const byId = vaults.filter((v) => v.id === arg);
    if (byId.length === 1) return byId[0]!;

    const lower = arg.toLowerCase();
    const byName = vaults.filter((v) => v.name.toLowerCase() === lower);
    if (byName.length === 1) return byName[0]!;
    if (byName.length > 1) {
      const list = byName.map((v) => `  ${v.id}  ${v.name}`).join('\n');
      throw new VaultNotFoundError(
        `知识库名称「${arg}」有多个匹配，请用 vaultId 参数指定 id：\n${list}`,
      );
    }
    const available = vaults.length
      ? vaults.map((v) => `  ${v.id}  ${v.name}`).join('\n')
      : '  （当前没有任何知识库）';
    throw new VaultNotFoundError(`未找到知识库「${arg}」。可用知识库：\n${available}`);
  }

  const { vault } = await client.getActiveVault(signal);
  if (!vault) {
    throw new VaultNotFoundError(
      '未指定知识库，且 Molio 当前没有打开的知识库。请在 Molio 中选择一个知识库，或用 vaultId 参数指定',
    );
  }
  return vault;
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-search.ts:31-55](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/tools/kb-search.ts#L31-L55)

limit和截断输出。

<details>
<summary>查看原文（25行）</summary>

```text
      execute: async (args, exec) =>
        guarded(async () => {
          // dsh 的 ValueSchemaSpec 无 min/max 约束，边界在 execute 内校验（与 MCP zod 版语义一致）
          if (
            args.limit !== undefined &&
            (!Number.isInteger(args.limit) || args.limit < 1 || args.limit > 100)
          ) {
            throw new Error(`limit 必须是 1..100 的整数（收到 ${String(args.limit)}）`);
          }
          const vault = await resolveVault(client, args.vaultId, exec.signal);
          const { results, truncated } = await client.search(
            vault.id,
            args.query,
            args.limit,
            exec.signal,
          );
          return json({
            vault: { id: vault.id, name: vault.name },
            query: args.query,
            results,
            truncated,
            ...(truncated
              ? { hint: '结果已截断，可调大 limit（最大 100）或用更精确的关键词' }
              : {}),
          });
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-molio/src/daemon-client.ts:57-96](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/daemon-client.ts#L57-L96)

signal与错误。

<details>
<summary>查看原文（40行）</summary>

```text
  private async request<T>(
    path: string,
    opts: { signal?: AbortSignal; timeoutMs?: number } = {},
  ): Promise<T> {
    const { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = opts;
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        signal: signal ?? AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      // 调用方主动取消：原样上抛，由 dsh 管线归类为 ABORTED，不伪装成 daemon 故障
      if (err instanceof Error && err.name === 'AbortError' && signal?.aborted) throw err;
      if (err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
        throw new DaemonError('TIMEOUT', `GET ${path} 超过 ${timeoutMs}ms`);
      }
      throw new DaemonError(
        'DAEMON_UNREACHABLE',
        `无法连接 ${this.baseUrl}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    if (!res.ok) {
      throw await this.toDaemonError(res, path);
    }
    return (await res.json()) as T;
  }

  private async toDaemonError(res: Response, path: string): Promise<DaemonError> {
    let code: DaemonErrorCode = 'HTTP_ERROR';
    let message = `HTTP ${res.status} (${path})`;
    try {
      const body = (await res.json()) as { error?: { code?: string; message?: string } };
      if (body?.error?.message) message = body.error.message;
      if (body?.error?.code === 'NOT_FOUND') code = 'NOT_FOUND';
    } catch {
      /* 非 JSON 错误体，保留状态码消息 */
    }
    if (res.status === 404) code = 'NOT_FOUND';
    if (res.status === 413) code = 'FILE_TOO_LARGE';
    return new DaemonError(code, message, res.status);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-molio/src/read-service.ts:14-47](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/read-service.ts#L14-L47)

tooLarge/binary处理。

<details>
<summary>查看原文（34行）</summary>

```text
export async function readVaultFile(
  client: DaemonClient,
  opts: { vaultArg?: string; relPath: string; force?: boolean; signal?: AbortSignal },
): Promise<ReadOutcome> {
  const vault = await resolveVault(client, opts.vaultArg, opts.signal);
  let file: FileContent;
  try {
    file = await client.readFile(vault.id, opts.relPath, opts.force === true, opts.signal);
  } catch (err) {
    if (isDaemonError(err)) {
      if (err.code === 'NOT_FOUND') {
        throw new Error(`文件不存在: ${opts.relPath}`);
      }
      if (err.code === 'FILE_TOO_LARGE') {
        throw new Error(`文件过大，拒绝读取: ${opts.relPath}（${err.message}）`);
      }
    }
    throw err;
  }

  if (file.tooLarge) {
    throw new Error(
      `文件过大（${file.size} 字节）: ${opts.relPath}${opts.force ? '' : '，可尝试 force:true 强制读取'}`,
    );
  }

  const kind =
    !file.content && file.mimeType && !isTextMime(file.mimeType) ? 'binary' : 'text';
  return { kind, vault, file };
}

export function isTextMime(mime: string): boolean {
  return mime.startsWith('text/') || mime === 'application/json';
}
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/routes/knowledge.ts:227-259](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/routes/knowledge.ts#L227-L259)

read端点接线。

<details>
<summary>查看原文（33行）</summary>

```text
  // GET /api/knowledge/vaults/:id/files/* — read a file
  app.get('/vaults/:id/files/*', (c) => {
    const vault = getVault(db, c.req.param('id'));
    if (!vault) {
      return c.json({ error: { code: 'NOT_FOUND', message: 'Vault not found' } }, 404);
    }

    // Extract relative path from the wildcard segment
    const fullPath = c.req.path;
    const prefix = `/api/knowledge/vaults/${vault.id}/files/`;
    const relPath = decodeURIComponent(fullPath.slice(prefix.length));

    if (!relPath) {
      return c.json({ error: { code: 'BAD_REQUEST', message: 'File path is required' } }, 400);
    }

    try {
      const force = c.req.query('force') === '1';
      const file = readFile(vault.path, relPath, { force });
      return c.json(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      if (err instanceof FileTooLargeError) {
        return c.json({ error: { code: 'FILE_TOO_LARGE', message } }, 413);
      }
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        return c.json({ error: { code: 'NOT_FOUND', message } }, 404);
      }
      return c.json({ error: { code: 'INTERNAL', message } }, 500);
    }
  });

```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/core/knowledge.ts:192-231](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/core/knowledge.ts#L192-L231)

读文件与realpath/大小。

<details>
<summary>查看原文（40行）</summary>

```text
export function readFile(vaultPath: string, relPath: string, opts: { force?: boolean } = {}): FileContent {
  // Normalize agent-absolute / ./-prefixed paths for disk resolution, but echo
  // the caller's original path in the response (existing API contract).
  const reqPath = relPath;
  relPath = toVaultRelativePath(vaultPath, relPath);
  let resolved = resolveFilePath(vaultPath, relPath);

  if (!fs.existsSync(resolved)) {
    resolved = resolveWithFallbacks(vaultPath, relPath);
  }

  if (!fs.existsSync(resolved)) {
    const err = new Error(`File not found: ${relPath}`) as NodeJS.ErrnoException;
    err.code = 'ENOENT';
    throw err;
  }

  // Follow symlinks and re-validate the real path is still inside the vault
  // before reading — defends against a symlink swapped in to escape the vault.
  const real = resolveRealWithinVault(vaultPath, resolved);

  const stat = fs.statSync(real);
  const mimeType = getMimeType(path.basename(real));
  const isText = isTextFile(real);

  // Three-tier cap. Encoding is detected from a 64KB sample for text files so
  // even tooLarge text files report their encoding on the card.
  const strategy = decideReadStrategy(stat.size, opts.force === true);
  const sample = isText ? readSample(real, ENCODING_SAMPLE_BYTES) : Buffer.alloc(0);
  const encoding = isText ? detectEncoding(sample) : undefined;

  if (strategy === 'refuse') {
    throw new FileTooLargeError(stat.size);
  }
  if (strategy === 'tooLarge') {
    return { path: reqPath, content: '', size: stat.size, modifiedAt: stat.mtimeMs, mimeType, encoding, tooLarge: true };
  }

  const content = isText ? decodeAll(fs.readFileSync(real), encoding ?? 'utf-8') : '';
  return { path: reqPath, content, size: stat.size, modifiedAt: stat.mtimeMs, mimeType, encoding };
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/core/knowledge.ts:490-526](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/core/knowledge.ts#L490-L526)

真实根路径防护。

<details>
<summary>查看原文（37行）</summary>

```text
/**
 * Verify an already-resolved absolute path stays inside the vault root.
 * Uses a trailing path separator so a sibling directory like
 * `/data/vault-secret` is NOT mistaken for `/data/vault`. The daemon has no
 * authentication (CORS allows any localhost origin), so this guard is the
 * primary boundary against path-traversal exfiltration.
 */
function assertWithinVault(vaultPath: string, resolved: string): void {
  const vaultRoot = path.resolve(vaultPath);
  if (resolved !== vaultRoot && !resolved.startsWith(vaultRoot + path.sep)) {
    throw new Error('Path traversal not allowed');
  }
}

/**
 * Resolve the real on-disk path (following symlinks) and confirm it remains
 * inside the vault. Closes a TOCTOU/symlink-escape: between an existsSync
 * check and a later read, a file could be replaced with a symlink pointing
 * outside the vault, and statSync/readFileSync follow symlinks by default.
 *
 * The vault root itself may contain symlink components (e.g. macOS tmpdir
 * `/var` → `/private/var`), so we canonicalize both sides before comparing.
 */
function resolveRealWithinVault(vaultPath: string, resolved: string): string {
  assertWithinVault(vaultPath, resolved);
  const real = fs.realpathSync(resolved);
  // Canonicalize the vault root the same way so a symlinked root doesn't
  // cause legitimate reads to be rejected.
  let realVault: string;
  try {
    realVault = fs.realpathSync(path.resolve(vaultPath));
  } catch {
    realVault = path.resolve(vaultPath);
  }
  if (real !== realVault && !real.startsWith(realVault + path.sep)) {
    throw new Error('Path traversal not allowed');
  }
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/core/encoding.ts:10-13](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/core/encoding.ts#L10-L13)

soft/hard默认。

```text
/** Soft cap: files ≤ this load fully into CodeMirror. Env-overridable (tests). */
export const MAX_VIEW_SIZE = parseEnvBytes('MOLIO_MAX_VIEW_SIZE', 50 * 1024 * 1024);
/** Hard cap: above this, daemon refuses content even with ?force. Env-overridable. */
export const HARD_CAP = parseEnvBytes('MOLIO_HARD_CAP', 256 * 1024 * 1024);
```

**依据 9 · 源码核查**：[apps/daemon/src/core/encoding.ts:86-94](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/core/encoding.ts#L86-L94)

force策略。

```text

export type ReadStrategy = 'full' | 'tooLarge' | 'refuse';

/** Pure tier decision — unit-testable without fs. */
export function decideReadStrategy(size: number, force: boolean): ReadStrategy {
  if (size <= MAX_VIEW_SIZE) return 'full';
  if (size > HARD_CAP) return 'refuse';
  return force ? 'full' : 'tooLarge';
}
```

**依据 10 · 源码核查**：[apps/daemon/src/core/vault-search.ts:323-388](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/core/vault-search.ts#L323-L388)

FTS/短词LIKE/索引等待与变更重查。

<details>
<summary>查看原文（66行）</summary>

```text
export async function searchVaultFiles(
  db: SqliteDb, vaultId: string, vaultPath: string, query: string, limit = 20,
): Promise<{ results: SearchResult[]; truncated: boolean }> {
  const { phrase, trimmed } = sanitizeFtsQuery(query);
  if (!trimmed) return { results: [], truncated: false };

  // 有 in-flight 构建先等它：分片构建途中影子表已有行，光看 seeded 会查到半成品
  // （静默漏结果）。该 vault 从未建过库才由本请求触发一次构建。
  const building = hasInflightBuild(db, vaultId);
  if (building) await building;
  else if (!db.prepare('SELECT 1 FROM vault_files_state WHERE vault_id = ? LIMIT 1').get(vaultId)) {
    await ensureVaultIndexed(db, vaultId, vaultPath);
  }

  const runQuery = (): Array<{ file_path: string; snip: string }> => {
    if (trimmed.length < 3) {
      // snippet 取匹配处 ±30（与旧 searchFiles 一致）——SearchPanel 靠 snippet 内
      // indexOf 高亮关键词，若取文件开头则 2 字中文查询（旗舰场景）的高亮全失效。
      const like = `%${trimmed.replace(/[\\%_]/g, '\\$&')}%`;
      return db.prepare(
        `SELECT file_path,
                substr(content, max(1, instr(content, ?) - 30), length(?) + 60) AS snip
         FROM vault_files_fts
         WHERE vault_id = ? AND content LIKE ? ESCAPE '\\'
         ORDER BY file_path LIMIT ?`,
      ).all(trimmed, trimmed, vaultId, like, limit + 1) as Array<{ file_path: string; snip: string }>;
    }
    return db.prepare(
      `SELECT file_path, snippet(vault_files_fts, 0, '', '', '…', 24) AS snip
       FROM vault_files_fts WHERE vault_files_fts MATCH ? AND vault_id = ?
       ORDER BY bm25(vault_files_fts) LIMIT ?`,
    ).all(phrase, vaultId, limit + 1) as Array<{ file_path: string; snip: string }>;
  };

  let rows = runQuery();
  let retried = false;
  const vaultRoot = path.resolve(vaultPath);
  for (let i = rows.length - 1; i >= 0; i--) {
    const rel = rows[i]!.file_path;
    const resolved = path.resolve(path.join(vaultPath, rel));
    if (resolved !== vaultRoot && !resolved.startsWith(vaultRoot + path.sep)) {
      rows.splice(i, 1); // 索引被污染的防御：路径出库的直接剔掉
      continue;
    }
    let stat: fs.Stats;
    try {
      stat = fs.statSync(resolved);
    } catch {
      removeVaultFile(db, vaultId, rel); // 外部删除：出结果 + 出索引
      rows.splice(i, 1);
      continue;
    }
    const shadow = db.prepare('SELECT mtime, size FROM vault_files_state WHERE vault_id = ? AND file_path = ?')
      .get(vaultId, rel) as { mtime: number; size: number } | undefined;
    if (shadow && (shadow.mtime !== Math.floor(stat.mtimeMs) || shadow.size !== stat.size)) {
      indexVaultFile(db, vaultId, vaultPath, rel); // 外部修改：重索引这一份
      if (!retried) { rows = runQuery(); retried = true; } // 内容可能变了，整榜重查一次
    }
  }

  const results = rows.slice(0, limit).map((r) => ({
    filePath: r.file_path,
    fileName: r.file_path.split('/').pop() ?? r.file_path,
    snippet: r.snip.replace(/\s+/g, ' ').trim(),
  }));
  return { results, truncated: rows.length > limit };
```

</details>

**依据 11 · 源码核查**：[packages/dsh-plugin-molio/src/tools/common.ts:31-37](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/tools/common.ts#L31-L37)

重新包装异常。

```text
export async function guarded<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw new Error(errorMessage(err));
  }
}
```

#### 缺口

- 真实取消分类、索引追平和并发换文件未运行。
  **影响**：不保证取消立即停止daemon或检索绝对最新。
  **进一步探讨**：宿主取消/超时与外改后搜索再read核版本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读为何仍有采用条件？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

只读指插件五工具不调用写入API，不等知识内容留在本机、只有一个库可见或daemon整体只读。列库能返回路径信息，读回内容进入DSH模型上下文；默认active vault会随Molio界面变化，连续任务应显式传id。MOLIO_DAEMON_URL允许远程且客户端未加认证头；server仅配置localhost来源CORS并直接挂知识路由，不能把CORS当服务端调用鉴权。远程部署需独立网络访问控制/安全传输，本轮不提供公网安全背书。

路径约束真实存在，但不是租户授权；realpath检查也不构成所有文件竞争的证明。force可将很大文本送入工具结果，磁盘上限不等模型token预算。需要相容DSH/Node和运行daemon/已建vault；插件零运行时依赖不是系统无依赖。首次安装配置/授权资料，持续索引/模型token与人工来源核查，失败恢复分daemon/库选择/文件/模型，退出停工具不撤销已外发内容。README说明修改版Apache许可，根LICENSE明确商业托管/嵌入等附加条件，不能标成无附加Apache；发布包是否含其声明LICENSE未验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-vaults.ts:20-25](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/tools/kb-vaults.ts#L20-L25)

全部库及路径可返回。

```text
      execute: async (_args, exec) =>
        guarded(async () => {
          const vaults = await client.listVaults(exec.signal);
          const { vault } = await client.getActiveVault(exec.signal);
          return json({ vaults, activeVaultId: vault?.id ?? null });
        }),
```

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/daemon-client.ts:38-66](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/daemon-client.ts#L38-L66)

远程URL与无auth头fetch。

<details>
<summary>查看原文（29行）</summary>

```text
export function defaultBaseUrl(): string {
  const explicit = process.env['MOLIO_DAEMON_URL'];
  if (explicit && explicit.trim()) return stripTrailingSlash(explicit.trim());
  return `http://127.0.0.1:${process.env['MOLIO_PORT'] ?? 3100}`;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export class DaemonClient {
  readonly baseUrl: string;

  constructor(baseUrl: string = defaultBaseUrl()) {
    this.baseUrl = stripTrailingSlash(baseUrl);
  }

  // ─── 底层请求 ───

  private async request<T>(
    path: string,
    opts: { signal?: AbortSignal; timeoutMs?: number } = {},
  ): Promise<T> {
    const { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = opts;
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        signal: signal ?? AbortSignal.timeout(timeoutMs),
      });
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/server.ts:68-82](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/server.ts#L68-L82)

CORS来源规则。

<details>
<summary>查看原文（15行）</summary>

```text

// CORS — allow Vite dev server, daemon itself, and Electron dev
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return origin;
    try {
      const url = new URL(origin);
      if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.protocol === 'http:') {
        return origin;
      }
    } catch { /* ignore */ }
    return undefined;
  },
}));

```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/server.ts:118-141](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/apps/daemon/src/server.ts#L118-L141)

直接知识路由挂接。

<details>
<summary>查看原文（24行）</summary>

```text

// Routes
app.route('/api/agents', agentsRoutes(runManager));
app.route('/api/runs', runsRoutes(db, runManager, conversationService));
app.route('/api/runs', eventsRoutes(runManager));
app.route('/api/runs', toolResultRoutes(runManager));
app.route('/api/config', configRoutes({
  // Agent env overrides (CLAUDE_BIN etc.) change binary resolution — drop the
  // detection cache so GET /api/agents re-probes instead of serving stale data.
  onConfigChanged: () => runManager.invalidateAgentCache(),
}));
app.route('/api/skills', skillsRoutes(db, runManager));
app.route('/api/conversations', conversationRoutes(db, runManager, conversationService));
app.route('/api/projects', projectRoutes(db));
app.route('/api/knowledge', knowledgeRoutes(db, runManager, vaultWatcher, treeCache, (vaultId) => vaultWatcher.isReady(vaultId)));
app.route('/api/publish', publishRoutes());
app.route('/api/proxy', proxyRoutes());
app.route('/api/graph', graphRoutes(db, graphCache, (vaultId) => vaultWatcher.isReady(vaultId)));
app.route('/api/weixin', weixinRoutes(weixinService));
app.route('/api/feishu', feishuRoutes(feishuService));
app.route('/api/preload', preloadRoutes(preloadManager));
app.route('/api/maintenance', maintenanceRoutes(db));
app.route('/api/quiz', quizRoutes(db));
app.route('/api/auth', authRoutes(authClient));
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-molio/package.json:1-39](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/package.json#L1-L39)

真实子包/宿主版本。

<details>
<summary>查看原文（39行）</summary>

```text
{
  "name": "dsh-plugin-molio",
  "version": "0.1.0",
  "description": "Molio 知识库插件 for DeepSeek Harness (dsh) — 在任意 dsh 会话中搜索、浏览、读取本机 Molio 知识库",
  "type": "module",
  "main": "dist/src/index.js",
  "types": "dist/src/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/src/index.d.ts",
      "default": "./dist/src/index.js"
    },
    "./package.json": "./package.json",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "files": [
    "dist/src",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=20.0.0",
    "dsh": ">=0.2.0-rc.2"
  },
  "license": "SEE LICENSE IN LICENSE",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "molio",
    "knowledge-base"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "repository": {
    "type": "git",
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-molio/README.md:58-67](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/README.md#L58-L67)

依赖/许可声明。

<details>
<summary>查看原文（10行）</summary>

````text
本包是 [Molio monorepo](https://github.com/zhuzhaoyun/Molio) 的成员（`packages/dsh-plugin-molio`），零运行时依赖：

```bash
pnpm --filter dsh-plugin-molio build   # tsc → dist/
pnpm --filter dsh-plugin-molio test    # node:test + 假 daemon HTTP 集成测试
```

## License

与 Molio 主仓库一致：修改版 Apache License 2.0（附加条件见 [LICENSE](./LICENSE)）。
````

</details>

**依据 7 · 源码核查**：[LICENSE:1-29](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/LICENSE#L1-L29)

修改版许可附加条件。

<details>
<summary>查看原文（29行）</summary>

```text
# Open Source License

Molio is licensed under a modified version of the Apache License 2.0, with the following additional conditions:

1. Molio may be utilized commercially, including as a backend service for
   other applications or as a knowledge management platform for enterprises.
   Should the conditions below be met, a commercial license must be obtained
   from the producer:

   a. Hosted or embedded service: Unless explicitly authorized by Molio
      in writing, you may not use the Molio source code to provide a
      hosted service to third parties, or embed Molio as a component of
      a product or service that is sold, licensed, or otherwise
      commercially distributed to third parties.

      - This restriction applies to offering Molio (in whole or
        substantial part) as a SaaS platform, a managed service, or as
        an integrated component within another commercial offering.
      - Internal use within a single organization (including multiple
        workspaces) does not require a commercial license.

   b. LOGO and copyright information: In the process of using Molio's
      frontend, you may not remove or modify the LOGO or copyright
      information in the Molio console or applications. This restriction
      is inapplicable to uses of Molio that do not involve its frontend.

      - Frontend Definition: For the purposes of this license, the
        "frontend" of Molio includes all components located in the
        `apps/web/` directory when running Molio from the raw source
```

</details>

#### 缺口

- 远程访问控制、真实发布产物/取消兼容与模型费用未验。
  **影响**：推荐限本机低敏资料；商业嵌入需单独核条件。
  **进一步探讨**：核部署入口鉴权/传输，安装产物许可与实际模型输入/费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用，下一步增量是否值得做？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议已有Molio用户用副本小库，本机daemon先status→vaults取固定id→search→read核引用；二进制/超大文件不要自动force，先缩小资料/提取文本。遇到错库、原文与片段不符、服务不可达或内容披露不明，就停止模型读取，回Molio界面/CLI人工检索。限定自然语言研究资料，不把返回JSON或status健康视为问答正确。

可探索会话固定vault及来源版本收据：现有显式id已可避免active漂移，增量只在宿主会话默认绑定和每次结果显示绑定来源/版本，不能再把显式参数说成全新能力。用切active库、重名、外改文件与取消四组，对照当前显式id工作流，计错库、旧片段引用、额外提示和操作成本。若用户本来始终传id且错误无差异，或版本提示误导，就否定；尚未实现，不计已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-molio/src/vault-resolver.ts:21-49](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/vault-resolver.ts#L21-L49)

当前已可明确id，active动态。

<details>
<summary>查看原文（29行）</summary>

```text
  if (vaultArg !== undefined && vaultArg.trim() !== '') {
    const vaults = await client.listVaults(signal);
    const arg = vaultArg.trim();

    const byId = vaults.filter((v) => v.id === arg);
    if (byId.length === 1) return byId[0]!;

    const lower = arg.toLowerCase();
    const byName = vaults.filter((v) => v.name.toLowerCase() === lower);
    if (byName.length === 1) return byName[0]!;
    if (byName.length > 1) {
      const list = byName.map((v) => `  ${v.id}  ${v.name}`).join('\n');
      throw new VaultNotFoundError(
        `知识库名称「${arg}」有多个匹配，请用 vaultId 参数指定 id：\n${list}`,
      );
    }
    const available = vaults.length
      ? vaults.map((v) => `  ${v.id}  ${v.name}`).join('\n')
      : '  （当前没有任何知识库）';
    throw new VaultNotFoundError(`未找到知识库「${arg}」。可用知识库：\n${available}`);
  }

  const { vault } = await client.getActiveVault(signal);
  if (!vault) {
    throw new VaultNotFoundError(
      '未指定知识库，且 Molio 当前没有打开的知识库。请在 Molio 中选择一个知识库，或用 vaultId 参数指定',
    );
  }
  return vault;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-read.ts:35-51](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/tools/kb-read.ts#L35-L51)

原文返回形状。

<details>
<summary>查看原文（17行）</summary>

```text
      execute: async (args, exec) =>
        guarded(async () => {
          const result = await readVaultFile(client, {
            vaultArg: args.vaultId,
            relPath: args.path,
            force: args.force,
            signal: exec.signal,
          });
          const { vault, file } = result;
          if (result.kind === 'binary') {
            return json({
              kind: 'binary',
              message: `二进制文件（${file.mimeType}，${file.size} 字节），无文本内容。绝对路径: ${vault.path}/${file.path}`,
            });
          }
          return json({ kind: 'text', vault: { id: vault.id, name: vault.name }, file });
        }),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-search.ts:40-54](https://github.com/zhuzhaoyun/Molio/blob/d3f8111be1a37bba024e54176f131477b446c681/packages/dsh-plugin-molio/src/tools/kb-search.ts#L40-L54)

当前搜索来源/截断。

<details>
<summary>查看原文（15行）</summary>

```text
          const vault = await resolveVault(client, args.vaultId, exec.signal);
          const { results, truncated } = await client.search(
            vault.id,
            args.query,
            args.limit,
            exec.signal,
          );
          return json({
            vault: { id: vault.id, name: vault.name },
            query: args.query,
            results,
            truncated,
            ...(truncated
              ? { hint: '结果已截断，可调大 limit（最大 100）或用更精确的关键词' }
              : {}),
```

</details>

#### 缺口

- 来源收据增量和同任务收益未实现验证。
  **影响**：只属可证伪方向。
  **进一步探讨**：先测现有显式id是否已同效，不增加无用状态。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
