# Open Design

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[4379276](https://github.com/nexu-io/open-design/tree/43792760e07093af7a57a0fdc58a0a424e849f26)

<!-- BEGIN META -->
[![GitHub ★ 104,652](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104%2C652&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nexu-io/open-design)
<!-- END META -->

> **功能**：独立本地设计应用，把编码Agent、设计资产、项目制品、预览和反馈组织在同一工作区，内含DSH stdio companion。

> **亮点**：把设计资产/Agent接线、可预览制品及反馈传输组织成同项目交接；身份/缺终态、局部制品门和持久评论修订ACK有实际caller。见[Q01](#research-q01)至[Q04](#research-q04)。

> **主要限制**：协议completed含max-tokens且不是设计合格；marker/stub局部有限，正文/manifest非原子写。严格批回执不在所核单条drain，Vela单条空输出/缺数字seq可折0而被调用成功ACK，不能推出云落地或意见已落实。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 独立应用怎样组织设计交付，哪些能力属于本项？](#detail-section-11)
  - [Q02 · DSH选择、执行和取消如何接成实际链，completed代表什么？](#detail-section-12)
  - [Q03 · 制品门和预览在实际哪条调用链上，能挡什么？](#detail-section-13)
  - [Q04 · 评论的活动链如何保留身份/重试，批回执能否代表反馈落实？](#detail-section-14)
  - [Q05 · 什么前提支持小样，执行者、成本和效果怎样验？](#detail-section-15)
  - [Q06 · 现有机制之外该验证什么，何时否定独立插件？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为已有编码Agent的设计开发者，把非敏感brief、生成制品、预览和反馈放回同项目接续；根是独立应用，不是DSH根插件。见[Q01](#research-q01)。

对照编辑器/现有Agent生成HTML、文件+截图聊天反馈与人工读回清单；所选模型、Harness工具和云服务/设计资产不全归本应用原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 独立设计工作区 | 同项目组织资产/Agent/制品/反馈 | 非根DSH插件，不证明质量/真实收益 |
| DSH native adapter | 启动profile、身份/事件/终态 | 模型工具/权限属用户Harness，版本和真实运行未验 |
| 制品create/门 | manifest、有限marker/stub、文件和预览 | 非所有写/全语义/原子提交，stub默认warn |
| 评论中转 | scope/witness、持久意图、key/revision ACK | 单条drain非批parser，全云与设计落实另验 |
| 取消/恢复 | 协议cancel与进程树终止/诊断 | 不回滚文件/网络/费用，OS结果未知 |

**流程与依赖**

应用构建/Node24与可用Agent/模型、DSH匹配profile/companion、隔离用户与项目/资产、状态写权限必需；云/Vela/MCP/媒体按选用另审。表见[Q05](#research-q05)。

隔离副本核版本/profile/项目→一项HTML生成→读回文件/manifest/版本并人工预览→取消核进程/文件→保成果再退出；云协作后续另验。含执行者步骤见[Q05](#research-q05)。

**效果与成本**

构建/Agent/模型与常驻状态、设计人工复核和断流/半写/未知云回执对账分开；用量/超时不是总费用上限，现金/TCO/净工时未测。表见[Q05](#research-q05)。

源码支持接线/局部门与可靠传输的若干措施，不证明手机/设计合格、全部云送达或净返工减少；协议/写入/ACK/设计验收分开。效果表见[Q05](#research-q05)。

> **思考**：协议completed含max-tokens且不是设计合格；marker/stub局部有限，正文/manifest非原子写。严格批回执不在所核单条drain，Vela单条空输出/缺数字seq可折0而被调用成功ACK，不能推出云落地或意见已落实。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把设计资产/Agent接线、可预览制品及反馈传输组织成同项目交接；身份/缺终态、局部制品门和持久评论修订ACK有实际caller。见[Q01](#research-q01)至[Q04](#research-q04)。

值得复用request/session/seq、缺终态失败、scope/witness和revision ACK；应把协议/进程/文件/云回执/设计验收各自列明，严格helper不替代活动caller与真实服务读回。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

协议completed含max-tokens且不是设计合格；marker/stub局部有限，正文/manifest非原子写。严格批回执不在所核单条drain，Vela单条空输出/缺数字seq可折0而被调用成功ACK，不能推出云落地或意见已落实。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有编码Agent/设计系统经验者，仅在独立OS账户或隔离环境的非敏感项目副本，匹配实际CLI/profile/companion且先不启云同步/分享/公网，验证一项本地HTML任务。记录协议max-tokens/自动恢复并读回制品/manifest/版本和人工核brief，取消后另核目标进程、已写文件/外部动作；不把预览沙箱当Agent OS权限。身份、目录、回执/费用或半写状态不明立即停并手工读回/还原副本，生产写/任意后续DSH rc/自动设计合格或全云治理需求先观察。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根应用及DSH runtime实际选择/spawn/controller/companion、代表本地制品create/guard/写入/预览与评论scope/outbox/单条client/ACK重要支路已核；不是全monorepo/Host/所有云、MCP、安装器和UI审计，未运行。真实entry_type为client。仅建议已有Agent经验者在独立环境、非敏感项目副本、匹配CLI/profile并先不启云/公网的一项HTML小样；生产写、任意DSH版本、全部设计合格或云权限保证先观察。

- 已检查：作者 README、包清单、源码路径 README.md、apps/daemon/bin/od.mjs、apps/daemon/package.json、apps/daemon/src/agent-protocol/dsh-profile/session.ts、apps/daemon/src/agent-session-resume.ts、apps/daemon/src/artifacts-cli.ts、apps/daemon/src/artifacts/create.ts、apps/daemon/src/artifacts/publication-guard.ts、apps/daemon/src/artifacts/stub-guard.ts、apps/daemon/src/cli.ts、apps/daemon/src/collab/collab-cloud-service.ts、apps/daemon/src/collab/comment-batch-receipt.ts、apps/daemon/src/collab/comment-relay-outbox.ts、apps/daemon/src/collab/vela-cli-collab-client.ts、apps/daemon/src/integrations/collab-cloud.ts、apps/daemon/src/projects.ts、apps/daemon/src/routes/project/comments.ts、apps/daemon/src/routes/project/conversations.ts、apps/daemon/src/routes/project/index.ts、apps/daemon/src/routes/runs.ts、apps/daemon/src/runtimes/agent-process.ts、apps/daemon/src/runtimes/defs/deepseek-harness.ts、apps/daemon/src/runtimes/registry.ts、apps/daemon/src/runtimes/runs.ts、apps/daemon/src/server.ts、apps/web/src/components/DesignFilesPanel.tsx、apps/web/src/components/PreviewModal.tsx、package.json、packages/dsh-runtime/cordis.patch.yml、packages/dsh-runtime/package.json、packages/dsh-runtime/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根/daemon/companion manifest与CLI、DSH registry/实际chat选择/spawn/controller/profile create-resume/事件/result、取消API/协议/进程树和resume恢复关键条件；od artifacts create→本地files API→manifest/guard/stub/write/版本及两个实际iframe；评论route/身份/本地事务→server callback→outbox→单条Vela/HTTP client→revision ACK，批helper仅潜在方法对照。未全审其他Agent真实模型循环、全部Host版本、所有云/MCP/插件/安装器/桌面/媒体/预览和服务端运营；未执行目标。
- 下一步：后续独立无敏感部署固定brief/模型预算，测真实版本/会话、缺终态/max-tokens/取消进程和副作用、半写/同名/版本/预览、空回执/丢ACK/途中编辑/413及人工意见落实，与原截图反馈比较合格率/遗漏/恢复与费用。

**分析版本**

- **仓库**：[nexu-io/open-design](https://github.com/nexu-io/open-design)
- **版本号**：0.25.1（[固定提交 4379276](https://github.com/nexu-io/open-design/tree/43792760e07093af7a57a0fdc58a0a424e849f26)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修单条回执shape/未知结果读回，再验证评论到制品版本的具体改动证据和人工验收；已有版本/witness/队列不当新量，简单原应用修复/清单够用就否定新插件。见[Q06](#research-q06)。

后续独立无敏感部署固定brief/模型预算，测真实版本/会话、缺终态/max-tokens/取消进程和副作用、半写/同名/版本/预览、空回执/丢ACK/途中编辑/413及人工意见落实，与原截图反馈比较合格率/遗漏/恢复与费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2077 | 344156 | — | — | 3076354 |
| .ts | source | 1923 | 704439 | 577666 | 93855 | — |
| .ts | test | 2176 | 619621 | 523066 | 49513 | — |
| .mjs | source | 78 | 13114 | 10288 | 1931 | — |
| .md | example | 282 | 31502 | — | — | 215199 |
| .ts | example | 16 | 1005 | 850 | 81 | — |
| .mjs | example | 3 | 1074 | 761 | 276 | — |
| .cts | source | 1 | 409 | 342 | 31 | — |
| .tsx | source | 305 | 216251 | 175307 | 33825 | — |
| .js | source | 39 | 13023 | 10637 | 1580 | — |
| .tsx | test | 864 | 307503 | 251874 | 29407 | — |
| .js | example | 24 | 7801 | 5930 | 1096 | — |
| .jsx | source | 6 | 99 | 90 | 0 | — |
| .md | test | 13 | 1248 | — | — | 7154 |
| .cjs | source | 2 | 1266 | 1112 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 551](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=551&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 158](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=158&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 136](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=136&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定本地DSH接线/制品和评论代表链能支持什么采用，哪些执行/回执状态不能当设计交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立应用怎样组织设计交付，哪些能力属于本项？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是独立设计应用/客户端，不是把根包直接安装进DSH的单插件。根open-design与daemon声明0.25.1、private、Apache-2.0，根Node ~24、pnpm >=10.33.2 <11；od命令指向daemon launcher，实际检查dist/cli.js存在后import，缺构建会明确报错。内含可分发@open-design/dsh-runtime 0.1.0作为DSH companion，不把这个内部包版本当整个应用版本，也不将root private误当不可运行。

面向已有编码Agent、需要把非敏感brief做成可预览设计制品并接续修订的设计开发者。作者定位把design systems/skills、生成、项目制品、预览与团队反馈放在同工作区；合格结果应满足brief/设计系统、正确项目/版本、能预览并可继续修改。相对编辑器生成HTML、文件传来传去和截图聊天反馈，潜在增量是交接与状态组织。多模型/制品/模板数量和营销“first”不证明设计合格、真实采用或首创。

本轮代表链实际闭合DSH runtime注册/选择→子进程→stdio controller→本仓库companion→Agent followup/事件/result，并独立核od artifacts create→本地文件API→writeProjectFile及两个实际iframe预览面；评论只核一条本地写+durable outbox→单条Vela/HTTP client→ACK链。不是所有provider、MCP/Skill安装器、桌面发布/云协作后端、全部UI/所有发布入口的全审。DSH实际模型工具循环和CLI权限由所选Harness/用户profile提供，OD主要连接和展示，不把其他Agent/设计系统/云端实现全归本项。

旧正式411162cb1b97ada701a498a1f34b4366cc9898f5四题、证据指向及所有findings/自代码依赖已完整只读。本轮补上旧稿没闭合的活动caller：制品门确实在带有效manifest写入链调用；取消外层也有进程树终止；反而不能从严格batch receipt helper推当前comment drain走批处理。未启动应用/CLI/Agent、未安装/运行测试、未真实模型生成或发布分享。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/package.json#L1-L14)

根应用版本/许可/private/od入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "open-design",
  "version": "0.25.1",
  "private": true,
  "packageManager": "pnpm@10.33.2",
  "type": "module",
  "description": "Local-first design product: detects your installed code-agent CLI, runs design skills + design systems, streams artifacts into a sandboxed preview.",
  "license": "Apache-2.0",
  "bin": {
    "od": "./apps/daemon/bin/od.mjs"
  },
  "scripts": {
    "postinstall": "node ./scripts/postinstall.mjs",
    "bootstrap": "node ./scripts/postinstall.mjs",
```

</details>

**依据 2 · 源码核查**：[package.json:42-46](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/package.json#L42-L46)

Node与pnpm约束。

```text
  "engines": {
    "node": "~24",
    "pnpm": ">=10.33.2 <11"
  },
  "pnpm": {
```

**依据 3 · 源码核查**：[apps/daemon/bin/od.mjs:1-16](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/bin/od.mjs#L1-L16)

真实dist加载和缺失构建报错。

<details>
<summary>查看原文（16行）</summary>

```text
#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const entryDir = dirname(fileURLToPath(import.meta.url));
const distEntry = resolve(entryDir, "../dist/cli.js");

if (!existsSync(distEntry)) {
  throw new Error(
    `OpenDesign daemon dist entry not found at ${distEntry}. Run "pnpm bootstrap" after install (or "pnpm --filter @open-design/daemon build").`,
  );
}

await import(pathToFileURL(distEntry).href);
```

</details>

**依据 4 · 源码核查**：[apps/daemon/package.json:1-22](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/package.json#L1-L22)

daemon独立应用出口。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "@open-design/daemon",
  "version": "0.25.1",
  "private": true,
  "type": "module",
  "main": "./dist/cli.js",
  "types": "./dist/cli.d.ts",
  "bin": {
    "od": "./bin/od.mjs"
  },
  "exports": {
    ".": {
      "types": "./dist/cli.d.ts",
      "default": "./dist/cli.js"
    },
    "./package.json": "./package.json",
    "./sidecar": {
      "types": "./dist/sidecar/index.d.ts",
      "default": "./dist/sidecar/index.js"
    }
  },
  "files": [
```

</details>

**依据 5 · 源码核查**：[packages/dsh-runtime/package.json:1-12](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/package.json#L1-L12)

内部DSH companion自身0.1.0版本。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@open-design/dsh-runtime",
  "version": "0.1.0",
  "description": "DeepSeek Harness profile runtime for OpenDesign",
  "license": "Apache-2.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "default": "./dist/index.js"
```

</details>

**依据 6 · 作者声明**：[README.md:28-36](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/README.md#L28-L36)

作者设计工作区定位，仅作者主张。

```text
## What is OpenDesign

OpenDesign is **the 1st collaborative AI design agent workspace**. Start with a brief, then use your coding agent or OpenDesign Cloud to create a prototype that follows your design system. Share it with your team for feedback, and let your agent refine it in the same project.

That workflow is open and extensible. OpenDesign is licensed under Apache 2.0 and gives teams skills, design templates, design systems, and plugins they can inspect and adapt to their own process.


---

```

**依据 7 · 作者声明**：[README.md:91-118](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/README.md#L91-L118)

作者集成方式及DSH native声明，不替实际兼容。

<details>
<summary>查看原文（28行）</summary>

```text
## Platform Compatibility

> OpenDesign connects to mainstream coding agents in two ways: **skills, CLI, and MCP** for agents that consume OD, plus **native runtime adapters** for agents that OD launches directly. DeepSeek Harness is a first-class native runtime through the official `dsh` CLI, with structured streaming, model discovery, cancellation, and session resume.

| Coding agent / platform &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Status &nbsp;&nbsp; | Quick setup &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
|---|:---:|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | ✅ Supported | `od mcp install claude` |
| [Claude Desktop](https://claude.ai/download) | ✅ Supported¹ | `od mcp install claude-desktop` |
| [Codex CLI](https://github.com/openai/codex) | ✅ Supported | `od mcp install codex` |
| [DeepSeek Reasonix](https://github.com/esengine/DeepSeek-Reasonix) | ✅ Supported | `od mcp install reasonix` |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | ✅ Native runtime | `od agent setup deepseek-harness` |
| [Raven](https://github.com/EverMind-AI/Raven) | ✅ Supported | `od mcp install raven` |
| [Cursor](https://www.cursor.com/cli) | ✅ Supported | `od mcp install cursor` |
| [VS Code + GitHub Copilot](https://github.com/features/copilot) | ✅ Supported | `od mcp install copilot` |
| [GitHub Copilot CLI](https://github.com/features/copilot/cli) | ✅ Supported | `od mcp install copilot` |
| [OpenCode](https://opencode.ai/) | ✅ Supported | `od mcp install opencode` |
| [OpenClaw](https://github.com/openclaw/openclaw) | ✅ Supported | `od mcp install openclaw` |
| [Antigravity](https://antigravity.google) | ✅ Supported | `od mcp install antigravity` |
| [Cline](https://github.com/cline/cline) | ✅ Supported | `od mcp install cline` |
| [Trae](https://www.trae.ai/) | ✅ Supported | `od mcp install trae` |
| [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) | ✅ Supported | `od mcp install kimi` |
| [Kiro](https://kiro.dev) | ✅ Supported | `od mcp install kiro` |
| [Pi Agent](https://github.com/badlogic/pi-mono) | ✅ Supported | `od mcp install pi` |
| [Mistral Vibe CLI](https://github.com/mistralai/mistral-vibe) | ✅ Supported | `od mcp install vibe` |
| [Hermes Agent](https://github.com/nousresearch/hermes-agent) | ✅ Supported | `od mcp install hermes` |

For DeepSeek Harness, install the official `dsh` CLI first, then select it in OpenDesign or run `od agent setup deepseek-harness` to install/repair OD's connection component. For MCP integrations: `od mcp install <agent> --print` for a dry-run preview · `--uninstall` to remove · full list with `od mcp install --help`.

```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/runtimes/registry.ts:47-68](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/registry.ts#L47-L68)

DSH注册到实际runtime集合。

<details>
<summary>查看原文（22行）</summary>

```text
  hermesAgentDef,
  traeCliAgentDef,
  grokBuildAgentDef,
  kimiAgentDef,
  cursorAgentDef,
  qwenAgentDef,
  qoderAgentDef,
  copilotAgentDef,
  ampAgentDef,
  piAgentDef,
  kiroAgentDef,
  kiloAgentDef,
  vibeAgentDef,
  deepseekAgentDef,
  deepseekHarnessAgentDef,
  aiderAgentDef,
  antigravityAgentDef,
  reasonixAgentDef,
  codebuddyAgentDef,
  mimoAgentDef,
  atomcodeAgentDef,
];
```

</details>

#### 缺口

- 真实设计用户/完整安装/手机或桌面体验与净返工收益未测
  **影响**：根应用类型/代表链可核，不支持营销列表全部可用或生产设计质量保证
  **进一步探讨**：以后隔离本地非敏感brief与原编辑器+截图反馈同任务对照，测合格输出、遗漏与恢复，不按制品/模板数验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH选择、执行和取消如何接成实际链，completed代表什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH def实际在runtime registry里，chat server按agentId取def、解析launch后spawnAgentProcess，传有效cwd/env、run记录和stdin模式；spawn helper用shell:false、POSIX独立进程组，DSH以dsh --profile open-design --stdio启动。def在probe前只检查profile package.json存在，再以--probe读取插件版本，并有10秒probe/models超时；存在性检查不等配置正确/真实兼容。

支持/警告口径仍是0.1.x stable，以及0.1.0-rc.6+、0.1.1/0.1.2 rc特定模式，举例点版本rc.8/rc.2/rc.1。companion peer范围和0.1.1-rc.2开发依赖也在源码，不因README first-class/native就假定任何后续0.2 prerelease可解析。版本pattern不是已运行认证，本轮没装CLI，需匹配真实安装版本、profile/companion和probe；不强配其他正式Host研究版本作同版默认部署。

实际server按dsh-profile-jsonl attach controller，run.id/requestId、composed prompt、cwd、model/reasoning/resumeSessionId进入协议。controller先ready才发execute；不同request_id帧计忽略，缺session内容、重复身份/session、错误resume和result换session等失败，stdout end无终态失败；tool/text/usage被映射给sendAgentEvent。companion实际serve读一条execute，create/resume Agent，按sessionId/seq过滤事件，新建时meta写cwd，followup用户消息→whenIdle→flush→result；工具结果和下一步模型决策是DSH Agent职责，OD只转发事件，不在本报告冒充全宿主工具循环审计。resume这段不重新把request.cwd写入meta，不能把传cwd当OS隔离或充分工作区身份验证。

completed是协议层终态而非设计质量。companion resultStatus把completed和max-tokens都映射completed，aborted映射cancelled，缺turn/end或其他原因failed；因此达到输出token限制也可能协议completed，不能当内容完整。controller completedSuccessfully还要求无fatal，外层close实际读取该值并结合cancel/exit/signal/制品副作用分类，而不只exit 0。outer也会识别DSH resume rejected/mismatch，条件化清旧session、重种全文并最多这一自动reseed；strategy任务分支核工具/制品/可见输出后可拒绝不安全cold restart，不能泛称所有普通聊天重发都具exactly-once副作用保证。

取消不止controller发cancel：companion有request-scoped pending latch，激活后abort controller+agent.cancel；server将controller放run.acpSession，实际/api/runs/:id/cancel→runs.cancel清pending retry并先协议abort，再terminateProcessTree。POSIX grace后给进程组TERM/KILL并等待，其他平台枚举树/诊断，未静默仅凭发signal算quiescent；枚举/终止失败会发termination_failed。实际OS回收、已写文件、外部请求和已计模型费用并不由此回滚，也不把几个watchdog/协议超时当总轮数/费用上限。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:32-104](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L32-L104)

profile检查、版本范围、probe和真实stdio args。

<details>
<summary>查看原文（73行）</summary>

```text
export function hasOpenDesignProfile(env: NodeJS.ProcessEnv): boolean {
  return existsSync(path.join(resolveOpenDesignProfileDir(env), 'package.json'));
}

export function resolveOpenDesignProfileDir(env: NodeJS.ProcessEnv): string {
  const configuredHome = env.DSH_HOME?.trim();
  const dshHome = configuredHome
    ? path.resolve(configuredHome)
    : path.join(homedir(), '.dsh');
  return path.join(dshHome, 'profiles', 'open-design');
}

const DSH_VERSION_RE = /^v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/u;

export function parseDeepSeekHarnessVersion(raw: string): string | null {
  return DSH_VERSION_RE.exec(raw.trim())?.[1] ?? null;
}

export const deepseekHarnessAgentDef = {
  id: 'deepseek-harness',
  name: 'DeepSeek Harness',
  bin: 'dsh',
  versionArgs: ['--version'],
  versionPolicy: {
    // `dsh` is published as a stream of release candidates whose sibling
    // packages peer-require each other, so the version our own installer
    // hands the user moves with upstream. Naming one of them made every user
    // who followed our instructions land on an "untested version" warning the
    // week after we bumped the installer. Accept the release line; a version
    // off it still warns.
    supportedVersions: ['0.1.0-rc.8', '0.1.1-rc.2', '0.1.2-rc.1'],
    // The line, not one point on it. Scoping this to `0.1.0-rc.N` was still a
    // pin: upstream shipped `0.1.1-rc.1` two days later and every user on it
    // was told their CLI was untested. `0.1.2-rc.1` then became npm's `latest`,
    // and the same warning came back for everyone who installed without naming
    // a version — the widening has to happen per patch line, every time.
    //
    // Prerelease acceptance may never exceed what `packages/dsh-runtime`'s peer
    // ranges can install, or this suppresses the warning for a version whose
    // companion cannot resolve — a worse failure than the warning, and silent.
    // semver admits a prerelease only against a comparator sharing its exact
    // major.minor.patch AND carrying a prerelease, so the accepted release
    // candidates are precisely the peers' tuples and floors: `0.1.0-rc.6+`, any
    // `0.1.1-rc.N`, any `0.1.2-rc.N`. One alternative per peer comparator, on
    // purpose — a new upstream patch line needs an edit in both files or in
    // neither. Stable releases on the line need no such comparator.
    // `e2e/tests/dsh-installer-version-policy.test.ts` holds the two together.
    supportedVersionPattern:
      /^0\.1\.\d+$|^0\.1\.0-rc\.(?:[6-9]|[1-9]\d+)$|^0\.1\.1-rc\.\d+$|^0\.1\.2-rc\.\d+$/u,
    requireVersion: true,
    parse: parseDeepSeekHarnessVersion,
  },
  compatibilityProbe: {
    args: ['--profile', 'open-design', '--probe'],
    timeoutMs: 10_000,
    // rc.6 auto-initializes a missing profile before booting it, so avoid
    // invoking --probe until the user-installed profile already exists.
    preflight: hasOpenDesignProfile,
    parse: (stdout) => parseDshProfileProbeOutput(stdout).plugin_version,
  },
  listModels: {
    args: ['--profile', 'open-design', '--models'],
    parse: parseModels,
    timeoutMs: 10_000,
  },
  fallbackModels: [DEFAULT_MODEL_OPTION],
  buildArgs: () => ['--profile', 'open-design', '--stdio'],
  promptViaStdin: true,
  streamFormat: 'dsh-profile-jsonl',
  resumesSessionViaProfileStdio: true,
  capturesSessionIdFromStream: true,
  supportsCustomModel: false,
} satisfies RuntimeAgentDef;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-runtime/package.json:48-74](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/package.json#L48-L74)

companion peer及开发依赖版本口径。

<details>
<summary>查看原文（27行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1",
    "@deepseek-ai/cordis-plugin-loader": ">=1.0.2",
    "@deepseek-ai/dsh-agent": ">=0.1.0-rc.6 || >=0.1.1-rc.0 || >=0.1.2-rc.0",
    "@deepseek-ai/dsh-agent-default-model": ">=0.1.0-rc.6 || >=0.1.1-rc.0 || >=0.1.2-rc.0",
    "@deepseek-ai/dsh-invariants": ">=0.1.0-rc.6 || >=0.1.1-rc.0 || >=0.1.2-rc.0",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6 || >=0.1.1-rc.0 || >=0.1.2-rc.0",
    "@deepseek-ai/dsh-session": ">=0.1.0-rc.6 || >=0.1.1-rc.0 || >=0.1.2-rc.0"
  },
  "devDependencies": {
    "@typescript/native": "npm:typescript@7.0.2",
    "@deepseek-ai/cordis": "4.0.1",
    "@deepseek-ai/cordis-plugin-loader": "1.0.2",
    "@deepseek-ai/dsh-agent": "0.1.1-rc.2",
    "@deepseek-ai/dsh-agent-default-model": "0.1.1-rc.2",
    "@deepseek-ai/dsh-invariants": "0.1.1-rc.2",
    "@deepseek-ai/dsh-llm": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session": "0.1.1-rc.2",
    "@types/node": "24.12.2",
    "esbuild": "0.28.0",
    "tsx": "4.22.3",
    "vitest": "4.1.6"
  },
  "engines": {
    "node": ">=24"
  }
}
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/server.ts:11760-11778](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L11760-L11778)

chat实际选择runtime。

<details>
<summary>查看原文（19行）</summary>

```text
    const runSessionMode =
      sessionMode === 'chat' || sessionMode === 'design' || sessionMode === 'plan'
        ? normalizeConversationSessionMode(sessionMode)
        : normalizeConversationSessionMode(conversationSession?.sessionMode);
    // Single choke point for the codex transport switch. Every other
    // agent — and codex with the switch off — gets back the identical
    // registry object, so nothing below can tell this call happened.
    const def = applyCodexTransportOverride(getAgentDef(agentId));
    if (!def)
      return failRun(
        'AGENT_UNAVAILABLE',
        `unknown agent: ${agentId}`,
      );
    if (!def.bin)
      return failRun('AGENT_UNAVAILABLE', 'agent has no binary');
    const byokOpenCodeProvider = def.id === 'byok-opencode'
      ? buildOpenCodeByokProviderConfig(
          byokProvider,
          typeof model === 'string' ? model : null,
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/server.ts:15404-15427](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L15404-L15427)

实际spawn caller/cwd/run。

<details>
<summary>查看原文（24行）</summary>

```text
      lifecycle.mark('process_spawn_start');
      // A whole-prompt stdin prompt (plain text, or the runtime's own
      // one-shot framing) is handed over as a complete file at spawn; live
      // stdin protocols (Claude stream-json, JSON-RPC) keep the pipe. The
      // agent stays on record until its process group is gone, so a daemon
      // started after this one dies can reap it. See runtimes/agent-process.ts.
      const spawnedAgent = spawnAgentProcess({
        command: invocation.command,
        args: invocation.args,
        env,
        cwd: effectiveCwd,
        windowsVerbatimArguments: invocation.windowsVerbatimArguments,
        stdin: stdinMode === 'pipe' && runtimeReadsPlainTextPromptFromStdin(def)
          ? { prompt: agentStdinPromptPayload(def, composed) }
          : stdinMode,
        runDir: path.join(RUNTIME_DATA_DIR, 'runs', run.id),
        runId: run.id,
      });
      child = spawnedAgent.child;
      promptDeliveredAtSpawn = spawnedAgent.promptDeliveredAtSpawn;
      lifecycle.mark('process_spawned');
      run.child = child;
      run.childPid = typeof child.pid === 'number' ? child.pid : null;
      run.processGroupId = spawnedAgent.processGroupId;
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/runtimes/agent-process.ts:276-293](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/agent-process.ts#L276-L293)

真实shell:false/独立进程组spawn。

<details>
<summary>查看原文（18行）</summary>

```text
export function spawnAgentProcess(request: SpawnAgentProcessRequest): SpawnedAgentProcess {
  const detached = process.platform !== 'win32';
  const staged = typeof request.stdin === 'object'
    ? openCompletePromptAsStdin(request.runDir, request.stdin.prompt)
    : null;
  const stdin = staged ? staged.fd : (request.stdin as 'pipe' | 'ignore');
  const spawnedAtMs = Date.now();
  let child: ChildProcess;
  try {
    child = spawn(request.command, [...request.args], {
      env: request.env,
      stdio: [stdin, 'pipe', 'pipe'],
      cwd: request.cwd,
      shell: false,
      detached,
      // Required when invocation wraps a Windows .cmd/.bat shim through
      // cmd.exe; without this, Node re-escapes the inner command line and
      // breaks paths containing spaces (issue #315).
```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/server.ts:16767-16819](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L16767-L16819)

真实attach、事件和DSH失败分类caller。

<details>
<summary>查看原文（53行）</summary>

```text
    } else if (def.streamFormat === 'dsh-profile-jsonl') {
      trackingSubstantiveOutput = true;
      acpSession = attachDshProfileSession({
        child,
        requestId: run.id,
        prompt: composed,
        cwd: effectiveCwd,
        model: safeModel,
        reasoningEffort: safeReasoning,
        ...(agentResumeCtx.isResuming && agentResumeCtx.resumeSessionId
          ? { resumeSessionId: agentResumeCtx.resumeSessionId }
          : {}),
        onReady: () => noteCliReadyAt(),
        onSession: () => noteSessionInitDoneAt(),
        onComplete: () => clearFirstOutputWatchdog(),
        send: (event, data) => {
          noteAgentActivity();
          if (event === 'agent') {
            sendAgentEvent(data);
            return;
          }
          if (event === 'error') {
            const failure = normalizeDeepSeekHarnessFailure(data);
            const { code, message } = failure;
            agentStreamError = message;
            agentStreamErrorObservedBeforeCancellation = !run.cancelRequested;
            acpFatalErrorObservedBeforeCancellation = !run.cancelRequested;
            run.runtimeFailureObservedBeforeCancellation = !run.cancelRequested;
            agentStdoutTail = `${agentStdoutTail}\n${code}`.slice(-2000);
            if (
              agentResumeCtx.isResuming &&
              !run.resumeAutoReseeded &&
              /^DSH_PROFILE_RESUME_(?:REJECTED|MISMATCH)$/.test(code)
            ) {
              design.runs.emit(run, 'diagnostic', {
                type: 'agent_resume_failed_suppressed',
                agent_id: def.id,
                reason: 'resume_failed',
                previous_session_id: agentResumeCtx.resumeSessionId ?? null,
              });
              return;
            }
            if (!run.cancelRequested) {
              send('error', createSseErrorPayload(code, message, {
                retryable:
                  failure.authRequired || code === 'DSH_PROFILE_RESUME_REJECTED',
              }));
            }
            return;
          }
          send(event, data);
        },
      });
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:109-153](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L109-L153)

execute与session/request身份检查。

<details>
<summary>查看原文（45行）</summary>

```text
  const sendExecute = () => {
    const command: DshProfileExecuteCommand = {
      v: 1,
      type: 'execute',
      request_id: requestId,
      cwd,
      prompt,
      ...(resumeSessionId ? { resume_session_id: resumeSessionId } : {}),
      ...(selectedModel ? { model: selectedModel } : {}),
      ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
      mcp_servers: [],
    };
    executeSent = true;
    sendCommand(command);
  };

  const requireSession = (): boolean => {
    if (sessionId) return true;
    fail('DeepSeek Harness profile emitted run content before establishing a session.');
    return false;
  };

  const handleRunFrame = (frame: Exclude<DshProfileRuntimeFrame, { type: 'ready' | 'probe' }>) => {
    if (frame.request_id && frame.request_id !== requestId) {
      ignoredRequestFrames += 1;
      return;
    }
    switch (frame.type) {
      case 'session':
        if (sessionId) {
          fail('DeepSeek Harness profile emitted more than one session frame.');
          return;
        }
        if (resumeSessionId && (!frame.resumed || frame.session_id !== resumeSessionId)) {
          fail('DeepSeek Harness profile resumed a different session.', 'DSH_PROFILE_RESUME_MISMATCH');
          return;
        }
        if (!resumeSessionId && frame.resumed) {
          fail('DeepSeek Harness profile reported an unexpected resumed session.');
          return;
        }
        sessionId = frame.session_id;
        send('agent', { type: 'status', label: 'working', sessionId });
        onSession?.();
        return;
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:199-280](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L199-L280)

result/ready/缺终态、abort与completed判据。

<details>
<summary>查看原文（82行）</summary>

```text
      case 'protocol_error':
        fail('DeepSeek Harness profile reported a protocol error.', frame.code);
        return;
      case 'result':
        if (resumeSessionId && frame.resume_rejected) {
          if (frame.session_id !== resumeSessionId) {
            fail('DeepSeek Harness profile rejected a different session.', 'DSH_PROFILE_RESUME_MISMATCH');
            return;
          }
          fail('DeepSeek Harness could not resume the saved session.', frame.error?.code ?? 'DSH_PROFILE_RESUME_REJECTED');
          return;
        }
        if (!sessionId && frame.status === 'failed') {
          fail(frame.error?.message ?? 'DeepSeek Harness profile could not start a session.', frame.error?.code);
          return;
        }
        if (!requireSession()) return;
        if (frame.session_id !== sessionId) {
          fail('DeepSeek Harness profile terminal result changed the session id.', 'DSH_PROFILE_SESSION_MISMATCH');
          return;
        }
        if (frame.status === 'failed') {
          fail(frame.error?.message ?? 'DeepSeek Harness profile run failed.', frame.error?.code);
          return;
        }
        if (frame.status === 'cancelled' && !aborted) {
          fail('DeepSeek Harness profile cancelled a run that OpenDesign did not cancel.');
          return;
        }
        finish(frame.status);
        return;
    }
  };

  const parser = createDshProfileJsonlStream({
    onFrame(frame) {
      if (finished) {
        fatal = true;
        return;
      }
      if (!ready) {
        if (frame.type !== 'ready') {
          fail('DeepSeek Harness profile did not begin with a ready frame.');
          return;
        }
        ready = true;
        onReady?.();
        if (aborted) {
          finish('cancelled');
          return;
        }
        sendExecute();
        return;
      }
      if (frame.type === 'ready' || frame.type === 'probe') {
        fail('DeepSeek Harness profile emitted an unexpected identity frame.');
        return;
      }
      handleRunFrame(frame);
    },
    onError(error) {
      fail(error.message, error.code);
    },
  });

  stdout.on('data', (chunk: Buffer | string) => parser.feed(chunk));
  stdout.on('end', () => {
    parser.flush();
    if (!finished) fail('DeepSeek Harness profile exited without a terminal result.', 'DSH_PROFILE_MISSING_RESULT');
  });

  return {
    abort() {
      if (finished || aborted) return;
      aborted = true;
      sendCommand({ v: 1, type: 'cancel', request_id: requestId });
    },
    hasFatalError() {
      return fatal;
    },
    completedSuccessfully() {
      return terminalStatus === 'completed' && !fatal;
```

</details>

**依据 9 · 源码核查**：[packages/dsh-runtime/src/index.ts:254-298](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/src/index.ts#L254-L298)

会话/seq/model/cwd create/resume实际接线。

<details>
<summary>查看原文（45行）</summary>

```text
async function execute(
  ctx: Context,
  request: ExecuteCommand,
  output: Output,
  onHandle: (handle: AgentHandle | undefined) => void,
  signal: AbortSignal,
): Promise<void> {
  const defaultSelection = ctx.agentDefaultModel.currentSelection();
  const baseSelection = request.model
    ? { provider: request.model.provider, model: request.model.id }
    : defaultSelection;
  const selection = request.reasoning_effort
    ? { ...baseSelection, reasoningEffort: ReasoningEffortId(request.reasoning_effort) }
    : baseSelection;
  const sessionId = SessionId(request.resume_session_id ?? `od-${randomUUID()}`);
  let handle: AgentHandle | undefined;
  let firstSeq = Number.POSITIVE_INFINITY;
  let turnEnd: SessionEvent<'turn/end'> | undefined;
  let assistantOutput = '';
  const setup = (agentCtx: Context) => {
    const selected: ModelSelectionRef = { current: selection, assembled: undefined };
    installModelSelection(agentCtx, selected);
  };
  let disposeEvent = () => {};
  const onSessionEvent = (session: { id: unknown }, event: SessionEvent) => {
    if (String(session.id) !== String(sessionId) || event.seq < firstSeq) return;
    emitSessionEvent(output, request, selection.provider, selection.model, event);
    if (event.type === 'assistant/chunk' && event.data.chunk.type === 'text-delta') {
      assistantOutput += event.data.chunk.text;
    }
    if (event.type === 'turn/end') turnEnd = event;
  };

  try {
    try {
      handle = request.resume_session_id
        ? await ctx.agents.resume({ resumeSessionId: sessionId, agentOptions: selection, setup, signal })
        : await ctx.agents.create({
            sessionId,
            meta: { cwd: request.cwd },
            agentOptions: selection,
            setup,
            signal,
          });
      onHandle(handle);
```

</details>

**依据 10 · 源码核查**：[packages/dsh-runtime/src/index.ts:319-357](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/src/index.ts#L319-L357)

followup→idle→flush→result活动链。

<details>
<summary>查看原文（39行）</summary>

```text
    writeFrame(output, {
      v: 1,
      type: 'session',
      request_id: request.request_id,
      session_id: String(sessionId),
      resumed: Boolean(request.resume_session_id),
    });
    await handle.agent.whenIdle();
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }
    firstSeq = handle.agent.session.seq + 1;
    disposeEvent = ctx.on('session/event', onSessionEvent);
    await handle.agent.followup(createUserMessage({
      content: [{ type: 'text', text: request.prompt }],
      source: { kind: 'user' },
    }));
    await handle.agent.whenIdle();
    await ctx.sessions.flush(handle.agent.session);
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }

    const reason = turnEnd?.data.reason;
    const status = resultStatus(reason);
    const failed = resultError(reason);
    writeFrame(output, {
      v: 1,
      type: 'result',
      request_id: request.request_id,
      status,
      session_id: String(sessionId),
      ...terminalOutput(assistantOutput),
      stop_reason: reason?.kind ?? 'unknown',
      resume_rejected: false,
      ...(failed === undefined ? {} : { error: failed }),
    });
```

</details>

**依据 11 · 源码核查**：[packages/dsh-runtime/src/index.ts:82-102](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/src/index.ts#L82-L102)

max-tokens视completed、缺turn/end失败。

<details>
<summary>查看原文（21行）</summary>

```text
function resultStatus(reason: TurnEndReason | undefined): 'completed' | 'cancelled' | 'failed' {
  if (reason?.kind === 'completed' || reason?.kind === 'max-tokens') return 'completed';
  if (reason?.kind === 'aborted') return 'cancelled';
  return 'failed';
}

function resultError(reason: TurnEndReason | undefined): { code: string; message: string } | undefined {
  if (resultStatus(reason) !== 'failed') return undefined;
  if (!reason) {
    return {
      code: 'DSH_PROFILE_MISSING_TURN_END',
      message: 'DeepSeek Harness became idle without reporting how the turn ended.',
    };
  }
  if (reason.kind === 'error') return errorFacts(reason.error, 'DSH_PROFILE_TURN_FAILED');
  if (reason.kind === 'blocked') {
    return {
      code: 'DSH_PROFILE_TURN_BLOCKED',
      message: 'DeepSeek Harness blocked the turn before it completed.',
    };
  }
```

</details>

**依据 12 · 源码核查**：[apps/daemon/src/server.ts:17327-17345](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L17327-L17345)

实际消费协议成功与副作用进行close分类。

<details>
<summary>查看原文（19行）</summary>

```text
      const acpCleanCompletion =
        typeof acpSession?.completedSuccessfully === 'function' &&
        acpSession.completedSuccessfully();
      const runArtifactSideEffects = runSideEffectsForRun(run);
      const status = classifyChatRunCloseStatus({
        cancelRequested: !!run.cancelRequested,
        code,
        signal,
        acpCleanCompletion,
        acpCompletionShutdownRequested: acpCompletionShutdownRequested || (
          typeof acpSession?.completionShutdownRequested === 'function' &&
          acpSession.completionShutdownRequested()
        ),
        artifactQuietShutdownRequested,
        turnCompletedCleanly: !!run.turnCompletedCleanly,
        artifactProducedThisRun:
          runArtifactSideEffects.artifactWriteSeen ||
          runArtifactSideEffects.liveArtifactSeen,
      });
```

</details>

**依据 13 · 源码核查**：[apps/daemon/src/agent-session-resume.ts:484-491](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/agent-session-resume.ts#L484-L491)

DSH resume失败真实识别。

```text
export function isAgentResumeFailure(
  agentId: string,
  stderr: string,
  stdout = '',
): boolean {
  if (agentId === 'deepseek-harness') {
    return /DSH_PROFILE_RESUME_(?:REJECTED|MISMATCH)/.test(`${stderr}\n${stdout}`);
  }
```

**依据 14 · 源码核查**：[apps/daemon/src/server.ts:17118-17177](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L17118-L17177)

实际reseed条件/副作用分支/一次guard。

<details>
<summary>查看原文（60行）</summary>

```text
      if (
        !run.cancelRequested &&
        !forceInternalResume &&
        (runtimeResumesSessionById(def) || def.resumesSessionViaAcpLoad === true) &&
        run.conversationId &&
        resolveAgentResumeFailurePolicy({
          agentId: def.id,
          stderr: agentStderrTail,
          stdout: agentStdoutTail,
          isResuming: agentResumePromptPolicy.skipTranscript,
          resumeSessionId: agentResumePromptPolicy.resumeSessionId,
        }).autoReseedFullTranscript
      ) {
        const resumeSideEffects = runSideEffectsForRun(run);
        const safeColdProduction = strategyRunMapping?.coldStartFinalText
          && !resumeSideEffects.toolCallSeen && !resumeSideEffects.artifactWriteSeen
          && !resumeSideEffects.liveArtifactSeen && !resumeSideEffects.userVisibleOutputSeen;
        if (strategyTaskAtStart && ((!isOdNextInitialRun && !safeColdProduction)
          || resumeSideEffects.toolCallSeen || resumeSideEffects.artifactWriteSeen
          || resumeSideEffects.liveArtifactSeen || resumeSideEffects.userVisibleOutputSeen)) {
          const ended = endFailedAutomaticContinuation(db, { runId: run.id });
          if (ended) run.strategyTask = projectStrategyTask(ended, run.id, db);
          send('error', createSseErrorPayload(
            'AGENT_SESSION_RESUME_FAILED',
            'The OD Next native session is unavailable and a safe cold restart cannot be proven.',
            { retryable: false },
          ));
          return finishWithRetryDecision('failed', code ?? 1, signal ?? null);
        }
        // The resumed upstream session is gone (expired / pruned). Clear the dead
        // handle and TRANSPARENTLY re-run this same turn with a fresh session +
        // the full transcript rebuilt from the DB — exactly the pre-session-reuse
        // path. The user sees one (slightly slower) turn, never an error or a
        // "resend" prompt. Re-spawn reuses the same-run retry machinery; because
        // the session row is now cleared, the re-spawn resolves isResuming=false
        // (fresh session, full transcript), so it CANNOT resume-fail again — the
        // `resumeAutoReseeded` guard is belt-and-suspenders against any loop.
        clearAgentSession(db, run.conversationId, def.id);
        if (!run.resumeAutoReseeded) {
          run.resumeAutoReseeded = true;
          run.resumeAutoReseededFrom = agentResumePromptPolicy.resumeSessionId ?? null;
          run.nativeSessionRecovery = markNativeSessionAutoReseeded({
            previous: run.nativeSessionRecovery,
            agentId: def.id,
            previousSessionId: agentResumePromptPolicy.resumeSessionId,
          });
          publishNativeSessionRecoveryMetadata();
          // Persisted to the per-run events.jsonl that the help → diagnostics
          // export bundles, so the whole resume → fail → auto-reseed chain is
          // visible in a support bundle without any user-facing signal.
          design.runs.emit(run, 'diagnostic', {
            type: 'agent_resume_auto_reseed',
            agent_id: def.id,
            reason: 'resume_failed',
            previous_session_id: agentResumePromptPolicy.resumeSessionId ?? null,
            stale_session_cleared: true,
            nativeSessionRecovery: run.nativeSessionRecovery,
          });
          scheduleRetryRestart(0);
          return;
```

</details>

**依据 15 · 源码核查**：[packages/dsh-runtime/src/index.ts:137-161](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/src/index.ts#L137-L161)

握手窗口取消latch。

<details>
<summary>查看原文（25行）</summary>

```text
function createCancellationLatch(cancelActiveAgent: () => void): CancellationLatch {
  const pendingRequestIds = new Set<string>();
  let activeRequest: { requestId: string; controller: AbortController } | undefined;

  const cancelActive = () => {
    if (!activeRequest || activeRequest.controller.signal.aborted) return;
    activeRequest.controller.abort();
    cancelActiveAgent();
  };

  return {
    activate(requestId, controller) {
      activeRequest = { requestId, controller };
      if (pendingRequestIds.delete(requestId)) cancelActive();
    },
    cancel(requestId) {
      if (activeRequest?.requestId === requestId) {
        cancelActive();
        return;
      }
      // The host can cancel during the child-spawn/profile-handshake window,
      // before the execute line has created its AbortController. Retain that
      // request-scoped intent and replay it as soon as execute becomes active.
      pendingRequestIds.add(requestId);
    },
```

</details>

**依据 16 · 源码核查**：[packages/dsh-runtime/src/index.ts:386-440](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/src/index.ts#L386-L440)

真实cancel解析→agent.cancel/execute。

<details>
<summary>查看原文（55行）</summary>

```text
  writeFrame(output, identityFrame('ready', PLUGIN_VERSION));
  const lines = createInterface({ input, crlfDelay: Infinity });
  let requestId: string | null = null;
  let handle: AgentHandle | undefined;
  let task: Promise<void> | undefined;
  const cancellation = createCancellationLatch(() => {
    handle?.agent.cancel({ kind: 'user' });
  });
  await new Promise<void>((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      lines.close();
      input.destroy();
      resolve();
    };
    lines.on('line', (line) => {
      if (line.trim() === '') return;
      let command;
      try {
        command = parseHostCommand(JSON.parse(line) as unknown);
      } catch {
        writeFrame(output, {
          v: 1,
          type: 'protocol_error',
          ...(requestId ? { request_id: requestId } : {}),
          code: 'DSH_PROFILE_INVALID_COMMAND',
          message: 'OpenDesign sent an invalid profile command.',
        });
        return;
      }
      if (command.type === 'cancel') {
        cancellation.cancel(command.request_id);
        return;
      }
      if (task) {
        writeFrame(output, {
          v: 1,
          type: 'protocol_error',
          request_id: command.request_id,
          code: 'DSH_PROFILE_BUSY',
          message: 'This profile process accepts exactly one execute command.',
        });
        return;
      }
      requestId = command.request_id;
      const taskAbort = new AbortController();
      cancellation.activate(requestId, taskAbort);
      task = execute(
        ctx,
        command,
        output,
        (nextHandle) => { handle = nextHandle; },
        taskAbort.signal,
```

</details>

**依据 17 · 源码核查**：[apps/daemon/src/server.ts:16934-16937](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L16934-L16937)

controller实际绑run。

```text
    }
    // Wire the acpSession onto the run so cancel() can call abort()
    // instead of raw SIGTERM (applies to pi-rpc and acp-json-rpc).
    run.acpSession = acpSession;
```

**依据 18 · 源码核查**：[apps/daemon/src/routes/runs.ts:3378-3383](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/runs.ts#L3378-L3383)

取消API实际调runs.cancel。

```text
    // Logical CAS wins before physical finish: the emitted end frame therefore
    // carries the terminal task projection and can never advertise a running
    // task after the cancel response already succeeded.
    await design.runs.cancel(cancelRun, 'user_stop');
    const body = { ok: true, run: statusWithStrategyTask(cancelRun) };
    res.json(body);
```

**依据 19 · 源码核查**：[apps/daemon/src/runtimes/runs.ts:2497-2535](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/runs.ts#L2497-L2535)

清重试、协议取消→进程树终止。

<details>
<summary>查看原文（39行）</summary>

```text
  const cancel = async (run, origin = 'unknown') => {
    if (TERMINAL_RUN_STATUSES.has(run.status)) return statusBody(run);
    run.cancelRequested = true;
    run.cancelOrigin = origin;
    run.updatedAt = Date.now();
    if (origin === 'user_stop') observeDiagnosticLifecycle(run, 'user_cancel', run.updatedAt);
    clearPendingRetryRestart(run);
    if (!run.child) {
      closeRunStdin(run);
      finish(run, 'canceled', null, 'SIGTERM');
      return statusBody(run);
    }

    const targetChild = run.child;
    const targetProcessGroupId = run.processGroupId;

    // Prefer RPC-level abort for agents that support it (pi, ACP adapters).
    // If the adapter does not exit within its grace window, fall back to
    // process signals and finally SIGKILL the process group.
    if (run.acpSession?.abort) {
      const graceMs = Number(process.env.PI_ABORT_GRACE_MS) || 3000;
      try {
        run.acpSession.abort();
      } catch {
        // Signal fallback below owns eventual process termination.
      }
      const termination = terminateProcessTree(
        run,
        targetChild,
        targetProcessGroupId,
        {
          gracefulWaitMs: graceMs,
          termGraceMs: graceMs,
          killGraceMs: forceWaitMs(),
          reason: 'run_cancel',
        },
      );
      const terminationResult = await termination;
      return finishCanceledFromChildState(run, terminationResult.forced ? 'SIGKILL' : 'SIGTERM');
```

</details>

**依据 20 · 源码核查**：[apps/daemon/src/runtimes/runs.ts:2270-2294](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/runs.ts#L2270-L2294)

POSIX TERM/KILL/等待实际分支。

<details>
<summary>查看原文（25行）</summary>

```text
    const task = (async () => {
      if (process.platform !== 'win32' && Number.isInteger(processGroupId)) {
        if (!processGroupIsAlive(processGroupId)) {
          return { quiescent: true, forced: false, remainingPids: [] };
        }
        if (
          gracefulWaitMs > 0
          && await waitForProcessGroupExit(processGroupId, gracefulWaitMs)
        ) {
          return { quiescent: true, forced: false, remainingPids: [] };
        }
        if (gracefulWaitMs > 0) closeRunStdin(run);
        const childAliveBeforeTerm = !childHasExited(child);
        if (deliverProcessGroupSignal(processGroupId, 'SIGTERM') && childAliveBeforeTerm) reportChildSignal();
        if (await waitForProcessGroupExit(processGroupId, termGraceMs)) {
          return { quiescent: true, forced: false, remainingPids: [] };
        }
        const childAliveBeforeKill = !childHasExited(child);
        if (deliverProcessGroupSignal(processGroupId, 'SIGKILL') && childAliveBeforeKill) reportChildSignal();
        const quiescent = await waitForProcessGroupExit(processGroupId, killGraceMs);
        return {
          quiescent,
          forced: true,
          remainingPids: quiescent ? [] : [processGroupId],
        };
```

</details>

**依据 21 · 源码核查**：[apps/daemon/src/runtimes/runs.ts:2364-2385](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/runs.ts#L2364-L2385)

枚举/回收不确定保留诊断。

<details>
<summary>查看原文（22行）</summary>

```text
      return {
        quiescent: enumerationVerified && remainingPids.length === 0,
        forced: forcedPids.length > 0,
        remainingPids,
        ...(!enumerationVerified ? { error: 'process enumeration unavailable' } : {}),
      };
    })().catch((error) => ({
      quiescent: false,
      forced: false,
      remainingPids: [],
      error: error instanceof Error ? error.message : String(error),
    })).then((result) => {
      if (!result.quiescent) {
        emit(run, 'diagnostic', {
          type: 'termination_failed',
          reason,
          child_pid: child?.pid ?? null,
          process_group_id: processGroupId ?? null,
          remaining_pids: result.remainingPids,
          ...(result.error ? { error: result.error } : {}),
        });
      }
```

</details>

#### 缺口

- 实际DSH版本/权限/模型循环、重发副作用和跨平台进程退出未运行验证
  **影响**：不能凭身份协议/终态证明全部交付、兼容或已取消所有副作用；小样必须核实际项目/进程/文件
  **进一步探讨**：后续隔离profile做ready/缺终态/错误resume/max-tokens、cancel与重启矩阵，分别核子进程与已写/已发动作，不重放结果未知的写任务。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 制品门和预览在实际哪条调用链上，能挡什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

本轮选od artifacts create这条本地代表链：CLI读取input/可选manifest、解析目标project，然后postCreateArtifactRequest把artifact:true、overwrite:false等JSON发/api/projects/:id/files；route对artifact:true调用createProjectArtifactFile，后者验证/推断manifest再把overwrite:false、manifest交writeProjectFile。路径经sanitizePath/resolveSafeReal，既有同名报EEXIST。route实际把PUBLICATION_BLOCKED映射422、同名409和manifest问题400，不是仅一个未使用的质量helper。

writeProjectFile仅在有效manifest且kind html/deck时调用assertArtifactPublicationAllowed。guard对五个特定pitch-deck大小写敏感子串查找：可挡已知模板空槽，却不能验证事实、布局、来源、所有占位语义或设计系统。普通无manifest写、其他kind、Agent直接文件写等不由此路径证明覆盖；不能从注释“every artifact”扩大为全产品每条发布入口都经过门。它的publication一词在这里是本地制品写入，不自动等公网分享。

当前还已有stub regression guard：带identifier的html/deck比较同目录先前大小，默认warn、比例0.2、先前至少4096 bytes，配置可reject/off；warn仍可写，不是默认拒绝所有退化。最终先writeFile正文再写旁置manifest、stat读结果；不是原子多文件事务，manifest/后续version capture等失败可能留下已写正文，不能见500便盲目重复创建。创建overwrite:false是预查存在后普通writeFile，不据此宣称并发独占创建或未知结果幂等。所选HTML route有version lock/捕获，响应可带versionWarning，也不能把版本记录当内容验证。

可见预览确有活动组件：DesignFilesPanel把srcDoc放allow-scripts allow-downloads的iframe；PreviewModal把srcDoc放allow-scripts/allow-popups/allow-popups-to-escape-sandbox iframe。两处未给allow-same-origin是有隔离意图的局部证据，但不是所有预览面一律禁脚本/弹窗/网络；弹窗允许离开iframe sandbox更不能简化为彻底安全。预览沙箱与Agent工具/OS文件权限是不同边界，spawn shell:false也不等编码Agent不能用自己的shell/工具。companion patch叠在用户dsh-base上，凭据/工具/settings由用户Harness持有，模型/技能及HTML应按信任输入管理。

因此成功验收是正确项目与manifest、读回实际内容、预览/交互和brief/设计系统人工核对，不是completed、生成文件、占位词没命中或版本warning没弹。大规模发布、外部资源/CSP、所有预览/插件/云入口和安装器权限不在本轮代表链范围，未运行。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/cli.ts:410-413](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/cli.ts#L410-L413)

真实artifacts子命令映射。

```text
const SUBCOMMAND_MAP = {
  agent: runAgent,
  artifacts: runArtifacts,
  media: runMedia,
```

**依据 2 · 源码核查**：[apps/daemon/src/cli.ts:1052-1056](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/cli.ts#L1052-L1056)

实际按first执行subcommand。

```text
if (first && SUBCOMMAND_MAP[first]) {
  const idx = argv.indexOf(first);
  const rest = [...argv.slice(0, idx), ...argv.slice(idx + 1)];
  await SUBCOMMAND_MAP[first](rest);
  // Respect a non-zero exit code a handler set via process.exitCode (e.g. a
```

**依据 3 · 源码核查**：[apps/daemon/src/cli.ts:1965-1967](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/cli.ts#L1965-L1967)

真实调用runArtifactsCli并传播exitCode。

```text
async function runArtifacts(args) {
  const { exitCode } = await runArtifactsCli(args);
  process.exit(exitCode);
```

**依据 4 · 源码核查**：[apps/daemon/src/server.ts:9365-9371](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L9365-L9371)

实际装载project routes。

```text
  registerProjectRoutes(app, {
    db,
    publicFileMutations,
    stopPublicFilesBeforeDelete,
    design,
    // Test seam for the POST /api/projects preparation deadline; production
    // keeps the route's 15s default when the variable is unset or invalid.
```

**依据 5 · 源码核查**：[apps/daemon/src/routes/project/index.ts:7761-7773](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/index.ts#L7761-L7773)

实际files POST route。

<details>
<summary>查看原文（13行）</summary>

```text
  app.post(
    '/api/projects/:id/files',
    (req, res, next) => {
      upload.single('file')(req, res, (err: any) => {
        if (err) return sendMulterError(res, err);
        next();
      });
    },
    publicFileMutationHandler(ctx.publicFileMutations, async (req, res) => {
      try {
        const projectId = typeof req.params.id === 'string' ? req.params.id : '';
        const uploadProject = getProject(db, projectId);
        const cleanupRejectedUpload = () => {
```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/artifacts-cli.ts:117-141](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/artifacts-cli.ts#L117-L141)

CLI实际读取/创建请求/可见返回。

<details>
<summary>查看原文（25行）</summary>

```text
  try {
    const daemonUrl = await resolveDaemonUrl(
      options.daemonUrl === undefined ? {} : { flagUrl: options.daemonUrl },
    );
    const { id, resolved, active } = await resolveProjectArg(daemonUrl, options.project);
    const fileBuffer = await readFile(options.inputPath);
    const content = options.encoding === 'base64' ? fileBuffer.toString('base64') : fileBuffer.toString('utf8');
    const artifactManifest = options.manifestPath === undefined
      ? undefined
      : await readJsonObject(options.manifestPath);
    const response = await postCreateArtifactRequest({
      baseUrl: daemonUrl,
      projectId: id,
      input: {
        name: options.name,
        content,
        encoding: options.encoding,
        ...(artifactManifest === undefined ? {} : { artifactManifest }),
      },
    });
    const payload = response && typeof response === 'object' && !Array.isArray(response)
      ? (response as JsonObject)
      : { result: response };
    writeJson({ ok: true, ...withActiveEcho(payload, active, resolved) });
    return { exitCode: 0 };
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/artifacts/create.ts:44-84](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/artifacts/create.ts#L44-L84)

显式artifact标记、manifest验证和overwrite:false。

<details>
<summary>查看原文（41行）</summary>

```text
export function buildCreateArtifactRequestBody(input: CreateProjectArtifactInput): JsonObject {
  return {
    name: input.name,
    content: input.content,
    encoding: input.encoding === 'base64' ? 'base64' : 'utf8',
    artifact: true,
    overwrite: false,
    ...(input.artifactManifest === undefined ? {} : { artifactManifest: input.artifactManifest }),
  };
}

export function resolveCreateArtifactManifest(input: CreateProjectArtifactInput): unknown {
  const manifest = input.artifactManifest !== undefined && input.artifactManifest !== null
    ? input.artifactManifest
    : inferLegacyManifest(input.name);
  if (manifest) {
    const validated = validateArtifactManifestInput(manifest, input.name);
    if (!validated.ok) {
      throw new ArtifactManifestInvalidError(validated.error);
    }
    return validated.value;
  }
  throw new ArtifactManifestRequiredError(input.name);
}

export async function createProjectArtifactFile(options: CreateProjectArtifactOptions): Promise<unknown> {
  const { input } = options;
  const body = input.encoding === 'base64'
    ? Buffer.from(input.content, 'base64')
    : Buffer.from(input.content, 'utf8');
  return await options.writeProjectFile(
    options.projectsRoot,
    options.projectId,
    input.name,
    body,
    {
      overwrite: false,
      artifactManifest: resolveCreateArtifactManifest(input),
    },
    options.metadata,
  );
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/artifacts/create.ts:87-120](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/artifacts/create.ts#L87-L120)

实际POST本地文件API和失败处理。

<details>
<summary>查看原文（34行）</summary>

```text
export async function postCreateArtifactRequest(args: {
  baseUrl: string;
  projectId: string;
  input: CreateProjectArtifactInput;
  headers?: Record<string, string>;
}): Promise<unknown> {
  const response = await fetch(
    `${args.baseUrl.replace(/\/$/, '')}/api/projects/${encodeURIComponent(args.projectId)}/files`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...args.headers,
      },
      body: JSON.stringify(buildCreateArtifactRequestBody(args.input)),
    },
  );
  const text = await response.text();
  let body: unknown = text;
  if (text.length > 0) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { message: text };
    }
  }
  if (!response.ok) {
    const error = new Error(`daemon artifact endpoint failed with ${response.status}`);
    (error as Error & { details?: unknown; status?: number }).details = body;
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return body;
```

</details>

**依据 9 · 源码核查**：[apps/daemon/src/routes/project/index.ts:7892-7937](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/index.ts#L7892-L7937)

route artifact分支实际create/write。

<details>
<summary>查看原文（46行）</summary>

```text
        if (artifactManifest !== undefined && artifactManifest !== null) {
          const validated = validateArtifactManifestInput(
            artifactManifest,
            name,
          );
          if (!validated.ok) {
            return sendApiError(
              res,
              400,
              'BAD_REQUEST',
              `invalid artifactManifest: ${validated.error}`,
            );
          }
        }
        const buf =
          encoding === 'base64'
            ? Buffer.from(content, 'base64')
            : Buffer.from(content, 'utf8');
        const writeAndCapture = async (versionLock?: HtmlVersionLock) => {
          const parentVersionId = uploadProject && requestedSource === 'manual' && versionLock
            ? await matchedHtmlParentVersionId(
              uploadProject,
              desiredName,
              requestedParentVersionId,
              versionLock,
            )
            : undefined;
          const meta = artifact === true
            ? await createProjectArtifactFile({
              projectsRoot: PROJECTS_DIR,
              projectId: projectId,
              input: { name, content, encoding, artifactManifest },
              metadata: uploadProject?.metadata,
              writeProjectFile,
            })
            : await writeProjectFile(
              PROJECTS_DIR,
              projectId,
              name,
              buf,
              {
                artifactManifest,
                ...(overwrite === false ? { overwrite: false } : {}),
              },
              uploadProject?.metadata,
            );
```

</details>

**依据 10 · 源码核查**：[apps/daemon/src/routes/project/index.ts:7965-8010](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/index.ts#L7965-L8010)

version lock/响应warning及明确错误码。

<details>
<summary>查看原文（46行）</summary>

```text
        const { meta, versionCapture } = uploadProject && requestedSource
          ? await withProjectFileVersionLock(
            PROJECTS_DIR,
            projectId,
            desiredName,
            uploadProject.metadata,
            (versionLock) => writeAndCapture(versionLock),
          )
          : await writeAndCapture();
        /** @type {import('@open-design/contracts').ProjectFileResponse} */
        const body = {
          file: meta,
          ...(versionCapture ? { version: versionCapture.version } : {}),
          ...(versionCapture?.versionWarning ? { versionWarning: versionCapture.versionWarning } : {}),
        };
        res.json(body);
      } catch (err: any) {
        const message = String(err?.message || err);
        if (/^invalid (source|versionSource);/u.test(message)) {
          return sendApiError(res, 400, 'BAD_REQUEST', message);
        }
        if (err instanceof ArtifactRegressionError) {
          return sendApiError(res, 422, 'ARTIFACT_REGRESSION', err.message, {
            details: {
              identifier: err.identifier,
              newSize: err.newSize,
              priorSize: err.priorSize,
              priorName: err.priorName,
            },
          });
        }
        if (err instanceof ArtifactPublicationBlockedError) {
          return sendApiError(res, 422, 'ARTIFACT_PUBLICATION_BLOCKED', err.message, {
            details: { placeholders: err.placeholders },
          });
        }
        if (err?.code === 'EEXIST') {
          return sendApiError(res, 409, 'FILE_EXISTS', 'file already exists');
        }
        if (err?.code === 'ARTIFACT_MANIFEST_REQUIRED') {
          return sendApiError(res, 400, 'ARTIFACT_MANIFEST_REQUIRED', err.message);
        }
        if (err?.code === 'ARTIFACT_MANIFEST_INVALID') {
          return sendApiError(res, 400, 'BAD_REQUEST', err.message);
        }
        sendApiError(res, 500, 'INTERNAL_ERROR', 'upload failed');
```

</details>

**依据 11 · 源码核查**：[apps/daemon/src/projects.ts:872-902](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/projects.ts#L872-L902)

safe path和guard真实write caller条件。

<details>
<summary>查看原文（31行）</summary>

```text
  assertVisibleForImportedProject(name, metadata);
  const dir = await ensureProject(projectsRoot, projectId, metadata);
  const safeName = sanitizePath(name);
  const target = await resolveSafeReal(dir, safeName);
  body = normalizeArtifactRuntimeImports(safeName, body);
  if (!overwrite) {
    try {
      await stat(target);
      const err = new Error('file already exists');
      err.code = 'EEXIST';
      throw err;
    } catch (err) {
      if (!err || err.code !== 'ENOENT') throw err;
    }
  }
  await mkdir(path.dirname(target), { recursive: true });
  let stubGuardWarning = null;
  let validatedManifest = null;
  if (artifactManifest && typeof artifactManifest === 'object') {
    const validated = validateArtifactManifestInput(artifactManifest, safeName);
    if (validated.ok && validated.value) {
      validatedManifest = validated.value;
      // Publication guard: HTML/deck artifacts that still contain template
      // placeholders (e.g. pitch-deck `Name to confirm`, `$X.XM`) must not
      // land as published files. Runs at the write boundary so it covers
      // every artifact that flows through writeProjectFile, regardless of
      // which agent/atom produced the body. Throws
      // ArtifactPublicationBlockedError which the route layer maps to 422.
      if (isPublicationGuardedArtifactKind(validatedManifest.kind)) {
        assertArtifactPublicationAllowed(body);
      }
```

</details>

**依据 12 · 源码核查**：[apps/daemon/src/artifacts/publication-guard.ts:32-43](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/artifacts/publication-guard.ts#L32-L43)

有限kind与五子串。

<details>
<summary>查看原文（12行）</summary>

```text
export const PUBLICATION_GUARDED_ARTIFACT_KINDS: ReadonlySet<string> = new Set(['html', 'deck']);

// Markers shipped by the html-ppt-pitch-deck example template that
// indicate an unresolved fundraising slot. Each is a substring; matching
// is case-sensitive because the template emits these literally.
export const UNRESOLVED_ARTIFACT_PLACEHOLDERS = [
  'Name to confirm',
  '$X.XM',
  'Replace this panel with',
  'Replace role placeholders',
  'Your form answer only said',
] as const;
```

</details>

**依据 13 · 源码核查**：[apps/daemon/src/artifacts/publication-guard.ts:60-88](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/artifacts/publication-guard.ts#L60-L88)

字符串/二进制检测与抛错。

<details>
<summary>查看原文（29行）</summary>

```text
export function findUnresolvedArtifactPlaceholders(value: unknown): string[] {
  const text = stringifyArtifactContent(value);
  if (!text) return [];
  return UNRESOLVED_ARTIFACT_PLACEHOLDERS.filter((placeholder) =>
    text.includes(placeholder),
  );
}

export function shouldBlockArtifactPublication(value: unknown): boolean {
  return findUnresolvedArtifactPlaceholders(value).length > 0;
}

export function buildArtifactPublicationBlockedMessage(placeholders: readonly string[]): string {
  const list = placeholders.length > 0 ? placeholders.join(', ') : 'unknown placeholders';
  return `Artifact still contains unresolved pitch-deck placeholders: ${list}. Provide the required pitch facts before publishing.`;
}

export function assertArtifactPublicationAllowed(value: unknown): void {
  const placeholders = findUnresolvedArtifactPlaceholders(value);
  if (placeholders.length > 0) {
    throw new ArtifactPublicationBlockedError(placeholders);
  }
}

function stringifyArtifactContent(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Buffer.isBuffer(value)) return value.toString('utf8');
  if (value instanceof Uint8Array) return Buffer.from(value).toString('utf8');
  return '';
```

</details>

**依据 14 · 源码核查**：[apps/daemon/src/projects.ts:903-947](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/projects.ts#L903-L947)

stub guard/warn/reject及正文→manifest非事务写序。

<details>
<summary>查看原文（45行）</summary>

```text
      const identifier = typeof validatedManifest.metadata?.identifier === 'string'
        ? validatedManifest.metadata.identifier
        : '';
      // Stub-guard applies to HTML-rendered manifest kinds (html, deck).
      // Other kinds (markdown, svg, code-snippet) can legitimately be small
      // and are skipped.
      if (identifier.length > 0 && STUB_GUARDED_MANIFEST_KINDS.has(validatedManifest.kind)) {
        // Scan the directory the new file actually lands in, not the project
        // root — writeProjectFile accepts nested paths like reports/X.html
        // and a root-only scan would miss prior siblings in subdirectories.
        const guard = await evaluateArtifactStubGuard({
          scanDir: path.dirname(target),
          identifier,
          newSize: Buffer.byteLength(body),
          config: readArtifactStubGuardConfigFromEnv(),
        });
        if ((guard.outcome === 'reject' || guard.outcome === 'warn') && guard.warning) {
          // Operator-visible signal regardless of mode, so on-call can see
          // how often the guard fires without combing through 422s.
          console.warn(
            `[stub-guard] ${guard.outcome} identifier=${guard.warning.identifier} ` +
              `newSize=${guard.warning.newSize} priorSize=${guard.warning.priorSize} ` +
              `priorName=${guard.warning.priorName} project=${projectId}`,
          );
        }
        if (guard.outcome === 'reject' && guard.warning) {
          throw new ArtifactRegressionError(guard.warning.message, {
            identifier: guard.warning.identifier,
            newSize: guard.warning.newSize,
            priorSize: guard.warning.priorSize,
            priorName: guard.warning.priorName,
          });
        }
        if (guard.outcome === 'warn' && guard.warning) {
          stubGuardWarning = guard.warning;
        }
      }
    }
  }
  await writeFile(target, body);
  await projectFileWriteTestHooks.afterCommit?.({ safeName, target, body });
  if (validatedManifest) {
    const manifestFileName = artifactManifestNameFor(safeName);
    const manifestTarget = await resolveSafeReal(dir, manifestFileName);
    await writeFile(manifestTarget, JSON.stringify(validatedManifest, null, 2));
```

</details>

**依据 15 · 源码核查**：[apps/daemon/src/artifacts/stub-guard.ts:67-71](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/artifacts/stub-guard.ts#L67-L71)

默认warn/比例/最低prior字节。

```text
export const DEFAULT_ARTIFACT_STUB_GUARD_CONFIG: ArtifactStubGuardConfig = {
  mode: 'warn',
  minRetainedRatio: 0.2,
  minPriorBytes: 4096,
};
```

**依据 16 · 源码核查**：[apps/web/src/components/DesignFilesPanel.tsx:2214-2223](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/web/src/components/DesignFilesPanel.tsx#L2214-L2223)

实际缩略iframe及sandbox权限。

<details>
<summary>查看原文（10行）</summary>

```text
  return (
    <div ref={hostRef} className="df-thumb-scale-host">
      {tooLargeForThumbnail || srcDoc === null ? (
        <FilePreviewPlaceholder file={file} />
      ) : (
        <iframe
          title={file.name}
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-downloads"
          loading="lazy"
```

</details>

**依据 17 · 源码核查**：[apps/web/src/components/PreviewModal.tsx:1054-1062](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/web/src/components/PreviewModal.tsx#L1054-L1062)

实际modal iframe允许脚本/弹窗及逃逸。

```text
            ) : (
              <div className="ds-modal-stage-iframe-scaler" style={scalerStyle}>
                <iframe
                  key={activeView?.id ?? 'view'}
                  ref={previewIframeRef}
                  title={`${title} ${activeView?.label ?? ''}`}
                  sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  srcDoc={srcDoc}
                />
```

**依据 18 · 源码核查**：[packages/dsh-runtime/cordis.patch.yml:1-20](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/cordis.patch.yml#L1-L20)

companion叠加用户Harness配置，不承诺OS工具沙箱。

<details>
<summary>查看原文（20行）</summary>

```text
# OpenDesign's stdio profile surface over the official dsh-base composition.
# The user's Harness installation owns credentials, settings, tools, sessions,
# and provider adapters. This bundle adds only the OD protocol boundary.

- id: system-prompt
  config:
    persona: >-
      You are a coding and design agent running for OpenDesign. Follow the
      complete task and project context supplied in the current user message.

- id: hmr
  disabled: true

- insert:
    - id: open-design-startup
      name: '@open-design/dsh-runtime/startup'

    - id: open-design-runtime
      name: '@open-design/dsh-runtime'
      inject: [openDesignStartup]
```

</details>

#### 缺口

- 没有实际制品/并发/半写/浏览器和Agent权限实验，其他所有写/云发布与预览面未全审
  **影响**：局部门只能减已知错误，不保证设计合格、全入口质量/幂等或不受信代码安全
  **进一步探讨**：未来在隔离副本测已知marker/普通错误/大小退化/同名并发/manifest写失败，读回文件与版本后人工盲评；不在生产重复未知提交。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 评论的活动链如何保留身份/重试，批回执能否代表反馈落实？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

本轮闭合一条实际本地评论→异步中转链。POST conversation comments先核conversation、workspace mutation/context，剥客户端author/sourceFile字段后按当前caller盖身份、编辑检查作者；syncEnabled条件满足时在同一SQLite transaction里upsert本地评论并经onCommentCreated要求durable relay意图成功，返回comment不是远端已经收到。server实际callback→collabCloud.enqueueComment；后者把workspace/member/team/project等scope与payload放outbox，已started时安排flush。

server在有Vela client时选它，否则才可选HTTP cloud client；有client才创建CloudService并接真实SQLite outbox。drain按身份/当前记录、file retirement/binding与publication witness再检查后单条pushComment，eventKey作幂等key，已删评论另用稳定compact-delete key；成功后ACK只删相同workspace/member/project/comment/revision，旧在途ACK不删后来编辑，这是实际SQL条件而非只注释。失败defer，413持久failed不靠时间自动恢复，需要编辑/明确retry；share-stopped等权威终态可discard。远端幂等实现、最终云存储和所有scope转换本轮未全审，不能给exactly-once承诺。

需纠正旧稿可能被读宽的一点：严格comment-batch-receipt helper确实校验完整key集合、重复/遗漏/ok与error/status一致性，Vela client的pushCommentBatch也实际调用它，但本轮固定Git源内这条drain使用pushComment；定向tracked TS/TSX/JS检索未找到把batch方法接入本活动drain的caller。不能用批parser证明当前全部云评论路径有该强校验，亦不把未找到caller泛化为功能绝不可能被其他消费者用。

代表Vela单条client有具体差异：runJson空stdout返回{}，其余只JSON.parse；pushComment把非数字seq折成0后返回，外层只要调用未抛错便revision ACK并onCommentPushed。因此不能把CLI进程正常/可解析空对象与服务确认写入等同，丢失ACK/返回形状异常和云端可能已写的情况需对账；UI编号确认还在其他回调里，不能直接断言面板一定显示成功。此为固定源码条件推断，未运行假CLI或真实网络复现。

已有scope/作者检查、durable intent、发布witness、稳定重试key和revision ACK是实质贡献，不能再把“给评论绑版本/可靠队列”统统当未来新功能。它们保证的是特定评论传输/本地记录关系，不是Agent确实按评论修改了正确制品或设计已通过。云同步/公网分享会携评论/身份等出本机，local-first不是所有路径离线或无第三方；本轮采用先不启用分享/云同步，数据处理政策、团队角色全矩阵和真实运营未知。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/routes/project/index.ts:5717-5722](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/index.ts#L5717-L5722)

project routes实际装载conversation routes并传ctx。

```text
  registerProjectConversationRoutes(app, {
    ...ctx,
    enforceWorkspaceProjectMutation,
    authorizeProjectRequest,
    sendApiError,
  });
```

**依据 2 · 源码核查**：[apps/daemon/src/routes/project/conversations.ts:749-752](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/conversations.ts#L749-L752)

conversation routes实际装载comment routes。

```text
  });

  registerProjectCommentRoutes(app, ctx);
}
```

**依据 3 · 源码核查**：[apps/daemon/src/server.ts:4758-4760](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L4758-L4760)

已送出回调另做本地编号/authorKey确认，不把ACK扩为UI已全成功。

```text
        onCommentPushed: ({ projectId, commentId, seq, memberId, authorKey }) => {
          confirmPreviewCommentPinSeq(db, projectId, commentId, seq);
          if (authorKey) confirmPreviewCommentAuthorKey(db, projectId, commentId, memberId, authorKey);
```

**依据 4 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:588-650](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/comments.ts#L588-L650)

活动POST/context/服务器身份/编辑约束。

<details>
<summary>查看原文（63行）</summary>

```text
  app.post('/api/projects/:id/conversations/:cid/comments', async (req, res) => {
    const conv = getRoutableConversation(req.params.id, req.params.cid);
    if (!conv) {
      return res.status(404).json({ error: 'conversation not found' });
    }
    if (!await enforceCommentWorkspaceMutation(req, res, req.params.id)) return;
    const workspaceResolution = await resolveRequestWorkspaceContext(
      req,
      req.params.id,
    );
    if (!workspaceResolution.ok) {
      return sendWorkspaceResolutionError(res, workspaceResolution);
    }
    const workspaceContext = workspaceResolution.context;
    try {
      // Server-authoritative author: stamp the current member id so the stored
      // (and pushed) comment carries who wrote it, rather than trusting the body.
      // New comments do not use a natural element key; editing requires an id
      // and is author-only.
      const body = { ...(req.body || {}) };
      // Author identity is server-stamped. Strip every client-supplied author
      // field before resolving the caller so an absent caller cannot inherit a
      // forged member or share-page user identity into SQLite.
      delete body.authorMemberId;
      delete body.authorKind;
      delete body.authorAppUserId;
      delete body.authorDisplayName;
      delete body.authorKey;
      delete body.sourceFileId;
      delete body.sourceFilePath;
      // This is a transport anti-abuse ceiling, not a product character limit.
      // Keep it server-side: CLI and UI must send the body unchanged and let the
      // route reject a pathological UTF-8 payload without creating a row.
      if (jsonBodyByteLength(req) > SHARE_COMMENT_MAX_BYTES) {
        return sendCommentPayloadTooLarge(res);
      }
      const authorMemberId = await resolveCaller(req, workspaceContext);
      const requestedId = typeof body.id === 'string' && body.id.trim() ? body.id.trim() : '';
      let existing: PreviewComment | null = null;
      if (requestedId) {
        existing = getRequestPreviewComment(
          req.params.id,
          req.params.cid,
          requestedId,
          workspaceContext,
        );
        if (!existing) {
          return res.status(404).json({ error: 'comment not found' });
        }
        if (hasExternalCommentAuthor(existing)) {
          return res.status(403).json({ error: 'not permitted' });
        }
        const existingAuthor = existing.authorMemberId ?? null;
        if (existingAuthor) {
          if (!authorMemberId || existingAuthor !== authorMemberId) {
            return res.status(403).json({ error: 'not permitted' });
          }
          body.authorMemberId = existingAuthor;
        } else if (authorMemberId) {
          body.authorMemberId = authorMemberId;
        }
      } else if (authorMemberId) {
        body.authorMemberId = authorMemberId;
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:658-685](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/comments.ts#L658-L685)

本地comment与relay意图同事务。

<details>
<summary>查看原文（28行）</summary>

```text
      }
      // Resolved BEFORE the upsert (not just before the push below) so a
      // genuinely new comment's pin_seq starts unconfirmed on a team-shared
      // project — see UpsertPreviewCommentOptions in db.ts. Ignored on the
      // edit branch, so computing it here for an edit-via-POST is harmless.
      const syncEnabled = isLocalTeamRelayCandidate(
        req.params.id,
        body.target?.filePath ?? existing?.filePath ?? '',
        workspaceContext,
        Boolean(ctx.onCommentCreated),
      );
      const targetConversationId = requestedId
        ? existing?.conversationId ?? req.params.cid
        : req.params.cid;
      // Local row + durable relay intent commit atomically. Network delivery is
      // still asynchronous, so a Vela outage never delays this transaction.
      const comment = db.transaction(() => {
        const saved = upsertPreviewComment(db, req.params.id, targetConversationId, body, {
          pinPendingCloudConfirm: syncEnabled,
        });
        updateProject(db, req.params.id, {});
        if (saved && syncEnabled) {
          // SAFETY: the DB normalizer returns the PreviewComment fields consumed by the relay.
          requireRelayEnqueued(ctx.onCommentCreated?.(
            saved as unknown as PreviewComment,
            workspaceContext,
          ));
        }
```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:743-746](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/routes/project/comments.ts#L743-L746)

只返回本地comment/错误。

```text
      res.json({ comment });
    } catch (err: any) {
      res.status(400).json({ error: String(err?.message || err) });
    }
```

**依据 7 · 源码核查**：[apps/daemon/src/server.ts:9589-9602](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L9589-L9602)

实际onCommentCreated/Updated→enqueue。

<details>
<summary>查看原文（14行）</summary>

```text
          onCommentCreated: (comment, context) => {
            if (!context) return;
            const enqueued = collabCloud.enqueueComment(comment, context);
            if (!enqueued) {
              console.warn('[od] refused to enqueue comment without exact Team authority');
            }
            return enqueued;
          },
          onCommentUpdated: (comment, context) => {
            if (!context) return;
            const enqueued = collabCloud.enqueueComment(comment, context);
            if (!enqueued) {
              console.warn('[od] refused to enqueue comment update without exact Team authority');
            }
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/server.ts:4570-4570](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L4570-L4570)

真实Vela优先HTTP fallback选择。

```text
  const collabCloudClient = velaCliCollabClient ?? createCollabCloudClientFromEnv();
```

**依据 9 · 源码核查**：[apps/daemon/src/server.ts:4615-4623](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/server.ts#L4615-L4623)

CloudService实际client与SQLite outbox。

```text
  const collabCloud = collabCloudClient
    ? createCollabCloudService({
        client: collabCloudClient,
        commentOutbox: createCommentRelayOutboxStore(db),
        // C3-LITE member comment pages (BO1), served by the AMR API through the
        // Vela CLI. The HTTP relay (OD_COLLAB_CLOUD_URL) has no paged route, so
        // it keeps the legacy pull. An unusable cursor is rebuilt from a fresh
        // snapshot in the same drain (BO2).
        ...(velaCliCollabClient ? { memberCommentStore: createCommentInboundStore(db) } : {}),
```

**依据 10 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:665-690](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/collab-cloud-service.ts#L665-L690)

实际scope outbox enqueue/flush触发。

<details>
<summary>查看原文（26行）</summary>

```text
			return false;
		const cloud = previewCommentToCloud(comment, identity.memberId);
		if (deleted) {
			cloud.deleted = true;
			cloud.updatedAt = now();
		}
		try {
			deps.commentOutbox.enqueue({
				workspaceId: context.workspaceId,
				workspaceMemberId: identity.memberId,
				teamId: identity.teamId,
				relayScope: identity.relayScope,
				projectId: comment.projectId,
				expectedOwnerMemberId,
				comment: commentRelayPayload(cloud),
			});
		} catch (error) {
			deps.onError?.(error);
			return false;
		}
		if (started) {
			queueMicrotask(() => {
				void flushPendingComments().catch((error) => deps.onError?.(error));
			});
		}
		return true;
```

</details>

**依据 11 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:759-825](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/collab-cloud-service.ts#L759-L825)

drain活记录/发布witness、单条push/idempotency和ACK/defer。

<details>
<summary>查看原文（67行）</summary>

```text
	async function pushOutboxRecord(
		record: CommentRelayOutboxRecord,
		identity: { teamId: string; memberId: string },
		bindingCurrent?: (record: CommentRelayOutboxRecord) => boolean,
	): Promise<void> {
		try {
			if (deps.commentOutbox?.isCurrent && !deps.commentOutbox.isCurrent(record)) return;
			if (deps.validateCommentRelayFile?.(record) === 'retired') {
				deps.commentOutbox?.acknowledge(record);
				return;
			}
			if (bindingCurrent && !bindingCurrent(record)) {
				deferOutboxRecord(record, new Error("comment relay project binding unsettled; retry"));
				return;
			}
			// Recheck each publication-bound record immediately before network I/O:
			// an earlier record may have awaited while stop/re-publish changed the witness.
			if (
				record.publication &&
				!deps.commentOutbox?.isPublicationCurrent?.(record)
			) {
				deps.commentOutbox?.acknowledge(record);
				return;
			}
			const result = await deps.client.pushComment(
				identity.teamId,
				record.projectId,
				commentRelayPayload(record.publication
					? {
							...record.comment,
							filePath: record.publication.publicFilePath,
							publicationSlug: record.publication.slug,
						}
					: record.comment),
				// Legacy full-content tombstones may already have a lost-ACK receipt.
				// Use a stable new key for the compact wire format, avoiding a same-key
				// different-payload conflict while keeping retries idempotent.
				record.comment.deleted
					? createHash("sha256").update(`compact-delete-v1:${record.eventKey}`).digest("hex")
					: record.eventKey,
				// Only the durable owner-mediated publication relay may request an
				// original member. Vela independently verifies this owner, active
				// publication and same-team directory before honoring the hint.
				record.publication && record.comment.memberId && record.comment.memberId !== identity.memberId
					? record.comment.memberId : undefined,
			);
			// Revision-conditional ACK: if an edit/delete was queued while this
			// payload was in flight, its newer row remains for the next drain.
			deps.commentOutbox?.acknowledge(record, "delivered");
			if (!record.comment.deleted) {
				deps.onCommentPushed?.({
					projectId: record.projectId,
					commentId: record.commentId,
					seq: result.seq,
					memberId: record.workspaceMemberId,
					...(result.authorKey ? { authorKey: result.authorKey } : {}),
				});
			}
		} catch (error) {
			if (isShareStoppedRelayError(error)) {
				// The server has authoritatively closed this share. A revision-conditional
				// ACK preserves a newer local edit that raced this rejected request.
				deps.commentOutbox?.acknowledge(record);
				deps.onError?.(error);
				return;
			}
			deferOutboxRecord(record, error);
```

</details>

**依据 12 · 源码核查**：[apps/daemon/src/collab/comment-relay-outbox.ts:361-368](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/comment-relay-outbox.ts#L361-L368)

ACK SQL实际revision条件。

```text
	const acknowledgeRow = db.prepare(`
    DELETE FROM comment_relay_outbox
     WHERE workspace_id = ?
       AND workspace_member_id = ?
       AND project_id = ?
       AND comment_id = ?
       AND revision = ?
  `);
```

**依据 13 · 源码核查**：[apps/daemon/src/collab/comment-relay-outbox.ts:494-507](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/comment-relay-outbox.ts#L494-L507)

实际条件DELETE及后续状态只在changed。

<details>
<summary>查看原文（14行）</summary>

```text
		acknowledge(record, outcome = "discarded") {
			return db.transaction(() => {
				const changed =
					acknowledgeRow.run(
						record.workspaceId,
						record.workspaceMemberId,
						record.projectId,
						record.commentId,
						record.revision,
					).changes > 0;
				// Revision-conditional deletion is the race fence: an older in-flight
				// acknowledgement cannot affect an overwritten queue row or its batch.
				if (changed) {
					markPublishedCommentBackfillOutcome(db, record, outcome);
```

</details>

**依据 14 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:702-715](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/collab-cloud-service.ts#L702-L715)

413不无限自动重试。

<details>
<summary>查看原文（14行）</summary>

```text
	function deferOutboxRecord(
		record: CommentRelayOutboxRecord,
		error: unknown,
	): void {
		const attemptCount = record.attemptCount + 1;
		const message = error instanceof Error ? error.message : String(error);
		const payloadTooLarge = error instanceof CollabCloudError && error.status === 413;
		deps.commentOutbox?.defer(record, {
			// A 413 will not heal with time. Keep this exact revision durable and
			// visible as failed; an edit/delete or explicit Retry makes it due again.
			nextAttemptAt: payloadTooLarge
				? Number.MAX_SAFE_INTEGER : now() + Math.max(0, retryDelayMs(attemptCount)),
			error: payloadTooLarge ? "PAYLOAD_TOO_LARGE" : message,
		});
```

</details>

**依据 15 · 源码核查**：[apps/daemon/src/collab/comment-batch-receipt.ts:1-35](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/comment-batch-receipt.ts#L1-L35)

严格批parser只证明本helper契约。

<details>
<summary>查看原文（35行）</summary>

```text
import { COMMENT_BATCH_MAX_ITEMS, type CommentBatchPushRequest, type CommentBatchPushResponse } from '@open-design/contracts';

/** Validate the whole receipt before any caller may acknowledge individual rows. */
export function parseCommentBatchReceipt(stdout: string, request: CommentBatchPushRequest): CommentBatchPushResponse {
  let value: unknown;
  try { value = JSON.parse(stdout); } catch { throw new Error('Invalid comment batch receipt'); }
  if (!value || typeof value !== 'object' || !('results' in value) || !Array.isArray(value.results)) throw new Error('Invalid comment batch receipt');
  const remaining = new Set(request.comments.map(item => item.key));
  const results: CommentBatchPushResponse['results'][number][] = [];
  for (const item of value.results) {
    if (!item || typeof item !== 'object' || typeof item.key !== 'string' || !remaining.delete(item.key)
      || typeof item.ok !== 'boolean'
      || (item.error !== undefined && typeof item.error !== 'string')
      || (item.errorCode !== undefined && typeof item.errorCode !== 'string')
      || (item.status !== undefined && (!Number.isInteger(item.status) || item.status < 400 || item.status > 599))
      || (item.ok && (item.error !== undefined || item.errorCode !== undefined || item.status !== undefined))) {
      throw new Error('Invalid comment batch receipt');
    }
    results.push({ key: item.key, ok: item.ok,
      ...(item.error !== undefined ? { error: item.error } : {}),
      ...(item.errorCode !== undefined ? { errorCode: item.errorCode } : {}),
      ...(item.status !== undefined ? { status: item.status } : {}) });
  }
  if (remaining.size) throw new Error('Incomplete comment batch receipt');
  return { results };
}

export function validateCommentBatchRequest(request: CommentBatchPushRequest): void {
  if (!Array.isArray(request.comments) || request.comments.length < 1 || request.comments.length > COMMENT_BATCH_MAX_ITEMS) throw new Error('Invalid comment batch size');
  const keys = new Set<string>();
  for (const item of request.comments) {
    if (!item || typeof item.key !== 'string' || !item.key.trim() || keys.has(item.key)
      || typeof item.idempotencyKey !== 'string' || !item.idempotencyKey.trim()) throw new Error('Invalid comment batch identity');
    keys.add(item.key);
  }
```

</details>

**依据 16 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:162-195](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/vela-cli-collab-client.ts#L162-L195)

batch方法实际parser caller，但非已核drain。

<details>
<summary>查看原文（34行）</summary>

```text
		async pushCommentBatch(
			workspaceId: string,
			projectId: string,
			request: CommentBatchPushRequest,
		): Promise<CommentBatchPushResponse> {
			if (!workspaceId.trim() || !projectId.trim())
				throw new Error("explicit batch scope is required");
			validateCommentBatchRequest(request);
			// Snapshot before awaiting the process: correlation cannot follow caller mutation.
			const captured: CommentBatchPushRequest = {
				comments: request.comments.map((item) => ({ ...item })),
			};
			const input = JSON.stringify(captured);
			let stdout: string;
			try {
				stdout = await run(
					[
						"comment",
						"push-batch",
						projectId,
						"--comment-file",
						"-",
						"--mode",
						"align",
						"--json",
					],
					workspaceId.trim(),
					{ input },
				);
			} catch (error) {
				stdout = velaCommandStdout(error);
				if (!stdout.trim()) throw error;
			}
			return parseCommentBatchReceipt(stdout, captured);
```

</details>

**依据 17 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:102-125](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/vela-cli-collab-client.ts#L102-L125)

单条runJson空输出/解析边界。

<details>
<summary>查看原文（24行）</summary>

```text
	async function runJson<T>(
		args: string[],
		workspaceId: string,
		commandOptions?: Pick<VelaCommandOptions, "input">,
	): Promise<T> {
		const requestedWorkspaceId = workspaceId.trim();
		if (!requestedWorkspaceId) {
			throw new Error("explicit workspace scope is required");
		}
		let stdout: string;
		try {
			stdout = await run(args, requestedWorkspaceId, commandOptions);
		} catch (error) {
			throw collabCloudErrorFromVelaFailure(error) ?? error;
		}
		const trimmed = stdout.trim();
		if (!trimmed) return {} as T;
		try {
			return JSON.parse(trimmed) as T;
		} catch (cause) {
			throw new Error("Invalid JSON from Vela collaboration command", {
				cause,
			});
		}
```

</details>

**依据 18 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:198-228](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/vela-cli-collab-client.ts#L198-L228)

单条真实CLI调用、稳定key和seq=0 fallback。

<details>
<summary>查看原文（31行）</summary>

```text
		async pushComment(
			_teamId: string,
			projectId: string,
			comment: CollabCloudComment,
			idempotencyKey?: string,
			historicalAuthorMemberId?: string,
		): Promise<{ seq: number }> {
			const payload = await runJson<{
				seq?: unknown;
				authorKey?: unknown;
				author?: { authorKey?: unknown };
			}>(
				[
					"comment",
					"push",
					projectId,
					"--comment-file",
					"-",
					...(idempotencyKey ? ["--idempotency-key", idempotencyKey] : []),
					...(historicalAuthorMemberId ? ["--historical-author-member-id", historicalAuthorMemberId] : []),
				],
				_teamId,
				{ input: JSON.stringify(comment) },
			);
			const authorKey = payload.author?.authorKey ?? payload.authorKey;
			return {
				seq: typeof payload.seq === "number" ? payload.seq : 0,
				...(typeof authorKey === "string" && authorKey.trim()
					? { authorKey: authorKey.trim() }
					: {}),
			};
```

</details>

**依据 19 · 源码核查**：[apps/daemon/src/integrations/collab-cloud.ts:570-588](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/integrations/collab-cloud.ts#L570-L588)

HTTP备选实际POST评论出本机。

<details>
<summary>查看原文（19行）</summary>

```text
		async pushComment(
			teamId: string,
			projectId: string,
			comment: CollabCloudComment,
			idempotencyKey?: string,
			historicalAuthorMemberId?: string,
		): Promise<{ seq: number; authorKey?: string }> {
			const { payload } = await request<{
				seq: number;
				authorKey?: string;
				author?: { authorKey?: string };
			}>(
				"POST",
				`/teams/${encodeURIComponent(teamId)}/projects/${encodeURIComponent(projectId)}/comments`,
				{ comment, ...(idempotencyKey ? { idempotencyKey } : {}),
				  ...(historicalAuthorMemberId ? { historicalAuthorMemberId } : {}) },
			);
			const authorKey = payload.author?.authorKey ?? payload.authorKey;
			return { seq: payload.seq, ...(authorKey ? { authorKey } : {}) };
```

</details>

#### 缺口

- 真实Vela/HTTP返回、服务端幂等/角色/数据处理和评论到设计修订效果未验证
  **影响**：本地保存/ACK/严格批helper均不能推出全部云端已交付或反馈已落实；先不启云分享
  **进一步探讨**：后续隔离假/测试服务对照空JSON/缺seq/丢ACK/途中编辑/413/stop，核队列和服务读回；再以真实评论对制品版本和修改证据人工验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么前提支持小样，执行者、成本和效果怎样验？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议已有编码Agent/设计系统经验的用户，仅在独立OS账户或隔离环境、无敏感brief与项目副本上验证一项本地HTML任务，先不用云分享/评论同步/公网部署。固定实际CLI/profile/companion可用且核probe、cwd与项目路径，外部模型/网络按自己的数据授权与预算，保留手工停进程/读回文件和还原副本手段；本轮未安装，不给一键可用承诺。需要当前任意DSH rc兼容、生产写/全云治理或自动设计合格保证者先观察。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 应用/daemon构建 | 本地应用必需 | 根/daemon 0.25.1；根Node ~24、pnpm >=10.33.2 <11，od导入dist | private工作区非根DSH插件；dist缺失明确失败，不运行postinstall假定已成功 |
| 兼容Agent/模型 | 生成必需，DSH仅一种 | 用户现有CLI/认证、模型和额度；DSH需open-design profile及companion 0.1.0、匹配probe/peer | 0.1.x支持/警告模式不保证任意后续0.2 prerelease；只有package.json不等配置/模型可用 |
| 独立用户环境/项目/资产 | 本小样必需 | 无敏感brief、项目副本、设计系统/素材授权、限制Agent可及目录/网络 | 预览iframe不是Agent OS沙箱，工具/凭据由用户Harness持有；不能隔离则先观察 |
| 本地状态/资源 | 持久工作必需 | SQLite、项目/manifest/版本、run记录和CPU/内存/磁盘 | 磁盘/manifest/版本捕获失败可能半写，先读回，不按HTTP失败盲重建 |
| 云协作/Vela/HTTP/账号 | 仅相关模式必需，小样不启 | 团队scope、评论身份/队列与外部服务 | 本地保存不等远端送达；需单独审身份、回执、幂等/政策与分享撤回 |
| 公网/插件/MCP/发布/媒体链 | 可选且本轮排除 | 额外集成/服务/Agent/安装器/预览形式 | 不把列表计为全实现验收或所有权限安全，启用前另定向核查 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户/管理员隔离账户与副本，确认构建、CLI/版本/profile/probe、模型与数据授权 | 实际选择可用Agent/模型，项目/cwd正确；版本或权限不明停，不用生产账号试错 |
| 单项设计 | 用户提交同一非敏感brief/明确素材，Agent只在副本生成一页HTML | 记模型/预算与全部自动恢复；协议completed包括max-tokens，不作合格依据 |
| 制品读回 | 用户经选定create链读回文件/manifest/版本并预览，设计者核brief与交互 | 同名409/422/500先核落盘/半写，既有正确内容不被未知重试覆盖；非仅文件数 |
| 取消/恢复 | 操作者发cancel后核目标进程组/诊断、文件与外部动作；必要时OS停隔离实例 | 不能把cancel response或协议终态当副作用已撤，结果未知不重放写任务 |
| 退出/可选协作 | 用户保留成果/日志、移除测试profile/副本前先确认进程和凭据；以后另验云队列/分享 | 先本地合格；需要云时按scope/回执/读回/撤分享另验，不将本轮小样升级为生产许可 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/daemon/浏览器/Agent和模型环境、磁盘与可选native依赖；金额未知 | 独立环境、版本/profile/权限、设计系统准备，工时未知 | 根源码有postinstall，未执行；现装版本/兼容与依赖下载未验 |
| 持续使用 | 常驻应用、模型/API/外部素材与生成资源、run/项目持久化 | brief质量、设计人工复核、UI/Agent版本维护 | usage/终态/占位门不等费用硬上限或质量；没有净节时/TCO结果 |
| 失败恢复 | 重新生成/恢复、可能重复外部写或云请求、进程/存储占用 | 对账resume/reseed、max-tokens、半写/manifest/评论回执与恢复版本 | 取消有进程树措施但不回滚外部动作；seq缺失fallback等仅静态推断未复现 |
| 退出/云扩展 | 清理进程/副本、可选服务/分享存储与第三方计费 | 保留证据、撤凭据/分享、核队列与远端状态，时长未知 | 本轮不走云/公网；促销价格不作为现行成本，云端删除/费用未核 |

| 效果 | 当前材料支持 | 未证明/验收条件 |
|---|---|---|
| DSH接线/身份 | 实际runtime/child/profile/create-resume/stdio与终态消费 | 真实版本、cwd/resume与模型权限/进程退出未测 |
| 已知制品问题 | 代表create链调用有限marker门、stub默认warn、文件/manifest/版本返回 | 设计正确性/语义占位、全入口/原子幂等与无敏感代码安全未证 |
| 评论可靠传输 | 本地durable intent、scope/发布witness、稳定key与revision ACK | 严格批helper非本drain；单条seq fallback、云真落地和设计落实另核 |
| 协作价值 | 同项目组织资产/Agent/预览与反馈 | 比原编辑器+截图流程的合格率、遗漏/返工和总恢复成本未知 |

小样通过也只说明该固定部署和任务；要采用应对照同brief、同Agent/模型预算的文件+截图聊天流程，记录盲评合格、评论遗漏、返工与恢复分钟/资源。身份、目录、回执、过程/费用或读回不明就停并手工核对，不以“可开源自部署/本地优先”代替数据和授权判断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/package.json#L1-L14)

应用/许可/启动及postinstall声明。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "open-design",
  "version": "0.25.1",
  "private": true,
  "packageManager": "pnpm@10.33.2",
  "type": "module",
  "description": "Local-first design product: detects your installed code-agent CLI, runs design skills + design systems, streams artifacts into a sandboxed preview.",
  "license": "Apache-2.0",
  "bin": {
    "od": "./apps/daemon/bin/od.mjs"
  },
  "scripts": {
    "postinstall": "node ./scripts/postinstall.mjs",
    "bootstrap": "node ./scripts/postinstall.mjs",
```

</details>

**依据 2 · 源码核查**：[package.json:42-46](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/package.json#L42-L46)

根引擎要求。

```text
  "engines": {
    "node": "~24",
    "pnpm": ">=10.33.2 <11"
  },
  "pnpm": {
```

**依据 3 · 源码核查**：[apps/daemon/bin/od.mjs:8-16](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/bin/od.mjs#L8-L16)

缺dist真实阻止启动。

```text
const distEntry = resolve(entryDir, "../dist/cli.js");

if (!existsSync(distEntry)) {
  throw new Error(
    `OpenDesign daemon dist entry not found at ${distEntry}. Run "pnpm bootstrap" after install (or "pnpm --filter @open-design/daemon build").`,
  );
}

await import(pathToFileURL(distEntry).href);
```

**依据 4 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:32-104](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L32-L104)

DSH实际版本/probe/模型/stdio前提。

<details>
<summary>查看原文（73行）</summary>

```text
export function hasOpenDesignProfile(env: NodeJS.ProcessEnv): boolean {
  return existsSync(path.join(resolveOpenDesignProfileDir(env), 'package.json'));
}

export function resolveOpenDesignProfileDir(env: NodeJS.ProcessEnv): string {
  const configuredHome = env.DSH_HOME?.trim();
  const dshHome = configuredHome
    ? path.resolve(configuredHome)
    : path.join(homedir(), '.dsh');
  return path.join(dshHome, 'profiles', 'open-design');
}

const DSH_VERSION_RE = /^v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$/u;

export function parseDeepSeekHarnessVersion(raw: string): string | null {
  return DSH_VERSION_RE.exec(raw.trim())?.[1] ?? null;
}

export const deepseekHarnessAgentDef = {
  id: 'deepseek-harness',
  name: 'DeepSeek Harness',
  bin: 'dsh',
  versionArgs: ['--version'],
  versionPolicy: {
    // `dsh` is published as a stream of release candidates whose sibling
    // packages peer-require each other, so the version our own installer
    // hands the user moves with upstream. Naming one of them made every user
    // who followed our instructions land on an "untested version" warning the
    // week after we bumped the installer. Accept the release line; a version
    // off it still warns.
    supportedVersions: ['0.1.0-rc.8', '0.1.1-rc.2', '0.1.2-rc.1'],
    // The line, not one point on it. Scoping this to `0.1.0-rc.N` was still a
    // pin: upstream shipped `0.1.1-rc.1` two days later and every user on it
    // was told their CLI was untested. `0.1.2-rc.1` then became npm's `latest`,
    // and the same warning came back for everyone who installed without naming
    // a version — the widening has to happen per patch line, every time.
    //
    // Prerelease acceptance may never exceed what `packages/dsh-runtime`'s peer
    // ranges can install, or this suppresses the warning for a version whose
    // companion cannot resolve — a worse failure than the warning, and silent.
    // semver admits a prerelease only against a comparator sharing its exact
    // major.minor.patch AND carrying a prerelease, so the accepted release
    // candidates are precisely the peers' tuples and floors: `0.1.0-rc.6+`, any
    // `0.1.1-rc.N`, any `0.1.2-rc.N`. One alternative per peer comparator, on
    // purpose — a new upstream patch line needs an edit in both files or in
    // neither. Stable releases on the line need no such comparator.
    // `e2e/tests/dsh-installer-version-policy.test.ts` holds the two together.
    supportedVersionPattern:
      /^0\.1\.\d+$|^0\.1\.0-rc\.(?:[6-9]|[1-9]\d+)$|^0\.1\.1-rc\.\d+$|^0\.1\.2-rc\.\d+$/u,
    requireVersion: true,
    parse: parseDeepSeekHarnessVersion,
  },
  compatibilityProbe: {
    args: ['--profile', 'open-design', '--probe'],
    timeoutMs: 10_000,
    // rc.6 auto-initializes a missing profile before booting it, so avoid
    // invoking --probe until the user-installed profile already exists.
    preflight: hasOpenDesignProfile,
    parse: (stdout) => parseDshProfileProbeOutput(stdout).plugin_version,
  },
  listModels: {
    args: ['--profile', 'open-design', '--models'],
    parse: parseModels,
    timeoutMs: 10_000,
  },
  fallbackModels: [DEFAULT_MODEL_OPTION],
  buildArgs: () => ['--profile', 'open-design', '--stdio'],
  promptViaStdin: true,
  streamFormat: 'dsh-profile-jsonl',
  resumesSessionViaProfileStdio: true,
  capturesSessionIdFromStream: true,
  supportsCustomModel: false,
} satisfies RuntimeAgentDef;
```

</details>

**依据 5 · 源码核查**：[packages/dsh-runtime/cordis.patch.yml:1-20](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/cordis.patch.yml#L1-L20)

用户Harness持有工具/凭据。

<details>
<summary>查看原文（20行）</summary>

```text
# OpenDesign's stdio profile surface over the official dsh-base composition.
# The user's Harness installation owns credentials, settings, tools, sessions,
# and provider adapters. This bundle adds only the OD protocol boundary.

- id: system-prompt
  config:
    persona: >-
      You are a coding and design agent running for OpenDesign. Follow the
      complete task and project context supplied in the current user message.

- id: hmr
  disabled: true

- insert:
    - id: open-design-startup
      name: '@open-design/dsh-runtime/startup'

    - id: open-design-runtime
      name: '@open-design/dsh-runtime'
      inject: [openDesignStartup]
```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/projects.ts:942-962](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/projects.ts#L942-L962)

先正文后manifest/结果。

<details>
<summary>查看原文（21行）</summary>

```text
  await writeFile(target, body);
  await projectFileWriteTestHooks.afterCommit?.({ safeName, target, body });
  if (validatedManifest) {
    const manifestFileName = artifactManifestNameFor(safeName);
    const manifestTarget = await resolveSafeReal(dir, manifestFileName);
    await writeFile(manifestTarget, JSON.stringify(validatedManifest, null, 2));
  }
  const st = await stat(target);
  const persistedManifest = await readManifestForPath(dir, safeName);
  const result = {
    name: safeName,
    path: safeName,
    size: st.size,
    mtime: st.mtimeMs,
    kind: kindFor(safeName),
    mime: mimeFor(safeName),
    artifactKind: persistedManifest?.kind,
    artifactManifest: persistedManifest,
  };
  if (stubGuardWarning) result.stubGuardWarning = stubGuardWarning;
  return result;
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/runtimes/runs.ts:2497-2535](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/runtimes/runs.ts#L2497-L2535)

取消/进程树措施，非回滚。

<details>
<summary>查看原文（39行）</summary>

```text
  const cancel = async (run, origin = 'unknown') => {
    if (TERMINAL_RUN_STATUSES.has(run.status)) return statusBody(run);
    run.cancelRequested = true;
    run.cancelOrigin = origin;
    run.updatedAt = Date.now();
    if (origin === 'user_stop') observeDiagnosticLifecycle(run, 'user_cancel', run.updatedAt);
    clearPendingRetryRestart(run);
    if (!run.child) {
      closeRunStdin(run);
      finish(run, 'canceled', null, 'SIGTERM');
      return statusBody(run);
    }

    const targetChild = run.child;
    const targetProcessGroupId = run.processGroupId;

    // Prefer RPC-level abort for agents that support it (pi, ACP adapters).
    // If the adapter does not exit within its grace window, fall back to
    // process signals and finally SIGKILL the process group.
    if (run.acpSession?.abort) {
      const graceMs = Number(process.env.PI_ABORT_GRACE_MS) || 3000;
      try {
        run.acpSession.abort();
      } catch {
        // Signal fallback below owns eventual process termination.
      }
      const termination = terminateProcessTree(
        run,
        targetChild,
        targetProcessGroupId,
        {
          gracefulWaitMs: graceMs,
          termGraceMs: graceMs,
          killGraceMs: forceWaitMs(),
          reason: 'run_cancel',
        },
      );
      const terminationResult = await termination;
      return finishCanceledFromChildState(run, terminationResult.forced ? 'SIGKILL' : 'SIGTERM');
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:198-228](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/vela-cli-collab-client.ts#L198-L228)

实际单条回执边界。

<details>
<summary>查看原文（31行）</summary>

```text
		async pushComment(
			_teamId: string,
			projectId: string,
			comment: CollabCloudComment,
			idempotencyKey?: string,
			historicalAuthorMemberId?: string,
		): Promise<{ seq: number }> {
			const payload = await runJson<{
				seq?: unknown;
				authorKey?: unknown;
				author?: { authorKey?: unknown };
			}>(
				[
					"comment",
					"push",
					projectId,
					"--comment-file",
					"-",
					...(idempotencyKey ? ["--idempotency-key", idempotencyKey] : []),
					...(historicalAuthorMemberId ? ["--historical-author-member-id", historicalAuthorMemberId] : []),
				],
				_teamId,
				{ input: JSON.stringify(comment) },
			);
			const authorKey = payload.author?.authorKey ?? payload.authorKey;
			return {
				seq: typeof payload.seq === "number" ? payload.seq : 0,
				...(typeof authorKey === "string" && authorKey.trim()
					? { authorKey: authorKey.trim() }
					: {}),
			};
```

</details>

#### 缺口

- 安装/运行/质量/费用和恢复工时未测，云/媒体/MCP等全产品分支未审
  **影响**：只支持可弃置本地副本试用，不支持生产设计合格或任意版本/云治理结论
  **进一步探讨**：以后固定隔离部署验一任务和失败恢复，再对照原流程；任一关键前提/副作用无法核就保持观察。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现有机制之外该验证什么，何时否定独立插件？

**研究主题**：新假设与验证

#### 完整回答

候选是把“执行结束、制品写成、评论送达、设计按意见改对”分成可追溯验收，优先修具体回执和设计改动证据。已有的session/request终态、marker/stub门、HTML版本锁、scope/发布witness、durable outbox和revision ACK都保留，不把“评论绑版本/加队列”当新发明；模型工具循环也不重造。

先排查未审完整设计workflow是否已有同类改动回执，避免重复造；本题不宣称全应用没有。再在原代码做小修复/流程：Vela单条回执必须有可接受的seq/identity形状才ACK，未知结果可持久保留并按稳定key读回，而不是空JSON折seq0；不以本轮未审的云端幂等作保证。设计侧从真实评审者选少量可判断验收项，Agent对每条给已改/未改/阻塞、对应制品版本和可读回的修改依据，人实际复核；max-tokens/占位未命中/评论传输ACK分别显示，不混成设计完成。

最小实验先无敏感副本/测试服务，注入空stdout/缺seq/丢ACK/途中编辑、已知marker与普通语义错误、max-tokens和取消，比较当前行为、严格单条shape+人工读回清单、轻量改动回执。再固定brief/设计系统/Agent预算，与文件+截图聊天反馈比较盲评合格率、意见遗漏、错误ACK/重复提交、返工和恢复分钟/模型用量。这里是未来实验，不是本轮测试通过或已测缺陷。

若严格单条校验+人工验收清单已足够，就修原应用/保留清单；不需要再造大型Agent/设计平台。只有真实用户持续出现反馈遗漏/退出或回执误判，并且轻量机制比基线稳定少错、省恢复且不增加更多维护，才考虑跨工具复用。没有差异、误报/成本更高或权限/数据边界无法控制则否定；没有付费与商业规模证据，不能从复杂工程推出生产插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-runtime/src/index.ts:82-102](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/packages/dsh-runtime/src/index.ts#L82-L102)

现有协议终态与max-tokens边界。

<details>
<summary>查看原文（21行）</summary>

```text
function resultStatus(reason: TurnEndReason | undefined): 'completed' | 'cancelled' | 'failed' {
  if (reason?.kind === 'completed' || reason?.kind === 'max-tokens') return 'completed';
  if (reason?.kind === 'aborted') return 'cancelled';
  return 'failed';
}

function resultError(reason: TurnEndReason | undefined): { code: string; message: string } | undefined {
  if (resultStatus(reason) !== 'failed') return undefined;
  if (!reason) {
    return {
      code: 'DSH_PROFILE_MISSING_TURN_END',
      message: 'DeepSeek Harness became idle without reporting how the turn ended.',
    };
  }
  if (reason.kind === 'error') return errorFacts(reason.error, 'DSH_PROFILE_TURN_FAILED');
  if (reason.kind === 'blocked') {
    return {
      code: 'DSH_PROFILE_TURN_BLOCKED',
      message: 'DeepSeek Harness blocked the turn before it completed.',
    };
  }
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/projects.ts:890-947](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/projects.ts#L890-L947)

已有制品门/stub与写序。

<details>
<summary>查看原文（58行）</summary>

```text
  if (artifactManifest && typeof artifactManifest === 'object') {
    const validated = validateArtifactManifestInput(artifactManifest, safeName);
    if (validated.ok && validated.value) {
      validatedManifest = validated.value;
      // Publication guard: HTML/deck artifacts that still contain template
      // placeholders (e.g. pitch-deck `Name to confirm`, `$X.XM`) must not
      // land as published files. Runs at the write boundary so it covers
      // every artifact that flows through writeProjectFile, regardless of
      // which agent/atom produced the body. Throws
      // ArtifactPublicationBlockedError which the route layer maps to 422.
      if (isPublicationGuardedArtifactKind(validatedManifest.kind)) {
        assertArtifactPublicationAllowed(body);
      }
      const identifier = typeof validatedManifest.metadata?.identifier === 'string'
        ? validatedManifest.metadata.identifier
        : '';
      // Stub-guard applies to HTML-rendered manifest kinds (html, deck).
      // Other kinds (markdown, svg, code-snippet) can legitimately be small
      // and are skipped.
      if (identifier.length > 0 && STUB_GUARDED_MANIFEST_KINDS.has(validatedManifest.kind)) {
        // Scan the directory the new file actually lands in, not the project
        // root — writeProjectFile accepts nested paths like reports/X.html
        // and a root-only scan would miss prior siblings in subdirectories.
        const guard = await evaluateArtifactStubGuard({
          scanDir: path.dirname(target),
          identifier,
          newSize: Buffer.byteLength(body),
          config: readArtifactStubGuardConfigFromEnv(),
        });
        if ((guard.outcome === 'reject' || guard.outcome === 'warn') && guard.warning) {
          // Operator-visible signal regardless of mode, so on-call can see
          // how often the guard fires without combing through 422s.
          console.warn(
            `[stub-guard] ${guard.outcome} identifier=${guard.warning.identifier} ` +
              `newSize=${guard.warning.newSize} priorSize=${guard.warning.priorSize} ` +
              `priorName=${guard.warning.priorName} project=${projectId}`,
          );
        }
        if (guard.outcome === 'reject' && guard.warning) {
          throw new ArtifactRegressionError(guard.warning.message, {
            identifier: guard.warning.identifier,
            newSize: guard.warning.newSize,
            priorSize: guard.warning.priorSize,
            priorName: guard.warning.priorName,
          });
        }
        if (guard.outcome === 'warn' && guard.warning) {
          stubGuardWarning = guard.warning;
        }
      }
    }
  }
  await writeFile(target, body);
  await projectFileWriteTestHooks.afterCommit?.({ safeName, target, body });
  if (validatedManifest) {
    const manifestFileName = artifactManifestNameFor(safeName);
    const manifestTarget = await resolveSafeReal(dir, manifestFileName);
    await writeFile(manifestTarget, JSON.stringify(validatedManifest, null, 2));
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:774-825](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/collab-cloud-service.ts#L774-L825)

已有witness、key与revision ACK，不算未来新量。

<details>
<summary>查看原文（52行）</summary>

```text
			// Recheck each publication-bound record immediately before network I/O:
			// an earlier record may have awaited while stop/re-publish changed the witness.
			if (
				record.publication &&
				!deps.commentOutbox?.isPublicationCurrent?.(record)
			) {
				deps.commentOutbox?.acknowledge(record);
				return;
			}
			const result = await deps.client.pushComment(
				identity.teamId,
				record.projectId,
				commentRelayPayload(record.publication
					? {
							...record.comment,
							filePath: record.publication.publicFilePath,
							publicationSlug: record.publication.slug,
						}
					: record.comment),
				// Legacy full-content tombstones may already have a lost-ACK receipt.
				// Use a stable new key for the compact wire format, avoiding a same-key
				// different-payload conflict while keeping retries idempotent.
				record.comment.deleted
					? createHash("sha256").update(`compact-delete-v1:${record.eventKey}`).digest("hex")
					: record.eventKey,
				// Only the durable owner-mediated publication relay may request an
				// original member. Vela independently verifies this owner, active
				// publication and same-team directory before honoring the hint.
				record.publication && record.comment.memberId && record.comment.memberId !== identity.memberId
					? record.comment.memberId : undefined,
			);
			// Revision-conditional ACK: if an edit/delete was queued while this
			// payload was in flight, its newer row remains for the next drain.
			deps.commentOutbox?.acknowledge(record, "delivered");
			if (!record.comment.deleted) {
				deps.onCommentPushed?.({
					projectId: record.projectId,
					commentId: record.commentId,
					seq: result.seq,
					memberId: record.workspaceMemberId,
					...(result.authorKey ? { authorKey: result.authorKey } : {}),
				});
			}
		} catch (error) {
			if (isShareStoppedRelayError(error)) {
				// The server has authoritatively closed this share. A revision-conditional
				// ACK preserves a newer local edit that raced this rejected request.
				deps.commentOutbox?.acknowledge(record);
				deps.onError?.(error);
				return;
			}
			deferOutboxRecord(record, error);
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:102-125](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/vela-cli-collab-client.ts#L102-L125)

实际空stdout/JSON边界。

<details>
<summary>查看原文（24行）</summary>

```text
	async function runJson<T>(
		args: string[],
		workspaceId: string,
		commandOptions?: Pick<VelaCommandOptions, "input">,
	): Promise<T> {
		const requestedWorkspaceId = workspaceId.trim();
		if (!requestedWorkspaceId) {
			throw new Error("explicit workspace scope is required");
		}
		let stdout: string;
		try {
			stdout = await run(args, requestedWorkspaceId, commandOptions);
		} catch (error) {
			throw collabCloudErrorFromVelaFailure(error) ?? error;
		}
		const trimmed = stdout.trim();
		if (!trimmed) return {} as T;
		try {
			return JSON.parse(trimmed) as T;
		} catch (cause) {
			throw new Error("Invalid JSON from Vela collaboration command", {
				cause,
			});
		}
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:198-228](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/vela-cli-collab-client.ts#L198-L228)

非数字seq fallback。

<details>
<summary>查看原文（31行）</summary>

```text
		async pushComment(
			_teamId: string,
			projectId: string,
			comment: CollabCloudComment,
			idempotencyKey?: string,
			historicalAuthorMemberId?: string,
		): Promise<{ seq: number }> {
			const payload = await runJson<{
				seq?: unknown;
				authorKey?: unknown;
				author?: { authorKey?: unknown };
			}>(
				[
					"comment",
					"push",
					projectId,
					"--comment-file",
					"-",
					...(idempotencyKey ? ["--idempotency-key", idempotencyKey] : []),
					...(historicalAuthorMemberId ? ["--historical-author-member-id", historicalAuthorMemberId] : []),
				],
				_teamId,
				{ input: JSON.stringify(comment) },
			);
			const authorKey = payload.author?.authorKey ?? payload.authorKey;
			return {
				seq: typeof payload.seq === "number" ? payload.seq : 0,
				...(typeof authorKey === "string" && authorKey.trim()
					? { authorKey: authorKey.trim() }
					: {}),
			};
```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/collab/comment-relay-outbox.ts:361-368](https://github.com/nexu-io/open-design/blob/43792760e07093af7a57a0fdc58a0a424e849f26/apps/daemon/src/collab/comment-relay-outbox.ts#L361-L368)

已有条件ACK是复用基底。

```text
	const acknowledgeRow = db.prepare(`
    DELETE FROM comment_relay_outbox
     WHERE workspace_id = ?
       AND workspace_member_id = ?
       AND project_id = ?
       AND comment_id = ?
       AND revision = ?
  `);
```

#### 缺口

- 严格回执/设计改动验收尚未实现或实验，真实用户需求和收益未知
  **影响**：仅候选方向，优先小修原应用，不推荐直接造新平台/商业插件
  **进一步探讨**：隔离小修/人工清单对照先证伪；不能稳定减少误报/遗漏/返工或维护变重就否定。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
