# dsh-at-skill

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[7502c9b](https://github.com/452926826/dsh-at-skill/tree/7502c9bce1a65597188c12d4ab1e33e9365e3a22)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/452926826/dsh-at-skill)
<!-- END META -->

> **实现功能**：给Web输入框增加@Skill候选，并在host模型步骤前加载匹配且可用户调用的Skill。

> **核心亮点**：将Skill菜单发现与host确定加载接合，省去模型自行决定读Skill。详见[Q01](#research-q01)。

> **风险与缺陷**：普通文本不携带对象身份，示例/同名对象可触发，缓存没有更新事件与transport拒绝删除。详见[Q03](#research-q03)。

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
  - [Q01 · @Skill给谁解决什么问题？](#detail-section-11)
  - [Q02 · 加载怎样尊重当前会话与拒绝？](#detail-section-12)
  - [Q03 · 纯文本调用和目录缓存有哪些风险？](#detail-section-13)
  - [Q04 · 工程与分阶段成本有哪些证据？](#detail-section-14)
  - [Q05 · 什么时候值得试用，继续研究从何处入手？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用@菜单发现并明确调用已有Skill的DSH0.1系用户。详见[Q01](#research-q01)。

已有/skill和手工显式Skill说明，不增加Skill本身能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| @候选 | 发现Skill | 前缀/session缓存 |
| host加载 | 可调用Skill注入 | 纯文本非身份chip |
| 拒绝保留 | next拒绝优先 | 未提供新Skill内容 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=20/DSH0.1 | 发布入口ABI | 0.2不能直接推定 |
| agents/skills | host解析 | scope/消息契约 |
| inputTriggers/connection | Web菜单 | 缓存/候选契约 |
| 本地Harness路径 | 重建 | 修改构建配置 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 装匹配宿主 | 用户 | peers满足 |
| @选Skill | 用户 | 名称无冲突 |
| 发送查轨迹 | 用户 | 来源/内容正确 |
| 目录变化重连 | 用户 | 缓存更新 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配0.1宿主 | 核同名与菜单 | 宿主0.1系匹配与同名核查工时未知 |
| 持续使用 | 会话目录与注入完整Skill的模型上下文 | 维护目录缓存、复核加载意图 | 无独立模型请求；完整Skill注入token/缓存维护费用未知 |
| 失败恢复 | 重连或新回合 | 误注入动作另行纠正 | 重连/误加载后动作纠正工时未知，卸载不回滚动作 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 发现Skill | 前缀菜单 | session缓存可旧 |
| 明确加载 | host get+isUserInvocable | 纯文本意图歧义 |
| 尊重拒绝 | next reject原返 | 其它宿主契约另核 |

> **思考**：普通文本不携带对象身份，示例/同名对象可触发，缓存没有更新事件与transport拒绝删除。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将Skill菜单发现与host确定加载接合，省去模型自行决定读Skill。详见[Q01](#research-q01)。

将Skill菜单发现与host确定加载接合，省去模型自行决定读Skill。详见[Q01](#research-q01)。

短链复用scope/renderer，业务测试与缓存更新/拒绝恢复缺口明确。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通文本不携带对象身份，示例/同名对象可触发，缓存没有更新事件与transport拒绝删除。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

命名清楚且宿主匹配时试用，轨迹核加载来源。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

发布lib与TS关键链可查，文本同名歧义、缓存拒绝和宿主版本范围需关注。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、lib/index.js、lib/client.js、tsdown.config.ts、test/marketplace.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整TS与两份发布lib、package/构建配置、元数据测试、README；不执行目标或扩展读取宿主。
- 下一步：从同名/示例/网络reject/热更新核身份与缓存方向。

**分析版本**

- **仓库**：[452926826/dsh-at-skill](https://github.com/452926826/dsh-at-skill)
- **版本号**：0.1.0（[固定提交 7502c9b](https://github.com/452926826/dsh-at-skill/tree/7502c9bce1a65597188c12d4ab1e33e9365e3a22)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究有身份的输入chip和版本化可重试目录缓存，比较误加载与恢复成本，未验证。详见[Q05](#research-q05)。

从同名/示例/网络reject/热更新核身份与缓存方向。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 103 | — | — | 722 |
| .js | source | 2 | 114 | 106 | 9 | — |
| .ts | source | 3 | 111 | 96 | 2 | — |
| .js | test | 1 | 16 | 14 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/452926826/dsh-at-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/452926826/dsh-at-skill/issues?q=is%3Aissue+created%3A2026-09-22T07%3A08%3A25.798Z..2026-10-22T07%3A08%3A25.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/452926826/dsh-at-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A08%3A25.798Z..2026-10-22T07%3A08%3A25.798Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：@菜单如何确定性加载Skill，纯文本身份、会话scope和目录缓存的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · @Skill给谁解决什么问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想在同一输入框用@菜单选Skill的DSH Web用户，可按名称前缀找候选并插入@name空格。发送后host在agent/pre-step把匹配Skill渲染为带skill-invocation来源的新消息，减轻模型是否自行读Skill的不确定。它提供已有Skill的调用入口，不包含新Skill内容，不改变Skill许可或执行权限。

基线是已有/skill调用和手工指明Skill，贡献是菜单发现与host确定性加载接合。order=2只声明菜单组顺序，不能由本插件单独证明其他组默认Enter永远不变。README也承认同名Skill/subagent/plugin的纯文本身份歧义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/README.md#L5-L16)

入口与排序主张。

<details>
<summary>查看原文（12行）</summary>

```text
A standalone DeepSeek Harness plugin that adds Skill invocation through `@name` without modifying Harness source code.

## Behavior

- Typing `@` in the conversation composer lists every user-invocable Skill available to the current session.
- Typing more characters filters candidates by Skill-name prefix.
- Picking a candidate inserts `@skill-name `.
- Sending a whitespace-bounded `@skill-name` token loads that Skill deterministically before the model step.
- Existing `/skill-name`, `@subagent`, and `@plugin` behavior remains owned by their original plugins.

The Skill group uses menu order `2`, after existing `@` reference groups, so it does not change their default Enter target.

```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:26-42](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L26-L42)

候选与插入。

<details>
<summary>查看原文（17行）</summary>

```text
  const source: InputTriggerSource = {
    trigger: '@',
    name: 'skill',
    order: 2,
    async candidates(session, { query, signal }) {
      const skills = await catalog(session.sessionId)
      if (signal.aborted) return []
      return skills
        .filter(skill => skill.name.startsWith(query))
        .map(skill => ({ name: skill.name, description: skill.description }))
    },
    warm(session) {
      catalog(session.sessionId).catch(() => {})
    },
    onPick({ candidate }) {
      return { text: `@${candidate.name} ` }
    },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:23-55](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/lib/index.js#L23-L55)

加载与消息追加。

<details>
<summary>查看原文（33行）</summary>

```text
	ctx.on("agent/pre-step", async ({ agent, messages, signal }, next) => {
		const decision = await next();
		if (decision.kind === "reject") return decision;
		const names = invokedNames(messages);
		if (names.length === 0) return decision;
		const lookup = {
			cwd: agent.session.header.cwd,
			signal,
			scope: agent
		};
		const injections = [];
		for (const name of names) {
			signal.throwIfAborted();
			const skill = await ctx.skills.get(name, lookup);
			if (skill === void 0 || !isUserInvocable(skill)) continue;
			const source = {
				kind: "skill-invocation",
				name,
				form: "instructions"
			};
			injections.push(createUserMessage({
				content: [{
					type: "text",
					text: renderSkillContent(skill)
				}],
				source
			}));
		}
		return injections.length === 0 ? decision : {
			kind: "enter",
			messages: [...decision.messages, ...injections]
		};
	});
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 加载怎样尊重当前会话与拒绝？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

host先await next，若reject原样返回；对传入messages只处理source.kind=user的text，按空白边界、小写字母数字和连字符正则取名并Set去重。每名用session.header.cwd、signal和scope=agent取skills.get，未知或不可用户调用跳过，渲染后追加decision.messages。每轮检查abort，避免工具/Skill消息来源再次被本段当用户触发；但不是用户内容语义理解。

client从connection.api.skills.list按sessionId拉列表，前缀过滤/描述展示，query取消只在取列表完成后检查；源注册和connection/reset清缓存依宿主事件。Node>=20，peer明确限定DSH0.1系到<0.2.0-0，别把安装了当前宿主就当ABI兼容。package main及client导出指向已提交lib，本次TS与两lib关键链对照一致；重建另依本地绝对Harness路径，不影响阅读当前发布入口但影响可移植开发。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:10-59](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/index.ts#L10-L59)

host拒绝、来源与scope。

<details>
<summary>查看原文（50行）</summary>

```text
const AT_SKILL = /(^|\s)@([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g

function invokedNames(messages: readonly UserMessage[]): string[] {
  const names = new Set<string>()
  for (const message of messages) {
    if (message.source.kind !== 'user') continue
    for (const block of message.content) {
      if (block.type !== 'text') continue
      for (const match of block.text.matchAll(AT_SKILL)) {
        const name = match[2]
        if (name !== undefined) names.add(name)
      }
    }
  }
  return [...names]
}

/** Register deterministic host-side @skill invocation. */
export function apply(ctx: Context): void {
  ctx.on('agent/pre-step', async (
    { agent, messages, signal },
    next,
  ): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject') return decision

    const names = invokedNames(messages)
    if (names.length === 0) return decision

    const lookup = { cwd: agent.session.header.cwd, signal, scope: agent }
    const injections: UserMessage[] = []
    for (const name of names) {
      signal.throwIfAborted()
      const skill = await ctx.skills.get(name, lookup)
      if (skill === undefined || !isUserInvocable(skill)) continue
      const source: SkillInvocationSource = {
        kind: 'skill-invocation',
        name,
        form: 'instructions',
      }
      injections.push(createUserMessage({
        content: [{ type: 'text', text: renderSkillContent(skill) }],
        source,
      }))
    }

    return injections.length === 0
      ? decision
      : { kind: 'enter', messages: [...decision.messages, ...injections] }
  })
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:8-47](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L8-L47)

客户端目录缓存/取消。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const api = (ctx.get('connection') as ConnectionHandle).api.skills
  const cache = new Map<SessionId, Promise<readonly SkillEntry[]>>()

  const catalog = (sessionId: SessionId): Promise<readonly SkillEntry[]> => {
    const existing = cache.get(sessionId)
    if (existing !== undefined) return existing
    const pending = api.list({ sessionId }).then(({ result }) => {
      if (!result.ok) {
        cache.delete(sessionId)
        throw new Error(`skill.list failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value.skills
    })
    cache.set(sessionId, pending)
    return pending
  }

  const source: InputTriggerSource = {
    trigger: '@',
    name: 'skill',
    order: 2,
    async candidates(session, { query, signal }) {
      const skills = await catalog(session.sessionId)
      if (signal.aborted) return []
      return skills
        .filter(skill => skill.name.startsWith(query))
        .map(skill => ({ name: skill.name, description: skill.description }))
    },
    warm(session) {
      catalog(session.sessionId).catch(() => {})
    },
    onPick({ candidate }) {
      return { text: `@${candidate.name} ` }
    },
  }

  const inputTriggers = ctx.get('inputTriggers') as InputTriggerServiceContract
  ctx.on('connection/reset', () => cache.clear())
  ctx.effect(() => inputTriggers.registerSource(source), 'dsh-at-skill: @ source')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1-58](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/lib/index.js#L1-L58)

发布host链。

<details>
<summary>查看原文（58行）</summary>

```text
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { isUserInvocable, renderSkillContent } from "@deepseek-ai/dsh-skill";
//#region src/index.ts
const name = "at-skill";
const inject = ["agents", "skills"];
const AT_SKILL = /(^|\s)@([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g;
function invokedNames(messages) {
	const names = /* @__PURE__ */ new Set();
	for (const message of messages) {
		if (message.source.kind !== "user") continue;
		for (const block of message.content) {
			if (block.type !== "text") continue;
			for (const match of block.text.matchAll(AT_SKILL)) {
				const name = match[2];
				if (name !== void 0) names.add(name);
			}
		}
	}
	return [...names];
}
/** Register deterministic host-side @skill invocation. */
function apply(ctx) {
	ctx.on("agent/pre-step", async ({ agent, messages, signal }, next) => {
		const decision = await next();
		if (decision.kind === "reject") return decision;
		const names = invokedNames(messages);
		if (names.length === 0) return decision;
		const lookup = {
			cwd: agent.session.header.cwd,
			signal,
			scope: agent
		};
		const injections = [];
		for (const name of names) {
			signal.throwIfAborted();
			const skill = await ctx.skills.get(name, lookup);
			if (skill === void 0 || !isUserInvocable(skill)) continue;
			const source = {
				kind: "skill-invocation",
				name,
				form: "instructions"
			};
			injections.push(createUserMessage({
				content: [{
					type: "text",
					text: renderSkillContent(skill)
				}],
				source
			}));
		}
		return injections.length === 0 ? decision : {
			kind: "enter",
			messages: [...decision.messages, ...injections]
		};
	});
}
//#endregion
export { apply, inject, name };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:10-47](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/lib/client.js#L10-L47)

发布client链。

<details>
<summary>查看原文（38行）</summary>

```text
		function apply(ctx) {
			const api = ctx.get("connection").api.skills;
			const cache = /* @__PURE__ */ new Map();
			const catalog = (sessionId) => {
				const existing = cache.get(sessionId);
				if (existing !== void 0) return existing;
				const pending = api.list({ sessionId }).then(({ result }) => {
					if (!result.ok) {
						cache.delete(sessionId);
						throw new Error(`skill.list failed: ${result.error.code}: ${result.error.message}`);
					}
					return result.value.skills;
				});
				cache.set(sessionId, pending);
				return pending;
			};
			const source = {
				trigger: "@",
				name: "skill",
				order: 2,
				async candidates(session, { query, signal }) {
					const skills = await catalog(session.sessionId);
					if (signal.aborted) return [];
					return skills.filter((skill) => skill.name.startsWith(query)).map((skill) => ({
						name: skill.name,
						description: skill.description
					}));
				},
				warm(session) {
					catalog(session.sessionId).catch(() => {});
				},
				onPick({ candidate }) {
					return { text: `@${candidate.name} ` };
				}
			};
			const inputTriggers = ctx.get("inputTriggers");
			ctx.on("connection/reset", () => cache.clear());
			ctx.effect(() => inputTriggers.registerSource(source), "dsh-at-skill: @ source");
```

</details>

**依据 5 · 源码核查**：[package.json:49-65](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/package.json#L49-L65)

Node和peer范围。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-api-remotes": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-client-connection": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-client-runtime": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-client-ui-input-trigger": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-session": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-skill": ">=0.1.0-rc.1 <0.1.0 || >=0.1.1-rc.1 <0.2.0-0"
  },
  "scripts": {
    "build": "tsdown",
    "test": "node --test test/*.test.js",
    "check": "node --check lib/index.js && node --check lib/client.js && npm test",
    "prepack": "npm run check"
  },
```

</details>

**依据 6 · 源码核查**：[tsdown.config.ts:1-3](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/tsdown.config.ts#L1-L3)

绝对构建路径。

```text
import { clientBundle } from '/media/dengzhilong/项目/projects/deepseek-harness/packages/client/tsdown.client.ts'

export default clientBundle('dsh-at-skill', ['src/index.ts'])
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 纯文本调用和目录缓存有哪些风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

菜单只插入普通字符串，没有来源标识。同名@subagent/@plugin也可能被host解析为用户可调用Skill；引号/Markdown代码块里的空白界定@name同样匹配，不区分举例和意图。反过来中文标点紧邻、大小写或下划线名字不匹配，菜单候选是否一定满足该正则由宿主目录命名契约决定。host确实过滤isUserInvocable，但client本层没二次过滤，只信api.list；菜单可见与最终加载需要分别核。

session缓存无TTL和Skill更新事件失效，仅connection/reset清除，因此会话内新增/改名可能一直不反映；业务result非ok会删缓存，api.list自身Promise reject却没有catch删Map，拒绝的Promise可持续被复用直到reset。host每次重新get使已撤Skill不会因旧列表强装，这是积极边界；但失败get/render可直接使pre-step抛错，没有逐Skill失败降级。是否跨轮重复解析旧用户消息取决pre-step的messages范围，本插件没有全局已调用标记，不能声称一次性调用保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:10-23](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/index.ts#L10-L23)

纯文本正则。

<details>
<summary>查看原文（14行）</summary>

```text
const AT_SKILL = /(^|\s)@([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g

function invokedNames(messages: readonly UserMessage[]): string[] {
  const names = new Set<string>()
  for (const message of messages) {
    if (message.source.kind !== 'user') continue
    for (const block of message.content) {
      if (block.type !== 'text') continue
      for (const match of block.text.matchAll(AT_SKILL)) {
        const name = match[2]
        if (name !== undefined) names.add(name)
      }
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:39-52](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/index.ts#L39-L52)

最终用户调用资格和无局部catch。

<details>
<summary>查看原文（14行）</summary>

```text
    const lookup = { cwd: agent.session.header.cwd, signal, scope: agent }
    const injections: UserMessage[] = []
    for (const name of names) {
      signal.throwIfAborted()
      const skill = await ctx.skills.get(name, lookup)
      if (skill === undefined || !isUserInvocable(skill)) continue
      const source: SkillInvocationSource = {
        kind: 'skill-invocation',
        name,
        form: 'instructions',
      }
      injections.push(createUserMessage({
        content: [{ type: 'text', text: renderSkillContent(skill) }],
        source,
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:10-23](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L10-L23)

Promise缓存和业务错误删除。

<details>
<summary>查看原文（14行）</summary>

```text
  const cache = new Map<SessionId, Promise<readonly SkillEntry[]>>()

  const catalog = (sessionId: SessionId): Promise<readonly SkillEntry[]> => {
    const existing = cache.get(sessionId)
    if (existing !== undefined) return existing
    const pending = api.list({ sessionId }).then(({ result }) => {
      if (!result.ok) {
        cache.delete(sessionId)
        throw new Error(`skill.list failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value.skills
    })
    cache.set(sessionId, pending)
    return pending
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:28-47](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L28-L47)

列表信任/唯一reset。

<details>
<summary>查看原文（20行）</summary>

```text
    name: 'skill',
    order: 2,
    async candidates(session, { query, signal }) {
      const skills = await catalog(session.sessionId)
      if (signal.aborted) return []
      return skills
        .filter(skill => skill.name.startsWith(query))
        .map(skill => ({ name: skill.name, description: skill.description }))
    },
    warm(session) {
      catalog(session.sessionId).catch(() => {})
    },
    onPick({ candidate }) {
      return { text: `@${candidate.name} ` }
    },
  }

  const inputTriggers = ctx.get('inputTriggers') as InputTriggerServiceContract
  ctx.on('connection/reset', () => cache.clear())
  ctx.effect(() => inputTriggers.registerSource(source), 'dsh-at-skill: @ source')
```

</details>

#### 缺口

- 宿主pre-step messages范围、目录可调用过滤和命名约束
  **影响**：决定是否重复注入、菜单与host匹配是否一致
  **进一步探讨**：只读同版本宿主事件/skills API契约，以引用文字、同名对象和旧消息反例核一次性意图

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程与分阶段成本有哪些证据？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

host/client职责短而清楚，使用宿主renderSkillContent与scope查询复用现有语义，拒绝决策优先是可借鉴细节。提交的测试只核marketplace包入口/仓库元数据，不测试实际正则、拒绝、可调用过滤、缓存失效和消息注入；npm check语法检查也不证明业务契约。本次只读测试，不执行。开发构建脚本绝对路径与peer范围使维护者需显式匹配本地Harness。

首次装匹配0.1系宿主并查菜单/技能来源；持续每session保一份目录Promise，host每次按命中名查询/渲染，插件无独立模型请求或远端服务，但注入完整Skill会增加后续模型token。多Skill去重仅当次，输入提到大量名字可增加上下文，未提供额度/截断。恢复可重连清缓存、删误触发文字或停用插件；已注入消息和已发生的模型动作不能靠卸载回滚，需用新回合/会话确认。

#### 证据与依据

**依据 1 · 源码核查**：[test/marketplace.test.js:1-15](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/test/marketplace.test.js#L1-L15)

测试仅元数据。

<details>
<summary>查看原文（15行）</summary>

```text
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('declares an installable marketplace bundle', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const entryText = await readFile(new URL('marketplace-entry.yml', root), 'utf8');
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml');
  assert.match(entryText, /^url: https:\/\/github\.com\/452926826\/dsh-at-skill$/m);
  assert.match(entryText, /^name: 452926826\/dsh-at-skill$/m);
  assert.match(entryText, /^category: skill$/m);
  assert.equal(pkg.repository.url, 'git+https://github.com/452926826/dsh-at-skill.git');
  assert.ok(pkg.keywords.includes('dsh-plugin'));
```

</details>

**依据 2 · 源码核查**：[package.json:67-73](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/package.json#L67-L73)

构建/语法/元数据脚本。

```text
    "lib",
    "src",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
```

**依据 3 · 源码核查**：[src/index.ts:39-57](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/index.ts#L39-L57)

逐名完整渲染。

<details>
<summary>查看原文（19行）</summary>

```text
    const lookup = { cwd: agent.session.header.cwd, signal, scope: agent }
    const injections: UserMessage[] = []
    for (const name of names) {
      signal.throwIfAborted()
      const skill = await ctx.skills.get(name, lookup)
      if (skill === undefined || !isUserInvocable(skill)) continue
      const source: SkillInvocationSource = {
        kind: 'skill-invocation',
        name,
        form: 'instructions',
      }
      injections.push(createUserMessage({
        content: [{ type: 'text', text: renderSkillContent(skill) }],
        source,
      }))
    }

    return injections.length === 0
      ? decision
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:10-23](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L10-L23)

会话缓存。

<details>
<summary>查看原文（14行）</summary>

```text
  const cache = new Map<SessionId, Promise<readonly SkillEntry[]>>()

  const catalog = (sessionId: SessionId): Promise<readonly SkillEntry[]> => {
    const existing = cache.get(sessionId)
    if (existing !== undefined) return existing
    const pending = api.list({ sessionId }).then(({ result }) => {
      if (!result.ok) {
        cache.delete(sessionId)
        throw new Error(`skill.list failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value.skills
    })
    cache.set(sessionId, pending)
    return pending
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么时候值得试用，继续研究从何处入手？

**研究主题**：新假设与验证、采用判断

#### 完整回答

匹配宿主、Skill命名不冲突且希望@菜单入口者可试用；发送前注意示例文字里的@也可能触发，重要自动化用明确/Skill入口或确认轨迹里加载来源。不要把autocomplete候选当安全授权，多Skill上下文成本和真实执行仍由原Skill/工具边界承担。要求严格对象身份或完全支持0.2宿主时先核契约再采用。

可研究由输入chip携带Skill身份/意图而非纯文本推断，并将目录版本或更新事件纳入缓存，所有reject都可重试。基线是普通@字符串与session永久Promise；最小反例为同名subagent、代码块示例、标点边界、热新增Skill、网络reject后恢复、scope撤销和next拒绝。比较误加载/漏加载率、缓存恢复时间、注入token和手工/菜单步骤，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:40-42](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L40-L42)

仅文本身份基线。

```text
    onPick({ candidate }) {
      return { text: `@${candidate.name} ` }
    },
```

**依据 2 · 源码核查**：[src/index.ts:10-23](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/index.ts#L10-L23)

解析基线。

<details>
<summary>查看原文（14行）</summary>

```text
const AT_SKILL = /(^|\s)@([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g

function invokedNames(messages: readonly UserMessage[]): string[] {
  const names = new Set<string>()
  for (const message of messages) {
    if (message.source.kind !== 'user') continue
    for (const block of message.content) {
      if (block.type !== 'text') continue
      for (const match of block.text.matchAll(AT_SKILL)) {
        const name = match[2]
        if (name !== undefined) names.add(name)
      }
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:10-23](https://github.com/452926826/dsh-at-skill/blob/7502c9bce1a65597188c12d4ab1e33e9365e3a22/src/client/index.ts#L10-L23)

缓存基线。

<details>
<summary>查看原文（14行）</summary>

```text
  const cache = new Map<SessionId, Promise<readonly SkillEntry[]>>()

  const catalog = (sessionId: SessionId): Promise<readonly SkillEntry[]> => {
    const existing = cache.get(sessionId)
    if (existing !== undefined) return existing
    const pending = api.list({ sessionId }).then(({ result }) => {
      if (!result.ok) {
        cache.delete(sessionId)
        throw new Error(`skill.list failed: ${result.error.code}: ${result.error.message}`)
      }
      return result.value.skills
    })
    cache.set(sessionId, pending)
    return pending
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
