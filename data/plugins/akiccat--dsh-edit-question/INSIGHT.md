# 编辑提问并重发

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[02a1c77](https://github.com/Akiccat/dsh-edit-question/tree/02a1c77ab66d6e1236970eb09ca17b70973c66d8)

<!-- BEGIN META -->
[![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-edit-question)
<!-- END META -->

> **功能**：编辑已发送的提问并通过 fork 新会话重发文本和图片。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将已发送提问编辑和前缀 fork 接在现有会话界面；实际效率未对照。

> **主要限制**：[Q03](#research-q03) 文件附件不会重发，发送失败留子会话，归档失败只写控制台，用户需核对结果。

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
  - [Q01 · 用户编辑已发送问题时，相比复制重开增加什么？](#detail-section-11)
  - [Q02 · 如何选择会话前缀并执行重发？](#detail-section-12)
  - [Q03 · 图片、文件以及失败恢复的边界是什么？](#detail-section-13)
  - [Q04 · 使用和退出需要注意什么？](#detail-section-14)
  - [Q05 · 如何降低发送或归档失败后用户误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从已有对话的某次提问重新生成后续内容的 DSH Web 用户。

手工复制此前上下文并在新会话重新提问。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 编辑与 fork | 从选定问题重新开始 | 依赖前一轮有效切点 |
| 图片重发 | 保留或补充图片 | 原图读取失败则停止 |
| 归档原会话 | 保持列表整洁 | 失败仅记控制台；可恢复 |
| 文件附件提示 | 告知不重发 | 文件本身不会携带 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| 兼容 DSH Web 与 React | 运行必需 | 加载客户端 | 功能不可用 |
| sessions 和 workspace API | 提交必需 | fork、发送和归档 | 不能完成流程 |
| 可读的前一轮事件 | 非首轮必需 | 选择正确前缀 | 拦截提交 |
| 原图附件读取权 | 重发图片时 | 复制图片内容 | 读取失败时停止 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 选择 | 用户打开已完成提问编辑器 | 可识别切点及图片 |
| 补历史 | 客户端按需加载前一轮 | 未找到时阻止提交 |
| 重发 | 用户确认原会话选项 | fork 后向子会话发送 |
| 核验 | 用户检查新会话和归档 | 失败时查找残留会话 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | DSH Web 与插件 | 安装和版本核对 | 兼容性未知 |
| 持续 | 模型请求、图片读取 | 编辑并确认附件 | 费用及耗时未知 |
| 故障 | 原会话和子会话 | 检查重复与归档 | 实际恢复耗时未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 保留历史前缀 | 切点与 fork 代码 | 宿主一致性 |
| 重发图片 | 源码按引用读取 | 实际附件兼容 |
| 原会话归档 | 条件调用及失败分支 | 用户发现失败能力 |

> **思考**：[Q03](#research-q03) 文件附件不会重发，发送失败留子会话，归档失败只写控制台，用户需核对结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将已发送提问编辑和前缀 fork 接在现有会话界面；实际效率未对照。

[Q02](#research-q02) 对缺失前一轮设置阻断；[Q03](#research-q03) 发送与归档没有事务性补偿。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文件附件不会重发，发送失败留子会话，归档失败只写控制台，用户需核对结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从非敏感测试会话开始并选保留原会话；确认图片与历史后再考虑使用，异常时先检查子会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本定向静态检查，未运行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查宿主与客户端入口、切点、分页、提交和失败路径；未完整检查 DOM 适配或宿主接口实现。
- 下一步：隔离宿主验证分页、图片、文件、发送失败及归档失败；本轮未执行。

**分析版本**

- **仓库**：[Akiccat/dsh-edit-question](https://github.com/Akiccat/dsh-edit-question)
- **版本号**：0.1.4（[固定提交 02a1c77](https://github.com/Akiccat/dsh-edit-question/tree/02a1c77ab66d6e1236970eb09ca17b70973c66d8)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出暴露子会话与归档状态，并验证重试时是否避免重复。

隔离宿主验证分页、图片、文件、发送失败及归档失败；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 288 | — | — | 5307 |
| .js | source | 2 | 1165 | 819 | 306 | — |
| .mjs | source | 6 | 422 | 358 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Akiccat/dsh-edit-question/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Akiccat/dsh-edit-question/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Akiccat/dsh-edit-question/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查编辑提问的 fork 切点、附件及失败恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户编辑已发送问题时，相比复制重开增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者面向需要修改既有问题并从该点继续对话的 DSH Web 用户；手工复制上下文并新建会话也可完成，但需识别与复制此前历史。本插件在对话轮次提供入口，用 fork 保留前缀再提交改写；其余回答不会进入子会话上下文。是否比手工重开节省时间以及不同宿主兼容性均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/README.md#L1-L7)

使用场景和保留或归档原会话。

```text
# dsh-edit-question —— 编辑提问并重发

在 DeepSeek Harness Web GUI 的每条用户提问旁加一个「✎ 编辑提问」入口：改完原文后从这条提问重新开始，
该提问之后的对话不再进入新会话的上下文，界面直接切到新会话。

- **图片兼容**：原提问里的图片会随重发一起带上（内容寻址复用同一个附件，不重复占空间），在对话框里逐张预览、可单独删掉不想重发的那张；也可以在编辑框里**直接粘贴补充图片**。
- **两个出口**：对话框里二选一——保留原会话（新旧并存）或删除原会话（新会话建好后归档原会话，列表里只留新的）。**默认选中「删除原会话」**，需要留档时手动切回保留。
```

**依据 2 · 源码核查**：[lib/client.js:1111-1148](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L1111-L1148)

轮次入口与对话框插槽。

<details>
<summary>查看原文（38行）</summary>

```text
      // 入口：宿主只在「已完成轮次」的轮尾给我们插槽（owner props 提供 turn/seq/openFile，
      // 会话标准工具包提供 sessionId/useChat/t），按钮再由 portal 搬到该轮提问的动作行里。
      ctx.slots.inject("conversation.chat.turnTail", () => ctx.slots.register({
        name: "conversation.chat.turnTail",
        id: "edit-question",
        order: 20,
        locale: NS,
        inject: (sessionId) => {
          const editor = editorFor(sessionId);
          return {
            hooks: { editor: editor.store },
            openEditor: (input) => { editor.open(input); },
            editDraft: (text) => { editor.edit(text); },
            applyCut: (cut) => { editor.applyCut(cut); },
          };
        },
      }, EditQuestionAction));
      // 对话框：与反馈对话框同处输入区浮层，但通过 portal 渲染到 body。
      ctx.slots.inject("conversation.input.overlay", () => ctx.slots.register({
        name: "conversation.input.overlay",
        id: "edit-question-dialog",
        order: 3,
        locale: NS,
        inject: (sessionId) => {
          const editor = editorFor(sessionId);
          return {
            hooks: { editor: editor.store },
            editDraft: (text) => { editor.edit(text); },
            submitDraft: () => editor.submit(),
            dismissEditor: () => { editor.dismiss(); },
            setRemoveOriginal: (value) => { editor.setRemoveOriginal(value); },
            addImages: (images) => { editor.addImages(images); },
            removeImage: (index) => { editor.removeImage(index); },
            removeOriginalImage: (index) => { editor.removeOriginalImage(index); },
            archiveAvailable: typeof ctx.uiWorkspace.archiveSession === "function",
          };
        },
      }, EditQuestionDialog));
```

</details>

#### 缺口

- 缺少同任务效率和用户频率数据
  **影响**：不能量化优势
  **进一步探讨**：对照手工复制重开记录正确历史与操作时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何选择会话前缀并执行重发？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端计算本轮之前的最后一个 turn/end 作为 fork 点；首轮取 0，缺少前一轮或结束事件时标记问题并阻止提交。提交会先读取原图片，再 fork 新会话并发送文本与图片，成功后按选项归档原会话并打开新会话。分页加载最多尝试 40 次；该防护依赖快照事件、DOM 与宿主 API 的语义，未测试实时竞态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:315-347](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L315-L347)

明确首轮和不完整历史的切点判据。

<details>
<summary>查看原文（33行）</summary>

```text
    /**
     * fork 切点。必须是「提问之前的最后一个已完成轮次」的 turn/end 事件 seq：
     * 该边界上 agent inbox 已被消费干净，切点之后的提问不会被继承。
     * 首轮没有可继承的历史，切到 0（只保留会话元信息事件，不含任何提问），
     * 否则会落在提交提问时写入 inbox 的 agent/inbox/spliced 上，使原提问在新会话里再执行一次。
     *
     * 会话历史是分页加载的（页边界对齐到轮次开始），长会话滚到中间时，「上一轮的 turn/end」
     * 可能还没进快照。此时绝不能退化成 0——0 等于新会话从零开始，会静默丢掉全部历史。
     * 所以返回 issue 让对话框拦截，而不是给出一个看着能用、实际是错的切点。
     * @param snapshot - Chat 快照。
     * @param turnId - 轮次号。
     * @returns 切点与问题标记；issue 为 null 表示切点可信。
     */
    function cutOf(snapshot, turnId) {
      if (snapshot === undefined || turnId === undefined) return { atSeq: 0, issue: "unknown" };
      const timeline = snapshot.timeline;
      if (timeline === undefined || !Array.isArray(timeline.turnOrder) || timeline.turns === undefined) return { atSeq: 0, issue: "unknown" };
      const index = timeline.turnOrder.indexOf(turnId);
      if (index < 0) return { atSeq: 0, issue: "unknown" };
      if (index === 0) {
        // 只有轮次号 1 才是真的首轮：前面本来就没有历史，0 才是正确切点。
        // 长会话按页加载（maxMessages 500 / minTurns 2，页边界切在某一轮的 turn/start 上），
        // 窗口里的第一轮往往不是会话的第一轮，它前面的轮次根本没进快照，切点无从计算。
        return turnId === 1 ? { atSeq: 0, issue: null } : { atSeq: 0, issue: "missingPrevious" };
      }
      const previousTurn = timeline.turnOrder[index - 1];
      const previous = timeline.turns.get(previousTurn);
      // 上一轮整轮都没进快照（分页窗口只加载到本轮）。
      if (previous === undefined) return { atSeq: 0, issue: "missingPrevious" };
      const end = previous.end;
      // 上一轮有节点但没有结束位置：还在生成，或结束事件落在未加载的页里。
      if (end === undefined || typeof end.seq !== "number" || end.seq <= 0) return { atSeq: 0, issue: "missingEnd" };
      return { atSeq: end.seq, issue: null };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:440-468](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L440-L468)

分页加载尝试。

<details>
<summary>查看原文（29行）</summary>

```text
       * 自动补历史的轮询任务：宿主不会给 slot 组件跑 useEffect（实测 effect 一次都不执行），
       * 所以这里不依赖 React 生命周期，直接在打开编辑器时启动，靠轮询 store 状态决定何时停止。
       */
      async function beginAutoLoad() {
        if (loadingHistory) return;
        loadingHistory = true;
        patch({ loadingHistory: true });
        try {
          for (let attempt = 0; attempt < 40; attempt++) {
            const current = store.getSnapshot();
            if (current.open !== true || current.issue === null) break;
            const button = loadEarlierButton();
            if (button === null) {
              scrollChatToTop();
              await wait(600);
              continue;
            }
            console.info(`[dsh-edit-question] auto load earlier (attempt ${String(attempt + 1)})`);
            button.click();
            await wait(1800);
          }
        } catch (error) {
          console.warn("[dsh-edit-question] auto load failed:", error);
        } finally {
          loadingHistory = false;
          const current = store.getSnapshot();
          if (current.open === true) patch({ loadingHistory: false });
          scrollChatToTurn(current.turnId);
        }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:561-630](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L561-L630)

从图片读取到 fork、重发和归档的顺序。

<details>
<summary>查看原文（70行）</summary>

```text
        async submit() {
          const state = store.getSnapshot();
          if (state.busy) return;
          const text = state.text.trim();
          const images = state.images;
          const extra = state.extraImages;
          if (text === "" && images.length === 0 && extra.length === 0) return;
          // 切点不可信时一律不提交：静默从 0 重开会丢掉全部历史，比拒绝提交更糟。
          if (state.issue !== null) return;
          // fork 的 atSeq 必须是真实存在的事件 seq：切点由按钮侧算好；首轮为 0（只继承会话元信息）。
          const atSeq = state.atSeq >= 0 ? state.atSeq : 0;
          if (state.userSeq < 0) {
            patch({ error: { code: "noTarget", detail: "" } });
            return;
          }
          patch({ busy: true, error: null });
          // 补充的图片已经在对话框里读成 base64，直接按 content part 组装。
          const addedParts = extra.map((image) => ({ type: "image", mediaType: image.mediaType, data: image.data }));
          // 原图要在原会话上读：session.attachment 只授权给日志里引用过它的会话，fork 出的新会话还没有这条引用。
          let imageParts = addedParts;
          if (images.length > 0) {
            try {
              const originalParts = await ctx.sessions.using(sessionId, { source: "edit-question" }, async (reference) => {
                const binding = await reference.ready;
                const parts = [];
                for (const image of images) {
                  const result = await binding.session.readAttachment(image.attachmentId);
                  if (result.ok !== true) throw new Error(result.error === undefined ? image.attachmentId : describe(result.error));
                  parts.push({ type: "image", mediaType: image.mediaType, data: base64Of(result.value.data) });
                }
                return parts;
              });
              imageParts = [...originalParts, ...addedParts];
            } catch (error) {
              patch({ busy: false, error: { code: "attachment", detail: describe(error) } });
              console.error("[dsh-edit-question] read attachment failed:", error);
              return;
            }
          }
          let childId;
          try {
            childId = await ctx.sessions.fork({ sessionId, atSeq, increaseTitle: true });
            console.info(`[dsh-edit-question] forked ${sessionId} at seq ${String(atSeq)} -> ${childId}`);
          } catch (error) {
            patch({ busy: false, error: { code: "fork", detail: describe(error) } });
            console.error("[dsh-edit-question] fork failed:", error);
            return;
          }
          try {
            await ctx.sessions.using(childId, { source: "edit-question" }, async (reference) => {
              const binding = await reference.ready;
              await binding.session.prompt([...imageParts, { type: "text", text }], "queue");
            });
          } catch (error) {
            // 会话已经建好，只是首发失败：保留 childId 让用户能在新会话里手动重发。
            patch({ busy: false, error: { code: "prompt", detail: describe(error) } });
            console.error("[dsh-edit-question] prompt failed:", error);
            return;
          }
          // 归档（DSH 没有物理删除会话的接口）失败不影响新会话：只记录告警。
          if (state.removeOriginal && typeof ctx.uiWorkspace.archiveSession === "function") {
            try {
              await ctx.uiWorkspace.archiveSession(sessionId, { stopActivity: true });
              console.info(`[dsh-edit-question] archived original ${sessionId}`);
            } catch (error) {
              console.warn("[dsh-edit-question] archive original failed:", error);
            }
          }
          store.set(CLOSED);
          ctx.uiWorkspace.openSession(childId);
```

</details>

#### 缺口

- 未执行宿主并发、分页和多轮场景
  **影响**：不能保证切点或操作在不同宿主版本正确
  **进一步探讨**：隔离会话对照首轮、缺页、未结束轮次及同时修改。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图片、文件以及失败恢复的边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

原图片按附件引用读取后加入新请求；普通文件附件不会重发，界面有提示。fork 成功后 prompt 抛错会报告错误并留下已建子会话，代码未在错误分支打开该子会话或提供 childId 给用户；重复提交可能再建会话。原会话归档失败只记控制台警告，仍关闭编辑器并打开新会话；因此用户不能把切换新会话当作原会话已归档的证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:214-245](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L214-L245)

提取图片及文件存在标记。

<details>
<summary>查看原文（32行）</summary>

```text
    /**
     * 提取消息里可重发的图片引用。
     * 会话日志里图片分片形如 { type: "image", attachment: { attachmentId, mediaType, width, height, bytes, name } }，
     * attachmentId 是内容寻址的持久引用（sha256:…），重发时读回字节再交给新会话即可复用。
     * @param content - 消息内容分片数组。
     * @returns 图片引用列表（顺序与消息一致）。
     */
    function imageRefsIn(content) {
      const refs = [];
      if (!Array.isArray(content)) return refs;
      for (const part of content) {
        if (part === null || typeof part !== "object" || part.type !== "image") continue;
        const attachment = part.attachment;
        if (attachment === null || typeof attachment !== "object") continue;
        if (typeof attachment.attachmentId !== "string" || attachment.attachmentId === "") continue;
        refs.push({
          attachmentId: attachment.attachmentId,
          mediaType: typeof attachment.mediaType === "string" ? attachment.mediaType : "image/png",
          name: typeof attachment.name === "string" ? attachment.name : "image.png",
        });
      }
      return refs;
    }

    /**
     * 是否含有无法重发的 file 分片（文件回执只对原会话有效）。
     * @param content - 消息内容分片数组。
     * @returns 含 file 分片时为 true。
     */
    function hasFilePart(content) {
      if (!Array.isArray(content)) return false;
      return content.some((part) => part !== null && typeof part === "object" && part.type === "file");
```

</details>

**依据 2 · 源码核查**：[lib/client.js:579-630](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L579-L630)

附件、fork、发送与归档失败分支。

<details>
<summary>查看原文（52行）</summary>

```text
          // 原图要在原会话上读：session.attachment 只授权给日志里引用过它的会话，fork 出的新会话还没有这条引用。
          let imageParts = addedParts;
          if (images.length > 0) {
            try {
              const originalParts = await ctx.sessions.using(sessionId, { source: "edit-question" }, async (reference) => {
                const binding = await reference.ready;
                const parts = [];
                for (const image of images) {
                  const result = await binding.session.readAttachment(image.attachmentId);
                  if (result.ok !== true) throw new Error(result.error === undefined ? image.attachmentId : describe(result.error));
                  parts.push({ type: "image", mediaType: image.mediaType, data: base64Of(result.value.data) });
                }
                return parts;
              });
              imageParts = [...originalParts, ...addedParts];
            } catch (error) {
              patch({ busy: false, error: { code: "attachment", detail: describe(error) } });
              console.error("[dsh-edit-question] read attachment failed:", error);
              return;
            }
          }
          let childId;
          try {
            childId = await ctx.sessions.fork({ sessionId, atSeq, increaseTitle: true });
            console.info(`[dsh-edit-question] forked ${sessionId} at seq ${String(atSeq)} -> ${childId}`);
          } catch (error) {
            patch({ busy: false, error: { code: "fork", detail: describe(error) } });
            console.error("[dsh-edit-question] fork failed:", error);
            return;
          }
          try {
            await ctx.sessions.using(childId, { source: "edit-question" }, async (reference) => {
              const binding = await reference.ready;
              await binding.session.prompt([...imageParts, { type: "text", text }], "queue");
            });
          } catch (error) {
            // 会话已经建好，只是首发失败：保留 childId 让用户能在新会话里手动重发。
            patch({ busy: false, error: { code: "prompt", detail: describe(error) } });
            console.error("[dsh-edit-question] prompt failed:", error);
            return;
          }
          // 归档（DSH 没有物理删除会话的接口）失败不影响新会话：只记录告警。
          if (state.removeOriginal && typeof ctx.uiWorkspace.archiveSession === "function") {
            try {
              await ctx.uiWorkspace.archiveSession(sessionId, { stopActivity: true });
              console.info(`[dsh-edit-question] archived original ${sessionId}`);
            } catch (error) {
              console.warn("[dsh-edit-question] archive original failed:", error);
            }
          }
          store.set(CLOSED);
          ctx.uiWorkspace.openSession(childId);
```

</details>

**依据 3 · 作者声明**：[README.md:67-76](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/README.md#L67-L76)

附件与归档的作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
## 已知限制

- 「删除原会话」实际调用的是 DSH 原生**归档**（`uiWorkspace.archiveSession`，没有物理删除会话的接口），可在「已归档」里恢复；
  要彻底删掉得自己清理 `~/.dsh/sessions/` 下对应目录。
- 文件类附件（非图片）不重发：它的上传回执（`receiptId`）只对原会话有效，对话框会单独提示。
- 当前模型需支持图片输入，否则宿主会在 prompt 准入时拒绝并给出提示。
- 编辑很靠前的轮次时，如果该轮或它的上一轮还没加载进当前分页窗口，插件会自动滚到顶部点「加载更早」把历史补齐，
  补完自动恢复提交；只有自动补不齐时才退回提示手动加载。切点必须落在上一轮的 `turn/end` 上，
  算不出来时宁可拦住，也不会静默把历史丢成「从零开始」。
- 入口位置依赖宿主 DOM 契约（`data-chat-flow-kind` / `data-chat-turn` / `data-clock`），宿主改版时会自动退回轮尾一行（功能不受影响）。
```

</details>

#### 缺口

- 宿主实际错误传播和用户是否能发现残留会话未经验证
  **影响**：无法断定实际重复频率和恢复体验
  **进一步探讨**：在隔离会话注入发送和归档失败，核查列表、错误反馈及重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用和退出需要注意什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

包声明 Node >=20、React 和客户端服务依赖；宿主入口为空，实际功能在 Web 客户端插槽。对话框默认选择归档原会话，归档不是物理删除；普通文件不重发。采用者需确认选择与附件、核对新会话历史及结果；失败后可能需要手动查找新会话。先在不含敏感数据的测试会话选保留原会话试用，若宿主不兼容或附件丢失不能接受则停止。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-63](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/package.json#L38-L63)

Node 与客户端声明。

<details>
<summary>查看原文（26行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "meta": {
    "title": "编辑提问并重发",
    "description": "修改已发送的提问（图片一并重发）并从该提问重新开始：其后的对话不再进入上下文，可选保留或归档原会话。"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-workspace"
      ]
    },
    "manifestVersion": 1
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-client-store": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "react": ">=18",
    "react-dom": ">=18"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-10](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/index.js#L1-L10)

宿主入口为空。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * 「编辑提问并重发」插件的宿主半边。
 *
 * 本插件的全部行为都在浏览器侧完成（读取会话节点 → fork 出截断后的新会话 → 在新会话重发提问），
 * 宿主侧不需要注册任何服务、工具或事件，因此 apply 为空实现；它的存在只是为了在 Loader 里
 * 拥有一个可启用/禁用的条目，浏览器半边通过 package.json 的 dsh.client 声明被自动发现。
 */

/** 宿主条目：无宿主侧行为。 */
export function apply() {}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:102-123](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L102-L123)

默认归档状态。

<details>
<summary>查看原文（22行）</summary>

```text
    /** 关闭态编辑器状态。 */
    const CLOSED = Object.freeze({
      open: false,
      text: "",
      busy: false,
      error: null,
      atSeq: -1,
      userSeq: -1,
      /** 当前编辑的是哪一轮：只有这一轮的按钮组件负责回写切点并自动补历史。 */
      turnId: -1,
      /** 原提问里的图片引用（可重发）。 */
      images: EMPTY_IMAGES,
      /** 对话框里补充的图片：{ mediaType, data(base64), preview(dataURL), name }。 */
      extraImages: EMPTY_IMAGES,
      /** 原提问里是否有无法重发的 file 分片。 */
      files: false,
      issue: null,
      /** 是否正在自动加载更早的对话（对话框据此切换文案）。 */
      loadingHistory: false,
      /** 是否在重发成功后归档原会话（默认归档，可切回保留）。 */
      removeOriginal: true,
    });
```

</details>

**依据 4 · 作者声明**：[README.md:67-76](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/README.md#L67-L76)

归档和文件附件限制。

<details>
<summary>查看原文（10行）</summary>

```text
## 已知限制

- 「删除原会话」实际调用的是 DSH 原生**归档**（`uiWorkspace.archiveSession`，没有物理删除会话的接口），可在「已归档」里恢复；
  要彻底删掉得自己清理 `~/.dsh/sessions/` 下对应目录。
- 文件类附件（非图片）不重发：它的上传回执（`receiptId`）只对原会话有效，对话框会单独提示。
- 当前模型需支持图片输入，否则宿主会在 prompt 准入时拒绝并给出提示。
- 编辑很靠前的轮次时，如果该轮或它的上一轮还没加载进当前分页窗口，插件会自动滚到顶部点「加载更早」把历史补齐，
  补完自动恢复提交；只有自动补不齐时才退回提示手动加载。切点必须落在上一轮的 `turn/end` 上，
  算不出来时宁可拦住，也不会静默把历史丢成「从零开始」。
- 入口位置依赖宿主 DOM 契约（`data-chat-flow-kind` / `data-chat-turn` / `data-clock`），宿主改版时会自动退回轮尾一行（功能不受影响）。
```

</details>

#### 缺口

- 实际宿主版本及恢复成本未实测
  **影响**：不能保证重发和回退可靠
  **进一步探讨**：固定宿主版本试验保留、归档、图片和文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低发送或归档失败后用户误判？

**研究主题**：新假设与验证

#### 完整回答

现有发送失败留下子会话，归档失败仅写控制台；可假设在界面显示子会话链接和归档结果，并在重试时复用已创建子会话，能减少重复会话和错误预期。该方案未实现或验证；用故障注入对照原方案与新方案，统计重复会话、成功恢复率和人工步骤，若无改善或引入重复发送则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:600-630](https://github.com/Akiccat/dsh-edit-question/blob/02a1c77ab66d6e1236970eb09ca17b70973c66d8/lib/client.js#L600-L630)

已创建会话后两个失败路径。

<details>
<summary>查看原文（31行）</summary>

```text
          let childId;
          try {
            childId = await ctx.sessions.fork({ sessionId, atSeq, increaseTitle: true });
            console.info(`[dsh-edit-question] forked ${sessionId} at seq ${String(atSeq)} -> ${childId}`);
          } catch (error) {
            patch({ busy: false, error: { code: "fork", detail: describe(error) } });
            console.error("[dsh-edit-question] fork failed:", error);
            return;
          }
          try {
            await ctx.sessions.using(childId, { source: "edit-question" }, async (reference) => {
              const binding = await reference.ready;
              await binding.session.prompt([...imageParts, { type: "text", text }], "queue");
            });
          } catch (error) {
            // 会话已经建好，只是首发失败：保留 childId 让用户能在新会话里手动重发。
            patch({ busy: false, error: { code: "prompt", detail: describe(error) } });
            console.error("[dsh-edit-question] prompt failed:", error);
            return;
          }
          // 归档（DSH 没有物理删除会话的接口）失败不影响新会话：只记录告警。
          if (state.removeOriginal && typeof ctx.uiWorkspace.archiveSession === "function") {
            try {
              await ctx.uiWorkspace.archiveSession(sessionId, { stopActivity: true });
              console.info(`[dsh-edit-question] archived original ${sessionId}`);
            } catch (error) {
              console.warn("[dsh-edit-question] archive original failed:", error);
            }
          }
          store.set(CLOSED);
          ctx.uiWorkspace.openSession(childId);
```

</details>

#### 缺口

- 方案对重复发送及竞态的影响未知
  **影响**：不能宣称其可安全恢复
  **进一步探讨**：模拟 prompt 失败、超时成功及归档拒绝进行对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
