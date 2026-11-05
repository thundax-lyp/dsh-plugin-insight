# billion-context-dsh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3b89313](https://github.com/Tyan66666/billion-context-dsh/tree/3b893134452810909f2b31fe1643b7c70cf77ea4)

<!-- BEGIN META -->
[![GitHub ★ 168](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=168&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tyan66666/billion-context-dsh) [![npm 30d 7,845](https://img.shields.io/static/v1?label=npm+30d&message=7%2C845&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context-dsh) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context-dsh)
<!-- END META -->

> **功能**：为 DSH 提供模型驱动的上下文压缩、恢复与压缩提示。

> **亮点**：[Q01](#research-q01) 将上游主动压缩移植到 DSH，并保留预设区别。

> **主要限制**：[Q02](#research-q02) 持久进展才重试，但结果质量仍未知。[Q03](#research-q03) 固定项目已停止维护。

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
  - [Q01 · 什么时候建议压缩？](#detail-section-11)
  - [Q02 · 超窗恢复需要什么条件？](#detail-section-12)
  - [Q03 · 是否适合新增部署？](#detail-section-13)
  - [Q04 · 如何核对压缩收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要理解历史 DSH 长会话压缩行为的维护者。

宿主原生自动摘要，或手工拆分会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 压缩提醒 | 提示模型主动压缩 | 按上下文压力与设置 |
| 超窗恢复 | 在持久替换后重试 | 仅指定错误且预算可用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 旧兼容 DSH | 必需 | 提供 compaction 和日志协议 | 使用原生压缩 |
| 历史备份 | 恢复核对必需 | 保留可比较资料 | 停止改动 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核对 | 用户确认固定旧版 | 保持历史数据备份 |
| 复核 | 操作者检查预设与历史 | 不能判断时停用 |
| 退出 | 用户恢复宿主压缩 | 核对旧会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 旧环境资源未知 | 核对协议和宿主 | 未测试 |
| 持续 | 摘要与恢复 token | 维护不再更新的组合 | 真实净收益未知 |
| 恢复 | 重试资源未知 | 核对历史与摘要 | 保真未验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主动压缩 | 前置提示与引擎 | 任务保真 |
| 超窗恢复 | 进展门和重试预算 | 真实兼容 |

> **思考**：[Q02](#research-q02) 持久进展才重试，但结果质量仍未知。[Q03](#research-q03) 固定项目已停止维护。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将上游主动压缩移植到 DSH，并保留预设区别。

[Q02](#research-q02) 用持久替换代次避免无进展盲重试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 持久进展才重试，但结果质量仍未知。[Q03](#research-q03) 固定项目已停止维护。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 新部署保留宿主原生路径，既有安装先检查历史。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定历史版本，未验证宿主、实际模型或后续项目。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定历史源码，未执行目标。
- 下一步：在已知兼容的隔离 profile 对照超窗和历史回读。

**分析版本**

- **仓库**：[Tyan66666/billion-context-dsh](https://github.com/Tyan66666/billion-context-dsh)
- **版本号**：0.2.27（[固定提交 3b89313](https://github.com/Tyan66666/billion-context-dsh/tree/3b893134452810909f2b31fe1643b7c70cf77ea4)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在同一任务衡量保真与净 token。

在已知兼容的隔离 profile 对照超窗和历史回读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 3765 | — | — | 94672 |
| .mjs | source | 5 | 907 | 718 | 164 | — |
| .ts | source | 18 | 7487 | 4211 | 2955 | — |
| .ts | test | 39 | 11908 | 8864 | 2354 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Tyan66666/billion-context-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已停止维护的 ACP 移植怎样处理长上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么时候建议压缩？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

长开发会话可能因历史变大而无法继续。作者从上游复用压缩内核，贡献在 DSH 适配。补丁禁用根 compaction-basic 并插入 ACP，文档区分预设内部的自动兜底。前置钩子清理孤立工具消息，重读设置，在打开自动提醒且后续调度未拒绝时计算窗口并追加提示。相比固定自动摘要，常规流程可由模型决定是否调用压缩；关闭自动提醒不会跳过此前的孤立工具清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-54](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/README.md#L42-L54)

作者对比自动摘要与继承内核

<details>
<summary>查看原文（13行）</summary>

```text
## 为什么？

当对话变长，模型会耗尽上下文。多数工具直接硬截断——悄悄丢弃早期消息。**billion-context-dsh** 给模型一个 `compress` 工具：由 LLM 决定**何时**、**压缩什么**，写成高保真摘要，保留关键细节（文件路径、决策、错误信息）的同时回收上下文空间。

与 DSH 内置的自动压缩（用自动生成的摘要替换一段范围）不同，billion-context-dsh：

- **模型驱动** —— 摘要由模型自己书写，没有第二次 LLM 摘要调用
- **只建议、不强令** —— 自动策略只 *nudge*（提醒），是否压缩、何时压缩由模型决定（唯一的例外：provider 确认的上下文超窗会让引擎自己抢救一次——见配置表的 `maxOverflowRetries`）
- **持久且可恢复** —— 压缩范围成为 checkpoint 节点，原文保留在 append-only 会话日志中；`decompress` 可恢复，`search_context` 可在块内查找
- **长任务稳得住** —— 每一步都接着前面的成果走，关键结论持续可用、不断叠加，超长任务更容易跑完
- **上下文始终精简** —— 每次请求都只用少量、精炼的上下文，只保留关键信息；不做大段统一压缩，细节不随之衰失，token 消耗自然更低

这是 [billion-context-pi](https://github.com/ranxianglei/billion-context-pi)（Pi 编码代理适配器）在 DeepSeek Harness 上的移植：压缩内核（[acp-kernel](https://github.com/ranxianglei/acp-kernel)）原样复用，适配层针对 DSH 的 durable-surface 模型重写——经过验证的映射关系见 [docs](https://github.com/Tyan66666/billion-context-dsh/tree/main/docs)。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:24-32](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/cordis.patch.yml#L24-L32)

根挂载及作用域说明

```text
# Shipped presets (standard / code / cordis) keep their realm-local
# compaction-basic fallback (automatic pressure compression); minimal and
# presets without a compaction realm use the host ACP engine directly.
- id: compaction-basic
  disabled: true

- insert:
    - id: compaction-acp
      name: 'billion-context-dsh'
```

**依据 3 · 源码核查**：[src/index.ts:710-743](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/src/index.ts#L710-L743)

pre-step 清理与提示

<details>
<summary>查看原文（34行）</summary>

```text
    ctx.on('agent/pre-step', async (payload, next) => {
      // A crash-interrupted tool leaves an orphan call/result on the surface:
      // it corrupts the pairing balance cache AND can 400 the next request
      // (strict providers reject tool messages without their call/response).
      // Clean them before EVERY step — not only when a nudge fires — so a
      // low-pressure session never hits the orphan 400 (issue #18). No call is
      // in flight at pre-step (the previous step's tools all landed), so the
      // default empty in-flight set is safe.
      stripOrphanedSurfaceToolMessages(payload.agent.session)
      // Hot-apply settings BEFORE any knob is read this step (issue #193): on
      // the forms line, writes committed between steps land in our volatile
      // refs with no event we receive — this re-read is what applies them.
      engine.resyncSettings()
      if (!engine.readSettingsSource().autoNudge) return next()
      const decision = await next()
      if (decision.kind === 'reject') return decision
      const window = await this.windowFor(payload.agent)
      const outcome = buildNudge(
        payload.agent,
        { ...env, modelContextLimit: window.limit },
        this.lastNudgeTurn,
        this.emergencyNudges,
        () => {
          // The kernel still wants an emergency nudge but the per-turn budget
          // is spent: log WHY the model stops receiving nudges instead of
          // letting the silence look like a bug (issue #108 review).
          ctx.logger.warn(
            `billion-context-dsh: emergency nudge suppressed — per-turn budget of ${EMERGENCY_NUDGE_MAX_PER_TURN} spent (session ${payload.agent.session.id}); pressure is still above the emergency threshold`,
          )
        },
      )
      if (outcome === null) return decision
      return { kind: 'enter', messages: [...decision.messages, outcome.message] }
    })
```

</details>

#### 缺口

- 未检查实际预设组合或模型响应
  **影响**：不能确定可读历史或节省幅度
  **进一步探讨**：在历史环境比较启用前后的真实请求输入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 超窗恢复需要什么条件？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

错误钩子只处理指定的上下文超窗代码，取消后透传。检查已有重试预算，调用紧急压缩后只有 surface replaceGeneration 前进时才发出重试，即使后续记账抛出也可基于已持久化变化重试。该条件能避开未改变上下文的盲重试，不能保证剩余上下文足够或摘要准确。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:761-789](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/src/index.ts#L761-L789)

错误、预算和持久进展

<details>
<summary>查看原文（29行）</summary>

```text
    ctx.on('agent/request-error', async ({ agent, failure, signal }, next) => {
      if (failure.code !== CONTEXT_WINDOW_EXCEEDED_CODE || signal.aborted) return next()
      this.overflowSessions.set(agent.session, agent)
      const retries = this.overflowRetries.get(agent) ?? 0
      // `resolveAcpConfig` normalizes the value, so this fallback only guards a
      // future config shape; it MUST stay 1 (the host's own default) — reading 0
      // here would disable overflow recovery for a key that was never set to 0.
      const max = this.config.maxOverflowRetries ?? 1
      if (retries >= max) {
        this.ctx.logger.warn(
          `billion-context-dsh: context-overflow recovery budget spent (${max} retries) for session ${agent.session.id}; preserving the original request error`,
        )
        return next()
      }
      const generation = agent.session.surface.replaceGeneration
      let result: OverflowRecoveryResult | null
      try {
        result = await this.compactForOverflow(agent, signal)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        if (!signal.aborted && agent.session.surface.replaceGeneration > generation) {
          // The durable transaction landed but the follow-through threw: the
          // surface shrank, so retrying from the replacement surface is the
          // best move even though the bookkeeping failed.
          this.ctx.logger.warn(
            `billion-context-dsh: context-overflow compaction failed after durable surface progress: ${message}; retrying from the replacement surface`,
          )
          this.overflowRetries.set(agent, retries + 1)
          return { kind: 'retry' }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:791-804](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/src/index.ts#L791-L804)

取消、无进展和恢复判据

<details>
<summary>查看原文（14行）</summary>

```text
        this.ctx.logger.warn(
          `billion-context-dsh: context-overflow compaction failed: ${message}; ${signal.aborted ? 'cancellation prevents retry' : 'preserving the original request error'}`,
        )
        return next()
      }
      if (signal.aborted || agent.session.surface.replaceGeneration <= generation) return next()
      if (result !== null) {
        this.ctx.logger.info(
          `compaction (context overflow recovery): shadowed ${result.shadowedSeqs.length} surface nodes (seqs ${result.start}-${result.end}, ~${result.shadowedTokenCount} tokens)`,
        )
      }
      this.overflowRetries.set(agent, retries + 1)
      return { kind: 'retry' }
    })
```

</details>

#### 缺口

- 未执行供应商超窗、崩溃和解压
  **影响**：无法确认兼容的宿主及错误码、恢复质量
  **进一步探讨**：固定旧版环境模拟超窗、取消、部分替换和回读

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 是否适合新增部署？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者已明确停止维护，根包也是未维护声明，历史插件版本仍有固定参考价值。其宿主 seam 范围不含 0.2.1 及以后版本线，不能假定当下宿主继续满足。新项目不宜在核心会话上承担失去维护和修改压缩引擎的成本。已部署者可先备份历史、核对预设内兜底及移除后的状态，用原生压缩作为已知基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-10](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/README.md#L5-L10)

停止维护与测试范围

```text
> **🛑 本项目已停止维护**
> 不再更新、不再修复问题，也不再受理新功能请求。同类需求请改用 **[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)**——它已经是官方统一版，原生支持 DeepSeek Harness（同一套实现同时覆盖 pi / OpenCode / Claude Code 等二十多个宿主）。
> 已发布的历史版本仍可安装使用，但不再提供支持。

> **⚠️ 测试版声明——请勿用于生产环境**
> 本项目（**v0.2.27**）仍处于开发中的测试版。[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 本身也处于**公开测试版**阶段。**请勿将两者用于工程化 / 生产环境**——预期会有破坏性变更与粗糙之处。
```

**依据 2 · 作者声明**：[README.md:63-88](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/README.md#L63-L88)

挂载方式、预设与兼容范围

<details>
<summary>查看原文（26行）</summary>

````text
**方式一（推荐）：DSH 商店 / `dsh plugin` 一键装（bundle）——装完即全局生效，零配置。**

在 DSH 的插件商店里点安装，或命令行执行：

```bash
dsh plugin --profile web add billion-context-dsh
```

命令内部会装包并把本包的 bundle 补丁（[cordis.patch.yml](cordis.patch.yml)）自动挂进该 profile 的层栈。补丁做了两件事：

- **禁用 host 的 `compaction-basic`**——避免同一 realm 内两个后端同时注册 `ctx.compaction` 冲突（现代 DSH 的 web bundle 已自带该禁用，此行为幂等兜底，任何受支持版本下都成立）；
- **把 ACP 引擎挂到 host 平面**——四种模型工具（`compress` / `decompress` / `search_context` / `acp_status`）、`/acp-prune` 命令、nudge、ACP 提示词段对该 profile 的**所有模式**（standard / code / minimal / cordis / 自定义预设）生效。窗口自动探测、工具/命令/nudge 默认全开，**无需任何手工配置**。

装完**重启 `dsh`**（bundle 层在启动时组合），新开会话即可用——让模型调用 `acp_status` 或执行 `/acp-prune status` 自证。shipped 预设（standard / code / cordis）内部的 realm 级 `compaction-basic` 自动压缩兜底仍然保留（这些模式里"自动摘要"照旧，ACP 工具与 nudge 并存）；minimal 等不带 compaction realm 的预设直接使用本引擎。

> **与 DSH 版本的兼容性。** 包把五个运行期 seam 包（`dsh-compaction` /
> `dsh-session` / `dsh-llm` / `dsh-tools` / `dsh-settings`）都声明为 peer
> 依赖，共享同一个
> 范围 `>=0.1.5-alpha.1 <0.2.1-0`——覆盖所有已验证的版本线：`0.1.5` 下限加已验证的 `0.1.6` / `0.1.7` / `0.2.0` 线（各线全部预发布加最终版）。从 `0.1.5` 线起，会话 replace 操作的协议字段由 `{ op, start, end }`
> 改名为 `{ op, startSeq, endSeq }`，且校验严格（只接受这三个字段）；本引擎只
> 输出新形态，因此在更旧的 DSH（< 0.1.5）上每次 `compress` 都会被宿主在运行时
> 拒绝（issue #136）——旧版本不再受支持，请先升级 DSH 再安装本发行版。范围
> 写成显式区间而非 caret 是**有意为之**：上界 `0.2.1-0` 挡住未经验证的下一版本线
> （house rule；原上界 `0.1.6-0` 在 #190 逐线验证后放宽）。`0.2.0` 线还改了两处读取形状——工具结果事件的调用 id 提升到消息级、宿主新增 `developer/message` 工具注册表行——引擎对整条范围按线读取，单一构建即可服务全区间（issue #192）。把这五个 seam 包一并声明为 peer（而不只是 `dsh-compaction`），是为了让
> 安装在 pnpm 的集成/封存布局下仍能把它们解析到**宿主自己的副本**，而不是
> 某个与宿主不一致的陈旧嵌套副本。
````

</details>

**依据 3 · 源码核查**：[package.json:17-38](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/package.json#L17-L38)

发布入口和 bundle 声明

<details>
<summary>查看原文（22行）</summary>

```text
	"type": "module",
	"main": "dist/index.js",
	"types": "dist/index.d.ts",
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js"
		}
	},
	"files": [
		"dist",
		"cordis.patch.yml",
		"README.md",
		"README.en.md",
		"LICENSE"
	],
	"sideEffects": false,
	"dsh": {
		"bundle": {
			"patch": "./cordis.patch.yml"
		}
	},
```

</details>

#### 缺口

- 未复跑历史版本或检查后续项目
  **影响**：不能给出现有部署兼容结论或替代品验收
  **进一步探讨**：在一次性 profile 验证固定旧版的读取、恢复和卸载

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何核对压缩收益？

**研究主题**：新假设与验证

#### 完整回答

针对同一长任务，在旧兼容环境对照原生摘要和模型主动压缩，记录后续关键约束复述、历史引用恢复、token 和超窗重试。单次少 token 不能抵消缺失任务约束。若达到同一正确性需要更多补查或重试，放弃该配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:44-54](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/README.md#L44-L54)

保留细节与节省的作者目标

<details>
<summary>查看原文（11行）</summary>

```text
当对话变长，模型会耗尽上下文。多数工具直接硬截断——悄悄丢弃早期消息。**billion-context-dsh** 给模型一个 `compress` 工具：由 LLM 决定**何时**、**压缩什么**，写成高保真摘要，保留关键细节（文件路径、决策、错误信息）的同时回收上下文空间。

与 DSH 内置的自动压缩（用自动生成的摘要替换一段范围）不同，billion-context-dsh：

- **模型驱动** —— 摘要由模型自己书写，没有第二次 LLM 摘要调用
- **只建议、不强令** —— 自动策略只 *nudge*（提醒），是否压缩、何时压缩由模型决定（唯一的例外：provider 确认的上下文超窗会让引擎自己抢救一次——见配置表的 `maxOverflowRetries`）
- **持久且可恢复** —— 压缩范围成为 checkpoint 节点，原文保留在 append-only 会话日志中；`decompress` 可恢复，`search_context` 可在块内查找
- **长任务稳得住** —— 每一步都接着前面的成果走，关键结论持续可用、不断叠加，超长任务更容易跑完
- **上下文始终精简** —— 每次请求都只用少量、精炼的上下文，只保留关键信息；不做大段统一压缩，细节不随之衰失，token 消耗自然更低

这是 [billion-context-pi](https://github.com/ranxianglei/billion-context-pi)（Pi 编码代理适配器）在 DeepSeek Harness 上的移植：压缩内核（[acp-kernel](https://github.com/ranxianglei/acp-kernel)）原样复用，适配层针对 DSH 的 durable-surface 模型重写——经过验证的映射关系见 [docs](https://github.com/Tyan66666/billion-context-dsh/tree/main/docs)。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:775-804](https://github.com/Tyan66666/billion-context-dsh/blob/3b893134452810909f2b31fe1643b7c70cf77ea4/src/index.ts#L775-L804)

重试依赖持久进展

<details>
<summary>查看原文（30行）</summary>

```text
      const generation = agent.session.surface.replaceGeneration
      let result: OverflowRecoveryResult | null
      try {
        result = await this.compactForOverflow(agent, signal)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        if (!signal.aborted && agent.session.surface.replaceGeneration > generation) {
          // The durable transaction landed but the follow-through threw: the
          // surface shrank, so retrying from the replacement surface is the
          // best move even though the bookkeeping failed.
          this.ctx.logger.warn(
            `billion-context-dsh: context-overflow compaction failed after durable surface progress: ${message}; retrying from the replacement surface`,
          )
          this.overflowRetries.set(agent, retries + 1)
          return { kind: 'retry' }
        }
        this.ctx.logger.warn(
          `billion-context-dsh: context-overflow compaction failed: ${message}; ${signal.aborted ? 'cancellation prevents retry' : 'preserving the original request error'}`,
        )
        return next()
      }
      if (signal.aborted || agent.session.surface.replaceGeneration <= generation) return next()
      if (result !== null) {
        this.ctx.logger.info(
          `compaction (context overflow recovery): shadowed ${result.shadowedSeqs.length} surface nodes (seqs ${result.start}-${result.end}, ~${result.shadowedTokenCount} tokens)`,
        )
      }
      this.overflowRetries.set(agent, retries + 1)
      return { kind: 'retry' }
    })
```

</details>

#### 缺口

- 没有任务对照或运行结果
  **影响**：不能确认保真或净消耗
  **进一步探讨**：用固定带验收条件的任务做盲评

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
