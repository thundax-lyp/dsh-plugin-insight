# dsh-network-settings

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[567ca07](https://github.com/kanneiren/dsh-network-settings/tree/567ca07bccd2246d96d49ffa849a38b35c2cb016)

<!-- BEGIN META -->
[![GitHub ★ 98](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=98&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kanneiren/dsh-network-settings) [![npm 30d 1,526](https://img.shields.io/static/v1?label=npm+30d&message=1%2C526&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-network-settings) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-network-settings)
<!-- END META -->

> **功能**：在 DSH 设置中提供平台网络诊断、配置预览与快照恢复。

> **亮点**：[Q01](#research-q01) 将进程与系统路径放在同一报告。

> **主要限制**：[Q02](#research-q02) 预览与 apply 无版本绑定，外部改写需验收。

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
  - [Q01 · 用户如何找到 DSH 的第一个网络失败点？](#detail-section-11)
  - [Q02 · 快照和预览是否构成服务端确认事务？](#detail-section-12)
  - [Q03 · 如何用诊断先降低修复风险？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows、WSL 或 macOS 用户排查 DSH 连接失败。

手工执行网络命令及编辑代理设置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 诊断 | 定位路径与失败层 | 需目标机验证 |
| 修复 | 快照后按作用域修改 | 确认和真实配置需复核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 受支持平台及 DSH | 必需 | 运行检查 | 平台能力各异 |
| 系统权限 | 按修改需要 | 应用配置或 UAC | 权限不足会失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 观察 | 先生成网络报告 | 人工核对失败层 |
| 修复 | 单项预览后应用 | 记录 before 与 after |
| 复测 | 重新诊断再回退 | 检查快照足够 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 理解平台和配置 | 先只读 |
| 持续 | 工时未知 | 维护代理与平台适配 | 条件随环境变 |
| 失败 | 恢复成本未知 | 用快照及原工具恢复 | 敏感字段可能不可逆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 排障 | 统一进程和系统路径 | 实际准确率和用时 |

> **思考**：[Q02](#research-q02) 预览与 apply 无版本绑定，外部改写需验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将进程与系统路径放在同一报告。

[Q02](#research-q02) 快照先写，预览与应用分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 预览与 apply 无版本绑定，外部改写需验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 报告与人工命令对照后再改配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对诊断及快照路径，未操作网络。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/index.ts、src/host/configure/index.ts、src/host/repair/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定诊断与修复代码，未探测或更改网络。
- 下一步：三平台故障、并发变化、UAC 和部分失败。

**分析版本**

- **仓库**：[kanneiren/dsh-network-settings](https://github.com/kanneiren/dsh-network-settings)
- **版本号**：0.3.3（[固定提交 567ca07](https://github.com/kanneiren/dsh-network-settings/tree/567ca07bccd2246d96d49ffa849a38b35c2cb016)）
- **版本日期**：2026-08-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照人工排障的定位时间与修复率。

三平台故障、并发变化、UAC 和部分失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2128 | — | — | 12709 |
| .ts | source | 54 | 9761 | 8456 | 565 | — |
| .tsx | source | 7 | 1648 | 1490 | 21 | — |
| .mjs | test | 1 | 60 | 53 | 1 | — |
| .tsx | test | 6 | 509 | 460 | 13 | — |
| .ts | test | 24 | 2089 | 1869 | 74 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/kanneiren/dsh-network-settings/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：网络不通时能否定位 DSH 实际路径并有证据地修复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户如何找到 DSH 的第一个网络失败点？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件从当前进程和宿主平台检查网络，再形成诊断图、报告和建议。设置页把 DSH 代理环境、Windows 与 WSL 配置区分，便于判断系统设置和进程实际路径。相对逐个执行系统命令，它统一观察入口；真实 VPN、代理和 DNS 仍需在目标机器验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-18](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/README.md#L7-L18)

作者场景和输出。

<details>
<summary>查看原文（12行）</summary>

```text
DSH 网络设置：为 DeepSeek Harness 提供 Windows / WSL / macOS 网络链路诊断与安全修复。

## 特性

- 自动检测 **Windows 原生**、**WSL 发行版** 与 **macOS** 三种运行模型。
- 展示当前 **DSH 进程** 的真实网络路径、DNS 侧支和第一个失败点；TUN/VPN 虚拟网卡后面自动补出物理出口与真实网关。
- 识别 **配置漂移**：配置不同但网络正常时只提示，不警告。
- 支持 **单次检测** 与 **稳定性检测**，默认目标 DeepSeek、可随时切换；每层探测与整次检测都有超时上限，网络故障也不会长时间无响应。
- 一键复制 **适合 Agent 的 Markdown 网络报告**：固定英文小节标题与 `report-version`、TL;DR 摘要先行、机器可读的诊断码与分层探测延迟。
- **推荐修复** 只在高置信度诊断映射到常用低风险操作时出现（如清理代理残余环境变量、关闭系统代理、刷新 DNS 缓存）；管理员级与高风险操作仅保留在手动目录。
- 持久化修改遵循：**快照 → 预览 → 确认 → 应用 → 重新检测 → 可回滚**。
- UI 使用 DSH 原生组件与 `--dsw-*` token，不建立独立主题。
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:110-145](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/index.ts#L110-L145)

检查、图和诊断的服务调用。

<details>
<summary>查看原文（36行）</summary>

```text
          }
          const reuse = lastInspection !== undefined && lastModelServices !== undefined && lastInspection.windows !== undefined && lastInspection.windows.rawErrors.length === 0
            ? lastInspection
            : undefined
          const inspection = await inspectNetworkSafe(ctx, {
            signal: requestSignal,
            ...options['includeWsl'] === false ? { includeWsl: false } : {},
            targets: [selectedProbe],
            modelServices,
            probePlan: options['probeMode'] === 'multi' ? 'multi' : 'single',
            ...reuse === undefined ? {} : { reuse },
          })
          lastInspection = inspection
          lastModelServices = modelServices
          const networkReport = await buildNetworkReport({
            inspection,
            modelServices,
            targetId: selected.id,
          })
          const diagnosis = await diagnoseFrom(inspection, networkReport.graph)
          const cached: CachedReport = {
            inspection,
            diagnosis,
            ...networkReport.graph === undefined ? {} : { graph: networkReport.graph },
            summary: networkReport.summary,
            targets: networkReport.targets,
            timestamp: new Date().toISOString(),
          }
          await writeJson(LAST_REPORT_FILE, redact(cached))
          const response = redact({
            inspection,
            diagnosis,
            timestamp: cached.timestamp,
            summary: networkReport.summary,
            targets: networkReport.targets,
            ...networkReport.graph === undefined ? {} : { graph: networkReport.graph },
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:157-181](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/index.ts#L157-L181)

推荐修复的置信度筛选。

<details>
<summary>查看原文（25行）</summary>

```text
        case 'repair/recommended': {
          const body = asObject(payload)
          // Full diagnoses carry the confidence needed for the recommendation
          // gate; the bare `actions` form is kept for older callers.
          const diagnoses = Array.isArray(body['diagnoses']) ? body['diagnoses'] as Diagnosis[] : []
          const actions = Array.isArray(body['actions']) ? body['actions'] as DiagnosisAction[] : []
          const sources: Array<{ confidence: number; actions: DiagnosisAction[] }> = diagnoses.length > 0
            ? diagnoses.map(item => ({ confidence: item.confidence, actions: item.actions }))
            : actions.map(action => ({ confidence: 1, actions: [action] }))
          const seenOperations = new Set<string>()
          const recentlyApplied = await recentAdvancedActionIds()
          const recommendations = []
          for (const source of sources) {
            if (source.confidence < RECOMMEND_CONFIDENCE_THRESHOLD) continue
            const operations = source.actions
              .flatMap(action => diagnosisActionOperations(action))
              .filter(operation => platformMatches(operation.platform, process.platform))
              .filter(operation => isRecommendableOperation(operation.id))
              .filter(operation => {
                if (seenOperations.has(operation.id)) return false
                seenOperations.add(operation.id)
                return true
              })
            if (operations.length === 0 || source.actions.length === 0) continue
            recommendations.push({ action: source.actions[0]!, operations })
```

</details>

#### 缺口

- 未探测当前机器或平台
  **影响**：定位准确度未知
  **进一步探讨**：对照人工网络命令并注入单层故障

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照和预览是否构成服务端确认事务？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

applyConfigure 会重新生成 preview、保存 before，再应用并更新 after，具备恢复材料。但请求不携带预览版本或确认 token，前次 UI 确认不能锁定本次配置。rollbackScope 用最新快照生成另一次配置请求，遇敏感字段不可逆则拒绝。需测并发外部改写和部分应用失败。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/configure/index.ts:168-203](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/configure/index.ts#L168-L203)

预览与修改的实际顺序。

<details>
<summary>查看原文（36行）</summary>

```text
export async function previewConfigure(request: ConfigureRequest): Promise<ConfigurePreview> {
  const normalized = normalizeRequest(request)
  const before = await readBefore(normalized.scope)
  const after = plannedAfter(before, normalized)
  const diff = diffJson(before, after)
  return {
    scope: normalized.scope,
    scopeDescription: SCOPE_DESCRIPTIONS[normalized.scope],
    before,
    after,
    diff,
    diffText: summarizeDiff(diff),
    requiresElevation: normalized.scope === 'windows.env.machine',
  }
}

export async function applyConfigure(request: ConfigureRequest): Promise<ConfigureResult> {
  const preview = await previewConfigure(request)
  const snapshot = await saveSnapshot({
    reason: `配置修改: ${preview.scope} ${request.action}`,
    scope: preview.scope as SnapshotScope,
    before: preview.before,
    reversible: true,
  })
  const after = await applyScoped(normalizeRequest(request))
  await updateSnapshotAfter(snapshot.id, after)
  const diff = diffJson(preview.before, after)
  return {
    ...preview,
    before: preview.before,
    after,
    diff,
    diffText: summarizeDiff(diff),
    snapshotId: snapshot.id,
    applied: true,
  }
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:149-154](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/index.ts#L149-L154)

预览和 apply 是分开接口。

```text
        case 'configure/preview':
          return ok(await previewConfigure(payload as ConfigureRequest))
        case 'configure/apply':
          return ok(await applyConfigure(payload as ConfigureRequest))
        case 'snapshot/list':
          return ok({ snapshots: await listSnapshots() })
```

**依据 3 · 源码核查**：[src/host/repair/index.ts:30-49](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/repair/index.ts#L30-L49)

回滚条件与再次应用。

<details>
<summary>查看原文（20行）</summary>

```text
export async function rollbackScope(scope: SnapshotScope): Promise<RollbackResult> {
  const snapshot = await latestSnapshot(scope)
  if (snapshot === undefined) throw new Error(`没有可撤销的修改：${scope}`)
  if (!snapshot.reversible) throw new Error('该快照包含无法安全恢复的敏感字段，请手动恢复')

  if (scope.startsWith('wsl.')) {
    const restored = await rollbackWslSnapshot(scope, snapshot)
    return { snapshot, diff: [], diffText: restored.diffText }
  }

  if (scope === 'windows.hosts') {
    const restored = await rollbackHostsSnapshot(snapshot)
    return { snapshot, diff: [], diffText: restored.diffText }
  }

  const request = rollbackRequest(snapshot)
  if (request === undefined) throw new Error(`暂不支持自动回滚作用域：${scope}`)
  const applied = await applyConfigure(request)
  const diff = diffJson(snapshot.before, applied.after)
  return { snapshot, diff, diffText: summarizeDiff(diff) }
```

</details>

#### 缺口

- 并发、UAC 和应用部分失败未测
  **影响**：无法证明确认内容与实际修改完全一致
  **进一步探讨**：预览后外部改值，再应用和回滚核对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何用诊断先降低修复风险？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先只做报告，把代理环境与人工命令对照，确认目标机器第一个失败层。只在测试环境对低风险单项做预览、应用和复测，再检查快照回退；高风险管理员操作单独审阅。若报告与实际路径矛盾或快照不足，回到系统工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-17](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/README.md#L12-L17)

诊断和修复的预期边界。

```text
- 展示当前 **DSH 进程** 的真实网络路径、DNS 侧支和第一个失败点；TUN/VPN 虚拟网卡后面自动补出物理出口与真实网关。
- 识别 **配置漂移**：配置不同但网络正常时只提示，不警告。
- 支持 **单次检测** 与 **稳定性检测**，默认目标 DeepSeek、可随时切换；每层探测与整次检测都有超时上限，网络故障也不会长时间无响应。
- 一键复制 **适合 Agent 的 Markdown 网络报告**：固定英文小节标题与 `report-version`、TL;DR 摘要先行、机器可读的诊断码与分层探测延迟。
- **推荐修复** 只在高置信度诊断映射到常用低风险操作时出现（如清理代理残余环境变量、关闭系统代理、刷新 DNS 缓存）；管理员级与高风险操作仅保留在手动目录。
- 持久化修改遵循：**快照 → 预览 → 确认 → 应用 → 重新检测 → 可回滚**。
```

**依据 2 · 源码核查**：[src/host/configure/index.ts:168-203](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/configure/index.ts#L168-L203)

实际应用过程。

<details>
<summary>查看原文（36行）</summary>

```text
export async function previewConfigure(request: ConfigureRequest): Promise<ConfigurePreview> {
  const normalized = normalizeRequest(request)
  const before = await readBefore(normalized.scope)
  const after = plannedAfter(before, normalized)
  const diff = diffJson(before, after)
  return {
    scope: normalized.scope,
    scopeDescription: SCOPE_DESCRIPTIONS[normalized.scope],
    before,
    after,
    diff,
    diffText: summarizeDiff(diff),
    requiresElevation: normalized.scope === 'windows.env.machine',
  }
}

export async function applyConfigure(request: ConfigureRequest): Promise<ConfigureResult> {
  const preview = await previewConfigure(request)
  const snapshot = await saveSnapshot({
    reason: `配置修改: ${preview.scope} ${request.action}`,
    scope: preview.scope as SnapshotScope,
    before: preview.before,
    reversible: true,
  })
  const after = await applyScoped(normalizeRequest(request))
  await updateSnapshotAfter(snapshot.id, after)
  const diff = diffJson(preview.before, after)
  return {
    ...preview,
    before: preview.before,
    after,
    diff,
    diffText: summarizeDiff(diff),
    snapshotId: snapshot.id,
    applied: true,
  }
```

</details>

**依据 3 · 源码核查**：[src/host/repair/index.ts:30-49](https://github.com/kanneiren/dsh-network-settings/blob/567ca07bccd2246d96d49ffa849a38b35c2cb016/src/host/repair/index.ts#L30-L49)

回退拒绝条件。

<details>
<summary>查看原文（20行）</summary>

```text
export async function rollbackScope(scope: SnapshotScope): Promise<RollbackResult> {
  const snapshot = await latestSnapshot(scope)
  if (snapshot === undefined) throw new Error(`没有可撤销的修改：${scope}`)
  if (!snapshot.reversible) throw new Error('该快照包含无法安全恢复的敏感字段，请手动恢复')

  if (scope.startsWith('wsl.')) {
    const restored = await rollbackWslSnapshot(scope, snapshot)
    return { snapshot, diff: [], diffText: restored.diffText }
  }

  if (scope === 'windows.hosts') {
    const restored = await rollbackHostsSnapshot(snapshot)
    return { snapshot, diff: [], diffText: restored.diffText }
  }

  const request = rollbackRequest(snapshot)
  if (request === undefined) throw new Error(`暂不支持自动回滚作用域：${scope}`)
  const applied = await applyConfigure(request)
  const diff = diffJson(snapshot.before, applied.after)
  return { snapshot, diff, diffText: summarizeDiff(diff) }
```

</details>

#### 缺口

- 无排障时间和真实修复率
  **影响**：无法估计人工收益
  **进一步探讨**：选 Win、WSL 和 macOS 各一条故障对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
