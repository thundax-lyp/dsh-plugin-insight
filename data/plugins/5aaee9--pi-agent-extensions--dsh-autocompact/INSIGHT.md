# @indexyz/dsh-autocompact

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c80abc7](https://github.com/5aaee9/pi-agent-extensions/tree/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 735](https://img.shields.io/static/v1?label=npm+30d&message=735&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)
<!-- END META -->

> **实现功能**：为DSH按会话和模型设置提前自动压缩阈值，提供命令、全局默认设置页和状态入口。

> **核心亮点**：在不改真实模型窗口前提下加入会话/route/deployment三级阈值，配命令和设置，复用原生压缩并保护tail与配对；属于pi-autocompact的DSH适配，不把上游摘要算原创。详见[Q02](#research-q02)。

> **风险与缺陷**：阈值只触发尝试而非硬上限，缺backend/容量、不可拆范围或失败会跳过并继续；更早压缩也可能增加摘要成本和语义丢失，未有同任务效果对照。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要提前阈值，命令到压缩怎样运行？](#detail-section-11)
  - [Q02 · 相对原生压缩增加什么，关键边界是什么？](#detail-section-12)
  - [Q03 · 部署、设置写入及退出分别依赖什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本和效果怎样计量？](#detail-section-14)
  - [Q05 · 哪些设计值得复用，阈值反馈假设如何证伪？](#detail-section-15)
  - [Q06 · 适合谁受控试用，什么情况应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给需要按模型控制长会话压缩时机的开发者提供阈值入口，交付需核对实际摘要与任务约束而非仅设置成功。

原生backend负责摘要、溢出恢复和留存策略；用户也可手工压缩。本插件提供更早、分route和分会话的触发控制，不替代摘要引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| /autocompact | 当前会话/精确模型覆盖 | 暂态，off不关闭原生压缩 |
| 设置页 | 持久route与deployment默认 | revision与writable条件，影响范围更大 |
| 提前区域压缩 | 保留近期tail与tool配对 | 需原生auto/compactRegion，阈值非硬上限 |
| 状态入口 | 查看配置并跳设置 | 不是实际压缩成功收据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明Node/DSH与commands/tokenMeter/llm | 启动必需 | 注册命令并测量真实route | 不能承诺版本外兼容 |
| native auto启用且支持compactRegion的backend | 提前压缩必需 | 执行平衡区域摘要 | 阈值无效或跳过，不等于原生压缩关闭 |
| 正确contextWindow与retention policy | 判断必需 | 校验阈值和保留尾部 | 未知容量则警告，不编造 |
| remote.settings及可写profile | 持久设置必需 | revision校验写defaults | 只读模式不能保存，可保留session命令 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认版本、模型容量和backend | 阈值大于保留预算且小于真实窗口 |
| 加载 | 安装构建好的包，检查命令和设置入口 | 本地源码安装须先构建，不执行当作已验证 |
| 使用 | 先用会话命令设置一个route | 显示正确来源，压缩记录可查 |
| 恢复/退出 | off回到原生，default回继承，另清理持久defaults | 不把off解释成停用原生压缩 |

卸载不会撤销已发生的原生压缩记录，持久配置应按宿主设置管理。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包构建/宿主资源，金额未知 | 对齐版本、route、真实窗口与阈值 | 无部署耗时基准 |
| 持续使用 | token测量与backend压缩模型/资源 | 观察摘要及任务约束，调整threshold | 模型价格、频率和净token差未测 |
| 失败恢复 | 原生溢出恢复或重复压缩成本 | 查警告、回原生默认、重建被摘要遗漏事项 | warnOnce不是可靠恢复收据 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提前控制 | 精确route阈值在pre-step检查 | 净费用和总耗时是否下降 |
| 保留结构 | system头、近期tail和tool配对保护 | 摘要后的语义正确与任务质量 |
| 配置便利 | 命令和revision设置编辑 | 多任务中选阈值的人时与维护负担 |

未知金额、节省比例和成功率不填0。对照应计入摘要请求、失败、人工复核和恢复任务。

> **思考**：阈值只触发尝试而非硬上限，缺backend/容量、不可拆范围或失败会跳过并继续；更早压缩也可能增加摘要成本和语义丢失，未有同任务效果对照。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在不改真实模型窗口前提下加入会话/route/deployment三级阈值，配命令和设置，复用原生压缩并保护tail与配对；属于pi-autocompact的DSH适配，不把上游摘要算原创。详见[Q02](#research-q02)。

在不改真实模型窗口前提下加入会话/route/deployment三级阈值，配命令和设置，复用原生压缩并保护tail与配对；属于pi-autocompact的DSH适配，不把上游摘要算原创。详见[Q02](#research-q02)。

值得复用的是用真实Session对象作WeakMap所有者避免恢复/分叉继承暂态覆盖，用精确provider/model区分配置，pre-step调用当前agent对应backend，以及在压缩前验证token-meter surface与当前surface逐项一致。范围选择保留工具配对是正确性支持，测试以mock配对函数核对多个边界，本轮只读不称通过。客户端config-store共享describe请求和view，减少多个UI读配置时漂移；写入仍需要宿主revision保障。

<a id="detail-section-5"></a>

### 1.4 主要限制

阈值只触发尝试而非硬上限，缺backend/容量、不可拆范围或失败会跳过并继续；更早压缩也可能增加摘要成本和语义丢失，未有同任务效果对照。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合熟悉原生压缩的人先用单会话单route试用，保留原生对照并核对关键约束和总费用；失败警告、摘要丢约束或成本上升时回默认。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持阈值层级与原生backend适配贡献，净节省和语义效果未验证；质量反馈阈值实验为未验证新假设。

- 已检查：作者 README、包清单、源码路径 dsh-autocompact/README.md、dsh-autocompact/package.json、dsh-autocompact/index.ts、dsh-autocompact/settings.ts、dsh-autocompact/compaction.ts、dsh-autocompact/src/client/page.tsx、dsh-autocompact/src/client/config-store.ts、dsh-autocompact/test/compaction.test.ts 及固定范围 inventory；组件：dsh-autocompact。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定monorepo的dsh-autocompact组件入口、选择器、配置和客户端/测试定义；未执行构建、测试、模型压缩或宿主冒烟。
- 下一步：进一步探讨可从固定模型任务的原生默认与多个提前阈值比较入手，记录全部压缩调用、总tokens、人时及关键约束保持。

**分析版本**

- **仓库**：[5aaee9/pi-agent-extensions](https://github.com/5aaee9/pi-agent-extensions)
- **版本号**：0.2.0（[固定提交 c80abc7](https://github.com/5aaee9/pi-agent-extensions/tree/c80abc7c4904fee9206f8649214a211ef84961ff)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨质量反馈阈值实验，绑定阈值、压缩成本与任务约束比较原生/多个提前值，检验净收益而非追求更低占用；额外检查有成本，未验证。详见[Q05](#research-q05)。

进一步探讨可从固定模型任务的原生默认与多个提前阈值比较入手，记录全部压缩调用、总tokens、人时及关键约束保持。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1360 | — | — | 17288 |
| .ts | source | 12 | 1490 | 920 | 467 | — |
| .tsx | source | 6 | 1009 | 770 | 184 | — |
| .ts | test | 5 | 1610 | 1366 | 100 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+created%3A2026-09-22T04%3A58%3A34.561Z..2026-10-22T04%3A58%3A34.561Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A58%3A34.561Z..2026-10-22T04%3A58%3A34.561Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查DSH提前压缩阈值的范围选择、配置层级、效果取舍和采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要提前阈值，命令到压缩怎样运行？

**研究主题：**场景与需求、功能与机制

#### 完整回答

适合在DSH编码任务中希望较早压缩、又不想伪造模型contextWindow的用户。输入是当前会话精确provider/model及绝对token阈值，交付是下次步骤前按阈值触发已挂载backend的区域压缩，保留近期尾部和工具调用配对。合格结果需压缩实际发生、任务约束继续保持，并能区分会话覆盖和全局默认。

/autocompact命令把覆盖保存在Session对象WeakMap内，模型切换按精确route区分；off抑制插件继承层而不关闭原生压缩，default删除覆盖。agent/pre-step读取当前覆盖、route默认或deployment默认，native auto关闭则不触发；token-meter总量严格大于阈值才选择surface前缀，保留按原生政策计算的尾部。选择器核对测量节点与当前surface一致，保护开头system并向前调整到工具配对平衡边界，再调用backend.compactRegion。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:173-198](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L173-L198)

会话WeakMap与默认层解析。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx: Context, config: AutocompactConfig = {}): void {
  /** Current global defaults, re-read so a Settings write applies to the running plugin. */
  const limitsNow = (): Map<string, number> =>
    defaultLimits({ modelLimits: liveValue(config.modelLimits, {}) });
  /**
   * Current deployment-wide threshold, re-read like the defaults above.
   * `undefined` means no default: uncovered models keep the backend's behavior.
   */
  const defaultLimitNow = (): number | undefined =>
    validateDefaultLimit(liveValue<number | undefined>(config.defaultLimit, undefined));
  const fallbackRetainTokens = liveValue(config.retainTokens, 20000);
  // Validate the configured defaults at load, where a bad row fails loudly,
  // instead of at the first measured step.
  limitsNow();
  defaultLimitNow();
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

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:242-280](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L242-L280)

pre-step阈值检查和backend调用。

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

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:321-351](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L321-L351)

off/default语义与来源提示。

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

**依据 4 · 源码核查**：[dsh-autocompact/compaction.ts:56-87](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/compaction.ts#L56-L87)

当前surface核对、尾部和工具配对范围。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对原生压缩增加什么，关键边界是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把提前压缩阈值拆成会话精确route覆盖、route持久默认与部署默认，提供命令及设置入口，仍使用原生backend和真实上下文元数据。源码明确为pi-autocompact移植，范围选择和宿主preset寻址是DSH适配增量，不把上游压缩摘要质量算本组件创新。

关键边界是阈值只触发一次尝试，不是上下文硬上限。小surface、不可拆大消息、无backend/compactRegion、未知容量、native auto关闭或范围选择失败都可能不压缩；失败被捕获为warnOnce并继续next，保留原生恢复责任。阈值降低会增加摘要频率与信息损失，也可能减少后续重复上下文，哪个占优需任务对照。测量后异步resolveModelInfo期间surface若变化，选择器会抛并跳过，而非用旧范围强行压缩。无配置的模型维持原生行为，因此安装本身不必然改变每个会话。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:1-17](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L1-L17)

作者源码说明移植与preset backend寻址归属。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Session-only per-model automatic compaction thresholds for dsh.
 *
 * The dsh port of `@indexyz/pi-autocompact`. A `/autocompact 300k` threshold is
 * kept in memory for the current session and model only; when the measured
 * request pressure crosses it, the plugin compacts an explicit balanced surface
 * range through the session's mounted compaction backend before the next
 * request. Nothing is written to configuration, the session log carries only
 * the backend's ordinary compaction records, and the model's real context-window
 * metadata is never modified.
 *
 * `compaction` is not a Host-plane service: the shipped Web bundle disables the
 * root row and lets each Agent preset mount its own isolated instance. This
 * plugin therefore mounts on the Host plane (so one row serves every preset) and
 * addresses the backend of the exact Agent at event time through
 * {@link serviceForAgent}, falling back to the Host plane for compositions (the
 * headless, ACP, and SDK bundles) that do mount it there.
```

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:253-294](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L253-L294)

各跳过条件、错误包含和继续执行。

<details>
<summary>查看原文（42行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/compaction.ts:41-49](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/compaction.ts#L41-L49)

不可压缩范围明确交回原生恢复。

```text
/**
 * Resolve the next range starting at the first non-system surface node while
 * retaining a priced recent tail and never splitting an assistant
 * tool-call/result pair. A `system/message` at surface node 0 is never inside
 * the range; without one the range starts at node 0.
 *
 * Returns `undefined` when the surface is too small or one indivisible
 * oversized message cannot be compacted and still shrink, which leaves the
 * decision to the backend's own overflow or manual compaction.
```

**依据 4 · 源码核查**：[dsh-autocompact/settings.ts:93-108](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/settings.ts#L93-L108)

覆盖/default解析顺序。

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

#### 缺口

- 没有同任务阈值策略对照的费用、摘要失真与完成率。
  **影响：**不能判断较早压缩必然更便宜或更好。
  **进一步探讨：**可用相同模型任务对照原生默认与多个阈值，记录完整压缩成本、约束保持和最终交付。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 部署、设置写入及退出分别依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

包要求Node>=22.19与DSH >=0.2.0-rc.2 <0.3.0-0，多项peer宽泛为*不表示所有API版本兼容。核心需commands、tokenMeter、llm与能够compactRegion的会话backend；web设置还需remote.settings和客户端挂载。命令只写会话内存，但设置页通过revision保护的settings.mutate持久化modelLimits/defaultLimit，两者不能混为“所有操作都不写配置”。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明Node/DSH与commands/tokenMeter/llm | 启动必需 | 注册命令并测量真实route | 不能承诺版本外兼容 |
| native auto启用且支持compactRegion的backend | 提前压缩必需 | 执行平衡区域摘要 | 阈值无效或跳过，不等于原生压缩关闭 |
| 正确contextWindow与retention policy | 判断必需 | 校验阈值和保留尾部 | 未知容量则警告，不编造 |
| remote.settings及可写profile | 持久设置必需 | revision校验写defaults | 只读模式不能保存，可保留session命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认版本、模型容量和backend | 阈值大于保留预算且小于真实窗口 |
| 加载 | 安装构建好的包，检查命令和设置入口 | 本地源码安装须先构建，不执行当作已验证 |
| 使用 | 先用会话命令设置一个route | 显示正确来源，压缩记录可查 |
| 恢复/退出 | off回到原生，default回继承，另清理持久defaults | 不把off解释成停用原生压缩 |

卸载不会撤销已发生的原生压缩记录，持久配置应按宿主设置管理。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/package.json:77-97](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/package.json#L77-L97)

peer与engine声明。

<details>
<summary>查看原文（21行）</summary>

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
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:46-89](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L46-L89)

服务依赖与volatile配置。

<details>
<summary>查看原文（44行）</summary>

```text
/** Host-plane services this plugin needs before it can register its command and hook. */
export const inject = ["commands", "tokenMeter", "llm"];

/** A `.volatile()` Config field: the Loader parses it into a stable reference read with `get()`. */
export interface VolatileField<T> {
  get(): T | undefined;
}

/**
 * Row configuration as `apply` receives it.
 *
 * The two fields the Settings page writes are declared `.volatile()`, so the
 * Loader hands `apply` live references rather than plain values; a direct call
 * (tests, embedding) may still pass plain values.
 */
export interface AutocompactConfig {
  /** Optional global default thresholds keyed by exact `provider/model`. Never written by the command. */
  modelLimits?: Record<string, number> | VolatileField<Record<string, number>>;
  /**
   * Optional deployment-wide threshold applied to every model without its own
   * entry. Absent means those models keep the backend's automatic compaction.
   */
  defaultLimit?: number | VolatileField<number | undefined>;
  /** Recent-tail fallback budget used only when the backend publishes no retention policy. */
  retainTokens?: number;
  /** Master switch for the automatic pressure check. */
  enabled?: boolean | VolatileField<boolean>;
}

/**
 * Validated row configuration; misconfiguration fails plugin load.
 *
 * `modelLimits`, `defaultLimit` and `enabled` are volatile because the Settings
 * page edits them through the Host settings service: that service only exposes
 * an entry whose schema declares a volatile field (`volatileForm`), and only
 * accepts writes to volatile paths. A volatile field is also what makes an edit
 * visible to the running plugin without a restart. `retainTokens` stays ordinary
 * configuration, editable from `cordis.patch.yml` only.
 */
export const Config = z.object({
  modelLimits: z.dict(z.natural()).default({}).volatile(),
  defaultLimit: z.natural().volatile(),
  retainTokens: z.natural().default(20000),
  enabled: z.boolean().default(true).volatile(),
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/src/client/page.tsx:140-175](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/src/client/page.tsx#L140-L175)

设置mutation携带revision，和session命令不同。

<details>
<summary>查看原文（36行）</summary>

```text
  const save = React.useCallback(async () => {
    const settings = settingsFace();
    if (settings === undefined || state === null) return;
    const ops: SettingsOp[] = [];
    const trimmedDefault = defaultDraft.trim();
    if (trimmedDefault === "") {
      // Blank means "no deployment default"; only a stored value needs the unset.
      if (state.defaultLimit !== undefined) ops.push({ op: "unset", path: ["defaultLimit"] });
    } else {
      const parsed = parseLimit(trimmedDefault);
      if (parsed === undefined) {
        setNotice({ kind: "error", text: t("invalid") });
        return;
      }
      if (parsed !== state.defaultLimit) {
        ops.push({ op: "set", path: ["defaultLimit"], value: parsed });
      }
    }
    for (const key of removed) ops.push({ op: "unset", path: ["modelLimits", key] });
    for (const [key, raw] of Object.entries(draft)) {
      const parsed = parseLimit(raw);
      if (parsed === undefined) {
        setNotice({ kind: "error", text: t("invalid") });
        return;
      }
      ops.push({ op: "set", path: ["modelLimits", key], value: parsed });
    }
    if (ops.length === 0) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await settings.mutate(state.ns, ops, state.revision);
      if (response.ok) {
        applyView(response.value, state.writable);
        setNotice({ kind: "success", text: t("saved") });
        return;
```

</details>

**依据 4 · 源码核查**：[dsh-autocompact/settings.ts:46-54](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/settings.ts#L46-L54)

阈值校验相对retention和真实窗口。

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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本和效果怎样计量？

**研究主题：**效果与总成本

#### 完整回答

计量单位是保持任务关键约束并完成合格交付的一段会话，而非某次压缩返回。插件通过既有backend调用可能发模型摘要请求，不能从新增命令较轻推断没有额外模型费用。提前阈值可能降低后续上下文，也可能提高压缩频率并把人工修复摘要错误的负担前移。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包构建/宿主资源，金额未知 | 对齐版本、route、真实窗口与阈值 | 无部署耗时基准 |
| 持续使用 | token测量与backend压缩模型/资源 | 观察摘要及任务约束，调整threshold | 模型价格、频率和净token差未测 |
| 失败恢复 | 原生溢出恢复或重复压缩成本 | 查警告、回原生默认、重建被摘要遗漏事项 | warnOnce不是可靠恢复收据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提前控制 | 精确route阈值在pre-step检查 | 净费用和总耗时是否下降 |
| 保留结构 | system头、近期tail和tool配对保护 | 摘要后的语义正确与任务质量 |
| 配置便利 | 命令和revision设置编辑 | 多任务中选阈值的人时与维护负担 |

未知金额、节省比例和成功率不填0。对照应计入摘要请求、失败、人工复核和恢复任务。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:256-280](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L256-L280)

测量和真正调用backend.compactRegion。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:283-294](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L283-L294)

失败警告并继续下一步。

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

**依据 3 · 源码核查**：[dsh-autocompact/compaction.ts:70-87](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/compaction.ts#L70-L87)

结构保护存在不等于语义保真。

<details>
<summary>查看原文（18行）</summary>

```text
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

- 缺少同条件任务下压缩调用数量、token费用、人时和质量数据。
  **影响：**不能给出净节省、最佳阈值或持续采用收益。
  **进一步探讨：**可固定模型/任务/输入，比较原生和多个提前阈值的总请求预算及约束保持率。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计值得复用，阈值反馈假设如何证伪？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

值得复用的是用真实Session对象作WeakMap所有者避免恢复/分叉继承暂态覆盖，用精确provider/model区分配置，pre-step调用当前agent对应backend，以及在压缩前验证token-meter surface与当前surface逐项一致。范围选择保留工具配对是正确性支持，测试以mock配对函数核对多个边界，本轮只读不称通过。客户端config-store共享describe请求和view，减少多个UI读配置时漂移；写入仍需要宿主revision保障。

由Q02/Q04可提出未验证的“质量反馈阈值实验”假设。只在用户选择的任务集里记录阈值、压缩前后tokens、压缩请求成本和关键约束检查，比较多个阈值而非给所有模型固定绝对值。增量是把阈值从个人偏好变成可解释的任务取舍，不宣称自动调优必胜。需要可核对验收与任务隐私处理，可能增加模型/人工检查费用。最小对照为原生默认、一个保守提前值、一个更早值，若净成本不降或约束丢失增加，就应否定该阈值策略。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:188-198](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L188-L198)

Session对象所有权。

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

**依据 2 · 源码核查**：[dsh-autocompact/compaction.ts:61-87](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/compaction.ts#L61-L87)

surface一致性与平衡边界。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 3 · 源码核查**：[dsh-autocompact/test/compaction.test.ts:31-77](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/test/compaction.test.ts#L31-L77)

作者范围选择和配对mock静态测试。

<details>
<summary>查看原文（47行）</summary>

```text
describe("surface range selection", () => {
  it("retains the priced recent tail and summarizes only the prefix", () => {
    const target = session([0, 1, 2, 3]);
    const range = selectCompactableRange(
      target,
      measurement([
        [0, 10],
        [1, 10],
        [2, 100],
        [3, 100],
      ]),
      150,
    );
    // Walking back from node 3 accumulates 100, then 200 >= 150 at node 2.
    expect(range).toEqual({ start: 0, end: 1 });
  });

  it("never includes a leading system message in the range", () => {
    const target = session([0, 1, 2, 3], "system");
    const range = selectCompactableRange(
      target,
      measurement([
        [0, 10],
        [1, 10],
        [2, 100],
        [3, 100],
      ]),
      150,
    );
    expect(range).toEqual({ start: 1, end: 1 });
  });

  it("retains more history until the kept edge is a balanced tool-call boundary", () => {
    vi.mocked(toolPairingBalancedBefore).mockImplementation((_target, seq) => seq !== 3);
    const target = session([0, 1, 2, 3, 4]);
    const range = selectCompactableRange(
      target,
      measurement([
        [0, 10],
        [1, 10],
        [2, 10],
        [3, 100],
        [4, 100],
      ]),
      150,
    );
    expect(range).toEqual({ start: 0, end: 1 });
```

</details>

**依据 4 · 源码核查**：[dsh-autocompact/src/client/config-store.ts:97-124](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/src/client/config-store.ts#L97-L124)

共享inFlight配置读取。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Read the bundle row from the Host.
 *
 * Concurrent callers share one request, so a page open and several status lines
 * cost one round trip.
 */
export async function load(): Promise<void> {
  if (inFlight !== undefined) return inFlight;
  const settings = settingsFace();
  if (settings === undefined) {
    emit({ state: "absent" });
    return;
  }
  inFlight = (async () => {
    try {
      const response = await settings.describe();
      if (!response.ok) {
        emit({ state: "error", message: response.error?.message ?? "" });
        return;
      }
      publishView(pickNamespace(response.value), response.value.writable);
    } catch (error) {
      emit({ state: "error", message: messageOf(error) });
    } finally {
      inFlight = undefined;
    }
  })();
  return inFlight;
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 适合谁受控试用，什么情况应停止？

**研究主题：**采用判断

#### 完整回答

推荐trial。熟悉模型窗口和原生压缩、需要按route控制提前阈值的DSH开发者，可以先在单个非关键任务使用会话命令试用，保留原生默认做对照；不要先配置影响所有模型的deployment默认。试用要确认命令来源、真实压缩记录、关键约束和总成本，不能把状态pill当压缩成功证明。

如果频繁警告不压缩、摘要后关键约束丢失、重复压缩使总费用升高，或用户把off误当完全关闭原生自动压缩，应回到原生策略并核对持久defaults。源码体现结构保护和可回退命令，但没有本轮安装/任务效果证据，不能升为install。限制见Q02，流程见Q03，成本见Q04。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:321-351](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L321-L351)

off/default与来源提示支持有边界回退。

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

**依据 2 · 源码核查**：[dsh-autocompact/settings.ts:101-108](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/settings.ts#L101-L108)

继承顺序影响回退结果。

```text
export function resolveLimit(
  overrides: ReadonlyMap<string, number | null>,
  defaults: ReadonlyMap<string, number>,
  key: string,
  defaultLimit?: number,
): number | undefined {
  if (overrides.has(key)) return overrides.get(key) ?? undefined;
  return defaults.get(key) ?? defaultLimit;
```

**依据 3 · 源码核查**：[dsh-autocompact/index.ts:283-294](https://github.com/5aaee9/pi-agent-extensions/blob/c80abc7c4904fee9206f8649214a211ef84961ff/dsh-autocompact/index.ts#L283-L294)

失败不中断但也未保证生效。

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

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
