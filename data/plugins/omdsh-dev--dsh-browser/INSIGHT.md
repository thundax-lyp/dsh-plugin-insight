# dsh Browser Control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[23895d7](https://github.com/omdsh-dev/dsh-browser/tree/23895d7292495f665e5676d2f174d022bb3c3605)

<!-- BEGIN META -->
[![GitHub ★ 908](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=908&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-browser)
<!-- END META -->

> **功能**：通过Chrome或Firefox扩展和DSH侧栏，使用结构化文本读取并操作已有登录网页。

> **亮点**：把已有登录网页、文本工具和侧栏会话连接起来，审批后复核文档/来源，减少状态错配；不是截图视觉代理。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：字段遮罩不等于全页面脱敏，auto允许直接读页而显式unrestricted绕过审批；真实账号动作需检查最终业务状态，不能以工具ok代替验收。[Q02](#research-q02)

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
  - [Q01 · 真实标签页的文本控制适合谁，何时应选其他办法？](#detail-section-11)
  - [Q02 · 审批后页面变了会怎样，敏感内容屏蔽到哪里？](#detail-section-12)
  - [Q03 · 为什么应先在测试站点试用？](#detail-section-13)
  - [Q04 · 怎样复用页面变化检查并验证编号不会误指？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让DSH用户对已有登录网页查读或填写常规表单，以最终页面和业务状态验收。

人工浏览或独立Playwright上下文。真实登录态复用方便，但隔离、像素控制和事务撤销是不同需求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文本快照与编号控件 | 页面读取及表单操作 | 非截图视觉，保护页DOM不可用 |
| 来源审批 | 人确认真实页面动作 | 显式无约束配置会绕过提示 |
| 字段遮罩 | 减少敏感表单值回显 | 启发式不是全页面脱敏 |
| 标签页绑定 | 避免手动换页静默改目标 | 需处理用户交接与丢失状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH及Node/pnpm环境 | 必需 | 桥与宿主运行 | 按固定版本构建，不装同名无关npm包 |
| Chrome或Firefox扩展 | 必需 | 页面执行与侧栏 | Firefox需token，浏览器保护页有边界 |
| 模型服务与页面网络 | 任务必需 | 理解快照及网页访问 | 产生调用成本与信息发送 |
| 受控浏览器权限与共享策略 | 必需 | 保护真实账号页面 | 不先启用无约束控制 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 审阅安装源并固定桥/扩展版本 | 两端正确加载，不执行本文未审阅脚本 |
| 2 | 测试站点只读及单个表单动作 | 核对共享和审批是否实际生效 |
| 3 | 测试等待审批期间换页/取消 | 应重新快照或拒绝，不能点错页 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/扩展下载与构建 | 版本配置、权限和token | 标准plugin命令不足 |
| 持续使用 | 快照与模型调用 | 审批、检查网页业务结果 | delta可能少传内容但未测账单 |
| 失败恢复 | 重抓页面、可能重复动作 | 对账表单或提交状态 | 取消不能自动撤销已提交业务 |
| 退出 | 保留网站数据 | 卸载扩展/桥、清信任和token | 网站既有修改需另行处理 |

已有登录网页的重复任务适合先试，重要提交需人工核对最终状态。若页面主要是画布，或不能接受页面正文发送模型，应继续人工浏览或选择隔离的其他自动化。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审批后防错页 | 复核document/来源边界 | 所有SPA动态控件可靠性 |
| 字段隐私 | 密码及启发式敏感字段遮罩 | 正文和未标记字段覆盖 |
| 自动化效率 | 作者小型配对基准 | 真实站点成功率和费用 |

> **思考**：字段遮罩不等于全页面脱敏，auto允许直接读页而显式unrestricted绕过审批；真实账号动作需检查最终业务状态，不能以工具ok代替验收。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把已有登录网页、文本工具和侧栏会话连接起来，审批后复核文档/来源，减少状态错配；不是截图视觉代理。[Q01](#research-q01) [Q02](#research-q02)

审批策略为纯函数，tab-affinity把控制标签页和当前可见标签页分开，工具执行多次检查targetStillAllowed。审批之后再比较document和来源边界，是对人等待期间页面变化的实际防线；接收脚本缺失时才注入，已发送后无响应则要求重新快照，而不是一律重发。

<a id="detail-section-5"></a>

### 1.4 主要限制

字段遮罩不等于全页面脱敏，auto允许直接读页而显式unrestricted绕过审批；真实账号动作需检查最终业务状态，不能以工具ok代替验收。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

有重复登录网页任务且接受页面文本发送模型的DSH用户可先在测试站点试用；保持明确共享与审批设置，检查换页和取消；画布任务或敏感正文无法发送时退回人工或隔离自动化。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

执行前授权和审批后文档复核有源码支持；全页面隐私、动态编号可靠性及基准收益未实测。

- 已检查：作者 README、包清单、源码路径 README.md、extensions/dsh-browser/src/background/tools.ts、extensions/dsh-browser/src/background/authorization.ts、extensions/dsh-browser/src/content/privacy.ts、extensions/dsh-browser/src/content/snapshot.ts、extensions/dsh-browser/src/background/tab-affinity.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件核查扩展后台执行、授权策略、字段隐私和tab状态机；不代表全部内容抽取、浏览器权限或端到端站点测试。
- 下一步：测试站点覆盖审批等待换页、控件重排和取消，核对最终业务状态及模型收到的非真实秘密标记。

**分析版本**

- **仓库**：[omdsh-dev/dsh-browser](https://github.com/omdsh-dev/dsh-browser)
- **版本号**：0.1.4（[固定提交 23895d7](https://github.com/omdsh-dev/dsh-browser/tree/23895d7292495f665e5676d2f174d022bb3c3605)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对同文档动态重排增加快照版本和控件语义绑定，先与现有元素验证比较错点和误拒，再决定是否引入；尚未验证。[Q04](#research-q04)

测试站点覆盖审批等待换页、控件重排和取消，核对最终业务状态及模型收到的非真实秘密标记。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1158 | — | — | 18244 |
| .mjs | source | 15 | 2864 | 2679 | 48 | — |
| .mjs | test | 8 | 495 | 458 | 7 | — |
| .ts | source | 64 | 12360 | 9725 | 1791 | — |
| .tsx | source | 5 | 2844 | 2605 | 119 | — |
| .ts | test | 67 | 12013 | 10523 | 484 | — |
| .js | source | 1 | 180 | 160 | 9 | — |
| .mjs | example | 1 | 51 | 38 | 11 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/omdsh-dev/dsh-browser/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：真实登录浏览器的文本控制能否支持可控网页任务，其审批与隐私边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实标签页的文本控制适合谁，何时应选其他办法？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要在已有登录网页查资料或填写常规表单的DSH用户。页面被整理为标题、正文和编号控件，模型根据编号点击输入；相比独立无登录浏览器可少做登录状态迁移，相比人工浏览可把当前页和会话任务连起来。合格结果应由最终页面内容和业务状态验收，而非工具返回ok。

该设计是文本浏览器控制与侧栏集成，不是视觉代理。画布、拖拽和依赖像素信息的页面未必能由DOM编号表达；受保护浏览器页也只支持部分浏览器级动作。README速度数字是作者在2026-08-18的小型配对基准，本次未复现，不能推广所有站点。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-18](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/README.md#L7-L18)

真实登录浏览器、结构文本和双端组件定位。

<details>
<summary>查看原文（12行）</summary>

```text
Connect [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) to the Chrome or Firefox tabs you are already using. The model can read page content, operate controls, navigate, and manage tabs while preserving your login state, session, and cookies. A side panel or sidebar provides the conversation UI.

`dsh` is DeepSeek AI's open-source, plugin-based agent harness. This repository provides a companion browser bridge plugin and Chrome/Firefox MV3 extension as one standalone pnpm workspace.

Browser operation remains text-only: pages become structured text with a numbered inventory of interactive elements, and the model addresses those elements by number. dsh 0.2.0 multimodal chat is separate from that page channel—the side panel accepts PNG, JPEG, WebP, and GIF attachments when the host advertises image support, while browser tools still never capture screenshots.

> [!IMPORTANT]
> The workspace pins dsh 0.2.0-rc.2, the minimum supported runtime. Older DSH releases are not supported.

## Quick install

The standard `dsh plugin` command alone cannot install this project. The integration contains both a dsh bridge plugin and a browser extension. The one-line installer currently sets up the Chrome build.
```

</details>

**依据 2 · 作者声明**：[README.md:37-46](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/README.md#L37-L46)

基准范围和作者报告数字。

<details>
<summary>查看原文（10行）</summary>

```text
## Performance

In a paired 60-run end-to-end benchmark on August 18, 2026, both backends completed all 30 assigned runs successfully, while dsh Browser Control required fewer model/tool round trips and finished faster:

| Backend | Success | Mean end-to-end latency | Mean browser tool calls |
|---|---:|---:|---:|
| **dsh Browser Control** | **30/30** | **5.32 s** | **3.4** |
| Matched Playwright baseline | 30/30 | 6.67 s | 4.7 |

The paired Playwright / extension duration ratio was **1.24** (95% CI **1.16–1.34**): Playwright took about 24% longer, or equivalently, dsh Browser Control reduced latency by about 20% and saved 1.35 seconds per task on average. The suite used six browser tasks, five deterministic seeds, the same DSH profile and model (`deepseek-v4-flash`), and independently validated page state. See the [benchmark methodology and reproduction guide](benchmark/README.md).
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:704-708](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/tools.ts#L704-L708)

保护页面拒绝DOM操作。

```text
  const frameError = validateFrameTarget(call, frames)
  if (frameError !== undefined) return frameError
  if (!isInjectablePage(tab.url) && !TAB_NATIVE_TOOLS.has(call.name)) {
    return unavailable('The current page DOM is protected by the browser. Only snapshot metadata, navigate, back, forward, and reload are available on this page.')
  }
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审批后页面变了会怎样，敏感内容屏蔽到哪里？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

执行链先检查取消与到期，再检查页面共享off，取得目标tab/frames并验证元素。除显式unrestricted配置外，动作调用approvalPromptForCall，授权不是approved就返回失败；等待后重新抓frames、检查来源边界和目标document，变化则要求重新快照，而不是继续点旧编号。

共享auto允许读页面而不逐次问，off会阻止页面读取，但unrestrictedAccess显式绕过这项条件。密码及信用卡字段通过type、autocomplete和名称模式识别，并把字段值变为固定占位符；这不是通用敏感数据检测，正文、未标注字段和页面自控文字仍需按不可信输入处理。源码支持有条件屏蔽，不能宣称任何敏感信息都不会离开页面。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:684-735](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/tools.ts#L684-L735)

取消、共享off、实际授权和审批后文档复核在dispatch前执行。

<details>
<summary>查看原文（52行）</summary>

```text
  if (isCancelled(call, signal)) return cancelled()
  const effectiveBudget = budget ?? { maxItems: 60, maxChars: DEFAULT_SNAPSHOT_MAX_CHARS }
  if (isTabManagementTool(call.name)) {
    return dispatchTabManagementTool(call, effectiveBudget, authorize, signal, tabManagement)
  }
  // Privacy boundary: with sharing off, no page content may leave the page.
  if (!tabManagement.unrestrictedAccess
    && sharePageContent === 'off'
    && (call.name === 'browser_snapshot' || call.name === 'browser_get_text')) {
    return { ok: false, error: { code: 'action-failed', message: 'Page content sharing is disabled in Settings > Page content sharing.' } }
  }
  const tab = targetTab ?? (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]
  if (isCancelled(call, signal)) return cancelled()
  if (tab?.id === undefined) {
    return { ok: false, error: { code: 'no-active-tab', message: 'No active tab is available for browser operations.' } }
  }
  if (targetStillAllowed?.() === false) return targetChanged()
  const frames = await listTabFrames(tab.id, tab.url)
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  const frameError = validateFrameTarget(call, frames)
  if (frameError !== undefined) return frameError
  if (!isInjectablePage(tab.url) && !TAB_NATIVE_TOOLS.has(call.name)) {
    return unavailable('The current page DOM is protected by the browser. Only snapshot metadata, navigate, back, forward, and reload are available on this page.')
  }
  const targetError = validateElementTarget(call, tab.id, frames)
  if (targetError !== undefined) return targetError
  const approval = tabManagement.unrestrictedAccess
    ? undefined
    : approvalPromptForCall(call, sharePageContent, frames)
  if (approval !== undefined) {
    const authorization = authorize === undefined ? 'unavailable' : await authorize(approval)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    if (authorization !== 'approved') {
      return approvalFailure(approval, authorization)
    }
  }
  let executionFrames = frames
  if (approval !== undefined) {
    executionFrames = await listTabFrames(tab.id, tab.url)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    const refreshedApproval = approvalPromptForCall(call, sharePageContent, executionFrames)
    if (refreshedApproval === undefined
      || !sameApprovalBoundary(approval, refreshedApproval)
      || (approval.kind === 'action' && !sameTargetDocument(call, frames, executionFrames))) {
      return unavailable('The page changed while approval was pending. Call browser_snapshot again before retrying.')
    }
    const refreshedTargetError = validateElementTarget(call, tab.id, executionFrames)
    if (refreshedTargetError !== undefined) return refreshedTargetError
  }
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/background/authorization.ts:8-18](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/authorization.ts#L8-L18)

读取和改状态工具分类。

<details>
<summary>查看原文（11行）</summary>

```text
const PAGE_READS = new Set(['browser_snapshot', 'browser_get_text'])
const STATE_CHANGING_ACTIONS = new Set([
  'browser_click',
  'browser_type',
  'browser_press',
  'browser_navigate',
  'browser_open_tab',
  'browser_back',
  'browser_forward',
  'browser_reload',
])
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/authorization.ts:55-74](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/authorization.ts#L55-L74)

跨来源导航不扩大信任。

<details>
<summary>查看原文（20行）</summary>

```text
  const frameId = requestedFrame(call.args)
  const target = frames.find((frame) => frame.frameId === frameId) ?? frames.find((frame) => frame.frameId === 0)
  const origins = uniqueOrigins(target === undefined ? [] : [target], frames)
  let canTrust = origins.length === 1 && call.name !== 'browser_back' && call.name !== 'browser_forward'
  if (call.name === 'browser_navigate') {
    const destination = originFromUrl(typeof call.args.url === 'string' ? call.args.url : '')
    if (destination !== undefined && !origins.includes(destination)) origins.push(destination)
    // Do not let an invalid, opaque, or cross-origin navigation become a
    // back door for adding the current page to the persistent allowlist.
    canTrust = destination !== undefined && origins.length === 1 && origins[0] === destination
  }
  return {
    kind: 'action',
    action: call.name,
    summary: summarizeAction(call, locale),
    origins,
    // Cross-origin/invalid navigation and unknown history destinations always
    // require a fresh decision; they must never expand trust implicitly.
    canTrust,
  }
```

</details>

**依据 4 · 源码核查**：[extensions/dsh-browser/src/content/privacy.ts:30-50](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/content/privacy.ts#L30-L50)

敏感字段启发式与固定遮罩。

<details>
<summary>查看原文（21行）</summary>

```text
export function isSensitiveField(el: Element): boolean {
  if (el instanceof HTMLInputElement) {
    if (el.type === 'password') return true
    const autocomplete = String(el.autocomplete)
    if (autocomplete === 'credit-card' || autocomplete.startsWith('cc-')) return true
  }
  const name = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement
    ? el.name
    : ''
  const haystack = [el.id, name, el.getAttribute('aria-label')].filter(Boolean).join(' ')
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(haystack))
}

/**
 * Mask a sensitive value for snapshots. Non-empty values become a fixed
 * placeholder so the model knows a value is present without learning it.
 * @param value - the field's current value.
 * @returns the masked representation.
 */
export function maskValue(value: string): string {
  return value.length === 0 ? '' : '••••'
```

</details>

**依据 5 · 源码核查**：[extensions/dsh-browser/src/content/snapshot.ts:238-252](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/content/snapshot.ts#L238-L252)

快照用实际敏感检测来决定输出值。

<details>
<summary>查看原文（15行）</summary>

```text
    const masked = isSensitiveField(el)
    const checkable = el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')
    const value = checkable
      ? ''
      : el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      ? el.value
      : el instanceof HTMLSelectElement
        ? selectedText(el)
        : ''
    forms.push({
      index,
      label: nameOf(el),
      kind: el instanceof HTMLInputElement ? el.type : el.tagName.toLowerCase(),
      value: masked ? maskValue(value) : value.slice(0, 120),
      masked,
```

</details>

#### 缺口

- 未完整检查所有页面文本抽取、iframe与动态组件的敏感数据覆盖。
  **影响**：不能把字段遮罩扩大为全页面隐私保证。
  **进一步探讨**：用非真实秘密的标记样本测试正文、未标注输入和iframe，核对模型收到的文本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么应先在测试站点试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH及Node/pnpm环境 | 必需 | 桥与宿主运行 | 按固定版本构建，不装同名无关npm包 |
| Chrome或Firefox扩展 | 必需 | 页面执行与侧栏 | Firefox需token，浏览器保护页有边界 |
| 模型服务与页面网络 | 任务必需 | 理解快照及网页访问 | 产生调用成本与信息发送 |
| 受控浏览器权限与共享策略 | 必需 | 保护真实账号页面 | 不先启用无约束控制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 审阅安装源并固定桥/扩展版本 | 两端正确加载，不执行本文未审阅脚本 |
| 2 | 测试站点只读及单个表单动作 | 核对共享和审批是否实际生效 |
| 3 | 测试等待审批期间换页/取消 | 应重新快照或拒绝，不能点错页 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/扩展下载与构建 | 版本配置、权限和token | 标准plugin命令不足 |
| 持续使用 | 快照与模型调用 | 审批、检查网页业务结果 | delta可能少传内容但未测账单 |
| 失败恢复 | 重抓页面、可能重复动作 | 对账表单或提交状态 | 取消不能自动撤销已提交业务 |
| 退出 | 保留网站数据 | 卸载扩展/桥、清信任和token | 网站既有修改需另行处理 |

已有登录网页的重复任务适合先试，重要提交需人工核对最终状态。若页面主要是画布，或不能接受页面正文发送模型，应继续人工浏览或选择隔离的其他自动化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-35](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/README.md#L18-L35)

双端安装且同名npm包非本项目。

<details>
<summary>查看原文（18行）</summary>

````text
The standard `dsh plugin` command alone cannot install this project. The integration contains both a dsh bridge plugin and a browser extension. The one-line installer currently sets up the Chrome build.

macOS and Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.sh | bash
```

Windows, in PowerShell:

```powershell
$s="$env:TEMP\dsh-install.ps1"; irm https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.ps1 -OutFile $s; powershell -NoProfile -ExecutionPolicy Bypass -File $s
```

When the installer opens `chrome://extensions`, follow its instructions to load or reload **dsh Browser Assistant**. If dsh is already running, restart it after installation. See [Detailed installation and usage](#detailed-installation-and-usage) for prerequisites, startup commands, updates, and developer installation.

> [!IMPORTANT]
> The unscoped [`dsh-browser`](https://www.npmjs.com/package/dsh-browser) package on npm belongs to a different project and is not affiliated with this repository. This project is not currently published as an npm package; use the installer above.
````

</details>

**依据 2 · 作者声明**：[README.md:84-102](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/README.md#L84-L102)

环境、安装构建与扩展重载。

<details>
<summary>查看原文（19行）</summary>

````text
## Detailed installation and usage

Requirements: Node.js `^22.19` or `>=24`, Corepack/pnpm, and Chrome 116+ or Firefox 140+. Windows additionally needs Windows PowerShell 5.1, which ships with Windows, or PowerShell 7+.

### Install or update

For a managed installation, run:

```sh
curl -fsSL https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.sh | bash
```

or, on Windows:

```powershell
$s="$env:TEMP\dsh-install.ps1"; irm https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.ps1 -OutFile $s; powershell -NoProfile -ExecutionPolicy Bypass -File $s
```

The installer downloads `main`, builds and registers the bridge plugin, builds the Chrome extension into `~/.dsh/browser-extension`, and opens `chrome://extensions`. On the first install, load that directory as an unpacked extension; on updates, click **Reload**. Restart dsh if it is already running.
````

</details>

**依据 3 · 作者声明**：[README.md:183-193](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/README.md#L183-L193)

共享、逐来源信任和无约束选项的作者说明。

<details>
<summary>查看原文（11行）</summary>

```text
## Security

- The bridge path sits outside the `/api` trust boundary and performs its own bearer-token authentication.
- Local Chrome extension origins retain zero-configuration loopback access; Firefox origins are per-install UUIDs and must present the bearer token.
- Privileged gateway methods such as `settings.*`, `credentials.*`, and `host.open*` reject non-loopback sources.
- The browser-page pipeline is text-only and never captures screenshots; explicitly attached chat images use dsh's durable attachment service. Password and payment-card values never leave the page.
- When work begins, the assistant binds to the active tab (at prompt submission, or at the first direct browser-tool call). If you switch tabs manually, later browser actions pause and the side panel asks whether the assistant should continue on the original tab or follow the new one. Choosing the original tab permits background operation; the extension never silently retargets or changes your visible tab. Closing the controlled tab also pauses tools until you explicitly select the current page.
- Text you highlight is captured only while a side panel is open and page sharing is not `off`, and never from password or payment-card fields. It stays inside the extension until you send the message, is dropped when you dismiss it or its page navigates or closes, and reaches the model inside the same untrusted-content boundary as page snapshots — including its source title and URL, which the page also controls.
- Page-authored text is wrapped as untrusted input. The default `auto` mode reads only the controlled tab without an extra prompt; privacy-sensitive users can select `ask` for per-read confirmation or `off` to block reads entirely. In `ask` mode, the read dialog can allow one read or persistently switch back to `auto`; this can be reversed in Settings. Read page text is sent to the selected model.
- Click, type, keypress, navigation, history, and reload calls fail closed until the user approves them. An origin may be trusted for the current side-panel session (cleared when the last panel closes or the service worker restarts), while permanent trust is managed explicitly in Settings. Explicit cross-origin `browser_navigate` calls and unknown history destinations always prompt again.
- **Allow unrestricted browser control** is an explicit global opt-in. It becomes active only after the setting is saved successfully; while enabled, page reads, page actions, and tab list/follow/close operations run without approval prompts. Calls capture their access mode when received, so enabling unrestricted control never retroactively elevates an existing restricted call. Disabling it takes effect immediately, cancels calls that have not dispatched an action, waits for already-dispatched browser operations to settle, and only then saves the restrictive setting. A rapid re-enable remains restricted until that revocation finishes, and concurrent saves persist in request order. Browser-protected DOM content remains inaccessible in either mode.
```

</details>

**依据 4 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:689-735](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/tools.ts#L689-L735)

共享及审批条件的实际实现。

<details>
<summary>查看原文（47行）</summary>

```text
  // Privacy boundary: with sharing off, no page content may leave the page.
  if (!tabManagement.unrestrictedAccess
    && sharePageContent === 'off'
    && (call.name === 'browser_snapshot' || call.name === 'browser_get_text')) {
    return { ok: false, error: { code: 'action-failed', message: 'Page content sharing is disabled in Settings > Page content sharing.' } }
  }
  const tab = targetTab ?? (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]
  if (isCancelled(call, signal)) return cancelled()
  if (tab?.id === undefined) {
    return { ok: false, error: { code: 'no-active-tab', message: 'No active tab is available for browser operations.' } }
  }
  if (targetStillAllowed?.() === false) return targetChanged()
  const frames = await listTabFrames(tab.id, tab.url)
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  const frameError = validateFrameTarget(call, frames)
  if (frameError !== undefined) return frameError
  if (!isInjectablePage(tab.url) && !TAB_NATIVE_TOOLS.has(call.name)) {
    return unavailable('The current page DOM is protected by the browser. Only snapshot metadata, navigate, back, forward, and reload are available on this page.')
  }
  const targetError = validateElementTarget(call, tab.id, frames)
  if (targetError !== undefined) return targetError
  const approval = tabManagement.unrestrictedAccess
    ? undefined
    : approvalPromptForCall(call, sharePageContent, frames)
  if (approval !== undefined) {
    const authorization = authorize === undefined ? 'unavailable' : await authorize(approval)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    if (authorization !== 'approved') {
      return approvalFailure(approval, authorization)
    }
  }
  let executionFrames = frames
  if (approval !== undefined) {
    executionFrames = await listTabFrames(tab.id, tab.url)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    const refreshedApproval = approvalPromptForCall(call, sharePageContent, executionFrames)
    if (refreshedApproval === undefined
      || !sameApprovalBoundary(approval, refreshedApproval)
      || (approval.kind === 'action' && !sameTargetDocument(call, frames, executionFrames))) {
      return unavailable('The page changed while approval was pending. Call browser_snapshot again before retrying.')
    }
    const refreshedTargetError = validateElementTarget(call, tab.id, executionFrames)
    if (refreshedTargetError !== undefined) return refreshedTargetError
  }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样复用页面变化检查并验证编号不会误指？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

审批策略为纯函数，tab-affinity把控制标签页和当前可见标签页分开，工具执行多次检查targetStillAllowed。审批之后再比较document和来源边界，是对人等待期间页面变化的实际防线；接收脚本缺失时才注入，已发送后无响应则要求重新快照，而不是一律重发。

未验证假设是把快照编号绑定document版本和控件身份，执行前同时确认语义标签及关键属性，在同文档动态重排时拒绝错位编号。最小测试包含按钮重排、同页SPA重渲染、导航和iframe替换，比较误操作、重抓次数与人工确认时间。若现有validateElementTarget已足够，不增加重复机制；若语义匹配误拒太多，缩小到高影响提交按钮。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/src/background/tab-affinity.ts:1-12](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/tab-affinity.ts#L1-L12)

控制tab与可见tab分离的状态机职责。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Pure state machine for binding browser tools to one user-visible tab.
 *
 * The controller deliberately separates Chrome event handling from the
 * affinity rules so transitions can be tested without a browser runtime.
 * A manual tab switch never silently changes the tool target: it creates a
 * handoff decision, and tool dispatch remains blocked until the user chooses.
 * `keep-always` is the one way out of that per-switch prompt: it pins the
 * controlled tab so later switches resolve straight to `background` instead of
 * asking again, and `ask-again` reverses it without disturbing the binding.
 * Pinning never widens what the tools may touch — the target is still exactly
 * the tab the user already approved — and any change of binding clears it.
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:709-734](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/tools.ts#L709-L734)

元素验证及审批后文档/来源复核。

<details>
<summary>查看原文（26行）</summary>

```text
  const targetError = validateElementTarget(call, tab.id, frames)
  if (targetError !== undefined) return targetError
  const approval = tabManagement.unrestrictedAccess
    ? undefined
    : approvalPromptForCall(call, sharePageContent, frames)
  if (approval !== undefined) {
    const authorization = authorize === undefined ? 'unavailable' : await authorize(approval)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    if (authorization !== 'approved') {
      return approvalFailure(approval, authorization)
    }
  }
  let executionFrames = frames
  if (approval !== undefined) {
    executionFrames = await listTabFrames(tab.id, tab.url)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    const refreshedApproval = approvalPromptForCall(call, sharePageContent, executionFrames)
    if (refreshedApproval === undefined
      || !sameApprovalBoundary(approval, refreshedApproval)
      || (approval.kind === 'action' && !sameTargetDocument(call, frames, executionFrames))) {
      return unavailable('The page changed while approval was pending. Call browser_snapshot again before retrying.')
    }
    const refreshedTargetError = validateElementTarget(call, tab.id, executionFrames)
    if (refreshedTargetError !== undefined) return refreshedTargetError
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:752-779](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/tools.ts#L752-L779)

不确定已发动作与接收脚本缺失区分恢复。

<details>
<summary>查看原文（28行）</summary>

```text
  } catch (error: unknown) {
    if (isCancelled(call, signal)) return cancelled()
    if (!contentScriptReceiverMissing(error)) {
      return unavailable('The content script stopped responding after the operation was dispatched. Call browser_snapshot before continuing.')
    }
    // Manifest content scripts do not run retroactively in tabs that were
    // already open when an unpacked extension was installed or reloaded.
    // Recover in place so the user never has to refresh and lose page state.
    try {
      await injectContentScript(tab.id)
    } catch {
      return await dispatchTabNativeTool(tab.id, tab.url, tab.title, tab.windowId, call, effectiveBudget, signal, targetStillAllowed, tabManagement.commitAction)
        ?? unavailable('The content script could not be loaded on this page. Its DOM does not support browser operations.')
    }
    try {
      if (isCancelled(call, signal)) return cancelled()
      if (targetStillAllowed?.() === false) return targetChanged()
      const refreshedFrames = await listTabFrames(tab.id, tab.url)
      if (isCancelled(call, signal)) return cancelled()
      if (targetStillAllowed?.() === false) return targetChanged()
      const refreshedTargetError = validateElementTarget(call, tab.id, refreshedFrames)
      if (refreshedTargetError !== undefined) return refreshedTargetError
      if (approval !== undefined) {
        const refreshedApproval = approvalPromptForCall(call, sharePageContent, refreshedFrames)
        if (refreshedApproval === undefined
          || !sameApprovalBoundary(approval, refreshedApproval)
          || (approval.kind === 'action' && !sameTargetDocument(call, executionFrames, refreshedFrames))) {
          return unavailable('The page changed while the content script was loading. Call browser_snapshot again before retrying.')
```

</details>

**依据 4 · 源码核查**：[extensions/dsh-browser/src/background/authorization.ts:20-26](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/extensions/dsh-browser/src/background/authorization.ts#L20-L26)

策略函数独立于浏览器执行。

```text
/** Return an approval prompt, or undefined when this call needs no prompt. */
export function approvalPromptForCall(
  call: ToolCall,
  sharePageContent: 'ask' | 'auto' | 'off',
  frames: TabFrame[],
  locale: UiLocale = getUiLocale(),
): ApprovalPrompt | undefined {
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
