# dsh-novel-forge 小说锻炉

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[ba559f3](https://github.com/huangziyuan-general/dsh-novel-forge/tree/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huangziyuan-general/dsh-novel-forge) [![npm 30d 9,896](https://img.shields.io/static/v1?label=npm+30d&message=9%2C896&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-novel-forge) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-novel-forge)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供中文长篇写作的细纲、设定账本、章节检查与版本管理。

> **亮点**：[Q01](#research-q01) 把细纲、账本和文本规则放在新版本前判定，拒绝原因可以独立核对。

> **主要限制**：[Q02](#research-q02) 人工与模型入口规则不同，[Q03](#research-q03) 正文和进度分开落盘，不能用一项成功确认全章。

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
  - [Q01 · 什么约束进入写章代码，较提示词增加什么？](#detail-section-11)
  - [Q02 · 面板保存和修订提案分别允许什么？](#detail-section-12)
  - [Q03 · 已写版本和批量检查点如何失败？](#detail-section-13)
  - [Q04 · 应如何接入并验收一章？](#detail-section-14)
  - [Q05 · 怎样检验故障后按落盘事实恢复的假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：连载作者可用一章样稿验证细纲、角色状态、章节冲突和版本回读。

原流程以提示词、设定表和人工审稿组织长篇。插件将部分约束设为可拒绝条件，仍需人核对叙事与事实。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 章级门禁 | 限制明显的设定和内容偏离 | 人工与模型策略不同 |
| 提案 | 登记待用户处理的修订 | 应用走单独路由 |
| 批量写作 | 逐章尝试并记录进度 | 正文与检查点分别保存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Node 和文件服务 | 接入必需 | 工具和版本写入 | 保留现有写作文件 |
| 项目细纲与角色状态 | 模型写章需要 | 形成可核对门禁 | 先修订设定 |
| 模型和备份 | 分别按生成及试用需要 | 起草与退出 | 只做人工审核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 作者复制单章和设定 | 原项目保留 |
| 验证 | 对照正确稿和有冲突稿 | 解释拒绝并能读回版本 |
| 退出 | 发现不一致时停续跑 | 回原稿和账本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型及备份未知 | 创建细纲和事实 | 宿主未验 |
| 持续 | 模型、磁盘未知 | 审查新稿与设定 | 净成本未测 |
| 失败恢复 | 重复生成和存储未知 | 核对账本、正文和检查点 | 中断窗口未验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 章节判定 | 共享门禁及部分放行留痕 | 真实作品误判 |
| 版本与恢复 | create 和独立进度 | 半完成后的自动恢复 |

> **思考**：[Q02](#research-q02) 人工与模型入口规则不同，[Q03](#research-q03) 正文和进度分开落盘，不能用一项成功确认全章。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把细纲、账本和文本规则放在新版本前判定，拒绝原因可以独立核对。

同一判定函数承载两种流程策略；版本化写入、账本和检查点仍需跨状态读回。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 人工与模型入口规则不同，[Q03](#research-q03) 正文和进度分开落盘，不能用一项成功确认全章。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从隔离项目的一章对照开始，能解释拒绝与版本结果后再考虑扩大。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已核查写章、面板、提案与批量检查点。未运行作品、宿主或恢复实验。

- 已检查：作者 README、包清单、源码路径 lib/tools/writing-tools.js、lib/chapter-commit.js、lib/server-routes/chapters.js、lib/tools/propose-tools.js、lib/server-routes/proposals.js、lib/batch-draft.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查代表性章级门禁、面板、提案和批次提交，不涵盖全部写作规则、宿主鉴权与真实作品。
- 下一步：单章对照有无事实冲突，批量用隔离项目在各写入点中断并核对重复版本。

**分析版本**

- **仓库**：[huangziyuan-general/dsh-novel-forge](https://github.com/huangziyuan-general/dsh-novel-forge)
- **版本号**：1.6.1（[固定提交 ba559f3](https://github.com/huangziyuan-general/dsh-novel-forge/tree/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 为每次写章记录可回查提交状态，可能减少部分完成后盲目续跑。

单章对照有无事实冲突，批量用隔离项目在各写入点中断并核对重复版本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 2473 | — | — | 60095 |
| .cjs | source | 2 | 110 | 87 | 5 | — |
| .js | source | 115 | 32780 | 23691 | 7780 | — |
| .mjs | source | 11 | 2017 | 1623 | 282 | — |
| .mjs | test | 54 | 19809 | 15794 | 2283 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/huangziyuan-general/dsh-novel-forge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：写长篇连载的人能否用小说锻炉在提交前发现可核对的设定冲突，并在人工改稿和批量恢复时保住版本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么约束进入写章代码，较提示词增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

写多章连载的作者可选一个已定角色状态和本章目标来验证。原流程用设定表、提示词和人工读稿；插件写章工具调用共享提交函数，先跑细纲阶段、文本机审和账本，成功才建立新版本。账本同章冲突直接抛拒绝；部分内容门禁可 force 放行并登记审计和质量债，连续拒绝的写作熔断另判。可以用已知矛盾的试稿比较普通保存和可说明的放行。贡献在于将可表达的约束纳入提交时判定，并保留失败理由；角色动机、节奏与读者效果仍要编辑判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-25](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/README.md#L7-L25)

作者界定中文长篇、代码门禁与人工分工。

<details>
<summary>查看原文（19行）</summary>

```text
DeepSeek Harness（DSH）的中文长篇写作插件。它不是「提示词合集」，而是把**一致性、门禁、审计**做进工具层与数据层：模型负责动笔，插件负责把写坏、写歪、写穿的地方拦在落盘之前。

**适合谁：** 多角色 / 多卷 / 连载几十上百章、会被「设定崩了」「前文失忆」「悬念泄底」「AI 味太重」卡住的长篇作者。

**一句话卖点：** 关键约束全部代码化——同章改值=冲突拒绝、隐藏人物不进上下文、细纲漏写场景=拒稿、旧版永不覆盖、长篇检索零依赖本地跑。

[快速开始](#快速开始约-5-分钟) ｜ [界面一览](#界面一览) ｜ [功能硬约束表](#ai-写作通病与硬约束) ｜ [23 个工具](#23-个工具)

## 为什么不是又一个「提示词合集」

多数写作插件的约束写在系统提示里——模型心情好就守，赶进度就绕。本插件的设计主线只有一条：

> **代码强制 > 提示词自觉。** 凡是「靠模型自觉」的约束都会失效；一致性、门禁、审计必须是工具层/数据层的硬约束。

三条可在仓库里对着源码核的事实：

1. **三条入口共用一份判定链**：面板「💾 保存」、`novel_write_chapter`、REST 写入走同一套门禁代码（机审/账本冲突/内容门禁/细纲契约）——没有旁路；唯一的放行开关显式记审计。
2. **模型无法自批提案**：修订提案模型只能登记、不能应用——「应用」是面板里用户的主权动作（模型侧没有 apply 工具）；细纲批准记录批准通道，看板统计「工具自批占比」（真机实证某连载本曾 168/168 全自批，正是大纲漂移的第一缺口）。
3. **审计零 token**：机审、去 AI 味扫描、平台审稿、一致性校验、账本时点推演全部是纯本地计算——逐章审计成本为 0，数字不经过模型之手。
```

</details>

**依据 2 · 源码核查**：[lib/tools/writing-tools.js:265-272](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/tools/writing-tools.js#L265-L272)

写章工具交给 commitChapter。

```text
            const committed = await commitChapter({
                config: cfg, io, p, book, novel, n,
                title: args.title, content: args.content, summary: args.summary,
                castNames: args.cast !== undefined ? parseList(args.cast) : [],
                updates: parseFactLines(args.facts_updates),
                evidences: parseFactEvidence(args.facts_evidence),
                cognitions: parseCognitionLines(args.cognition_updates),
                force: args.force === true,
```

**依据 3 · 源码核查**：[lib/chapter-commit.js:170-199](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L170-L199)

阶段门禁及熔断参数。

<details>
<summary>查看原文（30行）</summary>

```text
    // ① 阶段门禁（代码强制）
    const gate = stageGate
        ? gateChapterWrite(novel, n, { force })
        : { ok: true, forced: force === true, reason: '人工保存：跳过流程门禁（细纲批准），内容级门禁照跑', rules: [] };
    if (!gate.ok) throw new GateRejectionError(gate.reason);

    // ② 细纲存在性（批准了但文件被删也算异常；人工保存没有细纲这一说）
    const outline = await io.readText(p.chapterOutline(n));
    if (outline === null && !gate.forced && stageGate) {
        throw new GateRejectionError(`第${n}章细纲文件缺失（novel.json 标记已批准但文件不在）——请重新 save_chapter`);
    }

    // ①.5 熔断（E2）：同一章连续被驳回 ≥3 次，说明问题多半不在文字而在设定——
    // 此时拒绝再写，逼回去改细纲/场景契约，而不是硬压着改文字。
    // 熔断独立于 force：force 只 override 内容判定（细纲门禁/内容门禁/细纲禁项），
    // 不放开熔断——否则「连续驳回→硬压改写」的死循环会在 force 下一模一样重演
    // （真机完结本实证：force:true 反复绕过熔断，同一章被机审循环驳回多次）。
    // 解锁通道只有两条，且已在各自工具里调 clearBreaker 清零：
    //   · novel_outline save_chapter 后 approve（细纲重批）
    //   · novel_scene save（场景契约更新）
    // skipBreaker（人工保存通道，rest/chapter_save 面板路径专用）：熔断是给**模型执笔
    // 流程**的闸——防「无意识循环硬压」，而面板保存是人有意识的编辑行为；其解锁条件
    // （聊天里 approve 细纲）对人工编辑不可达也无意义（面板本就不要求细纲批准），
    // force 又顶不开熔断——不豁免的话连点 3 次保存就被锁死且无自救路径。豁免面：
    // 不推进计数（下方四处 recordRejection：机审 / 账本冲突 / 内容门禁 / 细纲禁项）、不受 tripped 拦截；模型/批量路径默认
    // false 行为一字不变；审计行照记（write_chapter/rejected by:user，痕迹不丢）。
    const br = skipBreaker ? { tripped: false, count: 0, reason: '' } : breakerState(novel, n);
    if (br.tripped) {
        await audit(io, p, 'write_chapter/breaker_tripped', { chapter: n, count: br.count });
        throw new GateRejectionError(br.reason);
```

</details>

**依据 4 · 源码核查**：[lib/chapter-commit.js:339-352](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L339-L352)

账本冲突抛拒绝。

<details>
<summary>查看原文（14行）</summary>

```text
    const { facts: nextFacts, added, conflicts } = applyFactUpdates(facts, groundedUpdates, { chapter: n, now });
    // ⚠️ ⑤ 之后的所有拒绝分支都**不可能**是 nonDraft：nonDraft 的提交在 ④ 就被
    // auditVerdict 驳回抛出了（chars < min/4 < min ⇒ verdict 必不 ok）。故这里不再有
    // nonDraft 判据与文案分支——曾经写着的 `!nonDraft` 守卫与 `breakerNote` 都是死代码。
    if (conflicts.length > 0) {
        const reason = conflicts.map((c) => c.reason).join('；');
        if (!skipBreaker) {
            recordRejection(novel, n, { code: 'ledger-conflict', detail: reason, chars: auditResult.chars });
            await saveBookMerged(io, p, novel, n, prevRecord, prevCount); // 驳回计数要落盘（0.13.6：账本冲突此前不计入熔断）
        }
        await audit(io, p, 'write_chapter/rejected', {
            chapter: n, kind: 'ledger-conflict', reason, breaker: novel.gateFailures?.[String(n)] ?? 0, by: committedBy,
        });
        throw new GateRejectionError(`账本冲突，未保存：${reason}`);
```

</details>

**依据 5 · 源码核查**：[lib/chapter-commit.js:410-433](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L410-L433)

内容门禁拒绝及显式放行留痕。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!cgate.ok && !force) {
        const reason = cgate.blocking.map((b) => b.message).join('；');
        // 守卫同 L217（机审）/L240（账本冲突）：面板路径 skipBreaker=true，
        // 不推进熔断也不受 tripped 锁死。audit 行照记在守卫外——审计是不可绕过的留痕契约。
        if (!skipBreaker) {
            recordRejection(novel, n, { code: cgate.blocking.map((b) => b.code).join(','), detail: reason, chars: auditResult.chars });
            await saveBookMerged(io, p, novel, n, prevRecord, prevCount);
        }
        await audit(io, p, 'write_chapter/rejected', {
            chapter: n, kind: 'content-gate', reason, breaker: novel.gateFailures?.[String(n)] ?? 0, by: committedBy,
        });
        throw new GateRejectionError(
            `内容门禁未通过，未保存：\n${cgate.blocking.map((b) => `- ${b.message}`).join('\n')}`
            + '\n（确要强行写入用 force:true，将记入审计）',
        );
    }
    if (!cgate.ok && force) {
        await audit(io, p, 'write_chapter/content_gate_forced', { chapter: n, blocked: cgate.blocking.map((b) => b.code) });
        // 硬门禁被 force 放行 = 人为越过了硬约束，**必须记成 hard 级债**：
        // 它不是瑕疵（minor），攒不得。softWarnings 不动（回执形状一个字不改）——
        // 质量债走书级账本，本章回执仍旧只报它原来报的东西。
        debts.push(makeDebt({
            code: 'content-gate-forced',
            message: `内容门禁被 force 放行：${cgate.blocking.map((b) => b.message).join('；')}`,
```

</details>

#### 缺口

- 没有真实作品的误拦漏拦率。
  **影响**：不能把规则覆盖推断为完整故事一致性。
  **进一步探讨**：用同一已知冲突样稿比较原流程与工具判定。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 面板保存和修订提案分别允许什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

面板人工保存仍调用 runChapterGates，却明确传 stageGate=false 和 skipBreaker=true，因此与模型写章共享判定函数但流程和熔断策略不同。模型提案工具只登记和列出，应用在单独 REST 路由上按用户通道调用。这个分工说明工具动作枚举和面板请求分开，不能仅据应用方写入 user 就证明所有 REST 调用源均由真人授权，也不能将提案通道推广成模型任何改稿都需批准，因为另有写章工具。使用者需分清要直接建立新版本还是仅登记待批准文本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/server-routes/chapters.js:205-216](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/server-routes/chapters.js#L205-L216)

面板共享判定但关闭流程门禁与熔断。

<details>
<summary>查看原文（12行）</summary>

```text
            const force = body.force === true;
            // 判定段（不过就 throw，由下面的 isGateRejection 分 409/500）
            // 字数口径与工具面同源：本书自定义区间 > 平台 > 插件默认。面板保存和模型写章
            // 走的是同一个 runChapterGates，配置不同源就会「同样一版字，人存得进、机器拒」。
            const judged = await runChapterGates({
                config: store.effectiveCharConfig(config, novel).config,
                io: fsio, p: store.pathsFor(bookId), book: bookId, novel, n: chapterNo,
                content, castNames: [], updates: [], force, committedBy: 'user', stageGate: false,
                // 人工保存不驱动熔断也不受其锁死（skipBreaker）：熔断解锁条件（聊天里
                // approve 细纲）对人工编辑不可达也无意义；模型/批量路径不带此参，行为不变。
                skipBreaker: true,
            });
```

</details>

**依据 2 · 源码核查**：[lib/tools/propose-tools.js:19-23](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/tools/propose-tools.js#L19-L23)

提案工具只接受 propose 或 list。

```text
        name: 'novel_propose',
        description: '修改提案制：propose 对已存章节提交修订稿（生成提案 id，**不改正文**）；list 列出提案（含每条基于哪一版、本章现在到哪一版）。**通道边界**：想自己动手改稿就直接用 novel_write_chapter（同章追加新版本，旧版永不覆盖——机审驳回后的重写也走它）；本工具是「把修订登记下来、等用户批准」的那条路。apply（应用）与 discard（丢弃）是**用户主权动作**，工具面不提供：提完提案请明确告知用户「到锻炉面板点应用」，不要声称提案已生效。同一章已有 pending 提案时不要重复提新的——先在面板应用或丢弃。',
        parameters: {
            action: { type: 'string', required: true, enum: ['propose', 'list'], description: 'propose 提交修订提案；list 列出已有提案。apply/discard/prune 由用户在面板操作，工具面不提供。' },
            book: { type: 'string', required: true, description: '书目名。' },
```

**依据 3 · 源码核查**：[lib/server-routes/proposals.js:66-79](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/server-routes/proposals.js#L66-L79)

应用走单独的项目 REST 路由。

<details>
<summary>查看原文（14行）</summary>

```text
    // POST /projects/:id/proposals/:pid/apply — 应用提案（生成新版本，旧版保留）
    if (req.method === 'POST' && segments[0] === 'projects' && segments[2] === 'proposals' && segments[4] === 'apply' && segments.length === 5) {
        const bookId = safeDecode(segments[1]);
        if (!validBookId(bookId)) { fail(res, 400, 'BAD_BOOK', 'invalid book id'); return true; }
        const proposalId = safeDecode(segments[3]);
        try {
            const found = await locateBook(bookId, { session: requestSession(req) });
            if (!found) { fail(res, 404, 'NOT_FOUND', '书不存在'); return true; }
            const value = await proposals.applyProposal(found.fsio, bookId, proposalId, api.config, 'user');
            writeJson(res, 200, { ok: true, value });
        } catch (error) {
            // 提案不存在 / 状态非 pending / 文件缺失 都是业务性拒绝，不是服务故障。
            fail(res, 400, 'PROPOSAL_REJECTED', String(error?.message ?? error));
        }
```

</details>

#### 缺口

- 未审计完整 HTTP 鉴权或其他方式访问宿主。
  **影响**：可确认接口分工，不能证明真人身份和审批不可绕过。
  **进一步探讨**：核对 Web 认证和会话授权，再分别验证提案、直写和面板保存。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 已写版本和批量检查点如何失败？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

提交通过后以 create 写新正文，再写事实和认知账本，最后保存索引。保存后的审计异常只留日志，以免成功稿被重复创建；正文成功但后续索引或账本失败仍存在多文件状态窗口。批量逐章调用相同提交函数，随后追加完成章与写检查点，写失败可忽略。版本守卫会复读和避让其他活动检查点，但并不把批次进度与各章正文变成同一事务。采用成本需分别计模型生成、存储版本、维护细纲和事实、清理半完成记录。没有实际数据能证明稿件更快通过人审。

#### 证据与依据

**依据 1 · 源码核查**：[lib/chapter-commit.js:744-759](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L744-L759)

先判定再创建版本和写账本。

<details>
<summary>查看原文（16行）</summary>

```text
    } = await runChapterGates({
        config, io, p, book, novel, n, content, castNames, updates, evidences, cognitions, force, committedBy, basisDigest,
    });

    // ⑥ 版本化落盘（永不覆盖旧版）——版本号统一走 versioning.nextVersion
    const names = (novel.chapters?.[String(n)]?.files ?? []).map((f) => f.file.split('/').pop() ?? '');
    const version = nextVersion(names, n);
    const rel = p.chapterFile(n, title, version);
    await io.writeText(rel, `${normContent.trimEnd()}\n`, 'create');

    // ⑦ 索引 + 账本持久化 + 审计
    if (nextFacts.length > 0) await io.writeJson(p.facts, nextFacts);
    // 认知账本持久化：与事实账本同一档（有新增才写盘）。到这里所有门禁已过，
    // 落盘不会被驳回分支打断。
    if (cognitionResult !== null && cognitionResult.added.length > 0) {
        await io.writeJson(p.cognition, cognitionResult.rows);
```

</details>

**依据 2 · 源码核查**：[lib/chapter-commit.js:798-818](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L798-L818)

索引保存后审计异常单独降级。

<details>
<summary>查看原文（21行）</summary>

```text
    advanceStage(novel, 'writing');
    recordSuccess(novel, n); // 本章已落盘 → 熔断计数清零
    await saveBookMerged(io, p, novel, n, prevRecord, prevCount);

    // 去 AI 味只扫一次，审计日志与返回值复用同一结果
    const noai = scanAiFlavor(normContent, { topK: config.scanTopK });
    // 跨章判据的结论并进 topIssues（模型读回执时与八维问题一处看，不另开一条通道）。
    // 分数不动：跨章频次不进八维加权（WEIGHTS 恒为 1 是被测试钉死的红线）。
    if (cross?.issues?.length > 0) {
        noai.topIssues = [...noai.topIssues, ...cross.issues.map((x) => `跨章：${x}`)];
    }
    // ⚠️ 到这里**正文、账本、索引都已成功落盘**：这条审计行写失败（并发 appendLine
    // 版本冲突等）不能把整章报成失败——那会让调用方（含批量起草）重试出重复版本。
    // 宁可少一条审计，也不能假阴性。与 rememberSession 同一条静默降级语义。
    try {
        await audit(io, p, 'write_chapter/saved', {
            chapter: n, version, file: rel, chars: auditResult.chars, forced: gate.forced,
            noaiScore: noai.score, quoteConverted, by: committedBy,
        });
    } catch (error) {
        console.warn(`[novel-forge] 第 ${n} 章已落盘但 saved 审计写入失败（不影响成稿）：${error?.message ?? error}`);
```

</details>

**依据 3 · 源码核查**：[lib/batch-draft.js:230-245](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/batch-draft.js#L230-L245)

检查点版本守卫和失败忽略。

<details>
<summary>查看原文（16行）</summary>

```text
    const CK_RUNNING_WINDOW_MS = 10 * 60_000;
    const saveCk = async () => {
        for (let attempt = 0; attempt < 2; attempt += 1) {
            try {
                const { value: cur, version } = await io.readJsonWithVersion(p.batchCheckpoint);
                if (cur && cur.status === 'running' && cur.startedAt !== checkpoint.startedAt) {
                    const age = Date.now() - Date.parse(cur.startedAt);
                    if (Number.isFinite(age) && age >= -60_000 && age < CK_RUNNING_WINDOW_MS) return;
                }
                await io.writeJsonAtVersion(p.batchCheckpoint, checkpoint, version);
                return;
            } catch (error) {
                if (!isVersionConflict(error)) return; /* 检查点失败不阻断 */
                // 冲突：读后写前被人抢先——重读盘上现况再判一次
            }
        }
```

</details>

**依据 4 · 源码核查**：[lib/batch-draft.js:305-319](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/batch-draft.js#L305-L319)

提交成功后单独更新检查点。

<details>
<summary>查看原文（15行）</summary>

```text
            emit({ type: 'commit-start', chapter: n });
            const committed = await commitChapter({
                config: bookConfig, io, p, book, novel, n,
                title, content: d.content, summary,
                castNames: [], updates: [], force: force === true,
                committedBy: 'agent',
                engine,
            });
            emit({ type: 'commit-done', chapter: n, version: committed.version });
            checkpoint.completed.push(n);
            await saveCk();
            results.push({
                chapter: n, ok: true, committed: true, title, chars: committed.chars,
                version: committed.version, path: committed.path,
                contentGate: committed.contentGate.ok ? 'pass' : 'forced',
```

</details>

#### 缺口

- 未在写正文、账本、索引和检查点之间注入故障。
  **影响**：无法核定恢复时有多少孤立版本和重复工作。
  **进一步探讨**：用复制项目在不同写入点中断，比较正文、账本及批次状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 应如何接入并验收一章？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

适合先把一章不敏感样稿复制进单独项目，选择明确的事实、细纲及一条预期冲突，再用兼容 DSH 和文件服务查看拒绝与版本记录。文本生成仍需所选模型；已经有定稿和稳定手工审稿流程的人可只评估账本。成功要能找到该章正确旧版、命中原因与手工更正结果，确认变更没有扩到原项目。若正确稿反复被误拦、冲突无法定位或记录和正文不一致，回原文本和人工设定表。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:27-49](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/package.json#L27-L49)

Node、入口、文件和工具依赖声明。

<details>
<summary>查看原文（23行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "CHANGELOG.md",
    "COMPATIBILITY.md",
    "README.md",
    "README.en.md",
    "cordis.patch.yml",
    "lib",
    "mcp",
    "skills"
  ],
  "peerDependencies": {
    "@deepseek-ai/dsh-fs": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
```

</details>

**依据 2 · 源码核查**：[lib/chapter-commit.js:339-352](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L339-L352)

试稿可以核对具体账本冲突。

<details>
<summary>查看原文（14行）</summary>

```text
    const { facts: nextFacts, added, conflicts } = applyFactUpdates(facts, groundedUpdates, { chapter: n, now });
    // ⚠️ ⑤ 之后的所有拒绝分支都**不可能**是 nonDraft：nonDraft 的提交在 ④ 就被
    // auditVerdict 驳回抛出了（chars < min/4 < min ⇒ verdict 必不 ok）。故这里不再有
    // nonDraft 判据与文案分支——曾经写着的 `!nonDraft` 守卫与 `breakerNote` 都是死代码。
    if (conflicts.length > 0) {
        const reason = conflicts.map((c) => c.reason).join('；');
        if (!skipBreaker) {
            recordRejection(novel, n, { code: 'ledger-conflict', detail: reason, chars: auditResult.chars });
            await saveBookMerged(io, p, novel, n, prevRecord, prevCount); // 驳回计数要落盘（0.13.6：账本冲突此前不计入熔断）
        }
        await audit(io, p, 'write_chapter/rejected', {
            chapter: n, kind: 'ledger-conflict', reason, breaker: novel.gateFailures?.[String(n)] ?? 0, by: committedBy,
        });
        throw new GateRejectionError(`账本冲突，未保存：${reason}`);
```

</details>

**依据 3 · 源码核查**：[lib/chapter-commit.js:748-759](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L748-L759)

验收正文版本与账本。

<details>
<summary>查看原文（12行）</summary>

```text
    // ⑥ 版本化落盘（永不覆盖旧版）——版本号统一走 versioning.nextVersion
    const names = (novel.chapters?.[String(n)]?.files ?? []).map((f) => f.file.split('/').pop() ?? '');
    const version = nextVersion(names, n);
    const rel = p.chapterFile(n, title, version);
    await io.writeText(rel, `${normContent.trimEnd()}\n`, 'create');

    // ⑦ 索引 + 账本持久化 + 审计
    if (nextFacts.length > 0) await io.writeJson(p.facts, nextFacts);
    // 认知账本持久化：与事实账本同一档（有新增才写盘）。到这里所有门禁已过，
    // 落盘不会被驳回分支打断。
    if (cognitionResult !== null && cognitionResult.added.length > 0) {
        await io.writeJson(p.cognition, cognitionResult.rows);
```

</details>

#### 缺口

- 未安装宿主或对照真实写作。
  **影响**：只支持限定范围的试用设计。
  **进一步探讨**：做一次正确和一次有意冲突的测试稿，并保留独立备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验故障后按落盘事实恢复的假设？

**研究主题**：新假设与验证

#### 完整回答

可能的改进是给每章提交一个可回查的尝试标识，分别确认正文、账本和索引后再决定是否续跑，检查点缺失时保留结果未知。现有 create 和检查点版本守卫提供基础，但两个提交点不同时成功。对同一批三章在正文写后、索引后及检查点写前中断，记录重复版本、无法定位的文件、回读时间。若仍会覆盖不同内容或需要较多人工比对，则保留手动复核和原备份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/chapter-commit.js:748-759](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/chapter-commit.js#L748-L759)

正文先于其他文件。

<details>
<summary>查看原文（12行）</summary>

```text
    // ⑥ 版本化落盘（永不覆盖旧版）——版本号统一走 versioning.nextVersion
    const names = (novel.chapters?.[String(n)]?.files ?? []).map((f) => f.file.split('/').pop() ?? '');
    const version = nextVersion(names, n);
    const rel = p.chapterFile(n, title, version);
    await io.writeText(rel, `${normContent.trimEnd()}\n`, 'create');

    // ⑦ 索引 + 账本持久化 + 审计
    if (nextFacts.length > 0) await io.writeJson(p.facts, nextFacts);
    // 认知账本持久化：与事实账本同一档（有新增才写盘）。到这里所有门禁已过，
    // 落盘不会被驳回分支打断。
    if (cognitionResult !== null && cognitionResult.added.length > 0) {
        await io.writeJson(p.cognition, cognitionResult.rows);
```

</details>

**依据 2 · 源码核查**：[lib/batch-draft.js:305-319](https://github.com/huangziyuan-general/dsh-novel-forge/blob/ba559f358fa452df8ffe57dc8a6d42f3bb2045a1/lib/batch-draft.js#L305-L319)

提交与检查点之间是故障试验窗口。

<details>
<summary>查看原文（15行）</summary>

```text
            emit({ type: 'commit-start', chapter: n });
            const committed = await commitChapter({
                config: bookConfig, io, p, book, novel, n,
                title, content: d.content, summary,
                castNames: [], updates: [], force: force === true,
                committedBy: 'agent',
                engine,
            });
            emit({ type: 'commit-done', chapter: n, version: committed.version });
            checkpoint.completed.push(n);
            await saveCk();
            results.push({
                chapter: n, ok: true, committed: true, title, chars: committed.chars,
                version: committed.version, path: committed.path,
                contentGate: committed.contentGate.ok ? 'pass' : 'forced',
```

</details>

#### 缺口

- 尝试标识和恢复流程未实现。
  **影响**：重复版本与恢复时间未量化。
  **进一步探讨**：对照现有检查点和尝试标识设计做隔离故障测试。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
