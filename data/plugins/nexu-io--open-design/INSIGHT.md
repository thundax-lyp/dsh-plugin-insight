# OpenDesign

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[12d970e](https://github.com/nexu-io/open-design/tree/12d970eacc8971150e3c76470d2a9afe16dc2ed1)

<!-- BEGIN META -->
[![GitHub ★ 105,115](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=105%2C115&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nexu-io/open-design)
<!-- END META -->

> **功能**：将编码 Agent、设计系统、原型预览与团队反馈组织在同一设计工作区。

> **亮点**：将 DSH 适配、制品写入和评论队列组织到设计项目，提供会话身份、manifest 和 revision 确认等明确接缝；它们支持追踪，不证明设计正确或远端已落地。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

> **主要限制**：max-tokens 也映射 completed，正文与 manifest 分次写；单条 Vela 返回缺 seq 时回落 0 后仍会被队列确认。协议、文件和远端回执均不能代替设计合格和云端读回。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 它是什么，适合谁，相比手动交接增加什么？](#detail-section-11)
  - [Q02 · DSH 运行从配置到终态和取消如何接线？](#detail-section-12)
  - [Q03 · 本地制品如何写入，哪些检查不足以表示设计合格？](#detail-section-13)
  - [Q04 · 评论何时进入队列，远端确认意味着什么？](#detail-section-14)
  - [Q05 · 使用与恢复需要什么，哪些成本未知？](#detail-section-15)
  - [Q06 · 哪些接缝可借鉴，下一步应如何证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从 brief 生成并迭代原型的设计开发者与团队，可在项目中使用编码 Agent 和查看反馈；实际协作收益尚无同条件对照。[Q01](#research-q01)

手工使用编辑器、独立预览及通信工具交接是参照；该应用将多个操作纳入项目，但仍需维护外部 Agent 与人工验收。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH 会话适配 | 调用外部 DSH 并接收事件 | 匹配 profile 与 companion；完成状态含 max-tokens |
| 项目制品 | 写入带 manifest 的设计文件 | 部分内容检查，正文和 manifest 分次写 |
| 评论 relay | 将符合条件的评论异步推送 | 需身份与远端服务，单条回执需独立核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 24、指定 pnpm 与应用成品 | 源码运行需要 | 启动本地工作区 | 未满足时不能假定可运行 |
| 匹配的 DSH CLI、profile 和 companion | DSH 运行需要 | 执行会话 | 版本或服务不符需停止并核查 |
| 模型、凭据和项目写权限 | 对应任务需要 | 生成与保存 | 可用性和费用随配置变化 |
| 工作区身份与远端服务 | 团队 relay 需要 | 推送反馈 | 不可用时需核对队列与远端 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在隔离副本中确认 Agent、模型和权限 | 条件未知时不运行 |
| 执行 | 用户提交 brief，Agent 生成制品 | 检查终态和 stop reason，截断不视为合格 |
| 验收 | 用户查看文件、manifest 与预览 | 不一致则停止并人工恢复 |
| 协作 | 用户发送反馈并回读远端 | 回执不明时检查队列和远端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装、模型和存储费用未知 | 配置 Agent、设计系统及权限 | 版本兼容未实测 |
| 持续使用 | 模型与网络成本依实际用量 | 设计审阅和反馈时间未知 | 不计算未测节时 |
| 失败恢复 | 重试和远端对账资源未知 | 核对半写文件、队列与回执 | 取消不撤销已有副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| DSH 运行 | profile 会话、事件和终态接线 | 固定宿主实际兼容与设计合格 |
| 制品写入 | manifest 和部分内容检查 | 写入原子性及视觉质量 |
| 评论协作 | 本地事务和 revision 确认 | 远端落地及反馈已处理 |

> **思考**：max-tokens 也映射 completed，正文与 manifest 分次写；单条 Vela 返回缺 seq 时回落 0 后仍会被队列确认。协议、文件和远端回执均不能代替设计合格和云端读回。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将 DSH 适配、制品写入和评论队列组织到设计项目，提供会话身份、manifest 和 revision 确认等明确接缝；它们支持追踪，不证明设计正确或远端已落地。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

会话过滤、终态检查、manifest 与 revision 条件确认分别维护不同边界；单条回执回落和分次写入表明不能把它们合并成端到端完成保证。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

max-tokens 也映射 completed，正文与 manifest 分次写；单条 Vela 返回缺 seq 时回落 0 后仍会被队列确认。协议、文件和远端回执均不能代替设计合格和云端读回。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有编码 Agent 和设计经验者先在隔离账户的非敏感项目副本中试一项本地原型；截断、文件不一致或回执不明时停下并人工核对。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有机制基于固定版本代表路径源码；真实宿主、云端与设计效果未验证，未来设计为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、apps/daemon/src/runtimes/defs/deepseek-harness.ts、apps/daemon/src/artifacts/create.ts、apps/daemon/src/server.ts、packages/dsh-runtime/src/index.ts、apps/daemon/src/routes/project/index.ts、apps/daemon/src/projects.ts、apps/web/src/components/DesignFilesPanel.tsx、apps/daemon/src/routes/project/comments.ts、apps/daemon/src/collab/collab-cloud-service.ts、apps/daemon/src/collab/vela-cli-collab-client.ts、apps/daemon/src/agent-protocol/dsh-profile/session.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本抽读 DSH profile/companion、项目制品写入、代表 iframe 及评论单条 relay；不覆盖全部 7847 个文件、其他 Agent、所有云客户端、桌面和发布服务，未运行目标。
- 下一步：隔离账户中使用匹配 DSH 及已知模型，在非敏感项目上分别核对截断、取消、正文/manifest、空回执和远端读回，再人工验收设计。

**分析版本**

- **仓库**：[nexu-io/open-design](https://github.com/nexu-io/open-design)
- **版本号**：0.25.1（[固定提交 12d970e](https://github.com/nexu-io/open-design/tree/12d970eacc8971150e3c76470d2a9afe16dc2ed1)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：验证单条评论回执并提供远端读回，再将反馈关联具体制品版本及人工验收，可能减少遗漏；需与原流程加清单对比错误确认、遗漏及总时间，若额外负担抵消收益则否定。[Q06](#research-q06)

隔离账户中使用匹配 DSH 及已知模型，在非敏感项目上分别核对截断、取消、正文/manifest、空回执和远端读回，再人工验收设计。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2081 | 344629 | — | — | 3082638 |
| .ts | source | 1930 | 705972 | 578933 | 94033 | — |
| .ts | test | 2187 | 621476 | 524752 | 49590 | — |
| .mjs | source | 78 | 13134 | 10301 | 1937 | — |
| .md | example | 295 | 32744 | — | — | 244619 |
| .ts | example | 16 | 1005 | 850 | 81 | — |
| .mjs | example | 3 | 1074 | 761 | 276 | — |
| .cts | source | 1 | 409 | 342 | 31 | — |
| .tsx | source | 306 | 216333 | 175378 | 33830 | — |
| .js | source | 39 | 13023 | 10637 | 1580 | — |
| .tsx | test | 864 | 308353 | 252688 | 29411 | — |
| .js | example | 26 | 7803 | 5932 | 1096 | — |
| .jsx | source | 6 | 99 | 90 | 0 | — |
| .md | test | 13 | 1248 | — | — | 7154 |
| .cjs | source | 2 | 1266 | 1112 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 569](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=569&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 164](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=164&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 139](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=139&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查独立设计工作区接入 DSH、生成本地制品和处理反馈的实现与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么，适合谁，相比手动交接增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

OpenDesign 是独立设计工作区客户端与本地服务，不是 DSH 插件。作者面向从需求简报创建原型、共享反馈并用编码 Agent 修改的团队；它提供项目、预览和 Agent 接口。相对手工在编辑器、预览和通信工具之间搬运文件，源码中有 DSH 适配器、项目文件写入与评论传输的明确接线，可形成同项目交接；这不证明用户能更快交付合格设计。作者展示的多种模型、平台与云功能均不等于本次实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-30](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/README.md#L26-L30)

作者描述设计工作区和需求到反馈的流程。

```text
---

## What is OpenDesign

OpenDesign is **the 1st collaborative AI design agent workspace**. Start with a brief, then use your coding agent or OpenDesign Cloud to create a prototype that follows your design system. Share it with your team for feedback, and let your agent refine it in the same project.
```

**依据 2 · 源码核查**：[package.json:1-11](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/package.json#L1-L11)

根项目是独立 private 应用并提供 od CLI。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "open-design",
  "version": "0.25.1",
  "private": true,
  "packageManager": "pnpm@10.33.2",
  "type": "module",
  "description": "Local-first design product: detects your installed code-agent CLI, runs design skills + design systems, streams artifacts into a sandboxed preview.",
  "license": "Apache-2.0",
  "bin": {
    "od": "./apps/daemon/bin/od.mjs"
  },
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:50-54](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L50-L54)

DSH 是应用选择的外部 Agent。

```text
export const deepseekHarnessAgentDef = {
  id: 'deepseek-harness',
  name: 'DeepSeek Harness',
  bin: 'dsh',
  versionArgs: ['--version'],
```

**依据 4 · 源码核查**：[apps/daemon/src/artifacts/create.ts:69-84](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/artifacts/create.ts#L69-L84)

制品写入通过项目文件操作。

<details>
<summary>查看原文（16行）</summary>

```text
export async function createProjectArtifactFile(options: CreateProjectArtifactOptions): Promise<unknown> {
  const { input } = options;
  const body = input.encoding === 'base64'
    ? Buffer.from(input.content, 'base64')
    : Buffer.from(input.content, 'utf8');
  return await options.writeProjectFile(
    options.projectsRoot,
    options.projectId,
    input.name,
    body,
    {
      overwrite: false,
      artifactManifest: resolveCreateArtifactManifest(input),
    },
    options.metadata,
  );
```

</details>

#### 缺口

- 缺少同任务同团队的交付质量和人工时间对照
  **影响**：不能确认效率或协作收益
  **进一步探讨**：固定 brief、设计系统和验收标准，对比手动流程与该应用的净时间及返工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 运行从配置到终态和取消如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

daemon 的 DSH 定义选择 dsh 命令、open-design profile 和 stdio 流，实际服务按该流格式接入会话处理器。companion 创建或恢复 Agent session，按 session ID 与序号过滤事件，提交用户消息，等待空闲并 flush 后输出结果；取消指令传到对应请求的 Agent。恢复失败返回明确错误。重要边界是 max-tokens 被映射为 completed，同时保留 stop_reason；调用成功或进程空闲并不表示设计完整，取消也不证明已写文件和外部动作回滚。版本策略仅接受声明的 0.1 线范围，不能推断任意新的 DSH 版本可用。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:50-54](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L50-L54)

声明 DSH 可执行文件和 Agent 身份。

```text
export const deepseekHarnessAgentDef = {
  id: 'deepseek-harness',
  name: 'DeepSeek Harness',
  bin: 'dsh',
  versionArgs: ['--version'],
```

**依据 2 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:79-103](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L79-L103)

版本策略、profile 参数和 stdio。

<details>
<summary>查看原文（25行）</summary>

```text
    supportedVersionPattern:
      /^0\.1\.\d+$|^0\.1\.0-rc\.(?:[6-9]|[1-9]\d+)$|^0\.1\.1-rc\.\d+$|^0\.1\.2-rc\.\d+$/u,
    requireVersion: true,
    parse: parseDeepSeekHarnessVersion,
  },
  compatibilityProbe: {
    args: ['--profile', 'open-design', '--probe'],
    timeoutMs: 10_000,
    // rc.6 auto-initializes a missing profile before booting it, so avoid
    // invoking --probe until the user-installed profile already exists.
    preflight: hasOpenDesignProfile,
    parse: (stdout) => parseDshProfileProbeOutput(stdout).plugin_version,
  },
  listModels: {
    args: ['--profile', 'open-design', '--models'],
    parse: parseModels,
    timeoutMs: 10_000,
  },
  fallbackModels: [DEFAULT_MODEL_OPTION],
  buildArgs: () => ['--profile', 'open-design', '--stdio'],
  promptViaStdin: true,
  streamFormat: 'dsh-profile-jsonl',
  resumesSessionViaProfileStdio: true,
  capturesSessionIdFromStream: true,
  supportsCustomModel: false,
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/server.ts:16760-16775](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/server.ts#L16760-L16775)

实际运行按 DSH 流格式连接处理器。

<details>
<summary>查看原文（16行）</summary>

```text
    } else if (def.streamFormat === 'dsh-profile-jsonl') {
      trackingSubstantiveOutput = true;
      acpSession = attachDshProfileSession({
        child,
        requestId: run.id,
        prompt: composed,
        cwd: effectiveCwd,
        model: safeModel,
        reasoningEffort: safeReasoning,
        ...(agentResumeCtx.isResuming && agentResumeCtx.resumeSessionId
          ? { resumeSessionId: agentResumeCtx.resumeSessionId }
          : {}),
        onReady: () => noteCliReadyAt(),
        onSession: () => noteSessionInitDoneAt(),
        onComplete: () => clearFirstOutputWatchdog(),
        send: (event, data) => {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-runtime/src/index.ts:82-85](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/packages/dsh-runtime/src/index.ts#L82-L85)

completed 与 max-tokens 映射为相同状态。

```text
function resultStatus(reason: TurnEndReason | undefined): 'completed' | 'cancelled' | 'failed' {
  if (reason?.kind === 'completed' || reason?.kind === 'max-tokens') return 'completed';
  if (reason?.kind === 'aborted') return 'cancelled';
  return 'failed';
```

**依据 5 · 源码核查**：[packages/dsh-runtime/src/index.ts:268-296](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/packages/dsh-runtime/src/index.ts#L268-L296)

会话身份、事件过滤和创建/恢复。

<details>
<summary>查看原文（29行）</summary>

```text
  const sessionId = SessionId(request.resume_session_id ?? `od-${randomUUID()}`);
  let handle: AgentHandle | undefined;
  let firstSeq = Number.POSITIVE_INFINITY;
  let turnEnd: SessionEvent<'turn/end'> | undefined;
  let assistantOutput = '';
  const setup = (agentCtx: Context) => {
    const selected: ModelSelectionRef = { current: selection, assembled: undefined };
    installModelSelection(agentCtx, selected);
  };
  let disposeEvent = () => {};
  const onSessionEvent = (session: { id: unknown }, event: SessionEvent) => {
    if (String(session.id) !== String(sessionId) || event.seq < firstSeq) return;
    emitSessionEvent(output, request, selection.provider, selection.model, event);
    if (event.type === 'assistant/chunk' && event.data.chunk.type === 'text-delta') {
      assistantOutput += event.data.chunk.text;
    }
    if (event.type === 'turn/end') turnEnd = event;
  };

  try {
    try {
      handle = request.resume_session_id
        ? await ctx.agents.resume({ resumeSessionId: sessionId, agentOptions: selection, setup, signal })
        : await ctx.agents.create({
            sessionId,
            meta: { cwd: request.cwd },
            agentOptions: selection,
            setup,
            signal,
```

</details>

**依据 6 · 源码核查**：[packages/dsh-runtime/src/index.ts:319-356](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/packages/dsh-runtime/src/index.ts#L319-L356)

提交消息、flush 和输出终态及原因。

<details>
<summary>查看原文（38行）</summary>

```text
    writeFrame(output, {
      v: 1,
      type: 'session',
      request_id: request.request_id,
      session_id: String(sessionId),
      resumed: Boolean(request.resume_session_id),
    });
    await handle.agent.whenIdle();
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }
    firstSeq = handle.agent.session.seq + 1;
    disposeEvent = ctx.on('session/event', onSessionEvent);
    await handle.agent.followup(createUserMessage({
      content: [{ type: 'text', text: request.prompt }],
      source: { kind: 'user' },
    }));
    await handle.agent.whenIdle();
    await ctx.sessions.flush(handle.agent.session);
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }

    const reason = turnEnd?.data.reason;
    const status = resultStatus(reason);
    const failed = resultError(reason);
    writeFrame(output, {
      v: 1,
      type: 'result',
      request_id: request.request_id,
      status,
      session_id: String(sessionId),
      ...terminalOutput(assistantOutput),
      stop_reason: reason?.kind ?? 'unknown',
      resume_rejected: false,
      ...(failed === undefined ? {} : { error: failed }),
```

</details>

**依据 7 · 源码核查**：[packages/dsh-runtime/src/index.ts:391-419](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/packages/dsh-runtime/src/index.ts#L391-L419)

取消命令接入 Agent 取消。

<details>
<summary>查看原文（29行）</summary>

```text
  const cancellation = createCancellationLatch(() => {
    handle?.agent.cancel({ kind: 'user' });
  });
  await new Promise<void>((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      lines.close();
      input.destroy();
      resolve();
    };
    lines.on('line', (line) => {
      if (line.trim() === '') return;
      let command;
      try {
        command = parseHostCommand(JSON.parse(line) as unknown);
      } catch {
        writeFrame(output, {
          v: 1,
          type: 'protocol_error',
          ...(requestId ? { request_id: requestId } : {}),
          code: 'DSH_PROFILE_INVALID_COMMAND',
          message: 'OpenDesign sent an invalid profile command.',
        });
        return;
      }
      if (command.type === 'cancel') {
        cancellation.cancel(command.request_id);
```

</details>

#### 缺口

- 未实际运行固定版本、目标 DSH 版本和模型
  **影响**：不能证明兼容、流完整或取消后外部副作用消失
  **进一步探讨**：在隔离 profile 验证新会话、恢复失败、截断和取消，并读取项目文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地制品如何写入，哪些检查不足以表示设计合格？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

项目文件路由在 artifact 请求中调用 createProjectArtifactFile，它解码内容、要求或推断并验证 manifest，向写入函数传 overwrite=false。写入函数处理路径并对部分 HTML/演示文稿执行占位符与相对大小检查，随后写正文，再写 manifest；之后才读文件元数据。检查只是有限规则，不能判断设计满足需求或无缺陷；正文与 manifest 分次写，中断或第二次写失败可能留下部分状态，不能宣称事务原子。浏览器中的部分预览使用受限 iframe，但 Agent 所有进程与文件权限由其执行环境决定。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/routes/project/index.ts:7922-7956](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/routes/project/index.ts#L7922-L7956)

路由校验 manifest 并调用制品写入。

<details>
<summary>查看原文（35行）</summary>

```text
        if (artifactManifest !== undefined && artifactManifest !== null) {
          const validated = validateArtifactManifestInput(
            artifactManifest,
            name,
          );
          if (!validated.ok) {
            return sendApiError(
              res,
              400,
              'BAD_REQUEST',
              `invalid artifactManifest: ${validated.error}`,
            );
          }
        }
        const buf =
          encoding === 'base64'
            ? Buffer.from(content, 'base64')
            : Buffer.from(content, 'utf8');
        const writeAndCapture = async (versionLock?: HtmlVersionLock) => {
          const parentVersionId = uploadProject && requestedSource === 'manual' && versionLock
            ? await matchedHtmlParentVersionId(
              uploadProject,
              desiredName,
              requestedParentVersionId,
              versionLock,
            )
            : undefined;
          const meta = artifact === true
            ? await createProjectArtifactFile({
              projectsRoot: PROJECTS_DIR,
              projectId: projectId,
              input: { name, content, encoding, artifactManifest },
              metadata: uploadProject?.metadata,
              writeProjectFile,
            })
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/artifacts/create.ts:55-84](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/artifacts/create.ts#L55-L84)

manifest 解析与禁止覆盖的制品创建。

<details>
<summary>查看原文（30行）</summary>

```text
export function resolveCreateArtifactManifest(input: CreateProjectArtifactInput): unknown {
  const manifest = input.artifactManifest !== undefined && input.artifactManifest !== null
    ? input.artifactManifest
    : inferLegacyManifest(input.name);
  if (manifest) {
    const validated = validateArtifactManifestInput(manifest, input.name);
    if (!validated.ok) {
      throw new ArtifactManifestInvalidError(validated.error);
    }
    return validated.value;
  }
  throw new ArtifactManifestRequiredError(input.name);
}

export async function createProjectArtifactFile(options: CreateProjectArtifactOptions): Promise<unknown> {
  const { input } = options;
  const body = input.encoding === 'base64'
    ? Buffer.from(input.content, 'base64')
    : Buffer.from(input.content, 'utf8');
  return await options.writeProjectFile(
    options.projectsRoot,
    options.projectId,
    input.name,
    body,
    {
      overwrite: false,
      artifactManifest: resolveCreateArtifactManifest(input),
    },
    options.metadata,
  );
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/projects.ts:872-901](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/projects.ts#L872-L901)

路径解析、已有文件和特定内容门。

<details>
<summary>查看原文（30行）</summary>

```text
  assertVisibleForImportedProject(name, metadata);
  const dir = await ensureProject(projectsRoot, projectId, metadata);
  const safeName = sanitizePath(name);
  const target = await resolveSafeReal(dir, safeName);
  body = normalizeArtifactRuntimeImports(safeName, body);
  if (!overwrite) {
    try {
      await stat(target);
      const err = new Error('file already exists');
      err.code = 'EEXIST';
      throw err;
    } catch (err) {
      if (!err || err.code !== 'ENOENT') throw err;
    }
  }
  await mkdir(path.dirname(target), { recursive: true });
  let stubGuardWarning = null;
  let validatedManifest = null;
  if (artifactManifest && typeof artifactManifest === 'object') {
    const validated = validateArtifactManifestInput(artifactManifest, safeName);
    if (validated.ok && validated.value) {
      validatedManifest = validated.value;
      // Publication guard: HTML/deck artifacts that still contain template
      // placeholders (e.g. pitch-deck `Name to confirm`, `$X.XM`) must not
      // land as published files. Runs at the write boundary so it covers
      // every artifact that flows through writeProjectFile, regardless of
      // which agent/atom produced the body. Throws
      // ArtifactPublicationBlockedError which the route layer maps to 422.
      if (isPublicationGuardedArtifactKind(validatedManifest.kind)) {
        assertArtifactPublicationAllowed(body);
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/projects.ts:903-947](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/projects.ts#L903-L947)

部分 stub 检查与正文、manifest 顺序写入。

<details>
<summary>查看原文（45行）</summary>

```text
      const identifier = typeof validatedManifest.metadata?.identifier === 'string'
        ? validatedManifest.metadata.identifier
        : '';
      // Stub-guard applies to HTML-rendered manifest kinds (html, deck).
      // Other kinds (markdown, svg, code-snippet) can legitimately be small
      // and are skipped.
      if (identifier.length > 0 && STUB_GUARDED_MANIFEST_KINDS.has(validatedManifest.kind)) {
        // Scan the directory the new file actually lands in, not the project
        // root — writeProjectFile accepts nested paths like reports/X.html
        // and a root-only scan would miss prior siblings in subdirectories.
        const guard = await evaluateArtifactStubGuard({
          scanDir: path.dirname(target),
          identifier,
          newSize: Buffer.byteLength(body),
          config: readArtifactStubGuardConfigFromEnv(),
        });
        if ((guard.outcome === 'reject' || guard.outcome === 'warn') && guard.warning) {
          // Operator-visible signal regardless of mode, so on-call can see
          // how often the guard fires without combing through 422s.
          console.warn(
            `[stub-guard] ${guard.outcome} identifier=${guard.warning.identifier} ` +
              `newSize=${guard.warning.newSize} priorSize=${guard.warning.priorSize} ` +
              `priorName=${guard.warning.priorName} project=${projectId}`,
          );
        }
        if (guard.outcome === 'reject' && guard.warning) {
          throw new ArtifactRegressionError(guard.warning.message, {
            identifier: guard.warning.identifier,
            newSize: guard.warning.newSize,
            priorSize: guard.warning.priorSize,
            priorName: guard.warning.priorName,
          });
        }
        if (guard.outcome === 'warn' && guard.warning) {
          stubGuardWarning = guard.warning;
        }
      }
    }
  }
  await writeFile(target, body);
  await projectFileWriteTestHooks.afterCommit?.({ safeName, target, body });
  if (validatedManifest) {
    const manifestFileName = artifactManifestNameFor(safeName);
    const manifestTarget = await resolveSafeReal(dir, manifestFileName);
    await writeFile(manifestTarget, JSON.stringify(validatedManifest, null, 2));
```

</details>

**依据 5 · 源码核查**：[apps/web/src/components/DesignFilesPanel.tsx:2217-2225](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/web/src/components/DesignFilesPanel.tsx#L2217-L2225)

此预览 iframe 设置 sandbox；不代表 Agent 的操作系统隔离。

```text
        <FilePreviewPlaceholder file={file} />
      ) : (
        <iframe
          title={file.name}
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-downloads"
          loading="lazy"
          style={{
            width: PAGE_THUMB_LAYOUT_WIDTH,
```

#### 缺口

- 没有真实浏览器、崩溃注入与设计验收
  **影响**：不能证明所有预览安全、写入原子或产物合格
  **进一步探讨**：在隔离副本触发第二次写失败并检查文件，按 brief 人工验收预览。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 评论何时进入队列，远端确认意味着什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

评论路由在符合协作条件时将本地保存与 relay 意图放进同一数据库事务，服务端 callback 调用 enqueue；网络推送在后台进行。outbox 推送前检查记录及发布身份仍有效，单条调用返回后以该 revision 确认，避免飞行期间新修改被旧确认清掉。实际单条 Vela 客户端在 stdout 为空时返回空对象，并在 seq 非数字时回落 0，调用方仍会确认该条记录；严格批量回执解析不能替代这条单项路径。因此这里支持本地提交和重试机制，但不能单凭此 ACK 声称远端确实落地或反馈已由 Agent 处理。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:663-687](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/routes/project/comments.ts#L663-L687)

本地评论与 relay 意图在同一事务。

<details>
<summary>查看原文（25行）</summary>

```text
      const syncEnabled = isLocalTeamRelayCandidate(
        req.params.id,
        body.target?.filePath ?? existing?.filePath ?? '',
        workspaceContext,
        Boolean(ctx.onCommentCreated),
      );
      const targetConversationId = requestedId
        ? existing?.conversationId ?? req.params.cid
        : req.params.cid;
      // Local row + durable relay intent commit atomically. Network delivery is
      // still asynchronous, so a Vela outage never delays this transaction.
      const comment = db.transaction(() => {
        const saved = upsertPreviewComment(db, req.params.id, targetConversationId, body, {
          pinPendingCloudConfirm: syncEnabled,
        });
        updateProject(db, req.params.id, {});
        if (saved && syncEnabled) {
          // SAFETY: the DB normalizer returns the PreviewComment fields consumed by the relay.
          requireRelayEnqueued(ctx.onCommentCreated?.(
            saved as unknown as PreviewComment,
            workspaceContext,
          ));
        }
        return saved;
      })();
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/server.ts:9590-9605](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/server.ts#L9590-L9605)

真实 callback 将评论或修改加入队列。

<details>
<summary>查看原文（16行）</summary>

```text
          onCommentCreated: (comment, context) => {
            if (!context) return;
            const enqueued = collabCloud.enqueueComment(comment, context);
            if (!enqueued) {
              console.warn('[od] refused to enqueue comment without exact Team authority');
            }
            return enqueued;
          },
          onCommentUpdated: (comment, context) => {
            if (!context) return;
            const enqueued = collabCloud.enqueueComment(comment, context);
            if (!enqueued) {
              console.warn('[od] refused to enqueue comment update without exact Team authority');
            }
            return enqueued;
          },
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:759-807](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/collab/collab-cloud-service.ts#L759-L807)

逐条推送和 revision 条件确认。

<details>
<summary>查看原文（49行）</summary>

```text
	async function pushOutboxRecord(
		record: CommentRelayOutboxRecord,
		identity: { teamId: string; memberId: string },
		bindingCurrent?: (record: CommentRelayOutboxRecord) => boolean,
	): Promise<void> {
		try {
			if (deps.commentOutbox?.isCurrent && !deps.commentOutbox.isCurrent(record)) return;
			if (deps.validateCommentRelayFile?.(record) === 'retired') {
				deps.commentOutbox?.acknowledge(record);
				return;
			}
			if (bindingCurrent && !bindingCurrent(record)) {
				deferOutboxRecord(record, new Error("comment relay project binding unsettled; retry"));
				return;
			}
			// Recheck each publication-bound record immediately before network I/O:
			// an earlier record may have awaited while stop/re-publish changed the witness.
			if (
				record.publication &&
				!deps.commentOutbox?.isPublicationCurrent?.(record)
			) {
				deps.commentOutbox?.acknowledge(record);
				return;
			}
			const result = await deps.client.pushComment(
				identity.teamId,
				record.projectId,
				commentRelayPayload(record.publication
					? {
							...record.comment,
							filePath: record.publication.publicFilePath,
							publicationSlug: record.publication.slug,
						}
					: record.comment),
				// Legacy full-content tombstones may already have a lost-ACK receipt.
				// Use a stable new key for the compact wire format, avoiding a same-key
				// different-payload conflict while keeping retries idempotent.
				record.comment.deleted
					? createHash("sha256").update(`compact-delete-v1:${record.eventKey}`).digest("hex")
					: record.eventKey,
				// Only the durable owner-mediated publication relay may request an
				// original member. Vela independently verifies this owner, active
				// publication and same-team directory before honoring the hint.
				record.publication && record.comment.memberId && record.comment.memberId !== identity.memberId
					? record.comment.memberId : undefined,
			);
			// Revision-conditional ACK: if an edit/delete was queued while this
			// payload was in flight, its newer row remains for the next drain.
			deps.commentOutbox?.acknowledge(record, "delivered");
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:102-120](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/collab/vela-cli-collab-client.ts#L102-L120)

Vela 命令空输出回空对象。

<details>
<summary>查看原文（19行）</summary>

```text
	async function runJson<T>(
		args: string[],
		workspaceId: string,
		commandOptions?: Pick<VelaCommandOptions, "input">,
	): Promise<T> {
		const requestedWorkspaceId = workspaceId.trim();
		if (!requestedWorkspaceId) {
			throw new Error("explicit workspace scope is required");
		}
		let stdout: string;
		try {
			stdout = await run(args, requestedWorkspaceId, commandOptions);
		} catch (error) {
			throw collabCloudErrorFromVelaFailure(error) ?? error;
		}
		const trimmed = stdout.trim();
		if (!trimmed) return {} as T;
		try {
			return JSON.parse(trimmed) as T;
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:198-225](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/collab/vela-cli-collab-client.ts#L198-L225)

单条响应缺数字 seq 回落为零。

<details>
<summary>查看原文（28行）</summary>

```text
		async pushComment(
			_teamId: string,
			projectId: string,
			comment: CollabCloudComment,
			idempotencyKey?: string,
			historicalAuthorMemberId?: string,
		): Promise<{ seq: number }> {
			const payload = await runJson<{
				seq?: unknown;
				authorKey?: unknown;
				author?: { authorKey?: unknown };
			}>(
				[
					"comment",
					"push",
					projectId,
					"--comment-file",
					"-",
					...(idempotencyKey ? ["--idempotency-key", idempotencyKey] : []),
					...(historicalAuthorMemberId ? ["--historical-author-member-id", historicalAuthorMemberId] : []),
				],
				_teamId,
				{ input: JSON.stringify(comment) },
			);
			const authorKey = payload.author?.authorKey ?? payload.authorKey;
			return {
				seq: typeof payload.seq === "number" ? payload.seq : 0,
				...(typeof authorKey === "string" && authorKey.trim()
```

</details>

#### 缺口

- 未运行远端 Vela 和本地队列，HTTP 客户端边界未全部核查
  **影响**：无法确认实际服务收到、存储或后续设计实现
  **进一步探讨**：在隔离协作环境模拟空输出、丢响应和重试后回读远端评论及待发送状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 使用与恢复需要什么，哪些成本未知？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根工程声明 Node 24 和指定 pnpm 范围，DSH 路径依赖外部 CLI、匹配 profile/companion、模型及凭据；共享反馈还依赖正确工作区身份与远端服务。首次配置、设计人工审阅、模型调用、存储和网络都消耗资源，但本次没有价格、用量或耗时依据，不能算 ROI。失败时可能需要核对 Agent 终态、制品和 manifest、备份与远端回执，取消并不撤销已有操作。适合已有设计和 Agent 操作经验的人在隔离账户与非敏感副本上验证一项本地任务；环境、文件或费用不明时停止并人工核查。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-11](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/package.json#L1-L11)

应用、CLI 和包身份。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "open-design",
  "version": "0.25.1",
  "private": true,
  "packageManager": "pnpm@10.33.2",
  "type": "module",
  "description": "Local-first design product: detects your installed code-agent CLI, runs design skills + design systems, streams artifacts into a sandboxed preview.",
  "license": "Apache-2.0",
  "bin": {
    "od": "./apps/daemon/bin/od.mjs"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:42-46](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/package.json#L42-L46)

Node 和 pnpm 版本要求。

```text
  "engines": {
    "node": "~24",
    "pnpm": ">=10.33.2 <11"
  },
  "pnpm": {
```

**依据 3 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:79-103](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L79-L103)

DSH 版本、profile 与模型选择边界。

<details>
<summary>查看原文（25行）</summary>

```text
    supportedVersionPattern:
      /^0\.1\.\d+$|^0\.1\.0-rc\.(?:[6-9]|[1-9]\d+)$|^0\.1\.1-rc\.\d+$|^0\.1\.2-rc\.\d+$/u,
    requireVersion: true,
    parse: parseDeepSeekHarnessVersion,
  },
  compatibilityProbe: {
    args: ['--profile', 'open-design', '--probe'],
    timeoutMs: 10_000,
    // rc.6 auto-initializes a missing profile before booting it, so avoid
    // invoking --probe until the user-installed profile already exists.
    preflight: hasOpenDesignProfile,
    parse: (stdout) => parseDshProfileProbeOutput(stdout).plugin_version,
  },
  listModels: {
    args: ['--profile', 'open-design', '--models'],
    parse: parseModels,
    timeoutMs: 10_000,
  },
  fallbackModels: [DEFAULT_MODEL_OPTION],
  buildArgs: () => ['--profile', 'open-design', '--stdio'],
  promptViaStdin: true,
  streamFormat: 'dsh-profile-jsonl',
  resumesSessionViaProfileStdio: true,
  capturesSessionIdFromStream: true,
  supportsCustomModel: false,
```

</details>

**依据 4 · 源码核查**：[packages/dsh-runtime/src/index.ts:325-356](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/packages/dsh-runtime/src/index.ts#L325-L356)

终态和 flush 与成功语义。

<details>
<summary>查看原文（32行）</summary>

```text
    });
    await handle.agent.whenIdle();
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }
    firstSeq = handle.agent.session.seq + 1;
    disposeEvent = ctx.on('session/event', onSessionEvent);
    await handle.agent.followup(createUserMessage({
      content: [{ type: 'text', text: request.prompt }],
      source: { kind: 'user' },
    }));
    await handle.agent.whenIdle();
    await ctx.sessions.flush(handle.agent.session);
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }

    const reason = turnEnd?.data.reason;
    const status = resultStatus(reason);
    const failed = resultError(reason);
    writeFrame(output, {
      v: 1,
      type: 'result',
      request_id: request.request_id,
      status,
      session_id: String(sessionId),
      ...terminalOutput(assistantOutput),
      stop_reason: reason?.kind ?? 'unknown',
      resume_rejected: false,
      ...(failed === undefined ? {} : { error: failed }),
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/projects.ts:942-950](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/projects.ts#L942-L950)

正文与 manifest 分次写。

```text
  await writeFile(target, body);
  await projectFileWriteTestHooks.afterCommit?.({ safeName, target, body });
  if (validatedManifest) {
    const manifestFileName = artifactManifestNameFor(safeName);
    const manifestTarget = await resolveSafeReal(dir, manifestFileName);
    await writeFile(manifestTarget, JSON.stringify(validatedManifest, null, 2));
  }
  const st = await stat(target);
  const persistedManifest = await readManifestForPath(dir, safeName);
```

#### 缺口

- 未测模型费用、安装和恢复工作量，也没有同条件质量对照
  **影响**：不能判断生产采用价值或总拥有成本
  **进一步探讨**：记录一批合格任务的调用费用、人工时间、失败恢复和文件/远端读回。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些接缝可借鉴，下一步应如何证伪？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

会话 ID 与序号过滤、缺少终态的失败路径、制品 manifest 与评论 revision 条件确认分别解决不同交接问题；它们不自动建立从用户反馈到最终制品合格的完整证明。未验证假设是先对单条评论回执严格验证并提供远端读回，再把每条反馈关联到具体制品版本及人工验收，可减少遗漏或错误关闭；此方案增加网络和人工核查，且必须先确认现有会话、身份和版本的所有权。最小对照使用相同批次的评论和设计修改，比较反馈漏处理数、错误确认数和包含审阅的总时间；若现有应用加清单同样可靠、额外负担抵消收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-runtime/src/index.ts:268-284](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/packages/dsh-runtime/src/index.ts#L268-L284)

按会话及序号过滤事件。

<details>
<summary>查看原文（17行）</summary>

```text
  const sessionId = SessionId(request.resume_session_id ?? `od-${randomUUID()}`);
  let handle: AgentHandle | undefined;
  let firstSeq = Number.POSITIVE_INFINITY;
  let turnEnd: SessionEvent<'turn/end'> | undefined;
  let assistantOutput = '';
  const setup = (agentCtx: Context) => {
    const selected: ModelSelectionRef = { current: selection, assembled: undefined };
    installModelSelection(agentCtx, selected);
  };
  let disposeEvent = () => {};
  const onSessionEvent = (session: { id: unknown }, event: SessionEvent) => {
    if (String(session.id) !== String(sessionId) || event.seq < firstSeq) return;
    emitSessionEvent(output, request, selection.provider, selection.model, event);
    if (event.type === 'assistant/chunk' && event.data.chunk.type === 'text-delta') {
      assistantOutput += event.data.chunk.text;
    }
    if (event.type === 'turn/end') turnEnd = event;
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:258-269](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L258-L269)

进程退出而无终态报告失败。

<details>
<summary>查看原文（12行）</summary>

```text
    },
    onError(error) {
      fail(error.message, error.code);
    },
  });

  stdout.on('data', (chunk: Buffer | string) => parser.feed(chunk));
  stdout.on('end', () => {
    parser.flush();
    if (!finished) fail('DeepSeek Harness profile exited without a terminal result.', 'DSH_PROFILE_MISSING_RESULT');
  });

```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/artifacts/create.ts:55-66](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/artifacts/create.ts#L55-L66)

制品 manifest 校验。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveCreateArtifactManifest(input: CreateProjectArtifactInput): unknown {
  const manifest = input.artifactManifest !== undefined && input.artifactManifest !== null
    ? input.artifactManifest
    : inferLegacyManifest(input.name);
  if (manifest) {
    const validated = validateArtifactManifestInput(manifest, input.name);
    if (!validated.ok) {
      throw new ArtifactManifestInvalidError(validated.error);
    }
    return validated.value;
  }
  throw new ArtifactManifestRequiredError(input.name);
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:783-807](https://github.com/nexu-io/open-design/blob/12d970eacc8971150e3c76470d2a9afe16dc2ed1/apps/daemon/src/collab/collab-cloud-service.ts#L783-L807)

单项推送与 revision 条件确认。

<details>
<summary>查看原文（25行）</summary>

```text
			const result = await deps.client.pushComment(
				identity.teamId,
				record.projectId,
				commentRelayPayload(record.publication
					? {
							...record.comment,
							filePath: record.publication.publicFilePath,
							publicationSlug: record.publication.slug,
						}
					: record.comment),
				// Legacy full-content tombstones may already have a lost-ACK receipt.
				// Use a stable new key for the compact wire format, avoiding a same-key
				// different-payload conflict while keeping retries idempotent.
				record.comment.deleted
					? createHash("sha256").update(`compact-delete-v1:${record.eventKey}`).digest("hex")
					: record.eventKey,
				// Only the durable owner-mediated publication relay may request an
				// original member. Vela independently verifies this owner, active
				// publication and same-team directory before honoring the hint.
				record.publication && record.comment.memberId && record.comment.memberId !== identity.memberId
					? record.comment.memberId : undefined,
			);
			// Revision-conditional ACK: if an edit/delete was queued while this
			// payload was in flight, its newer row remains for the next drain.
			deps.commentOutbox?.acknowledge(record, "delivered");
```

</details>

#### 缺口

- 反馈到制品版本和人类验收的整体假设没有运行研究
  **影响**：不能把局部可靠性等同于协作闭环合格
  **进一步探讨**：在受控样本测回执、版本关联和人工验收的真实遗漏率及成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
