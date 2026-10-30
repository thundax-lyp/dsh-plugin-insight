# dsh-edit-question

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3f056a1](https://github.com/Akiccat/dsh-edit-question/tree/3f056a1654466ebf400ab9c23a5efc9cb938c97b)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 用户提问旁编辑文本与图片，以分叉会话保留前缀并重新发送。

> **亮点**：它把宿主前缀分叉、原会话附件读取与可选择图片的编辑器接成一次重问流程，减少人工组织前文和附件的步骤；增量属于界面与流程集成，实际节时未知。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q05](#research-q05)。

> **主要限制**：核心限制是编辑选择、异步图片状态与分阶段会话操作没有共同的完成保证：预览按下标回贴，提交后删图未改变已捕获数组，prompt失败只在console留child线索，归档失败仍切换。条件路径有源码依据，但尚未运行复现，不能以一次分叉成功代替合格重问。见 [Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q05 · 图片编辑与异步状态是否保证所见即所发？](#detail-section-15)
  - [Q06 · 完成合格重问的全流程负担是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望改写早期提问并保留前文的 DSH Web 用户；重新组织的是对话上下文，不能回滚工具造成的现实变化。见 [Q01](#research-q01)。

简单替代是新建会话手工复制前文与找图，或在宿主分叉后人工重问。fork、附件存储、模型准入和归档由宿主提供；未独立核查当前宿主是否已有等效编辑UI，不能宣称唯一方案。见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 定位并编辑开场提问 | 预填原文后改问 | 已完成轮次插槽和开场user可定位；不覆盖任意排队消息 |
| 从前缀分叉并重发 | 保留目标前历史并发新问题 | 只看紧邻前轮end，否则0；不回滚现实动作 |
| 预览和移除原图 | 选择要重发的原图片 | 原会话读权限；预览异步按下标回贴有一致性边界 |
| 添加和移除补图 | 粘贴或选择新图片 | 单张10MB、补图最多10张；异步读图归属待验 |
| 保留或归档原会话 | 整理新旧分支 | 每次默认归档；是归档非删除，失败只console告警 |
| 切换到新会话 | 重问后继续对话 | prompt成功后才切换；失败child需人工找回 |

**流程与依赖**

完整启动条件及降级在 [Q06](#research-q06) 的“启动与依赖”表；核心会话API的客户端接线及外部实现边界见 [Q02](#research-q02)。

准备、加载、编辑、后台处理、验收、失败接管及退出集中见 [Q06](#research-q06) 的“启动步骤”；每次打开需主动切为保留原会话。

**效果与成本**

首次、持续、失败恢复和退出的现金/资源与人工投入集中在 [Q06](#research-q06) 的“成本”表；无账单或耗时，不以未知为0。

机制支持与效果未知集中在 [Q06](#research-q06) 的“效果”表；图像取舍和失败路径会影响一次合格重问，不能只比较按钮点击数。

> **思考**：核心限制是编辑选择、异步图片状态与分阶段会话操作没有共同的完成保证：预览按下标回贴，提交后删图未改变已捕获数组，prompt失败只在console留child线索，归档失败仍切换。条件路径有源码依据，但尚未运行复现，不能以一次分叉成功代替合格重问。见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把宿主前缀分叉、原会话附件读取与可选择图片的编辑器接成一次重问流程，减少人工组织前文和附件的步骤；增量属于界面与流程集成，实际节时未知。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q05](#research-q05)。

每会话状态、稳定标量订阅、原会话权限下先读附件及effect/observer清理值得借鉴，但移植须适配slot、DOM、timeline和会话API。状态可靠性以具体预览/补图/删除时序及分叉后恢复缺口为主要成本。统计仅覆盖既定JS/MJS/Markdown口径，Python等未纳入，不能当全工程规模或原创工时。作者开发笔记和验证工具不等于本轮运行通过。见 [Q02](#research-q02)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心限制是编辑选择、异步图片状态与分阶段会话操作没有共同的完成保证：预览按下标回贴，提交后删图未改变已捕获数组，prompt失败只在console留child线索，归档失败仍切换。条件路径有源码依据，但尚未运行复现，不能以一次分叉成功代替合格重问。见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察。具备会话核对能力的用户可在后续授权的无副作用隔离评估中先保留原会话，等待图像稳定并核对child前缀和附件；出现发送失败、少前文或删图未生效即停止重试，先找回child确认投递，再退回原会话手工分叉或新建重问。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持编辑入口、前缀分叉调用与图像增删重发；前缀/附件宿主语义、图片竞态和失败恢复尚未验收。持久恢复与图片身份关联是未来假设，真实需求和单位任务收益未知。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js、docs/DEVELOPMENT.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的README、package、patch、host/client及开发笔记源码核查；JS客户端完整关键链已读，工具仅作开发材料边界，不运行目标代码/安装/测试/模型。宿主callee实现、独立用户、同条件效果不在本材料内，保留逐题缺口。
- 下一步：后续固定宿主版本，以首轮/多轮/缺失紧邻前轮/队列核对前缀，以延迟预览和arrayBuffer核对图像身份，再在fork后、prompt拒绝/响应丢失及归档失败处注入故障，比较手工流程的额外分支、重复调用、合格率、现金和人工时间；当前均未执行。

**分析版本**

- **仓库**：[Akiccat/dsh-edit-question](https://github.com/Akiccat/dsh-edit-question)
- **版本号**：0.1.1（[固定提交 3f056a1](https://github.com/Akiccat/dsh-edit-question/tree/3f056a1654466ebf400ab9c23a5efc9cb938c97b)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的方向一是持久保存操作阶段并先核对既有child再恢复，以减少重复分支；方向二是用编辑世代和attachmentId关联异步图片，并冻结提交选择，以改善所见与所发一致性。故障/延迟对照若不降低重复与误选或增加更大负担，就否定其收益；均不是已有功能或市场机会。见 [Q04](#research-q04)。

后续固定宿主版本，以首轮/多轮/缺失紧邻前轮/队列核对前缀，以延迟预览和arrayBuffer核对图像身份，再在fork后、prompt拒绝/响应丢失及归档失败处注入故障，比较手工流程的额外分支、重复调用、合格率、现金和人工时间；当前均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 281 | — | — | 5060 |
| .js | source | 2 | 993 | 706 | 254 | — |
| .mjs | source | 6 | 422 | 358 | 44 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/Akiccat/dsh-edit-question/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编辑提问的分叉重发能否可靠排除后续对话，并保留图片与失败后可恢复性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分叉编辑解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已经使用 DSH Web 会话、发现某轮开场提问有误并希望保留此前对话重新探索的用户。合格结果是子会话含正确前缀、新文本及用户选定的图片，旧提问和其后回答不进入新上下文，原会话保留或归档符合选择。作者明确提供这个入口，但没有真实用户频率、节时或付费意愿材料，不能把个人使用设想写成已验证需求。

与新建会话手工复制前文及重新找图相比，插件把提问定位、前缀切点和图片读取组织在一次编辑流程里。与手工调用宿主 fork 再发问相比，它增加了轮次按钮、编辑预填、图片增删和原会话整理。前缀复制、附件授权、模型执行和归档是宿主继承能力；本仓库没有宿主实现，README 关于“唯一官方语义”的描述属于作者陈述，不能据此证明当前全生态没有其他编辑入口。

“丢弃后续”仅作用于新会话上下文，不撤销已执行工具写入的文件、订单或外部动作。源码没有工作区快照或补偿步骤，用户仍须核对现实状态。需要撤回真实副作用、携带文件回执或只改同一轮后续排队消息的人，不应把它作为原地编辑或回滚工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-18](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/README.md#L1-L18)

作者定义编辑任务、图片能力和fork参照

<details>
<summary>查看原文（18行）</summary>

```text
# dsh-edit-question —— 编辑提问并重发

在 DeepSeek Harness Web GUI 的每条用户提问旁加一个「✎ 编辑提问」入口：改完原文后从这条提问重新开始，
该提问之后的对话不再进入新会话的上下文，界面直接切到新会话。

- **图片兼容**：原提问里的图片会随重发一起带上（内容寻址复用同一个附件，不重复占空间），在对话框里逐张预览、可单独删掉不想重发的那张；也可以在编辑框里**直接粘贴补充图片**。
- **两个出口**：对话框里二选一——保留原会话（新旧并存）或删除原会话（新会话建好后归档原会话，列表里只留新的）。**默认选中「删除原会话」**，需要留档时手动切回保留。

![编辑提问对话框](https://raw.githubusercontent.com/Akiccat/dsh-edit-question/main/shots/e2e-image-03-dialog.png)

## 为什么是 fork 而不是原地截断

DSH 没有「删除会话中某段历史」的官方能力：会话文件是多帧拼接的 zstd 追加日志（带内核写租约），外部改写会破坏
租约与 seq 连续性；`surfaceOp: replace` 只能让模型「看不见」，记录仍在界面上。所以本插件用官方唯一的「从某点重开」语义
`ctx.sessions.fork({ sessionId, atSeq })` 复制前缀生成子会话，再在子会话里重发编辑后的提问。

切点取**上一轮的 `turn/end`**：第 1 轮用 `0`（原提问自己的 `agent/inbox/spliced` 在 `turn/start` 之前，从它之后开始会把旧提问带进新会话），
第 N>1 轮用第 N-1 轮结束的 seq。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:550-595](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L550-L595)

按钮只定位开场用户消息并将其内容交给编辑器

<details>
<summary>查看原文（46行）</summary>

```text
    function EditQuestionActionButton(props) {
      const { turn, sessionId, useChat, t, openEditor, editDraft } = props;
      const turnId = turnIdOf(turn);
      const row = useActionRow(turnId);
      // 选择器只返回原始值，避免每次渲染产生新对象导致的重复订阅。
      const userSeq = useChat((snapshot) => {
        const node = openingUserNode(snapshot, turnId);
        return node === undefined ? -1 : node.data.seq;
      });
      const atSeq = useChat((snapshot) => cutSeqOf(snapshot, turnId));
      const draft = useChat((snapshot) => {
        const node = openingUserNode(snapshot, turnId);
        return node === undefined ? "" : textOf(node.data.content);
      });
      // 图片/文件分片留到点击时再解析：useChat 的 selector 每次返回新数组会让宿主每帧判定「变了」，
      // 因此这里只订阅一个稳定标量，把最新 content 存在 ref 里。
      const openingContent = react.useRef(null);
      useChat((snapshot) => {
        const node = openingUserNode(snapshot, turnId);
        openingContent.current = node === undefined ? null : node.data.content;
        return node === undefined ? 0 : 1;
      });
      const hover = react.useState(false);
      const hovered = hover[0];
      const setHovered = hover[1];
      if (userSeq < 0) return null;
      const base = row === null ? tailActionStyle : rowActionStyle;
      const button = h("button", {
        type: "button",
        [ROW_MARK]: "",
        title: t("action.tooltip"),
        style: hovered ? { ...base, ...hoverStyle } : base,
        onMouseEnter: () => { setHovered(true); },
        onMouseLeave: () => { setHovered(false); },
        onClick: (event) => {
          // 按钮在消息条目内部：阻止冒泡，避免触发宿主的选中/跳转等行级点击。
          event.stopPropagation();
          const images = imageRefsIn(openingContent.current);
          const files = hasFilePart(openingContent.current);
          console.info(`[dsh-edit-question] open editor session=${sessionId} turn=${String(turnId)} userSeq=${String(userSeq)} cut=${String(atSeq)} images=${String(images.length)}`);
          editDraft(draft);
          openEditor({ atSeq, userSeq, text: draft, images, files });
        },
      }, h("span", { "aria-hidden": true, style: { fontSize: "12px" } }, "✎"), t("action.edit"));
      // 注入宿主的用户消息动作行（时间 + 复制）；portal 保证事件与 React 状态仍归本组件。
      return row === null ? button : reactDom.createPortal(button, row);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:415-482](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L415-L482)

实际输出是fork后prompt及归档/导航，没有工作区回滚

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

#### 缺口

- 重复需求与同条件收益没有独立材料
  **影响**：只能判断流程增量，不能证明采用必要性
  **进一步探讨**：邀请反复改问的用户对照手工复制或手工分叉，记录合格率、人工时间和真实状态核对成本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 切点、附件和重发怎样完成？

**研究主题**：功能与机制

#### 完整回答

这是具有宿主加载条目和 Web 客户端的 DSH 插件。lib/index.js 的空 apply 不提供工具或后台服务；package.json 声明 bundle patch 和客户端依赖，cordis.patch.yml 的 insert 挂载 edit-question。浏览器工厂导出 apply/inject，apply 注册两个实际 UI 插槽及词典，每个 sessionId 经 editorFor 获得独立状态源，卸载 effect 清空 Map。

实际入口是 turnTail 注册的 EditQuestionAction。它先检查 useChat/t，按钮用 turnIdOf 接受数字或位置对象，再用 openingUserNode 遍历本轮节点寻找第一个 kind=user。textOf 只拼文本；imageRefsIn 只接收有 attachmentId 的图片；hasFilePart 标记文件。按钮订阅 cutSeqOf 后点击调用 openEditor，后者在注册闭包中调用 editor.open。DOM 的 findActionRow 与 useActionRow 使用消息属性定位并用 MutationObserver/动画帧维护 portal；找不到动作行退回轮尾，缺少提问则不显示按钮。退回位置不等于所有宿主版本功能均兼容。

cutSeqOf 只查看 turnOrder 中紧邻上一项的 end.seq，数值正数才采用；缺少快照、turnOrder、目标轮次、紧邻前轮或有效 end 都返回0。它不会向前寻找更早已完成轮；因此第 N 轮也可能退0，不能写成只有首轮从0开始。userSeq>=0 守卫不证明切点完整，切到0可能丢掉本应保留的更早前缀。

编辑对话框的提交按钮或快捷键调用 submitDraft，overlay 的闭包再调用 editor.submit。submit 对当前编辑器 busy 防重入，捕获文本/图片快照，并检查非空及 userSeq。原图通过 sessions.using(原sessionId) 等待 reference.ready，再逐图 readAttachment 并用 base64Of 编码；任一读图失败在 fork 前终止。补图已在客户端编码，按原图在前、补图在后组装。随后 fork({sessionId,atSeq,increaseTitle:true}) 返回 childId；sessions.using(childId) 就绪后 prompt([...imageParts,text],"queue")；成功才按用户选择归档原会话并打开 child。附件存储去重和 fork 的持久化/收件箱语义由宿主决定，本轮没有读到宿主 callee 实现，只能确认客户端调用接线，不能独立验证去重、模型接收或完整前缀。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-10](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/index.js#L1-L10)

宿主空apply和浏览器行为归属

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

**依据 2 · 源码核查**：[lib/client.js:17-27](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L17-L27)

浏览器工厂与真实require

<details>
<summary>查看原文（11行）</summary>

```text
window.__ModuleLoader__.load({
  id: "dsh-edit-question",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const react = require("react");
    const reactDom = require("react-dom");
    const { createSnapshotStore } = require("@deepseek-ai/dsh-client-store");
    const h = react.createElement;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:122-193](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L122-L193)

turn/user/text/image/file helper实际实现

<details>
<summary>查看原文（72行）</summary>

```text
    function turnIdOf(turn) {
      if (typeof turn === "number") return turn;
      if (turn !== null && typeof turn === "object" && typeof turn.turn === "number") return turn.turn;
      return undefined;
    }

    /**
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
    }

    /**
     * 拼接消息的文本分片（图片/附件分片不参与）。
     * @param content - 消息内容分片数组。
     * @returns 纯文本。
     */
    function textOf(content) {
      if (!Array.isArray(content)) return "";
      const parts = [];
      for (const part of content) {
        if (part !== null && typeof part === "object" && part.type === "text" && typeof part.text === "string") parts.push(part.text);
      }
      return parts.join("\n");
    }

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

**依据 4 · 源码核查**：[lib/client.js:221-260](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L221-L260)

DOM查询、观察与清理

<details>
<summary>查看原文（40行）</summary>

```text
    function findActionRow(turnId) {
      if (turnId === undefined) return null;
      const item = document.querySelector(`[data-chat-flow-kind="user"][data-chat-turn="${String(turnId)}"]`);
      if (item === null || item.hasAttribute("hidden")) return null;
      return item.querySelector("[data-clock=\"start\"]");
    }

    /**
     * 跟踪动作行元素：挂载时解析一次，之后用 childList 观察（虚拟化回收、重渲染换掉节点后重新解析）。
     * 目标仍然挂在文档上就直接返回，流式渲染期间不会反复查询；只有真的换了元素才 setState。
     * @param turnId - 轮次号。
     * @returns 当前可用的动作行；找不到时为 null（此时按钮退回轮尾单独一行）。
     */
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
      }, [turnId]);
      return row;
```

</details>

**依据 5 · 源码核查**：[lib/client.js:272-283](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L272-L283)

切点只看紧邻上一轮end

<details>
<summary>查看原文（12行）</summary>

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
    }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:550-595](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L550-L595)

helper调用方与编辑器入口

<details>
<summary>查看原文（46行）</summary>

```text
    function EditQuestionActionButton(props) {
      const { turn, sessionId, useChat, t, openEditor, editDraft } = props;
      const turnId = turnIdOf(turn);
      const row = useActionRow(turnId);
      // 选择器只返回原始值，避免每次渲染产生新对象导致的重复订阅。
      const userSeq = useChat((snapshot) => {
        const node = openingUserNode(snapshot, turnId);
        return node === undefined ? -1 : node.data.seq;
      });
      const atSeq = useChat((snapshot) => cutSeqOf(snapshot, turnId));
      const draft = useChat((snapshot) => {
        const node = openingUserNode(snapshot, turnId);
        return node === undefined ? "" : textOf(node.data.content);
      });
      // 图片/文件分片留到点击时再解析：useChat 的 selector 每次返回新数组会让宿主每帧判定「变了」，
      // 因此这里只订阅一个稳定标量，把最新 content 存在 ref 里。
      const openingContent = react.useRef(null);
      useChat((snapshot) => {
        const node = openingUserNode(snapshot, turnId);
        openingContent.current = node === undefined ? null : node.data.content;
        return node === undefined ? 0 : 1;
      });
      const hover = react.useState(false);
      const hovered = hover[0];
      const setHovered = hover[1];
      if (userSeq < 0) return null;
      const base = row === null ? tailActionStyle : rowActionStyle;
      const button = h("button", {
        type: "button",
        [ROW_MARK]: "",
        title: t("action.tooltip"),
        style: hovered ? { ...base, ...hoverStyle } : base,
        onMouseEnter: () => { setHovered(true); },
        onMouseLeave: () => { setHovered(false); },
        onClick: (event) => {
          // 按钮在消息条目内部：阻止冒泡，避免触发宿主的选中/跳转等行级点击。
          event.stopPropagation();
          const images = imageRefsIn(openingContent.current);
          const files = hasFilePart(openingContent.current);
          console.info(`[dsh-edit-question] open editor session=${sessionId} turn=${String(turnId)} userSeq=${String(userSeq)} cut=${String(atSeq)} images=${String(images.length)}`);
          editDraft(draft);
          openEditor({ atSeq, userSeq, text: draft, images, files });
        },
      }, h("span", { "aria-hidden": true, style: { fontSize: "12px" } }, "✎"), t("action.edit"));
      // 注入宿主的用户消息动作行（时间 + 复制）；portal 保证事件与 React 状态仍归本组件。
      return row === null ? button : reactDom.createPortal(button, row);
```

</details>

**依据 7 · 源码核查**：[lib/client.js:415-482](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L415-L482)

提交时原附件读取、fork、prompt、归档与打开顺序

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

**依据 8 · 源码核查**：[lib/client.js:923-983](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L923-L983)

两个slot注册、动作闭包和导出

<details>
<summary>查看原文（61行）</summary>

```text
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-edit-question: dictionaries");
      const editors = new Map();
      /**
       * 取（或建）某会话的编辑器。
       * @param sessionId - 会话标识。
       * @returns 编辑器。
       */
      const editorFor = (sessionId) => {
        let editor = editors.get(sessionId);
        if (editor === undefined) {
          editor = createEditor(ctx, sessionId);
          editors.set(sessionId, editor);
        }
        return editor;
      };
      ctx.effect(() => () => { editors.clear(); }, "dsh-edit-question: per-session editors");
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
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
```

</details>

**依据 9 · 源码核查**：[cordis.patch.yml:1-18](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/cordis.patch.yml#L1-L18)

bundle实际insert

<details>
<summary>查看原文（18行）</summary>

```text
# dsh-edit-question bundle patch
#
# This file is the `dsh.bundle.patch` layer of the published npm package: when
# the plugin is installed through the official CLI
#
#   dsh plugin --profile <name> add dsh-edit-question
#
# the command reconciles `dsh.profile.bundles` against installed packages and,
# seeing this declaration, appends `dsh-edit-question` to the bundle stack. The
# profile boot then merges THIS patch (a single `insert` of the plugin row).
#
# If the profile still carries a manual mount line for this plugin in its own
# cordis.patch.yml (the pre-bundle install used a junction + `- insert:` row),
# remove that line before switching to the bundle channel: two rows with the
# same id fail loudly at the loader.
- insert:
    - id: edit-question
      name: 'dsh-edit-question'
```

</details>

#### 缺口

- 宿主fork、readAttachment、prompt与archive的callee实现未纳入固定包
  **影响**：客户端调用不证明服务语义、去重和兼容性
  **进一步探讨**：固定对应宿主版本，核对API实现并在隔离会话验收首轮、多轮、队列和缺失前轮边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败及非图片边界怎样影响采用成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

最关键的质疑是：便利的编辑入口是否把一次多阶段操作误呈现为可靠重问。源码已有正向防线：同一编辑器 busy 阻止重入，附件失败在 fork 前结束，fork 抛错不继续 prompt，只有 prompt 成功后才尝试归档，取消在 busy 时不关闭。但这些不构成事务，也不能补偿已建子会话或未知投递结果。

fork 成功后 childId 是 submit 的局部变量。它确实写入 console.info，不能称为完全不可找回；然而 prompt catch 仅将 busy=false 与错误码/detail 写入状态，未保留 childId、未导航、未提供继续该 child 的UI。错误渲染只使用 error.code/detail，再点提交仍从头读图和 fork。若 prompt 明确失败，可能留空分支；若投递已发生但响应丢失，重试可能生成多余分支及额外模型调用。这是源码可推出的条件路径，尚未复现实际丢响应或确认重复模型执行。

归档调用在 prompt 之后，且只在 archiveSession 是函数时执行。抛错只 console.warn，仍关闭编辑器并 openSession(childId)；这保护了已重问的新会话，却没有向普通用户确认原会话整理失败。openSession 本身没有等待/错误恢复分支。用户必须独立检查列表和已归档区，不能把切换成功当成原会话已删除；“删除”实际是可恢复归档，不是物理删除。

原图预读失败仅留占位，提交会重新读取，有机会恢复；文件 type=file 只提示、不重发，用户可能因此失去回答所依赖的资料。图片模型准入、排队消息继承和系统触发轮次的语义是作者开发说明中的限制。没有宿主材料证明所有通知/队列组合都满足“从目标提问重新开始”，本轮建议收窄到无文件、无队列和无现实副作用的会话。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:368-370](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L368-L370)

busy时禁止关闭

```text
        dismiss() {
          if (store.getSnapshot().busy) return;
          store.set(CLOSED);
```

**依据 2 · 源码核查**：[lib/client.js:415-482](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L415-L482)

正向保护和分阶段错误路径；childId已有console但不入错误状态

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

**依据 3 · 源码核查**：[lib/client.js:798-809](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L798-L809)

错误UI拼接与快捷键提交调用

<details>
<summary>查看原文（12行）</summary>

```text
      const failure = state.error === null ? null : `${t(`error.${state.error.code}`)}${state.error.detail === "" ? "" : `：${state.error.detail}`}`;
      const blank = state.text.trim() === "" && state.images.length === 0 && state.extraImages.length === 0;
      const panel = h("div", {
        style: panelStyle,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("dialog.title"),
        onKeyDown: (event) => {
          stop(event);
          if (event.key === "Escape") dismissEditor();
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) void submitDraft();
        },
```

</details>

**依据 4 · 源码核查**：[lib/client.js:898-906](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L898-L906)

重试按钮只再次submitDraft

```text
        state.error === null ? null : h("div", { style: { marginTop: "8px", color: "var(--dsw-alias-label-error, #d93026)" } }, failure),
        h("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px" } },
          h("button", { type: "button", style: secondaryButtonStyle, disabled: state.busy, onClick: () => { dismissEditor(); } }, t("dialog.cancel")),
          h("button", {
            type: "button",
            style: state.busy || blank ? { ...primaryButtonStyle, opacity: 0.6, cursor: "default" } : primaryButtonStyle,
            disabled: state.busy || blank,
            onClick: () => { void submitDraft(); },
          }, state.busy ? t("dialog.sending") : t("dialog.submit")),
```

**依据 5 · 作者声明**：[README.md:63-72](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/README.md#L63-L72)

作者说明归档/文件/模型/DOM限制

<details>
<summary>查看原文（10行）</summary>

```text
## 已知限制

- 「删除原会话」实际调用的是 DSH 原生**归档**（`uiWorkspace.archiveSession`，没有物理删除会话的接口），可在「已归档」里恢复；
  要彻底删掉得自己清理 `~/.dsh/sessions/` 下对应目录。
- 文件类附件（非图片）不重发：它的上传回执（`receiptId`）只对原会话有效，对话框会单独提示。
- 当前模型需支持图片输入，否则宿主会在 prompt 准入时拒绝并给出提示。
- 入口位置依赖宿主 DOM 契约（`data-chat-flow-kind` / `data-chat-turn` / `data-clock`），宿主改版时会自动退回轮尾一行（功能不受影响）。

## 开发

```

</details>

**依据 6 · 作者声明**：[docs/DEVELOPMENT.md:143-151](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/docs/DEVELOPMENT.md#L143-L151)

作者开发说明中的图像准入、队列与系统轮次边界

```text

- **「删除原会话」= 归档**：DSH 没有物理删除会话的 seam，本插件调用的是原生归档（`archiveSession`），会话文件仍在磁盘上，可在「已归档」里恢复。想要彻底删除得在归档后自己清理 `~/.dsh/sessions/` 对应目录。
- **补充图片的形状限制**：只接受浏览器给出的 `image/*`（PNG/JPEG/WebP/GIF 等），单张 ≤ 10 MB、最多 10 张；宿主侧 `imageLimits` 还会再校验一次，超限的错误会显示在对话框里。
- **文件附件不重发**：原提问带 `type:"file"` 分片时只重发图片与文本（文件的 `receiptId` 只对原会话有效），对话框会提示。
- **模型必须支持图片**：宿主在 prompt 准入时会检查当前模型的 `inputModalities`，不支持图片的模型会直接拒绝（错误显示在对话框里）。
- **排队消息**：若在被编辑轮次运行时你又排了消息（收件箱非空），fork 会把队列一并继承。
- **非用户提问的轮次**：由通知/系统消息触发的轮次，其开场 `user` 节点可能是系统文本，对话框会如实展示将要重发的内容。
- **入口位置依赖宿主 DOM 契约**：靠 `data-chat-flow-kind` / `data-chat-turn` / `data-clock` 找动作行，
  宿主改版若改了这几个属性，按钮会自动退回轮尾一行（功能不受影响，只是位置回到旧样式）。
```

#### 缺口

- 分叉后prompt失败或响应丢失的服务结果未确认
  **影响**：不能确定分支/消息数量和恢复耗时
  **进一步探讨**：分别注入明确拒绝和已写入后丢响应，核对子会话、消息与模型调用后再决定重试策略
- 队列和系统触发轮次的宿主语义缺少独立固定实现依据
  **影响**：可能使编辑目标或继承上下文不符合预期
  **进一步探讨**：以固定宿主逐项核对队列事件和开场user来源，并检查子会话日志

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可推导何种恢复改进，当前如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前采用结论是观察。目标人群应是能核对会话日志、原会话归档和真实工作区状态的 DSH 用户；只需要改一条短问、没有反复复制前文负担的人可继续新建会话手工重问。暂不建议把它用于需要可靠撤销动作或依赖多图精确取舍的正式任务。

从Q03可推导一个未验证的恢复假设：把编辑动作记录为含原会话、切点、目标userSeq、所选附件、childId及投递阶段的操作状态，先核对既有child再恢复，能比重新fork减少孤立分支和重复回答。相对现有console日志，这增加用户可见的“打开已创建会话”和状态核对，而不是仅把错误换个文案。它依赖宿主能识别消息或请求、允许查询已发生投递；若不能判断已发送，必须展示结果未知而非自动重投。新增状态存储、清理、跨窗口并发和隐私维护也属于成本，不能假定只缓存childId就得到幂等。

最小验证将同一隔离会话分别置于fork后prompt前失败、prompt明确拒绝、prompt已写入后响应丢失、归档失败，比较当前流程与恢复方案的额外child数、重复提示数、原会话误归档及人工找回时间。若仍重复发送、遗漏应恢复child或人工负担不减，就推翻收益假设。Q05还能推导独立的界面一致性假设：用编辑epoch和attachmentId回贴预览、让异步补图归属当前编辑操作，并冻结提交后的选择，可减少所见与所发不一致。其最小对照是延迟预览/arrayBuffer时删首图、关开同一问题和立即提交，核对缩略图身份及真实prompt附件；若稳定ID和冻结带来负担却不降低错误，则不支持该改造。

在这些边界验收前仅考虑隔离评估：选无工具副作用的短会话，先手动选择“保留原会话”（每次打开默认归档），等待所有图片可辨认且不再修改后再提交，逐项比对子会话前缀、文本、附件身份与原会话状态。发现少前文、图像错位、删图后仍发送或出现“发送失败”时停止重试，先通过console中的childId或列表找回已建分支，核对是否已投递，再退回原会话手工分叉或新建重问。以上是待授权执行方案，当前没有运行结果，也没有以假设计入已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:452-482](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L452-L482)

恢复阶段和可定位console日志是恢复假设的推导依据

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

**依据 2 · 源码核查**：[lib/client.js:314-339](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L314-L339)

预览epoch/稳定身份假设的推导依据

<details>
<summary>查看原文（26行）</summary>

```text
      async function loadOriginalPreviews(images, userSeq) {
        try {
          const previews = await ctx.sessions.using(sessionId, { source: "edit-question" }, async (reference) => {
            const binding = await reference.ready;
            const out = [];
            for (const image of images) {
              try {
                const result = await binding.session.readAttachment(image.attachmentId);
                if (result.ok !== true) {
                  out.push(null);
                  continue;
                }
                const mediaType = typeof image.mediaType === "string" ? image.mediaType : "image/png";
                out.push(`data:${mediaType};base64,${base64Of(result.value.data)}`);
              } catch (error) {
                console.warn("[dsh-edit-question] preview read failed:", image.attachmentId, error);
                out.push(null);
              }
            }
            return out;
          });
          const snapshot = store.getSnapshot();
          if (!snapshot.open || snapshot.userSeq !== userSeq) return;
          patch({
            images: snapshot.images.map((image, index) => (typeof previews[index] === "string" ? { ...image, preview: previews[index] } : image)),
          });
```

</details>

**依据 3 · 源码核查**：[lib/client.js:758-779](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L758-L779)

补图异步归属假设的推导依据

<details>
<summary>查看原文（22行）</summary>

```text
      const ingest = async (files) => {
        const room = MAX_ADDED_IMAGES - state.extraImages.length;
        if (files.length > room) {
          setImageNotice(t("error.imageCount"));
          return;
        }
        const accepted = [];
        let tooLarge = false;
        for (const file of files) {
          if (!file.type.startsWith("image/")) continue;
          if (file.size > MAX_ADDED_IMAGE_BYTES) {
            tooLarge = true;
            continue;
          }
          const bytes = new Uint8Array(await file.arrayBuffer());
          const mediaType = file.type === "" ? "image/png" : file.type;
          const data = base64Of(bytes);
          accepted.push({ mediaType, data, preview: `data:${mediaType};base64,${data}`, name: file.name === "" ? "image.png" : file.name });
        }
        setImageNotice(tooLarge ? t("error.imageTooLarge") : null);
        addImages(accepted);
      };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:350-365](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L350-L365)

每次打开默认归档必须由用户切回保留

<details>
<summary>查看原文（16行）</summary>

```text
        open(input) {
          const images = Array.isArray(input.images) ? input.images : [];
          store.set({
            open: true,
            text: input.text,
            busy: false,
            error: null,
            atSeq: input.atSeq,
            userSeq: input.userSeq,
            images,
            extraImages: EMPTY_IMAGES,
            files: input.files === true,
            removeOriginal: true,
          });
          // 缩略图必须读回字节才能显示；attachment 只对原会话授权，所以在这里读。
          if (images.length > 0) void loadOriginalPreviews(images, input.userSeq);
```

</details>

#### 缺口

- 恢复设计能否查询投递事实及真实用户获益未知
  **影响**：不能把设计机会升级为可靠功能或生产插件需求
  **进一步探讨**：先核对宿主消息身份/API并执行故障对照，再邀请反复改问用户比较恢复负担

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 图片编辑与异步状态是否保证所见即所发？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

源码支持逐张删除原图、添加并删除补图，这是实际正向增量。原图从imageRefsIn生成 attachmentId/mediaType/name，open启动loadOriginalPreviews；Dialog将images/extraImages逐项交给ExtraImage，删除闭包调用removeOriginalImage/removeImage，提交再按保留下来的attachmentId读取原字节。缩略图失败不会自动删除原图，文件提示也清楚地区别非图片附件。补图从粘贴与选择器共用ingest，只接受image/*，逐张检查10MB并限制补充最多10张；原图不计入这个客户端补图数量限额，宿主上限仍需另验。

但预览回写只检查snapshot.open与userSeq相等，再以当前images的index使用previews[index]。若原图A/B预读尚未结束时删A，回调可能把A预览贴到保留B的对象上。这里B的attachmentId未被改，submit仍按B读取，并非已证明发送A；风险在于用户依据错误图像继续取舍。同一userSeq关闭后重开也不能由该守卫区分世代。它不是“图片删除完全不可用”，而是特定异步时序下预览与身份关联不可靠。

补图的ingest在await file.arrayBuffer后直接addImages；调用方用void ingest，未对读取异常提供catch，完成时不核对open、userSeq、编辑世代或busy。开始读图后关闭/重开或立即提交，异步结果可能进入当前状态或未被本次已捕获的extra包含。addImages只有数组与数量限制，不能补足归属检查。多个读取批次超额时最终slice到10但未必反映用户期望的批次保留顺序。

提交捕获state.images/extra并设置busy；文本、选项、添加按钮和取消已有禁用或只读保护，但ExtraImage删除按钮没有busy参数/disabled，removeOriginalImage和removeImage也不守卫busy。提交开始后再删图只改变后续状态，不改变submit已捕获数组，因此界面删除可能不影响已经进行的发送。这是客户端状态一致性缺口，有明确caller/callee支持，尚未运行时序复现。它使多图精确重问的核心价值需先验证。

工程可借鉴处是按sessionId分状态、稳定标量订阅避免每次新数组、原会话权限下先读附件和effect/observer清理；迁移须适配宿主slot、timeline、权限与DOM契约。客户端是带CommonJS工厂的JS产物，不能把“打包产物格式”自动作为生成文件排除。INVENTORY的JS/MJS/Markdown统计不涵盖Python等扩展，仓库内开发验证脚本不等于生产行为，所列规模不是全工程规模或原创量；本轮未执行作者E2E，开发笔记的实测只能归作者报告。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:169-193](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L169-L193)

原附件提取身份与非图识别

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

**依据 2 · 源码核查**：[lib/client.js:314-365](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L314-L365)

预览异步读取、userSeq守卫及按index回贴

<details>
<summary>查看原文（52行）</summary>

```text
      async function loadOriginalPreviews(images, userSeq) {
        try {
          const previews = await ctx.sessions.using(sessionId, { source: "edit-question" }, async (reference) => {
            const binding = await reference.ready;
            const out = [];
            for (const image of images) {
              try {
                const result = await binding.session.readAttachment(image.attachmentId);
                if (result.ok !== true) {
                  out.push(null);
                  continue;
                }
                const mediaType = typeof image.mediaType === "string" ? image.mediaType : "image/png";
                out.push(`data:${mediaType};base64,${base64Of(result.value.data)}`);
              } catch (error) {
                console.warn("[dsh-edit-question] preview read failed:", image.attachmentId, error);
                out.push(null);
              }
            }
            return out;
          });
          const snapshot = store.getSnapshot();
          if (!snapshot.open || snapshot.userSeq !== userSeq) return;
          patch({
            images: snapshot.images.map((image, index) => (typeof previews[index] === "string" ? { ...image, preview: previews[index] } : image)),
          });
        } catch (error) {
          console.warn("[dsh-edit-question] preview load failed:", error);
        }
      }
      return {
        store,
        /**
         * 打开编辑器。
         * @param input - 目标提问：切点 seq、用户消息 seq、原文、图片引用、是否含文件回执。
         */
        open(input) {
          const images = Array.isArray(input.images) ? input.images : [];
          store.set({
            open: true,
            text: input.text,
            busy: false,
            error: null,
            atSeq: input.atSeq,
            userSeq: input.userSeq,
            images,
            extraImages: EMPTY_IMAGES,
            files: input.files === true,
            removeOriginal: true,
          });
          // 缩略图必须读回字节才能显示；attachment 只对原会话授权，所以在这里读。
          if (images.length > 0) void loadOriginalPreviews(images, input.userSeq);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:383-409](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L383-L409)

添加/删除动作实际状态变更缺少busy/epoch守卫

<details>
<summary>查看原文（27行）</summary>

```text
        addImages(images) {
          if (!Array.isArray(images) || images.length === 0) return;
          const current = store.getSnapshot().extraImages;
          patch({ extraImages: [...current, ...images].slice(0, MAX_ADDED_IMAGES) });
        },
        /**
         * 移除一张补充的图片。
         * @param index - 补充列表里的下标。
         */
        removeImage(index) {
          const current = store.getSnapshot().extraImages;
          patch({ extraImages: current.filter((_, position) => position !== index) });
        },
        /**
         * 从原图里移除一张：重发时不再带上它。
         * @param index - 原图列表下标。
         */
        removeOriginalImage(index) {
          const current = store.getSnapshot().images;
          patch({ images: current.filter((_, position) => position !== index) });
        },
        /**
         * 选择重发后是否归档原会话。
         * @param removeOriginal - true 表示新会话建好后归档原会话。
         */
        setRemoveOriginal(removeOriginal) {
          patch({ removeOriginal });
```

</details>

**依据 4 · 源码核查**：[lib/client.js:415-445](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L415-L445)

提交捕获数组并按attachmentId读原图

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/client.js:686-731](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L686-L731)

缩略图渲染和无busy删除按钮

<details>
<summary>查看原文（46行）</summary>

```text
    function ExtraImage(props) {
      const { image, onRemove, label } = props;
      const frame = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "var(--dsw-radius-sm, 6px)",
        border: "1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, .12))",
        boxSizing: "border-box",
      };
      // 原图的缩略图要异步读回来，未就绪时先占位，避免出现破图。
      const thumb = typeof image.preview === "string"
        ? h("img", { src: image.preview, alt: image.name, style: frame })
        : h("div", {
          style: {
            ...frame,
            borderStyle: "dashed",
            display: "grid",
            placeItems: "center",
            color: "var(--dsw-alias-label-tertiary, #8a8f98)",
            fontSize: "12px",
          },
        }, "…");
      return h("div", { style: { position: "relative", width: "64px", height: "64px" } },
        thumb,
        h("button", {
          type: "button",
          "aria-label": label,
          title: label,
          onClick: onRemove,
          style: {
            position: "absolute",
            top: "-6px",
            right: "-6px",
            width: "18px",
            height: "18px",
            padding: "0",
            lineHeight: "16px",
            borderRadius: "9px",
            border: "none",
            background: "rgba(0, 0, 0, .62)",
            color: "#fff",
            fontSize: "12px",
            cursor: "pointer",
          },
        }, "×"),
```

</details>

**依据 6 · 源码核查**：[lib/client.js:758-795](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L758-L795)

补图读取与粘贴调用，无await后归属检查

<details>
<summary>查看原文（38行）</summary>

```text
      const ingest = async (files) => {
        const room = MAX_ADDED_IMAGES - state.extraImages.length;
        if (files.length > room) {
          setImageNotice(t("error.imageCount"));
          return;
        }
        const accepted = [];
        let tooLarge = false;
        for (const file of files) {
          if (!file.type.startsWith("image/")) continue;
          if (file.size > MAX_ADDED_IMAGE_BYTES) {
            tooLarge = true;
            continue;
          }
          const bytes = new Uint8Array(await file.arrayBuffer());
          const mediaType = file.type === "" ? "image/png" : file.type;
          const data = base64Of(bytes);
          accepted.push({ mediaType, data, preview: `data:${mediaType};base64,${data}`, name: file.name === "" ? "image.png" : file.name });
        }
        setImageNotice(tooLarge ? t("error.imageTooLarge") : null);
        addImages(accepted);
      };
      /**
       * 剪贴板里带图片时拦下默认粘贴，改成「补充图片」；纯文本粘贴保持原样。
       * @param event - 粘贴事件。
       */
      const onPaste = (event) => {
        const clip = event.clipboardData;
        if (clip === null || clip === undefined) return;
        const files = [];
        for (const item of clip.items) {
          if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
          const file = item.getAsFile();
          if (file !== null) files.push(file);
        }
        if (files.length === 0) return;
        event.preventDefault();
        void ingest(files);
```

</details>

**依据 7 · 源码核查**：[lib/client.js:817-855](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L817-L855)

文本只读及两类删除闭包实际接线

<details>
<summary>查看原文（39行）</summary>

```text
        h("textarea", {
          ref: area,
          value: state.text,
          readOnly: state.busy,
          spellCheck: false,
          rows: 6,
          style: {
            width: "100%",
            boxSizing: "border-box",
            minHeight: "96px",
            maxHeight: "40vh",
            padding: "8px 10px",
            border: "1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, .12))",
            borderRadius: "var(--dsw-radius-md, 8px)",
            background: "var(--dsw-alias-bg-layer-1, #fff)",
            color: "var(--dsw-alias-label-primary, #1f2329)",
            font: "inherit",
            lineHeight: "20px",
            resize: "vertical",
          },
          onChange: (event) => { editDraft(event.target.value); },
          onPaste,
        }),
        state.images.length > 0 || state.extraImages.length > 0 ? h("div", { style: { marginTop: "8px" } },
          state.images.length > 0 ? h("div", { style: { color: "var(--dsw-alias-label-secondary, #5c6068)" } }, t("dialog.images")) : null,
          // 原图与补充图排在同一条带上，删除各自落到对应的列表。
          h("div", { style: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px", paddingTop: "4px" } },
            state.images.map((image, index) => h(ExtraImage, {
              key: `original:${index}:${image.attachmentId}`,
              image,
              label: t("dialog.removeImage"),
              onRemove: () => { removeOriginalImage(index); },
            })),
            state.extraImages.map((image, index) => h(ExtraImage, {
              key: `extra:${index}:${image.name}`,
              image,
              label: t("dialog.removeImage"),
              onRemove: () => { removeImage(index); },
            })),
```

</details>

**依据 8 · 源码核查**：[lib/client.js:860-906](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L860-L906)

其他按钮busy保护形成局部反证

<details>
<summary>查看原文（47行）</summary>

```text
          h("button", {
            type: "button",
            style: { ...secondaryButtonStyle, padding: "3px 9px" },
            disabled: state.busy || state.extraImages.length >= MAX_ADDED_IMAGES,
            onClick: () => { if (picker.current !== null) picker.current.click(); },
          }, t("dialog.addImage")),
          h("span", { style: { color: "var(--dsw-alias-label-tertiary, #8a8f98)" } }, t("dialog.paste")),
          h("input", {
            ref: picker,
            type: "file",
            accept: "image/*",
            multiple: true,
            style: { display: "none" },
            onChange: (event) => {
              const files = event.target.files === null ? [] : [...event.target.files];
              event.target.value = "";
              void ingest(files);
            },
          }),
        ),
        imageNotice === null ? null : h("div", { style: { marginTop: "6px", color: "var(--dsw-alias-state-warn-label, #b7791f)" } }, imageNotice),
        h("div", { style: { display: "flex", gap: "8px", marginTop: "12px" } },
          h(OptionCard, {
            selected: !archiveAvailable || state.removeOriginal !== true,
            label: t("dialog.keep"),
            hint: t("dialog.keepHint"),
            disabled: state.busy,
            onSelect: () => { setRemoveOriginal(false); },
          }),
          h(OptionCard, {
            selected: archiveAvailable && state.removeOriginal === true,
            label: t("dialog.remove"),
            hint: t("dialog.removeHint"),
            disabled: state.busy || !archiveAvailable,
            onSelect: () => { setRemoveOriginal(true); },
          }),
        ),
        h("div", { style: { marginTop: "8px", color: "var(--dsw-alias-label-tertiary, #8a8f98)" } }, t("dialog.note")),
        state.error === null ? null : h("div", { style: { marginTop: "8px", color: "var(--dsw-alias-label-error, #d93026)" } }, failure),
        h("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px" } },
          h("button", { type: "button", style: secondaryButtonStyle, disabled: state.busy, onClick: () => { dismissEditor(); } }, t("dialog.cancel")),
          h("button", {
            type: "button",
            style: state.busy || blank ? { ...primaryButtonStyle, opacity: 0.6, cursor: "default" } : primaryButtonStyle,
            disabled: state.busy || blank,
            onClick: () => { void submitDraft(); },
          }, state.busy ? t("dialog.sending") : t("dialog.submit")),
```

</details>

**依据 9 · 源码核查**：[lib/client.js:923-976](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L923-L976)

每会话Map和effect清理

<details>
<summary>查看原文（54行）</summary>

```text
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-edit-question: dictionaries");
      const editors = new Map();
      /**
       * 取（或建）某会话的编辑器。
       * @param sessionId - 会话标识。
       * @returns 编辑器。
       */
      const editorFor = (sessionId) => {
        let editor = editors.get(sessionId);
        if (editor === undefined) {
          editor = createEditor(ctx, sessionId);
          editors.set(sessionId, editor);
        }
        return editor;
      };
      ctx.effect(() => () => { editors.clear(); }, "dsh-edit-question: per-session editors");
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

**依据 10 · 作者声明**：[docs/DEVELOPMENT.md:175-202](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/docs/DEVELOPMENT.md#L175-L202)

作者给出GUI/日志实测描述，但未在本轮独立执行

<details>
<summary>查看原文（28行）</summary>

````text
已实测（真实 GUI + 会话日志双重证据）：

```powershell
$env:PYTHONIOENCODING='utf-8'
C:\Python314\python.exe tools\verify-gui.py e2e first    # 编辑第 1 轮提问
C:\Python314\python.exe tools\verify-gui.py e2e second   # 编辑第 2 轮提问
C:\Python314\python.exe tools/e2e-image-edit.py          # 图片重发 + 「删除原会话」出口
C:\Python314\python.exe tools/e2e-paste-image.py         # 对话框里粘贴补充图片
node tools\read-session.mjs 'C:\Users\Samuel\.dsh\sessions\--D-AIWorkSpace-ds-harness--\session-<子会话id>\session.v4.jsonl.zstd' --limit 40 --raw
```

- `e2e first`：父会话 `session-4e7a8baa`（1 轮）→ 编辑第 1 轮 → 子会话 `session-6891464f` 只含「请只回复两个字：好的」及其回答，
  原提问与回答完全不在事件日志里（插件日志 `turn=1 userSeq=8 cut=0`）。
- `e2e second`：父会话 `session-1699fb3a`（2 轮）→ 编辑第 2 轮 → 子会话 `session-bc1aa794` 继承 `seq 0..18`（第 1 轮完整保留），
  随后是编辑后的「请只回复两个字：明白了吗」，原第 2 轮（`请只回复两个字：明白`）及其回答未被继承
  （插件日志 `turn=2 userSeq=23 cut=18`，切点即第 1 轮 `turn/end`）。
- `e2e-image-edit`：新建会话上传 `shots/edit-button-in-row.png` 并提问 → 编辑该轮提问（对话框显示「原提问带的图片会随本次重发一起带上」）
  → 选「删除原会话」提交 → 插件日志 `forked … at seq 0 -> session-c3f0e3ca`、`archived original session-e4663fbd`，
  新会话日志的 user 消息为 `[image sha256:557a65d7…, text 图片重发自检：请只回复两个字：收到]`（附件 id 与原图一致，即内容寻址复用），
  侧栏原测试会话行消失、只剩新会话的 `(1)` 行。
- `e2e-paste-image`：新建会话上传图 A 提问 → 打开编辑对话框 `paste` 图 B（`paste result: {'ok': True, 'thumbnails': 1}`）→ 提交（保留原会话），
  新会话首条用户消息渲染出 **2 张图**（原图 + 补充图）并正常收到回复，无 page error；会话日志里是
  `[image sha256:557a65d7…(790×168, 13424B), image sha256:25829929…(1440×900, 80885B), text 粘贴补充图片自检…]`，
  即「原图按内容寻址复用 + 补充图新入库」的预期顺序。

验证会在会话列表里留下若干测试会话（标题多为「请只回复两个字…」或「图片重发自检…」）。实测 DSH 0.2.0-rc.2 的 Web GUI 只在
侧边栏行菜单提供「重命名 / 置顶 / 归档」、会话头部「更多操作」只提供「下载 Session 日志 / 反馈」，
**没有物理删除会话的入口**，因此这些测试会话需要手工归档；`tools/probe-sessions.py --archive <row-key>` 可以批量归档。
````

</details>

#### 缺口

- 竞态时序、可见预览与实际prompt附件未实测
  **影响**：未知发生频率和用户可识别程度，不应推断所有图像任务失败
  **进一步探讨**：延迟附件读取与arrayBuffer，分别删首图、关开同题、读图未完提交和提交中删图，核对attachmentId和最终消息

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成合格重问的全流程负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

以“正确前缀、新问题、选定图片、原会话处理均符合选择，且用户理解现实状态未回滚”的一次重问为单位。后台顺序减少了手工复制，但把边界核对和失败定位仍留给用户。现金费用与人工时间分别评价；本轮没有合格交付样本、调用账单、耗时或真实频率，因此不能输出有限单位成本、免费、ROI或节时百分比。图片base64、预览和提交可能分别读取同一原图，内容寻址去重不等于没有传输/内存成本。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web客户端slot、sessions、uiWorkspace、locale及静态React/store模块 | 启动必需 | 加载按钮、状态和会话操作；Node声明>=20，开发笔记指0.2.0-rc.2 | 服务或模块不兼容会阻止功能，版本范围声明不代表验收 |
| 正确timeline与可定位开场user节点 | 每次重问必需 | 找目标和紧邻前轮end | 无user则无入口；无有效前轮end退0，可能少前缀 |
| 原会话附件读取权限及支持图像的模型 | 图片重问必需 | 读字节并在child准入 | 失败停止或prompt拒绝；非图片文件不重发 |
| archiveSession | 归档可选 | 重发成功后整理原会话 | 缺接口保留原会话；错误只console告警 |
| 用户核对工作区与会话状态 | 有工具副作用或失败时必需 | 识别上下文与现实状态不一致 | 不自动回滚，应停下核对并退回人工流程 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定宿主和插件版本，备份profile，按README单一方式手工挂载 | bundle和手工insert不重复；模块解析/刷新成功，否则撤回配置 |
| 2 | 用户在无副作用隔离会话点编辑，确认原文、前缀与图片并切为保留原会话 | 不把默认归档当保留；图像错位或缺前文即停止 |
| 3 | 后台先读原图、fork、等待child就绪并queue新问 | 在子会话核对前缀、新问和附件；失败不盲目重试 |
| 4 | 用户核对旧会话保留/归档及真实文件状态 | 归档失败查列表；prompt失败查console childId/会话日志后人工接管 |
| 5 | 用户退出评估时撤除手工insert和junction并刷新；清理试验分支 | 禁用不撤销已建child或恢复旧会话，归档需另外恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主运行与环境资源金额未知 | 固定版本、挂载、配置备份和隔离核对，耗时未知 | 未验证npm发布，README推荐手工路径；禁止重复挂载 |
| 持续使用 | 每次新模型回答、图片传输/base64内存与分支存储，金额未知 | 改问、等待图像、核对前缀与结果，耗时未知 | 作者称内容寻址去重，未独立确认；无真实任务频率 |
| 失败恢复 | 可能增加分支及重复调用，实际次数未知 | 找child、确认投递/归档与现实状态，耗时未知 | 多阶段操作未提供完整恢复UI，失败尝试须计入 |
| 升级与退出 | 既有会话存储不会因禁用自动消失 | 适配slot/DOM、撤配置、归档/恢复试验会话 | 未执行卸载；禁用不撤销真实副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动编辑前缀重问 | 按目标轮计算cut并fork后prompt的实际调用 | 宿主多轮/队列前缀正确率及相对手工节时 |
| 原图选择与补图 | 有读取、预览、删除、添加、重发路径 | 异步时序下所见与所发一致性及宿主图像准入 |
| 会话整理 | 成功prompt后可归档并切child | 归档失败的用户可察觉程度和找回成本 |
| 失败恢复 | 有busy和阶段错误提示，console记录childId | 响应丢失下重复分支/模型调用及合格任务总成本 |

README说npm尚未发布并给Windows junction/profile挂载方法，本轮不拿包名证明可下载；package中的Node和peer范围只是声明。开发笔记的“默认保留”与当前open的removeOriginal=true不符，实际采用建议以当前代码和README默认归档为准。手工insert与bundle同时存在有同ID冲突说明；退出撤配置不能清理已产生会话，也不能补偿工具动作。应先确定用户实际承担复制前缀/找图的负担超过这些核对成本，才讨论持续采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-72](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/README.md#L19-L72)

手工安装、双重挂载、用法和限制的作者依据

<details>
<summary>查看原文（54行）</summary>

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

> ⚠️ 不要同时使用两种方式：`package.json` 里的 `dsh.bundle.patch`（供 `dsh plugin add` 用）与 profile 里的手工 `insert` 行
> 会用同一个 id 挂载两次，启动时报错。迁移到 bundle 安装前，先删掉 profile 里那行 `- id: edit-question`。

## 用法

1. 把鼠标移到任意一轮的提问气泡上，动作行里点「✎ 编辑提问」；
2. 修改文本，可选：粘贴图片补充、或删掉已补的图；
3. 确认「保留原会话」或「删除原会话」（默认删除）；
4. 点「丢弃后续并重发」，界面切换到新会话。

![在原会话上打开编辑器：原文、原图提示、两个出口](https://raw.githubusercontent.com/Akiccat/dsh-edit-question/main/shots/e2e-paste-01-dialog.png)

![重发后：新会话带图，原会话按选择保留或归档](https://raw.githubusercontent.com/Akiccat/dsh-edit-question/main/shots/e2e-image-05-after-submit.png)

## 已知限制

- 「删除原会话」实际调用的是 DSH 原生**归档**（`uiWorkspace.archiveSession`，没有物理删除会话的接口），可在「已归档」里恢复；
  要彻底删掉得自己清理 `~/.dsh/sessions/` 下对应目录。
- 文件类附件（非图片）不重发：它的上传回执（`receiptId`）只对原会话有效，对话框会单独提示。
- 当前模型需支持图片输入，否则宿主会在 prompt 准入时拒绝并给出提示。
- 入口位置依赖宿主 DOM 契约（`data-chat-flow-kind` / `data-chat-turn` / `data-clock`），宿主改版时会自动退回轮尾一行（功能不受影响）。

## 开发

````

</details>

**依据 2 · 源码核查**：[lib/client.js:350-365](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L350-L365)

实际默认归档

<details>
<summary>查看原文（16行）</summary>

```text
        open(input) {
          const images = Array.isArray(input.images) ? input.images : [];
          store.set({
            open: true,
            text: input.text,
            busy: false,
            error: null,
            atSeq: input.atSeq,
            userSeq: input.userSeq,
            images,
            extraImages: EMPTY_IMAGES,
            files: input.files === true,
            removeOriginal: true,
          });
          // 缩略图必须读回字节才能显示；attachment 只对原会话授权，所以在这里读。
          if (images.length > 0) void loadOriginalPreviews(images, input.userSeq);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:415-482](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/lib/client.js#L415-L482)

资源操作和恢复人工负担的真实链路

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

**依据 4 · 作者声明**：[package.json:1-77](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/package.json#L1-L77)

包入口、分发、引擎和peer声明

<details>
<summary>查看原文（77行）</summary>

```text
{
  "name": "dsh-edit-question",
  "version": "0.1.1",
  "description": "编辑已发送的提问并重新发送：图片一并重发，从该提问重新开始，丢弃其后的全部对话记录。",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "edit-message",
    "conversation"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/Akiccat/dsh-edit-question"
  },
  "bugs": {
    "url": "https://github.com/Akiccat/dsh-edit-question/issues"
  },
  "homepage": "https://github.com/Akiccat/dsh-edit-question#readme",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "locale",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "publishConfig": {
    "access": "public"
  },
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
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-client-store": {
      "optional": true
    },
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "license": "MIT"
}
```

</details>

**依据 5 · 作者声明**：[docs/DEVELOPMENT.md:13-15](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/docs/DEVELOPMENT.md#L13-L15)

作者环境声明不是本轮宿主验收

```text
- 插件包：`pkg/`（宿主半边 `pkg/lib/index.js` 为空实现，全部逻辑在浏览器半边 `pkg/lib/client.js`）
- 运行前提：DSH 桌面版 0.2.0-rc.2（`@deepseek-ai/dsh-client-ui-chat` 提供 `conversation.chat.turnTail` 插槽与 `useChat` 工具包）
- 安装位置：`C:\Users\Samuel\.dsh\profiles\desktop`（profile 的 `node_modules` 目录联接 + `cordis.patch.yml` 的 insert 行）
```

**依据 6 · 作者声明**：[docs/DEVELOPMENT.md:63-68](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/docs/DEVELOPMENT.md#L63-L68)

开发笔记默认保留与实际open默认归档冲突，按源码取值

```text
- 两个出口：`removeOriginal` 状态来自对话框的二选一，默认「保留原会话」。选「删除」时在 **fork + prompt 都成功之后**调用
  `ctx.uiWorkspace.archiveSession(sessionId, {stopActivity:true})`——DSH 没有物理删除会话的接口（`dsh-session-persistence-jsonl` 明确「seam 无删除接口」），
  归档是原生唯一的「从列表移除」语义，可在「已归档」里恢复；归档失败只记 `console.warn`，不影响新会话。
- 提交链路：`readAttachment`（有图片时）→ `ctx.sessions.fork({sessionId, atSeq, increaseTitle:true})` → `ctx.sessions.using(childId, {source:"edit-question"}, …)`
  → `binding.session.prompt([...imageParts, {type:"text", text}], "queue")` →（可选归档原会话）→ `ctx.uiWorkspace.openSession(childId)`。
- 每个会话一份编辑器状态（`createSnapshotStore`），通过插槽 `hooks: { editor }` 暴露为 `useEditor`；文本经过词典服务（zh/en）。
```

**依据 7 · 作者声明**：[docs/DEVELOPMENT.md:70-90](https://github.com/Akiccat/dsh-edit-question/blob/3f056a1654466ebf400ab9c23a5efc9cb938c97b/docs/DEVELOPMENT.md#L70-L90)

作者手工配置和卸载说明

<details>
<summary>查看原文（21行）</summary>

````text
## 安装 / 卸载

安装（等价于 `plugin_manager` 的 `install_bundle` 手工版，因为本会话没有该工具）：

```powershell
# 1) 让 profile 能解析到包：目录联接（junction，不需要管理员权限）
New-Item -ItemType Junction -Path 'C:\Users\Samuel\.dsh\profiles\desktop\node_modules\dsh-edit-question' `
  -Target 'D:\AIWorkSpace-ds-harness\scripts\dsh-edit-message-plugin\pkg'
```

```yaml
# 2) 在 profile 的 cordis.patch.yml 末尾追加（本仓库已追加，备份见 cordis.patch.yml.bak-before-edit-question）
- insert:
    - id: edit-question
      name: dsh-edit-question
```

profile 的 `cordis.patch.yml` 受 HMR 监视：改完即热重组，**不需要重启应用**；浏览器端代码在刷新页面后生效
（客户端包按内容哈希发版，宿主按新哈希提供 `plugins/??dsh-edit-question/client.js&rev=…`）。

卸载：删掉 `cordis.patch.yml` 里的 insert 行与那个 junction 即可；插件不写任何其他状态。
````

</details>

#### 缺口

- 首次/持续/恢复时间、费用及合格率未知
  **影响**：不能确认便利入口是否降低总负担
  **进一步探讨**：在相同宿主模型和任务下对照手工复制/分叉，计入所有失败与复核并分别报告现金和时间

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
