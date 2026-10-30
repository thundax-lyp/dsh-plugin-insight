# dsh-sticker-pack

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[92e492d](https://github.com/5V1A-afk/dsh-sticker-pack/tree/92e492d0080cc651fd3f7010adc36d5f066caa63)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5V1A-afk/dsh-sticker-pack)
<!-- END META -->

> **功能**：为DSH回复提供远端图册/概率选图、Web链接与微信文件副本；真正显示/发送及总等待需验。

> **亮点**：把远端图册、宿主coin/工具和HTTP/本地路径组合成可用选图入口；具体增量是资源供给与正常caller下的概率门禁，不是硬输出频率、已发送或已验证语义推荐。见[Q02](#research-q02)。

> **主要限制**：非POST查询可写设置且本组件无准入；15秒只清单race不含后续懒图，gif与.gif字段不匹配，.wechat只是原字节副本/发送提示。源更新/撤图也不等缓存同步，源码条件未冒充实机失败，见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 它是插件还是图册，真正交付是什么？](#detail-section-11)
  - [Q02 · 清单、缓存、字符串选图、每轮概率和近期记录怎样实际工作？](#detail-section-12)
  - [Q03 · 微信、设置权限和响应时限有哪些真实边界？](#detail-section-13)
  - [Q04 · 安装、使用、维护和退出的条件/成本/效果怎样比较？](#detail-section-14)
  - [Q05 · 现有概率/缓存之外，是否值得做新的可验证贴图能力？](#detail-section-15)
  - [Q06 · 当前适合谁，什么时候应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对话中适度用合适表情图的偏好便利，以目标端真实显示/收到和可接受等待验收；图片数、id、路径和Markdown不是交付。见[Q01](#research-q01)。

手工上传/粘图、固定快捷图或纯文本是直接替代；插件主要省查素材/拼路径，未证随机更多图能改善偏好/任务。不是独立Agent或新的图像生成模型，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图册/选图 | remote镜像、字符串查图/候选 | 来源/授权另核，旧文件复用/残留不是撤销同步 |
| 概率/工具 | 宿主coin与正常caller下false门禁 | 缺caller放行，非正文强约束/显示反馈 |
| Web/本地展示 | 提供图片route或宿主文件链接 | 默认loopback/路径不保证远程端，备选未必下载 |
| 微信适配提示 | 工作区识别、.wechat同字节副本 | gif字段判断不匹配，无转码/实际发送/收件证明 |
| 设置/等待 | 概率/局部deadline及状态 | GET可写/无局部准入；15秒不包含后续图总耗时 |

**流程与依赖**

素材内容/授权、真实可达URL/磁盘、宿主tool/prompt/turn接口和可选微信发送能力是不同前提；plugin安装不补全渠道。完整条件表见[Q04](#research-q04)。

先固定小图册并核访问/URL，再以真实语境比较手工图/纯文本；慢源/撤图/备选/微信和退出分别验，不用概率0代替卸载或断网。步骤和失败判据见[Q04](#research-q04)。

**效果与成本**

负担集中在网络尾延迟、模型工具/变化提示词、图源维护和副本/镜像清理；15秒及16MiB都不能按注释当整任务资源硬界。四阶段明细见[Q04](#research-q04)，无实际token/缓存/工时或节省数据。

当前可检查的是选图和路径供给；recent连备选都记录，不是显示/收件或语境满意度。效果表见[Q04](#research-q04)，简单替代和可否定反馈假设见[Q05](#research-q05)。

> **思考**：非POST查询可写设置且本组件无准入；15秒只清单race不含后续懒图，gif与.gif字段不匹配，.wechat只是原字节副本/发送提示。源更新/撤图也不等缓存同步，源码条件未冒充实机失败，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把远端图册、宿主coin/工具和HTTP/本地路径组合成可用选图入口；具体增量是资源供给与正常caller下的概率门禁，不是硬输出频率、已发送或已验证语义推荐。见[Q02](#research-q02)。

镜像/懒图、头部尺寸缓存、每轮coin与工具门禁可借鉴；移植须统一字段/身份与真实总预算、更新/撤销和目标端回执，不能以返回路径或作者“必收到”代替交付。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

非POST查询可写设置且本组件无准入；15秒只清单race不含后续懒图，gif与.gif字段不匹配，.wechat只是原字节副本/发送提示。源更新/撤图也不等缓存同步，源码条件未冒充实机失败，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先修/验设置/预算/字段与可信图册Web显示，再决定是否值得试用；任何误图、慢回复、误改或停不住下载先查在途后退回简单方式，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持图册/coin/工具/链接和副本路径；设置、整次预算、格式/缓存与渠道交付有具体边界，未跑宿主/收件/性能。观察，先做可信小图册验收。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、cordis.patch.yml、lib/index.js、lib/library.js、lib/remote.js、lib/settings.html、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根/Host/client/设置页，定向核tools/prompt/route装配、remote校验/读取/重试/镜像/ensureFile、库描述/字段/规则/残留文件、coin/turn caller与recent、真实HTTP/本地链接、微信工作区/副本、设置写及局部deadline/后续懒图和退出。未逐图视觉/授权审阅、全审所有解析/页面、宿主准入或外部微信实现，未运行目标/测试/网络/发送。
- 下一步：只读固定Git/原件及研究装配；未安装、执行目标测试/代码、访问活CDN或发送渠道。后续以小图册测caller/轮次、换图撤图同名源、首图/备选渲染、慢网总时延/取消、设置访问及真实收件，再评偏好/全成本，见[Q06](#research-q06)。

**分析版本**

- **仓库**：[5V1A-afk/dsh-sticker-pack](https://github.com/5V1A-afk/dsh-sticker-pack)
- **版本号**：0.6.2（[固定提交 92e492d](https://github.com/5V1A-afk/dsh-sticker-pack/tree/92e492d0080cc651fd3f7010adc36d5f066caa63)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修准入/字段/总预算与缓存语义，再验证最小可显示主图和目标端结果反馈是否胜过预热/手工图/纯文本；只有真实展示、偏好和延迟净改善才提炼方向，不先建跨渠道平台。未实现/验证，见[Q05](#research-q05)。

只读固定Git/原件及研究装配；未安装、执行目标测试/代码、访问活CDN或发送渠道。后续以小图册测caller/轮次、换图撤图同名源、首图/备选渲染、慢网总时延/取消、设置访问及真实收件，再评偏好/全成本，见[Q06](#research-q06)。

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

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5V1A-afk/dsh-sticker-pack/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/5V1A-afk/dsh-sticker-pack/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/5V1A-afk/dsh-sticker-pack/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核贴图从图源/coin/工具到真实显示或发送的区别，以及设置、缓存、预算/退出条件，对照手工图/纯文本后判断采用和机会。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是插件还是图册，真正交付是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根组件是DSH插件dsh-sticker-pack0.6.2、MIT，CommonJS入口lib/index.js和Web client.js均已提交；它会注册sticker_catalog/sticker_pick、提示词与HTTP/设置界面，不是只有静态图片的资源目录。tools是声明依赖，systemPrompt/webServer分别按需获取，实际宿主工具/slots等结构仍须验收；没有额外模型服务或独立Agent循环，选图请求与最后怎么回复由宿主模型处理。

对象是希望对话适度插入合适表情图的人。合格结果是语境/个人偏好合适、目标端真正显示或收到且没有不合理拖慢回复，不是目录数、选到id、文件存在或Markdown字符串。与手工上传/粘图、固定快捷短语或纯文本相比，增量是把远端图册接进模型工具、让宿主掷骰并给出路径/HTTP链接，省找素材步骤；并没有独立证据表明更多图或随机频率提升用户体验。

Git里有stickers和pack.json，但package.files没有stickers；当前settingsOf的活动库只来自已配置远端清单的镜像，不再扫描任意本地目录。默认源是jsDelivr的仓库@main URL，没有固定到本轮SHA，所以固定代码不等图册内容也固定，首次离线安装不保证齐图。代码MIT不代表每个远端图片的来源授权/适用语境已经核实；本轮没有逐张视觉审阅或真实渠道发送，不替素材做质量/权利背书。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-43](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/package.json#L1-L43)

根身份、入口、分发files、许可和Web声明。

<details>
<summary>查看原文（43行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1513-1544](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1513-L1544)

真实工具/路由/提示词装配与退出。

<details>
<summary>查看原文（32行）</summary>

```text
    const tools = service(ctx, 'tools')
    const webServer = service(ctx, 'webServer')
    trace(`apply entered — tools=${typeof tools} webServer=${typeof webServer} ${ctxSummary(ctx)}`)
    if (tools === undefined) {
      trace('apply: no tools service, sticker tools NOT registered')
    } else {
      disposers.push(registerTool(tools, ctx, catalogTool(config)))
      disposers.push(registerTool(tools, ctx, pickTool(config, ctx)))
    }
    registerRoutesWhenReady(ctx, config)
    if ((config || {}).prompt === false) trace('prompt: disabled by config')
    else {
      const stopPrompt = registerPromptWhenReady(ctx, config)
      if (typeof stopPrompt === 'function') disposers.push(stopPrompt)
    }
  } catch (err) {
    trace(`apply THREW: ${(err && err.stack) || String(err)}`)
  }
  if (typeof ctx.on === 'function') {
    ctx.on('dispose', function () {
      for (const dispose of disposers) dispose()
      flushRecent()
    })
  }
  trace('apply finished')
}

module.exports = {
  name,
  inject,
  apply,
  default: { name, inject, apply },
```

</details>

**依据 3 · 源码核查**：[client.js:280-300](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/client.js#L280-L300)

实际Web设置插槽。

<details>
<summary>查看原文（21行）</summary>

```text
    function apply(ctx) {
      const register = () =>
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: 'sticker-pack',
              // Built-in sections sit in the 10..30 range, so this lands after them.
              order: 60,
              label: () => '表情包',
            },
            Panel,
          ),
        )
      if (typeof ctx.effect === 'function') ctx.effect(register)
      else register()
    }

    return { apply, inject }
  },
})
```

</details>

**依据 4 · 源码核查**：[lib/index.js:399-405](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L399-L405)

默认远端@main未绑定研究SHA。

```text
const DEFAULT_REMOTES = [
  {
    url: 'https://gcore.jsdelivr.net/gh/5V1A-afk/dsh-sticker-pack@main/stickers/pack.json',
    name: '大肥鱼',
  },
]

```

**依据 5 · 源码核查**：[lib/index.js:575-589](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L575-L589)

活动库仅remotes镜像。

<details>
<summary>查看原文（15行）</summary>

```text
  const base = typeof given.httpBaseUrl === 'string' ? given.httpBaseUrl.trim().replace(/\/+$/u, '') : ''
  const style = typeof given.linkStyle === 'string' ? given.linkStyle.trim().toLowerCase() : 'auto'
  return {
    // The only source of stickers since v0.5.0: every remote manifest is
    // mirrored into a folder of its own and read from there. No local folder
    // is scanned any more, so this list is the whole library.
    remotes: configuredRemotes(config),
    // A mirror is refreshed at most once per TTL, and never on a path that a
    // reply is waiting on: see `snapshotRemote` versus `snapshot`.
    remoteTtlMs: numberSetting(config, 'remoteTtlMs', remote.DEFAULT_TTL_MS),
    remoteTimeoutMs: numberSetting(config, 'remoteTimeoutMs', remote.DEFAULT_TIMEOUT_MS),
    // How long a tool call may wait on the network before it answers from the
    // mirror. Owned by the settings page since 2026-10-15: a 5–30 s slider plus
    // a free field, because how long a wait is acceptable is a property of the
    // machine's link, not of this plugin.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 清单、缓存、字符串选图、每轮概率和近期记录怎样实际工作？

**研究主题**：功能与机制、工程质量与复用、贡献与相对优势

#### 完整回答

远端源只接受HTTP(S)，最多16源；manifest最多读取前2000项，校验id和图片扩展名，由id派生本地文件名。清单写images/source/pack元数据，图片按需ensureFile，旧镜像可在失败后继续用，源失败有冷却；同URL的inflight Promise可共用。它不是语义向量检索或个人偏好学习：library按id/tag/context字符串打分，近期和avoid是偏好，排空时会退全池，指名id也可退原列表，同分可按GIF权重抽样。

正常有agent/turn信息时，prompt rollTurn记录宿主coin，sticker_pick从exec.agent读turnDecision；false会直接返回空Markdown，说明不只是让模型自觉掷骰。turn/start和signal变化负责刷新决定，子代理有跳过意图；但依赖宿主传相同agent/轮次。turnDecision遇缺agent/id返回undefined，execute只拦false，因此缺caller会放行，即使概率设0也不能把该分支当强制停止。模型还可能复用旧URL或不遵循prompt，最终正文不是按token强制拦截的概率输出。

主图pending时真实走resolveSticker→fetchPending→remote.ensureFile，最多尝试3个候选，成功后重读库；失败可返回空Markdown而不是保证出图。备选不都预下载，本地链接方式下仍可能指向未落盘文件；HTTP图片route可另触发懒下载。value返回所选路径/Markdown后就把主图和alternatives一起记recent，故近期记录是“提供过候选”而不是实际显示/送达回执。

缓存还有内容变更边界：ensureFile遇同路径非零文件直接复用，不核新URL/内容hash；同id/扩展名换远端图不保证更新本地字节。同步manifest也不删除旧图片，loader会自动纳入未登记残留文件，因此源端删项不等本地撤图。源列表只按URL去重，缓存目录却主要取name slug，同名不同URL可共用目录；多源时应给唯一名称并核实际来源。这些是源码条件，不作为已运行缓存故障。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote.js:105-125](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/remote.js#L105-L125)

URL去重/源数边界及name。

<details>
<summary>查看原文（21行）</summary>

```text
function parseRemotes(raw) {
  const list = Array.isArray(raw) ? raw : (raw === undefined || raw === null || raw === '' ? [] : [raw])
  const seen = new Set()
  const sources = []
  for (const item of list) {
    if (sources.length >= MAX_SOURCES) break
    let url = ''
    let name = ''
    if (typeof item === 'string') {
      url = trimUrl(item)
    } else if (item !== null && typeof item === 'object') {
      url = trimUrl(item.url || item.manifest || item.src)
      name = trimUrl(item.name)
    }
    if (!isHttpUrl(url) || seen.has(url)) continue
    seen.add(url)
    sources.push({ url, name: name === '' ? deriveName(url) : name })
  }
  return sources
}

```

</details>

**依据 2 · 源码核查**：[lib/remote.js:143-147](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/remote.js#L143-L147)

镜像目录按name生成。

```text
  const slug = slugOf(source.name) || `remote-${hashOf(source.url)}`
  return join(cacheDirectory, 'remotes', slug)
}

function readJson(file) {
```

**依据 3 · 源码核查**：[lib/remote.js:276-324](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/remote.js#L276-L324)

id/扩展名/文件名与图像映射。

<details>
<summary>查看原文（49行）</summary>

```text
  const used = new Set()

  for (const item of list.slice(0, MAX_STICKERS_PER_SOURCE)) {
    if (item === null || typeof item !== 'object') {
      skipped.push('非对象条目')
      continue
    }
    const id = typeof item.id === 'string' ? item.id.trim() : ''
    if (!ID_PATTERN.test(id)) {
      skipped.push(`id 不合法：${id === '' ? '(空)' : id}`)
      continue
    }
    if (used.has(id.toLowerCase())) {
      skipped.push(`id 重复：${id}`)
      continue
    }
    const relative = trimUrl(item.file || item.path || item.src)
    const absolute = trimUrl(item.url)
    let resolved = ''
    if (absolute !== '') resolved = absolute
    else if (relative !== '') {
      try {
        resolved = new URL(relative, manifestUrl).toString()
      } catch (err) {
        resolved = ''
      }
    }
    if (!isHttpUrl(resolved)) {
      skipped.push(`${id}：缺少可用的图片地址`)
      continue
    }
    const extension = extensionOf(resolved)
    if (extension === undefined) {
      skipped.push(`${id}：不是支持的图片格式（${resolved}）`)
      continue
    }
    used.add(id.toLowerCase())
    const file = `${id}${extension}`
    const sticker = { id, file, label: typeof item.label === 'string' && item.label !== '' ? item.label : id }
    if (Array.isArray(item.tags)) sticker.tags = item.tags.map((tag) => String(tag)).filter((tag) => tag !== '')
    if (typeof item.when === 'string' && item.when !== '') sticker.when = item.when
    stickers.push(sticker)
    images[id] = { url: resolved, file }
  }

  return {
    manifest: {
      version: 1,
      name,
```

</details>

**依据 4 · 源码核查**：[lib/remote.js:485-518](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/remote.js#L485-L518)

实际ensureFile：已有非零文件即复用及写图。

<details>
<summary>查看原文（34行）</summary>

```text
  const settings = args || {}
  const directory = settings.directory
  const file = settings.file
  const url = settings.url
  if (typeof directory !== 'string' || typeof file !== 'string') return undefined
  const target = join(directory, file)
  if (url === undefined || url === null || url === '') return existsSync(target) ? target : undefined
  if (existsSync(target)) {
    try {
      if (statSync(target).size > 0) return target
    } catch (err) {
      // fall through to download
    }
  }
  const fetched = await once(url, () => fetchBounded(url, MAX_IMAGE_BYTES, typeof settings.timeoutMs === 'number' ? settings.timeoutMs : DEFAULT_TIMEOUT_MS))
  if (fetched.error !== undefined) return undefined
  try {
    mkdirSync(directory, { recursive: true })
    const temporary = `${target}.tmp-${process.pid}`
    writeFileSync(temporary, fetched.buffer)
    try {
      renameSync(temporary, target)
    } catch (err) {
      unlinkSync(temporary)
      throw err
    }
  } catch (err) {
    return undefined
  }
  return target
}

module.exports = {
  DEFAULT_TTL_MS,
```

</details>

**依据 5 · 源码核查**：[lib/library.js:694-715](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/library.js#L694-L715)

recent/avoid为空后的偏好fallback。

<details>
<summary>查看原文（22行）</summary>

```text
function pickSticker(stickers, query) {
  const asked = query || {}
  const random = typeof asked.random === 'function' ? asked.random : Math.random
  const recent = new Set((asked.recent || []).map((value) => String(value).toLowerCase()))
  const avoid = new Set((asked.avoid || []).map((value) => String(value).toLowerCase()))
  const wanted = Number.isFinite(asked.count) ? Math.max(1, Math.min(5, Math.floor(asked.count))) : 1
  // Animated images are drawn this many times as often as still ones. 1 restores
  // a plain uniform draw; anything <= 1 is treated as 1.
  const gifBias = Number.isFinite(asked.gifBias) && asked.gifBias > 1 ? asked.gifBias : 1

  const isRecent = (sticker) => recent.has(sticker.id.toLowerCase())
  const withoutAvoid = stickers.filter((sticker) => !avoid.has(sticker.id.toLowerCase()))
  const usable = withoutAvoid.length > 0 ? withoutAvoid : stickers
  const prefer = usable.filter((sticker) => !isRecent(sticker))
  const pool = prefer.length > 0 ? prefer : usable

  const done = (sticker, matched, ranked, score) => {
    const rest = (ranked || []).filter((candidate) => candidate.sticker.id !== sticker.id)
    return { sticker, matched, score, alternatives: rest.slice(0, Math.max(0, wanted - 1)) }
  }

  /** Best score first, then anything not used recently. */
```

</details>

**依据 6 · 源码核查**：[lib/library.js:741-768](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/library.js#L741-L768)

id/tag/context字符串选择。

<details>
<summary>查看原文（28行）</summary>

```text

  if (asked.id !== undefined && asked.id !== '') {
    const exact = findSticker(usable, asked.id) || findSticker(stickers, asked.id)
    if (exact !== undefined) return done(exact, 'id')
  }

  if (asked.tag !== undefined && asked.tag !== '') {
    const needle = String(asked.tag).toLowerCase()
    const matches = usable.filter((sticker) => {
      return sticker.id.toLowerCase() === needle
        || sticker.tags.some((tag) => tag.toLowerCase().includes(needle))
        || sticker.label.toLowerCase().includes(needle)
        || (sticker.when || '').toLowerCase().includes(needle)
    })
    if (matches.length > 0) {
      const ranked = rank(matches.map((sticker) => ({ sticker, score: 1 })))
      return done(draw(ranked).sticker, 'tag', ranked)
    }
  }

  if (asked.context !== undefined && asked.context !== '') {
    const terms = termsOf(asked.context)
    if (terms.length > 0) {
      const ranked = rank(usable
        .map((sticker) => ({ sticker, score: scoreSticker(sticker, terms) }))
        .filter((candidate) => candidate.score > 0))
      if (ranked.length > 0) {
        const chosen = draw(ranked)
```

</details>

**依据 7 · 源码核查**：[lib/index.js:268-281](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L268-L281)

prompt端按agent/signal记coin。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[lib/index.js:305-315](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L305-L315)

工具端无caller返回undefined。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 9 · 源码核查**：[lib/index.js:1052-1070](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1052-L1070)

execute只拦false，真实第二道门禁。

<details>
<summary>查看原文（19行）</summary>

```text
    execute: async function (args, exec) {
      // The second gate. The prompt already announced this turn's outcome; a turn
      // that lost the toss does not get a sticker just because the model called
      // the tool anyway. `turnDecision` reads the very decision the prompt used.
      const caller = exec === undefined || exec === null ? undefined : exec.agent
      if (turnDecision(caller, probabilityOf(config)) === false) {
        return {
          id: '',
          label: '本轮不贴',
          path: '',
          markdown: '',
          bytes: 0,
          matched: 'turn-skipped',
          alternatives: [],
          notice: '本轮由宿主掷骰判定为「不贴」：这条回复不要贴表情包，也不需要重试。',
        }
      }
      const read = await snapshotRemote(config)
      const pack = read.pack
```

</details>

**依据 10 · 源码核查**：[lib/index.js:815-839](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L815-L839)

实际最多3图的选择/下载caller。

<details>
<summary>查看原文（25行）</summary>

```text
async function resolveSticker(config, read, query) {
  let result = library.pickSticker(read.pack.stickers, query)
  const tried = []
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const sticker = result.sticker
    if (sticker === undefined || sticker.pending !== true) return result
    const fetched = await fetchPending(sticker, read)
    if (fetched !== undefined) {
      // Re-read with the scan cache bypassed: the file was written a moment ago.
      const refreshed = snapshot(config, { fresh: true }).pack
      const again = library.findSticker(refreshed.stickers, sticker.id)
      if (again !== undefined && again.pending !== true) {
        return {
          sticker: again,
          matched: result.matched,
          alternatives: result.alternatives.filter((item) => item.sticker.id !== sticker.id),
        }
      }
    }
    tried.push(sticker.id)
    const next = library.pickSticker(read.pack.stickers, { ...query, avoid: query.avoid.concat(tried) })
    // `pickSticker` falls back to the whole pool when `avoid` excludes
    // everything, so a repeat would loop forever without this guard.
    if (next.sticker === undefined || tried.indexOf(next.sticker.id) !== -1) return next
    result = next
```

</details>

**依据 11 · 源码核查**：[lib/index.js:1129-1143](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1129-L1143)

主图及备选在交付前一起记recent。

<details>
<summary>查看原文（15行）</summary>

```text
      const value = {
        id: sticker.id,
        label: sticker.label,
        path: sticker.path,
        markdown: sticker.link,
        bytes: sticker.bytes,
        matched: result.matched,
        alternatives: result.alternatives.map((candidate) => describe(candidate.sticker)),
      }
      if (sticker.when !== undefined) value.when = sticker.when
      const used = [sticker.id].concat(value.alternatives.map((item) => item.id))
      const ledger = rememberRecent(used)
      const notes = []
      if (sticker.bytes > read.largeFileBytes) {
        notes.push(`这张 ${Math.round(sticker.bytes / 1024)} KB，偏大、加载会慢，能换就换一张。`)
```

</details>

**依据 12 · 源码核查**：[lib/library.js:490-512](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/library.js#L490-L512)

未登记文件仍纳入库，非撤图同步。

<details>
<summary>查看原文（23行）</summary>

```text
  // Anything in the folder the authored layers do not name stays usable, named
  // by its filename (with `[tags]` honoured), so dropping a new image into the
  // folder works immediately and never needs a restart.
  const auto = []
  for (const pair of byFile) {
    auto.push(entryFromFileName(pair[0]))
  }
  auto.sort((left, right) => left.file.localeCompare(right.file))
  let counter = 0
  const nextAutoId = function () {
    counter += 1
    return `x${String(counter).padStart(2, '0')}`
  }
  for (const draft of auto) {
    stickers.push(describeFile({
      id: draft.id,
      file: draft.file,
      label: draft.id === '' ? `${draft.label}（自动 id）` : draft.label,
      tags: draft.tags,
      note: manifest.exists
        ? '未登记：在来源仓库的 pack.json 里登记一下，id 与标签才会稳定'
        : '未登记：加进 pack.json 或把文件名写成「名字 [标签].gif」就能被按含义挑中',
    }, byFile.get(draft.file), directory, context.used, nextAutoId))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 微信、设置权限和响应时限有哪些真实边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、功能与机制

#### 完整回答

Web自动HTTP链接以127.0.0.1加宿主port构造，未取远端客户端可达origin；本地路径也指宿主磁盘，因此不能保证远程Web客户端可显示，需正确httpBaseUrl或同机实际渲染。微信识别只比较agent.session.cwd与wechatChannel.workspace的字符串（统一斜杠并小写），不是会话/收件人身份校验。工具实际不调用send_to_wechat，只把Markdown置空、复制同字节到.wechat并要求模型调用外部发送工具；不转码，也没有收件端回执。

静态筛选还存在真实字段不匹配：library.describeFile/Pending的extension去掉点，正常GIF为gif；index.isAnimated却在有extension时比较.gif。因此正常GIF不会因这个判断被排除。即使判断修好，全GIF池也有回退原池的分支；不能依据注释写“保证微信只发静态图”或“手机必收到”。这是源码形状/分支推导，未做手机故障复现，外部微信工具及账号/收件人映射未核。

settingsRoute非POST时带probability/deadlineMs查询就applySettingsPatch写盘，POST也可写；注册的handler内没有身份、connection admission或Origin/CSRF检查。真实端口暴露及宿主外层保护未知，但能触达该handler的请求并非只读；不能将GET链接当安全设置方式，也不宣称本轮已证明匿名公网攻击。deadline只要求有限正数、没有产品上限，存储值优先profile；0%概率不是卸载、关闭所有网络或完整权限边界。

“15秒整次工具硬上限”不符合活动链：withDeadline只race snapshotRemote的manifest同步，超时后同步仍在后台运行；随后resolveSticker的图片下载在它外面，每图有内部timeout/重试，图像route也能单独触发下载。没有使用宿主exec.signal贯穿这些网络动作，不能保证用户停止/卸载就中止。fetchOnce虽先检查Content-Length和读后字节上限，却完整arrayBuffer之后才检查实际长度，缺/错长度时不构成2/16MiB的硬流式峰值内存/网络界；重定向follow且无域/IP逐跳收紧，不能把HTTP(S)/扩展名白名单称来源认证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:625-631](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L625-L631)

自动HTTP base实际为宿主loopback。

```text
 */
function linkBase(style, explicit) {
  if (style === 'file') return undefined
  if (explicit !== '') return explicit
  if (serverPort === undefined) return undefined
  return `http://127.0.0.1:${serverPort}`
}
```

**依据 2 · 源码核查**：[lib/index.js:193-209](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L193-L209)

微信只有工作区字符串匹配。

<details>
<summary>查看原文（17行）</summary>

```text
function isWechatSession(ctx, agent) {
  const channel = wechatChannelOf(ctx)
  const home = channel !== undefined && typeof channel.workspace === 'string' ? channel.workspace : ''
  if (home === '') return false
  const session = agent !== null && typeof agent === 'object' ? agent.session : undefined
  const cwd = session !== null && typeof session === 'object' && typeof session.cwd === 'string' ? session.cwd : ''
  if (cwd === '') return false
  // Both separators, because `cwd` comes from a `realpath` (backslashes on
  // Windows) while a configured workspace may be written either way.
  const strip = function (value) { return value.replace(/\\/gu, '/').replace(/\/+$/u, '').toLowerCase() }
  const match = strip(cwd) === strip(home)
  if (match && !wechatNoticed) {
    wechatNoticed = true
    trace('wechat: session bound to the channel workspace ' + home + ' — stickers will be routed through send_to_wechat')
  }
  return match
}
```

</details>

**依据 3 · 源码核查**：[lib/library.js:584-626](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/library.js#L584-L626)

文件及pending扩展名均无点。

<details>
<summary>查看原文（43行）</summary>

```text
/** A file that is present: the ordinary case. */
function describeFile(entry, found, directory, used, nextAutoId) {
  const size = imageSizeFor(found.path, found.stat)
  const sticker = {
    id: uniqueId(entry.id, used, directory, nextAutoId),
    label: entry.label,
    tags: entry.tags.slice(),
    file: entry.file,
    path: found.path,
    directory,
    extension: extname(entry.file).toLowerCase().replace('.', ''),
    bytes: found.bytes,
    mtimeMs: found.mtimeMs,
    link: fileLink(found.path),
  }
  if (entry.when !== undefined) sticker.when = entry.when
  if (entry.note !== undefined) sticker.note = entry.note
  if (size !== undefined) {
    sticker.width = size.width
    sticker.height = size.height
  }
  return sticker
}

/**
 * A file the manifest promises but nobody has fetched yet.
 *
 * `size` is deliberately absent (there is nothing to measure) and `bytes` is 0,
 * which keeps the "this one is huge, load something else" notice quiet until the
 * real file exists.
 */
function describePending(entry, directory, used) {
  const path = join(directory, entry.file)
  const sticker = {
    id: uniqueId(entry.id, used, directory),
    label: entry.label,
    tags: entry.tags.slice(),
    file: entry.file,
    path,
    directory,
    extension: extname(entry.file).toLowerCase().replace('.', ''),
    bytes: 0,
    mtimeMs: 0,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:659-671](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L659-L671)

真实loadLibrary的pack只改link，直接给后续选图/筛选。

<details>
<summary>查看原文（13行）</summary>

```text
function snapshot(config, options) {
  const settings = settingsOf(config)
  const fresh = options !== undefined && options.fresh === true
  const pack = library.loadLibrary({
    directories: libraryFolders(settings),
    scanTtlMs: fresh ? 0 : settings.scanTtlMs,
  })
  if (settings.httpBaseUrl !== undefined) {
    for (const sticker of pack.stickers) {
      sticker.link = library.httpLink(settings.httpBaseUrl, sticker.id, Math.floor(sticker.mtimeMs || 0))
    }
  }
  return { pack, settings, largeFileBytes: settings.largeFileBytes }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:357-385](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L357-L385)

isAnimated比较有点及同字节copy。

<details>
<summary>查看原文（29行）</summary>

```text
/** Whether a sticker is an animation, which the WeChat channel will not show. */
function isAnimated(sticker) {
  if (sticker === null || typeof sticker !== 'object') return false
  const extension = typeof sticker.extension === 'string' && sticker.extension !== ''
    ? sticker.extension
    : extname(typeof sticker.file === 'string' ? sticker.file : '')
  return extension.toLowerCase() === '.gif'
}

/**
 * Stage a copy of `sticker` that the WeChat channel will send as a file.
 *
 * Returns the staged path, or `undefined` when the copy cannot be made — the
 * caller then falls back to the original path rather than sending nothing. A
 * copy whose size still matches is reused, so picking the same sticker again
 * does not rewrite the file every turn. Best-effort like every other side
 * effect here: a failure is traced, never thrown.
 */
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
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1083-1091](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1083-L1091)

筛选及全GIF回退。

```text
      const wechat = isWechatSession(ctx, caller)
      // A WeChat-bound reply carries a still picture: the channel uploads an
      // animation as a file the phone cannot play, and shows pictures sent as
      // pictures not at all. The pool only shrinks when something is left in it,
      // so a pack of nothing but GIFs still picks rather than refusing.
      const still = wechat ? pack.stickers.filter((item) => !isAnimated(item)) : pack.stickers
      const pool = still.length === 0 ? read : { ...read, pack: { ...pack, stickers: still } }
      const recentAll = readRecent()
      const window = Math.min(read.settings.recentWindow, Math.max(0, pool.pack.stickers.length - 2))
```

**依据 7 · 源码核查**：[lib/index.js:1150-1165](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1150-L1165)

仅提示外部发送，不执行/不回执。

<details>
<summary>查看原文（16行）</summary>

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
      if (notes.length > 0) value.notice = notes.join(' ')
```

</details>

**依据 8 · 源码核查**：[lib/index.js:1235-1279](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1235-L1279)

实际非POST查询/POST写设置，无局部准入。

<details>
<summary>查看原文（45行）</summary>

```text
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
  }

```

</details>

**依据 9 · 源码核查**：[lib/index.js:1359-1364](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1359-L1364)

直接注册这些handler。

```text
    disposers.push(webServer.register({ kind: 'exact', path: '/sticker-pack/cat.json', handler: catalog }))
    disposers.push(webServer.register({ kind: 'exact', path: '/sticker-pack/settings', handler: settingsRoute }))
    disposers.push(webServer.register({ kind: 'exact', path: '/sticker-pack/settings.html', handler: page }))
    disposers.push(webServer.register({ kind: 'exact', path: '/sticker-pack/', handler: page }))
    disposers.push(webServer.register({ kind: 'prefix', path: '/sticker-pack/i', handler: image }))
    trace('routes /sticker-pack/{cat.json,settings,settings.html,i}: registered')
```

**依据 10 · 源码核查**：[lib/index.js:478-491](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L478-L491)

正数等待无上限。

<details>
<summary>查看原文（14行）</summary>

```text
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

```

</details>

**依据 11 · 源码核查**：[lib/index.js:715-753](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L715-L753)

manifest race不取消工作。

<details>
<summary>查看原文（39行）</summary>

```text
function withDeadline(work, ms) {
  let timer
  return Promise.race([
    work,
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(DEADLINE), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}

async function snapshotRemote(config) {
  const settings = settingsOf(config)
  const budgetMs = settings.deadlineMs
  const remoteSources = await withDeadline(
    remote.syncRemotes(settings.remotes, {
      cacheDirectory: REMOTE_CACHE_DIRECTORY,
      ttlMs: settings.remoteTtlMs,
      timeoutMs: settings.remoteTimeoutMs,
    }),
    budgetMs,
  )
  const read = snapshot(config)
  if (remoteSources === DEADLINE) {
    trace(`remote: refresh still running after ${budgetMs}ms — answering from the mirror`)
    read.remoteSources = settings.remotes.map((source) => ({
      name: source.name,
      url: source.url,
      directory: remote.directoryOf(REMOTE_CACHE_DIRECTORY, source),
      status: 'stale',
      count: 0,
      error: `等待远端超过 ${Math.round(budgetMs / 1000)} 秒，本轮先用本地镜像`,
      skipped: [],
    }))
    return read
  }
  read.remoteSources = remoteSources
  return read
}

```

</details>

**依据 12 · 源码核查**：[lib/index.js:785-839](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L785-L839)

后续懒图不在该race内。

<details>
<summary>查看原文（55行）</summary>

```text
async function fetchPending(sticker, read) {
  const images = remote.readImages(sticker.directory)
  let url
  for (const key of Object.keys(images)) {
    const item = images[key]
    if (item !== null && typeof item === 'object' && item.file === sticker.file && typeof item.url === 'string') {
      url = item.url
      break
    }
  }
  if (url === undefined) return undefined
  const path = await remote.ensureFile({
    directory: sticker.directory,
    file: sticker.file,
    url,
    timeoutMs: read.settings.remoteTimeoutMs,
  })
  if (path === undefined) trace(`remote: 下载失败 ${url}`)
  return path
}

/**
 * Pick a sticker that can actually be shown.
 *
 * A mirrored sticker nobody has fetched yet is not an answer — the model would
 * paste a path that does not exist — so it is fetched first, and a failed fetch
 * drops that candidate instead of failing the call. The model asked for a
 * sticker, not for a particular id; the next candidate is a better answer than
 * an apology.
 */
async function resolveSticker(config, read, query) {
  let result = library.pickSticker(read.pack.stickers, query)
  const tried = []
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const sticker = result.sticker
    if (sticker === undefined || sticker.pending !== true) return result
    const fetched = await fetchPending(sticker, read)
    if (fetched !== undefined) {
      // Re-read with the scan cache bypassed: the file was written a moment ago.
      const refreshed = snapshot(config, { fresh: true }).pack
      const again = library.findSticker(refreshed.stickers, sticker.id)
      if (again !== undefined && again.pending !== true) {
        return {
          sticker: again,
          matched: result.matched,
          alternatives: result.alternatives.filter((item) => item.sticker.id !== sticker.id),
        }
      }
    }
    tried.push(sticker.id)
    const next = library.pickSticker(read.pack.stickers, { ...query, avoid: query.avoid.concat(tried) })
    // `pickSticker` falls back to the whole pool when `avoid` excludes
    // everything, so a repeat would loop forever without this guard.
    if (next.sticker === undefined || tried.indexOf(next.sticker.id) !== -1) return next
    result = next
```

</details>

**依据 13 · 源码核查**：[lib/remote.js:187-210](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/remote.js#L187-L210)

follow redirect及全arrayBuffer后实际大小检查。

<details>
<summary>查看原文（24行）</summary>

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
  } catch (err) {
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、使用、维护和退出的条件/成本/效果怎样比较？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

状态/boot.log/recent默认在用户.dsh/sticker-pack，镜像与wechat-out默认在Pictures/dsh-sticker-pack，可用专用环境变量改位置。当前版本活动库只读remote对应镜像，旧签名的directory不能据此当任意本地库仍受支持。网络缓存/请求去重和懒加载是已有优化，但下载/候选/渠道并不自动形成可显示成果；源码或作者性能数字都不是本轮实测。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools及兼容ToolDefinition | 核心必需 | catalog/pick供宿主模型调用 | 只装包/注册日志不等工具任务通过 |
| systemPrompt、agent/turn信息 | 概率指导条件 | 宿主coin与模型指令/工具复用 | 缺caller会放行；不承诺强输出频率 |
| 可信获授权的HTTP(S)图册 | 当前活动源必需 | 清单/图片来源与语境标签 | 默认是未固定@main，首次离线可无图；代码许可不替图片授权 |
| 本地磁盘/镜像与正确URL | 显示必需 | 文件缓存、Web/本地渲染 | loopback/宿主路径不保证远程浏览器可读 |
| wechatChannel与外部发送工具 | 微信分支条件 | 工作区识别、真实发送/账号 | 本插件不发消息/不转码，必须核收件结果 |
| WebServer及受保护设置入口 | 管理/HTTP图条件 | 图片、概率/等待配置 | 无局部准入和GET写需先修验；非所有宿主兼容有据 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备小图册 | 操作者核内容授权/语境并固定源、唯一name | 原始图/清单可对应，源内容变化可追踪 |
| 核配置与访问 | 检查设置准入、等待、缓存路径和Web base | GET不被当只读安全假设；远程端真能读 |
| 可控轮次 | 固定问答语境，对照手工图/纯文本 | 核实际展示/用户偏好、总延迟与模型调用，不只看coin |
| 测故障/渠道 | 慢源、换图/删图、全GIF/备选/取消；微信另授权测试 | 核主图/备选、撤图和真实收件，不重试刷无效工具 |
| 停用/清理 | 停新工具请求/卸载，核inflight并导出或删owned目录 | 概率0不是断网；卸载不等删镜像/wechat-out/日志 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次接入 | 图册网络/磁盘、宿主/模型/可选渠道 | 选素材/授权、设置访问/URL与目标端验收 | 无真实安装/金额/工时，包不附可直接当离线库的stickers目录 |
| 持续使用 | manifest/懒图/重试、模型工具/提示词与副本磁盘 | 语境/频率管理、图源状态和重复图片检查 | coin文本变化可能影响前缀缓存，实际hit/token/时延未知 |
| 失败恢复 | 超时后后台同步、三候选图及重复渠道尝试 | 查源/路由/字段、缓存更新/撤图与实际收件 | 15秒非整工具总界、字节限制非硬流式界，无失败率/纠错数据 |
| 停用/迁移 | 缓存/原始/副本/boot.log及在途网络 | 核文件/原图来源、导出/清理和状态恢复 | dispose有flush/路由清理意图，未证明取消inflight或自动删除数据 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 图册/选图 | 有镜像、字符串选择、懒图与去重 | 图源实时/授权/语境质量、换图撤图一致性 |
| 概率控制 | 正常caller下宿主coin+工具false门禁 | hostcontext兼容、正文真实出图率/用户偏好 |
| 渠道交付 | 提供主图链接/路径及.wechat副本提示 | Web远程可读、GIF规范与真实微信显示/收到 |
| 体验/成本 | 有缓存/懒加载/局部等待优化 | 总尾延迟、模型缓存/费用和是否胜过手工/纯文本 |

本轮不执行目标/测试/网络/渠道发送，不把作者自测、boot诊断或近期id当收件回执；钱、工时和净体验收益未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:330-342](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L330-L342)

磁盘镜像位置。

<details>
<summary>查看原文（13行）</summary>

```text
/** Mirrors live outside `~/.dsh`; the self-test's `DSH_STICKER_PACK_HOME`
 *  still wins, so tests never touch the real Pictures folder. */
function libraryRoot() {
  const explicit = process.env.DSH_STICKER_PACK_LIBRARY
  if (typeof explicit === 'string' && explicit.trim() !== '') return explicit
  const stateHome = process.env.DSH_STICKER_PACK_HOME
  if (typeof stateHome === 'string' && stateHome.trim() !== '') return join(stateHome, 'library')
  return join(homedir(), 'Pictures', 'dsh-sticker-pack')
}

// `remote.directoryOf` appends `remotes/<source>/` to whatever it is handed, so
// this is the library root, not the remotes folder itself.
const REMOTE_CACHE_DIRECTORY = libraryRoot()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:575-614](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L575-L614)

当前remote-only配置、缓存和URL条件。

<details>
<summary>查看原文（40行）</summary>

```text
  const base = typeof given.httpBaseUrl === 'string' ? given.httpBaseUrl.trim().replace(/\/+$/u, '') : ''
  const style = typeof given.linkStyle === 'string' ? given.linkStyle.trim().toLowerCase() : 'auto'
  return {
    // The only source of stickers since v0.5.0: every remote manifest is
    // mirrored into a folder of its own and read from there. No local folder
    // is scanned any more, so this list is the whole library.
    remotes: configuredRemotes(config),
    // A mirror is refreshed at most once per TTL, and never on a path that a
    // reply is waiting on: see `snapshotRemote` versus `snapshot`.
    remoteTtlMs: numberSetting(config, 'remoteTtlMs', remote.DEFAULT_TTL_MS),
    remoteTimeoutMs: numberSetting(config, 'remoteTimeoutMs', remote.DEFAULT_TIMEOUT_MS),
    // How long a tool call may wait on the network before it answers from the
    // mirror. Owned by the settings page since 2026-10-15: a 5–30 s slider plus
    // a free field, because how long a wait is acceptable is a property of the
    // machine's link, not of this plugin.
    deadlineMs: deadlineOf(config),
    // How many times as often an animated image is drawn as a still one. 1 is a
    // plain uniform draw; the default leans towards GIFs, on request (2026-10-15).
    gifBias: numberSetting(config, 'gifBias', 2),
    largeFileBytes: typeof given.largeFileBytes === 'number' ? given.largeFileBytes : 2 * 1024 * 1024,
    // Read through on every call so the settings page takes effect immediately.
    probability: probabilityOf(config),
    // How many of the most recently used ids `sticker_pick` pushes to the back
    // of the queue. 0 restores pure random behaviour.
    recentWindow: typeof given.recentWindow === 'number' && given.recentWindow >= 0 ? given.recentWindow : 3,
    // How long a directory scan may be reused. New files still appear within
    // this window; 0 makes every call re-scan.
    scanTtlMs: typeof given.scanTtlMs === 'number' && given.scanTtlMs >= 0 ? given.scanTtlMs : 1000,
    // Which URL form `sticker_pick` hands back: see `linkBase`. `auto` prefers
    // this plugin's own route whenever it is listening, because that form renders
    // while the reply is still streaming; a machine where the route is not up
    // falls back to local paths, which always work and only appear a beat later.
    // Neither form asks the user to name a port.
    httpBaseUrl: linkBase(style, base),
  }
}

/**
 * The base URL the HTTP route should hand out, or undefined to stay on local paths.
 *
```

</details>

**依据 3 · 源码核查**：[lib/index.js:886-908](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L886-L908)

近期记录防抖/清理意图。

<details>
<summary>查看原文（23行）</summary>

```text
  }
}

function flushRecent() {
  if (recentFlushTimer !== undefined) {
    clearTimeout(recentFlushTimer)
    recentFlushTimer = undefined
  }
  if (!recentDirty || recentCache === undefined) return
  recentDirty = false
  writeRecent(recentCache)
}

function scheduleRecentFlush() {
  if (recentFlushTimer !== undefined) return
  recentFlushTimer = setTimeout(function () {
    recentFlushTimer = undefined
    if (!recentDirty || recentCache === undefined) return
    recentDirty = false
    writeRecent(recentCache)
  }, RECENT_FLUSH_MS)
  // Never hold the process open just to persist a hint.
  if (typeof recentFlushTimer.unref === 'function') recentFlushTimer.unref()
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1513-1544](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1513-L1544)

装配及dispose仅flush/注销意图。

<details>
<summary>查看原文（32行）</summary>

```text
    const tools = service(ctx, 'tools')
    const webServer = service(ctx, 'webServer')
    trace(`apply entered — tools=${typeof tools} webServer=${typeof webServer} ${ctxSummary(ctx)}`)
    if (tools === undefined) {
      trace('apply: no tools service, sticker tools NOT registered')
    } else {
      disposers.push(registerTool(tools, ctx, catalogTool(config)))
      disposers.push(registerTool(tools, ctx, pickTool(config, ctx)))
    }
    registerRoutesWhenReady(ctx, config)
    if ((config || {}).prompt === false) trace('prompt: disabled by config')
    else {
      const stopPrompt = registerPromptWhenReady(ctx, config)
      if (typeof stopPrompt === 'function') disposers.push(stopPrompt)
    }
  } catch (err) {
    trace(`apply THREW: ${(err && err.stack) || String(err)}`)
  }
  if (typeof ctx.on === 'function') {
    ctx.on('dispose', function () {
      for (const dispose of disposers) dispose()
      flushRecent()
    })
  }
  trace('apply finished')
}

module.exports = {
  name,
  inject,
  apply,
  default: { name, inject, apply },
```

</details>

**依据 5 · 作者声明**：[package.json:22-43](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/package.json#L22-L43)

实际分发与许可声明。

<details>
<summary>查看原文（22行）</summary>

```text
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
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现有概率/缓存之外，是否值得做新的可验证贴图能力？

**研究主题**：新假设与验证、工程质量与复用、贡献与相对优势

#### 完整回答

现有实现已经有宿主coin、工具第二道门禁、尺寸缓存/镜像/去重、HTTP图和.wechat副本；不能再把“缓存图/按概率发”当新方向。明确的设置准入/GET写、GIF字段、贯穿总预算、源更新/撤销属于当前正确性修补，应先完成，不包装成创新产品。把概率从变化system prompt搬到工具状态也不是自动更好：必须核不同宿主的工具调用/前缀缓存和模型遵循，不能仅按文本变化宣称已省token。

剩余假设是用最小可展示主图与真实目标端结果反馈替代“返回了路径就算出图”：只提供已准备好且适用的素材，区分选择/渲染/外部发送状态，并在预算不足时立即回纯文本。它依赖宿主渲染/渠道回执能力，当前未实现/验证；recent把备选也记入，不能冒充已有使用反馈。无需默认建跨渠道素材平台，预热固定图册、手工上传、一个可显示链接或纯文本可能已满足需求。

最小对照先找愿意表达偏好的真实用户，用同一小图册和授权语境比较当前、具体小修补、手工图/纯文本和最小展示反馈；测实际显示/收件、语境误用、p95回复额外等待、工具重试、模型缓存/人工及愿不愿继续用。若只增加图片数量、偏好无改善，或简单预热/手工方式已同样好，就否定独立方向；不能从源码复杂度推生产机会。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1052-1070](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1052-L1070)

现有工具门禁已存在。

<details>
<summary>查看原文（19行）</summary>

```text
    execute: async function (args, exec) {
      // The second gate. The prompt already announced this turn's outcome; a turn
      // that lost the toss does not get a sticker just because the model called
      // the tool anyway. `turnDecision` reads the very decision the prompt used.
      const caller = exec === undefined || exec === null ? undefined : exec.agent
      if (turnDecision(caller, probabilityOf(config)) === false) {
        return {
          id: '',
          label: '本轮不贴',
          path: '',
          markdown: '',
          bytes: 0,
          matched: 'turn-skipped',
          alternatives: [],
          notice: '本轮由宿主掷骰判定为「不贴」：这条回复不要贴表情包，也不需要重试。',
        }
      }
      const read = await snapshotRemote(config)
      const pack = read.pack
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1129-1143](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1129-L1143)

recent不是显示反馈。

<details>
<summary>查看原文（15行）</summary>

```text
      const value = {
        id: sticker.id,
        label: sticker.label,
        path: sticker.path,
        markdown: sticker.link,
        bytes: sticker.bytes,
        matched: result.matched,
        alternatives: result.alternatives.map((candidate) => describe(candidate.sticker)),
      }
      if (sticker.when !== undefined) value.when = sticker.when
      const used = [sticker.id].concat(value.alternatives.map((item) => item.id))
      const ledger = rememberRecent(used)
      const notes = []
      if (sticker.bytes > read.largeFileBytes) {
        notes.push(`这张 ${Math.round(sticker.bytes / 1024)} KB，偏大、加载会慢，能换就换一张。`)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1150-1165](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1150-L1165)

微信只指示外部工具，无送达回执。

<details>
<summary>查看原文（16行）</summary>

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
      if (notes.length > 0) value.notice = notes.join(' ')
```

</details>

**依据 4 · 源码核查**：[lib/index.js:715-753](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L715-L753)

局部等待不是总交付预算。

<details>
<summary>查看原文（39行）</summary>

```text
function withDeadline(work, ms) {
  let timer
  return Promise.race([
    work,
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(DEADLINE), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}

async function snapshotRemote(config) {
  const settings = settingsOf(config)
  const budgetMs = settings.deadlineMs
  const remoteSources = await withDeadline(
    remote.syncRemotes(settings.remotes, {
      cacheDirectory: REMOTE_CACHE_DIRECTORY,
      ttlMs: settings.remoteTtlMs,
      timeoutMs: settings.remoteTimeoutMs,
    }),
    budgetMs,
  )
  const read = snapshot(config)
  if (remoteSources === DEADLINE) {
    trace(`remote: refresh still running after ${budgetMs}ms — answering from the mirror`)
    read.remoteSources = settings.remotes.map((source) => ({
      name: source.name,
      url: source.url,
      directory: remote.directoryOf(REMOTE_CACHE_DIRECTORY, source),
      status: 'stale',
      count: 0,
      error: `等待远端超过 ${Math.round(budgetMs / 1000)} 秒，本轮先用本地镜像`,
      skipped: [],
    }))
    return read
  }
  read.remoteSources = remoteSources
  return read
}

```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前适合谁，什么时候应停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议观察，优先可信图册的同机Web小样；它主要是表达偏好便利，不是高频业务问题已经验证。操作者应先修/验设置准入、图片字段和整工具预算，再用固定几张图、有限语境及明确可接受额外等待比较手工图或纯文本。首次离线、远程Web和微信都另验，不能按本地文件存在或工具notice保证渠道成功。

最低验收要有主图/备选真实显示，caller缺失/轮次与概率、慢manifest后懒图总耗时、源换图/撤图/同名源、用户取消/卸载，以及微信外部账号/收件实际确认。出图不合语境、回复明显变慢、设置被误改、停止后仍下载或渠道重复尝试，都应停新工具调用，核当前inflight/已发送状态后回纯文本/手工上传；概率0不代替关闭网络和完整卸载。

独立评分按当前组件实际提供的便利和证据，不以作者图片数、实现行数或“手机必收到”加分。技术是常规远端文件/规则匹配/概率与宿主工具接线，商业仍交付同类对话表情图，未有质量、使用意愿和净成本证据；未来展示反馈不计现有能力。本轮没有运行、收件或性能验收，不给持续安装承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:305-315](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L305-L315)

无caller判定不是强制阻止。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.js:715-753](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L715-L753)

需要验完整耗时及仍在途同步。

<details>
<summary>查看原文（39行）</summary>

```text
function withDeadline(work, ms) {
  let timer
  return Promise.race([
    work,
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(DEADLINE), ms)
    }),
  ]).finally(() => clearTimeout(timer))
}

async function snapshotRemote(config) {
  const settings = settingsOf(config)
  const budgetMs = settings.deadlineMs
  const remoteSources = await withDeadline(
    remote.syncRemotes(settings.remotes, {
      cacheDirectory: REMOTE_CACHE_DIRECTORY,
      ttlMs: settings.remoteTtlMs,
      timeoutMs: settings.remoteTimeoutMs,
    }),
    budgetMs,
  )
  const read = snapshot(config)
  if (remoteSources === DEADLINE) {
    trace(`remote: refresh still running after ${budgetMs}ms — answering from the mirror`)
    read.remoteSources = settings.remotes.map((source) => ({
      name: source.name,
      url: source.url,
      directory: remote.directoryOf(REMOTE_CACHE_DIRECTORY, source),
      status: 'stale',
      count: 0,
      error: `等待远端超过 ${Math.round(budgetMs / 1000)} 秒，本轮先用本地镜像`,
      skipped: [],
    }))
    return read
  }
  read.remoteSources = remoteSources
  return read
}

```

</details>

**依据 3 · 源码核查**：[lib/library.js:584-626](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/library.js#L584-L626)

实际扩展名字段规范。

<details>
<summary>查看原文（43行）</summary>

```text
/** A file that is present: the ordinary case. */
function describeFile(entry, found, directory, used, nextAutoId) {
  const size = imageSizeFor(found.path, found.stat)
  const sticker = {
    id: uniqueId(entry.id, used, directory, nextAutoId),
    label: entry.label,
    tags: entry.tags.slice(),
    file: entry.file,
    path: found.path,
    directory,
    extension: extname(entry.file).toLowerCase().replace('.', ''),
    bytes: found.bytes,
    mtimeMs: found.mtimeMs,
    link: fileLink(found.path),
  }
  if (entry.when !== undefined) sticker.when = entry.when
  if (entry.note !== undefined) sticker.note = entry.note
  if (size !== undefined) {
    sticker.width = size.width
    sticker.height = size.height
  }
  return sticker
}

/**
 * A file the manifest promises but nobody has fetched yet.
 *
 * `size` is deliberately absent (there is nothing to measure) and `bytes` is 0,
 * which keeps the "this one is huge, load something else" notice quiet until the
 * real file exists.
 */
function describePending(entry, directory, used) {
  const path = join(directory, entry.file)
  const sticker = {
    id: uniqueId(entry.id, used, directory),
    label: entry.label,
    tags: entry.tags.slice(),
    file: entry.file,
    path,
    directory,
    extension: extname(entry.file).toLowerCase().replace('.', ''),
    bytes: 0,
    mtimeMs: 0,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1235-1279](https://github.com/5V1A-afk/dsh-sticker-pack/blob/92e492d0080cc651fd3f7010adc36d5f066caa63/lib/index.js#L1235-L1279)

设置写入是采用前置。

<details>
<summary>查看原文（45行）</summary>

```text
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
  }

```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
