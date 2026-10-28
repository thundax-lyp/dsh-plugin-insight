# dsh-soul

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8ae83c9](https://github.com/Aliuyanfeng/dsh-soul/tree/8ae83c944a2fdb7c53182b771f598888fcd6140b)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 3,422](https://img.shields.io/static/v1?label=npm+30d&message=3%2C422&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-soul)
<!-- END META -->

> **功能**：为DSH配置回复风格、语言和人格预设，并提供工作区与会话覆盖。

> **亮点**：将人格与用户资料分开，把手工提示管理接成预设、范围覆盖、配置历史和送达观测，减少重复接线。实际增量是配置管理，不能把人格预设算新增智能体或长期记忆。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：三层systemPrompt与只按cwd的主动注入使用不同有效配置；全局待确认槽也没有session/digest绑定，保存/确认成功不足以保证目标回合人格正确。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 个性化预设为谁改变什么，是否新增Agent能力？](#detail-section-11)
  - [Q02 · 三层配置怎样到达真实提示词，哪些状态优先？](#detail-section-12)
  - [Q03 · 确认、持久化与审计失败怎样影响结果？](#detail-section-13)
  - [Q04 · 用户承担什么成本，如何试用退出？](#detail-section-14)
  - [Q05 · 有效配置收据是否能减少范围误解？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在不同项目重复使用人格、语言与指令的DSH个人用户，需要正确的范围和可恢复配置。

原生提示词、自定义指令清单与人工逐会话粘贴；模型智能和工具权限均由宿主提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 人格预设与用户背景 | 少重复粘贴风格与指令 | 人格不等新增模型/权限 |
| 三层配置 | 工作区/会话逐字段覆盖 | 动态装配与活动注入尚未统一 |
| 工具确认与历史 | 管理变化与恢复 | 文本提议全局单槽，历史可缺失 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH/Cordis与systemPrompt | 提示必需 | 真实回合装配 | 宽peer声明不能替代宿主验收 |
| webServer、commands、tools/approval | 对应入口必需 | 设置/命令/模型修改与确认 | 工具ABI缺失会跳注册，审批缺失转文本 |
| 可写DSH_HOME与完整备份 | 保存/恢复必需 | 全局、历史、绑定、会话sidecar | 坏配置拒写，跨Host共享需额外核 |
| 可核范围和外层HTTP准入 | 多会话/远程前提 | 防误送与非预期配置读写 | 未核前限隔离本机 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定Host/profile并备份相关文件 | 插件实际加载，文件可恢复 |
| 2 | 用户先隔离单会话设置无敏感人格 | 预览、保存与实际请求一致 |
| 3 | 用户分别核工作区/会话覆盖和全局更新 | 两路解析不符先停，不扩大使用 |
| 4 | 用户核禁用/历史与文本确认 | 提议错配或送达不明回原生清单 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包、配置与本地存储，金额未知 | 核profile/备份/范围，时长未知 | 无独立模型调用不等零成本 |
| 持续使用 | 提示词token、历史和sidecar未知 | 维护人格、范围和模型遵循 | 未测端到端节时 |
| 失败恢复 | 重试/备份资源未知 | 分落盘、历史缺失和送达失败核对 | 历史可不完整，不直接重放变更 |
| 退出 | 人格/背景/历史留存未知 | 禁用并恢复原清单，另定文件清理 | 保守回收不自动抹除用户数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 人格管理 | 预设、命令、工具及三级字段 | 模型实际遵循与净便利 |
| 正确送达 | 动态装配与活动snapshot两路 | 范围分叉后的真实请求合并 |
| 可恢复 | 原子配置、拒写坏档和历史 | 跨Host写入及历史缺失后的恢复 |

> **思考**：三层systemPrompt与只按cwd的主动注入使用不同有效配置；全局待确认槽也没有session/digest绑定，保存/确认成功不足以保证目标回合人格正确。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将人格与用户资料分开，把手工提示管理接成预设、范围覆盖、配置历史和送达观测，减少重复接线。实际增量是配置管理，不能把人格预设算新增智能体或长期记忆。[Q01](#research-q01) [Q02](#research-q02)

配置/状态/历史分离、坏档拒写和保守回收值得借鉴；迁移时必须统一真实resolver与按身份绑定提议，单进程队列和最近一次状态不能当跨Host事务或逐会话回执。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

三层systemPrompt与只按cwd的主动注入使用不同有效配置；全局待确认槽也没有session/digest绑定，保存/确认成功不足以保证目标回合人格正确。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察；先隔离单会话核实际提示，再决定是否扩大范围。发现错人格、跨会话提议覆盖或送达不明即禁用，保留配置回原生提示清单。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

人格字段和三层解析是源码支持；两条送达链解析不一致为源码事实，实际请求优先级未知。范围收据为未验证假设；没有运行或收益验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.mjs、lib/store.mjs、lib/session-scope.mjs、lib/injection.mjs、lib/history.mjs、lib/workspace-scope.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交读取package、README、bundle、host核心配置/提示/注入/确认/路由及store、injection、session-scope。未逐行审所有UI、回滚与绑定代码；未执行目标代码、Host或模型。
- 下一步：先在隔离profile用两工作区四会话与冷缓存比较实际请求文本，覆盖并发提议/拒绝/落盘失败；记录错范围、错误确认和全周期成本，不把编译预览当模型遵循。

**分析版本**

- **仓库**：[Aliuyanfeng/dsh-soul](https://github.com/Aliuyanfeng/dsh-soul)
- **版本号**：0.9.0（[固定提交 8ae83c9](https://github.com/Aliuyanfeng/dsh-soul/tree/8ae83c944a2fdb7c53182b771f598888fcd6140b)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

统一按Agent有效配置，并将提议身份/基线摘要与逐回合采纳收据绑定；以两工作区四会话、冷缓存和并发故障矩阵检验零错范围和净核查时间。未验证，不能计现有能力。[Q05](#research-q05)

先在隔离profile用两工作区四会话与冷缓存比较实际请求文本，覆盖并发提议/拒绝/落盘失败；记录错范围、错误确认和全周期成本，不把编译预览当模型遵循。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 23 | 26782 | 18699 | 6272 | — |
| .md | source | 9 | 3439 | — | — | 80903 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个性化配置能否在全局、工作区与会话之间准确送达，并让用户理解修改与恢复的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 个性化预设为谁改变什么，是否新增Agent能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-soul 0.9.0是原生DSH个性化插件，面向在不同项目或对话中反复使用不同回复风格、语言和自定义指令的用户。它把手工重复粘贴提示与修改配置，变成设置页、/soul命令、预设与set_persona工具；合格交付是所选范围的配置准确送到目标回合，并能看清和撤回变化。人格预设只是行为提示字段，不是新模型、独立Agent或新增工具执行权限。用户背景与Agent人格分开，预设不携带用户身份资料，有助避免切人格时覆盖“关于你”。三级范围与可观测送达是可解释的接线增量，语义遵循仍由模型和宿主承担；README规划中的自演化和长期记忆没有成为当前能力。没有真实用户切换错误率或复核时间对照，不能由预设数推出效率或需求强度。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-40](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/README.md#L17-L40)

作者的个性化、人格/用户资料分离、工具与确认用途。

<details>
<summary>查看原文（24行）</summary>

```text

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
- 输入框光轨：Agent 回复中时，输入框边框显示沿边循环流动的光轨（默认颜色 `#679EFE`）
  - 颜色：预设色板、取色器或十六进制输入（如 `#679EFE`）
  - 流动速度：慢 / 中 / 快；光带粗细：细 / 中 / 粗
  - 光轨起点、终点沿边框匀速推进，带渐隐拖尾；与输入框边框完全重合，不出现双线
```

</details>

**依据 2 · 源码核查**：[package.json:1-25](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/package.json#L1-L25)

版本与实际host主入口。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-soul",
  "version": "0.9.0",
  "description": "为 DeepSeek Harness 添加个性化设置。",
  "icon": "./assets/icon.svg",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dsh-soul",
    "deepseek",
    "deepseek-harness",
    "personalization",
    "persona",
    "system-prompt",
    "ai-assistant",
    "customization"
  ],
  "type": "module",
  "main": "index.mjs",
  "scripts": {
    "verify": "node scripts/verify-config.mjs && node scripts/verify-store.mjs && node scripts/verify-history.mjs && node scripts/verify-bindings.mjs && node scripts/verify-scope.mjs && node scripts/verify-session-scope.mjs && node scripts/verify-client.mjs && node scripts/verify-e2e-prompt.mjs && node scripts/verify-live-prompt.mjs && node scripts/verify-compat.mjs && node scripts/verify-trail.mjs && node scripts/verify-nav-icon.mjs",
    "verify:strict": "node scripts/verify-config.mjs --strict && node scripts/verify-store.mjs --strict && node scripts/verify-history.mjs --strict && node scripts/verify-bindings.mjs --strict && node scripts/verify-scope.mjs --strict && node scripts/verify-session-scope.mjs --strict && node scripts/verify-client.mjs --strict && node scripts/verify-e2e-prompt.mjs --strict && node scripts/verify-live-prompt.mjs --strict && node scripts/verify-compat.mjs --strict && node scripts/verify-trail.mjs --strict && node scripts/verify-nav-icon.mjs --strict",
    "verify:config": "node scripts/verify-config.mjs",
    "verify:store": "node scripts/verify-store.mjs",
    "verify:history": "node scripts/verify-history.mjs",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/cordis.patch.yml#L1-L3)

bundle插入soul条目。

```text
- insert:
    - id: soul
      name: dsh-soul
```

**依据 4 · 作者声明**：[README.md:60-66](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/README.md#L60-L66)

作者区分当前三级作用域与规划中的自演化/长期记忆。

```text
| `0.7.2` | 设置页样式对齐宿主、卡片堆叠轮播、人设变更走宿主原生审批面板 | 已发布 |
| `0.8.0` | **变更审计与回滚** —— 记录每次配置改动（时间戳、来源、字段级 from→to），插件详情页给时间线与撤销 | 已发布 |
| `0.9.0` | **三级配置作用域** —— Global → Workspace → Session：工作区决定人设、会话可临时覆盖，附保守回收 | 已发布 |
| `0.10.0` | 自演化提议 + diff 审批 —— Agent 提议精炼人设，改动以 diff 走审批面板 | 规划中 |
| `0.11.0` | 记忆层 —— 跨会话长期记忆，按人设隔离、按需召回 | 规划中 |

设计与取舍写在 `docs/` 下的设计文档里；已发布的改动见 [RELEASE_NOTES.md](./RELEASE_NOTES.md)，发版流程见 [PUBLISHING.md](./PUBLISHING.md)，排查手册见 [DEBUGGING.md](./DEBUGGING.md)。路线图是方向而非承诺，顺序可能调整。
```

#### 缺口

- 缺少跨项目切人格的实际任务频率与同任务对照。
  **影响**：用途明确但不能给持续收益或付费需求判断。
  **进一步探讨**：相同项目任务比较原生提示清单与插件，记录误范围、重复配置和人工复核分钟。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三层配置怎样到达真实提示词，哪些状态优先？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

configForScope先取workspaceId覆盖；未命中时退目录最长前缀，再逐字段叠加sessionOverride，未覆盖字段保留上层，enabled不允许下层反开。systemPrompt.section的text同步读取一次配置快照，按Agent session索引工作区并读会话缓存，compilePrompt后返回；interpolate=false使自定义{{...}}保持字面。会话覆盖存入以sessionId哈希命名的sidecar并核内容身份；缓存首次未命中会异步读盘，本轮先用上层，下一轮才可能命中。可借鉴的是状态分离、稳定身份和字节快照，不把单次“保存成功”当所有回合已生效。另一路主动注入确实仍用configForCwd：它内部传null工作区和null会话覆盖，因此只按目录/全局编译，再以同一soul:persona snapshot区块送所有活动Agent。源码确认两条送达路径解析范围不一致；哪个文本实际影响模型还依赖宿主快照合并，未运行不能直接宣称已发生串人设。状态端点的lastAssembledScope/Revision是最近一次装配观察，不是每个会话完整回执。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1072-1112](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1072-L1112)

三层解析与兼容configForCwd明确省去工作区/会话。

<details>
<summary>查看原文（41行）</summary>

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
}

// 兼容既有调用点：只按 cwd 解析（不含工作区层）。
// 保留这个名字是因为 verify-*.mjs 与若干注释按它描述契约；新代码应直接用 configForScope。
function configForCwd(base, cwd) {
  const { config, binding } = configForScope(base, cwd, null, null)
  return { config, binding }
}
```

</details>

**依据 2 · 源码核查**：[index.mjs:1130-1161](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1130-L1161)

会话缓存未命中排异步读盘并返回上层。

<details>
<summary>查看原文（32行）</summary>

```text
//   · 读盘完成后写回缓存，下一轮装配即可命中；
//   · 写入（用户改覆盖）时同步更新缓存，**不等**磁盘 —— 让「改完立刻生效」成立。
//
// 失效方向是安全的：缓存未命中 ⇒ 这一轮按上层配置（工作区/全局）走，
// 最坏是"第一次生效慢一拍"，不会给出错误的人设。
const sessionOverrides = new Map()   // sessionId → override（已校验）
const sessionOverridesInFlight = new Set()
// 读过的 sessionId（含"读过但确实没有覆盖"）：避免每轮都重新排一次读盘
const sessionOverridesKnown = new Set()
// sessionId → 用户实际点选的预设名（sidecar 里的 personaName）。
//
// 与 override 分开存：override 是**模型用的字段**，personaName 是**给人看的注解**。
// 两者分开的好处是 —— 字段被手工改过、或多个预设字段相同时，
// 界面仍能显示"你点的确实是这个"，而不是靠字段反查猜一个。
const sessionPersonaNames = new Map()

// 读出某个会话的覆盖（同步，只查缓存）。
//
// 未命中时排一次异步加载并返回 null —— 本轮按上层走，下一轮生效。
function sessionOverridesOrNull(sessionId) {
  if (sessionId === null) return null
  if (sessionOverridesKnown.has(sessionId)) return sessionOverrides.get(sessionId) || null
  // 首次遇到：排一次读盘。in-flight 集合防止同一会话在一轮里被排多次。
  if (!sessionOverridesInFlight.has(sessionId)) {
    sessionOverridesInFlight.add(sessionId)
    void loadSessionOverride(sessionId).finally(() => {
      sessionOverridesInFlight.delete(sessionId)
    })
  }
  return null
}

```

</details>

**依据 3 · 源码核查**：[index.mjs:3415-3457](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L3415-L3457)

实际systemPrompt逐Agent走三层解析、关闭插值并记最近状态。

<details>
<summary>查看原文（43行）</summary>

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
        }
      })

```

</details>

**依据 4 · 源码核查**：[index.mjs:784-815](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L784-L815)

活动注入仍使用configForCwd，而非三层resolver。

<details>
<summary>查看原文（32行）</summary>

```text
  }

  const T = promptTextOf(config)

  let delivered = 0
  let failed = 0
  let lastError = null

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
```

</details>

**依据 5 · 源码核查**：[lib/injection.mjs:24-44](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/injection.mjs#L24-L44)

注入使用soul:persona snapshot区块。

<details>
<summary>查看原文（21行）</summary>

```text
const INJECTION_PRODUCER_KIND = 'plugin:dsh-soul'

// 快照区块名，与 systemPrompt section 的 name 对应
const INJECTION_SECTION_NAME = 'soul:persona'

/**
 * 构造注入消息的 source：自持 kind + snapshot 形态 + 命名区块。
 *
 * 不要再补 `plugin` 字段：v4 的迁移会主动丢弃它（rewritePluginSource 过滤掉
 * `plugin` 键），保留只会在日志里留下一份易混淆的重复归属。
 *
 * @param snapshotText - 注入给模型的快照文本（同时用作快照区块内容）。
 * @returns 符合会话格式 v4 的来源记录。
 */
export function createInjectionSource(snapshotText) {
  return {
    kind: INJECTION_PRODUCER_KIND,
    form: 'snapshot',
    sections: [{ name: INJECTION_SECTION_NAME, text: snapshotText }]
  }
}
```

</details>

**依据 6 · 源码核查**：[index.mjs:1203-1212](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1203-L1212)

会话覆盖只复制白名单字段且排除enabled。

<details>
<summary>查看原文（10行）</summary>

```text
function mergeSessionOverride(base, override) {
  if (!override || typeof override !== 'object') return base
  const patch = {}
  for (const [key, value] of Object.entries(override)) {
    if (SESSION_ENVELOPE_ONLY_FIELDS.includes(key)) continue
    if (!SESSION_OVERRIDE_FIELDS.includes(key)) continue
    patch[key] = value
  }
  if (Object.keys(patch).length === 0) return base
  return { ...base, ...patch }
```

</details>

**依据 7 · 源码核查**：[lib/workspace-scope.mjs:51-55](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/workspace-scope.mjs#L51-L55)

工作区enabled包封字段声明。

```text
  'customInstructions'
])

// 永远由全局决定、任何作用域都不能覆盖的字段。
export const ENVELOPE_ONLY_FIELDS = Object.freeze(['enabled'])
```

**依据 8 · 源码核查**：[lib/workspace-scope.mjs:247-260](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/workspace-scope.mjs#L247-L260)

工作区合并再次排除包封字段，仅叠加允许字段。

<details>
<summary>查看原文（14行）</summary>

```text
export function mergeWorkspaceOverride(base, override) {
  if (!override || typeof override !== 'object') return base

  const patch = {}
  for (const [key, value] of Object.entries(override)) {
    if (ENVELOPE_ONLY_FIELDS.includes(key)) continue
    if (!WORKSPACE_OVERRIDE_FIELDS.includes(key)) continue
    // 上面两行已经把引用字段（__persona）挡在外面 —— 它不是可覆盖字段。
    // 这里显式写出来，是为了让"引用字段不会进配置"成为可读的事实而不是巧合。
    if (key === WORKSPACE_PERSONA_REF) continue
    patch[key] = value
  }
  if (Object.keys(patch).length === 0) return base
  return { ...base, ...patch }
```

</details>

#### 缺口

- 两条配置路径在精确宿主快照合并后的实际优先级未知。
  **影响**：不能保证活动会话只收到用户所选workspace/session人格，限制多会话采用。
  **进一步探讨**：在A/B工作区及各会话覆盖下保存全局配置，抓实际请求内system与snapshot，核下一回合和冷启动首回合。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认、持久化与审计失败怎样影响结果？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

所有全局配置写路径用进程内Promise队列读改写，落盘先tmp再rename，损坏配置读错误会阻止普通保存并保留原件，重置才显式移开。audit在配置落盘之后尽力追加，失败存warning而不回滚配置，所以历史不是每次变更必有的原子审计。工具确认开启时调用真实approval；明确拒绝不写，通道缺失或policy=never则存文本提议，不能当自动允许。提议pendingPersonaProposal是模块级单槽，只存patch和时间；另一会话提议可替换，/soul confirm也没有绑定发起session/call或旧配置摘要，且先清槽再提交，写失败需重新提议。因此“有确认入口”不等于确认了原来那个范围和版本。全局队列不跨Host，store固定.tmp也无跨进程锁，多Host共享DSH_HOME需另核并发。HTTP配置handler直接注册webServer并读写，没有在所查handler中执行connection准入；不能由设置页是本机UI推出远程访问已鉴权。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:463-475](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L463-L475)

全局配置写队列只在进程内。

<details>
<summary>查看原文（13行）</summary>

```text
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
}
```

</details>

**依据 2 · 源码核查**：[index.mjs:508-525](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L508-L525)

配置写盘后才audit。

<details>
<summary>查看原文（18行）</summary>

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
  })
```

</details>

**依据 3 · 源码核查**：[index.mjs:577-582](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L577-L582)

recordHistoryEntry失败被catch，原因存lastHistoryFailure并返回null；结合前条saveConfig已完成，历史失败不会回滚配置。

```text
    await recordHistoryEntry(historyPath(), entry, maxEntries)
    lastHistoryFailure = null
    return entry
  } catch (err) {
    lastHistoryFailure = String((err && err.message) || err)
    return null
```

**依据 4 · 源码核查**：[lib/store.mjs:107-124](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/store.mjs#L107-L124)

损坏拒写及固定tmp/rename实现。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 5 · 源码核查**：[index.mjs:3552-3589](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L3552-L3589)

never转文本确认，不跳过功能确认。

<details>
<summary>查看原文（38行）</summary>

```text
    // 两件完全不同的事混在一起：
    //   ① 用户真的点了「拒绝」
    //   ② 审批通道被策略禁用，无人被询问
    // 若不区分，就会向用户报告一件**从未发生的事**（实测踩过：策略为 never 时
    // 提示「你在审批面板中拒绝了」，而用户根本没看到面板）。
    //
    // 故在发起请求前复刻宿主的策略算法，判定为 'never' 时直接走文本确认
    // （与 'unavailable' 同一落点），并给出准确文案。
    //
    // 为什么不直接应用变更（把 never 当作「无需确认」）：requireToolConfirmation
    // 是用户为本功能单独设的偏好，而 never 是会话级的审批通道策略。用后者悄悄推翻
    // 前者，等于让一个通道开关替用户取消了他自己的功能选择。真要免确认，正确做法是
    // 关掉设置页里的「人设变更需确认」开关 —— 那才是为这件事准备的开关。
    if (resolveApprovalPolicy(approval, agent) === 'never') return 'policy-disabled'

    const detail = Object.entries(changes)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(', ')
    const outcome = await approval.request({
      agent,
      toolName: 'set_persona',
      ...(exec && exec.callId !== undefined ? { callId: exec.callId } : {}),
      ...(exec && exec.signal !== undefined ? { signal: exec.signal } : {}),
      reason: '人设变更需要你的确认',
      // 中英并列：宿主按当前 UI 语言选取，审计日志里仍保留 reason 原文
      displayReason: {
        en: 'Persona change requires your confirmation',
        zh: '人设变更需要你的确认',
        'zh-Hans': '人设变更需要你的确认'
      }
    })
    return approvalOutcomeOf(outcome)
  } catch {
    // 审批链路任何异常都不应让人设变更彻底失败 —— 退化为文本确认
    return 'unavailable'
  }
}

```

</details>

**依据 6 · 源码核查**：[index.mjs:3731-3758](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L3731-L3758)

pending全局槽仅patch/时间，allowed再落盘。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 7 · 源码核查**：[index.mjs:3354-3368](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L3354-L3368)

confirm无session/digest绑定且先清槽。

<details>
<summary>查看原文（15行）</summary>

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
          }
```

</details>

**依据 8 · 源码核查**：[index.mjs:1231-1277](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1231-L1277)

配置HTTP handler直接读写，没有内建身份门。

<details>
<summary>查看原文（47行）</summary>

```text
    // 获取配置
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
```

</details>

**依据 9 · 源码核查**：[index.mjs:1463-1466](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1463-L1466)

待确认提议明确为模块级单一变量，不是session映射。

```text
// ==================== 人设预设 ====================

// 待确认的人设变更提议（set_persona 确认模式；进程内短生命周期，不做持久化）
let pendingPersonaProposal = null
```

**依据 10 · 源码核查**：[lib/history.mjs:590-603](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/history.mjs#L590-L603)

历史写入失败与不完整记录通过warning响应呈现，不伪装完整。

<details>
<summary>查看原文（14行）</summary>

```text
export function toHistoryResponse(read, writeFailure, maxEntries) {
  const warnings = []
  if (read.error) warnings.push(read.error)
  if (typeof writeFailure === 'string' && writeFailure) warnings.push(`变更记录写入失败：${writeFailure}`)
  if (read.truncated) warnings.push('记录文件末尾不完整，最后一次变更可能没有留下记录。')
  if (read.trimmedHead) warnings.push('记录文件较大，只读取了最近的部分。')
  if (read.trimmed > 0) warnings.push(`记录条目较多，只显示了最近的 ${MAX_READ_LINES} 条。`)
  if (read.dropped > 0) warnings.push(`有 ${read.dropped} 行无法解析，已忽略。`)
  return {
    entries: read.entries.slice().reverse(),
    // 上限是**配置里的承诺**，不是模块常量：客户端把「最多保留 N 条」这句话当真，
    // 服务端就必须说自己配置里真正承诺的那个数。
    max: Number.isFinite(maxEntries) && maxEntries > 0 ? Math.floor(maxEntries) : MAX_ENTRIES,
    warning: warnings.length > 0 ? warnings.join(' ') : null
```

</details>

#### 缺口

- 跨会话提议替换、多Host写入和宿主外层认证未动态复现。
  **影响**：不适合直接扩大到多用户共享Host；确认与恢复应人工核对。
  **进一步探讨**：在隔离profile以两会话不同提议、写盘失败、两Host并发和未登录HTTP访问核实际配置与响应。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户承担什么成本，如何试用退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

启动依赖匹配的DSH/Cordis及systemPrompt，工具、命令和web服务按对应功能注入；同名包安装不等于实际profile已加载。首次用户要备份配置、人设库、绑定与会话sidecar，确认宿主和实际生效范围；持续有额外提示词token、历史/sidecar存储及范围复核，虽无独立模型请求也不等于零成本。失败要分配置已写、历史缺失和送达失败，不能见HTTP成功就重复改写；历史回滚会撤销目标及之后更改，不保证仅撤一字段。会话回收要求持久清单完整、先标记并过30天宽限再删除，缺扫描证据保留，这减少误删但增加留存责任。当前建议观察，尤其先解决三层解析与主动注入不一致；愿研究者可隔离单会话、关闭工具修改后用无敏感人格核预览和实际请求，不作为日常多项目安装建议。若出现范围不符、确认提议变化或恢复资料不全，关闭插件并回原生提示清单，保留文件再决定清理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:45-73](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/package.json#L45-L73)

宿主peer与bundle/client依赖声明。

<details>
<summary>查看原文（29行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1 || ^4.0.5-alpha.1",
    "@deepseek-ai/dsh-llm": ">=0.1.1-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.6 <0.3.0-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    }
  },
  "exports": {
    ".": {
      "default": "./index.mjs"
    },
    "./client": "./client/index.mjs",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "index.mjs",
    "lib",
```

</details>

**依据 2 · 源码核查**：[index.mjs:3791-3841](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L3791-L3841)

入口依次加载、提供服务和挂各能力。

<details>
<summary>查看原文（51行）</summary>

```text
export async function apply(ctx) {
  // 加载配置
  await loadConfig()

  // 加载工作区绑定表。
  //
  // 必须在装配路径之外做完：system prompt section 的 text provider 是**同步**的
  // （见 registerSystemPrompt 里的说明），不能在里面 await 读盘。这里读一次，
  // 之后每轮装配只做纯字符串比较。失败不阻塞启动（绑定是可选增强）。
  await ensureBindings()
  
  // 提供 soulConfig 服务
  ctx.provide('soulConfig', {
    async getConfig() {
      return await loadConfig()
    },
    async updateConfig(newConfig) {
      // 与 HTTP 保存共用同一套校验；失败时抛错给服务调用方；返回更新后的配置
      const { patch, errors } = sanitizeConfig(newConfig)
      if (Object.keys(errors).length > 0) {
        throw new Error('配置校验失败：' + formatFieldErrors(errors))
      }
      const { config, promptChanged } = await commitConfig(current => ({ ...current, ...patch }), { source: 'service', action: 'update' })
      // 送达与另外三条写路径保持一致：服务调用方（其它插件）改配置后同样应当
      // 立即反映到活动会话，否则「改了配置不生效」会从服务这条路再次出现。
      if (promptChanged.length > 0) refreshPromptAndInject(ctx, config)
      return config
    },
    async getSystemPrompt() {
      const config = await loadConfig()
      return compilePrompt(config)
    },
    async resetConfig() {
      // 与 HTTP / 斜杠命令两条重置入口共用逃生口
      const { config, promptChanged } = await resetConfigWithEscape({ source: 'service', action: 'reset' })
      if (promptChanged.length > 0) refreshPromptAndInject(ctx, config)
      return config
    }
  })
  
  // 注册各模块
  registerRoutes(ctx)
  registerPersonaRoutes(ctx)
  registerHistoryRoutes(ctx)
  registerBindingRoutes(ctx)
  registerWorkspaceRoutes(ctx)
  registerSessionScopeRoutes(ctx)
  registerCommands(ctx)
  registerSystemPrompt(ctx)
  registerTools(ctx)
  registerWorkspaceIndex(ctx)
```

</details>

**依据 3 · 源码核查**：[index.mjs:1410-1455](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1410-L1455)

配置错误与送达/装配状态分开返回。

<details>
<summary>查看原文（46行）</summary>

```text
          if (req.method !== 'GET') {
            send(405, { ok: false, error: 'Method not allowed' })
            return
          }

          const config = await loadConfig()
          const injection = {
            lastAt: deliveryState.injectedAt,
            agents: deliveryState.agents,
            delivered: deliveryState.delivered,
            failed: deliveryState.failed,
            problem: deliveryState.injectionProblem
          }

          send(200, {
            ok: true,
            version: pluginVersion(),
            enabled: config.enabled,
            configPath: configPath(),
            configError: configLoadFailure ? describeConfigFailure(configLoadFailure) : null,
            promptChars: compilePrompt(config).length,
            channels: {
              // section 是底座：它一旦注册成功，宿主每一步装配都会重新求值
              // （不依赖任何缓存，见 scripts/verify-live-prompt.mjs）
              section: {
                registered: deliveryState.sectionRegisteredAt !== null,
                registeredAt: deliveryState.sectionRegisteredAt,
                // 当前内存里的配置修订号，以及最近一次装配实际用到的那个。
                // 两者不相等是**正常**的（装配发生在写入之前）；但用户报告「改了没生效」
                // 时，若 lastAssembledRevision 长期不前进，问题就锁定在装配没被触发，
                // 而不是配置没写进去 —— 这正是过去只能靠猜的那一步。
                configRevision,
                lastAssembledRevision: deliveryState.lastAssembledRevision,
                lastAssembledScope: deliveryState.lastAssembledScope,
                // 工作区索引：有了它才能把 sessionId 换成 workspaceId。
                // 为 null 表示从未重建成功 —— 此时一切解析都退化为 cwd 前缀匹配。
                workspaceIndexBuiltAt,
                workspaceIndexSize: sessionWorkspaceIndex.size
              },
              injection
            },
            deliveryWarning: deliveryProblemText(config)
          })
        } catch (err) {
          send(500, { ok: false, error: String(err.message || err) })
        }
```

</details>

**依据 4 · 源码核查**：[lib/session-scope.mjs:290-339](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/session-scope.mjs#L290-L339)

持久清单完整、候选/宽限/回收约束。

<details>
<summary>查看原文（50行）</summary>

```text
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

**依据 5 · 作者声明**：[README.md:51-54](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/README.md#L51-L54)

作者明确回滚连同目标之后全部改动，历史可能不完整；提示词预览另属只读入口。

```text
- 变更记录与回滚（**插件详情页**：插件管理 → 已安装插件 → dsh-soul；设置页只在「人设预设」展开区给出指引，保留条数下拉也在这个区块内）：每次配置改动都追加一条记录（时间、**来源**、字段级 `原值 → 新值`），可**撤销某一次改动及其之后的全部改动**；删掉的预设可单点恢复。记录写在 `$DSH_HOME/soul-config.history.jsonl`（追加式，一行一条，人能直接读），保留条数可调（50 / 100 / 200 / 500，默认 200，改完即时生效）；存不下时**只影响记录、不影响配置写入**，并如实告诉你「记录可能不完整」。详情页给时间线与撤销，也可直接看文件
- 插件图标：插件管理列表与侧栏入口显示专属图标（`assets/icon.svg`，36×36，随 npm 包发布）
- 设置导航图标：设置面板左侧「个性化」那一项显示与插件图标同一套几何的图标——同一条光轨与火花，颜色与线宽则跟随邻居（单色 `currentColor`）；DSH 的导航图标按 section id 硬编码、插件声明不了，故由客户端做 DOM 替换
- 提示词预览（只读，设置页底部折叠区）：无未保存编辑时显示**当前生效**的提示词；表单一有改动就转为预览**草稿**——展示保存后真正会注入的内容，边改边看（停止输入 400ms 后自动重新编译），并在保存 / 重置 / 应用预设后自动刷新。未通过校验的字段会单独列出且不计入预览
```

**依据 6 · 源码核查**：[lib/history.mjs:551-581](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/history.mjs#L551-L581)

从最新记录倒序遍历至目标，逐步核configHash并还原before，失配返回diverged，证实回滚包含后续记录。

<details>
<summary>查看原文（31行）</summary>

```text
export function planRollback(entries, current, targetId) {
  const list = Array.isArray(entries) ? entries : []
  const index = findEntryIndex(list, targetId)
  if (index < 0) return { ok: false, reason: 'missing', patch: {}, skipped: [], reversed: [] }

  let state = isPlainObject(current) ? current : {}
  const newest = list[list.length - 1]
  if (!newest || hashConfig(state) !== newest.configHash) {
    return { ok: false, reason: 'diverged', patch: {}, skipped: [], reversed: [] }
  }

  const reversed = []
  for (let i = list.length - 1; i >= index; i--) {
    const entry = list[i]
    if (hashConfig(state) !== entry.configHash) {
      return { ok: false, reason: 'diverged', patch: {}, skipped: [], reversed: [] }
    }
    state = { ...state, ...entry.before }
    reversed.push(entry.id)
  }

  const rawPatch = {}
  for (const key of AUDIT_FIELDS) {
    if (state[key] === current[key]) continue
    // 缺席与「值为 undefined」在 JSON 里无法区分，喂给 sanitizeConfig 只会换来一条
    // 「必须为字符串」的误报（并被算进 skipped）—— 直接跳过，让它如实缺席。
    if (state[key] === undefined) continue
    rawPatch[key] = state[key]
  }
  const { patch, errors } = sanitizeConfig(rawPatch)
  return { ok: true, reason: null, patch, skipped: Object.keys(errors), reversed }
```

</details>

**依据 7 · 源码核查**：[index.mjs:1913-1934](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1913-L1934)

真实rollback路由在配置队列内调用planRollback，缺记录/指纹失配拒绝写入，成功才更新配置与提示。

<details>
<summary>查看原文（22行）</summary>

```text
          const { config: updated, changed, promptChanged, entry } = await commitConfig(async (current) => {
            // 记录必须在**队列内**读：放到队列外读会与并发写入形成窗口，规划建立在
            // 已被别人改过的配置上，指纹校验随后报出一个看起来像「数据损坏」的
            // diverged，把排查方向带偏。
            const read = await readHistoryFile(historyPath())
            if (read.error) throw httpError(500, read.error)
            plan = planRollback(read.entries, current, id)
            if (!plan.ok) {
              if (plan.reason === 'missing') {
                throw httpError(400, `找不到这条变更记录：${id}。它可能已被清空或压实淘汰。`)
              }
              // diverged：配置与记录不同步（有人手改过配置文件）。不给一个猜出来的结果。
              throw httpError(409, '记录与当前配置对不上，无法撤销。可能有人手工改过配置文件。')
            }
            // 补丁为空是**合法**结果（目标那次改动已被后续改动改回来了），
            // 此时不改任何字段、也不会留下记录，由 unchanged 告诉客户端「已经是最新」。
            if (Object.keys(plan.patch).length === 0) return { ...current }
            return { ...current, ...plan.patch }
          }, { source: 'rollback', action: 'rollback' })

          // 仅影响 Agent 行为的字段变化才刷新提示词注入（与其余写路径同一门控）
          if (promptChanged.length > 0) refreshPromptAndInject(ctx, updated)
```

</details>

**依据 8 · 源码核查**：[index.mjs:2751-2770](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L2751-L2770)

GC的清单来自sessionPersistence.list，服务缺失/抛错令scanComplete为false。

<details>
<summary>查看原文（20行）</summary>

```text
  // 磁盘上的会话清单。
  let stored = null
  let persistenceProblem = null
  const persistence = ctx.get('sessionPersistence')
  if (!persistence || typeof persistence.list !== 'function') {
    persistenceProblem = 'sessionPersistence 服务不可用：无法确认哪些会话仍然存在，本轮不做任何判定'
  } else {
    try {
      const listed = await persistence.list()
      stored = new Set(
        (Array.isArray(listed) ? listed : [])
          .map((item) => (item && item.id !== undefined ? String(item.id) : ''))
          .filter((id) => id !== '')
      )
    } catch (err) {
      persistenceProblem = `列出会话失败：${String((err && err.message) || err)}；本轮不做任何判定`
    }
  }

  const scanComplete = stored !== null && persistenceProblem === null
```

</details>

**依据 9 · 源码核查**：[lib/session-scope.mjs:51-59](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/lib/session-scope.mjs#L51-L59)

会话范围不能覆盖enabled，孤儿宽限默认30天。

```text
// 任何作用域都不能覆盖的字段。与 lib/workspace-scope.mjs 的 ENVELOPE_ONLY_FIELDS 同义
// （两处独立列举：它们服务不同的数据形状，共享常量会让一处改动悄悄影响另一处）。
export const SESSION_ENVELOPE_ONLY_FIELDS = Object.freeze(['enabled'])

// 会话覆盖的宽限期（毫秒）。30 天。
//
// 这个数字**不是**普适标准，而是一个保守默认：宿主是否支持归档、离线会话、历史恢复
// 都还没有定论（会话文件可能长期存在但不活跃）。宁可留着。
export const ORPHAN_GRACE_MS = 30 * 24 * 60 * 60 * 1000
```

#### 缺口

- 真实提示遵循、误范围率、token与人工总成本无对照。
  **影响**：不能宣称个性化更有效、自动稳定或更省费用。
  **进一步探讨**：固定模型/任务对照手工人格清单，计全轮提示token、错范围和恢复分钟；无改善不扩展。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 有效配置收据是否能减少范围误解？

**研究主题**：新假设与验证

#### 完整回答

由两路resolver不一致和全局待确认单槽可推导未验证假设：统一生成按Agent绑定的effectiveConfig，systemPrompt与主动注入共用同一resolver；确认提议保存session/call、原配置摘要和字段范围，过期/冲突重新预览；回执分为落盘、入队送达、实际回合采纳。现有revision/scope观测可作为基础，但单一最近值不足以覆盖并发。新增成本是每会话状态、冲突说明和更细留存，不能以多一份收据当理解保证。最小验证两工作区各两会话、不同覆盖、首轮缓存空、并发提议和写失败矩阵，与当前插件/手工清单比较错范围次数、错确认和恢复分钟。若任何已确认提议落到另一范围、两通道有效字段不同，或核查时间增加抵消收益，则否定实现；没有真实愿用用户前不升级为独立插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1072-1112](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1072-L1112)

统一resolver应覆盖的当前分叉。

<details>
<summary>查看原文（41行）</summary>

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
}

// 兼容既有调用点：只按 cwd 解析（不含工作区层）。
// 保留这个名字是因为 verify-*.mjs 与若干注释按它描述契约；新代码应直接用 configForScope。
function configForCwd(base, cwd) {
  const { config, binding } = configForScope(base, cwd, null, null)
  return { config, binding }
}
```

</details>

**依据 2 · 源码核查**：[index.mjs:784-815](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L784-L815)

主动注入缺workspace/session参数。

<details>
<summary>查看原文（32行）</summary>

```text
  }

  const T = promptTextOf(config)

  let delivered = 0
  let failed = 0
  let lastError = null

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
```

</details>

**依据 3 · 源码核查**：[index.mjs:3731-3758](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L3731-L3758)

确认提议缺身份/基线绑定。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[index.mjs:1435-1450](https://github.com/Aliuyanfeng/dsh-soul/blob/8ae83c944a2fdb7c53182b771f598888fcd6140b/index.mjs#L1435-L1450)

现有最近revision/scope观测可作为起点。

<details>
<summary>查看原文（16行）</summary>

```text
                registered: deliveryState.sectionRegisteredAt !== null,
                registeredAt: deliveryState.sectionRegisteredAt,
                // 当前内存里的配置修订号，以及最近一次装配实际用到的那个。
                // 两者不相等是**正常**的（装配发生在写入之前）；但用户报告「改了没生效」
                // 时，若 lastAssembledRevision 长期不前进，问题就锁定在装配没被触发，
                // 而不是配置没写进去 —— 这正是过去只能靠猜的那一步。
                configRevision,
                lastAssembledRevision: deliveryState.lastAssembledRevision,
                lastAssembledScope: deliveryState.lastAssembledScope,
                // 工作区索引：有了它才能把 sessionId 换成 workspaceId。
                // 为 null 表示从未重建成功 —— 此时一切解析都退化为 cwd 前缀匹配。
                workspaceIndexBuiltAt,
                workspaceIndexSize: sessionWorkspaceIndex.size
              },
              injection
            },
```

</details>

#### 缺口

- 统一解析和范围收据是否降低误操作与总负担未知。
  **影响**：属于新设计假设，不计已有贡献或市场需求。
  **进一步探讨**：先合成故障矩阵，再用真实匿名人格任务对照；错范围未归零或成本不降则停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
