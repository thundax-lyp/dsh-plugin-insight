# DSH 大肥鱼桌面伴侣

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0843238](https://github.com/QCYTSN/dsh-dafeiyu/tree/084323845ab82b68d5388d5c638bec09d8544a8a)

<!-- BEGIN META -->
[![GitHub ★ 567](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=567&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QCYTSN/dsh-dafeiyu) [![npm 30d 78,659](https://img.shields.io/static/v1?label=npm+30d&message=78%2C659&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dafeiyu) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dafeiyu)
<!-- END META -->

> **功能**：以常驻角色展示 DSH 会话阶段、等待与错误。

> **亮点**：把会话阶段带到桌面并提供互动；不承担任务执行或结果验收。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：事件状态不证明任务正确；余额可能是标注的上次值，Helper 重启有失败上限。[Q03](#research-q03)

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
  - [Q01 · 桌面伴侣为离开 DSH 窗口的用户提供什么？](#detail-section-11)
  - [Q02 · 会话事件如何进入桌面，进度有什么依据？](#detail-section-12)
  - [Q03 · 余额和 Helper 恢复能保证什么？](#detail-section-13)
  - [Q04 · 安装和常驻值得付出什么成本？](#detail-section-14)
  - [Q05 · 怎样验证常驻状态是否比通知更有价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：运行 Agent 时离开 DSH 窗口工作的用户；替代为状态页和系统通知。[Q01](#research-q01)

查看 DSH 状态页或系统通知，不常驻桌面角色。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面状态 | 显示会话阶段 | 不证明任务成功 |
| 待办进度 | 根据真实 todo 统计 | 上游无进度只显示阶段 |
| 余额 | 显示配置来源 | 错误可能显示上次值 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH profile | 必需 | 会话事件 | 无状态 |
| 兼容原生 Helper | 桌面显示必需 | 角色窗口 | 无桌面显示 |
| 上游 todo | 真实进度需要 | 计算进度 | 仅显示阶段 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 安装 | 选实际 DSH profile | 检查 Helper |
| 验证 | 非敏感任务观察事件 | 对照宿主状态 |
| 调整 | 配置声音和大小 | 干扰过高时关闭 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装 Helper 资源 | profile 与平台配置 | 实际兼容未测 |
| 持续 | 常驻进程和屏幕 | 处理通知干扰 | 效率未对照 |
| 恢复 | 有限自动重启 | 排查日志与状态 | 不能保证事件未丢 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 状态提示 | 会话事件经 reducer 发 Helper | 及时与准确 |
| 进度 | 上游 todo 统计 | 任务质量与验收 |

> **思考**：事件状态不证明任务正确；余额可能是标注的上次值，Helper 重启有失败上限。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把会话阶段带到桌面并提供互动；不承担任务执行或结果验收。[Q01](#research-q01) [Q02](#research-q02)

全局会话监听隔离异常；Helper 重启有限制，余额错误显示上次值标记。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

事件状态不证明任务正确；余额可能是标注的上次值，Helper 重启有失败上限。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用非敏感任务对照宿主状态和系统通知；误提示或干扰过高时关闭。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 session 事件投影、todo 计数和有限重启；未运行宿主、Helper 或余额。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/plugin.js、src/companion-reducer.js、src/balance.js、src/helper-process.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 60 个指定扩展名文件、无排除及解析错误；静态检查事件、进度、余额与 Helper，未运行桌面。
- 下一步：固定 DSH 和系统，验证事件变化、余额错误、进程退出与视觉干扰。

**分析版本**

- **仓库**：[QCYTSN/dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu)
- **版本号**：0.1.23（[固定提交 0843238](https://github.com/QCYTSN/dsh-dafeiyu/tree/084323845ab82b68d5388d5c638bec09d8544a8a)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示事件时间及过期状态可减少停滞误判，须对照通知测察觉、误报和干扰。[Q05](#research-q05)

固定 DSH 和系统，验证事件变化、余额错误、进程退出与视觉干扰。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2127 | — | — | 23337 |
| .js | source | 13 | 3363 | 2960 | 228 | — |
| .mjs | source | 6 | 341 | 317 | 6 | — |
| .js | test | 20 | 2897 | 2568 | 67 | — |
| .js | example | 7 | 78 | 65 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/QCYTSN/dsh-dafeiyu/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 桌面伴侣如何投影会话状态，余额、恢复及常驻价值边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面伴侣为离开 DSH 窗口的用户提供什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

面向运行 Agent 时切到其他应用的用户，插件用常驻原生角色展示阶段、等待和错误。相比 DSH 状态页或系统通知，它提供持续可见的桌面提示和互动，不执行或验收用户任务。README 说明状态来自 DSH 会话事件，项目与待办进度仅在上游提供时显示；实际收益和干扰程度须用户实测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:13-15](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/README.md#L13-L15)

原生窗口与宿主生命周期的作者说明。

```text
大肥鱼由 DSH 插件启动，随 DSH 一起退出。透明、无边框、始终置顶的原生窗口，让你在编辑器、浏览器或其他应用中也能看到 Agent 的工作状态。

> **当前稳定版：0.1.23。** 修复 Linux arm64 / 无随架构 Helper 时 Python 回退未给出 PySide6 安装指引的问题；同时包含 0.1.22 的审批提示音与场景开关、0.1.21 的跨显示器拖动与菜单设置兜底、0.1.20 的透明区域点击穿透与 0.1.19 的 Helper 冷启动诊断。安装时填写 `dsh-dafeiyu@0.1.23`，离线安装请从[最新版下载页](https://github.com/QCYTSN/dsh-dafeiyu/releases/latest)选择 **`dsh-dafeiyu-0.1.23.tgz`**；Windows、Linux 与 macOS 共用这一个包。GitHub 自动生成的 **Source code (zip / tar.gz)** 是源码，不是安装包。
```

**依据 2 · 源码核查**：[README.md:21-30](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/README.md#L21-L30)

状态及进度来源的作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 3 · 源码核查**：[src/plugin.js:492-506](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/plugin.js#L492-L506)

全局 session 事件接入。

<details>
<summary>查看原文（15行）</summary>

```text
  // The companion intentionally observes every DSH session. Loader entries may
  // live inside a scoped composition, so use the unscoped root bus and dispose
  // the registrations explicitly with this plugin's lifecycle.
  // Never let an exception from this optional companion escape into the shared
  // session bus: a throw here could stop every other subscriber from seeing
  // the event, which would look exactly like "installing the pet broke other
  // plugins".
  const offEvent = eventCtx.on('session/event', (session, event) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.handle(session, event)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to handle session event', error)
    }
  }, { global: true })
```

</details>

#### 缺口

- 未运行 DSH、原生 Helper、桌面或余额请求
  **影响**：不能证明提示及时性、跨平台显示和恢复效果
  **进一步探讨**：固定宿主和系统，在非敏感任务中验证事件与退出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话事件如何进入桌面，进度有什么依据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件启动 bridge 并监听全局 session/event，将 reducer 生成的消息送给 Helper；事件处理异常记录并隔离，避免影响其他订阅者。reducer 从 todo 状态统计完成数和总数，信息不足时不应把显示阶段当真实百分比。UI 状态是事件投影，受上游事件、进程和时序影响，不是任务结果证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.js:470-485](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/plugin.js#L470-L485)

启动 bridge 和初始状态。

<details>
<summary>查看原文（16行）</summary>

```text
    }
    bridge.start()
    bridge.send(createMessage(CompanionMessageKind.HELLO, {
      state: CompanionState.IDLE,
      host: 'deepseek-harness',
      pluginVersion: pkg.version,
      message: 'BigFish connected to DSH',
    }))
    bridge.send(createMessage(CompanionMessageKind.STATE, {
      state: CompanionState.IDLE,
      phase: 'plugin-start',
      stage: '等待任务',
      message: '我在这儿等新任务哦',
      detail: 'DSH · 等待下一次任务',
    }))
    if (balance.get().status !== 'disabled') bridge.send(createMessage(CompanionMessageKind.BALANCE, balance.get()))
```

</details>

**依据 2 · 源码核查**：[src/plugin.js:492-506](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/plugin.js#L492-L506)

监听事件、映射并隔离异常。

<details>
<summary>查看原文（15行）</summary>

```text
  // The companion intentionally observes every DSH session. Loader entries may
  // live inside a scoped composition, so use the unscoped root bus and dispose
  // the registrations explicitly with this plugin's lifecycle.
  // Never let an exception from this optional companion escape into the shared
  // session bus: a throw here could stop every other subscriber from seeing
  // the event, which would look exactly like "installing the pet broke other
  // plugins".
  const offEvent = eventCtx.on('session/event', (session, event) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.handle(session, event)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to handle session event', error)
    }
  }, { global: true })
```

</details>

**依据 3 · 源码核查**：[src/companion-reducer.js:137-145](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/companion-reducer.js#L137-L145)

基于 todo 的进度统计。

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
```

**依据 4 · 源码核查**：[README.md:21-30](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/README.md#L21-L30)

作者说明无真实进度时显示阶段。

<details>
<summary>查看原文（10行）</summary>

```text
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

#### 缺口

- 未运行 DSH、原生 Helper、桌面或余额请求
  **影响**：不能证明提示及时性、跨平台显示和恢复效果
  **进一步探讨**：固定宿主和系统，在非敏感任务中验证事件与退出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 余额和 Helper 恢复能保证什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

余额显示区分 API 和账户来源；错误时可保留上次结果并标记，不能把它当实时额度或全平台账单。Helper 在异常退出后重启，但对反复启动失败有上限和抑制，心跳失联会终止进程；自动恢复不保证通知没有遗漏或任务完成。状态、余额及原生窗口均需实际宿主和系统验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/balance.js:157-163](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/balance.js#L157-L163)

余额错误时标记上次查询。

```text
  if (snapshot.status === 'disabled') return ''
  if (snapshot.status === 'loading') return '正在查询余额…'
  if (!snapshot.balances.length) return snapshot.status === 'not-configured' ? '余额未配置' : '余额暂不可用'
  const amounts = snapshot.balances.map((row) => new Intl.NumberFormat('zh-CN', {
    style: 'currency', currency: row.currency, minimumFractionDigits: 2, maximumFractionDigits: 4,
  }).format(row.total)).join(' · ')
  return `${snapshot.source === 'account' ? '账户' : 'API'} 余额 ${amounts}${snapshot.status === 'error' ? '（上次查询）' : ''}`
```

**依据 2 · 源码核查**：[src/helper-process.js:534-560](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/helper-process.js#L534-L560)

退出及短时失败处理。

<details>
<summary>查看原文（27行）</summary>

```text
    child.once('exit', (code, signal) => {
      if (this.child !== child) return
      this.#log('INFO', `helper exited code=${String(code)} signal=${String(signal)} ready=${String(this.spawned)} runtimeMs=${this.readyAt > 0 ? Date.now() - this.readyAt : 0}`)
      this.child = undefined
      const wasReady = this.spawned
      const readyAt = this.readyAt
      this.spawned = false
      this.readyAt = 0
      this.writeBlocked = false
      this.#clearHeartbeat()
      this.#clearStartupTimer()
      if (!this.stopping && !this.restartSuppressed) {
        if (!wasReady) {
          // The helper never became ready during this attempt (crashed before
          // READY or timed out). Count it as a failed start so a broken
          // helper cannot restart forever.
          this.#countStartFailure(`exited before ready (code=${String(code)}, signal=${String(signal)})`)
          return
        }
        const stableRuntimeMs = this.options.stableRuntimeMs ?? 30000
        const runtimeMs = readyAt > 0 ? Date.now() - readyAt : 0
        if (runtimeMs < stableRuntimeMs) {
          this.#countStartFailure(`exited ${runtimeMs}ms after ready (code=${String(code)}, signal=${String(signal)})`)
          return
        }
        this.startFailures = 0
        this.logger.warn?.(`dsh-dafeiyu helper exited (code=${String(code)}, signal=${String(signal)}); restarting`)
```

</details>

**依据 3 · 源码核查**：[src/helper-process.js:765-793](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/helper-process.js#L765-L793)

失败次数及重启调度。

<details>
<summary>查看原文（29行）</summary>

```text
  }

  #log(level, message) {
    this.log?.write(level, message)
  }

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

#### 缺口

- 未运行 DSH、原生 Helper、桌面或余额请求
  **影响**：不能证明提示及时性、跨平台显示和恢复效果
  **进一步探讨**：固定宿主和系统，在非敏感任务中验证事件与退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装和常驻值得付出什么成本？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要兼容 DSH profile 与本机原生 Helper；Web 和官方桌面 profile 分别安装，双开可能出现两个角色。常驻进程、屏幕空间、声音与通知可能产生干扰；余额查询依赖相应凭据。先在非敏感任务核验事件、完成/错误与退出，比较状态页和通知；占用过高、误提示或干扰大时关闭，未有真实效率和费用对照。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:23-30](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/README.md#L23-L30)

功能和事件来源。

```text
- 显示真实任务状态：思考、查找、修改、执行、验证、等待确认、完成和错误。
- 展示项目、步骤、多任务和 DSH 提供的待办进度；没有真实进度时显示阶段。
- 在状态气泡和设置页显示 DeepSeek 余额，区分 API Key 与已登录账户。
- 兼容 WebUI 与官方桌面端的共享客户端；两个客户端使用各自的插件配置。
- 支持拖动、摸头、戳身体、碰尾巴，以及大小、气泡、声音和减少动态设置。
- 可选在 DSH 页面右下角显示轻量角色，默认关闭。

状态来自 DSH 会话事件。大肥鱼不会读取屏幕；推理强度与进度只显示上游实际提供的信息。
```

**依据 2 · 源码核查**：[README.md:32-42](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/README.md#L32-L42)

Web 与桌面 profile 区分。

<details>
<summary>查看原文（11行）</summary>

```text
## 先选你的 DSH 客户端

| 使用方式 | 安装位置 | 设置入口（DSH 0.2） | 角色右键菜单的打开目标 |
| --- | --- | --- | --- |
| 浏览器 WebUI | `web` profile | 左侧插件 → dsh-dafeiyu | WebUI，默认 `http://127.0.0.1:3080/` |
| 官方桌面端 | `desktop` profile | 左侧插件 → dsh-dafeiyu | 通过 `dsh://open` 唤起桌面应用 |

**WebUI 中安装的插件不会自动出现在桌面端。** 两边都启用会各自启动原生角色，可以在其中一个 profile 关闭“大肥鱼”。第三方桌面包装器可能仍使用 `web` profile，请以它的实际启动方式为准。

客户端包中的 `platform: web` 也适用于官方桌面端：官方 Electron 应用使用同一套 Web 客户端。原生角色由对应 Host 启动。

```

</details>

**依据 3 · 源码核查**：[src/plugin.js:489-506](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/plugin.js#L489-L506)

配置和全局监听。

<details>
<summary>查看原文（18行）</summary>

```text
  startRuntime(settings.get())
  balance.configure(settings.get().enabled !== false && settings.get().balanceEnabled, settings.get().balanceSource)

  // The companion intentionally observes every DSH session. Loader entries may
  // live inside a scoped composition, so use the unscoped root bus and dispose
  // the registrations explicitly with this plugin's lifecycle.
  // Never let an exception from this optional companion escape into the shared
  // session bus: a throw here could stop every other subscriber from seeing
  // the event, which would look exactly like "installing the pet broke other
  // plugins".
  const offEvent = eventCtx.on('session/event', (session, event) => {
    if (!bridge || !reducer) return
    try {
      for (const message of reducer.handle(session, event)) bridge.send(message)
    } catch (error) {
      logger.error?.('dsh-dafeiyu failed to handle session event', error)
    }
  }, { global: true })
```

</details>

#### 缺口

- 未运行 DSH、原生 Helper、桌面或余额请求
  **影响**：不能证明提示及时性、跨平台显示和恢复效果
  **进一步探讨**：固定宿主和系统，在非敏感任务中验证事件与退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证常驻状态是否比通知更有价值？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：在状态变化旁提供事件时间与来源、对过期状态显示未知，可能减少用户把停滞误认为仍在运行；现有 todo 统计、错误提示和 Helper 心跳是反证，不应称之前没有状态。对照 DSH 窗口或系统通知，记录察觉延迟、误报、遮挡干扰、CPU/内存及用户中断；若收益不足或误导增多则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/companion-reducer.js:137-145](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/companion-reducer.js#L137-L145)

已有 todo 进度。

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
```

**依据 2 · 源码核查**：[src/helper-process.js:765-793](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/src/helper-process.js#L765-L793)

已有启动失败限制。

<details>
<summary>查看原文（29行）</summary>

```text
  }

  #log(level, message) {
    this.log?.write(level, message)
  }

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

**依据 3 · 源码核查**：[README.md:21-30](https://github.com/QCYTSN/dsh-dafeiyu/blob/084323845ab82b68d5388d5c638bec09d8544a8a/README.md#L21-L30)

已有多种状态提示。

<details>
<summary>查看原文（10行）</summary>

```text
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

#### 缺口

- 未运行 DSH、原生 Helper、桌面或余额请求
  **影响**：不能证明提示及时性、跨平台显示和恢复效果
  **进一步探讨**：固定宿主和系统，在非敏感任务中验证事件与退出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
