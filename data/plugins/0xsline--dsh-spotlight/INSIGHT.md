# dsh-spotlight

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b3565e8](https://github.com/0xsline/dsh-spotlight/tree/b3565e8629d9a393d764681e96f4c41100cc12fa)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0xsline/dsh-spotlight) [![npm 30d 599](https://img.shields.io/static/v1?label=npm+30d&message=599&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)
<!-- END META -->

> **实现功能**：在DSH Web用一个快捷键面板搜索会话、slash命令、可见界面动作与插件设置入口。

> **核心亮点**：复用宿主目录把导航集中，避免独立命令表和模型阶段；非新语义检索。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：命令fallback按首输入覆写无CAS，目录与执行session可变化，广泛DOM动作不等安全白名单；未知执行不能当未执行。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，发现搜索与执行如何走？](#detail-section-11)
  - [Q02 · 增量和最关键草稿/动作归属限制是什么？](#detail-section-12)
  - [Q03 · 启动条件、隐私和读者操作流程是什么？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复成本效果如何比较？](#detail-section-14)
  - [Q05 · 工程复用、上下文绑定假设与推荐结论是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁导航的键盘用户，需辨认目标/副作用并保留现有草稿。

原生slash菜单/侧栏/设置可替代；面板减少入口切换，也增加DOM发现/草稿回退维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 导航搜索 | 会话/命令/插件/UI | 本地确定性评分非语义理解 |
| 原生委派 | open/execute/click | 副作用/确认由原生实现 |
| slash输入 | 参数/失败回退 | 首输入直接覆写，保留旧稿 |
| 快捷键 | 自定义/恢复 | origin固定键非profile独立 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH Web客户端和Cordis | 必需 | 注入sessions/remote.commands/inventory/commandUi | 四服务硬注入，缺服务不能只降一类 |
| npm已构建包或本地构建工具链 | 必需 | 发布lib/client.js | Git源prepare清lib再tsc/tsdown，禁生命周期另选制品 |
| 当前DOM动作标签/输入框契约 | DOM能力必需 | 发现/点击/插入slash | 多语言/多输入/改版可错配 |
| localStorage | 快捷键可选 | 保存按键偏好 | 失败静默退默认，按origin共享 |
| 用户识别动作与备份草稿 | 必需 | 执行已有命令/UI | 本面板未另加危险操作确认或草稿CAS |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定包/宿主，保存当前草稿，核DOM输入/命令 | 不在多输入或重要未保存稿上先试 |
| 查找 | 快捷键或/spotlight搜索 | 核类别/目标会话，异步目录完成后再选 |
| 执行 | 先无副作用导航，再核命令/动作 | 关闭面板非执行成功，未知先查宿主结果 |
| 恢复 | 退出或卸载，恢复快捷键/草稿 | 不因失败自动重复危险命令 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 兼容Web/可选构建环境，金额未知 | 核按键冲突和宿主/DOM契约 | 不新增模型生成阶段 |
| 持续使用 | 每次打开DOM扫描/RPC目录，输入逐次评分排序 | 看候选类别/目标并确认 | 全量候选无底层硬上限，展示上限不等资源预算 |
| 失败恢复 | 宿主命令状态/草稿恢复 | 分辨未执行、执行未知、fallback覆稿 | 原生动作副作用由原工具恢复 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 导航入口集中 | sessions/命令/设置/可见UI搜索 | 实际省时与误触率 |
| 排序 | NFKC/词项/子序列、稳定次序 | 不同语言/大目录相关性与延迟 |
| 生命周期 | 关闭恢复焦点/卸载清监听样式 | 宿主动作结果与草稿保留 |

> **思考**：命令fallback按首输入覆写无CAS，目录与执行session可变化，广泛DOM动作不等安全白名单；未知执行不能当未执行。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：复用宿主目录把导航集中，避免独立命令表和模型阶段；非新语义检索。详见[Q01](#research-q01)与[Q02](#research-q02)。

复用宿主目录把导航集中，避免独立命令表和模型阶段；非新语义检索。详见[Q01](#research-q01)与[Q02](#research-q02)。

复用点是窄宿主接口、并行目录和逐类降级、稳定排序、textContent渲染动态标题防HTML解释、overlay身份丢弃迟到、关闭还焦点及卸载移除监听/自有样式。它们改善可维护性，但不补目标/草稿协议。

<a id="detail-section-5"></a>

### 1.4 主要限制

命令fallback按首输入覆写无CAS，目录与执行session可变化，广泛DOM动作不等安全白名单；未知执行不能当未执行。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

兼容Web可有限试用，先备份/清空草稿并试无副作用导航，目标/回执未知就停止。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持复用宿主目录的键盘导航与本地确定性搜索；DOM回退覆稿和当前会话执行未形成版本绑定保证。候选目标、草稿CAS与未知执行收据仍是未验证方案。

- 已检查：作者 README、包清单、源码路径 src/client/index.ts、src/spotlight/discovery.ts、src/spotlight/search.ts、src/spotlight/mount.ts、src/runtime.ts、package.json、scripts/prepare.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定client激活、宿主窄接口、发现/排序/快捷键/面板生命周期与Git prepare；未运行目标测试/构建或证明当前宿主API。
- 下一步：进一步探讨可先用多输入/草稿/切会话/迟到/丢回执夹具核绑定，再比较真实导航时间与误选。

**分析版本**

- **仓库**：[0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight)
- **版本号**：0.0.2（[固定提交 b3565e8](https://github.com/0xsline/dsh-spotlight/tree/b3565e8629d9a393d764681e96f4c41100cc12fa)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨session/稳定动作ID与草稿版本绑定、未知结果收据及异步保留选中，宿主适配成本未验证。详见[Q05](#research-q05)。

进一步探讨可先用多输入/草稿/切会话/迟到/丢回执夹具核绑定，再比较真实导航时间与误选。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 980 | — | — | 9699 |
| .mjs | source | 3 | 311 | 249 | 32 | — |
| .ts | source | 13 | 1092 | 857 | 141 | — |
| .ts | test | 8 | 545 | 474 | 12 | — |
| .md | test | 2 | 16 | — | — | 229 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+created%3A2026-09-22T06%3A54%3A01.890Z..2026-10-22T06%3A54%3A01.890Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/0xsline/dsh-spotlight/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A54%3A01.890Z..2026-10-22T06%3A54%3A01.890Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核键盘导航发现/排序/原生执行，重点识别草稿和会话绑定、DOM兼容与结果未知。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，发现搜索与执行如何走？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向在DSH Web频繁切会话、找slash命令和插件设置的键盘用户。输入搜索词和选择，输出候选并交给宿主服务/已有DOM动作执行。成功应打开正确会话/命令/设置且不丢现有输入，不能把面板关闭等同动作完成。

客户端硬注入四服务，注册/spotlight popupSelect并挂快捷键面板。先显示可见DOM/最近会话，再并行拉宿主命令与插件目录；各RPC失败只清本类。候选对title/detail/keywords作NFKC、词项/子序列评分，稳定排序，每类展示6项。会话走sessions.open，插件项均到通用插件设置而非对应插件精确页；无参数slash直接commands.execute，含input或失败fallback写入输入框。Host runtime空实现，不新增服务端数据通道。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:31-65](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/client/index.ts#L31-L65)

硬注入/注册/挂卸载。

<details>
<summary>查看原文（35行）</summary>

```text
export const inject = ['sessions', 'remote.commands', 'remote.pluginInventory', 'commandUi']
/** The `/spotlight` contribution: a popupSelect entry that opens the palette. */
function registerSpotlightCommand(commandUi: SpotlightCommandUi, open: () => void): () => void {
  return commandUi.register({
    name: 'spotlight',
    description: '打开 Spotlight 命令面板 · Open the Spotlight palette',
    available: () => true,
    ui: {
      kind: 'popupSelect',
      options: async () => [
        { id: 'open', label: '打开 Spotlight', detail: 'Open the Spotlight palette' },
      ],
      onSelect: () => { open() },
    },
  })
}

/**
 * Apply the client plugin: mount the palette and register the `/spotlight`
 * command where the host command UI exists.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const host: SpotlightHost = {
      sessions: ctx.get('sessions') as SpotlightSessions,
      commands: ctx.get('remote.commands') as SpotlightCommands,
      pluginInventory: ctx.get('remote.pluginInventory') as SpotlightPluginInventory,
    }
    const { dispose, open } = mountSpotlight(host, document, window)
    const disposeCommand = registerSpotlightCommand(ctx.get('commandUi') as SpotlightCommandUi, open)
    return () => {
      disposeCommand()
      dispose()
    }
```

</details>

**依据 2 · 源码核查**：[src/spotlight/discovery.ts:181-199](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L181-L199)

会话导航。

<details>
<summary>查看原文（19行）</summary>

```text
/** Recent sessions straight from the host sessions service, newest order preserved. */
function sessionActions(host: SpotlightHost): SpotlightAction[] {
  const snapshot = host.sessions.list.getSnapshot()
  return snapshot.ids.flatMap(id => {
    const session: SpotlightSessionSummary | undefined = snapshot.byId[id]
    if (session === undefined || session.blank === true) return []
    const detail = [
      session.cwd,
      session.agentPreset !== undefined ? `Preset: ${session.agentPreset}` : undefined,
      session.running ? '运行中' : undefined,
    ].filter((part): part is string => part !== undefined).join(' · ') || '最近会话 · Recent session'
    return [{
      id: `session:${session.id}`,
      kind: 'session',
      title: session.displayTitle,
      detail,
      keywords: [session.id, session.cwd ?? ''],
      run: () => { host.sessions.open(session.id) },
    }]
```

</details>

**依据 3 · 源码核查**：[src/spotlight/discovery.ts:204-247](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L204-L247)

命令执行/回退。

<details>
<summary>查看原文（44行）</summary>

```text
async function runSlashCommand(
  host: SpotlightHost,
  document: Document,
  descriptor: SpotlightCommandDescriptor,
  name: string,
): Promise<void> {
  const commands = host.commands
  const sessionId = host.sessions.list.getSnapshot().current
  if (commands === undefined || sessionId === undefined || descriptor.input !== undefined) {
    insertCommand(document, `/${name} `)
    return
  }
  try {
    const result = await commands.execute(sessionId, `/${name}`)
    if (!result.ok || result.value === undefined) {
      // Unknown or rejected: hand the line to the native slash pipeline.
      insertCommand(document, `/${name} `)
    }
  } catch {
    insertCommand(document, `/${name} `)
  }
}

/** The host command catalog for the current session, exposed as palette commands. */
function commandActions(host: SpotlightHost, document: Document): Promise<SpotlightAction[]> {
  const commands = host.commands
  if (commands === undefined) return Promise.resolve([])
  const sessionId = host.sessions.list.getSnapshot().current
  if (sessionId === undefined) return Promise.resolve([])
  return commands.list(sessionId).then(result => {
    if (!result.ok) return []
    return result.value.flatMap(descriptor => {
      const name = descriptor.name.trim()
      if (!COMMAND_NAME.test(name)) return []
      return [{
        id: `command:${name}`,
        kind: 'command',
        title: `/${name}`,
        detail: descriptor.description?.trim() || 'Slash command',
        keywords: [name, descriptor.description ?? ''],
        run: () => { void runSlashCommand(host, document, descriptor, name) },
      }]
    })
  }, () => [] as SpotlightAction[])
```

</details>

**依据 4 · 源码核查**：[src/spotlight/discovery.ts:256-293](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L256-L293)

插件目录/并行发现。

<details>
<summary>查看原文（38行）</summary>

```text
/** Installed plugins from the host inventory, each jumping to the Plugins settings section. */
function pluginActions(host: SpotlightHost, document: Document): Promise<SpotlightAction[]> {
  const inventory = host.pluginInventory
  if (inventory === undefined) return Promise.resolve([])
  return inventory.list().then(result => {
    if (!result.ok) return []
    return result.value.entries.flatMap((entry: SpotlightPluginEntry) => {
      const title = pluginDisplayName(entry.moduleName)
      if (title === '') return []
      return [{
        id: `plugin:${entry.entryId}`,
        kind: 'plugin',
        title,
        detail: `${entry.entryId}${entry.enabled ? '' : ' · 已禁用'}`,
        keywords: [entry.entryId, entry.moduleName, '插件', 'plugin'],
        run: () => { void openPluginSettings(document) },
      }]
    })
  }, () => [] as SpotlightAction[])
}

/** Discover immediately available actions: built-ins, sessions, and interface elements. */
export function discoverVisibleActions(host: SpotlightHost, document: Document): SpotlightAction[] {
  return unique([
    ...builtInActions(document),
    ...sessionActions(host),
    ...interfaceActions(document),
  ])
}

/** Discover the full action set: visible actions plus the host command and plugin catalogs. */
export async function discoverActions(host: SpotlightHost, document: Document): Promise<SpotlightAction[]> {
  const visible = discoverVisibleActions(host, document)
  const [commands, plugins] = await Promise.all([
    commandActions(host, document),
    pluginActions(host, document),
  ])
  return unique([...visible, ...commands, ...plugins])
```

</details>

**依据 5 · 源码核查**：[src/spotlight/search.ts:16-60](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/search.ts#L16-L60)

评分。

<details>
<summary>查看原文（45行）</summary>

```text
function normalize(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase().replace(new RegExp('\\s+', 'g'), ' ').trim()
}

function subsequenceScore(haystack: string, needle: string): number {
  let cursor = 0
  let first = -1
  let gaps = 0
  for (const char of needle) {
    const next = haystack.indexOf(char, cursor)
    if (next < 0) return -1
    if (first < 0) first = next
    gaps += next - cursor
    cursor = next + 1
  }
  return 120 - first * 2 - gaps
}

function tokenScore(title: string, haystack: string, token: string): number {
  if (title === token) return 1_000
  if (title.startsWith(token)) return 800 - title.length
  const titleIndex = title.indexOf(token)
  if (titleIndex >= 0) return 600 - titleIndex
  const textIndex = haystack.indexOf(token)
  if (textIndex >= 0) return 400 - textIndex
  return subsequenceScore(haystack, token)
}

/** Score a candidate. Negative values mean no match. */
export function scoreCandidate(candidate: SearchCandidate, query: string): number {
  const normalizedQuery = normalize(query)
  if (normalizedQuery === '') return 0
  const title = normalize(candidate.title)
  const haystack = normalize([
    candidate.title,
    candidate.detail ?? '',
    ...(candidate.keywords ?? []),
  ].join(' '))
  let score = 0
  for (const token of normalizedQuery.split(' ')) {
    const value = tokenScore(title, haystack, token)
    if (value < 0) return -1
    score += value
  }
  return score
```

</details>

**依据 6 · 源码核查**：[src/spotlight/mount.ts:201-204](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L201-L204)

展示cap。

```text
    const render = (): void => {
      matches = capPerKind(searchCandidates(actions, input.value, 200), 6)
      if (active >= matches.length) active = matches.length - 1
      if (active < 0 && matches.length > 0) active = 0
```

**依据 7 · 源码核查**：[src/runtime.ts:9-14](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/runtime.ts#L9-L14)

Host空实现。

```text
/**
 * Apply the plugin to its Cordis context.
 * @param ctx - Scoped plugin context; registrations must be owned by its effects.
 * @param config - Configuration resolved by Cordis from the exported schema.
 */
export function apply(_ctx: Context, _config: Config): void {}
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量和最关键草稿/动作归属限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量是复用宿主命令/会话目录而不维护第二注册表，把DOM可见操作与搜索/快捷键统一。确定性本地排序和不加模型阶段有明确边界，不是新的语义搜索算法。

最重要的是fallback覆稿。composerOf取全页第一个textarea/contenteditable/roletextbox，仅检查aria-hidden非true，没有可见/会话/原生草稿API校验；insertCommand直接value或textContent赋值并发input，既不保留旧稿，也无draftRev/CAS。命令错误或返回undefined也会fallback，因此执行结果未知时可能被引导手动再发同命令。

候选命令目录按打开时session获取，run却重新读current，若期间切会话，就可能把旧描述的命令执行到新会话。DOM动作保存元素引用，显示后目标可能失效或语义改变；interfaceActions对所有显式标签的可见按钮/链接/菜单项开放，排除少数send/close不等危险动作白名单，也未另加确认，原生流程能否保护由宿主决定。按title去重会合并同名不同动作。异步目录回来active重置0，用户选择中的候选可能变化。README“profile本地”存储实际只有固定origin key，不含profile ID。

#### 证据与依据

**依据 1 · 源码核查**：[src/spotlight/discovery.ts:42-58](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L42-L58)

首输入+直接覆写。

<details>
<summary>查看原文（17行）</summary>

```text
function composerOf(document: Document): HTMLElement | undefined {
  return [...document.querySelectorAll<HTMLElement>('textarea, [contenteditable="true"], [role="textbox"]')]
    .find(element => element.getAttribute('aria-hidden') !== 'true')
}

/** Insert a command line into the composer so the native slash pipeline owns the rest. */
function insertCommand(document: Document, command: string): void {
  const composer = composerOf(document)
  if (composer === undefined) return
  if (composer instanceof HTMLInputElement || composer instanceof HTMLTextAreaElement) {
    composer.value = command
  } else {
    composer.textContent = command
  }
  composer.dispatchEvent(new Event('input', { bubbles: true }))
  composer.focus()
}
```

</details>

**依据 2 · 源码核查**：[src/spotlight/discovery.ts:204-224](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L204-L224)

当前session执行/未知fallback。

<details>
<summary>查看原文（21行）</summary>

```text
async function runSlashCommand(
  host: SpotlightHost,
  document: Document,
  descriptor: SpotlightCommandDescriptor,
  name: string,
): Promise<void> {
  const commands = host.commands
  const sessionId = host.sessions.list.getSnapshot().current
  if (commands === undefined || sessionId === undefined || descriptor.input !== undefined) {
    insertCommand(document, `/${name} `)
    return
  }
  try {
    const result = await commands.execute(sessionId, `/${name}`)
    if (!result.ok || result.value === undefined) {
      // Unknown or rejected: hand the line to the native slash pipeline.
      insertCommand(document, `/${name} `)
    }
  } catch {
    insertCommand(document, `/${name} `)
  }
```

</details>

**依据 3 · 源码核查**：[src/spotlight/discovery.ts:228-244](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L228-L244)

打开时命令目录。

<details>
<summary>查看原文（17行）</summary>

```text
function commandActions(host: SpotlightHost, document: Document): Promise<SpotlightAction[]> {
  const commands = host.commands
  if (commands === undefined) return Promise.resolve([])
  const sessionId = host.sessions.list.getSnapshot().current
  if (sessionId === undefined) return Promise.resolve([])
  return commands.list(sessionId).then(result => {
    if (!result.ok) return []
    return result.value.flatMap(descriptor => {
      const name = descriptor.name.trim()
      if (!COMMAND_NAME.test(name)) return []
      return [{
        id: `command:${name}`,
        kind: 'command',
        title: `/${name}`,
        detail: descriptor.description?.trim() || 'Slash command',
        keywords: [name, descriptor.description ?? ''],
        run: () => { void runSlashCommand(host, document, descriptor, name) },
```

</details>

**依据 4 · 源码核查**：[src/spotlight/discovery.ts:162-177](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L162-L177)

开放UI点击/标题ID。

<details>
<summary>查看原文（16行）</summary>

```text
function interfaceActions(document: Document): SpotlightAction[] {
  const excluded = new RegExp('^(?:new (?:chat|session|conversation)|新建(?:会话|对话|聊天)|send message|发送消息|close|关闭(?:详情)?|commands?|命令)$', 'i')
  return actionable(document).flatMap(element => {
    const explicitLabel = element.getAttribute('aria-label') ?? element.getAttribute('title')
    if (explicitLabel === null && element.getAttribute('role') !== 'tab') return []
    const title = explicitLabel?.trim() || labelOf(element)
    if (title === '' || title.length > 80 || excluded.test(title)) return []
    if (element.getAttribute('aria-disabled') === 'true' || (element instanceof HTMLButtonElement && element.disabled)) return []
    return [{
      id: `ui:${title}`,
      kind: 'action' as const,
      title,
      detail: '界面操作 · UI action',
      keywords: [element.getAttribute('href') ?? ''],
      run: () => { element.click() },
    }]
```

</details>

**依据 5 · 源码核查**：[src/spotlight/discovery.ts:70-76](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L70-L76)

kind/id去重。

```text
function unique(actions: SpotlightAction[]): SpotlightAction[] {
  const seen = new Set<string>()
  return actions.filter(action => {
    const key = `${action.kind}:${action.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
```

**依据 6 · 源码核查**：[src/spotlight/mount.ts:262-267](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L262-L267)

异步目录重置。

```text
    void discoverActions(host, document).then(discovered => {
      if (root !== overlay) return
      actions = discovered
      active = 0
      render()
      input.focus({ preventScroll: true })
```

**依据 7 · 源码核查**：[src/spotlight/mount.ts:71-86](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L71-L86)

固定localStorage键。

<details>
<summary>查看原文（16行）</summary>

```text
  let root: HTMLElement | undefined
  let previousFocus: HTMLElement | undefined
  let recordingShortcut = false
  const applePlatform = new RegExp('Mac|iPhone|iPad', 'i').test(window.navigator.platform)
  const fallbackShortcut = defaultShortcut(applePlatform)
  let shortcut: SpotlightShortcut = fallbackShortcut
  try {
    shortcut = parseShortcut(JSON.parse(window.localStorage.getItem(SHORTCUT_STORAGE_KEY) ?? 'null')) ?? fallbackShortcut
  } catch {}

  const saveShortcut = (next: SpotlightShortcut | undefined): void => {
    shortcut = next ?? fallbackShortcut
    try {
      if (next === undefined) window.localStorage.removeItem(SHORTCUT_STORAGE_KEY)
      else window.localStorage.setItem(SHORTCUT_STORAGE_KEY, JSON.stringify(next))
    } catch {}
```

</details>

#### 缺口

- 宿主命令副作用、错误/undefined是否表示未执行及原生确认保护未由插件确定。
  **影响**：不能把失败fallback等同未执行，或把UI发现当安全批准。
  **进一步探讨**：可先核宿主命令结果协议/原生确认，再区分未执行和结果未知；未知先查询不重做。
- 真实宿主多输入/会话切换的草稿与目标绑定需要契约。
  **影响**：当前DOM回退可覆盖或错目标。
  **进一步探讨**：可从官方草稿API、版本CAS和会话绑定入手，失败保留旧稿/候选而非直接写。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动条件、隐私和读者操作流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

npm0.0.2/Node声明^22.19或>=24，git安装由prepare本地tsc/tsdown生成lib，脚本先删本包lib、失败退出。四服务是硬注入，即使host.ts类型标optional，不能将运行时加载也说成全部可选。RPC类别降级发生挂载之后。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH Web客户端和Cordis | 必需 | 注入sessions/remote.commands/inventory/commandUi | 四服务硬注入，缺服务不能只降一类 |
| npm已构建包或本地构建工具链 | 必需 | 发布lib/client.js | Git源prepare清lib再tsc/tsdown，禁生命周期另选制品 |
| 当前DOM动作标签/输入框契约 | DOM能力必需 | 发现/点击/插入slash | 多语言/多输入/改版可错配 |
| localStorage | 快捷键可选 | 保存按键偏好 | 失败静默退默认，按origin共享 |
| 用户识别动作与备份草稿 | 必需 | 执行已有命令/UI | 本面板未另加危险操作确认或草稿CAS |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定包/宿主，保存当前草稿，核DOM输入/命令 | 不在多输入或重要未保存稿上先试 |
| 查找 | 快捷键或/spotlight搜索 | 核类别/目标会话，异步目录完成后再选 |
| 执行 | 先无副作用导航，再核命令/动作 | 关闭面板非执行成功，未知先查宿主结果 |
| 恢复 | 退出或卸载，恢复快捷键/草稿 | 不因失败自动重复危险命令 |

搜索词和快捷键主要在浏览器本地，命令/插件目录用既有RPC；不新增模型调用不表示触发的原生命令无网络/写入。会话标题/cwd与命令说明出现在面板，按当前用户宿主权限处理；偏好只按origin key保存，别假定profile隔离。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-9](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/package.json#L1-L9)

包和Node。

```text
{
  "name": "@0xsline/dsh-spotlight",
  "description": "Keyboard-first command palette for DeepSeek Harness Web",
  "version": "0.0.2",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 源码核查**：[scripts/prepare.mjs:14-31](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/scripts/prepare.mjs#L14-L31)

构建/清理范围。

<details>
<summary>查看原文（18行）</summary>

```text
const steps = [
  ['tsc', packageFile('typescript', 'bin/tsc'), ['-p', 'tsconfig.prepare.dts.json']],
  ['tsdown', packageFile('tsdown', 'dist/run.mjs'), ['--config', 'tsdown.prepare.config.ts']],
]

rmSync(join(root, 'lib'), { recursive: true, force: true })

for (const [name, entry, args] of steps) {
  if (!existsSync(entry)) {
    console.error(`prepare: missing local executable ${entry}; run pnpm install first`)
    process.exit(1)
  }
  const result = spawnSync(process.execPath, [entry, ...args], { cwd: root, stdio: 'inherit' })
  if (result.error !== undefined) {
    console.error(`prepare: failed to run ${name}: ${result.error.message}`)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:31-65](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/client/index.ts#L31-L65)

实际硬注入。

<details>
<summary>查看原文（35行）</summary>

```text
export const inject = ['sessions', 'remote.commands', 'remote.pluginInventory', 'commandUi']
/** The `/spotlight` contribution: a popupSelect entry that opens the palette. */
function registerSpotlightCommand(commandUi: SpotlightCommandUi, open: () => void): () => void {
  return commandUi.register({
    name: 'spotlight',
    description: '打开 Spotlight 命令面板 · Open the Spotlight palette',
    available: () => true,
    ui: {
      kind: 'popupSelect',
      options: async () => [
        { id: 'open', label: '打开 Spotlight', detail: 'Open the Spotlight palette' },
      ],
      onSelect: () => { open() },
    },
  })
}

/**
 * Apply the client plugin: mount the palette and register the `/spotlight`
 * command where the host command UI exists.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const host: SpotlightHost = {
      sessions: ctx.get('sessions') as SpotlightSessions,
      commands: ctx.get('remote.commands') as SpotlightCommands,
      pluginInventory: ctx.get('remote.pluginInventory') as SpotlightPluginInventory,
    }
    const { dispose, open } = mountSpotlight(host, document, window)
    const disposeCommand = registerSpotlightCommand(ctx.get('commandUi') as SpotlightCommandUi, open)
    return () => {
      disposeCommand()
      dispose()
    }
```

</details>

**依据 4 · 源码核查**：[src/spotlight/discovery.ts:228-274](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L228-L274)

目录RPC降级。

<details>
<summary>查看原文（47行）</summary>

```text
function commandActions(host: SpotlightHost, document: Document): Promise<SpotlightAction[]> {
  const commands = host.commands
  if (commands === undefined) return Promise.resolve([])
  const sessionId = host.sessions.list.getSnapshot().current
  if (sessionId === undefined) return Promise.resolve([])
  return commands.list(sessionId).then(result => {
    if (!result.ok) return []
    return result.value.flatMap(descriptor => {
      const name = descriptor.name.trim()
      if (!COMMAND_NAME.test(name)) return []
      return [{
        id: `command:${name}`,
        kind: 'command',
        title: `/${name}`,
        detail: descriptor.description?.trim() || 'Slash command',
        keywords: [name, descriptor.description ?? ''],
        run: () => { void runSlashCommand(host, document, descriptor, name) },
      }]
    })
  }, () => [] as SpotlightAction[])
}

/** Compact a module specifier into a display name. */
function pluginDisplayName(moduleName: string): string {
  const unscoped = moduleName.startsWith('@') ? moduleName.slice(moduleName.indexOf('/') + 1) : moduleName
  return unscoped.replace(new RegExp('^(?:cordis-plugin-|dsh-(?:host-|client-)?)'), '') || moduleName
}

/** Installed plugins from the host inventory, each jumping to the Plugins settings section. */
function pluginActions(host: SpotlightHost, document: Document): Promise<SpotlightAction[]> {
  const inventory = host.pluginInventory
  if (inventory === undefined) return Promise.resolve([])
  return inventory.list().then(result => {
    if (!result.ok) return []
    return result.value.entries.flatMap((entry: SpotlightPluginEntry) => {
      const title = pluginDisplayName(entry.moduleName)
      if (title === '') return []
      return [{
        id: `plugin:${entry.entryId}`,
        kind: 'plugin',
        title,
        detail: `${entry.entryId}${entry.enabled ? '' : ' · 已禁用'}`,
        keywords: [entry.entryId, entry.moduleName, '插件', 'plugin'],
        run: () => { void openPluginSettings(document) },
      }]
    })
  }, () => [] as SpotlightAction[])
```

</details>

**依据 5 · 源码核查**：[src/spotlight/mount.ts:71-86](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L71-L86)

偏好保存。

<details>
<summary>查看原文（16行）</summary>

```text
  let root: HTMLElement | undefined
  let previousFocus: HTMLElement | undefined
  let recordingShortcut = false
  const applePlatform = new RegExp('Mac|iPhone|iPad', 'i').test(window.navigator.platform)
  const fallbackShortcut = defaultShortcut(applePlatform)
  let shortcut: SpotlightShortcut = fallbackShortcut
  try {
    shortcut = parseShortcut(JSON.parse(window.localStorage.getItem(SHORTCUT_STORAGE_KEY) ?? 'null')) ?? fallbackShortcut
  } catch {}

  const saveShortcut = (next: SpotlightShortcut | undefined): void => {
    shortcut = next ?? fallbackShortcut
    try {
      if (next === undefined) window.localStorage.removeItem(SHORTCUT_STORAGE_KEY)
      else window.localStorage.setItem(SHORTCUT_STORAGE_KEY, JSON.stringify(next))
    } catch {}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复成本效果如何比较？

**研究主题**：效果与总成本

#### 完整回答

没有额外模型阶段，也没有服务端索引，但每次打开会做全页querySelectorAll、会话快照和两个目录RPC；每次input对全部候选归一化评分排序，搜索200再每类cap6只是展示限制。大量会话/插件/DOM时总CPU与延迟未测，RPC无本地timeout/取消但迟到结果有overlay身份检查。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 兼容Web/可选构建环境，金额未知 | 核按键冲突和宿主/DOM契约 | 不新增模型生成阶段 |
| 持续使用 | 每次打开DOM扫描/RPC目录，输入逐次评分排序 | 看候选类别/目标并确认 | 全量候选无底层硬上限，展示上限不等资源预算 |
| 失败恢复 | 宿主命令状态/草稿恢复 | 分辨未执行、执行未知、fallback覆稿 | 原生动作副作用由原工具恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 导航入口集中 | sessions/命令/设置/可见UI搜索 | 实际省时与误触率 |
| 排序 | NFKC/词项/子序列、稳定次序 | 不同语言/大目录相关性与延迟 |
| 生命周期 | 关闭恢复焦点/卸载清监听样式 | 宿主动作结果与草稿保留 |

性能收益应以相同目标动作的实际键数/时间/误选和草稿损失对照普通slash菜单/侧栏，而非找到12或24候选就视为更快。恢复不应盲执行fallback命令，尤其原生执行结果不明时。

#### 证据与依据

**依据 1 · 源码核查**：[src/spotlight/discovery.ts:32-35](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L32-L35)

全DOM扫描。

```text
function actionable(document: Document): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(ACTIONABLE_SELECTOR)]
    .filter(element => !belongsToSpotlight(element) && element.getClientRects().length > 0)
}
```

**依据 2 · 源码核查**：[src/spotlight/search.ts:82-93](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/search.ts#L82-L93)

全量评分排序。

<details>
<summary>查看原文（12行）</summary>

```text
export function searchCandidates<T extends SearchCandidate>(
  candidates: readonly T[],
  query: string,
  limit = 12,
): RankedCandidate<T>[] {
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('search limit must be a positive integer')
  return candidates
    .map((item, order) => ({ item, order, score: scoreCandidate(item, query) }))
    .filter(result => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map(({ item, score }) => ({ item, score }))
```

</details>

**依据 3 · 源码核查**：[src/spotlight/mount.ts:201-204](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L201-L204)

展示cap。

```text
    const render = (): void => {
      matches = capPerKind(searchCandidates(actions, input.value, 200), 6)
      if (active >= matches.length) active = matches.length - 1
      if (active < 0 && matches.length > 0) active = 0
```

**依据 4 · 源码核查**：[src/spotlight/mount.ts:262-269](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L262-L269)

异步去迟到。

```text
    void discoverActions(host, document).then(discovered => {
      if (root !== overlay) return
      actions = discovered
      active = 0
      render()
      input.focus({ preventScroll: true })
    }).catch(error => {
      console.warn('[dsh-spotlight] async discovery failed', error)
```

#### 缺口

- 无大目录/多语言相关性、响应时间、误选率与总导航人时对照。
  **影响**：不能承诺快或安全替代所有原生入口。
  **进一步探讨**：可用固定目标和合成目录规模比较完成时间、误执行/覆稿与回退恢复，保留原生菜单基线。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程复用、上下文绑定假设与推荐结论是什么？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

复用点是窄宿主接口、并行目录和逐类降级、稳定排序、textContent渲染动态标题防HTML解释、overlay身份丢弃迟到、关闭还焦点及卸载移除监听/自有样式。它们改善可维护性，但不补目标/草稿协议。

可探讨未验证的“上下文绑定动作收据”。候选绑定session/动作稳定ID/目录版本，执行前复核未改变；有参数命令通过官方draft API插入且需原稿版本匹配，未知失败不转为覆盖草稿。UI动作声明副作用类别并保留原生确认，执行结果显示明确状态；异步更新保持选中ID而非重置索引。相对当前DOM猜测/当前session，可降低错目标和覆稿。代价是宿主API依赖、动作元数据和兼容维护。可用双textarea、含旧稿、命令已执行但丢回执、切session、同名UI与目录迟到夹具比较；若仍未知时重发/覆稿则先停。

推荐trial，限固定兼容Web、自有受信UI，先备份/清空草稿并试无副作用导航，谨慎选择命令。更广采用先核官方草稿API和session绑定；发现覆盖输入、错会话、危险动作未经原生确认或结果未知时停止并保留宿主状态，不重复命令。未声称源码已证明真实宿主适配。

#### 证据与依据

**依据 1 · 源码核查**：[src/spotlight/mount.ts:89-95](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L89-L95)

关闭还焦点。

```text
  const close = (): void => {
    recordingShortcut = false
    root?.remove()
    root = undefined
    if (previousFocus?.isConnected === true) previousFocus.focus({ preventScroll: true })
    previousFocus = undefined
  }
```

**依据 2 · 源码核查**：[src/spotlight/mount.ts:220-225](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L220-L225)

动态textContent。

```text
          const title = document.createElement('span')
          title.setAttribute('data-dsh-spotlight-title', '')
          title.textContent = item.title
          const detail = document.createElement('span')
          detail.setAttribute('data-dsh-spotlight-detail', '')
          detail.textContent = item.detail ?? ''
```

**依据 3 · 源码核查**：[src/spotlight/mount.ts:262-285](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/mount.ts#L262-L285)

去迟到及清理。

<details>
<summary>查看原文（24行）</summary>

```text
    void discoverActions(host, document).then(discovered => {
      if (root !== overlay) return
      actions = discovered
      active = 0
      render()
      input.focus({ preventScroll: true })
    }).catch(error => {
      console.warn('[dsh-spotlight] async discovery failed', error)
    })
  }

  const onGlobalKeydown = (event: KeyboardEvent): void => {
    if (recordingShortcut || !isSpotlightShortcut(event, shortcut)) return
    event.preventDefault()
    event.stopPropagation()
    if (root === undefined) open()
    else close()
  }
  window.addEventListener('keydown', onGlobalKeydown, true)

  const dispose = (): void => {
    window.removeEventListener('keydown', onGlobalKeydown, true)
    close()
    if (ownsStyle) document.getElementById(STYLE_ID)?.remove()
```

</details>

**依据 4 · 源码核查**：[src/spotlight/discovery.ts:204-224](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L204-L224)

绑定假设起点。

<details>
<summary>查看原文（21行）</summary>

```text
async function runSlashCommand(
  host: SpotlightHost,
  document: Document,
  descriptor: SpotlightCommandDescriptor,
  name: string,
): Promise<void> {
  const commands = host.commands
  const sessionId = host.sessions.list.getSnapshot().current
  if (commands === undefined || sessionId === undefined || descriptor.input !== undefined) {
    insertCommand(document, `/${name} `)
    return
  }
  try {
    const result = await commands.execute(sessionId, `/${name}`)
    if (!result.ok || result.value === undefined) {
      // Unknown or rejected: hand the line to the native slash pipeline.
      insertCommand(document, `/${name} `)
    }
  } catch {
    insertCommand(document, `/${name} `)
  }
```

</details>

**依据 5 · 源码核查**：[src/spotlight/discovery.ts:42-58](https://github.com/0xsline/dsh-spotlight/blob/b3565e8629d9a393d764681e96f4c41100cc12fa/src/spotlight/discovery.ts#L42-L58)

草稿API假设起点。

<details>
<summary>查看原文（17行）</summary>

```text
function composerOf(document: Document): HTMLElement | undefined {
  return [...document.querySelectorAll<HTMLElement>('textarea, [contenteditable="true"], [role="textbox"]')]
    .find(element => element.getAttribute('aria-hidden') !== 'true')
}

/** Insert a command line into the composer so the native slash pipeline owns the rest. */
function insertCommand(document: Document, command: string): void {
  const composer = composerOf(document)
  if (composer === undefined) return
  if (composer instanceof HTMLInputElement || composer instanceof HTMLTextAreaElement) {
    composer.value = command
  } else {
    composer.textContent = command
  }
  composer.dispatchEvent(new Event('input', { bubbles: true }))
  composer.focus()
}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
