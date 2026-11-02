# dsh-undo-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback)

<!-- BEGIN META -->
[![npm 30d 1,186](https://img.shields.io/static/v1?label=npm+30d&message=1%2C186&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-plugin)
<!-- END META -->

> **功能**：为 DSH 组合消息级文件与会话回退、归档管理及浏览器辅助界面。

> **亮点**：[Q01](#research-q01) 的固定清单与配置支持一项组合贡献：把消息级文件恢复、会话分叉和归档串成同一入口，减少手工对齐动作；核心算法属于内部包，不是 bundle 新发明。

> **主要限制**：[Q03](#research-q03) 发现补偿失败仍可能写回普通 ready 相位，不能保证启动恢复再次核对残余状态；同时，组合会替换原生归档所有权。该控制流已定位但未故障复现，不能把聊天消失等同于全部副作用已撤销。

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
  - [Q01 · bundle 自己交付什么，相对手工组合增加了什么？](#detail-section-11)
  - [Q02 · 七包怎样接线，加载与退出条件是什么？](#detail-section-12)
  - [Q03 · 回退、撤回及中断恢复能保证哪些状态？](#detail-section-13)
  - [Q04 · 一次合格回退需要承担什么成本，什么效果有证据？](#detail-section-14)
  - [Q05 · 是否值得当前试用，如何改进可判定性并证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要同步回退本地文件和模型对话的编程用户可借此选择消息目标；只恢复文件或有外部副作用的任务不等同于这个场景。

直接替代是 Git 或备份恢复文件后手工新建会话，或手工装配七个内部包。对只需文件撤销的任务，组合的持续负担未必值得，详见 [Q01](#research-q01) 与 [Q04](#research-q04)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息级回退 | 内部 undo 服务恢复文件树并创建消息前缀子会话 | Git 支持的本地工作区，外部副作用不覆盖 |
| 撤回回滚 | 恢复 redo 文件树和会话分支 | 当前树不匹配时拒绝，异常恢复未运行验证 |
| 会话分叉 | 从指定历史边界创建 Agent 并关联工作区 | 依赖 fork 服务和宿主持久化接口 |
| 归档与恢复 | 归档源会话、从归档分叉新会话 | 替换原生归档服务，恢复会话不等同恢复文件 |
| 永久删除归档日志 | 删除持久化后端可定位的会话目录 | 后端须提供可删除路径，不保证擦除私有快照 |
| 安装组合 | 声明三个后端和四个客户端包 | 客户端需要 web 表面，真实宿主加载未验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH rc.6/rc.7/rc.8 与 Node ^22.19 或 >=24 | 作者声明必需 | 加载插件及公开 API | 当前宿主兼容未验收，应先核对版本 |
| 七个 @dsh-undo 内部包 | 启动必需 | 分叉、归档、回退和四个浏览器模块 | bundle 声明不能替代实际包解析 |
| dsh-web-app | 浏览器功能必需 | 按钮、归档设置和折叠呈现 | headless 需按作者说明去除四个客户端项 |
| Git、普通非 bare 且无 submodule 工作区 | 文件回退必需 | 私有快照与还原 | 源码会拒绝不支持工作区 |
| 私有 root 目录写权限与容量 | 回退必需 | 保存快照和恢复日志 | 捕获/持久化可能失败，不能当成已回退 |
| 独占写入及独立备份 | 本次安全评估前提 | 识别竞态并保留可行退路 | 不宜在多人共享或不可恢复任务上探索 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 备份与核对 | 用户保留工作区/会话/配置，核对版本和外部副作用 | 缺独立退路即停止 |
| 安装和加载 | 用户按发布入口或源码八包路径配置并重启 | 核对七模块及归档所有权，按钮出现不够 |
| 捕获与回退 | 后端捕获消息前树，用户选目标后分叉/恢复/归档 | 人工核对文件树和子会话前缀 |
| 失败接管 | 用户停止其他写入，保留日志并核实际资源状态 | 不一致则从备份和原会话恢复，不盲目重试 |
| 退出 | 用户保全材料后移除组合并核原生归档恢复 | 未做此核对不能称卸载已完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与包依赖、备份磁盘 | 核对宿主版本、解析包与归档所有权 | 无金额或接入耗时数据 |
| 持续使用 | 私有 Git 对象、journal、分叉会话 | 检查文件与对话目标一致、识别范围外动作 | 对象增长、模型重做费用与全周期耗时未知 |
| 失败恢复 | 保留树、日志与独立备份 | 停写后核对实际文件、会话和归档状态 | 补偿失败的恢复人工量未知，见 Q03 |
| 退出迁移 | 暂存备份与私有历史占用 | 备份后移除配置并核对原生归档恢复 | 未验证自动清除历史，不应直接删唯一恢复材料 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件和对话同步回退 | 内部包以 beforeTree 和消息前缀构造子会话 | 故障和其他写者下的合格率 |
| 撤回保护 | 不匹配目标树时拒绝 workspace-diverged | 各平台文件语义与真实损失避免效果 |
| 安装组合 | 一个 patch 装配七包并替换归档服务 | npm 发布产物、当前宿主加载及总接入时间 |
| 恢复可判定性 | 启动核对部分中间相位的实际状态 | 补偿失败后普通 ready 是否隐藏残余状态 |

> **思考**：[Q03](#research-q03) 发现补偿失败仍可能写回普通 ready 相位，不能保证启动恢复再次核对残余状态；同时，组合会替换原生归档所有权。该控制流已定位但未故障复现，不能把聊天消失等同于全部副作用已撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的固定清单与配置支持一项组合贡献：把消息级文件恢复、会话分叉和归档串成同一入口，减少手工对齐动作；核心算法属于内部包，不是 bundle 新发明。

[Q02](#research-q02) 用声明式 patch 分开组合入口和算法实现，职责清楚；[Q03](#research-q03) 的私有 Git 索引与实际树核对值得借鉴，但恢复阶段不可被失败补偿降级这一约束仍需补强，不能将多资源补偿称作原子事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 发现补偿失败仍可能写回普通 ready 相位，不能保证启动恢复再次核对残余状态；同时，组合会替换原生归档所有权。该控制流已定位但未故障复现，不能把聊天消失等同于全部副作用已撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先观察。先用一次性工作区副本核对故障矩阵和归档服务恢复，再决定能否小范围试用；涉及远端写入、数据库或共享写者时不要把它作为安全撤销保障。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定版本的组合配置及同仓关键依赖源码，机制和控制流判断限于静态范围。采用建议为观察。回退收据是未实现、未验证的设计假设；本轮来源未核实当前仓库身份/默认分支，不声称覆盖最新版本。

- 已检查：作者 README、包清单、源码路径 packages/bundle-rollback/package.json、packages/bundle-rollback/README.md、packages/bundle-rollback/cordis.patch.yml、packages/bundle-rollback/tsdown.config.ts、README.md、package.json、packages/rollback-undo/src/index.ts、packages/rollback-undo/src/shadow-git.ts、packages/rollback-fork/src/index.ts、packages/rollback-archive/src/index.ts 及固定范围 inventory；组件：packages/bundle-rollback。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整 inventory 只覆盖 bundle 组件的统计范围；本轮另外定向读取同一固定提交的 patch、undo、shadow-git、fork、archive 依赖正文，不代表全仓审计。未运行目标代码、安装、测试或宿主；来源扫描无法确认当前仓库身份与默认分支，检查对象是队列保留固定版本。
- 下一步：在隔离副本比较六类故障下实际文件树、会话前缀、归档集合和日志相位；保留全部失败与人工恢复耗时，若新收据没有改善错误继续或成本过高便否定假设。

**分析版本**

- **仓库**：[23swccp/dsh-undo](https://github.com/23swccp/dsh-undo)
- **版本号**：0.1.0-rc.8（[固定提交 bc8edbe](https://github.com/23swccp/dsh-undo/tree/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出待验证方向：让副作用后的失败保留不可降级恢复阶段，并展示文件、会话和归档的实际核对收据；与已有恢复检查对照，若不能减少错误继续或额外负担抵消收益即否定。

在隔离副本比较六类故障下实际文件树、会话前缀、归档集合和日志相位；保留全部失败与人工恢复耗时，若新收据没有改善错误继续或成本过高便否定假设。

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

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/23swccp/dsh-undo/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断安装组合能否帮助本地编程用户把文件与对话一起回退，以及哪些组合和恢复条件使采用不成立。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · bundle 自己交付什么，相对手工组合增加了什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

它是原生 DSH 的可安装插件组合入口，而不是在自身目录实现回滚算法的独立运行时。package.json 通过 dsh.bundle.patch 指向 YAML，并声明七个内部包依赖；构建配置明确没有编译产物。用户场景是编程 Agent 改坏本地文件后，既要恢复文件，又不希望模型继续带着已撤销回合的上下文工作。合格结果应同时满足目标文件树正确、子会话只保留目标消息前的事件、源会话归档，而且失败时不能继续声称状态一致。对只想撤销编辑的用户，已有 Git 或备份已能提供文件层退路；对只想开新聊天的用户，手工新会话也可能足够。组合的增量是把这些动作编排成同一个消息级回退入口，并一并装入归档和浏览器呈现模块。这个比较只是具体操作责任的机制分析，没有证据表明所有目标用户都需要这种组合，也没有实测节时。

bundle 自身的贡献应限定为声明七包组合和宿主冲突处理。文件快照来自 rollback-undo 的私有 Git 对象库，会话分支来自 rollback-fork，不能把它们算成 bundle 新发明的算法。手动安装七包并配置同样 patch 是直接替代，bundle 减少包名与配置对齐步骤；代价是采用者也接收它对原生归档服务的替换。目录中的同一仓库根条目不应因此重复解释为一套不同的独立算法。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle-rollback/package.json:23-37](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L23-L37)

bundle 入口和七个精确命名的依赖。

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

**依据 2 · 源码核查**：[packages/bundle-rollback/tsdown.config.ts:1-4](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/tsdown.config.ts#L1-L4)

构建配置说明这是只交付 YAML 的组合包。

```text
import type { UserConfig } from 'tsdown'

/** Bundle-only package: no compiled artifacts; the patch ships as YAML. */
export default (): UserConfig[] => [{ entry: '' }]
```

**依据 3 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:8-32](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L8-L32)

七个插件加载项的真实组合声明。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/rollback-fork/src/index.ts:93-122](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-fork/src/index.ts#L93-L122)

内部包创建子 Agent 并挂接工作区，说明会话分叉来自依赖实现。

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

#### 缺口

- 尚无目标用户任务频率、手工对齐负担或同条件效果对照。
  **影响**：只能判断任务和操作增量明确，不能证明持续需求或节时。
  **进一步探讨**：对有回退需求的本地编程任务记录文件、会话对齐错误与人工步骤，并与 Git 加新会话对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 七包怎样接线，加载与退出条件是什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

安装入口的七包依赖与 YAML 插入项同名，可追溯到三个后端模块和四个浏览器模块。rollback-undo 默认导出 ConversationUndoService，注入 agents、sessions、sessionArchive、sessionFork、sessionPersistence、workspaceRegistry 和 commands；初始化先读恢复日志，再监听 agent/pre-step 捕获提示前快照，并注册 undo 和 update 用户命令。这支持组件间接线存在，但没有执行宿主加载，不能把 YAML 或默认导出当作兼容性验收。fork 提供会话种子创建与工作区关联，archive 提供归档集合和持久化删除入口。

bundle 不是纯粹增加一组无冲突入口。patch 还禁用原生 ui-settings-archive 和 session-archive，让本插件拥有 sessionArchive 名称空间；注释给出的理由是原生贡献会先占用名称空间。该理由属于作者在配置中的解释，本轮确认的是禁用配置本身及内部服务依赖，未审计当前宿主对 patch 顺序的全部处理。若只见回滚按钮而归档接口未实际挂载，不能判安装成功。

源码安装要单独链接八个包，作者解释仅链接 bundle 不会补齐 profile 解析所需的七包；npm 路径则声明依赖安装。依赖范围使用 ^0.1.0-rc.8，固定仓库源码不等于未来解析到的包字节。退出时应先停止回退、备份工作区与会话和插件目录，再移除组合配置并核对两个原生归档项恢复；仅隐藏浏览器入口不能证明后端已停止或私有快照已清除。该退出步骤是依据配置副作用推导的操作建议，不是已执行的卸载结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle-rollback/package.json:25-37](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/package.json#L25-L37)

入口和版本范围。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:34-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L34-L44)

明确禁用两个原生归档组件的配置。

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

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:187-224](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L187-L224)

后端服务注入、恢复与事件/命令注册链。

<details>
<summary>查看原文（38行）</summary>

```text
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
```

</details>

**依据 4 · 作者声明**：[README.md:67-87](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/README.md#L67-L87)

作者的环境条件与源码八包链接说明。

<details>
<summary>查看原文（21行）</summary>

````text
### 前置条件
- Node.js(`^22.19 || >=24`)与 dsh `0.1.0-rc.6` / `0.1.0-rc.7` / `0.1.0-rc.8`
- 浏览器界面需要 `dsh-web-app` 表面(web profile 默认满足;headless profile 可删去 patch 里四行 `client-rollback-*`)

### 安装
```sh
dsh plugin --profile web add dsh-undo-plugin
```

一行即可:入口包 `dsh-undo-plugin` 发布在 npm,七个内部包(`@dsh-undo/*`)作为其依赖自动安装。

#### 从源码安装(开发者)
```sh
git clone https://github.com/23swccp/dsh-undo.git
cd dsh-undo
pnpm install
pnpm run build
dsh plugin --profile web add ./packages/rollback-fork ./packages/rollback-archive ./packages/rollback-undo ./packages/client-rollback-button ./packages/client-rollback-settings ./packages/client-rollback-toolcards ./packages/client-rollback-trailfold ./packages/bundle-rollback
```

源码安装时八个包都要 link:pnpm 的 `link:` 协议不会安装被链接 bundle 的依赖,而 dsh 加载器从 profile 的 `node_modules` 解析插件包名,因此七个插件包需要与 bundle 一起各自 link。
````

</details>

#### 缺口

- 没有当前宿主中 YAML 顺序、生成的远程接口与 npm 包字节匹配证据。
  **影响**：不能确认该固定源码对应的发布组合可在当前宿主完整加载。
  **进一步探讨**：在独立 profile 核对实际解析版本、七模块加载、sessionArchive 所有权及原生服务恢复；先保存版本与配置清单。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退、撤回及中断恢复能保证哪些状态？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

正常最新消息回退先校验消息 ID 和日志相位，用进程内集合排除同工作区的另一回退，静止源 Agent 后捕获 redo 文件树，再写 restoring 日志。接着并行创建目标消息前缀的子会话和恢复 beforeTree，成功后归档源会话、向子会话发布前驱回退点并写 complete。Shadow Git 通过独立 GIT_DIR、GIT_WORK_TREE 和 index 隔离用户 Git 索引；它仍然会实际覆盖工作区文件，并删除被 from 树捕获但目标树没有的路径。“不碰 .git”不能解释为不产生文件副作用。

已有重要防护。撤回回滚会先对当前树与回滚目标做比对，发现变化便拒绝 workspace-diverged；启动遇到 restoring/revoking 时会联合检查会话存在、归档状态和实际 Git 树，无法归入安全状态时写 recovery-required，而不是仅按成功日志恢复。这比只存一个成功标志更可借鉴。

但多资源操作不是原子事务。最新回退的 fork 失败后会尝试把文件恢复到 redoTree；若该补偿也失败，抛出的 AggregateError 仍会进入外层 catch，外层又尝试写 recoverable（ready）日志。源码路径表明中间恢复状态可能被普通 ready 覆盖，启动分派只处理 restoring/revoking 等相位，不能据此保证这类补偿失败会重新核对实际树。此处是已定位的异常控制流限制，未注入故障复现，不能声称已观察到文件损坏。

同工作区集合和会话队列只协调当前服务实例的操作，不是编辑器、后台命令、另一个进程的全局写锁；外部写入可能与 restore 竞态。Git 受支持文件范围也不包含数据库、远端调用等外部副作用，README 明确工作区外写入不回退。归档恢复只 fork 对话，永久删除接口只删除定位到的会话日志目录并隐藏条目，不能当成清除所有私有 Git 对象或撤销外部动作。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:665-739](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L665-L739)

消息/相位校验、进程内工作区互斥与正常回退编排。

<details>
<summary>查看原文（75行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/rollback-undo/src/index.ts:740-773](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L740-L773)

补偿、归档和完成步骤。

<details>
<summary>查看原文（34行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:803-819](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L819)

外层 catch 无条件尝试写 recoverable 的关键反例。

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

**依据 4 · 源码核查**：[packages/rollback-undo/src/index.ts:973-997](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L973-L997)

启动恢复会核查实际树和会话归档，而不是无防护。

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

**依据 5 · 源码核查**：[packages/rollback-undo/src/index.ts:539-552](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L539-L552)

撤回拒绝当前文件树发生变化。

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

**依据 6 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:29-39](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L29-L39)

私有 Git 环境隔离用户 index。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:110-146](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L110-L146)

恢复涉及删除和覆盖，不等于多资源原子性。

<details>
<summary>查看原文（37行）</summary>

```text
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
```

</details>

**依据 8 · 源码核查**：[packages/rollback-archive/src/index.ts:146-196](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-archive/src/index.ts#L146-L196)

恢复只 fork 会话；永久删除只作用于可定位的日志目录。

<details>
<summary>查看原文（51行）</summary>

```text
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
   * @param request - Archived Session to erase.
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
```

</details>

**依据 9 · 作者声明**：[README.md:131-135](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/README.md#L131-L135)

作者限制工作区外写入和消息辨识。

```text
## 限制

- 回滚只恢复会话工作区(git worktree 边界)内的文件;工作区外的 agent 写入不在覆盖范围。
- steer 消息排除是尽力而为:rc.6 的 durable 侧没有 `delivery` 字段,以 source-kind + 纯文本检查为边界。
- 接纳失败在回合停止时轮询一次得知(rc.6 的 api-remotes allowlist 无法转发推送事件)。
```

#### 缺口

- 补偿失败写回 ready 的路径没有故障注入结果，多写者竞态未实测。
  **影响**：不能量化状态不一致的发生条件和损失，也不能把恢复机制称为完整保证。
  **进一步探讨**：在副本中分别使 fork、restore、归档、补偿和日志写入失败，并检查重启后每一资源实际状态与相位；同时引入第二写者。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次合格回退需要承担什么成本，什么效果有证据？

**研究主题**：效果与总成本、场景与需求

#### 完整回答

一次合格回退的计量单位应是“文件与会话同时达到所选目标且保留明确失败状态的一次任务”，而不是按钮响应次数。捕获调用 git add --all 与 write-tree，持续使用会积累私有对象、会话分支和 journal；其容量、延迟和保留周期须按真实工作区测量。恢复使用 diff-tree 只改变化路径，超过 400 个更新路径时回退为完整 checkout-index，因而耗时会受到文件数、变化量和平台影响。作者注释给出 7,400 文件扫描由约 6 秒到 0.3 秒的优化描述，但本轮未取得测量方法和独立重放，不作为已复现结果。

首次投入还包括备份、宿主版本确认、七包解析和归档服务替换核对。源码安装额外要求 pnpm 构建与八包链接；日常回退后仍需人工检查目标文件、子会话前缀和外部系统状态。失败时应停止继续发送提示和其他写入，保留原会话与插件目录后判定实际树，不能无限点撤回来“试到成功”。MIT 许可证不等于现金或人工成本为零；磁盘、恢复耗时、模型重做成本和排障时间均没有可计算数据。

当前证据足以说明存在降低“文件已退但模型上下文未退”错配的机制，不足以说明真实合格率、端到端节时或单位任务成本胜出。如果用户只偶尔需要回退少量文件，Git 加人工新会话可能更容易理解与恢复；是否值得承受组合替换成本应由上述合格任务的对照决定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:102-107](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L102-L107)

捕获实际依赖 Git 扫描及对象写入。

```text
  async capture(): Promise<ConversationUndoTree> {
    await this.ensure()
    await git(this.workspace, this.shadowGit, ['add', '--all', '--', '.'])
    const tree = (await git(this.workspace, this.shadowGit, ['write-tree'])).trim()
    if (!/^[0-9a-f]{40,64}$/.test(tree)) throw new Error('conversation-undo: Git returned an invalid tree id')
    return tree as ConversationUndoTree
```

**依据 2 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:122-146](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L122-L146)

按变更路径恢复及大量路径的完整 checkout 回退。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/rollback-undo/src/shadow-git.ts:216-230](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/shadow-git.ts#L216-L230)

缓存与 split index 的作者性能注释，非本轮测量。

<details>
<summary>查看原文（15行）</summary>

```text
  private async ensure(): Promise<void> {
    await mkdir(dirname(this.shadowGit), { recursive: true })
    try {
      await stat(`${this.shadowGit}/config`)
    } catch {
      await mkdir(this.shadowGit, { recursive: true })
      await git(this.workspace, this.shadowGit, ['init', '--bare', this.shadowGit], { shadow: false })
      await git(this.workspace, this.shadowGit, ['config', 'core.bare', 'false'])
      await git(this.workspace, this.shadowGit, ['config', 'core.autocrlf', 'false'])
      // Cache untracked-directory scans and split the index so repeated
      // captures skip most of the full-worktree stat pass (measured ~6s to
      // ~0.3s on a 7400-file workspace). Both are private to this shadow
      // repository; the user's repo and index are untouched.
      await git(this.workspace, this.shadowGit, ['config', 'core.untrackedCache', 'true'])
      await git(this.workspace, this.shadowGit, ['config', 'core.splitIndex', 'true'])
```

</details>

**依据 4 · 作者声明**：[README.md:78-87](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/README.md#L78-L87)

源码首次接入额外步骤。

<details>
<summary>查看原文（10行）</summary>

````text
#### 从源码安装(开发者)
```sh
git clone https://github.com/23swccp/dsh-undo.git
cd dsh-undo
pnpm install
pnpm run build
dsh plugin --profile web add ./packages/rollback-fork ./packages/rollback-archive ./packages/rollback-undo ./packages/client-rollback-button ./packages/client-rollback-settings ./packages/client-rollback-toolcards ./packages/client-rollback-trailfold ./packages/bundle-rollback
```

源码安装时八个包都要 link:pnpm 的 `link:` 协议不会安装被链接 bundle 的依赖,而 dsh 加载器从 profile 的 `node_modules` 解析插件包名,因此七个插件包需要与 bundle 一起各自 link。
````

</details>

#### 缺口

- 没有同工作区、同消息任务下完整成功/失败样本、人工时间和对象增长记录。
  **影响**：不能计算合格率、ROI、有限单位成本或节时比例。
  **进一步探讨**：比较手工 Git 加新会话和插件两条路径，计入失败重试、复核时间、磁盘增长和退出负担，按合格任务统计。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否值得当前试用，如何改进可判定性并证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察。对需要反复同步回退文件和对话的本地编程用户，组合有清楚的机制价值；但它还替换归档所有权，而且异常补偿后的日志路径与实际树可能不能由现有启动恢复重新对应。对共享工作区、含外部副作用或无法保留备份的任务，不应把它当安全撤销按钮。当前应先在一次性副本完成故障边界核对，再决定是否转为小范围试用；这不是直接安装建议。用户一旦看到 recovery-required、文件与会话不一致、归档端点缺失或工作区被其他进程写入，应停止回退并保全目录，改从独立备份和原会话人工恢复。

可验证的新假设是“所有副作用开始后的异常都保留不可降级的恢复阶段，并把每个资源的实际状态形成回退收据”，能否减少用户误判已经安全恢复的次数。它来自 Q03 的 catch 写回 ready 路径，而不是假设当前完全没有恢复检查。现有 recoverRestoring 已经会比对树和归档；新增点是补偿失败不能退回普通 ready，并在 UI 明示文件树、会话分支、归档三项是否已核对，外部副作用是否超出覆盖。收据需要维护额外阶段和界面解释，不能只增加一个“安全”徽章。

最小对照使用同一工作区副本和固定消息历史，保留现有版本为基线，在 fork 失败、文件部分恢复、归档失败、补偿失败、重启和第二写者六组情形中，比较现有路径与保留恢复阶段/收据的方案。观察不一致却继续执行的次数、正确阻止继续的次数、人工定位时间、额外磁盘与正常回退延迟。若现有阶段在这些情形已能同样正确阻止，或新收据降低理解准确性、延迟和维护代价超过收益，则否定这个改动的价值；不借该假设给当前插件加创新分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/rollback-undo/src/index.ts:803-819](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L803-L819)

假设针对补偿后日志阶段可能退化的具体路径。

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

已有实际树/归档检查是必须纳入的反证基线。

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

**依据 3 · 源码核查**：[packages/rollback-undo/src/index.ts:1051-1054](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/rollback-undo/src/index.ts#L1051-L1054)

已有明确 recovery-required，而非完全缺少未知状态。

```text
  /** Preserve a recovery-required manifest instead of claiming an ambiguous transaction succeeded. */
  private async requireRecovery(journal: ConversationUndoJournal, detail: string): Promise<void> {
    await this.writeJournal({ ...journal, phase: 'recovery-required' })
    this.ctx.logger.error(`rollback undo: rollback for "${journal.sourceSessionId}" requires recovery: ${detail}`)
```

**依据 4 · 源码核查**：[packages/bundle-rollback/cordis.patch.yml:34-44](https://github.com/23swccp/dsh-undo/blob/bc8edbe47de17d91f9b8a06e0f82e0be7d9d9b67/packages/bundle-rollback/cordis.patch.yml#L34-L44)

采用负担还包含原生归档所有权变化。

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

#### 缺口

- 新收据方案尚未实现，也没有使用者错误决策与恢复耗时数据。
  **影响**：只能作为待验证设计，不能宣称能降低损失或已有业务创新。
  **进一步探讨**：先复现精确故障矩阵，再用相同状态任务比较操作者判断与全周期代价。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
