# dsh-obsidian-board

> 将本地 Obsidian 笔记库接入 DSH 三栏问答面板，提供本地关键词检索和可点击引用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[072612e](https://github.com/2026heshao/dsh-obsidian-board/tree/072612e0245565cee12cbfd07a421f2029d35c4e)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) · [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)
<!-- END META -->

**使用建议**：已有结构清楚的Markdown笔记库可先用已知答案测试原词、同义改写和外部资料问题，逐条点引用核对；涉及敏感笔记时先确认所选模型通道允许发送检索片段。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

已确认本地检索与引用面板、按尝试隔离流式输出的设计；未复现性能和回答正确率。检索本地不代表发送给模型的片段不出本机，未来证据覆盖提示假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：适合已有Markdown笔记库、希望边问边查出处的知识工作者；合格答案应引用实际支持结论的笔记，而不是仅能打开一个文件。

采用建议：已有结构清楚的Markdown笔记库可先用已知答案测试原词、同义改写和外部资料问题，逐条点引用核对；涉及敏感笔记时先确认所选模型通道允许发送检索片段。

参照Obsidian原生词面搜索加手工复制，以及常见embedding RAG；本项选择无需向量服务的轻部署方案，牺牲部分语义召回，未证明普遍优于embedding。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：Typert提供本地笔记检索、读原文与chatStart/Poll/Stop
- **后台**：BM25/CJK bigram索引和增量更新

**流程与依赖**

需要可访问的本地vault目录、DSH llm/loader/Typert和浏览器；索引不联网，但问答通过已配置模型发送上下文，隐私随模型渠道变化。笔记结构、别名质量、库规模及模型能力决定效果。

选择vault→扫描切块建索引→输入问题→检索及可选规划→模型生成→按300ms轮询取增量→点引用回看；停止通过AbortController，失败回退新attempt并重置输出，重启后历史需客户端存储兜底。

**效果与成本**

无需embedding服务减少一类配置与向量成本，但索引扫描占本地资源，问答与可选规划/模型回退消耗现有模型额度；迁移vault路径和复核引用需人工。未将作者秒级扫描声明转为实测单位成本。

三栏减少切换与复制的机制可见；检索排名、片段截断和模型归纳仍影响合格答案率，是否优于直接搜索要以同题引用支持率和人工纠错时间判断。

- **思考**：最影响价值的是引用能否覆盖真正支持结论的笔记。BM25更适合词面匹配，固定0.45收集语料降权能让自有笔记优先，却可能压低用户此刻正要找的外部材料。可点击[n]只证明可回看，不证明检索召回或引用蕴含关系；同义改写与外部资料问题是最强反例。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对在Obsidian关键词搜索后复制到聊天，插件把查找、回答和原文核对放在三栏；BM25和中文bigram是成熟方法，具体增量是笔记标题/标签/别名、收集语料降权以及attempt切换时重置输出偏移，减少来源库与模型回退造成的使用断点。不能将算法名称或作者万条笔记耗时认作本次实测。

相对在Obsidian关键词搜索后复制到聊天，插件把查找、回答和原文核对放在三栏；BM25和中文bigram是成熟方法，具体增量是笔记标题/标签/别名、收集语料降权以及attempt切换时重置输出偏移，减少来源库与模型回退造成的使用断点。不能将算法名称或作者万条笔记耗时认作本次实测。

vault.js 将并发构建笔记与提交索引分开，并压实旧chunk，值得用于增量索引。index.js 使用attempt重置正文/思考/usage和客户端偏移，防止回退拼接旧回答；移植需要客户端同代次协议。扫描失败跳过与关键词检索边界应可观察，不能把没搜到当库中不存在。

<a id="detail-section-5"></a>

### 主要限制

最影响价值的是引用能否覆盖真正支持结论的笔记。BM25更适合词面匹配，固定0.45收集语料降权能让自有笔记优先，却可能压低用户此刻正要找的外部材料。可点击[n]只证明可回看，不证明检索召回或引用蕴含关系；同义改写与外部资料问题是最强反例。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/vault.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读索引、扫描/增量更新和host问答/回退路径，未检验全部客户端交互、未运行万条库性能或真实模型；作者兼容声明未独立复现。
- 下一步：在固定库人工标注20个原词、同义改写和外部材料问题，对比普通BM25、当前加权及用户可选权重；记录topK召回、引用支持率、人工纠错时间和全部模型调用。选择权重若只增加操作而不改善外部资料题，则否定假设。

**分析版本**

- **仓库**：[2026heshao/dsh-obsidian-board](https://github.com/2026heshao/dsh-obsidian-board)
- **版本号**：0.2.4（[固定提交 072612e0](https://github.com/2026heshao/dsh-obsidian-board/tree/072612e0245565cee12cbfd07a421f2029d35c4e)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/vault.js](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/vault.js)
- [lib/index.js](https://github.com/2026heshao/dsh-obsidian-board/blob/072612e0245565cee12cbfd07a421f2029d35c4e/lib/index.js)

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：在答案旁显式显示检索来源构成与未覆盖主题，并允许按问题选择“自有经验/全部资料”权重。它从固定vendored降权和可回看引用推导，改变的是检索意图控制而非增加另一个模型；额外负担是解释权重和建立小型带标注问题集。

在固定库人工标注20个原词、同义改写和外部材料问题，对比普通BM25、当前加权及用户可选权重；记录topK召回、引用支持率、人工纠错时间和全部模型调用。选择权重若只增加操作而不改善外部资料题，则否定假设。

<a id="detail-section-9"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 1699 | — | — | 24131 |
| .mjs | source | 25 | 1519 | 1196 | 151 | — |
| .js | source | 4 | 4593 | 3590 | 880 | — |
| .mjs | test | 22 | 1782 | 1355 | 233 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2026heshao/dsh-obsidian-board/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
