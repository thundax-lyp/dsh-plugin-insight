# DeepSeek Design 分发与贡献入口

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0a55f5e](https://github.com/Devin-AXIS/deepseek-design/tree/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2)

<!-- BEGIN META -->
[![GitHub ★ 1,661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/deepseek-design)
<!-- END META -->

> **功能**：组织面向 DSH 的 Design、PPT 和 Video 可视化创作插件与上游源码。

> **亮点**：根仓整合三个包的发现、来源和贡献路径；具体交互能力归各子组件，待分别验收。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：作者描述的可编辑与导出流程尚未在子包及宿主验证，source-available 许可也限制部分使用范围。[Q03](#research-q03)

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
  - [Q01 · 根目录为谁提供什么，安装对象是什么？](#detail-section-11)
  - [Q02 · 源码与分发品如何同步，上游贡献边界是什么？](#detail-section-12)
  - [Q03 · 可编辑与可分发的主要限制是什么？](#detail-section-13)
  - [Q04 · 如何以可控成本试用并维护贡献？](#detail-section-14)
  - [Q05 · 如何检验跨 AI 与手工编辑交接？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 对话和视觉界面之间交接设计文件的创作者及贡献者。[Q01](#research-q01)

独立设计工具配合人工复制，或普通 DSH 对话编辑工作区文件。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分发入口 | 找到对应创作包 | 子包须分别验证 |
| 来源记录 | 追踪上游提交 | 不证明构建一致 |
| 贡献说明 | 指示上游同步 | 受许可证约束 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与所选单包 | 试用必需 | 对话与视觉界面 | 暂缓部署 |
| Studio 和模型 | 创作需要 | 生成与编辑 | 使用原工具 |
| 完整许可核对 | 使用必需 | 确定授权范围 | 不使用 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 选择 | 确认单包与许可 | 不符则停止 |
| 试验 | 隔离样例生成和手改 | 核对保存及导出 |
| 退出 | 保留原文件 | 有覆盖则回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包与模型费用未知 | 许可和来源核对 | 构建未测 |
| 持续 | 模型及计算资源 | 复核人工与 AI 编辑 | 节时未测 |
| 恢复 | 原文件备份 | 处理覆盖 | 撤销未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发现 | 根清单列三包和上游 | 实际分发一致性 |
| 编辑 | 作者描述选区和撤销 | 真实交互与导出 |

> **思考**：作者描述的可编辑与导出流程尚未在子包及宿主验证，source-available 许可也限制部分使用范围。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：根仓整合三个包的发现、来源和贡献路径；具体交互能力归各子组件，待分别验收。[Q01](#research-q01) [Q02](#research-q02)

来源清单固定上游提交，source 文档描述经上游评审与重建；未证明产物可复现。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

作者描述的可编辑与导出流程尚未在子包及宿主验证，source-available 许可也限制部分使用范围。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

核对完整许可和具体包版本，先在隔离样例验收，异常时回原设计工具。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根文档和清单支持来源及分发关系；子包实现、构建、宿主和许可适用未执行验证。

- 已检查：作者 README、包清单、源码路径 README.md、repository.json、source/README.md、LICENSE 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 336 个指定扩展名文件、排除 493、解析错误 0；只研究根清单和文档，不归因独立子包实现。
- 下一步：固定所选包、DSH 及 Studio，用非敏感样例核对编辑、保存、导出与许可。

**分析版本**

- **仓库**：[Devin-AXIS/deepseek-design](https://github.com/Devin-AXIS/deepseek-design)
- **版本号**：未声明（[固定提交 0a55f5e](https://github.com/Devin-AXIS/deepseek-design/tree/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：AI 与人工交接时展示受影响文件和基线，可减少覆盖；须对照已有选区与撤销功能验证。[Q05](#research-q05)

固定所选包、DSH 及 Studio，用非敏感样例核对编辑、保存、导出与许可。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 1946 | — | — | 17111 |
| .js | source | 280 | 253748 | 237059 | 15837 | — |
| .tsx | source | 5 | 352 | 320 | 4 | — |
| .ts | source | 27 | 2759 | 2518 | 33 | — |
| .mjs | source | 1 | 49 | 41 | 0 | — |
| .mjs | test | 1 | 234 | 219 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/Devin-AXIS/deepseek-design/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DeepSeek Design 根如何组织上游源码与三个分发包，采用与许可证边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根目录为谁提供什么，安装对象是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根仓库为 DSH 视觉创作者和贡献者组织 Design、PPT、Video 三个分发包及共享来源，根本身没有 package.json，不是单个可直接安装的 DSH 插件。作者的使用流程以工作区文件为 AI 与 Studio 的交接点；基线是独立设计工具加人工复制或普通对话编辑。子组件实现与效果需分别研究，不能用本根文档证明它们已能运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-32](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/README.md#L24-L32)

作者描述 DSH 与 Studio 分工。

```text
## DeepSeek Harness 的核心设计能力

**DeepSeek Design** 是由 [iPolloWork](https://github.com/Devin-AXIS/iPolloWork) 推出、专为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 构建的原生可视化设计系统。

它把 DeepSeek Harness 作为理解需求、生成内容和修改文件的 AI 引擎，把 iPolloWork Design Studio 作为可视化创作与精调界面。你可以在对话中提出完整需求，也可以选中画布里的一个标题、一张图片或一个组件，让 AI 只修改当前对象；需要更精确时，则直接在 Studio 中调整文字、字体、颜色、尺寸、间距、背景、链接与图片。

你可以把它理解为 DeepSeek Harness 中类似 Claude Design 的开放设计工作流：**AI 负责从意图到作品，Studio 负责从作品到细节，最终结果仍是工作区中真实、可保存、可继续编辑的文件。**

DeepSeek Design 不是另一个聊天机器人，也不会替换 DeepSeek Harness。它以原生插件方式进入 Harness 的对话界面，复用当前会话、模型、工作区与权限体系，为 Harness 增加一套专门的 Design 能力。
```

**依据 2 · 作者声明**：[README.md:34-56](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/README.md#L34-L56)

作者列出流程和三个独立包。

<details>
<summary>查看原文（23行）</summary>

````text
## 从一句话到可交付设计

1. 在 DeepSeek Harness 中描述你想要的网站、App 原型、海报、信息卡、报告或演示文稿。
2. Harness 在当前工作区生成或修改 HTML、CSS、设计令牌和项目说明文件。
3. 打开对话旁的 **Design** 或 **PPT** 视图，实时查看结果。
4. 直接编辑画布，或选中具体元素后使用 **Ask AI** 继续修改。
5. 继续对话、切换模板或撤销修改；PPT 作品还可导出为 PDF 或 PPTX。

这是一条持续循环的创作流程，而不是一次性的图片生成：

```text
描述需求 → AI 生成 → Studio 预览 → 手动精调 / Ask AI → 保存到工作区 → 继续迭代
```

## 三个独立插件，一套创作系统

| 插件 | 面向场景 | 核心能力 |
| --- | --- | --- |
| [`deepseek-idesign`](https://www.npmjs.com/package/deepseek-idesign) | 网站、App 原型、海报、信息卡、数据报告、杂志与其他非幻灯片设计 | Design 模板市场、桌面/移动预览、可视化元素编辑、主题与设计令牌、选区 Ask AI |
| [`deepseek-ippt`](https://www.npmjs.com/package/deepseek-ippt) | 演示文稿与幻灯片 | 独立 PPT 模板市场、逐页编辑、可视化精调、选区 Ask AI、PDF/PPTX 导出 |
| [`deepseek-ivideo`](https://www.npmjs.com/package/deepseek-ivideo) | 动态视觉、产品演示、数据故事与短视频 | HyperFrames 时间线、主题组件与统一变量表单、28 个 Video 模板、选区 Ask AI、自动校验、视频导出 |

三个插件可以单独安装，也可以一起使用。它们共享 iPolloWork Studio 契约和模板协议，但项目目录彼此隔离，因此不会相互覆盖。只安装所选 npm 包，不会下载另外两个插件。
````

</details>

**依据 3 · 源码核查**：[repository.json:1-25](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/repository.json#L1-L25)

来源提交与三个包版本。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "schemaVersion": 1,
  "repository": "https://github.com/Devin-AXIS/deepseek-design",
  "source": {
    "repository": "https://github.com/Devin-AXIS/iPolloWork",
    "commit": "d21e5d5a0f6bf493f3da3df37895abf106d88af6"
  },
  "contributions": {
    "mode": "upstream-pull-request",
    "upstream": "https://github.com/Devin-AXIS/iPolloWork"
  },
  "packages": [
    {
      "name": "deepseek-idesign",
      "version": "0.2.2"
    },
    {
      "name": "deepseek-ippt",
      "version": "0.1.2"
    },
    {
      "name": "deepseek-ivideo",
      "version": "0.5.0"
    }
  ]
```

</details>

#### 缺口

- 未执行构建、子包、Studio 或 DSH 宿主
  **影响**：不能证明编辑、导出、同步和许可证适用性
  **进一步探讨**：固定实际包及宿主，用隔离样例验收并核对完整许可

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 源码与分发品如何同步，上游贡献边界是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 repository.json 声明 iPolloWork 固定上游提交和 upstream-pull-request 贡献模式；source 说明镜像薄适配器及共享契约，完整可安装 runtime 在 packages，源变更进入上游后重建回同步。它使贡献源与分发包关系可追踪，但此文档本身不证明该固定上游已审计、构建或包字节与源码一致。

#### 证据与依据

**依据 1 · 源码核查**：[repository.json:1-25](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/repository.json#L1-L25)

声明上游仓库、提交、包版本。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "schemaVersion": 1,
  "repository": "https://github.com/Devin-AXIS/deepseek-design",
  "source": {
    "repository": "https://github.com/Devin-AXIS/iPolloWork",
    "commit": "d21e5d5a0f6bf493f3da3df37895abf106d88af6"
  },
  "contributions": {
    "mode": "upstream-pull-request",
    "upstream": "https://github.com/Devin-AXIS/iPolloWork"
  },
  "packages": [
    {
      "name": "deepseek-idesign",
      "version": "0.2.2"
    },
    {
      "name": "deepseek-ippt",
      "version": "0.1.2"
    },
    {
      "name": "deepseek-ivideo",
      "version": "0.5.0"
    }
  ]
```

</details>

**依据 2 · 作者声明**：[source/README.md:1-7](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/source/README.md#L1-L7)

作者描述镜像、贡献与重建路径。

```text
# Source map

This directory mirrors the thin DeepSeek Harness adapters and shared Studio contracts from [iPolloWork](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6). The complete, directly installable runtime is in `packages/`.

Source pull requests are welcome in this repository. After a source change is merged here, iPolloWork imports it as a reviewable upstream pull request. When that upstream pull request is merged, all Studio packages are rebuilt and synchronized back here. Do not edit generated files under `packages/` directly.

Design, PPT, and Video remain single-sourced in iPolloWork. The curated templates remain in [bundled-templates](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/bundled-templates). Changes to core Studio surfaces or templates should be proposed directly in the main repository.
```

#### 缺口

- 未执行构建、子包、Studio 或 DSH 宿主
  **影响**：不能证明编辑、导出、同步和许可证适用性
  **进一步探讨**：固定实际包及宿主，用隔离样例验收并核对完整许可

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可编辑与可分发的主要限制是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

根 README 描述选区、手动编辑、保存及 PPT 导出，但此项仅研究根分发和文档，不能把描述当成每个子插件的交互或导出验收；DSH、模型、Studio 和对应包需协同。根许可证是 source-available，个人和少于三人的非商业内部使用列于许可范围，其他情形需按完整条款判断；不能把源码可见等同无条件开源商用许可。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-56](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/README.md#L34-L56)

作者描述编辑、导出及各包边界。

<details>
<summary>查看原文（23行）</summary>

````text
## 从一句话到可交付设计

1. 在 DeepSeek Harness 中描述你想要的网站、App 原型、海报、信息卡、报告或演示文稿。
2. Harness 在当前工作区生成或修改 HTML、CSS、设计令牌和项目说明文件。
3. 打开对话旁的 **Design** 或 **PPT** 视图，实时查看结果。
4. 直接编辑画布，或选中具体元素后使用 **Ask AI** 继续修改。
5. 继续对话、切换模板或撤销修改；PPT 作品还可导出为 PDF 或 PPTX。

这是一条持续循环的创作流程，而不是一次性的图片生成：

```text
描述需求 → AI 生成 → Studio 预览 → 手动精调 / Ask AI → 保存到工作区 → 继续迭代
```

## 三个独立插件，一套创作系统

| 插件 | 面向场景 | 核心能力 |
| --- | --- | --- |
| [`deepseek-idesign`](https://www.npmjs.com/package/deepseek-idesign) | 网站、App 原型、海报、信息卡、数据报告、杂志与其他非幻灯片设计 | Design 模板市场、桌面/移动预览、可视化元素编辑、主题与设计令牌、选区 Ask AI |
| [`deepseek-ippt`](https://www.npmjs.com/package/deepseek-ippt) | 演示文稿与幻灯片 | 独立 PPT 模板市场、逐页编辑、可视化精调、选区 Ask AI、PDF/PPTX 导出 |
| [`deepseek-ivideo`](https://www.npmjs.com/package/deepseek-ivideo) | 动态视觉、产品演示、数据故事与短视频 | HyperFrames 时间线、主题组件与统一变量表单、28 个 Video 模板、选区 Ask AI、自动校验、视频导出 |

三个插件可以单独安装，也可以一起使用。它们共享 iPolloWork Studio 契约和模板协议，但项目目录彼此隔离，因此不会相互覆盖。只安装所选 npm 包，不会下载另外两个插件。
````

</details>

**依据 2 · 源码核查**：[LICENSE:1-27](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/LICENSE#L1-L27)

许可授权和限定使用。

<details>
<summary>查看原文（27行）</summary>

```text
iPolloWork Source Available License
Version 1.0, 13 July 2026

Copyright (c) 2026 Different AI, Inc. All rights reserved.

By using, copying, modifying, or distributing the Software, You accept this
License.

1. License Grant

Subject to this License, the Licensor grants You a non-exclusive,
royalty-free, worldwide, non-sublicensable, and non-transferable license to
use, copy, modify, and distribute the Software solely as permitted below.

2. Permitted Uses

You may use and modify the Software without prior written authorization only
for the limited uses below:

  a. Individual Personal Use by one natural person for that person's own
     non-commercial work, learning, research, evaluation, or testing; and
  b. Small Internal Use by fewer than three total Users solely for internal,
     non-commercial evaluation, testing, or operations.

Small Internal Use is permitted only when the Software and its functionality
are not sold, hosted for, provided to, or otherwise made available to
customers, clients, or other external third parties. The three-User threshold
```

</details>

**依据 3 · 作者声明**：[source/README.md:3-7](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/source/README.md#L3-L7)

可安装包与上游源码边界。

```text
This directory mirrors the thin DeepSeek Harness adapters and shared Studio contracts from [iPolloWork](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6). The complete, directly installable runtime is in `packages/`.

Source pull requests are welcome in this repository. After a source change is merged here, iPolloWork imports it as a reviewable upstream pull request. When that upstream pull request is merged, all Studio packages are rebuilt and synchronized back here. Do not edit generated files under `packages/` directly.

Design, PPT, and Video remain single-sourced in iPolloWork. The curated templates remain in [bundled-templates](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/bundled-templates). Changes to core Studio surfaces or templates should be proposed directly in the main repository.
```

#### 缺口

- 未执行构建、子包、Studio 或 DSH 宿主
  **影响**：不能证明编辑、导出、同步和许可证适用性
  **进一步探讨**：固定实际包及宿主，用隔离样例验收并核对完整许可

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何以可控成本试用并维护贡献？

**研究主题**：效果与总成本、采用判断

#### 完整回答

有可视化编辑需求的用户先选对应单包、固定版本，在非敏感工作区生成并手动编辑样例，核对保存、导出及撤销；许可不满足、交接覆盖或包/源码不一致时停止并回退原设计工具。贡献者需遵循仓库声明的上游评审与重建链，承担等待、版本及许可证核查成本；模型费用、构建和实际节时未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-56](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/README.md#L34-L56)

作者描述单包与工作流。

<details>
<summary>查看原文（23行）</summary>

````text
## 从一句话到可交付设计

1. 在 DeepSeek Harness 中描述你想要的网站、App 原型、海报、信息卡、报告或演示文稿。
2. Harness 在当前工作区生成或修改 HTML、CSS、设计令牌和项目说明文件。
3. 打开对话旁的 **Design** 或 **PPT** 视图，实时查看结果。
4. 直接编辑画布，或选中具体元素后使用 **Ask AI** 继续修改。
5. 继续对话、切换模板或撤销修改；PPT 作品还可导出为 PDF 或 PPTX。

这是一条持续循环的创作流程，而不是一次性的图片生成：

```text
描述需求 → AI 生成 → Studio 预览 → 手动精调 / Ask AI → 保存到工作区 → 继续迭代
```

## 三个独立插件，一套创作系统

| 插件 | 面向场景 | 核心能力 |
| --- | --- | --- |
| [`deepseek-idesign`](https://www.npmjs.com/package/deepseek-idesign) | 网站、App 原型、海报、信息卡、数据报告、杂志与其他非幻灯片设计 | Design 模板市场、桌面/移动预览、可视化元素编辑、主题与设计令牌、选区 Ask AI |
| [`deepseek-ippt`](https://www.npmjs.com/package/deepseek-ippt) | 演示文稿与幻灯片 | 独立 PPT 模板市场、逐页编辑、可视化精调、选区 Ask AI、PDF/PPTX 导出 |
| [`deepseek-ivideo`](https://www.npmjs.com/package/deepseek-ivideo) | 动态视觉、产品演示、数据故事与短视频 | HyperFrames 时间线、主题组件与统一变量表单、28 个 Video 模板、选区 Ask AI、自动校验、视频导出 |

三个插件可以单独安装，也可以一起使用。它们共享 iPolloWork Studio 契约和模板协议，但项目目录彼此隔离，因此不会相互覆盖。只安装所选 npm 包，不会下载另外两个插件。
````

</details>

**依据 2 · 作者声明**：[source/README.md:3-7](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/source/README.md#L3-L7)

上游与重建说明。

```text
This directory mirrors the thin DeepSeek Harness adapters and shared Studio contracts from [iPolloWork](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6). The complete, directly installable runtime is in `packages/`.

Source pull requests are welcome in this repository. After a source change is merged here, iPolloWork imports it as a reviewable upstream pull request. When that upstream pull request is merged, all Studio packages are rebuilt and synchronized back here. Do not edit generated files under `packages/` directly.

Design, PPT, and Video remain single-sourced in iPolloWork. The curated templates remain in [bundled-templates](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/bundled-templates). Changes to core Studio surfaces or templates should be proposed directly in the main repository.
```

**依据 3 · 源码核查**：[LICENSE:15-27](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/LICENSE#L15-L27)

使用范围。

<details>
<summary>查看原文（13行）</summary>

```text
2. Permitted Uses

You may use and modify the Software without prior written authorization only
for the limited uses below:

  a. Individual Personal Use by one natural person for that person's own
     non-commercial work, learning, research, evaluation, or testing; and
  b. Small Internal Use by fewer than three total Users solely for internal,
     non-commercial evaluation, testing, or operations.

Small Internal Use is permitted only when the Software and its functionality
are not sold, hosted for, provided to, or otherwise made available to
customers, clients, or other external third parties. The three-User threshold
```

</details>

#### 缺口

- 未执行构建、子包、Studio 或 DSH 宿主
  **影响**：不能证明编辑、导出、同步和许可证适用性
  **进一步探讨**：固定实际包及宿主，用隔离样例验收并核对完整许可

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验跨 AI 与手工编辑交接？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在 AI 写入前显示受影响文件和手动编辑后的基线，在保存后核对生成产物与用户更改，可减少无意覆盖。现有工作区保存、选区与撤销为作者声明的反证，并非此前没有保护；根入口未证明底层同步行为。以固定样例对照常用设计工具，测覆盖、冲突恢复、完成时间及导出保真；若无改善或干扰增加则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-45](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/README.md#L34-L45)

已有选区与撤销流程声明。

<details>
<summary>查看原文（12行）</summary>

````text
## 从一句话到可交付设计

1. 在 DeepSeek Harness 中描述你想要的网站、App 原型、海报、信息卡、报告或演示文稿。
2. Harness 在当前工作区生成或修改 HTML、CSS、设计令牌和项目说明文件。
3. 打开对话旁的 **Design** 或 **PPT** 视图，实时查看结果。
4. 直接编辑画布，或选中具体元素后使用 **Ask AI** 继续修改。
5. 继续对话、切换模板或撤销修改；PPT 作品还可导出为 PDF 或 PPTX。

这是一条持续循环的创作流程，而不是一次性的图片生成：

```text
描述需求 → AI 生成 → Studio 预览 → 手动精调 / Ask AI → 保存到工作区 → 继续迭代
````

</details>

**依据 2 · 作者声明**：[source/README.md:3-7](https://github.com/Devin-AXIS/deepseek-design/blob/0a55f5e98a3046ed9c6d8e9f8692c99d46a9f5c2/source/README.md#L3-L7)

源码与产物的重建边界。

```text
This directory mirrors the thin DeepSeek Harness adapters and shared Studio contracts from [iPolloWork](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6). The complete, directly installable runtime is in `packages/`.

Source pull requests are welcome in this repository. After a source change is merged here, iPolloWork imports it as a reviewable upstream pull request. When that upstream pull request is merged, all Studio packages are rebuilt and synchronized back here. Do not edit generated files under `packages/` directly.

Design, PPT, and Video remain single-sourced in iPolloWork. The curated templates remain in [bundled-templates](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/bundled-templates). Changes to core Studio surfaces or templates should be proposed directly in the main repository.
```

#### 缺口

- 未执行构建、子包、Studio 或 DSH 宿主
  **影响**：不能证明编辑、导出、同步和许可证适用性
  **进一步探讨**：固定实际包及宿主，用隔离样例验收并核对完整许可

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
