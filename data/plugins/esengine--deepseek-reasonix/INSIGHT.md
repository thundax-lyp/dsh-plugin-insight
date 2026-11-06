# DeepSeek Reasonix

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[53ca70d](https://github.com/esengine/DeepSeek-Reasonix/tree/53ca70d347b5aaabe867f355090d32ff12188523)

<!-- BEGIN META -->
[![GitHub ★ 36,089](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C089&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/esengine/DeepSeek-Reasonix)
<!-- END META -->

> **功能**：独立多前端编码Agent，通过模型工具循环改文件/验证；另有DSH ACP配置包。

> **亮点**：[Q02](#research-q02)实际自主工具执行与配对反馈；[Q04](#research-q04)预算观测/有限文件会话恢复，多入口统一而非新模型。

> **主要限制**：[Q03](#research-q03)普通Gate不能外推!直输或信任MCP/扩展，外部caller来源未核；[Q04](#research-q04)预算非支付硬预授权、rewind不撤shell/外部效果。

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
  - [Q01 · 根Reasonix与DSH配置包是什么关系，谁能用它完成什么？](#detail-section-11)
  - [Q02 · 普通ACP提示怎样走真实模型与工具循环？](#detail-section-12)
  - [Q03 · 普通权限Gate能覆盖!输入和自动委派吗？](#detail-section-13)
  - [Q04 · 预算、取消和rewind实际恢复什么？](#detail-section-14)
  - [Q05 · 具体怎么试用，首次到退出的代价是什么？](#detail-section-15)
  - [Q06 · 应验证什么授权适配，而非再叠编排？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根DeepSeek Reasonix是独立编码Agent/Studio/CLI，提供终端、桌面、Web和ACP编辑器接入；本条身份为root工具，不能将integrations/dsh-plugin的0.1.0当根版本或称整仓DSH原生插件。README区分Studio2.x开发线和npm1.x维护线，根构建有Go1.26/toolchain要求；固定Git源码不等当前发布包/宿主安装通过。

人工复制AI建议/IDE改测或已有编码Agent；模型/OS工具能力已有。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| Agent循环 | 读改测/继续决策 | 质量仍人验 |
| 普通Gate | 工具权限 | MCP/扩展/!分支不同 |
| ACP配置 | DSH子Agent入口 | caller来源/版本另核 |
| 预算/取消 | 控循环/请求停止 | 非硬支付/效果回滚 |
| rewind | 覆盖文件/会话 | 不撤shell/外部动作 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| 根Reasonix成品/模型与Key | 模型任务必需 | 真循环 | 模型接收代码/按服务付费 |
| Go1.26/toolchain | 源构建 | 编译runtime | 配置包不含二进制 |
| 低权副本/VCS/明确权限 | 采用前提 | 控副作用/人审 | rewind不撤shell |
| DSH+ACP provider固定版本 | 委派另需 | 跨端子Agent | caller来源未核不自动委派 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 副本/备份/模型及权限额度 | 不带生产密钥 |
| 输入 | 人类普通任务，不用! | 不把委派当人类shell |
| 执行 | 读工具/测试结果与diff | 模型答完成非验收 |
| 故障 | 查停止/文件/外部效果 | 不盲重跑命令 |
| 恢复退出 | 预览rewind覆盖/冲突/VCS | 关会话/凭据，外部人工核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/机器/隔离未知 | 版本/权限/备份 | root与配置包分开 |
| 持续 | token/重试/工具未知 | diff/测试/审批 | 轮数非费用封顶 |
| 故障 | 外部操作/重试未知 | 查进程/文件/远端 | 取消非回滚 |
| 退出 | 会话/Key/快照留存未知 | VCS/rewind预览和清理 | 只恢复覆盖范围 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 编码循环 | 真Stream/Execute/配对结果 | 合格率/净节时 |
| 权限 | 普通Gate/来源分支存在 | 跨端输入和全工具安全 |
| 预算 | usage/价格与轴条件 | 未知费用/支付硬上限 |
| 恢复 | 文件rename/会话持久路径 | 实际补偿/外部恢复 |

> **思考**：[Q03](#research-q03)普通Gate不能外推!直输或信任MCP/扩展，外部caller来源未核；[Q04](#research-q04)预算非支付硬预授权、rewind不撤shell/外部效果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)实际自主工具执行与配对反馈；[Q04](#research-q04)预算观测/有限文件会话恢复，多入口统一而非新模型。

[Q02](#research-q02)干净采样与按ID配对回流；[Q03](#research-q03)来源和权限入口不能混同；[Q04](#research-q04)发布intent/rename补偿及coverage提示可借鉴但非外部事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)普通Gate不能外推!直输或信任MCP/扩展，外部caller来源未核；[Q04](#research-q04)预算非支付硬预授权、rewind不撤shell/外部效果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)低权副本/人类普通输入小改并人工验；外部caller/来源未核不启自动委派，状态不明回IDE/VCS。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持独立Agent真实循环及有限恢复；低权副本人类小任务受限试用，外部ACP caller未核不推荐自动委派。

- 已检查：作者 README、包清单、源码路径 LICENSE、README.md、go.mod、integrations/dsh-plugin/README.md、integrations/dsh-plugin/cordis.patch.yml、integrations/dsh-plugin/package.json、internal/frontend/acp/prompt_attachments.go、internal/frontend/acp/session.go、internal/frontend/acp/shell_prompt.go、internal/runtime/agent/execute_batch.go、internal/runtime/agent/execute_one.go、internal/runtime/agent/run_budget.go、internal/runtime/agent/run_loop.go、internal/runtime/agent/sampling_request.go、internal/session/control/rewind.go、internal/session/control/shell.go、internal/state/checkpoint/transaction.go、internal/tools/shellrun/runner.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧12findings重新核查；固定Git Go原件核ACP普通/!输入、Agent采样/工具/权限/结果、预算观测和checkpoint文件发布/会话恢复；未全审2737文件、全部工具/OS沙箱/网络/进程树/前端；未重用旧DSH caller作为当前依赖验收。
- 下一步：只读固定源码，不运行Go/Reasonix/模型/Host/命令/测试或浏览器；无独立任务/安全/费用/恢复或DSH互操作验证。

**分析版本**

- **仓库**：[esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix)
- **版本号**：未声明（[固定提交 53ca70d](https://github.com/esengine/DeepSeek-Reasonix/tree/53ca70d347b5aaabe867f355090d32ff12188523)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)人类/委派输入分型与副作用回执，先和禁bash/隔离最小替代对照，不算当前能力。

只读固定源码，不运行Go/Reasonix/模型/Host/命令/测试或浏览器；无独立任务/安全/费用/恢复或DSH互操作验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 492 | 38092 | — | — | 478977 |
| .js | source | 66 | 6330 | 5064 | 837 | — |
| .js | test | 23 | 2842 | 2404 | 247 | — |
| .mjs | test | 29 | 7918 | 7115 | 258 | — |
| .tsx | source | 446 | 49445 | 43157 | 3884 | — |
| .ts | source | 523 | 54774 | 45035 | 6173 | — |
| .mjs | source | 213 | 21262 | 17946 | 2284 | — |
| .cjs | source | 3 | 301 | 291 | 4 | — |
| .jsx | source | 1 | 24 | 22 | 0 | — |
| .ts | test | 247 | 19073 | 15803 | 1303 | — |
| .tsx | test | 664 | 70607 | 62647 | 1926 | — |
| .md | example | 30 | 1789 | — | — | 10765 |

</details>

**活跃度**

[![Issue 未关闭 625](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=625&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,024](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C024&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：重核根ACP/Agent真实执行、不同来源权限、预算和有限恢复，不将配置包等同安全委派验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根Reasonix与DSH配置包是什么关系，谁能用它完成什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根DeepSeek Reasonix是独立编码Agent/Studio/CLI，提供终端、桌面、Web和ACP编辑器接入；本条身份为root工具，不能将integrations/dsh-plugin的0.1.0当根版本或称整仓DSH原生插件。README区分Studio2.x开发线和npm1.x维护线，根构建有Go1.26/toolchain要求；固定Git源码不等当前发布包/宿主安装通过。

目标是能审代码的人在可恢复项目描述小任务，让Agent读取、改文件并执行验证，再由人接手验收。基线为人工复制模型建议/IDE手动改测，或已有编码Agent。贡献是模型↔真实工具↔会话反馈和多前端统一，不是新推理模型；模型服务接收代码、凭据/费用由使用者配置。DSH子目录只是配置：启动reasonix acp并接官方provider，固定dsh/provider0.2.1-rc.2和permission:reject，根工具/模型Key仍需另装配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:44-76](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/README.md#L44-L76)

作者独立编码Agent/模型接收代码与文件恢复边界。

<details>
<summary>查看原文（33行）</summary>

```text
<br/>

<p align="center"><strong>Open source · MIT · runs on your computer, model of your choice</strong></p>
<h3 align="center">An open-source coding agent for your terminal, desktop, browser and editor.</h3>
<p align="center">It reads your project, edits files and runs commands and tests. Have it ask before each step, or work on its own within limits you set. Files its edit tools changed can be rewound. New here? Start with the Studio desktop app.</p>
<p align="center">Maintained by <strong>Huahui Yu</strong>.</p>

> [!IMPORTANT]
> **Community · 加入社区** — bilingual Discord for setup help (`#help` / `#求助`), workflow showcases, and feature ideas. → **<https://discord.gg/XF78rEME2D>**
>
> QQ group **DeepSeek-Reasonix官方群** (`1093562660`) → **<https://qm.qq.com/q/i59b0z2R8s>** ([QR code](./docs/assets/qq-group.svg))

> Douyin: **做游戏的小鱼** (Douyin ID `22703872788`) · [QR code](./docs/assets/douyin.png)

<br/>

## ❤️Sponsor

<table><tr><td width="180" align="center" valign="middle"><a href="https://www.rightapi.ai/register?aff=e083bf73" target="_blank" rel="sponsored noopener noreferrer"><img src="./.github/sponsor/rightcode.png" alt="Right Code" width="64"></a></td><td valign="middle">Thanks to Right Code for sponsoring this project! Right Code reliably provides routing services for models such as Claude Code, Codex, and Gemini, with both pay-as-you-go and monthly subscription billing options available. Invoices are available upon top-up, and enterprise and team users can receive dedicated one-on-one support. Register via <a href="https://www.rightapi.ai/register?aff=e083bf73" target="_blank" rel="sponsored noopener noreferrer">this link</a>.</td></tr><tr><td width="180" align="center" valign="middle"><a href="https://www.packyapi.ai/register?aff=rIbQ" target="_blank" rel="sponsored noopener noreferrer"><picture><source media="(prefers-color-scheme: dark)" srcset="./.github/sponsor/packycode-dark.svg"><img src="./.github/sponsor/packycode-light.svg" alt="PackyCode" width="80"></picture></a></td><td valign="middle">Thanks to PackyCode for sponsoring this project! Access leading AI models through PackyCode with one API endpoint and one API key, with automatic failover and dedicated high-speed routes for Codex and Claude Code. Register via <a href="https://www.packyapi.ai/register?aff=rIbQ" target="_blank" rel="sponsored noopener noreferrer">this link</a>.</td></tr></table>

## What it is

Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.

## 30-second start
```

</details>

**依据 2 · 作者声明**：[README.md:110-122](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/README.md#L110-L122)

作者Studio2.x与npm1.x分支/发布界限。

<details>
<summary>查看原文（13行）</summary>

```text
| Line | Branch | Status | Get it |
| --- | --- | --- | --- |
| **Reasonix 2.x** | `studio` (this branch) | Active development | [Studio releases](https://github.com/esengine/DeepSeek-Reasonix/releases?q=studio-v&expanded=true) |
| **Reasonix 1.x** | [`main-v2`](https://github.com/esengine/DeepSeek-Reasonix/tree/main-v2) | Maintenance / stable | `npm i -g reasonix` · [desktop download](https://reasonix.io/?download=desktop#start) |

- **Want something stable?** Stay on 1.x. It keeps receiving bug fixes,
  provider/API compatibility, updater and security fixes; its core architecture
  is no longer being extended.
- **Want the new architecture?** Use 2.x Reasonix Studio. It is still moving
  quickly; reports are welcome.

Valuable fixes, tests and behaviour from 1.x are reviewed one by one and ported
or reimplemented on 2.x where they fit the new architecture.
```

</details>

**依据 3 · 源码核查**：[go.mod:1-5](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/go.mod#L1-L5)

实际根Go/toolchain条件。

```text
module reasonix

go 1.26.0

toolchain go1.26.10
```

**依据 4 · 源码核查**：[LICENSE:1-5](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/LICENSE#L1-L5)

根MIT许可。

```text
MIT License

Copyright (c) 2026 Reasonix Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
```

**依据 5 · 源码核查**：[integrations/dsh-plugin/package.json:1-36](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/package.json#L1-L36)

独立配置包身份0.1.0/固定宿主provider/private。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "dsh-plugin-reasonix",
  "version": "0.1.0",
  "description": "Use Reasonix as a subagent in DeepSeek Harness (dsh) through its ACP provider. Configuration only, no code.",
  "homepage": "https://reasonix.io",
  "author": "Reasonix",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "reasonix",
    "acp",
    "subagent"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/esengine/DeepSeek-Reasonix.git",
    "directory": "integrations/dsh-plugin"
  },
  "files": [
    "cordis.patch.yml",
    "README.md"
  ],
  "engines": {
    "dsh": "0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/dsh-subagent-acp": "0.2.1-rc.2"
  },
  "private": true
}
```

</details>

**依据 6 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

实际ACP启动/拒绝审批配置。

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    - id: subagent-acp-reasonix
      name: '@deepseek-ai/dsh-subagent-acp'
      config:
        providerName: reasonix
        command: reasonix
        args: ['acp']
        permission: reject
    - id: tool-subagent-reasonix
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: reasonix
        toolName: reasonix
        maxDepth: provider-managed
```

</details>

**依据 7 · 作者声明**：[integrations/dsh-plugin/README.md:14-18](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/README.md#L14-L18)

作者单机工具/Key前置。

```text
Use [Reasonix](../../README.md) as a subagent in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`). The package is configuration only: one patch layer that points Harness's `subagent-acp` provider at `reasonix acp` and exposes it to the model as a `reasonix` tool. It contains no code.

## Before you install

1. Install Reasonix and run `reasonix setup` once on the same machine. Reasonix reads its provider key from its own home, not from environment variables, so Harness cannot pass one.
```

#### 缺口

- 当前根成品、模型/平台和DSH调用端组合未运行。
  **影响**：不能将配置可见当根runtime或ACP互操作已验。
  **进一步探讨**：隔离副本核实际双方版本/模型，先人类直输小任务，不启自动委派。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 普通ACP提示怎样走真实模型与工具循环？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

session/prompt解析session与prompt文本，建立每轮cancel context、拒同时活跃prompt，然后runPrompt；无!前缀走controller.RunTurnWithRaw。主runToolLoop准备schema/采样恢复，streamProviderRequest实际prov.Stream；只有clean terminal的工具调用提交assistant消息，才进入handleToolRound→executeBatch→executeOne。工具执行最终调用DetailedExecutor/普通runTool.Execute，不是仅生成计划。

handleToolRound把每个结果按call.ID放RoleTool消息并Add回conversation，取消时也先保配对结果；循环再采样/最终答复。executeOne在真实执行前有工具解析/扩展钩子/策略，再执行及mutation/资源结算。该证据说明能自治工具调用并继续决策，与纯流程/RAG不同，但不证明项目任务做对、测试充分或所有MCP/工具安全。本文核代表Go主链，不跑模型/文件操作。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/session.go:349-393](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/frontend/acp/session.go#L349-L393)

真实prompt/session/cancel单轮入口。

<details>
<summary>查看原文（45行）</summary>

```text
// sessionPrompt runs one turn. It flattens the prompt blocks to text and runs the
// session's controller synchronously under a per-turn cancelable context (so
// session/cancel can stop it), then reports why the turn ended. The controller
// streams the turn's events to the session's sink as it runs.
func (s *service) sessionPrompt(ctx context.Context, raw json.RawMessage) (any, error) {
	var p SessionPromptParams
	if err := json.Unmarshal(raw, &p); err != nil {
		return nil, &RPCError{Code: ErrInvalidParams, Message: "session/prompt: " + err.Error()}
	}
	sess := s.session(p.SessionID)
	if sess == nil {
		return nil, &RPCError{Code: ErrInvalidParams, Message: "session/prompt: unknown session " + p.SessionID}
	}
	text, err := promptText(sess.cwd, p.Prompt)
	if err != nil {
		return nil, &RPCError{Code: ErrInvalidParams, Message: "session/prompt: " + err.Error()}
	}
	if text == "" {
		return nil, &RPCError{Code: ErrInvalidParams, Message: "session/prompt: empty prompt"}
	}
	rawText := text
	text, invokedSkill := s.resolveSlashPrompt(ctx, sess, text)

	runCtx, cancel, ok := sess.begin(ctx)
	if !ok {
		return nil, &RPCError{Code: ErrInvalidRequest, Message: "session/prompt: session already has an active prompt"}
	}
	if sess.status == nil {
		sess.status = newStatusTelemetry()
	}
	sess.status.beginTurn()
	s.publishStatus(sess, "phase")
	sess.sink.setTurnContext(runCtx)
	if sess.takeGoalDraftMode() {
		sess.currentCtrl().SetGoal(text)
		sess.saveMetaIfPresent()
	}
	defer func() {
		sess.sink.clearTurnContext()
		s.finishTurn(ctx, sess)
		cancel()
	}()
	runErr := drainACPInbox(runCtx, sess.ctrl, runPrompt(runCtx, sess.ctrl, text, rawText, invokedSkill))

	statusEvent := sess.status.finishTurn(
```

</details>

**依据 2 · 源码核查**：[internal/frontend/acp/shell_prompt.go:13-31](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/frontend/acp/shell_prompt.go#L13-L31)

无!走普通RunTurnWithRaw。

<details>
<summary>查看原文（19行）</summary>

```text
// runPrompt runs one prompt: a `!` line is the user's own shell command, run
// as typed and streamed back as a tool call before the model answers it;
// anything else is a model turn.
// The editor is a frontend in the kernel's process, so it holds that grant.
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
	for ctrl.Running() {
		select {
		case <-ctx.Done():
			ctrl.Cancel()
			return ctx.Err()
		case <-tick.C:
		}
```

</details>

**依据 3 · 源码核查**：[internal/runtime/agent/sampling_request.go:30-32](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/sampling_request.go#L30-L32)

实际模型provider.Stream。

```text
func (a *Agent) streamProviderRequest(ctx context.Context, req provider.Request) (<-chan provider.Chunk, error) {
	return a.svc.prov.Stream(ctx, req)
}
```

**依据 4 · 源码核查**：[internal/runtime/agent/run_loop.go:224-269](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_loop.go#L224-L269)

采样/usage/干净assistant提交。

<details>
<summary>查看原文（46行）</summary>

```text
		authority := a.plan().State() // before sampling: a mid-round move cannot admit this
		streamed := a.streamWithSamplingRecovery(ctx, step+1)
		text, reasoning, signature, calls, responsesItems, usage := streamed.text, streamed.reasoning, streamed.signature, streamed.calls, streamed.responsesItems, streamed.usage
		partialCalls, err := streamed.partialCalls, streamed.err
		prefixShape.BodyChain = streamed.bodyChain // what actually went out
		cacheDiagnostics := CompareShape(prevPrefixShape, prefixShape, usage, contentReasons)
		if err != nil {
			quote := a.emitTurnUsage(usage, &cacheDiagnostics, streamed.attemptID)
			a.observeRunBudget(state, usage, quote)
			if msg, ok := finishReasonMessage(usage); ok {
				a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelWarn, Text: msg})
			}
			// Exhausted stream retries (or a non-retryable error): persist one
			// bounded LocalOnly recovery record for the next real user message.
			// Intermediate failed attempts never wrote session state.
			a.recordInterruptedDisplay(text, reasoning, partialCalls, true, state.workDurationMs(), provider.StreamFailureCauseOf(err))
			return err
		}
		a.sess.lastPrefixShape = prefixShape
		a.sess.haveLastPrefixShape = true
		quote := a.emitTurnUsage(usage, &cacheDiagnostics, streamed.attemptID)
		a.observeRunBudget(state, usage, quote)
		// Classify the terminal before anything commits: a call the output limit
		// cut in half must reach neither history nor execution, and why it did
		// not is the host's to state, not the model's to infer.
		boundary := classifyResponseBoundary(usage, calls)
		calls = a.prepareCallBatch(boundary.committed)
		if msg, ok := finishReasonMessage(usage); ok {
			a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelWarn, Text: msg, Detail: boundary.noticeDetail()})
		}

		// Commit boundary: only a clean terminal attempt reaches here.
		// Keep reasoning_content on the assistant turn for display and session
		// archive. Most OpenAI-compatible backends do not replay it; providers
		// with an explicit round-trip contract retain the raw provider text.
		workMs, committed := state.workDurationMs(), a.callsToCommit(streamed, calls)
		a.sess.conversation.Add(provider.Message{
			Role:               provider.RoleAssistant,
			Content:            text,
			ReasoningContent:   reasoning,
			ReasoningSignature: signature,
			ReasoningID:        streamed.reasoningID,
			ReasoningStatus:    streamed.reasoningStatus,
			ToolCalls:          committed,
			ResponsesItems:     responsesItems,
			WorkDurationMs:     workMs,
```

</details>

**依据 5 · 源码核查**：[internal/runtime/agent/run_loop.go:289-307](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_loop.go#L289-L307)

只有已提交调用进入工具轮并继续循环。

<details>
<summary>查看原文（19行）</summary>

```text
				return ferr
			}
			continue
		}

		// Invariant: executeBatch only ever receives tool calls from a
		// committed sampling attempt (clean terminal + response intercept).
		cont, terr := a.handleToolRound(planmode.WithAuthority(ctx, authority), state, step, text, reasoning, calls, usage)
		if cont {
			// After the tool results, never between them and their call: the
			// provider requires an unbroken assistant/tool pairing.
			a.recordTruncationFact(boundary)
		}
		if !cont {
			return terr
		}
	}
	// Only reached when a positive maxSteps guard is configured. The work so far
	// is already in the session, so the user can just send another message to pick
```

</details>

**依据 6 · 源码核查**：[internal/runtime/agent/run_loop.go:489-551](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_loop.go#L489-L551)

实际batch、按id写RoleTool结果/取消先配对。

<details>
<summary>查看原文（63行）</summary>

```text
func (a *Agent) handleToolRound(ctx context.Context, state *turnRuntime, step int, text, reasoning string, calls []provider.ToolCall, usage *provider.Usage) (cont bool, err error) {
	state.emptyFinalBlocks = 0
	state.usedAnyTool = true
	unavailableContextTools := a.unavailableContextualToolCalls(ctx, calls)
	if len(unavailableContextTools) > 0 && state.contextToolRepairs > 0 {
		msg := fmt.Sprintf("blocked: context-unavailable tools were called again after the repair instruction: %s", strings.Join(unavailableContextTools, ", "))
		for _, call := range calls {
			a.sess.conversation.Add(provider.Message{Role: provider.RoleTool, Content: msg, ToolCallID: call.ID, Name: call.Name})
		}
		if hasVisibleFinalAnswer(text) {
			return a.handleFinalResponse(ctx, state, text, reasoning, usage)
		}
		if len(unavailableContextTools) == 1 && unavailableContextTools[0] == "update_goal" {
			return false, fmt.Errorf("model repeatedly called update_goal outside Goal mode without a visible answer")
		}
		return false, fmt.Errorf("model repeatedly called context-unavailable tools without a visible answer: %s", strings.Join(unavailableContextTools, ", "))
	}

	if boundaryErr, stop := a.stopUnexecutedBoundaryCalls(ctx, state, calls, usage); stop {
		return false, boundaryErr
	}

	mark := a.markProgressRound()
	batch := a.executeBatch(ctx, state, calls)
	results, images := batch.results, batch.images
	flagged := a.screenExternal(ctx, calls, batch)
	for i, call := range calls {
		msg := provider.Message{
			Role:       provider.RoleTool,
			Content:    results[i],
			Images:     images[i],
			Videos:     batch.videos[i],
			ToolCallID: call.ID,
			Name:       call.Name,
		}
		// The host labels content from outside the workspace here, once, and never rewrites it.
		if i < len(batch.outcomes) {
			a.task.origins.note(batch.outcomes[i].provenance, results[i])
			head := tool.ProvenanceHeader(batch.outcomes[i].provenance)
			if flagged[i] {
				head += suspectedInjectionLine
			}
			msg.Content = head + msg.Content
		}
		// First-visible Content is always the bounded form in results[i].
		// Full originals ride on RawContent only when truncation applied.
		if i < len(batch.outcomes) && batch.outcomes[i].rawOutput != "" && batch.outcomes[i].rawOutput != results[i] {
			msg.RawContent = batch.outcomes[i].rawOutput
		}
		if i < len(batch.executions) {
			msg.ToolExecution = toProviderToolExecution(batch.executions[i])
		}
		if i < len(batch.outcomes) {
			if o := batch.outcomes[i]; o.errMsg != "" || o.blocked || o.refusalCode != "" {
				msg.ToolFailure = &provider.ToolFailure{RefusalCode: o.refusalCode, Blocked: o.blocked}
			}
		}
		a.sess.conversation.Add(msg)
	}
	// If the context was cancelled during tool execution, return after storing
	// the batch results so the session keeps paired tool-call history.
	if ctx.Err() != nil {
		a.recordInterruptedDisplay("", "", nil, true, state.workDurationMs(), "")
```

</details>

**依据 7 · 源码核查**：[internal/runtime/agent/execute_batch.go:184-209](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/execute_batch.go#L184-L209)

真实executeOne/结果映射。

<details>
<summary>查看原文（26行）</summary>

```text
			durations[i] = time.Since(start).Milliseconds()
			results[i] = output
			return
		}
		outcomes[i] = a.executeOne(ctx, turn, calls[i])
		if p := outcomes[i].preview; p != nil {
			calls[i].Diff, calls[i].Added, calls[i].Removed = p.Diff, p.Added, p.Removed
		}
		if outcomes[i].executed {
			surfaceWriters[i] = outcomes[i].workspaceMutation != nil
		}
		if outcomes[i].resolved {
			readOnly := outcomes[i].resolvedReadOnly
			calls[i].ResolvedName = outcomes[i].resolvedName
			calls[i].CapabilityID = outcomes[i].capabilityID
			calls[i].ResolvedReadOnly = &readOnly
			surfaceWriters[i] = !readOnly
		}
		if calls[i].Name == "complete_step" && outcomes[i].errMsg == "" {
			completedStepInBatch = true
		}
		durations[i] = time.Since(start).Milliseconds()
		results[i] = outcomes[i].output
	}
	finalize := func(i int) {
		if calls[i].ResolvedReadOnly != nil {
```

</details>

**依据 8 · 源码核查**：[internal/runtime/agent/execute_one.go:142-173](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/execute_one.go#L142-L173)

解析/钩子/策略入口。

<details>
<summary>查看原文（32行）</summary>

```text
	defer func() { out.preview = plan.preview }()

	if blocked, early := a.parseToolCall(ctx, plan); early {
		return blocked
	}
	// tool.before: extensions rule on the parsed call before any policy or
	// permission check; a valid replacement is re-parsed for every later stage.
	a.noteOriginMatch(plan)
	if blocked, early := a.interceptToolBefore(ctx, plan); early {
		return blocked
	}
	if blocked, early := a.rejectStaleAuthority(ctx); early {
		return blocked
	}
	// Read after tool.before: an extension may have substituted the call, and the
	// batch scan judged the one the model wrote.
	defer func() {
		out.endsRound = out.endsRound || tool.IsDecisionBarrierCall(plan.tool, json.RawMessage(plan.call.ExecutionArguments())) || tool.IsDecisionBarrier(plan.execTool)
	}()
	if blocked, early := a.refuseNetworkToolPaths(plan); early {
		return blocked
	}
	if blocked, early := a.resolveToolPolicy(ctx, turn, plan); early {
		return blocked
	}
	if blocked, early := a.prepareToolExecution(ctx, plan); early {
		return blocked
	}
	return a.finishToolExecution(ctx, plan)
}

// parseToolCall resolves the canonical tool, rejects ambiguity/unknown tools,
```

</details>

**依据 9 · 源码核查**：[internal/runtime/agent/execute_one.go:682-710](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/execute_one.go#L682-L710)

实际finish执行调用executeStoppable并记录后果。

<details>
<summary>查看原文（29行）</summary>

```text
	if a.svc.hooks != nil && call.Name == "task" && !isBackgroundTaskCall(call.ExecutionArguments()) {
		a.svc.hooks.SubagentStart(ctx, call.ID, json.RawMessage(call.ExecutionArguments()))
		// Stop answers every exit after Start, including a cancelled turn, whose
		// ctx would otherwise kill the hook before it runs.
		defer func() { a.svc.hooks.SubagentStop(context.WithoutCancel(ctx), call.ID, result, err) }()
	}
	result, media, execution, err = a.executeStoppable(ctx, cctx, plan)
	// tool.after: extensions rule on the executed result (success or error)
	// before evidence, hooks, and recovery observation, so every downstream
	// consumer sees the final (possibly replaced) outcome.
	plan.ranClean = err == nil
	result, err = a.interceptToolAfter(ctx, call, result, err)
	// A tool that refused its own call never ran: report it like the permission
	// and plan-mode blocks above rather than as an execution failure.
	if msg, refused := tool.BlockedMessage(err); refused {
		return a.blockedToolOutcome(plan, msg)
	}
	err = usecap.WithContractHint(err, runTool, runArgs)
	origin := plan.provenanceOf(runTool, runArgs)
	tool.NoteProvenance(ctx, origin)
	a.recordToolReceipts(ctx, plan, result, execution, err)
	// Track skill/capability outcomes for Delivery gates.
	a.noteCapabilityInvocation(plan.canonicalName, json.RawMessage(call.ExecutionArguments()), runTool, err)
	a.notifyToolHooks(ctx, permName, permArgs, result, err)
	// Always re-read after post hooks — partial writes and hook side effects can
	// change the previewed path even when the concrete tool returned an error.
	checkpointErr := a.observeAfterMutation(plan)
	plan.mutationAfterDone = true
	if a.svc.recoveryGate != nil {
```

</details>

**依据 10 · 源码核查**：[internal/runtime/agent/execute_one.go:743-775](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/execute_one.go#L743-L775)

真正ExecuteDetailed/Execute及停止上下文。

<details>
<summary>查看原文（33行）</summary>

```text
// executeStoppable runs the call under a context CancelToolCall can end alone.
func (a *Agent) executeStoppable(turn, cctx context.Context, plan *toolCallPlan) (result string, media toolMedia, execution *tool.ShellExecution, err error) {
	runTool, runArgs := plan.runTool, plan.runArgs
	cctx, endCall := a.stops.begin(cctx, plan.call.ID)
	defer endCall()
	if de, ok := runTool.(tool.DetailedExecutor); ok {
		var detailed tool.DetailedResult
		detailed, err = de.ExecuteDetailed(cctx, runArgs)
		result, media.images, execution = detailed.Output, detailed.Images, detailed.Execution
		// Annotate verification outcome when the host classified this call as a
		// verifier. The exit status answers for the whole command, so it is a
		// verdict about the verifier only when no later stage can decide it.
		if execution != nil && plan.verification {
			execution.Verification = shellVerificationVerdict(bashCommandFromArgs(plan.evidenceArgs),
				bashDeclaredCheck(plan.evidenceArgs) != "", execution.PipeStatus, err)
			result = shellVerificationNotice(result, execution)
		} else if execution != nil && execution.Verification == "" {
			execution.Verification = tool.ShellVerificationNotVerification
		}
		annotateShellSubject(execution, runArgs)
		// Sole opaque inline interpreters are allowed outside Delivery but cannot
		// prove mutation completeness.
		if execution != nil && evidence.BashCommandMayBeOpaqueMutation(runArgs) &&
			execution.MutationRisk == tool.ShellMutationMayHaveCompleted {
			execution.MutationRisk = tool.ShellMutationUnknown
		}
	} else if run, ok := mediaTool(runTool); ok {
		result, media, err = run(cctx, runArgs)
	} else {
		result, err = runTool.Execute(cctx, runArgs)
	}
	return result, media, execution, stoppedByUser(turn, cctx, err)
}
```

</details>

#### 缺口

- 同任务正确率、工具验证、净节时与实际模型异常未测试，也没有独立验证。
  **影响**：可执行循环不等交付合格或节时。
  **进一步探讨**：可丢弃代码仓库做一项有确定验收的小改，逐项读diff/验证输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 普通权限Gate能覆盖!输入和自动委派吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

普通executeOne有Recovery/Permission、installed MCP授权快路径和扩展信任契约：已授权安装MCP可跳普通Ask/Auto，但仍查授权/explicit deny；普通Gate Verdict之后扩展permission hook可覆盖判决。不能把一种Gate或README“forbid always hold”推广为所有扩展/入口的强隔离。

ACP runPrompt把TrimSpace(text)的!前缀当“用户亲自shell”，调用RunShell。RunShellWith先检查composition是否允许bash，再runGuarded共用锁，但构造sandbox.Spec{}无OS沙箱，标IssuedByUser/Source=user_shell，实际RunForeground→exec.CommandContext/进程runner；这条路不经过普通Agent工具Gate。是对可信前端直输的设计，不应自动给未验证来源的Agent委派文本同等权限。prompt的resource.Text也可直接组成文本，所以不能仅按ContentBlock类型假定人类来源。

DSH配置permission:reject只约束其收的审批卡，不能由本仓库配置证明外部caller对!、模式/能力协商、取消和来源都正确过滤。本轮未检查该固定0.2.1-rc.2调用端原件，不复用旧caller审查为当前保证；不据此声称已发生远端利用，但自动委派采用应先停在此依赖边界。

#### 证据与依据

**依据 1 · 源码核查**：[internal/runtime/agent/execute_one.go:519-563](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/execute_one.go#L519-L563)

MCP授权快路径/普通Verdict及扩展覆盖契约。

<details>
<summary>查看原文（45行）</summary>

```text
	// Trusted MCP fast path: installed tools and authorized lifecycle connects
	// (mcp_connect__*) skip ordinary Ask/Auto/dontAsk gates. Only explicit deny
	// and live authorization apply — first connect of an installed server must
	// not re-prompt under headless or partial-auto policies.
	gateArgs := tool.PermissionArgs(ctx, plan.execTool, plan.permArgs)
	if isInstalledMCPTool(plan.execTool) || isMCPLifecycleConnectTarget(plan.execTool) {
		if !tool.IsMCPServerAuthorized(plan.execTool) {
			return toolOutcome{
				output:  "blocked: this project MCP server identity has not been authorized; approve the server from a parent session and retry",
				blocked: true,
				errMsg:  "blocked: MCP server identity is not authorized",
			}, true
		}
		if outcome, blocked := a.mcpFastPathRuling(ctx, plan, gateArgs); blocked {
			return outcome, true
		}
	} else if a.svc.gate != nil {
		v, err := permission.VerdictOf(a.originCtx(ctx, plan), a.svc.gate, plan.permName, gateArgs, plan.readOnly)
		if err != nil {
			return toolOutcome{
				output:    fmt.Sprintf("blocked: %s (%v)", v.Reason, err),
				blocked:   true,
				errMsg:    fmt.Sprintf("blocked: %v", err),
				execution: shellRefusal(plan.execTool, plan.execArgs, tool.ShellPhaseAuthorization),
			}, true
		}
		// permission.decision: the host verdict is computed first; the
		// extension ruling may override it in either direction (an allow
		// overriding a host deny is the full-trust contract and is audited).
		if blocked, early := a.interceptExtensionPermission(ctx, plan, &v.Allow); early {
			return blocked, true
		}
		if !v.Allow {
			return toolOutcome{
				output:      "blocked: " + v.Reason,
				blocked:     true,
				errMsg:      "blocked by permission policy",
				refusalCode: v.Code,
				execution:   shellRefusal(plan.execTool, plan.execArgs, tool.ShellPhaseAuthorization),
			}, true
		}
	}
	return toolOutcome{}, false
}

```

</details>

**依据 2 · 源码核查**：[internal/frontend/acp/shell_prompt.go:13-34](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/frontend/acp/shell_prompt.go#L13-L34)

实际!分流、RunShell与取消。

<details>
<summary>查看原文（22行）</summary>

```text
// runPrompt runs one prompt: a `!` line is the user's own shell command, run
// as typed and streamed back as a tool call before the model answers it;
// anything else is a model turn.
// The editor is a frontend in the kernel's process, so it holds that grant.
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
	for ctrl.Running() {
		select {
		case <-ctx.Done():
			ctrl.Cancel()
			return ctx.Err()
		case <-tick.C:
		}
	}
	return nil
}
```

</details>

**依据 3 · 源码核查**：[internal/session/control/shell.go:218-281](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/shell.go#L218-L281)

composition检查/无沙箱argv/IssuedByUser与真实RunForeground。

<details>
<summary>查看原文（64行）</summary>

```text
// RunShell executes a shell command directly (bypassing the model) and streams
// the output as ToolDispatch/ToolProgress/ToolResult events. It uses the same
// bash-tool infrastructure (shell resolution, timeout) and shares the runGuarded
// lock with model turns — only one can run at a time. User-invoked "!" commands
// run without the OS sandbox (the user typed the command explicitly).
func (c *Controller) RunShell(command string) {
	c.RunShellWith(command, ShellRun{})
}

// RunShellWith is RunShell with how the command is followed up spelled out.
func (c *Controller) RunShellWith(command string, opts ShellRun) {
	if binding := c.CompositionBinding(); binding != nil && !compositionAllowsTool(binding, "bash") {
		c.notice("shell is unavailable in this Agent composition")
		return
	}
	command = strings.TrimSpace(command)
	if command == "" {
		c.notice(i18n.M.ShellExecEmpty)
		return
	}
	c.runGuarded(func(ctx context.Context) error {
		sh := c.shell
		if sh.Path == "" {
			sh = sandbox.ResolveShell("", "", nil)
		}
		argv, _ := sandbox.Command(sandbox.Spec{}, sh, command) // false = unsandboxed (user invoked)

		preview := []rune(command)
		if len(preview) > 32 {
			preview = preview[:32]
		}
		id := "shell-" + string(preview)
		diagnosticPreview := shellCommandPreview(command)
		desc := shellrun.DescriptorFromShell(sh)

		c.sink.Emit(event.Event{
			Kind: event.ToolDispatch,
			Tool: event.Tool{
				ID:     id,
				Name:   "bash",
				Args:   fmt.Sprintf(`{"command":%q}`, command),
				Issuer: event.IssuedByUser,
				Execution: &event.ShellExecution{
					Kind: desc.Kind, Shell: desc.Shell, ShellVersion: desc.ShellVersion,
					Platform: desc.Platform, SupportsAndAnd: desc.SupportsAndAnd,
					State: tool.ShellStateRunning,
				},
			},
		})

		start := time.Now()
		res := shellrun.RunForeground(ctx, shellrun.Request{
			Argv:           argv,
			Dir:            c.workspaceRoot,
			Env:            shellrun.CommandEnv(ctx),
			Timeout:        shellTimeout,
			WaitDelay:      shellWaitDelay,
			CommandPreview: diagnosticPreview,
			ShellKind:      sh.Kind.String(),
			ShellPath:      sh.Path,
			Source:         "user_shell",
			Track:          true,
			Progress: func(chunk string) {
				c.sink.Emit(event.Event{
```

</details>

**依据 4 · 源码核查**：[internal/tools/shellrun/runner.go:98-141](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/tools/shellrun/runner.go#L98-L141)

实际exec.CommandContext/runner和上下文。

<details>
<summary>查看原文（44行）</summary>

```text
	runCtx := ctx
	var cancel context.CancelFunc
	if req.Timeout > 0 {
		runCtx, cancel = context.WithTimeoutCause(ctx, req.Timeout, errForegroundTimeout)
		defer cancel()
	}

	cmd := exec.CommandContext(runCtx, req.Argv[0], req.Argv[1:]...)
	cmd.Dir = req.Dir
	cmd.Env = req.Env
	cmd.WaitDelay = waitDelay

	collector := newOutputCollector(combinedOutputMaxBytes, tool.OutputTailMaxBytes)
	var writers []io.Writer
	writers = append(writers, collector.combined, collector.tail)
	if req.Progress != nil {
		pw := newProgressWriter(req.Progress, progressOutputMaxBytes, progressOutputTruncated)
		pw.suppress = req.SuppressLine
		writers = append(writers, pw)
		defer pw.Flush()
	}
	// Keep Stdout and Stderr the same writer: os/exec then creates one pipe, so
	// they interleave in write order and Progress has a single caller. Separate
	// MultiWriters would reorder streams and require two pipes.
	w := io.MultiWriter(writers...)
	cmd.Stdout = w
	cmd.Stderr = w

	run := req.Run
	if run == nil {
		run = proc.RunCommand
	}
	source := req.Source
	if source == "" {
		source = "shellrun"
	}
	tracked, err := run(runCtx, cmd, proc.RunOptions{
		Track:           req.Track,
		CancelWaitGrace: waitDelay + time.Second,
		Source:          source,
		ShellKind:       req.ShellKind,
		ShellPath:       req.ShellPath,
		CommandPreview:  req.CommandPreview,
	})
```

</details>

**依据 5 · 源码核查**：[internal/frontend/acp/prompt_attachments.go:18-49](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/frontend/acp/prompt_attachments.go#L18-L49)

文本/resource.Text真实拼接。

<details>
<summary>查看原文（32行）</summary>

```text
func promptText(root string, blocks []ContentBlock) (string, error) {
	parts := make([]string, 0, len(blocks))
	for i, b := range blocks {
		part, err := blockText(root, b)
		if err != nil {
			return "", fmt.Errorf("prompt block %d (%s): %w", i, b.Type, err)
		}
		if part != "" {
			parts = append(parts, part)
		}
	}
	return strings.TrimSpace(strings.Join(parts, "\n\n")), nil
}

func blockText(root string, b ContentBlock) (string, error) {
	switch b.Type {
	case "text":
		return b.Text, nil
	case "image":
		return attach(root, b.MimeType, "", b.Data)
	case "resource":
		if b.Resource == nil {
			return "", nil
		}
		if b.Resource.Text != "" {
			return b.Resource.Text, nil
		}
		if b.Resource.Blob != "" {
			return attach(root, b.Resource.MimeType, resourceName(b.Resource.URI), b.Resource.Blob)
		}
	}
	return "", nil
```

</details>

**依据 6 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

配置reject但不含调用端实现。

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    - id: subagent-acp-reasonix
      name: '@deepseek-ai/dsh-subagent-acp'
      config:
        providerName: reasonix
        command: reasonix
        args: ['acp']
        permission: reject
    - id: tool-subagent-reasonix
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: reasonix
        toolName: reasonix
        maxDepth: provider-managed
```

</details>

**依据 7 · 源码核查**：[integrations/dsh-plugin/package.json:25-36](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/package.json#L25-L36)

外部provider/宿主固定版本。

<details>
<summary>查看原文（12行）</summary>

```text
    "dsh": "0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/dsh-subagent-acp": "0.2.1-rc.2"
  },
  "private": true
}
```

</details>

#### 缺口

- 固定DSH调用端的来源/!转义/能力检查和真实双向协议未核。
  **影响**：不能推荐无人值守自动委派或由reject推只读保证。
  **进一步探讨**：查实际双方版本/调用端原件；无法证明输入来源时禁bash能力或只做人工隔离直输。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 预算、取消和rewind实际恢复什么？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

TaskBudget有cost/wall/token三轴，默认轴关闭；runBudget按provider usage/报价累计，已知费用可判超，但未知usage/费率不等0，总额不是支付卡预授权，不能据轮数或事后计数保证费用硬上限。模型调用/工具/重试和长命令可能已产生费用或外部效果。

工具执行有CancelToolCall上下文，显式shell有timeout/CommandContext及可能partial状态；发取消不等数据库/网络/包安装已撤回。rewind先Prepare核运行状态/coverage/会话revision，Commit在rotation/mutation边界调checkpoint transaction，真实publishTarget备份现有文件后rename暂存版本；conversationApplier截会话并持久，失败尝试恢复forward。文件发布前保守记may-published intent和异常补偿是恢复机制，但不是远端副作用事务。

README明确只覆盖编辑工具改的文件、不覆盖shell；当前代码还显式partial coverage必须确认，不能称全项目恢复。restore/undo也会受revision/文件冲突、压缩越界/持久失败影响；应先预览和核差异/覆盖，保VCS及外部备份，停止后再核进程和外部动作。

#### 证据与依据

**依据 1 · 源码核查**：[internal/runtime/agent/run_budget.go:13-36](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_budget.go#L13-L36)

预算轴及关闭语义。

<details>
<summary>查看原文（24行）</summary>

```text
// TaskBudget bounds one task on the axes its failures are reported in, and
// every axis ships off: stopping a task is the user's call. Tokens is the one
// that generalizes — a slow expensive loop accumulates them and so does a fast
// empty one, where wall clock catches only the first and money is not portable
// across models.
type TaskBudget struct {
	Cost   float64
	Wall   time.Duration
	Tokens int
}

// normalizeTaskBudget reads a negative value as unset, so a disabled axis and
// an unconfigured one behave identically.
func normalizeTaskBudget(b TaskBudget) TaskBudget {
	if b.Cost < 0 {
		b.Cost = 0
	}
	if b.Wall < 0 {
		b.Wall = 0
	}
	if b.Tokens < 0 {
		b.Tokens = 0
	}
	return b
```

</details>

**依据 2 · 源码核查**：[internal/runtime/agent/run_budget.go:59-112](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_budget.go#L59-L112)

按usage/价格累计及条件超限。

<details>
<summary>查看原文（54行）</summary>

```text
// A round whose usage never arrived still counts as a round, so the axis never
// reads cheaper than the turn actually was.
func (b *runBudget) observe(usage *provider.Usage, quote *pricing.CostQuote) {
	b.rounds++
	b.tokens = addBudgetTokens(b.tokens, budgetUsageTokens(usage))
	b.cost.observe(usage, quote)
	if usage == nil {
		return
	}
	b.requests += usageRequestCount(usage)
	b.promptTokens += usage.PromptTokens
	b.outputTokens += usage.CompletionTokens
}

func (b *runBudget) elapsed() time.Duration {
	if b.started.IsZero() {
		return 0
	}
	return time.Since(b.started)
}

// totals is the shadow reading for one scope: counts and money, never content.
func (b *runBudget) totals() event.RunBudgetTotals {
	return event.RunBudgetTotals{
		Rounds:       b.rounds,
		Requests:     b.requests,
		PromptTokens: b.promptTokens,
		OutputTokens: b.outputTokens,
		Cost:         b.cost.amount().Float64(),
		Priced:       b.cost.complete(),
		ElapsedMs:    b.elapsed().Milliseconds(),
	}
}

// exceeded names the first axis the task has spent past, or "" while inside
// the budget. Known priced spend is a lower bound even when other rounds lack
// usage or prices; unknown spend cannot erase a proven crossing.
func (b *runBudget) exceeded(limit TaskBudget) (axis, detail string) {
	if limit.Tokens > 0 {
		if used := b.tokens; used >= uint64(limit.Tokens) {
			return "token", fmt.Sprintf("task used %d tokens, reaching the %d budget", used, limit.Tokens)
		}
	}
	if limit.Cost > 0 && b.cost.pricedRounds > 0 && b.cost.amount() >= max(pricing.Amount(1), pricing.NewAmountFromFloat(limit.Cost)) {
		return "cost", fmt.Sprintf("task spend %.4f reached the %.4f budget", b.cost.amount().Float64(), limit.Cost)
	}
	if limit.Wall > 0 {
		if elapsed := b.elapsed(); elapsed >= limit.Wall {
			return "time", fmt.Sprintf("task ran %s, past the %s budget",
				elapsed.Round(time.Second), limit.Wall)
		}
	}
	return "", ""
}
```

</details>

**依据 3 · 源码核查**：[internal/runtime/agent/run_budget.go:115-151](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_budget.go#L115-L151)

宿主预算override和累计上报。

<details>
<summary>查看原文（37行）</summary>

```text
// the configured one, which is how an unattended loop gets a ceiling while
// ordinary chat keeps none.
func (a *Agent) taskBudgetLimit(ctx context.Context) TaskBudget {
	if b, ok := taskBudgetFromContext(ctx); ok {
		return b
	}
	return a.task.budget.limit
}

// ResetTaskBudget starts a fresh user-approved spend slice without touching
// Delivery evidence or the persisted Goal usage totals. Callers use this only
// after a resumable explicit-budget pause, while no Agent Run is active.
func (a *Agent) ResetTaskBudget() {
	a.task.budget = runBudget{limit: a.task.budget.limit}
}

// observeRunBudget folds a round into both scopes and reports them.
func (a *Agent) observeRunBudget(state *turnRuntime, usage *provider.Usage, quote *pricing.CostQuote) {
	if state == nil {
		return
	}
	state.budget.rootTokens.observe(usage)
	state.budget.observe(usage, quote)
	if a.task.budget.started.IsZero() {
		a.task.budget.started = state.budget.started
	}
	a.task.budget.observe(usage, quote)
	currency := ""
	if a.svc.pricing != nil {
		currency = a.svc.pricing.Symbol()
	}
	if state.budget.cost.currency != "" {
		currency = pricing.CurrencySymbol(state.budget.cost.currency)
	}
	event.RecordRunBudget(a.svc.sink, event.RunBudgetSample{
		Turn:     state.budget.totals(),
		Task:     a.task.budget.totals(),
```

</details>

**依据 4 · 源码核查**：[internal/session/control/shell.go:294-312](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/shell.go#L294-L312)

shell取消/超时可能partial分类。

<details>
<summary>查看原文（19行）</summary>

```text
			Verification: tool.ShellVerificationNotVerification,
		}
		if res.ExitCode != nil {
			code := *res.ExitCode
			ex.ExitCode = &code
		}
		switch res.State {
		case tool.ShellStateCompleted:
			ex.MutationRisk = tool.ShellMutationNone
		case tool.ShellStateNotRun:
			ex.MutationRisk = tool.ShellMutationNotStarted
		case tool.ShellStateFailed:
			if res.FailurePhase == tool.ShellPhaseLaunch {
				ex.MutationRisk = tool.ShellMutationNotStarted
			} else {
				ex.MutationRisk = tool.ShellMutationMayBePartial
			}
		case tool.ShellStateTimedOut, tool.ShellStateCancelled:
			ex.MutationRisk = tool.ShellMutationMayBePartial
```

</details>

**依据 5 · 源码核查**：[internal/session/control/rewind.go:17-27](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/rewind.go#L17-L27)

partial coverage确认判据。

<details>
<summary>查看原文（11行）</summary>

```text
// ErrRewindCoverageConfirmationRequired is returned by the compatibility
// Rewind path when restoring files from a partially covered checkpoint. New
// callers should preview with PrepareRewind, show the coverage warning, and
// commit only after the user explicitly confirms it.
var ErrRewindCoverageConfirmationRequired = errors.New("partial checkpoint coverage requires explicit confirmation")

// RewindPlanRequiresConfirmation reports whether a prepared plan can restore
// files but cannot guarantee that every workspace mutation was captured.
func RewindPlanRequiresConfirmation(plan checkpoint.RewindPlan) bool {
	wantsFiles := plan.Scope == checkpoint.RewindCode || plan.Scope == checkpoint.RewindBoth
	return wantsFiles && plan.CanFiles && (plan.Coverage == checkpoint.CoveragePartial || len(plan.CoverageGaps) > 0)
```

</details>

**依据 6 · 源码核查**：[internal/session/control/rewind.go:110-189](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/rewind.go#L110-L189)

真实prepare/revision/commit与结果。

<details>
<summary>查看原文（80行）</summary>

```text
		return checkpoint.RewindPlan{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindPlan{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindPlan{}, c.rewindFail(err)
	}
	// Release rotation before file precheck I/O.
	c.endRotation()

	boundary, hasBound := c.checkpoints.boundary(turn)
	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindPlan{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if obs := c.mutationObserver; obs != nil {
		store.SetActiveWriters(obs.ActiveWriters())
	}
	rev := atomic.LoadInt64(&c.sessionRevision)
	plan, err := store.PrepareRewind(turn, checkpoint.RewindScope(scope), rev, boundary, hasBound)
	if err != nil {
		return plan, c.rewindFail(err)
	}
	if scope == RewindBoth && !plan.CanConversation {
		plan.CanFiles = false
		if plan.DisabledReason == "" {
			plan.DisabledReason = "conversation boundary unavailable"
		}
	}
	return plan, nil
}

// CommitRewind executes a prepared plan under rotation gate + mutation barrier.
func (c *Controller) CommitRewind(planID string) (checkpoint.RewindResult, error) {
	if !c.checkpoints.enabled() || c.executor == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}
	defer c.endRotation()

	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := store.ValidatePlanSessionRevision(planID, atomic.LoadInt64(&c.sessionRevision)); err != nil {
		conflict := checkpoint.RewindConflict{Reason: checkpoint.ConflictStalePlan}
		return checkpoint.RewindResult{OK: false, Error: err.Error(), Conflicts: []checkpoint.RewindConflict{conflict}}, c.rewindFail(err)
	}

	forward, err := json.Marshal(c.executor.Session().Snapshot())
	if err != nil {
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}

	result, err := store.CommitRewindWithForward(planID, forward, conversationApplier{c: c}, nil)
	if err != nil {
		return result, c.rewindFail(err)
	}
	if result.OK {
		if len(result.Written) > 0 || len(result.Deleted) > 0 {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: fmt.Sprintf("rewound code — %d file(s) restored, %d removed", len(result.Written), len(result.Deleted))})
		}
		if result.ConversationOK {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: "rewound conversation"})
		}
		atomic.AddInt64(&c.sessionRevision, 1)
	}
	return result, nil
}

// UndoRewind reverses the last committed rewind transaction when still available.
func (c *Controller) UndoRewind(transactionID string) (checkpoint.RewindResult, error) {
```

</details>

**依据 7 · 源码核查**：[internal/session/control/rewind.go:35-63](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/rewind.go#L35-L63)

会话截断/持久失败恢复forward。

<details>
<summary>查看原文（29行）</summary>

```text
func (a conversationApplier) ApplyConversationTruncate(boundary int, forward []byte) error {
	c := a.c
	if c.executor == nil {
		return fmt.Errorf("executor unavailable")
	}
	s := c.executor.Session()
	msgs := s.Snapshot()
	if boundary > len(msgs) {
		return fmt.Errorf("conversation rewind unavailable: the conversation was compacted past this point")
	}
	if len(forward) == 0 {
		var err error
		forward, err = json.Marshal(msgs)
		if err != nil {
			return err
		}
	}
	c.keepSupersededVersion(msgs, boundary)
	s.Rewrite(msgs[:boundary], "rewind_truncate")
	// Ask whether the projection still covers what is left rather than assuming
	// it cannot: a truncation inside the live tail leaves the folded prefix
	// exactly as it was, and coverage is the projection subsystem's judgement.
	c.executor.RevalidateProjection()
	if err := c.SnapshotRewrite(); err != nil {
		_ = a.RestoreConversation(forward)
		return fmt.Errorf("persist conversation after rewind: %w", err)
	}
	return nil
}
```

</details>

**依据 8 · 源码核查**：[internal/state/checkpoint/transaction.go:655-689](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/state/checkpoint/transaction.go#L655-L689)

真实发布前持久intent和失败补偿。

<details>
<summary>查看原文（35行）</summary>

```text
			result.Files = stages
			return result, err
		}
		// Persist a conservative "may have published" intent before the first
		// filesystem rename. Recovery can safely compensate even if the crash
		// happened just before publish.
		t.Published = true
		tx.UpdatedAt = time.Now()
		if err := s.persistTransaction(tx); err != nil {
			t.Published = false
			st.Error = err.Error()
			stages = append(stages, st)
			err = s.failTransaction(tx, tx.Targets, stages, err)
			result.Error = err.Error()
			result.Files = stages
			return result, err
		}
		if err := s.publishTarget(t); err != nil {
			st.Error = err.Error()
			stages = append(stages, st)
			err = s.failTransaction(tx, tx.Targets[:i+1], stages, err)
			result.OK = false
			result.Error = err.Error()
			result.Files = stages
			return result, err
		}
		if inject != nil && inject.Phase == "after_publish_before_progress" && filesDone >= inject.AfterFiles {
			// Deliberately leave the durable state as committing to simulate a
			// process crash at the narrowest progress-persistence window.
			err := fmt.Errorf("injected crash after publish before progress")
			result.Error = err.Error()
			result.Files = append(stages, st)
			return result, err
		}
		tx.UpdatedAt = time.Now()
```

</details>

**依据 9 · 源码核查**：[internal/state/checkpoint/transaction.go:858-895](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/state/checkpoint/transaction.go#L858-L895)

实际备份/rename发布恢复文件。

<details>
<summary>查看原文（38行）</summary>

```text
func (s *Store) publishTarget(t *TransactionTarget) error {
	if t.BackupPath == "" {
		return fmt.Errorf("missing transaction backup path for %s", t.Path)
	}
	backupExists, err := securePathExists(s.root, t.BackupPath)
	if err != nil {
		return err
	}
	if backupExists {
		return fmt.Errorf("transaction backup already exists for %s", t.Path)
	}
	targetExists, err := securePathExists(s.root, t.AbsPath)
	if err != nil {
		return err
	}
	if targetExists {
		if err := secureRename(s.root, t.AbsPath, t.BackupPath); err != nil {
			return fmt.Errorf("backup %s: %w", t.Path, err)
		}
	}
	if t.Action == "delete" {
		return nil
	}
	if t.PublishTmp == "" {
		return fmt.Errorf("missing publish tmp for %s", t.Path)
	}
	if err := secureRename(s.root, t.PublishTmp, t.AbsPath); err != nil {
		restoreErr := error(nil)
		if exists, statErr := securePathExists(s.root, t.BackupPath); statErr == nil && exists {
			restoreErr = secureRename(s.root, t.BackupPath, t.AbsPath)
		}
		return errors.Join(fmt.Errorf("publish %s: %w", t.Path, err), restoreErr)
	}
	if t.RestoreMode != 0 {
		if err := secureChmod(s.root, t.AbsPath, os.FileMode(t.RestoreMode)); err != nil {
			return fmt.Errorf("chmod restored %s: %w", t.Path, err)
		}
	}
```

</details>

**依据 10 · 作者声明**：[README.md:73-77](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/README.md#L73-L77)

作者明确rewind不覆盖shell。

```text
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.

## 30-second start

```

#### 缺口

- 真实预算超限/取消传播/rewind补偿和外部恢复未运行验证。
  **影响**：不能据静态路径给费用硬封顶/全事务恢复保证。
  **进一步探讨**：副本注入半写/进程退出/会话保存失败，核文件/会话/外部动作和真实费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 具体怎么试用，首次到退出的代价是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

能审代码者应先在低权隔离副本配置明确模型与额度、VCS/文件备份，普通人类输入一项可验证小改，逐轮核工具/测试输出和最终diff。初次不启自动委派/!命令，不给生产密钥；DSH接入先核根工具、配置包和实际provider相同版本/来源策略，缺关键外部原件时只评估独立工具。

首次模型账号/机器/构建与OS限制、持续上下文/重试/模型token和工具成本、失败文件/外部动作恢复、退出会话/Key/备份留存的现金与人工未知；代码会发给所配模型，运行在本机不等数据全离线。Rewind是受覆盖文件/会话的退路而非shell撤销，正确测试结果也不证明没有回归或已验所有文件。来源、权限、停止后状态或关键验证不明时停写，回原IDE/VCS与人工核验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-76](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/README.md#L65-L76)

作者模型接收代码/付费与权限/恢复范围。

<details>
<summary>查看原文（12行）</summary>

```text

Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.

## 30-second start
```

</details>

**依据 2 · 作者声明**：[README.md:110-122](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/README.md#L110-L122)

作者发布线区分。

<details>
<summary>查看原文（13行）</summary>

```text
| Line | Branch | Status | Get it |
| --- | --- | --- | --- |
| **Reasonix 2.x** | `studio` (this branch) | Active development | [Studio releases](https://github.com/esengine/DeepSeek-Reasonix/releases?q=studio-v&expanded=true) |
| **Reasonix 1.x** | [`main-v2`](https://github.com/esengine/DeepSeek-Reasonix/tree/main-v2) | Maintenance / stable | `npm i -g reasonix` · [desktop download](https://reasonix.io/?download=desktop#start) |

- **Want something stable?** Stay on 1.x. It keeps receiving bug fixes,
  provider/API compatibility, updater and security fixes; its core architecture
  is no longer being extended.
- **Want the new architecture?** Use 2.x Reasonix Studio. It is still moving
  quickly; reports are welcome.

Valuable fixes, tests and behaviour from 1.x are reviewed one by one and ported
or reimplemented on 2.x where they fit the new architecture.
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-plugin/README.md:14-18](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/README.md#L14-L18)

根工具/Key先配置。

```text
Use [Reasonix](../../README.md) as a subagent in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`). The package is configuration only: one patch layer that points Harness's `subagent-acp` provider at `reasonix acp` and exposes it to the model as a `reasonix` tool. It contains no code.

## Before you install

1. Install Reasonix and run `reasonix setup` once on the same machine. Reasonix reads its provider key from its own home, not from environment variables, so Harness cannot pass one.
```

**依据 4 · 源码核查**：[internal/session/control/rewind.go:144-189](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/rewind.go#L144-L189)

实际commit冲突/结果与有限恢复。

<details>
<summary>查看原文（46行）</summary>

```text
func (c *Controller) CommitRewind(planID string) (checkpoint.RewindResult, error) {
	if !c.checkpoints.enabled() || c.executor == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}
	defer c.endRotation()

	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := store.ValidatePlanSessionRevision(planID, atomic.LoadInt64(&c.sessionRevision)); err != nil {
		conflict := checkpoint.RewindConflict{Reason: checkpoint.ConflictStalePlan}
		return checkpoint.RewindResult{OK: false, Error: err.Error(), Conflicts: []checkpoint.RewindConflict{conflict}}, c.rewindFail(err)
	}

	forward, err := json.Marshal(c.executor.Session().Snapshot())
	if err != nil {
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}

	result, err := store.CommitRewindWithForward(planID, forward, conversationApplier{c: c}, nil)
	if err != nil {
		return result, c.rewindFail(err)
	}
	if result.OK {
		if len(result.Written) > 0 || len(result.Deleted) > 0 {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: fmt.Sprintf("rewound code — %d file(s) restored, %d removed", len(result.Written), len(result.Deleted))})
		}
		if result.ConversationOK {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: "rewound conversation"})
		}
		atomic.AddInt64(&c.sessionRevision, 1)
	}
	return result, nil
}

// UndoRewind reverses the last committed rewind transaction when still available.
func (c *Controller) UndoRewind(transactionID string) (checkpoint.RewindResult, error) {
```

</details>

**依据 5 · 源码核查**：[integrations/dsh-plugin/package.json:25-36](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/integrations/dsh-plugin/package.json#L25-L36)

固定外部依赖。

<details>
<summary>查看原文（12行）</summary>

```text
    "dsh": "0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/dsh-subagent-acp": "0.2.1-rc.2"
  },
  "private": true
}
```

</details>

#### 缺口

- 真实版本组合、成本/人工和恢复率未知。
  **影响**：不以开源/本地/可取消宣称低成本或生产安全。
  **进一步探讨**：隔离小改对照原IDE，记录错误/返工/完整费用和退出残留。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 应验证什么授权适配，而非再叠编排？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：将ACP输入显式区分人类直输与Agent委派，委派不得隐式升级为!用户shell；将实际工具/目标/副作用与结果不明/恢复范围作为跨端回执，可能减少来源混淆和“拒审批=只读”的错误采用。它是本研究提出的未验证适配，当前根和配置包不等已有来源协议。

先比较最小替代：禁用bash能力、只读工具和低权副本能否已满足委派研究；若足够，不应新建协议。若确需写/命令，用普通文本、!前缀/resource.Text、取消、未知工具/MCP授权和版本不匹配对照，测误执行、错误配对、残留/恢复人工和模型费用；若分型/回执不降低错误或成本超过收益即否定。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/shell_prompt.go:13-34](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/frontend/acp/shell_prompt.go#L13-L34)

输入同字符串!升级shell的具体起点。

<details>
<summary>查看原文（22行）</summary>

```text
// runPrompt runs one prompt: a `!` line is the user's own shell command, run
// as typed and streamed back as a tool call before the model answers it;
// anything else is a model turn.
// The editor is a frontend in the kernel's process, so it holds that grant.
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
	for ctrl.Running() {
		select {
		case <-ctx.Done():
			ctrl.Cancel()
			return ctx.Err()
		case <-tick.C:
		}
	}
	return nil
}
```

</details>

**依据 2 · 源码核查**：[internal/session/control/shell.go:228-245](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/session/control/shell.go#L228-L245)

已有composition禁bash是简单替代。

<details>
<summary>查看原文（18行）</summary>

```text
func (c *Controller) RunShellWith(command string, opts ShellRun) {
	if binding := c.CompositionBinding(); binding != nil && !compositionAllowsTool(binding, "bash") {
		c.notice("shell is unavailable in this Agent composition")
		return
	}
	command = strings.TrimSpace(command)
	if command == "" {
		c.notice(i18n.M.ShellExecEmpty)
		return
	}
	c.runGuarded(func(ctx context.Context) error {
		sh := c.shell
		if sh.Path == "" {
			sh = sandbox.ResolveShell("", "", nil)
		}
		argv, _ := sandbox.Command(sandbox.Spec{}, sh, command) // false = unsandboxed (user invoked)

		preview := []rune(command)
```

</details>

**依据 3 · 源码核查**：[internal/runtime/agent/run_loop.go:512-551](https://github.com/esengine/DeepSeek-Reasonix/blob/53ca70d347b5aaabe867f355090d32ff12188523/internal/runtime/agent/run_loop.go#L512-L551)

已有结果配对/来源标记可作回执基础。

<details>
<summary>查看原文（40行）</summary>

```text
	batch := a.executeBatch(ctx, state, calls)
	results, images := batch.results, batch.images
	flagged := a.screenExternal(ctx, calls, batch)
	for i, call := range calls {
		msg := provider.Message{
			Role:       provider.RoleTool,
			Content:    results[i],
			Images:     images[i],
			Videos:     batch.videos[i],
			ToolCallID: call.ID,
			Name:       call.Name,
		}
		// The host labels content from outside the workspace here, once, and never rewrites it.
		if i < len(batch.outcomes) {
			a.task.origins.note(batch.outcomes[i].provenance, results[i])
			head := tool.ProvenanceHeader(batch.outcomes[i].provenance)
			if flagged[i] {
				head += suspectedInjectionLine
			}
			msg.Content = head + msg.Content
		}
		// First-visible Content is always the bounded form in results[i].
		// Full originals ride on RawContent only when truncation applied.
		if i < len(batch.outcomes) && batch.outcomes[i].rawOutput != "" && batch.outcomes[i].rawOutput != results[i] {
			msg.RawContent = batch.outcomes[i].rawOutput
		}
		if i < len(batch.executions) {
			msg.ToolExecution = toProviderToolExecution(batch.executions[i])
		}
		if i < len(batch.outcomes) {
			if o := batch.outcomes[i]; o.errMsg != "" || o.blocked || o.refusalCode != "" {
				msg.ToolFailure = &provider.ToolFailure{RefusalCode: o.refusalCode, Blocked: o.blocked}
			}
		}
		a.sess.conversation.Add(msg)
	}
	// If the context was cancelled during tool execution, return after storing
	// the batch results so the session keeps paired tool-call history.
	if ctx.Err() != nil {
		a.recordInterruptedDisplay("", "", nil, true, state.workDurationMs(), "")
```

</details>

#### 缺口

- 来源分型/回执收益未验证。
  **影响**：不计当前商业创新或自动委派安全能力。
  **进一步探讨**：先最小禁bash/隔离对照，再根据真实任务必要性决定适配。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
