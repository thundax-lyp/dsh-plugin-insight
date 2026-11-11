# 军械库（DSH Armory）

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0fcf744](https://github.com/2026heshao/dsh-armory/tree/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28)

<!-- BEGIN META -->
[![GitHub ★ 108](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=108&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 7,786](https://img.shields.io/static/v1?label=npm+30d&message=7%2C786&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)
<!-- END META -->

> **功能**：为 DSH 提供 MCP、Skill、专家和插件的集中管理，并查看工具使用和发送清单。

> **亮点**：统一导入、项目连接和工具账本，使用户能从配置变更追到会话工具实际投射。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：日志中没有工具记录不能说明没有成本；当前 token 口径是字符数估算，连接和真实请求仍需回读。[Q03](#research-q03)

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
  - [Q01 · 统一面板相对手工编辑配置多做了什么？](#detail-section-11)
  - [Q02 · 项目工具如何热生效和撤下？](#detail-section-12)
  - [Q03 · 工具账本能证明节省了真实 token 吗？](#detail-section-13)
  - [Q04 · 怎样安全采用，并验证少工具是否仍完成任务？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个 DSH 项目、MCP 或 Skill 的用户可用面板集中查看配置与状态。

手工编辑 profile 与项目配置能精细控制，但迁移、比较工具清单和重连需要分别操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 导入 | 预览并规范化配置 | 同名跳过 |
| 项目 MCP | 连接与按范围投射 | 就绪可晚于写盘 |
| 账本 | 比较注册与请求工具 | 估算非计费 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH loader、scope | 管理服务与项目投射 | 以目标版本验证 |
| 受控 MCP | 测试连接与工具 | 单独验证权限和命令 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 用一个临时项目和假 MCP | 先预览重名 |
| 持续 | 核对项目会话和账本 | 估算与实际请求分开看 |
| 退出 | 撤下工具及配置，检查残留 | 异常时恢复备份 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 人工 | 每个合格导入的冲突排查时间 | 未实测 |
| 模型 | 真实输入 token 与合格率 | 账本仅粗估 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 减少配置返工 | 导入保留首项并有跳过提示 | 不验证第三方服务可信度 |
| 项目隔离 | 工具只投射预期项目 | 真实宿主待查 |

> **思考**：日志中没有工具记录不能说明没有成本；当前 token 口径是字符数估算，连接和真实请求仍需回读。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一导入、项目连接和工具账本，使用户能从配置变更追到会话工具实际投射。[Q01](#research-q01) [Q02](#research-q02)

项目配置、连接生命周期与会话工具注册分别处理；诊断留痕降低了静默缺工具的风险。

<a id="detail-section-5"></a>

### 1.4 主要限制

日志中没有工具记录不能说明没有成本；当前 token 口径是字符数估算，连接和真实请求仍需回读。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在临时项目用可控 MCP 试用导入、出现、停用和撤回；若工具误暴露或撤不下就退出。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持导入、项目投射与估算，未执行宿主、外部 MCP 或市场安装。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/import-admission.js、lib/workspace-runtime.js、lib/tool-ledger.js、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定导入、项目 MCP 与工具账本关键源码；未核验市场条目、OAuth 或宿主运行。
- 下一步：模拟配置冲突和两会话，核对清单更新、拒绝非法表达式和关闭后作用域，之后才对照真实用量。

**分析版本**

- **仓库**：[2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory)
- **版本号**：2.5.1（[固定提交 0fcf744](https://github.com/2026heshao/dsh-armory/tree/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用可撤回的工具精简建议做对照，核查同条件任务成功率及真实用量；罕见任务失败或节省不成立就恢复原配置。[Q04](#research-q04)

模拟配置冲突和两会话，核对清单更新、拒绝非法表达式和关闭后作用域，之后才对照真实用量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 320 | 264 | 37 | — |
| .md | source | 34 | 3001 | — | — | 65292 |
| .js | source | 36 | 32731 | 25444 | 6540 | — |
| .mjs | test | 87 | 22685 | 17572 | 3824 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/2026heshao/dsh-armory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断集中管理 MCP 导入、项目生效与工具账本能为 DSH 用户减少多少配置和诊断步骤。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一面板相对手工编辑配置多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有多个 MCP 和技能、在不同 DSH 项目来回切换的人，能用一个面板预览导入、处理同名条目和核查项目工具，而不用来回编辑 profile 与各项目配置。准入递归转换支持的环境变量表达式，无法转换的内容报路径，不回显字段值；对同一批重名保留先出现项并提示跳过。可减少配置错误，但格式通过并不代表目标程序、远端服务或包内容可信。市场规模也不等于可用连接数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-45](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/README.md#L35-L45)

作者说明 MCP、全局与项目、导入和 OAuth 场景。

<details>
<summary>查看原文（11行）</summary>

```text
## 它替你看住的东西

### MCP：连没连上，一眼看到

每个 MCP 一行：状态、传输方式、连接参数、工具数。展开能看到完整的输入 Schema，必填、可选、枚举、默认值都在。凭据默认打码，需要时点一下临时显示，再点一次收回。连不上时就地重连，不用重启宿主。

全局和项目分开管。全局写 profile，所有项目可用；项目写 `.dsh/mcp.json`，只对这个项目的会话可见。项目里还能屏蔽某个全局 MCP，别的项目不受影响。项目配置保存即对正在运行的会话生效，不用重开会话。

从别的客户端搬过来，也不用逐条抄。Claude Code、Codex、Cursor、Windsurf、VS Code、Gemini CLI、Roo Code 等 11 种客户端的配置会被自动检出，预览后一键导入；同名冲突只跳过那一条。粘贴 `mcpServers` JSON 也行。

远端 MCP 要 OAuth 时，服务器返回 401 会直接弹出授权框；浏览器走完发现、注册、PKCE 和回调，令牌写回配置，由插件在到期前刷新。回调收不到时，可以粘贴回调地址或访问令牌。
```

</details>

**依据 2 · 源码核查**：[lib/import-admission.js:30-44](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/import-admission.js#L30-L44)

递归归一环境表达式并对不支持值报错。

<details>
<summary>查看原文（15行）</summary>

```text
function canonicalizeAt(value, path) {
  if (typeof value === 'string') {
    if (!value.startsWith('!!js ') || isTotalExpression(value)) return value
    const canonical = canonicalizeExpression(value)
    // 不静默放行：写下去就是宿主求值时的失败，而不是解析失败。正常路径到这里之前已被
    // `expressionValue` 拒过；这条是给"以后有人把手工拼的 spec 塞进准入"兜底。
    // 报文只给字段路径，不回显值本身——值可能来自用户主目录里的配置。
    if (canonical === null) throw new Error(`导入结果的 ${path} 含不受支持的 !!js 表达式`)
    return canonical
  }
  if (Array.isArray(value)) return value.map((item, index) => canonicalizeAt(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, canonicalizeAt(item, path ? `${path}.${key}` : key)]))
  }
  return value
```

</details>

**依据 3 · 源码核查**：[lib/import-admission.js:56-68](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/import-admission.js#L56-L68)

对集合重名保留首项并记跳过。

<details>
<summary>查看原文（13行）</summary>

```text
export function admitImportedServers(normalized) {
  const servers = (normalized?.servers ?? []).map((server, index) => canonicalizeAt(server, `servers[${index}]`))
  const duplicates = duplicateServerNames(servers)
  const seen = new Set()
  const unique = servers.filter((server) => (seen.has(server.name) ? false : Boolean(seen.add(server.name))))
  // `skipped` 只累加：预览与写盘各自准入一次（幂等），第二次不该丢掉第一次记下的名字——否则
  // 导入结果的"跳过 N 条"会变成空话。提示只在**本次**真的跳过时追加，重复调用不会重复报警。
  const skipped = [...(normalized?.skipped ?? []), ...duplicates]
  const warnings = [...(normalized?.warnings ?? [])]
  if (duplicates.length) {
    warnings.push(`同名条目只保留先出现的那条，已跳过：${duplicates.join('、')}（同一作用域内 serverName 只能有一条）`)
  }
  return { ...normalized, servers: unique, skipped, warnings }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:925-932](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/index.js#L925-L932)

导入准入进入应用路径。

```text
	const admitted = admitImportedServers(normalized);
	return withPatchWrite(ctx, async () => {
		const state = await managedState(ctx);
		// 与预览走同一条解析：同名冲突在这里只影响"写哪几条"，不再让整批失败。
		const { importable, conflicts } = resolveManagedImport(ctx, state, admitted);
		const preview = mergePreview(state.servers, importable, conflicts);
		const releasedNames = mode === "replace" ? state.servers.map((server) => server.name) : preview.updated;
		const releasedIds = new Set(releasedNames.map((name) => state.entryIds.get(name)).filter(Boolean));
```

#### 缺口

- 各来源文件格式和用户迁移效率未实测
  **影响**：只支持机制分析
  **进一步探讨**：用两个包含重复名和环境变量的假客户端配置对照手工迁移

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目工具如何热生效和撤下？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

项目保存后可触发连接对齐。配置失效时跳过，移除或禁用的服务器销毁连接并卸下会话槽；同工作区活会话重新挂载时不会等待远端就绪。会话工具按连接作用域的 schema 查询并注册，以 disposer 撤掉消失工具；失败保留诊断。设计减少重启的机会，但配置写入成功、远端连接 ready 和实际模型请求看到新工具是不同状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace-runtime.js:559-594](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/workspace-runtime.js#L559-L594)

检查禁用、失效、拆卸和不阻塞重挂。

<details>
<summary>查看原文（36行）</summary>

```text
async function reconcileWorkspaceConnections(ctx, wsPath) {
	const generation = activeGenerationByRoot.get(appRoot(ctx));
	if (!generation?.active) return { retired: [], remounted: 0 };
	const config = await readWorkspaceConfigCached(ctx, wsPath);
	if (config.error) {
		ctx.logger?.warn?.(`mcp-manager: 项目配置无效，跳过连接对齐 ${wsPath}: ${config.error}`);
		return { retired: [], remounted: 0 };
	}
	const desired = new Map(config.servers.filter((server) => !server.disabled).map((server) => [server.name, server]));
	const retired = [];
	for (const cell of [...sharedConnBucket(ctx).values()]) {
		const entry = cell.entry;
		if (!entry || entry.wsPath !== wsPath) continue;
		const server = desired.get(entry.serverName);
		if (server) {
			// 配置变了：重载。槽位不由这里处理 —— 随后的重跑挂载会 repoint 到新连接上
			//（那时才知道新连接是谁），所以这里只销毁旧连接。
			if (!isConfigStale(server, wsPath, entry)) continue;
			retired.push(entry.serverName);
			await retireSharedConnection(ctx, entry);
			continue;
		}
		// 配置里已经没有这个 server：连接立刻销毁，**并且**把指向它的会话投射一起撤掉。
		// 只销毁连接会留下「指向已销毁连接」的僵尸工具（调用必失败，但模型仍看得见）。
		retired.push(entry.serverName);
		await retireSharedConnection(ctx, entry);
		dropConnectionSlots(ctx, entry);
	}
	let remounted = 0;
	for (const [agent, state] of [...agentWorkspaceStates]) {
		if (state.root !== appRoot(ctx) || state.wsPath !== wsPath) continue;
		// 不在这里等就绪：这些会话已经活着，没有"首轮"要保护；等就绪只会让写盘阻塞，
		// 而工具会在连接就绪后由 tools/change 补投射。
		await mountProjectMcpForAgent(ctx, agent, generation, { awaitReady: false });
		remounted += 1;
	}
```

</details>

**依据 2 · 源码核查**：[lib/workspace-runtime.js:619-648](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/workspace-runtime.js#L619-L648)

插件代际与会话清理下的引用归还。

<details>
<summary>查看原文（30行）</summary>

```text
function commitSharedConnection(ctx, agentCtx, agent, entry, generation) {
	if (!generation.active) {
		// 插件已卸载：这份连接不可能再被本代复用，直接销毁而不是进入空闲等待。
		void retireSharedConnection(ctx, entry);
		ctx.logger?.warn?.(`mcp-manager: 插件已卸载，放弃接管项目 MCP ${entry.serverName} 的共享连接引用`);
		return null;
	}
	const slots = agentSlotIndex(ctx, agent);
	const existing = slots.get(entry.key);
	if (existing) {
		if (existing.entry === entry) {
			// 同一会话对同一 connKey 重复 acquire：多出的引用当场归还，不积压。
			void releaseSharedConnection(ctx, entry);
			return existing;
		}
		// 同一 connKey 换了新连接（配置就地重载 / 按需重建）：走同一个搬运函数。
		moveSlotToConnection(ctx, existing, entry);
		// 槽位现在用的是"转移来的"那份额度，所以这次 acquire 多拿的一份要还掉。
		void releaseSharedConnection(ctx, entry);
		return existing;
	}
	const slot = { key: entry.key, entry, ctx, agentCtx, agent, toolDisposers: new Map(), release: undefined, disposed: false };
	try {
		slot.release = agentCtx.effect(() => () => disposeProjectSlot(slot), `mcp-manager.projectConn(${entry.serverName})`);
	} catch (error) {
		void releaseSharedConnection(ctx, entry);
		ctx.logger?.warn?.(`mcp-manager: 会话在项目 MCP ${entry.serverName} 建连期间已结束，已归还共享连接引用: ${error?.message ?? error}`);
		return null;
	}
	slots.set(entry.key, slot);
```

</details>

**依据 3 · 源码核查**：[lib/workspace-runtime.js:670-713](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/workspace-runtime.js#L670-L713)

实际逐工具投射、错误与撤回。

<details>
<summary>查看原文（44行）</summary>

```text
function syncSessionProjectTools(ctx, slot) {
	if (slot.disposed) return;
	const { entry, agentCtx } = slot;
	const tools = toolsServiceOf(ctx);
	const agentTools = agentCtx.tools;
	if (!tools || !agentTools || typeof agentTools.register !== "function") return;
	const prefix = `mcp__${entry.serverName}__`;
	const present = new Set();
	let failed = false;
	let schemas = [];
	// 与面板读同一份判定（含作用域故障记账），不另写一套「读空就当没有工具」的启发式。
	if (tools) schemas = readScopedToolSchemas(ctx, entry).schemas;
	for (const schema of schemas) {
		if (!schema.name.startsWith(prefix)) continue;
		present.add(schema.name);
		if (slot.toolDisposers.has(schema.name)) continue;
		let def;
		try {
			def = tools.get(schema.name, entry.scopeKey);
		} catch (error) {
			// 同一个「宿主工具视图不可用」类的问题，归到同一条诊断通道（否则会被上层的
			// reconcile catch 吞掉，变成「会话默默少工具」）。
			failed = true;
			recordWorkspaceMountError(entry.wsPath, entry.serverName, error);
			continue;
		}
		if (!def) continue;
		try {
			slot.toolDisposers.set(schema.name, agentTools.register(def));
		} catch (error) {
			failed = true;
			recordWorkspaceMountError(entry.wsPath, entry.serverName, error);
			ctx.logger?.warn?.(`mcp-manager: 项目 MCP ${entry.serverName} 工具 ${schema.name} 注册失败: ${error?.message ?? error}`);
		}
	}
	// 只在本轮全部成功、且确实拿到了工具时才清除失败记录。放在循环里清会让前一个工具刚记下的
	// 失败被后一个工具的成功抹掉，于是面板看起来一切正常而会话实际缺工具。
	if (!failed && slot.toolDisposers.size) clearWorkspaceMountError(entry.wsPath, entry.serverName);
	// 撤掉已从共享连接消失的工具（服务器 tools/list_changed 或断连）。
	for (const [name, dispose] of slot.toolDisposers) {
		if (present.has(name)) continue;
		try { dispose(); } catch { /* noop */ }
		slot.toolDisposers.delete(name);
	}
```

</details>

#### 缺口

- 同一工作区两个会话并发切换和断连尚未测试
  **影响**：不能断言保存后所有请求都立刻看到一致集合
  **进一步探讨**：在隔离项目挂两个会话，模拟连接迟到、配置删除和重连

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工具账本能证明节省了真实 token 吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

账本从 request/header 的 tools 统计看到的发送清单，并与当前注册 schema 用同一投影比较；token 是 JSON 字符长度除四取整。空工具数组与缺时间的 header 不入趋势，工具清单指纹超上限也截断，因此无记录不能等同零负担。差异可能由会话作用域、日志或快照时点造成，不能仅据此断言插件改动未生效，更不能把估算乘模型费率当账单。接入仍依赖 DSH 的 loader、scope、MCP client 和各远端／本地工具。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tool-ledger.js:181-202](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/tool-ledger.js#L181-L202)

估算是同投影的字符数近似。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 上下文 token 估算。Schema 以 ASCII 为主，4 字符 ≈ 1 token 是公开常用的粗估；
 * 只用于相对比较与量级感知，不承诺精确计费。
 * @param {string} text
 * @returns {number}
 */
function estimateTokens(text) {
	return Math.ceil(text.length / 4);
}

/**
 * 单个工具 Schema 投影成「要下发的那段 JSON」后的上下文税。
 *
 * 注册表侧与日志真实下发侧**必须共用这一个投影**：两处各写一遍 `{name, description,
 * parameters}` 时，任何一侧改了键集合或兜底写法，「注册表快照 vs 真实下发」的偏差里就会
 * 混进口径差而不是真差异，那个偏差卡就成了长期误报的假告警。
 * @param {{name: string, description?: string, parameters?: unknown}} tool
 * @returns {number} 估算 token 数。
 */
function schemaTokensOf(tool) {
	return estimateTokens(JSON.stringify({ name: tool.name, description: tool.description || "", parameters: tool.parameters ?? null }));
}
```

</details>

**依据 2 · 源码核查**：[lib/tool-ledger.js:519-539](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/tool-ledger.js#L519-L539)

日志门槛与清单数量上限。

<details>
<summary>查看原文（21行）</summary>

```text
					} else if (event.type === "request/header") {
						// §6.1 该次请求真实下发给模型的整份工具清单。宿主把 `data.header.tools` 原样
						// 落盘，所以「注册表快照」有了一个可对照的真值：两者不一致就是「改了没生效」。
						const tools = event.data?.header?.tools;
						if (!Array.isArray(tools) || tools.length === 0) continue;
						// 没有 time 的清单快照无法归入日桶，直接丢；这类事件的存在由 undatedCalls
						// 那一路负责显形，两条口径不要混在一起。
						const taxBucket = dayIndex(time);
						if (taxBucket === null) continue;
						const fingerprint = wireToolsFingerprint(tools);
						const known = wireTaxByKey.get(fingerprint);
						if (!known) {
							if (wireTaxByKey.size >= WIRE_TAX_MAX_KEYS) {
								wireTaxTruncated = true;
								continue;
							}
							const summary = wireToolsSummary(tools);
							wireTaxByKey.set(fingerprint, { fingerprint, firstMs: time, lastMs: time, ...summary });
						} else if (time > known.lastMs) known.lastMs = time;
						const dayBest = dayTaxKeys[taxBucket];
						if (!dayBest || time > dayBest.time) dayTaxKeys[taxBucket] = { time, fingerprint };
```

</details>

**依据 3 · 源码核查**：[package.json:14-17](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/package.json#L14-L17)

Node 要求。

```text
  "main": "lib/index.js",
  "engines": {
    "node": ">=22.15"
  },
```

**依据 4 · 源码核查**：[package.json:49-58](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/package.json#L49-L58)

列出宿主 MCP 与 scope 等依赖。

<details>
<summary>查看原文（10行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.2",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.3",
    "@deepseek-ai/dsh-agent": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-agent-loop": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-atomic-write": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-scope": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-tools": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.5-rc.1"
```

</details>

#### 缺口

- 没有可比模型计量与日志完整性数据
  **影响**：不能证明真实 token 和价格改善
  **进一步探讨**：在同项目、同模型、同工具集合下核对 request/header 和真实用量

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安全采用，并验证少工具是否仍完成任务？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可在临时项目用一个受控 MCP 验证导入去重、工具出现和停用后撤下，再决定是否扩大范围。市场安装、令牌和未核实工具应独立审查。可尝试根据某类任务的工具使用轨迹生成建议禁用名单，再用固定任务和可恢复开关验证输入用量、合格率与失败恢复。若低频工具仍是边界任务必需，或输入节省抵不过失败排查，就恢复原配置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/workspace-runtime.js:559-594](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/workspace-runtime.js#L559-L594)

项目级热撤回可作为恢复路径。

<details>
<summary>查看原文（36行）</summary>

```text
async function reconcileWorkspaceConnections(ctx, wsPath) {
	const generation = activeGenerationByRoot.get(appRoot(ctx));
	if (!generation?.active) return { retired: [], remounted: 0 };
	const config = await readWorkspaceConfigCached(ctx, wsPath);
	if (config.error) {
		ctx.logger?.warn?.(`mcp-manager: 项目配置无效，跳过连接对齐 ${wsPath}: ${config.error}`);
		return { retired: [], remounted: 0 };
	}
	const desired = new Map(config.servers.filter((server) => !server.disabled).map((server) => [server.name, server]));
	const retired = [];
	for (const cell of [...sharedConnBucket(ctx).values()]) {
		const entry = cell.entry;
		if (!entry || entry.wsPath !== wsPath) continue;
		const server = desired.get(entry.serverName);
		if (server) {
			// 配置变了：重载。槽位不由这里处理 —— 随后的重跑挂载会 repoint 到新连接上
			//（那时才知道新连接是谁），所以这里只销毁旧连接。
			if (!isConfigStale(server, wsPath, entry)) continue;
			retired.push(entry.serverName);
			await retireSharedConnection(ctx, entry);
			continue;
		}
		// 配置里已经没有这个 server：连接立刻销毁，**并且**把指向它的会话投射一起撤掉。
		// 只销毁连接会留下「指向已销毁连接」的僵尸工具（调用必失败，但模型仍看得见）。
		retired.push(entry.serverName);
		await retireSharedConnection(ctx, entry);
		dropConnectionSlots(ctx, entry);
	}
	let remounted = 0;
	for (const [agent, state] of [...agentWorkspaceStates]) {
		if (state.root !== appRoot(ctx) || state.wsPath !== wsPath) continue;
		// 不在这里等就绪：这些会话已经活着，没有"首轮"要保护；等就绪只会让写盘阻塞，
		// 而工具会在连接就绪后由 tools/change 补投射。
		await mountProjectMcpForAgent(ctx, agent, generation, { awaitReady: false });
		remounted += 1;
	}
```

</details>

**依据 2 · 源码核查**：[lib/tool-ledger.js:519-539](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/tool-ledger.js#L519-L539)

工具清单变化可当对照但不是实际费用。

<details>
<summary>查看原文（21行）</summary>

```text
					} else if (event.type === "request/header") {
						// §6.1 该次请求真实下发给模型的整份工具清单。宿主把 `data.header.tools` 原样
						// 落盘，所以「注册表快照」有了一个可对照的真值：两者不一致就是「改了没生效」。
						const tools = event.data?.header?.tools;
						if (!Array.isArray(tools) || tools.length === 0) continue;
						// 没有 time 的清单快照无法归入日桶，直接丢；这类事件的存在由 undatedCalls
						// 那一路负责显形，两条口径不要混在一起。
						const taxBucket = dayIndex(time);
						if (taxBucket === null) continue;
						const fingerprint = wireToolsFingerprint(tools);
						const known = wireTaxByKey.get(fingerprint);
						if (!known) {
							if (wireTaxByKey.size >= WIRE_TAX_MAX_KEYS) {
								wireTaxTruncated = true;
								continue;
							}
							const summary = wireToolsSummary(tools);
							wireTaxByKey.set(fingerprint, { fingerprint, firstMs: time, lastMs: time, ...summary });
						} else if (time > known.lastMs) known.lastMs = time;
						const dayBest = dayTaxKeys[taxBucket];
						if (!dayBest || time > dayBest.time) dayTaxKeys[taxBucket] = { time, fingerprint };
```

</details>

**依据 3 · 源码核查**：[lib/import-admission.js:56-68](https://github.com/2026heshao/dsh-armory/blob/0fcf744cb4a67913c6af5cd1d32c38094a9c2f28/lib/import-admission.js#L56-L68)

导入预览跳过冲突可先用假配置验证。

<details>
<summary>查看原文（13行）</summary>

```text
export function admitImportedServers(normalized) {
  const servers = (normalized?.servers ?? []).map((server, index) => canonicalizeAt(server, `servers[${index}]`))
  const duplicates = duplicateServerNames(servers)
  const seen = new Set()
  const unique = servers.filter((server) => (seen.has(server.name) ? false : Boolean(seen.add(server.name))))
  // `skipped` 只累加：预览与写盘各自准入一次（幂等），第二次不该丢掉第一次记下的名字——否则
  // 导入结果的"跳过 N 条"会变成空话。提示只在**本次**真的跳过时追加，重复调用不会重复报警。
  const skipped = [...(normalized?.skipped ?? []), ...duplicates]
  const warnings = [...(normalized?.warnings ?? [])]
  if (duplicates.length) {
    warnings.push(`同名条目只保留先出现的那条，已跳过：${duplicates.join('、')}（同一作用域内 serverName 只能有一条）`)
  }
  return { ...normalized, servers: unique, skipped, warnings }
```

</details>

#### 缺口

- 未测停用后任务效果与真实维护时间
  **影响**：不能推荐据低调用率自动删除
  **进一步探讨**：选定常用和罕见任务各一组，记录正确完成与重新启用次数

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
