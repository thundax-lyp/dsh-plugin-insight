# DSH Multitask

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e79ab50](https://github.com/Senguk520/dsh-multitask/tree/e79ab500fddfea2f1b05af7b9def6bc3ea97209e)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Senguk520/dsh-multitask) [![npm 30d 3,008](https://img.shields.io/static/v1?label=npm+30d&message=3%2C008&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-multitask) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-multitask)
<!-- END META -->

> **功能**：用 DSH Agent 预设把协调与执行分工，支持不同工具面的子代理。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，插件将协调者窄工具面与多种 worker 组合，分离大批量执行和主会话。

> **主要限制**：[Q03](#research-q03) 显示，审批转呈受 ask 策略限制，最小 worker 收窄失败可能保留工具，需实际验收而非相信模式名。

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
  - [Q01 · 相对标准对话直接用工具，预设把工作怎样分开？](#detail-section-11)
  - [Q02 · 不同 worker 类型如何注册并进入会话？](#detail-section-12)
  - [Q03 · 子任务审批与结果的边界是什么？](#detail-section-13)
  - [Q04 · 如何比较相同任务的实际收益和代价？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要分解多步开发任务的 DSH 用户，可用独立协调会话安排 worker 并验收结果。

标准会话能直接调用工具或使用内置子代理，额外价值来自分工预设与动态收窄。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 预设 | 选择协调模式 | 需宿主 preset 注册 |
| worker | 按任务选择执行面 | 依 provider 与工具收窄 |
| 审批 | 交互中转呈部分危险动作 | 父级 ask 时才有对应路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 与 agentPresets | 必需 | 发布组合 | 选择器无模式 |
| subagents 与 provider 接口 | 额外 worker 所需 | 注册工具面 | 相应委派缺失 |
| ask 策略及宿主审批服务 | 转呈所需 | 弹卡确认 | 不能预期父会话审批 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选择隔离仓库和新会话 | 确认预设与必要工具 |
| 派单 | 给只读任务书并核查实际工具 | 结果能追溯到文件 |
| 退出 | 结束试用并切回标准新会话 | 没有异常待执行动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型与环境费用未知 | 配置版本和试用仓库 | 耗时未知 |
| 持续 | 多会话 token 未知 | 任务书和人工复核 | 净收益待测 |
| 故障 | 重复执行资源未知 | 核查任务状态与切回标准模式 | 可能留下局部动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 委派分工 | 预设组合和额外 provider | 实际节约 |
| 审批 | 有条件转呈 | 全路径覆盖 |
| 只读工作 | 动态收窄工具 | 宿主实际生效 |

> **思考**：[Q03](#research-q03) 显示，审批转呈受 ask 策略限制，最小 worker 收窄失败可能保留工具，需实际验收而非相信模式名。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，插件将协调者窄工具面与多种 worker 组合，分离大批量执行和主会话。

额外 provider 由宿主注册并去重，实际守卫依宿主 scope 服务。模型看到的工具呈现与真实权限需分别检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，审批转呈受 ask 策略限制，最小 worker 收窄失败可能保留工具，需实际验收而非相信模式名。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先验证隔离仓库中的只读样本和权限，再考虑并行执行任务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 preset 和 provider 接线。宿主权限与任务效果未运行验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、lib/worker-providers.js、presets/multitask/composition.mjs、presets/multitask/approval-gate.mjs、presets/multitask/minimal-guard.mjs、presets/multitask/coordinator-guard.mjs、README.zh.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 1.4.2 根包，检查 preset、额外 worker、工具面和审批边界。未运行模型、权限或完整平台验证。
- 下一步：用同一任务和模型分别运行标准和 Multitask，记录总资源、准确性与异常回退。

**分析版本**

- **仓库**：[Senguk520/dsh-multitask](https://github.com/Senguk520/dsh-multitask)
- **版本号**：1.4.2（[固定提交 e79ab50](https://github.com/Senguk520/dsh-multitask/tree/e79ab500fddfea2f1b05af7b9def6bc3ea97209e)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 比较总 token、等待和产物准确率，验证长工具输出任务的委派是否有净收益。若多次补上下文抵消收益，放弃假设。

用同一任务和模型分别运行标准和 Multitask，记录总资源、准确性与异常回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 15 | 10172 | 4121 | 5307 | — |
| .md | source | 4 | 4593 | — | — | 81094 |
| .js | source | 3 | 4308 | 2340 | 1869 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/Senguk520/dsh-multitask/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用 Multitask 预设委派文件与命令工作时，主会话能少处理什么，哪些控制要依赖宿主与人工复核？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对标准对话直接用工具，预设把工作怎样分开？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要多轮开发或调研的使用者，预设将任务理解、派单和验收留给协调者，把长工具调用交给 worker。相对标准对话直接读日志，新增的是按职责分开的工具表和明确的委派路径。作者要求任务书自包含，fork 只继承已完成轮次，当前轮关键条件需要再次传达。分工适合可分离任务，简单单文件查看往往直接执行更省事。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:130-147](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/README.zh.md#L130-L147)

作者说明切换模式、任务书和四类 worker。

<details>
<summary>查看原文（18行）</summary>

```text
**新建会话**时，在模式选择器里选 **「Multitask 减震器模式」**，然后正常提需求即可。

> 模式可以在**会话首轮开始之前**选择；首轮还没开始的会话，也仍然可以切进或切出本模式。被冻结的是**已经开始跑首轮**的会话 —— 这是 DSH 的既有约束（工具面与提示词在首轮就冻结了），不是本插件的限制。

协调者会把你的需求翻译成**自包含**的任务书 —— 子代理看不到这段对话，所以任务书必须带上它需要知道的一切（目标、已核实的现状、项目约定、安全闸、编号任务、条件分支、停止条件、回报格式）。互不依赖的任务会**并行**下发；协调者随后**结束回合**，worker 回报时由运行时以新回合唤醒它 —— 结论不会丢，主对话的上下文也不会被等待填满。

---

## 四类子代理

协调者有四条委派路径，差别主要在**工具面**：

| 委派工具 | 工具面 | 适用任务 |
|---|---|---|
| `subagent` | **完整** | 默认。写代码、跑测试、改文件、执行类任务 |
| `subagent_fork` | **完整** + 继承本对话的**已完成轮次** —— 它**看不到**当前正在进行的那一轮，所以派单那一轮里说过的事实必须在任务书里再说一遍 | 复查、续写 —— 需要「接着这份上下文往下做」时 |
| `subagent_ptc` | **PTC 塌缩**：只能直呼 `run_code`，其余工具在程序里经生成的 SDK 调用 | 程序化批量处理：海量数据的过滤/聚合/搬运，中转数据不该进上下文 |
| `subagent_minimal` | **只读**：摘掉写入与执行类工具，但保留 `read` `grep` `glob` `read_image` `file_info` `skill` `todo_write` `present`，并且**仍然可以搜索与抓取网页** | 只读调研、快速问答、核查事实 |
```

</details>

**依据 2 · 源码核查**：[presets/multitask/composition.mjs:1790-1806](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/composition.mjs#L1790-L1806)

预设配置 fork 与工具面差异。

<details>
<summary>查看原文（17行）</summary>

```text
            toolName: 'subagent_fork',
            maxDepth: 1,
            ...workerAgentOptions(modelMap, 'subagent_fork'),
          },
        },

        // ── ★ 多模式 worker（本次新增；`DSH_MULTITASK_MULTI_MODE=0` 可整体关掉）──
        //
        // 上面两条是「标准」路径，本段这两条是**按任务类型分流**用的。
        // 三条进程内委派路径的差别不在模型，而在**工具面**：
        //
        //   subagent          完整工具面（写文件、跑命令、构建…）—— 默认，写代码/执行类任务
        //   subagent_ptc      PTC 塌缩面（只能直呼 run_code）—— 程序化批量处理
        //   subagent_minimal  只读面（摘掉写入与执行类）—— 只读调研 / 快速问答
        //
        // `subagent_fork` 不属于这个「工具面分流」维度：它的区分点是**继承本对话
        // 上下文**，与工具面正交，所以 fork 本身没有对应的第三种工具面变体。
```

</details>

**依据 3 · 源码核查**：[presets/multitask/coordinator-guard.mjs:628-658](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/coordinator-guard.mjs#L628-L658)

按可见工具计算协调者限制。

<details>
<summary>查看原文（31行）</summary>

```text
      warn('no tool schemas were readable for a coordinator scope; the shock absorber is NOT engaged for this session yet (will retry on the next tool call)')
      return
    }

    const deny = visible.filter((toolName) => extraDeny.has(toolName) || !keep.has(toolName))
    if (deny.length === 0) return

    const tools = agent?.ctx?.tools
    if (tools === undefined || typeof tools.restrict !== 'function') {
      warn('the agent scope exposes no tools.restrict(); the shock absorber cannot be engaged and this session keeps the full roster')
      return
    }

    // ── 剔掉「结构上摘不掉」的名字（本轮修复的缺陷）───────────────────────────
    //
    // `restrict()` 只接受**继承面**的名字（`restrictableNames`）。注册在该 agent
    // **自己 scope** 上的名字（own 层 —— 例如团队工具的 `send_message` / `list_agents`）
    // 以及保留传输名 `run_code` 都不在其中，一旦出现在 deny 里，`restrict()` 会直接
    // 抛 `names unknown global tool`，于是 catch 分支让**整条收窄不生效**（fail open）：
    // 会话看着是 Multitask，`write` / `pwsh` 却全都在。
    //
    // 这一类的正确处置是**扣下不发**：它们结构上就摘不掉，与其让整条收窄陪葬，
    // 不如把能摘的摘掉、再留一条日志说明哪些名字没摘（否则「为什么它还看得见」
    // 在日志里无从查起）。
    //
    // 读不到 `restrictableNames`（没有 view / 字段不存在 / 抛错）时**不筛**：那属于
    // 「读不到事实」，不是「摘不掉」，按现状语义原样下发，也不额外告警。
    const restrictable = restrictableNameSet(tools, agent)
    // `undefined`（读不到 restrictableNames）时退回现状语义：两个分支都直接沿用 deny。
    const unpickable = restrictable === undefined ? [] : deny.filter((toolName) => !restrictable.has(toolName))
    const withheld = restrictable === undefined ? deny : deny.filter((toolName) => restrictable.has(toolName))
```

</details>

#### 缺口

- 未量化对话上下文变化或错误率
  **影响**：不能确认复杂任务更有效
  **进一步探讨**：对同一两阶段任务分别运行标准与委派模式

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不同 worker 类型如何注册并进入会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主先在 subagents 服务上注册额外 provider，已有同名时跳过，缺接口或异常只告警且可导致对应委派工具缺失。随后以 Agent preset 发布组合。普通和 fork 使用宿主原生类型，额外的 PTC、minimal 由 provider 名进入描述，前者改变模型工具呈现，后者交给动态守卫收窄。PTC 仍可经生成接口间接调用能力，不能把只看到 run_code 当作权限最小化。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1024-1032](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/lib/index.js#L1024-L1032)

宿主时注册 worker。

```text
  //
  // 这一步必须在**宿主平面**做，不能放进 preset 内部：provider 注册的 effect 由服务
  // 自己的 context 拥有，preset 重新声明时旧注册不会被卸掉，新一代再注册同名 provider
  // 会撞 `a subagent provider named "…" is already registered`，而那会让**整个 preset
  // 挂载失败**（模式从新会话列表消失）。这里注册一次、且靠 `getProvider()` 去重。
  //
  // 它服务的是两条**可选**委派路径，所以失败只告警（见 `worker-providers.js` 头部）。
  // 注册表比本插件晚出现时，该函数内部会用 `ctx.inject` 兜住。
  registerWorkerProviders(ctx, warn)
```

**依据 2 · 源码核查**：[lib/worker-providers.js:119-140](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/lib/worker-providers.js#L119-L140)

注册、去重与缺失条件。

<details>
<summary>查看原文（22行）</summary>

```text
export function registerWorkerProviders(ctx, warn) {
  // 服务可能比本插件晚出现（瘦身部署甚至没有它），所以用 inject 兜住。
  const install = (subagents) => {
    for (const providerName of WORKER_PROVIDER_NAMES) {
      try {
        if (typeof subagents?.registerProvider !== 'function') {
          warn(
            `the subagents service exposes no registerProvider(); the "${providerName}" worker backend was NOT ` +
              `registered, so that delegation tool will be missing [MULTITASK-PROVIDER-SKIPPED reason=no-register-api]`,
          )
          continue
        }
        // 已经注册过（热替换 / 重复插入 / 上游 effect 存活）就不再注册。
        const existing = typeof subagents.getProvider === 'function' ? subagents.getProvider(providerName) : undefined
        if (existing !== undefined) continue
        subagents.registerProvider(new InProcessSpawnProvider(providerName))
      } catch (error) {
        warn(
          `registering the "${providerName}" worker backend failed: ` +
            `${error instanceof Error ? error.message : String(error)} — that delegation tool will be missing, ` +
            `the rest of the mode keeps working [MULTITASK-PROVIDER-SKIPPED reason=register-threw]`,
        )
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1273-1288](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/lib/index.js#L1273-L1288)

校验组合后发布 preset。

<details>
<summary>查看原文（16行）</summary>

```text
      } catch (error) {
        warn(`the bundled composition is invalid: ${error instanceof Error ? error.message : String(error)}`)
        return
      }

      // 必须在**注册之前**接管同 id 的旧声明：注册表对重复 id 是硬拒绝的，
      // 清理不干净新声明就装不上（而且只会留一行 warn，非常难查）。
      await releaseOwn()
      await takeOver(declaration.id)

      try {
        const dispose = await registry.register(declaration)
        // 落库成功 —— **无论注册表有没有把注销器交回来**，本实例都已经声明过了，
        // 立刻立起 `declared`，好让声明 settle 之后才到的兜底回调被挡住。
        declared = true
        lastDeclaration = declaration
```

</details>

**依据 4 · 源码核查**：[presets/multitask/composition.mjs:1796-1857](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/composition.mjs#L1796-L1857)

工具呈现和 minimal 守卫接线。

<details>
<summary>查看原文（62行）</summary>

```text
        // ── ★ 多模式 worker（本次新增；`DSH_MULTITASK_MULTI_MODE=0` 可整体关掉）──
        //
        // 上面两条是「标准」路径，本段这两条是**按任务类型分流**用的。
        // 三条进程内委派路径的差别不在模型，而在**工具面**：
        //
        //   subagent          完整工具面（写文件、跑命令、构建…）—— 默认，写代码/执行类任务
        //   subagent_ptc      PTC 塌缩面（只能直呼 run_code）—— 程序化批量处理
        //   subagent_minimal  只读面（摘掉写入与执行类）—— 只读调研 / 快速问答
        //
        // `subagent_fork` 不属于这个「工具面分流」维度：它的区分点是**继承本对话
        // 上下文**，与工具面正交，所以 fork 本身没有对应的第三种工具面变体。
        ...(MULTI_MODE_ENABLED ? [
          // 程序化批量处理 worker。
          //
          // ⚠️ 这一行**不配 `toolFilter`**，这不是遗漏：
          // PTC 的本质是**呈现塌缩**（`run_code` + 一份生成的 SDK），由该子代理 scope 上的
          // `presentAs('ptc')` 完成（见 `subagent-mode.mjs`），用工具筛选模拟不出来。
          // 而且 `run_code` 是**保留传输名**，`tools.restrict()` 会明确拒绝它 ——
          // 想「用 allow 只放 run_code」也做不到（会抛错）。何况新版本已删除 `toolFilter`。
          //
          // 「这一行是 PTC 模式」由 **provider 名**表达：本行用 `multitask_ptc`，
          // 它落进子代理的 `subagent/descriptor`，`subagent-mode.mjs` 在
          // `agent/created` 时读出来并应用呈现。
          //
          // ⚠️ **不设 `modelSelectionSettings`**（与主行一致）：子代理的模型由用户
          // 在设置面板里按类型决定，不由协调者在会话里临时指派。见主行那段注释。
          {
            id: 'tool-subagent-ptc',
            name: '@deepseek-ai/dsh-tool-subagent',
            config: {
              provider: PTC_PROVIDER,
              toolName: 'subagent_ptc',
              maxDepth: 1,
              ...workerAgentOptions(modelMap, 'subagent_ptc'),
            },
          },

          // 只读调研 worker：收窄由 `minimal-guard.mjs` 单独完成。
          //
          // 早先这里挂着一张静态 `toolFilter.deny`（write / edit / pwsh|bash），
          // 新版本删除该字段后**只能靠守卫那一层**。守卫读的是该 worker scope 的
          // **实际可见集**，算 `deny = 可见集 − 允许集` —— 那张允许集里没有写入与
          // 执行类工具，所以原先静态名单要摘的三项照样被摘掉，而且连别的插件装进来
          // 的工具（`ssh_*` / `task_board_*` 等）也一并覆盖。
          //
          // 「这一行是 minimal 模式」同样由 provider 名表达：`multitask_minimal`。
          {
            id: 'tool-subagent-minimal',
            name: '@deepseek-ai/dsh-tool-subagent',
            config: {
              provider: MINIMAL_PROVIDER,
              toolName: 'subagent_minimal',
              // ⚠️ **不设 `modelSelectionSettings`**（与其余三行一致）。它还有一个
              // 副作用值得记下：那个开关会让本工具改为**逐 agent 单独安装**（注册到
              // 子代理自己的 scope 上），而 `tools.restrict()` 只认**继承面**的名字 ——
              // 于是该工具**结构上不可收窄**，会留在只读 worker 的目录里（实测过：
              // minimal 的清单因此多出 3 个委派工具）。不设它，工具回到全局注册，
              // 那条泄漏的**成因**即消失。
              maxDepth: 1,
              ...workerAgentOptions(modelMap, 'subagent_minimal'),
            },
          },
```

</details>

#### 缺口

- 未在固定宿主实际列出四类工具
  **影响**：宿主版本或服务差异可能改变工具面
  **进一步探讨**：在隔离 profile 验证每个 provider 的工具目录与实际拒绝

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 子任务审批与结果的边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

危险命令判定只在相应交互策略生效，调用守卫会先尊重其他策略，父级审批策略不满足 ask 时不能假定会出现转呈卡。规则能标出部分破坏性模式，未命中的操作仍依宿主沙箱和运行账号控制。minimal 依赖实际宿主 restrict 和工具目录组装接口；代码明确在收窄失败时告警并可能保留已有工具。需在目标宿主验证实际工具和拒绝结果，不能把预设名或模型提示当作权限边界。

#### 证据与依据

**依据 1 · 源码核查**：[presets/multitask/composition.mjs:2100-2115](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/composition.mjs#L2100-L2115)

挂入审批与只读守卫。

<details>
<summary>查看原文（16行）</summary>

```text
    // 父会话策略不是 `ask` 时，子代理保持 `never`，与加入本行之前**逐字等价**。
    //
    // 用与减震器 / subagent-mode / minimal-guard 相同的 `local()` 手法引用，
    // 理由见该函数上方注释：相对名会被解析到 profile 根，且必须把本文件的 `?v=N`
    // query 传播下去，否则改了本文件也只会从 ESM 旧缓存取回旧模块。
    {
      id: 'approval-gate',
      name: local('./approval-gate.mjs'),
      config: { enabled: true },
    },

    // ── ★ 只读守卫：把 minimal worker 收窄成**真的**只读 ──────────────────────
    //
    // 只做一件事：把带 `[multitask-mode:minimal]` 标记的子代理 scope 收窄成
    // 「可见集 − 允许集」，从而摘掉上面那张静态名单**不敢列**的名字。
    //
```

</details>

**依据 2 · 源码核查**：[presets/multitask/approval-gate.mjs:1399-1414](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/approval-gate.mjs#L1399-L1414)

下游优先与 ask 条件。

<details>
<summary>查看原文（16行）</summary>

```text
  // `ask`。这样本模块永远不会覆盖别人的拒绝，也不会与它们抢跑。
  if (config?.classify !== false) {
    ctx.on('tools/pre-execute', async (exec, next) => {
      const downstream = await next()
      try {
        if (downstream?.kind !== 'allow') return downstream

        const agent = exec?.agent
        if (!isDelegatedChild(agent)) return downstream

        // ⚠️ 这一条是**必须**的：策略不是 `ask` 时，返回 `ask` 只会被
        // `decide()` 的第一行按 `never` 判成 `rejected` —— 那会把一条原本能在沙箱里
        // 正常跑完的命令变成拒绝。宁可不问，也不能制造出一个必然被拒的询问。
        if (effectivePolicyOf(ctx, agent.session) !== 'ask') return downstream

        // ── 让位给自动审查（EXP）────────────────────────────────────────────
```

</details>

**依据 3 · 源码核查**：[presets/multitask/approval-gate.mjs:1677-1686](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/approval-gate.mjs#L1677-L1686)

重新检查父审批策略。

<details>
<summary>查看原文（10行）</summary>

```text
        // 那时再问只会被 `decide()` 的第一行按 `never` 判成 `rejected` —— 这与本模块
        // 贯穿始终的取向相反：**绝不在非交互式会话上装 `ask`**。所以这里重读一次。
        if (effectivePolicyOf(ctx, root?.session) !== 'ask') {
          noteRetry('SKIPPED', 'parent-not-interactive')
          return undefined
        }
        const outcome = await approval.request(buildRelayPayload({ root, name, id, why, source }))
        noteRetry('RETRIED', undefined, `the retried relay reached the parent session; outcome=${String(outcome)}`)
        return outcome
      } catch (retryError) {
```

</details>

**依据 4 · 源码核查**：[presets/multitask/minimal-guard.mjs:672-696](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/minimal-guard.mjs#L672-L696)

实际 restrict 及失败时的警告和剩余工具。

<details>
<summary>查看原文（25行）</summary>

```text
    }

    try {
      const dispose = tools.restrict({ deny })
      narrowed.add(agent)
      // 用 `addCleanup`（数组追加）而不是 `live.set`（整体覆盖）：这个 worker 上
      // 还挂着上面那次目录过滤的 disposer，覆盖会让它永远不执行。
      addCleanup(agent, dispose)
      if (typeof dispose !== 'function') {
        warn('the tool registry did not return a disposer for the read-only restriction; it may outlive its agent')
      }
      ctx.logger?.info?.(
        `dsh-multitask: read-only worker scope engaged — withheld ${deny.length} tool(s): ${[...deny].sort().join(', ')}` +
          `${catalogEngaged ? ' (plus a catalog-level filter for tools that cannot be restricted)' : ''}`,
      )
    } catch (error) {
      // 走到这里说明 deny 里混进了注册表不认识的名字 —— 也就是上面那次可见面读取
      // 与这次施加之间发生了 roster 竞态。必须报出来，且**不重试、不降级**：
      // 少摘的工具不会因此被摘掉，但没有偷偷放宽任何东西（静态层仍在）。
      warn(
        `engaging the read-only restriction failed: ${error instanceof Error ? error.message : String(error)} — ` +
          'that worker keeps every tool the composition registered. There is no static tool filter behind this ' +
          'module — DSH 0.2.1-rc.2 removed the delegation row\'s toolFilter field. ' +
          '[MINIMAL-NARROW-SKIPPED reason=restrict-threw]',
      )
```

</details>

#### 缺口

- 未执行安全对照和审批中断测试
  **影响**：不能推断所有命令均安全或 headless 会阻塞等批准
  **进一步探讨**：用可丢弃目录验证交互与无交互的安全样本及拒绝

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何比较相同任务的实际收益和代价？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

让熟悉 DSH 的开发者用相同模型、同一可丢弃仓库比较普通模式与 Multitask。先试最小 worker 的只读归纳，要求结论能指回同样的文件与条件，并实际检查写入拒绝。记录协调者和 worker 的总 token、等待、重复传达、错误与修正成本。待验证假设是工具结果较长时委派可压低主会话输入并维持正确率；若总成本升高或必须反复补上下文，则不值得改用。工具缺失、只读约束未生效或审批未按预期呈现时，停止派单并在新会话改用标准模式。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:130-149](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/README.zh.md#L130-L149)

模式选择和任务交接流程。

<details>
<summary>查看原文（20行）</summary>

```text
**新建会话**时，在模式选择器里选 **「Multitask 减震器模式」**，然后正常提需求即可。

> 模式可以在**会话首轮开始之前**选择；首轮还没开始的会话，也仍然可以切进或切出本模式。被冻结的是**已经开始跑首轮**的会话 —— 这是 DSH 的既有约束（工具面与提示词在首轮就冻结了），不是本插件的限制。

协调者会把你的需求翻译成**自包含**的任务书 —— 子代理看不到这段对话，所以任务书必须带上它需要知道的一切（目标、已核实的现状、项目约定、安全闸、编号任务、条件分支、停止条件、回报格式）。互不依赖的任务会**并行**下发；协调者随后**结束回合**，worker 回报时由运行时以新回合唤醒它 —— 结论不会丢，主对话的上下文也不会被等待填满。

---

## 四类子代理

协调者有四条委派路径，差别主要在**工具面**：

| 委派工具 | 工具面 | 适用任务 |
|---|---|---|
| `subagent` | **完整** | 默认。写代码、跑测试、改文件、执行类任务 |
| `subagent_fork` | **完整** + 继承本对话的**已完成轮次** —— 它**看不到**当前正在进行的那一轮，所以派单那一轮里说过的事实必须在任务书里再说一遍 | 复查、续写 —— 需要「接着这份上下文往下做」时 |
| `subagent_ptc` | **PTC 塌缩**：只能直呼 `run_code`，其余工具在程序里经生成的 SDK 调用 | 程序化批量处理：海量数据的过滤/聚合/搬运，中转数据不该进上下文 |
| `subagent_minimal` | **只读**：摘掉写入与执行类工具，但保留 `read` `grep` `glob` `read_image` `file_info` `skill` `todo_write` `present`，并且**仍然可以搜索与抓取网页** | 只读调研、快速问答、核查事实 |

按任务的形状挑，不按习惯挑。四条路的工具面不同，每次委派都要在协调者人格里重新判断（小节 `## Choosing which worker to delegate to`）。
```

</details>

**依据 2 · 源码核查**：[lib/worker-providers.js:124-140](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/lib/worker-providers.js#L124-L140)

缺 provider 会影响实际验证。

<details>
<summary>查看原文（17行）</summary>

```text
        if (typeof subagents?.registerProvider !== 'function') {
          warn(
            `the subagents service exposes no registerProvider(); the "${providerName}" worker backend was NOT ` +
              `registered, so that delegation tool will be missing [MULTITASK-PROVIDER-SKIPPED reason=no-register-api]`,
          )
          continue
        }
        // 已经注册过（热替换 / 重复插入 / 上游 effect 存活）就不再注册。
        const existing = typeof subagents.getProvider === 'function' ? subagents.getProvider(providerName) : undefined
        if (existing !== undefined) continue
        subagents.registerProvider(new InProcessSpawnProvider(providerName))
      } catch (error) {
        warn(
          `registering the "${providerName}" worker backend failed: ` +
            `${error instanceof Error ? error.message : String(error)} — that delegation tool will be missing, ` +
            `the rest of the mode keeps working [MULTITASK-PROVIDER-SKIPPED reason=register-threw]`,
        )
```

</details>

**依据 3 · 源码核查**：[presets/multitask/minimal-guard.mjs:672-696](https://github.com/Senguk520/dsh-multitask/blob/e79ab500fddfea2f1b05af7b9def6bc3ea97209e/presets/multitask/minimal-guard.mjs#L672-L696)

要求对实际工具行为验收。

<details>
<summary>查看原文（25行）</summary>

```text
    }

    try {
      const dispose = tools.restrict({ deny })
      narrowed.add(agent)
      // 用 `addCleanup`（数组追加）而不是 `live.set`（整体覆盖）：这个 worker 上
      // 还挂着上面那次目录过滤的 disposer，覆盖会让它永远不执行。
      addCleanup(agent, dispose)
      if (typeof dispose !== 'function') {
        warn('the tool registry did not return a disposer for the read-only restriction; it may outlive its agent')
      }
      ctx.logger?.info?.(
        `dsh-multitask: read-only worker scope engaged — withheld ${deny.length} tool(s): ${[...deny].sort().join(', ')}` +
          `${catalogEngaged ? ' (plus a catalog-level filter for tools that cannot be restricted)' : ''}`,
      )
    } catch (error) {
      // 走到这里说明 deny 里混进了注册表不认识的名字 —— 也就是上面那次可见面读取
      // 与这次施加之间发生了 roster 竞态。必须报出来，且**不重试、不降级**：
      // 少摘的工具不会因此被摘掉，但没有偷偷放宽任何东西（静态层仍在）。
      warn(
        `engaging the read-only restriction failed: ${error instanceof Error ? error.message : String(error)} — ` +
          'that worker keeps every tool the composition registered. There is no static tool filter behind this ' +
          'module — DSH 0.2.1-rc.2 removed the delegation row\'s toolFilter field. ' +
          '[MINIMAL-NARROW-SKIPPED reason=restrict-threw]',
      )
```

</details>

#### 缺口

- 未测 token、时延和误差
  **影响**：不能量化总净收益
  **进一步探讨**：以同任务、模型和验收标准记录各 worker 与主会话资源

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
