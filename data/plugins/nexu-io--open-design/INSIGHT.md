# OpenDesign

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5efd0b2](https://github.com/nexu-io/open-design/tree/5efd0b263621e5b0039fce95399ab9de04da3461)

<!-- BEGIN META -->
[![GitHub ★ 106,098](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106%2C098&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nexu-io/open-design)
<!-- END META -->

> **功能**：连接编码 Agent、设计系统、原型预览和团队反馈的独立设计工作区。

> **亮点**：[Q01](#research-q01) 至 [Q04](#research-q04) 的贡献是把设计者的 Agent 运行、可定位制品及评论交接意图放进同项目，并提供实际会话匹配、有限发布门和 revision 条件 ACK。相比手工传文件/截图，它为交接提供结构与恢复位置；不是全新模型或自动设计验收，也没有证明所有云协作可用。

> **主要限制**：[Q02](#research-q02) 的 completed 含 max-tokens，[Q03](#research-q03) 的 body 与 manifest 分开写，[Q04](#research-q04) 的单条 Vela 弱回执仍能消费队列：客户端状态能否可靠对应可打开、版本一致且远端可读的交付？现有门禁只覆盖具体链路，不能将未运行的缺口写成已发生丢失，也不能把 delivered 当接收或验收。

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
  - [Q01 · OpenDesign 的实际条目范围、交付对象和相对基线是什么？](#detail-section-11)
  - [Q02 · DSH 从发现到执行、续会话和取消能保证什么？](#detail-section-12)
  - [Q03 · 制品创建如何落盘和预览，哪些门不能代替交付验收？](#detail-section-13)
  - [Q04 · 评论本地提交、身份绑定、重试与远端回执是否闭合？](#detail-section-14)
  - [Q05 · 什么试用范围值得承担依赖、权限与恢复负担？](#detail-section-15)
  - [Q06 · 值得验证的下一步是增加设计功能，还是补齐交付证据？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向已有编码 Agent 的设计开发者，将一份 brief 做成可预览 HTML，并在同项目接续修改；结果须由人核对设计要求与版本。

[Q01](#research-q01) 对照编辑器中的编码 Agent、普通 HTML/浏览器预览和截图聊天反馈；工具循环、模型及设计资产为继承能力。已有数据库 outbox 和条件 ACK 是成熟方法，本项主要做设计任务中的组合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH stdio 会话 | 项目内启动/续接 Agent 并显示事件 | 有限版本政策；工具权限来自用户 profile |
| 制品登记与预览 | 把输出关联到项目和 manifest | 有限发布门；不替代视觉验收 |
| 评论持久外发 | 保存意见与修订重试意图 | 依赖工作区/远端身份；弱回执不等于接收 |

**流程与依赖**

| 依赖 | 作用 | 版本或条件 |
|---|---|---|
| 根客户端 | 独立 od/daemon | 0.25.1，Apache-2.0 |
| Node / pnpm | 构建与运行 | ~24 / >=10.33.2 <11 |
| DSH/profile | 实际工具执行 | open-design；版本政策限0.1系列具体rc范围，见Q02 |
| dsh-runtime | stdio companion | 0.1.0；cmdline0.1.1-rc.2及所列peer |
| 模型与项目目录 | 生成和本地副作用 | 用户配置授权、额度和可写副本 |
| Vela/云身份 | 可选评论外发 | 工作区成员/项目绑定与远端服务；未运行 |

| 步骤 | 操作 | 结果与失败处理 |
|---|---|---|
| 首次准备 | 独立数据目录、项目副本、CLI/profile/probe | 不满足版本或授权先停 |
| 本地任务 | 提供HTML brief与设计要求 | 对照session/终态，不把截断当完成 |
| 核制品 | 打开文件和manifest，再看预览 | 半写先核字节与清理副本 |
| 接续修订 | 在同项目对意见改稿 | 云同步另核身份和远端读回 |
| 失败退出 | 取消、核进程/目录及凭据 | 不假定取消回滚，必要时还原副本 |

**效果与成本**

| 阶段 | 现金 | 人工与风险承担 |
|---|---|---|
| 首次 | 模型/服务方案依使用者；金额未知 | 构建、CLI/profile、资产和备份；耗时未知 |
| 持续 | 推理及可选云用量未知 | 人工视觉/版本验收、依赖维护 |
| 失败恢复 | 追加推理/服务费未知 | 截断、半写和回执读回排障 |
| 退出 | 已耗额度是否退款未核 | 停进程、保存项目、撤销授权/分享；未测卸载 |

| 任务结果 | 当前材料支持 | 尚不支持 |
|---|---|---|
| Agent运行可对照 | 会话匹配、事件过滤和终态 | 内容完整、全部版本兼容 |
| 制品有落点 | 文件API/manifest及有限门/预览 | 原子创建、设计质量 |
| 意见可恢复 | 同库outbox及revision条件ACK | weak receipt下远端接收、意见落实 |
| 采用收益 | 可设计隔离本地试用 | 节时、ROI、持续团队价值 |

> **思考**：[Q02](#research-q02) 的 completed 含 max-tokens，[Q03](#research-q03) 的 body 与 manifest 分开写，[Q04](#research-q04) 的单条 Vela 弱回执仍能消费队列：客户端状态能否可靠对应可打开、版本一致且远端可读的交付？现有门禁只覆盖具体链路，不能将未运行的缺口写成已发生丢失，也不能把 delivered 当接收或验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 至 [Q04](#research-q04) 的贡献是把设计者的 Agent 运行、可定位制品及评论交接意图放进同项目，并提供实际会话匹配、有限发布门和 revision 条件 ACK。相比手工传文件/截图，它为交接提供结构与恢复位置；不是全新模型或自动设计验收，也没有证明所有云协作可用。

[Q02](#research-q02) 到 [Q04](#research-q04) 已核实际 caller 而非只看schema：会话隔离、realpath及revision ACK有具体作用；completed、半写和弱收据是不同层的边界。复杂多模块应用只检查代表链，不以仓库规模、测试文件或绿色CI证明可用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的 completed 含 max-tokens，[Q03](#research-q03) 的 body 与 manifest 分开写，[Q04](#research-q04) 的单条 Vela 弱回执仍能消费队列：客户端状态能否可靠对应可打开、版本一致且远端可读的交付？现有门禁只覆盖具体链路，不能将未运行的缺口写成已发生丢失，也不能把 delivered 当接收或验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先核独立客户端环境和 DSH probe，限定一份本地 HTML 与副本，不启云同步；逐次核运行是否截断、文件/manifest 和视觉结果。取消后检查实际副作用，再决定续会话或还原；[Q06](#research-q06) 的故障与验收实验需另行授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的组合机制解释；采用为隔离本地有限试用；质量、兼容、成本与云端读回未验证；未来交付证据链为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、apps/daemon/src/agent-protocol/dsh-profile/session.ts、apps/daemon/src/artifacts/create.ts、apps/daemon/src/artifacts/successful-run-deliverable-finalization.ts、apps/daemon/src/collab/collab-cloud-service.ts、apps/daemon/src/collab/comment-relay-outbox.ts、apps/daemon/src/collab/vela-cli-collab-client.ts、apps/daemon/src/projects.ts、apps/daemon/src/routes/project/comments.ts、apps/daemon/src/routes/project/index.ts、apps/daemon/src/runtimes/defs/deepseek-harness.ts、apps/daemon/src/runtimes/runs.ts、apps/daemon/src/server.ts、apps/web/src/components/DesignFilesPanel.tsx、package.json、packages/dsh-runtime/package.json、packages/dsh-runtime/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根独立客户端的 DSH执行、代表文件写入/缩略预览和本地评论outbox→单条Vela链；未全审所有provider/工具、桌面发行、全部UI、BYOK代理或云后端。固定源码只读，正式前稿六题及findings已复核。
- 下一步：未安装、运行目标、测试、模型或云服务。身份/版本/路径和错误分支由源码核查；并发、截断、取消、manifest故障、弱收据与真实设计效果仍需隔离实验。

**分析版本**

- **仓库**：[nexu-io/open-design](https://github.com/nexu-io/open-design)
- **版本号**：0.25.1（[固定提交 5efd0b2](https://github.com/nexu-io/open-design/tree/5efd0b263621e5b0039fce95399ab9de04da3461)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议把运行终态、制品字节、远端读回与人的验收分别绑定同一版本，先用截断、半写和空回执故障与人工清单比较；若状态辨别及恢复不优于清单或代价更大，就放弃。候选尚未实现或验证。

未安装、运行目标、测试、模型或云服务。身份/版本/路径和错误分支由源码核查；并发、截断、取消、manifest故障、弱收据与真实设计效果仍需隔离实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2081 | 344776 | — | — | 3084226 |
| .ts | source | 1955 | 708146 | 580881 | 94158 | — |
| .ts | test | 2208 | 623497 | 526646 | 49687 | — |
| .mjs | source | 78 | 13136 | 10303 | 1937 | — |
| .md | example | 295 | 32768 | — | — | 244833 |
| .ts | example | 16 | 1005 | 850 | 81 | — |
| .mjs | example | 3 | 1086 | 773 | 276 | — |
| .cts | source | 1 | 409 | 342 | 31 | — |
| .tsx | source | 308 | 216809 | 175841 | 33832 | — |
| .js | source | 39 | 13023 | 10637 | 1580 | — |
| .tsx | test | 868 | 309011 | 253272 | 29430 | — |
| .js | example | 26 | 7803 | 5932 | 1096 | — |
| .jsx | source | 6 | 99 | 90 | 0 | — |
| .md | test | 13 | 1248 | — | — | 7154 |
| .cjs | source | 2 | 1266 | 1112 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 581](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=581&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 185](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=185&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 139](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=139&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的 DSH 执行、制品写入与评论外发能支持什么交付和采用，哪些状态不能当成功证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · OpenDesign 的实际条目范围、交付对象和相对基线是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是独立设计客户端，根应用版本为 0.25.1，不是根目录可直接装入 DSH 的插件。package.json 提供 od 命令、独立安装脚本及 Node/pnpm 约束；内置 @open-design/dsh-runtime 的 0.1.0 是 companion 包版本，不能替代应用版本。作者描述的任务是从 brief 和设计系统生成原型、交团队反馈，再在同一项目继续修订；“first”与宣传模型、模板数量不作为首创或效果证据。

目标用户是已有编码 Agent、需要交付可预览 HTML 原型的设计开发者。合格结果须符合 brief、位于正确项目、能预览且经人确认，不能只看进程退出或聊天文字。明确基线是编码 Agent 在编辑器生成 HTML、浏览器预览、截图或聊天传意见，再手工对应文件版本。本项目把 Agent 会话、制品登记和反馈意图组织在项目中；已有工具循环、模型能力与设计资产不能全部归为本客户端原创。

本轮检查根客户端中的 DSH 执行、代表制品写入/缩略预览、评论持久外发三条链及失败分支，未将几千文件抽读说成全部模块审计。多 provider、BYOK 代理、全部插件安装器、桌面发行和云后端不在本轮机制验收内。正式旧研究的六题、全部 findings 与当前报告已作为前稿读取，本次结论由固定当前源码重核，未继承旧评分。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/package.json#L1-L14)

根版本、描述、许可、od 命令与安装脚本支持独立应用分类。

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

**依据 2 · 作者声明**：[README.md:28-32](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/README.md#L28-L32)

作者定位 brief、设计系统、原型、团队反馈与同项目修订。

```text
## What is OpenDesign

OpenDesign is **the 1st collaborative AI design agent workspace**. Start with a brief, then use your coding agent or OpenDesign Cloud to create a prototype that follows your design system. Share it with your team for feedback, and let your agent refine it in the same project.

That workflow is open and extensible. OpenDesign is licensed under Apache 2.0 and gives teams skills, design templates, design systems, and plugins they can inspect and adapt to their own process.
```

**依据 3 · 源码核查**：[packages/dsh-runtime/package.json:1-14](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/packages/dsh-runtime/package.json#L1-L14)

0.1.0 属于内部 DSH runtime 包。

<details>
<summary>查看原文（14行）</summary>

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
    },
    "./startup": {
```

</details>

#### 缺口

- 没有同版本真实设计任务、使用者访谈或团队采用记录。
  **影响**：人群痛点和质量收益仅能作有条件分析，不能证明重复收益。
  **进一步探讨**：在非敏感项目用相同 brief 对比编辑器基线并由设计者盲评。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 从发现到执行、续会话和取消能保证什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

实际定义调用 dsh --profile open-design --stdio，probe 前先检查 DSH_HOME（默认 ~/.dsh）下 open-design/package.json，以避免缺 profile 时的探测副作用。版本政策明确列举 0.1.0-rc.8/0.1.1-rc.2/0.1.2-rc.1，正则接受有限 0.1 系列；这不是对任意后续 DSH 版本的兼容承诺。server 实际 spawnAgentProcess 传 cwd/env/参数并保存 child，随后在 dsh-profile-jsonl 分支装上协议控制器，非仅注册一个模型名称。

控制器要求先 ready，再发送 execute（request_id、cwd、prompt、可选 model/effort/resume）；不匹配 request_id 的帧被忽略，输出前必须建立 session，resume 必须同 ID 且 resumed，终态 session 不能改变。stdout 结束无终态会失败。companion 实际 create/resume Agent，按 session ID 和首个新 seq 过滤事件，followup 后等待 idle、flush session，再写 result；因此有持久会话接线，但底层工具权限、模型调用和副作用仍来自用户 Harness/profile。

重要反证是 resultStatus 将 max-tokens 与 completed 一并映射 completed，同时保留 stop_reason；控制器按 status 完成，不把截断自动转成设计失败。因此完成只表示该协议运行结束，不能当内容合格。取消从 run.cancel 调 adapter.abort，协议发 cancel；外层在宽限后 terminateProcessTree，companion 使用取消信号结束。这些动作不是文件或远端工具事务回滚，须查取消前已发生的修改。无子进程时也会直接结束运行，取消还清掉同运行重试定时器，避免事后复活。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:32-41](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L32-L41)

profile 存在性和 DSH_HOME 路径。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:62-103](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L62-L103)

有限版本政策、preflight、probe/models 与 stdio 参数。

<details>
<summary>查看原文（42行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/server.ts:15404-15422](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/server.ts#L15404-L15422)

实际进程调用和 run.child 记录。

<details>
<summary>查看原文（19行）</summary>

```text
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
      // Schedule release of the antigravity model lock once agy's
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/server.ts:16761-16780](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/server.ts#L16761-L16780)

真实分支把运行参数接入控制器。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:109-153](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L109-L153)

execute 与 request/session/resume 约束。

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

**依据 6 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:202-228](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L202-L228)

终态会话匹配、失败及未请求取消处理。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:233-251](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L233-L251)

首帧必须 ready，随后真实发 execute。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:264-280](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L264-L280)

无结果失败、取消指令和 completed 判断。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 9 · 源码核查**：[packages/dsh-runtime/src/index.ts:278-297](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/packages/dsh-runtime/src/index.ts#L278-L297)

事件身份/seq 过滤及真实 Agent create/resume。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 10 · 源码核查**：[packages/dsh-runtime/src/index.ts:319-356](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/packages/dsh-runtime/src/index.ts#L319-L356)

followup、idle、持久 flush 与 result.stop_reason。

<details>
<summary>查看原文（38行）</summary>

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
```

</details>

**依据 11 · 源码核查**：[packages/dsh-runtime/src/index.ts:82-105](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/packages/dsh-runtime/src/index.ts#L82-L105)

max-tokens 被当作 completed，而不是业务验收。

<details>
<summary>查看原文（24行）</summary>

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
  return {
    code: 'DSH_PROFILE_TURN_FAILED',
    message: `DeepSeek Harness ended the turn with reason "${reason.kind}".`,
```

</details>

**依据 12 · 源码核查**：[apps/daemon/src/runtimes/runs.ts:2497-2538](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/runtimes/runs.ts#L2497-L2538)

取消状态、清重试、adapter abort 和进程树终止。

<details>
<summary>查看原文（42行）</summary>

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
    }

    closeRunStdin(run);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 制品创建如何落盘和预览，哪些门不能代替交付验收？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

创建制品入口不是把聊天结果直接画成页面：项目文件 POST 先调用工作区 writeFiles 变更门，artifact=true 分支进入 createProjectArtifactFile，再传 overwrite:false 给 writeProjectFile。该函数规范化路径并解析现有前缀的 realpath，拒绝逃出项目目录的符号链接路径；这是这条文件 API 的边界，不是编码 Agent 全部 shell/文件工具的沙箱。

有有效 manifest 的 HTML/deck 在写入前经过占位内容发布门；带 identifier 的指定类型还跑 stub 回退检查，按配置 warn 或 reject。不能据此断言任意小文件、无 manifest 的普通上传或设计内容都被质量门覆盖。overwrite:false 是先 stat 再 writeFile 的存在性检查，未见该处用独占写标志或同一事务包住两个文件，因此不能把它解释为并发原子创建。

文件 body 先写，随后 manifest 才写；第二次写入失败仍可能留下 body，需人工核实和清理，报错不等于没有副作用。server 成功物理运行分支还调用 deliverable 校验与语法 finalizer，后者可通过配置关闭，无法证明视觉、交互或 brief 一致。检查到的 DesignFilesPanel 缩略图 iframe 使用 allow-scripts allow-downloads、没有 allow-same-origin；这个展示隔离不限制已经运行的 Agent 进程权限。相比裸 HTML 文件，manifest、有限发布门与同项目预览提供可检查的交付位置，但人仍须打开成品核对。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/routes/project/index.ts:7788-7823](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/routes/project/index.ts#L7788-L7823)

上传文件入口调用 writeFiles 变更门；并非无条件接收 body。

<details>
<summary>查看原文（36行）</summary>

```text
  // Two ways to upload: multipart for binary files (images), and JSON
  // {name, content, encoding} for sketches and pasted text. The frontend
  // uses both depending on the file source.
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
          if (req.file?.path) fs.promises.unlink(req.file.path).catch(() => {});
        };
        if (!uploadProject && workspaceProjectContextFromRequest(req) !== null) {
          cleanupRejectedUpload();
          return sendApiError(res, 404, 'PROJECT_NOT_FOUND', 'project not found');
        }
        if (!await enforceWorkspaceProjectMutation(
          req,
          res,
          sendApiError,
          getWorkspaceProject,
          getWorkspaceProjectByProjectId,
          db,
          projectId,
          'writeFiles',
        )) {
          cleanupRejectedUpload();
          return;
        }
        await ensureProject(PROJECTS_DIR, projectId, uploadProject?.metadata);
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/routes/project/index.ts:7949-7970](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/routes/project/index.ts#L7949-L7970)

artifact=true 实际调用 create，普通写入另有 overwrite 参数。

<details>
<summary>查看原文（22行）</summary>

```text
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
          const versionCapture = uploadProject && requestedSource && /\.html?$/i.test(meta.name) && versionLock
            ? await (async () => {
              const savedFile = await readProjectFile(PROJECTS_DIR, uploadProject.id, meta.name, uploadProject.metadata);
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/artifacts/create.ts:55-85](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/artifacts/create.ts#L55-L85)

manifest 校验/推断和创建写入 overwrite:false。

<details>
<summary>查看原文（31行）</summary>

```text
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
}
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/projects.ts:864-900](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/projects.ts#L864-L900)

存在性检查后创建目录及有效 manifest 发布门。

<details>
<summary>查看原文（37行）</summary>

```text
export async function writeProjectFile(
  projectsRoot,
  projectId,
  name,
  body,
  { overwrite = true, artifactManifest = null } = {},
  metadata?,
) {
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
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/projects.ts:901-948](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/projects.ts#L901-L948)

stub 条件分支、body 与 manifest 两次独立写入。

<details>
<summary>查看原文（48行）</summary>

```text
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
  }
```

</details>

**依据 6 · 源码核查**：[apps/daemon/src/projects.ts:1488-1511](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/projects.ts#L1488-L1511)

现有路径/最长现有前缀 realpath 并拒绝项目外路径。

<details>
<summary>查看原文（24行）</summary>

```text
  const rootReal = await realpath(dir).catch(() => dir);
  let real;
  try {
    real = await realpath(candidate);
  } catch (err) {
    if (!err || err.code !== 'ENOENT') throw err;
    // Write case: path doesn't exist yet. Realpath the longest existing
    // prefix and re-append the missing tail.
    real = await resolveExistingPrefix(candidate);
  }
  if (!real.startsWith(rootReal + path.sep) && real !== rootReal) {
    const e = new Error('path escapes project dir via symlink');
    e.code = 'EPATHESCAPE';
    throw e;
  }
  return real;
}

async function resolveExistingPrefix(p) {
  const parts = p.split(path.sep);
  for (let i = parts.length; i > 0; i--) {
    const prefix = parts.slice(0, i).join(path.sep) || path.sep;
    try {
      const real = await realpath(prefix);
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/server.ts:17618-17648](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/server.ts#L17618-L17648)

成功物理运行接实际 finalizer，而不只 helper 定义。

<details>
<summary>查看原文（31行）</summary>

```text
        let deliverableValid = false;
        const strategyPlanningOnly = strategyTaskAtStart?.executionIntent === 'plan_only';
        const strategyCompletionCandidate = Boolean(strategyTaskAtStart && !strategyPlanningOnly);
        let processTreeQuiescentForFinalization = true;
        // Every successful physical Run can produce a final Web deliverable,
        // even when OD Next Runtime State is absent. Resolve the settled
        // filesystem before deciding whether the host syntax gate applies.
        if (acpAttemptTermination) {
          const termination = await acpAttemptTermination;
          processTreeQuiescentForFinalization = termination?.quiescent === true;
        }
        await resolveRunArtifactOutcomeBeforeFinishAsync();
        const deliverableFinalization = await finalizeSuccessfulRunDeliverable({
          allowIndependentOutput: Boolean(strategyTaskAtStart),
          allowMultipleOutputCandidates: run.strategyRolloutDecision?.taskType === 'discovery',
          ...(run.artifactOutcome?.diff && baselineEntryFile ? { baselineEntryFile } : {}),
          projectsRoot: PROJECTS_DIR,
          projectId: run.projectId ?? null,
          projectMetadata: projectRecord?.metadata,
          artifactCount: Number.isFinite(run.artifactCount) ? run.artifactCount : 0,
          ...(Array.isArray(run.artifactPaths) ? { touchedPaths: run.artifactPaths } : {}),
          relatedPaths:
            run.artifactOutcome?.diff?.renderDependencyTouchedPaths ?? [],
          processTreeQuiescent: processTreeQuiescentForFinalization,
          syntaxFinalizerEnabled: deliverableSyntaxFinalizerEnabled(),
          ...(run.deliverableSyntaxRepair
            ? { repairState: run.deliverableSyntaxRepair }
            : {}),
          ...(run.deliverableSyntaxValidation?.metrics
            ? { previousMetrics: run.deliverableSyntaxValidation.metrics }
            : {}),
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/artifacts/successful-run-deliverable-finalization.ts:23-27](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/artifacts/successful-run-deliverable-finalization.ts#L23-L27)

语法 finalizer 默认开启，但环境值可以关闭。

```text
export function deliverableSyntaxFinalizerEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const value = env.OD_DELIVERABLE_SYNTAX_FINALIZER?.trim().toLowerCase();
  return value !== '0' && value !== 'false' && value !== 'no' && value !== 'off';
```

**依据 9 · 源码核查**：[apps/web/src/components/DesignFilesPanel.tsx:2214-2224](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/web/src/components/DesignFilesPanel.tsx#L2214-L2224)

仅此次检查的缩略预览 iframe 隔离参数。

<details>
<summary>查看原文（11行）</summary>

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
          style={{
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 评论本地提交、身份绑定、重试与远端回执是否闭合？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

评论 POST 先查 conversation、工作区变更权限与请求上下文，清除客户端 author 字段，再用服务器 resolveCaller 标记作者；编辑已有评论还检查其原作者，不把请求体身份直接当授权。代表创建路径在同一 SQLite transaction 中 upsert 本地评论、更新项目并调用 onCommentCreated，要求 relay 成功入队。server 的 callback 真实转到 collabCloud.enqueueComment，服务使用同库 durable outbox，因此网络外发不在本地事务内，断网不应阻塞为同一远端事务。

队列携带 workspace/member/team/scope、项目和 revision；实际 drain 在发前检查当前行、文件是否退休、项目 binding 和 publication witness，构造稳定 eventKey 作为幂等键。ACK 按原 revision 删除行，所以外发期间发生的新编辑不会被旧 ACK 一并删掉。异常走 defer；413 把自动重试时间置远未来，需要编辑/删除或显式 Retry。这是身份和恢复机制的实际增量，不表示所有云端权限已经审计。

仍有一个明确的协议接收缺口：单条 Vela client 的 runJson 在命令成功但 stdout 为空时返回 {}，pushComment 对缺失或非 number 的 seq 返回 0；service await pushComment 返回后不另校验正序号或读回，就按 delivered 确认当前 revision 并调用 onCommentPushed。故只有在命令成功却返回空/弱回执的条件下，这条链也可能消费队列；不能以有严格批量 receipt helper 推定此单条调用已使用它。这里的 delivered 是客户端状态，不等于用户已接收、看过或意见已落实。正常命令失败/无身份/过期 publication 有自己的拒绝与延迟分支，不能概括成所有外发都无门禁。未启动 Vela 或云服务，未复现评论丢失，也未验证远端真实契约是否总保证有效 seq。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:588-630](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/routes/project/comments.ts#L588-L630)

评论入口先工作区解析、清作者字段并服务器解析作者。

<details>
<summary>查看原文（43行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:632-686](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/routes/project/comments.ts#L632-L686)

编辑作者检查、来源绑定以及本地评论+relay 事务。

<details>
<summary>查看原文（55行）</summary>

```text
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
        const authorDisplayName = ctx.resolveCurrentAuthorDisplayName?.();
        if (authorDisplayName?.trim()) body.authorDisplayName = authorDisplayName.trim();
      }
      if (existing?.sourceFileId) body.sourceFileId = existing.sourceFileId;
      else if (!requestedId && ctx.prepareCommentFile) {
        const sourceFileId = await ctx.prepareCommentFile(req.params.id, body.target?.filePath ?? '', workspaceContext);
        if (sourceFileId) body.sourceFileId = sourceFileId;
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
        return saved;
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/server.ts:9591-9598](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/server.ts#L9591-L9598)

onCommentCreated 实际调用 collabCloud.enqueueComment 并返回结果。

```text
          onCommentCreated: (comment, context) => {
            if (!context) return;
            const enqueued = collabCloud.enqueueComment(comment, context);
            if (!enqueued) {
              console.warn('[od] refused to enqueue comment without exact Team authority');
            }
            return enqueued;
          },
```

**依据 4 · 源码核查**：[apps/daemon/src/server.ts:4617-4623](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/server.ts#L4617-L4623)

服务实际使用同库 outbox store。

```text
  const collabCloud = collabCloudClient
    ? createCollabCloudService({
        client: collabCloudClient,
        commentOutbox: createCommentRelayOutboxStore(db),
        // C3-LITE member comment pages (BO1), served by the AMR API through the
        // Vela CLI. The HTTP relay (OD_COLLAB_CLOUD_URL) has no paged route, so
        // it keeps the legacy pull. An unusable cursor is rebuilt from a fresh
```

**依据 5 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:701-715](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/collab-cloud-service.ts#L701-L715)

异常 defer；413 暂停自动重试。

<details>
<summary>查看原文（15行）</summary>

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

**依据 6 · 源码核查**：[apps/daemon/src/collab/collab-cloud-service.ts:760-820](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/collab-cloud-service.ts#L760-L820)

发前 current/binding/publication 门、单条 push 与 delivered ACK。

<details>
<summary>查看原文（61行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[apps/daemon/src/collab/comment-relay-outbox.ts:494-510](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/comment-relay-outbox.ts#L494-L510)

ACK 带旧 revision 条件，不删除并发产生的新版本。

<details>
<summary>查看原文（17行）</summary>

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
					if (
						outcome === "delivered" &&
						record.relayScope === "personal" &&
```

</details>

**依据 8 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:102-125](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/vela-cli-collab-client.ts#L102-L125)

空 stdout 返回空对象；命令失败与坏 JSON 另行抛错。

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

**依据 9 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:198-228](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/vela-cli-collab-client.ts#L198-L228)

实际单条 comment push；seq 缺失/非数字退为0。

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

**依据 10 · 源码核查**：[apps/daemon/src/collab/comment-relay-outbox.ts:361-369](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/comment-relay-outbox.ts#L361-L369)

实际 DELETE SQL 同时绑定工作区、成员、项目、评论与 revision；旧 ACK 不能删除新修订。

````text
	const acknowledgeRow = db.prepare(`
    DELETE FROM comment_relay_outbox
     WHERE workspace_id = ?
       AND workspace_member_id = ?
       AND project_id = ?
       AND comment_id = ?
       AND revision = ?
  `);
	const deferRow = db.prepare(`
````

**依据 11 · 源码核查**：[apps/daemon/src/routes/project/comments.ts:441-445](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/routes/project/comments.ts#L441-L445)

入队 callback 显式返回 false 时抛错，让所在 SQLite transaction 回滚。

````text
  function requireRelayEnqueued(result: boolean | void): void {
    if (result === false) {
      throw new Error('failed to persist Team comment relay delivery');
    }
  }
````

#### 缺口

- 远端 Vela 成功回执保证、用户可见读回、撤销后的在途请求与全部云后端未运行。
  **影响**：不能断言实际丢评论或完整撤销；也不能据本地 delivered 承诺协作可靠性。
  **进一步探讨**：用伪传输提供空 stdout/缺 seq/延迟 ACK 和并发 edit，核队列及读回；真实服务实验需单独授权。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么试用范围值得承担依赖、权限与恢复负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根声明 Node ~24、pnpm >=10.33.2 <11，提供安装后脚本；内部 DSH runtime 依赖 cmdline 0.1.1-rc.2，并声明 Cordis、DSH Agent/model/session peer。仅根包依赖可解析不表示 DSH profile、模型凭据、设计资产和输出目录都已准备。应核真实 CLI、profile、companion 与 probe，而不是按 README 的支持名称跳过版本限制。

建议已有 Agent 经验者在单独数据目录、非敏感项目副本、仅 loopback 且不启云发布/同步的条件下试一项 HTML brief。首次需搭建/构建客户端、配 CLI/profile/模型并备份项目；持续需模型推理、Agent 运行和人工视觉复核，现金用量与人工分钟均未知。源码显示非 loopback 无 token 且未显式禁 auth 会拒绝启动，loopback 不要求 token；这不能替代多租户或全部 API 安全审计，也不应暴露给公网。

失败恢复负担包括：截断仍显示 completed 时人工查内容；取消后核工具副作用；body/manifest 不一致时清理副本；评论 weak receipt 时不能以队列已消费判送达。退出须停止运行及检查仍存活进程，保存/还原项目副本，必要时撤销模型凭据及远端分享；本轮没有卸载/残留验收。它能让本地 Agent 运行和制品位置更容易对照，足以安排有边界试用，但尚不足以生产写入、团队同步保证或持续安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/package.json#L1-L14)

客户端安装脚本和根版本。

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

**依据 2 · 源码核查**：[package.json:42-46](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/package.json#L42-L46)

具体 Node 与 pnpm 引擎版本。

```text
  "engines": {
    "node": "~24",
    "pnpm": ">=10.33.2 <11"
  },
  "pnpm": {
```

**依据 3 · 源码核查**：[packages/dsh-runtime/package.json:45-59](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/packages/dsh-runtime/package.json#L45-L59)

cmdline 固定依赖与真实 peer 范围。

<details>
<summary>查看原文（15行）</summary>

```text
    "@deepseek-ai/dsh-cmdline": "0.1.1-rc.2",
    "commander": "15.0.0"
  },
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
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/server.ts:3250-3259](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/server.ts#L3250-L3259)

非 loopback/token 启动约束与可信反代例外。

<details>
<summary>查看原文（10行）</summary>

```text
  const isApiTokenAuthorization = (authorization: string | undefined): boolean =>
    apiTokenAuthEnabled && apiTokenAuthorizationMatches(authorization, apiToken);
  if (!isLoopbackHostname(host) && apiToken.length === 0 && !apiAuthDisabled) {
    throw new Error(
      `OD_BIND_HOST=${host} requires OD_API_TOKEN to be set. ` +
      `Generate one with \`openssl rand -hex 32\` and re-launch. ` +
      `(Loopback hosts 127.0.0.1 / ::1 / localhost do not need a token.) ` +
      `Set OD_DISABLE_API_AUTH=1 only when a trusted reverse proxy already authenticates every request.`,
    );
  }
```

</details>

**依据 5 · 源码核查**：[apps/daemon/src/runtimes/runs.ts:2497-2538](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/runtimes/runs.ts#L2497-L2538)

退出/取消承担进程处理，不回滚文件。

<details>
<summary>查看原文（42行）</summary>

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
    }

    closeRunStdin(run);
```

</details>

#### 缺口

- 没有首次搭建耗时、每任务推理费、维护/恢复工时或卸载实测。
  **影响**：不能给总成本、ROI 或无残留承诺，试用须人工设预算和停机条件。
  **进一步探讨**：记录隔离样本的推理用量、配置/修复分钟及退出后目录/进程差异。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 值得验证的下一步是增加设计功能，还是补齐交付证据？

**研究主题**：新假设与验证

#### 完整回答

本轮形成的候选方向是把“Agent 结束、本地落盘、远端收到、人工验收”拆成可追溯的不同事实，而不是再增加一个生成入口。这是研究推导，未作为本项目现有贡献计分：Q02 的 max-tokens completed、Q03 的两阶段文件写和有限内容门、Q04 的弱单条回执，分别使运行记录不能直接当业务交付。

最小验证可限定一份 HTML：保存运行/request/session、文件内容摘要与 manifest、评论 revision/eventKey/严格远端收据和读回记录，再由复核者确认同一版本是否满足 brief。对照组是当前客户端加人工读回/文件核对，先比较同名并发、截断、manifest 写失败、空/缺 seq、延迟旧 ACK、新编辑和取消后的副作用，而非先追求生成速度。

如果这些故障下状态仍能明确停在未交付、恢复不丢更新，并且减少复核者重建上下文/错误验收，才继续验证跨人交接价值。若原有手工清单已同样稳定且成本更低，或严格收据仍无法对应用户看到的版本、修复负担反而更大，就推翻增量假设。没有真实业务样本和实验授权，当前不主张该方向已改善效率或形成经济模式。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-runtime/src/index.ts:82-105](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/packages/dsh-runtime/src/index.ts#L82-L105)

截断与成功终态合并是拆分证据的技术依据。

<details>
<summary>查看原文（24行）</summary>

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
  return {
    code: 'DSH_PROFILE_TURN_FAILED',
    message: `DeepSeek Harness ended the turn with reason "${reason.kind}".`,
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/projects.ts:942-948](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/projects.ts#L942-L948)

文件与 manifest 先后写入是版本一致性实验依据。

```text
  await writeFile(target, body);
  await projectFileWriteTestHooks.afterCommit?.({ safeName, target, body });
  if (validatedManifest) {
    const manifestFileName = artifactManifestNameFor(safeName);
    const manifestTarget = await resolveSafeReal(dir, manifestFileName);
    await writeFile(manifestTarget, JSON.stringify(validatedManifest, null, 2));
  }
```

**依据 3 · 源码核查**：[apps/daemon/src/collab/vela-cli-collab-client.ts:219-228](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/vela-cli-collab-client.ts#L219-L228)

弱回执规范化是严格收据实验依据。

<details>
<summary>查看原文（10行）</summary>

```text
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

**依据 4 · 源码核查**：[apps/daemon/src/collab/comment-relay-outbox.ts:494-510](https://github.com/nexu-io/open-design/blob/5efd0b263621e5b0039fce95399ab9de04da3461/apps/daemon/src/collab/comment-relay-outbox.ts#L494-L510)

现有条件 ACK 是比较基线，不能把候选机制说成全新队列。

<details>
<summary>查看原文（17行）</summary>

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
					if (
						outcome === "delivered" &&
						record.relayScope === "personal" &&
```

</details>

#### 缺口

- 候选收据/验收关联机制没有实现和对照实验。
  **影响**：只能作为可证伪的后续生产方向，不能进入既有能力或收益评分。
  **进一步探讨**：先做隔离故障矩阵，再决定是否值得实现跨版本验收证据。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
