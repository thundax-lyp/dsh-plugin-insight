# DSH Computer Use

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[de2bdec](https://github.com/Anionex/dsh-computer-use/tree/de2bdecf86515f206ac25e197417e2c0c73719ff)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,322](https://img.shields.io/static/v1?label=npm+30d&message=3%2C322&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)
<!-- END META -->

> **实现功能**：为DSH提供macOS原生应用观察、语义操作和定向输入能力。

> **核心亮点**：[Q02](#research-q02)把按需工具、观察绑定、精确应用租约和一次性确认连成动作层，减少无状态坐标脚本的盲重放条件。

> **风险与缺陷**：[Q03](#research-q03)动作成功不是业务完成；应用AX支持和失败后的结果判定决定自动化价值，高影响任务不应盲重试。

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
  - [Q01 · 哪些桌面任务需要原生操作层而非API或浏览器？](#detail-section-11)
  - [Q02 · 如何减少盲点按并将动作限定于特定应用？](#detail-section-12)
  - [Q03 · 观察失效和原生应用不支持时是否能安全继续？](#detail-section-13)
  - [Q04 · 授权、监视与失败接管是否值得付出？](#detail-section-14)
  - [Q05 · 怎样将动作执行成功提升为业务结果可核查？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适用于macOS开发者需要让Agent操作没有现成API的原生应用，合格结果是观察到指定应用的实际状态、操作后重新观察并核对目标变化。原办法是人工点按或编写Accessibility/坐标脚本；浏览器任务和已有CLI任务应优先用专用接口，插件自己的说明也明确这一边界。这里不是替代所有接口的万能自动化，而是补足跨原生应用的最后一段操作。重复痛点在人工接管和脚本定位维护，但真实频率与收益仍无独立记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 观察应用 | 读AX树和截图 | macOS权限与目标应用支持 |
| 语义与定向动作 | 点击输入拖动 | 绑定观察、租约和确认 |
| 新状态反馈 | 动作后观察 | 不等于业务后置条件达成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| macOS14+与原生helper | 必需 | 原生操作 | 非macOS不挂工具 |
| Accessibility | 必需 | 读和控制 | 提示授权 |
| Screen Recording | 截图必需 | 视觉观察 | 不提供截图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户装入profile并授权 | provider就绪 |
| 2 | Agent加载Skill、观察应用 | 得到当前观察 |
| 3 | 确认后执行并复核状态 | 不明确则人工接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原生helper与运行环境 | 权限设置 | 部署时间未知 |
| 持续 | 模型与观察 | 确认、业务核对 | 调用量未知 |
| 失败恢复 | 额外观察与重试 | 判定是否已发生动作 | 业务副作用不可由禁用撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态绑定操作 | 观察ID与stateHash | 实际任务成功率 |
| 失效拒绝 | stale观察报错 | 应用覆盖与误拒绝 |

> **思考**：[Q03](#research-q03)动作成功不是业务完成；应用AX支持和失败后的结果判定决定自动化价值，高影响任务不应盲重试。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)把按需工具、观察绑定、精确应用租约和一次性确认连成动作层，减少无状态坐标脚本的盲重放条件。

[Q02](#research-q02)把按需工具、观察绑定、精确应用租约和一次性确认连成动作层，减少无状态坐标脚本的盲重放条件。

可借鉴generation绑定观察和敏感目标重绑定后重新确认；移植要同时维护原生helper、AX适配及宿主授权存储，不能只复制工具定义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)动作成功不是业务完成；应用AX支持和失败后的结果判定决定自动化价值，高影响任务不应盲重试。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。相比临时坐标脚本，插件用观察、租约和确认约束动作，但办结率尚未实测。若应用状态无法可靠观察或操作不可逆，就停止自动重放并改用人工或专用接口。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/service.ts、src/leases.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use)
- **版本号**：0.3.5（[固定提交 de2bdec](https://github.com/Anionex/dsh-computer-use/tree/de2bdecf86515f206ac25e197417e2c0c73719ff)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出任务级后置条件验收的未验证假设，在延迟和重绘场景核对误报完成。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1377 | — | — | 19907 |
| .js | source | 20 | 4154 | 3921 | 216 | — |
| .mjs | source | 8 | 1006 | 928 | 13 | — |
| .ts | source | 20 | 4891 | 4232 | 295 | — |
| .tsx | source | 1 | 578 | 544 | 5 | — |
| .ts | test | 24 | 7039 | 6437 | 117 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=grey&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 8](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=grey&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH Computer Use的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些桌面任务需要原生操作层而非API或浏览器？

**研究主题**：场景与需求、采用判断

#### 完整回答

适用于macOS开发者需要让Agent操作没有现成API的原生应用，合格结果是观察到指定应用的实际状态、操作后重新观察并核对目标变化。原办法是人工点按或编写Accessibility/坐标脚本；浏览器任务和已有CLI任务应优先用专用接口，插件自己的说明也明确这一边界。这里不是替代所有接口的万能自动化，而是补足跨原生应用的最后一段操作。重复痛点在人工接管和脚本定位维护，但真实频率与收益仍无独立记录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-77](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/README.md#L60-L77)

明确动作层范围、接口替代与权限条件

<details>
<summary>查看原文（18行）</summary>

```text
## Scope

`dsh-computer-use` is the native **action layer**. It does not replace narrower interfaces:

- browser tasks should use browser automation and DOM/CDP state;
- APIs, CLIs, and purpose-built application plugins remain preferable when available;
- OCR, visual grounding, and pixel interpretation should use the separately installed `dsh-vision-toolkit`: load the `vision-tools` Skill and pass the exact screenshot Artifact path to `vision_glance`, `vision_ground`, `vision_detect`, `vision_crop`, or `vision_long_screenshot_ocr`; do not replace those tools with shell-driven `tesseract`, `screencapture`, or ad hoc Swift/Python OCR;
- domain bundles such as `dsh-design` can compose Computer Use when a workflow crosses into a native application.

## Quick start

### Prerequisites

- macOS 14 or newer.
- DeepSeek Harness with a Web or Headless Profile and the Skill Tool mounted.
- macOS Accessibility permission for observation and native actions.
- macOS Screen Recording permission only when a screenshot is requested.
- Node.js `^22.19.0` or `>=24.0.0` when building this repository.
```

</details>

#### 缺口

- 真实用户重复任务及办结率未量化。
  **影响**：没有目标人群反复人工接管的任务记录，需求强度只能有条件判断。
  **进一步探讨**：收集无API原生应用的真实可匿名任务，并记录人工基线与使用频率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何减少盲点按并将动作限定于特定应用？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Bundle先初始化macOS provider；非darwin只显示设置，不向模型暴露执行工具。Agent加载Skill后才得到操作工具。service按Agent保存观察，以observationId绑定动作；操作前取得控制租约并重新观察解析目标，敏感目标发生重绑定时使确认失效。执行把app、expectedStateHash和window传给backend，并消费一次性确认。因此相对无状态坐标脚本，增量是观察—授权—动作—新观察的连贯边界；语义动作优先与进程定向路由来自原生层，不等于任意应用都能后台操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:63-72](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/index.ts#L63-L72)

provider就绪和平台分流

<details>
<summary>查看原文（10行）</summary>

```text
  /** Publish model-facing capabilities only after provider integrity and health pass. */
  protected override async [Service.init](): Promise<void> {
    await super[Service.init]()
    if (process.platform !== 'darwin') {
      // Non-macOS hosts keep the profile healthy and show the reason in Web Settings,
      // but never expose Computer Use Tools or the Skill to the model.
      installComputerUseWeb(this.ctx)
      return
    }
    this.consumerDispose = installComputerUseConsumer(this.ctx)
```

</details>

**依据 2 · 源码核查**：[src/service.ts:492-520](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/service.ts#L492-L520)

控制租约、重新定位与确认失效

<details>
<summary>查看原文（29行）</summary>

```text
    await this.leases.ensure(context.agent, stored.backend.app, 'control', `computer_${action.kind}`, context.callId, signal)
    const cursorRequested = this.config.interaction.cursorVisualization === 'visible'
      && (action.kind === 'click' || action.kind === 'scroll' || action.kind === 'drag')
    const observationOptions = {
      screenshot: 'none' as const,
      maxNodes: this.config.maxNodes,
      maxDepth: this.config.maxDepth,
      maxTextBytes: this.config.maxTextBytes,
    }
    let actionObservation = stored.backend
    let cursorActivation: 'already-frontmost' | 'activated' | undefined
    let element = selectedOriginalElement
    let resolution: ComputerTargetResolutionResult | undefined = selectedOriginalElement === undefined
      ? undefined
      : { mode: 'exact-locator', confidence: 1, candidateCount: 1, targetChanged: false }
    if (descriptor !== undefined) {
      const fresh = actionObservation === stored.backend
        ? await this.backend.observe(stored.backend.app, observationOptions, signal)
        : actionObservation
      const resolved = resolveComputerTarget(stored.backend, fresh, descriptor, allowsTargetRebind(action))
      actionObservation = resolved.observation
      element = resolved.element
      resolution = resolved.resolution
    }
    if (action.sensitive === true && resolution?.targetChanged === true) {
      this.confirmations.invalidate(context.agent, action.confirmationToken)
      throw new ComputerUseError(
        'COMPUTER_TARGET_REBIND_REQUIRES_CONFIRMATION',
        'the sensitive target rebound to a fresh element; observe the current UI and request a new one-use confirmation before acting',
```

</details>

**依据 3 · 源码核查**：[src/service.ts:591-612](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/service.ts#L591-L612)

状态指纹和确认消费

<details>
<summary>查看原文（22行）</summary>

```text
    let outcome: BackendActionResult
    const request = {
      action,
      app: actionObservation.app,
      expectedStateHash: actionObservation.stateHash,
      interaction: this.config.interaction,
      ...(element === undefined ? {} : { element }),
      ...(actionObservation.window === undefined ? {} : { window: actionObservation.window }),
    }
    try {
      this.confirmations.consume(context.agent, stored.backend.app, action)
      if (cursorStarted && visualization?.kind === 'drag') {
        const tracked = await this.backend.actDragWithCursor(
          request,
          visualization as BackendCursorAction & { kind: 'drag' },
          signal,
        )
        recordCursor(tracked.cursor)
        outcome = tracked.action
      } else {
        outcome = await this.backend.act(request, signal)
      }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 观察失效和原生应用不支持时是否能安全继续？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

service对未知、过期或其他generation观察报COMPUTER_STALE_OBSERVATION，禁止把旧状态直接用于动作；敏感目标重新绑定需重新确认。macOS Accessibility是必需权限，截图另需Screen Recording，观察租约和控制租约分开。关键限制是AX树完整性、应用响应和输入路由支持；业务是否完成还要看新观察而非仅动作返回成功。失败可能发生在副作用之后，不能盲目重放转账、发送等高影响操作。租约持久化记录会话身份与read grants/denials，但不替代操作事务回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:714-720](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/service.ts#L714-L720)

失效观察拒绝

```text
  private requireObservation(id: ComputerObservationId, agent: Agent): StoredObservation {
    this.prune(agent)
    const stored = this.state(agent).observations.get(id)
    if (stored === undefined || stored.generation !== this.generation) {
      throw new ComputerUseError('COMPUTER_STALE_OBSERVATION', `observation ${String(id)} is unknown, expired, or belongs to another provider generation`)
    }
    return stored
```

**依据 2 · 源码核查**：[src/service.ts:516-520](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/service.ts#L516-L520)

敏感重绑定重新确认

```text
    if (action.sensitive === true && resolution?.targetChanged === true) {
      this.confirmations.invalidate(context.agent, action.confirmationToken)
      throw new ComputerUseError(
        'COMPUTER_TARGET_REBIND_REQUIRES_CONFIRMATION',
        'the sensitive target rebound to a fresh element; observe the current UI and request a new one-use confirmation before acting',
```

**依据 3 · 源码核查**：[src/leases.ts:35-77](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/leases.ts#L35-L77)

会话绑定持久化授权

<details>
<summary>查看原文（43行）</summary>

```text
/** Runtime validation for the whole-Session Computer Use sidecar row. */
export const computerUseSessionStateSchema = z.object({
  session: sessionIdentitySchema,
  readGrants: z.array(z.string().min(1)),
  denied: z.array(deniedLeaseSchema),
}).superRefine((row, ctx) => {
  const readGrants = new Set<string>()
  row.readGrants.forEach((bundleId, index) => {
    if (readGrants.has(bundleId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['readGrants', index],
        message: `duplicate Computer Use read grant '${bundleId}'`,
      })
    }
    readGrants.add(bundleId)
  })

  const denials = new Set<string>()
  row.denied.forEach((denial, index) => {
    const key = `${denial.scope}\0${denial.bundleId}`
    if (denials.has(key)) {
      ctx.addIssue({
        code: 'custom',
        path: ['denied', index],
        message: `duplicate Computer Use ${denial.scope} denial '${denial.bundleId}'`,
      })
    }
    denials.add(key)
  })
})

/** Plugin-owned durable authorization state for one Session lifecycle. */
export type ComputerUseSessionState = z.infer<typeof computerUseSessionStateSchema>

/** One lifecycle-bound Computer Use sidecar record per Session id. */
export const computerUseStateDomainSpec = defineDomain({
  name: 'computer_use_state',
  version: 0,
  tables: {
    sessions: domainTable<SessionId, ComputerUseSessionState>(computerUseSessionStateSchema),
  },
})
```

</details>

#### 缺口

- 应用兼容范围以及中途失败后的业务结果判定需要目标应用案例。
  **影响**：应用AX和定向输入支持范围未完整核查，不能外推后台通用可用。
  **进一步探讨**：选择目标应用及版本，检查观察完整性、过期目标、输入失败及未知结果后的人工接管。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 授权、监视与失败接管是否值得付出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次要在macOS配置权限、加载正确profile和Skill；持续要承担模型推理、观察采集与人工确认，具体费用和耗时未测。失败恢复先检查应用当前状态，必要时人工完成并撤销租约或禁用插件，不能把退出插件视为撤销已完成的应用动作。对于无API的可丢弃编辑任务，有状态约束值得小范围试用；对于后台不能操作的应用、权限不允许或不可逆业务动作，人工或专用API通常更合适。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:71-91](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/README.md#L71-L91)

权限和安装条件

<details>
<summary>查看原文（21行）</summary>

````text
### Prerequisites

- macOS 14 or newer.
- DeepSeek Harness with a Web or Headless Profile and the Skill Tool mounted.
- macOS Accessibility permission for observation and native actions.
- macOS Screen Recording permission only when a screenshot is requested.
- Node.js `^22.19.0` or `>=24.0.0` when building this repository.

Install the Web and Headless bundles directly from npm:

> [!IMPORTANT]
> The published package name is `@anionex/dsh-computer-use`. The former
> `@dsh-external/dsh-computer-use` name was never published to npm and is not
> installable; update any old profile or manifest references before installing.

```sh
dsh plugin --profile web add @anionex/dsh-computer-use
dsh plugin --profile headless add @anionex/dsh-computer-use

dsh --profile web --dump-config | grep computer-use
dsh --profile headless --dump-config | grep computer-use
````

</details>

**依据 2 · 源码核查**：[src/service.ts:591-617](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/service.ts#L591-L617)

动作调用和错误转换，未提供业务回滚

<details>
<summary>查看原文（27行）</summary>

```text
    let outcome: BackendActionResult
    const request = {
      action,
      app: actionObservation.app,
      expectedStateHash: actionObservation.stateHash,
      interaction: this.config.interaction,
      ...(element === undefined ? {} : { element }),
      ...(actionObservation.window === undefined ? {} : { window: actionObservation.window }),
    }
    try {
      this.confirmations.consume(context.agent, stored.backend.app, action)
      if (cursorStarted && visualization?.kind === 'drag') {
        const tracked = await this.backend.actDragWithCursor(
          request,
          visualization as BackendCursorAction & { kind: 'drag' },
          signal,
        )
        recordCursor(tracked.cursor)
        outcome = tracked.action
      } else {
        outcome = await this.backend.act(request, signal)
      }
      if (cursorActivation === 'activated' && outcome.activation !== 'activated') {
        outcome = { ...outcome, activation: 'activated' }
      }
    } catch (error) {
      throw computerUseError(error, `Computer Use ${action.kind} failed`)
```

</details>

#### 缺口

- 每次任务的确认次数、误操作率和人工接管成本未知。
  **影响**：一次办结所需确认、观察与人工接管量未知，尚不能量化总负担。
  **进一步探讨**：在可丢弃表单任务记录观察量、确认次数、错误和接管耗时，并核对退出后权限与状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样将动作执行成功提升为业务结果可核查？

**研究主题**：新假设与验证

#### 完整回答

状态hash和动作后观察提供了证据基础，由此推导未验证的任务级后置条件：用户事先定义“目标字段值/可见状态”，只有新观察匹配才报告完成，未知结果先停并请求接管。相对继续加通用工具，增量是对业务成功的明确验收。用可丢弃表单对比仅动作成功与后置条件验收，注入窗口重绘和延迟，记录误报完成与额外观察量；若误报不下降或者AX状态无法表达结果，则收窄或放弃。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:591-612](https://github.com/Anionex/dsh-computer-use/blob/de2bdecf86515f206ac25e197417e2c0c73719ff/src/service.ts#L591-L612)

预期状态传入动作但不是任务级验收

<details>
<summary>查看原文（22行）</summary>

```text
    let outcome: BackendActionResult
    const request = {
      action,
      app: actionObservation.app,
      expectedStateHash: actionObservation.stateHash,
      interaction: this.config.interaction,
      ...(element === undefined ? {} : { element }),
      ...(actionObservation.window === undefined ? {} : { window: actionObservation.window }),
    }
    try {
      this.confirmations.consume(context.agent, stored.backend.app, action)
      if (cursorStarted && visualization?.kind === 'drag') {
        const tracked = await this.backend.actDragWithCursor(
          request,
          visualization as BackendCursorAction & { kind: 'drag' },
          signal,
        )
        recordCursor(tracked.cursor)
        outcome = tracked.action
      } else {
        outcome = await this.backend.act(request, signal)
      }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
