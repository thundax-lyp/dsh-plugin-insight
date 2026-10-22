# dsh-undo-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/23swccp/dsh-undo) [![npm 30d 955](https://img.shields.io/static/v1?label=npm+30d&message=955&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-undo-plugin)
<!-- END META -->

> **实现功能**：为DSH组合会话回退、私有Git文件快照、归档管理和回退界面。

> **核心亮点**：把消息ID/私有Git树和会话前缀绑定为可选择回退分支，减少手动对齐文件与聊天历史；bundle是七包组合而非独立新快照算法。详见[Q01](#research-q01)。

> **风险与缺陷**：文件/会话/归档非原子，异常可重写ready丢中间态，idle后台任务与其他写者未必静止；忽略文件和外部副作用不回退。详见[Q03](#research-q03)。

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
  - [Q01 · 组合包把什么交付物变成可回退，适用于谁？](#detail-section-11)
  - [Q02 · 影子Git覆盖与恢复边界能保证整个工作区回到过去吗？](#detail-section-12)
  - [Q03 · 回退事务、并发和恢复何时可靠，哪里仍有歧义？](#detail-section-13)
  - [Q04 · 归档恢复/删除与界面承诺一致吗，访问和隐私边界在哪里？](#detail-section-14)
  - [Q05 · 启动与三阶段成本有哪些具体条件？](#detail-section-15)
  - [Q06 · 如何判断采用与未来可证伪方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Git工作区内需要同步回退文件和会话的用户，限可恢复本地任务。详见[Q01](#research-q01)。

手工Git文件恢复加独立聊天分叉；本项绑定两者的节点身份和归档流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话/文件回退 | 同步保留前缀与树 | 本地Git覆盖且写者独占 |
| 时间线/撤销边 | 选择保留节点与恢复redo | 新提示会失效旧撤销边 |
| 归档管理 | 查文本、fork恢复与删除 | 删除日志不擦影子Git |
| /update | 仓库pull/install/build | 非npm通用更新、非原子 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH rc6+及七依赖包 | 组合host/client服务 | caret依赖及发布构建需定位 |
| Git普通无gitlink工作区 | 捕获/恢复树 | 忽略路径/外部副作用不覆盖 |
| 可写独立数据目录 | journal/Git对象/归档状态 | 备份、容量与隐私由维护者管理 |
| Web surface与宿主Remote | 回退/归档UI | 替换原archive rows，授权依宿主 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份、确认工作区与写者 | 用户 | 无外部不可撤销任务 |
| 装组合重启核row替换 | 维护者 | 七包和服务命名空间一致 |
| 纯文本提示建立点 | 用户/host | 捕树成功才admit |
| 选择回退/核新分支与文件 | 用户 | 忽略/外部副作用另处理 |
| 异常停写核journal/树 | 维护者 | 不确定态不当成功重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Git、DSH与七包依赖，独立快照目录磁盘 | 备份重要稿件，核组合覆盖和宿主版本 | 包价/工时无资料，不以免费许可证推总成本 |
| 持续使用 | 每条合格提示捕获文件树，保存Git对象和prompt/journal；会话分叉另留历史 | 识别忽略路径/外部副作用，检查回退目标与容量 | 无自动保留上限/GC策略，冷扫描耗时依树大小；作者注释性能数非本轮测量 |
| 失败恢复 | 保留before/redo树、原会话及磁盘备份 | 核文件树/归档/子会话状态，处理recovery-required和补偿失败 | 原子JSON不等多资源事务；停其他写入者，未知恢复工时 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件/聊天对齐 | message/tree/fork前缀绑定 | 多写者与异常补偿一致性 |
| 连续回退 | lineage及保留节点 | 所有中断组合恢复 |
| 归档管理 | fork恢复、删除日志目录 | 影子对象隐私擦除与后端适配 |

> **思考**：文件/会话/归档非原子，异常可重写ready丢中间态，idle后台任务与其他写者未必静止；忽略文件和外部副作用不回退。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把消息ID/私有Git树和会话前缀绑定为可选择回退分支，减少手动对齐文件与聊天历史；bundle是七包组合而非独立新快照算法。详见[Q01](#research-q01)。

把消息ID/私有Git树和会话前缀绑定为可选择回退分支，减少手动对齐文件与聊天历史；bundle是七包组合而非独立新快照算法。详见[Q01](#research-q01)。

私有Git、原子JSON和启动实际树核对可借鉴；不能把多资源补偿称原子事务。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

文件/会话/归档非原子，异常可重写ready丢中间态，idle后台任务与其他写者未必静止；忽略文件和外部副作用不回退。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，备份且独占的本地Git文件任务可继续探讨，勿将聊天消失当所有副作用撤销。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

组合增量和树/会话事务可核；运行期补偿、独占与删除边界削弱一致恢复保证；证明式收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/bundle-rollback/README.md、packages/bundle-rollback/package.json、packages/bundle-rollback/cordis.patch.yml、packages/rollback-undo/src/index.ts、packages/rollback-undo/src/shadow-git.ts、packages/rollback-undo/src/update.ts、packages/rollback-undo/package.json、packages/rollback-archive/src/index.ts、packages/rollback-fork/src/index.ts、packages/client-rollback-button/src/client/controller.ts、packages/client-rollback-button/src/client/index.ts、packages/rollback-undo/tests/shadow-git.spec.ts 及固定范围 inventory；组件：packages/bundle-rollback。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整组合四文件，展开固定同仓undo事务、shadowGit、fork、archive与client controller/入口；测试仅阅读代表断言，不执行目标。
- 下一步：按fork/restore/archive/publish失败及idle后台写者、双目录别名检查一致收据，外部动作不自动重放。

**分析版本**

- **仓库**：[23swccp/dsh-undo](https://github.com/23swccp/dsh-undo)
- **版本号**：0.1.0-rc.8（[固定提交 bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

规范workspace全写者租约、不可降级事务日志与实际树核对形成覆盖明确的回退收据，按中间失败/双写者反例证伪，未验证。详见[Q06](#research-q06)。

按fork/restore/archive/publish失败及idle后台写者、双目录别名检查一致收据，外部动作不自动重放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 163 |
| .ts | source | 1 | 4 | 2 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/23swccp/dsh-undo/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/23swccp/dsh-undo/issues?q=is%3Aissue+created%3A2026-09-22T10%3A24%3A04.476Z..2026-10-22T10%3A24%3A04.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/23swccp/dsh-undo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A24%3A04.476Z..2026-10-22T10%3A24%3A04.476Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**确认组合包能否将指定提示及文件变更一致回退，并界定恢复/外部副作用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 组合包把什么交付物变成可回退，适用于谁？

**研究主题：**场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用于在普通Git工作区用DSH修改本地文件、希望撤去一条提示及其模型轨迹的用户。合格结果是指定文件树回到选定点、创建只含保留前缀的新会话并归档旧分支，而非只把聊天界面藏起。原方案需手动对齐Git文件版本和聊天分支，本项把message ID、before tree、lineage和fork cut绑定到一次操作，交付形态增加可选择节点/撤销边及对应文件状态。

本组件本身只是组合补丁，没有自己的恢复算法；package只分发cordis.patch，依赖七个独立包。补丁插入fork/archive/undo三host能力及四client显示组件，禁用宿主原ui-settings-archive/session-archive，使替代archive命名空间先占用问题消失，但也意味着不是完全附加式安装。Web按钮、时间线、归档设置和工具卡是不同层，不能把七包贡献全归为bundle自创新。

适用边界是本地Git支持文件与纯文本顶层人类输入，普通工具调用/后台自动消息/附件/子Agent本身不独立arm；arm不接steer。CLI的/undo直接回最近点，Web exact /undo经commandUi装饰弹时间线，不能拿Web说明泛指所有profile。网络发送、数据库、系统配置和忽略文件不随对话消失而撤销。

#### 证据与依据

**依据 1 · 作者声明**：[packages/bundle-rollback/README.md:3-17](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/README.md#L3-L17)

作者功能与部署。

<details>
<summary>查看原文（15行）</summary>

````text
Conversation undo/rollback plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

- **Message-level rollback** — the enter-key icon under a sent prompt, the session-header rollback button, the `/undo` command, or the composer strip: restores the file tree from a plugin-private Shadow Git snapshot (never touches your `.git`) and forks the conversation, so the model never sees the reverted prompt, reply, or tool calls
- **`/undo` node axis** — exact `/undo` opens a lineage timeline: choose a rollback point or hand the selected turn to dsh's native Trajectory view, where the full selected turn is marked
- **Archive tasks** — list, restore, and hide archived sessions from Settings
- **Tool cards** — per-tool colored cards and the reasoning-and-actions fold in the dsh web conversation trail

## Install

```sh
dsh plugin --profile web add dsh-undo-plugin
```

Requires `dsh` 0.1.0-rc.6 or newer. Restart `dsh web` after installing.

````

</details>

**依据 2 · 源码核查**：[packages/bundle-rollback/package.json:23-39](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L23-L39)

组合分发及依赖。

<details>
<summary>查看原文（17行）</summary>

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
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:8-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L8-L44)

插入与替换宿主归档。

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

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:57-65](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L57-L65)

输入资格。

```text
/** Return direct text-only user content; every other submission is ineligible. */
function topLevelText(message: UserMessage): string | undefined {
  if (
    message.source.kind !== 'user'
    || ('delivery' in message.source && message.source.delivery === 'steer')
    || !message.content.every(block => block.type === 'text')
  ) return undefined
  return message.content.map(block => block.text).join('')
}
```

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:828-839](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L828-L839)

跳过子Agent/无cwd。

<details>
<summary>查看原文（12行）</summary>

```text
  private async arm(agent: Agent, message: UserMessage, turn: number): Promise<boolean> {
    if (agent.session.header.origin === 'subagent') return true
    const prompt = topLevelText(message)
    const workspace = agent.session.header.cwd
    if (prompt === undefined || workspace === undefined) return true
    if (this.rollbackWorkspaces.has(workspace)) {
      this.recordAdmissionFailure(agent.id, prompt, '回滚正在进行，请稍后再试。')
      return false
    }
    return await this.enqueue(agent.id, async () => {
      try {
        if (this.rollbackWorkspaces.has(workspace)) {
```

</details>

**依据 6 · 源码核查**：[packages/client-rollback-button/src/client/index.ts:134-178](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/index.ts#L134-L178)

Web装饰与Host命令差异。

<details>
<summary>查看原文（45行）</summary>

```text
  // `/undo` is consumed through the public input dock before it reaches the
  // Host command handler. The timeline then invokes the same undo transaction
  // repeatedly and opens only its final child.
  const disposeTimeline = ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'undo-timeline',
    order: 61,
    inject: (sessionId: SessionId): UndoTimelineInjected => {
      const controller = controllerFor(sessionId)
      return {
        layers: () => controller.layers(),
        openTrajectory: openNativeTrajectory,
        open: async (messageId) => {
          autoFollowSuspendedUntil = Number.POSITIVE_INFINITY
          try {
            const result = await controller.undoThrough(messageId)
            if (result === undefined) throw new Error(controller.getSnapshot().error ?? '回滚未完成，请重试。')
            keepRollbackChildOpen(sessions, result.sessionId)
          } finally {
            // Archive projections race the Remote response; keep their
            // intermediate child opens suppressed through the next paint.
            autoFollowSuspendedUntil = Date.now() + 5000
          }
        },
      }
    },
  }, UndoTimeline))

  // A dock component observes the already-settled input snapshot, which is
  // too late to stop the Host's own bare `/undo` command.  The supported
  // decoration point claims that bare invocation first, then signals the
  // custom visual picker and clears the command token from its public input
  // action.  Arguments still belong to the Host command unchanged.
  const disposeUndoDecoration = commandUi?.decorate({
    name: 'undo',
    available: () => true,
    ui: {
      kind: 'popupSelect',
      options: async (session, _signal) => {
        requestUndoTimeline(String(session.sessionId))
        return []
      },
      onSelect: () => {},
    },
  }) ?? (() => {})
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 影子Git覆盖与恢复边界能保证整个工作区回到过去吗？

**研究主题：**功能与机制、缺陷与关键质疑

#### 完整回答

ShadowGit显式设独立GIT_DIR/WORK_TREE/INDEX，捕获git add --all/write-tree，不写用户refs或index，这是有用的隔离存储设计；但不是系统快照。仅接受Git普通非bare、无已跟踪gitlink的工作区，成功检查按workspace缓存，运行中新增submodule不重新检查。忽略文件遵循私有Git所用ignore规则，不捕获整个磁盘，测试也明确private/保留redo值。空目录、外部网络/数据库等更不在树中。

restore用from/target树diff，先删除仅from有的路径，再read-tree和checkout-index改动路径；超过400个update退回checkout所有目标文件。删除对当前若为目录会recursive rm，目标在词法workspace边界内，但不做父目录realpath核对；外部写入/路径替换需单独保护。restore无原子文件系统切换，途中可只改一部分；进程命令无超时/输出上限/AbortSignal。

回退前redoTree捕获的是当时整个Git支持树，不按Agent写入归因。用户或别会话同期改同文件，也会随before tree被覆盖；redo可用于撤销，但仅在回退后verifyMatches目标树时才允许。它检查Git diff与非忽略untracked，不代表数据库/忽略路径无变化。描述“文件树恢复”必须限定支持路径和写入者独占，不能承诺所有业务副作用撤销。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:22-50](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L22-L50)

独立Git环境与无超时。

<details>
<summary>查看原文（29行）</summary>

```text
/** Execute Git with the journal-owned directory and index, never the user's index. */async function git(
  workspace: string,
  shadowGit: string,
  args: readonly string[],
  options: { readonly shadow?: boolean } = {},
): Promise<string> {
  return await new Promise<string>((resolveResult, reject) => {
    const child = spawn('git', [...args], {
      cwd: workspace,
      windowsHide: true,
      env: options.shadow === false
        ? process.env
        : {
            ...process.env,
            GIT_DIR: shadowGit,
            GIT_WORK_TREE: workspace,
            GIT_INDEX_FILE: `${shadowGit}/index`,
          },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => { stdout.push(chunk) })
    child.stderr.on('data', (chunk: Buffer) => { stderr.push(chunk) })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolveResult(Buffer.concat(stdout).toString('utf8'))
        return
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:68-102](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L68-L102)

Git工作区/子模块检查。

<details>
<summary>查看原文（35行）</summary>

```text
 * @param workspace - Candidate worktree root.
 * @returns Resolution only for a supported non-bare, submodule-free worktree.
 */
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
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:103-156](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L103-L156)

capture及非原子restore。

<details>
<summary>查看原文（54行）</summary>

```text
    await this.ensure()
    await git(this.workspace, this.shadowGit, ['add', '--all', '--', '.'])
    const tree = (await git(this.workspace, this.shadowGit, ['write-tree'])).trim()
    if (!/^[0-9a-f]{40,64}$/.test(tree)) throw new Error('conversation-undo: Git returned an invalid tree id')
    return tree as ConversationUndoTree
  }

  /** Restore an exact tree, deleting only paths captured in `from` but absent from `target`.
   * @param target - Private tree to materialize.
   * @param from - Prior private tree defining removable captured paths.
   */
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
  }

  /** List Git-supported paths changed between two private trees without touching the workspace. */
  async changes(from: ConversationUndoTree, target: ConversationUndoTree): Promise<readonly ShadowGitChange[]> {
    await this.ensure()
    const output = await git(this.workspace, this.shadowGit, [
      'diff-tree', '-r', '-z', '--no-renames', '--no-commit-id', '--name-status', String(from), String(target),
    ])
    const tokens = output.split('\0')
    const changes: ShadowGitChange[] = []
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:201-218](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L201-L218)

verify范围。

<details>
<summary>查看原文（18行）</summary>

```text
      // full-worktree stat pass.
      await git(this.workspace, this.shadowGit, ['diff', '--quiet', String(tree)])
    } catch {
      return false
    }
    const untracked = await git(this.workspace, this.shadowGit, ['ls-files', '-o', '--exclude-standard'])
    return untracked.length === 0
  }

  /** Refresh the index stat cache so a later {@link verifyMatches} skips the full-worktree stat pass. */
  async refreshStats(): Promise<void> {
    await this.ensure()
    await git(this.workspace, this.shadowGit, ['update-index', '--refresh'])
  }

  private async ensure(): Promise<void> {
    await mkdir(dirname(this.shadowGit), { recursive: true })
    try {
```

</details>

**依据 5 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:242-253](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L242-L253)

递归删除。

<details>
<summary>查看原文（12行）</summary>

```text
  private async removeCapturedPath(path: string): Promise<void> {
    const target = workspacePath(this.workspace, path)
    try {
      const info = await lstat(target)
      if (info.isDirectory() && !info.isSymbolicLink()) {
        await rm(target, { recursive: true, force: true })
      } else {
        await rm(target, { force: true })
      }
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
```

</details>

**依据 6 · 源码核查**：[packages/rollback-undo/src/index.ts:1150-1163](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1150-L1163)

成功workspace检查缓存。

<details>
<summary>查看原文（14行）</summary>

```text
   * prompt admission re-running it dominates the arm cost. A failing check
   * is not cached.
   * @param workspace - Candidate worktree root.
   * @returns Resolution only for a supported non-bare, submodule-free worktree.
   */
  private assertWorkspace(workspace: string): Promise<void> {
    let check = this.workspaceChecks.get(workspace)
    if (check === undefined) {
      check = assertSupportedWorkspace(workspace)
      this.workspaceChecks.set(workspace, check)
      void check.catch(() => { this.workspaceChecks.delete(workspace) })
    }
    return check
  }
```

</details>

**依据 7 · 源码核查**：[packages/rollback-undo/tests/shadow-git.spec.ts:31-61](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/tests/shadow-git.spec.ts#L31-L61)

忽略路径不回退断言。

<details>
<summary>查看原文（31行）</summary>

```text
describe('ShadowGit', () => {
  it('restores captured paths while leaving ignored paths outside the snapshot', async () => {
    const root = await workspace()
    await writeFile(join(root, '.gitignore'), 'private/\n')
    await writeFile(join(root, 'tracked.txt'), 'before\n')
    await writeFile(join(root, 'removed.txt'), 'keep\n')
    await mkdir(join(root, 'private'))
    await writeFile(join(root, 'private', 'state.txt'), 'outside-before\n')

    await assertSupportedWorkspace(root)
    const journal = await mkdtemp(join(tmpdir(), 'dsh-conversation-undo-shadow-'))
    roots.push(journal)
    const shadow = new ShadowGit(root, journal)
    const before = await shadow.capture()

    await writeFile(join(root, 'tracked.txt'), 'redo\n')
    await rm(join(root, 'removed.txt'))
    await writeFile(join(root, 'created.txt'), 'redo-only\n')
    await writeFile(join(root, 'private', 'state.txt'), 'outside-redo\n')
    const redo = await shadow.capture()

    await shadow.restore(before, redo)
    await expect(readFile(join(root, 'tracked.txt'), 'utf8')).resolves.toBe('before\n')
    await expect(readFile(join(root, 'removed.txt'), 'utf8')).resolves.toBe('keep\n')
    await expect(readFile(join(root, 'created.txt'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
    await expect(readFile(join(root, 'private', 'state.txt'), 'utf8')).resolves.toBe('outside-redo\n')

    await shadow.restore(redo, before)
    await expect(readFile(join(root, 'tracked.txt'), 'utf8')).resolves.toBe('redo\n')
    await expect(readFile(join(root, 'removed.txt'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
    await expect(readFile(join(root, 'created.txt'), 'utf8')).resolves.toBe('redo-only\n')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退事务、并发和恢复何时可靠，哪里仍有歧义？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

有明确工程增量。admission先捕before树，失败拒收提示；结束捕after树失败只影响只读检查，不取消原可回退点。lineage/generation保留连续历史，操作按source session Promise尾串行、workspace字符串Set互斥，fork与文件恢复并行前先写restoring journal。JSON临时文件随机名后rename、坏JSON不静默丢弃；启动会按restoring/revoking的会话归档状态和实际Git树判断，能匹配才完成或退回，否则recovery-required。比只有内存undo栈更可恢复。

但串行/Set只在单进程同原始workspace字符串，不锁同物理路径别名/多host/其他会话运行和用户编辑。quiesce仅在source非idle或有非idle后代时调用；source和子Agent均idle但jobs/PTY仍运行时，外层不会先检查hasControlledActivity，可能跳过其内部kill/等待。即使调用，也仅知宿主注册、归属树内jobs/terminals，无法冻结其他写者。

尤其运行期错误补偿不等启动恢复。fork失败时等待restore结束再反向restore，archive失败时反向恢复；若fork已成功而restore失败，没有同样反向restore。统一catch会dispose child、把旧recoverable phase=ready写回；即使反向恢复本身失败，也仍尝试写ready，从而可能抹去restoring/redo元数据。归档成功后publish predecessor或complete落盘失败也会进此catch，归档和文件变更未必反转。启动分支只处理restoring/revoking，不会自动把已重写ready视不确定，不能宣称异常都能安全回滚。

另外readActiveJournal只选armed/ready，因此current中recovery-required分支不能直接通过该函数命中；archiveAction另有findLatest提示。这是恢复状态展示的具体缺口。尚未运行故障注入，以上是分支与写入顺序可见的静态风险，不宣称已造成数据损失。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:675-724](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L675-L724)

互斥、quiesce条件和redo。

<details>
<summary>查看原文（50行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:727-776](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L727-L776)

并行恢复、条件补偿。

<details>
<summary>查看原文（50行）</summary>

```text
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
          }
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
          // Warm the shadow index stat cache in the background and remember
          // the promise: a later revoke waits for it (or finds it done) and
          // its verify then skips the full-worktree stat pass. Failure is
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:801-826](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L801-L826)

失败重写ready。

<details>
<summary>查看原文（26行）</summary>

```text
          this.prearms.set(childShadowDir, prearm)
          return this.success({ sessionId: child.agent.id })
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
  }

```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:901-913](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L901-L913)

结束快照失败边界。

<details>
<summary>查看原文（13行）</summary>

```text
  private async markReady(agent: Agent, turn: number): Promise<void> {
    const journal = await this.readActiveJournal(agent.id)
    if (journal?.phase !== 'armed' || journal.turn !== turn) return
    try {
      const afterTree = await new ShadowGit(journal.workspace, this.shadowDirectory(journal)).capture()
      await this.writeJournal({ ...journal, afterTree, completedAt: Date.now(), phase: 'ready' })
    } catch (error) {
      // This read-only inspector is an enhancement; its snapshot must never
      // take away an otherwise valid rollback point after the answer finishes.
      this.ctx.logger.warn(`rollback undo: step-change snapshot unavailable: ${String(error)}`)
      await this.writeJournal({ ...journal, completedAt: Date.now(), phase: 'ready' })
    }
  }
```

</details>

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:926-950](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L926-L950)

启动只处理特定phase。

<details>
<summary>查看原文（25行）</summary>

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
    }
```

</details>

**依据 6 · 源码核查**：[packages/rollback-undo/src/index.ts:973-997](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L997)

按树/会话验证恢复。

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

**依据 7 · 源码核查**：[packages/rollback-undo/src/index.ts:1063-1108](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1063-L1108)

受控活动停止逻辑。

<details>
<summary>查看原文（46行）</summary>

```text
  private async quiesce(source: Agent): Promise<void> {
    const agents = this.ownedAgentTree(source)
    for (const agent of agents) {
      if (agent.status !== 'idle') agent.cancel({ kind: 'user' })
    }
    await this.waitForQuiescence(agents)
    if (agents.some(agent => agent.status !== 'idle') || this.hasControlledActivity(agents)) {
      await this.forceStopControlledActivity(agents)
    }
    const deadline = Date.now() + 2000
    while ((agents.some(agent => agent.status !== 'idle') || this.hasControlledActivity(agents)) && Date.now() < deadline) {
      await new Promise<void>(resolve => { setTimeout(resolve, 50) })
    }
    const runningAgents = agents.filter(agent => this.ctx.agents.get(agent.id) !== undefined && agent.status !== 'idle')
    if (runningAgents.length > 0 || this.hasControlledActivity(agents)) {
      throw new Error(`会话仍有 ${String(runningAgents.length)} 个运行任务或受控进程，无法安全回滚。`)
    }
  }

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
```

</details>

**依据 8 · 源码核查**：[packages/rollback-undo/src/index.ts:1179-1183](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1179-L1183)

active只含armed/ready。

```text
  private async readActiveJournal(sourceSessionId: SessionId): Promise<ConversationUndoJournal | undefined> {
    return this.selectLatest((await this.readJournals()).filter(journal =>
      journal.sourceSessionId === sourceSessionId
      && (journal.phase === 'armed' || journal.phase === 'ready')))
  }
```

**依据 9 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:261-300](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L261-L300)

原子JSON/严格读取。

<details>
<summary>查看原文（40行）</summary>

```text
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
}

/** Retry `rename` on transient Windows locks (Defender, file indexers). */
async function renameWithRetry(from: string, to: string, retries = 5): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    try {
      await rename(from, to)
      return
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (attempt < retries && (code === 'EPERM' || code === 'EBUSY' || code === 'EACCES')) {
        await new Promise<void>(resolve => { setTimeout(resolve, 100 * (attempt + 1)) })
        continue
      }
      throw error
    }
  }
}

/** Read one optional JSON record from the plugin-owned data directory.
 * @param path - Plugin-owned JSON record path.
 * @param schema - Durable-boundary validator.
 * @returns Parsed record, or `undefined` when absent.
 */
export async function readJson<T>(path: string, schema: z.ZodType<T>): Promise<T | undefined> {
  try {
    return schema.parse(JSON.parse(await readFile(path, 'utf8')))
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw error
```

</details>

**依据 10 · 源码核查**：[packages/rollback-undo/src/index.ts:774-801](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L774-L801)

后台stat warmer与prearm，后续操作等待以避免索引争用

<details>
<summary>查看原文（28行）</summary>

```text
          // Warm the shadow index stat cache in the background and remember
          // the promise: a later revoke waits for it (or finds it done) and
          // its verify then skips the full-worktree stat pass. Failure is
          // harmless — verify falls back to a cold pass.
          const shadowDir = this.shadowDirectory(journal)
          const warmer = shadow.refreshStats()
            .catch(() => {})
            .finally(() => { this.statWarmers.delete(shadowDir) })
          this.statWarmers.set(shadowDir, warmer)
          // Pre-initialize the child generation's shadow repository in the
          // background: its first arm capture would otherwise pay the cold
          // `git add` over the whole worktree. The pre-captured tree equals
          // beforeTree (restore just materialized it), which is exactly the
          // child's first before-tree unless the user edits files first —
          // arm's incremental add then corrects it. arm awaits this promise
          // so the two never contend for the shadow index.
          const childJournal = {
            workspace: journal.workspace,
            logicalConversationId: journal.logicalConversationId,
            generation: journal.generation + 1,
            shadowLayout: 'lineage' as const,
          }
          const childShadowDir = this.shadowDirectory(childJournal)
          const prearm = new ShadowGit(workspace, childShadowDir).capture()
            .then(() => undefined)
            .catch(() => {})
            .finally(() => { this.prearms.delete(childShadowDir) })
          this.prearms.set(childShadowDir, prearm)
```

</details>

#### 缺口

- 故障发生后真实文件树、归档及子会话三者的可辨认组合，以及同一目录其它写入者的宿主排他契约
  **影响：**不可承诺多资源事务原子性或所有失败自动恢复，尤其ready重写后丢失中间态
  **进一步探讨：**逐个故障点检查持久phase/redo保留及树核对，加入闲置Agent仍有job、同目录双会话和路径别名反例

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 归档恢复/删除与界面承诺一致吗，访问和隐私边界在哪里？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

归档代码文件头称没有永久删除/恢复，但实际Remote restore会fork一个completed-turn新会话，原归档不unarchive；重复restore可创建多个分支。delete确实通过sessionPersistence.locate取得路径，再recursive rm其父目录，随后改时间和tombstone；不是单纯隐藏。代码注释不能替代读实际方法。删除无跨资源事务，日志删后metadata/tombstone失败可返回错误但文件已没，且未清理undo独立影子Git/prompt/journal，不能把“删归档”当完整隐私擦除。deleteAll跳过tombstone，逐项收结果。

各Remote输入sessionId，方法内没有用户/角色/会话所有权校验，依赖宿主Remote传输和部署认证；这里不能推断互联网任意人可调，也不能当自带多租户隔离。archive read只展示文本、略工具/附件，inspectLayer包含路径/命令及diff，只有sk-样式正则脱敏，不是通用秘密检测。磁盘before/redo保存源文件且prompt原文留journal，即使界面不显示也仍占盘。

浏览器controller按session串行，区分传输错误与业务错误；header点击会刷新目标，时间线操作抑制中间子会话自动打开，属于实际流程打磨。四client贡献工具卡/折叠并不增加文件回退覆盖。具体原生Trajectory DOM/slot兼容与宿主鉴权是外部契约，而非本项源码可独立证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-archive/src/index.ts:140-162](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-archive/src/index.ts#L140-L162)

restore实际fork。

<details>
<summary>查看原文（23行）</summary>

```text
  }

  /** Restore one archived conversation as a new visible Session without touching its log.
   * @param request - Archived Session to restore.
   * @returns The replacement Session or a business refusal.
   */
  @Remote('restore')
  async restore(request: SessionArchiveSessionRequest): Promise<SessionArchiveResult<SessionArchiveMutationValue>> {
    if (!this.ctx.workspaceRegistry.archivedSessionIds.includes(request.sessionId)) {
      return this.failure('not-archived', `session "${request.sessionId}" is not archived`)
    }
    try {
      const restored = await this.ctx.sessionFork.fork({
        sourceSessionId: request.sessionId,
        cut: { kind: 'completed-turn' },
      })
      return this.success({ changed: true, sessionId: restored.handle.agent.id })
    } catch (error) {
      return this.failure('session-live', `session "${request.sessionId}" could not be restored: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /** Permanently delete an archived Session's log files and hide it from the task list.
```

</details>

**依据 2 · 源码核查**：[packages/rollback-archive/src/index.ts:164-214](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-archive/src/index.ts#L164-L214)

永久目录删除/逐项结果。

<details>
<summary>查看原文（51行）</summary>

```text
   * @returns Permanent-deletion mutation result.
   */
  @Remote('delete')
  async delete(request: SessionArchiveSessionRequest): Promise<SessionArchiveResult<SessionArchiveMutationValue>> {
    if (!this.ctx.workspaceRegistry.archivedSessionIds.includes(request.sessionId)) {
      return this.failure('not-archived', `session "${request.sessionId}" is not archived`)
    }
    const agent = this.ctx.agents.get(request.sessionId)
    let status: Agent['status'] = agent?.status ?? 'idle'
    if (status !== 'idle') {
      agent?.cancel({ kind: 'user' })
      const deadline = Date.now() + 2000
      while (status !== 'idle' && Date.now() < deadline) {
        await new Promise<void>(resolve => { setTimeout(resolve, 50) })
        status = this.ctx.agents.get(request.sessionId)?.status ?? 'idle'
      }
      if (status !== 'idle') {
        return this.failure('session-live', `session "${request.sessionId}" is still running and cannot be permanently deleted`)
      }
    }
    const header = (await this.headers()).get(request.sessionId)
    const location = header === undefined ? undefined : this.ctx.sessionPersistence.locate(header)
    if (location === undefined) {
      return this.failure('backend-unsupported', 'this session backend does not expose a deletable artifact')
    }
    try {
      await rm(dirname(location.path), { recursive: true, force: true })
    } catch (error) {
      return this.failure('backend-unsupported', `session "${request.sessionId}" log deletion failed: ${error instanceof Error ? error.message : String(error)}`)
    }
    await this.setArchiveTime(request.sessionId, undefined)
    await this.tombstone(request.sessionId)
    return this.success({ changed: true })
  }

  /** Permanently delete every non-tombstoned archived Session.
   * @returns Per-Session outcomes; individual refusals do not stop the sweep.
   */
  @Remote('deleteAll')
  async deleteAll(): Promise<SessionArchiveDeleteAllValue> {
    const deleted: SessionId[] = []
    const failed: SessionArchiveDeleteFailure[] = []
    for (const sessionId of this.ctx.workspaceRegistry.archivedSessionIds) {
      if (this.tombstones.has(sessionId)) continue
      const result = await this.delete({ sessionId })
      if (result.ok) deleted.push(sessionId)
      else failed.push({ sessionId, message: result.error.message })
    }
    return { deleted, failed }
  }

```

</details>

**依据 3 · 源码核查**：[packages/rollback-archive/src/index.ts:246-265](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-archive/src/index.ts#L246-L265)

按归档ID读文本。

<details>
<summary>查看原文（20行）</summary>

```text
   * @returns Text transcript and metadata without navigation changes.
   */
  @Remote('read')
  async read(request: SessionArchiveSessionRequest): Promise<SessionArchiveResult<ArchivedSessionReadValue>> {
    if (!this.ctx.workspaceRegistry.archivedSessionIds.includes(request.sessionId)) {
      return this.failure('not-archived', `session "${request.sessionId}" is not archived`)
    }
    const events = await this.events(request.sessionId)
    const title = titleOf(events)
    return this.success({
      sessionId: request.sessionId,
      ...title === undefined ? {} : { title },
      messages: transcript(events),
    })
  }

  /** Combine persisted and live headers; live identities win over a stale durable listing. */
  private async headers(): Promise<Map<SessionId, SessionHeader>> {
    const headers = new Map((await this.ctx.sessionPersistence.list()).map(header => [header.id, header]))
    for (const session of this.ctx.sessions.list()) headers.set(session.id, session.header)
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:112-119](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L112-L119)

有限脱敏。

```text
    return undefined
  }
}

/** Keep inspection output read-only without exposing recognisable API keys from commands or diffs. */
function redactSecrets(value: string): string {
  return value.replace(/\bsk-[a-z0-9_-]{8,}\b/giu, '[已隐藏 API 密钥]')
}
```

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:319-344](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L319-L344)

inspect可见命令/diff。

<details>
<summary>查看原文（26行）</summary>

```text

  /** Read the timeline points reachable by repeatedly rolling back the current last message. */
  @Remote('layers')
  async layers(request: ConversationUndoLayersRequest): Promise<readonly ConversationUndoLayerValue[]> {
    return await this.layersFor(request.sessionId)
  }

  /** Read the files and executable tool commands produced by one timeline point. */
  @Remote('inspectLayer')
  async inspectLayer(request: ConversationUndoLayerInspectionRequest): Promise<ConversationUndoLayerInspectionValue> {
    const journal = await this.journalForLayer(request.sessionId, request.userMessageId)
    if (journal === undefined) return { files: [], commands: [] }
    const afterTree = journal.afterTree
    const files = afterTree === undefined
      ? []
      : await (async () => {
        const shadow = new ShadowGit(journal.workspace, this.shadowDirectory(journal))
        const changes = await shadow.changes(journal.beforeTree, afterTree)
        return await Promise.all(changes.map(async change => {
          const diff = redactSecrets(await shadow.diffPreview(journal.beforeTree, afterTree, change.path) ?? '')
          return { ...change, ...(diff === '' ? {} : { diff }) }
        }))
      })()
    const events = this.ctx.sessions.get(journal.sourceSessionId)?.events
      ?? (await this.ctx.sessionPersistence.inspect(journal.sourceSessionId)).events
    return {
```

</details>

**依据 6 · 源码核查**：[packages/client-rollback-button/src/client/controller.ts:83-117](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/controller.ts#L83-L117)

传输业务分层。

<details>
<summary>查看原文（35行）</summary>

```text
  /** Re-read the latest point and the revocable pair after a transcript event or transport reconnect. */
  async refresh(): Promise<void> {
    this.publish({ status: 'loading', value: this.view.value, revokePair: this.view.revokePair, error: null })
    const operation = this.tail.then(async () => {
      try {
        const [pointCarried, pairCarried] = await Promise.all([
          this.remote.current({ sessionId: this.sessionId }),
          this.remote.revokePair({ sessionId: this.sessionId }),
        ])
        if (!pointCarried.ok) {
          this.publish({ status: 'error', value: this.view.value, revokePair: this.view.revokePair, error: pointCarried.error.message })
          return
        }
        if (!pointCarried.value.ok) {
          this.publish({ status: 'error', value: this.view.value, revokePair: this.view.revokePair, error: pointCarried.value.error.message })
          return
        }
        this.publish({
          status: 'ready',
          value: pointCarried.value.value,
          revokePair: pairCarried.ok ? pairCarried.value : undefined,
          error: null,
        })
      } catch (error) {
        this.publish({
          status: 'error',
          value: this.view.value,
          revokePair: this.view.revokePair,
          error: error instanceof Error ? error.message : '回滚请求失败。',
        })
      }
    })
    this.tail = operation.then(() => undefined)
    return await operation
  }
```

</details>

**依据 7 · 源码核查**：[packages/client-rollback-button/src/client/index.ts:96-113](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/index.ts#L96-L113)

点击刷新。

<details>
<summary>查看原文（18行）</summary>

```text
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
        },
      }
```

</details>

**依据 8 · 源码核查**：[packages/client-rollback-button/src/client/index.ts:139-178](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/client-rollback-button/src/client/index.ts#L139-L178)

时间线与装饰。

<details>
<summary>查看原文（40行）</summary>

```text
    id: 'undo-timeline',
    order: 61,
    inject: (sessionId: SessionId): UndoTimelineInjected => {
      const controller = controllerFor(sessionId)
      return {
        layers: () => controller.layers(),
        openTrajectory: openNativeTrajectory,
        open: async (messageId) => {
          autoFollowSuspendedUntil = Number.POSITIVE_INFINITY
          try {
            const result = await controller.undoThrough(messageId)
            if (result === undefined) throw new Error(controller.getSnapshot().error ?? '回滚未完成，请重试。')
            keepRollbackChildOpen(sessions, result.sessionId)
          } finally {
            // Archive projections race the Remote response; keep their
            // intermediate child opens suppressed through the next paint.
            autoFollowSuspendedUntil = Date.now() + 5000
          }
        },
      }
    },
  }, UndoTimeline))

  // A dock component observes the already-settled input snapshot, which is
  // too late to stop the Host's own bare `/undo` command.  The supported
  // decoration point claims that bare invocation first, then signals the
  // custom visual picker and clears the command token from its public input
  // action.  Arguments still belong to the Host command unchanged.
  const disposeUndoDecoration = commandUi?.decorate({
    name: 'undo',
    available: () => true,
    ui: {
      kind: 'popupSelect',
      options: async (session, _signal) => {
        requestUndoTimeline(String(session.sessionId))
        return []
      },
      onSelect: () => {},
    },
  }) ?? (() => {})
```

</details>

#### 缺口

- 固定宿主Remote请求的身份/权限和sessionPersistence.locate目录布局
  **影响：**不能自行承诺多租户访问隔离或任意后端删除均安全适配
  **进一步探讨：**核对应宿主的Remote授权及locate artifact所有权，不把sessionId不可猜当授权

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动与三阶段成本有哪些具体条件？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

作者要求DSH rc6+且Web重启，真正入口是七包组合和替换两个原归档row；client需要dsh-web-app surface，headless应去四client row。undo强依赖agents/sessions/archive/fork/persistence/workspace/commands，Git可执行及受支持工作区是首次合格提示前置；无Git/有gitlink等会拒收，而不是悄悄失去快照。包依赖^rc.8不是不可变锁，仓库源与实际安装构建/依赖版本需分别定位。checkout未有lib发布产物，研究读的是固定源码，不能声称已核相同npm包字节。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Git、DSH与七包依赖，独立快照目录磁盘 | 备份重要稿件，核组合覆盖和宿主版本 | 包价/工时无资料，不以免费许可证推总成本 |
| 持续使用 | 每条合格提示捕获文件树，保存Git对象和prompt/journal；会话分叉另留历史 | 识别忽略路径/外部副作用，检查回退目标与容量 | 无自动保留上限/GC策略，冷扫描耗时依树大小；作者注释性能数非本轮测量 |
| 失败恢复 | 保留before/redo树、原会话及磁盘备份 | 核文件树/归档/子会话状态，处理recovery-required和补偿失败 | 原子JSON不等多资源事务；停其他写入者，未知恢复工时 |

/update是实际用户命令，会定位包含pnpm-workspace.yaml的仓库布局，再git pull --ff-only、pnpm install/build，成功后需重启。npm安装布局不一定具该标记；拉取成功后install/build失败不回滚HEAD，之后再update若HEAD没动会直接“无需更新”，不能当原子自更新。每步有30s/120s/300s/600s时限，只kill child并非明确进程树，输出无上限；这些是额外维护/恢复条件，不把自更新加入日常回退前置。

#### 证据与依据

**依据 1 · 作者声明**：[packages/bundle-rollback/README.md:11-19](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/README.md#L11-L19)

安装条件。

````text

```sh
dsh plugin --profile web add dsh-undo-plugin
```

Requires `dsh` 0.1.0-rc.6 or newer. Restart `dsh web` after installing.

Full documentation: [中文](https://github.com/23swccp/dsh-undo#readme) | [English](https://github.com/23swccp/dsh-undo/blob/HEAD/README.en.md)

````

**依据 2 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:1-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L1-L44)

headless及替换。

<details>
<summary>查看原文（44行）</summary>

```text
# The dsh-undo-plugin bundle patch: conversation rollback + archive tasks
# as installable plugin rows. Applied after the target profile's base bundle;
# rows here insert new plugin entries. `dshHomePath` is the host-side
# expression the dsh boot injects for application-data roots.
#
# Headless profiles may drop the four `client-rollback-*` rows (they require
# the dsh-web-app browser surface).
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

**依据 3 · 源码核查**：[packages/rollback-undo/package.json:47-65](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/package.json#L47-L65)

依赖契约。

<details>
<summary>查看原文（19行）</summary>

```text
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session-persistence": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-terminal": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-typert-protocol": "workspace:^",
    "@deepseek-ai/dsh-workspace": "^0.1.0-rc.6",
    "@dsh-undo/rollback-archive": "^0.1.0-rc.8",
    "@dsh-undo/rollback-fork": "^0.1.0-rc.8"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-brand": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-commands": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-invariants": "^0.1.0-rc.6",
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:186-228](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L186-L228)

服务/用户命令。

<details>
<summary>查看原文（43行）</summary>

```text
export class ConversationUndoService extends TypertRemoteService {
  static inject = ['agents', 'sessions', 'sessionArchive', 'sessionFork', 'sessionPersistence', 'workspaceRegistry', 'commands']
  static Config: s<Config> = s.object({ root: s.string().min(1).required() })

  private readonly operationTails = new Map<SessionId, Promise<void>>()
  private readonly rollbackSessions = new Set<SessionId>()
  private readonly rollbackWorkspaces = new Set<string>()
  private readonly admissionFailures = new Map<SessionId, ConversationAdmissionFailureValue>()
  private readonly statWarmers = new Map<string, Promise<void>>()
  private readonly prearms = new Map<string, Promise<void>>()
  private readonly workspaceChecks = new Map<string, Promise<void>>()

  /** @param ctx - Host context with top-level agents and archive/fork capabilities. @param config - journal directory. */
  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'conversationUndo')
  }

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
    this.ctx.commands.register({
      name: 'update',
      description: '更新 dsh-undo-plugin:拉取最新代码并重新构建(重启 dsh 后生效)',
      handler: invocation => this.updateCommand(invocation),
    })
  }

  /** Execute `/update`: pull, install, and rebuild this plugin's own workspace.
   * @param invocation - command invocation; no arguments are accepted.
```

</details>

**依据 5 · 源码核查**：[packages/rollback-undo/src/update.ts:8-25](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/update.ts#L8-L25)

更新布局/时限。

<details>
<summary>查看原文（18行）</summary>

```text
/** Wall-clock ceilings per step; a hung step aborts the update instead of blocking the host. */
const REV_TIMEOUT_MS = 30_000
const PULL_TIMEOUT_MS = 120_000
const INSTALL_TIMEOUT_MS = 300_000
const BUILD_TIMEOUT_MS = 600_000

/** Locate the plugin workspace root: this module sits at
 * `<root>/packages/rollback-undo/<src|lib>/update.<ts|js>`, three levels below
 * the root under both the source and built layouts.
 * @returns Absolute path of the installable plugin workspace.
 * @throws When the expected marker file is absent (unexpected install layout).
 */
export function pluginWorkspaceRoot(): string {
  const candidate = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
  if (!existsSync(resolve(candidate, 'pnpm-workspace.yaml'))) {
    throw new Error(`无法定位插件工作区根目录(期望 ${candidate} 含 pnpm-workspace.yaml)。`)
  }
  return candidate
```

</details>

**依据 6 · 源码核查**：[packages/rollback-undo/src/update.ts:72-99](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/update.ts#L72-L99)

非原子更新与无变更短路。

<details>
<summary>查看原文（28行）</summary>

```text
}

/** Pull, install, and rebuild the plugin workspace in one transaction-shaped pass.
 * @param root - Plugin workspace root (a git checkout).
 * @returns User-facing summary text (already up to date, or updated and rebuilt).
 * @throws With a user-facing message at the first failing step.
 */
export async function performPluginUpdate(root: string): Promise<string> {
  let outcome: PullOutcome
  try {
    outcome = await pullFastForward(root)
  } catch (error) {
    throw new Error(`更新失败:拉取最新代码未成功(${root})。${error instanceof Error ? error.message : String(error)}`)
  }
  const range = `${outcome.before.slice(0, 7)}→${outcome.after.slice(0, 7)}`
  if (!outcome.changed) return `已是最新版本(${outcome.after.slice(0, 7)}),无需更新。`
  try {
    await run(root, 'pnpm', ['install'], INSTALL_TIMEOUT_MS)
  } catch (error) {
    throw new Error(`已拉取 ${range},但依赖安装失败,请手动执行 pnpm install。${error instanceof Error ? error.message : String(error)}`)
  }
  try {
    await run(root, 'pnpm', ['run', 'build'], BUILD_TIMEOUT_MS)
  } catch (error) {
    throw new Error(`已拉取 ${range},但构建失败,请手动执行 pnpm run build。${error instanceof Error ? error.message : String(error)}`)
  }
  return `已更新 ${range} 并重新构建。请重启 dsh 使新版本生效。`
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何判断采用与未来可证伪方向？

**研究主题：**采用判断、新假设与验证、贡献与相对优势

#### 完整回答

建议观察，聚焦可丢弃或已备份、无外部业务副作用且工作区独占的本地文件任务。绑定对话前缀与Git树、lineage连续历史、启动独立树核对有真实增量，交付物由手动Git/聊天对齐变成一个带节点身份的回退分支；不是新快照技术。最影响承诺的是异常统一写ready可能抹去未完成事务，以及闲置Agent带后台任务/其他写者不一定静止。归档删除也有真实破坏性，不应只因文件头说隐藏就当安全。依据这些具体路径而观察，不以未做冒烟为理由。

可探讨“可证明回退收据”。参照当前journal+多资源补偿，先以规范物理workspace取得全写者租约，在每个文件/会话/归档步骤持久不可降级的意图与结果，补偿失败保recovery-required，校验before/after/redo实际树再出具明确覆盖/未覆盖副作用收据。管理员可按租约及原始状态手动恢复，不自动重放可能已发生的网络动作。代价是宿主全写者登记、持久化写入和中间态处理复杂，未实现/验证，不计现有创新分。

最小反例为fork成功后checkout失败、archive成功后publish失败、反向恢复失败、断电中间态、idle Agent仍有PTY、同一物理目录别名/双会话、忽略文件与网络发送。若报告完成但树/会话/归档不一致，或异常被ready掩盖则否定收据保证；若独占与收据维护成本大于手动恢复节省，则不支持净收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:727-820](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L727-L820)

事务与补偿基线。

<details>
<summary>查看原文（94行）</summary>

```text
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
          }
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
          // Warm the shadow index stat cache in the background and remember
          // the promise: a later revoke waits for it (or finds it done) and
          // its verify then skips the full-worktree stat pass. Failure is
          // harmless — verify falls back to a cold pass.
          const shadowDir = this.shadowDirectory(journal)
          const warmer = shadow.refreshStats()
            .catch(() => {})
            .finally(() => { this.statWarmers.delete(shadowDir) })
          this.statWarmers.set(shadowDir, warmer)
          // Pre-initialize the child generation's shadow repository in the
          // background: its first arm capture would otherwise pay the cold
          // `git add` over the whole worktree. The pre-captured tree equals
          // beforeTree (restore just materialized it), which is exactly the
          // child's first before-tree unless the user edits files first —
          // arm's incremental add then corrects it. arm awaits this promise
          // so the two never contend for the shadow index.
          const childJournal = {
            workspace: journal.workspace,
            logicalConversationId: journal.logicalConversationId,
            generation: journal.generation + 1,
            shadowLayout: 'lineage' as const,
          }
          const childShadowDir = this.shadowDirectory(childJournal)
          const prearm = new ShadowGit(workspace, childShadowDir).capture()
            .then(() => undefined)
            .catch(() => {})
            .finally(() => { this.prearms.delete(childShadowDir) })
          this.prearms.set(childShadowDir, prearm)
          return this.success({ sessionId: child.agent.id })
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
```

</details>

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:973-997](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L997)

已有独立树核对。

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

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:1063-1108](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1063-L1108)

活动范围。

<details>
<summary>查看原文（46行）</summary>

```text
  private async quiesce(source: Agent): Promise<void> {
    const agents = this.ownedAgentTree(source)
    for (const agent of agents) {
      if (agent.status !== 'idle') agent.cancel({ kind: 'user' })
    }
    await this.waitForQuiescence(agents)
    if (agents.some(agent => agent.status !== 'idle') || this.hasControlledActivity(agents)) {
      await this.forceStopControlledActivity(agents)
    }
    const deadline = Date.now() + 2000
    while ((agents.some(agent => agent.status !== 'idle') || this.hasControlledActivity(agents)) && Date.now() < deadline) {
      await new Promise<void>(resolve => { setTimeout(resolve, 50) })
    }
    const runningAgents = agents.filter(agent => this.ctx.agents.get(agent.id) !== undefined && agent.status !== 'idle')
    if (runningAgents.length > 0 || this.hasControlledActivity(agents)) {
      throw new Error(`会话仍有 ${String(runningAgents.length)} 个运行任务或受控进程，无法安全回滚。`)
    }
  }

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
```

</details>

**依据 4 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:112-156](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L112-L156)

非原子文件变更。

<details>
<summary>查看原文（45行）</summary>

```text
   * @param from - Prior private tree defining removable captured paths.
   */
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
  }

  /** List Git-supported paths changed between two private trees without touching the workspace. */
  async changes(from: ConversationUndoTree, target: ConversationUndoTree): Promise<readonly ShadowGitChange[]> {
    await this.ensure()
    const output = await git(this.workspace, this.shadowGit, [
      'diff-tree', '-r', '-z', '--no-renames', '--no-commit-id', '--name-status', String(from), String(target),
    ])
    const tokens = output.split('\0')
    const changes: ShadowGitChange[] = []
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
