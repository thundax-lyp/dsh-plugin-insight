# OpenBitFun Agent 工作区

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[edea1ec](https://github.com/GCWing/OpenBitFun/tree/edea1ec7f268a2d13f343b699abb86e415670ff0)

<!-- BEGIN META -->
[![GitHub ★ 3,263](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C263&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GCWing/OpenBitFun)
<!-- END META -->

> **实现功能**：提供多模式Agent工作区、跨设备远程控制和可定制Mini App能力。

> **核心亮点**：[Q02](#research-q02)、[Q03](#research-q03) 运行时拥有状态投影而非前端拥有执行，使切控制端不必重发任务即可补看当前状态；集成贡献限所查路径，不以作者基准分或模式数量推导。

> **风险与缺陷**：[Q03](#research-q03) 可重连的记录不等于主机故障后继续，更不等于副作用一次且仅一次；未知结果时先回读实际状态，不能重发掩盖观察缺口。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 根产品是什么，跨设备持续任务服务谁？](#detail-section-15)
  - [Q02 · 观察订阅、运行事件与恢复怎样分离？](#detail-section-16)
  - [Q03 · 持续运行和状态恢复增加什么，关键反例是什么？](#detail-section-17)
  - [Q04 · Relay、模型和迁移的总负担支持什么采用？](#detail-section-18)
  - [Q05 · 故障矩阵能否把持续运行承诺变成可验收合同？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨电脑/手机观察长任务的个人开发者，在选定主机执行并验收成果。

远程桌面、SSH和本地主机Agent为简单参照；不采用作者DeepSWE成绩作为本轮独立任务收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 远程控制端 | 跨设备观察与批准 | 执行仍在在线主机 |
| 事件投影 | cursor/快照补看运行状态 | 可选store不等于全故障续跑 |
| 根工作区 | 提供独立Agent环境 | 非DSH插件，本轮不全量审计 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 在线执行主机与模型 | 真正运行任务 | 回主机核对状态 |
| 设备身份/Relay或独立SSH | 远程控制与目标环境 | 按具体路径确认，别混为一类 |
| 兼容数据版本和备份 | 迁移与退出 | 旧数据先副本迁移 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 独立区配置主机模型 | 用户确认目标环境 | 不带生产凭据 |
| 连接控制端并运行标记任务 | 用户核对host归属 | 目标不清先停 |
| 断观察后重连/显式停止 | 用户分别核对执行与记录 | 未知先查副作用不重发 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 主机/模型/可选Relay，未知 | 配对、权限、工作区与版本配置，未知 |
| 持续 | 模型、主机、网络与存储，未知 | 连接/凭证维护与成果验收，未知 |
| 失败恢复 | 重连/迁移/备份资源，未知 | 日志与副作用对账、主机接管，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 源码支持 | 缺口 |
|---|---|---|
| 跨端补看状态 | 订阅关闭和runtime事件快照 | 两端实际重连兼容 |
| 持续/恢复任务 | 条件持久日志与记录重建 | 主机恢复、全工具幂等和业务正确性 |

> **思考**：[Q03](#research-q03) 可重连的记录不等于主机故障后继续，更不等于副作用一次且仅一次；未知结果时先回读实际状态，不能重发掩盖观察缺口。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 运行时拥有状态投影而非前端拥有执行，使切控制端不必重发任务即可补看当前状态；集成贡献限所查路径，不以作者基准分或模式数量推导。

[Q02](#research-q02)、[Q03](#research-q03) 运行时拥有状态投影而非前端拥有执行，使切控制端不必重发任务即可补看当前状态；集成贡献限所查路径，不以作者基准分或模式数量推导。

可借鉴观察订阅与执行所有权分离、stream身份不跨进程误比较及SFTP晚到句柄清理；移植必须核对store装配和外部副作用，不把事件回放当执行重放。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 可重连的记录不等于主机故障后继续，更不等于副作用一次且仅一次；未知结果时先回读实际状态，不能重发掩盖观察缺口。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q04](#research-q04) 当前观察；两设备独立测试区先确认观察关闭不取消、显式停止有效、主机重启与未知结果可识别；不直接迁移唯一旧数据。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查订阅关闭、事件记录/恢复和一条SFTP未知结果路径；未运行或全工具审计，故障合同是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/apps/relay-server/README.md、src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs、src/crates/execution/agent-runtime/src/session_event_journal.rs、src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根独立Rust/Tauri应用；聚焦跨设备订阅/事件投影与代表SFTP路径，未审计四模式、MiniApp、全工具、加密或作者DeepSWE基准，未运行。
- 下一步：两设备执行有标记文件与长任务，分别注入控制端/Relay/host中断与结果丢失，记录重复副作用和恢复分钟；尚未执行。

**分析版本**

- **仓库**：[GCWing/OpenBitFun](https://github.com/GCWing/OpenBitFun)
- **版本号**：1.0.7（[固定提交 edea1ec](https://github.com/GCWing/OpenBitFun/tree/edea1ec7f268a2d13f343b699abb86e415670ff0)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是按控制端/网络/Relay/主机/工具结果建立恢复合同，以故障注入比较重复执行、错误完成判断和恢复时间；无改善即停止。

两设备执行有标记文件与长任务，分别注入控制端/Relay/host中断与结果丢失，记录重复副作用和恢复分钟；尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 413 | 66936 | — | — | 795303 |
| .tsx | source | 828 | 229039 | 207943 | 6083 | — |
| .ts | source | 2027 | 248141 | 208731 | 16098 | — |
| .mjs | source | 137 | 57490 | 53669 | 1210 | — |
| .mjs | test | 180 | 43079 | 38753 | 1275 | — |
| .js | source | 98 | 36095 | 32724 | 1495 | — |
| .cjs | source | 16 | 2956 | 2449 | 151 | — |
| .cjs | test | 46 | 7645 | 6600 | 563 | — |
| .tsx | test | 402 | 103171 | 92511 | 1580 | — |
| .ts | test | 828 | 144235 | 127603 | 2521 | — |
| .js | example | 30 | 9567 | 8570 | 380 | — |
| .mjs | example | 3 | 141 | 126 | 0 | — |
| .ts | example | 5 | 214 | 200 | 3 | — |
| .md | example | 11 | 751 | — | — | 5288 |
| .tsx | example | 4 | 281 | 272 | 6 | — |
| .md | test | 7 | 1809 | — | — | 8762 |

</details>

**活跃度**

[![Issue 未关闭 96](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=96&color=737b86&logo=github)](https://github.com/GCWing/OpenBitFun/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 60](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=60&color=737b86&logo=github)](https://github.com/GCWing/OpenBitFun/issues?q=is%3Aissue+created%3A2026-09-27T02%3A08%3A43.210Z..2026-10-27T02%3A08%3A43.210Z) [![近30天关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/GCWing/OpenBitFun/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A08%3A43.210Z..2026-10-27T02%3A08%3A43.210Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：聚焦独立Agent工作区的跨设备观察/执行分离、恢复记录及未知结果边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 根产品是什么，跨设备持续任务服务谁？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

这是Rust运行时、Tauri桌面与多控制端组成的独立Agent workspace，根private包1.0.7用于工程构建，不是DSH可装插件。这里聚焦需要在电脑/手机切换并查看长任务进度的个人开发者，合格结果是目标主机上的可验证成果与可重连的当前状态；不按模式、工具或MiniApp数量算任务成功。原办法是远程桌面/SSH加本地Agent进程或一直守在电脑旁。作者承诺手机只是控制器、切视图或控制端断开不停止主机任务，这应与主机断电、进程重启、网络工具失联分开。目标主机、模型、工作区权限及必要Relay/SSH连接都要先确定，不把“远程控制”当任务自动可靠办结。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-69](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/README.md#L54-L69)

作者明确控制端/执行主机与远程路径。

<details>
<summary>查看原文（16行）</summary>

```text
## Switch computers. Control from your phone.

**Switch the device, switch the entire workspace.** Choose another connected computer in the desktop app, and the interface switches to that device's sessions, workspaces, files, and task status. Move between your home computer, office computer, and server from the same app.

**Your phone is a remote controller.** Send instructions, check progress, and respond to approval requests from your phone or browser. Tasks run on the selected host and keep going when you switch views or disconnect the controller.

**On mobile, switch between layouts for one, two, or three screens.** Focus on the conversation with a single screen, then unfold your phone to view conversations and files side by side. The interface adapts as the screen layout changes.

![Switching between connected computers and remotely controlling the selected device from a phone](./png/openbitfun-multi-device.png)

<details>
<summary>Connection and deployment details</summary>

Use SSH to work on a remote host, through a jump host, or inside a container, with files, commands, and agent execution in the target environment. The desktop app and CLI share core execution capabilities; mobile clients and messaging bots offer more ways to control tasks.

Account login, synchronization, and control between devices on the same account run through a [Relay server you deploy](./src/apps/relay-server/README.md). See [Remote Connect](./docs/interactive-capabilities/capabilities/feature.remote-connect.md) and [remote workspaces](./docs/features/remote-workspaces.md) for connection options.
```

</details>

**依据 2 · 源码核查**：[package.json:1-8](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/package.json#L1-L8)

独立根工程身份与Node构建版本。

```text
{
  "name": "OpenBitFun",
  "private": true,
  "version": "1.0.7",
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
```

**依据 3 · 作者声明**：[README.md:129-135](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/README.md#L129-L135)

源构建与旧数据迁移条件。

```text
Get the Windows, macOS, or Linux package from the [official download page](https://openbitfun.com/download). Install it, configure a model, and open a workspace to get started. See the [user guide](https://playbook.openbitfun.com) for usage instructions and [download verification](./docs/verify-downloads.md) for package signature checks.

**Migration note:** OpenBitFun 1.0.0 is not data-compatible with legacy 0.2.x releases. To migrate legacy data,
use the [OpenBitFun Data Tools](src/apps/data-tools/README.md), currently available
for stable releases 0.2.17–0.2.19.

To run from source, install [Node.js](https://nodejs.org/) 22.12+, [pnpm](https://pnpm.io/) 10.15.0, the [Rust toolchain](https://rustup.rs/), and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). Clone the repository, then run:
```

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 观察订阅、运行事件与恢复怎样分离？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

controller端HostStreamSubscriber只经设备RPC read_stream/unsubscribe_stream读取在线host，close中止自己的worker并退订，没有在这条close路径调用运行取消；因此关闭观察与停止执行被分为两种责任。Runtime SessionEventJournal给事件附stream_id/cursor，保留有限tail并提供快照，客户端错过广播可按主机状态重建。record在配置store时对未终止turn追加，terminal时discard；snapshot内存无该会话时尝试load再用相同apply_event物化，未配置或无日志返回空快照。它支持重连可见性与条件性持久恢复，不能仅凭这个接口保证具体产品装配了耐故障store或进程重启自动续跑。代码注释明确持久Session把执行turn存为idle以免重启复活工作。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:1-7](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L1-L7)

controller reader与在线主机责任边界。

```text
//! Controller-side reader of one host stream. No cache and no runtime work
//! live here: every page is fetched from the online host over encrypted device
//! RPC, and closing the subscriber only stops observing that host.
use super::{
    account::{AccountClient, AccountSession, StreamHint},
    host_stream::{StreamPage, StreamReadRequest},
};
```

**依据 2 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:50-82](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L50-L82)

read/unsubscribe设备RPC。

<details>
<summary>查看原文（33行）</summary>

```text
#[async_trait::async_trait]
impl StreamTransport for DeviceRpcTransport {
    async fn read_stream(&self, request: StreamReadRequest) -> Result<StreamPage> {
        let command = serde_json::json!({
            "cmd": "read_stream",
            "stream_id": request.stream_id,
            "after": request.after,
            "before": request.before,
            "epoch": request.epoch,
            "limit": request.limit,
            "subscribe": request.subscribe,
        });
        let response = AccountClient::new()
            .device_rpc(
                &self.relay,
                &self.account,
                &self.target,
                &command.to_string(),
            )
            .await?;
        parse_stream_page(&response)
    }

    async fn unsubscribe_stream(&self, stream_id: &str) -> Result<()> {
        let command = serde_json::json!({"cmd":"unsubscribe_stream","stream_id":stream_id});
        AccountClient::new()
            .device_rpc(
                &self.relay,
                &self.account,
                &self.target,
                &command.to_string(),
            )
            .await?;
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:368-379](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L368-L379)

close只abort订阅worker和退订。

<details>
<summary>查看原文（12行）</summary>

```text
    pub fn close(&mut self) {
        self.worker.abort();
        if let Some(unsubscribe) = self.unsubscribe.take() {
            unsubscribe();
        }
    }
}

impl Drop for HostStreamSubscriber {
    fn drop(&mut self) {
        self.close();
    }
```

</details>

**依据 4 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:174-201](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/execution/agent-runtime/src/session_event_journal.rs#L174-L201)

在途日志契约与重启不自动复活工作。

<details>
<summary>查看原文（28行）</summary>

```text
/// Durable, append-only log of the executing Turn.
///
/// This log is the authority for work in flight. Everything else durable lags
/// it: client persistence is debounced into coalescing windows, and the
/// persisted Session view deliberately stores an executing Turn as idle so a
/// restart never revives work. Without this log the only complete record of a
/// running Turn dies with the Host process, and a returning client is served a
/// Turn frozen at the last checkpoint.
///
/// `append` is called for each event as it enters the ordered delivery stream —
/// one atomic event, written when it happens, not a periodic snapshot. Reload
/// replays the log through the same materialization used live, so a restored
/// projection and a live one are produced by one implementation rather than
/// two that can disagree.
pub trait SessionEventProjectionStore: Send + Sync {
    fn append(&self, session_id: &str, stream_id: &str, cursor: u64, event: &AgenticEvent);
    fn load(&self, session_id: &str) -> Option<StoredSessionEvents>;
    /// The Turn reached a terminal state; the persisted Session view owns it now.
    fn discard(&self, session_id: &str);
}

/// Cloneable owner shared by the Runtime facade and its product delivery
/// adapter. Product hosts record events only after their ordering/coalescing
/// boundary, then expose snapshots through the same `AgentRuntime` instance.
#[derive(Clone)]
pub struct SessionEventJournal {
    state: Arc<Mutex<JournalState>>,
    store: Option<Arc<dyn SessionEventProjectionStore>>,
```

</details>

**依据 5 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:281-299](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/execution/agent-runtime/src/session_event_journal.rs#L281-L299)

可选store追加/终止清理。

<details>
<summary>查看原文（19行）</summary>

```text
        if materialized {
            if let Some(store) = self.store.as_ref() {
                let session_id = event.session_id().unwrap_or_default().to_string();
                let terminal = state
                    .sessions
                    .get(&session_id)
                    .is_some_and(|projection| projection.terminal);
                // Release the lock before touching the store: an append must
                // never stall the delivery stream it is recording.
                drop(state);
                if terminal {
                    store.discard(&session_id);
                } else {
                    store.append(&session_id, &stream_id, cursor, event);
                }
                return Some(SessionEventCursor { stream_id, cursor });
            }
        }
        materialized.then_some(SessionEventCursor { stream_id, cursor })
```

</details>

**依据 6 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:333-360](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/execution/agent-runtime/src/session_event_journal.rs#L333-L360)

缺内存时load、空结果与相同物化。

<details>
<summary>查看原文（28行）</summary>

```text
    pub fn snapshot(&self, session_id: &str) -> SessionEventProjectionSnapshot {
        let state = lock_state(&self.state);
        if state.sessions.contains_key(session_id) {
            return projection_snapshot(&state, session_id);
        }
        let live_stream_id = state.stream_id.clone();
        drop(state);

        // Nothing in memory: either this Session never ran here, or this Host
        // restarted while its Turn was executing. Replay the log through the
        // same materialization used live, so a restored projection cannot
        // disagree with one built from events as they arrived. The stored
        // stream_id is preserved, so a client reads it as a different Runtime
        // process and replays it instead of comparing cursors across processes.
        let Some(stored) = self.store.as_ref().and_then(|store| store.load(session_id)) else {
            return SessionEventProjectionSnapshot {
                session_id: session_id.to_string(),
                stream_id: live_stream_id,
                cursor: 0,
                active_turn_id: None,
                events: Vec::new(),
            };
        };

        let mut projection = SessionProjection::default();
        for event in &stored.events {
            if apply_event(&mut projection, event) {
                projection.cursor = projection.cursor.saturating_add(1);
```

</details>

#### 缺口

- 未追完产品持久store具体装配及所有断开/取消入口
  **影响**：不能把局部reader行为推广成全部终端和故障恢复保证
  **进一步探讨**：选定桌面host/手机控制端，追踪store绑定及显式停止/意外断线/重启三条链并故障注入

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 持续运行和状态恢复增加什么，关键反例是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

相对仅在前端缓存进度，运行时拥有事件投影、stream身份和cursor，使控制端切换时不必重新发任务来补看结果；这是持续工作的具体集成贡献，成熟事件日志与远程RPC不当原创算法。关键反例是主机已经执行文件/外部动作但结果事件未到客户端，控制端看到旧画面便重发，可能重复副作用。journal恢复的是观察记录，不证明每个工具幂等、任务可自动重开或最终结果正确。远程SFTP的open_owned专门保留已发OPEN等回复并清理晚到句柄，注释明确不重放CREATE，说明作者在该子路径识别未知结果；不能把这处保护外推为所有工具都有一次且仅一次执行保证。断开控制器与主机故障须采用不同恢复动作。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:1-23](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/execution/agent-runtime/src/session_event_journal.rs#L1-L23)

runtime投影和有限tail/快照的增量。

<details>
<summary>查看原文（23行）</summary>

```text
//! Runtime-owned, materialized event projection for reconnecting Session clients.
//!
//! Live broadcasts are intentionally bounded and ephemeral. A GUI, TUI, or
//! remote controller can therefore miss events while it is detached without
//! affecting the Dialog Turn that continues to run. This journal keeps the
//! smallest reconstructable projection of the current Turn, independently of
//! any client subscription or client-written persistence checkpoint.

use openbitfun_events::{AgenticEvent, ToolEventData};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};
use std::sync::{Arc, Mutex, MutexGuard};

const MAX_PROJECTED_EVENTS_PER_SESSION: usize = 2048;
const MAX_RETAINED_TERMINAL_SESSION_PROJECTIONS: usize = 64;

/// How many raw materialized events stay individually replayable per Session.
///
/// This is the incremental catch-up window, deliberately separate from the
/// compacted projection above it. It only has to cover an ordinary delivery
/// gap — a network blip, a device switch, a backgrounded window — not an
/// arbitrarily long detachment; anything older is answered with a snapshot.
const MAX_REPLAYABLE_TAIL_EVENTS: usize = 1024;
```

</details>

**依据 2 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:174-187](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/execution/agent-runtime/src/session_event_journal.rs#L174-L187)

恢复记录不等于自动复活执行。

<details>
<summary>查看原文（14行）</summary>

```text
/// Durable, append-only log of the executing Turn.
///
/// This log is the authority for work in flight. Everything else durable lags
/// it: client persistence is debounced into coalescing windows, and the
/// persisted Session view deliberately stores an executing Turn as idle so a
/// restart never revives work. Without this log the only complete record of a
/// running Turn dies with the Host process, and a returning client is served a
/// Turn frozen at the last checkpoint.
///
/// `append` is called for each event as it enters the ordered delivery stream —
/// one atomic event, written when it happens, not a periodic snapshot. Reload
/// replays the log through the same materialization used live, so a restored
/// projection and a live one are produced by one implementation rather than
/// two that can disagree.
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs:62-90](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs#L62-L90)

SFTP晚到结果所有权与不重放CREATE的具体机制。

<details>
<summary>查看原文（29行）</summary>

```text
    async fn open_owned(self: &Arc<Self>, path: &str, mode: u8) -> Result<ManagedSftpFile, Error> {
        let session = self.clone();
        let path = path.to_owned();
        let (send, receive) = tokio::sync::oneshot::channel();
        // Keep OPEN alive until its reply. If the caller disappears, the
        // undelivered guard still closes a late handle. Never replay CREATE.
        tokio::spawn(async move {
            if send.is_closed() {
                return;
            }
            let result = if mode == 2 {
                use russh_sftp::protocol::OpenFlags;
                session
                    .session
                    .open_with_flags(
                        path,
                        OpenFlags::CREATE | OpenFlags::EXCLUDE | OpenFlags::WRITE,
                    )
                    .await
            } else if mode == 1 {
                session.session.create(path).await
            } else {
                session.session.open(path).await
            };
            if matches!(
                &result,
                Err(Error::Timeout
                    | Error::IO(_)
                    | Error::UnexpectedBehavior(_)
```

</details>

#### 缺口

- 未审计全部工具的未知结果/幂等策略
  **影响**：不能承诺全任务exactly-once或断电后继续
  **进一步探讨**：用可回读标记的非幂等动作注入结果丢失，先检查实际副作用再决定是否重试

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · Relay、模型和迁移的总负担支持什么采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次普通包需模型和工作区；源码构建还需Node22.12+、pnpm、Rust/Tauri环境。跨设备还需账户/设备配对与主机在线，SSH/Docker另有权限和运行环境。固定README写“你部署的Relay”，但更具体relay文档说官方端点用户不需部署，局域模式仍经官方GitHub身份核验，自托管私有端点需匹配客户端构建；因此部署要求存在文档口径差异，不能给读者承诺任意URL即插即用或完全离线。持续成本是模型调用、主机/Relay资源、网络、凭证和成果验收；恢复需核对日志、目标文件及工具副作用。旧0.2.x与1.0数据不兼容，指定稳定版本有独立迁移工具，不能直接原地覆盖。费用、等待和恢复分钟未测，当前观察，先独立测试工作区验证重连/停止/备份，再考虑主环境。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-69](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/README.md#L67-L69)

根部署概述。

```text
Use SSH to work on a remote host, through a jump host, or inside a container, with files, commands, and agent execution in the target environment. The desktop app and CLI share core execution capabilities; mobile clients and messaging bots offer more ways to control tasks.

Account login, synchronization, and control between devices on the same account run through a [Relay server you deploy](./src/apps/relay-server/README.md). See [Remote Connect](./docs/interactive-capabilities/capabilities/feature.remote-connect.md) and [remote workspaces](./docs/features/remote-workspaces.md) for connection options.
```

**依据 2 · 作者声明**：[src/apps/relay-server/README.md:3-16](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/apps/relay-server/README.md#L3-L16)

具体Relay官方端点与在线主机说明。

<details>
<summary>查看原文（14行）</summary>

```text
The official Relay connects devices signed in to the same GitHub identity.
GitHub identity is shared with the marketplaces. Users sign in
from OpenBitFun; they do not create a Relay account or deploy a server.

The official endpoint is `https://remote.openbitfun.com/v/1.0.2`. This release is deployed with
its own process, database, assets, and reverse-proxy location. An existing
`/relay` deployment remains on its existing binary and data directory.

The Relay forwards opaque encrypted messages. Each device generates an X25519
private key locally and registers its public key after GitHub identity
verification. Peers obtain public keys through the authenticated same-account
directory and derive an AES-GCM key with X25519 and HKDF-SHA256. The Relay does
not receive device private keys or upload copies of settings and sessions.
Sessions and files are read from the owning online device on demand.
```

</details>

**依据 3 · 作者声明**：[src/apps/relay-server/README.md:26-37](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/apps/relay-server/README.md#L26-L37)

身份联网、自托管需要匹配构建。

<details>
<summary>查看原文（12行）</summary>

```text
Both modes verify GitHub identity through `auth.openbitfun.com`, so signing in
requires internet access. An invitation contains only the selected endpoint
and device id (`/#/pair?did=<device-id>`); scanning it grants no authority.
The controller must sign in and resolve that id in its same-account directory.
Anonymous room pairing and tunnel-provider startup have been removed.

SSH and Docker workspace connections remain independent of Relay login.

## For community developers and forks

Self-hosting is supported through source and deployment scripts. The public mode uses a fixed official endpoint; it has no deployment wizard or editable
Relay URL. A private Relay therefore needs a matching client build.
```

</details>

**依据 4 · 作者声明**：[README.md:129-135](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/README.md#L129-L135)

构建与迁移限制。

```text
Get the Windows, macOS, or Linux package from the [official download page](https://openbitfun.com/download). Install it, configure a model, and open a workspace to get started. See the [user guide](https://playbook.openbitfun.com) for usage instructions and [download verification](./docs/verify-downloads.md) for package signature checks.

**Migration note:** OpenBitFun 1.0.0 is not data-compatible with legacy 0.2.x releases. To migrate legacy data,
use the [OpenBitFun Data Tools](src/apps/data-tools/README.md), currently available
for stable releases 0.2.17–0.2.19.

To run from source, install [Node.js](https://nodejs.org/) 22.12+, [pnpm](https://pnpm.io/) 10.15.0, the [Rust toolchain](https://rustup.rs/), and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). Clone the repository, then run:
```

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 故障矩阵能否把持续运行承诺变成可验收合同？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为控制端关闭、网络断开、Relay重启、host进程重启和工具结果丢失分别记录“执行是否继续/能否观察/是否允许重试”，在重连时显示明确未知结果并提供副作用回读入口。推导来自Q02的观察/执行分离与Q03未知结果保护差异；增量是用户可以选择正确恢复，而不是增加一个远程通道。最小验证同一有标记文件动作和可取消长任务，逐类注入故障，对比现界面和合同说明的重复执行、错误完成判断、恢复分钟。无误判减少或增加不可维护状态便停止；不把假设计为已有可靠性或市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:368-379](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L368-L379)

观察关闭接口是矩阵中的一个明确故障类别。

<details>
<summary>查看原文（12行）</summary>

```text
    pub fn close(&mut self) {
        self.worker.abort();
        if let Some(unsubscribe) = self.unsubscribe.take() {
            unsubscribe();
        }
    }
}

impl Drop for HostStreamSubscriber {
    fn drop(&mut self) {
        self.close();
    }
```

</details>

**依据 2 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:333-360](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/execution/agent-runtime/src/session_event_journal.rs#L333-L360)

恢复/空快照分支需要给用户可解释语义。

<details>
<summary>查看原文（28行）</summary>

```text
    pub fn snapshot(&self, session_id: &str) -> SessionEventProjectionSnapshot {
        let state = lock_state(&self.state);
        if state.sessions.contains_key(session_id) {
            return projection_snapshot(&state, session_id);
        }
        let live_stream_id = state.stream_id.clone();
        drop(state);

        // Nothing in memory: either this Session never ran here, or this Host
        // restarted while its Turn was executing. Replay the log through the
        // same materialization used live, so a restored projection cannot
        // disagree with one built from events as they arrived. The stored
        // stream_id is preserved, so a client reads it as a different Runtime
        // process and replays it instead of comparing cursors across processes.
        let Some(stored) = self.store.as_ref().and_then(|store| store.load(session_id)) else {
            return SessionEventProjectionSnapshot {
                session_id: session_id.to_string(),
                stream_id: live_stream_id,
                cursor: 0,
                active_turn_id: None,
                events: Vec::new(),
            };
        };

        let mut projection = SessionProjection::default();
        for event in &stored.events {
            if apply_event(&mut projection, event) {
                projection.cursor = projection.cursor.saturating_add(1);
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs:62-90](https://github.com/GCWing/OpenBitFun/blob/edea1ec7f268a2d13f343b699abb86e415670ff0/src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs#L62-L90)

未知CREATE结果不重放可作具体恢复对照。

<details>
<summary>查看原文（29行）</summary>

```text
    async fn open_owned(self: &Arc<Self>, path: &str, mode: u8) -> Result<ManagedSftpFile, Error> {
        let session = self.clone();
        let path = path.to_owned();
        let (send, receive) = tokio::sync::oneshot::channel();
        // Keep OPEN alive until its reply. If the caller disappears, the
        // undelivered guard still closes a late handle. Never replay CREATE.
        tokio::spawn(async move {
            if send.is_closed() {
                return;
            }
            let result = if mode == 2 {
                use russh_sftp::protocol::OpenFlags;
                session
                    .session
                    .open_with_flags(
                        path,
                        OpenFlags::CREATE | OpenFlags::EXCLUDE | OpenFlags::WRITE,
                    )
                    .await
            } else if mode == 1 {
                session.session.create(path).await
            } else {
                session.session.open(path).await
            };
            if matches!(
                &result,
                Err(Error::Timeout
                    | Error::IO(_)
                    | Error::UnexpectedBehavior(_)
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
