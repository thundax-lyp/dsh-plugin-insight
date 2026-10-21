# Almost Full Access

> 为 DSH Shell 执行增加规则/模型审查和人工审批的中间权限模式。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[269ab86](https://github.com/Alnita-M/dsh-Almost_Full_Access/tree/269ab865fd02a4dded171eaecc40b1255f5df227)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 820](https://img.shields.io/static/v1?label=npm+30d&message=820&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-almost-full-access)
<!-- END META -->

**使用建议**：仅在可接受启发式审查且能核对上下文时评估；不要以“Almost”名称当越过沙箱的安全许可，跨工作区缓存应先解决。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [跨插件比较与设计假设（未验证）](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：操作者希望普通操作少打断、不可逆/系统操作仍需确认；合格交付必须是在正确会话、目录和权限上下文对具体命令作决定。

- **建议**：将决定键绑定会话、规范cwd/workspace、工具和脚本内容摘要，并在环境/内容改变时失效，可能减少同文本异副作用的复用。两个工作区同名脚本一安全一写系统路径，交替执行并更改脚本内容，要求重新审查；若缓存仍命中则否定上下文绑定。

仅在可接受启发式审查且能核对上下文时评估；不要以“Almost”名称当越过沙箱的安全许可，跨工作区缓存应先解决。

核查状态：门控/降级/审批机制源码可确认；命令安全覆盖、真实宿主与隔离未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

workspace-write、full access或每次人工批准；本项增加中间风险策略但不具全工具OS隔离。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：afaccess_status诊断门控状态。
- **事件监听**：tools/pre-execute按preset审查指定shell工具。
- **Host 路由**：审批queue/decide桥。
- **界面**：风险审批面板。

**流程与依赖**

仅almost-full-access preset下拦指定shell工具pre-execute，先analyzeCommand确定性规则，模糊命令再交子代理审查；风险进入UUID审批队列，client或文本问题决定，超时/abort拒绝。命令哈希用于五分钟LLM结果缓存及记住决定，审计写DSH_HOME。

DSH tools/subagents/userQuestions/permissionPresets/sandboxPolicy/webServer/sessions与可写home；审查provider从现有子代理中选择。

shell调用→核preset/工具名→规则→必要模型→缓存/人工审批→允许才next；拒绝/abort不下游执行，面板失联转文本卡。

DSH preset patch和Host/client组合，安装器可能改多个profile；仅指定preset启用，不能把包CLI当DSH命令。

**效果与成本**

现金是模糊命令审查模型调用；人工包括风险审批、误报/漏报与缓存失效管理，审计脱敏是规则覆盖而非保密保证。

可减少低风险打断并明确高风险人工决定；无同条件打断率、安全覆盖或误判数据。

- **思考**：同命令是否在不同上下文仍同风险？llmVerdictCache与remembered均以commandHash为键，未含session/workspace/workdir；同一相对脚本命令在另项目指向不同文件，缓存safe或记住批准可能跨场景复用。规则判风险可先拦，但仅模糊分支复用仍缺上下文。并且非列名工具、工具内执行与审查子代理不在同一门控保证内。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把高频可逆动作和系统风险分层，确定性风险不能被LLM降成safe，审查失败转人工、abort拒绝，比完全依靠提示审命令有明确控制路径。增量是权限中间策略，仍是工具名和文本启发式，不能替代OS沙箱。

把高频可逆动作和系统风险分层，确定性风险不能被LLM降成safe，审查失败转人工、abort拒绝，比完全依靠提示审命令有明确控制路径。增量是权限中间策略，仍是工具名和文本启发式，不能替代OS沙箱。

UUID审批、服务端绑定commandHash、决定GC、超时与abort拒绝、审计异步追加有明确实现；状态Map作用域与文案“本会话记住”不一致需修正。

固定源码依据：[lib/index.js](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js)、[lib/analyze.js](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/analyze.js)、[cordis.patch.yml](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/cordis.patch.yml)、[package.json](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/package.json)。

<a id="detail-section-5"></a>

### 主要限制

同命令是否在不同上下文仍同风险？llmVerdictCache与remembered均以commandHash为键，未含session/workspace/workdir；同一相对脚本命令在另项目指向不同文件，缓存safe或记住批准可能跨场景复用。规则判风险可先拦，但仅模糊分支复用仍缺上下文。并且非列名工具、工具内执行与审查子代理不在同一门控保证内。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：1.2.0；版本日期：2026-10-14（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[269ab865](https://github.com/Alnita-M/dsh-Almost_Full_Access/tree/269ab865fd02a4dded171eaecc40b1255f5df227)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host pre-execute/审批/缓存、analyze规则及README，未执行Shell或审查模型、不完整审计全部命令语法。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

### 跨插件比较与设计假设（未验证）

跨插件比较：本项批准/审查缓存以命令文本为键；dsh-llm-balance-siderbar以probe聚合并取首个匹配账户；zcode-usage-stats把磁盘缓存固定在web profile；dsh-plugin-balance组合浏览器给出的目标和服务端凭据。问题分别发生在权限决定、账户额度、历史范围及凭据目的地，不能用同一种“缓存优化”解决。由此提出未验证假设：为每种操作声明所需的上下文身份（会话、规范工作区、route与非秘密账户指纹、目标origin、采样时间/口径），身份变化即使结果失效，身份缺失不默默套用旧值。用同文本异脚本、双profile/双账户和伪造目标样例要求不误批、不混数、不误发凭据，并测额外维护负担；目前没有运行证据。

[AlienGene/dsh-llm-balance-siderbar固定源码](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts)、[Amer-CN/zcode-usage-stats固定源码](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs)、[Andrew111888/dsh-plugin-balance固定源码](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js)。

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

将决定键绑定会话、规范cwd/workspace、工具和脚本内容摘要，并在环境/内容改变时失效，可能减少同文本异副作用的复用。两个工作区同名脚本一安全一写系统路径，交替执行并更改脚本内容，要求重新审查；若缓存仍命中则否定上下文绑定。

未执行；拟用同命令不同cwd/脚本内容、审查失败/取消、非门控工具和面板缺失样例，分别测决策归属与实际副作用。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 390 | — | — | 4770 |
| .js | source | 3 | 1255 | 1052 | 154 | — |
| .mjs | source | 3 | 1098 | 881 | 137 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues?q=is%3Aissue+created%3A2026-09-21T08%3A01%3A03.040Z..2026-10-21T08%3A01%3A03.040Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A01%3A03.040Z..2026-10-21T08%3A01%3A03.040Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
