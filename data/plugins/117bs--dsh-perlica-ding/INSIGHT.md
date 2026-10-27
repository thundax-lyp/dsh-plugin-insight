# dsh-perlica-ding

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f9db75c](https://github.com/117BS/dsh-perlica-ding/tree/f9db75c3cff13919659e81311a2b3d62f9af8aab)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/117BS/dsh-perlica-ding) [![npm 30d 320](https://img.shields.io/static/v1?label=npm+30d&message=320&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-perlica-ding) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-perlica-ding)
<!-- END META -->

> **实现功能**：按DSH计划、执行回合收尾、待回应与错误事件播放四类本地音效，提供PCM音量缩放、设置保存和试听界面。

> **核心亮点**：把四档Agent事件、平台音频argv、PCM音量与可持久设置接在一起，减少切回窗口看状态。详见[Q02](#research-q02)。

> **风险与缺陷**：done仅事件启发式，缺起点0比较/失败结果与root降级可误响；试听无cwd、即回不等可听；大/畸形WAV与无界播放/缓存及桥认证边界需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 适合什么通知需求，声音能说明什么？](#detail-section-11)
  - [Q02 · 分类、播放和设置的链条是什么？](#detail-section-12)
  - [Q03 · 误响、漏响和试听有哪些条件？](#detail-section-13)
  - [Q04 · 音量、文件与Web桥有何安全/资源边界？](#detail-section-14)
  - [Q05 · 启动流程和成本效果是什么？](#detail-section-15)
  - [Q06 · 推荐和继续探讨入口是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在本机运行DSH、工作中切到别的窗口但希望听见计划/回合收尾/待回应/错误的用户。四个本地音效与音量设置是注意力提示，普通纯查询拟保持静音。角色主题是呈现偏好，不是技术或业务效果证据。

合格结果是正确主会话事件响合适声音、安静场景不扰民、音量与自定义源可预测。done只由执行类工具结果和turn-stopping判断，不证明任务目标完成或指标正常；plan只是仍在计划模式，也不证明有完整方案。基线是持续盯窗口或系统普通通知，增量是事件分档/可试听音量，不提升模型质量。

盯窗口或普通系统提醒；分档与本地设置省查看，注意力/时延收益未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 分档音效 | plan/done/ask/fail | 启发式非任务成功 |
| 自定义源 | config/cwd/包内/OS优先 | 陌生工作区可覆盖，预览无cwd |
| PCM音量 | 不改系统音量 | 非PCM回原声/0直接静音 |
| 设置/试听 | 保存与调音量 | played非完成/可听证据 |
| 平台播放 | argv经subprocess | 无显式总超时/并发预算 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH subprocess与对应Agent事件 | 分类/播放 | agents/planMode缺失会降级改变语义 |
| 系统音频和播放器 | Windows SoundPlayer/mac afplay/Linux paplay或aplay | host机器发声，远端浏览器不必能听到 |
| 可信小型PCM WAV | 音源与减音量 | 包内四文件，陌生工作区可覆盖 |
| Web/slots、settings或可写自有目录 | 设置/音量保存 | 无Web仍可提示，存储tier需核 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主服务/音频设备 | 默认音量100，先降音量或0 |
| 配资产 | 指可信soundDir/核工作区同名文件 | 先小PCM，别依非PCM降音量 |
| 设置 | 保存音量核persistent | 多profile共文件需分开 |
| 核通知 | 用合成事件核plan/done/ask/fail | done不是业务成功；试听音源未必同cwd |
| 维护 | 清缓存/核错误与遗留播放器 | 不把HTTP played当听见 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包含WAV/本地音频，不直接调模型/云TTS | 安装重启、核设备与调音量 | 包价格/工时未知，后制自定义TTS另计 |
| 持续使用 | 播放子进程/同步读缩放/临时缓存 | 通知打扰和资产维护 | 无新增LLM请求，CPU/缓存/噪声成本未量化 |
| 失败恢复 | 重播/清临时文件/音量备份恢复 | 查事件、播放器、源文件与设置tier | 无播放完成收据/显式kill，恢复时长未知 |



#### 效果

| 目标 | 源码支持 | 限制 |
| --- | --- | --- |
| 少盯窗口 | 主事件分档声音 | 远端/静音设备无可听保证 |
| 安静普通问答 | 执行白名单与防抖 | 缺claimed或root判断降级可误响 |
| 可控音量 | PCM缩放/0静音/保存 | 非PCM回原音量，试听cwd不同 |
| 多平台 | 固定播放器argv | 非各平台真实可用性验收 |

package未锁具体宿主版本/Node engine，只有宽peer，跨代settings feature detection降低一类耦合，不等全兼容。作者verify脚本为mock设计，本轮只读，不执行播放/设置或验证脚本。

> **思考**：done仅事件启发式，缺起点0比较/失败结果与root降级可误响；试听无cwd、即回不等可听；大/畸形WAV与无界播放/缓存及桥认证边界需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把四档Agent事件、平台音频argv、PCM音量与可持久设置接在一起，减少切回窗口看状态。详见[Q02](#research-q02)。

把四档Agent事件、平台音频argv、PCM音量与可持久设置接在一起，减少切回窗口看状态。详见[Q02](#research-q02)。

root判定依agents.roots；服务缺失或查询异常返回true，不能保证所有宿主始终只响主会话。tools/result不检查isError，执行类命令失败也可被计done；agent/error另播fail，随后stopping可能再播done，因为不同档分别防抖。若没有claimed起点且没有tool记录，两者默认0，0>=0也会done。这里只是静态事件序列条件，未声称真实宿主必缺这些事件。

planMode存在但get抛错时忽略，不像服务缺失时读取历史fallback；无服务时遍历全会话事件折叠计划状态，长会话有同步成本。工具白名单只能按名字推断执行性质，未知写工具可漏，job_output等读状态也计done；空execTools则全部工具包括查询均计，文档已明示旧行为。

试听play(kind,true)不传session cwd，真实通知传cwd，因此有工作区定制声音时试听可能选包内而实际选另一文件。“同链路”不等同音源。preview立即回played，即使音量0、找不到音源或播放器后续失败也未返回实际可听证据。spawnBeep只在spawn抛错或done拒绝时试fallback，若宿主以resolved非零退出表示失败则不会换；没有显式总超时、并发上限/卸载kill，graceMs不是业务最长播放预算。

音量0在play前直接返回，可靠避免启动播放器；其他减音量只支持PCM，非PCM或读取/缓存失败回原路径，可能原音量播。解析fmt chunk只检查声明chunkSize，未先核实际body剩余长度，畸形WAV可触发Buffer越界异常。工作区同名音源优先于包内，可信项目可自定义，但陌生仓库文件不应被当可信通知资产。

缓存键含内容hash能避免同大小换音源复用旧文件，但程序先read/Buffer复制/逐采样缩放，再检查dest存在；“同音量只计算一次”实际上只避免重复写盘，CPU仍重算。无文件大小/缓存容量/保留上限，同步处理大文件可阻塞事件回调。音量文件固定.tmp再rename没有独占临时名/CAS，多个profile共享默认~/.dsh目录可能竞争，非每profile隔离。

桥只校Origin.host与请求Host相同，不检协议/请求peer或独立身份，无Origin放行；注释loopback-only不是代码自证。实际远程暴露仍由宿主绑定/认证决定，不能直接断言公网无鉴权。预览绕防抖且无并发上限，可引发重复播放；POST限JSON、kind枚举与音量范围是有用输入约束，但readJsonBody截字符串而非终止超大/慢请求，且无插件超时。

<a id="detail-section-5"></a>

### 1.4 主要限制

done仅事件启发式，缺起点0比较/失败结果与root降级可误响；试听无cwd、即回不等可听；大/畸形WAV与无界播放/缓存及桥认证边界需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，可信本机小PCM/低音量先核事件和设备；声音不是任务验收，远端和严格隔离提醒先观察。详见[Q06](#research-q06)。

合格结果是正确主会话事件响合适声音、安静场景不扰民、音量与自定义源可预测。done只由执行类工具结果和turn-stopping判断，不证明任务目标完成或指标正常；plan只是仍在计划模式，也不证明有完整方案。基线是持续盯窗口或系统普通通知，增量是事件分档/可试听音量，不提升模型质量。

采用建议：有试用，可信本机小PCM/低音量先核事件和设备；声音不是任务验收，远端和严格隔离提醒先观察。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。四档/PCM/设置链明确，但分类启发式和播放受理/可听性必须分开，默认低音量并核可信音源。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.mjs、lib/client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整host关键事件/PCM/设置/播放链、client请求与注册和包；不播放音效/启动子进程/运行验证或改设置。
- 下一步：可继续mock缺起点/失败/子Agent/多root与异源试听、畸形WAV和播放器退出，核分类与阶段真实性及资源。

**分析版本**

- **仓库**：[117BS/dsh-perlica-ding](https://github.com/117BS/dsh-perlica-ding)
- **版本号**：0.2.1（[固定提交 f9db75c](https://github.com/117BS/dsh-perlica-ding/tree/f9db75c3cff13919659e81311a2b3d62f9af8aab)）
- **版本日期**：2026-10-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索agent-turn原因与音源一致、播放器阶段明确的有界通知收据，核误响/漏响/资源；进程成功仍非人已听到，未实现。详见[Q06](#research-q06)。

可继续mock缺起点/失败/子Agent/多root与异源试听、畸形WAV和播放器退出，核分类与阶段真实性及资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 1382 | 1073 | 217 | — |
| .js | source | 1 | 307 | 269 | 22 | — |
| .md | source | 2 | 272 | — | — | 2017 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/117BS/dsh-perlica-ding/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/117BS/dsh-perlica-ding/issues?q=is%3Aissue+created%3A2026-09-22T08%3A59%3A04.036Z..2026-10-22T08%3A59%3A04.036Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/117BS/dsh-perlica-ding/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A59%3A04.036Z..2026-10-22T08%3A59%3A04.036Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核分档通知与任务成功区别、主会话/事件时序、音源/PCM/播放器与设置桥边界、成本和采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么通知需求，声音能说明什么？

**研究主题**：场景与需求

#### 完整回答

适合在本机运行DSH、工作中切到别的窗口但希望听见计划/回合收尾/待回应/错误的用户。四个本地音效与音量设置是注意力提示，普通纯查询拟保持静音。角色主题是呈现偏好，不是技术或业务效果证据。

合格结果是正确主会话事件响合适声音、安静场景不扰民、音量与自定义源可预测。done只由执行类工具结果和turn-stopping判断，不证明任务目标完成或指标正常；plan只是仍在计划模式，也不证明有完整方案。基线是持续盯窗口或系统普通通知，增量是事件分档/可试听音量，不提升模型质量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-38](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/README.md#L24-L38)

作者分档/主会话/平台声明。

<details>
<summary>查看原文（15行）</summary>

```text
| 场景 | 触发条件 | 音效文件 |
|---|---|---|
| 🗂️ 计划出方案 | 回合结束时仍处于计划模式 | `plan.wav` |
| ✅ 任务完成 | 回合结束且本回合调用过**执行类工具**（改文件/跑命令/子代理/工作流等） | `done.wav` |
| 💬 普通问答 | 纯对话，或只用了查询类工具（读文件/搜索网页等） | 静音 |
| 🙋 需要你回应 | agent 提问 / 审批请求 | `ask.wav` |
| ⚠️ 出错 | 回合报错 | `fail.wav` |

其他特性：

- **只响主对话**：子代理/后台任务完成时不单独响，随主回合统一收尾
- **防抖**：每档独立 2.5 秒间隔，不会连响
- **可自定义音效**：把 wav 文件放到指定目录即可，无需改代码
- **跨平台**：Windows (SoundPlayer) / macOS (afplay) / Linux (paplay/aplay)
- **可配置**：总开关、防抖间隔、音效目录
```

</details>

**依据 2 · 源码核查**：[index.mjs:620-682](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L620-L682)

实际事件判断。

<details>
<summary>查看原文（63行）</summary>

```text
  ctx.on('agent/inbox/claimed', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    turnStart.set(payload.agent.id, Date.now())
  })

  ctx.on('tools/result', (exec) => {
    if (!exec || !exec.agent || !isRoot(exec.agent)) return
    // Only execution-class tools count as "doing a task". With an empty
    // execTools config every tool counts (old behavior).
    if (cfg.execTools.length > 0 && !cfg.execTools.includes(exec.name)) return
    lastTool.set(exec.agent.id, Date.now())
  })

  ctx.on('tools/execute', (exec, next) => {
    // Same root-only rule as the turn sounds: a subagent asking a question must
    // not beep the human.
    if (exec && exec.name === 'ask_user_question' && (!exec.agent || isRoot(exec.agent))) {
      play('ask', false, cwdOf(exec.agent))
    }
    return next()
  })

  ctx.on('approval/request', (req, next) => {
    const agent = req && req.agent
    if (!agent || isRoot(agent)) play('ask', false, cwdOf(agent))
    return next()
  })

  ctx.on('agent/error', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    play('fail', false, cwdOf(payload.agent))
  })

  ctx.on('agent/turn-stopping', (payload) => {
    if (!payload || !payload.agent || !isRoot(payload.agent)) return
    const id = payload.agent.id
    // Prefer the planMode service (npm environment); fall back to folding
    // the session event log when the service is not reachable (dynamic
    // plugin sandbox).
    let active = false
    if (planMode) {
      try {
        const state = planMode.get(payload.agent)
        active = !!(state && state.active)
      } catch (error) { /* ignore */ }
    } else {
      try {
        active = foldPlanModeFromEvents(sessionEventsOf(payload.agent))
      } catch (error) { /* ignore */ }
    }
    try {
      if (active) {
        play('plan', false, cwdOf(payload.agent))
      } else {
        const start = turnStart.get(id) || 0
        const tool = lastTool.get(id) || 0
        if (tool >= start) play('done', false, cwdOf(payload.agent))
      }
    } catch (error) {
      console.error('[dsh-perlica-ding] turn-stopping handler failed', error)
    } finally {
      turnStart.delete(id)
      lastTool.delete(id)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分类、播放和设置的链条是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

agent/inbox/claimed记起点，执行工具白名单的tools/result记最近时间，turn-stopping优先计划模式否则比较tool>=start播done。ask工具/审批、agent/error分别立即触发。按音效种类共享lastPlayed防抖，多个主会话同类事件也会相互抑制，并非每会话独立。

音源按配置目录→session.header.cwd→包内→系统依次选首个exists。小于100音量用纯JS读WAV并缩放8/16位PCM到临时缓存，不改系统音量；Windows用转义路径的EncodedCommand，macOS afplay，Linux paplay/aplay经宿主subprocess argv启动，不让页面提交任意命令。

设置通过同源Web桥读取/保存音量、试听；优先宿主settings namespace，0.2没有register时落自有volume.json，内存作最后fallback。贡献是四档事件、平台播放与可持久音量/试听接线；均为成熟工程组合。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:327-385](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L327-L385)

settings/file/runtime层级。

<details>
<summary>查看原文（59行）</summary>

```text
  const registerVolumeSettings = (settingsService) => {
    if (volumeScope || fileVolumeLoaded) return
    if (!settingsService || typeof settingsService.register !== 'function') {
      // Hosts like DSH 0.2 expose a settings service without `register`.
      useFileStore()
      return
    }
    try {
      volumeScope = settingsService.register(
        'dsh-perlica-ding',
        z.object({ volume: z.number().min(0).max(100).default(100) }),
        { base: { volume: cfg.volume }, applies: 'live' },
      )
      // Carry over a value the user picked before the namespace existed.
      if (runtimeVolume !== null) {
        Promise.resolve(volumeScope.update({ volume: runtimeVolume })).catch(() => {})
      }
    } catch (error) {
      console.error('[dsh-perlica-ding] settings registration failed; using file storage', error)
      useFileStore()
    }
  }

  /** Effective volume: settings namespace -> file -> runtime -> config. */
  const currentVolume = () => {
    if (volumeScope) {
      try {
        const value = volumeScope.get()
        if (value && typeof value.volume === 'number' && Number.isFinite(value.volume)) {
          return Math.max(0, Math.min(100, Math.round(value.volume)))
        }
      } catch (error) { /* fall through to the next tier */ }
    }
    if (fileVolumeLoaded) {
      if (fileVolume === null) fileVolume = readFileVolume()
      if (fileVolume !== null) return fileVolume
    }
    if (runtimeVolume !== null) return runtimeVolume
    return cfg.volume
  }

  /** Whether this environment can store the volume across restarts. */
  const canPersist = () => !!(volumeScope || fileVolumeLoaded)

  /** Store one volume value through the active tier. Reports failures. */
  const storeVolume = async (next) => {
    if (volumeScope) {
      await volumeScope.update({ volume: next })
      return true
    }
    if (fileVolumeLoaded) {
      if (!writeFileVolume(next)) {
        throw new Error('无法写入音量文件：' + storeFile())
      }
      fileVolume = next
      return true
    }
    runtimeVolume = next
    return false
```

</details>

**依据 2 · 源码核查**：[index.mjs:420-491](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L420-L491)

选文件/平台argv。

<details>
<summary>查看原文（72行）</summary>

```text
  const resolveSound = (kind, sessionCwd) => {
    const candidates = []
    if (cfg.soundDir) candidates.push(join(cfg.soundDir, kind + '.wav'))
    if (sessionCwd) candidates.push(join(sessionCwd, kind + '.wav'))
    candidates.push(join(BUNDLED_SOUNDS, kind + '.wav'))
    const sys = (SYSTEM_SOUNDS[platform] || {})[kind] || []
    candidates.push(...sys)
    for (const candidate of candidates) {
      if (existsSync(candidate)) return candidate
    }
    return null
  }

  const spawnBeep = (attempts) => {
    let index = 0
    const tryNext = () => {
      if (index >= attempts.length) return
      const argv = attempts[index++]
      let handle
      try {
        handle = subprocess.spawn({
          argv,
          cwd: platform === 'win32' ? 'C:\\Windows' : '/',
          stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' },
          graceMs: 3000,
        })
      } catch (error) {
        console.error('[dsh-perlica-ding] spawn failed', argv[0], error)
        tryNext()
        return
      }
      handle.done.catch((error) => {
        console.error('[dsh-perlica-ding] play process failed', argv[0], error)
        tryNext()
      })
    }
    tryNext()
  }

  /**
   * Play one sound kind.
   *
   * @param kind - which sound to play.
   * @param force - preview mode: skip the debounce so a user clicking through
   *   kinds hears every one immediately.
   * @param sessionCwd - the session workspace used to locate a custom wav.
   */
  const play = (kind, force = false, sessionCwd = undefined) => {
    if (!cfg.enabled) return
    const volume = currentVolume()
    if (volume <= 0) return
    const now = Date.now()
    if (!force && now - (lastPlayed[kind] || 0) < cfg.debounceMs) return
    lastPlayed[kind] = now
    const resolved = resolveSound(kind, sessionCwd)
    if (!resolved) {
      console.error('[dsh-perlica-ding] no sound file found for "' + kind + '"; nothing played')
      return
    }
    const file = volume < 100 ? scaleWavVolume(resolved, volume) : resolved
    if (platform === 'win32') {
      const escaped = file.replace(/'/g, "''")
      const script = "$p = New-Object Media.SoundPlayer '" + escaped + "'; $p.PlaySync()"
      const encoded = utf16leToBase64(script)
      spawnBeep([
        ['C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
        ['pwsh.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
      ])
    } else if (platform === 'darwin') {
      spawnBeep([['/usr/bin/afplay', file]])
    } else {
      spawnBeep([['paplay', file], ['aplay', file]])
```

</details>

**依据 3 · 源码核查**：[index.mjs:620-682](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L620-L682)

分类和清理。

<details>
<summary>查看原文（63行）</summary>

```text
  ctx.on('agent/inbox/claimed', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    turnStart.set(payload.agent.id, Date.now())
  })

  ctx.on('tools/result', (exec) => {
    if (!exec || !exec.agent || !isRoot(exec.agent)) return
    // Only execution-class tools count as "doing a task". With an empty
    // execTools config every tool counts (old behavior).
    if (cfg.execTools.length > 0 && !cfg.execTools.includes(exec.name)) return
    lastTool.set(exec.agent.id, Date.now())
  })

  ctx.on('tools/execute', (exec, next) => {
    // Same root-only rule as the turn sounds: a subagent asking a question must
    // not beep the human.
    if (exec && exec.name === 'ask_user_question' && (!exec.agent || isRoot(exec.agent))) {
      play('ask', false, cwdOf(exec.agent))
    }
    return next()
  })

  ctx.on('approval/request', (req, next) => {
    const agent = req && req.agent
    if (!agent || isRoot(agent)) play('ask', false, cwdOf(agent))
    return next()
  })

  ctx.on('agent/error', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    play('fail', false, cwdOf(payload.agent))
  })

  ctx.on('agent/turn-stopping', (payload) => {
    if (!payload || !payload.agent || !isRoot(payload.agent)) return
    const id = payload.agent.id
    // Prefer the planMode service (npm environment); fall back to folding
    // the session event log when the service is not reachable (dynamic
    // plugin sandbox).
    let active = false
    if (planMode) {
      try {
        const state = planMode.get(payload.agent)
        active = !!(state && state.active)
      } catch (error) { /* ignore */ }
    } else {
      try {
        active = foldPlanModeFromEvents(sessionEventsOf(payload.agent))
      } catch (error) { /* ignore */ }
    }
    try {
      if (active) {
        play('plan', false, cwdOf(payload.agent))
      } else {
        const start = turnStart.get(id) || 0
        const tool = lastTool.get(id) || 0
        if (tool >= start) play('done', false, cwdOf(payload.agent))
      }
    } catch (error) {
      console.error('[dsh-perlica-ding] turn-stopping handler failed', error)
    } finally {
      turnStart.delete(id)
      lastTool.delete(id)
```

</details>

**依据 4 · 源码核查**：[index.mjs:467-479](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L467-L479)

全实例按种类防抖。

<details>
<summary>查看原文（13行）</summary>

```text
  const play = (kind, force = false, sessionCwd = undefined) => {
    if (!cfg.enabled) return
    const volume = currentVolume()
    if (volume <= 0) return
    const now = Date.now()
    if (!force && now - (lastPlayed[kind] || 0) < cfg.debounceMs) return
    lastPlayed[kind] = now
    const resolved = resolveSound(kind, sessionCwd)
    if (!resolved) {
      console.error('[dsh-perlica-ding] no sound file found for "' + kind + '"; nothing played')
      return
    }
    const file = volume < 100 ? scaleWavVolume(resolved, volume) : resolved
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 误响、漏响和试听有哪些条件？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

root判定依agents.roots；服务缺失或查询异常返回true，不能保证所有宿主始终只响主会话。tools/result不检查isError，执行类命令失败也可被计done；agent/error另播fail，随后stopping可能再播done，因为不同档分别防抖。若没有claimed起点且没有tool记录，两者默认0，0>=0也会done。这里只是静态事件序列条件，未声称真实宿主必缺这些事件。

planMode存在但get抛错时忽略，不像服务缺失时读取历史fallback；无服务时遍历全会话事件折叠计划状态，长会话有同步成本。工具白名单只能按名字推断执行性质，未知写工具可漏，job_output等读状态也计done；空execTools则全部工具包括查询均计，文档已明示旧行为。

试听play(kind,true)不传session cwd，真实通知传cwd，因此有工作区定制声音时试听可能选包内而实际选另一文件。“同链路”不等同音源。preview立即回played，即使音量0、找不到音源或播放器后续失败也未返回实际可听证据。spawnBeep只在spawn抛错或done拒绝时试fallback，若宿主以resolved非零退出表示失败则不会换；没有显式总超时、并发上限/卸载kill，graceMs不是业务最长播放预算。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:397-404](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L397-L404)

root失效放行。

```text
  const isRoot = (agent) => {
    if (!agents || !agent) return true
    try {
      const roots = agents.roots()
      return roots.some((a) => a.id === agent.id)
    } catch (error) {
      return true
    }
```

**依据 2 · 源码核查**：[index.mjs:433-456](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L433-L456)

播放受理/fallback。

<details>
<summary>查看原文（24行）</summary>

```text
  const spawnBeep = (attempts) => {
    let index = 0
    const tryNext = () => {
      if (index >= attempts.length) return
      const argv = attempts[index++]
      let handle
      try {
        handle = subprocess.spawn({
          argv,
          cwd: platform === 'win32' ? 'C:\\Windows' : '/',
          stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' },
          graceMs: 3000,
        })
      } catch (error) {
        console.error('[dsh-perlica-ding] spawn failed', argv[0], error)
        tryNext()
        return
      }
      handle.done.catch((error) => {
        console.error('[dsh-perlica-ding] play process failed', argv[0], error)
        tryNext()
      })
    }
    tryNext()
```

</details>

**依据 3 · 源码核查**：[index.mjs:574-582](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L574-L582)

试听无cwd且立即回响应。

```text
          if (req.method === 'POST' && path === '/perlica-ding/api/preview') {
            if (!cfg.enabled) {
              return send(409, { error: '插件已停用，试听不可用' })
            }
            const body = await readJsonBody(req)
            const kind = String((body && body.kind) || '')
            if (!KINDS.includes(kind)) return send(400, { error: 'unknown sound kind' })
            play(kind, true)
            return send(200, { played: kind, volume: currentVolume() })
```

**依据 4 · 源码核查**：[index.mjs:625-650](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L625-L650)

结果不核成功及错误档。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.on('tools/result', (exec) => {
    if (!exec || !exec.agent || !isRoot(exec.agent)) return
    // Only execution-class tools count as "doing a task". With an empty
    // execTools config every tool counts (old behavior).
    if (cfg.execTools.length > 0 && !cfg.execTools.includes(exec.name)) return
    lastTool.set(exec.agent.id, Date.now())
  })

  ctx.on('tools/execute', (exec, next) => {
    // Same root-only rule as the turn sounds: a subagent asking a question must
    // not beep the human.
    if (exec && exec.name === 'ask_user_question' && (!exec.agent || isRoot(exec.agent))) {
      play('ask', false, cwdOf(exec.agent))
    }
    return next()
  })

  ctx.on('approval/request', (req, next) => {
    const agent = req && req.agent
    if (!agent || isRoot(agent)) play('ask', false, cwdOf(agent))
    return next()
  })

  ctx.on('agent/error', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    play('fail', false, cwdOf(payload.agent))
```

</details>

**依据 5 · 源码核查**：[index.mjs:653-682](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L653-L682)

plan异常/0默认比较。

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.on('agent/turn-stopping', (payload) => {
    if (!payload || !payload.agent || !isRoot(payload.agent)) return
    const id = payload.agent.id
    // Prefer the planMode service (npm environment); fall back to folding
    // the session event log when the service is not reachable (dynamic
    // plugin sandbox).
    let active = false
    if (planMode) {
      try {
        const state = planMode.get(payload.agent)
        active = !!(state && state.active)
      } catch (error) { /* ignore */ }
    } else {
      try {
        active = foldPlanModeFromEvents(sessionEventsOf(payload.agent))
      } catch (error) { /* ignore */ }
    }
    try {
      if (active) {
        play('plan', false, cwdOf(payload.agent))
      } else {
        const start = turnStart.get(id) || 0
        const tool = lastTool.get(id) || 0
        if (tool >= start) play('done', false, cwdOf(payload.agent))
      }
    } catch (error) {
      console.error('[dsh-perlica-ding] turn-stopping handler failed', error)
    } finally {
      turnStart.delete(id)
      lastTool.delete(id)
```

</details>

#### 缺口

- 宿主真实事件时序/播放器done退出契约和无音设备路径未知。
  **影响**：不保证无误done/只主会话/实际可听与自动fallback。
  **进一步探讨**：mock缺claimed、失败工具/agent-error/stopping、子Agent、非零resolveddone，再以可关闭音设备核实际反馈；不使用真实任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 音量、文件与Web桥有何安全/资源边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

音量0在play前直接返回，可靠避免启动播放器；其他减音量只支持PCM，非PCM或读取/缓存失败回原路径，可能原音量播。解析fmt chunk只检查声明chunkSize，未先核实际body剩余长度，畸形WAV可触发Buffer越界异常。工作区同名音源优先于包内，可信项目可自定义，但陌生仓库文件不应被当可信通知资产。

缓存键含内容hash能避免同大小换音源复用旧文件，但程序先read/Buffer复制/逐采样缩放，再检查dest存在；“同音量只计算一次”实际上只避免重复写盘，CPU仍重算。无文件大小/缓存容量/保留上限，同步处理大文件可阻塞事件回调。音量文件固定.tmp再rename没有独占临时名/CAS，多个profile共享默认~/.dsh目录可能竞争，非每profile隔离。

桥只校Origin.host与请求Host相同，不检协议/请求peer或独立身份，无Origin放行；注释loopback-only不是代码自证。实际远程暴露仍由宿主绑定/认证决定，不能直接断言公网无鉴权。预览绕防抖且无并发上限，可引发重复播放；POST限JSON、kind枚举与音量范围是有用输入约束，但readJsonBody截字符串而非终止超大/慢请求，且无插件超时。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:53-122](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L53-L122)

PCM/格式/缓存语义。

<details>
<summary>查看原文（70行）</summary>

```text
function scaleWavVolume(srcPath, volume) {
  const gain = volume / 100
  if (gain === 1) return srcPath
  let buf
  try {
    buf = readFileSync(srcPath)
  } catch (error) {
    return srcPath
  }
  if (buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
    return srcPath
  }
  let offset = 12
  let audioFormat = 0
  let bitsPerSample = 0
  let dataOffset = -1
  let dataSize = 0
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4)
    const chunkSize = buf.readUInt32LE(offset + 4)
    const body = offset + 8
    if (id === 'fmt ' && chunkSize >= 16) {
      audioFormat = buf.readUInt16LE(body)
      bitsPerSample = buf.readUInt16LE(body + 14)
      // WAVE_FORMAT_EXTENSIBLE (0xFFFE): the real format is the first 2 bytes
      // of the sub-format GUID at body+24.
      if (audioFormat === 0xfffe && chunkSize >= 40 && buf.readUInt16LE(body + 24) === 1) {
        audioFormat = 1
      }
    } else if (id === 'data') {
      dataOffset = body
      dataSize = Math.min(chunkSize, buf.length - body)
    }
    if (dataOffset >= 0 && bitsPerSample > 0) break
    offset = body + chunkSize + (chunkSize % 2)
  }
  if (dataOffset < 0 || audioFormat !== 1) return srcPath
  const out = Buffer.from(buf)
  if (bitsPerSample === 16) {
    for (let i = 0; i + 1 < dataSize; i += 2) {
      const pos = dataOffset + i
      let v = Math.round(out.readInt16LE(pos) * gain)
      if (v > 32767) v = 32767
      else if (v < -32768) v = -32768
      out.writeInt16LE(v, pos)
    }
  } else if (bitsPerSample === 8) {
    for (let i = 0; i < dataSize; i++) {
      const pos = dataOffset + i
      let v = Math.round((out.readUInt8(pos) - 128) * gain + 128)
      if (v > 255) v = 255
      else if (v < 0) v = 0
      out.writeUInt8(v, pos)
    }
  } else {
    return srcPath
  }
  // Content-addressed cache key: replacing a sound file (even with one of the
  // same size) yields a different digest, so the stale copy is never reused.
  const digest = createHash('sha1').update(buf).digest('hex').slice(0, 12)
  const dest = join(CACHE_DIR, basename(srcPath).replace(/\.wav$/i, '') + '-v' + volume + '-' + digest + '.wav')
  try {
    if (!existsSync(dest)) {
      mkdirSync(CACHE_DIR, { recursive: true })
      writeFileSync(dest, out)
    }
    return dest
  } catch (error) {
    console.error('[dsh-perlica-ding] volume cache write failed', error)
    return srcPath
```

</details>

**依据 2 · 源码核查**：[index.mjs:307-318](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L307-L318)

固定tmp文件。

<details>
<summary>查看原文（12行）</summary>

```text
  const writeFileVolume = (volume) => {
    try {
      const dest = storeFile()
      mkdirSync(dirname(dest), { recursive: true })
      const tmp = dest + '.tmp'
      writeFileSync(tmp, JSON.stringify({ volume, savedAt: new Date().toISOString() }, null, 2))
      renameSync(tmp, dest)
      return true
    } catch (error) {
      console.error('[dsh-perlica-ding] volume file write failed', error)
      return false
    }
```

</details>

**依据 3 · 源码核查**：[index.mjs:467-479](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L467-L479)

静音/防抖。

<details>
<summary>查看原文（13行）</summary>

```text
  const play = (kind, force = false, sessionCwd = undefined) => {
    if (!cfg.enabled) return
    const volume = currentVolume()
    if (volume <= 0) return
    const now = Date.now()
    if (!force && now - (lastPlayed[kind] || 0) < cfg.debounceMs) return
    lastPlayed[kind] = now
    const resolved = resolveSound(kind, sessionCwd)
    if (!resolved) {
      console.error('[dsh-perlica-ding] no sound file found for "' + kind + '"; nothing played')
      return
    }
    const file = volume < 100 ? scaleWavVolume(resolved, volume) : resolved
```

</details>

**依据 4 · 源码核查**：[index.mjs:503-516](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L503-L516)

body截断无中止。

<details>
<summary>查看原文（14行）</summary>

```text
  const readJsonBody = (req) => new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 65536) data = data.slice(0, 65536)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'))
      } catch (error) {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
```

</details>

**依据 5 · 源码核查**：[index.mjs:536-582](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L536-L582)

Origin/Host和参数/预览限制。

<details>
<summary>查看原文（47行）</summary>

```text
          const path = (req.url || '').split('?')[0]
          const headers = req.headers || {}
          // Loopback-only surface: require a same-origin browser caller (or no
          // Origin header at all, which is how non-browser clients arrive).
          const origin = headers.origin
          if (typeof origin === 'string' && origin.length > 0) {
            let sameOrigin = false
            try {
              sameOrigin = new URL(origin).host === headers.host
            } catch (error) {
              sameOrigin = false
            }
            if (!sameOrigin) return send(403, { error: 'cross-origin request refused' })
          }
          if (req.method === 'GET' && path === '/perlica-ding/api/state') {
            return send(200, {
              volume: currentVolume(),
              enabled: cfg.enabled,
              debounceMs: cfg.debounceMs,
              persistent: canPersist(),
              kinds: KINDS.map((id) => ({ id, label: KIND_LABELS[id] })),
            })
          }
          if (req.method === 'POST') {
            const contentType = String(headers['content-type'] || '')
            if (!contentType.includes('application/json')) {
              return send(415, { error: 'content-type must be application/json' })
            }
          }
          if (req.method === 'POST' && path === '/perlica-ding/api/volume') {
            const body = await readJsonBody(req)
            const next = Math.round(Number(body && body.volume))
            if (!Number.isFinite(next) || next < 0 || next > 100) {
              return send(400, { error: 'volume must be a number between 0 and 100' })
            }
            const stored = await storeVolume(next)
            return send(200, { volume: currentVolume(), persistent: stored || canPersist() })
          }
          if (req.method === 'POST' && path === '/perlica-ding/api/preview') {
            if (!cfg.enabled) {
              return send(409, { error: '插件已停用，试听不可用' })
            }
            const body = await readJsonBody(req)
            const kind = String((body && body.kind) || '')
            if (!KINDS.includes(kind)) return send(400, { error: 'unknown sound kind' })
            play(kind, true)
            return send(200, { played: kind, volume: currentVolume() })
```

</details>

#### 缺口

- 畸形/大WAV、并发profile写与Web部署认证/速率的具体表现未受控对照。
  **影响**：不承诺任意音频安全解析或所有部署请求隔离。
  **进一步探讨**：用最小合成WAV/mock文件和HTTP事件核边界，不读真实音频/配置，不开放服务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动流程和成本效果是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH subprocess与对应Agent事件 | 分类/播放 | agents/planMode缺失会降级改变语义 |
| 系统音频和播放器 | Windows SoundPlayer/mac afplay/Linux paplay或aplay | host机器发声，远端浏览器不必能听到 |
| 可信小型PCM WAV | 音源与减音量 | 包内四文件，陌生工作区可覆盖 |
| Web/slots、settings或可写自有目录 | 设置/音量保存 | 无Web仍可提示，存储tier需核 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主服务/音频设备 | 默认音量100，先降音量或0 |
| 配资产 | 指可信soundDir/核工作区同名文件 | 先小PCM，别依非PCM降音量 |
| 设置 | 保存音量核persistent | 多profile共文件需分开 |
| 核通知 | 用合成事件核plan/done/ask/fail | done不是业务成功；试听音源未必同cwd |
| 维护 | 清缓存/核错误与遗留播放器 | 不把HTTP played当听见 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包含WAV/本地音频，不直接调模型/云TTS | 安装重启、核设备与调音量 | 包价格/工时未知，后制自定义TTS另计 |
| 持续使用 | 播放子进程/同步读缩放/临时缓存 | 通知打扰和资产维护 | 无新增LLM请求，CPU/缓存/噪声成本未量化 |
| 失败恢复 | 重播/清临时文件/音量备份恢复 | 查事件、播放器、源文件与设置tier | 无播放完成收据/显式kill，恢复时长未知 |

#### 效果

| 目标 | 源码支持 | 限制 |
| --- | --- | --- |
| 少盯窗口 | 主事件分档声音 | 远端/静音设备无可听保证 |
| 安静普通问答 | 执行白名单与防抖 | 缺claimed或root判断降级可误响 |
| 可控音量 | PCM缩放/0静音/保存 | 非PCM回原音量，试听cwd不同 |
| 多平台 | 固定播放器argv | 非各平台真实可用性验收 |

package未锁具体宿主版本/Node engine，只有宽peer，跨代settings feature detection降低一类耦合，不等全兼容。作者verify脚本为mock设计，本轮只读，不执行播放/设置或验证脚本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-34](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/package.json#L13-L34)

bundle/client/文件分发。

<details>
<summary>查看原文（22行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots"
      ]
    }
  },
  "files": [
    "index.mjs",
    "lib",
    "cordis.patch.yml",
    "assets",
    "sounds",
    "README.md",
    "README.en.md",
    "LICENSE"
  ],
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[package.json:56-67](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/package.json#L56-L67)

宽peer声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/schemastery": {
      "optional": true
    }
  }
```

</details>

**依据 3 · 源码核查**：[index.mjs:42-43](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L42-L43)

硬subprocess依赖。

```text
/** Hard dependency: the subprocess seam used to play sounds. */
export const inject = ['subprocess']
```

**依据 4 · 源码核查**：[index.mjs:467-491](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L467-L491)

播放资源/静音。

<details>
<summary>查看原文（25行）</summary>

```text
  const play = (kind, force = false, sessionCwd = undefined) => {
    if (!cfg.enabled) return
    const volume = currentVolume()
    if (volume <= 0) return
    const now = Date.now()
    if (!force && now - (lastPlayed[kind] || 0) < cfg.debounceMs) return
    lastPlayed[kind] = now
    const resolved = resolveSound(kind, sessionCwd)
    if (!resolved) {
      console.error('[dsh-perlica-ding] no sound file found for "' + kind + '"; nothing played')
      return
    }
    const file = volume < 100 ? scaleWavVolume(resolved, volume) : resolved
    if (platform === 'win32') {
      const escaped = file.replace(/'/g, "''")
      const script = "$p = New-Object Media.SoundPlayer '" + escaped + "'; $p.PlaySync()"
      const encoded = utf16leToBase64(script)
      spawnBeep([
        ['C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
        ['pwsh.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
      ])
    } else if (platform === 'darwin') {
      spawnBeep([['/usr/bin/afplay', file]])
    } else {
      spawnBeep([['paplay', file], ['aplay', file]])
```

</details>

**依据 5 · 源码核查**：[lib/client.js:169-195](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/lib/client.js#L169-L195)

保存/试听UI。

<details>
<summary>查看原文（27行）</summary>

```text
      const commit = (value) => {
        request('/volume', { volume: value })
          .then((result) => {
            setVolume(result.volume)
            setNotice('')
          })
          .catch((error) => setNotice('保存失败：' + error.message))
      }

      const onSlide = (event) => {
        const value = Number(event.target.value)
        setVolume(value)
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => commit(value), 200)
      }

      const onPreset = (value) => {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        setVolume(value)
        commit(value)
      }

      const onPreview = (kind) => {
        setBusy(kind)
        request('/preview', { kind })
          .catch((error) => setNotice('试听失败：' + error.message))
          .finally(() => setTimeout(() => setBusy(''), 500))
```

</details>

#### 缺口

- 同任务切窗提醒效果、打扰率与跨平台播放器资源没有对照。
  **影响**：不量化注意力/省时收益。
  **进一步探讨**：合成事件盲标真实类别、记误响/漏响与手动响应时间，先mock再由读者自选低音量。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐和继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。适合可信本机、愿意核事件/低音量和可听设备的个人用户，四档与设置实用。远端部署/多会话严格静音、必须可靠业务完成提示或任意不可信WAV场景先观察。不要因“任务执行完毕/指标正常”语音把执行工具事件升级成任务验收。

从分类状态与播放受理脱节可推导“事件原因和音源一致的通知收据”。按agent+turn记录claimed/成功失败/等待原因，缺起点不发done，root未知宁可静音；预览显式指定可信音源标识与通知共用，区分静音/未找到/启动/播放完成/错误，播放器超时和并发有界。对照当前按种类防抖与异步即返回。

反例是系统音量0/设备断开时子进程0也不能证明人听到，因此新收据最多证明播放器阶段，不能称可听送达。最小对照含缺claimed、工具失败后stopping、子Agent、两个root、预览/真实不同cwd、非PCM/畸形chunk、slow/非零播放器。若仍误done、越级root响、未完成即宣称播放完成，或为防打扰漏掉真实待审批，假设受反证。方案未实现，需同时比较CPU/等待/误漏提醒，不计当前优势。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:620-682](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L620-L682)

分类收据基线。

<details>
<summary>查看原文（63行）</summary>

```text
  ctx.on('agent/inbox/claimed', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    turnStart.set(payload.agent.id, Date.now())
  })

  ctx.on('tools/result', (exec) => {
    if (!exec || !exec.agent || !isRoot(exec.agent)) return
    // Only execution-class tools count as "doing a task". With an empty
    // execTools config every tool counts (old behavior).
    if (cfg.execTools.length > 0 && !cfg.execTools.includes(exec.name)) return
    lastTool.set(exec.agent.id, Date.now())
  })

  ctx.on('tools/execute', (exec, next) => {
    // Same root-only rule as the turn sounds: a subagent asking a question must
    // not beep the human.
    if (exec && exec.name === 'ask_user_question' && (!exec.agent || isRoot(exec.agent))) {
      play('ask', false, cwdOf(exec.agent))
    }
    return next()
  })

  ctx.on('approval/request', (req, next) => {
    const agent = req && req.agent
    if (!agent || isRoot(agent)) play('ask', false, cwdOf(agent))
    return next()
  })

  ctx.on('agent/error', (payload) => {
    if (!payload || !isRoot(payload.agent)) return
    play('fail', false, cwdOf(payload.agent))
  })

  ctx.on('agent/turn-stopping', (payload) => {
    if (!payload || !payload.agent || !isRoot(payload.agent)) return
    const id = payload.agent.id
    // Prefer the planMode service (npm environment); fall back to folding
    // the session event log when the service is not reachable (dynamic
    // plugin sandbox).
    let active = false
    if (planMode) {
      try {
        const state = planMode.get(payload.agent)
        active = !!(state && state.active)
      } catch (error) { /* ignore */ }
    } else {
      try {
        active = foldPlanModeFromEvents(sessionEventsOf(payload.agent))
      } catch (error) { /* ignore */ }
    }
    try {
      if (active) {
        play('plan', false, cwdOf(payload.agent))
      } else {
        const start = turnStart.get(id) || 0
        const tool = lastTool.get(id) || 0
        if (tool >= start) play('done', false, cwdOf(payload.agent))
      }
    } catch (error) {
      console.error('[dsh-perlica-ding] turn-stopping handler failed', error)
    } finally {
      turnStart.delete(id)
      lastTool.delete(id)
```

</details>

**依据 2 · 源码核查**：[index.mjs:433-491](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L433-L491)

播放/资源基线。

<details>
<summary>查看原文（59行）</summary>

```text
  const spawnBeep = (attempts) => {
    let index = 0
    const tryNext = () => {
      if (index >= attempts.length) return
      const argv = attempts[index++]
      let handle
      try {
        handle = subprocess.spawn({
          argv,
          cwd: platform === 'win32' ? 'C:\\Windows' : '/',
          stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' },
          graceMs: 3000,
        })
      } catch (error) {
        console.error('[dsh-perlica-ding] spawn failed', argv[0], error)
        tryNext()
        return
      }
      handle.done.catch((error) => {
        console.error('[dsh-perlica-ding] play process failed', argv[0], error)
        tryNext()
      })
    }
    tryNext()
  }

  /**
   * Play one sound kind.
   *
   * @param kind - which sound to play.
   * @param force - preview mode: skip the debounce so a user clicking through
   *   kinds hears every one immediately.
   * @param sessionCwd - the session workspace used to locate a custom wav.
   */
  const play = (kind, force = false, sessionCwd = undefined) => {
    if (!cfg.enabled) return
    const volume = currentVolume()
    if (volume <= 0) return
    const now = Date.now()
    if (!force && now - (lastPlayed[kind] || 0) < cfg.debounceMs) return
    lastPlayed[kind] = now
    const resolved = resolveSound(kind, sessionCwd)
    if (!resolved) {
      console.error('[dsh-perlica-ding] no sound file found for "' + kind + '"; nothing played')
      return
    }
    const file = volume < 100 ? scaleWavVolume(resolved, volume) : resolved
    if (platform === 'win32') {
      const escaped = file.replace(/'/g, "''")
      const script = "$p = New-Object Media.SoundPlayer '" + escaped + "'; $p.PlaySync()"
      const encoded = utf16leToBase64(script)
      spawnBeep([
        ['C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
        ['pwsh.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', encoded],
      ])
    } else if (platform === 'darwin') {
      spawnBeep([['/usr/bin/afplay', file]])
    } else {
      spawnBeep([['paplay', file], ['aplay', file]])
```

</details>

**依据 3 · 源码核查**：[index.mjs:574-582](https://github.com/117BS/dsh-perlica-ding/blob/f9db75c3cff13919659e81311a2b3d62f9af8aab/index.mjs#L574-L582)

试听即回基线。

```text
          if (req.method === 'POST' && path === '/perlica-ding/api/preview') {
            if (!cfg.enabled) {
              return send(409, { error: '插件已停用，试听不可用' })
            }
            const body = await readJsonBody(req)
            const kind = String((body && body.kind) || '')
            if (!KINDS.includes(kind)) return send(400, { error: 'unknown sound kind' })
            play(kind, true)
            return send(200, { played: kind, volume: currentVolume() })
```

#### 缺口

- 事件原因/播放阶段收据与有界播放器方案未实现。
  **影响**：不计现有可靠提醒或资源优势。
  **进一步探讨**：mock事件和播放器故障，比较误响/漏响、阶段真实性与资源，无需真实Agent工作。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
