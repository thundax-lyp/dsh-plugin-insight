# Skill 指令优化与三插件对照

验证日期：2026-10-27。旧版基线为 `db792e5fbcd0beca348a043b80a35978654bf83a`；新版为本次工作区修改。结论仅针对指令组织与这组三插件的研究输出，不是插件运行验收。

## 改动及目的

| 改动 | 解决的问题 | 保留的约束 |
| --- | --- | --- |
| INIT、INSIGHT 入口按模式、阶段、输入和完成判据组织 | 原入口把执行、字段和版式挤在长段落中，重点不易定位 | 显式调用、父子职责、固定版本、逐题验收和事务边界 |
| 拆出 ANALYSIS-INPUT 与页面重生成参考 | 普通核查过早加载字段细节，布局任务容易混入研究步骤 | 原字段白名单、装配语义、完整逐题正文及原研究只读 |
| 数据契约、输出标准增加任务导航 | 大文档缺少直接读取入口 | 既有字段、评分、排序和证据要求不变 |
| 机制方法强调实际调用到结果及关键失败分支 | 定义存在不等于真实接线，成功消息不等于任务办结 | 不扩成无关全仓审计，不将源码判断写成已运行故障 |
| Codex 评论修复入口改用中文并增加阶段路由 | 描述语言与仓库不一致，读取依据分散 | 原授权、反应、回复、提交和回读流程不变 |

未修改脚本、Schema、评分权重、模板、当前研究档案或生成页面。40项默认额度、72小时暂缓、同版本受阻跳过、下载断点恢复、双清单回读及清理条件仍保留。

## 指令体积

计量为文件 UTF-8 字节数，不能直接当模型 token 或账单。下表是完成反馈修订后的入口；行为对照使用的冻结 INSIGHT 版本为 8,914 字节，之后只追加分段读取提示与精确 Schema 定位。

| 入口 | 修改前 | 最终版 | 变化 |
| --- | ---: | ---: | ---: |
| dsh-plugin-init/SKILL.md | 27,315 | 13,898 | 减少49.1% |
| dsh-plugin-insight/SKILL.md | 20,109 | 9,155 | 减少54.5% |
| codex-comment-fix/SKILL.md | 5,462 | 6,056 | 增加10.9%，用于中文说明与阶段路由 |

两个研究入口合计从47,424降至23,053字节，减少51.4%。大部分细则仍通过参考文档保留，全部 Skill Markdown 的总体积仅小幅下降；这不是“全流程上下文减少51.4%”的结论。

## 对照设计

每个插件分别以旧版、新版独立启动一个无历史上下文的研究 Agent，共6次；继承相同模型与推理设置，不向执行者提供预期缺陷、旧报告或另一组结果。两组取得相同的四份机械材料，并可从同一只读 checkout 的精确提交补读源码；材料基准时间为 `2026-10-27T04:55:32Z`，不是执行时限。

