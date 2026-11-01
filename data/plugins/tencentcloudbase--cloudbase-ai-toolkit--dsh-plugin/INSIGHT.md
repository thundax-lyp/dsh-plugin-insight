# CloudBase DSH Plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c195450](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 1,153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin)
<!-- END META -->

> **功能**：将 CloudBase MCP 工具与结果面板接入 DSH。

> **亮点**：把云工具及可视结果接入会话，而非实现云基础服务。[Q01](#research-q01)

> **主要限制**：超时不证明云侧无副作用，目标环境与宿主审批须实际验证。[Q03](#research-q03)

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
  - [Q01 · 谁使用这个插件，相比手动云控制台多什么？](#detail-section-11)
  - [Q02 · MCP 如何启动与处理失败？](#detail-section-12)
  - [Q03 · 环境绑定和 UI 提示能保证正确执行吗？](#detail-section-13)
  - [Q04 · 登录、运行版本和云费用如何控制？](#detail-section-14)
  - [Q05 · 如何减少超时后重复云写入？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 管理 CloudBase 数据和部署的开发者；基线是聊天与云控制台切换。[Q01](#research-q01)

使用 DSH 聊天并在云控制台手动查询或部署。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 桥 | 云工具接入 | MCP 版本可能漂移 |
| 环境 | 绑定目标与广播 | 不保证云端写入结果 |
| 面板 | 展示数据与预览 | 宿主和网络依赖 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与 CloudBase MCP | 必需 | 工具桥接 | 使用控制台 |
| 云账号、环境及权限 | 必需 | 查询或部署 | 不执行 |
| 网络及预算 | 云操作需要 | API 与资源 | 停止并核对 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 选择账号、隔离环境和预算 | 核对身份 |
| 试用 | 执行只读查询 | 确认目标 |
| 写入 | 核对审批和结果 | 超时先查询云端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 拉包和网络 | 登录与权限配置 | 缓存版本可变 |
| 持续 | 云资源费用未知 | 审批及核对结果 | 无账单对照 |
| 恢复 | 可能已发生写入或计费 | 对账与回滚 | 不保证幂等 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话集成 | stdio 接线与环境广播 | 云服务完成情况 |
| 故障 | 进程退出和超时反馈 | 云侧是否写入 |

> **思考**：超时不证明云侧无副作用，目标环境与宿主审批须实际验证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把云工具及可视结果接入会话，而非实现云基础服务。[Q01](#research-q01)

MCP 可由缓存或 latest 启动；请求超时与进程退出清理 pending。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

超时不证明云侧无副作用，目标环境与宿主审批须实际验证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离环境先只读，写操作核对环境与审批；超时查云端再决定。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定适配器源码支持启动、环境同步与超时处理；未运行 MCP 或云服务。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/README.md、dsh-plugin/src/server/mcp-bridge.ts、dsh-plugin/scripts/mcp-launch.mjs、dsh-plugin/src/server/mcp-client.ts 及固定范围 inventory；组件：dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 97 文件、2 排除、零解析错误；仅引用子组件文件，未执行目标及云服务。
- 下一步：固定 MCP 与宿主版本，在隔离账号验证登录、权限、目标环境和超时后的云状态。

**分析版本**

- **仓库**：[TencentCloudBase/CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)
- **版本号**：0.2.3（[固定提交 c195450](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/c195450084358a555c3feef0db866dabb3a48383)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：目标环境、幂等键与超时后状态查询可减少重复写入；须对照现有超时与审批。[Q05](#research-q05)

固定 MCP 与宿主版本，在隔离账号验证登录、权限、目标环境和超时后的云状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 268 | — | — | 2536 |
| .mjs | source | 5 | 447 | 373 | 36 | — |
| .cjs | source | 1 | 93 | 84 | 2 | — |
| .tsx | source | 37 | 3123 | 2835 | 110 | — |
| .ts | source | 30 | 6869 | 6034 | 326 | — |
| .ts | example | 1 | 166 | 155 | 12 | — |
| .ts | test | 19 | 2060 | 1875 | 48 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH CloudBase 适配怎样连接 MCP 和云环境，在哪些情况下不可推断写入成功？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用这个插件，相比手动云控制台多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 中管理 CloudBase 数据、存储与部署的开发者可通过 MCP 工具和面板组织操作。作者描述数据库结果表格、部署预览与工具入口；相比聊天与云控制台来回切换，它把结果带入会话，但服务功能实际由独立 MCP 和云服务提供，不能归因于适配器；单次简单查询可直接用控制台。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/README.md:52-62](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/README.md#L52-L62)

作者声明桥接能力与写操作路径。

<details>
<summary>查看原文（11行）</summary>

```text
## 功能

| 能力 | 说明 |
|---|---|
| MCP 桥 | 注册 `mcp__cloudbase__*`（与 `@cloudbase/cloudbase-mcp` 工具集一致，当前 38 个） |
| DataTableCard | `queryPgDatabase` / `queryMysqlDatabase` / `readNoSqlDatabaseContent` 结果表格：分页、排序、复制 JSON、导出 CSV |
| DeployPreviewCard | `manageHosting` upload 后 iframe 预览真实域名 + 打开按钮 |
| 交付物行 | 会话尾部展示产物路径 + 域名 |
| Sites skill | downloadTemplate(react) → Vite → 建表 → manageHosting → 域名 |

写操作（SQL / 上传 / 删行）一律注入会话，由模型按 DSH approval 执行，插件 UI 不绕过权限模型。
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/server/mcp-bridge.ts:110-119](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-bridge.ts#L110-L119)

提供 stdio MCP 配置。

<details>
<summary>查看原文（10行）</summary>

```text
export function buildMcpClientConfig(
  _env: NodeJS.ProcessEnv = process.env,
): McpClientPatchConfig {
  return {
    serverName: "cloudbase",
    transport: "stdio",
    command: "node",
    args: [mcpLaunchScriptPath()],
    env: {},
  };
```

</details>

#### 缺口

- 未运行 DSH、MCP、云账号或写操作
  **影响**：无法确认权限、隔离、线上操作和真实成本
  **进一步探讨**：固定 MCP 与宿主版本，在隔离云环境验证授权、目标环境和失败恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 如何启动与处理失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

适配器配置 node 启动包装脚本，脚本优先显式命令、再选最新缓存、最后 npx latest；清除 API key 和代理后启动子进程。另一桥接客户端处理初始化、请求及响应；调用超时设 90 秒，进程异常退出会拒绝 pending，dispose 终止子进程。固定本插件源码不固定缓存或 latest MCP 版本，连接或超时不能说明云侧操作未发生。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/server/mcp-bridge.ts:106-119](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-bridge.ts#L106-L119)

stdio 启动配置。

<details>
<summary>查看原文（14行）</summary>

```text
export function mcpLaunchScriptPath(): string {
  return join(PACKAGE_ROOT, "scripts", "mcp-launch.mjs");
}

export function buildMcpClientConfig(
  _env: NodeJS.ProcessEnv = process.env,
): McpClientPatchConfig {
  return {
    serverName: "cloudbase",
    transport: "stdio",
    command: "node",
    args: [mcpLaunchScriptPath()],
    env: {},
  };
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/scripts/mcp-launch.mjs:13-13](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/scripts/mcp-launch.mjs#L13-L13)

默认 latest。

```text
const MCP_PACKAGE = "@cloudbase/cloudbase-mcp@latest";
```

**依据 3 · 源码核查**：[dsh-plugin/scripts/mcp-launch.mjs:44-73](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/scripts/mcp-launch.mjs#L44-L73)

命令、缓存、npx 与环境清理。

<details>
<summary>查看原文（30行）</summary>

```text
function resolveLaunch() {
  if (process.env.CLOUDBASE_MCP_COMMAND) {
    return {
      command: process.env.CLOUDBASE_MCP_COMMAND,
      args: process.env.CLOUDBASE_MCP_ARGS
        ? process.env.CLOUDBASE_MCP_ARGS.split(",").map((part) => part.trim()).filter(Boolean)
        : ["-y", MCP_PACKAGE],
      shell: false,
    };
  }
  const cached = findCachedBin();
  if (cached) {
    const entry = findCachedEntry(cached);
    if (entry) return { command: process.execPath, args: [entry], shell: false };
    if (process.platform !== "win32") return { command: cached, args: [], shell: false };
  }
  return { command: "npx", args: ["-y", MCP_PACKAGE], shell: process.platform === "win32" };
}

function childEnv() {
  const env = { ...process.env, CLOUDBASE_MCP_DISABLE_LOG_FILE: "true" };
  delete env.CLOUDBASE_API_KEY;
  for (const key of Object.keys(env)) {
    if (/^https?_proxy$/i.test(key) || key.toLowerCase() === "all_proxy") delete env[key];
  }
  return env;
}

const { command, args, shell } = resolveLaunch();
const child = spawn(command, args, { env: childEnv(), stdio: "inherit", shell });
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:201-209](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L201-L209)

释放 pending 与进程。

```text
  dispose(): void {
    for (const item of this.pending.values()) {
      item.reject(new Error("MCP bridge disposed"));
    }
    this.pending.clear();
    this.child?.kill();
    this.child = null;
    this.ready = null;
  }
```

**依据 5 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:255-278](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L255-L278)

子进程失败与初始化。

<details>
<summary>查看原文（24行）</summary>

```text
    });
    child.on("error", (err) => {
      this.child = null;
      this.ready = null;
      for (const item of this.pending.values()) {
        item.reject(err);
      }
      this.pending.clear();
    });
    child.on("exit", () => {
      this.child = null;
      this.ready = null;
      for (const item of this.pending.values()) {
        item.reject(new Error("MCP server exited"));
      }
      this.pending.clear();
    });

    await this.request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "@cloudbase/dsh-plugin", version: "0.1.0" },
    });
    this.notify("notifications/initialized", {});
```

</details>

**依据 6 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:303-311](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L303-L311)

90 秒超时清理 pending。

```text
  private request(method: string, params: Record<string, unknown>): Promise<JsonRpcResponse> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`${method} timed out`));
        }
      }, MCP_REQUEST_TIMEOUT_MS);
```

#### 缺口

- 未运行 DSH、MCP、云账号或写操作
  **影响**：无法确认权限、隔离、线上操作和真实成本
  **进一步探讨**：固定 MCP 与宿主版本，在隔离云环境验证授权、目标环境和失败恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 环境绑定和 UI 提示能保证正确执行吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。桥接客户端 set_env 仅成功后更新缓存与广播，后续调用可先按会话尝试重新绑定；写操作权限由宿主和服务端共同决定。作者称 UI 写操作注入会话交宿主审批，这是声明而非本轮端到端验证。发生超时应先在目标云环境查询实际结果，不能盲目重试写入。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:185-198](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L185-L198)

成功后同步环境、执行前重绑。

<details>
<summary>查看原文（14行）</summary>

```text
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.ensureReady();
    if (name === "auth" && args.action === "set_env" && typeof args.envId === "string") {
      const response = await this.request("tools/call", { name, arguments: args });
      const payload = this.unwrapResponse(response, name);
      // 成功后才记录注入态并广播：失败时保留旧绑定，避免观察者误同步
      this.lastInjectedEnvId = args.envId;
      this.notifyEnvChanged(args.envId);
      return payload;
    }
    const rebound = await this.ensureSessionEnv(name, args);
    if (rebound) this.notifyEnvChanged(rebound);
    const response = await this.request("tools/call", { name, arguments: args });
    return this.unwrapResponse(response, name);
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:303-311](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L303-L311)

调用超时。

```text
  private request(method: string, params: Record<string, unknown>): Promise<JsonRpcResponse> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`${method} timed out`));
        }
      }, MCP_REQUEST_TIMEOUT_MS);
```

**依据 3 · 作者声明**：[dsh-plugin/README.md:54-62](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/README.md#L54-L62)

作者声明写操作经宿主审批。

```text
| 能力 | 说明 |
|---|---|
| MCP 桥 | 注册 `mcp__cloudbase__*`（与 `@cloudbase/cloudbase-mcp` 工具集一致，当前 38 个） |
| DataTableCard | `queryPgDatabase` / `queryMysqlDatabase` / `readNoSqlDatabaseContent` 结果表格：分页、排序、复制 JSON、导出 CSV |
| DeployPreviewCard | `manageHosting` upload 后 iframe 预览真实域名 + 打开按钮 |
| 交付物行 | 会话尾部展示产物路径 + 域名 |
| Sites skill | downloadTemplate(react) → Vite → 建表 → manageHosting → 域名 |

写操作（SQL / 上传 / 删行）一律注入会话，由模型按 DSH approval 执行，插件 UI 不绕过权限模型。
```

#### 缺口

- 未运行 DSH、MCP、云账号或写操作
  **影响**：无法确认权限、隔离、线上操作和真实成本
  **进一步探讨**：固定 MCP 与宿主版本，在隔离云环境验证授权、目标环境和失败恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 登录、运行版本和云费用如何控制？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 DSH、CloudBase MCP、账号/环境以及云网络；作者描述 device-code 登录和选环境。启动器可读取本机缓存或拉 latest，版本漂移与首次拉包耗时会影响可复现，云数据库、存储和部署可能计费。先在隔离环境确认身份、目标环境、权限与预算，先只读再审批写入；错误或目标不明即停止并核对云端。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/README.md:44-50](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/README.md#L44-L50)

作者说明设备码和环境选择。

```text
## 登录（device-code，无需 API Key）

插件不传任何 CloudBase env、不传 API Key，登录走 cloudbase-mcp 自身的 device-code 流程（本机已有 `tcb login` 登录态时直接复用）。无登录态时，对模型说：

> 调用 `mcp__cloudbase__auth`，`action=start_auth`，`authMode=device`，把 verification URL 给我。

浏览器授权一次后登录态持久化。再用 `mcp__cloudbase__auth`（`action=set_env`）选择环境，后续工具自动使用该环境。
```

**依据 2 · 源码核查**：[dsh-plugin/scripts/mcp-launch.mjs:44-60](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/scripts/mcp-launch.mjs#L44-L60)

显式命令、缓存或 npx latest。

<details>
<summary>查看原文（17行）</summary>

```text
function resolveLaunch() {
  if (process.env.CLOUDBASE_MCP_COMMAND) {
    return {
      command: process.env.CLOUDBASE_MCP_COMMAND,
      args: process.env.CLOUDBASE_MCP_ARGS
        ? process.env.CLOUDBASE_MCP_ARGS.split(",").map((part) => part.trim()).filter(Boolean)
        : ["-y", MCP_PACKAGE],
      shell: false,
    };
  }
  const cached = findCachedBin();
  if (cached) {
    const entry = findCachedEntry(cached);
    if (entry) return { command: process.execPath, args: [entry], shell: false };
    if (process.platform !== "win32") return { command: cached, args: [], shell: false };
  }
  return { command: "npx", args: ["-y", MCP_PACKAGE], shell: process.platform === "win32" };
```

</details>

**依据 3 · 作者声明**：[dsh-plugin/README.md:64-70](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/README.md#L64-L70)

作者说明首次拉包及环境选择。

```text
## 注意事项

1. **pnpm v9+ 默认禁止依赖 install 脚本**：必须 `enable-scripts=true` 后再 `pnpm install`（一键脚本已包含此步）。
2. **Web UI 插件要重建 DSH web 前端**：装完看不到卡片时，从 DSH 安装目录执行 `pnpm run build:web` 再重启；Headless 不需要。
3. **首次 npx 拉包可能 10–90s**：headless 首轮工具列表可能为空，重试即可。
4. **不要给插件配置 `CLOUDBASE_API_KEY`**：无效 Key 会挡住 device-code 登录。登录与环境选择全部走 `mcp__cloudbase__auth`。
5. **技能由插件注册，不拷进 `~/.dsh/skills`**。环境用 `auth` 的 `set_env` 绑定，用 `action=status` 查看。插件不会按会话自动改环境。
```

#### 缺口

- 未运行 DSH、MCP、云账号或写操作
  **影响**：无法确认权限、隔离、线上操作和真实成本
  **进一步探讨**：固定 MCP 与宿主版本，在隔离云环境验证授权、目标环境和失败恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少超时后重复云写入？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在调用前为支持的写操作显示目标环境和幂等键，并在超时后提供云侧状态查询，可能减少错误重试。反证是已有每次调用超时处理、环境变更广播和作者声明的审批，不应把它们当作新设计；不同云 API 未必支持幂等或查询，未穷尽已有等价实现。用隔离环境比较正常、超时已成功和失败场景，测重复写入率、误报和人工时间；无改善或误导则否定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:185-198](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L185-L198)

已有绑定与广播。

<details>
<summary>查看原文（14行）</summary>

```text
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.ensureReady();
    if (name === "auth" && args.action === "set_env" && typeof args.envId === "string") {
      const response = await this.request("tools/call", { name, arguments: args });
      const payload = this.unwrapResponse(response, name);
      // 成功后才记录注入态并广播：失败时保留旧绑定，避免观察者误同步
      this.lastInjectedEnvId = args.envId;
      this.notifyEnvChanged(args.envId);
      return payload;
    }
    const rebound = await this.ensureSessionEnv(name, args);
    if (rebound) this.notifyEnvChanged(rebound);
    const response = await this.request("tools/call", { name, arguments: args });
    return this.unwrapResponse(response, name);
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:303-311](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/src/server/mcp-client.ts#L303-L311)

已有超时。

```text
  private request(method: string, params: Record<string, unknown>): Promise<JsonRpcResponse> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`${method} timed out`));
        }
      }, MCP_REQUEST_TIMEOUT_MS);
```

**依据 3 · 作者声明**：[dsh-plugin/README.md:60-62](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c195450084358a555c3feef0db866dabb3a48383/dsh-plugin/README.md#L60-L62)

作者声明写入审批。

```text
| Sites skill | downloadTemplate(react) → Vite → 建表 → manageHosting → 域名 |

写操作（SQL / 上传 / 删行）一律注入会话，由模型按 DSH approval 执行，插件 UI 不绕过权限模型。
```

#### 缺口

- 未运行 DSH、MCP、云账号或写操作
  **影响**：无法确认权限、隔离、线上操作和真实成本
  **进一步探讨**：固定 MCP 与宿主版本，在隔离云环境验证授权、目标环境和失败恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
