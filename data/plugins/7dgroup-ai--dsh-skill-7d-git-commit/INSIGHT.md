# dsh-skill-7d-git-commit

> 为DSH注册7DGroup提交规范Skill，在生成提交信息前引导校验中文标签与格式。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[557e05f](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/tree/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)
<!-- END META -->

**使用建议**：仅对采用此中文提交规范的团队有直接价值。先核对服务端实际warn/reject与豁免规则，再用边界消息验证；需要硬门禁时保留确定性hook。

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

- **用途**：采用7DGroup提交规范的开发团队需要在push前减少提交信息返工；合格结果是消息符合实际服务端规则并准确描述变更。

- **建议**：由提示与服务端双份规范推导，可从同一机器可读规则生成Skill说明和本地/服务端校验器，消息候选先通过确定性检查再由模型解释修正。未验证假设是降低规则漂移和被拒push，不自动决定提交内容。用字符边界、豁免与多行案例对照客户端/服务端结果，若不一致率不降则否定。

仅对采用此中文提交规范的团队有直接价值。先核对服务端实际warn/reject与豁免规则，再用边界消息验证；需要硬门禁时保留确定性hook。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

直接写commit-msg hook可严格检查格式且无需模型；Skill增加规则解释与生成便利，适合与hook配合。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Skill**：注册7d-git-commit并按需提供提交规范。

**流程与依赖**

依赖DSH skills与invariants；效果依赖模型遵循指令和团队实际规则一致。GitLab hook属于单独部署责任。

模型读取变更并选择标签，按Skill检查后形成消息；用户或Agent提交，push时由实际服务端hook再判定，错误需修改消息或解释豁免。

**效果与成本**

首次对齐团队实际规则和hook模式；日常消息检查与修正可增加token/人工，升级要同步两端规则。没有拒绝push率与工时统计。

可减少遗忘格式的返工，但不证明提交内容准确或审计质量改善。对不同规范团队迁移成本可能超过收益。

- **思考**：README所谓client-side guard是否严格拦截git commit？实际src/invariant.ts只检查Provider可见，格式检查由模型遵循Skill完成；服务端hook文档又区分warn与reject并允许skip-check。因此提示前移有价值，但不能把它当不可绕过的策略执行。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对人工查规范文档，增量是将组织规范放到生成提交信息的工作流中，并通过invariant暴露本地同名Skill遮蔽。业务上把规则提醒前移，但并未在工具执行前提供确定性消息校验器。

相对人工查规范文档，增量是将组织规范放到生成提交信息的工作流中，并通过invariant暴露本地同名Skill遮蔽。业务上把规则提醒前移，但并未在工具执行前提供确定性消息校验器。

Skill资源和provider接线简单，invariant针对shadowing给出具体来源诊断可借鉴。语义规范与执行约束分层清楚才可复用，不能以启动不变量替代消息校验。 源码依据：[src/index.ts](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/index.ts)、[src/invariant.ts](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/invariant.ts)、[assets/7d-git-commit/SKILL.md](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/assets/7d-git-commit/SKILL.md)、[assets/7d-git-commit/references/git-commit-message.md](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/assets/7d-git-commit/references/git-commit-message.md)。

<a id="detail-section-5"></a>

### 主要限制

README所谓client-side guard是否严格拦截git commit？实际src/invariant.ts只检查Provider可见，格式检查由模型遵循Skill完成；服务端hook文档又区分warn与reject并允许skip-check。因此提示前移有价值，但不能把它当不可绕过的策略执行。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[7dgroup-ai/dsh-skill-7d-git-commit](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)
- **版本号**：0.1.0-rc.3（[固定提交 557e05f5](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/tree/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/invariant.ts、assets/7d-git-commit/SKILL.md、assets/7d-git-commit/references/git-commit-message.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：固定规则集比较人工提示与Skill的首次合规率、语义准确性、被拒push次数；特别核查50/70字符、Merge与skip-check边界。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由提示与服务端双份规范推导，可从同一机器可读规则生成Skill说明和本地/服务端校验器，消息候选先通过确定性检查再由模型解释修正。未验证假设是降低规则漂移和被拒push，不自动决定提交内容。用字符边界、豁免与多行案例对照客户端/服务端结果，若不一致率不降则否定。

固定规则集比较人工提示与Skill的首次合规率、语义准确性、被拒push次数；特别核查50/70字符、Merge与skip-check边界。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：50a5b6489d5b1da9048733b9826e71042932df2af729138554816bccd078ed67。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1282 | — | — | 11820 |
| .ts | source | 3 | 142 | 78 | 51 | — |
| .ts | test | 1 | 36 | 32 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
