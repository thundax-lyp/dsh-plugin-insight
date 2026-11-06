# DSH-Code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4c280cf](https://github.com/UNLINEARITY/dsh-code/tree/4c280cffba92a42000786e5d9a8d4cc5e8261fa5)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/UNLINEARITY/dsh-code) [![npm 30d 1,255](https://img.shields.io/static/v1?label=npm+30d&message=1%2C255&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code)
<!-- END META -->

> **功能**：DSH原生终端bundle与启动器，组合Host Agent、会话/队列、审批和模型管理。

> **亮点**：[Q02](#research-q02)终端输入/事件接线；[Q03](#research-q03)队列与生命周期处理；[Q05](#research-q05)版本guard与真实更新整合。

> **主要限制**：[Q03](#research-q03)退出0仍可能flush失败、取消保留队列；[Q04](#research-q04)隔离继承Host；[Q05](#research-q05)升级/依赖修复非事务。

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
  - [Q01 · DSH-Code是独立编码Agent，还是Host上的终端bundle？](#detail-section-11)
  - [Q02 · 普通输入如何接通真实Agent，输出意味着完成吗？](#detail-section-12)
  - [Q03 · 取消、排队、退出和删除有什么恢复边界？](#detail-section-13)
  - [Q04 · 审批、权限与模型登录由谁负责，TUI是否加强执行隔离？](#detail-section-14)
  - [Q05 · 本包更新、依赖修复和偏好保存如何改变磁盘？](#detail-section-15)
  - [Q06 · 值得采用到什么范围，新方向应如何证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH-Code2.1.0是MIT的DSH原生终端bundle，同时提供deepseek/dsh-code启动器；Node^22.19或>=24，包依赖/peer大量固定DSH0.2.1-rc.4服务及Ink/React。CLI启动器检查profile已挂本包和交互TTY，再spawn已安装DSH并继承stdio/退出状态，未安装Host/未挂profile/非TTY会拒绝，不是开箱独立模型循环。

bundle把模型工具移到会话preset、Host保留共享服务；实际agents.create/resume和presets.mount来自Host。作者称与Web同套Agent/Session/工具/权限，本轮只核本仓接线，外部执行与隔离实现未知；不能把继承沙箱、模型推理和工具循环归为本包技术创新。面对需要终端对话/模型管理/会话回查的开发者，相对原生DSH CLI/Web或现有终端Agent，其新增主要在交互和生命周期组合，代码正确性/生产率需另验。

原生DSH CLI/Web、现有终端编码Agent及手工版本/错误核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 终端输入 | followup/steer | 上游driver执行 |
| 会话 | 恢复/队列/删除 | 非副作用回滚 |
| 审批 | 归属请求答复 | 非自有沙箱 |
| 更新 | 真安装/修复 | 分步失败无总回滚 |

**流程与依赖**

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node^22.19或>=24/TTY | 必需 | 启动 | 非TTY拒绝 |
| DSH0.2.1-rc.4服务/profile | 必需 | Agent/持久/权限 | 外部核心未全审 |
| 模型/凭据 | 编码需 | 实际推理 | 费用/授权另核 |
| npm/可写全局环境 | 更新需 | 真实安装 | 供应链/恢复成本 |

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 核版本/profile/低权preset | 不默认全权限 |
| 样例 | 固定小任务/审批/队列 | 核真实事件文件 |
| 恢复 | 取消/flush/重开 | 不凭exit0 |
| 更新 | 关会话/备份/对账版本 | 部分失败人工恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/模型费用未知 | 版本/权限核对 | 未安装 |
| 持续 | tokens/工具/日志未知 | 代码结果人审 | 无费硬封顶 |
| 故障 | 混线/丢日志恢复未知 | 对账文件/重建环境 | 无统一回滚 |
| 退出 | 凭据/会话留存未知 | 核flush/导出备份 | exit0非成功保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 编码入口 | 真Host消息 | 编码成功/节时 |
| 队列 | 真变更/取消后续跑 | 用户意图一致 |
| 退出 | 真flush调用 | 全部落盘 |
| 更新 | 真安装/guard | 原子恢复 |

> **思考**：[Q03](#research-q03)退出0仍可能flush失败、取消保留队列；[Q04](#research-q04)隔离继承Host；[Q05](#research-q05)升级/依赖修复非事务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)终端输入/事件接线；[Q03](#research-q03)队列与生命周期处理；[Q05](#research-q05)版本guard与真实更新整合。

[Q02](#research-q02)epoch/句柄防错投；[Q03](#research-q03)退出错误和部分删除；[Q05](#research-q05)tmp rename与版本guard但非事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)退出0仍可能flush失败、取消保留队列；[Q04](#research-q04)隔离继承Host；[Q05](#research-q05)升级/依赖修复非事务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06)低敏副本/低权限受限试用，核真实文件/回执，不凭退出码认持久成功。

bundle把模型工具移到会话preset、Host保留共享服务；实际agents.create/resume和presets.mount来自Host。作者称与Web同套Agent/Session/工具/权限，本轮只核本仓接线，外部执行与隔离实现未知；不能把继承沙箱、模型推理和工具循环归为本包技术创新。面对需要终端对话/模型管理/会话回查的开发者，相对原生DSH CLI/Web或现有终端Agent，其新增主要在交互和生命周期组合，代码正确性/生产率需另验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

终端到真实Host Agent/副作用接线可追，但上游执行/隔离与运行效果未验，限低敏受限试用。

- 已检查：作者 README、包清单、源码路径 README_CN.md、bin/deepseek.mjs、bin/runtime-deps.mjs、package.json、src/approval.ts、src/authorization.ts、src/git-workflow.ts、src/index.ts、src/permissions.ts、src/runner/quit.ts、src/runner/session-io.ts、src/runner/submissions.ts、src/settings-file.ts、src/update.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；核package/launcher、代表Agent创建/提交/投影/队列/审批/权限、取消/退出/切换dirty warning、JSONL真实删除、配置tmp rename、更新/修复真实安装及代表git/review；未全审全仓UI/全部preset/外部Host实现。
- 下一步：仅只读固定Git源码；未安装运行目标/测试/模型/Host/账户/浏览器，无独立兼容、编码质量、恢复/安全与费用实测。

**分析版本**

- **仓库**：[UNLINEARITY/dsh-code](https://github.com/UNLINEARITY/dsh-code)
- **版本号**：2.1.0（[固定提交 4c280cf](https://github.com/UNLINEARITY/dsh-code/tree/4c280cffba92a42000786e5d9a8d4cc5e8261fa5)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)先比stderr/人工清单，再验退出/升级分步结果与恢复责任收据。

仅只读固定Git源码；未安装运行目标/测试/模型/Host/账户/浏览器，无独立兼容、编码质量、恢复/安全与费用实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 5672 | — | — | 90713 |
| .mjs | source | 2 | 995 | 766 | 179 | — |
| .js | source | 1 | 101 | 25 | 78 | — |
| .ts | source | 95 | 31999 | 23069 | 7433 | — |
| .ts | test | 98 | 29052 | 25671 | 1633 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/UNLINEARITY/dsh-code/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核DSH终端bundle本包贡献及输入→Host Agent→用户结果，检查审批/队列/取消/持久与更新真实副作用，不把上游能力算本包创新。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH-Code是独立编码Agent，还是Host上的终端bundle？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

DSH-Code2.1.0是MIT的DSH原生终端bundle，同时提供deepseek/dsh-code启动器；Node^22.19或>=24，包依赖/peer大量固定DSH0.2.1-rc.4服务及Ink/React。CLI启动器检查profile已挂本包和交互TTY，再spawn已安装DSH并继承stdio/退出状态，未安装Host/未挂profile/非TTY会拒绝，不是开箱独立模型循环。

bundle把模型工具移到会话preset、Host保留共享服务；实际agents.create/resume和presets.mount来自Host。作者称与Web同套Agent/Session/工具/权限，本轮只核本仓接线，外部执行与隔离实现未知；不能把继承沙箱、模型推理和工具循环归为本包技术创新。面对需要终端对话/模型管理/会话回查的开发者，相对原生DSH CLI/Web或现有终端Agent，其新增主要在交互和生命周期组合，代码正确性/生产率需另验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-38](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/package.json#L1-L38)

身份/版本/bin/MIT。

<details>
<summary>查看原文（38行）</summary>

```text
{
  "name": "dsh-code",
  "description": "DeepSeek Harness CLI core bundle: interactive coding terminal, durable sessions, and model management for dsh --profile cli",
  "version": "2.1.0",
  "packageManager": "pnpm@12.4.1",
  "type": "module",
  "bin": {
    "deepseek": "./bin/deepseek.mjs",
    "dsh-code": "./bin/deepseek.mjs"
  },
  "main": "lib/index.mjs",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.mjs"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./presets/*.patch.yml": "./presets/*.patch.yml",
    "./session-query": {
      "types": "./lib/types/session-query.d.ts",
      "default": "./lib/session-query.mjs"
    },
    "./src/*": "./src/*",
    "./startup": {
      "types": "./lib/types/startup.d.ts",
      "default": "./lib/startup.mjs"
    }
  },
  "files": [
    "bin",
    "lib",
    "cordis.patch.yml",
    "presets",
    "src"
  ],
  "license": "MIT",
```

</details>

**依据 2 · 源码核查**：[package.json:53-64](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/package.json#L53-L64)

真实多patch bundle入口。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./presets/standard.patch.yml",
        "./presets/ptc.patch.yml",
        "./presets/minimal.patch.yml",
        "./presets/cordis.patch.yml"
      ]
    }
  },
  "scripts": {
```

</details>

**依据 3 · 源码核查**：[package.json:82-112](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/package.json#L82-L112)

Node及固定DSH/Ink依赖。

<details>
<summary>查看原文（31行）</summary>

```text
  },
  "dependencies": {
    "@deepseek-ai/dsh-agent-preset": "0.2.1-rc.4",
    "@deepseek-ai/dsh-agent-preset-registry": "0.2.1-rc.4",
    "@deepseek-ai/dsh-agent-tool-presentation": "0.2.1-rc.4",
    "@deepseek-ai/dsh-authorization": "0.2.1-rc.4",
    "@deepseek-ai/dsh-persona": "0.2.1-rc.4",
    "@deepseek-ai/dsh-tool-ask-user": "0.2.1-rc.4",
    "@deepseek-ai/dsh-tool-bash-persistent": "0.2.1-rc.4",
    "@deepseek-ai/dsh-tool-cordis": "0.2.1-rc.4",
    "@deepseek-ai/dsh-tool-pwsh-persistent": "0.2.1-rc.4",
    "@deepseek-ai/dsh-tool-session-query": "0.2.1-rc.4",
    "@deepseek-ai/dsh-util-values": "0.2.1-rc.4",
    "@deepseek-ai/dsh-web-fetch-http": "0.2.1-rc.4",
    "@deepseek-ai/schemastery": "^3.18.5",
    "chalk": "^5.6.2",
    "commander": "^15.0.0",
    "ink": "^5.2.1",
    "js-yaml": "^4.3.2",
    "react": "^18.3.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.6",
    "@deepseek-ai/dsh-agent": "0.2.1-rc.4",
    "@deepseek-ai/dsh-agent-default-model": "0.2.1-rc.4",
    "@deepseek-ai/dsh-agent-preset-registry": "0.2.1-rc.4",
    "@deepseek-ai/dsh-attachment": "0.2.1-rc.4",
    "@deepseek-ai/dsh-cmdline": "0.2.1-rc.4",
    "@deepseek-ai/dsh-commands": "0.2.1-rc.4",
    "@deepseek-ai/dsh-compaction": "0.2.1-rc.4",
```

</details>

**依据 4 · 作者声明**：[README_CN.md:21-49](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/README_CN.md#L21-L49)

作者Host边界与安装流程。

<details>
<summary>查看原文（29行）</summary>

````text

**DSH-Code 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）的终端编码界面。** 它以树外 bundle 的形式组合在官方 `@deepseek-ai/dsh-base` 之上，与 Harness Web UI 使用同一套 Agent、Session、工具、命令、技能、权限、sandbox、上下文压缩与插件服务。

DeepSeek Harness 将模型、工具、存储、策略和界面作为插件，通过 Cordis 注册。持久化会话事件记录恢复对话与运行状态所需的信息。DSH-Code 保留这套结构，并补充适合编码任务的终端工作流。界面采用开发者熟悉的终端操作方式，运行行为仍由 DSH 服务和配置决定。

## 二、快速开始

[2.1.0 更新说明](docs/releases/2.1.0_CN.md)

需要 Node `^22.19 || >=24` 和预览版 `dsh` CLI（当前版本线：`@deepseek-ai/dsh@0.2.1-rc.4`）。未配置模型时仍可进入 TUI、查看会话和使用非模型功能；在 `/model` 中按 Tab 进入供应商管理，配置 API key、OAuth 与设备码登录。

### 1. 安装与更新

从 npm 安装。安装或升级前，先关闭所有正在运行的 `dsh` / `deepseek` 会话。

```sh
npm install -g --allow-scripts=@deepseek-ai/dsh-subprocess-local,koffi,node-pty,@google/genai,protobufjs @deepseek-ai/dsh@0.2.1-rc.4 pnpm
npm install -g dsh-code@2.1.0
deepseek repair-deps
dsh plugin --profile cli add dsh-code@2.1.0
```

后续使用 `/update` 或 `deepseek update --apply` 更新。版本对齐、依赖修复与迁移错误详见[安装、升级与排障](docs/installation_CN.md)。

### 2. 启动指令

可用的启动指令：
```sh
dsh --profile cli
````

</details>

**依据 5 · 源码核查**：[bin/deepseek.mjs:800-839](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/bin/deepseek.mjs#L800-L839)

真实TTY/profile检查与Host spawn。

<details>
<summary>查看原文（40行）</summary>

```text
/** Launch the installed DSH CLI while preserving its exit status and stdio. */
export function launchDsh(
  args = process.argv.slice(2),
  spawnProcess = spawn,
  resolveCommand = dshCommand,
  isProfileReady = profileHasDshCode,
  isInteractiveStdin = () => process.stdin.isTTY === true,
) {
  if (!isProfileReady()) {
    console.error('dsh-code: the cli profile does not mount dsh-code yet. Run: dsh plugin --profile cli add dsh-code')
    process.exitCode = 1
    return undefined
  }
  // The interactive TUI is a raw-mode terminal application: with piped or
  // otherwise non-TTY stdin it would die deep inside Ink's raw-mode gate
  // with a cryptic stack. Fail here with one actionable line instead.
  if (!isInteractiveStdin()) {
    console.error('dsh-code: this terminal UI requires an interactive TTY on stdin; run it in a real terminal instead of a pipe')
    process.exitCode = 1
    return undefined
  }
  const command = resolveCommand(args)
  if (command === undefined) {
    console.error(`dsh-code: @deepseek-ai/dsh must be installed globally beside dsh-code; run: ${selfInstallHint()}`)
    process.exitCode = 1
    return undefined
  }
  const child = spawnProcess(command.command, command.args, {
    stdio: 'inherit',
  })

  child.once('error', error => {
    console.error(`dsh-code: could not start dsh: ${error.message}`)
    process.exitCode = 1
  })
  child.once('exit', (code, signal) => {
    process.exitCode = code ?? (signal === null ? 0 : 1)
  })
  return child
}
```

</details>

**依据 6 · 源码核查**：[src/index.ts:576-623](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L576-L623)

真实preset挂载与agents.create/resume。

<details>
<summary>查看原文（48行）</summary>

```text
    const setup = async (agentCtx: Context, agent: Agent): Promise<void> => {
      const sessionPreset = next.resume
        ? resolvePreset(agent.session)
        : mode
      const mounted = await presets.mount(agentCtx, sessionPreset)
      mode = mounted.id
      const selection: ModelSelectionRef = {
        get current(): ModelSelection | undefined {
          return resolveEffectiveSelection(selectionState.picked, agent.session.requestHeader()?.config, currentDefaults())
        },
        set current(value: ModelSelection | undefined) { selectionState.picked = value },
        assembled: undefined,
      }
      installModelSelection(agentCtx, selection)
    }
    // AgentOptions seed the loop's fallback route; effort rides the selection
    // ref (installModelSelection), so only the provider/model pair is seeded.
    const seedOptions = pendingSelection === undefined
      ? { provider: currentDefaults().provider, model: currentDefaults().model }
      : { provider: pendingSelection.provider, model: pendingSelection.model }
    const handle = next.resume
      ? await agents.resume({
        resumeSessionId: SessionId(next.sessionId),
        agentOptions: seedOptions,
        // Quit aborts an in-flight composition so the exit wait never hangs
        // on a prepare that cannot settle; upstream rolls the creation back.
        signal: quitAbort.signal,
        setup,
      })
      : await agents.create({
        sessionId: SessionId(next.sessionId),
        meta: {
          cwd: nextCwd,
          agentPreset: mode,
          ...(next.parentSession === undefined ? {} : { parentSession: next.parentSession }),
          ...(next.origin === undefined ? {} : { origin: next.origin }),
          // 0.1.5 fork lineage: the seed marker lives on the metadata and the
          // inherited prefix length on the top-level option (the v0 header's
          // numeric `seedLength` field is gone from the create contract).
          ...(next.seedLength === undefined ? {} : { isSeeded: true }),
        },
        ...(next.seedLength === undefined ? {} : { inheritedEventCount: SessionLogOffset(next.seedLength) }),
        ...(next.seed === undefined ? {} : { seed: next.seed }),
        agentOptions: seedOptions,
        signal: quitAbort.signal,
        setup,
      })
    const session = handle.agent.session
```

</details>

#### 缺口

- Host/全部外部preset/工具/沙箱、真实兼容/需求与效果未验证。
  **影响**：只能评本包接线，不证明编码结果或安全执行。
  **进一步探讨**：同一低权限样例与原生CLI/Web比较，核依赖/权限后再用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 普通输入如何接通真实Agent，输出意味着完成吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

普通文本经deliverLine解析mentions并构建user消息，额外会话快照先inject，再调用当前Agent.followup或steer。前者下一轮、后者当前轮步骤边界，由上游driver继续模型/工具决策，非本仓自造循环；无会话时延迟create、缓冲输入，启动附件也经StartupInputGate顺序flush。切会话/退出epoch与Agent句柄校验阻止旧异步准备发往新会话，来源session标签另作匹配。

输出由session/event按当前session id更新transcript store，workspace变化向Host服务取摘要并入投影；这是上游事件与文件摘要呈现，不能替测试、用户验收或证明全部副作用已持久化。slash走commandregistry不直接给模型；跨会话mention可能把其他会话内容注入当前模型，权限/敏感范围仍继承Host，不能因菜单显示即认定访问授权。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1154-1208](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1154-L1208)

真实parse/epoch检查/inject/user消息/followup-steer。

<details>
<summary>查看原文（55行）</summary>

```text

  /** Delivery serialization state: the chain's epoch pins it to one session. */
  let deliveryChain: { epoch: number; tail: Promise<void> } = { epoch: 0, tail: Promise.resolve() }

  /** Deliver one trimmed line to the live session, expanding mentions first. */
  const deliverLine = (line: string, images: readonly ContentBlock[] = [], mode: 'followup' | 'steer' = 'followup'): void => {
    const currentAgent = agent!
    const currentMentions = mentions
    // The command registry is a closed namespace: slash lines run out of
    // band and never reach the model through this path.
    if (images.length === 0 && isSlashLine(line)) {
      runSlash(line)
      return
    }
    let parsed: ReturnType<MentionsApi['parse']>
    try {
      parsed = currentMentions.parse(line)
    } catch (error: unknown) {
      bridge.notify(t('notice.invalidReference', { message: error instanceof Error ? error.message : String(error) }), 'error')
      return
    }
    // Ordered delivery: the inbox order IS the user's message order. A line
    // with session mentions prepares asynchronously, and a later plain line
    // used to deliver synchronously past it. Every line now waits for the
    // previous line of the same session; an epoch change (switch/quit)
    // abandons the chain instead of gating the next session on the old one.
    if (deliveryChain.epoch !== epoch) deliveryChain = { epoch, tail: Promise.resolve() }
    const enqueueDelivery = (run: () => void): void => {
      deliveryChain.tail = deliveryChain.tail.then(run)
    }
    const atEpoch = epoch
    const deliver = (readable: string, context?: UserMessage): void => {
      // A switch/quit landed while the snapshot was being prepared: never
      // deliver to an agent that is no longer on screen.
      if (epoch !== atEpoch || agent !== currentAgent) return
      // Session snapshots ride the inbox as model-facing context ahead of
      // the readable message (upstream README wiring: inject before the
      // followup/steer that wakes the driver).
      try {
        if (context !== undefined) currentAgent.inject(context)
        const content: ContentBlock[] = [
          ...(readable === '' ? [] : [{ type: 'text' as const, text: readable }]),
          ...images,
        ]
        const message = createUserMessage({
          content,
          source: { kind: 'user' },
        })
        // Steering is consumed at the next step boundary of the turn already
        // running; a followup becomes its own turn instead.
        if (mode === 'steer') currentAgent.steer(message)
        else currentAgent.followup(message)
      } catch (error: unknown) {
        bridge.notify(t('notice.messageFailed', { kind: t(mode === 'steer' ? 'notice.kind.steering' : 'notice.kind.message'), message: error instanceof Error ? error.message : String(error) }), 'error')
      }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1231-1267](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1231-L1267)

无session时真实创建与缓冲。

<details>
<summary>查看原文（37行）</summary>

```text
  // only when the user submits real input (or /new), and every line that
  // arrives during creation is delivered in order afterwards. A creation
  // failure reports and clears the queue, leaving the transient state ready
  // for the next attempt.
  const pendingInputs: Array<{ text: string; mode: 'followup' | 'steer'; images: readonly ContentBlock[] }> = []
  // A creation is queued/running: further submissions must not mint more
  // fresh sessions (their lines queue into pendingInputs instead).
  let creating = false
  const ensureSession = (mode?: string): void => {
    if (creating) return
    creating = true
    void compose(async () => {
      try {
        // A direct `/mode <preset>` resolves asynchronously. Preserve submit
        // order so the first composition cannot race ahead with the old mode.
        await pendingModeWork
        // Another composition (e.g. a /resume activated while this creation
        // waited its turn) may have published a session already: deliver the
        // queued lines there instead of minting a competing fresh session
        // (which would orphan the live one without a dispose).
        if (session !== undefined) {
          const queued = pendingInputs.splice(0)
          for (const item of queued) deliverLine(item.text, item.images, item.mode)
          return
        }
        const next = await prepare({
          sessionId: `session-${randomUUID()}`,
          resume: false,
          ...(mode === undefined ? {} : { mode }),
        })
        if (quitting) {
          void next.handle.dispose().catch(() => {})
          return
        }
        const previous = { active, agent, session, store, mentions }
        try {
          active = next
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1381-1406](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1381-L1406)

StartupInputGate与来源session检查。

<details>
<summary>查看原文（26行）</summary>

```text
  // Startup serialization: input submitted while the startup prompt/images
  // are still preparing queues behind the initial request.
  const inputGate = new StartupInputGate(({ text, mode, images }) => sendNow(text, images, mode))
  const send = (text: string, images: readonly ContentBlock[] = [], mode: 'followup' | 'steer' = 'followup'): void => {
    inputGate.submit({ text, mode, images })
  }

  /** Dispatch one submitted line: slash commands to the registry, other text to the agent. */
  const dispatch = (text: string, images: readonly ContentBlock[] = [], origin?: string): void => {
    // An attachment prepare resolved after the app remounted onto another
    // session (queued switch): the composing session is gone, so the stale
    // delivery is dropped instead of landing in the new session's inbox.
    if (!submissionBelongsToSession(origin, session?.id)) return
    send(text, images)
  }

  /**
   * Deliver one line as steering: a running driver consumes it at its next
   * step boundary, an idle one starts a turn with it. The composer's Tab
   * toggle picks this over {@link dispatch} for the next submission.
   */
  const steer = (text: string, images: readonly ContentBlock[] = [], origin?: string): void => {
    if (!submissionBelongsToSession(origin, session?.id)) return
    send(text, images, 'steer')
  }

```

</details>

**依据 4 · 源码核查**：[src/runner/submissions.ts:113-157](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/runner/submissions.ts#L113-L157)

真实来源匹配和启动队列finally冲刷。

<details>
<summary>查看原文（45行）</summary>

```text
 * Whether a tagged submission still belongs to the active session. Attachment
 * prepares resolve on the microtask timeline, while a queued session switch
 * remounts the app asynchronously — the composing instance's unmount cleanup
 * runs too late to abort, so the delivery itself carries the composing
 * session's full id and the runner drops it here when the world moved on.
 * An untagged (synchronous) or pending-session ('') submission always passes.
 */
export function submissionBelongsToSession(origin: string | undefined, activeSessionId: string | undefined): boolean {
  return origin === undefined || origin === '' || origin === activeSessionId
}

/**
 * Order-preserving gate for composer input while the startup prompt/images
 * are still preparing. Anything submitted before the startup delivery settles
 * queues and flushes afterwards in submit order, so the initial request can
 * never be overtaken by typing that raced a slow image preparation. The flush
 * also runs when the startup delivery fails: user input is never stranded.
 */
export class StartupInputGate {
  private readonly queued: QueuedSubmission[] = []
  private pending = false
  constructor(private readonly deliver: (submission: QueuedSubmission) => void) {}

  /** Submit one line: delivered now while idle, queued behind the startup delivery otherwise. */
  submit(submission: QueuedSubmission): void {
    if (this.pending) this.queued.push(submission)
    else this.deliver(submission)
  }

  /**
   * Run the startup delivery — the callback receives the direct-delivery sink
   * for the startup prompt itself — then flush everything that queued behind
   * it, in order, even when the callback rejects.
   */
  async run(startup: (deliver: (submission: QueuedSubmission) => void) => Promise<void>): Promise<void> {
    this.pending = true
    try {
      await startup(submission => this.deliver(submission))
    } finally {
      this.pending = false
      const queued = this.queued.splice(0)
      for (const submission of queued) this.deliver(submission)
    }
  }
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:757-791](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L757-L791)

真实session事件→store与工作区摘要。

<details>
<summary>查看原文（35行）</summary>

```text
  const off = ctx.on('session/event', (subject: Session, event: SessionEvent) => {
    if (session === undefined) return
    if (subject.id === session.id) {
      store.apply(event)
      // Live turn-change enrichment: the host's `workspaceChanges` service
      // serves the announced summary synchronously while the session lives;
      // the renderer joins it to the folded marker by seq. A resume replays
      // the marker without the service (fresh recorder, no history), which
      // renders the durable files row instead — the designed floor.
      if ((event.type as string) === 'workspace/changes') {
        const changes = ctx.get('workspaceChanges') as WorkspaceChangesFace | undefined
        const data = (event as { data?: { turn?: unknown } }).data
        if (changes !== undefined && typeof data?.turn === 'number') {
          const summary = changes.summary(subject.id, event.seq)
          if (summary !== undefined) {
            const view: WorkspaceChangesView = {
              turn: summary.turn,
              total: summary.total,
              added: summary.added,
              deleted: summary.deleted,
              files: summary.files.map(file => ({ display: file.display, added: file.added, deleted: file.deleted })),
            }
            store.setWorkspaceChanges(event.seq, view)
          }
        }
      }
      // The committed plan fold caught up (or diverged via a typed /plan or
      // an approved plan review): the durable event is the live truth again,
      // so the cycle's in-flight intent retires.
      if (event.type === 'plan/mode') planIntent = undefined
      // The parent-owned subagent catalog rides the ROOT log (0.1.5); each
      // fact describes one child, so it feeds that child's live row.
      if (event.type === 'subagent/catalog' && event.data.childId !== '') subagents.apply(event.data.childId, event)
      return
    }
```

</details>

#### 缺口

- 真实driver/模型/工具结果和跨会话敏感内容权限未独立验证。
  **影响**：投影/消息入队不等任务完成或数据已安全处理。
  **进一步探讨**：固定可验结果任务核原始事件、实际文件/测试，检查mention范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 取消、排队、退出和删除有什么恢复边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

队列编辑保附件、remove真实inbox变更，steer移除后提交抛错会append回next-turn；Esc取消当前Agent前先复制nextTurn，cancel后逐一followup重唤醒，故不是“取消全部待做工作”，下一轮仍可能执行，当前步steer被丢弃。cancel请求不是外部shell/远端/已经写文件自动回滚，工具终止和恢复来自Host且本轮未知。

退出先取消切换/中止组合与待处理准备、递增epoch、卸载UI，再flush当前session→dispose→等待composing→history/settings flush；runQuitSequence每步错误通知后仍继续并exit(0)，所以正常退出码不能证明会话/设置全部写成功，强杀更无此清理。切换后旧session flush/dispose失败只显示dirty warning，下一会话已经切到。

/delete针对JSONL先规划子树/拒绝活跃/核目录，再取所有Host持久写租约，逐子代真实rm已知会话artifact；I/O中途可部分删除并报removed/total，无恢复事务。这是删除会话日志，不撤销工作区文件或外部工具副作用。租约真实排他依赖未全审Host后端，不能称独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/runner/submissions.ts:59-110](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/runner/submissions.ts#L59-L110)

实际队列变更/steer回填/取消后重唤醒。

<details>
<summary>查看原文（52行）</summary>

```text
export function applyQueueMutation(
  inbox: Pick<Inbox, 'nextTurn' | 'append' | 'remove' | 'replace'>,
  status: AgentStatus,
  messageId: string,
  action: QueueMutation,
  steer: (message: UserMessage) => void,
): QueueMutationOutcome {
  const id = MessageId(messageId)
  const message = inbox.nextTurn.find(candidate => candidate.id === id)
  if (message === undefined) return 'unavailable'
  switch (action.kind) {
    case 'remove':
      return inbox.remove(id) ? 'removed' : 'unavailable'
    case 'edit':
      if (action.text.trim() === '') return 'empty'
      inbox.replace(id, createUserMessage({
        content: queueEditContent(message.content, action.text),
        source: message.source,
      }))
      return 'edited'
    case 'steer':
      if (status !== 'running') return 'steerUnavailable'
      // Steer promotes the message out of next-turn, so a failing submit must
      // put it back: the row the user was looking at never just disappears.
      if (!inbox.remove(id)) return 'unavailable'
      try {
        steer(message)
      } catch (error: unknown) {
        inbox.append('next-turn', message)
        throw error
      }
      return 'steered'
  }
}

/**
 * Cancel the active turn while keeping the next-turn queue, then wake the
 * driver again so the preserved messages actually run. `cancel` clears
 * pending work by default and never wakes the driver on its own, so the queue
 * is captured first and re-submitted afterwards: a waking submission latches
 * the wake while the aborted activity converges to idle, which is what turns
 * "preserved" into "sent next" instead of "parked forever". Next-step
 * steering is deliberately dropped — it belonged to the cancelled turn.
 * @param agent - the live agent handle.
 * @returns how many queued messages were preserved across the abort.
 */
export function cancelPreservingQueue(agent: Pick<Agent, 'inbox' | 'cancel' | 'followup'>): number {
  const queued = [...agent.inbox.nextTurn]
  agent.cancel({ kind: 'user' })
  for (const message of queued) agent.followup(message)
  return queued.length
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1408-1427](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1408-L1427)

Esc真实调用cancelPreservingQueue。

<details>
<summary>查看原文（20行）</summary>

```text
   * Interrupt the running turn (Esc); true when a turn was actually
   * cancelled. {@link cancelPreservingQueue} keeps the next-turn queue alive
   * AND re-wakes the driver, so the preserved messages run instead of
   * parking; next-step steering dies with the turn.
   */
  const interrupt = (): boolean => {
    if (agent === undefined || agent.status !== 'running') return false
    try {
      const preserved = cancelPreservingQueue(agent)
      bridge.notify(t(preserved > 0 ? 'notice.turnCancelledKeepQueue' : 'notice.turnCancelled'))
      return true
    } catch (error: unknown) {
      bridge.notify(t('notice.cancelFailed', { message: error instanceof Error ? error.message : String(error) }), 'error')
      return false
    }
  }

  /** Select one permission preset before the first session or on the active one. */
  const setPermissionAction = (id: string): string => {
    if (permissionPresets === undefined || permissionPresets.names.length === 0) {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1046-1093](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1046-L1093)

真实退出中止/顺序flush dispose调用。

<details>
<summary>查看原文（48行）</summary>

```text
  let quitting = false
  const quit = (): void => {
    if (quitting) return
    quitting = true
    switchQueue.cancel()
    // Stale prepares/commands die with the session they were for. Aborting
    // the composition signal lets a never-settling prepare reject, so the
    // exit wait below cannot hang (upstream rolls the creation back).
    abortPendingControllers()
    quitAbort.abort()
    epoch += 1
    off()
    for (const dispose of offCapabilitySync) dispose()
    if (capabilitySyncTimer !== undefined) clearTimeout(capabilitySyncTimer)
    const currentSession = session
    const currentActive = active
    const report = (name: string, error: unknown): void => {
      internals.stderr.write(`dsh: quit ${name} failed: ${error instanceof Error ? error.message : String(error)}\n`)
    }
    // A throwing unmount must not strand the terminal (stdin tap alive,
    // keyboard protocol stacks unpopped) or skip the exit sequence below.
    try {
      mountRef.current?.unmount()
    } catch (error: unknown) {
      report('unmount', error)
    }
    // One ordered cleanup: settle the visible session (if any — a bare launch
    // that never composed one resolves immediately), then wait for the final
    // in-flight composition (its work swallows errors and the quitting guard
    // disposes any half-prepared agent), then flush the durable recall and
    // the queued user-level settings writes, then request exit. `composing`
    // and `historyWriteChain` are read at step run
    // time, so a turn that was still being queued when quit ran is included.
    // A failing step must never skip the remaining cleanup.
    const steps: QuitCleanupStep[] = [
      ...(currentSession === undefined || currentActive === undefined
        ? []
        : [
          { name: 'flush', run: async () => { await sessions.flush(currentSession) } },
          { name: 'dispose', run: () => currentActive.handle.dispose() },
        ]),
      { name: 'composing', run: () => composing ?? Promise.resolve() },
      { name: 'history', run: () => inputHistory.flush() },
      { name: 'settings', run: () => settingsPersistence.flush() },
    ]
    void runQuitSequence(steps, io.exit, report)
  }

```

</details>

**依据 4 · 源码核查**：[src/runner/quit.ts:29-53](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/runner/quit.ts#L29-L53)

每步catch后仍exit0。

<details>
<summary>查看原文（25行）</summary>

```text
export async function runQuitSequence(
  steps: readonly QuitCleanupStep[],
  exit: (code: number) => void,
  onError?: (name: string, error: unknown) => void,
): Promise<readonly string[]> {
  const started: string[] = []
  for (const step of steps) {
    started.push(step.name)
    try {
      await step.run()
    } catch (error) {
      try {
        onError?.(step.name, error)
      } catch {
        // The failure sink must never abort the cleanup sequence.
      }
    }
  }
  try {
    exit(0)
  } catch {
    // The exit request itself must not become an unhandled rejection.
  }
  return started
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1793-1811](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1793-L1811)

切换旧flush/dispose失败warning。

<details>
<summary>查看原文（19行）</summary>

```text
      let cleanupWarning: string | undefined
      try {
        await sessions.flush(previous.session)
      } catch (error: unknown) {
        cleanupWarning = t('notice.flushFailed', { message: error instanceof Error ? error.message : String(error) })
      }
      try {
        await previous.handle.dispose()
      } catch (error: unknown) {
        const release = t('notice.agentReleaseFailed', { message: error instanceof Error ? error.message : String(error) })
        cleanupWarning = cleanupWarning === undefined ? release : `${cleanupWarning}; ${release}`
      }
      const shortId = next.session.id.slice(-12)
      bridge.notify(cleanupWarning === undefined
        ? t(next.resumed ? 'notice.sessionResumed' : 'notice.sessionCreated', { id: shortId, mode: next.mode })
        : t('notice.sessionSwitchedDirty', { id: shortId, detail: cleanupWarning }),
      cleanupWarning === undefined ? 'info' : 'warning')
    })
  }
```

</details>

**依据 6 · 源码核查**：[src/runner/session-io.ts:175-238](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/runner/session-io.ts#L175-L238)

真实目录/租约与子代rm及部分失败。

<details>
<summary>查看原文（64行）</summary>

```text
    const activeId = services.activeSessionId()
    if (activeId !== undefined && activeId === id) return 'cannot delete the session you are using — switch or /new first'
    const records = await sessionQuery.listSessions()
    const plan = planSessionDeletion(records, id)
    if (!plan.ok) return plan.reason
    // Phase 2 completes the plan before the first rm: derive and
    // layout-check every node up front, so a refusal never leaves a
    // partially removed subtree behind.
    const root = jsonlSessionRoot(persistence)
    if (root === undefined || persistence === undefined) {
      return 'session backend exposes no deletable artifact (deletion is unsupported on this backend)'
    }
    const byId = new Map<string, (typeof records)[number]>(records.map(record => [record.header.id, record]))
    const dirs = new Map<string, string>()
    for (const node of plan.nodes) {
      const record = byId.get(node.id)
      if (record === undefined) return `no persisted session matches "${node.id}"`
      const dir = sessionArtifactDirectory(sessionDirectoryFor(root, record.header.cwd, node.id), node.id)
      if (dir === undefined) {
        return `refusing to delete: unexpected artifact layout for ${node.id.slice(-12)}`
      }
      dirs.set(node.id, dir)
    }
    let leases
    try {
      leases = await acquireSessionDeletionLeases(persistence, plan.nodes.map(node => node.id))
    } catch (error: unknown) {
      if (error instanceof SessionAlreadyOwnedError) {
        return `cannot delete ${error.sessionId.slice(-12)} — it is open in this or another process`
      }
      return `cannot safely lock sessions for deletion: ${error instanceof Error ? error.message : String(error)}`
    }

    let removed = 0
    let outcome: string | undefined
    for (const node of plan.nodes) {
      const dir = dirs.get(node.id)!
      try {
        // Remove every canonical generation artifact this build knows; other
        // sibling files are never ours to delete. The POSIX session.lock file
        // deliberately remains because unlinking a held flock inode would
        // forfeit the backend's exclusion guarantee.
        const entries = await readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && isSessionArtifactName(entry.name)) {
            await rm(join(dir, entry.name), { force: true })
          }
        }
        await rm(dir, { force: true, recursive: false }).catch(() => {})
        removed += 1
      } catch (error: unknown) {
        outcome = `delete failed for ${node.id.slice(-12)} after ${removed} of ${plan.nodes.length}: ${error instanceof Error ? error.message : String(error)}`
        break
      }
    }
    outcome ??= `deleted ${removed} session${removed === 1 ? '' : 's'}`
    try {
      await releaseSessionDeletionLeases(leases)
    } catch (error: unknown) {
      return `${outcome}; failed to release deletion locks: ${error instanceof Error ? error.message : String(error)}`
    }
    return outcome
  }

```

</details>

#### 缺口

- 工具实际终止、强杀恢复、持久后端租约与多进程/部分删除未运行验证。
  **影响**：不能把取消/退出0/删除日志当副作用撤回和不丢数据。
  **进一步探讨**：可丢弃目录测保留队列、失败flush、部分删除，按实际日志与工作区对账。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审批、权限与模型登录由谁负责，TUI是否加强执行隔离？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

TUI给当前Agent及parentSession等于当前根id的子Agent答approval/request，外国根next()；已abort直接cancelled，界面按真实请求排队，一次answer锁存后settle outcome并拆abort listener。它是审批答复适配器，不决定何种工具必须审批，也不独立施加文件/网络隔离。permission选择调用Host permissionPresets.resolve/set，无新权限强制实现；danger-full-access选项可出现，应明确低权preset并核Host实际生效。

模型provider授权同样经Host authorization.begin与credentials服务，浏览器/设备登录及凭据存储边界另审；不是本包自有账户隔离。shell、文件、子Agent、MCP等preset有真实外部副作用，不能仅凭审批条或包存在认定所有路径受限。本轮不调用账号/Host，仅限定无敏感低权限副本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:815-831](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L815-L831)

真实根/子Agent审批归属谓词。

<details>
<summary>查看原文（17行）</summary>

```text

  // Approval answerer: renders the ask as a y/n bar. Claims the on-screen
  // agent AND the subagents of its session tree — the kernel stamps child
  // sessions with `parentSession` (the root id), and a delegated ask the
  // user can meaningfully answer used to fall through the waterfall to a
  // silent fail-closed rejection. Foreign roots still defer; the predicate
  // stays empty until the first session exists.
  const ownsInSessionTree = (candidate: Agent): boolean => {
    if (agent === undefined) return false
    if (candidate.id === agent.id) return true
    return candidate.session.header.parentSession === agent.session.id
  }
  const approval: ApprovalStore = mountApprovalAnswerer(
    ctx,
    ownsInSessionTree,
    request => approvalCommandPreview(store.getView().entries, request.callId, request.toolName),
  )
```

</details>

**依据 2 · 源码核查**：[src/approval.ts:92-150](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/approval.ts#L92-L150)

真实请求claim/abort/一次回答与settle。

<details>
<summary>查看原文（59行）</summary>

```text
  ctx.on('approval/request', (request: ApprovalRequest, next: () => Promise<ApprovalOutcome>) => {
    if (!owns(request.agent)) return next()
    // An already-aborted ask never reaches the human (mirrors the host bridge).
    if (request.signal?.aborted === true) return Promise.resolve<ApprovalOutcome>('cancelled')

    let resolved = false
    let settle!: (outcome: ApprovalOutcome) => void
    // Established BEFORE the abort listener mounts: a synchronous throw
    // between the listener registration and a later construction site would
    // otherwise leave a subsequent abort invoking an unassigned settle from
    // inside the AbortSignal listener (an uncaughtException).
    const settled = new Promise<ApprovalOutcome>((resolve) => {
      settle = resolve
    })
    const signal = request.signal
    const onAbort = (): void => withdraw()
    // Detach on every settle so an answered ask never retains a listener on
    // the tool call's signal (long turns ask many times; each ask must let go).
    const detachAbort = (): void => {
      if (signal !== undefined) signal.removeEventListener('abort', onAbort)
    }
    const withdraw = (): void => {
      if (resolved) return
      resolved = true
      detachAbort()
      removeSlot(slot)
      publish()
      // The service's signal race would conclude 'cancelled' anyway; settle
      // the same way so this listener never dangles a pending promise.
      settle('cancelled')
    }
    if (signal !== undefined) {
      signal.addEventListener('abort', onAbort, { once: true })
    }
    const slot: Slot = {
      answered: false,
      pending: {
        headline: request.reason ?? `tool ${request.toolName} asks for your approval`,
        toolName: request.toolName,
        command: preview(request),
        answer: (outcome: ApprovalAnswer): void => {
          // One-shot latch: a second keypress after submission is inert.
          if (resolved) return
          resolved = true
          detachAbort()
          slot.answered = true
          publish()
          settle(outcome)
        },
      },
    }
    queue.push(slot)
    publish()

    return settled.then((outcome) => {
      if (outcome !== 'cancelled') {
        removeSlot(slot)
        publish()
      }
```

</details>

**依据 3 · 源码核查**：[src/permissions.ts:17-40](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/permissions.ts#L17-L40)

真实permission服务选择/校验/set。

<details>
<summary>查看原文（24行）</summary>

```text
/** Read the optional Harness service without importing its runtime package. */
export function permissionPresetsFrom(ctx: Context): PermissionPresetsService | undefined {
  return ctx.get('permissionPresets')
}

/** Effective label for either an active session or the not-yet-created first one. */
export function effectivePermission(
  service: PermissionPresetsService,
  session: Session | undefined,
  pending: string | undefined,
): string {
  return session === undefined ? pending ?? service.defaultPreset : service.current(session)
}

/** Validate a preset and write it only when a durable session already exists. */
export function selectPermission(
  service: PermissionPresetsService,
  session: Session | undefined,
  preset: string,
): string {
  service.resolve(preset)
  if (session !== undefined) service.set(session, preset)
  return preset
}
```

</details>

**依据 4 · 源码核查**：[src/permissions.ts:72-80](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/permissions.ts#L72-L80)

danger-full-access等label非隔离实现。

```text
  const known: Record<string, string> = {
    'read-only': t('permission.readOnly'),
    'workspace-write': t('permission.workspaceWrite'),
    'danger-full-access': t('permission.dangerFullAccess'),
    'auto': t('permission.auto'),
    'custom': t('permission.custom'),
    'plan': t('permission.plan'),
  }
  return known[raw] ?? raw
```

**依据 5 · 源码核查**：[src/authorization.ts:37-48](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/authorization.ts#L37-L48)

读取授权/凭据Host服务。

<details>
<summary>查看原文（12行）</summary>

```text
/** Load only model-provider flows; unrelated future authorization domains stay out of `/model`. */
export async function loadProviderAuthorizations(ctx: Context): Promise<ProviderAuthorizationDirectory> {
  const authorization = ctx.get('authorization')
  const credentials = ctx.get('credentials')
  if (authorization === undefined || credentials === undefined) return { rows: [], failures: [] }
  const entries = authorization.list().filter(entry => credentialKeyScope(entry.key) === PI_AI_RECORD_SCOPE)
  const failures: string[] = []
  const rows = await Promise.all(entries.map(async (entry): Promise<ProviderAuthorizationRow> => {
    let record: CredentialRecordInfo
    try {
      record = await credentials.describeRecord(entry.key)
    } catch (error: unknown) {
```

</details>

**依据 6 · 源码核查**：[src/authorization.ts:78-104](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/authorization.ts#L78-L104)

Host begin/cancel/移除记录。

<details>
<summary>查看原文（27行）</summary>

```text
/** Begin one provider login through the interaction surface owned by the caller. */
export async function beginProviderAuthorization(
  ctx: Context,
  row: Pick<ProviderAuthorizationRow, 'key'>,
  method: string,
  interaction: AuthorizationInteraction,
  signal?: AbortSignal,
): Promise<AuthorizationStatus> {
  const authorization = ctx.get('authorization')
  if (authorization === undefined) throw new Error('provider login is unavailable in this profile')
  return (await authorization.begin({ key: row.key, method, interaction, signal })).status
}

/** Cancel the attempt currently serving this provider, if any. */
export function cancelProviderAuthorization(ctx: Context, key: CredentialKey): void {
  ctx.get('authorization')?.cancel(key)
}

/** Remove an authorization record without changing the provider's settings profile. */
export async function logoutProviderAuthorization(ctx: Context, row: ProviderAuthorizationRow): Promise<void> {
  const credentials = ctx.get('credentials')
  if (credentials === undefined) throw new Error('credential storage is unavailable in this profile')
  const current = await credentials.describeRecord(row.key)
  if (!current.configured) return
  if (!current.writable) throw new Error('this login record is read-only')
  await credentials.deleteRecord(row.key)
}
```

</details>

#### 缺口

- 上游权限/沙箱/全部工具、凭据存储和根子Agent真实行为未审全/未测。
  **影响**：不能做增强隔离或多租户安全保证。
  **进一步探讨**：先核Host权限实际拒绝与审批结果、凭据退出清理，不在真实账户/仓库盲用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 本包更新、依赖修复和偏好保存如何改变磁盘？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

更新UI调用独立启动器update --apply，确认计划能带精确dsh/code/plugin specs；启动器按顺序npm install -g Host与本包→repair-deps→profile plugin add，致命失败停，伴随插件best-effort继续但非0结果。源码有包/Host降级与旧本地checkout混线guard、缺profile命令在安装前拒绝，但步骤之间没有统一回滚，前步成功后步失败仍留下改动，应关所有会话并备份/核实际版本，不能当原子升级。

repair-deps会备份Host package/lock元数据，写修改后的package.json并在Host目录真实npm install，freshInspection后npm audit；失败留备份+提示重试，不自动还原依赖树，允许部分包install scripts也是信任边界。主题等用户设置自己用进程内链+唯一tmp写rename和短暂权限错误重试，减半写文件风险但非跨进程最后写胜约束，也无fsync/断电持久保证。

代表/diff通过execFile git参数数组、禁ext-diff/textconv、带signal，review只是把有截断标记diff构造成“不要修改”模型提示，不是可执行只读权限策略；真实结果与写入仍要看Host权限。此处未全审全部review/UI/配置命令。

#### 证据与依据

**依据 1 · 源码核查**：[src/update.ts:103-126](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/update.ts#L103-L126)

真实apply spawn与退出结果。

<details>
<summary>查看原文（24行）</summary>

```text
  for (const plugin of plan.pluginSpecs) args.push('--plugin', plugin)
  return args
}

export function applyLauncherUpdate(onLine: (line: string) => void, spawnProcess?: SpawnLike, plan?: LauncherUpdatePlan): Promise<number> {
  const spawnFn = spawnProcess ?? (spawn as SpawnLike)
  const command = launcherUpdateCommand(plan === undefined ? ['update', '--apply'] : applyPlanArgs(plan))
  return new Promise((resolve, reject) => {
    const child = spawnFn(command.command, command.args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
    const split = createLineSplitter(onLine)
    child.stdout?.on('data', (chunk: Buffer) => { split(chunk.toString()) })
    child.stderr?.on('data', (chunk: Buffer) => { split(chunk.toString()) })
    child.once('error', error => {
      reject(new Error(`update failed to start: ${error.message}`))
    })
    // 'close' fires once the stdio streams have ended, so a final line the
    // child left without its newline still reaches the panel; a bare '\n'
    // flushes any pending partial without adding a blank row.
    child.once('close', (code, signal) => {
      split('\n')
      resolve(code ?? (signal === null ? 0 : 1))
    })
  })
}
```

</details>

**依据 2 · 源码核查**：[bin/deepseek.mjs:244-273](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/bin/deepseek.mjs#L244-L273)

真实全局安装/repair/profile步骤。

<details>
<summary>查看原文（30行）</summary>

```text
 */
export function updateSteps({ plan, npm = npmInvocation(), resolveCommand = rawDshCommand }) {
  const steps = [{
    command: npm.command,
    args: [...npm.args, 'install', '-g', plan.dshSpec, plan.codeSpec],
    label: 'npm install',
    fatal: true,
    remedy: `npm install -g ${plan.dshSpec} ${plan.codeSpec}`,
  }, {
    command: process.execPath,
    args: [fileURLToPath(import.meta.url), 'repair-deps'],
    label: 'repair host dependencies',
    fatal: true,
    remedy: 'deepseek repair-deps',
  }]
  if (!plan.profileStep) return { steps, blockers: [] }
  const blockers = []
  const codeCommand = resolveCommand(['plugin', '--profile', 'cli', 'add', plan.codeSpec])
  if (codeCommand === undefined) {
    blockers.push('dsh-code: could not resolve the dsh command for the profile update')
  } else {
    steps.push({
      command: codeCommand.command,
      args: codeCommand.args,
      label: 'dsh plugin add',
      fatal: true,
      remedy: `dsh plugin --profile cli add ${plan.codeSpec}`,
    })
  }
  for (const pluginSpec of plan.pluginSpecs) {
```

</details>

**依据 3 · 源码核查**：[bin/deepseek.mjs:343-372](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/bin/deepseek.mjs#L343-L372)

顺序执行及fatal/非fatal失败处理。

<details>
<summary>查看原文（30行）</summary>

```text
export function runSequence(steps, spawnProcess = spawn) {
  return new Promise(resolve => {
    const failures = []
    const run = index => {
      const step = steps[index]
      if (step === undefined) {
        resolve(failures.length === 0 ? 0 : failures[failures.length - 1])
        return
      }
      const needsShell = process.platform === 'win32' && /\.(cmd|bat)$/iu.test(step.command)
      const child = spawnProcess(step.command, step.args, { stdio: 'inherit', ...(needsShell ? { shell: true } : {}) })
      const report = code => {
        if (step.remedy !== undefined) console.error(`dsh-code: to retry ${step.label} manually: ${step.remedy}`)
        failures.push(code ?? 1)
        run(index + 1)
      }
      child.once('error', error => {
        console.error(`dsh-code: ${step.label} failed: ${error.message}`)
        if (step.fatal === false) report(undefined)
        else resolve(1)
      })
      child.once('exit', code => {
        if (code === 0) run(index + 1)
        else if (step.fatal === false) report(code)
        else resolve(code ?? 1)
      })
    }
    run(0)
  })
}
```

</details>

**依据 4 · 源码核查**：[bin/deepseek.mjs:682-741](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/bin/deepseek.mjs#L682-L741)

降级/local-checkout guard及最终mounted核验。

<details>
<summary>查看原文（60行）</summary>

```text
  // A launcher installed from a GitHub release (or any source ahead of the
  // registry) must not be walked back by an apply targeting npm's older
  // latest - the downgrade guard below only covers the host line.
  const bundleRefusal = bundleDowngradeRefusal(latestCode)
  if (bundleRefusal !== undefined) {
    console.error(bundleRefusal)
    process.exitCode = 1
    return
  }
  if (!plan.lineLocked) {
    console.log('dsh-code: could not read the compatible harness line; installing @deepseek-ai/dsh@latest')
  }
  // Downgrade guard: the latest published dsh-code may still pin an older
  // harness line than the host already installed globally (a release-ordering
  // window). Installing would silently downgrade every existing session's
  // booted host, and a link-mounted profile would end up on a mismatched pair
  // with no warning — refuse instead and name the manual command.
  const installed = installedGlobalDshVersion()
  if (plan.line !== undefined && installed !== undefined && compareHarnessLines(plan.line, installed) < 0) {
    console.error(`dsh-code: dsh-code@${latestCode} needs @deepseek-ai/dsh@${plan.line}, but ${installed} is already installed globally`)
    console.error(`dsh-code: refusing to downgrade the host; to proceed anyway run: npm install -g @deepseek-ai/dsh@${plan.line} dsh-code@${latestCode}`)
    process.exitCode = 1
    return
  }
  // Local-checkout guard: a link/file-mounted profile runs the checkout's
  // own build, and this command would upgrade the global host beside it.
  // When the checkout is older than the release being installed, upgrading
  // pairs a new host with old local code — the terminal breaks on the next
  // launch. Refuse until the checkout is updated or unmounted.
  if (!plan.profileStep) {
    const refusal = localCheckoutRefusal(profileMountedVersion(), latestCode, plan.codeSpec)
    if (refusal !== undefined) {
      for (const line of refusal) console.error(line)
      process.exitCode = 1
      return
    }
  }
  const { steps, blockers } = updateSteps({ plan, npm, resolveCommand })
  if (blockers.length > 0) {
    for (const line of blockers) console.error(line)
    process.exitCode = 1
    return
  }
  if (plan.profileStep) {
    if (plan.pluginSpecs.length > 0) {
      console.log(`carrying ${plan.pluginSpecs.length} profile plugin${plan.pluginSpecs.length === 1 ? '' : 's'} to the same line: ${plan.pluginSpecs.join(', ')}`)
    }
  } else {
    console.log('cli profile mounts a local checkout; leaving the profile untouched')
  }
  const code = await runSequence(steps, spawnProcess)
  const mounted = profileMountedVersion()
  if (mounted !== undefined) console.log(`cli profile now mounts dsh-code ${mounted}`)
  if (code === 0 && plan.profileStep && mounted !== latestCode) {
    console.error(`dsh-code: the cli profile still mounts ${mounted ?? 'nothing'}; run: dsh plugin --profile cli add ${plan.codeSpec}`)
    process.exitCode = 1
    return
  }
  process.exitCode = code
}
```

</details>

**依据 5 · 源码核查**：[bin/runtime-deps.mjs:116-150](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/bin/runtime-deps.mjs#L116-L150)

真实备份/改Host package/npm install/检查与audit。

<details>
<summary>查看原文（35行）</summary>

```text
}

/** Back up the host metadata, install scoped fixes in place, then verify resolution and audit. */
export function repairRuntimeDependencies({
  root, npm, run = spawnSync, check = false,
  backupBase = join(homedir(), '.dsh', 'backups', 'runtime-deps'),
}) {
  root = realpathSync(root)
  const path = join(root, 'package.json')
  const original = manifest(path)
  const planned = securityOverridePlan(original)
  if (check) {
    const rows = inspectRuntimeDependencies(root)
    if (rows.some(row => !row.safe)) throw new Error('host dependencies need repair; run deepseek repair-deps after closing all dsh sessions')
    return { rows }
  }
  let backup
  const rows = inspectRuntimeDependencies(root)
  if (JSON.stringify(planned) !== JSON.stringify(original) || rows.some(row => !row.safe)) {
    mkdirSync(backupBase, { recursive: true, mode: 0o700 })
    backup = mkdtempSync(join(backupBase, 'host-'))
    for (const name of ['package.json', 'package-lock.json', 'npm-shrinkwrap.json']) {
      if (existsSync(join(root, name))) copyFileSync(join(root, name), join(backup, name))
    }
    console.log(`dsh-code: dependency metadata backup: ${backup}`)
    writeFileSync(path, JSON.stringify(planned, null, 2) + '\n')
    const result = run(npm.command, [...npm.args, 'install', '--prefix', root, '--omit=dev', '--package-lock=true', '--no-audit', '--no-fund'], { stdio: 'inherit', windowsHide: true })
    if (result.status !== 0) throw new Error(`dependency install failed; metadata backup: ${backup}; rerun deepseek repair-deps before starting dsh`)
  }
  const verified = freshInspection(root)
  if (verified.some(row => !row.safe)) throw new Error('dependency repair did not replace every active host dependency')
  const audit = run(npm.command, [...npm.args, 'audit', '--prefix', root, '--omit=dev', '--audit-level=low'], { stdio: 'inherit', windowsHide: true })
  if (audit.status !== 0) throw new Error('host dependency audit did not pass; inspect the audit output above')
  return { rows: verified, backup }
}
```

</details>

**依据 6 · 源码核查**：[src/settings-file.ts:31-87](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/settings-file.ts#L31-L87)

真实重试/tmp rename/进程内保存链。

<details>
<summary>查看原文（57行）</summary>

```text
 * distinct leftovers rather than corrupting a shared one.
 */
async function withTransientRetry(operation: () => Promise<void>, retries = 5): Promise<void> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await operation()
      return
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException).code
      if (attempt >= retries || (code !== 'EPERM' && code !== 'EACCES')) throw error
      await new Promise(resolve => setTimeout(resolve, 30 * (attempt + 1)))
    }
  }
}

/**
 * Write one file atomically: create the parent directory, write to a
 * uniquely named temp file, and rename it into place. A crash midway
 * can never leave a half-written document behind. Unique temp names
 * keep concurrent writers (two terminals, two chains in one process)
 * from sharing one temp path.
 */
export async function writeFileAtomically(path: string, text: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  const temp = `${path}.${process.pid}.${randomUUID()}.tmp`
  await withTransientRetry(() => writeFile(temp, text, 'utf8'))
  await withTransientRetry(() => rename(temp, path))
}

/** The serialized persistence surface; flush() is handed to the quit sequence. */
export interface UserSettingsPersistence {
  /**
   * Queue one file snapshot. Resolves when the chain reaches (and renames)
   * it; rejects only to THIS caller when its own write failed.
   */
  save(path: string, text: string): Promise<void>
  /** Wait for every queued write; safe to call repeatedly. */
  flush(): Promise<void>
}

/**
 * Create the shared settings-write chain. One instance per process keeps
 * every user-level JSON file mutually serialized.
 * @returns the persistence handle.
 */
export function createUserSettingsPersistence(): UserSettingsPersistence {
  let chain: Promise<void> = Promise.resolve()
  return {
    save(path: string, text: string): Promise<void> {
      const write = chain.then(() => writeFileAtomically(path, text))
      // A failed write must not break the chain for later saves.
      chain = write.catch(() => {})
      return write
    },
    flush(): Promise<void> {
      return chain
    },
```

</details>

**依据 7 · 源码核查**：[src/git-workflow.ts:45-67](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/git-workflow.ts#L45-L67)

实际execFile git与signal/错误。

<details>
<summary>查看原文（23行）</summary>

```text
/** Parse the intentionally small, option-safe /diff argument vocabulary. */
export function parseGitDiffSpec(argument: string): GitDiffSpec {
  const value = argument.trim()
  if (value === '') return { label: 'working tree vs HEAD', args: ['diff', '--no-ext-diff', '--no-textconv', '--unified=3', 'HEAD', '--'] }
  if (value === '--staged' || value === '--cached') {
    return { label: 'staged changes', args: ['diff', '--no-ext-diff', '--no-textconv', '--unified=3', '--cached', '--'] }
  }
  if (value.startsWith('-') || /\s/u.test(value)) throw new Error('usage: /diff [--staged|git-ref]')
  return { label: `changes since ${value}`, args: ['diff', '--no-ext-diff', '--no-textconv', '--unified=3', value, '--'] }
}

function executeGit(cwd: string, args: readonly string[], signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile('git', [...args], { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, windowsHide: true, signal }, (error, stdout, stderr) => {
      if (error !== null) {
        reject(new Error(stderr.trim() || error.message))
        return
      }
      resolve(stdout.replace(/\r\n/gu, '\n'))
    })
  })
}

```

</details>

**依据 8 · 源码核查**：[src/git-workflow.ts:150-161](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/git-workflow.ts#L150-L161)

review提示与截断不等强制权限。

<details>
<summary>查看原文（12行）</summary>

````text
export function buildReviewPrompt(diff: string, label: string, note?: string, maxChars = 200_000): string {
  const truncated = diff.length > maxChars
  const body = truncated ? diff.slice(0, maxChars) : diff
  return [
    'Review the following Git changes. Do not modify files or run write operations.',
    'Lead with concrete bugs, regressions, security risks, and missing tests, ordered by severity.',
    'Tag every finding [P0]-[P3] (P0 drop everything · P1 urgent · P2 normal · P3 nice to have) and anchor it to file paths with line ranges from the diff; only report defects this change introduced, and prefer reporting nothing over speculation.',
    `Scope: ${label}${truncated ? ' (diff truncated by CLI — later files are not visible)' : ''}`,
    ...(note === undefined || note.trim() === '' ? [] : [`User note: ${note.trim()}`]),
    '',
    '```diff',
    body,
````

</details>

#### 缺口

- 安装供应链、全部升级/回滚路径、停电/跨进程设置和review完整结果未测。
  **影响**：只能说有失败guard/提示，不能说更新原子或提示保证只读。
  **进一步探讨**：备份可丢弃profile/全局环境，比较更新每步版本与恢复成本；本轮不执行。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 值得采用到什么范围，新方向应如何证伪？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议受限试用：熟悉DSH权限与模型费用的终端开发者，用低敏可丢弃仓库/低权限preset先核输入、审批、队列取消与恢复，不默认带真实凭据/生产仓库。相比官方CLI/Web和既有终端Agent，本包提供一致终端交互、会话队列/模型配置和生命周期接线，但未证明净编码成功率、节时或更强安全。

首次Node/Host/模型配置与版本对齐、持续模型tokens/工具/磁盘/人工审代码，失败持久化/更新混线恢复与退出凭据/会话留存的现金工时未知，不填0；本包无独立模型费封顶，token显示不是账单。普通UI集中不算任务分工/新触达/经济创新；可导出日志/会话为交付便利而非验收证明。

独立假设：给退出和升级形成可核的分步结果收据，把已flush/失败/安装版本与副作用恢复责任显式呈现，可能比继续增加终端主题更降低“退出0就安全/更新成功就对齐”的误判。先比现有stderr+人工计划、小修退出码与手工版本核验；固定flush拒绝、profile挂载失败、保留队列取消及部分删除样例，测误判/恢复人时/总成本。若现有提示足够或新机制负担更高则否定，不算当前实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/runner/quit.ts:29-53](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/runner/quit.ts#L29-L53)

当前退出0/错误传播边界。

<details>
<summary>查看原文（25行）</summary>

```text
export async function runQuitSequence(
  steps: readonly QuitCleanupStep[],
  exit: (code: number) => void,
  onError?: (name: string, error: unknown) => void,
): Promise<readonly string[]> {
  const started: string[] = []
  for (const step of steps) {
    started.push(step.name)
    try {
      await step.run()
    } catch (error) {
      try {
        onError?.(step.name, error)
      } catch {
        // The failure sink must never abort the cleanup sequence.
      }
    }
  }
  try {
    exit(0)
  } catch {
    // The exit request itself must not become an unhandled rejection.
  }
  return started
}
```

</details>

**依据 2 · 源码核查**：[bin/deepseek.mjs:728-741](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/bin/deepseek.mjs#L728-L741)

实际更新后核mounted与退出码。

<details>
<summary>查看原文（14行）</summary>

```text
    }
  } else {
    console.log('cli profile mounts a local checkout; leaving the profile untouched')
  }
  const code = await runSequence(steps, spawnProcess)
  const mounted = profileMountedVersion()
  if (mounted !== undefined) console.log(`cli profile now mounts dsh-code ${mounted}`)
  if (code === 0 && plan.profileStep && mounted !== latestCode) {
    console.error(`dsh-code: the cli profile still mounts ${mounted ?? 'nothing'}; run: dsh plugin --profile cli add ${plan.codeSpec}`)
    process.exitCode = 1
    return
  }
  process.exitCode = code
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1588-1598](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/index.ts#L1588-L1598)

实际导出写入文件。

<details>
<summary>查看原文（11行）</summary>

```text
      ? join(sessionCwd, defaultName)
      : /^[a-zA-Z]:[\\/]/u.test(wanted) || wanted.startsWith('/')
        ? wanted
        : join(sessionCwd, wanted)
    const markdown = buildExportMarkdown(store.getView(), session.id)
    try {
      await writeFileAsync(target, `${markdown}\n`, 'utf8')
      bridge.notify(t('notice.exported', { path: target }))
    } catch (error: unknown) {
      bridge.notify(t('notice.exportFailed', { message: error instanceof Error ? error.message : String(error) }), 'error')
    }
```

</details>

**依据 4 · 源码核查**：[src/runner/submissions.ts:105-110](https://github.com/UNLINEARITY/dsh-code/blob/4c280cffba92a42000786e5d9a8d4cc5e8261fa5/src/runner/submissions.ts#L105-L110)

取消后队列仍会运行。

```text
export function cancelPreservingQueue(agent: Pick<Agent, 'inbox' | 'cancel' | 'followup'>): number {
  const queued = [...agent.inbox.nextTurn]
  agent.cancel({ kind: 'user' })
  for (const message of queued) agent.followup(message)
  return queued.length
}
```

#### 缺口

- 真实持续需求、对照编码质量/总时间、模型费用和新收据净价值未知。
  **影响**：不推荐生产/多用户/敏感自主执行。
  **进一步探讨**：固定低敏任务对照官方CLI/Web与现有提示，失败样例成本抵消便利即退出。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
