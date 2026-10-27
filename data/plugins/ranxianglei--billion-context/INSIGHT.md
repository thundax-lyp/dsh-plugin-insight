# billion-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[02bcdc4](https://github.com/ranxianglei/billion-context/tree/02bcdc4b7601c47a8965c4343032d9692748c975)

<!-- BEGIN META -->
[![GitHub ★ 2,923](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C923&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 2,010,311](https://img.shields.io/static/v1?label=npm+30d&message=2%2C010%2C311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
<!-- END META -->

> **功能**：为长会话提供模型驱动的增量分层压缩、原文恢复、上下文搜索及多客户端代理/原生通道。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的贡献是让模型按范围增量折叠、按需恢复，而非只在达到阈值时全量总结；DSH工具准备与session归属控制把代理状态接到宿主请求。[Q03](#research-q03)支持状态可恢复，不证明所有摘要保真；kernel与vendored机制来源保留，不宣称全新原创。

> **主要限制**：[Q03](#research-q03)指出summary长度/边界合格不等关键事实保留，可恢复也不等模型会知道何时恢复。若遗漏的否定或纠错不被意识到，窗口正常仍可任务失败；[Q04](#research-q04)还要求区分wire-mode、双压缩及原生compact恢复。不能以宣传token倍数覆盖这些条件。

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
  - [Q01 · “billion”对应什么任务，是否扩大模型物理窗口？](#detail-section-11)
  - [Q02 · DSH请求如何经过代理并保持会话归属？](#detail-section-12)
  - [Q03 · 可逆压缩是否意味着摘要没有信息损失？](#detail-section-13)
  - [Q04 · 接管原生compact时如何降级，禁用哪一层才安全退出？](#detail-section-14)
  - [Q05 · 采用长会话压缩需要付什么代价，怎样有界试用？](#detail-section-15)
  - [Q06 · 压缩后用关键事实回查能否比只看窗口更可靠？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：它服务长时间编码会话，试图在有限模型窗口内持续携带决策、错误和代码引用。合格交付是长任务仍能正确利用关键历史，需要精确细节时找回原文，而非只是累计请求很多token或没有超过窗口。名称和README累计B级token不是单次上下文容量扩成十亿，也不是本研究对质量的实测。

同一模型和任务使用宿主compact、人工总结新会话及按需原日志检索。比较完整任务关键事实、合格交付和包括恢复/失败的总token费用，非只看压缩率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 范围压缩 | 把选定历史折成summary | 模型生成，范围/长度非语义保证 |
| 原文恢复 | deactivate块后回查历史 | 原消息与state仍可用 |
| 上下文搜索/状态 | 查压缩块与可压范围 | 不能据命中保证事实当前正确 |
| DSH原生工具 | 工具执行对接proxy | toolsReady和session归属必须成立 |
| acp/acp-cache | 检查session和缓存 | latest fallback有提示，wire-mode无压缩 |
| compaction gate | 接管/退出原生compact | 独立条目不可随意删除，防双压缩 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node与目标宿主要求 | 是 | 包/proxy/native | 按宿主更严格版本，非只看Node>=20 |
| DSH含dist发布包及bundle | DSH需要 | native/gate入口 | Git源码直装可能无产物 |
| 可用provider/模型 | 是 | 生成任务与summary | 工具能力/格式失败影响压缩 |
| 原历史与session/state | 恢复需要 | ref映射和decompress | 可逆不表示没有存储前提 |
| 单一压缩通道 | 是 | 防旧扩展/原生重复压缩 | 需清项目本地旧安装与核对gate |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份profile和原历史，固定包/宿主 | 无双压缩旧扩展 |
| 2 | 通过原生bundle启用 | 工具ready/session归属，不只proxy可达 |
| 3 | 用已知关键事实长任务压缩/恢复 | 原文可回查，结果合格 |
| 4 | 查看/acp与缓存解释 | latest fallback/wire-mode要识别 |
| 5 | 失败则移除bundle并恢复stock compact | gate/preset及原历史逐项核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/代理及状态磁盘 | 固定宿主、备份profile与历史、清旧扩展 | DSH需含dist的发布包 |
| 持续使用 | compress/decompress额外模型回合、输入体积变化 | 检查摘要事实、缓存与session归属 | 全任务费用未知，不套宣传倍数 |
| 失败恢复 | 重试、原文恢复和缓存重建 | 诊断wire-mode、范围映射、双压缩 | 原文和state可用是恢复前提 |
| 退出 | 停代理及移除bundle | 检查gate/preset及原生compact恢复 | 不能只删gate或一个工具 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 范围折叠 | summary/ref/保护结构 | 语义保真与任务合格率 |
| 可逆恢复 | active块停用、原消息恢复预览 | 原文/state可用、模型主动恢复 |
| DSH接线 | toolsReady和session归属headers | 实际并发、宿主版本兼容 |
| token/缓存 | 作者报告与机制解释 | 宣传倍数非本轮独立结果，总费用未知 |

> **思考**：[Q03](#research-q03)指出summary长度/边界合格不等关键事实保留，可恢复也不等模型会知道何时恢复。若遗漏的否定或纠错不被意识到，窗口正常仍可任务失败；[Q04](#research-q04)还要求区分wire-mode、双压缩及原生compact恢复。不能以宣传token倍数覆盖这些条件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的贡献是让模型按范围增量折叠、按需恢复，而非只在达到阈值时全量总结；DSH工具准备与session归属控制把代理状态接到宿主请求。[Q03](#research-q03)支持状态可恢复，不证明所有摘要保真；kernel与vendored机制来源保留，不宣称全新原创。

[Q02](#research-q02)工具准备和会话归属门控、[Q04](#research-q04)独立compaction gate及失败可见性值得借鉴。kernel纯状态接口与host I/O分开方便移植，但复杂fetch拦截、动态工具和preset替换要求维持精确接口；结构校验不能承担语义验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)指出summary长度/边界合格不等关键事实保留，可恢复也不等模型会知道何时恢复。若遗漏的否定或纠错不被意识到，窗口正常仍可任务失败；[Q04](#research-q04)还要求区分wire-mode、双压缩及原生compact恢复。不能以宣传token倍数覆盖这些条件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)建议长任务维护者以独立profile、原日志和固定模型比较宿主compact，先验收关键事实再看token。wire-mode持续、双压缩或恢复失败就停用，通过同一bundle通道移除并核对原生compact，不以长会话替代任务/版本管理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持范围压缩、恢复状态及DSH归属门控；结构可逆不等语义无损。作者token/缓存/纵向运行数字未经本轮独立执行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh.bundle.patch.yml、src/agent/dsh-native.ts、src/agent/dsh-compaction-gate.ts、kernel/src/compress.ts、kernel/src/decompress.ts、kernel/PROVENANCE.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根包深入DSH native与内置kernel部分，不逐个审计其他客户端或全部代理转换；不运行安装、代理、目标测试、模型或宿主。作者纵向/缓存/token数字保留作者报告；容量与语义质量分开。
- 下一步：后续固定包、宿主、模型、预算和带关键约束长任务，核对折叠/恢复/并发归属、工具注册故障、双压缩及退出，再比较净费用与人工修正。

**分析版本**

- **仓库**：[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)
- **版本号**：0.1.207（[固定提交 02bcdc4](https://github.com/ranxianglei/billion-context/tree/02bcdc4b7601c47a8965c4343032d9692748c975)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)提出未验证的关键事实索引与决策前原文回查。用否定、跨代纠错和文件重命名长任务对照同总预算的宿主compact/原方案，统计合格率、恢复、额外token和人工时间；无净改善就停止，不计现有创新。

后续固定包、宿主、模型、预算和带关键约束长任务，核对折叠/恢复/并发归属、工具注册故障、双压缩及退出，再比较净费用与人工修正。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 132 | 19525 | — | — | 364198 |
| .ts | source | 384 | 173539 | 118180 | 47544 | — |
| .mjs | source | 30 | 6167 | 4319 | 1481 | — |
| .ts | test | 1148 | 330102 | 275957 | 36849 | — |
| .mjs | test | 4 | 760 | 617 | 133 | — |
| .md | test | 1 | 359 | — | — | 2707 |
| .mts | example | 2 | 85 | 71 | 16 | — |
| .ts | example | 1 | 64 | 47 | 14 | — |
| .md | example | 1 | 34 | — | — | 545 |
| .js | source | 1 | 592 | 576 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 289](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=289&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,677](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C677&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+created%3A2026-09-27T02%3A07%3A15.984Z..2026-10-27T02%3A07%3A15.984Z) [![近30天关闭 1,420](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C420&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A07%3A15.984Z..2026-10-27T02%3A07%3A15.984Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型驱动分层可逆压缩在DSH如何生效，容量与任务语义保真怎样分开验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · “billion”对应什么任务，是否扩大模型物理窗口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它服务长时间编码会话，试图在有限模型窗口内持续携带决策、错误和代码引用。合格交付是长任务仍能正确利用关键历史，需要精确细节时找回原文，而非只是累计请求很多token或没有超过窗口。名称和README累计B级token不是单次上下文容量扩成十亿，也不是本研究对质量的实测。

直接替代是宿主自动compact、人工总结后新开会话或按需查原日志。本项目以模型主动选择小范围压缩、分层summary和decompress替代一次性截断，增加局部恢复与压缩时机控制。它能解释为什么减少重复发送历史的体积，但“5倍少token”“95–97%缓存”“长期无窗口越界”是作者报告，条件与归因未由本轮独立重现。

根包包含多客户端代理/launcher和DSH原生bundle。本轮深入DSH和内置kernel，不把所有客户端徽章当当前全支持。kernel来源说明列出历史DCP/ACP机制归属与重写计划，不能把原生接线、全部压缩思想和上游方法统称全新原创；许可来源说明本身也不替代独立核查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-100](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/README.md#L63-L100)

作者纵向数据、机制与四工具，保留作者报告边界。

<details>
<summary>查看原文（38行）</summary>

````text
A production-scale longitudinal study: 4.5 months, three hosts, 174,327 model calls, 18.76B cumulative input tokens (~24.7B across all hosts), zero window violations on 204,800-token models, marathon sessions of 8,584–12,049 calls.

---

`billion-context` sits between **any** agent and its model API, rewriting Anthropic/OpenAI streams with [acp-kernel](https://github.com/ranxianglei/acp-kernel) compression. The model decides **when** and **what** to compress into high-fidelity summaries — not a hard truncation limit.

## Why

Long coding sessions blow up context. Each provider charges per token, and once you pass the context window the session degrades or dies. `billion-context` compresses consumed conversation into layered summaries so you can run a single session for days — billions of tokens through one context window.

Unlike a host's built-in summarizer, compression here is **incremental, reversible, and prefix-cache friendly**: summaries are written in small ranges, can be decompressed on demand, and the cache prefix stays intact.

## How it works

```
Agent (Claude Code / Codex / Cursor / Aider ...)
        │  you point the agent's base URL at the proxy
        ▼
┌─────────────────┐
│  billion-context│   1. parse the request (Anthropic or OpenAI shape)
│     proxy       │   2. run acp-kernel compression on the conversation
│                 │   3. inject a `compress` tool + compression philosophy
│                 │   4. forward to the real model API
│                 │   5. rewrite the streaming response
└─────────────────┘
        │
        ▼
   real model API (Anthropic / OpenAI / compatible)
```

### Context-management tools

The proxy injects four context-management tools into the conversation; the model calls them itself as context grows, and the proxy executes `compress` server-side so folded ranges stay summarized in history until restored:

- **`compress`** — fold a message range into a detailed summary.
- **`decompress`** — restore a compressed range when exact details are needed again.
- **`search_context`** — keyword search over compressed summaries and visible messages.
- **`acp_status`** — context-usage overview plus which ranges are still compressible.
````

</details>

**依据 2 · 作者声明**：[README.md:106-131](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/README.md#L106-L131)

客户端通道不等价，双压缩互斥条件。

<details>
<summary>查看原文（26行）</summary>

```text
| Client | Use |
|---|---|
| **pi** | [`billion-context`](https://github.com/ranxianglei/billion-context) — `bili pi` (launcher) or `bili plugin install pi` (native); standalone [`billion-context-pi`](https://github.com/ranxianglei/billion-context-pi) remains usable — details: [CLIENTS.md](CLIENTS.md#pi-pidev-coding-agent) |
| **opencode** (1.x / 2.x) | [`billion-context`](https://github.com/ranxianglei/billion-context) — `bili opencode` (launcher) or `bili plugin install opencode` (native); standalone [`opencode-acp`](https://github.com/ranxianglei/opencode-acp) remains usable on 1.x — full guide: [OpenCode](CLIENTS.md#opencode) |
| **omp** | [`billion-context`](https://github.com/ranxianglei/billion-context) via `bili omp` (built-in plugin) or `bili plugin install omp` (self-spawning native plugin, no launcher) |
| **dsh** | `bili dsh` (launcher — full native plugin via `--patch`) or `bili plugin install dsh` ≡ `dsh plugin --profile <name> add billion-context` (one unified lane) — details: [CLIENTS.md](CLIENTS.md) |
| **kimi** | `bili plugin install kimi` (self-spawning native, Kimi Code ≥ 2.0.0) or `bili kimi` (cert-MITM) or `/bili/` prefix — details: [CLIENTS.md](CLIENTS.md) |
| **hermes** | `bili plugin install hermes` (self-spawning native, Python plugin #958) or `bili hermes` (cert-MITM) |
| **zcode** (Z.ai / bigmodel coding plan) | `bili plugin install zcode` (self-spawning native, #1145) or cert-MITM via the GUI's Settings → Network or `/bili/` prefix — details: [CLIENTS.md](CLIENTS.md) |
| **claude** | `bili claude` (launcher) or `bili plugin install claude` (native posture, #964 — managed settings block + session-owned proxy; see the notes below) |
| **codex** | `bili codex` (launcher — the full zero-config posture) or `bili plugin install codex` (MCP-shell tools companion: **start bili first** — the shell never spawns a proxy and never routes codex's own traffic) — details: [CLIENTS.md](CLIENTS.md#codex-openai-codex-cli) |
| **jcode** | [`billion-context`](https://github.com/ranxianglei/billion-context) via `bili jcode` (cert-MITM) or `/bili/` prefix — no native mode (compiled Rust binary, no plugin seam, [#962](https://github.com/ranxianglei/billion-context/issues/962)) |
| **gemini** (Gemini CLI) | `bili gemini` (launcher, `GOOGLE_GEMINI_BASE_URL` `/bili/` rewrite) or `/bili/` prefix — launcher-only (no in-loop tool seam, #1043) |
| **iflow** (iFlow CLI) | `bili iflow` (launcher, `IFLOW_BASE_URL` `/bili/` rewrite) or `/bili/` prefix |
| **qwen** (Qwen Code) | `bili qwen` (launcher, cert-MITM) or `/bili/` prefix |
| **antigravity** (Antigravity CLI / agy, Google) | `bili antigravity` (launcher, `CLOUD_CODE_URL` `/bili/` rewrite of daily-cloudcode-pa.googleapis.com — Antigravity's real default upstream, #3129) or `/bili/` prefix — no plugin seam (closed Go language_server; its user-plugin surface is additive-only, #2115) — details: [CLIENTS.md](CLIENTS.md) |
| **mcode** (MiniMax Code) | [`billion-context`](https://github.com/ranxianglei/billion-context) via `bili mcode` (cert-MITM) or `/bili/` prefix — no native mode (event hooks only, no model-request seam, [#1050](https://github.com/ranxianglei/billion-context/issues/1050)) |
| **aider** | [`billion-context`](https://github.com/ranxianglei/billion-context) via `bili aider` (cert-MITM) or `/bili/` prefix — no native mode (shell-command-only hooks, no tool-injection seam, [#1048](https://github.com/ranxianglei/billion-context/issues/1048)) |
| **copilot** (GitHub Copilot CLI) | `bili copilot` (launcher, cert-MITM) — closed Go binary, no plugin seam (#1049) |
| **amp** (Amp CLI) | `bili amp` (launcher, cert-MITM) — closed Go binary, no plugin seam (#1049) |
| **crush** (Charm Crush) | `bili crush` (launcher, cert-MITM) — open-source Go binary, no plugin seam; built-in provider hosts whitelisted, custom `base_url`s auto-discovered from crush.json (#2340) |
| **zed** (Zed editor) | `bili zed` (launcher, cert-MITM) — open-source Rust editor, no plugin seam; reqwest honors HTTPS_PROXY, CA via SSL_CERT_FILE (Linux env probing); built-in provider hosts whitelisted, custom `api_url`s auto-discovered from settings.json; loopback providers (ollama/lmstudio) stay direct via NO_PROXY (#2340) |
| **goose** (Goose CLI) | `bili goose` (launcher) — rustls trusts no CA file, so no cert-MITM: openai/anthropic legs via `OPENAI_HOST`/`ANTHROPIC_HOST`, custom providers via a regenerated `GOOSE_PATH_ROOT` overlay (#1049) |
| **everything else** (no context hook) | [`billion-context`](https://github.com/ranxianglei/billion-context) — `bili <client>` (launcher, preferred) or `/bili/` prefix |

**Native mode vs standalone extensions.** The host-native plugins (`bili plugin install …`) and the standalone in-process extensions (`billion-context-pi`, `opencode-acp`) are **mutually exclusive** — both active means double compression. The installer makes the switch: it replaces the legacy entries (bare name, `npm:` alias, versioned, path form; array or object shape) and snapshots the original config to `.bili-bak` once; a **project-local** install is not touched — remove that one by hand. As a runtime safety net for manual installs, the native entries set `BILLION_CONTEXT_NATIVE=<host>` synchronously at load so a standalone extension can stand down at action time. On the pi side the marker needs `billion-context-pi` **0.1.72+**, and the pi-native entry scans both pi settings files once its proxy is up and warns loudly when it spots a co-resident legacy entry the installer never saw — that warning is the only visible signal while an old `billion-context-pi` silently double-compresses.
```

</details>

**依据 3 · 作者声明**：[kernel/PROVENANCE.md:3-21](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/PROVENANCE.md#L3-L21)

作者对来源及quality gate省略的说明，不当法律或原创认证。

<details>
<summary>查看原文（19行）</summary>

```text
This document classifies **every** source file in `opencode-acp/lib/` (the donor) into one of three buckets, to determine what can be carried into the MIT `acp-kernel` and what must be reimplemented in fresh expression.

**Method**: exact path comparison of `opencode-acp` (the ACP fork, 82 `lib/*.ts` files) against the upstream DCP repository (66 `lib/*.ts` files). A file that has **no DCP equivalent** is original work (bucket A). A file with a **DCP equivalent at the same path** is a DCP derivative — its _expression_ is AGPL-bound regardless of how much it was later changed (derivation is judged by whether a file was created by transforming the original, not by % changed; per copyright law expression is protected, not ideas/methods/algorithms).

---

## Legend

| Bucket  | Meaning                                                                      | Action in acp-kernel                                                                                    |
| ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **A**   | No DCP equivalent → original work of ranxianglei                             | **Bring verbatim** (the author's own code, MIT-safe). License header rewritten to MIT.                  |
| **B**   | DCP-derived file (same path exists upstream) → derivative expression is AGPL | **Reimplement in fresh expression** using the author's algorithm; do NOT copy/refactor the file's code. |
| **N/A** | Adapter-only (framework-specific: opencode hooks, I/O, auth, commands, UI)   | **Excluded** from the pure core. Stays in host adapters. Origin irrelevant.                             |

---

## Bucket A — Original work (bring verbatim) — 30 files

Quality gate intentionally omitted from acp-kernel (may be added later if needed).
```

</details>

#### 缺口

- 相同模型预算下长任务关键事实和最终交付质量未知
  **影响**：不能把token/窗口指标当语义保真或生产收益
  **进一步探讨**：固定任务比较宿主compact、人工总结与本项目，记录关键事实、任务合格率和总费用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH请求如何经过代理并保持会话归属？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package exports将根DSH入口指向dist/agent/dsh-native，bundle插入bili-native与独立compaction gate。native依附或启动自有proxy，安装global fetch拦截只对符合模型API模式的请求改写到/bili路径，原生工具manifest从proxy取回后注册；不是只在客户端提示模型少写一点。

注册循环逐工具采用并处理已经注册情形，完成才toolsReady=true。headersFor在tools未ready或无法归属当前session时不发送plugin headers；成功则带conversation ID和当前请求对应的模型窗口信息。模型信息优先会话header，不用另会话默认随意覆盖。工具首次注册失败仍释放启动等待，后续指数退避恢复；因此代理可达和插件压缩有效是两个状态。

/acp与/acp-cache命令优先使用调用方session，其次ALS，最后fallback latest时明确标出所展示会话。可借鉴的是把请求体、身份和工具准备状态绑定，避免跨会话压缩状态串用；但全局fetch拦截、动态宿主服务和fork/增量请求让兼容面大，不能据源码有守卫断言全部并发已验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-16](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/package.json#L5-L16)

根DSH/native发布入口。

<details>
<summary>查看原文（12行）</summary>

```text
  "type": "module",
  "main": "dist/index.js",
  "exports": {
    ".": "./dist/agent/dsh-native.js",
    "./server": "./dist/agent/opencode-native.js",
    "./dsh": "./dist/agent/dsh-native.js",
    "./dsh-compaction-gate": "./dist/agent/dsh-compaction-gate.js",
    "./package.json": "./package.json",
    "./dsh/package.json": "./package.json",
    "./client": "./dist/agent/dsh-native-client.js"
  },
  "bin": {
```

</details>

**依据 2 · 源码核查**：[dsh.bundle.patch.yml:21-39](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/dsh.bundle.patch.yml#L21-L39)

实际bundle和preset接线。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
  inject: [biliBasicCompactionPolicy]
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-native.ts:1-47](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/src/agent/dsh-native.ts#L1-L47)

作者源码说明attach/spawn/fetch/工具及宿主边界。

<details>
<summary>查看原文（47行）</summary>

```text
// Native dsh (deepseek-harness) cordis plugin (#941): full plugin-mode
// compression for dsh WITHOUT a launcher — bare `dsh` with this plugin
// installed via `bili plugin install dsh` (cordis.patch.yml entry) or
// injected by the `bili dsh` launcher through the same --patch overlay that
// used to carry dsh-acp.ts. Architecture mirrors pi-native.ts:
//   1. plan: attach (BILLION_CONTEXT_ATTACH ?? BILLION_CONTEXT_PROXY — the
//      launcher preset, or a user-supplied external proxy; #983: the preset
//      is probed and a dead one falls back to spawn; #1130: runtime death of
//      the shared proxy re-runs the same probe+fallback) or spawn the
//      package's own proxy (ensureProxyRunning, ephemeral port, parent-pid
//      watchdog = this dsh process);
//   2. patch globalThis.fetch (native-intercept.ts) — model-API URLs are
//      rewritten to `<proxy>/bili/<url>` in BOTH modes (attach shares
//      #809 rewrite semantics; a loopback proxy target is never proxied,
//      so launcher MITM envs are simply bypassed); already-routed `/bili/`
//      URLs pass through untouched except for header stamping;
//   3. register the proxy's tool manifest (compress/decompress/acp_status)
//      as native dsh tools — parameters pass through verbatim (the manifest
//      serves real JSON Schema, and ctx.tools.register projects
//      definition.parameters as-is onto the wire);
//   4. headersFor gates plugin mode exactly like pi.ts's
//      before_provider_headers stamp: no x-bili-plugin headers until the
//      tools are registered, so round 1 rides the proxy's wire mode instead
//      of arriving tool-less. The conversation id comes from
//      ctx.agents.currentInitiator() — dsh's AsyncLocalStorage attribution,
//      read synchronously at request time inside the agent's driver chain;
//   5. /acp command (absorbs dsh-acp.ts, now session-bound when an
//      initiator is active, latest-session fallback otherwise);
//   6. host-title channel (#2604): dsh owns its session names (the
//      dsh-session-title service emits log-backed `session/title` events on
//      fallback creation, LLM-generation acceptance and user rename,
//      latest-wins). The plugin mirrors each one to the proxy's
//      /__bili/plugin/session-name endpoint (pi.ts #2322 pattern) so the
//      panel labels a conversation with the host name instead of the
//      truncated first user message. Both services are optional — older
//      hosts degrade to the pre-#2604 labelless behavior, never block boot.
// Native auto-compaction stands down on BOTH planes: the INSTALLER/LAUNCHER
// patch file keeps the host-plane row at auto:false, and the always-on
// bili-compaction-gate entry (dsh-compaction-gate.ts) disables the web-profile
// PRESET instances at load time (#3354, vendored from
// deshark42/dsh-compaction-basic-disable — see dsh-compaction-disable.ts);
// this module only DECLARES that the lane is owned, so a disabled or
// kill-switched bili-native leaves the presets bootable with stock compaction
// instead of pending on a service no one provides anymore (#3662).
// dsh has no compaction event hook to observe a manual /compact, so its
// boundary is left to the kernel's natural ingest diff (#395 gap, acceptable:
// manual /compact is rare and auto mode is off).
```

</details>

**依据 4 · 源码核查**：[src/agent/dsh-native.ts:950-1004](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/src/agent/dsh-native.ts#L950-L1004)

工具注册完成与退避恢复。

<details>
<summary>查看原文（55行）</summary>

```text
    if (register.toolsReady || base === undefined) return;
    register.pending = (async () => {
        const tools = await fetchManifest(base, "anthropic");
        // #2082: land on the CURRENT context, not the one that started this
        // flight — a re-activation mid-fetch must not register into (or die
        // on) the deactivated context captured at call time.
        const target = activeCtx ?? ctx;
        let adopted = 0;
        for (const tool of tools) {
            try {
                target.tools.register(toolDefinition(tool));
            } catch (err) {
                // #3380: idempotent adoption — a name this process ALREADY
                // holds in the host tool layer throws "already registered";
                // that registration is exactly what we want, so skip it and
                // register the rest (also converges a partial registration
                // left by an earlier interrupted flight).
                if (!errMessage(err).includes("already registered")) throw err;
                adopted += 1;
            }
        }
        if (adopted > 0 && !regAdoptLogged) {
            regAdoptLogged = true;
            persistClientEvent(`tool registration adopted ${adopted} pre-existing registration(s) from this process — continuing`);
        }
        register.toolsReady = true;
        register.failStreak = 0;
        register.lastRegistrationError = undefined;
    })()
        .catch((err: unknown) => {
            // Cordis deactivates the plugin context while the host tears down
            // (dsh --help, early CLI exits): every later register attempt hits
            // "cannot get required service ... in inactive context" and would
            // never succeed — stop retrying and stay quiet (dsh 0.1.5+).
            if (errMessage(err).includes("inactive context")) {
                register.dead = true;
                return;
            }
            // #3380 P2: consecutive failures escalate — capped exponential
            // back-off (a flat wall retried the incident's identical doomed
            // failure 145×/h) and a one-time loud notice with the recovery
            // action. Retries NEVER stop: a transient fault must still heal
            // (#983/#2082 — permanent non-recovery was the original bug class).
            register.failStreak += 1;
            register.lastRegistrationError = errMessage(err);
            if (register.failStreak === REG_GIVE_UP_NOTICE_STREAK) {
                persistClientEvent(`bili tools still unavailable after ${register.failStreak} failed registrations (last: ${register.lastRegistrationError}) — model requests ride bili WITHOUT identity headers (wire mode: no compression, anonymous sessions). Restart dsh to restore; retries continue in the background.`);
            }
            // Scope the back-off to the base that actually failed: if the
            // register moved on while this manifest fetch was in flight (the
            // apply chain unfroze a dead preset, maybeRetry healed elsewhere),
            // an armed retryAt would gate the NEXT base's first heal behind a
            // 10s wall — exactly the windows-22 CI deadlock (#1783).
            if (register.base === base) register.retryAt = Date.now() + regBackoffMs(register.failStreak);
            persistClientEvent(`manifest registration failed (${errMessage(err)}) — retrying; requests stay in wire mode until it succeeds`);
```

</details>

**依据 5 · 源码核查**：[src/agent/dsh-native.ts:2327-2356](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/src/agent/dsh-native.ts#L2327-L2356)

toolsReady、session及模型信息header门控。

<details>
<summary>查看原文（30行）</summary>

```text
    state.headersFor = (_url) => {
        maybeRetry(ctx);
        if (!register.toolsReady) return undefined;
        const attr = attributionOf(ctx);
        if (attr.state !== "ok") return undefined;
        const sid = attr.sid;
        ensureDshTitleReported(sid);
        // #2381: size this request against the model IT routes to — session
        // header first, global default only as fallback. Stamping reads ONLY
        // that key's own entry, so a mismatched model's numbers can never be
        // sent (the proxy-side exact-match gate stays as defense in depth).
        const target = sessionModelTargetOf(ctx) ?? globalModelTarget(modelInfo.services);
        refreshModelInfo(register.base, target);
        const headers: Record<string, string> = { "x-bili-plugin": "dsh", "x-bili-plugin-conversation": sid };
        // #3370: the incremental-turn marker (and, since #3329, the turn id)
        // is no longer stamped here — a closure-level armed flag shared by
        // every session raced concurrent requests across the awaited
        // beforeSend → headersFor boundary. Both now ride init.headers from
        // the conversion itself (see maybeIncrementalNative), atomic with
        // the body swap.
        if (target !== undefined) {
            const cached = modelInfo.byKey.get(modelInfoKey(target.provider, target.model));
            if (cached !== undefined) {
                const modelHeader = asciiHeaderValue(cached.model);
                if (modelHeader !== undefined) headers["x-bili-plugin-model"] = modelHeader;
                if (cached.contextWindow !== undefined) headers["x-bili-plugin-context-window"] = String(cached.contextWindow);
                if (cached.maxOutput !== undefined) headers["x-bili-plugin-max-output"] = String(cached.maxOutput);
            }
        }
        return headers;
```

</details>

**依据 6 · 源码核查**：[src/agent/dsh-native.ts:1436-1484](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/src/agent/dsh-native.ts#L1436-L1484)

状态命令绑定与latest明确提示。

<details>
<summary>查看原文（49行）</summary>

```text
// #1677: session id of the command's invoking agent (host-passed invocation); malformed
// shapes yield undefined so callers fall through to ALS attribution then latest, never throw.
function invocationSidOf(invocation: CommandInvocation | undefined): string | undefined {
    const sid = invocation?.agent?.session?.id;
    return typeof sid === "string" && sid.length > 0 ? sid : undefined;
}

// Banner for the /acp + /acp-cache latest-fallback: names the session actually shown so
// foreign data is never silently presented as the caller's own (#1677).
function latestSessionNote(status: Record<string, unknown>, requestedSid: string | undefined): string {
    const resolved = typeof status.conversationId === "string" && status.conversationId.length > 0 ? status.conversationId : "the most recently active session";
    return requestedSid !== undefined
        ? `⚠️ bili: session ${requestedSid} is not known to the proxy — showing ${resolved} instead.`
        : `⚠️ bili: could not identify the current session — showing ${resolved} instead.`;
}

async function statusOutcome(ctx: PluginContext, invocation?: CommandInvocation): Promise<CommandOutcome> {
    const base = register.base;
    if (!base) {
        // #3380 P3: toolsReady implies a proxy WAS serving this session — a
        // missing origin is then a transient outage with recovery running,
        // not a missing install.
        return {
            kind: "error",
            text: register.toolsReady
                ? "bili: proxy temporarily unreachable — it was serving this session before and recovery is running in the background; compression resumes automatically when it answers."
                : "bili: no proxy detected — install via `bili plugin install dsh` or launch through `bili dsh`.",
        };
    }
    maybeRetry(ctx);
    // #3380 P3: wire-mode exposure — the proxy answers but the local tools are
    // down, so every model request rides bili WITHOUT identity headers
    // (anonymous zero-fold sessions, no compression). Say so in the panel the
    // user already looks at instead of letting it stay silent.
    const wireNote = !register.toolsReady && !register.dead
        ? `⚠️ bili tools NOT registered — model requests ride bili WITHOUT identity headers (wire mode: no compression, anonymous sessions). Last error: ${register.lastRegistrationError ?? "unknown"}. Restart dsh to restore; retries continue in the background.\n\n`
        : "";
    // #1677: the command executor hands us the invoking session via the invocation —
    // DSH never establishes the AsyncLocalStorage boundary on the command path, so
    // currentInitiator() is always empty here and relying on it made /acp silently
    // show ANOTHER (most-recently-active) session's panel. Prefer the invocation's
    // agent session id; fall back to ALS attribution, then the latest-session fallback.
    const sid = invocationSidOf(invocation) ?? sessionIdOf(ctx);
    let fellBackToLatest = false;
    let status: Record<string, unknown> | undefined = sid !== undefined ? await fetchStatus(base, sid) : undefined;
    if (status === undefined) {
        fellBackToLatest = true;
        status = await fetchStatusLatest(base);
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可逆压缩是否意味着摘要没有信息损失？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不是。kernel接收模型给出的startRef/endRef/summary，范围解析、受保护消息与长度检查约束能否折叠，分层块记录哪些消息被替换。已读ApplyCompressionInput把summary作为调用输入，长度检查拒绝空、过短或超长；这些结构约束不能证明摘要保留任务所需事实。模型可能生成格式合格但遗漏否定、路径或先前纠错的summary。

deactivateBlock把选中active块改为inactive，可选deep遍历下层块；恢复预览由尚不被active块覆盖的原消息产生。它支持状态层面的恢复和原文回查，但依赖原消息、内容store和session映射仍存在且可对齐。可逆是“能够重新露出保存的原文”，不等于压缩后模型始终知道自己忘了什么或会主动decompress。

关键反例是当前问题只在被摘要遗漏的一句约束上与旧任务不同。若模型没有意识到这句存在，就可能不调用恢复，窗口健康但任务错误。已读代码没有提供足以独立证明所有关键事实保真的任务验收，因此效果结论必须由同条件任务与原文对照支撑，不能以单纯token减少补齐。

#### 证据与依据

**依据 1 · 源码核查**：[kernel/src/compress.ts:123-135](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/compress.ts#L123-L135)

summary由调用输入提供，而非结构校验能证明语义。

<details>
<summary>查看原文（13行）</summary>

```text
export interface ApplyCompressionInput {
  ranges: {
    startRef: string;
    endRef: string;
    summary: string;
    topic?: string;
    compressCallId?: string;
    summaryMaxChars?: number;
  }[];
  messages: CoreMessage[];
  state: CompressionState;
  config: Config;
  protectedMessageIds?: Set<string>;
```

</details>

**依据 2 · 源码核查**：[kernel/src/compress.ts:611-620](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/compress.ts#L611-L620)

批次长度预检与内容类失败分界。

<details>
<summary>查看原文（10行）</summary>

```text
    // #3003: all-or-nothing summary-LENGTH pre-check. Length-class failures are
    // pure functions of (spec.summary, spec.summaryMaxChars, cfg) — no state and
    // no cross-range coverage — so they can be screened BEFORE any block commits.
    // Screening them here turns the common PARTIAL outcome (one oversized summary
    // rejects while sibling ranges land and open a seam) into a clean 0-commit
    // reject: nothing lands, so the model's single retry pays ONE seam instead of
    // two. Content-class failures (protected-zone / turn-integrity / no-new-
    // messages) DO depend on state + cross-range coverage and stay per-range below.
    // Scope is EXACTLY the fold-candidate set that mutates state in the loop —
    // never every requested range, else a consumed range whose summary happens to
```

</details>

**依据 3 · 源码核查**：[kernel/src/compress.ts:1683-1704](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/compress.ts#L1683-L1704)

空/短/长summary约束不等语义保真。

<details>
<summary>查看原文（22行）</summary>

```text
  spec: { summary: string; summaryMaxChars?: number },
  cfg: Config["compress"],
): void {
  const summary = spec.summary?.trim() ?? "";

  if (summary.length === 0) {
    throw new Error(
      "Summary is empty — provide a meaningful summary of the compressed range.",
    );
  }

  if (cfg.minSummaryLength > 0 && summary.length < cfg.minSummaryLength) {
    throw new Error(
      `Summary too short (${summary.length} chars, min ${cfg.minSummaryLength}). The summary must capture the compressed range's key information.`,
    );
  }

  const effectiveMax = spec.summaryMaxChars ?? cfg.maxSummaryLength;
  if (effectiveMax > 0 && summary.length > effectiveMax) {
    throw new Error(
      `Summary too long (${summary.length} chars, max ${effectiveMax}). Strip noise — keep critical paths, decisions, errors, and code references. Or pass summaryMaxChars to increase the limit — don't lose critical info just to fit.`,
    );
```

</details>

**依据 4 · 源码核查**：[kernel/src/decompress.ts:62-99](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/decompress.ts#L62-L99)

deactivate与deep遍历恢复状态。

<details>
<summary>查看原文（38行）</summary>

```text
export function deactivateBlock(
  state: CompressionState,
  blockIds: string[],
  options: DeactivateOptions = {},
): CompressionState {
  const targets = new Set(blockIds);

  const updated = state.blocks.map((block) => {
    if (!targets.has(block.blockId) || !block.active) return block;
    return {
      ...block,
      active: false,
      durationMs: block.durationMs,
      createdAt: block.createdAt,
    };
  });

  let final = updated;
  if (options.deep) {
    const visited = new Set<string>();
    const queue: string[] = [];
    for (const id of blockIds) {
      const block = updated.find((b) => b.blockId === id);
      if (block) queue.push(...block.directBlockIds);
    }
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      final = final.map((block) => {
        if (block.blockId !== id) return block;
        queue.push(...block.directBlockIds);
        return block.active ? { ...block, active: false } : block;
      });
    }
  }

  return { ...state, blocks: final };
```

</details>

**依据 5 · 源码核查**：[kernel/src/decompress.ts:107-143](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/decompress.ts#L107-L143)

预览从原messages且未覆盖部分产生，预览长度另有限制。

<details>
<summary>查看原文（37行）</summary>

```text
export function buildRestoredContentPreview(
  messages: CoreMessage[],
  beforeActiveMessageIds: Set<string>,
  state: CompressionState,
): RestoredPreviewResult {
  const restored: CoreMessage[] = [];
  for (const message of messages) {
    if (!beforeActiveMessageIds.has(message.id)) continue;
    const stillCovered = state.blocks.some(
      (b) => b.active && b.effectiveMessageIds.includes(message.id),
    );
    if (!stillCovered) restored.push(message);
  }

  if (restored.length === 0) return { preview: "", restoredCount: 0 };

  const lines: string[] = [];
  let totalLength = 0;
  const MAX_PREVIEW = 2000;
  const MAX_PER_MESSAGE = 200;

  for (const message of restored) {
    if (totalLength >= MAX_PREVIEW) break;
    const text = message.text ?? "";
    const truncated =
      text.length > MAX_PER_MESSAGE
        ? clampPrefix(text, MAX_PER_MESSAGE) + "..."
        : text;
    const label =
      message.toolName && message.contentType !== "text"
        ? `${message.toolName}: ${truncated}`
        : `[${message.role}] ${truncated}`;
    lines.push(label);
    totalLength += label.length + 1;
  }

  return { preview: lines.join("\n"), restoredCount: restored.length };
```

</details>

#### 缺口

- 模型能否识别需要恢复的缺失细节及多代摘要漂移
  **影响**：决定长任务正确性，不能由可逆结构替代
  **进一步探讨**：用否定/纠错/精确路径任务，比较压缩前后答案和是否主动恢复原文

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接管原生compact时如何降级，禁用哪一层才安全退出？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

DSH bundle不仅加入工具，还把host compaction-basic auto设false，并给多个preset添加biliBasicCompactionPolicy依赖。独立bili-compaction-gate无依赖，registerCompactionDisable提供服务与变换；native声明是否接管。这样禁用native仍保留服务，让preset可退回stock压缩而不因等待无人提供服务卡住。作者说明这解决特定宿主结构差异，归属中保留vendored上游来源。

如果工具注册失败，native显示wire mode无身份headers/无压缩，并后台重试；“代理还能返回模型响应”不能当压缩已启用。原生压缩与旧standalone扩展同时存在可能双重压缩，README要求互斥并说明项目本地安装不由全局installer自动清理。

退出应通过同一DSH bundle/plugin通道移除，而不是只手删gate条目或只改某个preset inject。patch替换完整inject或retry配置，宿主接口变化需要人工核对保留默认项。恢复原生compact是退出验收的重要部分，不能只看bili进程退出或工具消失。

#### 证据与依据

**依据 1 · 源码核查**：[dsh.bundle.patch.yml:5-39](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/dsh.bundle.patch.yml#L5-L39)

host/preset双层及独立gate、卸载边界。

<details>
<summary>查看原文（35行）</summary>

```text
# #1772/#2474/#3354: the `auto: false` below targets the HOST-PLANE
# compaction-basic row. In profiles bundling @deepseek-ai/dsh-web-app that row
# is disabled and the running instance lives inside the agent presets, whose
# nested rows no patch layer can address by id — the preset gate rows below
# make each Web preset wait for the load-time overlay the bili-compaction-gate
# entry registers (vendored from deshark42/dsh-compaction-basic-disable, MIT,
# #3354; see src/agent/dsh-compaction-disable.ts). A profile-level full-snapshot
# override of preset-standard (#2474) remains the fallback for dsh builds
# whose internal 'internal/config' hook moved.
# #3662: the gate lives in its OWN always-on entry, not in bili-native —
# disabling or kill-switching bili-native must leave the gate service alive so
# the presets fall back to STOCK dsh compaction instead of pending forever
# (the old wiring bricked session creation on exactly that path). Do NOT
# disable the bili-compaction-gate entry itself: it carries the service the
# presets wait on; to uninstall, remove billion-context from
# dsh.profile.bundles instead.
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
  inject: [biliBasicCompactionPolicy]
```

</details>

**依据 2 · 源码核查**：[dsh.bundle.patch.yml:40-55](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/dsh.bundle.patch.yml#L40-L55)

retry配置全替换语义，显示额外宿主影响。

<details>
<summary>查看原文（16行）</summary>

```text
# #2605: DSH's default retry whitelist omits MALFORMED_RESPONSE, so one
# sampling flake that breaks a tool-call argument JSON kills the whole turn
# unretried. A patch replaces the targeted row's WHOLE config (no deep
# merge), so each row restates every default code plus MALFORMED_RESPONSE —
# dropping any default code silently removes its retries. Rows absent on a
# given DSH version are skipped with a warning, never a boot failure.
- id: llm-deepseek
  config:
    retryPolicy:
      mode: normal
      retryableCodes: [EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, MALFORMED_RESPONSE]
- id: llm-deepseek-account
  config:
    retryPolicy:
      mode: normal
      retryableCodes: [EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, MALFORMED_RESPONSE]
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-compaction-gate.ts:1-20](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/src/agent/dsh-compaction-gate.ts#L1-L20)

独立常开服务和变换。

<details>
<summary>查看原文（20行）</summary>

```text
// #3662: the always-on half of the #3354 compaction gate. bili-native used to
// own BOTH the load-time overlay and the service the four web-profile presets
// inject — so disabling or kill-switching it removed the service and left the
// presets pending forever, bricking session creation. The overlay now lives in
// this separate entry, which has no dependencies of its own and therefore
// activates whenever the bundle patch / launcher overlay is mounted, whatever
// bili-native's state. It registers the transform and provides the gate
// service atomically (the #3354 ordering guarantee survives the split);
// WHETHER the transform actually disables rows is decided per process by the
// verdict bili-native declares — see dsh-compaction-disable.ts.
import { registerCompactionDisable, type CompactionDisableHost } from "./dsh-compaction-disable.js";

type PluginContext = CompactionDisableHost;

export const name = "bili-compaction-gate";
export const inject: string[] = [];

export function apply(ctx: PluginContext): void {
    registerCompactionDisable(ctx);
}
```

</details>

**依据 4 · 源码核查**：[src/agent/dsh-native.ts:1452-1471](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/src/agent/dsh-native.ts#L1452-L1471)

wire-mode状态明确，不等有效压缩。

<details>
<summary>查看原文（20行）</summary>

```text
async function statusOutcome(ctx: PluginContext, invocation?: CommandInvocation): Promise<CommandOutcome> {
    const base = register.base;
    if (!base) {
        // #3380 P3: toolsReady implies a proxy WAS serving this session — a
        // missing origin is then a transient outage with recovery running,
        // not a missing install.
        return {
            kind: "error",
            text: register.toolsReady
                ? "bili: proxy temporarily unreachable — it was serving this session before and recovery is running in the background; compression resumes automatically when it answers."
                : "bili: no proxy detected — install via `bili plugin install dsh` or launch through `bili dsh`.",
        };
    }
    maybeRetry(ctx);
    // #3380 P3: wire-mode exposure — the proxy answers but the local tools are
    // down, so every model request rides bili WITHOUT identity headers
    // (anonymous zero-fold sessions, no compression). Say so in the panel the
    // user already looks at instead of letting it stay silent.
    const wireNote = !register.toolsReady && !register.dead
        ? `⚠️ bili tools NOT registered — model requests ride bili WITHOUT identity headers (wire mode: no compression, anonymous sessions). Last error: ${register.lastRegistrationError ?? "unknown"}. Restart dsh to restore; retries continue in the background.\n\n`
```

</details>

**依据 5 · 作者声明**：[README.md:131-131](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/README.md#L131-L131)

双重压缩与局部旧安装限制。

```text
**Native mode vs standalone extensions.** The host-native plugins (`bili plugin install …`) and the standalone in-process extensions (`billion-context-pi`, `opencode-acp`) are **mutually exclusive** — both active means double compression. The installer makes the switch: it replaces the legacy entries (bare name, `npm:` alias, versioned, path form; array or object shape) and snapshots the original config to `.bili-bak` once; a **project-local** install is not touched — remove that one by hand. As a runtime safety net for manual installs, the native entries set `BILLION_CONTEXT_NATIVE=<host>` synchronously at load so a standalone extension can stand down at action time. On the pi side the marker needs `billion-context-pi` **0.1.72+**, and the pi-native entry scans both pi settings files once its proxy is up and warns loudly when it spots a co-resident legacy entry the installer never saw — that warning is the only visible signal while an old `billion-context-pi` silently double-compresses.
```

#### 缺口

- 目标DSH预发布版本的preset、工具和原生压缩是否真正复原
  **影响**：影响退出和防双压缩，不能只靠卸载命令存在
  **进一步探讨**：在隔离profile记录启用/禁用/移除后工具、preset和原生compact状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用长会话压缩需要付什么代价，怎样有界试用？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

启动需要Node>=20的包运行时、宿主实际要求、可用模型/provider与可保存会话状态的本地环境；DSH安装要使用含dist的发布包，Git源码地址不自动提供构建产物。不同客户端native、launcher、URL模式并非同一能力，不能把Codex MCP companion当自动代理全部流量。

首次成本是固定包/宿主、备份profile与历史、检查旧扩展和proxy归属；持续有compress/decompress工具调用及模型额外回合、状态存储和缓存重建；失败涉及摘要遗漏、范围映射、代理恢复与原生compact切换。压缩会减输入体积，但可能增加输出/工具/重新检索和人工纠错，真实价格、合格率和总费用未知，不用宣传倍数计算ROI。

建议维护长编码任务且能保留原日志的人，在独立profile比较宿主compact与本方案，用明确关键事实验收。出现wire-mode长期不可恢复、双压缩、关键事实持续丢失或不能恢复原文时，停止依赖压缩并移除bundle，核对原生compact及原历史仍可用。不是用更长会话替代版本控制、任务分解或正确交付验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:97-113](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/package.json#L97-L113)

Node与分发文件，dist为运行必要材料。

<details>
<summary>查看原文（17行）</summary>

```text
  },
  "files": [
    "LICENSE",
    "README.md",
    "CONFIGURATION.md",
    "CONFIGURATION.zh-CN.md",
    "dist",
    "dsh.bundle.patch.yml",
    "hermes-plugin",
    "paper/*.md",
    "paper/figures/*.png",
    "website/articles.json",
    "website/blog/posts"
  ],
  "pi": {
    "image": "https://raw.githubusercontent.com/ranxianglei/billion-context/master/docs/logo.png",
    "extensions": [
```

</details>

**依据 2 · 作者声明**：[README.md:111-116](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/README.md#L111-L116)

DSH与Codex通道能力区分。

```text
| **dsh** | `bili dsh` (launcher — full native plugin via `--patch`) or `bili plugin install dsh` ≡ `dsh plugin --profile <name> add billion-context` (one unified lane) — details: [CLIENTS.md](CLIENTS.md) |
| **kimi** | `bili plugin install kimi` (self-spawning native, Kimi Code ≥ 2.0.0) or `bili kimi` (cert-MITM) or `/bili/` prefix — details: [CLIENTS.md](CLIENTS.md) |
| **hermes** | `bili plugin install hermes` (self-spawning native, Python plugin #958) or `bili hermes` (cert-MITM) |
| **zcode** (Z.ai / bigmodel coding plan) | `bili plugin install zcode` (self-spawning native, #1145) or cert-MITM via the GUI's Settings → Network or `/bili/` prefix — details: [CLIENTS.md](CLIENTS.md) |
| **claude** | `bili claude` (launcher) or `bili plugin install claude` (native posture, #964 — managed settings block + session-owned proxy; see the notes below) |
| **codex** | `bili codex` (launcher — the full zero-config posture) or `bili plugin install codex` (MCP-shell tools companion: **start bili first** — the shell never spawns a proxy and never routes codex's own traffic) — details: [CLIENTS.md](CLIENTS.md#codex-openai-codex-cli) |
```

**依据 3 · 作者声明**：[README.md:203-210](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/README.md#L203-L210)

DSH发布包与Git源码安装差异。

```text
Where a client has its own plugin channel you can also install natively,
skipping bili commands entirely:

- **dsh:** `dsh plugin --profile <name> add billion-context` is the very
  command `bili plugin install dsh` drives per profile (npm form only; a git
  checkout has no published entry — pasting a GitHub address installs source
  without `dist/` and the bundle never loads) — same end state either way
  (pnpm into the profile, bundled patch layer mounted by dsh itself); remove
```

**依据 4 · 源码核查**：[kernel/src/compress.ts:123-135](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/compress.ts#L123-L135)

工具summary是模型额外输入输出工作。

<details>
<summary>查看原文（13行）</summary>

```text
export interface ApplyCompressionInput {
  ranges: {
    startRef: string;
    endRef: string;
    summary: string;
    topic?: string;
    compressCallId?: string;
    summaryMaxChars?: number;
  }[];
  messages: CoreMessage[];
  state: CompressionState;
  config: Config;
  protectedMessageIds?: Set<string>;
```

</details>

#### 缺口

- 全任务token、模型费用和人工纠错是否净减少
  **影响**：不能宣称5倍省费或提高生产力
  **进一步探讨**：同模型同任务统计压缩/恢复/失败重试与最终合格交付，不只计压缩成功样本

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 压缩后用关键事实回查能否比只看窗口更可靠？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是让压缩范围保留少量任务关键约束索引，包括否定、用户纠错、精确路径和待验证结论，并在高影响决策前要求对这些引用回查原文。Q03说明结构可逆不代表模型知道何时恢复，Q02已有范围引用和会话归属可作为接线基础。目标是减少“窗口正常但事实遗漏”，不是增加另一个泛化摘要。

代价是索引生成、回查调用、上下文和模型回合，关键事实提取本身也可能漏。最小验证用含否定反转、跨代纠错和文件重命名的20个长任务，固定模型和总预算，对比宿主compact、原方案和关键事实回查；记录正确决策、主动恢复、额外token和人工修正时间。只有合格率或人工负担改善且预算可接受才支持；若提取遗漏与原方案相同或总成本更高则停止。该功能本轮未实现，不计现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[kernel/src/compress.ts:123-135](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/compress.ts#L123-L135)

范围与summary输入是关键事实挂接线索。

<details>
<summary>查看原文（13行）</summary>

```text
export interface ApplyCompressionInput {
  ranges: {
    startRef: string;
    endRef: string;
    summary: string;
    topic?: string;
    compressCallId?: string;
    summaryMaxChars?: number;
  }[];
  messages: CoreMessage[];
  state: CompressionState;
  config: Config;
  protectedMessageIds?: Set<string>;
```

</details>

**依据 2 · 源码核查**：[kernel/src/decompress.ts:107-143](https://github.com/ranxianglei/billion-context/blob/02bcdc4b7601c47a8965c4343032d9692748c975/kernel/src/decompress.ts#L107-L143)

已有原文恢复预览提供验证基础，不证明假设效果。

<details>
<summary>查看原文（37行）</summary>

```text
export function buildRestoredContentPreview(
  messages: CoreMessage[],
  beforeActiveMessageIds: Set<string>,
  state: CompressionState,
): RestoredPreviewResult {
  const restored: CoreMessage[] = [];
  for (const message of messages) {
    if (!beforeActiveMessageIds.has(message.id)) continue;
    const stillCovered = state.blocks.some(
      (b) => b.active && b.effectiveMessageIds.includes(message.id),
    );
    if (!stillCovered) restored.push(message);
  }

  if (restored.length === 0) return { preview: "", restoredCount: 0 };

  const lines: string[] = [];
  let totalLength = 0;
  const MAX_PREVIEW = 2000;
  const MAX_PER_MESSAGE = 200;

  for (const message of restored) {
    if (totalLength >= MAX_PREVIEW) break;
    const text = message.text ?? "";
    const truncated =
      text.length > MAX_PER_MESSAGE
        ? clampPrefix(text, MAX_PER_MESSAGE) + "..."
        : text;
    const label =
      message.toolName && message.contentType !== "text"
        ? `${message.toolName}: ${truncated}`
        : `[${message.role}] ${truncated}`;
    lines.push(label);
    totalLength += label.length + 1;
  }

  return { preview: lines.join("\n"), restoredCount: restored.length };
```

</details>

#### 缺口

- 关键事实索引能否覆盖真正影响任务的细节
  **影响**：研究者新假设，不是已实现保护
  **进一步探讨**：固定长任务与总预算对照事实正确、额外调用和人工时间，无收益则停止

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
