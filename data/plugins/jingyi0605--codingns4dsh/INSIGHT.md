# CodingNS for DeepSeek Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6930753](https://github.com/jingyi0605/Codingns4DSH/tree/693075393e1dfac583a8990dee95a870069643cf)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jingyi0605/Codingns4DSH) [![npm 30d 3,661](https://img.shields.io/static/v1?label=npm+30d&message=3%2C661&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@jingyi0605/codingns4dsh) [![最新发布 2026-10-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@jingyi0605/codingns4dsh)
<!-- END META -->

> **功能**：在 DSH 中整合外部编程 Agent、项目工具、智能助理和按需远程访问。

> **亮点**：可核查的贡献是把外部编程 Agent 的会话身份、流式事件、审批和提问接入 DSH 原生交互，并以模块注册表组织启动与释放。相对分散 CLI 提供集中交接，但不是创造上游模型能力，也未证明任务质量或耗时改善，见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：统一界面不能证明统一执行保证。模块释放报错时仍可先记为disabled，Codex中断请求异常也会被捕获；用户必须区分本地取消、上游确认与实际副作用，不能把停用标签当作所有进程已结束，见 [Q03](#research-q03)。

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
  - [Q01 · 哪些维护流程值得统一工作台，哪些能力属于上游 Agent？](#detail-section-11)
  - [Q02 · 外部 Agent 从宿主注册到会话、请求、审批和取消怎样接线？](#detail-section-12)
  - [Q03 · 模块启停和资源释放是否足以保证权限与状态安全？](#detail-section-13)
  - [Q04 · 安装、持续使用、异常恢复及退出分别由谁承担什么成本？](#detail-section-14)
  - [Q05 · 哪个跨 Agent 一致性假设值得验证，怎样被反例推翻？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在同一 DSH Host 管理多个项目和外部编程 Agent 的开发者，统一会话入口和原生交互；本轮以外部 Agent 及模块生命周期为核查主线。

比较基线是开发者独立打开各CLI及DSH原生Agent。统一工作台改变交接入口和会话呈现，外部Agent的模型能力、沙箱及供应商协议不归本组件原创；已有单CLI流程未必值得迁移，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 外部Agent会话适配 | 将多CLI请求、正文与工具事件接入DSH会话 | 已确认驱动实例与公共链，Codex为代表核查，不代表全部Agent验收 |
| 原生审批与提问回传 | 用户在DSH界面响应供应商交互 | 依赖nativeSessions能力；审批不可用不自动放行 |
| Codex线程建立与续接 | 维护DSH会话对应的供应商线程 | 需本机CLI及登录，providerSessionId不等于任务结果已正确恢复 |
| 模块启停与设置同步 | 按依赖及能力管理功能资源 | Host/Client各有注册表；disabled不证明清理错误后全部资源已停止 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=24.9.0、DSH >=0.2.1-alpha.2 | 必需，包声明 | Host及浏览器工作台运行 | 声明不等于本轮兼容实测；作者已验证0.2.2-alpha.2 |
| Cordis ~4.0.6-alpha.1与DSH原生服务 | 接入必需 | 插件装配、会话和原生审批 | 按能力诊断降级或拒绝；不能靠有UI断言可用 |
| 外部CLI及其登录 | 对应Agent执行必需 | 供应商线程、工具和模型执行 | 探测不到则该驱动不能执行；费用取决于供应商，未核实 |
| 适配的浏览器和Host工作目录 | 工作台必需 | 界面交互及真实项目操作 | 要确认正确工作区，浏览器并非执行机器 |
| tmux | macOS/Linux持久终端特定功能 | 保持终端状态 | 作者说明需安装；本轮未核查终端完整链 |
| 网络及中转账号 | 外部模型或远程功能按需 | 访问供应商与远程Host | 本轮未核查远程完整授权，试用阶段不扩大到远程 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份profile与供应商历史，在独立profile接入 | 包、宿主、Node及CLI版本明确，安装后重启 |
| 启动 | Host装配模块并按设置reconcile，Client订阅同类设置 | 查看能力诊断和模块错误，不仅看开关 |
| 任务 | 用户选择一个Agent和可丢弃项目，检验正文与审批/提问 | 正确线程、工作目录及允许/拒绝结果一致 |
| 异常与退出 | 用户核对外部任务后停用或移除并重启 | 取消不等于停止；检查原生终端和目录入口恢复，产物与历史不自动撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host运行及外部账户资源，具体金额未知 | 备份配置、安装重启、CLI登录、单Agent交互检查 | pnpm/Node及宿主要求按作者声明，未测耗时 |
| 持续使用 | 外部模型/API及进程、网络资源，未核实费用 | 多版本维护、模型与线程身份复核 | 不因统一界面而取消各供应商负担 |
| 失败恢复 | 失败调用及重试资源，金额未知 | 查Host/驱动/供应商状态，确认进程和文件后续接 | 清理错误与中断异常均需人工核实 |
| 退出或迁移 | 已有供应商历史与项目资源继续存在 | 移除插件重启、核对bundle替换入口，回到CLI | 不撤销已执行代码和文件修改 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一外部Agent交互 | 实际驱动注册、事件投影和原生审批回传 | 所有Agent版本是否兼容及是否减少总工时 |
| 生命周期管理 | 依赖排序、串行reconcile和逆序资源释放 | 清理失败后全部外部资源是否确已关闭 |
| 会话续接 | 供应商线程身份在事件绑定后保存 | 崩溃与升级后的端到端恢复成功率 |
| 项目交付质量 | 本轮没有同条件任务结果 | 代码正确率、合格率及单位任务成本 |

> **思考**：统一界面不能证明统一执行保证。模块释放报错时仍可先记为disabled，Codex中断请求异常也会被捕获；用户必须区分本地取消、上游确认与实际副作用，不能把停用标签当作所有进程已结束，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可核查的贡献是把外部编程 Agent 的会话身份、流式事件、审批和提问接入 DSH 原生交互，并以模块注册表组织启动与释放。相对分散 CLI 提供集中交接，但不是创造上游模型能力，也未证明任务质量或耗时改善，见 [Q01](#research-q01)、[Q02](#research-q02)。

可借鉴的是FeatureRegistry的依赖/能力检查、每模块资源scope和逆序清理，以及CLI注册表与消息投影分工；供应商身份变化后先flush有助于保留续接依据。代价是大量宿主服务和协议版本耦合；disabled并非所有资源已释放，中断响应也不能证明外部副作用停止，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

统一界面不能证明统一执行保证。模块释放报错时仍可先记为disabled，Codex中断请求异常也会被捕获；用户必须区分本地取消、上游确认与实际副作用，不能把停用标签当作所有进程已结束，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立profile只选一个已登录的外部Agent，先用可丢弃项目检查正确cwd、线程续接、审批允许与拒绝、提问取消及停止结果，再考虑生产任务。暂不开远程和其他未核查模块；出现错工作区、审批错配、取消后持续写入或原生终端无法恢复就停用该profile并回到已有CLI，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查外部Agent适配、代表Codex审批/会话/取消及模块资源生命周期。远程、Git、语音等其余工作台功能仅按作者范围说明，不作本轮全面实现或安全验收。运行效果及新交互契约均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh.bundle.patch、src/index.ts、src/host/index.ts、src/client/index.ts、src/host/features/index.ts、src/features/registry.ts、src/shared/contracts/config.ts、src/host/cli-adapters/feature.ts、src/host/cli-adapters/registry.ts、src/host/cli-adapters/codex-driver.ts、src/host/cli-adapters/dsh-message-projector.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：材料统计覆盖固定组件完整树；研究抽读Host/Client装配、模块生命周期、外部Agent公共链及代表Codex驱动，不是全仓安全审计。未执行目标代码、安装、测试或真实宿主；远程、语音、Git等其余能力只保留作者范围说明。
- 下一步：后续在独立授权的隔离profile，对两个异构驱动的批准、拒绝、提问取消、流式中断、崩溃与停用逐项记录真实线程、进程、文件结果和恢复动作，比较统一状态表述是否误导；本轮未执行。

**分析版本**

- **仓库**：[jingyi0605/Codingns4DSH](https://github.com/jingyi0605/Codingns4DSH)
- **版本号**：0.2.2-beta.1（[固定提交 6930753](https://github.com/jingyi0605/Codingns4DSH/tree/693075393e1dfac583a8990dee95a870069643cf)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可检验适配器交互契约，把审批回传、中断请求、上游终态与副作用未知分别呈现。对照两个异构驱动的批准、拒绝、取消、崩溃和停用样本，观察错误终态表述与恢复动作；未确认停止却声称无后续写入即否定相关保证。此方向尚未验证，见 [Q05](#research-q05)。

后续在独立授权的隔离profile，对两个异构驱动的批准、拒绝、提问取消、流式中断、崩溃与停用逐项记录真实线程、进程、文件结果和恢复动作，比较统一状态表述是否误导；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 343 | 37492 | — | — | 680704 |
| .mjs | source | 25 | 3355 | 2935 | 214 | — |
| .ts | source | 559 | 136936 | 117420 | 11289 | — |
| .ts | test | 344 | 90360 | 82563 | 3107 | — |
| .mjs | test | 7 | 114 | 88 | 15 | — |
| .mjs | example | 5 | 56 | 50 | 5 | — |
| .ts | example | 6 | 206 | 196 | 4 | — |
| .js | example | 3 | 4 | 4 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jingyi0605/Codingns4DSH/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外部Agent工作台如何接入DSH，并维持可解释的审批、会话和资源生命周期边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些维护流程值得统一工作台，哪些能力属于上游 Agent？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是在一台 DSH Host 上管理多个代码项目、同时使用外部编程 Agent 的开发者。作者把 Agent 选择、会话、Git、终端、远程访问及助理并置为工作台；这些是产品范围声明，不能把表格中每项当作本轮实测能力。合格结果应是选定工作区和 Agent 后，用户可识别原生会话对应哪个供应商线程，流式正文、工具、提问及审批进入正确会话，结束或取消可解释，原有项目状态可查。

本轮确认的核心增量是接入层：宿主装配 cliAdapters，在 llm/stream 边界按会话配置转发驱动，公共投影器将权限与提问送回 DSH 原生交互。相对在独立终端轮流打开各 CLI，用户获得统一的会话入口和交互投影；模型推理、代码工具和供应商执行能力仍属于外部 Agent，不能算本插件创造。README明确标注部分适配来自贡献者或 CodexHost，上游协议和适配贡献归属不能被整合名称覆盖。

相对 DSH 原生 Agent，本组件新增外部供应商会话协议的适配，而不是证明某个外部模型比原生更强。已经只用单一 CLI 的开发者，可能无需承担整个工作台的版本与状态维护。尚无同任务对照证明工作台缩短交付时间或改善代码正确率，所以价值判断限定于已有多工具切换需求的人群。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:44-70](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/README.md#L44-L70)

作者给出工作台模块与安装登录前提，不是独立效果证据。

<details>
<summary>查看原文（27行）</summary>

```text
## 这是什么

**Codingns4DSH** 是 [DSH（DeepSeek Harness）](https://github.com/deepseek-ai/deepseek-harness) 的扩展插件，把多种编程 Agent、项目工具和智能助理整合到同一个工作台。所有模块都可以在 **设置 → Codingns4DSH** 中管理。

| 模块 | 能做到什么 | 默认 |
| --- | --- | :---: |
| **外部 Agent 集成** | 在 DSH 内使用多种编程 Agent，切换模型并查看执行过程 | 开 |
| **工作区会话增强** | 识别会话所属 Agent，管理归档会话，优化自动标题，查看订阅与用量 | 关 |
| **移动端访问增强** | 手机布局、侧栏手势、添加到主屏幕与通知 | 开 |
| **终端强化** | 使用持久终端，自定义终端外观 | 关 |
| **局域网访问 DSH** | 让同一网络的其他设备访问工作台 | 入口常驻 |
| **登录保护** | 为局域网和中转访问设置登录验证 | 关 |
| **中转访问服务** | 从互联网访问自己的 DSH，连接端到端加密 | 关 |
| **工作区调试** | 保存项目启动配置，管理进程、检查端口和访问服务 | 开 |
| **Git 仓库管理** | 查看改动、暂存、提交、切换分支与浏览历史 | 开 |
| **文件管理增强** | 创建、编辑、重命名、移动、复制和删除文件 | 关 |
| **PeerHost 聚合工作台** | 在当前工作台使用其他 DSH Host 的工作区与会话 | 关 |
| **全局智能助理（测试中）** | 文字与语音交流、了解项目进展、跟进任务、自定义形象 | 关 |

Agent、终端和项目文件在运行 DSH 的电脑（Host）上处理；浏览器提供统一操作界面，远程访问按需开启。

---

## 支持的外部 Agent

安装并登录对应 Agent 后，Codingns4DSH 会自动检测并接入；内置 **DeepSeek Harness** Agent 仍可使用。你可以在同一界面选择模型、查看流式回复，并使用各 Agent 提供的会话续接、工具调用和思考强度设置。

```

</details>

**依据 2 · 作者声明**：[README.md:76-98](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/README.md#L76-L98)

支持表及贡献者归属限制原创和全面适配判断。

<details>
<summary>查看原文（23行）</summary>

```text
| --- | --- | --- |
| **Command Code** | Skill、权限确认、提问、用量 | 沿用 DSH 权限设置，支持原生问题面板 |
| **Claude Code** | Skill、权限确认、提问、用量 | 支持原生技能目录与技能调用 |
| **Kimi CLI** | 权限确认、提问、插话、用量 | — |
| **Gemini CLI** | 权限确认、提问、用量 | 支持原生权限确认与表单提问 |
| **Pi Agent** | 插话、思考强度、用量 | 当前协议的 DSH 权限与提问回传尚未验证 |
| **Codex** | 权限确认、提问、插话、用量 | 提问由 DSH 原生问题面板承载 |
| **OpenCode** | Skill、权限确认、提问、用量 | 支持本地 CLI 或已有服务，以及原生技能调用 |
| **Grok Build** | Skill、权限确认、提问、用量 | 支持原生技能目录与结构化提问 |
| **MiniMax Code** | 权限确认、提问、用量 | 默认接入支持交互；显式思考档位的执行模式不支持交互回传。<br>上游贡献者：[chenjunyi000](https://github.com/chenjunyi000)<br>提交 PR [#6](https://github.com/jingyi0605/Codingns4DSH/pull/6)、[#7](https://github.com/jingyi0605/Codingns4DSH/pull/7) |
| **ZCode** | 模型选择、会话续接、用量 | 支持 CLI 或桌面应用内置运行时。<br>上游贡献者：[chenjunyi000](https://github.com/chenjunyi000)<br>提交 PR [#6](https://github.com/jingyi0605/Codingns4DSH/pull/6)、[#7](https://github.com/jingyi0605/Codingns4DSH/pull/7) |
| **CodeBuddy** | 权限确认、提问、用量 | 自动识别国内／国际版。<br>CodexHost 上游贡献者：[mouzhi](https://github.com/mouzhi)<br>首次适配 [f30b000](https://github.com/BytePioneer-AI/codex-host/commit/f30b000f88950c40844b071eec2f6f385c6bcb49) |
| **WorkBuddy** | 权限确认、提问、思考强度 | 使用 WorkBuddy 桌面应用内置运行时。<br>CodexHost 上游贡献者：[BytePioneer-AI（ChongWen）](https://github.com/BytePioneer-AI)<br>首次适配 [6e9f365](https://github.com/BytePioneer-AI/codex-host/commit/6e9f365e2bf8ac61716f8250475530ae790f2d2f) |
| **Cursor CLI** | 权限确认、提问、思考强度 | CodexHost 上游贡献者：[mouzhi](https://github.com/mouzhi)<br>首次适配 [ad6ba8e](https://github.com/BytePioneer-AI/codex-host/commit/ad6ba8e04d294c473d2dcad99880496ff39c1f7e) |
| **Kiro CLI** | 权限确认、提问、思考强度 | CodexHost 上游贡献者：[gy212](https://github.com/gy212)<br>首次适配 [79675cd](https://github.com/BytePioneer-AI/codex-host/commit/79675cdbfdc042eb37a849c3eb1539e9efc40a0d) |
| **Qoder** | 权限确认、提问、思考强度 | CodexHost 上游贡献者：[gy212](https://github.com/gy212)、[BytePioneer-AI（ChongWen）](https://github.com/BytePioneer-AI)<br>PR #289 合并 [8926130](https://github.com/BytePioneer-AI/codex-host/commit/8926130af1426a467747b66d8d2dbf68f7764a7b) |
| **Qoder CN** | 权限确认、提问、思考强度 | CodexHost 上游贡献者：[gy212](https://github.com/gy212)、[BytePioneer-AI（ChongWen）](https://github.com/BytePioneer-AI)<br>PR #289 合并 [8926130](https://github.com/BytePioneer-AI/codex-host/commit/8926130af1426a467747b66d8d2dbf68f7764a7b) |
| **Antigravity** | 会话续接、工具调用、思考强度 | 权限设置映射为安全模式，不提供交互式审批或提问。<br>CodexHost 上游贡献者：[gy212](https://github.com/gy212)<br>首次适配 [ed4e785](https://github.com/BytePioneer-AI/codex-host/commit/ed4e785116642eafc08e4186e92e83f3816c7765) |

Agent 的安装与登录由各自工具完成。适配细节见[外部 Agent 文档](specs/spec007.1-外部Agent适配器扩展/README.md)。

---

```

</details>

**依据 3 · 源码核查**：[src/host/cli-adapters/feature.ts:646-673](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/feature.ts#L646-L673)

实际接管llm/stream并排除翻译、标题和压缩请求，支持适配层贡献。

<details>
<summary>查看原文（28行）</summary>

```text
        const dispose = events.on('llm/stream', async function* (options: unknown, next: () => AsyncIterable<unknown>) {
          const value = asRecord(options)
          // 翻译服务也复用 DSH 原生 LLM，但它不是外部 Agent 回合；必须在这里
          // 旁路 CLI Provider 接管，否则翻译请求会被再次当成 Grok/Codex 请求。
          if (isSessionTranslationLlmRequest(value)) {
            yield* next()
            return
          }
          const sessionId = typeof value?.sessionId === 'string' ? value.sessionId : ''
          if (value?.purpose === 'session-title' || value?.purpose === 'compaction') {
            yield* next()
            return
          }
          // fork 子会话继承父会话历史，但可能还没被任何 RPC 触碰过；用户直接在
          // 子会话里发消息时，这里必须补一次迁移，否则子会话会被当成默认 DSH
          // 会话，用户看到的仍是 DSH 主模型而不是原来的外部 Agent。子会话的
          // 绑定来自父会话，所以父会话必须一起进入同一批迁移。
          if (sessionId !== '' && nativeSessions !== undefined) {
            const nativeSession = nativeSessions.get(sessionId)
            if (nativeSession !== undefined) {
              sessionStore.migrateLegacySessions(collectMigrationChain(nativeSessions, nativeSession))
            }
          }
          const storedConfig = sessionId ? registry.getSession(sessionId) : { adapterId: 'dsh' }
          // DSH 原生请求仍会携带当前模型提供方。旧会话在重载后可能暂时
          // 被恢复成 dsh，但 provider 已明确指向外部 Agent；继续旁路会让
          // 第二轮直接落入 DSH 空流，并丢失外部驱动的 usage/context 修正。
          const dshSelection = readDshSelection(value)
```

</details>

**依据 4 · 源码核查**：[src/host/cli-adapters/dsh-message-projector.ts:377-402](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/dsh-message-projector.ts#L377-L402)

审批回到原生会话，再由响应器传给外部Agent。

<details>
<summary>查看原文（26行）</summary>

```text
  private async requestPermission(event: Extract<CodingNsAgentEvent, { type: 'permission-request' }>): Promise<void> {
    const responder = this.options.respondPermission
    if (responder === undefined) throw new Error('外部 Agent 发送了权限请求，但适配器没有权限回复接口')
    let detail = event.detail
    const planReview = event.kind === 'plan' || ['exitplanmode', 'exit_plan_mode'].includes(event.toolName?.toLowerCase() ?? '')
    if (planReview && detail && this.options.translation?.shouldTranslate(this.options.adapterId, 'assistant', this.options.translationEnabled)) {
      try {
        const record = await this.options.translation.translateOutput(this.options.adapterId, 'assistant', detail, this.options.signal, this.options.translationEnabled)
        if (record !== null && !record.failed) detail = record.translated
      } catch { /* Keep the original plan when translation is unavailable. */ }
    }
    const outcome = await this.options.nativeSessions?.requestApproval?.(this.options.sessionId, {
      requestId: event.requestId,
      toolName: event.toolName ?? (event.kind || 'external-agent'),
      ...(event.callId ? { callId: event.callId } : {}),
      ...(detail ? { reason: detail } : {}),
      ...(this.options.signal === undefined ? {} : { signal: this.options.signal }),
    }) ?? 'unavailable'
    const approved = outcome === 'allowed-once'
    const reason = approvalReason(outcome, this.options.permission)
    await responder({ requestId: event.requestId, approved, ...(reason === undefined ? {} : { reason }) })
  }

  private async requestQuestions(event: Extract<CodingNsAgentEvent, { type: 'question-request' }>): Promise<void> {
    this.options.signal?.throwIfAborted()
    const responder = this.options.respondQuestion
```

</details>

#### 缺口

- 缺少多Agent真实任务对照与独立用户持续采用材料。
  **影响**：不能把统一入口解释为更高代码质量或已兑现节时。
  **进一步探讨**：在相同项目与任务下比较独立CLI和工作台的交接动作、误路由、合格交付及总人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 外部 Agent 从宿主注册到会话、请求、审批和取消怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

这是同时具有 Host 与浏览器 Client 的原生 DSH 插件。根导出把 apply 指向 Host 装配；bundle patch 插入插件，还成对停用官方终端行并替换目录选择入口。Host 将各功能注册到 FeatureRegistry，通过设置变更 reconcile；Client 也注册 CLIENT_FEATURES，订阅设置并在卸载时清理。因此接入会改变宿主组合，不能把它看成完全旁路的网页。

cliAdapters 默认启用，构造 Command Code、Claude、Codex、OpenCode 等驱动并保存会话配置。llm/stream 取会话配置及当前权限，传入工作目录、供应商会话ID、模型、档位和取消信号；registry.execute 拒绝同会话并发和维护/归档中状态，再调用实际 driver.executeTurn。公共投影器接收正文和工具事件，并将审批、提问交给 nativeSessions；审批不可用时不会自动放行，只有 allowed-once 才回传批准。

代表链路以 Codex 源码为例：驱动探测二进制后用 app-server JSON-RPC 建立或恢复线程，执行回合前注册通知，过滤线程和回合归属，供应商session-binding写回注册表。权限同时映射到 thread/start 和 turn/start，read-only与workspace-write关闭网络，danger-full-access 映射为上游全权限形状；缺少权限事实时沿用workspace-write，不能解释为完全权限。原生权限请求按类型回传accept/decline或permissions与turn范围，提问回传结构化答案。

取消关闭本地队列并请求 turn/interrupt，驱动会收尾挂起交互；中断请求异常被捕获，因此本地取消状态不能单独证明上游进程或其工具副作用已经停止。本轮跟通该代表链路，不外推全部Agent对审批、续接和取消具有相同语义。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-12](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/index.ts#L1-L12)

根入口导出Host apply和Config。

<details>
<summary>查看原文（12行）</summary>

```text
/** Host 入口是包根导出；共享契约通过显式子路径另行提供。 */
import { apply as hostApply } from './host/index.js'

/** Cordis Bundle 标准插件名称。 */
// Bundle 的运行时名称必须与 npm 包名和 dsh.bundle.patch 中的 entry id 保持一致。
// 包名改为 scoped 后仍导出旧名称，会让 DSH 的 Bundle、ConfigForm 和 Client 处于不同身份。
export const name = '@jingyi0605/codingns4dsh'
/** DSH 0.1.7 原生配置入口；Host-only 的 cliSessions 已标记为 volatile。 */
export { CodingNsConfigSchema as Config } from './host/settings.js'
/** Host Cordis 入口。 */
export const apply = hostApply
export { createCodingNsRpcHandler, createCodingNsSettingsRpcHandler, registerCodingNsRpc } from './host/rpc.js'
```

</details>

**依据 2 · 源码核查**：[dsh.bundle.patch:1-22](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/dsh.bundle.patch#L1-L22)

固定Git blob中存在bundle patch，修改原生终端和目录选择并插入插件。

<details>
<summary>查看原文（22行）</summary>

```text
# 官方终端 Host 与 Client 行必须成对停用，避免重复 terminal namespace 和
# webTerminals service；codingns4dsh 在同一个 Bundle generation 中提供两者。
# rc3 没有这两个行，DSH 会按可选 patch 记录 warning 并继续启动；alpha2 则会正常命中。
- id: terminal-controller
  name: '@deepseek-ai/dsh-api-terminal-controller'
  disabled: true
- id: ui-sidebar-terminal
  name: '@deepseek-ai/dsh-client-ui-sidebar-terminal'
  disabled: true
# 远程访问必须始终使用网页模态框。默认的 auto 会按 Host 环境切换到原生系统选择器，
# 这对远程浏览器不可达，而且会让同一个“添加工作区”入口出现两套交互。
- id: directory-picker
  name: '@deepseek-ai/dsh-host-directory-picker-auto'
  disabled: true
- insert:
    - id: directory-picker-browse
      name: '@deepseek-ai/dsh-host-directory-picker-browse'
    - id: ui-directory-picker-browse
      name: '@deepseek-ai/dsh-client-ui-directory-picker-browse'
- insert:
    - id: '@jingyi0605/codingns4dsh'
      name: '@jingyi0605/codingns4dsh'
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:308-319](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/index.ts#L308-L319)

Host实际创建并注册功能。

<details>
<summary>查看原文（12行）</summary>

```text
    const registry = new FeatureRegistry<CodingNsHostServices>(servicesWithDebug, capabilityProfile)
    registry.registerMany(createHostFeatures({
      terminalStatus: {
        controllerMode: terminal.mode,
        effectiveEnabled: terminal.mode === 'enhanced',
        runtimeTypes: terminal.runtimeTypes,
        ...(terminal.runtimeWarning === undefined ? {} : { runtimeWarning: terminal.runtimeWarning }),
      },
    }))
    registry.validate()
    debugInfo('codingns4dsh: host feature registry ready', { features: registry.descriptors().map((item) => item.name) })
    const restartStates = captureRestartFeatureStates(registry.descriptors(), settings.get(), dshVersion)
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:363-383](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/index.ts#L363-L383)

设置watch驱动reconcile并在卸载时清空。

<details>
<summary>查看原文（21行）</summary>

```text

    hostCtx.effect(() => {
      const sync = (): void => {
        const enabled = enabledFeatureNames(registry.descriptors(), settings.get(), restartStates, dshVersion)
        debugInfo('codingns4dsh: host feature sync', { enabled, states: registry.list() })
        void registry
          .reconcile(enabled)
          .catch((error: unknown) => {
            console.error('codingns4dsh: 功能模块状态同步失败', error)
          })
          .finally(markFeaturesReady)
      }
      sync()
      const unwatch = settings.watch(sync)
      // 原生 Host HMR 会销毁上一代 Fiber，必须连同功能资源一起收回。
      return async () => {
        unwatch()
        markFeaturesReady()
        await registry.reconcile([])
      }
    }, 'codingns4dsh: 功能模块启停同步')
```

</details>

**依据 5 · 源码核查**：[src/host/cli-adapters/feature.ts:197-222](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/feature.ts#L197-L222)

外部驱动的实际实例清单。

<details>
<summary>查看原文（26行）</summary>

```text
      // 启动只恢复持久化索引；旧会话在打开时迁移，禁止在首屏扫描全部历史。
      const registry = options.registry ?? new CodingNsCliAdapterRegistry([
        new CommandCodeDriver({ enableAcp: true }),
        new ClaudeCodeDriver(),
        new KimiCliDriver(),
        new GeminiCliDriver(),
        new PiAgentDriver(),
        new CodexAppServerDriver({ computerUse: 'auto' }),
        new OpenCodeDriver(),
        new GrokBuildDriver(),
        new MiniMaxCodeDriver(),
        new ZcodeAppServerDriver(),
        new CodeBuddyCliDriver(),
        new WorkBuddyCliDriver(),
        new CursorCliDriver(),
        new KiroCliDriver(),
        new QoderCliDriver(),
        new QoderCliDriver({ variant: 'qoder-cn' }),
        new AntigravityDriver(),
        new DoubaoAppDriver(),
      ], context.services.settings?.get().agentAdapters, {
        sessionStore,
        ...(context.services.settings === undefined ? {} : { settings: context.services.settings }),
        ...(context.services.nativeSessions === undefined ? {} : { nativeSessions: context.services.nativeSessions }),
      })
      setAdapterRegistry(registry)
```

</details>

**依据 6 · 源码核查**：[src/host/cli-adapters/feature.ts:783-840](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/feature.ts#L783-L840)

会话权限、cwd、模型与取消信号进入执行和投影器。

<details>
<summary>查看原文（58行）</summary>

```text
          const permission = resolveSessionPermission(context.services.dshContext, sessionId)
          let magpieCodexContextWindow: number | undefined
          if (config.adapterId === 'codex' && config.modelId !== undefined && typeof magpieUsage.readModelMetadata === 'function') {
            try {
              magpieCodexContextWindow = (await magpieUsage.readModelMetadata('codex', config.modelId, requestSignal))?.contextWindow
            } catch (error) {
              if (!requestSignal.aborted) throw error
            }
          }
          // 只有 Provider 驱动明确声明可以维护连续事件流，才把工具边界映射为 DSH step。
          // Command Code、Codex 自己维护 assistant 消息边界；OpenCode 由 Registry
          // 挂起并续读同一条 SSE。其他驱动仍把整轮保持在一个 step，避免 token-meter
          // 在下一条 usage 到达前失去投影。
          const input = {
            sessionId,
            messages: turnInput.messages,
            prompt,
            ...(turnInput.peerInput ? { peerInput: true } : {}),
            ...(translationLanguage === undefined ? {} : { translationLanguage }),
            ...(turnInput.attachments.length === 0 ? {} : { attachments: turnInput.attachments }),
            ...(permission === undefined ? {} : { permission }),
            ...(turnOptions.plan === true ? { plan: true } : {}),
            ...(turnOptions.forkSession === true ? { forkSession: true } : {}),
            ...(turnOptions.enableAskUserQuestion === true ? { enableAskUserQuestion: true } : {}),
            ...(runtimeEnv === undefined && credentialResolution === undefined
              ? {}
              : { runtimeEnv: { ...(runtimeEnv ?? {}), ...(credentialResolution?.runtimeEnv ?? {}) } }),
            ...(config.modelId ? { modelId: config.modelId } : {}),
            ...(magpieCodexContextWindow === undefined ? {} : { modelContextWindow: magpieCodexContextWindow }),
            ...(config.effortId ? { effortId: config.effortId } : {}),
            ...(config.serviceTierId ? { serviceTierId: config.serviceTierId } : {}),
            ...(config.translationEnabled === undefined ? {} : { translationEnabled: config.translationEnabled }),
            ...(config.providerSessionId ? { providerSessionId: config.providerSessionId } : {}),
            ...(config.rawStoreRef ? { rawStoreRef: config.rawStoreRef } : {}),
            ...(cwd === undefined ? {} : { cwd }),
            ...(requestSignal === undefined ? {} : { signal: requestSignal }),
            ...((registry.supportsSegmentedTurns(config.adapterId) || registry.supportsToolStepSplitting(config.adapterId))
              // SessionStore/controller 可能是远端代理而未标记 available，但原生
              // Agent 仍然提供 inject；用真实的 next-step 能力决定分段，不能让
              // available 这个聚合状态把 OpenCode/Command Code 退回单 step。
              && nativeSessions?.injectNextStep !== undefined
              && (nativeSessions.canInjectNextStep === undefined
                || nativeSessions.canInjectNextStep(sessionId))
              ? { splitToolSteps: true }
              : {}),
          }
          const projector = new CodingNsDshMessageProjector({
            adapterId: config.adapterId,
            sessionId,
            ...(config.modelId === undefined ? {} : { modelId: config.modelId }),
            ...(permission === undefined ? {} : { permission }),
            ...(nativeSessions === undefined ? {} : { nativeSessions }),
            ...(input.signal === undefined ? {} : { signal: input.signal }),
            respondPermission: (response) => registry.respondPermission(sessionId, response),
            respondQuestion: (response) => registry.respondQuestion(sessionId, response),
            ...(translation === undefined ? {} : { translation }),
            ...(translation === undefined ? {} : { translationEnabled: config.translationEnabled === true }),
            prefetchQuestionTranslation: questions => {
```

</details>

**依据 7 · 源码核查**：[src/host/cli-adapters/registry.ts:567-605](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/registry.ts#L567-L605)

同会话并发及归档/维护状态检查。

<details>
<summary>查看原文（39行）</summary>

```text
  async *execute(input: CodingNsCliTurnInput & { readonly adapterId: CodingNsCliAdapterId }): AsyncIterable<CodingNsAgentEvent> {
    if (this.maintenanceAdapters.has(input.adapterId)) {
      throw new CodingNsRpcError('CODINGNS_CLI_MANAGEMENT_BUSY', 'This Agent is being installed or updated. Wait for it to finish.')
    }
    const driver = this.requireEnabledDriver(input.adapterId)
    const driverInput = withCodexContextWindow(input, input.adapterId)
    if (this.archivingSessions.has(input.sessionId)) {
      throw new CodingNsRpcError('CODINGNS_CLI_INVALID_SESSION', '外部会话正在归档，不能开始新一轮执行')
    }
    if (this.executingSessions.has(input.sessionId)) {
      throw new CodingNsRpcError('CODINGNS_CLI_INVALID_SESSION', '外部会话已有一轮执行正在进行')
    }
    this.executingSessions.set(input.sessionId, input.adapterId)
    const previous = this.sessions.get(input.sessionId)
    if (previous !== undefined && previous.adapterId !== input.adapterId) this.lastUsages.delete(input.sessionId)
    let current = {
      ...(previous ?? { adapterId: input.adapterId }),
      ...(input.modelId?.trim() ? { modelId: input.modelId.trim() } : {}),
      ...(input.effortId?.trim() ? { effortId: input.effortId.trim() } : {}),
      ...(input.serviceTierId?.trim() ? { serviceTierId: input.serviceTierId.trim() } : {}),
      ...(input.translationEnabled !== undefined ? { translationEnabled: input.translationEnabled } : {}),
      // 续接请求自身带有 Provider 身份时必须写回当前内存配置；否则首轮
      // 恰好发生在页面恢复/迁移窗口内，会在下一轮丢失 --resume 所需的 ID。
      ...(input.providerSessionId?.trim() ? { providerSessionId: input.providerSessionId.trim() } : {}),
      ...(input.rawStoreRef?.trim() ? { rawStoreRef: input.rawStoreRef.trim() } : {}),
    }
    // 除了 Client 的 session/set，Host 内部和未来的调用方也可能直接执行一轮。
    // 最近使用应由真实执行参数更新，不能依赖某个 UI 一定先发 RPC。
    if (current.teamId === undefined) this.rememberPreference(input.adapterId, input)
    // 手动 next() 不会自动转发外层的 return()；本轮持有的迭代器必须在 finally 关闭。
    // 只有显式交给 segmentedTurns 的流才能跨 DSH step 保留。
    let iterator: AsyncIterator<CodingNsAgentEvent> | undefined
    let nativeSessionReady = false
    try {
      const stored = this.sessionStore?.get(input.sessionId)
      if (stored?.status === 'archived') {
        throw new CodingNsRpcError('CODINGNS_CLI_INVALID_SESSION', '外部会话已归档，不能继续执行')
      }
      if (stored !== undefined && (stored.providerSessionId !== undefined || stored.rawStoreRef !== undefined)) {
```

</details>

**依据 8 · 源码核查**：[src/host/cli-adapters/registry.ts:673-682](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/registry.ts#L673-L682)

注册表实际调用驱动的executeTurn。

<details>
<summary>查看原文（10行）</summary>

```text
      // 通用切分要在复用时立刻撤销登记，否则耗尽后的旧迭代器会被下一条用户消息再次消费。
      if (resumingSegmentedTurn && suspended !== undefined && suspended.iterator !== null) {
        this.segmentedTurns.delete(input.sessionId)
        iterator = suspended.iterator
      } else {
        iterator = driver.executeTurn({ ...resumedDriverInput, ...(resumingDriverTurn ? { resumeSegmentedTurn: true } : {}) })[Symbol.asyncIterator]()
      }
      while (true) {
        const next = await iterator.next()
        if (next.done || next.value.type === 'finish') {
```

</details>

**依据 9 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:313-337](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L313-L337)

创建恢复供应商线程并绑定providerSessionId。

<details>
<summary>查看原文（25行）</summary>

```text
  private async *executeRawTurn(input: CodingNsCliTurnInput): AsyncIterable<CodingNsAgentEvent> {
    const command = this.cachedBinary ?? (await this.detect()).command
    if (command === null) throw new Error('Codex 未安装')
    if (input.splitToolSteps && this.supportsSegmentedTurns) {
      yield* this.executeSegmentedTurn(input, command)
      return
    }
    const session = await this.getSession(input, command)
    prepareCodexSession(session, input)
    const rpc = session.rpc
    try {
      if (session.threadId === '') {
        const threadParams = codexThreadParams(input)
        const resumeThreadId = input.providerSessionId ?? session.resumeThreadId
        const thread = resumeThreadId
          ? await rpc.request('thread/resume', { threadId: resumeThreadId, ...threadParams }, { signal: input.signal, killOnAbort: false })
          : await rpc.request('thread/start', threadParams, { signal: input.signal, killOnAbort: false })
        session.threadId = readId(thread) ?? input.providerSessionId ?? input.sessionId
        session.providerSessionId = session.threadId
        session.threadModelId = readThreadModel(thread)
        session.threadServiceTierId = readThreadServiceTier(thread)
      }
      await this.alignThreadModel(session, input)
      await this.alignThreadServiceTier(session, input)
      await this.ensureContextCapacity(session, input)
```

</details>

**依据 10 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:384-424](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L384-L424)

订阅先于回合开始，处理取消和通知。

<details>
<summary>查看原文（41行）</summary>

```text
      // 与父仓库 CodexRuntimeAdapter 一致：监听器必须先于 turn/start 注册，
      // 否则响应前到达的 turn/started 或文本通知也会丢失。
      const removeNotificationListener = rpc.addNotificationListener(onNotification)
      const onAbort = (): void => {
        terminalReason = 'cancel'
        eventQueue.close()
      }
      if (input.signal?.aborted) onAbort()
      else input.signal?.addEventListener('abort', onAbort, { once: true })
      try {
        const response = await this.startTurn(session, input)
        // turn/start 可能因上下文超限内部触发 compact；压缩事件在重试成功后
        // 仍需先交给公共投影器，不能留在驱动的暂存队列里。
        yield* drainCompactionEvents(session)
        const responseTurnId = readTurnId(response)
        if (responseTurnId !== null) {
          session.turnId = responseTurnId
        }
        turnStartResolved = true
        // 响应前缓存的通知可能来自 thread/resume 的旧历史。没有 turnId 的事件
        // 无法证明属于本次回合，因此只能丢弃；有明确 turnId 的事件仍按原有规则处理。
        for (const message of notificationsBeforeTurnStart.splice(0)) acceptNotification(message, false)
        // 某些 app-server 会直接在 turn/start 响应中返回终态。父仓库把它
        // 归一化成 turn/completed，这里复用同一规则，避免永久等待通知。
        const responseTerminal = buildCodexCompletionNotification(response, session.threadId)
        if (responseTerminal !== null) onNotification(responseTerminal)

        for await (const message of eventQueue.iterable) {
          const rawChunk = codexMessageToChunk(message, input.cwd)
          if (rawChunk === null) continue
          for (const chunk of expandCodexCompactionChunk(session, rawChunk)) {
            if (chunk.type !== 'finish') sawMeaningfulEvent = true
            yield stabilizeCodexEvent(session, chunk)
          }
        }
        if (input.signal?.aborted) await this.interrupt(input.sessionId)
      } catch (error) {
        if (!input.signal?.aborted) throw error
        await this.interrupt(input.sessionId)
      } finally {
        input.signal?.removeEventListener('abort', onAbort)
```

</details>

**依据 11 · 源码核查**：[src/host/cli-adapters/dsh-message-projector.ts:377-402](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/dsh-message-projector.ts#L377-L402)

审批仅在allowed-once时通过。

<details>
<summary>查看原文（26行）</summary>

```text
  private async requestPermission(event: Extract<CodingNsAgentEvent, { type: 'permission-request' }>): Promise<void> {
    const responder = this.options.respondPermission
    if (responder === undefined) throw new Error('外部 Agent 发送了权限请求，但适配器没有权限回复接口')
    let detail = event.detail
    const planReview = event.kind === 'plan' || ['exitplanmode', 'exit_plan_mode'].includes(event.toolName?.toLowerCase() ?? '')
    if (planReview && detail && this.options.translation?.shouldTranslate(this.options.adapterId, 'assistant', this.options.translationEnabled)) {
      try {
        const record = await this.options.translation.translateOutput(this.options.adapterId, 'assistant', detail, this.options.signal, this.options.translationEnabled)
        if (record !== null && !record.failed) detail = record.translated
      } catch { /* Keep the original plan when translation is unavailable. */ }
    }
    const outcome = await this.options.nativeSessions?.requestApproval?.(this.options.sessionId, {
      requestId: event.requestId,
      toolName: event.toolName ?? (event.kind || 'external-agent'),
      ...(event.callId ? { callId: event.callId } : {}),
      ...(detail ? { reason: detail } : {}),
      ...(this.options.signal === undefined ? {} : { signal: this.options.signal }),
    }) ?? 'unavailable'
    const approved = outcome === 'allowed-once'
    const reason = approvalReason(outcome, this.options.permission)
    await responder({ requestId: event.requestId, approved, ...(reason === undefined ? {} : { reason }) })
  }

  private async requestQuestions(event: Extract<CodingNsAgentEvent, { type: 'question-request' }>): Promise<void> {
    this.options.signal?.throwIfAborted()
    const responder = this.options.respondQuestion
```

</details>

**依据 12 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:987-1034](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L987-L1034)

中断、分类审批与提问回传。

<details>
<summary>查看原文（48行）</summary>

```text
  async interrupt(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session === undefined || session.threadId === '' || session.turnId === null) return
    try { await session.rpc.request('turn/interrupt', { threadId: session.threadId, turnId: session.turnId }, { killOnAbort: false }) }
    catch { /* app-server 可能已经发出 turn/completed */ }
  }

  /**
   * 丢弃等待下一个 DSH step 的分段运行（取消、注入失败或切换适配器时）。
   * 队列关闭后旧回合的通知不会再被投影进下一轮，续段标记同时解除。
   */
  discardSegmentedTurn(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session?.segmentedTurn === undefined) return
    this.closeSegmentedTurn(session, session.segmentedTurn)
  }

  /** 回传原生权限请求；审批值只在 Host 进程中流转。 */
  respondPermission(sessionId: string, response: CodingNsAgentPermissionResponse): void {
    const session = this.sessions.get(sessionId)
    const pending = session?.pendingPermissions.get(response.requestId)
    if (pending === undefined || session === undefined) throw new Error('Codex 权限请求不存在')
    session.pendingPermissions.delete(response.requestId)
    if (pending.response === 'file-change') {
      pending.resolve({ decision: response.approved ? 'accept' : 'decline' })
    } else if (pending.response === 'command') {
      pending.resolve({ decision: response.approved ? 'accept' : 'decline' })
    } else if (pending.response === 'permissions') {
      // `item/permissions/requestApproval` 的应答形状是 {permissions, scope}，
      // 不是 {approved}。批准回显请求画像；拒绝给空画像，语义等价于“不授予额外权限”。
      pending.resolve(response.approved
        ? { permissions: grantedPermissionProfile(pending.requested), scope: 'turn' }
        : { permissions: {}, scope: 'turn' })
    } else {
      pending.resolve({
        approved: response.approved,
        ...(response.reason?.trim() ? { reason: response.reason.trim().slice(0, 512) } : {}),
      })
    }
  }

  /** 回传 requestUserInput 的结构化回答。 */
  respondQuestion(sessionId: string, response: CodingNsAgentQuestionResponse): void {
    const session = this.sessions.get(sessionId)
    const resolve = session?.pendingQuestions.get(response.requestId)
    if (resolve === undefined || session === undefined) throw new Error('Codex 问题请求不存在')
    session.pendingQuestions.delete(response.requestId)
    resolve({ answers: questionAnswersRecord(response) })
```

</details>

**依据 13 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:2122-2154](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L2122-L2154)

权限缺省与沙箱/审批映射。

<details>
<summary>查看原文（33行）</summary>

```text
 * （工作区可写），不能推断为完全权限。三个字段必须来自同一份状态。
 */
function codexSandboxMode(input: CodingNsCliTurnInput): CodingNsCliSandboxMode {
  return input.permission?.sandboxMode ?? 'workspace-write'
}

function codexSandboxPolicy(input: CodingNsCliTurnInput, cwd: string): Record<string, unknown> {
  const mode = codexSandboxMode(input)
  // danger-full-access 必须映射成 Codex 自己的 bypass 形状；继续下发
  // workspaceWrite 会让 DSH 声明完全权限、Codex 实际只读，两侧语义分叉。
  if (mode === 'danger-full-access') return { type: 'dangerFullAccess' }
  if (mode === 'read-only') return { type: 'readOnly', networkAccess: false }
  // DSH 的 workspace-write 只约束自身工具沙箱，不会自动传递给 Codex
  // app-server。显式声明当前工作区，避免 Codex 将文件编辑误判为只读越权。
  return {
    type: 'workspaceWrite',
    writableRoots: [cwd],
    networkAccess: false,
    excludeTmpdirEnvVar: false,
    excludeSlashTmp: false,
  }
}

/**
 * 由同一份权限状态派生审批策略。
 *
 * DSH 的 `never` 表示“需要审批的动作会被自动拒绝”，因此绝不能同时向 Codex
 * 声明 `on-request`：那会让 Codex 发起注定被自动拒绝的审批，模型还会误以为
 * 用户拒绝了它。`ask` 才映射为 Codex 的 `on-request`。
 */
function codexApprovalPolicy(input: CodingNsCliTurnInput): string {
  return input.permission?.approvalPolicy === 'never' ? 'never' : 'on-request'
}
```

</details>

**依据 14 · 源码核查**：[src/client/index.ts:204-248](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/client/index.ts#L204-L248)

Client实际注册功能、订阅设置并卸载清理。

<details>
<summary>查看原文（45行）</summary>

```text
    const registry = new FeatureRegistry<CodingNsClientServices, CodingNsClientFeatureModule>(services, capabilityProfile)
    // 界面字号联动：能力就绪时把插件字号基准指向 DSH 正文字号变量。旧版本能力缺失，
    // `fontSize()` 回落到基准像素，插件界面字号与今天逐字一致。
    const fontScaleCapability = capabilityProfile.capabilities.get('theme.font-scale')
    if (fontScaleCapability?.status === 'ready') {
      settingsCtx.effect(() => installFontScale(), 'codingns4dsh: ui font scale')
      debugInfo('codingns4dsh: font scale linked', { route: fontScaleCapability.routeId })
    }
    registry.registerMany(CLIENT_FEATURES)
    registry.validate()
    debugInfo('codingns4dsh: client feature registry ready', { features: registry.descriptors().map((item) => item.name) })
    const restartStates: Record<string, boolean> = {}
    let restartStatesCaptured = false

    settingsCtx.effect(() => {
      const sync = (): void => {
        const snapshot = settings.getSnapshot()
        if (!restartStatesCaptured && snapshot.status === 'ready') {
          Object.assign(restartStates, captureRestartFeatureStates(registry.descriptors(), snapshot.value, dshVersion))
          restartStatesCaptured = true
        }
        const enabled = enabledFeatureNames(registry.descriptors(), snapshot.value, restartStates, dshVersion)
        debugInfo('codingns4dsh: client feature sync', {
          settingsStatus: snapshot.status,
          settingsRevision: snapshot.revision,
          enabled,
          states: registry.list(),
        })
        void registry
          .reconcile(enabled)
          .catch((error: unknown) => {
            console.error('codingns4dsh: 功能模块状态同步失败', error)
          })
      }
      sync()
      const loading = settings.load?.()
      if (loading !== undefined) {
        void loading.catch((error: unknown) => {
          console.error('codingns4dsh: 远程设置读取失败', error)
        })
      }
      const unsubscribe = settings.subscribe(sync)
      return async () => {
        unsubscribe()
        await registry.reconcile([])
```

</details>

**依据 15 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:1997-2016](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L1997-L2016)

thread/start实际携带沙箱与审批策略，避免仅在turn级传递。

<details>
<summary>查看原文（20行）</summary>

```text
 * 权限必须在这里就与 `turn/start` 保持一致：Codex 的线程级沙箱会成为后续回合
 * 的默认值，只在 turn 上覆盖会让首次工具调用落到与 DSH 不同的模式。
 */
function codexThreadParams(input: CodingNsCliTurnInput): Record<string, unknown> {
  const bridgeInstructions = codexBridgeDeveloperInstructions(input.sessionId)
  const developerInstructions = [
    CODEX_QUESTION_DEVELOPER_INSTRUCTIONS,
    CODEX_PERMISSION_DEVELOPER_INSTRUCTIONS,
    bridgeInstructions,
  ].filter((instructions) => instructions !== undefined).join('\n\n')
  const serviceTier = codexServiceTier(input.serviceTierId)
  return {
    cwd: input.cwd ?? process.cwd(),
    sandbox: codexSandboxMode(input),
    approvalPolicy: codexApprovalPolicy(input),
    ...(!isProviderDefaultModel(input.modelId) ? { model: input.modelId } : {}),
    ...(serviceTier === undefined ? {} : { serviceTier }),
    developerInstructions,
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模块启停和资源释放是否足以保证权限与状态安全？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

模块注册表提供资源所有权和启停秩序，不能等同于进程隔离或多租户授权。每个模块有状态、依赖和资源scope；reconcile按队列串行，启动先处理依赖并检查宿主能力，某模块失败被记录且其余模块仍继续。资源scope逆序调用所有disposer并聚合错误，启动抛错也尝试释放已登记资源。这些机制能解释为何多模块不必共享一个脆弱的总开关。

限制是释放回调成功与否仍由具体模块决定。dispose即使收集到错误也先把记录状态设为disabled，再抛出聚合错误，因此“已停用”标签不能独立证明socket或进程全已终止。cliAdapters清理主动停止会话store写入、abort生命周期、dispose管理器和驱动并flush；这比只移除UI完整，但仍须看驱动与外部进程的实际结果。Codex interrupt吞掉异常，可能只是上游已结束，也可能无法确认中断，不能从本地finish=cancel推断外部副作用停止。

审批映射采用同一DSH会话权限并在原生审批不可用时拒绝，属于有用的边界；它没有使外部供应商实现获得统一的强制沙箱。DSH设为完全权限时会显式传递上游全权限，未知权限时workspace-write仍可写工作区而非只读。bundle patch还替换原生终端与目录选择，安装或卸载须核对整个profile，不能仅按模块开关判断恢复原状。

本轮没有核查远程网关、凭据存储和语音的完整授权链，故不对这些功能的安全性下结论；局域网配置默认autoStart=false，只能证明默认不自动启动该监听，不能证明用户启用后的网络隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/registry.ts:53-89](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/features/registry.ts#L53-L89)

资源scope逆序释放、继续尝试并聚合错误。

<details>
<summary>查看原文（37行）</summary>

```text
  private readonly disposers: FeatureDisposer[] = []
  private isDisposed = false

  get disposed(): boolean {
    return this.isDisposed
  }

  add(disposer: FeatureDisposer): void {
    if (typeof disposer !== 'function') {
      throw new TypeError('Feature disposer must be a function')
    }
    if (this.isDisposed) {
      throw new Error('Feature resource scope is already disposed')
    }
    this.disposers.push(disposer)
  }

  async dispose(): Promise<void> {
    if (this.isDisposed) return
    this.isDisposed = true
    const errors: unknown[] = []
    for (let index = this.disposers.length - 1; index >= 0; index -= 1) {
      try {
        await this.disposers[index]!()
      } catch (error) {
        errors.push(error)
      }
    }
    this.disposers.length = 0
    if (errors.length > 0) {
      throw new AggregateError(errors, 'One or more feature resources failed to dispose')
    }
  }
}

interface FeatureRecord<S, M extends FeatureModule<S>> {
  module: M
```

</details>

**依据 2 · 源码核查**：[src/features/registry.ts:211-250](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/features/registry.ts#L211-L250)

串行reconcile与单模块失败记录。

<details>
<summary>查看原文（40行）</summary>

```text
  async reconcile(enabledNames: readonly string[]): Promise<void> {
    const operation = this.reconcileOperation.then(
      () => this.reconcileInternal(enabledNames),
      () => this.reconcileInternal(enabledNames),
    )
    this.reconcileOperation = operation.catch(() => undefined)
    return operation
  }

  private async reconcileInternal(enabledNames: readonly string[]): Promise<void> {
    this.validate()
    const desired = this.resolveDesired(enabledNames)
    traceFeature('reconcile', {
      requested: enabledNames,
      desired: [...desired],
      states: this.list().map((item) => ({ name: item.name, state: item.state, reason: item.reason })),
    })
    const failures: unknown[] = []
    for (const name of this.records.keys()) {
      if (desired.has(name)) await this.step(name, () => this.start(name), failures)
    }
    for (const name of this.records.keys()) {
      if (!desired.has(name)) await this.step(name, () => this.disable(name), failures)
    }
    if (failures.length > 0) throw failures[0]
  }

  /**
   * 执行单个模块的启停，并把失败留给调用方汇总。
   *
   * 模块失败（例如必需能力缺失）只影响它自己：同一轮同步里其余模块照常启停，
   * 失败原因通过模块状态和 trace 暴露，最后只把第一个错误抛给宿主记录。
   */
  private async step(name: string, operation: () => Promise<void>, failures: unknown[]): Promise<void> {
    try {
      await operation()
    } catch (error) {
      failures.push(error)
      traceFeature('reconcile.failed', { feature: name, error: serializeError(error) })
    }
```

</details>

**依据 3 · 源码核查**：[src/features/registry.ts:274-304](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/features/registry.ts#L274-L304)

释放异常仍设置disabled，再抛错。

<details>
<summary>查看原文（31行）</summary>

```text
  async dispose(name: string): Promise<void> {
    return this.enqueue(name, async () => {
      const record = this.getRecord(name)
      if (record.state === 'disabled') return
      const errors: unknown[] = []
      if (record.state === 'enabled') {
        record.state = 'draining'
        try {
          await record.module.drain?.(record.context)
        } catch (error) {
          errors.push(error)
        }
      }
      try {
        await record.module.dispose?.(record.context)
      } catch (error) {
        errors.push(error)
      }
      try {
        await record.resources.dispose()
      } catch (error) {
        errors.push(error)
      }
      record.state = 'disabled'
      record.reason = errors.length > 0 ? errors.map(errorMessage).join('; ') : null
      if (errors.length > 0) {
        throw new FeatureRegistryError('FEATURE_DISPOSE_FAILED', `Failed to dispose feature ${name}`, name, {
          cause: new AggregateError(errors),
        })
      }
    })
```

</details>

**依据 4 · 源码核查**：[src/features/registry.ts:328-398](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/features/registry.ts#L328-L398)

依赖启动、能力检查及失败后清理。

<details>
<summary>查看原文（71行）</summary>

```text
  private async startInternal(name: string, starting: Set<string>): Promise<void> {
    const record = this.getRecord(name)
    if (record.state === 'enabled') return
    traceFeature('start.begin', { feature: name, state: record.state, dependencies: record.module.descriptor.dependencies })
    if (record.state === 'enabling') {
      throw new FeatureRegistryError('FEATURE_STATE_INVALID', `Feature is already enabling: ${name}`, name)
    }
    if (record.state === 'draining') {
      throw new FeatureRegistryError('FEATURE_STATE_INVALID', `Feature is draining: ${name}`, name)
    }
    if (starting.has(name)) {
      throw new FeatureRegistryError('FEATURE_DEPENDENCY_CYCLE', `Feature dependency cycle includes ${name}`, name)
    }
    starting.add(name)
    for (const dependency of record.module.descriptor.dependencies) {
      await this.enqueue(dependency, () => this.startInternal(dependency, starting))
      const dependencyRecord = this.getRecord(dependency)
      if (dependencyRecord.state !== 'enabled') {
        record.state = 'disabled'
        record.reason = `依赖模块 ${dependency} 未启用`
        traceFeature('start.blocked', { feature: name, dependency, dependencyState: dependencyRecord.state })
        return
      }
    }
    starting.delete(name)

    if (record.resources.disposed) {
      record.resources = new FeatureResourceScopeImpl()
      record.context = { descriptor: record.module.descriptor, resources: record.resources, services: this.services }
    }
    record.state = 'enabling'
    record.reason = null
    const capabilityCheck = this.checkCapabilities(record)
    record.capabilities = capabilityCheck.diagnostics
    traceFeature('start.capabilities', {
      feature: name,
      action: capabilityCheck.action,
      reason: capabilityCheck.reason ?? null,
      diagnostics: capabilityCheck.diagnostics,
    })
    if (capabilityCheck.action === 'disable') {
      record.state = 'disabled'
      record.reason = capabilityCheck.reason ?? null
      traceFeature('start.disabled', { feature: name, reason: record.reason })
      return
    }
    if (capabilityCheck.action === 'error') {
      record.state = 'failed'
      record.reason = capabilityCheck.reason ?? '能力不可用'
      traceFeature('start.failed', { feature: name, reason: record.reason })
      throw new FeatureRegistryError('FEATURE_CAPABILITY_MISSING', record.reason, name)
    }
    record.context = { ...record.context, capabilityDiagnostics: record.capabilities }
    try {
      traceFeature('start.module', { feature: name })
      const returned = await record.module.start(record.context)
      addReturnedDisposer(record.resources, returned)
      record.state = 'enabled'
      traceFeature('start.enabled', { feature: name })
    } catch (error) {
      try {
        await record.resources.dispose()
      } catch (disposeError) {
        error = new AggregateError([error, disposeError], 'Feature start and cleanup failed')
      }
      record.state = 'failed'
      record.reason = errorMessage(error)
      traceFeature('start.failed', { feature: name, reason: record.reason, error: serializeError(error) })
      throw new FeatureRegistryError('FEATURE_START_FAILED', `Failed to start feature ${name}`, name, { cause: error })
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/host/cli-adapters/feature.ts:891-903](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/feature.ts#L891-L903)

cliAdapters清理store、生命周期和registry。

<details>
<summary>查看原文（13行）</summary>

```text
        // DSH 先停用设置上下文再执行异步资源清理时，旧的写队列不能继续调用
        // configEditor，否则会出现 inactive context 并污染退出日志。
        sessionStore.dispose()
        // Close native interaction cards before unloading their provider transports.
        lifetime.abort()
        await magpieSelectionWrites
        updates.dispose()
        magpieUpdates.dispose()
        await management.dispose()
        await registry.dispose()
        await sessionStore.flush()
        setAdapterRegistry(undefined)
      })
```

</details>

**依据 6 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:987-992](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L987-L992)

中断异常被捕获，结果不能升级为远端已停。

```text
  async interrupt(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session === undefined || session.threadId === '' || session.turnId === null) return
    try { await session.rpc.request('turn/interrupt', { threadId: session.threadId, turnId: session.turnId }, { killOnAbort: false }) }
    catch { /* app-server 可能已经发出 turn/completed */ }
  }
```

**依据 7 · 源码核查**：[src/shared/contracts/config.ts:540-563](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/shared/contracts/config.ts#L540-L563)

局域网autoStart为false，仅限定默认行为。

<details>
<summary>查看原文（24行）</summary>

```text
export const DEFAULT_CODINGNS_SETTINGS: CodingNsSettings = {
  controlBaseUrl: DEFAULT_CODINGNS_CONTROL_BASE_URL,
  controlBaseUrls: [...DEFAULT_CODINGNS_CONTROL_BASE_URLS],
  modules: {},
  agentAdapters: {},
  agentAdapterPreferences: {},
  subagentBridge: DEFAULT_SUBAGENT_BRIDGE_SETTINGS,
  sessionTranslation: DEFAULT_SESSION_TRANSLATION_SETTINGS,
  sessionHandleEviction: DEFAULT_SESSION_HANDLE_EVICTION_SETTINGS,
  gitManagement: DEFAULT_GIT_MANAGEMENT_SETTINGS,
  terminalEnhancement: DEFAULT_TERMINAL_ENHANCEMENT_SETTINGS,
  workspaceSessionEnhancement: DEFAULT_WORKSPACE_SESSION_ENHANCEMENT_SETTINGS,
  fileManagement: DEFAULT_FILE_MANAGEMENT_SETTINGS,
  mobileAccess: DEFAULT_MOBILE_ACCESS_SETTINGS,
  subscriptionUsage: DEFAULT_SUBSCRIPTION_USAGE_SETTINGS,
  subscriptionReports: DEFAULT_SUBSCRIPTION_REPORT_SETTINGS,
  lanAccessDsh: {
    autoStart: false,
    listenHost: '0.0.0.0',
    listenPort: 13080,
    dshPort: 0,
    pwa: DEFAULT_LAN_ACCESS_DSH_PWA_SETTINGS,
  },
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续使用、异常恢复及退出分别由谁承担什么成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

使用者需要维护DSH、Node和每个实际使用的外部CLI及其登录，插件不会替代供应商账户。包声明Node>=24.9.0、DSH>=0.2.1-alpha.2和Cordis ~4.0.6-alpha.1，作者推荐安装后重启；版本兼容表与测试说明仍是作者材料。本轮不核实实时npm包和具体供应商收费，不能把插件本身可取得解释为全链免费。

首次可按README在独立profile接入，备份已有profile与供应商历史，只启用一个已经安装登录的Agent，把工作目录限定为可丢弃项目，并检查原生审批允许、拒绝和提问取消是否各回到正确线程。持续使用需核对模型/档位偏好、外部CLI升级及供应商会话绑定；registry执行会检查缺失的供应商会话，避免把已删除历史当作可继续，但不能自动重建不存在的任务状态。

故障恢复包括查Host、驱动与供应商三方状态，取消后确认外部任务、保存真实产物，再决定续接或退回原CLI。退出版面可停用模块或移除插件并重启；供应商历史、工作区文件及已执行命令不会被撤销，bundle替换的原生入口也要随profile核对。遇到错误工作目录、审批状态对不上、取消后继续写入或无法恢复原生终端，应该停止该profile试用，转回已有CLI与受控副本。

本版本有可隔离的代表链路试用路径，适合确有多CLI切换需求的开发者；不建议直接把所有模块、远程访问和生产项目同时开启。按一次完成并人工确认的代码任务计量成本，应把失败、重试、审批、恢复与插件维护纳入。没有任务对照和费用记录，无法给出有限单位合格任务成本或ROI。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-20](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/package.json#L1-L20)

包身份和构建入口，npm版本声明不等于已安装。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "@jingyi0605/codingns4dsh",
  "version": "0.2.2-beta.1",
  "description": "为 DSH 集成多种编程 Agent、项目管理、智能助理与远程访问。",
  "repository": {
    "type": "git",
    "url": "https://github.com/jingyi0605/Codingns4DSH"
  },
  "license": "GPL-3.0-or-later",
  "type": "module",
  "main": "./data/build/dist/index.js",
  "types": "./data/build/dist/index.d.ts",
  "bin": {
    "codingns-credential": "./bin/codingns-credential.mjs"
  },
  "exports": {
    ".": {
      "types": "./data/build/dist/index.d.ts",
      "default": "./data/build/dist/index.js"
    },
```

</details>

**依据 2 · 源码核查**：[package.json:59-72](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/package.json#L59-L72)

Node、DSH与Cordis依赖条件。

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "dsh": ">=0.2.1-alpha.2",
    "node": ">=24.9.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.6-alpha.1",
    "@deepseek-ai/dsh": ">=0.2.1-alpha.2",
    "l2d": "2.1.1"
  },
  "peerDependenciesMeta": {
    "l2d": {
      "optional": true
    }
  },
```

</details>

**依据 3 · 作者声明**：[README.md:240-272](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/README.md#L240-L272)

安装、独立profile、重启与卸载为作者使用指导。

<details>
<summary>查看原文（33行）</summary>

````text
## 安装

**环境要求**：DSH `>=0.2.1-alpha.2`（已验证 `0.2.2-alpha.2`；更高版本会显示未验证警告，但不阻止安装或运行）、Node.js `>=24.9`，并安装 pnpm。macOS/Linux 的持久终端还需要 tmux。

### 使用内置 Web 配置

```bash
dsh plugin --profile web add @jingyi0605/codingns4dsh@0.2.2-beta.1
dsh web
```

### 可选：使用独立配置

需要独立环境时，从内置 Web 配置创建 Profile（运行配置）：

```bash
dsh codingns --from-default-profile web --dump-config
dsh plugin --profile codingns add @jingyi0605/codingns4dsh@0.2.2-beta.1
dsh codingns
```

已有 DSH 实例安装或升级插件后需重启。升级时将安装命令中的版本号替换为目标版本；卸载使用 `dsh plugin --profile web remove @jingyi0605/codingns4dsh`，独立配置请将 `web` 替换为配置名。

---

## 首次使用

1. 打开 **设置 → Codingns4DSH**，启用需要的模块。
2. 在运行 DSH 的电脑上安装并登录 Agent，在输入框选择 Agent 与模型开始对话。
3. 通过右侧栏使用终端、Git、文件与调试工具。
4. 启用全局智能助理，创建角色后开始交流；实时语音可在声音管理中准备资源。
5. 需要跨设备使用时，配置局域网或中转访问，并按需启用登录保护。

````

</details>

**依据 4 · 源码核查**：[src/host/cli-adapters/registry.ts:598-613](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/registry.ts#L598-L613)

执行前检查已归档与已删除的供应商会话。

<details>
<summary>查看原文（16行）</summary>

```text
    let iterator: AsyncIterator<CodingNsAgentEvent> | undefined
    let nativeSessionReady = false
    try {
      const stored = this.sessionStore?.get(input.sessionId)
      if (stored?.status === 'archived') {
        throw new CodingNsRpcError('CODINGNS_CLI_INVALID_SESSION', '外部会话已归档，不能继续执行')
      }
      if (stored !== undefined && (stored.providerSessionId !== undefined || stored.rawStoreRef !== undefined)) {
        await this.refreshProviderState(stored, true)
        if (this.sessionStore?.get(input.sessionId)?.providerState === 'missing') {
          throw new CodingNsRpcError('CODINGNS_CLI_SESSION_MISSING', '外部 Agent 原始会话已删除，无法继续恢复')
        }
      }
      const suspended = this.segmentedTurns.get(input.sessionId)
      const resumingSegmentedTurn = suspended?.adapterId === input.adapterId
      let deferredPeerInput = resumingSegmentedTurn ? suspended?.deferredPeerInput : undefined
```

</details>

**依据 5 · 源码核查**：[src/host/cli-adapters/feature.ts:891-903](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/feature.ts#L891-L903)

退出时仍需清理和flush，停用不是撤销已执行工作。

<details>
<summary>查看原文（13行）</summary>

```text
        // DSH 先停用设置上下文再执行异步资源清理时，旧的写队列不能继续调用
        // configEditor，否则会出现 inactive context 并污染退出日志。
        sessionStore.dispose()
        // Close native interaction cards before unloading their provider transports.
        lifetime.abort()
        await magpieSelectionWrites
        updates.dispose()
        magpieUpdates.dispose()
        await management.dispose()
        await registry.dispose()
        await sessionStore.flush()
        setAdapterRegistry(undefined)
      })
```

</details>

**依据 6 · 源码核查**：[dsh.bundle.patch:1-22](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/dsh.bundle.patch#L1-L22)

profile改变涉及原生终端和目录选择，因此退出需核对组合。

<details>
<summary>查看原文（22行）</summary>

```text
# 官方终端 Host 与 Client 行必须成对停用，避免重复 terminal namespace 和
# webTerminals service；codingns4dsh 在同一个 Bundle generation 中提供两者。
# rc3 没有这两个行，DSH 会按可选 patch 记录 warning 并继续启动；alpha2 则会正常命中。
- id: terminal-controller
  name: '@deepseek-ai/dsh-api-terminal-controller'
  disabled: true
- id: ui-sidebar-terminal
  name: '@deepseek-ai/dsh-client-ui-sidebar-terminal'
  disabled: true
# 远程访问必须始终使用网页模态框。默认的 auto 会按 Host 环境切换到原生系统选择器，
# 这对远程浏览器不可达，而且会让同一个“添加工作区”入口出现两套交互。
- id: directory-picker
  name: '@deepseek-ai/dsh-host-directory-picker-auto'
  disabled: true
- insert:
    - id: directory-picker-browse
      name: '@deepseek-ai/dsh-host-directory-picker-browse'
    - id: ui-directory-picker-browse
      name: '@deepseek-ai/dsh-client-ui-directory-picker-browse'
- insert:
    - id: '@jingyi0605/codingns4dsh'
      name: '@jingyi0605/codingns4dsh'
```

</details>

#### 缺口

- 没有真实任务的成功率、人工时间、供应商费用和升级恢复记录。
  **影响**：不能证明总负担较低或持续采用优于独立CLI。
  **进一步探讨**：用同一任务对照原CLI与一个Agent的隔离profile，统计全部尝试、合格交付、维护与恢复投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪个跨 Agent 一致性假设值得验证，怎样被反例推翻？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可复用设计是把功能生命周期和供应商协议分别抽象：FeatureRegistry管理依赖与资源，CliAdapterRegistry把DSH会话与供应商身份绑定，消息投影器集中处理原生审批和提问；Codex驱动仍保留各协议的细节。其意义是公共交互不必在每个驱动重写，而非消除了供应商差异。移植仍需原生会话审批服务、能力诊断及供应商版本维护。

由Q02的权限参数映射与Q03的取消/停用结果边界，可以提出未验证假设：为每个适配器公开一组可观察的交互契约，分别报告“审批已回传”“回合已请求中断”“上游已确认结束”“外部副作用仍未知”，再把模块状态与这些事实区分，可能降低用户把统一界面误认成统一执行保证的风险。新增的是完成证据和未知态表达，不是再加一个Agent选择器；代价是每种协议的终态检测、事件持久化以及失败后的人工确认。

最小验证选两个已配置的异构驱动，以同一可丢弃项目检查批准、拒绝、提问关闭、流式取消、CLI崩溃及插件停用。对照当前展示与契约展示，记录错误成功/停止表述、错线程事件、恢复所需动作和总时间。只有证据明确的状态可显示完成；任何未确认停止却宣称无后续写入、或契约引入更多无法恢复悬挂任务，都削弱假设。本轮未运行该实验，不把它计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/registry.ts:274-304](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/features/registry.ts#L274-L304)

停用状态与资源释放错误可以并存，构成更明确状态契约的依据。

<details>
<summary>查看原文（31行）</summary>

```text
  async dispose(name: string): Promise<void> {
    return this.enqueue(name, async () => {
      const record = this.getRecord(name)
      if (record.state === 'disabled') return
      const errors: unknown[] = []
      if (record.state === 'enabled') {
        record.state = 'draining'
        try {
          await record.module.drain?.(record.context)
        } catch (error) {
          errors.push(error)
        }
      }
      try {
        await record.module.dispose?.(record.context)
      } catch (error) {
        errors.push(error)
      }
      try {
        await record.resources.dispose()
      } catch (error) {
        errors.push(error)
      }
      record.state = 'disabled'
      record.reason = errors.length > 0 ? errors.map(errorMessage).join('; ') : null
      if (errors.length > 0) {
        throw new FeatureRegistryError('FEATURE_DISPOSE_FAILED', `Failed to dispose feature ${name}`, name, {
          cause: new AggregateError(errors),
        })
      }
    })
```

</details>

**依据 2 · 源码核查**：[src/host/cli-adapters/dsh-message-projector.ts:377-435](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/dsh-message-projector.ts#L377-L435)

公共审批与提问转换减少重复适配，同时保留取消和组件不可用边界。

<details>
<summary>查看原文（59行）</summary>

```text
  private async requestPermission(event: Extract<CodingNsAgentEvent, { type: 'permission-request' }>): Promise<void> {
    const responder = this.options.respondPermission
    if (responder === undefined) throw new Error('外部 Agent 发送了权限请求，但适配器没有权限回复接口')
    let detail = event.detail
    const planReview = event.kind === 'plan' || ['exitplanmode', 'exit_plan_mode'].includes(event.toolName?.toLowerCase() ?? '')
    if (planReview && detail && this.options.translation?.shouldTranslate(this.options.adapterId, 'assistant', this.options.translationEnabled)) {
      try {
        const record = await this.options.translation.translateOutput(this.options.adapterId, 'assistant', detail, this.options.signal, this.options.translationEnabled)
        if (record !== null && !record.failed) detail = record.translated
      } catch { /* Keep the original plan when translation is unavailable. */ }
    }
    const outcome = await this.options.nativeSessions?.requestApproval?.(this.options.sessionId, {
      requestId: event.requestId,
      toolName: event.toolName ?? (event.kind || 'external-agent'),
      ...(event.callId ? { callId: event.callId } : {}),
      ...(detail ? { reason: detail } : {}),
      ...(this.options.signal === undefined ? {} : { signal: this.options.signal }),
    }) ?? 'unavailable'
    const approved = outcome === 'allowed-once'
    const reason = approvalReason(outcome, this.options.permission)
    await responder({ requestId: event.requestId, approved, ...(reason === undefined ? {} : { reason }) })
  }

  private async requestQuestions(event: Extract<CodingNsAgentEvent, { type: 'question-request' }>): Promise<void> {
    this.options.signal?.throwIfAborted()
    const responder = this.options.respondQuestion
    if (responder === undefined) throw new Error('外部 Agent 发送了问题请求，但适配器没有问题回复接口')
    try { this.options.prefetchQuestionTranslation?.(event.questions) } catch { /* Translation is a side channel. */ }
    // Provider 的 question.asked 往往先于工具结果抵达，且工具输入快照可能是空对象。
    // 先用原生问题事件补齐同一个 tool/call 的可审计输入，避免历史里只显示 `{}`。
    if (event.callId !== undefined) {
      this.toolHistory.observe({
        type: 'tool-event',
        toolName: 'question',
        callId: event.callId,
        input: JSON.stringify({ requestId: event.requestId, questions: event.questions }),
        status: 'running',
      })
    }
    const response = await this.options.nativeSessions?.askQuestions?.(this.options.sessionId, {
      requestId: event.requestId,
      questions: event.questions,
      ...(this.options.signal === undefined ? {} : { signal: this.options.signal }),
    }) ?? null
    // 提问被取消（用户关闭问题卡 / 中止回合）时，Provider 仍挂在自己的
    // 反向请求上等待回包。必须先回一个“取消”形状的响应，再结束本次投影；
    // 否则 Provider 的 prompt 永远不返回，进程内会话被永久占住，后续回合
    // 会在 Provider 侧的“已有 prompt 在运行”检查处直接失败。
    // 这里区分两种 null：signal 已中止是取消，回包后可继续抛 AbortError；
    // 否则是原生问题组件不可用，仍需回包避免 Provider 悬空等待。
    if (response === null) {
      try { await responder({ requestId: event.requestId, answers: [] }) } catch { /* Provider 可能已经取消该请求 */ }
      // A submitted answer can race with cancellation or adapter reload.
      this.options.signal?.throwIfAborted()
      throw new Error('DSH 原生问题组件不可用或问题已取消')
    }
    // A submitted answer can race with cancellation or adapter reload.
    this.options.signal?.throwIfAborted()
    await responder(response)
```

</details>

**依据 3 · 源码核查**：[src/host/cli-adapters/codex-driver.ts:987-1034](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/codex-driver.ts#L987-L1034)

具体驱动的终止和回传形状不同，不能只依赖统一方法名。

<details>
<summary>查看原文（48行）</summary>

```text
  async interrupt(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session === undefined || session.threadId === '' || session.turnId === null) return
    try { await session.rpc.request('turn/interrupt', { threadId: session.threadId, turnId: session.turnId }, { killOnAbort: false }) }
    catch { /* app-server 可能已经发出 turn/completed */ }
  }

  /**
   * 丢弃等待下一个 DSH step 的分段运行（取消、注入失败或切换适配器时）。
   * 队列关闭后旧回合的通知不会再被投影进下一轮，续段标记同时解除。
   */
  discardSegmentedTurn(sessionId: string): void {
    const session = this.sessions.get(sessionId)
    if (session?.segmentedTurn === undefined) return
    this.closeSegmentedTurn(session, session.segmentedTurn)
  }

  /** 回传原生权限请求；审批值只在 Host 进程中流转。 */
  respondPermission(sessionId: string, response: CodingNsAgentPermissionResponse): void {
    const session = this.sessions.get(sessionId)
    const pending = session?.pendingPermissions.get(response.requestId)
    if (pending === undefined || session === undefined) throw new Error('Codex 权限请求不存在')
    session.pendingPermissions.delete(response.requestId)
    if (pending.response === 'file-change') {
      pending.resolve({ decision: response.approved ? 'accept' : 'decline' })
    } else if (pending.response === 'command') {
      pending.resolve({ decision: response.approved ? 'accept' : 'decline' })
    } else if (pending.response === 'permissions') {
      // `item/permissions/requestApproval` 的应答形状是 {permissions, scope}，
      // 不是 {approved}。批准回显请求画像；拒绝给空画像，语义等价于“不授予额外权限”。
      pending.resolve(response.approved
        ? { permissions: grantedPermissionProfile(pending.requested), scope: 'turn' }
        : { permissions: {}, scope: 'turn' })
    } else {
      pending.resolve({
        approved: response.approved,
        ...(response.reason?.trim() ? { reason: response.reason.trim().slice(0, 512) } : {}),
      })
    }
  }

  /** 回传 requestUserInput 的结构化回答。 */
  respondQuestion(sessionId: string, response: CodingNsAgentQuestionResponse): void {
    const session = this.sessions.get(sessionId)
    const resolve = session?.pendingQuestions.get(response.requestId)
    if (resolve === undefined || session === undefined) throw new Error('Codex 问题请求不存在')
    session.pendingQuestions.delete(response.requestId)
    resolve({ answers: questionAnswersRecord(response) })
```

</details>

**依据 4 · 源码核查**：[src/host/cli-adapters/registry.ts:698-721](https://github.com/jingyi0605/Codingns4DSH/blob/693075393e1dfac583a8990dee95a870069643cf/src/host/cli-adapters/registry.ts#L698-L721)

供应商会话身份改变后写入持久层并flush，支持可复核绑定设计。

<details>
<summary>查看原文（24行）</summary>

```text
          const providerIdentityChanged = event.providerSessionId !== current.providerSessionId
          const { rawStoreRef: previousRawStoreRef, ...currentWithoutRawStoreRef } = current
          const nextConfig = {
            ...currentWithoutRawStoreRef,
            providerSessionId: event.providerSessionId,
            ...(event.rawStoreRef
              ? { rawStoreRef: event.rawStoreRef }
              : !providerIdentityChanged && previousRawStoreRef
                ? { rawStoreRef: previousRawStoreRef }
                : {}),
          }
          this.sessions.set(input.sessionId, nextConfig)
          current = nextConfig
          this.sessionStore?.upsert(input.sessionId, {
            ...nextConfig,
            status: 'active',
            providerState: 'available',
            providerCheckedAt: new Date().toISOString(),
          })
          // 首次或重绑的 Provider ID 必须先落盘，避免崩溃后丢失续接身份。
          if (providerIdentityChanged) await this.sessionStore?.flush()
        }
        if (event.type === 'finish') {
          this.segmentedTurns.delete(input.sessionId)
```

</details>

#### 缺口

- 交互契约的终态信号覆盖率和用户理解效果未验证。
  **影响**：不能断言新状态表示减少误操作或总恢复时间。
  **进一步探讨**：对照异构驱动和所列故障样本，核对真实进程与文件结果以及用户恢复行为。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
