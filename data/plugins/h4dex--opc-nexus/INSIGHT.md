# OPC-Nexus

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0040c25](https://github.com/h4dex/opc-nexus/tree/0040c2521b4e974cfaef031c06ecafdce5ad0d17)

<!-- BEGIN META -->
[![GitHub ★ 239](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=239&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/h4dex/opc-nexus)
<!-- END META -->

> **功能**：以 Hermes 项目对话和 Electron 工作台组织数字员工的计划、审批、派工、产物验收与交付。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)显示把Hermes建议与Main权威状态分开，并把createTask、项目文件manifest与独立员工PASS门控连到桌面结果读取。相对单CLI人工对账，增加明确交接与交付控制；不把上游Agent能力或“verified”文件等同业务验收。

> **主要限制**：[Q02](#research-q02) gate仅计划任务强制，直达员工例外；PASS是身份／任务关系加前缀文本，没有绑定产物hash或实际检查记录。文件时间窗和SHA清单只证候选存在，不证归属和正确性；[Q03](#research-q03)完整多员工闭环仍未完成，不能据治理文案接管业务。

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
  - [Q01 · 根工作台相对单个Agent提供什么，谁真正拥有调度？](#detail-section-11)
  - [Q02 · 计划、派工、产物和独立验收怎样接线，门控到底证明什么？](#detail-section-12)
  - [Q03 · 依赖和权限／恢复负担支持何种采用？](#detail-section-13)
  - [Q04 · 公开验收范围与产物门控有什么缺口，可证伪的新方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人工作室／小公司的维护者希望从需求到多员工成果有统一项目、审批和验收责任；替代为单CLI加人工衔接。合格交付是可核文件与经确认验收的结果，非聊天完成文字。

单Codex／Claude／Pi或Hermes配合人工计划和文件核验；第三方CLI的编程、Hermes的规划是继承能力，Main持有任务与交付状态是本根组合增量。旧DSH调度架构不作为当前能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Quest/Main计划治理 | 将Hermes建议批准并派发 | 非Quest复杂规划拒绝；上游规划能力不归根原创 |
| 员工派发和任务状态 | 去重落库、依赖／审批与终态处理 | 不是外部副作用exactly-once |
| 产物与交付门控 | 文件清单与计划任务独立员工PASS | 不等语义正确；未绑定当前hash；直达任务例外 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows10/11或Ubuntu22.04+桌面 | 作者平台范围 | Electron/Main | 其他平台未推断支持 |
| 固定Hermes0.19.0 fork | Quest规划必需 | 对话与建议 | 非Quest旧入口不代替规划 |
| Provider、密钥库与真实工作区 | 必需 | 模型、凭据和文件 | safeStorage不可用拒新密钥 |
| 合适CLI员工及独立验收员工 | 多员工闭环必需 | 执行与验收 | 验收需不同员工及network/browser |
| Node20+/npm10+/Python3.11/uv | 源码准备需 | 运行时构建 | 本轮未安装或运行 |
| 手机／渠道 | 可选 | 远程接管与发送 | 额外权限服务须独立审查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者备份旧数据、固定运行时与测试项目 | 2.x不沿用旧DSH调度状态 |
| 配置 | 配Provider、工作区与独立员工 | 核真实健康与权限，不仅在线图标 |
| 计划 | Hermes澄清，老板批准Main投影 | APPROVED后才dispatch |
| 验收 | 员工交文件，另一员工核实际结果 | manifest不等质量；PASS需人工可追证 |
| 退出 | 停任务并核外部副作用、备份文件和状态、撤销凭据 | 回单CLI与人工验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 桌面资源、运行时和Provider | 迁移备份、员工／权限／工作区配置 | 金额工时未知 |
| 持续 | 多员工模型、验收模型、状态／日志 | 核产物与维护兼容 | 没有已证总成本收益 |
| 失败恢复 | 重试／返工额外推理 | 查终态、外部动作及恢复 | 迟到回调守卫不证明远端停止 |
| 退出 | 文件与状态归档空间 | 撤销凭据、恢复单CLI流程 | 关窗口不等全面取消 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 责任交接 | 规划建议与Main任务状态分离 | 完整复杂交付效率 |
| 防文字假完成 | 项目文件扫描与失败转态 | 文件语义正确、唯一归属 |
| 独立验收 | 计划任务不同员工前缀PASS门控 | 真执行证据与当前产物版本绑定 |
| 生产验收 | 作者列smoke和构建，完整闭环仍门禁 | 正式业务可接管与恢复成本 |

> **思考**：[Q02](#research-q02) gate仅计划任务强制，直达员工例外；PASS是身份／任务关系加前缀文本，没有绑定产物hash或实际检查记录。文件时间窗和SHA清单只证候选存在，不证归属和正确性；[Q03](#research-q03)完整多员工闭环仍未完成，不能据治理文案接管业务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)显示把Hermes建议与Main权威状态分开，并把createTask、项目文件manifest与独立员工PASS门控连到桌面结果读取。相对单CLI人工对账，增加明确交接与交付控制；不把上游Agent能力或“verified”文件等同业务验收。

[Q02](#research-q02) 状态owner、source_key落库、事务内工作区重核和终态守卫是可追溯工程机制；文本PASS、文件时间窗与不同员工身份只是有限代理。未核所有外部副作用和现金预算，不宣称多租户安全或收费封顶。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) gate仅计划任务强制，直达员工例外；PASS是身份／任务关系加前缀文本，没有绑定产物hash或实际检查记录。文件时间窗和SHA清单只证候选存在，不证归属和正确性；[Q03](#research-q03)完整多员工闭环仍未完成，不能据治理文案接管业务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 对正式复杂交付先observe；待小项目走通真实多员工、独立验收、返工／取消／崩溃恢复和退出，再判断迁入。探索者只在可丢弃工作区核架构，不能以构建通过代替业务验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源代码支持Main派工、幂等落库、产物存在性检查和计划任务独立验收门控；作者承认完整复杂交付仍门禁，本轮无运行，版本绑定假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、src/main/ipc.ts、src/main/services/hermesDeliveryGate.ts、src/main/services/hermesEmployeeDispatcher.ts、src/main/services/hermesGovernanceBridge.ts、src/main/services/hermesServiceManager.ts、src/main/services/kernel/hermesIngressKernel.ts、src/main/services/kernel/localCliDispatchAdapter.ts、src/main/services/orchestrator.ts、src/main/services/projectArtifactManifest.ts、src/main/services/provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根Electron工作台source定向研究，覆盖owner入口、计划状态、员工派发、Orchestrator、manifest、delivery gate、IPC结果读取及Provider存储。未全量审projector、所有执行器、渠道、Android、Hermes fork与移动安全；未运行目标。真实client而非DSH插件。
- 下一步：[Q04](#research-q04)先完成固定环境复杂闭环与取消／崩溃恢复，再试陈旧PASS／并发产物版本反例；比较单CLI正确交付和全部投入。本轮无目标运行，公开smoke仅作者声明。

**分析版本**

- **仓库**：[h4dex/opc-nexus](https://github.com/h4dex/opc-nexus)
- **版本号**：2.0.1（[固定提交 0040c25](https://github.com/h4dex/opc-nexus/tree/0040c2521b4e974cfaef031c06ecafdce5ad0d17)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)从manifest hash和文本PASS之间的缺口推导验收绑定产物版本，可能降低陈旧PASS放行。用验收后改文件、重跑与并发修改试验；陈旧放行未降或误阻断代价超收益则否定，尚未实现不计当前贡献。

[Q04](#research-q04)先完成固定环境复杂闭环与取消／崩溃恢复，再试陈旧PASS／并发产物版本反例；比较单CLI正确交付和全部投入。本轮无目标运行，公开smoke仅作者声明。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 45 | 9240 | — | — | 129208 |
| .ts | source | 138 | 56125 | 49087 | 3355 | — |
| .cjs | source | 30 | 8141 | 7520 | 149 | — |
| .tsx | source | 46 | 14771 | 13404 | 375 | — |
| .ts | test | 132 | 28921 | 25333 | 839 | — |
| .cjs | example | 1 | 76 | 68 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/h4dex/opc-nexus/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/h4dex/opc-nexus/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/h4dex/opc-nexus/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Hermes/Main职责、派工与产物验收真实接线，判断完整复杂交付采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工作台相对单个Agent提供什么，谁真正拥有调度？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

OPC-Nexus根是面向个人工作室／小公司的Electron数字员工工作台，真实条目类型client，不是旧DSH插件。目标是把需求澄清、计划批准、多个执行器的任务和文件交付放在同一项目中，使非终端用户能跟进成果和责任。基线是直接用Codex／Claude／Pi或Hermes，再人工记录计划、审批、成果路径与验收。合格成果应是项目内可核实文件／运行结果，且老板知道哪些经过独立验收，而不是员工返回“完成”文字。

当前2.0.1明确Hermes拥有理解／规划建议，Main持有任务与权限事实，执行器负责干活；DSH不再调度，只可能保留执行CLI。HermesIngressKernel对非Quest复杂规划直接报HERMES_PROJECT_REQUIRED，LocalCliDispatchAdapter仅允许显式direct-worker和指定员工，不能把旧入口重命名成调度器。这个owner划分和交付门控是增量；Hermes语言规划、第三方CLI编程与OS能力属于上游。是否比人工衔接更省总投入，仍未由当前完整闭环证实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/README.md#L1-L19)

作者目标、2.0.1运行时和不兼容迁移声明。

<details>
<summary>查看原文（19行）</summary>

```text
# OPC-Nexus · 数字员工 AI Box

> 面向个人工作室和小公司的本地优先 AI 工作台：老板下令，Hermes 理解和调度，数字员工执行，系统交付真实成果。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![CI](https://github.com/h4dex/opc-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/h4dex/opc-nexus/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/h4dex/opc-nexus?display_name=tag)](https://github.com/h4dex/opc-nexus/releases)

## 当前版本

| 组件 | 版本 | 说明 |
| --- | --- | --- |
| OPC-Nexus 桌面端 | `2.0.1` | Windows 10/11、Ubuntu 22.04+ |
| Hermes Runtime | `0.19.0` | Quest 唯一调度引擎，固定 fork 和上游 commit |
| Android Bridge | `0.4.3` | 可选手机执行员工，不参与 Quest 调度 |

2.0.1 是 Hermes 架构后的运行时增强版本，与 1.x 的 Nexus 调度架构不兼容。升级时请先备份用户数据；应用会迁移旧数据目录，不会把旧 DSH 调度状态重新启用为第二套控制面。

发布包可携带固定版本的 Codex CLI 与 Pi Agent 运行时，放在应用资源目录并由主进程优先调用。源码仓库不提交 `node_modules` 或原生二进制；发布前运行 `npm run agents:prepare`，安装后运行 `npm run agents:verify`。
```

</details>

**依据 2 · 作者声明**：[README.md:21-36](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/README.md#L21-L36)

Hermes/Main/执行器职责和DSH退位。

<details>
<summary>查看原文（16行）</summary>

````text
## 工作方式

```text
老板
  -> Quest / Hermes 对话
  -> 澄清（复杂需求才需要）
  -> 计划草案与员工分工
  -> OPC-Nexus Main 校验、审批、派工
  -> Codex / Claude / Pi / Hermes Worker / 手机员工
  -> 项目目录、预览、运行命令、截图和渠道回执
```

- **Hermes** 负责对话理解、澄清、记忆、计划内容和委派建议。
- **OPC-Nexus Main** 负责项目范围、员工白名单、权限、预算、任务/Run 状态、审批、取消、恢复、交付和审计。
- **数字员工** 是独立实体。项目可以使用动态员工池，也可以选择固定员工范围，不强制一对一绑定。
- **DSH** 不再作为调度器或第二套 Web 工作台；如保留 CLI，只能作为受 Main 治理的执行层。
````

</details>

**依据 3 · 源码核查**：[src/main/services/kernel/hermesIngressKernel.ts:3-17](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/kernel/hermesIngressKernel.ts#L3-L17)

非Quest规划入口显式不就绪并报错。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Compatibility guard for non-Quest ingress. Real Hermes planning runs inside
 * the project-scoped Hermes service. This kernel exists only so an old caller
 * cannot silently promote an execution adapter into the scheduler slot.
 */
export class HermesIngressKernel implements ControlKernel {
  readonly id = 'hermes' as const;

  isReady(): boolean {
    return false;
  }

  async plan(_request: KernelRequest): Promise<DispatchPlanDraft> {
    throw new Error('HERMES_PROJECT_REQUIRED: complex planning must enter the Quest Hermes project conversation');
  }
```

</details>

**依据 4 · 源码核查**：[src/main/services/kernel/localCliDispatchAdapter.ts:11-40](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/kernel/localCliDispatchAdapter.ts#L11-L40)

direct-worker必须显式指定，风险正则用于初始审批建议。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * Deterministic adapter for a user-selected worker CLI. It does not choose a
 * worker, clarify an objective, split work, or act as a scheduler. Hermes owns
 * those responsibilities; every CLI is treated as an execution adapter.
 */
export class LocalCliDispatchAdapter implements ControlKernel {
  readonly id = 'local-cli' as const;

  isReady(): boolean {
    return true;
  }

  async plan(request: KernelRequest): Promise<DispatchPlanDraft> {
    if (request.routingMode !== 'direct-worker') {
      throw new Error('Local CLI dispatch requires an explicit direct-worker route');
    }
    if (!request.preferredAgentId) {
      throw new Error('Local CLI dispatch requires an explicitly selected employee');
    }
    const worker = request.workers.find((candidate) => candidate.agentId === request.preferredAgentId);
    if (!worker) throw new Error('The selected Local CLI employee is not eligible');
    return {
      workerAgentId: worker.agentId,
      title: titleFor(request.message),
      objective: request.message.trim(),
      rationale: '用户明确选择该员工；治理插件仅执行直达适配，不参与规划或选人。',
      priority: 0,
      expectedOutputs: ['所选员工返回的可核验结果'],
      requiresHumanApproval: HIGH_RISK_RE.test(request.message) || !LOW_RISK_RE.test(request.message),
      memoryProposals: [],
```

</details>

#### 缺口

- 小工作室真实多员工交付需求与单CLI人工核验总成本未对照。
  **影响**：不能据产品范围推断已有业务采用或节时。
  **进一步探讨**：用一个明确小项目对照单CLI与工作台，记录合格交付、核验责任和全部投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 计划、派工、产物和独立验收怎样接线，门控到底证明什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

GovernanceBridge的计划必须从PROJECTED批准成APPROVED，再dispatch成DISPATCHED；无projector直接失败。EmployeeDispatcher核项目会话绑定、同项目relatedTask、READY员工与固定员工池；validation要求相关执行任务完成、验收员工不在实现员工集合，且其capabilities含network/browser。它把检查原文、真实文件、URL／DOM和证据的要求写进验收任务提示，不能据提示本身认定已经执行这些检查。

派工通过Orchestrator.createTask，不直接启动CLI。source_key按意图／任务内容去重，validation身份固定绑定项目、员工和相关task集合；普通任务使用时间窗。数据库source/source_key冲突避免并发重复落同一身份，但不是外部动作exactly-once。createTask重新核项目／工作区并按依赖、审批、员工并发与dispatchGuard入RUNNING、QUEUED或WAITING_APPROVAL；依赖失败取消。收尾仅能改仍活跃任务，避免取消后迟到回调改成完成；这不是证明执行器子树或远端副作用已停止。

artifacts_required的项目任务收尾调ProjectArtifactManifest；目录必须可访问且非symlink，扫描拒越界／符号链接、排除部分目录，用修改／创建时间筛非空文件并生成SHA256清单，无文件或服务异常转FAILED。verified证明候选文件可读与路径／时间条件，不证明文件满足任务，也不是全局baseline diff：扫描本身按时间窗，不核“由这个task唯一生成”。

HermesDeliveryGate仅对hermes_plan_jobs任务强制独立验收：执行COMPLETED、同项目／对话的validation内容关联task、员工不在实现集合、终态结果以PASS开头才放行；查不到表／任务或FAIL／BLOCKED会阻断。简单@employee任务没有plan row，可据自身COMPLETED直接交付。IPC getTaskResult实际调用gate拦结果，体现真实接线；gate没有核验所列测试是否真实执行，也没有把PASS绑定当前artifact hash／版本，不能称不可伪造的质量证明或所有任务必经独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/main/services/hermesGovernanceBridge.ts:751-772](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesGovernanceBridge.ts#L751-L772)

计划批准与派发状态前置。

<details>
<summary>查看原文（22行）</summary>

```text
  async approvePlan(draftId: string, projectId: string, principalId: string): Promise<HermesPlanProjection> {
    if (!this.planProjector) throw new Error('OPC-Nexus plan governance is unavailable');
    const projection = this.requirePlanProjection(draftId, projectId);
    if (projection.status === 'APPROVED') return projection;
    if (projection.status !== 'PROJECTED') throw new Error(`Hermes plan is ${projection.status}`);
    await this.planProjector.approve(projection, principalId);
    this.db.raw.prepare("UPDATE hermes_plan_projections SET status = 'APPROVED', last_error = NULL, updated_at = ? WHERE draft_id = ? AND status = 'PROJECTED'")
      .run(this.now(), draftId);
    this.audit('hermes.plan.approve', projectId, draftId, `principal=${principalId}`);
    return this.requirePlanProjection(draftId, projectId);
  }

  async dispatchPlan(draftId: string, projectId: string, principalId: string): Promise<HermesPlanProjection> {
    if (!this.planProjector) throw new Error('OPC-Nexus plan governance is unavailable');
    const projection = this.requirePlanProjection(draftId, projectId);
    if (projection.status === 'DISPATCHED') return projection;
    if (projection.status !== 'APPROVED') throw new Error('Hermes plan must be boss-approved before dispatch');
    await this.planProjector.dispatch(projection, principalId);
    this.db.raw.prepare("UPDATE hermes_plan_projections SET status = 'DISPATCHED', last_error = NULL, updated_at = ? WHERE draft_id = ? AND status = 'APPROVED'")
      .run(this.now(), draftId);
    this.audit('hermes.plan.dispatch', projectId, draftId, `principal=${principalId}`);
    return this.requirePlanProjection(draftId, projectId);
```

</details>

**依据 2 · 源码核查**：[src/main/services/hermesEmployeeDispatcher.ts:124-171](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesEmployeeDispatcher.ts#L124-L171)

输入、项目绑定、相关任务与独立员工检查。

<details>
<summary>查看原文（48行）</summary>

```text
  dispatch(projectId: string, value: unknown): HermesEmployeeTaskReceipt {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Hermes employee task must be an object');
    }
    const input = value as Record<string, unknown>;
    const requestId = boundedText(input.requestId, 'requestId', 128);
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(requestId)) {
      throw new Error('Hermes employee task requestId is invalid');
    }
    const hermesSessionId = boundedText(input.hermesSessionId, 'session identity', 256);
    const workerAgentId = boundedText(input.workerAgentId, 'workerAgentId', 128);
    const title = boundedText(input.title, 'title', 500);
    const description = boundedText(input.description, 'description', 32_000);
    const intent = input.intent;
    if (typeof intent !== 'string' || !TASK_INTENTS.has(intent as HermesEmployeeTaskIntent)) {
      throw new Error('Hermes employee task intent is invalid');
    }
    if (!Array.isArray(input.relatedTaskIds) || input.relatedTaskIds.length > 32) {
      throw new Error('Hermes employee task relatedTaskIds are invalid');
    }
    const requestedRelatedTaskIds = input.relatedTaskIds.map((value) => boundedText(value, 'relatedTaskId', 128));
    if (!Array.isArray(input.expectedArtifacts) || input.expectedArtifacts.length > 128) {
      throw new Error('Hermes employee task expectedArtifacts are invalid');
    }
    const expectedArtifacts = input.expectedArtifacts.map(relativeArtifact);
    if (intent === 'status_inquiry' && expectedArtifacts.length > 0) {
      throw new Error('Hermes status inquiry cannot require a new artifact');
    }
    const relatedTaskIds = intent === 'validation'
      ? [...new Set(requestedRelatedTaskIds)].sort()
      : requestedRelatedTaskIds;
    if (intent === 'validation' && relatedTaskIds.length === 0) {
      throw new Error('Hermes validation must identify at least one related execution task');
    }
    const binding = this.sessionBinding(projectId, hermesSessionId);
    const relatedWorkerIds = new Set<string>();
    for (const relatedTaskId of relatedTaskIds) {
      const related = this.db.raw.prepare(`
        SELECT id, agent_id, status FROM tasks WHERE id = ? AND project_id = ? AND deleted_at IS NULL
      `).get(relatedTaskId, projectId) as { id?: string; agent_id?: string; status?: TaskStatus } | undefined;
      if (related?.id !== relatedTaskId) throw new Error('Hermes related task is outside this project or unavailable');
      if (intent === 'validation' && related.status !== 'COMPLETED') {
        throw new Error('Hermes validation must wait until every related execution task is completed');
      }
      if (related.agent_id) relatedWorkerIds.add(related.agent_id);
    }
    if (intent === 'validation' && relatedWorkerIds.has(workerAgentId)) {
      throw new Error('Hermes validation must be assigned to an independent employee, not an implementation worker');
```

</details>

**依据 3 · 源码核查**：[src/main/services/hermesEmployeeDispatcher.ts:183-215](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesEmployeeDispatcher.ts#L183-L215)

员工能力／范围和验收要求为任务提示。

<details>
<summary>查看原文（33行）</summary>

```text
    if (worker?.id !== workerAgentId || worker.archived === 1 || worker.lifecycle !== 'READY') {
      throw new Error('Hermes employee task worker is unavailable');
    }
    if (intent === 'validation') {
      let capabilities: Record<string, unknown> = {};
      try { capabilities = JSON.parse(String(worker.capabilities_json ?? '{}')) as Record<string, unknown>; } catch { capabilities = {}; }
      if (capabilities.network !== true || capabilities.browser !== true) {
        throw new Error('Hermes validation worker lacks required network/browser tools');
      }
    }
    const selection = this.workbench.getWorkerSelection(projectId);
    if (selection.mode === 'restricted' && !selection.workerAgentIds.includes(workerAgentId)) {
      throw new Error('Hermes employee task worker is outside the project fixed employee pool');
    }
    const workspace = this.workbench.getExplicitWorkspacePath(projectId);
    if (!workspace) throw new Error('Project working directory is not configured');
    const content = [
      `Task intent: ${intent}`,
      description,
      relatedTaskIds.length ? `Related project tasks:\n${relatedTaskIds.join('\n')}` : '',
      intent === 'validation'
        ? [
            'Independently inspect the owner clarification, acceptance criteria, related task results, real files, commands, preview, screenshots, and tests that are available.',
            'When a real http://127.0.0.1:<port>/ preview URL is supplied, first call http_request with GET on that exact URL, then call browser_navigate on the same URL and browser_get_content to inspect the live DOM. Do not guess ports, use :0 or file://, and do not replace these checks with a file-only review.',
            'If the supplied URL is missing, unreachable, or any required inspection tool is unavailable, return BLOCKED instead of claiming PASS.',
            'The first non-whitespace word of your final result must be exactly PASS, FAIL, or BLOCKED.',
            'After that verdict, list the evidence checked, failures, and remaining risks. Do not claim checks you did not perform.'
          ].join('\n')
        : '',
      intent === 'status_inquiry'
        ? 'Return a factual status report in the task result. Do not create a file and do not claim unverified completion.'
        : '',
      expectedArtifacts.length ? `Expected artifacts:\n${expectedArtifacts.join('\n')}` : ''
```

</details>

**依据 4 · 源码核查**：[src/main/services/hermesEmployeeDispatcher.ts:256-309](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesEmployeeDispatcher.ts#L256-L309)

幂等身份、既有回执与createTask接线。

<details>
<summary>查看原文（54行）</summary>

```text
    const fingerprint = createHash('sha256').update(JSON.stringify(intent === 'validation'
      ? { projectId, intent, workerAgentId, relatedTaskIds }
      : { projectId, hermesSessionId, workerAgentId, title, intent, relatedTaskIds, content }
    )).digest('hex').slice(0, 40);
    const windowId = Math.floor(Date.now() / IDEMPOTENCY_WINDOW_MS);
    // Validation identity is permanent and wording-independent. Orchestrator's
    // unique (source, source_key) index makes concurrent tool calls atomic.
    const sourceKey = intent === 'validation'
      ? `hermes-validation:${projectId}:${workerAgentId}:${fingerprint}`
      : `hermes:${projectId}:${hermesSessionId}:${windowId}:${fingerprint}`;
    const previousSourceKey = intent === 'validation'
      ? sourceKey
      : `hermes:${projectId}:${hermesSessionId}:${windowId - 1}:${fingerprint}`;
    const existing = this.db.raw.prepare(`
      SELECT id, agent_id, project_id, title, status
      FROM tasks
      WHERE source = 'team' AND source_key IN (?, ?) AND deleted_at IS NULL
      ORDER BY created_at DESC LIMIT 1
    `).get(sourceKey, previousSourceKey) as {
      id?: string;
      agent_id?: string;
      project_id?: string | null;
      title?: string;
      status?: Task['status'];
    } | undefined;
    if (existing?.id && existing.agent_id && existing.project_id && existing.title && existing.status) {
      this.db.audit({
        id: randomUUID(),
        actor: binding.principalId,
        action: 'hermes.employee.dispatch.deduplicated',
        target: existing.id,
        result: `${workerAgentId}:${existing.status}:${requestId}`,
        source: 'hermes'
      });
      return {
        intent: intent as HermesEmployeeTaskIntent,
        task: {
          id: existing.id,
          agentId: existing.agent_id,
          projectId: existing.project_id,
          title: existing.title,
          status: existing.status
        },
        deduplicated: true
      };
    }
    const task = this.orchestrator.createTask(workerAgentId, title, 'team', {
      projectId,
      conversationId: binding.conversationId,
      sourceKey,
      content,
      requiresArtifacts: expectedArtifacts.length > 0,
      workspaceOverride: workspace
    });
```

</details>

**依据 5 · 源码核查**：[src/main/services/orchestrator.ts:1390-1468](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/orchestrator.ts#L1390-L1468)

调度状态和事务内项目工作区重核。

<details>
<summary>查看原文（79行）</summary>

```text
  createTask(agentId: string, title: string, source: Task['source'] = 'desktop', opts: CreateTaskOptions = {}): CreateTaskResult {
    const now = Date.now();
    const id = randomUUID();
    const sourceKey = opts.sourceKey?.trim() || null;
    const content = (opts.content ?? title).trim();
    if (!content) throw new Error('任务内容不能为空');
    if (content.length > 1_000_000) throw new Error('任务内容超过 1000000 字符');
    const priority = opts.priority ?? 0;
    if (!Number.isInteger(priority) || priority < -10 || priority > 10) throw new Error('任务优先级必须为 -10 到 10 的整数');
    const approvalRequest = opts.initialApprovalRequest?.trim() || null;
    if (source === 'delegated') {
      if (!opts.parentId) throw new Error('委派任务必须关联父任务');
      this.assertDelegationTarget(opts.parentId, agentId, Boolean(opts.allowAncestorAgentDelegation));
    }
    if (sourceKey) {
      const existing = this.db.raw.prepare('SELECT * FROM tasks WHERE source = ? AND source_key = ?').get(source, sourceKey) as Row | undefined;
      if (existing) {
        if (opts.onPersisted) this.db.transaction(() => opts.onPersisted?.(String(existing.id)));
        return Object.assign(this.mapTask(existing), { deduplicated: true as const });
      }
    }
    const agent = this.getAgent(agentId);
    if (!agent) throw new Error('员工不存在');
    const dependencyTaskIds = this.normalizeDependencyTaskIds(agentId, id, opts.dependencyTaskIds);
    const dependencyGate = this.dependencyGateForIds(dependencyTaskIds);
    assertAndroidOperatorEngine(agent.kind, agent.engineId);
    const mobileState = agent.kind === 'android_operator'
      ? this.mobileDispatchPolicy?.canDispatch(agentId) ?? { bound: false, ready: false, reason: '手机控制服务尚未启动' }
      : null;
    if (mobileState && !mobileState.bound) throw new Error('Android 手机操作员尚未绑定设备');
    // 引擎路由规则（settings.engine_routing）：按任务来源指定优先引擎。
    // 显式 engineOverride（编码委派）优先级最高；路由规则仅在引擎健康时生效，
    // 避免把任务路由到未安装的引擎上。
    let engineOverride = agent.kind === 'android_operator' ? null : opts.engineOverride ?? null;
    if (agent.kind === 'general' && !engineOverride) {
      const routed = this.db.getSetting<Record<string, string>>('engine_routing', {})[source];
      if (routed && routed !== agent.engineId) {
        const row = this.db.raw.prepare('SELECT status FROM engines WHERE id = ?').get(routed) as { status: string } | undefined;
        if (row?.status === 'HEALTHY') engineOverride = routed;
      }
    }
    const projectId = this.resolveTaskProject(agentId, opts.parentId, opts.projectId);
    const workspaceOverride = this.resolveProjectWorkspace(projectId, opts.workspaceOverride);
    const requiresArtifacts = opts.requiresArtifacts ?? Boolean(projectId);
    const active = this.agentOccupancy(agentId);
    const guardReason = this.dispatchGuard();
    const canRun = dependencyGate.ready && !approvalRequest && agent.lifecycle === 'READY' && active < Math.max(1, agent.concurrencyLimit) && guardReason === null && (!mobileState || mobileState.ready);
    const queuedStage = dependencyGate.pending.length > 0
      ? `等待前置任务（${dependencyGate.pending.length}）`
      : guardReason ?? mobileState?.reason ?? '排队中';
    const dependencyError = dependencyGate.failed.length > 0
      ? `前置任务未成功完成，已阻止执行：${dependencyGate.failed.join(', ')}`
      : null;
    const initialStatus = dependencyError ? 'CANCELLED' : approvalRequest ? 'WAITING_APPROVAL' : canRun ? 'RUNNING' : 'QUEUED';
    const initialStage = dependencyError ? '依赖失败' : approvalRequest ? '等待审批' : canRun ? STAGES[0] : queuedStage;
    if (source === 'delegated' && !canRun) this.assertNoDelegationWaitCycle(opts.parentId!, agentId);
    let inserted = false;
    this.db.transaction(() => {
      const transactionProjectId = this.resolveTaskProject(agentId, opts.parentId, opts.projectId);
      if (transactionProjectId !== projectId) throw new Error('父任务或项目关联已发生变化');
      const transactionWorkspace = this.resolveProjectWorkspace(transactionProjectId, opts.workspaceOverride);
      if (transactionWorkspace !== workspaceOverride) throw new Error('项目工作目录已发生变化，请重新派发任务');
      // Lookup and commit are separate calls. Recheck under the write
      // transaction so an archived/moved target cannot cross the tenant gate.
      if (source === 'delegated') {
        this.assertDelegationTarget(opts.parentId!, agentId, Boolean(opts.allowAncestorAgentDelegation));
        if (!canRun) this.assertNoDelegationWaitCycle(opts.parentId!, agentId);
      }
      inserted = this.db.raw.prepare(
        `INSERT INTO tasks(
          id, agent_id, project_id, conversation_id, input_message_id, title, content,
          source, source_key, parent_id, status, priority, progress, stage, error,
          session_id, workspace_override, engine_override, artifacts_required, created_at, started_at, ended_at
         ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(source, source_key) WHERE source_key IS NOT NULL DO NOTHING`
      ).run(
        id, agentId, projectId, opts.conversationId ?? null, opts.inputMessageId ?? null,
        title, content, source, sourceKey, opts.parentId ?? null, initialStatus, priority,
         initialStage, dependencyError, opts.sessionId ?? null, workspaceOverride, engineOverride, requiresArtifacts ? 1 : 0,
```

</details>

**依据 6 · 源码核查**：[src/main/services/orchestrator.ts:1764-1842](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/orchestrator.ts#L1764-L1842)

产物验证失败、活跃终态守卫与manifest持久化。

<details>
<summary>查看原文（79行）</summary>

```text
    const finish = async (status: 'COMPLETED' | 'FAILED' | 'INTERRUPTED', info: { result?: string; error?: string }) => {
      if (this.finalizingTasks.has(taskId)) return;
      this.finalizingTasks.add(taskId);
      const completionSignaledAt = Date.now();
      this.closeOutputState(taskId);
      const boundedResult = typeof info.result === 'string' ? info.result.slice(0, MAX_TASK_RESULT_CHARS) : undefined;
      let finalStatus = status;
      let finalError = info.error;
      let artifactManifest: ProjectArtifactManifest | null = null;

      if (status === 'COMPLETED' && this.projectArtifactCompletionValidator) {
          const task = this.db.raw.prepare(
            'SELECT * FROM tasks WHERE id = ?'
          ).get(taskId) as { project_id: string | null; artifacts_required?: number; started_at: number | null; created_at: number | null } | undefined;
        if (task?.project_id && Number(task.artifacts_required ?? 0) === 1) {
          const executionStartedAt = Number.isSafeInteger(task.started_at)
            ? Number(task.started_at) : completionSignaledAt;
          // Approval and dependency resumes reset started_at for watchdog
          // purposes. A worker can have already written a real artifact while
          // that resume is being finalized, so the task creation time remains
          // the lower bound for admission. The scanner still rejects stale,
          // symlinked, out-of-root, and unchanged files.
          const createdAt = Number.isSafeInteger(task.created_at) ? Number(task.created_at) : executionStartedAt;
          const startedAt = Math.min(createdAt, executionStartedAt);
          this.db.transaction(() => {
            const changed = this.db.raw.prepare(
              "UPDATE tasks SET stage = ? WHERE id = ? AND status = 'RUNNING'"
            ).run('校验项目产物', taskId).changes;
            if (changed > 0) this.recordEvent(taskId, 'stage', { stage: '校验项目产物' }, completionSignaledAt);
          });
          this.emit();
          try {
            const evidence = await this.projectArtifactCompletionValidator.validateTaskCompletion({
              taskId,
              projectId: task.project_id,
              startedAt,
              endedAt: completionSignaledAt
            });
            if (evidence.ok) artifactManifest = evidence.manifest;
            else {
              finalStatus = 'FAILED';
              finalError = evidence.error;
            }
          } catch {
            finalStatus = 'FAILED';
            finalError = '项目产物校验服务异常，任务未标记为完成';
          }
        }
      }

      const now = Date.now();
      // 真实执行鉴权失败：如实把引擎标为 AUTH_REQUIRED，不掩盖
      const authFailed = binding.resolvedEngineId !== null
        && binding.executorKind !== 'unavailable'
        && isExecutorAuthenticationFailure(finalError);
      // 终态守卫（数据层最后防线）：只有非终态任务才能落终态。
      // 迟到回调（看门狗中断后进程才退出、用户取消后执行器才收尾、执行器双重回调）
      // 一律丢弃，绝不把已 INTERRUPTED/CANCELLED 的任务改写成 COMPLETED。
      const LIVE = "('QUEUED','RUNNING','WAITING_APPROVAL','PAUSED')";
      let applied = false;
      this.db.transaction(() => {
        if (finalStatus === 'COMPLETED') {
          applied = this.db.raw.prepare(`UPDATE tasks SET status = 'COMPLETED', progress = 100, stage = '完成', result = ?, ended_at = ? WHERE id = ? AND status IN ${LIVE}`)
            .run(boundedResult ?? null, now, taskId).changes > 0;
          if (!applied) return;
          if (artifactManifest) this.recordEvent(taskId, 'artifact_manifest', { manifest: artifactManifest }, now);
          const result = boundedResult ?? '';
          this.recordEvent(taskId, 'result', { available: result.length > 0, chars: result.length }, now);
          this.recordEvent(taskId, 'completed', { progress: 100 }, now);
        } else {
          applied = this.db.raw.prepare(`UPDATE tasks SET status = ?, error = ?, ended_at = ? WHERE id = ? AND status IN ${LIVE}`)
            .run(finalStatus, finalError ?? null, now, taskId).changes > 0;
          if (!applied) return;
          if (status === 'COMPLETED' && finalStatus === 'FAILED') {
            this.recordEvent(taskId, 'artifact_validation_failed', { error: finalError ?? '' }, now);
          }
          this.recordEvent(taskId, finalStatus === 'FAILED' ? 'failed' : 'interrupted', { error: finalError ?? '' }, now);
        }
        this.db.raw.prepare('UPDATE agent_runs SET ended_at = ?, status = ? WHERE task_id = ? AND ended_at IS NULL').run(now, finalStatus, taskId);
```

</details>

**依据 7 · 源码核查**：[src/main/services/projectArtifactManifest.ts:153-223](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/projectArtifactManifest.ts#L153-L223)

根路径、真实文件、SHA256与verified清单。

<details>
<summary>查看原文（71行）</summary>

```text
  async validateTaskCompletion(input: ProjectArtifactCompletionInput): Promise<ProjectArtifactCompletionResult> {
    if (!safeIdentity(input.taskId) || !safeIdentity(input.projectId)
      || !Number.isSafeInteger(input.startedAt) || input.startedAt < 0
      || !Number.isSafeInteger(input.endedAt) || input.endedAt < input.startedAt) {
      return this.reject(input, '任务产物校验参数无效');
    }
    const configuredRoot = this.options.getProjectRoot(input.projectId)?.trim() ?? '';
    if (!configuredRoot) return this.reject(input, '项目尚未配置工作目录，不能确认任务完成');

    let root: string;
    let realRoot: string;
    try {
      root = resolve(configuredRoot);
      const rootStat = await lstat(root);
      if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error('invalid root');
      realRoot = await realpath(root);
    } catch {
      return this.reject(input, '项目工作目录不存在或不可访问，不能确认任务完成');
    }

    const scanned = await this.scan(root, realRoot, input.startedAt, input.endedAt);
    if ('error' in scanned) return this.reject(input, scanned.error);
    if (scanned.files.length === 0) {
      return this.reject(input, '未检测到任务期间写入项目目录的真实产物；任务已停止在失败状态，请让执行员工把成果保存到项目目录后重试');
    }

    const entries: ProjectArtifactManifestEntry[] = [];
    let totalBytes = 0;
    for (const file of scanned.files.slice(0, MAX_MANIFEST_ENTRIES)) {
      try {
        const current = await lstat(file.absolutePath);
        if (!current.isFile() || current.isSymbolicLink() || current.size !== file.stat.size) {
          return this.reject(input, `项目产物在校验期间发生变化：${file.relativePath}`);
        }
        const realFile = await realpath(file.absolutePath);
        if (!within(realRoot, realFile)) return this.reject(input, `项目产物路径越界：${file.relativePath}`);
        const previewKind = projectArtifactPreviewKind(file.relativePath);
        entries.push({
          relativePath: file.relativePath,
          mediaType: projectArtifactMediaType(file.relativePath).replace(/;\s*charset=utf-8$/i, ''),
          size: current.size,
          sha256: await sha256(file.absolutePath),
          modifiedAt: current.mtimeMs,
          sourceTaskId: input.taskId,
          version: 1,
          validationState: 'verified',
          previewKind,
          previewable: previewKind !== 'unsupported',
          run: await deriveRunConfig(file.absolutePath, file.relativePath, current.size)
        });
        totalBytes += current.size;
      } catch (error) {
        const detail = error instanceof Error && /路径越界|发生变化/.test(error.message)
          ? error.message
          : `无法读取项目产物：${file.relativePath}`;
        return this.reject(input, detail);
      }
    }

    const manifest: ProjectArtifactManifest = {
      schemaVersion: 1,
      projectId: input.projectId,
      sourceTaskId: input.taskId,
      generatedAt: this.now(),
      totalBytes,
      entries,
      truncated: scanned.files.length > MAX_MANIFEST_ENTRIES,
      validation: { status: 'verified', reason: null }
    };
    this.audit(input, 'verified', `${entries.length} files`);
    return { ok: true, manifest };
```

</details>

**依据 8 · 源码核查**：[src/main/services/projectArtifactManifest.ts:243-275](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/projectArtifactManifest.ts#L243-L275)

扫描按时间筛文件，非任务唯一生成证明。

<details>
<summary>查看原文（33行）</summary>

```text
      children.sort((left, right) => left.name.localeCompare(right.name, 'en'));
      for (const child of children) {
        scannedEntries += 1;
        if (scannedEntries > MAX_SCANNED_ENTRIES) {
          return { error: '项目目录文件过多，无法完整验证本次产物' };
        }
        if (child.isSymbolicLink()) continue;
        if (child.isDirectory() && EXCLUDED_DIRECTORIES.has(child.name)) continue;
        const relativePath = directory.relativePath ? `${directory.relativePath}/${child.name}` : child.name;
        const absolutePath = resolve(directory.absolutePath, child.name);
        if (!within(root, absolutePath)) continue;
        let stat: Stats;
        let realEntry: string;
        try {
          stat = await lstat(absolutePath);
          if (stat.isSymbolicLink()) continue;
          realEntry = await realpath(absolutePath);
        } catch {
          continue;
        }
        if (!within(realRoot, realEntry)) continue;
        if (stat.isDirectory()) {
          queue.push({ absolutePath, relativePath });
          continue;
        }
        if (!stat.isFile() || stat.size < 1 || child.name.endsWith('~') || /\.(?:tmp|swp)$/i.test(child.name)) continue;
        const changedAt = Math.max(stat.mtimeMs, stat.ctimeMs, stat.birthtimeMs);
        if (changedAt < startedAt - CLOCK_TOLERANCE_MS || changedAt > endedAt + CLOCK_TOLERANCE_MS) continue;
        files.push({ absolutePath, relativePath: relativePath.replaceAll('\\', '/'), stat });
      }
    }
    files.sort((left, right) => left.relativePath.localeCompare(right.relativePath, 'en'));
    return { files };
```

</details>

**依据 9 · 源码核查**：[src/main/services/hermesDeliveryGate.ts:66-106](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesDeliveryGate.ts#L66-L106)

缺失失败阻断与直达任务例外。

<details>
<summary>查看原文（41行）</summary>

```text
  check(taskId: string): HermesDeliveryGateResult {
    const task = this.db.raw.prepare(`
      SELECT id, project_id, conversation_id, agent_id, status, result, error, content, created_at
      FROM tasks WHERE id = ? AND deleted_at IS NULL
    `).get(taskId) as TaskRow | undefined;
    if (!task?.id) {
      return {
        taskId,
        projectId: null,
        required: true,
        allowed: false,
        reason: '任务不存在，无法确认交付状态',
        validationTaskId: null,
        validationVerdict: 'BLOCKED'
      };
    }

    let planJob: { draft_id?: string } | undefined;
    try {
      planJob = this.db.raw.prepare(
        'SELECT draft_id FROM hermes_plan_jobs WHERE task_id = ? LIMIT 1'
      ).get(task.id) as { draft_id?: string } | undefined;
    } catch {
      // The bridge creates this table during startup. If it is unavailable for
      // a project task, fail closed rather than accidentally delivering it.
      return this.blocked(task, 'Hermes 计划验收状态不可用，暂不交付');
    }

    // Tasks created by the simple @employee path have no plan-job row and can
    // be delivered from their own authoritative terminal state.
    if (!planJob?.draft_id) {
      const completed = task.status === 'COMPLETED';
      return {
        taskId: task.id,
        projectId: task.project_id ?? null,
        required: false,
        allowed: completed,
        reason: completed ? null : `任务当前状态为 ${task.status ?? 'UNKNOWN'}`,
        validationTaskId: null,
        validationVerdict: null
      };
```

</details>

**依据 10 · 源码核查**：[src/main/services/hermesDeliveryGate.ts:112-164](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesDeliveryGate.ts#L112-L164)

员工独立、相关任务和前缀PASS门控。

<details>
<summary>查看原文（53行）</summary>

```text
    if (task.status !== 'COMPLETED') {
      return this.blocked(task, `执行任务当前状态为 ${task.status ?? 'UNKNOWN'}，尚未完成`);
    }

    const planTasks = this.db.raw.prepare(`
      SELECT t.id, t.agent_id
      FROM hermes_plan_jobs j
      JOIN tasks t ON t.id = j.task_id AND t.deleted_at IS NULL
      WHERE j.draft_id = ?
    `).all(planJob.draft_id) as Array<{ id?: string; agent_id?: string | null }>;
    const implementationTaskIds = new Set(
      planTasks.map((row) => row.id).filter((value): value is string => typeof value === 'string')
    );
    const implementationWorkers = new Set(
      planTasks.map((row) => row.agent_id).filter((value): value is string => typeof value === 'string')
    );

    const candidates = this.db.raw.prepare(`
      SELECT id, agent_id, status, result, error, content, created_at
      FROM tasks
      WHERE project_id = ? AND conversation_id = ? AND deleted_at IS NULL
        AND content LIKE 'Task intent: validation%'
      ORDER BY created_at DESC, id DESC
    `).all(task.project_id, task.conversation_id) as TaskRow[];
    const validation = candidates.find((candidate) => {
      if (!candidate.id || !validationIntent(candidate.content)) return false;
      if (candidate.agent_id && implementationWorkers.has(candidate.agent_id)) return false;
      const related = relatedTaskIds(candidate.content);
      return related.includes(taskIdentity) || (related.length > 0 && [...implementationTaskIds].every((id) => related.includes(id)));
    });

    if (!validation?.id) {
      return this.blocked(task, '尚未完成独立验收；主秘书必须先让未参与实现的数字员工验收');
    }
    const verdict = validation.status ? parseHermesValidationVerdict(validation.status, validation.result) : 'BLOCKED';
    if (verdict === 'PASS') {
      return {
        taskId: task.id,
        projectId: task.project_id ?? null,
        required: true,
        allowed: true,
        reason: null,
        validationTaskId: validation.id,
        validationVerdict: verdict
      };
    }
    const detail = validation.status && !TERMINAL_STATUSES.has(validation.status)
      ? `独立验收任务当前状态为 ${validation.status}`
      : verdict === 'FAIL'
        ? '独立验收未通过，需返工后重新验收'
        : verdict === 'BLOCKED'
          ? '独立验收被阻塞，缺少可复核证据'
          : '独立验收尚未返回 PASS';
```

</details>

**依据 11 · 源码核查**：[src/main/ipc.ts:1614-1624](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/ipc.ts#L1614-L1624)

桌面读取结果实际走gate。

<details>
<summary>查看原文（11行）</summary>

```text
  // Desktop reads must share the Hermes delivery gate used by channels. This
  // keeps unaccepted plan work from appearing as a completed deliverable.
  const deliveryAllowed = (taskId: string): boolean => {
    const gate = hermesGovernance?.getDeliveryGate(taskId);
    return !gate || !gate.required || gate.allowed;
  };
  handle('aibox:getTaskResult', (_e, taskId: string) => {
    const id = assertId(taskId, 'taskId');
    if (!deliveryAllowed(id)) return null;
    return orchestrator.taskResult(id);
  });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖和权限／恢复负担支持何种采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要维护桌面工作台、固定Hermes fork、项目目录和真实Provider；源码开发声明Node20+、npm10+、Python3.11／uv，发布平台声明Windows10/11与Ubuntu22.04+。Codex／Claude／Pi等员工还需对应运行时、认证、工具权限；Android和渠道是可选额外边界，不是根客户端自动提供的安全执行能力。本轮未安装或核外部服务实时价格。

Provider保存会在safeStorage不可用时拒绝新密钥，脱敏视图只返hasKey，改origin需要新key；支持密钥保管机制，不等于所有执行器／渠道／日志从未泄漏。项目Hermes home创建对home和skills/sessions等检查非symlink，管理Skill由Main写入；项目级目录不是恶意进程的内核隔离。README“所有任务预算检查”本轮未获得全执行路径的金额硬上限证明，不能把它写成已核收费封顶；运行时和多模型验收可能增加消耗。

首次需备份旧数据，2.x不兼容1.x调度状态，配置Provider和至少两个合适员工才能完成独立验收。持续需维护运行时／模型、权限与产物验收；返工会有第二轮推理与人工成本。失败状态／迟到回调保护可读，但进程崩溃恢复、取消所有外部副作用与跨版本迁移未在本轮执行，不能默认安全重试。退出可回单CLI与人工验收，先备份项目文件、任务库和必要日志，并撤销Provider／渠道凭据；只关窗口不证明后台或外部任务结束。对于想立即依赖完整“老板下令到复杂交付”的工作室，建议observe，待固定环境真实闭环和产物版本验收完成；研究者可另以一次性小项目评架构，不把探索等同推荐接管业务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-19](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/README.md#L9-L19)

平台、固定运行时及迁移/准备负担。

<details>
<summary>查看原文（11行）</summary>

```text
## 当前版本

| 组件 | 版本 | 说明 |
| --- | --- | --- |
| OPC-Nexus 桌面端 | `2.0.1` | Windows 10/11、Ubuntu 22.04+ |
| Hermes Runtime | `0.19.0` | Quest 唯一调度引擎，固定 fork 和上游 commit |
| Android Bridge | `0.4.3` | 可选手机执行员工，不参与 Quest 调度 |

2.0.1 是 Hermes 架构后的运行时增强版本，与 1.x 的 Nexus 调度架构不兼容。升级时请先备份用户数据；应用会迁移旧数据目录，不会把旧 DSH 调度状态重新启用为第二套控制面。

发布包可携带固定版本的 Codex CLI 与 Pi Agent 运行时，放在应用资源目录并由主进程优先调用。源码仓库不提交 `node_modules` 或原生二进制；发布前运行 `npm run agents:prepare`，安装后运行 `npm run agents:verify`。
```

</details>

**依据 2 · 作者声明**：[README.md:98-113](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/README.md#L98-L113)

完整闭环仍门禁与开发依赖。

<details>
<summary>查看原文（16行）</summary>

````text
## 验收边界

v2.0.1 已通过类型检查、单元测试、生产构建、Hermes runtime smoke 和桌面 UI smoke。完整的“老板下令 -> Hermes 组队 -> Codex/Pi 多员工执行 -> 独立验收 -> 复杂交付”仍是发布门禁；两部 30 万字小说的全量写作尚未完成，因此不能把该场景宣称为已交付。发布说明会记录每个场景的实际产物、耗时和阻断原因。

## 开发与验证

要求 Node.js 20+、npm 10+、Python 3.11（Hermes 准备脚本使用 uv）。

```bash
npm ci
npm run hermes:prepare
npm run typecheck
npm test
npm run hermes:verify
npm run hermes:smoke
npm run build
````

</details>

**依据 3 · 源码核查**：[src/main/services/provider.ts:104-138](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/provider.ts#L104-L138)

脱敏视图、safeStorage拒绝与origin换key。

<details>
<summary>查看原文（35行）</summary>

```text
/** 脱敏视图：密钥是否存在，不回传明文 */
export function getProviderConfig(db: Database): ProviderConfig {
  const row = defaultProviderRow(db);
  if (row) return { baseUrl: row.base_url, model: row.model, hasKey: readProviderKey(db) !== null };
  if (providerCount(db) > 0) return { baseUrl: '', model: '', hasKey: false };
  const c = db.getSetting<ProviderSettings>(PROVIDER_SETTING, DEFAULTS);
  return { baseUrl: c.baseUrl, model: c.model, hasKey: readProviderKey(db) !== null };
}

/** 保存配置：写穿 providers 表（默认行 upsert）；apiKey 留空表示沿用已存密钥 */
export function saveProviderConfig(db: Database, input: { baseUrl: string; model: string; apiKey?: string }): void {
  const baseUrl = normalizeProviderBaseUrl(input.baseUrl);
  const model = input.model.trim() || DEFAULTS.model;
  const key = input.apiKey?.trim();
  if (key && !safeStorage.isEncryptionAvailable()) throw new Error('系统密钥库不可用');
  const encryptedKey = key ? safeStorage.encryptString(key).toString('base64') : null;

  const row = defaultProviderRow(db);
  if (row) {
    const originChanged = !providerOriginsMatch(row.base_url, baseUrl);
    if (originChanged && !key) throw new Error('Changing Provider origin requires a new API Key');
    const ref = encryptedKey
      ? (originChanged ? `secret:provider:${row.id}:${randomUUID()}` : (row.api_key_ref || `secret:provider:${row.id}`))
      : '';
    db.transaction(() => {
      db.raw.prepare('UPDATE providers SET base_url = ?, model = ?, is_default = 1 WHERE id = ?').run(baseUrl, model, row.id);
      if (encryptedKey) {
        db.setSetting(ref, encryptedKey);
        if (!row.api_key_ref || originChanged) db.raw.prepare('UPDATE providers SET api_key_ref = ? WHERE id = ?').run(ref, row.id);
        if (originChanged && row.api_key_ref && row.api_key_ref !== ref) {
          const shared = db.raw.prepare('SELECT COUNT(*) c FROM providers WHERE api_key_ref = ?').get(row.api_key_ref) as { c: number };
          if (shared.c === 0) {
            db.raw.prepare('DELETE FROM settings WHERE key = ?').run(row.api_key_ref);
            if (row.api_key_ref === `secret:${PROVIDER_KEY_REF}`) {
              db.raw.prepare('DELETE FROM settings WHERE key = ?').run(PROVIDER_SETTING);
```

</details>

**依据 4 · 源码核查**：[src/main/services/hermesServiceManager.ts:1475-1511](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesServiceManager.ts#L1475-L1511)

项目home/skills非symlink核查及受管Skill写入。

<details>
<summary>查看原文（37行）</summary>

```text
    mkdirSync(home, { recursive: true });
    this.assertDirectoryNotSymlink(home);
    for (const directory of ['memories', 'skills', 'sessions']) {
      const path = join(home, directory);
      mkdirSync(path, { recursive: true });
      this.assertDirectoryNotSymlink(path);
    }
    const managedSkills = join(home, 'skills', 'opc-nexus');
    const managedRelative = relative(home, managedSkills);
    if (!managedRelative || managedRelative.startsWith('..') || managedRelative.includes(':')) {
      throw new Error('Hermes managed skill directory escaped the project home');
    }
    if (existsSync(managedSkills)) {
      this.assertDirectoryNotSymlink(managedSkills);
      rmSync(managedSkills, { recursive: true, force: true });
    }
    mkdirSync(managedSkills, { recursive: true });
    this.assertDirectoryNotSymlink(managedSkills);
    for (const skill of this.resolveProjectSkills(projectId)) {
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(skill.id)) {
        throw new Error(`Selected project skill ${skill.id} has an invalid identity`);
      }
      const directory = join(managedSkills, skill.id);
      mkdirSync(directory, { recursive: true });
      this.assertDirectoryNotSymlink(directory);
      const frontmatterName = skill.name.replace(/[\r\n]/g, ' ').slice(0, 120);
      const description = skill.description.replace(/[\r\n]/g, ' ').slice(0, 500);
      this.atomicWrite(join(directory, 'SKILL.md'), [
        '---',
        `name: ${JSON.stringify(frontmatterName)}`,
        `description: ${JSON.stringify(description)}`,
        'allowed-tools: []',
        '---',
        '',
        skill.content,
        ''
      ].join('\n'));
```

</details>

**依据 5 · 源码核查**：[src/main/services/hermesEmployeeDispatcher.ts:165-190](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesEmployeeDispatcher.ts#L165-L190)

独立员工还需network/browser能力。

<details>
<summary>查看原文（26行）</summary>

```text
      if (intent === 'validation' && related.status !== 'COMPLETED') {
        throw new Error('Hermes validation must wait until every related execution task is completed');
      }
      if (related.agent_id) relatedWorkerIds.add(related.agent_id);
    }
    if (intent === 'validation' && relatedWorkerIds.has(workerAgentId)) {
      throw new Error('Hermes validation must be assigned to an independent employee, not an implementation worker');
    }
    const worker = this.db.raw.prepare(`
      SELECT id, engine_id, lifecycle, archived, capabilities_json
      FROM agents WHERE id = ? AND organization_id = ?
    `).get(workerAgentId, binding.organizationId) as {
      id?: string;
      engine_id?: string;
      lifecycle?: string;
      archived?: number;
      capabilities_json?: string;
    } | undefined;
    if (worker?.id !== workerAgentId || worker.archived === 1 || worker.lifecycle !== 'READY') {
      throw new Error('Hermes employee task worker is unavailable');
    }
    if (intent === 'validation') {
      let capabilities: Record<string, unknown> = {};
      try { capabilities = JSON.parse(String(worker.capabilities_json ?? '{}')) as Record<string, unknown>; } catch { capabilities = {}; }
      if (capabilities.network !== true || capabilities.browser !== true) {
        throw new Error('Hermes validation worker lacks required network/browser tools');
```

</details>

**依据 6 · 作者声明**：[README.md:131-137](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/README.md#L131-L137)

所有权限预算等为作者总声明，未作全路径证明。

```text
## 安全边界

- `contextIsolation: true`、`nodeIntegration: false`，Renderer 不得调用 Node.js API。
- Renderer 只能通过 preload 的类型安全 API 调用 Main；没有通用 `ipcRenderer` 暴露。
- API Key、token 和渠道凭据只存在 Main/safeStorage 边界。
- 所有任务必须经过项目目录、员工、权限、预算和引擎可用性检查。
- Hermes 进程、代理或 Gateway 崩溃时显示离线/错误并停止相关队列，不显示成功。
```

#### 缺口

- 完整多员工独立验收到复杂成果闭环尚未有本轮实际执行；作者也列为发布门禁。
  **影响**：核心业务接管收益与恢复成本不能确认，是observe主要原因。
  **进一步探讨**：固定OS／Hermes／两员工与有验收标准的小项目，验证成功、返工、取消／崩溃恢复和退出全链。
- 所有执行器的现金预算硬上限、子进程权限隔离与持久恢复没有全量核验。
  **影响**：不能承诺财务封顶或多租户安全。
  **进一步探讨**：在采用前逐执行器核金额计费、权限、取消副作用与checkpoint，未证实前保留人工控制。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 公开验收范围与产物门控有什么缺口，可证伪的新方向是什么？

**研究主题**：新假设与验证

#### 完整回答

固定README承认完整Hermes组队→Codex/Pi多员工→独立验收→复杂交付仍是发布门禁，两个30万字小说未完成；通过类型检查、单测、构建和smoke不能替代这个产品闭环。旧日期验收文档和前架构场景也不能跨版本继承为当前交付。本轮只读固定源，没有运行桌面、模型、CLI、手机或渠道，因此不能报告本地通过。

Q02的manifest有SHA256，而gate仅查员工身份／task关系和前缀PASS，可推导尚未实现的“验收绑定产物版本”假设：validation回执绑定实际检查的manifest hash及关键验证结果，交付前复核hash，可减少验收后修改仍沿用旧PASS。相对现有门控的新增约束是内容版本与证据绑定，仍不证明内容正确或检查不可伪造；并发任务会带来版本合并成本。最小实验在可丢弃项目让员工写文件、验收PASS后再改文件／重跑任务／两个员工同时修改，比较当前gate和版本绑定gate的陈旧PASS放行、误阻断及返工投入。若陈旧放行未下降，或正常并发误阻断成本超过收益，则否定。此方向不算当前创新或已实现能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-100](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/README.md#L98-L100)

作者直接限定完整闭环与长篇写作未交付。

```text
## 验收边界

v2.0.1 已通过类型检查、单元测试、生产构建、Hermes runtime smoke 和桌面 UI smoke。完整的“老板下令 -> Hermes 组队 -> Codex/Pi 多员工执行 -> 独立验收 -> 复杂交付”仍是发布门禁；两部 30 万字小说的全量写作尚未完成，因此不能把该场景宣称为已交付。发布说明会记录每个场景的实际产物、耗时和阻断原因。
```

**依据 2 · 源码核查**：[src/main/services/projectArtifactManifest.ts:189-220](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/projectArtifactManifest.ts#L189-L220)

已有hash和版本字段作为假设起点。

<details>
<summary>查看原文（32行）</summary>

```text
        const previewKind = projectArtifactPreviewKind(file.relativePath);
        entries.push({
          relativePath: file.relativePath,
          mediaType: projectArtifactMediaType(file.relativePath).replace(/;\s*charset=utf-8$/i, ''),
          size: current.size,
          sha256: await sha256(file.absolutePath),
          modifiedAt: current.mtimeMs,
          sourceTaskId: input.taskId,
          version: 1,
          validationState: 'verified',
          previewKind,
          previewable: previewKind !== 'unsupported',
          run: await deriveRunConfig(file.absolutePath, file.relativePath, current.size)
        });
        totalBytes += current.size;
      } catch (error) {
        const detail = error instanceof Error && /路径越界|发生变化/.test(error.message)
          ? error.message
          : `无法读取项目产物：${file.relativePath}`;
        return this.reject(input, detail);
      }
    }

    const manifest: ProjectArtifactManifest = {
      schemaVersion: 1,
      projectId: input.projectId,
      sourceTaskId: input.taskId,
      generatedAt: this.now(),
      totalBytes,
      entries,
      truncated: scanned.files.length > MAX_MANIFEST_ENTRIES,
      validation: { status: 'verified', reason: null }
```

</details>

**依据 3 · 源码核查**：[src/main/services/hermesDeliveryGate.ts:129-155](https://github.com/h4dex/opc-nexus/blob/0040c2521b4e974cfaef031c06ecafdce5ad0d17/src/main/services/hermesDeliveryGate.ts#L129-L155)

当前PASS依赖task关联和文本，不绑定artifact hash。

<details>
<summary>查看原文（27行）</summary>

```text
    const candidates = this.db.raw.prepare(`
      SELECT id, agent_id, status, result, error, content, created_at
      FROM tasks
      WHERE project_id = ? AND conversation_id = ? AND deleted_at IS NULL
        AND content LIKE 'Task intent: validation%'
      ORDER BY created_at DESC, id DESC
    `).all(task.project_id, task.conversation_id) as TaskRow[];
    const validation = candidates.find((candidate) => {
      if (!candidate.id || !validationIntent(candidate.content)) return false;
      if (candidate.agent_id && implementationWorkers.has(candidate.agent_id)) return false;
      const related = relatedTaskIds(candidate.content);
      return related.includes(taskIdentity) || (related.length > 0 && [...implementationTaskIds].every((id) => related.includes(id)));
    });

    if (!validation?.id) {
      return this.blocked(task, '尚未完成独立验收；主秘书必须先让未参与实现的数字员工验收');
    }
    const verdict = validation.status ? parseHermesValidationVerdict(validation.status, validation.result) : 'BLOCKED';
    if (verdict === 'PASS') {
      return {
        taskId: task.id,
        projectId: task.project_id ?? null,
        required: true,
        allowed: true,
        reason: null,
        validationTaskId: validation.id,
        validationVerdict: verdict
```

</details>

#### 缺口

- 版本绑定门控的准确性、并发代价和业务收益未验证。
  **影响**：仅未来方向，不能提高当前采用档。
  **进一步探讨**：执行上文三类反例，陈旧放行未降或误阻断代价过高就放弃。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
