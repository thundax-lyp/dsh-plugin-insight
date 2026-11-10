# OpenBitFun Agent 工作区

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f76ee6b](https://github.com/openBitFun/OpenBitFun/tree/f76ee6b50e6acacff121ddff6dc81b8417219023)

<!-- BEGIN META -->
[![GitHub ★ 3,986](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C986&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openBitFun/OpenBitFun)
<!-- END META -->

> **功能**：独立 Agent 工作区，支持跨设备控制、远程工作区与可选 DSH 会话。

> **亮点**：DSH 接入复用已安装宿主，桥接会话重开与选定工具审批。跨设备视图按游标恢复主机事件，减少手工找日志和重新打开上下文的环节。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

> **主要限制**：界面回放经过筛选，活跃与归档重载的目录校验不同。断线丢失确认时，目标操作仍可能已经完成。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 根应用、ACP 桥与反向 DSH bundle 分别负责什么？](#detail-section-11)
  - [Q02 · DSH 会话与工具审批如何投影，重开会话有什么限制？](#detail-section-12)
  - [Q03 · 跨设备观察如何追赶，断线后能否判断写操作结果？](#detail-section-13)
  - [Q04 · 在什么账号、主机和工作区条件下可以试用？](#detail-section-14)
  - [Q05 · 如何验证可回读操作收据是否改善断线恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用常开开发主机的操作者希望从另一设备查看任务进度、处理一次审批，并回到原会话继续工作。

SSH、终端复用器和日志可组合出远程执行及检查。OpenBitFun 把会话选择、审批和结果追踪放在同一控制界面，保留回主机核对目标状态的步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH ACP | 从工作区启动和重开 DSH 会话 | 目标具备相配宿主和 profile |
| 远控 | 从另一设备查看和处理任务 | 依主机在线、身份和网络 |
| 审批投影 | 呈现与会话绑定的工具请求 | 只有匹配的请求由桥接处理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- |
| 常开主机与目标工作区 | 远控必需 | 执行任务并提供状态 | 无法从控制端读取任务 |
| 同账号与可达 Relay | 同账号跨设备需用 | 寻址、身份和转发 | 回主机本地检查 |
| 目标侧 dsh、Node 与构建 profile | DSH 选项需用 | 启动 ACP bridge | 检查目标侧 PATH、版本及构建戳 |
| 工作区 SSH 权限 | 远端工作区需用 | 远程文件及 ACP 进程 | 停止远程启动 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 操作者准备测试账号和隔离工作区 | 确认目标主机及目录 |
| 2 | 操作者启动 DSH 会话及低风险任务 | 对照主机进程、会话 ID 和审批对象 |
| 3 | 操作者断开、重连并回读目标状态 | 确认进度和文件，未知则暂停变更 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 主机、网络、模型资源，费用未知 | 配置身份、工作区和 DSH | 部署耗时未知 |
| 持续 | 主机运行、传输与模型用量，金额未知 | 查看审批、主机和版本 | 每合格任务耗时未知 |
| 恢复 | 回读或重复请求成本未知 | 核对目标状态后继续或回滚 | 错误率与恢复用时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 使用 DSH 会话 | 专用 profile 启动、事件和审批接线 | 同版本安装和兼容 |
| 第二设备恢复进度 | cursor 追赶与 epoch 重同步 | 线上重连成功率和延迟 |
| 找到变更结果 | 超时或丢确认有未知状态 | 全部命令的回读覆盖和重复写入率 |

> **思考**：界面回放经过筛选，活跃与归档重载的目录校验不同。断线丢失确认时，目标操作仍可能已经完成。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：DSH 接入复用已安装宿主，桥接会话重开与选定工具审批。跨设备视图按游标恢复主机事件，减少手工找日志和重新打开上下文的环节。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

客户端、ACP 桥、设备加密、RPC 与事件订阅各有边界。活跃和冷归档的路径差异值得在集成测试覆盖，网络取消也应保留可追溯的操作结果。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

界面回放经过筛选，活跃与归档重载的目录校验不同。断线丢失确认时，目标操作仍可能已经完成。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用测试账号和可回滚仓库先跑一次短任务，再从第二设备核对任务 ID 与审批。断开后回主机确认文件结果，状态未知时暂停后续写入。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 连接、会话投影和远控追赶的实现判断。线上身份和恢复效果待验证，持久收据属于实验设想。

- 已检查：作者 README、包清单、源码路径 README.md、extensions/dsh-openbitfun/package.json、package.json、packages/dsh-acp/src/bridge.ts、src/apps/relay-server/FAQ.md、src/crates/interfaces/acp/src/client/builtin_clients.rs、src/crates/interfaces/acp/src/client/dsh_profile.rs、src/crates/interfaces/acp/src/client/manager.rs、src/crates/services/services-integrations/src/remote_connect/account.rs、src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs、src/crates/services/services-integrations/src/remote_connect/realtime_client.rs、src/crates/services/services-integrations/src/remote_connect/rpc_execution.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读根应用类型、可选 DSH 接入、归档与活跃恢复、审批、远控订阅和连接说明。未核查全部命令、各协议或服务部署，也未测试运行。
- 下一步：在同账号两设备的隔离工作区验证首次启动、活跃与冷会话重开、跨目录拒绝、丢确认和 epoch 变化。以主机状态作为验收来源。

**分析版本**

- **仓库**：[openBitFun/OpenBitFun](https://github.com/openBitFun/OpenBitFun)
- **版本号**：1.0.10（[固定提交 f76ee6b](https://github.com/openBitFun/OpenBitFun/tree/f76ee6b50e6acacff121ddff6dc81b8417219023)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将操作收据与目标状态绑定，可能减少重连后误判和重复操作。通过同一批可回滚任务对照故障后的人工回读时间及误写次数。见 [Q05](#research-q05)。

在同账号两设备的隔离工作区验证首次启动、活跃与冷会话重开、跨目录拒绝、丢确认和 epoch 变化。以主机状态作为验收来源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 436 | 74086 | — | — | 929994 |
| .tsx | source | 897 | 236971 | 214872 | 6979 | — |
| .ts | source | 2193 | 266318 | 223312 | 18588 | — |
| .mjs | source | 143 | 57947 | 54066 | 1259 | — |
| .mjs | test | 278 | 53964 | 48996 | 1648 | — |
| .md | example | 12 | 826 | — | — | 5789 |
| .js | source | 97 | 34883 | 31495 | 1507 | — |
| .cjs | source | 16 | 2956 | 2449 | 151 | — |
| .cjs | test | 56 | 11901 | 10040 | 972 | — |
| .tsx | test | 474 | 122468 | 110478 | 1841 | — |
| .ts | test | 924 | 158922 | 140797 | 2908 | — |
| .js | example | 30 | 9646 | 8633 | 390 | — |
| .mjs | example | 3 | 141 | 126 | 0 | — |
| .ts | example | 5 | 214 | 200 | 3 | — |
| .tsx | example | 5 | 570 | 550 | 15 | — |
| .md | test | 7 | 2700 | — | — | 17281 |

</details>

**活跃度**

[![Issue 未关闭 93](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=93&color=737b86&logo=github)](https://github.com/openBitFun/OpenBitFun/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 99](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=99&color=737b86&logo=github)](https://github.com/openBitFun/OpenBitFun/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 84](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=84&color=737b86&logo=github)](https://github.com/openBitFun/OpenBitFun/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者把长任务留在选定主机时，OpenBitFun 的跨设备观察与 DSH 接入能保留什么状态，哪些写入仍须独立回读？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根应用、ACP 桥与反向 DSH bundle 分别负责什么？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

需要在桌面发起开发任务并从另一设备查看状态的开发者，可以把 OpenBitFun 当独立工作区客户端。根项目是私有应用工程，浏览与控制端可更换，DSH 则是可选 Agent。选择 DSH 时，内置预设调用本机或目标工作区已装的 dsh，并传入专用 profile。启动前会校验构建戳声明的最低版本，目标戳匹配时复用，否则复制本地构建。远端 ACP 先准备目标 profile，需远端具备可用的 dsh 和 Node，再经工作区标准流上传解包并启动。独立的 extensions/dsh-openbitfun 有自己的 DSH bundle 声明，方向是从 DSH 调 OpenBitFun 的工具，不等同于桌面应用启动 DSH 的路径。目录对根项目应按 client 归类。合格结果是能在指定主机启动真实 DSH 会话，确认会话 ID、工作目录和运行侧，而非只看到桌面选项。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/package.json#L1-L10)

根包是私有应用工作区。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "OpenBitFun",
  "private": true,
  "version": "1.0.10",
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "agent-harness:generate": "node scripts/generate-agent-harness.mjs",
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-openbitfun/package.json:1-22](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/extensions/dsh-openbitfun/package.json#L1-L22)

真正独立的 DSH bundle 子组件。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "dsh-openbitfun",
  "version": "0.1.0",
  "description": "DeepSeek Harness plugin bundle exposing the OpenBitFun Agent SDK Host as dsh tools",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "cordis.patch.yml",
    "README.md"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/crates/interfaces/acp/src/client/builtin_clients.rs:49-58](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/interfaces/acp/src/client/builtin_clients.rs#L49-L58)

内置 DSH 预设与 profile 参数。

<details>
<summary>查看原文（10行）</summary>

```text
    BuiltinAcpClientPreset {
        id: "dsh",
        command: "dsh",
        args: &["--profile", DSH_BUNDLED_PROFILE],
        tool_command: "dsh",
        install_package: Some("@deepseek-ai/dsh"),
        adapter_package: None,
        adapter_bin: None,
        bundled_profile: Some(DSH_BUNDLED_PROFILE),
    },
```

</details>

**依据 4 · 源码核查**：[src/crates/interfaces/acp/src/client/manager.rs:1785-1803](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/interfaces/acp/src/client/manager.rs#L1785-L1803)

本机先准备再启动标准流。

<details>
<summary>查看原文（19行）</summary>

```text
        // An agent whose runtime OpenBitFun ships (dsh) needs it in place before the
        // command runs, because the command's only job is to boot it.
        if let Some(profile) = builtin_acp_client_preset(client_id).and_then(|p| p.bundled_profile)
        {
            ensure_bundled_profile(profile).await?;
        }

        let program = resolve_configured_command(&config.command, &config.env);
        let mut command = openbitfun_core::util::process_manager::create_tokio_command(&program);
        command
            .args(&config.args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            // Inheriting sent this to a terminal that a packaged app does not
            // have, so a local agent that died at startup was as silent as a
            // remote one. Read it instead: it goes to the log, and its tail
            // goes into the error the user is shown.
            .stderr(Stdio::piped());
        apply_command_environment(&mut command, Some(&config.env));
```

</details>

**依据 5 · 源码核查**：[src/crates/interfaces/acp/src/client/manager.rs:1885-1908](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/interfaces/acp/src/client/manager.rs#L1885-L1908)

远端先准备，再经工作区 stdio 启动。

<details>
<summary>查看原文（24行）</summary>

```text
            OpenBitFunError::service("SSH manager is not available for remote ACP".to_string())
        })?;
        // Same reason as `start_local_transport`: the command below only boots
        // the runtime OpenBitFun ships, so it has to be on that host first.
        if let Some(profile) = builtin_acp_client_preset(client_id).and_then(|p| p.bundled_profile)
        {
            ensure_bundled_profile_remote(
                profile,
                config.command.trim(),
                &config.env,
                &ssh_manager,
                remote_connection_id,
            )
            .await?;
        }
        let transport = ssh_manager
            .open_workspace_stdio(remote_connection_id, &command)
            .await
            .map_err(|error| {
                OpenBitFunError::service(format!(
                    "Failed to start remote ACP client '{}': {}",
                    client_id, error
                ))
            })?;
```

</details>

**依据 6 · 源码核查**：[src/crates/interfaces/acp/src/client/dsh_profile.rs:72-101](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/interfaces/acp/src/client/dsh_profile.rs#L72-L101)

最低版本检查与 profile 复用。

<details>
<summary>查看原文（30行）</summary>

```text
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
    {
        return Ok(destination);
    }

    let target = destination.clone();
    tokio::task::spawn_blocking(move || install_profile(&source, &target))
        .await
        .map_err(|error| {
            OpenBitFunError::service(format!(
                "Failed to install the DeepSeek Harness profile: {error}"
            ))
        })??;

    log::info!(
        "Installed the bundled DeepSeek Harness profile at {}",
        destination.display()
    );
    Ok(destination)
```

</details>

**依据 7 · 源码核查**：[src/crates/interfaces/acp/src/client/dsh_profile.rs:414-452](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/interfaces/acp/src/client/dsh_profile.rs#L414-L452)

匹配戳跳过，否则通过远端 shell 标准输入传包。

<details>
<summary>查看原文（39行）</summary>

```text
    if serde_json::from_str::<BridgeStamp>(&probe.stamp)
        .is_ok_and(|installed| installed.content == stamp.content)
    {
        return Ok(());
    }

    let archive = tokio::task::spawn_blocking(move || archive_profile(&source))
        .await
        .map_err(|error| {
            OpenBitFunError::service(format!(
                "Failed to package the DeepSeek Harness profile for upload: {error}"
            ))
        })??;

    let install_command = remote_user_shell_command(&remote_install_script(profile, &exports));
    let transport = ssh
        .open_workspace_stdio(connection_id, &install_command)
        .await
        .map_err(|error| {
            OpenBitFunError::service(format!(
                "Failed to install the DeepSeek Harness profile on the remote host: {error}"
            ))
        })?;
    // Every stream stays bound: dropping all three cancels the command, and the
    // extraction is only over once `completion` says so.
    let (mut stdin, _stdout, mut stderr, _control, completion) = transport.into_parts();

    let upload = async {
        stdin.write_all(&archive).await.map_err(|error| {
            OpenBitFunError::service(format!(
                "Failed to send the DeepSeek Harness profile to the remote host: {error}"
            ))
        })?;
        // The remote `tar` reads until end of input, so the shutdown is what
        // ends the extraction rather than a timeout.
        stdin.shutdown().await.map_err(|error| {
            OpenBitFunError::service(format!(
                "Failed to send the DeepSeek Harness profile to the remote host: {error}"
            ))
```

</details>

#### 缺口

- 未验证固定构建与目标 DSH 组合实际启动。
  **影响**：内置选项和版本检查不足以证明服务接口全部兼容。
  **进一步探讨**：在隔离机器核对实际启动命令、profile 来源、运行侧和一条最小任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 会话与工具审批如何投影，重开会话有什么限制？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

ACP bridge 把宿主事件投影成界面更新，收到属于当前 bridge 的工具审批时携带 session ID 和调用 ID，提供允许一次与拒绝，按结果返回宿主。无所属记录或无调用 ID 时交给下一处理器。关闭再重开归档会话时读取宿主持久化，要求原 cwd 与请求相符，恢复 Agent 和预设，再用事件重放文本和已提交输出。历史回放明确跳过助手流式增量、轮次开始及非用户发起的用户消息，个别无法映射事件只写警告。这比只返回一段终端输出多了会话和审批视图，但页面不是原始事件的全量副本。另有活跃会话分支，仅检查传入目录形式，再按会话 ID 直接复放，没有复用归档分支的 cwd 相等检查。代码仍引用原记录，不能据此断言发生了切目录。对同一个 ACP 通道传不同绝对目录时的可达性及效果须单独测。此 bridge 也拒绝额外目录和客户端传入 MCP 服务，初始化不宣称图像、音频输入。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-acp/src/bridge.ts:672-690](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/packages/dsh-acp/src/bridge.ts#L672-L690)

回放有意过滤部分事件，转换失败不阻塞整体。

<details>
<summary>查看原文（19行）</summary>

```text
  const replayHistory = (record: SessionRecord): void => {
    for (const event of record.agent.session.events) {
      try {
        if (event.type === 'user/message') {
          if (event.data.source.kind !== 'user') continue
          for (const block of event.data.content) {
            if (block.type !== 'text' || block.text.length === 0) continue
            update(record, { sessionUpdate: 'user_message_chunk', content: { type: 'text', text: block.text } })
          }
          continue
        }
        if (event.type === 'assistant/chunk' || event.type === 'turn/start') continue
        publishEvent(record, event)
      } catch (error: unknown) {
        // One unrenderable historical event costs its card, not the reopened
        // conversation.
        logger.warn(`acp: failed to replay ${event.type}: ${String(error)}`)
      }
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-acp/src/bridge.ts:737-763](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/packages/dsh-acp/src/bridge.ts#L737-L763)

审批来源归属和允许、拒绝、取消映射。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.on('approval/request', (request, next) => {
    const record = ownedRecord(request.agent)
    if (record === undefined || request.callId === undefined) return next()
    const callId = request.callId
    const published = publishToolCall(record, callId, request.toolName, {})
    const toolCall: ToolCallUpdate = {
      toolCallId: callId,
      title: published.title,
      kind: toolKind(published.title),
      status: 'pending',
      rawInput: published.rawInput,
    }
    return conn.requestPermission({
      sessionId: record.agent.session.id,
      toolCall,
      options: [
        { optionId: 'allow-once', name: 'Allow once', kind: 'allow_once' },
        { optionId: 'reject-once', name: 'Reject', kind: 'reject_once' },
      ],
    }).then(({ outcome }) => {
      if (outcome.outcome === 'cancelled') return 'cancelled'
      if (outcome.optionId !== 'allow-once') return 'rejected'
      // Granted: the call is about to run, so move the card out of `pending`.
      // `tool/result` settles it to completed or failed.
      update(record, { sessionUpdate: 'tool_call_update', toolCallId: callId, status: 'in_progress' })
      return 'allowed-once'
    })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-acp/src/bridge.ts:769-784](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/packages/dsh-acp/src/bridge.ts#L769-L784)

初始化能力和限制。

<details>
<summary>查看原文（16行）</summary>

```text
      initialize(_params: InitializeRequest): Promise<InitializeResponse> {
        // Single-version agent: the spec's "same version if supported, else
        // the latest supported" both resolve to this server's one version.
        return Promise.resolve({
          protocolVersion: PROTOCOL_VERSION,
          agentInfo: { name: 'dsh-acp-ide', version: '0.0.1' },
          agentCapabilities: {
            // Reopening a conversation is the IDE's normal case, and the
            // harness persists every session it runs: without this, a client
            // has no way to say "continue that one" and starts a blank session
            // whose history and mode are gone.
            loadSession: true,
            promptCapabilities: { image: false, audio: false, embeddedContext: false },
          },
          authMethods: [],
        })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-acp/src/bridge.ts:855-895](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/packages/dsh-acp/src/bridge.ts#L855-L895)

活跃快速路径与归档 cwd 检查位于不同分支。

<details>
<summary>查看原文（41行）</summary>

```text
      async loadSession(params: LoadSessionRequest): Promise<LoadSessionResponse> {
        assertOpen()
        validateSessionParams(params)
        const sessionId = SessionId(params.sessionId)
        // Already live — a second load of the same session must not resume a
        // rival agent on top of the running one. Replaying is still right: the
        // client asked for the transcript.
        const live = sessions.get(sessionId)
        if (live !== undefined) {
          replayHistory(live)
          const configOptions = await sessionOptions(live)
          return configOptions.length === 0 ? {} : { configOptions }
        }

        const archive = ctx.get('sessionPersistence') as SessionArchive | undefined
        if (archive === undefined) throw invalidParams('this deployment persists no sessions')
        // Absent, unreadable, and written-by-an-incompatible-format all mean the
        // same thing to a client — this conversation cannot be reopened — and
        // saying so as an invalid parameter is what lets it fall back to
        // `session/new` knowing why.
        const inspected = await archive.inspect(sessionId).catch((error: unknown) => {
          throw invalidParams(`cannot load session ${sessionId}: ${errorChain(error)}`)
        })
        if (inspected.meta.cwd !== params.cwd) {
          throw invalidParams(
            `session ${sessionId} belongs to "${inspected.meta.cwd ?? '(none)'}", not "${params.cwd}"`,
          )
        }
        const composed = presets === undefined
          ? undefined
          : resolveSessionPreset({ header: inspected.meta, events: inspected.events })
        const modelSeed = agentOptions(ctx, config)
        const modelSelection: ModelSelectionRef = { current: undefined, assembled: undefined }
        const handle = await agents.resume({
          resumeSessionId: sessionId,
          agentOptions: modelSeed,
          setup: async (agentCtx: Context) => {
            installModelSelection(agentCtx, modelSelection)
            if (presets !== undefined && composed !== undefined) await presets.mount(agentCtx, composed)
          },
        })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-acp/src/bridge.ts:896-920](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/packages/dsh-acp/src/bridge.ts#L896-L920)

登记后重放并返回配置选项。

<details>
<summary>查看原文（25行）</summary>

```text
        /* v8 ignore next 4 -- a real stdio close can race an in-flight resume. */
        if (closed) {
          await handle.dispose()
          throw internalError('connection closed during session/load')
        }
        const record: SessionRecord = {
          agent: handle.agent,
          dispose: () => handle.dispose(),
          streamedText: new Set(),
          streamedReasoning: new Set(),
          published: new Map(),
          presetId: composed,
          configSwitch: undefined,
          // A session with turns is already locked, and the response below says
          // so; only a session reopened before its first turn can still be
          // told, by the `turn/start` that starts it.
          presetLockPublished: !sessionBlank(handle.agent.session),
          modelSelection,
          modelSeed,
          inflight: undefined,
        }
        sessions.set(sessionId, record)
        replayHistory(record)
        const configOptions = await sessionOptions(record)
        return configOptions.length === 0 ? {} : { configOptions }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-acp/src/bridge.ts:1160-1166](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/packages/dsh-acp/src/bridge.ts#L1160-L1166)

只检验 cwd 为绝对路径并拒绝额外目录和 MCP。

```text
function validateSessionParams(params: NewSessionRequest | LoadSessionRequest): void {
  if (!isAbsolute(params.cwd)) throw invalidParams(`cwd must be an absolute path: ${params.cwd}`)
  if (params.additionalDirectories !== undefined && params.additionalDirectories.length > 0) {
    throw invalidParams('additionalDirectories is not supported')
  }
  if (params.mcpServers.length > 0) throw invalidParams('mcpServers is not supported')
}
```

#### 缺口

- 活跃重载与归档重载在真实 UI 的路由及跨目录调用可达性未知。
  **影响**：不能把归档 cwd 校验理解成所有恢复路径的等价边界。
  **进一步探讨**：在同一隔离 ACP 通道用活跃与冷归档 ID 分别传正确、错误 cwd，核对返回、事件和实际工具工作目录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨设备观察如何追赶，断线后能否判断写操作结果？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

远端界面订阅按当前 session ID、cursor 和 epoch 向主机读取后续事件。主机返回新 epoch 时，客户端发 gap 通知并重新同步，而不是继续沿用旧游标。这便于控制端换设备后查看进度，也意味着缺口发生时要用新页面核对状态。RPC 等待确认时如果 socket 关闭或总等待超时，会明确返回交付结果未知。目标执行阶段另有取消规则：当调用者把操作标为 finish_started 且已经进入执行，取消后仍等待该操作结束，再抑制当前回复。这个代码分支解释了为何目标可能已更改而控制端没有收到确认。重连补到事件不代表某次写请求已去重，也不能以本地取消或无应答推定目标未动。对可回读的文件或状态先检查目标再决定继续，无法确认则暂停变更。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:398-434](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L398-L434)

游标追赶与 epoch 改变触发的重同步。

<details>
<summary>查看原文（37行）</summary>

```text
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
            self.emit_page(&page, false)?;
            if let Some(last) = page.events.last() {
                self.cursor = self.cursor.max(last.seq);
            }
            if !page.has_more {
                // The host's newest sequence may belong to an evicted control
                // event; adopt it so the next hint compares against it.
                self.cursor = self.cursor.max(page.cursor);
                return Ok(true);
            }
        }
    }

    /// Catch up after a hint, a reconnect or a keepalive tick. A host that
    /// restarted the stream is announced as a gap and replayed from its latest page.
    async fn refresh(&mut self) -> Result<()> {
        if self.catch_up().await? {
            return Ok(());
        }
        self.gap("host stream restarted")?;
        self.resync().await
    }
```

</details>

**依据 2 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/realtime_client.rs:35-46](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/realtime_client.rs#L35-L46)

丢失确认时的结果未知。

<details>
<summary>查看原文（12行）</summary>

```text
/// Stable text for an acknowledgement the socket lost because its connection
/// closed (a reconnect, a device switch, a revoked socket) before the Relay
/// answered. The frontend matches this prefix; keep it byte-stable.
pub const RELAY_REPLY_LOST: &str =
    "Relay connection closed before the reply arrived; delivery outcome is unknown";

/// The Relay always answers an acknowledged event, so a dropped acknowledgement
/// means this socket went away. Say so instead of the transport's own text.
fn ack_error(error: AckError) -> anyhow::Error {
    match error {
        AckError::Recv(_) => anyhow!(RELAY_REPLY_LOST),
        other => anyhow::Error::from(other),
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/realtime_client.rs:291-323](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/realtime_client.rs#L291-L323)

发送、等待及总超时后返回未知。

<details>
<summary>查看原文（33行）</summary>

```text
    pub(super) async fn call_with_timeout_guarded(
        &self,
        target: &str,
        params: Value,
        timeout: Duration,
        before_send: impl Fn() -> Result<()>,
    ) -> Result<Value> {
        before_send()?;
        let params = self.payloads.upload_if_large(params).await?;
        let deadlines = RpcCallDeadlines::for_timeout(timeout);
        let ack = tokio::time::timeout(deadlines.overall, async {
            before_send()?;
            self.sender
                .emit(RpcCall(rpc_call_payload(target, params, deadlines.target)))
                .await?
                .timeout(deadlines.ack)
                .await
                .map_err(ack_error)
        })
        .await
        .map_err(|_| anyhow!("Relay RPC timed out; delivery outcome is unknown"))??;
        let result = ack.payload.0;
        if result["ok"] != true {
            bail!("{}", result["error"].as_str().unwrap_or("Relay RPC failed"));
        }
        self.payloads
            .resolve(
                result
                    .get("result")
                    .cloned()
                    .ok_or_else(|| anyhow!("Relay RPC response missing result"))?,
            )
            .await
```

</details>

**依据 4 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/rpc_execution.rs:7-43](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/rpc_execution.rs#L7-L43)

明确选择允许完成的已开始操作在取消后耗尽并不返回结果。

<details>
<summary>查看原文（37行）</summary>

```text
/// Runs one RPC stage while its caller retains the current routing lease.
///
/// Only model mutation execution may finish after cancellation. Preparation,
/// ownership revalidation and replies must remain separate cancellable stages.
/// A mutation accepted by its first poll is drained in this task, preserving
/// task-local ownership and keeping the lease until its commit or failure ends.
pub async fn run_rpc_stage<F>(
    cancellation: &mut watch::Receiver<u64>,
    finish_started: bool,
    operation: F,
) -> Option<F::Output>
where
    F: Future,
{
    if cancellation.has_changed().unwrap_or(true) {
        return None;
    }
    let admitted = AtomicBool::new(false);
    let checkpoint = cancellation.clone();
    let execution = async {
        if checkpoint.has_changed().unwrap_or(true) {
            return None;
        }
        admitted.store(true, Ordering::Relaxed);
        Some(operation.await)
    };
    tokio::pin!(execution);
    tokio::select! {
        biased;
        _ = cancellation.changed() => {
            if finish_started && admitted.load(Ordering::Relaxed) {
                let _ = execution.await;
            }
            None
        }
        result = &mut execution => result,
    }
```

</details>

#### 缺口

- 不同远端写命令实际选择 finish_started 的覆盖范围及前端回读均未全查。
  **影响**：这些分支不能承诺任意写入都可安全重试或追踪。
  **进一步探讨**：用可逆的状态变更在服务端提交点断网，对照主机记录、最终状态和控制端文案。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在什么账号、主机和工作区条件下可以试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有常开主机、能维护隔离仓库和测试账号的开发者，可以从另一设备观察一次长任务并处理一次低风险审批。README 与 Relay FAQ 在本提交均把同账号官方 Relay 作为发布客户端默认连接，桌面本地 Relay 仍要在线身份服务，私有 Relay 要配套客户端。SSH 工作区依赖目标访问权限，与 Relay 登录是两件事。设备消息包装按目标设备取密钥并加密，也有对应解密路径。作者文档明确身份服务和密钥目录仍在信任边界，Relay 仍处理账号及路由元数据，模型、机器人和发布内容有不同数据路径。当前只能判断这些边界在源码和文档中的表示，无法代替联网鉴权验收。试用前选择目标主机和低权限工作区，运行时用第二设备确认 ID 及审批请求，遇到主机不明、断线结果未知或权限异常时暂停，回主机检查任务和文件，再决定是否继续。相对 SSH 或远程日志，入口合并能减少来回查找，账号、主机、模型和连接都带来维护成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-73](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/README.md#L54-L73)

作者描述跨设备任务及不同连接路径。

<details>
<summary>查看原文（20行）</summary>

```text
## Switch computers. Control from your phone.

**Switch the device, switch the entire workspace.** Choose another connected computer in the desktop app, and the interface switches to that device's sessions, workspaces, files, and task status. Move between your home computer, office computer, and server from the same app.

**Your phone is a remote controller.** Send instructions, check progress, and respond to approval requests from your phone or browser. Tasks run on the selected host and keep going when you switch views or disconnect the controller.

**The official Relay is ready to use; no server deployment is required.** Sign in on your devices with the same OpenBitFun account, using GitHub or an email verification code where supported. Same-network connections are also available. See the [connection FAQ](./src/apps/relay-server/FAQ.md) for login, internet access, and self-hosting requirements.

**On mobile, switch between layouts for one, two, or three screens.** Focus on the conversation with a single screen, then unfold your phone to view conversations and files side by side. The interface adapts as the screen layout changes.

![Switching between connected computers and remotely controlling the selected device from a phone](./png/openbitfun-multi-device.png)

<details>
<summary>Connection and deployment details</summary>

Use SSH to work on a remote host, through a jump host, or inside a container. File access, terminals, and workspace commands target that environment; the Agent Runtime stays on the OpenBitFun host. The desktop app and CLI share core execution capabilities; mobile clients and messaging bots offer more ways to control tasks.

Same-account device control uses the official Relay by default. Desktop can also run a local Relay for same-network mobile control. Both paths use the online OpenBitFun identity service for sign-in; LAN mode is not an offline-login option. A private Relay requires a matching client build: see the [deployment guide](./src/apps/relay-server/README.md#for-community-developers-and-forks).

Device-to-device payloads are encrypted end to end with keys generated on the devices. Sessions and files are read from the owning online device on demand; the Relay still handles account, device, and routing metadata. This does not cover traffic to model providers, messaging bots, or published Pages. See the [privacy boundaries](./src/apps/relay-server/FAQ.md#what-can-the-services-see), [Remote Connect](./docs/interactive-capabilities/capabilities/feature.remote-connect.md), and [remote workspaces](./docs/features/remote-workspaces.md).
```

</details>

**依据 2 · 作者声明**：[src/apps/relay-server/FAQ.md:7-27](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/apps/relay-server/FAQ.md#L7-L27)

同账号、局域网、私有 Relay 与 SSH 适用条件。

<details>
<summary>查看原文（21行）</summary>

```text
No. Released clients use the official Relay for same-account device control.
Sign in on the host and controller with the same OpenBitFun account and follow
the Remote Connect invitation or device-selection flow. Keep the host running
and reachable. The official endpoint is `https://remote.openbitfun.com/relay?v=1.0.10`;
the version travels as a query parameter, and the older
`https://remote.openbitfun.com/v/1.0.2/` path keeps working against the same
account database;
the path is a service-protocol prefix, not the current desktop release number.

| Connection | What you need |
| --- | --- |
| Official Relay | Internet access and the same account on both devices; no server deployment or Relay URL configuration |
| Same network | A Desktop host running its embedded LAN Relay, reachable by the controller; internet access for sign-in |
| Private Relay | Your own service deployment and matching client builds; see the [fork guide](README.md#for-community-developers-and-forks) |
| SSH / Docker workspace | Access to the target environment; independent of Relay login |

Desktop can keep official and LAN connections active together. **My devices**,
Peer Device Mode, account synchronization, and account-device Detached Dispatch
continue to use the official account endpoint; LAN mode does not move them to a
private server. CLI does not host an embedded LAN Relay. Messaging bots have
their own provider configuration and pairing flow.
```

</details>

**依据 3 · 作者声明**：[src/apps/relay-server/FAQ.md:63-76](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/apps/relay-server/FAQ.md#L63-L76)

加密覆盖、身份元数据和其他数据流边界。

<details>
<summary>查看原文（14行）</summary>

```text
directory, and derive AES-GCM keys using X25519 and HKDF-SHA256. The Relay does
not receive device private keys. Session history and workspace files are read
from the owning online host on demand, rather than a Relay-hosted session backup.

The Relay still processes account IDs, device registrations, public keys,
presence, and routing metadata. The identity service processes sign-in; the
identity service and authenticated public-key directory remain part of the
trust boundary. Payload encryption does not mean that no data reaches an
operated service, nor does it protect a compromised endpoint.

Published Pages, Page data/functions, marketplaces, model-provider requests, and
messaging-bot traffic have separate data flows. Publishing a Page uploads its
content to the publishing service under the selected visibility rules. Do not
apply the device-control encryption claim to all OpenBitFun network traffic.
```

</details>

**依据 4 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/account.rs:294-324](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/account.rs#L294-L324)

设备发送加密与对端解密入口。

<details>
<summary>查看原文（31行）</summary>

```text
        device_id: &str,
        plaintext: &str,
        accepts_zstd: bool,
    ) -> Result<(String, String)> {
        let key = self.peer_message_key(relay_url, device_id).await?;
        super::encryption::encrypt_relay_message(&key, plaintext, accepts_zstd)
    }

    pub async fn decrypt_from_peer(
        &self,
        relay_url: &str,
        device_id: &str,
        data: &str,
        nonce: &str,
    ) -> Result<String> {
        let peer = self.peer_cipher(relay_url, device_id).await?;
        self.open_peer_message(relay_url, device_id, peer, data, nonce, None)
            .await
    }

    pub async fn decrypt_peer_message(
        &self,
        relay_url: &str,
        device_id: &str,
        data: &str,
        nonce: &str,
        offer: PeerEncodingOffer,
    ) -> Result<String> {
        let peer = self.peer_cipher(relay_url, device_id).await?;
        self.open_peer_message(relay_url, device_id, peer, data, nonce, Some(offer))
            .await
```

</details>

**依据 5 · 源码核查**：[src/crates/interfaces/acp/src/client/manager.rs:1885-1908](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/interfaces/acp/src/client/manager.rs#L1885-L1908)

SSH 接入是目标侧 ACP 启动。

<details>
<summary>查看原文（24行）</summary>

```text
            OpenBitFunError::service("SSH manager is not available for remote ACP".to_string())
        })?;
        // Same reason as `start_local_transport`: the command below only boots
        // the runtime OpenBitFun ships, so it has to be on that host first.
        if let Some(profile) = builtin_acp_client_preset(client_id).and_then(|p| p.bundled_profile)
        {
            ensure_bundled_profile_remote(
                profile,
                config.command.trim(),
                &config.env,
                &ssh_manager,
                remote_connection_id,
            )
            .await?;
        }
        let transport = ssh_manager
            .open_workspace_stdio(remote_connection_id, &command)
            .await
            .map_err(|error| {
                OpenBitFunError::service(format!(
                    "Failed to start remote ACP client '{}': {}",
                    client_id, error
                ))
            })?;
```

</details>

#### 缺口

- 官方服务在线情况、账号隔离及双设备操作时延未验证。
  **影响**：不能确定共享账号、代理或私有 Relay 在实际部署中满足同样条件。
  **进一步探讨**：使用测试账号从两个设备核对可见主机、审批和重连，再用第二账号确认无法进入该会话。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证可回读操作收据是否改善断线恢复？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可试验在主机按操作标识保存待处理、执行结束、结果未知等可回读状态，并将终态与实际目标对象绑定。当前 RPC 可以报告交付未知，订阅另有 gap 恢复；它们没有在这些受查路径中合成持久操作收据。以现有控制流程、SSH 人工回读和带收据原型作对照，用同一批可恢复的编辑任务，在发送前、目标开始后和提交后分别断开。每份正确完成的任务记录重复变更、未知状态误判、恢复时间和额外存储或运维开销。操作标识若跨设备或重新登录后失去作用，先确认拥有者和目标状态，不自动重放。若错误没有减少，或状态表引入跨账号泄露和更高恢复负担，停止该设计试验。当前未形成任何真实收益数字。

#### 证据与依据

**依据 1 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/realtime_client.rs:298-323](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/realtime_client.rs#L298-L323)

RPC 成功与未知路径可分别作为实验注入点。

<details>
<summary>查看原文（26行）</summary>

```text
        before_send()?;
        let params = self.payloads.upload_if_large(params).await?;
        let deadlines = RpcCallDeadlines::for_timeout(timeout);
        let ack = tokio::time::timeout(deadlines.overall, async {
            before_send()?;
            self.sender
                .emit(RpcCall(rpc_call_payload(target, params, deadlines.target)))
                .await?
                .timeout(deadlines.ack)
                .await
                .map_err(ack_error)
        })
        .await
        .map_err(|_| anyhow!("Relay RPC timed out; delivery outcome is unknown"))??;
        let result = ack.payload.0;
        if result["ok"] != true {
            bail!("{}", result["error"].as_str().unwrap_or("Relay RPC failed"));
        }
        self.payloads
            .resolve(
                result
                    .get("result")
                    .cloned()
                    .ok_or_else(|| anyhow!("Relay RPC response missing result"))?,
            )
            .await
```

</details>

**依据 2 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/rpc_execution.rs:24-43](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/rpc_execution.rs#L24-L43)

取消发生时执行与确认可分离。

<details>
<summary>查看原文（20行）</summary>

```text
    let admitted = AtomicBool::new(false);
    let checkpoint = cancellation.clone();
    let execution = async {
        if checkpoint.has_changed().unwrap_or(true) {
            return None;
        }
        admitted.store(true, Ordering::Relaxed);
        Some(operation.await)
    };
    tokio::pin!(execution);
    tokio::select! {
        biased;
        _ = cancellation.changed() => {
            if finish_started && admitted.load(Ordering::Relaxed) {
                let _ = execution.await;
            }
            None
        }
        result = &mut execution => result,
    }
```

</details>

**依据 3 · 源码核查**：[src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs:426-434](https://github.com/openBitFun/OpenBitFun/blob/f76ee6b50e6acacff121ddff6dc81b8417219023/src/crates/services/services-integrations/src/remote_connect/host_stream_subscriber.rs#L426-L434)

事件流重同步为不同机制，适合做对照。

```text
    /// Catch up after a hint, a reconnect or a keepalive tick. A host that
    /// restarted the stream is announced as a gap and replayed from its latest page.
    async fn refresh(&mut self) -> Result<()> {
        if self.catch_up().await? {
            return Ok(());
        }
        self.gap("host stream restarted")?;
        self.resync().await
    }
```

#### 缺口

- 缺乏按断线阶段区分的恢复错误统计。
  **影响**：无法判断收据机制是否值得引入。
  **进一步探讨**：对同样任务做配对故障注入，核对目标状态与控制端看到的结论。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
