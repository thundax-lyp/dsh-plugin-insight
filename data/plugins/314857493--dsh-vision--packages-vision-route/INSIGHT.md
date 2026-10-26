# dsh-vision-route

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[10b0cbe](https://github.com/314857493/dsh-vision/tree/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-route)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) [![npm 30d 1,252](https://img.shields.io/static/v1?label=npm+30d&message=1%2C252&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route)
<!-- END META -->

> **实现功能**：把图片先交给智谱视觉转写，再把文本证据送入目标文本模型。

> **核心亮点**：支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用；贡献是路由层兼容，不是新的识图模型。 详见[Q03](#research-q03)。

> **风险与缺陷**：图片会离开本机，文字中间层会丢布局和细节；标签只能降低提示注入混淆，不能证明视觉服务不会误读。 详见[Q04](#research-q04)。

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
  - [Q01 · 场景：适合现有文本模型必须处理截图或历史附件、又没有原生视觉入口的场景？](#detail-section-11)
  - [Q02 · 机制：包装适配器拦截当前及历史图片，逐图调用智谱 GLM 生成文字，再把带来源标签的转写交给配置的 targetProvider。？](#detail-section-12)
  - [Q03 · 贡献：支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用？](#detail-section-13)
  - [Q04 · 局限：图片会离开本机，文字中间层会丢布局和细节？](#detail-section-14)
  - [Q05 · 依赖：必须有智谱 API key、可用模型和网络，并且 targetProvider 不能指回自身？](#detail-section-15)
  - [Q06 · 成本与效果：费用按智谱视觉调用和图片数累加，长历史附件会放大等待？](#detail-section-16)
  - [Q07 · 工程：源码有递归保护、超时、大小限制、失败可见文本和 adapter 更新监听？](#detail-section-17)
  - [Q08 · 假设：按附件敏感等级决定是否外发，并比较“原图直送”与“转写再送”的答案一致率，才能决定这层路由的净收益。？](#detail-section-18)
  - [Q09 · 采用：暂不用于含客户、凭证或内部截图的会话？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合现有文本模型必须处理截图或历史附件、又没有原生视觉入口的场景；已有原生多模态模型时直接调用更短且保真。 详见[Q01](#research-q01)。

适合现有文本模型必须处理截图或历史附件、又没有原生视觉入口的场景；已有原生多模态模型时直接调用更短且保真。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Host 路由 | 注册视觉包装模型并在适配器更新时刷新目标提供方 | 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据 |
| 事件监听 | 监听 llm/adapters-updated 维持路由 | 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| 智谱 API key/网络 | 必需 | 图像转文字 | 视觉步骤失败 |
| 目标文本 provider | 必需 | 基于转写回答 | 禁止回指本路由 |
| 附件大小与格式 | 必需 | 单图输入 | 超过 15MB 拒绝 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | 指定视觉凭据和 targetProvider | 先检查不递归 |
| 发送 | 附图进入包装模型 | 逐图转写并标注来源 |
| 回答 | 文本模型消费转写 | 保留失败占位 |
| 回退 | 选择原生视觉模型 | 敏感/高保真任务优先 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 每张图 | 智谱视觉调用 | 管理 key/限额 | 实际单价未核 |
| 长会话 | 历史附件可能重转写 | 筛选问题与附件 | 缓存仅进程内 |
| 隐私 | 图片外发第三方 | 脱敏/审批 | 无法用源码消除 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 文本模型看图 | 将图像变成文字证据 | 字段召回率 |
| 历史附件追问 | 按新问题再描述 | 跨轮正确率 |
| 原生视觉替代 | 链路更长且有损 | 同题答案一致率 |

> **思考**：图片会离开本机，文字中间层会丢布局和细节；标签只能降低提示注入混淆，不能证明视觉服务不会误读。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用；贡献是路由层兼容，不是新的识图模型。 详见[Q03](#research-q03)。

支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用；贡献是路由层兼容，不是新的识图模型。 详见[Q03](#research-q03)。

源码有递归保护、超时、大小限制、失败可见文本和 adapter 更新监听；进程缓存重启即失效。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

图片会离开本机，文字中间层会丢布局和细节；标签只能降低提示注入混淆，不能证明视觉服务不会误读。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

暂不用于含客户、凭证或内部截图的会话；仅在脱敏样本上观察转写丢失率，若已有原生视觉则不增加此路由。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交可确认图片先经智谱转写、再路由到目标文本 provider 的包装逻辑；未调用智谱、未发送图片，也未比较原生视觉，因此隐私、费用与转写损失只保留为待验边界。

- 已检查：作者 README、包清单、源码路径 README.md、packages/vision-route/README.md、packages/vision-route/index.js 及固定范围 inventory；组件：packages/vision-route。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、packages/vision-route/README.md、packages/vision-route/index.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据。
- 下一步：下一步只做本项可证伪实验：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性。

**分析版本**

- **仓库**：[314857493/dsh-vision](https://github.com/314857493/dsh-vision)
- **版本号**：0.1.4（[固定提交 10b0cbe](https://github.com/314857493/dsh-vision/tree/10b0cbe8c6f06a175eaa985df28d276575539b6e)）
- **版本日期**：2026-09-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按附件敏感等级决定是否外发，并比较“原图直送”与“转写再送”的答案一致率，才能决定这层路由的净收益。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 579 | 475 | 59 | — |
| .md | source | 2 | 106 | — | — | 1163 |
| .mjs | source | 4 | 540 | 465 | 40 | — |
| .mjs | test | 1 | 20 | 15 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/314857493/dsh-vision/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：第三方视觉转写路由是否值得用图像外发和信息损失换取文本模型看图能力？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合现有文本模型必须处理截图或历史附件、又没有原生视觉入口的场景？

**研究主题**：场景与需求

#### 完整回答

适合现有文本模型必须处理截图或历史附件、又没有原生视觉入口的场景；已有原生多模态模型时直接调用更短且保真。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/README.md#L1-L30)

固定提交复核：场景相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-vision-free-eyes

给 DeepSeek Harness（DSH）里的纯文本模型补上免费「眼睛」：GUI 直接贴图自动转译 + 磁盘图片识图工具 + 使用指引 skill。底层视觉走智谱 GLM 免费模型（glm-4v-flash），无需把主模型切换成视觉模型。

Eyes for text-only DeepSeek Harness agents: paste an image in the Web GUI and it just works — the image is transcribed by a free Zhipu GLM vision model before DeepSeek sees the text.

> ⚠️ **需要 GLM key（免费，但必须要有）**：识图走智谱免费模型 `glm-4v-flash`，需要去 [open.bigmodel.cn](https://open.bigmodel.cn) 注册获取免费 API key（格式 `id.secret`），配置为环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`（Windows 可直接 `setx GLM_API_KEY "你的key"`）。**没有 key 时贴图转译会失败**（对话中显示 `[图片转译失败: 未找到 GLM_API_KEY ...]`）。key 只存在于你的环境，不会进代码或仓库。

## DeepSeek 官方已有 Vision，为什么还需要这个项目？

DeepSeek Harness 从 [`v0.1.1-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.1)
开始原生接入多模态模型 `DeepSeek-V4-Flash-Vision-Exp`，并在
[`v0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)
加入 Files API 图片复用和自动预处理。能使用该模型、并希望模型直接读取原始像素时，**官方原生
Vision 是更短、信息损失更少的首选路径**。

本项目不再把自己定位成“DSH 没有 Vision 时的临时替代”，而是一个面向**纯文本主模型的视觉
旁路**：让视觉模型只负责看图，原来的 DeepSeek V4 Flash / Pro 或自定义 provider 继续负责推理、
写代码和调用工具。它仍有以下差异化价值：

- **主模型与视觉模型解耦**：不必为了偶尔看一张图，把整个会话切到
  `DeepSeek-V4-Flash-Vision-Exp`；图片转成视觉证据后，目标模型和目标路由保持不变。
- **不只服务 DeepSeek 官方路由**：`targetProvider` 可以包裹任何已注册的纯文本 provider，已经
  配好的火山方舟、公司网关或其他 OpenAI 兼容路由都能继续使用。
- **识图侧默认免费**：视觉工作走 GLM Flash 免费模型降级链，只需单独申请 GLM key；适合图片占比
  低、希望把视觉成本与主模型账单分开的工作流。免费额度与可用性以智谱当前政策为准。
- **补齐两种图片入口**：route 处理 Web GUI 粘贴/上传的 attachment；tool 处理已知绝对路径的
  本地图片。后者可在任何模型路由下调用，不要求当前主模型原生支持图片。
- **针对多轮追问重新看图**：能理解“上一张 / 第一张 / 两张对比”等指代，复用历史 attachment，
  并带着本轮问题重新分析所选图片，而不是只依赖第一次生成的泛化描述。
```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：包装适配器拦截当前及历史图片，逐图调用智谱 GLM 生成文字，再把带来源标签的转写交给配置的 targetProvider。？

**研究主题**：功能与机制

#### 完整回答

包装适配器拦截当前及历史图片，逐图调用智谱 GLM 生成文字，再把带来源标签的转写交给配置的 targetProvider。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-route/index.js:1-20](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-route/index.js#L1-L20)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（20行）</summary>

```text
// vision-proxy-route — DeepSeek Harness route wrapper that lets a text-only
// provider accept pasted images in the Web GUI.
//
// By default it registers `deepseek-vision` over `deepseek-official`. Both
// route ids and the display name are configurable, so the same wrapper can
// delegate to a custom provider such as Volcengine Ark.
//
// The wrapper:
//   1. declares `inputModalities: ['text', 'image']` in resolveModel(), so the
//      api-proxy attachment preflight and the read_image gate admit images;
//   2. intercepts the model request and transcribes every `{ type: 'image',
//      attachment }` content block into a text block via the free Zhipu GLM
//      vision models (glm-4v-flash → glm-4.6v-flash → glm-4.1v-thinking-flash),
//      using the user's existing GLM_API_KEY;
//   3. maps the wrapper route back to the configured target provider and
//      delegates the cleaned text-only request to its real adapter.
//
// The target route is left untouched; the user picks the configured wrapper
// route in the model selector before sending images.

```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用？

**研究主题**：贡献与相对优势

#### 完整回答

支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用；贡献是路由层兼容，不是新的识图模型。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/README.md#L1-L30)

固定提交复核：贡献相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-vision-free-eyes

给 DeepSeek Harness（DSH）里的纯文本模型补上免费「眼睛」：GUI 直接贴图自动转译 + 磁盘图片识图工具 + 使用指引 skill。底层视觉走智谱 GLM 免费模型（glm-4v-flash），无需把主模型切换成视觉模型。

Eyes for text-only DeepSeek Harness agents: paste an image in the Web GUI and it just works — the image is transcribed by a free Zhipu GLM vision model before DeepSeek sees the text.

> ⚠️ **需要 GLM key（免费，但必须要有）**：识图走智谱免费模型 `glm-4v-flash`，需要去 [open.bigmodel.cn](https://open.bigmodel.cn) 注册获取免费 API key（格式 `id.secret`），配置为环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`（Windows 可直接 `setx GLM_API_KEY "你的key"`）。**没有 key 时贴图转译会失败**（对话中显示 `[图片转译失败: 未找到 GLM_API_KEY ...]`）。key 只存在于你的环境，不会进代码或仓库。

## DeepSeek 官方已有 Vision，为什么还需要这个项目？

DeepSeek Harness 从 [`v0.1.1-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.1)
开始原生接入多模态模型 `DeepSeek-V4-Flash-Vision-Exp`，并在
[`v0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)
加入 Files API 图片复用和自动预处理。能使用该模型、并希望模型直接读取原始像素时，**官方原生
Vision 是更短、信息损失更少的首选路径**。

本项目不再把自己定位成“DSH 没有 Vision 时的临时替代”，而是一个面向**纯文本主模型的视觉
旁路**：让视觉模型只负责看图，原来的 DeepSeek V4 Flash / Pro 或自定义 provider 继续负责推理、
写代码和调用工具。它仍有以下差异化价值：

- **主模型与视觉模型解耦**：不必为了偶尔看一张图，把整个会话切到
  `DeepSeek-V4-Flash-Vision-Exp`；图片转成视觉证据后，目标模型和目标路由保持不变。
- **不只服务 DeepSeek 官方路由**：`targetProvider` 可以包裹任何已注册的纯文本 provider，已经
  配好的火山方舟、公司网关或其他 OpenAI 兼容路由都能继续使用。
- **识图侧默认免费**：视觉工作走 GLM Flash 免费模型降级链，只需单独申请 GLM key；适合图片占比
  低、希望把视觉成本与主模型账单分开的工作流。免费额度与可用性以智谱当前政策为准。
- **补齐两种图片入口**：route 处理 Web GUI 粘贴/上传的 attachment；tool 处理已知绝对路径的
  本地图片。后者可在任何模型路由下调用，不要求当前主模型原生支持图片。
- **针对多轮追问重新看图**：能理解“上一张 / 第一张 / 两张对比”等指代，复用历史 attachment，
  并带着本轮问题重新分析所选图片，而不是只依赖第一次生成的泛化描述。
```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：图片会离开本机，文字中间层会丢布局和细节？

**研究主题**：缺陷与关键质疑

#### 完整回答

图片会离开本机，文字中间层会丢布局和细节；标签只能降低提示注入混淆，不能证明视觉服务不会误读。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-route/index.js:1-20](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-route/index.js#L1-L20)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（20行）</summary>

```text
// vision-proxy-route — DeepSeek Harness route wrapper that lets a text-only
// provider accept pasted images in the Web GUI.
//
// By default it registers `deepseek-vision` over `deepseek-official`. Both
// route ids and the display name are configurable, so the same wrapper can
// delegate to a custom provider such as Volcengine Ark.
//
// The wrapper:
//   1. declares `inputModalities: ['text', 'image']` in resolveModel(), so the
//      api-proxy attachment preflight and the read_image gate admit images;
//   2. intercepts the model request and transcribes every `{ type: 'image',
//      attachment }` content block into a text block via the free Zhipu GLM
//      vision models (glm-4v-flash → glm-4.6v-flash → glm-4.1v-thinking-flash),
//      using the user's existing GLM_API_KEY;
//   3. maps the wrapper route back to the configured target provider and
//      delegates the cleaned text-only request to its real adapter.
//
// The target route is left untouched; the user picks the configured wrapper
// route in the model selector before sending images.

```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：必须有智谱 API key、可用模型和网络，并且 targetProvider 不能指回自身？

**研究主题**：依赖、兼容与流程

#### 完整回答

必须有智谱 API key、可用模型和网络，并且 targetProvider 不能指回自身；每图 15MB、60秒等限制会进入长会话路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/README.md#L1-L30)

固定提交复核：依赖相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-vision-free-eyes

给 DeepSeek Harness（DSH）里的纯文本模型补上免费「眼睛」：GUI 直接贴图自动转译 + 磁盘图片识图工具 + 使用指引 skill。底层视觉走智谱 GLM 免费模型（glm-4v-flash），无需把主模型切换成视觉模型。

Eyes for text-only DeepSeek Harness agents: paste an image in the Web GUI and it just works — the image is transcribed by a free Zhipu GLM vision model before DeepSeek sees the text.

> ⚠️ **需要 GLM key（免费，但必须要有）**：识图走智谱免费模型 `glm-4v-flash`，需要去 [open.bigmodel.cn](https://open.bigmodel.cn) 注册获取免费 API key（格式 `id.secret`），配置为环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`（Windows 可直接 `setx GLM_API_KEY "你的key"`）。**没有 key 时贴图转译会失败**（对话中显示 `[图片转译失败: 未找到 GLM_API_KEY ...]`）。key 只存在于你的环境，不会进代码或仓库。

## DeepSeek 官方已有 Vision，为什么还需要这个项目？

DeepSeek Harness 从 [`v0.1.1-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.1)
开始原生接入多模态模型 `DeepSeek-V4-Flash-Vision-Exp`，并在
[`v0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)
加入 Files API 图片复用和自动预处理。能使用该模型、并希望模型直接读取原始像素时，**官方原生
Vision 是更短、信息损失更少的首选路径**。

本项目不再把自己定位成“DSH 没有 Vision 时的临时替代”，而是一个面向**纯文本主模型的视觉
旁路**：让视觉模型只负责看图，原来的 DeepSeek V4 Flash / Pro 或自定义 provider 继续负责推理、
写代码和调用工具。它仍有以下差异化价值：

- **主模型与视觉模型解耦**：不必为了偶尔看一张图，把整个会话切到
  `DeepSeek-V4-Flash-Vision-Exp`；图片转成视觉证据后，目标模型和目标路由保持不变。
- **不只服务 DeepSeek 官方路由**：`targetProvider` 可以包裹任何已注册的纯文本 provider，已经
  配好的火山方舟、公司网关或其他 OpenAI 兼容路由都能继续使用。
- **识图侧默认免费**：视觉工作走 GLM Flash 免费模型降级链，只需单独申请 GLM key；适合图片占比
  低、希望把视觉成本与主模型账单分开的工作流。免费额度与可用性以智谱当前政策为准。
- **补齐两种图片入口**：route 处理 Web GUI 粘贴/上传的 attachment；tool 处理已知绝对路径的
  本地图片。后者可在任何模型路由下调用，不要求当前主模型原生支持图片。
- **针对多轮追问重新看图**：能理解“上一张 / 第一张 / 两张对比”等指代，复用历史 attachment，
  并带着本轮问题重新分析所选图片，而不是只依赖第一次生成的泛化描述。
```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：费用按智谱视觉调用和图片数累加，长历史附件会放大等待？

**研究主题**：效果与总成本

#### 完整回答

费用按智谱视觉调用和图片数累加，长历史附件会放大等待；真实单图价格、缓存命中率和失败账单本轮未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/README.md#L1-L30)

固定提交复核：成本与效果相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-vision-free-eyes

给 DeepSeek Harness（DSH）里的纯文本模型补上免费「眼睛」：GUI 直接贴图自动转译 + 磁盘图片识图工具 + 使用指引 skill。底层视觉走智谱 GLM 免费模型（glm-4v-flash），无需把主模型切换成视觉模型。

Eyes for text-only DeepSeek Harness agents: paste an image in the Web GUI and it just works — the image is transcribed by a free Zhipu GLM vision model before DeepSeek sees the text.

> ⚠️ **需要 GLM key（免费，但必须要有）**：识图走智谱免费模型 `glm-4v-flash`，需要去 [open.bigmodel.cn](https://open.bigmodel.cn) 注册获取免费 API key（格式 `id.secret`），配置为环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`（Windows 可直接 `setx GLM_API_KEY "你的key"`）。**没有 key 时贴图转译会失败**（对话中显示 `[图片转译失败: 未找到 GLM_API_KEY ...]`）。key 只存在于你的环境，不会进代码或仓库。

## DeepSeek 官方已有 Vision，为什么还需要这个项目？

DeepSeek Harness 从 [`v0.1.1-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.1)
开始原生接入多模态模型 `DeepSeek-V4-Flash-Vision-Exp`，并在
[`v0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)
加入 Files API 图片复用和自动预处理。能使用该模型、并希望模型直接读取原始像素时，**官方原生
Vision 是更短、信息损失更少的首选路径**。

本项目不再把自己定位成“DSH 没有 Vision 时的临时替代”，而是一个面向**纯文本主模型的视觉
旁路**：让视觉模型只负责看图，原来的 DeepSeek V4 Flash / Pro 或自定义 provider 继续负责推理、
写代码和调用工具。它仍有以下差异化价值：

- **主模型与视觉模型解耦**：不必为了偶尔看一张图，把整个会话切到
  `DeepSeek-V4-Flash-Vision-Exp`；图片转成视觉证据后，目标模型和目标路由保持不变。
- **不只服务 DeepSeek 官方路由**：`targetProvider` 可以包裹任何已注册的纯文本 provider，已经
  配好的火山方舟、公司网关或其他 OpenAI 兼容路由都能继续使用。
- **识图侧默认免费**：视觉工作走 GLM Flash 免费模型降级链，只需单独申请 GLM key；适合图片占比
  低、希望把视觉成本与主模型账单分开的工作流。免费额度与可用性以智谱当前政策为准。
- **补齐两种图片入口**：route 处理 Web GUI 粘贴/上传的 attachment；tool 处理已知绝对路径的
  本地图片。后者可在任何模型路由下调用，不要求当前主模型原生支持图片。
- **针对多轮追问重新看图**：能理解“上一张 / 第一张 / 两张对比”等指代，复用历史 attachment，
  并带着本轮问题重新分析所选图片，而不是只依赖第一次生成的泛化描述。
```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：源码有递归保护、超时、大小限制、失败可见文本和 adapter 更新监听？

**研究主题**：工程质量与复用

#### 完整回答

源码有递归保护、超时、大小限制、失败可见文本和 adapter 更新监听；进程缓存重启即失效。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-route/index.js:1-20](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-route/index.js#L1-L20)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（20行）</summary>

```text
// vision-proxy-route — DeepSeek Harness route wrapper that lets a text-only
// provider accept pasted images in the Web GUI.
//
// By default it registers `deepseek-vision` over `deepseek-official`. Both
// route ids and the display name are configurable, so the same wrapper can
// delegate to a custom provider such as Volcengine Ark.
//
// The wrapper:
//   1. declares `inputModalities: ['text', 'image']` in resolveModel(), so the
//      api-proxy attachment preflight and the read_image gate admit images;
//   2. intercepts the model request and transcribes every `{ type: 'image',
//      attachment }` content block into a text block via the free Zhipu GLM
//      vision models (glm-4v-flash → glm-4.6v-flash → glm-4.1v-thinking-flash),
//      using the user's existing GLM_API_KEY;
//   3. maps the wrapper route back to the configured target provider and
//      delegates the cleaned text-only request to its real adapter.
//
// The target route is left untouched; the user picks the configured wrapper
// route in the model selector before sending images.

```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：按附件敏感等级决定是否外发，并比较“原图直送”与“转写再送”的答案一致率，才能决定这层路由的净收益。？

**研究主题**：新假设与验证

#### 完整回答

按附件敏感等级决定是否外发，并比较“原图直送”与“转写再送”的答案一致率，才能决定这层路由的净收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/README.md#L1-L30)

固定提交复核：假设相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-vision-free-eyes

给 DeepSeek Harness（DSH）里的纯文本模型补上免费「眼睛」：GUI 直接贴图自动转译 + 磁盘图片识图工具 + 使用指引 skill。底层视觉走智谱 GLM 免费模型（glm-4v-flash），无需把主模型切换成视觉模型。

Eyes for text-only DeepSeek Harness agents: paste an image in the Web GUI and it just works — the image is transcribed by a free Zhipu GLM vision model before DeepSeek sees the text.

> ⚠️ **需要 GLM key（免费，但必须要有）**：识图走智谱免费模型 `glm-4v-flash`，需要去 [open.bigmodel.cn](https://open.bigmodel.cn) 注册获取免费 API key（格式 `id.secret`），配置为环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`（Windows 可直接 `setx GLM_API_KEY "你的key"`）。**没有 key 时贴图转译会失败**（对话中显示 `[图片转译失败: 未找到 GLM_API_KEY ...]`）。key 只存在于你的环境，不会进代码或仓库。

## DeepSeek 官方已有 Vision，为什么还需要这个项目？

DeepSeek Harness 从 [`v0.1.1-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.1)
开始原生接入多模态模型 `DeepSeek-V4-Flash-Vision-Exp`，并在
[`v0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)
加入 Files API 图片复用和自动预处理。能使用该模型、并希望模型直接读取原始像素时，**官方原生
Vision 是更短、信息损失更少的首选路径**。

本项目不再把自己定位成“DSH 没有 Vision 时的临时替代”，而是一个面向**纯文本主模型的视觉
旁路**：让视觉模型只负责看图，原来的 DeepSeek V4 Flash / Pro 或自定义 provider 继续负责推理、
写代码和调用工具。它仍有以下差异化价值：

- **主模型与视觉模型解耦**：不必为了偶尔看一张图，把整个会话切到
  `DeepSeek-V4-Flash-Vision-Exp`；图片转成视觉证据后，目标模型和目标路由保持不变。
- **不只服务 DeepSeek 官方路由**：`targetProvider` 可以包裹任何已注册的纯文本 provider，已经
  配好的火山方舟、公司网关或其他 OpenAI 兼容路由都能继续使用。
- **识图侧默认免费**：视觉工作走 GLM Flash 免费模型降级链，只需单独申请 GLM key；适合图片占比
  低、希望把视觉成本与主模型账单分开的工作流。免费额度与可用性以智谱当前政策为准。
- **补齐两种图片入口**：route 处理 Web GUI 粘贴/上传的 attachment；tool 处理已知绝对路径的
  本地图片。后者可在任何模型路由下调用，不要求当前主模型原生支持图片。
- **针对多轮追问重新看图**：能理解“上一张 / 第一张 / 两张对比”等指代，复用历史 attachment，
  并带着本轮问题重新分析所选图片，而不是只依赖第一次生成的泛化描述。
```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：暂不用于含客户、凭证或内部截图的会话？

**研究主题**：采用判断

#### 完整回答

暂不用于含客户、凭证或内部截图的会话；仅在脱敏样本上观察转写丢失率，若已有原生视觉则不增加此路由。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/README.md#L1-L30)

固定提交复核：采用相关声明与实现入口。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-vision-free-eyes

给 DeepSeek Harness（DSH）里的纯文本模型补上免费「眼睛」：GUI 直接贴图自动转译 + 磁盘图片识图工具 + 使用指引 skill。底层视觉走智谱 GLM 免费模型（glm-4v-flash），无需把主模型切换成视觉模型。

Eyes for text-only DeepSeek Harness agents: paste an image in the Web GUI and it just works — the image is transcribed by a free Zhipu GLM vision model before DeepSeek sees the text.

> ⚠️ **需要 GLM key（免费，但必须要有）**：识图走智谱免费模型 `glm-4v-flash`，需要去 [open.bigmodel.cn](https://open.bigmodel.cn) 注册获取免费 API key（格式 `id.secret`），配置为环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`（Windows 可直接 `setx GLM_API_KEY "你的key"`）。**没有 key 时贴图转译会失败**（对话中显示 `[图片转译失败: 未找到 GLM_API_KEY ...]`）。key 只存在于你的环境，不会进代码或仓库。

## DeepSeek 官方已有 Vision，为什么还需要这个项目？

DeepSeek Harness 从 [`v0.1.1-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.1)
开始原生接入多模态模型 `DeepSeek-V4-Flash-Vision-Exp`，并在
[`v0.1.1-rc.2`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.1-rc.2)
加入 Files API 图片复用和自动预处理。能使用该模型、并希望模型直接读取原始像素时，**官方原生
Vision 是更短、信息损失更少的首选路径**。

本项目不再把自己定位成“DSH 没有 Vision 时的临时替代”，而是一个面向**纯文本主模型的视觉
旁路**：让视觉模型只负责看图，原来的 DeepSeek V4 Flash / Pro 或自定义 provider 继续负责推理、
写代码和调用工具。它仍有以下差异化价值：

- **主模型与视觉模型解耦**：不必为了偶尔看一张图，把整个会话切到
  `DeepSeek-V4-Flash-Vision-Exp`；图片转成视觉证据后，目标模型和目标路由保持不变。
- **不只服务 DeepSeek 官方路由**：`targetProvider` 可以包裹任何已注册的纯文本 provider，已经
  配好的火山方舟、公司网关或其他 OpenAI 兼容路由都能继续使用。
- **识图侧默认免费**：视觉工作走 GLM Flash 免费模型降级链，只需单独申请 GLM key；适合图片占比
  低、希望把视觉成本与主模型账单分开的工作流。免费额度与可用性以智谱当前政策为准。
- **补齐两种图片入口**：route 处理 Web GUI 粘贴/上传的 attachment；tool 处理已知绝对路径的
  本地图片。后者可在任何模型路由下调用，不要求当前主模型原生支持图片。
- **针对多轮追问重新看图**：能理解“上一张 / 第一张 / 两张对比”等指代，复用历史 attachment，
  并带着本轮问题重新分析所选图片，而不是只依赖第一次生成的泛化描述。
```

</details>

#### 缺口

- 智谱账单、目标提供方组合和敏感图片治理没有本轮运行证据
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：准备 30 张已脱敏截图，逐张对比原生视觉与路由转写的字段召回、P95、每图费用和失败可见性

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
