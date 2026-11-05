# dsh-studio

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b2e6b16](https://github.com/Moresyl/dsh-studio/tree/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e)

<!-- BEGIN META -->
[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Moresyl/dsh-studio)
<!-- END META -->

> **功能**：独立 Tauri 客户端监督本机 Harness，提供插件浏览和配对网关。

> **亮点**：[Q01](#research-q01) 用监督与退避流程替代手工重启。

> **主要限制**：[Q02](#research-q02) 网关和配对仍需实测暴露面与撤销。

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
  - [Q01 · 桌面用户如何减少本地 Harness 的进程管理？](#detail-section-11)
  - [Q02 · 移动接入与直接公开 Harness 有何实质区别？](#detail-section-12)
  - [Q03 · 如何衡量壳是否减少日常操作负担？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地 DSH 用户希望减少启动、排障和远程查看的操作。

终端启动 DSH 并用浏览器访问。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 进程监督 | 恢复退出和失联的服务 | 需平台实测 |
| 插件市场 | 搜索并核对包 | 安装交给 Harness |
| 配对网关 | 移动访问 | 需要核验网段与撤销 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持的桌面平台及 Harness | 核心必需 | 启动本机应用 | 版本或平台不符需核对 |
| 同网段设备 | 配对使用 | 通过网关连接 | 无需开启即可本机运行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 启动 | 在测试 profile 开本机服务 | 记录就绪和退出 |
| 演练 | 注入断线、退出和探测失败 | 核对恢复 |
| 接入 | 按需授权移动端 | 确认撤销和回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 安装应用和核对版本 | 按平台核对制品 |
| 持续 | 运行开销未知 | 维护桌面和 Host 版本 | 观察恢复 |
| 失败 | 耗时未知 | 回终端与浏览器 | 检查子进程和端口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 本地服务管理 | 集中启动和故障恢复 | 实际节时和可用率 |

> **思考**：[Q02](#research-q02) 网关和配对仍需实测暴露面与撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用监督与退避流程替代手工重启。

[Q02](#research-q02) 单独网关认证后访问 loopback，实际暴露另验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 网关和配对仍需实测暴露面与撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在测试 profile 对照原流程并验收进程恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代码支持独立客户端及监督网关，未运行目标。

- 已检查：作者 README、包清单、源码路径 README.md、src-tauri/src/harness/supervisor.rs、src-tauri/src/remote/gateway.rs、src-tauri/src/plugins/market.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Rust 监督、网关和市场源码，未运行客户端或安装包。
- 下一步：跨平台注入失败，测试配对过期、撤销和进程回收。

**分析版本**

- **仓库**：[Moresyl/dsh-studio](https://github.com/Moresyl/dsh-studio)
- **版本号**：0.9.26（[固定提交 b2e6b16](https://github.com/Moresyl/dsh-studio/tree/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照故障恢复时间和无谓重启。

跨平台注入失败，测试配对过期、撤销和进程回收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 110 | 8843 | — | — | 124906 |
| .mjs | source | 40 | 6840 | 6219 | 304 | — |
| .mjs | test | 30 | 3244 | 2979 | 74 | — |
| .js | source | 10 | 1435 | 1132 | 203 | — |
| .js | example | 1 | 16 | 10 | 3 | — |
| .md | example | 1 | 9 | — | — | 69 |
| .ts | source | 78 | 13379 | 10318 | 2015 | — |
| .ts | test | 69 | 9703 | 8640 | 125 | — |
| .cjs | source | 1 | 43 | 26 | 14 | — |
| .tsx | source | 63 | 16854 | 14373 | 1691 | — |
| .tsx | test | 11 | 585 | 498 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Moresyl/dsh-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面用户能否把手动管理的 DSH 服务交给本机壳，并按需受控接入？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面用户如何减少本地 Harness 的进程管理？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Studio 启动和监控独立 Harness。监督循环探测 HTTP，连续失联时结束子进程并走同一退避重启路径。作者列出进程树回收和跟随端口变化；本轮只确认固定代码中的监督路径。相对终端手工启动，它把检测和有限次重启交给桌面壳。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-63](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/README.md#L42-L63)

壳的工作边界。

<details>
<summary>查看原文（22行）</summary>

```text
|                                                                                                                                                                                                                                        |                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **⟳ Supervised, not just launched**<br>Backoff restart when it exits, and a real HTTP probe every 10 seconds to catch the harness that is alive but wedged. A restart lands on a new port and the window follows it.                   | **⛨ Managed process trees**<br>Every child joins a Windows job object or a POSIX process group, so the kernel reclaims the whole tree — including the grandchildren a plain kill would orphan, and even if the shell is killed outright. |
| **⬗ A plugin marketplace in the window**<br>Search the npm registry, see what a package declares before you commit to it, install into the hosted profile through the harness's own command. Disable a plugin without uninstalling it. | **▣ Your phone, without putting the agent on the network**<br>`dsh` stays on loopback, and that is not configurable. What opens is a separate gateway on one LAN address, paired by a QR code good for one device and two minutes.       |

## Why this exists

Session attachments support literal text, raster images and PDF previews, plus saving
the original file through the system save dialog. Harness must be running to
authorize the read. Original downloads are limited to 20 MiB and verified by
SHA-256 before an atomic write; text previews are limited to 1 MiB. Files are
saved without executing their contents. The PDF reader supports pagination, zoom,
password-protected files and selectable extracted text, with a 20 MiB file limit.
Its worker, fonts and decoders are bundled locally; PDF scripts are not executed.

`dsh` is a local web service. Running it from a terminal works, but it leaves you
managing a process by hand: finding a free port, noticing when it dies, and
cleaning up the tool subprocesses it leaves behind when it does.

DSH Studio makes that a window. The design goal is that the shell should be
**boring** — it starts the service, keeps it alive, and stays out of the way of
the harness UI.
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/harness/supervisor.rs:490-532](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/src-tauri/src/harness/supervisor.rs#L490-L532)

故障路径进入统一重启。

<details>
<summary>查看原文（43行）</summary>

```text
    }

    /// Watch a ready harness and bring it back if it dies — or goes quiet.
    async fn supervise(self: Arc<Self>, first: Child, plan: LaunchPlan) {
        let mut child = first;

        loop {
            let pid = child.id();
            let exit = tokio::select! {
                exit = child.wait() => exit,
                // A wedged harness is ended here rather than restarted here, so
                // recovery keeps going through the one backoff path below.
                reason = self.watch_health() => {
                    self.record(Stream::Stderr, format!("harness stopped answering: {reason}"));
                    let _ = child.kill().await;
                    child.wait().await
                }
            };
            if let Some(pid) = pid {
                if let Err(cause) = self.guard.finish(pid) {
                    self.record(
                        Stream::Stderr,
                        format!("could not finish reclaiming the harness process tree: {cause}"),
                    );
                }
            }
            if self.stopping.load(Ordering::SeqCst) {
                break;
            }

            self.record(
                Stream::Stderr,
                match exit {
                    Ok(status) => format!("harness exited unexpectedly ({status})"),
                    Err(cause) => format!("harness could not be waited on: {cause}"),
                },
            );

            match Arc::clone(&self).revive(&plan).await {
                Some(restarted) => child = restarted,
                None => break,
            }
        }
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/harness/supervisor.rs:539-591](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/src-tauri/src/harness/supervisor.rs#L539-L591)

健康探测和退避。

<details>
<summary>查看原文（53行）</summary>

```text
    /// One miss is not evidence: a probe can lose to a garbage collection pause
    /// or a saturated disk. Only a run of them is, so the count resets on every
    /// good reply and the caller is woken only when the run reaches its limit.
    async fn watch_health(&self) -> String {
        let mut misses = 0u32;

        loop {
            tokio::time::sleep(HEALTH_INTERVAL).await;

            // Between a restart and the next readiness there is nothing to probe.
            let Status::Ready { origin, .. } = self.status() else {
                misses = 0;
                continue;
            };

            match health::probe(&origin, HEALTH_TIMEOUT).await {
                Ok(()) => misses = 0,
                Err(reason) => {
                    misses += 1;
                    if misses >= HEALTH_MISS_LIMIT {
                        return reason;
                    }
                    self.record(
                        Stream::Stderr,
                        format!("health check missed ({misses}/{HEALTH_MISS_LIMIT}): {reason}"),
                    );
                }
            }
        }
    }

    /// Walk the backoff schedule until the harness comes back or it runs out.
    ///
    /// Returns `None` when the user asked to stop or every delay was spent.
    async fn revive(self: Arc<Self>, plan: &LaunchPlan) -> Option<Child> {
        for (index, &delay_ms) in RESTART_DELAYS_MS.iter().enumerate() {
            self.publish(Status::Restarting {
                attempt: index as u32 + 1,
                delay_ms,
            });
            tokio::time::sleep(Duration::from_millis(delay_ms)).await;
            if self.stopping.load(Ordering::SeqCst) {
                return None;
            }

            match Arc::clone(&self).launch_once(plan).await {
                Ok((child, origin)) => {
                    let pid = child.id().unwrap_or_default();
                    self.publish(Status::Ready { origin, pid });
                    return Some(child);
                }
                Err(failure) => self.record(Stream::Stderr, format!("restart failed: {failure}")),
            }
```

</details>

#### 缺口

- 没有崩溃或强杀后的现场记录
  **影响**：无法量化回收率或恢复时间
  **进一步探讨**：故障注入并观察子进程树、端口和前端恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 移动接入与直接公开 Harness 有何实质区别？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

网关单独监听并把认证连接转交 loopback 服务，配对凭据在每次请求参与核对。接入判断核对原始 authority，处理配对代码和已有凭据。实际暴露仍取决于监听网段、配置和浏览器环境。README 截图为作者隔离 QA 的界面示例。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/remote/gateway.rs:1-44](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/src-tauri/src/remote/gateway.rs#L1-L44)

网关信任边界和配对。

<details>
<summary>查看原文（44行）</summary>

```text
//! The door: an authenticated TCP relay from the local network to a service
//! that is still bound to loopback.
//!
//! The harness never learns any of this exists. It keeps its kernel-assigned
//! port on `127.0.0.1`, and this listener — started only when a person asks for
//! it — is the single place where a packet from another device can turn into a
//! packet to that port. What separates the two is a credential, and which
//! credentials exist is [`Access`]'s business rather than this module's: here a
//! request is read, asked about, and either carried or refused.
//!
//! Each HTTP connection is authenticated and gets loopback-owned credentials
//! in its first request head. Ordinary responses close the connection, so the
//! next request cannot bypass header rewriting. Streaming responses and upgraded
//! WebSockets keep relaying bytes until completion, shutdown or device revocation.

use std::sync::atomic::{AtomicU32, AtomicU64, Ordering};
use std::sync::Arc;
use std::time::Duration;

use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, watch, OwnedSemaphorePermit, Semaphore};

use super::access::Access;
use super::upstream::Upstream;

/// Cookie a device gets after pairing, and presents on every later request.
const COOKIE: &str = "dsh_studio_remote";

/// Query parameter carrying the pairing code in the scanned URL.
const PAIR_PARAM: &str = "k";

/// A request head larger than this is not one a browser sent.
const MAX_HEAD: usize = 16 * 1024;

/// How long a connection may take to produce a complete request head.
const HEAD_TIMEOUT: Duration = Duration::from_secs(20);
const MAX_CONNECTIONS: usize = 128;

/// How long a paired browser stays paired without rescanning.
const COOKIE_MAX_AGE: u32 = 60 * 60 * 12;

/// The externally visible origin is supplied by Studio, never by forwarded
/// request headers. Pending public gateways cannot consume pairing codes.
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/remote/gateway.rs:299-340](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/src-tauri/src/remote/gateway.rs#L299-L340)

原始 authority 与配对判断。

<details>
<summary>查看原文（42行）</summary>

```text
    /// A live pairing code was in the URL: hand this device a credential of its
    /// own and send it back without the code in the address.
    Pair { cookie: String, destination: String },
    /// The cookie named a device this door still knows: relay it.
    Forward { device: String },
    /// Neither: say so, and say nothing else.
    Refuse,
}

fn decide_for(head: &Head, access: &Access, audience: &Audience) -> Decision {
    // Check the browser's original authority before replacing Origin/Host for
    // the loopback service. Same-site requests from a different port are not
    // same-origin, even though the browser may attach the pairing cookie.
    if !head.trusted_origin(audience) {
        return Decision::Refuse;
    }
    // A code in the URL is the user saying which credential they mean, so a
    // stale QR presented by an already-paired phone is a refusal rather than a
    // quiet success on the cookie it happens to still hold.
    if let Some(offered) = head.query_code() {
        let agent = head.header("user-agent").unwrap_or_default();
        return match access.pair(&offered, agent) {
            Some(cookie) => Decision::Pair {
                cookie,
                destination: head.path_without_code(),
            },
            None => Decision::Refuse,
        };
    }

    match head
        .cookie_credential()
        .and_then(|held| access.admit(&held))
    {
        Some(device) => Decision::Forward { device },
        None => Decision::Refuse,
    }
}

/// One parsed request head, plus whatever body bytes arrived with it.
struct Head {
    line: String,
```

</details>

**依据 3 · 作者声明**：[README.md:29-45](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/README.md#L29-L45)

市场界面和 LAN 说明。

<details>
<summary>查看原文（17行）</summary>

```text
<img src="assets/plugin-install.png" width="820" alt="Plugin marketplace in the actual Windows desktop: responsive cards, readable metadata and installed-state badges">

**Browse cards, review compatibility, then install** — inspect the exact package
before installing through Harness's own plugin command. Installed layers can be
disabled without uninstalling them.

Screenshots show v0.9.19 in an isolated Windows QA environment. Local paths and
LAN addresses are blurred; screenshots illustrate the interface, not test coverage.

</div>

---

|                                                                                                                                                                                                                                        |                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **⟳ Supervised, not just launched**<br>Backoff restart when it exits, and a real HTTP probe every 10 seconds to catch the harness that is alive but wedged. A restart lands on a new port and the window follows it.                   | **⛨ Managed process trees**<br>Every child joins a Windows job object or a POSIX process group, so the kernel reclaims the whole tree — including the grandchildren a plain kill would orphan, and even if the shell is killed outright. |
| **⬗ A plugin marketplace in the window**<br>Search the npm registry, see what a package declares before you commit to it, install into the hosted profile through the harness's own command. Disable a plugin without uninstalling it. | **▣ Your phone, without putting the agent on the network**<br>`dsh` stays on loopback, and that is not configurable. What opens is a separate gateway on one LAN address, paired by a QR code good for one device and two minutes.       |
```

</details>

#### 缺口

- 未做端口和认证探测
  **影响**：无法确认真实局域网和代理部署的访问边界
  **进一步探讨**：测试未配对请求、过期码和撤销后的长连接

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何衡量壳是否减少日常操作负担？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

用非关键 profile 对照浏览器加终端与 Studio，先只开本机监督和市场浏览，核对需要装的真实包和兼容信息。注入进程退出和短暂探测失败，测恢复和误重启，再独立验收配对。若反复中断会话或不能解释安装来源，则维持原工作流。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/harness/supervisor.rs:539-591](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/src-tauri/src/harness/supervisor.rs#L539-L591)

观察恢复和误重启的机制。

<details>
<summary>查看原文（53行）</summary>

```text
    /// One miss is not evidence: a probe can lose to a garbage collection pause
    /// or a saturated disk. Only a run of them is, so the count resets on every
    /// good reply and the caller is woken only when the run reaches its limit.
    async fn watch_health(&self) -> String {
        let mut misses = 0u32;

        loop {
            tokio::time::sleep(HEALTH_INTERVAL).await;

            // Between a restart and the next readiness there is nothing to probe.
            let Status::Ready { origin, .. } = self.status() else {
                misses = 0;
                continue;
            };

            match health::probe(&origin, HEALTH_TIMEOUT).await {
                Ok(()) => misses = 0,
                Err(reason) => {
                    misses += 1;
                    if misses >= HEALTH_MISS_LIMIT {
                        return reason;
                    }
                    self.record(
                        Stream::Stderr,
                        format!("health check missed ({misses}/{HEALTH_MISS_LIMIT}): {reason}"),
                    );
                }
            }
        }
    }

    /// Walk the backoff schedule until the harness comes back or it runs out.
    ///
    /// Returns `None` when the user asked to stop or every delay was spent.
    async fn revive(self: Arc<Self>, plan: &LaunchPlan) -> Option<Child> {
        for (index, &delay_ms) in RESTART_DELAYS_MS.iter().enumerate() {
            self.publish(Status::Restarting {
                attempt: index as u32 + 1,
                delay_ms,
            });
            tokio::time::sleep(Duration::from_millis(delay_ms)).await;
            if self.stopping.load(Ordering::SeqCst) {
                return None;
            }

            match Arc::clone(&self).launch_once(plan).await {
                Ok((child, origin)) => {
                    let pid = child.id().unwrap_or_default();
                    self.publish(Status::Ready { origin, pid });
                    return Some(child);
                }
                Err(failure) => self.record(Stream::Stderr, format!("restart failed: {failure}")),
            }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/plugins/market.rs:57-82](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/src-tauri/src/plugins/market.rs#L57-L82)

市场数据检索。

<details>
<summary>查看原文（26行）</summary>

```text
pub async fn search(node: &Path, source_id: &str, options: SearchOptions<'_>) -> Result<Page> {
    let SearchOptions {
        query,
        category,
        sort,
        page,
        refresh,
        available,
    } = options;
    let normalized_query = query.trim().to_ascii_lowercase();
    let query_index = source_id == "npm" || source_id == super::catalog::DSHFIND_ID;
    let cache_key = if query_index {
        format!("{source_id}\0{normalized_query}")
    } else {
        source_id.to_string()
    };

    let cached = {
        let entries = cache().lock().await;
        entries
            .get(&cache_key)
            .filter(|entry| !refresh && entry.fetched_at.elapsed() < CACHE_LIFETIME)
            .cloned()
    };
    let entry = match cached {
        Some(entry) => entry,
```

</details>

**依据 3 · 作者声明**：[README.md:29-36](https://github.com/Moresyl/dsh-studio/blob/b2e6b167cb528716c5cc0b7ef2cea96ddeff251e/README.md#L29-L36)

实际安装入口及界面证据边界。

```text
<img src="assets/plugin-install.png" width="820" alt="Plugin marketplace in the actual Windows desktop: responsive cards, readable metadata and installed-state badges">

**Browse cards, review compatibility, then install** — inspect the exact package
before installing through Harness's own plugin command. Installed layers can be
disabled without uninstalling them.

Screenshots show v0.9.19 in an isolated Windows QA environment. Local paths and
LAN addresses are blurred; screenshots illustrate the interface, not test coverage.
```

#### 缺口

- 无独立跨系统用户反馈
  **影响**：收益和升级维护成本未知
  **进一步探讨**：在两种平台记录启动、恢复和回退

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
