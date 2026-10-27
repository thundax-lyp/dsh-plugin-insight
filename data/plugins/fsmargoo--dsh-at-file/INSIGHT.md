# dsh-at-file

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[da602d1](https://github.com/FSMargoo/dsh-at-file/tree/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524)

<!-- BEGIN META -->
[![GitHub ★ 533](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=533&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FSMargoo/dsh-at-file) [![npm 30d 7,020](https://img.shields.io/static/v1?label=npm+30d&message=7%2C020&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-at-file) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-at-file)
<!-- END META -->

> **功能**：在 DSH Web 输入框搜索工作区路径并插入文件或目录引用

> **亮点**：[Q01](#research-q01) 把路径搜索、存在性标记与Agent步前消息接通，贡献是引用入口便利，不是文件解析或阅读算法。

> **主要限制**：[Q02](#research-q02) 路径存在不证明内容、版本和读取授权；词法根内路径可以是根外目标的符号链接。[Q03](#research-q03) 作者已建议新用户优先原生，继续引入独立插件的增量需重新验证。

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
  - [Q01 · @提及相比手工路径多做什么，是否读入正文？](#detail-section-11)
  - [Q02 · 工作区边界和索引完整性保证到哪里？](#detail-section-12)
  - [Q03 · 原生替代下谁还值得付出维护成本？](#detail-section-13)
  - [Q04 · 路径引用能否加按需证据预检而不加载全文？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH消息里准确指向文件的用户，可通过@菜单选择路径，模型稍后按需读取。

手工输入准确相对路径；对新安装还需按作者建议先检查官方原生引用，未独立验证原生逐功能等价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 路径选择器 | 减少手工路径拼写 | 索引有上限，受忽略规则影响 |
| 引用标记 | 向模型指向文件或目录 | 不读取正文，不保证固定版本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH agents、settings、Typert | 必需 | 步前标记与设置服务 | 退回原生或手工路径 |
| Web输入框和插槽 | 选择器必需 | 展示搜索候选 | 仅路径文本不能证明菜单可用 |
| 可访问工作区 | 索引必需 | stat与目录搜索 | 无法访问跳过，候选缺失非不存在 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核对 | 用户先检查原生引用是否够用 | 够用则不增加插件 |
| 选择 | 旧安装用户搜索并选相对路径 | 草稿路径正确 |
| 执行 | 模型收到存在性标记后按需读取 | 读取权限与内容由宿主工具确认 |
| 退出 | 用户禁用插件并核对常用任务 | 发现重复标记回原生或手工 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地索引与原模型，金额未知 | 客户端兼容和过滤配置 | 不建议新安装优先引入 |
| 持续使用 | 索引资源与后续读取token | 路径确认及版本维护 | 不直接注入全文不代表总量节省 |
| 失败恢复 | 重新索引或读取 | 核对链接、手工补路径 | 索引可截断和跳过 |
| 退出 | 既有配置备份 | 禁用后用原生/手工引用 | 未做同版退出验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 路径定位 | 搜索候选与存在性标记 | 相比当前原生的实际额外价值 |
| 上下文输入 | 只注入路径与类型 | 后续实际阅读token和任务正确性 |
| 工作区界限 | 词法路径限制 | 链接目标读取授权由宿主决定 |

> **思考**：[Q02](#research-q02) 路径存在不证明内容、版本和读取授权；词法根内路径可以是根外目标的符号链接。[Q03](#research-q03) 作者已建议新用户优先原生，继续引入独立插件的增量需重新验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把路径搜索、存在性标记与Agent步前消息接通，贡献是引用入口便利，不是文件解析或阅读算法。

[Q01](#research-q01)拒绝优先、实时开关与纯引用注入边界清晰；[Q02](#research-q02)索引限额和损坏链接容错有明确行为，但词法根内不等于真实目标隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 路径存在不证明内容、版本和读取授权；词法根内路径可以是根外目标的符号链接。[Q03](#research-q03) 作者已建议新用户优先原生，继续引入独立插件的增量需重新验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 新用户先看原生引用，旧用户只保留确有差异的路径筛选需求。重复标记或目标不符立即禁用并回准确相对路径。

最小验证包括普通文件、目录、指向根外的无敏感链接以及标记后修改的文件，比较旧标记与带摘要收据对错读、误报和额外读取次数的影响。若宿主原生已提供同等能力，或每次计算摘要比直接读取更贵且不减少错读，就停止独立扩展。本轮没有用户事故或成本数据，只是由静态边界推导的假设。 依据见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

路径标记机制与静态边界有源码依据，原生替代等价性和实际token收益未知；引用收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/mention.ts、src/files.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定da602d1a8f1b417b8a1d8d4059e0f4cb1c353524，检查README、package、Host注册、提及扫描与解析、索引链接分支；未独立审查最新DSH原生引用。
- 下一步：仅固定源码检查，未安装或执行目标代码与其测试，未验证当前浏览器显示和宿主兼容。

**分析版本**

- **仓库**：[FSMargoo/dsh-at-file](https://github.com/FSMargoo/dsh-at-file)
- **版本号**：0.7.0（[固定提交 da602d1](https://github.com/FSMargoo/dsh-at-file/tree/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可提出未验证的引用收据机制，在保持只传路径的前提下附当前版本/文件摘要、链接目标说明和读取权限结果，模型按需读取，父端再判断证据是否对应原版本。相对现有存在性标记，增量是降低后续读取错文件或文件变动未察觉的风险，而不是把所有内容提前灌入上下文。

最小验证包括普通文件、目录、指向根外的无敏感链接以及标记后修改的文件，比较旧标记与带摘要收据对错读、误报和额外读取次数的影响。若宿主原生已提供同等能力，或每次计算摘要比直接读取更贵且不减少错读，就停止独立扩展。本轮没有用户事故或成本数据，只是由静态边界推导的假设。 依据见 [Q04](#research-q04)。

仅固定源码检查，未安装或执行目标代码与其测试，未验证当前浏览器显示和宿主兼容。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 287 | — | — | 3675 |
| .mjs | source | 1 | 94 | 76 | 10 | — |
| .js | source | 3 | 32450 | 31708 | 1184 | — |
| .tsx | source | 4 | 755 | 659 | 45 | — |
| .ts | source | 20 | 2540 | 1981 | 427 | — |
| .tsx | test | 5 | 1318 | 1183 | 28 | — |
| .ts | test | 8 | 1592 | 1425 | 51 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/FSMargoo/dsh-at-file/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/FSMargoo/dsh-at-file/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/FSMargoo/dsh-at-file/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：路径提及实际注入什么，作者建议原生替代后还有何种保留价值？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · @提及相比手工路径多做什么，是否读入正文？

**研究主题**：场景与需求、功能与机制

#### 完整回答

目标是经常让DSH查看工作区某个文件或目录的用户，原办法是手工输入准确相对路径。插件在浏览器提供候选，并在每个Agent的pre-step扫描用户来源文本，将存在路径转换为workspace-reference消息。它只注入相对路径和file/directory类型，未读文件正文，也不列目录后代。实际模型仍需调用当前会话工具读取。

这减少拼写和文件定位摩擦，不能据“提及PDF”推断自动解析PDF，更不能把标记当作证据摘录。源码尊重下游reject、实时启用开关，默认忽略受保护的粘贴提及；自动拼接的消息也不覆盖用户原文字。它是引用入口，不是新的文件理解器。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:98-111](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/index.ts#L98-L111)

真实Agent创建后注册pre-step入口。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('agent/created', ({ agent }) => {
    agent.ctx.effect(() => {
      const stop = agent.ctx.on('agent/pre-step', async ({ messages, signal }, next) => {
        return mentionPreStep(
          agent,
          () => settings.get().enabled,
          messages,
          signal,
          next,
          () => settings.get().ignorePastedMentions ?? true,
        )
      })
      return () => { stop() }
    }, 'dsh-at-file: pre-step path references')
```

</details>

**依据 2 · 源码核查**：[src/mention.ts:110-132](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/mention.ts#L110-L132)

只扫描用户来源文本，注入路径和类型。

<details>
<summary>查看原文（23行）</summary>

```text
  ignorePastedMentions = true,
): Promise<UserMessage[]> {
  if (cwd === undefined || !isAbsolute(cwd)) return []
  const tokens: string[] = []
  for (const message of messages) {
    if (message.source.kind !== USER_SOURCE_KIND) continue
    for (const block of message.content) {
      if (block.type !== 'text') continue
      const text = ignorePastedMentions ? block.text : stripPastedMentionMarkers(block.text)
      tokens.push(...scanMentions(text, ignorePastedMentions))
    }
  }
  const injections: UserMessage[] = []
  for (const token of tokens) {
    signal.throwIfAborted()
    const mention = await resolveMention(token, cwd, signal)
    if (mention === undefined) continue
    injections.push(createUserMessage({
      content: [{ type: 'text', text: referenceForm(mention) }],
      source: { kind: 'at-file-mention', relative: mention.relative },
    }))
  }
  return injections
```

</details>

**依据 3 · 源码核查**：[src/mention.ts:151-181](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/mention.ts#L151-L181)

先尊重下游拒绝，再按开关追加引用。

<details>
<summary>查看原文（31行）</summary>

```text
export async function mentionPreStep(
  agent: MentionAgent,
  isEnabled: () => boolean,
  messages: readonly UserMessage[],
  signal: AbortSignal,
  next: () => Promise<PreStepDecision>,
  ignorePastedMentions: () => boolean = () => true,
): Promise<PreStepDecision> {
  const decision = await next()
  if (decision.kind === 'reject') return decision
  const pastedSetting = ignorePastedMentions()
  const cleanMessages = pastedSetting
    ? decision.messages.map(message => {
      if (message.source.kind !== USER_SOURCE_KIND) return message
      let changed = false
      const content = message.content.map(block => {
        if (block.type !== 'text' || !block.text.includes(PASTED_MENTION_MARKER)) return block
        changed = true
        return { ...block, text: stripPastedMentionMarkers(block.text) }
      })
      return changed ? { ...message, content } : message
    })
    : decision.messages
  if (!isEnabled()) {
    return cleanMessages === decision.messages ? decision : { kind: 'enter', messages: cleanMessages }
  }
  const injections = await expandMentions(messages, agent.session.header.cwd, signal, pastedSetting)
  if (injections.length === 0) {
    return cleanMessages === decision.messages ? decision : { kind: 'enter', messages: cleanMessages }
  }
  return { kind: 'enter', messages: [...cleanMessages, ...injections] }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区边界和索引完整性保证到哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

resolveMention拒绝绝对路径和词法上越出cwd的路径，再stat存在性；没有对每条提及做realpath与真实工作区根比较。索引还明确解析符号链接并沿目录别名遍历，因此“工作区内路径”不是“目标字节物理位于该根内”的证明。插件不读正文，不能由此直接断言发生外部文件泄漏；实际读取权限仍由宿主工具负责，用户也应检查引用指向。

索引达到maxFiles会截断，无法访问或损坏的链接跳过而不是令全索引失败。候选存在不能证明索引全集完整，候选缺失也不证明文件不存在。提及校验与随后实际读取之间文件可能变化，消息未绑定哈希；因此它适合指向文件，不适合直接充当固定版本证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/mention.ts:64-80](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/mention.ts#L64-L80)

词法包含及stat检查，没有realpath绑定。

<details>
<summary>查看原文（17行）</summary>

```text
async function resolveMention(
  token: string,
  cwd: string,
  signal: AbortSignal,
): Promise<Mention | undefined> {
  if (isAbsolute(token)) return undefined
  const absolute = resolve(cwd, token)
  const confined = pathRelative(cwd, absolute)
  if (confined === '..' || confined.startsWith(`..${sep}`) || isAbsolute(confined)) {
    return undefined
  }
  signal.throwIfAborted()
  const info = await stat(absolute).catch(() => undefined)
  signal.throwIfAborted()
  if (info === undefined) return undefined
  const relative = confined.split(sep).join('/') || '.'
  return { relative, kind: info.isDirectory() ? 'dir' : 'file' }
```

</details>

**依据 2 · 源码核查**：[src/files.ts:167-191](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/files.ts#L167-L191)

索引截断与符号链接解析、遍历的实际路径。

<details>
<summary>查看原文（25行）</summary>

```text
        if (files.length >= options.maxFiles) {
          truncated = true
          break
        }
        const child = join(dir, dirent.name)
        if (dirent.isSymbolicLink()) {
          let targetPath: string
          let target: Awaited<ReturnType<typeof stat>>
          try {
            targetPath = await raceAbort(realpath(child), signal)
            target = await raceAbort(stat(targetPath), signal)
          } catch {
            signal?.throwIfAborted()
            // Broken, inaccessible, and transient links do not invalidate the
            // rest of the workspace index.
            continue
          }
          if (target.isDirectory()) {
            if (ignoreDirs.has(dirent.name)) continue
            files.push({ path: child, relative: displayRelative(root, child), kind: 'dir' })
            queue.push({ path: child, canonical: targetPath, ancestors: childAncestors })
            continue
          }
          if (target.isFile() && !isIgnoredFile(dirent.name)) {
            files.push({ path: child, relative: displayRelative(root, child), kind: 'file' })
```

</details>

#### 缺口

- 具体宿主读取工具如何处理工作区外符号链接，本轮未检查。
  **影响**：无法从路径标记推断读取授权，不能将其视为沙箱边界。
  **进一步探讨**：在实际宿主中只用无敏感内容的链接确认读取是否需要额外批准，同时核对引用与文件变更提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 原生替代下谁还值得付出维护成本？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

固定README开头明确作者建议新安装优先官方内置@file/@session，并仅偶尔维护本插件；本轮没有独立检查官方最新实现，因此只将其作为作者替代建议，不宣称逐功能已完全等价。相对手工路径，插件贡献是可筛选候选与显式存在性标记；对已有旧客户端且依赖这些设置的用户可能仍有迁移缓冲价值。

对新用户建议观察原生能力而不新增此插件。它依赖DSH的Typert、settings和agents服务以及客户端插槽，package的宽peer范围不是同版兼容验收。首次配置、索引过滤、缓存维护与升级兼容都增加负担；纯路径标记虽避免无条件把全文塞入上下文，但模型后续是否读全文决定实际token，不能承诺节省比例。已有安装应先保留配置，禁用后验证原生或手工路径能覆盖日常任务；双重候选、重复标记或文件引用错误时停止插件并回退。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:3-4](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/README.md#L3-L4)

作者明确新安装优先官方实现，非本轮独立原生能力验证。

```text
> [!IMPORTANT]
> The latest official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) release now includes built-in `@file` and `@session` reference features. Prefer the official implementation for new installations. This plugin remains available for existing setups and will be maintained occasionally on a best-effort basis.
```

**依据 2 · 源码核查**：[src/index.ts:61-89](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/index.ts#L61-L89)

实时设置与服务注册的实际依赖。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: Context, config?: Config): void {
  const resolved: ResolvedConfig = Config(config ?? {})
  // The durable enable switch: the runtime and the boundary read its live
  // value per call, so toggling it in the Web settings takes effect immediately.
  const settings = registerAtFileSettings(ctx)
  const readSettings = () => settings.get()
  const writeSettings = async (update: AtFileSettingsUpdate) => {
    if (update.field === 'enabled') {
      await settings.update({ enabled: update.value })
    } else if (update.field === 'ignoreFiles') {
      await settings.update({
        ignoreFiles: normalizeIgnoreFiles(update.value),
        ignoreFilesConfigured: true,
      })
    } else if (update.field === 'workspaceIgnoreFiles') {
      await settings.update({
        workspaceIgnoreFiles: normalizeWorkspaceIgnoreFiles(update.value),
      })
    } else {
      await settings.update({ ignorePastedMentions: update.value })
    }
    return settings.get()
  }
  new AtFileRuntime(ctx, resolved, readSettings, writeSettings)
  // Strict endpoint registration: the gateway resolves atFile/search from
  // this manifest, independent of decorator marker state.
  ctx.effect(() => {
    const dispose = ctx.typert.register(TYPERT_MANIFEST)
    return () => { void dispose() }
```

</details>

**依据 3 · 源码核查**：[package.json:25-37](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/package.json#L25-L37)

DSH客户端注入与包接口。

<details>
<summary>查看原文（13行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-input-trigger",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale"
      ]
    }
  },
  "files": [
    "lib",
```

</details>

#### 缺口

- 原生实现与当前用户过滤、目录导航和客户端版本的具体差距未知。
  **影响**：不能把作者迁移提示夸大成已验证全部替代。
  **进一步探讨**：按用户五个常见路径操作比较原生与插件，原生满足即禁用插件并保留旧设置备份。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 路径引用能否加按需证据预检而不加载全文？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的引用收据机制，在保持只传路径的前提下附当前版本/文件摘要、链接目标说明和读取权限结果，模型按需读取，父端再判断证据是否对应原版本。相对现有存在性标记，增量是降低后续读取错文件或文件变动未察觉的风险，而不是把所有内容提前灌入上下文。

最小验证包括普通文件、目录、指向根外的无敏感链接以及标记后修改的文件，比较旧标记与带摘要收据对错读、误报和额外读取次数的影响。若宿主原生已提供同等能力，或每次计算摘要比直接读取更贵且不减少错读，就停止独立扩展。本轮没有用户事故或成本数据，只是由静态边界推导的假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/mention.ts:64-95](https://github.com/FSMargoo/dsh-at-file/blob/da602d1a8f1b417b8a1d8d4059e0f4cb1c353524/src/mention.ts#L64-L95)

现有标记只含路径与类型，未绑定内容版本。

<details>
<summary>查看原文（32行）</summary>

```text
async function resolveMention(
  token: string,
  cwd: string,
  signal: AbortSignal,
): Promise<Mention | undefined> {
  if (isAbsolute(token)) return undefined
  const absolute = resolve(cwd, token)
  const confined = pathRelative(cwd, absolute)
  if (confined === '..' || confined.startsWith(`..${sep}`) || isAbsolute(confined)) {
    return undefined
  }
  signal.throwIfAborted()
  const info = await stat(absolute).catch(() => undefined)
  signal.throwIfAborted()
  if (info === undefined) return undefined
  const relative = confined.split(sep).join('/') || '.'
  return { relative, kind: info.isDirectory() ? 'dir' : 'file' }
}

/** Escape one XML-like attribute without modifying the referenced path. */
function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/** One validated existence-only reference for the model. */
function referenceForm(mention: Mention): string {
  const kind = mention.kind === 'dir' ? 'directory' : 'file'
  return `<workspace-reference path="${escapeAttribute(mention.relative)}" kind="${kind}" />`
```

</details>

#### 缺口

- 宿主原生是否已提供同类版本或权限信息。
  **影响**：不能将潜在扩展当作独立插件机会。
  **进一步探讨**：先核对原生接口，再比较同一引用任务的错误与总读取token。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
