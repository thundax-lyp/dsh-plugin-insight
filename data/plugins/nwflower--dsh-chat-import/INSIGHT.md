# Chat Import

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dae686f](https://github.com/Nwflower/dsh-chat-import/tree/dae686faadb44bbd1e5a71f9fd618c2d2e926cee)

<!-- BEGIN META -->
[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-chat-import) [![npm 30d 14,913](https://img.shields.io/static/v1?label=npm+30d&message=14%2C913&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chat-import)
<!-- END META -->

> **功能**：将其他编码 Agent 历史转换为 DSH 事件会话，提供预览、重导保护、路径映射及反向导出入口。

> **亮点**：来源解析到宿主代次适配、缺结果显式结构闭合、降级计数公开和续聊后重导保护构成可核查工程增量；原Agent推理方法不归此插件，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：工具结果空补、图片占位、子Agent跳过及部分落盘都限制“保留完整”主张；registry最后记账而非全局事务，异常须核实际对象，见 [Q02](#research-q02)。

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
  - [Q01 · 导入对象是什么，和复制聊天摘要相比改变什么？](#detail-section-11)
  - [Q02 · 代表转换怎样落盘，哪些“保留”包含结构修补？](#detail-section-12)
  - [Q03 · 如何试用，撤回、源删除和保真报告如何界定？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：迁入DSH的编码用户可从代表Codex/Claude历史保留结构上下文继续工作；必须另核cwd、环境和工具，不等于搬迁原运行状态，见 [Q01](#research-q01)。

复制摘要或手工重建会话；插件保留更多结构与来源信息并暴露降级，但公共修补和占位不能当字节无损或完整Agent快照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 事件转换 | 代表外部历史转DSH | 工具缺结果空补、图片可占位 |
| 重导 | 按源/持久化基线保护续聊 | 非实时双向同步 |
| 预览与回执 | 发现降级和缺损 | 可打开不等于迁移合格 |
| 反向导出入口 | 另存其他格式 | 本轮未验往返保真 |

**流程与依赖**

| 条件 | 用途 | 缺失或边界 |
|---|---|---|
| Node与匹配DSH/dsh-tools | 0.26.3插件及CLI执行 | 声明不是全代次实测 |
| fs/tools/sessionPersistence | 解析、模型工具与落盘 | 硬依赖，无服务不能导入 |
| 来源日志及附件权限 | 代表内容恢复 | 缺记录/图片只能降级或跳过 |
| 本机cwd/工具/模型 | 真正续聊执行 | 日志不恢复外部状态 |
| 原始副本与registry | 审核和重导/恢复 | 损坏后须比对实际目标 |

| 阶段 | 操作 | 成功与恢复判据 |
|---|---|---|
| 预备 | 保留源、固定宿主与路径 | 核附件权限和敏感内容 |
| 预览 | 代表来源只读转换 | 检查降级和关键上下文 |
| 少量导入 | 创建目标并挂工作区 | 核事件、cwd、工具配对及registry |
| 续聊 | 先无副作用核上下文 | 可加载不等于任务恢复 |
| 重导/退出 | 核基线和副本再清理 | 异常先查目标，区分源删除与purge |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 原件和副本存储未知 | 定位来源、映射路径、脱敏和事件核对 |
| 持续 | 扫描、附件及长历史模型费未知 | 来源更新、格式升级和副本身份维护 |
| 故障 | 部分会话/附件占用未知 | registry、事件、目标状态与缺损核对 |
| 退出 | 源与目标不自动互撤 | 保留原件，确认清理范围再删除 |

| 效果项 | 静态支持 | 未知 |
|---|---|---|
| 历史结构 | 角色/工具/检查点事件 | 逐来源无损与往返语义 |
| 续聊保护 | DSH增长后重导新副本 | 实际任务质量和环境一致 |
| 审核 | 降级计数可见 | 人工节时、节费及漏报率 |

> **思考**：工具结果空补、图片占位、子Agent跳过及部分落盘都限制“保留完整”主张；registry最后记账而非全局事务，异常须核实际对象，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：来源解析到宿主代次适配、缺结果显式结构闭合、降级计数公开和续聊后重导保护构成可核查工程增量；原Agent推理方法不归此插件，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) 结构适配、降级回执和DSH续聊基线保护值得借鉴；要保留空补结果不是真实工具证据、registry失败不代表没有落盘的语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

工具结果空补、图片占位、子Agent跳过及部分落盘都限制“保留完整”主张；registry最后记账而非全局事务，异常须核实际对象，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

固定宿主和代表日志，先副本预览、少量导入及核对后续聊；源原件和附件保留，不在重要数据试purge或源删除，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表Codex和公共导入/重导链已静态核查，试用少量副本；未运行转换、真实续聊、全部来源或反向导出。

- 已检查：作者 README、包清单、源码路径 README.md、lib/convert/codex.mjs、lib/convert/events.mjs、lib/host-session.mjs、lib/import-core.mjs、lib/imports.mjs、lib/index.mjs、lib/purge.mjs、lib/session-actions.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根统计，抽读插件接线、代表Codex转换、公共事件合成、导入决策/宿主适配/注册表、源动作和purge边界；未全审全部来源、Web鉴权和反向导出，不运行目标。
- 下一步：新代表日志覆盖缺/重工具结果、图片不可达、压缩、子Agent、源增长/截短及DSH已续聊，再注入registry失败；与原件逐事件比对并测试无副作用续聊。当前无运行证据。

**分析版本**

- **仓库**：[Nwflower/dsh-chat-import](https://github.com/Nwflower/dsh-chat-import)
- **版本号**：0.26.3（[固定提交 dae686f](https://github.com/Nwflower/dsh-chat-import/tree/dae686faadb44bbd1e5a71f9fd618c2d2e926cee)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用逐对象迁移验收单显式分清原样、修补、占位、跳过和未验，验证能否减少误判无损与续聊纠错；未实现且需求未知，见 [Q03](#research-q03)。

新代表日志覆盖缺/重工具结果、图片不可达、压缩、子Agent、源增长/截短及DSH已续聊，再注入registry失败；与原件逐事件比对并测试无副作用续聊。当前无运行证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 3848 | — | — | 97621 |
| .mjs | source | 164 | 35464 | 26065 | 7512 | — |
| .js | source | 16 | 9408 | 7560 | 1680 | — |
| .mjs | test | 164 | 37386 | 31701 | 3173 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Nwflower/dsh-chat-import/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/Nwflower/dsh-chat-import/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/Nwflower/dsh-chat-import/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分历史事件转换、宿主可加载与原Agent状态恢复，并核查代表迁移链和降级恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 导入对象是什么，和复制聊天摘要相比改变什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是dsh-chat-import 0.26.3原生插件，同时提供CLI bin与反向导出入口；不是独立Agent运行时。面向从Codex/Claude等编码Agent迁入DSH的用户，目标是把已有记录变成可加载的宿主事件会话，再由DSH继续当前任务。README“25+来源”是作者覆盖主张，本轮只深入代表Codex及公共事件链，不以适配器数量当成功效果。相较复制一段总结，保留角色、工具调用/结果关系、reasoning、压缩检查点及来源信息有可核查增量；跨Agent的真实工具权限、运行进程、工作文件与环境并不会由历史日志自动迁移。

插件硬依赖sessionPersistence/fs/tools，Web、commands、skills等可选延迟挂载，缺Web仍可走工具；Node>=22.13、宿主>=0.1.5-rc.1和dsh-tools<0.3.0等由package声明。实际能否继续还取决于宿主事件代次、路由/模型、工具与cwd；跨机器路径可映射，缺cwd时兜底可能有损。只证明导入格式不等于恢复原Agent完整执行状态。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-24](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/package.json#L2-L24)

版本、CLI、宿主和导出入口。

<details>
<summary>查看原文（23行）</summary>

```text
  "name": "dsh-chat-import",
  "description": "Import conversation history from 25+ AI coding agents into DeepSeek Harness as resumable sessions — tool calls, reasoning and results kept intact, with reverse export. | 把 25+ AI 编程 Agent 的聊天记录导入 DeepSeek Harness 继续对话，保留工具调用、推理与结果，支持反向导出。",
  "version": "0.26.3",
  "type": "module",
  "main": "./lib/index.mjs",
  "types": "./lib/index.d.ts",
  "icon": "assets/import.svg",
  "bin": {
    "dsh-chat-import": "bin/dsh-chat-import.mjs"
  },
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.mjs"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./export.mjs": "./lib/export/index.mjs",
    "./CHANGELOG.md": "./CHANGELOG.md",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:45-71](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/index.mjs#L45-L71)

硬依赖与可选服务接线。

<details>
<summary>查看原文（27行）</summary>

```text
import { registerChatImportService } from './chat-import-service.mjs'

const name = 'import-claude'
// 硬依赖只有这三项：webServer / skills / commands / settings 都是可选服务（headless / 无 Web
// 的 profile 不挂载），放进 inject 会让插件在 CI headless 冒烟与 CLI 会话里整体无法激活，
// 连导入工具都用不了。可选服务一律在 apply 内经 ctx.inject 按需注册。
const inject = ['sessionPersistence', 'fs', 'tools']

// config 是宿主解析后的条目配置：条目模型（DSH 0.1.7+）下 volatile 字段是带 .get() 的实时引用
//（宿主在设置写入时原地更新），registerImportPrefs 据此读初值——apply 期 fiber 还是 state 1，
// settings.describe() 会跳过本条目，只能从 config 读。
function apply(ctx, config) {
  // imports registry 目录：$DSH_HOME/dsh-chat-import（$DSH_HOME 缺省 ~/.dsh）
  const registryDir = resolveRegistryDir()
  // registerTools 先构建工具定义（makeImportChatTool 同时把 IMPORT_SPECS 落进
  // lib/toolkit.mjs，面板/命令依赖它），再默认全量注入并返回 reconcile——settings
  // 就绪 / injectTools 变化时由 registerImportPrefs 驱动按档位对账（'off' 不注入省
  // 上下文、'minimal' 仅注入 import_chat 入口、'full' 全量；GUI 面板任何档位都可转换）。
  const reconcileTools = registerTools(ctx, registryDir)
  // Public host service for third-party plugins. It delegates to the same specs
  // and state machine as import_chat.
  registerChatImportService(ctx)
  // 面板路由：webServer 是可选且晚挂载的 host 服务——web 组合的服务插件在本插件 apply 之后
  // 才发布它，apply 时 ctx.get('webServer') 为空。ctx.inject(['webServer'], …) 在服务可用时
  // 再注册路由（dsh 各包处理晚挂载依赖的标准姿势）：headless / CI 冒烟时回调永不执行，
  // 工具照常可用，apply 不因缺服务失败。
  ctx.inject(['webServer'], (webCtx) => {
```

</details>

**依据 3 · 源码核查**：[lib/import-core.mjs:46-59](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L46-L59)

cwd权威映射与有损兜底。

<details>
<summary>查看原文（14行）</summary>

```text
// 转换层无 cwd 记录时输出 cwdHint（Claude 项目 slug 目录名）——这里消费：
// ~/.claude.json projects 权威映射（resolveClaudeCwd）失败再 ASCII slug 解码回退
// （decodeClaudeSlug，有损兜底）。只在转换输出真正缺 cwd 时触发（不读 claude.json
// 于每个文件）；解码结果可能不存在（跨机器）→ attachToWorkspace 回退源目录。
async function applyCwdHint(ctx, out, sourcePath) {
  if (!out || !out.meta || typeof out.meta.cwd === 'string' || !out.cwdHint) return out
  const mapped = await resolveClaudeCwd(ctx, out.cwdHint, sourcePath)
  if (mapped) {
    out.meta.cwd = mapped
  } else {
    const decoded = decodeClaudeSlug(out.cwdHint)
    if (decoded) out.meta.cwd = decoded
  }
  delete out.cwdHint
```

</details>

**依据 4 · 源码核查**：[lib/import-core.mjs:95-106](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L95-L106)

跨机cwdRemap边界。

<details>
<summary>查看原文（12行）</summary>

```text
// cwd 重映射：跨机器迁移时，把源机的 cwd 前缀映射到本机等价路径。
//
// 背景：宿主用平台相关的 isAbsolute 校验 header.cwd（dsh-session/lib/index.js:786），
// 所以源机路径（如 Windows 的 D:\demo\proj 在 POSIX 上）在 prepareHostMeta 处被剔除，
// 会话退化为未分组。那个取舍是刻意的（绝不因 cwd 拒绝整次导入），本选项不推翻它——
// 只是给用户一个把源前缀改写成**本机**前缀的机会，改写结果仍要过同一道绝对性校验。
//
// 默认不启用：args.cwdRemap 缺失或为空数组时，本函数完全不碰 meta，既有行为不变。
// 规则按 from 长度降序匹配，长前缀优先，避免 '/a' 抢先命中 '/a/b'。
//
// 参数是模型/用户给的，因此按「失败要大声」严格校验：cwdRemap 不是数组、或某条规则
// 缺 from/to，直接抛错——静默忽略会让用户以为已经重映射了。
```

</details>

**依据 5 · 源码核查**：[lib/convert/codex.mjs:361-376](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/convert/codex.mjs#L361-L376)

子Agent跳过与主会话转换。

<details>
<summary>查看原文（16行）</summary>

```text
  // 子代理 rollout（thread_source='subagent' / source.subagent）不是独立会话：跳过并给
  // 原因（对齐 claude/qoder 的「辅助 transcript 跳过」语义），避免目录模式导入出碎片会话。
  if (subagent) {
    return skipResult('Codex subagent rollout (' + subagent + '); only the main session rollout becomes a session', { records: recs.length })
  }

  const sessionId = args.sessionId || mintSessionId(sourceId)
  const meta = { version: SESSION_FORMAT_VERSION, id: sessionId, createdAt: createdAt ?? Date.now() }
  if (sourceId) meta.sourceId = sourceId
  if (cwd) meta.cwd = cwd

  // 标题兜底：Codex 无显式标题源（无 ai-title/custom-title）→ 首问兜底。压缩只切正文，
  // 标题仍取全量记录里的第一条提问（会话级属性，与发现层面板取首问同口径）。
  // 只回填 out.title，不钉 session/title 事件（DSH 自动回退首条 user 文本，见 claude.mjs）。
  const finalTitle = normalizeTitle(titleTopic || (turns.length > 0 ? turns[0].prompt : ''))
  return finishSession(turns, args.budget, { meta, provider: 'codex', model, skipped, records: recs.length, skippedLines, secrets, systemPrompt }, {
```

</details>

#### 缺口

- 未逐来源和宿主代次实测，也未迁移外部工具环境。
  **影响**：不能由代表源码推导全部来源保真或任务恢复成功。
  **进一步探讨**：固定代表日志与宿主，先预览和加载，再核对工作目录/工具/权限及一条无副作用续聊。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代表转换怎样落盘，哪些“保留”包含结构修补？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Codex解析rollout后经公共synthesizeSession生成DSH事件，子Agent rollout明确跳过，fork另当独立会话。公共层配对工具结果、重复结果保留首个，对没有结果的调用补空tool-result使宿主/API结构闭合；这不是实际工具执行结果，也不是原始记录逐字无损。图片缺字节/服务或目标代次不支持时可降为占位，计数会透到公开回执；畸形行、注入丢弃、工具缺入/缺出等也有降级字段。关键贡献是语义形状适配和可见降级，而不是“完整无损”保证。

runDecision材料化附件、规划cwd/工作区后create，再做结构校验、挂接和缓存预热，最后rememberImport写注册表。宿主create优先agents.create种seed、代次不匹配等回持久化。此序列不是跨附件/会话/registry全局事务，若最后记账失败必须核实际会话，不能以异常推断没导入。重导有registry与持久化事件数基线：源增长且DSH已续聊则另铸副本，未知长度保守跳过，源内部改变也可跳过，不会强行覆盖已经续聊的日志；force是显式新副本路径，不可宣传成跨端双向实时同步。

#### 证据与依据

**依据 1 · 源码核查**：[lib/convert/events.mjs:171-177](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/convert/events.mjs#L171-L177)

工具结果去重。

```text
  let duplicateToolResults = 0
  for (const t of turns) {
    for (const s of t.steps) {
      for (const tc of s.toolCalls) if (!callById.has(tc.id)) callById.set(tc.id, tc)
      for (const tr of s.toolResults) {
        if (resultByCallId.has(tr.toolCallId)) { duplicateToolResults++; continue }
        resultByCallId.set(tr.toolCallId, tr)
```

**依据 2 · 源码核查**：[lib/convert/events.mjs:309-361](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/convert/events.mjs#L309-L361)

缺失结果补空以闭合结构。

<details>
<summary>查看原文（53行）</summary>

```text
        for (const tc of step.toolCalls) {
          const ev = push('tool/call', {
            turn,
            step: stepNum,
            callId: tc.id,
            name: tc.name,
            arguments: tc.arguments,
          })
          callSeqs.push(ev.seq)
        }
        // 配对不变量：每个 tool/call 在其广告的同一 step 内闭合——真实结果（预扫描
        // 已按调用归位）优先，全程无结果的调用（Cursor 无 tool_result、Claude/Codex/
        // Reasonix/Gemini 中断）补发空 result；content 用空数组：不虚构文本，wire
        // 适配器会把空内容归一为 "(no output)"（dsh-llm-deepseek / dsh-llm-pi-ai 的
        // serialize 均 `|| "(no output)"`）。不闭合则 resume 时模型 API 拒绝
        // （assistant 带 tool_calls 但缺 tool 消息），V4 迁移也在 step/end 拒载。
        // 结果的发射顺序：默认按 toolCalls 声明顺序；resultOrder='source' 时同一步内
        // 按源记录里结果的到达顺序（Kimi 并行工具），未收到结果的调用仍在末尾补空。
        const callIndex = new Map(step.toolCalls.map((tc, i) => [tc.id, i]))
        const orderedCallIndexes = []
        if (resultOrder === 'source') {
          const seenCall = new Set()
          for (const tr of step.toolResults) {
            const ci = callIndex.get(tr.toolCallId)
            if (ci === undefined || seenCall.has(tr.toolCallId)) continue
            seenCall.add(tr.toolCallId)
            orderedCallIndexes.push(ci)
          }
          for (let ci = 0; ci < step.toolCalls.length; ci++) {
            if (!seenCall.has(step.toolCalls[ci].id)) orderedCallIndexes.push(ci)
          }
        } else {
          for (let ci = 0; ci < step.toolCalls.length; ci++) orderedCallIndexes.push(ci)
        }
        for (const ci of orderedCallIndexes) {
          const tc = step.toolCalls[ci]
          const tr = resultByCallId.get(tc.id)
          advance(tr?.time)
          pushConversation('tool/result', {
            turn,
            step: stepNum,
            message: {
              id: 'import:' + meta.id + ':t' + turn + ':' + stepNum + ':' + tc.id,
              role: 'user',
              content: [{
                type: 'tool-result',
                toolCallId: tc.id,
                content: tr ? tr.content : [],
                ...(tr && tr.isError ? { isError: true } : {}),
              }],
              source: { kind: 'tool', callId: tc.id },
            },
          }, [callSeqs[ci]])
```

</details>

**依据 3 · 源码核查**：[lib/import-core.mjs:63-90](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L63-L90)

保真降级计数对外透传。

<details>
<summary>查看原文（28行）</summary>

```text
// 把转换层的畸形行明细 / secrets 位置 / permission 计数 / 工具结果丢弃计数附加到
// 公开结果。decideItem（lib/imports.mjs）只透传固定字段，这些字段在此补透；非空才
// 附加（schema 均为可选字段，空值不占键）。
export function attachConversionDetails(out, res) {
  if (out.skippedLines && out.skippedLines.length > 0) res.skippedLines = out.skippedLines
  if (out.secrets && out.secrets.length > 0) res.secrets = out.secrets
  if (out.permissionCount && out.permissionCount > 0) res.permissionCount = out.permissionCount
  if (out.cwdRemap) res.cwdRemap = out.cwdRemap
  if (out.orphanToolResults) res.orphanToolResults = out.orphanToolResults
  if (out.duplicateToolResults) res.duplicateToolResults = out.duplicateToolResults
  // 转换层保真 / 降级计数（>0 才附加；schema 均为可选字段）：isMeta 记录数、
  // 后端工具调用数、无法映射的结果块数、未知输出块数、畸形工具参数数；Copilot CLI 的
  // 未知事件 / 未导入附件 / 无声明的工具调用 / 无调用的执行结果。
  // 失败要大声：这些计数原本只停在转换器返回值，工具结果里看不到。
  for (const k of ['metaMessages', 'toolUseResultsMerged', 'backendToolCalls', 'droppedToolResultBlocks', 'droppedMalformedOutputs', 'droppedMalformedArgs', 'missingToolInputs', 'missingToolOutputs', 'droppedInjected', 'resetBoundaries', 'unknownEvents', 'droppedAttachments', 'unannouncedToolCalls', 'orphanResults']) {
    if (typeof out[k] === 'number' && out[k] > 0) res[k] = out[k]
  }
  // imagesDegraded 两个来源同口径相加：宿主层（runDecision 附件落地失败 / storeImages 关）
  // 已写进 res，转换层（拿不到字节）在 out 上。images 只由宿主层计数（落成附件的张数）。
  if (typeof out.imagesDegraded === 'number' && out.imagesDegraded > 0) {
    res.imagesDegraded = (typeof res.imagesDegraded === 'number' ? res.imagesDegraded : 0) + out.imagesDegraded
  }
  // 展平信封还原计数（整对象 >0 才附加）：Codex Desktop 外部导入的 rollout 里，工具调用被
  // 展平成正文文本信封，转换层还原成 tool-call/tool-result（见 lib/convert/codex.mjs）。
  // orphanResults / malformed 是降级项（结果保留为正文、载荷退化为原文），必须可见。
  if (out.externalAgent && (out.externalAgent.calls > 0 || out.externalAgent.results > 0
    || out.externalAgent.orphanResults > 0 || out.externalAgent.malformed > 0)) {
    res.externalAgent = out.externalAgent
```

</details>

**依据 4 · 源码核查**：[lib/import-core.mjs:257-281](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L257-L281)

附件降级与结构校验。

<details>
<summary>查看原文（25行）</summary>

```text
export async function runDecision(ctx, decision, registryDir, sourcePath, persisted, options = {}) {
  const validation = { ok: true, problems: [] }
  // 图片落地：写盘前把 IR 图片块的字节经 ctx.attachments 落成宿主附件（引用进日志），
  // 拿不到服务/不能落地的降级为 [image] 占位并计数。见 lib/attachments.mjs。
  const imageTally = { stored: 0, degraded: 0 }
  const materialize = async (events, targetId) => {
    // 目标代次（只认**权威**来源，不用推断值）：续写看目标会话自己的 header 代次；
    // 新建/替换看面板是否显式指定了代次（formatVersionOverrides）。两者都没有时传
    // undefined —— 宿主代次未知/为当前代次，按支持附件引用处理，绝不因为「推断不出来」
    // 就把图片降级。V3 目标不支持附件引用，见 docs/architecture.md D14。
    const targetVersion = typeof targetId === 'string' && targetId
      ? await targetSessionFormatVersion(ctx, targetId)
      : formatVersionOverride(ctx)
    const r = await materializeImages(ctx, events, { storeImages: options.storeImages !== false, targetVersion })
    imageTally.stored += r.stored
    imageTally.degraded += r.degraded
    return r.events
  }
  const check = (events) => {
    if (!Array.isArray(events) || events.length === 0) return
    const r = validateSessionEvents(events)
    if (!r.ok) {
      validation.ok = false
      const room = 20 - validation.problems.length
      if (room > 0) validation.problems.push(...r.problems.slice(0, room))
```

</details>

**依据 5 · 源码核查**：[lib/import-core.mjs:320-332](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L320-L332)

落盘顺序。

<details>
<summary>查看原文（13行）</summary>

```text
  // 一条会话的完整落盘序列（create / replace / multi 两圈的共用实现）：图片材料化 →
  // 落点规划（写进 header.cwd）→ create（幽灵 id 撞车时另铸后缀 id 重试一次）→ 结构校验
  // → 挂接工作区 → 预热投影缓存，并把**实测**日志长度写回该条记录（D13 的重导基线）。
  //   retryGhost=false 用于 replace：同 id 覆盖重导前已清掉目标工件，不存在宿主内存索引残留；
  //   onGhost(previous, current) 由调用方把新 id 同步回决策载荷（单会话改 decision，多会话
  //   改父记录子表与 results 条目）——同步口径是各路径唯一的差异，故留在调用方。
  const writeOneSession = async ({ events, meta, record, replace = false, retryGhost = true, onGhost }) => {
    await materialize(events)
    const prepared = await prepareGrouping(meta)
    let target = prepared.meta
    if (replace) await clearSessionArtifactsForReplace(ctx, target.id)
    try {
      await createSession(ctx, target, events)
```

</details>

**依据 6 · 源码核查**：[lib/import-core.mjs:428-432](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L428-L432)

会话落地后才写registry。

```text
  if (decision.__record) await rememberImport(registryDir, sourcePath, decision.__record)
  const pub = {}
  for (const [k, v] of Object.entries(decision)) {
    if (!k.startsWith('__')) pub[k] = v
  }
```

**依据 7 · 源码核查**：[lib/imports.mjs:495-513](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/imports.mjs#L495-L513)

基线保护和另铸副本。

<details>
<summary>查看原文（19行）</summary>

```text
    // 追加会污染他自己的对话 → 另铸副本；小于 → 日志被外部截短 → 不写、跳过上报；无基线 →
    // 不可判定 → 保守另铸副本一次并回填基线。用户心智：重复导入 = 要一份新副本。
    if (turns.length > known.turns) {
      const fromSeq = await storedEventCount(ctx, targetId)
      if (fromSeq === null) {
        // 连日志长度都读不到（后端不可用）：绝不冒险 append 错误 seq，也不复制会话
        return { ...base, sessionId: targetId, status: 'already-imported', alreadyImported: true, appendedSkipped: 'stored-length-unknown' }
      }
      const baseline = typeof known.storedEvents === 'number' ? known.storedEvents : null
      if (baseline === null || fromSeq > baseline) {
        const reason = baseline === null ? 'baseline-missing' : 'continued-in-dsh'
        const newId = persisted.has(meta.id) ? mintForceSessionId(persisted, meta.id) : meta.id
        return {
          ...base,
          sessionId: newId,
          status: 'imported',
          __action: 'create',
          __meta: { ...meta, id: newId },
          __events: events,
```

</details>

**依据 8 · 源码核查**：[lib/imports.mjs:557-564](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/imports.mjs#L557-L564)

同轮内部变化不能append改旧事件。

```text
    // 轮数相等：事件数也相等 = 内容未变（文件变了但转换结果一致，如新增畸形行）；
    // 事件数不同 = 既有轮次内变化，append-only 无法改写 → changedInPlace 跳过
    const eventsChanged = typeof known.events !== 'number' || events.length !== known.events
    if (eventsChanged) {
      return {
        ...base,
        sessionId: targetId,
        status: 'already-imported',
```

**依据 9 · 源码核查**：[lib/host-session.mjs:328-351](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/host-session.mjs#L328-L351)

目标代次及agents.create seed。

<details>
<summary>查看原文（24行）</summary>

```text
  // agents.create 只按宿主**原生**代次种会话，所以只有「目标代次 = 原生代次」时才走它
  // （代次不等时只能 sessionPersistence.create 直写，它按 header.version 选文件名）。
  // 相等时走 agents.create 还有一层必要副作用：它会 enter + announce 会话 → 宿主
  // api-session-controller 转发 api-session/added → 客户端会话列表即时出现新会话；
  // sessionPersistence.create 只落盘、不进内存会话表，导入后必须刷新页面才看得到。
  const override = formatVersionOverrides.get(ctx)
  const useAgents = agents && typeof agents.create === 'function'
    && (override === undefined || override === nativeVersion)
  if (useAgents) {
    let presetId
    try {
      const ap = ctx.get('agentPresets')
      if (ap && typeof ap.resolve === 'function') {
        const preset = await ap.resolve()
        if (preset && typeof preset.id === 'string' && preset.id) presetId = preset.id
      }
    } catch {
      // 无默认 preset / roster 未配置：不落盘 preset 身份，其余照旧
    }
    try {
      await agents.create({
        sessionId: hostMeta.id,
        meta: { ...hostMeta, ...(presetId ? { agentPreset: presetId } : {}) },
        seed: hostEvents,
```

</details>

#### 缺口

- 未故障注入附件/落盘/registry部分成功，也没验证具体端点接收修补历史。
  **影响**：不能由代表源码推导全部来源保真或任务恢复成功。
  **进一步探讨**：对副本注入源截短、缺工具结果、重复结果、图片不可达、DSH续聊、registry写失败，逐事件及实际持久化比对。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用，撤回、源删除和保真报告如何界定？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议保留源日志，以副本先预览再少量导入，核对用户/助手原文、工具配对、压缩上下文、图片、时间和cwd后才续聊；不要将目标可打开当迁移合格。首次有来源定位、格式代次、权限、路径映射和脱敏审阅成本，持续有扫描/转换/附件存储与长上下文模型费，金额耗时未知；源更新或DSH续聊后可能生成副本，用户需接受额外存储和身份核对。检测secrets位置不是所有敏感内容已清除的证明。反向导出存在独立入口，本轮未深入各目标语义，不能保证来回无损。

隐藏源、删除源、撤回导入和purge不是一个动作。源码将源删除限定为扫描发现的单会话文件并要求confirm，送回收站或插件trash；批量purge也需confirm:true且不可逆，不等于源文件已安全备份。卸载不会撤销已经写入宿主的会话/附件，失败要先核registry与实际会话再决定清理，保留原件才能退出。

可证伪方向是将现有降级计数升级为逐对象可定位的迁移验收单，明确原样、结构修补、占位、跳过、未验证；用户确认能否续聊所需上下文，再开目标会话。相对已有计数应降低遗漏关键工具结果和误判无损，代价是报告阅读/存储；以匿名损坏日志对照当前回执，测错误识别、人工审阅和续聊纠错，若无减少或负担过大则停止。该方向未实现、需求未知，不算当前保真能力。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:93-97](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/README.md#L93-L97)

预览与文件导入流程主张。

```text
  Click the **Import sessions** button at the bottom of the left sidebar to open the import window. With the DSH Claude Style theme, that button lives in the account menu at the bottom left. Pick the conversations you want and import them in one click.

  Rows carry their own tools: **double-click** a row to preview the conversation (a read-only dry-run — plugin injections skipped, tool calls folded into one line), switch the search box to **In content** to search message bodies instead of titles, **hide** a row reversibly, move a single-session source file to the Recycle Bin, or **drag the row onto a workspace** in the left sidebar to import it there with its timestamps shifted so it sorts to the top. The exact rules are in [docs/USAGE.md](docs/USAGE.md).

  If the file came from somewhere else — a web-app export, a script you wrote, a tool this plugin does not list — use **Import from file** at the top of the same window. Type a local path and press Enter, or press **Choose…** to pick files. When the path is a directory, it asks whether to search subfolders. Check the preview, then import. If detection fails, it lists why each candidate parser gave up and points you at the skill that converts the format.
```

**依据 2 · 源码核查**：[lib/import-core.mjs:63-90](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/import-core.mjs#L63-L90)

已有降级字段。

<details>
<summary>查看原文（28行）</summary>

```text
// 把转换层的畸形行明细 / secrets 位置 / permission 计数 / 工具结果丢弃计数附加到
// 公开结果。decideItem（lib/imports.mjs）只透传固定字段，这些字段在此补透；非空才
// 附加（schema 均为可选字段，空值不占键）。
export function attachConversionDetails(out, res) {
  if (out.skippedLines && out.skippedLines.length > 0) res.skippedLines = out.skippedLines
  if (out.secrets && out.secrets.length > 0) res.secrets = out.secrets
  if (out.permissionCount && out.permissionCount > 0) res.permissionCount = out.permissionCount
  if (out.cwdRemap) res.cwdRemap = out.cwdRemap
  if (out.orphanToolResults) res.orphanToolResults = out.orphanToolResults
  if (out.duplicateToolResults) res.duplicateToolResults = out.duplicateToolResults
  // 转换层保真 / 降级计数（>0 才附加；schema 均为可选字段）：isMeta 记录数、
  // 后端工具调用数、无法映射的结果块数、未知输出块数、畸形工具参数数；Copilot CLI 的
  // 未知事件 / 未导入附件 / 无声明的工具调用 / 无调用的执行结果。
  // 失败要大声：这些计数原本只停在转换器返回值，工具结果里看不到。
  for (const k of ['metaMessages', 'toolUseResultsMerged', 'backendToolCalls', 'droppedToolResultBlocks', 'droppedMalformedOutputs', 'droppedMalformedArgs', 'missingToolInputs', 'missingToolOutputs', 'droppedInjected', 'resetBoundaries', 'unknownEvents', 'droppedAttachments', 'unannouncedToolCalls', 'orphanResults']) {
    if (typeof out[k] === 'number' && out[k] > 0) res[k] = out[k]
  }
  // imagesDegraded 两个来源同口径相加：宿主层（runDecision 附件落地失败 / storeImages 关）
  // 已写进 res，转换层（拿不到字节）在 out 上。images 只由宿主层计数（落成附件的张数）。
  if (typeof out.imagesDegraded === 'number' && out.imagesDegraded > 0) {
    res.imagesDegraded = (typeof res.imagesDegraded === 'number' ? res.imagesDegraded : 0) + out.imagesDegraded
  }
  // 展平信封还原计数（整对象 >0 才附加）：Codex Desktop 外部导入的 rollout 里，工具调用被
  // 展平成正文文本信封，转换层还原成 tool-call/tool-result（见 lib/convert/codex.mjs）。
  // orphanResults / malformed 是降级项（结果保留为正文、载荷退化为原文），必须可见。
  if (out.externalAgent && (out.externalAgent.calls > 0 || out.externalAgent.results > 0
    || out.externalAgent.orphanResults > 0 || out.externalAgent.malformed > 0)) {
    res.externalAgent = out.externalAgent
```

</details>

**依据 3 · 源码核查**：[lib/session-actions.mjs:1-9](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/session-actions.mjs#L1-L9)

源删除与隐藏、回收站/trash区分。

```text
// lib/session-actions.mjs — per-row panel actions on discovered (not yet imported) sessions:
// hide / unhide, delete the source file, and resolving a sidebar workspace for drag-and-drop.
//
// Hide is a 'hidden' entry in the ignore table (lib/ignore.mjs): the panel list filters it and
// rescans / /import-all skip it, Undo removes the entry. Deleting the source is the only
// destructive action in the panel, so the route layer only offers it for paths a default-root
// scan discovered, never for one-file-many-sessions sources, and only with confirm:true; the
// file goes to the OS Recycle Bin (Windows) or a plugin-owned trash folder (elsewhere) — never
// an unlink.
```

**依据 4 · 源码核查**：[lib/purge.mjs:299-302](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/purge.mjs#L299-L302)

批量清理明确confirm及不可逆。

```text
/** 批量删除 registry 中全部导入会话；需 confirm:true。 */
export async function purgeAllImports(ctx, registryDir, { confirm } = {}) {
  if (confirm !== true) {
    throw new Error('批量删除需要 confirm:true（不可逆，仅删除本插件导入的会话）')
```

**依据 5 · 源码核查**：[lib/imports.mjs:53-73](https://github.com/Nwflower/dsh-chat-import/blob/dae686faadb44bbd1e5a71f9fd618c2d2e926cee/lib/imports.mjs#L53-L73)

registry损坏按空处理并警告，需核实实际目标。

<details>
<summary>查看原文（21行）</summary>

```text
// 直接读盘（调用方须已处于写串行链内）：缺失返回空 registry，损坏告警后按空处理。
// 同时维护进程内快照 lastRegistrySnapshot：导入决策链（decideItem）没有 registryDir
// 上下文，sessionOwnerPath 的 dshId 反查借用同流程内必然先行发生的本次读取结果。
let lastRegistrySnapshot = { imports: {} }

async function readRegistry(registryDir) {
  try {
    const parsed = JSON.parse(await readFile(join(registryDir, 'imports.json'), 'utf8'))
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      && parsed.imports && typeof parsed.imports === 'object') {
      lastRegistrySnapshot = parsed
      return parsed
    }
  } catch (err) {
    if (err && err.code !== 'ENOENT') {
      console.warn('[dsh-chat-import] imports registry 损坏，按空 registry 处理：' + String((err && err.message) || err))
    }
  }
  const empty = { version: REGISTRY_VERSION, imports: {} }
  lastRegistrySnapshot = empty
  return empty
```

</details>

#### 缺口

- 没有真实用户迁移验收、收益和完整导出往返验证。
  **影响**：不能由代表源码推导全部来源保真或任务恢复成功。
  **进一步探讨**：新代表日志与保留原件做受控比较，核对事件遗漏、人工纠错和续聊合格，而不重复旧样本声称新效果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
