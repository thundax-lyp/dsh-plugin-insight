# DSH 大肥鱼桌面伴侣

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4458ec2](https://github.com/QCYTSN/dsh-dafeiyu/tree/4458ec29466ec0817b7d8bde47b85faf5d79c8d7)

<!-- BEGIN META -->
[![GitHub ★ 527](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=527&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QCYTSN/dsh-dafeiyu) [![npm 30d 60,173](https://img.shields.io/static/v1?label=npm+30d&message=60%2C173&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dafeiyu) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dafeiyu)
<!-- END META -->

> **功能**：由 DSH 会话事件驱动的桌面角色，展示任务阶段、待办和可选余额

> **亮点**：将会话事件、真实todo计数、原生窗口和设置恢复组合成桌面可见状态，明确不从动画猜测进度；可选伴侣失败也隔离宿主。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：状态只是宿主事件投影，正常结束不证明任务合格；Helper连续失败会停用，余额来源和profile也需核对。[Q03](#research-q03)

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
  - [Q01 · 桌面伴侣给离开 DSH 窗口的用户提供什么增量？](#detail-section-11)
  - [Q02 · 状态如何从会话事件到达桌面，并避免虚构进度？](#detail-section-12)
  - [Q03 · 状态成功、余额和Helper恢复各有什么边界？](#detail-section-13)
  - [Q04 · 如何判断常驻角色值得保留，并形成有效改进实验？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向 Agent 运行时切到其他应用工作的 DSH 用户，在桌面查看任务阶段、等待与错误提示。

DSH状态页和宿主通知；增量是桌面持续可见及互动，不等于增加任务执行或验收能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面状态伴侣 | 阶段/待办/等待提示 | 依赖真实会话事件 |
| 设置和余额 | 低动态偏好与可选账户余额 | 需核对profile和来源 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH sessions/settings | 必需 | 事件与实时配置 | 伴侣不可独立推断状态 |
| 对应平台Helper | 必需 | 原生透明窗口 | 失败重试有上限 |
| 正确web/desktop profile | 必需 | 客户端设置与进程范围 | 两边启用可重复窗口 |
| 凭据/账户服务 | 余额可选 | 查询DeepSeek余额 | 可禁用，不影响基本状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户选择实际客户端profile | 版本和原生窗口匹配 |
| 配置 | 用户减少动态/关声音 | 界面设置与原生菜单一致 |
| 任务 | 插件投影真实会话事件 | 项目和等待原因正确 |
| 恢复退出 | 查Helper日志或禁用 | 回宿主状态页，不依赖宠物验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 原生Helper与磁盘资源未知 | 安装/profile核对未知 | 源码包与安装包有区别 |
| 持续使用 | 动画/进程/余额请求资源未知 | 辨认多会话与干扰负担未知 | 无CPU/内存测量 |
| 失败恢复 | 重启资源未知 | 日志、平台与设置排错未知 | 五次失败抑制重启 |
| 退出 | 留存设置/日志资源未知 | 禁用并回宿主界面 | 停止有协议和超时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态可见 | 全局会话事件到Helper | 真实等待发现改善 |
| 进度诚实 | 仅真实todo计算 | 上游todo质量 |
| 偏好保留 | 本地override先记录 | 各平台重启体验 |

> **思考**：状态只是宿主事件投影，正常结束不证明任务合格；Helper连续失败会停用，余额来源和profile也需核对。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将会话事件、真实todo计数、原生窗口和设置恢复组合成桌面可见状态，明确不从动画猜测进度；可选伴侣失败也隔离宿主。[Q01](#research-q01) [Q02](#research-q02)

动态导入降级、总线异常隔离、启动抑制和本地设置fallback可供可选桌面集成借鉴；原生多平台和双配置源增加维护成本。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

状态只是宿主事件投影，正常结束不证明任务合格；Helper连续失败会停用，余额来源和profile也需核对。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先低动态、无声试用单类长任务，对照宿主通知；误导等待、反复失败或干扰工作即禁用。真实任务结果仍在DSH和产物中验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件映射、进度来源和Helper恢复有源码支持；原生交互体验和生产效率未验证，显示策略是待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/plugin.js、src/index.js、src/companion-reducer.js、src/helper-process.js、src/balance.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根插件入口、会话Reducer、Helper进程管理、设置同步、余额和README；不运行原生窗口或评判实际视觉质量。 本轮重新读取固定提交中所列关键入口、状态与失败路径，研究深度仍为源码核查。
- 下一步：未安装或执行目标代码、未运行测试，未做截图/跨屏和平台兼容验收；不把作者截图当本次实测。

**分析版本**

- **仓库**：[QCYTSN/dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu)
- **版本号**：0.1.21（[固定提交 4458ec2](https://github.com/QCYTSN/dsh-dafeiyu/tree/4458ec29466ec0817b7d8bde47b85faf5d79c8d7)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是仅在真实等待/错误时突出显示能降低常驻干扰且保留发现速度；交叉比较常驻和条件显示的等待延迟、误提示、切窗与干扰，漏事件或无减扰即推翻。[Q04](#research-q04)

未安装或执行目标代码、未运行测试，未做截图/跨屏和平台兼容验收；不把作者截图当本次实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2035 | — | — | 22077 |
| .js | source | 13 | 3302 | 2911 | 219 | — |
| .mjs | source | 6 | 331 | 310 | 4 | — |
| .js | test | 20 | 2824 | 2505 | 61 | — |
| .js | example | 7 | 78 | 65 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/QCYTSN/dsh-dafeiyu/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面伴侣给离开 DSH 窗口的用户提供什么增量？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面伴侣给离开 DSH 窗口的用户提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

大肥鱼是原生DSH插件与桌面Helper组合，面向Agent运行时在编辑器或浏览器继续工作的用户。基线是反复切回DSH查看状态，或使用宿主已有通知；合格结果是正确知道哪个项目正在做什么、何时需要人处理，而不是宠物动画本身证明任务完成。README声明透明置顶角色、阶段/待办和余额展示，且不读取屏幕。实际增量在把会话事件映射成桌面可见状态、将配置同步到原生窗口，素材与动画本身来自声明的上游资源，不据此声称原创角色或模型能力。只需偶发通知的人可能用宿主提示就够，长期置顶也可能造成干扰。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-31](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/README.md#L13-L31)

作者说明桌面窗口、上游素材与事件边界。

<details>
<summary>查看原文（19行）</summary>

```text
大肥鱼由 DSH 插件启动，随 DSH 一起退出。透明、无边框、始终置顶的原生窗口，让你在编辑器、浏览器或其他应用中也能看到 Agent 的工作状态。

> **当前稳定版：0.1.21。** 新增 macOS 跨显示器拖动修复；右键菜单里的大小、气泡大小和减少动态在 DSH 设置写入失败时也会保留，并把失败原因写进 Helper 日志。继续包含 0.1.20 的透明区域点击穿透与 0.1.19 的 Helper 冷启动诊断。安装时填写 `dsh-dafeiyu@0.1.21`，离线安装请从[最新版下载页](https://github.com/QCYTSN/dsh-dafeiyu/releases/latest)选择 **`dsh-dafeiyu-0.1.21.tgz`**；Windows、Linux 与 macOS 共用这一个包。GitHub 自动生成的 **Source code (zip / tar.gz)** 是源码，不是安装包。

<img src="docs/images/balance-preview.png" width="460" alt="大肥鱼在任务状态卡底部显示 API 余额">

*原生 Windows 窗口实拍；余额为演示数据。当前角色素材来自 [PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)。*

## 能做什么

- 显示真实任务状态：思考、查找、修改、执行、验证、等待确认、完成和错误。
- 展示项目、步骤、多任务和 DSH 提供的待办进度；没有真实进度时显示阶段。
- 在状态气泡和设置页显示 DeepSeek 余额，区分 API Key 与已登录账户。
- 兼容 WebUI 与官方桌面端的共享客户端；两个客户端使用各自的插件配置。
- 支持拖动、摸头、戳身体、碰尾巴，以及大小、气泡、声音和减少动态设置。
- 可选在 DSH 页面右下角显示轻量角色，默认关闭。

状态来自 DSH 会话事件。大肥鱼不会读取屏幕；推理强度与进度只显示上游实际提供的信息。

```

</details>

**依据 2 · 源码核查**：[src/plugin.js:23-32](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/plugin.js#L23-L32)

原生插件名、会话/设置依赖与路由。

<details>
<summary>查看原文（10行）</summary>

```text
export const name = 'dsh-dafeiyu'
// The plugin's feature is built on session events, and mounting requires the
// settings service (used to read live config). Keep the declared inject in
// sync with those real hard dependencies instead of listing a service that
// is never consumed directly.
export const inject = ['sessions', 'settings']
export const CONFIG_ENDPOINT = '/plugins/dsh-dafeiyu/config'
export const EVENTS_ENDPOINT = '/plugins/dsh-dafeiyu/events'
export const MANIFEST_ENDPOINT = '/plugins/dsh-dafeiyu/manifest'
export const FRAME_ENDPOINT = '/plugins/dsh-dafeiyu/frame'
```

</details>

**依据 3 · 源码核查**：[src/plugin.js:475-489](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/plugin.js#L475-L489)

实际订阅全局会话事件并发送Helper。

<details>
<summary>查看原文（15行）</summary>

```text
  const offEvent = eventCtx.on('session/event', (session, event) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.handle(session, event)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to handle session event', error)
    }
  }, { global: true })
  const offDisposed = eventCtx.on('session/disposed', (session) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.disposeSession(session)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to dispose session', error)
    }
```

</details>

#### 缺口

- 缺少用户错过等待、切窗次数和干扰的对照
  **影响**：不能将陪伴感推断为生产效率或需求强度
  **进一步探讨**：同任务比较宿主通知与桌面角色，记录等待发现、切窗和主观干扰。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态如何从会话事件到达桌面，并避免虚构进度？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口动态导入plugin，依赖缺失时转惰性空插件并记录修复提示，避免可选伴侣破坏宿主启动。plugin订阅根总线session/event，经CompanionReducer产出协议消息传给HelperProcess，处理异常被隔离。Reducer每会话保留状态，默认排除子Agent，turn/start清空旧进度；只有上游todo数组存在才计算已完成数与总数，approval/asked进入等待，turn/end按blocked、aborted和错误区分。因而阶段和todo计数是事件投影，不是对真实工作完成比例的估算。原生设置变化先记录本地override，再异步写宿主设置，失败仍保留并写日志，避免拖动/大小设置丢失。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:9-19](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/index.js#L9-L19)

动态导入失败退为空插件。

<details>
<summary>查看原文（11行）</summary>

```text
let plugin
try {
  plugin = await import('./plugin.js')
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error)
  console.error(
    '[dsh-dafeiyu] 插件依赖加载失败，大肥鱼本次启动已自动停用（不影响 DSH 其他功能）。\n'
    + `[dsh-dafeiyu] 原因: ${detail}\n`
    + '[dsh-dafeiyu] 修复: 完全退出 DSH 后重新安装 `dsh plugin --profile web add dsh-dafeiyu@latest`，或补齐缺失依赖后重启。',
  )
  plugin = { name: 'dsh-dafeiyu', inject: [], apply() {} }
```

</details>

**依据 2 · 源码核查**：[src/plugin.js:475-489](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/plugin.js#L475-L489)

会话事件异常隔离。

<details>
<summary>查看原文（15行）</summary>

```text
  const offEvent = eventCtx.on('session/event', (session, event) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.handle(session, event)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to handle session event', error)
    }
  }, { global: true })
  const offDisposed = eventCtx.on('session/disposed', (session) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.disposeSession(session)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to dispose session', error)
    }
```

</details>

**依据 3 · 源码核查**：[src/companion-reducer.js:136-145](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/companion-reducer.js#L136-L145)

只从真实todo计算进度。

<details>
<summary>查看原文（10行）</summary>

```text
function progressOf(todos) {
  if (!Array.isArray(todos) || todos.length === 0) return undefined
  const completed = todos.filter((todo) => ['completed', 'complete', 'done'].includes(todo?.status)).length
  const currentIndex = todos.findIndex((todo) => todo?.status === 'in_progress')
  return {
    completed,
    total: todos.length,
    current: currentIndex >= 0 ? currentIndex + 1 : undefined,
  }
}
```

</details>

**依据 4 · 源码核查**：[src/companion-reducer.js:186-209](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/companion-reducer.js#L186-L209)

子Agent过滤与每回合清状态。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!event || typeof event.type !== 'string') return []
    const subagent = isSubagent(session)
    if (!this.includeSubagents && subagent) return []

    const sessionId = sessionIdOf(session)
    const record = this.#record(sessionId)
    record.subagent = subagent
    record.lastSeq = Number(event.seq ?? record.lastSeq)
    record.project = projectNameOf(session, event) ?? record.project

    switch (event.type) {
      case 'turn/start':
        record.turnActive = true
        record.openTools.clear()
        record.waitingCallId = undefined
        record.waitingApprovalId = undefined
        record.task = undefined
        record.progress = undefined
        this.#update(record, CompanionState.THINKING, {
          phase: 'turn-start',
          stage: '准备阶段',
          message: statusCopy('preparing', event.seq),
        })
        return this.#render()
```

</details>

**依据 5 · 源码核查**：[src/companion-reducer.js:265-278](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/companion-reducer.js#L265-L278)

等待审批投影。

<details>
<summary>查看原文（14行）</summary>

```text
      case 'turn/end':
        return this.#turnEnd(record, event)

      case 'approval/asked': {
        const id = String(event.data?.id ?? '')
        const toolName = String(event.data?.toolName ?? 'approval')
        record.waitingApprovalId = id
        this.#update(record, CompanionState.WAITING, {
          phase: 'approval',
          stage: '等待审批',
          toolName,
          message: statusCopy('approval', event.seq),
        })
        return this.#render()
```

</details>

**依据 6 · 源码核查**：[src/plugin.js:400-427](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/plugin.js#L400-L427)

本地override与宿主写入失败保留。

<details>
<summary>查看原文（28行）</summary>

```text
      onSettingsChange: (report) => {
        if (typeof settings.update !== 'function') return
        const patch = {}
        if (Number.isFinite(report.scale)) patch.scale = Math.min(1.4, Math.max(0.55, report.scale))
        if (Number.isFinite(report.bubbleScale)) patch.bubbleScale = Math.min(1.2, Math.max(0.8, report.bubbleScale))
        if (typeof report.reducedMotion === 'boolean') patch.reducedMotion = report.reducedMotion
        if (Object.keys(patch).length === 0) return
        // Capture the host values before the write: the fallback only applies
        // while the host still holds the same baseline.
        const hostBefore = hostSettings.get()
        // Record before the write: DSH can resolve settings.update() without
        // the profile patch actually reaching disk. The store keeps the menu
        // value while the host holds either the old baseline or that value, and
        // a later host-side change (a third value) clears it.
        overrides.record(patch, hostBefore)
        void Promise.resolve(hostSettings.update(patch)).then(() => {
          diagnosticsLog.write('INFO', `persisted native menu settings: ${JSON.stringify(patch)}; fallback retained: ${JSON.stringify(overrides.snapshot())}`)
        }).catch((error) => {
          const detail = error instanceof Error ? error.message : String(error)
          diagnosticsLog.write(
            'ERROR',
            `settings.update failed for namespace "${hostSettings.namespace ?? 'dsh-dafeiyu'}": ${detail}; host namespaces: ${hostNamespaceList() || '(none)'}; kept native menu values: ${JSON.stringify(overrides.snapshot())}`,
          )
          logger.warn?.(`dsh-dafeiyu failed to persist helper settings: ${detail}`)
        }).finally(() => {
          // The Helper already applied the menu choice locally. Re-sending the
          // effective CONFIG keeps that choice in the replay snapshot if the
          // process restarts, and updates the environment for a later spawn.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 状态成功、余额和Helper恢复各有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Reducer按宿主turn/end原因分类，不独立检查代码、文件或业务结果；completed表示宿主正常结束，不能当任务验收。HelperProcess停止先发送SHUTDOWN并结束stdin，超时才kill；启动失败累计默认五次后抑制重启，直到下次DSH启动，因此“伴随宿主”不保证始终有可见角色。余额读取使用宿主凭据与provider.baseURL，拼/user/balance并拒绝重定向，只接受HTTPS或loopback HTTP；这减少错误外发，但余额来源与当前任务计费是否对应仍需用户核对，不能把余额展示当预算封顶。Web/desktop profile各自加载可能各启一个Helper，用户要选实际客户端配置范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/companion-reducer.js:381-418](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/companion-reducer.js#L381-L418)

结束状态按宿主reason投影。

<details>
<summary>查看原文（38行）</summary>

```text
  #turnEnd(record, event) {
    record.turnActive = false
    record.openTools.clear()
    record.waitingCallId = undefined
    record.waitingApprovalId = undefined
    const kind = String(event.data?.reason?.kind ?? 'completed')

    if (kind === 'blocked') {
      this.#update(record, CompanionState.WAITING, {
        phase: 'turn-end',
        stage: '等待确认',
        message: statusCopy('waiting', event.seq),
      })
      return this.#render()
    }

    if (kind === 'aborted') {
      this.#update(record, CompanionState.IDLE, {
        phase: 'turn-end',
        stage: '已停止',
        message: statusCopy('stopped', event.seq),
      })
      return this.#render()
    }

    if (kind !== 'completed') {
      this.#update(record, CompanionState.ERROR, {
        phase: 'turn-end',
        stage: '需要处理',
        reasonKind: kind,
        message: kind === 'max-tokens'
          ? statusCopy('limit', event.seq)
          : statusCopy('error', event.seq),
      })
      return this.#render()
    }

    this.#update(record, CompanionState.IDLE, {
```

</details>

**依据 2 · 源码核查**：[src/helper-process.js:599-618](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/helper-process.js#L599-L618)

停止协议与超时kill。

<details>
<summary>查看原文（20行）</summary>

```text
  stop(reason = 'plugin-disposed') {
    this.#log('INFO', `stop requested (${reason})`)
    this.stopping = true
    this.#clearHeartbeat()
    if (this.restartTimer) clearTimeout(this.restartTimer)
    this.restartTimer = undefined
    const child = this.child
    if (!child) return
    this.#enqueue(
      CompanionMessageKind.SHUTDOWN,
      encodeMessage(createMessage(CompanionMessageKind.SHUTDOWN, { reason })),
    )
    if (this.spawned) {
      this.#flushQueue()
      this.#endInput(child)
    }
    const timer = setTimeout(() => {
      if (this.child === child) child.kill()
    }, this.options.shutdownTimeoutMs ?? 10000)
    timer.unref?.()
```

</details>

**依据 3 · 源码核查**：[src/helper-process.js:767-789](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/helper-process.js#L767-L789)

五次失败后抑制重启。

<details>
<summary>查看原文（23行）</summary>

```text
  #countStartFailure(reason) {
    this.startFailures += 1
    const maxFailures = this.options.maxStartFailures ?? 5
    this.#log('ERROR', `start failure ${this.startFailures}/${maxFailures}: ${reason}`)
    if (this.startFailures >= maxFailures) {
      this.restartSuppressed = true
      const diagnostics = this.log?.path ? `; diagnostics: ${this.log.path}` : ''
      this.logger.error?.(`dsh-dafeiyu helper failed to start ${this.startFailures} times; giving up (${reason})${diagnostics}`)
      this.#log('ERROR', `giving up after ${this.startFailures} failed starts; the companion stays disabled until the next DSH start`)
      return
    }
    this.logger.warn?.(`dsh-dafeiyu helper failed to start; scheduling restart (${this.startFailures}/${maxFailures}) (${reason})`)
    this.#scheduleRestart()
  }

  #scheduleRestart() {
    if (this.restartTimer || this.stopping || this.restartSuppressed) return
    const delay = this.options.restartDelayMs ?? 750
    this.restartTimer = setTimeout(() => {
      this.restartTimer = undefined
      this.start()
    }, delay)
    this.restartTimer.unref?.()
```

</details>

**依据 4 · 源码核查**：[src/balance.js:104-135](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/balance.js#L104-L135)

凭据、provider URL及余额请求边界。

<details>
<summary>查看原文（32行）</summary>

```text
export function createBalanceQuery(ctx, { fetchImpl = fetch, environment = process.env, version = 'unknown' } = {}) {
  return async (source = 'auto', signal) => {
    const forms = ctx.settings?.describe?.() ?? []
    const namespace = balanceProviderNamespace(ctx)
    const provider = forms.find((row) => namespace ? row.ns === namespace
      : ['llm-deepseek', 'llm-deepseek-api-key'].includes(row.ns))?.value ?? {}
    const launch = serviceOf(ctx, 'launchEnvironment')
    const envValue = (name) => launch ? launch.get(name)?.value : environment[name]
    const ref = provider.apiKeyEnv ?? 'DEEPSEEK_API_KEY'
    const credentials = serviceOf(ctx, 'credentials')
    const credential = source === 'account' ? undefined : credentials
      ? await credentials.resolve(ref)
      : { value: envValue(ref) }
    if (typeof credential?.value === 'string' && credential.value.trim()) {
      const url = new URL(provider.baseURL ?? envValue('DEEPSEEK_BASE_URL') ?? 'https://api.deepseek.com')
      if (url.username || url.password || (url.protocol !== 'https:'
        && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) {
        throw balanceError('UNAVAILABLE')
      }
      url.pathname = url.pathname.replace(/\/(?:v1|anthropic)\/?$/, '').replace(/\/$/, '') + '/user/balance'
      url.search = ''
      url.hash = ''
      const response = await fetchImpl(url, {
        headers: { Authorization: `Bearer ${credential.value}` },
        signal, redirect: 'error',
      })
      if (!response.ok) throw balanceError([401, 403].includes(response.status) ? 'AUTH' : 'UNAVAILABLE')
      const text = await responseText(response)
      if (text.length > 32768) throw balanceError('INVALID_RESPONSE')
      let body
      try { body = JSON.parse(text) } catch { throw balanceError('INVALID_RESPONSE') }
      return { ...parseApiBalance(body), source: 'api-key' }
```

</details>

**依据 5 · 作者声明**：[README.md:35-43](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/README.md#L35-L43)

Web和desktop独立profile及重复角色。

```text
| --- | --- | --- | --- |
| 浏览器 WebUI | `web` profile | 左侧插件 → dsh-dafeiyu | WebUI，默认 `http://127.0.0.1:3080/` |
| 官方桌面端 | `desktop` profile | 左侧插件 → dsh-dafeiyu | 通过 `dsh://open` 唤起桌面应用 |

**WebUI 中安装的插件不会自动出现在桌面端。** 两边都启用会各自启动原生角色，可以在其中一个 profile 关闭“大肥鱼”。第三方桌面包装器可能仍使用 `web` profile，请以它的实际启动方式为准。

客户端包中的 `platform: web` 也适用于官方桌面端：官方 Electron 应用使用同一套 Web 客户端。原生角色由对应 Host 启动。

## 安装
```

#### 缺口

- 当前系统的原生窗口、跨屏拖动和Helper重启未实测
  **影响**：无法把发布说明作为当前宿主体验保证
  **进一步探讨**：在目标OS做冷启动、五次失败、禁用和跨屏交互验收，同时核对余额来源。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何判断常驻角色值得保留，并形成有效改进实验？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

启动需匹配Node/DSH的sessions/settings服务和对应平台Helper，客户端设置入口与原生窗口要在同一profile。余额功能额外依赖DeepSeek凭据或账户服务，可单独关闭；角色不是任务执行工具，无需把它当自动处理能力。首次成本是安装、客户端范围和原生窗口权限/运行环境，持续资源是常驻进程、动画和可选余额请求，人工成本是辨认多会话、排错和设置冲突，金额、内存与耗时未测。建议先关闭声音、启用减少动态，以一类长任务试用，对比宿主通知；发现错误等待提示、反复重启或干扰主工作时禁用并回宿主状态页。未验证假设是只在真实等待/错误时突出显示、其余阶段安静，可比常驻气泡降低干扰而保持发现速度。用同任务交叉对照常驻与条件显示，记录等待发现延迟、误提示、切窗和干扰；若漏掉需要处理事件或没有减扰则推翻。现有bubbleStates是配置基础，不证明最优策略已得到验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:54-65](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/package.json#L54-L65)

Node版本和依赖。

<details>
<summary>查看原文（12行）</summary>

```text
    "@deepseek-ai/cosmokit": "1.8.5",
    "@deepseek-ai/schemastery": "3.18.4",
    "@standard-schema/spec": "1.1.0"
  },
  "bundleDependencies": [
    "@deepseek-ai/cosmokit",
    "@deepseek-ai/schemastery",
    "@standard-schema/spec"
  ],
  "scripts": {
    "test": "node --test --test-timeout=10000 test/*.test.js",
    "test:helper": "node --test test/helper-lifecycle.test.js",
```

</details>

**依据 2 · 源码核查**：[src/plugin.js:37-58](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/plugin.js#L37-L58)

减少动态、声音、气泡和余额可配置。

<details>
<summary>查看原文（22行）</summary>

```text
export const Config = Schema.object({
  enabled: Schema.boolean().default(true).description('启用桌面大肥鱼'),
  scale: Schema.number().min(0.55).max(1.4).step(0.05).default(1).role('slider').description('角色大小'),
  bubbleScale: Schema.number().min(0.8).max(1.2).step(0.05).default(1).role('slider').description('气泡大小'),
  activityLevel: Schema.union([
    Schema.const('quiet').description('安静'),
    Schema.const('normal').description('标准'),
    Schema.const('lively').description('活泼'),
  ]).default('normal').description('空闲微动作频率'),
  reducedMotion: Schema.boolean().default(false).description('减少走动、循环帧和程序化晃动'),
  soundEnabled: Schema.boolean().default(true).description('任务完成或出错时播放提示音'),
  bubbleMode: Schema.union([
    Schema.const('always').description('常驻显示'),
    Schema.const('hidden').description('完全隐藏'),
    Schema.const('custom').description('自定义显示状态'),
  ]).default('always').description('气泡显示模式'),
  bubbleStates: Schema.array(Schema.string()).default(['SUCCESS', 'ERROR', 'WAITING']).description('自定义模式下显示气泡的状态'),
  includeSubagents: Schema.boolean().default(false).description('允许子 Agent 抢占宠物状态'),
  webOverlay: Schema.boolean().default(false).description('在 DSH 页面右下角显示轻量桌宠（可与桌面窗口同时开启）'),
  clientTarget: Schema.union(['auto', 'web', 'desktop']).default('auto').description('打开 DSH 的目标客户端（自动识别 WebUI／桌面端）'),
  balanceEnabled: Schema.boolean().default(true).description('在状态气泡和设置页显示 DeepSeek 余额'),
  balanceSource: Schema.union(['auto', 'api-key', 'account']).default('auto').description('余额来源：自动优先 API Key，也可选择已登录账户'),
```

</details>

**依据 3 · 源码核查**：[src/plugin.js:492-503](https://github.com/QCYTSN/dsh-dafeiyu/blob/4458ec29466ec0817b7d8bde47b85faf5d79c8d7/src/plugin.js#L492-L503)

禁用路径触发停止，其他配置实时变化。

<details>
<summary>查看原文（12行）</summary>

```text
  const unwatch = settings.watch((next) => {
    // Disabling is the only path that tears the helper down.  Every other
    // setting is applied live through a CONFIG message, so sliders never
    // restart the pet.  Starting a previously-disabled runtime is debounced
    // to avoid spawning repeatedly while settings settle.
    try {
      balance.configure(next.enabled !== false && next.balanceEnabled, next.balanceSource)
      if (next.enabled === false) {
        if (restartTimer) {
          clearTimeout(restartTimer)
          restartTimer = undefined
        }
```

</details>

#### 缺口

- 没有真实用户与资源/干扰测量
  **影响**：采用只能短期个人试用，不能推断团队效率
  **进一步探讨**：先记录通知需求和低干扰设置，再做上述交叉任务对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
