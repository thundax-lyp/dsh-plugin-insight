# DeepSeek Harness Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8cabeda](https://github.com/baihejiangnan/deepseek-harness-desktop/tree/8cabeda2610c368593144881f94ef25b38461e33)

<!-- BEGIN META -->
[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/baihejiangnan/deepseek-harness-desktop)
<!-- END META -->

> **功能**：以 Tauri 管理独立 DSH 实例、桌面入口及多实例协作。

> **亮点**：[Q01](#research-q01) 将多实例数据目录和启动步骤接到桌面。

> **主要限制**：[Q02](#research-q02) 本机RPC与取消成功不能证明身份隔离或命令静止。

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
  - [Q01 · 桌面怎样启动多套 DSH？](#detail-section-11)
  - [Q02 · 协作 RPC 怎样确认完成和取消？](#detail-section-12)
  - [Q03 · 怎样试用与退出？](#detail-section-13)
  - [Q04 · 怎样减少取消已接受被误当已停止？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要分别维护实验与演示配置的DSH用户。

手工管理终端、端口和DSH_HOME。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 实例管理 | 启动独立home | 非OS权限隔离 |
| 协作 | 下发轮询与取消 | 需匹配DSH接收协议 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 平台制品与下载源 | 必需 | 取得Node及Harness | 回已有CLI |
| 空实例home | 试用必需 | 分离测试数据 | 不迁真实配置 |
| 已配置模型 | 任务需要 | 生成结果 | 只测启动 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 记录制品及下载宿主版本 | 建立空目录 |
| 启动 | 先单实例再双实例 | 核对home和端口 |
| 退出 | 停实例并查子进程 | 再备份或删除测试目录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 下载及磁盘未知 | 核对版本与目录 | 未实测 |
| 持续使用 | 模型费用未知 | 维护桌面和宿主组合 | 依赖更新 |
| 失败恢复 | 残留进程资源未知 | 终端逐实例核查 | 取消不等静止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 实例启动 | home及回环参数接线 | 跨进程互斥 |
| 协作 | RPC请求与错误处理 | 取消后的真实停止 |

> **思考**：[Q02](#research-q02) 本机RPC与取消成功不能证明身份隔离或命令静止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将多实例数据目录和启动步骤接到桌面。

[Q02](#research-q02) 区分RPC接受、会话终结及进程退出。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 本机RPC与取消成功不能证明身份隔离或命令静止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 空home验证后再考虑第二套实例。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

桌面启动及RPC已静态核对，下载运行时权限和实际停止未知。

- 已检查：作者 README、包清单、源码路径 README.md、src-tauri/resources/README.md、src-tauri/src/bridge/cmd.rs、src-tauri/src/service/collab/mod.rs、src-tauri/src/service/workflow/mod.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定桌面启动、实例表和协作RPC代表路径，未运行。
- 下一步：验证下载版本、双启动竞争和取消读回。

**分析版本**

- **仓库**：[baihejiangnan/deepseek-harness-desktop](https://github.com/baihejiangnan/deepseek-harness-desktop)
- **版本号**：0.0.15（[固定提交 8cabeda](https://github.com/baihejiangnan/deepseek-harness-desktop/tree/8cabeda2610c368593144881f94ef25b38461e33)）
- **版本日期**：2026-09-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 取消终结读回可能降低状态误判。

验证下载版本、双启动竞争和取消读回。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2620 | — | — | 73920 |
| .ts | source | 40 | 2451 | 1955 | 307 | — |
| .mjs | source | 5 | 947 | 736 | 161 | — |
| .js | source | 2 | 74 | 73 | 1 | — |
| .mjs | test | 2 | 1253 | 1018 | 174 | — |
| .tsx | source | 33 | 10630 | 9731 | 351 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/baihejiangnan/deepseek-harness-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多实例桌面怎样启动DSH并协作，数据目录、RPC与停止有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面怎样启动多套 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望将实验与演示分开的用户可建立独立实例。启动器先在持锁的实例表分配端口，拒绝同表内另一个正在使用相同home的实例，然后启动独立instance宿主。workflow确保profile，向子进程传DSH_HOME，并把DSH绑定127.0.0.1。相比手工开几个终端和管理环境变量，桌面保存了实例目录与启动状态。这里分开的是数据目录，尚未因此产生操作系统用户或文件访问隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/bridge/cmd.rs:920-960](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/bridge/cmd.rs#L920-L960)

同表home检查与宿主进程

<details>
<summary>查看原文（41行）</summary>

```text
        // 端口必须在持有 hosts 锁时分配，串行化并发启动，避免两个实例宿主
        // 同时探测到同一个“空闲”端口；协作编排传固定端口，其余路径自动探测。
        let allocated_port = match port {
            Some(port) => port,
            None => crate::service::workflow::find_available_port(setting.port)?,
        };

        // 会话等数据写入 DSH_HOME。多个宿主即使 Profile 不同，同时写同一个
        // Home 仍会使 session log 的提交序号交叉，最终出现 seq gap。
        if let Some(running) = registry.instances.iter().find(|instance| {
            instance.id != id
                && instance.dsh_home == target.dsh_home
                && hosts.contains_key(&instance.id)
        }) {
            return Err(format!(
                "INSTANCE_HOME_RUNNING:{}:{}",
                running.id, running.name
            ));
        }

        let exe = std::env::current_exe().map_err(|error| error.to_string())?;
        let mut command = std::process::Command::new(exe);
        command.args(["--mode", "instance", "--instance-id", &id]);
        command.args(["--port", &allocated_port.to_string()]);
        if minimized.unwrap_or(false) {
            command.arg("--start-minimized");
        }
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            command.creation_flags(0x08000000);
        }
        #[cfg(not(windows))]
        {
            use std::os::unix::process::CommandExt;
            // 自成进程组：停止时才能按负 PID 结束宿主及其派生的 DSH 整棵树。
            command.process_group(0);
        }
        let child = command
            .spawn()
            .map_err(|error| format!("INSTANCE_HOST_SPAWN: {error}"))?;
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/service/workflow/mod.rs:847-866](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/service/workflow/mod.rs#L847-L866)

profile及home环境

<details>
<summary>查看原文（20行）</summary>

```text
    // 构造环境变量：隔离的 $DSH_HOME + 隐私默认（关闭遥测）
    let dsh_home = config::get_dsh_data_path(&app_handle);
    fs::create_dir_all(&dsh_home).map_err(|e| format!("create dsh home failed: {e}"))?;
    // DSH 只会自动创建内置的 web/headless profile；自定义实例 profile
    // 必须先有 package.json，否则 CLI 会先打印地址再以 code 1 退出。
    config::instance::ensure_profile(&dsh_home, &instance.profile)?;

    // Windows 极简模式修复的自愈：插件已装入 profile 时确保 patch 挂载行与
    // minimal-win 用户 preset 落盘（幂等）。最佳努力：失败只告警，不阻断启动。
    if let Err(e) = win_inspector::apply(&app_handle) {
        log::warn!("win32 terminal support apply failed: {e}");
    }
    let mut envs: HashMap<String, String> = HashMap::new();
    envs.insert(
        "DSH_HOME".to_string(),
        dsh_home.to_string_lossy().into_owned(),
    );
    envs.insert("DSH_TELEMETRY_DISABLED".to_string(), "1".to_string());
    envs.insert("NO_COLOR".to_string(), "1".to_string());
    envs.insert("DSH_WEB_PORT".to_string(), available_port.to_string());
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/service/workflow/mod.rs:962-980](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/service/workflow/mod.rs#L962-L980)

回环启动及进程组

<details>
<summary>查看原文（19行）</summary>

```text
            cmd.arg(&dsh_binary_path)
                .arg("--profile")
                .arg(&instance.profile)
                .arg("--host")
                .arg("127.0.0.1")
                .arg("--port")
                .arg(available_port.to_string());
            if no_open {
                cmd.arg("--no-open");
            }
            cmd.envs(&envs)
                .current_dir(config::get_dsh_working_dir(&app_handle))
                // 核心修正：提供一个空的 stdin 防止 setRawMode 报错
                .stdin(Stdio::null())
                // 使用管道捕获输出，以便在子线程中读取
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                // 独立进程组让停止操作只影响 Harness 及其后代。
                .process_group(0);
```

</details>

#### 缺口

- 跨启动器进程的同home竞争未实测
  **影响**：实例表检查不能证明跨进程互斥
  **进一步探讨**：同时启动两个隔离启动器并观察写入者

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 协作 RPC 怎样确认完成和取消？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

协作向固定回环端口发送client-request，只有result.ok为true才取value，否则返回结构化错误。cancel_task调用session.cancel后返回，不额外等待会话终结或命令静止。README所称无需令牌属于本机信任设定，不能证明多本机用户隔离。workflow能捕获同端口带token的Web地址，与协作客户端未加认证头是不同路径；接收端的认证随下载的DSH版本而变。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/service/collab/mod.rs:99-131](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/service/collab/mod.rs#L99-L131)

RPC请求与响应

<details>
<summary>查看原文（33行）</summary>

```text
pub async fn rpc(port: u16, method: &str, payload: Value) -> Result<Value, String> {
    let url = format!("http://127.0.0.1:{port}/api/{method}");
    let body = json!({
        "type": "client-request",
        "rpcId": rpc_id(),
        "method": method,
        "payload": payload,
    });
    let response = rpc_client()?
        .post(&url)
        .json(&body)
        .send()
        .await
        .map_err(|error| format!("{method} request: {error}"))?;
    let envelope: Value = response
        .json()
        .await
        .map_err(|error| format!("{method} parse: {error}"))?;
    let result = envelope
        .get("result")
        .ok_or_else(|| format!("{method} missing result"))?;
    if result.get("ok").and_then(Value::as_bool) == Some(true) {
        return Ok(result.get("value").cloned().unwrap_or(Value::Null));
    }
    let code = result
        .pointer("/error/code")
        .and_then(Value::as_str)
        .unwrap_or("unknown");
    let message = result
        .pointer("/error/message")
        .and_then(Value::as_str)
        .unwrap_or("rpc failed");
    Err(format!("{code}: {message}"))
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/service/collab/mod.rs:269-272](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/service/collab/mod.rs#L269-L272)

取消只等RPC

```text
pub async fn cancel_task(port: u16, session_id: &str) -> Result<(), String> {
    rpc(port, "session.cancel", json!({ "sessionId": session_id })).await?;
    Ok(())
}
```

**依据 3 · 源码核查**：[src-tauri/src/service/workflow/mod.rs:694-716](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/service/workflow/mod.rs#L694-L716)

Web token捕获

<details>
<summary>查看原文（23行）</summary>

```text
pub(crate) fn capture_web_url(line: &str) {
    let Some(candidate) = line
        .split_whitespace()
        .find(|part| part.starts_with("http://") || part.starts_with("https://"))
    else {
        return;
    };
    let Ok(url) = reqwest::Url::parse(candidate) else {
        return;
    };
    let Some(port) = runtime_port() else {
        return;
    };
    let loopback = matches!(url.host_str(), Some("127.0.0.1" | "localhost" | "::1"));
    let has_token = url
        .query_pairs()
        .any(|(key, value)| key == "token" && !value.is_empty());
    if url.scheme() == "http" && loopback && url.port_or_known_default() == Some(port) && has_token
    {
        *runtime_web_url_slot()
            .lock()
            .unwrap_or_else(|error| error.into_inner()) = Some(url.into());
    }
```

</details>

**依据 4 · 作者声明**：[README.md:61-69](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/README.md#L61-L69)

作者的协作设定

```text
### 🤝 多实例协作：一支属于你的 Agent 团队

隔离保证互不干扰，而协作让这些隔离的实例真正一起干活。

在协作面板中，你可以像画流程图一样编排多个实例：每个节点是一个运行中的 DSH 实例，负责一段粗粒度任务；节点之间用依赖连线连接，父子节点按顺序执行，兄弟节点可以串行或并行；每个节点完成后，把产物（文本、文件路径）交给下游继续处理。

底层是一条轻量 RPC：主实例通过 loopback HTTP 接口（`POST /api/<method>`）向运行中的实例下发、轮询和取消任务。Host 限制为 `127.0.0.1`，信任边界清晰，无需额外令牌。

把一个大任务拆给几个各有所长的 Agent，各自在独立的 `DSH_HOME` 里推进，最后由主实例汇总。这就是一条可复用的多 Agent 流水线。
```

#### 缺口

- 下载运行时的真实接收权限与取消结果未验收
  **影响**：不能确认本机其他用户不可提交或cancel已静止
  **进一步探讨**：固定运行时后分别测试未授权请求及延迟命令取消

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

应用会首次下载Node及packaged Harness到Tauri数据目录，运行时不完全由根源码自包含。先选固定平台制品和空实例home，仅启一套，验证模型设置与会话落点，再复制相同配置启动第二套合成任务。下载、磁盘和模型费用未知；持续需维护客户端与下载宿主的版本组合。退出前明确停实例并检查子进程，再备份或移除测试home。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/resources/README.md:3-16](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/resources/README.md#L3-L16)

运行时来源和数据位置

<details>
<summary>查看原文（14行）</summary>

```text
This directory is bundled into the installer as `resources/**`.

At runtime, the application downloads everything it needs into the OS user-data
directory (the Tauri app-data dir for identifier
`io.github.baihejiangnan.dsh-launcher`, e.g. `%APPDATA%/io.github.baihejiangnan.dsh-launcher/` on Windows):

- `runtime/` — the bundled Node.js runtime (downloaded on first run)
- `dependencies/dsh/` — the packaged DeepSeek Harness distribution (downloaded from the
  `hairyf/deepseek-harness-pkg` release feed)
- instance homes — each registered instance uses its explicitly configured `DSH_HOME`
- `logs/` — application and `dsh` service logs
- `.store.dat` — desktop settings (port, auto-start, language, etc.)

No manual Node.js or pnpm installation is required.
```

</details>

**依据 2 · 作者声明**：[README.md:136-165](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/README.md#L136-L165)

发行使用与隐私说明

<details>
<summary>查看原文（30行）</summary>

````text
## 快速开始

- **安装版**：下载 [Windows 安装版](https://github.com/baihejiangnan/deepseek-harness-desktop/releases/download/v0.0.15/DSH.Launcher_0.0.15_x64-setup.exe)，安装后从开始菜单或桌面快捷方式启动。
- **免安装版（Windows x64）**：直接下载 [Windows 便携版](https://github.com/baihejiangnan/deepseek-harness-desktop/releases/download/v0.0.15/DSH-Launcher_0.0.15_windows_x64_portable.exe)，双击即可运行，无需安装。

无需手动安装 Node.js 或 DSH。首次启动实例时，启动器会自动检测并联网下载缺少的运行环境；已有兼容环境会优先复用。

> Release 同时提供 Windows、macOS 和 Linux 构建包。当前主要桌面验收平台为 Windows；macOS / Linux 构建成功不代表已完成所有真机功能验证。

首次安装、插件、协作、备份和故障处理见 [使用指南](docs/USER_GUIDE.md)。

## 项目文档

- [架构与数据流](docs/ARCHITECTURE.md) · [Tauri 接口契约](docs/IPC_CONTRACTS.md)
- [视觉规范](docs/DESIGN.md) · [开发说明](docs/DEVELOPMENT.zh.md) · [发布检查](docs/RELEASING.md)
- [AI 开发约束](AGENTS.md) · [当前待办与已知限制](TODO.md)

## 从源码构建

```bash
pnpm install
pnpm tauri dev                 # 开发调试
pnpm tauri build --bundles nsis   # 产出 Windows 安装包
```

安装包输出到 `src-tauri/target/release/bundle/nsis/`。Windows 免安装版 exe（直接双击运行，无需安装）可从 [v0.0.15 Release](https://github.com/baihejiangnan/deepseek-harness-desktop/releases/tag/v0.0.15) 下载。开发细节见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)。

## 隐私边界

API Key、Token、密码、会话、DSH Home、Profile、日志、缓存和本地设置**不会**进入仓库或发布包。`dist`、`src-tauri/target`、`node_modules` 等构建目录已被忽略。源码仓库只包含项目代码、构建配置、文档、公开静态资源和发行包。
````

</details>

#### 缺口

- 首次下载版本、平台停止和恢复未实测
  **影响**：无法支持默认共享真实凭据的持续采用
  **进一步探讨**：记录下载版本、哈希、进程和目录后做退出核对

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少取消已接受被误当已停止？

**研究主题**：新假设与验证

#### 完整回答

可在cancel_task的RPC成功后继续读会话终结事件，并展示取消已接受与已确认终止。对照当前仅返回成功的路径，使用无网络等待任务注入回复丢失、取消拒绝及延迟终结，比较误停止和等待耗时。若会话事件不能证明子进程静止，仍需进程级读回；不能靠新增提示证明安全。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/service/collab/mod.rs:269-272](https://github.com/baihejiangnan/deepseek-harness-desktop/blob/8cabeda2610c368593144881f94ef25b38461e33/src-tauri/src/service/collab/mod.rs#L269-L272)

当前取消边界

```text
pub async fn cancel_task(port: u16, session_id: &str) -> Result<(), String> {
    rpc(port, "session.cancel", json!({ "sessionId": session_id })).await?;
    Ok(())
}
```

#### 缺口

- 会话和运行时终止事件关系未知
  **影响**：可能只能改善显示而无法确认副作用停止
  **进一步探讨**：先核对固定DSH取消协议再做计数实验

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
