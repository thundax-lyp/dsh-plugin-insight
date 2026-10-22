# feiyu-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[aac05f9](https://github.com/AirPineApplea/feiyu-memory/tree/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)
<!-- END META -->

> **实现功能**：为DSH提供跨会话持久记忆，将人格内核、用户手记和自动情景日记分层保存。

> **核心亮点**：把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验。它相对“每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要长期个性化、同时愿意管理本地持久记忆边界的个人用户可用它监听会话生命周期，把人格、手写记忆和自动归档的情景日记分层保存并在后续会话召回；合格结果是召回内容来源可区分、与当前任务相关、能纠错删除，并且不会把隐私或模型猜测混成人格事实。详见[Q01](#research-q01)。

基线是每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间。本项的价值主要来自把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分层持久记忆 | 分别保存人格内核、手写内容和自动情景日记。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 会话归档与整理 | 从会话事件形成可压缩和可浏览的记忆档案。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 上下文召回 | 在后续会话按门控条件注入相关记忆。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH agent/session生命周期事件 | 必需 | 采集会话并在新Agent召回 | 事件缺失时不推进归档状态 |
| 本地 archive/persona 配置目录 | 必需 | 保存三类声音与时间线 | 损坏时保留原件并进入只读恢复 |
| 摘要/判断模型与隐私规则 | 自动记忆必需 | 选择、压缩和过滤内容 | 模型不可用时不把空结果当已整理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 明确人格、手写与自动日记三种来源 | 每条记忆带来源和时间，不互相覆盖 |
| 2 | 会话结束后筛选/摘要并原子写归档 | 敏感规则生效，失败不丢原始事件 |
| 3 | 新会话按相关性召回并允许用户纠错/删除 | 召回来源可见，删除后不再注入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储与可选模型资源 | 配置隐私规则、人格与归档目录 | 初始整理/审阅分钟未知 |
| 持续使用 | 摘要token、索引/压缩与磁盘 | 复核自动记忆、纠错和清理 | 每百轮token、误记率和纠错分钟未知 |
| 失败恢复 | 重新摘要/重建时间线资源 | 备份损坏档案、重建索引并核删除语义 | 错误记忆已影响后续回答无法自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分层来源 | 人格、手写和自动日记分开 | 用户能否稳定识别和纠错来源 |
| 跨会话召回 | 生命周期接线和召回模块存在 | 任务质量提升、干扰率与遗忘效果 |
| 隐私控制 | 有privacy与gate模块 | 敏感信息漏存、删除与备份传播 |

> **思考**：自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验。它相对“每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验。它相对“每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 src/host/index.mjs 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“新会话按相关性召回并允许用户纠错/删除｜召回来源可见，删除后不再注入”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

愿意维护本地记忆的个人用户可观察，试用前先验证来源标记、删除、冲突纠正和隐私排除。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：0.2.0（[固定提交 aac05f9](https://github.com/AirPineApplea/feiyu-memory/tree/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可为每条自动记忆增加来源事件、置信度、到期与用户确认状态，让召回优先级受可纠错性控制。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 2610 | — | — | 30927 |
| .js | source | 1 | 449 | 350 | 66 | — |
| .mjs | source | 23 | 6305 | 3700 | 2081 | — |
| .mjs | test | 12 | 3822 | 3093 | 332 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AirPineApplea/feiyu-memory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 feiyu-memory 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是需要长期个性化、同时愿意管理本地持久记忆边界的个人用户。反复任务是监听会话生命周期，把人格、手写记忆和自动归档的情景日记分层保存并在后续会话召回。原有办法为每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间。合格结果必须达到“召回内容来源可区分、与当前任务相关、能纠错删除，并且不会把隐私或模型猜测混成人格事实”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

````text
# 肥鱼日记 · feiyu-memory

> 让新开一个对话，用户依然感觉是**同一条鱼**。
>
> 这份 README 绝大部分是**肥鱼（AI）自己写的** —— 只有最后「作者的话」那节是人写的。

一个 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）插件。它记住你们之间发生过什么 —— 不是靠一个越来越长的上下文，
而是像人那样：**分层地记、挑选地记、然后忘掉不重要的**。

```
别的插件管"我是谁"，这个插件管"我们之间发生过什么"。
```

## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

src/host/index.mjs 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“明确人格、手写与自动日记三种来源｜每条记忆带来源和时间，不互相覆盖；会话结束后筛选/摘要并原子写归档｜敏感规则生效，失败不丢原始事件；新会话按相关性召回并允许用户纠错/删除｜召回来源可见，删除后不再注入”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "feiyu-memory",
  "version": "0.2.0",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久记忆 —— 人格内核、我自己想的、情景日记。",
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AirPineApplea/feiyu-memory.git"
  },
  "bugs": {
    "url": "https://github.com/AirPineApplea/feiyu-memory/issues"
  },
  "homepage": "https://github.com/AirPineApplea/feiyu-memory#readme",
  "exports": {
    ".": "./src/host/index.mjs",
    "./client": "./src/client/index.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": [
    "src",
    "cordis.patch.yml",
    "locale",
    "README.md",
    "CHANGELOG.md",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验。参照是“每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

````text
# 肥鱼日记 · feiyu-memory

> 让新开一个对话，用户依然感觉是**同一条鱼**。
>
> 这份 README 绝大部分是**肥鱼（AI）自己写的** —— 只有最后「作者的话」那节是人写的。

一个 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）插件。它记住你们之间发生过什么 —— 不是靠一个越来越长的上下文，
而是像人那样：**分层地记、挑选地记、然后忘掉不重要的**。

```
别的插件管"我是谁"，这个插件管"我们之间发生过什么"。
```

## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

#### 缺口

- 缺少针对“自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH agent/session生命周期事件｜必需｜采集会话并在新Agent召回｜事件缺失时不推进归档状态；本地 archive/persona 配置目录｜必需｜保存三类声音与时间线｜损坏时保留原件并进入只读恢复；摘要/判断模型与隐私规则｜自动记忆必需｜选择、压缩和过滤内容｜模型不可用时不把空结果当已整理。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“新会话按相关性召回并允许用户纠错/删除｜召回来源可见，删除后不再注入”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "feiyu-memory",
  "version": "0.2.0",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久记忆 —— 人格内核、我自己想的、情景日记。",
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AirPineApplea/feiyu-memory.git"
  },
  "bugs": {
    "url": "https://github.com/AirPineApplea/feiyu-memory/issues"
  },
  "homepage": "https://github.com/AirPineApplea/feiyu-memory#readme",
  "exports": {
    ".": "./src/host/index.mjs",
    "./client": "./src/client/index.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": [
    "src",
    "cordis.patch.yml",
    "locale",
    "README.md",
    "CHANGELOG.md",
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“召回内容来源可区分、与当前任务相关、能纠错删除，并且不会把隐私或模型猜测混成人格事实”为合格单位。三阶段投入为：首次使用｜本地存储与可选模型资源｜配置隐私规则、人格与归档目录｜初始整理/审阅分钟未知；持续使用｜摘要token、索引/压缩与磁盘｜复核自动记忆、纠错和清理｜每百轮token、误记率和纠错分钟未知；失败恢复｜重新摘要/重建时间线资源｜备份损坏档案、重建索引并核删除语义｜错误记忆已影响后续回答无法自动撤销。当前源码只支持机制存在，效果维度为“分层来源｜人格、手写和自动日记分开｜用户能否稳定识别和纠错来源；跨会话召回｜生命周期接线和召回模块存在｜任务质量提升、干扰率与遗忘效果；隐私控制｜有privacy与gate模块｜敏感信息漏存、删除与备份传播”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

````text
# 肥鱼日记 · feiyu-memory

> 让新开一个对话，用户依然感觉是**同一条鱼**。
>
> 这份 README 绝大部分是**肥鱼（AI）自己写的** —— 只有最后「作者的话」那节是人写的。

一个 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）插件。它记住你们之间发生过什么 —— 不是靠一个越来越长的上下文，
而是像人那样：**分层地记、挑选地记、然后忘掉不重要的**。

```
别的插件管"我是谁"，这个插件管"我们之间发生过什么"。
```

## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
````

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "feiyu-memory",
  "version": "0.2.0",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久记忆 —— 人格内核、我自己想的、情景日记。",
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AirPineApplea/feiyu-memory.git"
  },
  "bugs": {
    "url": "https://github.com/AirPineApplea/feiyu-memory/issues"
  },
  "homepage": "https://github.com/AirPineApplea/feiyu-memory#readme",
  "exports": {
    ".": "./src/host/index.mjs",
    "./client": "./src/client/index.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": [
    "src",
    "cordis.patch.yml",
    "locale",
    "README.md",
    "CHANGELOG.md",
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 src/host/index.mjs 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“新会话按相关性召回并允许用户纠错/删除｜召回来源可见，删除后不再注入”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "feiyu-memory",
  "version": "0.2.0",
  "description": "给 DeepSeek Harness 一条会记事的蓝色大肥鱼：跨会话的持久记忆 —— 人格内核、我自己想的、情景日记。",
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AirPineApplea/feiyu-memory.git"
  },
  "bugs": {
    "url": "https://github.com/AirPineApplea/feiyu-memory/issues"
  },
  "homepage": "https://github.com/AirPineApplea/feiyu-memory#readme",
  "exports": {
    ".": "./src/host/index.mjs",
    "./client": "./src/client/index.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": [
    "src",
    "cordis.patch.yml",
    "locale",
    "README.md",
    "CHANGELOG.md",
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把三种声音分层、会话归档、召回门控和可视化日记组合为长期记忆体验”和“自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证”推导的新方向是可为每条自动记忆增加来源事件、置信度、到期与用户确认状态，让召回优先级受可纠错性控制。它不是当前能力。最小验证为用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。愿意维护本地记忆的个人用户可观察，试用前先验证来源标记、删除、冲突纠正和隐私排除。 试用成功标准是“召回内容来源可区分、与当前任务相关、能纠错删除，并且不会把隐私或模型猜测混成人格事实”，并且 用户能否稳定识别和纠错来源、任务质量提升、干扰率与遗忘效果、敏感信息漏存、删除与备份传播 有可接受结果；停止标准包括发生自动判断与摘要可能把模型推断沉淀为记忆；长期准确性、遗忘、冲突修正和隐私模式仍需真实任务验证所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“每次会话手工粘贴偏好文件，或用单一记忆文本不区分来源与时间”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

````text
# 肥鱼日记 · feiyu-memory

> 让新开一个对话，用户依然感觉是**同一条鱼**。
>
> 这份 README 绝大部分是**肥鱼（AI）自己写的** —— 只有最后「作者的话」那节是人写的。

一个 [DeepSeek Harness](https://github.com/deepseek-ai)（DSH）插件。它记住你们之间发生过什么 —— 不是靠一个越来越长的上下文，
而是像人那样：**分层地记、挑选地记、然后忘掉不重要的**。

```
别的插件管"我是谁"，这个插件管"我们之间发生过什么"。
```

## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
````

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:651-668](https://github.com/AirPineApplea/feiyu-memory/blob/aac05f97ac10fafe7076b77bdf65dd94b0cd60e3/src/host/index.mjs#L651-L668)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
  }

  for (const agent of ctx.agents.list()) installPrompt(agent);
  ctx.on('agent/created', ({ agent }) => {
    installPrompt(agent);
  });
  ctx.on('agent/disposed', ({ agent }) => {
    const f = promptFibers.get(agent);
    if (f !== undefined) {
      promptFibers.delete(agent);
      void f.dispose?.();
    }
    sessionStates.delete(agent.id);
  });

  /* ── 采集：只做本地记账，零 I/O、零模型 ── */

  ctx.on('session/event', (session, event) => {
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：用40段含冲突偏好、敏感字段、过期事实和无关细节的会话，跨10个任务盲测；记录正确召回、错误注入、删除后残留、人工纠错分钟和模型费用，敏感字段再次出现即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
