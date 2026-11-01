# OpenBitFun Agent 工作区

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2644c2e](https://github.com/GCWing/OpenBitFun/tree/2644c2ed3c5d0701341d22a14018c12f62c1115e)

<!-- BEGIN META -->
[![GitHub ★ 3,423](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C423&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GCWing/OpenBitFun)
<!-- END META -->

> **功能**：独立 Agent 工作区，支持跨设备控制和可选 DSH 客户端。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多设备控制与主机事件投影组合；实际节时及恢复成功率未验证。

> **主要限制**：[Q03](#research-q03) 未知写入不能自动视为失败，[Q05](#research-q05) 文档对 Relay 部署存在冲突。

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
  - [Q01 · 跨设备的长任务工作区满足什么需求，替代是什么？](#detail-section-11)
  - [Q02 · 控制端切换后如何跟进主机流，旧游标或断线如何处理？](#detail-section-12)
  - [Q03 · 未知结果的远端文件操作是否可以直接重试？](#detail-section-13)
  - [Q04 · DSH 如何作为可选客户端接入，版本声明的边界是什么？](#detail-section-14)
  - [Q05 · Relay、身份及迁移有哪些采用边界？](#detail-section-15)
  - [Q06 · 如何在断线后减少未知写入被重复执行或误判完成？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者希望在选定主机运行长任务，从电脑或手机查看状态与处理审批。

SSH、终端复用器和日志也可远程观察长任务，需同任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 会话观察 | 订阅主机事件 | 在线主机、身份和设备 RPC |
| 投影回填 | 连续时读取尾部 | gap 需快照，重启不复活任务 |
| DSH 客户端 | 可选启动 ACP profile | 依赖安装与版本条件 |

**流程与依赖**

| 条件 | 是否必需 | 用途 | 失败处理 |
|---|---|---|---|
| 主机和工作区 | 任务执行需要 | 执行与保存任务 | 主机离线不能远程读取 |
| Relay 与同账号身份 | 跨设备模式按文档需要 | 发现设备与 RPC | 身份不可用需核实部署模式 |
| DSH 及构建 profile | 仅 DSH 客户端需要 | 启动可选 ACP 桥 | 切换其他客户端或停止 |
| Node、pnpm、Rust、Tauri | 从源码构建时需要 | 构建桌面工作区 | 构建可能失败 |

| 步骤 | 动作 | 检查与退路 |
|---|---|---|
| 准备 | 使用隔离账号和非敏感工作区 | 核实主机和 Relay 连接路径 |
| 执行 | 启动低风险可回滚任务 | 记录任务、主机和预期结果 |
| 观察 | 断开后重新连接查看游标和状态 | gap 或未知状态需回读 |
| 恢复 | 核实目标文件再决定后续操作 | 不能确认则暂停，不盲目重发 |

**效果与成本**

| 阶段 | 资源与现金 | 人工成本 | 未知 |
|---|---|---|---|
| 首次 | 主机、身份、构建和网络成本 | 配置设备和模型 | 费用与文档冲突待核实 |
| 持续 | 主机在线、网络与模型费用 | 审批和结果核对 | 可靠性与节时未测 |
| 恢复 | 持久存储与可能的回读成本 | 判断未知副作用 | 回滚和恢复时长未知 |

| 效果 | 已查支持 | 未证实 |
|---|---|---|
| 远程观察 | 主机 RPC 分页与订阅 | 离线主机也可恢复 |
| 重连 | 连续回填与缺口处理 | 原任务自动继续或恰好一次 |
| DSH | 可选 profile 客户端 | 其他 DSH 版本实际兼容 |

> **思考**：[Q03](#research-q03) 未知写入不能自动视为失败，[Q05](#research-q05) 文档对 Relay 部署存在冲突。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多设备控制与主机事件投影组合；实际节时及恢复成功率未验证。

[Q02](#research-q02) 区分观察关闭与任务取消，[Q03](#research-q03) 不将日志恢复等同副作用去重。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 未知写入不能自动视为失败，[Q05](#research-q05) 文档对 Relay 部署存在冲突。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先以隔离账号和可回滚任务验证；Relay 端点、身份、数据迁移或未知副作用不能核实时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本的代表性源码与文档已查；未运行跨设备、DSH、Relay 或恢复流程。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs、src/crates/execution/agent-runtime/src/session_event_journal.rs、src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs、src/crates/interfaces/acp/src/client/builtin_clients.rs、src/crates/interfaces/acp/src/client/dsh_profile.rs、packages/dsh-acp/scripts/build-profile.mjs、packages/dsh-acp/package.json、src/apps/relay-server/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交根 README、版本清单、控制端事件订阅、会话日志、SFTP 清理、可选 DSH 客户端及 Relay 文档；未执行目标代码，未穷尽四模式、工具、权限、加密实现或迁移。清单采用扩展名范围，排除项需单独复核，不能代表全仓代码。
- 下一步：在隔离双设备和 SSH 对照下测试连接、主机重启、游标 gap、结果丢失与 SFTP 回读，并依 [Q06](#research-q06) 测量重复写入和误判。

**分析版本**

- **仓库**：[GCWing/OpenBitFun](https://github.com/GCWing/OpenBitFun)
- **版本号**：1.0.8（[固定提交 2644c2e](https://github.com/GCWing/OpenBitFun/tree/2644c2ed3c5d0701341d22a14018c12f62c1115e)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设可回读的持久操作收据能减少误判和重复写入，尚未实现或验证。

在隔离双设备和 SSH 对照下测试连接、主机重启、游标 gap、结果丢失与 SFTP 回读，并依 [Q06](#research-q06) 测量重复写入和误判。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 419 | 69079 | — | — | 824266 |
| .tsx | source | 867 | 232799 | 211528 | 6180 | — |
| .ts | source | 2087 | 253407 | 213242 | 16527 | — |
| .mjs | source | 138 | 57446 | 53616 | 1219 | — |
| .mjs | test | 183 | 43575 | 39229 | 1281 | — |
| .js | source | 98 | 36170 | 32781 | 1508 | — |
| .cjs | source | 16 | 2956 | 2449 | 151 | — |
| .cjs | test | 47 | 7712 | 6660 | 563 | — |
| .tsx | test | 435 | 111548 | 100400 | 1666 | — |
| .ts | test | 861 | 148349 | 131269 | 2631 | — |
| .js | example | 30 | 9646 | 8633 | 390 | — |
| .mjs | example | 3 | 141 | 126 | 0 | — |
| .ts | example | 5 | 214 | 200 | 3 | — |
| .md | example | 11 | 760 | — | — | 5417 |
| .tsx | example | 4 | 281 | 272 | 6 | — |
| .md | test | 7 | 1843 | — | — | 9015 |

</details>

**活跃度**

[![Issue 未关闭 104](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=104&color=737b86&logo=github)](https://github.com/GCWing/OpenBitFun/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 66](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=66&color=737b86&logo=github)](https://github.com/GCWing/OpenBitFun/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/GCWing/OpenBitFun/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨设备会话观察、写入不确定性、DSH 可选接入及采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨设备的长任务工作区满足什么需求，替代是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:54-58 描述开发者在电脑、手机或浏览器查看选定主机的会话并处理审批，任务在主机执行；这是作者的产品陈述。与 SSH 加终端复用器、手工重新查看日志的基线相比，它尝试把远程会话、文件和任务状态放进同一界面，价值取决于跨设备恢复是否节省人工且不误判；没有同任务对照。它是独立的 Agent 工作区，不是必须加载到 DSH 的插件；DSH 是可选客户端之一。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-58](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/README.md#L54-L58)

作者描述多设备观察与任务执行。

```text
## Switch computers. Control from your phone.

**Switch the device, switch the entire workspace.** Choose another connected computer in the desktop app, and the interface switches to that device's sessions, workspaces, files, and task status. Move between your home computer, office computer, and server from the same app.

**Your phone is a remote controller.** Send instructions, check progress, and respond to approval requests from your phone or browser. Tasks run on the selected host and keep going when you switch views or disconnect the controller.
```

**依据 2 · 源码核查**：[package.json:1-7](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/package.json#L1-L7)

独立项目包名与版本。

```text
{
  "name": "OpenBitFun",
  "private": true,
  "version": "1.0.8",
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
```

#### 缺口

- 未验证跨设备任务、SSH 基线和收益
  **影响**：无法量化节时、完成率或误判断
  **进一步探讨**：固定任务比较 SSH 终端复用和工作区。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 控制端切换后如何跟进主机流，旧游标或断线如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host_stream_subscriber.rs:1-3、145-188 由在线主机经设备 RPC 读取分页、使用 cursor 增量同步；195-229 发现 epoch 改变发出 gap，并从最新页面重新读。368-372 关闭订阅中止观察 worker 并发 unsubscribe，不能由此推定取消执行。session_event_journal.rs:109-136 对连续尾部回填，否则拒绝推断；146-159 规定无法连续或进程换代时需快照，174-201 的持久 store 可选，重启不复活运行中任务。不可把客户端接回、事件留存或 Rust 接口当作运行时持久化一定生效和任务执行一次的保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:1-3](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L1-L3)

控制端只观察在线主机。

```text
//! Controller-side reader of one host stream. No cache and no runtime work
//! live here: every page is fetched from the online host over encrypted device
//! RPC, and closing the subscriber only stops observing that host.
```

**依据 2 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:145-188](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L145-L188)

分页 cursor 与增量读取。

<details>
<summary>查看原文（44行）</summary>

```text
    /// Latest page first, like opening a chat at its bottom.
    async fn resync(&mut self) -> Result<()> {
        let page = self
            .read(StreamReadRequest {
                stream_id: self.session_id.clone(),
                subscribe: true,
                ..Default::default()
            })
            .await?;
        self.epoch = page.epoch;
        self.cursor = page.cursor;
        self.oldest = page
            .events
            .first()
            .map(|event| event.seq)
            .unwrap_or(page.cursor + 1);
        self.has_more = page.has_more;
        self.emit_page(&page)?;
        self.emit_ready()
    }

    /// Returns false when the host restarted the stream and a resync is needed.
    async fn catch_up(&mut self) -> Result<bool> {
        loop {
            let page = self
                .read(StreamReadRequest {
                    stream_id: self.session_id.clone(),
                    after: Some(self.cursor),
                    epoch: Some(self.epoch),
                    subscribe: true,
                    ..Default::default()
                })
                .await?;
            if page.epoch != self.epoch {
                return Ok(false);
            }
            self.emit_page(&page)?;
            if let Some(last) = page.events.last() {
                self.cursor = self.cursor.max(last.seq);
            }
            if !page.has_more {
                // The host's newest sequence may belong to an evicted control
                // event; adopt it so the next hint compares against it.
                self.cursor = self.cursor.max(page.cursor);
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:195-229](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L195-L229)

更换 epoch 与 gap。

<details>
<summary>查看原文（35行）</summary>

```text
    /// restarted the stream is announced as a gap and replayed from its latest page.
    async fn refresh(&mut self) -> Result<()> {
        if self.catch_up().await? {
            return Ok(());
        }
        self.gap("host stream restarted")?;
        self.resync().await
    }

    async fn load_older(&mut self) -> Result<bool> {
        if !self.has_more {
            return Ok(true);
        }
        let page = self
            .read(StreamReadRequest {
                stream_id: self.session_id.clone(),
                before: Some(self.oldest),
                epoch: Some(self.epoch),
                subscribe: true,
                ..Default::default()
            })
            .await?;
        if page.epoch != self.epoch {
            return Ok(false);
        }
        self.emit_page(&page)?;
        if let Some(first) = page.events.first() {
            self.oldest = first.seq;
        }
        self.has_more = page.has_more;
        self.emit_ready()?;
        Ok(true)
    }

    fn gap(&self, reason: &str) -> Result<()> {
```

</details>

**依据 4 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:368-372](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L368-L372)

关闭本地观察与退订。

```text
    pub fn close(&mut self) {
        self.worker.abort();
        if let Some(unsubscribe) = self.unsubscribe.take() {
            unsubscribe();
        }
```

**依据 5 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:109-136](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/execution/agent-runtime/src/session_event_journal.rs#L109-L136)

连续尾部才可增量回填。

<details>
<summary>查看原文（28行）</summary>

```text
        while self.tail.len() > MAX_REPLAYABLE_TAIL_EVENTS {
            self.tail.pop_front();
        }
    }

    /// Events after `cursor`, or `None` when the retained tail cannot prove it
    /// is contiguous with what the client already applied.
    fn tail_since(&self, cursor: u64) -> Option<Vec<AgenticEvent>> {
        if cursor > self.cursor {
            // A cursor ahead of this stream's own progress is not a gap this
            // journal can reason about.
            return None;
        }
        if cursor == self.cursor {
            return Some(Vec::new());
        }
        // The client's next expected event must still be retained; if the
        // oldest entry is newer than that, the events between were dropped.
        match self.tail.front() {
            Some(oldest) if oldest.cursor <= cursor.saturating_add(1) => Some(
                self.tail
                    .iter()
                    .filter(|entry| entry.cursor > cursor)
                    .map(|entry| entry.event.clone())
                    .collect(),
            ),
            _ => None,
        }
```

</details>

**依据 6 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:146-159](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/execution/agent-runtime/src/session_event_journal.rs#L146-L159)

不能连续则要求快照。

<details>
<summary>查看原文（14行）</summary>

```text
/// Everything a client missed after a cursor it already applied.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "kind")]
pub enum SessionEventBackfill {
    /// Contiguous with the client's cursor: apply these in order and it is
    /// caught up, with no snapshot and no projection rebuild.
    Delta {
        stream_id: String,
        cursor: u64,
        events: Vec<AgenticEvent>,
    },
    /// The client's cursor predates the retained tail, or belongs to an older
    /// Runtime process. Only a full snapshot can restore it.
    SnapshotRequired,
```

</details>

**依据 7 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:174-201](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/execution/agent-runtime/src/session_event_journal.rs#L174-L201)

运行中事件日志与可选 store。

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

#### 缺口

- 未演练控制端断线、主机崩溃与存储丢失
  **影响**：无法断言全链恢复和副作用是否重复
  **进一步探讨**：隔离主机故障注入并核对任务和实际文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 未知结果的远端文件操作是否可以直接重试？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

sftp_file.rs:62-106 将 OPEN 保持到应答，调用者离开时仍处理迟到句柄；CREATE 不重放，超时或异常时退役该 SFTP channel 以回收可能的未知句柄。132-141 析构时异步 shutdown，失败则退役会话。这是代表性资源清理与不重放保护，不证明任何远端 CREATE 一定失败，也不证明整个任务的副作用恰好一次；用户应先回读目标状态再决定重试，不能以事件流重连当做写入成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs:62-106](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs#L62-L106)

OPEN 所有权、禁止 CREATE 重放与超时退役。

<details>
<summary>查看原文（45行）</summary>

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
                    | Error::UnexpectedPacket)
            ) {
                // A timed-out OPEN may have succeeded remotely without a known
                // handle; retire only this SFTP channel to reclaim that handle.
                session.retire().await;
            }
            let result = result.map(|file| ManagedSftpFile {
                file: Some(file),
                session,
                runtime: tokio::runtime::Handle::current(),
            });
            let _ = send.send(result);
        });
        receive
            .await
            .map_err(|_| Error::UnexpectedBehavior("SFTP open owner stopped".into()))?
```

</details>

**依据 2 · 源码核查**：[src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs:132-141](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs#L132-L141)

延迟关闭失败时退役 SFTP 会话。

<details>
<summary>查看原文（10行）</summary>

```text
impl Drop for ManagedSftpFile {
    fn drop(&mut self) {
        if let Some(mut file) = self.file.take() {
            let session = self.session.clone();
            self.runtime.spawn(async move {
                if let Err(error) = file.shutdown().await {
                    log::warn!("SFTP file cleanup failed; retiring subsystem: {}", error);
                    session.retire().await;
                }
            });
```

</details>

**依据 3 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:174-181](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/execution/agent-runtime/src/session_event_journal.rs#L174-L181)

会话恢复不复活运行中任务。

```text
/// Durable, append-only log of the executing Turn.
///
/// This log is the authority for work in flight. Everything else durable lags
/// it: client persistence is debounced into coalescing windows, and the
/// persisted Session view deliberately stores an executing Turn as idle so a
/// restart never revives work. Without this log the only complete record of a
/// running Turn dies with the Host process, and a returning client is served a
/// Turn frozen at the last checkpoint.
```

#### 缺口

- 未实际模拟 CREATE 成功但响应丢失
  **影响**：无法证实实际文件状态及重复副作用
  **进一步探讨**：模拟响应丢失，检查远端文件与句柄。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · DSH 如何作为可选客户端接入，版本声明的边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

builtin_clients.rs:45-57 注册 dsh 与 --profile openbitfun-acp；dsh_profile.rs:1-11 描述将打包 bridge 拷入用户已有 DSH 安装并复用其配置，65-83 按 stamp 和最小版本校验。build-profile.mjs:37-56 声明最低 0.1.0-rc.6，ACP SDK 0.25.1 和 spine rc.6 固定；独立 bridge 的 package.json:34-45 声明 Node ^22.19 或 >=24。dsh_profile.rs:123-138、164-174 对无法探测或解析的 DSH 版本放行，因此最小版本检查不是兼容证明，最低版本也不构成所有后续版本的兼容保证。只研究本仓库的接入代码，未引用外部 DSH 实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/interfaces/acp/src/client/builtin_clients.rs:45-57](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/interfaces/acp/src/client/builtin_clients.rs#L45-L57)

内置 DSH 命令和 profile。

<details>
<summary>查看原文（13行）</summary>

```text
    // so OpenBitFun ships one as a dsh PROFILE (packages/dsh-acp) and launches it
    // through the user's own installation. The model and the API key stay in
    // dsh, where the user configured them; OpenBitFun stores neither. Installable
    // from npm like codex, hence install_package; native ACP, hence no adapter.
    BuiltinAcpClientPreset {
        id: "dsh",
        command: "dsh",
        args: &["--profile", DSH_BUNDLED_PROFILE],
        tool_command: "dsh",
        install_package: Some("@deepseek-ai/dsh"),
        adapter_package: None,
        adapter_bin: None,
        bundled_profile: Some(DSH_BUNDLED_PROFILE),
```

</details>

**依据 2 · 源码核查**：[src/crates/interfaces/acp/src/client/dsh_profile.rs:1-11](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/interfaces/acp/src/client/dsh_profile.rs#L1-L11)

复用已有 DSH 的 profile 机制。

<details>
<summary>查看原文（11行）</summary>

```text
//! Materialize the bundled DeepSeek Harness bridge into the user's dsh install.
//!
//! OpenBitFun ships a compiled ACP bridge, but it does not ship a harness: `dsh` is
//! a profile launcher, and a profile is just a directory under
//! `$DSH_HOME/profiles/`. So instead of publishing the bridge to a registry, we
//! copy the built profile next to the harness the user already installed and
//! launch it with `dsh --profile openbitfun-acp`. Every `@deepseek-ai/dsh-*` row in
//! that profile resolves out of the user's own installation through the flat
//! `profiles/node_modules` fallback the launcher maintains, so nothing here
//! installs a second harness, and the user's model and credentials — which live
//! in dsh, not in OpenBitFun — apply unchanged.
```

</details>

**依据 3 · 源码核查**：[src/crates/interfaces/acp/src/client/dsh_profile.rs:65-83](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/interfaces/acp/src/client/dsh_profile.rs#L65-L83)

按 stamp 和最低版本检查。

<details>
<summary>查看原文（19行）</summary>

```text
/// Copy the bundled profile into the user's dsh install if it is not there yet.
///
/// Returns the profile directory the launcher will boot. Errors are the ones
/// worth stopping for: no bundled profile to copy, a dsh too old to run it, or
/// a filesystem that refused the write — each of which would otherwise surface
/// as `dsh` complaining about a profile that does not exist, or as a pile of
/// module resolution failures with no hint about the cause.
pub(crate) async fn ensure_bundled_profile(profile: &str) -> OpenBitFunResult<PathBuf> {
    let (source, stamp) = bundled_build(profile)?;

    // Checked on every launch, not just when copying: the pairing can break
    // later by the user downgrading dsh under a profile that is already current.
    require_supported_dsh(&stamp.min_dsh_version).await?;

    let destination = dsh_profiles_directory()?.join(profile);
    if read_stamp(&destination)
        .ok()
        .flatten()
        .is_some_and(|installed| installed.content == stamp.content)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-acp/scripts/build-profile.mjs:37-56](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/packages/dsh-acp/scripts/build-profile.mjs#L37-L56)

最低 DSH 和桥依赖版本。

<details>
<summary>查看原文（20行）</summary>

```text
/** The profile directory OpenBitFun materializes this build into. */
export const PROFILE_NAME = 'openbitfun-acp'

/**
 * The oldest `@deepseek-ai/dsh` this build is known to boot against. The bridge
 * compiles against harness APIs; an older installation resolves the closure to
 * packages this code predates, and the failure would otherwise surface as a
 * module or service error with no hint about the cause.
 */
const MIN_DSH_VERSION = '0.1.0-rc.6'

/**
 * The only two runtime packages the harness installation does NOT already
 * expose: the ACP wire SDK (not a harness dependency at all) and the agent
 * spine, which ships as an examples package outside the `dsh` closure. Pinned,
 * because they must agree with the harness train named above.
 */
const VENDORED = {
  '@agentclientprotocol/sdk': '0.25.1',
  '@deepseek-ai/dsh-agent-spine-demo': '0.1.0-rc.6',
```

</details>

**依据 5 · 源码核查**：[packages/dsh-acp/package.json:34-45](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/packages/dsh-acp/package.json#L34-L45)

bridge Node 与依赖声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "link:dsh": "node scripts/link-local-dsh.mjs",
    "build": "tsc -p tsconfig.build.json",
    "start": "node --import tsx src/bin.ts --config ./cordis.yml",
    "test": "vitest run"
  },
  "dependencies": {
    "@agentclientprotocol/sdk": "0.25.1",
    "@deepseek-ai/dsh-agent-spine-demo": "0.1.0-rc.6"
```

</details>

**依据 6 · 源码核查**：[src/crates/interfaces/acp/src/client/dsh_profile.rs:123-138](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/interfaces/acp/src/client/dsh_profile.rs#L123-L138)

缺失版本探测时不阻断。

<details>
<summary>查看原文（16行）</summary>

```text
/// Fail with an actionable message when the installed dsh predates this build.
///
/// A dsh we cannot find, or whose version we cannot parse, is not treated as a
/// failure here: a missing `dsh` already surfaces as an install prompt in the
/// agent list, and guessing about an unrecognized version string would block a
/// launch that may well work.
async fn require_supported_dsh(minimum: &str) -> OpenBitFunResult<()> {
    let Some(installed) = probe_executable("dsh").await.version else {
        return Ok(());
    };
    if version_is_supported(&installed, minimum) {
        return Ok(());
    }
    Err(OpenBitFunError::service(format!(
        "DeepSeek Harness {installed} is older than {minimum}, which this OpenBitFun build requires. \
         Update it with `npm install -g @deepseek-ai/dsh`."
```

</details>

**依据 7 · 源码核查**：[src/crates/interfaces/acp/src/client/dsh_profile.rs:164-174](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/interfaces/acp/src/client/dsh_profile.rs#L164-L174)

解析失败视为通过。

<details>
<summary>查看原文（11行）</summary>

```text
/// Whether `installed` is new enough for a build that needs `minimum`.
///
/// Unparsable on either side means "assume yes" — see the caller.
fn version_is_supported(installed: &str, minimum: &str) -> bool {
    let Ok(minimum) = semver::Version::parse(minimum.trim_start_matches('v')) else {
        return true;
    };
    let Ok(installed) = semver::Version::parse(installed.trim().trim_start_matches('v')) else {
        return true;
    };
    installed >= minimum
```

</details>

#### 缺口

- 未在 rc.6 或其他 DSH 版本及远程主机实测
  **影响**：不能断言新旧 DSH 兼容、桥打包和远程会话正常
  **进一步探讨**：固定 DSH 和 Node 版本验证 profile 解析、会话及升级。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Relay、身份及迁移有哪些采用边界？

**研究主题**：效果与总成本、采用判断

#### 完整回答

根 README:67-69 说同账号设备控制需用户部署 Relay；而同提交 relay-server/README.md:3-29 说官方模式不必用户部署，提供固定官方端点和同网内建 Relay，两种登录仍依赖互联网 GitHub 身份；同文件 34-60 又指出私有 Relay 需匹配客户端构建。两份文档冲突，静态检查不判定运行默认路径或生产配置。README:129-135 声明 1.0.0 不与旧 0.2.x 数据兼容，并给 Node、pnpm、Rust 与 Tauri 构建条件；未验证迁移、Relay 隐私或部署。作者加密陈述不构成密码审计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-69](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/README.md#L67-L69)

根文档声称自部署 Relay。

```text
Use SSH to work on a remote host, through a jump host, or inside a container, with files, commands, and agent execution in the target environment. The desktop app and CLI share core execution capabilities; mobile clients and messaging bots offer more ways to control tasks.

Account login, synchronization, and control between devices on the same account run through a [Relay server you deploy](./src/apps/relay-server/README.md). See [Remote Connect](./docs/interactive-capabilities/capabilities/feature.remote-connect.md) and [remote workspaces](./docs/features/remote-workspaces.md) for connection options.
```

**依据 2 · 作者声明**：[src/apps/relay-server/README.md:3-29](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/apps/relay-server/README.md#L3-L29)

Relay 文档的官方、同网和身份陈述。

<details>
<summary>查看原文（27行）</summary>

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

Selecting **Same network** starts the same Relay implementation inside the
Desktop host at `http://<LAN-IP>:9700`. Its SQLite database is local to that
host (`<product-home>/relay-v1.0.0/local-server/relay.db`), separate from the
official server database. Login, device registration, device discovery,
public-key lookup, RPC and presence all use the selected Relay endpoint.
The two modes differ only in endpoint and host startup; no device traffic is
forwarded from the local Relay to the official Relay.

Both modes verify GitHub identity through `auth.openbitfun.com`, so signing in
requires internet access. An invitation contains only the selected endpoint
and device id (`/#/pair?did=<device-id>`); scanning it grants no authority.
The controller must sign in and resolve that id in its same-account directory.
```

</details>

**依据 3 · 作者声明**：[src/apps/relay-server/README.md:34-60](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/apps/relay-server/README.md#L34-L60)

自建需匹配客户端与身份配置。

<details>
<summary>查看原文（27行）</summary>

```text
## For community developers and forks

Self-hosting is supported through source and deployment scripts. The public mode uses a fixed official endpoint; it has no deployment wizard or editable
Relay URL. A private Relay therefore needs a matching client build.

1. Fork this workspace and read `CONTRIBUTING.md`. Build the Relay and mobile
   controller from the same revision. Keep your fork's changes in source control.
2. Select your HTTPS endpoint in `product-domains/src/account.rs`, then align
   the frontend constants in `src/web-ui/src/infrastructure/remote-connect/remoteConnectionState.ts`
   and `src/mobile-web/src/services/pairingLink.ts`. Native clients have
   matching constants in KMP `core-transport/AccountDeviceLink.kt` and HarmonyOS
   `services/AccountDeviceLink.ets`; update the HarmonyOS account-link parser too.
   Search for `https://remote.openbitfun.com/v/1.0.2` to verify every runtime
   reference and corresponding test before building your distribution.
3. Decide who owns identity. You can retain the official GitHub identity
   authority, or run the [shared identity service](../../../deploy/miniapp-market/README.md)
   with your own GitHub OAuth application. For an independent authority, change
   `IDENTITY_ME_URL` in `relay-service/src/identity.rs` and
   `DEFAULT_ACCOUNT_API_URL` in `services-integrations/src/account_identity/mod.rs`
   together, and adapt the market sign-in links and callback/completion host.
   `OPENBITFUN_ACCOUNT_API_URL` overrides the desktop/CLI identity API for
   development; the previous `OPENBITFUN_MINIAPP_MARKET_API_URL` alias remains
   readable. Relay never accepts an identity authority from a client request.
4. Use separate persistent data and asset directories, configure exact browser
   CORS origins, then put the service behind your own TLS reverse proxy. Build
   and exercise two devices using the same GitHub identity before distributing
   your fork. The public web controller must come from that matching build.
```

</details>

**依据 4 · 作者声明**：[README.md:129-135](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/README.md#L129-L135)

迁移和构建条件。

```text
Get the Windows, macOS, or Linux package from the [official download page](https://openbitfun.com/download). Install it, configure a model, and open a workspace to get started. See the [user guide](https://playbook.openbitfun.com) for usage instructions and [download verification](./docs/verify-downloads.md) for package signature checks.

**Migration note:** OpenBitFun 1.0.0 is not data-compatible with legacy 0.2.x releases. To migrate legacy data,
use the [OpenBitFun Data Tools](src/apps/data-tools/README.md), currently available
for stable releases 0.2.17–0.2.19.

To run from source, install [Node.js](https://nodejs.org/) 22.12+, [pnpm](https://pnpm.io/) 10.15.0, the [Rust toolchain](https://rustup.rs/), and the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/). Clone the repository, then run:
```

**依据 5 · 源码核查**：[package.json:1-8](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/package.json#L1-L8)

根包 Node 条件。

```text
{
  "name": "OpenBitFun",
  "private": true,
  "version": "1.0.8",
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
```

#### 缺口

- 部署默认模式、迁移与费用未核实
  **影响**：不能判断离线可用性、隐私或实际迁移成本
  **进一步探讨**：隔离账号双设备核验端点并备份演练迁移。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何在断线后减少未知写入被重复执行或误判完成？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有日志以 stream/cursor 区分连续回填与快照，SFTP 对 CREATE 不重放并管理迟到句柄；因此再加事件游标或记录关闭不是增量。未实现假设：对具备可查询外部状态的写工具，为每次意图建立持久操作 ID、目标与预期变更摘要，记录已发出、已确认、结果未知三态；恢复时先对目标回读并由用户确认不确定结果，不能查询或状态冲突时保持 unknown、不自动重发。以现有 journal 加 SFTP 清理为对照，注入调用前中断、对端成功但响应丢失、进程重启、回读超时、并发修改和权限撤销；比较重复写入、误判完成、恢复时间及记录敏感数据风险。若将未知当成功或失败、并发变更被误认、重复副作用不降、泄露敏感内容或开销不可接受，则否定该方案；这不是跨任意工具或系统的 exactly-once 协议。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:109-136](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/execution/agent-runtime/src/session_event_journal.rs#L109-L136)

现有连续游标判断。

<details>
<summary>查看原文（28行）</summary>

```text
        while self.tail.len() > MAX_REPLAYABLE_TAIL_EVENTS {
            self.tail.pop_front();
        }
    }

    /// Events after `cursor`, or `None` when the retained tail cannot prove it
    /// is contiguous with what the client already applied.
    fn tail_since(&self, cursor: u64) -> Option<Vec<AgenticEvent>> {
        if cursor > self.cursor {
            // A cursor ahead of this stream's own progress is not a gap this
            // journal can reason about.
            return None;
        }
        if cursor == self.cursor {
            return Some(Vec::new());
        }
        // The client's next expected event must still be retained; if the
        // oldest entry is newer than that, the events between were dropped.
        match self.tail.front() {
            Some(oldest) if oldest.cursor <= cursor.saturating_add(1) => Some(
                self.tail
                    .iter()
                    .filter(|entry| entry.cursor > cursor)
                    .map(|entry| entry.event.clone())
                    .collect(),
            ),
            _ => None,
        }
```

</details>

**依据 2 · 源码核查**：[src/crates/execution/agent-runtime/src/session_event_journal.rs:146-159](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/execution/agent-runtime/src/session_event_journal.rs#L146-L159)

现有快照边界。

<details>
<summary>查看原文（14行）</summary>

```text
/// Everything a client missed after a cursor it already applied.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "kind")]
pub enum SessionEventBackfill {
    /// Contiguous with the client's cursor: apply these in order and it is
    /// caught up, with no snapshot and no projection rebuild.
    Delta {
        stream_id: String,
        cursor: u64,
        events: Vec<AgenticEvent>,
    },
    /// The client's cursor predates the retained tail, or belongs to an older
    /// Runtime process. Only a full snapshot can restore it.
    SnapshotRequired,
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs:62-106](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_ssh/sftp_file.rs#L62-L106)

现有不重放 CREATE 和未知句柄处理。

<details>
<summary>查看原文（45行）</summary>

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
                    | Error::UnexpectedPacket)
            ) {
                // A timed-out OPEN may have succeeded remotely without a known
                // handle; retire only this SFTP channel to reclaim that handle.
                session.retire().await;
            }
            let result = result.map(|file| ManagedSftpFile {
                file: Some(file),
                session,
                runtime: tokio::runtime::Handle::current(),
            });
            let _ = send.send(result);
        });
        receive
            .await
            .map_err(|_| Error::UnexpectedBehavior("SFTP open owner stopped".into()))?
```

</details>

**依据 4 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:195-229](https://github.com/GCWing/OpenBitFun/blob/2644c2ed3c5d0701341d22a14018c12f62c1115e/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L195-L229)

现有 epoch gap 机制。

<details>
<summary>查看原文（35行）</summary>

```text
    /// restarted the stream is announced as a gap and replayed from its latest page.
    async fn refresh(&mut self) -> Result<()> {
        if self.catch_up().await? {
            return Ok(());
        }
        self.gap("host stream restarted")?;
        self.resync().await
    }

    async fn load_older(&mut self) -> Result<bool> {
        if !self.has_more {
            return Ok(true);
        }
        let page = self
            .read(StreamReadRequest {
                stream_id: self.session_id.clone(),
                before: Some(self.oldest),
                epoch: Some(self.epoch),
                subscribe: true,
                ..Default::default()
            })
            .await?;
        if page.epoch != self.epoch {
            return Ok(false);
        }
        self.emit_page(&page)?;
        if let Some(first) = page.events.first() {
            self.oldest = first.seq;
        }
        self.has_more = page.has_more;
        self.emit_ready()?;
        Ok(true)
    }

    fn gap(&self, reason: &str) -> Result<()> {
```

</details>

#### 缺口

- 没有操作收据原型、通用回读接口或故障注入结果
  **影响**：无法证明收益和安全性
  **进一步探讨**：先在隔离 SFTP 沙箱实现原型和对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
