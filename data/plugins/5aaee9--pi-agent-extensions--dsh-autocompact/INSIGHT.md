# @indexyz/dsh-autocompact

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b8c0c39](https://github.com/5aaee9/pi-agent-extensions/tree/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 1,782](https://img.shields.io/static/v1?label=npm+30d&message=1%2C782&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)
<!-- END META -->

> **功能**：为 DSH 会话或模型设置更早触发自动上下文压缩的阈值。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示该组件将会话和精确模型路由的绝对阈值接到现有压缩后端，同时检查表面节点及工具配对；它不是新的摘要引擎。

> **主要限制**：[Q03](#research-q03) 的状态行不包含会话覆盖，且 [Q02](#research-q02) 的阈值只能触发尝试，不能保证压缩实际发生或将请求严格限制在阈值内。

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
  - [Q01 · 谁需要这个阈值，插件相对宿主原有压缩改变了什么？](#detail-section-11)
  - [Q02 · 阈值怎样解析并选择压缩范围，错误会怎样处理？](#detail-section-12)
  - [Q03 · 界面显示的阈值与会话实际生效值始终一致吗？](#detail-section-13)
  - [Q04 · 要试用需要哪些条件，何时停止并回退？](#detail-section-14)
  - [Q05 · 展示实际阈值来源与结果记录是否能减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要控制长会话上下文压力的 DSH 用户可按模型和会话试设提前压缩阈值，见 [Q01](#research-q01)。

宿主已有自动压缩；插件调整触发条件，复用后端摘要能力，不证明新摘要质量或更低费用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话阈值命令 | 设置、关闭或恢复本会话的插件覆盖 | 依赖当前路由、后端及模型容量；off 不关闭原生压缩 |
| 默认阈值设置 | 为精确路由或部署设置持久默认 | 需要可写 settings；路由容量在使用时验证 |
| 前置压缩 | 触发前保留尾部并调用后端压缩 | 只在测量超过阈值且范围有效时尝试 |
| 状态显示 | 展示配置阈值与测量压力 | 不包含 Session 覆盖，不证明实际压缩 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 与 DSH 兼容版本 | 加载必需 | 运行 Host 和 Client | 声明范围不是实测兼容 |
| commands、tokenMeter、llm | Host 注册必需 | 命令、压力测量及模型容量 | 服务不足时不能完整工作 |
| 当前 Agent 的 compactRegion 后端 | 提前压缩必需 | 替换选中的会话区段 | 缺失时插件不压缩或命令报错 |
| 可用模型容量与保留预算 | 指定阈值必需 | 判断合法范围 | 不匹配时跳过并告警 |
| Client settings 与 slots | 图形设置必需 | 修改持久默认、显示状态 | 无法依赖该界面配置或显示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主、模型窗口和后端 | 以可重做任务开始，保留关键约束 |
| 设置 | 用户为当前路由配置阈值 | 命令显示生效来源；不能只看状态行 |
| 执行 | 用户观察压缩记录与任务结果 | 后端和有效范围可用才尝试压缩 |
| 验收与恢复 | 用户核对约束与累计费用 | 失败时停止并恢复默认，必要时另开会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装及推理费用未知 | 配置与检查窗口、后端 | 宿主兼容未知 |
| 持续使用 | 压缩摘要消耗模型 token | 核对摘要与约束 | 净节省未经对照 |
| 失败恢复 | 重试与推理费用未知 | 补回上下文或重做任务 | 后端故障事务未验证 |
| 退出 | 原生压缩仍可能产生费用 | 恢复默认并重建必要约束 | 命令受前置检查约束 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自定义触发 | 三级阈值及 pre-step 调用 | 实际合格率与最佳阈值 |
| 保留结构 | 避免拆分工具调用配对 | 摘要保留业务约束 |
| 费用控制 | 可改变触发时机 | 任务总费用与人工成本 |

> **思考**：[Q03](#research-q03) 的状态行不包含会话覆盖，且 [Q02](#research-q02) 的阈值只能触发尝试，不能保证压缩实际发生或将请求严格限制在阈值内。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示该组件将会话和精确模型路由的绝对阈值接到现有压缩后端，同时检查表面节点及工具配对；它不是新的摘要引擎。

[Q02](#research-q02) 将覆盖绑定到真实 Session，并在压缩前检查测量节点和 surface 一致性及工具配对；异常不中断主步骤，但也意味着触发阈值不是成功保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的状态行不包含会话覆盖，且 [Q02](#research-q02) 的阈值只能触发尝试，不能保证压缩实际发生或将请求严格限制在阈值内。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在可重做的单路由任务中记录摘要、约束和总成本；若结果退化或 warning 持续，停止试用并按命令语义恢复默认。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持阈值优先级、前置压缩调用及界面局限；真实摘要质量、成本和宿主兼容未知。状态投影是假设。

- 已检查：作者 README、包清单、源码路径 dsh-autocompact/README.md、dsh-autocompact/package.json、dsh-autocompact/index.ts、dsh-autocompact/settings.ts、dsh-autocompact/compaction.ts、dsh-autocompact/src/client/status-dock.tsx、dsh-autocompact/src/client/dictionary.ts、dsh-autocompact/src/client/page.tsx、dsh-autocompact/src/client/index.tsx 及固定范围 inventory；组件：dsh-autocompact。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查组件 Host 入口、设置、范围选择、Client 设置与状态行及包声明；未审完整宿主后端、全部 UI 或发布制品。
- 下一步：在隔离环境对比不同阈值、Session 覆盖、无后端、错误及取消情形；本次未安装或执行目标代码、测试、真实宿主和模型任务。

**分析版本**

- **仓库**：[5aaee9/pi-agent-extensions](https://github.com/5aaee9/pi-agent-extensions)
- **版本号**：0.2.2（[固定提交 b8c0c39](https://github.com/5aaee9/pi-agent-extensions/tree/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设将当前 Session 的有效阈值来源与压缩结果投影到状态行，可减少误判；尚未实现和验证。

在隔离环境对比不同阈值、Session 覆盖、无后端、错误及取消情形；本次未安装或执行目标代码、测试、真实宿主和模型任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1377 | — | — | 17411 |
| .ts | source | 12 | 1497 | 921 | 473 | — |
| .tsx | source | 6 | 1009 | 770 | 184 | — |
| .ts | test | 9 | 2282 | 1767 | 332 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)

暂未获取：近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对阈值设置、实际压缩路径和界面状态差异，明确采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这个阈值，插件相对宿主原有压缩改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要管理长会话上下文的 DSH 用户可以为当前会话和精确的 provider/model 路由设置较早的绝对 token 阈值，也可通过设置页配置持久的路由或部署默认值。原有后端已经有自动压缩；此插件在 Agent 下一步前根据测量尝试选定区间并调用同一个后端，不负责实现摘要模型，也不更改真实上下文窗口。它提供按路由及会话控制触发时机，适合愿意比较摘要质量和总成本、能重做任务的人；较高阈值不会推迟原生压缩，较低阈值也可能增加摘要次数。没有同任务比较，不能认为一定降低费用或避免丢上下文。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-autocompact/README.md:1-5](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/README.md#L1-L5)

作者说明提前设置阈值及上游移植关系。

```text
# @indexyz/dsh-autocompact

Set an earlier automatic compaction threshold per model, or for every model at once, on
the [dsh (DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) coding
agent. This is the dsh port of [`@indexyz/pi-autocompact`](https://github.com/5aaee9/pi-agent-extensions/tree/main/pi-autocompact).
```

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:249-287](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L249-L287)

前置步骤测量并调用实际压缩后端。

<details>
<summary>查看原文（39行）</summary>

```text
  const checkPressure = async (agent: Agent, signal: AbortSignal): Promise<void> => {
    if (!liveValue(config.enabled, true) || signal.aborted) return;
    const target = targetOf(agent);
    if (target === undefined) return;
    const key = modelKey(target.provider, target.model);
    const limit = resolveLimit(
      stateOf(agent.session).overrides,
      limitsNow(),
      key,
      defaultLimitNow(),
    );
    if (limit === undefined) return;
    const backend = backendFor(ctx, agent);
    if (backend === undefined || !nativeAutoEnabled(backend)) return;
    const measurement = ctx.tokenMeter.measure(agent.session);
    if (!needsCompaction(measurement, limit)) return;
    if (!supportsRegions(backend)) {
      warnOnce(
        agent.session,
        "the mounted compaction backend does not support compactRegion; thresholds have no effect",
      );
      return;
    }
    const route = await routeInfo(agent, backend, signal);
    if (route === undefined || route.contextWindow === undefined) {
      warnOnce(
        agent.session,
        `no context capacity for ${key}; configure contextWindow on that adapter model`,
      );
      return;
    }
    if (signal.aborted) return;
    validateLimit(limit, route.contextWindow, route.retainTokens);
    const range = selectCompactableRange(agent.session, measurement, route.retainTokens);
    if (range === undefined) return;
    ctx.logger.info(
      `autocompact: compacting ${key} above ${limit.toLocaleString("en-US")} tokens (${measurement.totalTokens.toLocaleString("en-US")} measured)`,
    );
    await backend.compactRegion(range.start, range.end, agent, signal);
```

</details>

**依据 3 · 作者声明**：[dsh-autocompact/README.md:234-241](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/README.md#L234-L241)

作者说明越限、原生阈值和摘要代价边界。

```text
- Thresholds are not strict request-size caps: one turn or tool batch can
  overshoot. If an indivisible or too-small context cannot retain recent content
  and shrink, the plugin leaves it to the backend's overflow or manual
  compaction.
- The backend's automatic threshold is untouched, so a plugin threshold above it
  never delays compaction.
- Summary generation consumes model tokens. Failures leave context intact and are
  not retried at the same boundary; a subsequent step can try again.
```

#### 缺口

- 没有同任务的摘要质量或费用对照
  **影响**：不能判断更早触发是否划算
  **进一步探讨**：对同一长任务比较原生默认及多个阈值的合格率、输入输出成本和恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 阈值怎样解析并选择压缩范围，错误会怎样处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Session 内覆盖优先于精确路由默认值，再到部署默认；显式 off 屏蔽插件这两层默认，不关闭后端自身压缩。状态用 WeakMap 绑定真实 Session，命令修改内存而不写配置。每次 Agent pre-step 先确认启用与路由，找该 Agent 的 preset 后端，缺省回退 Host；测量 totalTokens 严格大于阈值才继续。上下文容量、保留尾部预算和 compactRegion 均须满足；测量节点与当前 surface 必须逐项一致，且保留最近尾部及完整工具调用配对。无法选择范围时跳过，抛错在钩子记录一次警告后继续 next，因此阈值是尝试触发点而不是硬上限；摘要质量与故障后上下文完整性仍依赖宿主后端。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/settings.ts:93-108](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/settings.ts#L93-L108)

三层优先级与 off 抑制默认。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Resolve the effective absolute threshold for one route.
 *
 * A session override always wins, including an explicit `null` that suppresses
 * every persisted layer. Below it an exact `provider/model` entry wins over the
 * deployment-wide default; with neither configured the route has no threshold
 * and autocompact stays off for it.
 */
export function resolveLimit(
  overrides: ReadonlyMap<string, number | null>,
  defaults: ReadonlyMap<string, number>,
  key: string,
  defaultLimit?: number,
): number | undefined {
  if (overrides.has(key)) return overrides.get(key) ?? undefined;
  return defaults.get(key) ?? defaultLimit;
```

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:195-205](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L195-L205)

Session 对象对应内存覆盖与警告状态。

<details>
<summary>查看原文（11行）</summary>

```text
  // Session-only state, keyed by the live Session object so a new, resumed, or
  // forked session starts clean and a detached session is collected.
  const sessions = new WeakMap<Session, SessionState>();

  const stateOf = (session: Session): SessionState => {
    let state = sessions.get(session);
    if (state === undefined) {
      state = { overrides: new Map(), warned: new Set() };
      sessions.set(session, state);
    }
    return state;
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:160-170](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L160-L170)

先找 Agent preset 后端再回退 Host。

<details>
<summary>查看原文（11行）</summary>

```text
export function backendFor(ctx: Context, agent: Agent): CompactionEngine | undefined {
  try {
    // No service, or a registry object without the method: there is no preset
    // backend. A throw from a torn-down scope is the same outcome, below.
    const presets: AgentPresetRegistry | undefined = ctx.get("agentPresets");
    const mounted = presets?.serviceFor?.(agent, "compaction");
    if (mounted !== undefined) return mounted;
  } catch {
    // A torn-down scope or an absent preset runtime leaves only the Host plane.
  }
  return ctx.get("compaction");
```

</details>

**依据 4 · 源码核查**：[dsh-autocompact/index.ts:249-302](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L249-L302)

触发、检查和异常后继续主流程。

<details>
<summary>查看原文（54行）</summary>

```text
  const checkPressure = async (agent: Agent, signal: AbortSignal): Promise<void> => {
    if (!liveValue(config.enabled, true) || signal.aborted) return;
    const target = targetOf(agent);
    if (target === undefined) return;
    const key = modelKey(target.provider, target.model);
    const limit = resolveLimit(
      stateOf(agent.session).overrides,
      limitsNow(),
      key,
      defaultLimitNow(),
    );
    if (limit === undefined) return;
    const backend = backendFor(ctx, agent);
    if (backend === undefined || !nativeAutoEnabled(backend)) return;
    const measurement = ctx.tokenMeter.measure(agent.session);
    if (!needsCompaction(measurement, limit)) return;
    if (!supportsRegions(backend)) {
      warnOnce(
        agent.session,
        "the mounted compaction backend does not support compactRegion; thresholds have no effect",
      );
      return;
    }
    const route = await routeInfo(agent, backend, signal);
    if (route === undefined || route.contextWindow === undefined) {
      warnOnce(
        agent.session,
        `no context capacity for ${key}; configure contextWindow on that adapter model`,
      );
      return;
    }
    if (signal.aborted) return;
    validateLimit(limit, route.contextWindow, route.retainTokens);
    const range = selectCompactableRange(agent.session, measurement, route.retainTokens);
    if (range === undefined) return;
    ctx.logger.info(
      `autocompact: compacting ${key} above ${limit.toLocaleString("en-US")} tokens (${measurement.totalTokens.toLocaleString("en-US")} measured)`,
    );
    await backend.compactRegion(range.start, range.end, agent, signal);
  };

  ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
    try {
      await checkPressure(agent, signal);
    } catch (error) {
      if (!signal.aborted) {
        warnOnce(
          agent.session,
          `compaction failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return next();
  });
```

</details>

**依据 5 · 源码核查**：[dsh-autocompact/compaction.ts:23-33](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/compaction.ts#L23-L33)

严格大于阈值才触发。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Whether the measured request pressure already crossed the effective absolute
 * threshold. Unknown or absent usage is never above it.
 */
export function needsCompaction(
  measurement: Pick<TokenMeasurement, "totalTokens">,
  limit: number,
): boolean {
  const tokens = measurement.totalTokens;
  return typeof tokens === "number" && tokens > limit;
}
```

</details>

**依据 6 · 源码核查**：[dsh-autocompact/compaction.ts:56-87](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/compaction.ts#L56-L87)

核对 surface、保留尾部和工具配对边界。

<details>
<summary>查看原文（32行）</summary>

```text
export function selectCompactableRange(
  session: Session,
  measurement: Pick<TokenMeasurement, "nodes">,
  retainTokens: number,
): CompactableRange | undefined {
  const pricedNodes = measurement.nodes;
  if (pricedNodes.length === 0) return undefined;
  const surfaceNodes = session.surface.nodes;
  if (
    surfaceNodes.length !== pricedNodes.length ||
    surfaceNodes.some((seq, index) => seq !== pricedNodes[index]?.seq)
  ) {
    throw new Error("autocompact: token-meter surface does not match the current session surface");
  }
  const firstIdx = systemHead(session, surfaceNodes[0]) === undefined ? 0 : 1;
  let accumulated = 0;
  let keepFromIdx = pricedNodes.length;
  for (let index = pricedNodes.length - 1; index >= 0; index -= 1) {
    accumulated += pricedNodes[index].tokens;
    keepFromIdx = index;
    if (accumulated >= retainTokens) break;
  }
  if (keepFromIdx <= firstIdx) return undefined;
  while (keepFromIdx > firstIdx) {
    if (toolPairingBalancedBefore(session, surfaceNodes[keepFromIdx])) break;
    keepFromIdx -= 1;
  }
  if (keepFromIdx <= firstIdx) return undefined;
  return {
    start: surfaceNodes[firstIdx],
    end: surfaceNodes[keepFromIdx - 1],
  };
```

</details>

#### 缺口

- 未检查当前宿主 compactRegion 的摘要语义和失败事务
  **影响**：不能证明任何故障下原上下文保持完整
  **进一步探讨**：查看同版本宿主具体实现并在隔离任务注入后端错误、取消和过大消息。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 界面显示的阈值与会话实际生效值始终一致吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不一定。Host 的命令将会话覆盖存在内存，状态行从持久配置读取精确路由或部署默认，没有读取该覆盖。实际命令设为 off 或不同数值后，状态行仍可能展示持久值；tooltip 的“超过即压缩”也未表达后端缺失、容量不明、范围不足或实际覆盖。命令本身会报告当前生效来源，使用者不应仅凭状态行判断。另一个边界是即便执行 off 或 default，命令也先检查后端支持和模型容量，依赖不满足时会返回错误而未更改覆盖；设置页的 revision 冲突则重新加载并显示警告。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:9-17](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/src/client/status-dock.tsx#L9-L17)

组件说明状态行仅读取持久默认，不读 Session 覆盖。

```text
 * - the session's current route from the `modelSelection` projection,
 * - the measured pressure from the `contextPressure` projection,
 * - the configured thresholds from {@link module:@indexyz/dsh-autocompact/client/config-store}.
 *
 * The configured value is the deployment default for that route, or the
 * deployment-wide default when the route has no entry of its own. A session can
 * override it with `/autocompact`, and that override lives in Host memory for
 * the session only, so this line reports the persisted value rather than
 * claiming to be the effective one.
```

**依据 2 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:188-209](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/src/client/status-dock.tsx#L188-L209)

实际只按配置路由及默认值计算显示。

<details>
<summary>查看原文（22行）</summary>

```text
  if (snapshot.state !== "ready") return null;

  const enabled = snapshot.config.enabled;
  const route = routeOf(selection);
  // The route's own entry wins; without one the deployment default covers it.
  const limit =
    route === undefined
      ? undefined
      : (snapshot.config.limits[route] ?? snapshot.config.defaultLimit);
  // An off switch was a deliberate choice and is what stops every threshold, so it
  // is reported whatever model the session uses.
  if (!enabled) {
    return (
      <StatusPill
        state="off"
        title={t("dockTitleOff", { action: t("dockAction") })}
        text={t("dockOff")}
      />
    );
  }
  // Under an on switch, a model with no threshold is a non-event: no seat.
  if (limit === undefined) return null;
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/src/client/dictionary.ts:86-91](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/src/client/dictionary.ts#L86-L91)

中文提示文案宣称超过即压缩。

```text
    dockOff: "已关闭",
    // 两行以内：一行读数含义，一行点击去向。
    dockAction: "点击打开设置",
    dockTitleLimit: "{route}：超过 {limit} 即压缩\n{action}",
    dockTitleLimitNow: "{route}：{tokens} / {limit}\n{action}",
    dockTitleOff: "自动阈值已关闭\n{action}",
```

**依据 4 · 源码核查**：[dsh-autocompact/index.ts:304-344](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L304-L344)

命令先检查后端和容量，再处理 off/default。

<details>
<summary>查看原文（41行）</summary>

```text
  const handler = async (invocation: CommandInvocation): Promise<CommandResult> => {
    const { agent, rawInput, signal } = invocation;
    try {
      const target = targetOf(agent);
      if (target === undefined) return { kind: "error", text: "No model selected" };
      const key = modelKey(target.provider, target.model);
      const backend = backendFor(ctx, agent);
      if (backend === undefined) {
        return { kind: "error", text: `No compaction backend is mounted for ${key}` };
      }
      if (!supportsRegions(backend)) {
        return {
          kind: "error",
          text: "Autocompact requires a compaction backend that supports compactRegion (dsh-compaction 0.2.0-rc.2 or newer)",
        };
      }
      const nativeOff = !nativeAutoEnabled(backend);
      const route = await routeInfo(agent, backend, signal);
      if (route === undefined || route.contextWindow === undefined) {
        return {
          kind: "error",
          text: `No context capacity for ${key}; configure contextWindow on that adapter model`,
        };
      }
      const input = rawInput.trim().toLowerCase();
      const state = stateOf(agent.session).overrides;
      if (input === "off") state.set(key, null);
      else if (input === "default") state.delete(key);
      else if (input) {
        const limit = parseLimit(input);
        validateLimit(limit, route.contextWindow, route.retainTokens);
        if (nativeOff) {
          return {
            kind: "error",
            text: "Automatic compaction is disabled by the compaction backend. Enable it before setting a threshold.",
          };
        }
        state.set(key, limit);
      }
      const defaults = limitsNow();
      const limit = resolveLimit(state, defaults, key, defaultLimitNow());
```

</details>

**依据 5 · 源码核查**：[dsh-autocompact/src/client/page.tsx:167-180](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/src/client/page.tsx#L167-L180)

设置修改携带 revision，冲突时重新加载。

<details>
<summary>查看原文（14行）</summary>

```text
    if (ops.length === 0) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await settings.mutate(state.ns, ops, state.revision);
      if (response.ok) {
        applyView(response.value, state.writable);
        setNotice({ kind: "success", text: t("saved") });
        return;
      }
      if (response.error?.code === "settings/conflict") {
        setNotice({ kind: "warn", text: t("conflict") });
        await load();
        return;
```

</details>

#### 缺口

- 实际宿主对界面 tooltip、命令与冲突的呈现未运行验证
  **影响**：不能断言用户实际误操作频率
  **进一步探讨**：在同一会话设置 off、另一阈值和不同路由，比较状态行、命令输出及实际压缩记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 要试用需要哪些条件，何时停止并回退？

**研究主题**：效果与总成本、采用判断

#### 完整回答

组件包声明 Node 22.19 以上、DSH >=0.2.0-rc.2 且低于 0.3.0-0，并依赖 tokenMeter、LLM 和命令服务；压缩还要求为当前 Agent 找到支持 compactRegion 的后端与真实 contextWindow。设置默认阈值只检查正整数，真正处理某路由时还要小于窗口、大于保留预算；无适合范围或缺信息不会执行压缩。建议从可重做的单路由任务试验，记录实际摘要事件、关键约束、累计 token 和人工恢复成本；一旦摘要遗漏约束、费用或错误明显上升，先使用命令 default 或 off 回退到插件默认或后端默认，并核对结果。off 不能关闭后端自动压缩，清除覆盖也依赖命令前置检查；不能把显示值当成效果保证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/package.json:81-97](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/package.json#L81-L97)

包的 peer 和引擎声明。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-agent": "*",
    "@deepseek-ai/dsh-agent-preset-registry": "*",
    "@deepseek-ai/dsh-commands": "*",
    "@deepseek-ai/dsh-compaction": "*",
    "@deepseek-ai/dsh-llm": "*",
    "@deepseek-ai/dsh-session": "*",
    "@deepseek-ai/dsh-token-meter": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "release": {
    "smoke": "test/smoke-release.ts"
  },
  "engines": {
    "dsh": ">=0.2.0-rc.2 <0.3.0-0",
    "node": ">=22.19.0"
```

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:43-47](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L43-L47)

Host 注册服务依赖。

```text
/** Plugin identity used by the Loader and by diagnostics. */
export const name = "autocompact";

/** Host-plane services this plugin needs before it can register its command and hook. */
export const inject = ["commands", "tokenMeter", "llm"];
```

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:261-283](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L261-L283)

后端能力、模型容量和合法范围检查。

<details>
<summary>查看原文（23行）</summary>

```text
    const backend = backendFor(ctx, agent);
    if (backend === undefined || !nativeAutoEnabled(backend)) return;
    const measurement = ctx.tokenMeter.measure(agent.session);
    if (!needsCompaction(measurement, limit)) return;
    if (!supportsRegions(backend)) {
      warnOnce(
        agent.session,
        "the mounted compaction backend does not support compactRegion; thresholds have no effect",
      );
      return;
    }
    const route = await routeInfo(agent, backend, signal);
    if (route === undefined || route.contextWindow === undefined) {
      warnOnce(
        agent.session,
        `no context capacity for ${key}; configure contextWindow on that adapter model`,
      );
      return;
    }
    if (signal.aborted) return;
    validateLimit(limit, route.contextWindow, route.retainTokens);
    const range = selectCompactableRange(agent.session, measurement, route.retainTokens);
    if (range === undefined) return;
```

</details>

**依据 4 · 源码核查**：[dsh-autocompact/settings.ts:42-54](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/settings.ts#L42-L54)

阈值必须高于保留预算并低于窗口。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Validate one absolute threshold against the recent-tail budget the compaction
 * backend will keep verbatim and against the real model context window.
 */
export function validateLimit(limit: number, contextWindow: number, retainTokens: number): void {
  if (!Number.isSafeInteger(limit) || limit <= retainTokens) {
    throw new Error(
      `Threshold must be an integer greater than the retained token budget (${retainTokens})`,
    );
  }
  if (!Number.isSafeInteger(contextWindow) || contextWindow <= 0 || limit >= contextWindow) {
    throw new Error(`Threshold must be less than the model context window (${contextWindow})`);
  }
```

</details>

**依据 5 · 作者声明**：[dsh-autocompact/README.md:31-49](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/README.md#L31-L49)

命令和重置语义的作者声明。

<details>
<summary>查看原文（19行）</summary>

````text
```text
/autocompact 300k    # 300,000 tokens, current session/model only
/autocompact 0.3m    # same threshold; k/m are decimal units
/autocompact 300000
/autocompact         # show current threshold and native enabled state
/autocompact off     # use the backend defaults, ignoring global plugin defaults in this session
/autocompact default # clear the session override and inherit the global default
```

Commands never write configuration, append threshold entries to the session log,
reload plugins, or modify the model's real context-window metadata. Overrides are
keyed by exact `provider/model`. Switching models preserves each model's session
override; new, resumed, and forked sessions start clean. `off` does not disable
the backend's own automatic compaction or overflow recovery.

The effective threshold for a route is resolved in this order: the session's
`/autocompact` override (an explicit `off` suppresses everything below it), the
route's own entry in `modelLimits`, then the deployment-wide `defaultLimit`. A
route with none of these keeps the backend's own automatic compaction.
````

</details>

#### 缺口

- 未实际安装、对账或运行任务
  **影响**：不知道真实兼容、费时及错误率
  **进一步探讨**：隔离 profile 验证一条可重做任务，比较约束保留、令牌及恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 展示实际阈值来源与结果记录是否能减少误判？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：让 Host 为当前 Session 暴露生效路由、阈值来源、后端可用性及最近一次尝试结果，再让状态行消费它，可能减少只看部署默认值导致的误判。增量不是再加一个静态设置显示，而是将当前内存覆盖和失败结果投影给相同 Session 的界面；需要生命周期清理和隔离，不应暴露其他会话配置。可在同一任务比较现有与候选界面，记录 off、无后端和压缩失败三种情况下用户是否能正确判断。若投影常过期、跨 Session 串值或不能改善判断，则推翻该假设；现版本没有这条投影接线。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:328-358](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L328-L358)

命令拥有会话覆盖及来源判断。

<details>
<summary>查看原文（31行）</summary>

```text
      const input = rawInput.trim().toLowerCase();
      const state = stateOf(agent.session).overrides;
      if (input === "off") state.set(key, null);
      else if (input === "default") state.delete(key);
      else if (input) {
        const limit = parseLimit(input);
        validateLimit(limit, route.contextWindow, route.retainTokens);
        if (nativeOff) {
          return {
            kind: "error",
            text: "Automatic compaction is disabled by the compaction backend. Enable it before setting a threshold.",
          };
        }
        state.set(key, limit);
      }
      const defaults = limitsNow();
      const limit = resolveLimit(state, defaults, key, defaultLimitNow());
      // Name the layer the effective threshold came from: the session, an exact
      // `provider/model` default, or the deployment-wide fallback.
      const source = state.has(key)
        ? "session"
        : defaults.has(key)
          ? "global default"
          : "deployment default";
      const threshold =
        limit === undefined
          ? "backend default compaction (no plugin threshold)"
          : `autocompact above ${limit.toLocaleString("en-US")} tokens (${source})`;
      return {
        kind: "success",
        text: `${key}: ${threshold}. Native automatic compaction: ${nativeOff ? "disabled" : "enabled"}. No configuration written.`,
```

</details>

**依据 2 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:188-209](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/src/client/status-dock.tsx#L188-L209)

状态行目前只消费持久配置。

<details>
<summary>查看原文（22行）</summary>

```text
  if (snapshot.state !== "ready") return null;

  const enabled = snapshot.config.enabled;
  const route = routeOf(selection);
  // The route's own entry wins; without one the deployment default covers it.
  const limit =
    route === undefined
      ? undefined
      : (snapshot.config.limits[route] ?? snapshot.config.defaultLimit);
  // An off switch was a deliberate choice and is what stops every threshold, so it
  // is reported whatever model the session uses.
  if (!enabled) {
    return (
      <StatusPill
        state="off"
        title={t("dockTitleOff", { action: t("dockAction") })}
        text={t("dockOff")}
      />
    );
  }
  // Under an on switch, a model with no threshold is a non-event: no seat.
  if (limit === undefined) return null;
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:290-301](https://github.com/5aaee9/pi-agent-extensions/blob/b8c0c39970242c9f433d99a1cdf88afbbbec4a4c/dsh-autocompact/index.ts#L290-L301)

异常只记录 warning 并继续下一步。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
    try {
      await checkPressure(agent, signal);
    } catch (error) {
      if (!signal.aborted) {
        warnOnce(
          agent.session,
          `compaction failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return next();
```

</details>

#### 缺口

- 会话状态投影及用户对照尚未实现
  **影响**：无法证明能降低误判
  **进一步探讨**：先在隔离环境构建带生命周期的投影原型并验证不同会话及失败路径。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
