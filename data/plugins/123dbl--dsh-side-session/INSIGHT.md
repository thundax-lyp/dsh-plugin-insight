# dsh-side-session

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[39443eb](https://github.com/123dbl/dsh-side-session/tree/39443eb1ea15fb080121a3a6474426980f346a6c)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/123dbl/dsh-side-session)
<!-- END META -->

> **实现功能**：从命令菜单创建可继续的旁会话，并在Web自动打开对应子会话视图。

> **核心亮点**：在既有continuable spawn和官方会话视图上补一键菜单/跳转接线，不另造聊天系统；底层并行与持久化归上游。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：Host不返回childID，事后目录差集在目录先到、冷缓存和并发时不能证明本次归属；错误跳转可能使问题错投。均为静态时序推演。详见[Q02](#research-q02)。

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
  - [Q01 · 旁会话面向什么任务，创建与跳转怎样协作？](#detail-section-11)
  - [Q02 · 目录差集能否准确打开本次创建的子会话？](#detail-section-12)
  - [Q03 · 依赖、权限与采用流程需要什么？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本和效果如何？](#detail-section-14)
  - [Q05 · 工程可借鉴点及关联收据假设如何检验，是否可试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：主会话工作时另开问题分支，由读者接管可继续子会话；不承担成果合并或隔离保证。

宿主原有子会话/新会话创建后手工定位；该插件减少入口接线，不新增子会话隔离、模型调度或任务合并机制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| side-chat命令 | 固定就绪prompt创建continuable子会话 | 依赖commands/subagents，不返回childID |
| 自动打开 | 目录刷新后调用官方openSubagent | Web差集猜归属，冷缓存/并发有误选条件 |
| 目录与成功事件监听 | 更新已见集合并触发定位 | 无总deadline/在途dispose检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24、DSH commands/subagents | 必需 | 注册命令、spawn可继续子会话 | 不满足无法提供创建链 |
| Web sessions、command/executed事件、模块加载器 | 自动打开必需 | 刷新目录与openSubagent | Host创建成功仍可能无法定位/打开 |
| spawn上游模型、权限与会话持久化 | 子会话运行必需 | 处理固定就绪提示与用户后续任务 | 本插件不定义隔离/计费/数据继承策略 |
| 已提交lib与cordis.patch.yml | 仓库安装必需 | Host及Web发布入口 | 源码变更须同步构建产物 |
| pnpm/esbuild/tsc | 仅开发构建 | 生成lib/声明 | 普通仓库安装按README不要求自行构建 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 读者核宿主版本、模型权限和非敏感测试工作区 | 确认子会话权限/费用，不把旁会话当沙箱 |
| 创建 | 菜单执行一次side-chat，等待目录刷新 | 记录新子会话ID/父关系，避免失败后立即重复 |
| 核对 | 核实际打开的会话是否刚创建 | 错会话则停止发送问题，手工查父目录 |
| 退出 | 关闭视图并按宿主结束不需要的子会话 | 关闭视图不等取消后台任务或删除记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/模型环境，金额依读者配置 | 配置Web与服务，核spawn权限/继承 | 本插件无独立收费代码，不能据此称免费 |
| 持续使用 | 每次创建固定中英提示的模型运行；最多六次目录刷新 | 核会话身份并输入实际问题 | 五次150ms间隔外还有刷新耗时，无总deadline；真实token/费率未知 |
| 失败恢复 | 重复创建可能增加子会话和模型消耗 | 手工定位、结束多余会话、检查错投内容 | 没有创建ID收据、幂等键或失败自动清理 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少接线 | 单菜单调用既有continuable spawn与官方视图 | 相较手动创建的实际节时 |
| 主流程并行 | Host不调用主agent的prompt入口 | 上游资源争用、权限/上下文继承和主任务体验 |
| 自动定位 | 成功事件后目录差集与六次刷新 | 并发/订阅时序下正确匹配率 |

> **思考**：Host不返回childID，事后目录差集在目录先到、冷缓存和并发时不能证明本次归属；错误跳转可能使问题错投。均为静态时序推演。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在既有continuable spawn和官方会话视图上补一键菜单/跳转接线，不另造聊天系统；底层并行与持久化归上游。详见[Q01](#research-q01)、[Q02](#research-q02)。

在既有continuable spawn和官方会话视图上补一键菜单/跳转接线，不另造聊天系统；底层并行与持久化归上游。详见[Q01](#research-q01)、[Q02](#research-q02)。

工程可借鉴处是把命令创建与官方聊天视图复用分开，Host透传signal，用ctx.effect托管命令和订阅，不引入自制聊天UI。发布src/lib双份且构建入口明确，便于审查实际装载逻辑；这种接线方式可迁移到其他“创建实体再跳转”场景，但当前目录猜测不是可复用的可靠关联协议。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host不返回childID，事后目录差集在目录先到、冷缓存和并发时不能证明本次归属；错误跳转可能使问题错投。均为静态时序推演。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，核/修创建ID关联、目录时序与恢复凭据后再评估试用。读者进一步探讨可从匹配上游spawn返回和事件契约入手。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持菜单创建与官方子会话视图复用；差集缺少请求到child的一一对应，冷缓存/目录时序和并发可能错开或不打开。精确ID收据与幂等恢复仍为未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、build.mjs、src/index.ts、src/client/index.ts、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查固定README/package/patch、完整Host/Web src与发布lib以及构建脚本。未运行目标、模型或真实宿主；不核上游spawn权限/持久化实现。
- 下一步：可比较手动、目录差集与精确ID收据，在冷缓存、并发、乱序、取消和未知创建结果夹具下核唯一关联、恢复和资源成本；假设尚未验证。

**分析版本**

- **仓库**：[123dbl/dsh-side-session](https://github.com/123dbl/dsh-side-session)
- **版本号**：0.1.0（[固定提交 39443eb](https://github.com/123dbl/dsh-side-session/tree/39443eb1ea15fb080121a3a6474426980f346a6c)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨请求关联的child/parent精确收据与可查询幂等恢复，配合活动视图/取消检查。错开或重复创建反例可推翻实现，尚未验证。详见[Q05](#research-q05)。

可比较手动、目录差集与精确ID收据，在冷缓存、并发、乱序、取消和未知创建结果夹具下核唯一关联、恢复和资源成本；假设尚未验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 59 | 40 | 13 | — |
| .js | source | 2 | 119 | 114 | 8 | — |
| .md | source | 1 | 60 | — | — | 528 |
| .ts | source | 2 | 176 | 98 | 64 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/123dbl/dsh-side-session/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/123dbl/dsh-side-session/issues?q=is%3Aissue+created%3A2026-09-22T09%3A04%3A31.143Z..2026-10-22T09%3A04%3A31.143Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/123dbl/dsh-side-session/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A04%3A31.143Z..2026-10-22T09%3A04%3A31.143Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对固定版本旁会话从创建到打开的关联可靠性，区分入口便利、子会话权限和恢复成本，推导可证伪的关联收据假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 旁会话面向什么任务，创建与跳转怎样协作？

**研究主题**：场景与需求、功能与机制

#### 完整回答

直接用途是在主会话仍有工作时，给另一个问题开可继续的子会话，然后读者亲自接管；不是把一次性任务交给自动团队并合并成果。合格结果是同一父会话下恰好找到本次新建的continuable子会话，输入第一条真实问题前能核其身份。替代办法是用宿主原有子会话/新会话入口创建后手工打开；该插件省的是入口和跳转接线。

Host注册side-chat命令，取得当前agent，startContinuable指定provider spawn、父agent、固定中英双语就绪提示及本地小时分钟标签，传入signal。它等待调用返回，但丢弃result，只返回通用成功文本。主agent没有被本插件直接调用prompt，因此“不往主对话插入新问题”有源码；“主会话完全不受影响”仍是作者强声明，共享模型/调度资源和上游继承不由这里保证。子会话的固定就绪回复本身可能调用模型，不是空白零工作新窗口。

Web监听side-chat成功事件，读取父会话此前子ID集合，最多刷新六次，每次取当前目录里第一个未见的可继续child，随后openSubagent。若未找到就静默返回，没有把自动跳转失败返回Host。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-14](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/README.md#L3-L14)

作者用途及并行声明。

<details>
<summary>查看原文（12行）</summary>

```text
Side-chat (旁会话) plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

While your main session is running, pick **side-chat** from the composer's "＋" command menu to open a fresh, independent, continuable session in parallel — the main session is never prompted or touched.

主会话进行中，从输入框的「＋」命令菜单选 **side-chat（旁会话）**，即可一键新开一个独立、可继续对话的并行会话——主会话不受任何影响。

## What it does / 功能

- Registers one host command, `/side-chat` (旁会话), shown in the composer's "＋" command menu. / 注册一个宿主命令 `/side-chat`（旁会话），出现在输入框「＋」命令菜单。
- Picking it spawns a **continuable subagent** under the calling session, with a fixed ready-to-go opening prompt and an auto timestamp label (`旁会话 14:32`). / 选中后在当前会话下派生一个可继续对话的子代理，附带就绪开场白与自动时间戳标签。
- The browser half then jumps straight into the new child's official chat view, where you take over the conversation. / 前端随即自动跳转到新旁会话的对话视图，由你接管对话。
- No panel, no popup, no settings: the command menu entry *is* the whole UI. / 无面板、无弹窗、无设置——命令菜单入口即全部 UI。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:34-46](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L34-L46)

依赖、固定prompt与标签。

<details>
<summary>查看原文（13行）</summary>

```text
export const inject = ['commands', 'subagents']

/** Fixed opening prompt delivered to a freshly spawned side session. */
const OPENING_PROMPT = [
  '这是一个新的旁会话。请用一两句话确认你已经就绪，并等待我输入第一个问题。',
  'This is a new side session. Confirm in a sentence or two that you are ready, then wait for my first question.',
].join('\n')

/** Short timestamp used as the child's display label, e.g. `旁会话 14:32`. */
function labelFor(now: Date): string {
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `旁会话 ${hh}:${mm}`
```

</details>

**依据 3 · 源码核查**：[src/index.ts:53-77](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L53-L77)

创建请求/信号和通用结果。

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.commands.register({
    name: 'side-chat',
    description: '新建一个独立的旁会话（可继续对话的子代理），不影响当前会话',
    handler: async ({ agent, signal }): Promise<CommandResult> => {
      try {
        const subagents = ctx.get('subagents')
        if (subagents === undefined) {
          return { kind: 'error', text: '旁会话服务未就绪' }
        }
        const result = await subagents.startContinuable({
          provider: 'spawn',
          label: labelFor(new Date()),
          request: {
            parent: agent,
            prompt: [{ type: 'text', text: OPENING_PROMPT }],
          },
          signal,
        })
        return { kind: 'success', text: '已创建旁会话' }
      } catch {
        return { kind: 'error', text: '创建旁会话失败' }
      }
    },
  }), 'dsh-side-session: /side-chat command')
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:35-61](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L35-L61)

目录刷新及挑选。

<details>
<summary>查看原文（27行）</summary>

```text
async function settleChild(
  sessions: ISessions,
  parentId: SessionId,
  before: Set<SessionId>,
  attempts = 6,
): Promise<SessionId | undefined> {
  for (let i = 0; i < attempts; i += 1) {
    await sessions.refreshSubagents(parentId)
    const snapshot = sessions.list.getSnapshot()
    const catalog = snapshot.subagentsByParent[parentId]
    if (catalog && catalog.state === 'ready') {
      // Prefer a continuable child that was not there before the command ran.
      let fallback: SessionId | undefined
      for (const entry of catalog.entries) {
        if (entry.kind !== 'child' || entry.mode !== 'continuable') continue
        if (!before.has(entry.id)) return entry.id
        fallback = entry.id
      }
      // The feed had never warmed (empty `before`): fall back to the last
      // continuable child, which is the most recently created one.
      if (fallback !== undefined && before.size === 0) return fallback
    }
    if (i < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }
  return undefined
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:88-95](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L88-L95)

事件后自动打开。

```text
  ctx.on('command/executed', async (sessionId: SessionId, name: string, result: CommandResult) => {
    if (name !== 'side-chat') return
    if (result.kind !== 'success') return
    const before = seenByParent.get(sessionId) ?? new Set<SessionId>()
    const childId = await settleChild(sessions, sessionId, before)
    if (childId === undefined) return
    sessions.openSubagent({ parentSessionId: sessionId, childSessionId: childId, mode: 'continuable' })
  })
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录差集能否准确打开本次创建的子会话？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

有条件地能找到“目录中此前未见的continuable child”，不能据此证明就是本命令创建的会话。已有贡献是沿用官方子会话/视图，实现极小的Host命令与Web连接，不另造聊天系统；关键薄弱点是缺少创建返回ID，必须猜关联。

seenByParent并不是执行命令之前固定下来的快照，而是sessions.list订阅持续更新的模块级Map。若新child的目录帧先于command/executed回调到达，before已包含刚创建的ID，随后它不再是差集；若目录无其他新child且before非空，六次都找不到就不跳转。反向在冷缓存或订阅尚未更新时before为空，目录中任何旧continuable child都未见，循环立即返回第一个，不能保证是新建或最近创建。代码注释提“last fallback”，但before为空且存在合格entry时前面的return已先触发，fallback分支无法修复这种情况。

并发两次命令、另一入口同时创建或同父多客户端创建时，事件没有requestID/childID匹配，两个回调可能选同一个child或其他新child。等待间隔只有5×150ms，refreshSubagents本身没有本地超时或取消，总时长并非750ms。即使读者切换到其他会话，await完成仍可能执行openSubagent抢回视图。Host捕获错误统一失败，但没有保留是否已创建的状态；若上游创建后抛错，重试是否重复不能由插件判定。以上是按代码时序推演的反例，未声称实测发生。

目录订阅在dispose时解除，但Map未清理、异步刷新循环无dispose检查；父会话移除后旧集合仍可能留存。没有执行任意命令或新Host路由，风险集中在会话归属、错投问题和资源恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:63-75](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L63-L75)

result丢弃与统一catch。

<details>
<summary>查看原文（13行）</summary>

```text
        const result = await subagents.startContinuable({
          provider: 'spawn',
          label: labelFor(new Date()),
          request: {
            parent: agent,
            prompt: [{ type: 'text', text: OPENING_PROMPT }],
          },
          signal,
        })
        return { kind: 'success', text: '已创建旁会话' }
      } catch {
        return { kind: 'error', text: '创建旁会话失败' }
      }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:31-61](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L31-L61)

模块Map、差集和fallback次序。

<details>
<summary>查看原文（31行）</summary>

```text
/** Last-seen direct-child id sets, per parent session, from the live list feed. */
const seenByParent = new Map<SessionId, Set<SessionId>>()

/** Poll a few times after a refresh for the catalog to settle (defensive). */
async function settleChild(
  sessions: ISessions,
  parentId: SessionId,
  before: Set<SessionId>,
  attempts = 6,
): Promise<SessionId | undefined> {
  for (let i = 0; i < attempts; i += 1) {
    await sessions.refreshSubagents(parentId)
    const snapshot = sessions.list.getSnapshot()
    const catalog = snapshot.subagentsByParent[parentId]
    if (catalog && catalog.state === 'ready') {
      // Prefer a continuable child that was not there before the command ran.
      let fallback: SessionId | undefined
      for (const entry of catalog.entries) {
        if (entry.kind !== 'child' || entry.mode !== 'continuable') continue
        if (!before.has(entry.id)) return entry.id
        fallback = entry.id
      }
      // The feed had never warmed (empty `before`): fall back to the last
      // continuable child, which is the most recently created one.
      if (fallback !== undefined && before.size === 0) return fallback
    }
    if (i < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }
  return undefined
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:75-97](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L75-L97)

订阅更新、事后读取before及仅解除订阅。

<details>
<summary>查看原文（23行）</summary>

```text
  const unlisten = sessions.list.subscribe(() => {
    const snapshot = sessions.list.getSnapshot()
    for (const parentId of Object.keys(snapshot.subagentsByParent)) {
      const catalog = snapshot.subagentsByParent[parentId as SessionId]
      if (!catalog || catalog.state !== 'ready') continue
      const ids = new Set<SessionId>()
      for (const entry of catalog.entries) {
        if (entry.kind === 'child') ids.add(entry.id)
      }
      seenByParent.set(parentId as SessionId, ids)
    }
  })

  ctx.on('command/executed', async (sessionId: SessionId, name: string, result: CommandResult) => {
    if (name !== 'side-chat') return
    if (result.kind !== 'success') return
    const before = seenByParent.get(sessionId) ?? new Set<SessionId>()
    const childId = await settleChild(sessions, sessionId, before)
    if (childId === undefined) return
    sessions.openSubagent({ parentSessionId: sessionId, childSessionId: childId, mode: 'continuable' })
  })

  ctx.effect(() => unlisten, 'dsh-side-session: catalog subscription')
```

</details>

#### 缺口

- 目录帧与command/executed真实先后顺序、refresh完成语义及并发条件未由上游材料确认。
  **影响**：不能把差集打开当一一对应收据。
  **进一步探讨**：可先检查匹配版本上游事件/目录契约，用新ID先到、旧目录冷缓存及并发创建的固定时序夹具验证关联。
- spawn创建返回值和失败后是否已有持久子会话未定义在本仓库。
  **影响**：通用失败后重试可能重复，不能确认可安全重放。
  **进一步探讨**：可从上游返回/异常提交边界及幂等机制核起，再设计可查询收据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、权限与采用流程需要什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

发布package0.1.0要求Node ^22.19或>=24，main/exports指向已提交lib，cordis patch挂Host，dsh.client平台限定web并声明客户端runtime/commands。Host硬依赖commands/subagents，Web硬依赖sessions及上游command/executed事件；类型import不是本插件运行时实现子agent服务。已逐行读发布lib/index.js与client.js，关键创建、差集选择、订阅和打开逻辑与src相符，未执行构建或启动。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24、DSH commands/subagents | 必需 | 注册命令、spawn可继续子会话 | 不满足无法提供创建链 |
| Web sessions、command/executed事件、模块加载器 | 自动打开必需 | 刷新目录与openSubagent | Host创建成功仍可能无法定位/打开 |
| spawn上游模型、权限与会话持久化 | 子会话运行必需 | 处理固定就绪提示与用户后续任务 | 本插件不定义隔离/计费/数据继承策略 |
| 已提交lib与cordis.patch.yml | 仓库安装必需 | Host及Web发布入口 | 源码变更须同步构建产物 |
| pnpm/esbuild/tsc | 仅开发构建 | 生成lib/声明 | 普通仓库安装按README不要求自行构建 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 读者核宿主版本、模型权限和非敏感测试工作区 | 确认子会话权限/费用，不把旁会话当沙箱 |
| 创建 | 菜单执行一次side-chat，等待目录刷新 | 记录新子会话ID/父关系，避免失败后立即重复 |
| 核对 | 核实际打开的会话是否刚创建 | 错会话则停止发送问题，手工查父目录 |
| 退出 | 关闭视图并按宿主结束不需要的子会话 | 关闭视图不等取消后台任务或删除记录 |

所谓independent只能解释为分开的可继续会话，本插件仍把live parent agent传给spawn。源码没有限定子会话文件访问、模型配置、工具权限、工作目录或父上下文继承，不能因没有自写IO就称子会话隔离。本仓库也没有删除/结束子会话或关闭视图即取消的逻辑。读者应通过现有宿主机制了解权限并核对刚创建ID；菜单成功而未跳转时先查看父目录，再决定是否重新创建。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:4-24](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/package.json#L4-L24)

版本、引擎、发布exports。

<details>
<summary>查看原文（21行）</summary>

```text
  "version": "0.1.0",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "node build.mjs",
    "typecheck": "tsc --noEmit"
  },
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:50-60](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/package.json#L50-L60)

Web客户端声明。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-commands"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/cordis.patch.yml#L1-L5)

Host挂载。

```text
# dsh-side-session bundle patch: mount the host half (the client half is
# loaded by the web client roster through the package's dsh.client manifest).
- insert:
    - id: dsh-side-session
      name: dsh-side-session
```

**依据 4 · 源码核查**：[src/index.ts:63-71](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L63-L71)

父agent直接交spawn。

```text
        const result = await subagents.startContinuable({
          provider: 'spawn',
          label: labelFor(new Date()),
          request: {
            parent: agent,
            prompt: [{ type: 'text', text: OPENING_PROMPT }],
          },
          signal,
        })
```

**依据 5 · 源码核查**：[lib/index.js:13-37](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/lib/index.js#L13-L37)

发布Host对应创建/结果。

<details>
<summary>查看原文（25行）</summary>

```text
function apply(ctx) {
  ctx.effect(() => ctx.commands.register({
    name: "side-chat",
    description: "\u65B0\u5EFA\u4E00\u4E2A\u72EC\u7ACB\u7684\u65C1\u4F1A\u8BDD\uFF08\u53EF\u7EE7\u7EED\u5BF9\u8BDD\u7684\u5B50\u4EE3\u7406\uFF09\uFF0C\u4E0D\u5F71\u54CD\u5F53\u524D\u4F1A\u8BDD",
    handler: async ({ agent, signal }) => {
      try {
        const subagents = ctx.get("subagents");
        if (subagents === void 0) {
          return { kind: "error", text: "\u65C1\u4F1A\u8BDD\u670D\u52A1\u672A\u5C31\u7EEA" };
        }
        const result = await subagents.startContinuable({
          provider: "spawn",
          label: labelFor(/* @__PURE__ */ new Date()),
          request: {
            parent: agent,
            prompt: [{ type: "text", text: OPENING_PROMPT }]
          },
          signal
        });
        return { kind: "success", text: "\u5DF2\u521B\u5EFA\u65C1\u4F1A\u8BDD" };
      } catch {
        return { kind: "error", text: "\u521B\u5EFA\u65C1\u4F1A\u8BDD\u5931\u8D25" };
      }
    }
  }), "dsh-side-session: /side-chat command");
```

</details>

**依据 6 · 源码核查**：[lib/client.js:28-72](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/lib/client.js#L28-L72)

发布Web对应差集/订阅。

<details>
<summary>查看原文（45行）</summary>

```text
var inject = ["sessions"];
var seenByParent = /* @__PURE__ */ new Map();
async function settleChild(sessions, parentId, before, attempts = 6) {
  for (let i = 0; i < attempts; i += 1) {
    await sessions.refreshSubagents(parentId);
    const snapshot = sessions.list.getSnapshot();
    const catalog = snapshot.subagentsByParent[parentId];
    if (catalog && catalog.state === "ready") {
      let fallback;
      for (const entry of catalog.entries) {
        if (entry.kind !== "child" || entry.mode !== "continuable") continue;
        if (!before.has(entry.id)) return entry.id;
        fallback = entry.id;
      }
      if (fallback !== void 0 && before.size === 0) return fallback;
    }
    if (i < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  return void 0;
}
function apply(ctx) {
  const sessions = ctx.get("sessions");
  const unlisten = sessions.list.subscribe(() => {
    const snapshot = sessions.list.getSnapshot();
    for (const parentId of Object.keys(snapshot.subagentsByParent)) {
      const catalog = snapshot.subagentsByParent[parentId];
      if (!catalog || catalog.state !== "ready") continue;
      const ids = /* @__PURE__ */ new Set();
      for (const entry of catalog.entries) {
        if (entry.kind === "child") ids.add(entry.id);
      }
      seenByParent.set(parentId, ids);
    }
  });
  ctx.on("command/executed", async (sessionId, name, result) => {
    if (name !== "side-chat") return;
    if (result.kind !== "success") return;
    const before = seenByParent.get(sessionId) ?? /* @__PURE__ */ new Set();
    const childId = await settleChild(sessions, sessionId, before);
    if (childId === void 0) return;
    sessions.openSubagent({ parentSessionId: sessionId, childSessionId: childId, mode: "continuable" });
  });
  ctx.effect(() => unlisten, "dsh-side-session: catalog subscription");
```

</details>

**依据 7 · 作者声明**：[README.md:18-29](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/README.md#L18-L29)

作者安装路径说明。

<details>
<summary>查看原文（12行）</summary>

````text
From this repository (no build step: the client and host halves are prebuilt and committed under `lib/`):

```sh
dsh plugin --profile web add github:123dbl/dsh-side-session
```

or, once listed, one-click from the plugin market (Settings → plugins).

Local development link (already used by the author's `web` profile):

```sh
dsh plugin --profile web add link:/path/to/dsh-side-session
````

</details>

#### 缺口

- 匹配宿主spawn的权限/上下文继承和持久化/终止规则未核。
  **影响**：不能推荐敏感任务隔离，也不能认为关闭视图已释放模型任务。
  **进一步探讨**：继续探讨可先固定宿主版本，查看spawn的Agent配置继承、工作区和生命周期契约。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本和效果如何？

**研究主题**：效果与总成本

#### 完整回答

该插件没有单独的远程付费API或文件复制流程，但startContinuable发固定就绪prompt，子会话后续仍消耗宿主模型/工具资源。模型价格、实际上下文、token与调度队列不在这里，所以不估金额和效率百分比。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/模型环境，金额依读者配置 | 配置Web与服务，核spawn权限/继承 | 本插件无独立收费代码，不能据此称免费 |
| 持续使用 | 每次创建固定中英提示的模型运行；最多六次目录刷新 | 核会话身份并输入实际问题 | 五次150ms间隔外还有刷新耗时，无总deadline；真实token/费率未知 |
| 失败恢复 | 重复创建可能增加子会话和模型消耗 | 手工定位、结束多余会话、检查错投内容 | 没有创建ID收据、幂等键或失败自动清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少接线 | 单菜单调用既有continuable spawn与官方视图 | 相较手动创建的实际节时 |
| 主流程并行 | Host不调用主agent的prompt入口 | 上游资源争用、权限/上下文继承和主任务体验 |
| 自动定位 | 成功事件后目录差集与六次刷新 | 并发/订阅时序下正确匹配率 |

相较手动创建/打开，单入口可能节省操作；若自动跳转错会话或未跳转，寻找与清理成本可能抵消收益。成本评估应以“准确创建并打开指定新会话”计成功，并计重复child数量、目录请求和恢复人时，不能只计Host success或菜单点击。代码中的分钟标签可帮助看时间但同一分钟重复标签不构成唯一收据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:36-46](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L36-L46)

固定模型输入与非唯一分钟标签。

<details>
<summary>查看原文（11行）</summary>

```text
/** Fixed opening prompt delivered to a freshly spawned side session. */
const OPENING_PROMPT = [
  '这是一个新的旁会话。请用一两句话确认你已经就绪，并等待我输入第一个问题。',
  'This is a new side session. Confirm in a sentence or two that you are ready, then wait for my first question.',
].join('\n')

/** Short timestamp used as the child's display label, e.g. `旁会话 14:32`. */
function labelFor(now: Date): string {
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `旁会话 ${hh}:${mm}`
```

</details>

**依据 2 · 源码核查**：[src/index.ts:63-75](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L63-L75)

创建而无child收据。

<details>
<summary>查看原文（13行）</summary>

```text
        const result = await subagents.startContinuable({
          provider: 'spawn',
          label: labelFor(new Date()),
          request: {
            parent: agent,
            prompt: [{ type: 'text', text: OPENING_PROMPT }],
          },
          signal,
        })
        return { kind: 'success', text: '已创建旁会话' }
      } catch {
        return { kind: 'error', text: '创建旁会话失败' }
      }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:35-61](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L35-L61)

六次刷新与局部间隔。

<details>
<summary>查看原文（27行）</summary>

```text
async function settleChild(
  sessions: ISessions,
  parentId: SessionId,
  before: Set<SessionId>,
  attempts = 6,
): Promise<SessionId | undefined> {
  for (let i = 0; i < attempts; i += 1) {
    await sessions.refreshSubagents(parentId)
    const snapshot = sessions.list.getSnapshot()
    const catalog = snapshot.subagentsByParent[parentId]
    if (catalog && catalog.state === 'ready') {
      // Prefer a continuable child that was not there before the command ran.
      let fallback: SessionId | undefined
      for (const entry of catalog.entries) {
        if (entry.kind !== 'child' || entry.mode !== 'continuable') continue
        if (!before.has(entry.id)) return entry.id
        fallback = entry.id
      }
      // The feed had never warmed (empty `before`): fall back to the last
      // continuable child, which is the most recently created one.
      if (fallback !== undefined && before.size === 0) return fallback
    }
    if (i < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }
  return undefined
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:88-95](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L88-L95)

静默未定位与跳转。

```text
  ctx.on('command/executed', async (sessionId: SessionId, name: string, result: CommandResult) => {
    if (name !== 'side-chat') return
    if (result.kind !== 'success') return
    const before = seenByParent.get(sessionId) ?? new Set<SessionId>()
    const childId = await settleChild(sessions, sessionId, before)
    if (childId === undefined) return
    sessions.openSubagent({ parentSessionId: sessionId, childSessionId: childId, mode: 'continuable' })
  })
```

#### 缺口

- 实际首次配置人时、模型资源、目录刷新总耗时和恢复重复会话人时无对照。
  **影响**：不能承诺零额外成本或更快完成问题。
  **进一步探讨**：可比较同固定宿主/模型下手动创建与单入口的准确定位率、全部资源与恢复步骤，不以通用成功文本代替验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程可借鉴点及关联收据假设如何检验，是否可试用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

工程可借鉴处是把命令创建与官方聊天视图复用分开，Host透传signal，用ctx.effect托管命令和订阅，不引入自制聊天UI。发布src/lib双份且构建入口明确，便于审查实际装载逻辑；这种接线方式可迁移到其他“创建实体再跳转”场景，但当前目录猜测不是可复用的可靠关联协议。

由“Host已有创建结果却不交childID”和“客户端只能猜目录差集”推导未验证假设，可采用请求关联的创建收据。Host生成/接受requestID，成功返回实际childID/parentID及创建状态；Web只刷新核对这个精确ID，限定本请求仍活动、父关系和mode匹配后才打开。取消、迟到结果与已创建但未打开分开记状态，不因视图失败重放创建；需要额外幂等或查询机制处理网络未知结果，不假定加requestID自然幂等。相对手工定位，仍保留一键入口；相对当前差集，增加明确关联与恢复凭据，代价是兼容宿主CommandResult与spawn返回协议。若上游不暴露ID，可采用可查询的业务关联记录；不能拿时间戳/最新项充当同等替代。

对照当前差集和精确ID方案，设目录先到/事件先到、冷缓存有旧child、两次并发、他客户端新增、刷新超时、创建后错误、切换父视图和dispose后回调等反例。判据是每个创建收据最多关联自身child且不打开他人child，未知结果能查不盲重试，取消/视图切换后不强制迟到导航；若任何反例仍错开/重复创建且无法区分，则证伪该实现的关联保证。当前未实现也未运行这个方案，不计入插件创新贡献。

推荐observe。单入口接线的已有便利明确，但自动打开这个核心流程没有可靠ID关联，可能把后续问题发送给错误会话，宜先核/修关联与恢复语义再评估日常试用。若读者继续探讨，可从匹配宿主的spawn返回和事件目录顺序入手。核对前不在自动打开视图输入敏感或有副作用的请求，不根据通用失败立即重复创建。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:53-77](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/index.ts#L53-L77)

effect、signal与未使用result。

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.commands.register({
    name: 'side-chat',
    description: '新建一个独立的旁会话（可继续对话的子代理），不影响当前会话',
    handler: async ({ agent, signal }): Promise<CommandResult> => {
      try {
        const subagents = ctx.get('subagents')
        if (subagents === undefined) {
          return { kind: 'error', text: '旁会话服务未就绪' }
        }
        const result = await subagents.startContinuable({
          provider: 'spawn',
          label: labelFor(new Date()),
          request: {
            parent: agent,
            prompt: [{ type: 'text', text: OPENING_PROMPT }],
          },
          signal,
        })
        return { kind: 'success', text: '已创建旁会话' }
      } catch {
        return { kind: 'error', text: '创建旁会话失败' }
      }
    },
  }), 'dsh-side-session: /side-chat command')
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:88-97](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L88-L97)

关联/生命周期改进位置。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.on('command/executed', async (sessionId: SessionId, name: string, result: CommandResult) => {
    if (name !== 'side-chat') return
    if (result.kind !== 'success') return
    const before = seenByParent.get(sessionId) ?? new Set<SessionId>()
    const childId = await settleChild(sessions, sessionId, before)
    if (childId === undefined) return
    sessions.openSubagent({ parentSessionId: sessionId, childSessionId: childId, mode: 'continuable' })
  })

  ctx.effect(() => unlisten, 'dsh-side-session: catalog subscription')
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:35-61](https://github.com/123dbl/dsh-side-session/blob/39443eb1ea15fb080121a3a6474426980f346a6c/src/client/index.ts#L35-L61)

差集对照与反例来源。

<details>
<summary>查看原文（27行）</summary>

```text
async function settleChild(
  sessions: ISessions,
  parentId: SessionId,
  before: Set<SessionId>,
  attempts = 6,
): Promise<SessionId | undefined> {
  for (let i = 0; i < attempts; i += 1) {
    await sessions.refreshSubagents(parentId)
    const snapshot = sessions.list.getSnapshot()
    const catalog = snapshot.subagentsByParent[parentId]
    if (catalog && catalog.state === 'ready') {
      // Prefer a continuable child that was not there before the command ran.
      let fallback: SessionId | undefined
      for (const entry of catalog.entries) {
        if (entry.kind !== 'child' || entry.mode !== 'continuable') continue
        if (!before.has(entry.id)) return entry.id
        fallback = entry.id
      }
      // The feed had never warmed (empty `before`): fall back to the last
      // continuable child, which is the most recently created one.
      if (fallback !== undefined && before.size === 0) return fallback
    }
    if (i < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }
  return undefined
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
