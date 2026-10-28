# dsh-plugin-molio

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c1b90f0](https://github.com/zhuzhaoyun/Molio/tree/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio)

<!-- BEGIN META -->
[![GitHub ★ 437](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=437&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhuzhaoyun/Molio) [![npm 30d 431](https://img.shields.io/static/v1?label=npm+30d&message=431&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-molio)
<!-- END META -->

> **功能**：通过本地 Molio daemon 为 DSH 提供只读知识库浏览、搜索与原文读取

> **亮点**：[Q02](#research-q02) 复用CLI读取语义并把库id、原文、类型及错误带回DSH，减少人工搬运资料的接线。

> **主要限制**：[Q03](#research-q03) 只读子插件不保证整个daemon权限安全；默认active库可随用户操作改变，多次工具调用不是固定资料快照。

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
  - [Q01 · 谁使用它，真实注册能力是什么？](#detail-section-11)
  - [Q02 · 从读取工具到原文的链路是什么？](#detail-section-12)
  - [Q03 · 只读是否解决了资料隔离、上下文漂移和所有失败？](#detail-section-13)
  - [Q04 · 如何低负担试用并检验固定库的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有Molio知识库的DSH用户，在对话中查库、搜索并读取原文以支持研究写作。

在Molio界面搜索后手工复制资料；检索/路径防护属于daemon，子插件提供只读宿主适配。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 只读库检索与读取 | 给DSH提供原文 | 本地daemon可达、明确库id |
| 读取失败说明 | 区分缺失/过大/二进制 | 不保证模型最终引用正确 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH>=0.2.0-rc.2 | 作者声明必需 | 加载工具 | 先核版本，未实机验收 |
| Molio daemon与非敏感库 | 必需 | 提供实际资料 | 服务不可用先回Molio恢复 |
| 明确vaultId | 多库任务建议必需 | 避免active库漂移 | 先列库并核id |
| 远程认证/网络约束 | 远程场景必需 | 保护资料 | 未核清前仅本地使用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户启动本地daemon并在独立profile装插件 | status可达，库id明确 |
| 2 | Agent搜索并读一篇已知原文 | 路径/内容/库与实际一致 |
| 3 | 用户核引用及大文件错误 | 不符则回Molio/原文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 已有daemon和插件磁盘 | 配置地址/profile并核库 | 时间未测 |
| 持续 | daemon资源和读文token | 资料维护与引用复核 | 总模型费用未知 |
| 失败恢复 | 重试请求 | 查服务/库id/文件大小 | 恢复耗时未测 |
| 退出 | 原库保留 | 移除插件回Molio界面 | 子插件无写回数据迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原文进入对话 | GET到磁盘原文完整链 | 引用正确率和节时 |
| 错误可理解 | 重名/过大/二进制分支 | 真实宿主取消/服务异常表现 |

> **思考**：[Q03](#research-q03) 只读子插件不保证整个daemon权限安全；默认active库可随用户操作改变，多次工具调用不是固定资料快照。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 复用CLI读取语义并把库id、原文、类型及错误带回DSH，减少人工搬运资料的接线。

[Q02](#research-q02) 复用读取内核和明确歧义错误易维护；[Q03](#research-q03)应区分只读适配、默认库状态和daemon认证责任。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 只读子插件不保证整个daemon权限安全；默认active库可随用户操作改变，多次工具调用不是固定资料快照。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有本地daemon者可显式库id试读已知原文；错库、路径或内容不符时停止据此回答并回Molio/原文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读接入、库解析及大小/错误处理有源码支持；真实宿主、远程权限和问答质量未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-molio/README.md、packages/dsh-plugin-molio/src/index.ts、packages/dsh-plugin-molio/src/tools/kb-read.ts、packages/dsh-plugin-molio/src/vault-resolver.ts、packages/dsh-plugin-molio/src/daemon-client.ts、apps/daemon/src/routes/knowledge.ts、apps/daemon/src/core/knowledge.ts、packages/dsh-plugin-molio/src/read-service.ts、apps/daemon/src/server.ts 及固定范围 inventory；组件：packages/dsh-plugin-molio。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查目标组件注册/HTTP/库解析/读取工具，并定向读同仓daemon文件路由和磁盘读取；未全面审计Molio平台或远程部署。
- 下一步：同模型同资料任务比较显式库id与默认库，注入切库、重名、过大文件和取消，记录错库引用、人工核对和全部token。

**分析版本**

- **仓库**：[zhuzhaoyun/Molio](https://github.com/zhuzhaoyun/Molio)
- **版本号**：0.1.0（[固定提交 c1b90f0](https://github.com/zhuzhaoyun/Molio/tree/c1b90f05d876953889ff99303697d896e0c84ed9)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导一轮检索绑定明确库id的未验证策略，对照切库/同名库的错库率与核对成本；无改善则推翻。

同模型同资料任务比较显式库id与默认库，注入切库、重名、过大文件和取消，记录错库引用、人工核对和全部token。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 502 |
| .ts | source | 11 | 579 | 448 | 88 | — |
| .ts | test | 3 | 490 | 421 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/zhuzhaoyun/Molio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/zhuzhaoyun/Molio/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhuzhaoyun/Molio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：只读知识库接入能否保持目标库、原文和失败边界可解释？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用它，真实注册能力是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向已建Molio知识库、希望在DSH研究/写作时按原文回答的人。真实类型plugin；apply等待tools服务后建立DaemonClient并注册状态、列库、文件树、搜索、读取五个工具。合格任务是指定知识库命中资料、读到原文并能核对出处，而非模型仅凭摘要给出看似正确的答案。基线是用户在Molio里搜索后复制到DSH，增量在只读检索接线。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-molio/README.md:3-11](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/README.md#L3-L11)

作者描述任务和前提

```text
让 [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/dsh) 直接读取你的 [Molio](https://github.com/zhuzhaoyun/Molio) 本地知识库：在 dsh 对话中列出知识库、浏览文件树、全文搜索、读取原文，AI 基于你的积累做研究、写作与问答。

全部工具**只读**——插件不会修改你的知识库。

## 前置条件

1. Molio 桌面端（或 Docker/NAS 部署）已启动，其本地 daemon 默认监听 `http://127.0.0.1:3100`
2. Molio 中已创建至少一个知识库（vault）
3. dsh `>= 0.2.0-rc.2`
```

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/index.ts:21-35](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/index.ts#L21-L35)

真实五工具注册

<details>
<summary>查看原文（15行）</summary>

```text
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从读取工具到原文的链路是什么？

**研究主题**：贡献与相对优势、工程质量与复用

#### 完整回答

kb-read将vaultId/path/force及取消信号交给readVaultFile。resolveVault优先精确id，再名称，重名报错；省略则查询当前active vault。client向GET文件端点请求，daemon按vault解析相对路径，执行路径边界和realpath检查、大小策略、编码检测后readFileSync返回原文。业务读取/防护来自Molio daemon，插件移植CLI语义并把结果转成宿主工具，不能把上游检索或路径安全原创归子包。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-read.ts:29-50](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/tools/kb-read.ts#L29-L50)

工具→读取服务→结构化返回

<details>
<summary>查看原文（22行）</summary>

```text
      timeoutMs: 20_000,
      isConcurrencySafe: () => true,
      output: {
        schema: { type: 'json' },
        render: (_args, value) => renderJson(value),
      },
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/vault-resolver.ts:21-49](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/vault-resolver.ts#L21-L49)

库选择规则

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

**依据 3 · 源码核查**：[packages/dsh-plugin-molio/src/daemon-client.ts:128-138](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/daemon-client.ts#L128-L138)

GET文件请求

<details>
<summary>查看原文（11行）</summary>

```text
  readFile(
    vaultId: string,
    relPath: string,
    force = false,
    signal?: AbortSignal,
  ): Promise<FileContent> {
    const query = force ? '?force=1' : '';
    return this.request<FileContent>(
      `/api/knowledge/vaults/${encodeURIComponent(vaultId)}/files/${encodeURIComponent(relPath)}${query}`,
      { signal },
    );
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/routes/knowledge.ts:227-250](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/routes/knowledge.ts#L227-L250)

daemon端点→readFile及大小错误

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/core/knowledge.ts:192-231](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/core/knowledge.ts#L192-L231)

路径、大小、编码和真实磁盘读取

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读是否解决了资料隔离、上下文漂移和所有失败？

**研究主题**：缺陷与关键质疑

#### 完整回答

插件接口只读，不能据此承诺整个daemon只读或远程安全。daemon共享源码说明无认证，库路径边界是主要防护；环境变量允许改为远程URL，插件fetch本身未附认证，不能把远程配置支持当安全部署已验证。省略vaultId依赖实时active vault，用户切库会改变默认目标；跨工具多次调用不是固定快照。过大文件报错或tooLarge后提示force，二进制返回说明；读到原文仍不证明模型引用正确。client在没有调用方signal时用默认超时，有signal则以它为准，读取工具另声明20秒上限。 实际server把CORS中间件与knowledgeRoutes接上，允许http localhost/127.0.0.1来源；在该知识库路由挂载前未见凭据认证中间件。云端AuthClient登录对象的存在不能等同本地知识库HTTP已鉴权，也不能把CORS当身份认证。 文件树扫描对readdir后消失/无法stat的单文件选择跳过，避免整树失败；若整树扫描抛错，路由限频记录警告并返回500。此降级保留了可用性，却不提供树与后续读取的同一时刻快照，不能把列树成功当所有条目都已读。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-molio/src/daemon-client.ts:38-41](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/daemon-client.ts#L38-L41)

远程URL覆盖

```text
export function defaultBaseUrl(): string {
  const explicit = process.env['MOLIO_DAEMON_URL'];
  if (explicit && explicit.trim()) return stripTrailingSlash(explicit.trim());
  return `http://127.0.0.1:${process.env['MOLIO_PORT'] ?? 3100}`;
```

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/daemon-client.ts:57-81](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/daemon-client.ts#L57-L81)

请求信号、HTTP错误和JSON返回

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/core/knowledge.ts:490-501](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/core/knowledge.ts#L490-L501)

共享实现说明daemon无认证与路径边界

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-molio/src/vault-resolver.ts:43-49](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/vault-resolver.ts#L43-L49)

默认active vault

```text
  const { vault } = await client.getActiveVault(signal);
  if (!vault) {
    throw new VaultNotFoundError(
      '未指定知识库，且 Molio 当前没有打开的知识库。请在 Molio 中选择一个知识库，或用 vaultId 参数指定',
    );
  }
  return vault;
```

**依据 5 · 源码核查**：[packages/dsh-plugin-molio/src/read-service.ts:23-42](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/read-service.ts#L23-L42)

大小和二进制分支

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-read.ts:29-41](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/tools/kb-read.ts#L29-L41)

工具超时和取消信号

<details>
<summary>查看原文（13行）</summary>

```text
      timeoutMs: 20_000,
      isConcurrencySafe: () => true,
      output: {
        schema: { type: 'json' },
        render: (_args, value) => renderJson(value),
      },
      execute: async (args, exec) =>
        guarded(async () => {
          const result = await readVaultFile(client, {
            vaultArg: args.vaultId,
            relPath: args.path,
            force: args.force,
            signal: exec.signal,
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/server.ts:62-81](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/server.ts#L62-L81)

云端AuthClient与本地CORS是不同对象；CORS仅筛http本地主机来源。

<details>
<summary>查看原文（20行）</summary>

```text
// 云端认证 client（懒读 MOLIO_AUTH_URL，未设置时回落内置官方地址
// DEFAULT_AUTH_URL；显式空白才算未配置 → 登录端点回 503）。
// 启动恢复（restoreSession）由 index.ts 在 listen 之后异步触发，不阻塞启动。
export const authClient = new AuthClient();

export const app = new Hono();

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

**依据 8 · 源码核查**：[apps/daemon/src/server.ts:119-135](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/server.ts#L119-L135)

知识库路由真实挂载；此入口未插入认证中间件，不能靠云端登录名称推出本地保护。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 9 · 源码核查**：[apps/daemon/src/core/knowledge.ts:106-124](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/core/knowledge.ts#L106-L124)

目录枚举后stat失败的单文件会continue，树结果不表示所有候选均存在。

<details>
<summary>查看原文（19行）</summary>

```text
        }
        break;
      }
      const absFile = path.join(absDir, entry.name);
      // readdir 与 stat 之间文件可能已被删/移走（agent 直写、回收站删除、外部
      // 编辑器）：单个文件消失不该让整棵树的请求 500 —— 跳过它即可，下一次扫描
      // 自然收敛。前端刷新失败是静默的，500 会让用户看到一棵不动的旧树。
      let stat: fs.Stats;
      try {
        stat = fs.statSync(absFile);
      } catch {
        continue;
      }
      nodes.push({
        name: entry.name,
        path: relPath,
        type: 'file',
        size: stat.size,
        modifiedAt: stat.mtimeMs,
```

</details>

**依据 10 · 源码核查**：[apps/daemon/src/routes/knowledge.ts:199-208](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/apps/daemon/src/routes/knowledge.ts#L199-L208)

整树失败限频记录并返回500，与单文件跳过不同。

<details>
<summary>查看原文（10行）</summary>

```text
      return c.json({ tree });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to scan vault';
      treeErrorWarn.warn(
        `tree:${vault.id}`,
        `[knowledge] GET /vaults/${vault.id}/tree failed (${vault.path}): ${message}`,
      );
      return c.json({ error: { code: 'INTERNAL', message } }, 500);
    }
  });
```

</details>

#### 缺口

- 真实daemon权限、远程部署隔离及模型引用正确率未验收
  **影响**：不能将只读工具扩展为全链数据安全保证
  **进一步探讨**：独立非敏感库验证指定id、切库、二进制/大文件和取消；远程条件另行审阅

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低负担试用并检验固定库的价值？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

已有本地Molio daemon和库的用户可先显式vaultId检索一篇已知原文，核对返回路径和内容，再让DSH总结；缺daemon先恢复服务而非反复让模型猜测。首次配置profile和daemon地址，持续承担模型读文token与资料维护，失败可回Molio界面/原文件，子插件无写回状态需迁移。由active vault依赖推导未验证假设：一轮检索先绑定明确库id并在结果中重复展示，可减少切库造成的错资料引用。对同名库、切换active库和普通流程比较错库率、人工核对时间与总token；若不减少错库或提示成本超过收益则否定。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-molio/README.md:7-22](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/README.md#L7-L22)

daemon/库/DSH前提与安装

<details>
<summary>查看原文（16行）</summary>

````text
## 前置条件

1. Molio 桌面端（或 Docker/NAS 部署）已启动，其本地 daemon 默认监听 `http://127.0.0.1:3100`
2. Molio 中已创建至少一个知识库（vault）
3. dsh `>= 0.2.0-rc.2`

## 安装

```bash
dsh plugin add dsh-plugin-molio
```

或在 profile 中安装：

```bash
dsh plugin --profile <你的profile> add dsh-plugin-molio
````

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-molio/src/vault-resolver.ts:21-49](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/vault-resolver.ts#L21-L49)

固定id与active目标差异

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

**依据 3 · 源码核查**：[packages/dsh-plugin-molio/src/tools/kb-read.ts:43-50](https://github.com/zhuzhaoyun/Molio/blob/c1b90f05d876953889ff99303697d896e0c84ed9/packages/dsh-plugin-molio/src/tools/kb-read.ts#L43-L50)

结果带明确库信息

```text
          const { vault, file } = result;
          if (result.kind === 'binary') {
            return json({
              kind: 'binary',
              message: `二进制文件（${file.mimeType}，${file.size} 字节），无文本内容。绝对路径: ${vault.path}/${file.path}`,
            });
          }
          return json({ kind: 'text', vault: { id: vault.id, name: vault.name }, file });
```

#### 缺口

- 固定库策略的错库率、节时与总成本未测
  **影响**：不能把接口便利等同知识回答质量提升
  **进一步探讨**：对同任务和资料集比较显式库id与默认库，计入读全文及人工核对

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
