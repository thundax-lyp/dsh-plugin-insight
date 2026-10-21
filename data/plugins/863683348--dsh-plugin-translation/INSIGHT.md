# dsh-plugin-translation

> 为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[2238d4d](https://github.com/863683348/dsh-plugin-translation/tree/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) · [![npm 30d 1042](https://img.shields.io/static/v1?label=npm+30d&message=1%2C042&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)
<!-- END META -->

**使用建议**：适合技术文档翻译先检查数字与术语一致。先用正反译和否定样例验证规则，quality高分后仍人工核对意义；不要将词表自动积累当正确性保证。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：持续翻译技术材料的用户需要跨段术语与格式一致，合格交付须同时保留数字、术语和语义；模型承担翻译，插件辅助组织与检查。

- **建议**：由规则检查与语义缺口推导，可输出“可确定违规/需人工语义核对”两层证据而非单一质量总分，把否定、数量关系和实体角色标为复核点。未验证假设是降低高分误放行。构造规则均通过但意义反转的译对，若新流程仍不能降低漏检与复核成本则否定。

适合技术文档翻译先检查数字与术语一致。先用正反译和否定样例验证规则，quality高分后仍人工核对意义；不要将词表自动积累当正确性保证。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

单次提示翻译更省配置；独立CAT工具有成熟记忆流程。本插件将轻量规则接到Agent，但未做同条件质量排名。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：translate_kit提供分段、词表、一致性、风格与记忆操作。

**流程与依赖**

必要为DSH tools/fs和执行翻译的模型；效果依赖词表正确性、会话cwd与人工校译，读写仍依赖宿主FS策略。

分段与提候选术语，人工确认词表，模型逐段翻译，运行一致性/格式检查，复核后保存记忆与风格，再交付正文。

**效果与成本**

首次需建立可信术语表与风格；日常模型费用、规则误报与人工语义复核分开计算，记忆写入与修正增加维护成本；未有对照数据。

可使形式性缺陷更容易发现，持续词表可能减少反复输入；未实测翻译合格率或费用降低。

- **思考**：quality中的fidelity是否测到了忠实度？scoreQuality从60+40开始按数字、术语、长度、标点等扣分，不能检测主客体颠倒或否定丢失；源文含中文而译文出现连续英文会扣“未翻译”分，也可能误伤正常中译英。高分只表示规则少触发，不能作语义验收。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对模型单次直译，增量是将分段、术语约束和持久记忆纳入可重复流程，降低规则性漏项。不是新翻译模型，也未证明启发式分数与人类忠实度一致；真正贡献是检查与知识积累的组合。

相对模型单次直译，增量是将分段、术语约束和持久记忆纳入可重复流程，降低规则性漏项。不是新翻译模型，也未证明启发式分数与人类忠实度一致；真正贡献是检查与知识积累的组合。

纯逻辑和宿主FS接线分离便于复用。resolveFileTarget仅在cwd已知时containment检查，调用方必须提供可信工作区；数值评分是可解释规则，命名应避免给出超出规则的语义保证。 源码依据：[lib/translation.js](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/translation.js)、[lib/index.js](https://github.com/863683348/dsh-plugin-translation/blob/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854/lib/index.js)。

<a id="detail-section-5"></a>

### 主要限制

quality中的fidelity是否测到了忠实度？scoreQuality从60+40开始按数字、术语、长度、标点等扣分，不能检测主客体颠倒或否定丢失；源文含中文而译文出现连续英文会扣“未翻译”分，也可能误伤正常中译英。高分只表示规则少触发，不能作语义验收。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-plugin-translation](https://github.com/863683348/dsh-plugin-translation)
- **版本号**：0.3.2（[固定提交 2238d4d2](https://github.com/863683348/dsh-plugin-translation/tree/2238d4d2ff479ddd0ae81d3efbff8b3ee1526854)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/translation.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：固定材料对照直译与分段+词表流程，统计数字/术语错误、否定和角色错误、质量高分误放行及人工校译时间。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由规则检查与语义缺口推导，可输出“可确定违规/需人工语义核对”两层证据而非单一质量总分，把否定、数量关系和实体角色标为复核点。未验证假设是降低高分误放行。构造规则均通过但意义反转的译对，若新流程仍不能降低漏检与复核成本则否定。

固定材料对照直译与分段+词表流程，统计数字/术语错误、否定和角色错误、质量高分误放行及人工校译时间。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：192dc790b935c869b6ccd3f0e161bbf5087624f37cc14434cf038dad195e1186。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 616 | 523 | 56 | — |
| .md | source | 4 | 172 | — | — | 1590 |
| .mjs | test | 1 | 228 | 200 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-translation/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
