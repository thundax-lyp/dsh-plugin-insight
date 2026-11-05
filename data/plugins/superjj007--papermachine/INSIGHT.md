# PaperMachine

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[b7f095e](https://github.com/SuperJJ007/papermachine/tree/b7f095ed665d3c0693006d20fbf0ad33f061cf82)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SuperJJ007/papermachine)
<!-- END META -->

> **功能**：本地运行 Python/R 并以版本化产物和来源记录支持审阅的科研桌面客户端

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 支持将本地Python/R、执行身份、环境和版本图表组织成科研桌面工作流的集成贡献；不是新统计方法，亦不能把继承DSH代码与外部Skill算原创。

> **主要限制**：[Q02](#research-q02) 的持久状态和平台写隔离不保证重放或科学正确；[Q03](#research-q03) store与会话事件分离，捕获可部分成功。核心问题是可查看来源能否降低审阅负担，当前缺少同任务和恢复验收。

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
  - [Q01 · 谁用它完成什么任务，哪些贡献属于本应用？](#detail-section-11)
  - [Q02 · 持久kernel与取消、隔离究竟保证什么？](#detail-section-12)
  - [Q03 · 版本来源如何保存，哪里会部分成功？](#detail-section-13)
  - [Q04 · 启动、联网、权限与全周期成本是什么？](#detail-section-14)
  - [Q05 · 哪些效果成立，什么条件下采用或退出？](#detail-section-15)
  - [Q06 · 能提出什么可证伪改进？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能审阅数据与代码的研究者，用桌面会话完成Python/R分析并检查结果来源，见 [Q01](#research-q01)。

参照通用聊天复制脚本和图表，以及人工维护Notebook与环境记录；本次没有竞品或原生DSH同任务测试。基础Agent继承DSH，科学Skill外部引入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| Python/R执行 | 本地多轮分析 | 持久kernel可重启丢状态，非科学正确保证 |
| 版本化产物 | 图表/表格关联run与环境 | 格式大小数量有限；store/event可部分成功 |
| 图形编辑 | 保留人工版与基线 | PNG状态等条件，非任意图片编辑保证 |
| 环境安装 | 独立micromamba配置 | 下载源/磁盘/解释器校验，模型另需key |
| 科学Skill | 方法指导 | 外部引入，输出须审阅 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 用途 | 缺失或边界 |
|---|---|---|
| Electron桌面和本地host | 承载科学工作区 | 当前发布制品未验收 |
| micromamba/Python/R | 独立分析环境 | 需下载安装，安装后校验才绑定 |
| 模型供应商与自有key | 生成分析代码 | 不是离线AI，数据外发需用户控制 |
| macOS或Windows x64 | 执行平台 | Windows partial且首次安装未硬件验收 |
| 本地写权限与空间 | 会话、产物及环境 | 不是读/网络隔离 |

#### 启动步骤

| 步骤 | 动作 | 验收或恢复 |
|---|---|---|
| 准备 | 备份项目、确认平台与去敏数据 | 固定安装制品和环境 |
| 首启 | 安装独立环境、输入模型key | 解释器校验、源失败确认日志 |
| 分析 | 小CSV执行Python/R并查看代码日志 | 对照已知答案与kernel重启标记 |
| 交付 | 人工改图并比较版本来源 | 验证原版仍可读和来源精确 |
| 退出 | 保留数据与日志，回Notebook | 取消后核进程，删除目录前备份 |

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 未知 |
|---|---|---|---|
| 首次 | 作者称约850MB下载/6GB磁盘，自有模型key | 安装、环境与基准核查 | 实际下载/工时与费用未测 |
| 持续 | 模型调用、本地计算、版本存储 | 统计审阅、升级与环境维护 | 净节省和调用金额未知 |
| 失败 | 重跑/环境修复，可能未静止进程 | 查终态、orphan及丢变量 | 恢复耗时未知 |
| 退出 | 导出备份资源 | 确认目录内容再清理 | 删除目录不会撤回模型数据 |

#### 效果

| 效果项 | 当前支持 | 尚未知 |
|---|---|---|
| 执行可查 | 精确代码身份、run事件与结果字段 | 真实平台完整端到端 |
| 来源追踪 | 环境指纹、调用与版本事务 | 崩溃恢复与全部捕获 |
| 科研有效 | 用户可审阅过程 | 统计正确、因果合理与新环境复现 |
| 工作效率 | 减少分散组织的机制 | 与Notebook同任务节时及总费用 |

> **思考**：[Q02](#research-q02) 的持久状态和平台写隔离不保证重放或科学正确；[Q03](#research-q03) store与会话事件分离，捕获可部分成功。核心问题是可查看来源能否降低审阅负担，当前缺少同任务和恢复验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 支持将本地Python/R、执行身份、环境和版本图表组织成科研桌面工作流的集成贡献；不是新统计方法，亦不能把继承DSH代码与外部Skill算原创。

会话排队租约、prefix漂移重观测、精确执行身份和SQLite版本事务是具体工程贡献；store/event边界诚实暴露orphan与截断，不应伪装成全局原子成功。大仓中的基础DSH能力不归为本应用全部原创。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的持久状态和平台写隔离不保证重放或科学正确；[Q03](#research-q03) store与会话事件分离，捕获可部分成功。核心问题是可查看来源能否降低审阅负担，当前缺少同任务和恢复验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有限试用，见 [Q05](#research-q05)：macOS上先以去敏且已有正确答案的小CSV验证执行轨迹、版本、人工编辑和备份恢复。来源断裂、变量意外清空、取消未知或基准不符就停止扩展并退回Notebook；不据可视化轨迹采用敏感或正式科研结论。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅源码核查支持执行与版本来源接线；作者平台限制明确，当前科研正确性、重放和节时收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/bundle/science-app/cordis.patch.yml、packages/science/tool-science/src/index.ts、packages/science/science-runtime/src/index.ts、packages/science/science-runtime/src/execution.ts、packages/science/science-runtime/src/capture.ts、packages/science/science-artifact-store/src/store.ts、packages/science/tool-science/src/run.ts、apps/desktop/src/product-environment.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根提交定向读取README、Science composition、工具注册/结果、runtime启动/终止与capture、store版本事务、desktop环境绑定。大仓INVENTORY不等于全源码审计，未穷尽UI、内核传输或平台沙箱。
- 下一步：本轮未安装、构建、运行目标代码、测试或模型任务。README截图和作者Windows手工记录仅作者材料，不是本次运行证据。

**分析版本**

- **仓库**：[SuperJJ007/papermachine](https://github.com/SuperJJ007/papermachine)
- **版本号**：0.1.5-rc.2（[固定提交 b7f095e](https://github.com/SuperJJ007/papermachine/tree/b7f095ed665d3c0693006d20fbf0ad33f061cf82)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出未验证的可重放分析交付包，以精确输入、代码次序、锁环境及未捕获原因在清洁kernel验收；隐藏状态、丢版本或错误统计均可推翻充分性，重放仍不代替领域审阅。

本轮未安装、构建、运行目标代码、测试或模型任务。README截图和作者Windows手工记录仅作者材料，不是本次运行证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 44 | 5118 | 3991 | 757 | — |
| .md | source | 3403 | 289064 | — | — | 4719682 |
| .mjs | test | 11 | 2040 | 1916 | 58 | — |
| .mjs | example | 17 | 1001 | 845 | 76 | — |
| .ts | source | 1954 | 367938 | 253098 | 91178 | — |
| .ts | test | 1464 | 444570 | 382674 | 25427 | — |
| .ts | example | 63 | 3398 | 2675 | 405 | — |
| .md | test | 87 | 3996 | — | — | 17232 |
| .js | source | 4 | 193 | 173 | 10 | — |
| .js | test | 4 | 826 | 709 | 42 | — |
| .js | example | 14 | 243 | 203 | 27 | — |
| .tsx | source | 220 | 42192 | 33437 | 6822 | — |
| .tsx | test | 193 | 60723 | 52308 | 3362 | — |
| .md | example | 14 | 229 | — | — | 1489 |
| .cjs | source | 1 | 108 | 68 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/SuperJJ007/papermachine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/SuperJJ007/papermachine/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SuperJJ007/papermachine/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查科研客户端的执行、来源与恢复机制，区分可审阅过程和可信科研效果。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它完成什么任务，哪些贡献属于本应用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

PaperMachine 是独立 Electron 桌面科研客户端，面向能检查数据分析的研究者与业务分析者，而非给现有 DSH 安装的一个工具。Science composition 接入运行时、会话、项目产物库、专用 UI 和 science preset；tool-science 注册 Python/R 执行、状态、标注与安装工具。普通聊天后手工复制脚本、图表和环境记录是参照，增量是将执行与版本来源合到同一工作区。基础 Agent/宿主由 DeepSeek Harness 继承，三个科学 Skill 来自 K-Dense-AI，不能把全仓代码或科学方法都算本项目原创。README 的全部可视化和质量承诺未由本轮运行验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-37](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/README.md#L11-L37)

桌面科研任务、过程及版本来源目标。

<details>
<summary>查看原文（27行）</summary>

```text
PaperMachine is a desktop app for everyone whose work runs on data — researchers, business analysts, data analysts. You say what you want in one sentence and it runs Python and R on your own machine. The difference is that the result is not handed to you out of a black box: **agent trace** shows the code it ran and the output it got at every step; **result provenance** takes any figure or table back to the code, the log, and the environment that produced it; **data transparency** keeps every dataset it read and every variable it changed open to inspection. You supervise the AI, and the whole process stays under your control.

<!-- 图 2 · 主循环 GIF ≤30 s:提问 → 运行 → 图出现在右栏 → 结语卡片
![Ask a question, watch it run, get the chart in the side panel](docs/media/loop.gif)
-->

## Trace: every step it took is right there

![Process view: each reply broken into steps, open any one to read the code it actually ran](docs/media/trace.gif)

Every turn becomes a strip of steps: read the data, clean it, fit the model, draw the chart. Each step shows only a one-line title and a result badge until you open it; inside is the exact code it ran, its output, and the kernel state. Kernel restarts are marked inline, so you always know when variables were cleared. The Python and R kernels persist across turns, so what you built last turn is still there.

When a reviewer asks how those 600 rows were dropped, the answer is on the screen, not in your memory.

## Artifacts: every chart leads back to where it came from

![Artifact provenance: code, log, messages, and environment tabs](docs/media/artifact.gif)

Every figure, table, and file the model produces lands in the artifact panel on the right, with a version number. One click on any artifact opens its provenance in four tabs: the **code** that produced it, the **log** of that execution, the **question and result** it answered, and the **environment** it ran in — package versions, kernel, timestamp. Artifacts produced in other sessions are traced too.

What you hand over is not just a chart, but everything behind it.

## Chart editing: edit it, keep both versions

![Chart editing: change the title and axis labels, save as v2 marked as a human edit](docs/media/chart-edit.gif)

You do not have to go back to the code to fix a figure. Change a matplotlib or ggplot2 chart's title, axis labels, legend position, grid, or font directly in a panel — or select a region on the chart and have the model change only that. Saving writes v2 and marks it as a human edit; v1 stays untouched, and you can compare the two at any time.
```

</details>

**依据 2 · 源码核查**：[packages/bundle/science-app/cordis.patch.yml:1-39](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/bundle/science-app/cordis.patch.yml#L1-L39)

Science runtime/store/UI/preset实际组合。

<details>
<summary>查看原文（39行）</summary>

```text
- insert:
    - id: science-app
      name: '@deepseek-ai/dsh-science-app'
    - id: ui-brand-papermachine
      name: '@deepseek-ai/dsh-client-ui-brand-papermachine'
    - id: session-attachment-index
      name: '@deepseek-ai/dsh-session-attachment-index'
    - id: science-session
      name: '@deepseek-ai/dsh-science-session'
    - id: science-artifact-store
      name: '@deepseek-ai/dsh-science-artifact-store'
    - id: science-runtime
      name: '@deepseek-ai/dsh-science-runtime/with-settings'
      config:
        profiles: {}
    - id: science-edit-service
      name: '@deepseek-ai/dsh-tool-science/edit-service'
    - id: science-read-service
      name: '@deepseek-ai/dsh-tool-science/read-service'
    - id: ui-science
      name: '@deepseek-ai/dsh-client-ui-science'
      config:
        toggleScope: global
- insert:
    - id: science-agent-presets
      name: '@deepseek-ai/dsh-agent-presets'
      inject: [sciencePresetRoot]
      config:
        default: science
        roots:
          - path: !!js sciencePresetRoot
            trust: system
- id: agent-presets
  disabled: true
- id: ui-agent-preset
  disabled: true
- id: ui-brand-official
  disabled: true
- id: hmr
```

</details>

**依据 3 · 源码核查**：[packages/science/tool-science/src/index.ts:30-63](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/tool-science/src/index.ts#L30-L63)

五种science工具注册与运行指导。

<details>
<summary>查看原文（34行）</summary>

```text
export const name = 'tool-science'

/** Statically injects only registration services; `ctx.scienceRuntime` is read optionally at call time. */
export const inject = ['tools', 'systemPrompt']

const STATIC_GUIDANCE = [
  'Use run_python or run_r to execute source in the session\'s bound Science environment.',
  'Each language has one persistent kernel per session: variables, imports, and definitions stay in memory across calls to that language\'s run tool until the kernel restarts (idle timeout, environment re-bind, interrupt escalation, crash, or session end). A run result names the reason right after a restart.',
  'Bind a loaded table to a named variable so it stays in the kernel for later turns instead of re-reading the file.',
  'SCIENCE_ARTIFACT_DIR is a fresh directory each run; files written there are gone from the next run\'s directory, so keep intermediate tables and working data as kernel variables, or under SCIENCE_STATE_DIR only if it must survive a kernel restart, and write only final deliverables there, since eligible files are captured as artifacts.',
  'The current directory is a private scratch directory that is not captured; access workspace files through SCIENCE_WORKSPACE_DIR or an absolute path, and artifact_inputs materialize under SCIENCE_INPUT_DIR.',
  'When modifying or regenerating an existing artifact, reference its exact version through edit_of for a direct edit or artifact_inputs for an input, and write the output to the same relative path under SCIENCE_ARTIFACT_DIR so automatic capture appends the existing version chain. artifactId is the UUID printed in the capture receipt and by get_science_state, never the file name.',
  'A terminal program failure (exception, error condition, timeout) is a result to inspect in the returned stdout/stderr, not a tool malfunction.',
  'A tool error result means no trustworthy run occurred: nothing executed, or its outcome could not be confirmed.',
  'Use get_science_state to read the current mode, environment, kernel state, and run history without starting a run.',
  'Make charts with matplotlib (Python) or ggplot2 (R), save each one as a PNG under SCIENCE_ARTIFACT_DIR, and name it in raster_artifacts so it is captured. Do not use Altair or Vega-Lite.',
  'Save matplotlib figures with fig.savefig()/plt.savefig() and ggplot2 charts with ggsave(); figures saved that way stay addressable for direct edits in the viewer.',
  'A run\'s eligible written files (csv/json/md/txt under SCIENCE_ARTIFACT_DIR) are durably captured automatically as versioned artifacts, and a PNG only when named in raster_artifacts; no separate save step is needed otherwise. If a result says a PNG was not captured, rerun the code that writes it and declare the same path in raster_artifacts. Use annotate_artifact to give the artifact that best demonstrates your result a human-readable title and optional caption, so it is highlighted for the reader.',
  'Write a render, preview, or debug dump meant only for your own inspection outside SCIENCE_ARTIFACT_DIR (for example a temp directory), never into it, so it is never captured as an artifact.',
  'Do not open a new artifact version to reconcile a cosmetic difference the user did not ask for; mention the difference in your reply instead.',
  'Use install_science_packages to persist a package into the bound environment across kernel restarts; an in-kernel pip install/install.packages() only lasts until the current kernel restarts.',
].join(' ')

/** Register the Science Consumer's prompt, context, and tool contributions. */
export function apply(ctx: Context, config: Config): void {
  const resolved = resolveConfig(config)
  ctx.systemPrompt.section({ name: 'tool:science', order: 1100, text: STATIC_GUIDANCE })
  applyScienceContext(ctx, resolved)
  applyScienceStateTool(ctx, resolved.stateHistoryLimit)
  applyRunTool(ctx, 'python', resolved.stateHistoryLimit)
  applyRunTool(ctx, 'r', resolved.stateHistoryLimit)
  applyAnnotateArtifactTool(ctx, resolved.stateHistoryLimit)
  applyInstallPackagesTool(ctx)
}
```

</details>

**依据 4 · 作者声明**：[README.md:136-163](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/README.md#L136-L163)

DSH派生与外部科学Skill归因。

<details>
<summary>查看原文（28行）</summary>

````text
## Built on DeepSeek Harness

PaperMachine is assembled from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugins. Developers start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md); agents follow [AGENTS.md](AGENTS.md). The desktop carrier is documented in [apps/desktop](apps/desktop/README.md).

### Run

The harness Web UI that PaperMachine wraps starts from a repository checkout; the command prints its URL:

```sh
git clone https://github.com/SuperJJ007/papermachine.git
cd papermachine
pnpm install
pnpm run build
pnpm dsh web
```

### Run from source

The desktop app runs from the same checkout after `pnpm run build`; fetch the pinned micromamba for your architecture first (`darwin-x64` on an Intel Mac, `win32-x64` on Windows):

```sh
pnpm --filter @deepseek-ai/dsh-desktop fetch:micromamba darwin-arm64
pnpm --filter @deepseek-ai/dsh-desktop dev
```

## Acknowledgements

- Bundled skills are vendored from [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) (MIT).
````

</details>

#### 缺口

- 没有同任务与原生DSH/Notebook的任务对照。
  **影响**：限制采用和效果结论。
  **进一步探讨**：先比较分析可检查性、完成率和人工负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久kernel与取消、隔离究竟保证什么？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

startRun 在会话排队租约后重新读取环境，检查共享prefix漂移并重绑，再创建独立run目录和精确代码身份，获取每会话/语言kernel，写run-started后返回取消句柄。持久kernel减少反复加载，但环境重绑、崩溃、闲置和中断升级可清空状态，不能将上轮变量当永久数据。终止等待有超时和 eventualQuiescence，未证实进程静止时不能直接当已停止。confinement 是workspace-write策略；作者明确即使macOS full也仅指文件写约束，不限制文件读、网络、系统调用或科学有效性。Windows最低partial且取消/超时重启丢全部变量，这是平台取舍，不应称与macOS等价隔离。Windows真实硬件只有作者一次手工kernel验证，桌面首次安装未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/science/science-runtime/src/index.ts:1014-1112](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/index.ts#L1014-L1112)

排队租约、漂移重绑、kernel获取、启动事件和取消句柄。

<details>
<summary>查看原文（99行）</summary>

```text
  async startRun(request: StartScienceRunRequest): Promise<ScienceRunHandle> {
    this.assertSession(request.session)
    this.assertHostLocal()
    // Queues behind another run/bind/annotate operation already holding
    // this Session's lease instead of rejecting outright — see
    // `reserveQueued`'s own doc. `environment`/the open-run check below are
    // read fresh AFTER the lease is granted, not from this pre-queue probe:
    // a call that queued behind a run has stale state by the time it
    // actually starts.
    const lease = await this.reserveQueued(request.session, request.signal, this.timeoutMs)
    let sessionScratch: ScienceSessionScratch | undefined
    let scratchPreparation: Awaited<ReturnType<typeof materializeSessionScratch>> | undefined
    let runScratch: Awaited<ReturnType<typeof createRunScratch>> | undefined
    try {
      const { projection, environment: appliedEnvironment } = this.assertIdleAppliedEnvironment(request.session, lease.control)
      const profile = this.profile(String(appliedEnvironment.profileId))
      let environment = appliedEnvironment
      // Cheap, non-probing per-run drift check (#15): another session's
      // `installPackages` call may have mutated this shared prefix without
      // ever touching this session's own binding (`installPackages` only
      // appends to the session that called it). A digest mismatch re-runs
      // the same re-observe/append path `installPackages` uses, so a
      // drifted prefix restarts this run's kernel (`environment-rebound`)
      // instead of silently executing against packages the durable
      // provenance never named.
      if (await prefixDrifted(environment)) {
        scratchPreparation = await materializeSessionScratch(this.dshHome, request.session)
        environment = (await this.reobserveAndMaybeRebind(request.session, profile, lease.control, 'drift')).environment
        this.assertPrepublication(request.session, lease.control)
      }
      const plan = planRun(environment, request.language, request.code)
      const projectId = await this.sessionProject(request.session)
      const preparedArtifacts = await prepareRunArtifacts(
        projection,
        this.ctx.scienceArtifactStore,
        projectId,
        request.artifactInputs,
        request.editBaselines,
        request.rasterArtifacts,
        this.inputMaxFilesPerRun,
        this.inputMaxBytesPerRun,
        lease.control.signal,
      )
      this.assertPrepublication(request.session, lease.control)
      if (scratchPreparation === undefined) {
        scratchPreparation = await materializeSessionScratch(this.dshHome, request.session)
      }
      sessionScratch = scratchPreparation.scratch
      await assertProfileRunConfinement(profile, request.session, sessionScratch.root)
      this.assertPrepublication(request.session, lease.control)
      if (request.language === 'r' && sessionScratch.runs.includes(' ')) {
        throw new ScienceRuntimeError('CONFINEMENT_UNAVAILABLE', 'R run directory cannot contain an ASCII space')
      }
      runScratch = await createRunScratch(sessionScratch, plan.runId, request.language, plan.sourceBytes)
      await materializeRunInputs(runScratch, preparedArtifacts.materialized)
      this.assertPrepublication(request.session, lease.control)
      const kernel = await this.acquireKernel(request.session, request.language, environment, sessionScratch, lease.control)
      // Disarmed immediately on acquisition, not only after run-started
      // commits: this run already owns the kernel the moment
      // `acquireKernel` resolves, before `run-started` actually appends, and the idle timer must
      // never fire in that window. `settlePublishedKernelRun`'s
      // own `finally` re-arms it once this run settles.
      this.kernels.disarmIdleTimer(request.session, request.language)
      this.assertPrepublication(request.session, lease.control)
      const started = startCandidate(
        plan,
        runScratch,
        request.language,
        environment,
        request.toolCallId,
        request.requestHeaderSeq,
        kernel.epoch,
        preparedArtifacts.inputs,
      )
      request.session.append('science/run-started', { version: 1, run: started })
      const done = this.settlePublishedKernelRun(
        lease,
        request.session,
        projectId,
        runScratch,
        kernel.process,
        started,
        preparedArtifacts,
      )
      return {
        runId: plan.runId,
        done,
        cancel: () => { lease.control.cancel() },
      }
    } catch (error) {
      const cleanupFailures: unknown[] = []
      try {
        if (sessionScratch !== undefined && runScratch !== undefined) {
          await removeUnpublishedRunScratch(sessionScratch, runScratch)
        }
      } catch (cleanupError) {
        cleanupFailures.push(cleanupError)
      }
      try {
```

</details>

**依据 2 · 源码核查**：[packages/science/science-runtime/src/execution.ts:188-240](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/execution.ts#L188-L240)

源代码字节与run身份、文件写入策略和最低执行级别。

<details>
<summary>查看原文（53行）</summary>

```text
export function planRun(
  environment: ScienceEnvironmentBinding,
  language: ScienceLanguage,
  code: string,
): RunPlan {
  const bytes = sourceBytes(code)
  const binding = selectBinding(environment, language)
  const runId = ScienceRunId(randomUUID())
  const scratchKey = ScienceScratchKey(sha256(Buffer.concat([
    Buffer.from(`dsh-science-scratch-v1\0${language}\0`, 'utf8'),
    bytes,
  ])))
  return {
    runId,
    sourceBytes: bytes,
    scratchKey,
    binding,
  }
}

/**
 * Fixed confinement policy rooted at exactly one canonical Science Session
 * scratch tree. Used for every persistent kernel spawn under that Session
 * (an interpreter probe's own policy is narrower, rooted at its probe
 * directory instead — see `environment.ts`).
 * @param session - exact live Session that owns the scratch tree.
 * @param scratch - that Session's private scratch paths.
 * @returns the fixed `workspace-write` sandbox policy.
 */
export function confinementPolicy(session: Session, scratch: ScienceSessionScratch): SandboxPolicy {
  return { mode: 'workspace-write', workspaceRoot: scratch.root, sessionId: session.id }
}

/**
 * Reject every prefix that may be written through the selected sandbox policy.
 * @param prefix - the observed binding's canonicalized Conda prefix.
 * @param policy - the confinement policy the prefix must stay outside of.
 * @throws {@link ScienceRuntimeError} (`CONFINEMENT_UNAVAILABLE`) when the prefix overlaps a writable root.
 */
export function assertPrefixReadOnly(prefix: string, policy: SandboxPolicy): void {
  for (const root of writableRoots(policy)) {
    if (pathsOverlap(prefix, root)) {
      throw new ScienceRuntimeError('CONFINEMENT_UNAVAILABLE', 'configured Conda prefix overlaps a sandbox writable root')
    }
  }
}

/**
 * Whether a confinement's reported enforcement satisfies a configured
 * minimum: `'full'` accepts only a `'full'` report; `'partial'` accepts
 * either `'full'` or `'partial'`. The sandbox provider itself never sees
 * this comparison — it always reports the level it actually achieved.
 * @param reported - enforcement level `SandboxProvider.confine` reported.
```

</details>

**依据 3 · 源码核查**：[packages/science/science-runtime/src/execution.ts:426-458](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/execution.ts#L426-L458)

两阶段等待终止，未证实静止保留eventualQuiescence。

<details>
<summary>查看原文（33行）</summary>

```text
export type Quiescence =
  | { readonly quiescent: true; readonly forced: boolean }
  | { readonly quiescent: false; readonly forced: true; readonly eventualQuiescence: Promise<boolean> }

/**
 * Wait briefly for a subprocess tree to exit on its own, then escalate
 * through the seam's one termination verb and wait again. Used by
 * persistent kernel teardown, both ordinary (`KernelProcess.end`) and
 * spawn-failure cleanup.
 * @param handle - the live subprocess handle to quiesce.
 * @returns whether the tree proved quiescent, whether termination was
 *   forced, and (when still unproven) the retained eventual-quiescence observation.
 */
export async function quiesce(handle: SubprocessHandle): Promise<Quiescence> {
  try {
    const grace = AbortSignal.timeout(DESCENDANT_GRACE_MS)
    if (await handle.waitForExit(grace)) return { quiescent: true, forced: false }
  } catch {
    // A provider that cannot answer the bounded observation has not proven the tree dead.
  }
  try {
    handle.terminate()
  } catch {
    return { quiescent: false, forced: true, eventualQuiescence: awaitEventualQuiescence(handle) }
  }
  try {
    const forced = AbortSignal.timeout(DESCENDANT_GRACE_MS)
    if (await handle.waitForExit(forced)) return { quiescent: true, forced: true }
  } catch {
    // Keep the exact-Session quarantine until the provider can later prove exit.
  }
  return { quiescent: false, forced: true, eventualQuiescence: awaitEventualQuiescence(handle) }
}
```

</details>

**依据 4 · 作者声明**：[README.md:119-123](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/README.md#L119-L123)

平台约束与Windows丢变量、作者手工硬件证据边界。

```text
- Analysis runs on macOS (Apple silicon and Intel) and Windows x64. Both platforms' sandbox enforcement is file-write confinement only — neither claims file-read, network, syscall, or scientific-validity isolation. Windows reports the weaker `partial` level, not macOS's `full`, because its restricted-token backend cannot close two gaps a full-enforcement backend does: an externally Everyone-writable object stays writable through it, and an NTFS hard link aliases a granted workspace file onto an external path (see [`dsh-sandbox-windows-acl`](packages/sandbox/sandbox-windows-acl/README.md), "Verified boundaries"). Cancelling or timing out a run on Windows always restarts its kernel and loses every variable that kernel held, where macOS usually survives an interrupt. Windows kernel execution's real-hardware evidence is one manual verification, not a repeatable CI gate. The Windows desktop first-launch flow (onboarding, environment download and install) has not yet been verified on Windows hardware; kernel execution has.
- A DeepSeek API key is required; the app ships no key.
- Neither installer carries a paid signing identity; the macOS package is ad-hoc signed since 0.1.1. See the notes above.
- Updates are manual: download the next installer.
- There is no variables panel yet; the kernel status bar shows each language's kernel state.
```

#### 缺口

- 本次没有各平台取消/超时及后代进程验证。
  **影响**：限制采用和效果结论。
  **进一步探讨**：在受控输入上检查终态、存活进程、变量清空与外部网络。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 版本来源如何保存，哪里会部分成功？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

capture 按run产物目录的可捕获格式和数量上限遍历，检查路径边界、常规非符号文件和大小；SHA256同内容跳过。模型未显式选择人工编辑基线时，对旧run内容有保护，避免自动覆盖人改结果。每版本记producerRunId/toolCallId/requestHeaderSeq/environmentRevision/fingerprint和可选baseVersionId。store通过SQLite事务计算下一个ordinal并更新head，先持久store版本，再追加science/artifact-saved事件；跨会话逻辑名冲突会重查获胜artifact并续版本。两者不是单事务：事件拒绝后标orphan并停止，剩余文件不会自动重试，健康标记失败留给reconcile。超大小、超数量、格式和PNG图形状态均有边界，所以“每个文件都自动有完整来源”的表述过强。保存来源只证明记录联系，不证明分析方法或数据含义正确；可选capturedArtifacts还不能把异步捕获未知写成空集合。

#### 证据与依据

**依据 1 · 源码核查**：[packages/science/science-runtime/src/capture.ts:201-218](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/capture.ts#L201-L218)

允许格式和数量限制会使捕获不完整。

<details>
<summary>查看原文（18行）</summary>

```text
 */
export async function captureRunArtifacts(request: CaptureRunArtifactsRequest): Promise<CaptureRunArtifactsResult> {
  const { session, sourceRun, store, projectId } = request
  const walked = (await walkArtifactFiles(request.runArtifacts)).filter(isCaptureEligible).sort()
  const skippedRasterPaths = walked.filter((relativePath) => {
    const mediaType = captureMediaType(relativePath)
    /* v8 ignore next -- isCaptureEligible already required a mapped extension */
    if (mediaType === undefined) return false
    return !isRasterCaptureAllowed(relativePath, mediaType, request.rasterCapture, request.rasterArtifacts)
  })
  const eligible = walked.filter(relativePath => !skippedRasterPaths.includes(relativePath))
  if (eligible.some(relativePath => !isScienceLogicalName(relativePath))) {
    throw new ProjectArtifactStoreError('Science capture contains an invalid logical name', 'LOGICAL_NAME_INVALID')
  }
  const truncatedPerRun = eligible.length > request.captureMaxFilesPerRun
  const files = eligible.slice(0, request.captureMaxFilesPerRun)

  const captured: ScienceArtifactVersion[] = []
```

</details>

**依据 2 · 源码核查**：[packages/science/science-runtime/src/capture.ts:270-317](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/capture.ts#L270-L317)

边界路径、限量读、哈希与人工编辑保护。

<details>
<summary>查看原文（48行）</summary>

```text
      // between the walk and this check) — skip it, not a run failure.
      /* v8 ignore next -- a TOCTOU race, not deterministically reproducible; mirrors the accepted crash-between-commit-and-capture gap */
      continue
    }
    const entry = await lstat(canonical)
    // Re-verify kind defensively: walkArtifactFiles already required a
    // regular non-symlink entry, so only a TOCTOU race changes that before
    // this re-check (same non-reproducible race as the branch above).
    /* v8 ignore next */
    if (!entry.isFile() || entry.isSymbolicLink()) continue
    // A bounded read never pulls more than captureMaxFileBytes + 1 bytes
    // into memory, so an oversized file is caught by its returned length
    // rather than a separate stat-based pre-check (artifact-file.ts).
    const data = await readBoundedFile(canonical, request.captureMaxFileBytes)
    if (data.byteLength > request.captureMaxFileBytes) {
      skippedOversizedCount += 1
      continue
    }
    const sha256 = createHash('sha256').update(data).digest('hex')

    const localKnown = projection.artifacts.filter(candidate => candidate.logicalName === relativePath)
    const localLatest = localKnown.at(-1)
    let artifactId = localLatest?.artifactId ?? await projectArtifactIdFor(relativePath)

    if (artifactId !== undefined) {
      // The store, not this session's own local history, is the sole
      // authority for a version's content_origin and sha256 (T1's authority
      // rule) — both the same-content skip and the human-edit stale-skip
      // below read the store's current head and history rather than
      // `localKnown`, which no longer carries either fact and would also
      // miss a head another session advanced.
      const head = await store.getLatestVersion(projectId, artifactId)
      // An artifactId resolved here (from this session's own fold or D7's
      // listArtifacts lookup) always names a real, already-committed store
      // row, which always has a latest version.
      /* v8 ignore next */
      if (head !== undefined) {
        if (head.sha256 === sha256) continue
        if (head.contentOrigin === 'human-edit' && request.editBaselines?.has(relativePath) !== true) {
          const history = await store.listVersions(projectId, artifactId)
          const latestRunProduced = history.findLast(candidate => candidate.contentOrigin !== 'human-edit')
          if (latestRunProduced?.sha256 === sha256) continue
        }
      }
    }

    const parent = request.editBaselines?.get(relativePath)
    let parentVersionId: ScienceVersionId | undefined
```

</details>

**依据 3 · 源码核查**：[packages/science/science-runtime/src/capture.ts:332-411](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/capture.ts#L332-L411)

环境/run/调用来源、先store后事件，拒绝事件标orphan并停止。

<details>
<summary>查看原文（80行）</summary>

```text
    const provenance = {
      producerRunId: String(sourceRun.runId),
      producerToolCallId: String(sourceRun.toolCallId),
      producerRequestHeaderSeq: sourceRun.requestHeaderSeq,
      environmentRevision: sourceRun.environmentRevision,
      environmentFingerprint: sourceRun.environmentFingerprint,
      producerTurn,
      ...parentVersionId === undefined ? {} : { baseVersionId: parentVersionId },
      ...figureState === undefined ? {} : { figureState },
    }

    // The store row commits before its session event: the event carries the
    // validated store coordinates as fact (S0's Host-side pre-commit rule).
    let stored: VersionRecord
    if (artifactId !== undefined) {
      stored = await store.appendVersion(projectId, artifactId, { producerSessionId: session.id, data, mediaType, contentOrigin: 'run-auto', ...provenance })
    } else {
      try {
        stored = (await store.createArtifact(projectId, {
          logicalName: relativePath,
          kind: artifactKindForMediaType(mediaType),
          originSessionId: session.id,
          data,
          mediaType,
          contentOrigin: 'run-auto',
          ...provenance,
        })).version
      } catch (error) {
        // A different session raced this same logical name into existence
        // between this walk's D7 lookup and this create call — the store's
        // own UNIQUE(owningProjectId, logicalName) constraint is the true
        // serialization point; re-resolve and append onto the winner rather
        // than failing this file.
        if (!(error instanceof ProjectArtifactStoreError) || error.code !== 'LOGICAL_NAME_CONFLICT') throw error
        const known = await store.listArtifacts(projectId)
        const winner = known.find(candidate => candidate.logicalName === relativePath)
        /* v8 ignore next 3 -- the conflict error itself proves a row with this logicalName now exists */
        if (winner === undefined) throw error
        artifactId = winner.artifactId
        stored = await store.appendVersion(projectId, artifactId, { producerSessionId: session.id, data, mediaType, contentOrigin: 'run-auto', ...provenance })
      }
    }

    const title = basename(relativePath)
    await store.annotateVersion(projectId, stored.versionId, { actor: 'capture', sessionId: session.id, title })

    const artifact: ScienceArtifactVersion = {
      artifactId: stored.artifactId,
      logicalName: relativePath,
      // New content always opens the next version; the store's per-artifact
      // ordinal is that version number, so the log and the index agree.
      version: stored.ordinal,
      title,
      projectId,
      versionId: stored.versionId,
      sha256: stored.sha256,
      seenAt: Date.now(),
    }
    let appended
    try {
      appended = session.append('science/artifact-saved', { version: 1, artifact })
    } catch {
      // The Session detached (or otherwise refused the append) between the
      // walk starting and this file's commit: remaining eligible files in
      // this run stay uncaptured with no automatic retry, and the store row
      // just written is marked orphan immediately rather than left for a
      // later reconciliation pass to discover. `appendFailed` on the
      // returned result is this fact's only signal to the caller
      // (`ScienceRuntime.captureAfterFinish`, which logs it).
      appendFailed = true
      try {
        await store.setVersionHealth(projectId, stored.versionId, { orphan: true })
      } catch {
        // The append already failed for this file; a health-marking failure
        // on top of it leaves the row for the next reconciliation pass
        // instead of compounding this walk's error.
      }
      break
    }
    for (const event of session.snapshotEvents().slice(state.nextSeq, appended.seq + 1)) {
```

</details>

**依据 4 · 源码核查**：[packages/science/science-artifact-store/src/store.ts:386-449](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-artifact-store/src/store.ts#L386-L449)

SQLite写事务生成版本序号并更新head。

<details>
<summary>查看原文（64行）</summary>

```text
  async createArtifact(projectId: ProjectId, input: CreateArtifactInput): Promise<{ artifact: ArtifactRecord; version: VersionRecord }> {
    if (!isScienceLogicalName(input.logicalName)) {
      throw new ProjectArtifactStoreError('logicalName must be a forward-slash relative artifact path', 'LOGICAL_NAME_INVALID')
    }
    const db = await this.connectionFor(projectId)
    const root = await this.rootFor(projectId)
    const { sha256, byteCount } = await admitBlob(root, input.data)
    const artifactId = ArtifactId(randomUUID())
    const versionId = VersionId(randomUUID())
    const now = Date.now()
    runWriteTransaction(db, () => {
      const conflict = db.prepare('SELECT 1 FROM artifacts WHERE owning_project_id = ? AND logical_name = ?').get(String(projectId), input.logicalName)
      if (conflict !== undefined) {
        throw new ProjectArtifactStoreError(`an artifact named "${input.logicalName}" already exists in project "${projectId}"`, 'LOGICAL_NAME_CONFLICT')
      }
      db.prepare(`
        INSERT INTO artifacts (artifact_id, owning_project_id, origin_session_id, logical_name, kind, latest_version_id, created_at)
        VALUES (?, ?, ?, ?, ?, NULL, ?)
      `).run(artifactId, String(projectId), input.originSessionId, input.logicalName, input.kind, now)
      this.insertProducedVersion(db, versionId, artifactId, 1, input, input.originSessionId, sha256, byteCount, now)
      db.prepare('UPDATE artifacts SET latest_version_id = ? WHERE artifact_id = ?').run(versionId, artifactId)
      if (input.figureState !== undefined) this.insertFigureState(db, versionId, input.figureState)
    })
    return { artifact: this.getArtifactRow(db, artifactId), version: this.getVersionRow(db, versionId) }
  }

  /**
   * Append a new version onto an existing artifact. The write transaction is
   * the linearization point: it reads the artifact's current latest version
   * only to compute the next ordinal, inserts the new version, and updates
   * latest — so two concurrent appends serialize on this transaction and the
   * later committer becomes latest, never forking. `baseVersionId` is never
   * defaulted from the artifact's latest version: an omitted baseline means
   * a plain chain continuation, not "no opinion" (see `VersionRecord.baseVersionId`).
   * @param projectId - the owning project; its store is opened if not already.
   * @param artifactId - the artifact to append to.
   * @param input - the new version's bytes, provenance, and optional explicit baseline.
   * @returns the appended version.
   * @throws {@link ProjectArtifactStoreError} with code `ARTIFACT_NOT_FOUND` when no such artifact exists in this project.
   */
  async appendVersion(projectId: ProjectId, artifactId: ArtifactId, input: AppendVersionInput): Promise<VersionRecord> {
    const db = await this.connectionFor(projectId)
    const root = await this.rootFor(projectId)
    const { sha256, byteCount } = await admitBlob(root, input.data)
    const versionId = VersionId(randomUUID())
    const now = Date.now()
    runWriteTransaction(db, () => {
      const artifactRow = db.prepare('SELECT artifact_id FROM artifacts WHERE artifact_id = ?').get(artifactId) as { artifact_id: string } | undefined
      if (artifactRow === undefined) {
        throw new ProjectArtifactStoreError(`artifact "${artifactId}" was not found in project "${projectId}"`, 'ARTIFACT_NOT_FOUND')
      }
      const ordinalRow = db.prepare('SELECT COALESCE(MAX(ordinal), 0) AS max_ordinal FROM versions WHERE artifact_id = ?')
        .get(artifactId) as { max_ordinal: number }
      const ordinal = ordinalRow.max_ordinal + 1
      this.insertProducedVersion(db, versionId, artifactId, ordinal, input, input.producerSessionId, sha256, byteCount, now)
      db.prepare('UPDATE artifacts SET latest_version_id = ? WHERE artifact_id = ?').run(versionId, artifactId)
      if (input.figureState !== undefined) this.insertFigureState(db, versionId, input.figureState)
    })
    return this.getVersionRow(db, versionId)
  }

  /** Reject auto-capture metadata after a version's first annotation. */
  private assertAnnotationActorAllowed(versionId: VersionId, alreadyAnnotated: boolean, actor: AnnotationActor): void {
    if (actor !== 'capture' || !alreadyAnnotated) return
```

</details>

**依据 5 · 源码核查**：[packages/science/tool-science/src/run.ts:1-102](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/tool-science/src/run.ts#L1-L102)

结果区分终态、截断与可选捕获字段。

<details>
<summary>查看原文（102行）</summary>

```text
/** `run_python` and `run_r`: one fresh interpreter execution through `ctx.scienceRuntime`. */

import type { Context } from '@deepseek-ai/cordis'
import { formatBytes } from '@deepseek-ai/dsh-byte-size'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { InferValue, ToolExecution } from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-science-runtime'
import type { ScienceRunResult } from '@deepseek-ai/dsh-science-runtime/types'
import type ScienceArtifactStore from '@deepseek-ai/dsh-science-artifact-store'
import type { VersionRecord } from '@deepseek-ai/dsh-science-artifact-store'
import { decodeScienceChartState, replayScience, ScienceArtifactId } from '@deepseek-ai/dsh-science-session'
import type {
  ScienceArtifactMediaType,
  ScienceArtifactVersion,
  ScienceLanguage,
  ScienceProjection,
  ScienceRunTerminal,
} from '@deepseek-ai/dsh-science-session'
import type { Session } from '@deepseek-ai/dsh-session'
import { closedKernelFacts, isScienceSession, modelKernelEndReason } from './context.ts'
import { requireDirectDispatch } from './guard.ts'
import { scienceArtifactPresentation } from './presentation.ts'
import type { ScienceArtifactPresentationItem } from './presentation.ts'
import { formatScienceArtifactEdits, scienceArtifactEdits, scienceArtifactSchemaProperties, scienceArtifactValueFields } from './artifact-schema.ts'
import type { ResolveArtifactStoreFacts, ScienceArtifactLineage, ScienceArtifactStoreFacts } from './artifact-schema.ts'

const outputStreamSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    text: { type: 'string', required: true },
    bytes: { type: 'integer', required: true },
    truncated: { type: 'boolean', required: true },
  },
} as const

const artifactVersionRefSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    artifactId: { type: 'string', required: true },
    version: { type: 'integer', required: true },
  },
} as const

const runArtifactRefSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...artifactVersionRefSchema.properties,
    path: { type: 'string', required: true },
  },
} as const

const capturedArtifactSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    // `title` and the store version id are carried for `presentationMeta`
    // (below) to build a clickable Client reference per file; `render()`
    // deliberately omits both from the model-visible receipt text — `title`
    // duplicates `logicalName` for every auto-captured file (see capture.ts's
    // `basename` default), and versionId is an internal storage coordinate,
    // not a fact the model reasons about — the same split
    // `annotate_artifact`'s own receipt schema uses.
    ...scienceArtifactSchemaProperties,
    versionId: { type: 'string', required: true },
    lineage: {
      oneOf: [
        {
          type: 'object', additionalProperties: false,
          properties: {
            kind: { type: 'string', const: 'edited-from', required: true },
            logicalName: { type: 'string', required: true },
            version: { type: 'integer', required: true },
          },
        },
        {
          type: 'object', additionalProperties: false,
          properties: {
            kind: { type: 'string', const: 'continues', required: true },
            version: { type: 'integer', required: true },
          },
        },
      ],
    },
  },
} as const

const runOutputSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    status: { type: 'string', enum: ['success', 'failed', 'timed-out', 'cancelled'], required: true },
    // Present only when this is the first run on a kernel epoch that
    // followed an earlier one for this language — the one kernel fact the
    // model needs told: a fresh interpreter replaced the
    // one that held whatever state earlier runs left behind.
    kernelRestartReason: { type: 'string' },
    runId: { type: 'string', required: true },
    startedAt: { type: 'integer', required: true },
    finishedAt: { type: 'integer', required: true },
```

</details>

#### 缺口

- 崩溃窗口和reconcile实际恢复率未复现。
  **影响**：限制采用和效果结论。
  **进一步探讨**：注入store成功事件失败与重启，核对orphan、缺失文件和最终head。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、联网、权限与全周期成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

桌面安装需要本地micromamba与自有Python/R环境，安装成功并解析解释器后才写durable binding；运行overlay按平台full/partial要求并只使用打包Skill根。作者给22包、约850MB下载和6GB磁盘，这是说明材料估计，不是本次测量。用户另供DeepSeek API key；环境可离线不意味着模型分析离线。README一处称只有模型请求离机，但同文明确三类遥测与DSH_TELEMETRY_DISABLED开关，包安装也要访问源，故网络边界需逐类确认。持续成本包括模型调用、本地CPU/RAM/磁盘、版本积累及包升级；现金单价、耗时、人工核验与净节省均未知。失败需要查环境binding、进程静止和部分产物；手动更新与平台未签名安装也增加运维。删除~/.papermachine会删除会话/环境/产物/日志，应先导出备份，不能作为无损退出。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src/product-environment.ts:15-60](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/apps/desktop/src/product-environment.ts#L15-L60)

声明环境与安装后验证才写binding。

<details>
<summary>查看原文（46行）</summary>

```text
  /** Read and validate the packaged install declaration. */
  async declaration() {
    return parseEnvironmentDeclaration(JSON.parse(await readFile(join(this.resources, 'environments/general.json'), 'utf8')))
  }

  private provisioner(): DesktopEnvironmentProvisioner {
    const platform = `${process.platform}-${process.arch}`
    if (!isDesktopPlatform(platform)) throw new Error(`desktop: unsupported environment platform ${platform}`)
    return new DesktopEnvironmentProvisioner({
      root: desktopEnvironmentsRoot(this.home), platform,
      micromambaPath: join(this.resources, 'bin', platform, micromambaExecutableName(platform)),
    })
  }

  /** Read durable binding and prove its interpreters still exist before launching. */
  async status() {
    const status = await resolveEnvironmentBindingStatus(this.home)
    if (status.kind !== 'bound') return status
    for (const [language, prefix] of [['python', status.binding.pythonPrefix], ['r', status.binding.rPrefix]] as const) {
      if (prefix === undefined) continue
      const presence = await qualifyingInterpreters(prefix)
      if (presence?.[language] !== true) return { kind: 'invalid' as const, reason: `desktop: ${language} interpreter is unavailable at ${prefix}` }
    }
    return status
  }

  /** Provision an approved source and package set; publish binding only after verification.
   * @param sourceId - A source from the packaged declaration.
   * @param packages - Optional user-authored package list.
   * @param signal - Cancellation that waits for child termination.
   * @param progress - Bounded progress delivered to the shell renderer.
   */
  async install(
    sourceId: string, packages: readonly string[] | undefined,
    signal: AbortSignal, progress: (value: ProvisioningProgress) => void,
  ): Promise<void> {
    const shipped = await this.declaration()
    if (!shipped.sources.some(source => source.id === sourceId)) throw new Error('desktop: unknown package source')
    const declaration = packages === undefined ? shipped : buildCustomDeclaration(packages, shipped.supportedPlatforms, shipped.sources)
    if (packages !== undefined) await writeCustomDeclaration(desktopEnvironmentsRoot(this.home), declaration)
    const applied = await this.provisioner().provision(declaration, signal, progress, sourceId)
    signal.throwIfAborted()
    const binding = await resolveBindRequest(
      { pythonPrefix: applied.prefix, rPrefix: applied.prefix, sourceId: applied.sourceId }, qualifyingInterpreters,
    )
    await writeEnvironmentBinding(this.home, binding)
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src/product-environment.ts:66-90](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/apps/desktop/src/product-environment.ts#L66-L90)

平台最低约束与已绑定环境生成覆盖配置。

<details>
<summary>查看原文（25行）</summary>

```text
  async writeOverlay(project: string, allowUnbound = false): Promise<void> {
    const minimumEnforcement = process.env['PAPERMACHINE_SCIENCE_MINIMUM_ENFORCEMENT']
      ?? (process.platform === 'win32' ? 'partial' : 'full')
    if (minimumEnforcement !== 'full' && minimumEnforcement !== 'partial') {
      throw new Error('desktop: PAPERMACHINE_SCIENCE_MINIMUM_ENFORCEMENT must be full or partial')
    }
    const status = await this.status()
    if (status.kind !== 'bound') {
      if (allowUnbound) return
      throw new Error(status.kind === 'invalid' ? status.reason : 'desktop: environment is not installed')
    }
    const declaration = await this.declaration()
    const config = {
      minimumEnforcement,
      profiles: { science: { pythonPrefix: status.binding.pythonPrefix, rPrefix: status.binding.rPrefix } },
      micromambaPath: this.provisioner().options.micromambaPath,
      installChannels: orderSourcesFrom(declaration.sources, status.binding.sourceId).flatMap(source => source.channels),
      installTimeoutMs: declaration.timeoutMs,
    }
    const patch = [
      { id: 'science-runtime', config },
      { id: 'skill-filesystem', disabled: false, config: { providerName: 'bundled-skills', includeDefaultRoots: false, bundledSkillDir: join(this.resources, 'skills') } },
    ]
    await mkdir(project, { recursive: true, mode: 0o700 })
    await writeFileAtomic(join(project, 'cordis.patch.yml'), `${JSON.stringify(patch, undefined, 2)}\n`, { mode: 0o600 })
```

</details>

**依据 3 · 作者声明**：[README.md:41-64](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/README.md#L41-L64)

作者首次安装与自备模型key、资源量。

<details>
<summary>查看原文（24行）</summary>

```text
1. Download your installer from [Releases](https://github.com/SuperJJ007/papermachine/releases/latest): `PaperMachine-<version>-arm64.dmg` for Apple silicon, `PaperMachine-<version>-x64.dmg` for an Intel Mac, `PaperMachine-<version>-x64.exe` for Windows (**experimental/beta** — see the note below step 4).
2. Open the app and install the environment as described under **First run** below.
3. Open **Settings → Models** and enter your DeepSeek API key. The app ships without one; it calls `deepseek-v4-flash` by default.
4. Drop a CSV, Excel, SPSS, or Stata file into a project and ask your first question, for example: *Plot life expectancy against GDP per capita for 2007, colored by continent.*

### First run

The first time you open PaperMachine it installs its own Python and R environment before opening a workspace. This happens once: afterwards the environment works offline, and later launches go straight to the workspace.

![First run: confirm the download of the general science environment and choose a source](docs/media/install-environment.png)

PaperMachine does not use the conda environments already on your machine. It ships its own micromamba and installs into `~/.papermachine`, so what it runs and which packages are present stay exactly known, and your own environments are left alone.

The choices on this screen:

| Option | When to use it |
|---|---|
| **Download and install** | The default path. Installs the 22-package general science environment: about 850 MB to download, 6 GB of free disk needed. |
| **Package source** | Where packages are pulled from. USTC is preselected when your system language or timezone looks like mainland China, otherwise the official conda-forge channel; you can switch to either of the others, though on Windows TUNA fails every time from a path-length limit, which is why it is listed after USTC. **Picking the wrong one is not fatal** — if the chosen source fails, the remaining sources are tried in order automatically. |
| **View the full package list** | Read exactly which 22 packages are about to be installed. |
| **Advanced: edit the package list** | Add or remove conda packages in the prefilled list, one per line, `name=version` supported. Removing `python` or `r-base` fails the post-install check. |
| **Keep current environment** | Only appears once an environment is already installed. Reinstalling downloads the 850 MB again, so keep it unless you want a different package list. |

The workspace opens when the install finishes, but you cannot ask anything yet — the model key is yours to enter, as in step 3 above.
```

</details>

**依据 4 · 作者声明**：[README.md:109-122](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/README.md#L109-L122)

模型请求、遥测、存储与手动更新。

<details>
<summary>查看原文（14行）</summary>

```text
The window talks to a local host process on your own machine. The host owns one Python kernel and one R kernel per session, a bundled micromamba, and a project-level artifact store. Only model requests leave the machine, to the DeepSeek API with your key.

Everything else stays in `~/.papermachine`: sessions, artifacts, the installed environment, skills, and logs. Deleting that folder removes all of it.

PaperMachine sends three anonymous telemetry events (`app.launch`, `environment.installed`, `environment.install-failed`) carrying an app version, platform, and architecture, and no hostnames, paths, package lists, or error text. Set `DSH_TELEMETRY_DISABLED=1` to turn it off.

## Status and limitations

PaperMachine 0.1 is an early release. Known limitations:

- Analysis runs on macOS (Apple silicon and Intel) and Windows x64. Both platforms' sandbox enforcement is file-write confinement only — neither claims file-read, network, syscall, or scientific-validity isolation. Windows reports the weaker `partial` level, not macOS's `full`, because its restricted-token backend cannot close two gaps a full-enforcement backend does: an externally Everyone-writable object stays writable through it, and an NTFS hard link aliases a granted workspace file onto an external path (see [`dsh-sandbox-windows-acl`](packages/sandbox/sandbox-windows-acl/README.md), "Verified boundaries"). Cancelling or timing out a run on Windows always restarts its kernel and loses every variable that kernel held, where macOS usually survives an interrupt. Windows kernel execution's real-hardware evidence is one manual verification, not a repeatable CI gate. The Windows desktop first-launch flow (onboarding, environment download and install) has not yet been verified on Windows hardware; kernel execution has.
- A DeepSeek API key is required; the app ships no key.
- Neither installer carries a paid signing identity; the macOS package is ad-hoc signed since 0.1.1. See the notes above.
- Updates are manual: download the next installer.
```

</details>

#### 缺口

- 当前API价格、下载源可用性和制品与提交一致性未外部核验。
  **影响**：限制采用和效果结论。
  **进一步探讨**：获准试用时固定制品摘要和供应商条款，记录全部资源与网络。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些效果成立，什么条件下采用或退出？

**研究主题**：采用判断、效果与总成本、贡献与相对优势

#### 完整回答

源码足以支持science执行、状态及产物来源链的设计存在，适合能审阅Python/R的用户先做受控试用。最有价值的具体用法是用去敏CSV复刻一个已有正确答案的小分析：检查每步代码/日志、重启标记和图表版本，改一次图并回到原版。先限定macOS、本地非敏感数据、备份项目和可接受模型开销；Windows首次安装和恢复需另设验收。较普通聊天得到可追踪版本是可解释增量，较Notebook自动化省时、统计正确性和科研复现则未测。发现来源不能指向精确run、人工版被覆盖、取消后进程未知或结果不符合基准时停止扩大任务，保留日志/原数据并回Notebook脚本。此处建议有限trial，不表示生产或敏感科研采用，作者历史硬件记录不升级成本次执行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/science/science-runtime/src/index.ts:1014-1112](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/index.ts#L1014-L1112)

排队租约、漂移重绑、kernel获取、启动事件和取消句柄。

<details>
<summary>查看原文（99行）</summary>

```text
  async startRun(request: StartScienceRunRequest): Promise<ScienceRunHandle> {
    this.assertSession(request.session)
    this.assertHostLocal()
    // Queues behind another run/bind/annotate operation already holding
    // this Session's lease instead of rejecting outright — see
    // `reserveQueued`'s own doc. `environment`/the open-run check below are
    // read fresh AFTER the lease is granted, not from this pre-queue probe:
    // a call that queued behind a run has stale state by the time it
    // actually starts.
    const lease = await this.reserveQueued(request.session, request.signal, this.timeoutMs)
    let sessionScratch: ScienceSessionScratch | undefined
    let scratchPreparation: Awaited<ReturnType<typeof materializeSessionScratch>> | undefined
    let runScratch: Awaited<ReturnType<typeof createRunScratch>> | undefined
    try {
      const { projection, environment: appliedEnvironment } = this.assertIdleAppliedEnvironment(request.session, lease.control)
      const profile = this.profile(String(appliedEnvironment.profileId))
      let environment = appliedEnvironment
      // Cheap, non-probing per-run drift check (#15): another session's
      // `installPackages` call may have mutated this shared prefix without
      // ever touching this session's own binding (`installPackages` only
      // appends to the session that called it). A digest mismatch re-runs
      // the same re-observe/append path `installPackages` uses, so a
      // drifted prefix restarts this run's kernel (`environment-rebound`)
      // instead of silently executing against packages the durable
      // provenance never named.
      if (await prefixDrifted(environment)) {
        scratchPreparation = await materializeSessionScratch(this.dshHome, request.session)
        environment = (await this.reobserveAndMaybeRebind(request.session, profile, lease.control, 'drift')).environment
        this.assertPrepublication(request.session, lease.control)
      }
      const plan = planRun(environment, request.language, request.code)
      const projectId = await this.sessionProject(request.session)
      const preparedArtifacts = await prepareRunArtifacts(
        projection,
        this.ctx.scienceArtifactStore,
        projectId,
        request.artifactInputs,
        request.editBaselines,
        request.rasterArtifacts,
        this.inputMaxFilesPerRun,
        this.inputMaxBytesPerRun,
        lease.control.signal,
      )
      this.assertPrepublication(request.session, lease.control)
      if (scratchPreparation === undefined) {
        scratchPreparation = await materializeSessionScratch(this.dshHome, request.session)
      }
      sessionScratch = scratchPreparation.scratch
      await assertProfileRunConfinement(profile, request.session, sessionScratch.root)
      this.assertPrepublication(request.session, lease.control)
      if (request.language === 'r' && sessionScratch.runs.includes(' ')) {
        throw new ScienceRuntimeError('CONFINEMENT_UNAVAILABLE', 'R run directory cannot contain an ASCII space')
      }
      runScratch = await createRunScratch(sessionScratch, plan.runId, request.language, plan.sourceBytes)
      await materializeRunInputs(runScratch, preparedArtifacts.materialized)
      this.assertPrepublication(request.session, lease.control)
      const kernel = await this.acquireKernel(request.session, request.language, environment, sessionScratch, lease.control)
      // Disarmed immediately on acquisition, not only after run-started
      // commits: this run already owns the kernel the moment
      // `acquireKernel` resolves, before `run-started` actually appends, and the idle timer must
      // never fire in that window. `settlePublishedKernelRun`'s
      // own `finally` re-arms it once this run settles.
      this.kernels.disarmIdleTimer(request.session, request.language)
      this.assertPrepublication(request.session, lease.control)
      const started = startCandidate(
        plan,
        runScratch,
        request.language,
        environment,
        request.toolCallId,
        request.requestHeaderSeq,
        kernel.epoch,
        preparedArtifacts.inputs,
      )
      request.session.append('science/run-started', { version: 1, run: started })
      const done = this.settlePublishedKernelRun(
        lease,
        request.session,
        projectId,
        runScratch,
        kernel.process,
        started,
        preparedArtifacts,
      )
      return {
        runId: plan.runId,
        done,
        cancel: () => { lease.control.cancel() },
      }
    } catch (error) {
      const cleanupFailures: unknown[] = []
      try {
        if (sessionScratch !== undefined && runScratch !== undefined) {
          await removeUnpublishedRunScratch(sessionScratch, runScratch)
        }
      } catch (cleanupError) {
        cleanupFailures.push(cleanupError)
      }
      try {
```

</details>

**依据 2 · 源码核查**：[packages/science/science-runtime/src/execution.ts:188-240](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/execution.ts#L188-L240)

源代码字节与run身份、文件写入策略和最低执行级别。

<details>
<summary>查看原文（53行）</summary>

```text
export function planRun(
  environment: ScienceEnvironmentBinding,
  language: ScienceLanguage,
  code: string,
): RunPlan {
  const bytes = sourceBytes(code)
  const binding = selectBinding(environment, language)
  const runId = ScienceRunId(randomUUID())
  const scratchKey = ScienceScratchKey(sha256(Buffer.concat([
    Buffer.from(`dsh-science-scratch-v1\0${language}\0`, 'utf8'),
    bytes,
  ])))
  return {
    runId,
    sourceBytes: bytes,
    scratchKey,
    binding,
  }
}

/**
 * Fixed confinement policy rooted at exactly one canonical Science Session
 * scratch tree. Used for every persistent kernel spawn under that Session
 * (an interpreter probe's own policy is narrower, rooted at its probe
 * directory instead — see `environment.ts`).
 * @param session - exact live Session that owns the scratch tree.
 * @param scratch - that Session's private scratch paths.
 * @returns the fixed `workspace-write` sandbox policy.
 */
export function confinementPolicy(session: Session, scratch: ScienceSessionScratch): SandboxPolicy {
  return { mode: 'workspace-write', workspaceRoot: scratch.root, sessionId: session.id }
}

/**
 * Reject every prefix that may be written through the selected sandbox policy.
 * @param prefix - the observed binding's canonicalized Conda prefix.
 * @param policy - the confinement policy the prefix must stay outside of.
 * @throws {@link ScienceRuntimeError} (`CONFINEMENT_UNAVAILABLE`) when the prefix overlaps a writable root.
 */
export function assertPrefixReadOnly(prefix: string, policy: SandboxPolicy): void {
  for (const root of writableRoots(policy)) {
    if (pathsOverlap(prefix, root)) {
      throw new ScienceRuntimeError('CONFINEMENT_UNAVAILABLE', 'configured Conda prefix overlaps a sandbox writable root')
    }
  }
}

/**
 * Whether a confinement's reported enforcement satisfies a configured
 * minimum: `'full'` accepts only a `'full'` report; `'partial'` accepts
 * either `'full'` or `'partial'`. The sandbox provider itself never sees
 * this comparison — it always reports the level it actually achieved.
 * @param reported - enforcement level `SandboxProvider.confine` reported.
```

</details>

**依据 3 · 源码核查**：[packages/science/science-runtime/src/execution.ts:426-458](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/execution.ts#L426-L458)

两阶段等待终止，未证实静止保留eventualQuiescence。

<details>
<summary>查看原文（33行）</summary>

```text
export type Quiescence =
  | { readonly quiescent: true; readonly forced: boolean }
  | { readonly quiescent: false; readonly forced: true; readonly eventualQuiescence: Promise<boolean> }

/**
 * Wait briefly for a subprocess tree to exit on its own, then escalate
 * through the seam's one termination verb and wait again. Used by
 * persistent kernel teardown, both ordinary (`KernelProcess.end`) and
 * spawn-failure cleanup.
 * @param handle - the live subprocess handle to quiesce.
 * @returns whether the tree proved quiescent, whether termination was
 *   forced, and (when still unproven) the retained eventual-quiescence observation.
 */
export async function quiesce(handle: SubprocessHandle): Promise<Quiescence> {
  try {
    const grace = AbortSignal.timeout(DESCENDANT_GRACE_MS)
    if (await handle.waitForExit(grace)) return { quiescent: true, forced: false }
  } catch {
    // A provider that cannot answer the bounded observation has not proven the tree dead.
  }
  try {
    handle.terminate()
  } catch {
    return { quiescent: false, forced: true, eventualQuiescence: awaitEventualQuiescence(handle) }
  }
  try {
    const forced = AbortSignal.timeout(DESCENDANT_GRACE_MS)
    if (await handle.waitForExit(forced)) return { quiescent: true, forced: true }
  } catch {
    // Keep the exact-Session quarantine until the provider can later prove exit.
  }
  return { quiescent: false, forced: true, eventualQuiescence: awaitEventualQuiescence(handle) }
}
```

</details>

**依据 4 · 作者声明**：[README.md:119-123](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/README.md#L119-L123)

平台约束与Windows丢变量、作者手工硬件证据边界。

```text
- Analysis runs on macOS (Apple silicon and Intel) and Windows x64. Both platforms' sandbox enforcement is file-write confinement only — neither claims file-read, network, syscall, or scientific-validity isolation. Windows reports the weaker `partial` level, not macOS's `full`, because its restricted-token backend cannot close two gaps a full-enforcement backend does: an externally Everyone-writable object stays writable through it, and an NTFS hard link aliases a granted workspace file onto an external path (see [`dsh-sandbox-windows-acl`](packages/sandbox/sandbox-windows-acl/README.md), "Verified boundaries"). Cancelling or timing out a run on Windows always restarts its kernel and loses every variable that kernel held, where macOS usually survives an interrupt. Windows kernel execution's real-hardware evidence is one manual verification, not a repeatable CI gate. The Windows desktop first-launch flow (onboarding, environment download and install) has not yet been verified on Windows hardware; kernel execution has.
- A DeepSeek API key is required; the app ships no key.
- Neither installer carries a paid signing identity; the macOS package is ad-hoc signed since 0.1.1. See the notes above.
- Updates are manual: download the next installer.
- There is no variables panel yet; the kernel status bar shows each language's kernel state.
```

**依据 5 · 源码核查**：[packages/science/science-runtime/src/capture.ts:201-218](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/capture.ts#L201-L218)

允许格式和数量限制会使捕获不完整。

<details>
<summary>查看原文（18行）</summary>

```text
 */
export async function captureRunArtifacts(request: CaptureRunArtifactsRequest): Promise<CaptureRunArtifactsResult> {
  const { session, sourceRun, store, projectId } = request
  const walked = (await walkArtifactFiles(request.runArtifacts)).filter(isCaptureEligible).sort()
  const skippedRasterPaths = walked.filter((relativePath) => {
    const mediaType = captureMediaType(relativePath)
    /* v8 ignore next -- isCaptureEligible already required a mapped extension */
    if (mediaType === undefined) return false
    return !isRasterCaptureAllowed(relativePath, mediaType, request.rasterCapture, request.rasterArtifacts)
  })
  const eligible = walked.filter(relativePath => !skippedRasterPaths.includes(relativePath))
  if (eligible.some(relativePath => !isScienceLogicalName(relativePath))) {
    throw new ProjectArtifactStoreError('Science capture contains an invalid logical name', 'LOGICAL_NAME_INVALID')
  }
  const truncatedPerRun = eligible.length > request.captureMaxFilesPerRun
  const files = eligible.slice(0, request.captureMaxFilesPerRun)

  const captured: ScienceArtifactVersion[] = []
```

</details>

**依据 6 · 源码核查**：[packages/science/science-runtime/src/capture.ts:270-317](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/capture.ts#L270-L317)

边界路径、限量读、哈希与人工编辑保护。

<details>
<summary>查看原文（48行）</summary>

```text
      // between the walk and this check) — skip it, not a run failure.
      /* v8 ignore next -- a TOCTOU race, not deterministically reproducible; mirrors the accepted crash-between-commit-and-capture gap */
      continue
    }
    const entry = await lstat(canonical)
    // Re-verify kind defensively: walkArtifactFiles already required a
    // regular non-symlink entry, so only a TOCTOU race changes that before
    // this re-check (same non-reproducible race as the branch above).
    /* v8 ignore next */
    if (!entry.isFile() || entry.isSymbolicLink()) continue
    // A bounded read never pulls more than captureMaxFileBytes + 1 bytes
    // into memory, so an oversized file is caught by its returned length
    // rather than a separate stat-based pre-check (artifact-file.ts).
    const data = await readBoundedFile(canonical, request.captureMaxFileBytes)
    if (data.byteLength > request.captureMaxFileBytes) {
      skippedOversizedCount += 1
      continue
    }
    const sha256 = createHash('sha256').update(data).digest('hex')

    const localKnown = projection.artifacts.filter(candidate => candidate.logicalName === relativePath)
    const localLatest = localKnown.at(-1)
    let artifactId = localLatest?.artifactId ?? await projectArtifactIdFor(relativePath)

    if (artifactId !== undefined) {
      // The store, not this session's own local history, is the sole
      // authority for a version's content_origin and sha256 (T1's authority
      // rule) — both the same-content skip and the human-edit stale-skip
      // below read the store's current head and history rather than
      // `localKnown`, which no longer carries either fact and would also
      // miss a head another session advanced.
      const head = await store.getLatestVersion(projectId, artifactId)
      // An artifactId resolved here (from this session's own fold or D7's
      // listArtifacts lookup) always names a real, already-committed store
      // row, which always has a latest version.
      /* v8 ignore next */
      if (head !== undefined) {
        if (head.sha256 === sha256) continue
        if (head.contentOrigin === 'human-edit' && request.editBaselines?.has(relativePath) !== true) {
          const history = await store.listVersions(projectId, artifactId)
          const latestRunProduced = history.findLast(candidate => candidate.contentOrigin !== 'human-edit')
          if (latestRunProduced?.sha256 === sha256) continue
        }
      }
    }

    const parent = request.editBaselines?.get(relativePath)
    let parentVersionId: ScienceVersionId | undefined
```

</details>

#### 缺口

- 本轮没有安装、构建、目标测试或真实分析执行。
  **影响**：限制采用和效果结论。
  **进一步探讨**：固定简单金标任务完成端到端及备份恢复后再考虑扩大。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能提出什么可证伪改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

从kernel隐式状态、环境漂移及store/event分离推导未验证的“可重放分析交付”假设：导出不可变输入摘要、代码次序、随机种子/依赖锁、每个版本与run事件、未捕获原因，并在全新kernel和同环境重放后比较数据表与容差化图形。其相对现有provenance的增量是把可查看来源变成可执行验收；不计入已有贡献。最小实验用固定种子CSV分析、跨轮依赖变量、修改共享prefix、人工改图和store/event间崩溃。若清洁kernel可重现数值、人工版保留且遗漏明确，才支持复现价值；若依赖隐藏状态、丢输入、orphan未显示或错误统计仍通过验收，就推翻充分性。即使字节重放一致也不证明研究设计或因果结论正确，还需领域审阅；锁环境与存储可能增加成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/science/science-runtime/src/index.ts:1014-1112](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/index.ts#L1014-L1112)

排队租约、漂移重绑、kernel获取、启动事件和取消句柄。

<details>
<summary>查看原文（99行）</summary>

```text
  async startRun(request: StartScienceRunRequest): Promise<ScienceRunHandle> {
    this.assertSession(request.session)
    this.assertHostLocal()
    // Queues behind another run/bind/annotate operation already holding
    // this Session's lease instead of rejecting outright — see
    // `reserveQueued`'s own doc. `environment`/the open-run check below are
    // read fresh AFTER the lease is granted, not from this pre-queue probe:
    // a call that queued behind a run has stale state by the time it
    // actually starts.
    const lease = await this.reserveQueued(request.session, request.signal, this.timeoutMs)
    let sessionScratch: ScienceSessionScratch | undefined
    let scratchPreparation: Awaited<ReturnType<typeof materializeSessionScratch>> | undefined
    let runScratch: Awaited<ReturnType<typeof createRunScratch>> | undefined
    try {
      const { projection, environment: appliedEnvironment } = this.assertIdleAppliedEnvironment(request.session, lease.control)
      const profile = this.profile(String(appliedEnvironment.profileId))
      let environment = appliedEnvironment
      // Cheap, non-probing per-run drift check (#15): another session's
      // `installPackages` call may have mutated this shared prefix without
      // ever touching this session's own binding (`installPackages` only
      // appends to the session that called it). A digest mismatch re-runs
      // the same re-observe/append path `installPackages` uses, so a
      // drifted prefix restarts this run's kernel (`environment-rebound`)
      // instead of silently executing against packages the durable
      // provenance never named.
      if (await prefixDrifted(environment)) {
        scratchPreparation = await materializeSessionScratch(this.dshHome, request.session)
        environment = (await this.reobserveAndMaybeRebind(request.session, profile, lease.control, 'drift')).environment
        this.assertPrepublication(request.session, lease.control)
      }
      const plan = planRun(environment, request.language, request.code)
      const projectId = await this.sessionProject(request.session)
      const preparedArtifacts = await prepareRunArtifacts(
        projection,
        this.ctx.scienceArtifactStore,
        projectId,
        request.artifactInputs,
        request.editBaselines,
        request.rasterArtifacts,
        this.inputMaxFilesPerRun,
        this.inputMaxBytesPerRun,
        lease.control.signal,
      )
      this.assertPrepublication(request.session, lease.control)
      if (scratchPreparation === undefined) {
        scratchPreparation = await materializeSessionScratch(this.dshHome, request.session)
      }
      sessionScratch = scratchPreparation.scratch
      await assertProfileRunConfinement(profile, request.session, sessionScratch.root)
      this.assertPrepublication(request.session, lease.control)
      if (request.language === 'r' && sessionScratch.runs.includes(' ')) {
        throw new ScienceRuntimeError('CONFINEMENT_UNAVAILABLE', 'R run directory cannot contain an ASCII space')
      }
      runScratch = await createRunScratch(sessionScratch, plan.runId, request.language, plan.sourceBytes)
      await materializeRunInputs(runScratch, preparedArtifacts.materialized)
      this.assertPrepublication(request.session, lease.control)
      const kernel = await this.acquireKernel(request.session, request.language, environment, sessionScratch, lease.control)
      // Disarmed immediately on acquisition, not only after run-started
      // commits: this run already owns the kernel the moment
      // `acquireKernel` resolves, before `run-started` actually appends, and the idle timer must
      // never fire in that window. `settlePublishedKernelRun`'s
      // own `finally` re-arms it once this run settles.
      this.kernels.disarmIdleTimer(request.session, request.language)
      this.assertPrepublication(request.session, lease.control)
      const started = startCandidate(
        plan,
        runScratch,
        request.language,
        environment,
        request.toolCallId,
        request.requestHeaderSeq,
        kernel.epoch,
        preparedArtifacts.inputs,
      )
      request.session.append('science/run-started', { version: 1, run: started })
      const done = this.settlePublishedKernelRun(
        lease,
        request.session,
        projectId,
        runScratch,
        kernel.process,
        started,
        preparedArtifacts,
      )
      return {
        runId: plan.runId,
        done,
        cancel: () => { lease.control.cancel() },
      }
    } catch (error) {
      const cleanupFailures: unknown[] = []
      try {
        if (sessionScratch !== undefined && runScratch !== undefined) {
          await removeUnpublishedRunScratch(sessionScratch, runScratch)
        }
      } catch (cleanupError) {
        cleanupFailures.push(cleanupError)
      }
      try {
```

</details>

**依据 2 · 源码核查**：[packages/science/science-runtime/src/execution.ts:188-240](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/execution.ts#L188-L240)

源代码字节与run身份、文件写入策略和最低执行级别。

<details>
<summary>查看原文（53行）</summary>

```text
export function planRun(
  environment: ScienceEnvironmentBinding,
  language: ScienceLanguage,
  code: string,
): RunPlan {
  const bytes = sourceBytes(code)
  const binding = selectBinding(environment, language)
  const runId = ScienceRunId(randomUUID())
  const scratchKey = ScienceScratchKey(sha256(Buffer.concat([
    Buffer.from(`dsh-science-scratch-v1\0${language}\0`, 'utf8'),
    bytes,
  ])))
  return {
    runId,
    sourceBytes: bytes,
    scratchKey,
    binding,
  }
}

/**
 * Fixed confinement policy rooted at exactly one canonical Science Session
 * scratch tree. Used for every persistent kernel spawn under that Session
 * (an interpreter probe's own policy is narrower, rooted at its probe
 * directory instead — see `environment.ts`).
 * @param session - exact live Session that owns the scratch tree.
 * @param scratch - that Session's private scratch paths.
 * @returns the fixed `workspace-write` sandbox policy.
 */
export function confinementPolicy(session: Session, scratch: ScienceSessionScratch): SandboxPolicy {
  return { mode: 'workspace-write', workspaceRoot: scratch.root, sessionId: session.id }
}

/**
 * Reject every prefix that may be written through the selected sandbox policy.
 * @param prefix - the observed binding's canonicalized Conda prefix.
 * @param policy - the confinement policy the prefix must stay outside of.
 * @throws {@link ScienceRuntimeError} (`CONFINEMENT_UNAVAILABLE`) when the prefix overlaps a writable root.
 */
export function assertPrefixReadOnly(prefix: string, policy: SandboxPolicy): void {
  for (const root of writableRoots(policy)) {
    if (pathsOverlap(prefix, root)) {
      throw new ScienceRuntimeError('CONFINEMENT_UNAVAILABLE', 'configured Conda prefix overlaps a sandbox writable root')
    }
  }
}

/**
 * Whether a confinement's reported enforcement satisfies a configured
 * minimum: `'full'` accepts only a `'full'` report; `'partial'` accepts
 * either `'full'` or `'partial'`. The sandbox provider itself never sees
 * this comparison — it always reports the level it actually achieved.
 * @param reported - enforcement level `SandboxProvider.confine` reported.
```

</details>

**依据 3 · 源码核查**：[packages/science/science-runtime/src/capture.ts:332-411](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-runtime/src/capture.ts#L332-L411)

环境/run/调用来源、先store后事件，拒绝事件标orphan并停止。

<details>
<summary>查看原文（80行）</summary>

```text
    const provenance = {
      producerRunId: String(sourceRun.runId),
      producerToolCallId: String(sourceRun.toolCallId),
      producerRequestHeaderSeq: sourceRun.requestHeaderSeq,
      environmentRevision: sourceRun.environmentRevision,
      environmentFingerprint: sourceRun.environmentFingerprint,
      producerTurn,
      ...parentVersionId === undefined ? {} : { baseVersionId: parentVersionId },
      ...figureState === undefined ? {} : { figureState },
    }

    // The store row commits before its session event: the event carries the
    // validated store coordinates as fact (S0's Host-side pre-commit rule).
    let stored: VersionRecord
    if (artifactId !== undefined) {
      stored = await store.appendVersion(projectId, artifactId, { producerSessionId: session.id, data, mediaType, contentOrigin: 'run-auto', ...provenance })
    } else {
      try {
        stored = (await store.createArtifact(projectId, {
          logicalName: relativePath,
          kind: artifactKindForMediaType(mediaType),
          originSessionId: session.id,
          data,
          mediaType,
          contentOrigin: 'run-auto',
          ...provenance,
        })).version
      } catch (error) {
        // A different session raced this same logical name into existence
        // between this walk's D7 lookup and this create call — the store's
        // own UNIQUE(owningProjectId, logicalName) constraint is the true
        // serialization point; re-resolve and append onto the winner rather
        // than failing this file.
        if (!(error instanceof ProjectArtifactStoreError) || error.code !== 'LOGICAL_NAME_CONFLICT') throw error
        const known = await store.listArtifacts(projectId)
        const winner = known.find(candidate => candidate.logicalName === relativePath)
        /* v8 ignore next 3 -- the conflict error itself proves a row with this logicalName now exists */
        if (winner === undefined) throw error
        artifactId = winner.artifactId
        stored = await store.appendVersion(projectId, artifactId, { producerSessionId: session.id, data, mediaType, contentOrigin: 'run-auto', ...provenance })
      }
    }

    const title = basename(relativePath)
    await store.annotateVersion(projectId, stored.versionId, { actor: 'capture', sessionId: session.id, title })

    const artifact: ScienceArtifactVersion = {
      artifactId: stored.artifactId,
      logicalName: relativePath,
      // New content always opens the next version; the store's per-artifact
      // ordinal is that version number, so the log and the index agree.
      version: stored.ordinal,
      title,
      projectId,
      versionId: stored.versionId,
      sha256: stored.sha256,
      seenAt: Date.now(),
    }
    let appended
    try {
      appended = session.append('science/artifact-saved', { version: 1, artifact })
    } catch {
      // The Session detached (or otherwise refused the append) between the
      // walk starting and this file's commit: remaining eligible files in
      // this run stay uncaptured with no automatic retry, and the store row
      // just written is marked orphan immediately rather than left for a
      // later reconciliation pass to discover. `appendFailed` on the
      // returned result is this fact's only signal to the caller
      // (`ScienceRuntime.captureAfterFinish`, which logs it).
      appendFailed = true
      try {
        await store.setVersionHealth(projectId, stored.versionId, { orphan: true })
      } catch {
        // The append already failed for this file; a health-marking failure
        // on top of it leaves the row for the next reconciliation pass
        // instead of compounding this walk's error.
      }
      break
    }
    for (const event of session.snapshotEvents().slice(state.nextSeq, appended.seq + 1)) {
```

</details>

**依据 4 · 源码核查**：[packages/science/science-artifact-store/src/store.ts:386-449](https://github.com/SuperJJ007/papermachine/blob/b7f095ed665d3c0693006d20fbf0ad33f061cf82/packages/science/science-artifact-store/src/store.ts#L386-L449)

SQLite写事务生成版本序号并更新head。

<details>
<summary>查看原文（64行）</summary>

```text
  async createArtifact(projectId: ProjectId, input: CreateArtifactInput): Promise<{ artifact: ArtifactRecord; version: VersionRecord }> {
    if (!isScienceLogicalName(input.logicalName)) {
      throw new ProjectArtifactStoreError('logicalName must be a forward-slash relative artifact path', 'LOGICAL_NAME_INVALID')
    }
    const db = await this.connectionFor(projectId)
    const root = await this.rootFor(projectId)
    const { sha256, byteCount } = await admitBlob(root, input.data)
    const artifactId = ArtifactId(randomUUID())
    const versionId = VersionId(randomUUID())
    const now = Date.now()
    runWriteTransaction(db, () => {
      const conflict = db.prepare('SELECT 1 FROM artifacts WHERE owning_project_id = ? AND logical_name = ?').get(String(projectId), input.logicalName)
      if (conflict !== undefined) {
        throw new ProjectArtifactStoreError(`an artifact named "${input.logicalName}" already exists in project "${projectId}"`, 'LOGICAL_NAME_CONFLICT')
      }
      db.prepare(`
        INSERT INTO artifacts (artifact_id, owning_project_id, origin_session_id, logical_name, kind, latest_version_id, created_at)
        VALUES (?, ?, ?, ?, ?, NULL, ?)
      `).run(artifactId, String(projectId), input.originSessionId, input.logicalName, input.kind, now)
      this.insertProducedVersion(db, versionId, artifactId, 1, input, input.originSessionId, sha256, byteCount, now)
      db.prepare('UPDATE artifacts SET latest_version_id = ? WHERE artifact_id = ?').run(versionId, artifactId)
      if (input.figureState !== undefined) this.insertFigureState(db, versionId, input.figureState)
    })
    return { artifact: this.getArtifactRow(db, artifactId), version: this.getVersionRow(db, versionId) }
  }

  /**
   * Append a new version onto an existing artifact. The write transaction is
   * the linearization point: it reads the artifact's current latest version
   * only to compute the next ordinal, inserts the new version, and updates
   * latest — so two concurrent appends serialize on this transaction and the
   * later committer becomes latest, never forking. `baseVersionId` is never
   * defaulted from the artifact's latest version: an omitted baseline means
   * a plain chain continuation, not "no opinion" (see `VersionRecord.baseVersionId`).
   * @param projectId - the owning project; its store is opened if not already.
   * @param artifactId - the artifact to append to.
   * @param input - the new version's bytes, provenance, and optional explicit baseline.
   * @returns the appended version.
   * @throws {@link ProjectArtifactStoreError} with code `ARTIFACT_NOT_FOUND` when no such artifact exists in this project.
   */
  async appendVersion(projectId: ProjectId, artifactId: ArtifactId, input: AppendVersionInput): Promise<VersionRecord> {
    const db = await this.connectionFor(projectId)
    const root = await this.rootFor(projectId)
    const { sha256, byteCount } = await admitBlob(root, input.data)
    const versionId = VersionId(randomUUID())
    const now = Date.now()
    runWriteTransaction(db, () => {
      const artifactRow = db.prepare('SELECT artifact_id FROM artifacts WHERE artifact_id = ?').get(artifactId) as { artifact_id: string } | undefined
      if (artifactRow === undefined) {
        throw new ProjectArtifactStoreError(`artifact "${artifactId}" was not found in project "${projectId}"`, 'ARTIFACT_NOT_FOUND')
      }
      const ordinalRow = db.prepare('SELECT COALESCE(MAX(ordinal), 0) AS max_ordinal FROM versions WHERE artifact_id = ?')
        .get(artifactId) as { max_ordinal: number }
      const ordinal = ordinalRow.max_ordinal + 1
      this.insertProducedVersion(db, versionId, artifactId, ordinal, input, input.producerSessionId, sha256, byteCount, now)
      db.prepare('UPDATE artifacts SET latest_version_id = ? WHERE artifact_id = ?').run(versionId, artifactId)
      if (input.figureState !== undefined) this.insertFigureState(db, versionId, input.figureState)
    })
    return this.getVersionRow(db, versionId)
  }

  /** Reject auto-capture metadata after a version's first annotation. */
  private assertAnnotationActorAllowed(versionId: VersionId, alreadyAnnotated: boolean, actor: AnnotationActor): void {
    if (actor !== 'capture' || !alreadyAnnotated) return
```

</details>

#### 缺口

- 重放包与科学验收未实现和验证。
  **影响**：限制采用和效果结论。
  **进一步探讨**：先验证状态/崩溃反例，再和Notebook比较总审阅负担。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
