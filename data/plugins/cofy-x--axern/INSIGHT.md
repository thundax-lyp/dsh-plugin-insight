# Axern

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c0d8444](https://github.com/cofy-x/axern/tree/c0d8444964d21468d2e778a769570cc7b21b00ef)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cofy-x/axern)
<!-- END META -->

> **功能**：面向 Agent 评估、训练与数据合成的隔离沙箱执行平台

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的设计增量是一条Environment/Run/Allocation控制链：准入同事务落资源与收敛意图，gateway精确Allocation访问，node独立有限租约fail-stop，清理屏障后释放。隔离继承gVisor，未声称新的内核防护或已获生产效果。

> **主要限制**：[Q03](#research-q03) 持久控制元数据不能保住node丢盘后的workspace/输出，封存字节需期限内上层导出。超时/取消不证明工作负载已停，SDK close失败后本地ID已清，create响应丢失也无显式请求幂等key；跨租户、恢复与效果必须真实验收。

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
  - [Q01 · 这是插件还是执行平台，替代哪段人工工作？](#detail-section-11)
  - [Q02 · 从SDK启动到授权执行、租约与清理怎样形成一条链？](#detail-section-12)
  - [Q03 · 持久控制状态是否等于持久工作区，超时或取消是否等于已停止？](#detail-section-13)
  - [Q04 · 怎样以可控范围采用，首次持续、失败和退出成本是什么？](#detail-section-14)
  - [Q05 · 工程贡献与下一步值得验证的增量是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Axern根组件是独立Agent执行基础设施，提供CLI、多语言SDK、控制服务、节点和gVisor运行时，没有DSH bundle/工具接线。根package是private的工作区管理入口，不能因为被插件列表收录就写成可直接安装的DSH插件。DSH接入需要另写适配器、映射会话/任务及权限，本版未见该原生入口。

目标是运行Agent生成代码的评估、训练或数据合成团队：让每次执行有可查询的Run身份、明确资源准入、节点分配、输出和清理状态，而不靠一次docker run进程的退出码记账。相对手工容器脚本，它将请求意图、Allocation绑定和重试收敛存PostgreSQL；相对仅有gVisor，它新增生命周期与公开访问API。隔离核心来自runsc，不把gVisor算本项目发明。相对已有成熟容器编排或托管沙箱，其额外运维收益没有本轮对照，不能宣称普遍更轻。

Environment→Run→Allocation→runsc是唯一执行链，Sandbox只是SDK门面。成功结果不仅是exec返回，还包括错误/取消后的可追踪清理、容量不提前释放和输出在期限内被上层持久保存。README明确pre-1.0、适于评估贡献，默认本地栈不承诺不可信多租户安全。

容器脚本或直接runsc提供执行与隔离；Axern新增持久生命周期、资源和公开访问API。成熟编排/托管沙箱是直接替代，但本轮无运行对照；DSH原生适配不在根组件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Environment/Run/Allocation API | 持久执行意图、分配与结果 | 独立平台，非DSH原生工具 |
| Allocation进程/文件/终端/隧道 | 操作单次分配 | 通过gateway身份及grant授权 |
| runsc执行与资源准入 | 隔离Agent代码并组织容量 | Linux与正确硬限/运维配置，非生产默认 |
| 声明输出与rootfs发布 | 任务结束后提取/复用有限成果 | 期限内上层导出，非持久workspace |
| 租约/收敛/清理状态 | 失联停止和资源释放追踪 | 意图不等于停止已完成，需观察确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Linux/runsc、cgroup与节点权限 | 执行必需 | 隔离与硬资源限制 | runsc构造缺失报错，无普通容器fallback |
| Postgres及control/gateway/node | 必需 | 权威状态、准入、公开访问 | 不把SDK内存状态当替代 |
| Docker Compose v2 | 本地路径必需 | 完整开发栈 | 开发凭据不能复用生产 |
| 身份/证书、Node准入、网络/镜像信任 | 共享部署前提 | 限定调用者与节点 | 示例不承诺多租户安全 |
| 上层持久存储和输出下载 | 保留成果必需 | 节点输出期限内导出 | node丢盘/到期可能失去字节 |
| DSH适配器 | DSH特定接入另需 | 任务/权限/取消映射 | 根组件无DSH bundle入口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 运维隔离Compose、固定制品、加载可信镜像 | 身份/资源与节点ready明确 |
| 提交 | 上层声明有限argv、资源与输出并保存公共ID | 观察Run及Allocation，不盲重试未知提交 |
| 执行 | 通过gateway的Allocation API操作 | 正确任务结果且跨分配访问拒绝 |
| 收尾 | 取消/终态后导出输出，等RELEASED | 超时不等于清理；异常查队列/节点 |
| 退出 | 停新任务、确认释放、关闭栈和处理各存储 | 不用删DB替代运行时停止确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Linux主机/镜像/DB/证书，金额未知 | 身份和资源配置、Linux资格验证 | 本轮未安装计时 |
| 持续 | 内存reserve、镜像/node磁盘、DB与输出存储 | 清理队列、租约健康、备份和升级 | 无利用率或ROI测量 |
| 失败 | 未释放Allocation占配额、恢复停机 | 查询公共ID、节点/输出抢救 | 本地close失败不能证明上游停止 |
| 退出 | 输出导出流量与存储，未知 | 确认释放并分别处理DB/registry | 输出过期或node丢盘可能不可恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可追踪执行 | Run/Allocation与收敛意图同事务 | HA/分区全部路径实际收敛 |
| 访问分配 | exact-ID grant与gateway路由 | 完整主体策略与恶意多租户验收 |
| 失联停止 | watchdog先记终止再fail-stop | 失败重试延迟与真实停止时间 |
| 成果交付 | 声明输出封存与成功rootfs派生模型 | 上层持久化、丢盘/期限恢复 |
| 资源组织 | request/limit/quota分离 | 吞吐、成本节省和任务质量 |

> **思考**：[Q03](#research-q03) 持久控制元数据不能保住node丢盘后的workspace/输出，封存字节需期限内上层导出。超时/取消不证明工作负载已停，SDK close失败后本地ID已清，create响应丢失也无显式请求幂等key；跨租户、恢复与效果必须真实验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的设计增量是一条Environment/Run/Allocation控制链：准入同事务落资源与收敛意图，gateway精确Allocation访问，node独立有限租约fail-stop，清理屏障后释放。隔离继承gVisor，未声称新的内核防护或已获生产效果。

同事务意图、exact-ID访问、生存租约与访问grant分离以及先记终止后停止值得借鉴。主实现Go/Rust不在默认JS/TS统计内，生成SDK和proto不能当独立原创；验证层级区分本地与部署资格，本轮均未执行，见 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 持久控制元数据不能保住node丢盘后的workspace/输出，封存字节需期限内上层导出。超时/取消不证明工作负载已停，SDK close失败后本地ID已清，create响应丢失也无显式请求幂等key；跨租户、恢复与效果必须真实验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

限定一次性非敏感评估任务，保存Run/Allocation ID、显式有限argv和输出，测试匿名/跨分配拒绝及取消/失联/重启后释放。未获真实Linux覆盖和稳定迁移前不当生产DSH多租户后端；失败按权威状态恢复，见 [Q03](#research-q03)、[Q04](#research-q04)。

目标是运行Agent生成代码的评估、训练或数据合成团队：让每次执行有可查询的Run身份、明确资源准入、节点分配、输出和清理状态，而不靠一次docker run进程的退出码记账。相对手工容器脚本，它将请求意图、Allocation绑定和重试收敛存PostgreSQL；相对仅有gVisor，它新增生命周期与公开访问API。隔离核心来自runsc，不把gVisor算本项目发明。相对已有成熟容器编排或托管沙箱，其额外运维收益没有本轮对照，不能宣称普遍更轻。

Environment→Run→Allocation→runsc是唯一执行链，Sandbox只是SDK门面。成功结果不仅是exec返回，还包括错误/取消后的可追踪清理、容量不提前释放和输出在期限内被上层持久保存。README明确pre-1.0、适于评估贡献，默认本地栈不承诺不可信多租户安全。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实条目为infrastructure，非原生DSH插件；固定源码主链已核查，未运行目标。仅建议有运维能力团队隔离一次性试用，生产多租户/HA/数据持久与端到端效果未获验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SECURITY.md、sdk/typescript/src/sandbox/index.ts、sdk/typescript/src/sandbox/lifecycle.ts、sdk/typescript/src/client/index.ts、sdk/typescript/src/node/context.ts、control/controld/internal/postgres/run/run_admission.go、control/controld/internal/kernel/allocation/reconcile.go、gateway/gatewayd/internal/api/node/access_grant_routing.go、runtime/axnoded/internal/service/execution_lease_watchdog.go、runtime/axnoded/internal/runtime/runsc_factory.go、lib/go/executionlease/contract.go、docs/architecture/storage-architecture.md、docs/architecture/resource-model.md、control/controld/docs/node-placement-and-leases.md、docs/verification/local-full-verification.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：以根平台身份、TypeScript SDK→Go准入事务/gateway/watchdog/runsc构造的代表主链核查。未全审Go/Rust、egress/镜像/内核策略、三SDK一致性或生产部署。
- 下一步：隔离Linux固定制品，验证有限任务、输出封存/到期、跨Allocation拒绝、提交丢响应、cancel响应丢失、node断网/重启与RELEASED；另做生产身份和存储资格，不把本轮静态材料当结果。

**分析版本**

- **仓库**：[cofy-x/axern](https://github.com/cofy-x/axern)
- **版本号**：0.12.1（[固定提交 c0d8444](https://github.com/cofy-x/axern/tree/c0d8444964d21468d2e778a769570cc7b21b00ef)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 给Agent适配器增加持久创建唯一键及分阶段取消/输出回执，以恢复未知提交并确认最终释放；相对labels/listRuns新增跨客户端重试唯一性。以提交丢响应、并发和重启故障验证，不建立第二套执行状态；未实现未验证。

隔离Linux固定制品，验证有限任务、输出封存/到期、跨Allocation拒绝、提交丢响应、cancel响应丢失、node断网/重启与RELEASED；另做生产身份和存储资格，不把本轮静态材料当结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 164 | 11838 | — | — | 105055 |
| .mjs | source | 9 | 652 | 582 | 20 | — |
| .ts | source | 35 | 4189 | 3602 | 178 | — |
| .md | example | 1 | 5 | — | — | 23 |
| .ts | example | 1 | 98 | 83 | 6 | — |
| .ts | test | 14 | 1270 | 1071 | 68 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/cofy-x/axern/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/cofy-x/axern/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根基础设施唯一执行链及故障/访问/存储边界，不冒充DSH插件或全runtime审计。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是插件还是执行平台，替代哪段人工工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Axern根组件是独立Agent执行基础设施，提供CLI、多语言SDK、控制服务、节点和gVisor运行时，没有DSH bundle/工具接线。根package是private的工作区管理入口，不能因为被插件列表收录就写成可直接安装的DSH插件。DSH接入需要另写适配器、映射会话/任务及权限，本版未见该原生入口。

目标是运行Agent生成代码的评估、训练或数据合成团队：让每次执行有可查询的Run身份、明确资源准入、节点分配、输出和清理状态，而不靠一次docker run进程的退出码记账。相对手工容器脚本，它将请求意图、Allocation绑定和重试收敛存PostgreSQL；相对仅有gVisor，它新增生命周期与公开访问API。隔离核心来自runsc，不把gVisor算本项目发明。相对已有成熟容器编排或托管沙箱，其额外运维收益没有本轮对照，不能宣称普遍更轻。

Environment→Run→Allocation→runsc是唯一执行链，Sandbox只是SDK门面。成功结果不仅是exec返回，还包括错误/取消后的可追踪清理、容量不提前释放和输出在期限内被上层持久保存。README明确pre-1.0、适于评估贡献，默认本地栈不承诺不可信多租户安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-23](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/README.md#L17-L23)

作者描述执行平台和唯一资源链。

```text
Axern is an open-source environment execution platform for agent evaluation, training, and data synthesis. It isolates agent-generated code with gVisor (`runsc`) through one resource and lifecycle model. Runsc is the supported execution runtime, with no runtime fallback. The CLI and the Go, Python, and TypeScript SDKs expose the same public APIs for Environments, Runs, sandbox processes and files, Tunnels, lifecycle state, and allocation-scoped access.

> **Project status:** Axern is pre-1.0 and under active development. It is suitable for evaluation and contribution, but operators should review the security and production boundaries before deploying multi-tenant workloads.

The durable chain is **Environment → Run → Allocation → runsc sandbox**. Sandbox is an SDK facade over that chain, not a second execution lifecycle.

<p align="center">
```

**依据 2 · 作者声明**：[README.md:77-92](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/README.md#L77-L92)

作者列举Run/SDK目标任务及持久控制增量。

<details>
<summary>查看原文（16行）</summary>

````text

- **Sandbox as the primitive:** evaluation, training, data synthesis, coding workspaces, and agent tasks compose the same Run execution model.
- **Durable control plane:** PostgreSQL-backed intent, placement, leases, allocation-scoped status, health, and cleanup state remain authoritative across process or node restarts.
- **One production runtime:** runsc workloads use the same public APIs; OCI and Nydus image paths converge at the node runtime.
- **Real data-plane access:** process streams, files, archives, SSH-compatible terminals, and reverse TCP tunnels are explicit allocation capabilities.
- **Local-to-cluster continuity:** Docker Compose, kind, and the cloud-neutral Helm chart exercise the same component boundaries.

## Architecture

```mermaid
flowchart LR
    Client["CLI and SDK clients"] --> Gateway["gatewayd\npublic control and data edge"]
    Gateway --> Control["controld\ndurable intent and placement"]
    Gateway --> Tunnel["tunneld\nreverse TCP relay"]
    Gateway --> Node["axnoded\nsandbox execution"]
    Control --> Node
````

</details>

**依据 3 · 源码核查**：[package.json:1-29](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/package.json#L1-L29)

private工作区脚本，不是DSH原生插件入口。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "@cofy-x/axern",
  "version": "0.12.1",
  "private": true,
  "description": "Open-source agentic infrastructure for running AI agents in isolated, stateful sandboxes",
  "license": "Apache-2.0",
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cofy-x/axern.git"
  },
  "homepage": "https://github.com/cofy-x/axern#readme",
  "bugs": {
    "url": "https://github.com/cofy-x/axern/issues"
  },
  "scripts": {
    "build": "pnpm --filter @cofy-x/axern-sdk run build && pnpm --filter @cofy-x/axern-docs run build",
    "test": "pnpm --filter @cofy-x/axern-sdk run test && pnpm --filter @cofy-x/axern-docs run test",
    "lint": "pnpm --filter @cofy-x/axern-sdk run lint && pnpm --filter @cofy-x/axern-docs run lint"
  },
  "devDependencies": {
    "tsx": "^4.23.1",
    "typescript": "^5.9.3"
  },
  "packageManager": "pnpm@10.24.0"
}
```

</details>

#### 缺口

- 未检查DSH外置适配器或同类平台效果对照；本项只判断根组件。
  **影响**：源码设计不能替代Linux部署、故障恢复与任务结果验收。
  **进一步探讨**：在隔离Linux/Compose环境固定精确制品与配置，按本题边界验证并保存状态/清理结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从SDK启动到授权执行、租约与清理怎样形成一条链？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

TypeScript Sandbox.start先接受image/environmentId二选一。image路径创建Environment，再createRun传argv、cwd、networkPolicy、能力、资源请求/限制和declaredOutputs；默认argv让shell sleep infinity。watchRun必须观察running且allocation_id非空才暴露state，默认等待180秒。其exec/files等通过AllocationClient指向同一gateway端点，而不是把Node地址和访问token交给公开调用者。

服务端AdmitRun在一个Postgres事务内锁Environment、检查namespace归属、选择资源候选，生成唯一Run/Allocation，冻结配置、插入资源请求和能力需求，并ScheduleReconcile ensure-present。提交后signal只是唤醒，意图已在库中，不是请求函数直接调用node。取消/结束到ensure-absent和grant撤销的整体语义在节点租约文档说明；本轮以事务准入、gateway授权和node watchdog代表实现核对，未读完所有控制器分支。

gateway的withResolvedClient先从证书身份获取fingerprint，向控制面为指定allocation解析短期grant，检查返回Allocation精确相同、token非空且未过期，再连接绑定Node。重试只针对规定的grant拒绝，保留同一绑定与grant，避免每次重试把node等待的版本推进。控制面ExecutionLease是生存许可，AllocationAccessGrant是数据访问许可，两者职责分开；30秒TTL不等于访问token。

node watchdog每秒查过期Allocation，在生命周期锁内先持久标记过期终止意图，再FailStopWorkload，错误记录后重试；过期只停工作负载，不释放资源、不绕过输出封存。runsc构造器未配置/找不到二进制即报错，没有降级为普通容器的路径。隔离、cgroup、网络和镜像服务依赖Linux/宿主部署。

Sandbox.start异常尝试close并合并清理错误。close先清本地runId/state，再停tunnel、cancelRun和删自己创建的Environment；若RPC失败再次close不再有原runId，因此调用者应先保存公共ID并按控制面查询恢复，不能把本地对象关闭当node已停止。

#### 证据与依据

**依据 1 · 源码核查**：[sdk/typescript/src/sandbox/index.ts:113-204](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/sandbox/index.ts#L113-L204)

SDK创建、等待、错误清理及先清本地身份的close。

<details>
<summary>查看原文（92行）</summary>

```text
  async start(): Promise<this> {
    if (this.currentState !== undefined) {
      return this;
    }
    let environmentId = this.options.environmentId ?? "";
    try {
      if (environmentId === "") {
        const environment = await this.client.createEnvironment({
          namespace: this.options.namespace,
          image: this.options.image,
          registryCredentialId: this.options.registryCredentialId,
          rootfsReadonly: this.options.rootfsReadonly,
          labels: sandboxLabels(this.options.labels),
        });
        environmentId = String(environment.id ?? "");
        this.environmentId = environmentId;
        this.createdEnvironment = true;
      }
      const run = await this.client.createRun({
        namespace: this.options.namespace,
        environmentId,
        argv: this.options.argv ?? defaultSandboxArgv,
        env: this.options.env,
        cwd: this.options.cwd,
        networkPolicy: this.options.networkPolicy,
        extensionCapabilities: this.options.extensionCapabilities,
        declaredOutputs: this.options.declaredOutputs,
        requestCpu: this.options.requestCpu,
        requestMemory: this.options.requestMemory,
        requestEphemeralStorage: this.options.requestEphemeralStorage,
        limitCpu: this.options.limitCpu,
        limitMemory: this.options.limitMemory,
        limitEphemeralStorage: this.options.limitEphemeralStorage,
        labels: sandboxLabels(this.options.labels),
      });
      this.runId = String(run.id ?? "");
      const runningRun = await waitRunningRun(
        this.runId,
        this.options.readyTimeoutMs ?? 180_000,
        (runId, signal) => this.client.watchRun(runId, { signal }),
      );
      this.currentState = {
        environmentId,
        runId: this.runId,
        allocationId: String(runningRun.allocation_id ?? ""),
        startedAt: new Date(),
      };
      this.currentMetadata = sandboxMetadata(this.options, this.currentState);
      if (this.options.tunnel !== undefined) {
        this.tunnelRuntime = await startTunnelRuntime({
          control: this.client.tunnelClient(),
          allocationId: this.currentState.allocationId,
          tunnel: this.options.tunnel,
          transport: this.client.tunnelTransport(),
        });
        this.currentMetadata = {
          ...this.currentMetadata,
          tunnel: tunnelMetadata(this.tunnelRuntime),
        };
      }
      return this;
    } catch (error) {
      try {
        await this.close();
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], "sandbox start and cleanup failed");
      }
      throw error;
    }
  }

  async close(): Promise<void> {
    const errors: unknown[] = [];
    const runId = this.runId;
    const tunnelRuntime = this.tunnelRuntime;
    this.runId = "";
    this.tunnelRuntime = undefined;
    this.currentState = undefined;
    this.currentMetadata = undefined;
    if (tunnelRuntime !== undefined) {
      await tunnelRuntime.stop().catch((error: unknown) => errors.push(error));
    }
    if (runId !== "") {
      await this.client.cancelRun(runId).catch((error: unknown) => errors.push(error));
    }
    if (this.createdEnvironment && this.environmentId !== "") {
      const environmentId = this.environmentId;
      this.environmentId = "";
      this.createdEnvironment = false;
      await this.client.deleteEnvironment(environmentId).catch((error: unknown) => errors.push(error));
    }
    if (errors.length > 0) throw new AggregateError(errors, "sandbox cleanup failed");
```

</details>

**依据 2 · 源码核查**：[sdk/typescript/src/sandbox/lifecycle.ts:45-83](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/sandbox/lifecycle.ts#L45-L83)

running和allocation条件以及等待超时。

<details>
<summary>查看原文（39行）</summary>

```text
  runId: string,
  timeoutMs: number,
  watchRun: (runId: string, signal: AbortSignal) => AsyncIterable<Record<string, unknown>>,
): Promise<Record<string, unknown>> {
  const deadline = Date.now() + timeoutMs;
  let lastRun: Record<string, unknown> | undefined;
  const controller = new AbortController();
  const iterator = watchRun(runId, controller.signal)[Symbol.asyncIterator]();
  try {
    for (;;) {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) break;
      const result = await nextBeforeDeadline(iterator, remainingMs);
      if (result === undefined || result.done) break;
      const run = result.value;
      lastRun = run;
      const status = Number(run.status ?? 0);
      if (status === runStatus.running && String(run.allocation_id ?? "") !== "") {
        return run;
      }
      if (status === runStatus.succeeded || status === runStatus.failed || status === runStatus.cancelled) {
        throw new Error(`run ${runId} became ${String(run.status ?? "")} before its sandbox allocation was running: ${String(run.message ?? "")}`);
      }
    }
  } finally {
    controller.abort();
    try {
      const close = iterator.return?.();
      if (close !== undefined) void close.catch(() => undefined);
    } catch {
      // The readiness result owns the error surface; stream cleanup is best effort.
    }
  }
  const details = lastRun === undefined ? "no state observed" : `${String(lastRun.status ?? "")}: ${String(lastRun.message ?? "")}`;
  throw new SandboxTimeoutError(`run ${runId} did not reach a running sandbox allocation: ${details}`);
}

async function nextBeforeDeadline<T>(
  iterator: AsyncIterator<T>,
```

</details>

**依据 3 · 源码核查**：[sdk/typescript/src/client/index.ts:506-513](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/client/index.ts#L506-L513)

AllocationClient仍使用统一gateway endpoint。

```text
  allocation(allocationId: string): AllocationClient {
    return new AllocationClient({
      allocationId: required("allocationId", allocationId),
      target: this.endpoint,
      credentials: this.credentials,
      channelOptions: this.controlOptions,
    });
  }
```

**依据 4 · 源码核查**：[control/controld/internal/postgres/run/run_admission.go:24-56](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/control/controld/internal/postgres/run/run_admission.go#L24-L56)

事务准入锁Environment和namespace匹配。

<details>
<summary>查看原文（33行）</summary>

```text
func (s *Store) AdmitRun(ctx context.Context, params runkernel.AdmitRunParams, now time.Time) (*runv1.Run, error) {
	if len(params.Candidates) == 0 {
		return nil, grpcstatus.Error(codes.FailedPrecondition, "no eligible node")
	}
	var (
		run   *runv1.Run
		alloc *runkernel.AllocationRecord
	)
	err := s.withTx(ctx, func(tx pgx.Tx) error {
		currentEnvironment, err := scanEnvironment(tx.QueryRow(ctx, environmentSelectSQL()+` WHERE environment_id = $1 FOR SHARE`, params.Environment.GetID()))
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return grpcstatus.Errorf(codes.NotFound, "environment %q not found", params.Environment.GetID())
			}
			return err
		}
		namespace := environmentkernel.NormalizeNamespace(params.Namespace)
		if currentEnvironment.GetNamespace() != namespace {
			return grpcstatus.Errorf(codes.InvalidArgument, "run namespace %q does not own environment %q", namespace, currentEnvironment.GetID())
		}
		runID := "run-" + uuid.NewString()
		allocationID := "alloc-" + uuid.NewString()
		selected, err := s.admitCandidateResources(ctx, tx, resourceadmission.AdmitCandidateRequest{
			Namespace:     namespace,
			EnvironmentID: params.Environment.GetID(),
			Candidates:    params.Candidates,
			Config:        params.Config,
			Now:           now,
		})
		if err != nil {
			return err
		}
		normalizedConfig := executionkernel.NormalizeConfig(params.Config)
```

</details>

**依据 5 · 源码核查**：[control/controld/internal/postgres/run/run_admission.go:108-142](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/control/controld/internal/postgres/run/run_admission.go#L108-L142)

同事务插入Allocation资源与ensure-present。

<details>
<summary>查看原文（35行）</summary>

```text
			) VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10, $11, '', $12::jsonb)
		`, run.GetID(), run.GetNamespace(), run.GetEnvironmentID(), run.GetStatus().String(), cfgJSON, environmentSpecJSON, resolvedEnvironmentSpecJSON, labelsJSON, run.GetVersion(), now.UTC(), now.UTC(), rootfsSnapshotJSON); err != nil {
			return fmt.Errorf("insert run: %w", err)
		}
		if err := insertRunSecretReferences(ctx, tx, run); err != nil {
			return err
		}
		resources := normalizedConfig.GetResources().GetRequests()
		if _, err := tx.Exec(ctx, `
			INSERT INTO allocations (
				allocation_id, run_id, node_id, lifecycle_state,
				cpu_request_milli, sandbox_memory_request_bytes, ephemeral_storage_request_bytes,
				created_at, updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, alloc.AllocationID, run.GetID(), alloc.NodeID, commonv1.AllocationLifecycleState_ALLOCATION_LIFECYCLE_STATE_BOUND.String(),
			resources.GetCpuMilli(), resources.GetMemoryBytes(), resources.GetEphemeralStorageBytes(), now.UTC(), now.UTC()); err != nil {
			return fmt.Errorf("insert allocation: %w", err)
		}
		if err := pgallocation.InsertCapabilityRequirements(ctx, tx, alloc.AllocationID, selected.CapabilityRequirements, now); err != nil {
			return err
		}
		if err := pgallocation.ScheduleReconcile(ctx, tx, allocationkernel.ScheduleReconcileRequest{
			AllocationID: alloc.AllocationID,
			Intent:       allocationkernel.ReconcileIntentEnsurePresent,
			NextRunAt:    now,
		}, now); err != nil {
			return err
		}
		return nil
	})
	if err == nil {
		s.signalReconcileWork()
	}
	return run, err
}
```

</details>

**依据 6 · 源码核查**：[gateway/gatewayd/internal/api/node/access_grant_routing.go:57-118](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/gateway/gatewayd/internal/api/node/access_grant_routing.go#L57-L118)

证书fingerprint、精确Allocation与过期检查，绑定不变重试。

<details>
<summary>查看原文（62行）</summary>

```text
	allocationID := allocationID(req)
	if allocationID == "" {
		return grpcstatus.Error(codes.InvalidArgument, "allocation_id is required")
	}
	fingerprint, authErr := s.options.ClientFingerprint(ctx)
	if authErr != nil {
		return authErr
	}
	resolved, err := s.resolver.ResolveAllocationTerminal(ctx, &gatewayv1.ResolveAllocationTerminalRequest{
		AllocationID:          allocationID,
		TtlSeconds:            300,
		CredentialFingerprint: fingerprint,
		CredentialKind:        "x509_sha256",
		Purpose:               purpose,
	})
	if err != nil {
		return err
	}
	if strings.TrimSpace(resolved.GetAllocationID()) != allocationID {
		return grpcstatus.Error(codes.Internal, "resolved allocation identity does not match request")
	}
	token := strings.TrimSpace(resolved.GetAccessGrant().GetPlaintextToken())
	if token == "" {
		return grpcstatus.Error(codes.Internal, "resolved allocation access grant token is empty")
	}
	if resolved.GetAccessGrant().GetExpiresAt() == nil || !time.Now().Before(resolved.GetAccessGrant().GetExpiresAt().AsTime()) {
		return grpcstatus.Error(codes.Unauthenticated, "allocation access grant has expired")
	}
	accessCtx, cancel := context.WithDeadline(ctx, resolved.GetAccessGrant().GetExpiresAt().AsTime())
	defer cancel()
	client, err := s.dialer.NodeSandbox(ctx, resolved.GetNodeTarget(), resolved.GetNodeID())
	if err != nil {
		return err
	}
	// A rejection can mean the Node has not observed this committed grant yet.
	// Reissuing inside the retry loop would advance the delivery revision and
	// replace the token the Node is waiting for, so retries keep one immutable
	// Allocation binding and one grant.
	for attempt := 1; attempt <= s.options.AccessGrantRetryAttempts; attempt++ {
		err = call(nodekernel.WithAllocationAccessGrant(accessCtx, token), client)
		if attempt == s.options.AccessGrantRetryAttempts || !shouldRetry(err) {
			return unwrapAccessGrantOpenRejection(err)
		}
		if err := nodekernel.WaitAccessGrantRetry(ctx, attempt, s.options.AccessGrantRetryDelay); err != nil {
			return err
		}
		if s.metrics != nil {
			s.metrics.AccessGrantRetry("node_sandbox")
		}
	}
	return err
}

func allocationID(msg proto.Message) string {
	field := msg.ProtoReflect().Descriptor().Fields().ByName("allocation_id")
	if field == nil {
		return ""
	}
	return strings.TrimSpace(msg.ProtoReflect().Get(field).String())
}

type accessGrantOpenRejection struct {
```

</details>

**依据 7 · 源码核查**：[runtime/axnoded/internal/service/execution_lease_watchdog.go:35-68](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/runtime/axnoded/internal/service/execution_lease_watchdog.go#L35-L68)

过期先记录终止意图后fail-stop，保持清理屏障。

<details>
<summary>查看原文（34行）</summary>

```text
	for _, allocationID := range h.allocationController().ExpiredExecutionLeaseAllocationIDs(now) {
		h.stopExpiredExecutionLease(parent, allocationID, now)
	}
}

func (h *sandboxService) stopExpiredExecutionLease(parent context.Context, allocationID string, now time.Time) {
	controller := h.allocationController()
	ctx, cancel := context.WithTimeout(parent, 30*time.Second)
	defer cancel()
	unlock, err := controller.LockAllocationLifecycleContext(ctx, allocationID)
	if err != nil {
		return
	}
	defer unlock()
	expired, err := controller.MarkExpiredExecutionLeaseWithLifecycleHeld(allocationID, now)
	if err != nil {
		logrus.WithError(err).WithField("allocation_id", allocationID).Error("persist expired execution lease termination intent")
		return
	}
	if expired {
		logrus.WithFields(logrus.Fields{
			"allocation_id":     allocationID,
			"termination_owner": "execution_lease",
		}).Warn("allocation execution lease expired; stopping sandbox fail-closed")
		// Lease expiry owns fail-stop, not resource release. Keep the runtime
		// container metadata and durable AllocationState until controld observes
		// the terminal result and issues the authoritative cleanup request; that
		// request is also the output-sealing barrier.
		err := controller.FailStopWorkloadWithLifecycleHeld(ctx, allocationID)
		if err != nil {
			logrus.WithError(err).WithField("allocation_id", allocationID).Error("retry expired execution lease fail-stop")
		}
	}
}
```

</details>

**依据 8 · 源码核查**：[runtime/axnoded/internal/runtime/runsc_factory.go:19-35](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/runtime/axnoded/internal/runtime/runsc_factory.go#L19-L35)

runsc二进制为必需，构造失败报错。

<details>
<summary>查看原文（17行）</summary>

```text
	if runtimeCfg.Binary == "" {
		return nil, fmt.Errorf("runsc binary is not configured")
	}
	if _, err := os.Stat(runtimeCfg.Binary); err != nil {
		return nil, err
	}
	handler, err := newRunscServiceHandler(cfg, runtimeCfg)
	if err != nil {
		return nil, err
	}
	if handler == nil {
		return nil, fmt.Errorf("runsc constructor returned a nil handler")
	}
	return handler, nil
}

func newRunscServiceHandler(cfg config.Config, runtimeCfg config.RuntimeInstanceConfig) (contract.SandboxRuntime, error) {
```

</details>

**依据 9 · 源码核查**：[lib/go/executionlease/contract.go:1-11](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/lib/go/executionlease/contract.go#L1-L11)

生存租约30秒定义。

<details>
<summary>查看原文（11行）</summary>

```text
// Package executionlease defines the narrow timing contract shared by
// controld and axnoded. ExecutionLease is finite Allocation liveness authority,
// not a persisted control-plane entity or a data-plane credential.
package executionlease

import "time"

const (
	TTL                = 30 * time.Second
	MaxRenewalInterval = TTL / 3
)
```

</details>

#### 缺口

- 未完成各控制器所有状态、请求认证链和所有runtime syscall路径的审计；不声称完整安全证明。
  **影响**：源码设计不能替代Linux部署、故障恢复与任务结果验收。
  **进一步探讨**：在隔离Linux/Compose环境固定精确制品与配置，按本题边界验证并保存状态/清理结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久控制状态是否等于持久工作区，超时或取消是否等于已停止？

**研究主题**：缺陷与关键质疑

#### 完整回答

不等于。Postgres保存意图、身份、资源和结果元数据，不保存stdout/声明输出原始字节。Allocation可写文件只属于该次节点本地分配，节点丢盘或替换Allocation无持久工作区承诺。声明输出和日志在清理前封存，节点进程重启可以保留，但必须由调用者在15分钟输出期限内下载并发布到自己的持久存储；另行显式请求成功Run的rootfs发布OCI镜像再形成Environment，不是可持续写的共享卷。

资源request是准入占用，limit才是运行时硬限。CPU/memory可只设request而不设limit，不能把请求量当硬上限。默认CPU500m、memory4GiB；可写rootfs临时存储默认256MiB。计量只覆盖runsc文件overlay，日志、输出、镜像缓存、tmpfs等不自动计入临时存储收费范围，主机容量仍要运营者管。终态Run在Allocation未RELEASED时仍计占用，避免清理尚在进行就重新分配容量；代价是失败清理会阻塞可用配额。

租约过期代表必须停止的意图；watchdog调用失败仍会重试，不是已证实进程停止。SDK ready超时只结束观察流，并触发close尝试，cancel RPC响应不代表node清理完成。createRun请求一旦在服务端提交但响应丢失，本地可能没有runId；公开createRun字段未见客户端幂等key，服务端准入生成新UUID，因此不能盲目重发保证只执行一次。可用labels辅助查找，但标签不能替代唯一事务幂等身份，本轮不声称已复现重复执行。

多租户部署还需要证书主体、namespace策略、node身份准入、TLS、网络、镜像信任、密钥管理和内核/runsc配置。local生成开发凭据和loopback监听不是生产安全默认。pre-1.0存储契约变化建议重建数据库/节点状态，不能当已有稳定迁移和回滚保证。

#### 证据与依据

**依据 1 · 作者声明**：[docs/architecture/storage-architecture.md:3-34](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/docs/architecture/storage-architecture.md#L3-L34)

明确控制持久与节点字节生命周期和租约停止/清理分离。

<details>
<summary>查看原文（32行）</summary>

```text
Axern separates durable control state from Allocation-local writable files. Persistent workspace and output-storage orchestration is not part of the execution core.

## Data Ownership And Lifetime

| Data | Owner and location | Lifetime |
| --- | --- | --- |
| Workload intent, declared-output specification, Allocations and their resource charges, placement, access grants, TunnelSessions, and Run result metadata | `controld` and PostgreSQL | Durable control state; contains no stdout or declared-output bytes |
| Writable sandbox rootfs and Allocation-local workspace | `axnoded` and node-local runtime filestore | One Allocation; no persistence promise across Allocation replacement or node loss |
| Sealed stdout/stderr and bounded declared outputs | `axnoded` node-local retention | Read-only through the Run output deadline; survives runtime cleanup and node-process restart, not node-disk loss |
| Published rootfs result | Operator-configured OCI repository; referenced by a derived Environment | Content-addressed and reusable across fresh Allocations; physical retention and unreferenced-blob GC are registry policy |
| Immutable rootfs, read-only image bundles, and image caches | `imagemgr` and `imagefsd` where required | Image-owned cache and live mount leases, separate from writable workload data |
| Allocation ownership, cleanup intent, resource state, and recovery records | `axnoded` and its process-owned embedded database | Node-local recovery; not a second shared control-plane database |

PostgreSQL is the only authoritative central state backend. Unselected bytes disappear with Allocation cleanup. Selected declared outputs and bounded logs are sealed before runtime deletion and remain readable only until the immutable output deadline. An explicitly requested successful rootfs result is instead published as an immutable OCI image and referenced by a normal Environment. Downloaded outputs belong to the caller or an upper-layer system. Object storage is never authoritative execution state or a writable POSIX working directory for an Allocation, and Axern does not define a generic public Artifact or Snapshot root.

## Allocation-Local Filesystems

`axnoded` resolves an immutable image rootfs, prepares the allocation-private writable view, and tracks runtime, image, and workspace ownership. Read-only image mounts and runtime-owned bind mounts use the same target validation, conflict checks, and Allocation cleanup boundary.

Writable rootfs storage still requires node-local Allocation charge and runsc hard enforcement. The charged scope is the runsc file-backed root overlay, including metadata, copy-up, and whiteouts; image caches, logs, and process output streams do not silently become part of that charge. See [Resource Model](resource-model.md) and the [node rootfs storage contract](../../runtime/axnoded/docs/rootfs-storage.md).

A replacement Allocation starts from immutable inputs, not from a previous writable directory. Process restart may recover an existing Allocation when its runtime and ownership records remain intact; this does not promise file retention after node loss or Allocation replacement. Declare bounded file or tar outputs before Run admission when a recovering caller must download them after termination; export them to caller-owned durable storage before expiry. The limits and ownership rules are defined in the [Stable Domain Model](../product/domain-model.md).

## Recovery And Cleanup

Allocation ownership, globally unique identities, idempotent lifecycle operations, execution leases, and exact-ID fencing remain required. The node treats an expired ExecutionLease as durable fail-closed termination intent and actively stops the sandbox; expiry alone is not evidence that cleanup has already completed.

Node cleanup quiesces the workload, captures declared outputs, syncs object bytes and the manifest, and atomically publishes the sealed output before deleting the runtime. For an explicitly requested successful rootfs result, cleanup then streams the stopped workload's runsc writable upper layer while the supervising sandbox still exists. Imagemgr validates paths and special files, converts gVisor whiteouts and opaque-directory metadata to OCI layer entries, enforces the bounded size, appends the layer to the immutable base, publishes a digest reference, and persists a minimal receipt before runtime deletion. A partial imagemgr staging file is never authoritative and is removed before retry or recovery. Mount cleanup and writable Allocation-charge release happen only after required barriers and must complete before the associated resource commitment is released. Failed cleanup retains its ownership and retry state; it must not advertise still-owned capacity as free. Node restart preserves a terminal runtime while rootfs sealing is pending and reconciles these records against runtime inventory.

Controld derives every rootfs-sealing command from the frozen Run and Environment specifications. The node requires an exact match with its immutable Allocation recovery copy and rejects missing, conflicting, or non-terminal state. After OCI publication, the node receipt makes Delete retry idempotent across crashes. Controld commits the derived Environment, immutable image metadata, Run snapshot result, and Allocation release in one transaction, then acknowledges the receipt. ExecutionLease expiry only stops the workload; it does not delete the runtime or bypass either sealing barrier.

The final control-plane delete carries a presence-bearing output-sealing command built only from the persisted Run specification and its immutable retention deadline. It is an ephemeral command, not another output authority. When node recovery state exists, its declared-output copy must match the command exactly; when that state is unexpectedly absent, the node publishes explicit `node_unavailable` entries instead of an empty success manifest. The sealed manifest stores only a deterministic contract digest so retries cannot change paths, formats, media types, ordering, or the explicit zero-output contract. That digest is an integrity check, never an Allocation identity.
```

</details>

**依据 2 · 作者声明**：[README.md:98-114](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/README.md#L98-L114)

输出期限、节点/控制边界与非生产默认。

<details>
<summary>查看原文（17行）</summary>

```text
`gatewayd` is the unified external gateway for public control and Allocation-scoped data-plane traffic; `controld` and PostgreSQL remain authoritative for product state, while node services own host-local execution, images, networking, and Allocation-local writable storage. A Run can declare a bounded set of files or tar archives for node-local sealing before runtime cleanup; callers download and durably publish those bytes before their 15-minute expiry. A successful finite Run may separately publish its complete writable rootfs as a content-addressed OCI image and ordinary reusable Environment. Neither path creates a persistent workspace or generic object store. See the [storage architecture](./docs/architecture/storage-architecture.md), [runtime architecture](./docs/architecture/runtime-architecture.md), and [resource model](./docs/architecture/resource-model.md).

Public clients are available in Go, Python, and TypeScript under [`sdk/`](./sdk/README.md). Shared wire contracts are defined in [`sdk/proto`](./sdk/proto/README.md).

## Kubernetes Install

Follow the [Kubernetes installation guide](./apps/docs/src/content/docs/getting-started/kubernetes.md) to provision signing material, supply qualified node memory reserves, bind explicit Node identities, install the control plane, and admit nodes before waiting for runtime readiness. SSH is optional and uses Principal Credentials. Do not skip the identity and admission steps by running a bare Helm install.

Treat each Axern release as one coordinated CLI, SDK, chart, and runtime version. Review its [release notes](./docs/releases/) before upgrading and use artifacts only after publication completes; a source version is not proof of artifact availability. Terminal recordings show the current source CLI help, not a deployed workload or performance measurement.

## Deployment

- [Docker Compose and kind](./deploy/local/README.md) are the repository-owned local truth environments.
- The [Axern Helm chart](./deploy/helm/axern/README.md) is cloud-neutral and accepts operator-owned image registries, certificates, storage classes, and secrets.
- Provider account setup, cluster creation, credentials, and regional release automation intentionally live outside this repository.

Axern does not claim that a default local or example deployment is safe for an untrusted multi-tenant environment. Review authentication, TLS, network policy, runtime isolation, image trust, secret storage, resource limits, and persistent storage before production use. Report vulnerabilities according to [SECURITY.md](./SECURITY.md).
```

</details>

**依据 3 · 作者声明**：[docs/architecture/resource-model.md:11-20](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/docs/architecture/resource-model.md#L11-L20)

request与limit，遗漏硬限时不安装hard cap。

<details>
<summary>查看原文（10行）</summary>

```text
## Requests and Limits

`request` is the amount of CPU, sandbox memory, or ephemeral storage a workload asks Axern to reserve for placement and admission. Memory is the total sandbox cgroup budget, not a promise of guest-usable heap after runtime and page-cache usage. If a request is omitted, the control plane applies the default request before placement:

- CPU request: `500m`
- memory request: `4GiB`
- ephemeral-storage request for a writable rootfs: the resolved ephemeral-storage limit (default `256MiB`)

`limit` is the runtime hard cap for that resource. A memory limit becomes the host cgroup v2 `memory.max` for the complete sandbox domain, with swap disabled and group OOM enabled. Ephemeral-storage limits become runsc overlay size enforcement. A workload may set CPU or memory requests without matching limits; Axern still reserves capacity but does not install the omitted hard cap. Writable roots always resolve both an ephemeral-storage request and limit.

```

</details>

**依据 4 · 作者声明**：[docs/architecture/resource-model.md:87-112](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/docs/architecture/resource-model.md#L87-L112)

overlay计量范围与终态仍占用配额。

<details>
<summary>查看原文（26行）</summary>

````text

- the runsc file-backed root overlay, including its metadata, copy-up, and whiteouts

Immutable lower rootfs and image caches, mount-target projection placeholders, tmpfs, logs, and process output streams are not charged to `ephemeral_storage_bytes`. Extending the charged scope requires an explicit contract change; it must not silently consume an existing Allocation charge.

Allocation-local files are not a persistent volume contract. Applications must export data that needs to survive allocation replacement or node loss; see the [storage ownership and lifetime model](storage-architecture.md).

Overcommit changes control-plane admission capacity only. It does not change container cgroup limits or runtime behavior.

## Namespace Quota

Namespace quota is a control-plane admission ceiling over active workload requests in a namespace. It limits the CPU, memory, and ephemeral-storage charges held by non-released Allocations, independent of which node runs each workload.

Omitted quota fields are unlimited. `quota unset` returns the namespace policy to unlimited CPU, memory, and ephemeral storage. Existing admitted workloads keep running if quota is lowered below current usage; future admissions are blocked until usage falls back under the new limit.

Typical namespace quota flow:

```bash
axern namespace create team-a
axern quota set --namespace team-a --cpu 4 --memory 32GiB
axern quota get --namespace team-a
axern quota unset --namespace team-a
axern namespace delete team-a
```

Quota usage is based on Allocation resource charges until cleanup reaches `RELEASED`. A terminal Run continues to consume capacity while node cleanup is incomplete, preventing premature reuse of resources that may still be live.
````

</details>

**依据 5 · 源码核查**：[sdk/typescript/src/client/index.ts:254-285](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/client/index.ts#L254-L285)

createRun字段无客户端幂等键，异常映射不证明提交失败。

<details>
<summary>查看原文（32行）</summary>

```text
  async createRun(options: CreateRunOptions): Promise<Record<string, unknown>> {
    const resources = buildResourceSpec(options);
    try {
      const response = await unary<Record<string, unknown>, { run: Record<string, unknown> }>(
        this.runControl,
        "CreateRun",
        {
          namespace: options.namespace ?? "default",
          environment_id: required("environmentId", options.environmentId),
          config: {
            argv: options.argv ?? [],
            env: options.env ?? {},
            cwd: options.cwd ?? "",
            ...(options.networkPolicy === undefined
              ? {}
              : { network: { egress_policy: options.networkPolicy.toWire() } }),
            extension_capability_requirements: (options.extensionCapabilities ?? []).map((capability) => ({
              capability: { name: capability.name, value: capability.value ?? "" },
            })),
            declared_outputs: (options.declaredOutputs ?? []).map((output) => ({
              path: output.path,
              format: output.format === "file" ? 1 : 2,
              media_type: output.mediaType ?? "",
            })),
            ...(options.rootfsSnapshot ? { rootfs_snapshot: {} } : {}),
            resources,
          },
          labels: options.labels ?? {},
        },
      );
      return response.run;
    } catch (error) {
```

</details>

**依据 6 · 源码核查**：[control/controld/internal/postgres/run/run_admission.go:44-50](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/control/controld/internal/postgres/run/run_admission.go#L44-L50)

服务端为每次准入生成UUID。

```text
		runID := "run-" + uuid.NewString()
		allocationID := "alloc-" + uuid.NewString()
		selected, err := s.admitCandidateResources(ctx, tx, resourceadmission.AdmitCandidateRequest{
			Namespace:     namespace,
			EnvironmentID: params.Environment.GetID(),
			Candidates:    params.Candidates,
			Config:        params.Config,
```

**依据 7 · 源码核查**：[runtime/axnoded/internal/service/execution_lease_watchdog.go:50-68](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/runtime/axnoded/internal/service/execution_lease_watchdog.go#L50-L68)

停止失败记录并保持状态。

<details>
<summary>查看原文（19行）</summary>

```text
	if err != nil {
		logrus.WithError(err).WithField("allocation_id", allocationID).Error("persist expired execution lease termination intent")
		return
	}
	if expired {
		logrus.WithFields(logrus.Fields{
			"allocation_id":     allocationID,
			"termination_owner": "execution_lease",
		}).Warn("allocation execution lease expired; stopping sandbox fail-closed")
		// Lease expiry owns fail-stop, not resource release. Keep the runtime
		// container metadata and durable AllocationState until controld observes
		// the terminal result and issues the authoritative cleanup request; that
		// request is also the output-sealing barrier.
		err := controller.FailStopWorkloadWithLifecycleHeld(ctx, allocationID)
		if err != nil {
			logrus.WithError(err).WithField("allocation_id", allocationID).Error("retry expired execution lease fail-stop")
		}
	}
}
```

</details>

**依据 8 · 作者声明**：[SECURITY.md:17-20](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/SECURITY.md#L17-L20)

本地环境不是生产安全默认。

```text

## Deployment Boundary

The local Compose and kind environments are development systems. Their sample credentials, loopback listeners, and generated certificates are not production security defaults. Operators are responsible for network isolation, identity, secret management, image trust, and runtime hardening in deployed environments.
```

#### 缺口

- 节点失联、磁盘损坏、输出到期与未知提交结果没有本轮故障注入，所有外部效果/性能仍未知。
  **影响**：源码设计不能替代Linux部署、故障恢复与任务结果验收。
  **进一步探讨**：在隔离Linux/Compose环境固定精确制品与配置，按本题边界验证并保存状态/清理结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样以可控范围采用，首次持续、失败和退出成本是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

适合已有Linux/容器运维能力的评估团队，在一次性非敏感任务上试用完整Run生命周期；不建议把它直接接为DSH生产多租户执行后端。先用隔离Compose和开发凭据，保存精确CLI/镜像/SDK版本及Run/Allocation ID，测试固定输入的短有限任务。SDK默认sleep infinity更像交互容器，有限评估应显式argv并把输出预声明，避免把临时rootfs当成果归档。

首次要Docker Compose v2、镜像下载/装载、Postgres及control/tunnel/node/gateway等服务；从源码还需Go/Rust/TS及镜像构建链。生产Helm不是一个helm install即可完成，还要签名材料、Node身份准入、内存reserve与外部服务配置。现金是机器/存储/流量/镜像仓库及可能证书平台开销，数值未知；人工包括身份策略、镜像审查和Linux资格验证，不把文档命令少解释为总耗时很低。

持续需维护DB备份、node磁盘、镜像/输出保留、cleanup队列、lease/heartbeat健康与配额。失败时先按Run/Allocation公共ID查权威状态，区分请求未知、工作负载终态、租约停止与RELEASED；不以客户端超时重发Agent副作用命令。清理失败保留占用是安全取舍，但会消耗容量和排障时间。上层必须下载输出、校验摘要并自行持久化，错过期限或node丢盘可能无法恢复字节。

退出先停止创建新任务，取消并确认Allocation释放，下载期限内结果，再关本地栈或卸集群。local down并不意味着数据库、镜像仓库或已发布rootfs都被安全清除；按各存储所有者处理。不能用删库作为运行时已停止证据。合格试用要同时验任务结果与取消/失联/重启后的资源回收；任一跨Allocation访问或清理不明，退回现有容器/托管沙箱方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-70](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/README.md#L27-L70)

本地Compose路径及开发凭据限制。

<details>
<summary>查看原文（44行）</summary>

````text
## Quickstart

The supported local path runs the complete stack with Docker Compose. It needs only the `axern` CLI and Docker Compose v2 — no source checkout, Make, Helm, or language toolchains.

```bash
brew install cofy-x/tap/axern
```

Without Homebrew, use the standalone checksummed installer:

```bash
curl -fsSL https://raw.githubusercontent.com/cofy-x/axern/main/install.sh | sh
```

Then start Axern and run the first workload:

```bash
axern local up
axern local image load python:3.12-slim --pull
axern run python:3.12-slim -- python -c 'print("hello from axern")'
```

`local up` starts PostgreSQL and the Axern control, tunnel, node, and gateway components, waits for readiness, and creates the `local` context. `local image load` streams the selected host Docker image into that local node without a temporary archive:

```bash
axern context current
axern run list
axern local status
axern local down
```

The local environment uses generated development credentials and loopback listeners. Do not reuse them in a shared or production deployment.

Trusted machine-local HTTP registries can be authorized with repeatable `axern local up --insecure-registry host[:port]` flags. The registry must be reachable from both local control and node containers under that exact hostname; container-only registries can join the `axern-local-registry` Docker network reported by `axern local status`. See the [CLI contract](./apps/cli/README.md#local-external-http-registries). HTTPS remains the default, and this local-only setting is not part of an Environment specification.

Source development is a separate contributor path. It builds the current checkout into local `:dev` images and exercises the same public contract:

```bash
make quickstart-source
```

For repository development, `make verify-changed` is the normal fast feedback entrypoint. Linux correctness, full regression, and release qualification are separate tiers. Every `main` commit starts a commit-bound full regression; a green PR check does not imply that this later run has passed. Check [Post-Merge Full](https://github.com/cofy-x/axern/actions/workflows/post-merge-full.yml) before release or promotion; see the [verification tiers](./docs/verification/local-full-verification.md).

## What You Can Build
````

</details>

**依据 2 · 作者声明**：[README.md:102-114](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/README.md#L102-L114)

Kubernetes身份步骤与部署责任。

<details>
<summary>查看原文（13行）</summary>

```text
## Kubernetes Install

Follow the [Kubernetes installation guide](./apps/docs/src/content/docs/getting-started/kubernetes.md) to provision signing material, supply qualified node memory reserves, bind explicit Node identities, install the control plane, and admit nodes before waiting for runtime readiness. SSH is optional and uses Principal Credentials. Do not skip the identity and admission steps by running a bare Helm install.

Treat each Axern release as one coordinated CLI, SDK, chart, and runtime version. Review its [release notes](./docs/releases/) before upgrading and use artifacts only after publication completes; a source version is not proof of artifact availability. Terminal recordings show the current source CLI help, not a deployed workload or performance measurement.

## Deployment

- [Docker Compose and kind](./deploy/local/README.md) are the repository-owned local truth environments.
- The [Axern Helm chart](./deploy/helm/axern/README.md) is cloud-neutral and accepts operator-owned image registries, certificates, storage classes, and secrets.
- Provider account setup, cluster creation, credentials, and regional release automation intentionally live outside this repository.

Axern does not claim that a default local or example deployment is safe for an untrusted multi-tenant environment. Review authentication, TLS, network policy, runtime isolation, image trust, secret storage, resource limits, and persistent storage before production use. Report vulnerabilities according to [SECURITY.md](./SECURITY.md).
```

</details>

**依据 3 · 源码核查**：[sdk/typescript/src/sandbox/lifecycle.ts:10-24](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/sandbox/lifecycle.ts#L10-L24)

默认无限sleep与镜像二选一。

<details>
<summary>查看原文（15行）</summary>

```text
export const defaultSandboxArgv = ["/bin/sh", "-lc", "sleep infinity"];

const runStatus = {
  running: 3,
  succeeded: 4,
  failed: 5,
  cancelled: 6,
} as const;

export function validateSandboxOptions(options: SandboxOptions): void {
  const sourceCount = [options.image, options.environmentId].filter(
    (source) => source !== undefined && source !== "",
  ).length;
  if (sourceCount !== 1) {
    throw new SandboxValidationError("exactly one of image or environmentId is required");
```

</details>

**依据 4 · 源码核查**：[sdk/typescript/src/sandbox/index.ts:184-204](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/sandbox/index.ts#L184-L204)

关闭RPC失败保留为AggregateError但本地身份已清。

<details>
<summary>查看原文（21行）</summary>

```text
  async close(): Promise<void> {
    const errors: unknown[] = [];
    const runId = this.runId;
    const tunnelRuntime = this.tunnelRuntime;
    this.runId = "";
    this.tunnelRuntime = undefined;
    this.currentState = undefined;
    this.currentMetadata = undefined;
    if (tunnelRuntime !== undefined) {
      await tunnelRuntime.stop().catch((error: unknown) => errors.push(error));
    }
    if (runId !== "") {
      await this.client.cancelRun(runId).catch((error: unknown) => errors.push(error));
    }
    if (this.createdEnvironment && this.environmentId !== "") {
      const environmentId = this.environmentId;
      this.environmentId = "";
      this.createdEnvironment = false;
      await this.client.deleteEnvironment(environmentId).catch((error: unknown) => errors.push(error));
    }
    if (errors.length > 0) throw new AggregateError(errors, "sandbox cleanup failed");
```

</details>

**依据 5 · 作者声明**：[docs/architecture/storage-architecture.md:9-27](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/docs/architecture/storage-architecture.md#L9-L27)

输出必须上层导出，节点/注册表所有权分开。

<details>
<summary>查看原文（19行）</summary>

```text
| Workload intent, declared-output specification, Allocations and their resource charges, placement, access grants, TunnelSessions, and Run result metadata | `controld` and PostgreSQL | Durable control state; contains no stdout or declared-output bytes |
| Writable sandbox rootfs and Allocation-local workspace | `axnoded` and node-local runtime filestore | One Allocation; no persistence promise across Allocation replacement or node loss |
| Sealed stdout/stderr and bounded declared outputs | `axnoded` node-local retention | Read-only through the Run output deadline; survives runtime cleanup and node-process restart, not node-disk loss |
| Published rootfs result | Operator-configured OCI repository; referenced by a derived Environment | Content-addressed and reusable across fresh Allocations; physical retention and unreferenced-blob GC are registry policy |
| Immutable rootfs, read-only image bundles, and image caches | `imagemgr` and `imagefsd` where required | Image-owned cache and live mount leases, separate from writable workload data |
| Allocation ownership, cleanup intent, resource state, and recovery records | `axnoded` and its process-owned embedded database | Node-local recovery; not a second shared control-plane database |

PostgreSQL is the only authoritative central state backend. Unselected bytes disappear with Allocation cleanup. Selected declared outputs and bounded logs are sealed before runtime deletion and remain readable only until the immutable output deadline. An explicitly requested successful rootfs result is instead published as an immutable OCI image and referenced by a normal Environment. Downloaded outputs belong to the caller or an upper-layer system. Object storage is never authoritative execution state or a writable POSIX working directory for an Allocation, and Axern does not define a generic public Artifact or Snapshot root.

## Allocation-Local Filesystems

`axnoded` resolves an immutable image rootfs, prepares the allocation-private writable view, and tracks runtime, image, and workspace ownership. Read-only image mounts and runtime-owned bind mounts use the same target validation, conflict checks, and Allocation cleanup boundary.

Writable rootfs storage still requires node-local Allocation charge and runsc hard enforcement. The charged scope is the runsc file-backed root overlay, including metadata, copy-up, and whiteouts; image caches, logs, and process output streams do not silently become part of that charge. See [Resource Model](resource-model.md) and the [node rootfs storage contract](../../runtime/axnoded/docs/rootfs-storage.md).

A replacement Allocation starts from immutable inputs, not from a previous writable directory. Process restart may recover an existing Allocation when its runtime and ownership records remain intact; this does not promise file retention after node loss or Allocation replacement. Declare bounded file or tar outputs before Run admission when a recovering caller must download them after termination; export them to caller-owned durable storage before expiry. The limits and ownership rules are defined in the [Stable Domain Model](../product/domain-model.md).

## Recovery And Cleanup

```

</details>

#### 缺口

- 没有安装、实际费用/工时、数据恢复和安全卸载证据，trial仅限定隔离一次性评估。
  **影响**：源码设计不能替代Linux部署、故障恢复与任务结果验收。
  **进一步探讨**：在隔离Linux/Compose环境固定精确制品与配置，按本题边界验证并保存状态/清理结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程贡献与下一步值得验证的增量是什么？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是用一条持久执行链避免SDK另造生命周期：Run和Allocation资源、绑定、能力与ensure-present在同事务形成，gateway按精确Allocation签发访问而node的生存租约不授权数据。watchdog先记录终止意图再停止，清理不确认就不释放资源。它比只在进程内记sandbox对象更容易解释故障责任，但源码存在不证明HA、网络分区和恶意边界已通过。

作者把host-safe、Linux集成、full regression与部署qualification分开，明确green PR不等于同提交post-merge full或发布资格。文档中的5/15/45分钟是维护预算，不是本轮测量。我们只抽查TypeScript门面、关键Go事务/gateway/watchdog和架构边界；没有完整阅读Go/Rust runtime、egress/DNS/TLS所有策略与三种SDK一致性。INVENTORY的JS/TS统计漏掉核心Go/Rust，生成proto与文档/SDK也会影响体量，不能用仓库统计推断实现量或可靠性。

新方向是给上层Agent适配器提供“未知结果恢复协议”：创建请求由调用方持久化唯一键，提交返回Run/Allocation对应回执；重试相同键返回同一Run；取消/超时明确区分已接收、工作负载终态、输出封存和资源释放，输出持久化由上层确认。依据是createRun响应丢失可能失去身份，以及close先清本地ID，不能靠对象状态恢复。相对已有labels/listRuns和权威Run行，这新增的是跨客户端重试的唯一性与结果验收，不是再造并行控制状态。

最小验证在服务端事务提交后丢响应、同键并发创建、取消响应丢失及客户端重启，检查只存在一个Allocation并可恢复；把删除/清理状态与已发生外部命令效果分别记录。若现有公开控制契约已有等价幂等语义、或唯一键跨namespace授权无法安全定义，应修正假设而不额外建重复账本。本版未实现该协议，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[control/controld/internal/postgres/run/run_admission.go:119-142](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/control/controld/internal/postgres/run/run_admission.go#L119-L142)

资源、能力与收敛意图同事务。

<details>
<summary>查看原文（24行）</summary>

```text
				cpu_request_milli, sandbox_memory_request_bytes, ephemeral_storage_request_bytes,
				created_at, updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, alloc.AllocationID, run.GetID(), alloc.NodeID, commonv1.AllocationLifecycleState_ALLOCATION_LIFECYCLE_STATE_BOUND.String(),
			resources.GetCpuMilli(), resources.GetMemoryBytes(), resources.GetEphemeralStorageBytes(), now.UTC(), now.UTC()); err != nil {
			return fmt.Errorf("insert allocation: %w", err)
		}
		if err := pgallocation.InsertCapabilityRequirements(ctx, tx, alloc.AllocationID, selected.CapabilityRequirements, now); err != nil {
			return err
		}
		if err := pgallocation.ScheduleReconcile(ctx, tx, allocationkernel.ScheduleReconcileRequest{
			AllocationID: alloc.AllocationID,
			Intent:       allocationkernel.ReconcileIntentEnsurePresent,
			NextRunAt:    now,
		}, now); err != nil {
			return err
		}
		return nil
	})
	if err == nil {
		s.signalReconcileWork()
	}
	return run, err
}
```

</details>

**依据 2 · 源码核查**：[gateway/gatewayd/internal/api/node/access_grant_routing.go:70-118](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/gateway/gatewayd/internal/api/node/access_grant_routing.go#L70-L118)

精确绑定和不换grant重试。

<details>
<summary>查看原文（49行）</summary>

```text
		Purpose:               purpose,
	})
	if err != nil {
		return err
	}
	if strings.TrimSpace(resolved.GetAllocationID()) != allocationID {
		return grpcstatus.Error(codes.Internal, "resolved allocation identity does not match request")
	}
	token := strings.TrimSpace(resolved.GetAccessGrant().GetPlaintextToken())
	if token == "" {
		return grpcstatus.Error(codes.Internal, "resolved allocation access grant token is empty")
	}
	if resolved.GetAccessGrant().GetExpiresAt() == nil || !time.Now().Before(resolved.GetAccessGrant().GetExpiresAt().AsTime()) {
		return grpcstatus.Error(codes.Unauthenticated, "allocation access grant has expired")
	}
	accessCtx, cancel := context.WithDeadline(ctx, resolved.GetAccessGrant().GetExpiresAt().AsTime())
	defer cancel()
	client, err := s.dialer.NodeSandbox(ctx, resolved.GetNodeTarget(), resolved.GetNodeID())
	if err != nil {
		return err
	}
	// A rejection can mean the Node has not observed this committed grant yet.
	// Reissuing inside the retry loop would advance the delivery revision and
	// replace the token the Node is waiting for, so retries keep one immutable
	// Allocation binding and one grant.
	for attempt := 1; attempt <= s.options.AccessGrantRetryAttempts; attempt++ {
		err = call(nodekernel.WithAllocationAccessGrant(accessCtx, token), client)
		if attempt == s.options.AccessGrantRetryAttempts || !shouldRetry(err) {
			return unwrapAccessGrantOpenRejection(err)
		}
		if err := nodekernel.WaitAccessGrantRetry(ctx, attempt, s.options.AccessGrantRetryDelay); err != nil {
			return err
		}
		if s.metrics != nil {
			s.metrics.AccessGrantRetry("node_sandbox")
		}
	}
	return err
}

func allocationID(msg proto.Message) string {
	field := msg.ProtoReflect().Descriptor().Fields().ByName("allocation_id")
	if field == nil {
		return ""
	}
	return strings.TrimSpace(msg.ProtoReflect().Get(field).String())
}

type accessGrantOpenRejection struct {
```

</details>

**依据 3 · 作者声明**：[docs/verification/local-full-verification.md:1-36](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/docs/verification/local-full-verification.md#L1-L36)

验证层级与预算、Linux边界。

<details>
<summary>查看原文（36行）</summary>

````text
# Verification Tiers

Verification is layered by feedback time and evidence strength. Local feedback, Linux correctness, full repository regression, and environment qualification have different owners and must not be serialized into every edit-and-merge loop. Run each required tier on the same commit and worktree.

| Tier                             | Expected feedback budget            | Merge role                                   |
| :------------------------------- | :---------------------------------- | :------------------------------------------- |
| Changed host-safe checks         | 5 minutes on a warm workspace       | Normal local gate                            |
| Selected Linux/local integration | 15 minutes for the standard CI path | Affected PR gate                             |
| Full repository regression       | 45 minutes                          | Broad-change or asynchronous post-merge gate |
| Environment qualification        | No PR feedback budget               | Frozen-candidate release/promotion gate      |

Treat these as maintainability budgets, not timeouts that weaken correctness. When a tier repeatedly exceeds its budget, split its smoke feedback from its complete evidence workflow instead of reducing the latter's sample or coverage.

## Tier 1: changed and host-safe checks

Use the change planner as the normal repository entrypoint. It prints its scope before running and never starts Compose, kind, privileged Linux, or environment qualification:

```bash
make verify-changed-plan
make verify-changed
```

Set `VERIFY_BASE=<ref>` when the comparison base is not `origin/main`. For a broad or unclassifiable source change, the planner fails safe to `make verify-fast-all`, the complete host-safe source gate. Protobuf generated output checks finish before any Go compilation.

Workflow, verification orchestration, and shared Docker build-cache changes also select `make release-check`. These paths can invalidate release and image-build contracts even without modifying release artifacts; local validation must execute those same contracts before PR CI.

Tier 1 must not start real OOM, disk-fill, or sampled performance workloads. Its normal budget is minutes. A normal pull request may merge after its selected Tier 1 checks and GitHub checks pass; it does not also require a local full gate.

Concurrency unit tests must prove overlap, ordering, and limits through explicit synchronization rather than total elapsed-time thresholds. Wall-clock deadlines may bound a stuck test, but shared-runner speed is not a correctness assertion. Release all test barriers and join workers before closing their stores or removing temporary directories.

`make network-policy-fuzz-smoke` runs all six policy, DNS, HTTP and TLS fuzz targets with an execution budget of 100,000 inputs per target, one worker and a separate two-minute hard test timeout. The input budget defines smoke completion; the timeout detects hangs and must fail the gate. Corpus seeds, discovered crashers and property assertions remain active. Execution counts do not imply identical coverage across hosts or replace longer fuzz campaigns. Do not suppress deadline errors or retry a failing target until it passes.

## Tier 2: affected Linux and local integration

Use the Linux devbox or a narrow privileged Docker verification only for an affected runtime boundary:

````

</details>

**依据 4 · 源码核查**：[sdk/typescript/src/client/index.ts:254-285](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/client/index.ts#L254-L285)

响应未知假设的公开创建基线。

<details>
<summary>查看原文（32行）</summary>

```text
  async createRun(options: CreateRunOptions): Promise<Record<string, unknown>> {
    const resources = buildResourceSpec(options);
    try {
      const response = await unary<Record<string, unknown>, { run: Record<string, unknown> }>(
        this.runControl,
        "CreateRun",
        {
          namespace: options.namespace ?? "default",
          environment_id: required("environmentId", options.environmentId),
          config: {
            argv: options.argv ?? [],
            env: options.env ?? {},
            cwd: options.cwd ?? "",
            ...(options.networkPolicy === undefined
              ? {}
              : { network: { egress_policy: options.networkPolicy.toWire() } }),
            extension_capability_requirements: (options.extensionCapabilities ?? []).map((capability) => ({
              capability: { name: capability.name, value: capability.value ?? "" },
            })),
            declared_outputs: (options.declaredOutputs ?? []).map((output) => ({
              path: output.path,
              format: output.format === "file" ? 1 : 2,
              media_type: output.mediaType ?? "",
            })),
            ...(options.rootfsSnapshot ? { rootfs_snapshot: {} } : {}),
            resources,
          },
          labels: options.labels ?? {},
        },
      );
      return response.run;
    } catch (error) {
```

</details>

**依据 5 · 源码核查**：[sdk/typescript/src/sandbox/index.ts:184-204](https://github.com/cofy-x/axern/blob/c0d8444964d21468d2e778a769570cc7b21b00ef/sdk/typescript/src/sandbox/index.ts#L184-L204)

本地对象关闭与服务端确认分离。

<details>
<summary>查看原文（21行）</summary>

```text
  async close(): Promise<void> {
    const errors: unknown[] = [];
    const runId = this.runId;
    const tunnelRuntime = this.tunnelRuntime;
    this.runId = "";
    this.tunnelRuntime = undefined;
    this.currentState = undefined;
    this.currentMetadata = undefined;
    if (tunnelRuntime !== undefined) {
      await tunnelRuntime.stop().catch((error: unknown) => errors.push(error));
    }
    if (runId !== "") {
      await this.client.cancelRun(runId).catch((error: unknown) => errors.push(error));
    }
    if (this.createdEnvironment && this.environmentId !== "") {
      const environmentId = this.environmentId;
      this.environmentId = "";
      this.createdEnvironment = false;
      await this.client.deleteEnvironment(environmentId).catch((error: unknown) => errors.push(error));
    }
    if (errors.length > 0) throw new AggregateError(errors, "sandbox cleanup failed");
```

</details>

#### 缺口

- 新幂等恢复协议未实现；本轮没有故障/性能或独立部署资格结果。
  **影响**：源码设计不能替代Linux部署、故障恢复与任务结果验收。
  **进一步探讨**：在隔离Linux/Compose环境固定精确制品与配置，按本题边界验证并保存状态/清理结果。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
