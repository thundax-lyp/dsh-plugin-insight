# No AI Style

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[3da3ef7](https://github.com/01NGVI-QINGYI/no-ai-style/tree/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01NGVI-QINGYI/no-ai-style)
<!-- END META -->

> **功能**：为学术和专业写作提供检查、润色和起草 Skill，以及 DSH 输入栏模式按钮。

> **亮点**：[Q01](#research-q01) 让编辑范围和事实约束更明确。

> **主要限制**：[Q03](#research-q03) 提示词不能强制保证模型保持事实。

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
  - [Q01 · 与直接要求模型润色相比增加什么？](#detail-section-11)
  - [Q02 · 插入怎样保留草稿引用？](#detail-section-12)
  - [Q03 · 事实保护是程序校验吗？](#detail-section-13)
  - [Q04 · 怎样试用并退出？](#detail-section-14)
  - [Q05 · 模式化能减少未经授权的改写吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：要审校学术或专业文字的人可先选择允许的操作模式。

直接手写提示允许更多控制，但常需重复说明事实边界。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模式提示 | 选择检查或改写 | 由模型执行 |
| 草稿插入 | 减少重复输入 | 旧宿主有引用时拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Web 客户端 | 按钮需要 | 挂载操作 | 手输指令 |
| 模型 | 实际处理需要 | 生成审阅或改写 | 人工处理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选非敏感摘要 | 保留原文 |
| 核查 | 只检查后再授权 | 逐项核对事实 |
| 退出 | 停用按钮 | 继续手工审阅 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 配置资源未知 | 安装耗时未知 | 可只读 Skill |
| 持续 | 模型费用未知 | 复核耗时未知 | 效果依模型 |
| 恢复 | 重试资源未知 | 对照耗时未知 | 保留原文 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 编辑范围 | 模式和草稿插入可核查 | 事实保真 |

> **思考**：[Q03](#research-q03) 提示词不能强制保证模型保持事实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 让编辑范围和事实约束更明确。

新版 splice，旧版含引用时拒绝覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 提示词不能强制保证模型保持事实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先做只审阅并复核原文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的写作模式、草稿插入与事实保留。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 skills/no-ai-style/SKILL.md、README.md、src/client.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的写作模式、草稿插入与事实保留。未执行目标代码或实际宿主验证。
- 下一步：以学术摘要做盲评

**分析版本**

- **仓库**：[01NGVI-QINGYI/no-ai-style](https://github.com/01NGVI-QINGYI/no-ai-style)
- **版本号**：1.2.2（[固定提交 3da3ef7](https://github.com/01NGVI-QINGYI/no-ai-style/tree/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照只检查模式的越权改写率。

以学术摘要做盲评

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 375 | 335 | 15 | — |
| .md | source | 10 | 918 | — | — | 6925 |
| .mjs | source | 1 | 11 | 9 | 0 | — |
| .md | example | 2 | 61 | — | — | 375 |
| .cjs | source | 1 | 349 | 313 | 15 | — |
| .cjs | test | 1 | 274 | 239 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/01NGVI-QINGYI/no-ai-style/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：写作模式、草稿插入与事实保留

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与直接要求模型润色相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

写作者可以用三种模式区分只审阅、局部修改和据已有材料起草。Skill 把授权和事实边界写清楚，按钮只把指令放进草稿，因此节省的是组织提示词，输出仍取决于模型和编辑者。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/SKILL.md:26-50](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/skills/no-ai-style/SKILL.md#L26-L50)

模式及授权

<details>
<summary>查看原文（25行）</summary>

```text
## How to read this skill

- Gates are ordered priorities, not a checklist. When gates conflict,
  **Gate 2 (truth boundary) always wins**. Gate 3 and Gate 4 defer to
  Gate 1 (reading contract). Gate 5 overrides any earlier change that
  cannot be verified.
- Prefer the smallest edit that satisfies the reading contract. Do not
  fix problems the user did not ask about.
- Open only the reference file needed for the current task.
- Identify a specific reading problem before changing a passage. If no
  relevant problem is present, keep it; editing does not need a quota.

## Decide the operating mode

Infer the mode from the request; do not ask when intent is clear.

| Mode | Trigger | Allowed work | Deliver |
| --- | --- | --- | --- |
| `audit` | inspect, critique, identify problems; ready to submit, final check, publish | Read and report; do not edit source files | Prioritized findings; when readiness is requested, add a verdict and unresolved risks |
| `revise` | polish, humanize, tighten, rewrite, no-ai-style | Edit the authorized passage only | Revised text and a brief change summary |
| `compose` | draft from notes, tables, findings | Write from given material, marking unknowns | Draft with unresolved-evidence notes if needed |

If the user requests only a translation, preserve source meaning,
register, qualifiers, and citations before attempting stylistic
changes. If only a response is needed, do not create or modify files.
```

</details>

**依据 2 · 作者声明**：[README.md:52-60](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/README.md#L52-L60)

作者说明事实标记和输入栏

```text
Two markers enforce factual accountability:
- `[EVIDENCE GAP]` — flags an unsupported claim and blocks `ready` until the missing source or data is supplied.
- `[INTERPRETATION FLAG]` — marks an ambiguous point that requires author confirmation.

## In the composer

The DSH plugin adds a ⭐ **no ai style** button to the composer toolbar. Selecting a mode prepends the matching instruction to your current draft in the active UI language (English, Chinese, or Japanese) while keeping everything you have already typed.

Insertion supports standard undo. If a draft contains file or command references that an older DSH version cannot preserve during text insertion, the plugin skips insertion rather than flattening those references into plain text.
```

#### 缺口

- 无输出对照
  **影响**：不能确认保真程度
  **进一步探讨**：对固定样文比较事实变化

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插入怎样保留草稿引用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

新入口尝试捕获插入状态并在位置 0 做 splice，宿主拒绝或抛错就提示。旧版仅有 setDraft 时先查引用，含引用就不操作，否则拼接普通草稿。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.cjs:190-224](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/src/client.cjs#L190-L224)

插入与失败分支

<details>
<summary>查看原文（35行）</summary>

```text
  const insert = () => {
    if (!selected) return;
    if (input && input.phase && input.phase !== 'plain') {
      setFeedback(t('error.busy'));
      return;
    }
    const draft = input && typeof input.draft === 'string' ? input.draft : '';
    const prefix = t(`prompt.${selected}`);
    const insertion = `${prefix}${draft.length > 0 ? '\n\n' : ''}`;
    const actions = inputActions || {};

    // Newer DSH releases expose a revision-guarded splice. It inserts at [0, 0]
    // and leaves the rest of the draft, including reference chips, intact.
    if (typeof actions.insertText === 'function') {
      let captured = {};
      if (typeof actions.captureInsertion === 'function') {
        try { captured = actions.captureInsertion() || {}; } catch { captured = {}; }
      }
      const span = { ...captured, start: 0, end: 0 };
      // A host action is not this plugin's contract to trust: a throw here would
      // escape the click handler, and React answers that by unmounting the slot
      // entry, taking the composer button with it. A refusal is recoverable.
      let applied = false;
      try {
        applied = actions.insertText(insertion, span) === true;
      } catch {
        setFeedback(t('error.unavailable'));
        return;
      }
      if (!applied) {
        setFeedback(t('error.changed'));
        return;
      }
      dismiss(false);
      return;
```

</details>

**依据 2 · 源码核查**：[src/client.cjs:227-244](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/src/client.cjs#L227-L244)

旧入口的引用保护

<details>
<summary>查看原文（18行）</summary>

```text
    // Older DSH exposes only setDraft, which flattens rich references. Keep
    // ordinary text intact, but refuse that fallback when references are present.
    const occurrences = input && Array.isArray(input.occurrences) ? input.occurrences : [];
    if (occurrences.length > 0) {
      setFeedback(t('error.references'));
      return;
    }
    if (typeof actions.setDraft !== 'function') {
      setFeedback(t('error.unavailable'));
      return;
    }
    try {
      actions.setDraft(`${insertion}${draft}`);
    } catch {
      setFeedback(t('error.unavailable'));
      return;
    }
    dismiss(false);
```

</details>

#### 缺口

- 未测试不同宿主
  **影响**：无法保证撤销和边界
  **进一步探讨**：用文件及命令引用验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 事实保护是程序校验吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

Skill 要求对不确定内容留标记，并选择最小修改。客户端只插文本，没有自动检测引用是否错误或限制模型写权限。对于重要论文，编号、数据与结论仍需逐项复核。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/SKILL.md:28-46](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/skills/no-ai-style/SKILL.md#L28-L46)

提示词约束

<details>
<summary>查看原文（19行）</summary>

```text
- Gates are ordered priorities, not a checklist. When gates conflict,
  **Gate 2 (truth boundary) always wins**. Gate 3 and Gate 4 defer to
  Gate 1 (reading contract). Gate 5 overrides any earlier change that
  cannot be verified.
- Prefer the smallest edit that satisfies the reading contract. Do not
  fix problems the user did not ask about.
- Open only the reference file needed for the current task.
- Identify a specific reading problem before changing a passage. If no
  relevant problem is present, keep it; editing does not need a quota.

## Decide the operating mode

Infer the mode from the request; do not ask when intent is clear.

| Mode | Trigger | Allowed work | Deliver |
| --- | --- | --- | --- |
| `audit` | inspect, critique, identify problems; ready to submit, final check, publish | Read and report; do not edit source files | Prioritized findings; when readiness is requested, add a verdict and unresolved risks |
| `revise` | polish, humanize, tighten, rewrite, no-ai-style | Edit the authorized passage only | Revised text and a brief change summary |
| `compose` | draft from notes, tables, findings | Write from given material, marking unknowns | Draft with unresolved-evidence notes if needed |
```

</details>

**依据 2 · 源码核查**：[src/client.cjs:190-224](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/src/client.cjs#L190-L224)

只做草稿插入

<details>
<summary>查看原文（35行）</summary>

```text
  const insert = () => {
    if (!selected) return;
    if (input && input.phase && input.phase !== 'plain') {
      setFeedback(t('error.busy'));
      return;
    }
    const draft = input && typeof input.draft === 'string' ? input.draft : '';
    const prefix = t(`prompt.${selected}`);
    const insertion = `${prefix}${draft.length > 0 ? '\n\n' : ''}`;
    const actions = inputActions || {};

    // Newer DSH releases expose a revision-guarded splice. It inserts at [0, 0]
    // and leaves the rest of the draft, including reference chips, intact.
    if (typeof actions.insertText === 'function') {
      let captured = {};
      if (typeof actions.captureInsertion === 'function') {
        try { captured = actions.captureInsertion() || {}; } catch { captured = {}; }
      }
      const span = { ...captured, start: 0, end: 0 };
      // A host action is not this plugin's contract to trust: a throw here would
      // escape the click handler, and React answers that by unmounting the slot
      // entry, taking the composer button with it. A refusal is recoverable.
      let applied = false;
      try {
        applied = actions.insertText(insertion, span) === true;
      } catch {
        setFeedback(t('error.unavailable'));
        return;
      }
      if (!applied) {
        setFeedback(t('error.changed'));
        return;
      }
      dismiss(false);
      return;
```

</details>

**依据 3 · 作者声明**：[README.md:52-54](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/README.md#L52-L54)

事实标记说明

```text
Two markers enforce factual accountability:
- `[EVIDENCE GAP]` — flags an unsupported claim and blocks `ready` until the missing source or data is supplied.
- `[INTERPRETATION FLAG]` — marks an ambiguous point that requires author confirmation.
```

#### 缺口

- 未验证模型遵循
  **影响**：不能保证防止误改
  **进一步探讨**：用含边界条件的段落对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先用非敏感摘要走只检查模式，人工看结果，再决定授权润色。支持单装 Skill 或使用 DSH 输入栏。若引用草稿不兼容，保留原文本并手输指令。模型费用、安装和审核时间未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:62-85](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/README.md#L62-L85)

宿主与独立 Skill 路径

<details>
<summary>查看原文（24行）</summary>

````text
## Install

### DeepSeek Harness

**In the app:** Go to **Settings → Plugins**, add `github:01NGVI-QINGYI/no-ai-style`, and restart.

**From the CLI:** Pass your active profile to `--profile` (`web` for `dsh web`, or `desktop` for the desktop app):

```bash
dsh plugin --profile web add github:01NGVI-QINGYI/no-ai-style
```

The plugin registers its own skill provider, making the skill available across all sessions in that profile without modifying your project, custom, or user skill directories.

<details>
<summary><b>Install the skill only (without the composer plugin)</b></summary>

<br>

Run this inside your DSH project directory to install into `.agents/skills`:

```bash
npx skills add 01NGVI-QINGYI/no-ai-style --agent universal --copy
```
````

</details>

**依据 2 · 源码核查**：[src/client.cjs:227-244](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/src/client.cjs#L227-L244)

拒绝降级时保护草稿

<details>
<summary>查看原文（18行）</summary>

```text
    // Older DSH exposes only setDraft, which flattens rich references. Keep
    // ordinary text intact, but refuse that fallback when references are present.
    const occurrences = input && Array.isArray(input.occurrences) ? input.occurrences : [];
    if (occurrences.length > 0) {
      setFeedback(t('error.references'));
      return;
    }
    if (typeof actions.setDraft !== 'function') {
      setFeedback(t('error.unavailable'));
      return;
    }
    try {
      actions.setDraft(`${insertion}${draft}`);
    } catch {
      setFeedback(t('error.unavailable'));
      return;
    }
    dismiss(false);
```

</details>

#### 缺口

- 未运行模型和宿主
  **影响**：效果未知
  **进一步探讨**：先用对照样文及引用附件

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 模式化能减少未经授权的改写吗？

**研究主题**：新假设与验证

#### 完整回答

对照手写润色请求与同样段落的只审阅模式，记录直接改文、删掉限制及错误新增的比例。若错误不减少或人工确认时间增加，维持原审校方式。

#### 证据与依据

**依据 1 · 源码核查**：[skills/no-ai-style/SKILL.md:38-46](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/skills/no-ai-style/SKILL.md#L38-L46)

模式对应授权

```text
## Decide the operating mode

Infer the mode from the request; do not ask when intent is clear.

| Mode | Trigger | Allowed work | Deliver |
| --- | --- | --- | --- |
| `audit` | inspect, critique, identify problems; ready to submit, final check, publish | Read and report; do not edit source files | Prioritized findings; when readiness is requested, add a verdict and unresolved risks |
| `revise` | polish, humanize, tighten, rewrite, no-ai-style | Edit the authorized passage only | Revised text and a brief change summary |
| `compose` | draft from notes, tables, findings | Write from given material, marking unknowns | Draft with unresolved-evidence notes if needed |
```

**依据 2 · 作者声明**：[README.md:52-54](https://github.com/01NGVI-QINGYI/no-ai-style/blob/3da3ef7a19c4da1179c1f91d7c1bab5de8627d4c/README.md#L52-L54)

提示标记

```text
Two markers enforce factual accountability:
- `[EVIDENCE GAP]` — flags an unsupported claim and blocks `ready` until the missing source or data is supplied.
- `[INTERPRETATION FLAG]` — marks an ambiguous point that requires author confirmation.
```

#### 缺口

- 无独立用户数据
  **影响**：收益待测
  **进一步探讨**：以学术摘要做盲评

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
