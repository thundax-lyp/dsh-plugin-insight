# dsh-mcp-panel

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d99212a](https://github.com/PerryLink/dsh-mcp-panel/tree/d99212ad191da5f8142a9a254e7460e6bdc343b4)

<!-- BEGIN META -->
[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-mcp-panel) [![npm 30d 9,163](https://img.shields.io/static/v1?label=npm+30d&message=9%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-panel) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-panel)
<!-- END META -->

> **功能**：为官方MCP桥提供配置、诊断、备份写入和宿主管道试调用。

> **亮点**：[Q01](#research-q01) 把配置与可见试调用集中到控制台。

> **主要限制**：[Q02](#research-q02) 语义追加实际全文件写，无并发事务；确认路径分条件。

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
  - [Q01 · 控制台如何管理官方MCP桥并试调用？](#detail-section-11)
  - [Q02 · 所谓追加写入和可恢复有何实际边界？](#detail-section-12)
  - [Q03 · 怎样从只读排障开始而不放大修改风险？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护MCP配置的DSH用户需要图形化排障。

手改YAML并在模型会话试工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态与诊断 | 聚合桥状态和配置 | 状态接口不可用时保留未知 |
| 配置编辑 | 生成操作fragment并备份 | 真实I/O全文件写，并发需核查 |
| 确认与生效 | running Agent走Host审批，其余confirmed；可选Loader验证 | 验证失败可能已经修改 |
| 工具试用 | server归属校验后走execute | 超时不证明远端取消 |
| 配置导出 | 不执行JS表达式的导出接口 | 不可JSON配置需另查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 官方MCP桥与兼容Host | 必需 | 状态和工具执行 | 缺接口不能从配置猜在线 |
| 可写profile与备份目录 | 修改需要 | 生成patch fragment | 无路径/开关关闭拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 只读 | 核对server及状态 | 发现不等于业务成功 |
| 试用 | 只读工具经execute审批 | 超时核查远端 |
| 修改 | 副本审批和verify生效 | 失败先查backup与当前字节 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 匹配官方桥与Loader | 先测试profile |
| 持续 | 人工成本未知 | 维护server、配置与backups | 外部编辑竞争 |
| 失败 | 恢复时间未知 | 停写后合并备份和当前修改 | 验证失败可能已写 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置 | 源码先备份并生成操作fragment | 并发及崩溃安全 |
| 试调用 | 源码经宿主execute | 实际服务效果及超时副作用 |

> **思考**：[Q02](#research-q02) 语义追加实际全文件写，无并发事务；确认路径分条件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把配置与可见试调用集中到控制台。

[Q02](#research-q02) 语义append非原子文件事务，verify不回滚。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 语义追加实际全文件写，无并发事务；确认路径分条件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只读trial和副本写入分开验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对写入与trial主链，外部服务及恢复未跑。

- 已检查：作者 README、包清单、源码路径 README.md、src/service.ts、src/trial.ts、src/write.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定service/write/trial及作者说明，未写profile或执行MCP。
- 下一步：拒绝、并发编辑、Loader失败、恢复及超时。

**分析版本**

- **仓库**：[PerryLink/dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)
- **版本号**：0.6.30（[固定提交 d99212a](https://github.com/PerryLink/dsh-mcp-panel/tree/d99212ad191da5f8142a9a254e7460e6bdc343b4)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照手改配置的错误和恢复工时。

拒绝、并发编辑、Loader失败、恢复及超时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3304 | — | — | 35329 |
| .mjs | source | 10 | 687 | 453 | 176 | — |
| .ts | source | 24 | 5765 | 3981 | 1494 | — |
| .tsx | source | 3 | 946 | 842 | 54 | — |
| .ts | test | 19 | 2700 | 2214 | 270 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/PerryLink/dsh-mcp-panel/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否在DSH内看清MCP状态并可控修改及试调用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 控制台如何管理官方MCP桥并试调用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件不是另一套MCP客户端，主要读取官方桥状态及配置，提供设置页和命令。callTool解码JSON并验证结构，trial还检查工具在所选server命名空间、已注册；共享resource工具自动加server且拒绝冲突字段。实际调用通过ctx.tools.execute的一条batch，带可选活动Agent和AbortSignal.timeout，结果只返回面板而不进入模型上下文。因而可静态确认工具仍经宿主pre-execute、审批和guard，不是直接调用MCP传输。相对手改YAML或让模型试工具，控制台可让操作者看见请求和结果；但发现工具、桥在线和一次业务成功要分别验收，状态缺失时不能据配置行称连接成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-11](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/README.md#L9-L11)

桥与控制台分工。

```text
**The MCP management console for the official DeepSeek Harness MCP client — add, edit, remove, and trial-call MCP servers from a settings page, with honest status, health diagnostics, and safe, reversible profile writes.**

*Official client = bridge, this plugin = console: read status through the `mcp/status` seam, write only append-only, approval-gated profile patches.*
```

**依据 2 · 源码核查**：[src/service.ts:477-495](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/service.ts#L477-L495)

trial入口。

<details>
<summary>查看原文（19行）</summary>

```text
  async callTool(requestJson: string, sessionId: string | undefined): Promise<McpTrialResultWire> {
    if (!this.config.trialEnabled) {
      throw new Error('dsh-mcp-panel: the tool trial console is disabled (config.trialEnabled: false)')
    }
    let request: unknown
    try {
      request = JSON.parse(requestJson)
    } catch {
      throw new Error('dsh-mcp-panel: requestJson is not valid JSON')
    }
    const problem = validateTrialRequest(request)
    if (problem !== null) throw new Error(`dsh-mcp-panel: ${problem}`)
    return this.trialCaller.runTrialCall(
      this.ctx.tools,
      agentsOf(this.ctx),
      sessionId,
      request as McpTrialRequest,
      { timeoutMs: this.config.trialTimeoutMs, maxResultChars: this.config.trialMaxResultChars },
    )
```

</details>

**依据 3 · 源码核查**：[src/trial.ts:124-161](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/trial.ts#L124-L161)

server/tool校验和官方执行。

<details>
<summary>查看原文（38行）</summary>

```text
      try {
        argumentsValue = JSON.parse(request.argsJson)
      } catch {
        throw new Error('argsJson is not valid JSON')
      }
      if (RESOURCE_TOOL_SET.has(toolName)) {
        // Shared resource tools take `{ server, … }` outside the mcp__*
        // namespace; the console injects the requested server and refuses a
        // conflicting explicit one (fail closed).
        if (typeof argumentsValue !== 'object' || argumentsValue === null || Array.isArray(argumentsValue)) {
          throw new Error(`resource tool "${toolName}" expects a JSON object argument (\`{}\` is valid)`)
        }
        const explicit = (argumentsValue as Record<string, unknown>)['server']
        if (explicit !== undefined && explicit !== serverName) {
          throw new Error(`resource tool "${toolName}" was called with server "${String(explicit)}" but the console targets "${serverName}"`)
        }
        argumentsValue = { server: serverName, ...argumentsValue as Record<string, unknown> }
      } else if (!toolName.startsWith(prefix)) {
        throw new Error(`tool "${toolName}" does not belong to server "${serverName}" (expected the ${prefix}… namespace)`)
      }
      if (tools.get(toolName) === undefined) {
        throw new Error(`tool "${toolName}" is not registered — the server may be down or its sync failed`)
      }
      const agent = sessionId === undefined || sessionId === '' ? undefined : agents?.get(sessionId)
      // 0.2.2: execute() takes a whole batch; one call per trial.
      const callId = `${TRIAL_CALL_PREFIX}-${++trialCounter}` as unknown as ToolBatchInput['calls'][number]['id']
      const started = Date.now()
      const execution: ToolBatchInput = {
        calls: [{ type: 'tool-call', id: callId, name: toolName, arguments: JSON.stringify(argumentsValue) }],
        ...agent === undefined ? {} : { agent: agent as NonNullable<ToolBatchInput['agent']> },
        signal: AbortSignal.timeout(limits.timeoutMs),
      }
      const batch = await tools.execute(execution)
      const result = batch.results[0]?.result
      if (result === undefined) throw new Error(`the tool executor settled no result for "${toolName}"`)
      const durationMs = Date.now() - started
      const { json, truncated } = projectTrialResult(result, limits.maxResultChars)
      return { callId: String(callId), isError: result.isError, truncated, durationMs, resultJson: json }
```

</details>

#### 缺口

- 真实MCP状态接口与业务调用未运行
  **影响**：不能证明当前外部服务可用
  **进一步探讨**：隔离只读server核对配置、状态、工具及结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 所谓追加写入和可恢复有何实际边界？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

writePatch先检查writeEnabled、patchFile和操作解析。若当前有running Agent及approval服务，则仅allowed-once继续，拒绝/取消/无通道均报错；没有这个条件时改为confirmed===true的交互确认。这是可信控制台的确认参数，不是绑定人类消息的令牌，部署授权需另外检查。appendPatchFragment先复制现有文件为时间戳备份，再appendFragment；后者实际read全文件、拼fragment、writeFile全量替换并readback includes，所以“append-only”指YAML操作语义，不是O_APPEND或原子rename。并发外部编辑可丢更新，崩溃可留部分文件，includes也不验证完整base。随后可选verifyWrite等Loader生效才报告成功，失败保留backup，但配置已修改，不能认定没有写。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:407-446](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/service.ts#L407-L446)

写开关与两类确认。

<details>
<summary>查看原文（40行）</summary>

```text
  async writePatch(opJson: string, confirmed: boolean, sessionId: string | undefined): Promise<PatchWriteResult> {
    if (!this.config.writeEnabled) {
      throw new Error('dsh-mcp-panel: profile writes are disabled (config.writeEnabled: false) — flip the kill switch or edit the file by hand')
    }
    const file = this.patchFile()
    if (file === null) {
      throw new Error('dsh-mcp-panel: the profile patch path is unknown (no ctx.baseUrl) — cannot write')
    }
    const resolution = this.resolveOp(opJson)
    if (!resolution.ok) throw this.issueError(resolution)
    const fragment = renderPatchFragment(resolution.op)

    const approval = this.ctx.get('approval') as ApprovalSeamFace | undefined
    const agents = this.ctx.get('agents') as McpAgentRegistryFace | undefined
    const agent = sessionId === undefined || sessionId === '' ? undefined : agents?.get(sessionId)
    let approvalPath: PatchWriteResult['approvalPath'] | null = null
    if (approval !== undefined && agent !== undefined && isAgentRunning(agent)) {
      const outcome = await approval.request({
        agent,
        toolName: 'mcp-panel/writePatch',
        reason: `append a dsh-mcp-panel operation (${resolution.op.kind}) to the profile patch layer`,
      })
      if (outcome === ALLOWED_ONCE) {
        approvalPath = 'harness-approval'
      } else if (outcome === 'rejected') {
        throw new Error('dsh-mcp-panel: the profile write was rejected')
      } else if (outcome === 'cancelled') {
        throw new Error('dsh-mcp-panel: approval for the profile write was cancelled')
      } else {
        throw new Error('dsh-mcp-panel: no approval channel is available for the profile write')
      }
    }
    if (approvalPath === null) {
      if (confirmed !== true) {
        throw new Error('dsh-mcp-panel: the profile write needs confirmation — review the fragment and confirm in the console')
      }
      approvalPath = 'interactive-confirmation'
    }

    const { backupPath, bytes } = await appendPatchFragment(file, fragment, this.config.backupCount)
```

</details>

**依据 2 · 源码核查**：[src/write.ts:37-61](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/write.ts#L37-L61)

备份先行。

<details>
<summary>查看原文（25行）</summary>

```text
export async function appendPatchFragment(
  filePath: string,
  fragment: string,
  backupCount: number,
): Promise<{ readonly backupPath: string; readonly bytes: number }> {
  let existing = true
  try {
    await readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error
    existing = false
  }

  if (existing) {
    const backupPath = `${filePath}${BACKUP_SUFFIX}${Date.now()}`
    await copyFile(filePath, backupPath)
    const bytes = await appendFragment(filePath, fragment)
    await pruneBackups(filePath, backupCount)
    return { backupPath, bytes }
  }

  await writeFile(filePath, FRESH_FILE_HEADER, 'utf8')
  const backupPath = `${filePath}${BACKUP_SUFFIX}${Date.now()}`
  const bytes = await appendFragment(filePath, fragment)
  await pruneBackups(filePath, backupCount)
```

</details>

**依据 3 · 源码核查**：[src/write.ts:85-97](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/write.ts#L85-L97)

全文件写与readback。

<details>
<summary>查看原文（13行）</summary>

```text
async function appendFragment(filePath: string, fragment: string): Promise<number> {
  const content = await readFile(filePath, 'utf8')
  const base = stripEmptyRootList(content)
  const normalized = base.endsWith('\n') ? base : `${base}\n`
  const block = normalized.endsWith('\n\n') || normalized === '' ? `${fragment}\n` : `\n${fragment}\n`
  await writeFile(filePath, `${normalized}${block}`, 'utf8')
  // Readback: the appended block must survive exactly as written — a partial
  // write would otherwise surface as a "written" success (issue #27 hardening).
  const after = await readFile(filePath, 'utf8')
  if (!after.includes(fragment)) {
    throw new Error('dsh-mcp-panel: the appended patch fragment could not be read back — the write is suspect; inspect the file before retrying')
  }
  return Buffer.byteLength(block, 'utf8')
```

</details>

**依据 4 · 源码核查**：[src/service.ts:453-462](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/service.ts#L453-L462)

生效验证与返回。

<details>
<summary>查看原文（10行）</summary>

```text
    if (this.config.writeVerifyEnabled) {
      await this.verifyWrite(resolution.op)
    }
    return {
      file,
      backupPath,
      approvalPath,
      bytes,
      ops: 1,
      note: 'The web surface hot-reloads cordis.patch.yml edits; other surfaces restart.',
```

</details>

#### 缺口

- 未跑并发编辑、断电与Loader失败
  **影响**：配置安全和回退成本未知
  **进一步探讨**：副本中审批拒绝、写后验证失败和外部并发，再比较完整字节

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样从只读排障开始而不放大修改风险？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

测试profile先只读看配置和状态，选受控只读MCP工具，确认完整工具名、server和JSON参数，经宿主审批后得到可核对结果。超时需要检查服务端是否已执行，不能直接重试有副作用工具。写配置在副本做新增/编辑/停用，要求预览fragment准确、拒绝时文件字节不变；批准后Loader确实生效，验证失败明确已写入并给backup。恢复时先停相关写入，比较当前文件与备份，把外部并发改动人工合并，而非盲复制旧文件。对照手改YAML的配置错误和诊断时间；若不能降低错误或需频繁修并发丢更新，就推翻便利假设并回手工配置。禁用控制台不自动移除它创建的MCP行，退出仍须核对profile。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:407-446](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/service.ts#L407-L446)

拒绝无写的判据。

<details>
<summary>查看原文（40行）</summary>

```text
  async writePatch(opJson: string, confirmed: boolean, sessionId: string | undefined): Promise<PatchWriteResult> {
    if (!this.config.writeEnabled) {
      throw new Error('dsh-mcp-panel: profile writes are disabled (config.writeEnabled: false) — flip the kill switch or edit the file by hand')
    }
    const file = this.patchFile()
    if (file === null) {
      throw new Error('dsh-mcp-panel: the profile patch path is unknown (no ctx.baseUrl) — cannot write')
    }
    const resolution = this.resolveOp(opJson)
    if (!resolution.ok) throw this.issueError(resolution)
    const fragment = renderPatchFragment(resolution.op)

    const approval = this.ctx.get('approval') as ApprovalSeamFace | undefined
    const agents = this.ctx.get('agents') as McpAgentRegistryFace | undefined
    const agent = sessionId === undefined || sessionId === '' ? undefined : agents?.get(sessionId)
    let approvalPath: PatchWriteResult['approvalPath'] | null = null
    if (approval !== undefined && agent !== undefined && isAgentRunning(agent)) {
      const outcome = await approval.request({
        agent,
        toolName: 'mcp-panel/writePatch',
        reason: `append a dsh-mcp-panel operation (${resolution.op.kind}) to the profile patch layer`,
      })
      if (outcome === ALLOWED_ONCE) {
        approvalPath = 'harness-approval'
      } else if (outcome === 'rejected') {
        throw new Error('dsh-mcp-panel: the profile write was rejected')
      } else if (outcome === 'cancelled') {
        throw new Error('dsh-mcp-panel: approval for the profile write was cancelled')
      } else {
        throw new Error('dsh-mcp-panel: no approval channel is available for the profile write')
      }
    }
    if (approvalPath === null) {
      if (confirmed !== true) {
        throw new Error('dsh-mcp-panel: the profile write needs confirmation — review the fragment and confirm in the console')
      }
      approvalPath = 'interactive-confirmation'
    }

    const { backupPath, bytes } = await appendPatchFragment(file, fragment, this.config.backupCount)
```

</details>

**依据 2 · 源码核查**：[src/write.ts:37-61](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/write.ts#L37-L61)

恢复原件位置。

<details>
<summary>查看原文（25行）</summary>

```text
export async function appendPatchFragment(
  filePath: string,
  fragment: string,
  backupCount: number,
): Promise<{ readonly backupPath: string; readonly bytes: number }> {
  let existing = true
  try {
    await readFile(filePath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException | null)?.code !== 'ENOENT') throw error
    existing = false
  }

  if (existing) {
    const backupPath = `${filePath}${BACKUP_SUFFIX}${Date.now()}`
    await copyFile(filePath, backupPath)
    const bytes = await appendFragment(filePath, fragment)
    await pruneBackups(filePath, backupCount)
    return { backupPath, bytes }
  }

  await writeFile(filePath, FRESH_FILE_HEADER, 'utf8')
  const backupPath = `${filePath}${BACKUP_SUFFIX}${Date.now()}`
  const bytes = await appendFragment(filePath, fragment)
  await pruneBackups(filePath, backupCount)
```

</details>

**依据 3 · 源码核查**：[src/trial.ts:147-161](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/src/trial.ts#L147-L161)

执行和超时。

<details>
<summary>查看原文（15行）</summary>

```text
      const agent = sessionId === undefined || sessionId === '' ? undefined : agents?.get(sessionId)
      // 0.2.2: execute() takes a whole batch; one call per trial.
      const callId = `${TRIAL_CALL_PREFIX}-${++trialCounter}` as unknown as ToolBatchInput['calls'][number]['id']
      const started = Date.now()
      const execution: ToolBatchInput = {
        calls: [{ type: 'tool-call', id: callId, name: toolName, arguments: JSON.stringify(argumentsValue) }],
        ...agent === undefined ? {} : { agent: agent as NonNullable<ToolBatchInput['agent']> },
        signal: AbortSignal.timeout(limits.timeoutMs),
      }
      const batch = await tools.execute(execution)
      const result = batch.results[0]?.result
      if (result === undefined) throw new Error(`the tool executor settled no result for "${toolName}"`)
      const durationMs = Date.now() - started
      const { json, truncated } = projectTrialResult(result, limits.maxResultChars)
      return { callId: String(callId), isError: result.isError, truncated, durationMs, resultJson: json }
```

</details>

**依据 4 · 作者声明**：[README.md:39-44](https://github.com/PerryLink/dsh-mcp-panel/blob/d99212ad191da5f8142a9a254e7460e6bdc343b4/README.md#L39-L44)

安装卸载范围。

```text
## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add github:PerryLink/dsh-mcp-panel` — the `prepare` script builds with production dependencies only.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-mcp-panel`.
- **tarball channel**: `pnpm pack` in this repo, then `dsh plugin --profile web add ./dsh-mcp-panel-<version>.tgz`.
- **uninstall**: remove the `mcp-panel` row from `cordis.patch.yml` (the web surface hot-reloads it), delete the package from the profile's `node_modules`, and verify with `dsh web --dump-config` that no `mcp-panel` row remains.
```

#### 缺口

- 配置恢复和排障节时未实测
  **影响**：不能保证回退完整或服务副作用可撤回
  **进一步探讨**：固定profile与只读server做全部失败对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
