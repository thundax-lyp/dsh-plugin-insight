# dsh-task-board

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board)

<!-- BEGIN META -->
[![GitHub ★ 10,117](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C117&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 119,962](https://img.shields.io/static/v1?label=npm+30d&message=119%2C962&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)
<!-- END META -->

> **功能**：为 DSH Web 提供 Host 权威任务看板，绑定真实会话执行、Cron 调度和可选 goal 验收。

> **亮点**：将任务委派、Host持久execution/session与可选completion程序验收连起来，关闭浏览器不依赖前端tick，用户可回查来源而非只看列，见 [Q02](#research-q02)/[Q04](#research-q04)。

> **主要限制**：确认stamp和本机访问非可信人批/租户保证；普通turn/手工Done与enforced不同，裁判pass非事实真相；手工settle仅关账本、历史不可读failed也可能目标已完成，见 [Q03](#research-q03)至 [Q05](#research-q05)。

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
  - [Q01 · 这是执行插件还是普通列看板，和同仓组件如何区分？](#detail-section-11)
  - [Q02 · run如何保存、创建/复用会话并得到结果？](#detail-section-12)
  - [Q03 · 谁可以运行与提权，HTTP和Agent tools的授权边界是什么？](#detail-section-13)
  - [Q04 · goal验收何时真正门禁，是否验证了业务事实？](#detail-section-14)
  - [Q05 · cron、取消/卸载、重启和写失败会怎样？](#detail-section-15)
  - [Q06 · 怎样小试而不让调度和验收费用失控？](#detail-section-16)
  - [Q07 · 可迁移价值与新方向是什么，如何推翻？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能审查巡检/编码结果的DSH维护者，用临时workspace单卡核执行与来源，再决定开调度/验收，见 [Q01](#research-q01)。

手工看板、直接DSH会话与外部cron。插件连接任务声明/会话/验收历史，但普通轮与手工列仍不等实际合格。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 卡片/手工列 | 组织声明 | Done可无Host执行 |
| 会话执行 | workspace/preset/权限绑定 | prompt入队非完成 |
| goal验收 | enforce完成门禁 | opt-in/模型判断非事实证明 |
| cron | Host未来触发 | missed不补跑/Host在线 |
| 提权闸 | resolved binding+stamp | GUI流程非可信签名 |
| 预算/电源 | 拒新run/可选idle保护 | token非money/非唤醒 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失/边界 |
| --- | --- | --- |
| DSH>=0.2.2-rc.1/React成品 | 原生Host/Web | 声明不等运行验收 |
| gateway/workspace/preset/commands | 会话/pin/goal | 无workspace不落Host cwd |
| Host权限与本机可信路由 | 动作/提权流程 | cookie有fallback分支，非租户隔离 |
| 模型/可选judge与goal | 真实执行/验收 | 配置冻结，goal不可用可普通turn |
| 可写ledger/会话日志 | 结果历史 | 不等外部效果共同事务 |
| 持续Host/平台电源能力 | cron/可选idle保护 | missed不补跑/不能唤醒 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 临时workspace/单卡read-only | 无附件/子树/远程/复用 |
| 首跑 | 关cron/goal/验收/电源保护 | 核execution/session/原结果 |
| 第二步 | 独立开goal+验收 | 核enforced/pass与真产物 |
| 异常 | failed/pending先查目标与session | 未停勿rerun |
| 退出 | 关规则/停真实会话后卸载 | 保存ledger/日志/产物 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 边界 |
| --- | --- | --- | --- |
| 首次 | Host/模型/可写ledger | 绑定workspace/权限/准则 | 未测时长 |
| 持续 | 执行/goal/多轮judge/存储 | 查来源/裁判误判/插件兼容 | token cap非现金硬cap |
| 失败 | 已飞模型与外部影响 | 查真实目标/unknown/写盘 | 账本cancelled非停止 |
| 退出 | 卡片/会话/产物保留 | 停规则和真实工作/清理 | 卸载不撤副作用 |

#### 效果

| 项目 | 当前支持 | 未确认 |
| --- | --- | --- |
| 委派 | ledger→真实session/prompt | 实际任务成功率 |
| 验收 | enforced completion必须pass | 模型判分事实准确 |
| 调度 | Host cron未来arm/skip | 离线/休眠及时执行 |
| 来源 | 手工/外部/普通/enforced可区分 | 用户是否误信失败重跑 |
| 成本控制 | 已测日token拒新run | cash/在飞强停/净省时 |

> **思考**：确认stamp和本机访问非可信人批/租户保证；普通turn/手工Done与enforced不同，裁判pass非事实真相；手工settle仅关账本、历史不可读failed也可能目标已完成，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将任务委派、Host持久execution/session与可选completion程序验收连起来，关闭浏览器不依赖前端tick，用户可回查来源而非只看列，见 [Q02](#research-q02)/[Q04](#research-q04)。

execution预绑定/请求fingerprint、冻结验收合约、多类异常和真实ledger fsync明确；范围是Host状态流程非跨目标事务，取消/观察失败/内存持久需精确解释，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

确认stamp和本机访问非可信人批/租户保证；普通turn/手工Done与enforced不同，裁判pass非事实真相；手工settle仅关账本、历史不可读failed也可能目标已完成，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

临时workspace单张只读卡先关自动面跑一次，再独立核goal裁判；任何观测失败/状态未知先查真实session和目标再处理，不自动rerun，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定原生子包0.4.15/source。定向核Host ledger/action、真实session启动/prompt/inspect、权限/HTTP、goal gate到真实裁判请求/判定、cron/卸载/持久失败；未运行或全审UI、所有import/extension/子树/team/GitHub/附件/上游Host权限和恢复。

- 已检查：作者 README、包清单、源码路径 packages/dsh-task-board/package.json、packages/dsh-task-board/src/core/handover.ts、packages/dsh-task-board/src/core/spend-budget.ts、packages/dsh-task-board/src/core/use-cases/task-update.ts、packages/dsh-task-board/src/core/verification.ts、packages/dsh-task-board/src/host-ledger.ts、packages/dsh-task-board/src/host-routes.ts、packages/dsh-task-board/src/host-runner.ts、packages/dsh-task-board/src/host-service.ts、packages/dsh-task-board/src/host/agent-tools.ts、packages/dsh-task-board/src/host/llm-dispatch.ts、packages/dsh-task-board/src/host/verification-gate.ts、packages/dsh-task-board/src/host/verification-runner.ts、packages/dsh-task-board/src/index.ts 及固定范围 inventory；组件：packages/dsh-task-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：子包package/index注册；action→ledger run/requestcache/permission/commit；runner workspace/preset/create/reuse/pin/prompt/goal/inspect；HTTP多分支trust；verification gate/runner/prepared dispatch/pass算法；cron/不可读轮询/卸载和manual settle。未执行/全Web UI/所有import/extension/子树继承与dispatcher/team/GitHub/attachment/上游Host权限/锁迁移/真实调度和裁判准确率。
- 下一步：- 下一步单卡read-only脱敏任务，核session与execution/普通结果，再独立核goal+验收。
- 手工settle、历史不可读和磁盘失败只副本，逐项查真实session/目标后决定重试。
- 未运行Host/模型/裁判/cron，unknown呈现与维护收益尚未验证。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.15（[固定提交 1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为连续历史不可读的观测失败提供需核目标的unknown呈现，对照现有已说明未知的error文字，误重跑不降或增加悬挂负担即否定，见 [Q07](#research-q07)。

- 下一步单卡read-only脱敏任务，核session与execution/普通结果，再独立核goal+验收。
- 手工settle、历史不可读和磁盘失败只副本，逐项查真实session/目标后决定重试。
- 未运行Host/模型/裁判/cron，unknown呈现与维护收益尚未验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 541 | — | — | 31924 |
| .ts | source | 76 | 23450 | 14187 | 7984 | — |
| .tsx | source | 24 | 7546 | 5842 | 1426 | — |
| .ts | test | 87 | 25113 | 18105 | 4347 | — |
| .tsx | test | 32 | 8491 | 6067 | 1413 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核卡片/权限到Host execution/session、结算/goal验收、cron与持久失败闭环，区分声明、执行和事实验证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是执行插件还是普通列看板，和同仓组件如何区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定0.4.15 @linxin666/dsh-client-ui-task-board为原生Host/Web bundle，声明DSH>=0.2.2-rc.1 peer，实际Host负责ledger/actions/cron/session runner/goal gate，Web为异步视图；不是只有前端localStorage拖拽，也不是同仓remote-web-ui/plugin-manager/GitHub/team扩展都被本项验收。面向能检查结果的DSH维护者，把巡检/编码任务做成有工作区/preset/permission/模型绑定的卡，关闭浏览器后Host仍负责启动/结算（Host停机另论）。

基线是手工看板加直接发会话prompt/外部cron：本项把声明、执行记录和可选模型验收放一条可回查流程，仍由用户判断实际外部结果。Agent tools也能建/改/运行卡，运行不是无副作用的规划，会消费模型并使用Host所赋工具权限。子任务树会强制dispatcher preset，非每子任务都在此Host立即平行创建会话；该preset与team/GitHub扩展实现未全审，首次只单卡。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/package.json:1-43](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/package.json#L1-L43)

版本/Host-Web/bundle与声明下限。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-task-board",
  "description": "Host-authoritative task board for the DSH Web GUI with real session execution, Host cron scheduling, and optional cross-platform idle-sleep protection; mounted without DSH source changes.",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/package.json:54-62](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/package.json#L54-L62)

peer DSH与React要求。

```text
    "react": "^18.2.0"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.19.0",
    "marked": "^18.0.14"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.1.0",
    "@deepseek-ai/dsh-agent": "^0.2.2-rc.1",
```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/index.ts:53-60](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L53-L60)

Host必需服务与作者能力/限制声明。

```text

/** Default environment variable holding the authenticated proxy token. */
export const DEFAULT_PROXY_TOKEN_ENV = 'DSH_TASK_BOARD_PROXY_TOKEN'

export const inject = ['systemPrompt', 'typertGateway', 'workspaceRegistry', 'webServer', 'agents', 'commands']

/** Model-facing announcement: plugin presence, capabilities, and limits. */
export const TASK_BOARD_GUIDANCE = '本机已安装 dsh-task-board 插件（DSH Web GUI 的任务看板）：侧边栏「任务看板」入口；在 dsh-web 插件全家桶仓库（packages/dsh-task-board）统一维护，经聚合包 web-ui-all 一键安装。能力：多列看板管理任务；Host 权威账本；关闭浏览器后仍由 Host 执行和结算；任务可钉住工作区、agent 预设和权限；任务可建子任务（深度上限可配 1..3，默认 1 层，子任务不能再带子任务），执行父任务会并发执行其子任务树，子任务可单独覆盖权限与模型；另注册 task_board_* agent 工具（list/get/create/update/set_parent/run/manage/schedule），任何会话都可直接读写看板、子任务与定时计划，但运行任务会真实执行并消耗额度，高于会话默认权限的绑定仍必须由用户在 GUI 人工确认（工具刻意不提供确认能力）；支持 Host 本地时区的 5 段 cron，错过的触发点不补跑；可选且默认关闭的空闲系统睡眠保护允许屏幕熄灭，但不承诺拦截合盖、手动睡眠、休眠、关机或唤醒已睡眠机器。执行消耗 API 额度。用户提到「任务看板 / 看板 / 定时任务」时即指本插件，请据此协作。若你同时用 todo_write 维护会话顶部的可见计划列表，最终回复前必须再次调用 todo_write 收尾：没有剩余工作时不要保留 in_progress，已完成的最后一步要标为 completed。'
```

**依据 4 · 源码核查**：[packages/dsh-task-board/src/index.ts:780-790](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L780-L790)

真实Agent tools注册。

<details>
<summary>查看原文（11行）</summary>

```text
      disposeTools?.()
      disposeTools = undefined
      return
    }
    host.extensions.setToolRegistry(() => resolveToolRegistry(ctx))
    if (disposeTools !== undefined) return
    const registry = resolveToolRegistry(ctx)
    if (registry === undefined) return
    const disposers = buildTaskBoardTools(host).map(tool => registry.register(tool))
    disposeTools = () => {
      for (const dispose of disposers.splice(0)) dispose()
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/index.ts:847-867](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L847-L867)

真实goal hook和HTTP路由注册。

<details>
<summary>查看原文（21行）</summary>

```text
      const offGate = ctx.on('tools/pre-execute', async (exec, next) => {
        const decision = await gate({ name: exec.name, arguments: exec.arguments, agent: exec.agent, signal: exec.signal })
        return decision ?? next()
      })
      if (typeof offGate === 'function') disposers.push(offGate)
      else if (typeof (offGate as { dispose?: unknown } | undefined)?.dispose === 'function') {
        const handle = offGate as { dispose(): void }
        disposers.push(() => { handle.dispose() })
      }
      const routes = makeTaskBoardRoutes(host, {
        ...resolveProxyAccess(config),
        connection: () => resolveConnectionTrust(ctx),
      }, {
        attachments: () => resolveAttachmentStore(ctx),
        parseTask: async (request, signal) => {
          const llm = resolveLlmRuntime(ctx)
          if (llm === undefined) throw new TaskParseError('no-model', 'this deployment serves no llm service')
          return await parseTaskDraft(llm, request, signal)
        },
      })
      for (const route of routes) disposers.push(ctx.webServer.register(route))
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:766-788](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L766-L788)

未完成子任务时强制dispatcher模式。

<details>
<summary>查看原文（23行）</summary>

```text
    let attached: string | undefined
    try {
      // One run opens ONE session: the card's own. Its unfinished subtasks are
      // dispatched from inside that session, so a card that carries them is
      // forced under the dispatcher preset and told which cards to pick up. The
      // force is applied here, per execution; the card's stored `mode` is
      // never rewritten by it.
      const forcedPreset = this.ledger.hasOutstandingDescendants(opened.task.id) ? LIANGSHEN_PRESET_ID : undefined
      const descendants = forcedPreset === undefined ? [] : this.ledger.outstandingDescendants(opened.task.id)
      // The rework this execution carries, when it carries one: it decides both
      // the session this run continues in and the section the prompt states.
      const rework = opened.execution.rework
      // A forced preset is not the card's own composition, so continuing a
      // session composed from another preset would be refused anyway: mint a
      // fresh one and run the tree the way this execution requires. A rework
      // has no such freedom — its whole point is the conversation the reviewer
      // read — so it fails instead of quietly opening a new one.
      let reuseSessionId: string | undefined
      if (rework === undefined) {
        reuseSessionId = forcedPreset === undefined ? await this.reuseSessionFor(opened.task) : undefined
      } else {
        if (forcedPreset !== undefined) throw new Error(REWORK_SESSION_REASON)
        reuseSessionId = await this.reworkSessionFor(opened.task)
```

</details>

#### 缺口

- 没有真实维护者同任务需求/效率或成品兼容验收，未审所有扩展与Web细节。
  **影响**：可判断执行闭环，不把任务数量/多包目录当生产已验。
  **进一步探讨**：隔离workspace一张只读卡，对照直接会话/手工看板核调用、结果与维护步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · run如何保存、创建/复用会话并得到结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host applyBoardAction先校attachment verified路径、spend cap，再ledger.applyRequest，只有返回runs才dispatch；requestId存action fingerprint，同ID不同action拒绝，已缓存成功请求只返状态不再次dispatch，不是任意不同ID业务去重。startRun创建execution/group UUID，先更新document并commit，才交runner，因此启动前已有记录；launch失败若已有session用SessionLaunchError保留该id并settle failed，不会假装完全没开始。仅未到任何session的scheduled失败才退本次run次数，人工run/已到session不退。

runner选handover/pin或最近workspace，校workspace存在/preset可用，没workspace拒绝而不落Host cwd；reuse先报告onSession并assert preset，再pinAndPrompt，新会话真invoke session/create→rename→pinAndPrompt。onSession在prompt前attach execution，permission通过真实/permission命令且必须success；模型选择若有目录确认的思考强度失败则拒，否则可以warn回默认。session/prompt使用新requestId、queue模式和卡片内容/附件，随后可选armGoal。成功prompt只代表入队，不代表执行完成。

轮询用session/list/follow/page读执行开始后的有界历史；非completed turn/end是failed，普通completed且goal投影不可判时可fallback succeeded；enforced验收另由Q04阻截，普通轮succeeded不代表业务合格。读session列表未知/历史不可读时pending，24次连续不可读后记failed且error明确outcome无法判定；不能把这类failed误读为工作被判负。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:665-683](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L665-L683)

apply ledger后才dispatch。

<details>
<summary>查看原文（19行）</summary>

```text
   */
  private applyBoardAction(requestId: string, action: Exclude<TaskBoardAction, { kind: 'extension-action' }>, initiator?: string, attachmentVerified = false): TaskBoardSnapshot {
    // Attachments reach the ledger only through the VERIFIED action path: the
    // in-process capability face, the agent tools and the legacy import never
    // carry them, and an action that does is refused here rather than
    // committed without the storage proof.
    if (!attachmentVerified && attachmentsOfAction(action) !== undefined) {
      throw new Error('attachments must be applied through the verified attachment action route')
    }
    const before = this.statusMap()
    if (action.kind === 'run' || action.kind === 'rerun' || action.kind === 'rework') this.assertSpendCap()
    const result = this.ledger.applyRequest(requestId, this.withInheritedWorkspace(action, initiator), initiator)
    if (result.runs !== undefined) this.dispatchRuns(result.runs)
    // A committed write that can move a rule moves the nearest trigger;
    // re-arm from the ledger so a created or edited schedule fires at its own
    // instant instead of waiting out whatever target was armed before it. The
    // re-arm is derived from the ledger, so a write that moved nothing leaves
    // the pending fire exactly as it was.
    if (SCHEDULE_WRITE_ACTIONS.has(action.kind)) this.refreshSchedule()
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:702-726](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L702-L726)

请求fingerprint缓存与冲突。

<details>
<summary>查看原文（25行）</summary>

```text
  applyRequest(
    requestId: string,
    action: TaskBoardAction,
    initiator?: string,
  ): { state: LedgerState; runs?: OpenedRun[] } {
    const fingerprint = createHash('sha256').update(JSON.stringify(action)).digest('hex')
    const cached = this.requestCache.get(requestId)
    if (cached !== undefined) {
      if (cached.fingerprint !== fingerprint) throw new Error('request id was reused with a different action')
      return { state: this.state() }
    }

    // Add the fingerprint before apply(): successful actions persist it in the
    // same atomic ledger write as their state transition.
    this.requestCache.set(requestId, { fingerprint })
    while (this.requestCache.size > MAX_REQUEST_CACHE) this.requestCache.delete(this.requestCache.keys().next().value as string)
    this.syncRecentRequests()
    try {
      return this.apply(action, initiator)
    } catch (error) {
      this.requestCache.delete(requestId)
      this.syncRecentRequests()
      throw error
    }
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1420-1433](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1420-L1433)

真实execution先更新/commit后返回。

<details>
<summary>查看原文（14行）</summary>

```text
  private startRun(root: TaskRecord, now: number, initiator?: string, rerun = false, progress?: ScheduleProgress, rework?: ExecutionRework): OpenedRun[] {
    const before = this.document.tasks
    const [participant] = cascadeTargets(before, root.id)
    if (participant === undefined || participant.archivedAt !== undefined) return []
    if (hasOpenExecution(participant)) return []
    const groupId = crypto.randomUUID()
    const base = rerun ? withStatus(participant, 'todo', now) : participant
    const opened = startExecution(base, now, crypto.randomUUID(), initiator, groupId, rework)
    let tasks: readonly TaskRecord[] = before.map(task => task.id === participant.id ? opened.task : task)
    if (progress !== undefined) tasks = applyScheduleProgress(tasks, root.id, progress, now)
    this.document.tasks = [...tasks]
    this.commit()
    return [{ task: resolveExecutionTargets(opened.task, before, this.maxSubtaskDepth), execution: opened.execution }]
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:844-885](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L844-L885)

执行与session预绑定、launch异常及schedule退款边界。

<details>
<summary>查看原文（42行）</summary>

```text
      this.ledger.setVerification(opened.task.id, opened.execution.id, initial)
      const sessionId = await this.runner.launch(opened.task, {
        ...(reuseSessionId === undefined ? {} : { reuseSessionId }),
        ...(forcedPreset === undefined ? {} : { agentPreset: forcedPreset }),
        ...(promptContext === undefined ? {} : { promptContext }),
        // The frozen global switch travels with the launch, so the runner's
        // arming decision is exactly the one made above.
        goalEnabled,
        // The same catalog snapshot the acceptance contract was frozen from.
        catalog,
        // Bind the session to the execution before the prompt is queued, so the
        // completion gate can never observe the agent without its binding.
        onSession: (id) => {
          attached = id
          this.ledger.attachSession(opened.task.id, opened.execution.id, id)
        },
        onGoalArmed: (armed) => {
          this.setApplicability(opened.task.id, opened.execution.id, !contract.enabled ? skippedBy : armed ? 'enforced' : notArmed)
        },
      })
      if (attached === undefined) this.ledger.attachSession(opened.task.id, opened.execution.id, sessionId)
    } catch (error) {
      const launchedSession = error instanceof SessionLaunchError ? error.sessionId : undefined
      if (launchedSession !== undefined) {
        this.ledger.attachSession(opened.task.id, opened.execution.id, launchedSession)
      }
      // A scheduled occurrence that failed before any session existed created
      // no real execution: refund the run it consumed and record why, so a
      // failed launch can never silently spend the user's run budget. A manual
      // run, and a launch that DID reach a session, are never refunded.
      if (schedule !== undefined && attached === undefined && launchedSession === undefined) {
        this.refundUnstartedSchedule(opened.task.id)
      }
      this.settleAndNotify(opened.task.id, opened.execution.id, 'failed', error instanceof Error ? error.message : String(error))
    }
  }

  /**
   * Read the acceptance contract one run group freezes, in the order the board
   * has always read it: the acceptance settings, then the global native-/goal
   * switch, then the model catalog that both resolves the contract's route and
   * decides the reasoning effort the session may be given.
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:534-603](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L534-L603)

workspace/preset/reuse/真实create rename到prompt。

<details>
<summary>查看原文（70行）</summary>

```text
    const workspaceId = task.handover?.workspaceId ?? task.workspaceId ?? this.recentWorkspaceId()
    const mode = options.agentPreset ?? task.handover?.mode ?? task.mode
    const permission = task.handover?.permission ?? task.permission

    if (workspaceId !== undefined && this.workspaceRegistry !== undefined) {
      if (!this.workspaceRegistry.list().some(item => item.id === workspaceId)) {
        throw new Error('workspace not found: ' + workspaceId)
      }
    }
    if (mode !== undefined) {
      const presets = await this.invoke('agentPresets', 'list', {}) as { presets?: readonly { id: string; broken?: string }[] }
      const preset = presets.presets?.find(item => item.id === mode)
      // A forced preset is the run's shape, not a stored preference: a
      // deployment that does not serve it (the `liangshen` dispatcher preset is
      // shipped by packages/dsh-liangshen) cannot run this card the way its tree
      // requires, so the run fails closed with the reason readable on the card.
      if (preset === undefined && options.agentPreset !== undefined) {
        throw new Error('agent preset not found: ' + mode + ' (a card with unfinished subtasks runs under the '
          + LIANGSHEN_PRESET_ID + ' preset, which this deployment does not serve)')
      }
      if (preset === undefined) throw new Error('agent preset not found: ' + mode)
      if (preset.broken !== undefined) throw new Error('agent preset is unavailable: ' + preset.broken)
    }
    // The ledger only ever stores ids minted by this runner (or the roster),
    // so the brand is reasserted at this boundary instead of re-deriving it.
    const reused = options.reuseSessionId as ExecutionSessionId | undefined
    if (reused !== undefined) {
      try {
        // Assert the pinned preset against the one the session records before
        // prompting. The reuse path must not call `session/create` (that would
        // create or re-adopt a session the board only meant to continue), so
        // the recorded preset is read through `session/projections` — the
        // documented read that resolves NO Agent — and compared here. A card
        // whose session was composed from a different preset now fails closed
        // instead of silently running under the wrong composition, matching
        // the fresh branch's `agentPreset` assertion (issue #1708).
        // Report the session before anything is queued into it, so the board
        // can bind the execution first and a completion claim can never arrive
        // at the gate without its binding.
        options.onSession?.(reused)
        await this.assertReusedPreset(reused, mode)
        await this.pinAndPrompt(reused, task, permission, options.promptContext, options.onGoalArmed, options.goalEnabled === true, options.catalog)
      } catch (error) {
        throw new SessionLaunchError(reused, error)
      }
      return reused
    }
    // Nothing names a workspace and the deployment has none to resolve to, so
    // there is no place this run may legitimately start: `session.create` would
    // quietly land it in the Host process working directory (the desktop app's
    // profile directory). Refuse before the session exists, with the reason the
    // board settles the card with and the browser renders in the user's
    // language, so the fix (pick a workspace on the card) is what the user reads.
    if (workspaceId === undefined) throw new Error(MISSING_WORKSPACE_REASON)
    const created = await this.invoke('session', 'create', {
      workspaceId,
      ...(mode === undefined ? {} : { agentPreset: mode }),
    }) as { sessionId: ExecutionSessionId }
    const sessionId = created.sessionId
    options.onSession?.(sessionId)
    try {
      await this.invoke('session', 'rename', { sessionId, title: task.title })
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.onGoalArmed, options.goalEnabled === true, options.catalog)
    } catch (error) {
      throw new SessionLaunchError(sessionId, error)
    }
    return sessionId
  }

  /**
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:708-719](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L708-L719)

实际permission命令要求success。

<details>
<summary>查看原文（12行）</summary>

```text
    permission: TaskPermission | undefined,
    context: PromptContext = {},
    onGoalArmed?: (armed: boolean) => void,
    goalEnabled = false,
    catalog?: ModelCatalogView,
  ): Promise<void> {
    if (permission !== undefined) {
      if (this.commands === undefined) throw new Error('permission command dispatcher is unavailable')
      const command = await this.commands.execute(sessionId, '/permission ' + permission, AbortSignal.timeout(30_000))
      if (command === undefined) throw new Error('permission command was not acknowledged')
      if (command.kind !== 'success') throw new Error(command.text ?? 'permission command failed')
    }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:766-793](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L766-L793)

模型选择fallback和实际prompt/goal顺序。

<details>
<summary>查看原文（28行）</summary>

```text
        // An effort the catalog CONFIRMED for this route is a contract, not a
        // preference: if the session refuses the selection, the run fails here,
        // before the prompt, rather than silently executing at the model default
        // the user did not pick. A selection that carries no confirmed effort
        // keeps the best-effort behavior: the card was asked to run, and losing
        // the work over a model switch this run never promised is worse.
        if (decision.effort !== undefined) {
          throw new Error(`session ${sessionId} refused the model selection "${provider === undefined ? modelId : provider + '/' + modelId}" with reasoning effort "${decision.effort}": ` + (modelError instanceof Error ? modelError.message : String(modelError)))
        }
        console.warn(`[dsh-task-board] failed to select model "${provider === undefined ? modelId : provider + '/' + modelId}" for session ${sessionId}, falling back to default:`, modelError)
      }
    }
    // The attachments are resolved AFTER the preflight and BEFORE the prompt:
    // an image becomes an image part of the prompt (after the text part), and
    // a file becomes a readable path in a preamble section of its own.
    const resolved = await this.resolveAttachments(attachments)
    const promptContext: PromptContext = resolved.files.length === 0 ? context : { ...context, files: resolved.files }
    await this.invoke('session', 'prompt', {
      sessionId,
      requestId: 'task-board-' + crypto.randomUUID(),
      mode: 'queue' as const,
      content: [
        { type: 'text' as const, text: promptText(task, promptContext) },
        ...resolved.images,
      ],
    })
    const armed = await this.armGoal(sessionId, task, promptContext, goalEnabled)
    onGoalArmed?.(armed)
```

</details>

**依据 8 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:964-1003](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L964-L1003)

list未知/会话缺失与follow失败。

<details>
<summary>查看原文（40行）</summary>

```text
        response = await this.invoke('session', 'list', {}) as SessionListValue
      } catch (error) {
        if (isInvocationUnavailable(error)) {
          if (!this.unsupportedSessionListWarned) {
            this.unsupportedSessionListWarned = true
            console.warn('[dsh-task-board] DSH runtime session endpoint unavailable (requires DSH >= 0.1.2-alpha.2); task board roster auto-discovery is disabled', error)
          }
          return { outcome: 'pending' }
        }
        if (isDefinitionWithdrawn(error)) {
          console.warn('[dsh-task-board] the host gateway withdrew the session/list definition for this DSH cohort; keeping the outcome pending', error)
          return { outcome: 'pending' }
        }
        console.warn('[dsh-task-board] session/list failed during execution inspection; keeping the outcome pending', error)
        return { outcome: 'pending' }
      }
      items = response.items
    }
    const summary = items.find(item => item.sessionId === sessionId)
    if (summary === undefined) {
      this.scanMemos.delete(sessionId)
      return { outcome: 'cancelled', error: 'execution session no longer exists' }
    }
    if (summary.running && options.whileRunning !== true) return { outcome: 'pending' }

    let opening: { cursor: number; records: readonly SessionHistoryRecord[]; hasMore: boolean }
    try {
      const stream = await this.stream('session', 'follow', { address: sessionAddress(sessionId), maxMessages: 1 })
      const iterator = stream[Symbol.asyncIterator]()
      const next = await iterator.next()
      if (typeof iterator.return === 'function') await iterator.return()
      const follow = next.done === true ? undefined : next.value as { type?: string; cursor?: number; records?: readonly SessionHistoryRecord[]; hasMore?: boolean }
      if (follow === undefined || follow.type !== 'snapshot' || typeof follow.cursor !== 'number' || follow.records === undefined || typeof follow.hasMore !== 'boolean') {
        return { outcome: 'pending', unreadable: true, reason: 'session/follow returned no opening frame' }
      }
      opening = { cursor: follow.cursor, records: follow.records, hasMore: follow.hasMore }
    } catch (error) {
      console.warn('[dsh-task-board] session/follow failed during execution inspection; keeping the outcome pending', error)
      return { outcome: 'pending', unreadable: true, reason: 'session/follow failed: ' + failureText(error) }
    }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:1060-1074](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L1060-L1074)

普通completed fallback与非completed失败。

<details>
<summary>查看原文（15行）</summary>

```text
    // reader can recover them once the session is gone. A run with no assistant
    // prose carries no field at all, so settling stays a decision about the
    // verdict alone.
    const closing = executionSummaryOf(events.map(entry => entry.event), startedAt)
    const carried = closing === undefined ? {} : { summary: closing }
    const reason = nonCompletedTurnEnd(turnEnd.event.data)
    if (reason === undefined) return { ...(await this.goalVerdict(sessionId) ?? { outcome: 'succeeded' as const }), ...carried }
    // `error` keeps its historical wording; every other non-completed reason
    // (aborted / blocked / max-tokens / interrupted) now reports instead of
    // silently counting as success.
    return reason === 'error'
      ? { outcome: 'failed', error: 'agent turn ended with an error', ...carried }
      : { outcome: 'failed', error: 'agent turn ended without completing: ' + reason, ...carried }
  }
}
```

</details>

**依据 10 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1197-1213](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L1197-L1213)

连续不可读最终unknown原因但结果failed。

<details>
<summary>查看原文（17行）</summary>

```text
  private noteUnreadableInspection(execution: OpenExecutionReference, reason: string | undefined): void {
    const polls = (this.unreadablePolls.get(execution.executionId) ?? 0) + 1
    this.unreadablePolls.set(execution.executionId, polls)
    const detail = reason ?? 'no reason reported'
    if (polls === 1) {
      safeConsoleError('[dsh-task-board] execution session ' + (execution.sessionId ?? 'unknown')
        + ' history is unreadable; it stays pending for up to ' + UNREADABLE_SETTLE_POLLS + ' polls: ' + detail)
    }
    if (polls < UNREADABLE_SETTLE_POLLS) return
    this.unreadablePolls.delete(execution.executionId)
    this.settleAndNotify(
      execution.taskId,
      execution.executionId,
      'failed',
      'execution session history is unreadable (' + UNREADABLE_SETTLE_POLLS + ' consecutive polls); the outcome cannot be determined: ' + detail,
    )
  }
```

</details>

#### 缺口

- 未运行真实gateway/Host/模型、完整history分页和rework/attachments/preset。
  **影响**：入队/创建session/普通轮结束和工作合格须区分，失败可能已有外部影响。
  **进一步探讨**：临时workspace一只读卡，记录execution id/session id/请求/终态；模拟prompt失败和历史不可读，分别查实际session和目标。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 谁可以运行与提权，HTTP和Agent tools的授权边界是什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

run/rerun/rework和scheduled都检查resolved binding相对sessionDefault的permission，超过且无permissionConfirmedAt拒绝；上限/默认按Host配置，本项不能凭“只读卡”取消Host已有能力。task-update改变明确permission或handover会清stamp；子卡继承目标另有规则，本轮不全审继承所有组合。Agent tools刻意没有confirm-permission，实际注册面只提供管理/运行；但ledger该action只写timestamp，未自己验证可信人身份。它是UI工作流闸，不是不可伪造的人批签名，全部import/内部扩展及已获Host工具权限用户仍需独立信任，不断言任何模型渠道绝不能越过。

HTTP先真实guard：若可选connection.requestRejection认可立即放行；若该服务拒绝/缺失，仍可走本插件browser same-origin marker+direct loopback fallback，或显式trustForwardedProxy的loopback转发，或allowlist authority+token代理。不是所有请求必须同时具Host cookie；Origin/site/loopback与服务认证是分支。index确把动态resolveConnectionTrust传给routes。该边界主要是本机/受信反代访问，不是多人卡片owner租户隔离；直接本机程序可构造HTTP标头，GUI确认不能替代OS/Host权限。

高于默认的运行确认不是每次外部写出逐笔审批；真实session会使用所选preset/permission，需事先审工具和workspace。本轮不开放反代/远程、不提权、不导入陌生task/handover，也不接受“confirmed字段”等同用户刚批准具体命令。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1293-1310](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1293-L1310)

实际run拒绝未确认binding。

<details>
<summary>查看原文（18行）</summary>

```text
      case 'rerun':
      case 'run': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task?.archivedAt !== undefined) throw new Error('archived task is read-only')
        if (task === undefined || hasOpenExecution(task)) throw new Error('task is already running or missing')
        // A rework asks for a second attempt at work this card's own conversation
        // already holds; the ledger alone decides whether that conversation
        // exists, so the run can never be opened with instructions no session
        // ever saw.
        const rework = action.kind === 'rework' ? this.reworkInput(task, action.instructions) : undefined
        // The confirmation gate judges the RESOLVED binding: a subtask that
        // inherits an elevated permission from its parent is exactly as
        // unconfirmed as the parent would be without its own stamp.
        const refusal = this.bindingRefusal(task)
        if (refusal !== undefined) throw new Error(bindingRefusalMessage(refusal, this.sessionDefaultPermission, 'run'))
        runs = this.startRun(task, now, initiator, action.kind !== 'run', undefined, rework)
        break
      }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:753-771](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L753-L771)

scheduled未确认拒绝且不耗run数。

<details>
<summary>查看原文（19行）</summary>

```text
        endedReason: schedule.mode === 'once' ? 'fired' : 'limit',
      }, triggeredAt)
      return []
    }

    const refusal = this.bindingRefusal(task)
    if (refusal !== undefined) {
      // An unconfirmed above-default permission must never run unattended: the
      // whole tree is refused and the occurrence is skipped without consuming
      // the run budget, exactly like the already-running refusal.
      this.document.scheduler.error = `scheduled run refused for task ${taskId}: ${bindingRefusalMessage(refusal, this.sessionDefaultPermission, 'schedule')}`
      this.skipOccurrence(taskId, 'permission', triggeredAt)
      return []
    }
    if (hasOpenExecution(task)) {
      this.skipOccurrence(taskId, 'busy', triggeredAt)
      return []
    }

```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1361-1365](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1361-L1365)

resolved binding到permission gate。

```text
  private bindingRefusal(root: TaskRecord): { kind: 'root' | 'inherited'; title: string } | undefined {
    const resolved = resolveExecutionTargets(root, this.document.tasks, this.maxSubtaskDepth)
    if (!requiresPermissionConfirmation(resolved, this.sessionDefaultPermission)) return undefined
    return { kind: root.parentId === undefined ? 'root' : 'inherited', title: root.title }
  }
```

**依据 4 · 源码核查**：[packages/dsh-task-board/src/core/handover.ts:101-109](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/core/handover.ts#L101-L109)

effective permission及rank比较。

```text
/** The permission an execution session would actually run under. */
export function effectivePermission(task: Pick<TaskRecord, 'permission' | 'handover'>): TaskPermission | undefined {
  return task.handover?.permission ?? task.permission
}

/** Whether a binding's permission is elevated above the session default. */
export function exceedsSessionDefault(permission: TaskPermission | undefined, sessionDefault: TaskPermission): boolean {
  if (permission === undefined) return false
  return (PERMISSION_RANK.get(permission) ?? -1) > (PERMISSION_RANK.get(sessionDefault) ?? -1)
```

**依据 5 · 源码核查**：[packages/dsh-task-board/src/core/handover.ts:127-132](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/core/handover.ts#L127-L132)

高于默认且无stamp才需确认。

```text
export function requiresPermissionConfirmation(
  task: Pick<TaskRecord, 'permission' | 'handover' | 'permissionConfirmedAt'>,
  sessionDefault: TaskPermission = DEFAULT_SESSION_PERMISSION,
): boolean {
  return exceedsSessionDefault(effectivePermission(task), sessionDefault) && task.permissionConfirmedAt === undefined
}
```

**依据 6 · 源码核查**：[packages/dsh-task-board/src/core/use-cases/task-update.ts:126-134](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/core/use-cases/task-update.ts#L126-L134)

改permission/handover清stamp。

```text
    if ('attachments' in patch) next.attachments = attachmentsPatch == null ? undefined : normalizeAttachments(attachmentsPatch)
    // The permission confirmation binds the exact permission value: a change
    // of the pinned permission or of the handover bundle re-arms the gate
    // (blocking confirm-then-swap escalation). handover was destructured out
    // of rest above, so the stamp survives only when explicitly kept.
    if (('permission' in patch && patch.permission !== undefined && patch.permission !== task.permission) || 'handover' in patch) {
      next.permissionConfirmedAt = undefined
    }
    // Session reuse is a boolean opt-in; false (or an explicit null from a
```

**依据 7 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1263-1271](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1263-L1271)

confirm action仅写时间戳。

```text
      case 'confirm-permission': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.permissionConfirmedAt !== undefined) break
        this.document.tasks = this.document.tasks.map(item => item.id === action.taskId
          ? { ...item, permissionConfirmedAt: now, updatedAt: now }
          : item)
        break
      }
```

**依据 8 · 源码核查**：[packages/dsh-task-board/src/host/agent-tools.ts:1-14](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/agent-tools.ts#L1-L14)

Agent tools明确不提供确认动作。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Agent tools for the task board: the DSH-native counterpart of the board UI.
 *
 * Every tool drives the same Host ledger the browser drives, so a task created
 * in the GUI is immediately operable from any session and vice versa. Domain
 * refusals come back as ok:false values the model can react to; the Host
 * ledger stays the only authority, so every gate the UI honors still holds
 * here (fail-closed pins, the permission confirmation gate, the subtask depth
 * limit, the running-task locks).
 *
 * Deliberately absent: confirm-permission. That gate exists so a HUMAN lifts an
 * above-default permission binding; a tool that could stamp it would make the
 * gate decorative. An agent that hits it must ask the user to confirm in the
 * board UI.
```

</details>

**依据 9 · 源码核查**：[packages/dsh-task-board/src/host-routes.ts:226-247](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-routes.ts#L226-L247)

实际多分支信任判定。

<details>
<summary>查看原文（22行）</summary>

```text
 */
export function isTrustedTaskBoardRequest(req: IncomingMessage, access: ResolvedRouteAccess): boolean {
  const connection = access.connection?.()
  if (connection !== undefined && connection.requestRejection(req) === undefined) return true
  if (!browserSameOriginMarker(req)) return false
  if (isLoopbackRequest(req)) return true
  // The tunnel makes the socket and the Host describe the proxy, so the
  // origin-equality check of the direct fence has nothing to compare on this
  // path; the explicit cross-site marker is then the one signal that separates
  // the operator's own page from a third-party page posting through the tunnel,
  // and it is refused instead of being read as a mere tripwire.
  if (access.trustForwardedProxy()
    && req.headers['sec-fetch-site'] !== 'cross-site'
    && isForwardedLoopbackRequest(req)) return true
  if (!isLoopbackAddress(req.socket.remoteAddress)) return false
  const host = req.headers.host
  if (typeof host !== 'string') return false
  const parsed = parseAuthority(host)
  if (parsed === undefined || parsed.canonical !== host.toLowerCase()) return false
  if (!access.trustedProxyHosts.has(parsed.canonical) || !sameAuthority(req, parsed.url)) return false
  return matchesToken(req.headers[TASK_BOARD_PROXY_TOKEN_HEADER], access.proxyToken)
}
```

</details>

**依据 10 · 源码核查**：[packages/dsh-task-board/src/host-routes.ts:277-284](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-routes.ts#L277-L284)

真实HTTP guard拒403。

```text
  options: TaskBoardRouteOptions = {},
): WebRoute[] {
  const resolvedAccess = resolveAccess(access)
  const guard = (req: IncomingMessage, res: ServerResponse): boolean => {
    if (isTrustedTaskBoardRequest(req, resolvedAccess)) return true
    writeJson(res, 403, { ok: false, error: 'forbidden' }, { 'cache-control': 'no-store' })
    return false
  }
```

**依据 11 · 源码核查**：[packages/dsh-task-board/src/index.ts:856-860](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L856-L860)

将Host connection trust动态传入routes。

```text
      const routes = makeTaskBoardRoutes(host, {
        ...resolveProxyAccess(config),
        connection: () => resolveConnectionTrust(ctx),
      }, {
        attachments: () => resolveAttachmentStore(ctx),
```

#### 缺口

- 未全审Host认证、所有import/extension能力/子卡继承组合、用户身份与每工具权限。
  **影响**：只能确认已读闸门和本机信任分支，不能承诺多租户/不可伪造人批。
  **进一步探讨**：先固定sessionDefault/read-only和本机直连，副本测无stamp/改绑定/代理拒绝；提权前另核具体Host/工具和执行目标。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · goal验收何时真正门禁，是否验证了业务事实？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

global goal开关与卡goalRun都要true才尝试/goal，缺命令/拒绝则warn继续普通turn。每次execution冻结verification contract/route，适用状态enforced才拦；总关/卡跳过/goal没arm/teammate等不是同一种已验证成功。index真挂tools/pre-execute，gate仅看update_goal action complete、有agent且ledger.findOpenExecutionBySession(agent.id)能绑定本次execution，找不到/非enforced返回undefined；这依赖Host agent.id约定，未验任意Host适配。已有quality passedAttempt则allow；并发同execution共享inFlight，失败/异常/invalid各预算不同。

没有pass时收轨迹及可用workspace evidence，调用runAcceptance：按coding criteria×多轮交换实际轨迹与empty-work基线，judgeOnce通过真实preparedCall.stream（旧runtime fallback llm.stream）发到冻结provider/model，计usage与有界时间。程序依据分数/阈值/基线决定passed；拒绝结果再assessAcceptanceValidity核引用，passed分支直接valid=true，所以不应声称所有通过记录都已逐证据真实性验证。模型可以误判/遗漏，workspace service缺失退轨迹，本轮无独立裁判准确率。

预算不足是budget、路由等是exception、无效否决是invalid，分别持久并hold/deny，不冒充工作质量失败；质量失败次数耗尽才finalize failed。强制enforced session即使普通turn succeeded、暂停或未调用验收，也必须有本execution pass才能settle succeeded，否则failed并区分未开门/无匹配通过。手工move可在无open execution时写Done且不生成run；外部outcome可建external=true记录，来源是调用者声明，不是本裁判/Host实际执行。需要用户核产物/测试和真实副作用，不把列、模型分数或present pass当最终质量事实。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:851-877](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L851-L877)

真实双开关/goal失败普通turn。

<details>
<summary>查看原文（27行）</summary>

```text
   */
  private async armGoal(sessionId: ExecutionSessionId, task: TaskRecord, context: PromptContext, goalEnabled: boolean): Promise<boolean> {
    if (!goalEnabled) return false
    if (task.goalRun !== true) return false
    if (this.commands === undefined) {
      console.warn('[dsh-task-board] no command dispatcher is available; task ' + task.id + ' runs without /goal')
      return false
    }
    try {
      const command = await this.commands.execute(
        sessionId,
        '/goal ' + goalObjective(promptText(task, context)),
        AbortSignal.timeout(30_000),
      )
      if (command === undefined) {
        console.warn('[dsh-task-board] /goal was not acknowledged for session ' + sessionId + '; the run continues as a plain turn')
        return false
      }
      if (command.kind !== 'success') {
        console.warn('[dsh-task-board] /goal was refused for session ' + sessionId + ': ' + (command.text ?? 'no reason reported') + '; the run continues as a plain turn')
        return false
      }
      return true
    } catch (error) {
      console.warn('[dsh-task-board] could not arm /goal on session ' + sessionId + '; the run continues as a plain turn', error)
      return false
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:833-862](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L833-L862)

适用性冻结/ledger verification与onGoalArmed。

<details>
<summary>查看原文（30行）</summary>

```text
      // unavailable /goal command), and it must never read as an accepted run.
      // The reason names which switch withheld the goal: the GLOBAL master
      // switch (this board never arms /goal) is a different fact from the card's
      // own goal option staying off — which is the default, so it is what an
      // untouched card gets.
      const notArmed: ExecutionVerification['applicability'] = globalGoalEnabled ? 'goal-unavailable' : 'goal-disabled'
      const initial: ExecutionVerification = {
        contract,
        attempts: [],
        applicability: !contract.enabled ? skippedBy : notArmed,
      }
      this.ledger.setVerification(opened.task.id, opened.execution.id, initial)
      const sessionId = await this.runner.launch(opened.task, {
        ...(reuseSessionId === undefined ? {} : { reuseSessionId }),
        ...(forcedPreset === undefined ? {} : { agentPreset: forcedPreset }),
        ...(promptContext === undefined ? {} : { promptContext }),
        // The frozen global switch travels with the launch, so the runner's
        // arming decision is exactly the one made above.
        goalEnabled,
        // The same catalog snapshot the acceptance contract was frozen from.
        catalog,
        // Bind the session to the execution before the prompt is queued, so the
        // completion gate can never observe the agent without its binding.
        onSession: (id) => {
          attached = id
          this.ledger.attachSession(opened.task.id, opened.execution.id, id)
        },
        onGoalArmed: (armed) => {
          this.setApplicability(opened.task.id, opened.execution.id, !contract.enabled ? skippedBy : armed ? 'enforced' : notArmed)
        },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/index.ts:847-853](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L847-L853)

真正pre-execute hook。

```text
      const offGate = ctx.on('tools/pre-execute', async (exec, next) => {
        const decision = await gate({ name: exec.name, arguments: exec.arguments, agent: exec.agent, signal: exec.signal })
        return decision ?? next()
      })
      if (typeof offGate === 'function') disposers.push(offGate)
      else if (typeof (offGate as { dispose?: unknown } | undefined)?.dispose === 'function') {
        const handle = offGate as { dispose(): void }
```

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:391-429](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-gate.ts#L391-L429)

本execution绑定/适用/pass/预算/并发。

<details>
<summary>查看原文（39行）</summary>

```text
  /** Evaluate one tool call; undefined means "not this gate's business". */
  const evaluate = async (exec: GateExecution): Promise<PreToolDecision | undefined> => {
    const binding = (() => {
      const agent = exec.agent as { id?: unknown } | undefined
      const sessionId = agent?.id === undefined ? '' : String(agent.id)
      return sessionId === '' ? undefined : deps.ledger.findOpenExecutionBySession(sessionId)
    })()
    if (binding === undefined) return undefined
    const verification = binding.execution.verification
    if (verification === undefined || verification.contract.enabled === false) return undefined
    // Only a goal run of the board's own execution is gated: a teammate
    // execution is certified through its Lead's aggregated evidence.
    if (verification.applicability !== 'enforced') return undefined
    if (passedAttempt(verification) !== undefined) return { kind: 'allow' }
    if (verification.failedReason !== undefined) {
      return deny(
        bounded('[任务看板 · goal 验收判定失败] ' + verification.failedReason + '\n本次执行已被判失败，不会再运行新的验收。请如实报告结果。'),
        'TASK_BOARD_VERIFICATION_FAILED',
        verification.failedReason,
      )
    }
    // A spent INVALID budget comes first: the judge produced no usable veto, so
    // calling it again would only burn quota against a budget that determines
    // nothing, and the card must stay open for a human rather than be failed.
    if (!hasInvalidBudget(verification)) {
      return invalidHeld(binding.task.id, binding.execution.id, verification)
    }
    if (!hasQualityBudget(verification)) {
      return finalize(binding.task.id, binding.execution.id, verification, 'goal 验收额度已耗尽，本次 execution 判失败。', exec.agent)
    }
    // A spent anomaly budget is an environment that could not answer, not a
    // judged work: the claim is refused and NO judge call is spent until a user
    // clears the recorded anomalies (issue #1828).
    if (!hasExceptionBudget(verification)) {
      return anomalyHeld(binding.task.id, binding.execution.id, verification)
    }
    const key = binding.execution.id
    const running = inFlight.get(key)
    if (running !== undefined) return await running
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:450-461](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-gate.ts#L450-L461)

限定complete及fail-closed。

<details>
<summary>查看原文（12行）</summary>

```text
  return async (exec: GateExecution): Promise<PreToolDecision | undefined> => {
    if (exec.name !== 'update_goal') return undefined
    if (actionOf(exec.arguments) !== 'complete') return undefined
    if (exec.agent === undefined) return undefined
    // A call the caller already cancelled is not a policy refusal: let the host
    // produce its own cancellation result.
    if (exec.signal.aborted) return undefined
    try {
      return await evaluate(exec)
    } catch (error) {
      deps.logger.warn('[dsh-task-board] goal acceptance gate failed; the completion claim is refused (fail closed)', error)
      return deny(
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:318-386](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-gate.ts#L318-L386)

收证据/真实acceptance、budget/exception/invalid/pass结算。

<details>
<summary>查看原文（69行）</summary>

```text
    // trajectory; an unavailable service or a failed read degrades to the
    // trajectory alone instead of failing an acceptance already under way.
    const source = deps.workspaceChanges?.()
    const workspace = source === undefined
      ? { text: '', files: 0 }
      : await renderWorkspaceEvidence(
        evidenceEvents(session, execution.startedAt),
        String((agent as { id?: unknown }).id ?? ''),
        source,
        { signal: acceptance, warn: message => { deps.logger.warn(message) } },
      )
    const result = await runAcceptance({
      llm,
      route,
      evidence,
      threshold: verification.contract.threshold,
      index: qualityAttempts(verification).length + 1,
      context: workspace.text === '' ? undefined : workspace.text,
      workspaceFiles: workspace.files,
      signal: acceptance,
      deadline,
      callTimeoutMs: callTimeout,
      now,
    })
    const attempt = result.attempt
    const attempts = [...verification.attempts, attempt]
    const spend: ExecutionVerification = { ...verification, attempts, inFlight: undefined }
    // A budget stop is charged to no budget at all (issue #1828): the judge route
    // may be healthy and the machine simply out of time, so it is neither an
    // anomaly nor a verdict, and it must never close the card.
    if (attempt.stage === 'budget') {
      return hold(
        task.id,
        execution.id,
        spend,
        '[任务看板 · 验收未完成] ' + (attempt.error ?? '时间预算耗尽') + '\n本次没有产生任何质量判定，也不消耗质量或异常额度。请稍后重试；若裁判路由确实很慢，可调大验收的单次调用上限或总时间预算。',
        attempt.error ?? 'the acceptance time budget ran out before a verdict',
        'TASK_BOARD_VERIFICATION_BUDGET',
      )
    }
    if (attempt.stage === 'exception') {
      if (exceptionAttempts(spend).length >= MAX_EXCEPTION_ATTEMPTS) {
        return anomalyHeld(task.id, execution.id, spend)
      }
      write(task.id, execution.id, spend)
      return anomalyRefusal(spend, attempt.error)
    }
    // An invalid acceptance is recorded and returned to the agent, but it is
    // NOT a quality verdict: it spends its own bounded budget, never the
    // quality one, and it never fails the card.
    if (attempt.stage === 'invalid') {
      if (invalidAttempts(spend).length >= MAX_INVALID_ATTEMPTS) {
        return invalidHeld(task.id, execution.id, spend)
      }
      write(task.id, execution.id, spend)
      return invalidRefusal(spend, attempt)
    }
    if (attempt.passed) {
      write(task.id, execution.id, spend)
      return { kind: 'allow' }
    }
    const used = qualityAttempts(spend).length
    if (used >= MAX_QUALITY_ATTEMPTS) {
      return finalize(task.id, execution.id, spend, finalFailureReason(attempt, used, verification.contract.threshold), agent)
    }
    write(task.id, execution.id, spend)
    return deny(
      bounded(qualityFeedback(attempt, MAX_QUALITY_ATTEMPTS - used)),
      'TASK_BOARD_VERIFICATION_FAILED',
```

</details>

**依据 7 · 源码核查**：[packages/dsh-task-board/src/host/verification-runner.ts:385-430](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-runner.ts#L385-L430)

真实judge模型请求、timeout与usage。

<details>
<summary>查看原文（46行）</summary>

```text
async function judgeOnce(
  llm: LlmRuntime,
  route: VerificationRoute,
  prompt: string,
  signal: AbortSignal,
  budget: AcceptanceBudget,
): Promise<{ text: string; usage: VerificationUsage }> {
  const usage = emptyUsage()
  let lastError: unknown
  /** The outer abort is the acceptance budget running out, not a cancellation. */
  const stopped = (): VerificationError => budget.now() >= budget.deadline
    ? new VerificationError('budget', 'the acceptance budget ran out before the judge answered', usage)
    : new VerificationError('aborted', 'the acceptance was cancelled', usage)
  for (let attempt = 0; attempt < VERIFICATION_REQUEST_ATTEMPTS; attempt++) {
    if (signal.aborted) throw stopped()
    if (budget.deadline - budget.now() <= budget.callTimeoutMs) {
      throw new VerificationError('budget', 'the acceptance budget cannot fit another judge call', usage)
    }
    const timeout = new AbortController()
    const timer = setTimeout(() => { timeout.abort(new Error('task-board verification: the judge request timed out')) }, budget.callTimeoutMs)
    const forward = (): void => { timeout.abort(signal.reason) }
    signal.addEventListener('abort', forward, { once: true })
    try {
      // The judge dispatches through the registration-bound prepared call, the
      // same path the official agent loop uses: the public `stream()` is a
      // mutable instance property a third-party plugin may replace, and a
      // replacement with the `llm/stream` listener signature broke every
      // acceptance with "next(...) is not a function or its return value is not
      // async iterable".
      const stream = await openOneShotStream(
        llm,
        {
          provider: route.provider,
          model: route.model,
          ...(route.reasoningEffort === undefined ? {} : { reasoningEffort: route.reasoningEffort }),
          temperature: VERIFICATION_TEMPERATURE,
          maxTokens: VERIFICATION_MAX_TOKENS,
        },
        {
          messages: [createUserMessage({ content: [{ type: 'text' as const, text: prompt }], source: { kind: 'user' as const } })],
          signal: timeout.signal,
        },
      )
      let text = ''
      usage.calls += 1
      let finishReason: FinishReason | undefined
```

</details>

**依据 8 · 源码核查**：[packages/dsh-task-board/src/host/llm-dispatch.ts:69-87](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/llm-dispatch.ts#L69-L87)

preparedCall.stream真调度和fallback。

<details>
<summary>查看原文（19行）</summary>

```text
export async function openOneShotStream(
  llm: LlmRuntime,
  config: OneShotCallConfig,
  request: OneShotRequest,
): Promise<AsyncIterable<StreamChunk>> {
  const call: LlmCallConfig = {
    provider: config.provider,
    model: config.model,
    ...(config.reasoningEffort === undefined ? {} : { reasoningEffort: ReasoningEffortId(config.reasoningEffort) }),
    ...(config.temperature === undefined ? {} : { temperature: config.temperature }),
    ...(config.maxTokens === undefined ? {} : { maxTokens: config.maxTokens }),
  }
  const runtime = llm as PreparedRuntime
  if (typeof runtime.prepareCall !== 'function') {
    return llm.stream({ ...call, ...request } as GenerateOptions)
  }
  const prepared = await runtime.prepareCall(call, request.signal)
  return prepared.stream({ ...prepared.config, ...request })
}
```

</details>

**依据 9 · 源码核查**：[packages/dsh-task-board/src/host/verification-runner.ts:545-561](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-runner.ts#L545-L561)

多criteria、多轮对empty-work基线。

<details>
<summary>查看原文（17行）</summary>

```text
  try {
    const perCriterion = new Map<string, { criterion: VerificationCriterion; work: number[]; baseline: number[] }>()
    for (const criterion of CODING_CRITERIA) perCriterion.set(criterion.id, { criterion, work: [], baseline: [] })
    for (const criterion of CODING_CRITERIA) {
      for (let repeat = 0; repeat < VERIFICATION_ROUNDS; repeat++) {
        const swapped = repeat % 2 === 1
        const candidateA = swapped ? EMPTY_WORK_BASELINE : input.evidence.trace
        const candidateB = swapped ? input.evidence.trace : EMPTY_WORK_BASELINE
        const prompt = buildAcceptancePrompt(input.evidence.problem, candidateA, candidateB, criterion, undefined, input.context, workSlotOfRound(repeat))
        const answer = await judgeOnce(input.llm, input.route, prompt, input.signal, budget)
        const scoreA = extractScore(answer.text, 'score_A')
        const scoreB = extractScore(answer.text, 'score_B')
        if (answer.usage.usageIncomplete === true) usage.usageIncomplete = true
        usage.calls += answer.usage.calls
        usage.inputTokens += answer.usage.inputTokens
        usage.outputTokens += answer.usage.outputTokens
        usage.reasoningTokens += answer.usage.reasoningTokens
```

</details>

**依据 10 · 源码核查**：[packages/dsh-task-board/src/host/verification-runner.ts:590-626](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-runner.ts#L590-L626)

passed与只对否决校有效性。

<details>
<summary>查看原文（37行）</summary>

```text
      const score = average(bucket.work)
      const baseline = average(bucket.baseline)
      return { id: criterion.id, name: criterion.name, score, baseline, threshold: input.threshold, passed: score >= input.threshold }
    })
    const score = average(criteria.map(criterion => criterion.score))
    const baseline = average(criteria.map(criterion => criterion.baseline))
    const passed = acceptancePassed(score, baseline, criteria, input.threshold)
    // A veto is only bookable when its evidence holds up; a rejecting attempt
    // that cannot substantiate the rejection is recorded as INVALID so it can
    // never consume the quality budget or fail the card.
    const validity = passed
      ? { valid: true as const }
      : assessAcceptanceValidity({
        criteria,
        findings: structured,
        evidence: evidenceText,
        omittedCharacters: input.evidence.omittedCharacters,
      })
    return {
      attempt: {
        index: input.index,
        at: startedAt,
        stage: validity.valid ? 'quality' : 'invalid',
        passed: validity.valid ? passed : false,
        score,
        baseline,
        criteria,
        findings,
        usage,
        evidence: evidenceSummary,
        route: input.route,
        channel: 'explicit-tag',
        rounds: VERIFICATION_ROUNDS,
        ...(structured.length === 0 ? {} : { criterionFindings: structured }),
        ...(validity.valid ? {} : {
          invalidReason: (validity as { reason: VerificationInvalidReason }).reason,
          error: classifyInvalid(validity as { reason: VerificationInvalidReason; detail: string }),
```

</details>

**依据 11 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1063-1089](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L1063-L1089)

enforced无匹配pass不准成功。

<details>
<summary>查看原文（27行）</summary>

```text
        // Forced acceptance: the old fallback paths — a completed turn, a
        // paused goal, an unreadable projection, a manual settle — must never
        // be mistaken for a verified success. Only a matching pass record
        // settles this execution as succeeded.
        if (result.outcome === 'succeeded' && verificationRequired(verification) && passedAttempt(verification) === undefined) {
          // Two different failures share this branch, and they send the reader
          // in opposite directions: attempts on record mean the judge ran and
          // the work did not pass, while zero attempts mean the gate never
          // opened at all (issue #1837) — the session narrated completion
          // instead of calling `update_goal(action: complete)`.
          this.settleAndNotify(
            execution.taskId,
            execution.executionId,
            'failed',
            verificationNeverInvoked(verification)
              ? NEVER_INVOKED_VERIFICATION_REASON
              : verificationOnlyInvalid(verification)
                ? INVALID_ONLY_VERIFICATION_REASON
                : NO_MATCHING_PASS_VERIFICATION_REASON,
            result.summary,
          )
          continue
        }
        // The run's closing text rides whichever verdict it earned: a failed
        // execution still leaves what it managed to say.
        this.settleAndNotify(execution.taskId, execution.executionId, result.outcome, 'error' in result ? result.error : undefined, result.summary)
      } catch {
```

</details>

**依据 12 · 源码核查**：[packages/dsh-task-board/src/core/verification.ts:742-756](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/core/verification.ts#L742-L756)

pass仅quality记录与enforced定义。

<details>
<summary>查看原文（15行）</summary>

```text
export function passedAttempt(verification: ExecutionVerification | undefined): VerificationAttempt | undefined {
  return qualityAttempts(verification).find(attempt => attempt.passed)
}

/**
 * Whether the board requires a matching pass record before this execution may
 * settle as succeeded. False when acceptance was off at start, and false for a
 * run that never became a goal run or for a teammate execution — those settle
 * on their own verdict, which is why {@link ExecutionVerification.applicability}
 * is persisted rather than re-derived.
 * @param verification - the execution's persisted acceptance state.
 * @returns true when a pass record is required.
 */
export function verificationRequired(verification: ExecutionVerification | undefined): boolean {
  return verification !== undefined && verification.applicability === 'enforced'
```

</details>

**依据 13 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1152-1163](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1152-L1163)

手工move只是改列。

<details>
<summary>查看原文（12行）</summary>

```text
      case 'move': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.archivedAt !== undefined) throw new Error('archived task is read-only')
        // The lock belongs to an open execution, not to the column: a card
        // parked in 'running' by hand has no session and stays movable, while
        // a card the runner is executing cannot be moved out from under it.
        if (hasOpenExecution(task)) throw new Error('running task cannot be moved')
        if (!canMoveManually(task.status, action.status)) throw new Error('invalid manual status')
        this.document.tasks = this.document.tasks.map(item => item.id === action.taskId ? withStatus(item, action.status, now) : item)
        break
      }
```

</details>

**依据 14 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1175-1194](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1175-L1194)

external outcome另新execution来源标记。

<details>
<summary>查看原文（20行）</summary>

```text
        // The one guardrail that matters: while the Host still owns a run it is
        // the only authority on the card, so an outside agent may not write the
        // terminal verdict over it. This is also what keeps a stale report from
        // racing the session it claims to have replaced.
        if (hasOpenExecution(task)) throw new Error('running task cannot receive an external outcome')
        const execution: ExecutionRecord = {
          // A fresh id, exactly like a Host-launched run: the external work is a
          // new attempt in the history, never an overwrite of an earlier record.
          id: crypto.randomUUID(),
          sessionId: undefined,
          startedAt: now,
          endedAt: now,
          result: action.result,
          error: action.summary,
          initiatedBy: action.initiatedBy,
          external: true,
        }
        this.document.tasks = this.document.tasks.map(item => item.id !== action.taskId
          ? item
          : {
```

</details>

#### 缺口

- 未验裁判误判/完整证据收集裁剪、gate身份、所有budget/reload和显示语义。
  **影响**：门禁存在不等业务正确；普通/跳过/外部/质量失败/无法判断要分层。
  **进一步探讨**：脱敏已知合格/不合格/无产物三卡对照，核pass来源/阈值与真实结果；坏路由和无gate调用不应伪成验收通过。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · cron、取消/卸载、重启和写失败会怎样？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Host启动recoverSchedule记lastTick并skipMissed再arm最近未来触发；timer迟超过60秒视resume回恢复，错过不补跑，Host离线/合盖等不能靠浏览器或sleep保护执行。openScheduled真实拒busy/未确认/耗尽budget并记录skip，非每次trigger都会新任务。一次Host run预算不等现金预算或全部外部调度exactly-once。

手工settle把open executions写cancelled并返todo，service直接applyBoardAction路径未向Host发session interrupt；这是账本强制结算，不是停止真实会话。卸载dispose清待launch队列、poll/timer/extensions/power/ledger，已在飞launch留其完成且session可能已存在；不承诺终止所有模型/子进程。遇到cancelled/失败应先查实际session与外部目标，未停就勿rerun，防重复影响。

ledger commit写0600 pid临时文件、fsync、rename，再尽力directory fsync，失败清tmp并抛，磁盘单文件发布有机制；request fingerprint跟document一起存。startRun先改内存document再commit，applyRequest catch只清请求缓存，不能从原子磁盘写推出内存也事务回滚；写失败后执行是否重新调度/恢复需实测。启动/重启锁和整迁移/台账损坏恢复未全审，不给断电无损或跨实例安全保证。已在session与ledger之间存在副作用/状态分离，不是跨Host外部事务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1230-1288](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L1230-L1288)

skipMissed/最近timer和迟60秒恢复。

<details>
<summary>查看原文（59行）</summary>

```text
  private recoverSchedule(): void {
    if (this.disposed) return
    this.clearScheduleTimer()
    const now = this.now()
    this.ledger.setScheduler({ lastTickAt: now })
    this.ledger.skipMissed(now)
    this.armSchedule()
  }

  /**
   * Arm the native timer at the nearest armed future trigger. One timer serves
   * every schedule: the ledger's next target is the only instant the Host has
   * to wake for. A target beyond the platform's timer ceiling re-arms in
   * segments, and a target already past (the wall clock jumped, or the process
   * was suspended) is handled immediately as a recovery.
   */
  private armSchedule(): void {
    if (this.disposed || !this.active) return
    this.clearScheduleTimer()
    const target = this.ledger.nextArmedRunAt(this.now())
    if (target === undefined) return
    this.scheduleTarget = target
    const delay = Math.max(0, Math.min(target - this.now(), MAX_TIMER_DELAY_MS))
    this.scheduleTimer = this.timers.timeout(() => {
      this.scheduleTimer = undefined
      this.onScheduleFire(target)
    }, delay)
  }

  /**
   * One armed target became due. A fire landing well past its target is a
   * resume (suspend, throttle, forward clock jump) rather than a normal
   * occurrence, so it takes the recovery path instead of launching a run for a
   * long-stale instant.
   */
  private onScheduleFire(target: number): void {
    if (this.disposed || !this.active) return
    const now = this.now()
    this.scheduleTarget = undefined
    this.ledger.setScheduler({ lastTickAt: now })
    if (now - target > RECOVERY_TOLERANCE_MS) {
      this.recoverSchedule()
      return
    }
    const before = this.statusMap()
    for (const schedule of this.ledger.dueSchedules(now)) {
      // The ledger owns both the budget gate and the next target: it refuses a
      // rule that already spent its runs and stops a one-shot as it fires.
      this.dispatchRuns(
        this.ledger.openScheduled(schedule.taskId, now),
        {
          triggeredAt: now,
          timeZone: schedule.timeZone,
          mode: schedule.mode,
          ...(schedule.cron === undefined ? {} : { cron: schedule.cron }),
        },
      )
    }
    this.emitStatusChanges(before)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:33-49](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L33-L49)

resume阈值和不可读轮询上限。

<details>
<summary>查看原文（17行）</summary>

```text
 * than a normal occurrence. The schedule timer is armed AT the next due
 * instant, so landing this far past its target means the Host was suspended,
 * the process throttled, or the wall clock jumped forward — the same condition
 * the old fixed 30 s heartbeat detected through its own gap threshold.
 */
const RECOVERY_TOLERANCE_MS = 60_000
/** Largest delay a Node timer represents without clamping; longer targets re-arm in segments. */
const MAX_TIMER_DELAY_MS = 2_147_483_647
/**
 * Consecutive polls that may report one execution's session history as
 * unreadable before it is reported failed. The roster poll runs every 5 s, so
 * this is two minutes of a session that is NOT running: no turn is executing
 * there and its history cannot be read, which means no verdict will ever
 * arrive. Reporting that as a failure keeps a card — and every ancestor of it —
 * out of the running column, which nothing else can rescue.
 */
const UNREADABLE_SETTLE_POLLS = 24
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:741-779](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L741-L779)

调度预算/permission/busy/spend拒绝。

<details>
<summary>查看原文（39行）</summary>

```text
  openScheduled(taskId: string, triggeredAt: number): OpenedRun[] {
    const task = this.document.tasks.find(item => item.id === taskId)
    if (task === undefined || task.archivedAt !== undefined) return []
    const schedule = task.schedule
    if (schedule === undefined || !schedule.enabled) return []

    // A rule that has spent its budget never opens another run. The stop is
    // recorded here rather than trusted to the firing timer, so a rule that
    // was hand-edited into an exhausted state still terminates visibly.
    if (scheduleExhausted(schedule)) {
      this.progressSchedule(taskId, {
        consumed: 0,
        endedReason: schedule.mode === 'once' ? 'fired' : 'limit',
      }, triggeredAt)
      return []
    }

    const refusal = this.bindingRefusal(task)
    if (refusal !== undefined) {
      // An unconfirmed above-default permission must never run unattended: the
      // whole tree is refused and the occurrence is skipped without consuming
      // the run budget, exactly like the already-running refusal.
      this.document.scheduler.error = `scheduled run refused for task ${taskId}: ${bindingRefusalMessage(refusal, this.sessionDefaultPermission, 'schedule')}`
      this.skipOccurrence(taskId, 'permission', triggeredAt)
      return []
    }
    if (hasOpenExecution(task)) {
      this.skipOccurrence(taskId, 'busy', triggeredAt)
      return []
    }

    const spendRefusal = this.spendRefusal(triggeredAt)
    if (spendRefusal !== undefined) {
      // A scheduled occurrence has no client to throw at, so the refusal lands
      // on the board's own scheduler error and the occurrence is skipped without
      // consuming the rule's run budget: raising the cap, or the day rolling
      // over, admits the next trigger instead of leaving a spent rule behind.
      this.document.scheduler.error = `scheduled run refused for task ${taskId}: ${spendRefusal}`
      this.skipOccurrence(taskId, 'limit', triggeredAt)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1202-1228](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1202-L1228)

强制settle只关ledger execution。

<details>
<summary>查看原文（27行）</summary>

```text
      case 'settle': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.archivedAt !== undefined) throw new Error('archived task is read-only')
        if (!task.executions.some(entry => entry.endedAt === undefined)) throw new Error('task has no open execution')
        // Force-close the executions this card governs. The verdict is
        // 'cancelled', never 'succeeded': a card whose execution produced no
        // evidence of a completed turn must not be recorded as finished work,
        // and a cancelled settlement returns the card to the todo column so the
        // operator can run it again. Nothing else clears a running card: move,
        // archive and delete all refuse one, which is what made a stuck card
        // unrecoverable from the board.
        const reason = 'execution closed manually by '
          + (initiator === undefined || initiator === '' ? 'the operator' : initiator)
          + ': no verdict was recorded'
        for (const member of subtreeTasks(this.document.tasks, action.taskId, this.maxSubtaskDepth)) {
          for (const execution of member.executions) {
            if (execution.endedAt !== undefined) continue
            this.document.tasks = this.document.tasks.map(item => item.id !== member.id
              ? item
              : settleExecution(item, execution.id, 'cancelled', now, reason))
          }
        }
        // Fold whatever became ready in the same action: an ancestor whose last
        // member this closed leaves the running column with it.
        this.finalizeReadyRuns(false)
        break
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:665-691](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L665-L691)

settle等action核心只应用台账/派发run。

<details>
<summary>查看原文（27行）</summary>

```text
   */
  private applyBoardAction(requestId: string, action: Exclude<TaskBoardAction, { kind: 'extension-action' }>, initiator?: string, attachmentVerified = false): TaskBoardSnapshot {
    // Attachments reach the ledger only through the VERIFIED action path: the
    // in-process capability face, the agent tools and the legacy import never
    // carry them, and an action that does is refused here rather than
    // committed without the storage proof.
    if (!attachmentVerified && attachmentsOfAction(action) !== undefined) {
      throw new Error('attachments must be applied through the verified attachment action route')
    }
    const before = this.statusMap()
    if (action.kind === 'run' || action.kind === 'rerun' || action.kind === 'rework') this.assertSpendCap()
    const result = this.ledger.applyRequest(requestId, this.withInheritedWorkspace(action, initiator), initiator)
    if (result.runs !== undefined) this.dispatchRuns(result.runs)
    // A committed write that can move a rule moves the nearest trigger;
    // re-arm from the ledger so a created or edited schedule fires at its own
    // instant instead of waiting out whatever target was armed before it. The
    // re-arm is derived from the ledger, so a write that moved nothing leaves
    // the pending fire exactly as it was.
    if (SCHEDULE_WRITE_ACTIONS.has(action.kind)) this.refreshSchedule()
    this.emitStatusChanges(before, initiator)
    if (action.kind === 'delete') this.extensions.emitTaskDeleted({ taskId: action.taskId })
    return {
      schemaVersion: TASK_BOARD_SCHEMA_VERSION,
      revision: result.state.revision,
      tasks: result.state.tasks,
      scheduler: result.state.scheduler,
      power: this.power.snapshot(),
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:744-761](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L744-L761)

卸载待launch与在飞/调度清理。

<details>
<summary>查看原文（18行）</summary>

```text
  dispose(): void {
    this.disposed = true
    // Launches still waiting for a slot can never start now: settle them so
    // their cards leave the running column here, instead of waiting for the
    // next Host start's interrupted-start recovery. Launches already in flight
    // are left to finish — their session may already exist.
    const abandoned = this.launches.drain()
    if (abandoned.length > 0) {
      safeConsoleError(`[dsh-task-board] ${abandoned.length} run member(s) were still waiting for a launch slot when the Host stopped; each is settled as cancelled`)
    }
    this.extensions.dispose()
    this.clearScheduleTimer()
    this.clearPollBackoff()
    this.pollTimer?.()
    this.pollTimer = undefined
    this.power.dispose()
    this.ledger.dispose()
    this.listeners.clear()
```

</details>

**依据 7 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1852-1877](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1852-L1877)

真实temp/fsync/rename与失败清理。

<details>
<summary>查看原文（26行）</summary>

```text
  private commit(bumpRevision = true): void {
    if (bumpRevision) this.document.revision += 1
    mkdirSync(dirname(this.file), { recursive: true })
    const tmp = `${this.file}.tmp-${process.pid}`
    let fd: number | undefined
    try {
      fd = openSync(tmp, 'w', 0o600)
      writeFileSync(fd, JSON.stringify(this.document, null, 2), { encoding: 'utf8' })
      fsyncSync(fd)
      closeSync(fd)
      fd = undefined
      try { chmodSync(tmp, 0o600) } catch { /* Windows ACLs own access */ }
      renameSync(tmp, this.file)
      try {
        const dirFd = openSync(dirname(this.file), 'r')
        try { fsyncSync(dirFd) } finally { closeSync(dirFd) }
      } catch {
        // Windows does not permit fsync on a directory handle; rename remains atomic.
      }
    } catch (error) {
      if (fd !== undefined) closeSync(fd)
      try { unlinkSync(tmp) } catch { /* best-effort temporary cleanup */ }
      throw error
    }
    this.notify()
  }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1420-1433](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1420-L1433)

先改内存再commit。

<details>
<summary>查看原文（14行）</summary>

```text
  private startRun(root: TaskRecord, now: number, initiator?: string, rerun = false, progress?: ScheduleProgress, rework?: ExecutionRework): OpenedRun[] {
    const before = this.document.tasks
    const [participant] = cascadeTargets(before, root.id)
    if (participant === undefined || participant.archivedAt !== undefined) return []
    if (hasOpenExecution(participant)) return []
    const groupId = crypto.randomUUID()
    const base = rerun ? withStatus(participant, 'todo', now) : participant
    const opened = startExecution(base, now, crypto.randomUUID(), initiator, groupId, rework)
    let tasks: readonly TaskRecord[] = before.map(task => task.id === participant.id ? opened.task : task)
    if (progress !== undefined) tasks = applyScheduleProgress(tasks, root.id, progress, now)
    this.document.tasks = [...tasks]
    this.commit()
    return [{ task: resolveExecutionTargets(opened.task, before, this.maxSubtaskDepth), execution: opened.execution }]
  }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:702-726](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L702-L726)

apply失败只清requestCache并重抛。

<details>
<summary>查看原文（25行）</summary>

```text
  applyRequest(
    requestId: string,
    action: TaskBoardAction,
    initiator?: string,
  ): { state: LedgerState; runs?: OpenedRun[] } {
    const fingerprint = createHash('sha256').update(JSON.stringify(action)).digest('hex')
    const cached = this.requestCache.get(requestId)
    if (cached !== undefined) {
      if (cached.fingerprint !== fingerprint) throw new Error('request id was reused with a different action')
      return { state: this.state() }
    }

    // Add the fingerprint before apply(): successful actions persist it in the
    // same atomic ledger write as their state transition.
    this.requestCache.set(requestId, { fingerprint })
    while (this.requestCache.size > MAX_REQUEST_CACHE) this.requestCache.delete(this.requestCache.keys().next().value as string)
    this.syncRecentRequests()
    try {
      return this.apply(action, initiator)
    } catch (error) {
      this.requestCache.delete(requestId)
      this.syncRecentRequests()
      throw error
    }
  }
```

</details>

#### 缺口

- 未测cron休眠/时钟、Host interrupt/队列中断、台账写失败/锁/迁移与恢复。
  **影响**：不能将cancelled当已无外部工作，写失败也不能盲重试。
  **进一步探讨**：副本测未启动队列卸载、真实会话仍跑时settle、磁盘写失败和休眠跨cron，逐项查session/pid/ledger与目标，保留原始记录。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样小试而不让调度和验收费用失控？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

有可审查任务结果的维护者，可在独立临时workspace固定DSH0.2.2-rc.1及0.4.15成品，单卡read-only、无附件/子任务/复用/远程，关cron、goal和验收/idle-sleep保护，先让会话读脱敏小文件并答可核问题，记录execution/session/普通turn结果。再单独开启goal+验收，用明确验收准则核真实裁判记录，不能把首个普通Done当已通过。高权/远程/GitHub/team工作须另审，不作为首次采用。

首次需gateway/workspace/preset/commands/tools/模型与可写ledger，HTTP本机信任和插件配置；缺workspace拒运行。持续主任务/goal多轮、可选解析粘贴模型、judge criteria×rounds/重试以及其他Host工具都可能耗费模型，账户额度/现金未知。日预算单位token默认0关闭，assertSpendCap测量缺失也放行，只拒新run，不证明实时强停已飞任务/现金硬上限；schedule次数也不代表费用。idle睡眠保护默认false，开启不承诺合盖/唤醒。并发launch/subtree/复用/裁判应分别记usage与人工复核，不能凭集中卡片认定省钱。

失败恢复查真实session和目标后处理pending/failed/invalid/anomaly，不自动重跑未知影响；退出停规则、核实际会话停稳再卸载，保存ledger/会话和产物并按策略清理。本轮没有运行/安装/裁判/调度/成本实验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/package.json:1-43](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/package.json#L1-L43)

固定入口/Host声明。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-task-board",
  "description": "Host-authoritative task board for the DSH Web GUI with real session execution, Host cron scheduling, and optional cross-platform idle-sleep protection; mounted without DSH source changes.",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/index.ts:53-58](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L53-L58)

实际Host依赖。

```text

/** Default environment variable holding the authenticated proxy token. */
export const DEFAULT_PROXY_TOKEN_ENV = 'DSH_TASK_BOARD_PROXY_TOKEN'

export const inject = ['systemPrompt', 'typertGateway', 'workspaceRegistry', 'webServer', 'agents', 'commands']

```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/index.ts:290-294](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/index.ts#L290-L294)

enabled与idle保护默认。

```text
export const Config: z<ConfigInput, Config> = z.object({
  announceToAgent: z.boolean().default(false).volatile(),
  enabled: z.boolean().default(true).volatile(),
  preventIdleSleep: z.boolean().default(false).volatile(),
  trustedProxyHosts: z.array(z.string()).default([]),
```

**依据 4 · 源码核查**：[packages/dsh-task-board/src/core/spend-budget.ts:1-23](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/core/spend-budget.ts#L1-L23)

token单位/默认0/只比较已测用量。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * The daily token ceiling both spend gates share, as pure rules: the cap
 * comparison and the one refusal wording.
 *
 * The unit is tokens, not money. The usage ledger the board reads prices only
 * DeepSeek's own routes, so a cost cap would read 0 on every other route and
 * refuse nothing on exactly the deployments that need it. A cap of 0 is the
 * shipped default and means "no gate": both gates answer before they read a
 * file, subscribe to an event, or compute anything.
 * @module @linxin666/dsh-task-board/core/spend-budget
 */

/** Token cap one board day may spend; 0 disables the gate. */
export const DEFAULT_SPEND_BUDGET_TOKENS = 0

/**
 * Whether a day's measured spend already reached the cap.
 * @param usedTokens - tokens the day's spend measurement reported.
 * @param cap - the configured cap, 0 for "no gate".
 * @returns true when a run must be refused.
 */
export function spendCapReached(usedTokens: number, cap: number): boolean {
  return cap > 0 && usedTokens >= cap
```

</details>

**依据 5 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:698-711](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L698-L711)

测量缺失放行的真实launch gate。

<details>
<summary>查看原文（14行）</summary>

```text
   * A cap of 0 — the shipped default — answers before the measurement is read:
   * no ledger file is opened and nothing is summed, which is what keeps a board
   * that never configured a cap identical to the one before it existed.
   *
   * The refusal is a thrown message rather than a code: the wire hands its text
   * to the caller as board-refused, exactly like every other refusal this board
   * makes.
   */
  private assertSpendCap(): void {
    const cap = this.spendBudgetTokens()
    if (!(cap > 0)) return
    const used = this.spendUsedToday(this.now())
    if (used === undefined || !spendCapReached(used, cap)) return
    throw new Error(spendCapMessage(used, cap))
```

</details>

**依据 6 · 源码核查**：[packages/dsh-task-board/src/host/verification-runner.ts:545-561](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host/verification-runner.ts#L545-L561)

验收多维多轮请求。

<details>
<summary>查看原文（17行）</summary>

```text
  try {
    const perCriterion = new Map<string, { criterion: VerificationCriterion; work: number[]; baseline: number[] }>()
    for (const criterion of CODING_CRITERIA) perCriterion.set(criterion.id, { criterion, work: [], baseline: [] })
    for (const criterion of CODING_CRITERIA) {
      for (let repeat = 0; repeat < VERIFICATION_ROUNDS; repeat++) {
        const swapped = repeat % 2 === 1
        const candidateA = swapped ? EMPTY_WORK_BASELINE : input.evidence.trace
        const candidateB = swapped ? input.evidence.trace : EMPTY_WORK_BASELINE
        const prompt = buildAcceptancePrompt(input.evidence.problem, candidateA, candidateB, criterion, undefined, input.context, workSlotOfRound(repeat))
        const answer = await judgeOnce(input.llm, input.route, prompt, input.signal, budget)
        const scoreA = extractScore(answer.text, 'score_A')
        const scoreB = extractScore(answer.text, 'score_B')
        if (answer.usage.usageIncomplete === true) usage.usageIncomplete = true
        usage.calls += answer.usage.calls
        usage.inputTokens += answer.usage.inputTokens
        usage.outputTokens += answer.usage.outputTokens
        usage.reasoningTokens += answer.usage.reasoningTokens
```

</details>

**依据 7 · 源码核查**：[packages/dsh-task-board/src/host-runner.ts:581-600](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-runner.ts#L581-L600)

缺workspace拒绝后真实新会话。

<details>
<summary>查看原文（20行）</summary>

```text
    // Nothing names a workspace and the deployment has none to resolve to, so
    // there is no place this run may legitimately start: `session.create` would
    // quietly land it in the Host process working directory (the desktop app's
    // profile directory). Refuse before the session exists, with the reason the
    // board settles the card with and the browser renders in the user's
    // language, so the fix (pick a workspace on the card) is what the user reads.
    if (workspaceId === undefined) throw new Error(MISSING_WORKSPACE_REASON)
    const created = await this.invoke('session', 'create', {
      workspaceId,
      ...(mode === undefined ? {} : { agentPreset: mode }),
    }) as { sessionId: ExecutionSessionId }
    const sessionId = created.sessionId
    options.onSession?.(sessionId)
    try {
      await this.invoke('session', 'rename', { sessionId, title: task.title })
      await this.pinAndPrompt(sessionId, task, permission, options.promptContext, options.onGoalArmed, options.goalEnabled === true, options.catalog)
    } catch (error) {
      throw new SessionLaunchError(sessionId, error)
    }
    return sessionId
```

</details>

**依据 8 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:744-761](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L744-L761)

卸载不停止全部在飞launch。

<details>
<summary>查看原文（18行）</summary>

```text
  dispose(): void {
    this.disposed = true
    // Launches still waiting for a slot can never start now: settle them so
    // their cards leave the running column here, instead of waiting for the
    // next Host start's interrupted-start recovery. Launches already in flight
    // are left to finish — their session may already exist.
    const abandoned = this.launches.drain()
    if (abandoned.length > 0) {
      safeConsoleError(`[dsh-task-board] ${abandoned.length} run member(s) were still waiting for a launch slot when the Host stopped; each is settled as cancelled`)
    }
    this.extensions.dispose()
    this.clearScheduleTimer()
    this.clearPollBackoff()
    this.pollTimer?.()
    this.pollTimer = undefined
    this.power.dispose()
    this.ledger.dispose()
    this.listeners.clear()
```

</details>

#### 缺口

- 未验模型调用/现金/人工、idle平台、粘贴解析、扩展与退出。
  **影响**：只允许有边界试用，不能承诺预算严格或后台任务可靠完成。
  **进一步探讨**：单卡两阶段分别记录主执行和裁判usage/目标，再决定是否开一次非关键cron；无收益或状态不明立即停规则回手工执行。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可迁移价值与新方向是什么，如何推翻？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

本项把任务输入、Host持久execution/session与可选验收记录连接，并把模型自称完成转为程序可拒绝的门；相对手工列是任务委派/异步组织和可回查交付，不代表裁判事实保证。已存在手工move、external=true、普通turn与enforced的来源差别，不能把“新增所有来源收据”泛泛当新能力。

候选是将“连续24次历史不可读后failed且文字说明无法判定”的观测失败单独作为需要核目标的unknown呈现/处理，和真实tool/质量失败分开，避免用户看failed就再次运行已发生的工作。现有error文字已解释unknown，先验证是否足够；不先改运行逻辑或自动重试。用一个真实失败任务、一个工作已完成但历史不可读、一个裁判异常三样本，比较现有详情与显式unknown提示的误重跑/正确查目标率及恢复耗时；若现有文案已能区分、unknown只让卡常驻或增加误报，则推翻。尚未实现/验证，不作为本版新增得分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1197-1213](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L1197-L1213)

观测不可读最终failed但error明确outcome未知。

<details>
<summary>查看原文（17行）</summary>

```text
  private noteUnreadableInspection(execution: OpenExecutionReference, reason: string | undefined): void {
    const polls = (this.unreadablePolls.get(execution.executionId) ?? 0) + 1
    this.unreadablePolls.set(execution.executionId, polls)
    const detail = reason ?? 'no reason reported'
    if (polls === 1) {
      safeConsoleError('[dsh-task-board] execution session ' + (execution.sessionId ?? 'unknown')
        + ' history is unreadable; it stays pending for up to ' + UNREADABLE_SETTLE_POLLS + ' polls: ' + detail)
    }
    if (polls < UNREADABLE_SETTLE_POLLS) return
    this.unreadablePolls.delete(execution.executionId)
    this.settleAndNotify(
      execution.taskId,
      execution.executionId,
      'failed',
      'execution session history is unreadable (' + UNREADABLE_SETTLE_POLLS + ' consecutive polls); the outcome cannot be determined: ' + detail,
    )
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1202-1228](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1202-L1228)

手工关闭不代表真实会话终止。

<details>
<summary>查看原文（27行）</summary>

```text
      case 'settle': {
        const task = this.document.tasks.find(item => item.id === action.taskId)
        if (task === undefined) throw new Error('task not found')
        if (task.archivedAt !== undefined) throw new Error('archived task is read-only')
        if (!task.executions.some(entry => entry.endedAt === undefined)) throw new Error('task has no open execution')
        // Force-close the executions this card governs. The verdict is
        // 'cancelled', never 'succeeded': a card whose execution produced no
        // evidence of a completed turn must not be recorded as finished work,
        // and a cancelled settlement returns the card to the todo column so the
        // operator can run it again. Nothing else clears a running card: move,
        // archive and delete all refuse one, which is what made a stuck card
        // unrecoverable from the board.
        const reason = 'execution closed manually by '
          + (initiator === undefined || initiator === '' ? 'the operator' : initiator)
          + ': no verdict was recorded'
        for (const member of subtreeTasks(this.document.tasks, action.taskId, this.maxSubtaskDepth)) {
          for (const execution of member.executions) {
            if (execution.endedAt !== undefined) continue
            this.document.tasks = this.document.tasks.map(item => item.id !== member.id
              ? item
              : settleExecution(item, execution.id, 'cancelled', now, reason))
          }
        }
        // Fold whatever became ready in the same action: an ancestor whose last
        // member this closed leaves the running column with it.
        this.finalizeReadyRuns(false)
        break
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-service.ts:1063-1089](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-service.ts#L1063-L1089)

无验收/无匹配通过与真正失败有不同原因。

<details>
<summary>查看原文（27行）</summary>

```text
        // Forced acceptance: the old fallback paths — a completed turn, a
        // paused goal, an unreadable projection, a manual settle — must never
        // be mistaken for a verified success. Only a matching pass record
        // settles this execution as succeeded.
        if (result.outcome === 'succeeded' && verificationRequired(verification) && passedAttempt(verification) === undefined) {
          // Two different failures share this branch, and they send the reader
          // in opposite directions: attempts on record mean the judge ran and
          // the work did not pass, while zero attempts mean the gate never
          // opened at all (issue #1837) — the session narrated completion
          // instead of calling `update_goal(action: complete)`.
          this.settleAndNotify(
            execution.taskId,
            execution.executionId,
            'failed',
            verificationNeverInvoked(verification)
              ? NEVER_INVOKED_VERIFICATION_REASON
              : verificationOnlyInvalid(verification)
                ? INVALID_ONLY_VERIFICATION_REASON
                : NO_MATCHING_PASS_VERIFICATION_REASON,
            result.summary,
          )
          continue
        }
        // The run's closing text rides whichever verdict it earned: a failed
        // execution still leaves what it managed to say.
        this.settleAndNotify(execution.taskId, execution.executionId, result.outcome, 'error' in result ? result.error : undefined, result.summary)
      } catch {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1175-1194](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-task-board/src/host-ledger.ts#L1175-L1194)

external来源已有，不重提通用收据。

<details>
<summary>查看原文（20行）</summary>

```text
        // The one guardrail that matters: while the Host still owns a run it is
        // the only authority on the card, so an outside agent may not write the
        // terminal verdict over it. This is also what keeps a stale report from
        // racing the session it claims to have replaced.
        if (hasOpenExecution(task)) throw new Error('running task cannot receive an external outcome')
        const execution: ExecutionRecord = {
          // A fresh id, exactly like a Host-launched run: the external work is a
          // new attempt in the history, never an overwrite of an earlier record.
          id: crypto.randomUUID(),
          sessionId: undefined,
          startedAt: now,
          endedAt: now,
          result: action.result,
          error: action.summary,
          initiatedBy: action.initiatedBy,
          external: true,
        }
        this.document.tasks = this.document.tasks.map(item => item.id !== action.taskId
          ? item
          : {
```

</details>

#### 缺口

- 未看全UI当前unknown文案呈现与用户重跑错误率。
  **影响**：不能断言现UI误导或新unknown一定有需求。
  **进一步探讨**：先查当前详情对三样本的理解，再只做显示层对照；误重跑不降就保留现语义。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
