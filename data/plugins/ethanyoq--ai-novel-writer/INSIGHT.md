# 书童 Pagekin

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[b5bb7b4](https://github.com/EthanYoQ/Pagekin/tree/b5bb7b493c955ced13a7decb0c03e56f240f6d0a)

<!-- BEGIN META -->
[![GitHub ★ 2,371](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C371&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Pagekin)
<!-- END META -->

> **功能**：本地优先的长篇小说桌面写作工作区，覆盖设定、蓝图、写稿、审稿、修稿和定稿。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持围绕作品组织规划到定稿的状态交接，并以源校验、revision裁决和定稿outbox区分生成与交付。可解释增量是作者掌控版本与恢复，不是已证明文学质量或全球首创。

> **主要限制**：[Q02](#research-q02)至[Q04](#research-q04)表明数据库已定稿、实体稿待发布、生成候选和未存尾段必须区分；本地优先仍会向配置模型和可选WebDAV外发。未验恢复和人审收益，不能用版本/文件存在当生产验收。

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
  - [Q01 · Pagekin桌面应用为长篇作者改变什么交付？](#detail-section-11)
  - [Q02 · 审稿修稿合并和定稿的事实边界是什么？](#detail-section-12)
  - [Q03 · 本地优先是否代表作品与费用都不离开电脑？](#detail-section-13)
  - [Q04 · 失败候选、续跑、备份和退出的全周期代价如何？](#detail-section-14)
  - [Q05 · 从状态机制可提出什么独立可验方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合愿意维护设定、架构、角色、蓝图和章节版本的长篇作者。原办法是聊天生成后在文档中手工复制、审核修订和整理连续性；这里将草稿、审稿、修稿、差异确认、定稿和版本放进作品上下文。合格交付应是作者接受且能回读/导出的章节与来源版本，不是模型生成长度、UI状态或一篇审稿报告。相对普通编辑器+聊天，增量是作品状态和章节交接；底层LLM、SQLite、编辑器和outbox不是独创。

普通编辑器+聊天手工整理章节与版本；LLM/SQLite/版本/outbox为既有方法。冻结DSH子包独立格式与维护状态，不继承桌面功能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面小说工作区 | 设定/蓝图/章节交接 | 根客户端，非DSH插件 |
| 审稿修稿/合并 | 作者裁决独立revision | 源变化拒绝，不保证文学质量 |
| 定稿outbox | 保存事实并发布实体稿 | committed与published分别核对 |
| 候选/续跑 | 中断文本恢复 | 来源一致才续，磁盘失败尾段不保证 |
| BYOK/WebDAV | 推理与可选备份 | 明确外发端点、费用与留存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Electron桌面/本地项目和SQLite | 必需 | 作品与主进程状态 | 存储失败不能当已保存 |
| 自备模型/端点/key | AI必需 | 云兼容协议或本地Ollama | 软件不提供额度，协议兼容待验 |
| Node>=22.14、pnpm11.11 | 源码构建必需 | Electron及原生依赖 | 不等正式安装包验收 |
| 向量模型 | 语义检索可选 | 知识选择 | 可退文本检索，质量未测 |
| WebDAV账号 | 云备份可选 | 上传作品archive | 与本地保存不同外发边界 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 作者建无敏感副本、选模型并备份 | 确认端点和作品位置 |
| 创作 | 规划/蓝图后写一章，选择审稿修稿 | 结果作为候选和revision，非自动权威 |
| 合并定稿 | 作者确认差异，核DB和实体稿 | 待发布按既有id恢复，不重新生成 |
| 退出 | 停任务、导出/备份、撤外部凭证 | 不自动撤回云端已收文本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装/硬盘/模型资源未知 | 作品迁移、模型和备份配置 | 根包号非发布验收 |
| 持续 | token/本地硬件/WebDAV未知 | 规划、人审、修稿和版本维护 | 无质量或净时间改善实测 |
| 失败 | 重试与磁盘恢复未知 | 判定候选、未存尾段、待发布 | 收据存在不保证末尾持久 |
| 退出升级 | 导出/备份/存储未知 | 保留DB与原稿，核云副本 | 卸载不撤云数据和调用费用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 作者控制 | 源核对、独立revision和合并 | 真实UI误判与审阅遵循 |
| 定稿交付 | DB事实与outbox投影分开 | 崩溃/切作品/磁盘故障恢复 |
| 连续创作 | 分阶段和上下文规则 | 文学质量、长篇矛盾与人审成本 |

> **思考**：[Q02](#research-q02)至[Q04](#research-q04)表明数据库已定稿、实体稿待发布、生成候选和未存尾段必须区分；本地优先仍会向配置模型和可选WebDAV外发。未验恢复和人审收益，不能用版本/文件存在当生产验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持围绕作品组织规划到定稿的状态交接，并以源校验、revision裁决和定稿outbox区分生成与交付。可解释增量是作者掌控版本与恢复，不是已证明文学质量或全球首创。

根桌面源/版本/lease校验与DB事实、实体稿投影分离可借鉴；不能与冻结DSH子包合并评价，未全审安全、模型适配或发行包。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)至[Q04](#research-q04)表明数据库已定稿、实体稿待发布、生成候选和未存尾段必须区分；本地优先仍会向配置模型和可选WebDAV外发。未验恢复和人审收益，不能用版本/文件存在当生产验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

长篇作者先用非敏感一章及独立备份试用，核候选/合并/定稿待发布/导出完整链。确认模型和备份目的地后再增加内容；收益不如编辑器加聊天就导出回退。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根为独立桌面客户端；源码支持章节源/版本/定稿状态设计，未运行桌面或恢复/模型实验。统一交付认知是假设，版本号不作发布验收。

- 已检查：作者 README、包清单、源码路径 README.md、electron/llm/openai-provider.ts、electron/repositories/finalization-repository.ts、electron/repositories/revision-repository.ts、electron/services/finalization-service.ts、electron/services/generation-draft-effects.ts、electron/services/generation-run-service.ts、electron/services/main-generation-plan.ts、electron/services/project-restore-service.ts、electron/services/review-revision-context.ts、electron/services/webdav-backup-service.ts、package.json、plugins/dsh-ai-novel-writer/README.md、src/stores/draft-store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读根README/package、审稿上下文、修订/合并、定稿仓储/服务、生成run与draft effects、provider、WebDAV上传和restore身份；未全面审计全应用/网络/凭证/发行包及全部上下文编排。
- 下一步：未安装运行桌面、模型/备份、目标代码/测试或故障实验；源码支持设计不等效果/无损恢复，作者陈述单独标记。

**分析版本**

- **仓库**：[EthanYoQ/Pagekin](https://github.com/EthanYoQ/Pagekin)
- **版本号**：1.4.0（[固定提交 b5bb7b4](https://github.com/EthanYoQ/Pagekin/tree/b5bb7b493c955ced13a7decb0c03e56f240f6d0a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)推导未验证的章节交付核对视图，围绕权威版本/发布/候选统一可回查行动；同故障对照识别准确率、恢复耗时和维护负担，无改善则放弃，不计已有贡献。

未安装运行桌面、模型/备份、目标代码/测试或故障实验；源码支持设计不等效果/无损恢复，作者陈述单独标记。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 210 | 14404 | — | — | 404020 |
| .cjs | source | 5 | 185 | 164 | 18 | — |
| .mjs | source | 132 | 50108 | 45942 | 1768 | — |
| .mjs | test | 27 | 12394 | 11667 | 344 | — |
| .ts | source | 545 | 125686 | 109842 | 7517 | — |
| .tsx | source | 143 | 24171 | 21847 | 1055 | — |
| .js | source | 3 | 267 | 250 | 5 | — |
| .ts | test | 521 | 144318 | 131479 | 1344 | — |
| .tsx | test | 93 | 29224 | 26346 | 301 | — |
| .mjs | example | 5 | 3703 | 3575 | 87 | — |
| .ts | example | 2 | 85 | 65 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/EthanYoQ/Pagekin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 114](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=114&color=737b86&logo=github)](https://github.com/EthanYoQ/Pagekin/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 143](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=143&color=737b86&logo=github)](https://github.com/EthanYoQ/Pagekin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断独立桌面应用章节交付、作者确认、恢复和外发边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Pagekin桌面应用为长篇作者改变什么交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当前根组件是书童Pagekin独立Electron桌面写作客户端，原名AI Novel Writer。根package私有、main为Electron，并不应安装为DSH插件；同仓库冻结子包有不同格式与生命周期，其贡献不能互相借用。README主要仍介绍1.3.0，而固定根包标1.4.0，不能把包号当已发布且验收的产品。

适合愿意维护设定、架构、角色、蓝图和章节版本的长篇作者。原办法是聊天生成后在文档中手工复制、审核修订和整理连续性；这里将草稿、审稿、修稿、差异确认、定稿和版本放进作品上下文。合格交付应是作者接受且能回读/导出的章节与来源版本，不是模型生成长度、UI状态或一篇审稿报告。相对普通编辑器+聊天，增量是作品状态和章节交接；底层LLM、SQLite、编辑器和outbox不是独创。

README宣称各阶段由用户确认、一次最多批量10章，但是否减少长篇矛盾或人审成本本次无独立结果。仅偶发短文或不愿规划的作者可能用普通编辑器即可，不应把长篇工序数量当需求证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/package.json#L1-L14)

根私有Electron客户端与Node条件。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "ai-novel-writer",
  "version": "1.4.0",
  "description": "AI Novel Writer - a local-first production workspace for long-form fiction",
  "author": "AI Novel Writer Maintainers",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.11.0",
  "engines": {
    "node": ">=22.14.0"
  },
  "main": "dist-electron/main.js",
  "scripts": {
    "postinstall": "node node_modules/electron/install.js",
```

</details>

**依据 2 · 作者声明**：[README.md:15-24](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/README.md#L15-L24)

作者本地优先/BYOK与实录耗时边界。

<details>
<summary>查看原文（10行）</summary>

```text
<p align="center">
  <strong>Pagekin，免费 AI 小说写作软件</strong><br />
  从设定、架构、章节蓝图到正文、审稿、修稿、定稿，一章一章把书写完；也能拆解参考小说来仿写、导入原稿接着续写，或按你的要求改写。<br />
  本地优先：作品存在你自己的电脑上。软件不带模型：接你自己的 API Key，或用 Ollama 跑本地模型。
</p>

<p align="center">
  <a href="https://github.com/EthanYoQ/Pagekin/releases/latest"><img src="https://img.shields.io/badge/%E4%B8%8B%E8%BD%BD-Windows%20%7C%20macOS-2b4c8c?style=for-the-badge" alt="下载 Windows 与 macOS 安装包" /></a><br />
  <a href="https://www.orz.md/ai-novel-writer/demo/">观看 32 秒中文实录：选段续写与改成对话</a><br />
  <sub>1.3.0 实录，模型等待段已剪短，AI 配音；32 秒是片长，不是生成耗时。</sub>
```

</details>

**依据 3 · 作者声明**：[README.md:84-113](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/README.md#L84-L113)

章节流程、恢复、版本与Skill作者描述。

<details>
<summary>查看原文（30行）</summary>

```text
### 正文：写稿、审稿、修稿、定稿

正文单章视图把一章从待写带到定稿。AI 写出草稿后，你可以直接改，也可以让 AI 审稿。审稿报告列出每条意见，你逐条勾选或忽略，也可以加上自己的意见。修稿结果以差异给你逐段确认，不会直接覆盖原稿。确认无误后定稿。

![正文单章视图：左侧是设定、架构、蓝图、正文四步流程，中间是第 3 章正文，右侧是审稿报告](docs/assets/readme/v130-zh-chapter.webp)

写作时，AI 拿到的是这一章的蓝图、相关角色、世界观、前文摘要和上一章全文，而不是整本书的聊天记录。

正文编辑器支持 Tab 插入两个全角空格作为段首缩进。写一章的全过程可以只用键盘完成。

### 运行侧页：看清 AI 正在做什么

所有生成任务都在运行侧页里，分进行中、历史、诊断三页。写作时可以实时看到输出，随时取消。批量创作可以暂停。生成失败时，已经写出的文字会留成恢复候选，可以复制或放弃。

![运行侧页：正在写第 3 章，实时输出逐句出现](docs/assets/readme/v130-zh-run.webp)

### 作品资料与版本：写长篇不丢线索

- **剧情与伏笔**：按章节看主线、支线和伏笔的进度，记下每条线索在哪一章埋设、推进或解决。
- **知识库**：导入参考资料（.txt、.md）。没有配置检索模型时，也能用本地全文检索。
- **版本历史**：每章的历次稿件都留着，可以和当前稿对比，也可以回退成一份新草稿。
- **导出与备份**：导出为合并 Markdown、分章 Markdown 或 TXT。可以把作品打包存到本机，或备份到你绑定的 WebDAV 云端。恢复时总是另存为一份新副本。

### 写作 Skill：导入你自己的写作规则

在设置的「写作 Skills」页，可以从本机选一个 Skill 文件夹或单个 SKILL.md，也可以填 GitHub 上的 Skill 地址，导入提示词型的写作 Skill，比如「去 AI 味」、某种文风或某类题材的写法。SKILL.md 引用的 references 文本会一并装入。安装前软件会先读取并展示内容，由你检查后再安装。装好后把它绑定到规划、写稿、审稿或修稿阶段，之后这一阶段的生成都会带上它。

只支持自包含的 SKILL.md 提示词。脚本、hook、子代理和工具调用这类内容不会被安装，Skill 不能在你的电脑上执行代码。

### 深色主题与中英文界面
```

</details>

**依据 4 · 作者声明**：[plugins/dsh-ai-novel-writer/README.md:3-7](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/plugins/dsh-ai-novel-writer/README.md#L3-L7)

同仓库子包独立冻结且不打开桌面项目。

```text
The `0.1.0` plugin preview is frozen. No short-term feature work is planned. This README supports existing users and maintainers. Development can resume only under a new, explicitly scoped plan.

The plugin adds a local novel workspace to DeepSeek Harness Web. It has its own project format and release. It does not open desktop projects. The desktop app's `1.2.0-Preview` release does not change this plugin's version or maintenance status.

[Desktop app](../../README_en.md) · [npm package](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer) · [Installation guide](docs/official-dsh-plugin-installation.md)
```

#### 缺口

- 未验证正式安装包与1.4.0源码对应、长篇连续性及真实人审收益。
  **影响**：不能推荐长期生产采用或从演示片长推生成性能。
  **进一步探讨**：先用自有短篇样本完成一章闭环，记录人审返工，再扩大章数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审稿修稿合并和定稿的事实边界是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

审稿/修稿上下文在主进程按当前草稿id、版本、状态和hash捕获，原始作者选择不能自动改成更新的正文；源变化会拒绝。修稿保存为独立revision，并校验expectedSource。合并入口冻结编辑器内容revision，依项目session和typed资源身份调用db:revision-merge；仓储再校验当前正文和修订来源后更新内容与合并状态。这比直接覆盖模型输出更能保留作者裁决边界，但结构和指纹一致不证明文学质量或模型审稿意见正确。

定稿不是简单写一个Markdown：SQLite事务提交正文/定稿与outbox，FinalizationService随后把冻结快照发布为实体稿。数据库已提交而文件发布失败时返回committed=true、待发布；retry只取finalizationId和已提交快照，验证hash与权威状态再重试。换作品期间不会把发布状态记到另一个作品。丢响应后相同冻结请求复用既有记录，冲突请求拒绝。

因此用户应分别核作者接受、数据库定稿事实与实体稿发布状态。失败不等全部回滚，已有最终稿不应靠再次生成重建。此处只抽查核心主进程/仓储链，不宣称完整UI及所有数据库操作已经验收。

#### 证据与依据

**依据 1 · 源码核查**：[electron/services/review-revision-context.ts:21-62](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/review-revision-context.ts#L21-L62)

原始选择重构和当前草稿hash/版本校验。

<details>
<summary>查看原文（42行）</summary>

```text

/** Reconstruct only the original author selection, never a newer manuscript or confirmation. */
export function reviewRevisionRequest(context: ReviewRevisionContext): PrepareReviewRevisionRequest {
  return { operation: context.operation, draftId: context.source.id,
    expectedDraft: { chapterNumber: context.source.chapterNumber, version: context.source.version,
      status: context.source.status, contentHash: context.sourceHash },
    authorInputs: structuredClone(context.authorInputs), uiLocale: context.uiLocale,
    ...(context.confirmation ? { reviewSourceId: context.confirmation.reviewSourceId, confirmedReviewContent: context.confirmation.content } : {}),
    ...(context.recheck ? { reviewCycleId: context.recheck.cycleId, expectedMergedHash: context.recheck.mergedHash } : {}) }
}

/**
 * Captured DB is the authority. The returned material is also re-read on dispatch/resume/save.
 *
 * Only the project id enters the captured identity: the session lease (`epoch`) is deliberately
 * NOT an input, so the result is a pure function of `(db, request)` and therefore identical across
 * a reopen. The live lease is attached to the `SourceRef` at the point of use instead.
 */
export function captureReviewRevisionContext(db: Database.Database, request: PrepareReviewRevisionRequest,
  projectId: string, frozenRecheckVersion?: 1 | 2): ReviewRevisionContext {
  if (!request || Object.keys(request).some(key => !['operation', 'draftId', 'expectedDraft', 'reviewSourceId', 'confirmedReviewContent', 'reviewCycleId', 'expectedMergedHash', 'authorInputs', 'uiLocale'].includes(key))
    || !REVIEW_REVISION_OPERATIONS.includes(request.operation) || !Number.isSafeInteger(request.draftId) || request.draftId < 1
    || !['zh-CN', 'en-US'].includes(request.uiLocale) || !request.expectedDraft
    || Object.keys(request.expectedDraft).some(key => !['chapterNumber', 'version', 'status', 'contentHash'].includes(key))
    || !Array.isArray(request.authorInputs) || request.authorInputs.length > 2) fail()
  const allowedInputs = request.operation === 'refine-draft' ? ['user-prompt', 'merged-guidance'] : request.operation === 'review-chapter' ? ['review-focus'] : []
  if (new Set(request.authorInputs.map(item => item?.id)).size !== request.authorInputs.length
    || request.authorInputs.some(item => !item || Object.keys(item).some(key => !['id', 'text'].includes(key))
      || !allowedInputs.includes(item.id) || typeof item.text !== 'string' || Buffer.byteLength(item.text) > 8 * 1024 * 1024)) fail()
  if (request.operation !== 'refine-from-review' && (request.reviewSourceId !== undefined || request.confirmedReviewContent !== undefined)) fail()
  const recheckRequested = request.reviewCycleId !== undefined || request.expectedMergedHash !== undefined
  if (recheckRequested && (request.operation !== 'review-chapter' || typeof request.reviewCycleId !== 'string'
    || !request.reviewCycleId.trim() || typeof request.expectedMergedHash !== 'string')) fail()
  return db.transaction((): ReviewRevisionContext => {
    const source = db.prepare('SELECT d.id,d.chapter_number AS chapterNumber,d.version,d.status,c.body AS content FROM drafts d JOIN contents c ON c.id=d.content_id WHERE d.id=?')
      .get(request.draftId) as ExpectedDraftSource | undefined
    const latest = source && db.prepare(`SELECT id FROM drafts WHERE chapter_number=? AND status IN (${CURRENT_DRAFT_STATUS_SQL}) ORDER BY version DESC,id DESC LIMIT 1`).pluck().get(source.chapterNumber)
    if (!source || latest !== source.id || !isDeepStrictEqual(request.expectedDraft,
      { chapterNumber: source.chapterNumber, version: source.version, status: source.status, contentHash: textHash(source.content) }))
      throw new Error('GENERATION_REVIEW_SOURCE_CHANGED')
    let recheck: ReviewRevisionContext['recheck']
    if (recheckRequested) {
```

</details>

**依据 2 · 源码核查**：[electron/repositories/revision-repository.ts:110-138](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/repositories/revision-repository.ts#L110-L138)

事务创建revision前校验源。

<details>
<summary>查看原文（29行）</summary>

```text
    }): { id: number; revisionIndex: number } {
        const db = getProjectDb()
        if (!db) throw new Error('PROJECT_NOT_OPEN')

        const tx = db.transaction(() => {
            if (!params.expectedSource) throw new SourceDraftChangedError()
            assertExpectedDraftSource(db, params.baseDraftId, params.expectedSource)
            const row = db.prepare(`
        SELECT MAX(revision_index) as maxIdx FROM revisions WHERE base_draft_id = ?
      `).get(params.baseDraftId) as { maxIdx: number | null }
            const revisionIndex = (row.maxIdx ?? 0) + 1

            const contentId = ContentRepository.create(params.content)
            const result = db.prepare(`
        INSERT INTO revisions (
          base_draft_id, revision_index, revision_type,
          user_prompt, review_source_id,
          source_draft_chapter_number, source_draft_version, source_draft_status, source_content,
          content_id, word_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
                params.baseDraftId,
                revisionIndex,
                params.revisionType,
                params.userPrompt ?? '',
                params.reviewSourceId ?? null,
                params.expectedSource?.chapterNumber ?? null,
                params.expectedSource?.version ?? null,
                params.expectedSource?.status ?? null,
```

</details>

**依据 3 · 源码核查**：[src/stores/draft-store.ts:303-350](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/src/stores/draft-store.ts#L303-L350)

冻结编辑器及项目session、typed合并。

<details>
<summary>查看原文（48行）</summary>

```text
    void chapterDir // Compatibility argument; typed DB identities now determine the merge target.
    let committedReceipt: Awaited<ReturnType<typeof ipc.invoke<'db:revision-merge'>>>['receipt'] | undefined
    try {
      const projectSession = currentDraftProjectSession(expectedProjectPath, expectedProjectSession)
      if (!projectSession) {
        return { success: false, error: '项目已切换，已拒绝跨项目合并' }
      }
      // 必须在第一次 await 前冻结标签；否则动态导入/身份解析期间的新输入
      // 会被误当成提交基准，并在完成回执到达时被覆盖。
      const editorState = useEditorStore.getState()
      const targetTab = editorState.tabs.find(t =>
        t.projectKey === expectedProjectPath && t.filePath === filePath
      )
      const editorSnapshot = targetTab
        ? {
            content: targetTab.content ?? expectedDraftContent,
            contentRevision: targetTab.contentRevision ?? 0,
          }
        : undefined

      const draftResource = parseResourceUri(filePath)
      const revisionResource = parseResourceUri(revPath)
      if (!resourceWriteAllowed(filePath) || draftResource?.kind !== 'draft'
        || revisionResource?.kind !== 'revision' || revisionResource.legacy) {
        return { success: false, error: '资源只读或无法确定草稿与修订身份' }
      }
      const targetDraftId = draftResource.id
      const revisionId = revisionResource.id

      const merged = requireIpcSuccess(
        await ipc.invokeWithProjectSession(
          projectSession,
          'db:revision-merge',
          {
            revisionId,
            targetDraftId,
            expectedDraftContent,
            mergedContent: mergedText,
            wordCount: countDraftUnits(mergedText),
          },
          expectedProjectPath,
        ),
        '提交合并后的修订稿',
      )
      committedReceipt = merged.receipt
      if (!isDraftProjectSessionCurrent(projectSession)) {
        return { success: true, receipt: committedReceipt, postCommitError: staleProjectError().error }
      }
```

</details>

**依据 4 · 源码核查**：[electron/repositories/revision-repository.ts:340-378](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/repositories/revision-repository.ts#L340-L378)

校验当前/源正文后更新与标记合并。

<details>
<summary>查看原文（39行）</summary>

```text
                throw new Error('REVISION_NOT_PENDING')
            }
            if (!['draft', 'revised', 'reviewed'].includes(target.status)) {
                throw new Error('REVISION_TARGET_NOT_EDITABLE')
            }
            if (target.body !== request.expectedDraftContent) {
                throw new Error('REVISION_TARGET_CHANGED')
            }
            if (
                revision.source_draft_chapter_number === null
                || revision.source_draft_version === null
                || revision.source_draft_status === null
                || revision.source_content === null
            ) {
                throw new Error('REVISION_SOURCE_MISSING')
            }
            if (
                target.chapter_number !== revision.source_draft_chapter_number
                || target.version !== revision.source_draft_version
                || target.status !== revision.source_draft_status
                || target.body !== revision.source_content
            ) {
                throw new Error('REVISION_SOURCE_MISMATCH')
            }
            db.prepare('UPDATE contents SET body = ? WHERE id = ?')
                .run(request.mergedContent, target.content_id)
            const draftUpdate = db.prepare(`
              UPDATE drafts_all
              SET status = 'revised', word_count = ?, updated_at = datetime('now')
              WHERE id = ? AND status IN ('draft', 'revised', 'reviewed')
            `).run(request.wordCount, request.targetDraftId)
            if (draftUpdate.changes !== 1) {
                throw new Error('REVISION_TARGET_CHANGED')
            }
            const revisionUpdate = db.prepare(`
              UPDATE revisions
              SET status = 'merged', merged_to_draft_id = ?, updated_at = datetime('now')
              WHERE id = ? AND base_draft_id = ? AND status = 'pending'
            `).run(request.targetDraftId, request.revisionId, request.targetDraftId)
```

</details>

**依据 5 · 源码核查**：[electron/repositories/finalization-repository.ts:210-216](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/repositories/finalization-repository.ts#L210-L216)

数据库事实与outbox共同事务约束。

```text
 * 定稿的数据库事实源。正文、字数、定稿状态与发布 outbox 必须由同一个 SQLite
 * transaction 共同提交；任何一个 statement 失败都会回滚其余变化。
 */
export class FinalizationRepository {
  /** One transactionally frozen, highest-version finalized fact per chapter. */
  static listAuthoritativeForExport(): FinalizedDraftExportSnapshot[] {
    return readAuthoritativeExportRows().map(({ snapshot }) => snapshot)
```

**依据 6 · 源码核查**：[electron/services/finalization-service.ts:100-157](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/finalization-service.ts#L100-L157)

重复请求复用与提交后发布。

<details>
<summary>查看原文（58行）</summary>

```text
    this.createFinalizationId = options.createFinalizationId ?? randomUUID
    this.publisher = options.publisher ?? manuscriptPublisher
  }

  async finalize(request: FinalizationRequest): Promise<FinalizationResult> {
    const finalizationId = this.createFinalizationId()
    const contentHash = snapshotHash(request.content)
    let record: FinalizationRecord
    try {
      const existing = FinalizationRepository.getByDraftId(request.draftId)
      if (existing) {
        if (!hasSameFrozenRequest(existing, request, contentHash)) {
          return {
            success: false,
            committed: false,
            error: 'FINALIZATION_COMMIT_CONFLICT',
          }
        }
        // 上次响应可能在客户端收到前丢失。复用既有 finalizationId 与目标文件名，
        // 而不是因新的 UUID 或文件碰撞创建第二次提交。
        return this.publishCommitted(request.projectRoot, existing)
      }
      const target = resolveManuscriptTarget({
        projectRoot: request.projectRoot,
        chapterNumber: request.chapterNumber,
        chapterTitle: request.chapterTitle,
        finalizationId,
        // 删除清理还没记完的文件名不能用：续跑那次清理会把新发布的这份删掉。
        reserved: ChapterDeletionRepository.reservedManuscriptTargets(),
      })
      record = FinalizationRepository.commit({
        finalizationId,
        draftId: request.draftId,
        chapterNumber: request.chapterNumber,
        chapterTitle: request.chapterTitle,
        content: request.content,
        contentHash,
        contentRevision: request.contentRevision,
        targetFileName: target.fileName,
      })
    } catch (error) {
      return {
        success: false,
        committed: false,
        finalizationId,
        contentHash,
        contentRevision: request.contentRevision,
        draftId: request.draftId,
        error: String(error),
      }
    }
    return this.publishCommitted(request.projectRoot, record)
  }

  async retry(request: FinalizationRetryRequest): Promise<FinalizationResult> {
    let record: FinalizationRecord | null
    try {
      record = FinalizationRepository.get(request.finalizationId)
```

</details>

**依据 7 · 源码核查**：[electron/services/finalization-service.ts:178-218](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/finalization-service.ts#L178-L218)

冻结快照发布、跨项目和待发布失败状态。

<details>
<summary>查看原文（41行）</summary>

```text

  private async publishCommitted(projectRoot: string, record: FinalizationRecord): Promise<FinalizationResult> {
    try {
      readPortableRuntimeFreeze(projectRoot).assertMutable('finalization_outbox', record.finalizationId)
    } catch (error) {
      const message = error instanceof PortableRuntimeFreezeError ? error.code : String(error)
      return toResult(record, false, message)
    }
    try {
      const integrityError = snapshotIntegrityError(record)
      if (integrityError) throw new Error(integrityError)
      if (record.publicationStatus === 'published') {
        return toResult(record, true)
      }
      if (!FinalizationRepository.isAuthoritative(record.draftId)) {
        return toResult(record, false, 'FINALIZATION_SUPERSEDED')
      }
      await this.publisher.publish({
        projectRoot,
        targetFileName: record.targetFileName,
        chapterNumber: record.chapterNumber,
        chapterTitle: record.chapterTitle,
        content: record.contentSnapshot,
      })
      // 写实体稿期间换了作品：发布结果不记进另一部作品的库；原作品的 outbox 仍是待发布，重新打开后重试即可（同内容幂等）。
      assertRequiredExpectedProjectPath(getCurrentProjectPath(), projectRoot)
      return toResult(FinalizationRepository.markPublished(record.finalizationId), true)
    } catch (error) {
      // committed: true 已表明定稿已提交、实体稿待发布，各显示处自己写这句；error 只带原因（错误码或系统报错）。
      const message = String(error)
      try {
        assertRequiredExpectedProjectPath(getCurrentProjectPath(), projectRoot)
      } catch {
        return toResult(record, false, message)
      }
      try {
        const pending = FinalizationRepository.markPublicationPending(record.finalizationId, message)
        return toResult(pending, false, message)
      } catch (markError) {
        // outbox 在事务内已经以 pending 创建；即使补记错误失败，也不能把已提交事实伪装为回滚。
        console.error('[finalization] 实体稿待发布状态记录失败:', markError)
```

</details>

#### 缺口

- 未故障注入合并并发、发布丢响应和UI误判。
  **影响**：不能把outbox源码认定所有版本/文件恢复无损。
  **进一步探讨**：用可丢弃作品测试源变化、切作品、磁盘写失败和重复定稿，核DB/实体稿与receipt。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地优先是否代表作品与费用都不离开电脑？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

本地优先说的是作品文件与SQLite存储，不等所有推理离线。OpenAI兼容provider把messages与model参数序列化POST至用户baseURL，Authorization带配置key；云端模型能看到被选中的设定、正文和上下文。Ollama可用本地端点，但用户仍需运行模型并承担硬件资源，不能称零成本。README说明Gemini原生与OpenAI兼容两种协议，不能换URL就支持任意接口；本次未逐一验证所有provider。

可选WebDAV备份会实际上传作品archive、manifest和完成描述，和默认本地保存是不同数据通道。恢复服务会校验来源、目标与安装收据，为新副本分配新项目id；它并非多人实时协作同步或云端模型账号。没有完整审计凭证静态保护、备份内容与所有网络出口，不宣称全链路加密或无秘密泄露。

用户应使用自己有权处理的素材，明确模型与备份目的地，先用无敏感内容测试。正文事实和版权判断由作者承担。语义检索另需向量模型；未配置时README称可本地全文搜索，不能把检索配置成功当连续性事实正确。

#### 证据与依据

**依据 1 · 源码核查**：[electron/llm/openai-provider.ts:107-135](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/llm/openai-provider.ts#L107-L135)

实际key header和messages POST端点。

<details>
<summary>查看原文（29行）</summary>

```text
  private buildRequestHeaders(model: ModelProfile, conversationId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${model.apiKey}`,
    }
    if (isOpencodeGoBaseUrl(model.baseUrl)) {
      headers['x-opencode-session'] = conversationId || crypto.randomUUID()
      headers['User-Agent'] = OPENCODE_GO_USER_AGENT
    }
    return headers
  }

  async generate(model: ModelProfile, messages: Array<{ role: string; content: string }>, opts: LLMGenerateOptions): Promise<LLMResponse> {
    try {
      const url = resolveOpenAIChatCompletionsUrl(model.baseUrl, model.provider)
      const body = this.buildRequestBody(model, messages, opts, false)

      const res = await fetch(url, {
        method: 'POST',
        headers: this.buildRequestHeaders(model, opts.conversationId),
        body: JSON.stringify(body),
        signal: opts.signal,
      })

      if (!res.ok) {
        const text = await res.text()
        return { success: false, content: '', finishReason: 'error', error: 'LLM_REQUEST_FAILED', httpFailure: { status: res.status, body: text } }
      }

```

</details>

**依据 2 · 作者声明**：[README.md:128-148](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/README.md#L128-L148)

服务协议与向量检索条件。

<details>
<summary>查看原文（21行）</summary>

````text
| 服务商 | 协议 | 说明 |
| --- | --- | --- |
| DeepSeek | OpenAI 兼容 | 预设地址 `https://api.deepseek.com` |
| SiliconFlow（硅基流动） | OpenAI 兼容 | 预设地址 `https://api.siliconflow.cn/v1` |
| BigModel（智谱） | OpenAI 兼容 | 预设地址 `https://open.bigmodel.cn/api/paas/v4` |
| OpenAI | OpenAI 兼容 | 预设地址 `https://api.openai.com` |
| xAI（Grok） | OpenAI 兼容 | 预设地址 `https://api.x.ai/v1` |
| Google Gemini | Gemini 原生 | 预设地址 `https://generativelanguage.googleapis.com` |
| Ollama（本地） | OpenAI 兼容 | 模型跑在你自己的电脑上 |
| NovelAI | OpenAI 兼容 | 最小兼容支持，未用真实账号完整验证 |
| 自定义 | OpenAI 兼容 | 填任意兼容服务的地址 |

「自定义」只是在上面两种协议里换地址、模型名和凭据，不是任意 HTTP 接口。Anthropic、Azure、KoboldAI 原生接口等需要单独的适配器，换个 URL 不能保证能用。

知识库的语义检索另需一个向量模型，在设置的「检索模型」里配置。

### 用 Ollama 跑本地模型

```text
服务商：   Ollama（本地）或自定义
协议：     OpenAI 兼容
````

</details>

**依据 3 · 源码核查**：[electron/services/webdav-backup-service.ts:320-343](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/webdav-backup-service.ts#L320-L343)

作品archive实际上传及manifest。

<details>
<summary>查看原文（24行）</summary>

```text
    const manifest: GenerationManifest = {
      version: 1,
      cloudBookId: input.cloudBookId,
      generationId,
      parentGenerationIds: parents,
      createdAt,
      originProjectId: input.originProjectId,
      portableSnapshotGeneration: input.portableSnapshotGeneration,
      archive: { file: 'archive.ainovel', ...localArchive },
    }
    const manifestBytes = Buffer.from(JSON.stringify(manifest), 'utf8')
    if (manifestBytes.length > this.maxJsonBytes) fail('WEBDAV_INPUT_INVALID')
    await this.putFile(input.account, locations.archive, input.archivePath, localArchive, input.signal)
    await this.putBytes(input.account, locations.manifest, manifestBytes, input.signal)
    const completion: CompletionDescriptor = {
      version: 1,
      cloudBookId: input.cloudBookId,
      generationId,
      manifest: { file: 'manifest.json', sha256: sha256(manifestBytes), byteSize: manifestBytes.length },
      archive: manifest.archive,
      completedAt: this.now().toISOString(),
    }
    const completionBytes = Buffer.from(JSON.stringify(completion), 'utf8')
    if (completionBytes.length > this.maxJsonBytes) fail('WEBDAV_INPUT_INVALID')
```

</details>

**依据 4 · 源码核查**：[electron/services/project-restore-service.ts:835-850](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/project-restore-service.ts#L835-L850)

恢复分配新项目身份。

<details>
<summary>查看原文（16行）</summary>

```text
      if (!journal) fail('PORTABLE_RESTORE_TARGET_EXISTS')
      reservationOwned(journal, targetRoot)
      activeInstallJournals.add(normalized(journal.path))
      heldJournalPath = journal.path
    } else if (journal) {
      unlinkIdentity(journal.path, journal.identity)
      journal = null
    }

    const targetProjectId = journal?.document.targetProjectId ?? (input.newProjectId ?? randomUUID)()
    if (!UUID.test(targetProjectId) || targetProjectId === authority.originProjectId) fail('PORTABLE_RESTORE_INVALID')
    const storage = path.join(attempt.root, CANONICAL_PROJECT_DIRECTORY)
    mkdirOwned(attempt, storage)
    for (const entry of extracted.manifest.entries) {
      const source = path.join(attempt.root, ...entry.path.split('/'))
      if (contained(storage, source)) continue
```

</details>

**依据 5 · 作者声明**：[README.md:202-212](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/README.md#L202-L212)

作者费用、存储与外发说明。

<details>
<summary>查看原文（11行）</summary>

```text
免费。软件以 GPL-3.0 协议开源。调用云端模型产生的费用由你和模型服务商结算，与本软件无关。用 Ollama 跑本地模型则不需要付费给任何服务商。

**需要什么模型？**
任何兼容 OpenAI Chat Completions 接口的模型都可以接，Google Gemini 走原生协议。设置里有 DeepSeek、SiliconFlow、智谱、OpenAI、xAI、Gemini、Ollama 和 NovelAI 的预设。生成质量取决于你选的模型，软件不对模型输出质量作保证。

**作品数据存在哪里？**
存在你自己的电脑上：作品文件夹加一个本地 SQLite 数据库。只有你发起生成时，相关的提示词、作品设定和上下文才会发给你配置的模型服务。

**能写多长的小说？**
总章数由你在设定里填，没有固定上限。写每一章时，AI 拿到的是这一章的蓝图、相关角色、世界观、前文摘要和上一章全文，所以不需要把整本书塞进一次对话。批量创作一次最多连写 10 章，可以多次接着写。

```

</details>

#### 缺口

- 未全审模型凭证静态保护、全部网络路径与WebDAV加密/恢复。
  **影响**：不能对私密作品作全链路本机/加密保证，不能用免费软件替代总成本。
  **进一步探讨**：按目标模型/备份配置核对请求和archive内容及凭证保存，再决定是否导入私密作品。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 失败候选、续跑、备份和退出的全周期代价如何？

**研究主题**：效果与总成本、采用判断

#### 完整回答

生成run持久保存可见文本与usage状态。失败/取消会尝试flush并settle稳定错误分类，存储失败另保留unsavedTail；主进程resume要求指纹、contextSnapshotId和sourceManifest一致且validateRecovery通过。生成候选可读、可放弃，但候选不是已经批准的正文，磁盘失败也不能保证最后可见尾段都持久。GenerationDraftEffects用receipt/hash和当前正文核对，区分absent、changed、current，避免把被改过的草稿当原生成提交。

首次要安装桌面包或维护Node/pnpm/Electron原生依赖，准备模型与作品路径；持续要审核长文本、更新设定/蓝图、处理旧源冲突、模型费用、备份和导出。默认根生成策略有请求/token/时间上限，但规划任务可按工作量扩展预算，不能拿该常数当所有任务同一固定账单。云费、硬件、电力、恢复时间与质量净收益均未实测。

当前可试用非敏感一章，先验证取消候选、源变化拒绝、revision合并、定稿待发布和导出备份；保留原文与独立备份。退出前导出并保留项目/DB，取消活动任务、按需要删除WebDAV副本或撤凭证；卸载应用不等撤回模型已收文本或清理云副本。若复核和状态维护超普通编辑器+聊天，回退原流程。

#### 证据与依据

**依据 1 · 源码核查**：[electron/services/generation-run-service.ts:271-310](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/generation-run-service.ts#L271-L310)

失败flush、settle与存储失败分类。

<details>
<summary>查看原文（40行）</summary>

```text
            }
            catch (error) {
                if (diagnostics && !diagnostics.endReason) diagnostics = { ...diagnostics, ...safeTransportError(error),
                    elapsedMs: diagnostics.elapsedMs + Math.max(0, Math.round(performance.now() - diagnosticsAt)),
                    endReason: controller.signal.aborted ? 'cancelled' : 'failed' };
                retainInterruptedAgentText();
                flush();
                try {
                    if (suspended) return { ...receipt, ...(storageFailed ? { unsavedTail: text.slice(durable.length) } : {}), failureCode: 'GENERATION_PROJECT_CLOSED' };
                    const current = deps.repository.receipt(attemptId);
                    if (current.attempt.status === 'dispatch-marked') {
                        // Persist only stable categories, never provider text that may contain credentials or prompts.
                        const networkCode = diagnostics?.causeCode ?? diagnostics?.errorCode;
                        const network = Boolean(networkCode && /^(UND_ERR_|ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ERR_STREAM_PREMATURE_CLOSE)/.test(networkCode))
                            || error instanceof Error && /^(NETWORK_ERROR|ECONNRESET|ETIMEDOUT|FETCH_FAILED)$/.test(error.message);
                        let known = 'GENERATION_PROVIDER_FAILED';
                        if (error instanceof Error && isTerminalProviderFailure(error.message)) known = 'GENERATION_CONTEXT_LENGTH_EXCEEDED';
                        else if (network) known = 'NETWORK_ERROR';
                        const failureCode = storageFailed ? 'GENERATION_STORAGE_FAILED' : timedOut ? 'ROOT_BUDGET_EXHAUSTED'
                            : streamFailed ? 'GENERATION_STREAM_INVALID' : controller.signal.aborted ? 'GENERATION_CANCELLED' : known;
                        receipt = deps.repository.settle(attemptId, null, null, failureCode, diagnostics);
                    }
                    else
                        receipt = current;
                }
                catch {
                    storageFailed = true;
                    failedRoots.add(run.rootActionId);
                }
            }
            finally {
                terminal = true;
                if (timer)
                    clearInterval(timer);
                if (deadline)
                    clearTimeout(deadline);
                removeAbortListener();
                controllers.delete(attemptId);
            }
            if (storageFailed)
```

</details>

**依据 2 · 源码核查**：[electron/services/generation-run-service.ts:342-357](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/generation-run-service.ts#L342-L357)

候选/取消/恢复指纹与来源检查。

<details>
<summary>查看原文（16行）</summary>

```text
        readUnsavedTails: (): readonly GenerationUnsavedTail[] => Object.freeze([...unsavedTails.values()]),
        get: (runId: string) => deps.repository.get(runId),
        readAttempt: (attemptId: string) => deps.repository.receipt(attemptId),
        listCandidates: () => deps.repository.listCandidates(),
        discardCandidate: (id: string) => {
            deps.repository.discardCandidate(id);
            for (const [attemptId, tail] of unsavedTails) if (tail.artifactId === id) unsavedTails.delete(attemptId);
        },
        pause: (rootId: string) => { deps.repository.pause(rootId); stopRoot(rootId); },
        cancel: (rootId: string) => { deps.repository.pause(rootId, true); stopRoot(rootId); },
        resume: async (runId: string, next: RunBinding) => { const old = deps.repository.get(runId); if (!isDeepStrictEqual(old.binding.fingerprint, next.fingerprint) || old.binding.contextSnapshotId !== next.contextSnapshotId || !isDeepStrictEqual(old.binding.sourceManifest, next.sourceManifest) || !deps.validateRecovery || !await deps.validateRecovery(old.binding, next))
            throw new Error('GENERATION_RECOVERY_UNAUTHORIZED'); deps.repository.resume(runId, next); return deps.repository.get(runId); },
        restart: (oldRootId: string, request: OpenGenerationRunRequest) => { deps.repository.pause(oldRootId, true); stopRoot(oldRootId); return deps.repository.open(request); },
        recoverInterrupted: () => deps.repository.recoverInterrupted(),
    };
}
```

</details>

**依据 3 · 源码核查**：[electron/services/generation-draft-effects.ts:96-123](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/generation-draft-effects.ts#L96-L123)

receipt校验和恢复状态区分。

<details>
<summary>查看原文（28行）</summary>

```text
  private verifiedCommit(row: AttemptRow) {
    const usage = JSON.parse(row.usage_receipt_json), stored = usage.draftCommit as StoredDraftCommit | undefined
    if (!stored) return null
    const run = this.runs.get(row.run_id), composition = this.runs.readVisibleComposition(run.runId)
    const draft = this.db.prepare('SELECT d.id,d.version,d.chapter_number,d.status,c.body FROM drafts d JOIN contents c ON c.id=d.content_id WHERE d.id=?').get(stored.id) as { id: number; version: number; chapter_number: number; status: string; body: string } | undefined
    if (!composition || !isDraftVisibleTextVersion(composition.algorithm) || stored.success !== true
      || stored.chapterNumber !== run.binding.sourceManifest.chapterNumber
      || draft && (stored.chapterNumber !== draft.chapter_number || stored.version !== draft.version) || stored.contentHash !== textHash(stored.content) || stored.contentHash !== composition.textHash
      || stored.content !== composition.text || stored.batchId !== run.binding.sourceManifest.batchId
      || !isDeepStrictEqual(stored.handle, { ...handleOf(run), epoch: usage.artifactIdentity?.epoch }))
      throw new Error('GENERATION_DRAFT_RECEIPT_INVALID')
    return { receipt: stored, matchesBody: !!draft && stored.content === draft.body, draft }
  }
  private readSaveState(runId: string) {
    const commits = this.attempts(runId).map(row => this.verifiedCommit(row)).filter(item => item !== null)
    if (commits.length > 1) throw new Error('GENERATION_DRAFT_RECEIPT_INVALID')
    return commits[0] ?? null
  }
  readCommit(runId: string): StoredDraftCommit | null {
    const saved = this.readSaveState(runId)
    if (saved && !saved.matchesBody) throw new Error('GENERATION_DRAFT_RECEIPT_INVALID')
    return saved?.receipt ?? null
  }
  readRecovery(runId: string): GenerationDraftSaveState {
    const saved = this.readSaveState(runId)
    if (!saved) return { kind: 'absent' }
    if (!saved.matchesBody) return { kind: 'changed' }
    const { id, version, content, contentHash } = saved.receipt
```

</details>

**依据 4 · 源码核查**：[electron/services/main-generation-plan.ts:15-40](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/main-generation-plan.ts#L15-L40)

默认预算及按工作量放大逻辑。

<details>
<summary>查看原文（26行）</summary>

```text
/** Finite root ceilings and semantic sizing are frozen into each source binding. */
export const MAIN_GENERATION_POLICY = Object.freeze({
  version: 's07-task-and-liability-v1',
  taskBudgetPolicy: S07_TASK_BUDGET_POLICY,
  capabilityPolicyVersion: 'verified-endpoint-model-budget-v1',
  budget: Object.freeze({ maxPhysicalRequests: 32, maxTokenLiability: 2_097_152,
    maxOutputPerRequest: 32_768, maxActiveElapsedMs: 3_600_000 } satisfies RootBudget),
  estimatorVersion: 'utf8-bytes-plus-chat-framing-v1',
  safetyMarginTokens: 512,
})

export type MainGenerationPolicy = Readonly<Omit<typeof MAIN_GENERATION_POLICY, 'version' | 'budget'> & {
  version: typeof MAIN_GENERATION_POLICY.version | 's07-planning-v1' | 's07-capacity-v2'
  budget: RootBudget
  planning?: PlanningGenerationScope
}>

function scaledRootBudget(requests: number, maxOutputPerRequest: number, perRequestLiability = MAIN_GENERATION_POLICY.budget.maxTokenLiability / MAIN_GENERATION_POLICY.budget.maxPhysicalRequests): RootBudget {
  const base = MAIN_GENERATION_POLICY.budget
  const maxPhysicalRequests = Math.max(base.maxPhysicalRequests, requests)
  const budget = { maxPhysicalRequests,
    maxTokenLiability: perRequestLiability * maxPhysicalRequests,
    maxOutputPerRequest,
    maxActiveElapsedMs: base.maxActiveElapsedMs / base.maxPhysicalRequests * maxPhysicalRequests }
  if (Object.values(budget).some(value => !Number.isSafeInteger(value) || value <= 0)) throw new Error('GENERATION_PLANNING_BUDGET_INVALID')
  return Object.freeze(budget)
```

</details>

**依据 5 · 作者声明**：[README.md:224-236](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/README.md#L224-L236)

作者签名限制与模型不替代审阅。

<details>
<summary>查看原文（13行）</summary>

```text

**Windows 或 macOS 提示安装包不安全怎么办？**
Windows 安装包未签名，Mac 安装包只有 ad-hoc 签名、没有经过 Apple 公证，所以系统会提示。确认安装包来自本项目的官方 GitHub Release 后，按上面「下载与安装」的步骤允许打开。

## 当前限制

- 不保证任意第三方 API 只靠 URL 和 Key 就能接入，只保证已实现的协议和预设。
- 不替代作者的创意、事实核查和版权判断。AI 写出的内容需要你审阅。
- 不提供在线发布、阅读社区或云端模型账号。

## 从源码构建

需要 Node.js 22.14 以上和仓库指定版本的 pnpm。
```

</details>

#### 缺口

- 未运行真实桌面、取消/崩溃恢复、备份恢复或跨平台安装。
  **影响**：只能推荐有独立备份的小范围试用，不能承诺无丢字与低维护。
  **进一步探讨**：记录同一章写作/审阅/恢复总时间和费用，先跑故障矩阵再决定长期采用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从状态机制可提出什么独立可验方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有值得借鉴的是分开模型候选、作者合并、数据库定稿与实体稿投影，冻结源与收据为失败核对提供依据；这来自成熟版本/事务方法在长篇作品中的组合，不是模型文学能力突破。最重要未知是作者是否真正理解这些状态，而非底层能否多存一些文件。

未验证方向为“章节交付核对”：把当前权威正文、作者接受的revision、定稿是否落DB、实体稿是否已发布及失败候选放在一个可回查状态页，以明确行动消除“看到文字就已保存”的误判。相对现有运行侧页/版本记录的增量是围绕单章最终交付统一认知，不增加自动写作权力；会增加UI和状态映射维护。

最小验证在同一章节和预算下比较现界面与核对视图，注入切作品、发布失败、存储尾段失败和源变化，测作者识别权威版本、找回文字的准确率与耗时，同时盲评正文质量。若只多一个面板、不降误判或变慢，则收窄/放弃；本次未实现，不能计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[electron/services/finalization-service.ts:178-218](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/finalization-service.ts#L178-L218)

已提交与待发布必须分别表达。

<details>
<summary>查看原文（41行）</summary>

```text

  private async publishCommitted(projectRoot: string, record: FinalizationRecord): Promise<FinalizationResult> {
    try {
      readPortableRuntimeFreeze(projectRoot).assertMutable('finalization_outbox', record.finalizationId)
    } catch (error) {
      const message = error instanceof PortableRuntimeFreezeError ? error.code : String(error)
      return toResult(record, false, message)
    }
    try {
      const integrityError = snapshotIntegrityError(record)
      if (integrityError) throw new Error(integrityError)
      if (record.publicationStatus === 'published') {
        return toResult(record, true)
      }
      if (!FinalizationRepository.isAuthoritative(record.draftId)) {
        return toResult(record, false, 'FINALIZATION_SUPERSEDED')
      }
      await this.publisher.publish({
        projectRoot,
        targetFileName: record.targetFileName,
        chapterNumber: record.chapterNumber,
        chapterTitle: record.chapterTitle,
        content: record.contentSnapshot,
      })
      // 写实体稿期间换了作品：发布结果不记进另一部作品的库；原作品的 outbox 仍是待发布，重新打开后重试即可（同内容幂等）。
      assertRequiredExpectedProjectPath(getCurrentProjectPath(), projectRoot)
      return toResult(FinalizationRepository.markPublished(record.finalizationId), true)
    } catch (error) {
      // committed: true 已表明定稿已提交、实体稿待发布，各显示处自己写这句；error 只带原因（错误码或系统报错）。
      const message = String(error)
      try {
        assertRequiredExpectedProjectPath(getCurrentProjectPath(), projectRoot)
      } catch {
        return toResult(record, false, message)
      }
      try {
        const pending = FinalizationRepository.markPublicationPending(record.finalizationId, message)
        return toResult(pending, false, message)
      } catch (markError) {
        // outbox 在事务内已经以 pending 创建；即使补记错误失败，也不能把已提交事实伪装为回滚。
        console.error('[finalization] 实体稿待发布状态记录失败:', markError)
```

</details>

**依据 2 · 源码核查**：[electron/services/generation-draft-effects.ts:113-123](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/electron/services/generation-draft-effects.ts#L113-L123)

当前/变更/不存在恢复状态。

<details>
<summary>查看原文（11行）</summary>

```text
  }
  readCommit(runId: string): StoredDraftCommit | null {
    const saved = this.readSaveState(runId)
    if (saved && !saved.matchesBody) throw new Error('GENERATION_DRAFT_RECEIPT_INVALID')
    return saved?.receipt ?? null
  }
  readRecovery(runId: string): GenerationDraftSaveState {
    const saved = this.readSaveState(runId)
    if (!saved) return { kind: 'absent' }
    if (!saved.matchesBody) return { kind: 'changed' }
    const { id, version, content, contentHash } = saved.receipt
```

</details>

**依据 3 · 作者声明**：[README.md:97-107](https://github.com/EthanYoQ/Pagekin/blob/b5bb7b493c955ced13a7decb0c03e56f240f6d0a/README.md#L97-L107)

已有运行侧页和版本基线。

<details>
<summary>查看原文（11行）</summary>

```text

![运行侧页：正在写第 3 章，实时输出逐句出现](docs/assets/readme/v130-zh-run.webp)

### 作品资料与版本：写长篇不丢线索

- **剧情与伏笔**：按章节看主线、支线和伏笔的进度，记下每条线索在哪一章埋设、推进或解决。
- **知识库**：导入参考资料（.txt、.md）。没有配置检索模型时，也能用本地全文检索。
- **版本历史**：每章的历次稿件都留着，可以和当前稿对比，也可以回退成一份新草稿。
- **导出与备份**：导出为合并 Markdown、分章 Markdown 或 TXT。可以把作品打包存到本机，或备份到你绑定的 WebDAV 云端。恢复时总是另存为一份新副本。

### 写作 Skill：导入你自己的写作规则
```

</details>

#### 缺口

- 统一交付状态是否帮助作者理解与降低恢复时间未知。
  **影响**：不能称当前痛点已经由新设计解决或已证实商业需求。
  **进一步探讨**：预先设误判与时间阈值，同故障样本测量，失败则停止。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