| 插件 | 固定版本 | 覆盖的研究问题 |
| --- | --- | --- |
| [99galaxy/dsh-plugin-market](https://github.com/99galaxy/dsh-plugin-market/tree/52d44fba2b12453fa1b22a1453f9287fa3b33821) | 52d44fba2b12453fa1b22a1453f9287fa3b33821 | 目录、安装、profile、启用与失败恢复 |
| [shanliuling/dsh-image-gen](https://github.com/shanliuling/dsh-image-gen/tree/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a) | f5f83278ab420f2f0ef175fe2e1a027d64f3be2a | 生图、附件、工作区、画布与资产交付 |
| [omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon/tree/58fae98cd586d41e2ce9843c1593236936e0e9e5) | 58fae98cd586d41e2ce9843c1593236936e0e9e5 | 回合视图、上下文、写入、纠错及采用条件 |

各组交付 PLAN、逐题回答、ANALYSIS、REPORT 和 RUN。允许按组件复杂性自行决定题数与源码范围，不以字数、题数或发现数作为质量分。不运行目标代码、安装、联网、写共享状态或导入正式观察；无活跃 WORK，不执行完整装配和发布事务。

父 Agent 回读完整回答，并用实际固定 Git 内容核对关键结论。临时检查复用工程中的 `validateResearchQuestions`、`assembleRecommendation`、`assembleInnovationScores`，检查顶层字段、问题结构与九主题覆盖、引用文件及行范围、评分输入和源码级证据上限、完整回答是否留在报告。此检查范围不等于完整 `assemble:insight` 或 stage／apply 验收。

## 首次输入检查

以下保留初次交付结果，没有先修正旧版再比较。

| 插件 | 旧版题数 | 新版题数 | 旧版输入检查 | 新版输入检查 |
| --- | ---: | ---: | --- | --- |
| dsh-plugin-market | 8 | 7 | 通过 | 通过 |
| dsh-image-gen | 9 | 8 | 未通过：采用对象多写 score／evaluator，创新轴多写 score | 通过 |
| dsh-mnemon | 9 | 6 | 通过 | 通过 |

本组首次通过由2/3变为3/3。旧版生图分析误把输出档案字段写成装配输入；现有函数分别返回 `author recommendation decision, reason and four scored criteria explicitly` 和 `explicit innovation criteria, rationale and basis required: technical`。新版输入与现有白名单相符，没有改校验器来使其通过。

六份问题对象均通过九主题、固定源码位置及正文保留检查；源码级 evidence 分均未超过13。六份采用结论都是限定试用，四项分数均为15／13／13／10，未为对比制造分差。这只说明该样本的采用判断一致，不证明评分准确或真实效果相同。

## 研究内容的实际差异

| 插件 | 旧版已做到 | 新版观察到的变化 | 判断与限制 |
| --- | --- | --- | --- |
| dsh-plugin-market | 区分安装与生效，识别来源切换、组件匹配和超时终态未知 | 进一步指出库存刷新失败未传给列表说明，可能继续使用旧快照；同时跟踪构建跳过和来源回退 | 新增了具体可核查问题，原有限定试用判断未变；不是运行复现 |
| dsh-image-gen | 已区分附件、图库和文件，指出保存成功消息不能保证落盘 | 补查全局最近画布实例的选择方式，收窄到单人单画布试用；输入字段首次检查通过 | 增加了会改变试用前提的判断；不能据此认定跨用户泄漏或确定用户损失 |
| dsh-mnemon | 已说明固定 View、预算、纠错与模拟 Skill 回测限制 | 明确引用实际 assemblePrompt→begin、工具→Source→controller、权威 JSON 最后替换及回合释放；建议聚焦 Runtime／Documents | 主链证据更完整，但新版明确未覆盖全部 Provider 与 Skills，不能称全面优于旧版 |

关键核对依据：

- 市场列表在[刷新后继续读库存](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L628-L631)，没有在此处消费刷新返回状态；[helper 超时处理](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L209-L216)仅显示对子进程调用 kill，不能证明包管理副作用已回滚。
- 生图的[镜像设计与最近实例选择](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/canvas-state.ts#L96-L114)与[编辑入口取镜像](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/canvas-tools.ts#L140-L148)支持多画布引用风险的机制判断；宿主实例隔离及实际发生率未验证。[图库保存链](https://github.com/shanliuling/dsh-image-gen/blob/f5f83278ab420f2f0ef175fe2e1a027d64f3be2a/src/client/studio-view.tsx#L1055-L1088)则明确把工作区结果与图库写入分开。
- 记忆插件的[真实提示组装与释放调用](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/src/host/lifecycle.ts#L390-L416)及[Runtime 持久化顺序](https://github.com/omdsh-dev/dsh-mnemon/blob/58fae98cd586d41e2ce9843c1593236936e0e9e5/plugins/dsh-mnemon-source-runtime/src/controller.ts#L702-L716)支持状态链路解释，不能证明记忆事实或最终答案正确。

## 成本、反馈修订与证据限制

3份报告合计由226,357增至231,132字节，增加2.1%；生图报告扩大了源码范围并变长。因此没有证据表明输出更短或总 token 成本下降。计时起点记录不齐且部分未知，不报告执行速度提升。

新版仍有批量输出截断、猜错 Schema 文件名的只读错误。测试后追加了分段读取指引和真实 catalog／research-questions Schema 链接，并静态核对字段位置；这两处导航修订没有重新运行三插件行为对照。旧、新冻结指令及初次产物分开保留，不把后续补充记成首次测试已达到。

每个条件只有一次样本，未随机重复，父 Agent 不是盲评者；研究范围也由执行者自主选择。可以保留“入口明显缩短、本组输入返工减少、部分关键证据更完整”的观察，不能推出普遍准确率提升、错误率下降或产品需求成立。

完整 INIT 来源扫描、下载恢复、双清单写入及 Codex 评论 API 流程没有在本次测试中执行；只检查其文档约束、链接与现有仓库一致性。真实插件安装、宿主运行、费用、用户收益和假设实验均未执行。六份临时真实案例产物在工程外保存，未导入 catalog，不新增 testcase 或合成研究数据。

## 验证结果

- 三个 Skill 的 `quick_validate.py`：通过。
- 修改文档的本地链接与锚点：通过，排除代码中的示例占位链接；检查脚本为本次临时工具，未声明持续 CI 覆盖。
- `npm run check`：通过，当前档案与派生输出保持一致。
- `git diff --check`：通过。
- 行为验证阶段未提交、推送或修改 PR；交付操作另按用户授权执行。
