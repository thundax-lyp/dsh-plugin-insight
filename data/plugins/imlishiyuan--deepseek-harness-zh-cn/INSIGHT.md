# 中文语言提醒

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[285d5a3](https://github.com/imlishiyuan/deepseek-harness-zh-cn/tree/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/imlishiyuan/deepseek-harness-zh-cn) [![npm 30d 3,043](https://img.shields.io/static/v1?label=npm+30d&message=3%2C043&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-zh-cn) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-harness-zh-cn)
<!-- END META -->

> **功能**：在每轮首步为 DeepSeek Harness 注入简体中文思考与回答的语言提醒。

> **亮点**：已有贡献是将固定语言提醒打包为 profile 插件并在每轮首步附加，有明确消息producer来源；相对手动每次提醒省去重复输入，但相对持久说明的效果增量尚未证明。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：最影响采用的是用户消息级提醒能否在不损坏代码与显式语言例外的前提下，比简单 AGENTS.md 更稳定；源码和作者说明均不支持强制中文思考。Git 源码还缺少导出所需的构建输出。见 [Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁需要每轮中文提醒，为什么作者仍优先推荐 AGENTS.md？](#detail-section-11)
  - [Q02 · 插件什么时候附加消息，拒绝、取消和后续步骤如何处理？](#detail-section-12)
  - [Q03 · 中文思考能否保证，如何处理指令冲突与推理不可见？](#detail-section-13)
  - [Q04 · 安装、日常使用和失败退出分别有哪些依赖与成本？](#detail-section-14)
  - [Q05 · 哪类用户值得试，怎样判断每轮提醒是否必要？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向习惯用简体中文查看 DSH 处理轨迹和回答的用户，在每轮首步自动加入语言提醒，并保留代码、路径与标识符原文。

直接维护项目或全局 AGENTS.md 是作者优先推荐的替代方式；两者都属于提示引导，不能强制模型内部语言。见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 首步中文语言提醒 | 自动给模型加入语言偏好 | 用户消息级提示，不能强制推理语言 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持 agent/pre-step 的 DSH | 必需 | 调用首步监听器 | 提醒不能进入请求 |
| 可解析的 dsh-llm 与 createUserMessage | 必需 | 顶层导入并创建消息 | 模块加载失败，清单optional不代表无需依赖 |
| lib/index.js 构建产物 | 必需 | 根包导出入口 | 固定Git树未包含，需核实发布包或自行构建 |
| 遵从提示的模型 | 效果条件 | 生成中文叙述 | 只能提示，不能强制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户先试直接说明，确需时选profile和包版本 | 确认构建输出及依赖 |
| 加载 | 用户安装并核对补丁，重启宿主 | 配置出现挂载不等于模型遵从 |
| 执行 | 宿主每轮第一步附加提醒 | 拒绝/取消保留原结果 |
| 验收与退出 | 用户检查叙述、代码与语言例外 | 冲突则禁用挂载并开新轮次 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包构建/存储，金额未知 | 核对profile、依赖和产物，时长未知 | Git无lib，不可假定直接可加载 |
| 持续使用 | 每轮首步新增文本token，费用未知 | 检查叙述与代码，时长未知 | 无独立额外模型调用 |
| 失败恢复 | 排障重试费用未知 | 检查加载日志或禁用挂载 | 历史消息不自动撤回 |
| 退出 | 不再新增提醒 | 移除挂载，保留说明文件 | 具体耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少手动重复提醒 | 源码自动首步附加固定文本 | 相对AGENTS.md的净改善 |
| 中文叙述 | 文本明确要求中文并保留标识符 | 模型遵从率及不可见推理语言 |
| 任务成本 | 无额外网络/模型执行链 | 总token、人工时间和单位合格任务费用 |

> **思考**：最影响采用的是用户消息级提醒能否在不损坏代码与显式语言例外的前提下，比简单 AGENTS.md 更稳定；源码和作者说明均不支持强制中文思考。Git 源码还缺少导出所需的构建输出。见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有贡献是将固定语言提醒打包为 profile 插件并在每轮首步附加，有明确消息producer来源；相对手动每次提醒省去重复输入，但相对持久说明的效果增量尚未证明。见 [Q01](#research-q01)、[Q02](#research-q02)。

首步guard和producer自有kind使行为范围与归属清楚，见 [Q02](#research-q02)。可借鉴的是提醒producer绑定，而非其语言文本具有强制力。清单可选peer与顶层运行时import并存、Git树缺lib意味着源码可读不等于构建发布可用，见 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最影响采用的是用户消息级提醒能否在不损坏代码与显式语言例外的前提下，比简单 AGENTS.md 更稳定；源码和作者说明均不支持强制中文思考。Git 源码还缺少导出所需的构建输出。见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先合并维护已有项目或全局 AGENTS.md；确有每轮忘带中文偏好的摩擦，再核对包内构建输出和依赖，在独立 profile 比较叙述语言与代码保持。若出现语言冲突、代码被错误翻译或额外维护不值得，就禁用挂载并退回说明文件，具体判据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

首步消息注入和producer归属由源码支持；中文思考、任务效果和假设均未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、tsconfig.json、src/index.ts、README.md、AGENTS.md.example 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已读取固定提交的package、补丁、tsconfig、全部src/index.ts、AGENTS.md.example与README相关声明；通过完整Git树核实lib未提交。checkout为稀疏检出，额外原件从固定Git blob读取。
- 下一步：- 已检查源码及构建映射。
- 未运行目标插件、构建、模型或真实宿主。
- 模型语言效果、发布包文件和具体版本兼容仍有明确未知。

**分析版本**

- **仓库**：[imlishiyuan/deepseek-harness-zh-cn](https://github.com/imlishiyuan/deepseek-harness-zh-cn)
- **版本号**：0.1.5（[固定提交 285d5a3](https://github.com/imlishiyuan/deepseek-harness-zh-cn/tree/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设是长对话中逐轮首步提醒相对持久说明降低叙述语言漂移。按 [Q05](#research-q05) 比较合格叙述、代码保持、总token及人工投入；结果相当或冲突增加即否定采用增益。

- 已检查源码及构建映射。
- 未运行目标插件、构建、模型或真实宿主。
- 模型语言效果、发布包文件和具体版本兼容仍有明确未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 258 | — | — | 1425 |
| .ts | source | 1 | 49 | 36 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/imlishiyuan/deepseek-harness-zh-cn/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对每轮中文语言提醒的真实注入、替代方式和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要每轮中文提醒，为什么作者仍优先推荐 AGENTS.md？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是习惯读简体中文、反复查看 Agent 处理轨迹和最终回答的 DSH 用户，合格结果是普通叙述使用中文，同时命令、标识符和路径原样保留。作者把复制全局 AGENTS.md 列为首选，把插件列为第二种方式，并说明通用提醒插件也可完成类似工作。因此可识别的增量是把固定语言规则包装为 profile 插件，并在每轮第一步重复附加，减少用户在每次提问时重写要求；它没有提供新的翻译模型或强制语言控制。

直接维护全局说明文件更简单、更可定制。固定 Git 树包含 AGENTS.md.example，内容明确允许项目自身语言规则优先，因此已有说明文件是直接而可定制的替代；复制前应合并原说明，不能覆盖已有项目约定。没有同模型、同任务的对照，不能断言插件比持久说明更能提高遵从率，偶尔用中文的用户也未必值得增加一个加载依赖。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-18](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/README.md#L13-L18)

作者明确给出优先替代和插件第二方案。

```text
This project offers two ways (**choose one; the first is recommended**) to turn your DSH's reasoning and output into Simplified Chinese, so Chinese-speaking users can read the trajectory and processing directly without translation overhead:

- **Method 1 (recommended, simplest)**: copy `AGENTS.md.example` to `~/.dsh/AGENTS.md`.
- **Method 2 (plugin)**: install this package from npm and mount it in the profile.

> **Tip**: this plugin's "Chinese-first" rules can also be achieved with the [keep-reminder](https://github.com/imlishiyuan/keep-reminder) plugin — put the same rules into a project's `.keep-reminder` file, and customize the content freely (not limited to language).
```

**依据 2 · 源码核查**：[src/index.ts:26-31](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L26-L31)

固定语言文本覆盖普通中文叙述，保留代码与标识符英文。

```text
const ZH_DIRECTIVE = [
  '始终使用简体中文进行思考（reasoning）与所有最终回答。',
  '计划、工具调用、总结、代码注释同样使用简体中文。',
  '仅代码、命令、文件路径、变量名、API 名称等必须原样保留的内容使用英文。',
  '除非用户明确要求其他语言，否则本规则优先。',
].join('\n')
```

**依据 3 · 源码核查**：[AGENTS.md.example:1-6](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/AGENTS.md.example#L1-L6)

固定Git原件包含语言规则，并明确项目语言例外；稀疏检出不等于文件缺失。

```text
# 语言规则

- 默认始终使用简体中文进行思考（reasoning）与所有最终回答。
- 计划、工具调用、总结、代码注释同样使用简体中文。
- 仅代码、命令、文件路径、变量名、API 名称等必须原样保留的内容使用英文。
- 若某个工作区/项目的 AGENTS.md 明确指定了其他语言，则以该项目级规则为准。
```

#### 缺口

- 没有重复任务的同条件语言遵从和人工阅读对照。
  **影响**：只能判断场景与机制，不能量化减少翻译负担。
  **进一步探讨**：取同一模型的一组中文与混合技术任务，对比全局说明和插件的合格叙述比例及人工改写时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件什么时候附加消息，拒绝、取消和后续步骤如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle 补丁按 deepseek-harness-zh-cn 加载根包，包导出指向 lib/index.js；tsconfig 将 src 编译到 lib。实际源码 apply 注册 prepend 的 agent/pre-step 瀑布监听器，先 await next() 取得其他处理结果，再检查 reject 或取消信号；这些情况下原结果直接返回。仅 step === 1 时，它返回 enter 并保留 decision.messages，再附加 createUserMessage 生成的语言提醒。每轮后续步骤不再附加。

消息使用 producer 自有的 plugin:deepseek-harness-zh-cn 来源，form=snapshot，并把语言文本写入 sections。这有助于将插件消息归属到具体 producer，避免沿用共享 plugin kind。它不改模型权重、推理参数或工具执行器，也没有另一个服务进程。源码入口短，接线与拒绝/取消分支可直接追踪；没有运行证据证明所选宿主的瀑布契约完全一致。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/cordis.patch.yml#L1-L3)

bundle按根包名挂载。

```text
- insert:
    - id: deepseek-harness-zh-cn
      name: deepseek-harness-zh-cn
```

**依据 2 · 源码核查**：[tsconfig.json:1-12](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/tsconfig.json#L1-L12)

src 到 lib 的编译映射。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "lib",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:18-23](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L18-L23)

消息 producer 类型与身份。

```text
const SOURCE_KIND = 'plugin:deepseek-harness-zh-cn'

declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    'plugin:deepseek-harness-zh-cn': { kind: 'plugin:deepseek-harness-zh-cn' } & ContextFormed
  }
```

**依据 4 · 源码核查**：[src/index.ts:33-49](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L33-L49)

完整真实注入链和失败/取消/首步判断。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.on('agent/pre-step', async ({ step, signal }, next): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject' || signal.aborted) return decision
    if (step !== 1) return decision
    return {
      kind: 'enter',
      messages: [
        ...decision.messages,
        createUserMessage({
          content: [{ type: 'text', text: `<system-reminder>\n${ZH_DIRECTIVE}\n</system-reminder>` }],
          source: { kind: SOURCE_KIND, form: 'snapshot', sections: [{ name, text: ZH_DIRECTIVE }] },
        }),
      ],
    }
  }, { prepend: true })
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 中文思考能否保证，如何处理指令冲突与推理不可见？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能保证。ZH_DIRECTIVE 的字符串要求始终用简体中文思考和回答，但它实际被 createUserMessage 包装为用户消息，文本中的 system-reminder 标签不会把它升级成模型系统权限。作者也明确承认没有强制 reasoning 语言的 Harness/API 开关，技术任务仍可能输出英文推理。可见中文回答不能证明不可见内部推理使用中文。

规则保留用户明确要求其他语言的例外，也允许代码、命令、路径和 API 名称用英文，因此合格判据不能是逐字符全中文。规则还要求计划、工具调用和代码注释使用中文，可能与项目自身协作语言习惯不同；使用前应检查本项目约束。首步提醒也不能证明长轮次中后续内容始终遵从。核心限制是提示级引导而非语言策略执行器，不是从源码发现模型必定拒绝中文。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:26-31](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L26-L31)

语言要求、英文例外和用户其他语言例外。

```text
const ZH_DIRECTIVE = [
  '始终使用简体中文进行思考（reasoning）与所有最终回答。',
  '计划、工具调用、总结、代码注释同样使用简体中文。',
  '仅代码、命令、文件路径、变量名、API 名称等必须原样保留的内容使用英文。',
  '除非用户明确要求其他语言，否则本规则优先。',
].join('\n')
```

**依据 2 · 源码核查**：[src/index.ts:38-45](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L38-L45)

语言提醒实际是用户消息，不是模型系统指令。

```text
    return {
      kind: 'enter',
      messages: [
        ...decision.messages,
        createUserMessage({
          content: [{ type: 'text', text: `<system-reminder>\n${ZH_DIRECTIVE}\n</system-reminder>` }],
          source: { kind: SOURCE_KIND, form: 'snapshot', sections: [{ name, text: ZH_DIRECTIVE }] },
        }),
```

**依据 3 · 作者声明**：[README.md:71-79](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/README.md#L71-L79)

作者承认推理语言无法强制。

```text
## Scope and Limitations

- Affects both the model's final answer and its reasoning (thinking) channel.
- There is **no harness or DeepSeek API switch that forces the reasoning language**; on technical tasks the model's `reasoning_content` may still be English. A fully Chinese prompt maximizes the probability but does not guarantee it.

## How It Works

- **Method 1**: `~/.dsh/AGENTS.md` is injected by `dsh-agent-instructions` as a `<system-reminder>` user message — guidance-level, lower priority than the system prompt and direct user instructions.
- **Method 2**: the plugin listens to the `agent/pre-step` waterfall and appends a `<system-reminder>` user message to the request batch at the first step of each turn, reinforcing the Chinese rule once per turn.
```

#### 缺口

- 没有各模型、长轮次及互相冲突指令下的遵从率数据。
  **影响**：不能把思考语言或持续遵从写成已验证能力。
  **进一步探讨**：分别统计可见reasoning和最终叙述，不可见思考记未知；设置用户改语言和英文代码任务作为反例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、日常使用和失败退出分别有哪些依赖与成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

运行需要兼容 agent/pre-step 和 createUserMessage 的 DSH/LLM 包；虽然清单把 dsh-llm peer 标为可选，src/index.ts 顶层却有运行时 import，目标环境仍必须能解析它。固定 Git 树未包含 lib，而 main/exports 指向 lib/index.js，仅有 prepublishOnly 构建脚本，不能把 Git 源码直接加载当成已有可用产物；应使用已核实含构建输出的发布包，或自行构建后核对输出。

首次操作是选择 profile、安装包并核对最终补丁；手动安装路径还需维护 profile 挂载。持续使用会在每轮第一步增加一段提示文本，实际模型 token 及费用随 tokenizer、模型和调用量变化，当前没有测量。普通使用不增加独立网络服务或额外模型调用。异常时由用户检查依赖解析、补丁和消息来源；停止使用应从 profile 移除/禁用该挂载并开启新轮次，已经记录的历史消息不会因禁用而被撤回。若只需固定语言偏好，维护一份全局或项目说明可减少插件版本维护。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-15](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/package.json#L8-L15)

main和文件列表要求lib，固定Git树检查未发现lib。

```text
  "main": "./lib/index.js",
  "files": [
    "lib",
    "README.md",
    "README.zh.md",
    "LICENSE",
    "AGENTS.md.example",
    "cordis.patch.yml"
```

**依据 2 · 源码核查**：[package.json:24-41](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/package.json#L24-L41)

构建脚本、可选peer和开发依赖；声明可选不覆盖运行时import。

<details>
<summary>查看原文（18行）</summary>

```text
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-llm": "*"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-llm": {
      "optional": true
    }
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-agent": "^0.1.7-rc.2",
    "@deepseek-ai/dsh-llm": "^0.1.7-rc.2",
    "typescript": "^5"
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1-5](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L1-L5)

createUserMessage是运行时依赖。

```text
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-agent'
import type { PreStepDecision } from '@deepseek-ai/dsh-agent'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { ContextFormed } from '@deepseek-ai/dsh-llm'
```

**依据 4 · 作者声明**：[README.md:43-69](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/README.md#L43-L69)

作者安装、手动挂载与重启步骤。

<details>
<summary>查看原文（27行）</summary>

````text
### Method 2: Install the npm plugin

**A. Official command** (backs onto pnpm; install pnpm first):

```sh
npm i -g pnpm
dsh plugin --profile web add deepseek-harness-zh-cn
```

**B. Install with npm directly into the profile directory**:

```sh
cd ~/.dsh/profiles/web    # Windows: C:\Users\<you>\.dsh\profiles\web
npm install deepseek-harness-zh-cn --save
```

> Note: this `npm install` runs inside the **DSH profile directory**, not this plugin's project directory.

Mount it in `~/.dsh/profiles/<name>/cordis.patch.yml`:

```yaml
- insert:
    - id: dsh-zh
      name: 'deepseek-harness-zh-cn'
```

Restart `dsh web`.
````

</details>

**依据 5 · 源码核查**：[src/index.ts:33-48](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L33-L48)

每轮首步仅加消息，没有新模型/HTTP调用。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.on('agent/pre-step', async ({ step, signal }, next): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject' || signal.aborted) return decision
    if (step !== 1) return decision
    return {
      kind: 'enter',
      messages: [
        ...decision.messages,
        createUserMessage({
          content: [{ type: 'text', text: `<system-reminder>\n${ZH_DIRECTIVE}\n</system-reminder>` }],
          source: { kind: SOURCE_KIND, form: 'snapshot', sections: [{ name, text: ZH_DIRECTIVE }] },
        }),
      ],
    }
  }, { prepend: true })
```

</details>

#### 缺口

- 没有核验注册表当前发布包的构建文件或实际依赖解析。
  **影响**：发布包可安装性和具体宿主兼容组合仍未知。
  **进一步探讨**：核对确切版本归档中的lib/index.js及其依赖，并在隔离profile读取加载日志。
- 缺少模型用量、任务频率和人工排障记录。
  **影响**：不能给出每个合格中文任务的现金费用或节时。
  **进一步探讨**：同批任务记录总输入token、合格结果数、人工改写及维护耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪类用户值得试，怎样判断每轮提醒是否必要？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前更适合观察，而非优先增加插件。已经维护项目或全局说明、希望中文输出的用户，先用直接说明即可；确有跨项目忘带语言规则的重复摩擦时，可以在独立 profile 对固定包做受控比较。主要增量是 profile 化和每轮首步重复，不是比普通说明更高权限的强制机制。发布产物和具体宿主组合尚未核实，不宜把源码短小等同于安装成本已低。

可验证假设是：在长对话或多次新轮次里，首步显式提醒比仅全局说明减少普通叙述跑回英文，而不损坏代码原文。用同模型、同预算和固定任务集分配全局说明与插件两组，分别检查叙述语言、代码标识符保持率、用户要求切换语言能否生效，并记录总token和人工改写时间。只有合格叙述改善且额外维护/提示成本可接受才支持假设；若两组相当、插件冲突更多或代码被错误翻译，就保留原说明文件并退出插件。这个实验尚未执行，不能计为现有贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-18](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/README.md#L13-L18)

作者自列简单替代，不把包装当必要性。

```text
This project offers two ways (**choose one; the first is recommended**) to turn your DSH's reasoning and output into Simplified Chinese, so Chinese-speaking users can read the trajectory and processing directly without translation overhead:

- **Method 1 (recommended, simplest)**: copy `AGENTS.md.example` to `~/.dsh/AGENTS.md`.
- **Method 2 (plugin)**: install this package from npm and mount it in the profile.

> **Tip**: this plugin's "Chinese-first" rules can also be achieved with the [keep-reminder](https://github.com/imlishiyuan/keep-reminder) plugin — put the same rules into a project's `.keep-reminder` file, and customize the content freely (not limited to language).
```

**依据 2 · 源码核查**：[src/index.ts:26-48](https://github.com/imlishiyuan/deepseek-harness-zh-cn/blob/285d5a3281661f3d0cf0df5e4b2d0adc7a401bcd/src/index.ts#L26-L48)

首步重复及语言例外是对照假设的具体机制。

<details>
<summary>查看原文（23行）</summary>

```text
const ZH_DIRECTIVE = [
  '始终使用简体中文进行思考（reasoning）与所有最终回答。',
  '计划、工具调用、总结、代码注释同样使用简体中文。',
  '仅代码、命令、文件路径、变量名、API 名称等必须原样保留的内容使用英文。',
  '除非用户明确要求其他语言，否则本规则优先。',
].join('\n')

export function apply(ctx: Context): void {
  ctx.on('agent/pre-step', async ({ step, signal }, next): Promise<PreStepDecision> => {
    const decision = await next()
    if (decision.kind === 'reject' || signal.aborted) return decision
    if (step !== 1) return decision
    return {
      kind: 'enter',
      messages: [
        ...decision.messages,
        createUserMessage({
          content: [{ type: 'text', text: `<system-reminder>\n${ZH_DIRECTIVE}\n</system-reminder>` }],
          source: { kind: SOURCE_KIND, form: 'snapshot', sections: [{ name, text: ZH_DIRECTIVE }] },
        }),
      ],
    }
  }, { prepend: true })
```

</details>

#### 缺口

- 每轮显式提醒相对全局说明是否带来净改善未知。
  **影响**：不能据机制声称插件更有效或值得持续安装。
  **进一步探讨**：进行同条件任务比较，以合格叙述、代码保持、总token和人工时间共同决定是否继续。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
