# GraphFlow 的 DSH 集成

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9797cd2](https://github.com/Roarpeng/GraphFlow/tree/9797cd2105920ef6cbff0b9a7c5786c9c82da333)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Roarpeng/GraphFlow) [![npm 30d 16,663](https://img.shields.io/static/v1?label=npm+30d&message=16%2C663&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@roarpeng/graphflow) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@roarpeng/graphflow)
<!-- END META -->

> **功能**：为 DSH 装配可读符号、编辑代码、运行命令和管理宏的 MCP 服务，并在提示匹配宏时添加上下文。

> **亮点**：[Q01](#research-q01) 将源码工具与本地 DSH 适配模块一并交给安装器。[Q02](#research-q02) 可把匹配的宏提示嵌入上下文，[Q03](#research-q03) 让模型通过结构化工具调用符号读取、范围编辑与受影响测试。

> **主要限制**：[Q02](#research-q02) 的 hook 使用同步子进程，单次默认二十秒，失败还可能触发第二次启动。PATH 和未固定版本的 npx 可能接上与本次源码不同的 CLI。[Q03](#research-q03) 的默认目录和工具注解不能代替宿主审批。

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
  - [Q01 · 如何把根包装到 DSH，和单独注册 MCP 有什么差别？](#detail-section-11)
  - [Q02 · 拦截到提示后会发生什么，是否自动执行命令宏？](#detail-section-12)
  - [Q03 · MCP 端提供的能力与工作区边界如何？](#detail-section-13)
  - [Q04 · 何时值得用，如何验证它能减少相同任务成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护代码库的 DSH 开发者想按符号查找实现及调用方，并需要识别可在同一项目复用的常用操作。

以原有 DSH 搜索、读取及独立终端为对照。已有 MCP 的使用者还可以只注册 stdio 服务，省去提示时另启进程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地提示钩子 | 匹配命令宏时添加提示 | 固定匹配器只产生提示，依赖实际 CLI 版本 |
| 符号阅读 | 查找、续读与补充引用 | 输出质量需对照调用覆盖 |
| 工作区编辑 | 提交范围修改或提案 | 核对工具权限及路径 |
| 命令和宏工具 | 执行显式命令并复用任务 | 依赖宿主审批，不将钩子提示当执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ≥18、固定 GraphFlow 本地工具及 DSH home | 根安装必需 | 写入配置与准备命令 | PATH 不一致时可能尝试 npx |
| DSH 的 Cordis 与 dsh-mcp-client | MCP 必需 | 启动 stdio 工具 | 技能仍可存在，但工具不挂载 |
| agent/pre-step 宿主事件 | 提示功能必需 | 产生上下文提示 | 无拦截，工具可独立使用 |
| 工作区与宿主授权 | 文件和执行操作条件 | 决定允许的路径和命令 | 保持只读或退回原方法 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份隔离 DSH 配置并核定本地执行版本 | 目录及命令与预期一致 |
| 接入 | 在测试工作区检查根安装器的两条托管行 | 没有重复 MCP 行，权限可控 |
| 验证 | 先验证只读符号，再验证提示和等待 | 不一致时暂停增加执行类工具 |
| 退出 | 关闭提示 hook，按需移除安装 | 回读 profile，确认旧配置可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包、缓存与可能的注册表下载，金额未知 | 备份 DSH 配置并确认实际 CLI | MCP 与 hook 分开装配 |
| 持续 | 索引、退出与子进程等待开销未量化 | 看输出覆盖与工具批准回执 | 提示每次调用可能等待多个进程 |
| 恢复 | 恢复测试 profile 的成本未知 | 禁用 hook 并检查安装块与工作树 | 其他配置保留情况应回读 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 代码读取 | 可按符号查询、续读与补引用 | 相同任务的精度和节省 |
| 宏提示 | 当前固定匹配链只发文字提示 | 默认 PATH 及 npx 运行版本 |
| 执行可见性 | 显式命令入口和测试计划 | 宿主审批与真实回归质量 |

> **思考**：[Q02](#research-q02) 的 hook 使用同步子进程，单次默认二十秒，失败还可能触发第二次启动。PATH 和未固定版本的 npx 可能接上与本次源码不同的 CLI。[Q03](#research-q03) 的默认目录和工具注解不能代替宿主审批。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将源码工具与本地 DSH 适配模块一并交给安装器。[Q02](#research-q02) 可把匹配的宏提示嵌入上下文，[Q03](#research-q03) 让模型通过结构化工具调用符号读取、范围编辑与受影响测试。

[Q01](#research-q01) 将 MCP 和本地插件分别注册与卸载，便于定位部分失败。[Q02](#research-q02) 隔离宏匹配与执行是可取的分离，但同步启动和版本漂移仍需控制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的 hook 使用同步子进程，单次默认二十秒，失败还可能触发第二次启动。PATH 和未固定版本的 npx 可能接上与本次源码不同的 CLI。[Q03](#research-q03) 的默认目录和工具注解不能代替宿主审批。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先观察。用临时 DSH 目录先验证只读函数定位与调用覆盖，确认使用固定工具版本以后再比较宏提示；若访问范围或等待超出预期，恢复原搜索路径。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认安装器驱动真实 DSH 挂载，并支持宏提示与 stdio 工具。真实 DSH 兼容性、文件隔离、自动回退与单位合格任务资源未实测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/agent-installer.ts、assets/reflex/graphflow-prompt-reflex.dsh.mjs、src/cli.ts、src/host-interceptor.ts、src/mcp-server.ts、src/mcp-tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根 npm 包内的实际 DSH 专用适配和它接出的 MCP 四类工具，抽读代表性链路。未执行目标或安装、未与 DSH 真实连通，也未独立审核 graphflow-dsh 子包、其他宿主适配和完整文件访问权限。
- 下一步：按 [Q04](#research-q04) 在同仓库对照原生读取、MCP 与本地 hook 的合格任务，再验证命令缺失、超时、重复安装和卸载。

**分析版本**

- **仓库**：[Roarpeng/GraphFlow](https://github.com/Roarpeng/GraphFlow)
- **版本号**：3.9.2（[固定提交 9797cd2](https://github.com/Roarpeng/GraphFlow/tree/9797cd2105920ef6cbff0b9a7c5786c9c82da333)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出给提示匹配设置单个时间预算，超时时保留原提示。用同任务验证是否少等响应、少漏掉关键调用点，且宏提示没有明显漏报。

按 [Q04](#research-q04) 在同仓库对照原生读取、MCP 与本地 hook 的合格任务，再验证命令缺失、超时、重复安装和卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 2120 | 1663 | 330 | — |
| .ts | source | 36 | 29744 | 24273 | 3681 | — |
| .js | source | 1 | 54 | 38 | 13 | — |
| .md | source | 12 | 1022 | — | — | 16221 |
| .ts | test | 48 | 17896 | 15431 | 1187 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Roarpeng/GraphFlow/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Roarpeng/GraphFlow/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Roarpeng/GraphFlow/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定 GraphFlow 根发行怎样在 DSH 给开发者提供符号阅读和宏提示，实际安装与命令边界能否支撑安全的小范围评估？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何把根包装到 DSH，和单独注册 MCP 有什么差别？

**研究主题**：场景与需求、依赖、兼容与流程、工程质量与复用

#### 完整回答

目标是维护主要使用 DSH 的源码库、希望读取特定符号和复用常见任务的开发者。可以按已有 DSH MCP 配置手工接入通用服务，或者让 GraphFlow 安装器同时加入 MCP 行和本地提示模块。程序针对 DSH home 选择 Cordis patch 与本地 plugins 路径。MCP 行使用已有 dsh-mcp-client、stdio npx 命令和固定工作目录；根包附带的适配器复制到本地 plugins 目录，另外写入显式相对路径挂载。DSH 实际 apply 在提示前注册事件而非只声明 MCP。

已有托管块重复安装会替换，完整标记以外的段保留。安装资产与写入挂载分别报结果，某一步失败后应核查路径和最终 patch。作者提醒独立的配置子包也会注册同类 MCP 行，两路不要同时使用。卸载路径尝试移除本地资产和托管挂载。将仓库目录钉在 MCP 是解析便利，仍需验证使用的 profile 确实读取该 patch。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-59](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/README.md#L53-L59)

作者说明多宿主安装与两种 DSH 路径。

```text
`graphflow install` detects agents and registers MCP + Skill + Rules + Hooks — hook merges are idempotent and preserve user entries; `graphflow uninstall` removes only GraphFlow-owned registrations. Scope with `--agents <id1,id2>` / `--all` / `--workspace`.

Covers: Cursor, VS Code, Windsurf, Trae, Zed, Claude Code, Codex, Gemini CLI, Antigravity, Kimi Code, DeepSeek Harness, OpenCode, ZCode, Cline, Roo Code, Kilo Code, Continue, PearAI, Qoder, Claude Desktop, Amazon Q, WorkBuddy.

## DeepSeek Harness (DSH)

DSH reads Cordis patches, not `mcp.json`. `graphflow install` writes a managed block (`# GRAPHFLOW-DSH-BEGIN/END`) into `~/.dsh/cordis.patch.yml` with `cwd` pinned to your workspace — run it **from the workspace** so relative targets resolve. Alternative: the configuration-only `@roarpeng/graphflow-dsh` bundle (use one or the other; both = duplicate row).
```

**依据 2 · 源码核查**：[package.json:7-18](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/package.json#L7-L18)

根发行含资产、技能和 Node 版本声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "files": [
    "dist",
    "assets",
    "skills",
    "mcp.json",
    "README.md",
    "LICENSE",
    "README.zh.md",
    "VSIX-INSTALL.md"
  ],
  "engines": {
    "node": ">=18"
```

</details>

**依据 3 · 源码核查**：[src/agent-installer.ts:544-556](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/agent-installer.ts#L544-L556)

确定 DSH 路径和本地适配器目标。

<details>
<summary>查看原文（13行）</summary>

```text
    {
      id: "deepseek-harness",
      name: "DeepSeek Harness",
      markerPaths: [dshHome],
      mcpTargets: [{ configPath: join(dshHome, "mcp.json"), serversKey: "mcpServers" }],
      skillsDirs: [join(dshHome, "skills")],
      // DSH loads MCP servers from a Cordis patch file, not from mcp.json.
      cordisPatchPath: join(dshHome, "cordis.patch.yml"),
      // Tier-2 prompt reflex: Cordis plugin + managed patch row (the patch
      // block is written to cordisPatchPath alongside the MCP block).
      reflexAssets: [
        { type: "dsh-plugin", targetPath: join(dshHome, "plugins", "graphflow-prompt-reflex.mjs") },
      ],
```

</details>

**依据 4 · 源码核查**：[src/agent-installer.ts:1232-1249](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/agent-installer.ts#L1232-L1249)

MCP 行、stdio、工作目录和 npx 参数。

<details>
<summary>查看原文（18行）</summary>

```text
function buildDshCordisBlock(serverName: string, opts: InstallAllAgentsOptions): string {
  const workspace = normalizeCordisPath(opts.workspaceRoot ?? process.cwd());
  const args = DSH_CORDIS_LAUNCHER.args.map((arg) => yamlSingleQuoted(arg)).join(", ");
  return [
    GRAPHFLOW_DSH_BEGIN,
    "- insert:",
    `    - id: ${yamlPlainOrSingleQuoted(`mcp-${serverName}`)}`,
    "      name: '@deepseek-ai/dsh-mcp-client'",
    "      config:",
    `        serverName: ${yamlPlainOrSingleQuoted(serverName)}`,
    "        transport: stdio",
    `        command: ${yamlPlainOrSingleQuoted(DSH_CORDIS_LAUNCHER.command)}`,
    `        args: [${args}]`,
    `        cwd: ${yamlDoubleQuoted(workspace)}`,
    `        env: { GRAPHFLOW_WORKSPACE_ROOT: ${yamlDoubleQuoted(workspace)}, GRAPHFLOW_MCP_STDIO: '1', GRAPHFLOW_LOG_JSON: '1' }`,
    "        failOnStartupError: false",
    GRAPHFLOW_DSH_END,
  ].join("\n");
```

</details>

**依据 5 · 源码核查**：[src/agent-installer.ts:1415-1428](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/agent-installer.ts#L1415-L1428)

本地插件行及 CLI 接线。

<details>
<summary>查看原文（14行）</summary>

```text
function buildDshHookPatchBlock(): string {
  return [
    `${GRAPHFLOW_DSH_HOOK_BEGIN} — GraphFlow prompt reflex (Tier-2). The plugin`,
    `# file lives beside this patch: relative './' names are anchored to this`,
    `# file's directory by dsh app-boot.`,
    `- insert:`,
    `    - id: graphflow-prompt-reflex`,
    `      name: './plugins/graphflow-prompt-reflex.mjs'`,
    `      config:`,
    `        bin: graphflow`,
    `        npxArgs: ['-y', '--package=@roarpeng/graphflow', 'graphflow']`,
    `        timeoutMs: 20000`,
    `        onMacro: rewrite`,
    GRAPHFLOW_DSH_HOOK_END,
```

</details>

**依据 6 · 源码核查**：[src/agent-installer.ts:2289-2323](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/agent-installer.ts#L2289-L2323)

分别报告资产安装和 patch 写入。

<details>
<summary>查看原文（35行）</summary>

```text
    // 5. Prompt-Reflex plugin assets (Tier-2 hosts: OpenCode/Kilo/Cline/DSH).
    for (const asset of profile.reflexAssets ?? []) {
      try {
        const { status, message } = installReflexAsset(asset.type, asset.targetPath);
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: asset.targetPath,
          status,
          ...(message ? { message } : {}),
        });
      } catch (err) {
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: asset.targetPath,
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // 5b. DSH: the Cordis patch row that loads the reflex plugin.
    if (profile.cordisPatchPath && (profile.reflexAssets ?? []).some((a) => a.type === "dsh-plugin")) {
      try {
        const status = writeDshHookPatch(profile.cordisPatchPath);
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: profile.cordisPatchPath,
          status,
        });
```

</details>

**依据 7 · 源码核查**：[src/agent-installer.ts:2450-2479](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/agent-installer.ts#L2450-L2479)

卸载时清资产与 hook 行。

<details>
<summary>查看原文（30行）</summary>

```text
      try {
        if (removeReflexAsset(asset.type, asset.targetPath)) {
          results.push({
            agentId: profile.id,
            agentName: profile.name,
            category: "hook",
            targetPath: asset.targetPath,
            status: "removed",
          });
        }
      } catch (err) {
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: asset.targetPath,
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
    if (profile.cordisPatchPath && (profile.reflexAssets ?? []).some((a) => a.type === "dsh-plugin")) {
      if (removeDshHookPatch(profile.cordisPatchPath)) {
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: profile.cordisPatchPath,
          status: "removed",
        });
```

</details>

#### 缺口

- 当前 DSH profile 的实际加载和卸载未验证
  **影响**：不能确认 host 等同于根安装器检测出来的配置
  **进一步探讨**：在独立 home 对照安装、重复安装、部分失败和卸载四态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 拦截到提示后会发生什么，是否自动执行命令宏？

**研究主题**：功能与机制、缺陷与关键质疑、贡献与相对优势

#### 完整回答

本地模块先等待宿主流水线得到 enter，再取这一批人类用户消息中的文本。未启用、取消、没有用户文本时原样经过。适配器把提示、工作目录、会话标识写到 GraphFlow CLI 的标准输入。固定 CLI 调用 interceptUserPromptSubmit，它读取 command-pipeline 类型的宏、归一化提示与触发词，匹配时返回提示字符串，明确要求通过 gf_macro 的 run 显式执行。CLI 以 JSON 输出该提示，适配器把它附到 DSH 上下文。固定匹配路径没有自动运行命令和文件写宏。

适配器仍处理状态 2，可替换用户批次或拒绝，但当前匹配函数只返回 allow 或 hint。该分支在固定 CLI 路径未被触发，PATH 解析到别的 GraphFlow 或 npx 拉取未固定版本时语义可能变化。CLI 缺失或启动报错后适配器会尝试 npx，两次都使用同步 spawn，每次默认 20 秒，不能把参数描述为整个 hook 的总等待上限。环境变量可禁用此提示拦截，MCP 另有其独立安装。

#### 证据与依据

**依据 1 · 源码核查**：[assets/reflex/graphflow-prompt-reflex.dsh.mjs:23-47](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/assets/reflex/graphflow-prompt-reflex.dsh.mjs#L23-L47)

取人类提示并将上下文送入 CLI。

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx, config = {}) {
  const bin = config.bin ?? 'graphflow';
  const npxArgs = config.npxArgs ?? ['-y', '--package=@roarpeng/graphflow', 'graphflow'];
  const timeoutMs = config.timeoutMs ?? 20000;
  const onMacro = config.onMacro ?? 'rewrite';

  ctx.on('agent/pre-step', async (payload, next) => {
    // Wrap first: the downstream decision (incl. the runtime-context message the
    // fallback appends) is preserved by spreading it, per the documented contract.
    const decision = await next();
    try {
      if (process.env.GRAPHFLOW_PROMPT_REFLEX === '0') return decision;
      if (decision.kind !== 'enter' || payload.signal?.aborted) return decision;

      const userMessages = decision.messages.filter((m) => m.source?.kind === 'user');
      if (userMessages.length === 0) return decision; // empty claim / mid-turn step: accept
      const prompt = userMessages
        .flatMap((m) => m.content.filter((b) => b.type === 'text').map((b) => b.text))
        .join('\n').trim();
      if (prompt === '') return decision;

      const cwd = cwdFor(ctx, payload);
      const input = JSON.stringify({ prompt, cwd, session_id: sessionId(payload) }) + '\n';
      const result = runHook(bin, npxArgs, input, cwd, timeoutMs);
      if (result === undefined) return decision; // spawn failed twice: pass through
```

</details>

**依据 2 · 源码核查**：[assets/reflex/graphflow-prompt-reflex.dsh.mjs:50-81](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/assets/reflex/graphflow-prompt-reflex.dsh.mjs#L50-L81)

处理状态 2 和提示注入及失败放行。

<details>
<summary>查看原文（32行）</summary>

```text
      if (status === 2) {
        const summary = stderr.trim() || 'GraphFlow executed a matching macro locally.';
        if (onMacro === 'reject') {
          ctx.logger.warn(`[${SOURCE}] turn blocked: ${summary}`);
          return { kind: 'reject' };
        }
        const first = userMessages[0];
        const rewritten = Object.freeze({
          ...first,
          content: Object.freeze([Object.freeze({ type: 'text', text:
            `[GraphFlow prompt reflex] Your prompt matched a macro that already ran locally:\n\n${summary}\n\nThe command above was already executed — do not run it again. Acknowledge the result briefly.` })]),
        });
        return { ...decision, messages: [rewritten, ...decision.messages.filter((m) => m.source?.kind !== 'user')] };
      }

      if (status === 0) {
        const hint = parseHint(stdout);
        if (hint === undefined) return decision; // silent allow
        const hintMessage = Object.freeze({
          role: 'user',
          id: randomUUID(), // same scheme as dsh's createUserMessage
          content: Object.freeze([Object.freeze({ type: 'text', text: `[GraphFlow context]\n${hint}` })]),
          source: Object.freeze({ kind: SOURCE }), // unknown producer kinds are documented as tolerated
        });
        return { ...decision, messages: [...decision.messages, hintMessage] };
      }

      ctx.logger.warn(`[${SOURCE}] hook exit ${String(status)}; passing prompt through`);
      return decision;
    } catch (error) {
      ctx.logger.warn(`[${SOURCE}] unexpected failure (passing through): ${error instanceof Error ? error.message : String(error)}`);
      return decision;
```

</details>

**依据 3 · 源码核查**：[assets/reflex/graphflow-prompt-reflex.dsh.mjs:86-94](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/assets/reflex/graphflow-prompt-reflex.dsh.mjs#L86-L94)

同步进程及备用执行分支。

```text
/** First successful spawn wins: bin, then npx fallback (Windows .cmd needs a shell). */
function runHook(bin, npxArgs, input, cwd, timeoutMs) {
  const base = { input, cwd, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 1024 * 1024, env: process.env, windowsHide: true };
  const opts = { ...base, shell: process.platform === 'win32' };
  let res = spawnSync(bin, ['hook', 'user-prompt'], opts);
  if (res.error) res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', [...npxArgs, 'hook', 'user-prompt'], opts);
  if (res.error) return undefined;
  return { status: res.status, stdout: res.stdout ?? '', stderr: res.stderr ?? '' };
}
```

**依据 4 · 源码核查**：[src/cli.ts:568-599](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/cli.ts#L568-L599)

CLI 调用匹配器，保留 blocked 状态的输出分支。

<details>
<summary>查看原文（32行）</summary>

```text
    if (sub === "user-prompt" || sub === "UserPromptSubmit" || sub === "prompt" || sub === "BeforeAgent") {
      // Prompt Reflex: hosts spell the prompt field differently (prompt /
      // user_prompt / input); --protocol picks the host's stdout dialect.
      const protocolRaw = readFlag(rest, "--protocol");
      const protocol = protocolRaw === "cursor" || protocolRaw === "gemini" ? protocolRaw : "generic";
      const rawPrompt = payload.prompt ?? payload.user_prompt ?? payload.input;
      const sessionId = typeof payload.session_id === "string" ? payload.session_id : undefined;
      const res = interceptUserPromptSubmit(
        {
          hook_event_name: "UserPromptSubmit",
          ...(typeof rawPrompt === "string" ? { prompt: rawPrompt } : {}),
          ...(typeof payload.cwd === "string" ? { cwd: payload.cwd } : {}),
          ...(sessionId !== undefined ? { session_id: sessionId } : {}),
        },
        { rootDir: hookRoot, ...(sessionId !== undefined ? { sessionId } : {}) }
      );
      if (res.action === "blocked") {
        if (protocol === "cursor") {
          process.stdout.write(
            `${JSON.stringify({ continue: false, user_message: res.summary ?? "" })}\n`
          );
        } else if (protocol === "gemini") {
          process.stdout.write(
            `${JSON.stringify({ decision: "deny", reason: res.summary ?? "" })}\n`
          );
        } else {
          // Generic dialect: stderr carries the summary, stdout stays empty, and
          // a non-zero exit code tells the host the prompt was consumed.
          process.stderr.write(`${res.summary ?? ""}\n`);
          process.exitCode = 2;
        }
        return;
```

</details>

**依据 5 · 源码核查**：[src/cli.ts:601-625](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/cli.ts#L601-L625)

输出泛用协议提示。

<details>
<summary>查看原文（25行）</summary>

```text
      if (res.action === "hint") {
        if (protocol === "cursor") {
          process.stdout.write("{}\n");
        } else if (protocol === "gemini") {
          process.stdout.write(
            `${JSON.stringify({
              hookSpecificOutput: {
                hookEventName: "BeforeAgent",
                additionalContext: res.hint ?? "",
              },
            })}\n`
          );
        } else {
          process.stdout.write(
            `${JSON.stringify({
              hookSpecificOutput: {
                hookEventName: "UserPromptSubmit",
                additionalContext: res.hint ?? "",
              },
            })}\n`
          );
        }
        return;
      }
      // allow: print nothing in the generic dialect; JSON-speaking hosts get {}.
```

</details>

**依据 6 · 源码核查**：[src/host-interceptor.ts:498-540](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/host-interceptor.ts#L498-L540)

固定匹配器只生成 allow 或 hint。

<details>
<summary>查看原文（43行）</summary>

```text
export function interceptUserPromptSubmit(
  payload: HostPromptPayload,
  options: { rootDir: string; sessionId?: string }
): PromptReflexResult {
  // 1. Hard opt-out switch.
  if (process.env.GRAPHFLOW_PROMPT_REFLEX === "0") return { action: "allow" };

  // 2. Empty prompts reach the LLM untouched.
  const rawPrompt = (payload.prompt ?? "").trim();
  if (rawPrompt.length === 0) return { action: "allow" };

  // Everything below is wrapped defensively: the reflex must never break the
  // host chat flow, so any internal error fails open to a plain allow.
  try {
    // 3. Only command-pipeline triggers are suggested.
    const pipelines = loadMacroStore(options.rootDir).macros.filter(
      (m) => m.kind === "command-pipeline"
    );

    // 4. Normalize both sides: lowercase; strip trailing punctuation + whitespace
    // from the prompt ("launch!" / "启动项目。" still match).
    const normalizedPrompt = rawPrompt
      .toLowerCase()
      .replace(PROMPT_REFLEX_TRAILING_PUNCT_RE, "")
      .trim();
    const matched = pipelines.filter((m) =>
      (m.triggers ?? []).some((t) =>
        triggerMatchesPrompt(normalizedPrompt, t.trim().toLowerCase())
      )
    );

    // 5. No command-pipeline trigger matched -> nothing to reflex.
    if (matched.length === 0) return { action: "allow" };

    const best = pickMostUsedMacro(matched);
    return {
      action: "hint",
      macroId: best.id,
      hint: `[GraphFlow Prompt Reflex] Macro '${best.id}' (${best.state ?? "discovered"}) requires explicit execution via gf_macro(action="run", id="${best.id}").`,
    };
  } catch {
    return { action: "allow" };
  }
```

</details>

#### 缺口

- 真实宿主所运行 CLI 的版本和超时行为未知
  **影响**：错加载的 PATH 或 npx 发行会偏离固定源码
  **进一步探讨**：在隔离环境记录当前执行文件和版本，分别注入匹配、不匹配、命令缺失和进程超时。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · MCP 端提供的能力与工作区边界如何？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

MCP 以 stdio 启动，服务公开四个工具并按请求分派。读取路径接受符号目标和查询，可从光标续读，未指定限制或没有现有匹配证据时部分单符号请求尝试补 LSP 引用，失败保留原文本。编辑路径支持符号或行范围、可选提案、预期 SHA 与校验策略，再交给实际编辑器。执行路径一般在 run 为真时发本地命令，显式 run-affected-tests 也是执行入口；受影响测试按启发式选取，返回覆盖为未知或有目标，不能当全套回归。宏工具另有信任状态和显式运行调用。这些能力由根 MCP 服务提供，DSH 拦截组件只是接入和提示。

MCP 端根据环境和当前目录提供默认 workspace，分派再经 resolveSmartWorkspaceRoot 解释调用参数。工具元数据描述文件、进程与风险，不能把 cwd 或元数据当成系统级授权边界。开发者应固定目录和宿主工具审批，特别验证读之外的操作，不用提示宏的默认行为推断所有执行调用都无法修改配置。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp-server.ts:172-190](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-server.ts#L172-L190)

绑定默认工作区并将调用转给实现。

<details>
<summary>查看原文（19行）</summary>

```text
export async function executeToolCall(
  call: ToolCall
): Promise<ToolCallResponse & { structuredContent: Record<string, unknown> }> {
  const args = call.arguments ?? {};
  const envRoot = process.env.GRAPHFLOW_WORKSPACE_ROOT?.trim();
  const fallbackRoot = envRoot || process.cwd();

  const v3Res = await executeToolCallWithEscalation(call.name, args, fallbackRoot, {
    preferActiveLease: !envRoot,
  });
  const text = v3Res.content[0]?.text ?? "";
  const ok = !text.startsWith("ERR ") && !text.startsWith("FAIL ") && !text.startsWith("REJECTED ");
  return {
    ...v3Res,
    structuredContent: {
      tool: call.name,
      ok,
      ...(v3Res.structuredContent ?? {}),
    },
```

</details>

**依据 2 · 源码核查**：[src/mcp-server.ts:225-245](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-server.ts#L225-L245)

工具列表及调用注册。

<details>
<summary>查看原文（21行）</summary>

```text
      capabilities: {
        tools: {},
      },
    }
  );

  sdkServer.setRequestHandler(ListToolsRequestSchema, () => ({ tools }));
  sdkServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const params = (request.params ?? {}) as Record<string, unknown>;
    const name = typeof params.name === "string" ? params.name : "";
    const args =
      params.arguments && typeof params.arguments === "object"
        ? (params.arguments as Record<string, unknown>)
        : {};
    if (!name) {
      throw new McpError(ErrorCode.InvalidParams, "Missing tool name");
    }
    // Newer SDK CallToolRequest handler signatures type the result against the
    // full ServerResult union (tasks et al.); our shape satisfies the wire
    // contract, so assert through it.
    const result = await executeToolCall({ name, arguments: args });
```

</details>

**依据 3 · 源码核查**：[src/mcp-server.ts:306-309](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-server.ts#L306-L309)

启动实际 stdio 传输。

```text
async function runStdioServer(): Promise<void> {
  const { sdkServer } = createMcpServer();
  const transport = new StdioServerTransport();
  await sdkServer.connect(transport);
```

**依据 4 · 源码核查**：[src/mcp-tools.ts:180-213](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L180-L213)

工作区解析、符号读取及工具续读。

<details>
<summary>查看原文（34行）</summary>

```text
function executeV3ToolCallCore(
  name: string,
  args: Record<string, unknown> = {},
  defaultRootDir: string = process.cwd(),
  resolveOpts?: SmartWorkspaceResolveOptions
): V3ToolCallResponse {
  const resolvedRoot = resolveSmartWorkspaceRoot(args, defaultRootDir, resolveOpts);
  let rootDir = resolvedRoot.rootDir;
  const sessionId =
    typeof args.sessionId === "string" && args.sessionId.trim() ? args.sessionId.trim() : "main";

  switch (name) {
    case "gf_read": {
      const maxOutputTokens = typeof args.maxOutputTokens === "number" && Number.isFinite(args.maxOutputTokens)
        ? Math.max(0, Math.floor(args.maxOutputTokens)) : undefined;
      if (typeof args.cursor === "string") {
        const continued = continueReadReceipt(rootDir, args.cursor, maxOutputTokens);
        return { content: [{ type: "text", text: continued.text }], structuredContent: { tool: "gf_read", ok: Boolean(continued.receiptId), ...continued } };
      }
      const detail = args.detail === "locate" || args.detail === "summary" || args.detail === "code" || args.detail === "closure" ? args.detail : "closure";
      const targets = Array.isArray(args.targets)
        ? args.targets.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
        : undefined;
      const query = typeof args.q === "string" && args.q.trim() ? args.q.trim() : undefined;
      const topK =
        typeof args.topK === "number" && Number.isFinite(args.topK) && args.topK > 0
          ? Math.floor(args.topK)
          : undefined;
      const includeSkeleton = args.skeleton === true;
      const topicId =
        typeof args.topicId === "string" && args.topicId.trim()
          ? args.topicId.trim()
          : typeof args.resumeFromTurnId === "string" && args.resumeFromTurnId.trim()
            ? args.resumeFromTurnId.trim()
```

</details>

**依据 5 · 源码核查**：[src/mcp-tools.ts:324-354](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L324-L354)

编辑调用接收预期 SHA 和提案等条件。

<details>
<summary>查看原文（31行）</summary>

```text
    case "gf_edit": {
      const file = typeof args.file === "string" ? args.file.trim() : "";
      const newCode = typeof args.newCode === "string" ? args.newCode : undefined;
      const symbol = typeof args.symbol === "string" && args.symbol.trim() ? args.symbol.trim() : undefined;
      const startLine = typeof args.startLine === "number" ? args.startLine : undefined;
      const endLine = typeof args.endLine === "number" ? args.endLine : undefined;
      const oldCode = typeof args.oldCode === "string" ? args.oldCode : undefined;
      const renameTo = typeof args.renameTo === "string" && args.renameTo.trim() ? args.renameTo.trim() : undefined;
      const edits = Array.isArray(args.edits) ? (args.edits as SingleEditSpec[]) : undefined;
      const mode = args.mode === "prepare" || args.mode === "commit" ? args.mode : undefined;
      const proposalId = typeof args.proposalId === "string" ? args.proposalId : undefined;
      const expectedSha256 = typeof args.expectedSha256 === "string" || (typeof args.expectedSha256 === "object" && args.expectedSha256 !== null)
        ? args.expectedSha256 as string | Record<string, string> : undefined;
      const policy = args.policy === "warn" ? "warn" : "strict";

      const editRes = executeSurgicalEdit({
        rootDir,
        file,
        ...(symbol ? { symbol } : {}),
        ...(startLine !== undefined ? { startLine } : {}),
        ...(endLine !== undefined ? { endLine } : {}),
        ...(oldCode !== undefined ? { oldCode } : {}),
        ...(newCode !== undefined ? { newCode } : {}),
        ...(renameTo ? { renameTo } : {}),
        ...(edits ? { edits } : {}),
        ...(mode ? { mode } : {}),
        ...(proposalId ? { proposalId } : {}),
        ...(expectedSha256 ? { expectedSha256 } : {}),
        policy,
        habitHook: (touchedFiles) => evaluatePostEditHabits(rootDir, touchedFiles, true),
      });
```

</details>

**依据 6 · 源码核查**：[src/mcp-tools.ts:449-476](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L449-L476)

受影响测试覆盖提示与直接执行分支。

<details>
<summary>查看原文（28行）</summary>

```text
        const verifyLevel = args.verifyLevel === "full" || args.verifyLevel === "safe" ? args.verifyLevel : "fast";
        const packagePath = join(rootDir, "package.json");
        let hasFullSuite = false;
        try { hasFullSuite = typeof JSON.parse(readFileSync(packagePath, "utf8")).scripts?.test === "string"; } catch { /* no package script */ }
        const useFull = verifyLevel === "full" || (verifyLevel === "safe" && affectedTests.length === 0 && hasFullSuite);
        const selectedTests = useFull && hasFullSuite ? ["<npm test full suite>"] : affectedTests;
        const suggestedCmd = useFull && hasFullSuite ? "npm test" : buildAffectedTestCommand(affectedTests, rootDir);
        const coverageStatus = affectedTests.length > 0 ? "TARGETED" : "UNKNOWN";
        const plan = { selectedTests, selectionReasons: selectedTests.map((test) => `${test}: ${useFull ? "full-suite verification" : "reverse import or test-name match (up to 6 hops)"}`),
          coverageStatus, uncoveredRisk: affectedTests.length === 0 ? "No matching test files found" : "Heuristic routing may miss dynamic dependencies",
          planHash: `sha256:${contentSha256(JSON.stringify([resolvedChanges, selectedTests, suggestedCmd]))}` };
        if (args.planOnly === true) return { content: [{ type: "text", text: JSON.stringify(plan) }],
          structuredContent: { tool: "gf_exec", ok: true, status: "UNKNOWN", ...plan } };
        if (affectedTests.length === 0) {
          if (!useFull || !hasFullSuite) return { content: [{ type: "text", text:
            `NONE [affected-tests] 0 test files matched ${resolvedChanges.length} changed file(s). ` +
              `If you expected hits, check the test directory/naming convention (test/, tests/, __tests__, *.test.*, *_test.*).`
          }], structuredContent: { tool: "gf_exec", ok: false, status: "NO_TESTS", ...plan } };
        }
        if (args.run === true || cmd === "run-affected-tests") {
          const patchHash = changedContentHash(rootDir, resolvedChanges);
          if (args.overrideFailureStop === true && (typeof args.overrideReason !== "string" || !args.overrideReason.trim()))
            return plainTextResponse("REJECTED [missing-override-reason] Provide overrideReason.");
          if (args.overrideFailureStop !== true && shouldStopRepeatedFailure(rootDir, sessionId, suggestedCmd, patchHash))
            return { content: [{ type: "text", text: "REJECTED [repeated-failure] Same command, patch and failure occurred 3 times; inspect the diagnostic packet or pass overrideFailureStop with a reason." }],
              structuredContent: { tool: "gf_exec", ok: false, status: "UNKNOWN", ...plan } };
          if (args.overrideFailureStop === true) recordFailureOverride(rootDir, suggestedCmd, args.overrideReason as string);
          const runRes = execAndDehydrate({
```

</details>

**依据 7 · 源码核查**：[src/mcp-tools.ts:505-525](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L505-L525)

命令预览和 run 触发路径。

<details>
<summary>查看原文（21行）</summary>

```text
      if (args.run !== true) {
        return plainTextResponse(
          `# Preview (not executed)\nCmd: ${cmd}\nPass run: true to execute.`
        );
      }

      const currentChanges = changedFiles ?? resolveAffectedTests(rootDir).changedFiles;
      const patchHash = changedContentHash(rootDir, currentChanges);
      if (args.overrideFailureStop === true && (typeof args.overrideReason !== "string" || !args.overrideReason.trim()))
        return plainTextResponse("REJECTED [missing-override-reason] Provide overrideReason.");
      if (args.overrideFailureStop !== true && shouldStopRepeatedFailure(rootDir, sessionId, cmd, patchHash)) {
        return { content: [{ type: "text", text: "REJECTED [repeated-failure] Same command, patch and failure occurred 3 times. Review diagnostics or pass overrideFailureStop with a reason." }],
          structuredContent: { tool: "gf_exec", ok: false, status: "UNKNOWN" } };
      }
      if (args.overrideFailureStop === true) recordFailureOverride(rootDir, cmd, args.overrideReason as string);

      const execRes = execAndDehydrate({
        rootDir,
        command: cmd,
        ...(typeof args.timeoutMs === "number" ? { timeoutMs: args.timeoutMs } : {}),
      });
```

</details>

**依据 8 · 源码核查**：[src/mcp-tools.ts:765-788](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L765-L788)

宏显式执行与信任，分别交给实现。

<details>
<summary>查看原文（24行）</summary>

```text
        const templateArgs = Array.isArray(args.args)
          ? args.args.filter((a): a is string => typeof a === "string")
          : [];
        const res = executeMacro(rootDir, id, templateArgs, args.dryRun === true);
        return plainTextResponse(res.text);
      }

      if (action === "verify") {
        const id = typeof args.id === "string" ? args.id.trim() : "";
        const command = Array.isArray(args.steps) && typeof args.steps[0] === "string" ? args.steps[0] : "";
        const result = verifyMacroRecipe(rootDir, id, command);
        return plainTextResponse(result.text);
      }
      if (action === "recipe-run") {
        const id = typeof args.id === "string" ? args.id.trim() : "";
        const templateArgs = Array.isArray(args.args) ? args.args.filter((a): a is string => typeof a === "string") : [];
        return plainTextResponse(runVerifiedRecipe(rootDir, id, templateArgs).text);
      }

      if (action === "propose" || action === "approve" || action === "activate" || action === "revoke") {
        const id = typeof args.id === "string" ? args.id.trim() : "";
        const macro = id ? setMacroTrust(rootDir, id, action, args.autoRun === true) : undefined;
        return plainTextResponse(macro ? `OK [macro-${action}] id=${id} state=${macro.state} permissions=${macro.permissions?.join(",") ?? "read-only"}`
          : `REJECTED [macro-${action}] id=${id || "missing"}; check current state and workspace version.`);
```

</details>

**依据 9 · 源码核查**：[src/mcp-tools.ts:845-862](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L845-L862)

LSP 按条件增加静态引用，异常保持原返回。

<details>
<summary>查看原文（18行）</summary>

```text
export async function executeToolCallWithEscalation(
  name: string, args: Record<string, unknown> = {}, defaultRootDir: string = process.cwd(),
  resolveOpts?: SmartWorkspaceResolveOptions
): Promise<V3ToolCallResponse> {
  const result = executeV3ToolCall(name, args, defaultRootDir, resolveOpts);
  if (name !== "gf_read" || args.lsp === false || (args.detail !== undefined && args.detail !== "closure") ||
      args.maxOutputTokens !== undefined || !Array.isArray(args.targets) || args.targets.length !== 1 ||
      typeof args.targets[0] !== "string" || result.content[0]?.text.includes("[Blast Radius")) return result;
  try {
    const rootDir = resolveSmartWorkspaceRoot(args, defaultRootDir, resolveOpts).rootDir;
    const lsp = await escalateReadReferences(rootDir, args.targets[0]);
    if (!lsp) return result;
    const output = `${result.content[0]?.text ?? ""}\n${lsp.text}`;
    result.content = [{ type: "text", text: output }];
    const evidence = appendToolEvidence(rootDir, { tool: name, output, durationMs: 0 });
    result.structuredContent = { ...result.structuredContent, lspConfidence: "verified", evidenceId: evidence.artifactHash };
  } catch { /* An unavailable server must leave the fast AST result intact. */ }
  return result;
```

</details>

#### 缺口

- 实际 DSH 审批与所有 GraphFlow 文件边界未审计
  **影响**：不能把辅助工具当完整的本机沙箱
  **进一步探讨**：在无敏感文件的工作区验证只读、越界拒绝和宿主批准链路。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得用，如何验证它能减少相同任务成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

需要频繁按符号确认调用路径或定位影响范围的 DSH 开发者有明确评估任务。对照宿主常规的搜索、文件读取和测试命令，在隔离 profile 用相同提示定位一个函数和一个跨文件调用点。先验证 MCP 只读及工作区，再比较是否值得加置顶提示。用固定版本的本地执行文件，若 hook 长时间无回应、读取跑出目录或模型误授权宏执行，先从当前 profile 停掉拦截并退回原搜索。安装时涉及 profile 写入、索引及可能的公网包获取；持续运行时有 CLI 调用延迟、索引缓存与诊断核对成本。当前没有等效质量的 token 或时间实测。

待验证假设是在固定 DSH profile 把宏提示从每轮同步查找换成有严格时间预算的匹配，当慢查询时保留原提示，不走第二个拉取路径，会减少交互等待且不显著增加漏匹配。选择同一份宏库和需要同等调用覆盖的任务，对照原生搜索、仅 MCP、完整钩子，记录合格结果、误提示、首响应时间、输出长度和配置回退步骤。若索引只压缩了输出却漏掉关键调用点，或同步提示总体耗时更高，就没有采用依据。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp-tools.ts:845-862](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/mcp-tools.ts#L845-L862)

读取可以按条件多查询一次引用，用于对照响应及结果。

<details>
<summary>查看原文（18行）</summary>

```text
export async function executeToolCallWithEscalation(
  name: string, args: Record<string, unknown> = {}, defaultRootDir: string = process.cwd(),
  resolveOpts?: SmartWorkspaceResolveOptions
): Promise<V3ToolCallResponse> {
  const result = executeV3ToolCall(name, args, defaultRootDir, resolveOpts);
  if (name !== "gf_read" || args.lsp === false || (args.detail !== undefined && args.detail !== "closure") ||
      args.maxOutputTokens !== undefined || !Array.isArray(args.targets) || args.targets.length !== 1 ||
      typeof args.targets[0] !== "string" || result.content[0]?.text.includes("[Blast Radius")) return result;
  try {
    const rootDir = resolveSmartWorkspaceRoot(args, defaultRootDir, resolveOpts).rootDir;
    const lsp = await escalateReadReferences(rootDir, args.targets[0]);
    if (!lsp) return result;
    const output = `${result.content[0]?.text ?? ""}\n${lsp.text}`;
    result.content = [{ type: "text", text: output }];
    const evidence = appendToolEvidence(rootDir, { tool: name, output, durationMs: 0 });
    result.structuredContent = { ...result.structuredContent, lspConfidence: "verified", evidenceId: evidence.artifactHash };
  } catch { /* An unavailable server must leave the fast AST result intact. */ }
  return result;
```

</details>

**依据 2 · 源码核查**：[src/host-interceptor.ts:513-540](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/host-interceptor.ts#L513-L540)

宏匹配只生成提示，可分离对照是否启用。

<details>
<summary>查看原文（28行）</summary>

```text
    const pipelines = loadMacroStore(options.rootDir).macros.filter(
      (m) => m.kind === "command-pipeline"
    );

    // 4. Normalize both sides: lowercase; strip trailing punctuation + whitespace
    // from the prompt ("launch!" / "启动项目。" still match).
    const normalizedPrompt = rawPrompt
      .toLowerCase()
      .replace(PROMPT_REFLEX_TRAILING_PUNCT_RE, "")
      .trim();
    const matched = pipelines.filter((m) =>
      (m.triggers ?? []).some((t) =>
        triggerMatchesPrompt(normalizedPrompt, t.trim().toLowerCase())
      )
    );

    // 5. No command-pipeline trigger matched -> nothing to reflex.
    if (matched.length === 0) return { action: "allow" };

    const best = pickMostUsedMacro(matched);
    return {
      action: "hint",
      macroId: best.id,
      hint: `[GraphFlow Prompt Reflex] Macro '${best.id}' (${best.state ?? "discovered"}) requires explicit execution via gf_macro(action="run", id="${best.id}").`,
    };
  } catch {
    return { action: "allow" };
  }
```

</details>

**依据 3 · 源码核查**：[assets/reflex/graphflow-prompt-reflex.dsh.mjs:86-94](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/assets/reflex/graphflow-prompt-reflex.dsh.mjs#L86-L94)

每次同步调用的等待点。

```text
/** First successful spawn wins: bin, then npx fallback (Windows .cmd needs a shell). */
function runHook(bin, npxArgs, input, cwd, timeoutMs) {
  const base = { input, cwd, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 1024 * 1024, env: process.env, windowsHide: true };
  const opts = { ...base, shell: process.platform === 'win32' };
  let res = spawnSync(bin, ['hook', 'user-prompt'], opts);
  if (res.error) res = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', [...npxArgs, 'hook', 'user-prompt'], opts);
  if (res.error) return undefined;
  return { status: res.status, stdout: res.stdout ?? '', stderr: res.stderr ?? '' };
}
```

**依据 4 · 源码核查**：[src/agent-installer.ts:2450-2479](https://github.com/Roarpeng/GraphFlow/blob/9797cd2105920ef6cbff0b9a7c5786c9c82da333/src/agent-installer.ts#L2450-L2479)

配置退出具备静态接线。

<details>
<summary>查看原文（30行）</summary>

```text
      try {
        if (removeReflexAsset(asset.type, asset.targetPath)) {
          results.push({
            agentId: profile.id,
            agentName: profile.name,
            category: "hook",
            targetPath: asset.targetPath,
            status: "removed",
          });
        }
      } catch (err) {
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: asset.targetPath,
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }
    if (profile.cordisPatchPath && (profile.reflexAssets ?? []).some((a) => a.type === "dsh-plugin")) {
      if (removeDshHookPatch(profile.cordisPatchPath)) {
        results.push({
          agentId: profile.id,
          agentName: profile.name,
          category: "hook",
          targetPath: profile.cordisPatchPath,
          status: "removed",
        });
```

</details>

#### 缺口

- 没有同任务的质量、等待和 token 结果
  **影响**：不能把输出压缩推成模型开销或产出提升
  **进一步探讨**：将完整调用覆盖作为合格结果后再比较资源与总工时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
