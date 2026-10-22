# Amoji for dsh

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[abb823a](https://github.com/5101good/amoji/tree/abb823a78660bc3853c46545e765ed6af4508298/adapters/dsh)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在人与模型之间传递带固定文字语义的表情，并管理版本、表情包和市场发布。

> **核心亮点**：相对把普通表情图片交给视觉模型猜测，贡献是把人看的视觉与模型读的不可变版本语义分开，并让消息绑定真实会话/回合与选择令牌；accepted与observed、图像rendered分层避免把排队当落盘或可见。DSH提供原生消息与会话控制接口，共享核心提供库与资产；适配器增量是可靠投递关联与原生界面/工具接线，不将整个共享库规模算入本组件。

> **风险与缺陷**：固定语义是否足以防止错误理解与重复执行？expressionMessageText明确把语义视为数据、要求既有授权内理解意图，tool描述还要求核对主体对象，说明固定文字仍可能被模型反向使用或夸大成完成事实。宿主accepted并非落盘，unknown不得盲重试；任意新版DSH/模型组合也未保证兼容。跟踪源码中的runtime/client生成物不在adapter目录里，直接装源码子目录不等同于作者release tgz。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、流程与依赖](#detail-section-3)
  - [1.3 效果、成本与限制](#detail-section-4)
  - [1.4 核心贡献与工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

在DSH对话里用图像表达感受或协作意图的人看表情图，模型读取精确版本固定文字语义；交付可追溯的表情消息与状态，不能把表情当进度或授权凭据。

参照普通图像表情、自由文字释义与宿主原生消息；当前仅比较源码机制，不声称相对其他表情系统首创或任务效果更好。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

adapters/dsh/index.mjs连接要求指定能力的共享服务，src/dsh/host.ts注册search/resolve/emit文字工具和认证RPC；捕获真实session与turn身份、用selection_token发送，区分prepared/unknown/accepted/observed及独立rendered回执。

- **模型工具**：amoji_search/resolve/emit提供固定文字语义与选择令牌。
- **Host 路由**：认证RPC处理库、投递状态、显示及管理。
- **后台**：共享服务能力协商、会话回合绑定与生命周期清理。

DSH tools/sessions/sessionProjections/sessionController/connection/llm/agents/systemPrompt，API能力匹配的本地共享核心及Sharp等包依赖；市场origin为host配置，离线已安装库与在线发布是不同路径。

用户选择精确表情版本或模型search取得token→检查会话回合→提交原请求ID→宿主接受→核对原生消息成为observed→图像加载独立rendered；管理/导入/市场发布走独立确认与原operation恢复，不自动启用动作。

@amoji/dsh 1.1.0声明DSH 0.1.5-rc.2、Node>=24，安装说明使用release tgz；源码子目录引用runtime/client生成物，当前checkout并非可直接安装的成品包。shared API2/DB4与能力要求由入口/文档说明。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

减少对模型视觉解读的依赖并明确表达版本，在语义方向正确与投递可靠时才有价值；固定语义不证明模型理解正确，也不授权新的任务动作。

首次需匹配DSH和Node、核对release包与共享服务，区分DSH_HOME和AMOJI_DATA_DIR；持续维护语义版本、资产许可、模型兼容与未知结果恢复。文字建议按选定模型付费；现金/人工时间未实测，创作确认与市场投稿仍需人复核。

固定语义是否足以防止错误理解与重复执行？expressionMessageText明确把语义视为数据、要求既有授权内理解意图，tool描述还要求核对主体对象，说明固定文字仍可能被模型反向使用或夸大成完成事实。宿主accepted并非落盘，unknown不得盲重试；任意新版DSH/模型组合也未保证兼容。跟踪源码中的runtime/client生成物不在adapter目录里，直接装源码子目录不等同于作者release tgz。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对把普通表情图片交给视觉模型猜测，贡献是把人看的视觉与模型读的不可变版本语义分开，并让消息绑定真实会话/回合与选择令牌；accepted与observed、图像rendered分层避免把排队当落盘或可见。DSH提供原生消息与会话控制接口，共享核心提供库与资产；适配器增量是可靠投递关联与原生界面/工具接线，不将整个共享库规模算入本组件。

capture冻结agent/session/openTurnStartSeq并在异步后复核，消息视觉hash和原生rpcId关联，accepted/observed/rendered拆分可借鉴；移植需要宿主持久化与真实turn接口，不能只复制工具定义。

源码依据：[adapters/dsh/index.mjs](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/adapters/dsh/index.mjs)、[adapters/dsh/package.json](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/adapters/dsh/package.json)、[adapters/dsh/README.md](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/adapters/dsh/README.md)、[src/dsh/host.ts](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/src/dsh/host.ts)、[src/dsh/expression-message.ts](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/src/dsh/expression-message.ts)、[src/projection.ts](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/src/projection.ts)、[scripts/dsh-distribution.mjs](https://github.com/5101good/amoji/blob/abb823a78660bc3853c46545e765ed6af4508298/scripts/dsh-distribution.mjs)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：在DSH对话里用图像表达感受或协作意图的人看表情图，模型读取精确版本固定文字语义；交付可追溯的表情消息与状态，不能把表情当进度或授权凭据。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：amoji_search/resolve/emit提供固定文字语义与选择令牌。
- **Host 路由**：认证RPC处理库、投递状态、显示及管理。
- **后台**：共享服务能力协商、会话回合绑定与生命周期清理。

> **思考**：固定语义是否足以防止错误理解与重复执行？expressionMessageText明确把语义视为数据、要求既有授权内理解意图，tool描述还要求核对主体对象，说明固定文字仍可能被模型反向使用或夸大成完成事实。宿主accepted并非落盘，unknown不得盲重试；任意新版DSH/模型组合也未保证兼容。跟踪源码中的runtime/client生成物不在adapter目录里，直接装源码子目录不等同于作者release tgz。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对把普通表情图片交给视觉模型猜测，贡献是把人看的视觉与模型读的不可变版本语义分开，并让消息绑定真实会话/回合与选择令牌；accepted与observed、图像rendered分层避免把排队当落盘或可见。DSH提供原生消息与会话控制接口，共享核心提供库与资产；适配器增量是可靠投递关联与原生界面/工具接线，不将整个共享库规模算入本组件。

<a id="detail-section-9"></a>

### 1.8 使用建议

想用图像表达协作意图且能固定DSH版本的人，可先在隔离profile试基础表情；按release说明装成品包，逐条核对原生消息与图片状态，遇到未知结果查原请求，不重复发送。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认固定语义投影、上下文绑定及分层状态；作者macOS宿主证据未在本轮复现，构建产物和市场交易未验证。未来语义角色验收是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.1.0；版本日期：2026-10-21（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[abb823a7](https://github.com/5101good/amoji/tree/abb823a78660bc3853c46545e765ed6af4508298)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：完整adapter组件统计仅adapters/dsh，额外抽读src/dsh/host.ts、expression-message.ts、projection.ts与发布装配脚本；共享核心和UI未完整审计，不把adapter统计当整套系统规模。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：adapters/dsh；内容摘要：cee1b61067bc7f48f0921c4887554afe6a69617b0f238004bc2a802ac7a69782。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 27 | 27 | 1 | — |
| .md | source | 2 | 106 | — | — | 2145 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：在版本语义之外增加发送者角色、目标对象与允许意图的结构化契约，并在投递前后做同一会话断言，可减少“用户催进度”被AI当“已完成”的反向表达。依据是现有工具描述依赖模型自检主体对象，未实现通用语义角色验证。用同一批询问/澄清/暂停/反馈表情，在用户→AI与AI→用户两方向对照，统计方向误读、越权推断和自然回复成功率；语义结构可能增加创作门槛，不能牺牲可表达性强行通过。

隔离profile对照不同方向语义、accepted后断线、flush失败、回合变化、图片加载失败及同请求恢复，并核对release内容；未运行作者测试或真实宿主，不把作者报告提升为本轮host验收。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/5101good/amoji/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
