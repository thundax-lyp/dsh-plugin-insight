# IM Companion

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d54b877](https://github.com/FeatherHunter/dsh-im-companion/tree/d54b8778bb2ca0713d26693599efa35f5936dc56)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-im-companion) [![npm 30d 6,599](https://img.shields.io/static/v1?label=npm+30d&message=6%2C599&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-im-companion) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-im-companion)
<!-- END META -->

> **功能**：为 dsh-im 增加助理与工作区面板，查看状态，并管理助理归属和搬家。

> **亮点**：把上游机器人归属、本地助理记录和人设组织到同一操作入口。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：远端与本地分别写，补偿尽力；撤销忽略本地表失败仍可提示成功。需要两边回读才能确认一致。[Q02](#research-q02)

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
  - [Q01 · 比直接管理 dsh-im 的机器人绑定多了什么？](#detail-section-11)
  - [Q02 · 搬家和撤销分别写入哪里？](#detail-section-12)
  - [Q03 · 依赖、权限和持久化边界在哪里？](#detail-section-13)
  - [Q04 · 怎样试验搬家一致性并保留退路？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个 IM 助理及工作区的人可用统一面板核对归属和在线状态。

直接用 dsh-im 管渠道与工作区可以减少额外状态，助理元数据和展示需手工维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 助理面板 | 组织助理和工作区 | 依赖同 profile |
| 搬家 | 协调上游和本地记录 | 补偿尽力 |
| 人设 | 将助理资料加入提示 | 依赖宿主服务与刷新 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH connection.fetch | 注册辅助管理路由 | 目标 profile 需验证版本 |
| dsh-im | 提供真实机器人绑定 | 辅助不替代渠道本体 |
| systemPrompt | 可选人设注入 | 缺席则功能受限 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 假 RPC 和虚构助理 | 核对路由与 YAML |
| 持续 | 回读机器人与助理表 | 出现不一致转人工 |
| 退出 | 停辅助，独立核查原生绑定 | 停面板不能撤销已写状态 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 人工 | 每次一致搬家和撤销的核查时间 | 未量化 |
| 恢复 | 两边状态分歧与重绑 | 超时结果未知 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 减少重复配置 | 单一入口得到一致的两个状态 | 真实宿主待验 |
| 可恢复 | 撤销后两边均回原值 | 当前提示不能当回执 |

> **思考**：远端与本地分别写，补偿尽力；撤销忽略本地表失败仍可提示成功。需要两边回读才能确认一致。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把上游机器人归属、本地助理记录和人设组织到同一操作入口。[Q01](#research-q01) [Q02](#research-q02)

本地助理行与渠道边界清晰，但需要将补偿结果和撤销提示绑定同一完成判据。

<a id="detail-section-5"></a>

### 1.4 主要限制

远端与本地分别写，补偿尽力；撤销忽略本地表失败仍可提示成功。需要两边回读才能确认一致。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在假 RPC 检查绑定、搬家与撤销，真实绑定状态不能两边回读时不用辅助搬家。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码级核查；实际 dsh-im、权限、热重载和渠道均未执行。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/features/adopt/assistant-acts.ts、src/host/home-move.ts、src/host/rpc.ts、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定版本的桥、助理搬家及人设入口；未运行真实宿主、机器人或发送消息。
- 下一步：在假上游分别模拟超时迟到、本地写失败和撤销失败，并核对状态一致、刷新和提示。

**分析版本**

- **仓库**：[FeatherHunter/dsh-im-companion](https://github.com/FeatherHunter/dsh-im-companion)
- **版本号**：0.2.27（[固定提交 d54b877](https://github.com/FeatherHunter/dsh-im-companion/tree/d54b8778bb2ca0713d26693599efa35f5936dc56)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让搬家状态记录实际远端和本地回执，以故障注入对照分歧、误报及恢复；没有改善则保留手工改绑。[Q04](#research-q04)

在假上游分别模拟超时迟到、本地写失败和撤销失败，并核对状态一致、刷新和提示。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 168 | 15360 | — | — | 350783 |
| .mjs | source | 11 | 1484 | 1253 | 131 | — |
| .cjs | source | 12 | 609 | 562 | 28 | — |
| .js | source | 21 | 12037 | 11827 | 201 | — |
| .ts | source | 244 | 43303 | 36111 | 4924 | — |
| .mts | source | 1 | 317 | 253 | 45 | — |
| .ts | example | 1 | 178 | 148 | 24 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-im-companion/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 68](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=68&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-im-companion/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 71](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=71&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-im-companion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 IM 辅助把助理和工作区映射合在一个界面后，搬家、撤销和人设能否与上游状态保持一致。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 比直接管理 dsh-im 的机器人绑定多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在多个 DSH 工作区维护 IM 机器人的用户可以把助理映射为家和工作区，集中看绑定并发起搬家。直接用 dsh-im 管机器人也能改工作区，但额外的名字、家和人设仍需另维护。该插件的增量是用一套界面动作协调本地助理行与上游绑定，并在本地储存元数据；收发渠道依赖 dsh-im。合格搬家是机器人工作区和助理表一致，且后续会话使用预期人设。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-37](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/README.md#L8-L37)

作者定义辅助与上游依赖。

<details>
<summary>查看原文（30行）</summary>

```text
**dsh-im-companion 以助理和家的概念增强dsh-im的使用体验。**

你的 ⭐是我夜空中最亮的星。

*Give every agent a home — IM Companion handles the rest.*

[![版本](https://img.shields.io/npm/v/dsh-im-companion?label=版本)](https://www.npmjs.com/package/dsh-im-companion) [![下载量](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.npmjs.org%2Fdownloads%2Fpoint%2Flast-month%2Fdsh-im-companion&query=%24.downloads&label=下载量&suffix=/月&color=brightgreen)](https://www.npmjs.com/package/dsh-im-companion) [![最近更新](https://img.shields.io/github/last-commit/FeatherHunter/dsh-im-companion?label=最近更新&color=FE7D37)](https://github.com/FeatherHunter/dsh-im-companion/commits/master) [![许可证](https://img.shields.io/badge/许可证-MIT-lightgrey.svg)](LICENSE) [![上游本体](https://img.shields.io/badge/上游-dsh--im-3370ff)](https://github.com/xmanrui/dsh-im) [![期待你参与](https://img.shields.io/badge/期待你参与-brightgreen.svg)](https://github.com/FeatherHunter/dsh-im-companion/issues)

<table>
<tr>
<td align="center" valign="top" width="50%">
<strong>👇 有助理的工作区，一目了然。</strong>
<br><img src="assets/工作区-有助理的工作区一目了然-深色.png" width="300" alt="左栏工作区：全部、有助理、无助理，在线绿灯">
</td>
<td align="center" valign="top" width="50%">
<strong>👇 额外增强DSH原生会话状态。</strong>
<br><img src="assets/工作区增强-显示工作区红色状态-内部也有执行中的会话.png" width="300" alt="工作区红色竖条，组内有异常会话">
</td>
</tr>
</table>

**装它，1 分钟（先装 dsh-im，再装辅助）。**

</div>

<h2 align="center"><sub>INSTALL</sub><br>安装</h2>

<div align="center">

前置要求：[DSH](https://www.npmjs.com/package/@deepseek-ai/dsh)（DeepSeek Harness）+ [dsh-im](https://github.com/xmanrui/dsh-im)（IM 机器人本体）。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:54-81](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/index.ts#L54-L81)

加载本地元数据与管理操作。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx: any, config: any = {}) {
  const logger = typeof ctx?.logger === 'function' ? ctx.logger(name) : (ctx?.logger ?? console)
  const dshHome = String(config.dshHome ?? process.env.DSH_HOME ?? path.join(homedir(), '.dsh'))
  const configDir = configDirFor(dshHome)
  /* T12 #129 首次启动迁移：homes.json / meta.json → 同名 .yaml（幂等，旧文件留一份 .bak）。
   * 与建日志库是两件互不依赖的异步事：读路径对旧 .json 有诚实回落 ⇒ 这里 fire-and-forget，
   * 迁移结果等日志句柄就绪后补记（resident，出问题只看磁盘日志即可判定）。 */
  const migration = migrateConfigToYaml(configDir).catch(() => [])
  const store = new AgentMetaStore(path.join(configDir, 'meta.yaml'))
  void store.load()

  // 更新系统接线（T7 #90 → T5 M5 起无定时器）：`update` 是**提供函数**，让位分支上它一直是 null ⇒
  // 那个实例不建更新能力、不碰宿主存储（票面 §F.2）。这里只交出函数，实现等让位分支过了才建。
  let update: ReturnType<typeof createUpdateHostBridge> | null = null
  /* 日志（T9 #123）同样取成提供函数：让位分支上不建库——同一日志目录不许出现第二个活跃写者。
   * 电话注册表先建好（handler 按名字查表），实现等让位分支过了再填。 */
  let hostLog: HostLogHandle | null = null
  const logPhones: LogPhoneRegistry = new Map()
  /* T8 #178：人设相关写操作成功后主动刷新人设目录——否则「保存资料后 250ms 内到达的消息」会读到旧人设。
   * 用前缀判定（home.* / assistant.*）而非穷举端点：Added-only 加新写端点时自动覆盖；读端点只多一次 stat（未变即早返回）。
   * 刷新失败不改 RPC 结果：装配期还有补救通道（prompt-section 监听 system-prompt/assemble）。 */
  let touchPersonaDirectory: (() => Promise<void>) | null = null
  const dispatch = createAgentFleetHandler(store, { update: () => update, log: () => hostLog, logPhones })
  const handler = async (method: string, payload: any, signal: AbortSignal | null | undefined, traceId: string | null | undefined) => {
    const result = await dispatch(method, payload, signal, traceId)
    if (result.ok && touchPersonaDirectory && (method.startsWith('home.') || method.startsWith('assistant.'))) {
      try { await touchPersonaDirectory() } catch { /* 刷新失败 ≠ 写失败：结果原样返回 */ }
    }
```

</details>

**依据 3 · 源码核查**：[src/host/home-move.ts:13-26](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/host/home-move.ts#L13-L26)

宿主助理行改 homeId，不操作上游机器人。

<details>
<summary>查看原文（14行）</summary>

```text
export function moveAssistantRow(file: string, input: { id: string; targetHomeId: string }): R {
  const id = sn(input.id, 64).trim()
  const target = sn(input.targetHomeId, 64).trim()
  if (!id || !target) return Promise.resolve({ ok: false as const, code: 'bad-request', message: 'id/targetHomeId 必填' })
  return modifyHomesDoc(file, (doc) => {
    const a = doc.assistants.find((x) => x.id === id)
    if (!a) return { ok: false as const, code: 'not-found', message: '助理不存在' }
    if (a.homeId === target) return { ok: false as const, code: 'bad-request', message: '已在该家，无需搬家' }
    const home = doc.homes.find((h) => h.id === target)
    if (!home) return { ok: false as const, code: 'not-found', message: '目标家不存在' }
    if (home.tombstone) return { ok: false as const, code: 'bad-request', message: '目标家已删除' }
    a.homeId = target
    return { ok: true as const, row: a }
  })
```

</details>

#### 缺口

- 没有多助理管理的真实操作时间
  **影响**：不能确定是否比原生管理更省时
  **进一步探讨**：用两套虚构助理对照逐界面配置和一次搬家

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搬家和撤销分别写入哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

已绑定助理先调上游 bot.workspace.set，确认 ok 后调本地 assistant.move；本地写失败时尝试把机器人工作区移回，补偿结果未作成功条件，可能有两侧状态分歧。撤销先反向更新机器人，再更新表；tableMove 返回 false 时路径仍继续显示已撤销。这个反例由代码直接支持，实际复现频率未知。未绑定助理只动本地表。界面刷新失败也不改变此前写结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/adopt/assistant-acts.ts:33-65](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/features/adopt/assistant-acts.ts#L33-L65)

上游和表调用分别判断 ok，timeout 回 false。

<details>
<summary>查看原文（33行）</summary>

```text
async function botSet(ctx: FeatureCtx, channel: string, botId: string, workspace: string): Promise<boolean> {
  if (!ctx.rpc) {
    toast('连接服务不可用')
    return false
  }
  try {
    const raw = await ctx.rpc('/' + channel, 'bot.workspace.set', { botId, workspace }, AbortSignal.timeout(8000)) as
      { ok?: boolean; error?: { code?: string; message?: string } } | null
    if (raw && raw.ok === true) return true
    toast('绑定失败：' + String(raw?.error?.message ?? '绑定失败'))
    return false
  } catch (e) {
    toast('绑定失败：' + msgOf(e))
    return false
  }
}

async function tableMove(ctx: FeatureCtx, id: string, from: string, to: string, followed: boolean): Promise<boolean> {
  if (!ctx.rpc) {
    toast('连接服务不可用')
    return false
  }
  try {
    /* fromHomeId/followBot 只进日志（log-sites 读它们纠正 from/to），宿主只认 id/targetHomeId，多键忽略。 */
    const raw = await ctx.rpc(BRIDGE, 'assistant.move', { id, targetHomeId: to, fromHomeId: from, followBot: followed }, AbortSignal.timeout(8000)) as
      { ok?: boolean; value?: unknown; error?: { code?: string; message?: string } } | null
    if (raw && raw.ok === true) return true
    toast('搬家失败：' + String(raw?.error?.message ?? 'host 桥调用失败'))
    return false
  } catch (e) {
    toast('搬家失败：' + msgOf(e))
    return false
  }
```

</details>

**依据 2 · 源码核查**：[src/features/adopt/assistant-acts.ts:81-98](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/features/adopt/assistant-acts.ts#L81-L98)

先远端后本地与尽力补偿。

<details>
<summary>查看原文（18行）</summary>

```text
  const bound = assistant.status === 'bound' && !!assistant.botId && !!assistant.channel
  if (bound) {
    if (!await botSet(ctx, assistant.channel, assistant.botId as string, toPath)) {
      logLine('debug', 'ui.action', { area: 'adopt', action: 'assistant-move-far-fail', ok: false, message: assistant.id })
      return false
    }
    if (!await tableMove(ctx, assistant.id, assistant.homeId, toHome.id, true)) {
      try { await botSet(ctx, assistant.channel, assistant.botId as string, fromPath) } catch { /* 回滚尽力 */ }
      logLine('debug', 'ui.action', { area: 'adopt', action: 'assistant-move-rollback', ok: false, message: assistant.id })
      return false
    }
  } else {
    if (!await tableMove(ctx, assistant.id, assistant.homeId, toHome.id, false)) return false
  }
  try { hooks?.onCommitted?.(assistant.id) } catch { /* 通知失败不阻断已落地 */ }
  showAssistantUndo(ctx, assistant, toHome.id, fromPath, hooks)
  try { await ctx.refresh() } catch { /* 刷新失败不阻断已落地 */ }
  return true
```

</details>

**依据 3 · 源码核查**：[src/features/adopt/assistant-acts.ts:101-122](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/features/adopt/assistant-acts.ts#L101-L122)

撤销分支忽略 tableMove 返回值并显示成功提示。

<details>
<summary>查看原文（22行）</summary>

```text
function showAssistantUndo(ctx: FeatureCtx, assistant: AssistantRef, toHomeId: string, fromPath: string, hooks?: AssistantMoveHooks): void {
  try { dismissUndo() } catch { /* 忽略 */ }
  dismissAssistantUndo()
  try {
    const back = assistant.homeId
    const label = (assistant.name || assistant.botId || assistant.id) + '已搬到' + shortName(toHomeId)
    const msg = h('span', {}, label + '（5s 内可撤销）')
    const btn = h('button', {
      onClick: () => {
        dismissAssistantUndo()
        void (async () => {
          /* 撤销＝原路搬回去（机器人跟随＋表回迁，不复用 moveAssistantUnit 的撤销窗避免套娃）。 */
          const bound = assistant.status === 'bound' && !!assistant.botId && !!assistant.channel
          if (bound) {
            if (!await botSet(ctx, assistant.channel, assistant.botId as string, fromPath)) return
            await tableMove(ctx, assistant.id, toHomeId, back, true)
          } else {
            await tableMove(ctx, assistant.id, toHomeId, back, false)
          }
          toast('已撤销，回到原家', 'check')
          try { hooks?.onCommitted?.(assistant.id) } catch { /* 通知失败不阻断已落地（调用方重拉家表） */ }
          try { await ctx.refresh() } catch { /* 忽略 */ }
```

</details>

**依据 4 · 源码核查**：[src/host/home-move.ts:13-26](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/host/home-move.ts#L13-L26)

本地更新可拒绝目标不存在或墓碑。

<details>
<summary>查看原文（14行）</summary>

```text
export function moveAssistantRow(file: string, input: { id: string; targetHomeId: string }): R {
  const id = sn(input.id, 64).trim()
  const target = sn(input.targetHomeId, 64).trim()
  if (!id || !target) return Promise.resolve({ ok: false as const, code: 'bad-request', message: 'id/targetHomeId 必填' })
  return modifyHomesDoc(file, (doc) => {
    const a = doc.assistants.find((x) => x.id === id)
    if (!a) return { ok: false as const, code: 'not-found', message: '助理不存在' }
    if (a.homeId === target) return { ok: false as const, code: 'bad-request', message: '已在该家，无需搬家' }
    const home = doc.homes.find((h) => h.id === target)
    if (!home) return { ok: false as const, code: 'not-found', message: '目标家不存在' }
    if (home.tombstone) return { ok: false as const, code: 'bad-request', message: '目标家已删除' }
    a.homeId = target
    return { ok: true as const, row: a }
  })
```

</details>

#### 缺口

- 未测真实 dsh-im 对超时后迟到完成的行为
  **影响**：无法用 false 推断远端一定没写
  **进一步探讨**：用假上游模拟已成功但超时和本地墓碑，回读两边状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、权限和持久化边界在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

包声明需要宿主 connection.fetch 并依赖同 profile 的 dsh-im。辅助注册一个 buffered POST 路由，校验消息形态并经宿主 connection 分发；从该 handler 无法证明远程调用授权矩阵。重装配遇路由已被注册会让位，由旧实例继续服务。人设依赖 systemPrompt 服务可用，写后刷新失败不改 RPC 成功；本地 JSON 到 YAML 的迁移独立，需核对实际文件。每次合格搬家包含上游确认和本地表回读的时间，失败后还要排查两侧。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-15](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/package.json#L2-L15)

确认版本声明和 connection.fetch 依赖。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "dsh-im-companion",
  "version": "0.2.27",
  "dshImCompat": {
    "verified": "5.1.0",
    "range": ">=5.1.0 <6"
  },
  "dshCompat": {
    "verified": "0.2.0-rc.2",
    "requires": "connection.fetch",
    "range": ">=0.1.2-alpha.2 <0.3.0-0"
  },
  "engines": {
    "dsh": ">=0.1.2-alpha.2 <0.3.0-0"
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:54-63](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/index.ts#L54-L63)

配置目录和 YAML 迁移。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: any, config: any = {}) {
  const logger = typeof ctx?.logger === 'function' ? ctx.logger(name) : (ctx?.logger ?? console)
  const dshHome = String(config.dshHome ?? process.env.DSH_HOME ?? path.join(homedir(), '.dsh'))
  const configDir = configDirFor(dshHome)
  /* T12 #129 首次启动迁移：homes.json / meta.json → 同名 .yaml（幂等，旧文件留一份 .bak）。
   * 与建日志库是两件互不依赖的异步事：读路径对旧 .json 有诚实回落 ⇒ 这里 fire-and-forget，
   * 迁移结果等日志句柄就绪后补记（resident，出问题只看磁盘日志即可判定）。 */
  const migration = migrateConfigToYaml(configDir).catch(() => [])
  const store = new AgentMetaStore(path.join(configDir, 'meta.yaml'))
  void store.load()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:87-124](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/index.ts#L87-L124)

POST 分发、形态校验和重复注册让位。

<details>
<summary>查看原文（38行）</summary>

```text
    const dispose = ctx.connection.fetch.register({
      path: ROUTE_PATH,
      methods: ['POST'],
      requestBody: 'buffered',
      async fetch(request: Request): Promise<Response> {
        // 宿主分发器今天只在 methods 命中时才把请求送到本 handler（GET 等落到 /api 拦截器 → 404）；
        // 保留自查是为了让 handler 语义自洽、不依赖宿主的派发实现（断言见 tools/verify/host-entry.ts）。
        if (request.method !== 'POST') return new Response('method not allowed', { status: 405 })
        let message: any
        try { message = await request.json() } catch { return new Response('body is not JSON', { status: 400 }) }
        const rpcId = typeof message?.rpcId === 'string' ? message.rpcId : 'invalid-request'
        const call = message?.payload
        if (message?.type !== 'client-request' || typeof message.rpcId !== 'string'
          || message.method !== ENDPOINT || !call || typeof call.method !== 'string'
          || !Object.hasOwn(call, 'payload')) {
          return reply(rpcId, { ok: false, error: { code: 'gateway/bad-request', message: 'Invalid companion request.', details: {} } })
        }
        /* #125：链 id 走独立实参（payload 里的那份已摘掉）——业务端点入参面与今天逐字节一致。
         * 日志电话例外：电话入参是包自己的语义面（`logQuery` 的 `traceId` 是过滤条件）⇒ 原样透传、不摘键，
         * 也不给它的日志行带链（电话调用不是业务动作）。注册表在建库后才填：那段窗口内按业务端点处理，
         * 只影响「摘掉一把电话自己会忽略的键」，不会改电话行为。 */
        const phoneCall = logPhones.has(call.method)
        const taken = phoneCall ? { traceId: '', payload: call.payload } : takeTraceId(call.payload)
        try { return reply(rpcId, await handler(call.method, taken.payload, request.signal, taken.traceId)) }
        catch { return new Response('companion handler failed', { status: 500 }) }
      },
    })
    ctx.effect(() => () => dispose(), 'dsh-im-companion: fetch route cleanup')
  } catch (error: any) {
    // 路由注册表是宿主共享单例；重装配（live patch reload / 回滚重放）时同一路由可能已被上一个实例注册。
    // 宿主原话：`connection: exact Fetch route "/api/im-companion" is already registered`
    // （@deepseek-ai/dsh-client-connection/lib/index.js registerFetchRoute）。
    // 退让：让已注册实例继续服务，本实例只挂元数据，不再注册；未注册路由时不挂 cleanup。
    if (/already registered/.test(String(error?.message ?? error))) {
      logger.warn?.('[agent-fleet] route ' + ROUTE_PATH + ' already registered by another instance; yielding')
      return
    }
    throw error
```

</details>

**依据 4 · 源码核查**：[src/index.ts:189-211](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/index.ts#L189-L211)

人设注册和写后刷新。

<details>
<summary>查看原文（23行）</summary>

```text
  /* T8 #170 人设注入：模块级 inject 仍只声明 connection（缺 systemPrompt 的宿主不许整插件装配失败），
   * 故在 apply 末尾**后置** ctx.inject(['systemPrompt'])：服务在则注册段，缺席则静默跳过。
   * 段注册在服务 fiber 上、消费者 fiber 销毁不会带走它 ⇒ prompt-section 接住 disposer 并挂 ctx.effect，
   * 热重载/卸载时主动清旧段；注册失败只记常驻日志（phase:'section-register'），绝不打断 apply。 */
  const personaLog: PersonaLogSink = {
    log(level, event, fields) {
      if (hostLog) { hostLog.log(level, event, fields); return }
      if (level === 'debug') return // 高频明细：库未就绪即丢（不缓存，避免内存增长）
      personaPending.push({ level, event, fields })
      if (personaPending.length > 32) personaPending.shift()
      if (event === 'persona.refresh.fail' && fields.phase === 'section-register') {
        logger.warn?.('[agent-fleet] persona section register failed: ' + String(fields.message ?? ''))
      }
    },
  }
  const ownership = createSessionOwnership({ dshHome, log: personaLog })
  const directory = createAssistantDirectory({ dshHome, log: personaLog })
  void ownership.warm()
  void directory.warm()
  /* 写侧刷新出口（#178）：上面 250ms 节流的懒刷新之外，显式写成功后再补一次，关掉旧人设残影窗口。 */
  touchPersonaDirectory = () => directory.refresh('write')
  const persona = createPersonaSection({ ownership, directory, log: personaLog })
  persona.install(ctx)
```

</details>

#### 缺口

- 真实宿主授权、profile 兼容和热重载未跑
  **影响**：不能把响应与人设立即生效等同
  **进一步探讨**：在隔离 profile 检查路由准入、旧新实例、实际绑定与提示结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试验搬家一致性并保留退路？

**研究主题**：新假设与验证、采用判断

#### 完整回答

保留观察。先在假上游和虚构工作区复现本地行与机器人绑定两侧更新，任何真实渠道先避免搬家。可将迁移分成意图、上游已确认、本地已确认和待恢复的持久状态，只有两侧回读一致才显示完成或撤销。对照现行先远端后本地的补偿，模拟首次超时但远端已改、本地失败、反向本地失败和页面退出。若不能减少误报完成与人工排查，或正常搬家受阻明显，则保留原生手工路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/adopt/assistant-acts.ts:81-98](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/features/adopt/assistant-acts.ts#L81-L98)

双阶段写与补偿的当前对照。

<details>
<summary>查看原文（18行）</summary>

```text
  const bound = assistant.status === 'bound' && !!assistant.botId && !!assistant.channel
  if (bound) {
    if (!await botSet(ctx, assistant.channel, assistant.botId as string, toPath)) {
      logLine('debug', 'ui.action', { area: 'adopt', action: 'assistant-move-far-fail', ok: false, message: assistant.id })
      return false
    }
    if (!await tableMove(ctx, assistant.id, assistant.homeId, toHome.id, true)) {
      try { await botSet(ctx, assistant.channel, assistant.botId as string, fromPath) } catch { /* 回滚尽力 */ }
      logLine('debug', 'ui.action', { area: 'adopt', action: 'assistant-move-rollback', ok: false, message: assistant.id })
      return false
    }
  } else {
    if (!await tableMove(ctx, assistant.id, assistant.homeId, toHome.id, false)) return false
  }
  try { hooks?.onCommitted?.(assistant.id) } catch { /* 通知失败不阻断已落地 */ }
  showAssistantUndo(ctx, assistant, toHome.id, fromPath, hooks)
  try { await ctx.refresh() } catch { /* 刷新失败不阻断已落地 */ }
  return true
```

</details>

**依据 2 · 源码核查**：[src/features/adopt/assistant-acts.ts:109-122](https://github.com/FeatherHunter/dsh-im-companion/blob/d54b8778bb2ca0713d26693599efa35f5936dc56/src/features/adopt/assistant-acts.ts#L109-L122)

可注入表更新失败检查撤销显示。

<details>
<summary>查看原文（14行）</summary>

```text
      onClick: () => {
        dismissAssistantUndo()
        void (async () => {
          /* 撤销＝原路搬回去（机器人跟随＋表回迁，不复用 moveAssistantUnit 的撤销窗避免套娃）。 */
          const bound = assistant.status === 'bound' && !!assistant.botId && !!assistant.channel
          if (bound) {
            if (!await botSet(ctx, assistant.channel, assistant.botId as string, fromPath)) return
            await tableMove(ctx, assistant.id, toHomeId, back, true)
          } else {
            await tableMove(ctx, assistant.id, toHomeId, back, false)
          }
          toast('已撤销，回到原家', 'check')
          try { hooks?.onCommitted?.(assistant.id) } catch { /* 通知失败不阻断已落地（调用方重拉家表） */ }
          try { await ctx.refresh() } catch { /* 忽略 */ }
```

</details>

#### 缺口

- 还没有两侧真实回读与恢复测试
  **影响**：不能确认状态记录的成本或实际价值
  **进一步探讨**：用已知远端状态的假 RPC 比较恢复时长、分歧和误报

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
