# @opencues/dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2ba4135](https://github.com/opencues/opencues/tree/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/opencues/opencues) [![npm 30d 822](https://img.shields.io/static/v1?label=npm+30d&message=822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencues/dsh) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opencues/dsh)
<!-- END META -->

> **功能**：将 OpenCues 写作建议与下划线补全接入 DSH 输入框。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把共享 OpenCues runtime 与宿主编辑器和模型接线。

> **主要限制**：[Q03](#research-q03) 草稿可能在正式发送前交给模型；密钥代理和外层鉴权不能仅凭静态接线视作安全保证。

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
  - [Q01 · 该集成为谁提供什么？](#detail-section-11)
  - [Q02 · 输入、模型和结果怎样接通？](#detail-section-12)
  - [Q03 · 凭据保护能否推导请求或账号安全？](#detail-section-13)
  - [Q04 · 配置持久化和退出有什么成本？](#detail-section-14)
  - [Q05 · 能否在草稿发送前让用户更清楚模型调用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向希望在 DSH 输入框获得文本建议和补全的用户。

对照 DSH 原有输入框与手动修改文本；插件增加输入时建议和可触发填充，质量与延迟未经对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 输入建议 | 词句建议与填充 | 具体触发依赖共享 runtime |
| 模型路由 | 使用宿主或外部提供方 | 草稿可能在发送前传出 |
| 设置 | 配置共享 OpenCues 选项 | 写入共享文件，退出未测 |
| 凭据代理 | Host 代填环境密钥 | 外层鉴权和重定向未核实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web、webServer 和 llm | 宿主接线必需 | 编辑器、路由和模型 | 不兼容时行为未测 |
| 共享 runtime 与默认配置 | 构建需要 | 建议和补全 | 预构建包一致性未验证 |
| 模型或外部 API | 模型建议条件 | 推理或数据请求 | 不可用时具体降级未测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查模型路线并使用合成文本 | 记录配置与预算 |
| 试用 | 用户输入并触发建议 | 核验请求时机及结果 |
| 退出 | 用户停用并检查共享配置 | 确认不再发送请求 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主和模型成本未知 | 设置路线和隐私边界 | 安装未测 |
| 持续使用 | 模型调用成本未知 | 检查建议 | 质量和延迟未测 |
| 失败恢复 | 重试成本未知 | 检查路由和共享配置 | 故障行为未测 |
| 退出 | 配置清理成本未知 | 停用并检查残留 | 自动删除未确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文本建议 | 输入事件和 runtime 接线 | 建议质量及效果 |
| 模型调用 | 宿主流代理 | 请求频率与费用 |
| 配置 | 保存共享设置 | 并发写入与退出清理 |

> **思考**：[Q03](#research-q03) 草稿可能在正式发送前交给模型；密钥代理和外层鉴权不能仅凭静态接线视作安全保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把共享 OpenCues runtime 与宿主编辑器和模型接线。

[Q02](#research-q02) 使用宿主输入槽位与模型流；[Q03](#research-q03) 外层鉴权及代理重定向尚未核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 草稿可能在正式发送前交给模型；密钥代理和外层鉴权不能仅凭静态接线视作安全保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用合成文本核对路由、费用和共享配置，退出时检查残留。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持输入事件与宿主模型接线；模型效果、网络隔离、真实宿主和发布品未运行验证。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/README.md、integrations/dsh/src/plugin.js、integrations/dsh/build.mjs、integrations/dsh/index.js、integrations/dsh/package.json 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查子包 Host 路由、Client 接线、构建与说明；未完整审计共享 runtime、宿主或上游服务。
- 下一步：只读固定源码；未运行宿主、构建、浏览器、模型或外部网络。

**分析版本**

- **仓库**：[opencues/opencues](https://github.com/opencues/opencues)
- **版本号**：0.2.21（[固定提交 2ba4135](https://github.com/opencues/opencues/tree/2ba4135524ac41bca3ac38871099db3f8e1ef7c5)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显示模型调用状态可改善用户理解，尚未验证。

只读固定源码；未运行宿主、构建、浏览器、模型或外部网络。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 228 | 157 | 42 | — |
| .mjs | source | 1 | 106 | 65 | 37 | — |
| .md | source | 3 | 1299 | — | — | 9928 |
| .js | source | 5 | 6342 | 5212 | 552 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/opencues/opencues/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/opencues/opencues/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/opencues/opencues/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对输入建议接线、模型调用及共享配置边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该集成为谁提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 输入框编写内容的用户可获得词语替换、句子建议以及输入下划线触发的填充或重写；作者称默认使用宿主配置模型，空闲也可能触发建议。子包是 Host 与 Web Client 的接线，提示生成逻辑属于共享 OpenCues runtime，不能把运行时所有能力直接归为此子包实现。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:3-12](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L3-L12)

作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
Word alternatives and `_`-gated blank fill-ins, in the dsh composer.

Type `the capital of iceland is _` and the `_` becomes `Reykjavik`. Type
`i has three cats fix typos _` and the line rewrites itself. Misspell a word
and it is offered back to you, cycled with `Ctrl+Alt+↑`. Nothing is sent
anywhere until you type an `_` or the buffer sits still — and if you never do,
the plugin is invisible.

**No API key required.** By default every call routes through the model dsh
is already configured with, so there is nothing to sign up for.
```

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:28-35](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L28-L35)

作者说明。

```text
## What you get

| | |
|---|---|
| `_` fill-in | `the capital of iceland is _`, `weather in london _`, `nvidia _` |
| Rewrite | `<your text> fix typos _`, `make it formal _` |
| Word cues | spelling and domain alternatives, cycled with `Ctrl+Alt+↑` / `↓` |
| Sentence cues | a whole-sentence rewrite offered passively; your text is never changed without a keystroke |
```

**依据 3 · 源码核查**：[integrations/dsh/src/plugin.js:1-8](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/src/plugin.js#L1-L8)

固定源码接线。

```text
/**
 * The dsh client plugin: takes a seat in the composer's dock, binds the
 * composer to the OpenCues runtime, and drives the runtime's event inputs.
 * All cue behaviour belongs to @opencues/runtime.
 */
import React from 'react'
import { createOpenCuesHost } from './entry.js'
import { OpenCuesSettingsTab } from './settings-tab.js'
```

**依据 4 · 源码核查**：[integrations/dsh/build.mjs:68-83](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/build.mjs#L68-L83)

固定源码接线。

<details>
<summary>查看原文（16行）</summary>

```text
const result = await esbuild.build({
  entryPoints: [join(here, 'src/plugin.js')],
  bundle: true,
  // Minified because this artifact is COMMITTED (see .gitignore's note), so
  // its size is a per-change cost in git history, not just a download. Cuts
  // ~1.7MB to ~1.0MB, and the page loads it on every dsh boot regardless.
  // esbuild's output is byte-reproducible for identical inputs, which is what
  // lets check-dsh-bundle-fresh.sh detect a stale commit by rebuilding.
  minify: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  // Same treatment chrome's build uses: the runtime also serves Node hosts,
  // so its node-only paths must be kept out of the browser bundle. They are
  // lazily reached and already guarded by try/catch upstream.
  external: ['react', 'react-dom', 'node:fs', 'node:path', 'node:os', 'node:child_process', 'https'],
```

</details>

#### 缺口

- 未在宿主、模型或浏览器运行，不能确认延迟、质量或效果
  **影响**：运行结果未知
  **进一步探讨**：在隔离 profile 中验证实际请求与编辑行为。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入、模型和结果怎样接通？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端注册输入 dock 和插件设置页，监听 draft、光标和按键，绑定共享 runtime，并将结果写入当前 composer；被 runtime 消费的快捷键被拦截。Host 注入 webServer、llm，LLM route 将角色文本转换为宿主请求，消费 text-delta 并返回文本、usage 和模型信息；构建将共享 runtime 打进 client。具体触发时机和修改条件仍取决于共享 runtime，不能只凭 UI 接线证明全部行为。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/plugin.js:18-26](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/src/plugin.js#L18-L26)

固定源码接线。

```text
function OpenCuesDock(props) {
  const draft = props.useInput(s => s.draft)
  const actions = props.inputActions
  const rt = React.useRef(null)
  const [label, setLabel] = React.useState(singleton.label)
  // Indirection through the singleton so the one runtime always writes to
  // whichever composer instance is currently mounted.
  const setDraftRef = { get current() { return singleton.setDraft } }
  singleton.setDraft = text => actions.setDraft(text)
```

**依据 2 · 源码核查**：[integrations/dsh/src/plugin.js:73-102](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/src/plugin.js#L73-L102)

固定源码接线。

<details>
<summary>查看原文（30行）</summary>

```text
  // Draft changes -> runtime.
  React.useEffect(() => {
    if (!status.booted || !rt.current) return
    rt.current.notifyText('user')
    status.renders += 1
  }, [draft])

  // Caret moves -> runtime (the machine state carries no caret; the textarea does).
  React.useEffect(() => {
    const onSel = () => {
      const ta = document.querySelector('[data-composer-card] textarea')
      if (ta && document.activeElement === ta && rt.current && status.booted) rt.current.notifyCursor()
    }
    document.addEventListener('selectionchange', onSel)
    return () => document.removeEventListener('selectionchange', onSel)
  }, [])

  // Keys -> runtime, in capture so the runtime sees Ctrl+Alt before dsh's
  // composer handler runs. Consumed keys are stopped; everything else passes
  // straight through to dsh untouched.
  React.useEffect(() => {
    const onKey = e => {
      if (!status.booted || !rt.current) return
      const ta = document.querySelector('[data-composer-card] textarea')
      if (document.activeElement !== ta) return
      status.keyEvents += 1
      if (rt.current.notifyKey(e)) { e.preventDefault(); e.stopPropagation() }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/src/plugin.js:112-126](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/src/plugin.js#L112-L126)

固定源码接线。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx) {
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'opencues',
    order: 5,
  }, OpenCuesDock))

  // Settings surface. Registered through the public slot, so it appears in
  // dsh's own Plugins section rather than as a parallel UI of our own.
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'opencues',
    order: 20,
    label: () => 'OpenCues',
  }, OpenCuesSettingsTab))
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/index.js:220-270](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/index.js#L220-L270)

固定源码接线。

<details>
<summary>查看原文（51行）</summary>

```text
    path: '/opencues/llm',
    async handler(req, res) {
      if (req.method !== 'POST') return json(res, 405, { error: 'POST only' })
      try {
        // `done` rather than `resolve`: node:path's resolve is in scope here.
        const body = await new Promise((done, reject) => {
          let raw = ''
          req.on('data', c => {
            raw += c
            if (raw.length > 2_000_000) { reject(new Error('request too large')); req.destroy() }
          })
          req.on('end', () => { try { done(JSON.parse(raw)) } catch (e) { reject(e) } })
          req.on('error', reject)
        })

        const { provider, model, fellBack, wanted } = await resolveRoute(body.model)
        const reasoningEffort = await resolveEffort(provider, model, body.reasoningEffort)

        // OpenCues sends a flat role/content list; the harness wants the
        // system slot separated and content as typed blocks.
        const system = (body.messages ?? []).filter(m => m.role === 'system').map(m => m.content).join('\n\n')
        const messages = (body.messages ?? [])
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: [{ type: 'text', text: String(m.content ?? '') }] }))

        let text = ''
        let usage = null
        const t0 = Date.now()
        const stream = ctx.llm.stream({
          provider,
          model,
          ...(system ? { system } : {}),
          messages,
          ...(reasoningEffort ? { reasoningEffort } : {}),
          ...(typeof body.temperature === 'number' ? { temperature: body.temperature } : {}),
          ...(typeof body.maxTokens === 'number' ? { maxTokens: body.maxTokens } : {}),
        })
        for await (const chunk of stream) {
          // ONLY text-delta. `reasoning-delta` is chain-of-thought and
          // OpenCues splices whatever it gets straight into the buffer.
          if (chunk.type === 'text-delta') text += chunk.text
          else if (chunk.type === 'usage') usage = chunk.usage
          else if (chunk.type === 'finish' && chunk.reason && chunk.reason !== 'stop' && chunk.reason !== 'end_turn') {
            if (chunk.reason === 'error' || chunk.reason === 'aborted') {
              throw new Error(`harness stream ${chunk.reason}`)
            }
          }
        }
        json(res, 200, { text, usage, provider, model, reasoningEffort: reasoningEffort ?? null, ms: Date.now() - t0, ...(fellBack ? { modelFallbackFrom: wanted } : {}) })
      } catch (err) {
        json(res, 502, { error: String(err?.message ?? err).slice(0, 400) })
```

</details>

**依据 5 · 源码核查**：[integrations/dsh/build.mjs:68-83](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/build.mjs#L68-L83)

固定源码接线。

<details>
<summary>查看原文（16行）</summary>

```text
const result = await esbuild.build({
  entryPoints: [join(here, 'src/plugin.js')],
  bundle: true,
  // Minified because this artifact is COMMITTED (see .gitignore's note), so
  // its size is a per-change cost in git history, not just a download. Cuts
  // ~1.7MB to ~1.0MB, and the page loads it on every dsh boot regardless.
  // esbuild's output is byte-reproducible for identical inputs, which is what
  // lets check-dsh-bundle-fresh.sh detect a stale commit by rebuilding.
  minify: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  // Same treatment chrome's build uses: the runtime also serves Node hosts,
  // so its node-only paths must be kept out of the browser bundle. They are
  // lazily reached and already guarded by try/catch upstream.
  external: ['react', 'react-dom', 'node:fs', 'node:path', 'node:os', 'node:child_process', 'https'],
```

</details>

#### 缺口

- 未完整审计共享 runtime、生成 bundle 与宿主服务契约，无法确定全部触发和回退
  **影响**：运行结果未知
  **进一步探讨**：在固定宿主录制请求、输入及取消。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据保护能否推导请求或账号安全？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

配置 route 返回搜索路径与文本文件内容、已设置 key 名称而非 API key 值；自带 provider 的代理限定初始 URL 为 HTTPS 和预设主机，并将密钥替换进 header 或 query 后 fetch。该代码未展示宿主 Web 路由的外层鉴权，也未在本研究核对 fetch 重定向及上游响应，不能据此承诺密钥不会外泄；作者亦承认同页其他插件可能使用代理消耗额度。输入草稿可能在尚未发送会话时因建议功能发往模型。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/index.js:91-121](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/index.js#L91-L121)

固定源码接线。

<details>
<summary>查看原文（31行）</summary>

```text
  const dispose = ctx.webServer.register({
    kind: 'exact',
    path: '/opencues/config',
    async handler(req, res) {
      try {
        const budget = { files: 0, bytes: 0 }
        const files = {}
        for (const p of searchPaths) Object.assign(files, await readCuesTree(p, budget))
        // This route NEVER returns a credential value, in any mode, under
        // any parameter. Only the NAMES of the keys present, so a surface
        // can report "cerebras, groq detected" without holding secrets.
        //
        // There is deliberately no opt-in flag: dsh is a plugin host, the
        // page context is shared with third-party plugin code, and any flag
        // that can produce a secret is a flag that code can also set. The
        // runtime is handed placeholders instead and its provider requests
        // go out through /opencues/llm/proxy, which substitutes the real
        // value here, for an allowlisted destination only.
        const present = KEY_NAMES.filter(k => process.env[k])
        const body = JSON.stringify({
          searchPaths, files, cwd,
          apiKeys: {},
          fileCount: Object.keys(files).length,
          hasKeys: present,
          keysWithheld: true,
        })
        res.writeHead(200, {
          'content-type': 'application/json',
          'cache-control': 'no-store',
        })
        res.end(body)
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/index.js:530-549](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/index.js#L530-L549)

固定源码接线。

<details>
<summary>查看原文（20行）</summary>

```text
   */
  const PROVIDER_HOSTS = Object.freeze({
    // LLM providers — credential substituted.
    'api.cerebras.ai': 'CEREBRAS_API_KEY',
    'api.groq.com': 'GROQ_API_KEY',
    'api.openai.com': 'OPENAI_API_KEY',
    'api.anthropic.com': 'ANTHROPIC_API_KEY',
    'generativelanguage.googleapis.com': 'GEMINI_API_KEY',
    'openrouter.ai': 'OPENROUTER_API_KEY',
    // Data blanks — credential substituted.
    'finnhub.io': 'FINNHUB_API_KEY',
    // Data blanks — keyless, proxied only to clear CORS.
    'hacker-news.firebaseio.com': null,
    'api.open-meteo.com': null,
    'geocoding-api.open-meteo.com': null,
    'nominatim.openstreetmap.org': null,
    'api.dictionaryapi.dev': null,
    'api.coingecko.com': null,
    'status.anthropic.com': null,
  })
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/index.js:554-606](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/index.js#L554-L606)

固定源码接线。

<details>
<summary>查看原文（53行）</summary>

```text
  const disposeProxy = ctx.webServer.register({
    kind: 'exact',
    path: '/opencues/llm/proxy',
    async handler(req, res) {
      if (req.method !== 'POST') return json(res, 405, { error: 'POST only' })
      try {
        const payload = await new Promise((done, reject) => {
          let raw = ''
          req.on('data', c => {
            raw += c
            if (raw.length > 4_000_000) { reject(new Error('request too large')); req.destroy() }
          })
          req.on('end', () => { try { done(JSON.parse(raw)) } catch (e) { reject(e) } })
          req.on('error', reject)
        })

        let target
        try { target = new URL(payload.url) } catch { return json(res, 400, { error: 'bad url' }) }
        if (target.protocol !== 'https:') return json(res, 403, { error: 'https only' })
        if (!Object.prototype.hasOwnProperty.call(PROVIDER_HOSTS, target.hostname)) {
          return json(res, 403, { error: `destination not allowed: ${target.hostname}` })
        }
        const envName = PROVIDER_HOSTS[target.hostname]
        let secret = ''
        if (envName) {
          secret = process.env[envName] ?? ''
          if (!secret) return json(res, 502, { error: `${envName} is not set in this environment` })
        }

        // Substitute the placeholder wherever this destination expects auth.
        // Never echo the value back. A keyless data host substitutes
        // nothing, so a placeholder sent to one stays a placeholder.
        const headers = {}
        for (const [k, v] of Object.entries(payload.headers ?? {})) {
          if (typeof v !== 'string') continue
          headers[k] = secret && v.includes(PLACEHOLDER) ? v.split(PLACEHOLDER).join(secret) : v
        }
        if (secret) {
          // Keys ride the query string on some APIs rather than a header:
          // gemini uses `key`, finnhub uses `token`.
          for (const param of ['key', 'token']) {
            if (target.searchParams.get(param) === PLACEHOLDER) target.searchParams.set(param, secret)
          }
        }

        const upstream = await fetch(target.toString(), {
          method: payload.method ?? 'POST',
          headers,
          body: payload.body,
        })
        const text = await upstream.text()
        res.writeHead(upstream.status, { 'content-type': 'application/json', 'cache-control': 'no-store' })
        res.end(text)
```

</details>

**依据 4 · 作者声明**：[integrations/dsh/README.md:70-82](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L70-L82)

作者说明。

<details>
<summary>查看原文（13行）</summary>

```text
## Credentials

**No API key value ever reaches the page.** That matters more here than on
most hosts: dsh is a plugin host, so the page context is shared with every
other plugin you have installed, and a key handed to the page is a key handed
to all of them.

The config route reports key *names* only, the runtime is handed placeholders,
and a local route substitutes the real secret on the way out — for an
allowlisted https destination only. Stated plainly, because it is not
absolute: another plugin could still ask that route to spend your quota, but
it cannot read the key and use it elsewhere. Exfiltration is the harm being
closed.
```

</details>

#### 缺口

- 外层鉴权、重定向和实际请求未测试
  **影响**：不能保证隔离或安全
  **进一步探讨**：在隔离环境验证同页访问、重定向、敏感文本和配额。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置持久化和退出有什么成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

设置 route 验证 scalar 名称及单行值，文件不存在时以预置默认内容初始化目录和文件，再写入配置；作者说明此配置与其他 OpenCues 集成共享。清单声明 0.2.21、Web Client 与构建时共享 runtime，README 表示发布包预构建，git 安装可能需要安装脚本权限；模型调用、服务及隐私成本与具体路由有关。卸载是否清除共享配置、发布品和源码一致性均未验证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/index.js:457-500](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/index.js#L457-L500)

固定源码接线。

<details>
<summary>查看原文（44行）</summary>

```text
    path: '/opencues/settings',
    async handler(req, res) {
      if (req.method !== 'POST') return json(res, 405, { error: 'POST only' })
      try {
        const body = await new Promise((done, reject) => {
          let raw = ''
          req.on('data', c => { raw += c; if (raw.length > 200_000) { reject(new Error('too large')); req.destroy() } })
          req.on('end', () => { try { done(JSON.parse(raw)) } catch (e) { reject(e) } })
          req.on('error', reject)
        })
        const updates = body?.updates
        if (!updates || typeof updates !== 'object') return json(res, 400, { error: 'updates object required' })
        // Scalars are kebab-case keys with simple values; refuse anything
        // that could inject a second line into the frontmatter.
        for (const [k, v] of Object.entries(updates)) {
          if (!/^[a-z0-9-]+$/i.test(k)) return json(res, 400, { error: `bad scalar name: ${k}` })
          if (typeof v !== 'string' || /[\r\n]/.test(v)) return json(res, 400, { error: `bad value for ${k}` })
        }
        const path = await settingsFilePath()
        let current = ''
        let created = false
        try {
          current = await readFile(path, 'utf8')
        } catch {
          // A user who has never installed OpenCues has no `.cues`
          // directory at all, so this is the FIRST write — the missing
          // file was already handled here, but the missing PARENT was
          // not, and `writeFile` answered ENOENT. Every setting in the
          // tab was unsaveable for exactly the users the shipped
          // defaults exist to serve.
          //
          // Seed from the SHIPPED default rather than a bare `---\n---`.
          // A stub is on disk, and anything on disk wins over the baked
          // defaults, so a stub silently turns off every feature the
          // default enables explicitly — changing one setting switched
          // off word-cues and transform-blank, with no error and no way
          // for the user to connect cause to effect.
          current = await defaultSettingsMd()
          created = true
          await mkdir(dirname(path), { recursive: true })
        }
        const next = applyScalars(current, updates)
        await writeFile(path, next, 'utf8')
        json(res, 200, { ok: true, path, applied: Object.keys(updates), created })
```

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:41-59](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L41-L59)

作者说明。

<details>
<summary>查看原文（19行）</summary>

```text
## Which model sees your text

**Settings → Plugins → OpenCues.** Two choices, and the tab states the
trade-off rather than hiding it:

- **Use this app's model** (default) — your text goes to the same model as
  your conversation. No key, nothing to configure. Measured ~1.0s for a
  suggestion.
- **Use my own provider** — routes through OpenCues' own per-bucket settings
  using keys from your environment (`CEREBRAS_API_KEY`, `GROQ_API_KEY`, …).
  Noticeably faster, ~0.3s, which is worth having for cues that appear while
  you type.

dsh's own LLM layer exposes many providers, so a third option is to activate
a fast one **inside dsh** and keep the no-key convenience.

The same tab carries every OpenCues feature setting. Those are written to your
`~/.cues/OPENCUES.md`, the same file the other OpenCues integrations read — so
a change here applies to Claude Code and OpenCode too, not just this tab.
```

</details>

**依据 3 · 作者声明**：[integrations/dsh/README.md:84-90](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L84-L90)

作者说明。

```text
## Distribution

Published to npm with the browser bundle and config defaults prebuilt, which
is deliberate. The alternative — installing from git — requires you to add the
package to `allowBuilds` in your profile's `pnpm-workspace.yaml`, and that is
**permission to execute the package's code on your machine at install time**,
outside any sandbox. We would rather not ask for it, so we ship artifacts.
```

**依据 4 · 源码核查**：[integrations/dsh/package.json:35-67](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/package.json#L35-L67)

固定源码接线。

<details>
<summary>查看原文（33行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "default-opencues.md",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "node build.mjs",
    "prepublishOnly": "node build.mjs"
  },
  "devDependencies": {
    "@opencues/core": "workspace:*",
    "@opencues/runtime": "workspace:*",
    "esbuild": "^0.28.2"
```

</details>

#### 缺口

- 未实际安装、衡量调用量或测试文件权限与卸载
  **影响**：不能保证无残留或可预测费用
  **进一步探讨**：使用合成文本检查网络、配置和清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否在草稿发送前让用户更清楚模型调用？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在输入框清楚显示建议功能开关、当前提供方和最近调用状态，并在关闭后验证不再发请求，可能帮助用户理解草稿何时离开本机。可在相同任务对照默认、关闭及提供方切换，记录实际网络请求和用户理解；若关闭后仍请求、误导用户或影响正常输入，则假设不成立。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:3-12](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L3-L12)

作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
Word alternatives and `_`-gated blank fill-ins, in the dsh composer.

Type `the capital of iceland is _` and the `_` becomes `Reykjavik`. Type
`i has three cats fix typos _` and the line rewrites itself. Misspell a word
and it is offered back to you, cycled with `Ctrl+Alt+↑`. Nothing is sent
anywhere until you type an `_` or the buffer sits still — and if you never do,
the plugin is invisible.

**No API key required.** By default every call routes through the model dsh
is already configured with, so there is nothing to sign up for.
```

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:41-59](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/README.md#L41-L59)

作者说明。

<details>
<summary>查看原文（19行）</summary>

```text
## Which model sees your text

**Settings → Plugins → OpenCues.** Two choices, and the tab states the
trade-off rather than hiding it:

- **Use this app's model** (default) — your text goes to the same model as
  your conversation. No key, nothing to configure. Measured ~1.0s for a
  suggestion.
- **Use my own provider** — routes through OpenCues' own per-bucket settings
  using keys from your environment (`CEREBRAS_API_KEY`, `GROQ_API_KEY`, …).
  Noticeably faster, ~0.3s, which is worth having for cues that appear while
  you type.

dsh's own LLM layer exposes many providers, so a third option is to activate
a fast one **inside dsh** and keep the no-key convenience.

The same tab carries every OpenCues feature setting. Those are written to your
`~/.cues/OPENCUES.md`, the same file the other OpenCues integrations read — so
a change here applies to Claude Code and OpenCode too, not just this tab.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/src/plugin.js:73-78](https://github.com/opencues/opencues/blob/2ba4135524ac41bca3ac38871099db3f8e1ef7c5/integrations/dsh/src/plugin.js#L73-L78)

固定源码接线。

```text
  // Draft changes -> runtime.
  React.useEffect(() => {
    if (!status.booted || !rt.current) return
    rt.current.notifyText('user')
    status.renders += 1
  }, [draft])
```

#### 缺口

- 该交互及对照尚未实现
  **影响**：不能证明降低误传或费用
  **进一步探讨**：结合真实网络记录和用户测试验证。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
