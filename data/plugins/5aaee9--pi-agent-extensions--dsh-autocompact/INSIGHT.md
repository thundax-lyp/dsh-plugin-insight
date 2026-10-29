# @indexyz/dsh-autocompact

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f403424](https://github.com/5aaee9/pi-agent-extensions/tree/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 1,270](https://img.shields.io/static/v1?label=npm+30d&message=1%2C270&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)
<!-- END META -->

> **功能**：按会话和精确模型路由设置提前压缩阈值，调用宿主摘要并保留结构尾部。

> **亮点**：把精确route/Session控制与宿主范围压缩接线，保持真实窗口和结构配对前提。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：阈值是触发尝试非硬上限，pill不含Session覆盖，off/default仍需backend和容量，语义/总成本未验。见[Q03](#research-q03)。

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
  - [Q01 · 谁需要绝对阈值提前摘要，比原生/手动多什么？](#detail-section-11)
  - [Q02 · 有效阈值、Agent后端和范围如何保证接到同一对象？](#detail-section-12)
  - [Q03 · 提前阈值是硬保护吗，状态和恢复可信吗？](#detail-section-13)
  - [Q04 · 准备条件、一次试用和全成本怎样组织？](#detail-section-14)
  - [Q05 · 谁可有限试用，什么方向值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：熟悉原生摘要的长会话开发者，结果看约束保留与合格任务成本。见[Q01](#research-q01)。

原生默认或手动compact更直接；插件增加绝对触发偏好，不改宿主摘要算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Session/route/default阈值 | 控制提前摘要时机 | 绝对值大于tail小于窗口，不是硬上限 |
| 平衡前缀选择 | 保留system/近期与工具配对 | 测量须匹配surface，不保证摘要语义 |
| /autocompact | 临时覆盖/恢复/查来源 | off/default也先需backend/容量 |
| 设置与状态pill | 部署默认与压力可见 | 不含内存Session覆盖，命令另有有效值 |
| 原生摘要回退 | 不阻断正常回合 | 失败next继续，off不关宿主溢出恢复 |

**流程与依赖**

匹配tokenMeter/LLM元数据、Agent后端和compactRegion；TS源码需构建或对应包。表见[Q04](#research-q04)。

单route先确认容量/tail和命令来源，跨阈值核摘要，再同任务看总成本；恢复命令有前提。步骤见[Q04](#research-q04)。

**效果与成本**

更少输入可能用更多摘要和纠错换得，单位为合格长任务。完整表见[Q04](#research-q04)。

结构前提可核，最优阈值/语义与净费用仍需对照；有限试用以可重做任务收敛。见[Q05](#research-q05)。

> **思考**：阈值是触发尝试非硬上限，pill不含Session覆盖，off/default仍需backend和容量，语义/总成本未验。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把精确route/Session控制与宿主范围压缩接线，保持真实窗口和结构配对前提。见[Q01](#research-q01)、[Q02](#research-q02)。

WeakMap真实Session、精确Agent/route与surface逐项一致可借鉴，摘要语义交宿主。见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

阈值是触发尝试非硬上限，pill不含Session覆盖，off/default仍需backend和容量，语义/总成本未验。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可重做单route有限试用，丢约束或总成本升即回原生；非安装验收。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持控制与结构范围；摘要质量/净费用无对照，可在单route可重做任务有限试用。

- 已检查：作者 README、包清单、源码路径 dsh-autocompact/README.md、dsh-autocompact/compaction.ts、dsh-autocompact/index.ts、dsh-autocompact/package.json、dsh-autocompact/settings.ts、dsh-autocompact/src/client/status-dock.tsx 及固定范围 inventory；组件：dsh-autocompact。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件入口、三级设置/命令、Agent后端、测量/范围、状态显示与失败继续；旧root README变动另核，未审宿主摘要实现或完整客户端/制品。
- 下一步：未执行目标构建/测试；宿主加载归范围边界，语义/失效服务/总成本为研究缺口。

**分析版本**

- **仓库**：[5aaee9/pi-agent-extensions](https://github.com/5aaee9/pi-agent-extensions)
- **版本号**：0.2.1（[固定提交 f403424](https://github.com/5aaee9/pi-agent-extensions/tree/f40342432ce8afea87a640e183d1c8a3a1679c0a)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把命令已有有效来源投影UI，并绑定阈值实验/质量/成本收据，能否减少误判和总恢复成本待验证。见[Q05](#research-q05)。

未执行目标构建/测试；宿主加载归范围边界，语义/失效服务/总成本为研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1371 | — | — | 17380 |
| .ts | source | 12 | 1497 | 921 | 473 | — |
| .tsx | source | 6 | 1009 | 770 | 184 | — |
| .ts | test | 6 | 1709 | 1448 | 112 | — |

</details>

**活跃度**

[![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：提前阈值能否保留任务约束并改善全部摘要/请求/人工总成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要绝对阈值提前摘要，比原生/手动多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合长会话开发、理解宿主原生压缩且愿核摘要质量的用户。原生比例窗口或手动compact是直接基线；插件让精确provider/model有绝对token触发值，可用当前Session临时覆盖，也可部署默认。

合格结果是同任务摘要后继续正确、关键约束保留且总费用合理；压缩触发或上下文变短本身不是验收。作者明确这是pi-autocompact的DSH移植，摘要仍调用宿主backend，不能把上游选择算法或宿主模型当本插件原创。

增量在路由/Session控制、测量与当前surface一致性、保留tail和工具配对的接线；不修改真实模型窗口元数据，也不保证自动找到最优阈值。本轮旧组件引用材料同字节，但固定版本重新核了主链和恢复前提。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-autocompact/README.md:1-5](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/README.md#L1-L5)

作者DSH移植及阈值定位。

```text
# @indexyz/dsh-autocompact

Set an earlier automatic compaction threshold per model, or for every model at once, on
the [dsh (DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) coding
agent. This is the dsh port of [`@indexyz/pi-autocompact`](https://github.com/5aaee9/pi-agent-extensions/tree/main/pi-autocompact).
```

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:249-287](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L249-L287)

解析阈值、测量和原生compactRegion调用。

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

#### 缺口

- 缺同任务原生/手动/提前阈值的质量与总成本对照。
  **影响**：不能把提前摘要推为更便宜或更准确。
  **进一步探讨**：可重做长任务固定约束清单，比较全部摘要费用、遗漏和恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 有效阈值、Agent后端和范围如何保证接到同一对象？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

pre-step先取当前Agent的provider/model，Session对象WeakMap覆盖优先，其次精确route部署条目，再全局默认；无值不提前触发，off在当前route存null压住持久层，default删覆盖恢复继承。Map只跟真实Session对象，换成新对象就不继承，不把临时阈值写回配置。

backendFor先找agentPresets.serviceFor(agent,compaction)，缺服务/方法/销毁异常再回Host compaction。它避免静态导入已移除free export导致启动失败，也保留实际Agent身份；源码兼容安排不等两个宿主版本已加载验收。原生auto明确false就跳过，未知policy按可用处理；还需compactRegion和真实contextWindow。

tokenMeter.measure(session)超过阈值后，路由容量与原生retain/保留输出预算用于校验阈值。范围选择要求测量nodes与当前surface的长度和seq逐项一致，保留头部system和按token计的最近tail，再向前找tool-pair平衡边界。它保证结构前提，摘要语义仍继承宿主；只有找到合法非空范围才compactRegion。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:195-205](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L195-L205)

WeakMap绑定真实Session。

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

**依据 2 · 源码核查**：[dsh-autocompact/settings.ts:94-108](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/settings.ts#L94-L108)

Session/exact route/default优先级。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:160-170](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L160-L170)

Agent realm后端与Host回退。

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

**依据 4 · 源码核查**：[dsh-autocompact/settings.ts:136-150](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/settings.ts#L136-L150)

未知auto policy与方法检测。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Whether the mounted backend still performs automatic compaction. An absent
 * policy counts as enabled, so unknown backends keep working.
 */
export function nativeAutoEnabled(engine: unknown): boolean {
  return nativePolicy(engine)?.auto !== false;
}

/**
 * Whether the mounted backend supports compacting an explicit surface region,
 * which is the capability an earlier threshold is expressed through.
 */
export function supportsRegions(engine: unknown): boolean {
  return typeof (engine as { compactRegion?: unknown } | undefined)?.compactRegion === "function";
}
```

</details>

**依据 5 · 源码核查**：[dsh-autocompact/index.ts:216-241](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L216-L241)

真实route容量/输出保留。

<details>
<summary>查看原文（26行）</summary>

```text
  const routeInfo = async (
    agent: Agent,
    backend: CompactionEngine,
    signal?: AbortSignal,
  ): Promise<RouteInfo | undefined> => {
    const target = targetOf(agent);
    if (target === undefined) return undefined;
    const info = await ctx.llm.resolveModelInfo(target.provider, target.model, signal);
    const contextWindow = info.context?.contextWindow;
    const reserved = agent.session.requestHeader()?.config.maxTokens ?? info.defaultMaxTokens ?? 0;
    return {
      target,
      key: modelKey(target.provider, target.model),
      contextWindow,
      retainTokens:
        contextWindow === undefined
          ? fallbackRetainTokens
          : nativeRetainTokens(
              nativePolicy(backend),
              target.provider,
              target.model,
              contextWindow,
              reserved,
              fallbackRetainTokens,
            ),
    };
```

</details>

**依据 6 · 源码核查**：[dsh-autocompact/index.ts:249-287](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L249-L287)

pre-step完整触发链。

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

**依据 7 · 源码核查**：[dsh-autocompact/compaction.ts:60-87](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/compaction.ts#L60-L87)

surface身份、system/tail与配对范围。

<details>
<summary>查看原文（28行）</summary>

```text
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

**依据 8 · 源码核查**：[dsh-autocompact/settings.ts:46-54](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/settings.ts#L46-L54)

阈值大于tail且小于窗口。

```text
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提前阈值是硬保护吗，状态和恢复可信吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不是硬上限。未知测量不触发；无backend、native auto关闭、无窗口、不可拆范围或tail太大均可能跳过，失败catch后next继续。一次摘要后也没有源码证明重测到阈值以下再准许请求；不要用提前阈值代替宿主溢出恢复或预算阻断。

状态pill只读部署route/default，不包含Session内存覆盖；可见数值不是当前实际阈值。应同时承认命令无参数已回显有效阈值、来源与native auto状态，其作用域与pill不同。

恢复命令还有前提：handler先检查backend、compactRegion和容量，之后才解析off/default。元数据或服务失效时，可能在清覆盖前直接返回错误；需恢复服务、建立新Session或停插件回宿主行为，不能保证任何warning都能立刻用off修复。off只停止本插件该route的提前阈值，不关闭宿主native摘要/溢出处理。

更早摘要可能多付调用并丢细节，工具配对平衡不证明任务约束保留。warning按Session消息去重也不代替摘要质量回执。本轮未复现宿主故障或语义丢失，只记录源码边界。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/compaction.ts:27-32](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/compaction.ts#L27-L32)

仅number且大于limit触发。

```text
export function needsCompaction(
  measurement: Pick<TokenMeasurement, "totalTokens">,
  limit: number,
): boolean {
  const tokens = measurement.totalTokens;
  return typeof tokens === "number" && tokens > limit;
```

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:249-283](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L249-L283)

跳过/无范围分支。

<details>
<summary>查看原文（35行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:290-301](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L290-L301)

失败继续next。

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

**依据 4 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:13-17](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/src/client/status-dock.tsx#L13-L17)

pill声明仅部署值。

```text
 * The configured value is the deployment default for that route, or the
 * deployment-wide default when the route has no entry of its own. A session can
 * override it with `/autocompact`, and that override lives in Host memory for
 * the session only, so this line reports the persisted value rather than
 * claiming to be the effective one.
```

**依据 5 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:187-209](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/src/client/status-dock.tsx#L187-L209)

实际从snapshot配置计算显示。

<details>
<summary>查看原文（23行）</summary>

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

**依据 6 · 源码核查**：[dsh-autocompact/index.ts:304-331](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L304-L331)

off/default前先校验backend和容量。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[dsh-autocompact/index.ts:343-358](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L343-L358)

命令已有有效值/来源/native状态回显。

<details>
<summary>查看原文（16行）</summary>

```text
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

#### 缺口

- 未核窗口/后端失效、不可拆范围和摘要丢约束的实际表现。
  **影响**：不能保证提前触发、off即时恢复或合格任务收益。
  **进一步探讨**：固定宿主模拟服务/容量缺口与复杂工具tail，核命令、pill、日志和任务结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 准备条件、一次试用和全成本怎样组织？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH/AgentPresetRegistry与原生compactRegion | 核心必需 | 找实际Agent后端并摘要 | 可回Host，但无后端/方法则无效或报warning |
| tokenMeter与模型真实容量 | 触发必需 | 测压、surface一致、校验tail/窗口 | 缺测量/容量不强制压缩 |
| 原生auto及摘要模型/权限 | 自动链必需 | 真正生成摘要 | 本插件不提供替代摘要算法或调用保证 |
| 构建lib或对应发布包、Web客户端服务 | 加载/设置显示相应必需 | TS host/client入口 | checkout无lib不等npm不可用，固定组合另验 |
| 可重做任务/关键约束清单 | 当前试用必需 | 比较质量与恢复 | 保留原生对照，不看pill猜生效 |

组件0.2.1、MIT。package main为lib/index.js，当前checkout无该产物，build声明tsc+tsdown；作者给出宿主范围/兼容结果，未被本轮安装测试复现。这里研究固定源码，不执行目标构建/测试。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定宿主/route与可重做任务，写关键约束 | 知真实窗口、原生策略和摘要费用基线 |
| 设置 | 用户单Session/route选大于tail、小于窗口阈值 | 命令显示来源；pill只辅助看部署值 |
| 执行 | 用户跨阈值继续复杂工具回合 | 日志/范围和摘要可读，后续任务约束仍正确 |
| 对照 | 用户与原生/手动同任务比较 | 计全部摘要与输入费用、遗漏和重建工时 |
| 恢复 | 用户用default/off或停插件/新Session | 命令需服务/容量；回原生不等关闭原生自动恢复 |
| 退出 | 用户核临时与部署两层配置 | 临时Map不持久，部署设置需另恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/宿主和模型资源 | 对齐route、容量、tail与基线 | 金额/兼容工时未知 |
| 持续使用 | pre-step测压和可能更多原生摘要 | 检查约束、调阈值 | 更小输入可能换更多摘要调用 |
| 失败恢复 | 重试/原生溢出处理与补上下文 | 查warning/范围、重建漏项 | 失败继续turn，off也有服务前提 |
| 升级退出 | 配置/原任务记录保留 | 核Session与部署默认、宿主接口变化 | 未验真实迁移和停止组合 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 精确阈值控制 | Session/route/default与命令回显 | 最优阈值与净成本 |
| 结构保留 | system/tail/工具配对/surface核对 | 摘要语义与合格任务 |
| 状态发现 | pill部署值、命令有效来源 | 两入口使用误判率/宿主行为 |
| 退出回退 | 临时off/default和宿主继续 | 失效服务下恢复与重建工时 |

按一次合格长任务算全部模型与人工投入，不只比压缩后的输入token。没有金额、频率和完整任务数据，不能给省钱比例。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/package.json:2-4](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/package.json#L2-L4)

组件版本。

```text
  "name": "@indexyz/dsh-autocompact",
  "version": "0.2.1",
  "description": "Set session-only per-model automatic compaction thresholds with /autocompact",
```

**依据 2 · 源码核查**：[dsh-autocompact/package.json:34-43](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/package.json#L34-L43)

实际lib host与client入口。

<details>
<summary>查看原文（10行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/package.json:48-67](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/package.json#L48-L67)

build、prepack与开发宿主依赖。

<details>
<summary>查看原文（20行）</summary>

```text
  "scripts": {
    "build": "npm run build:host && npm run build:client",
    "build:host": "tsc -p tsconfig.build.json",
    "build:client": "tsdown",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "check": "npm run typecheck && npm run build && npm test",
    "prepack": "npm run check"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.2",
    "@deepseek-ai/dsh-agent-preset-registry": "0.2.0-rc.2",
    "@deepseek-ai/dsh-commands": "0.2.0-rc.2",
    "@deepseek-ai/dsh-compaction": "0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.2",
    "@deepseek-ai/dsh-session": "0.2.0-rc.2",
    "@deepseek-ai/dsh-token-meter": "0.2.0-rc.2",
    "@deepseek-ai/schemastery": "^3.18.4",
```

</details>

**依据 4 · 作者声明**：[dsh-autocompact/README.md:11-28](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/README.md#L11-L28)

作者本地构建和兼容声明。

<details>
<summary>查看原文（18行）</summary>

````text
To install a repository checkout, run from the repository root:

```bash
npm install
npm run build --workspace @indexyz/dsh-autocompact
dsh plugin --profile web add ./dsh-autocompact
```

Build output is Git-ignored. Local `link:` installs read that output directly;
`npm pack` builds it automatically before creating a published package.

It is built and tested against dsh `0.2.0-rc.2` and declares that range as
`engines.dsh` (`>=0.2.0-rc.2 <0.3.0-0`), which the plugin market reads before it
installs: on a harness outside it the market refuses the install instead of
installing something that breaks. That range includes `0.2.1-rc.2`. Preset
backends are resolved with `agentPresets.serviceFor`, which both registry
versions provide; `0.2.1-rc.2` no longer exports `serviceForAgent`, and importing
that name prevents the plugin from activating. Node `22.19.0` or newer is
````

</details>

**依据 5 · 源码核查**：[dsh-autocompact/index.ts:160-170](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L160-L170)

后端依赖。

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

**依据 6 · 源码核查**：[dsh-autocompact/index.ts:216-241](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L216-L241)

容量/tail条件。

<details>
<summary>查看原文（26行）</summary>

```text
  const routeInfo = async (
    agent: Agent,
    backend: CompactionEngine,
    signal?: AbortSignal,
  ): Promise<RouteInfo | undefined> => {
    const target = targetOf(agent);
    if (target === undefined) return undefined;
    const info = await ctx.llm.resolveModelInfo(target.provider, target.model, signal);
    const contextWindow = info.context?.contextWindow;
    const reserved = agent.session.requestHeader()?.config.maxTokens ?? info.defaultMaxTokens ?? 0;
    return {
      target,
      key: modelKey(target.provider, target.model),
      contextWindow,
      retainTokens:
        contextWindow === undefined
          ? fallbackRetainTokens
          : nativeRetainTokens(
              nativePolicy(backend),
              target.provider,
              target.model,
              contextWindow,
              reserved,
              fallbackRetainTokens,
            ),
    };
```

</details>

**依据 7 · 源码核查**：[dsh-autocompact/index.ts:290-301](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L290-L301)

失败恢复边界。

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

- 缺长任务质量/摘要调用及人工恢复对照。
  **影响**：不能量化最佳阈值或净节省。
  **进一步探讨**：同任务原生与多阈值比较所有请求/摘要费用、约束遗漏和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可有限试用，什么方向值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

理解原生压缩的长会话开发者，可以单route、可重做任务有限试用，保留关键约束清单和原生对照。只有摘要后任务正确且总成本可接受才保留；出现warning、无效范围、丢约束或费用上升回部署默认/关闭插件，必要时新Session恢复原生，不把off当关宿主溢出恢复。

可借鉴真实对象所有权、精确route和surface测量一致性。未来方向是阈值实验收据：把命令已有的有效阈值/来源投影UI，记录触发/跳过原因、摘要前后压力、摘要成本及任务约束核对。它应帮助判断任务结果而不只让pill更像进度条，也不能跨会话混投覆盖状态。

原生/手动和多个提前阈值做同任务对照，加入无容量、复杂配对、摘要遗漏、临时覆盖与pill不同等反例。比较合格任务、总费用、遗漏和恢复工时；若只多了日志/验证开销，净成本不降或约束丢失更多，否定优势。假设未验证，新增验证也要计人工/模型成本。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:249-287](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L249-L287)

当前触发/跳过与原生调用基线。

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

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:343-358](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/index.ts#L343-L358)

有效来源已存在于命令。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 3 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:187-209](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/src/client/status-dock.tsx#L187-L209)

当前UI只算部署值。

<details>
<summary>查看原文（23行）</summary>

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

**依据 4 · 源码核查**：[dsh-autocompact/compaction.ts:60-87](https://github.com/5aaee9/pi-agent-extensions/blob/f40342432ce8afea87a640e183d1c8a3a1679c0a/dsh-autocompact/compaction.ts#L60-L87)

结构而非语义保证。

<details>
<summary>查看原文（28行）</summary>

```text
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

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
