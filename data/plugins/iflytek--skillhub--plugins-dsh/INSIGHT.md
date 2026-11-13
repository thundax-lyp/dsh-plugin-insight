# SkillHub DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b8e9668](https://github.com/iflytek/skillhub/tree/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 5,410](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C410&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iflytek/skillhub) [![npm 30d 2,064](https://img.shields.io/static/v1?label=npm+30d&message=2%2C064&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh)
<!-- END META -->

> **功能**：在 DSH 浏览、预览、安装和管理 SkillHub 技能。

> **亮点**：[Q01](#research-q01) 将受限版本预览和技能发现接入宿主，[Q02](#research-q02)、[Q03](#research-q03) 连接选择、确认、操作与后续实际状态。

> **主要限制**：[Q02](#research-q02) 兼容门按实际依赖图拒绝写入，已受理仍可能失败。[Q03](#research-q03) 当前会话可能使用同名的另一安装。

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
  - [Q01 · 文件预览能把用户审阅范围绑定到哪个技能版本？](#detail-section-11)
  - [Q02 · 确认、兼容门和操作受理在写入前后分别做什么？](#detail-section-12)
  - [Q03 · 怎样用一个已审阅候选验收当前会话可用，并减少版本误认？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 反复寻找和复用技能的开发者，需要在安装前审阅对应版本并验明当前会话实际可用。

从网页找技能、下载固定版本、审阅后手工复制到目标范围，再核对当前会话发现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 只读预览 | 查看候选版本文件 | 只读固定清单，限大小和类型 |
| 范围确认 | 提交安装或管理操作 | 依赖当前会话、兼容及用户选择 |
| 可用诊断 | 检查当前发现与调用资格 | 同名覆盖和历史回执分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配 DSH Host、Client、Node 和 Cordis | 写入必需 | 受理和显示 | 停止写入 |
| 可访问 Registry | 预览与安装需要 | 取固定内容 | 查看不支持或失败 |
| 真实用户确认及唯一 scope | 修改必需 | 限定目标 | 等待或取消 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 审阅 | 开发者 | 核对当前来源与版本文件 | 无清单则回独立审阅 |
| 确认 | 开发者 | 只选隔离项目位置，记录回执 | 上下文过期后重新选择 |
| 核对 | 开发者 | 终态与当前胜者分别核验 | 状态不明时不重新提交 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和下载资源 | 核对候选及版本图 | 公开包未验 |
| 持续 | Registry 请求和模型调用 | 技能内容和更新审阅 | 节时未测 |
| 恢复 | 项目备份及下载 | 核对旧操作和当前胜者 | 依赖真实恢复能力 |
| 退出 | 项目副本 | 停用或按明确范围卸载 | 同名回退待核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 版本审阅 | 受限清单和正文读取 | 包逐字一致与技能安全 |
| 操作追踪 | 确认、受理及旧请求回执 | 宿主真实恢复 |
| 实际可用 | 完整性、发现和调用权限 | 目标任务效果 |

> **思考**：[Q02](#research-q02) 兼容门按实际依赖图拒绝写入，已受理仍可能失败。[Q03](#research-q03) 当前会话可能使用同名的另一安装。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将受限版本预览和技能发现接入宿主，[Q02](#research-q02)、[Q03](#research-q03) 连接选择、确认、操作与后续实际状态。

[Q02](#research-q02) 以请求键查询旧操作并重验每次新写入依赖图；[Q01](#research-q01) 固定详情引用约束文件读取。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 兼容门按实际依赖图拒绝写入，已受理仍可能失败。[Q03](#research-q03) 当前会话可能使用同名的另一安装。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅在隔离项目试一个已审阅的来源和版本，回读终态、当前会话发现及权限。范围不清楚时取消。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认预览、兼容门及状态分离。公开包、真实宿主安装和节时均待验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/README.md、plugins/dsh/src/host/index.ts、plugins/dsh/src/host/local-runtime.ts、plugins/dsh/src/host/registry-adapter.ts、plugins/dsh/src/host/runtime-compatibility.ts、plugins/dsh/src/host/skill-availability.ts、plugins/dsh/src/host/skill-files.ts 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核查 plugins/dsh 的文件预览、代表性对话安装、管理确认、兼容和可用性路径；不核实全部 UI、CLI、发布包及真实宿主。
- 下一步：用固定技能包、测试来源和空项目，分别检查不兼容、来源切换、重复确认及同名覆盖。

**分析版本**

- **仓库**：[iflytek/skillhub](https://github.com/iflytek/skillhub)
- **版本号**：0.6.3（[固定提交 b8e9668](https://github.com/iflytek/skillhub/tree/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照当前预览与诊断，在一处标明预览、安装和宿主胜者，观察是否减少误用。尚未验证。

用固定技能包、测试来源和空项目，分别检查不兼容、来源切换、重复确认及同名覆盖。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 6 | 6 | 0 | — |
| .md | source | 3 | 621 | — | — | 14190 |
| .ts | source | 60 | 5774 | 5239 | 194 | — |
| .mjs | source | 2 | 681 | 633 | 34 | — |
| .tsx | source | 42 | 5097 | 4915 | 71 | — |
| .ts | test | 92 | 9223 | 8643 | 227 | — |
| .tsx | test | 20 | 1432 | 1338 | 27 | — |
| .mjs | test | 81 | 7449 | 7315 | 103 | — |
| .md | test | 1 | 556 | — | — | 19154 |

</details>

**活跃度**

[![Issue 未关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/iflytek/skillhub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 36](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=36&color=737b86&logo=github)](https://github.com/iflytek/skillhub/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 33](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=33&color=737b86&logo=github)](https://github.com/iflytek/skillhub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 发现、审阅并安装一个技能时，源码能证明什么操作被确认、完成及实际生效？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文件预览能把用户审阅范围绑定到哪个技能版本？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用户从技能中心或会话找到候选。相对在网页查候选、手工下载和复制，该组件把候选文件与版本挂到原宿主。listSkillFiles 解析固定详情引用，按 namespace、slug、version 向当前来源查询，回读来源后缓存当前清单；readSkillFile 只能选这个清单中的文件，再按同一版本请求。Registry adapter 拒绝非法路径和非文本，正文实际读取限 256 KiB，包含空字符标为二进制。预览能供人核查内容，但未验证 Registry 响应版本与最终安装包的每个字节相同，也没有替代权限审查。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:5-7](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/README.md#L5-L7)

作者说明浏览与安装，并区分当前来源库存。

```text
SkillHub 的 DSH 原生插件。在 DSH 侧栏打开 **技能中心**，匿名浏览、搜索、查看技能详情，并管理安装、升级和卸载；对话中也可搜索和明确请求安装技能。插件内置本地安装核心，无需另装 SkillHub CLI。

`0.2.0` 新增来源可核验的搜索安装状态：广场卡片和对话工具可识别当前来源的受管理安装版本、用户/项目范围及异常记录；对话保留查询时快照。未发现本来源记录不代表其他市场或手工安装不存在，文件存在也不代表 DSH 已启用该技能。按来源、命名空间和技能标识匹配；不按同名目录认领其他来源技能。
```

**依据 2 · 源码核查**：[plugins/dsh/src/host/index.ts:343-361](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/index.ts#L343-L361)

固定详情和来源内的清单、文件读取。

<details>
<summary>查看原文（19行）</summary>

```text
  @Remote
  async listSkillFiles(detailToken: string, signal: AbortSignal): Promise<SkillFileList> {
    const detail = this.readFixedDetail(detailToken);
    return this.readSource(detail.sourceRevision, signal, async (registry, signal) => {
      const result = await registry.files(detail.namespace, detail.slug, detail.version, signal);
      this.assertSource(detail.sourceRevision);
      // File reads only accept names from this bounded, fixed-version list.
      detail.files = result.state === 'ready' ? result.items.map(file => ({ ...file })) : undefined;
      return result;
    });
  }

  @Remote
  async readSkillFile(detailToken: string, path: string, signal: AbortSignal): Promise<SkillFilePreview> {
    const detail = this.readFixedDetail(detailToken);
    const file = detail.files?.find(file => file.path === path);
    if (!file) throw new RemoteError('skillhub/registry-error', 'Select a listed skill file first.', { reason: 'INVALID_INPUT', retryable: false });
    return this.readSource(detail.sourceRevision, signal,
      (registry, signal) => registry.file(detail.namespace, detail.slug, detail.version, file, signal));
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/skill-files.ts:3-19](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/skill-files.ts#L3-L19)

文件上限、相对路径与类型判定。

<details>
<summary>查看原文（17行）</summary>

```text
export const MAX_SKILL_PREVIEW_FILES = 500;
export const MAX_SKILL_PREVIEW_BYTES = 256 * 1024;

/** Registry-relative packaged names only; never a Host filesystem path or URL. */
export function isRegistryFilePath(path: string): boolean {
  // eslint-disable-next-line no-control-regex -- Reject untrusted control characters in file references.
  return path.length > 0 && path.length <= 2048 && !/[\u0000-\u001f\u007f\\]/u.test(path)
    && !path.startsWith('/') && !/^[a-z]:/iu.test(path)
    && path.split('/').every(part => part !== '' && part !== '.' && part !== '..');
}

export function isPreviewableText(file: SkillFileEntry): boolean {
  const mime = file.contentType?.split(';', 1)[0]?.trim().toLowerCase() ?? '';
  if (mime.startsWith('text/') || /(?:json|javascript|xml|yaml|toml)$/u.test(mime)) return true;
  const name = file.path.split('/').at(-1)!.toLowerCase();
  return /\.(?:md|mdx|txt|json|jsonc|yaml|yml|toml|ini|cfg|conf|csv|tsv|xml|svg|html|css|scss|js|jsx|mjs|cjs|ts|tsx|py|sh|bash|ps1|java|kt|rs|go|sql|rb|c|h|cpp|hpp)$/u.test(name)
    || /^(?:dockerfile|makefile|license|notice|\.gitignore|\.editorconfig)$/u.test(name);
```

</details>

**依据 4 · 源码核查**：[plugins/dsh/src/host/registry-adapter.ts:170-192](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/registry-adapter.ts#L170-L192)

区分不支持、不可读、过大与二进制。

<details>
<summary>查看原文（23行）</summary>

```text
  async files(namespace: string, slug: string, version: string, signal?: AbortSignal): Promise<SkillFileList> {
    try {
      const items = await this.json(`/api/v1/skills/${segment(namespace)}/${segment(slug)}/versions/${segment(version)}/files`, filesSchema, signal);
      return { state: 'ready', items: items.map(item => ({ path: item.filePath, size: item.fileSize,
        contentType: item.contentType ?? null })) };
    } catch (error) {
      if (error instanceof RegistryError && [404, 405].includes(error.status ?? 0)) return { state: 'unsupported', items: [] };
      throw error;
    }
  }

  async file(namespace: string, slug: string, version: string, file: SkillFileEntry, signal?: AbortSignal): Promise<SkillFilePreview> {
    if (!isRegistryFilePath(file.path)) throw new RegistryError('INVALID_INPUT', false);
    if (file.size > MAX_SKILL_PREVIEW_BYTES) return { state: 'too-large', path: file.path, limitBytes: MAX_SKILL_PREVIEW_BYTES };
    if (!isPreviewableText(file)) return { state: 'binary', path: file.path };
    try {
      const content = await this.read(`/api/v1/skills/${segment(namespace)}/${segment(slug)}/versions/${segment(version)}/file?${new URLSearchParams({ path: file.path })}`,
        'text/plain', signal, MAX_SKILL_PREVIEW_BYTES);
      return content.includes('\0') ? { state: 'binary', path: file.path } : { state: 'text', path: file.path, content };
    } catch (error) {
      if (error instanceof RegistryError && error.code === 'RESPONSE_TOO_LARGE') return { state: 'too-large', path: file.path, limitBytes: MAX_SKILL_PREVIEW_BYTES };
      if (error instanceof RegistryError && error.code === 'INVALID_RESPONSE') return { state: 'unreadable', path: file.path };
      throw error;
```

</details>

#### 缺口

- 未比对 Registry 同版本预览和实际发布包
  **影响**：用户审阅可能漏过未预览文件或包差异
  **进一步探讨**：在测试源比较版本清单、正文及实际包摘要

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 确认、兼容门和操作受理在写入前后分别做什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

无明确 scope 的对话安装先解析候选，保留会话、来源和版本选择，返回待确认；不在这个阶段下载、指纹或写入。管理操作的确认回查 agent、runtime、cwd 和来源，取消即退；重复提交复用在途或已持久化回执，不能用 accepted 报完成。LocalRuntime 对新安装受理执行写入基线校验，然后启动后续工作。门禁比较正在使用的 Host 与 Client 图、Cordis 版本族及 Node 版本，0.2.2-rc.1 额外要求 Node 24.9 起。选择了匹配 Node 和包并不证明运行成功。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/index.ts:1586-1618](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/index.ts#L1586-L1618)

缺 scope 时生成待确认而非实际写入。

<details>
<summary>查看原文（33行）</summary>

```text
      if (pending.parameters !== parameters) throw new RemoteError('skillhub/request-conflict', 'Request parameters changed.', { retryable: false });
      const result = await pending.result;
      signal.throwIfAborted();
      this.selections.read(result.selectionRef, this.selectionScope(agent));
      if (this.localRuntime !== runtime) throw installationContextError('RUNTIME', 'Conversation changed.');
      if (this.ctx.get('agents')?.get(SessionId(context.sessionId)) !== agent) throw installationContextError('AGENT', 'Conversation changed.');
      return result;
    }
    if (!request.scope) {
      // No transaction, target token, download, or fingerprint is created before visible confirmation.
      const result = (async (): Promise<PendingConversationInstall> => {
        signal.throwIfAborted();
        const scope = this.selectionScope(agent);
        let selectionRef: string;
        let candidate: { namespace: string; slug: string; version: string };
        if ('selectionRef' in request) {
          const { namespace, slug, version } = this.selections.read(request.selectionRef, scope);
          candidate = { namespace, slug, version };
          selectionRef = this.selections.add({ ...context, sourceRevision: scope.sourceRevision }, candidate);
        } else {
          const resolved = await this.readSource(scope.sourceRevision, signal,
            (registry, signal) => registry.resolve(request.namespace, request.slug, undefined, signal));
          candidate = { namespace: request.namespace, slug: request.slug, version: resolved.version };
          selectionRef = this.selections.add({ ...context, sourceRevision: scope.sourceRevision }, candidate);
        }
        signal.throwIfAborted();
        this.assertSource(scope.sourceRevision);
        if (agent.session.header.cwd !== context.cwd) throw installationContextError('CWD', 'Conversation changed.');
        if (this.localRuntime !== runtime) throw installationContextError('RUNTIME', 'Conversation changed.');
        if (this.ctx.get('agents')?.get(SessionId(context.sessionId)) !== agent) throw installationContextError('AGENT', 'Conversation changed.');
        this.pendingConversationChoices.set(selectionRef, { agent, runtime });
        return { schemaVersion: 1, kind: 'skillhub-install', status: 'awaiting-confirmation',
          toolCallId: context.callId, selectionRef, namespace: candidate.namespace, slug: candidate.slug,
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/index.ts:1913-1939](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/index.ts#L1913-L1939)

管理确认和请求回执再利用。

<details>
<summary>查看原文（27行）</summary>

```text
  private async confirmManagementForAgent(agentId: string, confirmationRef: string, confirmed: boolean, signal: AbortSignal): Promise<ConversationManagementResult> {
    const entry = this.managementConfirmations.get(confirmationRef);
    const agent = this.ctx.get('agents')?.get(SessionId(agentId));
    if (!entry || !agent || entry.agent !== agent || entry.runtime !== this.localRuntime
      || entry.context.sessionId !== agentId || agent.session.header.cwd !== entry.context.cwd) {
      throw new RemoteError('skillhub/context-stale', 'Confirmation expired.', { retryable: false });
    }
    // Once submitted, retries return the same durable operation, even when the old itemKey has changed.
    if (entry.execution) return entry.execution;
    if (entry.view.status === 'cancelled') return entry.view;
    if (entry.attempted) {
      const previous = await entry.runtime.findPlanOperation({ hostInstanceId: entry.runtime.getStatus().hostInstanceId!,
        ownerId: agentId, requestKey: entry.requestKey, mode: 'retry', parameters: { planId: entry.planId } });
      if (previous) { entry.view = { ...entry.view, status: 'accepted', operation: previous, reason: 'accepted' }; return entry.view; }
    }
    this.assertSource(entry.sourceRevision);
    signal.throwIfAborted();
    if (!confirmed) { entry.view = { ...entry.view, status: 'cancelled', reason: 'cancelled' }; return entry.view; }
    entry.execution = (async () => {
      await this.readInstalledItem(entry.sourceRevision, entry.view.item.itemKey, signal, agentId);
      if (this.localRuntime !== entry.runtime || this.ctx.get('agents')?.get(SessionId(agentId)) !== agent || agent.session.header.cwd !== entry.context.cwd) {
        throw new RemoteError('skillhub/context-stale', 'Conversation changed.', { retryable: false });
      }
      entry.attempted = true;
      const operation = await this.executePlanForAgent(agentId, { planId: entry.planId, requestKey: entry.requestKey }, signal, 'conversation');
      if (!operation) throw new RemoteError('skillhub/installation-unavailable', 'Acceptance unknown. Query the original request.', { retryable: true });
      entry.view = { ...entry.view, status: 'accepted', operation, reason: 'accepted' };
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/index.ts:105-110](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/index.ts#L105-L110)

运行时注入实时兼容检查。

```text
    this.configuration = configuration;
    ctx.inject(['sessions'], ctx => {
      ctx.effect(() => {
        const runtime = new LocalRuntime(undefined, () => this.assertRuntimeBaseline());
        this.localRuntime = runtime;
        void runtime.start();
```

**依据 4 · 源码核查**：[plugins/dsh/src/host/local-runtime.ts:190-205](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/local-runtime.ts#L190-L205)

新安装受理前重验，已持久重试不重复执行。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Acceptance is returned early; the complete admitted workflow remains tracked until execution settles. */
  submitInstall(request: NativeOperationRequest, prepare: () => Promise<PreparedNativeInstall>): Promise<NativeOperation | undefined> {
    const receipt = Promise.withResolvers<NativeOperation | undefined>();
    const input = { ...request, parameters: { ...request.parameters } };
    const workflow = this.call(async runtime => {
      let prepared: PreparedNativeInstall | undefined;
      const accepted = await runtime.acceptInstall(input, async () => {
        this.assertWritableHost();
        const result = await prepare();
        prepared = { acceptance: structuredClone(result.acceptance), execution: { ...result.execution } };
        return prepared.acceptance;
      });
      receipt.resolve(accepted);
      // A retry found in durable state does not replay work or reinterpret expired references.
      if (!accepted || !prepared || accepted.phase !== 'accepted') return;
      const execution = { ...prepared.execution, operationId: accepted.operationId, ownerId: input.ownerId };
```

</details>

**依据 5 · 源码核查**：[plugins/dsh/src/host/runtime-compatibility.ts:6-13](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/runtime-compatibility.ts#L6-L13)

Node 版本门。

```text
/** Package-wide floor for retained RCs; DSH 0.2.2-rc.1 additionally requires Node 24.9. */
export const nodeRuntimeRange = '>=24.2.0 <25';

export function assertNodeRuntime(version = process.versions.node, release?: SupportedDshVersion): void {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
  if (!match || Number(match[1]) !== 24 || Number(match[2]) < (release === '0.2.2-rc.1' ? 9 : 2)) {
    throw new Error('Node runtime baseline does not match; local writes are disabled.');
  }
```

**依据 6 · 源码核查**：[plugins/dsh/src/host/runtime-compatibility.ts:60-100](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/runtime-compatibility.ts#L60-L100)

实际依赖图验证。

<details>
<summary>查看原文（41行）</summary>

```text
/** Read the current Host resolution and Client graph on each new write; never cache acceptance. */
export function assertRuntimeCompatibility(
  services: RuntimeServices,
  parentURL: string,
  readClientManifest: (file: string, name: string) => unknown = clientManifest,
  readHostManifest: (file: string) => unknown = file => JSON.parse(readFileSync(file, 'utf8')),
): SupportedDshVersion {
  try {
    assertNodeRuntime();
    const readPackage = (name: string, parent: string) => {
      const actual = services.packageOf(name, parent);
      if (actual?.name !== name || !actual.manifestPath) throw new Error('Runtime package mismatch');
      // packageOf caches metadata until a resolution generation is replaced.
      const current = readHostManifest(actual.manifestPath);
      if (!current || typeof current !== 'object' || !('name' in current) || !('version' in current)
        || current.name !== name || current.version !== actual.version) throw new Error('Runtime manifest mismatch');
      return actual;
    };
    const packages = new Map(Object.keys(runtimePackageBaseline).map(name => [name, readPackage(name, parentURL)]));
    const family = cordisFamilies.find(candidate => Object.entries(candidate).every(([name, version]) => packages.get(name)?.version === version));
    const release = packages.get('@deepseek-ai/dsh')?.version;
    if (typeof release !== 'string' || !supportedDshVersions.some(version => version === release)) throw new Error('Unsupported DSH release');
    assertNodeRuntime(process.versions.node, release as SupportedDshVersion);
    if (!family || !supportsCordis(release, family['@deepseek-ai/cordis'])) throw new Error('Runtime Cordis family mismatch');
    for (const [name, version] of Object.entries({ ...runtimePackageBaseline, ...family })) {
      const expected = name.startsWith('@deepseek-ai/dsh') ? release : version;
      if (packages.get(name)?.version !== expected) throw new Error('Runtime package mismatch');
    }
    // Check the Host's own dependency lookup, not just the plugin's peer copies.
    // A nested peer can otherwise hide an unsupported Host dependency graph.
    for (const anchor of ['@deepseek-ai/dsh', '@deepseek-ai/dsh-app-boot']) {
      const anchorURL = pathToFileURL(packages.get(anchor)!.manifestPath!).href;
      for (const [name, expected] of packages) {
        if (readPackage(name, anchorURL).version !== expected.version) throw new Error('Host dependency graph mismatch');
      }
    }
    assertHostDependencies(name => packages.get(name));
    for (const name of clientPackageBaseline) {
      const file = services.clientPath(name);
      if (!file) throw new Error('Client module unavailable');
      const manifest = readClientManifest(file, name);
```

</details>

#### 缺口

- 未以真实宿主重放来源变化与重复确认
  **影响**：运行时兼容和重复抑制仍需当前版本证据
  **进一步探讨**：使用隔离 profile 对比兼容与不兼容图，重复同一请求键查回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样用一个已审阅候选验收当前会话可用，并减少版本误认？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

只选一个来源和项目测试位置，检查候选、确认卡和终态，再用只读诊断核对文件完整性、宿主发现的同名胜者和模型/用户调用权限。源码在二次观测变化时保留未知，发现胜者也可能是别处同名技能；历史 accepted 或 completed 不能回答当前能否使用。切换来源或遇到同名覆盖时撤回操作，保留手工审阅和项目级备份。预览减少下载前的查找切换，但人工审阅、状态核对和退出成本未测。可验证在同一位置同时显示预览版本、已安装版本与实际胜者能否减少误用，基线为当前版本详情和诊断；如差错不降或干扰阅读，保留现有分离呈现。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/index.ts:1473-1493](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/index.ts#L1473-L1493)

宿主发现确认有服务和上下文前提。

<details>
<summary>查看原文（21行）</summary>

```text
      const cwd = agent.session.header.cwd;
      const fs = agent.ctx.get('fs');
      const skills = this.ctx.get('skills');
      if (!cwd || !fs || !skills) return operation;
      const signal = AbortSignal.any([this.lifetime.signal, AbortSignal.timeout(2000)]);
      try {
        const roots = await Promise.all((['user', 'project'] as const).map(async scope => {
          try { return await resolveInstalledPath({ scope, cwd, fs, signal }); }
          catch { return undefined; }
        }));
        const confirmed = await runtime.observeInstallation(operationId, agent.session.id,
          roots.flatMap(root => root ? [root.root] : []),
          paths => observeDshInstallation(agent.ctx, paths, signal,
            name => skills.get(name, { scope: agent, cwd, signal })));
        signal.throwIfAborted();
        if (confirmed && agent.session.header.cwd === cwd && this.localRuntime === runtime
          && this.ctx.get('agents')?.get(SessionId(agent.session.id)) === agent
          && serviceIdentity(agent.ctx.get('fs')) === serviceIdentity(fs)
          && serviceIdentity(this.ctx.get('skills')) === serviceIdentity(skills)) return { ...operation, discovery: 'confirmed' };
      } catch { /* Discovery uncertainty does not replace a successful file result. */ }
      return { ...operation, discovery: 'unconfirmed' };
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/skill-availability.ts:75-95](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/src/host/skill-availability.ts#L75-L95)

重新观测、同名覆盖与可调用性分开。

<details>
<summary>查看原文（21行）</summary>

```text
    const finalWinner = await read(() => reader.get(name!));
    if (!finalSnapshot.complete || !isDeepStrictEqual(snapshot, finalSnapshot) || !isDeepStrictEqual(winner, finalWinner)) {
      result.reason = 'observation-changed'; return result;
    }
    if (managed && !isDeepStrictEqual(baseline, await read(managed.baseline))) {
      result.integrity = 'unknown'; result.reason = 'observation-changed'; return result;
    }
    if (!winner) {
      if (snapshot.skills.some(skill => skill.name === name)) { result.reason = 'definition-unverified'; return result; }
      result.discovery = 'not-discovered'; result.reason = 'not-discovered'; return result;
    }
    if (winner.name !== name || !snapshot.skills.some(skill => skill.name === name)) { result.reason = 'observation-changed'; return result; }
    if (managed && expected) {
      if (winner.path !== expected.path || winner.resourceBase?.kind !== 'directory' || winner.resourceBase.path !== managed.directory) {
        result.discovery = 'shadowed'; result.reason = 'same-name-winner'; return result;
      }
      if (!sameDshSkill(winner, expected, managed.directory)) { result.reason = 'definition-changed'; return result; }
    }
    result.discovery = 'winner';
    result.invocation = { userInvocable: winner.invocation.userInvocable, modelInvocable: winner.invocation.modelInvocable };
    if (!managed || result.integrity === 'verified') result.reason = 'observed';
```

</details>

**依据 3 · 作者声明**：[plugins/dsh/README.md:19-33](https://github.com/iflytek/skillhub/blob/b8e9668733e6a139ce4770f2f8ee7d8fe66fd946/plugins/dsh/README.md#L19-L33)

作者描述候选版与只读预览及真实可用诊断。

<details>
<summary>查看原文（15行）</summary>

```text
`0.6.3` 为当前补丁候选，交付 [#1080](https://github.com/iflytek/skillhub/pull/1080) 的紧凑工作台、受限只读文件树，以及详情修改入口和升级完成返回修复。保留 `0.6.2` 的来源与库存语义，并新增 DSH `0.2.2-rc.1` 精确兼容目标；候选与公开包分别验收，发布前不宣称 npm 已可用。

## 紧凑界面与文件预览（0.6.3）

发现、我的技能、详情和设置共用紧凑控件与明暗主题。文件页按目录树展示当前版本，支持展开/收起和文件切换，并在当前详情引用内保留选中与折叠状态。文件页使用完整内容宽度；顶部“管理安装”回到概览中的位置管理。正文有行号和独立滚动，复制仍只复制原文。详情的“文件”按固定版本读取清单，选择文件后才读取正文；最多展示 500 个文件，单个文本预览上限 256 KiB，超限或二进制仅显示文件信息。正文只读，可复制，不执行 HTML 或加载正文中的远程资源。来源未提供清单、匿名受限与请求失败分别显示；切换来源后旧详情引用失效。复用 Registry 既有文件 GET 接口，仅新增插件本机只读 RPC；不改变 SaaS HTTP API 或共享库存格式。

评论使用既有按技能读取的接口，明确区分加载、空结果和读取失败。市场详情与已安装详情的“查看本地修改”均进入对应安装位置；升级完成后“返回详情”刷新实际库存并打开新版本详情，刷新失败可重试且不重复升级。技能卡片提供轻量悬停与键盘焦点反馈。文件正文当前为原文与行号，不含语言语法高亮。

## 使用已安装技能

市场、已安装列表和对话中的日常列表均按技能展示。点击“使用技能”，由 Host 核验当前会话实际可用的唯一安装；不会让用户猜安装位置。技能中心入口在同一工作区新建对话，对话内入口保留当前会话。案例显示在原生输入框上方，确认案例或自定义任务后填入可编辑草稿；不会自动发送、调用模型或覆盖原会话草稿。

已安装卡片的更多菜单中，“管理安装”进入技能详情，右侧直接展示每个位置的版本和状态，可明确使用此位置、检查更新、启停或卸载。全停用或状态无法确认时先进入管理安装。安装确认中直接展示安装范围，未安装技能仍默认安装到当前用户。

需要当前活动会话。被项目同名技能覆盖、本地文件变更、禁止用户调用或会话/来源变化时会提示原因；历史回执不能代替当前安装状态。此功能自 `0.4.0` 起提供。
```

</details>

#### 缺口

- 0.6.3 公开包可用性及单位审阅成本未知
  **影响**：不能承诺日常部署或节时
  **进一步探讨**：对同一受控技能先查发布字节，再计手工与插件的审阅、安装、验证及退出

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
