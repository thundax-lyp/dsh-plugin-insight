# dsh-boot-animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[24c7112](https://github.com/NativeDog1/dsh-boot-animation/tree/24c711296cb4af2618fef4f65e81346a660fc67b)

<!-- BEGIN META -->
[![GitHub ★ 361](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=361&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NativeDog1/dsh-boot-animation) [![npm 30d 8,234](https://img.shields.io/static/v1?label=npm+30d&message=8%2C234&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-animation) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-animation)
<!-- END META -->

> **功能**：为 DSH 窗口播放可跳过的启动短片，支持片库选择、随机播放和会话固定片头。

> **亮点**：片源选择、字节提供与播放规则分层，支持全局与会话覆盖和故障诊断；比手动开视频多了宿主时序集成，审美收益未验证。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：25秒guard按effect总时长关闭，不随正常播放进度重置，长片也可能被截；8秒设置未知时按默认播放，不能严格保持尚未读取的关闭偏好。源码条件未在浏览器复现，试用只覆盖短片。见[Q03](#research-q03)。

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
  - [Q01 · 解决谁的什么体验任务，真正播放范围是什么？](#detail-section-11)
  - [Q02 · 片源如何选择、缓存与提供？](#detail-section-12)
  - [Q03 · 自动播放、超时和记录何时使承诺失效？](#detail-section-13)
  - [Q04 · 启动与退出需要什么投入，何时值得尝试？](#detail-section-14)
  - [Q05 · 可借鉴何处，能提出什么可证伪假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢启动仪式感的本地 DSH Web 用户，可用可跳过短片定制界面；这是审美体验而不是任务效率工具。见[Q01](#research-q01)。

基线是无片头或手动视频；插件减少自动播放接线，但会占视口和等待时间。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 启动/新会话片头 | 自动显示短视频 | 实际依浏览器Storage，非OS启动检测 |
| 会话固定片头 | 每次进入固定会话重播 | 优先于启动开关；需会话身份 |
| 全局与随机片源 | 管理内嵌和用户视频 | 随机不是个性化推荐，编码仍需浏览器支持 |
| 跳过与Esc退出 | 恢复原工作界面 | 需核对实际层级和键盘事件 |
| fit模式 | 裁剪铺满或完整留边 | cover可能裁掉字幕 |
| 媒体Range服务 | 按片读取和缓存 | 不保证faststart、解码或长片完整 |

**流程与依赖**

需Host路由、客户端slots/uiSession与可解码短片，存储负责选择和播放记忆；条件表见[Q04](#research-q04)。

先选短片再试首帧、结束和跳过，遇遮挡或偏好丢失停用；完整步骤见[Q04](#research-q04)。

**效果与成本**

素材、解码、排查与每次等待都要计入，金额与耗时未知；分阶段成本见[Q04](#research-q04)。

有按规则定制和退出机制，审美及使用效率未测；效果表见[Q04](#research-q04)。

> **思考**：25秒guard按effect总时长关闭，不随正常播放进度重置，长片也可能被截；8秒设置未知时按默认播放，不能严格保持尚未读取的关闭偏好。源码条件未在浏览器复现，试用只覆盖短片。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：片源选择、字节提供与播放规则分层，支持全局与会话覆盖和故障诊断；比手动开视频多了宿主时序集成，审美收益未验证。见[Q01](#research-q01)、[Q02](#research-q02)。

ClipId及各片URL、纯规则与副作用分离值得借鉴；绝对计时、设置未知默认播和非原子写入退路要纳入边界。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

25秒guard按effect总时长关闭，不随正常播放进度重置，长片也可能被截；8秒设置未知时按默认播放，不能严格保持尚未读取的关闭偏好。源码条件未在浏览器复现，试用只覆盖短片。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地单用户可先选明显短于25秒的已知可播素材，核对首帧、结束、Esc与关闭偏好。遮挡工作、正常短片误关或总在跳过时停用，回无片头界面。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查片源、HTTP、规则和退出源码；真实宿主渲染未验证。可在本地短片范围试用，不保证长片完整或精确识别每次应用进程启动。

- 已检查：作者 README、包清单、源码路径 package.json、lib/index.js、lib/host/index.js、src/host/index.js、src/host/clip-resolver.js、src/host/selection-store.js、src/host/media-server.js、src/client/index.ts、src/client/session.ts、src/client/store.ts、src/client/ui.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本定向阅读host源与对应lib入口、selection/resolver/media、客户端规则/store/ui；host入口src与lib逐字一致，未重新构建客户端或运行验证脚本，不把源码当实播验收。
- 下一步：后续在目标宿主用短片、30秒正常片、不可解码片和延迟设置核对播放及退出；比较实际打断、偏好与误关闭。

**分析版本**

- **仓库**：[NativeDog1/dsh-boot-animation](https://github.com/NativeDog1/dsh-boot-animation)
- **版本号**：0.4.4（[固定提交 24c7112](https://github.com/NativeDog1/dsh-boot-animation/tree/24c711296cb4af2618fef4f65e81346a660fc67b)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是按首帧和进度区分状态，以无进度时长守护播放并在设置未知时先不播，可减少误关和意外播放；用正常/故障素材对照误关、最长遮挡和偏好违背，复杂度不值则保留短片范围。见[Q05](#research-q05)。

后续在目标宿主用短片、30秒正常片、不可解码片和延迟设置核对播放及退出；比较实际打断、偏好与误关闭。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1689 | — | — | 22909 |
| .js | source | 22 | 5956 | 3757 | 1950 | — |
| .mjs | source | 29 | 5277 | 3996 | 894 | — |
| .ts | source | 7 | 2150 | 1387 | 626 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/NativeDog1/dsh-boot-animation/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：启动及会话片头如何播放、退出，其自定义素材与偏好边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 解决谁的什么体验任务，真正播放范围是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是 DSH 的原生 Web bundle，在 shell.overlay 挂载片头，侧栏提供图钉和片库。目标是喜欢启动仪式感或想为某会话固定短片的用户；合格结果是按规则出现、可跳过、关闭后恢复原界面，而不是更快进入工作或改善模型任务。基线是没有片头，或者用户手动打开视频。

具体增量是把启动/会话进入规则与持久片源选择连起来。decidePlay 优先处理已钉住会话的进入；否则按 playOnAppStart 决定本次启动一次或新空白会话一次。关闭“启动播放”并非关闭所有自动片头，而是恢复新会话规则；固定会话仍优先。需要完全不播者应取消图钉并停用插件，不能只凭一个开关推断全部播放被禁用。

“本次启动”在客户端通过 sessionStorage 的 BOOT_KEY 与内存 fallback 记录，实际边界是浏览器 tab/session 的存活，不是检测操作系统应用进程。页面刷新可能保留记录，新 tab 又可能有不同记录；由此不能写成精确识别所有 DSH 进程启动。覆盖层在 DSH 视口中播放，不能保证覆盖系统任务栏、原生窗口按钮或更高层级的其他插件。体验价值由用户审美和容忍中断决定，未有本轮用户收益数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:82-103](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/index.ts#L82-L103)

真实overlay和侧栏挂载。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const wire = (ready: ClientContext): void => {
    const sessionStore = storeOf(ready)
    const store = new ClientStore()
    log('services ready', { hasUiSession: ready.uiSession !== undefined, hasStore: sessionStore !== null })

    const register = (): void => {
      // Slot names are inlined on purpose: the injector's pre-flight check reads
      // register() calls statically and cannot follow a constant.
      ready.slots.inject('shell.overlay', () =>
        ready.slots.register({ name: 'shell.overlay', id: 'dsh-boot-animation', order: 900 }, () =>
          h(AppRoot, { store, sessionStore }),
        ),
      )
      ready.slots.inject('sidebar.footer.action', () =>
        ready.slots.register(
          { name: 'sidebar.footer.action', id: 'dsh-boot-animation-pin', order: 40, label: () => '片头动画' },
          () => h(PinAction, { store, sessionStore, onOpen: () => openLibrary() }) as ReactElement,
        ),
      )
    }

```

</details>

**依据 2 · 源码核查**：[src/client/session.ts:337-364](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/session.ts#L337-L364)

规则优先级与关闭启动后的新会话路径。

<details>
<summary>查看原文（28行）</summary>

```text
export function decidePlay(input: PlayDecisionInput): PlayDecision {
  // 1. PINNED. Needs a conversation AND a fresh entry into it. Checked before the
  //    settings gate because a pin is explicit user intent.
  if (input.sessionId !== null && input.pinned !== null && input.pinned === input.sessionId) {
    if (!input.entered) return { action: 'none', reason: 'already in the pinned conversation' }
    return { action: 'play', reason: 'pinned' }
  }

  if (!input.settingsLoaded) return { action: 'none', reason: 'settings not loaded yet' }

  // 2. APP-START. Deliberately does NOT need a conversation (0.4.3).
  //
  //    Up to 0.4.2 the first line of this function was "no sessionId -> no play",
  //    which made the boot animation depend on the conversation binding settling
  //    first. On a launch that opens to the workspace/session list, or whose
  //    ui-session binding is slow, the rule answered "no conversation yet" — and
  //    because the effect only re-runs when one of its inputs changes, the intro
  //    could be skipped for the whole launch. That is one of the "有时候就是不出现"
  //    reports: a boot animation is a property of the LAUNCH, not of a conversation.
  if (input.settings.playOnAppStart) {
    return input.bootPlayed ? { action: 'none', reason: 'this launch already played' } : { action: 'play', reason: 'app-start' }
  }

  // 3. NEW CONVERSATION. The original rule, which IS about a conversation.
  if (input.sessionId === null) return { action: 'none', reason: 'no conversation yet' }
  if (!input.isNewConversation) return { action: 'none', reason: 'not a new conversation' }
  if (input.sessionPlayed) return { action: 'none', reason: 'this conversation already played' }
  return { action: 'play', reason: 'new-conversation' }
```

</details>

**依据 3 · 源码核查**：[src/client/session.ts:253-268](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/session.ts#L253-L268)

启动标记读写sessionStorage与内存。

<details>
<summary>查看原文（16行）</summary>

```text
  return readSeen().includes(sessionId)
}

export function markPlayed(sessionId: string): void {
  const seen = readSeen()
  if (!seen.includes(sessionId)) seen.push(sessionId)
  while (seen.length > MAX_SEEN) seen.shift()
  if (!setItem('local', SEEN_KEY, JSON.stringify(seen))) seenInMemory = seen
}

/** Has the intro already played in THIS launch of the DSH GUI? */
export function hasBootPlayed(): boolean {
  const raw = getItem('session', BOOT_KEY)
  if (raw === null) return bootPlayedInMemory
  return raw !== '' && raw !== '0'
}
```

</details>

#### 缺口

- 缺少目标用户仪式感与打断程度反馈
  **影响**：不能声称提高使用体验或留存
  **进一步探讨**：在相似启动任务中比较用户是否继续开启和等待/跳过负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 片源如何选择、缓存与提供？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 只需 webServer，构建时把模块复制到 lib，实际 main 再导出 lib/host/index.js。当前 src/host/index.js 与对应 lib 文件已逐字比较一致。Host 注册 resolve、videos、select、status 和 media 路由；客户端先解析活动 ClipId，再播放每片独立媒体URL，而非一直复用同一个 boot.mp4 资源身份。这种结构可避免换片后旧缓存片段混入新片。

ClipResolver 按会话固定片段、随机模式、全局选中、环境路径、旧 intro、用户片库、内嵌片依序回退。被删除的选择不会让解析直接失败，而是记诊断并继续全局链；随机选择也不等于个性化推荐，只从当前片库选择。内嵌资源能提供文件存在的退路，仍不能保证浏览器支持该视频编码。

selection.json 存选择与设置，不把媒体绝对路径当ClipId；会话覆盖上限200，坏文件归默认并尝试修复。写入通常使用同目录tmp+rename，rename失败时退回直接写目标，因此不能笼统保证所有落盘都原子。客户端local/session Storage还另保留图钉和播放记忆，其作用域与Host持久选择不同。迁移或换来源时需要区分二者。

MediaServer 支持单Range、后缀Range、HEAD与条件缓存，非法范围返回416，文件媒体按需读流。缓存和按片URL有工程价值，但faststart、编码、文件大小与实际首帧仍由素材及浏览器决定，源码可定位HTTP接线不等于视频已经实播成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-7](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/lib/index.js#L1-L7)

分发入口导出实际host模块。

```text
/**
 * Generated by scripts/build.mjs. Do not edit — edit src/host/index.js.
 *
 * The host half lives in ./host/ so that each collaborator is its own module;
 * this file exists because `main` and the `exports` map point at lib/index.js.
 */
export { apply, name, inject } from './host/index.js'
```

**依据 2 · 源码核查**：[src/host/index.js:48-70](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/index.js#L48-L70)

服务注入和路由定义。

<details>
<summary>查看原文（23行）</summary>

```text
export const name = 'dsh-boot-animation'

/** The webserver routes are the only host service this plugin needs. */
export const inject = ['webServer']

const HERE = dirname(fileURLToPath(import.meta.url))
/** lib/host/index.js -> package root */
const PKG_ROOT = join(HERE, '..', '..')

const BASE_ROUTE = '/dsh-boot-animation'
const ROUTE = BASE_ROUTE + '/boot.mp4'
/**
 * NO trailing slash. The webserver matches a prefix route with
 *   pathname !== prefix && !pathname.startsWith(prefix + '/')
 * so a registered path of `.../media/` would be tested as `.../media//` and
 * never match a real `.../media/<id>` request — every media URL 404s.
 */
const MEDIA_ROUTE = BASE_ROUTE + '/media'
const LIST_ROUTE = BASE_ROUTE + '/videos.json'
const SELECT_ROUTE = BASE_ROUTE + '/select'
const STATUS_ROUTE = BASE_ROUTE + '/status.json'
const RESOLVE_ROUTE = BASE_ROUTE + '/resolve.json'
const DATA_MODULE = '../clips.data.js'
```

</details>

**依据 3 · 源码核查**：[src/host/clip-resolver.js:100-152](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/clip-resolver.js#L100-L152)

片源回退链。

<details>
<summary>查看原文（53行）</summary>

```text
   * @returns {{ clip: import('./clip-registry.js').Clip | null, how: string }}
   */
  resolveActive(sessionId = null) {
    const clips = this.registry.list()

    // 1. The per-conversation pin, the most specific instruction there is. It
    // outranks random playback on purpose: pinning a conversation to a clip and
    // then being handed a random one is not what pinning means.
    const pinned = this.conversationPick(sessionId)
    if (pinned !== null) {
      this.diagnostics?.event('active-conversation', { id: pinned.id })
      return { clip: pinned, how: 'conversation' }
    }

    // 2. Random playback wins over a stored selection: it is an explicit mode, and
    // the stored selection is only what it falls back to when switched off.
    if (this.selection.read().randomPlayback) {
      const pool = clips.filter((clip) => clip.bytes > 0)
      const chosen = this.random.pick(pool)
      if (chosen !== null) {
        this.diagnostics?.event('active-random', { id: chosen.id, pool: pool.length })
        return { clip: chosen, how: 'random' }
      }
    }

    const picked = this.selection.read().selectedClipId
    if (picked !== null) {
      // A deleted pick is not an error: fall through rather than show nothing.
      const hit = this.registry.get(picked)
      if (hit !== null) return { clip: hit, how: 'selected' }
      this.diagnostics?.event('selection-stale', { id: picked })
    }

    const envClip = this.#envClip()
    if (envClip !== null) return { clip: envClip, how: 'env' }

    const legacyDropIn = clips.find((clip) => clip.source === 'yours' && clip.legacy)
    if (legacyDropIn !== undefined) return { clip: legacyDropIn, how: 'legacy-dropin' }

    const yours = clips.find((clip) => clip.source === 'yours')
    if (yours !== undefined) return { clip: yours, how: 'library' }

    // Nothing of the user's: a built-in. Embedded, so this cannot come up empty,
    // which is the whole point of embedding them.
    const embedded = clips.find((clip) => clip.source === 'embedded')
    if (embedded !== undefined) return { clip: embedded, how: 'embedded' }

    return { clip: null, how: 'none' }
  }

  /**
   * The DSH_BOOT_ANIMATION clip, adopted into the registry when it points
   * outside the managed directories so it is listed like any other clip.
```

</details>

**依据 4 · 源码核查**：[src/host/selection-store.js:58-73](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/selection-store.js#L58-L73)

默认播放和会话上限。

<details>
<summary>查看原文（16行）</summary>

```text
export const DEFAULT_PLAY_ON_APP_START = true

/**
 * How many per-conversation pins are kept.
 *
 * A cap exists because the key is a session id the plugin does not mint: a bug
 * or a hostile client could otherwise grow a settings file without bound. The
 * oldest key is evicted first (object key order is insertion order, and setting
 * a key again moves it to the end), so what is dropped is the least recently
 * *used* conversation rather than an arbitrary one.
 */
export const MAX_CONVERSATION_OVERRIDES = 200
const MAX_SESSION_ID_LENGTH = 200

/**
 * A session id as this store will accept it as a map key.
```

</details>

**依据 5 · 源码核查**：[src/host/selection-store.js:408-418](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/selection-store.js#L408-L418)

rename失败回直接写。

<details>
<summary>查看原文（11行）</summary>

```text
  #write(selection) {
    mkdirSync(dirname(this.file), { recursive: true })
    const payload = JSON.stringify(selection, null, 2) + '\n'
    const tmp = this.file + '.tmp'
    writeFileSync(tmp, payload, 'utf8')
    try {
      renameSync(tmp, this.file)
    } catch {
      writeFileSync(this.file, payload, 'utf8')
    }
  }
```

</details>

**依据 6 · 源码核查**：[src/host/media-server.js:204-243](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/media-server.js#L204-L243)

Range校验及部分响应。

<details>
<summary>查看原文（40行）</summary>

```text
      const range = req.headers.range
      if (typeof range === 'string') {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim())
        if (match !== null) {
          const rawStart = match[1]
          const rawEnd = match[2]
          let start = rawStart === '' ? undefined : Number(rawStart)
          let end = rawEnd === '' ? undefined : Number(rawEnd)
          if (start === undefined && end !== undefined) {
            // Suffix form: last N bytes.
            start = Math.max(0, size - end)
            end = size - 1
          }
          if (start !== undefined && end === undefined) end = size - 1
          const valid =
            start !== undefined &&
            end !== undefined &&
            Number.isFinite(start) &&
            Number.isFinite(end) &&
            start <= end &&
            start < size
          if (!valid) {
            res.writeHead(416, { 'content-range': 'bytes */' + String(size), 'cache-control': 'no-store' })
            res.end()
            return
          }
          end = Math.min(end, size - 1)
          res.writeHead(206, {
            ...validators,
            'content-type': CONTENT_TYPE,
            'content-length': String(end - start + 1),
            'content-range': 'bytes ' + String(start) + '-' + String(end) + '/' + String(size),
            'accept-ranges': 'bytes',
            'cache-control': cacheControl,
          })
          if (req.method === 'HEAD') {
            res.end()
            return
          }
          await sendBody(start, end)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动播放、超时和记录何时使承诺失效？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

播放开始先静音，play Promise 拒绝时显示需要点击的状态；按Esc或跳过可退出。卸载时移除playing监听、清定时器并releaseVideo，避免DOM移除后媒体继续占用。用户手势后可打开声音和请求真全屏；它不是绕过浏览器自动播放策略。

最影响自定义素材的是25秒 guard。它在视频effect启动后设置，onPlaying只更新phase和诊断，没有清除或按播放进度重置guard；依赖变化或卸载才清。因此即使短时加载后一直正常播放，超过这段effect寿命仍会被close，并记录stalled。这个限制并不只针对“连续25秒没帧”，长片可能被正常播放中的定时器截断。是固定源码可确认的计时条件，未在浏览器实际复现。本次建议只覆盖明显短于25秒的片头，不能推广到长片完整播放。

播放规则的记账在store.playMode返回started后执行，代码已经避免解析失败就消耗启动机会；但started代表媒体目标已指定，不代表playing事件、首帧或ended完成。若URL已设置但解码失败或浏览器一直拒播，启动标记仍可能被消费，用户需手动重试/预览，不应把标记当成功播放统计。

设置读取也有可用性取舍。8秒未拿到Host设置会把settingsLoaded置真，按客户端当前默认值决定播放；如果真实持久值是关闭启动播放但尚未读到，客户端无法知道，可能先按默认启动规则播放。它有诊断而非无界卡住，但对“不出现片头”这一偏好的保持不严格。需要立即进入工作或对动画敏感的人不应依赖此机制作为不可打断的界面。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/ui.ts:182-237](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/ui.ts#L182-L237)

播放、playing处理、绝对25s guard和卸载清理。

<details>
<summary>查看原文（56行）</summary>

```text
    if (url === null) return undefined
    const video = videoRef.current
    if (video === null) return undefined
    closedRef.current = false
    setNeedsTap(false)
    setLeaving(false)
    video.muted = true

    const startedAt = performance.now()
    /** One line carrying everything a black-frame report needs. */
    const report = (label: string): void =>
      notify(label, {
        ms: Math.round(performance.now() - startedAt),
        clipId,
        reason,
        readyState: video.readyState,
        networkState: video.networkState,
        src: video.currentSrc || video.src,
      })

    const onPlaying = (): void => {
      store.setPhase('playing')
      report('first frame painted')
    }
    video.addEventListener('playing', onPlaying)

    // Point the element at THIS clip's resource and force a fresh load. The URL
    // names one clip, so the previous clip's cached ranges cannot be spliced in.
    video.src = url
    video.load()
    const attempt = video.play()
    if (attempt !== undefined && typeof attempt.then === 'function') {
      attempt.then(() => log('play started', { clipId })).catch((error: unknown) => {
        log('play rejected', String(error))
        setNeedsTap(true)
      })
    }

    const guard = window.setTimeout(() => {
      if (!closedRef.current) {
        // Report BEFORE closing: a silent close leaves nothing to diagnose.
        store.setPhase('stalled', '视频加载超时')
        report('stalled, giving up after ' + String(STALL_TIMEOUT_MS) + 'ms')
        close()
      }
    }, STALL_TIMEOUT_MS)

    return () => {
      video.removeEventListener('playing', onPlaying)
      window.clearTimeout(guard)
      // Unmount is another way the overlay disappears (HMR, plugin disable,
      // slot remount). Detaching a <video> does not stop media by itself.
      releaseVideo(video)
    }
  }, [url, nonce, clipId, reason, store, close])

```

</details>

**依据 2 · 源码核查**：[src/client/ui.ts:246-253](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/ui.ts#L246-L253)

Esc退出。

```text
  useEffect(() => {
    if (url === null) return undefined
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
```

**依据 3 · 源码核查**：[src/client/ui.ts:744-759](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/ui.ts#L744-L759)

started后才记录，但不等待首帧完成。

<details>
<summary>查看原文（16行）</summary>

```text
    if (inFlightRef.current) return

    inFlightRef.current = true
    log('playing the intro', { reason: decision.reason, sessionId, attempt })
    void (async () => {
      const started = await store.playMode('active', decision.reason)
      inFlightRef.current = false
      if (started) {
        // Record only AFTER a clip is actually pointed at. Writing the launch
        // record first is how one failed resolve (or an empty catalog during
        // boot) consumed the intro for the rest of the launch: nothing played,
        // and nothing would try again either.
        recordDecision(decision, sessionId)
        triesRef.current = 0
        return
      }
```

</details>

**依据 4 · 源码核查**：[src/client/store.ts:317-328](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/store.ts#L317-L328)

设置超时沿用默认值。

<details>
<summary>查看原文（12行）</summary>

```text
   *
   * Called on a timer by AppRoot while `settingsLoaded` is still false. Keeps the
   * current settings (the host's defaults) rather than inventing a rule, flips the
   * gate, and leaves one line in the diagnostic log. Idempotent, and a no-op when
   * the payload did arrive or the fallback already ran.
   */
  markSettingsFallback(why: string): void {
    if (this.#snapshot.settingsLoaded || this.#fallbackDecided) return
    this.#fallbackDecided = true
    notify('settings never arrived — deciding with defaults', { why })
    this.#set({ settingsLoaded: true, loading: false })
  }
```

</details>

**依据 5 · 源码核查**：[src/client/ui.ts:705-715](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/ui.ts#L705-L715)

8秒设置fallback触发。

<details>
<summary>查看原文（11行）</summary>

```text
   * "nothing happened and nothing said so".
   */
  useEffect(() => {
    if (snapshot.settingsLoaded) return undefined
    const timer = window.setTimeout(() => {
      store.markSettingsFallback(`no answer from the host within ${String(SETTINGS_FALLBACK_MS)}ms`)
    }, SETTINGS_FALLBACK_MS)
    return () => {
      window.clearTimeout(timer)
    }
  }, [snapshot.settingsLoaded, store])
```

</details>

#### 缺口

- 25秒截断及设置丢失时偏好覆盖未做浏览器复现
  **影响**：能给触发条件，不能报告已观测用户损害
  **进一步探讨**：用30秒正常视频及延迟设置响应对照，记录首帧、关闭时刻和是否尊重关闭偏好。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动与退出需要什么投入，何时值得尝试？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可以给本地单用户、明确喜欢短片启动效果的人有限试用建议，限定短于25秒且已知浏览器可解码的素材。它是视觉定制，可随时跳过或停用；素材、开关、缓存仍需核对。它不会加速宿主准备任务，反而主动占用视口与等待时间，收益应按个人偏好而非生产效率判断。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH Web与webServer | Host必需 | 提供片库和媒体 | 路由不可用，设置读取失败 |
| slots、uiSession和宿主React运行时 | 客户端必需 | 挂载覆盖层并判断会话 | 动态等待；缺服务保持idle |
| 浏览器支持的短视频 | 播放必需 | 实际解码 | 黑屏、点击播放或超时退出 |
| 可写boot-animation目录 | 持久选择必需 | 保存全局与会话配置 | 写失败显示错误或回退 |
| 浏览器Storage | 记播放/图钉时使用 | 区分tab启动和会话 | 不可用退内存，不能跨重启记忆 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选短片并备份选择文件 | 了解25秒限制和cover裁剪 |
| 加载 | 宿主加载bundle并重启客户端 | 片库、图钉、覆盖层接线可见 |
| 选择 | 用户选全局/会话片源或随机 | 用解析诊断核对实际ClipId |
| 试播 | 用户核对首帧、结束、Esc和跳过 | 不挡必要控件，能及时退出 |
| 退出 | 用户取消图钉并停用插件 | 不再自动挂片头，按需保留媒体和配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 视频存储与解码资源，量未知 | 安装、重启、选片与编码排查 | 无额外模型调用 |
| 持续使用 | 每次媒体加载和解码，量未知 | 等待或跳过片头 | 启动时间增加量未测 |
| 失败恢复 | 重新加载/转码资源未知 | 核对编码、缓存和默认值 | 25秒guard可截正常长片 |
| 升级退出 | 配置和素材迁移量未知 | 停插件并清本地播放记录 | 停用不自动删用户视频 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 启动定制 | tab记账与规则决策 | 所有桌面启动形态是否一致 |
| 会话定制 | 覆盖选择优先和图钉重播 | 真实宿主会话绑定兼容 |
| 失败退出 | Esc、跳过、guard和资源清理 | 多插件叠层与长期稳定性 |
| 体验收益 | 有可配置视觉入口 | 审美、打断与愿意持续开启 |

如果正常短片仍被截断、关闭偏好没有保持、遮挡工作或每次跳过更费事，就停用并回无片头界面；不建议在共享或公网宿主直接开放选片写面，其访问控制依赖宿主，本轮未验证隔离。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-46](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/package.json#L38-L46)

Node与React声明。

```text
    "node": ">=20"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    }
```

**依据 2 · 源码核查**：[src/client/index.ts:105-118](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/index.ts#L105-L118)

动态服务注入及缺服务idle。

<details>
<summary>查看原文（14行）</summary>

```text
    else register()
  }

  if (typeof ctx.inject === 'function') {
    ctx.inject(['slots', 'uiSession'], wire)
    return
  }

  // A host without dynamic injection. Mounting eagerly is only safe when the
  // services are already there; otherwise this plugin stays idle rather than
  // risking the pending-forever state that takes the whole GUI down.
  if (ctx.slots !== undefined && ctx.uiSession !== undefined) wire(ctx)
  else notify('idle: host offers no dynamic injection and no uiSession')
}
```

</details>

**依据 3 · 源码核查**：[src/client/ui.ts:212-237](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/ui.ts#L212-L237)

播放失败、guard与清理。

<details>
<summary>查看原文（26行）</summary>

```text
    const attempt = video.play()
    if (attempt !== undefined && typeof attempt.then === 'function') {
      attempt.then(() => log('play started', { clipId })).catch((error: unknown) => {
        log('play rejected', String(error))
        setNeedsTap(true)
      })
    }

    const guard = window.setTimeout(() => {
      if (!closedRef.current) {
        // Report BEFORE closing: a silent close leaves nothing to diagnose.
        store.setPhase('stalled', '视频加载超时')
        report('stalled, giving up after ' + String(STALL_TIMEOUT_MS) + 'ms')
        close()
      }
    }, STALL_TIMEOUT_MS)

    return () => {
      video.removeEventListener('playing', onPlaying)
      window.clearTimeout(guard)
      // Unmount is another way the overlay disappears (HMR, plugin disable,
      // slot remount). Detaching a <video> does not stop media by itself.
      releaseVideo(video)
    }
  }, [url, nonce, clipId, reason, store, close])

```

</details>

**依据 4 · 源码核查**：[src/host/index.js:343-366](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/index.js#L343-L366)

选片写面和体积上限，未见独立认证。

<details>
<summary>查看原文（24行）</summary>

```text
  /** `POST /select` — the user's choice, and nothing but the choice. */
  const handleSelect = (req, res) => {
    if (req.method !== 'POST') {
      sendJson(res, { ok: false, error: 'POST required' }, 405)
      return
    }
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 8192) req.destroy()
    })
    req.on('end', () => {
      let parsed = null
      try {
        parsed = JSON.parse(body)
      } catch {
        sendJson(res, { ok: false, error: 'invalid JSON body' }, 400)
        return
      }
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        sendJson(res, { ok: false, error: 'body must be an object' }, 400)
        return
      }
      /**
```

</details>

**依据 5 · 源码核查**：[src/host/selection-store.js:408-418](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/host/selection-store.js#L408-L418)

配置落盘。

<details>
<summary>查看原文（11行）</summary>

```text
  #write(selection) {
    mkdirSync(dirname(this.file), { recursive: true })
    const payload = JSON.stringify(selection, null, 2) + '\n'
    const tmp = this.file + '.tmp'
    writeFileSync(tmp, payload, 'utf8')
    try {
      renameSync(tmp, this.file)
    } catch {
      writeFileSync(this.file, payload, 'utf8')
    }
  }
```

</details>

#### 缺口

- 未测目标平台渲染、等待时长和用户偏好
  **影响**：不能升级持续安装或效率结论
  **进一步探讨**：以目标用户实际开关使用和工作打断记录判断。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可借鉴何处，能提出什么可证伪假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴的是“解析片源、提供字节、决定何时播放”三层分开，规则纯函数与播放副作用分离，再用诊断说明实际回退来源。它避免把缓存身份、用户选择和播放时序混成一个可变URL。迁移需要宿主提供稳定会话身份、覆盖层和媒体HTTP入口。

由25秒绝对guard及started与首帧不同推导一个未验证假设：将尝试、首帧、进度、完成和退出分别记录，以无进度时间而非总时长做stall门槛，可能在保留失败退出的同时减少正常长片误关。设置未知时也可优先不自动播放，由用户预览决定，避免默认值覆盖关闭意图。这是设计方案，不是现有能力。

最小验证使用5秒和30秒正常片、缺编码片、无限等待片，以及设置响应延迟四种输入，对比现规则和进度看门狗。记录误关闭、最长遮挡、Esc响应和是否违反关闭偏好；只有正常片误关下降且失败退出延迟不增加到不可接受才支持。若目标用户只用5秒片且不在意开关延迟，新机制的复杂度可能不值得，应保留简单短片范围。没有收益数据不推导商业机会。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/session.ts:337-377](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/session.ts#L337-L377)

纯决策与副作用记账分离。

<details>
<summary>查看原文（41行）</summary>

```text
export function decidePlay(input: PlayDecisionInput): PlayDecision {
  // 1. PINNED. Needs a conversation AND a fresh entry into it. Checked before the
  //    settings gate because a pin is explicit user intent.
  if (input.sessionId !== null && input.pinned !== null && input.pinned === input.sessionId) {
    if (!input.entered) return { action: 'none', reason: 'already in the pinned conversation' }
    return { action: 'play', reason: 'pinned' }
  }

  if (!input.settingsLoaded) return { action: 'none', reason: 'settings not loaded yet' }

  // 2. APP-START. Deliberately does NOT need a conversation (0.4.3).
  //
  //    Up to 0.4.2 the first line of this function was "no sessionId -> no play",
  //    which made the boot animation depend on the conversation binding settling
  //    first. On a launch that opens to the workspace/session list, or whose
  //    ui-session binding is slow, the rule answered "no conversation yet" — and
  //    because the effect only re-runs when one of its inputs changes, the intro
  //    could be skipped for the whole launch. That is one of the "有时候就是不出现"
  //    reports: a boot animation is a property of the LAUNCH, not of a conversation.
  if (input.settings.playOnAppStart) {
    return input.bootPlayed ? { action: 'none', reason: 'this launch already played' } : { action: 'play', reason: 'app-start' }
  }

  // 3. NEW CONVERSATION. The original rule, which IS about a conversation.
  if (input.sessionId === null) return { action: 'none', reason: 'no conversation yet' }
  if (!input.isNewConversation) return { action: 'none', reason: 'not a new conversation' }
  if (input.sessionPlayed) return { action: 'none', reason: 'this conversation already played' }
  return { action: 'play', reason: 'new-conversation' }
}

/**
 * Apply a decision's bookkeeping. Called by the effect, never by `decidePlay`,
 * so the pure rule stays pure and side effects stay in one place.
 */
export function recordDecision(decision: PlayDecision, sessionId: string | null): void {
  if (decision.action !== 'play' || decision.reason === 'pinned') return
  if (decision.reason === 'app-start') markBootPlayed()
  // The per-session record is written in BOTH modes: it is the fallback for a
  // host that never answers with settings, and `markPlayed` de-duplicates.
  if (sessionId !== null) markPlayed(sessionId)
}
```

</details>

**依据 2 · 源码核查**：[src/client/ui.ts:201-237](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/ui.ts#L201-L237)

onPlaying没有取消绝对guard。

<details>
<summary>查看原文（37行）</summary>

```text

    const onPlaying = (): void => {
      store.setPhase('playing')
      report('first frame painted')
    }
    video.addEventListener('playing', onPlaying)

    // Point the element at THIS clip's resource and force a fresh load. The URL
    // names one clip, so the previous clip's cached ranges cannot be spliced in.
    video.src = url
    video.load()
    const attempt = video.play()
    if (attempt !== undefined && typeof attempt.then === 'function') {
      attempt.then(() => log('play started', { clipId })).catch((error: unknown) => {
        log('play rejected', String(error))
        setNeedsTap(true)
      })
    }

    const guard = window.setTimeout(() => {
      if (!closedRef.current) {
        // Report BEFORE closing: a silent close leaves nothing to diagnose.
        store.setPhase('stalled', '视频加载超时')
        report('stalled, giving up after ' + String(STALL_TIMEOUT_MS) + 'ms')
        close()
      }
    }, STALL_TIMEOUT_MS)

    return () => {
      video.removeEventListener('playing', onPlaying)
      window.clearTimeout(guard)
      // Unmount is another way the overlay disappears (HMR, plugin disable,
      // slot remount). Detaching a <video> does not stop media by itself.
      releaseVideo(video)
    }
  }, [url, nonce, clipId, reason, store, close])

```

</details>

**依据 3 · 源码核查**：[src/client/store.ts:317-328](https://github.com/NativeDog1/dsh-boot-animation/blob/24c711296cb4af2618fef4f65e81346a660fc67b/src/client/store.ts#L317-L328)

设置未知采用默认值的取舍。

<details>
<summary>查看原文（12行）</summary>

```text
   *
   * Called on a timer by AppRoot while `settingsLoaded` is still false. Keeps the
   * current settings (the host's defaults) rather than inventing a rule, flips the
   * gate, and leaves one line in the diagnostic log. Idempotent, and a no-op when
   * the payload did arrive or the fallback already ran.
   */
  markSettingsFallback(why: string): void {
    if (this.#snapshot.settingsLoaded || this.#fallbackDecided) return
    this.#fallbackDecided = true
    notify('settings never arrived — deciding with defaults', { why })
    this.#set({ settingsLoaded: true, loading: false })
  }
```

</details>

#### 缺口

- 进度看门狗与默认不播方案未实现验证
  **影响**：只能作为从边界推导的假设
  **进一步探讨**：先用固定素材与故障矩阵比较误关闭和遮挡时长。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
