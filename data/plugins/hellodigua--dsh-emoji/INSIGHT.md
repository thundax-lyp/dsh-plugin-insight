# dsh-emoji

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f14b8c8](https://github.com/hellodigua/dsh-emoji/tree/f14b8c804ab87487ec331de62b3912c39ce75329)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hellodigua/dsh-emoji) [![npm 30d 3,696](https://img.shields.io/static/v1?label=npm+30d&message=3%2C696&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-emoji) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-emoji)
<!-- END META -->

> **功能**：为 DSH Web 回复加入可切换、自定义的行内表情和独立表情包。

> **亮点**：稳定语义与素材换肤解耦，补流式保护、限量、不可变资源和设置接线，不增加专用情绪模型。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：本地URL与loopback设置限制远程/分享，移除保留字节，提示频率依赖模型；声明兼容仍unknown。见 [Q02](#research-q02)。

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
  - [Q01 · 表情怎样从模型策略变成客户端图片，谁决定语义？](#detail-section-11)
  - [Q02 · 上传、保存、历史回放和远程使用的失败边界在哪里？](#detail-section-12)
  - [Q03 · 相对原生表情增加什么，哪些成本和素材责任仍留给用户？](#detail-section-13)
  - [Q04 · 哪些用户适合试用，下一步方向如何以实际阅读效果证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好非正式聊天的本机DSH Web用户，用统一语义图片替换少量Unicode。见 [Q01](#research-q01)。

普通文本/原生Unicode或手工Markdown图片；图片个性化不自动增加任务正确性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 策略提示 | auto/frequent/off | 语义与频率仍依赖模型 |
| 流式转写 | Unicode变本地图片 | 系统标记/purpose门控 |
| 换包 | 固定40语义皮肤 | 必须完整PNG包 |
| 上传/移除 | 本地包版本管理 | 移除保留历史字节 |
| 设置卡片 | 模式/尺寸/自定义提示 | loopback与Host服务 |
| 资源路由 | 白名单历史PNG | Host停用旧链接失效 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 本机DSH Web Host/Client两半 | 必需 | 流转写与图片样式 | 远程/其他Client不可推定 |
| Node ^22.19或>=24 | 必需 | Host运行 | 不在声明环境 |
| DSH peer ^0.1.7-rc.2或^0.2.0-rc.2 | 声明范围 | 提示/流/设置接口 | 两精确版实际验收unknown |
| llm/systemPrompt与webServer | 显示所需 | 广告/转写/本地图 | 无路由图片失败 |
| settings/Connection及loopback | 设置所需 | 持久化/RPC认证 | 非loopback卡片unavailable |
| 完整40key合法PNG包 | 自定义所需 | 统一语义替换 | 缺失/冲突/非法ZIP拒绝 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 启用 | 用户加Web Profile并重启 | 核两半与图片路由 |
| 会话 | 模型选Unicode，Host流转写 | 正文/代码链接与限量核验 |
| 调整 | 保存模式/包/尺寸 | 冲突刷新，不覆盖他人修改 |
| 自定义 | 上传完整ZIP再选择保存 | 查安装/设置两阶段结果 |
| 退出 | off或停插件 | 历史URL/磁盘保留另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 无专用模型调用，Host资源未知 | 显示/兼容核验 | 先内置包 |
| 持续使用 | 提示/生成token、图片与磁盘未知 | 素材版本/Host升级 | 不等于零成本 |
| 失败恢复 | 重试/保留版本空间未知 | RPC冲突/404/流排障 | 安装不与设置全事务 |
| 退出 | 素材字节保留 | off/停插件与历史检查 | 停路由可破旧图 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 语义换肤 | 同一key与版本图片 | 偏好/理解是否改善 |
| 正文保护 | 白名单/Markdown范围 | 所有provider流表现 |
| 资源治理 | ZIP限制/不可变版本 | 依赖全安全未审 |
| 关闭退路 | off删策略不转写 | 模型不输出Unicode不保证 |
| 总收益 | 不加专用表情模型 | 总token/延迟与任务干扰 |

> **思考**：本地URL与loopback设置限制远程/分享，移除保留字节，提示频率依赖模型；声明兼容仍unknown。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：稳定语义与素材换肤解耦，补流式保护、限量、不可变资源和设置接线，不增加专用情绪模型。见 [Q01](#research-q01)、[Q03](#research-q03)。

语义协议、版本资源和流式稳定前缀可借鉴；设置写入与素材安装不应被误认单事务。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地URL与loopback设置限制远程/分享，移除保留字节，提示频率依赖模型；声明兼容仍unknown。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本机Web先用内置auto做一个可弃会话，核代码/链接/断流/off；远程或导出优先就回Unicode。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Host/Client转写、设置和资产链已源码核查；真实Host、流式表现和阅读收益未实测。

- 已检查：作者 README、包清单、源码路径 ASSETS.md、README.md、package.json、src/assets.ts、src/client/index.ts、src/client/settings-controller.ts、src/index.ts、src/pack-model.ts、src/packs.ts、src/reactions.ts、src/request-mode.ts、src/settings-model.ts、src/settings-routes.ts、src/settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Host提示/流和Client卡片接线、请求模式、转写主链、设置RPC/修订、ZIP/PNG安装及历史路由；未全审Markdown/ZIP/PNG依赖、全部UI和provider组合，未运行目标。
- 下一步：固定本机Web以代码/链接/长流/冲突/404/off矩阵，再比较Unicode与图片阅读效果，未执行。

**分析版本**

- **仓库**：[hellodigua/dsh-emoji](https://github.com/hellodigua/dsh-emoji)
- **版本号**：0.3.6（[固定提交 f14b8c8](https://github.com/hellodigua/dsh-emoji/tree/f14b8c804ab87487ec331de62b3912c39ce75329)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用同一语义提供本机图片/导出Unicode及按会话关闭，比较阅读与失败；原生Unicode等效就不加复杂度。见 [Q04](#research-q04)。

固定本机Web以代码/链接/长流/冲突/404/off矩阵，再比较Unicode与图片阅读效果，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1005 | — | — | 18620 |
| .js | source | 2 | 4198 | 4053 | 213 | — |
| .mjs | source | 3 | 283 | 247 | 4 | — |
| .ts | source | 19 | 3879 | 3503 | 133 | — |
| .tsx | source | 1 | 475 | 460 | 3 | — |
| .ts | test | 14 | 2494 | 2280 | 91 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/hellodigua/dsh-emoji/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/hellodigua/dsh-emoji/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：语义表情怎样由模型请求变成可见内容，设置和资源管理影响哪些对话与成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 表情怎样从模型策略变成客户端图片，谁决定语义？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它服务于偏好轻松聊天表达的 DSH Web 用户：不改变任务内容，而把模型选择的少量表情显示为统一语义的图片。纯 Unicode 和手工 Markdown 图片是直接基线；合格结果应是正文可读、表情贴切且不污染代码/链接，不是任务准确率自动提高。作者声明42个允许Unicode对应40个稳定语义；实际转写按catalog匹配，不调用额外模型猜情绪。

Host 加载素材库后注册动态系统提示，off不生成策略，auto提示有帮助时使用，frequent提示每次对话加入合适表情。设置变更会触发system-prompt/change。全局llm/stream监听只处理purpose未定义且有效系统提示含模式标记的请求；请求显式system优先，否则取最新非空system消息快照，不从用户正文寻找标记。一次请求锁定当前packRef，流转写把白名单Unicode或本插件图片规范化成本地版本URL，数量上限auto3/frequent4，并要求两图间有有效正文。

转写识别Markdown保护范围，代码、链接、普通外部图片和未知Unicode保持原样；不是搜索工具，也不把导出的searchEmoji函数当已注册模型工具。流增量只发稳定前缀，遇到已发内容不一致停止增量并等待block-end的最终块校正；有finish无block-end时尝试补待决尾部。客户端主要注册设置卡片和尺寸CSS，图片由Host本地素材路由提供，真正语义选择仍依赖模型遵循提示。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:35-53](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/README.md#L35-L53)

作者场景和协议/频率。

<details>
<summary>查看原文（19行）</summary>

```text
## 工作方式

- AI 想加入情绪或装饰性表情时，直接从 42 个允许的 Unicode 表情中选择，例如输出 `😊`；它们对应 40 个稳定语义，插件会在 Host 端将其转换为当前表情包的图片，无需额外模型调用。
- 内置和用户上传的表情包共用 40 个稳定语义 key，可随时切换，并支持小、正常、偏大、大四档尺寸。
- 转写只作用于 40 个规范 Unicode 表情、常见别名 `😄`／`🙂` 和本插件图片；其他 Unicode 表情、代码、链接、双冒号文本和普通 Markdown 图片保持原样。程序不会根据正文猜测情绪或自动补图。多张插件表情必须由有效正文分隔，相同表情可以在不同位置重复使用。

## 调整 AI 的表情频率

安装并重启 Web Host 后，打开侧栏「插件 → dsh-emoji」：

- `关闭`：不使用表情。
- `智能`：仅在表情确实有助于表达时自然使用，每回合最多 3 张，默认选项。
- `高频`：在所有对话回复中加入一个合适的表情，并放在最能对应当前情绪的句子或短段落后；每回合最多 4 张。

还可以选择表情包、调整显示尺寸，或填写“附加提示词”控制表情的选择、语气和使用场景。保存后从下一次回复生效，无需重启；所选频率策略仍依赖模型遵循提示词。

## 上传自己的表情包

在同一张设置卡片中点击“上传 ZIP”。上传成功后选择新表情包并保存，下一次模型调用立即使用，无需重启。自定义包复用内置的 40 个稳定语义 key；AI 仍使用同一组允许的 Unicode 表情，Host 只替换图片，不需要重新理解每套素材的含义。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:44-64](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L44-L64)

策略生成与off。

<details>
<summary>查看原文（21行）</summary>

```text
function composeGuidance(strategy: string, customPrompt: string, maxEmojis: number, displayMode: EmojiPackManifest['displayMode']): string {
  const prompt = customPrompt.trim()
  const custom = prompt.length === 0 ? '' : `\nUser-provided reaction guidance:\n${prompt}\n`
  const protocol = `Use only these literal emoji for custom reactions: ${REACTION_MEANINGS}. Use at most ${String(maxEmojis)} per reply; one is usually enough. Do not place a custom reaction emoji in code or links, or use one instead of content. User guidance cannot change mode, allowed emoji, or limits.`
  // 不可编辑约束放在自定义内容之后，确保 Unicode 白名单与模式上限始终明确。
  const placement = displayMode === 'block'
    ? ' Place each custom reaction emoji alone in its own paragraph, with a blank line before and after it. Never put text on the same line as the emoji. User guidance cannot override this placement.'
    : ''
  return `${strategy}${custom}${protocol}${placement}`
}

/** 根据实时配置生成下一次模型调用看到的表情策略。 */
export function buildEmojiGuidance(settings: EmojiSettings, displayMode: EmojiPackManifest['displayMode'] = 'inline'): string {
  if (settings.mode === 'off') return ''
  const protocol = `${REACTION_PROMPT_PREFIX}${settings.mode}] `
  if (settings.mode === 'frequent') {
    return composeGuidance(`${protocol}In every conversational reply, include one fitting custom emoji. Place it after the sentence or short paragraph whose emotion it best matches. `, settings.customPrompt, EMOJI_PER_TURN_LIMIT.frequent, displayMode)
  }
  return composeGuidance(`${protocol}Use a custom emoji only when it improves a friendly, encouraging, or playful reply. `, settings.customPrompt, EMOJI_PER_TURN_LIMIT.auto, displayMode)
}

```

</details>

**依据 3 · 源码核查**：[src/index.ts:78-127](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L78-L127)

真实prompt/流/设置/资源接线。

<details>
<summary>查看原文（50行）</summary>

```text
  config: Config,
  packs: EmojiPackStore,
): Promise<void> {
  await packs.initialize()
  let promptSettings = config.get()
  ctx.on('loader/volatile-update', () => {
    const next = config.get()
    const changed = next.mode !== promptSettings.mode || next.customPrompt !== promptSettings.customPrompt
      || next.activePack !== promptSettings.activePack || next.packRevision !== promptSettings.packRevision
    promptSettings = next
    if (changed) ctx.emit('system-prompt/change')
  })

  ctx.effect(() => ctx.systemPrompt.section({
    name: 'dsh-emoji:guidance',
    order: 175,
    text: () => buildEmojiGuidance(config.get(), packs.summaryByRef(config.get().activePack)?.displayMode),
  }), 'dsh-emoji: guidance')

  ctx.on('llm/stream', (options: GenerateOptions, next) => {
    const source = next()
    // 树外插件可能解析到另一份 dsh-llm 模块，不能依赖进程内 WeakSet
    // 的 isAgentLoopRequest 身份；purpose 是跨包稳定的辅助调用边界。
    if (options.purpose !== undefined) return source
    const mode = reactionModeFromRequest(options)
    if (mode === undefined) return source
    const requestPack = config.get().activePack
    return rewriteReactionStream(source, {
      imageUrl: emoji => localEmojiUrl(ctx, packs, requestPack, emoji),
      maxEmojis: EMOJI_PER_TURN_LIMIT[mode],
    })
  }, { global: true })

  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.effect(() => settingsCtx.settings.configure({ auto: false }, ctx.fiber), 'dsh-emoji: settings presentation')

    settingsCtx.inject(['connection'], (connectionCtx) => {
      const handler = createEmojiSettingsRpcHandler(settingsCtx.settings, packs)
      registerEmojiSettingsRoutes(connectionCtx, handler)
    })
  })

  ctx.inject(['webServer'], (scope: Context) => {
    scope.effect(() => scope.webServer.register({
      kind: 'prefix',
      path: EMOJI_API_ROOT,
      handler: (request, response) => { handleEmojiAssetRequest(request, response, packs) },
    }), 'dsh-emoji: asset route')
  })
}
```

</details>

**依据 4 · 源码核查**：[src/request-mode.ts:1-22](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/request-mode.ts#L1-L22)

系统提示快照范围。

<details>
<summary>查看原文（22行）</summary>

```text
import type { GenerateOptions } from '@deepseek-ai/dsh-llm'
import { reactionModeFromPrompt } from './reactions.ts'

/** Read the effective prompt snapshot, never mode markers in conversation text. */
export function reactionModeFromRequest(options: Pick<GenerateOptions, 'system' | 'messages'>) {
  // Explicit one-shot/legacy prompts take precedence, including an empty prompt.
  if (options.system !== undefined) return reactionModeFromPrompt(options.system)

  const snapshots = options.messages.filter(message => message.role === 'system')
  for (let index = snapshots.length - 1; index >= 0; index--) {
    const text = snapshots[index].content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
    // DSH leaves empty tail nodes when replacing the leading prompt snapshot.
    if (text.length === 0) continue
    // A newer snapshot without our marker disables rewriting; do not search
    // older snapshots for a mode that was removed by a settings change.
    return reactionModeFromPrompt(text)
  }
  return undefined
}
```

</details>

**依据 5 · 源码核查**：[src/reactions.ts:161-237](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/reactions.ts#L161-L237)

白名单、正文分隔及数量处理。

<details>
<summary>查看原文（77行）</summary>

```text
function rewritePlainText(
  text: string,
  state: ReactionRewriteState,
  imageUrl: (emoji: EmojiCatalogEntry) => string,
  protectedRanges: readonly ProtectedRange[],
): string {
  let output = ''
  let rangeIndex = 0
  let removedInlineEmoji = false
  const graphemes = graphemesByStart(text)
  for (let index = 0; index < text.length;) {
    while ((protectedRanges[rangeIndex]?.end ?? Number.POSITIVE_INFINITY) <= index) rangeIndex += 1
    const protectedRange = protectedRanges[rangeIndex]
    if (protectedRange?.start === index) {
      const protectedText = text.slice(protectedRange.start, protectedRange.end)
      output += protectedText
      noteMeaningfulText(state, protectedText)
      removedInlineEmoji = false
      index = protectedRange.end
      continue
    }

    const directImage = isEscaped(text, index) ? undefined : directEmojiImageAt(text, index)
    if (directImage !== undefined) {
      if (state.count < state.limit
        && state.hasMeaningfulTextSinceEmoji
        && directImage.emoji !== undefined) {
        state.count += 1
        state.hasMeaningfulTextSinceEmoji = false
        output += markdownImage(directImage.emoji, imageUrl)
        removedInlineEmoji = false
      } else {
        output = output.replace(/[ \t]+$/u, '')
        removedInlineEmoji = true
      }
      index = directImage.end
      continue
    }

    const rawUrlEnd = isEscaped(text, index) ? undefined : rawUrlEndAt(text, index)
    if (rawUrlEnd !== undefined) {
      const rawUrl = text.slice(index, rawUrlEnd)
      output += rawUrl
      noteMeaningfulText(state, rawUrl)
      removedInlineEmoji = false
      index = rawUrlEnd
      continue
    }

    // 按完整 grapheme cluster 匹配，避免把 👍🏽 误拆成受控 👍 与残留肤色修饰符。
    const grapheme = graphemes.get(index) ?? text[index] ?? ''
    const emoji = isEscaped(text, index) ? undefined : catalogEmojiByUnicode(grapheme)
    if (emoji !== undefined) {
      if (state.count < state.limit && state.hasMeaningfulTextSinceEmoji) {
        state.count += 1
        state.hasMeaningfulTextSinceEmoji = false
        output += markdownImage(emoji, imageUrl)
        removedInlineEmoji = false
      } else {
        output = output.replace(/[ \t]+$/u, '')
        removedInlineEmoji = true
      }
      index += grapheme.length
      continue
    }

    if (removedInlineEmoji && /[ \t]/u.test(grapheme)) {
      if (output.length === 0 || /\s$/u.test(output) || !state.hasMeaningfulTextSinceEmoji) {
        index += grapheme.length
        continue
      }
    }
    output += grapheme
    noteMeaningfulText(state, grapheme)
    removedInlineEmoji = false
    index += grapheme.length
  }
```

</details>

**依据 6 · 源码核查**：[src/reactions.ts:620-702](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/reactions.ts#L620-L702)

流式状态、最终块与finish。

<details>
<summary>查看原文（83行）</summary>

```text
/** 包装一次模型流，在安全边界内增量转写受控 Unicode 表情。 */
export async function* rewriteReactionStream(
  source: AsyncIterable<StreamChunk>,
  options: ReactionStreamRewriteOptions,
): AsyncIterable<StreamChunk> {
  const maxEmojis = options.maxEmojis ?? 3
  let state: ReactionRewriteState = {
    count: 0,
    limit: Math.max(0, maxEmojis),
    hasMeaningfulTextSinceEmoji: true,
  }
  const textBlocks = new Map<number, StreamingTextBlock>()

  const openTextBlock = (index: number): StreamingTextBlock => {
    let block = textBlocks.get(index)
    if (block !== undefined) return block
    block = {
      rawText: '',
      emittedText: '',
      initialState: cloneRewriteState(state),
      diverged: false,
    }
    textBlocks.set(index, block)
    return block
  }

  for await (const chunk of source) {
    if (chunk.type === 'block-start' && chunk.blockType === 'text') {
      openTextBlock(chunk.index)
      yield chunk
      continue
    }
    if (chunk.type === 'text-delta') {
      const block = openTextBlock(chunk.index)
      block.rawText += chunk.text
      if (block.diverged) continue

      const stableEnd = stableReactionPrefixEnd(block.rawText)
      const rewritten = rewriteTextFromState(
        block.rawText.slice(0, stableEnd),
        block.initialState,
        options.imageUrl,
      ).text
      // append-only 流无法撤回已发出的内容；出现不一致时停止增量输出，由 block-end 校正。
      if (!rewritten.startsWith(block.emittedText)) {
        block.diverged = true
        continue
      }
      const delta = rewritten.slice(block.emittedText.length)
      block.emittedText = rewritten
      if (delta.length > 0) yield { ...chunk, text: delta }
      continue
    }
    if (chunk.type === 'block-end' && chunk.block.type === 'text') {
      const block = openTextBlock(chunk.index)
      const rewritten = rewriteTextFromState(chunk.block.text, block.initialState, options.imageUrl)
      state = rewritten.state

      // 把待决尾部先作为合法 delta 发出，让流式累计文本与最终 block 保持一致。
      if (!block.diverged && rewritten.text.startsWith(block.emittedText)) {
        const delta = rewritten.text.slice(block.emittedText.length)
        if (delta.length > 0) {
          yield { type: 'text-delta', index: chunk.index, text: delta }
        }
      }
      textBlocks.delete(chunk.index)
      yield { ...chunk, block: { ...chunk.block, text: rewritten.text } }
      continue
    }

    if (chunk.type === 'finish' && textBlocks.size > 0) {
      // error/aborted 或 delta-only provider 可能没有 block-end；结束前仍不能泄漏待决原生表情。
      for (const [index, block] of textBlocks) {
        const rewritten = rewriteTextFromState(block.rawText, block.initialState, options.imageUrl)
        state = rewritten.state
        if (!block.diverged && rewritten.text.startsWith(block.emittedText)) {
          const delta = rewritten.text.slice(block.emittedText.length)
          if (delta.length > 0) yield { type: 'text-delta', index, text: delta }
        }
      }
      textBlocks.clear()
    }
    yield chunk
```

</details>

**依据 7 · 源码核查**：[src/client/index.ts:186-227](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/client/index.ts#L186-L227)

客户端样式与设置卡片。

<details>
<summary>查看原文（42行）</summary>

```text
    const unsubscribe = controller.subscribe(syncSize)
    syncSize()
    return () => {
      unsubscribe()
      disposeStyle()
    }
  }, 'dsh-emoji: inline style')
  void controller.refresh()

  ctx.effect(() => {
    const disposeSettings = ctx.remote.$on('settings/document-updated', (namespace) => {
      if (namespace === EMOJI_SETTINGS_NAMESPACE) controller.invalidate()
    })
    const disposeReset = ctx.on('connection/reset', controller.invalidate)
    return () => {
      disposeSettings()
      disposeReset()
    }
  }, 'dsh-emoji: settings invalidations')

  // The namespace identifies this card in the Host schema and Client registry.
  ctx.slots.inject('plugins.bundle.config', () => {
    const settingsSlotOptions = {
      name: 'plugins.bundle.config' as const,
      key: EMOJI_SETTINGS_NAMESPACE,
      locale: EMOJI_LOCALE_NS,
      inject: () => ({
        hooks: { emojiSettings: controller },
        editMode: controller.editMode,
        editDisplaySize: controller.editDisplaySize,
        editCustomPrompt: controller.editCustomPrompt,
        editActivePack: controller.editActivePack,
        uploadPack: controller.uploadPack,
        removePack: controller.removePack,
        save: controller.save,
        discard: controller.discard,
        reset: controller.reset,
      }),
    } as const
    return ctx.slots.register(settingsSlotOptions, EmojiSettingsCard)
  })
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 上传、保存、历史回放和远程使用的失败边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

上传不是任意文件解压器。ZIP限制20MiB、展开80MiB、单文件2MiB和512像素，拒绝绝对/逃逸路径、大小写重复路径、未知额外文件和缺失语义key；PNG检查签名/IHDR后完整解码与CRC。安装到临时目录后rename，id@version绑定内容摘要，同版本不同字节拒绝。此源码支持受限资源安装机制，不构成对解码依赖全部漏洞的安全审计。

设置RPC只暴露本插件命名空间，通过Connection fetch注册POST JSON路由；身份/来源和buffer上限委托Host Connection，插件本身验证envelope和payload。写操作串行，save/reset带expectedRevision，冲突返回settings-conflict，不能假定所有标签草稿被自动合并。pack上传先安装文件再提升设置代际；后一步失败不等于安装文件事务回滚，用户应重新刷新目录确认。

移除不物理删素材，只写removed标记；内置或当前活动包不能移除。这保证已有版本URL仍能回放，同时磁盘字节继续保留。停用插件时路由消失，历史消息的图片链接不具备脱离该Host的自包含性；不能把“移除”视为隐私删除或清盘。资源路由仅白名单PNG，非法编码/额外段/缺文件404。

渲染URL硬编码http://127.0.0.1:Host端口；设置controller对非loopback连接直接unavailable。这是本机Web用法边界，不应泛化为远程浏览器可直接使用，迁移/分享历史也需处理Host地址。off是删除策略并不转写，不能强制模型从此完全不输出普通Unicode；frequent频率和block独立成段仍是提示要求，数量上限才有转写层控制。兼容矩阵两个声明版本均unknown，peer范围不是实际加载验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/pack-model.ts:11-14](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/pack-model.ts#L11-L14)

资源容量常量。

```text
export const MAX_PACK_ARCHIVE_BYTES = 20 * 1024 * 1024
export const MAX_PACK_EXTRACTED_BYTES = 80 * 1024 * 1024
export const MAX_PACK_FILE_BYTES = 2 * 1024 * 1024
export const MAX_PACK_IMAGE_DIMENSION = 512
```

**依据 2 · 源码核查**：[src/packs.ts:89-94](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/packs.ts#L89-L94)

拒绝路径逃逸。

```text
function safeArchiveName(info: UnzipFileInfo): boolean {
  const name = info.name
  if (name.includes('\0') || name.includes('\\') || name.startsWith('/') || /^[A-Za-z]:/.test(name)) return false
  const segments = name.split('/').filter(Boolean)
  return segments.length > 0 && segments.every(segment => segment !== '.' && segment !== '..')
}
```

**依据 3 · 源码核查**：[src/packs.ts:131-168](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/packs.ts#L131-L168)

PNG完整解码。

<details>
<summary>查看原文（38行）</summary>

```text
function inspectImage(file: string, bytes: Uint8Array): InstalledEmojiFile {
  const header = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  if (bytes.byteLength < 33 || !file.endsWith('.png')
    || !header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    || header.toString('ascii', 12, 16) !== 'IHDR') {
    throw new EmojiPackError('pack-invalid', `${file} is not a PNG image.`)
  }
  const declaredWidth = header.readUInt32BE(16)
  const declaredHeight = header.readUInt32BE(20)
  if (declaredWidth < 1 || declaredHeight < 1
    || declaredWidth > MAX_PACK_IMAGE_DIMENSION || declaredHeight > MAX_PACK_IMAGE_DIMENSION) {
    throw new EmojiPackError(
      'pack-invalid',
      `${file} is not within ${String(MAX_PACK_IMAGE_DIMENSION)}×${String(MAX_PACK_IMAGE_DIMENSION)}.`,
    )
  }
  let dimensions: { width: number; height: number }
  try {
    const decoded = PNG.sync.read(header, {
      checkCRC: true,
    })
    dimensions = { width: decoded.width, height: decoded.height }
  } catch {
    throw new EmojiPackError('pack-invalid', `${file} is not a fully decodable PNG image.`)
  }
  if (!file.endsWith('.png') || dimensions.width < 1 || dimensions.height < 1
    || dimensions.width > MAX_PACK_IMAGE_DIMENSION || dimensions.height > MAX_PACK_IMAGE_DIMENSION) {
    throw new EmojiPackError(
      'pack-invalid',
      `${file} is not a valid PNG image within ${String(MAX_PACK_IMAGE_DIMENSION)}×${String(MAX_PACK_IMAGE_DIMENSION)}.`,
    )
  }
  return {
    file,
    mime: 'image/png',
    width: dimensions.width,
    height: dimensions.height,
    bytes: bytes.byteLength,
```

</details>

**依据 4 · 源码核查**：[src/packs.ts:181-245](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/packs.ts#L181-L245)

ZIP过滤与固定key/文件白名单。

<details>
<summary>查看原文（65行）</summary>

```text
function decodeArchive(archive: Uint8Array): { manifest: InstalledEmojiPack; images: Map<string, Uint8Array> } {
  if (archive.byteLength === 0 || archive.byteLength > MAX_PACK_ARCHIVE_BYTES) {
    throw new EmojiPackError('pack-too-large', `The ZIP must not exceed ${String(MAX_PACK_ARCHIVE_BYTES)} bytes.`)
  }
  let extractedBytes = 0
  const archivePaths = new Set<string>()
  let extracted: Record<string, Uint8Array>
  try {
    extracted = unzipSync(archive, {
      filter: (info) => {
        if (!safeArchiveName(info)) throw new EmojiPackError('pack-invalid', `Unsafe ZIP path: ${info.name}`)
        const folded = info.name.toLocaleLowerCase('en-US')
        if (archivePaths.has(folded)) throw new EmojiPackError('pack-invalid', `Duplicate ZIP path: ${info.name}`)
        archivePaths.add(folded)
        if (info.name.endsWith('/') || ignoredMetadata(info.name)) return false
        if (info.originalSize > MAX_PACK_FILE_BYTES) {
          throw new EmojiPackError('pack-too-large', `${info.name} exceeds the per-file size limit.`)
        }
        extractedBytes += info.originalSize
        if (extractedBytes > MAX_PACK_EXTRACTED_BYTES) {
          throw new EmojiPackError('pack-too-large', 'The expanded ZIP exceeds the size limit.')
        }
        return true
      },
    })
  } catch (error) {
    if (error instanceof EmojiPackError) throw error
    throw new EmojiPackError('pack-invalid', `The ZIP could not be decoded: ${String(error)}`)
  }

  const rawPaths = Object.keys(extracted).filter(path => !ignoredMetadata(path))
  const prefix = commonArchivePrefix(rawPaths)
  const entries = new Map<string, Uint8Array>()
  for (const rawPath of rawPaths) {
    if (!rawPath.startsWith(prefix)) {
      throw new EmojiPackError('pack-invalid', 'The ZIP contains files outside its single package root.')
    }
    const path = rawPath.slice(prefix.length)
    const folded = path.toLocaleLowerCase('en-US')
    if ([...entries.keys()].some(existing => existing.toLocaleLowerCase('en-US') === folded)) {
      throw new EmojiPackError('pack-invalid', `The ZIP contains a duplicate path: ${path}`)
    }
    entries.set(path, extracted[rawPath]!)
  }

  const packJson = entries.get('pack.json')
  if (packJson === undefined) throw new EmojiPackError('pack-invalid', 'pack.json is missing.')
  const source = parseManifest(packJson)
  const allowed = new Set(['pack.json'])
  const images = new Map<string, Uint8Array>()
  const files: Record<string, InstalledEmojiFile> = {}
  for (const emoji of EMOJIS) {
    const candidates = [`images/${emoji.key}.png`].filter(path => entries.has(path))
    if (candidates.length !== 1) {
      throw new EmojiPackError('pack-invalid', `Exactly one PNG is required for key ${emoji.key}.`)
    }
    const file = candidates[0]!
    const bytes = entries.get(file)!
    allowed.add(file)
    images.set(file, bytes)
    files[emoji.key] = inspectImage(file.slice('images/'.length), bytes)
  }
  const extra = [...entries.keys()].find(path => !allowed.has(path))
  if (extra !== undefined) throw new EmojiPackError('pack-invalid', `Unexpected file in ZIP: ${extra}`)

```

</details>

**依据 5 · 源码核查**：[src/packs.ts:423-468](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/packs.ts#L423-L468)

不可变版本与安装原子rename。

<details>
<summary>查看原文（46行）</summary>

```text
  async installArchive(archive: Uint8Array): Promise<EmojiPackSummary> {
    const decoded = decodeArchive(archive)
    const ref = emojiPackRef(decoded.manifest.id, decoded.manifest.version)
    const existing = this.packs.get(ref)
    if (existing !== undefined) {
      if (existing.archiveSha256 !== decoded.manifest.archiveSha256) {
        throw new EmojiPackError('pack-conflict', `Pack ${ref} already exists with different content.`)
      }
      if (existing.removed) {
        try {
          await unlink(join(existing.root, REMOVED_MARKER))
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw new EmojiPackError('pack-write-failed', `Pack ${ref} could not be restored: ${String(error)}`)
          }
        }
        existing.removed = false
      }
      return this.summary(existing)
    }

    const idRoot = join(this.root, decoded.manifest.id)
    const finalRoot = join(idRoot, decoded.manifest.version)
    const tempRoot = join(idRoot, `.install-${process.pid}-${randomUUID()}`)
    try {
      await mkdir(join(tempRoot, 'images'), { recursive: true, mode: 0o700 })
      for (const [path, bytes] of decoded.images) {
        const filename = path.slice('images/'.length)
        await writeFile(join(tempRoot, 'images', filename), bytes, { flag: 'wx', mode: 0o600 })
      }
      await writeFile(join(tempRoot, INSTALLED_MANIFEST), `${JSON.stringify(decoded.manifest, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
      await mkdir(idRoot, { recursive: true, mode: 0o700 })
      await rename(tempRoot, finalRoot)
    } catch (error) {
      await rm(tempRoot, { recursive: true, force: true })
      if (['EEXIST', 'ENOTEMPTY'].includes((error as NodeJS.ErrnoException).code ?? '')) {
        const raced = await loadInstalledRuntime(finalRoot, decoded.manifest.id, decoded.manifest.version)
        if (raced?.archiveSha256 === decoded.manifest.archiveSha256) {
          this.packs.set(ref, raced)
          return this.summary(raced)
        }
        throw new EmojiPackError('pack-conflict', `Pack ${ref} already exists with different content.`)
      }
      if (error instanceof EmojiPackError) throw error
      throw new EmojiPackError('pack-write-failed', `Pack ${ref} could not be installed: ${String(error)}`)
    }
```

</details>

**依据 6 · 源码核查**：[src/packs.ts:492-511](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/packs.ts#L492-L511)

保留历史字节的移除。

<details>
<summary>查看原文（20行）</summary>

```text

  /**
   * 从选择列表移除用户包，但保留不可变素材文件，保证已有消息中的 URL 可继续回放。
   */
  async remove(ref: string, activeRef: string): Promise<void> {
    const pack = this.packs.get(ref)
    if (pack === undefined || pack.removed) throw new EmojiPackError('pack-not-found', `Pack ${ref} was not found.`)
    if (pack.builtIn) throw new EmojiPackError('pack-invalid', 'The built-in pack cannot be removed.')
    if (ref === activeRef) throw new EmojiPackError('pack-active', 'The active pack cannot be removed.')
    try {
      await writeFile(join(pack.root, REMOVED_MARKER), 'retained for historical message assets\n', { flag: 'wx', mode: 0o600 })
      pack.removed = true
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        pack.removed = true
        return
      }
      throw new EmojiPackError('pack-write-failed', `Pack ${ref} could not be removed: ${String(error)}`)
    }
  }
```

</details>

**依据 7 · 源码核查**：[src/settings-routes.ts:8-34](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/settings-routes.ts#L8-L34)

委托Connection身份/来源。

<details>
<summary>查看原文（27行）</summary>

```text
/** Connection owns authentication, origin checks and the buffered body limit. */
export function registerEmojiSettingsRoutes(ctx: Context, handler: EmojiSettingsRpcHandler): void {
  for (const endpoint of ENDPOINTS) {
    ctx.effect(() => ctx.connection.fetch.register({
      path: `${EMOJI_SETTINGS_RPC_CHANNEL}/${EMOJI_SETTINGS_RPC_PREFIX}/${endpoint}`,
      methods: ['POST'],
      requestBody: 'buffered',
      fetch: async request => {
        if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json') {
          return new Response('content type must be application/json', { status: 415 })
        }
        let body: unknown
        try { body = await request.json() } catch {
          return new Response('body is not JSON', { status: 400 })
        }
        const envelope = clientRequestSchema.safeParse(body)
        if (!envelope.success || envelope.data.method !== `${EMOJI_SETTINGS_RPC_PREFIX}/${endpoint}`) {
          return new Response('invalid RPC envelope', { status: 400 })
        }
        return Response.json({
          type: 'server-response',
          rpcId: envelope.data.rpcId,
          result: await handler(endpoint, envelope.data.payload, request.signal),
        })
      },
    }), `dsh-emoji: settings ${endpoint}`)
  }
```

</details>

**依据 8 · 源码核查**：[src/settings.ts:149-208](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/settings.ts#L149-L208)

revision写入和包代际非同事务。

<details>
<summary>查看原文（60行）</summary>

```text
      return await exclusive(async () => {
        if (endpoint === 'save') {
          if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
            return badRequest('Saving emoji settings requires an object payload.')
          }
          const request = payload as Partial<EmojiSettingsWriteRequest>
          const next = parseEmojiSettings(request.settings)
          const expectedRevision = parseRevision(request.expectedRevision)
          if (next === undefined || expectedRevision === undefined) {
            return badRequest('Emoji settings or revision are invalid.')
          }
          if (!packs.has(next.activePack)) {
            throw new EmojiPackError('pack-not-found', `Pack ${next.activePack} is not installed.`)
          }
          const current = describeEmojiSettings(settings, packs)
          const sanitized = { ...next, packRevision: current.settings.packRevision }
          await settings.replace(EMOJI_SETTINGS_NS, sanitized, expectedRevision)
          onCommitted?.(sanitized)
          return { ok: true, value: describeEmojiSettings(settings, packs) }
        }

        if (endpoint === 'reset') {
          if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
            return badRequest('Resetting emoji settings requires an object payload.')
          }
          const expectedRevision = parseRevision((payload as { expectedRevision?: unknown }).expectedRevision)
          if (expectedRevision === undefined) return badRequest('The revision is invalid.')
          const current = describeEmojiSettings(settings, packs)
          await settings.replace(EMOJI_SETTINGS_NS, { packRevision: current.settings.packRevision }, expectedRevision)
          const document = describeEmojiSettings(settings, packs)
          onCommitted?.(document.settings)
          return { ok: true, value: document }
        }

        if (endpoint === 'pack-upload') {
          if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
            return badRequest('Uploading an emoji pack requires an object payload.')
          }
          await packs.installBase64((payload as { archiveBase64?: unknown }).archiveBase64)
          return { ok: true, value: await bumpPackRevision() }
        }

        if (endpoint === 'pack-remove') {
          if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
            return badRequest('Removing an emoji pack requires an object payload.')
          }
          const packRef = (payload as { packRef?: unknown }).packRef
          if (typeof packRef !== 'string') return badRequest('The emoji pack reference is invalid.')
          const document = describeEmojiSettings(settings, packs)
          await packs.remove(packRef, document.settings.activePack)
          return { ok: true, value: await bumpPackRevision() }
        }

        return badRequest(`Unknown dsh-emoji settings operation: ${endpoint}`)
      })
    } catch (error) {
      return rejected(error)
    }
  }
}
```

</details>

**依据 9 · 源码核查**：[src/index.ts:68-74](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L68-L74)

loopback图片URL。

```text
  const port = ctx.get('webServer')?.port
  if (port === undefined) throw new Error('dsh-emoji: webServer service missing while resolving emoji URL')
  const path = packs.assetUrl(packRef, emoji) ?? packs.assetUrl(BUILTIN_PACK_REF, emoji)
  if (path === undefined) throw new Error(`dsh-emoji: active pack ${packRef} cannot resolve ${emoji.key}`)
  return `http://127.0.0.1:${String(port)}${path}`
}

```

**依据 10 · 源码核查**：[src/client/settings-controller.ts:170-187](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/client/settings-controller.ts#L170-L187)

非loopback设置不可用。

<details>
<summary>查看原文（18行）</summary>

```text
  constructor(
    private readonly rpc: ClientConnectionRpc,
    isLoopback: boolean,
  ) {
    const defaults = cloneSettings(DEFAULT_EMOJI_SETTINGS)
    this.snapshot = {
      status: isLoopback ? 'loading' : 'unavailable',
      persisted: defaults,
      draft: cloneSettings(defaults),
      revision: 0,
      writable: false,
      packs: [],
      dirty: false,
      saving: false,
      packBusy: false,
      saved: false,
      ...isLoopback ? {} : { error: 'loopbackRequired' },
    }
```

</details>

**依据 11 · 源码核查**：[src/assets.ts:22-50](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/assets.ts#L22-L50)

白名单路由及404。

<details>
<summary>查看原文（29行）</summary>

```text
  if (pathname !== EMOJI_API_ROOT && !pathname.startsWith(`${EMOJI_API_ROOT}/`)) return false

  const encodedSegments = pathname.slice(EMOJI_API_ROOT.length + 1).split('/')
  if (encodedSegments.length !== 2 && encodedSegments.length !== 3) { notFound(response); return true }

  let segments: string[]
  try {
    segments = encodedSegments.map(segment => decodeURIComponent(segment))
  } catch {
    notFound(response)
    return true
  }
  const resolved = segments.length === 2
    ? packs.resolveLegacyAsset(segments[0]!, segments[1]!)
    : packs.resolveAsset(segments[0]!, segments[1]!, segments[2]!)
  if (resolved === undefined || !existsSync(resolved.filePath)) { notFound(response); return true }

  const stream = createReadStream(resolved.filePath)
  stream.on('error', () => {
    if (!response.headersSent) { notFound(response); return }
    response.end()
  })
  response.writeHead(200, {
    'content-type': resolved.mime,
    'cache-control': 'public, max-age=86400, immutable',
  })
  stream.pipe(response)
  return true
}
```

</details>

**依据 12 · 源码核查**：[package.json:68-73](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/package.json#L68-L73)

声明兼容状态unknown。

```text
    "compatibility": {
      "dshReleases": {
        "0.1.7-rc.2": "unknown",
        "0.2.0-rc.2": "unknown"
      }
    },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生表情增加什么，哪些成本和素材责任仍留给用户？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

增量是稳定语义协议与换肤解耦：模型仍选同组Unicode，用户包只替换对应40张PNG；加上数量/Markdown保护、流式接线、版本化资产和设置卡片。Unicode/Markdown/PNG/React与Host提示和流接口是既有底座，不是插件新模型能力。纯文本聊天或原生emoji已经足够的人，额外图片不是普遍增益；任务写作的严肃性、无障碍、导出和移动布局效果未测。

需要Web Profile Host与Client两半、llm/systemPrompt、webServer提供图片及settings/connection持久化设置，Node ^22.19或>=24，peer声明DSH ^0.1.7-rc.2或^0.2.0-rc.2，但两精确版运行状态unknown。普通npm install不能启用插件。模式和pack变更从后续调用生效，尺寸是浏览器CSS，可影响已有图片的显示。

不增加专用表情模型调用，仍会占系统提示和生成图片Markdown文本，提示/流解析/图片请求与磁盘开销未测。首次要确认Host实际显示与个人偏好，自定义包需准备完整40key和合法素材；持续成本是版本保留、素材维护和兼容升级，失败恢复要查RPC冲突/图片路由。退出可off或停插件，后者历史图片可能失效，包字节需另管。代码MIT不等于所有素材可任意再分发，ASSETS只记维护者确认项目内公开分发，不授予脱离项目复制改编权；本次不作法律结论。

按创新对象比较，换语义皮肤和本地管理没有改变聊天任务供给、计价、资源池化、风险承担或服务模式；即便未来测得更愉快，也不是本版本经济结构创新。费用与体验是否值得，需另做同任务对照，不能用无需额外模型调用推断零成本。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:25-38](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/README.md#L25-L38)

安装方式及固定语义增量。

<details>
<summary>查看原文（14行）</summary>

````text
## 安装

使用 DSH CLI 把插件加入 Web Profile，然后重启 Web Host：

```sh
dsh plugin --profile web add dsh-emoji
```

如需体验预发布版本，将安装命令中的包名替换为 `dsh-emoji@beta`。普通 `npm install dsh-emoji` 只会把包加入当前 Node.js 项目，不会启用 DSH 插件。

## 工作方式

- AI 想加入情绪或装饰性表情时，直接从 42 个允许的 Unicode 表情中选择，例如输出 `😊`；它们对应 40 个稳定语义，插件会在 Host 端将其转换为当前表情包的图片，无需额外模型调用。
- 内置和用户上传的表情包共用 40 个稳定语义 key，可随时切换，并支持小、正常、偏大、大四档尺寸。
````

</details>

**依据 2 · 源码核查**：[README.md:91-103](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/README.md#L91-L103)

版本、保留与兼容作者边界。

<details>
<summary>查看原文（13行）</summary>

````text
sarcastic, cool, celebrate, cheer, thanks, sorry, hug, please, applause
```

每个 key 必须且只能提供一个同名 `.png`。`id` 使用小写字母、数字和连字符，`version` 使用 SemVer；同一个 `id@version` 的内容不可覆盖，更新素材时必须提升版本。ZIP 上限 20 MiB，解压后上限 80 MiB，单文件上限 2 MiB，图片宽高均不得超过 512 像素；路径逃逸、额外文件、缺失 key、未知 `keySet`、伪造格式和同版本冲突都会被拒绝。

用户包保存在 `$DSH_HOME/emoji-packs/`（默认 `~/.dsh/emoji-packs/`），Settings 只保存当前 `id@version`。从选择列表“移除”不会物理删除素材字节，因此历史消息里的版本化 URL 仍能回放；重新上传完全相同的 ZIP 可以恢复该版本。

## 兼容性

支持 DSH `0.1.7-rc.2` 与 `0.2.0-rc.2` 所属的 peer 范围（`^0.1.7-rc.2 || ^0.2.0-rc.2`），以及 Node.js `^22.19.0 || >=24`。本地开发固定 DSH `0.2.0-rc.2` 的精确类型链，部署时由 Web Profile 提供共享运行时；完整运行验收状态记录在 `package.json` 的 `dsh.compatibility.dshReleases` 中。设置保存到当前 Profile 的 `cordis.patch.yml`，表情素材保存在 DSH Home 中。

## 本地开发

````

</details>

**依据 3 · 源码核查**：[src/index.ts:36-39](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L36-L39)

Host硬注入。

```text
export const name = 'dsh-emoji'
export const inject = ['llm', 'systemPrompt']
export type Config = Volatile<EmojiSettings>
export const Config = EmojiSettingsSchema.volatile()
```

**依据 4 · 源码核查**：[src/index.ts:113-130](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L113-L130)

设置/Connection和webServer接入。

<details>
<summary>查看原文（18行）</summary>

```text

    settingsCtx.inject(['connection'], (connectionCtx) => {
      const handler = createEmojiSettingsRpcHandler(settingsCtx.settings, packs)
      registerEmojiSettingsRoutes(connectionCtx, handler)
    })
  })

  ctx.inject(['webServer'], (scope: Context) => {
    scope.effect(() => scope.webServer.register({
      kind: 'prefix',
      path: EMOJI_API_ROOT,
      handler: (request, response) => { handleEmojiAssetRequest(request, response, packs) },
    }), 'dsh-emoji: asset route')
  })
}

export async function apply(ctx: Context, config: Config): Promise<void> {
  await applyWithPackStore(ctx, config, new EmojiPackStore())
```

</details>

**依据 5 · 源码核查**：[package.json:49-51](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/package.json#L49-L51)

Node声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 6 · 源码核查**：[ASSETS.md:19-24](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/ASSETS.md#L19-L24)

代码与素材授权不同。

```text

代码采用 MIT。代码许可证不声明也不推定总览图、鲸鱼形象或二创表情素材的所有权与再分发许可。

素材提供者另提供了一张 `140×140 RGBA PNG` 形象参考图（SHA-256：`a41e6652b8ef3527a7f4b00340613dc0d6f915f3208b31e73cbf6bad0ef4ca23`）。该图片不是当前包内置的 40 张输出图，也没有可用的作者、版权或来源元数据。

仓库维护者确认当前 40 张运行时素材可以作为 `dsh-emoji` 的内置内容随 npm 包公开分发；项目也已被 DSH 官方精选展示。该确认不把素材纳入 MIT，也不授予脱离本项目单独复制、改编或再分发素材的权利；相关素材权利仍归原权利人所有。
```

#### 缺口

- 用户偏好、任务干扰、无障碍/导出与总开销未测。
  **影响**：不能宣称生产力提高或普遍优于原生Unicode。
  **进一步探讨**：同一真实对话比较off/Unicode/图片三条件，记录内容错误、阅读理解、延迟及偏好，并核导出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些用户适合试用，下一步方向如何以实际阅读效果证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可条件试用：已有本机DSH Web环境、喜欢非正式聊天的用户先用内置包auto，在一个可丢弃会话核图片、代码块、链接、长流和切换off。先不上传私密/无授权素材。若图片干扰内容、Host兼容失败或历史分享/远程阅读更重要，切off回普通文本/Unicode；不要把补表情变成任务完成的依赖。

值得验证的方向不是再加更多表情，而是让同一语义在不同阅读场景有可控退路：本机图片、导出Unicode/可访问文本、正式任务off，保留明确的原文与展示层边界。依据是现有稳定语义key和alt Unicode已具备转换基础，但本地URL和全局提示使远程/导出和任务分场景受到限制。最小实验固定几段聊天/代码/正式报告，对现状图片、Unicode fallback和按会话策略比较阅读理解、图片失败、内容受扰与偏好。若原生Unicode效果一样且复杂度更低，或个性化并不改善理解/偏好，就不扩插件。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:44-64](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L44-L64)

可关闭/频率策略。

<details>
<summary>查看原文（21行）</summary>

```text
function composeGuidance(strategy: string, customPrompt: string, maxEmojis: number, displayMode: EmojiPackManifest['displayMode']): string {
  const prompt = customPrompt.trim()
  const custom = prompt.length === 0 ? '' : `\nUser-provided reaction guidance:\n${prompt}\n`
  const protocol = `Use only these literal emoji for custom reactions: ${REACTION_MEANINGS}. Use at most ${String(maxEmojis)} per reply; one is usually enough. Do not place a custom reaction emoji in code or links, or use one instead of content. User guidance cannot change mode, allowed emoji, or limits.`
  // 不可编辑约束放在自定义内容之后，确保 Unicode 白名单与模式上限始终明确。
  const placement = displayMode === 'block'
    ? ' Place each custom reaction emoji alone in its own paragraph, with a blank line before and after it. Never put text on the same line as the emoji. User guidance cannot override this placement.'
    : ''
  return `${strategy}${custom}${protocol}${placement}`
}

/** 根据实时配置生成下一次模型调用看到的表情策略。 */
export function buildEmojiGuidance(settings: EmojiSettings, displayMode: EmojiPackManifest['displayMode'] = 'inline'): string {
  if (settings.mode === 'off') return ''
  const protocol = `${REACTION_PROMPT_PREFIX}${settings.mode}] `
  if (settings.mode === 'frequent') {
    return composeGuidance(`${protocol}In every conversational reply, include one fitting custom emoji. Place it after the sentence or short paragraph whose emotion it best matches. `, settings.customPrompt, EMOJI_PER_TURN_LIMIT.frequent, displayMode)
  }
  return composeGuidance(`${protocol}Use a custom emoji only when it improves a friendly, encouraging, or playful reply. `, settings.customPrompt, EMOJI_PER_TURN_LIMIT.auto, displayMode)
}

```

</details>

**依据 2 · 源码核查**：[src/index.ts:68-74](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/index.ts#L68-L74)

本机URL限制的方向依据。

```text
  const port = ctx.get('webServer')?.port
  if (port === undefined) throw new Error('dsh-emoji: webServer service missing while resolving emoji URL')
  const path = packs.assetUrl(packRef, emoji) ?? packs.assetUrl(BUILTIN_PACK_REF, emoji)
  if (path === undefined) throw new Error(`dsh-emoji: active pack ${packRef} cannot resolve ${emoji.key}`)
  return `http://127.0.0.1:${String(port)}${path}`
}

```

**依据 3 · 源码核查**：[src/reactions.ts:80-82](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/reactions.ts#L80-L82)

图片alt已有规范Unicode。

```text
function markdownImage(emoji: EmojiCatalogEntry, imageUrl: (emoji: EmojiCatalogEntry) => string): string {
  return `![${canonicalReactionEmoji(emoji)}](${imageUrl(emoji)})`
}
```

**依据 4 · 源码核查**：[src/settings-model.ts:50-58](https://github.com/hellodigua/dsh-emoji/blob/f14b8c804ab87487ec331de62b3912c39ce75329/src/settings-model.ts#L50-L58)

默认auto与包。

```text
/** 没有部署配置或用户覆盖时采用的默认值。 */
export const DEFAULT_EMOJI_SETTINGS: Readonly<EmojiSettings> = Object.freeze({
  mode: 'auto',
  displaySize: 'normal',
  blockDisplaySize: 'normal',
  customPrompt: DEFAULT_CUSTOM_PROMPT,
  activePack: BUILTIN_PACK_REF,
  packRevision: 0,
})
```

#### 缺口

- 会话化/导出fallback未实现，真实阅读对照未运行。
  **影响**：新方向不计入已有能力，不能提前许诺效果。
  **进一步探讨**：先记录当前图片失败和场景干扰，再决定是否需新增转换层。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
