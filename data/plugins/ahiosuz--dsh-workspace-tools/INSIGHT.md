# dsh-workspace-tools

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d370852](https://github.com/AHIOSUZ/dsh-workspace-tools/tree/d370852671425f09909862a7d220f7b0538f2f3c)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：按已注册工作区为新根会话自动选择 Agent 与权限预设的设置页和事件监听器。

> **核心亮点**：在官方扩展点上提供工作区级默认规则与设置 UI，避免每次新建根会话手动重选。详见[Q01](#research-q01)。

> **风险与缺陷**：权限可能在异步 Agent 预设选择之后才更新，首 turn 时序未知；旧/大小写路径回退可能误匹配。详见[Q03](#research-q03)和[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 工作区默认预设解决了哪种重复设置，影响哪些会话？](#detail-section-11)
  - [Q02 · 规则如何匹配工作区并应用两类预设？](#detail-section-12)
  - [Q03 · “首回合之前已应用”是否有同步保证？](#detail-section-13)
  - [Q04 · 路径后备匹配是否可能误套规则？](#detail-section-14)
  - [Q05 · 采用时怎样约束权限预设和迁移维护？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多个工作区有不同默认 Agent/权限要求，减少新会话重复选择。详见[Q01](#research-q01)。

手动每会话选择 Agent/权限预设；自动化可省步骤但需要保证匹配与权限时序。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 工作区规则 | 自动选择默认预设 | 仅新根会话 |
| ID/path 匹配 | 子目录覆盖 | path 大小写/旧规则边界 |
| 权限设置 | 自动 read-only 等 | 时序与全权限风险 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH agent/created/settings | 必需 | 新会话事件/规则 | 无自动应用 |
| agentPresets/permissionPresets | 可分别 | 两类预设选择 | 对应项告警/不应用 |
| workspaceRegistry/remote.workspace | 体验必需 | ID 匹配/列表 | 退回路径或列表空 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | web profile 加包/重载 | 设置页出现 |
| 配置 | 选注册工作区、两个预设并保存 | settings revision 成功 |
| 新建 | 在该工作区创建根会话 | 首 turn 前核两项生效 |
| 复核 | 删除/改名/大小写路径 | 避免旧规则误套 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 配置 | DSH Web/已注册工作区，金额未知 | 每工作区选择规则 | 版本兼容未测 |
| 运行 | 每次新根会话读取规则/切预设 | 核持久日志与首 turn | 异步竞态未知 |
| 风险 | danger-full-access 等权限选择 | 定期审目录/失效规则 | 误套边界需验 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 自动预设 | 新根会话事件处理 | 首 turn 前稳定完成 |
| 工作区匹配 | ID 优先/path 回退 | 大小写敏感/旧规则安全 |
| 设置页 | 远端注册列表/带 revision 保存 | 编辑冲突体验 |

> **思考**：权限可能在异步 Agent 预设选择之后才更新，首 turn 时序未知；旧/大小写路径回退可能误匹配。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在官方扩展点上提供工作区级默认规则与设置 UI，避免每次新建根会话手动重选。详见[Q01](#research-q01)。

在官方扩展点上提供工作区级默认规则与设置 UI，避免每次新建根会话手动重选。详见[Q01](#research-q01)。

官方事件/设置服务集成和 ID 优先可借鉴；void 异步事件和 path case-fold 是重点边界。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

权限可能在异步 Agent 预设选择之后才更新，首 turn 时序未知；旧/大小写路径回退可能误匹配。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在低权限工作区限定试用；全权限规则和大小写敏感环境先验证匹配及首 turn 顺序。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核设置/匹配；事件回调 void 异步任务无首 turn 完成保证，路径无条件小写回退存在误套边界；目标宿主未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、src/index.js、src/client/index.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、src/index.js、src/client/index.js、lib/index.js 与包声明；未运行目标插件/宿主。旧 META 仅复用。
- 下一步：目标 DSH 测新建/恢复/fork/subagent、异步 select 延迟、Linux 大小写目录、删除工作区、保存冲突和持久日志。

**分析版本**

- **仓库**：[AHIOSUZ/dsh-workspace-tools](https://github.com/AHIOSUZ/dsh-workspace-tools)
- **版本号**：0.4.6（[固定提交 d370852](https://github.com/AHIOSUZ/dsh-workspace-tools/tree/d370852671425f09909862a7d220f7b0538f2f3c)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进是创建时等待应用、区分 OS 路径语义、隔离已删除工作区规则并明确保存冲突提示。详见[Q05](#research-q05)。

目标 DSH 测新建/恢复/fork/subagent、异步 select 延迟、Linux 大小写目录、删除工作区、保存冲突和持久日志。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 896 | 804 | 83 | — |
| .md | source | 2 | 148 | — | — | 2010 |
| .mjs | source | 3 | 227 | 196 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AHIOSUZ/dsh-workspace-tools/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**工作区默认 Agent/权限预设能否准确匹配且在首 turn 前稳定生效？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作区默认预设解决了哪种重复设置，影响哪些会话？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

设置页允许对已注册工作区存一条规则，给之后新建的根会话预选 Agent 与权限预设；空值继承全局默认。按作者设计，恢复、fork、subagent、已有 turn 的会话不变，适合在多个信任等级不同的工作区减少手工切换。规则写入 settings 的 workspace-tools 命名空间，源码没有文件/命令/网络执行；但选择 danger-full-access 会改变宿主权限，不能将其视为无风险设置。实际宿主行为与作者所谓“手动选择总优先”尚未联调。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:5-29](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/README.zh.md#L5-L29)

作者场景/范围/优先级

<details>
<summary>查看原文（25行）</summary>

```text
DeepSeek Harness 工作区工具：为已注册的工作区分别配置新建根会话自动应用的 Agent 预设与权限预设，免去每次新建会话都手动重选。

![工作区默认设置页](assets/screenshot-1.png)

**仅使用官方扩展点，官方 0.1.5-rc.1 及以上版本开箱即用，无需任何 DSH 补丁。**

## 功能

- 在 **设置 → 工作区默认设置** 新增一个配置页：每条规则 = 选一个已注册的工作区 + 选新会话的 Agent 预设与权限预设（都可留空 = 继承全局默认）。
- 工作区下拉实时列出侧边栏里已注册的工作区，只显示工作区名字；被删除的工作区规则会标注占位，不会静默失效。
- 规则以工作区 id 为主键存储（附带路径与标题做冗余显示），工作区改名或路径大小写变化都不影响匹配。

## 工作方式

- 每当新的根会话发布（官方 `agent/created` 事件，早于首个对话回合），插件把会话的工作目录（`session.header.cwd`）反查为已注册工作区，命中某条规则时：
  - Agent 预设经官方 `agentPresets.select` 切换并写入会话持久日志；
  - 权限预设经官方 `permissionPresets.set` 提交（沙箱模式与审批策略随之联动）。
- 匹配范围：会话工作目录等于该工作区目录，或位于其子目录内。

## 生效范围与优先级

- 只影响**之后新建的根会话**：已有会话、恢复的会话、fork 与 subagent 一律不改（subagent 与 fork 由会话头部的父会话标记与委托深度识别）。
- 会话一旦开始（首个 turn 启动）就不再切换；已开始或已恢复的会话即使命中规则也不会被改动。
- 你在会话到达后手动做的选择（新建会话芯片的暂存预设、会话内切换预设）发生在自动应用之后，**总是优先生效**。
- 新会话在首个 turn 之前会短暂显示全局默认，随后自动切换为工作区默认——会话列表与持久日志都会记录这次选择。
```

</details>

**依据 2 · 源码核查**：[src/index.js:29-55](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L29-L55)

规则 schema 与权限选项

<details>
<summary>查看原文（27行）</summary>

```text
/** Settings namespace carrying the workspace rules. */
export const SETTINGS_NAMESPACE = 'workspace-tools'

/** Permission preset choices DSH ships; '' means "inherit the global default". */
const PERMISSION_CHOICES = ['', 'read-only', 'workspace-write', 'danger-full-access']

const ruleSchema = z.object({
	workspaceId: z.string().default('').description(
		'工作区 id（设置页从已注册工作区中选择；与 path 一同作为匹配主键）',
	),
	title: z.string().default('').description('工作区名称，仅用于展示'),
	path: z.string().default('').description(
		'工作区目录的绝对路径（会话工作目录位于该目录或其子目录时生效）',
	),
	agentPreset: z.string().default('').description(
		'新会话 Agent 预设 id；留空 = 继承全局默认（id 见 设置 → Agent 预设）',
	),
	permissionPreset: z.union(
		PERMISSION_CHOICES.map((value) => z.const(value)),
	).default('').description(
		'新会话权限预设；留空 = 继承全局默认',
	),
})

const settingsSchema = z.object({
	rules: z.array(ruleSchema).default([]).description('按顺序匹配；命中即应用，后续规则不再考虑'),
}).description('工作区默认设置（新会话自动应用的 Agent 与权限预设）')
```

</details>

**依据 3 · 源码核查**：[src/index.js:165-196](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L165-L196)

只处理特定 agent/created 会话

<details>
<summary>查看原文（32行）</summary>

```text
	ctx.on('agent/created', ({ agent }) => {
		try {
			const session = agent?.session
			const header = session?.header
			if (header === undefined) return
			// Subagents, delegation children, and fork children never inherit
			// workspace defaults; only root sessions do. The official create flow
			// stamps delegationDepth: 0 on root sessions, so 0 counts as root.
			if (header.parentSession !== undefined) return
			if (Number(header.delegationDepth ?? 0) > 0) return
			const cwd = header.cwd
			if (typeof cwd !== 'string' || cwd === '') return
			if (sessionHasTurns(ctx, session)) return
			const current = readRulesSource()
			const list = Array.isArray(current?.rules) ? current.rules.filter(usableRule) : []
			// Primary match: resolve the cwd to its registered Workspace and
			// compare ids. Fallback: the denormalized rule path prefix (covers
			// sessions opened in a subdirectory of the workspace).
			let rule
			try {
				const workspace = ctx.get('workspaceRegistry')?.resolveByPath?.(cwd)
				rule = workspace === undefined ? undefined : matchRuleById(list, workspace.id)
			} catch {
				/* unresolvable cwd falls through to the path match */
			}
			if (rule === undefined) rule = matchRule(list, cwd)
			if (rule === undefined) return
			void applyRule(ctx, agent, rule)
		} catch (error) {
			log(ctx, `agent/created handling failed: ${errorMessage(error)}`)
		}
	})
```

</details>

**依据 4 · 源码核查**：[src/client/index.js:176-196](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/client/index.js#L176-L196)

用户设置写入

<details>
<summary>查看原文（21行）</summary>

```text
  const save = async () => {
    setError(undefined)
    setStatus(undefined)
    const clean = rows
      .map((rule) => ({
        workspaceId: String(rule.workspaceId ?? '').trim(),
        path: String(rule.path ?? '').trim(),
        title: String(rule.title ?? '').trim(),
        agentPreset: String(rule.agentPreset ?? '').trim(),
        permissionPreset: String(rule.permissionPreset ?? '').trim(),
      }))
      .filter((rule) => rule.workspaceId !== '' || rule.path !== '')
    try {
      const response = await remote.settings.replace('workspace-tools', { rules: clean }, revision)
      if (!response.ok) throw new Error(response.error?.message ?? 'settings/replace failed')
      setStatus(t.saved)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
      await load()
    }
```

</details>

#### 缺口

- 目标 DSH 会话生命周期与权限语义未测
  **影响：**不能保证自动选择总在首回合前完成
  **进一步探讨：**目标宿主新建/恢复/fork/subagent 矩阵验证

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规则如何匹配工作区并应用两类预设？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

Host 监听 agent/created，跳过带 parentSession/delegationDepth 的子会话和已有 turn；先用 workspaceRegistry.resolveByPath(cwd) 得到已注册 ID 命中规则，失败或未命中再以路径前缀匹配首条规则。应用时先 await agentPresets.select，再调用 permissionPresets.set；两项独立捕获并日志警告。客户端 settings.section 用 remote.workspace.follow 获取注册工作区，remote.settings.replace 带 revision 保存，Agent 列表过滤 broken。依赖官方服务存在，目标版本联调未做。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:57-85](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L57-L85)

路径规范化及首条规则

<details>
<summary>查看原文（29行）</summary>

```text
/** Normalize a path for lenient comparison: unified separators, no trailing separator, case-folded. */
export function normalizePath(path) {
	return String(path).replaceAll('/', '\\').replace(/\\+$/, '').trim().toLowerCase()
}

/** Whether one rule object is usable for matching (a workspace id or a path must be present). */
function usableRule(rule) {
	if (rule === null || typeof rule !== 'object') return false
	if (typeof rule.workspaceId === 'string' && rule.workspaceId.trim() !== '') return true
	return typeof rule.path === 'string' && normalizePath(rule.path) !== ''
}

/** Find the first rule for one resolved Workspace id. */
function matchRuleById(rules, workspaceId) {
	if (workspaceId === undefined) return undefined
	return rules.find((rule) => typeof rule.workspaceId === 'string' && rule.workspaceId === workspaceId)
}

/** Find the first rule whose stored directory contains the session cwd (exact or a parent). */
export function matchRule(rules, cwd) {
	const wanted = normalizePath(cwd)
	if (wanted === '') return undefined
	for (const rule of rules) {
		if (!usableRule(rule)) continue
		const base = normalizePath(rule.path)
		if (base === '') continue
		if (wanted === base || wanted.startsWith(`${base}\\`)) return rule
	}
	return undefined
```

</details>

**依据 2 · 源码核查**：[src/index.js:106-138](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L106-L138)

两类预设应用

<details>
<summary>查看原文（33行）</summary>

```text
/** Apply one matched rule to a freshly created root agent. */
export async function applyRule(ctx, agent, rule) {
	const session = agent.session
	const agentPreset = typeof rule.agentPreset === 'string' ? rule.agentPreset.trim() : ''
	const permissionPreset = typeof rule.permissionPreset === 'string' ? rule.permissionPreset.trim() : ''

	if (agentPreset !== '') {
		const presets = ctx.get('agentPresets')
		if (typeof presets?.select !== 'function') {
			log(ctx, `session "${session.id}": agentPresets service unavailable; preset "${agentPreset}" not applied`)
		} else {
			try {
				const current = presets.composedPreset?.(agent.ctx)
				if (current !== agentPreset) await presets.select(agent, agentPreset)
			} catch (error) {
				log(ctx, `session "${session.id}": agent preset "${agentPreset}" was not applied: ${errorMessage(error)}`)
			}
		}
	}

	if (permissionPreset !== '') {
		const permissions = ctx.get('permissionPresets')
		if (typeof permissions?.set !== 'function') {
			log(ctx, `session "${session.id}": permissionPresets service unavailable; preset "${permissionPreset}" not applied`)
		} else {
			try {
				if (permissions.current(session) !== permissionPreset) permissions.set(session, permissionPreset)
			} catch (error) {
				log(ctx, `session "${session.id}": permission preset "${permissionPreset}" was not applied: ${errorMessage(error)}`)
			}
		}
	}
}
```

</details>

**依据 3 · 源码核查**：[src/index.js:154-197](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L154-L197)

注册与匹配

<details>
<summary>查看原文（44行）</summary>

```text
export function apply(ctx) {
	/** Live rules source; installed together with the settings namespace. */
	let readRulesSource = () => ({ rules: [] })

	ctx.inject(['settings'], (settingsCtx) => {
		settingsCtx.settings.installSection(ctx, SETTINGS_NAMESPACE, settingsSchema, { rules: [] }, {
			setSource: (read) => { readRulesSource = read },
			onChange: () => {},
		})
	})

	ctx.on('agent/created', ({ agent }) => {
		try {
			const session = agent?.session
			const header = session?.header
			if (header === undefined) return
			// Subagents, delegation children, and fork children never inherit
			// workspace defaults; only root sessions do. The official create flow
			// stamps delegationDepth: 0 on root sessions, so 0 counts as root.
			if (header.parentSession !== undefined) return
			if (Number(header.delegationDepth ?? 0) > 0) return
			const cwd = header.cwd
			if (typeof cwd !== 'string' || cwd === '') return
			if (sessionHasTurns(ctx, session)) return
			const current = readRulesSource()
			const list = Array.isArray(current?.rules) ? current.rules.filter(usableRule) : []
			// Primary match: resolve the cwd to its registered Workspace and
			// compare ids. Fallback: the denormalized rule path prefix (covers
			// sessions opened in a subdirectory of the workspace).
			let rule
			try {
				const workspace = ctx.get('workspaceRegistry')?.resolveByPath?.(cwd)
				rule = workspace === undefined ? undefined : matchRuleById(list, workspace.id)
			} catch {
				/* unresolvable cwd falls through to the path match */
			}
			if (rule === undefined) rule = matchRule(list, cwd)
			if (rule === undefined) return
			void applyRule(ctx, agent, rule)
		} catch (error) {
			log(ctx, `agent/created handling failed: ${errorMessage(error)}`)
		}
	})
}
```

</details>

**依据 4 · 源码核查**：[src/client/index.js:122-164](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/client/index.js#L122-L164)

远端预设/工作区读取

<details>
<summary>查看原文（43行）</summary>

```text
  const load = useCallback(async () => {
    try {
      const [presetRows, settingsView] = await Promise.all([remote.agentPresets.list(), remote.settings.describe()])
      if (!presetRows.ok) throw new Error(presetRows.error?.message ?? 'agentPresets/list failed')
      if (!settingsView.ok) throw new Error(settingsView.error?.message ?? 'settings/describe failed')
      setPresets((presetRows.value.presets ?? []).filter((row) => row.broken === undefined))
      const permissionView = (settingsView.value.namespaces ?? []).find((row) => row.ns === 'permission')
      const choices = permissionChoices(permissionView?.schema)
      const globalDefault = permissionView?.value?.defaultPreset
      setPermissions(choices.map((id) => ({ value: id, name: id === globalDefault ? `${permissionLabel(id)} ★` : permissionLabel(id) })))
      const mine = (settingsView.value.namespaces ?? []).find((row) => row.ns === 'workspace-tools')
      const rules = Array.isArray(mine?.value?.rules) ? mine.value.rules : []
      setRows(rules.map((rule) => ({ ...rule })))
      setRevision(mine?.revision)
      setError(undefined)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setLoading(false)
    }
  }, [remote])

  useEffect(() => { void load() }, [load])

  // Live workspace list; rules may only target registered workspaces.
  useEffect(() => {
    const controller = new AbortController()
    void (async () => {
      try {
        for await (const frame of remote.workspace.follow(controller.signal)) {
          if (frame?.type === 'baseline') setWorkspaces(frame.value?.items ?? [])
          else if (frame?.type === 'upsert') setWorkspaces((previous) => [
            ...previous.filter((row) => row.workspaceId !== frame.workspace?.workspaceId),
            frame.workspace,
          ])
          else if (frame?.type === 'remove') setWorkspaces((previous) => previous.filter((row) => row.workspaceId !== frame.workspaceId))
        }
      } catch {
        if (!controller.signal.aborted) setWorkspaces([])
      }
    })()
    return () => controller.abort()
  }, [remote])
```

</details>

**依据 5 · 源码核查**：[src/client/index.js:176-196](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/client/index.js#L176-L196)

revision 写设置

<details>
<summary>查看原文（21行）</summary>

```text
  const save = async () => {
    setError(undefined)
    setStatus(undefined)
    const clean = rows
      .map((rule) => ({
        workspaceId: String(rule.workspaceId ?? '').trim(),
        path: String(rule.path ?? '').trim(),
        title: String(rule.title ?? '').trim(),
        agentPreset: String(rule.agentPreset ?? '').trim(),
        permissionPreset: String(rule.permissionPreset ?? '').trim(),
      }))
      .filter((rule) => rule.workspaceId !== '' || rule.path !== '')
    try {
      const response = await remote.settings.replace('workspace-tools', { rules: clean }, revision)
      if (!response.ok) throw new Error(response.error?.message ?? 'settings/replace failed')
      setStatus(t.saved)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
      await load()
    }
```

</details>

#### 缺口

- 远端服务契约/错误日志与持久化结果未核
  **影响：**源码只说明调用路径，不保证实际保存成功
  **进一步探讨：**目标 DSH 0.1.5-rc.1+ 逐步验证服务调用和日志

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “首回合之前已应用”是否有同步保证？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

agent/created 回调内执行 void applyRule(ctx, agent, rule)，没有 return/await 此异步任务；applyRule 遇 Agent 预设时 await presets.select，之后才设置权限预设。事件发布方若不等待该异步任务，首回合可能与预设选择并发，甚至在权限更新前启动。是否真的出现竞态取决于 DSH 发布事件与首回合时序，本轮未运行宿主，因此作者的“早于首回合/手动选择总赢”只能视作预期。建议使事件处理可等待或采用创建事务/状态门控。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:19-29](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/README.zh.md#L19-L29)

作者声称发布早于首回合与优先级

<details>
<summary>查看原文（11行）</summary>

```text
- 每当新的根会话发布（官方 `agent/created` 事件，早于首个对话回合），插件把会话的工作目录（`session.header.cwd`）反查为已注册工作区，命中某条规则时：
  - Agent 预设经官方 `agentPresets.select` 切换并写入会话持久日志；
  - 权限预设经官方 `permissionPresets.set` 提交（沙箱模式与审批策略随之联动）。
- 匹配范围：会话工作目录等于该工作区目录，或位于其子目录内。

## 生效范围与优先级

- 只影响**之后新建的根会话**：已有会话、恢复的会话、fork 与 subagent 一律不改（subagent 与 fork 由会话头部的父会话标记与委托深度识别）。
- 会话一旦开始（首个 turn 启动）就不再切换；已开始或已恢复的会话即使命中规则也不会被改动。
- 你在会话到达后手动做的选择（新建会话芯片的暂存预设、会话内切换预设）发生在自动应用之后，**总是优先生效**。
- 新会话在首个 turn 之前会短暂显示全局默认，随后自动切换为工作区默认——会话列表与持久日志都会记录这次选择。
```

</details>

**依据 2 · 源码核查**：[src/index.js:106-138](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L106-L138)

异步选择再设置权限

<details>
<summary>查看原文（33行）</summary>

```text
/** Apply one matched rule to a freshly created root agent. */
export async function applyRule(ctx, agent, rule) {
	const session = agent.session
	const agentPreset = typeof rule.agentPreset === 'string' ? rule.agentPreset.trim() : ''
	const permissionPreset = typeof rule.permissionPreset === 'string' ? rule.permissionPreset.trim() : ''

	if (agentPreset !== '') {
		const presets = ctx.get('agentPresets')
		if (typeof presets?.select !== 'function') {
			log(ctx, `session "${session.id}": agentPresets service unavailable; preset "${agentPreset}" not applied`)
		} else {
			try {
				const current = presets.composedPreset?.(agent.ctx)
				if (current !== agentPreset) await presets.select(agent, agentPreset)
			} catch (error) {
				log(ctx, `session "${session.id}": agent preset "${agentPreset}" was not applied: ${errorMessage(error)}`)
			}
		}
	}

	if (permissionPreset !== '') {
		const permissions = ctx.get('permissionPresets')
		if (typeof permissions?.set !== 'function') {
			log(ctx, `session "${session.id}": permissionPresets service unavailable; preset "${permissionPreset}" not applied`)
		} else {
			try {
				if (permissions.current(session) !== permissionPreset) permissions.set(session, permissionPreset)
			} catch (error) {
				log(ctx, `session "${session.id}": permission preset "${permissionPreset}" was not applied: ${errorMessage(error)}`)
			}
		}
	}
}
```

</details>

**依据 3 · 源码核查**：[src/index.js:165-193](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L165-L193)

事件回调 void applyRule

<details>
<summary>查看原文（29行）</summary>

```text
	ctx.on('agent/created', ({ agent }) => {
		try {
			const session = agent?.session
			const header = session?.header
			if (header === undefined) return
			// Subagents, delegation children, and fork children never inherit
			// workspace defaults; only root sessions do. The official create flow
			// stamps delegationDepth: 0 on root sessions, so 0 counts as root.
			if (header.parentSession !== undefined) return
			if (Number(header.delegationDepth ?? 0) > 0) return
			const cwd = header.cwd
			if (typeof cwd !== 'string' || cwd === '') return
			if (sessionHasTurns(ctx, session)) return
			const current = readRulesSource()
			const list = Array.isArray(current?.rules) ? current.rules.filter(usableRule) : []
			// Primary match: resolve the cwd to its registered Workspace and
			// compare ids. Fallback: the denormalized rule path prefix (covers
			// sessions opened in a subdirectory of the workspace).
			let rule
			try {
				const workspace = ctx.get('workspaceRegistry')?.resolveByPath?.(cwd)
				rule = workspace === undefined ? undefined : matchRuleById(list, workspace.id)
			} catch {
				/* unresolvable cwd falls through to the path match */
			}
			if (rule === undefined) rule = matchRule(list, cwd)
			if (rule === undefined) return
			void applyRule(ctx, agent, rule)
		} catch (error) {
```

</details>

#### 缺口

- DSH 事件派发是否等待 Promise、首 turn 间隔未知
  **影响：**不能保证预设和权限在首 turn 前原子生效
  **进一步探讨：**目标宿主人工/受控延迟选择预设测试竞态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 路径后备匹配是否可能误套规则？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

normalizePath 无条件把 / 改反斜杠、去尾分隔并转小写；在大小写敏感文件系统，/Work 与 /work 会被视作同一路径。若 ID 解析失败或规则 id 不匹配，代码回退按规范化 path 前缀匹配，旧/删除工作区规则也可能按旧 path 继续作用于相同目录，尽管 UI 把它标作“工作区已删除”。这不直接证明真实误套，因为正常 ID 匹配可能先命中；应在 Linux/WSL 与工作区删除/重建场景验证，并为 ID 规则限制路径回退。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:57-85](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L57-L85)

无条件 case-fold 与首条路径规则

<details>
<summary>查看原文（29行）</summary>

```text
/** Normalize a path for lenient comparison: unified separators, no trailing separator, case-folded. */
export function normalizePath(path) {
	return String(path).replaceAll('/', '\\').replace(/\\+$/, '').trim().toLowerCase()
}

/** Whether one rule object is usable for matching (a workspace id or a path must be present). */
function usableRule(rule) {
	if (rule === null || typeof rule !== 'object') return false
	if (typeof rule.workspaceId === 'string' && rule.workspaceId.trim() !== '') return true
	return typeof rule.path === 'string' && normalizePath(rule.path) !== ''
}

/** Find the first rule for one resolved Workspace id. */
function matchRuleById(rules, workspaceId) {
	if (workspaceId === undefined) return undefined
	return rules.find((rule) => typeof rule.workspaceId === 'string' && rule.workspaceId === workspaceId)
}

/** Find the first rule whose stored directory contains the session cwd (exact or a parent). */
export function matchRule(rules, cwd) {
	const wanted = normalizePath(cwd)
	if (wanted === '') return undefined
	for (const rule of rules) {
		if (!usableRule(rule)) continue
		const base = normalizePath(rule.path)
		if (base === '') continue
		if (wanted === base || wanted.startsWith(`${base}\\`)) return rule
	}
	return undefined
```

</details>

**依据 2 · 源码核查**：[src/index.js:180-191](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L180-L191)

ID 失败回退 path

<details>
<summary>查看原文（12行）</summary>

```text
			// Primary match: resolve the cwd to its registered Workspace and
			// compare ids. Fallback: the denormalized rule path prefix (covers
			// sessions opened in a subdirectory of the workspace).
			let rule
			try {
				const workspace = ctx.get('workspaceRegistry')?.resolveByPath?.(cwd)
				rule = workspace === undefined ? undefined : matchRuleById(list, workspace.id)
			} catch {
				/* unresolvable cwd falls through to the path match */
			}
			if (rule === undefined) rule = matchRule(list, cwd)
			if (rule === undefined) return
```

</details>

**依据 3 · 源码核查**：[src/client/index.js:48-83](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/client/index.js#L48-L83)

删除工作区仍作为旧规则显示

<details>
<summary>查看原文（36行）</summary>

```text
function RuleRow({ rule, presets, permissions, workspaces, t, onChange, onRemove }) {
  const known = workspaces.find((row) => row.workspaceId === rule.workspaceId)
  const stale = !known && rule.workspaceId !== undefined && rule.workspaceId !== ''
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12,
      alignItems: 'end', padding: '10px 0',
      borderTop: '1px solid var(--dsw-alias-border-secondary, rgba(128,128,128,.25))',
    }}>
      <label style={cell}>
        <span style={cellLabel}>{t.workspace}</span>
        <select
          style={field}
          value={known !== undefined ? known.workspaceId : stale ? rule.workspaceId : ''}
          onChange={(event) => {
            const workspace = workspaces.find((row) => row.workspaceId === event.target.value)
            onChange(workspace === undefined
              ? { workspaceId: '', path: '', title: '' }
              : {
                  workspaceId: workspace.workspaceId,
                  path: workspace.path,
                  title: workspace.title ?? '',
                })
          }}
        >
          <option value="">{t.pick}</option>
          {workspaces.map((row) => (
            <option key={row.workspaceId} value={row.workspaceId} title={row.path}>
              {row.title ?? row.path}
            </option>
          ))}
          {stale && (
            <option value={rule.workspaceId} title={rule.path}>
              {t.stale} {rule.title ?? rule.workspaceId.slice(0, 8)}
            </option>
          )}
```

</details>

#### 缺口

- 目标 workspaceRegistry 在路径大小写/删除后的行为未测
  **影响：**权限预设可能落到非预期工作区
  **进一步探讨：**大小写目录/工作区删建/重名规则测试

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用时怎样约束权限预设和迁移维护？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

可先在低权限测试工作区配置一条规则，保存后核 settings revision 与新根会话持久日志，再扩大到不同工作区；含 danger-full-access 的规则须逐目录审查。客户端保存失败会重新 load，从远端重取规则，可能丢弃本地未保存修改；已删除工作区在 UI 仍显示占位。可改进异步应用确认、OS 语义路径规范化、失效规则隔离和冲突保存提示；这些均未实现。当前适合观察/限定试用，不能仅凭 README 的冒烟测试声明视作宿主验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:31-72](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/README.zh.md#L31-L72)

作者安装、兼容和安全说明

<details>
<summary>查看原文（42行）</summary>

````text
## 安装与使用

```sh
dsh plugin --profile web add @ahiosuz/dsh-workspace-tools
```

1. 重启（或重载）DSH Web。
2. 打开 **设置 → 工作区默认设置** → **添加规则**。
3. 从下拉选择工作区（只显示名字；悬浮可看完整路径），选好两个预设，**保存**。
4. 在该工作区里**新建**一个对话验证：首个回合前自动切换为规则配置的预设。

## 兼容性

- DSH `0.1.5-rc.1`（官方构建，无需补丁）。使用的官方能力：`agent/created` 事件、`agentPresets.select`、`permissionPresets` 服务、`settings.installSection` 设置命名空间、`remote.workspace.follow` 状态流。
- 0.3.0 及更早版本依赖 DSH 补丁提供的 `workspaceActions` 行菜单与 `sidebar.workspaces.overlay` 槽位；官方仓库不接受外部补丁，0.4.0 起改走纯官方扩展点，配置入口从工作区行菜单改为设置页。

## 常见问题

**为什么新建会话一开始显示的是全局默认？**
自动应用发生在会话发布之后（`agent/created`）、首个对话回合之前——所以会短暂显示全局默认再切换。这是官方"创建后切换"链路的时机，不影响最终生效。

**已有会话 / 恢复的会话为什么没变？**
规则只作用于新建的根会话。恢复、fork、subagent 和已开始的会话都被明确跳过；你手动选择过的会话以你的选择为准。

**工作区下拉里没有我要的目录？**
下拉只列出已在 DSH 侧边栏注册的工作区。先在侧边栏把目录注册为工作区，再回到本页添加规则。

**切换失败了怎么排查？**
最常见的失败是目标预设本身无法挂载——例如自定义预设文件里 persona 条目缺少必填的 `prefix` 字段（schema 为 `prefix` 必填、`suffix` 可选，写成了 `text` 就会挂载失败）。挂载失败会记录在 DSH 服务端日志中；修正预设文件后，再新建的会话即可生效。

## 开发

```sh
npm install
npm run check
```

`npm run check` 会构建两个半区并运行冒烟测试（规则匹配、监听器行为、客户端 bundle 契约、点分注入声明防回归）。npm 包预构建并包含 `lib/index.js` 与 `lib/client.js`，安装时不执行生命周期脚本。

## 安全边界

插件只读取会话的工作目录（`session.header.cwd`）并调用官方预设服务；规则存储在用户设置文档（`settings.yaml` 的 `workspace-tools` 命名空间）中，可随时编辑或清空。插件不包含遥测、凭据访问、命令执行或网络访问。启用 danger-full-access 属于 DSH 官方权限预设语义，请仅对信任的目录使用。
````

</details>

**依据 2 · 源码核查**：[src/client/index.js:166-196](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/client/index.js#L166-L196)

旧规则回填/保存与错误重载

<details>
<summary>查看原文（31行）</summary>

```text
  // Backfill legacy path-only rules with their workspaceId once the roster arrives.
  useEffect(() => {
    if (workspaces.length === 0) return
    setRows((previous) => previous.map((rule) => {
      if (rule.workspaceId !== undefined && rule.workspaceId !== '') return rule
      const match = workspaces.find((row) => row.path.toLowerCase() === String(rule.path ?? '').toLowerCase())
      return match === undefined ? rule : { ...rule, workspaceId: match.workspaceId, title: match.title ?? rule.title }
    }))
  }, [workspaces])

  const save = async () => {
    setError(undefined)
    setStatus(undefined)
    const clean = rows
      .map((rule) => ({
        workspaceId: String(rule.workspaceId ?? '').trim(),
        path: String(rule.path ?? '').trim(),
        title: String(rule.title ?? '').trim(),
        agentPreset: String(rule.agentPreset ?? '').trim(),
        permissionPreset: String(rule.permissionPreset ?? '').trim(),
      }))
      .filter((rule) => rule.workspaceId !== '' || rule.path !== '')
    try {
      const response = await remote.settings.replace('workspace-tools', { rules: clean }, revision)
      if (!response.ok) throw new Error(response.error?.message ?? 'settings/replace failed')
      setStatus(t.saved)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
      await load()
    }
```

</details>

**依据 3 · 源码核查**：[src/index.js:29-55](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js#L29-L55)

权限级别/顺序规则

<details>
<summary>查看原文（27行）</summary>

```text
/** Settings namespace carrying the workspace rules. */
export const SETTINGS_NAMESPACE = 'workspace-tools'

/** Permission preset choices DSH ships; '' means "inherit the global default". */
const PERMISSION_CHOICES = ['', 'read-only', 'workspace-write', 'danger-full-access']

const ruleSchema = z.object({
	workspaceId: z.string().default('').description(
		'工作区 id（设置页从已注册工作区中选择；与 path 一同作为匹配主键）',
	),
	title: z.string().default('').description('工作区名称，仅用于展示'),
	path: z.string().default('').description(
		'工作区目录的绝对路径（会话工作目录位于该目录或其子目录时生效）',
	),
	agentPreset: z.string().default('').description(
		'新会话 Agent 预设 id；留空 = 继承全局默认（id 见 设置 → Agent 预设）',
	),
	permissionPreset: z.union(
		PERMISSION_CHOICES.map((value) => z.const(value)),
	).default('').description(
		'新会话权限预设；留空 = 继承全局默认',
	),
})

const settingsSchema = z.object({
	rules: z.array(ruleSchema).default([]).description('按顺序匹配；命中即应用，后续规则不再考虑'),
}).description('工作区默认设置（新会话自动应用的 Agent 与权限预设）')
```

</details>

#### 缺口

- 目标持久日志、迁移与失败编辑体验未测
  **影响：**不能给出全局无误套/无需维护承诺
  **进一步探讨：**测试保存冲突、工作区变更和全权限规则验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
