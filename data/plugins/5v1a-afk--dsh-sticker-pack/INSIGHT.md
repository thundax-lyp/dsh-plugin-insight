# dsh-sticker-pack

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[531f16a](https://github.com/5V1A-afk/dsh-sticker-pack/tree/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5V1A-afk/dsh-sticker-pack)
<!-- END META -->

> **功能**：订阅远端表情包清单，镜像图片，向 agent 提供选图工具和 Web/微信渠道贴图提示。

> **亮点**：把远端图册与 DSH agent 工具、Web 地址及微信文件格式打通，并由插件决定贴图概率。详见[Q02](#research-q02)。

> **主要限制**：设置 GET 带参数即写盘，组件内无身份/CSRF 校验；等待上限可无限增大，实际外部保护需核。详见[Q03](#research-q03)。

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
  - [Q01 · 表情包如何进入 agent 回复，哪些渠道可真正显示？](#detail-section-11)
  - [Q02 · 远端清单、懒下载、选图和出图概率如何工作？](#detail-section-12)
  - [Q03 · 远端来源与设置路由有哪些风险？](#detail-section-13)
  - [Q04 · 安装、素材分发与回复开销如何估算？](#detail-section-14)
  - [Q05 · 怎样低风险试用并验证图像交付而非仅有路径？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让 DSH 回复按语境适度使用授权图像，并在目标渠道实际显示。

手工选图上传或纯文本回复；本插件降低图册查找和路径拼接负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| catalog/pick | 给 agent 素材候选 | 无渲染确认 |
| 缓存/熔断 | 慢源降级 | 仍可能等待配置上限 |
| 设置路由 | 即时调节概率/等待 | GET 可写、组件无鉴权 |
| 微信副本 | 绕过图片消息限制 | 手机送达未验 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH tools/systemPrompt/Web | 工具和页面 | 部分功能缺失 |
| 可信远端图册/CDN | 素材来源 | 使用旧镜像或空库 |
| 目标客户端/微信通道 | 显示 | 路径无效或未送达 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 配源 | 审核授权 pack.json | URL/内容可信 |
| 试选 | catalog/pick | 图片可下载 |
| 验收 | Web 展示或微信收件 | 真实呈现/可下载 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 准备 | 授权图册源与 DSH 配置 | 内容权利 |
| 持续 | 清单/图片网络与镜像 | 实际延迟、磁盘 |
| 渠道 | Web 渲染与微信文件 | 送达率和缓存成本 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 素材获取 | 远端缓存/懒下载 | 各 CDN 稳定 |
| 贴图 | Markdown/HTTP/微信文件路径 | 实际显示/送达 |
| 概率 | 宿主掷骰和工具复用 | 模型遵循与输出频率 |

> **思考**：设置 GET 带参数即写盘，组件内无身份/CSRF 校验；等待上限可无限增大，实际外部保护需核。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把远端图册与 DSH agent 工具、Web 地址及微信文件格式打通，并由插件决定贴图概率。详见[Q02](#research-q02)。

设置路由 GET/POST 都可持久化概率与无上限 deadline；远端清单有限制但不是内容来源认证；微信文件副本和提示词不等于发送成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

设置 GET 带参数即写盘，组件内无身份/CSRF 校验；等待上限可无限增大，实际外部保护需核。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅可信图册试点，Web/微信均以收件端确认；限制等待时间并检查设置路由保护。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持镜像和路径/副本生成；真实渲染、微信送达及概率遵循未独立验证；设置 GET 可写。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/library.js、lib/remote.js、client.js、test/selftest.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、包、Host、Remote、Client 及选图源码；未运行插件或外部渠道。
- 下一步：隔离宿主用可信/恶意/慢源、Web 与微信测试端，测设置可写边界、渲染送达、延迟、prompt 缓存与概率。

**分析版本**

- **仓库**：[5V1A-afk/dsh-sticker-pack](https://github.com/5V1A-afk/dsh-sticker-pack)
- **版本号**：0.6.2（[固定提交 531f16a](https://github.com/5V1A-afk/dsh-sticker-pack/tree/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

受保护设置和交付回执能让“能选到图”升级为“已显示/送达”；尚未实现。详见[Q05](#research-q05)。

隔离宿主用可信/恶意/慢源、Web 与微信测试端，测设置可写边界、渲染送达、延迟、prompt 缓存与概率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 3222 | 2176 | 864 | — |
| .md | source | 2 | 780 | — | — | 11802 |
| .js | test | 2 | 1024 | 840 | 129 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5V1A-afk/dsh-sticker-pack/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/5V1A-afk/dsh-sticker-pack/issues?q=is%3Aissue+created%3A2026-09-22T05%3A43%3A29.137Z..2026-10-22T05%3A43%3A29.137Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5V1A-afk/dsh-sticker-pack/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A43%3A29.137Z..2026-10-22T05%3A43%3A29.137Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分素材选择、模型贴图指令和真实渠道交付；检查设置副作用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 表情包如何进入 agent 回复，哪些渠道可真正显示？

**研究主题**：场景与需求

#### 完整回答

插件订阅远端 pack.json，agent 用 catalog/pick 得到候选及可复制的 Markdown/图片地址，Web 桌面正文可插图；微信会话另生成 .wechat 文件副本并提示调用 send_to_wechat。合格结果是合适语境、可显示、不会无故拖慢回复；它不是自动保证出图，提示词仍需模型遵循，微信是否真正投递到手机作者也承认未验。基线是手工选图、直接上传或纯文本回复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-10](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L1-L10)

作者目标和缓存说明。

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-sticker-pack

给 DSH 用的表情包插件：订阅任意多个**远端 `pack.json` 素材源**（GitHub 仓库、CDN、
自己的服务器都行），把它们变成 agent 能用的图册，agent 在回复正文里直接把图贴出来
（`![sticker](C:\...\x.gif)`），不走微信、不发文件、不需要前端改动。

素材**只从配置的远端源来**：图片用到才下载，镜像到
`~/Pictures/dsh-sticker-pack/remotes/<源名>/`（**不放 `~/.dsh`**：GUI 拒绝渲染它自己配置目录里的
图片，只会显示「无法预览」），之后离线也能贴。谁都能给你加图——
往那个仓库里丢一张图、在清单里加一行，你这边什么都不用改。
```

</details>

**依据 2 · 作者声明**：[README.md:32-47](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L32-L47)

作者微信渠道和未真机验证。

<details>
<summary>查看原文（16行）</summary>

```text
## v0.6.1 变更（2026-10-15）

- **微信会话改成发文件，并且不再发动图。** v0.6.0 的做法是「让模型用 `send_to_wechat` 把图发出去」，
  实测仍然看不到：dsh-wechat-plugin 按**文件名**决定上传类型（它自己的 `lib/media-kind.js`：
  图片扩展名走图片消息，其余走普通文件），而**以图片消息发出去的那条在对方手机上不会出现** ——
  它只会在 `~/.dsh/wechat/boot.log` 留下一行 `outbound: shy.png ... (图片)`，然后手机上什么都没有。
  现在微信会话里 `sticker_pick` 会把选中的图**复制成一个 `.wechat` 结尾的副本**
  （`shy.png` → `shy.png.wechat`，放在素材缓存同级的 `wechat-out/`），通道于是按**文件**上传
  （日志里是 `(文件)`）；真扩展名留在中间，收件人看得出下载的到底是什么。
- **微信会话的候选池排除 gif。** 动图在那个通道同样是发出去不显示；池子里一张静态图都不剩时，
  才回退到全部候选（宁可有图可选，也不空手）。
- **`sticker_pick` 在微信会话里不返回 markdown**（返回空串 + 一句说明），模型手里没有可直接粘贴的
  链接，`send_to_wechat` 就成了唯一出路。
- **桌面会话一个字节没改**：同样的 `sticker_pick` 仍然返回 `![sticker](C:\...\x.jpg)`。
- 自检 **70 条断言全过**，新增 2 条覆盖「动图识别」与「`.wechat` 副本让通道按文件发送」。
- 仍需真机验证：这条链路我只在代码与日志层面确认过，没有真正发到手机上看过。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:937-983](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L937-L983)

两个模型工具。

<details>
<summary>查看原文（47行）</summary>

```text
/** `sticker_catalog` — the whole pack, so the agent knows what exists. */
function catalogTool(config) {
  return {
    name: 'sticker_catalog',
    description:
      '列出表情包图册：每张图的 id、含义标签、尺寸与适用场景。'
      + '要往回复里插图时别自己拼路径，用 sticker_pick 返回的 markdown 字段。',
    parameters: { type: 'object', properties: {}, required: [] },
    output: {
      schema: {
        type: 'object',
        properties: {
          count: { type: 'number' },
          sources: { type: 'string' },
          ok: { type: 'boolean' },
          lines: { type: 'array', items: { type: 'string' } },
          notice: { type: 'string' },
        },
        required: ['count', 'sources', 'ok', 'lines'],
      },
      render: function (_args, value) {
        const lines = [`素材库 ${value.sources}（${value.count} 张）`].concat(value.lines)
        if (value.notice !== undefined) lines.push('', value.notice)
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    execute: async function () {
      const read = await snapshotRemote(config)
      const pack = read.pack
      const value = {
        count: pack.stickers.length,
        sources: describeSources(read),
        ok: pack.ok,
        lines: library.formatCatalog(pack.stickers, { max: 40 }),
      }
      const notice = sourceNotice(read)
      if (!pack.ok) value.notice = blockedMessage(pack)
      else if (notice !== undefined) value.notice = notice
      return value
    },
  }
}

/** `sticker_pick` — one sticker plus the exact Markdown its reply must carry. */
function pickTool(config, ctx) {
  return {
    name: 'sticker_pick',
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1150-1164](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L1150-L1164)

微信文件副本提示。

<details>
<summary>查看原文（15行）</summary>

```text
      // A WeChat-bound session sends the reply body as plain text, so neither the
      // local path nor the HTTP URL renders there — the phone cannot reach this
      // machine. The channel's own tool is the only route out, and it has to be
      // handed something the channel will send as a *file*: the same bytes sent
      // as a picture do not appear on the phone at all. The notice rides on the
      // value the model is guaranteed to read.
      if (wechat) {
        const staged = wechatFileCopy(sticker)
        value.channel = 'wechat'
        // An empty markdown leaves `send_to_wechat` as the only move: a model
        // handed a link pastes it into the body, where it renders as nothing.
        value.markdown = ''
        if (staged !== undefined) value.file = staged
        notes.push(`这个会话在微信上：正文贴图不显示。用 send_to_wechat 工具把这条路径发出去（它是个文件、不是图片——在这个通道里只有文件形式收得到）：${staged === undefined ? sticker.path : staged}`)
      }
```

</details>

#### 缺口

- 真实 DSH 桌面/微信显示未独立复测。
  **影响**：展示成功率未知。
  **进一步探讨**：在隔离频道发假素材并核收件端。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远端清单、懒下载、选图和出图概率如何工作？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

远端源 URL 与最多源数经校验，镜像 pack.json 和图片到 Pictures；图片按需下载，清单/图上限分别 2/16MiB。库按 id/tag/context 纯字符串规则选候选，近期 ledger 避重复；宿主按每轮 Math.random 掷骰，把本轮结果写入 system prompt，并在 sticker_pick 里复用决定。相较纯提示词，插件控制随机掷骰和资源路径，但最终回复是否贴图仍依赖模型；概率非硬执行约束。HTTP 路由可给本地 Web 返回图像，缺路由时退本地文件路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote.js:49-69](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/remote.js#L49-L69)

远端边界与缓存。

<details>
<summary>查看原文（21行）</summary>

```text
/** How long a mirrored manifest is trusted before it is fetched again. */
const DEFAULT_TTL_MS = 10 * 60 * 1000
// Kept short on purpose: this plugin sits on a reply's critical path, so a dead
// network has to cost seconds, not a minute. On top of this, the tool entry
// points cap the whole refresh (see `TOOL_DEADLINE_MS` in lib/index.js).
const DEFAULT_TIMEOUT_MS = 6000

/** The remote is untrusted, so both directions are bounded. */
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_BYTES = 16 * 1024 * 1024
const MAX_SOURCES = 16
const MAX_STICKERS_PER_SOURCE = 2000

const MANIFEST_FILE = 'pack.json'
const SOURCE_FILE = 'source.json'
const IMAGES_FILE = 'images.json'

const ID_PATTERN = /^[A-Za-z0-9_$.-]{1,32}$/

/** In-flight fetches, so ten calls in a second still cost one request. */
const INFLIGHT = new Map()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:269-315](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L269-L315)

每轮概率决定。

<details>
<summary>查看原文（47行）</summary>

```text
function rollTurn(context, probability) {
  if (context === null || typeof context !== 'object') return undefined
  const agent = context.scope ?? context.agent
  const id = agent !== null && typeof agent === 'object' && agent.id !== undefined ? String(agent.id) : undefined
  const signal = context.signal
  if (id === undefined && (signal === null || typeof signal !== 'object')) return undefined
  const key = id === undefined ? signal : id
  const known = TURN_DECISIONS.get(key)
  if (known !== undefined && known.signal === signal) return known.decision
  const decision = Math.random() < probability
  if (TURN_DECISIONS.size >= TURN_DECISION_LIMIT) TURN_DECISIONS.clear()
  TURN_DECISIONS.set(key, { signal, decision })
  return decision
}

/**
 * Subagents do not reply to the user, so a sticker there is pointless. They are
 * identified by `options.parentAgent` — the field the agent factory sets on the
 * child (`@deepseek-ai/dsh-agent`).
 */
function isSubagent(context) {
  const agent = (context === null || typeof context !== 'object' ? undefined : (context.scope ?? context.agent)) ?? undefined
  if (agent === null || typeof agent !== 'object') return false
  if (agent.parentAgent !== undefined && agent.parentAgent !== null) return true
  const options = agent.options
  return options !== null && typeof options === 'object' && options.parentAgent !== undefined && options.parentAgent !== null
}

/**
 * The verdict this turn already reached, or a fresh one if nobody asked yet.
 *
 * `sticker_pick` calls this with the *calling* agent, so the tool and the prompt
 * cannot disagree: a turn that lost the toss gets no sticker even if the model
 * calls the tool anyway. Returns `undefined` when there is no agent to key on,
 * which the caller reads as "no verdict" rather than "no".
 */
function turnDecision(agent, probability) {
  if (agent === null || typeof agent !== 'object' || agent.id === undefined) return undefined
  if (isSubagent({ agent })) return false
  const key = String(agent.id)
  const known = TURN_DECISIONS.get(key)
  if (known !== undefined) return known.decision
  const decision = Math.random() < probability
  if (TURN_DECISIONS.size >= TURN_DECISION_LIMIT) TURN_DECISIONS.clear()
  TURN_DECISIONS.set(key, { signal: undefined, decision })
  return decision
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1092-1137](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L1092-L1137)

选图、下载和返回。

<details>
<summary>查看原文（46行）</summary>

```text
      const query = {
        avoid: Array.isArray(requested.avoid) ? requested.avoid.map(String) : [],
        recent: recentAll.slice(0, window),
        count: requested.count,
        gifBias: read.settings.gifBias,
      }
      if (typeof requested.id === 'string' && requested.id !== '') query.id = requested.id
      if (typeof requested.tag === 'string' && requested.tag !== '') query.tag = requested.tag
      if (typeof requested.context === 'string' && requested.context !== '') query.context = requested.context

      const result = await resolveSticker(config, pool, query)
      const sticker = result.sticker
      // Every candidate was pending and every download failed. An empty markdown
      // is this tool's way of saying "no sticker this time" (see the
      // `markdown === ''` branch in `render`), and it beats a link to a file that
      // does not exist.
      if (sticker === undefined || sticker.pending === true) {
        return {
          id: '',
          label: '挑不出可用的表情包：远端图还没下载成功，换一张再试或先用本地素材库',
          path: '',
          markdown: '',
          bytes: 0,
          matched: 'none',
          alternatives: [],
        }
      }
      const describe = (candidate) => {
        const item = {
          id: candidate.id,
          label: candidate.label,
          markdown: candidate.link,
        }
        if (candidate.when !== undefined) item.when = candidate.when
        if (candidate.bytes > read.largeFileBytes) item.large = true
        return item
      }
      const value = {
        id: sticker.id,
        label: sticker.label,
        path: sticker.path,
        markdown: sticker.link,
        bytes: sticker.bytes,
        matched: result.matched,
        alternatives: result.alternatives.map((candidate) => describe(candidate.sticker)),
      }
```

</details>

**依据 4 · 作者声明**：[README.md:199-230](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L199-L230)

作者设计解释。

<details>
<summary>查看原文（32行）</summary>

````text
## 三件事，各由谁负责

需求是「按上下文挑图」「加素材要方便」「别把回复拖慢」「不用每条都贴」。这四条落在
三个不同的地方，搞混了就会做成没用的一半：

| 需求 | 落在哪 | 为什么不能换个地方 |
|---|---|---|
| 按上下文挑 | `sticker_pick` 的 `context` 参数 + `library.js` 的打分 | 打分是纯字符串匹配（含义/场景/标签/尺寸偏好），不看对话 |
| 加素材方便 | 远端源仓库 + `pack.json` 清单 | 图册硬编码在代码里改一次要重启，本地文件夹又只有你一个人能改 |
| 别拖慢回复 | 扫描缓存 + 尺寸缓存 + 内存版 ledger（见「性能」） | 原来的热路径每次砍 18.13 MiB 文件头 + 同步写盘 |
| 贴图频率 | **插件自己掷骰**，结果写进 system prompt 段落（见下） | 掷骰不能交给被掷的那一方：写在提示词里就等于模型自己决定 |

### system prompt 段落：把「掷骰」和「执行」分开

「这轮要不要贴」是个随机决定，而随机决定不该由被随机的那一方来做——v0.3.0 就是那样，
所以那 60% 说了等于没说。现在插件每轮先自己掷骰，再把**结果**当成硬指令写进
`ctx.systemPrompt` 的 `sticker-pack:usage` 段（`order: 9500`，第一方段落都远低于 9000）。

概率在 0 和 1 之间时，命中的那轮（默认 60%）是：

```
表情包（宿主判定，本轮要贴）：这条回复末尾务必贴一张。
要贴时先调 sticker_pick，context 写清这条回复在回应什么、什么语气（例：「他夸我了，不好意思」「又要重跑，摆烂」）。
把返回的 markdown 原样放进回复正文，位置放在整条回复的最后：本地路径的图要等消息落定才显示，放最后读者才不用等。
不要手写图片路径，不要连着两次贴同一张。
```

没命中的那轮只有一行：

```
表情包（宿主判定，本轮不贴）：这条回复不要贴表情包，也不要调用 sticker_pick。
```
````

</details>

#### 缺口

- 未跑真实 agent 回合。
  **影响**：概率指令遵循率和缓存命中未知。
  **进一步探讨**：固定多轮对照提示词与工具输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远端来源与设置路由有哪些风险？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

远端 pack.json 可以从任意配置的 HTTP(S) 地址获取；清单是非可信输入，代码检查 id、扩展名、大小并由 id 派生本地文件名，降低路径穿越，但目标域名、重定向后的地址和内容真实性仍由用户源配置承担。设置路由把 GET 查询参数 probability/deadlineMs 直接当写入，还接受 POST；组件内未见身份或 CSRF 检查，任何能到路由的请求可调贴图概率与等待上限，实际外网可达性取决于 DSH Web 外层。deadlineMs 只要求正数无上限，用户可把远端等待时间设得很长；失败熔断/超时也是流程性能边界，不等于总响应一定快速。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote.js:56-83](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/remote.js#L56-L83)

来源和体积边界。

<details>
<summary>查看原文（28行）</summary>

```text
/** The remote is untrusted, so both directions are bounded. */
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_BYTES = 16 * 1024 * 1024
const MAX_SOURCES = 16
const MAX_STICKERS_PER_SOURCE = 2000

const MANIFEST_FILE = 'pack.json'
const SOURCE_FILE = 'source.json'
const IMAGES_FILE = 'images.json'

const ID_PATTERN = /^[A-Za-z0-9_$.-]{1,32}$/

/** In-flight fetches, so ten calls in a second still cost one request. */
const INFLIGHT = new Map()

function trimUrl(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch (err) {
    return false
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/remote.js:187-209](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/remote.js#L187-L209)

跟随重定向并读响应。

<details>
<summary>查看原文（23行）</summary>

```text
async function fetchOnce(url, limit, timeoutMs) {
  if (typeof fetch !== 'function') return { error: 'Node 运行时不支持 fetch（需要 Node 18 或更新）', retryable: false }
  const controller = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(timeoutMs)
    : undefined
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller,
      headers: { 'user-agent': 'dsh-sticker-pack', accept: 'application/json,image/*' },
    })
    if (!response.ok) {
      return { error: `HTTP ${response.status}`, retryable: response.status >= 500 || response.status === 429 }
    }
    const declared = Number(response.headers.get('content-length') || '0')
    if (Number.isFinite(declared) && declared > limit) {
      return { error: `体积 ${Math.round(declared / 1024)} KB 超过上限 ${Math.round(limit / 1024)} KB`, retryable: false }
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.length > limit) {
      return { error: `体积 ${Math.round(buffer.length / 1024)} KB 超过上限 ${Math.round(limit / 1024)} KB`, retryable: false }
    }
    return { buffer }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:474-535](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L474-L535)

deadline 与设置写入。

<details>
<summary>查看原文（62行）</summary>

```text
 * the settings page offers a 5–30 s slider for the ordinary answer plus a free
 * field for everything else, and a machine on a slow link is allowed to ask for
 * a two-minute wait. `undefined` means "no opinion" and falls through to the
 * profile config, then to the default.
 */
function asDeadline(value) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  if (typeof number !== 'number' || !Number.isFinite(number) || number <= 0) return undefined
  return Math.round(number)
}

function deadlineOf(config) {
  const fromPage = asDeadline(readSettings().deadlineMs)
  if (fromPage !== undefined) return fromPage
  const fromProfile = asDeadline((config || {}).deadlineMs)
  return fromProfile === undefined ? DEFAULT_DEADLINE_MS : fromProfile
}

/** What the settings page (and the self-test) reads back. */
function settingsSnapshot(config) {
  const fromPage = asProbability(readSettings().probability)
  const fromProfile = asProbability((config || {}).probability)
  const deadlineFromPage = asDeadline(readSettings().deadlineMs)
  const deadlineFromProfile = asDeadline((config || {}).deadlineMs)
  return {
    probability: probabilityOf(config),
    source: fromPage !== undefined ? 'settings.json' : (fromProfile !== undefined ? 'profile config' : 'default'),
    defaultProbability: DEFAULT_PROBABILITY,
    deadlineMs: deadlineOf(config),
    deadlineSource: deadlineFromPage !== undefined
      ? 'settings.json'
      : (deadlineFromProfile !== undefined ? 'profile config' : 'default'),
    defaultDeadlineMs: DEFAULT_DEADLINE_MS,
    file: SETTINGS_FILE,
  }
}

/**
 * Merge a patch from the settings page into the runtime file. Unknown keys are
 * preserved, `probability` is the only key the page owns today, and a rejected
 * value leaves the file untouched.
 */
function applySettingsPatch(config, patch) {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
    return { ok: false, error: 'body must be a JSON object', ...settingsSnapshot(config) }
  }
  const next = { ...readSettings() }
  if (Object.prototype.hasOwnProperty.call(patch, 'probability')) {
    const value = asProbability(patch.probability)
    if (value === undefined) {
      return { ok: false, error: 'probability must be a number between 0 and 1', ...settingsSnapshot(config) }
    }
    next.probability = value
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'deadlineMs')) {
    const value = asDeadline(patch.deadlineMs)
    if (value === undefined) {
      return { ok: false, error: 'deadlineMs must be a positive number of milliseconds', ...settingsSnapshot(config) }
    }
    next.deadlineMs = value
  }
  return { ok: writeSettings(next), ...settingsSnapshot(config) }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1230-1277](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L1230-L1277)

GET/POST 设置路由。

<details>
<summary>查看原文（48行）</summary>

```text
   * `GET ?probability=0.8` / `?deadlineMs=90000` also write — a deliberate
   * fallback because this process cannot see the host's route table, and if
   * plugin routes turn out to be GET/HEAD-only (as `/api/*` is) the page would
   * otherwise be read-only.
   */
  function settingsRoute(req, res) {
    const url = new URL(req.url || '/', 'http://x')
    if (req.method !== 'POST') {
      if (url.searchParams.has('probability') || url.searchParams.has('deadlineMs')) {
        const patch = {}
        if (url.searchParams.has('probability')) patch.probability = url.searchParams.get('probability')
        if (url.searchParams.has('deadlineMs')) patch.deadlineMs = url.searchParams.get('deadlineMs')
        const result = applySettingsPatch(config, patch)
        trace(`settings: probability -> ${Math.round(result.probability * 100)}% (${result.source}) deadline -> ${result.deadlineMs}ms (${result.deadlineSource}) ok=${result.ok}`)
        send(res, result.ok ? 200 : 400, JSON.stringify(result), json)
        return
      }
      send(res, 200, JSON.stringify({ ok: true, ...settingsSnapshot(config) }), json)
      return
    }
    let body = ''
    let settled = false
    req.on('data', (chunk) => {
      if (settled) return
      body += chunk
      if (body.length > 16 * 1024) {
        settled = true
        send(res, 413, JSON.stringify({ ok: false, error: 'body too large' }), json)
        req.destroy()
      }
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      let patch
      try {
        patch = body.trim() === '' ? {} : JSON.parse(body)
      } catch (err) {
        send(res, 400, JSON.stringify({ ok: false, error: 'body is not valid JSON' }), json)
        return
      }
      const result = applySettingsPatch(config, patch)
      trace(`settings: probability -> ${Math.round(result.probability * 100)}% (${result.source}) deadline -> ${result.deadlineMs}ms (${result.deadlineSource}) ok=${result.ok}`)
      send(res, result.ok ? 200 : 400, JSON.stringify(result), json)
    })
    req.on('error', () => {
      settled = true
    })
```

</details>

**依据 5 · 作者声明**：[README.md:14-30](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L14-L30)

作者确认无上限与 GET 写。

<details>
<summary>查看原文（17行）</summary>

```text
## v0.6.2 变更（2026-10-15）

- **熔断时间（等待上限）交给用户。** 之前写死的 15 秒现在由设置决定：DSH 设置面板的「表情包」
  一节与独立设置页 `/sticker-pack/settings.html` 都多了同一组控件——**5–30 秒滑杆**（默认 15 秒，
  另有 5/10/15/30 快捷键）+ **一个无上限的秒数输入框**（`min=1`、**没有 `max`**，填 90 就是 90 秒）。
  值存 `~/.dsh/sticker-pack/settings.json` 的 `deadlineMs`，**保存即生效，不用重启**。
  理由：这 15 秒是这台机器网络的属性，不是插件的属性——CDN 连不上的那台机器上，等多久合适只有用户知道。
- **取值规则**：正数即可，**无上限**；`0`/负数/非数字被拒（HTTP 400，文件不动），缺省回落到 15 秒。
  优先级 `settings.json` > profile 配置的 `deadlineMs` > 默认 `DEFAULT_DEADLINE_MS = 15000`
  （快照里同时给出 `deadlineSource` 与 `defaultDeadlineMs`）。
- **`GET` 也能写**：`/sticker-pack/settings?deadlineMs=90000` 与 `?probability=` 同级，可一起送
  （理由同下：万一插件路由只转发 GET/HEAD，设置页至少还能写）。
- 自检 **90 条断言全过**（v0.6.1 是 70），新增 20 条覆盖等待上限：默认值、字符串入参、
  **超过滑杆范围不被夹紧**（120000 ms 原样保留）、0/负数回落、GET 写、POST 写、非法值 400 且文件不动、
  设置页两处控件、客户端面板两处控件——其中面板那条断言的正是**数字框没有 `max`**，
  因为「无上限」本身就是需求。
- 仍未真机验证：面板控件只在桩 React 下渲染断言过，没有在真实 GUI 里点过；要等重启 dsh 后才算数。
```

</details>

#### 缺口

- 未核宿主鉴权和反代。
  **影响**：设置接口的真实暴露范围未知。
  **进一步探讨**：以未登录、跨站页面与外网路径测试。
- 未做恶意源/慢网络试验。
  **影响**：内容和响应时延风险未量化。
  **进一步探讨**：mock 重定向、巨型流与故障源。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、素材分发与回复开销如何估算？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.6.2 MIT，Web client 与 host，依赖 DSH tools/systemPrompt/webServer 可用性及远端 CDN/图片版权许可；默认附作者配置源。每次网络刷新有清单和懒图片下载，磁盘镜像位于 Pictures；工具等待上限默认 15 秒、可配置任意正数，源失败有 10 分钟冷却。中间概率状态进入 system prompt，0<p<1 时文本每轮变化会削弱前缀缓存，这是作者明确承认的成本；微信副本也占磁盘并依赖外部通道行为。性能和断网情形仅有作者自检/报告，没有独立运行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-42](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/package.json#L1-L42)

包与 Web client。

<details>
<summary>查看原文（42行）</summary>

```text
{
  "name": "dsh-sticker-pack",
  "version": "0.6.2",
  "description": "DSH 表情包插件：订阅远端 pack.json 素材源，把它们变成 agent 可用的表情包，agent 在回复正文里内联贴图；贴图概率由插件自己掷骰，出图在 HTTP 与本地路径之间自动择优，微信会话改发静态图文件，熔断等待上限由用户在设置里调（5–30 秒滑杆或任意秒数）。",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/5V1A-afk/dsh-sticker-pack.git"
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "sticker",
    "表情包"
  ],
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "client.js",
    "test",
    "cordis.patch.yml",
    "README.md"
  ],
  "scripts": {
    "selftest": "node test/selftest.js",
    "perf": "node test/perf-probe.js"
  },
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
```

</details>

**依据 2 · 作者声明**：[README.md:14-30](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L14-L30)

等待上限和自检。

<details>
<summary>查看原文（17行）</summary>

```text
## v0.6.2 变更（2026-10-15）

- **熔断时间（等待上限）交给用户。** 之前写死的 15 秒现在由设置决定：DSH 设置面板的「表情包」
  一节与独立设置页 `/sticker-pack/settings.html` 都多了同一组控件——**5–30 秒滑杆**（默认 15 秒，
  另有 5/10/15/30 快捷键）+ **一个无上限的秒数输入框**（`min=1`、**没有 `max`**，填 90 就是 90 秒）。
  值存 `~/.dsh/sticker-pack/settings.json` 的 `deadlineMs`，**保存即生效，不用重启**。
  理由：这 15 秒是这台机器网络的属性，不是插件的属性——CDN 连不上的那台机器上，等多久合适只有用户知道。
- **取值规则**：正数即可，**无上限**；`0`/负数/非数字被拒（HTTP 400，文件不动），缺省回落到 15 秒。
  优先级 `settings.json` > profile 配置的 `deadlineMs` > 默认 `DEFAULT_DEADLINE_MS = 15000`
  （快照里同时给出 `deadlineSource` 与 `defaultDeadlineMs`）。
- **`GET` 也能写**：`/sticker-pack/settings?deadlineMs=90000` 与 `?probability=` 同级，可一起送
  （理由同下：万一插件路由只转发 GET/HEAD，设置页至少还能写）。
- 自检 **90 条断言全过**（v0.6.1 是 70），新增 20 条覆盖等待上限：默认值、字符串入参、
  **超过滑杆范围不被夹紧**（120000 ms 原样保留）、0/负数回落、GET 写、POST 写、非法值 400 且文件不动、
  设置页两处控件、客户端面板两处控件——其中面板那条断言的正是**数字框没有 `max`**，
  因为「无上限」本身就是需求。
- 仍未真机验证：面板控件只在桩 React 下渲染断言过，没有在真实 GUI 里点过；要等重启 dsh 后才算数。
```

</details>

**依据 3 · 作者声明**：[README.md:66-75](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L66-L75)

作者失败冷却与慢网络教训。

<details>
<summary>查看原文（10行）</summary>

```text
## v0.5.1 变更（2026-10-15）

- **网络再慢也拖不住回复。** 工具入口给整次远端同步加了 **9 秒硬上限**（当时叫 `TOOL_DEADLINE_MS`，v0.6.0 起放宽到 15 秒，
  v0.6.2 起改为用户可在设置里调的「等待上限」，默认仍是 15 秒，`lib/index.js`）：超时就用本机已有的镜像回答，并把原因写进 `notice`，而不是继续等。
- **失败熔断。** 某个源拉取失败后 **10 分钟内不再重试**（拉清单时的 `fresh` 强制刷新可绕过）；
  期间有镜像就沿用镜像。以前每一轮回复都会从头把超时和重试再付一遍。
- 默认单源超时 **15 秒 → 6 秒**，重试 **3 次 → 2 次**（`lib/remote.js` 的 `DEFAULT_TIMEOUT_MS`
  与 `DEFAULT_ATTEMPTS`）。
- 来历：别人装完出现「agent 一直在思考、不回复」。他那边连不上 CDN，每轮回复都在等约
  47 秒的超时与重试——v0.5.0 加默认远端源时没给这条路径设上限，是这次的锅。
```

</details>

**依据 4 · 作者声明**：[README.md:144-151](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L144-L151)

作者提示词缓存代价。

```text
## v0.4.0 变更（2026-10-14）

- **贴图概率改由插件掷骰，不再是写给模型看的一句话**。v0.3.0 那段 system prompt 里写的是
  「有约 60% 的概率贴一张，随机决定即可」——掷骰的是模型，插件说什么都不算数。现在每轮
  由插件先掷一个骰子，再把**结果**当成硬指令写进那段文本：命中写「本轮要贴」，
  没命中写「本轮不贴」。模型只执行，不随机。`0%` 和 `100%` 两个端点直接退化成恒定文本。
- **代价写在明处**：那段文本每轮都会变，等于每轮让 system prompt 之后的前缀缓存失效。
  想要缓存稳定，就把概率设成 `0` 或 `1`（文本恒定），或者 `prompt: false` 关掉整段。
```

**依据 5 · 源码核查**：[lib/index.js:375-386](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L375-L386)

微信副本。

<details>
<summary>查看原文（12行）</summary>

```text
function wechatFileCopy(sticker) {
  const source = sticker !== null && typeof sticker === 'object' && typeof sticker.path === 'string' ? sticker.path : ''
  if (source === '') return undefined
  const target = join(WECHAT_OUT_DIRECTORY, `${sticker.id}${extname(source)}.wechat`)
  try {
    if (!existsSync(target) || statSync(target).size !== sticker.bytes) {
      mkdirSync(dirname(target), { recursive: true })
      copyFileSync(source, target)
    }
    return target
  } catch (err) {
    trace(`wechat: staging a file copy failed for ${source} — ${(err && err.message) || String(err)}`)
```

</details>

#### 缺口

- 无真实回复耗时和 token 缓存数据。
  **影响**：净体验与成本未知。
  **进一步探讨**：固定素材数和网络状态测延迟/缓存/磁盘。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样低风险试用并验证图像交付而非仅有路径？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先配置可信且获授权的图册源，在隔离 Web 会话核真正显示；把等待上限控制在可接受范围，微信须让测试收件人确认收到文件。未实现的改进是假设设置只允许有 CSRF/身份保护的 POST、预览远端内容与大小、每次交付记录渲染/发送结果而非仅返回路径，并把静态概率决策留在工具状态而非变化的 system prompt；比较现行版本的出图准确率、实际渲染率、回应延迟、缓存命中和设置被误改。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1230-1277](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L1230-L1277)

当前 GET 写。

<details>
<summary>查看原文（48行）</summary>

```text
   * `GET ?probability=0.8` / `?deadlineMs=90000` also write — a deliberate
   * fallback because this process cannot see the host's route table, and if
   * plugin routes turn out to be GET/HEAD-only (as `/api/*` is) the page would
   * otherwise be read-only.
   */
  function settingsRoute(req, res) {
    const url = new URL(req.url || '/', 'http://x')
    if (req.method !== 'POST') {
      if (url.searchParams.has('probability') || url.searchParams.has('deadlineMs')) {
        const patch = {}
        if (url.searchParams.has('probability')) patch.probability = url.searchParams.get('probability')
        if (url.searchParams.has('deadlineMs')) patch.deadlineMs = url.searchParams.get('deadlineMs')
        const result = applySettingsPatch(config, patch)
        trace(`settings: probability -> ${Math.round(result.probability * 100)}% (${result.source}) deadline -> ${result.deadlineMs}ms (${result.deadlineSource}) ok=${result.ok}`)
        send(res, result.ok ? 200 : 400, JSON.stringify(result), json)
        return
      }
      send(res, 200, JSON.stringify({ ok: true, ...settingsSnapshot(config) }), json)
      return
    }
    let body = ''
    let settled = false
    req.on('data', (chunk) => {
      if (settled) return
      body += chunk
      if (body.length > 16 * 1024) {
        settled = true
        send(res, 413, JSON.stringify({ ok: false, error: 'body too large' }), json)
        req.destroy()
      }
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      let patch
      try {
        patch = body.trim() === '' ? {} : JSON.parse(body)
      } catch (err) {
        send(res, 400, JSON.stringify({ ok: false, error: 'body is not valid JSON' }), json)
        return
      }
      const result = applySettingsPatch(config, patch)
      trace(`settings: probability -> ${Math.round(result.probability * 100)}% (${result.source}) deadline -> ${result.deadlineMs}ms (${result.deadlineSource}) ok=${result.ok}`)
      send(res, result.ok ? 200 : 400, JSON.stringify(result), json)
    })
    req.on('error', () => {
      settled = true
    })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1150-1164](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/lib/index.js#L1150-L1164)

微信仅提示发送文件。

<details>
<summary>查看原文（15行）</summary>

```text
      // A WeChat-bound session sends the reply body as plain text, so neither the
      // local path nor the HTTP URL renders there — the phone cannot reach this
      // machine. The channel's own tool is the only route out, and it has to be
      // handed something the channel will send as a *file*: the same bytes sent
      // as a picture do not appear on the phone at all. The notice rides on the
      // value the model is guaranteed to read.
      if (wechat) {
        const staged = wechatFileCopy(sticker)
        value.channel = 'wechat'
        // An empty markdown leaves `send_to_wechat` as the only move: a model
        // handed a link pastes it into the body, where it renders as nothing.
        value.markdown = ''
        if (staged !== undefined) value.file = staged
        notes.push(`这个会话在微信上：正文贴图不显示。用 send_to_wechat 工具把这条路径发出去（它是个文件、不是图片——在这个通道里只有文件形式收得到）：${staged === undefined ? sticker.path : staged}`)
      }
```

</details>

**依据 3 · 作者声明**：[README.md:32-47](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L32-L47)

作者承认手机未验。

<details>
<summary>查看原文（16行）</summary>

```text
## v0.6.1 变更（2026-10-15）

- **微信会话改成发文件，并且不再发动图。** v0.6.0 的做法是「让模型用 `send_to_wechat` 把图发出去」，
  实测仍然看不到：dsh-wechat-plugin 按**文件名**决定上传类型（它自己的 `lib/media-kind.js`：
  图片扩展名走图片消息，其余走普通文件），而**以图片消息发出去的那条在对方手机上不会出现** ——
  它只会在 `~/.dsh/wechat/boot.log` 留下一行 `outbound: shy.png ... (图片)`，然后手机上什么都没有。
  现在微信会话里 `sticker_pick` 会把选中的图**复制成一个 `.wechat` 结尾的副本**
  （`shy.png` → `shy.png.wechat`，放在素材缓存同级的 `wechat-out/`），通道于是按**文件**上传
  （日志里是 `(文件)`）；真扩展名留在中间，收件人看得出下载的到底是什么。
- **微信会话的候选池排除 gif。** 动图在那个通道同样是发出去不显示；池子里一张静态图都不剩时，
  才回退到全部候选（宁可有图可选，也不空手）。
- **`sticker_pick` 在微信会话里不返回 markdown**（返回空串 + 一句说明），模型手里没有可直接粘贴的
  链接，`send_to_wechat` 就成了唯一出路。
- **桌面会话一个字节没改**：同样的 `sticker_pick` 仍然返回 `![sticker](C:\...\x.jpg)`。
- 自检 **70 条断言全过**，新增 2 条覆盖「动图识别」与「`.wechat` 副本让通道按文件发送」。
- 仍需真机验证：这条链路我只在代码与日志层面确认过，没有真正发到手机上看过。
```

</details>

**依据 4 · 作者声明**：[README.md:144-151](https://github.com/5V1A-afk/dsh-sticker-pack/blob/531f16a8f0a4f0ed9d9868ab0b0f8960b0322781/README.md#L144-L151)

变动提示词缓存。

```text
## v0.4.0 变更（2026-10-14）

- **贴图概率改由插件掷骰，不再是写给模型看的一句话**。v0.3.0 那段 system prompt 里写的是
  「有约 60% 的概率贴一张，随机决定即可」——掷骰的是模型，插件说什么都不算数。现在每轮
  由插件先掷一个骰子，再把**结果**当成硬指令写进那段文本：命中写「本轮要贴」，
  没命中写「本轮不贴」。模型只执行，不随机。`0%` 和 `100%` 两个端点直接退化成恒定文本。
- **代价写在明处**：那段文本每轮都会变，等于每轮让 system prompt 之后的前缀缓存失效。
  想要缓存稳定，就把概率设成 `0` 或 `1`（文本恒定），或者 `prompt: false` 关掉整段。
```

#### 缺口

- 受保护设置、交付回执未实现。
  **影响**：不能视作当前功能。
  **进一步探讨**：在隔离宿主和渠道做对照。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
