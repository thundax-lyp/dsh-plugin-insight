# dsh-modernize-code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4d11010](https://github.com/988hj7tczd-oss/dsh-modernize-code/tree/4d110103666fde9515b9a8077b7e0458d00023a8)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：提供遗留代码预检、静态热区评估和分阶段迁移规划技能及Python工具。

> **核心亮点**：贡献是将预检、热区、路线图和逐块回滚纪律串联，脚本把部分检查变成可重复材料；相对直接让模型大改代码，明确保留未答问题和验证点。不是自动AST迁移器，模式匹配不代表死代码证明或业务优先级。

> **风险与缺陷**：工具称只读是指不改项目代码，实际上默认写PREFLIGHT.md与legacy-hotspots.md。preflight的测试能力主要查测试文件/runner存在，不等于构建或测试真的通过。runScript创建超时controller却不接工具exec.signal，用户取消传播需核；环境就绪和静态命中不能替代迁移回归。

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

> **用途**：适合准备技术迁移、需要先识别环境与风险的开发团队，非普通单文件编辑。

替代是人工迁移评估、成熟静态分析与codemod；项目提供DSH流程集成，不替代业务回归和AST转换。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：dsh-modernize-code分阶段迁移流程
- **模型工具**：modernize-preflight、modernize-assess评估并写报告

**流程与依赖**

skill-mount.ts挂独立filesystem技能root；modernize-tools.ts注册modernize-preflight/assess，以宿主subprocess调用Python脚本。脚本检查环境与静态模式并写报告，map/transform依Skill指导模型与用户。

宿主skills、dsh-skill-filesystem、tools/subprocess与Python；源码/发布依赖按固定package及README核，迁移目标构建链另需。

五问不等待→六项预检写报告→静态热区→模型结合业务排序→用户确认阶段路线图→逐块改造/验证/回滚；本轮仅检查实现未执行。

**效果与成本**

首次准备Python与宿主技能/子进程服务，回答业务约束并审阅报告；持续成本是模型评估、人工确认与回归。迁移执行由后续流程完成，现金随模型/CI，收益无实测。

有助于提前暴露前置条件，未有真实遗留项目迁移成效或人力对照。

> **思考**：工具称只读是指不改项目代码，实际上默认写PREFLIGHT.md与legacy-hotspots.md。preflight的测试能力主要查测试文件/runner存在，不等于构建或测试真的通过。runScript创建超时controller却不接工具exec.signal，用户取消传播需核；环境就绪和静态命中不能替代迁移回归。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：贡献是将预检、热区、路线图和逐块回滚纪律串联，脚本把部分检查变成可重复材料；相对直接让模型大改代码，明确保留未答问题和验证点。不是自动AST迁移器，模式匹配不代表死代码证明或业务优先级。

贡献是将预检、热区、路线图和逐块回滚纪律串联，脚本把部分检查变成可重复材料；相对直接让模型大改代码，明确保留未答问题和验证点。不是自动AST迁移器，模式匹配不代表死代码证明或业务优先级。

评估脚本与宿主薄封装分离，非shell argv、有界输出与超时是实质实现；map/transform主要是Skill规则，不能标已自动执行。Python静态扫描的语言覆盖与误报需另验。

源码依据：[src/skill-mount.ts](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/src/skill-mount.ts)、[src/modernize-tools.ts](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/src/modernize-tools.ts)、[cordis.patch.yml](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/cordis.patch.yml)、[skills/dsh-modernize-code/SKILL.md](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/SKILL.md)、[skills/dsh-modernize-code/scripts/preflight.py](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/preflight.py)、[skills/dsh-modernize-code/scripts/detect-patterns.py](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/detect-patterns.py)。

<a id="detail-section-5"></a>

### 1.4 主要限制

工具称只读是指不改项目代码，实际上默认写PREFLIGHT.md与legacy-hotspots.md。preflight的测试能力主要查测试文件/runner存在，不等于构建或测试真的通过。runScript创建超时controller却不接工具exec.signal，用户取消传播需核；环境就绪和静态命中不能替代迁移回归。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合先生成迁移评估材料。确认报告写入位置，并把预检就绪理解为静态准备状态；路线图、代码改动和每阶段验证都需独立核查。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[988hj7tczd-oss/dsh-modernize-code](https://github.com/988hj7tczd-oss/dsh-modernize-code)
- **版本号**：0.1.2（[固定提交 4d110103](https://github.com/988hj7tczd-oss/dsh-modernize-code/tree/4d110103666fde9515b9a8077b7e0458d00023a8)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/skill-mount.ts、src/modernize-tools.ts、cordis.patch.yml、skills/dsh-modernize-code/SKILL.md、skills/dsh-modernize-code/scripts/preflight.py、skills/dsh-modernize-code/scripts/detect-patterns.py、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核静态预检与真实测试差异、报告覆盖、取消传播、误报样例及阶段回滚；本轮未调用Python工具或迁移。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：把每个迁移热区绑定可观察行为与回归证据，再按人工确认的业务影响排序，可降低正则热点驱动无价值重构。用有测试/无测试及高命中低业务影响项目比较返工率、回滚次数和工时；不以命中减少等同业务改善。

核静态预检与真实测试差异、报告覆盖、取消传播、误报样例及阶段回滚；本轮未调用Python工具或迁移。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：18bf14d0e95c79ea44bdb59831cb3848b59f003a1803c0259ec32ca1e9a535ea。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 593 | — | — | 7457 |
| .ts | source | 2 | 217 | 160 | 45 | — |
| .js | example | 4 | 248 | 207 | 21 | — |
| .ts | test | 1 | 274 | 230 | 30 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-modernize-code/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
