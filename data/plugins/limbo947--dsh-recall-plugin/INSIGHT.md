# dsh-recall-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[df80442](https://github.com/limbo947/dsh-recall-plugin/tree/df80442fbb1b598026c75b6b699f7d0ecdc2ced7)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/limbo947/dsh-recall-plugin) [![npm 30d 7,107](https://img.shields.io/static/v1?label=npm+30d&message=7%2C107&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recall-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recall-plugin)
<!-- END META -->

> **功能**：将用户消息关联影子git快照，提供文件/会话回退、原生fork、归档与草稿回填。

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03)将文件回退、会话切点和重发接入同一UI，真实预览/树指纹/忙碌/格式/救援与中断恢复护栏比单独fork多保护工作区。

> **主要限制**：[Q02](#research-q02)、[Q04](#research-q04)快照异步且范围有限，安全tag/journal可失败继续，文件/fork/归档/附件部分完成；不撤外部效果/所有人工改动，不是全组事务或秘密擦除。

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
  - [Q01 · 撤回要同时回退哪些状态，相比fork或git增加什么？](#detail-section-11)
  - [Q02 · 快照何时捕获，究竟覆盖哪些文件？](#detail-section-12)
  - [Q03 · 确认撤回后的文件、fork、归档和草稿怎样衔接？](#detail-section-13)
  - [Q04 · 救援和中断记录为什么仍不能保证完整撤销？](#detail-section-14)
  - [Q05 · 怎样受限采用，保留与退出要花什么？](#detail-section-15)
  - [Q06 · 如何把可撤回范围变成可核保证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-recall-plugin2.6.5是原生Host/客户端插件，目标是用户发现自己发错指令、Agent已改工作区，希望回到那轮前重新表述。完整撤回同时处理文件、会话版本与草稿；仅消息撤回/编辑重发则不动文件。成功须纳入范围的文件符合目标快照、会话确在正确turn边界、原会话可查且草稿/附件缺失被明确告知，不是按钮变成功。

原生sessions.fork、项目git/备份与人工重发；git/Host会话服务为已有机制，插件做消息-文件关联与恢复编排。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息快照 | 关联文件状态 | 异步/范围有限，历史无捕获 |
| 文件预览/回退 | 恢复或删除纳入差异 | 会覆盖人工变化，非外部回滚 |
| fork/归档 | 回旧turn边界并保原会话 | 在文件之后，归档异步可失败 |
| 草稿/编辑 | 重表述/附件接续 | 部分文件附件不可读，编辑可能自动发 |
| 恢复/维护 | 安全tag/意图/留存 | 锚/意图可失败继续，旧tag可清 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH sessions/fork/connection/shell与UI输入 | 必需 | 事件/路由/会话/草稿 | 版本降级可部分完成，外层认证依Host |
| git与平台shell/归档工具 | 文件模式必需 | 影子对象/恢复 | 缺git/限额失败无文件快照 |
| 可写home或项目fallback | 必需 | tag/index/意图 | 多一份秘密/磁盘责任 |
| 独立备份与停Agent/外部写 | 本文前提 | 部分失败恢复 | root队列不是全系统锁 |
| 排除/限额/留存策略 | 持续必需 | 控磁盘与覆盖范围 | 被排除/清旧tag不可当全备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | fixture/独立备份，核root/store/git | 不拿唯一生产目录验回退 |
| 捕获 | 启用后新消息，核tag/skip/限额 | 按钮存在非全文件保证 |
| 预览 | 停Agent/外部写，看范围和tree | 变更后重预览，不跳确认 |
| 执行 | 核文件、child切点/归档/草稿逐阶段 | 部分失败不重发业务副作用 |
| 退出 | 冻结新增/保留tag日志，核备份后清归属 | 回原生fork+人工版本控制 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | git/存储/机器金额未知 | 备份/排除/范围与Host兼容核 | 小项目起步 |
| 持续 | 扫描/对象/GC磁盘CPU未知 | 预览、人审和留存治理 | 净少返工未测 |
| 故障 | 可能半恢复/安全tag资源未知 | 文件/fork/归档/外部效果核对 | 无锚/意图写失败仍可继续 |
| 退出 | 快照/归档/备份留存未知 | 冻结/恢复后清归属 | 删除旧tag会失撤回点 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件回退 | 独立git范围/恢复删除命令 | 严格消息前时点/全平台字节验收 |
| 会话接续 | 原生fork/版本家族/归档请求 | 后半链全成功及活动真正停止 |
| 草稿 | setDraft/附件后再submit | 所有附件均可读回 |
| 恢复 | 安全tag/意图/救援/partial | 掉盘/无锚/断电真实结果 |

> **思考**：[Q02](#research-q02)、[Q04](#research-q04)快照异步且范围有限，安全tag/journal可失败继续，文件/fork/归档/附件部分完成；不撤外部效果/所有人工改动，不是全组事务或秘密擦除。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03)将文件回退、会话切点和重发接入同一UI，真实预览/树指纹/忙碌/格式/救援与中断恢复护栏比单独fork多保护工作区。

消息tag映射、root分队列、tree预览失效、partial哨兵/救援和终态分层可借鉴；恢复锚与意图非强制持久以及客户端后半链要求显式未知/部分，不用整组原子概括。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q04](#research-q04)快照异步且范围有限，安全tag/journal可失败继续，文件/fork/归档/附件部分完成；不撤外部效果/所有人工改动，不是全组事务或秘密擦除。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立备份的小型非敏感项目受限试用，先fixture核所有阶段与排除范围。stop Agent和外部写后预览，完整回退覆盖所有纳入差异而非只Agent改动；partial/fork/归档失败就停，保tag和原会话查。外部提交/数据库另恢复。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持原生消息-文件回退编排和多层护栏，小项目可丢弃数据受限试用；未执行真实恢复/Host/脚本，严格恢复档为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/draft-fill.ts、src/client/recall-node.ts、src/host/index.ts、src/host/intent-journal.ts、src/host/maintenance.ts、src/host/queues.ts、src/host/routes-core.ts、src/host/scripts.posix.ts、src/host/snapshots.ts、src/host/store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Host事件/队列/路由、capture/切点/rollback解析、POSIX实际snapshot/restore/delete、execute安全tag/救援/意图、client fork/归档/草稿、store fallback与留存删除；未全审PowerShell、所有排除/大小扫描内部、迁移/格式/设置/UI/版本切换与Host外层身份。
- 下一步：只读固定源码，不执行目标/git影子脚本/Host或测试；一般冒烟为scope_boundary，真实时点/恢复/用户收益与全部平台仍未知。

**分析版本**

- **仓库**：[limbo947/dsh-recall-plugin](https://github.com/limbo947/dsh-recall-plugin)
- **版本号**：2.6.5（[固定提交 df80442](https://github.com/limbo947/dsh-recall-plugin/tree/df80442fbb1b598026c75b6b699f7d0ecdc2ced7)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)提出未验证的严格恢复锚档/阶段回执及捕获时点标注，用故障对照测无锚覆盖/误完成/人工编辑损失和恢复成本，不重造git。

只读固定源码，不执行目标/git影子脚本/Host或测试；一般冒烟为scope_boundary，真实时点/恢复/用户收益与全部平台仍未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 108 | 17584 | — | — | 407361 |
| .js | source | 19 | 9041 | 7977 | 1111 | — |
| .mjs | source | 5 | 1124 | 715 | 329 | — |
| .ts | source | 51 | 13908 | 8738 | 4523 | — |
| .ts | test | 17 | 2912 | 2298 | 253 | — |
| .js | test | 49 | 8975 | 6902 | 1136 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/limbo947/dsh-recall-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核撤回的文件/会话/草稿真实链、恢复锚和失败边界，判断采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 撤回要同时回退哪些状态，相比fork或git增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-recall-plugin2.6.5是原生Host/客户端插件，目标是用户发现自己发错指令、Agent已改工作区，希望回到那轮前重新表述。完整撤回同时处理文件、会话版本与草稿；仅消息撤回/编辑重发则不动文件。成功须纳入范围的文件符合目标快照、会话确在正确turn边界、原会话可查且草稿/附件缺失被明确告知，不是按钮变成功。

相对原生fork，额外恢复工作区文件；相对项目git或手工备份，它用独立影子git不动项目分支/暂存，把消息与文件tag映射。git对象/归档与sessions.fork本身为既有机制，本插件增量是预览/护栏、救援/中断记录和UI重发接线。它不撤数据库、网络提交、已发消息、远程作业或工作区外动作，也不能只撤Agent改动而保留同一快照之后人的所有文件编辑。

插件启用前历史无捕获记录，不应倒推可回退；首条用户消息前没有turn/end时会话不能fork，只可能文件回退。作者整段回退是条件能力，源代码与测试文件存在不是本次真实恢复验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-12](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L10-L12)

作者核心定位和影子仓库/fork。

```text
在任意一条你发过的消息下方点「↶ 撤回」——**工作区文件和对话历史一起回到那条消息发出之前的状态**。

每条消息发送时，工作区先被快照进一个独立的影子 git 仓库（不碰项目自身的 git）；撤回时按快照恢复文件，并经 DSH 官方 `sessions.fork` 把对话切回该消息之前的 turn 边界，原会话归档保留、随时可找回。被撤回消息的文本与附件自动放回输入框，改完即可重发；也可以点消息旁的「✎ 编辑」就地改完直接重发（不动文件），同一段对话的多个版本经 `‹ X/N ›` 翻页器来回切换。快照存储默认落在 `$DSH_HOME` 下。最主要的边界：快照只在**消息发送时**创建，插件启用前的历史消息没有快照、不显示撤回按钮。
```

**依据 2 · 作者声明**：[README.md:46-50](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L46-L50)

作者完整/仅消息与预览。

```text
- **文件 + 对话，整段回退**：撤回的不只是聊天记录，agent 改过的文件也一并回到原样；不受项目 `.gitattributes` 转换影响，换行与二进制内容字节级保真（2.1.1+）。
- **只想重来对话？文件可以不动**（2.3.24+）：确认面板可二选一撤回范围——默认「回退文件与对话」为完整回退；「仅撤回对话」则项目文件一个字节都不动（也不打安全快照），适合对回复不满意、但文件改动正是想要内容的场景。
- **不碰项目自身的 git，目录保持干净**：快照存在独立的影子 git 仓库，分支、暂存区、未提交改动统统不受影响；存储默认落在 `$DSH_HOME` 下、与会话沙箱权限无关（workspace-write / read-only 照常工作），仅当 home 不可写才降级到项目内 `.dsh-recall-snapshots`。
- **先看清单再动手，可反复后悔**：撤回前展示将变更的文件清单（修改 / 恢复 / 删除），确认后才执行；撤回后还能再撤到更早，被覆盖的文件一直找得回来。
- **撤回完就能重发**（2.3.15+）：消息的文本与附件（图片、文件）一起放回输入框，改完直接发送，不必重新挑一遍附件。
```

**依据 3 · 源码核查**：[package.json:1-29](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/package.json#L1-L29)

版本/原生两入口/发布范围。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "dsh-recall-plugin",
  "version": "2.6.5",
  "description": "在 DSH 中撤回自己发过的消息：工作区文件与对话历史一起回到那条消息发出之前，消息的文本与附件自动放回输入框，改完即可重发。文件走独立影子 git 快照（不碰项目自身的 git），对话走官方 sessions.fork，原会话归档可找回。",
  "icon": "assets/icon.svg",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/limbo947/dsh-recall-plugin.git"
  },
  "publishConfig": {
    "access": "public"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "assets",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "engines": {
```

</details>

**依据 4 · 源码核查**：[src/host/snapshots.ts:210-229](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/snapshots.ts#L210-L229)

真实首消息前turn/end切点扫描。

<details>
<summary>查看原文（20行）</summary>

```text
export function scanCutSeqDetail(events: SessionEvent[], messageId: string): CutSeqScan {
  let anchor = -1
  for (let i = 0; i < events.length; i++) {
    const e = events[i]
    if (e && e.type === 'user/message' && e.data && String(e.data.id) === String(messageId)) {
      anchor = i
      break
    }
  }
  if (anchor < 0) return { cut: null, found: false }
  for (let i = anchor - 1; i >= 0; i--) {
    const e = events[i]
    if (e && e.type === 'turn/end' && typeof e.seq === 'number') return { cut: e.seq, found: true }
  }
  return { cut: null, found: true }
}

export function scanCutSeq(events: SessionEvent[], messageId: string): number | null {
  return scanCutSeqDetail(events, messageId).cut
}
```

</details>

**依据 5 · 源码核查**：[src/host/routes-core.ts:149-163](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/routes-core.ts#L149-L163)

仅消息条目/范围实际短路不动git。

<details>
<summary>查看原文（15行）</summary>

```text
      const scope: RecallScope = (args && args.scope === 'session-only') || (entry !== undefined && entry.files === false)
        ? 'session-only'
        : 'both'
      if (scope === 'session-only') {
        const snap = entry
        if (!snap) return { ok: false, code: E.RECALL_NO_SNAPSHOT, message: '该消息没有可用的项目快照' }
        if (agentBusy(sessionId, snap.root)) return { ok: false, code: E.RECALL_AGENT_BUSY, message: 'Agent 正在运行中，请先停止后再撤回' }
        const cutSeq = await snaps.resolveCutSeq(sessionId, id)
        // fork 仍会把切点窗口内的入队事件 seed 进子会话（与模式无关），清理链
        // 照常走（both 分支下方的注释有完整说明）
        const staleQueueItemIds = await snaps.resolveStaleQueueItemIds(sessionId, cutSeq)
        // count 语义 = 回退文件数：session-only 恒为 0（done 面板本就不展示 count）
        return { ok: true, count: 0, cutSeq, staleQueueItemIds }
      }
      // 队列 key 取快照所属工作区（入队前先查一次，仅用于选锁；真正的判定
```

</details>

#### 缺口

- 真实用户误指令频率、同任务重做收益及跨版本恢复结果未独立验。
  **影响**：不把撤回功能等于所有副作用可逆或已生产可靠。
  **进一步探讨**：用无秘密可丢弃项目比较原生fork+手动git和插件，核文件/会话/草稿及人审恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照何时捕获，究竟覆盖哪些文件？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host监听session/event的user/message且source=user，跳subagent；resolveRoot后按工作区队列captureSnapshot，再维护。回调用void异步且明确不阻塞Host，队列只串行插件自己的git写，不是“发消息前全系统冻结”的屏障；不能从README先快照字样推出Agent/外部编辑绝不抢先改文件，真实Host时序未测。

capture解析存储/格式守卫/ensureGit后跑snapshotScript，扫描超限/失败反馈并不登记正常文件快照；messageOnly单独登记files:false。POSIX脚本以独立--git-dir和--work-tree执行add/write-tree/commit-tree/tag，排除表/大文件和总量预算先于add，drop gitlink，add --ignore-errors容忍部分无法索引并输出SNAP_SKIP，fatal才退出。故快照是纳入/可索引文件集合，不等整个目录逐字完整；排除/过大/嵌套仓库和外部效果不恢复。

脚本结果登记message→root/session/time再保存索引，失败有feedback/熔断而不是让宿主消息失败。默认8MB单文件、256MB工作区、10秒扫描/3分钟快照等是作者配置边界，平台/慢盘/大工作区代价必须试；本次核POSIX真实命令，不把PowerShell实现视作已经独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:441-463](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/index.ts#L441-L463)

真实事件过滤/异步入队/非阻塞。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (!event || event.type !== 'user/message') return
    const data = event.data
    if (!data || typeof data.id !== 'string' || !data.id) return
    const source = data.source
    if (!source || source.kind !== 'user') return
    if (session && session.header && session.header.origin === 'subagent') return
    const messageId = data.id
    const time = event.time
    // root 解析有缓存（首次才跑 shell）；解析失败时 key 退化为全局链——
    // 宁可串行，也不能让同一个仓库并发出两把写锁。
    void (async () => {
      const root = await rt.resolveRoot(session.id)
      // 快照总开关：cfg 按调用时读取，设置页热更即时生效。关闭时只冻结新建，
      // maybeMaintain 照常跑——已停增的存储仍需被 gc/清理治理。
      await queues.enqueueFor(root, async () => {
        if (cfg.snapshotEnabled) await snaps.captureSnapshot(session.id, messageId, time)
      })
      await queues.enqueueFor(root, () => maint.maybeMaintain(session.id))
      // PF-6：不清 items 只标 stale——列表先按旧数据应答、后台补新（见 listCache 注释）
      listCache.stale = true
    })().catch((error) => rt.recordError('recall snapshot error: ' + String(error))) // 事件触发不阻塞宿主，失败只进错误缓冲
  })
```

</details>

**依据 2 · 源码核查**：[src/host/queues.ts:19-52](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/queues.ts#L19-L52)

真实每root队列与跨root等待。

<details>
<summary>查看原文（34行）</summary>

```text
  // key -> 该链的尾部。尾部恒为 catch 过的 promise：一次失败不能让整条链
  // 停在拒绝状态，后续任务只依赖排队关系、不依赖前一个任务的结果。
  const tails = new Map<string, Promise<void>>()

  const keyOf = (root: string | null | undefined): string => {
    const k = String(root == null ? '' : root)
    return k !== '' && isWin ? k.toLowerCase() : k
  }

  function tailFor(key: string): Promise<void> {
    return tails.get(key) || Promise.resolve()
  }

  function enqueueFor<T>(root: string | null | undefined, task: () => Promise<T>): Promise<T> {
    const key = keyOf(root)
    const run = tailFor(key).then(task)
    tails.set(key, run.catch(() => {}) as Promise<void>)
    return run
  }

  // 跨工作区操作（全量删除 / 全局 gc）：等这些 root 的链尾全部落地再执行，
  // 并把同一条链尾写回每个 key——与 per-root 任务互斥，又不阻塞无关 root。
  // 空集合退化为单条全局链（'' key），对应「没有 root 可用」的场景。
  function enqueueMany<T>(roots: Array<string | null | undefined>, task: () => Promise<T>): Promise<T> {
    const keys = Array.from(new Set(roots.map(keyOf)))
    if (keys.length === 0) keys.push('')
    const run = Promise.all(keys.map(tailFor)).then(task)
    const tail = run.catch(() => {}) as Promise<void>
    for (const key of keys) tails.set(key, tail)
    return run
  }

  return { enqueueFor, enqueueMany }
}
```

</details>

**依据 3 · 源码核查**：[src/host/snapshots.ts:837-880](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/snapshots.ts#L837-L880)

捕获短路/存储/格式/ensureGit。

<details>
<summary>查看原文（44行）</summary>

```text
  async function captureSnapshot(sessionId: string, messageId: string, time?: number): Promise<void> {
    const root = await rt.resolveRoot(sessionId)
    if (!root) return
    // issue #31：只回退消息在熔断/限流短路之前分流——那两个标记是文件快照
    // 的失败态，不该阻断消息登记（用户开这个模式正是为了绕开它们）
    if (config.messageOnly) {
      await captureMessageOnly(root, sessionId, messageId, time)
      return
    }
    // 熔断检查要在任何解析/建仓动作之前：冷却期内连 resolveStore 都
    // 不必跑，把失败重试的开销也一并止住
    const fused = snapFailures.get(root)
    if (fused && Date.now() < fused.skipUntil) return
    // issue #24：护栏停用期同样在解析之前短路（理由见 snapLimits 声明处）
    const limited = snapLimits.get(root)
    if (limited
      && limited.maxWorkspaceBytes === config.maxWorkspaceBytes
      && limited.scanBudgetMs === config.scanBudgetMs
      && Date.now() - limited.at < SNAP_LIMIT_RETRY_MS) return
    // issue #18：root 自身就是构建产物目录（…/target/debug、dist）时不建快照——
    // baseExcludes 是相对 root 的模式，匹配不到 root 自己，整个目录会被全量快照
    // （实测 7000 个产物全进 index、对象库 GB 级），而这类目录没有回退价值。
    // 位置在 resolveStore 之前：连空仓库都不建。不写 feedback、不进熔断——这是
    // 设计行为而非失败，原因由 init / snapshot-info 的 notice 告知用户。
    if (buildArtifactRootSegment(root, BASE(), rt.isWin)) return
    let store: StoreInfo | null = await rt.resolveStore(root)
    // tryUpgradeToHome 对刚 resolveStore 的 root 恒返回非空（缓存已写入）；
    // 断言仅为类型收口，运行语义与迁移前一致（原代码直接透传返回值）
    store = (await rt.tryUpgradeToHome(root))!
    // A3：格式守卫（fail-closed）——高版本/损坏 store 拒建快照（写操作）
    if (!(await guardStoreFormat(store))) return
    // ensureGit 失败（issue #11 主线缺口）：原先静默 return，不进
    // snapFeedback，客户端空轮询 20 次后放弃、用户零感知。现在走与
    // snapshotScript 失败相同的反馈通道——buildFeedbackError 把原始
    // stderr 分类成可行动提示（锁冲突/磁盘满等），客户端轮询到 failed
    // 即弹「快照失败：<提示>」并停止轮询。不接熔断：环境类失败常可自愈
    // （清磁盘/退锁后下一条消息即恢复），保持按消息重试，刷屏由
    // recordError 尾部去重与 toast 10min 节流缓解。
    const g = await rt.ensureGit(root, store)
    if (!g.ok) {
      setFeedback(messageId, { failed: true, ...buildFeedbackError(g.error || '未知原因') })
      return
    }
    await loadIndex(root, sessionId)
```

</details>

**依据 4 · 源码核查**：[src/host/snapshots.ts:882-921](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/snapshots.ts#L882-L921)

实际shell/限额解析/登记反馈。

<details>
<summary>查看原文（40行）</summary>

```text
    const captureStartedAt = Date.now()
    try {
      // 整条快照脚本的兜底时限（0 = 不限制；runShell 的 timeoutMs 是必达的
      // kill 计时器，「不限」只能用一个足够大的数表达）
      const budget = config.snapshotBudgetMs > 0 ? config.snapshotBudgetMs : 86400000
      const out = await rt.runShell(S.snapshotScript(root, store, state.gitExe || '', messageId, BASE()), { timeoutMs: budget, stdoutMaxBytes: 65536 })
      // issue #24：前置扫描判定超限——本次不建快照，并按停用语义走反馈
      //（不是失败：不 prune、不进熔断），后续快照由上方短路跳过
      const limit = parseSnapshotLimit(out)
      if (limit) {
        markSnapshotLimited(root, limit)
        const notice = buildSnapshotLimitNotice(limit)
        noteSnapshotBlocked(root, 'recall snapshot disabled for ' + root + ': ' + notice)
        setFeedback(messageId, { failed: true, kind: 'workspaceLimit', error: notice })
        return
      }
      // issue #29：统计失败 = 规模未知，同样停用该工作区（不 prune、不进熔断：
      // 脚本在 add 之前就退出了，没有残骸要清）。stderr 原文只进「最近错误」
      const scanFail = parseScanFail(out)
      if (scanFail) {
        const pseudo: SnapshotLimit = { kind: 'scan', value: scanFail.rc, limit: 0 }
        markSnapshotLimited(root, pseudo)
        const notice = buildSnapshotLimitNotice(pseudo)
        noteSnapshotBlocked(root, 'recall snapshot scan failed for ' + root + ': rc=' + scanFail.rc + ' ' + scanFail.message)
        setFeedback(messageId, { failed: true, kind: 'scanFail', error: notice })
        return
      }
      snapFailures.delete(root)
      state.snapshots.set(String(messageId), { root, time: time || Date.now(), sessionId })
      await saveIndex(root, sessionId)
      setFeedback(messageId, { skipped: parseSkipped(out) })
    } catch (error) {
      // 已告警并回传失败反馈（客户端轮询到即弹提示）；handleSnapshotFailure 走 prune+熔断善后
      rt.recordError('recall snapshot failed: ' + String(error))
      // 分类后的提示替代原始 stderr 直传（M1-D4）：识别为环境错误时给
      // 可行动文案，未识别时 buildFeedbackError 内部回落原文截断（保现状）
      setFeedback(messageId, { failed: true, ...buildFeedbackError(String(error)) })
      await handleSnapshotFailure(root, store, Date.now() - captureStartedAt)
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/host/scripts.posix.ts:394-434](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/scripts.posix.ts#L394-L434)

真实独立git/add容错/tree/tag命令。

<details>
<summary>查看原文（41行）</summary>

```text
export function snapshotScript(root: string, store: ScriptStore, gitExe: string, messageId: string, base: string[]): string {
  return [
    'set -e',
    'git=' + psq(gitExe),
    'g=' + psq(store.git),
    'root=' + psq(root),
    heartbeatBlock(),
    dropGitlinksBlock(),
    excludeSyncBlock(store.excludeFile, base),
    // issue #24：总量/预算护栏先于 add——超限时连 add 都不跑
    limitScanBlock(store.maxWorkspaceBytes, store.maxFileBytes, store.scanBudgetMs),
    // issue #29：大文件清单先于 add——add 带 exclude 后不再为它们写对象
    oversizeListBlock(store.maxFileBytes),
    attrsMigrateBlock(),
    oversizeAddPrepBlock(),
    // fail-open add（issue #7 加固，语义见 pwsh 版同款注释）：--ignore-errors
    // 下「无法索引的路径」以退出码 1 结束但索引已落盘；≥2 才是真 fatal，
    // 显式退出让 runShell 抛错（set -e 对 add 非零本会终止，但 || rc=$?
    // 捕获后必须自检，否则 tolerated/fatal 无法区分）。stderr 合并进变量
    // 供 fatal 时带回诊断与 SNAP_SKIP 提取。
    'addrc=0',
    'add_log=$("$git" --git-dir="$g" --work-tree="$root" add -A --ignore-errors "${pa_args[@]}" 2>&1) || addrc=$?',
    'if [ "$addrc" -ge 2 ]; then printf \'%s\\n\' "$add_log" >&2; exit "$addrc"; fi',
    "printf '%s\\n' \"$add_log\" | sed -n -e \"s/^error: unable to index file '\\(.*\\)'$/\\1/p\" -e \"s/^error: unable to add '\\(.*\\)' to index$/\\1/p\" | sort -u | while IFS= read -r sk; do",
    // 循环体用 if/fi 而非 && 列表：&& 列表条件为假时整条管道退出码为 1，
    // set -e 会把脚本杀掉（if 语句天然豁免）
    '  if [ -n "$sk" ]; then printf \'SNAP_SKIP %s\\n\' "$sk"; fi',
    'done',
    dropGitlinksBlock(),
    // 兜底：旧 git 走裸 add 时大文件仍会被重新索引，这里按清单再清一次
    oversizeRemoveBlock(),
    'rm -f "$oversize_p" "$oversize_r"',
    'tree=$("$git" --git-dir="$g" --work-tree="$root" write-tree)',
    'commit=$("$git" --git-dir="$g" -c user.name=dsh-recall -c user.email=recall@dsh.local commit-tree "$tree" -m ' + psq('snapshot ' + messageId) + ')',
    '"$git" --git-dir="$g" tag -f ' + psq('snap-' + messageId) + ' "$commit" >/dev/null',
    // PF-1：TREE 行随 SNAP_OK 回传 add -A 之后的 index 树指纹（语义见 pwsh 版
    // 同名注释）——execute 与 preview 指纹比对判 STALE，免整条重复 diff
    'echo "TREE $tree"',
    'echo SNAP_OK'
  ].join('\n')
}
```

</details>

**依据 6 · 作者声明**：[README.md:155-166](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L155-L166)

作者默认额度/仅消息与冻结配置。

<details>
<summary>查看原文（12行）</summary>

```text
| `gcSnaps` | 50 | 每积累多少条快照触发一次 `git gc`（env `DSH_RECALL_GC_SNAPS` 可强制覆盖） |
| `gcHours` | 24 | 距上次 gc 超过多少小时触发（与条数先到先触发；env `DSH_RECALL_GC_HOURS`） |
| `maxFileBytes` | 8388608（8MB） | 超过该大小的文件不进快照、不被回退触碰；在 `git add` 之前就按清单剔除，不写对象（旧 git 退回「先加后剔」） |
| `maxWorkspaceBytes` | 268435456（256MB） | 单工作区可纳入快照的文件总量上限，口径与 `git add` 一致（`.gitignore`、`.git/info/exclude`、全局 excludesFile 都算数）。超过时**停用该工作区快照**（不截断——截断快照回退时会误删未纳入的文件），并在最近消息上提示；调大该值或补充排除表后自动恢复；0 = 不限制 |
| `scanBudgetMs` | 10000（10 秒） | 快照前统计纳入总量的时间预算。超过时停用本次快照并提示（防病态大目录拖死启动）；0 = 不限制 |
| `snapshotBudgetMs` | 180000（3 分钟） | 单次快照从扫描到写入的总时限，超时即中止本次快照并记入「最近错误」；0 = 不限制 |
| `maxSnapshotsPerWorkspace` | 500 | 每个工作区保留的最大快照数，超限自动删除最旧的；0 = 不限制 |
| `retentionDays` | 0 | 按天数保留快照，超期自动删除；0 = 不启用（与条数上限各自独立生效） |
| `baseExcludes` | `.git`、`node_modules/`、`.dsh-recall-snapshots/`、`dsh-recall-snapshots/`、`target/`、`dist/`、`build/`、`out/`、`coverage/`、`.next/`、`.nuxt/`、`.output/`、`.cache/`、`.gradle/`、`*.exe`、`*.dll`、`*.pdb`、`*.so`、`*.dylib`、`*.msi`、`*.zip`、`*.7z`、`*.rar`、`*.tar`、`*.tar.gz`、`*.iso` | 基础排除表（gitignore 语法，优先级低于 exclude.txt）；被排除的大目录整棵子树不进快照扫描。其中「目录形态」项（如 `target/`）另有一层含义：**工作区根自身的路径段命中时，该工作区不启用快照**——在构建产物目录里开会话时排除表本来就管不到它自己（模式是相对该 root 的），这类目录也没有回退价值；删掉对应项即恢复 |
| `refillDraft` | true | 撤回后把被撤回的消息（文本与附件）回填到输入框 |
| `snapshotEnabled` | true | 快照总开关（关闭只冻结新建，已有快照仍可撤回） |
| `messageOnly` | false | 只回退消息：每条用户消息仍登记撤回记录（按钮与对话回退照常），但不写文件快照——适合 gitignore 过滤后仍上 GB 的超大工作区。按消息生效：开启前的旧快照仍可完整回退文件；这类条目在快照管理里标「仅消息」，删除后不可从 tag 恢复 |
```

</details>

#### 缺口

- 消息事件到首个文件修改的调度时序、并发外部编辑和Windows脚本效果未测。
  **影响**：不能保证每条快照严格早于全部工具副作用或全文件可逆。
  **进一步探讨**：在fixture记录事件/首写/快照tag时间并注入慢盘/不可读/大文件，核skip提示和范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认撤回后的文件、fork、归档和草稿怎样衔接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

preview查agentBusy并在root队列diff，回变更/总数/截断和treeId。完整execute入同root队列再查格式与agentBusy，打pre-rollback安全tag；新版带previewTreeId时与安全快照树比，变了拒STALE，旧客户端退总数检查。真实rollback脚本从目标tag archive/tar恢复差异，删除当前纳入但目标无的文件，ROLLBACK_OK哨兵缺失/异常视partial；不是仅删除聊天文字。

文件失败进安全tag救援；成功后Host解析cutSeq/残留队列item，回客户端。客户端之后才sessions.fork(atSeq)，打开child、记录版本家族、清seed残留入队，异步archiveOriginal(stopActivity:true)。fork返空/抛错只报fork失败并保留“文件已回退、对话未回退”，不会自动把文件回滚回撤回前；归档请求失败只warn，archiveRequested不表示落定。没有跨文件/Host会话/客户端的全组事务。

随后回填文本和可读附件，编辑重发只在真fork后自动发送；普通回填不是自动执行任务。draft-fill实际找新会话input shell设草稿，附件链完才可submit。文件附件缺少Host读回通道可能无法回填，客户端有缺失提示，不能照README概括全部附件总能保真。原会话保留使对话版本可找回，但文件/外部副作用仍需独立恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/routes-core.ts:115-132](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/routes-core.ts#L115-L132)

preview真实busy/diff/tree指纹。

<details>
<summary>查看原文（18行）</summary>

```text
    'preview': async (args: PreviewArgs): Promise<PreviewResponse> => {
      const id = args && args.messageId ? String(args.messageId) : ''
      const sessionId = args && args.sessionId ? String(args.sessionId) : null
      // P0-1：目标工作区 agent 运行中直接拒绝预览（避免用户确认时文件被
      // agent 改动，预览清单与实际回退内容脱节）。同会话优先命中（最常见
      // 场景），快照存在时叠加跨会话同工作区检查。
      const snap = state.snapshots.get(id)
      if (agentBusy(sessionId, snap ? snap.root : null)) return { ok: false, code: E.RECALL_AGENT_BUSY, message: 'Agent 正在运行中，请先停止后再撤回' }
      // 只锁该快照所属工作区：别的项目的预览/快照不该排在同一个队列后面
      const result = await enqueueFor(snap ? snap.root : null, () => snaps.diffFor(id))
      if (result === null) return { ok: false, code: E.RECALL_NO_SNAPSHOT, message: '该消息没有可用的项目快照' }
      const snap2 = state.snapshots.get(id)
      const cutSeq = await snaps.resolveCutSeq(sessionId, id)
      // PF-1：treeId 是 preview 时 add -A 后的 index 树指纹，Client 确认时
      // 透传回 execute——Host 与安全快照指纹比对即可判定「预览后文件是否
      // 变化」，省掉 execute 侧整条重复 diff。旧版 Client 不认识该字段，
      // 无值时 execute 退回 previewTotal 校验（向后兼容）。
      return { ok: true, changes: result.changes, total: result.total, truncated: result.truncated, treeId: result.treeId || null, time: snap2 ? snap2.time : null, root: snap2 ? snap2.root : null, cutSeq, counts: result.counts, files: snap2 ? snap2.files !== false : undefined }
```

</details>

**依据 2 · 源码核查**：[src/host/routes-core.ts:169-225](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/routes-core.ts#L169-L225)

完整execute队列/格式/busy/安全tag/STALE/journal/rollback。

<details>
<summary>查看原文（57行）</summary>

```text
        const store = state.stores.get(snap.root)
        if (!store) return { ok: false, code: E.RECALL_NO_STORE, message: '快照存储不可用' }
        // A3：格式守卫（fail-closed）——安全快照打 tag 与工作区 reset 都是写
        // 操作，高版本/损坏 store 拒执行；预览/列表等读路径不受影响
        if (!(await snaps.guardStoreFormat(store))) {
          return { ok: false, code: E.RECALL_FORMAT_BLOCKED, message: '磁盘格式不受支持，已停止写入；详见「最近错误」' }
        }
        // P0-1：队列内第一步——执行前再查一次 agent 状态。检查放在互斥
        // 队列内，检查后紧接执行，中间不可能插进别的操作，窗口为零。
        if (agentBusy(sessionId, snap.root)) return { ok: false, code: E.RECALL_AGENT_BUSY, message: 'Agent 正在运行中，请先停止后再撤回' }
        // P0-3 / PF-1：preview→execute 失效校验，两代并存——
        // - 新版 Client 透传 previewTreeId（preview 时 add -A 后的 index 树
        //   指纹）：与下方安全快照输出的指纹比对，内容级一致判定，且免掉
        //   一整条重复 diff 进程（一次撤回 4 条重进程 → 3 条）。
        // - 旧版 Client 只带 previewTotal：退回条目总数校验（多付一次 diff，
        //   同数不同文件的边缘情形由安全快照兜底）。
        // - 都不带（直调 API）：不校验，与 P0-3 同款可选语义。
        const previewTreeId = args && typeof args.previewTreeId === 'string' && args.previewTreeId ? args.previewTreeId : null
        if (!previewTreeId && args && typeof args.previewTotal === 'number') {
          const fresh = await snaps.diffFor(id)
          if (!fresh || fresh.total !== args.previewTotal) {
            return { ok: false, code: E.RECALL_STALE, message: '预览后项目文件发生了变化，请重新预览确认' }
          }
        }
        // 回退前自动打安全快照：回退覆盖工作区且不回写 index（旧的
        // 「当前状态」从此无任何快照可找回），用消息 ID 打 tag 会与该消息
        // 的既有快照碰撞，故用独立前缀的时间戳 tag——不进 index.json
        // （列表不展示），但孤儿重建/手动 git tag 仍能找到它，误回退后
        // 用户可让插件从该 tag 恢复，堵住唯一的不可逆操作缺口。
        // 失败时 safetyOk 置 false：后续回退若也失败将无救援点（H1），
        // 行为退化为现状（fail-loud），不更差。
        // PF-1：安全快照输出的树指纹就是「执行时刻的工作区状态」——与
        // previewTreeId 不一致 → STALE（此时安全快照已打下，isSafetySnapshotId
        // 让它不进索引，反而是额外的救援点）。安全快照失败时无指纹可比对，
        // 跳过指纹校验继续回退（不阻断主流程的既有语义）。
        const safetyId = 'pre-rollback-' + Date.now()
        let safetyOk = false
        let safetyTreeId = null
        try {
          const out = await rt.runShell(rt.scripts.snapshotScript(snap.root, store, state.gitExe || '', safetyId, cfg.baseExcludes), { timeoutMs: 600000, stdoutMaxBytes: 65536 })
          safetyOk = true
          safetyTreeId = parseTreeId(out)
        } catch (error) {
          // 安全快照失败不阻断回退本身：用户已确认覆盖，记录后照原计划执行
          rt.recordError('recall safety snapshot failed: ' + String(error))
        }
        if (previewTreeId && safetyTreeId && safetyTreeId !== previewTreeId) {
          return { ok: false, code: E.RECALL_STALE, message: '预览后项目文件发生了变化，请重新预览确认' }
        }
        // A2 针 1：安全快照后、动磁盘前落意图（回退中途断电时启动/init 的
        // recover 据此续做；写失败只告警不阻断主流程——U4 纪律）
        await intentJournal.begin(store, snap.root, { messageId: id, safetyId, safetyOk })
        const rolled = await snaps.rollbackFor(id)
        if (rolled.ok) {
          // A2 针 2：回退成功清记录（残留会被下次启动误判为中断，见 recover）
          await intentJournal.clear(store)
          return rolled
```

</details>

**依据 3 · 源码核查**：[src/host/scripts.posix.ts:516-574](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/scripts.posix.ts#L516-L574)

真实恢复/删除/完成哨兵。

<details>
<summary>查看原文（59行）</summary>

```text
export function rollbackScript(root: string, store: ScriptStore, gitExe: string, tag: string, base: string[]): string {
  return [
    'set -e -o pipefail',
    collectListsBlock(store, gitExe, root, tag, base),
    'tmpr=' + psq(store.dir + '/diff-restore.$$'),
    "trap 'rm -f \"$tmpc\" \"$tmpt\" \"$tmpr\" \"$oversize_p\" \"$oversize_r\"' EXIT",
    // 恢复集 = 目标有、当前无或 sha 不同（awk 结构与 diffScript 同款：
    // cur 侧 "mode sha stage<TAB>path" 取 a[2]，target 侧 "mode type sha<TAB>path" 取 a[3]）
    'awk -F\'\\t\' \'',
    '  FNR==1 { fidx++ }',
    '  fidx==1 { split($1, a, " "); cur[$2]=a[2]; next }',
    '  { split($1, a, " "); tgt[$2]=a[3] }',
    '  END { for (p in tgt) if (!(p in cur) || cur[p] != tgt[p]) print p }',
    "' \"$tmpc\" \"$tmpt\" > \"$tmpr\"",
    'restored=$(wc -l < "$tmpr" | tr -d \' \')',
    'total=$(wc -l < "$tmpt" | tr -d \' \')',
    'if [ "$restored" -gt 0 ]; then',
    '  if [ $((restored * 2)) -ge "$total" ]; then',
    // -m（--touch，两处 tar 调用同款）：解包不恢复归档成员的 mtime（文件
    // mtime = 解包时刻）。必须如此：tar 默认保留归档内 mtime，而快照→篡改→
    // 回滚常在数秒内完成，恢复出的 mtime 可能与 index 里旧条目的 stat 记录
    // 碰撞，下一次 add -A 的 stat 缓存误判「未变更」跳过 re-hash——工作区
    // 内容与快照从此脱钩（实测解包出篡改前内容的间歇性失败）。Windows 逐条
    // 解压也会显式 touch，两侧语义由各自的回退冒烟测试锁定。
    '    "$git" --git-dir="$g" archive ' + psq(tag) + ' | tar -x -m -C "$root"',
    '  else',
    '    batch=()',
    '    while IFS= read -r p; do',
    '      if [ -z "$p" ]; then continue; fi',
    '      batch+=("$p")',
    '      if [ "${#batch[@]}" -ge 100 ]; then',
    '        "$git" --literal-pathspecs --git-dir="$g" archive ' + psq(tag) + ' -- "${batch[@]}" | tar -x -m -C "$root"',
    '        batch=()',
    '      fi',
    '    done < "$tmpr"',
    '    if [ "${#batch[@]}" -gt 0 ]; then',
    '      "$git" --literal-pathspecs --git-dir="$g" archive ' + psq(tag) + ' -- "${batch[@]}" | tar -x -m -C "$root"',
    '    fi',
    '  fi',
    'fi',
    'tmpd=' + psq(store.dir + '/diff-del.$$'),
    "trap 'rm -f \"$tmpc\" \"$tmpt\" \"$tmpr\" \"$tmpd\" \"$oversize_p\" \"$oversize_r\"' EXIT",
    'awk -F\'\\t\' \'',
    '  FNR==1 { fidx++ }',
    '  fidx==1 { cur[$2]=1; next }',
    '  { tgt[$2]=1 }',
    '  END { for (p in cur) if (!(p in tgt)) print p }',
    "' \"$tmpc\" \"$tmpt\" > \"$tmpd\"",
    'deleted=0',
    'while IFS= read -r p; do',
    // 循环体禁裸 && 链（AGENTS.md 已知坑同款规矩）：&& 列表条件为假时整条
    // 退出码为 1，set -e 会把脚本杀掉；if 语句天然豁免。rm 失败必须响亮
    // exit 1——半回退假成功会让救援永不触发（F-G2）
    '  if [ -z "$p" ]; then continue; fi',
    '  if rm -f -- "$root/$p"; then deleted=$((deleted + 1)); else echo "RM_FAILED $p" >&2; exit 1; fi',
    'done < "$tmpd"',
    'echo "ROLLBACK_OK $deleted $restored"'
  ].join('\n')
}
```

</details>

**依据 4 · 源码核查**：[src/host/snapshots.ts:1006-1025](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/snapshots.ts#L1006-L1025)

rollback哨兵/partial处理。

<details>
<summary>查看原文（20行）</summary>

```text
  }

  async function rollbackFor(messageId: string): Promise<RollbackResult> {
    const snap = state.snapshots.get(String(messageId))
    if (!snap) return { ok: false, error: '该消息没有可用的项目快照' }
    const store = state.stores.get(snap.root)
    if (!store) return { ok: false, error: '快照存储不可用' }
    try {
      const text = S.stripBom(await rt.runShell(S.rollbackScript(snap.root, store, state.gitExe || '', 'snap-' + messageId, BASE()), { timeoutMs: 600000, stdoutMaxBytes: 65536 }))
      const m = text.trim().match(/^ROLLBACK_OK\s+(\d+)\s+(\d+)/)
      if (!m) {
        // 无 ROLLBACK_OK 哨兵：脚本在输出哨兵前终止，工作区状态不可知——
        // 一律按「可能半回退」处理，交给 execute 侧救援（H1）。
        return { ok: false, partial: true, error: '回退脚本未正常完成（工作区可能处于半回退状态）：' + text.slice(0, 300) }
      }
      // 捕获组缺席时 parseInt 得 NaN，由下方 Number.isNaN 兜零（与旧行为一致）
      const deleted = parseInt(m[1] ?? '', 10)
      const restored = parseInt(m[2] ?? '', 10)
      return { ok: true, count: (Number.isNaN(deleted) ? 0 : deleted) + (Number.isNaN(restored) ? 0 : restored) }
    } catch (error) {
```

</details>

**依据 5 · 源码核查**：[src/host/routes-core.ts:228-253](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/routes-core.ts#L228-L253)

救援/清journal/成功后切点。

<details>
<summary>查看原文（26行）</summary>

```text
        // rescue 后无论成败都 clear——失败虽留下现场，但手动命令逃生门已在
        // 结果面板给出：留着记录会让下次启动的自动 reset 覆盖用户按手动命令
        // 恢复后的新改动（记录内容由下方提示的路径可查）。
        // 回退失败（rollbackFor 返回 partial，工作区可能半回退）：用安全快照
        // 救援（H1）。rescueRollback 是 snapshots.js 模块级纯逻辑，副作用经
        // deps 注入，三分支（无救援点/救援成功/救援失败）单测直接钉。
        await intentJournal.advance(store, 'rescue')
        const rescueResult = await rescueRollback(
          { runShell: rt.runShell, scripts: rt.scripts, gitExe: state.gitExe || '', recordError: rt.recordError },
          { root: snap.root, store, safetyId, safetyOk, rollbackError: rolled.error }
        )
        await intentJournal.clear(store)
        // U4 留痕：提示附意图文件路径（中断点记录位置，用户可精确知道恢复
        // 到了哪一步、现场在哪）
        if (rescueResult && rescueResult.message) rescueResult.message += '（中断点记录：' + intentJournal.file(store) + '）'
        return rescueResult
      })
      if (!result.ok) return result
      // 文件回退后再解析切点：切点只依赖会话日志，与快照是否删除无关（命中缓存，瞬时）
      const cutSeq = await snaps.resolveCutSeq(sessionId, id)
      // 顺带解析 fork 会带进子会话的残留排队项 id（见 snapshots.ts
      // scanStaleQueueItemIds 的窗口说明）：Client 在 fork 出子会话后按 id 直删，
      // 否则输入框上方会凭空多出一条被撤回消息的「排队消息」。
      const staleQueueItemIds = await snaps.resolveStaleQueueItemIds(sessionId, cutSeq)
      return { ok: true, count: result.count, cutSeq, staleQueueItemIds }
    },
```

</details>

**依据 6 · 源码核查**：[src/client/recall-node.ts:825-884](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/client/recall-node.ts#L825-L884)

真实fork/open/清队列/异步归档与失败。

<details>
<summary>查看原文（60行）</summary>

```text
        if (cutSeq !== null && sessionsSvc && typeof sessionsSvc.fork === 'function') {
          try {
            // 撤回语义是「回退」而非「复制」：新会话顶替原会话（原会话已归档），
            // 必须原样继承标题。increaseTitle 是官方侧栏「复制会话」用来区分
            // 新旧会话的，会把标题改成「xxx 2」且多次撤回时数字不断递增，故不传。
            // sessionId 在撤回按钮可见时恒有（快照仅对已知会话生成），断言收口
            const childId = await sessionsSvc.fork({ sessionId: sessionId as string, atSeq: cutSeq })
            if (childId) {
              // 打开子会话：0.1.6-alpha.2 起 ISessions 移除 open（导航归视图所有
              // 者），改走 uiWorkspace 的 openSession；0.1.2〜0.1.6-alpha.1 用
              // sessions.open——按服务能力各吃各的，均缺失则降级为「仅文件回退、
              // 视图不切换」（守卫吞掉，无报错）
              if (uiWorkspaceSvc && typeof uiWorkspaceSvc.openSession === 'function') uiWorkspaceSvc.openSession(childId)
              else if (typeof sessionsSvc.open === 'function') sessionsSvc.open(childId)
              chatReverted = true
              fillTarget = childId
              // 版本家族登记：撤回与编辑重发走同一条 fork 收尾，两个入口都要记
              // （翻页器按家族根聚合，这里只给父子对，聚合在 version-tree 内做）
              recordVersion(String(sessionId || ''), childId)
              // 子会话从 seed 继承了一份「被撤回消息的 inbox 入队记录」，不清理
              // 就会在输入框上方显示成一条排队消息（Host 已解析出它对应的
              // item id 集合）
              removeStaleQueueItems(childId, res.staleQueueItemIds)
              // F1：上报撤回链（childId ↔ parentId），Host 持久化供版本家族展示；
              // 上报失败不阻断撤回主流程（家族是纯增量 UI）。
              api<unknown>('lineage-record', { childId, parentId: sessionId }).catch(() => {}) // 静默（纯增量 UI，见上）
              // 回退前的原会话归档（可关）：只是从列表隐藏、可恢复
              if (pluginConfig.archiveOriginal && workspacesSvc && typeof workspacesSvc.archiveSession === 'function') {
                archiveRequested = true
                // stopActivity：官方归档前经 `workspace/session-activity` 瀑布问「这会话还有
                // 什么在跑」（agent 回合 / jobs 后台作业 / subagent / schedule），有就抛
                // workspace/session-active 拒归档。之前不传该选项、又把 reject 吞掉，于是
                // 「有后台作业在跑时撤回」的原会话静默不归档、作业继续跑，作业结算
                // （cause:'kill'，不属被抑制的 teardown）还会被 jobs 工具当完成通知投递，
                // 把原会话唤醒开新一轮——文件已回滚，等于幽灵执行。撤回语义是这一版作废，
                // 故显式要求先停掉原会话活动再归档（官方 UI「停止并归档」同款选项；
                // 旧版服务无此参数时多传一个实参在 JS 侧无害）。
                workspacesSvc.archiveSession(sessionId as string, { stopActivity: true }).catch((error) => {
                  // 仍不阻断撤回主流程（fork 与回填已完成），但不再静默：归档失败意味着
                  // 原会话留在列表且可能继续跑，属用户可见降级，warn（恒输出）留痕便于排查
                  recallNodeLog.warn('archive original session failed:', error)
                })
              }
            } else {
              chatError = t('recall.chat.noChild')
              // 终态上报（issue #19）：fork 返空与抛错同语义——文件已回退但
              // 对话未回退，发 failed(fork) 而非 complete（下游若按 complete
              // 清记忆会把「对话还在」的回合误清，规格 §一决策表）
              api('notify', buildRecallNotify(notifyBase, { outcome: 'fork-failed', cutSeq, error: chatError })).catch(() => {})
            }
          } catch (error) {
            // fork 失败只降级为「仅文件回退」（chatError 进结果面板，见上方注释）
            chatError = String(error)
            // 终态上报：fork 抛错 → failed(fork)，理由同上（防下游误清记忆）
            api('notify', buildRecallNotify(notifyBase, { outcome: 'fork-failed', cutSeq, error: chatError })).catch(() => {})
          }
        }
        setHasSnapshot(false)
        if (isEdit) {
          // 编辑收尾：只有真的 fork 出新会话才回填并发送——fork 失败时原会话
```

</details>

**依据 7 · 源码核查**：[src/client/recall-node.ts:886-910](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/client/recall-node.ts#L886-L910)

编辑仅fork后发、普通回填与缺file提示。

<details>
<summary>查看原文（25行）</summary>

```text
          if (chatReverted) {
            fillDraft(fillTarget as string, editText === null ? '' : editText, attachmentFiles, {
              submit: pluginConfig.editSubmitsImmediately,
            })
            // 收尾同时摘补丁、还原座位与用户原有草稿：会话已切到子会话，
            // 父会话的输入面必须回到正常状态
            closeEdit()
          } else {
            setEdit({ stage: 'error', text: editText === null ? '' : editText, attachments: attachmentRefs.length, message: chatError || t('edit.forkFailed') })
          }
        } else {
          // 把被撤回的消息文本回填到输入框（可在设置页关闭）
          // fillTarget 只在撤回链路上赋值（fork 出的 childId 或原 sessionId），
          // 断言收口——撤回执行必有会话上下文
          if (pluginConfig.refillDraft) {
            fillDraft(fillTarget as string, text, attachmentFiles)
            // 文件附件（非图片）没有回读通道：官方 session.attachment 只认图片引用
            // （Host 侧 referencedImage + readImage，file 块直接判 ATTACHMENT_NOT_
            // REFERENCED），插件侧读不到字节就必然填不回输入框。文本与图片照常
            // 回填，这里只把「少了什么」讲清楚，免得用户以为回填是完整的。
            if (fileBlocks.length > 0) showThrottledToast(t('toast.fileAttachRefill'))
          }
          // 注：快照 tag 在 Host 侧有意保留（幂等回退），刷新页面后该消息的
          // 撤回按钮会重新出现——这是「可再次回退到同一点」的特性而非 bug。
          setRecall({ stage: 'done', count: typeof res.count === 'number' ? res.count : changes.length, chatReverted, chatError, scope: activeScope })
```

</details>

**依据 8 · 源码核查**：[src/client/draft-fill.ts:53-100](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/client/draft-fill.ts#L53-L100)

真实setDraft与附件完成后submit门槛。

<details>
<summary>查看原文（48行）</summary>

```text
  function fillDraft(targetSessionId: string, draftText: string, attachmentFiles: Promise<File[]> | null, opts?: { submit?: boolean }): void {
    if (!targetSessionId || (!draftText && attachmentFiles === null)) return
    let attempts = 0
    let attachStarted = false
    // 「附件链路走完」而不是「已发起」：createDrafts/addAttachments 是异步的，
    // 先 submit 再补附件会把附件留成下一轮的草稿（编辑重发的附件直接漏发）
    let attachDone = attachmentFiles === null
    let submitted = false
    let shellRef: ConversationInputShell | null = null
    const submitIfReady = () => {
      if (!opts || opts.submit !== true || submitted || !shellRef) return
      submitted = true
      submitShell(shellRef, draftText)
    }
    const attempt = () => {
      let textDone = draftText === ''
      try {
        // conversation 服务 0.1.2 才有（0.1.1-rc.2 无，ui-conversation 提供），
        // 不能进静态 inject——否则 0.1.1-rc.2 上声明缺失服务插件静默不启动。
        // 走 ctx.get 探测：guard 的 get 对缺失/未声明服务安全返回 undefined，
        // 拿不到就降级重试（0.1.1-rc.2 恒降级；0.1.2 视服务可见性而定）。
        const conversation = ctx.get<ConversationService>('conversation')
        if (conversation && conversation.input && typeof conversation.input.shell === 'function') {
          const shell = conversation.input.shell(targetSessionId)
          if (shell) {
            shellRef = shell
            if (!textDone) {
              if (shell.actions && typeof shell.actions.setDraft === 'function') {
                shell.actions.setDraft(draftText)
                textDone = true
              } else if (typeof shell.setDraft === 'function') {
                shell.setDraft(draftText)
                textDone = true
              }
            }
            if (!attachStarted && attachmentFiles !== null) {
              // 自动发送（编辑重发）时不让图片走「进输入态即后台上传」：官方 sendSession
              // 会等上传回执，而刚 fork 的子会话上传可能迟迟不结算——实测草稿留在输入框、
              // 消息不发也不报错。改传 false 让图片随 prompt 内联，发送一步到位；只有
              // 「只回填不发送」的撤回场景才值得提前上传。
              attachStarted = startAttachDrafts(conversation, shell, targetSessionId, attachmentFiles, () => {
                attachDone = true
                submitIfReady()
              }, opts === undefined || opts.submit !== true)
            }
          }
        }
      } catch (e) { /* fall through to retry */ }
```

</details>

#### 缺口

- fork/归档/附件部分失败的真实Host时序和全部版本功能降级未执行。
  **影响**：完成提示不能代全链一致/原会话已停止和全部附件可重发。
  **进一步探讨**：在可丢弃Host分别注入文件恢复失败、fork失败、archive失败/附件失败，逐阶段核状态和退路。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 救援和中断记录为什么仍不能保证完整撤销？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

安全快照失败被捕获记录但仍继续覆盖文件；此时也没有treeId能核预览变化。intentJournal写失败同样只告警、不阻断主流程；损坏/不符形状读取按无记录。它们是可用性取舍而非强持久事务保证，掉盘/断电时可能无救援锚/意图。recover若工作区已匹配目标则清记录，否则有安全tag且Agent不忙才reset安全；无tag/复位失败告警保留现场，不循环盲写。

预览/执行root队列只能互斥本插件操作，agentBusy是当刻护栏，不锁外部编辑器/远程进程。完整回退会覆盖快照后的人工变化；旧客户端只比较总数更弱，直接API不带预览字段可跳变化校验。session-only跳文件链也跳此队列，busy检查不构成事务不变量。

路由由Host connection.fetch注册POST，插件handler只解析/限body再按endpoint分派，不单独建立用户/工作区ACL。真实认证依Host，messageId查全局snapshot和传sessionId的组合不是多租户安全凭据，本次不审Host外层，不宣称匿名公网可利用。影子git可能额外保留曾经的秘密文件，后来添加exclude不等擦旧tag；read-only沙箱也不是本插件宿主恢复权限的自动安全边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/routes-core.ts:185-220](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/routes-core.ts#L185-L220)

预览可选/安全tag失败继续/意图后覆盖。

<details>
<summary>查看原文（36行）</summary>

```text
        // - 都不带（直调 API）：不校验，与 P0-3 同款可选语义。
        const previewTreeId = args && typeof args.previewTreeId === 'string' && args.previewTreeId ? args.previewTreeId : null
        if (!previewTreeId && args && typeof args.previewTotal === 'number') {
          const fresh = await snaps.diffFor(id)
          if (!fresh || fresh.total !== args.previewTotal) {
            return { ok: false, code: E.RECALL_STALE, message: '预览后项目文件发生了变化，请重新预览确认' }
          }
        }
        // 回退前自动打安全快照：回退覆盖工作区且不回写 index（旧的
        // 「当前状态」从此无任何快照可找回），用消息 ID 打 tag 会与该消息
        // 的既有快照碰撞，故用独立前缀的时间戳 tag——不进 index.json
        // （列表不展示），但孤儿重建/手动 git tag 仍能找到它，误回退后
        // 用户可让插件从该 tag 恢复，堵住唯一的不可逆操作缺口。
        // 失败时 safetyOk 置 false：后续回退若也失败将无救援点（H1），
        // 行为退化为现状（fail-loud），不更差。
        // PF-1：安全快照输出的树指纹就是「执行时刻的工作区状态」——与
        // previewTreeId 不一致 → STALE（此时安全快照已打下，isSafetySnapshotId
        // 让它不进索引，反而是额外的救援点）。安全快照失败时无指纹可比对，
        // 跳过指纹校验继续回退（不阻断主流程的既有语义）。
        const safetyId = 'pre-rollback-' + Date.now()
        let safetyOk = false
        let safetyTreeId = null
        try {
          const out = await rt.runShell(rt.scripts.snapshotScript(snap.root, store, state.gitExe || '', safetyId, cfg.baseExcludes), { timeoutMs: 600000, stdoutMaxBytes: 65536 })
          safetyOk = true
          safetyTreeId = parseTreeId(out)
        } catch (error) {
          // 安全快照失败不阻断回退本身：用户已确认覆盖，记录后照原计划执行
          rt.recordError('recall safety snapshot failed: ' + String(error))
        }
        if (previewTreeId && safetyTreeId && safetyTreeId !== previewTreeId) {
          return { ok: false, code: E.RECALL_STALE, message: '预览后项目文件发生了变化，请重新预览确认' }
        }
        // A2 针 1：安全快照后、动磁盘前落意图（回退中途断电时启动/init 的
        // recover 据此续做；写失败只告警不阻断主流程——U4 纪律）
        await intentJournal.begin(store, snap.root, { messageId: id, safetyId, safetyOk })
```

</details>

**依据 2 · 源码核查**：[src/host/intent-journal.ts:99-137](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/intent-journal.ts#L99-L137)

意图写失败不阻断及begin/advance。

<details>
<summary>查看原文（39行）</summary>

```text
      return { ok: true, intent: null }
    }
  }

  async function write(store: StoreInfo, text: string): Promise<void> {
    try {
      await deps.writeTextViaShell(intentFile(store), text)
    } catch (error) {
      // U4 纪律：写失败只告警、不阻断主流程（execute 照常回退）
      deps.recordError('recall intent journal write failed: ' + String(error))
    }
  }

  function read(store: StoreInfo): Promise<RecallIntent | null> {
    return readRaw(store).then((r) => r.intent)
  }

  async function begin(store: StoreInfo, root: string, fields: { messageId: string; safetyId: string; safetyOk: boolean }): Promise<void> {
    const intent: RecallIntent = {
      v: INTENT_VERSION,
      op: 'execute',
      messageId: fields.messageId,
      root,
      safetyId: fields.safetyId,
      safetyOk: fields.safetyOk,
      phase: 'rollback',
      time: Date.now(),
    }
    await write(store, JSON.stringify(intent))
  }

  async function advance(store: StoreInfo, phase: 'rollback' | 'rescue'): Promise<void> {
    const cur = await read(store)
    // 无记录（begin 写失败/已被清）时不凭空造记录——推进只是「改写已有意图」
    if (cur) await write(store, JSON.stringify(Object.assign({}, cur, { phase })))
  }

  function clear(store: StoreInfo): Promise<void> {
    return write(store, '')
```

</details>

**依据 3 · 源码核查**：[src/host/intent-journal.ts:142-178](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/intent-journal.ts#L142-L178)

真实恢复条件/安全失败/Agent忙/复位。

<details>
<summary>查看原文（37行）</summary>

```text
    if (handled.has(store.dir)) return false
    const got = await readRaw(store)
    if (!got.ok) return false // 读取失败：不入集，下次 init 重试
    const intent = got.intent
    if (!intent) {
      handled.add(store.dir) // 无记录：定论，本轮不再查
      return false
    }
    // 幂等判定先行（stale journal 防线）：一致 = 回退实际已完成，只清记录
    if (await deps.workspaceMatchesTag(intent.messageId)) {
      await clear(store)
      handled.add(store.dir)
      return true
    }
    // safetyOk=false 即「需救援但无救援点」（安全快照当时就失败）——保留
    // 记录 + fail-loud，等下次启动重试（不能自动 reset：没有可复位目标）
    if (!intent.safetyOk) {
      deps.recordError('recall interrupted rollback detected, no safety snapshot: ' + describeIntent(intent) + '（记录保留于 ' + intentFile(store) + '）')
      handled.add(store.dir)
      return true
    }
    // P0-1 同款护栏：agent 在跑时不动工作区；不进程内重试（延后到下次 init）
    if (deps.agentBusy(intent.root)) {
      deps.recordError('recall interrupted rollback deferred (agent busy): ' + describeIntent(intent))
      return false
    }
    const reset = await deps.resetToSafety(store, intent.safetyId, intent.root)
    if (!reset) {
      // 复位失败（tag 被手工删除 / git 环境故障）：保留记录 + fail-loud，
      // 下次启动重试；同进程不循环写工作区
      deps.recordError('recall interrupted rollback rescue failed: ' + describeIntent(intent) + '（记录保留于 ' + intentFile(store) + '）')
      handled.add(store.dir)
      return true
    }
    await clear(store)
    handled.add(store.dir)
    deps.recordError('recovered interrupted rollback: ' + describeIntent(intent) + ' — 工作区已复位到安全快照')
```

</details>

**依据 4 · 源码核查**：[src/host/queues.ts:19-52](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/queues.ts#L19-L52)

队列只插件Promise写锁。

<details>
<summary>查看原文（34行）</summary>

```text
  // key -> 该链的尾部。尾部恒为 catch 过的 promise：一次失败不能让整条链
  // 停在拒绝状态，后续任务只依赖排队关系、不依赖前一个任务的结果。
  const tails = new Map<string, Promise<void>>()

  const keyOf = (root: string | null | undefined): string => {
    const k = String(root == null ? '' : root)
    return k !== '' && isWin ? k.toLowerCase() : k
  }

  function tailFor(key: string): Promise<void> {
    return tails.get(key) || Promise.resolve()
  }

  function enqueueFor<T>(root: string | null | undefined, task: () => Promise<T>): Promise<T> {
    const key = keyOf(root)
    const run = tailFor(key).then(task)
    tails.set(key, run.catch(() => {}) as Promise<void>)
    return run
  }

  // 跨工作区操作（全量删除 / 全局 gc）：等这些 root 的链尾全部落地再执行，
  // 并把同一条链尾写回每个 key——与 per-root 任务互斥，又不阻塞无关 root。
  // 空集合退化为单条全局链（'' key），对应「没有 root 可用」的场景。
  function enqueueMany<T>(roots: Array<string | null | undefined>, task: () => Promise<T>): Promise<T> {
    const keys = Array.from(new Set(roots.map(keyOf)))
    if (keys.length === 0) keys.push('')
    const run = Promise.all(keys.map(tailFor)).then(task)
    const tail = run.catch(() => {}) as Promise<void>
    for (const key of keys) tails.set(key, tail)
    return run
  }

  return { enqueueFor, enqueueMany }
}
```

</details>

**依据 5 · 源码核查**：[src/host/index.ts:398-436](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/index.ts#L398-L436)

handler解析与connection注册无自有用户ACL。

<details>
<summary>查看原文（39行）</summary>

```text
  // 端点分发：connection 的载体无关 exact 路由（web 与桌面端共用同一份注册）。
  // web 端由 client-connection 把 /api 前缀挂到 webServer 之下，桌面端由
  // dsh-desktop-host 用 createSharedFetchHandler('/api') 直接分发——客户端的
  // 请求路径 /api/recall/<name> 与方法 POST 在两种环境完全一致。
  const handleRecall = async (request: Request): Promise<Response> => {
    const name = new URL(request.url).pathname.replace(/^\/api\/recall\/?/, '').split('/')[0] ?? ''
    const endpoint = (endpoints as Record<string, (args: unknown) => Promise<unknown>>)[name]
    if (!endpoint) {
      // exact 路由未命中时宿主直接 404；本分支只在 pathname 形态异常时兜底
      return jsonResponse({ ok: false, code: E.RECALL_UNKNOWN_ENDPOINT, message: 'unknown endpoint: ' + name })
    }
    try {
      const text = await request.text()
      if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) throw new Error(E.RECALL_BODY_TOO_LARGE)
      const args = text.trim() ? JSON.parse(text) : {}
      return jsonResponse(await endpoint(args))
    } catch (error) {
      // 端点抛错统一转错误响应体（errBody 归一 code/message，不落诊断）
      return jsonResponse(errBody(error))
    }
  }

  // connection 可选注入：register 的注册本体挂在 connection 插件 fiber 上
  // （实现里 owner = this.ctx，不是调用者），返回值必须用 effect 包裹——否则
  // HMR 重载会撞「exact Fetch route ... is already registered」；disposer 是
  // 异步的，cordis 的 effect cleanup 会等待它完成。
  ctx.inject(['connection'], (connectionCtx) => {
    for (const name of Object.keys(endpoints)) {
      connectionCtx.effect(() => connectionCtx.connection.fetch.register({
        path: '/api/recall/' + name,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: handleRecall,
      }))
    }
  })

  // 快照事件与启动预热仅在受支持平台注册（见上方 supported 短路说明）
  if (!supported) return
```

</details>

**依据 6 · 作者声明**：[README.md:193-195](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L193-L195)

作者新增排除不抹旧快照。

````text
  ```

  对所有项目生效（home 不可写而降级到项目内存储时，该工作区有独立的排除配置，设置页会分卡片列出）。新增排除只影响之后的快照；**回退到更早的快照时，当时尚未排除的文件仍会被恢复**（回到当时的状态，这正是回退语义）。想彻底清掉已进快照的目录，可手动删除 home 下 `dsh-recall-snapshots/` 里对应项目的哈希目录。
````

#### 缺口

- 外层Host身份/真实并发/掉盘断电恢复、秘密对象物理清理和全部路径防护未全审。
  **影响**：不当跨租户撤销服务/秘密擦除/外部副作用回滚。
  **进一步探讨**：单可信操作者、独立备份；故障集核缺安全tag/写journal失败/外部编辑，未知停止自动回退。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样受限采用，保留与退出要花什么？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

首次需受支持Host服务/客户端、git和相应shell/命令工具，选择小而无秘密的项目，先独立备份。存储默认home解析，home不可建则fallback到工作区.dsh-recall-snapshots，设置/排除/格式迁移和版本依赖要核实际路径，不能凭项目git未变判断无新秘密副本。快照关闭只冻结新建，已有仍可回退；messageOnly适合不想付文件快照成本，但也不提供文件恢复。

持续开销为每用户消息扫描/索引/对象、GC磁盘/CPU和归档历史，人力是确认预览、查排除/附件和各阶段结果，模型/机器金额、磁盘增长及总节时未知。维护按上限/时间删tag再改索引，可丢最旧撤回点，git对象不是永远的备份；归档与彻底删会话不同，具体清理策略需按真实留存需求配置。

推荐在fixture造一轮文本文件/图片与会话修改，确认preview范围，停Agent与外部写后撤回，再分别核文件字节、项目自身git、child原点/归档和草稿。第一次用户消息或缺快照只选可支持范围，不为了按钮出现调大所有限制。出现partial、fork/归档失败或未知作业效果就停，先从原会话/独立备份核查；退出先冻结新增，保留影子仓库和日志供恢复，确认不再需要才按归属清理，回原生fork+人工版本控制。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/store.ts:715-744](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/store.ts#L715-L744)

真实home失败fallback工作区。

<details>
<summary>查看原文（30行）</summary>

```text
  async function resolveStore(root: string): Promise<StoreInfo> {
    const cached = state.stores.get(root)
    if (cached) return cached
    let homeDir: string | null = null
    try {
      homeDir = await homeDirFor(root)
    } catch (error) {
      // 解析失败按「无 home」处理：直接走项目内降级 store（功能优先）
      homeDir = null
    }
    if (homeDir) {
      try {
        await runShell(scripts.mkdirScript(homeDir), { stdoutMaxBytes: 4096 })
        const store = makeStore(homeDir, true)
        state.stores.set(root, store)
        persistRootHint(store, root)
        return store
      } catch (error) {
        // 已 recordError 告警，落回项目内降级 store 继续（见函数头注释）
        recordError('recall home store unavailable, falling back to workspace: ' + String(error))
      }
    }
    const fallback = root + SEP + '.dsh-recall-snapshots'
    await runShell(scripts.mkdirScript(fallback), { stdoutMaxBytes: 4096 })
    const store = makeStore(fallback, false)
    state.stores.set(root, store)
    persistRootHint(store, root)
    return store
  }

```

</details>

**依据 2 · 作者声明**：[README.md:155-167](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L155-L167)

作者配置和已存快照/仅消息边界。

<details>
<summary>查看原文（13行）</summary>

```text
| `gcSnaps` | 50 | 每积累多少条快照触发一次 `git gc`（env `DSH_RECALL_GC_SNAPS` 可强制覆盖） |
| `gcHours` | 24 | 距上次 gc 超过多少小时触发（与条数先到先触发；env `DSH_RECALL_GC_HOURS`） |
| `maxFileBytes` | 8388608（8MB） | 超过该大小的文件不进快照、不被回退触碰；在 `git add` 之前就按清单剔除，不写对象（旧 git 退回「先加后剔」） |
| `maxWorkspaceBytes` | 268435456（256MB） | 单工作区可纳入快照的文件总量上限，口径与 `git add` 一致（`.gitignore`、`.git/info/exclude`、全局 excludesFile 都算数）。超过时**停用该工作区快照**（不截断——截断快照回退时会误删未纳入的文件），并在最近消息上提示；调大该值或补充排除表后自动恢复；0 = 不限制 |
| `scanBudgetMs` | 10000（10 秒） | 快照前统计纳入总量的时间预算。超过时停用本次快照并提示（防病态大目录拖死启动）；0 = 不限制 |
| `snapshotBudgetMs` | 180000（3 分钟） | 单次快照从扫描到写入的总时限，超时即中止本次快照并记入「最近错误」；0 = 不限制 |
| `maxSnapshotsPerWorkspace` | 500 | 每个工作区保留的最大快照数，超限自动删除最旧的；0 = 不限制 |
| `retentionDays` | 0 | 按天数保留快照，超期自动删除；0 = 不启用（与条数上限各自独立生效） |
| `baseExcludes` | `.git`、`node_modules/`、`.dsh-recall-snapshots/`、`dsh-recall-snapshots/`、`target/`、`dist/`、`build/`、`out/`、`coverage/`、`.next/`、`.nuxt/`、`.output/`、`.cache/`、`.gradle/`、`*.exe`、`*.dll`、`*.pdb`、`*.so`、`*.dylib`、`*.msi`、`*.zip`、`*.7z`、`*.rar`、`*.tar`、`*.tar.gz`、`*.iso` | 基础排除表（gitignore 语法，优先级低于 exclude.txt）；被排除的大目录整棵子树不进快照扫描。其中「目录形态」项（如 `target/`）另有一层含义：**工作区根自身的路径段命中时，该工作区不启用快照**——在构建产物目录里开会话时排除表本来就管不到它自己（模式是相对该 root 的），这类目录也没有回退价值；删掉对应项即恢复 |
| `refillDraft` | true | 撤回后把被撤回的消息（文本与附件）回填到输入框 |
| `snapshotEnabled` | true | 快照总开关（关闭只冻结新建，已有快照仍可撤回） |
| `messageOnly` | false | 只回退消息：每条用户消息仍登记撤回记录（按钮与对话回退照常），但不写文件快照——适合 gitignore 过滤后仍上 GB 的超大工作区。按消息生效：开启前的旧快照仍可完整回退文件；这类条目在快照管理里标「仅消息」，删除后不可从 tag 恢复 |
| `archiveOriginal` | true | 撤回后归档原会话（关闭后原会话保留在会话列表中） |
```

</details>

**依据 3 · 源码核查**：[src/host/maintenance.ts:209-254](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/maintenance.ts#L209-L254)

实际删除tag/索引及保留天数。

<details>
<summary>查看原文（46行）</summary>

```text
      try {
        for (let i = 0; i < victims.length; i += 100) {
          await rt.runShell(S.purgeTagsScript(store, state.gitExe, victims.slice(i, i + 100).map((v) => 'snap-' + v.id)), { timeoutMs: 120000, stdoutMaxBytes: 4096 })
        }
        for (const v of victims) state.snapshots.delete(v.id)
        await snaps.saveIndex(root, null)
        dropped += victims.length
        console.error('recall enforceLimits dropped ' + victims.length + ' oldest snapshots for: ' + root + ' (max ' + config.maxSnapshotsPerWorkspace + ')')
      } catch (error) {
        // 已告警；单 root 失败继续下一个
        rt.recordError('recall enforceLimits failed for ' + root + ': ' + String(error))
      }
    }
    return dropped
  }

  // 按时间保留（S2-3）：对每个 root 清掉早于保留窗口的快照。结构与
  // enforceLimits 同款（tag 分块删除 + saveIndex + 留痕），与条数上限
  // 各自独立触发，在同一轮 gc 周期里先后执行。时间维度的删除同样
  // 静默丢历史撤回点，故 console.error 留痕与 enforceLimits 一致。
  async function enforceRetention(): Promise<number> {
    const victimsMap = selectExpiredVictims(state.snapshots, config.retentionDays, Date.now())
    if (!victimsMap.size) return 0
    let dropped = 0
    for (const [root, victims] of victimsMap) {
      let store: StoreInfo | null = state.stores.get(root) || null
      if (!store) {
        // 现场解析失败按无 store 跳过该 root（与 enforceLimits 同款理由）
        try { store = await rt.resolveStore(root) } catch (error) { store = null }
      }
      if (!store || !state.gitExe) continue
      // A3：格式守卫——拒写态下不删 tag（同 purgeSession 的理由）
      if (!(await snaps.guardStoreFormat(store))) continue
      try {
        for (let i = 0; i < victims.length; i += 100) {
          await rt.runShell(S.purgeTagsScript(store, state.gitExe, victims.slice(i, i + 100).map((v) => 'snap-' + v.id)), { timeoutMs: 120000, stdoutMaxBytes: 4096 })
        }
        for (const v of victims) state.snapshots.delete(v.id)
        await snaps.saveIndex(root, null)
        dropped += victims.length
        console.error('recall enforceRetention dropped ' + victims.length + ' expired snapshots for: ' + root + ' (retention ' + config.retentionDays + 'd)')
      } catch (error) {
        // 已告警；单 root 失败继续下一个
        rt.recordError('recall enforceRetention failed for ' + root + ': ' + String(error))
      }
    }
```

</details>

**依据 4 · 作者声明**：[README.md:133-135](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L133-L135)

作者卸载后保留快照。

````text
  ```

  快照数据保留在 home 下 `dsh-recall-snapshots/`，想彻底清除手动删掉该目录即可。
````

**依据 5 · 作者声明**：[README.md:338-340](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/README.md#L338-L340)

MIT许可。

```text
## License

MIT
```

#### 缺口

- 实际磁盘增长、跨平台恢复、留存删除和操作者净返工成本未测。
  **影响**：受限试用不等值得所有项目常驻，费用未知不算零。
  **进一步探讨**：小项目/慢盘/排除大文件分别记录扫描/恢复/人审/磁盘；无益或范围难核就回原生方法。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何把可撤回范围变成可核保证？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可检验方向是把当前安全tag/意图/文件恢复/fork/归档/草稿作为分阶段结果，提供“恢复锚必须持久成功才允许完整覆盖”的严格档，以及明确纳入文件与外部副作用清单。基线是安全tag/journal可失败继续和客户端fork/归档部分完成；增量是让人选择可用性或可恢复性，并不假装跨服务事务或重造git。

最小实验在同一fixture/Host对照现版与严格档，注入安全tag失败、journal掉盘、恢复中断、fork/归档失败和消息后外部编辑；指标是无恢复锚覆盖次数、错误“全完成”、丢人工编辑、恢复时间/额外等待和人审负担。还应记录user/message与首写时序，若没有提交前屏障就把快照时点标“异步捕获”而不说严格之前。

若用户只需会话编辑，messageOnly/原生fork已足够，无需付每消息文件快照；若严格档频繁阻塞且独立备份更易懂，应停止扩大。方向未实现，未计现有贡献/经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/routes-core.ts:204-225](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/routes-core.ts#L204-L225)

安全tag失败仍覆盖的基线。

<details>
<summary>查看原文（22行）</summary>

```text
        const safetyId = 'pre-rollback-' + Date.now()
        let safetyOk = false
        let safetyTreeId = null
        try {
          const out = await rt.runShell(rt.scripts.snapshotScript(snap.root, store, state.gitExe || '', safetyId, cfg.baseExcludes), { timeoutMs: 600000, stdoutMaxBytes: 65536 })
          safetyOk = true
          safetyTreeId = parseTreeId(out)
        } catch (error) {
          // 安全快照失败不阻断回退本身：用户已确认覆盖，记录后照原计划执行
          rt.recordError('recall safety snapshot failed: ' + String(error))
        }
        if (previewTreeId && safetyTreeId && safetyTreeId !== previewTreeId) {
          return { ok: false, code: E.RECALL_STALE, message: '预览后项目文件发生了变化，请重新预览确认' }
        }
        // A2 针 1：安全快照后、动磁盘前落意图（回退中途断电时启动/init 的
        // recover 据此续做；写失败只告警不阻断主流程——U4 纪律）
        await intentJournal.begin(store, snap.root, { messageId: id, safetyId, safetyOk })
        const rolled = await snaps.rollbackFor(id)
        if (rolled.ok) {
          // A2 针 2：回退成功清记录（残留会被下次启动误判为中断，见 recover）
          await intentJournal.clear(store)
          return rolled
```

</details>

**依据 2 · 源码核查**：[src/host/intent-journal.ts:99-137](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/intent-journal.ts#L99-L137)

非强制journal基线。

<details>
<summary>查看原文（39行）</summary>

```text
      return { ok: true, intent: null }
    }
  }

  async function write(store: StoreInfo, text: string): Promise<void> {
    try {
      await deps.writeTextViaShell(intentFile(store), text)
    } catch (error) {
      // U4 纪律：写失败只告警、不阻断主流程（execute 照常回退）
      deps.recordError('recall intent journal write failed: ' + String(error))
    }
  }

  function read(store: StoreInfo): Promise<RecallIntent | null> {
    return readRaw(store).then((r) => r.intent)
  }

  async function begin(store: StoreInfo, root: string, fields: { messageId: string; safetyId: string; safetyOk: boolean }): Promise<void> {
    const intent: RecallIntent = {
      v: INTENT_VERSION,
      op: 'execute',
      messageId: fields.messageId,
      root,
      safetyId: fields.safetyId,
      safetyOk: fields.safetyOk,
      phase: 'rollback',
      time: Date.now(),
    }
    await write(store, JSON.stringify(intent))
  }

  async function advance(store: StoreInfo, phase: 'rollback' | 'rescue'): Promise<void> {
    const cur = await read(store)
    // 无记录（begin 写失败/已被清）时不凭空造记录——推进只是「改写已有意图」
    if (cur) await write(store, JSON.stringify(Object.assign({}, cur, { phase })))
  }

  function clear(store: StoreInfo): Promise<void> {
    return write(store, '')
```

</details>

**依据 3 · 源码核查**：[src/client/recall-node.ts:825-884](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/client/recall-node.ts#L825-L884)

后半链部分完成基线。

<details>
<summary>查看原文（60行）</summary>

```text
        if (cutSeq !== null && sessionsSvc && typeof sessionsSvc.fork === 'function') {
          try {
            // 撤回语义是「回退」而非「复制」：新会话顶替原会话（原会话已归档），
            // 必须原样继承标题。increaseTitle 是官方侧栏「复制会话」用来区分
            // 新旧会话的，会把标题改成「xxx 2」且多次撤回时数字不断递增，故不传。
            // sessionId 在撤回按钮可见时恒有（快照仅对已知会话生成），断言收口
            const childId = await sessionsSvc.fork({ sessionId: sessionId as string, atSeq: cutSeq })
            if (childId) {
              // 打开子会话：0.1.6-alpha.2 起 ISessions 移除 open（导航归视图所有
              // 者），改走 uiWorkspace 的 openSession；0.1.2〜0.1.6-alpha.1 用
              // sessions.open——按服务能力各吃各的，均缺失则降级为「仅文件回退、
              // 视图不切换」（守卫吞掉，无报错）
              if (uiWorkspaceSvc && typeof uiWorkspaceSvc.openSession === 'function') uiWorkspaceSvc.openSession(childId)
              else if (typeof sessionsSvc.open === 'function') sessionsSvc.open(childId)
              chatReverted = true
              fillTarget = childId
              // 版本家族登记：撤回与编辑重发走同一条 fork 收尾，两个入口都要记
              // （翻页器按家族根聚合，这里只给父子对，聚合在 version-tree 内做）
              recordVersion(String(sessionId || ''), childId)
              // 子会话从 seed 继承了一份「被撤回消息的 inbox 入队记录」，不清理
              // 就会在输入框上方显示成一条排队消息（Host 已解析出它对应的
              // item id 集合）
              removeStaleQueueItems(childId, res.staleQueueItemIds)
              // F1：上报撤回链（childId ↔ parentId），Host 持久化供版本家族展示；
              // 上报失败不阻断撤回主流程（家族是纯增量 UI）。
              api<unknown>('lineage-record', { childId, parentId: sessionId }).catch(() => {}) // 静默（纯增量 UI，见上）
              // 回退前的原会话归档（可关）：只是从列表隐藏、可恢复
              if (pluginConfig.archiveOriginal && workspacesSvc && typeof workspacesSvc.archiveSession === 'function') {
                archiveRequested = true
                // stopActivity：官方归档前经 `workspace/session-activity` 瀑布问「这会话还有
                // 什么在跑」（agent 回合 / jobs 后台作业 / subagent / schedule），有就抛
                // workspace/session-active 拒归档。之前不传该选项、又把 reject 吞掉，于是
                // 「有后台作业在跑时撤回」的原会话静默不归档、作业继续跑，作业结算
                // （cause:'kill'，不属被抑制的 teardown）还会被 jobs 工具当完成通知投递，
                // 把原会话唤醒开新一轮——文件已回滚，等于幽灵执行。撤回语义是这一版作废，
                // 故显式要求先停掉原会话活动再归档（官方 UI「停止并归档」同款选项；
                // 旧版服务无此参数时多传一个实参在 JS 侧无害）。
                workspacesSvc.archiveSession(sessionId as string, { stopActivity: true }).catch((error) => {
                  // 仍不阻断撤回主流程（fork 与回填已完成），但不再静默：归档失败意味着
                  // 原会话留在列表且可能继续跑，属用户可见降级，warn（恒输出）留痕便于排查
                  recallNodeLog.warn('archive original session failed:', error)
                })
              }
            } else {
              chatError = t('recall.chat.noChild')
              // 终态上报（issue #19）：fork 返空与抛错同语义——文件已回退但
              // 对话未回退，发 failed(fork) 而非 complete（下游若按 complete
              // 清记忆会把「对话还在」的回合误清，规格 §一决策表）
              api('notify', buildRecallNotify(notifyBase, { outcome: 'fork-failed', cutSeq, error: chatError })).catch(() => {})
            }
          } catch (error) {
            // fork 失败只降级为「仅文件回退」（chatError 进结果面板，见上方注释）
            chatError = String(error)
            // 终态上报：fork 抛错 → failed(fork)，理由同上（防下游误清记忆）
            api('notify', buildRecallNotify(notifyBase, { outcome: 'fork-failed', cutSeq, error: chatError })).catch(() => {})
          }
        }
        setHasSnapshot(false)
        if (isEdit) {
          // 编辑收尾：只有真的 fork 出新会话才回填并发送——fork 失败时原会话
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:441-463](https://github.com/limbo947/dsh-recall-plugin/blob/df80442fbb1b598026c75b6b699f7d0ecdc2ced7/src/host/index.ts#L441-L463)

异步捕获基线。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (!event || event.type !== 'user/message') return
    const data = event.data
    if (!data || typeof data.id !== 'string' || !data.id) return
    const source = data.source
    if (!source || source.kind !== 'user') return
    if (session && session.header && session.header.origin === 'subagent') return
    const messageId = data.id
    const time = event.time
    // root 解析有缓存（首次才跑 shell）；解析失败时 key 退化为全局链——
    // 宁可串行，也不能让同一个仓库并发出两把写锁。
    void (async () => {
      const root = await rt.resolveRoot(session.id)
      // 快照总开关：cfg 按调用时读取，设置页热更即时生效。关闭时只冻结新建，
      // maybeMaintain 照常跑——已停增的存储仍需被 gc/清理治理。
      await queues.enqueueFor(root, async () => {
        if (cfg.snapshotEnabled) await snaps.captureSnapshot(session.id, messageId, time)
      })
      await queues.enqueueFor(root, () => maint.maybeMaintain(session.id))
      // PF-6：不清 items 只标 stale——列表先按旧数据应答、后台补新（见 listCache 注释）
      listCache.stale = true
    })().catch((error) => rt.recordError('recall snapshot error: ' + String(error))) // 事件触发不阻塞宿主，失败只进错误缓冲
  })
```

</details>

#### 缺口

- 严格恢复档能否降低损失且额外等待可接受未知。
  **影响**：不预支为已实现可靠撤销或已证实需求。
  **进一步探讨**：先有界故障对照与原生fork+备份基线，再决定是否值得实现。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
