# Nuphus MCP

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[0a689c1](https://github.com/mrpulor-gh/nuphus-mcp/tree/0a689c14aa26638dca1638752e7a0e88c4f4fe20)

<!-- BEGIN META -->
[![GitHub ★ 330](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=330&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mrpulor-gh/nuphus-mcp)
<!-- END META -->

> **功能**：将桌面原生语义操作、像素与本地 OCR、可选云视觉和 Chrome CDP 暴露为 MCP 工具，并分层返回派发与局部核验状态。

> **亮点**：统一标准工具、候选/目标绑定、派发前消费观察和未知结果不直接重放，以及连接层区分读恢复与写不确定；这些优势有明确覆盖范围，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

> **主要限制**：语义局部核验明确非业务完成；原始CDP/像素不共用全部策略，内部stale仍可分类重试；confirm是caller bool且默认off，截图可外发，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

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
  - [Q01 · 实际交付的入口和任务循环属于谁？](#detail-section-11)
  - [Q02 · 语义候选如何约束动作，派发和后置核精确证明什么？](#detail-section-12)
  - [Q03 · 浏览器动作和重试是否沿用同一防重复保证？](#detail-section-13)
  - [Q04 · 严格确认、原始工具与截图外发的权限边界是什么？](#detail-section-14)
  - [Q05 · 环境、首用/持续/失败/退出需要哪些资源？](#detail-section-15)
  - [Q06 · 下一步生产方向如何超出已有语义回执？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能隔离测试桌面/浏览器的自动化开发者，为外部Agent提供观察/动作接口；不是DSH插件或完整自主任务循环，见 [Q01](#research-q01)。

直接AX/UIA、CDP/Playwright和截图坐标脚本；云视觉逐屏识别是另一条感知参照，不将复用底层或工具数当新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 语义桌面 | 观察/候选/原生动作/局部核验 | token/平台/局部策略，非业务成功 |
| 像素/输入 | 直接桌面自动化 | 不共用全部语义约束 |
| CDP | 页面click/JS/cookie等 | 连接写不重试不覆盖所有底层stale |
| OCR/云视觉 | 本地识别或一次图像模型请求 | 下载/外发/账单分开 |
| 正常退出 | owned浏览器关闭/附着断开 | 不删除所有资料/撤销外部效果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 原生平台binary/或Rust构建、MCP Host | 必需 | stdio工具服务 | npm版本条件非成品校验 |
| OS截屏/辅助功能权限和目标应用 | 桌面时 | 原生观察/执行 | 不自动隔离真实桌面 |
| Windows UIA/macOS AX | 语义时 | opaque候选与动作 | 其他平台可不支持 |
| Chrome/Edge/CDP与浏览器资料 | browser时 | 页面/账号操作 | 状态/资料与退出另核 |
| OCR模型/磁盘/CPU | perceive时 | 本地识别 | 可下载，不能说全离线首用 |
| 视觉Key/端点/外发批准 | vision时 | 带图像HTTP请求 | 可选，独立服务费用/数据边界 |
| 外部Agent/人类批准与业务真值 | 任务采用时 | 下一步和结果判定 | confirm bool不替代独立授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核平台/成品/Host与测试账户权限 | 不接敏感全桌面 |
| 观察 | 外部Agent调语义/截图/浏览器 | 读目标/候选/版本而非只看工具成功 |
| 执行 | 本地策略/锁/原生或CDP | 语义先消费token，原始路径另核 |
| 核验 | 局部后置+业务真值 | UI变化/receipt非提交完成 |
| 恢复 | 读Unknown/对账后决定 | 不凭isError盲重放 |
| 退出 | 正常EOF/exit关owned浏览器/断附着 | profile/模型/Key/OS权限另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 平台包/OS权限/浏览器/模型下载未知 | 成品核对、Host配置、隔离样本 | 源码不证明分发字节 |
| 持续使用 | CPU/缓存/图像token/BYOK未知 | 候选和网页适配/业务核对 | 本地OCR不必云视觉，但总费未测 |
| 失败恢复 | 可能已派发/浏览器重连/外部动作未知 | 分未写/未知、重新观察与对账 | 外层写不重试非全底层保证 |
| 退出 | 浏览器profile/cookie/下载/模型/Key | 停MCP、核owned进程、撤权/资料清理 | 不是5秒全清或业务回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| Agent可调用操作 | stdio到原生/CDP/结果 | Host/成品实际任务成功 |
| 语义稳健性 | token/目标/派发与局部核验分层 | 全风险识别/业务目标 |
| 浏览器恢复 | 连接层只重读/写保未知 | 底层stale未派发边界 |
| 感知选择 | 本地OCR/可选云视觉分离 | 准确率/总资源节省 |

> **思考**：语义局部核验明确非业务完成；原始CDP/像素不共用全部策略，内部stale仍可分类重试；confirm是caller bool且默认off，截图可外发，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一标准工具、候选/目标绑定、派发前消费观察和未知结果不直接重放，以及连接层区分读恢复与写不确定；这些优势有明确覆盖范围，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

[Q02](#research-q02) 派发前消费与后置Unknown保留值得学；[Q03](#research-q03) 必须追到原生/CDP callee再谈不重放，别用外层注释替代全链证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

语义局部核验明确非业务完成；原始CDP/像素不共用全部策略，内部stale仍可分类重试；confirm是caller bool且默认off，截图可外发，见 [Q03](#research-q03) 与 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

能隔离环境的开发者只在无敏感演示应用逐工具试，未知派发先观察对账，业务完成另核；确认/权限不清则停服务，见 [Q05](#research-q05) 与 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码闭合stdio/语义代表macOS原生/浏览器click-evaluate/视觉POST/退出；未安装或执行、未全审各平台工具。只建议隔离无敏感演示任务的有限试用。

- 已检查：作者 README、包清单、源码路径 README.md、crates/desktop-api/src/semantic/macos_accessibility.rs、crates/desktop-api/src/semantic/macos_accessibility/native.rs、crates/desktop-api/src/semantic/types.rs、crates/nuphus-browser/src/client.rs、crates/nuphus-browser/src/shared.rs、crates/nuphus-mcp/Cargo.toml、crates/nuphus-mcp/src/main.rs、crates/nuphus-mcp/src/models.rs、crates/nuphus-mcp/src/security.rs、crates/nuphus-mcp/src/server.rs、crates/nuphus-mcp/src/tools/browser.rs、crates/nuphus-mcp/src/tools/desktop.rs、crates/nuphus-mcp/src/tools/mod.rs、crates/nuphus-mcp/src/tools/semantic.rs、crates/nuphus-mcp/src/vision.rs、npm/packages/nuphus-mcp/bin/cli.js、npm/packages/nuphus-mcp/package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料摘要/固定SOURCE一致；核npm launcher/Cargo版本、Rust stdio/MCP/锁/安全策略、语义缓存/策略/代表macOS AX真实动作与回执、CDP click/evaluate/内外重试、视觉POST/模型下载和正常退出。未执行、核发布binary/所有工具/Windows行为或所有cookie/path/权限/业务后置。
- 下一步：无敏感演示环境核token/窗口/派发后丢响应/局部验证失败/真假批准、CDP stale点击计数、视觉外发与正常/强退资料清理，再比直接脚本总成本。

**分析版本**

- **仓库**：[mrpulor-gh/nuphus-mcp](https://github.com/mrpulor-gh/nuphus-mcp)
- **版本号**：0.3.3（Rust 产品 crate 与 npm 元包声明版本）（[固定提交 0a689c1](https://github.com/mrpulor-gh/nuphus-mcp/tree/0a689c14aa26638dca1638752e7a0e88c4f4fe20)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

跨工具族绑定人类批准、具体目标与派发不确定性，再为少数业务动作核独立记录真值，未知只读对账不重放，见 [Q06](#research-q06)。

无敏感演示环境核token/窗口/派发后丢响应/局部验证失败/真假批准、CDP stale点击计数、视觉外发与正常/强退资料清理，再比直接脚本总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 4277 | — | — | 28970 |
| .js | source | 11 | 936 | 675 | 172 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/mrpulor-gh/nuphus-mcp/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mrpulor-gh/nuphus-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自动化工具的入口、目标/执行与不确定结果能否支持受控任务，哪些权限/恢复仍需独立核验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 实际交付的入口和任务循环属于谁？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是原生桌面/浏览器自动化stdio MCP工具，不是DSH/Cordis插件；crate与npm包装版本同为0.3.3。面向能管理桌面权限的自动化开发者，让外部Agent取得观察、候选、点击/输入和结果。相对直接AX/UIA、CDP/Playwright脚本与截图坐标操作，它统一可发现工具和目标/错误/本地后置核；底层库有复用，不把工具数算新算法，也不把接口可调当业务完成。

npm bin定位平台包原生binary，已知版本不匹配候选会拒，metadata版本读不到时条件仍可能接受，非签名/字节校验。spawn继承stdio，Rust main建server并逐行读JSON，server初始化后派tools/call，先check确认再execute_tool_isolated，tools::execute拿进程mutex和跨进程文件锁后实际分桌面/浏览器实现；结果text/isError回MCP和下一次外部调用。当前已核工具链的下一步任务决策在外部Agent；可选desktop_vision自身会发一次模型请求，不能泛称整个项目不调用模型。发布成品binary与源码的等价本轮未核。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/Cargo.toml:1-8](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/Cargo.toml#L1-L8)

原生包版本和定位。

```text
[package]
name = "nuphus-mcp"
version = "0.3.3"
edition = "2021"
license = "MIT"
repository = "https://github.com/mrpulor-gh/nuphus-mcp"
description = "Desktop automation MCP server — computer use for any AI agent: control screen, windows, mouse/keyboard, and Chrome via Model Context Protocol (stdio)"
authors = ["Nuphus Team"]
```

**依据 2 · 源码核查**：[npm/packages/nuphus-mcp/package.json:1-17](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/npm/packages/nuphus-mcp/package.json#L1-L17)

npm版本与bin。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "@nuphus/nuphus-mcp",
  "version": "0.3.3",
  "description": "Nuphus MCP server — AI computer operation (desktop + browser tools). Platform binary auto-selected via optionalDependencies.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mrpulor-gh/nuphus-mcp.git"
  },
  "homepage": "https://github.com/mrpulor-gh/nuphus-mcp",
  "keywords": ["mcp", "model-context-protocol", "desktop-automation", "browser-automation", "nuphus"],
  "engines": {
    "node": ">=16"
  },
  "bin": {
    "nuphus-mcp": "bin/cli.js"
  },
```

</details>

**依据 3 · 源码核查**：[npm/packages/nuphus-mcp/bin/cli.js:77-100](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/npm/packages/nuphus-mcp/bin/cli.js#L77-L100)

版本条件及拒不匹配，缺元数据非强保证。

<details>
<summary>查看原文（24行）</summary>

```text
  const mismatches = [];
  let dir = __dirname;
  for (;;) {
    for (const sub of [path.join('node_modules', '@nuphus', pkg), path.join('node_modules', pkg)]) {
      const pkgDir = path.join(dir, sub);
      const found = binaryInDir(pkgDir, pkg, binFile);
      if (found) {
        const v = pkgVersionAt(pkgDir);
        if (!expected || !v || v === expected) return found;
        mismatches.push(`${pkgDir} (platform ${v} ≠ meta ${expected})`);
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  if (mismatches.length) {
    console.error(`[nuphus-mcp] found ${pkg} but its version does not match the meta package @${expected}:
  - ${mismatches.join('\n  - ')}

The install is corrupt or version-mismatched. Reinstall to fix:

    npm install -g @nuphus/nuphus-mcp`);
    process.exit(1);
```

</details>

**依据 4 · 源码核查**：[npm/packages/nuphus-mcp/bin/cli.js:122-133](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/npm/packages/nuphus-mcp/bin/cli.js#L122-L133)

真实spawn/stdio/退出。

<details>
<summary>查看原文（12行）</summary>

```text
  const child = spawn(bin, process.argv.slice(2), {
    stdio: 'inherit',
    windowsHide: true,
  });
  child.on('error', (err) => {
    console.error(`[nuphus-mcp] failed to spawn ${bin}: ${err.message}`);
    process.exit(1);
  });
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code == null ? 0 : code);
  });
```

</details>

**依据 5 · 源码核查**：[crates/nuphus-mcp/src/main.rs:59-72](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/main.rs#L59-L72)

策略与server。

<details>
<summary>查看原文（14行）</summary>

```text
    // --confirm-write CLI flag overrides the environment variable
    let cli_confirm = std::env::args().any(|a| a == "--confirm-write");
    let policy = if cli_confirm {
        SecurityPolicy {
            strict_confirm: true,
        }
    } else {
        SecurityPolicy::from_env()
    };
    if policy.strict_confirm {
        tracing::warn!("[nuphus-mcp] STRICT CONFIRM MODE: write tools require \"confirm\": true");
    }

    let mut server = McpServer::with_policy(policy);
```

</details>

**依据 6 · 源码核查**：[crates/nuphus-mcp/src/main.rs:96-109](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/main.rs#L96-L109)

真实输入/响应写回。

<details>
<summary>查看原文（14行）</summary>

```text
        if n == 0 {
            break; // EOF (client closed the pipe / process ended)
        }
        // Lossy: a non-UTF-8 line yields replacement chars and is rejected by the JSON
        // parser with a parse error, instead of aborting the whole server on read.
        let trimmed = String::from_utf8_lossy(&line);
        let trimmed = trimmed.trim();
        if trimmed.is_empty() {
            continue;
        }
        if let Some(response) = server.handle_line(trimmed).await {
            writer.write_all(response.as_bytes()).await?;
            writer.write_all(b"\n").await?;
            writer.flush().await?;
```

</details>

**依据 7 · 源码核查**：[crates/nuphus-mcp/src/server.rs:218-237](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/server.rs#L218-L237)

确认/执行/回MCP。

<details>
<summary>查看原文（20行）</summary>

```text
        // Security boundary: in strict confirmation mode, write operations must carry confirm:true
        if let Err(msg) = self.policy.check_write_confirmation(name, &args) {
            let mut result = json!({
                "content": [ { "type": "text", "text": msg } ],
            });
            result["isError"] = json!(true);
            return Dispatched::Ok(result);
        }

        match execute_tool_isolated(name.to_owned(), args).await {
            Ok(output) => {
                let mut result = json!({
                    "content": [ { "type": "text", "text": output.text } ],
                });
                if output.is_error {
                    result["isError"] = json!(true);
                }
                Dispatched::Ok(result)
            }
            Err(e) => Dispatched::Err(RpcError::new(codes::INVALID_PARAMS, e)),
```

</details>

**依据 8 · 源码核查**：[crates/nuphus-mcp/src/tools/mod.rs:51-104](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/mod.rs#L51-L104)

真实锁与分发实现。

<details>
<summary>查看原文（54行）</summary>

```text
pub async fn execute(name: &str, args: &serde_json::Value) -> Result<ToolOutput, String> {
    // Process-level mutual exclusion: serialize automation operations within this
    // process. Held across the await points of the actual tool call.
    // Bounded: this lock sits *outside* every per-tool budget, so an unbounded
    // wait here would wedge the whole server (one stuck tool = every later call
    // unanswered). Give up with a readable busy error instead.
    static PROCESS_LOCK: std::sync::OnceLock<tokio::sync::Mutex<()>> = std::sync::OnceLock::new();
    let process_guard = match tokio::time::timeout(
        std::time::Duration::from_secs(PROCESS_LOCK_TIMEOUT_SECS),
        PROCESS_LOCK
            .get_or_init(|| tokio::sync::Mutex::new(()))
            .lock(),
    )
    .await
    {
        Ok(guard) => guard,
        Err(_) => {
            return Ok(ToolOutput::failure(format!(
                "Automation is busy: another operation in this process has held the automation \
                 lock for over {PROCESS_LOCK_TIMEOUT_SECS}s; retry later."
            )));
        }
    };

    // Cross-process lock: full coverage for every desktop_*/browser_* tool.
    // Read-only operations (e.g. desktop_screen_size) also acquire it — they still
    // touch the shared machine state and must not interleave with a writer's sequence.
    let lock = crate::automation_lock::AutomationLock::new();
    let file_guard = match lock.acquire(name) {
        Ok(guard) => guard,
        Err(e) => return Ok(ToolOutput::failure(e)),
    };

    // Test-only panic hook: exercised by the server panic-guard test to prove a
    // panicking tool cannot kill the process and that both locks above are
    // released by RAII while the panic unwinds. Compiled out in production.
    #[cfg(test)]
    if name == "test_panic_tool" {
        panic!("intentional test panic (automation lock guard must unwind safely)");
    }

    let result = if name.starts_with("desktop_") {
        desktop::execute(name, args).await
    } else if name.starts_with("browser_") {
        browser::execute(name, args).await
    } else {
        return Err(format!("Unknown tool: {}", name));
    };

    drop(file_guard);
    drop(process_guard);
    match result {
        Ok(text) => Ok(ToolOutput::success(text)),
        Err(e) => Ok(ToolOutput::failure(e)),
```

</details>

#### 缺口

- 未装固定binary或MCP客户端，也未核全部工具/平台。
  **影响**：入口源码不能保证成品、Host兼容、真实桌面控制成功或自主完成任务。
  **进一步探讨**：核固定成品对应/平台权限，用无敏感演示应用完整观察→执行→后置核，并查响应到外部Agent的实际选择。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义候选如何约束动作，派发和后置核精确证明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

desktop真实分发到process-wide SemanticDesktopBackend，按Windows UIA/macOS AX选择adapter，Linux走不支持分支。观察给opaque候选；execute取last_space，核process owner、最近token与TTL和候选归属，并检查checked/scroll参数一致。owner来自进程内OnceLock UUID，不是人类身份或每任务独立授权。LocalPolicy拒增量/禁止动作，关键动作需要交互确认时MCP入口没有该通道便拒绝，不能靠通用confirm布尔代过此拒绝。

执行前重观应用/窗口，重绑验证目标，已满足的setChecked可NotSent；真正派发前clear_space，使未知结果不能复用旧候选直接重放。adapter具体执行不是接口空壳：macOS验证候选来自本adapter及window binding，经worker Request::Execute到NativeSession/AX动作；receipt.dispatched是本地派发记录，不是业务提交确认。异常返回needs_observation/Unknown/retry_action=false；派发后verify_with_settle再看状态，失败保留receipt但后置Unknown。完成候选本身要求主模型完成检查，正常局部Achieved也明确business_goal_confirmed=false。此分层有价值，不能称支付/消息/保存已成功。

needs_observation等结构状态也可作为正常MCP文本返回，不能只凭isError缺省就接着做业务下一步；调用者应读派发、核验和business_goal_confirmed。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/src/tools/desktop.rs:98-107](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/desktop.rs#L98-L107)

实际语义分发。

<details>
<summary>查看原文（10行）</summary>

```text
        // Semantic (Accessibility/UIA-first) tools: see `tools/semantic.rs`.
        // The observation → candidate → execution → verification state lives in
        // one process-wide backend, so these share it rather than the vision path.
        "desktop_targets_list" => semantic::execute(name, args).await,
        "desktop_target_bind" => semantic::execute(name, args).await,
        "desktop_semantic_observe" => semantic::execute(name, args).await,
        "desktop_semantic_candidate" => semantic::execute(name, args).await,
        "desktop_semantic_execute" => semantic::execute(name, args).await,
        "desktop_semantic_action" => semantic::execute(name, args).await,
        "desktop_verify_state" => semantic::execute(name, args).await,
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:380-399](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L380-L399)

平台adapter与singleton接线。

<details>
<summary>查看原文（20行）</summary>

```text
fn backend() -> &'static Arc<SemanticDesktopBackend> {
    static BACKEND: std::sync::OnceLock<Arc<SemanticDesktopBackend>> = std::sync::OnceLock::new();
    BACKEND.get_or_init(|| {
        #[cfg(windows)]
        let adapter = desktop_api::semantic::WindowsUiaAdapter::default();
        #[cfg(target_os = "macos")]
        let adapter = desktop_api::semantic::MacosAccessibilityAdapter::default();
        // Windows UIA keeps an explicit unsupported stub on other platforms, so
        // Linux still reports the same "unsupported" observation error as before.
        #[cfg(not(any(windows, target_os = "macos")))]
        let adapter = desktop_api::semantic::WindowsUiaAdapter::default();
        let mut backend = SemanticDesktopBackend::new(Arc::new(adapter));
        backend.attach_target_service(Arc::new(DesktopTargetService::new()));
        Arc::new(backend)
    })
}

/// Execute one semantic desktop tool by name.
pub(super) async fn execute(name: &str, args: &serde_json::Value) -> Result<String, String> {
    backend().execute_semantic_desktop_tool(name, args).await
```

</details>

**依据 3 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:140-147](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L140-L147)

owner为每process UUID。

```text
fn execution_owner() -> Option<String> {
    static OWNER: std::sync::OnceLock<String> = std::sync::OnceLock::new();
    Some(
        OWNER
            .get_or_init(|| format!("mcp:{}", Uuid::new_v4().simple()))
            .clone(),
    )
}
```

**依据 4 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:485-520](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L485-L520)

实际候选/token/owner/TTL。

<details>
<summary>查看原文（36行）</summary>

```text
async fn execute_cached_candidate(
    backend: &SemanticDesktopBackend,
    observation_token: &str,
    candidate_id: &str,
    input: ExecutionInput,
) -> Result<serde_json::Value, String> {
    let space = backend
        .last_space
        .lock()
        .await
        .clone()
        .ok_or_else(|| "没有可执行的语义观察；请先调用 desktop_semantic_observe".to_string())?;
    validate_space_token(&space, observation_token)?;
    let candidate = space
        .candidates
        .iter()
        .find(|candidate| candidate.id == candidate_id)
        .cloned()
        .ok_or_else(|| "candidate_id 不属于最近一次语义观察".to_string())?;
    let mut result =
        execute_candidate(backend, &space.observation, &candidate, &input, None).await?;
    result["workflow_step"] = workflow_step(&space, &candidate);
    Ok(result)
}

fn validate_space_token(space: &ActionSpace, observation_token: &str) -> Result<(), String> {
    if space.owner != execution_owner() {
        return Err("stale_observation: 观察属于其他执行任务，请重新观察".into());
    }
    if space.token != observation_token {
        return Err("observation_token 不属于最近一次语义观察".into());
    }
    if space.created_at.elapsed() > ACTION_SPACE_TTL {
        return Err("语义观察已过期，请重新调用 desktop_semantic_observe".into());
    }
    Ok(())
```

</details>

**依据 5 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:530-582](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L530-L582)

参数/完成候选/本地策略/关键确认拒。

<details>
<summary>查看原文（53行）</summary>

```text
    match candidate.kind {
        CandidateKind::SetChecked { checked }
            if input.checked.is_some_and(|value| value != checked) =>
        {
            return Err("checked 参数与本地候选的目标状态不一致，请重新选择候选".into());
        }
        CandidateKind::Scroll { direction, amount }
            if input.direction.is_some_and(|value| value != direction)
                || input.amount.is_some_and(|value| value != amount) =>
        {
            return Err("滚动参数与本地候选不一致，请重新选择候选".into());
        }
        CandidateKind::Done => {
            backend.clear_space().await;
            return Ok(json!({
                "status": "needs_primary_completion_check",
                "reason": "完成候选不是本地可验证的通用后置条件；请由当前主模型结合业务目标确认是否结束",
                "candidate_id": candidate.id,
                "decision": decision,
            }));
        }
        CandidateKind::AskUser => {
            return Ok(json!({
                "status": "needs_user_input",
                "candidate_id": candidate.id,
                "decision": decision,
            }));
        }
        CandidateKind::CannotProceed => {
            return Ok(json!({
                "status": "cannot_proceed",
                "candidate_id": candidate.id,
                "decision": decision,
            }));
        }
        _ => {}
    }

    let grant = grant_for(before);
    match LocalPolicy.evaluate(before, candidate, &grant) {
        PolicyDecision::Allow => {}
        PolicyDecision::NeedsConfirmation(reason) => {
            // The main application routes a critical commit to its interactive
            // desktop confirmation channel. nuphus-mcp has no such channel, so the
            // action is refused instead of executed without human consent — the
            // same outcome as an entry point whose confirmation signals are absent.
            return Err(DesktopActionError::refused(format!(
                "critical_action_requires_confirmation: {reason}（MCP 入口未连接关键操作确认）"
            )));
        }
        PolicyDecision::NeedsIncrementalGrant(reason) | PolicyDecision::Deny(reason) => {
            return Err(format!("本地策略拒绝执行: {reason}"));
        }
```

</details>

**依据 6 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:601-642](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L601-L642)

重观/幂等已满足/消费token与未知结果。

<details>
<summary>查看原文（42行）</summary>

```text
    let fresh = backend
        .observer
        .observe(&scope)
        .await
        .map_err(|error| error.to_string())?;
    if fresh.app.id != before.app.id || fresh.window.id != before.window.id {
        backend.clear_space().await;
        return Err("前台应用或窗口已变化，候选动作已过期；请重新观察后再选择".into());
    }
    let verification_candidate = rebind_verification_target(before, &fresh, candidate)?;
    if let CandidateKind::SetChecked { checked } = candidate.kind {
        if verification_candidate
            .target
            .as_ref()
            .and_then(|id| fresh.nodes.iter().find(|n| &n.opaque_id == id))
            .is_some_and(|node| node.toggled == Some(checked))
        {
            backend.clear_space().await;
            return Ok(
                json!({"status":"already_satisfied","candidate_id":candidate.id,
                "dispatch_state":DispatchState::NotSent,"effect":ActionEffect::Confirmed,
                "verification":Verification::Achieved,"business_goal_confirmed":false,"retry_action":false}),
            );
        }
    }
    // An execution error may mean a native timeout after dispatch. Consume the
    // token before attempting it; callers must observe rather than replay.
    backend.clear_space().await;
    let receipt = match backend.executor.execute(&fresh, candidate, input).await {
        Ok(receipt) => receipt,
        Err(error) => {
            if let desktop_api::semantic::AutomationError::Execution(ref message) = error {
                if DesktopActionError::decode(message).is_some() {
                    return Err(message.clone());
                }
            }
            return Ok(json!({
                "status": "needs_observation", "candidate_id": candidate.id,
                "verification": Verification::Unknown, "dispatch_state": "unknown", "effect":ActionEffect::Unverifiable,
                "reason": error.to_string(), "retry_action": false, "decision": decision,
            }));
        }
```

</details>

**依据 7 · 源码核查**：[crates/desktop-api/src/semantic/macos_accessibility.rs:1006-1058](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/desktop-api/src/semantic/macos_accessibility.rs#L1006-L1058)

真实候选/窗口绑定/worker派发与超时。

<details>
<summary>查看原文（53行）</summary>

```text
    impl ComputerExecutor for MacosAccessibilityAdapter {
        async fn execute(
            &self,
            fresh: &Observation,
            action: &ActionCandidate,
            input: &ExecutionInput,
        ) -> Result<ActionReceipt, AutomationError> {
            let bound = {
                let state = self
                    .state
                    .lock()
                    .map_err(|_| AutomationError::Execution("AX state unavailable".into()))?;
                Self::current(&state, fresh)?;
                let bound = state
                    .actions
                    .get(&action.id)
                    .filter(|bound| &bound.candidate == action)
                    .ok_or_else(|| {
                        AutomationError::Execution(
                            "candidate was not created by this AX adapter or was modified".into(),
                        )
                    })?;
                check_window_binding(bound.window_token, state.window_token)?;
                bound.clone()
            };
            let mut input = input.clone();
            match &bound.candidate.kind {
                CandidateKind::SetChecked { checked } => input.checked = Some(*checked),
                CandidateKind::Scroll { direction, amount } => {
                    input.direction = Some(*direction);
                    input.amount = Some(*amount);
                }
                _ => {}
            }
            let (reply, receive) = oneshot::channel();
            self.worker
                .try_send(Request::Execute(
                    Box::new(bound),
                    input,
                    Instant::now() + Duration::from_secs(5),
                    reply,
                ))
                .map_err(|_| {
                    AutomationError::Execution("AX worker is busy or unavailable".into())
                })?;
            tokio::time::timeout(Duration::from_secs(6), receive)
                .await
                .map_err(|_| {
                    AutomationError::Execution(
                        "AX action timed out; reobserve before retrying".into(),
                    )
                })?
                .map_err(|_| AutomationError::Execution("AX worker stopped".into()))?
```

</details>

**依据 8 · 源码核查**：[crates/desktop-api/src/semantic/macos_accessibility.rs:622-643](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/desktop-api/src/semantic/macos_accessibility.rs#L622-L643)

worker到session.execute并建receipt。

<details>
<summary>查看原文（22行）</summary>

```text
                            Request::Execute(mut bound, input, deadline, reply) => {
                                if !reply.is_closed() {
                                    bound.scope.delivery = input.delivery;
                                    let result = session
                                        .execute(
                                            max_elements.clamp(1, 200),
                                            bound.window_token,
                                            bound.require_unique_window,
                                            &bound.scope,
                                            &bound.locator,
                                            &bound.action,
                                            &input,
                                            deadline,
                                            || reply.is_closed(),
                                        )
                                        .map(|dispatched| ActionReceipt {
                                            candidate_id: bound.candidate.id,
                                            dispatched,
                                            delivery_mode: Some(if requires_foreground(input.delivery, bound.scope.window_handle.is_some(), &bound.action) { DeliveryMode::Foreground } else { DeliveryMode::Background }),
                                            detail: Some(if dispatched { "macOS Accessibility action dispatched" } else { "macOS Accessibility target already has the requested state" }.into()),
                                        });
                                    let _ = reply.send(result);
```

</details>

**依据 9 · 源码核查**：[crates/desktop-api/src/semantic/macos_accessibility/native.rs:697-724](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/desktop-api/src/semantic/macos_accessibility/native.rs#L697-L724)

真实窗口token再执行。

<details>
<summary>查看原文（28行）</summary>

```text
    pub(super) fn execute(
        &self,
        limit: usize,
        token: u64,
        require_unique: bool,
        scope: &ObservationScope,
        locator: &SemanticLocator,
        action: &NativeAction,
        input: &ExecutionInput,
        deadline: Instant,
        cancelled: impl Fn() -> bool,
    ) -> Result<bool, AutomationError> {
        let (_, window) = self
            .windows
            .iter()
            .find(|(retained, _)| *retained == token)
            .ok_or_else(|| {
                AutomationError::Execution(
                    "AX window binding expired; refresh the candidate".into(),
                )
            })?;
        execute(
            limit,
            window,
            require_unique,
            scope,
            self.region_for(scope)?,
            locator,
```

</details>

**依据 10 · 源码核查**：[crates/desktop-api/src/semantic/macos_accessibility/native.rs:1228-1234](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/desktop-api/src/semantic/macos_accessibility/native.rs#L1228-L1234)

native动作前deadline/取消及AXPress。

```text
    if Instant::now() >= deadline || cancelled() {
        return Err(AutomationError::Execution(
            "AX request expired before dispatch".into(),
        ));
    }
    match action {
        NativeAction::Invoke | NativeAction::Toggle => element.perform("AXPress"),
```

**依据 11 · 源码核查**：[crates/desktop-api/src/semantic/macos_accessibility/native.rs:362-369](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/desktop-api/src/semantic/macos_accessibility/native.rs#L362-L369)

最终AXUIElementPerformAction。

```text
    pub(crate) fn perform(&self, name: &str) -> Result<(), AutomationError> {
        let name = Owned::string(name);
        if name.0.is_null() {
            return Err(AutomationError::Execution(
                "AX action allocation failed".into(),
            ));
        }
        check(unsafe { AXUIElementPerformAction(self.0 .0, name.0) })
```

**依据 12 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:644-694](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L644-L694)

回执/后置错误分离与业务完成false。

<details>
<summary>查看原文（51行）</summary>

```text
    if receipt.candidate_id != candidate.id {
        return Err(DesktopActionError::encode(
            DispatchState::Unknown,
            "执行回执与候选动作不一致",
        ));
    }
    // Consume the observation once dispatch may have happened. A failed read
    // afterwards must never leave a replayable click/send candidate cached.
    backend.clear_space().await;
    let (after, verification) = match verify_with_settle(
        backend,
        &fresh,
        &verification_candidate,
        input,
        &scope,
    )
    .await
    {
        Ok(value) => value,
        Err(error) => {
            return Ok(json!({
                "status": "needs_observation", "candidate_id": candidate.id,
                "receipt": receipt, "verification": Verification::Unknown,
                "dispatch_state": if receipt.dispatched { DispatchState::Sent } else { DispatchState::NotSent },
                "effect":ActionEffect::Unverifiable,
                "reason": error, "retry_action": false, "decision": decision,
            }))
        }
    };
    if matches!(
        verification,
        Verification::Achieved | Verification::Progress
    ) {
        // Progress was observed; nothing else to record here.
    }
    Ok(json!({
        "status": if matches!(verification, Verification::Achieved | Verification::Progress) { "executed" } else { "needs_observation" },
        "candidate_id": candidate.id,
        "description": candidate.public_description,
        "receipt": receipt,
        "verification": verification,
        "dispatch_state": if receipt.dispatched { DispatchState::Sent } else { DispatchState::NotSent },
        "effect": if verification == Verification::Achieved { ActionEffect::Confirmed } else if verification == Verification::NoChange { ActionEffect::SuspectedNoop } else { ActionEffect::Unverifiable },
        "before_revision": fresh.revision,
        "after_revision": after.revision,
        "after_window": after.window,
        "after_app": after.app,
        "business_goal_confirmed": false,
        "retry_action": false,
        "decision": decision,
    }))
```

</details>

**依据 13 · 源码核查**：[crates/desktop-api/src/semantic/types.rs:431-475](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/desktop-api/src/semantic/types.rs#L431-L475)

LocalPolicy真实callee：撤销/过期/风险/应用/类别/secret/关键确认。

<details>
<summary>查看原文（45行）</summary>

```text
pub struct LocalPolicy;

impl Policy for LocalPolicy {
    fn evaluate(
        &self,
        observation: &Observation,
        candidate: &ActionCandidate,
        grant: &ExecutionGrant,
    ) -> PolicyDecision {
        if grant.revoked {
            return PolicyDecision::Deny("execution grant was revoked".into());
        }
        if candidate.observation_revision != observation.revision {
            return PolicyDecision::Deny("candidate belongs to a stale observation".into());
        }
        if candidate.local_risk == RiskClass::Restricted {
            return PolicyDecision::Deny("restricted actions cannot be authorized".into());
        }
        if !grant
            .allowed_apps
            .iter()
            .any(|id| id == &observation.app.id)
        {
            return PolicyDecision::NeedsIncrementalGrant(format!(
                "application '{}' is outside the execution grant",
                observation.app.id
            ));
        }
        if !grant.action_classes.contains(&candidate.action_class()) {
            return PolicyDecision::NeedsIncrementalGrant(format!(
                "action class '{:?}' is outside the execution grant",
                candidate.action_class()
            ));
        }
        if let CandidateKind::SetSecret { slot_id } = &candidate.kind {
            if !grant.secret_slot_ids.contains(slot_id) {
                return PolicyDecision::NeedsIncrementalGrant(format!(
                    "secret slot '{slot_id}' is outside the execution grant"
                ));
            }
        }
        if candidate.local_risk == RiskClass::DestructiveCritical {
            return PolicyDecision::NeedsConfirmation(candidate.public_description.clone());
        }
        PolicyDecision::Allow
```

</details>

**依据 14 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:1226-1245](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L1226-L1245)

当前grant按观察应用生成，不是人类身份授权。

<details>
<summary>查看原文（20行）</summary>

```text
fn grant_for(observation: &Observation) -> ExecutionGrant {
    ExecutionGrant {
        workflow_id: "interactive-workflow-session".into(),
        workflow_version: "current".into(),
        capability_manifest_digest: "interactive-semantic-desktop".into(),
        allowed_apps: vec![observation.app.id.clone()],
        action_classes: vec![
            ActionClass::NativeAction,
            ActionClass::SetValue,
            ActionClass::SetSecret,
            ActionClass::PressKey,
            ActionClass::Scroll,
            ActionClass::Wait,
            ActionClass::Control,
        ],
        secret_slot_ids: Vec::new(),
        visual_fallback: false,
        unattended: false,
        revoked: false,
    }
```

</details>

**依据 15 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:356-367](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L356-L367)

语义Result<Value>正常序列化。

<details>
<summary>查看原文（12行）</summary>

```text
                backend.clear_space().await;
                verify_expected_state(
                    backend,
                    &expectation,
                    &scope,
                    self.target_service().ok().as_deref(),
                )
                .await
            }
            _ => Err(format!("未知语义桌面工具: {tool_name}")),
        };
        result.map(|value| value.to_string())
```

</details>

**依据 16 · 源码核查**：[crates/nuphus-mcp/src/tools/mod.rs:100-105](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/mod.rs#L100-L105)

Ok文本变成功ToolOutput，不只看isError。

```text
    drop(file_guard);
    drop(process_guard);
    match result {
        Ok(text) => Ok(ToolOutput::success(text)),
        Err(e) => Ok(ToolOutput::failure(e)),
    }
```

#### 缺口

- 未实测候选覆盖/误命中、OS权限/本地策略识别、超时已执行及后置核准确率。
  **影响**：不能把process owner当用户隔离、AX派发当外部提交，或把局部UI变化当业务目标达成。
  **进一步探讨**：无敏感演示控件制造窗口切换/TTL/多进程/已满足状态/派发后观察失败，核是否拒旧token且保留Unknown，由业务真值验结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 浏览器动作和重试是否沿用同一防重复保证？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

MCP浏览器分支get_or_launch拿真实BrowserClient并run_op；以click为例最终@N转backendNodeId→resolve→Runtime.callFunctionOn执行this.click，evaluate也实际交page.evaluate，不只是schema声明。click可先装DOM变化探测，点击后无变化会报错并提示核页面/新tab；有变化或Clicked字符串都不是提交成功，返回后snapshot失败也可能附note而保留动作结果。

连接恢复层有明确读白名单，连接异常或超时先探活，dead才reconnect，非白名单写（含navigate）不自动重发并提示可能已执行；普通错误不在此恢复。需要再分一层：@N click内部调用retry_on_stale，按node/resolvenode/detached等错误字符串分类再调同一op。这不是独立未派发标记，本轮不能从外层“writes not auto-retried”推出所有底层写路径绝不重放，也未实证它发生重复。语义候选的消费/结构化Unknown不自动覆盖这一类原始CDP路径，失败后应读实际状态再决定，不把isError当未写。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/src/tools/browser.rs:178-202](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/browser.rs#L178-L202)

真实client调用及读白名单。

<details>
<summary>查看原文（25行）</summary>

```text
async fn run_tool(name: &str, args: &Value, timeout_secs: u64) -> Result<String, String> {
    // MCP scenarios use a visible browser window (same as the main crate's browser_tools)
    let mut guard = nuphus_browser::get_or_launch(false)
        .await
        .map_err(|e| format!("browser launch failed: {e}"))?;
    let client = guard
        .as_mut()
        .ok_or_else(|| "browser client unavailable".to_string())?;

    run_op_with_reconnect(client, name, args, timeout_secs).await
}

/// Tools safe to auto-retry after a reconnect: pure reads with no page-state side
/// effects. Writes (click/type/exec/cookies_set/upload/...) are NOT auto-retried —
/// the command may have reached the browser before the response was lost, and
/// re-issuing it would double-execute. browser_navigate is deliberately excluded:
/// re-navigation can resubmit forms (POST) and destroy in-progress page state.
const READ_ONLY_BROWSER_TOOLS: &[&str] = &[
    "browser_snapshot",
    "browser_extract",
    "browser_list_tabs",
    "browser_cookies_get",
    "browser_screenshot",
    "browser_list_downloads",
];
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/tools/browser.rs:221-274](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/browser.rs#L221-L274)

两条恢复分支都拒自动重发非白名单写。

<details>
<summary>查看原文（54行）</summary>

```text
    match tokio::time::timeout(timeout, run_op(client, name, args)).await {
        Ok(Ok(out)) => Ok(out),
        Ok(Err(e)) if BrowserClient::is_connection_error(&e) => {
            if client.is_connection_alive().await {
                return Err(format!(
                    "Browser '{name}' failed with a connection error but the CDP connection is \
                     still responsive ({e}); the page is likely busy or mid-navigation — retry \
                     later"
                ));
            }
            tracing::warn!(
                "[browser] CDP connection failed ({e}); reattaching to the task browser"
            );
            client
                .reconnect()
                .await
                .map_err(|e| format!("browser reconnect failed: {e}"))?;
            if !is_read_only_tool(name) {
                // The write may have executed before the connection dropped; the
                // browser is healthy again, but re-issuing could double-execute.
                return Err(format!(
                    "Browser '{name}' failed with a dead CDP connection ({e}); the browser was \
                     reconnected, but the operation may have already executed before the connection \
                     dropped — verify the page state, then retry manually (writes are not auto-retried)."
                ));
            }
            tokio::time::timeout(timeout, run_op(client, name, args))
                .await
                .map_err(|_| format!("Browser '{name}' retry timed out after {timeout_secs}s"))?
                .map_err(|e| e.to_string())
        }
        Ok(Err(e)) => Err(e.to_string()),
        Err(_elapsed) => {
            // Operation hung past the budget. Distinguish a dead connection from
            // slow-but-healthy work: only reconnect when the probe also fails.
            if client.is_connection_alive().await {
                return Err(format!("Browser '{name}' timed out after {timeout_secs}s"));
            }
            tracing::warn!("[browser] operation timed out after {timeout_secs}s and probe failed; reattaching without killing a live browser");
            client
                .reconnect()
                .await
                .map_err(|e| format!("browser reconnect failed: {e}"))?;
            if !is_read_only_tool(name) {
                return Err(format!(
                    "Browser '{name}' timed out after {timeout_secs}s; the browser was reconnected, \
                     but the operation may have already executed — verify the page state, then \
                     retry manually (writes are not auto-retried)."
                ));
            }
            tokio::time::timeout(timeout, run_op(client, name, args))
                .await
                .map_err(|_| format!("Browser '{name}' retry timed out after {timeout_secs}s"))?
                .map_err(|e| e.to_string())
```

</details>

**依据 3 · 源码核查**：[crates/nuphus-mcp/src/tools/browser.rs:314-362](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/browser.rs#L314-L362)

真实click/局部DOM变化/可选snapshot失败。

<details>
<summary>查看原文（49行）</summary>

```text
        "browser_click" => {
            let selector = selector_or_ref("browser_click", args)?;
            let trusted = args
                .get("trusted")
                .and_then(Value::as_bool)
                .unwrap_or(false);
            let button = args.get("button").and_then(Value::as_str).unwrap_or("left");
            if !matches!(button, "left" | "right" | "middle") {
                return Err(BrowserError::Execution(format!(
                    "browser_click: unsupported button '{button}' (expected left, right, or middle)"
                )));
            }
            // Effect verification: arm the change detector before dispatching,
            // then wait a window for the page to react. A click that changes
            // nothing within the window very likely did not take effect (dead
            // button / covered element / wrong selector) — surface it instead of
            // letting the next step proceed on a false "clicked" premise.
            let effect_timeout = effect_timeout_ms();
            let verify_effect = button == "left" && effect_timeout > 0;
            if verify_effect {
                client.arm_change_detector().await?;
            }
            let result = if trusted || button != "left" {
                client.click_trusted(selector, button).await?
            } else {
                client.click(selector).await?
            };
            if verify_effect && !client.wait_for_change(effect_timeout).await? {
                return Err(BrowserError::Execution(format!(
                    "Click on '{}' executed but no DOM change was detected within {}ms — the click \
                     likely did not take effect (dead/covered element, wrong selector, or an \
                     effect that doesn't mutate this page such as opening a new tab). Verify the \
                     page state with browser_snapshot / browser_list_tabs before the next step.",
                    selector, effect_timeout
                )));
            }
            let include_snapshot = args
                .get("snapshot")
                .and_then(Value::as_bool)
                .unwrap_or(button == "left");
            if !include_snapshot {
                return Ok(result);
            }
            match client.snapshot(false, None).await {
                Ok(snap) => format!("{}\n\n── Page state ──\n{}", result, snap),
                Err(e) => format!(
                    "{}\n\n── Note: post-action snapshot failed; page state unavailable for the next step: {} ──",
                    result, e
                ),
```

</details>

**依据 4 · 源码核查**：[crates/nuphus-browser/src/client.rs:2169-2186](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/client.rs#L2169-L2186)

@N click确接内部stale重试。

<details>
<summary>查看原文（18行）</summary>

```text
    pub async fn click(&self, selector: &str) -> Result<String, BrowserError> {
        let page = self.get_page().await?;
        let page_guard = page.lock().await;

        // New AX tree ref: @N (1-based index into snapshot_refs)
        if let Some(idx_str) = selector.strip_prefix('@') {
            if let Ok(idx) = idx_str.parse::<usize>() {
                let (backend_id, frame_label) = self.ax_ref(idx)?;
                return self
                    .retry_on_stale(|| {
                        self.click_via_backend_node_id(
                            &page_guard,
                            backend_id,
                            selector,
                            frame_label,
                        )
                    })
                    .await;
```

</details>

**依据 5 · 源码核查**：[crates/nuphus-browser/src/client.rs:2692-2723](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/client.rs#L2692-L2723)

重试实际调用与字符串分类。

<details>
<summary>查看原文（32行）</summary>

```text
    async fn retry_on_stale<F, Fut>(&self, mut op: F) -> Result<String, BrowserError>
    where
        F: FnMut() -> Fut,
        Fut: std::future::Future<Output = Result<String, BrowserError>>,
    {
        let mut last_err = match op().await {
            Ok(ok) => return Ok(ok),
            Err(e) => e,
        };
        for _ in 0..STALE_NODE_RETRIES {
            if !Self::is_stale_node_error(&last_err) {
                return Err(last_err);
            }
            tokio::time::sleep(std::time::Duration::from_millis(STALE_NODE_RETRY_MS)).await;
            match op().await {
                Ok(ok) => return Ok(ok),
                Err(e) => last_err = e,
            }
        }
        Err(last_err)
    }

    /// Classify failures caused by a stale backend node (node destroyed or
    /// replaced between snapshot and action) — the only @N errors worth
    /// retrying.
    fn is_stale_node_error(err: &BrowserError) -> bool {
        let msg = err.to_string().to_ascii_lowercase();
        msg.contains("node with given id")
            || msg.contains("resolvenode")
            || msg.contains("node is detached")
            || msg.contains("not attached")
    }
```

</details>

**依据 6 · 源码核查**：[crates/nuphus-browser/src/client.rs:2756-2791](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/client.rs#L2756-L2791)

resolve→CDP this.click→返回/异常。

<details>
<summary>查看原文（36行）</summary>

```text
    async fn click_via_backend_node_id(
        &self,
        page: &Page,
        backend_node_id: u32,
        selector: &str,
        frame_label: Option<&str>,
    ) -> Result<String, BrowserError> {
        let displayed = Self::ref_with_frame(selector, frame_label);
        let object_id = self
            .resolve_backend_node(page, backend_node_id, frame_label)
            .await?;

        let cmd = RuntimeCallFunctionOn {
            function_declaration: "function(){ this.scrollIntoViewIfNeeded(); this.click(); }"
                .to_string(),
            object_id: Some(object_id.inner().clone()),
            return_by_value: Some(true),
            await_promise: Some(true),
        };

        let resp = cdp_ctx("Runtime.callFunctionOn failed", page.execute(cmd)).await?;

        // Check for JS exception in response
        if let Some(details) = resp.result.get("exceptionDetails") {
            let desc = details
                .get("exception")
                .and_then(|e| e.get("description"))
                .and_then(|v| v.as_str())
                .unwrap_or("unknown exception");
            return Err(BrowserError::Execution(format!(
                "Click JS exception on {}: {}",
                displayed, desc
            )));
        }

        Ok(format!("Clicked {}", displayed))
```

</details>

**依据 7 · 源码核查**：[crates/nuphus-mcp/src/tools/browser.rs:466-468](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/browser.rs#L466-L468)

evaluate真实调用。

```text
        "browser_evaluate" => {
            let script = args.get("script").and_then(Value::as_str).unwrap_or("");
            client.evaluate(script).await.map(|v| v.to_string())?
```

**依据 8 · 源码核查**：[crates/nuphus-browser/src/client.rs:3387-3409](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/client.rs#L3387-L3409)

最终page.evaluate及启发式await包装。

<details>
<summary>查看原文（23行）</summary>

```text
    pub async fn evaluate(&self, script: &str) -> Result<serde_json::Value, BrowserError> {
        let page = self.get_page().await?;
        let page_guard = page.lock().await;

        // Only wrap in async IIFE when script contains `await`.
        // Otherwise sync expressions (e.g. "document.title") return undefined
        // because there's no `return` inside the async wrapper.
        // Known limitation: this is a substring heuristic, not a parse — `await`
        // inside a comment or string literal (e.g. `const s = "await me"`) also
        // triggers the wrapper (the script then needs its own `return`, which is
        // the documented contract for async scripts), and genuinely async code
        // using .then() without the `await` keyword is not wrapped.
        let wrapped = if script.contains("await") {
            format!("(async () => {{\n{}\n}})()", script)
        } else {
            script.to_string()
        };

        let result = cdp(page_guard.evaluate(wrapped)).await?;

        let value = result.into_value().unwrap_or(serde_json::Value::Null);

        Ok(value)
```

</details>

#### 缺口

- 未模拟CDP断连/超时和各stale分类在派发前后的真实边界或重复动作。
  **影响**：不能给所有写exactly-once承诺，或凭无DOM变化错误自动再点；可能在已产生效果后失去确认。
  **进一步探讨**：用可计数无害按钮模拟断连/不同stale错误，记录真正点击次数、响应和恢复，人工对账后才允许下一动作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 严格确认、原始工具与截图外发的权限边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

严格确认由--confirm-write或环境变量开启，默认false；开启仅对定义的写工具要求调用参数confirm=true。此值来自调用者，不是独立用户批准证明。破坏性annotations只是给Host提示，不能当服务端授权UI。语义关键动作未接交互通道会拒是独立局部策略；原始desktop_mouse/input、browser_evaluate/exec/cookie写等由其他分支执行，不应外推都经语义候选风险判定或有工作区沙箱。进程/文件锁仅单次工具调用互斥，不锁整个观察→执行工作流，也不排除真人/其他应用改变状态。

stdio无需给本地MCP启HTTP服务，不等工具不联网或没有高权限。原始cookie读取可返回账号资料；desktop_vision在未给path时抓全屏，最终带图像内容/提示词向配置服务POST并带Key，HTTPS校验只解决传输一层，不是外发授权。desktop_perceive本地OCR路径不必调用云视觉，但ensure_models可能首用下载/落盘，YOLO可降级；模型与浏览器权限、真实账号和敏感屏幕必须分开。本轮不审完所有路径校验/secret处理，不给全局隐私保证。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/src/main.rs:59-69](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/main.rs#L59-L69)

strict显式开启。

<details>
<summary>查看原文（11行）</summary>

```text
    // --confirm-write CLI flag overrides the environment variable
    let cli_confirm = std::env::args().any(|a| a == "--confirm-write");
    let policy = if cli_confirm {
        SecurityPolicy {
            strict_confirm: true,
        }
    } else {
        SecurityPolicy::from_env()
    };
    if policy.strict_confirm {
        tracing::warn!("[nuphus-mcp] STRICT CONFIRM MODE: write tools require \"confirm\": true");
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/security.rs:121-150](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/security.rs#L121-L150)

默认off与调用者bool。

<details>
<summary>查看原文（30行）</summary>

```text
impl SecurityPolicy {
    /// Read from environment variable (`NUPHUS_MCP_CONFIRM_WRITE=1`).
    pub fn from_env() -> Self {
        Self {
            strict_confirm: std::env::var("NUPHUS_MCP_CONFIRM_WRITE")
                .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
                .unwrap_or(false),
        }
    }

    /// Write confirmation check: in strict mode write tools must carry `"confirm": true`.
    /// Returns Err(msg) when execution should be rejected.
    pub fn check_write_confirmation(&self, name: &str, args: &Value) -> Result<(), String> {
        if !self.strict_confirm {
            return Ok(());
        }
        if !is_write_tool(name, args) {
            return Ok(());
        }
        let confirmed = args
            .get("confirm")
            .and_then(Value::as_bool)
            .unwrap_or(false);
        if confirmed {
            return Ok(());
        }
        Err(format!(
            "write operation '{}' requires explicit confirmation: set \"confirm\": true in arguments (strict confirm mode)",
            name
        ))
```

</details>

**依据 3 · 源码核查**：[crates/nuphus-mcp/src/security.rs:18-35](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/security.rs#L18-L35)

写能力分类含raw/CDP/cookie。

<details>
<summary>查看原文（18行）</summary>

```text
fn is_write_tool_name_only(name: &str) -> bool {
    matches!(
        name,
        // desktop writes
        "desktop_mouse_drag" | "desktop_input" | "desktop_window_activate"
            | "desktop_window_screenshot" | "desktop_window_move" | "desktop_window_resize"
            | "desktop_screenshot" | "desktop_clipboard_write"
            | "desktop_clipboard_clean"
            // semantic desktop writes: binding may launch/activate an application, and
            // both execution tools dispatch a native UIA action
            | "desktop_target_bind" | "desktop_semantic_execute" | "desktop_semantic_action"
            // browser writes
            | "browser_navigate" | "browser_click" | "browser_type" | "browser_press" | "browser_exec"
            | "browser_scroll" | "browser_screenshot" | "browser_close" | "browser_evaluate"
            | "browser_back" | "browser_forward" | "browser_cookies_set"
            | "browser_import_cookies" | "browser_upload" | "browser_drag_files" | "browser_new_tab"
            | "browser_switch_tab"
    )
```

</details>

**依据 4 · 源码核查**：[crates/nuphus-mcp/src/tools/mod.rs:51-101](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/mod.rs#L51-L101)

锁只包单次实际execute。

<details>
<summary>查看原文（51行）</summary>

```text
pub async fn execute(name: &str, args: &serde_json::Value) -> Result<ToolOutput, String> {
    // Process-level mutual exclusion: serialize automation operations within this
    // process. Held across the await points of the actual tool call.
    // Bounded: this lock sits *outside* every per-tool budget, so an unbounded
    // wait here would wedge the whole server (one stuck tool = every later call
    // unanswered). Give up with a readable busy error instead.
    static PROCESS_LOCK: std::sync::OnceLock<tokio::sync::Mutex<()>> = std::sync::OnceLock::new();
    let process_guard = match tokio::time::timeout(
        std::time::Duration::from_secs(PROCESS_LOCK_TIMEOUT_SECS),
        PROCESS_LOCK
            .get_or_init(|| tokio::sync::Mutex::new(()))
            .lock(),
    )
    .await
    {
        Ok(guard) => guard,
        Err(_) => {
            return Ok(ToolOutput::failure(format!(
                "Automation is busy: another operation in this process has held the automation \
                 lock for over {PROCESS_LOCK_TIMEOUT_SECS}s; retry later."
            )));
        }
    };

    // Cross-process lock: full coverage for every desktop_*/browser_* tool.
    // Read-only operations (e.g. desktop_screen_size) also acquire it — they still
    // touch the shared machine state and must not interleave with a writer's sequence.
    let lock = crate::automation_lock::AutomationLock::new();
    let file_guard = match lock.acquire(name) {
        Ok(guard) => guard,
        Err(e) => return Ok(ToolOutput::failure(e)),
    };

    // Test-only panic hook: exercised by the server panic-guard test to prove a
    // panicking tool cannot kill the process and that both locks above are
    // released by RAII while the panic unwinds. Compiled out in production.
    #[cfg(test)]
    if name == "test_panic_tool" {
        panic!("intentional test panic (automation lock guard must unwind safely)");
    }

    let result = if name.starts_with("desktop_") {
        desktop::execute(name, args).await
    } else if name.starts_with("browser_") {
        browser::execute(name, args).await
    } else {
        return Err(format!("Unknown tool: {}", name));
    };

    drop(file_guard);
    drop(process_guard);
```

</details>

**依据 5 · 源码核查**：[crates/nuphus-mcp/src/tools/browser.rs:451-468](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/browser.rs#L451-L468)

实际cookie/JS能力。

<details>
<summary>查看原文（18行）</summary>

```text
        "browser_cookies_get" => {
            let cookies = client.cookies_get().await?;
            serde_json::to_string_pretty(&cookies).unwrap_or_default()
        }
        "browser_cookies_set" => {
            let name = args.get("name").and_then(Value::as_str).unwrap_or("");
            let value = args.get("value").and_then(Value::as_str).unwrap_or("");
            let domain = args.get("domain").and_then(Value::as_str);
            let path = args.get("path").and_then(Value::as_str);
            client.cookies_set(name, value, domain, path).await?
        }
        "browser_import_cookies" => {
            let domain = args.get("domain").and_then(Value::as_str);
            client.import_cookies(domain).await?
        }
        "browser_evaluate" => {
            let script = args.get("script").and_then(Value::as_str).unwrap_or("");
            client.evaluate(script).await.map(|v| v.to_string())?
```

</details>

**依据 6 · 源码核查**：[crates/nuphus-mcp/src/tools/desktop.rs:355-378](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/desktop.rs#L355-L378)

全屏vision与本地perceive不同路径。

<details>
<summary>查看原文（24行）</summary>

```text
async fn vision(args: &Value) -> Result<String, String> {
    let prompt = args.get("prompt").and_then(Value::as_str);
    // `_temp` keeps the temp-PNG guard alive until the vision call completes.
    let (image_path, _temp) = match args.get("path").and_then(Value::as_str) {
        Some(p) => (p.to_string(), None),
        None => {
            let (temp, _geometry) = TempCapture::capture(Scope::Fullscreen).await?;
            (temp.path().to_string(), Some(temp))
        }
    };
    let text = crate::vision::vision_image(&image_path, prompt).await?;
    Ok(json!({ "description": text }).to_string())
}

/// desktop_perceive — local OCR + YOLO element location.
///
/// Auto-downloads PaddleOCR models on first run; missing models with failed downloads → clear error.
/// Auto-captures a screenshot when `path` is omitted (full screen, or `region` when given) and then
/// reports elements in *screen* coordinates, so `center` can be clicked as-is; a caller-supplied
/// `path` has no known screen origin, so its elements stay in image coordinates.
/// When the YOLO model is missing, returns OCR-only results and reports it honestly.
async fn perceive(args: &Value) -> Result<String, String> {
    // 1. Ensure models are ready (auto-download missing OCR models)
    let status = crate::models::ensure_models().await?;
```

</details>

**依据 7 · 源码核查**：[crates/nuphus-mcp/src/vision.rs:102-115](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/vision.rs#L102-L115)

HTTPS/本地HTTP边界非用户授权。

<details>
<summary>查看原文（14行）</summary>

```text
        let base_url = base_url.trim_end_matches('/').to_string();

        // Enforce HTTPS: screenshots sent to a remote endpoint must not leak over
        // plaintext. Loopback (localhost/127.0.0.1) is allowed over http for local
        // test endpoints (e.g. Ollama).
        let is_loopback = match reqwest::Url::parse(&base_url) {
            Ok(u) => matches!(u.host_str(), Some("localhost" | "127.0.0.1" | "::1")),
            Err(_) => false,
        };
        if base_url.starts_with("http://") && !is_loopback {
            return Err(format!(
                "NUPHUS_MCP_VISION_BASE_URL must use https (plain http is only allowed for localhost/127.0.0.1 test endpoints): {base_url}"
            ));
        }
```

</details>

**依据 8 · 源码核查**：[crates/nuphus-mcp/src/vision.rs:287-318](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/vision.rs#L287-L318)

真实视觉请求内容/HTTP/认证。

<details>
<summary>查看原文（32行）</summary>

```text
            &config.base_url,
            mime_type,
            &base64_image,
            prompt_text,
            config.max_tokens,
        )
    } else {
        openai_request(
            &config.model,
            &config.base_url,
            mime_type,
            &base64_image,
            prompt_text,
            config.max_tokens,
        )
    };

    // 3. POST
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
        .map_err(|e| format!("build http client failed: {}", e))?;

    let mut request = client.post(&url).header("Content-Type", "application/json");
    for (k, v) in provider_headers(config.provider, &config.api_key) {
        request = request.header(k, v);
    }
    let response = request
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("vision API request failed: {}", e))?;
```

</details>

**依据 9 · 源码核查**：[crates/nuphus-mcp/src/models.rs:62-83](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/models.rs#L62-L83)

本地模型检查与下载落盘。

<details>
<summary>查看原文（22行）</summary>

```text
pub async fn ensure_models() -> Result<ModelStatus, String> {
    let dir = models_dir_for_write()?;
    let mut downloaded: Vec<String> = Vec::new();

    let skip_download = std::env::var("NUPHUS_MCP_NO_MODEL_DOWNLOAD")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);

    // Validate first, to avoid unnecessary requests when everything is already present.
    // One shared client covers the OCR trio and the YOLO model.
    let ocr_missing = validate_ocr_models(&dir).is_err();
    let yolo_missing = !yolo_model_available(&dir);
    if !skip_download && (ocr_missing || yolo_missing) {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(120))
            .build()
            .map_err(|e| format!("build http client failed: {}", e))?;

        if ocr_missing {
            for file in PADDLE_OCR_FILES {
                let dest = dir.join(file);
                if dest.exists() {
```

</details>

#### 缺口

- 未审全部raw操作/路径/账号隔离或真实Host的人类批准绑定，未测图片外发内容和凭据清理。
  **影响**：不适合直接把真实已登录桌面/敏感屏幕交给未经约束Agent，confirm字段和局部语义拒绝不构成统一不可绕过审批。
  **进一步探讨**：独立测试账户/浏览器资料和演示屏幕，仅核必要工具；确认Host真实批准通道、外发端点/内容与权限撤销后再扩。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 环境、首用/持续/失败/退出需要哪些资源？

**研究主题**：效果与总成本、采用判断

#### 完整回答

平台原生包或Rust构建、MCP Host、系统截屏/辅助功能权限是首用条件；浏览器需Chrome/Edge/CDP，语义桌面有Windows/macOS实现而其他平台可能不支持，不能把cross-platform表述当全能力齐全。本地OCR需模型下载/磁盘/CPU，云视觉另需Key/服务账单，外部Agent仍有模型token；“zero-cost stdio”不是全部任务成本为零。持续有页面/应用版本、观察/截图与人工核对，未量化净节时、OCR/后置核质量或费用。

失败先分锁忙、候选过期、未派发拒绝与可能已派发/后置Unknown，不用旧token或错误字符串当业务未写证明。恢复先重观/查页面及应用真值，避免重复点击/上传；退出时正常MCP exit/EOF确调用shutdown_browser，client.close只对本进程child发Browser.close/kill，附着浏览器只断开。shared shutdown的close有5秒等待，但拿shared锁在外，不能说整个退出总是5秒或被杀进程必清干净。浏览器Profile、cookie、下载、模型缓存、OS授权/Key与已发生外部业务动作不因关MCP自动撤销，本轮未核统一删除。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:83-105](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/README.md#L83-L105)

作者平台/依赖列表作为环境线索。

<details>
<summary>查看原文（23行）</summary>

```text
- **Chrome or Edge** — required for browser tools. The server auto-detects an
  installed browser; if none is found, `browser_*` tools return a clear error.
- **Windows recommended** for full desktop control — see Platform Support below.

## Platform Support

| Platform | Browser tools | Desktop tools |
|----------|---------------|---------------|
| Windows  | Full          | Full (Win32 API) |
| macOS    | Full          | Semantic (AX) + mouse/keyboard (Accessibility permission required) |
| Linux    | Available     | Partial — window/input capabilities are limited |

> **Execution HUD**: non-intrusive execution feedback on every platform — Windows shows a compact status card anchored to the bottom-right of the work area, clear of the taskbar/tray (start / done / fail, real-time, styled after the main app HUD), macOS/Linux post a **system notification** on completion (`NUPHUS_MCP_HUD=off` to disable). Window activation is never used as a visibility fallback.

## API Keys & Local Models

### Vision — BYOK, OpenAI-compatible or Anthropic native

`desktop_vision` uses **your own** vision model. It speaks two protocols:
- **OpenAI-compatible** Chat Completions (default) — works with OpenAI, MiniMax, Qwen, Ollama, vLLM, …
- **Anthropic native** Messages API — point `NUPHUS_MCP_VISION_BASE_URL` at
  `https://api.anthropic.com/v1` and the protocol is auto-detected from the host;
  or force it with `NUPHUS_MCP_VISION_PROVIDER=anthropic`.
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:380-390](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L380-L390)

实际平台选择与stub。

<details>
<summary>查看原文（11行）</summary>

```text
fn backend() -> &'static Arc<SemanticDesktopBackend> {
    static BACKEND: std::sync::OnceLock<Arc<SemanticDesktopBackend>> = std::sync::OnceLock::new();
    BACKEND.get_or_init(|| {
        #[cfg(windows)]
        let adapter = desktop_api::semantic::WindowsUiaAdapter::default();
        #[cfg(target_os = "macos")]
        let adapter = desktop_api::semantic::MacosAccessibilityAdapter::default();
        // Windows UIA keeps an explicit unsupported stub on other platforms, so
        // Linux still reports the same "unsupported" observation error as before.
        #[cfg(not(any(windows, target_os = "macos")))]
        let adapter = desktop_api::semantic::WindowsUiaAdapter::default();
```

</details>

**依据 3 · 源码核查**：[crates/nuphus-mcp/src/models.rs:62-83](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/models.rs#L62-L83)

模型资源成本。

<details>
<summary>查看原文（22行）</summary>

```text
pub async fn ensure_models() -> Result<ModelStatus, String> {
    let dir = models_dir_for_write()?;
    let mut downloaded: Vec<String> = Vec::new();

    let skip_download = std::env::var("NUPHUS_MCP_NO_MODEL_DOWNLOAD")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);

    // Validate first, to avoid unnecessary requests when everything is already present.
    // One shared client covers the OCR trio and the YOLO model.
    let ocr_missing = validate_ocr_models(&dir).is_err();
    let yolo_missing = !yolo_model_available(&dir);
    if !skip_download && (ocr_missing || yolo_missing) {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(120))
            .build()
            .map_err(|e| format!("build http client failed: {}", e))?;

        if ocr_missing {
            for file in PADDLE_OCR_FILES {
                let dest = dir.join(file);
                if dest.exists() {
```

</details>

**依据 4 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:626-669](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L626-L669)

派发/后置未知恢复。

<details>
<summary>查看原文（44行）</summary>

```text
    // An execution error may mean a native timeout after dispatch. Consume the
    // token before attempting it; callers must observe rather than replay.
    backend.clear_space().await;
    let receipt = match backend.executor.execute(&fresh, candidate, input).await {
        Ok(receipt) => receipt,
        Err(error) => {
            if let desktop_api::semantic::AutomationError::Execution(ref message) = error {
                if DesktopActionError::decode(message).is_some() {
                    return Err(message.clone());
                }
            }
            return Ok(json!({
                "status": "needs_observation", "candidate_id": candidate.id,
                "verification": Verification::Unknown, "dispatch_state": "unknown", "effect":ActionEffect::Unverifiable,
                "reason": error.to_string(), "retry_action": false, "decision": decision,
            }));
        }
    };
    if receipt.candidate_id != candidate.id {
        return Err(DesktopActionError::encode(
            DispatchState::Unknown,
            "执行回执与候选动作不一致",
        ));
    }
    // Consume the observation once dispatch may have happened. A failed read
    // afterwards must never leave a replayable click/send candidate cached.
    backend.clear_space().await;
    let (after, verification) = match verify_with_settle(
        backend,
        &fresh,
        &verification_candidate,
        input,
        &scope,
    )
    .await
    {
        Ok(value) => value,
        Err(error) => {
            return Ok(json!({
                "status": "needs_observation", "candidate_id": candidate.id,
                "receipt": receipt, "verification": Verification::Unknown,
                "dispatch_state": if receipt.dispatched { DispatchState::Sent } else { DispatchState::NotSent },
                "effect":ActionEffect::Unverifiable,
                "reason": error, "retry_action": false, "decision": decision,
```

</details>

**依据 5 · 源码核查**：[crates/nuphus-mcp/src/main.rs:113-129](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/main.rs#L113-L129)

正常exit/EOF真实cleanup。

<details>
<summary>查看原文（17行）</summary>

```text
        // 1 when the client skipped the graceful shutdown (per spec).
        if server.exit_received() {
            writer.flush().await?;
            let code = server.exit_code();
            tracing::info!("[nuphus-mcp] exit notification received, exiting (code={code})");
            // Explicit browser shutdown: the shared client lives in a `static` and is never
            // dropped on exit, so without this a launched Chrome would be orphaned, holding
            // the profile lock and destabilizing the next session (see shared::shutdown_browser).
            shutdown_browser().await;
            std::process::exit(code as i32);
        }
    }

    // stdin EOF (host closed the pipe): same explicit cleanup before returning.
    tracing::info!("[nuphus-mcp] stdin EOF, shutting down");
    shutdown_browser().await;
    Ok(())
```

</details>

**依据 6 · 源码核查**：[crates/nuphus-browser/src/shared.rs:82-88](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/shared.rs#L82-L88)

先拿锁再对close timeout。

```text
pub async fn shutdown_browser() {
    let shared = shared_client();
    let mut guard = shared.lock().await;
    if let Some(client) = guard.as_mut() {
        let _ = tokio::time::timeout(std::time::Duration::from_secs(5), client.close()).await;
    }
    *guard = None;
```

**依据 7 · 源码核查**：[crates/nuphus-browser/src/client.rs:3684-3723](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/client.rs#L3684-L3723)

只关owned child/清会话引用，非删所有资料。

<details>
<summary>查看原文（40行）</summary>

```text
    pub async fn close(&mut self) -> Result<(), BrowserError> {
        // Only send Browser.close to an instance launched by this process (it terminates the Chrome process);
        // an attached instance belongs to another process — dropping the local connection is enough, we must not close someone else's browser.
        if let Some(browser_arc) = self.browser.take() {
            if self.child_process.is_some() {
                let mut browser = browser_arc.lock().await;
                // `Browser.close` is a CDP round trip: bound it so a wedged
                // connection cannot hold this call (and the shared client)
                // past the tool budget.
                let _ = tokio::time::timeout(
                    std::time::Duration::from_secs(CLOSE_TIMEOUT_SECS),
                    browser.close(),
                )
                .await;
                drop(browser);
            }
            drop(browser_arc);
        }
        self.page = None;
        self.launched_headless = None;
        self.selected_target_id = None;
        self.page_creation_pending = false;
        // Session state must not leak into the next launch: @N refs die with the
        // page, and download behavior has to be re-configured on the new browser.
        self.snapshot_refs.clear();
        self.helpers_injected = false;
        self.download_configured = false;
        self.download_config_warning = None;

        // Kill the child process (managed manually, not via Browser::launch).
        // Bounded: a Chrome that ignores terminate must not block shutdown or a
        // reconnect forever (the handle is dropped either way).
        if let Some(mut child) = self.child_process.take() {
            let _ = tokio::time::timeout(
                std::time::Duration::from_secs(CLOSE_TIMEOUT_SECS),
                child.kill(),
            )
            .await;
            let _ = tokio::time::timeout(
                std::time::Duration::from_secs(CLOSE_TIMEOUT_SECS),
```

</details>

#### 缺口

- 未运行各平台/包/Host或测CPU、图片token、云费用、取消/杀进程与持久数据退出。
  **影响**：不能保证一次安装即全工具可用、总体省钱或关服务就恢复桌面/删除凭据。
  **进一步探讨**：匹配平台隔离演示任务，测首次模型/权限、连续任务、未知派发对账和正常/强退清理，分别核profile/缓存/授权与外部结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 下一步生产方向如何超出已有语义回执？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可先由能隔离测试账户/浏览器资料的MCP自动化开发者，在无敏感演示应用试语义观察和少量可核动作；直接AX/CDP脚本已够的确定任务不必引入全部工具。已有候选、派发receipt、局部verify_state和business_goal_confirmed=false都应承认，不能把“加验证/防重试”作为新实现。

未来增量是把跨原始像素/CDP/语义工具的派发不确定性与人类批准绑定到具体目标/一次操作，并为少数业务动作增加独立后置真值（如演示文件/消息记录ID），在结果不明时只读对账而非重放。当前语义局部状态有基础，CDP底层stale分类与通用confirm仍需明确边界；未来不能把本地dispatched布尔伪装业务提交证明。对照直接脚本/当前MCP/统一协议版，用无害计数按钮、窗口切换、已执行丢响应、无DOM但有后台结果、真假批准等样本；测错目标、重复效果、误报完成、人工恢复和总资源成本。若误报或重复未降、批准摩擦/维护高于收益则停止，只保留局部修复。未实现或证明商业需求。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/src/tools/semantic.rs:626-694](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/semantic.rs#L626-L694)

已有派发/局部核验/业务false基础，不重复归功。

<details>
<summary>查看原文（69行）</summary>

```text
    // An execution error may mean a native timeout after dispatch. Consume the
    // token before attempting it; callers must observe rather than replay.
    backend.clear_space().await;
    let receipt = match backend.executor.execute(&fresh, candidate, input).await {
        Ok(receipt) => receipt,
        Err(error) => {
            if let desktop_api::semantic::AutomationError::Execution(ref message) = error {
                if DesktopActionError::decode(message).is_some() {
                    return Err(message.clone());
                }
            }
            return Ok(json!({
                "status": "needs_observation", "candidate_id": candidate.id,
                "verification": Verification::Unknown, "dispatch_state": "unknown", "effect":ActionEffect::Unverifiable,
                "reason": error.to_string(), "retry_action": false, "decision": decision,
            }));
        }
    };
    if receipt.candidate_id != candidate.id {
        return Err(DesktopActionError::encode(
            DispatchState::Unknown,
            "执行回执与候选动作不一致",
        ));
    }
    // Consume the observation once dispatch may have happened. A failed read
    // afterwards must never leave a replayable click/send candidate cached.
    backend.clear_space().await;
    let (after, verification) = match verify_with_settle(
        backend,
        &fresh,
        &verification_candidate,
        input,
        &scope,
    )
    .await
    {
        Ok(value) => value,
        Err(error) => {
            return Ok(json!({
                "status": "needs_observation", "candidate_id": candidate.id,
                "receipt": receipt, "verification": Verification::Unknown,
                "dispatch_state": if receipt.dispatched { DispatchState::Sent } else { DispatchState::NotSent },
                "effect":ActionEffect::Unverifiable,
                "reason": error, "retry_action": false, "decision": decision,
            }))
        }
    };
    if matches!(
        verification,
        Verification::Achieved | Verification::Progress
    ) {
        // Progress was observed; nothing else to record here.
    }
    Ok(json!({
        "status": if matches!(verification, Verification::Achieved | Verification::Progress) { "executed" } else { "needs_observation" },
        "candidate_id": candidate.id,
        "description": candidate.public_description,
        "receipt": receipt,
        "verification": verification,
        "dispatch_state": if receipt.dispatched { DispatchState::Sent } else { DispatchState::NotSent },
        "effect": if verification == Verification::Achieved { ActionEffect::Confirmed } else if verification == Verification::NoChange { ActionEffect::SuspectedNoop } else { ActionEffect::Unverifiable },
        "before_revision": fresh.revision,
        "after_revision": after.revision,
        "after_window": after.window,
        "after_app": after.app,
        "business_goal_confirmed": false,
        "retry_action": false,
        "decision": decision,
    }))
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/security.rs:133-150](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/security.rs#L133-L150)

调用者确认不等独立批准。

<details>
<summary>查看原文（18行）</summary>

```text
    pub fn check_write_confirmation(&self, name: &str, args: &Value) -> Result<(), String> {
        if !self.strict_confirm {
            return Ok(());
        }
        if !is_write_tool(name, args) {
            return Ok(());
        }
        let confirmed = args
            .get("confirm")
            .and_then(Value::as_bool)
            .unwrap_or(false);
        if confirmed {
            return Ok(());
        }
        Err(format!(
            "write operation '{}' requires explicit confirmation: set \"confirm\": true in arguments (strict confirm mode)",
            name
        ))
```

</details>

**依据 3 · 源码核查**：[crates/nuphus-browser/src/client.rs:2692-2723](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-browser/src/client.rs#L2692-L2723)

跨族未知与底层分类具体差异。

<details>
<summary>查看原文（32行）</summary>

```text
    async fn retry_on_stale<F, Fut>(&self, mut op: F) -> Result<String, BrowserError>
    where
        F: FnMut() -> Fut,
        Fut: std::future::Future<Output = Result<String, BrowserError>>,
    {
        let mut last_err = match op().await {
            Ok(ok) => return Ok(ok),
            Err(e) => e,
        };
        for _ in 0..STALE_NODE_RETRIES {
            if !Self::is_stale_node_error(&last_err) {
                return Err(last_err);
            }
            tokio::time::sleep(std::time::Duration::from_millis(STALE_NODE_RETRY_MS)).await;
            match op().await {
                Ok(ok) => return Ok(ok),
                Err(e) => last_err = e,
            }
        }
        Err(last_err)
    }

    /// Classify failures caused by a stale backend node (node destroyed or
    /// replaced between snapshot and action) — the only @N errors worth
    /// retrying.
    fn is_stale_node_error(err: &BrowserError) -> bool {
        let msg = err.to_string().to_ascii_lowercase();
        msg.contains("node with given id")
            || msg.contains("resolvenode")
            || msg.contains("node is detached")
            || msg.contains("not attached")
    }
```

</details>

**依据 4 · 源码核查**：[crates/nuphus-mcp/src/tools/browser.rs:341-361](https://github.com/mrpulor-gh/nuphus-mcp/blob/0a689c14aa26638dca1638752e7a0e88c4f4fe20/crates/nuphus-mcp/src/tools/browser.rs#L341-L361)

局部页面效果非业务真值。

<details>
<summary>查看原文（21行）</summary>

```text
            if verify_effect && !client.wait_for_change(effect_timeout).await? {
                return Err(BrowserError::Execution(format!(
                    "Click on '{}' executed but no DOM change was detected within {}ms — the click \
                     likely did not take effect (dead/covered element, wrong selector, or an \
                     effect that doesn't mutate this page such as opening a new tab). Verify the \
                     page state with browser_snapshot / browser_list_tabs before the next step.",
                    selector, effect_timeout
                )));
            }
            let include_snapshot = args
                .get("snapshot")
                .and_then(Value::as_bool)
                .unwrap_or(button == "left");
            if !include_snapshot {
                return Ok(result);
            }
            match client.snapshot(false, None).await {
                Ok(snap) => format!("{}\n\n── Page state ──\n{}", result, snap),
                Err(e) => format!(
                    "{}\n\n── Note: post-action snapshot failed; page state unavailable for the next step: {} ──",
                    result, e
```

</details>

#### 缺口

- 无统一批准/派发协议或业务后置对照，没测真实用户错误率/维护意愿。
  **影响**：不能把当前工具层正确分层推成安全自主Agent，或提前给未来协议计贡献/节省。
  **进一步探讨**：先无害固定样本盲核重复/误报与恢复成本，验证跨工具状态映射和批准不可重用，再谈真实业务采用。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
