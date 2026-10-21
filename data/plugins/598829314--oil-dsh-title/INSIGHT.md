# oil-dsh-title

> 根据近期用户消息生成和维护带类别标识的会话标题。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f384454](https://github.com/598829314/oil-dsh-title/tree/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title)
<!-- END META -->

**使用建议**：会话多时可在非敏感任务先检查标题质量。注意标题是模型归纳，敏感信息不要只依赖提示中的禁止规则。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代为手工命名或首条消息截断；插件提升自动组织程度，同时增加模型调用和误命名。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js读取最近五条真实user消息及最多16个冲突标题，以会话模型调用标题生成；core.js清洗控制字符、拼接流文本并校验emoji、分隔符及长度。

- **事件监听**：会话标题更新
- **后台**：近期用户消息归纳与标题校验

宿主sessionTitle、llm、sessions及可用会话模型；标题生成会发送近期文本和部分其他会话标题。

会话事件触发→收集近期真实用户文本→标题模型生成JSON→格式校验→keep或改名；异常跳过并记录debug。

<a id="detail-section-4"></a>

### 成本与效果

自动标题有额外模型调用，maxTokens256、超时60秒但输入仍计费；人工需纠正误命名，迁移依赖宿主sessionTitle接口。

改善侧栏查找具有明确场景，但无用户检索速度或误标题率数据。

<a id="detail-section-5"></a>

### 工程亮点

core纯函数隔离清洗、JSON提取和流组装；工具调用块直接拒绝，超时AbortController与inFlight防重复。可复用标题格式校验，但脱敏与语义检查需要另外实现。

源码依据：[lib/index.js](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js)、[lib/core.js](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/core.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合并行会话较多、需要在侧栏快速识别任务主线的用户。

- **建议**：待验证假设：用用户确认的稳定任务锚点与近期消息共同输入，可减少收尾动作劫持标题。对长任务插入提交/截图等短指令，比较标题漂移和查找时间；若锚点阻止真实任务切换则需撤回。

会话多时可在非敏感任务先检查标题质量。注意标题是模型归纳，敏感信息不要只依赖提示中的禁止规则。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **事件监听**：会话标题更新
- **后台**：近期用户消息归纳与标题校验

- **思考**：本地格式校验不验证标题忠实于主线，最近五条每条600字符及16个冲突标题可能遗漏长期任务和重复；提示禁止邮箱电话等，而validateTitle只显式检查部分字符串，不能当完整脱敏器。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者提供会话标题编辑器；增量是将持续任务主线提示、keep/rename结构及本地格式校验接入sessionTitle，优于只截取首句。分类emoji和对象｜目标增加可扫读性，语义准确性仍来自所选模型。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[598829314/oil-dsh-title](https://github.com/598829314/oil-dsh-title)
- **版本号**：0.1.1（[固定提交 f384454d](https://github.com/598829314/oil-dsh-title/tree/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/core.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：用多语、长期主线、敏感文本、冲突超过16项和异常流验证标题保持与泄露边界；本轮未运行。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：用用户确认的稳定任务锚点与近期消息共同输入，可减少收尾动作劫持标题。对长任务插入提交/截图等短指令，比较标题漂移和查找时间；若锚点阻止真实任务切换则需撤回。

用多语、长期主线、敏感文本、冲突超过16项和异常流验证标题保持与泄露边界；本轮未运行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f9320869393b4e86ca275951442f1d4280bac1ba18d1cac2f29112b64899f2dd。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 714 | — | — | 15962 |
| .js | source | 2 | 305 | 281 | 1 | — |
| .mjs | test | 2 | 90 | 80 | 1 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title/issues?q=is%3Aissue+created%3A2026-09-21T03%3A09%3A44.994Z..2026-10-21T03%3A09%3A44.994Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T03%3A09%3A44.994Z..2026-10-21T03%3A09%3A44.994Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
