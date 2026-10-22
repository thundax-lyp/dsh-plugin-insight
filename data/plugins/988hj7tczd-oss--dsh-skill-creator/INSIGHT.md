# dsh-skill-creator

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f9ff567](https://github.com/988hj7tczd-oss/dsh-skill-creator/tree/f9ff56714decd8d604d97dced494206937c8f907)

<!-- BEGIN META -->
[![npm 30d 790](https://img.shields.io/static/v1?label=npm+30d&message=790&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-creator) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-skill-creator)
<!-- END META -->

> **实现功能**：为 DSH 创建、校验、打包 Skill，并提出或写入 description 改写。

> **核心亮点**：相对手工复制Skill目录，增量是DSH工具化的完整素材生命周期和运行期输出provider。作者明确参考上游skill-creator形态，新增TS适配/ZIP/frontmatter实现；方法移植与格式工具不等于自动优化触发语义。

> **风险与缺陷**：“保留场景覆盖”能否由关键词证明？improve tokenize只匹配ASCII单词、最多保留8词，中文场景及否定/条件关系无法用包含关系保证；commit只替换description也可能语义退化。Node二进制打包与文本fs回退有不同权限边界。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Skill作者从任务意图生成目录草稿，校验和打包后交付可加载资源；语义质量仍需真实触发测试。

参照上游Skill创作方法和手工目录管理；不把移植算原创语义优化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：skill_new/validate/package/improve_description。
- **后台**：输出目录Skill provider。

**流程与依赖**

src/index注册四工具与输出目录provider；draft确定性抽意图，validate/frontmatter做YAML子集检查，package生成.skill ZIP，improve提取保留词后改description，可commit写回。

DSH tools/fs/skills、Node文件/ZIP能力、可选Python PyYAML；构建和输出路径策略需核查。

目标→草稿/澄清→生成目录→校验→打包→provider发现；改写先提案再commit，语义测试由人补。

TS需构建，开发link依赖相邻dsh-src；YAML子集与PyYAML边界需分开，输出provider custom rank300。

**效果与成本**

首次匹配宿主/输出路径，持续测试触发、评估与维护；无LLM必需费用，人工用例和修订时间未测。

减少格式/打包重复劳动；不能自动证明Skill有用、描述更准或生产可加载。

> **思考**：“保留场景覆盖”能否由关键词证明？improve tokenize只匹配ASCII单词、最多保留8词，中文场景及否定/条件关系无法用包含关系保证；commit只替换description也可能语义退化。Node二进制打包与文本fs回退有不同权限边界。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手工复制Skill目录，增量是DSH工具化的完整素材生命周期和运行期输出provider。作者明确参考上游skill-creator形态，新增TS适配/ZIP/frontmatter实现；方法移植与格式工具不等于自动优化触发语义。

相对手工复制Skill目录，增量是DSH工具化的完整素材生命周期和运行期输出provider。作者明确参考上游skill-creator形态，新增TS适配/ZIP/frontmatter实现；方法移植与格式工具不等于自动优化触发语义。

四核心操作分离、写前读和输出provider同源便于维护；明确YAML子集及Node写入边界比声称通用解析更可靠。

固定源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/index.ts)、[src/lib/draft.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/draft.ts)、[src/lib/improve.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/improve.ts)、[src/lib/frontmatter.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/frontmatter.ts)、[src/lib/validate-skill.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/validate-skill.ts)、[src/lib/provider.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/provider.ts)、[src/lib/package-skill.ts](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/src/lib/package-skill.ts)、[package.json](https://github.com/988hj7tczd-oss/dsh-skill-creator/blob/f9ff56714decd8d604d97dced494206937c8f907/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“保留场景覆盖”能否由关键词证明？improve tokenize只匹配ASCII单词、最多保留8词，中文场景及否定/条件关系无法用包含关系保证；commit只替换description也可能语义退化。Node二进制打包与文本fs回退有不同权限边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

Skill作者先生成草稿和包；保留原description，以真实正负用例确认后再commit，中文需求别依赖保词判定。

核查状态：源码确认创建/校验/打包流程；未执行生成或宿主挂载，不把格式检查当Skill效果验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.0；版本日期：2026-08-24（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[f9ff5671](https://github.com/988hj7tczd-oss/dsh-skill-creator/tree/f9ff56714decd8d604d97dced494206937c8f907)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读工具入口、draft/improve、frontmatter/validate、provider/package；未执行目标或真实触发测试。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

待验证假设：以独立正负触发用例替代保词校验，并将候选description与测试结果绑定后再写回，可发现中文与否定边界退化。由ASCII/8词启发式推导，未实现。对中文、多条件、同词相反语义盲测召回/误触与维护时间；没有测试不能宣称提升。

隔离输出验证中文/否定触发、复杂YAML、ZIP排除与安装发现；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 299 | — | — | 3753 |
| .ts | source | 16 | 2129 | 1706 | 272 | — |
| .ts | test | 1 | 212 | 158 | 29 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-skill-creator/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
