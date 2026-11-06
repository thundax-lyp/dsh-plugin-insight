# Browser Bridge

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2a5ed83](https://github.com/hanelalo/browser-bridge/tree/2a5ed834987201bf6c210a51d36252d49f3e83d6)

<!-- BEGIN META -->
[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hanelalo/browser-bridge)
<!-- END META -->

> **功能**：通过本地WebSocket、Rust CLI/MCP与浏览器扩展连接Agent和真实浏览器，无需CDP。

> **亮点**：[Q02](#research-q02)、[Q04](#research-q04)提供真实浏览器桥、每窗口互斥/全局额度、在途取消draining与worker未知执行保留，较简单指令转发有恢复边界。

> **主要限制**：[Q03](#research-q03)WS自有握手仅角色自述且无Origin/token验证，HTTP可改非回环，广域扩展带任意脚本；[Q04](#research-q04)未知锁不等业务回滚/结果去重，不能接不可信调用方或敏感主profile。

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
  - [Q01 · 谁需要真实浏览器桥，DSH适配究竟在哪？](#detail-section-11)
  - [Q02 · 调用如何进入浏览器，并防并发任务抢窗口？](#detail-section-12)
  - [Q03 · 谁能连接bridge，回环监听足够认证吗？](#detail-section-13)
  - [Q04 · 超时/断线/重启怎样影响任务恢复与退出？](#detail-section-14)
  - [Q05 · 哪种机制可成为生产插件增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Browser Bridge是Rust工作区工具套件，含本地WS hub、CLI、共享transport/站点配方、stdio/HTTP MCP和WXT浏览器扩展，未见DSH原生Host/client入口。DSH等Agent需经通用MCP配置使用，不能称装上即获得DSH原生工具。作者用途是无CDP接现有真实浏览器；适合有登录态或动态页面、需要重复读取/交互并能信任调用方的人。成功是选定窗口/标签页上的具体任务和数据正确、未误触其他任务，而非工具列表多。

手工浏览、Playwright/CDP和DSH原生浏览器能力；Chrome登录态/扩展、MCP和Rust协议为已有技术。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP/CLI | Agent操作真实浏览器 | 非DSH原生，先配通用MCP |
| DOM/脚本/截图 | 动态内容读取与交互 | 广域权限，截图仅viewport |
| 窗口/任务锁 | 限并发与错窗口冲突 | 非账号/安全租户隔离 |
| unknown恢复 | 防取消后旧动作仍跑被抢占 | 结果不留，写任务需人工查 |
| 站点配方 | 重复提取编排 | 本次未逐配方验效果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Rust/cargo构建及server二进制 | 必需 | hub/CLI/MCP | 自动拉起仍需已构建 |
| Node/pnpm/WXT扩展与Chrome用户脚本 | 必需 | DOM/脚本执行 | 未加载/权限关闭失败 |
| MCP客户端配置 | Agent调用必需 | stdio或HTTP | 无DSH原生入口 |
| 可信本地调用方/隔离profile | 本文前提 | 避免广域账号控制 | client_id/窗口锁非身份认证 |
| 联动server/扩展版本 | 必需 | scope/执行同步 | 旧版本可fail closed |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离profile，审MCP/WS边界 | 不用主账号/不开放HTTP |
| 构建加载 | Rust和WXT分别构建、加载扩展 | server/扩展一起升级 |
| 调用 | stdio MCP只读，明确window/tab | 核真实页面结果，非仅MCP成功 |
| 故障 | 取消/worker重启/断线 | unknown不重放写操作，先查真实结果 |
| 清理 | 按归属关窗口，停server/MCP卸扩展 | 断开不等站点动作撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 机器/模型金额未知 | Rust/扩展构建、脚本权限和隔离 | 无CDP不等零配置 |
| 持续 | 浏览器/截图/token未知 | 配方变化、版本联动、窗口清理 | 无净节时对照 |
| 故障 | 保留锁/窗口资源未知 | 真实结果回查/unknown恢复 | 丢结果不等未执行 |
| 退出 | 留存未知 | 停服务卸扩展、清归属profile | 共享浏览器不自动退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 真实浏览器 | userScripts/截图接线 | 站点配方质量/登录兼容 |
| 并发边界 | scope/额度与执行journal | 实际时序和任务净收益 |
| 恢复 | draining/unknown保留 | 已完成丢结果的业务去重 |
| 隔离 | 调度窗口/标签归属 | 用户/账号安全隔离不存在保证 |

> **思考**：[Q03](#research-q03)WS自有握手仅角色自述且无Origin/token验证，HTTP可改非回环，广域扩展带任意脚本；[Q04](#research-q04)未知锁不等业务回滚/结果去重，不能接不可信调用方或敏感主profile。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)、[Q04](#research-q04)提供真实浏览器桥、每窗口互斥/全局额度、在途取消draining与worker未知执行保留，较简单指令转发有恢复边界。

窗口占有、取消draining、session journal元数据与server重连同步值得借鉴；完成结果不留要求调用者保留业务unknown，权限与认证需独立设计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)WS自有握手仅角色自述且无Origin/token验证，HTTP可改非回环，广域扩展带任意脚本；[Q04](#research-q04)未知锁不等业务回滚/结果去重，不能接不可信调用方或敏感主profile。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察；先隔离Chrome profile和stdio只读任务。禁止把可改bind的HTTP直接作多人服务，先核/补配对身份；失败先回真实页面查副作用，unknown不自动重放写任务。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持通用tool/MCP桥与保守未知执行设计；当前观察，自有握手认证与真实登录任务收益未验，不称DSH原生或生产隔离。

- 已检查：作者 README、包清单、源码路径 Cargo.toml、README.md、bridge-mcp/src/lib.rs、bridge-mcp/src/main.rs、extension/entrypoints/background.ts、extension/wxt.config.ts、server/src/hub.rs、server/src/main.rs、server/src/mcp_http.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/Cargo、stdio/HTTP MCP入口/身份、WS握手/监听、hub断线/取消/同步/额度、扩展权限与journal/真实run_script/截图；未完整审配方/定位、全部hub调度、transport/browser启动和外部rmcp防护。
- 下一步：只读固定源码，未构建/安装/运行目标、MCP或恶意页面；普通冒烟为scope_boundary，真实可达性/任务效果/恢复与收益是研究缺口。

**分析版本**

- **仓库**：[hanelalo/browser-bridge](https://github.com/hanelalo/browser-bridge)
- **版本号**：未声明（[固定提交 2a5ed83](https://github.com/hanelalo/browser-bridge/tree/2a5ed834987201bf6c210a51d36252d49f3e83d6)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的配对身份+站点动作范围+目标回执，在现有保守锁上对照伪角色/跨域/丢结果与恢复成本，不以更多配方代正确性。

只读固定源码，未构建/安装/运行目标、MCP或恶意页面；普通冒烟为scope_boundary，真实可达性/任务效果/恢复与收益是研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 682 | 598 | 51 | — |
| .mjs | test | 4 | 429 | 399 | 6 | — |
| .md | source | 4 | 2151 | — | — | 24454 |
| .ts | source | 6 | 2135 | 1899 | 141 | — |
| .mjs | source | 1 | 187 | 172 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hanelalo/browser-bridge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/hanelalo/browser-bridge/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hanelalo/browser-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核通用浏览器桥真实执行/并发恢复和控制方身份边界，判断DSH经MCP采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要真实浏览器桥，DSH适配究竟在哪？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Browser Bridge是Rust工作区工具套件，含本地WS hub、CLI、共享transport/站点配方、stdio/HTTP MCP和WXT浏览器扩展，未见DSH原生Host/client入口。DSH等Agent需经通用MCP配置使用，不能称装上即获得DSH原生工具。作者用途是无CDP接现有真实浏览器；适合有登录态或动态页面、需要重复读取/交互并能信任调用方的人。成功是选定窗口/标签页上的具体任务和数据正确、未误触其他任务，而非工具列表多。

相对手工浏览，它让Agent读取Markdown/a11y、执行交互/脚本和截图；相对Playwright/CDP，扩展无需调试端口但需浏览器加载及广域权限。MCP、Chrome扩展与Rust传输是成熟能力，本组件增量是窗口/任务调度、自动窗口归属与站点配方编排；没有自研模型/浏览器或已证明站点提取稳定性。README配方覆盖很多站点，本次只核统一桥和代表脚本/截图，不把目录当效果验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-58](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/README.md#L1-L58)

作者架构、构建/加载与client用途。

<details>
<summary>查看原文（58行）</summary>

````text
# Browser Bridge

通过 WebSocket 把本地工具和真实浏览器连接起来的桥，不需要 CDP。

扩展安装在浏览器里，作为"手"；server 是本地的 WebSocket 枢纽；client 是发指令的入口（Rust CLI），也可通过 bridge-mcp 暴露给 Claude / Cursor 等 agent。

## 项目结构

| 目录 | 技术 | 职责 |
|------|------|------|
| `extension/` | Vue 3 + TypeScript（WXT / Manifest V3） | 安装在浏览器里，执行指令 |
| `server/` | Rust（tokio + tokio-tungstenite） | WebSocket 枢纽，路由指令与响应；可选内置 MCP over HTTP |
| `client/` | Rust CLI（clap） | 发指令、打印结果 |
| `bridge-core/` | Rust 共享库 | 传输层（连接/自动拉起/重连）、元素定位、站点配方 |
| `bridge-mcp/` | Rust（rmcp，MCP server） | 把全部指令暴露为 MCP tools（stdio；`bridge-server` 复用同一套工具提供 HTTP 传输） |

## 快速开始

### 1. 启动 server

推荐用管理脚本后台常驻（server **不会自动退出**，多个 agent 共享同一个进程）：

```sh
./scripts/build.sh              # 首次先构建
./scripts/server.sh start       # 后台启动（start|stop|restart|status|logs）
./scripts/server.sh status
```

也可以前台跑，方便看日志：

```sh
cd server
cargo run            # 默认监听 ws://127.0.0.1:9225（MCP over HTTP 另开 9226）
# 换端口：BRIDGE_PORT=9226 cargo run
# 关闭 HTTP MCP：BRIDGE_HTTP_PORT=0 cargo run
```

### 2. 加载插件

```sh
cd extension
pnpm install
pnpm dev             # 会自动打开 Chrome 并加载开发版插件
```

也可以 `pnpm build` 后，在 `chrome://extensions` 打开"开发者模式"，加载 `extension/dist/chrome-mv3` 目录。

点击扩展弹窗里的「任务面板」，或从 Chrome 侧边栏打开 Browser Bridge，可以看到**当前窗口**里正在执行和排队的任务。排队数据在 bridge-server 上，server 与扩展需要一起升级。

### 3. 使用 client

client 连接失败时会**自动拉起 bridge-server**（需要已构建的二进制，可用 `BRIDGE_SERVER_BIN` 指定路径）；插件断线后按 500ms→5s 退避自动重连。

```sh
cd client
cargo run -- list-tabs
cargo run -- --window 5 list-tabs
cargo run -- navigate https://example.com
````

</details>

**依据 2 · 源码核查**：[Cargo.toml:1-3](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/Cargo.toml#L1-L3)

真实Rust工作区。

```text
[workspace]
resolver = "2"
members = ["server", "client", "bridge-core", "bridge-mcp"]
```

**依据 3 · 源码核查**：[bridge-mcp/src/main.rs:1-24](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/bridge-mcp/src/main.rs#L1-L24)

真正stdio MCP入口。

<details>
<summary>查看原文（24行）</summary>

```text
//! Browser Bridge MCP server：stdio 传输入口。
//! 工具实现与 HTTP 传输共用 `bridge-mcp` 的 lib（见 `src/lib.rs`）。

use bridge_mcp::BridgeMcp;
use rmcp::ServiceExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let server = std::env::var("BRIDGE_SERVER")
        .unwrap_or_else(|_| bridge_mcp::DEFAULT_SERVER.to_string());
    // 每个 MCP 进程一个稳定身份（多 agent 共享浏览器时用于标签页归属隔离）
    let client_id = BridgeMcp::new_client_id("mcp");
    let mcp = BridgeMcp::connect(&server, &client_id)
        .await
        .map_err(|error| format!("无法连接 {server}: {error}"))?;
    eprintln!("bridge-mcp connected to {server}");

    // Chrome is shared by concurrent clients. A process ending must never
    // quit the browser used by other tasks; task leases drain on disconnect.
    let service = mcp.serve(rmcp::transport::stdio()).await?;
    let waiting = service.waiting().await;
    waiting?;
    Ok(())
}
```

</details>

**依据 4 · 源码核查**：[extension/wxt.config.ts:1-12](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/wxt.config.ts#L1-L12)

浏览器扩展与权限。

<details>
<summary>查看原文（12行）</summary>

```text
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  outDir: 'dist',
  manifest: {
    name: 'Browser Bridge',
    description: '通过 WebSocket 桥接本地工具与真实浏览器（无需 CDP）',
    permissions: ['tabs', 'scripting', 'activeTab', 'userScripts', 'storage', 'offscreen', 'sidePanel'],
    host_permissions: ['<all_urls>'],
  },
});
```

</details>

#### 缺口

- 真实登录站点提取、DSH MCP兼容与同任务收益未执行。
  **影响**：不以无CDP或配方数量推出更稳定/省时。
  **进一步探讨**：在独立浏览器profile对照手工或Playwright同一无敏感任务，核数据和交互结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调用如何进入浏览器，并防并发任务抢窗口？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

stdio入口生成mcp-pid-time身份并连接共享WS；HTTP服务只生成一个mcp-http client_id并克隆同一个BridgeMcp用于全部请求，因此HTTP不同远端调用者不自动拥有各自独立MCP进程身份。WS main把Role/请求转入hub，hub默认全局最多3个running、同窗口占有互斥，显式租约支持跨调用任务。client_id与窗口归属是调度信息，不能当认证主体。

扩展收命令先处理目标解析/执行同步，普通动作要求server给_window_ids且资源未满/无窗口冲突；先把running元数据写chrome.storage.session，写失败不执行，再validateExecutionScope→execute→删除journal→回response。实际run_script取code用new Function构造后经userScripts.execute执行并序列化结果；截图限速500ms槽位、切目标tab激活后captureVisibleTab，仅可见区域，必要时聚焦会影响用户前台。代码执行/点击可触发真实登录站点副作用，不是只读采集接口。

server和扩展共同校验范围/额度比仅客户端队列稳，但不代表不同Agent可隔离账号、cookies或秘密；同浏览器profile仍共享登录态，显式window/tab选择也可操作别的窗口。

#### 证据与依据

**依据 1 · 源码核查**：[bridge-mcp/src/main.rs:8-21](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/bridge-mcp/src/main.rs#L8-L21)

stdio真实身份/连接。

<details>
<summary>查看原文（14行）</summary>

```text
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let server = std::env::var("BRIDGE_SERVER")
        .unwrap_or_else(|_| bridge_mcp::DEFAULT_SERVER.to_string());
    // 每个 MCP 进程一个稳定身份（多 agent 共享浏览器时用于标签页归属隔离）
    let client_id = BridgeMcp::new_client_id("mcp");
    let mcp = BridgeMcp::connect(&server, &client_id)
        .await
        .map_err(|error| format!("无法连接 {server}: {error}"))?;
    eprintln!("bridge-mcp connected to {server}");

    // Chrome is shared by concurrent clients. A process ending must never
    // quit the browser used by other tasks; task leases drain on disconnect.
    let service = mcp.serve(rmcp::transport::stdio()).await?;
    let waiting = service.waiting().await;
```

</details>

**依据 2 · 源码核查**：[bridge-mcp/src/lib.rs:35-60](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/bridge-mcp/src/lib.rs#L35-L60)

身份生成是pid/time。

<details>
<summary>查看原文（26行）</summary>

```text
pub struct BridgeMcp {
    bridge: Bridge,
    client_id: String,
}

impl BridgeMcp {
    /// 用已建立的 bridge 传输构造工具集。
    pub fn new(bridge: Bridge, client_id: impl Into<String>) -> Self {
        Self {
            bridge,
            client_id: client_id.into(),
        }
    }

    /// 生成每个调用方独立的稳定身份（多 agent 共享浏览器时用于标签页归属隔离）。
    pub fn new_client_id(prefix: &str) -> String {
        format!(
            "{prefix}-{}-{:x}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_nanos())
                .unwrap_or(0)
        )
    }

```

</details>

**依据 3 · 源码核查**：[server/src/mcp_http.rs:43-64](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/mcp_http.rs#L43-L64)

HTTP单client_id/同mcp clone、无MCP会话。

<details>
<summary>查看原文（22行）</summary>

```text
        Ok(mcp) => mcp,
        Err(error) => {
            eprintln!("[mcp-http] 无法连接本机 hub {ws_url}: {error}；HTTP MCP 不可用");
            return;
        }
    };

    let service: StreamableHttpService<BridgeMcp, LocalSessionManager> =
        StreamableHttpService::new(
            move || Ok(mcp.clone()),
            Arc::new(LocalSessionManager::default()),
            // 无状态：不签发 Mcp-Session-Id，也不校验它。
            // 否则 rmcp 的会话默认 5 分钟无活动就被回收，客户端拿着旧 session id
            // 再来请求就是 404 "Session not found"（server 重启同样会命中）。
            // 本服务的工具状态都在 hub / 工具参数里，不依赖 MCP 会话，
            // 所以逐请求直接服务即可。
            StreamableHttpServerConfig::default().with_legacy_session_mode(false),
        );
    eprintln!("[mcp-http] MCP over HTTP listening on http://{addr}{MCP_PATH}");

    loop {
        let (stream, peer) = match listener.accept().await {
```

</details>

**依据 4 · 源码核查**：[server/src/hub.rs:1-12](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/hub.rs#L1-L12)

额度/租约常量。

<details>
<summary>查看原文（12行）</summary>

```text
//! A single-owner scheduler: admission, deadlines and completion are all
//! handled in this actor, never in detached semaphore waiters.
use crate::{Role, WireMessage};
use serde_json::{json, Value};
use std::collections::{HashMap, HashSet, VecDeque};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tokio::{sync::mpsc, time::Instant};
use tokio_tungstenite::tungstenite::Message;

const MAX_RUNNING: usize = 3;
const DEFAULT_TIMEOUT: Duration = Duration::from_secs(60);
const LEASE_IDLE_TIMEOUT: Duration = Duration::from_secs(60);
```

</details>

**依据 5 · 源码核查**：[extension/entrypoints/background.ts:318-374](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L318-L374)

扩展真实目标/额度/journal/执行/回执。

<details>
<summary>查看原文（57行）</summary>

```text
  if (msg.method === 'ping') {
    send(socket, { id: msg.id, success: true, result: { pong: true } });
    return;
  }

  try {
    await stateReady;
    const clientId = typeof msg.client_id === 'string' ? msg.client_id : '';
    if (msg.method === '_resolve_target') {
      const p = msg.params ?? {};
      const result = await resolveTarget(String(p.method ?? ''), (p.params ?? {}) as Record<string, unknown>, clientId);
      send(socket, { id: msg.id, success: true, result });
      return;
    }
    if (msg.method === '_sync_executions') {
      const ids = Array.isArray(msg.params?.ids) ? msg.params.ids as string[] : [];
      send(socket, { id: msg.id, success: true, result: await syncExecutions(ids) });
      return;
    }
    if (msg.method === 'list_tabs' || msg.method === 'list_windows') {
      send(socket, { id: msg.id, success: true, result: await execute(msg.method, msg.params ?? {}, clientId) });
      return;
    }
    if (executions.has(msg.id)) return; // An unfinished dispatch is still occupying its window.
    const windows = msg.params?._window_ids;
    if (!Array.isArray(windows) || windows.some((id) => typeof id !== 'number')) {
      throw new Error('server must resolve and admit the target before execution; update bridge-server');
    }
    if (executions.size >= 3) {
      throw new Error('browser execution capacity is still reserved by running or unresolved operations');
    }
    for (const record of executions.values()) {
      if (record.window_ids.some((id) => windows.includes(id))) {
        throw new Error('window still has an executing or unresolved browser operation');
      }
    }
    // Persist before starting browser code. After a service-worker restart a
    // running entry becomes unknown, never assumed to have stopped.
    const record: ExecutionRecord = { state: 'running', window_ids: windows as number[] };
    executions.set(msg.id, record);
    try {
      await saveExecutionJournal();
    } catch (error) {
      executions.delete(msg.id);
      throw error;
    }
    let response: Record<string, unknown>;
    try {
      await validateExecutionScope(msg.method, msg.params ?? {}, record.window_ids);
      const result = await execute(msg.method, msg.params ?? {}, clientId);
      response = { id: msg.id, success: true, result };
    } catch (error) {
      response = { id: msg.id, success: false, error: error instanceof Error ? error.message : String(error) };
    }
    executions.delete(msg.id);
    await saveExecutionJournal().catch(() => {});
    send(ws?.readyState === WebSocket.OPEN ? ws : socket, response);
```

</details>

**依据 6 · 源码核查**：[extension/entrypoints/background.ts:706-763](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L706-L763)

实际JS构造与userScripts返回。

<details>
<summary>查看原文（58行）</summary>

```text
async function runScript(params: Record<string, unknown>, clientId = ''): Promise<unknown> {
  const tab = await resolveTab(params.tab_id as number | undefined, clientId, requestedWindowId(params));
  if (tab.id == null) throw new Error('tab has no id');
  const code = String(params.code ?? '');
  if (!code) throw new Error('run_script requires params.code');

  // 优先：userScripts.execute 按需注入（当前页面无需刷新）
  if (chrome.userScripts?.execute) {
    await ensureEvalUserScript();
    const injected = `
      (async () => {
        const __serialize = (v, seen = new Set()) => {
          if (v === null || v === undefined) return v ?? null;
          const t = typeof v;
          if (t === 'string' || t === 'boolean') return v;
          if (t === 'number') return Number.isFinite(v) ? v : String(v);
          if (t === 'bigint') return v.toString();
          if (v instanceof Element) {
            return {
              __element: v.tagName.toLowerCase(),
              id: v.id || null,
              text: (v.textContent ?? '').trim().slice(0, 300),
            };
          }
          if (Array.isArray(v)) {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
            return v.map((x) => __serialize(x, seen));
          }
          if (t === 'object') {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
            const out = {};
            for (const [k, x] of Object.entries(v)) out[k] = __serialize(x, seen);
            return out;
          }
          return String(v);
        };
        try {
          const __code = ${JSON.stringify(code)};
          const fn = new Function('"use strict"; return (' + __code + ');');
          const value = await fn();
          return { __ok: true, value: __serialize(value) };
        } catch (err) {
          return { __ok: false, error: err && err.message ? err.message : String(err) };
        }
      })()
    `;
    const [result] = await chrome.userScripts.execute({
      target: { tabId: tab.id },
      js: [{ code: injected }],
    });
    const r = (result?.result ?? {}) as { __ok?: boolean; value?: unknown; error?: string };
    if (r.__ok) {
      return { result: r.value, tab_id: tab.id };
    }
    throw new Error(r.error ?? 'run_script failed');
  }
```

</details>

**依据 7 · 源码核查**：[extension/entrypoints/background.ts:1333-1358](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L1333-L1358)

截图限速、激活/聚焦。

<details>
<summary>查看原文（26行）</summary>

```text
async function screenshot(params: Record<string, unknown>, clientId = ''): Promise<unknown> {
  const now = Date.now();
  const waitMs = Math.max(0, nextScreenshotAt - now);
  nextScreenshotAt = Math.max(now, nextScreenshotAt) + 500;
  if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
  const tab = await resolveTab(params.tab_id as number | undefined, clientId, requestedWindowId(params));
  if (tab.id == null) throw new Error('tab has no id');
  const format = params.format === 'jpeg' ? 'jpeg' : 'png';
  let quality: number | undefined;
  if (format === 'jpeg') {
    const q = Number(params.quality ?? 90);
    quality = Number.isFinite(q) ? Math.max(0, Math.min(100, Math.round(q))) : 90;
  }
  // captureVisibleTab 只截窗口的激活标签页：目标 tab 若不是激活页先激活
  if (tab.active !== true) {
    await chrome.tabs.update(tab.id, { active: true });
  }
  // 可选：把窗口拉到前台，避免被其他窗口遮挡时截到别的内容
  if (params.foreground === true && tab.windowId != null) {
    try {
      await chrome.windows.update(tab.windowId, { focused: true });
    } catch {
      // 窗口可能已关闭，忽略
    }
    await new Promise((r) => setTimeout(r, 300));
  }
```

</details>

**依据 8 · 源码核查**：[extension/entrypoints/background.ts:1373-1383](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L1373-L1383)

真正captureVisibleTab。

<details>
<summary>查看原文（11行）</summary>

```text
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
    format,
    ...(quality != null ? { quality } : {}),
  });
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const base64 = typeof dataUrl === 'string' ? (dataUrl.split(',')[1] ?? '') : '';
  const updated = await chrome.tabs.get(tab.id);
  return {
    tab_id: tab.id,
    url: updated.url ?? null,
    title: updated.title ?? null,
```

</details>

#### 缺口

- 全部hub排队公平性/配方目标解析和实际并发时序未完整执行。
  **影响**：不能承诺业务隔离、零误触或所有站点可提取。
  **进一步探讨**：两个Agent/不同窗口并发并人为激活其他tab，核目标、scope与结果，HTTP按共享身份处理。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 谁能连接bridge，回环监听足够认证吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

WS默认固定127.0.0.1:9225，但accept_async直接升级，随后只要求首条hello声明extension或client，没有看到token、Origin或扩展ID验证。server接受角色自述，因此回环是网络可达范围，不是可信调用方认证；不可信本地进程或能向本地WS发起握手的页面的风险需按浏览器网络限制真实核验。本次未做恶意页面攻击，不能宣称已成功绕过浏览器保护。

HTTP默认127.0.0.1:9226，可用BRIDGE_HTTP_BIND改非回环；dispatch仅按/health和/mcp路径分发，在自有代码中无认证层，rmcp外部传输默认检查未完整审。因此不能把它直接开放公网/局域网，或把MCP session开关当访问控制。HTTP明确无会话并共享BridgeMcp，尤其不能视多用户托管服务。

扩展申请tabs/scripting/activeTab/userScripts/storage/offscreen/sidePanel和all_urls；script可操作登录DOM，截图/正文可进入Agent模型。没有统一秘密脱敏、按origin细分grant或高风险动作确认门禁，调用方应负批准责任。窗口/任务资源锁限制并发冲突，不限制可读取哪个账号和可提交哪类动作。应使用隔离测试profile，不让该服务接不可信Agent。

#### 证据与依据

**依据 1 · 源码核查**：[server/src/main.rs:90-140](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/main.rs#L90-L140)

无自有握手认证/Origin，角色自述。

<details>
<summary>查看原文（51行）</summary>

```text
        }
    };
    let (mut ws_tx, mut ws_rx) = ws.split();
    let (out_tx, mut out_rx) = mpsc::unbounded_channel::<Message>();

    // 第一条消息必须是 hello
    let hello = match ws_rx.next().await {
        Some(Ok(Message::Text(text))) => match serde_json::from_str::<WireMessage>(&text) {
            Ok(msg) => msg,
            Err(err) => {
                let _ = ws_tx
                    .send(Message::Text(
                        json!({ "type": "error", "error": format!("invalid hello: {err}") })
                            .to_string()
                            .into(),
                    ))
                    .await;
                return;
            }
        },
        _ => {
            let _ = ws_tx
                .send(Message::Text(
                    json!({ "type": "error", "error": "expected hello message" })
                        .to_string()
                        .into(),
                ))
                .await;
            return;
        }
    };

    let role = match hello.role.as_deref() {
        Some("extension") => Role::Extension,
        Some("client") => Role::Client,
        _ => {
            let _ = ws_tx
                .send(Message::Text(
                    json!({ "type": "error", "error": "hello must declare role" })
                        .to_string()
                        .into(),
                ))
                .await;
            return;
        }
    };
    let name = hello.name.clone().unwrap_or_else(|| "unnamed".to_string());
    let client_id = hello.client_id.clone();
    let _ = hub_tx.send(HubMsg::Register {
        conn_id,
        role,
```

</details>

**依据 2 · 源码核查**：[server/src/main.rs:173-201](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/main.rs#L173-L201)

WS回环与可配置HTTP bind。

<details>
<summary>查看原文（29行）</summary>

```text
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let port = std::env::var("BRIDGE_PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(DEFAULT_PORT);
    let addr = format!("127.0.0.1:{port}");
    let listener = TcpListener::bind(&addr).await?;
    let http_port = std::env::var("BRIDGE_HTTP_PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(DEFAULT_HTTP_PORT);
    let http_bind = std::env::var("BRIDGE_HTTP_BIND").unwrap_or_else(|_| "127.0.0.1".into());
    eprintln!("browser-bridge server listening on ws://{addr}");
    if http_port != 0 {
        eprintln!("browser-bridge MCP over HTTP: http://{http_bind}:{http_port}/mcp");
    }

    let (hub_tx, hub_rx) = mpsc::unbounded_channel();
    tokio::spawn(hub_loop(hub_rx));

    if http_port != 0 {
        // 独立端口、独立 HTTP 栈：原有 WS 行为与协议不变。
        match format!("{http_bind}:{http_port}").parse::<SocketAddr>() {
            Ok(http_addr) => {
                let ws_url = format!("ws://127.0.0.1:{port}");
                tokio::spawn(async move { mcp_http::serve(http_addr, ws_url).await });
            }
            Err(error) => eprintln!(
                "invalid BRIDGE_HTTP_BIND/BRIDGE_HTTP_PORT: {error}; HTTP MCP disabled"
```

</details>

**依据 3 · 源码核查**：[server/src/mcp_http.rs:100-133](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/mcp_http.rs#L100-L133)

路径分发到外部MCP service。

<details>
<summary>查看原文（34行）</summary>

```text
            }
        }
    }
}

async fn dispatch(
    service: &mut StreamableHttpService<BridgeMcp, LocalSessionManager>,
    request: Request<Incoming>,
) -> HttpResponse {
    let path = request.uri().path().to_string();
    if path == "/health" {
        return json_response(
            StatusCode::OK,
            json!({"ok": true, "mcp": MCP_PATH}),
        );
    }
    if path != MCP_PATH && !path.starts_with(&format!("{MCP_PATH}/")) {
        return json_response(
            StatusCode::NOT_FOUND,
            json!({"error": format!("unknown path {path}; MCP endpoint is {MCP_PATH}")}),
        );
    }
    let method = request.method().clone();
    let response = match service.call(request).await {
        Ok(response) => response,
        Err(never) => match never {},
    };
    // 只有异常状态才打日志：正常调用不污染日志，出问题时能直接看出端点行为。
    if response.status().is_client_error() || response.status().is_server_error() {
        eprintln!(
            "[mcp-http] {method} {path} -> {} {}",
            response.status().as_u16(),
            response.status().canonical_reason().unwrap_or("")
        );
```

</details>

**依据 4 · 源码核查**：[extension/wxt.config.ts:6-11](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/wxt.config.ts#L6-L11)

广域扩展权限。

```text
  manifest: {
    name: 'Browser Bridge',
    description: '通过 WebSocket 桥接本地工具与真实浏览器（无需 CDP）',
    permissions: ['tabs', 'scripting', 'activeTab', 'userScripts', 'storage', 'offscreen', 'sidePanel'],
    host_permissions: ['<all_urls>'],
  },
```

**依据 5 · 源码核查**：[extension/entrypoints/background.ts:706-763](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L706-L763)

任意脚本实际执行。

<details>
<summary>查看原文（58行）</summary>

```text
async function runScript(params: Record<string, unknown>, clientId = ''): Promise<unknown> {
  const tab = await resolveTab(params.tab_id as number | undefined, clientId, requestedWindowId(params));
  if (tab.id == null) throw new Error('tab has no id');
  const code = String(params.code ?? '');
  if (!code) throw new Error('run_script requires params.code');

  // 优先：userScripts.execute 按需注入（当前页面无需刷新）
  if (chrome.userScripts?.execute) {
    await ensureEvalUserScript();
    const injected = `
      (async () => {
        const __serialize = (v, seen = new Set()) => {
          if (v === null || v === undefined) return v ?? null;
          const t = typeof v;
          if (t === 'string' || t === 'boolean') return v;
          if (t === 'number') return Number.isFinite(v) ? v : String(v);
          if (t === 'bigint') return v.toString();
          if (v instanceof Element) {
            return {
              __element: v.tagName.toLowerCase(),
              id: v.id || null,
              text: (v.textContent ?? '').trim().slice(0, 300),
            };
          }
          if (Array.isArray(v)) {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
            return v.map((x) => __serialize(x, seen));
          }
          if (t === 'object') {
            if (seen.has(v)) return '[Circular]';
            seen.add(v);
            const out = {};
            for (const [k, x] of Object.entries(v)) out[k] = __serialize(x, seen);
            return out;
          }
          return String(v);
        };
        try {
          const __code = ${JSON.stringify(code)};
          const fn = new Function('"use strict"; return (' + __code + ');');
          const value = await fn();
          return { __ok: true, value: __serialize(value) };
        } catch (err) {
          return { __ok: false, error: err && err.message ? err.message : String(err) };
        }
      })()
    `;
    const [result] = await chrome.userScripts.execute({
      target: { tabId: tab.id },
      js: [{ code: injected }],
    });
    const r = (result?.result ?? {}) as { __ok?: boolean; value?: unknown; error?: string };
    if (r.__ok) {
      return { result: r.value, tab_id: tab.id };
    }
    throw new Error(r.error ?? 'run_script failed');
  }
```

</details>

#### 缺口

- 浏览器本地网络保护/外部rmcp默认防护与恶意页面可达性未测。
  **影响**：确认是自有握手无身份验证，不等已证实任意网站远控。
  **进一步探讨**：隔离环境测试错误Origin/伪角色/未认证HTTP，补明确配对token与受信Origin，再考虑扩大访问。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 超时/断线/重启怎样影响任务恢复与退出？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

hub取消在途请求时回复browser execution is draining，并把executing放回保留窗口/额度；扩展断线同样返回result unknown但保留执行，不立刻让下一个任务抢资源。扩展重启从session journal将running变unknown，不落截图/整页结果；同步时server对旧扩展不成功则fail closed，并从unknown记录接管孤儿执行。这是避免“取消响应=浏览器停止”的真实设计，而不是可撤销站点副作用。

已完成结果不保留，server同步看到finished而无结果会要求提交新请求；对读操作可重取，对提交/购买/发送等写操作必须先人工回查真实站点，不能自动重放以为恰好一次。unknown资源可能保持到窗口关闭，保守性换取可用性损失；清理窗口是操作者可见退路，不是业务回滚。浏览器关闭/重启后session记录归属也会变，进程退出不自动杀共享Chrome。

首次需Rust构建、Node/pnpm扩展构建加载、Chrome用户脚本开关、server和MCP接线；HTTP不自动拉server，stdio/CLI有二进制发现/自动启动。持续需联动升级server/扩展、维护站点配方和执行锁/残留窗口，模型费/机器资源金额未知。退出先停MCP和server、卸扩展/撤广域权限，再按归属关窗口清数据，普通断开并不撤站点已做动作。MIT许可不能替代站点条款/账户边界。当前观察，先解决自有握手无认证再接敏感登录态。

#### 证据与依据

**依据 1 · 源码核查**：[server/src/hub.rs:219-260](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/hub.rs#L219-L260)

断线保留未知执行/资源。

<details>
<summary>查看原文（42行）</summary>

```text
    fn disconnect(&mut self, conn: u64) {
        let is_extension = self.extension == Some(conn);
        self.conns.remove(&conn);
        if is_extension {
            self.extension = None;
            self.sync_id = None;
            let requests = std::mem::take(&mut self.resolutions)
                .into_values()
                .chain(std::mem::take(&mut self.inventory).into_values());
            for mut request in requests {
                self.reply(
                    &mut request,
                    Err("extension disconnected before execution".into()),
                );
            }
            // Browser scripts may outlive the WebSocket or service worker.
            // Closing is a drain state, not permission to release capacity.
            let keys: Vec<_> = self.tasks.keys().cloned().collect();
            for key in keys {
                self.close_task(&key, "extension disconnected; execution result unknown");
            }
            let executions = std::mem::take(&mut self.executing);
            for (id, (key, mut request)) in executions {
                self.reply(
                    &mut request,
                    Err("extension disconnected; execution result unknown".into()),
                );
                self.executing.insert(id, (key, request));
            }
        } else {
            self.resolutions.retain(|_, r| r.conn != conn);
            self.inventory.retain(|_, r| r.conn != conn);
            let keys: Vec<_> = self
                .tasks
                .iter()
                .filter(|(_, t)| t.conn == conn)
                .map(|(k, _)| k.clone())
                .collect();
            for key in keys {
                self.close_task(&key, "client disconnected");
            }
        }
```

</details>

**依据 2 · 源码核查**：[server/src/hub.rs:308-328](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/hub.rs#L308-L328)

在途取消draining而非释放。

<details>
<summary>查看原文（21行）</summary>

```text
                }) {
                    self.remove_task(&key);
                }
            }
            let ids: Vec<_> = self
                .executing
                .iter()
                .filter(|(_, (_, r))| r.conn == conn && r.original == target)
                .map(|(id, _)| id.clone())
                .collect();
            for id in ids {
                if let Some((key, mut r)) = self.executing.remove(&id) {
                    self.reply(
                        &mut r,
                        Err("request cancelled; browser execution is draining".into()),
                    );
                    self.close_task(&key, "request cancelled");
                    self.executing.insert(id, (key, r));
                }
            }
            self.send(conn, WireMessage::ok(&original, json!({"cancelled":true})));
```

</details>

**依据 3 · 源码核查**：[server/src/hub.rs:575-615](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/hub.rs#L575-L615)

同步fail closed/孤儿保留/结果不留。

<details>
<summary>查看原文（41行）</summary>

```text
        }
        let Some(id) = msg.id.as_deref() else {
            return;
        };
        if self.sync_id.as_deref() == Some(id) {
            if msg.success != Some(true) {
                return;
            } // Fail closed with an old extension.
            self.sync_id = None;
            for entry in msg
                .result
                .as_ref()
                .and_then(|r| r["executions"].as_array())
                .into_iter()
                .flatten()
            {
                let Some(wire) = entry["id"].as_str() else {
                    continue;
                };
                if matches!(entry["state"].as_str(), Some("finished" | "completed")) {
                    self.complete(
                        wire,
                        Err(
                            "execution finished without a retained result; submit a new request"
                                .into(),
                        ),
                    );
                } else if entry["state"] == "closed" {
                    self.complete(wire, Err("target window was closed".into()));
                } else if matches!(entry["state"].as_str(), Some("running" | "unknown"))
                    && !self.executing.contains_key(wire)
                    && !self.completed_during_sync.contains(wire)
                {
                    // Adopt orphaned executions after a server restart. Their
                    // capacity stays reserved until a completion/closed proof.
                    let windows = window_ids(&entry["window_ids"]).unwrap_or_default();
                    let key = format!("orphan:{wire}");
                    self.tasks.insert(
                        key.clone(),
                        Task {
                            conn: 0,
```

</details>

**依据 4 · 源码核查**：[extension/entrypoints/background.ts:89-135](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L89-L135)

仅执行元数据持久，重启unknown。

<details>
<summary>查看原文（47行）</summary>

```text
  // Only unfinished execution metadata survives worker restarts. Results can
  // contain screenshots or full pages and must never enter session storage.
  const snapshot = Array.from(executions, ([id, record]) => [id, {
    state: record.state, window_ids: record.window_ids,
  }]);
  const write = journalWrites.catch(() => {}).then(() =>
    chrome.storage.session.set({ bridgeExecutions: snapshot }),
  );
  journalWrites = write;
  return write;
}

/** 判断是否是 MCP agent 连接（bridge-mcp 使用 mcp- 前缀的稳定身份）；CLI 保持原行为。 */
function isAgentClient(clientId: string): boolean {
  return clientId.startsWith('mcp-');
}

async function saveAutoTabs(): Promise<void> {
  try {
    await chrome.storage.session.set({ autoTabs: Array.from(autoTabs.entries()) });
  } catch {
    // session 存储不可用时退回仅内存记录
  }
}

async function saveAgentWindows(): Promise<void> {
  try {
    await chrome.storage.session.set({ agentWindows: Array.from(agentWindows.entries()) });
  } catch {
    // session 存储不可用时退回仅内存记录
  }
}

let stateReady: Promise<void>;
async function restoreState(): Promise<void> {
  const saved = await chrome.storage.session.get(['bridgeInstanceId', 'bridgeExecutions']);
  extensionInstanceId = typeof saved.bridgeInstanceId === 'string'
    ? saved.bridgeInstanceId : crypto.randomUUID();
  for (const [id, record] of (saved.bridgeExecutions ?? []) as Array<[string, { state: string; window_ids: number[] }]>) {
    if (record.state === 'running' || record.state === 'unknown') {
      executions.set(id, { state: 'unknown', window_ids: record.window_ids });
    }
  }
  // Replace the old result cache before any other write, even if it already
  // fills the quota. Preserve unfinished operations so their locks survive.
  await saveExecutionJournal();
  await chrome.storage.session.set({ bridgeInstanceId: extensionInstanceId });
```

</details>

**依据 5 · 源码核查**：[bridge-mcp/src/main.rs:18-24](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/bridge-mcp/src/main.rs#L18-L24)

进程结束不退出共享Chrome。

```text
    // Chrome is shared by concurrent clients. A process ending must never
    // quit the browser used by other tasks; task leases drain on disconnect.
    let service = mcp.serve(rmcp::transport::stdio()).await?;
    let waiting = service.waiting().await;
    waiting?;
    Ok(())
}
```

**依据 6 · 作者声明**：[README.md:19-58](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/README.md#L19-L58)

构建/加载/自动拉server前置。

<details>
<summary>查看原文（40行）</summary>

````text
### 1. 启动 server

推荐用管理脚本后台常驻（server **不会自动退出**，多个 agent 共享同一个进程）：

```sh
./scripts/build.sh              # 首次先构建
./scripts/server.sh start       # 后台启动（start|stop|restart|status|logs）
./scripts/server.sh status
```

也可以前台跑，方便看日志：

```sh
cd server
cargo run            # 默认监听 ws://127.0.0.1:9225（MCP over HTTP 另开 9226）
# 换端口：BRIDGE_PORT=9226 cargo run
# 关闭 HTTP MCP：BRIDGE_HTTP_PORT=0 cargo run
```

### 2. 加载插件

```sh
cd extension
pnpm install
pnpm dev             # 会自动打开 Chrome 并加载开发版插件
```

也可以 `pnpm build` 后，在 `chrome://extensions` 打开"开发者模式"，加载 `extension/dist/chrome-mv3` 目录。

点击扩展弹窗里的「任务面板」，或从 Chrome 侧边栏打开 Browser Bridge，可以看到**当前窗口**里正在执行和排队的任务。排队数据在 bridge-server 上，server 与扩展需要一起升级。

### 3. 使用 client

client 连接失败时会**自动拉起 bridge-server**（需要已构建的二进制，可用 `BRIDGE_SERVER_BIN` 指定路径）；插件断线后按 500ms→5s 退避自动重连。

```sh
cd client
cargo run -- list-tabs
cargo run -- --window 5 list-tabs
cargo run -- navigate https://example.com
````

</details>

**依据 7 · 作者声明**：[README.md:562-562](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/README.md#L562-L562)

作者MIT许可。

```text
本项目使用 [MIT License](LICENSE) 开源。Copyright (c) 2026 hanelalo。
```

#### 缺口

- 未知锁关闭释放、浏览器/服务重启以及全部配方维护成本未实测。
  **影响**：不能保证无损恢复或净节时。
  **进一步探讨**：对无副作用页面核取消/断线/worker重启与关窗口，写操作一律先核真实结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪种机制可成为生产插件增量？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可验证方向是把当前保守资源锁与配对身份、origin范围和操作回执结合：服务只接受显式配对client/extension，按用户批准站点与动作类别，记录原请求、目标文档、开始/完成/未知。基线是角色和client_id自述、all_urls扩展与已有未知锁；增量是允许人理解并收窄被Agent控制的真实账号范围，而不是再加配方。

最小实验对照当前与改版，用两个客户端和无敏感测试站点，测伪extension/错误Origin、跨窗口/跨域、超时后旧操作继续、worker重启及已提交响应丢失。指标是未配对执行、错目标和重复副作用次数、未知恢复时间、合法任务误拒及人审开销。必须依站点结果验收，不以MCP成功或锁释放代替。

若目标用户仅单个完全可信本地脚本、配对/权限维护比手动浏览更贵，增量不成立；若站点不能提供幂等键/结果查询，就保持unknown要求人工核，不许宣称通用回滚。方向未实现，不计现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[server/src/main.rs:90-140](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/main.rs#L90-L140)

配对身份缺口基线。

<details>
<summary>查看原文（51行）</summary>

```text
        }
    };
    let (mut ws_tx, mut ws_rx) = ws.split();
    let (out_tx, mut out_rx) = mpsc::unbounded_channel::<Message>();

    // 第一条消息必须是 hello
    let hello = match ws_rx.next().await {
        Some(Ok(Message::Text(text))) => match serde_json::from_str::<WireMessage>(&text) {
            Ok(msg) => msg,
            Err(err) => {
                let _ = ws_tx
                    .send(Message::Text(
                        json!({ "type": "error", "error": format!("invalid hello: {err}") })
                            .to_string()
                            .into(),
                    ))
                    .await;
                return;
            }
        },
        _ => {
            let _ = ws_tx
                .send(Message::Text(
                    json!({ "type": "error", "error": "expected hello message" })
                        .to_string()
                        .into(),
                ))
                .await;
            return;
        }
    };

    let role = match hello.role.as_deref() {
        Some("extension") => Role::Extension,
        Some("client") => Role::Client,
        _ => {
            let _ = ws_tx
                .send(Message::Text(
                    json!({ "type": "error", "error": "hello must declare role" })
                        .to_string()
                        .into(),
                ))
                .await;
            return;
        }
    };
    let name = hello.name.clone().unwrap_or_else(|| "unnamed".to_string());
    let client_id = hello.client_id.clone();
    let _ = hub_tx.send(HubMsg::Register {
        conn_id,
        role,
```

</details>

**依据 2 · 源码核查**：[extension/entrypoints/background.ts:318-374](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/extension/entrypoints/background.ts#L318-L374)

已有执行范围/journal机制。

<details>
<summary>查看原文（57行）</summary>

```text
  if (msg.method === 'ping') {
    send(socket, { id: msg.id, success: true, result: { pong: true } });
    return;
  }

  try {
    await stateReady;
    const clientId = typeof msg.client_id === 'string' ? msg.client_id : '';
    if (msg.method === '_resolve_target') {
      const p = msg.params ?? {};
      const result = await resolveTarget(String(p.method ?? ''), (p.params ?? {}) as Record<string, unknown>, clientId);
      send(socket, { id: msg.id, success: true, result });
      return;
    }
    if (msg.method === '_sync_executions') {
      const ids = Array.isArray(msg.params?.ids) ? msg.params.ids as string[] : [];
      send(socket, { id: msg.id, success: true, result: await syncExecutions(ids) });
      return;
    }
    if (msg.method === 'list_tabs' || msg.method === 'list_windows') {
      send(socket, { id: msg.id, success: true, result: await execute(msg.method, msg.params ?? {}, clientId) });
      return;
    }
    if (executions.has(msg.id)) return; // An unfinished dispatch is still occupying its window.
    const windows = msg.params?._window_ids;
    if (!Array.isArray(windows) || windows.some((id) => typeof id !== 'number')) {
      throw new Error('server must resolve and admit the target before execution; update bridge-server');
    }
    if (executions.size >= 3) {
      throw new Error('browser execution capacity is still reserved by running or unresolved operations');
    }
    for (const record of executions.values()) {
      if (record.window_ids.some((id) => windows.includes(id))) {
        throw new Error('window still has an executing or unresolved browser operation');
      }
    }
    // Persist before starting browser code. After a service-worker restart a
    // running entry becomes unknown, never assumed to have stopped.
    const record: ExecutionRecord = { state: 'running', window_ids: windows as number[] };
    executions.set(msg.id, record);
    try {
      await saveExecutionJournal();
    } catch (error) {
      executions.delete(msg.id);
      throw error;
    }
    let response: Record<string, unknown>;
    try {
      await validateExecutionScope(msg.method, msg.params ?? {}, record.window_ids);
      const result = await execute(msg.method, msg.params ?? {}, clientId);
      response = { id: msg.id, success: true, result };
    } catch (error) {
      response = { id: msg.id, success: false, error: error instanceof Error ? error.message : String(error) };
    }
    executions.delete(msg.id);
    await saveExecutionJournal().catch(() => {});
    send(ws?.readyState === WebSocket.OPEN ? ws : socket, response);
```

</details>

**依据 3 · 源码核查**：[server/src/hub.rs:308-328](https://github.com/hanelalo/browser-bridge/blob/2a5ed834987201bf6c210a51d36252d49f3e83d6/server/src/hub.rs#L308-L328)

取消draining正确性基线。

<details>
<summary>查看原文（21行）</summary>

```text
                }) {
                    self.remove_task(&key);
                }
            }
            let ids: Vec<_> = self
                .executing
                .iter()
                .filter(|(_, (_, r))| r.conn == conn && r.original == target)
                .map(|(id, _)| id.clone())
                .collect();
            for id in ids {
                if let Some((key, mut r)) = self.executing.remove(&id) {
                    self.reply(
                        &mut r,
                        Err("request cancelled; browser execution is draining".into()),
                    );
                    self.close_task(&key, "request cancelled");
                    self.executing.insert(id, (key, r));
                }
            }
            self.send(conn, WireMessage::ok(&original, json!({"cancelled":true})));
```

</details>

#### 缺口

- 身份/站点grant与回执是否减少实际误操作且不过度增加人审未知。
  **影响**：生产方向需对照，不是现成功能。
  **进一步探讨**：先构造故障集与同任务手工/Playwright基线，成本无益就停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
