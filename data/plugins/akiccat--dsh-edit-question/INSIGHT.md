# dsh-edit-question

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c0705c1](https://github.com/Akiccat/dsh-edit-question/tree/c0705c19a881e9f5d606d9f67d20cd537469db88)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH Web 编辑轮首提问、保留图片并 fork 新会话重发，可选择归档原会话。

> **核心亮点**：把前缀fork、文本编辑、原图搬运和会话导航组合为一个修正入口，减少人工重组上下文；底层fork归属宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：prompt失败后新分支未暴露为恢复状态，再试可能再fork；非首轮缺end直接退0也可能缩掉应保留前缀。参见[Q02](#research-q02)、[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要编辑旧提问，fork相对复制到新会话增加什么？](#detail-section-11)
  - [Q02 · 如何定位切点、搬运图片和处理部分失败？](#detail-section-12)
  - [Q03 · 何时不能宣称无损编辑，兼容依赖是什么？](#detail-section-13)
  - [Q04 · 采用成本、可控试用和可证伪改进是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向修正多轮旧提问的Web用户；合格结果是保留有效前缀、改文与原图成为新轮，后续不进入新上下文。仅适合允许保留历史的任务，不满足彻底删除敏感内容的要求。

简单参照为手工新建会话并复制有效上下文/重新上传图片；本组件省搬运，但不物理截断或删除历史。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 编辑并fork | 修正多轮旧提问 | 仅轮首；切点须完整 |
| 图片重发 | 复用原图、补图 | 模型支持；不搬file回执 |
| 可选归档 | 整理旧会话 | 可恢复归档，非物理删除 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Web加载器、React/store | 启动必需 | 界面和编辑状态 | 无界面，人工新建 |
| slots/sessions/uiWorkspace/locale | 操作必需 | 分支、发送和导航 | 保留原会话，定位失败阶段 |
| 附件授权、图像模型 | 图片操作必需 | 读图和准入 | 文本重建或重新上传 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户挂载并刷新 | 仅一处插件id，出现入口 |
| 2 | 用户编辑轮首提问 | 核文本/原图/文件提示，选保留原件 |
| 3 | 插件读图、fork、prompt | 新分支正确出现；失败查已建分支 |
| 4 | 用户验收前缀与回答 | 确认后再考虑归档 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 源码与客户端资源，金额未知 | 挂载、刷新、检查依赖 | npm可安装状态未独立核验 |
| 持续使用 | 图片base64、fork存储、新轮模型 | 编辑并核前缀与图片 | 无延迟/金额测量 |
| 失败恢复 | 可能多余分支与重发 | 找新会话、清理/重发、恢复归档 | 非事务且恢复步数未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 前缀保留 | 按上一轮end fork | 时间线不全时的保真 |
| 图片重发 | 原会话授权读回并prompt | 宿主/模型准入及大图资源 |
| 恢复 | 原会话默认保留、归档可恢复 | prompt失败的幂等重试 |

> **思考**：prompt失败后新分支未暴露为恢复状态，再试可能再fork；非首轮缺end直接退0也可能缩掉应保留前缀。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把前缀fork、文本编辑、原图搬运和会话导航组合为一个修正入口，减少人工重组上下文；底层fork归属宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

把前缀fork、文本编辑、原图搬运和会话导航组合为一个修正入口，减少人工重组上下文；底层fork归属宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

可复用的是前轮end切点、先取附件再fork与成功后归档的顺序，以及MutationObserver经animationFrame合并并清理。移植需宿主时间线和附件授权语义；prompt失败缺可见childId使恢复仍需人工，详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

prompt失败后新分支未暴露为恢复状态，再试可能再fork；非首轮缺end直接退0也可能缩掉应保留前缀。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保留原会话，先以非敏感文本/图片小任务试用，核对首轮与中间轮前缀；含文件、删除敏感历史或切点不明时停止。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

分支重发、图像读回和可选归档有源码支持；无损恢复与缺失切点有边界，改进收据未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查README、package与客户端关键数据流；未复验宿主/模型，未全面审计所有样式或作者E2E。
- 下一步：未运行目标。隔离核首轮、中间轮、缺end、文件/图片、prompt拒绝与归档失败，记录前缀和重复分支。

**分析版本**

- **仓库**：[Akiccat/dsh-edit-question](https://github.com/Akiccat/dsh-edit-question)
- **版本号**：0.1.0（[固定提交 c0705c1](https://github.com/Akiccat/dsh-edit-question/tree/c0705c19a881e9f5d606d9f67d20cd537469db88)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为持久化分支操作收据并复用childId重试，同时非首轮缺切点显式阻断；以故障注入比较重复分支和前缀保真。参见[Q04](#research-q04)。

未运行目标。隔离核首轮、中间轮、缺end、文件/图片、prompt拒绝与归档失败，记录前缀和重复分支。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 281 | — | — | 5015 |
| .js | source | 2 | 925 | 651 | 241 | — |
| .mjs | source | 6 | 422 | 358 | 44 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Akiccat/dsh-edit-question/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本编辑重发是否正确隔离后续上下文，如何保留图片并处理分支失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要编辑旧提问，fork相对复制到新会话增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要修正多轮推理中的旧提问、又想保留此前有效上下文的 Web 用户是主要人群。合格结果是前缀保留，旧提问及其后续不进入新上下文，编辑后的文本/原图成为新一轮输入；原会话仍可检查。相比手工新建并拷贝历史，增量是选择轮次、确定前缀、搬运图片和切换分支的一体化接线。

作者称“丢弃后续”，源码实际借用 sessions.fork 创建子会话，没有原地删除历史。它把不可安全改写的追加日志转换成显式分支工作流，这是业务流程便利，底层 fork 并非插件原创。若目的为彻底删除敏感内容，该机制不合格；原会话与宿主存储依然存在。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-18](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/README.md#L1-L18)

作者说明输入、两个出口与fork语义。

<details>
<summary>查看原文（18行）</summary>

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
第 N>1 轮用第 N-1 轮结束的 seq。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:405-435](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L405-L435)

实际创建新会话、重发、可选归档。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何定位切点、搬运图片和处理部分失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端通过轮次快照选择首条 user 节点，cutSeqOf 取前一轮 turn/end.seq；首轮返回0，避免把原 inbox 提问带入子会话。图片先在原会话权限内逐个 readAttachment，再编码成 image part；新图直接合入。读取成功才 fork，随后在 childId 上 prompt，成功后才可选归档原会话并导航。宿主 apply 为空，能力全部依赖客户端注入。

先读图片再创建会话可避免附件读取失败留下空分支；归档放发送之后有利于保留恢复原件。DOM portal 与轮尾回退是可借鉴的界面适配，MutationObserver 用 animationFrame 合并并在卸载清理。关键不完整点是 prompt 失败后 childId 只留在函数局部与日志，store 仅保存错误；注释声称保留供手工重发，但没有展示子会话定位或幂等重试入口，再点提交会重新 fork。此为源码可见恢复设计缺口，不声称已经复现重复会话。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:272-282](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L272-L282)

切点取上一轮end，缺失退0。

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

**依据 2 · 源码核查**：[lib/client.js:368-435](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L368-L435)

顺序和失败分支。

<details>
<summary>查看原文（68行）</summary>

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

**依据 3 · 源码核查**：[lib/client.js:234-258](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L234-L258)

DOM订阅合并与清理。

<details>
<summary>查看原文（25行）</summary>

```text
    function useActionRow(turnId) {
      const [row, setRow] = react.useState(null);
      react.useEffect(() => {
        if (turnId === undefined) return undefined;
        let current = null;
        let frame = 0;
        const settle = () => {
          if (current !== null && current.isConnected) return;
          const next = findActionRow(turnId);
          current = next;
          setRow((previous) => (previous === next ? previous : next));
        };
        settle();
        const observer = new MutationObserver(() => {
          if (frame !== 0) return;
          frame = window.requestAnimationFrame(() => {
            frame = 0;
            settle();
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => {
          observer.disconnect();
          if (frame !== 0) window.cancelAnimationFrame(frame);
        };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1-10](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/index.js#L1-L10)

宿主无服务行为。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时不能宣称无损编辑，兼容依赖是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

边界首先是文件附件。源码只提取 image 引用，file 分片仅用于提示，不会跨会话重发，合格任务必须明确允许丢弃文件或由用户重新上传。其次 cutSeqOf 在 timeline/前轮end缺失时直接返回0；这对首轮合理，但对后续轮缺失信息可能丢掉本应继承的全部上下文，当前没有显式阻断或让用户确认前缀。

UI 只编辑每轮首条 user，而不是该轮排队插话的任意消息。DOM选择器没有sessionId范围，跨同屏会话/虚拟化是否始终正确归属仍需验证。依赖包括浏览器模块加载器、React/store、slots/sessions/uiWorkspace/locale 服务、附件授权和图像模型准入。package将peer标optional不代表这些模块运行时可缺失。作者文档报告了本机脚本与截图，本轮只当作者验证记录；没有复验当前宿主。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:129-145](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L129-L145)

只定位轮首用户节点。

<details>
<summary>查看原文（17行）</summary>

```text
     * 找出该轮的开场提问节点（Chat 快照里 kind === "user" 的第一个节点）。
     * @param snapshot - Chat 快照。
     * @param turnId - 轮次号。
     * @returns 用户消息节点，找不到时 undefined。
     */
    function openingUserNode(snapshot, turnId) {
      if (snapshot === undefined || turnId === undefined) return undefined;
      const locations = snapshot.locations;
      const nodes = snapshot.nodes;
      if (locations === undefined || nodes === undefined) return undefined;
      const keys = locations.getTurn(turnId);
      if (!Array.isArray(keys)) return undefined;
      for (const key of keys) {
        const node = nodes.get(key);
        if (node !== undefined && node.kind === "user") return node;
      }
      return undefined;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:169-193](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L169-L193)

图片提取与文件提示分离。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/client.js:221-225](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L221-L225)

DOM按轮定位未加会话域。

```text
    function findActionRow(turnId) {
      if (turnId === undefined) return null;
      const item = document.querySelector(`[data-chat-flow-kind="user"][data-chat-turn="${String(turnId)}"]`);
      if (item === null || item.hasAttribute("hidden")) return null;
      return item.querySelector("[data-clock=\"start\"]");
```

**依据 4 · 源码核查**：[lib/client.js:272-282](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L272-L282)

不完整时间线退0。

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

**依据 5 · 源码核查**：[lib/client.js:24-26](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L24-L26)

实际require客户端模块。

```text
    const react = require("react");
    const reactDom = require("react-dom");
    const { createSnapshotStore } = require("@deepseek-ai/dsh-client-store");
```

#### 缺口

- 当前宿主压缩后时间线与同屏会话定位未验
  **影响**：可能使继承前缀或入口归属不符预期
  **进一步探讨**：在隔离宿主构造缺end、排队插话、双会话和虚拟化四类样例，核对fork日志与消息前缀

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用成本、可控试用和可证伪改进是什么？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

首次投入是按固定源码手工挂载并核客户端依赖，作者README称npm尚未发布，不能把示例命令当可安装证据。持续投入为编辑、图片读回/base64驻留、fork前缀存储以及新一轮模型响应，现金和延迟依宿主/模型，当前无测量。失败恢复须查新分支是否已创建、手动重发或清理空分支，归档可恢复但不物理删除。

由部分成功边界推导的未验证假设是保存操作收据{source,cut,childId,promptState}并让失败重试复用已建分支，同时对非首轮缺end拒绝自动退0。它可能把“分支已建/已发/已归档”的责任明确给用户，代价是收据状态与过期清理。最小验证注入prompt拒绝、归档失败和缺end，比较重复分支数、前缀保真与恢复操作次数；若仍重复创建或无法判断发送状态，则否定收益。

建议试用，仅用于可保留原会话的非敏感纯文本/图片任务，默认选保留原会话；先验首轮/中间轮前缀与原图一致性。含文件、要彻底删除、或缺时间线时停止，改人工新建并检查上下文。没有安装/核心功能/卸载验收，不升级为值得安装。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:20-48](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/README.md#L20-L48)

作者安装状态及重复挂载提醒。

<details>
<summary>查看原文（29行）</summary>

````text
## 安装

### 从 npm（尚未发布）

> 这个包还没发布到 npm（计划中）。发布之后一行即可：

```sh
dsh plugin --profile <profile> add dsh-edit-question
```

在那之前请用下面的手工挂载方式。

### 手工挂载（源码）

```powershell
# 1) 让 profile 能解析到这个包：目录联接（junction，不需要管理员权限）
New-Item -ItemType Junction -Path "$HOME\.dsh\profiles\desktop\node_modules\dsh-edit-question" `
  -Target "<本仓库路径>"
```

```yaml
# 2) 在 profile 的 cordis.patch.yml 末尾追加
- insert:
    - id: edit-question
      name: dsh-edit-question
```

`cordis.patch.yml` 受 HMR 监视：改完即热重组，**不需要重启应用**；浏览器端代码在刷新页面后生效。

````

</details>

**依据 2 · 源码核查**：[lib/client.js:388-435](https://github.com/Akiccat/dsh-edit-question/blob/c0705c19a881e9f5d606d9f67d20cd537469db88/lib/client.js#L388-L435)

图片资源与部分成功恢复成本。

<details>
<summary>查看原文（48行）</summary>

```text
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

- 操作收据与缺end阻断未实现/验证
  **影响**：收益只是假设且当前恢复仍人工
  **进一步探讨**：按三类故障对照重复分支、前缀保真及人工操作次数

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
