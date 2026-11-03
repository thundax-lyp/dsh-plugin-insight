# dsh-undo rollback bundle

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback)

<!-- BEGIN META -->
[![npm 30d 1,256](https://img.shields.io/static/v1?label=npm+30d&message=1%2C256&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin)
<!-- END META -->

> **功能**：为 DSH 提供消息级文件与会话回退、归档管理及网页回退界面。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，它把私有文件树、精确会话前缀和归档接成一个 DSH 安装入口，减少手工对齐责任。私有索引与恢复算法由内部包实现，组合配置本身不构成独立新算法。

> **主要限制**：[Q03](#research-q03) 发现，文件恢复或补偿失败后仍可能写回 ready，而启动恢复不会重新核验该阶段。保护机制存在，但不能把可再次回退的状态名当无损恢复证明；目前应观察，并保留独立备份。

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
  - [Q01 · 组合包为谁减少哪种撤销交接，实际安装并接管哪些宿主能力？](#detail-section-11)
  - [Q02 · 回退如何把文件树与会话分叉对齐，中途失败与重启如何处理？](#detail-section-12)
  - [Q03 · 哪些失败和工作区边界会使“可撤销”不足以证明无损恢复？](#detail-section-13)
  - [Q04 · 如何以可控成本评估和退出，效果需要什么证据？](#detail-section-14)
  - [Q05 · 如何让补偿失败后的状态比普通 ready 更可判断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 网页端修改本地代码的用户，可用组合入口协调文件恢复、会话分叉与归档；共享写者和外部副作用须另行处理。

简单替代是手工恢复 Git 文件，再分叉或新建会话并管理旧记录。比较只支持协调步骤的机制差异，没有同条件性能或效果排名；不宣称宿主没有原生归档和分叉。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 组合加载 | 将七个服务端和网页组件加入 DSH | 接管原生归档，需核对 profile 和宿主版本 |
| 消息级回退 | 配合私有文件树生成排除目标消息的子会话 | 限支持工作区；不撤销外部副作用 |
| 归档管理接线 | 将原会话保留到插件归档表面 | 依赖内部 archive 服务，退出须交接原生配置 |
| 网页回退入口 | 页头按钮刷新目标并调用回退服务 | 需要网页运行时与远程接口 |
| 中断恢复 | 对特定持久阶段核对实际文件与会话状态 | ready 降级后的复核缺口见 Q03 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 与七个内部包 | 启动必需 | 加载组合服务；作者声明 rc.6 或更新 | 版本范围不等于后续版本兼容已验 |
| DSH 网页表面 | 四个客户端组件必需 | 按钮、归档设置、卡片与折叠 | 无界面部署需按补丁说明去掉相应行 |
| Git 普通工作区且无已登记子模块 | 文件回退必需 | 私有树捕获与恢复 | 检查失败会拒绝接纳或回退 |
| 可写的应用数据目录与磁盘容量 | 回退与归档必需 | 私有 Git 对象、日志、归档元数据 | 快照失败会拒绝消息；容量需求未知 |
| 独立备份、单写者副本 | 安全评估前提 | 检查不确定恢复与外部写者 | 不可将插件当唯一恢复保障 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份工程、会话、profile 和插件数据，核实来源与依赖解析 | 身份不明或无法保留恢复材料时停止 |
| 加载 | 用户按作者命令将包加到 web profile 并重启 | 核对七组件及归档接管；本轮未执行 |
| 建点 | 插件在模型接纳前捕获私有树 | 快照失败应拒绝消息，用户不当作已完成任务 |
| 回退 | 用户选择目标，插件静止受控任务、分叉、恢复文件并归档 | 检查实际文件、子会话前缀和原归档，返回错误即停写核查 |
| 退出 | 用户保留恢复材料，撤销组合配置并核对原生归档恢复 | 历史会话可见和文件已知后再处理存储，不凭移除包认定交接完成 |

**效果与成本**

[Q04](#research-q04) 按首次、持续、失败恢复与退出列出现金资源和人工成本；金额、耗时及容量增长均缺实测，未把未知记零。

[Q04](#research-q04) 的效果表区分正常协调机制、作者兼容声明与未测结果；缺少同任务合格率和端到端成本对照，不能推出节时或收益比例。

> **思考**：[Q03](#research-q03) 发现，文件恢复或补偿失败后仍可能写回 ready，而启动恢复不会重新核验该阶段。保护机制存在，但不能把可再次回退的状态名当无损恢复证明；目前应观察，并保留独立备份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，它把私有文件树、精确会话前缀和归档接成一个 DSH 安装入口，减少手工对齐责任。私有索引与恢复算法由内部包实现，组合配置本身不构成独立新算法。

[Q02](#research-q02) 的私有索引、持久阶段和实际态复核适合借鉴到多资源协调。 [Q03](#research-q03) 则提示异常后不能只复位状态名，移植时必须给部分写入与补偿失败保留可核对结果；实例内 Set 也不能替代跨进程工作区所有权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 发现，文件恢复或补偿失败后仍可能写回 ready，而启动恢复不会重新核验该阶段。保护机制存在，但不能把可再次回退的状态名当无损恢复证明；目前应观察，并保留独立备份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先观察。能维护 DSH 的开发者可在独立备份、单写者副本中评估正常回退与失败状态，核对文件、子会话和归档三个结果；出现恢复要求或任一不一致就停写，回到备份与手工会话管理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已重新检查固定源码、组合接线、关键失败与恢复分支。既有协调机制有源码依据，补偿失败后阶段降级是静态可见缺口，未运行复现；未来状态约束仍是待验证假设。

- 已检查：作者 README、包清单、源码路径 packages/bundle-rollback/package.json、packages/bundle-rollback/cordis.patch.yml、packages/client-rollback-button/src/client/index.ts、packages/client-rollback-button/src/client/controller.ts、packages/bundle-rollback/README.md、packages/rollback-undo/src/index.ts、packages/rollback-fork/src/index.ts、packages/rollback-undo/src/shadow-git.ts、README.md、packages/rollback-archive/src/index.ts、packages/client-rollback-button/package.json 及固定范围 inventory；组件：packages/bundle-rollback。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计仅 packages/bundle-rollback；为核查核心承诺定向检查同提交的 undo、ShadowGit、fork、archive 和客户端入口。不是全仓审计，未执行目标代码、安装、测试或宿主任务；当前 GitHub 身份请求失败不代表仓库删除。
- 下一步：在独立副本中按 [Q05](#research-q05) 的恢复、分叉、归档、补偿与重启故障矩阵比较实际文件树、会话种子和归档成员；记录错误继续、恢复耗时与人工量，再决定是否值得试用。

**分析版本**

- **仓库**：[23swccp/dsh-undo](https://github.com/23swccp/dsh-undo)
- **版本号**：0.1.0-rc.8（[固定提交 bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出把普通异常的补偿结果纳入现有三资源核对，未核清前保持恢复要求。它相对现有启动恢复增加运行时约束；能否减少错误继续写入，需同条件故障对照，尚未验证。

在独立副本中按 [Q05](#research-q05) 的恢复、分叉、归档、补偿与重启故障矩阵比较实际文件树、会话种子和归档成员；记录错误继续、恢复耗时与人工量，再决定是否值得试用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 163 |
| .ts | source | 1 | 4 | 2 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-03），可前往 [GitHub Issues](https://github.com/23swccp/dsh-undo/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的 DSH 回退组合包能否为编程用户提供文件与模型会话一致的撤销，在哪些状态与安装条件下值得试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 组合包为谁减少哪种撤销交接，实际安装并接管哪些宿主能力？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

它面向在 DSH 网页端反复修改本地代码、需要放弃某一轮尝试的编程用户。合格结果不只是文件回到旧版，还要求新会话不再携带被撤销提示词和工具记录，并保留可查的原会话。简单替代是先用版本控制恢复文件，再另开或分叉会话、手工管理旧对话；该比较描述操作责任，不宣称宿主没有任何分叉能力，也没有同条件节时数据。

组合包自身发布配置补丁，包清单以 dsh.bundle.patch 指向 cordis.patch.yml，并声明七个内部包。补丁插入三个服务端组件和四个网页组件，给回退日志与归档元数据分别设置应用数据目录。它还明确禁用原生 ui-settings-archive、session-archive，使插件归档服务占用同一远程命名空间。这种替换消除了作者指出的挂载冲突，同时让安装与退出承担恢复原生归档配置的责任。

实际入口并非只有说明书。客户端挂载 conversationUndo/current，注册会话页头动作，点击时刷新当前消息再调用控制器；控制器把会话和消息标识传给 undoLatest，成功后客户端打开子会话。命令入口与消息快照监听由 rollback-undo 提供。因此本组件的独立贡献是把已有内部机制编排为一个可加载入口，不能将内部私有 Git 算法归为这份配置的独创。作者的“永远看不到撤销内容”只应限定于截断后的新会话种子，不等于抹除原归档、文件或外部服务中的记录。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle-rollback/package.json:23-37](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L23-L37)

发布物和 dsh.bundle.patch 明确组件是宿主配置组合入口。

<details>
<summary>查看原文（15行）</summary>

```text
  "files": ["cordis.patch.yml"],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@dsh-undo/client-rollback-button": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-settings": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-toolcards": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-trailfold": "^0.1.0-rc.8",
    "@dsh-undo/rollback-archive": "^0.1.0-rc.8",
    "@dsh-undo/rollback-fork": "^0.1.0-rc.8",
    "@dsh-undo/rollback-undo": "^0.1.0-rc.8"
```

</details>

**依据 2 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:8-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L8-L44)

插入七个包并禁用两个原生归档组件，证明接管而非旁路按钮。

<details>
<summary>查看原文（37行）</summary>

```text
- insert:
    - id: rollback-fork
      name: '@dsh-undo/rollback-fork'

    - id: rollback-archive
      name: '@dsh-undo/rollback-archive'
      config:
        root: !!js dshHomePath('rollback-archive')

    - id: rollback-undo
      name: '@dsh-undo/rollback-undo'
      config:
        root: !!js dshHomePath('rollback-undo')

    - id: client-rollback-button
      name: '@dsh-undo/client-rollback-button'

    - id: client-rollback-settings
      name: '@dsh-undo/client-rollback-settings'

    - id: client-rollback-toolcards
      name: '@dsh-undo/client-rollback-toolcards'

    - id: client-rollback-trailfold
      name: '@dsh-undo/client-rollback-trailfold'

# The base web-app bundle also ships ui-settings-archive and session-archive,
# whose sessionArchive Remote contributions claim the namespace first and block
# this bundle's tombstone/untombstone/restore/delete endpoints from mounting
# client-side. Disable both so the rollback archive surface owns the namespace.
- id: ui-settings-archive
  name: '@deepseek-ai/dsh-client-ui-settings-archive'
  disabled: true

- id: session-archive
  name: '@deepseek-ai/dsh-session-archive'
  disabled: true
```

</details>

**依据 3 · 源码核查**：[packages/client-rollback-button/src/client/index.ts:74-111](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/index.ts#L74-L111)

挂载远程服务、刷新目标并打开成功返回的新会话。

<details>
<summary>查看原文（38行）</summary>

```text
/** Mount the plugin Remote and register the session-header rollback action. */
export async function apply(ctx: ClientContext): Promise<() => void> {
  const disposeRemote = await mountOnce(ctx, TYPERT_REMOTE, 'conversationUndo/current')
  const sessions = ctx.get('sessions') as unknown as Pick<ISessions, 'open'> & SessionsListRuntime
  const workspaces = ctx.get('workspaces') as WorkspacesPort | undefined
  const undoRemote = ctx.get('remote.conversationUndo') as ConversationUndoRemote
  const commandUi = ctx.get('commandUi') as unknown as CommandUiPort | undefined
  const controllers = new Map<SessionId, ConversationUndoController>()
  const controllerFor = (sessionId: SessionId): ConversationUndoController => {
    let controller = controllers.get(sessionId)
    if (controller === undefined) {
      controller = new ConversationUndoController(undoRemote, sessionId)
      controllers.set(sessionId, controller)
      void controller.ensure()
    }
    return controller
  }
  let autoFollowSuspendedUntil = 0
  const disposeFollow = followRollbackChild(workspaces, sessions, undoRemote, () => Date.now() >= autoFollowSuspendedUntil)
  const disposeRegistration = ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'rollback',
    order: 60,
    inject: (sessionId: SessionId): RollbackActionInjected => {
      const controller = controllerFor(sessionId)
      return {
        hooks: { undo: controller },
        refresh: () => { void controller.refresh() },
        checkAdmissionFailure: () => controller.admissionFailure(),
        undo: async () => {
          // The journal can advance while a response is streaming. Refresh at
          // click time so rollback targets the live prompt, not the previous
          // completed message cached by the header action.
          await controller.refresh()
          const messageId = controller.getSnapshot().value?.messageId
          if (messageId === undefined) return
          const result = await controller.undo(messageId)
          if (result !== undefined) keepRollbackChildOpen(sessions, result.sessionId)
```

</details>

**依据 4 · 源码核查**：[packages/client-rollback-button/src/client/controller.ts:119-128](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/controller.ts#L119-L128)

控制器实际调用 undoLatest，绑定当前会话和消息。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Request rollback for one latest approved user message.
   * @param messageId - Latest approved user message to remove.
   * @returns The opened child Session value, if rollback succeeds.
   */
  async undo(messageId: MessageId): Promise<ConversationUndoValue | undefined> {
    await this.ensure()
    return await this.apply(async () => await this.remote.undoLatest({
      sessionId: this.sessionId,
      userMessageId: messageId,
    }))
```

</details>

**依据 5 · 作者声明**：[packages/bundle-rollback/README.md:3-8](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/README.md#L3-L8)

作者功能表述是需求与用途线索，不是效果验收。

```text
Conversation undo/rollback plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

- **Message-level rollback** — the enter-key icon under a sent prompt, the session-header rollback button, the `/undo` command, or the composer strip: restores the file tree from a plugin-private Shadow Git snapshot (never touches your `.git`) and forks the conversation, so the model never sees the reverted prompt, reply, or tool calls
- **`/undo` node axis** — exact `/undo` opens a lineage timeline: choose a rollback point or hand the selected turn to dsh's native Trajectory view, where the full selected turn is marked
- **Archive tasks** — list, restore, and hide archived sessions from Settings
- **Tool cards** — per-tool colored cards and the reasoning-and-actions fold in the dsh web conversation trail
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 回退如何把文件树与会话分叉对齐，中途失败与重启如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

正常链路先在模型接纳文本消息前建立文件树，再以用户消息边界生成新的会话；回退同时改变文件、会话和归档三个资源。pre-step 监听调用 arm，快照失败会拒绝该条消息。ShadowGit 使用插件私有 GIT_DIR 和 GIT_INDEX_FILE，git add/write-tree 保存树；它不以恢复用户 Git 分支或用户索引的方式撤销。

undoLatest 校验最新消息和阶段，对同服务实例内会话与工作区设置排他标记，要求相关 Agent 及受控任务静止，重新检查工作区，然后捕获回退前 redoTree。它先把 rollbackSessionId、redoTree 和 restoring 阶段写入日志，再并行执行会话分叉与文件恢复，最后归档原会话、发布前继回退点并写 complete。fork 根据目标用户消息截取已完成事件前缀，构造新 Agent 并附到工作区；它不是把模型当前内存直接就地擦除。

恢复器有实质内容。进程启动时会检查 restoring/revoking，结合归档成员、新会话存在性和实际文件树匹配决定完成或回到旧态；不满足安全组合时写 recovery-required 并记录错误。日志通过临时文件加 rename 替换，减少半份 JSON 暴露，但没有证据证明文件、会话和归档成为同一存储事务。正常运行的异常 catch 也不等于启动恢复，相关缺口见 Q03。工程上值得借鉴的是以明确阶段和实际状态共同判断，而非仅信任按钮返回成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:203-219](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L203-L219)

真实模型前置监听和用户命令注册。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Create the journal root, recover durable work, and install admission listeners. */
  protected async [Service.init](): Promise<void> {
    await mkdir(this.config.root, { recursive: true })
    await this.recoverJournals()
    this.ctx.on('agent/pre-step', async (payload, next) => {
      const message = payload.messages.find(candidate => topLevelText(candidate) !== undefined)
      if (message !== undefined && !await this.arm(payload.agent, message, payload.turn)) return { kind: 'reject' }
      return await next()
    })
    this.ctx.on('agent/turn-stopping', async ({ agent, turn }) => {
      await this.markReady(agent, turn)
    })
    this.ctx.commands.register({
      name: 'undo',
      description: '回滚最近一条已完成消息:恢复文件和对话到该消息之前',
      handler: invocation => this.rollbackCommand(invocation),
    })
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:664-739](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L664-L739)

最新点、同实例排他、静止、redoTree 和先写 restoring 的实际链路。

<details>
<summary>查看原文（76行）</summary>

```text
  @Remote('undoLatest')
  undoLatest(request: ConversationUndoLatestRequest): Promise<ConversationUndoResult> {
    if (this.rollbackSessions.has(request.sessionId)) {
      return Promise.resolve(this.failure('rollback-in-progress', '该会话正在回滚。'))
    }
    this.rollbackSessions.add(request.sessionId)
    return this.enqueue(request.sessionId, async () => {
      let journal = await this.readActiveJournal(request.sessionId)
      if (journal === undefined || journal.sourceSessionId !== request.sessionId) {
        return this.failure('no-undo', '此对话没有可回滚的消息。')
      }
      if (journal.messageId !== request.userMessageId) {
        return this.failure('not-latest-message', '只能回滚最近一条已完成消息。')
      }
      if (journal.phase !== 'armed' && journal.phase !== 'ready') {
        return this.failure('undo-not-ready', '该消息尚未完成，暂时不能回滚。')
      }
      const workspace = journal.workspace
      if (this.rollbackWorkspaces.has(workspace)) {
        return this.failure('rollback-in-progress', '该工作区正在回滚。')
      }
      this.rollbackWorkspaces.add(workspace)
      const replayPromptOnRevoke = journal.phase === 'armed'
      const recoverable = { ...journal, phase: 'ready' as const }
      try {
        await this.writeJournal({ ...journal, phase: 'quiescing' })
        const source = this.ctx.agents.get(journal.sourceSessionId)
        const retainedAgentOptions = source?.options
        if (source !== undefined && (source.status !== 'idle' || this.hasRunningDescendant(source))) {
          try {
            await this.quiesce(source)
          } catch (error) {
            await this.writeJournal(recoverable)
            return this.failure('session-busy', error instanceof Error ? error.message : String(error))
          }
        }
        // Historical points stay ready so a rollback child can inherit them.
        // Resume this transaction by its immutable generation, not by the
        // generic "current" lookup (which would otherwise select its parent).
        journal = await this.findJournalByGeneration(journal.logicalConversationId, journal.generation)
        if (journal === undefined || journal.phase !== 'quiescing') {
          return this.failure('undo-not-ready', '会话尚未静止，暂时不能回滚。')
        }
        try {
          await this.assertWorkspace(journal.workspace)
        } catch (error) {
          await this.writeJournal(recoverable)
          return this.failure('workspace-unsupported', error instanceof Error ? error.message : String(error))
        }
        const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
        const redoTree = await shadow.capture()
        let child: AgentHandle | undefined
        try {
          const rollbackSessionId = `conversation-undo-${randomUUID()}` as SessionId
          const restoring: ConversationUndoJournal = {
            ...journal,
            rollbackSessionId,
            redoTree,
            ...replayPromptOnRevoke ? { replayPromptOnRevoke: true } : {},
            phase: 'restoring',
          }
          await this.writeJournal(restoring)
          // The fork reads only session persistence while the restore touches
          // only workspace files, so the two run concurrently. The restoring
          // journal above is already durable, so a crash mid-flight lands in
          // the same recovery state the sequential order produced.
          const forkTask = this.ctx.sessionFork.fork({
            sourceSessionId: journal.sourceSessionId,
            childSessionId: rollbackSessionId,
            cut: { kind: 'before-user-message', messageId: journal.messageId },
            ...retainedAgentOptions === undefined ? {} : { retainedAgentOptions },
          })
          const restoreTask = shadow.restore(journal.beforeTree, redoTree)
          try {
            child = (await forkTask).handle
            await restoreTask
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:754-773](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L754-L773)

归档与前继发布完成后才标记 complete。

<details>
<summary>查看原文（20行）</summary>

```text
          try {
            await this.ctx.sessionArchive.archive(journal.sourceSessionId)
          } catch (error) {
            // The source stays unarchived; compensate the file state only.
            // The outer catch disposes the child and rewrites the recoverable
            // journal, so startup recovery re-evaluates the transaction.
            try {
              await shadow.restore(redoTree, journal.beforeTree)
            } catch (restoreError) {
              throw new AggregateError([error, restoreError], 'rollback undo could not recover the failed archive step')
            }
            throw error
          }
          // Carry the preceding message point into the freshly forked child.
          // The completed journal above remains the revocable edge; the child
          // receives a new active record that points at the same private tree.
          // This is what makes rollback #2, #3, ... available without another
          // model admission.
          await this.publishPredecessorToChild(journal, child.agent.id)
          await this.writeJournal({ ...restoring, phase: 'complete' })
```

</details>

**依据 4 · 源码核查**：[packages/rollback-fork/src/index.ts:93-122](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-fork/src/index.ts#L93-L122)

分叉创建新 Agent 并附工作区，附加失败会销毁子 Agent。

<details>
<summary>查看原文（30行）</summary>

```text
  async fork(request: SessionForkRequest): Promise<SessionForkResult> {
    const source = await this.readSource(request.sourceSessionId)
    const seed = this.cut(source, request.cut)
    const workspace = await this.workspaceFor(source)
    const childSessionId = request.childSessionId ?? `session-${randomUUID()}` as SessionId
    const presetId = resolveSessionPreset({ header: source.header, events: source.events })
    const composition = await this.compose(presetId)
    const handle = await this.ctx.agents.create({
      sessionId: childSessionId,
      seed,
      meta: {
        ...source.header.cwd === undefined ? {} : { cwd: source.header.cwd },
        parentSession: source.id,
        seedLength: seed.length,
        ...composition.agentPreset === undefined ? {} : { agentPreset: composition.agentPreset },
      },
      agentOptions: source.agent?.options ?? request.retainedAgentOptions ?? this.defaultOptions(),
      setup: composition.setup,
    })
    try {
      if (workspace !== undefined) await workspace.attachSession(handle.agent.id)
    } catch (error) {
      try {
        await handle.dispose()
      } catch (disposeError) {
        throw new AggregateError([error, disposeError], `session fork "${source.id}" could not attach or dispose its child`)
      }
      throw error
    }
    return { handle, seed }
```

</details>

**依据 5 · 源码核查**：[packages/rollback-fork/src/index.ts:173-204](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-fork/src/index.ts#L173-L204)

分叉在用户消息之前截断，并要求完整事件前缀。

<details>
<summary>查看原文（32行）</summary>

```text
  /** Exclude the target prompt, preserving a completed prefix before ordinary or steering input. */
  private beforeUserMessagePrefix(source: Source, messageId: MessageId): SessionEvent[] {
    const targetIndex = source.events.findIndex(event =>
      event.type === 'user/message' && event.data.id === messageId && isRollbackUserMessage(event.data))
    if (targetIndex < 0) {
      throw new SessionForkUnavailableError(`session "${source.id}" has no eligible user message "${messageId}"`)
    }
    const target = source.events[targetIndex] as Extract<SessionEvent, { type: 'user/message' }>
    let startIndex = -1
    for (let index = targetIndex - 1; index >= 0; index -= 1) {
      const event = source.events[index]
      if (event?.type !== 'turn/start') continue
      startIndex = index
      break
    }
    if (startIndex < 0) throw new SessionForkUnavailableError(`user message "${messageId}" has no owning turn`)
    const start = source.events[startIndex] as Extract<SessionEvent, { type: 'turn/start' }>
    const end = source.events.slice(targetIndex + 1).find(event =>
      event.type === 'turn/end' && event.data.turn === start.data.turn)
    if (end === undefined) {
      throw new SessionForkUnavailableError(`user message "${messageId}" belongs to an unfinished turn`)
    }
    if (target.seq <= start.seq) throw new SessionForkUnavailableError(`user message "${messageId}" has an invalid turn boundary`)
    const followsHumanPrompt = source.events.slice(startIndex, targetIndex).some(event =>
      event.type === 'user/message' && isRollbackUserMessage(event.data))
    const prefix = isSteeringUserMessage(target.data) || followsHumanPrompt
      ? steeringPrefix(source.events, targetIndex)
      : source.events.slice(0, startIndex)
    if (!isCompletedPrefix(prefix)) {
      throw new SessionForkUnavailableError(`user message "${messageId}" does not follow a complete Session prefix`)
    }
    return prefix
```

</details>

**依据 6 · 源码核查**：[packages/rollback-undo/src/index.ts:973-997](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L997)

启动恢复独立检查归档、新会话与文件树，歧义进入 recovery-required。

<details>
<summary>查看原文（25行）</summary>

```text
  private async recoverRestoring(journal: ConversationUndoJournal): Promise<void> {
    if (journal.rollbackSessionId === undefined || journal.redoTree === undefined) {
      await this.requireRecovery(journal, 'manifest has no rollback Session or redo tree')
      return
    }
    try {
      await this.assertWorkspace(journal.workspace)
      const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
      const sourceArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.sourceSessionId)
      const rollbackArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.rollbackSessionId ?? ('' as SessionId))
      const rollbackExists = await this.sessionExists(journal.rollbackSessionId ?? ('' as SessionId))
      if (sourceArchived && !rollbackArchived && rollbackExists && await shadow.verifyMatches(rollbackTargetTree(journal))) {
        await this.publishRetainedLayerToChild(journal, journal.rollbackSessionId)
        await this.writeJournal({ ...journal, phase: 'complete' })
        return
      }
      if (!sourceArchived && await shadow.verifyMatches(journal.redoTree ?? journal.beforeTree)) {
        if (rollbackExists) await this.hideUnpublishedChild(journal.rollbackSessionId ?? ('' as SessionId))
        await this.writeJournal({ ...journal, phase: 'ready' })
        return
      }
      await this.requireRecovery(journal, 'archive membership or private Shadow Git tree does not describe a safe publication state')
    } catch (error) {
      await this.requireRecovery(journal, error instanceof Error ? error.message : String(error))
    }
```

</details>

**依据 7 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:257-270](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L257-L270)

写日志采用临时文件加重命名，不可推成跨资源原子事务。

<details>
<summary>查看原文（14行）</summary>

```text
/** Atomically replace a JSON record in the plugin-owned data directory.
 * @param path - Plugin-owned JSON target path.
 * @param value - JSON-serializable record to replace atomically.
 */
export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${randomBytes(6).toString('hex')}.tmp`
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  try {
    await renameWithRetry(temporary, path)
  } catch (error) {
    await rm(temporary, { force: true })
    throw error
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些失败和工作区边界会使“可撤销”不足以证明无损恢复？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

最影响核心承诺的是失败状态能否保留为需要核对的事实。restoring 写入后，fork 与文件恢复并行。如果 fork 成功而 restore 在删除部分路径或 checkout-index 时失败，内层 catch 的补偿只在 child 尚未取得时执行；已有 child 的分支直接向外抛错。外层会销毁 child，然后无条件写 recoverable，其中 phase 是 ready。该路径没有先验证文件已完整回到 redoTree。即使归档失败时尝试的文件补偿也失败，异常仍进入同一写 ready 路径。

启动恢复只为 cleanup-pending、quiescing、restoring、revoking 分派处理，ready 走默认分支。必须保留反证：这个外层 catch 最后会重新 throw，客户端控制器 apply 在远程失败或异常时发布 error 并返回 undefined，页头不会打开成功子会话，因此不能说异常被伪装成成功。ready 表示回退点再次可用，不是文件已经回到旧态的成功收据。问题是 current 仍会为 armed/ready 提供该点，而启动扫描跳过 ready，文件的部分状态未被同样强制复核。因此日志重新变为 ready 并不能证明文件未留在部分恢复状态；这是静态控制流可见的恢复证据缺口。尚未故障注入，不能声称已发生文件损失或量化概率。严重性来自此缺口直接影响是否可以继续使用同一工作区，故本次建议观察而非把它当唯一恢复保障。

覆盖范围也有限。Git 支持检查要求普通非裸工作区且拒绝已登记子模块；捕获用 add --all，恢复只按两个私有树之间的差异删除与物化路径，忽略规则之外的文件、工作区外写入、数据库/API 副作用不能由这套树证明已撤销。私有索引减少与用户 Git 索引的耦合，却仍会改写实际工作文件。回退锁是实例内 Set，停机范围是该 Agent 的受控后代、jobs 和 terminals，不是编辑器、另一进程或另一 Host 的全局锁。

反证是撤回回滚前确实 verifyMatches，发现回退后文件变化会拒绝 workspace-diverged；启动 restoring 也有实际态核验。因此不能泛化为“没有保护”。但正向回退没有相同的外部写者所有权证明，使用者仍应在单写者副本中核查，并把发信、远程命令等影响单独处理。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:736-752](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L736-L752)

restore 失败时只在 child 未取得的分支补偿，已有 child 的异常继续外抛。

<details>
<summary>查看原文（17行）</summary>

```text
          const restoreTask = shadow.restore(journal.beforeTree, redoTree)
          try {
            child = (await forkTask).handle
            await restoreTask
          } catch (error) {
            if (child === undefined) {
              // The fork failed while the restore may have started moving
              // files: settle it and put the worktree back on the redo tree
              // before the generic recovery rewrites the journal.
              await restoreTask.catch(() => {})
              try {
                await shadow.restore(redoTree, journal.beforeTree)
              } catch (compensateError) {
                throw new AggregateError([error, compensateError], 'rollback undo could not recover the failed fork')
              }
            }
            throw error
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:754-765](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L754-L765)

归档失败尝试文件补偿；补偿也可失败并形成聚合异常。

<details>
<summary>查看原文（12行）</summary>

```text
          try {
            await this.ctx.sessionArchive.archive(journal.sourceSessionId)
          } catch (error) {
            // The source stays unarchived; compensate the file state only.
            // The outer catch disposes the child and rewrites the recoverable
            // journal, so startup recovery re-evaluates the transaction.
            try {
              await shadow.restore(redoTree, journal.beforeTree)
            } catch (restoreError) {
              throw new AggregateError([error, restoreError], 'rollback undo could not recover the failed archive step')
            }
            throw error
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:803-824](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L824)

外层销毁子 Agent 后重写 recoverable，没有树一致性检查。

<details>
<summary>查看原文（22行）</summary>

```text
        } catch (error) {
          const recoveries: unknown[] = [error]
          if (child !== undefined) {
            try {
              await child.dispose()
            } catch (disposeError) {
              recoveries.push(disposeError)
            }
          }
          try {
            await this.writeJournal(recoverable)
          } catch (journalError) {
            recoveries.push(journalError)
          }
          throw recoveries.length === 1
            ? error
            : new AggregateError(recoveries, 'rollback undo could not recover the failed rollback')
        }
      } finally {
        this.rollbackWorkspaces.delete(workspace)
      }
    }).finally(() => { this.rollbackSessions.delete(request.sessionId) })
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:926-949](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L926-L949)

ready 没有对应启动实际态恢复分支，不能把普通阶段当核验。

<details>
<summary>查看原文（24行）</summary>

```text
  private async recoverJournals(): Promise<void> {
    for (const journal of await this.readJournals()) {
      if (journal.sourceTombstoned === true) continue
      if (journal.sourceTombstonePending === true) {
        await this.recoverDeferredCleanup(journal)
        continue
      }
      switch (journal.phase) {
        case 'cleanup-pending':
          await this.recoverDeferredCleanup(journal)
          break
        case 'quiescing':
          await this.writeJournal({ ...journal, phase: 'ready' })
          this.ctx.logger.warn(`rollback undo: reset interrupted pre-publication rollback for "${journal.sourceSessionId}"`)
          break
        case 'restoring':
          await this.recoverRestoring(journal)
          break
        case 'revoking':
          await this.recoverRevoking(journal)
          break
        default:
          break
      }
```

</details>

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:273-280](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L273-L280)

current 为 armed/ready 提供当前回退点；不是已成功回退的声明。

```text
  @Remote('current')
  async current(request: ConversationCurrentRequest): Promise<ConversationUndoResult> {
    const journal = await this.readActiveJournal(request.sessionId)
    if (journal?.phase === 'recovery-required') {
      return this.failure('recovery-required', '此前的回滚需要 Host 恢复；请勿在此工作区继续操作。')
    }
    if (journal?.phase !== 'armed' && journal?.phase !== 'ready') return this.success({ sessionId: request.sessionId })
    return this.success(this.viewFor(journal))
```

**依据 6 · 源码核查**：[packages/client-rollback-button/src/client/controller.ts:179-205](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/controller.ts#L179-L205)

客户端对业务失败和异常发布 error 并返回 undefined，反驳错误被包装成功的解释。

<details>
<summary>查看原文（27行）</summary>

```text
  private async apply(
    call: () => Promise<RemoteResult<ConversationUndoResult>>,
    commit?: (value: ConversationUndoValue) => Pick<ConversationUndoView, 'value' | 'revokePair'>,
  ): Promise<ConversationUndoValue | undefined> {
    const operation = this.tail.then(async () => {
      try {
        const carried = await call()
        if (!carried.ok) {
          this.publish({ status: 'error', value: this.view.value, revokePair: this.view.revokePair, error: carried.error.message })
          return undefined
        }
        if (!carried.value.ok) {
          this.publish({ status: 'error', value: this.view.value, revokePair: this.view.revokePair, error: carried.value.error.message })
          return undefined
        }
        const committed = commit?.(carried.value.value) ?? { value: carried.value.value, revokePair: this.view.revokePair }
        this.publish({ status: 'ready', ...committed, error: null })
        return carried.value.value
      } catch (error) {
        this.publish({
          status: 'error',
          value: this.view.value,
          revokePair: this.view.revokePair,
          error: error instanceof Error ? error.message : '回滚请求失败。',
        })
        return undefined
      }
```

</details>

**依据 7 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:71-107](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L71-L107)

工作区支持检查、子模块拒绝和私有树捕获范围。

<details>
<summary>查看原文（37行）</summary>

```text
export async function assertSupportedWorkspace(workspace: string): Promise<void> {
  const result = await new Promise<string>((resolveResult, reject) => {
    const child = spawn('git', ['rev-parse', '--is-inside-work-tree', '--is-bare-repository'], {
      cwd: workspace,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const out: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => { out.push(chunk) })
    child.once('error', reject)
    child.once('exit', code => code === 0
      ? resolveResult(Buffer.concat(out).toString('utf8').trim())
      : reject(new Error(`conversation-undo: '${workspace}' is not a Git worktree`)))
  })
  if (result !== 'true\nfalse') {
    throw new Error(`conversation-undo: '${workspace}' is not a normal Git worktree`)
  }
  const entries = await git(workspace, '', ['ls-files', '--stage'], { shadow: false })
  if (entries.split('\n').some(entry => entry.startsWith('160000 '))) {
    throw new Error(`conversation-undo: '${workspace}' contains submodules`)
  }
}

/** Per-journal Git repository holding trees without touching user refs, commits, or index. */
export class ShadowGit {
  constructor(
    private readonly workspace: string,
    private readonly shadowGit: string,
  ) {}  /** Create a tree from all Git-supported workspace paths.
   * @returns Private Git tree id for all supported workspace paths.
   */
  async capture(): Promise<ConversationUndoTree> {
    await this.ensure()
    await git(this.workspace, this.shadowGit, ['add', '--all', '--', '.'])
    const tree = (await git(this.workspace, this.shadowGit, ['write-tree'])).trim()
    if (!/^[0-9a-f]{40,64}$/.test(tree)) throw new Error('conversation-undo: Git returned an invalid tree id')
    return tree as ConversationUndoTree
```

</details>

**依据 8 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:114-146](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L114-L146)

文件恢复分步删除、更新索引和写工作文件，可能中途拒绝。

<details>
<summary>查看原文（33行）</summary>

```text
  async restore(target: ConversationUndoTree, from: ConversationUndoTree): Promise<void> {
    await this.ensure()
    // One name-status diff names every changed path and its direction: 'D'
    // marks paths the target no longer carries (removed from the worktree),
    // every other status (A/M/T) marks paths present in the target. With
    // --no-renames each entry is a single path, so the -z stream is a flat
    // status/path pair list and no separate full-target tree listing is
    // needed to decide removal versus materialization.
    const changed = await git(this.workspace, this.shadowGit, [
      'diff-tree', '-r', '-z', '--no-renames', '--no-commit-id', '--name-status', String(from), String(target),
    ])
    const tokens = changed.split('\0')
    const deletions: string[] = []
    const updates: string[] = []
    for (let i = 0; i + 1 < tokens.length; i += 2) {
      const status = tokens[i]
      const path = tokens[i + 1]
      if (status === undefined || path === undefined || path === '') continue
      if (status === 'D') deletions.push(path)
      else updates.push(path)
    }
    for (const path of deletions) {
      await this.removeCapturedPath(path)
    }
    await git(this.workspace, this.shadowGit, ['read-tree', String(target)])
    // Materialize only the changed paths instead of the whole worktree:
    // checkout-index --all rewrites every tracked file, which dominates the
    // restore cost on large workspaces. Fall back to the full checkout when
    // the change set would exceed the Windows command-line length limit.
    if (updates.length === 0) return
    await git(this.workspace, this.shadowGit, updates.length > MAX_RESTORE_PATHS
      ? ['checkout-index', '--all', '--force']
      : ['checkout-index', '--force', '--', ...updates])
```

</details>

**依据 9 · 源码核查**：[packages/rollback-undo/src/index.ts:539-552](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L539-L552)

撤回前有实际树匹配与 workspace-diverged 拒绝，是保护存在的反证。

<details>
<summary>查看原文（14行）</summary>

```text
        try {
          await this.assertWorkspace(workspace)
        } catch (error) {
          return this.failure('workspace-unsupported', error instanceof Error ? error.message : String(error))
        }
        const shadow = new ShadowGit(workspace, this.shadowDirectory(journal))
        await this.statWarmers.get(this.shadowDirectory(journal))
        const rollbackTree = rollbackTargetTree(journal)
        if (!await shadow.verifyMatches(rollbackTree)) {
          return this.failure('workspace-diverged', '回滚后工作区文件已被修改，无法安全撤回回滚。')
        }
        const redoTree = journal.redoTree
        const revokeSessionId = `conversation-undo-${randomUUID()}` as SessionId
        await this.writeJournal({ ...journal, revokeSessionId, phase: 'revoking' })
```

</details>

**依据 10 · 源码核查**：[packages/rollback-undo/src/index.ts:1082-1109](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1082-L1109)

只查询并停止注册 jobs/terminals，未形成外部进程全局锁。

<details>
<summary>查看原文（28行）</summary>

```text
  /** Check whether registered job or terminal providers still own work for the Agent tree. */
  private hasControlledActivity(agents: readonly Agent[]): boolean {
    const jobs = this.ctx.get('jobs')
    const terminals = this.ctx.get('terminals')
    return agents.some(agent =>
      (jobs?.list(agent).some(job => job.status === 'running' || job.status === 'stopping') ?? false)
      || (terminals?.hasOwnerActivity(agent) ?? false),
    )
  }

  /** Force-stop registered jobs and PTYs only after the cooperative grace period elapses. */
  private async forceStopControlledActivity(agents: readonly Agent[]): Promise<void> {
    const jobs = this.ctx.get('jobs')
    const terminals = this.ctx.get('terminals')
    const stops: Promise<unknown>[] = []
    for (const agent of agents) {
      if (jobs !== undefined) {
        for (const job of jobs.list(agent)) {
          if (job.status === 'running' || job.status === 'stopping') jobs.kill(job.id, agent, 'rollback quiescence')
        }
      }
      if (terminals !== undefined) {
        for (const terminal of terminals.list(agent)) {
          if (terminal.status.kind === 'running') stops.push(terminals.kill(agent, terminal.sessionId, 'rollback quiescence'))
        }
      }
    }
    await Promise.all(stops)
```

</details>

**依据 11 · 作者声明**：[README.md:131-135](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/README.md#L131-L135)

作者明确工作区外写入不在覆盖范围。

```text
## 限制

- 回滚只恢复会话工作区(git worktree 边界)内的文件;工作区外的 agent 写入不在覆盖范围。
- steer 消息排除是尽力而为:rc.6 的 durable 侧没有 `delivery` 字段,以 source-kind + 纯文本检查为边界。
- 接纳失败在回合停止时轮询一次得知(rc.6 的 api-remotes allowlist 无法转发推送事件)。
```

#### 缺口

- 部分文件写入失败与补偿失败的跨平台结果未经故障注入。
  **影响**：能定位状态降级缺口，但不能量化实际损失概率或断言每次异常都会损坏。
  **进一步探讨**：在独立工作副本中给恢复、归档、日志写入逐点注入失败，比较实际文件树、归档成员与子会话，再重启核对是否要求人工恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何以可控成本评估和退出，效果需要什么证据？

**研究主题**：效果与总成本、采用判断、场景与需求、依赖、兼容与流程

#### 完整回答

当前适合观察这套文件与对话协调机制，不宜把它作为生产工作区唯一的撤销方案。评估者应已能维护 DSH 网页环境，先备份用户工程、会话持久化与插件应用数据，在无外部副作用、单写者的项目副本上检查正常回退和故障恢复。合格任务定义为撤销一轮指定文本修改后，文件达到该轮前状态，新子会话排除目标消息，原会话仍可查；错误返回或恢复要求不得被当作已撤销。

作者要求 DSH rc.6 或更新并在安装后重启网页端，这是一项声明，不能据此认定所有后续宿主版本兼容。七个依赖使用版本范围，npm 中同版本号存在也不能证明安装得到的全部字节与本次固定提交相同。当前材料的 GitHub 身份查询失败，保留固定 checkout 可追溯性，不从访问失败推断仓库删除或包不可用。安装前仍须核实来源身份和解析到的依赖。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | DSH 环境、七包下载与独立备份空间；金额未知 | 核版本、原生归档接管和副本验收；耗时未知 | 不把作者最低版本当兼容验收 |
| 持续使用 | 私有 Git 对象、日志与分叉会话存储；容量增长未知 | 核对目标回退点、文件和会话；单任务时长未知 | 重做业务任务的模型/API 费取决于原任务，未计为零 |
| 失败恢复 | 保留私有树和独立备份；额外资源未知 | 停写，检查三个资源实际状态并人工恢复；工作量未知 | ready 不证明异常已补偿完毕 |
| 升级与退出 | 保留历史与恢复材料所需存储 | 记录原 profile，恢复原生归档配置并核对历史可见性 | 未发现本组件自动完成退出交接的保证 |

试用或退出的决定由这些条件而非下载量作出。来源不明、文件变化与目标不符、出现恢复要求、归档失联，或仍有其他写者时，应停写并使用独立备份与手工会话分叉。移除组合包前先保存 profile 与恢复材料，核对被禁用的原生归档行是否重新启用，不能仅删除私有数据。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件和对话协调 | 正常链路恢复私有树、分叉、归档 | 故障下无损一致性与真实合格率 |
| Git 隔离 | 私有 Git 目录与索引 | 实际文件不会被外部并发写入 |
| 恢复与退出 | 部分阶段检查实际树和归档态 | ready 降级后的安全性与归档接管退出 |
| 办结效率 | 减少手工协调步骤的机制可解释 | 同任务节时、返工与单位合格成本，无对照数据 |

#### 证据与依据

**依据 1 · 作者声明**：[packages/bundle-rollback/README.md:10-16](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/README.md#L10-L16)

作者安装命令与最低版本、重启要求；未据此写为已验证。

````text
## Install

```sh
dsh plugin --profile web add dsh-undo-plugin
```

Requires `dsh` 0.1.0-rc.6 or newer. Restart `dsh web` after installing.
````

**依据 2 · 源码核查**：[packages/bundle-rollback/package.json:30-37](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L30-L37)

内部包使用版本范围，单个源码提交不锁定所有安装字节。

```text
  "dependencies": {
    "@dsh-undo/client-rollback-button": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-settings": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-toolcards": "^0.1.0-rc.8",
    "@dsh-undo/client-rollback-trailfold": "^0.1.0-rc.8",
    "@dsh-undo/rollback-archive": "^0.1.0-rc.8",
    "@dsh-undo/rollback-fork": "^0.1.0-rc.8",
    "@dsh-undo/rollback-undo": "^0.1.0-rc.8"
```

**依据 3 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:34-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L34-L44)

退出时需要核查原生归档接管的实际 profile。

<details>
<summary>查看原文（11行）</summary>

```text
# The base web-app bundle also ships ui-settings-archive and session-archive,
# whose sessionArchive Remote contributions claim the namespace first and block
# this bundle's tombstone/untombstone/restore/delete endpoints from mounting
# client-side. Disable both so the rollback archive surface owns the namespace.
- id: ui-settings-archive
  name: '@deepseek-ai/dsh-client-ui-settings-archive'
  disabled: true

- id: session-archive
  name: '@deepseek-ai/dsh-session-archive'
  disabled: true
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:973-997](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L997)

正常恢复需实际状态判定，为成功标准与停止条件提供依据。

<details>
<summary>查看原文（25行）</summary>

```text
  private async recoverRestoring(journal: ConversationUndoJournal): Promise<void> {
    if (journal.rollbackSessionId === undefined || journal.redoTree === undefined) {
      await this.requireRecovery(journal, 'manifest has no rollback Session or redo tree')
      return
    }
    try {
      await this.assertWorkspace(journal.workspace)
      const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
      const sourceArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.sourceSessionId)
      const rollbackArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.rollbackSessionId ?? ('' as SessionId))
      const rollbackExists = await this.sessionExists(journal.rollbackSessionId ?? ('' as SessionId))
      if (sourceArchived && !rollbackArchived && rollbackExists && await shadow.verifyMatches(rollbackTargetTree(journal))) {
        await this.publishRetainedLayerToChild(journal, journal.rollbackSessionId)
        await this.writeJournal({ ...journal, phase: 'complete' })
        return
      }
      if (!sourceArchived && await shadow.verifyMatches(journal.redoTree ?? journal.beforeTree)) {
        if (rollbackExists) await this.hideUnpublishedChild(journal.rollbackSessionId ?? ('' as SessionId))
        await this.writeJournal({ ...journal, phase: 'ready' })
        return
      }
      await this.requireRecovery(journal, 'archive membership or private Shadow Git tree does not describe a safe publication state')
    } catch (error) {
      await this.requireRecovery(journal, error instanceof Error ? error.message : String(error))
    }
```

</details>

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:803-819](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L819)

失败后 ready 证据不足，决定不能依赖唯一恢复保证。

<details>
<summary>查看原文（17行）</summary>

```text
        } catch (error) {
          const recoveries: unknown[] = [error]
          if (child !== undefined) {
            try {
              await child.dispose()
            } catch (disposeError) {
              recoveries.push(disposeError)
            }
          }
          try {
            await this.writeJournal(recoverable)
          } catch (journalError) {
            recoveries.push(journalError)
          }
          throw recoveries.length === 1
            ? error
            : new AggregateError(recoveries, 'rollback undo could not recover the failed rollback')
```

</details>

#### 缺口

- 没有同条件合格任务对照、用户使用频率和恢复人工量。
  **影响**：无法确认自动协调是否抵消快照、维护与异常恢复负担。
  **进一步探讨**：比较手工 Git 恢复加会话分叉与本组合包在同批任务的合格率、端到端时间、失败后人工投入与存储增长。
- 七包发布产物与固定源码的一致性、后续宿主版本及归档退出交接尚未核实。
  **影响**：安装可用性和迁移代价不能从包声明保证。
  **进一步探讨**：对固定安装解析清单核对来源、版本和产物摘要，并在副本检查卸载后的归档可见性。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让补偿失败后的状态比普通 ready 更可判断？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可检验的假设是，将“补偿是否已核验”设为不可直接降级的恢复条件，并为文件树、目标会话和归档成员保存同一次操作的核对结果，会降低异常后错误继续写入的次数。推导来自 Q03 的异常路径，它将失败重写 ready 而没有完整复核；不是因为系统没有日志或没有恢复器。既有 recoverRestoring 已组合这三种证据，形成直接参照。

相对现状的增量应是普通运行时 catch 也进入同一复核，不允许仅靠捕获异常后恢复阶段名来解除限制；它不要求增加新的回退算法。代价是额外 Git 比较、会话查询与人工恢复入口，可能增加正常失败的等待和误阻断。

验证应在同一固定宿主、插件、项目副本和任务负载下比较当前逻辑与该状态约束，分别注入文件恢复中断、分叉失败、归档失败、补偿失败、写日志失败及进程中断。记录错误允许继续次数、实际文件/会话不一致次数、恢复时长和操作负担。若无法减少错误继续，或新增误阻断与恢复负担抵消收益，即应否定该假设；没有实际实验前不把它写成已存在能力或新确认的价值。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:803-819](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L819)

运行时异常阶段恢复缺少相同实际态复核，是新增约束的推导起点。

<details>
<summary>查看原文（17行）</summary>

```text
        } catch (error) {
          const recoveries: unknown[] = [error]
          if (child !== undefined) {
            try {
              await child.dispose()
            } catch (disposeError) {
              recoveries.push(disposeError)
            }
          }
          try {
            await this.writeJournal(recoverable)
          } catch (journalError) {
            recoveries.push(journalError)
          }
          throw recoveries.length === 1
            ? error
            : new AggregateError(recoveries, 'rollback undo could not recover the failed rollback')
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:973-997](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L997)

现有启动实际态组合检查是反证和可复用基线，不能说系统没有恢复能力。

<details>
<summary>查看原文（25行）</summary>

```text
  private async recoverRestoring(journal: ConversationUndoJournal): Promise<void> {
    if (journal.rollbackSessionId === undefined || journal.redoTree === undefined) {
      await this.requireRecovery(journal, 'manifest has no rollback Session or redo tree')
      return
    }
    try {
      await this.assertWorkspace(journal.workspace)
      const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
      const sourceArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.sourceSessionId)
      const rollbackArchived = this.ctx.workspaceRegistry.archivedSessionIds.includes(journal.rollbackSessionId ?? ('' as SessionId))
      const rollbackExists = await this.sessionExists(journal.rollbackSessionId ?? ('' as SessionId))
      if (sourceArchived && !rollbackArchived && rollbackExists && await shadow.verifyMatches(rollbackTargetTree(journal))) {
        await this.publishRetainedLayerToChild(journal, journal.rollbackSessionId)
        await this.writeJournal({ ...journal, phase: 'complete' })
        return
      }
      if (!sourceArchived && await shadow.verifyMatches(journal.redoTree ?? journal.beforeTree)) {
        if (rollbackExists) await this.hideUnpublishedChild(journal.rollbackSessionId ?? ('' as SessionId))
        await this.writeJournal({ ...journal, phase: 'ready' })
        return
      }
      await this.requireRecovery(journal, 'archive membership or private Shadow Git tree does not describe a safe publication state')
    } catch (error) {
      await this.requireRecovery(journal, error instanceof Error ? error.message : String(error))
    }
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:1051-1055](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1051-L1055)

已有 recovery-required 可容纳不确定状态，假设聚焦何时进入而非发明状态名称。

```text
  /** Preserve a recovery-required manifest instead of claiming an ambiguous transaction succeeded. */
  private async requireRecovery(journal: ConversationUndoJournal, detail: string): Promise<void> {
    await this.writeJournal({ ...journal, phase: 'recovery-required' })
    this.ctx.logger.error(`rollback undo: rollback for "${journal.sourceSessionId}" requires recovery: ${detail}`)
  }
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
