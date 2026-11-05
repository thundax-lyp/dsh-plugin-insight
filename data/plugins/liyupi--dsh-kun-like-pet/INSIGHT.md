# Kun Like 桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[87bb6e1](https://github.com/liyupi/dsh-kun-like-pet/tree/87bb6e1762618dd7727d285ffeeadd86a3799425)

<!-- BEGIN META -->
[![GitHub ★ 113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liyupi/dsh-kun-like-pet) [![npm 30d 196](https://img.shields.io/static/v1?label=npm+30d&message=196&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-kun-like-pet) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-kun-like-pet)
<!-- END META -->

> **功能**：以桌宠动作与宿主音效提示 Agent 活动

> **亮点**：[Q01](#research-q01) 把状态变化转为声画提示。

> **主要限制**：[Q03](#research-q03) 轮询转空闲只是信号，存在并行误报窗口。

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
  - [Q01 · 用户场景是什么？](#detail-section-11)
  - [Q02 · 状态和音效怎样产生？](#detail-section-12)
  - [Q03 · 何时可能误报？](#detail-section-13)
  - [Q04 · 采用和退出要做什么？](#detail-section-14)
  - [Q05 · 怎样判断提醒有用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在其他窗口工作时希望感知 DSH 进度。

频繁回到 DSH 检查任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 频繁回到 DSH 检查任务。 | 可直接比较 | 保留人工步骤 |
| Kun Like 桌宠 | 把状态变化转为声画提示。 | 轮询转空闲只是信号，存在并行误报窗口。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 宿主轮询和事件驱动宠物动画，并可通过播放器命令发声。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在其他窗口工作时希望感知 DSH 进度。 | 保留原流程 |
| 试验 | 宿主轮询和事件驱动宠物动画，并可通过播放器命令发声。 | 观察固定版本 |
| 复核 | 隔离 profile 验证并行、失败与卸载。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在不盯着会话时感知等待或结束 | 声画提示可缩短发现等待或结束的时间。 | 隔离 profile 验证并行、失败与卸载。 |

> **思考**：[Q03](#research-q03) 轮询转空闲只是信号，存在并行误报窗口。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把状态变化转为声画提示。

用审批事件和宿主状态推进状态机。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 轮询转空闲只是信号，存在并行误报窗口。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 验证并行、失败与卸载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在不盯着会话时感知等待或结束。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在不盯着会话时感知等待或结束。未执行目标代码或实际宿主验证。
- 下一步：记录各状态预期和实际声画时间。

**分析版本**

- **仓库**：[liyupi/dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet)
- **版本号**：1.0.0（[固定提交 87bb6e1](https://github.com/liyupi/dsh-kun-like-pet/tree/87bb6e1762618dd7727d285ffeeadd86a3799425)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 声画提示可缩短发现等待或结束的时间。

记录各状态预期和实际声画时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 220 | — | — | 2415 |
| .mjs | source | 2 | 88 | 70 | 10 | — |
| .js | source | 2 | 718 | 627 | 48 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/liyupi/dsh-kun-like-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/liyupi/dsh-kun-like-pet/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/liyupi/dsh-kun-like-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在不盯着会话时感知等待或结束

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户场景是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户切走 Web 窗口后希望看到或听到 Agent 活动。插件用宠物动作和宿主音效提供提示。与频繁切回窗口相比，验收须明确提醒来自任何观察中的 Agent，并检测有无误报。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-27](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/README.md#L10-L27)

作者描述模式和全局音效

<details>
<summary>查看原文（18行）</summary>

```text
## ✨ 特性

- **9 种状态动画**：完全沿用 Codex 桌宠精灵图契约（8 列 × 9 行、每格 192×208），素材零重绘
- **实时感知 Agent 状态**：轮询 `agents` 服务感知每个 Agent 的 running/idle 状态，配合 `tools/execute`、`approval/request`、`agent/request-error` 事件推导工作 / 思考 / 等待 / 出错 / 空闲五种模式
- **任务完成全机可闻**：宿主进程用系统命令播放「你干嘛~哎哟」，任何窗口、任何会话完成任务都会响，与浏览器静音无关
- **可互动**：拖动桌宠到处跑（跑步动画方向跟随），点击它会挥手打招呼
- **内置调试工具**：`kun_pet_debug` 可随时查看状态机内部计数与轮询健康度

## 🎮 状态 → 动作映射

| Agent 工作状态 | 桌宠动作 | 气泡文案 |
| --- | --- | --- |
| 工作中（有工具在执行） | 专注干活（第 7 行） | 努力工作中… |
| 回合中但空闲 | 思考循环（第 8 行） | 思考中… |
| 等待用户回复 / 审批 | 期待等待（第 6 行） | 在等你回复哦~ |
| 出错 | 难过低落（第 5 行） | 呜…出错了 (._.) |
| 空闲 | 呼吸待机（第 0 行） | 休息中~ 有事叫我 |
| **任务完成** | 挥手 + 跳跃庆祝（第 3/4 行交替）＋ 系统音「你干嘛~哎哟」 | 完成啦！你干嘛~哎哟 |
```

</details>

**依据 2 · 源码核查**：[src/host.js:238-274](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L238-L274)

轮询多个 Agent 的状态

<details>
<summary>查看原文（37行）</summary>

```text
    // ---------- polling: live agent statuses ----------
    const agentsService = ctx.get('agents')
    const poll = () => {
      pollCount++
      if (agentsService === undefined) return
      let list
      try {
        list = agentsService.list()
      } catch (err) {
        return
      }
      if (!Array.isArray(list)) return
      const runningNow = new Set()
      const statuses = []
      for (const agent of list) {
        let status = 'idle'
        try {
          status = agent && agent.status === 'running' ? 'running' : 'idle'
        } catch (err) {
          status = 'idle'
        }
        statuses.push(status)
        if (status === 'running') runningNow.add(agent)
        const prev = lastStatus.get(agent)
        lastStatus.set(agent, status)
        if (agent && prev === undefined) observedAgents.add(agent)
        if (prev === 'running' && status === 'idle') {
          transitionsSeen++
          if (runningNow.size === 0 && waitingCount === 0) {
            const f = turnFlags.get(agent)
            if (f === undefined || !f.errored) celebrate()
            if (f !== undefined) {
              turnFlags.delete(agent)
              flagEntries--
            }
          }
        }
```

</details>

#### 缺口

- 是否降低错过审批仍未知。
  **影响**：视觉反馈不必占用会话内容。
  **进一步探讨**：用审批、出错和成功任务分别试验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态和音效怎样产生？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主轮询 agents，审批事件更新等待计数，运行转空闲后可触发庆祝。播放由 shell 服务执行配置命令，庆祝重复时延长动画而不重复发声。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:166-201](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L166-L201)

宿主播放与重复庆祝处理

<details>
<summary>查看原文（36行）</summary>

```text
      if (shell === undefined) {
        lastPlayError = 'shell service unavailable'
        return
      }
      try {
        const spec = shell.resolve({ command: CONFIG.playCommand(CONFIG.voicePath) })
        shell.run(spec).catch((err) => {
          lastPlayError = String(err && err.message ? err.message : err)
        })
        lastPlayError = null
      } catch (err) {
        lastPlayError = String(err && err.message ? err.message : err)
        console.error('[kun-pet] failed to start voice playback:', err)
      }
    }

    const celebrate = () => {
      if (celebrating) {
        // Extend the ongoing celebration; never double-fire the sound.
        if (celebrateTimer) celebrateTimer()
        celebrateTimer = ctx.timeout(() => {
          celebrateTimer = null
          celebrating = false
          deriveMode(currentRunningCount())
        }, CONFIG.celebrateMs)
        return
      }
      celebrateCount++
      celebrating = true
      setMode('celebrating')
      playSystemVoice()
      celebrateTimer = ctx.timeout(() => {
        celebrateTimer = null
        celebrating = false
        deriveMode(currentRunningCount())
      }, CONFIG.celebrateMs)
```

</details>

**依据 2 · 源码核查**：[src/host.js:238-274](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L238-L274)

状态转换触发

<details>
<summary>查看原文（37行）</summary>

```text
    // ---------- polling: live agent statuses ----------
    const agentsService = ctx.get('agents')
    const poll = () => {
      pollCount++
      if (agentsService === undefined) return
      let list
      try {
        list = agentsService.list()
      } catch (err) {
        return
      }
      if (!Array.isArray(list)) return
      const runningNow = new Set()
      const statuses = []
      for (const agent of list) {
        let status = 'idle'
        try {
          status = agent && agent.status === 'running' ? 'running' : 'idle'
        } catch (err) {
          status = 'idle'
        }
        statuses.push(status)
        if (status === 'running') runningNow.add(agent)
        const prev = lastStatus.get(agent)
        lastStatus.set(agent, status)
        if (agent && prev === undefined) observedAgents.add(agent)
        if (prev === 'running' && status === 'idle') {
          transitionsSeen++
          if (runningNow.size === 0 && waitingCount === 0) {
            const f = turnFlags.get(agent)
            if (f === undefined || !f.errored) celebrate()
            if (f !== undefined) {
              turnFlags.delete(agent)
              flagEntries--
            }
          }
        }
```

</details>

**依据 3 · 源码核查**：[src/host.js:283-297](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L283-L297)

审批计数恢复

<details>
<summary>查看原文（15行）</summary>

```text
    ctx.on('approval/request', (req, next) => {
      rawApproval++
      waitingCount++
      deriveMode(currentRunningCount())
      let p
      try {
        p = Promise.resolve(next())
      } catch (err) {
        waitingCount = Math.max(0, waitingCount - 1)
        deriveMode(currentRunningCount())
        throw err
      }
      p.then(
        () => { waitingCount = Math.max(0, waitingCount - 1); deriveMode(currentRunningCount()) },
        () => { waitingCount = Math.max(0, waitingCount - 1); deriveMode(currentRunningCount()) },
```

</details>

#### 缺口

- 本机播放器或音频资源缺失会影响提示。
  **影响**：并行任务和错误时仍需查看原会话。
  **进一步探讨**：测试禁用 shell 和移除音频。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时可能误报？

**研究主题**：缺陷与关键质疑

#### 完整回答

运行转空闲是观测信号，和用户任务成功应分开。循环在扫描当前 Agent 时即时使用尚在累加的 runningNow，若后一项仍运行，前一项可先触发庆祝。短任务跨越轮询也可能漏报。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:240-274](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L240-L274)

运行集合边遍历边累加且同轮可庆祝

<details>
<summary>查看原文（35行）</summary>

```text
    const poll = () => {
      pollCount++
      if (agentsService === undefined) return
      let list
      try {
        list = agentsService.list()
      } catch (err) {
        return
      }
      if (!Array.isArray(list)) return
      const runningNow = new Set()
      const statuses = []
      for (const agent of list) {
        let status = 'idle'
        try {
          status = agent && agent.status === 'running' ? 'running' : 'idle'
        } catch (err) {
          status = 'idle'
        }
        statuses.push(status)
        if (status === 'running') runningNow.add(agent)
        const prev = lastStatus.get(agent)
        lastStatus.set(agent, status)
        if (agent && prev === undefined) observedAgents.add(agent)
        if (prev === 'running' && status === 'idle') {
          transitionsSeen++
          if (runningNow.size === 0 && waitingCount === 0) {
            const f = turnFlags.get(agent)
            if (f === undefined || !f.errored) celebrate()
            if (f !== undefined) {
              turnFlags.delete(agent)
              flagEntries--
            }
          }
        }
```

</details>

#### 缺口

- 实际宿主排序和任务时长未知。
  **影响**：全局音效无法识别特定任务。
  **进一步探讨**：交换并行 Agent 的枚举顺序，复查提醒。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出要做什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者要求配素材路径、播放器和动态插件载荷。先核对系统命令及共享环境音量。退出停用动态插件并检查计时器、资产路由和声音，保留素材独立管理。首次成本来自路径和 OS 配置，持续成本来自轮询及宿主兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-71](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/README.md#L31-L71)

作者给出路径和动态插件流程

<details>
<summary>查看原文（41行）</summary>

````text
## 🚀 安装

### 方式一：DSH 动态插件（推荐，已实测）

桌宠以 **DSH 动态插件** 形式开发并运行验证（`cordis_define`）。在 DSH 会话里让 Agent 执行，或手动调用 `cordis_define` 工具：

1. 克隆本仓库：

   ```bash
   git clone https://github.com/liyupi/dsh-kun-like-pet.git
   ```

2. 修改 `src/host.js` 顶部 `CONFIG` 中的素材路径：

   ```js
   const CONFIG = {
     spritePath: '/你的/路径/dsh-kun-like-pet/assets/spritesheet.webp',
     voicePath:  '/你的/路径/dsh-kun-like-pet/assets/voice.mp3',
     // macOS 默认用 afplay；Windows / Linux 请改成对应播放命令
     playCommand: (path) => "afplay '" + path.replace(/'/g, "'\\''") + "'",
   }
   ```

3. 生成一键安装载荷并粘贴给 `cordis_define` 工具：

   ```bash
   node scripts/build-kunpet-package.mjs -   # 输出 JSON 载荷
   ```

   载荷结构（`kind: "new"` 创建新插件；后续更新用 `kind: "existing"` + `pluginId`）：

   ```json
   {
     "plugin": { "kind": "new", "idPrefix": "kunpet" },
     "name": "Kun Like 桌宠",
     "purpose": "在 Web 界面右下角显示 Kun Like 桌宠，随 Agent 工作状态切换动作，任务完成时播放「你干嘛~哎哟」语音。",
     "code": { "host": "<src/host.js 内容>", "client": "<src/client.js 内容>" }
   }
   ```

4. 用 `cordis_run` 激活，Web 界面右下角即出现桌宠。
````

</details>

**依据 2 · 源码核查**：[src/host.js:230-236](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L230-L236)

卸载清理路由和计时器

```text
    ctx.effect(() => () => {
      disposed = true
      for (const d of routeDisposers) d()
      if (celebrateTimer) celebrateTimer()
      if (failTimer) failTimer()
      if (recentToolTimer) recentToolTimer()
    })
```

#### 缺口

- 播放子进程退出与系统音量未验证。
  **影响**：远端宿主音效不一定能在本机听见。
  **进一步探讨**：隔离 profile 分别验收声音与视觉。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断提醒有用？

**研究主题**：新假设与验证

#### 完整回答

同样运行成功、失败、取消、审批与并行会话，比较官方 UI 提示和桌宠命中、时延、误报。若多任务中提前庆祝、审批没提示、或停用仍出声，不能依赖该配置作为完成提示。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:182-201](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L182-L201)

重叠庆祝计时

<details>
<summary>查看原文（20行）</summary>

```text
    const celebrate = () => {
      if (celebrating) {
        // Extend the ongoing celebration; never double-fire the sound.
        if (celebrateTimer) celebrateTimer()
        celebrateTimer = ctx.timeout(() => {
          celebrateTimer = null
          celebrating = false
          deriveMode(currentRunningCount())
        }, CONFIG.celebrateMs)
        return
      }
      celebrateCount++
      celebrating = true
      setMode('celebrating')
      playSystemVoice()
      celebrateTimer = ctx.timeout(() => {
        celebrateTimer = null
        celebrating = false
        deriveMode(currentRunningCount())
      }, CONFIG.celebrateMs)
```

</details>

**依据 2 · 源码核查**：[src/host.js:238-277](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L238-L277)

状态观察和转换

<details>
<summary>查看原文（40行）</summary>

```text
    // ---------- polling: live agent statuses ----------
    const agentsService = ctx.get('agents')
    const poll = () => {
      pollCount++
      if (agentsService === undefined) return
      let list
      try {
        list = agentsService.list()
      } catch (err) {
        return
      }
      if (!Array.isArray(list)) return
      const runningNow = new Set()
      const statuses = []
      for (const agent of list) {
        let status = 'idle'
        try {
          status = agent && agent.status === 'running' ? 'running' : 'idle'
        } catch (err) {
          status = 'idle'
        }
        statuses.push(status)
        if (status === 'running') runningNow.add(agent)
        const prev = lastStatus.get(agent)
        lastStatus.set(agent, status)
        if (agent && prev === undefined) observedAgents.add(agent)
        if (prev === 'running' && status === 'idle') {
          transitionsSeen++
          if (runningNow.size === 0 && waitingCount === 0) {
            const f = turnFlags.get(agent)
            if (f === undefined || !f.errored) celebrate()
            if (f !== undefined) {
              turnFlags.delete(agent)
              flagEntries--
            }
          }
        }
      }
      lastAgentStatuses = statuses
      deriveMode(runningNow.size)
```

</details>

**依据 3 · 源码核查**：[src/host.js:230-236](https://github.com/liyupi/dsh-kun-like-pet/blob/87bb6e1762618dd7727d285ffeeadd86a3799425/src/host.js#L230-L236)

清理路径可验收

```text
    ctx.effect(() => () => {
      disposed = true
      for (const d of routeDisposers) d()
      if (celebrateTimer) celebrateTimer()
      if (failTimer) failTimer()
      if (recentToolTimer) recentToolTimer()
    })
```

#### 缺口

- 没有本次运行结果。
  **影响**：可将趣味互动与可靠提醒分别评价。
  **进一步探讨**：记录各状态预期和实际声画时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
