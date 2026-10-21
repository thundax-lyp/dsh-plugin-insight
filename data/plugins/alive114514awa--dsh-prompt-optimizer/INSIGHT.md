# prompt-optimizer

> 用当前 Harness 模型或 Codex 澄清、改写提示词，预览后填回草稿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0f6d8d4](https://github.com/ALIve114514awa/dsh-prompt-optimizer/tree/0f6d8d42bc3418c78153ad56968117f9c38c3d42)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer) · [![npm 30d 1554](https://img.shields.io/static/v1?label=npm+30d&message=1%2C554&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer)
<!-- END META -->

**使用建议**：需要先整理需求且愿意审阅改写者可列为候选；直接明确的小任务收益有限，TUI应用回执不能当作已落地保证。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：用户需求尚模糊，需要在发给执行Agent前澄清目标、扩写或精简；交付物是用户可编辑的提示草稿，不自动执行任务。

- **建议**：在预览中逐条标注“用户已给事实/澄清答案/模型新增假设”，可能比单纯润色降低需求偷换。对相同模糊需求盲测原稿和标注稿，统计未授权新增约束与下游返工；若只是更长却没有降低新增假设错误，则否定收益。

需要先整理需求且愿意审阅改写者可列为候选；直接明确的小任务收益有限，TUI应用回执不能当作已落地保证。

核查状态：澄清/预览/应用保护与取消机制源码支持；提示质量、下游成功率及真实TUI追加效果未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

在普通会话让模型改写再手动复制即可；本项增加独立预览、上下文选择与版本化回填。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：status/optimize/cancel三项connection RPC。
- **用户命令**：TUI /prompt-optimize打开优化scene。
- **界面**：Web独立预览编辑页与TUI交互scene，用户确认草稿回填。

**流程与依赖**

Host提供status/optimize/cancel RPC，读取可选最近已完成一轮，调用当前模型或现有Codex子代理provider。RequestRegistry绑定请求与会话、限4并发并传播取消/超时；Web记录session、draftRev与附件状态，在应用前双重核验；TUI以scene及/prompt-optimize提供预览与二次确认追加。

DSH sessionController/模型路由/connection，Web input版本接口；Codex需另装兼容provider与原生登录；TUI scene与追加接口。

选会话→填需求/带入草稿→可选澄清与最近完成上下文→生成→人工编辑→核对会话版本后回填→用户另行发送；取消不自动重试。

Web/桌面与TUI为不同发行包、同profile只选一个；兼容固定DSH/TUI版本需与实际runtime核对，不能由仓库check脚本推定已验收。

**效果与成本**

现金：澄清和生成额外模型/订阅调用；人工：编辑、判断保真与回填确认，切换后重生成与取消失败也需处理。

把改写结果留给人确认并避免Web旧结果覆盖新草稿；尚无证据证明提高下游质量或降低总token。

- **思考**：优化后的文本是否更忠实而非擅自补需求？结构化解析与预览不能保证目标不漂移，也缺同条件下游任务实验。Web有draftRev保护，但TUI公开追加无回执，README承认已有原稿保留未完成实测；“已写出”不能认定草稿已落地。Codex取消仍依赖provider的实际清理语义。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相较直接让执行Agent边澄清边修改，把需求改写放在独立可编辑阶段，并在Web草稿回填时用版本校验避免覆盖新输入。增量在于人确认的交接协议与并发保护，而不是新的提示优化算法；模型能力复用宿主和外部provider。

相较直接让执行Agent边澄清边修改，把需求改写放在独立可编辑阶段，并在Web草稿回填时用版本校验避免覆盖新输入。增量在于人确认的交接协议与并发保护，而不是新的提示优化算法；模型能力复用宿主和外部provider。

RequestRegistry对取消先于开始保留有界墓碑，finally清理超时和监听；Web以captureInsertion再次检查版本；Codex显式使用现有provider而不偷偷CLI回退。

固定源码依据：[src/server/index.ts](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/index.ts)、[src/server/requests.ts](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/requests.ts)、[src/server/codex.ts](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/server/codex.ts)、[src/client/state.ts](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/client/state.ts)、[src/client/PromptOptimizer.tsx](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/client/PromptOptimizer.tsx)、[src/tui/index.ts](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/src/tui/index.ts)、[package.json](https://github.com/ALIve114514awa/dsh-prompt-optimizer/blob/0f6d8d42bc3418c78153ad56968117f9c38c3d42/package.json)。

<a id="detail-section-5"></a>

### 主要限制

优化后的文本是否更忠实而非擅自补需求？结构化解析与预览不能保证目标不漂移，也缺同条件下游任务实验。Web有draftRev保护，但TUI公开追加无回执，README承认已有原稿保留未完成实测；“已写出”不能认定草稿已落地。Codex取消仍依赖provider的实际清理语义。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.3；版本日期：2026-10-04（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[0f6d8d42](https://github.com/ALIve114514awa/dsh-prompt-optimizer/tree/0f6d8d42bc3418c78153ad56968117f9c38c3d42)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件Host请求、Codex适配、浏览器状态/草稿应用、TUI注册与README；不执行构建、模型调用或目标测试。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

在预览中逐条标注“用户已给事实/澄清答案/模型新增假设”，可能比单纯润色降低需求偷换。对相同模糊需求盲测原稿和标注稿，统计未授权新增约束与下游返工；若只是更长却没有降低新增假设错误，则否定收益。

未执行；拟用草稿修改、切会话、引用附件变化、取消先到达和TUI追加无回执案例验证交接，再盲评目标保真与下游返工。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 244 | — | — | 3295 |
| .mjs | source | 7 | 468 | 436 | 17 | — |
| .ts | source | 14 | 1809 | 1662 | 47 | — |
| .tsx | source | 2 | 205 | 187 | 2 | — |
| .ts | test | 8 | 784 | 733 | 4 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/ALIve114514awa/dsh-prompt-optimizer/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
