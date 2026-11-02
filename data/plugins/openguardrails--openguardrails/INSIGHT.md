# OpenGuardrails

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[01c65ef](https://github.com/openguardrails/openguardrails/tree/01c65ef12a44608f1e011382b98de21b7f81dca4)

<!-- BEGIN META -->
[![GitHub ★ 361](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=361&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openguardrails/openguardrails)
<!-- END META -->

> **功能**：以本地规则、模型裁决、秘密替换、网关和 sandbox 为 AI Agent 提供安全检查与行为记录。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明根项目将模型通道秘密替换、规则先行和工具拒绝反馈统一到本地网关，适合避免为每个 harness 单独改写调用链。重要增量是组合与责任分层；Seatbelt／bubblewrap 及规则方法来自成熟先例，不能归为新隔离算法。

> **主要限制**：[Q02](#research-q02) 无模型与额度耗尽的未知调用仍前进，failMode=closed 也不代表所有未决都拒绝；[Q03](#research-q03) 识别范围和默认网络 observe 又限制安全承诺。必须保留宿主权限检查，并把未决、绕过与秘密规则遗漏纳入验收，不能据日志沉默判断安全。

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
  - [Q01 · 根项目向谁提供什么增量，与 Agent 审批及 DSH 插件有什么区别？](#detail-section-11)
  - [Q02 · 从网关到裁决与拒绝反馈怎样接线，未决和失败是否一律拦截？](#detail-section-12)
  - [Q03 · 秘密与 sandbox 保护边界、接入与全周期负担是否允许小范围试用？](#detail-section-13)
  - [Q04 · 公开结果可支持何种效果判断，下一项假设怎样被推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根项目面向维护本机编码 Agent 的开发者：重复工具调用中，希望让明确只读或工作区内普通操作少打断，同时对危险动作提供拒绝原因和审计线索。合格结果不是“无人打断”，而是允许动作可继续、拒绝动作未交给工具、未知明确留给原宿主处理。简单基线是宿主逐次审批加 OS 权限；已有 sandbox 提供进程限制。该项目把本地规则、模型通道的秘密替换、工具调用裁决与进程观测组合为一个 CLI／本地服务，根真实类型为 infrastructure，DSH 适配子包不是根项目的原生导出。

新增的是可跨兼容模型通道集中部署的组合，不能把成熟的 shell 解析、正则识别和继承的 Seatbelt／bubblewrap 当原创隔离算法。固定 README 自称早期版本，并明确模型 API 尚未公开、npm 包尚未发布；这是固定版本作者状态，不是本轮对在线服务的实时测量。能形成有限本地规则试用，不足以推荐替代宿主审批或无人值守处理所有动作。实际需求强度、误报与减少打断的收益尚未取得独立用户证据。

基线为宿主原审批加 OS 权限／已有 sandbox；本项目集中规则、模型通道秘密处理与裁决，继承 sandbox-runtime，不将其算原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地规则与裁决 | allow／deny／judge分流调用 | 未知可能unjudged，宿主权限仍必需 |
| 模型通道秘密替换 | 识别秘密占位并仅恢复允许工具参数 | 未识别秘密不覆盖；重启映射丢失 |
| sandbox运行与记录 | 文件限制、连接观测和可选host强制 | 继承OS依赖，默认observe非全面网络拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 22.12+ 与源码构建 | CLI 必需 | 运行本地服务 | 固定材料尚无 npm 发布声明，需自行构建 |
| 同协议上游与模型凭据 | 网关推理必需 | 转发模型请求 | 不转换 OpenAI／Anthropic 协议 |
| sandbox-runtime 0.0.81 与 OS 工具 | run 必需 | 进程文件／网络限制 | 依赖错误返回127；Windows未验 |
| 宿主原权限检查 | 未决安全处理必需 | 接管无模型／额度等未知 | 关闭后不构成完整审查 |
| 可选裁决模型／AIRS | 对应裁决需要 | 判断规则无法识别动作 | 无模型记unjudged；两条配置失败模式不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定版本与一次性工作区，使用合成秘密 | 不关闭宿主审批；本轮未安装 |
| 接入 | 配上游并指向本地网关，分别核查协议与run权限 | 先验证普通允许、拒绝、未知和绕过反例 |
| 使用 | Agent 发请求，维护者核decisions与模型请求日志 | 未知不能算安全；保护日志数据 |
| 恢复 | 重启后重新建立必要数据映射 | 旧占位符被拒绝，不直接重放 |
| 退出 | 恢复宿主baseURL与审批，停本地服务 | 人工核配置与日志留存，回原连接 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node、源码构建、OS sandbox工具 | 配代理、上游、路径与host | 工时未测 |
| 持续 | 上游推理、可选裁决服务及日志空间 | 核未知、误判和宿主升级 | 价格／单位安全任务成本未知 |
| 失败恢复 | 重试与状态重建 | 分辨额度、网络、占位符丢失 | closed不覆盖所有未知 |
| 退出 | 日志留存存储 | 恢复原连接、核配置数据 | 停服务不等自动擦除历史 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少规则可判动作打断 | 本地allow/deny机制可核 | 实际审批节时与误判 |
| 秘密处理 | 识别规则占位与允许调用恢复接线 | 未识别秘密、绕过与真实泄漏率 |
| 隔离与审计 | 继承sandbox、记录连接与拒绝 | 平台实际执行及生产安全 |
| 公开评测 | seed reference和合成口径明确 | 非当前CLI／在线模型效果证明 |

> **思考**：[Q02](#research-q02) 无模型与额度耗尽的未知调用仍前进，failMode=closed 也不代表所有未决都拒绝；[Q03](#research-q03) 识别范围和默认网络 observe 又限制安全承诺。必须保留宿主权限检查，并把未决、绕过与秘密规则遗漏纳入验收，不能据日志沉默判断安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明根项目将模型通道秘密替换、规则先行和工具拒绝反馈统一到本地网关，适合避免为每个 harness 单独改写调用链。重要增量是组合与责任分层；Seatbelt／bubblewrap 及规则方法来自成熟先例，不能归为新隔离算法。

[Q02](#research-q02) 对unjudged、quota和一般异常分支分别表达，比将未知当允许更可审计；但网关协议裁决不持执行权限。[Q03](#research-q03) 依赖缺失127、固定sandbox版本和旧占位符拒绝可追溯，不能扩写成跨平台完整安全验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 无模型与额度耗尽的未知调用仍前进，failMode=closed 也不代表所有未决都拒绝；[Q03](#research-q03) 识别范围和默认网络 observe 又限制安全承诺。必须保留宿主权限检查，并把未决、绕过与秘密规则遗漏纳入验收，不能据日志沉默判断安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅在一次性工作区以合成秘密评本地规则，保留宿主审批，明确 observe/enforce 差异。先核未知和绕过，不把少打断当安全；失败则恢复原baseURL与审批并核日志。

新增的是可跨兼容模型通道集中部署的组合，不能把成熟的 shell 解析、正则识别和继承的 Seatbelt／bubblewrap 当原创隔离算法。固定 README 自称早期版本，并明确模型 API 尚未公开、npm 包尚未发布；这是固定版本作者状态，不是本轮对在线服务的实时测量。能形成有限本地规则试用，不足以推荐替代宿主审批或无人值守处理所有动作。实际需求强度、误报与减少打断的收益尚未取得独立用户证据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献由固定源码支持，兼容、泄漏防护和降低人工打断均未由本轮运行验证；未来任务级未知汇总仅是假设。

- 已检查：作者 README、包清单、源码路径 README.md、benchmarks/leaderboard/RESULTS.md、cli/README.md、cli/package.json、cli/src/cli.ts、cli/src/decide.ts、cli/src/gateway.ts、cli/src/guard.ts、cli/src/policy.ts、cli/src/run.ts、cli/src/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓定向核查CLI／本地网关／规则／秘密guard／sandbox策略与公开评测口径；未全量审计所有integrations、规则库、AIRS服务和第三方sandbox实现。根类型infrastructure，不继承DSH子插件能力；仅source深度，无目标执行。
- 下一步：按[Q04](#research-q04)设计合成秘密、未知工具、额度耗尽、服务重启、直连和符号链接反例，再对原审批记录完成率／遗漏／时间；本轮均未执行，任何真实凭据前必须单独验收实际路径。

**分析版本**

- **仓库**：[openguardrails/openguardrails](https://github.com/openguardrails/openguardrails)
- **版本号**：未声明（[固定提交 01c65ef](https://github.com/openguardrails/openguardrails/tree/01c65ef12a44608f1e011382b98de21b7f81dca4)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 从明确 unjudged 语义推导任务级未知汇总与人工接管清单，可能减少未知被误当通过；它尚未实现或验证。用同任务双组比较未知遗漏、人工核对和完成率；若遗漏不降或总时间增则否定。

按[Q04](#research-q04)设计合成秘密、未知工具、额度耗尽、服务重启、直连和符号链接反例，再对原审批记录完成率／遗漏／时间；本轮均未执行，任何真实凭据前必须单独验收实际路径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 12047 | — | — | 101561 |
| .mjs | source | 11 | 5275 | 4357 | 861 | — |
| .ts | source | 58 | 12513 | 8418 | 3275 | — |
| .ts | test | 11 | 1287 | 1165 | 55 | — |
| .md | example | 3 | 265 | — | — | 1998 |
| .mjs | test | 24 | 5645 | 4567 | 720 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/openguardrails/openguardrails/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/openguardrails/openguardrails/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/openguardrails/openguardrails/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根 CLI 安全基础设施如何裁决调用、处理未知和保护秘密，限定可试用范围。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目向谁提供什么增量，与 Agent 审批及 DSH 插件有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目面向维护本机编码 Agent 的开发者：重复工具调用中，希望让明确只读或工作区内普通操作少打断，同时对危险动作提供拒绝原因和审计线索。合格结果不是“无人打断”，而是允许动作可继续、拒绝动作未交给工具、未知明确留给原宿主处理。简单基线是宿主逐次审批加 OS 权限；已有 sandbox 提供进程限制。该项目把本地规则、模型通道的秘密替换、工具调用裁决与进程观测组合为一个 CLI／本地服务，根真实类型为 infrastructure，DSH 适配子包不是根项目的原生导出。

新增的是可跨兼容模型通道集中部署的组合，不能把成熟的 shell 解析、正则识别和继承的 Seatbelt／bubblewrap 当原创隔离算法。固定 README 自称早期版本，并明确模型 API 尚未公开、npm 包尚未发布；这是固定版本作者状态，不是本轮对在线服务的实时测量。能形成有限本地规则试用，不足以推荐替代宿主审批或无人值守处理所有动作。实际需求强度、误报与减少打断的收益尚未取得独立用户证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-46](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/README.md#L15-L46)

作者描述规则、模型、秘密替换及 sandbox 的组合。

<details>
<summary>查看原文（32行）</summary>

````text
Most of what an agent does is safe, and a rule can tell. OpenGuardrails decides those actions on
your machine, with no network and no model. It sends only the ones a rule cannot decide to a model
built to judge agent actions, so you stop being asked, and it tells you when something is wrong.

```text
tool call -> local rules --- allow ------------------------------> runs
                         |-- deny ---------------------------------> refused
                         `-- cannot tell -> OpenGuardrails model
                                             |-- allow ------------> runs
                                             |-- unsafe -----------> refused, the agent is told why
                                             `-- your decision ----> the agent asks you
```

Unsafe and "your decision" are different things. A key on its way to an unknown host is a security
problem, and it is refused. Nobody is asked to rule on it. Buying this lipstick is safe, and it is
still your call.

- **Your keys stay home.** Secrets become placeholders before a request leaves your machine, side
  requests included, so the model provider and any relay never see them. A tool still gets the real
  value, and only after its call is allowed.
- **Local rules.** A strict shell parser, a read-only allowlist, workspace boundaries and a small
  list of things no agent should ever do. A command the parser does not fully understand is never
  allowed by a rule. Read them: [`cli/src/gate/gate.ts`](cli/src/gate/gate.ts),
  [`cli/src/decide.ts`](cli/src/decide.ts).
- **A refusal does not end the task.** The agent is told what was refused and what it may do
  instead, then carries on.
- **Sandbox and firewall.** `openguardrails run` starts an agent where it cannot read your
  credentials and every connection is recorded. It also reports hosts the agent reached but no tool
  call named.
- **You can see everything.** `openguardrails decisions` lists every decision, and
  `~/.openguardrails/model-requests.ndjson` holds exactly what was sent to the model.

````

</details>

**依据 2 · 作者声明**：[README.md:48-72](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/README.md#L48-L72)

作者明确早期状态、脚本实验、模型 API 未公开和 npm 未发布。

<details>
<summary>查看原文（25行）</summary>

````text

Early, and honest about it. Tested end to end against the real harnesses through the local gateway,
with no plugin, using the scripted models in [`cli/experiments`](cli/experiments):

| Agent | Rules and model enforced | Agent told why | Secrets kept from the model provider | Tool gets the real value |
|---|---|---|---|---|
| [Hermes](https://github.com/NousResearch/hermes-agent) 0.20 | yes | yes | yes | yes |
| [OpenClaw](https://github.com/openclaw/openclaw) 2026.6 | yes | yes | yes | yes |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 0.2 | yes | yes | yes | yes |

Not available yet:

- **The model API is not public yet.** It has been tested with the real model through all three agents, but
  is not deployed. Until then, what the rules cannot decide is reported as not judged and left to the
  agent's own permission check. The contract is in [`specification/model-api.md`](specification/model-api.md).
- **The package is not on npm yet.** Install from a checkout, below.
- Asking you on your phone. Until then, a decision that is yours comes back to you through the agent.

Known limits are listed in [`cli/README.md`](cli/README.md#what-it-does-not-do-yet).

## Try it

Needs Node 22.12 or newer.

```sh
````

</details>

**依据 3 · 源码核查**：[cli/package.json:1-19](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/package.json#L1-L19)

CLI bin 和固定 sandbox-runtime 依赖确立根形态。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "openguardrails",
  "version": "7.0.0",
  "description": "AI agent guardrails for every builder: local rules, a sandbox and a firewall for your agents, with the OpenGuardrails model for the calls rules cannot make.",
  "license": "Apache-2.0",
  "type": "module",
  "repository": { "type": "git", "url": "git+https://github.com/openguardrails/openguardrails.git", "directory": "cli" },
  "homepage": "https://openguardrails.com",
  "keywords": ["ai-agent", "guardrails", "agent-security", "claude-code", "codex", "sandbox", "firewall", "auto-mode"],
  "bin": { "openguardrails": "dist/src/cli.js", "ogr": "dist/src/cli.js" },
  "files": ["dist/src", "rules", "LICENSE", "README.md"],
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "build": "tsc && chmod +x dist/src/cli.js",
    "test": "npm run build && node --test \"dist/test/*.test.js\"",
    "prepublishOnly": "npm test"
  },
  "dependencies": { "@anthropic-ai/sandbox-runtime": "0.0.81" },
  "devDependencies": { "@types/node": "^22.0.0", "typescript": "^5.6.0" }
```

</details>

**依据 4 · 作者声明**：[cli/README.md:45-56](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/README.md#L45-L56)

网关与独立插件接入分离，DSH 插件加载存在已知兼容限制。

<details>
<summary>查看原文（12行）</summary>

```text
## Two ways to connect

**The gateway, recommended.** Point the agent's base URL at `http://127.0.0.1:4180/v1`. Every request
passes through it, whichever harness sent it. It holds your provider keys, masks secrets on the way
out and judges tool calls on the way back. With AIRS configured, AIRS does the masking and judging.

**A plugin**, from `integrations/agent/`, with `OGR_RUNTIME_URL=http://127.0.0.1:4180`. A refused call
reaches the agent as a failed tool call, so it carries on by itself. But a plugin sees only what its
harness shows it. Tested: on Hermes the request that names a session goes out unmasked, on OpenClaw
2026.6 no model traffic reaches the plugin's interceptor, and the DeepSeek Harness plugin does not load
on 0.2.0-rc.2. A plugin that fails to load can leave the agent running with no guard and one line of
warning.
```

</details>

#### 缺口

- 未有固定真实任务中的审批摩擦、漏判和误拒绝对照。
  **影响**：不能将少打断宣传等同生产可无人值守。
  **进一步探讨**：在可丢弃工作区固定任务与原审批策略比较，记录允许／拒绝／未知及人工复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从网关到裁决与拒绝反馈怎样接线，未决和失败是否一律拦截？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

CLI 将 serve 路由到本地服务，run 的 enforce 默认 false。网关创建 LocalRuntime；有 AIRS key 时改由 AIRS 负责 masking 和 judging，无 key 时创建 ModelChannelGuard。后者 outbound 先替换可识别秘密，再从历史和返回工具调用构造裁决。规则对 shell 调 gateCommand，对读写按工具名和路径识别；硬凭据或自身配置写入可直接 deny，普通工作区操作 allow，不理解的工具或敏感路径 judge。工作区判断是词法 resolve／前缀比较，相对路径排除 ..；它不是文件系统 realpath 或内核权限证明，不能当作对符号链接等执行行为的完整隔离。

judgeCalls 按序裁决。没有模型时 judge 动作记 unjudged 并继续交给宿主原权限检查；有模型的一般异常默认拒绝，但显式 failMode=open 或额度耗尽会回到 unjudged，后者另发额度通知。因此 closed 不能被概括成“一切未决皆阻断”。允许、block、needs_decision 三种模型结果独立；needs_decision 被转成拒绝与解释，不是该服务自行完成用户批准。

whole 响应把被拒绝工具调用删掉并追加原因，无剩余调用时结束本轮回复；流式失败则每个待判工具都拒绝。允许工具参数随后恢复秘密，无法恢复的旧占位符也被拒绝。它通过兼容模型协议移除调用，不是持有执行权限的可信调度器；绕过网关的模型／工具路径不受这一层裁决。JSON 解析失败原回复返回是另一个识别范围边界，不能宣称对任意协议都 fail-closed。AIRS 的 failMode 和本地模型 failMode 属于不同配置路径，不能混写。

#### 证据与依据

**依据 1 · 源码核查**：[cli/src/cli.ts:30-67](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/cli.ts#L30-L67)

run 默认观测模式与 serve 路由。

<details>
<summary>查看原文（38行）</summary>

```text

function parseRun(args: string[]) {
  const options = { enforce: false, allowLocalBinding: false, allowHosts: [] as string[], denyHosts: [] as string[], allowRead: [] as string[], allowWrite: [] as string[], command: [] as string[] };
  const lists: Record<string, string[]> = {
    "--allow-host": options.allowHosts,
    "--deny-host": options.denyHosts,
    "--allow-read": options.allowRead,
    "--allow-write": options.allowWrite,
  };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]!;
    if (arg === "--") {
      options.command = args.slice(i + 1);
      break;
    }
    if (arg === "--enforce") {
      options.enforce = true;
      continue;
    }
    if (arg === "--allow-local-bind") {
      options.allowLocalBinding = true;
      continue;
    }
    const list = lists[arg];
    const value = args[i + 1];
    if (!list || value === undefined) throw new Error(`unknown or incomplete option: ${arg}`);
    list.push(value);
    i += 1;
  }
  if (options.command.length === 0) throw new Error("nothing to run: openguardrails run -- <command...>");
  return options;
}

async function main(argv: string[]): Promise<number> {
  const [verb, ...rest] = argv;
  if (verb === "run") return run(parseRun(rest));
  if (verb === "serve") return serve();
  if (verb === "status") return status();
```

</details>

**依据 2 · 源码核查**：[cli/src/gateway.ts:126-137](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/gateway.ts#L126-L137)

AIRS key 与本地 guard 分路。

<details>
<summary>查看原文（12行）</summary>

```text
export function startGateway(config: Config): Promise<http.Server> {
  const gateway: Gateway = config.gateway ?? { upstreams: {} };
  const health = new Health(gateway.cooldownMs ?? 30_000);
  const connectTimeoutMs = gateway.connectTimeoutMs ?? 5_000;
  const firstByteTimeoutMs = gateway.firstByteTimeoutMs ?? 600_000;
  const airs = config.airs;
  const airsKey = airs ? secretOf(airs) : undefined;
  const failClosed = airs?.failMode === "closed";
  const requestTimeoutMs = airs?.requestTimeoutMs ?? 6_000;
  // With AIRS connected, AIRS judges and masks. Otherwise the local guard does.
  const localRuntime = new LocalRuntime(config);
  const guard = airsKey ? null : new ModelChannelGuard(localRuntime);
```

</details>

**依据 3 · 源码核查**：[cli/src/guard.ts:49-74](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/guard.ts#L49-L74)

mask、judgeCalls、占位符恢复失败与异常反馈接线。

<details>
<summary>查看原文（26行）</summary>

```text
  outbound(agentType: string, parsed: Record<string, any>): GuardedRequest {
    const map = this.mapFor(agentType);
    const { value: body } = maskRequest(parsed, map, this.rules);
    return { body, map, agentType, history: entriesFromMessages(body.messages ?? body.input) };
  }

  /** Every call answered. A failure inside must not become an allow: it fails to the rules' caller as a refusal. */
  private async refusals(request: GuardedRequest, calls: StreamCall[]): Promise<Refusals> {
    const refused: Refusals = new Map();
    if (calls.length === 0) return refused;
    const judged = await this.runtime.judgeCalls(calls, [...request.history], request.agentType, request.agentType);
    judged.forEach((answer, i) => {
      const call = calls[i]!;
      if (answer.refused) refused.set(call.path, answer.refused.notice);
    });
    // A placeholder nothing here can answer, after a restart for instance. Running with it would hand
    // a tool a word that looks like a value.
    for (const call of calls) {
      const [token] = restore(JSON.stringify(call.args), request.map).unresolved;
      if (token && !refused.has(call.path)) refused.set(call.path, UNRESTORABLE_NOTICE(token));
    }
    return refused;
  }

  whole(request: GuardedRequest, protocol: LlmProtocol, reply: string): Promise<string> {
    return this.renderWhole(request, protocol, reply).catch((error) => JSON.stringify({ error: { message: `openguardrails could not judge this reply: ${String(error)}`, type: "openguardrails_internal" } }));
```

</details>

**依据 4 · 源码核查**：[cli/src/decide.ts:29-60](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/decide.ts#L29-L60)

词法工作区与工具识别，未知交模型。

<details>
<summary>查看原文（32行）</summary>

```text
function inWorkspace(path: string, workspaces: readonly string[]): boolean {
  if (path.startsWith("~")) return false;
  if (!path.startsWith("/")) return !path.split("/").includes("..");
  const target = resolve(path);
  return workspaces.some((root) => target === resolve(root) || target.startsWith(resolve(root) + sep));
}

export function decideTool(call: ToolCallInput, options: DecideOptions = {}): GateDecision {
  const workspaces = options.workspaces ?? [];
  const kind = toolKind(call.name);
  if (kind === "internal") return { verdict: "allow", reason: "the agent's own bookkeeping" };

  if (kind === "shell") {
    const line = shellLine(call.args);
    if (!line) return { verdict: "judge", reason: "a shell tool with no readable command" };
    return gateCommand(line, { workspaces });
  }

  if (kind === "read" || kind === "search" || kind === "write") {
    const path = pathOf(call.args) ?? (kind === "search" ? "." : null);
    if (!path) return { verdict: "judge", reason: `${call.name} names no path` };
    if (/\.openguardrails(\/|$)/.test(path)) {
      return kind === "write" ? { verdict: "deny", reason: "changing OpenGuardrails' own configuration" } : { verdict: "judge", reason: "reading OpenGuardrails' own configuration" };
    }
    if (kind !== "search" && HARD_CREDENTIAL.test(path)) return { verdict: "deny", reason: "reading or changing a private key or cloud credential" };
    if (SENSITIVE_PATH.test(path)) return { verdict: "judge", reason: "a path where secrets live" };
    if (!inWorkspace(path, workspaces)) return { verdict: "judge", reason: "a path outside the workspace" };
    if (kind === "write" && PROTECTED_WRITE.test(path)) return { verdict: "judge", reason: "a file that runs later or changes the rules" };
    return { verdict: "allow", reason: kind === "write" ? "a change inside the workspace" : "a read inside the workspace" };
  }

  return { verdict: "judge", reason: `${call.name} is not a tool the rules understand` };
```

</details>

**依据 5 · 源码核查**：[cli/src/runtime.ts:124-176](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/runtime.ts#L124-L176)

无模型、额度、failOpen 和 block/needs_decision 分支。

<details>
<summary>查看原文（53行）</summary>

```text
  /** One answer per call, in order. `history` grows as the calls are judged. */
  async judgeCalls(calls: NormalCall[], history: TranscriptEntry[], agentType: string, session: string): Promise<CallAnswer[]> {
    const answers: CallAnswer[] = [];
    for (const call of calls) {
      const answer: CallAnswer = {};
      const refuse = (category: string, severity: Finding["severity"], detector: string, notice: string) => {
        answer.refused = { category, severity, detector, notice };
      };
      const local = decideTool(call, { workspaces: this.workspaces });
      const record = (layer: string, decision: string, reason: string, extra: Record<string, unknown> = {}) =>
        logDecision({ agent: agentType, tool: call.name, layer, decision, reason, ...extra });
      if (local.verdict === "allow") {
        record("rules", "allow", local.reason);
      } else if (local.verdict === "deny") {
        record("rules", "deny", local.reason);
        refuse("security.malicious_command", "critical", "local-rules", RULE_NOTICE(local.reason));
      } else if (!this.model) {
        // No model means no auto mode: the action goes on to the harness's own permission check,
        // and it is reported as not judged. Nothing here claims it was looked at.
        record("none", "unjudged", local.reason);
        answer.unjudged = true;
      } else {
        const transcript = buildTranscript(history, call);
        const request = { transcript, environment: { agent_type: agentType, workspaces: this.workspaces } };
        // Keyed on what would run, not on the tool's name: `terminal` and `bash` are one action.
        const key = `${session}\n${JSON.stringify(shellLine(call.args) ?? [call.name, call.args])}`;
        let judgement: Judgement | null = null;
        try {
          judgement = await this.judgeOnce(key, request);
        } catch (error) {
          const quota = error instanceof ModelUnavailable ? error.quota : undefined;
          record("model", quota || this.failOpen ? "unjudged" : "deny", String((error as Error).message), quota ? { claim_url: quota.claim_url } : {});
          // Someone who turned the model on is relying on it, so a passing failure must not switch it off.
          // A used-up quota is a known state with a person told about it, and it must not stop all work.
          if (!quota && !this.failOpen) refuse("x.ogr.unjudged", "low", "model", UNAVAILABLE_NOTICE);
          else answer.unjudged = true;
          if (quota && Date.now() - this.quotaToldAt > QUOTA_NOTICE_EVERY_MS) {
            this.quotaToldAt = Date.now();
            this.quotaPending = QUOTA_NOTICE(quota);
            process.stderr.write(`[openguardrails] ${this.quotaPending}\n`);
          }
        }
        if (judgement?.decision === "allow") {
          record("model", "allow", local.reason);
        } else if (judgement?.decision === "block") {
          const reason = judgement.reason ?? judgement.category ?? "the model judged this action unsafe";
          record("model", "block", reason, { category: judgement.category });
          refuse(judgement.category ?? "security.unsafe_action", judgement.severity ?? "high", "model", MODEL_NOTICE(reason));
        } else if (judgement?.decision === "needs_decision") {
          const reason = judgement.reason ?? "this is the user's decision";
          record("model", "needs_decision", reason);
          refuse("x.ogr.needs_decision", "low", "model", DECISION_NOTICE(reason));
        }
```

</details>

**依据 6 · 源码核查**：[cli/src/guard.ts:77-123](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/guard.ts#L77-L123)

非法 JSON 原样返回、删除拒绝调用与流式失败拒绝。

<details>
<summary>查看原文（47行）</summary>

```text
  private async renderWhole(request: GuardedRequest, protocol: LlmProtocol, reply: string): Promise<string> {
    let parsed: any;
    try {
      parsed = JSON.parse(reply);
    } catch {
      return reply;
    }
    const calls = callsIn(protocol, parsed);
    const refused = await this.refusals(request, calls);
    let out = reply;
    const told = this.runtime.takeQuotaNotice();
    const notice = [...new Set(refused.values()), ...(told ? [told] : [])].join(" ");
    if (notice) {
      if (protocol === "openai.chat") {
        const message = parsed.choices?.[0]?.message ?? {};
        message.tool_calls = (message.tool_calls ?? []).filter((_: unknown, i: number) => !refused.has(`payload.choices.0.message.tool_calls.${i}`));
        message.content = [message.content, notice].filter(Boolean).join("\n\n");
        if (message.tool_calls.length === 0) {
          delete message.tool_calls;
          parsed.choices[0].finish_reason = "stop";
        }
      } else if (protocol === "anthropic.messages") {
        parsed.content = (parsed.content ?? []).filter((_: unknown, i: number) => !refused.has(`payload.content.${i}`));
        parsed.content.push({ type: "text", text: notice });
        if (!parsed.content.some((block: any) => block.type === "tool_use")) parsed.stop_reason = "end_turn";
      } else {
        parsed.output = (parsed.output ?? []).filter((_: unknown, i: number) => !refused.has(`payload.output.${i}`));
        parsed.output.push({ type: "message", role: "assistant", content: [{ type: "output_text", text: notice }] });
      }
      out = JSON.stringify(parsed);
    }
    return restoreResponseBody(protocol, out, request.map)?.body ?? out;
  }

  stream(request: GuardedRequest, protocol: LlmProtocol, write: (text: string) => void) {
    return createStreamGuard({
      protocol,
      map: request.map,
      write,
      notice: () => this.runtime.takeQuotaNotice(),
      judge: (calls) =>
        this.refusals(request, calls).catch((error) => {
          // No answer is not an allow: every call is refused, and the agent is told it was a fault.
          const notice = `This action was NOT executed: openguardrails failed while judging it (${String(error)}). Tell the user.`;
          return new Map(calls.map((call) => [call.path, notice]));
        }),
    });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 秘密与 sandbox 保护边界、接入与全周期负担是否允许小范围试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可让愿意维护 Node 与本地代理的开发者在一次性目录中试用规则／审计，不交真实凭据、不关闭宿主原审批。Node 要求 22.12+，sandbox-runtime 固定 0.0.81；macOS 继承 Seatbelt 并需 ripgrep，Linux 需 bubblewrap／seccomp、socat、ripgrep，Windows 作者未测。网关须与上游使用相同协议，不提供协议转换；固定材料只声称 OpenAI Chat 在真实 harness 验过，不能推广全部协议和版本。

秘密识别只覆盖规则识别出的形态，未识别秘密仍可出站。映射按 agentType 放内存，每 agent 共享映射而非强租户边界，服务重启丢失，最多保留4096值；旧占位符无法恢复会拒绝，恢复需重新提供任务数据而非直接重放旧调用。run 的文件 denyRead 是已列凭据路径与 cwd 下 .env，未列路径仍可读，写入包括工作区、临时目录和多种 Agent 状态目录，不是只读沙箱。不能据“keys stay home”承诺任意秘密全覆盖。

网络代理 filterRequest 实际返回 allow 并记录观察；未允许目标由 ask 回调处理，默认 observe 放行非本机目标，enforce 才拒绝未知 host，本机／元数据另拒绝。局域网并非全在禁止列表。run 删除配置识别的 key 环境变量再启动子进程，但不能推论清空所有环境秘密。缺 sandbox 依赖返回127，不静默以普通进程运行。首次要配上游／权限／端口和路径，持续要核 unjudged、日志、规则误判和宿主版本；现金包含上游推理和可能的裁决服务，当前材料不能给可靠单价，工时亦未测。停用需恢复原 baseURL 并停服务、核日志和本地配置保留；不能把卸载等同擦除历史秘密映射或模型请求日志。

#### 证据与依据

**依据 1 · 源码核查**：[cli/package.json:12-19](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/package.json#L12-L19)

Node 与 pinned sandbox-runtime 依赖。

```text
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "build": "tsc && chmod +x dist/src/cli.js",
    "test": "npm run build && node --test \"dist/test/*.test.js\"",
    "prepublishOnly": "npm test"
  },
  "dependencies": { "@anthropic-ai/sandbox-runtime": "0.0.81" },
  "devDependencies": { "@types/node": "^22.0.0", "typescript": "^5.6.0" }
```

**依据 2 · 作者声明**：[cli/README.md:58-89](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/README.md#L58-L89)

作者公开恢复、识别、绕过、协议与平台限制。

<details>
<summary>查看原文（32行）</summary>

```text
## What it does not do yet

- **A refused step can end the agent's turn.** Through the gateway, a refused call is removed from the
  reply and the reason added to its text. If no call survives, the turn ends with that reason, for
  the person to read. It does not end the session. If another call survives, the task goes on.
- A rule reads one action. The model sees the whole session, but only for the actions that reach it.
- With no model connected, what the rules cannot decide proceeds unjudged, subject to the agent's own
  permission check. It is logged as `unjudged`. The same goes for a used-up quota, and the person is told
  once a day.
- Once connected, a model that cannot answer means the action is refused, and the agent is told it may
  retry. Set `"failMode": "open"` under `model` to let such actions through instead.
- **Placeholders do not survive a restart of the service.** A model that reuses one from before gets
  that call refused, with an explanation, and no tool sees the placeholder.
- A secret the rules do not recognize is not masked. Prose in a reply keeps its placeholders, on
  purpose: only a tool gets the real value.
- The gateway sees what is sent to it. An agent or a tool that calls a provider directly goes around it.
  `openguardrails run` forces the network through this machine's proxy and records that traffic.
- Only OpenAI Chat is tested against real harnesses. Anthropic Messages streaming is tested against a
  stand-in. On OpenAI Responses a refusal in a stream retracts the whole step.
- `openguardrails run` hides this tool's own configuration from the sandbox, so a plugin inside it
  cannot read a key from there. Pass the local service's address to the plugin instead.

## Sandbox and gateway

`openguardrails run` uses [`@anthropic-ai/sandbox-runtime`](https://github.com/anthropics/sandbox-runtime):
Seatbelt on macOS, bubblewrap and seccomp on Linux. It is a beta, so the version is pinned, and its
stated limits apply. macOS also needs `ripgrep`. Linux needs `bubblewrap`, `socat` and `ripgrep`.
Windows is untested.

The gateway also fails over between model APIs, for OpenAI Chat, OpenAI
Responses and Anthropic Messages. It does not translate protocols, so the members of a route must
speak the protocol their client speaks.
```

</details>

**依据 3 · 源码核查**：[cli/src/guard.ts:21-52](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/guard.ts#L21-L52)

4096 上界、按 agentType 映射与 mask。

<details>
<summary>查看原文（32行）</summary>

```text
const FIRST_TOKEN = 5_000_000;
/** A value past this is masked for good: it cannot be restored. Better than a value that leaves. */
const MAX_VALUES = 4096;

export interface GuardedRequest {
  body: Record<string, any>;
  map: SessionMap;
  history: TranscriptEntry[];
  agentType: string;
}

export class ModelChannelGuard {
  private readonly maps = new Map<string, SessionMap>();
  private counter = FIRST_TOKEN;
  private readonly rules: CompiledRuleset = compiledRules();

  constructor(private readonly runtime: LocalRuntime) {}

  /** One map per agent, so a value keeps its placeholder across every conversation. */
  private mapFor(agentType: string): SessionMap {
    let map = this.maps.get(agentType);
    if (!map) {
      map = new SessionMap(agentType, { bound: MAX_VALUES, allocate: () => ++this.counter });
      this.maps.set(agentType, map);
    }
    return map;
  }

  outbound(agentType: string, parsed: Record<string, any>): GuardedRequest {
    const map = this.mapFor(agentType);
    const { value: body } = maskRequest(parsed, map, this.rules);
    return { body, map, agentType, history: entriesFromMessages(body.messages ?? body.input) };
```

</details>

**依据 4 · 源码核查**：[cli/src/policy.ts:16-28](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/policy.ts#L16-L28)

凭据 denyRead 为列举而非全盘隔离。

<details>
<summary>查看原文（13行）</summary>

```text
/** Where credentials live. A starting point rather than a boundary: an unlisted path stays readable. */
const CREDENTIAL_PATHS = [
  // Its own keys, and shell startup files, where people export theirs.
  ".openguardrails", ".zshrc", ".zshenv", ".zprofile", ".bashrc", ".bash_profile", ".profile",
  ".ssh", ".aws", ".azure", ".oci", ".kube", ".gnupg", ".config/gcloud", ".config/gh",
  ".docker/config.json", ".netrc", ".npmrc", ".pypirc", ".pgpass", ".git-credentials", ".boto", ".my.cnf",
];

/** Where the agents this is built for keep their own state; without these they fail to start. */
const AGENT_STATE_PATHS = [
  ".claude", ".claude.json", ".codex", ".gemini", ".pi", ".dsh", ".hermes", ".openclaw", ".aider",
  ".config/opencode", ".local/share/opencode", ".local/state", ".cache", ".npm", ".bun", "Library/Caches",
];
```

</details>

**依据 5 · 源码核查**：[cli/src/policy.ts:39-84](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/policy.ts#L39-L84)

本机识别、读写和允许目标策略。

<details>
<summary>查看原文（46行）</summary>

```text
/**
 * This machine and the cloud metadata endpoints: what a poisoned model probes first, and never a
 * destination an agent found by itself. Allow one by name with --allow-host. Private LAN ranges
 * are not on this list, because intranet services are ordinary work.
 */
export function isLocalTarget(host: string): boolean {
  const name = host.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  if (name === "localhost" || name.endsWith(".localhost")) return true;
  if (name === "::1" || name === "::" || name.startsWith("fe80:") || name.startsWith("fd00:ec2:")) return true;
  if (name.startsWith("::ffff:")) return isLocalTarget(name.slice(7));
  return /^(127|0|169\.254)\.[\d.]+$/.test(name) || ["100.100.100.200", "168.63.129.16", "192.0.0.192", "metadata.google.internal"].includes(name);
}

/**
 * Opens one loopback port on macOS. Agents commonly refuse to proxy loopback addresses (dsh does,
 * by design), so the gateway must be reachable directly, and sandbox-runtime's only switch for
 * that opens every local port, browser debugging ports included.
 */
export function openLoopbackPort(wrapped: string, port: number): string {
  const rule = /\(allow network-outbound \(remote ip "localhost:\d+"\)\)/;
  if (!rule.test(wrapped)) throw new Error("this sandbox-runtime version has an unexpected profile; openguardrails cannot open the gateway port");
  return wrapped.replace(rule, (match) => `${match}\n(allow network-outbound (remote ip "localhost:${port}"))`);
}

export function buildPolicy(options: PolicyOptions): SandboxRuntimeConfig {
  const home = homedir();
  const inHome = (path: string) => join(home, path);
  return {
    network: {
      // Empty on purpose: every other host reaches the ask callback, which is where a run in
      // observe mode lets it through and writes it down.
      allowedDomains: options.allowHosts,
      deniedDomains: options.denyHosts,
      ...(options.allowLocalBinding ? { allowLocalBinding: true } : {}),
    },
    filesystem: {
      denyRead: [
        ...CREDENTIAL_PATHS.map(inHome),
        join(options.cwd, "**/.env"),
        join(options.cwd, "**/.env.*"),
      ],
      allowRead: options.allowRead,
      allowWrite: [options.cwd, real(tmpdir()), real("/tmp"), ...AGENT_STATE_PATHS.map(inHome), ...options.allowWrite],
      denyWrite: [],
    },
  };
```

</details>

**依据 6 · 源码核查**：[cli/src/run.ts:130-175](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/run.ts#L130-L175)

filterRequest 放行记录、依赖失败127与 observe/enforce 分别。

<details>
<summary>查看原文（46行）</summary>

```text
  const filterRequest: FilterRequestCallback = async (request, info) => {
    const url = new URL(request.url);
    const host = info?.target?.host ?? url.hostname;
    const bytes = Number(request.headers.get("content-length") ?? 0);
    const protocol = classifyModelRequest(request.method, url.pathname);
    const ownTraffic = ownPort !== null && host === "127.0.0.1" && info?.target?.port === ownPort;
    if (!protocol && !ownTraffic) outbox.push({ t: Date.now(), kind: "network", target: `${host}:${info?.target?.port ?? (url.protocol === "https:" ? 443 : 80)}`, action: request.method, ...(bytes ? { bytes } : {}) });
    if (protocol) {
      correlator.noteModelHost(host);
      void readModelRequest(request, host, protocol, ownPort !== null && host === "127.0.0.1" && info?.target?.port === ownPort);
    } else {
      correlator.noteConnection(host, request.method, bytes, Date.now());
      recorder.write("request", { method: request.method, host, path: safePath(url.pathname), bytes });
    }
    return { action: "allow" };
  };

  const config: SandboxRuntimeConfig = {
    ...buildPolicy({
      cwd: process.cwd(),
      allowHosts: [
        ...options.allowHosts,
        ...(settings.sandbox?.allowHosts ?? []),
        ...(ownPort !== null ? [`127.0.0.1:${ownPort}`] : []),
      ],
      denyHosts: [...options.denyHosts, ...(settings.sandbox?.denyHosts ?? [])],
      allowRead: [...options.allowRead, ...(settings.sandbox?.allowRead ?? [])],
      allowWrite: [...options.allowWrite, ...(settings.sandbox?.allowWrite ?? [])],
      allowLocalBinding: options.allowLocalBinding || settings.sandbox?.allowLocalBinding === true,
    }),
  };
  config.network = { ...config.network, tlsTerminate: {}, filterRequest } as typeof config.network;

  const deps = SandboxManager.checkDependencies();
  if (deps.errors.length > 0) {
    process.stderr.write(`[openguardrails] cannot start: ${deps.errors.join("; ")}\n`);
    return 127;
  }

  const ask = async ({ host, port }: { host: string; port?: number | undefined }) => {
    const local = isLocalTarget(host);
    recorder.write("connect", { host, port, allowed: !options.enforce && !local });
    if (local || options.enforce) outbox.push({ t: Date.now(), kind: "network", target: `${host}:${port}`, denied: true });
    if (local) return { allow: false as const, reason: `openguardrails: ${host} is this machine or a metadata endpoint. Allow it with --allow-host ${host}:${port}` };
    if (!options.enforce) return true;
    return { allow: false as const, reason: `openguardrails: ${host} is not allowed. Add it with --allow-host ${host}` };
```

</details>

**依据 7 · 源码核查**：[cli/src/run.ts:194-211](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/run.ts#L194-L211)

包裹子进程及仅删除识别的 key 环境变量。

<details>
<summary>查看原文（18行）</summary>

```text
  recorder.write("start", { mode: options.enforce ? "enforce" : "observe", command: options.command[0], run: runId });
  // sandbox-runtime exempts loopback and private ranges from the proxy, and those clients then fail
  // inside the sandbox. A local vLLM is what this tool exists to see, so everything goes through it.
  // NODE_USE_ENV_PROXY makes Node's own fetch honour the proxy; the pinned release does not set it.
  let wrapped = await SandboxManager.wrapWithSandbox(`NO_PROXY= no_proxy= NODE_USE_ENV_PROXY=1 ${command}`, undefined, undefined, undefined, {
    commandId: runId,
    commandText: command,
  });
  if (ownPort !== null && process.platform === "darwin") wrapped = openLoopbackPort(wrapped, ownPort);
  const childEnv = { ...process.env };
  for (const name of keyEnvNames(settings)) delete childEnv[name];
  const child = spawn(wrapped, { shell: true, stdio: "inherit", env: childEnv });
  for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => child.kill(signal));
  await syncGateway();
  const syncTimer = setInterval(() => void syncGateway().then(() => flush()), 15_000);
  const code = await new Promise<number>((resolve) => {
    child.on("error", () => resolve(127));
    child.on("exit", (exitCode, signal) => resolve(exitCode ?? (signal ? 128 : 1)));
```

</details>

#### 缺口

- 本机 sandbox、代理协议、目标宿主版本及真实秘密识别未运行验收。
  **影响**：本轮不能证明不绕过、不泄漏或故障后的状态完整。
  **进一步探讨**：由父许可后的隔离试验用合成秘密、符号链接、直连与重启反例验证，并检查原审批始终有效。
- 裁决服务实时开放、价格、日志留存和总体工时未验证。
  **影响**：现金和维护收益不能定量。
  **进一步探讨**：采用前单独核对服务条款并以少量非敏感任务计总成本，不把未知填0。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 公开结果可支持何种效果判断，下一项假设怎样被推翻？

**研究主题**：新假设与验证

#### 完整回答

根 README 的真实 harness 实验是作者声称；cli README 说明多数实验以 scripted model／judge 执行，live 模式另需真实 Model API，不能把表中的 yes 当独立生产验证。seed-v0 排行表明确只有 reference detectors，OpenGuardrails 自身没有提交 detector；0.641 Macro F1 和极短 P95 不是当前 CLI 或在线安全模型的实测效能。mandate／grounding 的1.000也限定为各自合成世界与责任范围，不能转为通用安全保证。

本轮只读固定代码，没有运行任何目标、真实模型或宿主。由 Q02 的 unjudged 分支可推导一个未验证假设：将“未知动作占比、宿主回退和原因”作为任务办结的可见清单，可能比只列拒绝事件更能减少用户误把沉默当通过。相对现有 decisions 记录的增量是任务级汇总与验收责任，尚未实现，不能计入已有能力或创新分。最小试验为两组同任务、合成秘密与明确危险／未知调用，对比原日志和任务汇总；统计漏处理未知、人工审批次数、误拒绝、任务完成率和总时间。若汇总不降低未知遗漏，或新增核对时间抵消收益，即否定该假设；不以放行更多作为成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-62](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/README.md#L48-L62)

作者实验与模型开放状态。

<details>
<summary>查看原文（15行）</summary>

```text

Early, and honest about it. Tested end to end against the real harnesses through the local gateway,
with no plugin, using the scripted models in [`cli/experiments`](cli/experiments):

| Agent | Rules and model enforced | Agent told why | Secrets kept from the model provider | Tool gets the real value |
|---|---|---|---|---|
| [Hermes](https://github.com/NousResearch/hermes-agent) 0.20 | yes | yes | yes | yes |
| [OpenClaw](https://github.com/openclaw/openclaw) 2026.6 | yes | yes | yes | yes |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 0.2 | yes | yes | yes | yes |

Not available yet:

- **The model API is not public yet.** It has been tested with the real model through all three agents, but
  is not deployed. Until then, what the rules cannot decide is reported as not judged and left to the
  agent's own permission check. The contract is in [`specification/model-api.md`](specification/model-api.md).
```

</details>

**依据 2 · 作者声明**：[cli/README.md:91-104](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/README.md#L91-L104)

实验模式与规则快照公开范围。

<details>
<summary>查看原文（14行）</summary>

````text
## Experiments

```sh
npm run build
experiments/run.sh <hermes|openclaw|dsh> <empty-lab-dir> [gateway|live|judge|nomodel]
```

Runs the real harness in a throwaway home, against a scripted model and a scripted model API: through
the gateway with `gateway`, through the gateway and a real Model API at `$MODEL_API_URL` with `live`, or
with its plugin otherwise. Files in the work directory prove what really ran. The harness must already be installed.

The secret rules in `rules/secrets.json` are a snapshot of what OpenGuardrails AIRS serves. Every rule
carries examples, and the tests fail if one stops passing them. Examples shaped like a real issuer's key
are left out of this public file and assembled in the tests instead.
````

</details>

**依据 3 · 作者声明**：[benchmarks/leaderboard/RESULTS.md:1-18](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/benchmarks/leaderboard/RESULTS.md#L1-L18)

reference detector、seed suite 和独立 mandate 口径。

<details>
<summary>查看原文（18行）</summary>

```text
# OGR seed benchmark — results (`seed-v0`)

Reference detectors only. Third-party vendors appear when they submit a conformant detector. OpenGuardrails does not submit a detector.

| Detector | Type | prompt injection F1 | malicious command F1 | data exfiltration F1 | secret leak F1 | Macro F1 | P95 ms |
|---|---|---|---|---|---|---|---|
| ogr-compose (config⊕llm) | hybrid | 0.900 | 0.800 | 0.462 | 0.400 | **0.641** | 0.003 |
| keyword-baseline | config | 0.421 | 0.769 | 0.667 | 0.588 | **0.611** | 0.007 |
| block-all | baseline | 0.611 | 0.632 | 0.588 | 0.533 | **0.591** | 0.000 |
| config-rules | config | 0.429 | 0.800 | 0.333 | 0.400 | **0.491** | 0.004 |
| llm-judge | model | 0.900 | 0.286 | 0.333 | 0.000 | **0.380** | 0.003 |
| allow-all | baseline | 0.000 | 0.000 | 0.000 | 0.000 | **0.000** | 0.000 |

Suite sizes (unsafe / shared safe): prompt injection 11/14, malicious command 12/14, data exfiltration 10/14, secret leak 8/14

## Mandate scoring (the authorization envelope)

Scored SEPARATELY from the leaderboard above: a mandate is runtime configuration, not a submitted detector. Each corpus is judged by the mandate that governs its agent ([specification/mandate.md](../../specification/mandate.md)). Precision/recall are over the cases a mandate OWNS (`security.mandate_violation.*`) against the compliant controls; **dimension** is how often the right envelope dimension was named; **lane** is how often the mandate correctly abstained on cases another detector owns (injection, secret leak, manipulation, MNPI, raw exec).
```

</details>

**依据 4 · 作者声明**：[benchmarks/leaderboard/RESULTS.md:27-36](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/benchmarks/leaderboard/RESULTS.md#L27-L36)

grounding 合成世界／provider outage 和保留 judge。

<details>
<summary>查看原文（10行）</summary>

```text
## Grounding scoring (the evidence envelope)

Scored SEPARATELY from the leaderboard above: a grounding profile is runtime configuration plus a record provider, not a submitted detector ([specification/grounding.md](../../specification/grounding.md)). Each corpus is judged by the profile that governs its agent against a FROZEN synthetic record world. Precision/recall are over the cases a profile OWNS (`safety.hallucination.{citation,attribute}`, `safety.unsafe_advice.{overreach,evidence_gap,jurisdiction,temporal}`) against the compliant controls; **leaf** is how often exactly the right leaves were named; **lane** is how often it abstained on cases another detector owns; **unjudged** is how often a provider outage was confessed as `unjudged` rather than fired on or passed silently; **judge** counts the fixtures reserved for a model judge (`safety.hallucination.unsupported` and the like), which the structural reference does not score.

| Profile | P | R | F1 | Leaf | Lane (n) | Unjudged (n) | Judge (n) |
|---|---|---|---|---|---|---|---|
| grounding_ip.profile.json | 1.000 | 1.000 | **1.000** | 1.000 | 1.000 (3) | 1.000 (1) | 3 |
| grounding_life_sciences.profile.json | 1.000 | 1.000 | **1.000** | 1.000 | 1.000 (3) | 1.000 (1) | 2 |

Macro-F1 across profiles: **1.000**.
```

</details>

**依据 5 · 源码核查**：[cli/src/runtime.ts:140-164](https://github.com/openguardrails/openguardrails/blob/01c65ef12a44608f1e011382b98de21b7f81dca4/cli/src/runtime.ts#L140-L164)

未知与额度回退是任务级责任汇总假设的来源。

<details>
<summary>查看原文（25行）</summary>

```text
      } else if (!this.model) {
        // No model means no auto mode: the action goes on to the harness's own permission check,
        // and it is reported as not judged. Nothing here claims it was looked at.
        record("none", "unjudged", local.reason);
        answer.unjudged = true;
      } else {
        const transcript = buildTranscript(history, call);
        const request = { transcript, environment: { agent_type: agentType, workspaces: this.workspaces } };
        // Keyed on what would run, not on the tool's name: `terminal` and `bash` are one action.
        const key = `${session}\n${JSON.stringify(shellLine(call.args) ?? [call.name, call.args])}`;
        let judgement: Judgement | null = null;
        try {
          judgement = await this.judgeOnce(key, request);
        } catch (error) {
          const quota = error instanceof ModelUnavailable ? error.quota : undefined;
          record("model", quota || this.failOpen ? "unjudged" : "deny", String((error as Error).message), quota ? { claim_url: quota.claim_url } : {});
          // Someone who turned the model on is relying on it, so a passing failure must not switch it off.
          // A used-up quota is a known state with a person told about it, and it must not stop all work.
          if (!quota && !this.failOpen) refuse("x.ogr.unjudged", "low", "model", UNAVAILABLE_NOTICE);
          else answer.unjudged = true;
          if (quota && Date.now() - this.quotaToldAt > QUOTA_NOTICE_EVERY_MS) {
            this.quotaToldAt = Date.now();
            this.quotaPending = QUOTA_NOTICE(quota);
            process.stderr.write(`[openguardrails] ${this.quotaPending}\n`);
          }
```

</details>

#### 缺口

- 任务级未知汇总是否改善用户理解未试验。
  **影响**：只能作为未来可证伪方向。
  **进一步探讨**：实施上文双组实验，若遗漏不降或总体投入增则放弃。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
