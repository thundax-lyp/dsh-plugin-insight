# Love Companion

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9b6a703](https://github.com/MoYan1638/love-companion/tree/9b6a703399bf25263b0ab85f9f867669202aaab3)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MoYan1638/love-companion)
<!-- END META -->

> **功能**：提供人设、长时记忆与回复风格流程，并以 DSH 提示桥接引导调用本地陪伴技能。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持一种分层组合：DSH 入口负责提示接线，Python 负责本地资料与摘要。它比单份人设文本多了持久化和预算组织，但每轮执行仍依赖模型或集成方；现有贡献属于组合便利，不能视为自动陪伴闭环。

> **主要限制**：[Q03](#research-q03) 显示最影响采用的是加载与执行被混淆：桥接不运行 Python，后处理不阻断发送，模块异常可能静默回退。即使对话看起来连贯，也不能据此判断记忆已保存或守门已生效。

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
  - [Q01 · 谁需要它，DSH 桥接层相比直接粘贴人设改变了什么？](#detail-section-11)
  - [Q02 · DSH 加载是否自动发现技能、执行 Python 并更新记忆？](#detail-section-12)
  - [Q03 · 年龄闸门、记忆写入与回复后处理在哪层生效，失败是否可见？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复的成本及退出负担是什么？](#detail-section-14)
  - [Q05 · 能否用显式执行回执缩小提示与实际调用之间的落差？](#detail-section-15)
  - [Q06 · 谁可试用，何时停止并退回普通对话？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：它服务于希望在本地保留角色设定、跨轮回忆与回复风格的成年角色扮演使用者。合格结果应是用户指定的人设与允许保存的事实可追溯地进入下一轮，关闭后不再使用这些材料，而非把“像恋人”视为可测效果。直接粘贴人设只解决当轮提示；本组件把角色资料、记忆与轻量摘要组织成文件和 Python 流程，并用 DSH 系统提示告知模型入口。

桥接层实际增量是可选 systemPrompt.section 与 settings 命名空间，不是一个已自动运行的陪伴 Agent。SKILL 描述 prepare→after_reply→proactive 三段调用，但执行责任仍在模型或集成方。人格与记忆能力属于本仓库 Python 模块，不能全部归功于 72 行桥接。对仅偶尔角色对话的人，手工提示可能已足够；反复维护多份本地设定者才可能摊薄配置和核对负担。

比较基线为直接粘贴人设、手工维护本地资料和模型按需调用脚本，不声称做过效果对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH 工作指引注入 | 告知模型技能触发与本地流程 | 可选systemPrompt服务，不自动运行Python |
| 设置命名空间注册 | 为宿主设置预留入口 | settings服务存在才注册，不等于读入完整配置 |
| 本地Session准备与后处理 | 召回资料、返回诊断并采集记忆 | 需显式Python调用；不是DSH自动注册工具 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 与可选 systemPrompt/settings | 桥接需要 | 注入指引与设置命名空间 | 服务缺失被忽略，提示可能不出现 |
| 文件系统技能目录 | 实际技能使用需要 | 发现 SKILL.md | 安装 bundle 不会替它注册 |
| Python 与本地数据目录 | 人设记忆流程需要 | 运行 Session 与持久化 | 只剩能力指引 |
| 明确年龄确认与采集设置 | 启用流程需要 | prepare 闸门与记忆采集控制 | 未确认时 prepare 不注入，其他调用须独立核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者配置技能发现与隔离数据目录 | 能定位 SKILL 和预期数据路径 |
| 加载 | DSH 挂载提示桥接 | 能区分提示出现与 Python执行 |
| 对话 | 集成方/模型调用 prepare 与 after_reply | 回查实际上下文与记忆写入 |
| 退出 | 使用者关闭技能和bundle并导出所需数据 | 不再新增角色数据，历史文件单独处理 |

首次要分别核对 DSH bundle 挂载、文件系统技能发现、Python 运行环境和数据目录，年龄确认与允许采集的范围由使用者维护。持续使用需要模型每轮调用并消费准备结果、记录后处理回执；模型对话费用仍取决于所选服务，不能因 Python 标准库就称总成本为零。

恢复时先保留损坏文件和队列错误，核对哪些记忆已实际写入，避免把“对话没中断”当成保存成功。MemoryStore 可导出、按 conversation_id 删除和 clear，但删除会重编号剩余记忆；现有源码片段不能证明所有历史引用自动修复。因此先用虚构、无敏感数据隔离试验，关闭技能与 bundle 并保留用户决定保留的数据，是比直接删除目录更可控的退出方式。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机存储与既有模型服务，金额未知 | 配置技能路径、Python和年龄/采集设置，耗时未知 | 安装 bundle 不等于技能可发现 |
| 持续使用 | 模型费用及本地读写，未测 | 核对召回和后处理回执 | 估算预算不是实际账单 |
| 失败恢复 | 备份与重试资源，未测 | 比对 .bad 文件、队列错误与实际记忆 | 关闭对话不自动撤销既有写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地角色记忆 | Python提供召回、采集与导出链路 | DSH每轮实际调用与角色隔离效果 |
| 回复风格 | 后处理返回诊断 | 发送前是否采用和用户体验收益 |
| 上下文控制 | Injector按估算值截断 | 目标模型真实token与账单 |

> **思考**：[Q03](#research-q03) 显示最影响采用的是加载与执行被混淆：桥接不运行 Python，后处理不阻断发送，模块异常可能静默回退。即使对话看起来连贯，也不能据此判断记忆已保存或守门已生效。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持一种分层组合：DSH 入口负责提示接线，Python 负责本地资料与摘要。它比单份人设文本多了持久化和预算组织，但每轮执行仍依赖模型或集成方；现有贡献属于组合便利，不能视为自动陪伴闭环。

[Q03](#research-q03) 的共享原子JSON替换和坏文件留证值得复用；移植时仍要统一异常回执和引用完整性，不能把默认回退当恢复成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示最影响采用的是加载与执行被混淆：桥接不运行 Python，后处理不阻断发送，模块异常可能静默回退。即使对话看起来连贯，也不能据此判断记忆已保存或守门已生效。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在虚构角色与隔离目录中核对技能发现、Python 调用和记忆回执；未确认年龄时应得到不注入结果。若无法解释角色资料为何写入或插件只提示能力却未实际执行，应关闭技能与桥接，退回不持久化的普通对话；历史文件按用户选择导出与清除。依据见 [Q06](#research-q06)。

桥接层实际增量是可选 systemPrompt.section 与 settings 命名空间，不是一个已自动运行的陪伴 Agent。SKILL 描述 prepare→after_reply→proactive 三段调用，但执行责任仍在模型或集成方。人格与记忆能力属于本仓库 Python 模块，不能全部归功于 72 行桥接。对仅偶尔角色对话的人，手工提示可能已足够；反复维护多份本地设定者才可能摊薄配置和核对负担。

最小验证可用相同虚构角色和两条允许保存的事实，比较仅提示版与显式适配版各若干轮；保持模型和材料相同，注入技能缺失、Python失败和存储损坏，记录误报成功、漏保存及恢复人工量。若回执不能区分“未调用”和“已保存”，或增加的状态同步与维护负担超过减少的核对成本，就应否定该方案。本次未实现或运行该设计，也不把它计入本组件现有创新。 依据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有挂载、提示、Python编排与文件恢复机制有固定源码依据；情感效果、实际兼容和新回执设计未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、dsh/index.js、README.md、SKILL.md、scripts/pipeline/orchestrator.py、scripts/pipeline/injector.py、scripts/pipeline/runner.py、scripts/core/storage.py、scripts/memory/store.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查根包、补丁、DSH桥接、技能工作流及影响记忆、预算、后处理与恢复的Python模块。未把每个参考文档的情感建议作为科学结论。
- 下一步：已检查源码；未执行插件、Python脚本、本地测试或真实宿主验收。作者法律与效果声明未作为独立验证结论。

**分析版本**

- **仓库**：[MoYan1638/love-companion](https://github.com/MoYan1638/love-companion)
- **版本号**：2.5.5（[固定提交 9b6a703](https://github.com/MoYan1638/love-companion/tree/9b6a703399bf25263b0ab85f9f867669202aaab3)）
- **版本日期**：2026-11-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索将“已加载插件”拆成技能可发现、prepare已完成、结果已注入、after_reply已保存四种回执。推导来自桥接只作提示、Python 返回数据而不接入会话，以及多处异常被吞这三项源码事实。相对现有指导文本，增加的是调用链可观察性，不是更强情感模型。

最小验证可用相同虚构角色和两条允许保存的事实，比较仅提示版与显式适配版各若干轮；保持模型和材料相同，注入技能缺失、Python失败和存储损坏，记录误报成功、漏保存及恢复人工量。若回执不能区分“未调用”和“已保存”，或增加的状态同步与维护负担超过减少的核对成本，就应否定该方案。本次未实现或运行该设计，也不把它计入本组件现有创新。 依据见 [Q05](#research-q05)。

已检查源码；未执行插件、Python脚本、本地测试或真实宿主验收。作者法律与效果声明未作为独立验证结论。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 5811 | — | — | 59672 |
| .js | source | 1 | 72 | 32 | 30 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MoYan1638/love-companion/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/MoYan1638/love-companion/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MoYan1638/love-companion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 中的陪伴提示能否可靠带起本地人设与记忆闭环，哪些能力仍依赖模型主动调用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要它，DSH 桥接层相比直接粘贴人设改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它服务于希望在本地保留角色设定、跨轮回忆与回复风格的成年角色扮演使用者。合格结果应是用户指定的人设与允许保存的事实可追溯地进入下一轮，关闭后不再使用这些材料，而非把“像恋人”视为可测效果。直接粘贴人设只解决当轮提示；本组件把角色资料、记忆与轻量摘要组织成文件和 Python 流程，并用 DSH 系统提示告知模型入口。

桥接层实际增量是可选 systemPrompt.section 与 settings 命名空间，不是一个已自动运行的陪伴 Agent。SKILL 描述 prepare→after_reply→proactive 三段调用，但执行责任仍在模型或集成方。人格与记忆能力属于本仓库 Python 模块，不能全部归功于 72 行桥接。对仅偶尔角色对话的人，手工提示可能已足够；反复维护多份本地设定者才可能摊薄配置和核对负担。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:39-69](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/dsh/index.js#L39-L69)

真实 DSH 入口只作提示和设置注册，没有执行 Python。

<details>
<summary>查看原文（31行）</summary>

```text
const COMPANION_GUIDANCE = `本机已安装 AI 陪伴技能 love-companion。能力：多轮情感对话、用户自定义人设配置（姓名/昵称/性别/性格/背景）、从聊天记录蒸馏专属人格、长时记忆存储与检索、情绪与依恋类型识别、预设人设模板套用、回复的文风与多轮节奏守门、发送前排版（回复不带句号逗号、用空格隔开、一条十字顶天、说得多就多发几条）、低落/纪念日/深夜时主动开口、判断层知识库（依恋/情绪承接/冲突修复/边界与同意/危机转介/关系节奏/信号误读）、可选军师模式（默认关闭，顾问口吻回答「对方什么意思/这句怎么回/要不要继续」）、配置导入导出。当用户提及「恋人 / 男/女朋友 / 情感陪伴 / 人设 / 角色扮演 / 情感对话 / 这句怎么回 / 要不要继续」时即指本技能。所有对话均为 AI 生成的角色扮演内容，不代表真实人际关系；仅限已满 18 周岁，启用前需确认用户年龄，未确认时不加载任何人设与记忆。数据全部存储在本地设备（~/.love-companion/data），不上传。`;

// DSH 插件默认导出：接收 ctx 上下文
export default function apply(ctx) {
  // 1) 系统提示注入（可选服务，ctx.get 缺失时静默跳过）
  try {
    if (ctx.systemPrompt && typeof ctx.systemPrompt.section === "function") {
      ctx.systemPrompt.section(SECTION_NAME, COMPANION_GUIDANCE, SECTION_ORDER);
    }
  } catch (e) {
    // systemPrompt 为可选服务，缺失不阻塞插件加载
  }

  // 2) settings 命名空间（可选，仅当 schemastery 与 settings 服务可用时注册）
  try {
    if (ctx.settings && typeof ctx.settings.register === "function") {
      ctx.settings.register(SETTINGS_NS);
    }
  } catch (e) {
    // settings 为可选服务
  }

  // 3) 确保数据目录存在（与 Python 侧共享）
  try {
    if (!existsSync(APP_DATA_DIR)) {
      mkdirSync(APP_DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // 目录创建失败不阻塞；Python 侧会自行兜底
  }
}
```

</details>

**依据 2 · 作者声明**：[SKILL.md:173-195](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/SKILL.md#L173-L195)

作者要求模型显式调用每轮流程。

<details>
<summary>查看原文（23行）</summary>

````text
## v2 Agent 级能力（在线调用流程）

> **铁律**：重活一律离线，在线每轮额外开销 **≤500 Token**。
> 下面三段是 Agent 每轮真正要调的东西，其余都是可选的。

### 1. 回复之前：`prepare()`

```python
from scripts.pipeline.orchestrator import Session
s = Session(slug="美美")                    # slug = 伴侣人格库里的名字
ctx = s.prepare(user_message="今天好累")
ctx["render"]      # 拼进 System Prompt 的压缩上下文
ctx["total_tokens"]  # 本轮实际占用，恒 ≤ 500
```

它会自动做：记忆 Top-3 检索 → 人格摘要编译 → 相处指南编译 → 预算分配与截断 → 记录可解释依据。

### 2. 回复之后：`after_reply()`

```python
s.after_reply(reply="辛苦了，早点休息呀", user_message="今天好累")
# → 一致性自检（有没有跑偏出人设）+ AI 腔守门 + 素材入队 + 对话间隙跑离线任务
```
````

</details>

#### 缺口

- 未取得真实重复使用与任务对照资料。
  **影响**：不能声称改善情感质量、节时或真实需求强度。
  **进一步探讨**：对同一批许可材料比较手工提示与显式调用流程的事实保留、错配和人工纠正量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 加载是否自动发现技能、执行 Python 并更新记忆？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

固定源码没有从 DSH 桥接到 Python 编排的自动执行链。package 根导出 dsh/index.js，补丁挂载 love-companion，apply 尝试注入一段能力说明、注册设置命名空间并创建 ~/.love-companion；注释明确技能依赖 ~/.dsh/skills/love-companion/SKILL.md 的文件系统发现，不重复注册技能。若 systemPrompt 或 settings 缺失，异常被忽略，加载可能完成但功能提示或设置不出现。

Python Session.prepare 读取配置，先判断年龄确认，再通过 MemoryStore/top_k 选三条记忆、编译人设等，Injector 合并成 render 返回调用者。返回字符串不会自行进入 DSH 会话，模型或集成方必须消费它。after_reply 才将用户文本入队并调用 run_idle；因此安装 bundle、技能文件可发现、Python 可执行和每轮正确调用是四个不同条件。不能从提示中“本机已安装”推出技能目录已正确放置。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-17](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/package.json#L6-L17)

包导出与补丁声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "main": "dsh/index.js",
  "exports": {
    ".": "./dsh/index.js",
    "./dsh": "./dsh/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:10-18](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/dsh/index.js#L10-L18)

技能发现路径与运行时边界。

```text
// - DSH 插件 Host（本文件）：系统提示注入 + 可选 settings 命名空间
//   * ctx.systemPrompt.section 注入 AI 工作指引（可选服务，缺失不阻塞）
//   * ctx.settings.register('love-companion') 官方设置命名空间
//
// 技能发现走文件系统（~/.dsh/skills/love-companion/SKILL.md），
// 插件不在运行时重复注册 SKILL.md，避免与文件系统技能 API 面重复。
//
// 纯 CLI / OpenClaw / WorkBuddy 用户完全不受影响：
// 不使用 DSH 插件时，本文件不会被加载，SKILL.md 照常被各宿主读取。
```

**依据 3 · 源码核查**：[dsh/index.js:42-69](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/dsh/index.js#L42-L69)

桥接的全部实际动作与失败忽略。

<details>
<summary>查看原文（28行）</summary>

```text
export default function apply(ctx) {
  // 1) 系统提示注入（可选服务，ctx.get 缺失时静默跳过）
  try {
    if (ctx.systemPrompt && typeof ctx.systemPrompt.section === "function") {
      ctx.systemPrompt.section(SECTION_NAME, COMPANION_GUIDANCE, SECTION_ORDER);
    }
  } catch (e) {
    // systemPrompt 为可选服务，缺失不阻塞插件加载
  }

  // 2) settings 命名空间（可选，仅当 schemastery 与 settings 服务可用时注册）
  try {
    if (ctx.settings && typeof ctx.settings.register === "function") {
      ctx.settings.register(SETTINGS_NS);
    }
  } catch (e) {
    // settings 为可选服务
  }

  // 3) 确保数据目录存在（与 Python 侧共享）
  try {
    if (!existsSync(APP_DATA_DIR)) {
      mkdirSync(APP_DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // 目录创建失败不阻塞；Python 侧会自行兜底
  }
}
```

</details>

**依据 4 · 源码核查**：[scripts/pipeline/orchestrator.py:97-128](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L97-L128)

Python 召回和人设编译返回上下文，不是 DSH 回调。

<details>
<summary>查看原文（32行）</summary>

```text
        inj = Injector(total_budget=int(caps["合计上限"]), caps=caps)
        memory_ids: List[int] = []

        # 记忆片段（M2）：语义 + 时间 + 重要性 + 关系路径 四路打分取 Top-3
        if self._on("记忆系统"):
            try:
                from scripts.memory.retrieve import render as render_mem, top_k
                from scripts.memory.store import MemoryStore
                store = MemoryStore(self.data_dir)
                picked = top_k(store.all(), user_message or "", k=3)
                memory_ids = [int(m.get("id")) for m in picked if m.get("id") is not None]
                if picked:
                    inj.add("记忆片段", render_mem(picked))
                    store.recall(memory_ids)
            except Exception:  # noqa: BLE001
                pass

        # 人格指令（M3a）：蒸馏过素材用人格库，否则直接用当前 v1 人设
        # （含 8 套预设）——没蒸馏的用户不该拿到空的人设
        if self._on("人格克隆"):
            try:
                from scripts.persona.adapt import from_v1_file
                from scripts.persona.library import PersonaLibrary
                summary = ""
                if self.slug:
                    summary = PersonaLibrary(self.data_dir).compile_summary(self.slug)
                if not summary:
                    summary = from_v1_file(self.data_dir)
                if summary:
                    inj.add("人格指令", summary)
            except Exception:  # noqa: BLE001
                pass
```

</details>

**依据 5 · 源码核查**：[scripts/pipeline/orchestrator.py:231-251](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L231-L251)

记忆采集依赖 after_reply 调用，离线处理在本函数内触发。

<details>
<summary>查看原文（21行）</summary>

```text
        # 用户信号与记忆采集：丢进离线队列，不让它在对话里占时间
        # （隐私.采集开关在 runner 的 memory.extract 里把关）
        try:
            from scripts.pipeline.queue import TaskQueue
            queue = TaskQueue(self.data_dir)
            if user_message:
                queue.enqueue("memory.extract",
                              {"text": user_message, "conversation_id": conversation_id or self.slug})
            if mood and self.slug:
                queue.enqueue("mirror.record", {"slug": self.slug, "kind": mood})
            report["events"] = [user_message and "memory.extract", mood and "mirror.record"]
            report["events"] = [e for e in report["events"] if e]
        except Exception:  # noqa: BLE001
            pass

        # 对话间隙：排空离线队列
        try:
            from scripts.pipeline.runner import run_idle
            report["idle"] = run_idle(self.data_dir, max_tasks=max_tasks)
        except Exception as exc:  # noqa: BLE001
            report["idle"] = {"error": f"{type(exc).__name__}: {exc}"}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 年龄闸门、记忆写入与回复后处理在哪层生效，失败是否可见？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

prepare 在年龄未确认时返回空 sections、memory_ids 和 age_gate=true，只给提示，故这个入口可阻止人设和记忆注入。但 DSH 桥接只注入固定指引，不读取年龄配置；这不是宿主统一的年龄校验。after_reply 自身也没有 prepare 的年龄分支，依赖调用方顺序与 runner 的采集开关，不能把所有数据写入都称为经过同一个硬闸门。

runner 的 memory.extract 先查 collection_enabled，再抽取候选写入 MemoryStore，任务成功/失败写入队列并汇总 errors。共享 JSON 写入采用同目录临时文件和 os.replace，损坏读取会尝试保留 .bad 副本后回默认值；这是恢复线索，不代表自动恢复旧记忆。orchestrator 多处吞掉模块异常，使对话继续，但人设或召回缺失未必出现在返回报告；一致性检查异常甚至回 ok=true，不能当作检查通过。

after_reply 生成 humanizer、density、rhythm 等检查结果，未改写调用者已生成的 reply，也不负责发送阻断。所谓语气守门在该调用链是诊断建议，是否在发送前采用取决于 Agent。预算使用字符启发式估算，不是目标模型 tokenizer 的精确上限，因此 SKILL 的恒定 Token 承诺应收窄为估算预算控制。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/pipeline/orchestrator.py:79-95](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L79-L95)

prepare 的年龄分支。

<details>
<summary>查看原文（17行）</summary>

```text
        # 合规闸门（v2.1）：《人工智能拟人化互动服务管理暂行办法》禁止向未成年人
        # 提供虚拟伴侣等虚拟亲密关系服务。未确认「已满 18 周岁」时不注入任何
        # 恋人上下文，只返回合规提示，由 Agent 先完成年龄确认。
        if not core_settings.age_confirmed(self.data_dir):
            notice = (
                "【合规提示】Love Companion 为 AI 角色扮演 / 虚拟伴侣类服务，"
                "依据《人工智能拟人化互动服务管理暂行办法》，不得向未成年人提供。"
                "请先向用户确认其已年满 18 周岁；用户确认后，在 settings.json 的"
                "「合规.已满18周岁确认」置为 true 方可启用恋人模式。"
                "本轮未注入人格、记忆等任何恋人上下文。"
            )
            return {
                "sections": {}, "render": notice, "tokens": {},
                "total_tokens": 0, "budget": int(caps["合计上限"]),
                "truncated": [], "dropped": [], "evidence": {},
                "memory_ids": [], "age_gate": True,
            }
```

</details>

**依据 2 · 源码核查**：[scripts/pipeline/orchestrator.py:199-229](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L199-L229)

检查失败处理及只返回诊断结果。

<details>
<summary>查看原文（31行）</summary>

```text
        report: Dict[str, Any] = {"consistency": {}, "humanizer": {}, "events": [], "idle": {}}

        # 跨角色一致性（M5）：回复跑偏出人设，记下来供下次纠偏
        if self.slug:
            try:
                from scripts.persona.mirror import MirrorModel
                ok, issues = MirrorModel(self.data_dir).consistency(reply or "", self.slug)
                report["consistency"] = {"ok": ok, "issues": issues}
            except Exception:  # noqa: BLE001
                report["consistency"] = {"ok": True, "issues": []}

        # AI 腔守门（M4）：离线跑，不占主生成 Token
        if self._on("语气后处理"):
            try:
                from scripts.style.humanizer import scan
                report["humanizer"] = scan(reply or "")
            except Exception:  # noqa: BLE001
                pass
            # 密度校准（M4.5）：结构腔「超了压」+ 微标记「少了补」，软校准层
            try:
                from scripts.style.density import assess
                report["density"] = assess(reply or "")
            except Exception:  # noqa: BLE001
                pass
            # 多轮节奏（M4.6）：单条都合格也可能连起来像 AI，只有给了历史才判
            if history:
                try:
                    from scripts.style.dialogue import check_reply
                    report["rhythm"] = check_reply(history, reply or "")
                except Exception:  # noqa: BLE001
                    pass
```

</details>

**依据 3 · 源码核查**：[scripts/pipeline/runner.py:84-111](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/runner.py#L84-L111)

采集开关到记忆新增的真实链路。

<details>
<summary>查看原文（28行）</summary>

```text
@register("memory.extract")
def _task_memory_extract(payload: Dict[str, Any], ctx: Dict[str, Any]) -> Dict[str, Any]:
    """从一段对话文本中无感采集记忆（离线，不占对话 Token）"""
    from scripts.core import settings as core_settings
    from scripts.memory.store import MemoryStore
    from scripts.memory.extract import extract_memories

    # 隐私.采集开关：用户关了就一条不采（数据主权）
    if not core_settings.collection_enabled(ctx["data_dir"]):
        return {"added": 0, "reason": "采集开关已关闭"}

    text = payload.get("text", "")
    if not text:
        return {"added": 0, "reason": "空文本"}
    store = MemoryStore(ctx["data_dir"])
    candidates = extract_memories(text, conversation_id=payload.get("conversation_id", ""))
    added = []
    for c in candidates:
        entry = store.add(
            content=c["content"],
            memory_type=c["type"],
            source=c.get("source", ""),
            importance=c.get("importance", 0.5),
            valence=c.get("valence", 0.0),
            conversation_id=payload.get("conversation_id", ""),
        )
        added.append(entry["id"])
    return {"added": len(added), "ids": added}
```

</details>

**依据 4 · 源码核查**：[scripts/core/storage.py:46-81](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/core/storage.py#L46-L81)

默认回退、损坏留证与原子替换。

<details>
<summary>查看原文（36行）</summary>

```text
def read_json(path: Any, default: Any) -> Any:
    """读 JSON 文件；不存在或损坏时返回 default 的深拷贝

    Args:
        path: 文件路径
        default: 读不到/读坏时的兜底值（会被深拷贝，避免共享可变对象）
    """
    path = Path(path)
    if not path.exists():
        return _copy_default(default)
    try:
        # utf-8-sig：兼容 Windows 记事本/WPS 写出的 BOM 文件（真实用户数据已踩到）
        with open(path, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
    except (json.JSONDecodeError, UnicodeDecodeError, OSError):
        _quarantine(path)
        return _copy_default(default)
    return data if data is not None else _copy_default(default)


def write_json(path: Any, data: Any, indent: int = 2) -> None:
    """原子写 JSON：临时文件 + os.replace，任何时刻不留半截文件"""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.parent / f".{path.name}.{os.getpid()}.tmp"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=indent)
        os.replace(tmp, path)
    finally:
        # replace 成功则 tmp 已不存在；失败时清掉残件
        try:
            if tmp.exists():
                tmp.unlink()
        except OSError:
            pass
```

</details>

**依据 5 · 源码核查**：[scripts/pipeline/injector.py:32-56](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/injector.py#L32-L56)

预算基于字符近似。

<details>
<summary>查看原文（25行）</summary>

```text
def estimate_tokens(text: str) -> int:
    """粗略估算 Token：CJK 约 1 字 1 token，其余按 4 字符 1 token

    刻意保守（宁可高估），避免超预算。
    """
    if not text:
        return 0
    cjk = len(_CJK.findall(text))
    other = len(text) - cjk
    return int(math.ceil(cjk + other / 4.0))


def truncate_to_tokens(text: str, limit: int) -> str:
    """按 Token 预算截断（按字符近似，保留完整句子更好，此处保守按字数切）"""
    if estimate_tokens(text) <= limit:
        return text
    # 逐字符累加直到超预算
    acc, tokens = [], 0
    for ch in text:
        t = estimate_tokens(ch)
        if tokens + t > limit:
            break
        acc.append(ch)
        tokens += t
    return "".join(acc).rstrip("，,。、；; ")
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复的成本及退出负担是什么？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

首次要分别核对 DSH bundle 挂载、文件系统技能发现、Python 运行环境和数据目录，年龄确认与允许采集的范围由使用者维护。持续使用需要模型每轮调用并消费准备结果、记录后处理回执；模型对话费用仍取决于所选服务，不能因 Python 标准库就称总成本为零。

恢复时先保留损坏文件和队列错误，核对哪些记忆已实际写入，避免把“对话没中断”当成保存成功。MemoryStore 可导出、按 conversation_id 删除和 clear，但删除会重编号剩余记忆；现有源码片段不能证明所有历史引用自动修复。因此先用虚构、无敏感数据隔离试验，关闭技能与 bundle 并保留用户决定保留的数据，是比直接删除目录更可控的退出方式。

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机存储与既有模型服务，金额未知 | 配置技能路径、Python和年龄/采集设置，耗时未知 | 安装 bundle 不等于技能可发现 |
| 持续使用 | 模型费用及本地读写，未测 | 核对召回和后处理回执 | 估算预算不是实际账单 |
| 失败恢复 | 备份与重试资源，未测 | 比对 .bad 文件、队列错误与实际记忆 | 关闭对话不自动撤销既有写入 |

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:14-18](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/dsh/index.js#L14-L18)

技能发现需要独立条件。

```text
// 技能发现走文件系统（~/.dsh/skills/love-companion/SKILL.md），
// 插件不在运行时重复注册 SKILL.md，避免与文件系统技能 API 面重复。
//
// 纯 CLI / OpenClaw / WorkBuddy 用户完全不受影响：
// 不使用 DSH 插件时，本文件不会被加载，SKILL.md 照常被各宿主读取。
```

**依据 2 · 源码核查**：[scripts/core/storage.py:35-81](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/core/storage.py#L35-L81)

故障留证及恢复边界。

<details>
<summary>查看原文（47行）</summary>

```text
def _quarantine(path: Path) -> None:
    """把损坏文件复制为 .bad-<时间戳> 留证（不覆盖更早的备份）"""
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    bad = path.with_name(f"{path.name}.bad-{stamp}")
    try:
        if not bad.exists():
            shutil.copy2(path, bad)
    except OSError:
        pass  # 留证失败也不能让主流程崩


def read_json(path: Any, default: Any) -> Any:
    """读 JSON 文件；不存在或损坏时返回 default 的深拷贝

    Args:
        path: 文件路径
        default: 读不到/读坏时的兜底值（会被深拷贝，避免共享可变对象）
    """
    path = Path(path)
    if not path.exists():
        return _copy_default(default)
    try:
        # utf-8-sig：兼容 Windows 记事本/WPS 写出的 BOM 文件（真实用户数据已踩到）
        with open(path, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
    except (json.JSONDecodeError, UnicodeDecodeError, OSError):
        _quarantine(path)
        return _copy_default(default)
    return data if data is not None else _copy_default(default)


def write_json(path: Any, data: Any, indent: int = 2) -> None:
    """原子写 JSON：临时文件 + os.replace，任何时刻不留半截文件"""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.parent / f".{path.name}.{os.getpid()}.tmp"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=indent)
        os.replace(tmp, path)
    finally:
        # replace 成功则 tmp 已不存在；失败时清掉残件
        try:
            if tmp.exists():
                tmp.unlink()
        except OSError:
            pass
```

</details>

**依据 3 · 源码核查**：[scripts/memory/store.py:185-204](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/memory/store.py#L185-L204)

按会话删除、清空与导出。

<details>
<summary>查看原文（20行）</summary>

```text
    def delete_conversation(self, conversation_id: str) -> int:
        """遗忘某段关系：整段会话产生的记忆一次性清除"""
        return self._delete_by_field("conversation_id", conversation_id)

    def _delete_by_field(self, field: str, value: Any) -> int:
        memories = self.all()
        left = [m for m in memories if m.get(field) != value]
        removed = len(memories) - len(left)
        for i, m in enumerate(left, 1):
            m["id"] = i
        self._save(left)
        return removed

    def clear(self) -> int:
        count = len(self.all())
        self._save([])
        return count

    def export(self) -> str:
        return json.dumps(self.all(), ensure_ascii=False, indent=2)
```

</details>

#### 缺口

- 无同条件合格任务的模型账单、人工时间和失败恢复记录。
  **影响**：无法计算单位任务成本或判断长期投入是否更低。
  **进一步探讨**：在隔离目录记录每轮实际调用、人工纠正、模型用量与恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用显式执行回执缩小提示与实际调用之间的落差？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可探索将“已加载插件”拆成技能可发现、prepare已完成、结果已注入、after_reply已保存四种回执。推导来自桥接只作提示、Python 返回数据而不接入会话，以及多处异常被吞这三项源码事实。相对现有指导文本，增加的是调用链可观察性，不是更强情感模型。

最小验证可用相同虚构角色和两条允许保存的事实，比较仅提示版与显式适配版各若干轮；保持模型和材料相同，注入技能缺失、Python失败和存储损坏，记录误报成功、漏保存及恢复人工量。若回执不能区分“未调用”和“已保存”，或增加的状态同步与维护负担超过减少的核对成本，就应否定该方案。本次未实现或运行该设计，也不把它计入本组件现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:42-69](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/dsh/index.js#L42-L69)

桥接未提供调用回执。

<details>
<summary>查看原文（28行）</summary>

```text
export default function apply(ctx) {
  // 1) 系统提示注入（可选服务，ctx.get 缺失时静默跳过）
  try {
    if (ctx.systemPrompt && typeof ctx.systemPrompt.section === "function") {
      ctx.systemPrompt.section(SECTION_NAME, COMPANION_GUIDANCE, SECTION_ORDER);
    }
  } catch (e) {
    // systemPrompt 为可选服务，缺失不阻塞插件加载
  }

  // 2) settings 命名空间（可选，仅当 schemastery 与 settings 服务可用时注册）
  try {
    if (ctx.settings && typeof ctx.settings.register === "function") {
      ctx.settings.register(SETTINGS_NS);
    }
  } catch (e) {
    // settings 为可选服务
  }

  // 3) 确保数据目录存在（与 Python 侧共享）
  try {
    if (!existsSync(APP_DATA_DIR)) {
      mkdirSync(APP_DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // 目录创建失败不阻塞；Python 侧会自行兜底
  }
}
```

</details>

**依据 2 · 源码核查**：[scripts/pipeline/orchestrator.py:171-180](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L171-L180)

prepare 可供适配器消费的结构化结果。

<details>
<summary>查看原文（10行）</summary>

```text
        return {
            "sections": built["sections"],
            "render": inj.render(),
            "tokens": built["tokens"],
            "total_tokens": built["total_tokens"],
            "budget": built["budget"],
            "truncated": built["truncated"],
            "dropped": built["dropped"],
            "evidence": evidence,
            "memory_ids": memory_ids,
```

</details>

**依据 3 · 源码核查**：[scripts/pipeline/orchestrator.py:231-253](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L231-L253)

后处理错误与事件已有部分可观察信息。

<details>
<summary>查看原文（23行）</summary>

```text
        # 用户信号与记忆采集：丢进离线队列，不让它在对话里占时间
        # （隐私.采集开关在 runner 的 memory.extract 里把关）
        try:
            from scripts.pipeline.queue import TaskQueue
            queue = TaskQueue(self.data_dir)
            if user_message:
                queue.enqueue("memory.extract",
                              {"text": user_message, "conversation_id": conversation_id or self.slug})
            if mood and self.slug:
                queue.enqueue("mirror.record", {"slug": self.slug, "kind": mood})
            report["events"] = [user_message and "memory.extract", mood and "mirror.record"]
            report["events"] = [e for e in report["events"] if e]
        except Exception:  # noqa: BLE001
            pass

        # 对话间隙：排空离线队列
        try:
            from scripts.pipeline.runner import run_idle
            report["idle"] = run_idle(self.data_dir, max_tasks=max_tasks)
        except Exception as exc:  # noqa: BLE001
            report["idle"] = {"error": f"{type(exc).__name__}: {exc}"}

        return report
```

</details>

#### 缺口

- 显式适配器与对照实验均未实现。
  **影响**：不能证明可观察性改造会降低总负担。
  **进一步探讨**：先验证四种回执能否准确对应实际副作用，再比较人工核对量。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，何时停止并退回普通对话？

**研究主题**：采用判断

#### 完整回答

当前建议观察，先补齐 DSH 到 Python 的明确接线，再讨论日常使用。对能够审查本地文件和调用日志的成年开发者，源码可作角色工作流原型参考；普通用户不宜把安装成功理解为跨轮记忆、年龄闸门和发送前守门均自动成立。

若开展独立验证，应使用隔离目录与虚构角色，先确认没有年龄确认时不注入，再确认许可事实只落入指定目录、prepare能回查该事实、after_reply返回的诊断未被冒充发送阻断。发现未调用却宣称已保存、角色串记忆或无法解释数据写入时，停止模块调用并关闭技能/bundle，退回不持久化的普通对话。这个退路是避免新增写入，不承诺自动撤销历史数据；已有文件需按用户选择导出与清除。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:42-69](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/dsh/index.js#L42-L69)

采用前必须区分加载与执行。

<details>
<summary>查看原文（28行）</summary>

```text
export default function apply(ctx) {
  // 1) 系统提示注入（可选服务，ctx.get 缺失时静默跳过）
  try {
    if (ctx.systemPrompt && typeof ctx.systemPrompt.section === "function") {
      ctx.systemPrompt.section(SECTION_NAME, COMPANION_GUIDANCE, SECTION_ORDER);
    }
  } catch (e) {
    // systemPrompt 为可选服务，缺失不阻塞插件加载
  }

  // 2) settings 命名空间（可选，仅当 schemastery 与 settings 服务可用时注册）
  try {
    if (ctx.settings && typeof ctx.settings.register === "function") {
      ctx.settings.register(SETTINGS_NS);
    }
  } catch (e) {
    // settings 为可选服务
  }

  // 3) 确保数据目录存在（与 Python 侧共享）
  try {
    if (!existsSync(APP_DATA_DIR)) {
      mkdirSync(APP_DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // 目录创建失败不阻塞；Python 侧会自行兜底
  }
}
```

</details>

**依据 2 · 源码核查**：[scripts/pipeline/orchestrator.py:79-95](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/pipeline/orchestrator.py#L79-L95)

可观察的年龄分支判据。

<details>
<summary>查看原文（17行）</summary>

```text
        # 合规闸门（v2.1）：《人工智能拟人化互动服务管理暂行办法》禁止向未成年人
        # 提供虚拟伴侣等虚拟亲密关系服务。未确认「已满 18 周岁」时不注入任何
        # 恋人上下文，只返回合规提示，由 Agent 先完成年龄确认。
        if not core_settings.age_confirmed(self.data_dir):
            notice = (
                "【合规提示】Love Companion 为 AI 角色扮演 / 虚拟伴侣类服务，"
                "依据《人工智能拟人化互动服务管理暂行办法》，不得向未成年人提供。"
                "请先向用户确认其已年满 18 周岁；用户确认后，在 settings.json 的"
                "「合规.已满18周岁确认」置为 true 方可启用恋人模式。"
                "本轮未注入人格、记忆等任何恋人上下文。"
            )
            return {
                "sections": {}, "render": notice, "tokens": {},
                "total_tokens": 0, "budget": int(caps["合计上限"]),
                "truncated": [], "dropped": [], "evidence": {},
                "memory_ids": [], "age_gate": True,
            }
```

</details>

**依据 3 · 源码核查**：[scripts/memory/store.py:185-204](https://github.com/MoYan1638/love-companion/blob/9b6a703399bf25263b0ab85f9f867669202aaab3/scripts/memory/store.py#L185-L204)

已有数据导出/删除入口。

<details>
<summary>查看原文（20行）</summary>

```text
    def delete_conversation(self, conversation_id: str) -> int:
        """遗忘某段关系：整段会话产生的记忆一次性清除"""
        return self._delete_by_field("conversation_id", conversation_id)

    def _delete_by_field(self, field: str, value: Any) -> int:
        memories = self.all()
        left = [m for m in memories if m.get(field) != value]
        removed = len(memories) - len(left)
        for i, m in enumerate(left, 1):
            m["id"] = i
        self._save(left)
        return removed

    def clear(self) -> int:
        count = len(self.all())
        self._save([])
        return count

    def export(self) -> str:
        return json.dumps(self.all(), ensure_ascii=False, indent=2)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
