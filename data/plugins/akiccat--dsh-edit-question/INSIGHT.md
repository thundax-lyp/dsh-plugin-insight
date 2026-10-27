# dsh-edit-question

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[52ec799](https://github.com/Akiccat/dsh-edit-question/tree/52ec799b4ad59f9060647738dfaa092480cd1ca1)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在DSH用户提问旁编辑文本与图片，以官方fork复制前缀并在新会话重发。

> **亮点**：将官方fork与原附件读取组织成编辑重问流程，减少人工复制前缀；不改追加日志，宿主fork为继承能力。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：prompt失败后childId未入状态，重试可能再fork；归档失败仍切换，整个操作非原子，且不撤销后续真实动作。见 [Q03](#research-q03)。

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
  - [Q01 · 分叉编辑解决什么任务？](#detail-section-11)
  - [Q02 · 切点、附件和重发怎样完成？](#detail-section-12)
  - [Q03 · 失败及非图片边界怎样影响采用成本？](#detail-section-13)
  - [Q04 · 可推导何种恢复改进，当前如何试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：早期提问有误时从同一对话前缀重新探索，保留或归档原会话；不回滚现实副作用。

手动fork再编辑/复制历史是直接替代；不把上下文截断当工作区回滚。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分叉重问 | 排除后续对话上下文 | 不回滚真实文件/外部动作 |
| 图片编辑 | 复用原图并补图 | 模型需支持，非图片文件不重发 |
| 原会话归档 | 列表保留新分支 | 是归档非物理删除，失败需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH client sessions/fork/slots/uiWorkspace | 启动必需 | 前缀复制与切换 | 接口不兼容不能重问 |
| 原会话附件授权与图片模型 | 图片必需 | 读原图并新prompt | 不支持会被拒；文件附件不重发 |
| 正确turn timeline/DOM契约 | 切点/入口必需 | 定位问题前缀 | 切点缺失退0，DOM退轮尾 |
| 可恢复原会话和真实状态核对 | 安全重问必需 | 避免误归档/副作用误解 | 默认先保留原会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户隔离会话打开编辑器 | 切点、原文和图片对应目标 |
| 2 | 用户改问并保留原会话重发 | 子会话前缀/新问/图片正确 |
| 3 | 用户注入prompt/归档失败再核对 | 找回原child且无重复分支，否则停用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/附件资源未知 | 挂载、版本与DOM验收 | 避免双重bundle/手工insert |
| 持续使用 | 新回答模型费用与分支存储 | 修改问题、比较结果 | 无节时与金额实测 |
| 失败恢复 | 重复fork/调用可能增加资源 | 找回child、核归档及真实文件 | 操作非事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 重问 | cutSeq/fork/prompt路径 | 实际前缀和图片一致性 |
| 原会话整理 | 可选archive调用 | 失败是否明确反馈 |
| 恢复 | busy防当前重入 | prompt丢响应后不重复fork |

> **思考**：prompt失败后childId未入状态，重试可能再fork；归档失败仍切换，整个操作非原子，且不撤销后续真实动作。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将官方fork与原附件读取组织成编辑重问流程，减少人工复制前缀；不改追加日志，宿主fork为继承能力。见 [Q01](#research-q01)、[Q02](#research-q02)。

官方fork避免直接破坏日志，原会话先读附件合理；分阶段失败需要把childId和投递事实保存在可恢复状态。DOM portal只是入口适配，不应决定核心会话正确性。

<a id="detail-section-5"></a>

### 1.4 主要限制

prompt失败后childId未入状态，重试可能再fork；归档失败仍切换，整个操作非原子，且不撤销后续真实动作。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；先验收原child恢复，正常试验默认保留原会话，已发生副作用须单独核对。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持前缀分叉与图片重发；失败恢复及实际宿主未验证；持久操作状态是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定client/host与README源码核查；未运行安装、会话分叉、附件读取、模型或目标测试，不继承作者E2E为本轮结果。
- 下一步：首轮/多轮/图片/文件/丢响应/归档失败矩阵核对前缀、子会话数量与真实文件状态。

**分析版本**

- **仓库**：[Akiccat/dsh-edit-question](https://github.com/Akiccat/dsh-edit-question)
- **版本号**：0.1.0（[固定提交 52ec799](https://github.com/Akiccat/dsh-edit-question/tree/52ec799b4ad59f9060647738dfaa092480cd1ca1)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的持久分阶段操作与原child核对，可能减少孤立分支/重复调用；四处故障注入测恢复收益。见 [Q04](#research-q04)。

首轮/多轮/图片/文件/丢响应/归档失败矩阵核对前缀、子会话数量与真实文件状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 281 | — | — | 5015 |
| .js | source | 2 | 925 | 651 | 241 | — |
| .mjs | source | 6 | 422 | 358 | 44 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/Akiccat/dsh-edit-question/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编辑提问的分叉重发能否可靠排除后续对话，并保留图片与失败后可恢复性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分叉编辑解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合DSH Web用户发现早期提问有误、希望改写后从同一前缀重新探索的人。合格交付是新会话只继承编辑问题之前的历史，并包含新文本和可支持图片；原会话是否保留/归档由用户选。相对新建会话手工复制历史，增量是自动选择前一轮turn/end切点并复用原图片；相对原地改写日志，采用宿主fork保持追加日志语义。它改变的是模型可见上下文，不回滚此前工具已改的文件或外部动作，所以“丢弃后续”不代表现实状态倒带。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-17](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/README.md#L1-L17)

作者编辑/分叉及切点说明

<details>
<summary>查看原文（17行）</summary>

```text
# dsh-edit-question —— 编辑提问并重发

在 DeepSeek Harness Web GUI 的每条用户提问旁加一个「✎ 编辑提问」入口：改完原文后从这条提问重新开始，
该提问之后的对话不再进入新会话的上下文，界面直接切到新会话。

- **图片兼容**：原提问里的图片会随重发一起带上（内容寻址复用同一个附件，不重复占空间）；也可以在编辑框里**直接粘贴补充图片**。
- **两个出口**：对话框里二选一——保留原会话（新旧并存）或删除原会话（新会话建好后归档原会话，列表里只留新的）。

![编辑提问对话框](https://raw.githubusercontent.com/Akiccat/dsh-edit-question/main/shots/e2e-image-03-dialog.png)

## 为什么是 fork 而不是原地截断

DSH 没有「删除会话中某段历史」的官方能力：会话文件是多帧拼接的 zstd 追加日志（带内核写租约），外部改写会破坏
租约与 seq 连续性；`surfaceOp: replace` 只能让模型「看不见」，记录仍在界面上。所以本插件用官方唯一的「从某点重开」语义
`ctx.sessions.fork({ sessionId, atSeq })` 复制前缀生成子会话，再在子会话里重发编辑后的提问。

切点取**上一轮的 `turn/end`**：第 1 轮用 `0`（原提问自己的 `agent/inbox/spliced` 在 `turn/start` 之前，从它之后开始会把旧提问带进新会话），
```

</details>

**依据 2 · 源码核查**：[lib/client.js:264-282](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L264-L282)

上一完整轮结束切点实现

<details>
<summary>查看原文（19行）</summary>

```text
     * fork 切点。必须是「提问之前的最后一个已完成轮次」的 turn/end 事件 seq：
     * 该边界上 agent inbox 已被消费干净，切点之后的提问不会被继承。
     * 首轮没有可继承的历史，切到 0（只保留会话元信息事件，不含任何提问），
     * 否则会落在提交提问时写入 inbox 的 agent/inbox/spliced 上，使原提问在新会话里再执行一次。
     * @param snapshot - Chat 快照。
     * @param turnId - 轮次号。
     * @returns 切点 seq（找不到上一轮时为 0）。
     */
    function cutSeqOf(snapshot, turnId) {
      if (snapshot === undefined || turnId === undefined) return 0;
      const timeline = snapshot.timeline;
      if (timeline === undefined || !Array.isArray(timeline.turnOrder) || timeline.turns === undefined) return 0;
      const index = timeline.turnOrder.indexOf(turnId);
      if (index > 0) {
        const previous = timeline.turns.get(timeline.turnOrder[index - 1]);
        const end = previous === undefined ? undefined : previous.end;
        if (end !== undefined && typeof end.seq === "number" && end.seq > 0) return end.seq;
      }
      return 0;
```

</details>

#### 缺口

- 宿主fork实际前缀与现实工作区状态未验收
  **影响**：新问题可能面对已改变外部状态
  **进一步探讨**：用带文件写入的隔离案例同时核对会话前缀与文件差异

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 切点、附件和重发怎样完成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件全部行为在client，host空apply只为加载条目。UI在完成轮次slot挂入口，再通过portal移到用户动作行；找不到DOM时仍可轮尾展示。提交先busy防同实例重入，在原会话授权下读取原图片并转base64，再fork指定atSeq，等新会话ready后queue新文本/图片，成功后可archive原会话并打开新会话。切点优先上一轮end，无有效前一轮就0。可借鉴的是通过官方会话前缀操作而非改底层日志、先读原附件再分叉避免引用授权错位。内容寻址存储是否去重由宿主决定，本轮不把README“无额外占空间”当独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/index.js#L1-L10)

host无行为

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

**依据 2 · 源码核查**：[lib/client.js:368-418](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L368-L418)

busy、附件、fork与prompt顺序

<details>
<summary>查看原文（51行）</summary>

```text
        async submit() {
          const state = store.getSnapshot();
          if (state.busy) return;
          const text = state.text.trim();
          const images = state.images;
          const extra = state.extraImages;
          if (text === "" && images.length === 0 && extra.length === 0) return;
          // fork 的 atSeq 必须是真实存在的事件 seq：切点由按钮侧算好，缺失时退化为 0（只继承会话元信息）。
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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:425-435](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L425-L435)

归档后打开新会话

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/client.js:873-888](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L873-L888)

完成轮slot入口

<details>
<summary>查看原文（16行）</summary>

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
          };
        },
      }, EditQuestionAction));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败及非图片边界怎样影响采用成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

最影响可靠性的静态疑点是fork成功后prompt失败：catch只保存错误，childId是submit局部变量，没有写入编辑器状态，也没有打开已创建子会话；再次submit会重新fork。因此注释说“保留childId让用户手动重发”并未在此状态路径落实，可能生成难定位的空分支或重复操作，尚未宿主复现。归档失败只console警告，界面仍切新会话，用户的“只留新的”选择可能未完成。非图片文件不重发、图片需要模型支持、入口依赖DOM契约，均需验收。首次成本是安装/版本接线，持续成本含重新模型回答和分支整理，失败恢复包括找回子会话、核对原是否归档及真实文件状态；金额与人工时未知。不能将分叉成功当整个操作原子成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:405-423](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L405-L423)

childId局部与prompt失败路径

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:425-435](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L425-L435)

归档异常只告警仍打开子会话

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 3 · 作者声明**：[README.md:65-72](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/README.md#L65-L72)

非图片/模型/DOM边界

```text
- 「删除原会话」实际调用的是 DSH 原生**归档**（`uiWorkspace.archiveSession`，没有物理删除会话的接口），可在「已归档」里恢复；
  要彻底删掉得自己清理 `~/.dsh/sessions/` 下对应目录。
- 文件类附件（非图片）不重发：它的上传回执（`receiptId`）只对原会话有效，对话框会单独提示。
- 当前模型需支持图片输入，否则宿主会在 prompt 准入时拒绝并给出提示。
- 入口位置依赖宿主 DOM 契约（`data-chat-flow-kind` / `data-chat-turn` / `data-clock`），宿主改版时会自动退回轮尾一行（功能不受影响）。

## 开发

```

#### 缺口

- prompt响应丢失、归档失败与多次提交未执行
  **影响**：可能重复分叉或误判删除
  **进一步探讨**：注入fork后prompt失败/丢响应，核对列表、消息和重试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可推导何种恢复改进，当前如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是将操作定义为一个持久“已fork childId—已重发—已归档”状态，失败重试优先打开/核对原child而不是重新fork，能减少孤立分支与重复回答。依据Q03局部childId和非事务步骤；需宿主提供可核对的请求/消息身份，不能仅凭promise resolve推断已持久化。最小实验在fork后、prompt前、prompt响应丢失和归档失败四处注入故障，对照当前实现，统计多余子会话、重复模型调用、找回时间和误归档；无改善或状态成本过高则否定。当前建议观察，先验收失败恢复；可用无副作用隔离会话试验正常分叉，默认保留原会话。涉及已修改文件的任务先核对现实状态，不能用改提问撤销动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:405-435](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L405-L435)

可持久化阶段及恢复缺口

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

**依据 2 · 源码核查**：[lib/client.js:272-282](https://github.com/Akiccat/dsh-edit-question/blob/52ec799b4ad59f9060647738dfaa092480cd1ca1/lib/client.js#L272-L282)

切点不足时退0

<details>
<summary>查看原文（11行）</summary>

```text
    function cutSeqOf(snapshot, turnId) {
      if (snapshot === undefined || turnId === undefined) return 0;
      const timeline = snapshot.timeline;
      if (timeline === undefined || !Array.isArray(timeline.turnOrder) || timeline.turns === undefined) return 0;
      const index = timeline.turnOrder.indexOf(turnId);
      if (index > 0) {
        const previous = timeline.turns.get(timeline.turnOrder[index - 1]);
        const end = previous === undefined ? undefined : previous.end;
        if (end !== undefined && typeof end.seq === "number" && end.seq > 0) return end.seq;
      }
      return 0;
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
