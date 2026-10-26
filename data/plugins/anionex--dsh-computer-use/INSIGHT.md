# DSH Computer Use

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1e9c886](https://github.com/Anionex/dsh-computer-use/tree/1e9c8862e99ee86519799b8f30e335d22c078ee7)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,269](https://img.shields.io/static/v1?label=npm+30d&message=3%2C269&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)
<!-- END META -->

> **实现功能**：为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。

> **核心亮点**：将观察绑定、精确进程窗口输入、应用授权和动作后状态组织为原生动作层，较盲目桌面脚本有可解释控制边界。[Q03](#research-q03)

> **风险与缺陷**：默认键盘会激活应用，敏感确认依赖调用方正确设置sensitive；不能把定向路由当成全场景无干扰或自动识别高影响保证。[Q04](#research-q04)

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
  - [Q01 · 什么任务需要原生应用动作层？](#detail-section-11)
  - [Q02 · 如何从观察绑定到原生动作再返回新状态？](#detail-section-12)
  - [Q03 · 比通用全桌面鼠标脚本的增量是什么？](#detail-section-13)
  - [Q04 · “不干扰”和“高影响确认”的边界是什么？](#detail-section-14)
  - [Q05 · 加载和权限依赖怎样影响可用性？](#detail-section-15)
  - [Q06 · 原生动作的总成本包括什么？](#detail-section-16)
  - [Q07 · 哪些设计值得借鉴？](#detail-section-17)
  - [Q08 · 怎样降低漏标敏感动作与焦点歧义？](#detail-section-18)
  - [Q09 · 谁应怎样小范围试用？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是必须跨入macOS原生应用、缺少更窄API的Agent任务，例如读取窗口、修改控件后核查状态。合格交付是目标应用内业务结果正确，且用户前台工作未受到非预期干扰。能用应用API、CLI或浏览器DOM完成时应先用它们；本插件不负责像素语义/OCR，也不把截图或点击成功当最终任务完成。

基线为全局鼠标脚本和人工操作；有API/CLI/DOM的任务优先使用窄接口，本次未做速度排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|应用观察|读取AX树与可选截图|系统权限和read lease|
|元素动作|点击/设值/AX动作|有效观察与目标handle|
|键盘输入|输入文本与按键|默认可能激活前台|
|定向指针|滚动、拖拽、坐标fallback|依赖窗口与私有系统符号|
|确认|绑定一次敏感动作|需调用方正确标记sensitive|
|等待与复查|返回新full/diff状态|不证明远程业务已完成|
|诊断与Skill|配置权限和激活工具|工具暴露按Agent控制|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|macOS14+、兼容DSH、Node ^22.19.0或>=24|启动必需|服务与原生helper|非macOS不暴露工具|
|Accessibility|观察/动作必需|AX操作|需系统授权|
|Screen Recording|截图时必需|保存画面|不能截图|
|Skill激活与应用lease|执行必需|渐进暴露和读控范围|需激活/授权|
|视觉语义工具|像素任务可选|解释截图|组件自身不做OCR|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|用户加载插件、权限并启用Skill|helper健康与工具出现|
|观察|模型确定bundle/pid并观察|获得有效observationId|
|操作|模型用handle且核对风险|需要时确认，拒绝则重观察|
|验收|用户核对业务结果及焦点|新AX状态不代替远程提交证明|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|macOS与helper资源，金额未知|系统权限和单应用配置，耗时未知|截图另需录屏权限|
|持续使用|观察/截图上下文和模型，金额未知|核对焦点、敏感行为与结果，耗时未知|每动作有新状态|
|失败恢复|重观察和重试，金额未知|过期目标需重新选择，耗时未知|不可盲目重放|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|目标路由|pid/window和状态hash链路|跨应用正确率|
|低干扰|定向指针输入设计|真实键盘任务前台干扰|
|确认|标记敏感时一次token绑定|模型分类漏判率|

> **思考**：默认键盘会激活应用，敏感确认依赖调用方正确设置sensitive；不能把定向路由当成全场景无干扰或自动识别高影响保证。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将观察绑定、精确进程窗口输入、应用授权和动作后状态组织为原生动作层，较盲目桌面脚本有可解释控制边界。[Q03](#research-q03)

将观察绑定、精确进程窗口输入、应用授权和动作后状态组织为原生动作层，较盲目桌面脚本有可解释控制边界。[Q03](#research-q03)

可借鉴生命周期清理和渐进工具暴露、动作同进程串行、观察局部handle与敏感rebind重新确认。单次确认token绑定动作hash和观察，避免挪用到不同参数；这些机制需调用方正确标敏感。原生私有API以动态符号发现并显式失败，降低静默走全局fallback的风险，但维护仍需跨系统及应用验证。本轮只检查源码，不把作者release测试声明升级为独立验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认键盘会激活应用，敏感确认依赖调用方正确设置sensitive；不能把定向路由当成全场景无干扰或自动识别高影响保证。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

有明确原生应用任务的macOS用户可在可撤销夹具上试用。先给单一应用读权限，再给控制，检查keyboardPolicy并对键盘激活做好预期；观察后动作，遇过期或目标不明时重新观察。发送、付款、删除等由人确认并核对结果，不把敏感flag当独立业务风险识别。未做本版本安装、动作与退出验收，因此不建议直接扩展到所有应用。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查TypeScript服务及Swift定向输入源码，未运行helper或真实应用；作者fixture声明未独立复现，设计假设未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/service.ts、src/confirmations.ts、src/tools.ts、src/leases.ts、src/exposure.ts、native/macos/Sources/Helper/TargetedPointer.swift、native/macos/Sources/Helper/main.swift 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读consumer、service、confirmations、leases、tools、exposure和Swift目标输入/键盘激活路径，未完整审计全部原生代码和二进制，不确认作者运行结论。
- 下一步：在可撤销AppKit夹具和目标应用分别验证焦点策略、过期拒绝、敏感标记、窗口变动及人工接管成本。

**分析版本**

- **仓库**：[Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use)
- **版本号**：0.3.4（[固定提交 1e9c886](https://github.com/Anionex/dsh-computer-use/tree/1e9c8862e99ee86519799b8f30e335d22c078ee7)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把动作风险声明与激活后输入目标摘要一起纳入确认计划，对发送、删除等明确应用语义加入可配置分类器，能减少仅依赖模型sensitive标记的漏判。推导自确认消费条件与键盘激活后焦点变化。最小验证在不真实提交的夹具中构造改标签、按钮重排和激活后焦点切换，比较漏确认率、误拒绝及人工次数；分类器若不能识别或授权负担高于收益，应只收缩可操作应用范围。 [Q08](#research-q08)

在可撤销AppKit夹具和目标应用分别验证焦点策略、过期拒绝、敏感标记、窗口变动及人工接管成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1355 | — | — | 18457 |
| .js | source | 20 | 4022 | 3806 | 199 | — |
| .mjs | source | 8 | 1006 | 928 | 13 | — |
| .ts | source | 20 | 4730 | 4100 | 269 | — |
| .tsx | source | 1 | 578 | 544 | 5 | — |
| .ts | test | 23 | 6744 | 6165 | 114 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Anionex/dsh-computer-use/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：macOS观察绑定与定向输入能否支持可核查的原生应用任务，同时保留焦点、权限及敏感动作边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务需要原生应用动作层？

**研究主题**：场景与需求

#### 完整回答

目标是必须跨入macOS原生应用、缺少更窄API的Agent任务，例如读取窗口、修改控件后核查状态。合格交付是目标应用内业务结果正确，且用户前台工作未受到非预期干扰。能用应用API、CLI或浏览器DOM完成时应先用它们；本插件不负责像素语义/OCR，也不把截图或点击成功当最终任务完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-77](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/README.md#L60-L77)

作者界定action layer与可替代接口及权限。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何从观察绑定到原生动作再返回新状态？

**研究主题**：功能与机制

#### 完整回答

服务按Agent保存观察，动作引用observationId和索引/opaque handle；同进程动作排队，校验元素、窗口、pointer策略与control lease。允许rebind时重新observe并只接受唯一匹配，敏感目标发生变化则撤销确认。动作带expectedStateHash进入backend，原生层优先AX语义操作，fallback定向pid/window，结束后再次观察。新状态只证明观察范围内变化，不证明远程业务已提交。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:308-395](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/src/service.ts#L308-L395)

串行、目标校验、lease及敏感rebind拒绝。

<details>
<summary>查看原文（88行）</summary>

```text
  /** Execute one observation-bound action and always return a fresh post-action observation. */
  async act(action: ComputerActionRequest, context: ComputerUseContext): Promise<ComputerActionResult> {
    const signal = AbortSignal.any([context.signal, this.lifecycle.signal])
    const stored = this.requireObservation(action.observationId, context.agent)
    if (action.kind === 'wait') return await this.wait(stored, action, context, signal)
    return await this.enqueueAction(stored.backend.app, async () => {
      signal.throwIfAborted()
      return await this.actNow(action, context, signal)
    })
  }

  /** Keep this service's actions for one process ordered through post-action observation. */
  private async actNow(
    action: Exclude<ComputerActionRequest, { kind: 'wait' }>,
    context: ComputerUseContext,
    signal: AbortSignal,
  ): Promise<ComputerActionResult> {
    const stored = this.requireObservation(action.observationId, context.agent)
    const index = targetIndex(action)
    const handle = targetHandle(action)
    const originalElement = index === undefined ? undefined : stored.backend.elements.find(candidate => candidate.index === index)
    if (index !== undefined && originalElement === undefined) {
      throw new ComputerUseError('COMPUTER_ELEMENT_UNAVAILABLE', `element ${index} is not part of observation ${String(action.observationId)}`)
    }
    if (allowsTargetRebind(action) && handle === undefined) {
      throw new ComputerUseError('COMPUTER_TARGET_UNAVAILABLE', 'allowRebind requires a targetHandle from the referenced observation')
    }
    const descriptor = handle === undefined ? undefined : stored.targets.get(handle)
    if (handle !== undefined && descriptor === undefined) {
      throw new ComputerUseError('COMPUTER_TARGET_UNAVAILABLE', 'targetHandle is unknown or does not belong to the referenced observation')
    }
    if (descriptor !== undefined && index !== undefined && (descriptor.locator.length !== originalElement?.locator.length
      || !descriptor.locator.every((part, position) => part === originalElement.locator[position]))) {
      throw new ComputerUseError('COMPUTER_TARGET_UNAVAILABLE', 'elementIndex and targetHandle select different elements')
    }
    const selectedOriginalElement = originalElement ?? (descriptor === undefined
      ? undefined
      : stored.backend.elements.find(candidate => candidate.locator.length === descriptor.locator.length
        && candidate.locator.every((part, position) => part === descriptor.locator[position])))
    if (descriptor !== undefined && selectedOriginalElement === undefined) {
      throw new ComputerUseError('COMPUTER_TARGET_UNAVAILABLE', 'targetHandle no longer has provider evidence in the referenced observation')
    }
    if (requiresElement(action) && selectedOriginalElement === undefined) {
      throw new ComputerUseError('COMPUTER_ELEMENT_UNAVAILABLE', `${action.kind} requires elementIndex or targetHandle`)
    }
    if (requiresPointerInput(action, selectedOriginalElement) && this.config.interaction.pointerInputPolicy === 'deny') {
      throw new ComputerUseError(
        'COMPUTER_ACTION_BLOCKED',
        `${action.kind} requires target-process pointer input, which interaction.pointerInputPolicy denies; use an Accessibility action or enable targeted pointer input in host Settings`,
      )
    }
    if (requiresForegroundPermission(action) && this.config.interaction.focusPolicy === 'preserve') {
      throw new ComputerUseError(
        'COMPUTER_ACTION_BLOCKED',
        'AXRaise may raise the target window, which interaction.focusPolicy preserve denies; enable explicit activation in host Settings before using this action',
      )
    }
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
      )
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比通用全桌面鼠标脚本的增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

增量在观察绑定、精确pid/window输入、按应用读/控授权和动作后状态的组合。原生指针桥使用SkyLight定向投递而非简单全局鼠标流，意在让后台应用可控且不移动真实光标。底层AX与事件机制来自macOS，不能归为新系统能力。作者有fixture和监控声明，本次未独立运行，因此只能核查设计而不能确认所有应用都不干扰前台。

#### 证据与依据

**依据 1 · 源码核查**：[native/macos/Sources/Helper/TargetedPointer.swift:26-82](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/native/macos/Sources/Helper/TargetedPointer.swift#L26-L82)

私有框架符号解析和目标pid/window写入。

<details>
<summary>查看原文（57行）</summary>

```text
private final class SkyLightPointerBridge {
    static let shared = SkyLightPointerBridge()

    private let handle: UnsafeMutableRawPointer?
    private let postToPid: PostToPidFunction?
    private let setIntegerField: SetIntegerFieldFunction?
    private let setWindowLocation: SetWindowLocationFunction?

    private init() {
        handle = dlopen(
            "/System/Library/PrivateFrameworks/SkyLight.framework/SkyLight",
            RTLD_LAZY | RTLD_GLOBAL
        )
        postToPid = Self.resolve(handle, "SLEventPostToPid", as: PostToPidFunction.self)
        setIntegerField = Self.resolve(handle, "SLEventSetIntegerValueField", as: SetIntegerFieldFunction.self)
        setWindowLocation = Self.resolve(handle, "CGEventSetWindowLocation", as: SetWindowLocationFunction.self)
    }

    deinit {
        if let handle { dlclose(handle) }
    }

    private static func resolve<T>(_ handle: UnsafeMutableRawPointer?, _ name: String, as type: T.Type) -> T? {
        guard let handle, let symbol = dlsym(handle, name) else { return nil }
        return unsafeBitCast(symbol, to: type)
    }

    var isAvailable: Bool {
        postToPid != nil && setIntegerField != nil && setWindowLocation != nil
    }

    func post(
        _ event: CGEvent,
        target: TargetedPointerTarget,
        localPoint: CGPoint,
        clickState: Int64,
        buttonNumber: Int64,
        subtype: Int64,
        gesturePhase: Int64,
        clickGroup: Int64
    ) throws {
        guard let postToPid, let setIntegerField, let setWindowLocation else {
            throw TargetedPointerError(message: "SkyLight target-process pointer routing is unavailable")
        }
        let pointer = Unmanaged.passUnretained(event).toOpaque()
        setWindowLocation(pointer, localPoint.x, localPoint.y)
        setIntegerField(pointer, 0, gesturePhase)
        setIntegerField(pointer, 1, clickState)
        setIntegerField(pointer, 3, buttonNumber)
        setIntegerField(pointer, 7, subtype)
        setIntegerField(pointer, 40, Int64(target.pid))
        setIntegerField(pointer, 51, target.windowNumber)
        setIntegerField(pointer, 58, clickGroup)
        setIntegerField(pointer, 91, target.windowNumber)
        setIntegerField(pointer, 92, target.windowNumber)

        postToPid(target.pid, pointer)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “不干扰”和“高影响确认”的边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能泛化为所有动作都不抢前台。默认keyboardPolicy为activate，原生代码在键盘动作时会覆盖preserve并激活应用；无元素目标时采用激活后焦点，用户需注意输入对象。另确认消费仅在action.sensitive===true时强制要求token，敏感分类由Skill/调用方提供，不是根据UI业务后果自动识别。私有SkyLight符号也有系统版本兼容风险，符号缺失会失败而非保证通用。

#### 证据与依据

**依据 1 · 源码核查**：[native/macos/Sources/Helper/main.swift:836-869](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/native/macos/Sources/Helper/main.swift#L836-L869)

键盘激活与激活后焦点处理。

<details>
<summary>查看原文（34行）</summary>

```text
    limits: [String: Any],
    snapshot: ObservationSnapshot,
    record: ElementRecord?,
    focusPolicy: String,
    keyboardPolicy: String,
    actionKind: String,
    timeoutMs: Int,
) throws -> (snapshot: ObservationSnapshot, record: ElementRecord?, activation: String) {
    let keyboardAction = actionKind == "type-text" || actionKind == "press-key"
    let effectiveFocusPolicy = keyboardAction && keyboardPolicy == "activate" ? "activate" : focusPolicy
    guard effectiveFocusPolicy == "activate" else {
        return (snapshot, record, "not-requested")
    }
    if app.isActive {
        return (snapshot, record, "already-frontmost")
    }
    try activate(app, timeoutMs: timeoutMs)
    let refreshed = try observeSnapshot(app: app, limits: limits)
    let refreshedRecord: ElementRecord?
    if request["element"] != nil {
        refreshedRecord = try validateTarget(request, snapshot: refreshed)
    } else if keyboardAction {
        // Activation may move focus to the app's default control; typing targets
        // the refreshed focused element. The app identity is already revalidated
        // by the fresh observation, so full pre-activation state equality would
        // only make reliable keyboard input fail.
        refreshedRecord = nil
    } else {
        guard activationStateMatches(snapshot, current: refreshed) else {
            throw fail("COMPUTER_STALE_OBSERVATION", "the application UI changed while the target application was activated")
        }
        refreshedRecord = nil
    }
    return (refreshed, refreshedRecord, "activated")
```

</details>

**依据 2 · 源码核查**：[src/confirmations.ts:88-97](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/src/confirmations.ts#L88-L97)

未标记sensitive时不强制token；分类不由此函数独立识别。

<details>
<summary>查看原文（10行）</summary>

```text
  consume(agent: Agent, app: ComputerAppIdentity, action: ComputerActionRequest): void {
    if (action.sensitive !== true) {
      if (action.confirmationToken !== undefined) {
        throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'confirmationToken is valid only when sensitive is true')
      }
      return
    }
    const token = action.confirmationToken
    if (token === undefined) {
      throw new ComputerUseError('COMPUTER_CONFIRMATION_REQUIRED', 'sensitive action requires a token from computer_confirm')
```

</details>

#### 缺口

- 跨真实应用的焦点变化与模型敏感分类漏判率未知
  **影响**：不能承诺无干扰或所有高影响操作必确认
  **进一步探讨**：在无真实提交的应用夹具上分别测试键盘策略、敏感标记遗漏、窗口变化及后台输入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 加载和权限依赖怎样影响可用性？

**研究主题**：依赖、兼容与流程

#### 完整回答

仅macOS目标环境暴露执行工具，非darwin只显示诊断。需要macOS14+、Accessibility权限、兼容DSH的subprocess/approval/settings/sessions/agents/tools/skills；请求截图另需Screen Recording。Node包要求^22.19.0或>=24，原生helper需正确版本与健康检查通过。模型先加载Skill才暴露执行工具，未激活时只有bootstrap；OCR需另选视觉能力，本组件不提供。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:48-73](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/src/index.ts#L48-L73)

平台判断、注入与provider初始化。

<details>
<summary>查看原文（26行）</summary>

```text
/** macOS provider plus the portable Skill, scoped Tools, and optional Web diagnostics. */
export class ComputerUseBundle extends MacOSComputerUseProvider {
  static override inject = ['subprocess', 'approval', 'settings', 'sessions', 'agents', 'tools', 'skills']
  static override Config = Config

  private consumerDispose: (() => void) | undefined

  constructor(ctx: Context, config: ComputerUseConfig = {}) {
    super(ctx, config)
    ctx.effect(() => () => {
      this.consumerDispose?.()
      this.consumerDispose = undefined
    }, 'dsh-computer-use: consumer lifecycle')
  }

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
  }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 原生动作的总成本包括什么？

**研究主题**：效果与总成本

#### 完整回答

以“目标应用任务成功且无非预期前台干扰”为合格单位。首次需授权、加载和核对helper；持续每步观察/模型决策/动作后复查增加token与等待。过期状态或不唯一匹配会拒绝，恢复需重新观察而非重放，可能增加轮数但减少误点风险。不能从定向路由直接推出端到端更快；没有真实任务合格率、授权频率和人工接管数据，现金及人时未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:468-509](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/src/service.ts#L468-L509)

动作执行及settle明确不提供像素/远程效果因果证明。

<details>
<summary>查看原文（42行）</summary>

```text
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
    } finally {
      if (cursorStarted && visualization !== undefined) {
        try {
          recordCursor(await this.backend.visualizeCursor(
            visualization,
            'after',
            AbortSignal.timeout(1_500),
          ))
        } catch (error) {
          recordCursor({
            visible: false,
            reason: `the agent cursor could not be validated after the action: ${error instanceof Error ? error.message : String(error)}`,
          })
        }
      }
    }
    // The settle loop reports whether the bounded structural observation
    // changed. It complements routing facts without claiming causal proof or
    // visibility into pixel-only, transient, or remote effects.
```

</details>

#### 缺口

- 没有与普通鼠标自动化/API的同任务对照
  **影响**：无法量化节时和误操作减少幅度
  **进一步探讨**：用可撤销表单任务计量成功率、误点、前台干扰、重观察轮次和人工接管

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些设计值得借鉴？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴生命周期清理和渐进工具暴露、动作同进程串行、观察局部handle与敏感rebind重新确认。单次确认token绑定动作hash和观察，避免挪用到不同参数；这些机制需调用方正确标敏感。原生私有API以动态符号发现并显式失败，降低静默走全局fallback的风险，但维护仍需跨系统及应用验证。本轮只检查源码，不把作者release测试声明升级为独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/confirmations.ts:18-34](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/src/confirmations.ts#L18-L34)

确认记录含app/observation/hash/expiry的绑定结构。

<details>
<summary>查看原文（17行）</summary>

```text
interface ConfirmationRecord {
  app: ComputerAppIdentity
  observationId: ComputerObservationId
  actionHash: string
  expiresAt: number
}

function stable(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).sort().filter(key => record[key] !== undefined).map(key => `${JSON.stringify(key)}:${stable(record[key])}`).join(',')}}`
}

function actionHash(action: Omit<ComputerActionRequest, 'confirmationToken'> | ComputerActionRequest): string {
  const { confirmationToken: _token, ...rest } = action as ComputerActionRequest
  return createHash('sha256').update(stable(rest)).digest('hex')
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 怎样降低漏标敏感动作与焦点歧义？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把动作风险声明与激活后输入目标摘要一起纳入确认计划，对发送、删除等明确应用语义加入可配置分类器，能减少仅依赖模型sensitive标记的漏判。推导自确认消费条件与键盘激活后焦点变化。最小验证在不真实提交的夹具中构造改标签、按钮重排和激活后焦点切换，比较漏确认率、误拒绝及人工次数；分类器若不能识别或授权负担高于收益，应只收缩可操作应用范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:196-198](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/src/tools.ts#L196-L198)

sensitive参数明确依赖Skill分类。

```text
const sensitiveParameters = {
  sensitive: { type: 'boolean', description: 'Set true for an action classified by the Skill as high impact or sensitive.' },
  confirmationToken: { type: 'string', description: 'One-use token from computer_confirm for this exact action.' },
```

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁应怎样小范围试用？

**研究主题**：采用判断

#### 完整回答

有明确原生应用任务的macOS用户可在可撤销夹具上试用。先给单一应用读权限，再给控制，检查keyboardPolicy并对键盘激活做好预期；观察后动作，遇过期或目标不明时重新观察。发送、付款、删除等由人确认并核对结果，不把敏感flag当独立业务风险识别。未做本版本安装、动作与退出验收，因此不建议直接扩展到所有应用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:134-148](https://github.com/Anionex/dsh-computer-use/blob/1e9c8862e99ee86519799b8f30e335d22c078ee7/README.md#L134-L148)

默认键盘activate及可选pointer deny边界。

<details>
<summary>查看原文（15行）</summary>

````text
The default interaction policy is:

```yaml
interaction:
  focusPolicy: preserve
  keyboardPolicy: activate
  pointerInputPolicy: targeted
  cursorVisualization: visible
  cursorSpeedPxPerSecond: 1600
  cursorAccelerationPxPerSecondSquared: 6000
  cursorClickDelayMs: 90
  cursorAutoHideMs: 0
```

`cursorVisualization: visible` displays the Agent's own non-interactive cursor for click, scroll, and drag only while the selected application is frontmost. It never replaces or moves the macOS system cursor. Set it to `hidden` when visual feedback is unwanted. `pointerInputPolicy: deny` disables coordinate click/fallback, scroll, and drag. `keyboardPolicy: activate` (Bundle default) makes `type-text` keyboard fallback and `press-key` reliable by activating the target app first; `focusPolicy: activate` is the broader compatibility mode that also activates and freshly revalidates before pointer cursor movement and input.
````

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
