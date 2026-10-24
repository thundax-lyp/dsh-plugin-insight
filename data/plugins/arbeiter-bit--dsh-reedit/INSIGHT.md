# dsh-reedit

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[dddb974](https://github.com/Arbeiter-bit/dsh-reedit/tree/dddb9749cdf14358e535ab772e938102d104e9a6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Arbeiter-bit/dsh-reedit)
<!-- END META -->

> **实现功能**：双击自己的消息进行文本改写，在原消息前分叉会话并重发，原对话保留。

> **核心亮点**：相对复制文字并手工找分叉点，插件把旧消息定位、编辑和fork/prompt/open串成一次操作，顺应追加日志约束而保留原会话。分叉能力归宿主，插件贡献是交互整合，不能把聊天分支等同于文件或外部系统回滚。[Q01](#research-q01)

> **风险与缺陷**：改写能否保留原请求语义决定适用范围。渲染层解析图片、文件和referenceLabels，但editResend只发送一个文本块；带附件消息的重发不再携带原附件。fork先于prompt成功，失败后重试会再fork且未见复用已有childId，可能留下多个分支。新分支重跑也不会自动撤销原会话已产生的文件或外部副作用。[Q02](#research-q02)

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
  - [Q01 · 双击改写如何产生新会话，增量是什么？](#detail-section-11)
  - [Q02 · 附件、失败和重跑有什么限制与成本？](#detail-section-12)
  - [Q03 · 保留结构化消息及幂等分支能否改善重发？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要修正较早文字提示的用户，从该消息之前重新继续，保留原会话供比较。

替代为宿主手动fork到指定点并复制修正后的提示。插件减少点击和定位，仍没有重跑外部操作的事务性或自动撤销。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息文字编辑 | 在原位置打开编辑框 | 只编辑文本，点击外部取消 |
| 分支重发 | 从原消息前继续新提示 | 不改原日志，不自动重附附件或回滚现实副作用 |
| 分支来源提示 | 提醒原会话仍保留 | 浏览器localStorage可用，非宿主事实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| web React与slots | 启动必需 | 替换用户消息气泡 | 契约变化影响所有用户消息渲染 |
| sessions与uiWorkspace | 重发必需 | fork/create/prompt及打开会话 | 失败可能遗留已创建分支 |
| localStorage | 仅提示可选 | 保存分支来源提示 | 失败不阻止分支但失去提示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对消息类型和现实副作用 | 适合纯文本重跑 |
| 编辑 | 双击自己的消息并改文本 | 确认分叉会丢弃后续会话内容 |
| 重发 | 确认后宿主fork并prompt | 新文本接受后打开分支 |
| 验收 | 用户核对消息边界和附件 | 失败先查已有分支再重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 现有宿主，金额未知 | 安装、核对用户消息渲染 | 私有包走源码安装 |
| 持续使用 | 新分支与后续模型重跑费用未知 | 编辑文字、补附件、验收副作用 | 不自动回滚文件 |
| 失败恢复 | 多分支和重试资源未知 | 查找已建分支、避免重复发送 | prompt拒绝后childId未复用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原会话保留 | 只调用fork/create和新会话prompt | 宿主运行与跨版本边界 |
| 文本修正 | 编辑文本被提交到新分支 | 附件语义不自动保留 |
| 操作简化 | 自动打开分支 | 人工节时与重跑费用无对照 |

> **思考**：改写能否保留原请求语义决定适用范围。渲染层解析图片、文件和referenceLabels，但editResend只发送一个文本块；带附件消息的重发不再携带原附件。fork先于prompt成功，失败后重试会再fork且未见复用已有childId，可能留下多个分支。新分支重跑也不会自动撤销原会话已产生的文件或外部副作用。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对复制文字并手工找分叉点，插件把旧消息定位、编辑和fork/prompt/open串成一次操作，顺应追加日志约束而保留原会话。分叉能力归宿主，插件贡献是交互整合，不能把聊天分支等同于文件或外部系统回滚。[Q01](#research-q01)

相对复制文字并手工找分叉点，插件把旧消息定位、编辑和fork/prompt/open串成一次操作，顺应追加日志约束而保留原会话。分叉能力归宿主，插件贡献是交互整合，不能把聊天分支等同于文件或外部系统回滚。[Q01](#research-q01)

复用宿主追加日志和会话接口比自造事件类型更容易保持兼容，effect管理slot注册，primitives guarded加载有降级。代价是复制原生消息渲染，文件卡片和未知块需要持续跟宿主变更；编辑状态与childId未形成恢复协议。可借鉴按事件前边界fork的思路，复用需结构化消息和幂等操作。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

改写能否保留原请求语义决定适用范围。渲染层解析图片、文件和referenceLabels，但editResend只发送一个文本块；带附件消息的重发不再携带原附件。fork先于prompt成功，失败后重试会再fork且未见复用已有childId，可能留下多个分支。新分支重跑也不会自动撤销原会话已产生的文件或外部副作用。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在纯文本、无不可逆副作用的会话试用，确认分支止于旧消息之前且新文本只发一次；附件消息需自行重附，涉及文件或外部发送的重跑先核对现实状态。失败后先查是否已创建分支，再决定重试。[Q02](#research-q02)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

分支重发链有源码支持，编辑仅重发文本，原附件和标签未进入新负载；失败可能留下新分支，真实宿主兼容和外部任务影响未验收。新假设未实现。

- 已检查：作者 README、包清单、源码路径 client.js、index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查空host、完整客户端与清单，未检查宿主fork的运行实现或执行重发，不声称真实会话验收。
- 下一步：在隔离会话覆盖首消息、普通文本、图文、文件和prompt拒绝，检查分支事件、附件、重复创建与原会话；另对可撤销文件任务验证重跑不会被误认为回滚。本轮未执行。

**分析版本**

- **仓库**：[Arbeiter-bit/dsh-reedit](https://github.com/Arbeiter-bit/dsh-reedit)
- **版本号**：0.1.0（[固定提交 dddb974](https://github.com/Arbeiter-bit/dsh-reedit/tree/dddb9749cdf14358e535ab772e938102d104e9a6)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是结构化消息编辑，默认保留附件和标签、明确列出被替换文本，并把一次编辑操作绑定childId直到确认成功，避免重试重复分支。用文字、图文、文件和拒绝后重试矩阵对照，要求新消息语义不丢且一次操作最多一个分支；若附件权限不可迁移或重试仍重复，则否定其完整性主张。[Q03](#research-q03)

在隔离会话覆盖首消息、普通文本、图文、文件和prompt拒绝，检查分支事件、附件、重复创建与原会话；另对可撤销文件任务验证重跑不会被误认为回滚。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 374 | 288 | 70 | — |
| .md | source | 1 | 72 | — | — | 446 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Arbeiter-bit/dsh-reedit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分支重发能否安全修正历史输入，附件与现实副作用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 双击改写如何产生新会话，增量是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件替换user消息slot，编辑框预填消息文本，确认调用editResend。userSeq大于零时fork到前一个事件，否则创建新会话；新分支接受文本prompt后才打开主面板并记来源提示。相对手工分叉和复制，它把定位和重发连成一次操作，遵守原日志追加约束，host本身没有写原会话。分叉与新提示是宿主能力，不能据此宣称工作区文件或外部世界也回到旧状态。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:330-353](https://github.com/Arbeiter-bit/dsh-reedit/blob/dddb9749cdf14358e535ab772e938102d104e9a6/client.js#L330-L353)

事件前边界、文本prompt和插槽替换构成完整调用链。

<details>
<summary>查看原文（24行）</summary>

```text
        const editResend = async (hostSessionId, userSeq, text) => {
          const cwd = ctx.sessions.list.getSnapshot().byId[hostSessionId]?.cwd
          const childId = userSeq > 0
            ? await ctx.sessions.fork({ sessionId: hostSessionId, atSeq: userSeq - 1, increaseTitle: true })
            : await ctx.sessions.create(cwd === undefined ? {} : { cwd })
          const outcome = await ctx.sessions.using(childId, { source: 'editResend' }, reference =>
            reference.binding.session.prompt([{ type: 'text', text }], 'queue'))
          if (outcome === null || typeof outcome !== 'object' || outcome.ok !== true) {
            throw new Error(`dsh-reedit: the resend was not accepted (${JSON.stringify(outcome)})`)
          }
          ctx.uiWorkspace.openSession(childId)
          // Record the viewing hint before the branch renders.
          rememberEditedBranch(childId, text)
        }

        // Own the `user` Chat node: only the bubble's own DOM can carry
        // double-click editing and the hover hint, which the shipped bubble
        // keeps internal. The lowest priority wins the cell.
        ctx.effect(() => ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
          name: 'conversation.chat.node',
          key: 'user',
          priority: -1,
          inject: () => ({ editResend }),
        }, UserMessageRow)), 'dsh-reedit: user message renderer')
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 附件、失败和重跑有什么限制与成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、工程质量与复用、采用判断

#### 完整回答

userContentParts为显示解析图片、文件和其余块，编辑值却只有拼接文本，重发负载只有text，没有原附件和referenceLabels。fork在prompt之前，拒绝会throw，重试没有复用childId，因此可能产生多个空或未完成分支。新模型重跑还可能再次操作原文件或服务，原会话保留不能撤销这些副作用。首次成本是兼容检查，持续是模型重跑与人工复核，失败是查分支和补附件，金额和时间未知。适合纯文本与可控副作用试用，附件和关键外部动作需手动核对。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:91-105](https://github.com/Arbeiter-bit/dsh-reedit/blob/dddb9749cdf14358e535ab772e938102d104e9a6/client.js#L91-L105)

显示层识别多种结构化内容，但不等于重发保留。

<details>
<summary>查看原文（15行）</summary>

```text
    /** Split one user message's blocks exactly as the shipped bubble does. */
    function userContentParts(content) {
      const texts = []
      const attachments = []
      const rest = []
      for (const block of Array.isArray(content) ? content : []) {
        if (block === null || typeof block !== 'object') { rest.push(block); continue }
        if (block.type === 'text' && typeof block.text === 'string') texts.push(block.text)
        else if (block.type === 'image' && block.attachment !== undefined) {
          attachments.push({ type: 'image', image: { attachment: block.attachment } })
        } else if (block.type === 'file' && block.attachment !== undefined) {
          attachments.push({ type: 'file', file: block.attachment })
        } else rest.push(block)
      }
      return { text: texts.join(''), attachments, rest }
```

</details>

**依据 2 · 源码核查**：[client.js:211-216](https://github.com/Arbeiter-bit/dsh-reedit/blob/dddb9749cdf14358e535ab772e938102d104e9a6/client.js#L211-L216)

编辑提交只给draft文本，失败保留为重试状态。

```text
          onClick: () => {
            if (state === 'pending' || draft.trim() === '') return
            setState('pending')
            editResend(sessionId, data.seq, draft)
              .then(() => { setEditing(false); setState('idle') })
              .catch(() => { setState('failed') })
```

**依据 3 · 源码核查**：[client.js:330-342](https://github.com/Arbeiter-bit/dsh-reedit/blob/dddb9749cdf14358e535ab772e938102d104e9a6/client.js#L330-L342)

fork先于仅文本prompt，失败后childId没有返回或复用。

<details>
<summary>查看原文（13行）</summary>

```text
        const editResend = async (hostSessionId, userSeq, text) => {
          const cwd = ctx.sessions.list.getSnapshot().byId[hostSessionId]?.cwd
          const childId = userSeq > 0
            ? await ctx.sessions.fork({ sessionId: hostSessionId, atSeq: userSeq - 1, increaseTitle: true })
            : await ctx.sessions.create(cwd === undefined ? {} : { cwd })
          const outcome = await ctx.sessions.using(childId, { source: 'editResend' }, reference =>
            reference.binding.session.prompt([{ type: 'text', text }], 'queue'))
          if (outcome === null || typeof outcome !== 'object' || outcome.ok !== true) {
            throw new Error(`dsh-reedit: the resend was not accepted (${JSON.stringify(outcome)})`)
          }
          ctx.uiWorkspace.openSession(childId)
          // Record the viewing hint before the branch renders.
          rememberEditedBranch(childId, text)
```

</details>

#### 缺口

- 附件迁移权限及重复分支实际表现未知。
  **影响**：不能承诺任意用户消息语义保持。
  **进一步探讨**：覆盖图文、文件和拒绝后重试，检查新消息完整内容及分支数量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 保留结构化消息及幂等分支能否改善重发？

**研究主题**：新假设与验证

#### 完整回答

由显示解析与提交纯文本之间的落差，可提出未验证结构化编辑协议，保留附件与标签并让用户显式删除；一次编辑保存childId和操作标识，失败只在同分支续提。它会增加附件权限及UI状态维护，不能直接假定宿主允许复制所有附件。最小验证为文本、图片、文件、标签和拒绝重试矩阵，要求新消息语义完整且一次操作最多一个分支；若迁移权限失败或重复提交不能判定，需限制功能范围而不是宣称完整编辑。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:330-342](https://github.com/Arbeiter-bit/dsh-reedit/blob/dddb9749cdf14358e535ab772e938102d104e9a6/client.js#L330-L342)

只文本提交和局部childId是改进推导来源，非当前实现。

<details>
<summary>查看原文（13行）</summary>

```text
        const editResend = async (hostSessionId, userSeq, text) => {
          const cwd = ctx.sessions.list.getSnapshot().byId[hostSessionId]?.cwd
          const childId = userSeq > 0
            ? await ctx.sessions.fork({ sessionId: hostSessionId, atSeq: userSeq - 1, increaseTitle: true })
            : await ctx.sessions.create(cwd === undefined ? {} : { cwd })
          const outcome = await ctx.sessions.using(childId, { source: 'editResend' }, reference =>
            reference.binding.session.prompt([{ type: 'text', text }], 'queue'))
          if (outcome === null || typeof outcome !== 'object' || outcome.ok !== true) {
            throw new Error(`dsh-reedit: the resend was not accepted (${JSON.stringify(outcome)})`)
          }
          ctx.uiWorkspace.openSession(childId)
          // Record the viewing hint before the branch renders.
          rememberEditedBranch(childId, text)
```

</details>

#### 缺口

- 跨分支附件引用和幂等prompt契约未知。
  **影响**：方案可能需要宿主支持。
  **进一步探讨**：先定义附件和操作标识协议，验证权限与断线恢复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
