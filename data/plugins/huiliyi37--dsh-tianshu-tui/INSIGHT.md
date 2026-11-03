# dsh-tianshu-tui

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[446bfe3](https://github.com/huiliyi37/dsh-tianshu-tui/tree/446bfe373c962aa83e04b36a16da4f8588458242)

<!-- BEGIN META -->
[![GitHub ★ 297](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=297&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huiliyi37/dsh-tianshu-tui) [![npm 30d 2,075](https://img.shields.io/static/v1?label=npm+30d&message=2%2C075&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供流式消息、工具卡、会话操作和 LSP 诊断的交互式终端界面。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把移植渲染核心、宿主输入、只读投影和生命周期整合为终端工作面。增量是 DSH 接缝与交互组织，模型执行和大部分工具归属宿主/依赖，不把主题数或移植算法当原创。

> **主要限制**：[Q03](#research-q03) 表明整个 bundle 超出外观替换，审批白名单会直接放行，npm 启动更新会改 profile；skip 检查发生在 latest 获取之后，不能保证无查询。[Q02](#research-q02) 的本地排队也不等于指令已持久投递。

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
  - [Q01 · 谁需要终端工作面，实际增量由本包还是宿主提供？](#detail-section-11)
  - [Q02 · 输入、排队、事件和退出怎样保持会话权威？](#detail-section-12)
  - [Q03 · 审批快捷方式和自动更新会改变哪些用户预期？](#detail-section-13)
  - [Q04 · 启动、LSP 与可选能力分别依赖什么，失败由谁处理？](#detail-section-14)
  - [Q05 · 集中交互是否改善合格任务，总成本与采用条件是什么？](#detail-section-15)
  - [Q06 · 如何让用户更准确理解会话授权和环境变更？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向在终端反复输入、读工具、审批和切换会话的 DSH 开发者；验收以准确投递、状态一致及最终文件正确为准。

继续使用现有 DSH 入口或浏览器 UI 可避免额外终端 profile 与依赖。本次仅比较可见机制和流程，不宣称竞品/宿主效率排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 流式终端工作面 | 在终端读取消息、工具和状态 | 消费宿主事件，终端表现未运行验收 |
| 普通输入与排队 | 运行时暂存下一条任务 | 本地队列未进宿主持久 inbox，切会话会丢弃并提示 |
| 中轮转向与取消 | 通过 Agent 公开控制面调整任务 | 取消不证明已经发生的外部副作用回滚 |
| 审批卡与会话授权 | 明确放行、拒绝或记住工具/前缀 | 本地白名单可短路逐卡确认，切会话复位 |
| LSP 诊断显示 | 查看触碰文件的诊断 | 语言服务与首次创建目录约束，失败不阻塞工具 |
| 启动更新提示与重启 | 发现并生效 npm 更新 | 可改 profile，开关检查晚于 latest 获取 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19 或 >=24、官方宿主 0.2.1-rc.4 | 启动必需 | 匹配包和 host API | 作者明确警示 alpha 不兼容；实际环境未验收 |
| sessions、agents、agentDefaultModel | 启动必需 | 会话与输入控制 | 必选注入未就绪则不挂载 |
| profile 与预设注册/模型配置 | 完成任务必需 | 创建有工具的会话 | 需核查预设挂载和模型凭据，不以欢迎页当任务成功 |
| TTY 与终端协议 | 交互必需 | 键盘、ANSI、图片与宽字符显示 | 兼容和降级因终端而异，未实测 |
| LSP provider 与语言 server | 特定功能必需 | 模型导航和诊断显示 | 默认 npx 可能联网，失败需核查语言与项目目录 |
| attachments 与识图模型/视觉桥 | 图片输入必需 | 保存并解释图片 | 缺服务会报错或不发图片；vision-ask 独立 |
| npm registry 与包管理器 | 自动更新必需 | 读取 latest、改 profile | 失败提示但回滚未知；skip 不保证无查询 |

[Q04](#research-q04) 区分模型 LSP 工具面和 TUI 诊断显示；optional 服务降级不等于全部核心能力失效。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定宿主和插件版本，使用独立 profile、可丢弃目录 | 核对兼容、模型与更新策略；不直接套用可变标签 |
| 挂载 | 宿主应用 bundle 并提供必选服务 | 能看到会话且实际可投递，缺工具先查预设 |
| 任务 | 用户以普通审批输入，后台由 Agent 执行、TUI 投影 | 按文件/日志核验；排队回显不当作已投递 |
| 中断与恢复 | 用户取消、确认未发队列再切会话 | 核查已有副作用，避免凭界面盲目重发 |
| 退出 | TUI 尽力 flush、释放自有 handle 与终端状态 | 终端可继续输入；持久化失败需查宿主记录 |

[Q02](#research-q02) 给出输入、所有权和清理的具体机制，取消不承诺外部事务回滚。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 依赖下载、模型服务和存储，金额未知 | 配置 profile/版本/权限及终端，耗时未知 | 版本匹配与核心投递需核对 |
| 持续使用 | 模型调用、LSP 进程、诊断和缓存，资源量未知 | 阅读状态、审批及升级适配 | 无节时/节费数据，不能把渲染节流当模型省费 |
| 失败恢复 | 重试可能重复模型/工具开销，金额未知 | 对账本地队列、宿主日志和文件，核查部分安装 | 取消或安装超时不证明副作用回滚 |
| 升级与退出 | 更新依赖和 profile 存储，量未知 | 固定/恢复版本并停用独立 profile | 退出终端清理是尽力机制，不替代任务验收 |

[Q05](#research-q05) 以合格修改任务为单位；未测总尝试和合格数，不输出有限单位成本。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中终端交互 | 源码接入输入、队列、审批与事件投影 | 对目标人群是否减少总时间和错误 |
| 渲染频率控制 | WriteBatcher 合并请求并限制刷新间隔 | 实际帧时、CPU、SSH/各终端表现 |
| 会话和退出清理 | 解绑投影、复位授权并尽力 flush | 崩溃/断电后的完整恢复与最终副作用 |
| 模型任务结果 | 执行交由宿主，TUI 展示其结果 | 没有同条件质量、节费或 ROI 对照 |

便利需要与 [Q03](#research-q03) 的授权/环境变化和 [Q04](#research-q04) 的服务负担共同评估。

> **思考**：[Q03](#research-q03) 表明整个 bundle 超出外观替换，审批白名单会直接放行，npm 启动更新会改 profile；skip 检查发生在 latest 获取之后，不能保证无查询。[Q02](#research-q02) 的本地排队也不等于指令已持久投递。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把移植渲染核心、宿主输入、只读投影和生命周期整合为终端工作面。增量是 DSH 接缝与交互组织，模型执行和大部分工具归属宿主/依赖，不把主题数或移植算法当原创。

[Q02](#research-q02) 的公开输入、纯投影、handle 所有权及帧合并值得复用；[Q03](#research-q03) 的授权复位和挂起取消有明确机制。移植需核宿主事件契约、TTY与生命周期；self-update 开关顺序及 profile 失败恢复应单独审阅，不能从模块分层推断全包无副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明整个 bundle 超出外观替换，审批白名单会直接放行，npm 启动更新会改 profile；skip 检查发生在 latest 获取之后，不能保证无查询。[Q02](#research-q02) 的本地排队也不等于指令已持久投递。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先在独立 profile、固定版本和可丢弃目录用普通逐卡审批做一处受控修改，确认指令已投递后再测取消、切会话与退出。若状态/授权/安装行为超出预期，停用此 profile，回到原入口核对宿主日志和文件，避免盲目重发。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持原生 runner、公开输入与事件投影、队列、审批短路、清理及更新/LSP 装配；目标环境与任务收益未运行验收。授权与版本摘要是待验证设计假设。

- 已检查：作者 README、包清单、源码路径 ADAPTER.md、README.md、SOURCE-MAP.md、cordis.patch.yml、package.json、src/adapter/live.ts、src/adapter/send.ts、src/controllers/approval-controller.ts、src/engine/write-batcher.ts、src/index.ts、src/self-update.ts、src/ui/app.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查根组件的 runner、bundle、输入/投影/队列、审批、退出、自更新与 LSP 装配；未穷尽所有 slash、提供者凭据、终端协议、预设工具或伴生 vision-ask/memory 的实现。
- 下一步：未执行目标代码、安装、插件测试、真实宿主或模型任务；后续可在授权隔离环境按同一任务核输入/审批/切换、更新网络与版本、生效目录和终端退出，比较错误、耗时及维护负担。

**分析版本**

- **仓库**：[huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui)
- **版本号**：1.0.0-rc.4（[固定提交 446bfe3](https://github.com/huiliyi37/dsh-tianshu-tui/tree/446bfe373c962aa83e04b36a16da4f8588458242)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出把当前工具/前缀授权和运行/安装版本合到可展开摘要，检验能否减少误放行或误判版本。现有模式、白名单读取和更新通知已存在，新增价值未验证。

未执行目标代码、安装、插件测试、真实宿主或模型任务；后续可在授权隔离环境按同一任务核输入/审批/切换、更新网络与版本、生效目录和终端退出，比较错误、耗时及维护负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 3381 | — | — | 47889 |
| .js | source | 2 | 31910 | 24807 | 7179 | — |
| .ts | source | 188 | 41791 | 27982 | 11089 | — |
| .mjs | source | 4 | 887 | 626 | 211 | — |
| .ts | test | 166 | 41660 | 35043 | 2973 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-03），可前往 [GitHub Issues](https://github.com/huiliyi37/dsh-tianshu-tui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：偏好终端的开发者能否在状态、授权与环境变更可解释的条件下用天枢 TUI 集中完成 DSH 编程交互，付出的维护负担是否值得？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要终端工作面，实际增量由本包还是宿主提供？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常在终端使用 DSH、需要一边输入一边观察工具和审批、又能维护独立 profile 的开发者，是本包的直接对象。原办法是继续用宿主默认入口或浏览器 UI；本包把流式文本、工具卡、队列、会话与工程诊断放到键盘工作面。合格结果应是提示准确投递、状态与日志一致、审批范围可理解、切换和退出后仍能继续工作，而非界面主题丰富。README 的流畅和完整体验属于作者主张，用户需求强度、实际节时和少出错仍缺同条件对照。

package 明确 runtime=host，入口导出 Cordis apply，patch 插入稳定名 tui-runner，因此它是原生 DSH 插件及 profile bundle，不是独立 CLI。bundle 同时挂预设注册表、LSP 与工具接缝，纯展示的描述只适用于渲染核心的职责，不能据此认为整个安装只改颜色。Agent 执行、模型能力与大部分工具由宿主/依赖提供。

SOURCE-MAP 将渲染核心说明为作者天枢引擎的移植，ported/modified/new 是来源说明，且明确不主张字节同一性。本次识别的贡献是把成熟终端渲染与 DSH 输入、事件和生命周期接好，而不是新 Agent 算法。对于现有界面已足够或依赖浏览器功能的用户，换工作面可能只增加维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-31](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/README.md#L18-L31)

作者定位与能力主张。

<details>
<summary>查看原文（14行）</summary>

```text
`dsh-tianshu-tui` 是官方 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的交互式终端 UI 插件。自研轻量 ANSI 渲染引擎，提供流式 Markdown、工具卡、会话恢复与回退、图片与视觉桥、LSP 诊断、16 个主题，以及完整的 slash 命令和快捷键体系。

它是一个**纯展示层插件**：agent 状态来自会话事件流，不另建一套 agent 循环，也不向模型偷偷注入 prompt 或工具。

## 核心体验

| 能力 | 你可以做什么 |
|---|---|
| **流畅对话与工具视图** | 流式 Markdown、推理过程折叠、并行工具分组、结构化 diff、回合耗时与 token 指标 |
| **完整会话工作区** | 恢复、切换、分叉、回退、导出会话；运行中排队，或通过 `/steer` 即时纠偏 |
| **高效输入** | slash 菜单、`@` 路径补全、历史搜索、多行粘贴、外部编辑器，以及可选 Vim 键位 |
| **图片与视觉** | 粘贴并内联预览图片；识图模型直接接收，文本模型可经视觉桥获得图片描述 |
| **Agent 控制面板** | 审批 diff、plan 模式、目标、任务、技能、子代理与 workflow 状态集中呈现 |
| **可定制的开发环境** | 16 个主题、LSP 诊断、项目记忆、MCP 浏览、模型与推理等级热切换 |
```

</details>

**依据 2 · 源码核查**：[package.json:55-60](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/package.json#L55-L60)

host runtime 与 bundle patch 入口。

```text
  "dsh": {
    "runtime": "host",
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

**依据 3 · 源码核查**：[src/index.ts:1-23](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/index.ts#L1-L23)

移植渲染核心和稳定 runner 名称。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * @huiliyi37/dsh-tianshu-tui — interactive terminal UI profile bundle. The bundle
 * patch rides over dsh-base and inserts this runner under the stable
 * `tui-runner` id. Render core: the terminal rendering engine ported from
 * `.rivet/tui-source/tui/` (Apache-2.0 source; see SOURCE-MAP.md for the
 * per-file mapping). The engine is pure presentation — all agent state arrives
 * via {@link TuiPort}.
 *
 * @module @huiliyi37/dsh-tianshu-tui
 */

import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type { ReadStream, WriteStream } from 'node:tty'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { KeyName } from './engine/input-handler.js'
import { runSelfUpdate } from './self-update.js'
import { spawnSelfRestart } from './restart.js'
import { loadCustomThemes } from './theme-custom.js'
import { TuiApp } from './ui/app.js'

/** Stable Cordis plugin name the bundle patch inserts. */
export const name = 'tui-runner'
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:12-30](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/cordis.patch.yml#L12-L30)

runner 与宿主接缝装配，不只是渲染函数。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    - id: tui-runner
      name: '@huiliyi37/dsh-tianshu-tui'

    # rc.1 起 standard preset 的 tool-subagent 行开 modelSelectionSettings: true，
    # 要求 Host scope 有 model-selection-settings 服务（官方 web-app 有、dsh-base
    # 无）——不挂则 standard 挂载整体失败、会话无工具面。shipped 组成默认关。
    - id: subagent-model-selection-settings
      name: '@deepseek-ai/dsh-tool-subagent/model-selection-settings'

    - id: cordis-host-runner
      name: '@deepseek-ai/dsh-cordis-host-runner'

    # Process-global inspect providers read by the cordis preset's tool-cordis row.
    - id: cordis-inspect-providers
      name: '@deepseek-ai/dsh-tool-cordis/host'

    # 0.2.1 的 schedule 工具依赖 Web sessionController；base TUI 不挂该服务，
    # 因此 standard/ptc/cordis 不同步 schedule 行，避免 Loader 永久 pending。
```

</details>

**依据 5 · 作者声明**：[SOURCE-MAP.md:3-13](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/SOURCE-MAP.md#L3-L13)

来源归属说明及不主张字节同一性。

<details>
<summary>查看原文（11行）</summary>

```text
本包渲染核心移植自天枢（Tianshu，曾用代号 Rivet）终端 UI 引擎，Apache License 2.0：

- 上游：https://github.com/huiliyi37/Tianshu-Tui（`src/tui/` 子树）
- port 时点：本仓提交 `b26ebed`（2026-08-10）自上游 `src/tui` @ `bc2aa2a0c` 移植；上游快照不随仓分发
- 上游版权：Apache License 2.0, Copyright 2025-2026 Tianshu Contributors（许可全文见 `LICENSE`；再分发与修改声明见 `NOTICE`）

状态图例（封闭枚举；`tests/source-map.spec.ts` 校验 src 全覆盖与取值合法，不做同一性核验）：

- `ported` — 自上游对应文件移植，port 后无本地改动。**不主张字节同一性**：上游快照不在仓内，无法机械核验；port 期的 lint 适配若产生差异则该文件归 `modified`。
- `modified` — 移植后为 dsh 接缝适配过；Apache §4(b) 的修改声明集中记录于本表与 `NOTICE`。
- `new` — dsh 原创，非上游作品的一部分（与本包其余部分同按 Apache-2.0 分发）。
```

</details>

#### 缺口

- 缺少目标人群的重复任务、偏好及同条件对照数据。
  **影响**：不能确认界面切换减少会转化为端到端收益。
  **进一步探讨**：在固定宿主、模型、终端和任务下比较原入口与 TUI 的完成质量、审批错误、交互时间和退出恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入、排队、事件和退出怎样保持会话权威？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

用户输入最终经 Agent 公开 followup/steer/inject/cancel 接口进入宿主，而不是由 TUI 伪造会话事件。有图片时先由 attachments 保存，再把稳定引用放进消息；所以 followup 返回表示附件已存且输入入队，不能当作业务任务完成。live 模块由 agent 事件构造本地投影，活动工具按 callId 消除；这可复用为读模型与执行权威分层，移植时仍须适配宿主事件和所有权契约。

运行中的普通提交先留在 TUI 内存队列；turn/end 非中止路径才 drain 并发送，中止保留队列供取回，切会话则明确提示丢弃未发送项。这个便利以本地暂存为代价，屏上排队消息并不等于已经进入宿主持久 inbox。重要指令应确认已经投递再离开；不能把会话恢复能力解释成自动恢复尚未发送队列。

退出先尝试 flushAll，释放审批、提问、投影和本层持有的 handle，再停止 LSP 与输入、恢复光标；非自有 agent 不直接 dispose。flush 失败被捕获以便退出，故这属于尽力收尾而非落盘保证。WriteBatcher 合并帧并限制约 16ms 最小间隔，能解释渲染设计，不能证明所有终端都流畅。常规加载、崩溃和终端兼容未执行，未覆盖的外部副作用仍需以实际文件和宿主状态验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter/send.ts:123-141](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/adapter/send.ts#L123-L141)

真实 Agent 控制调用及图片异步路径。

<details>
<summary>查看原文（19行）</summary>

```text
export function controlsFromAgent(agent: Agent): AgentControls {
  return {
    followup: (text: string, images?: string[]) => {
      // 无图走同步快路径（与历史行为一致）；有图先经 attachments 持久化再投递。
      if (images === undefined || images.length === 0) {
        agent.followup(toUserMessageSync(text))
        return Promise.resolve()
      }
      return toUserMessage(agent.ctx, text, images).then((message) => {
        agent.followup(message)
      })
    },
    steer: (text: string) =>{  agent.steer(toUserMessageSync(text)) },
    inject: (text: string) =>{  agent.inject(toUserMessageSync(text)) },
    cancel: (cause: AgentCancelCause, options?: CancelOptions) => {
      if (options === undefined) agent.cancel(cause)
      else agent.cancel(cause, options)
    },
    whenIdle: () => agent.whenIdle(),
```

</details>

**依据 2 · 源码核查**：[src/adapter/send.ts:55-66](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/adapter/send.ts#L55-L66)

附件先保存后形成消息。

<details>
<summary>查看原文（12行）</summary>

```text
async function toUserMessage(ctx: Context, text: string, images?: string[]): Promise<ReturnType<typeof createUserMessage>> {
  if (images === undefined || images.length === 0) return toUserMessageSync(text)
  const content: ContentBlock[] = [{ type: 'text' as const, text }]
  const attachments = ctx.reflect.get('attachments', false) as AttachmentStore | undefined
  if (attachments === undefined) {
    throw new Error('图片发送需要 attachments 服务（attachment-local 未装配）')
  }
  for (const dataUrl of images) {
    const attachment = await attachments.saveImage(parseImageDataUrl(dataUrl))
    content.push({ type: 'image', attachment })
  }
  return createUserMessage({ content, source: { kind: 'user' } })
```

</details>

**依据 3 · 源码核查**：[src/adapter/live.ts:85-109](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/adapter/live.ts#L85-L109)

事件投影如何处理工具结果和错误。

<details>
<summary>查看原文（25行）</summary>

```text
  switch (event.type) {
    case 'status':
      // 进入 running 清掉上一轮的错误：错误已在 live 区展示，不随重试残留
      return event.status === 'running'
        ? { ...state, status: event.status, lastError: undefined }
        : { ...state, status: event.status }
    case 'inbox-inserted':
      return { ...state, inbox: [...state.inbox, event.message] }
    case 'inbox-claimed':
    case 'inbox-discarded':
      return { ...state, inbox: withoutMessage(state.inbox, event.messageId) }
    case 'tool-call':
      return {
        ...state,
        activity: { callId: event.callId, name: event.name, arguments: event.arguments, turn: event.turn, step: event.step },
      }
    case 'tool-result':
      return state.activity?.callId === event.callId
        ? { ...state, activity: undefined }
        : state
    case 'error':
      return { ...state, lastError: { turn: event.turn, step: event.step, error: event.error } }
    case 'disposed':
      return { ...state, live: false }
  }
```

</details>

**依据 4 · 源码核查**：[src/ui/app.ts:2725-2759](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L2725-L2759)

普通输入入本地队列和实际发送，失败提示。

<details>
<summary>查看原文（35行）</summary>

```text
    // 运行中排队（对标 CC）：本地队列让 ↑ 取回不惊动宿主（取舍见 submit-queue 模块头）；turn/end 按序投递。
    if (this.liveAgent?.state.status === 'running') {
      this.submitQueue.push(expanded, images)
      this.flushLiveRender()
      return
    }
    // 用户气泡：正文 + 📎 附件行 + 识图能力提示；有图且终端支持图形协议时
    // 异步 prepare 后在同一写窗口追加终端图片（时序说明见 commit-surface）。
    this.commitSurface.userPrompt(expanded, images)
    this.inputLine.clearImages(); this.errorAnnouncer.recordSubmitted(expanded)
    // 图片不可达时不发送（气泡已警告「图片未发送」）；可达时直发或经视觉桥转描述。
    // followup 异步（图片经 attachments 服务持久化后投递）；失败回显警告，不静默吞。
    void this.controls?.followup(expanded, imagesReachable ? images : undefined).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err)
      // B1：投递失败回填（输入空时）——失败→改→重发闭环；echoWarn 语义由 announcer 承担
      this.errorAnnouncer.notifyDeliveryFailure(expanded, message, this.inputLine.value === '')
      this.flushLiveRender()
    })
    this.flushLiveRender()
  }

  /** turn/end → 本地队列按序投递（气泡 → followup）；aborted 不 flush——打断后可能想 ↑ 取回。 */
  private flushSubmitQueue(reason: 'completed' | 'aborted'): void {
    if (reason === 'aborted') return
    this.errorAnnouncer.clearSubmitted()
    const items = this.submitQueue.drain()
    for (const item of items) {
      this.commitSurface.userPrompt(item.text, item.images); this.errorAnnouncer.recordSubmitted(item.text)
      void this.controls?.followup(item.text, item.images).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err)
        this.errorAnnouncer.notifyDeliveryFailure(item.text, message, this.inputLine.value === '', '排队消息发送失败')
        this.flushLiveRender()
      })
    }
    if (items.length > 0) this.flushLiveRender()
```

</details>

**依据 5 · 源码核查**：[src/ui/app.ts:2619-2624](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L2619-L2624)

切会话丢弃队列并回显。

```text
    this.taskNotice = null
    // 切会话清空运行中排队：待发消息属于原会话上下文，不跨会话投递（行数回显）。
    if (this.submitQueue.size() > 0) {
      this.commitToScrollback({ text: `⚠ 切换会话：丢弃 ${this.submitQueue.size()} 条未发送的排队消息`, trailingNewline: true })
    }
    this.submitQueue.clear(); this.errorAnnouncer.reset()
```

**依据 6 · 源码核查**：[src/ui/app.ts:4261-4285](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L4261-L4285)

退出先 flush 再解绑及释放；flush 失败不阻止退出。

<details>
<summary>查看原文（25行）</summary>

```text
  async dispose(): Promise<void> {
    if (this.disposed) return
    this.disposed = true
    if (this.ticker !== null) { clearInterval(this.ticker); this.ticker = null }
    // 先 flush 再释放本层持有的 handle：flushAll 依赖 live store 未拆，
    // 而 dispose owned handle 会卸载投影/释放 agent，先拆会让 flush 无物可刷。
    try { await flushAll(this.ctx) } catch { /* flush 失败不阻塞退出 */ }
    // Phase 8：解绑 answerer；未决审批 settle 为 cancelled（fail-closed 语义；
    // detachProjections 已清挂起，此处幂等兜底）
    this.approvalDisposer?.()
    this.approvalDisposer = null
    if (this.approval.isPending) this.approval.settle('cancelled')
    // T3.1：释放 userQuestions provider 注册（否则服务侧再次 registerProvider
    // 抛 DUPLICATE_PROVIDER）；挂起提问 reject ASK_CANCELLED（detachProjections
    // 已清挂起，此处幂等兜底）。
    this.interactionDisposer?.()
    this.interactionDisposer = null
    if (this.question.isPending) this.question.cancel()
    // #39：技能展示面随 dispose 解绑订阅（防止 dispose 后事件回调泄漏）。
    this.skillSurface.dispose()
    // overlay 打开期间暂存的 scrollback 条目：退出前按同一协议补写主屏
    // （会话日志是权威数据，scrollback 是展示层——丢条目只影响本次显示，
    // 补写成本低且避免"发了消息但屏上不见"的观感）。
    this.commitSurface.flushDeferred()
    await this.detachProjections()
```

</details>

**依据 7 · 源码核查**：[src/ui/app.ts:4292-4310](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L4292-L4310)

LSP和终端输入、光标清理。

<details>
<summary>查看原文（19行）</summary>

```text
    this.taskSurfaceDisposer?.()
    this.taskSurfaceDisposer = null
    // LSP：诊断桥销毁（kill 全部语言 server、清缓存与回调；幂等）。
    this.lspBridge?.dispose()
    this.lspBridge = null
    // overlay 若仍在 alt screen，先退回主屏（1049l），否则进程退出后部分
    // 终端会把用户留在备用屏。
    this.overlay?.deactivate()
    this.stdout.write(kittyKeyboardPopSeq() + ANSI.BRACKETED_PASTE_OFF)
    this.pasteDisposer?.()
    this.pasteDisposer = null
    this.input.dispose()
    this.resize.dispose()
    this.glance.dispose()
    this.perfMonitor.stop()
    this.live.clear()
    // live.clear / 每帧渲染都会 HIDE_CURSOR；必须在全部写屏之后恢复，
    // 否则 Ctrl+Q / /exit 把 TTY 还给 shell 时硬件光标仍隐藏（#22）。
    this.stdout.write(ANSI.SHOW_CURSOR)
```

</details>

**依据 8 · 源码核查**：[src/engine/write-batcher.ts:51-72](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/engine/write-batcher.ts#L51-L72)

帧合并和最小刷新间隔。

<details>
<summary>查看原文（22行）</summary>

```text
  /** 请求刷新：距上次 flush ≥16ms 走 microtask，否则 16ms 尾沿（窗口内合并）。 */
  schedule(): void {
    if (this.pending) return
    this.pending = true
    const wait = MIN_FRAME_INTERVAL_MS - (Date.now() - this.lastFlushAt)
    if (wait <= 0) {
      const generation = this.generation
      void Promise.resolve().then(() => {
        if (!this.pending || generation !== this.generation) return
        this.pending = false
        this.runFlush()
      })
      return
    }
    this.timer = setTimeout(() => {
      this.timer = null
      if (!this.pending) return
      this.pending = false
      this.runFlush()
    }, wait)
    // 不拖住进程退出（shutdown/测试尾声的 pending 帧可丢弃）。
    this.timer.unref()
```

</details>

**依据 9 · 源码核查**：[src/ui/app.ts:3533-3537](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L3533-L3537)

会话 turn/end 实际调用队列刷新；非 aborted 才投递。

```text
      case 'turn/end': {
        // Phase 9d：turn 边界复位流利度信号
        this.fluency.onTurnComplete()
        // 运行中排队 → turn 边界按序投递（中止轮不 flush，见 flushSubmitQueue）。
        this.flushSubmitQueue(event.data.reason.kind === 'aborted' ? 'aborted' : 'completed')
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批快捷方式和自动更新会改变哪些用户预期？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

审批卡不是唯一会允许操作的路径。ApprovalController 对当前会话的 alwaysApprove、工具白名单和命令前缀命中直接返回 allowed-once；这属于用户快捷授权后的本地短路，不能把后续每次请求都描述成用户逐次确认。真实接线由 app 订阅 approval/request 并转给 controller；白名单在挂载会话时清空，alwaysApprove 在卸载时复位，未决审批取消。普通挂起有 60 秒默认超时和 abort 后 cancelled，非当前会话/已有挂起交给 next；这些是限制范围和避免旧卡片误结算的反证，不能泛化成没有授权保护。

启动路径无等待地运行 runSelfUpdate，npm 安装满足条件时会用 profile 的包管理器安装 registry latest；空白会话可自动重启，非空会话只提示。关键差异在调用顺序，runSelfUpdate 先 fetchLatestWithCache，再 planSelfUpdate 检查 DSH_TUI_SKIP_UPDATE/CI 等开关。因而开关可阻止安装，却不能保证不读取缓存或不查询 registry；新鲜缓存会避免网络，过期缓存可能联网。这是固定源码可确认的顺序问题，未实际观测流量。

更新失败只返回 failed；包管理器超时调用 child.kill 并拒绝，不构成 profile 已原子回滚的证据。需要可复现环境的人应固定 profile 与版本并人工核对安装状态；不能把“纯展示层”当作无网络、无子进程或无环境改写的保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/ui/app.ts:1438-1444](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L1438-L1444)

真实审批事件订阅。

```text
    // Phase 8：审批 answerer——waterfall 必须 next() 委托（非当前会话的
    // 请求交给链上其他 answerer；当前会话的请求挂起等用户 y/N。重复
    // attach 先解绑旧 disposer（与 interactionDisposer 对称）。
    this.approvalDisposer?.()
    this.approvalDisposer = this.ctx.on('approval/request', (req: PendingApprovalRequest, next: () => Promise<ApprovalOutcome>) => {
      return this.handleApprovalRequest(req, next)
    })
```

**依据 2 · 源码核查**：[src/ui/app.ts:2866-2870](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L2866-L2870)

事件实际转给 controller。

```text
  private handleApprovalRequest(
    req: PendingApprovalRequest,
    next: () => Promise<ApprovalOutcome>,
  ): Promise<ApprovalOutcome> {
    return this.approval.handle(req, next)
```

**依据 3 · 源码核查**：[src/controllers/approval-controller.ts:224-261](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/controllers/approval-controller.ts#L224-L261)

授权短路、委托、abort 与超时处理。

<details>
<summary>查看原文（38行）</summary>

```text
  handle(req: PendingApprovalRequest, next: () => Promise<ApprovalOutcome>): Promise<ApprovalOutcome> {
    const current = this.getCurrentSessionId()
    // C3 项 4：always-approve 短路放行（不挂起提示，不消费 pendingApproval）。
    // 仅限当前会话：非当前会话的请求必须 next() 委托（apiproxy 等链上 answerer），
    // 否则 TUI 会截胡远端转发的审批。
    if (this.alwaysApproveFlag && req.agent.session.id === current) {
      return Promise.resolve('allowed-once')
    }
    // 任务4a：工具级会话白名单短路——`t` 键加过的工具自动放行，其他工具仍
    // 逐卡审批。作用域与 always-approve 相同（仅当前会话）。
    if (this.allowedTools.has(req.toolName) && req.agent.session.id === current) {
      return Promise.resolve('allowed-once')
    }
    // 决策分层阶段 2：命令前缀会话白名单短路——`p` 键加过的前缀自动放行。
    // 前缀在此一次性提取（transcript 查找 + JSON 解析），挂起后缓存复用。
    const prefix = req.agent.session.id === current
      ? this.getCommandPrefix?.(req) ?? null
      : null
    if (prefix !== null && this.allowedPrefixes.has(prefix)) {
      return Promise.resolve('allowed-once')
    }
    if (req.agent.session.id !== current || this.pending !== null) {
      return next()
    }
    return new Promise<ApprovalOutcome>((resolve) => {
      const signal = req.signal
      // 已撤销的请求不呈现、不挂起：asker 侧已把 abort 竞速为 cancelled，
      // 挂起只会让卡片滞留（UI/outcome 不一致）——直接 fail-closed 结算。
      if (signal !== undefined && signal.aborted) {
        resolve('cancelled')
        return
      }
      const onAbort = (): void => { this.settle('cancelled') }
      // 挂起超时：超过 timeoutMs 无人应答 → fail-closed 自动结算 cancelled，
      // 卡片不无限挂起（settle 时清除 timer，防用户结算后二次结算）。
      // 有限值守卫：Node setTimeout 对 > 2^31-1 ms 的值溢出为 1ms 立即触发。
      const timer = Number.isFinite(this.timeoutMs)
        ? setTimeout(() => { this.settle('cancelled') }, this.timeoutMs)
```

</details>

**依据 4 · 源码核查**：[src/controllers/approval-controller.ts:62-63](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/controllers/approval-controller.ts#L62-L63)

默认挂起超时。

```text
/** 审批挂起默认超时（ms）：挂起超过即 fail-closed 自动结算 cancelled（可经 options.timeoutMs 覆盖）。 */
export const DEFAULT_APPROVAL_TIMEOUT_MS = 60_000
```

**依据 5 · 源码核查**：[src/ui/app.ts:2595-2601](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L2595-L2601)

切会话清除授权白名单。

```text
    // 跨会话残留清理：推理缓冲、最近推理块与进行中卡标题缓存都是会话内状态。
    this.discardReasoning()
    this.lastReasoningBlock = null
    this.reasoningExpanded = false
    this.pendingCallTitles.clear()
    // 会话级授权（t 键工具白名单 + p 键命令前缀白名单）同为会话内状态——切换即复位。
    this.approval.clearSessionGrants()
```

**依据 6 · 源码核查**：[src/ui/app.ts:4224-4229](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L4224-L4229)

自动批准和旧挂起复位。

```text
    // C3 项 4：always-approve 是会话级本地态——切会话/退出时复位，
    // 防止残留到新会话（planState 同上复位；徽章由 statusLine 重建）。
    this.approval.setAlwaysApprove(false)
    // Phase 8：卸载会话时清挂起审批——否则旧审批仍可被 y/N 结算且阻塞
    // 新会话请求（跨会话残留 bug；fail-closed 结算为 cancelled）。
    if (this.approval.isPending) this.approval.settle('cancelled')
```

**依据 7 · 源码核查**：[src/self-update.ts:326-348](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/self-update.ts#L326-L348)

先取 latest 再检查 skip，并调用安装。

<details>
<summary>查看原文（23行）</summary>

```text
export async function runSelfUpdate(opts: RunSelfUpdateOptions = {}): Promise<UpdateResult> {
  const env = opts.env ?? process.env
  const startDir = opts.startDir ?? process.cwd()
  const profileDir = opts.profileDir ?? findProfileDir(startDir)
  const currentVersion = opts.currentVersion ?? readOwnVersion(startDir) ?? ''
  const installSpec = opts.installSpec ?? (profileDir === undefined ? undefined : readInstallSpec(profileDir))
  try {
    // 注入缝优先（测试密封化）；真实路径走 1h 磁盘缓存免每启联网
    const latest = opts.fetchLatest !== undefined
      ? await opts.fetchLatest()
      : await fetchLatestWithCache({
          cachePath: opts.cachePath ?? defaultUpdateCachePath(),
          now: opts.now?.() ?? Date.now(),
        })
    const plan = planSelfUpdate({ env, currentVersion, profileDir, installSpec, latest })
    if (plan.action === 'skip') return { kind: 'noop' }
    if (profileDir === undefined) return { kind: 'noop' }
    const install = opts.install ?? installNpmVersion
    await install(plan.latest, profileDir)
    return { kind: 'updated', version: plan.latest }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { kind: 'failed', error }
```

</details>

**依据 8 · 源码核查**：[src/self-update.ts:124-134](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/self-update.ts#L124-L134)

环境开关与安装来源仅在计划阶段检查。

<details>
<summary>查看原文（11行）</summary>

```text
}): UpdatePlan {
  if (!shouldCheckForUpdate(input.env)) {
    return { action: 'skip', reason: input.env.CI !== undefined || input.env.VITEST !== undefined ? 'ci' : 'env' }
  }
  if (input.profileDir === undefined) return { action: 'skip', reason: 'no-profile' }
  if (input.installSpec === undefined || !isNpmVersionSpec(input.installSpec)) {
    return { action: 'skip', reason: 'not-npm' }
  }
  if (input.latest === null || input.latest === '') return { action: 'skip', reason: 'no-latest' }
  if (input.latest === input.currentVersion) return { action: 'skip', reason: 'same' }
  return { action: 'update', latest: input.latest }
```

</details>

**依据 9 · 源码核查**：[src/self-update.ts:243-253](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/self-update.ts#L243-L253)

新鲜缓存避免网络，过期走网络。

<details>
<summary>查看原文（11行）</summary>

```text
export async function fetchLatestWithCache(input: {
  cachePath: string
  now: number
  /** 网络获取函数（测试注入）；缺省真实 fetchNpmLatest。 */
  fetchNet?: () => Promise<string | null>
}): Promise<string | null> {
  const cached = readUpdateCache(input.cachePath)
  if (cached !== null && isCacheFresh(cached, input.now)) return cached.latest
  const fetched = await (input.fetchNet ?? fetchNpmLatest)()
  if (fetched !== null && fetched !== '') writeUpdateCache(input.cachePath, fetched, input.now)
  return fetched
```

</details>

**依据 10 · 源码核查**：[src/self-update.ts:292-319](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/self-update.ts#L292-L319)

包管理器执行与超时，不显示事务回滚。

<details>
<summary>查看原文（28行）</summary>

```text
export function installNpmVersion(latest: string, profileDir: string, timeoutMs = 60_000): Promise<void> {
  const { command, args, label } = installCommandFor(detectPackageManager(profileDir), latest)
  return new Promise((resolve, reject) => {
    // Windows 上 pnpm/npm/yarn 是 .cmd，spawn 直接执行会 EINVAL（.cmd 不能
    // 不经 shell 启动），传 'pnpm' 又会 ENOENT（无扩展名不在 PATH）。
    // 经 cmd.exe /d /c 显式派发：shell:false 时 args 作为 argv 传给
    // cmd.exe，不触发 Node DEP0190 弃用警告（shell:true + args 数组组合
    // 会把警告经 stderr 渲染进 TUI 输入框区域）。version 来自 npm registry
    // 的 semver 字符串，字符集受限（无空格/引号/&|<> 等元字符），实际注入
    // 面低；cmd /c 对参数数组按 argv 传递，不拼 shell 字符串。
    const child = spawn(command, args, {
      cwd: profileDir,
      stdio: 'ignore',
      windowsHide: true,
    })
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`${label} timed out`))
    }, timeoutMs)
    child.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
    child.on('exit', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else reject(new Error(`${label} exited ${code ?? 'null'}`))
    })
```

</details>

**依据 11 · 源码核查**：[src/index.ts:191-209](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/index.ts#L191-L209)

启动接线及空白会话自动重启、失败提示。

<details>
<summary>查看原文（19行）</summary>

```text
    // 启动自更新：对照 npm latest，写入 profile。已加载模块不热替换，提示重启。
    // CI/VITEST/非 npm 安装会 noop，不挡 attach。
    const autoRestartOnUpdate = config.autoRestartOnUpdate !== false
    void runSelfUpdate({ startDir: fileURLToPath(new URL('.', import.meta.url)) }).then(async (result) => {
      if (result.kind === 'updated') {
        await attachPromise
        if (attachFailed) return
        if (autoRestartOnUpdate && app.isBlankSession()) {
          app.notifyAutoRestart(result.version)
          // 留 400ms 让提示可见（dispose 不清屏，新进程随后重绘 TUI）
          await new Promise((r) => setTimeout(r, 400))
          void teardown(true, true)
        } else {
          // 会话非空白（用户已开始工作）或自动重启被关闭：只提示，不打断。
          app.notifyPluginUpdated(result.version)
        }
      }
      // P1-1：更新失败不再静默——attach 后回显 warning（附 DSH_TUI_SKIP_UPDATE=1 提示）
      else if (result.kind === 'failed') app.notifyPluginUpdateFailed(result.error)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、LSP 与可选能力分别依赖什么，失败由谁处理？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

启动依赖明确分成三层。Node 与官方宿主版本决定包和 API 能否工作；ctx.inject 中 sessions/agents/agentDefaultModel 不就绪时不会进入 TUI 挂载；agentPresets、预设与工具接缝决定新会话是否有模型工具。README 绑定宿主 0.2.1-rc.4 并警示其他通道，本文按固定版本描述，不把可变 next 标签当永久兼容证明。根包同时依赖官方与 @huiliyi37 系列，版本更新的适配负担由维护者和 profile 操作者共同承担。

LSP 有两个容易混淆的面。patch 组装模型可调用的 seam/provider/tool，默认 TypeScript provider 使用 npx 懒启动；TUI 自己还按工具路径读取诊断，只作显示缓存。app 的 ensureLspBridge 只首次创建并取当时 cwd，后续返回同一实例，故跨项目切会话需要注意首次目录边界。诊断失败/超时不阻塞工具流，所以面板没报错不等于项目无诊断问题。

可选服务使用反射读和降级，不能据少一个面板判整个 TUI 启动失败。图片发送还要求 attachments 与识图模型或视觉桥；同仓 vision-ask 是独立伴生组件，本研究不把其 ask_image 当根插件自身工具数量。其余预设工具和外部服务未逐项做实现审计；安装可达不等于任务结果已合格。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:55-78](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/package.json#L55-L78)

host 装配和官方 peer API 版本。

<details>
<summary>查看原文（24行）</summary>

```text
  "dsh": {
    "runtime": "host",
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-agent": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-atomic-write": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-attachment": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-invariants": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-permission-presets": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-session": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-session-title": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-skill": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-subagent": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-timeout": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-tools": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-user-approval": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-user-questions": "^0.2.1-rc.4",
    "@deepseek-ai/dsh-workflow": "^0.2.1-rc.4"
```

</details>

**依据 2 · 作者声明**：[README.md:36-44](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/README.md#L36-L44)

作者声明的运行版本与非独立 CLI 边界。

```text

| 组件 | 当前验证版本 |
|---|---|
| Node.js | `^22.19 || >=24` |
| 包管理器 | [`pnpm`](https://pnpm.io/installation)，可由 `corepack enable` 启用 |
| DeepSeek Harness | `@deepseek-ai/dsh@0.2.1-rc.4`，即 npm `next` 通道 |
| 本插件 | `@huiliyi37/dsh-tianshu-tui@1.0.0-rc.4` |

> **请显式使用宿主 `@next`。** 不要用宿主 `@latest` 代替（当前为 `0.2.1-rc.2`，低于要求）；`@alpha` 的 `0.2.2-alpha.2` 存在已知 API 不兼容，暂不支持。本包也不是可独立运行的 CLI。
```

**依据 3 · 源码核查**：[src/index.ts:104-115](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/index.ts#L104-L115)

必选注入与可选服务区分。

<details>
<summary>查看原文（12行）</summary>

```text
  // 服务隔离：sessions/agents/agentDefaultModel 是注入属性，访问前必须
  // 声明依赖（Cordis 4 注入语义，未声明访问抛 "without inject"；web-app 同款
  // 模式）。cmdlineArgs/appExit 是 launcher 在 boot prepare 里 provide 的宿主服务，
  // **不加入必选 inject**：Cordis inject 要求全部服务可用才执行回调，宿主未提供时
  // tui-runner 会静默永不激活（无报错、无 TUI，比降级更糟）。读取走 attach 内
  // 的注入属性/reflect 双通道 + 宿主特征感知的短窗口等待（见 TuiApp.attach）。
  // goals/subagents/settings 同理为可选服务、不进 inject（否则缺对应插件时整个
  // TUI 静默不启动）：一律经 reflect.get 读取，/goal 命令与委派树在服务缺失时
  // 报不可用/面板降级（fails loud），但不阻塞装配。主题持久化由 P1 prefs 层
  // （~/.dsh-tui/prefs.json）承担，不接入宿主 settings（避免双持久化源）。
  // 装配与 attach 在注入作用域内执行；生命周期仍注册在外层插件 ctx（随插件卸载）。
  ctx.inject(['sessions', 'agents', 'agentDefaultModel'], (runtimeCtx) => {
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:32-63](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/cordis.patch.yml#L32-L63)

模型 LSP 三件套、npx 和默认预设。

<details>
<summary>查看原文（32行）</summary>

```text
    # LSP 模型工具面（任务6对齐，2026-08-27）：tianshu-public 三件套——
    # seam（ctx.lsp 注册表）+ stdio 本地 provider + 模型工具（单 lsp 工具四操作：
    # goToDefinition / findReferences / goToImplementation / hover）。lsp-local
    # 默认给 typescript-language-server 一个 npx 条目（懒启动；npx 随 node 在场，
    # 加载期解析不炸，首次查询按需拉取）；其他语言由用户照此追加 servers 条目。
    # 无 provider 时模型查询收到结构化 LSP_UNAVAILABLE（schema 稳定）。
    - id: lsp
      name: '@huiliyi37/dsh-lsp'

    - id: lsp-local
      name: '@huiliyi37/dsh-lsp-local'
      config:
        servers:
          typescript:
            command: npx
            args: ['-y', 'typescript-language-server', '--stdio']
            extensionToLanguage:
              .ts: typescript
              .tsx: typescript
              .js: javascript
              .jsx: javascript
              .mjs: javascript
              .cjs: javascript

    - id: tool-lsp
      name: '@huiliyi37/dsh-tool-lsp'

    # The preset selection registry（对标 web-app 0.2.1 cordis.patch.yml 尾行）。
    - id: agent-preset-registry
      name: '@deepseek-ai/dsh-agent-preset-registry'
      config:
        default: standard
```

</details>

**依据 5 · 源码核查**：[src/ui/app.ts:1831-1863](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L1831-L1863)

诊断桥首次 cwd、服务选择与失败不阻塞。

<details>
<summary>查看原文（33行）</summary>

```text
  /**
   * 懒创建诊断桥：首次工具触碰文件或 /lsp 打开时实例化（rootUri = 当时
   * 会话 cwd）；缓存更新回调触发 renderLive（WriteBatcher 节流）。
   */
  private ensureLspBridge(): LspBridge {
    if (this.lspBridge !== null) return this.lspBridge
    // 诊断源选择（能力门控见 selectDiagnosticSource，任务6对齐）：
    // 1. 社区/伴生形状（getDiagnostics 函数直接可用）→ 直接采纳；
    // 2. 官方 seam 形状（只有 query）→ 需服务声明 operations 含 getDiagnostics
    //    才采纳——0.6.x seam 只有导航四操作，盲目采纳会让 seam 源顶掉内置
    //    multi-manager 而 query 恒报不可用 → /lsp 面板永久空；
    // 3. 均未命中 → 内置桥（降级路径，诊断照常）。
    const selected = selectDiagnosticSource(this.ctx.reflect.get('lsp', false), this.sessionCwd())
    const source = selected.kind === 'service' ? selected.source : undefined
    this.lspBridge = createLspBridge({
      cwd: this.sessionCwd(),
      ...(this.lspConfig.timeoutMs === undefined ? {} : { timeoutMs: this.lspConfig.timeoutMs }),
      ...(this.lspConfig.spawnFor === undefined ? {} : { spawnFor: this.lspConfig.spawnFor }),
      ...(this.lspConfig.which === undefined ? {} : { which: this.lspConfig.which }),
      ...(source === undefined ? {} : { source }),
    })
    this.lspBridge.onUpdate(() => { this.renderBatcher.schedule() })
    return this.lspBridge
  }

  /**
   * 从工具参数提取文件路径并触发诊断拉取（write/read/edit 族；无 path 参数
   * 的工具如 bash 不触发）。嵌套工具调用（multi_tool_use 的 tool_uses）递归
   * 展开。只读展示：拉取失败/超时静默，不阻塞工具流。
   * @param argumentsRaw - tool/call 事件参数原文。
   */
  private touchLspPaths(argumentsRaw: string): void {
    if (!this.lspConfig.enabled) return
```

</details>

**依据 6 · 源码核查**：[src/adapter/send.ts:55-66](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/adapter/send.ts#L55-L66)

图片依赖附件服务并明确失败。

<details>
<summary>查看原文（12行）</summary>

```text
async function toUserMessage(ctx: Context, text: string, images?: string[]): Promise<ReturnType<typeof createUserMessage>> {
  if (images === undefined || images.length === 0) return toUserMessageSync(text)
  const content: ContentBlock[] = [{ type: 'text' as const, text }]
  const attachments = ctx.reflect.get('attachments', false) as AttachmentStore | undefined
  if (attachments === undefined) {
    throw new Error('图片发送需要 attachments 服务（attachment-local 未装配）')
  }
  for (const dataUrl of images) {
    const attachment = await attachments.saveImage(parseImageDataUrl(dataUrl))
    content.push({ type: 'image', attachment })
  }
  return createUserMessage({ content, source: { kind: 'user' } })
```

</details>

**依据 7 · 作者声明**：[ADAPTER.md:34-62](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/ADAPTER.md#L34-L62)

可选服务及降级契约。

<details>
<summary>查看原文（29行）</summary>

```text
| 服务 | 用途 |
|---|---|
| `agentPresets` | 注册表;`setup` 里 `mount` / `composeFrom`;`/preset` `recompose` |

### 可选(经 `ctx.reflect.get`,缺则相关能力 fails loud,不阻塞启动)

| 服务 | 消费方 | 缺失行为 |
|---|---|---|
| `goals` | `/goal` | ⚠ 警告 |
| `subagents` | `/subagents` 委派树、subagent 运行行 | ⚠ 警告 |
| `memory` | `/remember` `/memory` | ⚠ 警告 |
| `compact` | `/compact` | 优先当前 agent isolate,host 回退;都无则 ⚠ |
| `tasks` | `/tasks` 窗格 | ⚠ 警告 |
| `skills` | `/skills` 面板 | ⚠ 警告(注册表仍在 host,按 scope 分层) |
| `sessionProjections` | `/status` 面板(goal/todos/plan) | ⚠ 警告(会话汇总段仍可用) |
| `workflowEngine` | `/workflow` 面板 | 优先当前 agent isolate,host 回退;都无则 ⚠ |
| `planMode` | plan 模式状态 | 优先当前 agent isolate,host 回退;都无则徽标不显示 |
| `llm` | 模型选择器目录、pi-ai 草稿模型发现、识图模态刷新 | ⚠ 警告；provider 可手输模型 |
| `visionBridge` | 视觉桥自动探测 | 图片不发送并警告 |
| `userQuestions` | 结构化提问面板 | 降级 |
| `tools` | 工具卡 presenter 桥 | 软降级 |
| `sessionPersistence` | 会话恢复列表 | 降级 |
| `settings` / `permission` / `credentials` | `/config` 面板；`/key` profile/key 保存 | 对应段不渲染；pi-ai 编辑回退 key-only，新建不可用 |
| `lsp` | LSP 诊断徽标 | 内置桥降级 |
| `appExit` / `cmdlineArgs` | 退出 / --help | 降级 |
| `commands` | slash 注册表(tui.commands 服务) | /help 警告 |

## 事件订阅清单

```

</details>

#### 缺口

- 外部 LSP provider、全部预设工具和图像桥实现未逐项审计。
  **影响**：本报告不保证所有组合或跨项目诊断正确。
  **进一步探讨**：分别固定 provider/预设版本，检查目标语言、项目目录切换和实际工具结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 集中交互是否改善合格任务，总成本与采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

目前材料支持一条有条件的探索路径，而没有证明总体办结更快。目标任务可设为在可丢弃项目完成一处受控修改，正确读工具状态、明确批准一项操作、取消一轮、恢复会话并核对最终文件。与原入口相比，输入/观察/审批都留在终端，可能减少切换；但本地队列、LSP 进程和更新 profile 把部分维护工作留给用户，不是只算按键数。

首次需匹配宿主/Node、独立 profile、模型与权限，并确认更新策略；持续使用有模型调用、语言服务和诊断开销、升级适配与人工验收；失败需核对哪些指令已进宿主、哪些只在本地排队，并核查部分安装/文件副作用。金额、CPU/内存、配置耗时与总尝试数都未测，不能称免费或省 token；TUI 显示 usage 也不构成更低模型成本的证据。

建议能管理 profile、确实偏好终端的人小范围试用，先普通逐卡审批，在无敏感文件的目录比较同一任务。先确认文本指令投递，再测试取消/切会话和退出；需要只读或严格版本冻结时，应先验证实际权限和更新行为，不能依赖 UI 名称。若状态与日志不符、出现未预期授权/安装变化，或恢复负担超过减少的切换，应停止该 profile，回到原入口并核查宿主会话和文件，避免盲目重发。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-31](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/README.md#L24-L31)

作者期望的集中交互场景。

```text
| 能力 | 你可以做什么 |
|---|---|
| **流畅对话与工具视图** | 流式 Markdown、推理过程折叠、并行工具分组、结构化 diff、回合耗时与 token 指标 |
| **完整会话工作区** | 恢复、切换、分叉、回退、导出会话；运行中排队，或通过 `/steer` 即时纠偏 |
| **高效输入** | slash 菜单、`@` 路径补全、历史搜索、多行粘贴、外部编辑器，以及可选 Vim 键位 |
| **图片与视觉** | 粘贴并内联预览图片；识图模型直接接收，文本模型可经视觉桥获得图片描述 |
| **Agent 控制面板** | 审批 diff、plan 模式、目标、任务、技能、子代理与 workflow 状态集中呈现 |
| **可定制的开发环境** | 16 个主题、LSP 诊断、项目记忆、MCP 浏览、模型与推理等级热切换 |
```

**依据 2 · 源码核查**：[src/ui/app.ts:2725-2759](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L2725-L2759)

本地排队、投递失败与人工重试负担。

<details>
<summary>查看原文（35行）</summary>

```text
    // 运行中排队（对标 CC）：本地队列让 ↑ 取回不惊动宿主（取舍见 submit-queue 模块头）；turn/end 按序投递。
    if (this.liveAgent?.state.status === 'running') {
      this.submitQueue.push(expanded, images)
      this.flushLiveRender()
      return
    }
    // 用户气泡：正文 + 📎 附件行 + 识图能力提示；有图且终端支持图形协议时
    // 异步 prepare 后在同一写窗口追加终端图片（时序说明见 commit-surface）。
    this.commitSurface.userPrompt(expanded, images)
    this.inputLine.clearImages(); this.errorAnnouncer.recordSubmitted(expanded)
    // 图片不可达时不发送（气泡已警告「图片未发送」）；可达时直发或经视觉桥转描述。
    // followup 异步（图片经 attachments 服务持久化后投递）；失败回显警告，不静默吞。
    void this.controls?.followup(expanded, imagesReachable ? images : undefined).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err)
      // B1：投递失败回填（输入空时）——失败→改→重发闭环；echoWarn 语义由 announcer 承担
      this.errorAnnouncer.notifyDeliveryFailure(expanded, message, this.inputLine.value === '')
      this.flushLiveRender()
    })
    this.flushLiveRender()
  }

  /** turn/end → 本地队列按序投递（气泡 → followup）；aborted 不 flush——打断后可能想 ↑ 取回。 */
  private flushSubmitQueue(reason: 'completed' | 'aborted'): void {
    if (reason === 'aborted') return
    this.errorAnnouncer.clearSubmitted()
    const items = this.submitQueue.drain()
    for (const item of items) {
      this.commitSurface.userPrompt(item.text, item.images); this.errorAnnouncer.recordSubmitted(item.text)
      void this.controls?.followup(item.text, item.images).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err)
        this.errorAnnouncer.notifyDeliveryFailure(item.text, message, this.inputLine.value === '', '排队消息发送失败')
        this.flushLiveRender()
      })
    }
    if (items.length > 0) this.flushLiveRender()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:191-209](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/index.ts#L191-L209)

自更新及重启的持续环境负担。

<details>
<summary>查看原文（19行）</summary>

```text
    // 启动自更新：对照 npm latest，写入 profile。已加载模块不热替换，提示重启。
    // CI/VITEST/非 npm 安装会 noop，不挡 attach。
    const autoRestartOnUpdate = config.autoRestartOnUpdate !== false
    void runSelfUpdate({ startDir: fileURLToPath(new URL('.', import.meta.url)) }).then(async (result) => {
      if (result.kind === 'updated') {
        await attachPromise
        if (attachFailed) return
        if (autoRestartOnUpdate && app.isBlankSession()) {
          app.notifyAutoRestart(result.version)
          // 留 400ms 让提示可见（dispose 不清屏，新进程随后重绘 TUI）
          await new Promise((r) => setTimeout(r, 400))
          void teardown(true, true)
        } else {
          // 会话非空白（用户已开始工作）或自动重启被关闭：只提示，不打断。
          app.notifyPluginUpdated(result.version)
        }
      }
      // P1-1：更新失败不再静默——attach 后回显 warning（附 DSH_TUI_SKIP_UPDATE=1 提示）
      else if (result.kind === 'failed') app.notifyPluginUpdateFailed(result.error)
```

</details>

**依据 4 · 源码核查**：[src/ui/app.ts:4261-4267](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L4261-L4267)

退出 flush 为尽力过程。

```text
  async dispose(): Promise<void> {
    if (this.disposed) return
    this.disposed = true
    if (this.ticker !== null) { clearInterval(this.ticker); this.ticker = null }
    // 先 flush 再释放本层持有的 handle：flushAll 依赖 live store 未拆，
    // 而 dispose owned handle 会卸载投影/释放 agent，先拆会让 flush 无物可刷。
    try { await flushAll(this.ctx) } catch { /* flush 失败不阻塞退出 */ }
```

**依据 5 · 源码核查**：[src/self-update.ts:292-319](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/self-update.ts#L292-L319)

失败安装的检查与恢复责任。

<details>
<summary>查看原文（28行）</summary>

```text
export function installNpmVersion(latest: string, profileDir: string, timeoutMs = 60_000): Promise<void> {
  const { command, args, label } = installCommandFor(detectPackageManager(profileDir), latest)
  return new Promise((resolve, reject) => {
    // Windows 上 pnpm/npm/yarn 是 .cmd，spawn 直接执行会 EINVAL（.cmd 不能
    // 不经 shell 启动），传 'pnpm' 又会 ENOENT（无扩展名不在 PATH）。
    // 经 cmd.exe /d /c 显式派发：shell:false 时 args 作为 argv 传给
    // cmd.exe，不触发 Node DEP0190 弃用警告（shell:true + args 数组组合
    // 会把警告经 stderr 渲染进 TUI 输入框区域）。version 来自 npm registry
    // 的 semver 字符串，字符集受限（无空格/引号/&|<> 等元字符），实际注入
    // 面低；cmd /c 对参数数组按 argv 传递，不拼 shell 字符串。
    const child = spawn(command, args, {
      cwd: profileDir,
      stdio: 'ignore',
      windowsHide: true,
    })
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`${label} timed out`))
    }, timeoutMs)
    child.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
    child.on('exit', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else reject(new Error(`${label} exited ${code ?? 'null'}`))
    })
```

</details>

#### 缺口

- 没有同条件合格任务对照、总尝试数和现金/人工成本记录。
  **影响**：不能给出节时、成功率、ROI 或单位合格任务成本。
  **进一步探讨**：用固定版本/模型/任务比较原入口和 TUI，记录所有失败与复核时间、总调用费及合格数。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何让用户更准确理解会话授权和环境变更？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可检验的假设是在现有审批卡、模式徽标与更新提示旁，增加一份可展开的当前授权和环境变更摘要，让用户在继续任务前看清本会话哪些工具/前缀会自动放行，以及运行代码版本与 profile 安装版本是否一致。它不是新增 Agent 决策权，也不能代替服务端权限。依据来自当前会话本地授权与启动更新可能先落盘后生效两条独立机制，目标是减少误解而非提高模型能力。

现有 allowedToolNames 已可读取，切会话会复位，index 也已有更新/重启通知，这些都是反证，不能声称系统完全没有授权状态或更新提示。拟议增量仅是把这些现有信息合并到可持续核对的一处，是否值得额外信息负担尚未知。

最小验证可在相同宿主与可丢弃项目中，交叉使用现有界面和摘要原型，安排正常审批、工具放行、切会话、空白/非空会话更新四类任务。观察用户能否预测下一次请求是否弹卡、是否知道需重启、误放行/误重发次数、判断用时和维护负担。如果准确性没有改善、摘要滞后造成误导，或额外打断抵消便利，就推翻该方案；没有实测前它只是假设，不能计入本插件已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/controllers/approval-controller.ts:129-174](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/controllers/approval-controller.ts#L129-L174)

已有模式、工具白名单读取和清除接口，构成假设基线与反证。

<details>
<summary>查看原文（46行）</summary>

```text
  /** C3 项 4：always-approve 模式激活标志（三态循环读写；退出/切会话时 app 侧复位）。 */
  get alwaysApprove(): boolean {
    return this.alwaysApproveFlag
  }

  /**
   * 设置 always-approve 模式（C3 项 4 三态循环；statusLine 徽标由 app 侧同步）。
   * @param flag - true 时当前会话的审批请求短路放行。
   */
  setAlwaysApprove(flag: boolean): void {
    this.alwaysApproveFlag = flag
  }

  /** 会话级工具白名单只读视图（渲染/调试用）。 */
  get allowedToolNames(): readonly string[] {
    return [...this.allowedTools]
  }

  /** 白名单是否命中该工具（handleKey 决定键位提示可省；短路判定以 handle 为准）。 */
  isToolAllowed(toolName: string): boolean {
    return this.allowedTools.has(toolName)
  }

  /** 把工具加入会话白名单（`t` 键；该工具后续请求自动放行）。 */
  allowTool(toolName: string): void {
    this.allowedTools.add(toolName)
  }

  /** 命令前缀是否已加白（调试/测试用；短路判定以 handle 为准）。 */
  isPrefixAllowed(prefix: string): boolean {
    return this.allowedPrefixes.has(prefix)
  }

  /** 把命令前缀加入会话白名单（`p` 键；bash 类同前缀请求后续自动放行）。 */
  allowCommandPrefix(prefix: string): void {
    this.allowedPrefixes.add(prefix)
  }

  /**
   * 清空会话级授权（工具白名单 + 命令前缀白名单；会话切换时 app 侧复位——
   * 白名单语义限于单个会话）。
   */
  clearSessionGrants(): void {
    this.allowedTools.clear()
    this.allowedPrefixes.clear()
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:195-209](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/index.ts#L195-L209)

已有更新/重启/失败提示，不把通知缺失作为事实。

<details>
<summary>查看原文（15行）</summary>

```text
      if (result.kind === 'updated') {
        await attachPromise
        if (attachFailed) return
        if (autoRestartOnUpdate && app.isBlankSession()) {
          app.notifyAutoRestart(result.version)
          // 留 400ms 让提示可见（dispose 不清屏，新进程随后重绘 TUI）
          await new Promise((r) => setTimeout(r, 400))
          void teardown(true, true)
        } else {
          // 会话非空白（用户已开始工作）或自动重启被关闭：只提示，不打断。
          app.notifyPluginUpdated(result.version)
        }
      }
      // P1-1：更新失败不再静默——attach 后回显 warning（附 DSH_TUI_SKIP_UPDATE=1 提示）
      else if (result.kind === 'failed') app.notifyPluginUpdateFailed(result.error)
```

</details>

**依据 3 · 源码核查**：[src/ui/app.ts:4224-4229](https://github.com/huiliyi37/dsh-tianshu-tui/blob/446bfe373c962aa83e04b36a16da4f8588458242/src/ui/app.ts#L4224-L4229)

跨会话复位已有实现。

```text
    // C3 项 4：always-approve 是会话级本地态——切会话/退出时复位，
    // 防止残留到新会话（planState 同上复位；徽章由 statusLine 重建）。
    this.approval.setAlwaysApprove(false)
    // Phase 8：卸载会话时清挂起审批——否则旧审批仍可被 y/N 结算且阻塞
    // 新会话请求（跨会话残留 bug；fail-closed 结算为 cancelled）。
    if (this.approval.isPending) this.approval.settle('cancelled')
```

#### 缺口

- 没有用户对授权范围与版本状态误解的直接反馈或原型实验。
  **影响**：无法确定摘要会带来价值而非额外噪声。
  **进一步探讨**：按相同任务交叉实验，同时记录理解准确率、错误、副作用与额外维护。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
