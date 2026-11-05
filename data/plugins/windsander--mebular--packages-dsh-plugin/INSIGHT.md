# Mebular DSH Plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[898050e](https://github.com/Windsander/Mebular/tree/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 108](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=108&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Windsander/Mebular) [![npm 30d 1,921](https://img.shields.io/static/v1?label=npm+30d&message=1%2C921&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mebular/dsh-plugin) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mebular/dsh-plugin)
<!-- END META -->

> **功能**：把 Mebular daemon 的 MCP 与 Console 接入 DSH，并管理连接和受管进程状态。

> **亮点**：[Q01](#research-q01) 将两种入口和 daemon 发现接到宿主。

> **主要限制**：[Q02](#research-q02) 区分共享数据、显式端点和子进程所有权。

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
  - [Q01 · 子包怎样把记忆图接入 DSH？](#detail-section-11)
  - [Q02 · 守护进程和记忆数据的控制边界在哪里？](#detail-section-12)
  - [Q03 · 何时适合采用？](#detail-section-13)
  - [Q04 · 如何降低重连到非预期 daemon 的风险？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Mebular 节点并希望在 DSH 使用同一记忆库的用户。

手动连接 MCP 和打开独立 Console。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP | 访问共享记忆与任务 | 需要实际 daemon |
| 生命周期 | 发现和连接 | 按模式与所有权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client | 必需 | 挂载 daemon | 使用原 Console |
| 独立 daemon | 必需 | 提供记忆与任务 | 保持断开 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离节点与 profile | 确定地址 |
| 验证 | 查询、断连、恢复 | 核对挂载 |
| 退出 | 停用并查进程 | 区分复用与拥有 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时资源未知 | 准备节点 | 未测 |
| 持续 | 同步开销未知 | 维护节点 | 按配置 |
| 退出 | 恢复成本未知 | 清理测试节点 | 读回状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一入口 | 有 MCP 与 Console 接线 | 真实可用性 |
| 释放 | 源码区分所有权 | 并发退出 |

> **思考**：[Q02](#research-q02) 区分共享数据、显式端点和子进程所有权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将两种入口和 daemon 发现接到宿主。

[Q02](#research-q02) 校验目标身份及进程所有权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 区分共享数据、显式端点和子进程所有权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先测试节点只读。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包静态证据，未执行。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin/README.md、packages/dsh-plugin/index.js 及固定范围 inventory；组件：packages/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 packages/dsh-plugin，代表性入口与生命周期。
- 下一步：验证挂载、地址、断连和卸载。

**分析版本**

- **仓库**：[Windsander/Mebular](https://github.com/Windsander/Mebular)
- **版本号**：0.3.0（[固定提交 898050e](https://github.com/Windsander/Mebular/tree/898050e5774462a41789ece6c14eae3b6a4db3af)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可验证身份可能减少误挂载。

验证挂载、地址、断连和卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 10441 | 8735 | 1204 | — |
| .md | source | 2 | 244 | — | — | 2994 |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Windsander/Mebular/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/Windsander/Mebular/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Windsander/Mebular/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 如何接入 Mebular，生命周期和数据流边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 子包怎样把记忆图接入 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有 Mebular runtime 的用户可通过 DSH 访问该 daemon。子包在健康时通过宿主 MCP client 挂载 /mcp，并随健康状态更新桥接；作者还描述侧栏 Console。相较于分别配置 MCP 与 Console，子包统一发现、状态和连接。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:4935-4955](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L4935-L4955)

加载宿主 MCP 并组装 URL

<details>
<summary>查看原文（21行）</summary>

```text
      ? await opts.importModule(MCP_CLIENT_PACKAGE)
      : await import('@deepseek-ai/dsh-mcp-client');
  } catch (error) {
    // Outside a DSH host the peer is absent (ERR_MODULE_NOT_FOUND). Keep the
    // return code stable and never echo the resolver message (it contains
    // absolute paths).
    const code = error?.code === 'ERR_MODULE_NOT_FOUND' || error?.code === 'MODULE_NOT_FOUND'
      ? 'peer_missing'
      : 'peer_import_failed';
    log('warn', `mcp client mount failed (${code})`);
    return { ok: false, code };
  }

  let fiber;
  try {
    fiber = ctx.plugin(module, {
      serverName: 'mebular',
      transport: 'streamable-http',
      url: joinUrl(daemonUrl, '/mcp'),
      failOnStartupError: true,
    });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:5597-5619](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L5597-L5619)

健康状态与 MCP 生命周期

<details>
<summary>查看原文（23行）</summary>

```text
  // Keep the bridge aligned with the lifecycle: mount only after a health probe
  // says `up`, dispose the fiber as soon as the daemon leaves `up`, and retry
  // after recovery. Failure notices are deduplicated inside the supervisor.
  const bridge = createMcpBridgeSupervisor({
    lifecycle,
    daemonUrl: resolved.daemonUrl,
    intervalMs: opts.bridgeIntervalMs,
    setIntervalFn: opts.setIntervalFn,
    clearIntervalFn: opts.clearIntervalFn,
    log: (level, message) => log(level, message),
    onSnapshot: (snapshot) => {
      agentStatus.update(snapshot);
      memoryRuntime.updateSnapshot(snapshot);
    },
    mount: (daemonUrl) => mountMcp(ctx, daemonUrl, {
      // Success is logged once by mountMcp; failures are logged by the
      // supervisor only when the stable code changes.
      log: (level, message) => {
        if (level === 'info') log(level, message);
      },
      ...(typeof opts.importModule === 'function' ? { importModule: opts.importModule } : {}),
    }),
  });
```

</details>

**依据 3 · 作者声明**：[packages/dsh-plugin/README.md:48-70](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/README.md#L48-L70)

作者说明 Console 与模式

<details>
<summary>查看原文（23行）</summary>

```text
## DSH 接入

<div align="center">

![一张记忆图：两台机器，每台一个 Mebular 节点；机器 A 连接 DSH、Hermes、Codex，机器 B 连接 Pi、OpenCode、Cursor；两个节点直接同步同一张图。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-memory-mesh-cn.svg)

![DSH 里得到什么：侧边栏共享 Console、官方 MCP 工具、状态点、attach / managed / auto 生命周期与按需安装更新；panel: false 只保留 MCP。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-capabilities-cn.svg)

</div>

## 使用说明

<div align="center">

![三步接入：安装插件、重启 DSH；已有 App/CLI 自动连接，没有 runtime 时面板显式安装共享 runtime。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-quickstart-cn.svg)

![DSH 接入：DSH Web 通过 iframe 加载 /console/?embed=dsh，官方 MCP client 连接同一个 daemon 的 /mcp；通过共享 runtime resolve 解析 App/CLI/shared provider 与动态 URL。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-connection-cn.svg)

![状态点：绿色已连接，琥珀色启动/安装/更新中，红色未运行，灰色等待首次检查。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-status-cn.svg)

</div>

已有 Mebular App 或 CLI 时，插件会自动连接；没有 runtime 时，打开 Mebular 面板按提示安装共享 runtime。只有 CLI 方式需要手动 `mebular serve`。
```

</details>

#### 缺口

- 未运行宿主或 daemon
  **影响**：状态与工具挂载是否同步未知
  **进一步探讨**：用本地模拟健康端点切换故障与恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 守护进程和记忆数据的控制边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

复用的 daemon 不由插件停止，已有 supervise handle 也先检查所有权；卸载路径会等待在途启动并再次尝试停止。配置接受显式无 URL 内嵌凭据的 HTTP(S) 地址，MCP 接线本身因此不能保证本地通信。作者列出的同步、删除和派发能力由 daemon 承担，固定 DSH 子包证据不证明服务端身份、权限或远端删除。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:496-517](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L496-L517)

显式 daemon 地址与回环默认

<details>
<summary>查看原文（22行）</summary>

```text
  let explicitDaemonUrl = null;
  if (config.daemonUrl !== undefined) {
    const href = httpUrl(config.daemonUrl);
    if (href === null) {
      notify('invalid daemonUrl; using the loopback default');
    } else {
      const parsed = new URL(href);
      if (parsed.username !== '' || parsed.password !== '') {
        notify('credentials in daemonUrl are not allowed; using the loopback default');
      } else {
        explicitDaemonUrl = normalizeDaemonUrl(config.daemonUrl, `http://127.0.0.1:${DEFAULT_PORT}`);
      }
    }
  }

  let daemonUrl;
  if (explicitDaemonUrl !== null) {
    daemonUrl = explicitDaemonUrl;
  } else {
    const port = envPort(env);
    if (port !== null) {
      daemonUrl = `http://127.0.0.1:${port}`;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:4287-4307](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L4287-L4307)

按所有权停止

<details>
<summary>查看原文（21行）</summary>

```text
  async function stopSupervise() {
    const handle = superviseHandle;
    if (handle === null) return { stopped: true, reason: 'not_running' };
    superviseHandle = null;
    const owned = superviseOwned;
    superviseOwned = false;
    managed = false;
    if (!owned) return { stopped: true, reason: 'not_owned' };
    return stopHandle(handle);
  }

  /**
   * Stop only the supervise process this plugin owns, and only when it owns a
   * child daemon. A reused/service daemon is external and is never signalled by
   * the plugin; the shared `runtime upgrade` path updates/restarts its service.
   */
  async function stopOwnedChild() {
    if (!superviseOwned || superviseHandle === null || runtimeMode !== 'child') {
      return { stopped: true, stoppedOwned: false, runtimeMode };
    }
    const result = await stopSupervise();
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/index.js:4645-4665](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L4645-L4665)

启动并发与释放

<details>
<summary>查看原文（21行）</summary>

```text
  function dispose() {
    if (disposal !== null) return disposal;
    disposed = true;
    managed = false;
    phase = 'down';
    disposal = (async () => {
      // Signal an already-assigned supervise immediately; waiting for the
      // start promise first could delay cleanup by the full start timeout.
      const immediateStop = stopSupervise();
      // Wait for an in-flight start so a supervise spawned during disposal is
      // still observed and stopped.
      if (startPromise !== null) {
        try {
          await startPromise;
        } catch {
          // A failed start has no owned supervise left; stop below is a no-op.
        }
      }
      await immediateStop;
      await stopSupervise();
    })();
```

</details>

**依据 4 · 作者声明**：[packages/dsh-plugin/README.md:86-97](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/README.md#L86-L97)

作者列出记忆与任务能力

<details>
<summary>查看原文（12行）</summary>

```text
## MCP 工具

DSH 通过官方 MCP client 连接同一个 daemon 的 `/mcp`；工具在 DSH 里显示为 `mcp__mebular__*`。

| 能力 | 工具 | MCP 说明 |
| --- | --- | --- |
| 记忆写入 | `memory_write` `memory_write_batch` | 写入单条/批量事实、偏好、情节与技能；写入即签名并参与同步 |
| 记忆召回 | `memory_query` `memory_search` `memory_graph` | 语义/关键词召回、图遍历；可按时间与关系过滤 |
| 画像与历史 | `memory_profile` `memory_skills` `memory_history` | 读取用户偏好、技能清单与会话情节 |
| 记忆维护 | `memory_import` `memory_status` `memory_sync` `memory_delete` `memory_archive` | 导入、状态、同步、墓碑删除、归档/解除归档 |
| 任务派发 | `task_submit` `task_submit_batch` `task_cancel` `task_retry` `task_status` `task_list` `task_history` `task_children` `task_summarize` | 派发、取消、重试与查询任务 DAG |
| 协作协商 | `task_subscribe` `task_negotiate` `chatter_send` `chatter_inbox` `task_quota` `task_targets` `board_create` | 变更订阅、协商、配额闲聊、目标与任务板 |
```

</details>

#### 缺口

- 未核对真实 daemon 权限或停机竞态
  **影响**：不能确认数据隔离和进程已停止
  **进一步探讨**：模拟复用、启动中卸载及错误目标

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时适合采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有兼容 DSH Web、MCP client 和独立 Mebular runtime 时，先用测试节点做一次无敏感数据的查询。没有 runtime 的分支提示 download_required；安装和同步成本取决于选择。退出时停用子包并按所有权检查进程及测试节点的数据。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin/README.md:58-88](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/README.md#L58-L88)

已有运行时、显式安装及卸载

<details>
<summary>查看原文（31行）</summary>

````text
## 使用说明

<div align="center">

![三步接入：安装插件、重启 DSH；已有 App/CLI 自动连接，没有 runtime 时面板显式安装共享 runtime。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-quickstart-cn.svg)

![DSH 接入：DSH Web 通过 iframe 加载 /console/?embed=dsh，官方 MCP client 连接同一个 daemon 的 /mcp；通过共享 runtime resolve 解析 App/CLI/shared provider 与动态 URL。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-connection-cn.svg)

![状态点：绿色已连接，琥珀色启动/安装/更新中，红色未运行，灰色等待首次检查。](https://raw.githubusercontent.com/Windsander/Mebular/HEAD/assets/dsh-status-cn.svg)

</div>

已有 Mebular App 或 CLI 时，插件会自动连接；没有 runtime 时，打开 Mebular 面板按提示安装共享 runtime。只有 CLI 方式需要手动 `mebular serve`。

### 命令行

```bash
# 安装插件（不会静默启动或下载 Mebular）
dsh plugin --profile web add @mebular/dsh-plugin@0.3.0

# 开发安装
dsh plugin --profile web add ./packages/dsh-plugin

# 验证：在 DSH 中调用任意 mcp__mebular__* 工具
# 卸载
dsh plugin --profile web remove @mebular/dsh-plugin
```

## MCP 工具

DSH 通过官方 MCP client 连接同一个 daemon 的 `/mcp`；工具在 DSH 里显示为 `mcp__mebular__*`。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:4144-4164](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L4144-L4164)

缺失运行时分支

<details>
<summary>查看原文（21行）</summary>

```text
  function applyFailure(data) {
    if (!isObject(data)) {
      phase = 'down';
      state = 'down';
      reason = 'runtime_error';
      sticky = { state, reason };
      return;
    }
    applyResolve(data);
    const next = failureState(data);
    if (next.download === true) {
      markDownloadRequired();
      log('warn', 'no Mebular runtime provider; download_required (no download, no spawn)');
      return;
    }
    downloadRequired = false;
    phase = 'down';
    state = next.state;
    reason = next.reason;
    sticky = { state, reason };
    log('warn', `shared runtime unavailable (${reason ?? 'unknown'})`);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/index.js:4935-4955](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L4935-L4955)

MCP peer

<details>
<summary>查看原文（21行）</summary>

```text
      ? await opts.importModule(MCP_CLIENT_PACKAGE)
      : await import('@deepseek-ai/dsh-mcp-client');
  } catch (error) {
    // Outside a DSH host the peer is absent (ERR_MODULE_NOT_FOUND). Keep the
    // return code stable and never echo the resolver message (it contains
    // absolute paths).
    const code = error?.code === 'ERR_MODULE_NOT_FOUND' || error?.code === 'MODULE_NOT_FOUND'
      ? 'peer_missing'
      : 'peer_import_failed';
    log('warn', `mcp client mount failed (${code})`);
    return { ok: false, code };
  }

  let fiber;
  try {
    fiber = ctx.plugin(module, {
      serverName: 'mebular',
      transport: 'streamable-http',
      url: joinUrl(daemonUrl, '/mcp'),
      failOnStartupError: true,
    });
```

</details>

#### 缺口

- 未运行安装、同步和停用
  **影响**：实际资源及残留未知
  **进一步探讨**：先用未连接真实网络的测试节点

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何降低重连到非预期 daemon 的风险？

**研究主题**：新假设与验证

#### 完整回答

对照仅观察地址与健康的接线，试验把挂载约束到用户选定的服务身份。让测试端点在相同端口替换或恢复原实例，比较误挂载及恢复时长。若可信恢复受阻且无误连改善则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:496-517](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L496-L517)

显式端点配置

<details>
<summary>查看原文（22行）</summary>

```text
  let explicitDaemonUrl = null;
  if (config.daemonUrl !== undefined) {
    const href = httpUrl(config.daemonUrl);
    if (href === null) {
      notify('invalid daemonUrl; using the loopback default');
    } else {
      const parsed = new URL(href);
      if (parsed.username !== '' || parsed.password !== '') {
        notify('credentials in daemonUrl are not allowed; using the loopback default');
      } else {
        explicitDaemonUrl = normalizeDaemonUrl(config.daemonUrl, `http://127.0.0.1:${DEFAULT_PORT}`);
      }
    }
  }

  let daemonUrl;
  if (explicitDaemonUrl !== null) {
    daemonUrl = explicitDaemonUrl;
  } else {
    const port = envPort(env);
    if (port !== null) {
      daemonUrl = `http://127.0.0.1:${port}`;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:5597-5619](https://github.com/Windsander/Mebular/blob/898050e5774462a41789ece6c14eae3b6a4db3af/packages/dsh-plugin/index.js#L5597-L5619)

当前健康驱动接线

<details>
<summary>查看原文（23行）</summary>

```text
  // Keep the bridge aligned with the lifecycle: mount only after a health probe
  // says `up`, dispose the fiber as soon as the daemon leaves `up`, and retry
  // after recovery. Failure notices are deduplicated inside the supervisor.
  const bridge = createMcpBridgeSupervisor({
    lifecycle,
    daemonUrl: resolved.daemonUrl,
    intervalMs: opts.bridgeIntervalMs,
    setIntervalFn: opts.setIntervalFn,
    clearIntervalFn: opts.clearIntervalFn,
    log: (level, message) => log(level, message),
    onSnapshot: (snapshot) => {
      agentStatus.update(snapshot);
      memoryRuntime.updateSnapshot(snapshot);
    },
    mount: (daemonUrl) => mountMcp(ctx, daemonUrl, {
      // Success is logged once by mountMcp; failures are logged by the
      // supervisor only when the stable code changes.
      log: (level, message) => {
        if (level === 'info') log(level, message);
      },
      ...(typeof opts.importModule === 'function' ? { importModule: opts.importModule } : {}),
    }),
  });
```

</details>

#### 缺口

- daemon 是否暴露可验证身份待核
  **影响**：可能需要上游协议支持
  **进一步探讨**：先查身份契约再做假端点替换

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
