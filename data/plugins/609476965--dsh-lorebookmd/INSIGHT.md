# dsh-LorebookMD

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[4bc4110](https://github.com/609476965/dsh-LorebookMD/tree/4bc4110efbfb4888286b81aaf53191705dade9dd)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lorebookmd)
<!-- END META -->

> **实现功能**：将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。

> **核心亮点**：将角色卡和世界书解析接入共享预设管理，生成世界书/创作两种提示词及本地MD，减少手工迁移和重复切换；不是完整Tavern引擎或新生成模型。详见[Q02](#research-q02)。

> **风险与缺陷**：实例共享active可影响其它会话；MD编辑不回流，全文与关键词状态可分叉。固定Git缺声明的host入口，发行包内容仍需核对，未做故障复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁需要世界书导入，什么是合格创作任务？](#detail-section-11)
  - [Q02 · 导入、双预设与关键词注入怎样工作？](#detail-section-12)
  - [Q03 · 激活、文档编辑与HTTP操作有何限制？](#detail-section-13)
  - [Q04 · 安装和操作依赖什么？](#detail-section-14)
  - [Q05 · 持久化和恢复有什么工程问题？](#detail-section-15)
  - [Q06 · 成本、采用与未来设计如何判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有Tavern/SillyTavern角色卡或世界书、希望在DSH中复用设定写小说或互动推演的用户。输入是自己提供的PNG/JSON和场景要求，输出是可查看的设定文档、可激活提示词以及模型生成的正文。插件不自带小说素材，也没有独立生成模型。

合格任务不只是导入返回成功，还要核对关键人物、组织和世界规则是否完整，当前会话用了正确世界，输出没有违背设定，文风与情节能供作者继续修改。最后一项需要人工阅读或明确评审标准，第三人称和“严格参考”提示词不构成质量保证。

直接参照是手工把设定整理成Markdown并粘进系统提示词。插件减少解析角色卡、保存双模式和重复切换的操作，但没有检索数据库或自动检验小说设定一致性。多人同时使用同一个插件实例、巨大世界书或需要完全兼容SillyTavern触发语义时，应先看状态作用域、全文成本和匹配限制。

手工把世界设定整理成MD并复制到系统提示词，或在原Tavern工具中使用；双模式迁移省接线，未证明小说质量更好。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 卡片/世界书导入 | PNG/JSON迁移为提示词和MD | 不是完整Tavern语义 |
| 双模式 | 世界书对话与小说指令 | 共享active，全文注入 |
| 关键词追加 | 主keys和constant条目 | 无次级选择，可能重复全文内容 |
| 预设管理工具 | 列表、激活、停用、保存、删除、三类导入 | 同实例共享状态 |
| 设置与API | 导入、切换、打开MD和删除 | POST与大小检查不代表独立授权 |
| 文件热载入 | 外部修改presets.json生效 | 不跟踪MD及worldbooks.json |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.18与DSH profile | 包声明/运行必需 | ESM与宿主服务依赖 | 不能按独立Node应用启动 |
| tools、systemPrompt、webServer | host注入必需 | 管理、提示词和设置接口 | 关闭enableTools不取消接口依赖 |
| 浏览器slots服务 | 设置页必需 | settings.section注入 | 只有host工具不证明界面可用 |
| 可读角色卡/世界书与可写dataDir | 导入必需 | 解析与三份持久化 | 文件权限/损坏需明确处理 |
| 完整lib/index.js发行产物或构建链 | 包主入口必需 | package main/exports指向 | 固定Git树只有lib/client.js与map，无host入口 |
| 外部DSH源码路径与构建依赖 | 本地bundle需要 | tsdown配置引用相邻DSH预设 | 独立克隆不自动具备构建条件 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 读者固定包来源，备份dataDir，选非敏感小世界书 | 核对host入口真实存在及宿主接口 |
| 安装 | 按实际发行包挂载patch并重启 | 不把README预构建声明当固定Git树事实 |
| 导入 | 设置页或工具选择文件，检查双预设/文档/条目 | 条目数和关键内容一致，失败检查部分写入 |
| 激活 | 明确影响实例共享active，选择世界或创作模式 | 不同时在不同会话依赖不同世界 |
| 编辑与恢复 | 将MD视导出副本，显式重导入并检查三份状态 | 不假设编辑MD热更新；防止覆盖人工修改 |

README称发布包内置lib，本轮固定Git的lib树没有声明的lib/index.js；这支持“源码直接按包入口加载缺产物”，不支持“所有npm包不可用”。npm包内容未下载检查，也未执行构建、安装或宿主冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主与实际完整包、数据目录 | 复核入口，整理并核对导入材料 | 未测安装耗时和导入峰值 |
| 持续使用 | 每次模型请求包含全文；世界模式还可重复命中条目 | 手工检查设定一致性，协调共享active | token/价格随材料与模型变化，未测 |
| 失败恢复 | JSON/MD备份和可能重导入 | 核对内存、预设、关键词与文档是否同版本 | 多步失败可留下部分状态 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 设定迁移 | PNG/JSON解析和双预设生成 | 全部Tavern导出变体兼容 |
| 触发 | 主关键词/constant匹配并追加消息 | 次级selective等价语义与上下文净收益 |
| 创作 | 拼接小说规则与设定全文 | 小说质量、设定遵循和人工返工减少 |
| 文档 | 导入时写可打开的MD | 编辑后自动生效，源码实际不提供回流 |

> **思考**：实例共享active可影响其它会话；MD编辑不回流，全文与关键词状态可分叉。固定Git缺声明的host入口，发行包内容仍需核对，未做故障复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将角色卡和世界书解析接入共享预设管理，生成世界书/创作两种提示词及本地MD，减少手工迁移和重复切换；不是完整Tavern引擎或新生成模型。详见[Q02](#research-q02)。

将角色卡和世界书解析接入共享预设管理，生成世界书/创作两种提示词及本地MD，减少手工迁移和重复切换；不是完整Tavern引擎或新生成模型。详见[Q02](#research-q02)。

PresetRepo把纯状态逻辑和文件IO端口分开，简化复用和故障注入；保存JSON用临时文件rename，坏预设JSON尝试改名留存，watcher与防抖计时器有scope清理。这些是可借鉴的基础结构，不等于跨多文件事务或严格崩溃一致性。

use/off/upsert/remove先替换内存state再io.save，保存抛错不会回滚内存。世界书导入又顺序保存两个预设、worldbooks.json和MD，任一步失败都可能留下前半部分；删除同理。每个JSON自己的rename无法让这组文件原子提交。启动遇损坏presets.json尝试rename，备份失败被忽略后仍从空仓库启动，后续保存可能覆盖原文件；不应把注释所说避免丢失当所有IO失败下的保证。

safeFileName仅替换保留字符，两个不同名字可能映射到同一个MD文件，重导入会直接覆盖文件。世界书条目和预设独立存储又没有关联版本，人工修改或部分失败后无法仅靠ready日志确认一致。适合继续研究的工程方向是单一权威状态加可重建投影，或带版本的整组写入收据，而非只添加更多热更新watcher。

<a id="detail-section-5"></a>

### 1.4 主要限制

实例共享active可影响其它会话；MD编辑不回流，全文与关键词状态可分叉。固定Git缺声明的host入口，发行包内容仍需核对，未做故障复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续研究从完整制品清单、双会话切换、MD编辑传播和部分写入恢复入手，避免将共享提示词当会话私有设定。详见[Q06](#research-q06)。

合格任务不只是导入返回成功，还要核对关键人物、组织和世界规则是否完整，当前会话用了正确世界，输出没有违背设定，文风与情节能供作者继续修改。最后一项需要人工阅读或明确评审标准，第三人称和“严格参考”提示词不构成质量保证。

直接参照是手工把设定整理成Markdown并粘进系统提示词。插件减少解析角色卡、保存双模式和重复切换的操作，但没有检索数据库或自动检验小说设定一致性。多人同时使用同一个插件实例、巨大世界书或需要完全兼容SillyTavern触发语义时，应先看状态作用域、全文成本和匹配限制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持格式迁移和双模式接线；共享active、派生文档不回流及固定Git缺host入口限制采用；未来设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、tsdown.config.ts、cordis.patch.yml、src/index.ts、src/tavern.ts、src/preset-repo.ts、src/client/index.ts、src/client/presets-api.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查角色卡/世界书解析、提示词与触发、管理路由、预设持久化和构建入口；不运行目标，不下载验证npm制品，不作完整Tavern兼容审计。
- 下一步：进一步探讨可用双会话与一个小世界书检查active作用域、MD编辑后的真实提示词和失败时三份状态；再做同模型场景的token/设定遵循对照。

**分析版本**

- **仓库**：[609476965/dsh-LorebookMD](https://github.com/609476965/dsh-LorebookMD)
- **版本号**：1.0.0（[固定提交 4bc4110](https://github.com/609476965/dsh-LorebookMD/tree/4bc4110efbfb4888286b81aaf53191705dade9dd)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索按会话绑定的版本化权威文档与预算注入收据，比较串用、遗漏、token和编辑传播；未实现。详见[Q06](#research-q06)。

进一步探讨可用双会话与一个小世界书检查active作用域、MD编辑后的真实提示词和失败时三份状态；再做同模型场景的token/设定遵循对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 174 | 139 | 25 | — |
| .js | source | 1 | 360 | 338 | 54 | — |
| .md | source | 1 | 74 | — | — | 1006 |
| .ts | source | 6 | 1653 | 1353 | 178 | — |
| .tsx | source | 1 | 196 | 172 | 9 | — |
| .ts | test | 5 | 1216 | 1018 | 74 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/609476965/dsh-LorebookMD/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/609476965/dsh-LorebookMD/issues?q=is%3Aissue+created%3A2026-09-22T05%3A13%3A37.051Z..2026-10-22T05%3A13%3A37.051Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/609476965/dsh-LorebookMD/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A13%3A37.051Z..2026-10-22T05%3A13%3A37.051Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本世界书迁移与创作接线的贡献，并核查共享状态、文档一致性与发行入口。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要世界书导入，什么是合格创作任务？

**研究主题**：场景与需求

#### 完整回答

面向已有Tavern/SillyTavern角色卡或世界书、希望在DSH中复用设定写小说或互动推演的用户。输入是自己提供的PNG/JSON和场景要求，输出是可查看的设定文档、可激活提示词以及模型生成的正文。插件不自带小说素材，也没有独立生成模型。

合格任务不只是导入返回成功，还要核对关键人物、组织和世界规则是否完整，当前会话用了正确世界，输出没有违背设定，文风与情节能供作者继续修改。最后一项需要人工阅读或明确评审标准，第三人称和“严格参考”提示词不构成质量保证。

直接参照是手工把设定整理成Markdown并粘进系统提示词。插件减少解析角色卡、保存双模式和重复切换的操作，但没有检索数据库或自动检验小说设定一致性。多人同时使用同一个插件实例、巨大世界书或需要完全兼容SillyTavern触发语义时，应先看状态作用域、全文成本和匹配限制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-25](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/README.md#L3-L25)

作者定义世界书导入、两种模式与产物。

<details>
<summary>查看原文（23行）</summary>

```text
一个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的插件：导入酒馆（SillyTavern/TavernAI）角色卡与世界书，落地为**本地 Markdown 设定文档**，激活创作模式后**根据用户输入、参考世界书创作小说**。

> 说明：本插件只管理你自己提供的设定文本；工程内不内置任何"破限/越狱"提示词内容。

## 功能

- **导入**：角色卡（PNG 内嵌 / JSON）与独立世界书（`{ entries: [...] }`），兼容 `extensions.world`、SillyTavern `character_book`（角色书）与常见导出变体
- **落地本地**：每本世界书生成三件产物——
  - `名·世界书` 预设：设定全文 + **关键词自动触发**（对话中按触发词注入对应条目）
  - `名·创作` 预设：**创作模式**（创作指令 + 设定全文，激活后输入场景即生成小说正文）
  - `worldbooks/<名>.md`：本地 Markdown 设定文档，可手工编辑
- **设置页**（设置 →「世界书创作」）：世界书列表 / 进入创作 / 世界书模式 / **编辑文档**（系统默认程序打开本地 .md）/ 导入 / 删除
- **对话工具**：`prompt_import_tavern` / `prompt_import_world` 等与设置页共享同一份数据

### 两种模式怎么用

| | 进入创作（激活「·创作」） | 世界书模式（激活「·世界书」） |
| --- | --- | --- |
| **输出形态** | **小说正文**：第三人称连贯叙述，细节符合设定风格，直接输出正文、不复述设定 | **对话/角色扮演回应**：以世界内角色身份与你互动、推进剧情 |
| **设定使用** | 全文注入，模型自觉参考 | 全文注入 + **关键词自动触发**：提到触发词时对应条目当场注入 |
| **交互方式** | 你给场景/情节/人物，模型创作；继续给 → 续写 | 你以第一人称参与，模型以角色回应 |
| **典型指令** | "写一段……"、"描写……的过程" | "我是……，然后呢？"、"把名单给我看看" |
| **适合** | 写小说、场景描写、剧情创作 | 沉浸式角色扮演、互动推演 |
```

</details>

**依据 2 · 源码核查**：[src/tavern.ts:245-260](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts#L245-L260)

创作能力实质为拼接指令与完整世界文档。

<details>
<summary>查看原文（16行）</summary>

```text
export function composeWritingContent(worldDocument: string, ownerName: string): string {
  return [
    '[创作模式]',
    `你是小说创作助手，正基于世界设定《${ownerName}》进行创作。`,
    '规则：',
    '1. 严格参考下文世界设定：其中的规则、组织、人物关系与世界观必须被尊重，不得擅自违背或新增；',
    '2. 根据用户给出的输入（场景、情节、人物、事件），创作连贯、生动的小说正文，而不是对话式回复；',
    '3. 采用第三人称叙述，细节描写符合设定的风格基调；',
    '4. 设定条目带有触发词的，仅在与创作内容相关时参考对应条目；',
    '5. 直接输出正文：不要复述设定，不要解释创作过程，不要询问确认。',
    '',
    '—— 以下为世界设定全文 ——',
    '',
    worldDocument,
  ].join('\n')
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 导入、双预设与关键词注入怎样工作？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

角色卡导入按PNG签名选择chara tEXt块或直接JSON解析，独立世界书支持entries数组/对象。字段筛选后按insertion_order排序。导入一本世界书会先建立“名·世界书”完整设定提示词，再建立“名·创作”指令加完整设定，持久化worldbooks映射，最后写Markdown。设置页与八个模型工具操作同一PresetRepo，激活预设通过systemPrompt.section的求值函数在之后组装提示词时读取。

关键词触发是额外注入，不是只把命中内容送给模型。世界书预设已经包含全部启用条目，pre-step又从messages中所有source.kind=user文本拼接查词，把命中条目追加为plugin来源的user消息。源码没有把它裁成仅最后一条用户消息，也没有token预算或命中数截断。因此不能将它宣传为检索节省上下文，长历史也可能持续命中旧词。

selective和secondary_keys会保存，但matchWorldEntry只检查enabled、constant、主keys，不应用次级选择条件。正则脚本导入明确只是文本参考，DSH没有等价聊天正则执行管线。未知模板变量清空，user/char被替换，这也不是完整酒馆模板解释器。贡献在格式迁移、双使用模式和宿主接线，而不是原创RAG或完全兼容酒馆。

#### 证据与依据

**依据 1 · 源码核查**：[src/tavern.ts:80-109](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts#L80-L109)

PNG/JSON与独立世界书输入分支。

<details>
<summary>查看原文（30行）</summary>

```text
export function isPng(buffer: Buffer): boolean {
  return buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG_SIGNATURE)
}

/** 解析角色卡文件内容（PNG 或 JSON），含内置世界书与正则。 */
export function parseTavernFile(buffer: Buffer): TavernParseResult {
  if (isPng(buffer)) {
    const text = readPngCharaText(buffer)
    if (text === undefined) {
      throw new Error('PNG 中找不到角色卡数据（无 keyword 为 "chara" 的 tEXt chunk）')
    }
    return { kind: 'png-embed', ...parseCharaJson(text) }
  }
  const raw = buffer.toString('utf8').trim()
  if (raw === '') throw new Error('文件为空')
  return { kind: 'json', ...parseCharaJson(raw) }
}

/** 解析独立世界书 JSON 文本：顶层 `{ entries: [...] }`（兼容 `{ entries: { key: … } }` 与纯数组）。 */
export function parseWorldInfoJson(text: string): WorldInfo {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch (error) {
    throw new Error(`无法解析世界书 JSON：${String(error)}`)
  }
  if (Array.isArray(json)) return parseWorldObject({ entries: json })
  return parseWorldObject(json)
}

```

</details>

**依据 2 · 源码核查**：[src/index.ts:726-753](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L726-L753)

双预设、worldbooks与Markdown顺序写入。

<details>
<summary>查看原文（28行）</summary>

```text
): { worldPreset: string; writingPreset: string; documentPath: string } | undefined {
  if (world === undefined || world.entries.length === 0) return undefined

  const worldName = worldPresetName(ownerName)
  const worldDoc = composeWorldDocument(world, ownerName)
  const worldResult = repo.upsert({
    name: worldName,
    content: composeWorldContent(world, ownerName),
    description: `Imported world info (${world.entries.length} entries${world.name !== undefined ? `, "${world.name}"` : ''}); activating it enables keyword-triggered injection`,
  })
  if (!worldResult.ok) throw new Error(worldResult.message)

  const writingName = writingPresetName(ownerName)
  const writingResult = repo.upsert({
    name: writingName,
    content: composeWritingContent(worldDoc, ownerName),
    description: `创作模式：参考《${ownerName}》世界设定创作小说；激活后输入场景即可`,
  })
  if (!writingResult.ok) throw new Error(writingResult.message)

  worldbooks.set(worldName, world)
  saveWorldbooks(worldbooksFile, worldbooks)
  const documentPath = writeWorldDocument(dataDir, ownerName, worldDoc)
  return { worldPreset: worldName, writingPreset: writingName, documentPath }
}

/** 文件名安全化：把路径保留字符替换为下划线。 */
function safeFileName(name: string): string {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:800-824](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L800-L824)

遍历所有user来源文本并额外注入命中条目。

<details>
<summary>查看原文（25行）</summary>

```text
function registerWorldTrigger(ctx: Context, repo: PresetRepo, worldbooks: Map<string, WorldInfo>): void {
  ctx.on('agent/pre-step', async ({ messages }, next): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    const active = repo.active
    if (active === null) return decision
    const world = worldbooks.get(active)
    if (world === undefined) return decision
    const userText = messages
      .filter(message => message.source.kind === 'user')
      .flatMap(message => message.content
        .filter(block => block.type === 'text')
        .map(block => block.text))
      .join('\n')
    const matched = world.entries.filter(entry => matchWorldEntry(entry, userText))
    if (matched.length === 0) return decision
    const injected = matched.map(entry => createUserMessage({
      content: [{ type: 'text', text: renderWorldEntry(entry) }],
      source: { kind: 'plugin', plugin: name, form: 'instructions' },
    }))
    return { kind: 'enter', messages: [...decision.messages, ...injected] }
  })
}

/**
```

</details>

**依据 4 · 源码核查**：[src/tavern.ts:157-181](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts#L157-L181)

全文注入与正则仅文本参考。

<details>
<summary>查看原文（25行）</summary>

```text
/** 世界书 → 组合预设正文（带触发词说明；constant 条目标 [始终生效]）。 */
export function composeWorldContent(world: WorldInfo, ownerName: string): string {
  const lines = [
    `[World Info: ${ownerName}]`,
    '以下为世界设定条目。仅当对话内容涉及条目的触发词时，才应用该条目的设定；标注 [始终生效] 的条目不受触发词限制，始终有效。',
  ]
  for (const entry of world.entries) {
    if (entry.enabled === false) continue
    const tags: string[] = []
    if (entry.constant === true) tags.push('始终生效')
    if (entry.selective === true) tags.push('选择性')
    const keys = entry.keys
    const heading = `### ${keys[0] ?? '(无触发词)'}${keys.length > 1 ? `（触发词：${keys.join('、')}）` : ''}${tags.length > 0 ? ` [${tags.join('/')}]` : ''}`
    lines.push('', heading)
    if (entry.comment !== undefined && entry.comment !== '') lines.push(`（${entry.comment}）`)
    lines.push(entry.content === '' ? '（条目无正文）' : entry.content)
  }
  return lines.join('\n')
}

/** 正则脚本 → 组合预设正文（定义说明；DSH 无聊天正则渲染管线）。 */
export function composeRegexContent(scripts: RegexScript[], ownerName: string): string {
  const lines = [
    `[Regex Scripts: ${ownerName}]`,
    '以下为 SillyTavern 正则脚本定义。DSH 没有聊天正则渲染管线，这些定义仅供查看与参考：如需对消息做等价清理/替换，请按定义的 pattern 手动执行。',
```

</details>

**依据 5 · 源码核查**：[src/tavern.ts:263-268](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts#L263-L268)

匹配未应用selective/secondaryKeys。

```text
export function matchWorldEntry(entry: WorldEntry, text: string): boolean {
  if (entry.enabled === false) return false
  if (entry.constant === true) return true
  if (entry.keys.length === 0) return false
  return entry.keys.some(key => keyMatches(key, text, entry))
}
```

**依据 6 · 源码核查**：[src/tavern.ts:477-494](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts#L477-L494)

次级键与selective确被解析保存。

<details>
<summary>查看原文（18行）</summary>

```text

function pickWorldEntry(raw: Record<string, unknown>): WorldEntry | undefined {
  const keys = stringArray(raw.keys)
  const content = typeof raw.content === 'string' ? raw.content : ''
  if (keys.length === 0 && content === '') return undefined
  const entry: WorldEntry = { keys, content }
  const secondaryKeys = stringArray(raw.secondary_keys)
  if (secondaryKeys.length > 0) entry.secondaryKeys = secondaryKeys
  if (typeof raw.comment === 'string' && raw.comment !== '') entry.comment = raw.comment
  if (raw.constant === true) entry.constant = true
  if (raw.selective === true) entry.selective = true
  if (raw.enabled === false) entry.enabled = false
  if (raw.case_sensitive === true) entry.caseSensitive = true
  if (raw.match_whole_words === true) entry.matchWholeWords = true
  if (raw.use_regex === true) entry.useRegex = true
  if (typeof raw.insertion_order === 'number') entry.order = raw.insertion_order
  return entry
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 激活、文档编辑与HTTP操作有何限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

active属于插件实例共享的PresetRepo.state，不带session/agent索引。systemPrompt.section和pre-step都读取同一active；模型工具use/off也直接改它。因此同实例中一个会话切换世界可影响其它会话之后的提示词，不能把界面中的“进入创作”理解成仅当前会话私有。导入设定来自外部用户文件，正文直接进入系统提示词和plugin指令消息，变量替换不是指令可信度校验。

Markdown是导入时生成的派生副本。系统提示词读取presets.json的content，触发器读取启动时载入的worldbooks Map；watch只响应presets.json，不读取Markdown，也不reload worldbooks.json。设置页“编辑文档”只是用系统默认程序打开文件。修改.md不会自动更新当前设定，直接编辑预设正文又不会同步关键词条目，会出现两套不同内容。不能以“可编辑文档”推断编辑即生效。

HTTP处理器检查POST及10MiB正文上限，但所读代码没有Origin、身份或逐操作授权检查，且enableTools关闭只取消模型工具，路由仍注册。它可按宿主权限读取导入路径、保存/删除共享预设和打开文档；上层webServer可能有访问控制，本轮没有检查对应宿主部署，不能声称已证明远程越权。即使单用户，也应避免把敏感设定当纯本地无外发内容，因为激活后会进入模型请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/preset-repo.ts:32-68](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/preset-repo.ts#L32-L68)

active是实例单一状态，use/off无会话键。

<details>
<summary>查看原文（37行）</summary>

```text
export class PresetRepo {
  private readonly io: PresetIo
  private state: PresetFile

  constructor(io: PresetIo) {
    this.io = io
    this.state = sanitize(this.io.load())
  }

  get active(): string | null {
    return this.state.active
  }

  /** 快照视图（只读）。 */
  list(): { active: string | null; presets: readonly Preset[] } {
    return { active: this.state.active, presets: this.state.presets }
  }

  /** 当前激活预设的正文；未激活或名字失效时返回 undefined。 */
  contentOf(name: string): string | undefined {
    return this.state.presets.find(p => p.name === name)?.content
  }

  /** 激活一个已存在的预设。 */
  use(name: string): RepoResult {
    if (!this.state.presets.some(p => p.name === name)) {
      return { ok: false, message: `preset "${name}" does not exist` }
    }
    this.state = { ...this.state, active: name }
    this.commit()
    return { ok: true }
  }

  /** 取消激活（系统提示词恢复原样）。 */
  off(): void {
    this.state = { ...this.state, active: null }
    this.commit()
```

</details>

**依据 2 · 源码核查**：[src/index.ts:80-114](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L80-L114)

section读取共享内容，watch仅presets.json。

<details>
<summary>查看原文（35行）</summary>

```text
  ctx.systemPrompt.section({
    name: config.sectionName,
    order: config.sectionOrder,
    text: () => {
      const active = repo.active
      if (active === null) return ''
      const content = repo.contentOf(active)
      return content === undefined ? '' : sanitizePromptVariables(content, active)
    },
  })

  // 1b) 世界书关键词自动触发：激活的预设是世界书时，把触发词命中的条目注入本轮
  if (config.worldTrigger) {
    registerWorldTrigger(ctx, repo, worldbooks)
  }

  // 2) 管理工具（对话中随时切换与修改）
  if (config.enableTools) {
    registerTools(ctx, repo, worldbooks, worldbooksFile, dataDir)
  }

  // 2b) 浏览器设置页的数据通道：/prompt-manager/api（JSON RPC，同源 fetch）
  registerApiRoute(ctx, repo, worldbooks, worldbooksFile, dataDir)

  // 3) 数据文件热载入：直接改 JSON 文件，防抖后自动 reload
  if (config.watchFile) {
    let debounce: ReturnType<typeof setTimeout> | undefined
    const watcher = watch(dataDir, { persistent: false }, (_event, filename) => {
      if (filename !== basename(dataFile)) return
      if (debounce !== undefined) clearTimeout(debounce)
      debounce = setTimeout(() => {
        repo.reload()
        ctx.emit('system-prompt/change')
        console.log(`[prompt-manager] ${basename(dataFile)} changed on disk; reloaded`)
      }, 200)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:407-426](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L407-L426)

HTTP只有POST及读取正文的局部校验。

<details>
<summary>查看原文（20行）</summary>

```text
  dataDir: string,
): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: API_PATH,
    handler: async (req, res) => {
      try {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: 'method not allowed' })
          return
        }
        const body = await readJsonBody(req, MAX_API_BODY_BYTES)
        sendJson(res, 200, handleApiOp(ctx, repo, worldbooks, worldbooksFile, dataDir, body))
      } catch (error) {
        sendJson(res, 400, { ok: false, error: (error as Error).message })
      }
    },
  }), 'prompt-manager: api route')
}

```

</details>

**依据 4 · 源码核查**：[src/index.ts:589-607](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L589-L607)

打开MD和删除组操作不包含MD回流。

<details>
<summary>查看原文（19行）</summary>

```text
      const writingResult = repo.remove(writingPresetName(name))
      if (!writingResult.ok) return { ok: false, error: writingResult.message }
      try {
        rmSync(join(dataDir, 'worldbooks', `${safeFileName(name)}.md`), { force: true })
      } catch {
        // 文档不存在也视为成功
      }
      ctx.emit('system-prompt/change')
      return { ok: true, data: {} }
    }
    case 'openDocument': {
      // 用系统默认方式打开世界书本地设定文档（供编辑）
      const name = requireString(body, 'name')
      const filePath = join(dataDir, 'worldbooks', `${safeFileName(name)}.md`)
      if (!existsSync(filePath)) return { ok: false, error: `document not found: ${filePath}` }
      try {
        openInSystem(filePath)
      } catch (error) {
        // 打开动作尽力而为：spawn 失败（如无关联程序/受限环境）不使 API 报错
```

</details>

**依据 5 · 源码核查**：[src/index.ts:835-844](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L835-L844)

变量清理仅做占位替换。

<details>
<summary>查看原文（10行）</summary>

```text
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, rawName: string) => {
    const name = rawName.trim()
    if (DSH_PROMPT_VARIABLES.has(name)) return match
    if (name === 'user') return '用户'
    if (name === 'char') return charName ?? match
    return ''
  })
}

const DSH_PROMPT_VARIABLES = new Set(['provider', 'model', 'cwd'])
```

</details>

#### 缺口

- 上层webServer的身份/来源控制在本插件源码里不可确认。
  **影响**：局部缺少鉴权不等于已经验证远程可达越权，但不能宣称此路由自己形成授权边界。
  **进一步探讨**：继续探讨可先沿固定宿主webServer注册链确认认证与CSRF策略，再决定部署可访问范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装和操作依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.18与DSH profile | 包声明/运行必需 | ESM与宿主服务依赖 | 不能按独立Node应用启动 |
| tools、systemPrompt、webServer | host注入必需 | 管理、提示词和设置接口 | 关闭enableTools不取消接口依赖 |
| 浏览器slots服务 | 设置页必需 | settings.section注入 | 只有host工具不证明界面可用 |
| 可读角色卡/世界书与可写dataDir | 导入必需 | 解析与三份持久化 | 文件权限/损坏需明确处理 |
| 完整lib/index.js发行产物或构建链 | 包主入口必需 | package main/exports指向 | 固定Git树只有lib/client.js与map，无host入口 |
| 外部DSH源码路径与构建依赖 | 本地bundle需要 | tsdown配置引用相邻DSH预设 | 独立克隆不自动具备构建条件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 读者固定包来源，备份dataDir，选非敏感小世界书 | 核对host入口真实存在及宿主接口 |
| 安装 | 按实际发行包挂载patch并重启 | 不把README预构建声明当固定Git树事实 |
| 导入 | 设置页或工具选择文件，检查双预设/文档/条目 | 条目数和关键内容一致，失败检查部分写入 |
| 激活 | 明确影响实例共享active，选择世界或创作模式 | 不同时在不同会话依赖不同世界 |
| 编辑与恢复 | 将MD视导出副本，显式重导入并检查三份状态 | 不假设编辑MD热更新；防止覆盖人工修改 |

README称发布包内置lib，本轮固定Git的lib树没有声明的lib/index.js；这支持“源码直接按包入口加载缺产物”，不支持“所有npm包不可用”。npm包内容未下载检查，也未执行构建、安装或宿主冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-44](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/package.json#L18-L44)

入口、files、Node和client条件。

<details>
<summary>查看原文（27行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml"
  ],
  "engines": {
    "node": ">=22.18"
  },
  "scripts": {
    "bundle": "node ./.dsh-tools/tsdown/run.mjs",
    "typecheck": "node node_modules/typescript/bin/tsc --noEmit",
    "test": "node --test tests/"
  },
  "dsh": {
    "client": {
      "inject": [
        "slots"
      ],
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[tsdown.config.ts:1-25](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/tsdown.config.ts#L1-L25)

host入口构建与外部相邻DSH源码依赖。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * tsdown 构建配置：复用 DSH 仓库的 clientBundle 预设（packages/client/tsdown.client.ts）。
 *
 * 产出：
 * - lib/index.js   —— host 半（node），本工程直接以 src 运行，此产物仅作发布备选
 * - lib/client.js  —— 浏览器半 bundle（closure factory，external 走平台模块表），
 *                     由 dsh-client-modules 经 exports["./client"] 供给到 /plugins/dsh-lorebookmd/client.js
 */
import { clientBundle } from '../../deepseek-harness/packages/client/tsdown.client.ts'

// node 半运行时依赖：全部由 DSH profile 运行时提供，必须 external，
// 避免打包进 lib/index.js 造成重复实例（Service/Context instanceof 冲突）。
const HOST_EXTERNALS = [
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-agent',
  '@deepseek-ai/dsh-home-paths',
  '@deepseek-ai/dsh-host-webserver',
  '@deepseek-ai/dsh-llm',
  '@deepseek-ai/dsh-tools',
  '@deepseek-ai/schemastery',
]

export default clientBundle('dsh-lorebookmd', ['src/index.ts'], {
  lib: { external: HOST_EXTERNALS },
})
```

</details>

**依据 3 · 作者声明**：[README.md:37-57](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/README.md#L37-L57)

预构建与安装是作者声明。

<details>
<summary>查看原文（21行）</summary>

````text
### 从 npm 安装（推荐）

```powershell
dsh plugin --profile web add dsh-lorebookmd
```

发布包已内置构建产物（`lib/`）；`dsh plugin` 会自动把本包加入 `dsh.profile.bundles` 并应用 `cordis.patch.yml`，之后用 `start-dsh.cmd` 正常启动即可，无需 `--patch`。

> 本地试装（未发布时）：`npm pack` 生成 `dsh-lorebookmd-1.0.0.tgz`，然后 `dsh plugin --profile web add ./dsh-lorebookmd-1.0.0.tgz`。

### 手动安装

1. **一键安装**：双击 `install.cmd`（或 `powershell -ExecutionPolicy Bypass -File install.ps1`）。脚本把插件复制到 DSH profile 的 `node_modules`（发布包已内置构建产物，无需本地构建环境）。

2. **挂载**（二选一）：
   - **自动挂载（推荐）**：把 `dsh-lorebookmd` 追加到 `~\.dsh\profiles\web\package.json` 的 `dsh.profile.bundles` 数组，之后用 `start-dsh.cmd` 正常启动即可（DSH 会自动应用插件的 `cordis.patch.yml`，无需 `--patch`）
   - **临时挂载**：双击 `start-dsh-plugin.cmd`（以 `--patch` 加载 `cordis.yml`）

> 以上挂载方式任选其一，勿同时使用（会重复挂载）。打开 `http://127.0.0.1:3080`：设置 →「世界书创作」即可使用；终端应打印 `[prompt-manager] ready: …`。

> 安装原理：正常安装 = 把插件包放进 DSH profile 的 `node_modules`。插件源码的 `@deepseek-ai/*` 依赖由 profile 运行时直接解析（DSH 自带完整运行时包），无需额外依赖链。更新插件：升级安装新版本后重启 DSH 即可。
````

</details>

**依据 4 · 源码核查**：[src/index.ts:40-42](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L40-L42)

必需host注入服务。

```text

export const name = 'prompt-manager'
export const inject = ['tools', 'systemPrompt', 'webServer']
```

**依据 5 · 源码核查**：[src/client/index.ts:17-27](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/client/index.ts#L17-L27)

client的slots注册。

<details>
<summary>查看原文（11行）</summary>

```text

export const name = 'prompt-manager-client'
export const inject = ['slots']

export function apply(ctx: ClientContext): void {
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'prompt-presets',
    order: 25,
    label: () => '世界书创作',
  }, PresetsSection))
```

</details>

#### 缺口

- 固定版本对应npm制品是否包含lib/index.js未检查。
  **影响**：不能把Git树缺产物推广成已验证发行包损坏。
  **进一步探讨**：可从固定版本tarball文件清单及完整性入手，核对main和external依赖，不必先安装执行。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久化和恢复有什么工程问题？

**研究主题**：工程质量与复用

#### 完整回答

PresetRepo把纯状态逻辑和文件IO端口分开，简化复用和故障注入；保存JSON用临时文件rename，坏预设JSON尝试改名留存，watcher与防抖计时器有scope清理。这些是可借鉴的基础结构，不等于跨多文件事务或严格崩溃一致性。

use/off/upsert/remove先替换内存state再io.save，保存抛错不会回滚内存。世界书导入又顺序保存两个预设、worldbooks.json和MD，任一步失败都可能留下前半部分；删除同理。每个JSON自己的rename无法让这组文件原子提交。启动遇损坏presets.json尝试rename，备份失败被忽略后仍从空仓库启动，后续保存可能覆盖原文件；不应把注释所说避免丢失当所有IO失败下的保证。

safeFileName仅替换保留字符，两个不同名字可能映射到同一个MD文件，重导入会直接覆盖文件。世界书条目和预设独立存储又没有关联版本，人工修改或部分失败后无法仅靠ready日志确认一致。适合继续研究的工程方向是单一权威状态加可重建投影，或带版本的整组写入收据，而非只添加更多热更新watcher。

#### 证据与依据

**依据 1 · 源码核查**：[src/preset-repo.ts:22-38](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/preset-repo.ts#L22-L38)

IO端口与纯状态分层。

<details>
<summary>查看原文（17行）</summary>

```text
/** 仓库的持久化端口：插件注入文件实现，测试注入内存实现。 */
export interface PresetIo {
  load(): PresetFile
  save(file: PresetFile): void
}

export type RepoResult =
  | { ok: true; created?: boolean }
  | { ok: false; message: string }

export class PresetRepo {
  private readonly io: PresetIo
  private state: PresetFile

  constructor(io: PresetIo) {
    this.io = io
    this.state = sanitize(this.io.load())
```

</details>

**依据 2 · 源码核查**：[src/preset-repo.ts:72-108](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/preset-repo.ts#L72-L108)

内存先变更再保存，无回滚。

<details>
<summary>查看原文（37行）</summary>

```text
  upsert(input: { name: string; content: string; description?: string }): RepoResult {
    const name = input.name.trim()
    if (name === '') return { ok: false, message: 'preset name must not be empty' }
    if (input.content.trim() === '') return { ok: false, message: 'preset content must not be empty' }
    const existing = this.state.presets.find(p => p.name === name)
    const presets = existing === undefined
      ? [...this.state.presets, { name, content: input.content, description: input.description }]
      : this.state.presets.map(p => p.name === name
        ? { name, content: input.content, description: input.description ?? p.description }
        : p)
    this.state = { ...this.state, presets }
    this.commit()
    return { ok: true, created: existing === undefined }
  }

  /** 删除预设；若删除的是激活项则同时取消激活。 */
  remove(name: string): RepoResult {
    if (!this.state.presets.some(p => p.name === name)) {
      return { ok: false, message: `preset "${name}" does not exist` }
    }
    const presets = this.state.presets.filter(p => p.name !== name)
    this.state = {
      ...this.state,
      presets,
      active: this.state.active === name ? null : this.state.active,
    }
    this.commit()
    return { ok: true }
  }

  /** 外部修改数据文件后重新载入（热更新）。 */
  reload(): void {
    this.state = sanitize(this.io.load())
  }

  private commit(): void {
    this.io.save(this.state)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:367-391](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L367-L391)

坏JSON备份失败忽略，单文件tmp/rename。

<details>
<summary>查看原文（25行）</summary>

```text
function createFileIo(dataFile: string): PresetIo {
  return {
    load(): PresetFile {
      try {
        return JSON.parse(readFileSync(dataFile, 'utf8')) as PresetFile
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code
        if (code === 'ENOENT') return { active: null, presets: [] }
        // JSON 损坏：备份原文件再以空库启动，避免后续保存覆盖用户数据
        try {
          renameSync(dataFile, `${dataFile}.broken-${Date.now()}`)
        } catch {
          // 备份失败也不阻塞启动
        }
        console.warn(`[prompt-manager] invalid JSON in ${dataFile}; moved to *.broken-* and started empty`)
        return { active: null, presets: [] }
      }
    },
    save(file: PresetFile): void {
      mkdirSync(dirname(dataFile), { recursive: true })
      const tmp = `${dataFile}.${process.pid}.tmp`
      writeFileSync(tmp, `${JSON.stringify(file, null, 2)}\n`, 'utf8')
      renameSync(tmp, dataFile)
    },
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:726-770](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L726-L770)

多步保存和安全化文件名/直接MD写入。

<details>
<summary>查看原文（45行）</summary>

```text
): { worldPreset: string; writingPreset: string; documentPath: string } | undefined {
  if (world === undefined || world.entries.length === 0) return undefined

  const worldName = worldPresetName(ownerName)
  const worldDoc = composeWorldDocument(world, ownerName)
  const worldResult = repo.upsert({
    name: worldName,
    content: composeWorldContent(world, ownerName),
    description: `Imported world info (${world.entries.length} entries${world.name !== undefined ? `, "${world.name}"` : ''}); activating it enables keyword-triggered injection`,
  })
  if (!worldResult.ok) throw new Error(worldResult.message)

  const writingName = writingPresetName(ownerName)
  const writingResult = repo.upsert({
    name: writingName,
    content: composeWritingContent(worldDoc, ownerName),
    description: `创作模式：参考《${ownerName}》世界设定创作小说；激活后输入场景即可`,
  })
  if (!writingResult.ok) throw new Error(writingResult.message)

  worldbooks.set(worldName, world)
  saveWorldbooks(worldbooksFile, worldbooks)
  const documentPath = writeWorldDocument(dataDir, ownerName, worldDoc)
  return { worldPreset: worldName, writingPreset: writingName, documentPath }
}

/** 文件名安全化：把路径保留字符替换为下划线。 */
function safeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_')
}

/** 把世界书设定文档写到 dataDir/worldbooks/<ownerName>.md，返回文件路径。 */
function writeWorldDocument(dataDir: string, ownerName: string, document: string): string {
  const dir = join(dataDir, 'worldbooks')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, `${safeFileName(ownerName)}.md`)
  writeFileSync(file, document, 'utf8')
  return file
}

/** 把正则脚本导入为 `<ownerName>·正则` 预设。@returns 生成的预设名；无脚本时返回 undefined。 */
function importRegexPreset(
  repo: PresetRepo,
  scripts: ReturnType<typeof parseRegexScriptsJson> | undefined,
  ownerName: string,
```

</details>

**依据 5 · 源码核查**：[src/index.ts:105-121](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L105-L121)

watcher与定时器scope清理。

<details>
<summary>查看原文（17行）</summary>

```text
  if (config.watchFile) {
    let debounce: ReturnType<typeof setTimeout> | undefined
    const watcher = watch(dataDir, { persistent: false }, (_event, filename) => {
      if (filename !== basename(dataFile)) return
      if (debounce !== undefined) clearTimeout(debounce)
      debounce = setTimeout(() => {
        repo.reload()
        ctx.emit('system-prompt/change')
        console.log(`[prompt-manager] ${basename(dataFile)} changed on disk; reloaded`)
      }, 200)
    })
    ctx.effect(() => {
      return () => {
        if (debounce !== undefined) clearTimeout(debounce)
        watcher.close()
      }
    })
```

</details>

#### 缺口

- 不同IO失败点的实际磁盘/内存偏离与恢复行为未复现。
  **影响**：仅能指出非事务控制流，不能量化损坏概率或断言已发生数据丢失。
  **进一步探讨**：可用临时数据目录对保存/rename/MD写入分别注入失败，检查重启后组状态和原文件保全。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用与未来设计如何判断？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主与实际完整包、数据目录 | 复核入口，整理并核对导入材料 | 未测安装耗时和导入峰值 |
| 持续使用 | 每次模型请求包含全文；世界模式还可重复命中条目 | 手工检查设定一致性，协调共享active | token/价格随材料与模型变化，未测 |
| 失败恢复 | JSON/MD备份和可能重导入 | 核对内存、预设、关键词与文档是否同版本 | 多步失败可留下部分状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 设定迁移 | PNG/JSON解析和双预设生成 | 全部Tavern导出变体兼容 |
| 触发 | 主关键词/constant匹配并追加消息 | 次级selective等价语义与上下文净收益 |
| 创作 | 拼接小说规则与设定全文 | 小说质量、设定遵循和人工返工减少 |
| 文档 | 导入时写可打开的MD | 编辑后自动生效，源码实际不提供回流 |

建议观察。用户任务明确，双模式迁移有实用价值，但固定Git缺host入口、共享active、MD与触发状态分叉直接影响可用性和理解，不宜凭README推荐默认启用。后续可从完整制品清单、两个会话切世界以及MD修改后的实际提示词差异开始阅读或验证；涉及敏感或长期积累设定先保留独立备份。

未验证假设是把世界书变成按会话绑定的版本化权威文档，仅按预算选择条目并输出引用/省略收据，再从同一版本派生MD和提示词。相较当前全文加命中重复注入，可能减轻上下文成本和跨会话串用，但可能遗漏伏笔、破坏跨条目关联。最小对照应固定同一世界、模型、双会话与场景，比较设定错误、正文人工盲评、输入token和编辑回流一致性；若省token却增加关键设定遗漏，则不成立。当前未实现，不计既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/tavern.ts:157-173](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts#L157-L173)

世界预设包含全部启用内容。

<details>
<summary>查看原文（17行）</summary>

```text
/** 世界书 → 组合预设正文（带触发词说明；constant 条目标 [始终生效]）。 */
export function composeWorldContent(world: WorldInfo, ownerName: string): string {
  const lines = [
    `[World Info: ${ownerName}]`,
    '以下为世界设定条目。仅当对话内容涉及条目的触发词时，才应用该条目的设定；标注 [始终生效] 的条目不受触发词限制，始终有效。',
  ]
  for (const entry of world.entries) {
    if (entry.enabled === false) continue
    const tags: string[] = []
    if (entry.constant === true) tags.push('始终生效')
    if (entry.selective === true) tags.push('选择性')
    const keys = entry.keys
    const heading = `### ${keys[0] ?? '(无触发词)'}${keys.length > 1 ? `（触发词：${keys.join('、')}）` : ''}${tags.length > 0 ? ` [${tags.join('/')}]` : ''}`
    lines.push('', heading)
    if (entry.comment !== undefined && entry.comment !== '') lines.push(`（${entry.comment}）`)
    lines.push(entry.content === '' ? '（条目无正文）' : entry.content)
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:800-824](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L800-L824)

额外关键词注入，未见预算/去重。

<details>
<summary>查看原文（25行）</summary>

```text
function registerWorldTrigger(ctx: Context, repo: PresetRepo, worldbooks: Map<string, WorldInfo>): void {
  ctx.on('agent/pre-step', async ({ messages }, next): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    const active = repo.active
    if (active === null) return decision
    const world = worldbooks.get(active)
    if (world === undefined) return decision
    const userText = messages
      .filter(message => message.source.kind === 'user')
      .flatMap(message => message.content
        .filter(block => block.type === 'text')
        .map(block => block.text))
      .join('\n')
    const matched = world.entries.filter(entry => matchWorldEntry(entry, userText))
    if (matched.length === 0) return decision
    const injected = matched.map(entry => createUserMessage({
      content: [{ type: 'text', text: renderWorldEntry(entry) }],
      source: { kind: 'plugin', plugin: name, form: 'instructions' },
    }))
    return { kind: 'enter', messages: [...decision.messages, ...injected] }
  })
}

/**
```

</details>

**依据 3 · 源码核查**：[src/index.ts:80-114](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L80-L114)

共享active及仅JSON热载入支撑权威文档假设。

<details>
<summary>查看原文（35行）</summary>

```text
  ctx.systemPrompt.section({
    name: config.sectionName,
    order: config.sectionOrder,
    text: () => {
      const active = repo.active
      if (active === null) return ''
      const content = repo.contentOf(active)
      return content === undefined ? '' : sanitizePromptVariables(content, active)
    },
  })

  // 1b) 世界书关键词自动触发：激活的预设是世界书时，把触发词命中的条目注入本轮
  if (config.worldTrigger) {
    registerWorldTrigger(ctx, repo, worldbooks)
  }

  // 2) 管理工具（对话中随时切换与修改）
  if (config.enableTools) {
    registerTools(ctx, repo, worldbooks, worldbooksFile, dataDir)
  }

  // 2b) 浏览器设置页的数据通道：/prompt-manager/api（JSON RPC，同源 fetch）
  registerApiRoute(ctx, repo, worldbooks, worldbooksFile, dataDir)

  // 3) 数据文件热载入：直接改 JSON 文件，防抖后自动 reload
  if (config.watchFile) {
    let debounce: ReturnType<typeof setTimeout> | undefined
    const watcher = watch(dataDir, { persistent: false }, (_event, filename) => {
      if (filename !== basename(dataFile)) return
      if (debounce !== undefined) clearTimeout(debounce)
      debounce = setTimeout(() => {
        repo.reload()
        ctx.emit('system-prompt/change')
        console.log(`[prompt-manager] ${basename(dataFile)} changed on disk; reloaded`)
      }, 200)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:726-753](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts#L726-L753)

多份投影顺序生成的现状。

<details>
<summary>查看原文（28行）</summary>

```text
): { worldPreset: string; writingPreset: string; documentPath: string } | undefined {
  if (world === undefined || world.entries.length === 0) return undefined

  const worldName = worldPresetName(ownerName)
  const worldDoc = composeWorldDocument(world, ownerName)
  const worldResult = repo.upsert({
    name: worldName,
    content: composeWorldContent(world, ownerName),
    description: `Imported world info (${world.entries.length} entries${world.name !== undefined ? `, "${world.name}"` : ''}); activating it enables keyword-triggered injection`,
  })
  if (!worldResult.ok) throw new Error(worldResult.message)

  const writingName = writingPresetName(ownerName)
  const writingResult = repo.upsert({
    name: writingName,
    content: composeWritingContent(worldDoc, ownerName),
    description: `创作模式：参考《${ownerName}》世界设定创作小说；激活后输入场景即可`,
  })
  if (!writingResult.ok) throw new Error(writingResult.message)

  worldbooks.set(worldName, world)
  saveWorldbooks(worldbooksFile, worldbooks)
  const documentPath = writeWorldDocument(dataDir, ownerName, worldDoc)
  return { worldPreset: worldName, writingPreset: writingName, documentPath }
}

/** 文件名安全化：把路径保留字符替换为下划线。 */
function safeFileName(name: string): string {
```

</details>

#### 缺口

- 缺少相同世界/模型/场景的创作质量、token和人工返工对照。
  **影响**：不能量化相比手工设定粘贴的净收益。
  **进一步探讨**：从固定场景、人工设定检查表与token日志入手，同时保留失败和遗漏样本。
- 版本化会话绑定与预算注入尚无实现和对照。
  **影响**：只是可证伪设计，不提升当前采用等级。
  **进一步探讨**：比较双会话世界串用、编辑传播、关键设定遗漏和输入成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
