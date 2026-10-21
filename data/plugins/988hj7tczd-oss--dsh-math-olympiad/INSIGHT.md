# dsh-math-olympiad

> 提供竞赛数学求解、独立验证及信心/弃权输出的技能流程，可选编译PDF。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[b04fadf](https://github.com/988hj7tczd-oss/dsh-math-olympiad/tree/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-math-olympiad) · [![npm 30d 108](https://img.shields.io/static/v1?label=npm+30d&message=108&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-math-olympiad)
<!-- END META -->

**使用建议**：适合学习和初步证明检查。先确认验证者实际只收到证明与攻击清单，重要结论请独立复核；high不是形式化证明或正确率承诺。

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

- **用途**：适合希望把竞赛题求解与证明质疑分开的学习者；输出是证明、验证结论和有边界的信心。

- **建议**：未验证假设：将求解者/验证者输入和具体缺口保存为可审阅记录，并用已知真伪题评估high标签，可减少错而自信。对正确证明、隐含条件错误和无解题比较错误接受率、弃权率及额外模型费用；若高信心未改善，取消校准表述。

适合学习和初步证明检查。先确认验证者实际只收到证明与攻击清单，重要结论请独立复核；high不是形式化证明或正确率承诺。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代为人工互审、普通模型自检或形式化证明系统；本项目增强提示纪律，不提供形式化可靠性。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Skill**：dsh-math-olympiad竞赛数学求解与验证流程
- **后台**：mathOlympiadSkills路径服务及独立技能provider配置

**流程与依赖**

src/locator.ts仅提供技能路径服务；cordis.patch.yml以独立filesystem provider挂载SKILL。Skill要求模型先整理可公开检查的证明，再交新上下文subagent验证；shell脚本只探测TeX和编译PDF。

宿主技能注册表、dsh-skill-filesystem/base与subagent能力；可选TeX引擎。固定README说明开发依赖相邻dsh-src、源码安装prepare许可；实际发布包依赖以package为界。

加载Skill→模型求解并整理证明→新上下文验证攻击→有致命缺口最多两轮修正→证明/验证结论/信心或弃权→可选TeX渲染；本轮未执行此流程。

**效果与成本**

首次配置技能filesystem、可用subagent与可选TeX；模型验证和重解增加token/延迟，人工仍核关键证明。PDF只改善呈现，不提升正确性；源码分发构建还受宿主依赖版本约束。

流程有促使暴露缺口的可能性，无题集评测、独立引用或正确率提升证据。

- **思考**：high由模型验证器零缺口决定，并没有校准数据，故不能把标签称统计校准的正确概率。隔离与只传证明是Skill纪律，locator没有调度器 enforcing；smoke的stub传参结构不证明真实宿主不共享历史。用开放问题特化作红旗有启发价值，不能替代逐步证明检查。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：作者强调对抗验证与诚实弃权；本项贡献是将Pólya启发、具体失败模式、最多两轮修正和弃权写成可执行提示流程，另有可靠路径挂载。不是形式化证明器，也没有代码强制保证验证器隔离或验证结果正确；数学方法归公开参照，非本项目新定理。

作者强调对抗验证与诚实弃权；本项贡献是将Pólya启发、具体失败模式、最多两轮修正和弃权写成可执行提示流程，另有可靠路径挂载。不是形式化证明器，也没有代码强制保证验证器隔离或验证结果正确；数学方法归公开参照，非本项目新定理。

路径定位适配src/lib两种布局，独立provider关闭默认roots避免重复发现；数学验证是提示工作流，TeX脚本只负责展示。复用应保留状态与证据边界，不能用构建通过替代数学验收。

源码依据：[src/locator.ts](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/src/locator.ts)、[cordis.patch.yml](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/cordis.patch.yml)、[skills/dsh-math-olympiad/SKILL.md](https://github.com/988hj7tczd-oss/dsh-math-olympiad/blob/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0/skills/dsh-math-olympiad/SKILL.md)。

<a id="detail-section-5"></a>

### 主要限制

high由模型验证器零缺口决定，并没有校准数据，故不能把标签称统计校准的正确概率。隔离与只传证明是Skill纪律，locator没有调度器 enforcing；smoke的stub传参结构不证明真实宿主不共享历史。用开放问题特化作红旗有启发价值，不能替代逐步证明检查。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-math-olympiad](https://github.com/988hj7tczd-oss/dsh-math-olympiad)
- **版本号**：0.1.0（[固定提交 b04fadfe](https://github.com/988hj7tczd-oss/dsh-math-olympiad/tree/b04fadfeaf88f8f98ba09ab57e9379eb36f05ea0)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/locator.ts、cordis.patch.yml、skills/dsh-math-olympiad/SKILL.md、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定模型/宿主用真伪证明标注集核输入隔离、错误接受与弃权；另独立核TeX缺失回退，本轮未解题或编译。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：将求解者/验证者输入和具体缺口保存为可审阅记录，并用已知真伪题评估high标签，可减少错而自信。对正确证明、隐含条件错误和无解题比较错误接受率、弃权率及额外模型费用；若高信心未改善，取消校准表述。

固定模型/宿主用真伪证明标注集核输入隔离、错误接受与弃权；另独立核TeX缺失回退，本轮未解题或编译。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：3b650af79f90a8471d4d378daf89afcf451f42e39069f74edd0e7691783c26d1。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 545 | — | — | 6592 |
| .ts | source | 1 | 76 | 36 | 34 | — |
| .ts | test | 1 | 509 | 413 | 63 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-math-olympiad/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
