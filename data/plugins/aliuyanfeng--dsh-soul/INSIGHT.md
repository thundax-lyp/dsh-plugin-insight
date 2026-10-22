# dsh-soul

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[17e6624](https://github.com/Aliuyanfeng/dsh-soul/tree/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,337](https://img.shields.io/static/v1?label=npm+30d&message=2%2C337&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)
<!-- END META -->

> **实现功能**：管理DSH个性化资料、人格预设及全局/工作区/会话覆盖，提供Web、命令、工具确认与变更回滚。

> **核心亮点**：把资料与人格分离、作用域、确认和送达/回滚反馈接为个性化维护流程。详见[Q01](#research-q01)。

> **风险与缺陷**：活动注入缺workspace/session层而section包含；pending未绑定会话/版本，HTTP读写依赖宿主门禁，敏感旧值进入历史。详见[Q03](#research-q03)。

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
  - [Q01 · 个性化配置解决什么反复劳动？](#detail-section-11)
  - [Q02 · 配置保存与提示词送达怎么实现？](#detail-section-12)
  - [Q03 · 确认、作用域与HTTP边界有哪些具体缺口？](#detail-section-13)
  - [Q04 · 损坏保护、审计与回收能支持哪些判断？](#detail-section-14)
  - [Q05 · 首次、持续和恢复成本是什么？](#detail-section-15)
  - [Q06 · 当前采用结论和进一步探讨方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户反复切换项目回复风格和自定义指令，希望持久化且能回看变更。详见[Q01](#research-q01)。

宿主Agent preset、项目指引和系统提示词是替代，集中预设不自动提供人格一致性或权限隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 人格配置/预设 | 重复风格管理 | 非模型训练 |
| scope与送达 | 项目/会话覆盖 | section/注入不同 |
| 确认/历史 | 控制和恢复改动 | pending与多文件边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| systemPrompt/agents | 两路人格送达 | scope/ABI需匹配 |
| tools/command/GUI | 修改和确认 | fallback全局提议 |
| 宿主HTTP准入 | 配置资料保护 | 本地handler未闭合 |
| 本地多文件存储 | 历史/sidecar | 敏感副本/恢复需管理 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 配无敏感资料与scope | 用户 | 全局/项目/会话明确 |
| 预览/保存与送达查看 | 用户 | revision及人格一致 |
| 单提议确认 | 用户 | 内容与本会话对应 |
| 备份后回退 | 用户 | 不丢原始配置/历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配DSH、配置文件 | 整理资料/scope/确认设置 | 资料/scope/preset/确认开关先审；准备工时未知 |
| 持续使用 | 额外人格上下文与注入 | 维护预设/送达，收益未知 | 无独立API/key但人格注入增加宿主上下文；费用/任务收益未知 |
| 失败恢复 | 配置/history/sidecar备份 | 解损坏/错scope/错提议 | 保护配置/history/sidecar；卸载不抹会话历史，恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 少重复配置 | 预设及分层覆盖 | 两送达链不完全一致 |
| 可回退 | diff历史和损坏拒写 | 非跨文件事务/敏感旧值保留 |
| 人格改动确认 | 原生审批/fallback | pending无会话基线 |

> **思考**：活动注入缺workspace/session层而section包含；pending未绑定会话/版本，HTTP读写依赖宿主门禁，敏感旧值进入历史。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把资料与人格分离、作用域、确认和送达/回滚反馈接为个性化维护流程。详见[Q01](#research-q01)。

把资料与人格分离、作用域、确认和送达/回滚反馈接为个性化维护流程。详见[Q01](#research-q01)。

配置队列、损坏保护、保守sidecar GC可借鉴；需统一作用域解析、确认身份和HTTP准入契约。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

活动注入缺workspace/session层而section包含；pending未绑定会话/版本，HTTP读写依赖宿主门禁，敏感旧值进入历史。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；单用户无敏感内容对照，明确scope和一次待确认提议，保存/送达分开核对，重要资料保留备份。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置/预设/审计流程可查；全scope与旧注入分歧、全局pending及HTTP门禁依赖限制采用，统一解析/版本提议为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.mjs、lib/store.mjs、lib/history.mjs、lib/session-scope.mjs、lib/config.mjs、scripts/verify-session-scope.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口的写队列、section/活动注入、HTTP与工具确认、store/history/session-scope和相关验证文本；未穷尽3844行入口及GUI，不执行目标。
- 下一步：进一步从双workspace/session、并发提议、基线改变、冷读sidecar与审计断链探讨统一解析收据。

**分析版本**

- **仓库**：[Aliuyanfeng/dsh-soul](https://github.com/Aliuyanfeng/dsh-soul)
- **版本号**：0.9.0（[固定提交 17e6624](https://github.com/Aliuyanfeng/dsh-soul/tree/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究统一scope解析收据及绑定会话/版本的提议确认，以并发/冷读反例比较错送达与恢复成本。当前未验证。详见[Q06](#research-q06)。

进一步从双workspace/session、并发提议、基线改变、冷读sidecar与审计断链探讨统一解析收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 23 | 26357 | 18436 | 6137 | — |
| .md | source | 9 | 3439 | — | — | 80903 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+created%3A2026-09-22T05%3A41%3A07.481Z..2026-10-22T05%3A41%3A07.481Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A41%3A07.481Z..2026-10-22T05%3A41%3A07.481Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定版本三级人格配置如何持久化和送达，确认/作用域/HTTP与恢复边界怎样影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 个性化配置解决什么反复劳动？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向在DSH反复使用不同回复风格/语言与项目人设的用户。合格结果是配置可保存、每次装配得到预期作用域的提示词、Agent提议修改有明确确认与可回退记录；风格偏好不等模型稳定服从，也不应把人设当权限或质量保证。README的光轨和卡片是界面辅助，与人格送达是不同结果。

简单替代是系统提示词、项目指引和宿主Agent preset。插件贡献是用户资料/人格字段分离、预设、全局→工作区→会话覆盖、Web/命令/工具入口以及送达/历史反馈联结，不是新的模型人格训练或长期记忆算法。路线图的自演化和记忆未在当前已发布作用域中当现有能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-36](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/README.md#L16-L36)

作者个性化/预设与确认范围。

<details>
<summary>查看原文（21行）</summary>

```text
DeepSeek Harness 个性化设置插件，用于配置 Agent 的昵称、回复风格、语调和自定义指令。

## 功能

- Web UI 个性化设置页面
- 设置页体验：中英双语文案（随界面语言切换）、dirty 检测（无改动禁用保存）、保存结果提示、提示词预览只读面板
- 启用或禁用个性化设置
- 「关于你」：设置用户昵称、职业和介绍，回复时结合你的背景
- 选择回复风格和语调（合并为单一选项）：`professional`（专业严谨）、`casual`（轻松自然）、`humorous`（幽默风趣）、`roast`（吐槽达人）、`efficient`（高效干练）
- 特质微调（在风格和语调的基础上叠加）：
  - 标题和列表：`default`（默认）、`more`（增强，采用清晰格式和列表结构）、`less`（减弱，使用更多段落文本）
  - 表情符号：`default`（默认）、`more`（增强，使用较多表情符号）、`less`（减弱，尽量减少使用表情符号）
  - 表格：`default`（默认）、`more`（增强，呈现对比或多字段信息时优先使用表格）、`less`（减弱，避免表格、改用列表或段落）
- 回复长度偏好：`concise`（简洁，只讲要点、不展开）、`normal`（适中，不额外约束，默认）、`detailed`（详尽，充分展开背景、步骤与推理）
- 选择输出语言（Agent 回复语言 + `/soul` 命令输出语言）：中文 / English
- 提示词随输出语言本地化：`language=en` 时 system prompt 使用英文描述
- 输入自定义指令
- Agent 可调用工具 `set_persona`，让模型在对话中直接调整人设
- 人设预设：7 个内置人设（苏格拉底式提问者 / 极简主义者 / 资深架构师 / 教学型讲解者 / 严格代码审阅者 / 头脑风暴伙伴 / 自驱型协作者，随插件提供、不可删除）+ 多套自建人设一键切换（保存 / 使用 / 列表 / 删除，Web UI 与命令双入口）；每行摘要显示风格与偏离默认的维度
- 预设只管 Agent 的人格：**切换预设不会动「关于你」**（昵称 / 职业 / 介绍是你本人的资料，与「Agent 怎么说话」是两码事）。内置与自建一视同仁——保存预设时只快照风格 / 特质 / 回复长度 / 输出语言 / 自定义指令，不包含身份字段；早期版本存下的完整快照会在读取时自动剥离
- `set_persona` 确认模式（`requireToolConfirmation`）：Agent 的人设修改先在输入框处弹出**宿主原生审批面板**，由你点「允许一次」或「拒绝」（`Enter` 允许 / `Esc` 拒绝）后才会生效；审批通道不可用时（如会话审批策略为 `never`）退化为待确认提议，需 `/soul confirm` 处理
```

</details>

**依据 2 · 作者声明**：[README.md:58-64](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/README.md#L58-L64)

已发作用域和未来路线区分。

```text
| 版本 | 方向 | 状态 |
| --- | --- | --- |
| `0.7.2` | 设置页样式对齐宿主、卡片堆叠轮播、人设变更走宿主原生审批面板 | 已发布 |
| `0.8.0` | **变更审计与回滚** —— 记录每次配置改动（时间戳、来源、字段级 from→to），插件详情页给时间线与撤销 | 已发布 |
| `0.9.0` | **三级配置作用域** —— Global → Workspace → Session：工作区决定人设、会话可临时覆盖，附保守回收 | 已发布 |
| `0.10.0` | 自演化提议 + diff 审批 —— Agent 提议精炼人设，改动以 diff 走审批面板 | 规划中 |
| `0.11.0` | 记忆层 —— 跨会话长期记忆，按人设隔离、按需召回 | 规划中 |
```

**依据 3 · 源码核查**：[index.mjs:1072-1104](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L1072-L1104)

字段覆盖层次。

<details>
<summary>查看原文（33行）</summary>

```text
function configForScope(base, cwd, workspaceId, sessionOverride) {
  // ① 工作区层：workspaceId 优先，cwd 回退。
  const scopes = workspaceScopesOf(base)
  const workspaceOverride = workspaceId ? resolveWorkspaceOverride(workspaceId, scopes) : null
  let merged = base
  let source = 'global'
  let binding = null

  if (workspaceOverride) {
    merged = mergeWorkspaceOverride(base, workspaceOverride)
    source = 'workspace'
  } else {
    // ② 目录回退（0.8.1 语义）：索引没命中时，目录仍是可信信息。
    const resolved = resolveBindingForCwd(cwd, base.personas)
    if (resolved) {
      const persona = resolvePersona(resolved.persona, base.personas)
      if (persona) {
        const { patch } = sanitizeConfig(pickPersonaValues(persona))
        merged = { ...base, ...patch }
        source = 'directory'
        binding = resolved
      }
    }
  }

  // ③ 会话层：最贴近用户当下意图，优先级最高。
  //    它盖的是**字段**，不是整份配置 —— 只改 style 的会话覆盖，其余字段仍来自上层。
  if (sessionOverride) {
    merged = mergeSessionOverride(merged, sessionOverride)
    source = 'session'
  }

  return { config: merged, source, workspaceId: workspaceId || null, binding }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置保存与提示词送达怎么实现？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

配置输入经过字段校验，所有主配置写路径进入模块Promise队列读改写，saveConfig以tmp+rename替换、刷新内存revision，随后auditCommit写变更；提示相关字段与纯外观字段分开，外观改动不注入会话。systemPrompt section用同步text函数取一次配置快照，按会话索引找到workspace，再叠session sidecar内存覆盖，关闭{{}}插值。sidecar未加载会后台排读，本轮上层配置、下一轮才覆盖。

为了让活动Agent也看到变化，另枚举agents逐个注入model-facing消息。当前这条注入仍用configForCwd，只有global/目录，没传workspaceId/sessionOverride；而section用configForScope全层，二者可能同时向模型传不同人格快照。需要tools/systemPrompt/agents、命令、webServer及特定session/settings客户端契约，多功能可选服务缺失时会降级或跳注册，package范围只声明匹配不等全部宿主组合可用。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:444-474](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L444-L474)

保存与进程内串行队列。

<details>
<summary>查看原文（31行）</summary>

```text
// 保存配置（原子写，见 lib/store.mjs 的 writeConfigFile）。
// 磁盘配置损坏时拒绝写入：拒绝的原因与恢复方式由 lib/store.mjs 统一生成。
async function saveConfig(config) {
  const refusal = configWriteRefusal(configLoadFailure, configPath())
  if (refusal) {
    throw new Error(refusal)
  }

  // 过滤已废弃字段（旧客户端可能仍携带 tone / presets / examples）
  const clean = { ...config }
  delete clean.tone
  delete clean.presets
  delete clean.examples
  await writeConfigFile(configPath(), clean)
  configCache = clean
  bumpConfigRevision()
  return clean
}

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
```

</details>

**依据 2 · 源码核查**：[index.mjs:508-524](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L508-L524)

写配置后审计。

<details>
<summary>查看原文（17行）</summary>

```text
async function commitConfig(mutate, source) {
  return enqueueConfigWrite(async () => {
    const current = await loadConfig()
    // mutate 允许返回 Promise：撤销要在「读记录 → 规划 → 写配置」之间保持原子，
    // 而记录必须在**队列内**读。放在队列外读会有一个窗口——两次撤销并发时，
    // 后者的规划建立在已被前者改过的配置上，指纹校验会给出看起来像「数据损坏」的
    // diverged，排查方向完全跑偏。
    const next = await mutate({ ...current })
    const changed = diffKeys(current, next)
    const promptChanged = changed.filter((key) => !NON_PROMPT_FIELDS.has(key))
    const config = await saveConfig(next)

    // 差分必须在 saveConfig **之后**、且以它返回的配置为基准：saveConfig 会剔除
    // tone / presets / examples 三个废弃字段，拿 mutate 的产物去比会把它们误报成变更。
    const entry = await auditCommit(current, config, source, config.historyMaxEntries)

    return { config, changed, promptChanged, entry }
```

</details>

**依据 3 · 源码核查**：[index.mjs:792-812](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L792-L812)

活动注入只按cwd。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const agent of listed) {
    // **每个会话各自编译**，不能共用一份文本。
    //
    // 工作区绑定让「配置」不再是全局唯一的：A 项目会话该拿到「资深架构师」，B 项目会话
    // 该拿到「极简主义者」。若在这里算一份全局文本发给所有人，B 项目会收到 A 的人设 ——
    // 这比不注入更糟（不注入时它至少还是全局配置，与用户以为的一致）。
    //
    // 拿不到 cwd（会话头无该字段）时 configForCwd 返回原配置，行为与绑定功能上线前一致。
    const perAgent = configForCwd(config, cwdOfAgent(agent)).config
    const prompt = compilePrompt(perAgent)
    const snapshotText = prompt || T.injectDisabled

    try {
      agent.inject(createUserMessage({
        content: [{
          type: 'text',
          text: prompt ? `${T.injectUpdatedHeader}\n${T.injectUpdatedBody}\n\n${prompt}` : snapshotText
        }],
        // 会话格式 v4 要求生产者自持 kind；旧的 `kind: 'plugin'` + `plugin` 组合
        // 会让每一轮在 step 开始前失败（issue #1，构造与校验见 lib/injection.mjs）
        source: createInjectionSource(snapshotText)
```

</details>

**依据 4 · 源码核查**：[index.mjs:1107-1111](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L1107-L1111)

兼容cwd不含workspace/session。

```text
// 兼容既有调用点：只按 cwd 解析（不含工作区层）。
// 保留这个名字是因为 verify-*.mjs 与若干注释按它描述契约；新代码应直接用 configForScope。
function configForCwd(base, cwd) {
  const { config, binding } = configForScope(base, cwd, null, null)
  return { config, binding }
```

**依据 5 · 源码核查**：[index.mjs:3415-3454](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L3415-L3454)

真正section使用完整scope。

<details>
<summary>查看原文（40行）</summary>

```text
      disposeSection = spCtx.systemPrompt.section({
        name: 'soul:persona',
        order: 0,
        // 关闭宿主的提示词插值（默认开启）。插值是严格模式：文本里每一对完整的
        // {{...}} 都必须命中一个已注册变量，否则 renderPrompt 抛错；而本 section
        // 的装配里变量集为空 ⇒ 用户在「自定义指令」里写一句模板语法（例如 {{name}}）
        // 就会让整个 system prompt 装配失败。该抛错位于 agent.step() 开头且无
        // try/catch ⇒ 不是「忽略那段文字」，而是**该会话的每一轮都失败**。
        //
        // 代价为 0：我们不使用任何宿主提示词变量（需要上下文时，text 本身就是
        // provider）。关掉它同时让「预览所见」与「真实注入」逐字符一致。
        interpolate: false,
        text: (assembly) => {
          // ⚠️ 必须同步：宿主以 `section.text(context)` 的形式**同步**调用
          // （dsh-system-prompt 的装配：`typeof entry.text === 'function' ? entry.text(context) : entry.text`），
          // 返回 Promise 会被当成 section 文本对象塞进提示词。所以这里只做纯字符串
          // 比较——路径的身份解析（realpath）已在 loadBindings() 里对**键**做过一次。
          //
          // ⚠️ 也必须**只取一次快照**：configCache 由写队列整体替换。若这里分两次读
          // （例如先 configCache、再在 configForCwd 里又读一遍），装配期间发生写入就会
          // 让同一轮用上两个版本的配置。快照先取，之后全用它。
          //
          // `assembly.agent` 在诊断装配时缺席（宿主注释写明 `absent on diagnostics`），
          // cwdOfAgent 对 undefined 返回 null ⇒ configForCwd 原样返回全局配置。
          const snap = snapshotConfig()
          const agent = assembly && assembly.agent
          // 快照必须**整体**使用：连同索引一起，本轮只取一次。
          // sessionId 走索引拿 workspaceId；拿不到就让 configForScope 回退到 cwd。
          const sessionId = sessionIdOfAgent(agent)
          const workspaceId = sessionId === null ? null : (sessionWorkspaceIndex.get(sessionId) || null)
          // 会话层覆盖走**内存缓存**（同步），未命中时它会在后台排一次读盘，
          // 本轮按上层配置走 —— 下一轮生效。装配里绝不能 await。
          const sessionOverride = sessionOverridesOrNull(sessionId)
          const resolved = configForScope(snap.value, cwdOfAgent(agent), workspaceId, sessionOverride)
          const prompt = compilePrompt(resolved.config)
          // 记下「这一轮实际用的是哪一版」：排查「改了却没生效」时，第一个要回答的就是它。
          // 只写不读，不影响任何行为（deliveryState 由状态端点序列化给设置页）。
          deliveryState.lastAssembledRevision = snap.revision
          deliveryState.lastAssembledScope = resolved.source
          return prompt
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认、作用域与HTTP边界有哪些具体缺口？

**研究主题：**缺陷与关键质疑

#### 完整回答

set_persona默认更新的是主配置，不是当前session override；其自然语言“当前个性化”不应理解只改当前会话。启用确认后，原生审批被拒不改，审批通道不可用/disabled则保存待确认而不绕过用户意图，这个失败方向合理；但pendingPersonaProposal是模块唯一变量，仅patch/时间，无session、用户或base revision。两个会话提议会后写替换，任何/soul confirm取当前全局pending并合并到最新主配置，不能保证确认的是本会话看见的提议或相同基线。

HTTP /api/soul/config GET直接返回含用户资料/自定义指令配置，POST校验字段后直接commit，所读handler未调用本地connection admission/Origin身份校验。这不直接证明远程可绕过宿主，因为实际webServer dispatch/前置反代可能保护，但部署不能以本插件提供端点就当它已完成身份隔离。主配置/JSONL历史/sidecar本地明文保存个性化与指令，历史from→to会复制旧敏感内容，删除当前字段不等删除所有副本。目录匹配是人格选择，不能当文件读写安全边界。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1465-1466](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L1465-L1466)

唯一pending变量。

```text
// 待确认的人设变更提议（set_persona 确认模式；进程内短生命周期，不做持久化）
let pendingPersonaProposal = null
```

**依据 2 · 源码核查**：[index.mjs:3730-3764](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L3730-L3764)

确认fallback字段与主配置修改。

<details>
<summary>查看原文（35行）</summary>

```text
            const snapshot = await loadConfig()
            if (snapshot.requireToolConfirmation) {
              const T0 = promptTextOf(snapshot)
              const pendingKeys = Object.keys(patch).filter((key) => snapshot[key] !== patch[key])
              if (pendingKeys.length === 0) {
                return { ok: true, message: T0.toolNoChanges }
              }
              const proposalChanges = Object.fromEntries(pendingKeys.map((key) => [key, patch[key]]))
              const verdict = await requestToolApproval(toolsCtx, exec, proposalChanges)
              if (verdict === 'rejected') {
                return { ok: false, message: T0.toolRejected }
              }
              if (verdict === 'unavailable' || verdict === 'policy-disabled') {
                pendingPersonaProposal = { patch: proposalChanges, proposedAt: new Date().toISOString() }
                const detail = pendingKeys.map((key) => `${key}=${JSON.stringify(patch[key])}`).join(', ')
                // 通道被禁用时补一句准确说明：否则用户会以为是面板出了问题，
                // 或误以为是自己拒绝了（此前的错误措辞正是这么来的）。
                const why = verdict === 'policy-disabled' ? `${T0.toolApprovalDisabled}\n` : ''
                return {
                  ok: true,
                  pending: true,
                  changes: proposalChanges,
                  message: `${T0.toolProposal}\n${detail}\n${why}${T0.toolProposalHint}`
                }
              }
              // verdict === 'allowed' ⇒ 落到下面的写盘路径
            }

            // 写队列内合并，避免与其他写入方（Web UI、/soul 命令）竞态；
            // changed 由队列任务统一 diff 得出
            const { config: updated, changed, promptChanged } = await commitConfig((current) => {
              const next = { ...current }
              for (const key of Object.keys(patch)) {
                next[key] = patch[key]
              }
```

</details>

**依据 3 · 源码核查**：[index.mjs:3354-3367](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L3354-L3367)

confirm/reject无会话选择。

<details>
<summary>查看原文（14行）</summary>

```text
          if (first === 'confirm') {
            if (!pendingPersonaProposal) return { kind: 'error', text: t.noPending }
            const proposal = pendingPersonaProposal
            pendingPersonaProposal = null
            const { config: updated, changed, promptChanged } = await commitConfig(c => ({ ...c, ...proposal.patch }), { source: 'command', action: 'confirm' })
            if (promptChanged.length > 0) refreshPromptAndInject(ctx, updated)
            const detail = Object.keys(proposal.patch).map((key) => `${key}=${JSON.stringify(proposal.patch[key])}`).join(', ')
            return { kind: 'success', text: t.confirmDone(detail) }
          }

          if (first === 'reject') {
            if (!pendingPersonaProposal) return { kind: 'error', text: t.noPending }
            pendingPersonaProposal = null
            return { kind: 'success', text: t.rejectDone }
```

</details>

**依据 4 · 源码核查**：[index.mjs:1232-1279](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L1232-L1279)

HTTP读取和保存handler。

<details>
<summary>查看原文（48行）</summary>

```text
    wsCtx.webServer.register({
      kind: 'exact',
      path: '/api/soul/config',
      handler: async (req, res) => {
        const send = (status, body) => {
          res.writeHead(status, { 'content-type': 'application/json' })
          res.end(JSON.stringify(body))
        }

        try {
          if (req.method === 'GET') {
            const config = await loadConfig()
            // configError：磁盘配置存在但不可用时上报（此时 config 是回退的默认值）。
            // 让设置页能直接说明「人设为什么像是被重置了」，而不是让用户自己发现；
            // 正常情况下该字段为 null，不影响既有客户端。
            send(200, {
              ok: true,
              config,
              configError: configLoadFailure ? describeConfigFailure(configLoadFailure) : null,
              // deliveryWarning：配置送达异常时上报（例如 agents 服务不可用）。
              // 与 configError 分开：configError 是「配置读不出来」，这里是「配置送不到会话」，
              // 两者症状都表现为「改了人设不生效」，但处理方式完全不同。
              deliveryWarning: deliveryProblemText(config)
            })
          } else if (req.method === 'POST') {
            const parsed = await readJsonBody(req)
            if (!parsed.ok) {
              send(parsed.status, { ok: false, error: parsed.error })
              return
            }

            // 输入校验：字段白名单 + 类型 + 长度上限 + 枚举；存在错误时整单拒绝
            const { patch, errors } = sanitizeConfig(parsed.body)
            if (Object.keys(errors).length > 0) {
              send(400, { ok: false, error: '配置校验失败：' + formatFieldErrors(errors), errors })
              return
            }

            // 写队列内「读—改—写」，只合并通过校验的字段（未知字段不落盘）
            const { config: updated, changed, promptChanged } = await commitConfig(current => ({ ...current, ...patch }), { source: 'web', action: 'save' })

            // 仅影响 Agent 行为的字段变化才刷新提示词并注入会话；
            // 光轨等纯外观字段只更新配置，不向会话堆积注入快照
            if (promptChanged.length > 0) {
              refreshPromptAndInject(ctx, updated)
            }

            send(200, { ok: true, config: updated, changed, deliveryWarning: deliveryProblemText(updated) })
```

</details>

**依据 5 · 源码核查**：[lib/history.mjs:1-18](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/history.mjs#L1-L18)

记录from/to及反向回滚。

<details>
<summary>查看原文（18行）</summary>

```text
// lib/history.mjs — dsh-soul 变更审计（append-only JSONL + 回滚规划，无 cordis 依赖）
//
// 职责：
//   - 把一次配置变更写成一个条目（时间戳 / 来源 / 动作 / 字段级 before→after / 预设库事件）
//   - 读取记录文件，并把「不可解析的行」「超长行」「过大的文件」「截断的尾行」如实报告出来
//   - 规划回滚：从当前配置逐条反向还原到目标条目**之后**的状态
//
// 四条设计前提，改本模块前请先读：
//
//   1. 记录文件是**不可信输入**。用户可以手改、别的工具可以写坏、进程可以在写入中途被杀。
//      所以读侧的每一行都要重新校验，非法行丢弃并计数 —— 绝不让一条坏行把整个列表打不开。
//   2. 条目只存**发生变化的字段**，不是完整快照。一次 style 改动不该在磁盘上留下 4.8 KB，
//      而且 `professional → humorous` 比两份快照更适合人读。代价是回滚必须**逐条反向还原**
//      （见 planRollback），因此每条都带一份 configHash 作为链式指纹。
//   3. 指纹只覆盖 AUDIT_FIELDS 这一冻结投影。配了很多字段却不算变更（见 AUDIT_FIELDS 注释）
//      的原因必须记在这里：哈希一旦把「无关字段」算进去，回滚会因为一次外观调整而拒绝工作。
//   4. 本模块只负责如实报告，不替调用方决定要不要回退 —— 与 lib/store.mjs 同一条约定，
//      可被 scripts/verify-history.mjs 独立加载并针对真实文件系统测试。
```

</details>

#### 缺口

- 所支持宿主webServer是否对exact api/soul入口统一执行身份校验未在插件源码闭合
  **影响：**不能承诺HTTP资料/配置权限仅限当前用户
  **进一步探讨：**核对部署宿主dispatch与connection admission，端点矩阵从匿名/不同会话读写入手

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 损坏保护、审计与回收能支持哪些判断？

**研究主题：**工程质量与复用

#### 完整回答

store区分ENOENT、不可读和invalid JSON，损坏复制.corrupt且save拒绝覆写；reset移开损坏文件后默认重建，提供恢复出口。主配置串行队列避免单进程丢更新，但固定.tmp和无跨进程锁仍不能保证多个宿主共享同DSH_HOME同时写安全。历史在主配置成功后另写，日志失败不回滚配置，因此历史链可能不完整；回滚需遵从当前指纹与后缀链，不把列表可见等同全部变更有审计。

会话sidecar以hash名且内容校验sessionId，回收三阶段需要完整磁盘清单、缺席时间与宽限，缺证据keep，避免按agents不活跃删状态，这是可复用设计。verify-session-scope文本测试包含非法id和哈希路径断言；这些支持纯状态机与文件规则的可检查性，不等所有宿主送达通道一致。本次未执行验证脚本，尤其带宿主依赖的verify不以脚本名代替效果。大入口与旧兼容层增加scope/注入语义漂移机会。

#### 证据与依据

**依据 1 · 源码核查**：[lib/store.mjs:62-92](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/store.mjs#L62-L92)

损坏/不可读分流。

<details>
<summary>查看原文（31行）</summary>

```text
export async function readConfigFile(filePath) {
  let text
  try {
    text = await readFile(filePath, 'utf8')
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return { value: null, exists: false, failure: null }
    }
    return {
      value: null,
      exists: true,
      failure: {
        code: 'unreadable',
        message: `配置文件读取失败（${(err && err.code) || 'unknown'}）：${(err && err.message) || err}`,
        backupPath: null
      }
    }
  }

  try {
    return { value: JSON.parse(text), exists: true, failure: null }
  } catch (err) {
    return {
      value: null,
      exists: true,
      failure: {
        code: 'invalid-json',
        message: `配置文件不是合法的 JSON（${(err && err.message) || err}）`,
        backupPath: await backupCorruptFile(filePath)
      }
    }
```

</details>

**依据 2 · 源码核查**：[lib/store.mjs:103-124](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/store.mjs#L103-L124)

拒写及固定tmp。

<details>
<summary>查看原文（22行）</summary>

```text
// 在这份失败之上能否写入：返回 null 表示可以写，返回字符串表示应拒绝并原样展示该原因。
//
// 判定下沉在这里（而不是散在调用方），是为了让「损坏的配置绝不会被静默覆盖」这条
// 规则只有一处实现 —— 写路径有 HTTP 保存 / 斜杠命令 / 工具 / 服务四条。
export function configWriteRefusal(failure, filePath) {
  if (!failure) return null
  return `${describeConfigFailure(failure)}。为避免覆盖，本次保存已拒绝；请修复或删除 ${filePath} 后重试。`
}

// 原子写入配置：先写同目录的临时文件，再 rename 覆盖。
//
// 同目录 rename 是原子替换（Windows 的 MoveFileEx 亦带 REPLACE_EXISTING），
// 因此文件要么是旧的完整内容、要么是新的完整内容。直接 writeFile 在写到一半
// 进程被杀时会留下**截断的 JSON**，整份配置随即不可解析。
//
// 临时文件名固定（不带随机后缀）：写入统一经由 index.mjs 的写队列串行执行，
// 不存在并发同名临时文件；固定名还能让中断残留的 .tmp 在下次写入时被覆盖。
export async function writeConfigFile(filePath, config) {
  await mkdir(dirname(filePath), { recursive: true })
  const tmpPath = `${filePath}.tmp`
  await writeFile(tmpPath, JSON.stringify(config, null, 2), 'utf8')
  await rename(tmpPath, filePath)
```

</details>

**依据 3 · 源码核查**：[index.mjs:508-524](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L508-L524)

配置先写后audit。

<details>
<summary>查看原文（17行）</summary>

```text
async function commitConfig(mutate, source) {
  return enqueueConfigWrite(async () => {
    const current = await loadConfig()
    // mutate 允许返回 Promise：撤销要在「读记录 → 规划 → 写配置」之间保持原子，
    // 而记录必须在**队列内**读。放在队列外读会有一个窗口——两次撤销并发时，
    // 后者的规划建立在已被前者改过的配置上，指纹校验会给出看起来像「数据损坏」的
    // diverged，排查方向完全跑偏。
    const next = await mutate({ ...current })
    const changed = diffKeys(current, next)
    const promptChanged = changed.filter((key) => !NON_PROMPT_FIELDS.has(key))
    const config = await saveConfig(next)

    // 差分必须在 saveConfig **之后**、且以它返回的配置为基准：saveConfig 会剔除
    // tone / presets / examples 三个废弃字段，拿 mutate 的产物去比会把它们误报成变更。
    const entry = await auditCommit(current, config, source, config.historyMaxEntries)

    return { config, changed, promptChanged, entry }
```

</details>

**依据 4 · 源码核查**：[lib/session-scope.mjs:101-126](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/session-scope.mjs#L101-L126)

hash名与独立sidecar。

<details>
<summary>查看原文（26行）</summary>

```text
export function sessionFileName(sessionId) {
  const digest = createHash('sha256').update(String(sessionId), 'utf8').digest('hex')
  return `${digest.slice(0, FILE_HASH_LENGTH)}.json`
}

/**
 * sidecar 目录路径：与 `soul-config.json` **同级**。
 *
 * 由配置文件路径推导而不是自己拼 `$DSH_HOME`：这样测试把配置指到临时目录时，
 * sidecar 自动跟着走（与 `bindingsPathFor` 同一条约定）。
 *
 * @param {string} configFilePath
 * @returns {string}
 */
export function sessionScopeDirFor(configFilePath) {
  return join(dirname(configFilePath), SESSION_DIR_NAME)
}

/**
 * 单个会话的 sidecar 完整路径。
 * @param {string} configFilePath
 * @param {string} sessionId
 * @returns {string}
 */
export function sessionScopePathFor(configFilePath, sessionId) {
  return join(sessionScopeDirFor(configFilePath), sessionFileName(sessionId))
```

</details>

**依据 5 · 源码核查**：[lib/session-scope.mjs:289-339](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/session-scope.mjs#L289-L339)

完整扫描和宽限回收。

<details>
<summary>查看原文（51行）</summary>

```text
export function decideSessionScopeFate(input) {
  const now = Number.isFinite(input.now) ? input.now : Date.now()
  const graceMs = Number.isFinite(input.graceMs) ? input.graceMs : ORPHAN_GRACE_MS
  const current = input.orphan || null

  // 会话还在磁盘上 —— 无论之前有没有标记，都要撤销候选状态。
  if (input.presentOnDisk) {
    if (current !== null) {
      return { action: 'clear-mark', orphan: null, reason: '会话重新出现，撤销孤儿标记' }
    }
    return { action: 'keep', orphan: null, reason: '会话存在' }
  }

  // 会话不在清单里，但本轮扫描不完整 —— **不标记、不删除**。
  // 这一步是「缺证据时保留」的直接落地：扫描不完整意味着"没看到"不等于"不存在"。
  if (!input.scanComplete) {
    return { action: 'keep', orphan: current, reason: '本轮扫描不完整，不做任何判定' }
  }

  // 第一次发现缺席：标记候选，不删除。
  if (current === null) {
    return {
      action: 'mark',
      orphan: { firstSeenAt: new Date(now).toISOString(), lastScannedAt: new Date(now).toISOString() },
      reason: '首次发现会话缺席，标记为候选'
    }
  }

  const firstSeen = Date.parse(current.firstSeenAt)
  if (!Number.isFinite(firstSeen)) {
    // 标记里的时间坏了：当作"刚发现"，重新计时（宁可多留 30 天）
    return {
      action: 'mark',
      orphan: { firstSeenAt: new Date(now).toISOString(), lastScannedAt: new Date(now).toISOString() },
      reason: '孤儿标记的时间不可解析，重新计时'
    }
  }

  const age = now - firstSeen
  if (age < graceMs) {
    return {
      action: 'keep',
      orphan: { firstSeenAt: current.firstSeenAt, lastScannedAt: new Date(now).toISOString() },
      reason: `宽限期内（剩余 ${Math.ceil((graceMs - age) / (24 * 3600 * 1000))} 天）`
    }
  }

  return {
    action: 'collect',
    orphan: current,
    reason: `缺席已超过 ${Math.round(graceMs / (24 * 3600 * 1000))} 天，且本轮扫描完整`
```

</details>

**依据 6 · 源码核查**：[scripts/verify-session-scope.mjs:59-75](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/scripts/verify-session-scope.mjs#L59-L75)

id/文件名测试。

<details>
<summary>查看原文（17行）</summary>

```text
check('sessionId 必须是非空短字符串，且不能是路径', () => {
  assert.equal(isSessionId('session-abc'), true)
  assert.equal(isSessionId(''), false)
  assert.equal(isSessionId('   '), false)
  assert.equal(isSessionId(null), false)
  assert.equal(isSessionId(42), false)
  assert.equal(isSessionId('a/b'), false, '含斜杠不得当 id')
  assert.equal(isSessionId('a\\b'), false, '含反斜杠不得当 id')
  assert.equal(isSessionId('..'), false, '路径穿越形态必须拒绝')
  assert.equal(isSessionId('.'), false)
  assert.equal(isSessionId('x'.repeat(MAX_SESSION_ID_LENGTH + 1)), false)
})

check('文件名是定长哈希，且不泄漏原始 id', () => {
  const id = 'session-very-secret-id-123'
  const name = sessionFileName(id)
  assert.equal(name.length, FILE_HASH_LENGTH + '.json'.length)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续和恢复成本是什么？

**研究主题：**效果与总成本

#### 完整回答

首次需要整理用户资料、选全局/项目/会话覆盖、审阅内置preset与确认开关，再看实际section/送达提示；没有独立外部API或key。持续每次模型上下文增加人格文本，修改会向所有活跃Agent注入快照，成本受指令长度、活跃会话数和修改频率影响，不能只因本地JSON就认为零token费用。模型遵循或任务质量提升未知，光轨纯界面也不证明业务收益。

恢复需保护.corrupt、配置、history及sidecar，区分配置保存成功与送达失败；历史保留上限会压实旧条目，重置/撤销语义应先看差异，不能靠重复confirm恢复错误会话提议。卸载可去未来section/界面，但已注入会话消息与派生历史不能据卸载推定抹除；需按宿主日志机制处理。若多人/多进程共享目录或HTTP门禁不明，先不存敏感自定义资料。节省提示词维护时间和长期任务收益没有同条件量化。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:792-831](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L792-L831)

逐活跃Agent注入与送达统计。

<details>
<summary>查看原文（40行）</summary>

```text
  for (const agent of listed) {
    // **每个会话各自编译**，不能共用一份文本。
    //
    // 工作区绑定让「配置」不再是全局唯一的：A 项目会话该拿到「资深架构师」，B 项目会话
    // 该拿到「极简主义者」。若在这里算一份全局文本发给所有人，B 项目会收到 A 的人设 ——
    // 这比不注入更糟（不注入时它至少还是全局配置，与用户以为的一致）。
    //
    // 拿不到 cwd（会话头无该字段）时 configForCwd 返回原配置，行为与绑定功能上线前一致。
    const perAgent = configForCwd(config, cwdOfAgent(agent)).config
    const prompt = compilePrompt(perAgent)
    const snapshotText = prompt || T.injectDisabled

    try {
      agent.inject(createUserMessage({
        content: [{
          type: 'text',
          text: prompt ? `${T.injectUpdatedHeader}\n${T.injectUpdatedBody}\n\n${prompt}` : snapshotText
        }],
        // 会话格式 v4 要求生产者自持 kind；旧的 `kind: 'plugin'` + `plugin` 组合
        // 会让每一轮在 step 开始前失败（issue #1，构造与校验见 lib/injection.mjs）
        source: createInjectionSource(snapshotText)
      }))
      delivered++
    } catch (err) {
      failed++
      lastError = err
      try {
        ctx.logger?.warn?.(`[dsh-soul] 向会话 ${agent?.id} 注入配置失败：${String((err && err.message) || err)}`)
      } catch {
        // 同上：日志失败不影响功能
      }
    }
  }

  deliveryState.injectedAt = stamp
  deliveryState.agents = listed.length
  deliveryState.delivered = delivered
  deliveryState.failed = failed
  deliveryState.injectionProblem = failed > 0
    ? `inject-failed: ${String((lastError && lastError.message) || lastError)}`
```

</details>

**依据 2 · 源码核查**：[lib/history.mjs:51-65](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/history.mjs#L51-L65)

保留压实与读上限。

<details>
<summary>查看原文（15行）</summary>

```text
// 保留条目数上限（默认值）。压实只丢**最老的**，于是保留下来的永远是完整日志的
// 一个后缀 —— 这是 planRollback 能安全工作的前提（见那里的注释）。
// 实际上限由配置字段 historyMaxEntries 决定（clampHistoryMaxEntries 夹在 50–500），
// 这里只作调用方未传时的兜底；数值必须与 lib/config.mjs 的
// HISTORY_MAX_ENTRIES_DEFAULT 一致，由 verify-config 钉住。
export const MAX_ENTRIES = 200

// 触发压缩的字节阈值。幸福路径只有一次 stat，压缩是低频动作。
export const MAX_BYTES = 512 * 1024

// 单行上限。超长行直接丢弃（否则一份手写的畸形文件可以把内存吃满）。
export const MAX_LINE_BYTES = 64 * 1024

// 单次读取上限：文件大于它时只读**尾部**这么多字节，再丢掉被截断的首行。
// 不能直接 readFile —— 用户手改出一个 200 MB 的文件就能把宿主进程拖死。
```

</details>

**依据 3 · 源码核查**：[lib/store.mjs:31-46](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/store.mjs#L31-L46)

reset移开保留corrupt。

<details>
<summary>查看原文（16行）</summary>

```text
// 把不可用的配置文件**移开**（而非复制），备份到 <file>.corrupt，返回备份路径。
//
// 与 backupCorruptFile 的差别只有一个，但这个差别很关键：移开之后原路径不再存在，
// 读取随即回到「首次运行」的正常分支。这是「重置」这类**刻意丢弃**动作需要的语义——
// 只复制而保留原文件的话，下一次读取仍会判定为损坏，于是重置依然被拒绝，
// 用户除手删文件外没有任何出路（这正是本函数存在的原因）。
//
// 目标已存在时会被 rename 覆盖（Node 在 Windows 用 MOVEFILE_REPLACE_EXISTING）。
// 文件本就不存在 / 移不动时返回 null —— 调用方据此判断是否真的腾出了位置。
export async function moveAsideConfigFile(filePath) {
  const target = corruptBackupPath(filePath)
  try {
    await rename(filePath, target)
    return target
  } catch {
    return null
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前采用结论和进一步探讨方向是什么？

**研究主题：**新假设与验证、采用判断

#### 完整回答

先观察，关键不在没有冒烟，而是三级section与旧注入通道不同、fallback确认缺会话/版本绑定、HTTP私有资料端点依赖未闭合宿主门禁。单用户不含敏感资料的小范围对照有价值，但当前不宜依赖它给多项目/多会话提供严格隔离的人格配置。继续试读时应逐项确认scope来源、保持一次待确认提议、保留配置备份，送达与保存分开看。

可进一步探讨一个纯解析器同时服务section/活动注入/预览，输出config revision+workspace/session scope指纹；提议带proposal id、会话/用户与基线revision，确认前比较而非全局取最后一份。基线是当前两条解析链和单pending变量，反例包含两个workspace/session覆盖、并发提议、审批后配置被改、sidecar首次冷读、损坏配置和历史断链。比较错误人格送达/错确认、上下文成本及恢复工时，当前未验证，不当作现有能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:792-812](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L792-L812)

当前注入链。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const agent of listed) {
    // **每个会话各自编译**，不能共用一份文本。
    //
    // 工作区绑定让「配置」不再是全局唯一的：A 项目会话该拿到「资深架构师」，B 项目会话
    // 该拿到「极简主义者」。若在这里算一份全局文本发给所有人，B 项目会收到 A 的人设 ——
    // 这比不注入更糟（不注入时它至少还是全局配置，与用户以为的一致）。
    //
    // 拿不到 cwd（会话头无该字段）时 configForCwd 返回原配置，行为与绑定功能上线前一致。
    const perAgent = configForCwd(config, cwdOfAgent(agent)).config
    const prompt = compilePrompt(perAgent)
    const snapshotText = prompt || T.injectDisabled

    try {
      agent.inject(createUserMessage({
        content: [{
          type: 'text',
          text: prompt ? `${T.injectUpdatedHeader}\n${T.injectUpdatedBody}\n\n${prompt}` : snapshotText
        }],
        // 会话格式 v4 要求生产者自持 kind；旧的 `kind: 'plugin'` + `plugin` 组合
        // 会让每一轮在 step 开始前失败（issue #1，构造与校验见 lib/injection.mjs）
        source: createInjectionSource(snapshotText)
```

</details>

**依据 2 · 源码核查**：[index.mjs:3443-3454](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L3443-L3454)

当前section全scope链。

<details>
<summary>查看原文（12行）</summary>

```text
          const sessionId = sessionIdOfAgent(agent)
          const workspaceId = sessionId === null ? null : (sessionWorkspaceIndex.get(sessionId) || null)
          // 会话层覆盖走**内存缓存**（同步），未命中时它会在后台排一次读盘，
          // 本轮按上层配置走 —— 下一轮生效。装配里绝不能 await。
          const sessionOverride = sessionOverridesOrNull(sessionId)
          const resolved = configForScope(snap.value, cwdOfAgent(agent), workspaceId, sessionOverride)
          const prompt = compilePrompt(resolved.config)
          // 记下「这一轮实际用的是哪一版」：排查「改了却没生效」时，第一个要回答的就是它。
          // 只写不读，不影响任何行为（deliveryState 由状态端点序列化给设置页）。
          deliveryState.lastAssembledRevision = snap.revision
          deliveryState.lastAssembledScope = resolved.source
          return prompt
```

</details>

**依据 3 · 源码核查**：[index.mjs:3354-3361](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs#L3354-L3361)

当前confirm不绑定身份版本。

```text
          if (first === 'confirm') {
            if (!pendingPersonaProposal) return { kind: 'error', text: t.noPending }
            const proposal = pendingPersonaProposal
            pendingPersonaProposal = null
            const { config: updated, changed, promptChanged } = await commitConfig(c => ({ ...c, ...proposal.patch }), { source: 'command', action: 'confirm' })
            if (promptChanged.length > 0) refreshPromptAndInject(ctx, updated)
            const detail = Object.keys(proposal.patch).map((key) => `${key}=${JSON.stringify(proposal.patch[key])}`).join(', ')
            return { kind: 'success', text: t.confirmDone(detail) }
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
