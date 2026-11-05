# 提示词与错误经验面板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[efc5bd3](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/efc5bd3095aac9444374f259a67123aa8a9b12a8)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)
<!-- END META -->

> **功能**：在会话标题栏编辑全局和会话提示词，并审核模型自报错误的经验草稿。

> **亮点**：[Q01](#research-q01) 把错误草稿和提示管理接进宿主。

> **主要限制**：[Q03](#research-q03) 模型自述有误判，状态并发写也需验证。

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
  - [Q01 · 错误草稿比手工维护多了什么？](#detail-section-11)
  - [Q02 · 确认草稿后如何进入提示？](#detail-section-12)
  - [Q03 · 如何看待错误经验的可靠性和并发？](#detail-section-13)
  - [Q04 · 怎样先用并有退路？](#detail-section-14)
  - [Q05 · 标记经验来源是否减少错误采纳？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 Agent 提示及错误经验的操作者可先审核模型草稿。

手工笔记控制精细但需整理和注入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提示编辑 | 按会话应用指令 | 依赖 scope |
| 经验草稿 | 提取待审教训 | 模型自报需核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容宿主 | 必需 | 注册注入和事件 | 回手工 |
| 本地状态文件 | 必需 | 保存经验 | 写入失败需排查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 独立 profile | 用合成材料 |
| 确认 | 比较两个会话 | 只采纳核实项 |
| 退出 | 暂停或移除 | 保留原提示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置耗时未知 | 依赖宿主 |
| 持续 | 模型开销未知 | 审阅耗时未知 | 内容重复进入上下文 |
| 恢复 | 恢复资源未知 | 排障耗时未知 | 并发未验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 经验循环 | 草稿与正式库区分 | 复发率和审核效果 |

> **思考**：[Q03](#research-q03) 模型自述有误判，状态并发写也需验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把错误草稿和提示管理接进宿主。

待确认按 ID 操作，去重并限制队列。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型自述有误判，状态并发写也需验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只采用经核实的合成教训。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的经验捕获、人工采纳及提示注入。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的经验捕获、人工采纳及提示注入。未执行目标代码或实际宿主验证。
- 下一步：固定真错、引用和未完成三类样本

**分析版本**

- **仓库**：[1015677515/dsh-prompt-ErrorNotes-desk](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)
- **版本号**：1.3.1（[固定提交 efc5bd3](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/tree/efc5bd3095aac9444374f259a67123aa8a9b12a8)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较可追溯提示对审核的帮助。

固定真错、引用和未完成三类样本

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1145 | — | — | 16169 |
| .js | source | 2 | 3262 | 1533 | 1506 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经验捕获、人工采纳及提示注入

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 错误草稿比手工维护多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常处理重复 Agent 错误的人可以让插件从已完成的回复流提取符合格式的草稿。流开始清空缓存，文本增量累计，abandoned 跳过。它发现的是模型表述，不是任务错误的独立检测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-18](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/README.md#L11-L18)

作者描述面板

```text
## 它做什么

| 面板 | 作用 |
|---|---|
| **提示词** | 编辑**跨对话**的全局提示词，以及**只对本对话生效**的提示词（每个对话一个 Markdown 文件，切换对话即切换提示词，互不影响）。面板顶部显示哪一半当前正在生效。 |
| **错误库** | **按分类**归纳反复犯的错误：每条一个简短类型 + 一句教训，归入三档分类之一。**最近 10 条（条数可自己设）会被注入系统提示词**，让后续对话以极低的 token 成本吸取教训。agent 按格式汇报「我犯了个错误：错误经过：… 教训：…」时会被自动捕获成待确认草稿。 |

第二个面板的意义：一个反复犯同类错误的 agent，会在自己的上下文里收到一份简短的、按分类归好的提醒，成本远低于重新踩一遍坑再发现。
```

**依据 2 · 源码核查**：[index.js:1694-1723](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1694-L1723)

流缓冲和捕获

<details>
<summary>查看原文（30行）</summary>

```text
      const agentKey = payload.agent.id;

      if (payload.frame.type === 'start') {
        // Reset buffer for this stream attempt. Multiple starts before an end
        // shouldn't happen, but if they do, the latest start wins.
        streamBuffers.set(agentKey, []);
        return;
      }

      if (payload.frame.type === 'chunk' && payload.frame.chunk.type === 'text-delta') {
        const buf = streamBuffers.get(agentKey);
        if (buf !== undefined) buf.push(payload.frame.chunk.text);
        return;
      }

      if (payload.frame.type === 'end') {
        const buf = streamBuffers.get(agentKey);
        streamBuffers.delete(agentKey);
        if (buf === undefined || buf.length === 0) return;

        // Abandoned — the output never reached the conversation, skip it.
        if (payload.frame.outcome.kind === 'abandoned') return;

        const fullText = buf.join('');
        const draft = parseConfession(fullText);
        if (draft !== null) queuePending(draft);
      }
    } catch {
      // A listener failure must not break the event dispatch.
    }
```

</details>

#### 缺口

- 未对照实际错误与草稿
  **影响**：无法推断召回率
  **进一步探讨**：标注真实错误及自述片段

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 确认草稿后如何进入提示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

采纳按 ID 查找待确认项，结合用户修改字段，清洗后移入经验库。提示 section 根据 assembly scope 取 session ID，因此可为不同会话读取相应内容。待确认和正式库是不同状态。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1180-1206](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1180-L1206)

确认和删除分支

<details>
<summary>查看原文（27行）</summary>

```text
    // Move a confirmed draft into the library, carrying whatever the user edited.
    if (patch.pendingAccept !== null && typeof patch.pendingAccept === 'object') {
      const id = patchText(patch.pendingAccept.id);
      const index = id === undefined ? -1 : state.pending.findIndex((item) => item.id === id);
      if (index >= 0) {
        const draft = state.pending[index];
        state.pending.splice(index, 1);
        const entry = sanitizeEntry({
          date: draft.date,
          category: patchText(patch.pendingAccept.category) ?? draft.category,
          type: patchText(patch.pendingAccept.type) ?? draft.type,
          lesson: patchText(patch.pendingAccept.lesson) ?? draft.lesson,
          detail: patchText(patch.pendingAccept.detail) ?? draft.detail,
          source: 'auto',
        });
        if (entry !== null) state.errors.push(entry);
      }
    }

    if (typeof patch.pendingDelete === 'string') {
      state.pending = state.pending.filter((item) => item.id !== patch.pendingDelete);
    }

    if (patch.pendingClear === true) state.pending = [];
  }
  saveState(state);
  return currentState(configLimit, { sessionId });
```

</details>

**依据 2 · 源码核查**：[index.js:1497-1526](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1497-L1526)

提示 section 和会话范围

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.inject(['systemPrompt'], (scope) => {
    scope.systemPrompt.section({
      name: 'prompt-desk:mistakes-and-instructions',
      /*
       * Placement: after every first-party section.
       *
       * `10200` is the harness's own deployment persona suffix, and equal orders
       * are tie-broken by section name in code-unit order. That happened to put
       * this section last (`deployment…` < `prompt-desk…`), but it was luck: the
       * correct position depended on this plugin's name staying alphabetically
       * after a harness-owned one. Renaming it — a cosmetic change — would have
       * silently moved the block into the middle of the prompt.
       *
       * `10300` is past the last first-party slot (`10200`) and past the
       * documented external range, so the position no longer depends on any
       * other section's name.
       */
      order: 10300,
      text: (context) => {
        /*
         * Resolve the session id from the assembler's context.
         *
         * The assembler hands this callback an `AssembleContext` whose `scope`
         * is the agent currently being assembled, and its `id` is the session
         * id (`agent.id === session.id`, enforced by an invariant in
         * `@deepseek-ai/dsh-agent`). That is what lets one registered section
         * render a different prompt for each conversation, instead of one
         * global value reaching every one of them.
         */
        const sessionId = context && context.scope ? context.scope.id : '';
```

</details>

#### 缺口

- 未实测宿主 scope
  **影响**：可能有版本适配差异
  **进一步探讨**：两会话同时检查注入文本

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何看待错误经验的可靠性和并发？

**研究主题**：缺陷与关键质疑

#### 完整回答

草稿以类型和教训去重并裁剪。写入前重新读取可缩小冲突窗口，但没有文件锁，不能据此保证跨进程不丢更新。正式经验会影响后续上下文，因此错误归因或含敏感信息的文本需要在采纳前核对。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1433-1457](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1433-L1457)

刷新、去重和裁剪

<details>
<summary>查看原文（25行）</summary>

```text
function queuePending(draft) {
  /*
   * Read as late as possible, and write the fresh document.
   *
   * This is a read-modify-write, and two writers genuinely overlap: the Host
   * appends a draft from the assistant stream while the user saves in the panel.
   * The failure mode is silent and destructive — whichever writer read first
   * loses its change to whichever wrote last, with no error and no symptom until
   * an entry turns up missing.
   *
   * `applyPatch` has the same shape but reads on entry and writes on exit, so
   * its window is that whole call. Here the window is one read followed
   * immediately by one write with nothing awaited in between, which is as small
   * as this can get without file locking. Locking is not worth it for a queue
   * capped at `MAX_PENDING` review drafts; shrinking the window is the
   * proportionate fix, and re-reading here (rather than reusing a document read
   * during assembly) is what makes that true.
   */
  const state = readState();
  const key = (entry) => `${entry.type}\u0000${entry.lesson}`;
  if (state.pending.some((entry) => key(entry) === key(draft))) return false;
  state.pending.push(sanitizeEntry(draft));
  state.pending = state.pending.slice(-MAX_PENDING);
  saveState(state);
  return true;
```

</details>

**依据 2 · 作者声明**：[README.md:13-18](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/README.md#L13-L18)

后续提示重用

```text
| 面板 | 作用 |
|---|---|
| **提示词** | 编辑**跨对话**的全局提示词，以及**只对本对话生效**的提示词（每个对话一个 Markdown 文件，切换对话即切换提示词，互不影响）。面板顶部显示哪一半当前正在生效。 |
| **错误库** | **按分类**归纳反复犯的错误：每条一个简短类型 + 一句教训，归入三档分类之一。**最近 10 条（条数可自己设）会被注入系统提示词**，让后续对话以极低的 token 成本吸取教训。agent 按格式汇报「我犯了个错误：错误经过：… 教训：…」时会被自动捕获成待确认草稿。 |

第二个面板的意义：一个反复犯同类错误的 agent，会在自己的上下文里收到一份简短的、按分类归好的提醒，成本远低于重新踩一遍坑再发现。
```

#### 缺口

- 未测跨进程写入
  **影响**：不能保证无丢更新
  **进一步探讨**：以两个隔离进程并发改动测试文件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样先用并有退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在独立 profile 用合成错误练习确认、编辑和丢弃，确认范围后再保留少量经验。可暂停注入，必要时移除包或回手工笔记。历史资料的副本和模型输入成本另行核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-34](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/README.md#L24-L34)

暂停、预览与发布

<details>
<summary>查看原文（11行）</summary>

```text
**错误经验库** —— 按分类折叠，每条带下拉框可改类；顶部显示注入条数，底部是自动捕获的待确认草稿：

![错误经验库面板](picture/errornotes.png)

**提示词** —— 顶部自检状态与「临时暂停注入」，中间是全局与本次对话提示词，底部是实际注入文本的预览（可拖拽调高，也可隐藏；三个框都能竖向拖动）：

![提示词面板](picture/prompt.png)

## 安装

本插件目前只发布在 GitHub（未发布到 npm）。
```

</details>

**依据 2 · 作者声明**：[README.md:38-54](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/README.md#L38-L54)

安装说明

<details>
<summary>查看原文（17行）</summary>

````text
### 方式一：应用内安装（推荐）

**设置 → 插件 → 安装**，在输入框里填 GitHub 短地址：

```
github:1015677515/dsh-prompt-ErrorNotes-desk
```

也可以填完整网址：

```
https://github.com/1015677515/dsh-prompt-ErrorNotes-desk
```

安装界面提示「输入插件的包名、GitHub 仓库地址或本地目录路径」，上面两种都是它接受的写法。

**不需要自己写 commit SHA。** 填不带版本后缀的短地址即可：市场会先把默认分支的 HEAD 解析成 40 位 commit SHA，再把 `github:owner/repo#<sha>` 这种已固定的形式交给 pnpm。这样 lockfile 里记录的是可追溯的提交，安装后**版本号能正常显示**。
````

</details>

**依据 3 · 源码核查**：[index.js:1180-1206](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1180-L1206)

采纳和删除

<details>
<summary>查看原文（27行）</summary>

```text
    // Move a confirmed draft into the library, carrying whatever the user edited.
    if (patch.pendingAccept !== null && typeof patch.pendingAccept === 'object') {
      const id = patchText(patch.pendingAccept.id);
      const index = id === undefined ? -1 : state.pending.findIndex((item) => item.id === id);
      if (index >= 0) {
        const draft = state.pending[index];
        state.pending.splice(index, 1);
        const entry = sanitizeEntry({
          date: draft.date,
          category: patchText(patch.pendingAccept.category) ?? draft.category,
          type: patchText(patch.pendingAccept.type) ?? draft.type,
          lesson: patchText(patch.pendingAccept.lesson) ?? draft.lesson,
          detail: patchText(patch.pendingAccept.detail) ?? draft.detail,
          source: 'auto',
        });
        if (entry !== null) state.errors.push(entry);
      }
    }

    if (typeof patch.pendingDelete === 'string') {
      state.pending = state.pending.filter((item) => item.id !== patch.pendingDelete);
    }

    if (patch.pendingClear === true) state.pending = [];
  }
  saveState(state);
  return currentState(configLimit, { sessionId });
```

</details>

#### 缺口

- 未安装宿主
  **影响**：不知道维护与撤除成本
  **进一步探讨**：测试 profile 先验证暂停和两个会话

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 标记经验来源是否减少错误采纳？

**研究主题**：新假设与验证

#### 完整回答

对照现有草稿与显示原会话位置和模型自述标识的版本，让审核者在合成材料中区分真实错误和引用示例。测误采纳、时间和干扰；若不改善则不增加记录。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1694-1719](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1694-L1719)

来源来自助手文本

<details>
<summary>查看原文（26行）</summary>

```text
      const agentKey = payload.agent.id;

      if (payload.frame.type === 'start') {
        // Reset buffer for this stream attempt. Multiple starts before an end
        // shouldn't happen, but if they do, the latest start wins.
        streamBuffers.set(agentKey, []);
        return;
      }

      if (payload.frame.type === 'chunk' && payload.frame.chunk.type === 'text-delta') {
        const buf = streamBuffers.get(agentKey);
        if (buf !== undefined) buf.push(payload.frame.chunk.text);
        return;
      }

      if (payload.frame.type === 'end') {
        const buf = streamBuffers.get(agentKey);
        streamBuffers.delete(agentKey);
        if (buf === undefined || buf.length === 0) return;

        // Abandoned — the output never reached the conversation, skip it.
        if (payload.frame.outcome.kind === 'abandoned') return;

        const fullText = buf.join('');
        const draft = parseConfession(fullText);
        if (draft !== null) queuePending(draft);
```

</details>

**依据 2 · 源码核查**：[index.js:1180-1195](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/blob/efc5bd3095aac9444374f259a67123aa8a9b12a8/index.js#L1180-L1195)

用户确认采纳

<details>
<summary>查看原文（16行）</summary>

```text
    // Move a confirmed draft into the library, carrying whatever the user edited.
    if (patch.pendingAccept !== null && typeof patch.pendingAccept === 'object') {
      const id = patchText(patch.pendingAccept.id);
      const index = id === undefined ? -1 : state.pending.findIndex((item) => item.id === id);
      if (index >= 0) {
        const draft = state.pending[index];
        state.pending.splice(index, 1);
        const entry = sanitizeEntry({
          date: draft.date,
          category: patchText(patch.pendingAccept.category) ?? draft.category,
          type: patchText(patch.pendingAccept.type) ?? draft.type,
          lesson: patchText(patch.pendingAccept.lesson) ?? draft.lesson,
          detail: patchText(patch.pendingAccept.detail) ?? draft.detail,
          source: 'auto',
        });
        if (entry !== null) state.errors.push(entry);
```

</details>

#### 缺口

- 缺审核者对照
  **影响**：增量未知
  **进一步探讨**：固定真错、引用和未完成三类样本

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
