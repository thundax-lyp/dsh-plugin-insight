# YOLO

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c87d701](https://github.com/hanshanyike/dsh-yolo/tree/c87d70105f975d86c5c0f98f34fbce66657a6934)

<!-- BEGIN META -->
[![GitHub ★ 52](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=52&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hanshanyike/dsh-yolo) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-yolo) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-yolo)
<!-- END META -->

> **功能**：从 DSH 对话中整理事项和计划，按工作区跟踪变化，提供看板、来源记录与低打扰提醒。

> **亮点**：把接受的人类输入、事项来源与同库幂等状态、看板和提醒卡接起来，减少将对话当唯一待办库；提醒卡/聊天与任务完成分层，见 [Q01](#research-q01)至 [Q05](#research-q05)。

> **主要限制**：模型身份匹配和fallback仍可能错写，来源不是事实验收；/actions本层无身份鉴权，卡事务不等跨库简报/聊天保证，自动面模型成本不能由run cap包住，见 [Q03](#research-q03)至 [Q07](#research-q07)。

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
  - [Q01 · YOLO当前交付与未来受托Agent有何区别？](#detail-section-11)
  - [Q02 · 从哪一轮什么文本抽取，模型失败是否影响主对话？](#detail-section-12)
  - [Q03 · 事项身份、更新和去重是精确事实证明吗？](#detail-section-13)
  - [Q04 · 工作区与持久事务能保证哪些边界？](#detail-section-14)
  - [Q05 · 到期后通知与专属会话结果怎样区分？](#detail-section-15)
  - [Q06 · 用户操作和永久删有没有真正授权/范围门禁？](#detail-section-16)
  - [Q07 · 怎样可控试用，成本与可证伪改进是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：承诺散落DSH多会话的个人用户，可用非关键事项小样本核来源/状态/提醒；不作为唯一关键提醒，见 [Q01](#research-q01)。

手工待办/日历和回看对话。YOLO自动提取并保留来源/状态/通知，但当前不是自动完成外部任务的受托Agent。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 语义抽取 | 对话承诺到事项 | 额外模型/节流/失败可漏 |
| 来源/状态 | 计划与证据回看 | completion_claim非任务验收 |
| 事项身份 | 幂等/可选R2窄约束 | fallback不是全部门禁 |
| 通知 | due卡与专属聊天 | 卡可靠面/聊天尽力，Host需在线 |
| 看板操作 | 手动管理/取消/删除 | 常量确认非可信人批 |
| 简报/召回 | 聚合/模型辅助 | 多模型成本与跨库部分结果 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 不满足/边界 |
| --- | --- | --- |
| Node ^22.19或>=24 / Cordis | 原生SQLite与bundle | 作者Host>=0.1.5-rc.1仍需验 |
| llm/sessions/settings/tools/agents | 抽取/召回/聊天 | 非只注册面板即可完整工作 |
| 明确模型/隐私许可 | 本轮与known memory外发 | 不明确就停自动面 |
| workspace DB/catalog/快照 | 组织与重启 | 单库事务不跨全部文件 |
| 本机可信Host监听 | 看板actions | scope非用户认证 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 脱敏新workspace/备份 | 关semantic/brief/跨区聚合 |
| 明确模型 | 抽取开关/限制/路由 | 不把run cap当现金cap |
| 记录一项 | 非关键事项，核摘录/时间/身份 | 误记手工修并查来源 |
| 到期 | 核通知卡与聊天各自状态 | 卡非已读/任务完成 |
| 停止 | 关自动面/卸载并另核会话 | 回手工待办/日历 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | Node/Host/模型/副本 | 配置/隐私/时区/备份 | 未测接入时间 |
| 持续 | 抽取+resolver/可选召回/brief/聊天 | 修误记/查来源 | run cap非总费上限 |
| 失败 | DB/卡/快照/聊天分别状态 | 漏抽/身份/部分结果核对 | 不假定自动重放 |
| 退出 | DB/来源/快照/专属日志 | 停多自动面/保留清理 | 已发模型数据不可收回 |

#### 效果

| 效果 | 当前支持 | 未确认 |
| --- | --- | --- |
| 事项整理 | 人类来源/模型到库 | 漏记/误判净收益 |
| 去重 | 同操作hash/结果同事务 | 多轮业务身份正确 |
| 提醒 | 卡/事件/stamp同库 | 聊天终态/用户看到/准时 |
| 个人助理 | 看板/计划组织 | 未来受托执行能力 |

> **思考**：模型身份匹配和fallback仍可能错写，来源不是事实验收；/actions本层无身份鉴权，卡事务不等跨库简报/聊天保证，自动面模型成本不能由run cap包住，见 [Q03](#research-q03)至 [Q07](#research-q07)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把接受的人类输入、事项来源与同库幂等状态、看板和提醒卡接起来，减少将对话当唯一待办库；提醒卡/聊天与任务完成分层，见 [Q01](#research-q01)至 [Q05](#research-q05)。

身份/来源/幂等和事务接线具体；需精确区分legacy fallback、单库事务与跨库brief、卡与聊天结果，Host鉴权/全部算法不在已验范围，见 [Q02](#research-q02)至 [Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型身份匹配和fallback仍可能错写，来源不是事实验收；/actions本层无身份鉴权，卡事务不等跨库简报/聊天保证，自动面模型成本不能由run cap包住，见 [Q03](#research-q03)至 [Q07](#research-q07)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用只选脱敏新workspace非关键事项，关闭semantic/brief和跨区聚合、明确模型成本，人工核来源/日期与卡。误记/漏记或状态解释不清就停用回手工待办，见 [Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定多行入口/Host-Web、接受输入/抽取/identity policy/幂等事务、scope SQLite、due/brief/聊天、action核心链已查；未运行或全审Host权限、全部匹配/合并/删除/召回算法。只建议脱敏副本非关键事项小样本，关闭额外模型面。

- 已检查：作者 README、包清单、源码路径 README.md、client/index.ts、cordis.patch.yml、package.json、src/application/commands/apply-yolo-action.ts、src/application/conversation/index.ts、src/application/ingestion/apply-extraction.ts、src/application/ingestion/todo-identity-policy.ts、src/domain/scope.ts、src/extract/index.ts、src/extract/llm-extract.ts、src/index.ts、src/memory/index.ts、src/reminder/index.ts、src/reminder/scheduler.ts、src/shared/constants.ts、src/storage/db.ts、src/storage/index.ts、src/storage/repository.ts、src/storage/scope.ts、src/ui/actions.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：root/patch/Web入口、extract accepted input/idle/LLM/error、identity policy和apply、storage scope/单库事务/幂等、due/brief scheduler/专属会话、actions常量确认/可选去重、semantic额外调用；未执行，未全审所有tools/匹配合并撤销/批删repository/Host执行权限/版本网络。
- 下一步：- 下一步用新脱敏workspace一个非关键事项，核输入到事项到卡/聊天各状态。
- 坏JSON/提交后退出/聊天失败三样本对照漏记发现和误重试。
- 未安装运行或用真实会话/模型，不把作者测试当本轮验收。

**分析版本**

- **仓库**：[hanshanyike/dsh-yolo](https://github.com/hanshanyike/dsh-yolo)
- **版本号**：0.5.0（[固定提交 c87d701](https://github.com/hanshanyike/dsh-yolo/tree/c87d70105f975d86c5c0f98f34fbce66657a6934)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是观察/跳过/失败/事项提交/通知/聊天收据分层，用三故障样本核漏记发现和误重试，现有卡/日志足够则放弃，见 [Q07](#research-q07)。

- 下一步用新脱敏workspace一个非关键事项，核输入到事项到卡/聊天各状态。
- 坏JSON/提交后退出/聊天失败三样本对照漏记发现和误重试。
- 未安装运行或用真实会话/模型，不把作者测试当本轮验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 58 | 10040 | — | — | 158606 |
| .ts | source | 110 | 18340 | 15337 | 1755 | — |
| .tsx | source | 20 | 5111 | 4604 | 198 | — |
| .mjs | source | 7 | 1013 | 803 | 146 | — |
| .ts | test | 114 | 16610 | 14265 | 545 | — |
| .md | example | 1 | 59 | — | — | 1194 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/hanshanyike/dsh-yolo/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/hanshanyike/dsh-yolo/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hanshanyike/dsh-yolo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对话观察/模型抽取到事项和提醒的真实状态，分清身份/事务/授权/模型费用与未验边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · YOLO当前交付与未来受托Agent有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

0.5.0原生Host/Web插件bundle：裸root仅加载标记，patch实际挂storage/memory/extract/reminder/ui五个消费者/服务及Web行，不能只读root apply断言没实现。面向待办/截止/阶段目标散落多会话的个人用户，参照手工记待办与日历：本项从会话来源自动整理、按workspace持久、看板改状态/回看证据，并生成通知。当前主要是个人计划记录和提醒，README把受托Agent列为未来规划，不将它评价为现成自动完成外部任务的执行Agent。系统确会为抽取/召回/简报/专属聊天调用模型，不能由“不自动外部操作”推出无模型执行或整部署无工具能力。目标是否完成最终仍要用户核对。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-28](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/package.json#L1-L28)

版本与原生bundle/客户端。

<details>
<summary>查看原文（28行）</summary>

```text
{
  "name": "dsh-plugin-yolo",
  "version": "0.5.0",
  "description": "Personal assistant plugin for deepseek-harness that organizes commitments from conversations, tracks plans across sessions, and delivers low-interruption reminders.",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "license": "MIT",
  "main": "./dist/src/index.mjs",
  "exports": {
    ".": "./dist/src/index.mjs",
    "./client": "./dist/client/index.mjs",
    "./package.json": "./package.json",
    "./dist/src/storage": "./dist/src/storage/index.mjs",
    "./dist/src/memory": "./dist/src/memory/index.mjs",
    "./dist/src/extract": "./dist/src/extract/index.mjs",
    "./dist/src/reminder": "./dist/src/reminder/index.mjs",
    "./dist/src/ui": "./dist/src/ui/index.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:14-26](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/cordis.patch.yml#L14-L26)

实际多行挂载。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
  - id: yolo
    name: 'dsh-plugin-yolo'
  - id: yolo-storage
    name: 'dsh-plugin-yolo/dist/src/storage'
  - id: yolo-memory
    name: 'dsh-plugin-yolo/dist/src/memory'
  - id: yolo-extract
    name: 'dsh-plugin-yolo/dist/src/extract'
  - id: yolo-reminder
    name: 'dsh-plugin-yolo/dist/src/reminder'
  - id: yolo-ui
    name: 'dsh-plugin-yolo/dist/src/ui'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:14-25](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/index.ts#L14-L25)

裸root只是加载标记。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = 'yolo'
export const inject: string[] = []

export function apply(ctx: Context): void {
  try {
    ctx.logger?.info?.('[yolo] plugin loaded')
  } catch {
    // logger may be unavailable in some host contexts; fall through to console
  }
  // Unconditional marker so the host terminal always shows the load event
  // regardless of logger wiring.
  console.log('[yolo] plugin loaded')
```

</details>

**依据 4 · 作者声明**：[README.md:22-44](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/README.md#L22-L44)

作者现有整理/提醒及未来Agent界限。

<details>
<summary>查看原文（23行）</summary>

```text
待办、截止时间和阶段目标经常散落在不同对话里。会话一多，你很难记住哪些事情还没完成、哪些安排已经变化。**YOLO** 会从对话中识别需要继续跟进的内容，整理成跨会话可查看、可更新、会提醒的计划。

长期方向是成为面向工作与生活的个人智能助理：在用户授权范围内持续理解会话中的事项、决定和约束，并逐步连接用户与受托 Agent。当前版本先专注于跨会话整理、提醒和用户控制。

<p align="center">
  <img src="docs/assets/readme/dashboard-home.png" width="100%" alt="YOLO 助手看板首页：显示今日摘要、助手判断、快速记录和待处理事项"/>
</p>

<p align="center"><sub>真实 dsh 宿主中的 YOLO 助手看板 · 演示数据</sub></p>

YOLO 负责整理信息和提醒进度；是否执行、如何执行仍由你决定。它会：

- **自动整理**：从包含明确后续安排的对话中识别待办、目标、里程碑和提醒规则。
- **跨会话保存**：按工作区保存并支持搜索，不必在新会话里重复交代。
- **同步变化**：当你说「完成了」「推迟到周五」或「已经进行一半」，对应事项会更新并留下记录。
- **按时提醒**：到期提醒进入 YOLO 的通知和专属对话，不会插入正在进行的工作会话；dsh 再次运行后会补上离线期间到期的提醒。
- **集中查看和处理**：从侧栏打开助手看板，在首页处理当下关注，在计划中组织全部安排，在历史中按时间或按事项回看变化。
- **明确取消与删除**：取消事项会保留变化记录并可重新打开；“按日期删除事项”可按截止日期或创建日期预览并批量取消，也可在强确认后永久删除事项及相关数据。
- **通知完整可追溯**：顶部通知数字只表示尚未查看的新投递；提醒和简报进入可分页的通知记录，阅读通知不会误改事项状态。记录可以随时清理：单条用卡片上的 `×` 删除，堆积多了用「一键清除」在确认后清空。
- **保留来源证据**：事项会保存有界的用户原话、关联会话、轮次和助手操作证据，可先预览来源，再按宿主能力打开原会话。
- **抑制重复记录**：同一轮抽取、同一次助手调用或同一个看板动作重试不会重复创建事项；已合并的历史副本不会重新进入提醒。
- **版本提醒**：插件配置卡会显示是否已发布更新版本，并给出一条可直接执行的更新命令。
- **连接 Agent（规划中）**：未来支持带有明确权限、结果和验收标准的 Agent 任务；当前版本不会自动执行外部操作。
```

</details>

**依据 5 · 源码核查**：[client/index.ts:45-91](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/client/index.ts#L45-L91)

真实设置与看板Web挂载。

<details>
<summary>查看原文（47行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.logger?.info?.('[yolo] client bundle loaded')

  // 1. Card copy — the card registers `locale:`, so the framework binds this
  //    dictionary's reader as the component's `t` seat, exactly as the shipped
  //    plugin cards do.
  ctx.effect(() => ctx.locale.register(YOLO_CARD_NS, { zh, en }), 'yolo-client: card dictionary')
  // The card chrome's stylesheet, owned by this fiber so a stop removes it.
  ctx.effect(mountYoloCardStyle, 'yolo-client: plugin card stylesheet')

  // 2. Settings card — `settings.plugin.item` is keyed by the settings
  //    namespace the host half registered, so the section pairs the two
  //    without ever learning what `yolo` means.
  const scope = ctx.settingsScope.bind<YoloSettings>({ namespace: YOLO_SETTINGS_NAMESPACE })
  const form = new YoloCardForm(scope, YOLO_FIELD_SPECS)
  const store = form.bind((): YoloCardState => ({
    ...form.shell(),
    fields: Object.fromEntries(VALUE_FIELDS.map((field) => [field, form.field(field)])),
    switches: Object.fromEntries(SWITCH_FIELDS.map((field) => [field, form.switchState(field)])),
  }))
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: YOLO_SETTINGS_NAMESPACE,
    locale: YOLO_CARD_NS,
    inject: (): YoloCardFace => ({ hooks: { yoloCard: store }, ...form.actions() }),
  }, YoloSettingsCard))

  // 3. GLOBAL sidebar dashboard — app shell footer, independent of any session.
  //    Fetches /yolo/dashboard (host JSON endpoint); the panel refreshes on
  //    open, on demand after actions — no poll while open (v0.3.3).
  //    The panel's ledger badges jump to their source session via the runtime
  //    session service (ctx.sessions.open — same call the sidebar rows make).
  ctx.slots.inject('sidebar.footer.action', () =>
    ctx.slots.register({
      name: 'sidebar.footer.action',
      id: 'yolo',
      order: 10,
      inject: () => ({
        openSession: (sessionId: string): void => {
          // One tsc program covers host + client halves; the host half's
          // dsh-session merge (SessionStore, no .open) shadows the browser
          // runtime's ISessions on Context.sessions, so re-narrow here.
          ;(ctx.sessions as unknown as ISessions).open(sessionId as SessionId)
        },
        setTheme: (theme: 'dark' | 'light'): void => { ctx.theme.setTheme(theme) },
      }),
    }, YoloSidebarDashboard),
```

</details>

#### 缺口

- 没有真实个人持续任务/完整Host验收。
  **影响**：不能凭截图/愿景证明记得准、按时或任务办成。
  **进一步探讨**：用独立workspace的一个非关键待办对照手工记录，核来源/时间/状态和通知。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从哪一轮什么文本抽取，模型失败是否影响主对话？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

agent/pre-step先await next，只有enter且未abort、非YOLO专属会话才捕捉source.kind=user直接人类输入；不是所有user角色内容都当人意图。turn-stopping排后台按session串行、whenIdle后take该轮捕捉，durable log要求turn/end completed或max-tokens才继续；max-tokens不代表业务完成。无event log兼容Host才取最近直接人类derive消息，来源quote更弱。输入最多8000字符，sourceExcerpt400码点不是完整逐句引用；min chars、每日run cap和spacing可能让内容被跳过，不能说每轮都被记住。

llmExtract按routeFor从agent/Host与配置回退选择provider/model，未自动验证供应商支持；将已知记忆+本轮文本发模型，temperature0/maxTokens2048，stream组装后严格JSON，error/aborted/无文本抛错；不会用空对象冒充成功。后台捕获记录error，若storage也错则日志隔离、不抛主Agent；但已take捕捉和jobs内存不能证明重启可补抽所有未提交轮。卸载abort活跃抽取，已提交事项不回滚。隐私范围含已知记忆，不止新一句话；temperature0不保证事实正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/extract/index.ts:87-112](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L87-L112)

直接人类与有界来源摘录。

<details>
<summary>查看原文（26行）</summary>

```text
/** Keep only direct human input. Plugin context and tool results are also
 * user-role messages, but they are not evidence of a user's commitment. */
function humanMessagesToText(messages: readonly UserMessage[], maxChars = 8000): string {
  const joined = messages
    .filter((message) => message.source?.kind === 'user')
    .map((message) => contentBlocksToText(message.content).trim())
    .filter(Boolean)
    .map((text) => `user: ${text}`)
    .join('\n')
  return joined.length > maxChars ? joined.slice(0, maxChars) : joined
}

/** A preview is provenance, not another transcript store. Keep only direct
 * human input from this accepted turn, normalize layout, and truncate by
 * Unicode code points so astral characters are never split. */
export function sourceExcerptFromMessages(messages: readonly UserMessage[], maxChars = 400): string | null {
  const text = messages
    .filter((message) => message.source?.kind === 'user')
    .map((message) => contentBlocksToText(message.content).trim())
    .filter(Boolean)
    .join('\n')
    .replace(/\s+/gu, ' ')
    .trim()
  if (!text) return null
  return Array.from(text).slice(0, maxChars).join('')
}
```

</details>

**依据 2 · 源码核查**：[src/extract/index.ts:118-154](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L118-L154)

completed/max-tokens和route来源。

<details>
<summary>查看原文（37行）</summary>

```text
function completedTurn(session: Session, turn: number): boolean {
  const events = (session as Session & { events?: ReadonlyArray<{ type: string; data?: { turn?: number; reason?: { kind?: string } } }> }).events
  if (!events) return true
  let end: { data?: { reason?: { kind?: string } } } | undefined
  for (let index = events.length - 1; index >= 0; index--) {
    const event = events[index]
    if (event.type === 'turn/end' && event.data?.turn === turn) {
      end = event
      break
    }
  }
  const reason = end?.data?.reason?.kind
  return reason === 'completed' || reason === 'max-tokens'
}

/** Modern hosts expose a durable event log and always deliver direct-human
 * input through agent/pre-step. Only event-log-less compatibility hosts may
 * use the derived-message fallback; otherwise an automatic Goal round
 * (`role=user`, `source.kind=goal`) can make every round re-extract an older
 * human request. */
function hasDurableEventLog(session: Session): boolean {
  return Array.isArray((session as Session & { events?: readonly unknown[] }).events)
}

function routeFor(ctx: Context, agent: ExtractAgent, configuredModel?: string): { provider: string; model: string } {
  const selected = (ctx as { get?: (name: string) => { currentSelection(): { provider: string; model: string } } | undefined })
    .get?.('agentDefaultModel')?.currentSelection()
  const provider = agent.options?.provider || selected?.provider || 'deepseek'
  const routedModel = agent.options?.model || selected?.model
  return {
    provider,
    // The historical setting stores only a model id, not its provider. Apply
    // it on the DeepSeek route where that id is meaningful; other providers
    // must keep their paired model instead of receiving "deepseek-chat".
    model: provider === 'deepseek' ? (configuredModel || routedModel || 'deepseek-chat') : (routedModel || configuredModel || 'deepseek-chat'),
  }
}
```

</details>

**依据 3 · 源码核查**：[src/extract/index.ts:241-254](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L241-L254)

接受输入后的实际捕捉。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('agent/pre-step', async (
    payload: { agent: ExtractAgent; messages: UserMessage[]; turn: number; signal: AbortSignal },
    next: () => Promise<PreStepDecision>,
  ) => {
    const decision = await next()
    if (decision.kind !== 'enter' || payload.signal.aborted || isYoloSessionId(payload.agent.id)) return decision
    const human = decision.messages.filter((message) => message.source?.kind === 'user')
    if (human.length) {
      yctx.yolo.observations.captureHumanTurn(
        payload.agent.id,
        payload.turn,
        cwdOf(payload.agent.session),
        human,
      )
```

</details>

**依据 4 · 源码核查**：[src/extract/index.ts:283-353](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L283-L353)

失败轮丢捕捉、后台/idle/兼容/节流。

<details>
<summary>查看原文（71行）</summary>

```text
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    if (event.type !== 'turn/end') return
    const reason = event.data.reason.kind
    if (reason === 'completed' || reason === 'max-tokens') return
    yctx.yolo.observations.discardHumanTurn(session.id, event.data.turn)
    capturedTodoCandidates.get(session.id)?.delete(event.data.turn)
    scheduledTurns.delete(`${session.id}:${event.data.turn}`)
  })

  // Scheduling only: never keep the expiring turn signal or block turn close.
  ctx.on('agent/turn-stopping', (payload: { agent: ExtractAgent; turn: number }) => {
    const { agent, turn } = payload
    const hostOwnsIdleBoundary = typeof agent.whenIdle === 'function'
    const sessionId = agent.id || agent.session.id
    if (isYoloSessionId(sessionId)) return
    const turnKey = `${sessionId}:${turn}`
    if (scheduledTurns.has(turnKey)) return
    scheduledTurns.add(turnKey)

    const previous = jobs.get(sessionId) ?? Promise.resolve()
    const job = previous.catch(() => {}).then(async () => {
      try {
        await agent.whenIdle?.()
        // Read only after true idle so steering accepted after an earlier
        // turn-stopping boundary is included in the same extraction.
        const capturedTurn = yctx.yolo.observations.takeHumanTurn(sessionId, turn)
        const capturedMessages = capturedTurn?.messages ?? []
        const acceptedAt = capturedTurn?.acceptedAt
        const preStepTodoCandidates = capturedTodoCandidates.get(sessionId)?.get(turn)
        capturedTodoCandidates.get(sessionId)?.delete(turn)
        if (!completedTurn(agent.session, turn)) return
        const session = agent.session
        const cwd = cwdOf(session)
        const config = settings?.get(YOLO_NS)?.extraction
        if (config?.enableLLM === false) return

        const route = routeFor(ctx, agent, config?.model)
        const derived = session.deriveMessages()
        const turnText = capturedMessages.length
          ? humanMessagesToText(capturedMessages)
          : !hasDurableEventLog(session)
              ? (() => {
                  // Compatibility only: never treat plugin/Goal user-role
                  // messages as human evidence, even on an older host.
                  const latest = [...derived].reverse().find((message) =>
                    message.role === 'user' && message.source?.kind === 'user',
                  )
                  return latest ? messagesToText([latest]) : ''
                })()
              : ''
        if (!turnText.trim()) return

        const lastUserText = capturedMessages.length
          ? contentBlocksToText(capturedMessages[capturedMessages.length - 1].content).trim()
          : turnText.replace(/^user:\s*/u, '').trim()
        const minTurnChars = config?.minTurnChars ?? DEFAULTS.extractionMinTurnChars
        if (lastUserText.length < minTurnChars) return

        const maxRunsPerDay = config?.maxRunsPerDay ?? DEFAULTS.extractionMaxRunsPerDay
        const todayStart = new Date().setHours(0, 0, 0, 0)
        if (yctx.yolo.countExtractionsSince(cwd, todayStart) >= maxRunsPerDay) {
          ctx.logger?.warn?.('[yolo-extract] daily run cap %d reached, skipping extraction', maxRunsPerDay)
          return
        }

        const controller = new AbortController()
        controllers.add(controller)
        const last = yctx.yolo.lastExtractionAt(cwd, session.id, 'llm')
        const spacingMs = (config?.minIntervalSec ?? DEFAULTS.extractionMinIntervalSec) * 1000
        const operationId = extractionTodoOperationId(session.id, turn)
        const requestHash = todoOperationRequestHash({ turnText, messages: capturedMessages.length || 1 })
```

</details>

**依据 5 · 源码核查**：[src/extract/index.ts:373-384](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L373-L384)

本轮与knownContext实际模型接线。

<details>
<summary>查看原文（12行）</summary>

```text
          const result = await llmExtract({
            llm: yctx.llm,
            provider: route.provider,
            model: route.model,
            turnText,
            knownContext: buildKnownMemoryContext(yctx.yolo, cwd),
            signal: controller.signal,
            // Resolve “today/tomorrow” from when the host accepted the user's
            // input, not from a later idle/spacing boundary that may cross midnight.
            now: new Date(acceptedAt ?? started),
            observe: (value) => { observation = value },
          })
```

</details>

**依据 6 · 源码核查**：[src/extract/llm-extract.ts:172-203](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/llm-extract.ts#L172-L203)

真实stream与严格解析失败。

<details>
<summary>查看原文（32行）</summary>

```text
export async function llmExtract(opts: LlmExtractOptions): Promise<ExtractionResult> {
  const { llm, provider, model, turnText, knownContext, signal, observe, now = new Date() } = opts
  if (!turnText.trim()) return EMPTY_EXTRACTION

  const userContent = knownContext
    ? `Known memories (do not re-extract unchanged facts):\n${knownContext}\n\n--- Conversation turn ---\n${turnText}`
    : turnText

  const stream = llm.stream({
    provider,
    model,
    system: buildExtractionPrompt(now),
    messages: [{ role: 'user', content: [{ type: 'text', text: userContent }] }] as Message[],
    temperature: 0,
    maxTokens: 2048,
    purpose: 'session-title',
    signal,
  })

  const assembler = new BlockAssembler()
  for await (const chunk of stream) {
    assembler.push(chunk)
  }
  const finish = assembler.finish
  const blocks = assembler.blocks()
  const text = contentBlocksToText(blocks).trim()
  observe?.({ rawText: text, finish, usage: assembler.usage })
  if (finish.kind === 'error' || finish.kind === 'aborted') {
    throw new Error(`extraction model ${finish.kind}: ${finish.failure?.message ?? 'no failure detail'}`)
  }
  if (!text) throw new Error('extraction model returned no text')
  return parseExtractionJsonStrict(text)
```

</details>

**依据 7 · 源码核查**：[src/extract/index.ts:507-550](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L507-L550)

error记录/失败隔离和dispose取消。

<details>
<summary>查看原文（44行）</summary>

```text
        } catch (e) {
          try {
            yctx.yolo.logExtraction(cwd, {
              session_id: session.id,
              turn_seq: turn,
              strategy: 'llm',
              status: 'error',
              extracted_json: JSON.stringify({
                error: e instanceof Error ? e.message : String(e),
                raw: observation?.rawText ?? null,
                finish: observation?.finish ?? null,
                route,
              }).slice(0, 1200),
              token_in: observation?.usage?.inputTokens ?? null,
              token_out: observation?.usage?.outputTokens ?? null,
              duration_ms: Date.now() - started,
            })
          } catch {
            // storage itself is unavailable; failure remains isolated
          }
          throw e
        } finally {
          controllers.delete(controller)
        }
      } catch (e) {
        ctx.logger?.warn?.('[yolo-extract] background extraction failed: %s', e instanceof Error ? e.message : String(e))
      }
    }).finally(() => {
      scheduledTurns.delete(turnKey)
      if (jobs.get(sessionId) === job) jobs.delete(sessionId)
    })
    jobs.set(sessionId, job)
    // Real dsh agents must return immediately so turn/end can commit and
    // whenIdle can resolve. Minimal compatibility hosts without whenIdle have
    // no such boundary, so returning the job preserves their serial contract.
    return hostOwnsIdleBoundary ? undefined : job
  })

  ;(ctx as { effect?: (effect: () => () => void) => unknown }).effect?.(() => () => {
    for (const controller of controllers) controller.abort(new Error('yolo-extract disposed'))
    controllers.clear()
    capturedTodoCandidates.clear()
    scheduledTurns.clear()
  })
```

</details>

#### 缺口

- 未核真实Host事件/模型契约与崩溃后漏抽补偿。
  **影响**：不能保证每条承诺都能自动抽取，关键提醒需人工落板确认。
  **进一步探讨**：用enter拒绝/自动Goal消息/max-tokens/模型坏JSON/进程重启样本核来源、跳过与错误记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 事项身份、更新和去重是精确事实证明吗？

**研究主题**：功能与机制、缺陷与关键质疑、贡献与相对优势

#### 完整回答

抽取在scopeRef内runIdempotentScopeAction，同operationId/requestHash重放原结果，异输入冲突；这是同输入重试的持久去重，不能解决不同轮同名事项的业务身份。applyExtractionResult实际会创建/更新todo、milestone/goal和session summary，来源excerpt与turn/evidence operation跟随入库。

可选R2 identity policy只在单prediction/少量mutation、单一在候选快照中的开放canonical候选、非similarity召回及高于阈值时放LINK/仅due-date UPDATE；多候选/终态/其他字段blocked，不是分类器自己扩大权限。但disabled/无结果/模型失败有legacy fallback，不是所有更新都被R2门禁覆盖。legacy applyUpdates把模型match_title传findTodoByTitle，限定scope开放canonical但用bestByTitle挑选，不是用户显式ID核准；错误语义可能造成错更新。completion_claim是人说完成的来源标签，非外部任务验收。模型置信度0.85是决策阈值不是已测准确率；完整bestByTitle/合并/反馈撤销算法未全审，不能保证去重永远不误并。

#### 证据与依据

**依据 1 · 源码核查**：[src/extract/index.ts:406-431](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L406-L431)

identity计划与幂等scope接线。

<details>
<summary>查看原文（26行）</summary>

```text
          const todoIdentityPlan = resolverError
            ? undefined
            : planTodoIdentityApplication(result, resolutions, todoCandidates, config?.todoIdentityR2Enabled === true, minConfidence)
          const scope = yctx.yolo.scopeRefForCwd(cwd)
          let todoIdentityOutcome: TodoIdentityApplicationOutcome | undefined
          const persisted = yctx.yolo.runIdempotentScopeAction(scope, operationId, requestHash, (scopedCwd) => {
            if (sourceExcerpt) {
              yctx.yolo.promoteToolTodoOrigins(scopedCwd, {
                session_id: session.id,
                source_excerpt: sourceExcerpt,
                source_turn: turn,
                created_from: acceptedAt ?? started,
                created_to: started,
                evidence_operation_key: operationId,
                evidence_occurred_at: acceptedAt ?? started,
              })
            }
            todoIdentityOutcome = applyExtractionResult(yctx.yolo, scopedCwd, result, {
              sessionId: session.id,
              turn,
              // Compatibility fallback text is useful extraction input but is
              // not sufficiently strong provenance to persist as a quotation.
              excerpt: sourceExcerpt,
              operationId,
              occurredAt: acceptedAt ?? started,
            }, todoIdentityPlan)
```

</details>

**依据 2 · 源码核查**：[src/storage/index.ts:715-739](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/index.ts#L715-L739)

真实事务重放/冲突和结果保存。

<details>
<summary>查看原文（25行）</summary>

```text
  runIdempotentAction(
    cwd: string,
    clientActionId: string,
    requestHash: string,
    execute: () => string,
  ):
    | { status: 'fresh' | 'replay'; outcome_json: string }
    | { status: 'conflict' } {
    const h = this.resolve(cwd)
    return withTransaction(h.db, () => {
      const existing = repo.getClientAction(h.db, h.scopeKey, clientActionId)
      if (existing) {
        return existing.request_hash === requestHash
          ? { status: 'replay' as const, outcome_json: existing.outcome_json }
          : { status: 'conflict' as const }
      }
      const outcomeJson = execute()
      repo.saveClientAction(h.db, {
        scope_key: h.scopeKey,
        client_action_id: clientActionId,
        request_hash: requestHash,
        outcome_json: outcomeJson,
      })
      return { status: 'fresh' as const, outcome_json: outcomeJson }
    })
```

</details>

**依据 3 · 源码核查**：[src/application/ingestion/apply-extraction.ts:116-169](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/ingestion/apply-extraction.ts#L116-L169)

真实创建与来源字段。

<details>
<summary>查看原文（54行）</summary>

```text
export function applyExtractionResult(
  yolo: Yolo,
  cwd: string,
  result: ExtractionResult,
  source: ExtractionSource,
  todoIdentity?: TodoIdentityApplicationPlan,
): TodoIdentityApplicationOutcome | undefined {
  for (const milestone of result.milestones) {
    if (!shouldDropExtracted('milestone', milestone.title)) {
      yolo.addMilestone(cwd, {
        title: milestone.title,
        target_date: milestone.target_date,
        description: milestone.description,
        source: 'llm',
      })
    }
  }
  const milestoneId = (title: string | null | undefined): string | null => title ? yolo.findMilestoneId(cwd, title) : null
  let identityOutcome: TodoIdentityApplicationOutcome | undefined
  const identityControlsTodos = todoIdentity?.mode === 'authorized' || todoIdentity?.mode === 'blocked'
  if (todoIdentity?.mode === 'authorized') {
    identityOutcome = applyAuthorizedTodoIdentity(yolo, cwd, result, source, todoIdentity)
  } else if (todoIdentity?.mode === 'blocked') {
    identityOutcome = { plan: todoIdentity, status: 'blocked', reason: todoIdentity.reason }
  }
  for (const item of identityControlsTodos ? [] : result.todos) {
    if (shouldDropExtracted('todo', item.title)) continue
    const { todo, created } = yolo.addTodo(cwd, {
      title: item.title,
      due_at: item.due_at,
      priority: toPriority(item.priority),
      milestone_id: milestoneId(item.milestone_title),
      source: 'llm',
      session_id: source.sessionId,
      source_excerpt: source.excerpt,
      source_turn: source.excerpt ? source.turn : null,
      evidence_operation_key: source.operationId,
      evidence_source_kind: source.excerpt ? 'human' : 'extraction',
      evidence_occurred_at: source.occurredAt,
    })
    if (created) {
      yolo.addEvent(cwd, {
        kind: 'todo_created',
        summary: `＋ 记录新待办「${item.title}」`,
        detail: item.due_at ? `截止 ${item.due_at}` : null,
        session_id: source.sessionId,
        source: 'llm',
        subject_type: 'todo',
        subject_id: todo.id,
        subject_title: todo.title,
        change: {
          status: { before: null, after: todo.status },
          ...(todo.due_at ? { due_at: { before: null, after: todo.due_at } } : {}),
        },
```

</details>

**依据 4 · 源码核查**：[src/application/ingestion/apply-extraction.ts:230-246](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/ingestion/apply-extraction.ts#L230-L246)

summary/更新与fallback。

<details>
<summary>查看原文（17行）</summary>

```text
      kind: event.kind,
      summary: event.summary,
      occurred_at: event.occurred_at ? Date.parse(event.occurred_at) || undefined : undefined,
      session_id: source.sessionId,
      source: 'llm',
    })
  }
  if (result.session_summary) yolo.upsertSessionSummary(cwd, source.sessionId, result.session_summary)
  applyUpdates(yolo, cwd, result.updates, source, !identityControlsTodos && todoIdentity?.mode !== 'create')
  if (!identityOutcome && todoIdentity) {
    identityOutcome = {
      plan: todoIdentity,
      status: 'fallback',
      ...(todoIdentity.mode === 'create' ? { reason: 'create_uses_existing_extraction' } : {}),
    }
  }
  return identityOutcome
```

</details>

**依据 5 · 源码核查**：[src/application/ingestion/todo-identity-policy.ts:43-88](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/ingestion/todo-identity-policy.ts#L43-L88)

可选policy形状、置信/候选/非similarity约束。

<details>
<summary>查看原文（46行）</summary>

```text
/** Decide whether an observational resolver result may control todo writes.
 *
 * The classifier never authorizes itself. R2a deliberately supports one todo
 * mention at a time: a single prediction, at most one extracted todo mutation,
 * one same-workspace open canonical candidate, and only LINK/UPDATE. Terminal,
 * occurrence, step and ambiguous decisions stay blocked for later stages.
 * Resolver failure/empty output falls back to the pre-R2 extraction path so an
 * auxiliary-model outage cannot make ordinary capture unavailable. */
export function planTodoIdentityApplication(
  result: ExtractionResult,
  predictions: readonly TodoResolutionPrediction[],
  candidates: readonly TodoIdentityCandidate[],
  enabled = false,
  minConfidence = TODO_IDENTITY_MIN_CONFIDENCE,
): TodoIdentityApplicationPlan {
  if (!enabled) return plan('fallback', 'policy_disabled')
  if (predictions.length === 0) return plan('fallback', 'resolver_empty')
  if (predictions.length !== 1) return plan('blocked', 'multiple_resolutions')

  const prediction = predictions[0]
  const todoUpdates = result.updates.filter((update) => update.kind === 'todo')
  const todoMutationCount = result.todos.length + todoUpdates.length

  if (prediction.decision === 'CREATE') {
    if (prediction.candidate_ids.length !== 0) return plan('blocked', 'create_referenced_candidate', prediction)
    if (result.todos.length !== 1 || todoUpdates.length !== 0) return plan('blocked', 'create_shape_ambiguous', prediction)
    return plan('create', 'independent_single_create', prediction)
  }

  if (prediction.decision !== 'LINK' && prediction.decision !== 'UPDATE') {
    return plan('blocked', `decision_not_authorized:${prediction.decision}`, prediction)
  }
  if ((prediction.confidence ?? 0) < minConfidence) {
    return plan('blocked', 'confidence_below_threshold', prediction)
  }
  if (prediction.candidate_ids.length !== 1) {
    return plan('blocked', 'candidate_not_unique', prediction)
  }
  const candidateId = prediction.candidate_ids[0]
  const candidate = candidates.find((row) => row.id === candidateId)
  if (!candidate) return plan('blocked', 'candidate_not_in_snapshot', prediction)
  if (candidate.match_source === 'similarity') {
    return plan('blocked', 'candidate_recall_not_r2_safe', prediction, candidateId)
  }
  if (!OPEN_STATUSES.has(candidate.status)) {
    return plan('blocked', 'candidate_not_open', prediction, candidateId)
```

</details>

**依据 6 · 源码核查**：[src/application/ingestion/todo-identity-policy.ts:93-114](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/ingestion/todo-identity-policy.ts#L93-L114)

LINK冲突和UPDATE只改due限制。

<details>
<summary>查看原文（22行）</summary>

```text
  if (prediction.decision === 'LINK' && todoUpdates.length > 0) {
    return plan('blocked', 'link_conflicts_with_extracted_update', prediction, candidateId)
  }
  if (prediction.decision === 'LINK' && result.todos.some((todo) => todo.due_at != null || todo.priority != null)) {
    return plan('blocked', 'link_conflicts_with_extracted_fields', prediction, candidateId)
  }
  if (prediction.decision === 'UPDATE' && todoMutationCount !== 1) {
    return plan('blocked', 'update_shape_missing', prediction, candidateId)
  }
  if (prediction.decision === 'UPDATE') {
    const update = todoUpdates[0]
    const extracted = result.todos[0]
    if (update && (update.status != null || update.due_at == null)) {
      return plan('blocked', 'update_field_not_authorized', prediction, candidateId)
    }
    if (extracted && (extracted.due_at == null || extracted.priority != null)) {
      return plan('blocked', 'update_field_not_authorized', prediction, candidateId)
    }
  }

  return plan('authorized', prediction.decision === 'LINK' ? 'safe_single_link' : 'safe_single_update', prediction, candidateId)
}
```

</details>

**依据 7 · 源码核查**：[src/application/ingestion/apply-extraction.ts:24-43](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/ingestion/apply-extraction.ts#L24-L43)

legacy标题更新与completion_claim。

<details>
<summary>查看原文（20行）</summary>

```text
function applyUpdates(yolo: Yolo, cwd: string, updates: readonly ExtractedUpdate[], source: ExtractionSource, includeTodos = true): void {
  for (const update of updates) {
    if (update.kind === 'todo') {
      if (!includeTodos) continue
      const args = { session_id: source.sessionId }
      let todo = null
      if (update.status === 'done') todo = yolo.applyTodoAction(cwd, { title: update.match_title }, 'complete', args)
      else if (update.status === 'cancelled') todo = yolo.applyTodoAction(cwd, { title: update.match_title }, 'cancel', args)
      else if (update.status === 'in_progress') todo = yolo.applyTodoAction(cwd, { title: update.match_title }, 'start', args)
      else if (update.due_at) todo = yolo.applyTodoAction(cwd, { title: update.match_title }, 'postpone', { due_at: update.due_at, ...args })
      if (todo) {
        yolo.addTodoEvidence(cwd, todo.id, {
          session_id: source.sessionId,
          turn_seq: source.turn,
          source_kind: source.excerpt ? 'human' : 'extraction',
          relation: update.status === 'done' ? 'completion_claim' : 'update',
          excerpt: source.excerpt,
          occurred_at: source.occurredAt,
          source_fingerprint: todoEvidenceFingerprint(source.operationId, todo.id),
        })
```

</details>

**依据 8 · 源码核查**：[src/storage/index.ts:344-353](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/index.ts#L344-L353)

实际标题选ID更新。

<details>
<summary>查看原文（10行）</summary>

```text
  applyTodoAction(
    cwd: string,
    ref: { id?: string; title?: string },
    action: TodoAction,
    args?: { due_at?: string | null; session_id?: string | null },
  ): Todo | null {
    const h = this.resolve(cwd)
    const id = ref.id ?? (ref.title ? repo.findTodoByTitle(h.db, h.scopeKey, ref.title)?.id : undefined)
    if (!id) return null
    return repo.applyTodoAction(h.db, id, action, args)
```

</details>

**依据 9 · 源码核查**：[src/storage/repository.ts:623-628](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/repository.ts#L623-L628)

只在开放canonical候选中bestByTitle。

```text
export function findTodoByTitle(db: DB, scopeKey: string, title: string): Todo | undefined {
  if (!normalize(title)) return undefined
  const rows = db
    .prepare("SELECT * FROM todos WHERE scope_key = ? AND record_status = 'canonical' AND status IN ('pending','in_progress')")
    .all(scopeKey) as Todo[]
  return bestByTitle(rows, title, RANK_TODO)
```

#### 缺口

- 未完整验证多轮身份/相似题/合并撤销与误判率。
  **影响**：不能让自动提取状态直接成为任务完成依据。
  **进一步探讨**：两条近名但不同截止/项目事项对照明确ID、R2开关/失败与重放，人工查证据和状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工作区与持久事务能保证哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

workspace按cwd规范字符串标识并哈希，不用Git分支拆库；canonicalWorkspaceCwd用resolve/Windows归一而非realpath，不宣称符号链接路径自动同库。workspace DB放cwd/.dsh/yolo，另有user/global目录；scopeRef先查已注册workspace，pin仅同步操作，DB缓存按实际path，事务明确不跨catalog或另一workspace。分库是本地组织不是多用户授权/加密；进程和同OS用户可读取范围需部署控制。

node:sqlite同步连接WAL、foreign_keys、synchronous=NORMAL；withTransaction真实BEGIN IMMEDIATE/COMMIT、异常ROLLBACK，嵌套savepoint。幂等结果与execute在同库事务里；不能由此外推所有跨库简报/文件快照也原子，或机器掉电无损。mkdir无显式私有模式，报告不称凭据保险箱。dispose关DB/清观察/catalog，快照是辅助文件不是强同步双写；看板动作后快照失败被吞，DB操作仍成功，不能仅凭Markdown副本判断规范状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/domain/scope.ts:14-33](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/domain/scope.ts#L14-L33)

cwd字符串规范与hash。

<details>
<summary>查看原文（20行）</summary>

```text
/** Canonical filesystem identity. Windows paths compare case-insensitively. */
export function workspaceIdentity(cwd: string, platform: NodeJS.Platform = process.platform): string {
  const value = cwd.trim()
  if (!value || value.includes('\u0000')) throw new Error('invalid workspace cwd')
  if (platform === 'win32') return win32.resolve(value.replaceAll('/', '\\')).toLowerCase()
  return resolve(value)
}

/** Resolved cwd spelling retained for payloads and session metadata. */
export function canonicalWorkspaceCwd(cwd: string, platform: NodeJS.Platform = process.platform): string {
  const value = cwd.trim()
  if (!value || value.includes('\u0000')) throw new Error('invalid workspace cwd')
  return platform === 'win32' ? win32.resolve(value.replaceAll('/', '\\')) : resolve(value)
}

/** Workspace identity intentionally remains the existing cwd hash so schema,
 * HTTP rows and stored scope_key values do not need a destructive migration. */
export function computeScopeKey(cwd: string, platform: NodeJS.Platform = process.platform): string {
  const cwdHash = createHash('sha1').update(workspaceIdentity(cwd, platform)).digest('hex').slice(0, 12)
  return `${cwdHash}/default`
```

</details>

**依据 2 · 源码核查**：[src/storage/scope.ts:19-34](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/scope.ts#L19-L34)

库目录/文件。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveDataDir(mode: ScopeMode, cwd: string): string {
  switch (mode) {
    case 'workspace':
      // <cwd>/.dsh/yolo/ — keeps each project's memory self-contained
      return join(resolve(cwd), '.dsh', 'yolo')
    case 'user':
      // ~/.dsh/yolo/ — cross-project personal memory
      return join(homedir(), '.dsh', 'yolo')
    case 'global':
      return join(homedir(), '.dsh', 'yolo', 'global')
  }
}

/** DB filename for a scope key (sanitized). */
export function dbFileName(scopeKey: string): string {
  return `yolo-${scopeKey.replace(/[\\/]/g, '_')}.db`
```

</details>

**依据 3 · 源码核查**：[src/storage/index.ts:163-249](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/index.ts#L163-L249)

scopeRef/pin/开库与单库事务边界。

<details>
<summary>查看原文（87行）</summary>

```text
  dispose(): void {
    this.close()
    this.observations.clear()
    this.workspaceCatalog.close()
  }

  /**
   * Run `fn` with every workspace-mode resolve(cwd) pinned to `scopeKey`.
   * Sync-only by design (all current callers — applyYoloAction, dashboard
   * projection builders — are synchronous). The pinned key comes from
   * listWorkspaceMeta(), i.e. the registry the board rows were rendered from,
   * so actions and projections hit exactly the store the user is looking at.
   */
  runInScope<T>(cwd: string, scopeKey: string, fn: () => T): T {
    this.scopePins.push({ cwd: workspaceIdentity(cwd), scopeKey })
    try {
      return fn()
    } finally {
      this.scopePins.pop()
    }
  }

  /** Single-store UnitOfWork. It never spans the workspace catalog or another
   * workspace DB; cross-store orchestration must remain idempotent/partial. */
  runWorkspaceTransaction<T>(cwd: string, execute: () => T): T {
    return withTransaction(this.resolve(cwd).db, execute)
  }

  /** Resolve an application scope without leaking cwd into use-case identity. */
  resolveScope(ref: ScopeRef): ScopeHandle {
    if (ref.kind === 'user') return this.resolve(process.cwd(), 'user')
    const workspace = this.listWorkspaceMeta().find((item) => item.workspaceId === ref.workspaceId)
    if (!workspace) throw new Error(`unknown workspace scope: ${ref.workspaceId}`)
    return this.runInScope(workspace.cwd, workspace.scopeKey, () => this.resolve(workspace.cwd))
  }

  scopeRefForCwd(cwd: string): ScopeRef {
    const handle = this.resolve(cwd)
    const identity = workspaceIdentity(cwd)
    const workspace = this.knownWorkspaces.get(identity)
    if (!workspace) throw new Error('workspace catalog registration unavailable')
    if (workspace.scopeKey !== handle.scopeKey) throw new Error('workspace scope identity mismatch')
    return { kind: 'workspace', workspaceId: workspace.workspaceId }
  }

  runInScopeRef<T>(ref: ScopeRef, execute: (cwd: string) => T): T {
    if (ref.kind === 'user') throw new Error('plan commands require a workspace scope')
    const workspace = this.listWorkspaceMeta().find((item) => item.workspaceId === ref.workspaceId)
    if (!workspace) throw new Error(`unknown workspace scope: ${ref.workspaceId}`)
    return this.runInScope(workspace.cwd, workspace.scopeKey, () => execute(workspace.cwd))
  }

  runIdempotentScopeAction(
    ref: ScopeRef,
    operationId: string,
    requestHash: string,
    execute: (cwd: string) => string,
  ): ReturnType<Yolo['runIdempotentAction']> {
    return this.runInScopeRef(ref, (cwd) => this.runIdempotentAction(cwd, operationId, requestHash, () => execute(cwd)))
  }

  /** Resolve (and lazily open+cache) the DB handle for a scope. */
  resolve(cwd: string, mode: ScopeMode = 'workspace'): ScopeHandle {
    const ownerCwd = mode === 'workspace' ? canonicalWorkspaceCwd(cwd) : cwd
    const cwdIdentity = workspaceIdentity(ownerCwd)
    const pin =
      mode === 'workspace'
        ? [...this.scopePins].reverse().find((p) => p.cwd === cwdIdentity)
        : undefined
    const scopeKey = pin ? pin.scopeKey : mode === 'user' ? USER_SCOPE_KEY : computeScopeKey(ownerCwd)
    const dataDir = resolveDataDir(mode, ownerCwd)
    const dbPath = join(dataDir, dbFileName(scopeKey))
    const dbCacheKey = workspaceIdentity(dbPath)
    let h = this.scopes.get(dbCacheKey)
    if (!h) {
      mkdirSync(dataDir, { recursive: true })
      const db = openDb(dbPath)
      try {
        if (mode === 'workspace') {
          const migration = migrateLegacyScopeDatabases(db, dataDir, dbPath, scopeKey, ownerCwd)
          for (const warning of migration.warnings) this.ctx.logger?.warn?.('[yolo] %s', warning)
          if (migration.imported.length > 0) this.ctx.logger?.info?.('[yolo] merged legacy workspace stores: %s', migration.imported.join(', '))
        }
        h = { db, scopeKey, dataDir }
        this.scopes.set(dbCacheKey, h)
      } catch (error) {
        db.close()
```

</details>

**依据 4 · 源码核查**：[src/storage/db.ts:83-131](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/db.ts#L83-L131)

WAL NORMAL与真实事务/rollback。

<details>
<summary>查看原文（49行）</summary>

```text
export function openDb(dbPath: string): DB {
  const db = new YoloDatabase(dbPath)
  try {
    db.exec('PRAGMA journal_mode = WAL')
    db.exec('PRAGMA foreign_keys = ON')
    db.exec('PRAGMA synchronous = NORMAL')
    db.exec(loadSchema())
    migrate(db)
    return db
  } catch (error) {
    db.close()
    throw error
  }
}

let savepointSequence = 0

/**
 * Execute a synchronous callback atomically.
 *
 * Node's built-in SQLite API intentionally exposes SQL transaction primitives
 * instead of a callback helper. Use a savepoint when the caller is already in
 * a transaction so repository operations remain safely composable.
 */
export function withTransaction<T>(db: DB, callback: () => T): T {
  if (db.isTransaction) {
    const savepoint = `yolo_nested_${++savepointSequence}`
    db.exec(`SAVEPOINT ${savepoint}`)
    try {
      const result = callback()
      db.exec(`RELEASE SAVEPOINT ${savepoint}`)
      return result
    } catch (error) {
      db.exec(`ROLLBACK TO SAVEPOINT ${savepoint}`)
      db.exec(`RELEASE SAVEPOINT ${savepoint}`)
      throw error
    }
  }

  db.exec('BEGIN IMMEDIATE')
  try {
    const result = callback()
    db.exec('COMMIT')
    return result
  } catch (error) {
    if (db.isTransaction) db.exec('ROLLBACK')
    throw error
  }
}
```

</details>

**依据 5 · 源码核查**：[src/storage/index.ts:715-739](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/storage/index.ts#L715-L739)

动作结果与状态同事务。

<details>
<summary>查看原文（25行）</summary>

```text
  runIdempotentAction(
    cwd: string,
    clientActionId: string,
    requestHash: string,
    execute: () => string,
  ):
    | { status: 'fresh' | 'replay'; outcome_json: string }
    | { status: 'conflict' } {
    const h = this.resolve(cwd)
    return withTransaction(h.db, () => {
      const existing = repo.getClientAction(h.db, h.scopeKey, clientActionId)
      if (existing) {
        return existing.request_hash === requestHash
          ? { status: 'replay' as const, outcome_json: existing.outcome_json }
          : { status: 'conflict' as const }
      }
      const outcomeJson = execute()
      repo.saveClientAction(h.db, {
        scope_key: h.scopeKey,
        client_action_id: clientActionId,
        request_hash: requestHash,
        outcome_json: outcomeJson,
      })
      return { status: 'fresh' as const, outcome_json: outcomeJson }
    })
```

</details>

**依据 6 · 源码核查**：[src/ui/actions.ts:107-128](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/ui/actions.ts#L107-L128)

动作成功后快照尽力失败隔离。

<details>
<summary>查看原文（22行）</summary>

```text
        const dispatch = (): YoloActionOutcome => {
          const actionCwd = meta ? meta.cwd : cwd()
          const scope = meta?.workspaceId
            ? { kind: 'workspace' as const, workspaceId: meta.workspaceId }
            : yolo.scopeRefForCwd(actionCwd)
          const outcome = applyYoloActionInScope(yolo, scope, req)
          if (outcome.ok && req.action !== 'handled' && req.kind !== 'attention') {
            // keep today's Markdown snapshot in lockstep with the DB (TE-8);
            // notification dismissals are pure UI state and skip the rewrite.
            // Snapshot failure must not fail the action.
            try {
              yolo.writeSnapshot(actionCwd)
            } catch {
              /* best-effort */
            }
          }
          return outcome
        }
        const outcome = dispatch()
        send(res, outcome.ok ? 200 : outcome.httpStatus, outcome)
      } catch (e) {
        send(res, 400, { ok: false, error: e instanceof Error ? e.message : String(e), code: 'invalid_request' })
```

</details>

#### 缺口

- 未测磁盘满/掉电/多进程、catalog迁移与快照恢复。
  **影响**：只能说明单库事务机制，不保证全生命周期恢复/OS保密。
  **进一步探讨**：副本中核跨scope/符号路径、COMMIT失败和快照失败，分别比DB/通知/Markdown并保留备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 到期后通知与专属会话结果怎样区分？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

runReminderTick从开放且last_reminded_at为空的due事项取候选，quiet窗口暂缓不标已提醒；一次runWorkspaceTransaction把通知卡、reminder_fired事件、已提醒stamp放一起，失败回滚后下tick仍可重试。Host在线轮询已到期未标记项，所以可补离线到期，但Host停机时无外部唤醒/系统推送，时效取决于下次启动和tick。所有已知workspace扫描，一个库失败捕获不阻其他库；改enabled只停due scan，snapshot/brief另有开关。

事务之后deliver到YoloSessions.ensure→resume/create→agent.followup user消息，不是只写静态卡；followup未等待模型完成，deliver失败catch吞，通知卡是规范可见面，不能用notified计数说聊天/用户已收/任务完成。agent默认模型/工具能力来自Host，本项未绑定完整Host agent setup，不作系统级“不会任何外部操作”保证。

早晚简报不同：收多workspace事实、可模型polish、再addNotification/addEvent并逐库stamp；这些跨库操作未包共同事务。briefInFlight是进程内防重入，写卡后某stamp失败时可能有部分结果/下tick重复风险，未复现，不能把due提醒的单库原子保证套到简报。卸载清timer不撤销已经提交或排队的聊天/模型请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/reminder/scheduler.ts:70-121](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/reminder/scheduler.ts#L70-L121)

due/quiet、事务卡/事件/stamp及聊天尽力。

<details>
<summary>查看原文（52行）</summary>

```text
export function runReminderTick(deps: {
  yolo: Yolo
  cwd: () => string
  aheadMs: number
  now?: () => Date
  quiet?: QuietHours
  deliver?: YoloDeliver
}): TickResult {
  const cwd = deps.cwd()
  const now = deps.now?.() ?? new Date()
  const due = deps.yolo.listTodos(cwd)
    .filter((todo) => isTodoOpen(todo.status) && todo.last_reminded_at == null && isDueAtReached(todo.due_at, now, deps.aheadMs))
    .sort((a, b) => compareDueAt(a.due_at, b.due_at))

  // Outside the user's active hours, hold the reminder (do NOT mark it
  // reminded) so it fires on the first tick after the window — the promise
  // "到点就提醒" is kept without ever pinging at an inappropriate time.
  const q = deps.quiet
  const quietNow = deps.quiet ? localHm(q!.now?.() ?? now) : ''
  const hold = !!q?.enabled && inQuietWindow(quietNow, q!.start, q!.end)

  let notified = 0
  for (const t of due) {
    if (hold) continue
    const text = reminderText(t.title, t.due_at)
    // Write the card, the audit event and the reminded stamp in one
    // transaction so a partial failure cannot leave a fired-but-unmarked todo
    // (which would re-fire on the next tick and duplicate the card).
    deps.yolo.runWorkspaceTransaction(cwd, () => {
      deps.yolo.addNotification(cwd, {
        kind: 'reminder',
        title: `⏰ ${t.title}`,
        body: t.due_at ? `到期 ${t.due_at}` : null,
        todo_id: t.id,
        scope_cwd: cwd,
      })
      deps.yolo.addEvent(cwd, {
        kind: 'reminder_fired',
        summary: `⏰ 提醒「${t.title}」`,
        detail: t.due_at ? `到期 ${t.due_at}` : null,
        source: 'tool',
      })
      deps.yolo.setTodoReminded(cwd, t.id)
    })
    if (deps.deliver) {
      void deps
        .deliver(cwd, text)
        .catch(() => {}) // the card is the guaranteed surface; chat delivery is best effort
    }
    notified++
  }
  return { notified }
```

</details>

**依据 2 · 源码核查**：[src/reminder/index.ts:58-71](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/reminder/index.ts#L58-L71)

真实ensure/followup接线。

<details>
<summary>查看原文（14行）</summary>

```text
  // reminder delivery target: the workspace's YOLO resident thread (v0.3.0 B)
  // v0.3.3: created with the harness model selection so the agent replies.
  const sessions = yctx.yolo.conversations.get(
    (ctx as { agents?: AgentsLike }).agents,
    { info: (f, ...a) => ctx.logger?.info?.(f, ...a), warn: (f, ...a) => ctx.logger?.warn?.(f, ...a) },
    () => {
      const sel = (ctx as { get?: (s: string) => { currentSelection(): { provider: string; model: string } } | undefined }).get?.('agentDefaultModel')
      return sel?.currentSelection()
    },
  ).sessions
  const deliver = async (cwd: string, text: string): Promise<void> => {
    const agent: AgentLike | undefined = await sessions.ensure(cwd)
    if (!agent) return
    agent.followup(createUserMessage({ content: [{ type: 'text', text }], source: { kind: 'user' } }))
```

</details>

**依据 3 · 源码核查**：[src/application/conversation/index.ts:104-139](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/conversation/index.ts#L104-L139)

resume/create resident agent实际路径。

<details>
<summary>查看原文（36行）</summary>

```text
  async ensure(cwd: string): Promise<AgentLike | undefined> {
    if (!this.agents) return undefined
    const id = yoloSessionId(cwd)
    const live = this.agents.get(id)
    if (live) return live
    const pending = this.starting.get(cwd)
    if (pending) return pending
    const p = this.start(cwd, id).finally(() => this.starting.delete(cwd))
    this.starting.set(cwd, p)
    return p
  }

  private async start(cwd: string, id: SessionIdType): Promise<AgentLike | undefined> {
    const selection = this.defaultModelSelection?.()
    const setup = selection
      ? (agentCtx: unknown): void => {
          const ref: ModelSelectionRef = { current: selection, assembled: undefined }
          installModelSelection(agentCtx as never, ref)
        }
      : undefined
    const agentOptions = selection ? { provider: selection.provider, model: selection.model } : undefined
    try {
      const handle = await this.agents!.resume({ resumeSessionId: id, agentOptions, setup })
      this.logger?.info?.('[yolo-session] resumed %s', id)
      return handle.agent
    } catch {
      // no persisted log under this id — first boot for this workspace
    }
    try {
      const handle = await this.agents!.create({ sessionId: id, meta: { cwd: resolve(cwd) }, agentOptions, setup })
      this.logger?.info?.('[yolo-session] created %s', id)
      return handle.agent
    } catch (e) {
      this.logger?.warn?.('[yolo-session] create failed: %s', e instanceof Error ? e.message : String(e))
      return undefined
    }
```

</details>

**依据 4 · 源码核查**：[src/reminder/scheduler.ts:264-298](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/reminder/scheduler.ts#L264-L298)

全部workspace逐项扫描/失败隔离。

<details>
<summary>查看原文（35行）</summary>

```text
  const intervalMs = deps.intervalMs ?? DEFAULTS.reminderCheckIntervalSec * 1000
  const aheadMs = (): number => deps.aheadMs?.() ?? DEFAULTS.reminderAheadMin * 60_000

  const tick = (): void => {
    // Reading the scan targets touches the workspace registry, whose read path
    // also maintains per-row status. That I/O can fail transiently (a locked or
    // mid-compaction catalog DB). A background timer callback must NEVER take
    // the host down with an uncaught throw — log it and wait for the next
    // interval, which is exactly what the per-workspace loop below does for one
    // bad workspace.
    let targets: ReadonlyArray<{ cwd: string }>
    try {
      targets = targetsOf(deps)
    } catch (e) {
      ctx.logger?.warn?.('[yolo-reminder] scan targets unavailable: %s', e instanceof Error ? e.message : String(e))
      return
    }
    // One failing workspace (corrupt/locked DB) must not block the others.
    for (const t of targets) {
      try {
        // reminder.enabled=false idles ONLY the due scan; snapshots keep their cadence
        if (deps.reminderEnabled?.() ?? true) {
          runReminderTick({
            yolo: deps.yolo,
            cwd: () => t.cwd,
            aheadMs: aheadMs(),
            quiet: deps.quiet?.(),
            deliver: deps.deliver,
          })
        }
        if (deps.dailySnapshotsEnabled?.() ?? true) maybeWriteDailySnapshot(deps.yolo, () => t.cwd)
      } catch (e) {
        ctx.logger?.warn?.('[yolo-reminder] tick failed (%s): %s', t.cwd, e instanceof Error ? e.message : String(e))
      }
    }
```

</details>

**依据 5 · 源码核查**：[src/reminder/scheduler.ts:138-187](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/reminder/scheduler.ts#L138-L187)

简报聚合/模型与跨库stamp顺序。

<details>
<summary>查看原文（50行）</summary>

```text
export async function runBriefTick(deps: {
  yolo: Yolo
  cwd: () => string
  /** Workspaces represented by this one product-level brief. The notification
   * is stored in `cwd()`, while facts and daily stamps cover this whole set. */
  workspaces?: readonly string[]
  config: BriefConfig
  llm?: LlmRuntime
  provider?: string
  now?: () => Date
}): Promise<BriefTickResult> {
  const result: BriefTickResult = { morning: false, evening: false }
  if (!deps.config.enabled) return result
  const now = deps.now?.() ?? new Date()
  const hm = localHm(now)
  const today = localDateStr(now)
  const ownerCwd = deps.cwd()
  const cwds = [...new Set((deps.workspaces?.length ? deps.workspaces : [ownerCwd]).filter(Boolean))]
  const plan: { kind: BriefKind; time: string }[] = [
    { kind: 'morning', time: deps.config.morningTime },
    { kind: 'evening', time: deps.config.eveningTime },
  ]
  for (const { kind, time } of plan) {
    if (hm < time) continue
    // v0.3.1: the dashboard aggregates workspaces, therefore the brief is one
    // aggregate card. A stamp in any member is enough to recognize a legacy or
    // already-generated card; successful generation stamps every member so a
    // later change of the active workspace cannot generate a duplicate.
    if (cwds.some((cwd) => deps.yolo.getBriefStamp(cwd, kind) === today)) continue
    const facts =
      kind === 'morning'
        ? collectMorningFactsAcross(deps.yolo, cwds, today, now)
        : collectEveningFactsAcross(deps.yolo, cwds, today)
    const fallback = renderBriefMarkdown(kind, facts, today)
    const body = deps.llm
      ? await polishBrief(deps.llm, deps.provider ?? 'deepseek', deps.config.model, kind, facts, fallback)
      : fallback
    deps.yolo.addNotification(ownerCwd, {
      kind: 'brief',
      title: kind === 'morning' ? `早报 · ${today}` : `晚报 · ${today}`,
      body,
      scope_cwd: ownerCwd,
    })
    deps.yolo.addEvent(ownerCwd, {
      kind: 'brief_generated',
      summary: kind === 'morning' ? `生成早报（${today}）` : `生成晚报（${today}）`,
      source: 'tool',
    })
    for (const cwd of cwds) deps.yolo.setBriefStamp(cwd, kind, today)
    result[kind] = true
```

</details>

**依据 6 · 源码核查**：[src/reminder/scheduler.ts:303-345](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/reminder/scheduler.ts#L303-L345)

进程内brief防重与timer释放。

<details>
<summary>查看原文（43行）</summary>

```text
  let briefInFlight = false
  const briefTick = (): void => {
    if (!deps.briefs || briefInFlight) return
    try {
      const targets = targetsOf(deps)
      const tracked = deps.cwd()
      // Before the first work session, `cwd()` falls back to the host process
      // directory, which need not be a registered workspace. Never open a ghost
      // store merely to own the aggregate card: prefer the tracked workspace only
      // when it is one of the scan targets, otherwise use the first real target.
      const owner = targets.find((target) => (
        process.platform === 'win32'
          ? target.cwd.toLowerCase() === tracked.toLowerCase()
          : target.cwd === tracked
      ))?.cwd ?? targets[0]!.cwd
      // The once-per-day stamp is written only after the awaited LLM polish in
      // runBriefTick; an in-flight flag stops the next 30s tick from re-entering
      // and emitting a second card while that slow polish is still running.
      briefInFlight = true
      void runBriefTick({
        yolo: deps.yolo,
        cwd: () => owner,
        workspaces: targets.map((target) => target.cwd),
        config: deps.briefs.config(),
        llm: deps.briefs.llm,
        provider: deps.briefs.provider,
      }).catch((e: unknown) => {
        ctx.logger?.warn?.('[yolo-brief] tick failed (%s): %s', owner, e instanceof Error ? e.message : String(e))
      }).finally(() => {
        briefInFlight = false
      })
    } catch (e) {
      // Same rule as the reminder tick: the interval keeps running.
      ctx.logger?.warn?.('[yolo-brief] tick could not start: %s', e instanceof Error ? e.message : String(e))
    }
  }

  const timer = setInterval(tick, intervalMs)
  const briefTimer = deps.briefs ? setInterval(briefTick, DEFAULTS.briefCheckIntervalSec * 1000) : undefined
  return () => {
    clearInterval(timer)
    if (briefTimer) clearInterval(briefTimer)
  }
```

</details>

#### 缺口

- 未验真实Host专属对话终态、离线时效或简报部分失败。
  **影响**：通知卡不等用户已见；简报非跨库exactly-once，首试关闭brief。
  **进一步探讨**：非关键到期项离线重启核一张卡/对话失败不重卡，再模拟stamp失败核残留，记录延迟而非假定准时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 用户操作和永久删有没有真正授权/范围门禁？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

/yolo/actions为prefix POST，最多64KB JSON，scope_cwd有值先匹配known workspace，不许随意造未知库；无scope用tracked cwd，这不是每用户身份。实际handler未见Origin/CSRF/认证检查，须依赖Host监听与上游权限，不能把本地看板当公网安全API。入参决定相应本地计划状态，source和operation日志也不是可信人工身份。

bulk_cancel为可重开的状态变化，bulk_delete要求confirmation等于常量PERMANENT_DELETE然后实际删范围，单项永久删亦有常量；强确认是误触摩擦而非签名人批，直接HTTP可提供同字符串。client_action_id可选，存在才用hash+持久结果重放，缺省只有事务没有跨请求去重；重试换ID也非同一动作。永久删不可逆，应先预览/备份，取消优先，不能仅因前端有确认称执行已获真实授权。本轮不触永久删/身份反馈/跨项目合并。

#### 证据与依据

**依据 1 · 源码核查**：[src/ui/actions.ts:22-72](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/ui/actions.ts#L22-L72)

有界JSON读取。

<details>
<summary>查看原文（51行）</summary>

```text
const MAX_BODY_BYTES = 64 * 1024

/** Structural view of a Node IncomingMessage (method + readable stream). */
interface ReqLike {
  method?: string
  on(event: 'data', cb: (chunk: Buffer) => void): ReqLike
  on(event: 'end', cb: () => void): ReqLike
  on(event: 'error', cb: (err: Error) => void): ReqLike
}

function toReqLike(v: unknown): ReqLike | undefined {
  if (typeof v === 'object' && v !== null && typeof (v as ReqLike).on === 'function') return v as ReqLike
  return undefined
}

function send(res: { writeHead(status: number, headers: Record<string, string>): void; end(body?: string): void }, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

/** Read and JSON-parse the request body, enforcing the 64KB cap. */
function readJsonBody(req: ReqLike): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    let settled = false
    req.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        settled = true
        reject(new Error('payload too large (max 64KB)'))
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(new Error('invalid JSON body'))
      }
    })
    req.on('error', (err) => {
      if (settled) return
      settled = true
      reject(err)
    })
  })
```

</details>

**依据 2 · 源码核查**：[src/ui/actions.ts:75-128](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/ui/actions.ts#L75-L128)

实际POST/scope和状态dispatch，无本层身份校验。

<details>
<summary>查看原文（54行）</summary>

```text
/** Serve POST /yolo/actions — in-place plan operations for the dashboard. */
export function registerActionsEndpoint(ctx: { webServer?: WebServerLike }, yolo: Yolo, cwd: () => string): void {
  ctx.webServer?.register({
    kind: 'prefix',
    path: '/yolo/actions',
    handler: async (req, res) => {
      const r = toReqLike(req)
      const method = (r?.method ?? '').toUpperCase()
      if (method !== 'POST') {
        send(res, 405, { ok: false, error: 'method not allowed (POST only)', code: 'method_not_allowed' })
        return
      }
      if (!r) {
        send(res, 400, { ok: false, error: 'bad request', code: 'bad_request' })
        return
      }
      try {
        const body = await readJsonBody(r)
        if (typeof body !== 'object' || body === null || Array.isArray(body)) {
          send(res, 400, { ok: false, error: 'body must be a JSON object', code: 'invalid_body' })
          return
        }
        const req = body as YoloActionRequest
        // Route only through the canonical cwd registry. Equivalent Windows
        // spellings resolve to the registry-owned cwd; an unknown path must not
        // silently create a ghost workspace store.
        const scopeHeader = typeof req.scope_cwd === 'string' && req.scope_cwd ? req.scope_cwd : undefined
        const meta = scopeHeader ? findKnownWorkspaceScope(scopeHeader, yolo.listWorkspaceMeta()) : undefined
        if (scopeHeader && !meta) {
          send(res, 400, { ok: false, error: 'unknown workspace scope', code: 'unknown_workspace_scope' })
          return
        }
        const dispatch = (): YoloActionOutcome => {
          const actionCwd = meta ? meta.cwd : cwd()
          const scope = meta?.workspaceId
            ? { kind: 'workspace' as const, workspaceId: meta.workspaceId }
            : yolo.scopeRefForCwd(actionCwd)
          const outcome = applyYoloActionInScope(yolo, scope, req)
          if (outcome.ok && req.action !== 'handled' && req.kind !== 'attention') {
            // keep today's Markdown snapshot in lockstep with the DB (TE-8);
            // notification dismissals are pure UI state and skip the rewrite.
            // Snapshot failure must not fail the action.
            try {
              yolo.writeSnapshot(actionCwd)
            } catch {
              /* best-effort */
            }
          }
          return outcome
        }
        const outcome = dispatch()
        send(res, outcome.ok ? 200 : outcome.httpStatus, outcome)
      } catch (e) {
        send(res, 400, { ok: false, error: e instanceof Error ? e.message : String(e), code: 'invalid_request' })
```

</details>

**依据 3 · 源码核查**：[src/application/commands/apply-yolo-action.ts:381-409](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/commands/apply-yolo-action.ts#L381-L409)

常量确认与真实范围cancel/delete。

<details>
<summary>查看原文（29行）</summary>

```text
    const rangeError = validateTodoRange(selector)
    if (rangeError) return deny(yolo, cwd, r, rangeError, 400, 'invalid_todo_range')
    if (action === 'bulk_delete' && r.confirmation !== 'PERMANENT_DELETE') {
      return deny(yolo, cwd, r, 'bulk_delete requires permanent-delete confirmation', 400, 'permanent_delete_confirmation_required')
    }
    if (action === 'bulk_cancel') {
      const items = yolo.cancelTodosInRange(cwd, selector, { session_id: sessionId ?? null })
      return {
        ok: true,
        item: { action, affected: items.length, ids: items.map((item) => item.id), ...selector },
        learning_receipt: {
          type: items.length > 0 ? 'state_change' : 'no_learning',
          summary: items.length > 0 ? `已取消 ${items.length} 项` : '范围内没有可取消的开放事项',
          scope: 'workspace',
          reversible: items.length > 0,
        },
      }
    }
    const deleted = yolo.deleteTodosInRange(cwd, selector, { session_id: sessionId ?? null })
    return {
      ok: true,
      item: { action, affected: deleted.ids.length, ids: deleted.ids, deleted_record_count: deleted.deleted_record_count, ...selector },
      ...(deleted.audit_event_id ? { audit_event_id: deleted.audit_event_id } : {}),
      learning_receipt: {
        type: deleted.ids.length > 0 ? 'state_change' : 'no_learning',
        summary: deleted.ids.length > 0 ? `已永久删除 ${deleted.ids.length} 项` : '范围内没有可永久删除的事项',
        scope: 'workspace',
        reversible: false,
      },
```

</details>

**依据 4 · 源码核查**：[src/application/commands/apply-yolo-action.ts:837-852](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/application/commands/apply-yolo-action.ts#L837-L852)

可选client_action_id与事务/幂等分流。

<details>
<summary>查看原文（16行）</summary>

```text
/** Validate + dispatch with an optional durable, cross-restart idempotency key. */
export function applyYoloAction(yolo: Yolo, cwd: string, r: YoloActionRequest): YoloActionOutcome {
  const rawId = r.client_action_id
  if (rawId !== undefined && (typeof rawId !== 'string' || !rawId.trim() || rawId.length > 128)) {
    return deny(yolo, cwd, r, 'client_action_id must be a non-empty string up to 128 characters', 400, 'invalid_client_action_id')
  }
  const clientActionId = rawId?.trim()
  if (!clientActionId) return yolo.runWorkspaceTransaction(cwd, () => applyYoloActionOnce(yolo, cwd, r))

  const hash = hashYoloActionRequest(r)
  const result = yolo.runIdempotentAction(
    cwd,
    clientActionId,
    hash,
    () => {
      const outcome = applyYoloActionOnce(yolo, cwd, r)
```

</details>

#### 缺口

- 未审完整Host认证、所有UI确认和repository批删/反馈实现。
  **影响**：不能宣称租户隔离或授权安全；只推荐可信本机副本。
  **进一步探讨**：固定Host监听/认证，核无Origin本地请求与scope错配、同/无actionId重试；永久删仅副本验证。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 怎样可控试用，成本与可证伪改进是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议有兼容本地DSH的用户，在新的脱敏workspace副本记录一个非关键事项，先关semantic扩展/重排、brief及跨workspace聚合，明确extraction模型/开关和每日run限制，只看来源/状态，再由用户手动核截止。无明确同意不把工作/个人私密记忆发到模型；人工记待办仍是退路。插件Node ^22.19或>=24、作者称Host0.1.5-rc.1+，依赖实际llm/sessions/settings/tools/agents与Web slots，静态范围不等实际兼容。

首次是profile/模型/权限/备份配置；持续抽取还有identity resolver（即使policy未启仍可能调用）、semantic query expansion/rerank、brief和专属回复多模型面；每日run cap不是整插件现金上限，常量tokenBudget存在不作已接通强预算保证。SQLite/FTS/快照与记录原文占磁盘，人工修误记/时间区/近名身份；省时/漏记减少和费用未知。退出关各自动面再卸载，保留DB与Markdown/来源，已排队模型/专属会话另查，不以清看板代删全部敏感数据。

候选是统一展示“输入已观察/被跳过/抽取失败/事项已提交/卡已生成/聊天待核”收据，别把一处ok变用户已获提醒。用模型坏JSON、提交后进程退出、聊天不可用三样本，比较现有日志和收据的漏记发现/错误重试及维护负担；若现有错误/卡和人工核足够或收据增加噪声则推翻。不是本版已完成能力或商业创新。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/package.json#L1-L8)

版本/Node下限。

```text
{
  "name": "dsh-plugin-yolo",
  "version": "0.5.0",
  "description": "Personal assistant plugin for deepseek-harness that organizes commitments from conversations, tracks plans across sessions, and delivers low-interruption reminders.",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 作者声明**：[README.md:55-59](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/README.md#L55-L59)

作者Host要求。

```text
YOLO 需要运行在 **dsh 0.1.5-rc.1 或更新版本**的宿主上；更旧的宿主无法加载本版的
浏览器面板，插件设置页也不会出现这一版的配置卡（用 `npx @deepseek-ai/dsh --version` 确认，必要时
`npm install -g @deepseek-ai/dsh@latest` 升级）。

安装 [Node.js](https://nodejs.org/) 22 LTS（至少 22.19）或 Node.js 24，并确保 `pnpm` 命令可用。
```

**依据 3 · 源码核查**：[src/shared/constants.ts:23-63](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/shared/constants.ts#L23-L63)

自动面默认/预算常量。

<details>
<summary>查看原文（41行）</summary>

```text
export const DEFAULTS = {
  scope: 'workspace' as const,
  // Short enough for minute-scale reminders to feel on time. The sidebar feed
  // polls every 5s, so a due card is normally visible within ~35s of its time.
  reminderCheckIntervalSec: 30,
  reminderAheadMin: 0,
  // v0.3.2 quiet-hours gate (borrowed from dsh-memory-evolve): outside this
  // window reminders are held and fire on the first tick after the window.
  reminderQuietEnabled: false,
  reminderQuietStart: '22:00',
  reminderQuietEnd: '08:00',
  extractionMinIntervalSec: 30,
  extractionTokenBudgetPerTurn: 2048,
  extractionTokenBudgetPerDay: 100_000,
  recallMaxTokens: 512,
  recallTopK: 5,
  recallKindQuota: 2,
  recallPrefsMax: 12,
  extractionMinTurnChars: 4,
  extractionMaxRunsPerDay: 300,
  snapshotKeepDays: 90,
  recallLogRetentionDays: 30,
  semantic: {
    enabled: true,
    model: 'deepseek-chat',
    expansionsPerQuery: 3,
    rerankOn: true,
    maxRerankCandidates: 8,
    dailyBudget: 60,
    minQueryChars: 6,
    degradeAfterEmpty: 5,
  },
  ui: {
    aggregateAcrossWorkspaces: false,
    focusDefaultCount: 0,
  },
  briefEnabled: true,
  briefMorningTime: '09:00',
  briefEveningTime: '21:00',
  briefModel: 'deepseek-chat',
  briefCheckIntervalSec: 30,
```

</details>

**依据 4 · 源码核查**：[src/memory/index.ts:49-95](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/memory/index.ts#L49-L95)

semantic扩展/重排真实额外模型调用。

<details>
<summary>查看原文（47行）</summary>

```text
  const prewarmSemantic = (session: Session, text: string): void => {
    if (!llm) return
    const query = text.trim()
    const cfg = readSemanticConfig((ctx as unknown as { settings?: SettingsLike }).settings)
    semantic.setConfig(cfg)
    if (!semantic.shouldExpand(query)) return
    const cwd = sessionCwd(session) ?? yctx.yolo.observations.latestWorkspaceCwd(process.cwd())
    const session_id = sessionId(session) ?? null
    void (async () => {
      const started = Date.now()
      try {
        const expansions = await expandQuery(llm, { model: cfg.model, text: query, topK: cfg.expansionsPerQuery })
        const latency = Date.now() - started
        semantic.noteOutcome(expansions.length > 0)
        semantic.rememberExpansions(query, expansions)
        semantic.consumeDaily()
        const detHits = yctx.yolo.search(cwd, query, DEFAULTS.recallTopK)
        const expanded = dedupeSearchHits([...detHits, ...expansions.flatMap((e) => yctx.yolo.search(cwd, e, DEFAULTS.recallTopK))])
        let rerankOutcome: RerankVerdict[] | undefined
        if (cfg.rerankOn && expanded.length > 0) {
          rerankOutcome = await rerankCandidates(llm, {
            model: cfg.model,
            query,
            candidates: expanded.slice(0, cfg.maxRerankCandidates),
            limit: cfg.maxRerankCandidates,
          })
          if (rerankOutcome.length) semantic.rememberRerank(query, expanded, rerankOutcome)
        }
        yctx.yolo.logRecall(cwd, {
          session_id,
          query,
          expansions: expansions.length ? JSON.stringify(expansions) : null,
          rerank_outcome: rerankOutcome?.length ? JSON.stringify(rerankOutcome) : null,
          latency_ms: latency,
          source: 'user',
          status: expansions.length ? 'ok' : 'empty',
        })
      } catch (e) {
        semantic.noteOutcome(false)
        yctx.yolo.logRecall(cwd, {
          session_id,
          query,
          source: 'user',
          status: 'error',
          error: e instanceof Error ? e.message : String(e),
          latency_ms: Date.now() - started,
        })
```

</details>

**依据 5 · 源码核查**：[src/extract/index.ts:373-408](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/extract/index.ts#L373-L408)

抽取之外resolver模型即使policy可选仍调用。

<details>
<summary>查看原文（36行）</summary>

```text
          const result = await llmExtract({
            llm: yctx.llm,
            provider: route.provider,
            model: route.model,
            turnText,
            knownContext: buildKnownMemoryContext(yctx.yolo, cwd),
            signal: controller.signal,
            // Resolve “today/tomorrow” from when the host accepted the user's
            // input, not from a later idle/spacing boundary that may cross midnight.
            now: new Date(acceptedAt ?? started),
            observe: (value) => { observation = value },
          })
          const hasContent = result.todos.length > 0 || result.milestones.length > 0 || result.goals.length > 0 || result.updates.length > 0
          const resolverStarted = Date.now()
          const minConfidence = config?.todoIdentityR2MinConfidence
          let resolverObservation: TodoResolverObservation | undefined
          let resolutions: ShadowTodoResolution[] = []
          let resolverError: unknown
          try {
            resolutions = await llmResolveTodoIdentity({
              llm: yctx.llm,
              provider: route.provider,
              model: route.model,
              turnText,
              candidates: todoCandidates,
              signal: controller.signal,
              now: new Date(acceptedAt ?? started),
              minConfidence,
              observe: (value) => { resolverObservation = value },
            })
          } catch (error) {
            resolverError = error
          }
          const todoIdentityPlan = resolverError
            ? undefined
            : planTodoIdentityApplication(result, resolutions, todoCandidates, config?.todoIdentityR2Enabled === true, minConfidence)
```

</details>

**依据 6 · 源码核查**：[src/reminder/scheduler.ts:172-186](https://github.com/hanshanyike/dsh-yolo/blob/c87d70105f975d86c5c0f98f34fbce66657a6934/src/reminder/scheduler.ts#L172-L186)

可选polish和通知/stamp。

<details>
<summary>查看原文（15行）</summary>

```text
    const body = deps.llm
      ? await polishBrief(deps.llm, deps.provider ?? 'deepseek', deps.config.model, kind, facts, fallback)
      : fallback
    deps.yolo.addNotification(ownerCwd, {
      kind: 'brief',
      title: kind === 'morning' ? `早报 · ${today}` : `晚报 · ${today}`,
      body,
      scope_cwd: ownerCwd,
    })
    deps.yolo.addEvent(ownerCwd, {
      kind: 'brief_generated',
      summary: kind === 'morning' ? `生成早报（${today}）` : `生成晚报（${today}）`,
      source: 'tool',
    })
    for (const cwd of cwds) deps.yolo.setBriefStamp(cwd, kind, today)
```

</details>

#### 缺口

- 没有真实兼容/数据准确/提醒延迟/账单和退出验收。
  **影响**：只能低风险小样本试用，不能用它作唯一关键提醒系统。
  **进一步探讨**：记录漏抽/误更新/卡与聊天差异、每角色usage和人工修正分钟，与手工待办一周同集比较再决定常驻。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
