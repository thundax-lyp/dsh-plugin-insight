# dsh-soul

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[cc6e588](https://github.com/Aliuyanfeng/dsh-soul/tree/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 4,466](https://img.shields.io/static/v1?label=npm+30d&message=4%2C466&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-soul)
<!-- END META -->

> **功能**：管理DSH人格、用户资料、预设和三级配置覆盖，提供确认与历史观测，目标回合生效仍需核验。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将预设/身份分开，范围覆盖、历史与送达观测接成管理流程，增量是配置组织而非新增Agent/记忆。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) section三级与主动cwd快照分叉，冷缓存暂回上层；全局pending无会话/digest绑定，保存/确认/注入未抛不保证目标人格正确。

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
  - [Q01 · 人格管理比手工提示文件增加什么？](#detail-section-11)
  - [Q02 · 动态prompt与主动注入使用同一有效配置吗？](#detail-section-12)
  - [Q03 · 确认、并发和历史能保证目标与恢复吗？](#detail-section-13)
  - [Q04 · 什么成本和退路支持当前采用？](#detail-section-14)
  - [Q05 · 统一有效配置和绑定提议有何可证伪增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH个人用户跨项目重复维护语言/风格和指令，需正确范围与恢复，不是角色智能或记忆。

原生提示清单和手工复制配置；本包增加管理与诊断，不提供模型遵循保证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 预设/用户资料 | 重复提示管理 | 切预设不等人格遵循 |
| 三级section | 目标范围编译 | 冷缓存退上层，主动路只cwd |
| 工具确认 | 变更前审批 | 不可用退全局槽无身份绑定 |
| 历史/状态 | 查配置与送达 | 可不完整，非逐回合采纳 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH prompt/tools/命令服务 | 必需按能力 | 配置与编译 | peer声明非验收 |
| agents/session身份索引 | 正确范围需要 | 活动注入/三级映射 | 冷缓存/缺服务降级 |
| 可写配置/sidecar/history | 持久需要 | 保留与恢复 | 坏档拒写，历史可独立失败 |
| 同版web客户端 | UI按需 | 设置/预览/状态 | 不把预览当真实模型输入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 备份 | 全局/预设/绑定/sidecar/history | 确认profile与宿主 |
| 隔离 | 单workspace会话非敏感配置 | 核每轮真实prompt |
| 故障核 | 分落盘/记录/注入/采纳 | warning不盲重放 |
| 停止 | 错人格/pending跨会话停用 | 新会话回原提示，明确数据清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包/配置/备份 | profile与范围核验 | 金额/工时未知 |
| 持续 | prompt token/历史/sidecar | 风格维护/模型遵循核查 | 无独立调用非零总费 |
| 失败恢复 | 重试/备份 | 核已落盘与缺历史/送达 | 跨Host无事务验收 |
| 退出 | 配置/历史留存 | 禁用恢复原提示并定清理 | 不自动抹用户数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置管理 | 预设/身份与覆盖 | 净维护便利/模型遵循 |
| 送达观测 | revision/scope与inject计数 | 两路分叉真实请求/采纳 |
| 恢复 | temp rename/坏档拒写/历史 | 跨Host与不完整历史恢复 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) section三级与主动cwd快照分叉，冷缓存暂回上层；全局pending无会话/digest绑定，保存/确认/注入未抛不保证目标人格正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将预设/身份分开，范围覆盖、历史与送达观测接成管理流程，增量是配置组织而非新增Agent/记忆。

[Q02](#research-q02)、[Q03](#research-q03) 快照编译/禁插值、配置历史分离与保守回收可借鉴；单队列非跨Host事务、聚合状态非逐回合收据，resolver和确认身份需统一。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03) section三级与主动cwd快照分叉，冷缓存暂回上层；全局pending无会话/digest绑定，保存/确认/注入未抛不保证目标人格正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察，隔离单会话核实际提示再扩；错范围/跨会话确认或送达不明停用，备份后回原生提示，新会话核验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

对固定入口与直接resolver/确认/存储/sidecar定向核查并复核全部正式findings；未执行目标/宿主/模型，未逐行审所有UI和回滚绑定代码。

- 已检查：作者 README、包清单、源码路径 README.md、index.mjs、lib/session-scope.mjs、lib/store.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定package/README及index核心配置/prompt/注入/确认、store/session-scope；未全审UI/回滚/绑定模块或运行verify脚本。
- 下一步：[Q05](#research-q05) 两workspace四会话与冷缓存/并发/历史失败对照，测错人格与过期patch、净核查成本，尚未运行。

**分析版本**

- **仓库**：[Aliuyanfeng/dsh-soul](https://github.com/Aliuyanfeng/dsh-soul)
- **版本号**：0.9.0（[固定提交 cc6e588](https://github.com/Aliuyanfeng/dsh-soul/tree/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证统一有效resolver、身份/基线绑定提议及逐回合版本收据，比较多范围冷缓存/并发故障的错人格与核查成本。

[Q05](#research-q05) 两workspace四会话与冷缓存/并发/历史失败对照，测错人格与过期patch、净核查成本，尚未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 25 | 29760 | 20757 | 7040 | — |
| .md | source | 9 | 3466 | — | — | 82348 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：人格配置怎样正确送达目标回合，范围/确认/历史失败如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 人格管理比手工提示文件增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在多项目重复管理语言、语气、角色提示与用户资料的DSH个人用户，插件把预设、设置、/soul和set_persona工具组织为可持久配置。人格与“关于你”分开，预设切换不应改用户身份；0.9.0的三级配置增加workspace/session字段覆盖、历史与送达诊断。直接替代是维护原生提示清单和手工复制项目指令。

这是配置管理增量，不是新增智能体、角色真实性或跨会话长期记忆；README将记忆层放未来路线图。合格结果是目标回合采用预期配置且不会错范围，保存成功/人物预设数量不证明模型实际遵循或省时。已成熟用原生提示者未必需要迁移。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-36](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/README.md#L32-L36)

作者预设/身份及确认主张。

```text
- 输入自定义指令
- Agent 可调用工具 `set_persona`，让模型在对话中直接调整人设
- 人设预设：7 个内置人设（苏格拉底式提问者 / 极简主义者 / 资深架构师 / 教学型讲解者 / 严格代码审阅者 / 头脑风暴伙伴 / 自驱型协作者，随插件提供、不可删除）+ 多套自建人设一键切换（保存 / 使用 / 列表 / 删除，Web UI 与命令双入口）；每行摘要显示风格与偏离默认的维度
- 预设只管 Agent 的人格：**切换预设不会动「关于你」**（昵称 / 职业 / 介绍是你本人的资料，与「Agent 怎么说话」是两码事）。内置与自建一视同仁——保存预设时只快照风格 / 特质 / 回复长度 / 输出语言 / 自定义指令，不包含身份字段；早期版本存下的完整快照会在读取时自动剥离
- `set_persona` 确认模式（`requireToolConfirmation`）：Agent 的人设修改先在输入框处弹出**宿主原生审批面板**，由你点「允许一次」或「拒绝」（`Enter` 允许 / `Esc` 拒绝）后才会生效；审批通道不可用时（如会话审批策略为 `never`）退化为待确认提议，需 `/soul confirm` 处理
```

**依据 2 · 作者声明**：[README.md:42-51](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/README.md#L42-L51)

配置/送达/历史范围。

<details>
<summary>查看原文（10行）</summary>

```text
- `/soul set` 键值方式修改配置项
- 配置持久化保存
- 配置输入校验：字段白名单、类型、长度上限（昵称/职业 50、介绍 500、自定义指令 2000 字符）、枚举与十六进制颜色校验，非法或超限字段整单拒绝
- 配置持久化健壮性：写入为**原子替换**（先写临时文件再 `rename`，中断不会留下半份配置）；读取区分「文件不存在」与「文件损坏」——损坏时保留原文件、另存 `.corrupt` 备份、**拒绝覆写**，并把原因直接显示在设置页，避免自定义指令与人设库被静默清空
- 配置损坏时有**逃生口**：「重置」会先把损坏文件移开（备份为 `.corrupt`）再写入默认值 —— 否则损坏状态下五条写路径全被拒，用户只能自己删文件
- 送达可观测：`/soul show` 的「送达」行、`GET /api/soul/status`、设置页提示条（`configError` = 配置读不出来；`deliveryWarning` = 配置送不到活动会话）
- 提示词插值已关闭：自定义指令里的 `{{…}}` 按字面保留，不会触发宿主提示词装配失败
- 配置更新后同步到所有活动 Agent
- 变更检测：仅在影响 Agent 行为的配置实际变化时刷新提示词并注入会话；纯外观配置（输入框光轨）只落盘，不产生注入消息
- 变更记录与回滚（**插件详情页**：插件管理 → 已安装插件 → dsh-soul；设置页只在「人设预设」展开区给出指引，保留条数下拉也在这个区块内）：每次配置改动都追加一条记录（时间、**来源**、字段级 `原值 → 新值`），可**撤销某一次改动及其之后的全部改动**；删掉的预设可单点恢复。记录写在 `$DSH_HOME/soul-config.history.jsonl`（追加式，一行一条，人能直接读），保留条数可调（50 / 100 / 200 / 500，默认 200，改完即时生效）；存不下时**只影响记录、不影响配置写入**，并如实告诉你「记录可能不完整」。详情页给时间线与撤销，也可直接看文件
```

</details>

**依据 3 · 作者声明**：[README.md:60-64](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/README.md#L60-L64)

当前三级与未来记忆区分。

```text
| `0.7.2` | 设置页样式对齐宿主、卡片堆叠轮播、人设变更走宿主原生审批面板 | 已发布 |
| `0.8.0` | **变更审计与回滚** —— 记录每次配置改动（时间戳、来源、字段级 from→to），插件详情页给时间线与撤销 | 已发布 |
| `0.9.0` | **三级配置作用域** —— Global → Workspace → Session：工作区决定人设、会话可临时覆盖，附保守回收 | 已发布 |
| `0.10.0` | 自演化提议 + diff 审批 —— Agent 提议精炼人设，改动以 diff 走审批面板 | 规划中 |
| `0.11.0` | 记忆层 —— 跨会话长期记忆，按人设隔离、按需召回 | 规划中 |
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 动态prompt与主动注入使用同一有效配置吗？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

没有完全统一。configForScope先workspaceId覆盖，缺失退目录persona，再会话字段覆盖；systemPrompt每次同步取单份config快照、sessionWorkspaceIndex和sessionOverride，compilePrompt并记录revision/scope，关闭interpolate使{{...}}字面保留。sessionOverride缓存冷时只排后台读，本轮返回null按上层配置，后轮才生效；因此有缓存状态的时序边界。

主动刷新则agents.list循环，只调用configForCwd(config,cwd)，该兼容函数明确传workspaceId/sessionOverride为null。它创建宿主格式user injection送下一step，成功计数只是inject未抛，不观测模型采纳。配置被同时经三层systemPrompt和目录快照两路送入，同一会话可能收到不同人格上下文；缺agents服务则保section并报warning，不是所有会话永远失效。

单快照装配、禁用不需的插值、sidecar哈希/保守回收及配置状态分开可借鉴，但两路resolver需同身份语义。宿主systemPrompt、agents、sessions/storage和web客户端兼容另验；peer宽范围是声明，不作运行证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1074-1114](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L1074-L1114)

三级resolver与cwd兼容路径。

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

**依据 2 · 源码核查**：[index.mjs:1151-1162](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L1151-L1162)

冷缓存异步读本轮降级。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 3 · 源码核查**：[index.mjs:4217-4261](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L4217-L4261)

同步prompt装配与快照范围。

<details>
<summary>查看原文（45行）</summary>

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

      deliveryState.sectionRegisteredAt = new Date().toISOString()
    }
```

</details>

**依据 4 · 源码核查**：[index.mjs:757-785](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L757-L785)

agents不可用有明确降级。

<details>
<summary>查看原文（29行）</summary>

```text
function injectPromptToAllAgents(ctx, config) {
  const stamp = new Date().toISOString()
  const unavailable = (reason, message) => {
    deliveryState.injectedAt = stamp
    deliveryState.agents = 0
    deliveryState.delivered = 0
    deliveryState.failed = 0
    deliveryState.injectionProblem = reason
    warnOnce(ctx, reason, message)
  }

  const agents = ctx.get('agents')
  if (!agents || typeof agents.list !== 'function') {
    unavailable(
      'agents-service-unavailable',
      'agents 服务不可用：新配置只能经 system prompt section 送达，保存后可能要到新会话才生效'
    )
    return
  }

  let listed
  try {
    listed = agents.list()
  } catch (err) {
    unavailable(
      'agents-service-unavailable',
      `列出活动会话失败（${String((err && err.message) || err)}）：新配置只能经 system prompt section 送达`
    )
    return
```

</details>

**依据 5 · 源码核查**：[index.mjs:797-833](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L797-L833)

主动注入只cwd及未抛计数。

<details>
<summary>查看原文（37行）</summary>

```text
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

**依据 6 · 源码核查**：[package.json:45-62](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/package.json#L45-L62)

peer与web client声明。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认、并发和历史能保证目标与恢复吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

原生审批可用时set_persona先请求宿主批准，拒绝不写；unavailable/policy-disabled时落模块级pendingPersonaProposal，仅patch/proposedAt，无sessionId、workspaceId、原配置digest。后来的会话可覆盖同槽；/soul confirm读槽后先清null，再把patch合到当下全局配置，没有归属/基线匹配。因而跨会话确认或期间配置变化可套用非预期提议，commit失败还会丢待确认槽；不是“显示提出时间”就修复身份绑定。此为静态控制流限制，未并发复现。

commitConfig在单进程Promise队列内读/合并/写配置再记历史，避免同进程交错；文件temp+rename防半份JSON，坏档拒写并备份，是积极保护。它们不提供跨Host锁/CAS，也不是配置与history共同事务：audit失败记lastHistoryFailure并继续配置成功，历史可能不完整。deliveryState为最近聚合/最近装配信息，不是逐会话逐回合采纳收据。

因此save/confirm/inject回执要分落盘、记录完整性和目标送达；不因warning重放同变更。范围分叉与全局pending是关键采用障碍，用户必须停扩范围先核真实提示。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1476-1476](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L1476-L1476)

模块单槽。

```text
let pendingPersonaProposal = null
```

**依据 2 · 源码核查**：[index.mjs:4531-4555](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L4531-L4555)

审批降级只patch/时间。

<details>
<summary>查看原文（25行）</summary>

```text
            // 彻底无法确认人设变更。
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
```

</details>

**依据 3 · 源码核查**：[index.mjs:4156-4165](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L4156-L4165)

confirm先清槽并合当前全局。

<details>
<summary>查看原文（10行）</summary>

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

```

</details>

**依据 4 · 源码核查**：[index.mjs:470-477](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L470-L477)

单进程写队列。

```text
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}
```

**依据 5 · 源码核查**：[index.mjs:510-532](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L510-L532)

配置先成功再审计。

<details>
<summary>查看原文（23行）</summary>

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
}

// 路由内主动拒绝：从队列任务里抛出即可中止本次提交（不写盘），由 handler 按状态码回话。
// 不用返回一个「什么都没改」的配置来收场 —— 那会照样重写一次配置文件，
// 让一次失败的操作在磁盘上留下痕迹。
```

</details>

**依据 6 · 源码核查**：[index.mjs:568-584](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L568-L584)

历史失败只警告。

<details>
<summary>查看原文（17行）</summary>

```text
      configHash: hashConfig(config),
      before: fields.before,
      after: fields.after,
      personas
    })
    if (!entry) {
      // 有变化却构造不出条目 ⇒ 一定是调用点的 source/action 没标或标错。
      // 报出来而不是当作「无变化」跳过：审计缺一条而没人知道，比留一条错的更糟。
      lastHistoryFailure = `变更记录条目构造失败（source=${JSON.stringify(source)}），本次改动未被记录`
      return null
    }
    await recordHistoryEntry(historyPath(), entry, maxEntries)
    lastHistoryFailure = null
    return entry
  } catch (err) {
    lastHistoryFailure = String((err && err.message) || err)
    return null
```

</details>

**依据 7 · 源码核查**：[lib/store.mjs:112-124](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/lib/store.mjs#L112-L124)

temp/rename原子替换。

<details>
<summary>查看原文（13行）</summary>

```text
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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么成本和退路支持当前采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察，先隔离单workspace/单会话用非敏感配置验证实际每轮prompt，暂不扩三级与跨会话提议确认。备份全局配置、预设、绑定、sidecar及history，核profile和宿主版本，不把预览或inject未抛当真实请求。人格不符合、跨会话pending被替换或送达未知时禁用并回原生提示清单；已注入历史不能靠禁用机械撤回，需新会话核验。

首次配置/目录绑定/宿主准备与人工验收，持续增加提示token、历史/sidecar磁盘、风格维护与模型遵循核对；无独立模型调用不等零总成本。失败需区分已落盘但history缺、section失败或活动注入失败，恢复原备份前核当前值，避免重复写。退出禁用/移除保留用户数据另定清理，保守回收不自动抹隐私。金额、总耗时和同任务收益均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-51](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/README.md#L45-L51)

作者坏档、送达与不完整历史边界。

```text
- 配置持久化健壮性：写入为**原子替换**（先写临时文件再 `rename`，中断不会留下半份配置）；读取区分「文件不存在」与「文件损坏」——损坏时保留原文件、另存 `.corrupt` 备份、**拒绝覆写**，并把原因直接显示在设置页，避免自定义指令与人设库被静默清空
- 配置损坏时有**逃生口**：「重置」会先把损坏文件移开（备份为 `.corrupt`）再写入默认值 —— 否则损坏状态下五条写路径全被拒，用户只能自己删文件
- 送达可观测：`/soul show` 的「送达」行、`GET /api/soul/status`、设置页提示条（`configError` = 配置读不出来；`deliveryWarning` = 配置送不到活动会话）
- 提示词插值已关闭：自定义指令里的 `{{…}}` 按字面保留，不会触发宿主提示词装配失败
- 配置更新后同步到所有活动 Agent
- 变更检测：仅在影响 Agent 行为的配置实际变化时刷新提示词并注入会话；纯外观配置（输入框光轨）只落盘，不产生注入消息
- 变更记录与回滚（**插件详情页**：插件管理 → 已安装插件 → dsh-soul；设置页只在「人设预设」展开区给出指引，保留条数下拉也在这个区块内）：每次配置改动都追加一条记录（时间、**来源**、字段级 `原值 → 新值`），可**撤销某一次改动及其之后的全部改动**；删掉的预设可单点恢复。记录写在 `$DSH_HOME/soul-config.history.jsonl`（追加式，一行一条，人能直接读），保留条数可调（50 / 100 / 200 / 500，默认 200，改完即时生效）；存不下时**只影响记录、不影响配置写入**，并如实告诉你「记录可能不完整」。详情页给时间线与撤销，也可直接看文件
```

**依据 2 · 源码核查**：[index.mjs:797-833](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L797-L833)

送达并非采纳。

<details>
<summary>查看原文（37行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/session-scope.mjs:17-22](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/lib/session-scope.mjs#L17-L22)

保守回收的留存条件。

```text
//   3. **绝不用「agents.list() 里没有」判定会话已删除。** 那是 live registry，
//      会话切走、进程重启都会让它消失，但会话文件仍在磁盘上。用它判定会误删正在使用的
//      覆盖。唯一可信证据是 `sessionPersistence.list()`（扫磁盘）。
//   4. **缺证据时保留，不删除。** 清理是**单向下行**的操作：删错了用户永久丢失设置；
//      留着只是多几个小文件。所以凡是不确定的情况（服务不可用、扫描不完整、宽限期资料
//      缺失）一律不删。
```

#### 缺口

- 没有同版真实宿主/多范围送达与恢复验收、成本对照
  **影响**：无法支持持续采用或当前多会话使用
  **进一步探讨**：隔离四会话核真实请求人格与pending归属，记录token/配置历史恢复成本，未授权不跑。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 统一有效配置和绑定提议有何可证伪增量？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是两路共用按Agent身份有效配置resolver，并将提议绑定session/workspace、基线digest和逐回合采用版本。当前已有revision/scope、snapshot source、时间与history，不把“加审计”笼统算新贡献；增量是防错范围/过期确认并把aggregate回执变成实际目标可核。

对照当前两workspace四会话，分别不同目录/会话字段、冷缓存、并发提议、审批不可用、配置落盘后history失败；测错误人格/过期patch和核查时间/token。若宿主已保证等价身份、收据无法观测真实采纳或维护状态漂移抵消收益，则否定。尚未实验，不计入现有插件创新。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1074-1114](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L1074-L1114)

已有scope resolver构成复用基线。

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

**依据 2 · 源码核查**：[index.mjs:4241-4261](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L4241-L4261)

已有revision/scope观测。

<details>
<summary>查看原文（21行）</summary>

```text
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

      deliveryState.sectionRegisteredAt = new Date().toISOString()
    }
```

</details>

**依据 3 · 源码核查**：[index.mjs:4531-4555](https://github.com/Aliuyanfeng/dsh-soul/blob/cc6e588fe5a3ad4a13ce17e87394264f0c28dca5/index.mjs#L4531-L4555)

提议缺身份与digest提供推导。

<details>
<summary>查看原文（25行）</summary>

```text
            // 彻底无法确认人设变更。
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
```

</details>

#### 缺口

- 未对比统一resolver/绑定提议版本
  **影响**：不能声称新机制减少错人格或值得维护
  **进一步探讨**：隔离矩阵比较错范围/过期确认和净人工成本，无净改善不扩展。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
