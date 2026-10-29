# dsh-visualize

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cf6b3a3](https://github.com/Nagi-ovo/dsh-visualize/tree/cf6b3a3f5a3f02b83a380890a5b672a350715344)

<!-- BEGIN META -->
[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-visualize) [![npm 30d 4,553](https://img.shields.io/static/v1?label=npm+30d&message=4%2C553&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize)
<!-- END META -->

> **功能**：在 DSH Web 中生成、修订和重放隔离交互卡片或页面，并提供图片与草稿桥接。

> **亮点**：把生成、修订、隔离展示、重放与用户继续提问接成对话内闭环，并有有限自修复循环；模型内容和浏览器/CDN库能力不算原创。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：可见与可交互不等于公式或解释正确，lint/修复有范围；本机state、已开page更新、素材策略和CDN仍有限制，不能当生产应用或完整安全保证。见[Q02](#research-q02)至[Q05](#research-q05)。

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
  - [Q01 · 谁需要交互卡片，比文本、静态图或外部HTML多什么？](#detail-section-11)
  - [Q02 · create、update、stream和状态怎样形成可见交互？](#detail-section-12)
  - [Q03 · 隔离、prompt桥、图片代理真正限制什么？](#detail-section-13)
  - [Q04 · 使用与依赖怎样构成闭环？](#detail-section-14)
  - [Q05 · 全周期成本和效果怎样衡量？](#detail-section-15)
  - [Q06 · 谁可试用，未来什么方向可以证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向参数探索、解释和UI原型，将独立HTML制作搬进DSH对话，合格结果是正确交互与可重放修订。见[Q01](#research-q01)。

文字/静态图便于核事实，独立HTML便于完整交付；插件增加对话内交互、更新和隔离接线，代价是生成代码和状态/素材维护，效果未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：提供visualize分层指导与风格来源。
- **模型工具**：create/update交互fragment并保存meta与文件。
- **界面**：隔离卡片、流式预览、page launcher与本机状态。
- **Host 路由**：认证图片素材通道。
- **事件监听**：有限同turn selfRepair继续模型步骤。

**流程与依赖**

Web平台、host服务、模型、浏览器/CDN及两类存储各有版本和状态门槛；按能力降级而非统一可用。详表见[Q04](#research-q04)。

先用已知答案非敏感任务create，再核交互、update、重开和交付，preview与正式卡分开验收。执行者与失败动作见[Q04](#research-q04)。

**效果与成本**

新增成本在生成/修复模型步骤、内容真值核对和状态维护，单点patch未有净节费证据。生命周期成本及效果表见[Q05](#research-q05)。

对解释和原型可减少离开对话开文件，但价值需以理解正确和修订时间衡量，不能据动画或lint通过决定。保留条件见[Q06](#research-q06)。

> **思考**：可见与可交互不等于公式或解释正确，lint/修复有范围；本机state、已开page更新、素材策略和CDN仍有限制，不能当生产应用或完整安全保证。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把生成、修订、隔离展示、重放与用户继续提问接成对话内闭环，并有有限自修复循环；模型内容和浏览器/CDN库能力不算原创。见[Q01](#research-q01)、[Q02](#research-q02)。

独占精确patch、持久meta、父级source检查与素材代理有具体设计；单文件原子不等于manifest共同事务，隔离也不覆盖内容和资源正确性。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

可见与可交互不等于公式或解释正确，lint/修复有范围；本机state、已开page更新、素材策略和CDN仍有限制，不能当生产应用或完整安全保证。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用小规模非敏感解释/原型，核已知答案再扩大；正式计算或业务系统另验。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具技能、存储更新、隔离渲染、父级桥、素材策略与有限自修复；真实宿主显示、安全行为及数值正确性未运行验证。断言卡为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/StreamingPreview.tsx、src/client/VisualizeCard.tsx、src/client/card-state.ts、src/client/prompt-bridge.ts、src/fragment.ts、src/images.ts、src/index.ts、src/self-repair.ts、src/shell.ts、src/storage.ts、src/tool.ts、src/viz-helper.ts、src/window-doc.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审host/skill注册、create/update/lint入口、存储、stream预览、frame CSP、prompt/state桥、图片门禁和selfRepair；未全审所有lint规则、CDN库、生成JS、兼容版本或宿主认证实现。
- 下一步：未运行目标；后续固定宿主核显示/更新/重放/草稿/图片及断言任务，记录内容正确、失败残留、token、性能与修正时间，见[Q04](#research-q04)至[Q06](#research-q06)。

**分析版本**

- **仓库**：[Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize)
- **版本号**：0.1.7（[固定提交 cf6b3a3](https://github.com/Nagi-ovo/dsh-visualize/tree/cf6b3a3f5a3f02b83a380890a5b672a350715344)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把数据、单位、公式和边界断言独立绑定到交互卡，检验是否减少误导而不过度增加核验成本。见[Q06](#research-q06)。

未运行目标；后续固定宿主核显示/更新/重放/草稿/图片及断言任务，记录内容正确、失败残留、token、性能与修正时间，见[Q04](#research-q04)至[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 710 | — | — | 10118 |
| .js | source | 2 | 8476 | 6361 | 2261 | — |
| .ts | source | 27 | 7469 | 4737 | 2291 | — |
| .tsx | source | 6 | 2017 | 1353 | 517 | — |
| .ts | test | 20 | 3824 | 3140 | 388 | — |
| .tsx | test | 8 | 1397 | 1126 | 130 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-visualize/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-visualize/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-visualize/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：交互卡片能否改善解释和修订，隔离、持久化与自动修复是否覆盖实际使用边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要交互卡片，比文本、静态图或外部HTML多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在DSH里解释参数变化、并排方案、简单模拟或UI原型的人，可用visualize把模型生成HTML fragment变成对话内交互卡片，较大任务以page launcher打开。合格结果是数据和计算正确、交互反映参数、用户能继续修订并重开；一张会动的卡片不等于解释正确。

相对文本/静态图，卡片能调整参数看结果；相对让模型写独立HTML再开文件，插件提供技能指导、工具结果、隔离外壳、样式、存储、更新和对话桥接。host实际注册visualize tool和skill provider，client加载卡片，属于原生插件组合，不是只有提示词。模型生成图表/JS的能力、Chart.js等库与原有DSH设施不算插件原创。

适合小规模教学与探索原型；精确出版图、业务记录、多人共享持久系统或需要直接访问任意API的应用，单独制品/传统应用可能更适合。当前Web界面是交互入口，TUI/headless仅普通结果，这是作者描述，未运行多客户端验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-13](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/README.md#L13-L13)

作者用途为对话内可交互卡片。

```text
让 DSH 不只回答一段文字。模型调用 `visualize` 后，Web UI 会在对话里直接出现一张可交互卡片，用来做模拟器、图表、对比面板或 UI mockup。
```

**依据 2 · 源码核查**：[src/index.ts:75-95](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/index.ts#L75-L95)

真实tool+skill+页面/素材/修复注册。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const style = () => readStyle(config.style)
  const imageRoute = registerImageRoute(ctx)
  const images = { delivery: () => imageRoute.ready }
  // The tool's description names the style, so it is rebuilt when the
  // setting changes; calls already read the style per call.
  let toolStyle = style()
  let disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style, images))
  const events = ctx as unknown as { on(name: 'loader/volatile-update', listener: () => void): unknown }
  events.on('loader/volatile-update', () => {
    if (style() === toolStyle) return
    disposeTool()
    toolStyle = style()
    disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style, images))
  })
  ctx.skills.registerProvider(() => visualizeSkillProvider(style, cwd => styleFileLocations(ctx, cwd)))
  injectPageConfig(ctx, style)
  registerStyleFiles(ctx)
  declineGeneratedSettingsPage(ctx)
  if (config.selfRepair !== false) installSelfRepair(ctx)
}
```

</details>

**依据 3 · 源码核查**：[package.json:2-7](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/package.json#L2-L7)

包声明与入口。

```text
  "name": "@nagi-ovo/dsh-visualize",
  "description": "DSH inline visualization plugin: a visualize tool + bundled skill let the model render interactive HTML fragments as sandboxed cards in the conversation (Codex /visualize semantics).",
  "icon": "assets/icon.svg",
  "version": "0.1.7",
  "type": "module",
  "main": "lib/index.js",
```

#### 缺口

- 没有同任务理解、修订或交付结果对照。
  **影响**：不能证明更清楚、节时或替代完整应用。
  **进一步探讨**：固定解释任务对比文字/静态图/交互卡，测理解正确率、误导和修正工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · create、update、stream和状态怎样形成可见交互？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

模型create传完整fragment，工具先lint大小与结构，再解析图片并保存卡片及图片manifest；结果meta包含fragment、标题、mode、path、style和素材引用，client据meta重放。文件位于harness home的session store，宿主信息不足时回工作区viz/；这不是默认把生成文件散落项目根。

update通过报告过的path读磁盘当前fragment，再对old_str做唯一精确替换。不存在或多次匹配会拒绝并提示修正，不默默全局替换；update声明不可并发安全，create内容寻址可并发。卡片文件采用tmp+rename单文件原子写，但卡片与图片manifest分两次await，不构成共同事务；未知结果应先核文件和manifest再重复。

流式预览从参数片段提取fragment并trim未完成scripts，在调用尚未settled时展示；不能据预览可见当正式卡片已保存或JS已正确运行。完整调用结束后使用结果卡，page已开标签仍保留旧版，工具文案要求重开才读更新。

卡片可保存JSON式状态，由父页面固定stateKey写入localStorage，单卡16Ki字符、总256Ki字符并逐旧淘汰。状态来自当前浏览器，不是写回服务端或跨设备同步，也不证明生成JS状态模型正确。patch改变fragment后仍需核状态与新逻辑是否兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:195-246](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/tool.ts#L195-L246)

meta、并发声明、读取当前副本和lint。

<details>
<summary>查看原文（52行）</summary>

```text
      // Project the fragment into persisted meta so the card survives replay:
      // the canonical value is not on the wire, only content + meta are.
      presentationMeta: (_args, value) => ({
        kind: 'visualize',
        fragment: value.fragment,
        title: value.title,
        mode: value.mode,
        path: value.path,
        ...value.summary === undefined ? {} : { summary: value.summary },
        style: value.style ?? DEFAULT_STYLE,
        // References only; the card fetches the bytes from the image route.
        ...value.images?.length ? { images: value.images } : {},
      }),
    },
    // A create writes only a content-addressed card file; concurrent
    // siblings target distinct names or identical bytes, so they cannot
    // conflict. An update reads a card before rewriting it, so parallel
    // updates would each patch a base the other has already superseded.
    isConcurrencySafe: args => (args.action ?? 'create') === 'create',
    async execute(args, exec) {
      const action = (args.action ?? 'create') as VisualizeAction
      // A page card's file name says so, so a patch that forgets to restate
      // the mode still re-renders a launcher rather than a 1280px page
      // squeezed into the chat column.
      const mode = modeOf(args.mode, args.path !== undefined && action === 'update' && args.path.endsWith(PAGE_SUFFIX))
      // Cards live in a per-session store under the harness home, outside the
      // user's project (see storage.ts); legacy `viz/` workspace copies from
      // earlier sessions stay patchable through the sandboxed fs seam.
      const store = cardStore(ctx, exec)
      // An update patches the stored copy, the one card state both halves
      // agree on: persisted meta is not readable from here, and the model's
      // own transcript may hold a fragment an earlier patch already replaced.
      // It rewrites that same file rather than deriving a new name, so a
      // second patch in the same reply builds on the first — a fresh path per
      // patch would leave later patches addressing a base already superseded,
      // and each would silently drop every edit but its own.
      let source: CardFile | undefined
      let fragment: string
      let base: string | undefined
      if (action === 'update') {
        source = await store.open(required(args.path, 'path', action))
        base = await source.read()
        fragment = applyFragmentPatch(
          base,
          required(args.old_str, 'old_str', action),
          present(args.new_str, 'new_str', action),
        )
      } else {
        fragment = required(args.fragment, 'fragment', action)
      }
      // Coded lint: errors throw (nothing renders or is written), warnings ride on the result.
      const { sizeBytes, warnings } = lint.check({ fragment, maxBytes: maxFragmentBytes, sessionId: exec.agent?.session.header?.id, base })
```

</details>

**依据 2 · 源码核查**：[src/fragment.ts:130-146](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/fragment.ts#L130-L146)

精确唯一替换与拒绝分支。

<details>
<summary>查看原文（17行）</summary>

```text
 * @throws Error naming why the patch did not apply; the tool surfaces it as `isError`.
 */
export function applyFragmentPatch(base: string, oldStr: string, newStr: string): string {
  if (oldStr.length === 0) {
    throw new Error('invalid visualization patch: old_str is empty — pass the exact card text to replace')
  }
  const first = base.indexOf(oldStr)
  if (first === -1) {
    throw new Error(`invalid visualization patch: old_str does not appear in the card. ${nearestAnchor(base, oldStr)}`)
  }
  if (base.indexOf(oldStr, first + oldStr.length) !== -1) {
    throw new Error(
      `invalid visualization patch: old_str appears ${countOccurrences(base, oldStr)} times in the card — `
      + 'extend it with neighbouring lines until exactly one site matches',
    )
  }
  return base.slice(0, first) + newStr + base.slice(first + oldStr.length)
```

</details>

**依据 3 · 源码核查**：[src/tool.ts:274-292](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/tool.ts#L274-L292)

卡片与manifest分步保存及结果。

<details>
<summary>查看原文（19行）</summary>

```text
      // Read as optional: specs drive execute without a signal.
      const signal: AbortSignal | undefined = exec.signal
      signal?.throwIfAborted()
      await target.write(fragment)
      await target.images?.write(resolved.images)
      const embedded = resolved.images.map(cardImageOf)
      const report = imageReport(embedded, resolved.failures)
      return {
        action,
        path: target.displayPath,
        title,
        mode,
        sizeBytes,
        fragment,
        ...summary ? { summary } : {},
        style: cardStyle,
        ...warnings ? { warnings } : {},
        ...embedded.length > 0 ? { images: embedded } : {},
        ...report === undefined ? {} : { imageReport: report },
```

</details>

**依据 4 · 源码核查**：[src/storage.ts:113-133](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/storage.ts#L113-L133)

per-session默认存储及legacy fallback。

<details>
<summary>查看原文（21行）</summary>

```text
    async create(name) {
      if (root === undefined || typeof sessionId !== 'string' || sessionId.length === 0) {
        return await workspace.open(`viz/${name}`)
      }
      return ownedFile(root, join(root, 'sessions', sessionSegment(sessionId), name))
    },
    images: root === undefined || typeof sessionId !== 'string' || sessionId.length === 0
      ? undefined
      : sessionImages(root, sessionSegment(sessionId)),
    workspaceRoot: workspace.root,
    async open(path) {
      const owned = root === undefined ? undefined : await ownedPath(root, path)
      if (owned !== undefined) return ownedFile(root!, owned)
      const legacy = await workspacePath(workspace.root, path)
      if (legacy === undefined) {
        throw new Error(
          `invalid visualization patch: ${JSON.stringify(path)} is not a card visualize can patch — pass the path `
          + 'a visualize call reported (a card in the session store, or a legacy viz/ .html copy inside the workspace)',
        )
      }
      return await workspace.open(legacy)
```

</details>

**依据 5 · 源码核查**：[src/storage.ts:406-418](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/storage.ts#L406-L418)

tmp+rename写文件。

<details>
<summary>查看原文（13行）</summary>

```text
export async function writeFileAtomic(path: string, content: string | Uint8Array): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 })
  // Unique per write, not per millisecond: concurrent creates of the same
  // content-addressed card would otherwise share one temp file, and the
  // second rename would find it already moved. With distinct temps both
  // renames land, and identical bytes make the last one a no-op.
  const temp = `${path}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`
  try {
    await writeFile(temp, content, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    await rename(temp, path)
  } catch (error) {
    // EEXIST means the name was taken and the file is not ours to remove.
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') await rm(temp, { force: true }).catch(() => {})
```

</details>

**依据 6 · 源码核查**：[src/client/StreamingPreview.tsx:278-283](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/StreamingPreview.tsx#L278-L283)

预览提取与trim scripts。

```text
/** The mounted preview, split out so hooks only run while a call streams. */
function Preview({ argsRaw }: { argsRaw: string }) {
  const throttled = useThrottled(argsRaw)
  const fragment = extractStreamingFragment(throttled)
  const preview = fragment === undefined ? '' : trimStreamingScripts(fragment)
  const hasContent = preview.trim().length > 0
```

**依据 7 · 源码核查**：[src/tool.ts:360-367](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/tool.ts#L360-L367)

已打开page标签需重开方见新版本。

```text
function resultText(value: { action: VisualizeAction; title: string; mode: VisualizeMode; sizeBytes: number; path: string }): string {
  if (value.mode === 'page') {
    return value.action === 'update'
      ? `Patched page "${value.title}" in place (${value.sizeBytes} bytes; updated card at ${value.path}). The launcher in the conversation now opens the corrected page; a tab the user already opened keeps the old version until they open it again. Patch that path for any further correction.`
      : `Rendered "${value.title}" as a page (${value.sizeBytes} bytes; saved copy at ${value.path}). The conversation shows a launcher card with a live thumbnail; the user opens the full page in its own tab from its button.`
  }
  return value.action === 'update'
    ? `Patched "${value.title}" in place (${value.sizeBytes} bytes; updated card at ${value.path}). The user sees the corrected visualization in the conversation; patch that path for any further correction.`
```

**依据 8 · 源码核查**：[src/client/card-state.ts:7-27](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/card-state.ts#L7-L27)

localStorage、设备局限与总上限说明。

<details>
<summary>查看原文（21行）</summary>

```text
 * Storage is the dsh web page's `localStorage`, one entry per card under
 * {@link STORAGE_PREFIX}. The host offers no client-side per-session store
 * to plugins (its own persisted UI stores are `localStorage` too), so state
 * is per browser profile and per dsh origin, and does not follow the session
 * to another device. Every access is wrapped: a browser that refuses storage
 * (private mode, blocked site data, quota) still keeps state in memory for
 * the life of the page.
 *
 * Identity: a card is its session plus its `path`. A create takes a
 * content-addressed path (`<slug>-<hash>`), so new markup starts clean, while
 * an `update` patches the same path and keeps what the reader set: a patch is
 * almost always a correction the reader asked for while looking at their own
 * settings. A kept control that no longer accepts its value (a removed
 * option, a type that changed) is left at its markup default by the frame.
 * Cards without a path (arguments-only replays) fall back to their call id.
 *
 * Trust: the frame runs model-written script, so the card takes a state
 * message only from its own frame window with its token, decides the key
 * itself (the message never names one), caps each card at
 * {@link CARD_STATE_MAX_CHARS} and all cards together at
 * {@link STATE_TOTAL_MAX_CHARS}, evicting the cards changed longest ago.
```

</details>

**依据 9 · 源码核查**：[src/viz-helper.ts:67-67](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/viz-helper.ts#L67-L67)

单卡状态上限。

```text
export const CARD_STATE_MAX_CHARS = 16 * 1024
```

#### 缺口

- 真实宿主流式装配、patch重放、状态升级与多设备体验未知。
  **影响**：不能从工具成功文案推完整可见交互通过。
  **进一步探讨**：在目标版本核create→patch→重开→清缓存/换设备，检查文件、meta、state和显示一致。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隔离、prompt桥、图片代理真正限制什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

卡片运行在allow-scripts且无allow-same-origin的iframe，CSP默认none，限制frame/object/form/connect；允许inline/eval/wasm及指定CDN静态资源，这是在隔离上下文里运行模型代码，不是禁用JS。connect-src只blob/data，并不等于完全无网络：允许的CDN仍可加载script、font、image等，素材代理也会服务器下载公网图片。库版本、CDN可达性和生成内容仍需审阅。

prompt桥由父页面验证event.source为本卡iframe、token、最多2000字符、300ms间隔和焦点/用户激活；宿主没有userActivation字段时仅依赖焦点。它只setDraft并focus，不代用户提交；保留用户已经写或改过的草稿，只可替换空草稿或此前卡片写入的同句。它降低自动发言风险，但无法保证建议文本有益或不误导，用户仍须审阅。

状态桥同样核当前frame与token，存储key由父页面决定，而非接受卡片指定其他卡key。这个前端归属门禁不等于后端所有卡片更新都按会话授权：store.open的ownedPath限制插件store和真实路径，并未在该函数逐当前session核归属。这里不声称多用户越权已发生，部署隔离需要另核宿主。

图片支持工作区文件和http(s)。本地先词法范围、再fs.resolve/contains，后stat/readBytes限制大小；源码明示contains与read之间符号链接可被有写权限者换掉，这是已知边界而非本轮复现。公网下载使用socket DNS检查、逐跳重定向与体积/时限约束，image route走connection的认证/api通道；缺路由时工具标素材不可投递。上述具体检查不等于完整安全审计，也不验证图片许可或视觉真实性。

#### 证据与依据

**依据 1 · 源码核查**：[src/shell.ts:21-48](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/shell.ts#L21-L48)

CDN允许表与实际CSP。

<details>
<summary>查看原文（28行）</summary>

```text
/** CDN origins a fragment may load static resources from. */
export const RESOURCE_ORIGINS = [
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
  'https://esm.sh',
  'https://fonts.bunny.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://unpkg.com',
] as const

const RESOURCE_SOURCES = ['blob:', 'data:', ...RESOURCE_ORIGINS].join(' ')

/** The frame document's Content-Security-Policy. */
export const FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  'connect-src blob: data:',
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')
```

</details>

**依据 2 · 源码核查**：[src/client/VisualizeCard.tsx:360-365](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/VisualizeCard.tsx#L360-L365)

iframe实际sandbox属性。

```text
  return (
    <iframe
      ref={frameRef}
      key={colorScheme}
      sandbox={FRAME_SANDBOX}
      referrerPolicy="no-referrer"
```

**依据 3 · 源码核查**：[src/window-doc.ts:19-20](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/window-doc.ts#L19-L20)

sandbox flags实际仅allow-scripts。

```text
/** Sandbox flags shared by the in-chat card and the windowed page. */
export const FRAME_SANDBOX = 'allow-scripts'
```

**依据 4 · 源码核查**：[src/client/VisualizeCard.tsx:311-323](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/VisualizeCard.tsx#L311-L323)

父级source/token/激活与频率检查。

<details>
<summary>查看原文（13行）</summary>

```text
function usePromptRelay(frameRef: RefObject<HTMLIFrameElement | null>, token: string, prompt: PromptSink | undefined) {
  const lastAt = useRef(-Infinity)
  useEffect(() => {
    if (prompt === undefined) return
    const onMessage = (event: MessageEvent) => {
      const frame = frameRef.current
      if (frame === null || event.source !== frame.contentWindow) return
      const text = readPromptMessage(event.data, token)
      if (text === undefined || !readerIsInFrame(frame)) return
      const now = performance.now()
      if (now - lastAt.current < PROMPT_INTERVAL_MS) return
      lastAt.current = now
      prompt(text)
```

</details>

**依据 5 · 源码核查**：[src/client/prompt-bridge.ts:62-108](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/prompt-bridge.ts#L62-L108)

字符、焦点/激活及只写草稿。

<details>
<summary>查看原文（47行）</summary>

```text
export function readPromptMessage(data: unknown, token: string): string | undefined {
  if (typeof data !== 'object' || data === null) return undefined
  const message = data as { type?: unknown; token?: unknown; text?: unknown }
  if (message.type !== PROMPT_MESSAGE_TYPE || message.token !== token) return undefined
  if (typeof message.text !== 'string') return undefined
  // Control characters other than tab and newline have no place in a draft.
  // eslint-disable-next-line no-control-regex
  const text = message.text.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/gu, '').trim()
  if (text === '' || text.length > PROMPT_MAX_CHARS) return undefined
  return text
}

/**
 * Whether the reader is interacting with this frame right now. Activation
 * alone is not enough: it lingers for seconds after any click on the chat
 * page, so a card that loads right after the reader opens a session would
 * pass. Focus pins it to this frame — a click inside the frame makes it the
 * page's active element, and a cross-origin frame cannot take focus without
 * the reader's own gesture. Browsers without `userActivation` rely on focus.
 * @param frame - the card's iframe.
 * @returns true when the frame holds focus during a user activation.
 */
export function readerIsInFrame(frame: HTMLIFrameElement): boolean {
  if (frame.ownerDocument.activeElement !== frame) return false
  const activation = (navigator as { userActivation?: { isActive?: boolean } }).userActivation
  return typeof activation?.isActive !== 'boolean' || activation.isActive
}

/**
 * Put prompt text into the composer when it is idle and holds nothing of the
 * reader's own: empty, or exactly what a card drafted there last.
 * @param input - the session's input facade.
 * @param text - cleaned prompt text.
 * @param carded - the text a card last drafted in this session, if any.
 * @returns the outcome.
 */
export function draftPrompt(input: ComposerInput, text: string, carded?: string): PromptOutcome {
  const state = input.state?.getSnapshot()
  if (state?.phase !== undefined && state.phase !== 'plain') return 'busy'
  const draft = state?.draft?.trim() ?? ''
  if (draft !== '' && draft !== carded) {
    input.notify?.('info', keptDraftNotice())
    return 'kept-draft'
  }
  input.setDraft(text)
  input.focus?.()
  return 'drafted'
```

</details>

**依据 6 · 源码核查**：[src/client/VisualizeCard.tsx:288-299](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/VisualizeCard.tsx#L288-L299)

状态key由父级指定且核source。

<details>
<summary>查看原文（12行）</summary>

```text
function useStateRelay(frameRef: RefObject<HTMLIFrameElement | null>, token: string, stateKey: string | undefined) {
  useEffect(() => {
    if (stateKey === undefined) return
    const onMessage = (event: MessageEvent) => {
      const frame = frameRef.current
      if (frame === null || event.source !== frame.contentWindow) return
      const values = readStateMessage(event.data, token)
      if (values !== undefined) cardStates.write(stateKey, values)
    }
    addEventListener('message', onMessage)
    return () => removeEventListener('message', onMessage)
  }, [frameRef, token, stateKey])
```

</details>

**依据 7 · 源码核查**：[src/storage.ts:218-232](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/storage.ts#L218-L232)

ownedPath根目录与realpath限制范围。

<details>
<summary>查看原文（15行）</summary>

```text
export async function ownedPath(root: string, path: string): Promise<string | undefined> {
  const expanded = path === '~' || path.startsWith('~/') ? join(homedir(), path.slice(1)) : path
  if (!isAbsolute(expanded)) return undefined
  const target = resolve(expanded)
  if (!inside(root, target) || !target.endsWith('.html')) return undefined
  // A symlink inside the store — the file or a directory above it — must not
  // carry a read or a write anywhere else.
  const real = await realpath(target).catch(async () => await realpath(dirname(target)).then(
    parent => join(parent, 'card.html'),
    () => undefined,
  ))
  // Nothing on disk yet: the card does not exist, and the read fails loudly.
  if (real === undefined) return target
  const realRoot = await realpath(root).catch(() => root)
  return inside(realRoot, real) ? target : undefined
```

</details>

**依据 8 · 源码核查**：[src/images.ts:333-356](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/images.ts#L333-L356)

文件contains/read门禁和竞态注释。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!inside(base, lexical)) throw new ImageError('outside the workspace; only files inside the workspace can be embedded')
    const fs = ctx.fs as unknown as Partial<BinaryFs> | undefined
    if (typeof fs?.resolve !== 'function' || typeof fs.contains !== 'function'
      || typeof fs.stat !== 'function' || typeof fs.readBytes !== 'function') {
      throw new ImageError('this dsh host cannot read binary workspace files; save the image somewhere with an https URL instead')
    }
    const opts = { cwd: base, signal }
    const [rootTarget, target] = await Promise.all([fs.resolve(base, opts), fs.resolve(lexical, opts)])
    if (!fs.contains(rootTarget, target)) {
      throw new ImageError('resolves outside the workspace through a symlink; only files inside the workspace can be embedded')
    }
    // Accepted: a symlink swapped in between contains() and readBytes() could
    // still redirect the read. Doing that needs write access to the
    // workspace, which the agent already has along with tools that read
    // anything this could.
    const info = await fs.stat(target, signal)
    if (info === undefined) throw new ImageError('not found in the workspace; check the path relative to the workspace root')
    if (info.type !== 'file') throw new ImageError('not a regular file')
    if (info.size !== undefined && info.size > maxBytes) throw new TooLarge()
    try {
      return await fs.readBytes(target, signal, maxBytes)
    } catch (error) {
      if ((error as { code?: unknown }).code === 'FS_TOO_LARGE') throw new TooLarge()
      throw error
```

</details>

**依据 9 · 源码核查**：[src/images.ts:429-445](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/images.ts#L429-L445)

下载策略和实际每跳检查/请求。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Fetch image URLs with node's own http stack, guarded against SSRF: only
 * http(s), no credentials in the URL, every hop's address checked by the
 * policy — an IP literal before the request, a name inside the socket's DNS
 * lookup — at most `maxRedirects` redirects, no content encoding, and the body
 * cut off past the cap. A fresh agent per request means no pooled socket
 * skips the lookup.
 * @param options - redirect budget and address policy.
 * @returns the fetcher.
 */
export function urlFetcher(options: FetcherOptions): UrlFetcher {
  const policy = options.policy ?? publicOnly
  return async (url, signal, maxBytes) => {
    let current = url
    for (let hop = 0; ; hop += 1) {
      checkUrl(current, policy)
      const response = await get(current, policy, signal)
```

</details>

**依据 10 · 源码核查**：[src/index.ts:164-182](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/index.ts#L164-L182)

图片通过认证connection通道注册与ready。

<details>
<summary>查看原文（19行）</summary>

```text
function registerImageRoute(ctx: Context): { readonly ready: boolean } {
  const state = { ready: false }
  ctx.inject(['connection'], (scope) => {
    const fetch = (scope.get('connection') as { fetch?: Partial<ConnectionFetch> } | undefined)?.fetch
    if (typeof fetch?.register !== 'function') return
    const register = fetch.register.bind(fetch) as ConnectionFetch['register']
    scope.effect(() => {
      const dispose = register({
        path: IMAGE_ROUTE_PATH,
        methods: ['GET', 'HEAD'],
        requestBody: 'buffered',
        fetch: async request => await handleImageRequest(storeRoot(ctx), request),
      })
      state.ready = true
      return () => {
        state.ready = false
        return dispose()
      }
    }, 'dsh-visualize: card images route')
```

</details>

#### 缺口

- 目标浏览器隔离、宿主认证、多会话更新边界及完整图片策略未攻击验证。
  **影响**：不能把CSP/SSRF检查存在写成任意生成代码安全。
  **进一步探讨**：在隔离环境核外联、跨frame草稿、私网重定向、symlink更换及跨会话path行为，记录拒绝和残留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用与依赖怎样构成闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

固定package0.1.7的host/client构建入口分别为src/index.ts和src/client/index.tsx，lib为分发入口，peer列DSH服务、schema和React。README称构建产物已提交及0.1.1-rc.2至0.2.1-rc.2兼容；这些不能代替固定宿主运行。尤其图片认证路由和composer bridge依赖较新宿主服务，老版本可能降级，不是所有功能都有同样版本覆盖。

| 条件 | 用途/门槛 | 失败边界 |
|---|---|---|
| DSH Web、工具/技能/fs和React平台模块 | 工具注册、可见卡片和文件读取 | TUI/headless无交互卡；服务和UI需对齐 |
| 模型生成完整fragment | 内容、JS计算和交互行为 | lint通过不保证公式/数据正确 |
| 浏览器sandbox与CDN | 运行隔离卡片和外部静态库 | 离线或CDN不可达可影响图表/字体 |
| home store及localStorage | 卡片/图片持久化与浏览器参数状态 | 数据跨设备和清缓存需要另外安排 |
| 新宿主connection/composer | 认证图片和审阅草稿桥 | 老宿主降级，不自动放宽隔离 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 用户选非敏感小任务 | 输入数据/公式/用途明确 | 高风险计算先用可靠外部工具核数 |
| 模型create | 完整结果卡可见，数据与参数逻辑核对 | 不以preview代验收，读错误再修 |
| 用户交互与草稿桥 | 参数变化正确，草稿保留且不自动发 | 错误时停用该桥，人工输入 |
| 模型按path单点update | 唯一替换，磁盘/meta与可见版本对应 | 不匹配核当前原文，不盲重发 |
| 用户重开page/会话 | 卡片重放与本机state行为可解释 | 已开页重开；状态丢失需手动恢复 |
| 用户交付 | 导出/保存所需制品并复核数值 | 不能把本机交互状态当他人收到的完整结果 |


#### 证据与依据

**依据 1 · 源码核查**：[tsdown.config.ts:27-52](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/tsdown.config.ts#L27-L52)

host/client映射与平台外部模块。

<details>
<summary>查看原文（26行）</summary>

```text
export default [
  {
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    fixedExtension: false,
    dts: true,
    clean: true,
    deps: {
      // schemastery stays unbundled because the Loader validates the plugin's
      // `Config` schema and must see its own schemastery instance; cordis is
      // type-only in this bundle.
      neverBundle: ['@deepseek-ai/schemastery', '@deepseek-ai/cordis'],
    },
  },
  {
    // Browser bundle: lib/client.js, served by the harness at /plugins/<id>/client.js.
    entry: { client: 'src/client/index.tsx' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    dts: false,
    clean: false,
    deps: { neverBundle: [...CLIENT_EXTERNALS] },
```

</details>

**依据 2 · 源码核查**：[package.json:51-64](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/package.json#L51-L64)

原生client和peer服务。

<details>
<summary>查看原文（14行）</summary>

```text
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-fs": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/dsh-sandbox-policy": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/dsh-skill": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/schemastery": "^3.18.1",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-client-store": "0.1.7-rc.2",
    "@deepseek-ai/dsh-client-ui-chat": "0.1.7-rc.2",
```

</details>

**依据 3 · 源码核查**：[src/index.ts:32-34](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/index.ts#L32-L34)

必需tools/skills/fs。

```text
export const name = 'dsh-visualize'
/** Required services: the tool registry, the skill registry, and the fs seam. */
export const inject = ['tools', 'skills', 'fs']
```

**依据 4 · 作者声明**：[README.md:29-32](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/README.md#L29-L32)

作者提交构建产物与兼容范围声明。

```text

也可以从 GitHub 安装：`dsh plugin --profile web add github:Nagi-ovo/dsh-visualize`。可以运行 `dsh --profile web --dump-config` 确认插件已经进入最终配置。需要修改源码时，克隆仓库并在仓库目录运行 `dsh plugin --profile web add .`；构建产物已经提交，不需要额外构建。使用社区 [plugin-registry](https://github.com/dsh-external/plugin-registry) 的用户也可以从「设置 → 插件」安装。

兼容 DSH 0.1.1-rc.2 到 0.2.1-rc.2。
```

**依据 5 · 源码核查**：[src/client/prompt-bridge.ts:16-18](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/prompt-bridge.ts#L16-L18)

新宿主input facade及老宿主无桥。

```text
 * Host surface (dsh 0.1.7+): `sessions.scope(id).get('conversation').input
 * .for(scope)` yields the session's input facade (`setDraft`, `focus`,
 * `notify`, `state`). Older hosts lack it and the bridge stays off.
```

#### 缺口

- 目标宿主、浏览器、离线及发布制品对应未运行。
  **影响**：不能把广泛兼容声明扩为每项能力可用。
  **进一步探讨**：固定宿主与浏览器执行表中create/update/图片/桥接/重放并分别记录降级。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本和效果怎样衡量？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 成本来源 | 当前证据边界 |
|---|---|---|
| 启用 | 宿主/浏览器、样式、存储和素材授权配置 | 有依赖声明，无目标环境验收 |
| 生成与修订 | 模型生成JS/HTML、lint、patch、图像下载 | 单点patch可能省重发，但无token/费用对照 |
| 日常 | iframe、图表/动画、CDN、图片和状态存储 | 没有实际性能上界或长期磁盘清理验收 |
| 核对 | 数值、公式、参数边界、误导与无障碍 | 可交互不等于理解正确 |
| 自动修复 | 默认selfRepair，最多2次steer/turn、指纹去重 | 增加模型步骤，修复仅覆盖特定lint/缺卡信号 |
| 维护/退出 | 宿主UI桥、CDN、历史卡片/manifest与本机state | 旧page需重开；本机state不是交付协议 |

#### 效果

| 效果 | 当前支持 | 未知 |
|---|---|---|
| 对话内交互 | 工具/skill、隔离渲染及草稿桥 | 理解提升和用户持续偏好 |
| 修订 | 当前磁盘原文唯一替换、错误提示与修复steer | 总修复次数、净费用与语义正确率 |
| 重放 | 持久meta/文件、本机状态保存 | 跨设备、长期兼容与多人共享 |

自我修复是自动继续模型循环的实际机制，非只有预设工作流，但它依据特定事件/警告启发式，不执行图表内容真值判断。最大fragment默认1,000,000字节限制输入体积，不给生成的JS CPU时间或任意内存设统一资源预算；隔离与资源耗尽是不同问题。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-65](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/index.ts#L62-L65)

fragment大小与默认selfRepair。

```text
export const Config: z<Config> = z.object({
  maxFragmentBytes: z.natural().default(1_000_000),
  style: styleFieldSchema(),
  selfRepair: z.boolean().default(true).description('Same-turn self-repair · 同回合自我修复'),
```

**依据 2 · 源码核查**：[src/self-repair.ts:88-94](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/self-repair.ts#L88-L94)

每turn最多2次及特定breaking warning。

```text
/** Corrections steered into one turn, whatever their kind. */
export const MAX_STEERS_PER_TURN = 2
/** Non-blank lines a fenced block needs before it reads as a whole card. */
export const MIN_FENCE_LINES = 8

/** Warning codes whose card is broken, not merely off-style. */
const BREAKING_WARNINGS: ReadonlySet<LintCode> = new Set<LintCode>(['VZ102', 'VZ106', 'VZ107'])
```

**依据 3 · 源码核查**：[src/self-repair.ts:400-417](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/self-repair.ts#L400-L417)

指纹判重与实际agent.steer。

<details>
<summary>查看原文（18行）</summary>

```text
  })

  events.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (signal?.aborted === true || typeof agent?.steer !== 'function') return
    const key = sessionKey(agent.session)
    const state = key === undefined ? undefined : turns.get(key)
    if (state === undefined || state.turn !== turn || state.subagent) return
    if (state.steers >= MAX_STEERS_PER_TURN) return
    const plan = planRepairs(state.facts).find(p => !state.fingerprints.has(p.fingerprint))
    if (plan === undefined) return
    // Counted before sending: a re-entrant boundary must not deliver twice.
    state.fingerprints.add(plan.fingerprint)
    state.steers += 1
    try {
      agent.steer(correctionMessage(plan.text, agent.session?.header?.version) as never)
    } catch (error) {
      logger?.warn?.(`dsh-visualize: self-repair steer failed (${error instanceof Error ? error.message : String(error)})`)
    }
```

</details>

**依据 4 · 源码核查**：[src/tool.ts:234-246](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/tool.ts#L234-L246)

唯一patch后lint。

<details>
<summary>查看原文（13行）</summary>

```text
      if (action === 'update') {
        source = await store.open(required(args.path, 'path', action))
        base = await source.read()
        fragment = applyFragmentPatch(
          base,
          required(args.old_str, 'old_str', action),
          present(args.new_str, 'new_str', action),
        )
      } else {
        fragment = required(args.fragment, 'fragment', action)
      }
      // Coded lint: errors throw (nothing renders or is written), warnings ride on the result.
      const { sizeBytes, warnings } = lint.check({ fragment, maxBytes: maxFragmentBytes, sessionId: exec.agent?.session.header?.id, base })
```

</details>

**依据 5 · 源码核查**：[src/shell.ts:35-48](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/shell.ts#L35-L48)

隔离策略不等于执行资源预算。

<details>
<summary>查看原文（14行）</summary>

```text
export const FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  'connect-src blob: data:',
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')
```

</details>

#### 缺口

- 缺任务理解、总修订费用、性能与长期恢复数据。
  **影响**：无法证明交互和自动修复的净收益。
  **进一步探讨**：同任务静态/交互对比，记录答案正确率、误导、token、steer次数、CPU/帧时及修正。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，未来什么方向可以证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

需要解释参数变化或做可丢弃原型、并愿意独立核数据和JS逻辑的DSH Web用户，可在非敏感小任务有限试用。先选有已知答案的图表/模拟，核初值、边界和反例，再试单点update和重放，确认桥只写待审草稿。高风险计算和正式业务状态不要仅凭卡片显示决定。

保留条件是用户对同一问题理解更准确、修订更快且生成/修复负担可控；若公式不符、交互误导、草稿被意外替换或重放无法解释，应停相关卡片/桥并回表格、静态图或单独可审阅制品。图片路由不可用时接受明确失败，不放宽网络/文件边界凑效果。

未来可验证“带数据/公式断言的交互解释卡”假设。把原始数据、单位、公式与几个边界输出作为独立可审阅记录，再核生成图是否遵守；比只lint markup，可能减少漂亮但错误的可视化，代价是额外建模、断言维护和验证成本。

最小实验包含单位混用、极值、零除、缺值与错误轴，对照当前卡片和附断言方案，记录用户判断错误、检测率、遗漏、总调用和人工时间。若只让断言与图一起重复同一错误、或核验成本超过收益，应推翻或收窄到结构化数据图表；不把此方案说成当前已实现的内容校验。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool.ts:245-246](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/tool.ts#L245-L246)

当前lint入口为断言方案的实际参照。

```text
      // Coded lint: errors throw (nothing renders or is written), warnings ride on the result.
      const { sizeBytes, warnings } = lint.check({ fragment, maxBytes: maxFragmentBytes, sessionId: exec.agent?.session.header?.id, base })
```

**依据 2 · 源码核查**：[src/self-repair.ts:88-94](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/self-repair.ts#L88-L94)

现有修复信号不是数值真值校验。

```text
/** Corrections steered into one turn, whatever their kind. */
export const MAX_STEERS_PER_TURN = 2
/** Non-blank lines a fenced block needs before it reads as a whole card. */
export const MIN_FENCE_LINES = 8

/** Warning codes whose card is broken, not merely off-style. */
const BREAKING_WARNINGS: ReadonlySet<LintCode> = new Set<LintCode>(['VZ102', 'VZ106', 'VZ107'])
```

**依据 3 · 源码核查**：[src/client/prompt-bridge.ts:98-108](https://github.com/Nagi-ovo/dsh-visualize/blob/cf6b3a3f5a3f02b83a380890a5b672a350715344/src/client/prompt-bridge.ts#L98-L108)

只写草稿是试用验收边界。

<details>
<summary>查看原文（11行）</summary>

```text
export function draftPrompt(input: ComposerInput, text: string, carded?: string): PromptOutcome {
  const state = input.state?.getSnapshot()
  if (state?.phase !== undefined && state.phase !== 'plain') return 'busy'
  const draft = state?.draft?.trim() ?? ''
  if (draft !== '' && draft !== carded) {
    input.notify?.('info', keptDraftNotice())
    return 'kept-draft'
  }
  input.setDraft(text)
  input.focus?.()
  return 'drafted'
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
