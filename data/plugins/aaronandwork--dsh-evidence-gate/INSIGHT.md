# dsh-evidence-gate

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[845ddf4](https://github.com/AaronandWork/dsh-evidence-gate/tree/845ddf415e045eb6b2a014bca97a9c63aee1befa)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate) [![npm 30d 888](https://img.shields.io/static/v1?label=npm+30d&message=888&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aaronandwork/dsh-evidence-gate)
<!-- END META -->

> **实现功能**：为 DSH 会话提供可切换的证据提示、主张裁定工具及持久活动索引。

> **核心亮点**：相较单纯提醒或静态提示，插件把工具活动做成持久、按会话可查的核验线索，并记录亲测/引用/猜测的处理结果；其辅助复核价值取决于模型调用和人工回查，不能称为强制事实门。详见[Q01](#research-q01)。

> **风险与缺陷**：“已实证”可由同名、子串、单词、跨会话活动或仅存在路径触发，且未核对工具成功、内容、时间和主张语义；弱命中仍返回 verified。这使裁定标签可能超过证据强度。详见[Q03](#research-q03)。

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
  - [Q01 · 目标场景和合格结果是什么，插件比纯提示词多做了什么？](#detail-section-11)
  - [Q02 · 活动证据如何采集、保存和在会话间复用？](#detail-section-12)
  - [Q03 · “已实证”的交叉核验实际验证了什么，最关键的误判路径是什么？](#detail-section-13)
  - [Q04 · 开关、Web 路由与持久化给部署带来什么成本和安全边界？](#detail-section-14)
  - [Q05 · 如何将现有索引机制提升为可证伪的可信结论核验？](#detail-section-15)
  - [Q06 · 现阶段适合如何试用，哪些结论必须保留人工核对？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要把亲测、引用和猜测分开的 DSH 会话；合格答复仍需逐项复查事实与原始证据。详见[Q01](#research-q01)。

人工核查或静态提示能要求报告证据，插件新增持久活动索引和裁定；但匹配不是内容真实性验证，人工审核成本未消失。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话提示与开关 | 引导模型声明依据 | 默认关闭，需用户开启且模型遵守 |
| evidence_gate 裁定 | 逐簇记录亲测/引用/猜测 | 必须主动调用；字符串命中不证明真实性 |
| 持久索引与报告 | 跨上下文查活动线索 | 容量受限，跨会话可能误归因，含敏感信息 |
| Web 状态路由 | UI 查询与切换 | 无认证 loopback 设想，需宿主控制网络边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools 服务 | 必需 | 注册裁定/开关工具并监听结果 | 无工具裁定链 |
| systemPrompt、commands、webServer | 对应入口需要 | 提示、Slash 与 UI 路由 | 对应入口缺失或不可用 |
| 可写本地存储 | 跨重启保留需要 | 保存会话索引和裁定 | 仅进程内/可能丢状态 |
| 原始工具输出人工复核 | 可信结论需要 | 检查成败、内容与版本 | verified 不足以证明主张 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 管理者确认宿主接口、存储权限与 Web 绑定 | 会话身份不落共享桶，目录可控 |
| 开启 | 用户对目标会话开启开关 | 下一模型步提示生效，状态可查 |
| 核验 | 模型逐簇调用，用户回查关键原始证据 | 失败/旧数据不被作实证 |
| 复盘 | 查报告并纠正误判 | 对外结论只保留真实可追溯证据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 宿主、Node、持久目录；金额未知 | 核会话键、存储权限及 Web 暴露；耗时未知 | 默认关闭，需主动开启 |
| 持续使用 | 活动索引写盘、字符串扫描；资源值未知 | 回查每个 verified 的原始结果/版本；频率未知 | 最多 400 条/会话、持久 50 会话 |
| 失败恢复 | 重新采集/撤回误判；金额未知 | 处理存储丢失、错判与末写覆盖；耗时未知 | 多进程共享存储风险 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 证据提醒 | 可切换提示与模型工具 | 模型调用覆盖率和答复遵守率 |
| 活动追溯 | 有限的参数/输出锚点与持久报告 | 多会话恢复完整率及误归因 |
| 真伪核验 | 文本关联与路径存在检查 | 主张真实性、失败工具和旧版本识别 |

> **思考**：“已实证”可由同名、子串、单词、跨会话活动或仅存在路径触发，且未核对工具成功、内容、时间和主张语义；弱命中仍返回 verified。这使裁定标签可能超过证据强度。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相较单纯提醒或静态提示，插件把工具活动做成持久、按会话可查的核验线索，并记录亲测/引用/猜测的处理结果；其辅助复核价值取决于模型调用和人工回查，不能称为强制事实门。详见[Q01](#research-q01)。

相较单纯提醒或静态提示，插件把工具活动做成持久、按会话可查的核验线索，并记录亲测/引用/猜测的处理结果；其辅助复核价值取决于模型调用和人工回查，不能称为强制事实门。详见[Q01](#research-q01)。

有容量限制的索引与明示依据类型值得借鉴；把字符串关联或路径存在提升为已实证需收紧，并保留人工复核通道。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“已实证”可由同名、子串、单词、跨会话活动或仅存在路径触发，且未核对工具成功、内容、时间和主张语义；弱命中仍返回 verified。这使裁定标签可能超过证据强度。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，单人本地可作为提醒和线索索引；关键事实须回查原始输出，不能依赖 verified 机器标签自动放行。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认了提示、索引、开关及工具调用时的裁定链；索引命中不证明主张真实，误判风险是源码推导，未在宿主复现；强化核验假设尚未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、包声明和 lib/index.js，未运行插件/测试或真实会话；复用前次 META，不当作本轮新采集。
- 下一步：以同名路径、失败读取、旧版本测试、无关会话、正确委派和仅存在路径构造有真值夹具；测假阳性/假阴性、漏调用、延迟、持久恢复及人工核对时长。

**分析版本**

- **仓库**：[AaronandWork/dsh-evidence-gate](https://github.com/AaronandWork/dsh-evidence-gate)
- **版本号**：0.2.1（[固定提交 845ddf4](https://github.com/AaronandWork/dsh-evidence-gate/tree/845ddf415e045eb6b2a014bca97a9c63aee1befa)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把证据绑定委派关系、成功状态、内容/版本与时间，弱关联降为待复核，并在提交最终答复前检查承载结论的裁定；用固定误判夹具评估假阳性、假阴性和成本。详见[Q05](#research-q05)。

以同名路径、失败读取、旧版本测试、无关会话、正确委派和仅存在路径构造有真值夹具；测假阳性/假阴性、漏调用、延迟、持久恢复及人工核对时长。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 761 | 658 | 53 | — |
| .js | source | 3 | 2236 | 1923 | 175 | — |
| .md | source | 1 | 249 | — | — | 3591 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A16.566Z..2026-10-21T05%3A34%3A16.566Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AaronandWork/dsh-evidence-gate/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A34%3A16.566Z..2026-10-21T05%3A34%3A16.566Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**实证门如何约束 DSH 会话中的事实主张，证据索引的命中能否支撑“已实证”，以及它对使用者的真实成本是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标场景和合格结果是什么，插件比纯提示词多做了什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

它面向需要在 DSH 答复前区分亲测、引用与推测的会话。合格结果应是关键事实主张逐项有可复查证据，未核实主张被降级，最终答复不把弱关联说成实测。作者提供可切换的系统提示段、模型工具、工具结果活动索引、会话计数和报告；相比人工提醒或一段静态提示，多了按会话保存与交叉查找的机制。但源码只在模型主动调用 evidence_gate 时形成裁定，提示文本也只要求模型调用，未见最终答复发送前的强制拦截。因此“门”是自愿调用的辅助复核，不是可证明每个结论均被审查的强制审计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-61](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/README.md#L35-L61)

作者描述启停、结果级别与持久索引。

<details>
<summary>查看原文（27行）</summary>

```text
Prompt-only "don't guess" instructions are unenforceable and unauditable. This plugin makes conclusion discipline **structural**:

1. **Policy** — a system-prompt section establishing the evidence hierarchy injected before every model step.
2. **Gate** — a model tool the agent calls before stating load-bearing conclusions; each claim gets a verdict.
3. **Cross-check** — claimed direct observations are verified against the session's recorded tool activity (`tools/result` stream).
4. **Ledger** — per-session counts: how many guesses were blocked, how many were converted into real verification.

## How it works

| Component | Mechanism |
|---|---|
| Policy section | `systemPrompt.section` (order 550), text provider |
| `evidence_gate` tool | registered via the `tools` registry; verdicts `VERIFIED / REFERENCED / UNVERIFIED / INVALID / OFF` |
| Evidence hierarchy | `tested / measured / read_directly / prior_verified` (direct) · `documented / community_practice` (must cite source) · `assumption` (only as a labeled hypothesis + next verification step) |
| Cross-check | `tools/result` listener records a durable per-session evidence index (400 entries) — tool arguments AND output anchors (paths / URLs / distinctive output words); gate claims of direct observation must match it |
| Anti-false-kill ladder | own-session hit → recorded-output keyword hit → other-session hit (subagent) → existence floor (cited path really exists → pass with ⚠ weak note) → block |
| Metrics | `blocked` (guesses downgraded) vs `converted` (blocked claims that later came back VERIFIED) vs `charity` (existence-floor passes, visible as 采信) |
| Card badges | tool card titles: 🟢 VERIFIED · 🔵 REFERENCED · 🟠 UNVERIFIED · ⚪ OFF |
| Switch | `/evidence-gate on\|off\|status\|report` + `evidence_gate_switch` model tool — **per-session**, persisted |

### v0.2 semantics

- **Per-session everything**: the switch, the ledger, and the prompt section are scoped to `sessionId`. Turning the gate on in one conversation never leaks into another; the chip tooltip shows 本会话 stats only. The policy section's text provider resolves per assembly (`context.agent.sessionId`).
- **Persistence**: ledger + switch + evidence index survive deployment restarts and context compaction (JSON store under `DSH_HOME/evidence-gate/store.json`, debounced atomic writes; override the path with `EVIDENCE_GATE_STORE`). Top 50 sessions by recency are kept.
- **Quiet startup**: mounting the bundle prints nothing to the host console — set `EVIDENCE_GATE_DEBUG=1` to print the load breadcrumbs (store restore + each registered component) when diagnosing a mount problem. Error/warning diagnostics are never gated.
- **Output-aware cross-check**: evidence like "pnpm test → SMOKE PASSED" now correlates against recorded tool OUTPUT (keywords, paths, URLs extracted from the `tools/result` payload), not just command strings.
- **Honest-claim protection**: misses fall through to other sessions (subagent work), then to an existence floor (a cited path that really exists on disk passes with a weak/采信 note instead of blocking). Fabricated paths, empty evidence, and `assumption` still block.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:53-61](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L53-L61)

系统提示要求模型在最终答复前调用。

```text
const POLICY_TEXT = [
  '## Evidence-first policy (active)',
  'When drawing any conclusion about code, files, system state, external services, or data:',
  '1. Prefer direct verification in this session: run the command, read the file, execute the test, fetch the data — before asserting it.',
  '2. You may reference documented or community-practice conclusions (official docs, changelogs, issue threads, prior verified results) — but name the source and phrase it as reported knowledge, not first-hand observation.',
  '3. Never present an unverified guess as a conclusion. A guess may appear only as an explicitly labeled hypothesis (e.g. 「推测，未验证」) together with its concrete next verification step.',
  'Before a final answer that rests on load-bearing factual claims about the system, code, or data, call the `evidence_gate` tool once per claim cluster with its basis and evidence, and follow its verdict: 已拦截 (UNVERIFIED) means verify now or downgrade the claim to a labeled hypothesis in your answer.',
  "Claims of direct observation (read/tested) are cross-checked against this session's recorded tool activity — claim only what was actually done.",
].join('\n')
```

**依据 3 · 源码核查**：[lib/index.js:1314-1413](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L1314-L1413)

模型工具只在被调用时执行 gateReport；默认关闭时返回 off。

<details>
<summary>查看原文（100行）</summary>

```text
    const tools = ctx.get('tools')
    if (tools !== undefined) {
      ctx.effect(() =>
        tools.register({
          name: 'evidence_gate',
          description:
            'Gate for load-bearing conclusions — call once per claim cluster before the final answer. ' +
            'basis: tested/measured/read_directly/prior_verified require evidence (command+output, file+line, measurement); ' +
            'documented/community_practice require source (must be cited); assumption = unverified. ' +
            'First-hand claims are cross-checked against the durable session evidence index. ' +
            'Verdict: 已实证 | 已引用 | 已拦截 (verdict "off" when this session has the gate disabled).',
          parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
              claim: { type: 'string', description: 'The load-bearing claim/conclusion to gate' },
              basis: {
                type: 'string',
                enum: ['tested', 'measured', 'read_directly', 'prior_verified', 'documented', 'community_practice', 'assumption'],
                description: 'Evidence basis of the claim',
              },
              evidence: { type: 'string', description: 'Concrete observation: command + key output, file path + line, measurement' },
              source: { type: 'string', description: 'Named source (URL/doc) for documented/community_practice' },
              next_verification: { type: 'string', description: 'Next verification step (required for assumption)' },
            },
            required: ['claim', 'basis'],
          },
          output: {
            schema: { type: 'object', additionalProperties: true },
            render(_args, value) {
              const text = value && typeof value.report === 'string' ? value.report : 'evidence_gate result unavailable'
              return [{ type: 'text', text: text }]
            },
            presentationMeta(_args, value) {
              return {
                verdict: value && typeof value.verdict === 'string' ? value.verdict : 'unknown',
                reason: value && typeof value.reason === 'string' ? value.reason : '',
                action: value && typeof value.action === 'string' ? value.action : '',
                actionOk: !!(value && value.actionOk),
                actionLabel: value && typeof value.actionLabel === 'string' ? value.actionLabel : '',
                actionDetail: value && typeof value.actionDetail === 'string' ? value.actionDetail : '',
                basis: value && typeof value.basis === 'string' ? value.basis : '',
                evidence: value && typeof value.evidence === 'string' ? value.evidence : '',
                check: value && typeof value.check === 'string' ? value.check : 'skip',
                note: value && typeof value.note === 'string' ? value.note : '',
              }
            },
          },
          presentCall(args) {
            const a = (args && typeof args === 'object') ? args : {}
            const c = typeof a.claim === 'string' ? a.claim : ''
            return {
              card: 'generic',
              title: '🛡 实证门 — ' + (c !== '' ? truncate(c, 60) : '核验结论中'),
              rawInput: { basis: a.basis },
            }
          },
          presentResult(args, result) {
            let verdict = 'unknown'
            if (result && result.meta && typeof result.meta.verdict === 'string') {
              verdict = result.meta.verdict
            } else if (
              result && Array.isArray(result.content) && result.content.length > 0 &&
              result.content[0] && typeof result.content[0].text === 'string'
            ) {
              const t = result.content[0].text
              if (t.indexOf('【已实证') === 0) {
                verdict = 'verified'
              } else if (t.indexOf('【已引用') === 0) {
                verdict = 'referenced'
              } else if (t.indexOf('【已拦截') === 0) {
                verdict = 'unverified'
              } else if (t.indexOf('【无效') === 0) {
                verdict = 'invalid'
              } else if (t.indexOf('【门未开启') === 0) {
                verdict = 'off'
              }
            }
            const a = (args && typeof args === 'object') ? args : {}
            const c = typeof a.claim === 'string' ? truncate(a.claim, 56) : ''
            const badge =
              verdict === 'verified' ? '🟢 已实证' :
              verdict === 'referenced' ? '🔵 已引用' :
              verdict === 'unverified' ? '🟠 已拦截' :
              verdict === 'off' ? '⚪ 门未开启' :
              '⚠ ' + verdict
            return { card: 'generic', title: badge + ' · ' + c }
          },
          execute(args, exec) {
            const key = keyOf(exec)
            const st = stateFor(key)
            if (st.enabled !== true) {
              return {
                verdict: 'off',
                ledger: snapshot(st),
                report: '【门未开启 Gate off】本会话实证门未开启，本次调用不计数。开启方式：/evidence-gate on，或输入框旁的盾形开关（shield toggle）。',
              }
            }
            return gateReport(key, args)
          },
```

</details>

#### 缺口

- 未测真实对话中调用覆盖率和最终答复的遵守率
  **影响：**不能声明自动消除幻觉或强制审计
  **进一步探讨：**用相同任务对比无门、开门与强制提交前核验，人工标注漏检和错判

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 活动证据如何采集、保存和在会话间复用？

**研究主题：**功能与机制

#### 完整回答

插件在 tools/result 上收集除自身工具外的工具名、参数摘要，以及结果前 1200 字符中的路径、URL 与最多 20 个词；每会话活动索引最多 400 条。会话身份优先取 agent.sessionId，缺失会落入共享桶。索引与开关、统计、最近裁定写入 DSH_HOME 下 JSON，可用环境变量改位置，1.5 秒防抖，先写带 PID 的临时文件再 rename；持久化最多 50 会话。查询路径会先搜本会话，再扫至多 30 个其他会话各 100 条。这保留了上下文压缩后的部分线索，却可能把不相关会话活动当作当前结论的证据；多进程共用存储时源码注释也承认末写覆盖。索引截断、只取有限输出意味着未命中不等于未做，命中也不等于内容正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:87-98](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L87-L98)

索引、会话与扫描容量限制。

<details>
<summary>查看原文（12行）</summary>

```text
const INDEX_CAP = 400
const PENDING_CAP = 20
const RECENT_CAP = 12
const CONTAIN_MIN_DIGEST = 8
const BASENAME_MIN = 6
const WORD_MIN = 5
const CROSS_SESSION_SCAN_CAP = 30
const CROSS_SESSION_ENTRY_CAP = 100
const PERSIST_SESSION_CAP = 50
const SAVE_DEBOUNCE_MS = 1500

const sessions = new Map()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:229-297](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L229-L297)

最多 50 会话、防抖和临时文件 rename 持久化。

<details>
<summary>查看原文（69行）</summary>

```text
function serializeState(st) {
  const basis = {}
  for (const [k, n] of st.ledger.basis) {
    basis[k] = n
  }
  return {
    enabled: st.enabled === true,
    updatedAt: st.updatedAt,
    ledger: {
      verified: st.ledger.verified,
      referenced: st.ledger.referenced,
      unverified: st.ledger.unverified,
      invalid: st.ledger.invalid,
      seq: st.ledger.seq,
      converted: st.ledger.converted,
      crossChecked: st.ledger.crossChecked,
      charity: st.ledger.charity,
      basis: basis,
      recent: st.ledger.recent,
    },
    pending: st.pending,
    index: st.activity,
  }
}

function saveNow() {
  if (!PERSIST_OK) {
    return
  }
  try {
    const picked = []
    for (const [key, st] of sessions) {
      if (st.enabled === true || st.ledger.seq > 0 || st.activity.length > 0) {
        picked.push([key, st])
      }
    }
    picked.sort((a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0))
    const out = { v: 2, savedAt: new Date().toISOString(), sessions: {} }
    const cap = Math.min(picked.length, PERSIST_SESSION_CAP)
    for (let i = 0; i < cap; i++) {
      out.sessions[picked[i][0]] = serializeState(picked[i][1])
    }
    FS.mkdirSync(path.dirname(STORE_FILE), { recursive: true })
    // pid-suffixed tmp: two processes must never race on the same temp name
    const tmp = STORE_FILE + '.' + process.pid + '.tmp'
    FS.writeFileSync(tmp, JSON.stringify(out))
    FS.renameSync(tmp, STORE_FILE)
  } catch (e) {
    console.error('[evidence-gate] persist failed: ' + String(e))
  }
}

function scheduleSave() {
  if (!PERSIST_OK || saveTimer !== null) {
    return
  }
  saveTimer = setTimeout(() => {
    saveTimer = null
    saveNow()
  }, SAVE_DEBOUNCE_MS)
  if (typeof saveTimer.unref === 'function') {
    saveTimer.unref()
  }
}

function markDirty(st) {
  st.updatedAt = Date.now()
  scheduleSave()
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:317-335](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L317-L335)

会话身份缺失时回退共享桶。

<details>
<summary>查看原文（19行）</summary>

```text
function keyOf(source) {
  const agent = source && source.agent
  // identity sources, best first: agent.sessionId, then a bare sessionId on the
  // event itself (defensive — an emitter may pass the agent/session object
  // directly), then agent.id (an Agent handle that hides its sessionId)
  const id = (agent && agent.sessionId) || (source && source.sessionId) || (agent && agent.id) || null
  if (id) {
    return String(id)
  }
  if (!sharedWarned) {
    sharedWarned = true
    const what = source && source.name ? ' (tool: ' + source.name + ')' : ''
    console.warn(
      '[evidence-gate] session identity unavailable' + what +
      " — falling back to the shared bucket. With multiple main sessions this state is shared across them; please report which action produced it.",
    )
  }
  return 'shared'
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:412-485](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L412-L485)

只记录有限的参数与输出锚点，保存索引。

<details>
<summary>查看原文（74行）</summary>

```text
function resultTextOf(result) {
  if (typeof result === 'string') {
    return result
  }
  if (result && typeof result === 'object') {
    if (Array.isArray(result.content)) {
      const parts = []
      for (let i = 0; i < result.content.length && i < 3; i++) {
        const c = result.content[i]
        if (c && typeof c.text === 'string') {
          parts.push(c.text)
        }
      }
      return parts.join('\n')
    }
    if (typeof result.text === 'string') {
      return result.text
    }
  }
  return ''
}

function outWords(text) {
  const seen = {}
  const out = []
  const parts = String(text || '').toLowerCase().split(/[^a-z0-9_\-]+/)
  for (let i = 0; i < parts.length && out.length < 20; i++) {
    const w = parts[i]
    if (w.length >= WORD_MIN && seen[w] !== true) {
      seen[w] = true
      out.push(w)
    }
  }
  return out
}

/** Extract corroboration anchors (urls / paths / distinctive words) from one tool output. */
function outAnchors(result) {
  const text = String(resultTextOf(result) || '').slice(0, 1200)
  if (text === '') {
    return null
  }
  const urls = []
  const re = /https?:\/\/[^\s"'<>）】》]+/g
  let m = re.exec(text)
  while (m !== null && urls.length < 3) {
    urls.push(m[0])
    m = re.exec(text)
  }
  const paths = pathTokens(text)
  const words = outWords(text)
  if (urls.length === 0 && paths.length === 0 && words.length === 0) {
    return null
  }
  return { urls: urls, paths: paths, words: words }
}

function noteActivity(st, exec, result) {
  if (!exec || typeof exec.name !== 'string') {
    return
  }
  if (exec.name.indexOf('evidence_gate') === 0) {
    return
  }
  const entry = { tool: exec.name, digest: digestOf(exec.arguments) }
  const out = outAnchors(result)
  if (out !== null) {
    entry.out = out
  }
  st.activity.unshift(entry)
  if (st.activity.length > INDEX_CAP) {
    st.activity.length = INDEX_CAP
  }
  markDirty(st)
```

</details>

**依据 5 · 源码核查**：[lib/index.js:598-621](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L598-L621)

跨会话路径匹配不检查委派关系。

<details>
<summary>查看原文（24行）</summary>

```text
/** Path corroboration across sessions (subagent did the work, parent claims it). */
function findPathAny(st, key, token) {
  if (findEntry(st, token) !== null) {
    return { cross: false }
  }
  const t = normalizePathish(token)
  const tb = baseOf(t)
  let scanned = 0
  for (const [k2, st2] of sessions) {
    if (k2 === key || st2.activity.length === 0) {
      continue
    }
    scanned = scanned + 1
    if (scanned > CROSS_SESSION_SCAN_CAP) {
      break
    }
    const lim = Math.min(st2.activity.length, CROSS_SESSION_ENTRY_CAP)
    for (let i = 0; i < lim; i++) {
      if (entryMatches(st2.activity[i], t, tb)) {
        return { cross: true }
      }
    }
  }
  return null
```

</details>

#### 缺口

- 未在多进程、压缩后与长期高调用量会话执行恢复测试
  **影响：**无法确认持久完整率和错配率
  **进一步探讨：**用隔离存储并发重启、超过 400 条索引和共享桶夹具核对恢复与命中

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “已实证”的交叉核验实际验证了什么，最关键的误判路径是什么？

**研究主题：**缺陷与关键质疑

#### 完整回答

路径命中使用双向子串与同 basename 回退；不校验工具是否成功、文件版本、内容哈希或主张语义。tested/measured 可因命令摘要或输出中的一个关键词命中，已有文件路径即使索引未命中也获得 weak，而 gateReport 对 hit、weak 甚至 skip 都返回 verdict=verified；weak 的展示虽要求谨慎，机器裁定仍是已实证。跨会话查找也未验证是否真为该主张授权的子代理。因此同名文件、失败的读取、过期测试、无关会话活动和只存在的文件都可能使主张被放行。这是静态源码可推导的假阳性风险，未运行目标插件构造复现；作者 README 也承认核对是概率性的，路径匹配不核验内容真伪。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:553-621](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L553-L621)

路径匹配与跨会话扫描基于路径字符串。

<details>
<summary>查看原文（69行）</summary>

```text
/**
 * Does one index entry corroborate a claimed path-like token?
 * Same rules as v0.1 (two-way normalized containment with the short-pattern
 * guard, plus the >= BASENAME_MIN basename fallback), extended to the output
 * anchors a tool result contributed.
 */
function entryMatches(a, t, tb) {
  const cands = [a.digest]
  if (a.out && Array.isArray(a.out.paths)) {
    for (let i = 0; i < a.out.paths.length; i++) {
      cands.push(a.out.paths[i])
    }
  }
  for (let i = 0; i < cands.length; i++) {
    const d = normalizePathish(cands[i])
    if (d.length === 0) {
      continue
    }
    if (t === '') {
      return true
    }
    if (d.indexOf(t) >= 0) {
      return true
    }
    if (d.length >= CONTAIN_MIN_DIGEST && t.indexOf(d) >= 0) {
      return true
    }
    if (tb.length >= BASENAME_MIN && baseOf(d) === tb) {
      return true
    }
  }
  return false
}

function findEntry(st, token) {
  const t = normalizePathish(token)
  const tb = baseOf(t)
  for (let i = 0; i < st.activity.length; i++) {
    if (entryMatches(st.activity[i], t, tb)) {
      return st.activity[i]
    }
  }
  return null
}

/** Path corroboration across sessions (subagent did the work, parent claims it). */
function findPathAny(st, key, token) {
  if (findEntry(st, token) !== null) {
    return { cross: false }
  }
  const t = normalizePathish(token)
  const tb = baseOf(t)
  let scanned = 0
  for (const [k2, st2] of sessions) {
    if (k2 === key || st2.activity.length === 0) {
      continue
    }
    scanned = scanned + 1
    if (scanned > CROSS_SESSION_SCAN_CAP) {
      break
    }
    const lim = Math.min(st2.activity.length, CROSS_SESSION_ENTRY_CAP)
    for (let i = 0; i < lim; i++) {
      if (entryMatches(st2.activity[i], t, tb)) {
        return { cross: true }
      }
    }
  }
  return null
```

</details>

**依据 2 · 源码核查**：[lib/index.js:702-750](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L702-L750)

路径存在即可进入 weak。

<details>
<summary>查看原文（49行）</summary>

```text
/** First cited path token that really exists on disk (existence floor for unindexed honest claims). */
function existingPathToken(evidence) {
  if (!FS_OK) {
    return null
  }
  const tokens = pathTokens(evidence)
  for (let i = 0; i < tokens.length; i++) {
    const p = normalizePathish(tokens[i])
    if (!/^[a-z]:\//.test(p) && p.indexOf('//') !== 0) {
      continue
    }
    try {
      const stat = FS.statSync(p.replace(/\/$/, ''))
      if (stat) {
        return tokens[i]
      }
    } catch (e) {
      // not present — keep looking
    }
  }
  return null
}

/**
 * Cross-check a first-hand/referenced claim against the durable evidence index.
 * Order: own-session paths → tested command correlation → recorded OUTPUT
 * keywords → other sessions → existence floor → miss.
 */
function crossCheck(st, key, basis, evidence, source) {
  // Uniform logic for empty AND populated indexes: own-session lookups no-op on
  // an empty index while cross-session hits, the existence floor, and the
  // referenced-URL path still work — no early "window just opened" auto-pass.
  if (VERIFIED_BASES[basis] === true) {
    const tokens = pathTokens(evidence)
    if (tokens.length > 0) {
      for (let i = 0; i < tokens.length; i++) {
        const found = findPathAny(st, key, tokens[i])
        if (found !== null) {
          st.ledger.crossChecked = st.ledger.crossChecked + 1
          return {
            mode: 'hit',
            note: (found.cross ? '命中其他会话工具活动（子代理/早前会话） "' : '命中工具活动记录 "') + truncate(tokens[i], 60) + '"',
          }
        }
      }
      const floor = existingPathToken(evidence)
      if (floor !== null) {
        st.ledger.charity = st.ledger.charity + 1
        return { mode: 'weak', note: '索引未命中，但证据路径真实存在——按指针采信（如未实测请自行复核）' }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:753-794](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L753-L794)

实测命令/输出匹配使用文本与单词。

<details>
<summary>查看原文（42行）</summary>

```text
    }
    if (basis === 'tested' || basis === 'measured') {
      const head = normalizePathish(truncate(evidence, 24))
      const words = evidenceWords(evidence)
      for (let i = 0; i < st.activity.length; i++) {
        const a = st.activity[i]
        if (!SHELL_TOOLS[a.tool]) {
          continue
        }
        const d = normalizePathish(a.digest)
        if (d.length === 0) {
          continue
        }
        if (head.length >= CONTAIN_MIN_DIGEST && (d.indexOf(head) >= 0 || (head.indexOf(d) >= 0 && d.length >= CONTAIN_MIN_DIGEST))) {
          st.ledger.crossChecked = st.ledger.crossChecked + 1
          return { mode: 'hit', note: '证据与已记录命令关联' }
        }
        if (d.length >= 3 && containsWholeWord(evidence.toLowerCase(), d)) {
          st.ledger.crossChecked = st.ledger.crossChecked + 1
          return { mode: 'hit', note: '证据引用了已记录命令 "' + truncate(a.digest, 40) + '"' }
        }
        for (let w = 0; w < words.length; w++) {
          if (d.indexOf(words[w]) >= 0) {
            st.ledger.crossChecked = st.ledger.crossChecked + 1
            return { mode: 'hit', note: '已记录命令包含证据关键词 "' + words[w] + '"' }
          }
        }
      }
      // recorded tool OUTPUT contains an evidence keyword ("pnpm test → SMOKE PASSED")
      for (let i = 0; i < st.activity.length; i++) {
        const a = st.activity[i]
        if (!a.out || !Array.isArray(a.out.words) || a.out.words.length === 0) {
          continue
        }
        for (let w = 0; w < words.length; w++) {
          if (a.out.words.indexOf(words[w]) >= 0) {
            st.ledger.crossChecked = st.ledger.crossChecked + 1
            return { mode: 'hit', note: '命中已记录输出关键词 "' + words[w] + '"（' + a.tool + '）' }
          }
        }
      }
      return { mode: 'miss', note: '证据索引中没有与该「实测」关联的命令或输出——请在 evidence 中引用确切命令与输出' }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:845-866](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L845-L866)

除 miss 外统一赋 verified。

<details>
<summary>查看原文（22行）</summary>

```text
  if (VERIFIED_BASES[basis] === true) {
    if (evidence !== '') {
      const cc = crossCheck(st, key, basis, evidence, source)
      checkMode = cc.mode
      checkNote = cc.note
      if (cc.mode === 'miss') {
        verdict = 'unverified'
        reason = '交叉核验失败：' + cc.note
        actionOk = false
        actionLabel = '不得作结论 No'
        actionDetail = '重新实测后翻案，或标注「推测，未验证」'
        message = '【已拦截 Blocked·交叉核验失败 Cross-check failed】' + cc.note + '。二选一：① 重新实测（运行/读取）后以实际证据再次过门；② 在回答中降级为「推测，未验证」。'
      } else {
        verdict = 'verified'
        reason = cc.mode === 'hit' ? '交叉核验✓ ' + cc.note : cc.mode === 'weak' ? '采信：' + cc.note : '无可核验路径（按声明采信）'
        actionOk = true
        actionLabel = cc.mode === 'weak' ? '可引用 Cite' : '可作结论 OK'
        actionDetail = cc.mode === 'hit' ? '保留证据出处' : cc.mode === 'weak' ? '表述须谨慎' : '建议保留出处'
        action = (actionOk ? '✔ ' : '✘ ') + actionLabel + (actionDetail !== '' ? ' — ' + actionDetail : '')
        message =
          '【已实证 Verified】' + basisZh + '，' + (cc.mode === 'hit' ? '交叉核验✓（' + cc.note + '）' : cc.mode === 'weak' ? cc.note : '无可核验路径，按声明采信') +
          '。可在回答中陈述该结论，证据出处：' + truncate(evidence, 120)
```

</details>

**依据 5 · 作者声明**：[README.md:142-148](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/README.md#L142-L148)

作者说明索引核对不是内容真实性证明。

```text
## Limitations (read this)

- The policy is a **probabilistic constraint, not a hard guarantee** — nothing in the harness can intercept final prose. The gate + cross-check + visible ledger is the practical optimum at this layer.
- The cross-check only sees what passed through the `tools/result` stream **while the plugin was loaded**; with an empty index, first-hand claims fall through cross-session lookup and the existence floor before failing closed.
- Cross-check is corroboration, not truth: a real command run for an unrelated reason can still match, and a determined agent can cite a real path. It raises the cost of lying, it does not make lying impossible.
- A tool execution that carries **no session identity** falls into a single shared bucket (the host log warns once when this happens). With multiple main sessions, that bucket is shared across them — if you ever see the warning, report which action produced it.
- Deployments sharing one `DSH_HOME` (e.g. several profiles) share the store file (last write wins per 1.5s debounce).
```

#### 缺口

- 假阳性频率及宿主工具结果形态未实际测量
  **影响：**不能量化错误放行率或宣称每个示例必然可触发
  **进一步探讨：**隔离测试同 basename、失败 read、历史 test、无关会话和仅存在路径的裁定

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 开关、Web 路由与持久化给部署带来什么成本和安全边界？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

包为 Node >=18 的 DSH 插件，注入 tools、webServer，并可用 systemPrompt、commands 服务。默认按会话关闭；Slash 命令、模型工具和 Web POST 可改变开关，Web GET 可按 session 查询或返回汇总。POST 检查 Origin 与 Host 和 JSON Content-Type，并限制正文约 64KB，但路由注释明确是无认证的 loopback 接口；仅凭 session 字符串可读写指定会话状态，故部署若把宿主 Web 服务暴露到不可信网络，需先由宿主另设访问边界。首次使用要确认存储目录权限、真实会话键和开关生效时序；持续使用需承受最多 400 条活动/会话的磁盘写入与证据复核；失败恢复要处理存储丢失、末写覆盖和错判撤回。金额、延迟与人工复核耗时无测量。索引含命令、路径、URL 与结果词，属于可能敏感的持久资料。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-47](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/package.json#L1-L47)

插件入口、Node 和宿主服务依赖。

<details>
<summary>查看原文（47行）</summary>

```text
{
  "name": "@aaronandwork/dsh-evidence-gate",
  "version": "0.2.1",
  "description": "Evidence-first conclusion gate for DeepSeek Harness (DSH): 3-tier evidence hierarchy policy, a model tool that verdicts claims (VERIFIED/REFERENCED/UNVERIFIED), durable per-session tool-activity cross-checking (arguments + output anchors, restart-surviving), per-session switch + persisted ledger, and a session-scoped UI toggle.",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.mjs",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "slots"
      ]
    }
  },
  "keywords": [
    "dsh",
    "deepseek-harness",
    "dsh-plugin",
    "cordis",
    "cordis-plugin",
    "evidence",
    "verification",
    "anti-hallucination",
    "agent"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AaronandWork/dsh-evidence-gate.git"
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:104-117](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L104-L117)

存储位置来源。

<details>
<summary>查看原文（14行）</summary>

```text
const STORE_FILE = (() => {
  const custom = (typeof process !== 'undefined' && process.env && process.env.EVIDENCE_GATE_STORE) || ''
  if (custom !== '') {
    return String(custom)
  }
  const home =
    (typeof process !== 'undefined' && process.env && (process.env.DSH_HOME || process.env.USERPROFILE || process.env.HOME)) || ''
  if (home === '') {
    return ''
  }
  return path.join(home, 'evidence-gate', 'store.json')
})()

const PERSIST_OK = FS_OK && STORE_FILE !== ''
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1064-1160](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L1064-L1160)

无认证路由的请求与会话键处理。

<details>
<summary>查看原文（97行）</summary>

```text
/** The route is unauthenticated and loopback-bound; keep every input bounded. */
const POST_BODY_LIMIT = 64 * 1024

/** Session keys come from agent sessionIds — generous charset, hard length cap, no control chars. */
function validSessionKey(s) {
  return typeof s === 'string' && s.length >= 1 && s.length <= 200 && !/[\s\u0000-\u001f\u007f]/.test(s)
}

async function routeApi(ctx, req, res) {
  const send = (code, payload) => {
    if (res.writableEnded || res.destroyed) {
      return
    }
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(payload))
  }
  try {
    if (req.method === 'GET') {
      const session = queryOf(req.url).get('session')
      if (session !== null && session !== '' && validSessionKey(String(session))) {
        send(200, sessionView(String(session)))
      } else {
        send(200, aggregateView())
      }
      return
    }
    if (req.method === 'POST') {
      // Same-origin gate: the web GUI is the only legitimate caller. Blocks the
      // cross-site no-cors form POST (its Origin never matches this host).
      const origin = req.headers.origin
      if (origin !== undefined && origin !== '') {
        let originHost = '?'
        try {
          originHost = new URL(String(origin)).host
        } catch (e) {
          originHost = '?'
        }
        if (originHost !== String(req.headers.host || '')) {
          send(403, { error: 'cross-origin request rejected' })
          return
        }
      }
      // Requiring application/json also kills the cross-site no-cors vector:
      // such requests cannot set this content type (no preflight possible).
      const ct = String(req.headers['content-type'] || '').toLowerCase()
      if (ct.indexOf('application/json') !== 0) {
        send(415, { error: 'content-type must be application/json' })
        return
      }
      let body = ''
      let overflow = false
      let settled = false
      req.on('data', (chunk) => {
        if (settled || overflow) {
          return // drain without buffering
        }
        body = body + chunk
        if (body.length > POST_BODY_LIMIT) {
          overflow = true
          body = ''
          settled = true
          send(413, { error: 'request body too large' })
        }
      })
      req.on('end', () => {
        if (settled || overflow) {
          return
        }
        settled = true
        try {
          const a = body ? JSON.parse(body) : {}
          const action = typeof a.action === 'string' ? a.action.trim().toLowerCase() : ''
          const session = typeof a.session === 'string' ? a.session.trim() : ''
          // validate EVERYTHING before touching stateFor — no state creation on
          // invalid input, and no unbounded in-memory session growth
          if (action !== 'on' && action !== 'off' && action !== 'toggle' && action !== 'status') {
            send(400, { error: 'action must be on | off | toggle | status' })
            return
          }
          if (!validSessionKey(session)) {
            send(400, { error: 'invalid session key' })
            return
          }
          if (action === 'status') {
            send(200, sessionView(session)) // read-only: never creates state
            return
          }
          const st = stateFor(session)
          if (action === 'on') {
            st.enabled = true
          } else if (action === 'off') {
            st.enabled = false
          } else {
            st.enabled = !(st.enabled === true)
          }
          markDirty(st)
          send(200, sessionView(session))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1186-1219](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L1186-L1219)

注册服务、记录活动和条件提示。

<details>
<summary>查看原文（34行）</summary>

```text
module.exports = {
  name: 'evidence-gate',
  inject: ['tools', 'webServer'],
  apply(ctx) {
    loadStore()
    installExitHook()

    ctx.on('tools/result', function (exec, result) {
      try {
        // record always (durable bounded index): honest actions taken while the
        // gate was OFF must still be cross-checkable after the user turns it ON.
        noteActivity(stateFor(keyOf(exec)), exec, result)
      } catch (e) {
        console.error('[evidence-gate] activity note failed: ' + String(e))
      }
    })
    debugLog('[evidence-gate] tools/result listener attached (arguments + output anchors)')

    const systemPrompt = ctx.get('systemPrompt')
    if (systemPrompt !== undefined) {
      ctx.effect(() =>
        systemPrompt.section({
          name: 'evidence_gate_policy',
          order: 550,
          text(context) {
            const key = keyOf(context)
            const st = peekState(key)
            return st !== undefined && st.enabled === true ? POLICY_TEXT : ''
          },
        }),
      )
      debugLog('[evidence-gate] per-session policy section registered')
    } else {
      console.error('[evidence-gate] systemPrompt service unavailable — section skipped')
```

</details>

#### 缺口

- 宿主 Web 绑定、文件权限与实际资源占用未查验
  **影响：**不能推断默认网络可达性或量化运营成本
  **进一步探讨：**在目标宿主只读核网络绑定和存储权限，并在隔离会话计量索引增长及复核耗时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何将现有索引机制提升为可证伪的可信结论核验？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可借鉴之处是把工具活动形成容量受限的持久线索，清晰分出亲测、引用、假设并记录错判后再验证的计数。然而核心问题是“活动发生”被直接等同于“主张得到证实”。未验证的改进是假设把 evidence item 绑定会话/明确委派关系、工具成功状态、输出摘要、文件版本或内容哈希与时间范围；把仅存在路径、子串或跨会话弱关联降为 unverified/needs_review，最终答复前由宿主检查每个承载结论的 verdict。最小实验建立真值已知的读取、失败、旧版本、同名、无关会话和正确委派夹具，比较假阳性、假阴性、调用覆盖率、延迟与人工审阅时长。严格匹配可能增假阴性，需设可解释的人工复核通道，不能把更严直接宣称更好。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:469-485](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L469-L485)

活动与输出锚点采集。

<details>
<summary>查看原文（17行）</summary>

```text
function noteActivity(st, exec, result) {
  if (!exec || typeof exec.name !== 'string') {
    return
  }
  if (exec.name.indexOf('evidence_gate') === 0) {
    return
  }
  const entry = { tool: exec.name, digest: digestOf(exec.arguments) }
  const out = outAnchors(result)
  if (out !== null) {
    entry.out = out
  }
  st.activity.unshift(entry)
  if (st.activity.length > INDEX_CAP) {
    st.activity.length = INDEX_CAP
  }
  markDirty(st)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:730-813](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L730-L813)

现有交叉核验的 hit/weak/skip 分支。

<details>
<summary>查看原文（84行）</summary>

```text
function crossCheck(st, key, basis, evidence, source) {
  // Uniform logic for empty AND populated indexes: own-session lookups no-op on
  // an empty index while cross-session hits, the existence floor, and the
  // referenced-URL path still work — no early "window just opened" auto-pass.
  if (VERIFIED_BASES[basis] === true) {
    const tokens = pathTokens(evidence)
    if (tokens.length > 0) {
      for (let i = 0; i < tokens.length; i++) {
        const found = findPathAny(st, key, tokens[i])
        if (found !== null) {
          st.ledger.crossChecked = st.ledger.crossChecked + 1
          return {
            mode: 'hit',
            note: (found.cross ? '命中其他会话工具活动（子代理/早前会话） "' : '命中工具活动记录 "') + truncate(tokens[i], 60) + '"',
          }
        }
      }
      const floor = existingPathToken(evidence)
      if (floor !== null) {
        st.ledger.charity = st.ledger.charity + 1
        return { mode: 'weak', note: '索引未命中，但证据路径真实存在——按指针采信（如未实测请自行复核）' }
      }
      return { mode: 'miss', note: '证据索引中无与 "' + truncate(tokens[0], 60) + '" 匹配的活动' }
    }
    if (basis === 'tested' || basis === 'measured') {
      const head = normalizePathish(truncate(evidence, 24))
      const words = evidenceWords(evidence)
      for (let i = 0; i < st.activity.length; i++) {
        const a = st.activity[i]
        if (!SHELL_TOOLS[a.tool]) {
          continue
        }
        const d = normalizePathish(a.digest)
        if (d.length === 0) {
          continue
        }
        if (head.length >= CONTAIN_MIN_DIGEST && (d.indexOf(head) >= 0 || (head.indexOf(d) >= 0 && d.length >= CONTAIN_MIN_DIGEST))) {
          st.ledger.crossChecked = st.ledger.crossChecked + 1
          return { mode: 'hit', note: '证据与已记录命令关联' }
        }
        if (d.length >= 3 && containsWholeWord(evidence.toLowerCase(), d)) {
          st.ledger.crossChecked = st.ledger.crossChecked + 1
          return { mode: 'hit', note: '证据引用了已记录命令 "' + truncate(a.digest, 40) + '"' }
        }
        for (let w = 0; w < words.length; w++) {
          if (d.indexOf(words[w]) >= 0) {
            st.ledger.crossChecked = st.ledger.crossChecked + 1
            return { mode: 'hit', note: '已记录命令包含证据关键词 "' + words[w] + '"' }
          }
        }
      }
      // recorded tool OUTPUT contains an evidence keyword ("pnpm test → SMOKE PASSED")
      for (let i = 0; i < st.activity.length; i++) {
        const a = st.activity[i]
        if (!a.out || !Array.isArray(a.out.words) || a.out.words.length === 0) {
          continue
        }
        for (let w = 0; w < words.length; w++) {
          if (a.out.words.indexOf(words[w]) >= 0) {
            st.ledger.crossChecked = st.ledger.crossChecked + 1
            return { mode: 'hit', note: '命中已记录输出关键词 "' + words[w] + '"（' + a.tool + '）' }
          }
        }
      }
      return { mode: 'miss', note: '证据索引中没有与该「实测」关联的命令或输出——请在 evidence 中引用确切命令与输出' }
    }
    return { mode: 'skip', note: '无可核验的路径' }
  }
  if (REFERENCED_BASES[basis] === true) {
    const src = source !== '' ? source : evidence
    if (src.indexOf('http') === 0) {
      const hit = findWebAny(key, src)
      if (hit !== null) {
        st.ledger.crossChecked = st.ledger.crossChecked + 1
        return {
          mode: 'hit',
          note: hit.cross ? '该来源出现在其他会话的搜索/抓取记录中' : '该来源已出现在本会话的搜索/抓取记录中',
        }
      }
      return { mode: 'weak', note: '该 URL 本会话未抓取——引用时须谨慎' }
    }
    return { mode: 'skip', note: '' }
  }
  return { mode: 'skip', note: '' }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:845-866](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L845-L866)

弱证据被抬升为 verified 的核心缺口。

<details>
<summary>查看原文（22行）</summary>

```text
  if (VERIFIED_BASES[basis] === true) {
    if (evidence !== '') {
      const cc = crossCheck(st, key, basis, evidence, source)
      checkMode = cc.mode
      checkNote = cc.note
      if (cc.mode === 'miss') {
        verdict = 'unverified'
        reason = '交叉核验失败：' + cc.note
        actionOk = false
        actionLabel = '不得作结论 No'
        actionDetail = '重新实测后翻案，或标注「推测，未验证」'
        message = '【已拦截 Blocked·交叉核验失败 Cross-check failed】' + cc.note + '。二选一：① 重新实测（运行/读取）后以实际证据再次过门；② 在回答中降级为「推测，未验证」。'
      } else {
        verdict = 'verified'
        reason = cc.mode === 'hit' ? '交叉核验✓ ' + cc.note : cc.mode === 'weak' ? '采信：' + cc.note : '无可核验路径（按声明采信）'
        actionOk = true
        actionLabel = cc.mode === 'weak' ? '可引用 Cite' : '可作结论 OK'
        actionDetail = cc.mode === 'hit' ? '保留证据出处' : cc.mode === 'weak' ? '表述须谨慎' : '建议保留出处'
        action = (actionOk ? '✔ ' : '✘ ') + actionLabel + (actionDetail !== '' ? ' — ' + actionDetail : '')
        message =
          '【已实证 Verified】' + basisZh + '，' + (cc.mode === 'hit' ? '交叉核验✓（' + cc.note + '）' : cc.mode === 'weak' ? cc.note : '无可核验路径，按声明采信') +
          '。可在回答中陈述该结论，证据出处：' + truncate(evidence, 120)
```

</details>

#### 缺口

- 绑定式核验与提交前门禁均未实现
  **影响：**不能把减少错误或操作成本记作现有贡献
  **进一步探讨：**实现隔离原型后按固定夹具和真实任务人工标注评估误判与额外成本

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现阶段适合如何试用，哪些结论必须保留人工核对？

**研究主题：**采用判断

#### 完整回答

可在单人本地会话中把它作为提醒与证据线索索引，明确打开开关，对 gate verdict 回查原始工具输出及版本；报告统计可辅助发现未核结论。不能把 verified 机器状态当作事实证明，也不能用它作为自动安全门或审计合规证明。若共享 DSH_HOME、存在多会话或联网宿主，先核会话隔离与访问边界。当前建议观察而非直接纳入强制流程，优先复现弱命中误判并测漏调用。作者的 npm 发布/下载历史属于旧 META 快照，不是本轮实时安装成功；本轮只读固定提交，不运行插件或目标测试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1402-1413](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L1402-L1413)

默认关闭且仅工具调用时执行裁定。

<details>
<summary>查看原文（12行）</summary>

```text
          execute(args, exec) {
            const key = keyOf(exec)
            const st = stateFor(key)
            if (st.enabled !== true) {
              return {
                verdict: 'off',
                ledger: snapshot(st),
                report: '【门未开启 Gate off】本会话实证门未开启，本次调用不计数。开启方式：/evidence-gate on，或输入框旁的盾形开关（shield toggle）。',
              }
            }
            return gateReport(key, args)
          },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:845-866](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/lib/index.js#L845-L866)

已实证状态包括弱核验。

<details>
<summary>查看原文（22行）</summary>

```text
  if (VERIFIED_BASES[basis] === true) {
    if (evidence !== '') {
      const cc = crossCheck(st, key, basis, evidence, source)
      checkMode = cc.mode
      checkNote = cc.note
      if (cc.mode === 'miss') {
        verdict = 'unverified'
        reason = '交叉核验失败：' + cc.note
        actionOk = false
        actionLabel = '不得作结论 No'
        actionDetail = '重新实测后翻案，或标注「推测，未验证」'
        message = '【已拦截 Blocked·交叉核验失败 Cross-check failed】' + cc.note + '。二选一：① 重新实测（运行/读取）后以实际证据再次过门；② 在回答中降级为「推测，未验证」。'
      } else {
        verdict = 'verified'
        reason = cc.mode === 'hit' ? '交叉核验✓ ' + cc.note : cc.mode === 'weak' ? '采信：' + cc.note : '无可核验路径（按声明采信）'
        actionOk = true
        actionLabel = cc.mode === 'weak' ? '可引用 Cite' : '可作结论 OK'
        actionDetail = cc.mode === 'hit' ? '保留证据出处' : cc.mode === 'weak' ? '表述须谨慎' : '建议保留出处'
        action = (actionOk ? '✔ ' : '✘ ') + actionLabel + (actionDetail !== '' ? ' — ' + actionDetail : '')
        message =
          '【已实证 Verified】' + basisZh + '，' + (cc.mode === 'hit' ? '交叉核验✓（' + cc.note + '）' : cc.mode === 'weak' ? cc.note : '无可核验路径，按声明采信') +
          '。可在回答中陈述该结论，证据出处：' + truncate(evidence, 120)
```

</details>

**依据 3 · 作者声明**：[README.md:142-148](https://github.com/AaronandWork/dsh-evidence-gate/blob/845ddf415e045eb6b2a014bca97a9c63aee1befa/README.md#L142-L148)

作者说明非真相证明。

```text
## Limitations (read this)

- The policy is a **probabilistic constraint, not a hard guarantee** — nothing in the harness can intercept final prose. The gate + cross-check + visible ledger is the practical optimum at this layer.
- The cross-check only sees what passed through the `tools/result` stream **while the plugin was loaded**; with an empty index, first-hand claims fall through cross-session lookup and the existence floor before failing closed.
- Cross-check is corroboration, not truth: a real command run for an unrelated reason can still match, and a determined agent can cite a real path. It raises the cost of lying, it does not make lying impossible.
- A tool execution that carries **no session identity** falls into a single shared bucket (the host log warns once when this happens). With multiple main sessions, that bucket is shared across them — if you ever see the warning, report which action produced it.
- Deployments sharing one `DSH_HOME` (e.g. several profiles) share the store file (last write wins per 1.5s debounce).
```

#### 缺口

- 真实多会话用户的正确率、调用遵从率和恢复体验未知
  **影响：**不能给自动化安装与强制使用建议
  **进一步探讨：**先做误判夹具，再进行一轮人工标注的真实会话对照试用

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
