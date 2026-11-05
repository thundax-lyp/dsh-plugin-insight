# dsh-tether

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b68c5e3](https://github.com/zexadev/dsh-tether/tree/b68c5e397d48cb2a871205ab669d8adb70908751)

<!-- BEGIN META -->
[![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zexadev/dsh-tether) [![npm 30d 3,158](https://img.shields.io/static/v1?label=npm+30d&message=3%2C158&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-tether) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-tether)
<!-- END META -->

> **功能**：手机客户端经配对 iroh sidecar 使用电脑 DSH，Android 支持本地 runtime。

> **亮点**：[Q01](#research-q01) 手机继续完整 DSH 工作流并提供本地运行选项。

> **主要限制**：[Q02](#research-q02) 配对撤销持久化失败仅记日志，重启状态需验。

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
  - [Q01 · 离开电脑网络后怎样继续 DSH 会话？](#detail-section-11)
  - [Q02 · 配对撤销与 Host 失联有哪些边界？](#detail-section-12)
  - [Q03 · 如何验证远程与本地模式？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户离开电脑网络仍需查看任务、审批和设置。

在局域网访问网页或另配远程桌面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程 | 手机继续电脑会话 | 配对与 Host 在线 |
| 本地 | Android 执行 DSH | 单独 runtime 和存储 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 手机客户端及匹配 sidecar | 远程必需 | 配对和转发 | 版本平台需对应 |
| Android runtime | 本地模式必需 | 手机执行 DSH | 独立于电脑任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配对 | 测试工作区绑定设备 | 核对身份 |
| 跨网 | 运行和审批 | 记录路径与断线 |
| 撤销 | 移除设备并重启 | 确认仍被拒绝 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载成本未知 | 装客户端和 sidecar | iOS 签名另验 |
| 持续 | 资源未知 | 电量、网络及版本管理 | 路径随网络变化 |
| 失败 | 恢复工时未知 | 回电脑并核查授权 | 检查配对持久化 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 移动跟进 | 完整 DSH 界面 | 真实连通率和电池开销 |

> **思考**：[Q02](#research-q02) 配对撤销持久化失败仅记日志，重启状态需验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 手机继续完整 DSH 工作流并提供本地运行选项。

[Q02](#research-q02) 配对撤销立即断连接，落盘失败需重启核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 配对撤销持久化失败仅记日志，重启状态需验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先跨网和撤销测试，再接日常工作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定桥接及本地启动源码支持主路径，未运行设备。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、app/src-tauri/src/local.rs、host/src/main.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根项目插件、Rust 认证和 Android 启动，未真机或联网。
- 下一步：跨网、双设备、休眠、撤销落盘故障及重启。

**分析版本**

- **仓库**：[zexadev/dsh-tether](https://github.com/zexadev/dsh-tether)
- **版本号**：0.1.25（[固定提交 b68c5e3](https://github.com/zexadev/dsh-tether/tree/b68c5e397d48cb2a871205ab669d8adb70908751)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 跨网对照连通、后台恢复和撤销。

跨网、双设备、休眠、撤销落盘故障及重启。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 838 | — | — | 17916 |
| .js | source | 4 | 1541 | 1199 | 251 | — |
| .mjs | source | 9 | 954 | 684 | 224 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/zexadev/dsh-tether/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否在手机上继续电脑 DSH，并按需在 Android 本机运行？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 离开电脑网络后怎样继续 DSH 会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根项目交付手机客户端及电脑插件，电脑 sidecar 使用 iroh 建连，把完整 DSH Web 经代理交给手机；Android 本地模式另外解压 runtime 启动 Node。相对远程桌面或只在局域网打开网页，直接提供 DSH 操作界面；实际任务仍在当前选中的电脑或手机执行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-45](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/README.md#L35-L45)

远程及本地场景。

<details>
<summary>查看原文（11行）</summary>

```text
DSH Tether carries the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) web interface to your phone over a direct peer-to-peer connection. The agent keeps running on the machine your code lives on, and the phone gets DSH's own full interface — conversations, tool calls, approvals and settings, not a reimplementation of them. Pair once with a 6-digit code; after that the two ends find each other whatever network they are on.

When there is no machine around, the same app can run DSH on the phone itself (Android) — see [Local mode](#local-mode-no-machine-needed-android).

## The case it solves

**You are not on your machine's network, and you do not want a server in the middle.**

Reaching your own dev machine from a phone usually asks for one of two things: both ends on the same LAN, or a relay you deploy, configure and trust. This asks for neither. The two ends hole-punch to each other through [iroh](https://www.iroh.computer/), and once they do, nothing passes through a third party; the fallback relay only ever carries ciphertext it cannot read.

If you only use your phone on the same Wi-Fi as your machine, you don't need any of this — a LAN setup is simpler.
```

</details>

**依据 2 · 源码核查**：[index.js:184-203](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/index.js#L184-L203)

sidecar 目标和进程启动。

<details>
<summary>查看原文（20行）</summary>

```text
  // host 从 0.2.1-alpha.2 起可以是任意字面地址:IPv6 的要带方括号,否则 sidecar 那边按
  // SocketAddr 解析 --proxy-target 直接失败(`::1:3000` 不是合法写法)
  const host = ctx.webServer.host.includes(':') ? `[${ctx.webServer.host}]` : ctx.webServer.host
  const proxyTarget = `${host}:${ctx.webServer.port}`

  // sidecar 的人读日志与这里打在同一个终端上,语言跟着走,免得一半中文一半英文
  const args = ['host', '--proxy-target', proxyTarget, '--lang', terminalZh ? 'zh' : 'en']
  if (config.pair) args.push('--pair')
  // windowsHide:dsh desktop 的插件宿主是 ELECTRON_RUN_AS_NODE 跑的 Electron,GUI 子系统、自己没有
  // console,于是 Windows 给这个 console 子系统的 sidecar 分配一个新 console 并把窗口显示出来。该
  // 选项让 libuv 传 SW_HIDE,新分配的窗口不显示;stderr 的 inherit 不受影响,在终端里跑 dsh 时
  // sidecar 的日志照旧打在同一个终端
  const child = spawn(binary, args, { stdio: ['pipe', 'pipe', 'inherit'], windowsHide: true })
  ctx.effect(() => () => { child.kill() })
  /** sidecar 不在了的原因;undefined = 活着。等它回话的路由用来立即报错 */
  let sidecarGone
  child.on('exit', (code) => {
    // sidecar 死了必须可见:手机端会静默失联,而电脑侧一切照常
    sidecarGone = tt(`sidecar 已退出(code=${code})`, `the sidecar exited (code=${code})`)
    console.error(`[tether] ${tt(`sidecar 退出 code=${code};手机端已失联`, `the sidecar exited with code=${code}; the phone is now cut off`)}`)
```

</details>

**依据 3 · 源码核查**：[app/src-tauri/src/local.rs:246-267](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/app/src-tauri/src/local.rs#L246-L267)

Android 本地启动入口。

<details>
<summary>查看原文（22行）</summary>

```text
/// 起本机 dsh:解压(如需)→ spawn node → 等就绪行 → 换 cookie → 起代理。
/// 返回代理 URL,WebView 加载它即可。
pub async fn start(app: &AppHandle) -> Result<(LocalHost, String)> {
    let layout = layout()?;
    let node = node_binary(&layout);
    if !node.is_file() {
        bail!("{}", t("这个构建不含本地运行时", "this build carries no local runtime"));
    }
    let runtime = runtime_dir(app)?;
    if !runtime_ready(&layout.apk, &runtime) {
        emit(app, "extracting", t("首次使用,正在解压运行时…", "First run: unpacking the runtime…"));
        let app2 = app.clone();
        let apk = layout.apk.clone();
        let dir = runtime.clone();
        tauri::async_runtime::spawn_blocking(move || extract_runtime(&app2, &apk, &dir))
            .await
            .context(t("解压任务中断", "the unpacking task was interrupted"))??;
    }
    let data = data_dir(app)?;
    let home = data.join("dsh-home");
    ensure_dsh_home(&runtime, &home)?;
    let tmp = data.join("tmp");
```

</details>

#### 缺口

- 未测跨网、移动端与后台运行
  **影响**：连通率和电量开销未知
  **进一步探讨**：独立电脑和手机验收跨网审批与断线

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对撤销与 Host 失联有哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Host 通过 iroh 的远端身份查配对列表，再做首条消息及窗口码验证。删除设备会更新内存白名单并关闭连接，但保存列表失败只打印错误，需验证重启是否恢复旧授权。Node 插件检测到 sidecar 退出会显示失联，HTTPS Host 则明确拒绝该代理路径。

#### 证据与依据

**依据 1 · 源码核查**：[host/src/main.rs:471-487](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/host/src/main.rs#L471-L487)

身份和受限首行。

<details>
<summary>查看原文（17行）</summary>

```text
async fn handle_phone(
    incoming: iroh::endpoint::Incoming,
    state: Arc<Mutex<HostState>>,
    proxy_target: Option<std::net::SocketAddr>,
) -> Result<()> {
    let conn = incoming.await.context(t("接受连接失败", "failed to accept the connection"))?;
    let remote = conn.remote_id().to_string();
    let paired = { state.lock().await.store.devices.iter().any(|d| d.id == remote) };
    let (mut send, mut recv) = conn.accept_bi().await.context(t("接受控制流失败", "failed to accept the control stream"))?;

    let first = tokio::time::timeout(
        Duration::from_secs(15),
        read_line_bounded(&mut recv, if paired { MAX_LINE } else { MAX_UNPAIRED_LINE }),
    )
    .await
    .context(t("等待首行超时", "timed out waiting for the first line"))??;
    let hello: Wire = serde_json::from_str(&first).context(t("首行不是合法消息", "the first line is not a valid message"))?;
```

</details>

**依据 2 · 源码核查**：[host/src/main.rs:489-525](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/host/src/main.rs#L489-L525)

窗口码验证与记录。

<details>
<summary>查看原文（37行）</summary>

```text
    let device_name = match (paired, hello) {
        (true, Wire::Hello { name }) => name,
        (false, Wire::Pair { code, name }) => {
            let mut s = state.lock().await;
            let verdict = match &mut s.pairing {
                None => Err(PAIR_NO_WINDOW),
                Some(w) if tokio::time::Instant::now() > w.deadline => Err(PAIR_EXPIRED),
                Some(w) if w.attempts >= PAIRING_MAX_ATTEMPTS => Err(PAIR_TOO_MANY_ATTEMPTS),
                Some(w) => {
                    w.attempts += 1;
                    if w.code == code { Ok(()) } else { Err(PAIR_BAD_CODE) }
                }
            };
            match verdict {
                Ok(()) => {
                    s.pairing = None;
                    s.store.devices.push(PairedDevice {
                        id: remote.clone(),
                        name: name.clone(),
                        paired_at: chrono_now(),
                    });
                    let (path, store) = (s.store_path.clone(), &s.store);
                    save_store(&path, store).context(t("写入配对白名单失败", "cannot write the paired-device list"))?;
                    emit(&PluginOut::PairingDone { peer: remote.clone(), name: name.clone() });
                    drop(s);
                    write_line(&mut send, &serde_json::to_string(&Wire::PairOk)?).await?;
                    name
                }
                Err(reason) => {
                    // 3 次错完关窗:6 位码空间 1e6,窗口内只许猜 3 次
                    if s.pairing.as_ref().is_some_and(|w| w.attempts >= PAIRING_MAX_ATTEMPTS) {
                        s.pairing = None;
                        emit(&PluginOut::PairingClosed { reason: PAIR_TOO_MANY_ATTEMPTS.into() });
                    }
                    drop(s);
                    write_line(&mut send, &serde_json::to_string(&Wire::PairFail { reason: reason.into() })?).await?;
                    // finish + 短等:让 PairFail 行先于连接关闭到达对端,失败原因不被 close 吃掉
```

</details>

**依据 3 · 源码核查**：[host/src/main.rs:423-435](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/host/src/main.rs#L423-L435)

撤销、持久化失败与断开。

<details>
<summary>查看原文（13行）</summary>

```text
            PluginIn::DeviceForget { id } => {
                let mut s = state.lock().await;
                s.store.devices.retain(|d| d.id != id);
                let (path, store) = (s.store_path.clone(), &s.store);
                if let Err(e) = save_store(&path, store) {
                    eprintln!("[host] {}{e:#}", t("写入配对白名单失败: ", "cannot write the paired-device list: "));
                }
                // 移出白名单只挡下次连接。此刻正连着的那条必须主动断,
                // 否则「移除」在设备下线前完全不生效。
                if let Some(peer) = s.conns.remove(&id) {
                    peer.conn.close(1u8.into(), b"forgotten");
                }
                emit(&PluginOut::Devices { devices: device_views(&s) });
```

</details>

**依据 4 · 源码核查**：[index.js:175-203](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/index.js#L175-L203)

HTTPS 限制与 sidecar 退出。

<details>
<summary>查看原文（29行）</summary>

```text
  if ((ctx.webServer.protocol ?? 'http:') !== 'http:') {
    throw new Error(
      `[tether] ${tt(
        'dsh web 开了 TLS(https),而手机走的代理流只能转明文 HTTP,连上只会白屏。去掉 webServer 的 tls 配置再用手机连接。',
        'dsh web is serving HTTPS, but the proxy stream the phone uses can only carry plain HTTP — the phone would get a blank page. Remove the tls config from webServer before connecting the phone.',
      )}`,
    )
  }
  // webServer.port 是真实监听端口(config 写 0 时为 OS 分配值),手机由此拿到完整界面。
  // host 从 0.2.1-alpha.2 起可以是任意字面地址:IPv6 的要带方括号,否则 sidecar 那边按
  // SocketAddr 解析 --proxy-target 直接失败(`::1:3000` 不是合法写法)
  const host = ctx.webServer.host.includes(':') ? `[${ctx.webServer.host}]` : ctx.webServer.host
  const proxyTarget = `${host}:${ctx.webServer.port}`

  // sidecar 的人读日志与这里打在同一个终端上,语言跟着走,免得一半中文一半英文
  const args = ['host', '--proxy-target', proxyTarget, '--lang', terminalZh ? 'zh' : 'en']
  if (config.pair) args.push('--pair')
  // windowsHide:dsh desktop 的插件宿主是 ELECTRON_RUN_AS_NODE 跑的 Electron,GUI 子系统、自己没有
  // console,于是 Windows 给这个 console 子系统的 sidecar 分配一个新 console 并把窗口显示出来。该
  // 选项让 libuv 传 SW_HIDE,新分配的窗口不显示;stderr 的 inherit 不受影响,在终端里跑 dsh 时
  // sidecar 的日志照旧打在同一个终端
  const child = spawn(binary, args, { stdio: ['pipe', 'pipe', 'inherit'], windowsHide: true })
  ctx.effect(() => () => { child.kill() })
  /** sidecar 不在了的原因;undefined = 活着。等它回话的路由用来立即报错 */
  let sidecarGone
  child.on('exit', (code) => {
    // sidecar 死了必须可见:手机端会静默失联,而电脑侧一切照常
    sidecarGone = tt(`sidecar 已退出(code=${code})`, `the sidecar exited (code=${code})`)
    console.error(`[tether] ${tt(`sidecar 退出 code=${code};手机端已失联`, `the sidecar exited with code=${code}; the phone is now cut off`)}`)
```

</details>

#### 缺口

- 持久化撤销故障未复跑
  **影响**：重启后授权状态可能不同
  **进一步探讨**：模拟配对文件写失败后撤销和 Host 重启

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验证远程与本地模式？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先以测试工作区从局域网配对，再切蜂窝网络确认路径与延迟，分别做批准、拒绝、撤销及重启。Android 本地模式单独测启动、休眠和文件位置，对照电脑运行结果。若授权状态或后台任务结果不明，就回电脑原界面处理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-66](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/README.md#L58-L66)

客户端与 sidecar 安装形式。

```text
## Download and install

| Where | Download | How |
| --- | --- | --- |
| Machine | — | `dsh plugin --profile web add dsh-plugin-tether` |
| Phone | `dsh-tether-<version>-arm64.apk` from the [Release](../../releases/latest) | Signed — install it directly; local mode included |
| Phone (iOS) | `dsh-tether-<version>-ios-unsigned.ipa` from the [Release](../../releases/latest) | **Beta**, unsigned — sign it yourself |

The plugin carries a small Rust sidecar that owns the iroh connection, shipped as one package per platform; installing pulls only the one matching your system, with nothing to choose.
```

**依据 2 · 源码核查**：[app/src-tauri/src/local.rs:314-333](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/app/src-tauri/src/local.rs#L314-L333)

本地就绪、cookie 和代理。

<details>
<summary>查看原文（20行）</summary>

```text
    let (dsh_port, token) = match ready {
        Ok(Ok(Some(found))) => found,
        Ok(Ok(None)) => {
            let tail = log.lock().await.iter().rev().take(8).cloned().collect::<Vec<_>>();
            bail!("{}{}", t("本机 DSH 启动失败:", "DSH failed to start on this phone: "), tail.into_iter().rev().collect::<Vec<_>>().join(" | "))
        }
        Ok(Err(e)) => bail!("{}{e:#}", t("读取 DSH 输出失败:", "cannot read the DSH output: ")),
        Err(_) => bail!("{}", t("本机 DSH 90 秒内未就绪", "DSH did not become ready within 90 seconds")),
    };
    {
        let log = log.clone();
        tauri::async_runtime::spawn(async move {
            while let Ok(Some(line)) = lines.next_line().await {
                push_log(&log, line);
            }
        });
    }
    let cookie = exchange_cookie(dsh_port, &token).await?;
    let auth = Arc::new(ProxyAuth { cookie, authority: format!("127.0.0.1:{dsh_port}") });
    let (proxy_port, proxy_task) = start_proxy(dsh_port, auth).await?;
```

</details>

**依据 3 · 源码核查**：[host/src/main.rs:423-435](https://github.com/zexadev/dsh-tether/blob/b68c5e397d48cb2a871205ab669d8adb70908751/host/src/main.rs#L423-L435)

撤销验收点。

<details>
<summary>查看原文（13行）</summary>

```text
            PluginIn::DeviceForget { id } => {
                let mut s = state.lock().await;
                s.store.devices.retain(|d| d.id != id);
                let (path, store) = (s.store_path.clone(), &s.store);
                if let Err(e) = save_store(&path, store) {
                    eprintln!("[host] {}{e:#}", t("写入配对白名单失败: ", "cannot write the paired-device list: "));
                }
                // 移出白名单只挡下次连接。此刻正连着的那条必须主动断,
                // 否则「移除」在设备下线前完全不生效。
                if let Some(peer) = s.conns.remove(&id) {
                    peer.conn.close(1u8.into(), b"forgotten");
                }
                emit(&PluginOut::Devices { devices: device_views(&s) });
```

</details>

#### 缺口

- 实际跨网可用率及安装成本未知
  **影响**：无法比较运维与电池负担
  **进一步探讨**：两模式分开记录连通、恢复和撤销

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
