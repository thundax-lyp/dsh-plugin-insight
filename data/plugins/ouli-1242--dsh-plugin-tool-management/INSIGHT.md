# DSH Tool Management

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8bb5beb](https://github.com/ouli-1242/dsh-plugin-tool-management/tree/8bb5beba6643d1bbb2410b7a05034a83ca67aa34)

<!-- BEGIN META -->
[![GitHub ★ 50](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=50&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ouli-1242/dsh-plugin-tool-management) [![npm 30d 8,802](https://img.shields.io/static/v1?label=npm+30d&message=8%2C802&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-tool-management) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-tool-management)
<!-- END META -->

> **功能**：在 DSH 中集中管理 MCP、技能、记忆、场景等资源及分作用域的模型工具表。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 让模型只在当前需要时自助发现并恢复本插件工具，作用域、审计与界面共用状态。相对全量工具，更容易减少无关 schema。

> **主要限制**：[Q03](#research-q03) 自助恢复表示隐藏通常可逆。执行约束依赖宿主 guard，HTTP 令牌和工具确认分别约束不同路径，宿主鉴权退化后回环不足以区分本机进程。

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
  - [Q01 · 哪类任务需要分作用域管理工具？](#detail-section-11)
  - [Q02 · 模型如何发现、重新开启或关闭当前工具？](#detail-section-12)
  - [Q03 · 暴露策略、工具审批与 HTTP 鉴权各保护什么？](#detail-section-13)
  - [Q04 · 兼容范围、持久化和 inventory 告警如何解释？](#detail-section-14)
  - [Q05 · 怎样验证两个并行任务的开关和退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 同时运行多个任务的开发者需要让每个任务只接触相关的管理工具，并能核对恢复工具的作用域。[Q01](#research-q01)

手工配置宿主或为任务建独立 profile 可减少共享影响，切换、核对和恢复需人执行。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工具表控制 | 调整当前作用域的自家模型工具 | 可自助恢复，须实际宿主执行守卫 |
| 全局与工作区配置 | 组织并行任务与管理环境 | 不同作用域及确认策略分别核验 |
| Web 管理操作 | 调用宿主管理 API | 由实际 Host 栅栏及访问令牌保护 |
| 恢复与备份 | 诊断损坏侧车和恢复设置 | 核对明文、实际备份与生产状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配 DSH 与 Node 24.9 以上 | 根插件需要 | 挂载宿主和 Web 模块 | 兼容诊断后决定 |
| Agent restrict 和工具 guard | 工具约束验收需要 | 分别隐藏与拒绝派发 | 停用权限用途 |
| Host Connection 与访问令牌 | 受控 HTTP 使用需要 | 授权管理及敏感读取 | 停止管理写入 |
| 独立 profile 与备份 | 验收需要 | 回滚测试配置 | 保留观察 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者配置独立 profile 和两个会话 | 确认版本和鉴权 |
| 对照 | 观察工具表、直呼和自助恢复 | 工具范围与实际派发相符 |
| 边界 | 核查 global、锁定和子 Agent | 拒绝及确认符合预期 |
| 退出 | 停用并核对侧车与备份 | 需要时用原生配置恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 相容宿主和测试 profile | 核对注入及作用域 | 加载未测 |
| 持续 | 上下文、日志与侧车 | 校验权限、设置和管理令牌 | 实际 token 收益未知 |
| 失败恢复 | 配置副本和必要日志 | 区别状态、护栏和 host 降级 | 发布物及回退未测 |
| 退出 | 备份和必要状态 | 禁用并核查明文、副本和连接 | 实际清理未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按需工具 | 已注册控制工具及逐条启停 | 实际请求和上下文节约 |
| 作用域 | 全局、会话及 workspace 的写入选择 | 真实并发、子代理和宿主时序 |
| 管理权限 | 确认、guard、令牌和回环退路 | 目标环境的权限有效性 |

> **思考**：[Q03](#research-q03) 自助恢复表示隐藏通常可逆。执行约束依赖宿主 guard，HTTP 令牌和工具确认分别约束不同路径，宿主鉴权退化后回环不足以区分本机进程。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 让模型只在当前需要时自助发现并恢复本插件工具，作用域、审计与界面共用状态。相对全量工具，更容易减少无关 schema。

[Q02](#research-q02) 状态写入后异步重排，显示与执行走独立宿主 API。[Q03](#research-q03) 模型确认和 HTTP 令牌分别检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自助恢复表示隐藏通常可逆。执行约束依赖宿主 guard，HTTP 令牌和工具确认分别约束不同路径，宿主鉴权退化后回环不足以区分本机进程。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察。先在隔离 profile 验证关闭、模型自助、全局审批和无令牌行为；出现权限降级或结果不明就停用并人工回退。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具表、逐条更新、两层限制和鉴权退路。八项逐文件告警限于三个待拼接浏览器片段，未实测发布构建、宿主权限或 token 收益。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/tools/table.ts、src/tools/control.ts、src/scope/resolve.ts、src/mcp/tool-visibility.ts、src/confirm-gate.ts、src/http-api.ts、src/http-fence.ts、src/request-gate.ts、scripts/sync-client.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次固定根 DSH 源码。inventory 纳入 180 项，排除 1 项，8 条解析告警全部为 3 个浏览器拼接片段。代表 Host 入口、工具表与鉴权可以追踪，未执行目标构建、宿主或全域验收。
- 下一步：[Q05](#research-q05) 对两个隔离会话记录真实 schema、被关工具派发、自助恢复、子 Agent、全局审批与无令牌返回，再核对侧车。

**分析版本**

- **仓库**：[ouli-1242/dsh-plugin-tool-management](https://github.com/ouli-1242/dsh-plugin-tool-management)
- **版本号**：0.22.4（[固定提交 8bb5beb](https://github.com/ouli-1242/dsh-plugin-tool-management/tree/8bb5beba6643d1bbb2410b7a05034a83ca67aa34)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 分开呈现可自助恢复与必须拒绝的能力，并显示真实作用域和执行证据，可能降低配置误判。

[Q05](#research-q05) 对两个隔离会话记录真实 schema、被关工具派发、自助恢复、子 Agent、全局审批与无令牌返回，再核对侧车。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 2631 | — | — | 69576 |
| .mjs | source | 8 | 2181 | 1505 | 581 | — |
| .ts | source | 138 | 55975 | 35856 | 18275 | — |
| .js | source | 22 | 22135 | 15159 | 6834 | — |
| .mjs | test | 3 | 5574 | 4141 | 1039 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ouli-1242/dsh-plugin-tool-management/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/ouli-1242/dsh-plugin-tool-management/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/ouli-1242/dsh-plugin-tool-management/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户如何按作用域管理重复任务的工具暴露，哪些模型自助开关、确认和宿主 HTTP 权限会改变采用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类任务需要分作用域管理工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同时在 DSH 运行写作和编码任务、又不想让全部管理工具占用上下文的用户，可以为工作区或会话保留工具表，使用时自助找回需要的插件工具。验收应在两个会话看到正确工具、归属和调整结果。手工更改宿主设置或每任务用独立 profile 可以清楚隔离，但要重复配置和重启核对。该根包提供 MCP、技能、记忆、人设、场景及提示配置入口，本轮只确认模型工具表及其 HTTP 边界。作者的 24 工具及默认 6/18 是其说明。固定代码有默认隐藏名表，真实注册受宿主及注册失败影响，inventory 候选不用于推导实际数量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-80](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/README.md#L68-L80)

作者解释三层和任务动机。

<details>
<summary>查看原文（13行）</summary>

```text
## 三种作用域

默认每个对话各一份设置。在**兼容页 → 生效层级**切换一次，整个面板和模型工具都跟着这一层走：

|                | 全部全局                 | 按工作区               | 按会话（默认）         |
|:-------------- |:------------------------ |:---------------------- |:---------------------- |
| **谁共用一套** | 所有对话                 | 同一工作区的对话       | 每个对话各自一份       |
| **适合**       | 一个人一台机器，处处一致 | 一个项目一套环境       | 同一项目并行不同任务   |
| **切走会丢吗** | —                        | 不删记录，调回来即恢复 | 不删记录，调回来即恢复 |

面板顶部那条选择器可以切到某个对话或工作区，直接看它自己的那份设置；锁着的时候解锁口也在那一行。同一层里，每个开关按 **本层改过 > 进入的场景 > 创建时快照 > 全局** 取最上面有话说的一层。

场景在三种粒度下都能用。按会话时，A 对话进「编程」、B 对话留在「写作」，各自的 MCP、技能、人设互不干扰。
```

</details>

**依据 2 · 作者声明**：[README.md:96-104](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/README.md#L96-L104)

作者口径和模型自助开关。

```text
## 让 Agent 管这个插件

六个域共 **24 条模型工具**：列清单、读正文、新建、修改、删除、启停、进出场景、应用提示词、派子智能体。

- **默认只发 6 条**（约 1.5k token/轮），其余 18 条关着。关掉不是藏起来，是**根本没进 schema**——模型看不到，也调不到。
- **按层生效**：模型默认只改当前这一层，回执会说清写的是哪一层；带 `scope: "global"` 才动全局。
- **写操作有确认卡**：停机、删除、开关落到机器级等都会先问一句；恢复动作（重启 / 还原 / 取消应用）不拦。会话处于「完全权限」审批策略（`never`）时不弹卡、直接放行，只记一条日志。
- **逐条可开关**：兼容页的「模型工具表」按层调整，24 条全开约 6.1k token/轮；可以按任务存成不同方案，跟场景一起切。
- **关掉的模型自己能开**：常驻的那条 `tool_manager_tools` 能列出这个对话关着的工具（名字 + 用途 + ≈token）并按需打开 —— 用户说「进入某个场景」而场景工具恰好关着时，模型有路走，不用回头找用户。
```

**依据 3 · 源码核查**：[package.json:2-16](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/package.json#L2-L16)

根包版本和宿主/客户端导出。

<details>
<summary>查看原文（15行）</summary>

```text
  "name": "dsh-plugin-tool-management",
  "version": "0.22.4",
  "description": "一个设置面板，统一管理 MCP、技能、记忆、子智能体、提示词和归档会话；可自定义搭配场景，一个场景即可切换整个环境；Agent也能帮你操作这个插件。",
  "repository": {
    "type": "git",
    "url": "https://github.com/ouli-1242/dsh-plugin-tool-management"
  },
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./workspace": "./lib/sessions/workspace.js",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:20-23](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/cordis.patch.yml#L20-L23)

真实 loader 行。

```text
- insert:
    - id: dsh-plugin-tool-management
      name: 'dsh-plugin-tool-management'
      disabled: !!js "(function () { try { return [...ctx.loader.entries()].some((e) => e.options.id !== 'dsh-plugin-tool-management' && e.options.name === 'dsh-plugin-tool-management' && e.options.disabled !== true && typeof e.options.disabled !== 'object') } catch (err) { return false } })()"
```

**依据 5 · 源码核查**：[src/index.ts:254-269](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L254-L269)

宿主 apply 和依赖。

<details>
<summary>查看原文（16行）</summary>

```text
export const INJECT_SERVICES = [
  'timer', 'fs', 'settings', 'sandboxPolicy', 'webServer', 'tools', 'skills', 'sessions',
  'agents', 'workspaceRegistry', 'sessionProjectionCache', 'sessionPersistence',
] as const

/** 工具表设置预热完成前的答案：一个都不关（见 apply 里 toolTableHidden 的注释）。 */
const EMPTY_TOOL_SET: ReadonlySet<string> = new Set()

export default {
  name: 'dsh-plugin-tool-management-host',
  inject: [...INJECT_SERVICES],
  apply(ctx: DshContext, config?: Record<string, unknown>) {
    // 最后一道防线：装配期任何一步抛错都不能拖垮宿主启动。cordis 会把抛错的插件标成
    // 装载失败；在桌面版上那等于应用起不来。这里把异常收在插件内，记一条降级后返回 ——
    // 中断点之后的功能本轮不注册，但这之前的（以及宿主自身）照常工作。
    try {
```

</details>

**依据 6 · 源码核查**：[src/tools/table.ts:106-132](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/tools/table.ts#L106-L132)

默认隐藏名单和已有设置区别。

<details>
<summary>查看原文（27行）</summary>

```text
 * 只在**用户从没记过选择**时生效（见 index.ts 的 `toolTableSettingsFrom`：侧车文件读不出来
 * 才用这份）。已经存过盘的一律照原样，包括显式的 `hidden: []` —— 那是"我全都要"，
 * 不是"还没配过"。存过盘的人要拿回这份默认，走界面上的「恢复方案 → 出厂默认」。
 */
export const DEFAULT_HIDDEN_TOOLS: readonly string[] = Object.freeze([
  'scene_manager_list',
  'scene_manager_switch',
  'scene_manager_save',
  'scene_manager_archive',
  'memory_manager_read',
  'memory_manager_search',
  'memory_manager_switch',
  'mcp_manager_list',
  'mcp_manager_save',
  'skill_manager_list',
  'skill_manager_switch',
  'skill_manager_save',
  'subagent_manager_list',
  'subagent_manager_switch',
  'subagent_manager_save',
  'prompt_manager_list',
  'prompt_manager_apply',
  'plugin_manager_remove',
])

/** 出厂默认那份设置：十八条不发（名单与理由见上面），方案清单是空的。 */
export const DEFAULT_TOOL_TABLE_SETTINGS: ToolTableSettings = { hidden: [...DEFAULT_HIDDEN_TOOLS], presets: [] }
```

</details>

#### 缺口

- 没有真实团队并行会话或上下文数据。
  **影响**：有明显管理场景，实际节约和工具覆盖待验。
  **进一步探讨**：比较同一两任务的人工作业和上下文大小。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型如何发现、重新开启或关闭当前工具？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 Host 构建并注册 `tool_manager_tools`。list 只读本层停用且插件认识的工具；enable/disable 接受已记录名称，拒绝全未知和自我关闭。作用域从 Agent 的会话身份取得，子 Agent 跟随根会话，workspace 由 cwd 折叠，global 无会话层。控制面调用同一个 tool-table handler，无法解析且非 global 会拒绝。会话写入检查侧车状态和锁，逐条变更在 scopeStore.mutate 中计算，按基线保留差异。成功会审计、回执与异步重排。工具表和 MCP 禁用汇入同一 Agent restrict，再有派发 guard 重核隐藏表。控制面的返回不直接运行被开启工具，300ms 计划重排与下次 schema 生成时点需宿主验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:5246-5269](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L5246-L5269)

实际接控制工具、作用域与共享写 handler。

<details>
<summary>查看原文（24行）</summary>

```text
    buildControlTools({
      ...toolDeps,
      toolTableSizes,
      toolTableSummaries,
      hiddenForSession: (agent: unknown) => toolTableHiddenForSession(scopeKeyForAgent(agent)),
      // 逐条改管着这个对话的那一层的工具表：走面板同一条路（`tool-table` op 的
      // `toggle` 那一支），锁、基线补写、可见性重排、两个目录重算全都照旧；
      // 逐条改在写锁里现读现改，不会把面板刚写进去的东西覆盖掉。
      applyToolTable: async (agent: unknown, changes: Array<{ name: string; hidden: boolean }>) => {
        const sessionId = scopeKeyForAgent(agent)
        // 全局粒度：没有会话层，管着这个对话的就是全局那一份 —— 写全局表（机器级，
        // 调用前已被确认卡问过）。**不能**因为「解析不出会话 id」就写全局：那是
        // 另一个原因（冷 agent / 会话头拿不到），写全局会让一次会话级操作变成机器级。
        const globalLayer = sessionId === null && scopeMode() === 'global'
        if (sessionId === null && !globalLayer) {
          return { ok: false, error: 'cannot resolve the scope of this conversation: the tool table was not changed' }
        }
        const args = globalLayer ? { toggle: changes } : { sessionId, toggle: changes }
        const r: any = await handlers['tool-table'](args)
        // 模型侧直调 handler 不经过 HTTP 路由，那条路由才会记流水 —— 这里自己记一条，
        // 否则「谁改了工具表」在「最近改动」里查不到。
        modelAudit('tool-table', args, r)
        if (!r || r.ok === false) return { ok: false, error: (r && r.error) || 'failed to save the tool table' }
        return { ok: true }
```

</details>

**依据 2 · 源码核查**：[src/tools/control.ts:76-105](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/tools/control.ts#L76-L105)

控制工具参数、注册和四种 action。

<details>
<summary>查看原文（30行）</summary>

```text
export function buildControlTools(deps: ControlToolDeps): void {
  const { defineTool, register } = deps
  try {
    register(defineTool({
      name: CONTROL_TOOL_NAME,
      description:
        'Turn this plugin\'s own tools on or off for the scope that governs this conversation '
        + '(this conversation, its whole workspace under workspace isolation, or every conversation once isolation is off). '
        + 'Call `list` when the user asks for something this conversation cannot do yet (e.g. switching scene while the scene tools are off): it returns the tools that are off here, one line each. '
        + '`enable`/`disable` take one or more names and apply from the next request.',
      parameters: {
        action: {
          type: 'string',
          required: true,
          enum: ['list', 'enable', 'disable', 'repair'],
          description: 'list = tools off here; enable / disable = turn them on / off here; repair = fix a broken sidecar.',
        },
        tools: {
          type: 'array',
          items: { type: 'string' },
          description: 'Names from `list`.',
        },
        target: {
          type: 'string',
          enum: ['memory-index', 'scope', 'mcp-disabled'],
          description: 'For repair: memory-index | scope | mcp-disabled.',
        },
      },
      output: { schema: { type: 'string' }, render: (_a: unknown, v: unknown) => text(String(v)) },
      async execute(args: any, exec: any) {
```

</details>

**依据 3 · 源码核查**：[src/tools/control.ts:105-145](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/tools/control.ts#L105-L145)

实际列、开启、关闭、已知名校验与回执。

<details>
<summary>查看原文（41行）</summary>

```text
      async execute(args: any, exec: any) {
        const action = String((args && args.action) || '').trim()
        const agent = exec && (exec as { agent?: unknown }).agent
        if (action === 'list') return listTools(deps, agent)
        if (action === 'repair') return repairState(deps, args)
        if (action !== 'enable' && action !== 'disable') {
          throw new Error('unknown action: ' + (action === '' ? '(missing)' : action) + ' — use list, enable, disable or repair')
        }
        const requested: string[] = (Array.isArray(args && args.tools) ? args.tools : [])
          .map((n: unknown) => String(n ?? '').trim())
          .filter((n: string) => n !== '')
        if (requested.length === 0) throw new Error('missing argument: tools — the names of the tools to ' + action)
        // 只认本插件注册过的名字：陌生名字写进关停名单会让官方的 restrict 抛错。
        const known = requested.filter((n: string) => deps.toolTableSizes.has(n))
        const unknown = requested.filter((n: string) => !deps.toolTableSizes.has(n))
        if (known.length === 0) {
          throw new Error('none of these are this plugin\'s tools: ' + requested.join(', ') +
            ' — call list to see the names')
        }
        // 自己不可被关：这条工具是模型唯一的回头路，关掉它就再也开不回来
        // （面板仍然可以关 —— 用户说了算）。
        if (action === 'disable' && known.includes(CONTROL_TOOL_NAME)) {
          throw new Error('this tool cannot switch itself off — it is the only way back to the others. Only the user can disable it (in the panel).')
        }
        const hidden = deps.hiddenForSession(agent)
        // 逐条改：每一处改动是一个「关掉 / 打开某一条」，写侧在锁里现读现改。
        const changes = known.map((name) => ({ name, hidden: action === 'disable' }))
        const next = applyToolTableToggles([...hidden], changes)
        const saved = await deps.applyToolTable(agent, changes)
        if (!saved.ok) throw new Error(saved.error || 'failed to save the tool table for this conversation')
        const changed = changes.filter((c) => (c.hidden ? !hidden.has(c.name) : hidden.has(c.name))).map((c) => c.name)
        const lines = [
          'OK: ' + (action === 'enable' ? 'enabled' : 'disabled') + ': ' + (changed.join(', ') || '(nothing changed)')
            + governingScopeNote(deps) + '.',
          'These take effect from the next request.',
        ]
        if (unknown.length > 0) lines.push('not this plugin\'s tools (ignored): ' + unknown.join(', '))
        // 说清「这一层看得见的条数」：模型据此判断自己还有没有别的路。
        const total = deps.toolTableSizes.size
        lines.push((total - next.length) + ' of ' + total + ' tools are available here now.')
        return lines.join('\n')
```

</details>

**依据 4 · 源码核查**：[src/tools/control.ts:177-190](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/tools/control.ts#L177-L190)

只列当前停用项。

<details>
<summary>查看原文（14行）</summary>

```text
function listTools(deps: ControlToolDeps, agent: unknown): string {
  const hidden = deps.hiddenForSession(agent)
  const rows: string[] = []
  for (const [name, bytes] of deps.toolTableSizes) {
    if (!hidden.has(name)) continue
    rows.push(toolLine(name, deps.toolTableSummaries.get(name) ?? '', bytes))
  }
  const total = deps.toolTableSizes.size
  if (rows.length === 0) {
    return 'every tool of this plugin is already on here (' + total + ' tools); nothing to enable.'
  }
  return 'tools switched off here (' + rows.length + ' of ' + total + '):\n' +
    rows.join('\n') +
    '\ncall this tool with action="enable" and the names you need (one or more).'
```

</details>

**依据 5 · 源码核查**：[src/scope/resolve.ts:154-174](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/scope/resolve.ts#L154-L174)

会话根、工作区和全局解析。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * 从 agent 取**作用域键**（注入 / 守卫 / 目录 / 工具表用）。
 *
 * 粒度是"对话"：子代理 / 侧聊先向上找到所属用户会话；工作区模式下再用**根会话的 cwd**
 * 折叠到工作区。根会话 cwd 没见过时退回子会话自己的 cwd，再没有就退回会话 id
 * （与 `sessionScopeIdOf` 同一条"宁可少隔离，不串到别处"的取向）。
 *
 * `global` 模式返回 `null` = 这一处没有会话层。所有调用方已有的 `null → 按全局` 分支
 * 直接成立，不需要各自再判一次模式。注意仍然先走一遍 `sessionIdentityOf`：它顺手记下
 * 会话 cwd，切回工作区粒度时不必再等一次会话清单。
 */
export function scopeKeyOfAgent(agent: unknown, mode: ScopeMode): string | null {
  const identity = sessionIdentityOf(agent)
  if (identity === null) return null
  if (mode === 'global') return null
  const root = sessionScopeIdOf(agent)
  if (root === null) return null
  if (mode !== 'workspace') return root
  const cwd = sessionCwdOfId(root) ?? identity.cwd
  return workspaceScopeKeyOf(cwd) ?? root
}
```

</details>

**依据 6 · 源码核查**：[src/index.ts:4014-4045](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L4014-L4045)

未知侧车、逐条或整体和锁定拒绝。

<details>
<summary>查看原文（32行）</summary>

```text
      // 面板给的是当前层的键；斜杠 / 旧调用可能给真实 sessionId → 统一折到当前模式。
      const sessionId = await scopeKeyForId(rawId)
      const settings = await readToolTableSettings()
      // 侧车 unknown：会话覆盖也拒绝写入 —— 基线 / 全局兜底都读不准，落一份基于空表的
      // 覆盖只会把问题搬到会话层。读取（上面那次）仍按"上次成功值 → 出厂默认"服务。
      if (args && (args.set === true || args.toggle !== undefined) && toolTableState().state === 'unknown') {
        return { ok: false, error: toolTableWriteError() }
      }
      let scope = scopeStore.scopeOfSync(sessionId)
      // 两条写路：`set` = 整份替换（面板用），`toggle` = 逐条改（模型用）。
      // 后者的改动落在**当前这份**名单上，在写锁里现读现改 —— 整份替换要先读出名单
      // 再算差量，读与写之间有窗口，两个写者（面板、模型）会互相覆盖（丢更新）。
      const toggles = args && Array.isArray(args.toggle)
        ? (args.toggle as any[])
          .filter((t) => t && typeof t.name === 'string' && t.name !== '')
          .map((t) => ({ name: String(t.name), hidden: t.hidden === true }))
          // 只收注册过的工具名：陌生名字会让官方 restrict 抛错。
          .filter((t) => toolTableSizes.has(t.name))
        : null
      if (!args || (args.set !== true && toggles === null)) {
        // 方案库是全局的：会话层只负责"读这一层 / 应用一份方案"，不在这里存删。
        if (args && (args.presetSave !== undefined || args.presetDelete !== undefined)) {
          return { ok: false, code: 'globalOnly' }
        }
        return toolTableSessionPayload(sessionId, scope, settings)
      }
      if (toggles !== null && toggles.length === 0) {
        return { ok: false, error: 'none of these are this plugin\'s tools: ' + (args.toggle as any[]).map((t: any) => String(t && t.name)).join(', ') }
      }
      if (scope?.locked === true) {
        const layer = isWorkspaceScopeKey(sessionId) ? '工作区' : '会话'
        return { ok: false, error: `${layer}「${scopeKeyLabel(sessionId)}」的作用域已锁定：先解锁再改` }
```

</details>

**依据 7 · 源码核查**：[src/index.ts:4060-4085](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L4060-L4085)

持久变更、异步重排和真实响应。

<details>
<summary>查看原文（26行）</summary>

```text
      const backfillBaselineTt = scope?.baseline !== undefined && scope.baseline.toolTableHidden === undefined
      const base = scope?.baseline?.toolTableHidden ?? (backfillBaselineTt ? settings.hidden : undefined)
      try {
        await scopeStore.mutate(sessionId, (cur) => {
          const out: SessionScope = { ...(cur === undefined ? {} : cur) }
          if (backfillBaselineTt && out.baseline !== undefined) {
            out.baseline = { ...out.baseline, toolTableHidden: settings.hidden.slice() }
          }
          // 逐条改的那一路：起点是**锁内的当前生效名单**（现读现改）。
          const next = toggles !== null
            ? applyToolTableToggles(sessionToolTableHidden(cur, settings.hidden), toggles)
            : target
          // 与基线同值就不留显式名单：退出场景 / 全局再变时少一条永远相等的覆盖。
          if (base !== undefined && sameToolNameList(next, base)) delete out.toolTableHidden
          else out.toolTableHidden = next.slice()
          return Object.keys(out).length > 0 ? out : undefined
        })
      } catch (e) {
        return { ok: false, error: '保存失败: ' + message(e) }
      }
      mcp.scheduleToolRestrictions()
      // 同上：会话工具表保存也不等两个目录重算。
      scheduleSkillCatalogRefresh()
      void subagentCatalog.refresh().catch(() => { /* 同上 */ })
      scope = scopeStore.scopeOfSync(sessionId)
      return toolTableSessionPayload(sessionId, scope, settings)
```

</details>

**依据 8 · 源码核查**：[src/mcp/tool-visibility.ts:545-552](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/mcp/tool-visibility.ts#L545-L552)

合并两套 allow/deny。

```text
    // 模型工具表也按对话走：本对话的整份名单可能重新打开全局关掉的工具
    // 也可能关掉全局开着的工具 —— 与 MCP 覆盖同一层 deny，不各装一层。
    if (deps.sessionToolTableOverlay) {
      try {
        const ov = await deps.sessionToolTableOverlay(agent)
        if (ov) {
          if (ov.deny !== undefined && ov.deny.length) extra = [...extra, ...ov.deny]
          if (ov.allow !== undefined && ov.allow.length) for (const name of ov.allow) allowSet.add(name)
```

**依据 9 · 源码核查**：[src/mcp/tool-visibility.ts:562-593](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/mcp/tool-visibility.ts#L562-L593)

实际调用 scoped restrict。

<details>
<summary>查看原文（32行）</summary>

```text
      : allowSet
    const names = [...new Set([...desiredNames.filter((name) => !effectiveAllow.has(name)), ...extra])]
    const scoped = scopedToolsOf(agent)
    if (!scoped || typeof scoped.restrict !== 'function') {
      if (names.length === 0) return
      // agent scope 上没有 tools 面（或它没有 restrict）：这半边做不成，如实说 ——
      // 静默跳过会让人以为"停用工具从模型工具表里消失"已经生效。
      noteRuntime({
        id: 'mcp-tool-visibility',
        label: '停用工具的可见性',
        kind: 'write',
        fallback: 'inform-only',
        detail: 'agent scope 上没有可用的 tools.restrict（官方接口变了或该 scope 未暴露 tools）：停用的 MCP 工具与兼容页关掉的本插件工具仍会出现在模型可见的工具表里，执行侧拦截仍然生效。',
        detailKey: 'mcp-tool-visibility.no-restrict',
      })
      return
    }
    // 从枚举到装层之间可能过去一拍：服务器恰好停了 / 注册被摘掉，而官方 `restrict` 对
    // 认不出的名字是**整份名单抛错**（不是跳过那一个）—— 一个过期名字就会让所有工具重新
    // 出现在模型工具表里。装之前再问一次全局视图，把已经不存在的名字剔掉。
    const denyNames = typeof deps.tools.get === 'function'
      ? names.filter((name) => { try { return deps.tools.get!(name) !== undefined } catch { return false } })
      : names
    const denyKey = denyNames.slice().sort().join('\u0000')
    if (appliedByAgent.get(agent) === denyKey) return
    liftRestriction(agent)
    if (denyNames.length === 0) { clearRuntimeNote('mcp-tool-visibility'); return }
    try {
      const dispose = scoped.restrict({ deny: denyNames })
      agentRestrictions.set(agent, typeof dispose === 'function' ? dispose as () => void : () => {})
      appliedByAgent.set(agent, denyKey)
      clearRuntimeNote('mcp-tool-visibility')
```

</details>

**依据 10 · 源码核查**：[src/mcp/tool-visibility.ts:738-747](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/mcp/tool-visibility.ts#L738-L747)

异步延迟刷新。

<details>
<summary>查看原文（10行）</summary>

```text
    epoch += 1
    for (const agent of [...agentRestrictions.keys()]) if (!seenAgents.has(agent)) liftRestriction(agent)
    for (const agent of seenAgents) void restrictAgent(agent).catch(() => { /* best effort */ })
  }
  function scheduleToolRestrictions(): void {
    if (restrictTimer) return
    restrictTimer = setTimeout(() => {
      restrictTimer = null
      applyToolRestrictions().catch(() => { /* best effort */ })
    }, 300)
```

</details>

**依据 11 · 源码核查**：[src/index.ts:5584-5613](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L5584-L5613)

派发按 MCP 及插件工具表检查。

<details>
<summary>查看原文（30行）</summary>

```text
          try {
            // unknown 必须先于会话 verdict：本会话显式开着也不能越过“停用表读不出来”。
            if (isMcpTool && mcp.disabledToolsState() === 'unknown') {
              return 'the MCP disabled-tools table is unreadable: every MCP tool is refused for now — repair it with tool_manager_tools (action="repair", target="mcp-disabled")'
            }
            // 会话层的判定：它有两个方向 —— `deny` 是"这个对话里关掉了"
            // `allow` 是"这个对话里显式开着"，后者要能**越过全局停用表**（逐工具开关按会话
            // 独立：全局关着的工具，本会话开着就该能调）。判据见 `sessionMcpVerdictSync`。
            const verdict = sessionMcpVerdictSync(exec && exec.agent, name)
            if (verdict === 'deny') return sessionDisabledNotice()
            // 只读 TTL 缓存、不做 I/O —— 这段跑在每一次工具调用的热路径上。
            if (verdict !== 'allow' && mcp.isToolDisabled(name)) {
              return 'this tool has been switched off on the MCP page (mcp_manager_switch can turn it back on)'
            }
            // 兼容页关掉的工具：可见性半边（restrict）正常时模型根本看不到它，走到这里只有两种
            // 可能 —— 名字是猜的，或者可见性半边没生效（那条降级会上报）。执行侧一律拦住。
            if (toolTableHiddenForSession(scopeKeyForAgent(exec && exec.agent)).has(name)) {
              // 模型自己有出路就别把它推给用户：它手里有控制面工具（tool_manager_tools），
              // 能把这条打开 —— 说清怎么开，比说「去面板点」有用得多。
              return toolAccessRoute(toolDeps, name, exec && exec.agent) === 'none'
                ? 'this tool is switched off in this conversation\'s tool table (the user has to turn it back on)'
                : 'this tool is switched off in this conversation\'s tool table — enable it with tool_manager_tools (action="enable", tools:["' + name + '"])'
            }
          } catch (e) {
            // 守卫自身算不出来时，MCP 工具必须 fail-closed；其余工具保持原来的放行方向，
            // 避免一个守卫 bug 让整个工具表都不可用。
            if (isMcpTool) return 'the MCP disabled-tools table is unreadable: this call is refused'
          }
          return undefined
        }), 'dsh-plugin-tool-management: disabled mcp tool guard')
```

</details>

#### 缺口

- 未运行宿主及两个会话实际效果。
  **影响**：范围和状态有代码，工具刷新和继承需验证。
  **进一步探讨**：对两个会话记录调用前后 schema、守卫日志和实际执行。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 暴露策略、工具审批与 HTTP 鉴权各保护什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

对话工具表主要管理暴露及当前派发，若控制工具可用，模型能自行恢复自家工具，按会话操作通常无插件确认。全局写或修复走 tools/pre-execute 判定，宿主 `approval=never` 会跳过插件确认并留审计。缺 `restrict` 可能仍显示工具，缺 `guard` 或注册失败则执行侧降级。不可读的 MCP 停用表有拒绝分支，但普通工具守卫计算异常可放行。HTTP 若有匹配已配置令牌则跳过宿主 fence，未匹配时走 Connection 或回环 Host/Origin 退路。已启用令牌的写入另需令牌，敏感明文接口的门依是否存有令牌；无令牌时取决于宿主 fence，回环退路不鉴别本机进程。模型直调 handler 不经 HTTP，另有按宿主进程记忆的验令牌闩，无法当作每调用鉴权。作者说明 patch 与备份可留明文。

#### 证据与依据

**依据 1 · 源码核查**：[src/confirm-gate.ts:139-160](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/confirm-gate.ts#L139-L160)

恢复/修复与机器级确认的实际判据。

<details>
<summary>查看原文（22行）</summary>

```text
  if (name === 'tool_manager_tools') {
    // 会话层自开不弹（只动管着这个对话的那一层，随时可退）；隔离关掉时那一层就是全局，
    // 动的是所有对话 —— 与三个 `_switch` 在全局粒度下的口径一致，要问。
    // 修复类动作要问：它会把**已损坏的侧车改名留存**、按空表继续 —— 那是一次不可逆的
    // 数据处置（原始文件还在，但插件从此不再读它），与「换个开关」不是一档。
    if (action === 'repair') {
      const target = text(args.target)
      if (target === '') return null
      const subject = target === 'memory-index' ? '记忆索引'
        : target === 'scope' ? '作用域侧车'
          : target === 'mcp-disabled' ? 'MCP 停用表'
            : ''
      if (subject === '') return null
      return `Repair the ${subject} — the damaged file is renamed aside and the plugin continues with an empty table. Anything it held is no longer applied.`
    }
    if (action !== 'enable' && action !== 'disable') return null
    if (!machineWide(args, mode)) return null
    const names = Array.isArray(args.tools)
      ? args.tools.map((n) => text(n)).filter((n) => n !== '')
      : []
    if (names.length === 0) return null
    return `Turn ${action === 'enable' ? 'on' : 'off'} ${names.join(', ')} for every conversation (machine-wide tool table).`
```

</details>

**依据 2 · 源码核查**：[src/index.ts:5328-5363](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L5328-L5363)

工具前置及完全权限绕过分支。

<details>
<summary>查看原文（36行）</summary>

```text
      const bypassedByFullAccess = (exec: any): boolean => {
        if (!isApprovalNever(ctx, exec)) return false
        // 留痕：完全权限下跳过确认属于「用户已授权」，但要可审计（日志失败不阻塞主流程）。
        pluginLog()('confirm-bypass', `完全权限（approval=never）：跳过${CONFIRM_LABELS[String(exec && exec.name)]}的确认，直接放行`).catch(() => {})
        return true
      }
      // 确认门是「问用户要不要做」，如果这个请求本来就做不成，弹卡 / 写 bypass 日志只会产生
      // 一次无效审批：用户批准之后模型收到的是「人设不可用」/「人设不存在」/「人设已存在」。
      // 所以先校验，再决定要不要问。校验本身不可用时返回 true（保持原行为，
      // 绝不因为探测失败而少问一次）。
      const subagentManagerRunTargetExists = async (exec: any): Promise<boolean> => {
        try {
          const name = String((exec && exec.arguments && exec.arguments.agent) || '').trim()
          if (!name) return false
          const list = await subagentService.list()
          return list.some((p) => p.name === name)
        } catch (e) {
          return true
        }
      }
      // 不需要 `subagentWriteWouldApply` 那种裁决：它是为"create 要目标未被占用 / update 要
      // 改名已存在"这套两工具分工写的。合并成一条 upsert 之后它恒为"会应用"（判定只剩
      // "存在就改、不存在就建"，没有第三种情况），留着就是一个永远返回 true 的函数。
      ;(ctx.on as (event: string, cb: (exec: any, next: () => unknown) => unknown) => unknown)('tools/pre-execute', async (exec, next) => {
        if (!exec || !CONFIRM_LABELS[String(exec.name)]) return next()
        if (exec.name === 'subagent_manager_run' && !(await subagentManagerRunTargetExists(exec))) return next()
        // 按参数判定的那批（删除的 trash、开关的机器级写入、提示词的正向应用）：
        // 先算"这一次要不要问"，不问就直接放行 —— 不能落到末尾那条 "Run a subagent" 的
        // 兜底分支上。bypass 放到判定之后：`remove list` 这类根本不问的调用不该在
        // 审计日志里留下一条"跳过了确认"。
        const confirmName = String(exec.name)
        if (ARG_CONDITIONAL_CONFIRM_TOOLS.has(confirmName)) {
          const reason = argConditionalConfirmReason(confirmName, exec.arguments, await scopeStore.mode())
          if (reason === null) return next()
          if (bypassedByFullAccess(exec)) return next()
          return Promise.resolve({ kind: 'ask', reason })
```

</details>

**依据 3 · 源码核查**：[src/mcp/tool-visibility.ts:564-577](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/mcp/tool-visibility.ts#L564-L577)

无 restrict 的可见性降级。

<details>
<summary>查看原文（14行）</summary>

```text
    const scoped = scopedToolsOf(agent)
    if (!scoped || typeof scoped.restrict !== 'function') {
      if (names.length === 0) return
      // agent scope 上没有 tools 面（或它没有 restrict）：这半边做不成，如实说 ——
      // 静默跳过会让人以为"停用工具从模型工具表里消失"已经生效。
      noteRuntime({
        id: 'mcp-tool-visibility',
        label: '停用工具的可见性',
        kind: 'write',
        fallback: 'inform-only',
        detail: 'agent scope 上没有可用的 tools.restrict（官方接口变了或该 scope 未暴露 tools）：停用的 MCP 工具与兼容页关掉的本插件工具仍会出现在模型可见的工具表里，执行侧拦截仍然生效。',
        detailKey: 'mcp-tool-visibility.no-restrict',
      })
      return
```

</details>

**依据 4 · 源码核查**：[src/index.ts:5584-5634](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L5584-L5634)

不同失败方向和缺 guard 的执行边界。

<details>
<summary>查看原文（51行）</summary>

```text
          try {
            // unknown 必须先于会话 verdict：本会话显式开着也不能越过“停用表读不出来”。
            if (isMcpTool && mcp.disabledToolsState() === 'unknown') {
              return 'the MCP disabled-tools table is unreadable: every MCP tool is refused for now — repair it with tool_manager_tools (action="repair", target="mcp-disabled")'
            }
            // 会话层的判定：它有两个方向 —— `deny` 是"这个对话里关掉了"
            // `allow` 是"这个对话里显式开着"，后者要能**越过全局停用表**（逐工具开关按会话
            // 独立：全局关着的工具，本会话开着就该能调）。判据见 `sessionMcpVerdictSync`。
            const verdict = sessionMcpVerdictSync(exec && exec.agent, name)
            if (verdict === 'deny') return sessionDisabledNotice()
            // 只读 TTL 缓存、不做 I/O —— 这段跑在每一次工具调用的热路径上。
            if (verdict !== 'allow' && mcp.isToolDisabled(name)) {
              return 'this tool has been switched off on the MCP page (mcp_manager_switch can turn it back on)'
            }
            // 兼容页关掉的工具：可见性半边（restrict）正常时模型根本看不到它，走到这里只有两种
            // 可能 —— 名字是猜的，或者可见性半边没生效（那条降级会上报）。执行侧一律拦住。
            if (toolTableHiddenForSession(scopeKeyForAgent(exec && exec.agent)).has(name)) {
              // 模型自己有出路就别把它推给用户：它手里有控制面工具（tool_manager_tools），
              // 能把这条打开 —— 说清怎么开，比说「去面板点」有用得多。
              return toolAccessRoute(toolDeps, name, exec && exec.agent) === 'none'
                ? 'this tool is switched off in this conversation\'s tool table (the user has to turn it back on)'
                : 'this tool is switched off in this conversation\'s tool table — enable it with tool_manager_tools (action="enable", tools:["' + name + '"])'
            }
          } catch (e) {
            // 守卫自身算不出来时，MCP 工具必须 fail-closed；其余工具保持原来的放行方向，
            // 避免一个守卫 bug 让整个工具表都不可用。
            if (isMcpTool) return 'the MCP disabled-tools table is unreadable: this call is refused'
          }
          return undefined
        }), 'dsh-plugin-tool-management: disabled mcp tool guard')
        clearRuntimeNote('mcp-tool-guard')
      } catch (e) {
        noteRuntime({
          id: 'mcp-tool-guard',
          label: 'MCP 工具执行守卫',
          kind: 'write',
          fallback: 'inform-only',
          detail: '执行守卫注册失败（' + message(e) + '）：停用的 MCP 工具可能仍可被调用；可见性摘除与停用表仍会尽力生效。',
          detailKey: 'mcp-tool-guard.register-failed',
          params: { reason: message(e) },
        })
      }
    } else {
      noteRuntime({
        id: 'mcp-tool-guard',
        label: 'MCP 工具执行守卫',
        kind: 'write',
        fallback: 'inform-only',
        detail: '宿主 tools 服务没有 guard（官方接口变了）：执行侧拦截不存在，停用的 MCP 工具可能仍可被调用。',
        detailKey: 'mcp-tool-guard.missing',
      })
```

</details>

**依据 5 · 源码核查**：[src/http-api.ts:144-153](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/http-api.ts#L144-L153)

匹配存量令牌绕过 Host fence。

<details>
<summary>查看原文（10行）</summary>

```text
          const tokenAccepted = deps.CONFIG_TOKEN !== '' && deps.tokenMatches(hdr('x-dsh-token'))
          // 验过就置闩（本次进程一次即可）。`agent/pre-step` 的令牌门禁读的就是它 ——
          // 那一边看不到请求头，只能由这里告诉它"这台机器已经有人验过令牌了"。
          if (tokenAccepted) deps.markAccepted()
          if (!tokenAccepted) {
            const fence = fenceRejection(req, hostConnection())
            if (fence) {
              send(fence.status, { ok: false, error: fence.error })
              return
            }
```

</details>

**依据 6 · 源码核查**：[src/http-api.ts:190-213](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/http-api.ts#L190-L213)

敏感读取、写入令牌判定。

<details>
<summary>查看原文（24行）</summary>

```text
            if (deps.SENSITIVE_OPS.has(op)) {
              // 明文门禁看的是**存量**令牌（CONFIG_TOKEN 而不是生效值 TOKEN）：关掉令牌
              // 功能之后仍然"要凭存量令牌才给明文"—— 那条路是通的（填对就能看），
              // 与"从来没配过"不同。
              const gate = secretOpRejection({ tokenConfigured: deps.CONFIG_TOKEN !== '', tokenAccepted })
              if (gate) {
                send(403, { ok: false, error: gate.error, code: gate.code })
                return
              }
            }
            // 「读改写」两态 op（`inject-settings` / `tool-table` / `scene-settings` /
            // `mcpm-settings`）：同一个名字既读又写，于是整条 op 被列进 WRITE_OPS —— 读侧也
            // 一起被拦，界面表现是"没填令牌时整块设置消失、填了还要刷新才出现"（
            // 用户报的）。判据是**这次调用要不要写**，不是 op 名在不在名单里。
            // 判据本身在登记表（`writeWhen`），这里不再手写一份 —— 手写那份只认 `set:true`，
            // 于是 `tool-table` 的 `presetSave` / `presetDelete` 被当成读放行，配了令牌也能
            // 只凭宿主栅栏改侧车。
            const readOnlyCall = isReadCall(op, args)
            if (deps.TOKEN && deps.WRITE_OPS.has(op) && !readOnlyCall && !deps.tokenMatches(hdr('x-dsh-token'))) {
              // 文案与明文门禁同源（http-fence.ts），code 也统一 —— 界面据此在最右侧挂
              // 「去填令牌」跳转按钮。这条错误会出现在**任意**页面，而入口只有一个。
              send(403, { ok: false, code: TOKEN_CODE_BAD, error: TOKEN_MSG })
              return
            }
```

</details>

**依据 7 · 源码核查**：[src/http-fence.ts:95-112](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/http-fence.ts#L95-L112)

宿主准入与非 owner 拒绝。

<details>
<summary>查看原文（18行）</summary>

```text
    const admission = connection?.admit?.(req)
    if (admission !== undefined) {
      // 宿主栅栏真的给出了判定（放行或拒绝都算在岗）：清掉历史回退上报。
      clearRuntimeNote('http-fence-fallback')
      if ('rejection' in admission) {
        const status = admission.rejection
        return {
          status,
          error: status === 401
            ? '未通过宿主的浏览器鉴权：请在 DSH Web GUI 内操作，或为本插件配置访问令牌（config.token / DSH_PLUGIN_TOOL_MANAGEMENT_TOKEN）'
            : 'Host/Origin 栅栏拒绝：该请求不是发往本机地址的同源请求',
        }
      }
      const principal = admission.peer?.principal
      if (principal !== undefined && principal.kind !== 'owner') {
        return { status: 403, error: '拒绝：调用方不是本机所有者身份' }
      }
      return null
```

</details>

**依据 8 · 源码核查**：[src/http-fence.ts:126-149](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/http-fence.ts#L126-L149)

宿主缺失时回环和请求头退路。

<details>
<summary>查看原文（24行）</summary>

```text
    if (typeof connection?.requestRejection === 'function') {
      clearRuntimeNote('http-fence-fallback')
      return null
    }
    noteFenceFallback(connection ? 'connection 服务没有 admit / requestRejection' : '未挂载 connection 服务', false)
  } catch (e) {
    // 见上方说明：退回本地判定。**必须出声** —— 静默回退时用户以为浏览器鉴权还在。
    noteFenceFallback(String((e && (e as Error).message) || e), true)
  }

  const hostHdr = headerValue(req, 'host')
  let host: URL
  try { host = new URL('http://' + hostHdr) } catch { return { status: 403, error: 'Host 头缺失或无法解析' } }
  const loopback = host.hostname === 'localhost' || host.hostname === '[::1]'
    || /^127(?:\.\d{1,3}){3}$/.test(host.hostname)
  if (!loopback) return { status: 403, error: 'Host 必须是本机回环地址（防 DNS rebinding）' }
  if (headerValue(req, 'sec-fetch-site') === 'cross-site') return { status: 403, error: '跨站请求被拒' }
  const origin = headerValue(req, 'origin')
  if (origin) {
    try {
      if (new URL(origin).host !== host.host) return { status: 403, error: '跨源请求被拒' }
    } catch { return { status: 403, error: 'Origin 头无法解析' } }
  }
  return null
```

</details>

**依据 9 · 源码核查**：[src/http-fence.ts:211-216](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/http-fence.ts#L211-L216)

没有存量令牌时敏感 gate 放行。

```text
export function secretOpRejection(state: SecretGateState): SecretGateRejection | null {
  if (!state.tokenConfigured) return null
  if (!state.tokenAccepted) {
    return { code: TOKEN_CODE_BAD, error: TOKEN_MSG }
  }
  return null
```

**依据 10 · 源码核查**：[src/request-gate.ts:113-125](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/request-gate.ts#L113-L125)

进程级验令牌闩的范围。

<details>
<summary>查看原文（13行）</summary>

```text
  /**
   * 「本次启动已经验过令牌」的闩。验过即置位；唯一的手动清零入口是 `unmarkAccepted`
   * （「锁定」/「删除令牌」走的 `token-unaccept`，见上）。重启自然清零。
   *
   * 用途：`agent/pre-step` 的令牌门禁要回答"这台机器现在是不是还没人验过令牌"，而它看不到
   * 浏览器请求头。HTTP 入口是唯一知道答案的地方（那里才知道 `x-dsh-token` 对不对），
   * 所以由入口在验过时置位，门禁读这一个布尔 —— 两边不共享别的东西。
   *
   * 注意它**不是**"当前请求带没带令牌"：带上之后页面刷新、切页、轮询都不该再要求重填，
   * 而这与界面的 bootId 口径一致（同一进程内只需填一次）。
   *
   * 已知边界：闩按**进程**记，不区分浏览器 —— 同一启动里任何一个客户端验对过，其它
   * 客户端的对话也放行。这是"填一次只管本次启动"在 pre-step
```

</details>

**依据 11 · 源码核查**：[src/index.ts:5259-5269](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L5259-L5269)

模型绕过 HTTP 的实际链。

<details>
<summary>查看原文（11行）</summary>

```text
        const globalLayer = sessionId === null && scopeMode() === 'global'
        if (sessionId === null && !globalLayer) {
          return { ok: false, error: 'cannot resolve the scope of this conversation: the tool table was not changed' }
        }
        const args = globalLayer ? { toggle: changes } : { sessionId, toggle: changes }
        const r: any = await handlers['tool-table'](args)
        // 模型侧直调 handler 不经过 HTTP 路由，那条路由才会记流水 —— 这里自己记一条，
        // 否则「谁改了工具表」在「最近改动」里查不到。
        modelAudit('tool-table', args, r)
        if (!r || r.ok === false) return { ok: false, error: (r && r.error) || 'failed to save the tool table' }
        return { ok: true }
```

</details>

**依据 12 · 作者声明**：[README.md:134-138](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/README.md#L134-L138)

作者说明文件、备份与明文条件。

```text
- **写入范围**：技能源文件只读；MCP 只改上面那两份 patch（各留 5 份备份）；提示词「应用」会覆盖宿主读的 `~/.dsh/AGENTS.md`（原文留在 hub 内）；桌面版启动时清掉 10 分钟前的 `dsh-auth-*` cookie。
- **令牌**：设置后所有写操作与明文密钥都要 `x-dsh-token`；界面填一次后存在浏览器 localStorage、与本次启动绑定（重启要重填），明文查看仍要令牌。
- **进程级边界靠令牌**：写接口默认由宿主的浏览器鉴权把关；宿主栅栏缺席时退回只查回环地址的本地判定，本机其它进程即可直连——配了访问令牌才有进程级这道门。
- **磁盘上是明文**：打码只发生在界面。MCP 的 `env` / `headers` 与插件的 `token` 在 patch 文件里始终明文，备份也不加密。令牌门禁管不到磁盘读取，防线是文件权限。
- **删除可找回**：技能 / 记忆 / 人设 / 提示词 / 场景的删除都进回收站（会话永久删除除外），可设保留期自动清理（默认永久保留）。
```

#### 缺口

- 未测试无 cookie、空令牌、远程部署或实际 host 审批。
  **影响**：错误地视开关为沙箱或把 HTTP 令牌当文件保护会扩大风险。
  **进一步探讨**：隔离 profile 下分别测端点权限、插件确认及直呼被关工具。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 兼容范围、持久化和 inventory 告警如何解释？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

根版本 0.22.4，Node >=24.9，声明 DSH >=0.2.2-rc.1 <0.2.3，依赖 tools、settings、sessions、workspace 等服务，缺某些 seams 可降级。inventory 固定 180 个纳入文件、1 个排除、8 个解析告警。八条来自 00-prelude.js 和 40-apply-head.js 各一条缺右花括号，以及 90-apply-tail.js 六条片尾语句诊断。它们是同一浏览器 factory 的头、apply 头和尾。源码构建脚本按清单合并后通过 vm.Script 解析，才写 lib/client.js。本次没有运行构建，故不能推出发布物通过或坏掉。代表路径读取的 Host TypeScript 和配置可独立追踪，逐文件静态候选只作线索。需为 patch、侧车、明文凭据和回退预留权限维护与备份。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:29-44](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/package.json#L29-L44)

DSH、Node、构建及客户端检查命令。

<details>
<summary>查看原文（16行）</summary>

```text
  ],
  "engines": {
    "dsh": ">=0.2.2-rc.1 <0.2.3",
    "node": ">=24.9"
  },
  "publishConfig": {
    "registry": "https://registry.npmjs.org",
    "access": "public"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json && node scripts/sync-client.mjs && node scripts/sync-profile.mjs",
    "prepublishOnly": "npm run build && npm run lint && npm run typecheck:client && node --test test/client-exports.test.mjs",
    "lint": "node --check lib/client.js && node --check lib/index.js",
    "typecheck:client": "node scripts/sync-client.mjs && tsc -p tsconfig.client.json",
    "check:i18n": "node scripts/check-i18n.mjs lib/client.js",
    "check:host": "node scripts/host-deps.mjs && node scripts/doctor.mjs",
```

</details>

**依据 2 · 源码核查**：[src/index.ts:254-269](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L254-L269)

宿主注入服务。

<details>
<summary>查看原文（16行）</summary>

```text
export const INJECT_SERVICES = [
  'timer', 'fs', 'settings', 'sandboxPolicy', 'webServer', 'tools', 'skills', 'sessions',
  'agents', 'workspaceRegistry', 'sessionProjectionCache', 'sessionPersistence',
] as const

/** 工具表设置预热完成前的答案：一个都不关（见 apply 里 toolTableHidden 的注释）。 */
const EMPTY_TOOL_SET: ReadonlySet<string> = new Set()

export default {
  name: 'dsh-plugin-tool-management-host',
  inject: [...INJECT_SERVICES],
  apply(ctx: DshContext, config?: Record<string, unknown>) {
    // 最后一道防线：装配期任何一步抛错都不能拖垮宿主启动。cordis 会把抛错的插件标成
    // 装载失败；在桌面版上那等于应用起不来。这里把异常收在插件内，记一条降级后返回 ——
    // 中断点之后的功能本轮不注册，但这之前的（以及宿主自身）照常工作。
    try {
```

</details>

**依据 3 · 源码核查**：[scripts/sync-client.mjs:1-17](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/scripts/sync-client.mjs#L1-L17)

作者构建逻辑定义共享 factory 源分片。

<details>
<summary>查看原文（17行）</summary>

```text
// Sync the browser half into the build output.
//
// 客户端源码拆在 src/client/*.js（按语义分片），交付时**拼回单文件** lib/client.js。
//
// 为什么必须拼：宿主的客户端契约是 `window.__ModuleLoader__.load({ id, factory })`
// 单文件注册，package.json 也只声明一个 `./client` 入口。本机 profile 里四个带 client
// 的插件（本插件 / dsh-better-sidebar / @anionex/dsh-turn-rewind / dshmarket）全是单文件，
// 所有 require 都是裸包名，**没有一处相对路径 require** —— 宿主加载器不在 node_modules
// 里，无法本地验证它支不支持相对解析，而「不改宿主机制」是硬约束。所以拆分只能发生在
// 构建期，交付物与拆分前逐字节一致。
//
// 分片之间不写 import/export：它们共享同一个 factory 作用域。拼接顺序即 SLICES 的顺序，
// 顺序错了会在求值时炸（const 的 TDZ / 未定义名），不会静默 —— 这是刻意保留的失败方式。
//
// src/client.js 已删除（它原本就是这些分片的拼接结果），本脚本是 lib/client.js 唯一的
// 生成者。没有这一步 tsc 也不会写它（src/client.js 被 tsconfig.json 排除，是浏览器 JS
// 不是宿主 TS），于是改完源码却发着旧产物 —— 正是当初产生「开关没反应」（旧 lib/client.js
```

</details>

**依据 4 · 源码核查**：[scripts/sync-client.mjs:26-49](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/scripts/sync-client.mjs#L26-L49)

三份告警文件对应拼接头、apply 头和尾。

<details>
<summary>查看原文（24行）</summary>

```text
/** 拼接顺序 = 阅读顺序：头 → 样式 → 词典 → apply（页面按导航顺序）→ 收尾。 */
const SLICES = [
  '00-prelude.js',      // 文件头注释 + ModuleLoader 注册头 + React
  '10-css.js',          // CSS：设计变量与全部 dsm-* 规则
  '20-helpers.js',      // 核心 helper：异常文案 / 样式注入 / 令牌行 / 通用小工具
  '20b-scope.js',       // 会话作用域：面板顶部下拉 + 三态开关的数据源（0.21.2）
  '21-compat-data.js',  // 兼容页的数据表与路由判定（OPERATION_LABELS / AUDIT_OP_LABELS / operationRoutes）
  '22-compat-page.js',  // CompatPage 一个组件（兼容与体检页的全部渲染）
  '23-export-hub.js',   // 导出枢纽 _pages（必须落在 factory 作用域）+ 交给 DICT 的那段说明
  '30-dict.js',         // DICT：中英两份词典
  '40-apply-head.js',   // apply 开头：取词服务、slots 守卫、各页共享的 mt / opMsg
  '40b-settings-nav-icon.js', // 设置侧栏「工具」行的图标：走官方 settings.section.icon 插槽（0.2.2 起）
  '41-mcp.js',          // FeedbackLinks + MCPPage + PromptsPage + ToolsSection
  '42-shared-ui.js',    // 通用 helper 与弹窗：callApi / Modal / Trash / Import / Export / DirPicker
  '42b-mcp-json.js',    // MCP JSON 导入/导出：结构识别与名字净化 + 两个弹窗（属于 MCP 域，原先寄在这里）
  '43-skills.js',       // SkillManagerSection + historyView
  '44-sessions.js',     // SessionsPage + 场景纯函数（sceneLabel / clipText / …）
  '45-scenes.js',       // ScenesPage
  '46-subagents.js',    // SubagentsPage（含 effort 缓存）
  '46b-memory-view.js', // memoryView：把记忆数据整理成场景分组的纯渲染函数
  '47-memory.js',       // MemoryPage
  '48-slash.js',        // 斜杠命令「工具」段（宿主 / 菜单；不在设置页里）
  '49-sidebar-entry.js',// 侧栏入口（main 面板 + sidebar.panellist 那一行，兼容页那颗开关管）
  '90-apply-tail.js',   // apply 收尾（注册各页 + 导出 _pages）
```

</details>

**依据 5 · 源码核查**：[scripts/sync-client.mjs:76-91](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/scripts/sync-client.mjs#L76-L91)

拼接后才语法检查与生成。

<details>
<summary>查看原文（16行）</summary>

```text
const cssTicks = (parts[SLICES.indexOf('10-css.js')].match(/`/g) || []).length
if (cssTicks !== 2) {
  throw new Error(
    `[sync-client] 10-css.js 里有 ${cssTicks} 枚反引号，只允许模板串首尾那 2 枚。\n`
    + '  CSS 注释里要指代标识符就用普通文字 —— 多出来的一枚会把 CSS 截断（有时语法照过、CSS 变成数字）。',
  )
}
const bundle = parts.join(eol)
try {
  new Script(bundle, { filename: 'lib/client.js' })
} catch (e) {
  throw new Error(`[sync-client] 拼接产物语法不过（lib/client.js 不会写出）：${e && e.message}`)
}

mkdirSync(join(root, 'lib'), { recursive: true })
writeFileSync(join(root, 'lib', 'client.js'), bundle)
```

</details>

**依据 6 · 作者声明**：[README.md:119-137](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/README.md#L119-L137)

作者列侧车、patch、备份与令牌成本。

<details>
<summary>查看原文（19行）</summary>

```text
<summary><b>数据落在哪 · 安全边界</b></summary>

| 内容                                        | 位置                                                              |
|:------------------------------------------- |:----------------------------------------------------------------- |
| MCP 定义                                    | `~/.dsh/cordis.patch.yml`（全局）· `~/.dsh/profiles/<名>/cordis.patch.yml`（当前档案） |
| 技能策略 / 自定义目录                       | `~/.dsh/tool-management/skills-state.json`                        |
| 技能 / 记忆 / 人设 / 预设                   | `~/.dsh/tool-management/{skills,memories,subagents,prompts}/`     |
| 记忆索引 / 场景 / 档案                      | `~/.dsh/tool-management/memories-index.json`                      |
| 回收站（技能 / 记忆 / 人设 / 预设 / 场景）  | `~/.dsh/tool-management/trash/<域>-trash/`                        |
| 归档账本 / 保留期                           | `~/.dsh/tool-management/history-*.json`                           |
| MCP 侧车（停用表 / 已知工具 / 备注 / 设置） | `~/.dsh/tool-management/mcp-*.json`                               |
| 注入设置（六个域开关 · 目录上限）           | `~/.dsh/tool-management/inject-settings.json`                     |
| 模型工具表 / 作用域覆盖                     | `~/.dsh/tool-management/tool-table.json` · `scope-overrides.json` |
| 运行日志 / patch 备份                       | `~/.dsh/tool-management/tool-management.log` · `backups/`         |

- **写入范围**：技能源文件只读；MCP 只改上面那两份 patch（各留 5 份备份）；提示词「应用」会覆盖宿主读的 `~/.dsh/AGENTS.md`（原文留在 hub 内）；桌面版启动时清掉 10 分钟前的 `dsh-auth-*` cookie。
- **令牌**：设置后所有写操作与明文密钥都要 `x-dsh-token`；界面填一次后存在浏览器 localStorage、与本次启动绑定（重启要重填），明文查看仍要令牌。
- **进程级边界靠令牌**：写接口默认由宿主的浏览器鉴权把关；宿主栅栏缺席时退回只查回环地址的本地判定，本机其它进程即可直连——配了访问令牌才有进程级这道门。
- **磁盘上是明文**：打码只发生在界面。MCP 的 `env` / `headers` 与插件的 `token` 在 patch 文件里始终明文，备份也不加密。令牌门禁管不到磁盘读取，防线是文件权限。
```

</details>

#### 缺口

- 没有发布构建、目标宿主和全域权限实测。
  **影响**：统计告警不能取代交付 bundle 和运行验收。
  **进一步探讨**：在隔离环境核对发布物、插件卡片、已装 seams、备份回滚时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证两个并行任务的开关和退出？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，用无敏感 MCP 和独立 profile 做双会话验收。比较原生手工配置和插件工具表，记录初始暴露、默认与显式开关、请求时序、子 Agent 继承、global 确认与无令牌拒绝。然后关控制工具并对照还可否被模型恢复，确认这与宿主权限策略相互独立。把强制拒绝与可自助发现分别显示，并提供已验证的作用域及恢复来源，可能降低把可逆隐藏当安全策略的误判。遇到误放行、状态不清或跨范围写入，停用插件，用备份和原生工具回退。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/control.ts:105-145](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/tools/control.ts#L105-L145)

可验证模型自助启停和不可自关。

<details>
<summary>查看原文（41行）</summary>

```text
      async execute(args: any, exec: any) {
        const action = String((args && args.action) || '').trim()
        const agent = exec && (exec as { agent?: unknown }).agent
        if (action === 'list') return listTools(deps, agent)
        if (action === 'repair') return repairState(deps, args)
        if (action !== 'enable' && action !== 'disable') {
          throw new Error('unknown action: ' + (action === '' ? '(missing)' : action) + ' — use list, enable, disable or repair')
        }
        const requested: string[] = (Array.isArray(args && args.tools) ? args.tools : [])
          .map((n: unknown) => String(n ?? '').trim())
          .filter((n: string) => n !== '')
        if (requested.length === 0) throw new Error('missing argument: tools — the names of the tools to ' + action)
        // 只认本插件注册过的名字：陌生名字写进关停名单会让官方的 restrict 抛错。
        const known = requested.filter((n: string) => deps.toolTableSizes.has(n))
        const unknown = requested.filter((n: string) => !deps.toolTableSizes.has(n))
        if (known.length === 0) {
          throw new Error('none of these are this plugin\'s tools: ' + requested.join(', ') +
            ' — call list to see the names')
        }
        // 自己不可被关：这条工具是模型唯一的回头路，关掉它就再也开不回来
        // （面板仍然可以关 —— 用户说了算）。
        if (action === 'disable' && known.includes(CONTROL_TOOL_NAME)) {
          throw new Error('this tool cannot switch itself off — it is the only way back to the others. Only the user can disable it (in the panel).')
        }
        const hidden = deps.hiddenForSession(agent)
        // 逐条改：每一处改动是一个「关掉 / 打开某一条」，写侧在锁里现读现改。
        const changes = known.map((name) => ({ name, hidden: action === 'disable' }))
        const next = applyToolTableToggles([...hidden], changes)
        const saved = await deps.applyToolTable(agent, changes)
        if (!saved.ok) throw new Error(saved.error || 'failed to save the tool table for this conversation')
        const changed = changes.filter((c) => (c.hidden ? !hidden.has(c.name) : hidden.has(c.name))).map((c) => c.name)
        const lines = [
          'OK: ' + (action === 'enable' ? 'enabled' : 'disabled') + ': ' + (changed.join(', ') || '(nothing changed)')
            + governingScopeNote(deps) + '.',
          'These take effect from the next request.',
        ]
        if (unknown.length > 0) lines.push('not this plugin\'s tools (ignored): ' + unknown.join(', '))
        // 说清「这一层看得见的条数」：模型据此判断自己还有没有别的路。
        const total = deps.toolTableSizes.size
        lines.push((total - next.length) + ' of ' + total + ' tools are available here now.')
        return lines.join('\n')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:4060-4085](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L4060-L4085)

可记录持久状态与重排先后。

<details>
<summary>查看原文（26行）</summary>

```text
      const backfillBaselineTt = scope?.baseline !== undefined && scope.baseline.toolTableHidden === undefined
      const base = scope?.baseline?.toolTableHidden ?? (backfillBaselineTt ? settings.hidden : undefined)
      try {
        await scopeStore.mutate(sessionId, (cur) => {
          const out: SessionScope = { ...(cur === undefined ? {} : cur) }
          if (backfillBaselineTt && out.baseline !== undefined) {
            out.baseline = { ...out.baseline, toolTableHidden: settings.hidden.slice() }
          }
          // 逐条改的那一路：起点是**锁内的当前生效名单**（现读现改）。
          const next = toggles !== null
            ? applyToolTableToggles(sessionToolTableHidden(cur, settings.hidden), toggles)
            : target
          // 与基线同值就不留显式名单：退出场景 / 全局再变时少一条永远相等的覆盖。
          if (base !== undefined && sameToolNameList(next, base)) delete out.toolTableHidden
          else out.toolTableHidden = next.slice()
          return Object.keys(out).length > 0 ? out : undefined
        })
      } catch (e) {
        return { ok: false, error: '保存失败: ' + message(e) }
      }
      mcp.scheduleToolRestrictions()
      // 同上：会话工具表保存也不等两个目录重算。
      scheduleSkillCatalogRefresh()
      void subagentCatalog.refresh().catch(() => { /* 同上 */ })
      scope = scopeStore.scopeOfSync(sessionId)
      return toolTableSessionPayload(sessionId, scope, settings)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:5328-5363](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/index.ts#L5328-L5363)

权限与确认可分开验收。

<details>
<summary>查看原文（36行）</summary>

```text
      const bypassedByFullAccess = (exec: any): boolean => {
        if (!isApprovalNever(ctx, exec)) return false
        // 留痕：完全权限下跳过确认属于「用户已授权」，但要可审计（日志失败不阻塞主流程）。
        pluginLog()('confirm-bypass', `完全权限（approval=never）：跳过${CONFIRM_LABELS[String(exec && exec.name)]}的确认，直接放行`).catch(() => {})
        return true
      }
      // 确认门是「问用户要不要做」，如果这个请求本来就做不成，弹卡 / 写 bypass 日志只会产生
      // 一次无效审批：用户批准之后模型收到的是「人设不可用」/「人设不存在」/「人设已存在」。
      // 所以先校验，再决定要不要问。校验本身不可用时返回 true（保持原行为，
      // 绝不因为探测失败而少问一次）。
      const subagentManagerRunTargetExists = async (exec: any): Promise<boolean> => {
        try {
          const name = String((exec && exec.arguments && exec.arguments.agent) || '').trim()
          if (!name) return false
          const list = await subagentService.list()
          return list.some((p) => p.name === name)
        } catch (e) {
          return true
        }
      }
      // 不需要 `subagentWriteWouldApply` 那种裁决：它是为"create 要目标未被占用 / update 要
      // 改名已存在"这套两工具分工写的。合并成一条 upsert 之后它恒为"会应用"（判定只剩
      // "存在就改、不存在就建"，没有第三种情况），留着就是一个永远返回 true 的函数。
      ;(ctx.on as (event: string, cb: (exec: any, next: () => unknown) => unknown) => unknown)('tools/pre-execute', async (exec, next) => {
        if (!exec || !CONFIRM_LABELS[String(exec.name)]) return next()
        if (exec.name === 'subagent_manager_run' && !(await subagentManagerRunTargetExists(exec))) return next()
        // 按参数判定的那批（删除的 trash、开关的机器级写入、提示词的正向应用）：
        // 先算"这一次要不要问"，不问就直接放行 —— 不能落到末尾那条 "Run a subagent" 的
        // 兜底分支上。bypass 放到判定之后：`remove list` 这类根本不问的调用不该在
        // 审计日志里留下一条"跳过了确认"。
        const confirmName = String(exec.name)
        if (ARG_CONDITIONAL_CONFIRM_TOOLS.has(confirmName)) {
          const reason = argConditionalConfirmReason(confirmName, exec.arguments, await scopeStore.mode())
          if (reason === null) return next()
          if (bypassedByFullAccess(exec)) return next()
          return Promise.resolve({ kind: 'ask', reason })
```

</details>

**依据 4 · 源码核查**：[src/http-fence.ts:126-149](https://github.com/ouli-1242/dsh-plugin-tool-management/blob/8bb5beba6643d1bbb2410b7a05034a83ca67aa34/src/http-fence.ts#L126-L149)

模拟宿主缺失时应单独验收回环退路。

<details>
<summary>查看原文（24行）</summary>

```text
    if (typeof connection?.requestRejection === 'function') {
      clearRuntimeNote('http-fence-fallback')
      return null
    }
    noteFenceFallback(connection ? 'connection 服务没有 admit / requestRejection' : '未挂载 connection 服务', false)
  } catch (e) {
    // 见上方说明：退回本地判定。**必须出声** —— 静默回退时用户以为浏览器鉴权还在。
    noteFenceFallback(String((e && (e as Error).message) || e), true)
  }

  const hostHdr = headerValue(req, 'host')
  let host: URL
  try { host = new URL('http://' + hostHdr) } catch { return { status: 403, error: 'Host 头缺失或无法解析' } }
  const loopback = host.hostname === 'localhost' || host.hostname === '[::1]'
    || /^127(?:\.\d{1,3}){3}$/.test(host.hostname)
  if (!loopback) return { status: 403, error: 'Host 必须是本机回环地址（防 DNS rebinding）' }
  if (headerValue(req, 'sec-fetch-site') === 'cross-site') return { status: 403, error: '跨站请求被拒' }
  const origin = headerValue(req, 'origin')
  if (origin) {
    try {
      if (new URL(origin).host !== host.host) return { status: 403, error: '跨源请求被拒' }
    } catch { return { status: 403, error: 'Origin 头无法解析' } }
  }
  return null
```

</details>

#### 缺口

- 没有权限验证和效果对照。
  **影响**：工具减少的 token 与误判都待测试。
  **进一步探讨**：记录实际发送 schema、调用拒绝、状态文件和用户解释，比较对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
