# AI Infrastructure Agent Skills

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f3a8d7d](https://github.com/yzlnew/infra-skills/tree/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf)

<!-- BEGIN META -->
[![GitHub ★ 157](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=157&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yzlnew/infra-skills)
<!-- END META -->

> **功能**：面向 AI 基础设施工程师的 Skill 集合，涵盖 GPU 开发、显存估算、训练指导和技术图表。

> **亮点**：[Q01](#research-q01) 将领域知识、示例、调试和具体产物路线组织成任务入口；[Q02](#research-q02) 存在输入校验与数值对照代码，不是纯文档列表，底层框架和公式归上游。

> **主要限制**：[Q02](#research-q02) 估算不等训练峰值，测试可能跳过且只覆盖样例；--json前仍打印加载文字会影响直接解析。 [Q03](#research-q03) 环境与版本负担、作者未严格校对警告，使集合不宜整包作生产默认。

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
  - [Q01 · 集合包含哪些真实入口，怎样触发到具体资源？](#detail-section-11)
  - [Q02 · 显存估算与GPU示例如何处理适用性和正确性？](#detail-section-12)
  - [Q03 · 采用与退出需要什么，收益有何依据？](#detail-section-13)
  - [Q04 · 怎样把“示例可读”变成按环境可复核？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有GPU/训练或技术表达经验的工程师，可按任务选Skill资源；本集合不提供统一DSH运行时或自动生产验收。

独立官方文档、上游示例、手工参数计算与现有绘图工具是替代，集合减少查找与组织负担的机制可解释，未证端到端节时或性能胜出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| TileLang开发参考 | 编写/优化GPU算子候选 | 样例和测试不证明目标硬件通过 |
| Megatron显存估算 | 比较模型配置与并行参数 | 估算非训练峰值，需实测校准 |
| SLIME使用指导 | 查训练配置与示例路径 | 依赖外部训练框架和设备 |
| 图表与幻灯片Skill | 组织技术表达和设计样式 | 按入口不同工具链，内容须复核 |
| HF架构图路径 | 配置提取为结构化spec并渲染 | 家族/公式适用性与原模型对照 |
| HTML/SVG生成器 | 从TS spec写出图形 | 真实写文件，输出仍需视觉和语义验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持Skill目录的助手 | 入口必需 | 匹配任务与按需读资源 | Claude复制说明不证明DSH发现 |
| Python/mbridge/transformers/Megatron等 | 显存路径必需 | 配置转换与估算 | 需固定完整版本和导入，setup不保证兼容 |
| TileLang/torch与目标硬件 | Kernel执行必需 | 编译、参考对比和性能 | 无CUDA的正确性测试会skip |
| Node/TS或LaTeX/Poppler/Python模板 | 按绘图入口必需 | 编译和渲染产物 | 不把单文件输出当环境零依赖 |
| 输入、上游许可与可信模型配置 | 实际采用必需 | 保可追溯与使用条件 | 不盲开远程代码或生产容量决策 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选择 | 用户按目标读一个Skill，不执行整包setup | 触发、路径、产物和依赖明确 |
| 固定 | 工程师记录输入/版本/硬件并备独立环境 | 不污染已有训练环境 |
| 核验 | 工程师用已知参考检查数值、估算或图形 | skip不是通过，图形须看渲染和内容 |
| 退出 | 用户保留输入/环境与输出，停用选定Skill | 不采用未知结果，回上游已验证工具 |

**效果与成本**

[Q03](#research-q03) 分阶段列所选入口的工具链、GPU/存储和复核人工成本，没有统一金额或工时。

[Q03](#research-q03) 的效果表区分知识路由、估算、测试与图表实际结果，未把示例或Complete当收益。

> **思考**：[Q02](#research-q02) 估算不等训练峰值，测试可能跳过且只覆盖样例；--json前仍打印加载文字会影响直接解析。 [Q03](#research-q03) 环境与版本负担、作者未严格校对警告，使集合不宜整包作生产默认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将领域知识、示例、调试和具体产物路线组织成任务入口；[Q02](#research-q02) 存在输入校验与数值对照代码，不是纯文档列表，底层框架和公式归上游。

[Q02](#research-q02) 约束参数和数值对照比只给示例更可核，但JSON输出契约和未锁依赖妨碍复现；[Q03](#research-q03) 图形spec单源有助于一致写出，仍需渲染与语义检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 估算不等训练峰值，测试可能跳过且只覆盖样例；--json前仍打印加载文字会影响直接解析。 [Q03](#research-q03) 环境与版本负担、作者未严格校对警告，使集合不宜整包作生产默认。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先观察，按一项已知结果任务筛选并固定独立环境。测试skip、依赖不明、估算偏差或图形语义不符时，停用输出作决策，保留环境与输入并回上游已验证流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核八个入口和显存/测试/绘图的定向关键路径，未运行或安装目标，未全审所有公式/训练实现。作者Complete标签与独立实测分开，未来复核记录为假设。

- 已检查：作者 README、包清单、源码路径 README.md、tilelang-developer/SKILL.md、slime-user/SKILL.md、megatron-memory-estimator/scripts/estimate_from_hf.py、hf-architecture-tikz/SKILL.md、anthropic-theme-flowchart/src/build.ts、tikz-flowchart/SKILL.md、material-you-slides/SKILL.md、openai-dotcom-viz/SKILL.md、megatron-memory-estimator/megatron_memory_estimator/estimate_013.py、tests/tilelang-developer/test_gemm.py、megatron-memory-estimator/scripts/setup_env.sh、hf-architecture-tikz/scripts/extract_arch.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根集合inventory；核八个SKILL入口，深入显存配置桥/参数/输出/底层估算入口、GEMM测试与图表build/配置提取。未完整审所有Skill实现、公式或外部上游，未执行任何目标。Python不计入JS/TS统计，不能以inventory行数代表核心代码规模。
- 下一步：按 [Q02](#research-q02) 固定实际环境核JSON、无效参数、参考数值与峰值，再用 [Q04](#research-q04) 检验复核记录是否降低错误推广。

**分析版本**

- **仓库**：[yzlnew/infra-skills](https://github.com/yzlnew/infra-skills)
- **版本号**：未声明（[固定提交 f3a8d7d](https://github.com/yzlnew/infra-skills/tree/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf)）
- **版本日期**：2026-07-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出每示例附输入、框架/硬件、执行状态与对照结果的最小复核记录，检验是否减少错误推广；现有测试不自动等于目标环境通过。

按 [Q02](#research-q02) 固定实际环境核JSON、无效参数、参考数值与峰值，再用 [Q04](#research-q04) 检验复核记录是否降低错误推广。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 5645 | — | — | 25596 |
| .ts | source | 7 | 1454 | 1328 | 2 | — |
| .js | source | 1 | 194 | 149 | 37 | — |
| .md | test | 1 | 172 | — | — | 561 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/yzlnew/infra-skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/yzlnew/infra-skills/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yzlnew/infra-skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本AI基础设施Skill集合如何连接专门知识与脚本，其可靠性和迁移负担有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 集合包含哪些真实入口，怎样触发到具体资源？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

infra-skills 是面向已懂GPU、训练或技术表达的工程师的Skill资源集合，不是一个统一运行时或已接线的DSH插件。固定树中可识别八个Skill入口：TileLang开发、Megatron显存估算、SLIME使用、TikZ流程图、Material You幻灯片、Anthropic风格HTML流程图、HF架构TikZ及OpenAI风格图。根README将SGLang/vLLM专门开发入口列为计划，不能把计划项算可用能力。

每个入口以name/description触发特定任务，再按主题读取参考、示例或调用脚本；安装说明是复制选定目录到Claude个人/项目Skill路径，未提供根DSH bundle注册。根稳定身份因此记resource，而单项入口是Skill，不擅自拆成新队列对象。较临时查文档的增量是把领域知识、示例、调试与产物格式组织进可按需读取的目录，而不是新增训练框架本身。

集合也不全是提示。显存入口把HF配置交给AutoBridge转换并调用本地估算器；架构绘图先提取结构化配置，再模板渲染和编译；HTML流程图有TypeScript spec到HTML/SVG的实际写出路径。不同入口依赖与成功判据不同，不能用同一个Complete标签代表全部实证。作者已警告大量LLM生成且未严格校对，这不是已失效结论，但必须保留为采用前提。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-17](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/README.md#L1-L17)

作者定位、生成方法和未严格校对警告，非独立验证。

<details>
<summary>查看原文（17行）</summary>

```text
# AI Infrastructure Agent Skills

> **⚠️ WARNING**
> This project is under active development and heavily generated by LLMs without strict proofreading. Use with caution and verify all code before production use.

A collection of specialized agent skills for AI infrastructure engineers, covering both technical development (GPU kernels, distributed training, inference optimization) and soft skills (flowchart creation, presentation design).

## Overview

This repository provides expert-level skills tailored for AI infrastructure engineering. Each skill packages domain knowledge, code examples, and best practices to transform Claude into a specialized assistant for specific frameworks and workflows—from writing high-performance CUDA kernels to creating professional technical presentations.

### Construction Methodology (Unless Otherwise Specified)

1. **Knowledge Gathering**: Use Gemini DeepResearch to collect comprehensive, up-to-date information on target frameworks
2. **Skill Development**: Transform research into structured skills using `skill-creator` in Claude Code
3. **Validation**: Test skill-generated code examples to ensure correctness
4. **Maintenance**: Regular updates based on latest official documentation
```

</details>

**依据 2 · 作者声明**：[README.md:181-212](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/README.md#L181-L212)

安装为选目录复制到Claude路径，未证明DSH自动加载。

<details>
<summary>查看原文（32行）</summary>

````text
Ask Claude Code directly: "Help me install skills from https://github.com/yzlnew/infra-skills"

**Personal (across all projects):**
```bash
# Clone and copy to personal skills directory
git clone https://github.com/yzlnew/infra-skills.git
mkdir -p ~/.claude/skills
cp -r infra-skills/tilelang-developer ~/.claude/skills/
cp -r infra-skills/megatron-memory-estimator ~/.claude/skills/
cp -r infra-skills/slime-user ~/.claude/skills/
cp -r infra-skills/tikz-flowchart ~/.claude/skills/
cp -r infra-skills/material-you-slides ~/.claude/skills/
cp -r infra-skills/anthropic-theme-flowchart ~/.claude/skills/
cp -r infra-skills/hf-architecture-tikz ~/.claude/skills/
```

**Project-level (for repository collaborators):**
```bash
# Clone and copy to project's skills directory
cd your-project
git clone https://github.com/yzlnew/infra-skills.git .claude/skills-repo
mkdir -p .claude/skills
cp -r .claude/skills-repo/tilelang-developer .claude/skills/
cp -r .claude/skills-repo/megatron-memory-estimator .claude/skills/
cp -r .claude/skills-repo/slime-user .claude/skills/
cp -r .claude/skills-repo/tikz-flowchart .claude/skills/
cp -r .claude/skills-repo/material-you-slides .claude/skills/
cp -r .claude/skills-repo/anthropic-theme-flowchart .claude/skills/
cp -r .claude/skills-repo/hf-architecture-tikz .claude/skills/
```

Skills automatically activate when relevant tasks are detected.
````

</details>

**依据 3 · 源码核查**：[tilelang-developer/SKILL.md:1-17](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/tilelang-developer/SKILL.md#L1-L17)

GPU开发Skill真实入口与触发条件。

<details>
<summary>查看原文（17行）</summary>

```text
---
name: tilelang-developer
description: "Write, optimize, and debug high-performance AI compute kernels using TileLang (a Python DSL for GPU programming). Use when the user requests: (1) Writing custom GPU kernels for AI workloads (GEMM, Attention, MLA, etc.), (2) Optimizing existing TileLang code for NVIDIA, AMD, or Ascend hardware, (3) Implementing non-standard operators (like DeepSeek MLA, FlashAttention variants), (4) Debugging TileLang compilation or runtime errors, or (5) Cross-platform kernel development targeting multiple GPU vendors."
---

# TileLang Developer

Write high-performance AI compute kernels using TileLang - a tile-based programming model that bridges the gap between CUDA's low-level control and high-level abstractions.

## When to Use This Skill

Use this skill when the user needs to:
- Implement custom GPU kernels for AI operations (matrix multiplication, attention mechanisms, etc.)
- Optimize performance-critical operators for modern GPUs (NVIDIA Ampere/Hopper, AMD MI300X, Ascend NPU)
- Debug TileLang code or resolve performance issues
- Port kernels across different hardware platforms
- Understand or modify existing TileLang implementations
```

</details>

**依据 4 · 源码核查**：[slime-user/SKILL.md:1-23](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/slime-user/SKILL.md#L1-L23)

SLIME为使用指导，依赖外部框架和环境。

<details>
<summary>查看原文（23行）</summary>

````text
---
name: slime-user
description: Guide for using SLIME (LLM post-training framework for RL Scaling). Use when working with SLIME for reinforcement learning training of language models, including setup, configuration, training execution, multi-turn interactions, custom reward models, tool calling scenarios, or troubleshooting SLIME workflows. Covers GRPO, GSPO, PPO, Reinforce++, multi-agent RL, VLM training, FSDP/Megatron backends, SGLang integration, dynamic sampling, and custom generation functions.
---

# SLIME User Guide

SLIME is an LLM post-training framework for RL Scaling developed by THUDM. It supports various RL algorithms (GRPO, GSPO, PPO, Reinforce++), multiple training backends (Megatron, FSDP), and advanced features like multi-turn interactions, tool calling, and dynamic sampling.

## Quick Start Workflow

### For First-Time Users

1. **Environment Setup**
   - Use Docker: `docker pull slimerl/slime:latest`
   - Or build from source: See `docs/en/get_started/quick_start.md`
   - Hardware: Supports H100/H200, B200 series

2. **Download Model and Data**
   ```bash
   hf download Qwen/Qwen3-4B --local-dir /root/Qwen3-4B
   hf download --repo-type dataset zhuzilin/dapo-math-17k --local-dir /root/dapo-math-17k
   ```
````

</details>

**依据 5 · 源码核查**：[megatron-memory-estimator/scripts/estimate_from_hf.py:26-35](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/scripts/estimate_from_hf.py#L26-L35)

实际导入配置桥和估算器，不是只有文字。

<details>
<summary>查看原文（10行）</summary>

```text
try:
    from mbridge import AutoBridge
    from transformers import AutoConfig
except ImportError as e:
    print(f"Error: Required packages not installed: {e}")
    print("\nPlease install:")
    print("  pip install mbridge transformers")
    sys.exit(1)

from megatron_memory_estimator.estimate_013 import estimate_from_config, patch_parallel_states
```

</details>

**依据 6 · 源码核查**：[hf-architecture-tikz/SKILL.md:43-49](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/hf-architecture-tikz/SKILL.md#L43-L49)

配置到结构化规格、模板与编译的路由。

```text
## Workflow

1. **Acquire config.** `extract_arch.py` tries `transformers.AutoConfig` first; if the installed `transformers` doesn't recognize the `model_type` (e.g. `deepseek_v4` introduces `hc_mult`, `compress_ratios`), it falls back to raw JSON via `huggingface_hub.hf_hub_download`. Local file paths bypass network.
2. **Detect architecture family.** Pure config-field rules — see `references/architecture_families.md`. The script labels the model with a family tag (`mha`, `gqa`, `mla`, `dsv4`) plus orthogonal flags (MoE, hash routing, shared experts, MTP, tied LM head, first_k_dense_replace).
3. **Compute parameter counts.** Closed-form formulas keyed by family — see `references/param_formulas.md`. The script (not Claude) does the arithmetic and emits `arch.json` with one entry per architectural unit, each carrying `name`, `family`, `shape_in`, `shape_out`, `formula_symbolic`, `formula_concrete`, `param_count`.
4. **Assemble TikZ.** `render_tikz.py` reads `arch.json` plus `templates/anthropic.tex.j2` (Jinja2 template — all block macros are inlined for shared coordinate-space layout). The repeated transformer block is drawn once with a `× N layers` annotation; per-layer-varying behavior (V4-Flash compress_ratios, hash vs score routing) appears as a small pattern strip beneath the block.
5. **Compile.** `bash scripts/compile.sh out.tex` runs `xelatex` ×2 (TikZ `fit`/`positioning` needs a second pass) then `pdftocairo -png -r 300 -singlefile`. Falls back to `pdflatex` if XeTeX is unavailable.
```

**依据 7 · 源码核查**：[anthropic-theme-flowchart/src/build.ts:16-36](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/anthropic-theme-flowchart/src/build.ts#L16-L36)

实际从spec写HTML和可选SVG输出。

<details>
<summary>查看原文（21行）</summary>

```text
async function writeDiagram(diagram: DiagramSpec): Promise<void> {
  const outputPath = path.resolve(projectRoot, diagram.outputFile);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const html = `<!-- Generated by src/build.ts from TS specs. Do not edit by hand. -->\n${renderDiagram(diagram)}`;
  await writeFile(outputPath, html, "utf8");
  console.log(`wrote ${path.relative(projectRoot, outputPath)}`);

  if (diagram.galleryBaseName) {
    const galleryDir = path.resolve(projectRoot, "..", "gallery");
    await mkdir(galleryDir, { recursive: true });
    const svgPath = path.join(galleryDir, `${diagram.galleryBaseName}.svg`);
    await writeFile(svgPath, renderDiagramSvg(diagram), "utf8");
    console.log(`wrote ${path.relative(path.resolve(projectRoot, ".."), svgPath)}`);
  }
}

async function main(): Promise<void> {
  for (const diagram of diagrams) {
    await writeDiagram(diagram);
  }
```

</details>

**依据 8 · 源码核查**：[tikz-flowchart/SKILL.md:1-20](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/tikz-flowchart/SKILL.md#L1-L20)

主题选择与图表Skill入口。

<details>
<summary>查看原文（20行）</summary>

```text
---
name: tikz-flowchart
description: "Creates professional TikZ flowcharts with standardized themes, including Google Material-like and Anthropic-inspired options."
---

# TikZ Flowchart Skill

This skill provides standardized templates/styles for establishing professional technical diagrams using LaTeX TikZ. It is designed for creating flowcharts, architecture diagrams, and process flows.

## Usage

When asked to "create a flowchart" or "draw a diagram" in this project, first choose a single theme, then open only that theme's file as the starting point.

Before writing any `\node` or `\draw` commands, plan the layout first: decide the main flow direction, group nodes into rows/columns or lanes, and make sure related nodes are aligned so the connectors can stay orthogonal.

If you need to judge whether the generated diagram actually satisfies the user's requirements, do not rely only on your own generation pass. Spawn a subagent for an independent review and use that review to verify compliance or identify gaps.

- Use the **default Material-like theme** for conventional engineering diagrams with stronger semantic color coding and distinct data/storage/compute shapes.
- Use the **Anthropic theme** when the user wants warm ivory backgrounds, quiet dashed grouping containers, pastel cards, thin connectors, and a calm product-diagram look.

```

</details>

**依据 9 · 源码核查**：[material-you-slides/SKILL.md:1-22](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/material-you-slides/SKILL.md#L1-L22)

HTML幻灯片格式和Google Fonts依赖声明。

<details>
<summary>查看原文（22行）</summary>

```text
---
name: material-you-slides
description: Create presentation slides using Material You (Material Design 3) style. Generates 1280x720 HTML slides with M3 color tokens, Roboto typography, rounded cards, flow diagrams, metric cards, code blocks, and structured layouts. Use when the user asks to create slides, presentations, or decks and wants a clean, modern Material Design 3 aesthetic.
---

# Material You Slides Skill

Create presentation slide decks as single-file HTML using the Material You (Material Design 3) design language. The output is a self-contained `.html` file optimized for 1280x720 presentation dimensions, printable via `@page` rules.

## When to Use

Use this skill when the user asks to create slides, presentations, or decks and wants (or would benefit from) a clean, modern Material Design 3 look. This is the default slide style unless the user explicitly requests a different theme.

## Design Principles

1. **M3 Color Tokens** - Use CSS custom properties following Material Design 3 naming (`--md-sys-color-*`).
2. **Roboto Typography** - Import from Google Fonts. Use weights 300 (light/subtitle), 400 (body), 500 (medium), 600 (semibold headings), 700 (bold), 800-900 (display/hero).
3. **Rounded Shapes** - Four tiers of corner radius: small (8px), medium (12px), large (16px), extra-large (28px).
4. **Surface Hierarchy** - Use `surface`, `surface-container-low`, `surface-container`, `surface-container-high` for layered depth without drop shadows.
5. **Container Colors** - Cards use `*-container` / `on-*-container` pairs for accessible contrast.
6. **No Drop Shadows** - Rely on surface tones and subtle borders for elevation.
7. **Generous Whitespace** - Slide padding 24px 48px. Card padding 24px. Gap 16-32px between elements.
```

</details>

**依据 10 · 源码核查**：[openai-dotcom-viz/SKILL.md:1-23](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/openai-dotcom-viz/SKILL.md#L1-L23)

HTML/SVG风格图入口，独立于训练类Skill。

<details>
<summary>查看原文（23行）</summary>

```text
---
name: openai-dotcom-viz
description: >-
  Build figures in OpenAI's blog / research / system-card "dotcom" visual style —
  both (a) bar charts (monochrome bars with a darker same-hue stroke, rounded
  corners, a black y-axis with outward ticks and no gridlines, circle legend
  markers left-aligned to the y-axis, value labels above bars, angled category
  labels) and (b) flow / process diagrams (rounded boxes, monospace uppercase
  pills, pink highlights, thin open-chevron "arrow" connectors with rounded
  corners, dashed = negative branch). Everything uses the real OpenAI Sans font
  and is emitted as self-contained HTML/SVG with zero dependencies. Use this
  whenever the user wants a chart, pipeline/flow diagram, or figure that looks
  like OpenAI's website / posts / papers, asks to reproduce an OpenAI figure, or
  is building a deck or page in an OpenAI-flavored style. Prefer this over generic
  charting (matplotlib/Chart.js/Recharts) or generic diagram tools (Mermaid) when
  the aesthetic should match OpenAI.
---

# OpenAI dotcom figures

Reproduce the two figure types OpenAI uses in its posts, as **self-contained
HTML/SVG** (no Vega, D3, Mermaid, or build step):

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 显存估算与GPU示例如何处理适用性和正确性？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

显存路径读HF配置，经AutoBridge转换为Megatron配置，再设置TP/PP/EP/CP、重计算和训练参数。输入检查会拒绝总GPU数不能整除TP×PP×CP；层数不能均分PP且未指定首末分配时会给建议并退出，这是比直接给数字更好的边界。估算器本体复用Megatron结构并替换部分分布式/GPU查询，在内存中按stage推算，不是真实训练峰值测量；不包含本轮硬件测量，不能用估算低于显存容量直接承诺能训练。

输出与输入仍有可核缺口。--json在末尾打印JSON，但加载前不论该开关都会向stdout打印Loading model configuration...，所以正常成功输出也不是单一JSON文档；接入自动管道时不能仅照Skill的重定向示例假设可直接JSON解析。参数解析为int，整除检查前未先保证TP/PP/CP为正，零值可能在取模时抛异常。后续依赖可能再校验，不能据入口就宣称所有无效配置都得到友好拒绝。

GPU示例也有正反证。TileLang Skill要求参考算子对比；GEMM测试确实包含512方阵FP16与torch.matmul的allclose，非只有编译断言。但前面许多测试只确认编译返回非空，正确性测试无CUDA会skip；这不证明所有形状、精度、AMD/Ascend平台或优化都通过。源码存在测试与本轮已运行通过是两层证据。本次没有执行任何目标代码，不从未运行直接判示例错误，也不从Complete标签判其正确。

#### 证据与依据

**依据 1 · 源码核查**：[megatron-memory-estimator/scripts/estimate_from_hf.py:71-127](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/scripts/estimate_from_hf.py#L71-L127)

配置并行/训练参数与DP计算的实际路径。

<details>
<summary>查看原文（57行）</summary>

```text
def configure_parallelism(tf_config, args):
    """Configure parallelism settings in TransformerConfig"""
    tf_config.tensor_model_parallel_size = args.tp
    tf_config.pipeline_model_parallel_size = args.pp
    tf_config.expert_model_parallel_size = args.ep
    tf_config.context_parallel_size = args.cp

    if args.etp:
        tf_config.expert_tensor_parallel_size = args.etp

    if args.vpp:
        tf_config.num_layers_per_virtual_pipeline_stage = args.vpp

    if args.num_layers_in_first_pipeline_stage is not None:
        tf_config.num_layers_in_first_pipeline_stage = args.num_layers_in_first_pipeline_stage
    if args.num_layers_in_last_pipeline_stage is not None:
        tf_config.num_layers_in_last_pipeline_stage = args.num_layers_in_last_pipeline_stage

    return tf_config


def configure_training(tf_config, args):
    """Configure training settings in TransformerConfig"""
    tf_config.recompute_granularity = args.recompute_granularity
    tf_config.recompute_method = args.recompute_method if args.recompute_granularity else None
    tf_config.recompute_num_layers = args.recompute_num_layers if args.recompute_granularity else None

    if args.recompute_modules:
        tf_config.recompute_modules = args.recompute_modules.split(',')

    return tf_config


def create_args_namespace(args, tf_config, hf_config):
    """Create args object for estimator"""
    from argparse import Namespace

    parallel_product = args.tp * args.pp * args.cp

    estimator_args = Namespace()
    estimator_args.micro_batch_size = args.micro_batch_size
    estimator_args.seq_length = args.seq_length
    estimator_args.use_distributed_optimizer = args.use_distributed_optimizer
    estimator_args.data_parallel_size = args.num_gpus // parallel_product
    estimator_args.world_size = args.num_gpus
    estimator_args.expert_tensor_parallel_size = args.etp if args.etp else 1

    # Required by estimator
    estimator_args.transformer_impl = "transformer_engine"
    estimator_args.fp8 = False
    estimator_args.num_experts = getattr(tf_config, "num_moe_experts", None)
    estimator_args.moe_grouped_gemm = True
    estimator_args.qk_layernorm = getattr(tf_config, "qk_layernorm", False)
    estimator_args.multi_latent_attention = "deepseek" in getattr(hf_config, "model_type", "").lower()
    estimator_args.padded_vocab_size = getattr(hf_config, "vocab_size")
    estimator_args.max_position_embeddings = getattr(hf_config, "max_position_embeddings")
    estimator_args.tie_word_embeddings = getattr(hf_config, "tie_word_embeddings", False)
```

</details>

**依据 2 · 源码核查**：[megatron-memory-estimator/scripts/estimate_from_hf.py:279-329](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/scripts/estimate_from_hf.py#L279-L329)

整除和PP层数检查，同时展示加载行不受json条件控制。

<details>
<summary>查看原文（51行）</summary>

```text
    args = parser.parse_args()

    # Validate inputs
    if not args.model_path and not args.custom_config:
        parser.error("Either model_path or --custom-config must be provided")

    if args.num_gpus % (args.tp * args.pp * args.cp) != 0:
        print(f"Error: num_gpus ({args.num_gpus}) must be divisible by TP*PP*CP ({args.tp * args.pp * args.cp})")
        return 1

    # Pipeline parallelism layer distribution validation will be done after loading config
    # (needs num_hidden_layers from the model config)

    # Load config
    print("Loading model configuration...")
    custom_config_dict = None
    if args.custom_config:
        custom_config_dict = json.loads(args.custom_config)

    # Patch parallel states before loading config
    patch_parallel_states()

    try:
        bridge, tf_config, hf_config = load_hf_config(
            args.model_path or "", custom_config_dict
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error loading config: {e}")
        return 1

    # Validate pipeline parallelism layer distribution
    num_layers = getattr(hf_config, 'num_hidden_layers', 0)
    if args.pp > 1 and num_layers > 0:
        first_stage_layers = args.num_layers_in_first_pipeline_stage
        last_stage_layers = args.num_layers_in_last_pipeline_stage
        
        if num_layers % args.pp != 0:
            if first_stage_layers is None and last_stage_layers is None:
                base_layers = num_layers // args.pp
                remainder = num_layers % args.pp
                suggested_last = base_layers + remainder
                # Build distribution string: base + base + ... + suggested_last
                distribution = ' + '.join([str(base_layers)] * (args.pp - 1)) + f' + {suggested_last}'
                print(f"\nWarning: num_hidden_layers ({num_layers}) is not divisible by pp ({args.pp}).")
                print(f"Please specify layer distribution using:")
                print(f"  --num-layers-in-last-pipeline-stage {suggested_last}")
                print(f"  (This will distribute as: {distribution} = {num_layers})")
                print(f"\nOr use --num-layers-in-first-pipeline-stage to place extra layers at the beginning.")
                return 1
```

</details>

**依据 3 · 源码核查**：[megatron-memory-estimator/scripts/estimate_from_hf.py:338-370](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/scripts/estimate_from_hf.py#L338-L370)

json分支在最后输出JSON，与前面的stdout前缀不一致。

<details>
<summary>查看原文（33行）</summary>

```text
    # Print summary
    if not args.json:
        print_config_summary(hf_config, args)
        print("\nRunning memory estimation...")

    # Run estimation
    try:
        reports, raw_reports = estimate_from_config(tf_config, estimator_args, verbose=args.verbose)
    except Exception as e:
        print(f"Error during estimation: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1

    # Output results
    if args.json:
        import json
        output = {
            'model_type': getattr(hf_config, 'model_type', 'unknown'),
            'parallelism': {
                'tp': args.tp, 'pp': args.pp, 'ep': args.ep, 'cp': args.cp
            },
            'training': {
                'micro_batch_size': args.micro_batch_size,
                'seq_length': args.seq_length,
                'num_gpus': args.num_gpus
            },
            'reports': reports
        }
        print(json.dumps(output, indent=2))
    else:
        print_memory_report(reports)
```

</details>

**依据 4 · 源码核查**：[megatron-memory-estimator/megatron_memory_estimator/estimate_013.py:54-99](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/megatron_memory_estimator/estimate_013.py#L54-L99)

替换GPU/分布式查询并逐stage估算，非实测训练。

<details>
<summary>查看原文（46行）</summary>

```text
from megatron_memory_estimator.moe_mem_estimator.gpt_model import GPTModel
from megatron_memory_estimator.moe_mem_estimator.layers import MLASelfAttention, MoELayer

torch.distributed.get_rank = lambda: 0
torch.cuda.get_device_capability = lambda: [8]

def estimate_from_config(config, args, verbose=False):
    """
    Estimate memory usage from a given config and args, instead of global state.
    Now supports virtual pipeline model parallelism for more accurate results.
    
    Args:
        config: TransformerConfig object
        args: Arguments namespace
        verbose: If True, print detailed per-PP-rank logs (default: False)
    """

    args.moe_grouped_gemm = True
    patch_parallel_states()
    patch_num_layers_to_build()
    if config is None:
        config = core_transformer_config_from_args(args)

    input_shape = [args.micro_batch_size, args.seq_length]

    set_global_config(config)
    # 太长了，注释掉
    # print(config)
    # return
    cli_reports = []

    if config.pipeline_model_parallel_size > 1:
        for pp_rank in range(config.pipeline_model_parallel_size):
            set_pipeline_model_parallel_rank(pp_rank)
            if verbose:
                print(
                    f"\n------------------------------[Pipeline_Parallelism_Rank={pp_rank}]------------------------------"
                )
            input_shape, rpt = report_memory_usage_one_pp_rank(
                input_shape, args, config, pp_rank, config.pipeline_model_parallel_size, verbose=verbose
            )
            cli_reports.append(rpt)
    else:
        set_pipeline_model_parallel_rank(0)
        _, rpt = report_memory_usage_one_pp_rank(input_shape, args, config, verbose=verbose)
        cli_reports.append(rpt)
```

</details>

**依据 5 · 源码核查**：[tilelang-developer/SKILL.md:136-158](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/tilelang-developer/SKILL.md#L136-L158)

作者明确要求参考正确性对比。

<details>
<summary>查看原文（23行）</summary>

````text
### Step 5: Validate and Test

Generate test code to verify correctness:

```python
# Example instantiation
func = kernel_name(
    M=1024, N=1024, K=1024,
    block_M=128, block_N=128, block_K=32
)

# Test against reference implementation
import torch
A = torch.randn(1024, 1024, dtype=torch.float16, device='cuda')
B = torch.randn(1024, 1024, dtype=torch.float16, device='cuda')
C_tilelang = torch.empty(1024, 1024, dtype=torch.float16, device='cuda')
C_reference = A @ B

func(A, B, C_tilelang)

# Verify with appropriate tolerance for FP16
torch.testing.assert_close(C_tilelang, C_reference, rtol=1e-3, atol=1e-3)
```
````

</details>

**依据 6 · 源码核查**：[tests/tilelang-developer/test_gemm.py:254-316](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/tests/tilelang-developer/test_gemm.py#L254-L316)

实际数值对比存在，但限512方阵FP16且无CUDA跳过。

<details>
<summary>查看原文（63行）</summary>

```text

class TestGemmIntegration:
    """Integration tests for GEMM kernel with actual computation."""

    @pytest.mark.skipif(
        not _cuda_available(),
        reason="CUDA not available"
    )
    def test_correctness_against_pytorch(self):
        """Test GEMM correctness against PyTorch reference."""
        import tilelang
        import tilelang.language as T
        import torch

        @tilelang.jit(target="cuda", out_idx=[2])
        def matmul_kernel(M, N, K, block_M, block_N, block_K):
            @T.prim_func
            def main(
                A: T.Buffer((M, K), "float16"),
                B: T.Buffer((K, N), "float16"),
                C: T.Buffer((M, N), "float16")
            ):
                with T.Kernel(
                    T.ceildiv(N, block_N),
                    T.ceildiv(M, block_M),
                    threads=128
                ) as (bx, by):
                    A_shared = T.alloc_shared((block_M, block_K), "float16")
                    B_shared = T.alloc_shared((block_K, block_N), "float16")
                    C_local = T.alloc_fragment((block_M, block_N), "float32")

                    T.annotate_layout({
                        A_shared: T.make_swizzled_layout(A_shared),
                        B_shared: T.make_swizzled_layout(B_shared)
                    })

                    T.clear(C_local)

                    num_k_tiles = T.ceildiv(K, block_K)
                    for k in T.Pipelined(num_k_tiles, num_stages=3):
                        T.copy(A[by * block_M, k * block_K], A_shared)
                        T.copy(B[k * block_K, bx * block_N], B_shared)
                        T.gemm(A_shared, B_shared, C_local, transpose_B=False)

                    T.copy(C_local, C[by * block_M, bx * block_N])

            return main

        # Create test inputs
        M, N, K = 512, 512, 512
        A = torch.randn(M, K, dtype=torch.float16, device='cuda')
        B = torch.randn(K, N, dtype=torch.float16, device='cuda')
        C = torch.empty(M, N, dtype=torch.float16, device='cuda')

        # Compute with TileLang
        func = matmul_kernel(M=M, N=N, K=K, block_M=128, block_N=128, block_K=32)
        func(A, B, C)

        # Compute reference
        C_ref = torch.matmul(A, B)

        # Check correctness (with tolerance for float16)
        assert torch.allclose(C, C_ref, rtol=1e-2, atol=1e-2)
```

</details>

**依据 7 · 源码核查**：[tests/tilelang-developer/test_gemm.py:56-61](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/tests/tilelang-developer/test_gemm.py#L56-L61)

编译断言只检查对象存在，不证明输出质量。

```text
        # Test compilation succeeds
        func = matmul_kernel(
            M=1024, N=1024, K=1024,
            block_M=128, block_N=128, block_K=32
        )
        assert func is not None
```

#### 缺口

- 估算误差、GPU/软件版本兼容及跨平台正确性未测。
  **影响**：不能以公式数字做资源采购/生产容量保证，不能推广单样例测试覆盖。
  **进一步探讨**：固定框架、模型revision、硬件、精度和任务形状，在隔离环境将估算对照真实峰值，并比较算子参考结果、尾部形状与性能。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用与退出需要什么，收益有何依据？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

本轮建议观察集合，按具体入口筛选，而非整包作为生产默认。目标工程师可先只读参考或在新环境中核一个已知配置；有能力独立检查模型、数值与图表语义才应进一步执行。根README的Complete与测试要求是作者状态，不是本轮成果。

环境脚本直接pip安装多个包，只将megatron-core固定到0.13.0，其余依赖未锁；底层代码还导入megatron.training，安装包是否提供所有路径不能只由setup complete字样证明。HF配置获取涉及外部仓库；架构提取器明确支持revision和显式trust_remote_code，估算入口对AutoConfig类赋值本身不能证明AutoBridge执行时的远程代码策略，需核依赖实际行为。图形路径则分别需要Node/TS、LaTeX/Poppler、Python/Jinja或浏览器字体资源，不应混作零依赖。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 所选Skill、模型配置、工具链和依赖下载；金额未知 | 检查许可、固定版本、准备隔离环境；耗时未知 | 不运行整包setup到既有训练环境 |
| 持续使用 | GPU/训练/模型调用或绘图编译资源，按入口变化 | 对照数值、测峰值或检查排版语义 | 存在示例不证明达到目标硬件性能 |
| 失败恢复 | 环境副本、生成物和原配置存储 | 排依赖、回退环境、重做错误图或估算 | 生成器写文件，没有统一跨Skill事务 |
| 升级与退出 | 保留固定环境、配置和结果 | 停用选定目录并回官方文档/已有工具 | 无统一版本锁或所有入口迁移保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 知识路由 | 八个真实Skill入口和主题资源 | 是否减少独立任务准备时间 |
| 显存估算 | 配置桥、并行参数和stage报告 | 实际峰值误差、可训练性与成本 |
| Kernel示例 | 编译与单样例数值测试代码 | 目标环境通过、全形状和跨平台性能 |
| 图表生成 | 结构化spec到HTML/SVG/TikZ路径 | 内容正确、参数公式准确与最终视觉质量 |

使用时先定义一项已知结果的验收任务。依赖无法固定、估算与实测明显偏离、测试被skip、图表结构与模型不符时，停止将输出用于决策，保留输入和环境并回官方实现或已验证工具；不要靠重复生成补造置信度。

#### 证据与依据

**依据 1 · 源码核查**：[megatron-memory-estimator/scripts/setup_env.sh:12-28](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/scripts/setup_env.sh#L12-L28)

直接pip安装且大部分未锁版本，setup字样不是兼容验收。

<details>
<summary>查看原文（17行）</summary>

```text
# Check if pip is available
if ! command -v pip &> /dev/null; then
    echo "Error: pip not found. Please install Python and pip first."
    exit 1
fi

echo "Installing required packages..."
echo

# Install core dependencies
pip install mbridge transformers torch megatron-core==0.13.0 einops termcolor tabulate pyyaml

echo
echo "✓ Setup complete!"
echo
echo "You can now use the skill with:"
echo "  python scripts/estimate_from_hf.py deepseek-ai/DeepSeek-V3 --tp 4 --pp 4 --ep 8 --num-layers-in-last-pipeline-stage 16"
```

</details>

**依据 2 · 源码核查**：[megatron-memory-estimator/megatron_memory_estimator/estimate_013.py:14-43](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/megatron_memory_estimator/estimate_013.py#L14-L43)

导入Megatron core及training，实际环境需满足完整路径。

<details>
<summary>查看原文（30行）</summary>

```text
import torch
from megatron.core import mpu
from megatron.core.datasets.blended_megatron_dataset_builder import (
    BlendedMegatronDatasetBuilder,
)
from megatron.core.datasets.gpt_dataset import (
    GPTDataset,
    GPTDatasetConfig,
    MockGPTDataset,
)
from megatron.core.datasets.utils import get_blend_from_list
from megatron.core.enums import ModelType
from megatron.core.models.gpt.gpt_layer_specs import (
    get_gpt_decoder_block_spec,
    get_gpt_layer_local_spec,
    get_gpt_layer_with_transformer_engine_spec,
    get_gpt_mtp_block_spec,
)
from megatron.core.transformer.spec_utils import import_module
from megatron.core.utils import StragglerDetector
from megatron.training import (
    get_args,
    get_timers,
    get_tokenizer,
    pretrain,
    print_rank_0,
)
from megatron.training.arguments import core_transformer_config_from_args
from megatron.training.initialize import initialize_megatron
from megatron.training.utils import get_batch_on_this_cp_rank, get_batch_on_this_tp_rank
```

</details>

**依据 3 · 源码核查**：[hf-architecture-tikz/scripts/extract_arch.py:29-70](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/hf-architecture-tikz/scripts/extract_arch.py#L29-L70)

本地配置/显式revision和trust_remote_code，再回退原始配置。

<details>
<summary>查看原文（42行）</summary>

```text
def load_config(source: str, trust_remote_code: bool = False, revision: str | None = None) -> dict[str, Any]:
    """Return the raw HF config dict for `source`.

    `source` may be a path to a local config.json or a HuggingFace repo id.
    """
    if os.path.exists(source):
        with open(source) as f:
            return json.load(f)

    # Try transformers first (handles known model_types cleanly)
    try:
        from transformers import AutoConfig

        cfg = AutoConfig.from_pretrained(
            source,
            trust_remote_code=trust_remote_code,
            revision=revision,
        )
        d = cfg.to_dict()
        # AutoConfig drops unknown fields. For DSv4-class models we need them all,
        # so fall through to raw download if the config looks impoverished.
        if d.get("model_type") in {"deepseek_v4", "deepseek_v3", "deepseek_v2"}:
            raise RuntimeError("Force raw fallback for DeepSeek configs")
        return d
    except Exception as exc_transformers:
        # Fall back to raw download from the Hub
        try:
            from huggingface_hub import hf_hub_download

            local = hf_hub_download(
                repo_id=source,
                filename="config.json",
                revision=revision,
            )
            with open(local) as f:
                return json.load(f)
        except Exception as exc_hub:
            raise RuntimeError(
                f"Could not load config from {source!r}.\n"
                f"  transformers attempt: {exc_transformers}\n"
                f"  huggingface_hub attempt: {exc_hub}"
            )
```

</details>

**依据 4 · 源码核查**：[hf-architecture-tikz/SKILL.md:43-49](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/hf-architecture-tikz/SKILL.md#L43-L49)

图形链需要配置、模板、编译和渲染，非统一零依赖。

```text
## Workflow

1. **Acquire config.** `extract_arch.py` tries `transformers.AutoConfig` first; if the installed `transformers` doesn't recognize the `model_type` (e.g. `deepseek_v4` introduces `hc_mult`, `compress_ratios`), it falls back to raw JSON via `huggingface_hub.hf_hub_download`. Local file paths bypass network.
2. **Detect architecture family.** Pure config-field rules — see `references/architecture_families.md`. The script labels the model with a family tag (`mha`, `gqa`, `mla`, `dsv4`) plus orthogonal flags (MoE, hash routing, shared experts, MTP, tied LM head, first_k_dense_replace).
3. **Compute parameter counts.** Closed-form formulas keyed by family — see `references/param_formulas.md`. The script (not Claude) does the arithmetic and emits `arch.json` with one entry per architectural unit, each carrying `name`, `family`, `shape_in`, `shape_out`, `formula_symbolic`, `formula_concrete`, `param_count`.
4. **Assemble TikZ.** `render_tikz.py` reads `arch.json` plus `templates/anthropic.tex.j2` (Jinja2 template — all block macros are inlined for shared coordinate-space layout). The repeated transformer block is drawn once with a `× N layers` annotation; per-layer-varying behavior (V4-Flash compress_ratios, hash vs score routing) appears as a small pattern strip beneath the block.
5. **Compile.** `bash scripts/compile.sh out.tex` runs `xelatex` ×2 (TikZ `fit`/`positioning` needs a second pass) then `pdftocairo -png -r 300 -singlefile`. Falls back to `pdflatex` if XeTeX is unavailable.
```

**依据 5 · 源码核查**：[anthropic-theme-flowchart/src/build.ts:16-36](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/anthropic-theme-flowchart/src/build.ts#L16-L36)

生成器创建并覆盖输出路径，需保留原输入。

<details>
<summary>查看原文（21行）</summary>

```text
async function writeDiagram(diagram: DiagramSpec): Promise<void> {
  const outputPath = path.resolve(projectRoot, diagram.outputFile);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const html = `<!-- Generated by src/build.ts from TS specs. Do not edit by hand. -->\n${renderDiagram(diagram)}`;
  await writeFile(outputPath, html, "utf8");
  console.log(`wrote ${path.relative(projectRoot, outputPath)}`);

  if (diagram.galleryBaseName) {
    const galleryDir = path.resolve(projectRoot, "..", "gallery");
    await mkdir(galleryDir, { recursive: true });
    const svgPath = path.join(galleryDir, `${diagram.galleryBaseName}.svg`);
    await writeFile(svgPath, renderDiagramSvg(diagram), "utf8");
    console.log(`wrote ${path.relative(path.resolve(projectRoot, ".."), svgPath)}`);
  }
}

async function main(): Promise<void> {
  for (const diagram of diagrams) {
    await writeDiagram(diagram);
  }
```

</details>

**依据 6 · 作者声明**：[README.md:1-4](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/README.md#L1-L4)

作者生产使用前验证警告是边界依据。

```text
# AI Infrastructure Agent Skills

> **⚠️ WARNING**
> This project is under active development and heavily generated by LLMs without strict proofreading. Use with caution and verify all code before production use.
```

#### 缺口

- 未在固定环境执行各入口，未完整审全部公式、训练和绘图实现。
  **影响**：只能对已读关键路径形成集合层结论，不能宣称八项全部功能已完成验证。
  **进一步探讨**：按目标入口单独固定版本和环境、读必要实现并做已知结果对照，再评价是否持续采用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样把“示例可读”变成按环境可复核？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设是为每个示例保存最小复核记录：模型/输入摘要、框架版本、硬件与精度、是否真实执行、对照结果以及未覆盖项。它基于现有Skill已有测试与配置说明，而不是假称集合完全无验证；新增是把执行状态和适用环境随产物交付，避免Complete或一段示例被推广为目标环境保证。

以已知GEMM形状、已知训练峰值和已知结构模型图为小样本，对照现有目录说明与该记录。分别测错误采用、重复排障、估算偏差被发现的速度、记录成本和维护漂移；没有CUDA的skip要明确显示未执行而非通过。若记录只是自动填通过、未减少错误推广，或维护成本高于收益，就否定该方案。它不替代训练实测、模型原始结构和图形人工校对。

#### 证据与依据

**依据 1 · 源码核查**：[tests/tilelang-developer/test_gemm.py:254-316](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/tests/tilelang-developer/test_gemm.py#L254-L316)

已存在数值对照和skip条件，为新增执行记录提供具体基线。

<details>
<summary>查看原文（63行）</summary>

```text

class TestGemmIntegration:
    """Integration tests for GEMM kernel with actual computation."""

    @pytest.mark.skipif(
        not _cuda_available(),
        reason="CUDA not available"
    )
    def test_correctness_against_pytorch(self):
        """Test GEMM correctness against PyTorch reference."""
        import tilelang
        import tilelang.language as T
        import torch

        @tilelang.jit(target="cuda", out_idx=[2])
        def matmul_kernel(M, N, K, block_M, block_N, block_K):
            @T.prim_func
            def main(
                A: T.Buffer((M, K), "float16"),
                B: T.Buffer((K, N), "float16"),
                C: T.Buffer((M, N), "float16")
            ):
                with T.Kernel(
                    T.ceildiv(N, block_N),
                    T.ceildiv(M, block_M),
                    threads=128
                ) as (bx, by):
                    A_shared = T.alloc_shared((block_M, block_K), "float16")
                    B_shared = T.alloc_shared((block_K, block_N), "float16")
                    C_local = T.alloc_fragment((block_M, block_N), "float32")

                    T.annotate_layout({
                        A_shared: T.make_swizzled_layout(A_shared),
                        B_shared: T.make_swizzled_layout(B_shared)
                    })

                    T.clear(C_local)

                    num_k_tiles = T.ceildiv(K, block_K)
                    for k in T.Pipelined(num_k_tiles, num_stages=3):
                        T.copy(A[by * block_M, k * block_K], A_shared)
                        T.copy(B[k * block_K, bx * block_N], B_shared)
                        T.gemm(A_shared, B_shared, C_local, transpose_B=False)

                    T.copy(C_local, C[by * block_M, bx * block_N])

            return main

        # Create test inputs
        M, N, K = 512, 512, 512
        A = torch.randn(M, K, dtype=torch.float16, device='cuda')
        B = torch.randn(K, N, dtype=torch.float16, device='cuda')
        C = torch.empty(M, N, dtype=torch.float16, device='cuda')

        # Compute with TileLang
        func = matmul_kernel(M=M, N=N, K=K, block_M=128, block_N=128, block_K=32)
        func(A, B, C)

        # Compute reference
        C_ref = torch.matmul(A, B)

        # Check correctness (with tolerance for float16)
        assert torch.allclose(C, C_ref, rtol=1e-2, atol=1e-2)
```

</details>

**依据 2 · 源码核查**：[megatron-memory-estimator/scripts/estimate_from_hf.py:353-368](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/megatron-memory-estimator/scripts/estimate_from_hf.py#L353-L368)

当前报告记录部分并行/训练参数，但无实际测量误差和环境收据。

<details>
<summary>查看原文（16行）</summary>

```text
    # Output results
    if args.json:
        import json
        output = {
            'model_type': getattr(hf_config, 'model_type', 'unknown'),
            'parallelism': {
                'tp': args.tp, 'pp': args.pp, 'ep': args.ep, 'cp': args.cp
            },
            'training': {
                'micro_batch_size': args.micro_batch_size,
                'seq_length': args.seq_length,
                'num_gpus': args.num_gpus
            },
            'reports': reports
        }
        print(json.dumps(output, indent=2))
```

</details>

**依据 3 · 源码核查**：[README.md:12-17](https://github.com/yzlnew/infra-skills/blob/f3a8d7d4e898e350282b18ed6ee5fd8affea95cf/README.md#L12-L17)

作者声称验证和维护流程，假设将其落实到可核产物。

```text
### Construction Methodology (Unless Otherwise Specified)

1. **Knowledge Gathering**: Use Gemini DeepResearch to collect comprehensive, up-to-date information on target frameworks
2. **Skill Development**: Transform research into structured skills using `skill-creator` in Claude Code
3. **Validation**: Test skill-generated code examples to ensure correctness
4. **Maintenance**: Regular updates based on latest official documentation
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
