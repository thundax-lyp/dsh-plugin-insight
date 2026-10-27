# dsh-sound

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[aa7be41](https://github.com/AI-Galaxy-GPU/dsh-sound/tree/aa7be415ee34570bd1c834da9d8a500e85401583)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AI-Galaxy-GPU/dsh-sound) [![npm 30d 920](https://img.shields.io/static/v1?label=npm+30d&message=920&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound)
<!-- END META -->

> **实现功能**：按完成、审批、提问、计划评审、受阻和失败播放独立声音，并区分主Agent/子Agent来源。

> **核心亮点**：将多事件/来源/音源与回放和跨tab干扰处理接成配置流程，非可靠通知队列或业务确认。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：snapshot无结束reason可误响完成，跨tab与静默播放失败不保证恰好一次/实际听到，子Agent默认和文档不一致。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，事件到声音怎样工作？](#detail-section-11)
  - [Q02 · 增量与误判、重复和漏响边界是什么？](#detail-section-12)
  - [Q03 · 依赖、本地保存和读者步骤是什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果如何评价？](#detail-section-14)
  - [Q05 · 工程点、播放收据假设与采用建议是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：离开聊天视线时辅助感知进展/待办，仍以原UI状态为准。

持续看原UI或系统提醒可替代，本包增加可听区分也引入打扰/漏误响与浏览器维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 六类声音 | 区分完成/注意 | snapshot无reason保证较弱 |
| 子Agent频道 | 单独配置/忽略 | 来源依会话行，非全默认静音 |
| 本地音源 | 合成/IDB/dataURL | 自动播放/解码可能静默失败 |
| 多tab去重 | 意图仲裁减少重复 | best-effort非恰好一次 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web slots/sessions/connection/locale | Client必需 | 设置页和事件流 | 硬注入版本需匹配；流失败后快照较弱 |
| 浏览器音频权限/可用输出 | 必需 | WebAudio/HTMLAudio播放 | resume/play失败静默，不等已听到 |
| localStorage | 配置可选 | 浏览器固定origin配置键 | 写失败仅内存，不用Host配置替代 |
| IndexedDB/本地音频 | 自定义可选 | Blob和audio引用 | 不可用回dataURL，可受quota/解码限制 |
| BroadcastChannel | 多标签去重可选 | 同origin意图握手 | 无全局持久确认，异步延迟可重复/漏响 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定Web/插件，低音量先内置试听 | 浏览器允许且实际听到，不仅按过播放 |
| 配置 | 明确主/子Agent六类音量/静音 | 子代理并非六类默认全静音，以实际配置为准 |
| 使用 | 受控事件对照原UI，保留视觉提示 | 铃声仅辅助，不作为任务成功/待办可靠队列 |
| 恢复 | 无声/多响查权限、频道和事件路径 | 不因无声重复业务操作，重要待办看原UI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器音频环境，金额未知 | 试听、权限和事件分类核对 | 内置无需外部TTS/API |
| 持续使用 | 事件流/状态图、音频解码/本地存储 | 调噪声/音量和子代理规则 | 提醒可能打扰，不等效率增益 |
| 失败恢复 | 配置/文件重选、权限/重连核查 | 对照原始UI待办，避免漏提醒 | 无播放ack、恢复重放边界不同 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提醒区分 | 六类型/主子Agent路由 | 实际听到率/反应时间改善 |
| 降重复 | 400ms来源去抖/40ms跨tab意图 | 跨tab恰好一次或持久可靠 |
| 兼容降级 | 流重连和快照diff | 结束reason/重放语义等价 |

> **思考**：snapshot无结束reason可误响完成，跨tab与静默播放失败不保证恰好一次/实际听到，子Agent默认和文档不一致。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多事件/来源/音源与回放和跨tab干扰处理接成配置流程，非可靠通知队列或业务确认。详见[Q01](#research-q01)与[Q02](#research-q02)。

将多事件/来源/音源与回放和跨tab干扰处理接成配置流程，非可靠通知队列或业务确认。详见[Q01](#research-q01)与[Q02](#research-q02)。

事件分类/声音源/配置分离、明确子Agent频道、指数重连、AbortController和watcher清理、音量sanitize及IDB避localStorage大音频是可复用点。snapshot是降级而非同语义副本，模块资源/全局仲裁仍需生命周期治理。

<a id="detail-section-5"></a>

### 1.4 主要限制

snapshot无结束reason可误响完成，跨tab与静默播放失败不保证恰好一次/实际听到，子Agent默认和文档不一致。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可试用作辅助通知，先内置低音量核主子频道/原UI，保留视觉提醒，不当唯一可靠通道。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持六类事件与主/子Agent音源配置、重连和辅助去重；快照缺结束原因、跨tab意图和静默播放失败不能保证不漏不重或人已听到。事件/播放状态与短租约方案尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host schema、Client配置/音频/去重/事件与快照/挂卸载；未全面审全部设置导入导出UI或证明真实浏览器输出。
- 下一步：进一步探讨以结束reason/播放失败/迟到tab/连续事件/初始pending/卸载夹具核弱语义，再测感知与打扰。

**分析版本**

- **仓库**：[AI-Galaxy-GPU/dsh-sound](https://github.com/AI-Galaxy-GPU/dsh-sound)
- **版本号**：0.4.1（[固定提交 aa7be41](https://github.com/AI-Galaxy-GPU/dsh-sound/tree/aa7be415ee34570bd1c834da9d8a500e85401583)）
- **版本日期**：2026-09-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨事件/播放状态收据和短租约、弱语义提示与模块清理，仍不能以API证明用户听到。详见[Q05](#research-q05)。

进一步探讨以结束reason/播放失败/迟到tab/连续事件/初始pending/卸载夹具核弱语义，再测感知与打扰。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 510 | — | — | 5315 |
| .js | source | 2 | 1716 | 1468 | 171 | — |
| .mjs | source | 2 | 1201 | 1084 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AI-Galaxy-GPU/dsh-sound/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AI-Galaxy-GPU/dsh-sound/issues?q=is%3Aissue+created%3A2026-09-22T07%3A07%3A14.733Z..2026-10-22T07%3A07%3A14.733Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AI-Galaxy-GPU/dsh-sound/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A07%3A14.733Z..2026-10-22T07%3A07%3A14.733Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核Web事件到可配置声音，区分分类/重放/跨tab和实际播放、辅助提醒保证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，事件到声音怎样工作？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向离开当前聊天视线、希望在回合结束或审批/提问/计划评审/受阻/失败时听到不同提示的人。输入DSH事件与浏览器配置，输出内置合成或自选音频；成功需事件分类正确且读者实际听到，声音不是业务完成或可靠待办收据。

Host只迟绑定注册settings schema；Client实际用固定localStorage键独立配置，slots设置页。主路径mux及host流，按turn/end reason、requested、job终态和goal投影分类，来源行origin/parentId识别子Agent；quietCurrent只抑制完成，注意类仍响。初开流openBurst抑制requested回放、rpcId去重，坏帧累积可切snapshot diff，流断指数重开。播放按source400ms去抖，BroadcastChannel同key意图40ms随机仲裁；内置WebAudio、IDB blob或dataURL/HTMLAudio回退。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:57-66](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/index.js#L57-L66)

Host settings迟绑定。

<details>
<summary>查看原文（10行）</summary>

```text
})

export function apply(ctx) {
  // settings 服务（dsh-settings-file）在启动时异步加载文档后才可用；
  // 用 ctx.inject 迟绑定：settings 就绪后（或早已就绪时立即）再注册；
  // 完全没有 settings 服务的 profile 中则静默不注册。
  ctx.inject(['settings'], (sctx) => {
    sctx.settings.register('dsh-sound', Config, { applies: 'live' })
  })
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:297-332](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L297-L332)

Client实际配置。

<details>
<summary>查看原文（36行）</summary>

```text
    function readLocal() {
      try {
        var raw = window.localStorage.getItem(LOCAL_KEY)
        return raw ? JSON.parse(raw) : null
      } catch (err) { return null }
    }

    function createConfigStore() {
      var snapshot = { status: 'ready', value: sanitize(readLocal()) }
      var listeners = []
      function commit(next) {
        snapshot = { status: 'ready', value: next }
        try { window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next)) } catch (err) { /* 隐私模式等：仅内存生效 */ }
        var list = listeners.slice()
        for (var i = 0; i < list.length; i++) list[i]()
      }
      return {
        getSnapshot: function () { return snapshot },
        subscribe: function (fn) {
          listeners.push(fn)
          return function () {
            var i = listeners.indexOf(fn)
            if (i >= 0) listeners.splice(i, 1)
          }
        },
        set: function (field, value) {
          var next = {}
          next[field] = value
          return this.patch(next)
        },
        patch: function (partial) {
          commit(sanitize(Object.assign({}, snapshot.value, partial)))
          return Promise.resolve()
        },
        replace: function (next) { commit(sanitize(next)) },
      }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:846-920](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L846-L920)

mux分类/重放。

<details>
<summary>查看原文（75行）</summary>

```text
      function handleFrame(envelope) {
        var frame = unwrapFrame(envelope)
        if (frame === null) {
          badFrames++
          if (badFrames >= BAD_FRAME_FALLBACK && typeof onGiveUp === 'function') {
            if (typeof console !== 'undefined' && console.warn) {
              console.warn('dsh-sound: mux frames have no type after unwrap; falling back to session snapshots')
            }
            onGiveUp()
          }
          return
        }
        badFrames = 0
        reopenDelay = REOPEN_BASE
        var cfg = configOf(store.getSnapshot())
        if (!cfg) return
        pruneDisposed()
        var sid = frame.sessionId

        if (frame.type === 'session/subscribed' || frame.type === 'session/queue') {
          return
        }
        if (frame.type === 'approval/resolved' || frame.type === 'question/resolved') {
          openBurst = false
          if (frame.type === 'question/resolved' && frame.questionRpcId != null) {
            seenRpcIds.delete(String(frame.questionRpcId))
          }
          return
        }
        if (frame.type === 'approval/requested' || frame.type === 'question/requested') {
          var noted = noteRequestId(envelope)
          if (noted.seen || openBurst) return
          var isSub = isSubagentSession(ctx, sid)
          if (frame.type === 'approval/requested') {
            playFor(cfg, 'approval', 'pending:' + sid + ':approval', isSub)
            return
          }
          var kind = resolveQuestionKind(ctx, sid, frame.questions)
          playFor(cfg, kind, 'pending:' + sid + ':' + kind, isSub)
          return
        }
        if (frame.type === 'session/jobs') {
          handleJobs(cfg, sid, frame.jobs || [])
          return
        }

        openBurst = false
        if (frame.type === 'session/event') {
          var ev = frame.event
          var endKind = turnEndKind(ev)
          var isSubEvent = isSubagentSession(ctx, sid)
          if (endKind === 'completed' && !skipCurrentSession(cfg, sid)) {
            playFor(cfg, 'completion', 'session:' + sid, isSubEvent)
          } else if (endKind === 'error') {
            playFor(cfg, 'failure', 'session:' + sid + ':failure', isSubEvent)
          }
        } else if (frame.type === 'session/projection') {
          if (frame.key === 'goal' && frame.value && typeof frame.value === 'object' && typeof frame.value.phase === 'string') {
            var phase = frame.value.phase
            var prev = prevGoalPhase.get(sid)
            if (phase === 'blocked' && prev !== 'blocked') {
              playFor(cfg, 'goal-blocked', 'goal:' + sid, isSubagentSession(ctx, sid))
            }
            prevGoalPhase.set(sid, phase)
          }
        }
      }

      function beginBurst() {
        openBurst = true
        if (burstTimer !== null) cancelSchedule(burstTimer)
        burstTimer = schedule(function () {
          burstTimer = null
          openBurst = false
        }, 0)
```

</details>

**依据 4 · 源码核查**：[lib/client.js:925-958](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L925-L958)

重连/清理。

<details>
<summary>查看原文（34行）</summary>

```text
        var ac = new AbortController()
        loopAbort = ac
        beginBurst()
        var iterable
        try {
          iterable = ctx.connection.api.events.mux({}, ac.signal)
        } catch (err) { scheduleReopen(); return }
        if (!iterable || typeof iterable[Symbol.asyncIterator] !== 'function') { scheduleReopen(); return }
        ;(async function () {
          try {
            for await (var frame of iterable) {
              if (disposed) break
              handleFrame(frame)
            }
          } catch (err) { /* 流中断：连接重连或插件卸载，走重开逻辑 */ }
          scheduleReopen()
        })()
      }

      function scheduleReopen() {
        if (disposed) return
        if (loopAbort) { try { loopAbort.abort() } catch (e) {} loopAbort = null }
        var delay = reopenDelay
        reopenDelay = Math.min(reopenDelay * 2, REOPEN_MAX)
        reopenTimer = schedule(function () { runLoop() }, delay)
      }

      runLoop()
      return function () {
        disposed = true
        if (reopenTimer !== null) cancelSchedule(reopenTimer)
        if (burstTimer !== null) cancelSchedule(burstTimer)
        if (loopAbort) { try { loopAbort.abort() } catch (e) {} }
      }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:696-724](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L696-L724)

路由/跨tab。

<details>
<summary>查看原文（29行）</summary>

```text
    function playFor(cfg, kind, sourceKey, isSubagent) {
      if (!cfg || cfg.enabled === false) return
      if (isSubagent && cfg.ignoreSubagent === true) return
      var sound = soundFor(cfg, kind, isSubagent)
      if (!sound || sound === 'none' || sound === 'local') return
      if (crossTab && sourceKey) {
        playWithCrossTabDedupe(sound, sourceKey, cfg, volFor(cfg, kind, isSubagent))
        return
      }
      playSound(sound, sourceKey, cfg, volFor(cfg, kind, isSubagent))
    }

    /**
     * 多标签页去重：已确认有同伴时先广播「播放意图」，40ms 内同 key 的另一标签
     * 抢先则让位（随机 nonce 决出唯一播放者）。单标签页直接播放，不做握手。
     */
    function playWithCrossTabDedupe(key, sourceKey, cfg, vol) {
      if (!peerSeen) {
        try { crossTab.postMessage({ t: 'intent', key: sourceKey, nonce: Math.random() }) } catch (err) { /* 频道已关 */ }
        playSound(key, sourceKey, cfg, vol)
        return
      }
      var nonce = Math.random()
      var timer = schedule(function () {
        crossTabPending.delete(sourceKey)
        playSound(key, sourceKey, cfg, vol)
      }, 40)
      crossTabPending.set(sourceKey, { nonce: nonce, timer: timer })
      try { crossTab.postMessage({ t: 'intent', key: sourceKey, nonce: nonce }) } catch (err) { /* 频道已关 */ }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:424-454](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L424-L454)

自定义与音频fallback。

<details>
<summary>查看原文（31行）</summary>

```text
    /** 播放 data URL 音频：优先 XHR + decodeAudioData 走 Web Audio（无需每次手势）；失败回退 Audio 元素。 */
    function playCustom(dataUrl, vol) {
      var ctx = ensureContext()
      if (!ctx || typeof ctx.decodeAudioData !== 'function') { fallbackAudio(dataUrl, vol); return }
      var xhr = null
      try {
        xhr = new window.XMLHttpRequest()
        xhr.open('GET', dataUrl, true)
        xhr.responseType = 'arraybuffer'
        xhr.onload = function () {
          if ((xhr.status === 200 || xhr.status === 0) && xhr.response) {
            ctx.decodeAudioData(xhr.response, function (decoded) {
              playBuffer(ctx, decoded, vol)
            }, function () { fallbackAudio(dataUrl, vol) })
          } else {
            fallbackAudio(dataUrl, vol)
          }
        }
        xhr.onerror = function () { fallbackAudio(dataUrl, vol) }
        xhr.send()
      } catch (err) { fallbackAudio(dataUrl, vol) }
    }

    /** 兜底：HTMLAudioElement 播放（可能被自动播放策略拦截）。 */
    function fallbackAudio(dataUrl, vol) {
      try {
        var audio = new window.Audio(dataUrl)
        if (typeof vol === 'number' && vol >= 0 && vol <= 1) audio.volume = vol
        var p = audio.play()
        if (p && p.catch) p.catch(function () {})
      } catch (err) { /* 自动播放被浏览器拦截时静默 */ }
```

</details>

**依据 7 · 源码核查**：[lib/client.js:1111-1135](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L1111-L1135)

流/快照选择。

<details>
<summary>查看原文（25行）</summary>

```text
    function startWatcher(ctx, store) {
      var disposeMux = null
      var disposeHost = null
      var disposeSnap = null
      var gaveUp = false
      function useSnapshot() {
        if (gaveUp) return
        gaveUp = true
        if (disposeMux) { disposeMux(); disposeMux = null }
        if (disposeSnap) return
        disposeSnap = startSnapshotWatcher(ctx, store)
      }
      if (ctx.connection && ctx.connection.api && ctx.connection.api.events && typeof ctx.connection.api.events.mux === 'function') {
        disposeMux = startMuxWatcher(ctx, store, useSnapshot)
        if (typeof ctx.connection.api.events.host === 'function') {
          disposeHost = startHostWatcher(ctx, store)
        }
      } else {
        disposeSnap = startSnapshotWatcher(ctx, store)
      }
      return function () {
        if (disposeMux) disposeMux()
        if (disposeHost) disposeHost()
        if (disposeSnap) disposeSnap()
      }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量与误判、重复和漏响边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

价值是把多种需要注意的事件按类别/来源可配置声音，并为回放、重连、子Agent与多标签干扰提供具体处理，非新通知协议。它不执行审批或替代视觉任务状态。

快照fallback只见running true→false就播放completion，不能区分abort/max-tokens/error；初次pending/blocked也可响，和mux启动回放抑制不同。没有看过running的瞬时完成job在快照可漏，而事件路径可捕捉。两条路径不能统一说所有用户中断静音/所有恢复回放不响。子Agent判定依会话行是否及时出现，缺行默认主频道。README六类子代理默认mute与实际DEFAULTS及Host schema不同，实际只有completion none，注意类ding/bell。

400ms key以session或事件种类而非持久事件ID，既可能压掉同会话紧邻真实事件，也不能永久防重复。跨tab无played持久ack，peer未发现时立即播放、意图晚于40ms或不同到达时间可多响，仲裁者音频失败则其他tab已让位；不能保证恰好一次。playSound先写lastPlayed再异步播放，resume/decode/play失败静默，因此尝试不等实际有声。Host配置不自动成为Client真相，store无storage监听，另一tab设置未即时同步。模块级BroadcastChannel/pending timers/AudioContext/样式未见dispose释放，watcher清理不能概括成全部模块资源清理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1042-1065](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L1042-L1065)

快照无reason及初始pending/goal。

<details>
<summary>查看原文（24行）</summary>

```text
          // 会话回合结束：running true -> false（完成铃声，尊重 quietCurrent）
          var was = prevRunning.get(id)
          if (was === true && row.running === false && !(quietCurrent && snap.current === id)) {
            playFor(cfg, 'completion', 'session:' + id, rowSub)
          }
          prevRunning.set(id, row.running === true)

          // 需要人介入：pendingInteraction 出现（approval / question / plan-review）
          var pi = row.pendingInteraction
          var prevPi = prevPending.get(id)
          if (pi !== undefined && pi !== prevPi) {
            var kind = SOUND_FIELD[pi] ? pi : 'question'
            playFor(cfg, kind, 'pending:' + id + ':' + pi, rowSub)
          }
          prevPending.set(id, pi)

          // 目标受阻：goal 投影进入 blocked
          var pv = row.projectionValues
          var goal = pv && typeof pv === 'object' ? pv.goal : undefined
          var phase = goal && typeof goal === 'object' ? goal.phase : undefined
          var prevPhase = prevGoalPhase.get(id)
          if (phase === 'blocked' && prevPhase !== 'blocked') {
            playFor(cfg, 'goal-blocked', 'goal:' + id, rowSub)
          }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1078-1088](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L1078-L1088)

快照job要前态。

<details>
<summary>查看原文（11行）</summary>

```text
            var key = sid + ':' + job.id
            var prev = prevJobStatus.get(key)
            var terminal = job.status === 'completed' || job.status === 'failed' || job.status === 'killed'
            var isSub = job.kind === 'subagent' || subagentSession
            if ((prev === 'running' || prev === 'stopping') && terminal) {
              if (job.status === 'failed') {
                playFor(cfg, 'failure', 'job:' + key, isSub)
              } else if (job.status === 'killed') {
                /* 用户杀掉的任务不响完成音 */
              } else if (!(quietCurrent && snap.current === sid)) {
                playFor(cfg, 'completion', 'job:' + key, isSub)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:212-224](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L212-L224)

子Agent依行。

<details>
<summary>查看原文（13行）</summary>

```text
    /** 列表行判定：DSH SessionSummary 的 origin/parentId（兼容 parentSessionId 命名）。 */
    function isSubagentRow(row) {
      return !!(row && (row.origin === 'subagent' || row.parentId !== undefined || row.parentSessionId !== undefined))
    }

    /** 事件帧与任务帧的来源判定：会话行已列出且标记为子代理时视为子代理来源。 */
    function isSubagentSession(ctx, sid) {
      if (!ctx || !ctx.sessions || !ctx.sessions.list || !sid) return false
      try {
        var snap = ctx.sessions.list.getSnapshot()
        var row = snap && snap.byId ? snap.byId[sid] : undefined
        return isSubagentRow(row)
      } catch (err) { return false }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:123-134](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L123-L134)

子Agent实际默认。

<details>
<summary>查看原文（12行）</summary>

```text
      subagentCompletionSound: 'none',
      subagentApprovalSound: 'ding',
      subagentQuestionSound: 'ding',
      subagentPlanReviewSound: 'ding',
      subagentGoalBlockedSound: 'bell',
      subagentFailureSound: 'bell',
      subagentCompletionVolume: 1,
      subagentApprovalVolume: 1,
      subagentQuestionVolume: 1,
      subagentPlanReviewVolume: 1,
      subagentGoalBlockedVolume: 1,
      subagentFailureVolume: 1,
```

</details>

**依据 5 · 作者声明**：[README.md:43-54](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/README.md#L43-L54)

作者子Agent默认声明。

<details>
<summary>查看原文（12行）</summary>

```text
- **One-shot subagent jobs** — a `session/jobs` entry with `kind === 'subagent'` (each
  parallel delegation completing used to ring the main completion sound; now it does not).
- **Subagent sessions** — events whose session row is marked `origin: 'subagent'` /
  `parentId` (continuable subagents), including child-session turn ends, approvals,
  questions, goal projections, and failures.

The settings panel adds a **子代理事件 / Subagent Events** section with six rows (same sound
sources and per-row volume as the main events) plus an **ignore all subagent events** master
switch. All six subagent sounds default to **mute**; main-agent events are unchanged.

### Sound sources

```

</details>

**依据 6 · 源码核查**：[lib/client.js:661-674](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L661-L674)

先标后播放。

<details>
<summary>查看原文（14行）</summary>

```text
    function playSound(key, sourceKey, cfg, vol) {
      if (!key || key === 'none' || key === 'local') return
      var volume = typeof vol === 'number' && vol >= 0 && vol <= 1 ? vol : 1
      if (sourceKey) {
        var now = Date.now()
        var last = lastPlayed.get(sourceKey)
        if (last !== undefined && now - last < DEDUPE_MS) return
        lastPlayed.set(sourceKey, now)
      }
      playCount++
      if (playCount % 32 === 0) pruneLastPlayed()
      if (key.indexOf('data:') === 0) playCustom(key, volume)
      else if (key.indexOf('audio:') === 0) playAudioRef(key.slice(6), volume)
      else playBuiltin(key, volume)
```

</details>

**依据 7 · 源码核查**：[lib/client.js:615-644](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L615-L644)

模块频道仲裁。

<details>
<summary>查看原文（30行）</summary>

```text
    /* ---------------- 多标签页去重（BroadcastChannel） ---------------- */
    var crossTab = null
    var peerSeen = false // 只有确认存在另一标签时才做 40ms 握手
    var crossTabPending = new Map() // sourceKey -> { nonce, timer }
    try {
      if (typeof window !== 'undefined' && typeof window.BroadcastChannel === 'function') {
        crossTab = new window.BroadcastChannel('dsh-sound')
        crossTab.onmessage = function (ev) {
          var msg = ev && ev.data
          if (!msg || typeof msg !== 'object') return
          if (msg.t === 'hello') {
            peerSeen = true
            try { crossTab.postMessage({ t: 'hello-ack' }) } catch (err) { /* 频道已关 */ }
            return
          }
          if (msg.t === 'hello-ack') {
            peerSeen = true
            return
          }
          if (msg.t !== 'intent' || typeof msg.key !== 'string') return
          peerSeen = true
          var mine = crossTabPending.get(msg.key)
          // nonce 较大的一方让位：两个标签同时收到对方意图时，恰有一个播放
          if (mine && mine.nonce > msg.nonce) {
            cancelSchedule(mine.timer)
            crossTabPending.delete(msg.key)
          }
        }
        try { crossTab.postMessage({ t: 'hello' }) } catch (err) { /* 频道已关 */ }
      }
```

</details>

**依据 8 · 源码核查**：[lib/client.js:712-724](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L712-L724)

无ack与40ms。

<details>
<summary>查看原文（13行）</summary>

```text
    function playWithCrossTabDedupe(key, sourceKey, cfg, vol) {
      if (!peerSeen) {
        try { crossTab.postMessage({ t: 'intent', key: sourceKey, nonce: Math.random() }) } catch (err) { /* 频道已关 */ }
        playSound(key, sourceKey, cfg, vol)
        return
      }
      var nonce = Math.random()
      var timer = schedule(function () {
        crossTabPending.delete(sourceKey)
        playSound(key, sourceKey, cfg, vol)
      }, 40)
      crossTabPending.set(sourceKey, { nonce: nonce, timer: timer })
      try { crossTab.postMessage({ t: 'intent', key: sourceKey, nonce: nonce }) } catch (err) { /* 频道已关 */ }
```

</details>

**依据 9 · 源码核查**：[lib/client.js:297-332](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L297-L332)

无跨tab设置同步。

<details>
<summary>查看原文（36行）</summary>

```text
    function readLocal() {
      try {
        var raw = window.localStorage.getItem(LOCAL_KEY)
        return raw ? JSON.parse(raw) : null
      } catch (err) { return null }
    }

    function createConfigStore() {
      var snapshot = { status: 'ready', value: sanitize(readLocal()) }
      var listeners = []
      function commit(next) {
        snapshot = { status: 'ready', value: next }
        try { window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next)) } catch (err) { /* 隐私模式等：仅内存生效 */ }
        var list = listeners.slice()
        for (var i = 0; i < list.length; i++) list[i]()
      }
      return {
        getSnapshot: function () { return snapshot },
        subscribe: function (fn) {
          listeners.push(fn)
          return function () {
            var i = listeners.indexOf(fn)
            if (i >= 0) listeners.splice(i, 1)
          }
        },
        set: function (field, value) {
          var next = {}
          next[field] = value
          return this.patch(next)
        },
        patch: function (partial) {
          commit(sanitize(Object.assign({}, snapshot.value, partial)))
          return Promise.resolve()
        },
        replace: function (next) { commit(sanitize(next)) },
      }
```

</details>

**依据 10 · 源码核查**：[lib/client.js:1631-1634](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L1631-L1634)

清理仅watcher。

```text
      var t = ctx.locale.bind(LOCALE_NS)
      var store = createConfigStore()
      var disposeWatcher = startWatcher(ctx, store)
      ctx.effect(function () { return disposeWatcher })
```

#### 缺口

- 浏览器实际输出/自动播放和后台tab调度不由事件消费证明。
  **影响**：不能据响铃尝试推断用户已获知；漏响会影响重要提醒。
  **进一步探讨**：可从可见播放失败状态和本机实际输出设置核对，关键待办始终回原UI。
- 跨标签和重连的恰好一次/不漏语义未成立。
  **影响**：不能作唯一提醒通道或可靠通知队列。
  **进一步探讨**：可用迟到intent、仲裁者播放失败、初始快照和快速连续事件夹具研究，并明确best-effort。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、本地保存和读者步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包@ai-galaxy/dsh-sound0.4.1声明Node>=20和DSH0.1.5兼容记录；Client硬注入slots/sessions/connection/locale，实际API版本仍需固定。Host注释明确settings白名单下Client用localStorage，不能靠Host profile行配置期待浏览器设置同步。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web slots/sessions/connection/locale | Client必需 | 设置页和事件流 | 硬注入版本需匹配；流失败后快照较弱 |
| 浏览器音频权限/可用输出 | 必需 | WebAudio/HTMLAudio播放 | resume/play失败静默，不等已听到 |
| localStorage | 配置可选 | 浏览器固定origin配置键 | 写失败仅内存，不用Host配置替代 |
| IndexedDB/本地音频 | 自定义可选 | Blob和audio引用 | 不可用回dataURL，可受quota/解码限制 |
| BroadcastChannel | 多标签去重可选 | 同origin意图握手 | 无全局持久确认，异步延迟可重复/漏响 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定Web/插件，低音量先内置试听 | 浏览器允许且实际听到，不仅按过播放 |
| 配置 | 明确主/子Agent六类音量/静音 | 子代理并非六类默认全静音，以实际配置为准 |
| 使用 | 受控事件对照原UI，保留视觉提示 | 铃声仅辅助，不作为任务成功/待办可靠队列 |
| 恢复 | 无声/多响查权限、频道和事件路径 | 不因无声重复业务操作，重要待办看原UI |

文件存到同origin IDB，本地不是自动上云；IDB不可用回dataURL并可能进入配置，导出/分享配置需核是否含声音文件内容。换域/浏览器不能假定原引用存在。功能不调用TTS模型，本轮未独立检查所有导出UI/迁移格式。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/package.json#L1-L4)

包版本。

```text
{
  "name": "@ai-galaxy/dsh-sound",
  "version": "0.4.1",
  "description": "DeepSeek Harness plugin: per-event task-completion and attention sounds for turn-end / approval / question / plan-review / goal-blocked / task-failure, each with its own sound (built-in synth, local audio file) and volume, with a separate subagent channel (Web UI)",
```

**依据 2 · 作者声明**：[lib/index.js:1-7](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/index.js#L1-L7)

作者配置通道说明。

```text
/**
 * dsh-sound — Host 半体
 *
 * 注册 `dsh-sound` 设置命名空间（schema 见 Config），为将来平台
 * 开放第三方命名空间暴露机制预留配置通道。当前 rc.6 的 settings API
 * 白名单（dsh-host-apiproxy）不会把该命名空间暴露给浏览器，因此客户端
 * 使用 localStorage 持久化配置；本注册保持无害且兼容未来版本。
```

**依据 3 · 源码核查**：[lib/client.js:1607-1634](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L1607-L1634)

Client依赖/生效。

<details>
<summary>查看原文（28行）</summary>

```text
    var inject = ['slots', 'sessions', 'connection', 'locale']

    function apply(ctx) {
      if (crossTab) {
        try { crossTab.postMessage({ t: 'hello' }) } catch (err) { /* 频道已关 */ }
      }
      ctx.effect(function () {
        var locales = ctx.locale.getLocale().locales
        var hasLocale = function (id) {
          var target = id.toLowerCase()
          return locales.some(function (locale) { return String(locale.id).toLowerCase() === target })
        }
        var disposers = [
          hasLocale('pt-BR') ? function () {} : ctx.locale.addLanguage({ id: 'pt-BR', label: 'Português (Brasil)', fallback: 'en' }),
          hasLocale('es') ? function () {} : ctx.locale.addLanguage({ id: 'es', label: 'Español', fallback: 'en' }),
          ctx.locale.register(LOCALE_NS, 'zh', DICTS.zh),
          ctx.locale.register(LOCALE_NS, 'en', DICTS.en),
          ctx.locale.register(LOCALE_NS, 'pt-BR', DICTS['pt-BR']),
          ctx.locale.register(LOCALE_NS, 'es', DICTS.es),
        ]
        return function () {
          for (var i = disposers.length - 1; i >= 0; i--) disposers[i]()
        }
      }, 'dsh-sound: locale dictionaries')
      var t = ctx.locale.bind(LOCALE_NS)
      var store = createConfigStore()
      var disposeWatcher = startWatcher(ctx, store)
      ctx.effect(function () { return disposeWatcher })
```

</details>

**依据 4 · 源码核查**：[lib/client.js:487-507](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L487-L507)

本地文件/回dataURL。

<details>
<summary>查看原文（21行）</summary>

```text
    /** 保存一个音频文件到 IndexedDB，返回 `audio:<id>` 引用；存储不可用时返回 data URL。 */
    function storeUploaded(file) {
      if (typeof window.indexedDB !== 'undefined') {
        return saveAudio(file).then(function (id) {
          return id ? 'audio:' + id : readAsDataUrl(file)
        })
      }
      return readAsDataUrl(file)
    }

    function saveAudio(file) {
      return audioStore().then(function (db) {
        if (!db) return null
        var id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
        return new Promise(function (resolve) {
          var tx = db.transaction('files', 'readwrite')
          tx.objectStore('files').put({ blob: file, name: (file && typeof file.name === 'string' && file.name) || '' }, id)
          tx.oncomplete = function () { resolve(id) }
          tx.onerror = function () { resolve(null) }
          tx.onabort = function () { resolve(null) }
        })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果如何评价？

**研究主题**：效果与总成本

#### 完整回答

内置合成没有独立网络TTS/模型费用，仍有事件流、状态表、音频解码/播放和浏览器存储。音频按引用cache，换文件/大文件可增加内存/IDB；文件路径没有在已检查存储函数里限制大小/解码成本，不应说任意大文件低开销。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器音频环境，金额未知 | 试听、权限和事件分类核对 | 内置无需外部TTS/API |
| 持续使用 | 事件流/状态图、音频解码/本地存储 | 调噪声/音量和子代理规则 | 提醒可能打扰，不等效率增益 |
| 失败恢复 | 配置/文件重选、权限/重连核查 | 对照原始UI待办，避免漏提醒 | 无播放ack、恢复重放边界不同 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提醒区分 | 六类型/主子Agent路由 | 实际听到率/反应时间改善 |
| 降重复 | 400ms来源去抖/40ms跨tab意图 | 跨tab恰好一次或持久可靠 |
| 兼容降级 | 流重连和快照diff | 结束reason/重放语义等价 |

seenRpcIds页生命周期集合不按会话统一清理，question resolved会删特定ID而approval不见同等删除；长期会话/审批量需关注。quietCurrent减少部分声音但注意类仍响，不代表免打扰；有效性应比较实际漏提醒/误提醒、响应时间与打扰人时，而非播放次数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:487-507](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L487-L507)

音频存储。

<details>
<summary>查看原文（21行）</summary>

```text
    /** 保存一个音频文件到 IndexedDB，返回 `audio:<id>` 引用；存储不可用时返回 data URL。 */
    function storeUploaded(file) {
      if (typeof window.indexedDB !== 'undefined') {
        return saveAudio(file).then(function (id) {
          return id ? 'audio:' + id : readAsDataUrl(file)
        })
      }
      return readAsDataUrl(file)
    }

    function saveAudio(file) {
      return audioStore().then(function (db) {
        if (!db) return null
        var id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
        return new Promise(function (resolve) {
          var tx = db.transaction('files', 'readwrite')
          tx.objectStore('files').put({ blob: file, name: (file && typeof file.name === 'string' && file.name) || '' }, id)
          tx.oncomplete = function () { resolve(id) }
          tx.onerror = function () { resolve(null) }
          tx.onabort = function () { resolve(null) }
        })
```

</details>

**依据 2 · 源码核查**：[lib/client.js:511-527](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L511-L527)

缓存dataURL。

<details>
<summary>查看原文（17行）</summary>

```text
    function loadAudio(id) {
      if (audioCache.has(id)) return Promise.resolve(audioCache.get(id))
      return audioStore().then(function (db) {
        if (!db) return null
        return new Promise(function (resolve) {
          var req = db.transaction('files', 'readonly').objectStore('files').get(id)
          req.onsuccess = function () {
            var blob = blobOf(req.result)
            if (!blob) { resolve(null); return }
            var reader = new window.FileReader()
            reader.onload = function () {
              var url = String(reader.result)
              audioCache.set(id, url)
              resolve(url)
            }
            reader.onerror = function () { resolve(null) }
            reader.readAsDataURL(blob)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:791-826](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L791-L826)

seenRpc集合。

<details>
<summary>查看原文（36行）</summary>

```text
      var seenRpcIds = new Set() // 页生命周期：刷新恢复回放的 requested 与重连同 id 不响
      var openBurst = false // 本轮流打开后、首批握手帧尚未结束
      var badFrames = 0
      var reopenDelay = REOPEN_BASE // 指数退避：成功收到帧即复位

      function skipCurrentSession(cfg, sid) {
        if (!cfg || cfg.quietCurrent !== true) return false
        try {
          var snap = ctx.sessions.list.getSnapshot()
          return snap.current === sid
        } catch (err) { return false }
      }

      /** 清理已销毁会话的状态表（防 session key 无限增长）。 */
      function pruneDisposed() {
        var ids = null
        try {
          var snap = ctx.sessions.list.getSnapshot()
          ids = snap ? snap.ids : null
        } catch (err) { ids = null }
        if (!Array.isArray(ids)) return
        var active = {}
        for (var i = 0; i < ids.length; i++) active[ids[i]] = true
        prevGoalPhase.forEach(function (phase, sid) { if (!active[sid]) prevGoalPhase.delete(sid) })
        prevJobStatus.forEach(function (status, key) {
          var sep = key.indexOf(':')
          if (sep >= 0 && !active[key.slice(0, sep)]) prevJobStatus.delete(key)
        })
      }

      function noteRequestId(envelope) {
        var rid = envelope && envelope.rpcId != null ? String(envelope.rpcId) : ''
        if (!rid) return { seen: false, id: '' }
        if (seenRpcIds.has(rid)) return { seen: true, id: rid }
        seenRpcIds.add(rid)
        return { seen: false, id: rid }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:868-884](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L868-L884)

请求ID/播放。

<details>
<summary>查看原文（17行）</summary>

```text
        if (frame.type === 'approval/resolved' || frame.type === 'question/resolved') {
          openBurst = false
          if (frame.type === 'question/resolved' && frame.questionRpcId != null) {
            seenRpcIds.delete(String(frame.questionRpcId))
          }
          return
        }
        if (frame.type === 'approval/requested' || frame.type === 'question/requested') {
          var noted = noteRequestId(envelope)
          if (noted.seen || openBurst) return
          var isSub = isSubagentSession(ctx, sid)
          if (frame.type === 'approval/requested') {
            playFor(cfg, 'approval', 'pending:' + sid + ':approval', isSub)
            return
          }
          var kind = resolveQuestionKind(ctx, sid, frame.questions)
          playFor(cfg, kind, 'pending:' + sid + ':' + kind, isSub)
```

</details>

**依据 5 · 源码核查**：[lib/client.js:796-801](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L796-L801)

quiet判当前。

```text
      function skipCurrentSession(cfg, sid) {
        if (!cfg || cfg.quietCurrent !== true) return false
        try {
          var snap = ctx.sessions.list.getSnapshot()
          return snap.current === sid
        } catch (err) { return false }
```

#### 缺口

- 无长期资源/漏误提醒率、实际听到率及响应时间对照。
  **影响**：不能承诺减少等待或可靠提醒所有阻塞。
  **进一步探讨**：可用受控事件序列与真实音频设置记录尝试/输出/人工感知及打扰，对比原UI。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程点、播放收据假设与采用建议是什么？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

事件分类/声音源/配置分离、明确子Agent频道、指数重连、AbortController和watcher清理、音量sanitize及IDB避localStorage大音频是可复用点。snapshot是降级而非同语义副本，模块资源/全局仲裁仍需生命周期治理。

可探讨未验证的“事件与播放状态收据”。给源事件稳定ID/结束reason，快照缺reason显示弱提示不冒充完成；跨tab用短租约和播放started/failed状态，失败可让位但不盲重放，明确best-effort而非恰好一次。配置按origin/profile隔离并同步版本，dispose关闭频道/定时器和AudioContext，缓存/文件有上限和清理。代价是额外状态/隐私和浏览器兼容，不可能仅靠API证明用户听到。可用延迟tab、禁用音频、快速两轮、abort/错误、初始pending及卸载重装夹具比较。

推荐trial，可作为辅助通知，先低音量内置试听、核主子频道/quiet和原UI对照，不作唯一审批/故障提醒。继续从fallback结束原因、播放失败可见性、多tab/生命周期和默认文档一致性入手。发现误报完成、漏重要待办、多响打扰或设置不一致时暂停声音并回视觉状态，不能因没有铃声重做业务动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:241-259](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L241-L259)

配置sanitize。

<details>
<summary>查看原文（19行）</summary>

```text
    function sanitize(value) {
      var out = {}
      var f
      out.enabled = CONFIG_DEFAULTS.enabled
      out.quietCurrent = CONFIG_DEFAULTS.quietCurrent
      out.ignoreSubagent = CONFIG_DEFAULTS.ignoreSubagent
      var fields = ['completionSound', 'approvalSound', 'questionSound', 'planReviewSound', 'goalBlockedSound', 'failureSound']
      var vols = ['completionVolume', 'approvalVolume', 'questionVolume', 'planReviewVolume', 'goalBlockedVolume', 'failureVolume']
      var subFields = ['subagentCompletionSound', 'subagentApprovalSound', 'subagentQuestionSound', 'subagentPlanReviewSound', 'subagentGoalBlockedSound', 'subagentFailureSound']
      var subVols = ['subagentCompletionVolume', 'subagentApprovalVolume', 'subagentQuestionVolume', 'subagentPlanReviewVolume', 'subagentGoalBlockedVolume', 'subagentFailureVolume']
      for (f = 0; f < fields.length; f++) out[fields[f]] = CONFIG_DEFAULTS[fields[f]]
      for (f = 0; f < vols.length; f++) out[vols[f]] = CONFIG_DEFAULTS[vols[f]]
      for (f = 0; f < subFields.length; f++) out[subFields[f]] = CONFIG_DEFAULTS[subFields[f]]
      for (f = 0; f < subVols.length; f++) out[subVols[f]] = CONFIG_DEFAULTS[subVols[f]]
      out.localFiles = {}
      if (value && typeof value === 'object') {
        if (typeof value.enabled === 'boolean') out.enabled = value.enabled
        if (typeof value.quietCurrent === 'boolean') out.quietCurrent = value.quietCurrent
        if (typeof value.ignoreSubagent === 'boolean') out.ignoreSubagent = value.ignoreSubagent
```

</details>

**依据 2 · 源码核查**：[lib/client.js:925-958](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L925-L958)

重连/清理。

<details>
<summary>查看原文（34行）</summary>

```text
        var ac = new AbortController()
        loopAbort = ac
        beginBurst()
        var iterable
        try {
          iterable = ctx.connection.api.events.mux({}, ac.signal)
        } catch (err) { scheduleReopen(); return }
        if (!iterable || typeof iterable[Symbol.asyncIterator] !== 'function') { scheduleReopen(); return }
        ;(async function () {
          try {
            for await (var frame of iterable) {
              if (disposed) break
              handleFrame(frame)
            }
          } catch (err) { /* 流中断：连接重连或插件卸载，走重开逻辑 */ }
          scheduleReopen()
        })()
      }

      function scheduleReopen() {
        if (disposed) return
        if (loopAbort) { try { loopAbort.abort() } catch (e) {} loopAbort = null }
        var delay = reopenDelay
        reopenDelay = Math.min(reopenDelay * 2, REOPEN_MAX)
        reopenTimer = schedule(function () { runLoop() }, delay)
      }

      runLoop()
      return function () {
        disposed = true
        if (reopenTimer !== null) cancelSchedule(reopenTimer)
        if (burstTimer !== null) cancelSchedule(burstTimer)
        if (loopAbort) { try { loopAbort.abort() } catch (e) {} }
      }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1042-1065](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L1042-L1065)

弱语义起点。

<details>
<summary>查看原文（24行）</summary>

```text
          // 会话回合结束：running true -> false（完成铃声，尊重 quietCurrent）
          var was = prevRunning.get(id)
          if (was === true && row.running === false && !(quietCurrent && snap.current === id)) {
            playFor(cfg, 'completion', 'session:' + id, rowSub)
          }
          prevRunning.set(id, row.running === true)

          // 需要人介入：pendingInteraction 出现（approval / question / plan-review）
          var pi = row.pendingInteraction
          var prevPi = prevPending.get(id)
          if (pi !== undefined && pi !== prevPi) {
            var kind = SOUND_FIELD[pi] ? pi : 'question'
            playFor(cfg, kind, 'pending:' + id + ':' + pi, rowSub)
          }
          prevPending.set(id, pi)

          // 目标受阻：goal 投影进入 blocked
          var pv = row.projectionValues
          var goal = pv && typeof pv === 'object' ? pv.goal : undefined
          var phase = goal && typeof goal === 'object' ? goal.phase : undefined
          var prevPhase = prevGoalPhase.get(id)
          if (phase === 'blocked' && prevPhase !== 'blocked') {
            playFor(cfg, 'goal-blocked', 'goal:' + id, rowSub)
          }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:661-674](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L661-L674)

播放收据起点。

<details>
<summary>查看原文（14行）</summary>

```text
    function playSound(key, sourceKey, cfg, vol) {
      if (!key || key === 'none' || key === 'local') return
      var volume = typeof vol === 'number' && vol >= 0 && vol <= 1 ? vol : 1
      if (sourceKey) {
        var now = Date.now()
        var last = lastPlayed.get(sourceKey)
        if (last !== undefined && now - last < DEDUPE_MS) return
        lastPlayed.set(sourceKey, now)
      }
      playCount++
      if (playCount % 32 === 0) pruneLastPlayed()
      if (key.indexOf('data:') === 0) playCustom(key, volume)
      else if (key.indexOf('audio:') === 0) playAudioRef(key.slice(6), volume)
      else playBuiltin(key, volume)
```

</details>

**依据 5 · 源码核查**：[lib/client.js:712-724](https://github.com/AI-Galaxy-GPU/dsh-sound/blob/aa7be415ee34570bd1c834da9d8a500e85401583/lib/client.js#L712-L724)

仲裁租约假设。

<details>
<summary>查看原文（13行）</summary>

```text
    function playWithCrossTabDedupe(key, sourceKey, cfg, vol) {
      if (!peerSeen) {
        try { crossTab.postMessage({ t: 'intent', key: sourceKey, nonce: Math.random() }) } catch (err) { /* 频道已关 */ }
        playSound(key, sourceKey, cfg, vol)
        return
      }
      var nonce = Math.random()
      var timer = schedule(function () {
        crossTabPending.delete(sourceKey)
        playSound(key, sourceKey, cfg, vol)
      }, 40)
      crossTabPending.set(sourceKey, { nonce: nonce, timer: timer })
      try { crossTab.postMessage({ t: 'intent', key: sourceKey, nonce: nonce }) } catch (err) { /* 频道已关 */ }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
