# @indexyz/dsh-autocompact

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8ba4f8a](https://github.com/5aaee9/pi-agent-extensions/tree/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 804](https://img.shields.io/static/v1?label=npm+30d&message=804&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)
<!-- END META -->

> **实现功能**：为Harness按会话与模型配置提前自动压缩阈值，提供持久设置和输入区状态显示。

> **核心亮点**：在原生压缩上增加不改真实窗口的精确route阈值控制，并保护当前surface配对和tail；它明确是pi-autocompact的DSH移植，摘要算法仍属于宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：提前阈值是触发尝试而非硬上限，缺后台/容量、不可拆范围或失败都会继续；更早摘要可能增加费用与语义丢失。pill不显示内存会话覆盖，持久默认不等于实际有效阈值。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要按路由提前压缩上下文，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · token测量、阈值继承和工具调用配对如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使按路由提前压缩上下文的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从token测量、阈值继承和工具调用配对的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用按路由提前压缩上下文，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向了解原生压缩并愿核摘要质量的长会话开发者，以精确模型路由的绝对阈值控制提前摘要；任务约束保留和总成本才是验收对象。

原生自动压缩与手动compact为直接对照；固定任务、模型、约束和预算后比较整个任务的合格率、摘要次数、总token及恢复人时，不将占用下降直接当收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| /autocompact | 当前会话route阈值控制 | 内存覆盖，新对象会话不继承 |
| pre-step提前压缩 | 越阈值尝试原生compactRegion | 需后台/容量/平衡范围，非硬上限 |
| 持久阈值设置 | 编辑默认与模型行 | volatile、revision与写权限 |
| 状态pill/备用面板 | 查看持久阈值并打开设置 | 不显示session override |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH与本地构建产物 | 必需 | 挂Host插件/命令 | 不把源码存在当安装可用 |
| tokenMeter和真实route容量 | 自动检查必需 | 测压与阈值校验 | 缺容量或不一致跳过/警告 |
| Agent原生compaction且auto开启 | 必需 | compactRegion执行摘要 | 缺失不提前压缩，留原生行为 |
| 模型与足够预算 | 摘要必需 | 原生摘要 | 语义损失与调用费需核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 基线 | 开发者保留原生行为和任务约束清单 | 任务可重做，无独有未备份上下文 |
| 单route配置 | 用户对齐provider/model/容量 | 阈值合法且小范围生效 |
| 会话覆盖 | 用户用命令设临时值 | UI只示部署值，不据pill猜覆盖 |
| 验收 | 用户核摘要、后续约束和总费用 | 错漏或费用上升回default/off |
| 故障 | 用户读warning核实际surface | off仅取消提前策略，不关原生溢出恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/宿主资源，金额未知 | 对齐route、容量、阈值和保留尾部 | 本地checkout需构建 |
| 持续使用 | 测压与原生摘要模型资源 | 复核约束并调阈值 | 提前压缩可能增加摘要次数 |
| 失败恢复 | 重复摘要或原生溢出处理资源 | 读warning、回默认、补丢失语义 | 失败继续turn并非强制预算保护 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 阈值控制 | 会话/route/全局优先级明确 | 最优阈值和净费用 |
| 结构保护 | system头、尾部及工具配对保留 | 摘要语义及任务完成质量 |
| 状态可见 | pill显示部署阈值和测压 | 会话覆盖不显示，不能当有效状态 |

> **思考**：提前阈值是触发尝试而非硬上限，缺后台/容量、不可拆范围或失败都会继续；更早摘要可能增加费用与语义丢失。pill不显示内存会话覆盖，持久默认不等于实际有效阈值。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在原生压缩上增加不改真实窗口的精确route阈值控制，并保护当前surface配对和tail；它明确是pi-autocompact的DSH移植，摘要算法仍属于宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

在原生压缩上增加不改真实窗口的精确route阈值控制，并保护当前surface配对和tail；它明确是pi-autocompact的DSH移植，摘要算法仍属于宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

WeakMap绑定真实Session、精确route及token-meter/current surface逐项一致是值得借鉴的状态与正确性约束；移植需宿主compactRegion和原生配对语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

提前阈值是触发尝试而非硬上限，缺后台/容量、不可拆范围或失败都会继续；更早摘要可能增加费用与语义丢失。pill不显示内存会话覆盖，持久默认不等于实际有效阈值。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉原生压缩的开发者可单route试用，保留原生对照并检查摘要与关键约束；不要按pill猜有效覆盖，不把off当关闭宿主溢出恢复。任务质量变差或总成本上升时回默认。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

阈值与结构保护机制可核；摘要语义、净成本及质量反馈假设未验证。

- 已检查：作者 README、包清单、源码路径 dsh-autocompact/README.md、dsh-autocompact/package.json、README.md、package.json、dsh-autocompact/index.ts、dsh-autocompact/compaction.ts、dsh-autocompact/settings.ts、dsh-autocompact/src/client/status-dock.tsx 及固定范围 inventory；组件：dsh-autocompact。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定monorepo dsh-autocompact入口、范围、settings及status客户端；复核当前旧findings后重作本轮结论，未执行目标构建/测试。
- 下一步：按 [Q05](#research-q05) 比较原生与多组提前阈值，记录有效阈值来源、压缩成本、关键约束遗漏与恢复；多会话投影不得泄露彼此状态。

**分析版本**

- **仓库**：[5aaee9/pi-agent-extensions](https://github.com/5aaee9/pi-agent-extensions)
- **版本号**：0.2.1（[固定提交 8ba4f8a](https://github.com/5aaee9/pi-agent-extensions/tree/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可加入按任务约束校验的阈值实验收据，并把有效阈值及来源投影到UI；对照原生与多个提前值，记录摘要费、合格任务、遗漏与恢复工时。净成本不降或约束丢失上升则否定；假设未验证，验证本身有调用/人工负担。参见[Q05](#research-q05)。

按 [Q05](#research-q05) 比较原生与多组提前阈值，记录有效阈值来源、压缩成本、关键约束遗漏与恢复；多会话投影不得泄露彼此状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1371 | — | — | 17380 |
| .ts | source | 12 | 1497 | 921 | 473 | — |
| .tsx | source | 6 | 1009 | 770 | 184 | — |
| .ts | test | 6 | 1709 | 1448 | 112 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5aaee9/pi-agent-extensions/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 80fd0a7424ce8485ab5c367940966ef68c1a6828 和截止 2026-10-23T01:41:11Z 范围内，按路由提前压缩上下文能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要按路由提前压缩上下文，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长会话开发者若希望比原生比例窗口更早摘要，可通过精确provider/model的绝对token阈值表达偏好；简单替代是手动compact或原生默认。合格输出是同任务继续正确且总费用合理，不能仅看压缩触发。源码贡献是DSH移植接线、三级配置及结构范围选择，不把pi上游或宿主摘要算原创。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-autocompact/README.md:1-5](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/README.md#L1-L5)

作者明确DSH移植归属

```text
# @indexyz/dsh-autocompact

Set an earlier automatic compaction threshold per model, or for every model at once, on
the [dsh (DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) coding
agent. This is the dsh port of [`@indexyz/pi-autocompact`](https://github.com/5aaee9/pi-agent-extensions/tree/main/pi-autocompact).
```

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:244-287](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L244-L287)

提前阈值与原生compactRegion接线

<details>
<summary>查看原文（44行）</summary>

```text
  /**
   * Compact an explicit balanced range once the session crosses its effective
   * threshold. Failures are contained: the turn continues untouched, exactly
   * like the backend's own automatic pressure path.
   */
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · token测量、阈值继承和工具调用配对如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host注册/pre-step，先解session overrides→route→default，再测token；找到当前Agent对应backend和真实窗口，按原生retain选平衡前缀compactRegion。Session WeakMap不写覆盖到日志，新Session对象清空；设置volatile写部署默认，客户端status读持久配置。需兼容宿主与可测窗口，用户先单route设置/检查，再核实际摘要；缺backend/native auto/容量时跳过或警告，保留原生处理。

当前backendFor通过ctx.get("agentPresets")?.serviceFor(agent,"compaction")找真实Agent所在realm，再回Host的compaction。缺服务、缺方法或scope已拆除时可走回退，避免静态导入已移除free export导致整个模块无法加载。该源码兼容安排不等于本轮对两个宿主的实际启动验收，必须保留精确Agent身份。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:195-212](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L195-L212)

Session WeakMap与warnOnce

<details>
<summary>查看原文（18行）</summary>

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
  };

  const warnOnce = (session: Session, message: string): void => {
    const { warned } = stateOf(session);
    if (warned.has(message)) return;
    warned.add(message);
    ctx.logger.warn(`autocompact: ${message}`);
```

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:249-287](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L249-L287)

完整测压与调用链

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

**依据 3 · 源码核查**：[dsh-autocompact/compaction.ts:60-86](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/compaction.ts#L60-L86)

surface一致、tail和工具配对

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[dsh-autocompact/index.ts:160-170](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L160-L170)

当前实例方法查找与Host降级，不能继承旧静态free export描述。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使按路由提前压缩上下文的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最关键是压缩后是否保持语义并改善总任务成本，源码只能保证选择范围结构。失败catch后next继续，不能做硬预算/上下文上限；范围太小或尾部过大也不压。pill源码明确显示持久部署值，不包括session override。可借鉴精确路由、对象所有权和surface匹配检查，但语义摘要继承宿主限制。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/index.ts:290-301](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L290-L301)

失败警告仍继续turn

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

**依据 2 · 源码核查**：[dsh-autocompact/compaction.ts:62-83](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/compaction.ts#L62-L83)

范围选择可返回undefined

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:13-17](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/src/client/status-dock.tsx#L13-L17)

UI不声称有效会话阈值

```text
 * The configured value is the deployment default for that route, or the
 * deployment-wide default when the route has no entry of its own. A session can
 * override it with `/autocompact`, and that override lives in Host memory for
 * the session only, so this line reports the persisted value rather than
 * claiming to be the effective one.
```

#### 缺口

- 摘要质量、净费用与会话覆盖可见性的实测缺失
  **影响**：无法证明提前值优于原生
  **进一步探讨**：同一约束任务比较原生和阈值组并核摘要遗漏/总调用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需版本/窗口/route对齐及本地构建；持续付测压和更频繁原生摘要、人工核约束；失败还需回默认和重建被漏事项。更低上下文占用可能用更多摘要请求换得，不能只按请求输入token计算收益。无价格、频率或完整任务对照，现金与工时均未知。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-autocompact/README.md:11-24](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/README.md#L11-L24)

本地构建与宿主/Node范围

<details>
<summary>查看原文（14行）</summary>

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
````

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:282-301](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L282-L301)

摘要调用和失败路径

<details>
<summary>查看原文（20行）</summary>

```text
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

#### 缺口

- 多阈值总费用/完成质量未知
  **影响**：不能给节省比例或最优默认值
  **进一步探讨**：按同任务记录输入输出、摘要、重试与人工恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从token测量、阈值继承和工具调用配对的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是阈值质量反馈和有效来源投影。当前内存覆盖不向UI公布，且压力低并不代表任务更好；可把生效阈值、配置来源、摘要成本与约束核对绑定记录。原生/多个提前值做同任务对照，若净支出不降或遗漏上升就否定收益；投影不能泄露跨会话状态，新增验证负担另计。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-autocompact/src/client/status-dock.tsx:13-17](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/src/client/status-dock.tsx#L13-L17)

有效覆盖投影缺口

```text
 * The configured value is the deployment default for that route, or the
 * deployment-wide default when the route has no entry of its own. A session can
 * override it with `/autocompact`, and that override lives in Host memory for
 * the session only, so this line reports the persisted value rather than
 * claiming to be the effective one.
```

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:254-287](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L254-L287)

阈值选择与摘要触发点

<details>
<summary>查看原文（34行）</summary>

```text
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

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用按路由提前压缩上下文，何时应停止？

**研究主题**：采用判断

#### 完整回答

可由理解原生压缩的开发者单会话单模型试用，选可重做任务并保留关键约束清单。验收应看摘要内容、后续质量和总成本；遇到warning、无效范围、约束丢失或费用上升回default/off，理解off只回原生行为。没有同版宿主验收，不能给持续安装结论。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-autocompact/README.md:30-47](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/README.md#L30-L47)

命令与off/default语义

<details>
<summary>查看原文（18行）</summary>

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
````

</details>

**依据 2 · 源码核查**：[dsh-autocompact/index.ts:290-301](https://github.com/5aaee9/pi-agent-extensions/blob/8ba4f8a5d90d5091c81c9850a9b3bbb56c9f0fce/dsh-autocompact/index.ts#L290-L301)

失败继续行为影响停止标准

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
