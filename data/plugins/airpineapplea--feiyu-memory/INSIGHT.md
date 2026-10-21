# feiyu-memory

> 以分层日记、印象与检索记忆延续 DSH 对话中的角色体验。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[37a81b9](https://github.com/AirPineApplea/feiyu-memory/tree/37a81b92947b10d7376ed764d8ff6392e8969e93)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)
<!-- END META -->

**使用建议**：仅面向愿意审阅记忆的小型娱乐对话；私密内容、工作事实和多用户隔离场景不依赖其正则保护与共享日记。

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

- **用途**：娱乐陪伴对话用户希望新会话仍延续往事和称呼；交付是可查的日记记忆，不能当保管隐私的档案或工作事实真相。

- **建议**：为记忆附可追溯原句/会话来源与可撤回确认，并按用途分区召回，可能降低错误印象反复强化和跨任务泄漏。以用户纠正旧事实、同主题不同会话和未命中格式的秘密样例比较污染率/误召回与人工负担；若更正后旧印象仍被注入，应否定保真改进。

仅面向愿意审阅记忆的小型娱乐对话；私密内容、工作事实和多用户隔离场景不依赖其正则保护与共享日记。

核查状态：门控、清洗、固化和召回路径源码支持；记忆保真、隐私覆盖与人格连续体验未实测。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

人工日记、简单摘要prompt或宿主记忆；本项为陪伴体验组织选择/遗忘，不提供权威知识库。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：feiyu_note向后续会话留条记忆。
- **事件监听**：会话/Agent生命周期与turn-stopping触发固化及prompt记忆注入。
- **后台**：串行固化与本地分层档案维护。
- **Host 路由**：日记/配置/导入导出等本地UI桥。

**流程与依赖**

会话事件收集近期文本，turn-stopping本地gate决定是否入队；串行后台用宿主默认provider/模型生成日记和印象。发送前正则scrub，结构合并再落本地目录；新轮prompt按预算组合persona、最近记忆和BM25-lite相关日记。

DSH llm/defaultModel、agents/sessions/systemPrompt和可写目录；默认provider可能远程，配置模型需与provider兼容。

对话→本地gate→清洗近期12条→模型结构输出→合并日记/关系→写盘→新轮按预算召回；关闭/删除数据才能管理遗忘，需核是否备份残留。

源码ESM双面bundle、可选Schemastery投影；数据默认~/.dsh/feiyu-diary，换插件包不等于清理记忆目录。

**效果与成本**

现金为固化模型和每轮记忆prompt，预算不是无token；人工需删改误记、配置persona与隐私规则、备份/迁移记忆。零运行依赖不代表零联网或零维护。

控制上下文长度并保留可读经历；无对照证明连续感、记忆准确或隐私泄漏率。

- **思考**：“全本地/密钥硬拦”是否足以保护对话？consolidate经ctx.llm选择默认provider，若是远程API仍会发送正则清洗后的文本、近期日记和关系结构；规则只能覆盖已列密钥/格式。各会话共享同一archive目录，相关性召回不是项目/用户访问隔离；模型总结还可能把误解固化成后续“记忆”。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相较把全部历史塞入prompt，用本地启发式筛选、结构化固化和有限预算召回组织“经历”，并让手写人格/日记在持久化前参与合并。增量是陪伴记忆的取舍与维护机制；默认模型能力、BM25与摘要方法为已有技术，不能据此宣称真实人格连续。

相较把全部历史塞入prompt，用本地启发式筛选、结构化固化和有限预算召回组织“经历”，并让手写人格/日记在持久化前参与合并。增量是陪伴记忆的取舍与维护机制；默认模型能力、BM25与摘要方法为已有技术，不能据此宣称真实人格连续。

writeChain串行并先合并磁盘手改再写，文件权限0600、按轮缓存减少prompt重算；正则预清洗优于原文直接送模型，但并非全面脱敏证明，持久化错误日志不等于可确认落盘。

固定源码依据：[src/host/index.mjs](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/host/index.mjs)、[src/core/privacy.mjs](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/privacy.mjs)、[src/core/config.mjs](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/config.mjs)、[src/core/recall.mjs](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/recall.mjs)、[src/core/archive.mjs](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/src/core/archive.mjs)、[package.json](https://github.com/AirPineApplea/feiyu-memory/blob/37a81b92947b10d7376ed764d8ff6392e8969e93/package.json)。

<a id="detail-section-5"></a>

### 主要限制

“全本地/密钥硬拦”是否足以保护对话？consolidate经ctx.llm选择默认provider，若是远程API仍会发送正则清洗后的文本、近期日记和关系结构；规则只能覆盖已列密钥/格式。各会话共享同一archive目录，相关性召回不是项目/用户访问隔离；模型总结还可能把误解固化成后续“记忆”。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.2.0；版本日期：2026-10-19（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[37a81b92](https://github.com/AirPineApplea/feiyu-memory/tree/37a81b92947b10d7376ed764d8ff6392e8969e93)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host事件/模型固化/持久化，privacy/config/recall/archive及作者边界；未核全部归档/导出工具，不执行模型或读取用户真对话。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

为记忆附可追溯原句/会话来源与可撤回确认，并按用途分区召回，可能降低错误印象反复强化和跨任务泄漏。以用户纠正旧事实、同主题不同会话和未命中格式的秘密样例比较污染率/误召回与人工负担；若更正后旧印象仍被注入，应否定保真改进。

未运行；固定合成对话可测更正传播、跨会话误召回、隐私漏检和固化调用总量，须区分自评与独立标注。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 2596 | — | — | 30617 |
| .js | source | 1 | 449 | 350 | 66 | — |
| .mjs | source | 22 | 6234 | 3716 | 2005 | — |
| .mjs | test | 11 | 3725 | 3044 | 297 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
