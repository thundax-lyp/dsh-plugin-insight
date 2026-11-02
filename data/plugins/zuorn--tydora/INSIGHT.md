# Tydora

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4af1de4](https://github.com/zuorn/Tydora/tree/4af1de4d458c7d03adc2615893e4793766c1bb87)

<!-- BEGIN META -->
[![GitHub ★ 227](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=227&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zuorn/Tydora)
<!-- END META -->

> **功能**：本地 Markdown 编辑与知识库应用，组合所见即所得编辑、双链图谱、画布、思维导图和静态站点构建。

> **亮点**：[Q01](#research-q01) 将Markdown编辑、关系视图和CLI/MCP文件入口组合到本地库；[Q02](#research-q02)提供可限只读的命令接口及GUI外部更新监听。主要增量是工作流整合，不把上游编辑器能力算原创，也不把DSH骨架当已注册工具。

> **主要限制**：[Q02](#research-q02) dirty GUI缓冲忽略外部更新，随后直接写盘无expected版本，CLI原子rename不解决多writer覆盖。[Q03](#research-q03)简化YAML、独立GUI/CLI逻辑与发布范围未知也限制迁移，不能因本地文件和badge承诺无损协作。

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
  - [Q01 · Tydora的真实类型和写作增量是什么，DSH标章代表什么？](#detail-section-11)
  - [Q02 · GUI与CLI写同文件是否有完整冲突保护，保存失败怎么表达？](#detail-section-12)
  - [Q03 · 本地权限、发布和全周期代价允许哪种采用？](#detail-section-13)
  - [Q04 · 多视图与Agent协作能证明到哪里，新冲突假设如何证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地Markdown写作者希望在一个桌面中编辑、组织和导出笔记；基线是文本编辑器或Typora/Obsidian及发布工具。合格交付是可读正文/元数据/链接与正确导出，试用限定复制小库单writer。

成熟编辑器、图谱和静态站点构建组合；TipTap/CodeMirror等上游提供基础能力，独立CLI/MCP不归空DSH apply。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地编辑与组织 | Markdown正文/关系视图 | 完整格式往返未验，先复制库 |
| CLI/MCP笔记操作 | Agent读写同一Vault | 先只读；非DSHapply，非OS隔离 |
| 外部更新监听 | clean缓冲同步磁盘 | dirty跳过，无完整并发版本保护 |
| 静态站点构建 | 公开样例导出 | 构建非部署，范围/隐私另核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可信Tauri桌面安装包 | GUI需 | 本地写作和视图 | 平台／签名本轮未验 |
| Markdown库与外部备份 | 采用需 | 数据和回退 | 不迁唯一原库 |
| RustCLI与MCP宿主 | Agent接入可选 | 读写同一库 | DSH空apply不提供该工具 |
| Node与markdown-publish | 站点构建需 | 静态导出 | 构建不等网络部署 |
| Node/Rust/Tauri工具链 | 源码构建需 | 开发运行 | 本轮未安装或构建 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 写作者复制代表性小库与媒体 | 留原编辑器和备份 |
| 编辑 | 单writer保存正文/元数据/链接 | 与原文diff，核视图不改错内容 |
| Agent | 首选MCP read-only | 不把vault绑定当OS隔离 |
| 导出 | 仅公开样例本地构建并逐文件核范围 | publish成功不等隐私排除或部署 |
| 退出 | 保存Markdown/附件与必要配置，关写入入口 | 原编辑器复核，独特canvas另迁 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 桌面资源／可选构建工具 | 备份、迁移和格式diff | 工时／金额未知 |
| 持续 | 索引、附件与备份空间；可选模型／托管 | 核链接、更新和发布范围 | 未测比原编辑器总收益 |
| 失败恢复 | 外部备份版本 | 找回覆盖前文件、重建索引 | 原子写非并发保护 |
| 退出 | 需保留Markdown/媒体 | 原工具核读与canvas迁移 | 不保证全部扩展兼容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多视图写作 | 成熟库与本地文件组合 | 顺滑／理解提升与完整格式保真 |
| 外部更新 | clean缓冲自动重读 | dirty并发丢更新保护 |
| Agent接入 | 独立CLI/MCP白名单及只读模式 | DSHapply当前无能力 |
| 静态发布 | 调构建器与错误传播 | 私密排除／远程部署安全 |

> **思考**：[Q02](#research-q02) dirty GUI缓冲忽略外部更新，随后直接写盘无expected版本，CLI原子rename不解决多writer覆盖。[Q03](#research-q03)简化YAML、独立GUI/CLI逻辑与发布范围未知也限制迁移，不能因本地文件和badge承诺无损协作。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将Markdown编辑、关系视图和CLI/MCP文件入口组合到本地库；[Q02](#research-q02)提供可限只读的命令接口及GUI外部更新监听。主要增量是工作流整合，不把上游编辑器能力算原创，也不把DSH骨架当已注册工具。

[Q02](#research-q02) CLI原子写、唯一替换和MCP白名单有明确边界；GUI保存独立直接写盘，watcher跳dirty不是冲突解决，core词法路径不是symlink containment。本轮不外推成全部平台安全。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) dirty GUI缓冲忽略外部更新，随后直接写盘无expected版本，CLI原子rename不解决多writer覆盖。[Q03](#research-q03)简化YAML、独立GUI/CLI逻辑与发布范围未知也限制迁移，不能因本地文件和badge承诺无损协作。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 复制小库单writer试用并核格式diff；Agent先只读，公开导出只用已核样例。遇正文／链接／并发保留问题回备份和原工具，不直接迁整库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地写作组合与CLI/MCP命令路径；外部dirty缓冲保存存在未做版本比较的设计缺口。无运行保真／迁移验收，三版本冲突保护是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、app/tydora-cli/README.md、app/tydora-cli/src/mcp.rs、app/tydora-cli/src/store.rs、app/tydora-core/README.md、app/tydora-core/src/note.rs、app/tydora-web/src/App.tsx、app/tydora-web/src/publish/PublishService.ts、app/tydora-web/src/services/useVaultWatcher.ts、cordis.patch.yml、dsh/index.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根client source定向核DSH patch/空apply、core/CLI文档与Rust写路径/MCP、GUI watcher/save和publish前端。未全审富文本序列化、所有图谱／画布／导出、Tauri权限、vendor发布器和远端部署；无目标执行。
- 下一步：[Q04](#research-q04)用复制代表库核往返diff与三种并发反例，逐文件核发布输出；本轮未启动应用／CLI／MCP或部署。

**分析版本**

- **仓库**：[zuorn/Tydora](https://github.com/zuorn/Tydora)
- **版本号**：0.3.2（[固定提交 4af1de4](https://github.com/zuorn/Tydora/tree/4af1de4d458c7d03adc2615893e4793766c1bb87)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)从dirty watcher与无版本save推导三版本冲突提示和保存前digest校验，可能降低GUI/Agent丢更新。复制文件三组反例计丢更新、误阻断、格式diff及恢复时间；无改善或总投入更高就否定，尚未实现不计贡献。

[Q04](#research-q04)用复制代表库核往返diff与三种并发反例，逐文件核发布输出；本轮未启动应用／CLI／MCP或部署。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 128 | 18454 | — | — | 142177 |
| .ts | source | 113 | 18240 | 14032 | 2541 | — |
| .tsx | source | 78 | 34452 | 29877 | 2248 | — |
| .ts | test | 6 | 670 | 486 | 110 | — |
| .js | source | 2 | 30 | 25 | 2 | — |
| .mjs | source | 9 | 687 | 492 | 125 | — |

</details>

**活跃度**

[![Issue 未关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/zuorn/Tydora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/zuorn/Tydora/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zuorn/Tydora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根桌面应用、空DSH入口及CLI/MCP文件协作范围，限定写作迁移与并发采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Tydora的真实类型和写作增量是什么，DSH标章代表什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根Tydora是Tauri桌面Markdown编辑／知识库client，面向在本地写作、组织双链和画布并导出分享的用户。基线可分别用Typora写作、Obsidian组织和通用静态站点工具发布，或直接用文本编辑器管理Markdown。合格结果应是正文／链接／元数据保存可读、组织视图反映内容、导出内容正确；作者“绝对顺滑”等体验语言不是性能或用户收益证据。TipTap、CodeMirror、D3、markmap和React Flow提供成熟编辑／可视化能力，本根增量是把多视图和本地文件工作流组合。

根package有dsh.bundle.patch，cordis补丁插入dsh/index.ts，但该apply只有空骨架，明确不注册任何能力。故目录DSH安装／安全badge不意味着Agent已经能操纵GUI或知识库。独立Rust CLI/MCP实际提供另一条笔记入口，能分析共享文件语义但不能算这个空DSH apply的工具。core README也明确纯逻辑crate来自CLI抽离，桌面未来接线，不能宣称所有GUI/CLI共用同一业务实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-53](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/README.md#L15-L53)

作者本地编辑、图谱、导图和静态网站定位。

<details>
<summary>查看原文（39行）</summary>

```text

I spent a long time settling into focused writing in **Typora**, organizing my thoughts before the graphs of **Obsidian**. Yet somewhere deep down, I always felt something was missing —
a touch of <mark>absolute smoothness</mark> when your fingertips meet your thoughts, and the <mark>freedom</mark> to let knowledge unfold directly onto a canvas.

So I decided to build one myself. Its name is **Tydora**.

It's a **Markdown editor** I crafted alone through countless quiet nights — confident enough to stand in for **Typora**, ambitious enough to challenge **Obsidian**. It's more than a tool; it's a <mark>desk for fellow travelers</mark> — **clean and quiet, yet holding a world within**.

---

## **✒️ Writing Should Flow Like Breathing**

The <mark>ultimate writing experience</mark>: WYSIWYG, with an interface so <mark>clean</mark> that only the words remain. Not a single unnecessary **distraction**; wherever the cursor lands, your **thoughts** land directly on the screen. I poured every ounce of my obsession with "<mark>the feel of writing</mark>" into it, letting the tool fully **recede** — leaving only you and the <mark>river of thought</mark>.

![image.png](website/assets/image-20260815-171029.png)

---

## **🪐 Knowledge Is Not an Island — It's a Constellation**

**Relationship graphs** form between notes — the <mark>gravitational lines of thought</mark>. And the **infinite whiteboard canvas** lets you personally guide these <mark>stars</mark>, <mark>connecting them freely</mark>, <mark>restructuring logic</mark>. Going beyond the graph — here, <mark>your cognition knows no bounds</mark>.

![image.png](website/assets/image-20260815-171200.png)

---

## **🌳 From Line to Tree, See the Forest in One Step**

Turn any document into a **mind map** with one click. Linear text instantly unfolds into a **structure** of clear branches — hierarchy and connections at a glance. Outlining, dissecting books, reviewing ideas — no need to switch tools, the <mark>flow</mark> never breaks. What you see is <mark>the very shape of thought</mark>.

![image.png](website/assets/image-20260815-171446.png)

---

## **🌸 Let Your Knowledge Garden Bloom Quietly on the Web**

**Publish your local knowledge repository as a static website with one click.** Blogs, documentation, personal wikis. Sharing knowledge has finally become <mark>clean and dignified</mark>.

![image.png](website/assets/image-20260815-172124.png)
```

</details>

**依据 2 · 作者声明**：[README.md:81-89](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/README.md#L81-L89)

成熟编辑与可视化依赖。

```text
## Tech Stack


| Layer         | Technology                                                  |
| --------------- | ------------------------------------------------------------- |
| Frontend      | React 19 + TypeScript + Vite 6                              |
| Editor        | TipTap 3.x (WYSIWYG) + CodeMirror 6 (Source)                |
| Backend       | Rust (Tauri v2)                                             |
| Visualization | D3.js (Graph) + markmap (Mind Map) + React Flow (Canvas)    |
```

**依据 3 · 源码核查**：[package.json:1-10](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/package.json#L1-L10)

根0.3.2私有应用与bundle patch。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "tydora",
  "private": true,
  "version": "0.3.2",
  "type": "module",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/cordis.patch.yml#L1-L6)

bundle仅指向DSH入口。

```text
# Tydora 的 DSH 组合包补丁层。
# 被 package.json 的 dsh.bundle.patch 引用；用户执行 `dsh plugin add` 时应用此层。
# name 指向仓库内的插件入口（相对本文件）。
- insert:
    - id: tydora
      name: './dsh/index.ts'
```

**依据 5 · 源码核查**：[dsh/index.ts:1-18](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/dsh/index.ts#L1-L18)

DSH apply空骨架，无任何能力注册。

<details>
<summary>查看原文（18行）</summary>

```text
// Tydora 的 DSH 插件骨架（最小可加载版本）。
//
// 说明：
// - 本文件在 dsh/ 目录下，已被 Tydora 的 tsconfig（include 仅含 src）排除，
//   因此不会影响 Tydora 自身的 tsc / vite / tauri 构建。
// - `import type` 在编译时被擦除，运行时无 cordis 依赖；cordis 由 dsh 宿主提供。
//
// 想让 Tydora 真正给 DSH 智能体贡献能力时，在这里通过 ctx 注册工具 / 命令 / 服务。
// 参考：src/content/lessons/dev/02-write-tool/zh.mdx
import type { Context } from 'cordis'

export const name = 'tydora'

export function apply(ctx: Context) {
  // 最小骨架：加载即生效，目前不注册任何能力。
  // 示例（取消注释并补充实现即可启用）：
  // ctx.logger?.info('[tydora] plugin loaded')
}
```

</details>

**依据 6 · 作者声明**：[app/tydora-core/README.md:1-17](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-core/README.md#L1-L17)

core明确当前CLI共享而非桌面全接线。

<details>
<summary>查看原文（17行）</summary>

```text
# tydora-core

Pure-logic crate shared by `tydora-cli` (and — when wired — future `tydora-desktop`).

> **Scope (2026-09-07)**: 业务逻辑去重的种子层。当前包含 vault 扫描
> （与 `app/tydora-web/src/services/vault-file-scanner.ts` 对齐）、frontmatter 解析
> （与 `app/tydora-web/src/Editor/frontmatter.ts` 对齐）、note id/title/slug 解析。

## Why this crate exists

Tydora 是一个 Tauri v2 桌面 + 前端应用。在 tydora-core 之前，
"vault 扫描 / frontmatter 解析"逻辑实际散落在三处：

1. 前端 TypeScript：`src/services/vault-file-scanner.ts` + `src/Editor/frontmatter.ts`
2. CLI Rust（Phase 1）：`app/tydora-cli/src/store.rs` 的简化版重写（split_frontmatter / parse_simple_yaml / slugify_filename 等）
3. （并未存在）src-tauri 的 Rust：调研后确认 src-tauri 几乎没有可下沉纯业务

```

</details>

#### 缺口

- 写作顺滑、知识组织收益与同类编辑器迁移效果未实测。
  **影响**：不能据功能组合推荐替换全部原笔记库。
  **进一步探讨**：先复制少量含真实格式的笔记，比较往返保存、链接和编辑任务成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · GUI与CLI写同文件是否有完整冲突保护，保存失败怎么表达？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

GUI watcher监听vault://changed，300ms合并Markdown Modify路径后回调；App重读只刷新没有modified的缓冲，读失败等下一事件。跳过dirty缓冲保护当前输入，却没有在此链向用户展示外部版本冲突或合并。handleSave取当前content直接writeTextFile，成功便savedContent/modified=false，失败return false并console错误；未先比磁盘当前版本或预期hash。于是GUI有未保存编辑时CLI写入可被跳过，GUI随后保存仍可覆盖磁盘外部变化；不能继承CLI README“不会冲突”宣传。此为源码可见设计缺口，未运行复现，不把具体损失率当事实。

CLI edit解析vault和note id后读文件，old必须唯一，否则usage error；dry-run只给预览，实际写临时同目录文件再rename。write拒绝空body后整篇替换，同样无expected hash／mtime条件。原子rename避免半写，不解决读改写竞态或多writer最后覆盖；GUI保存则是独立的plugin-fs直接write路径，不能把CLI原子写保证泛化给GUI。

MCP tokenize／白名单禁shell元字符和--vault，read-only阻止写命令，publish默认不准；通过后构造Cli::parse并直接dispatch_to，stdin作为Buffer传正文，没有shell参与此解析。read-only是工具命令权限，不是系统目录隔离。core路径仅查相对组件、join与is_file，没有canonical containment；符号链接路径并未由该helper完整约束，故不能说绑定vault排除全部外部读取／写入。

#### 证据与依据

**依据 1 · 源码核查**：[app/tydora-web/src/services/useVaultWatcher.ts:82-97](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/services/useVaultWatcher.ts#L82-L97)

外部Markdown改动去抖回调。

<details>
<summary>查看原文（16行）</summary>

```text
      // 3) 编辑器内容刷新：内容被外部修改（如 AI agent 写入）时收集路径，
      //    300ms debounce 合并连续写入后批量回调。Metadata（atime/mtime）不算内容变化；
      //    即便混入噪声事件，消费方重读后内容一致也会自然跳过。
      if (kind.startsWith("Modify(") && !kind.includes("Metadata")) {
        for (const p of paths) {
          if (p.endsWith(".md") && !isNoisePath(p)) contentPathsRef.current.add(p);
        }
        if (contentPathsRef.current.size > 0) {
          clearTimeout(contentDebounceRef.current);
          contentDebounceRef.current = setTimeout(() => {
            const changed = Array.from(contentPathsRef.current);
            contentPathsRef.current.clear();
            onContentChangeRef.current?.(changed);
          }, 300);
        }
      }
```

</details>

**依据 2 · 源码核查**：[app/tydora-web/src/App.tsx:1515-1538](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/App.tsx#L1515-L1538)

modified缓冲跳过外部重读，失败不告冲突。

<details>
<summary>查看原文（24行）</summary>

```text
  // - 仅刷新「无未保存修改」的缓冲：缓冲处于编辑态（modified）时跳过，避免覆盖用户输入；
  //   用户保存（手动/自动）后的下一次外部写入会恢复刷新。
  // - 与磁盘内容一致的写回（本应用自己保存触发的 watcher 回声）会被忽略。
  const reloadExternallyChangedBuffers = useCallback(async (paths: string[]) => {
    const norm = (p: string) => p.replace(/\\/g, "/").toLowerCase();
    for (const changedPath of paths) {
    const buf = buffersRef.current.find((b) => b.fileName && norm(b.fileName) === norm(changedPath));
    if (!buf || !buf.fileName || buf.modified) continue;
    try {
      const text = await readTextFile(buf.fileName);
        const fresh = buffersRef.current.find((b) => b.id === buf.id);
        // 读取期间缓冲被切换/进入编辑态，或内容与磁盘一致，跳过
        if (!fresh || fresh.modified || text === fresh.savedContent || text === fresh.content) continue;
        updateBuffer(buf.id, { content: text, savedContent: text, modified: false });
        if (buf.id === activeBufferIdRef.current) {
          setSaveStatus("idle");
          syncMindmapContent(text);
        }
      } catch {
        // 文件可能正在被写入，等待下一次 watcher 事件
      }
    }
  }, [updateBuffer, syncMindmapContent]);
  externalContentChangeRef.current = (paths: string[]) => { void reloadExternallyChangedBuffers(paths); };
```

</details>

**依据 3 · 源码核查**：[app/tydora-web/src/App.tsx:1544-1581](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/App.tsx#L1544-L1581)

直接writeTextFile及saved/失败返回，无磁盘CAS。

<details>
<summary>查看原文（38行）</summary>

```text
  // 保存指定缓冲（默认激活缓冲）。有 fileName 直接写回；新建未保存文件走“另存为”。
  const handleSave = useCallback(async (targetBufferId?: string): Promise<boolean> => {
    const bufId = targetBufferId ?? activeBufferIdRef.current;
    let buf = buffersRef.current.find((b) => b.id === bufId);
    if (!buf) return false;
    try {
      let path = buf.fileName;
      if (!path) {
        // 仅激活缓冲可触发“另存为”
        if (bufId !== activeBufferIdRef.current) return false;
        const result = await save({
          filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
          defaultPath: "untitled.md",
        });
        if (!result) return false;
        path = result;
        updateBuffer(bufId, { fileName: path });
        buf = buffersRef.current.find((b) => b.id === bufId) ?? buf;
      }
      // 对话框期间内容可能变化，重新读取最新内容
      const latest = buffersRef.current.find((b) => b.id === bufId) ?? buf;
      const contentToWrite = latest.content;
      await writeTextFile(path, contentToWrite);
      updateBuffer(bufId, { savedContent: contentToWrite, modified: false });
      if (bufId === activeBufferIdRef.current) setSaveStatus("saved");
      // 更新链接索引和标签索引
      const activeVault = activeVaultIndex >= 0 ? vaults[activeVaultIndex] : null;
      if (activeVault) {
        await LinkIndexService.updateFileLinks(path, activeVault.path);
        forceIndexRerender((n) => n + 1);
        TagIndexService.updateFileTags(path, contentToWrite);
        try { localStorage.setItem("zmd-link-index", LinkIndexService.serialize()); } catch {}
      }
      return true;
    } catch (e) {
      console.error(t("app.error.saveFailed"), e);
      return false;
    }
```

</details>

**依据 4 · 源码核查**：[app/tydora-cli/src/store.rs:499-512](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/src/store.rs#L499-L512)

CLI临时同目录写+rename。

<details>
<summary>查看原文（14行）</summary>

```text
/// 原子写文本：写隐藏临时文件再 rename 覆盖。
///
/// 写失败时清理临时文件；rename 失败时目标文件保持原状。
fn atomic_write_text(path: &Path, content: &str) -> std::io::Result<()> {
    let tmp = tmp_sibling(path);
    std::fs::write(&tmp, content)?;
    match std::fs::rename(&tmp, path) {
        Ok(()) => Ok(()),
        Err(e) => {
            let _ = std::fs::remove_file(&tmp);
            Err(e)
        }
    }
}
```

</details>

**依据 5 · 源码核查**：[app/tydora-cli/src/store.rs:585-632](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/src/store.rs#L585-L632)

edit唯一匹配与dry-run路径。

<details>
<summary>查看原文（48行）</summary>

```text
) -> CliResult<Edited> {
    let vault = paths::resolve_vault(explicit)?;
    let path = note::resolve_note_path(id, &vault)?;

    // 参数校验
    let old = match old {
        Some(s) => s,
        None => return Err(CliError::Usage("edit: --old <TEXT> is required".into())),
    };
    let new = if let Some(s) = new_inline {
        if new_from_stdin {
            return Err(CliError::Usage(
                "edit: pass either --new or --new-stdin, not both".into(),
            ));
        }
        s.to_string()
    } else if new_from_stdin {
        read_body(body)?
    } else {
        return Err(CliError::Usage(
            "edit: pass either --new <TEXT> or --new-stdin".into(),
        ));
    };

    let content = std::fs::read_to_string(&path)?;

    // 唯一匹配
    let count = content.matches(old).count();
    if count == 0 {
        return Err(CliError::Usage(format!(
            "edit: --old not found in note '{id}'"
        )));
    }
    if count > 1 {
        return Err(CliError::Usage(format!(
            "edit: --old is not unique (matched {count} times in '{id}'); add more context"
        )));
    }

    let new_content = content.replacen(old, &new, 1);

    let bytes_before = content.len() as i64;
    let bytes_after = new_content.len() as i64;
    let bytes_delta = bytes_after - bytes_before;

    if !dry_run {
        atomic_write_text(&path, &new_content)?;
    }
```

</details>

**依据 6 · 源码核查**：[app/tydora-cli/src/store.rs:654-668](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/src/store.rs#L654-L668)

整篇write非空保护及覆盖。

<details>
<summary>查看原文（15行）</summary>

```text
pub fn cmd_write(id: &str, explicit: Option<&Path>, dry_run: bool, body: &BodySource) -> CliResult<Wrote> {
    let vault = paths::resolve_vault(explicit)?;
    let path = note::resolve_note_path(id, &vault)?;
    let new_body = read_body(body)?;
    if new_body.is_empty() && !dry_run {
        return Err(CliError::Usage(
            "write: stdin body is empty; refusing to overwrite".into(),
        ));
    }

    let bytes = new_body.as_bytes().len() as u64;

    if !dry_run {
        atomic_write_text(&path, &new_body)?;
    }
```

</details>

**依据 7 · 源码核查**：[app/tydora-cli/src/mcp.rs:346-408](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/src/mcp.rs#L346-L408)

MCP白名单、read-only和vault flag限制。

<details>
<summary>查看原文（63行）</summary>

```text
/// 用 shell-words 分词（处理引号/转义/空格）。
/// 分词失败 = 引号不闭合等，直接拒绝，不做猜测性修复。
fn tokenize(syntax: &str) -> Result<Vec<String>, String> {
    let tokens = shell_words::split(syntax)
        .map_err(|e| format!("syntax parse error: {e}. Close all quotes, e.g. search \"my query\""))?;
    if tokens.is_empty() {
        return Err("syntax is empty; expected a tydora command, e.g. 'notebooks'".into());
    }
    Ok(tokens)
}

/// 白名单校验：命令 ∈ 允许集；flag ∈ 该命令允许集 ∪ 全局集；
/// token 黑名单；--vault 恒拒绝。通过后 tokens 可直接拼进 argv（clap 做最终校验）。
fn validate_tokens(tokens: &[String], opts: &McpOptions) -> Result<(), String> {
    let cmd = &tokens[0];
    let spec = COMMANDS
        .iter()
        .find(|c| c.name == cmd)
        .or_else(|| {
            if opts.allow_publish && PUBLISH_SPEC.name == cmd {
                Some(&PUBLISH_SPEC)
            } else {
                None
            }
        });

    let Some(spec) = spec else {
        let mut allowed: Vec<&str> = COMMANDS.iter().map(|c| c.name).collect();
        if opts.allow_publish {
            allowed.push("publish");
        }
        let extra = if opts.read_only {
            " (server is running with --read-only: write commands are disabled)"
        } else {
            ""
        };
        return Err(format!(
            "command '{cmd}' is not allowed{extra}. Allowed commands: {}",
            allowed.join(", ")
        ));
    };

    if opts.read_only && !matches!(spec.name, "notebooks" | "list" | "show" | "search") {
        return Err(format!(
            "command '{}' is not allowed: server is running with --read-only (notebooks/list/show/search only)",
            spec.name
        ));
    }

    for token in tokens {
        if let Some(bad) = token.chars().find(|c| FORBIDDEN_CHARS.contains(c)) {
            return Err(format!(
                "character '{bad}' is not allowed in syntax (shell metacharacters are rejected). \
                 Pass such text via the `stdin` field instead (create/write body, edit --new-stdin)"
            ));
        }
        if token == "--vault" || token.starts_with("--vault=") || token == "-h" || token == "--help"
            || token == "-V" || token == "--version"
        {
            return Err(format!(
                "'{token}' is not allowed through the MCP tool. The vault is pinned by the \
                 server process environment ($TYDORA_VAULT)"
            ));
```

</details>

**依据 8 · 源码核查**：[app/tydora-cli/src/mcp.rs:270-292](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/src/mcp.rs#L270-L292)

Cli解析与dispatch_to直调非shell。

<details>
<summary>查看原文（23行）</summary>

```text
    let tokens = match tokenize(syntax) {
        Ok(t) => t,
        Err(msg) => return tool_error(msg),
    };
    if let Err(msg) = validate_tokens(&tokens, opts) {
        return tool_error(msg);
    }

    // ---- argv 组装 + 复用 CLI 解析与分派 ----
    let mut argv: Vec<String> = vec!["tydora".into(), "--json".into()];
    argv.extend(tokens);

    let cli = match Cli::parse(argv) {
        Ok(c) => c,
        Err(e) => return tool_error(e.to_string()),
    };

    let mut buffer: Vec<u8> = Vec::new();
    let body_src = BodySource::Buffer(stdin_body);
    match crate::dispatch::dispatch_to(cli, &mut buffer, &body_src) {
        Ok(()) => {
            let text = String::from_utf8_lossy(&buffer).trim_end().to_string();
            let structured = serde_json::from_str::<Value>(&text).ok().filter(|v| v.is_object());
```

</details>

**依据 9 · 源码核查**：[app/tydora-core/src/note.rs:74-103](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-core/src/note.rs#L74-L103)

join/is_file路径解析不做canonical范围证明。

<details>
<summary>查看原文（30行）</summary>

```text
pub fn resolve_note_path(id: &str, vault: &Path) -> CoreResult<PathBuf> {
    if !is_safe_relative_id(id) {
        return Err(CoreError::usage(format!("invalid note id: {id:?}")));
    }
    let raw = id.replace('\\', "/");
    let raw_pb = PathBuf::from(&raw);
    let candidates: Vec<PathBuf> = if has_markdown_ext(&raw_pb) {
        vec![vault.join(&raw)]
    } else {
        vec![
            // 先试字面路径（兼容无扩展名但确实存在的文件）
            vault.join(&raw),
            vault.join(format!("{raw}.md")),
            vault.join(format!("{raw}.markdown")),
            vault.join(format!("{raw}.mdx")),
        ]
    };
    let mut last_tried: Option<PathBuf> = None;
    for c in &candidates {
        last_tried = Some(c.clone());
        if c.is_file() {
            return Ok(c.clone());
        }
    }
    Err(CoreError::not_found(format!(
        "note '{id}' not found (tried: {})",
        last_tried
            .map(|p| p.display().to_string())
            .unwrap_or_else(|| "<none>".into())
    )))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地权限、发布和全周期代价允许哪种采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

桌面需可信安装包与Tauri支持系统，源码需Node/React/Vite和Rust/Tauri工具链；独立CLI/MCP需对应二进制，发布另依赖Node markdown-publish。无需先有模型账号才能写笔记，Agent接入才增加模型／MCP宿主和文件权限成本。本轮未安装应用、构建CLI或发布。

可建议复制的小Vault做单writer GUI写作试用，核正文、frontmatter、双链和引用媒体往返，避免直接迁移唯一原库。MCP先--read-only，不开allow-publish；默认写工具可改笔记，shell元字符限制不是内容安全验证或逐次用户审批。目录绑定仍要核symlink与进程OS权限。CLI read／parse逻辑为简化YAML子集，与GUI不同实现，不等完整YAML/复杂Markdown保真。

PublishService实际解析vaultDir/out为相对或绝对路径，invoke run_markdown_publish，成功回done，失败抛出。这个路径是构建站点，不证明已经网络部署，更不保证私密笔记自动排除；导出前人工核选择范围和生成文件。本轮未全审vendor发布器和远端deploy。首次迁移要备份与逐格式验证，持续有格式往返、索引、备份和更新，失败恢复可能从外部备份找回被覆盖版本。现金可含存储／站点托管／可选Agent模型；本地写作不等全部业务成本为0，金额和工时未知。退出保留Markdown与附件并用原编辑器核可读，独特canvas／发布配置不保证其他工具兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:66-89](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/README.md#L66-L89)

作者安装／源码栈说明。

<details>
<summary>查看原文（24行）</summary>

````text
## Quick Start

1. Download and install Tydora from the [Release](https://github.com/zuorn/Tydora/releases) page.

## **Run from Source**

```bash
git clone https://github.com/zuorn/Tydora.git
cd Tydora
npm install

npm run tauri dev
npm run tauri build
```

## Tech Stack


| Layer         | Technology                                                  |
| --------------- | ------------------------------------------------------------- |
| Frontend      | React 19 + TypeScript + Vite 6                              |
| Editor        | TipTap 3.x (WYSIWYG) + CodeMirror 6 (Source)                |
| Backend       | Rust (Tauri v2)                                             |
| Visualization | D3.js (Graph) + markmap (Mind Map) + React Flow (Canvas)    |
````

</details>

**依据 2 · 作者声明**：[app/tydora-core/README.md:19-29](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-core/README.md#L19-L29)

core仅简化YAML并对齐TS，而非共用全实现。

<details>
<summary>查看原文（11行）</summary>

```text

## 设计约束

1. **依赖严格**：仅 `std` + `serde` + `serde_json` + `thiserror`。  
   不引入 `serde_yaml`（用户决策保持简化 YAML 子集，详见 crate docs）。
2. **不感知 exit code / 退出码**：core 纯粹抛 [`CoreError`]，退出码由调用方
   （CLI 的 [`crate::errors::CliError`] / Tauri IPC 的 `Result<_, String>`）
   决定。已通过 `From<CoreError> for CliError` 桥接。
3. **完全独立**：不引入 `tauri` / `tauri-plugin-*`，可独立编译、独立测试。
4. **对齐前端 TS 语义**：
   - `vault::scan_vault` 跳过 `.` 开头目录 / 文件、单目录 IO 错误 swallow、16 个 IMAGE_EXTENSIONS 列表与 `vault-file-scanner.ts` 逐字一致
```

</details>

**依据 3 · 源码核查**：[app/tydora-cli/src/mcp.rs:359-408](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/src/mcp.rs#L359-L408)

read-only和publish条件、禁更换vault。

<details>
<summary>查看原文（50行）</summary>

```text
fn validate_tokens(tokens: &[String], opts: &McpOptions) -> Result<(), String> {
    let cmd = &tokens[0];
    let spec = COMMANDS
        .iter()
        .find(|c| c.name == cmd)
        .or_else(|| {
            if opts.allow_publish && PUBLISH_SPEC.name == cmd {
                Some(&PUBLISH_SPEC)
            } else {
                None
            }
        });

    let Some(spec) = spec else {
        let mut allowed: Vec<&str> = COMMANDS.iter().map(|c| c.name).collect();
        if opts.allow_publish {
            allowed.push("publish");
        }
        let extra = if opts.read_only {
            " (server is running with --read-only: write commands are disabled)"
        } else {
            ""
        };
        return Err(format!(
            "command '{cmd}' is not allowed{extra}. Allowed commands: {}",
            allowed.join(", ")
        ));
    };

    if opts.read_only && !matches!(spec.name, "notebooks" | "list" | "show" | "search") {
        return Err(format!(
            "command '{}' is not allowed: server is running with --read-only (notebooks/list/show/search only)",
            spec.name
        ));
    }

    for token in tokens {
        if let Some(bad) = token.chars().find(|c| FORBIDDEN_CHARS.contains(c)) {
            return Err(format!(
                "character '{bad}' is not allowed in syntax (shell metacharacters are rejected). \
                 Pass such text via the `stdin` field instead (create/write body, edit --new-stdin)"
            ));
        }
        if token == "--vault" || token.starts_with("--vault=") || token == "-h" || token == "--help"
            || token == "-V" || token == "--version"
        {
            return Err(format!(
                "'{token}' is not allowed through the MCP tool. The vault is pinned by the \
                 server process environment ($TYDORA_VAULT)"
            ));
```

</details>

**依据 4 · 源码核查**：[app/tydora-web/src/publish/PublishService.ts:71-99](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/publish/PublishService.ts#L71-L99)

构建publish与绝对/相对目录解析、错误传播。

<details>
<summary>查看原文（29行）</summary>

```text
function resolvePath(base: string, relative: string): string {
  if (/^[A-Za-z]:/.test(relative) || relative.startsWith("/")) {
    return relative;
  }
  return `${base}/${relative}`;
}

export async function publishVault(
  vaultPath: string,
  config: PublishConfig,
  onProgress?: (progress: PublishProgress) => void
): Promise<void> {
  const vaultDir = config.vaultDir === "." ? vaultPath : resolvePath(vaultPath, config.vaultDir);
  const outDir = resolvePath(vaultPath, config.out);

  onProgress?.({ total: 0, current: 0, currentFile: "", phase: "reading" });

  // 调用 Rust 后端执行 markdown-publish CLI
  try {
    await invoke<string>("run_markdown_publish", {
      vaultDir,
      outDir,
      config: JSON.stringify(config),
    });
    onProgress?.({ total: 1, current: 1, currentFile: "", phase: "done" });
  } catch (e: any) {
    console.error("发布失败:", e);
    throw new Error(e?.message || String(e) || "发布失败");
  }
```

</details>

**依据 5 · 源码核查**：[app/tydora-web/src/App.tsx:1518-1535](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/App.tsx#L1518-L1535)

dirty外部变化跳过影响恢复。

<details>
<summary>查看原文（18行）</summary>

```text
  const reloadExternallyChangedBuffers = useCallback(async (paths: string[]) => {
    const norm = (p: string) => p.replace(/\\/g, "/").toLowerCase();
    for (const changedPath of paths) {
    const buf = buffersRef.current.find((b) => b.fileName && norm(b.fileName) === norm(changedPath));
    if (!buf || !buf.fileName || buf.modified) continue;
    try {
      const text = await readTextFile(buf.fileName);
        const fresh = buffersRef.current.find((b) => b.id === buf.id);
        // 读取期间缓冲被切换/进入编辑态，或内容与磁盘一致，跳过
        if (!fresh || fresh.modified || text === fresh.savedContent || text === fresh.content) continue;
        updateBuffer(buf.id, { content: text, savedContent: text, modified: false });
        if (buf.id === activeBufferIdRef.current) {
          setSaveStatus("idle");
          syncMindmapContent(text);
        }
      } catch {
        // 文件可能正在被写入，等待下一次 watcher 事件
      }
```

</details>

#### 缺口

- 桌面实际文件权限、跨平台原子保存、完整Markdown往返和备份恢复未执行。
  **影响**：不能承诺迁移无损或并发无冲突。
  **进一步探讨**：复制代表性小库，用原文件diff、外部编辑和异常IO验证后再决定扩大。
- 发布器私密内容过滤、外部命令与远端部署路径未全审。
  **影响**：不能建议公开整个真实笔记库。
  **进一步探讨**：另审选择/忽略规则和生成目录，只用公开测试笔记本地构建并检查每个输出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多视图与Agent协作能证明到哪里，新冲突假设如何证伪？

**研究主题**：新假设与验证

#### 完整回答

作者描述多视图写作和CLI测试通过，但本轮只核固定源，不运行交互、平台文件系统、渲染／导出或宿主。图谱／导图展示关系不等知识正确和理解提升，CLI单元／MCP样例也不证明GUI与Agent同时写文件不会丢更新。DSH apply空骨架不能从badge补成已接入能力。

从Q02 watcher跳dirty和保存无版本条件推导未实现方向：外部修改发生时保留基线、缓冲与磁盘三版本并提示合并，保存前做expected digest核对，可能让用户从“最后写赢”转为明确处理冲突。相对已有自动reload增量是dirty状态也可见外部变化，并阻止静默覆盖，尚未实现。最小试验为GUI dirty后CLI edit、CLI写入期间GUI save、外部rename三组复制文件，比较当前与版本核对提示的丢更新、误阻断、恢复时间和格式diff；若丢更新未降或误报/合并成本高于单writer流程则否定。

#### 证据与依据

**依据 1 · 作者声明**：[app/tydora-cli/README.md:5-11](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-cli/README.md#L5-L11)

作者阶段与测试声明，不是本轮执行。

```text
> **Phase 1 + Phase 2 + Phase 3 + Phase 4 状态（2026-09-11）**：全部子命令可用——
> 只读（notebooks / list / show / search）+ 写路径（create / edit / write / delete）+
> 进阶（search / publish / completion）+ **MCP over stdio 服务器（`tydora mcp`）**；
> 68 个测试全过（cli_smoke 38 + mcp_e2e 21 + mcp 单测 9）。**externalBin 已接入**
> （tauri.conf.json `bundle.externalBin` + `npm run build:cli` 自动构建 sidecar，
> 随 NSIS/DMG/deb 分发）。MCP 设计文档：`docs/mcp-implementation-plan.md`。
>
```

**依据 2 · 源码核查**：[app/tydora-web/src/App.tsx:1515-1535](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/App.tsx#L1515-L1535)

dirty不重载是三方合并推导起点。

<details>
<summary>查看原文（21行）</summary>

```text
  // - 仅刷新「无未保存修改」的缓冲：缓冲处于编辑态（modified）时跳过，避免覆盖用户输入；
  //   用户保存（手动/自动）后的下一次外部写入会恢复刷新。
  // - 与磁盘内容一致的写回（本应用自己保存触发的 watcher 回声）会被忽略。
  const reloadExternallyChangedBuffers = useCallback(async (paths: string[]) => {
    const norm = (p: string) => p.replace(/\\/g, "/").toLowerCase();
    for (const changedPath of paths) {
    const buf = buffersRef.current.find((b) => b.fileName && norm(b.fileName) === norm(changedPath));
    if (!buf || !buf.fileName || buf.modified) continue;
    try {
      const text = await readTextFile(buf.fileName);
        const fresh = buffersRef.current.find((b) => b.id === buf.id);
        // 读取期间缓冲被切换/进入编辑态，或内容与磁盘一致，跳过
        if (!fresh || fresh.modified || text === fresh.savedContent || text === fresh.content) continue;
        updateBuffer(buf.id, { content: text, savedContent: text, modified: false });
        if (buf.id === activeBufferIdRef.current) {
          setSaveStatus("idle");
          syncMindmapContent(text);
        }
      } catch {
        // 文件可能正在被写入，等待下一次 watcher 事件
      }
```

</details>

**依据 3 · 源码核查**：[app/tydora-web/src/App.tsx:1563-1568](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/app/tydora-web/src/App.tsx#L1563-L1568)

无磁盘预期版本的save。

```text
      // 对话框期间内容可能变化，重新读取最新内容
      const latest = buffersRef.current.find((b) => b.id === bufId) ?? buf;
      const contentToWrite = latest.content;
      await writeTextFile(path, contentToWrite);
      updateBuffer(bufId, { savedContent: contentToWrite, modified: false });
      if (bufId === activeBufferIdRef.current) setSaveStatus("saved");
```

**依据 4 · 源码核查**：[dsh/index.ts:12-18](https://github.com/zuorn/Tydora/blob/4af1de4d458c7d03adc2615893e4793766c1bb87/dsh/index.ts#L12-L18)

空apply边界。

```text
export const name = 'tydora'

export function apply(ctx: Context) {
  // 最小骨架：加载即生效，目前不注册任何能力。
  // 示例（取消注释并补充实现即可启用）：
  // ctx.logger?.info('[tydora] plugin loaded')
}
```

#### 缺口

- 三版本／CAS保存的实际保真与用户收益未验证。
  **影响**：仅未来方向不算当前能力。
  **进一步探讨**：执行复制笔记三反例，对比丢更新、误阻断与恢复投入，不改善则保持单writer。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
