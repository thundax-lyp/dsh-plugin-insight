# dsh-LorebookMD

> 管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[4bc4110](https://github.com/609476965/dsh-LorebookMD/tree/4bc4110efbfb4888286b81aaf53191705dade9dd)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 705](https://img.shields.io/static/v1?label=npm+30d&message=705&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)
<!-- END META -->

**使用建议**：已有酒馆资料的写作者可先导入副本。检查占位符、世界书命中与激活预设，别直接把原平台效果视为DSH已复现。

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

替代是直接系统提示、Markdown设定文件或原SillyTavern；插件增加DSH入口但不保证原平台全量行为。

<a id="detail-section-3"></a>

### 能力、依赖与流程

src/index.ts以动态systemPrompt.section注入激活预设，提供prompt_preset工具和API，监听JSON变化；tavern.ts解析PNG chara与JSON并按关键词匹配世界条目；PresetRepo隔离存储端口。

- **模型工具**：prompt_preset_list/use/off/save/delete及角色卡导入
- **Host 路由**：/prompt-manager/api预设管理
- **事件监听**：本地JSON热载与世界书触发

宿主tools/systemPrompt/webServer、Schemastery及DSH路径接口；预设和世界书保存本地JSON，外部编辑触发热载。

导入PNG/JSON→转换为预设和世界书→激活→装配提示→关键词触发条目→保存或切换；异常格式应保留原件再修。

<a id="detail-section-4"></a>

### 成本与效果

首次需整理角色卡、预设名与存储目录；持续成本是提示token、关键词误触发和格式迁移人工复核，模型现金按上下文和生成计费。

集中管理与热切换降低资料重复录入，但缺乏长篇一致性或作者工时的独立对照。

<a id="detail-section-5"></a>

### 工程亮点

PresetRepo使用注入式IO便于验证状态；tavern纯解析器与宿主分开，watch有防抖和生命周期清理。可借鉴格式转换层，兼容语义和来源权限仍需人工确认。

源码依据：[src/index.ts](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/index.ts)、[src/tavern.ts](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/tavern.ts)、[src/preset-repo.ts](https://github.com/609476965/dsh-LorebookMD/blob/4bc4110efbfb4888286b81aaf53191705dade9dd/src/preset-repo.ts)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合已有角色卡与世界设定、需要在DSH管理写作或角色扮演上下文的作者。

- **建议**：待验证假设：导入时输出逐字段转换损失清单并允许预览本轮命中世界条目，可减少作者排查角色偏差。用相同角色卡在两种运行时比较触发和占位符覆盖；若仍难解释输出偏差，不宣称兼容。

已有酒馆资料的写作者可先导入副本。检查占位符、世界书命中与激活预设，别直接把原平台效果视为DSH已复现。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：prompt_preset_list/use/off/save/delete及角色卡导入
- **Host 路由**：/prompt-manager/api预设管理
- **事件监听**：本地JSON热载与世界书触发

- **思考**：角色卡占位符被清理后能避免宿主unknown variable，却可能丢失原模板语义；关键词触发也不等价完整SillyTavern规则。外部资料被注入systemPrompt会影响模型行为，应把导入内容当用户选择的配置核对，不能因PNG格式就认为可信。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者主张集中预设管理；可确认增量是将SillyTavern资料格式转换、热切换预设与关键词世界书带到DSH。相对复制整份设定到系统提示，可减少重复整理；角色卡格式和世界书思想来自酒馆生态，未证明与原运行时语义等价。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[609476965/dsh-LorebookMD](https://github.com/609476965/dsh-LorebookMD)
- **版本号**：1.0.0（[固定提交 4bc4110e](https://github.com/609476965/dsh-LorebookMD/tree/4bc4110efbfb4888286b81aaf53191705dade9dd)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/tavern.ts、src/preset-repo.ts、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：验证PNG边界、重复预设、无效JSON、占位符损失、选择性关键词及重启持久化；本轮没有运行角色任务。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：导入时输出逐字段转换损失清单并允许预览本轮命中世界条目，可减少作者排查角色偏差。用相同角色卡在两种运行时比较触发和占位符覆盖；若仍难解释输出偏差，不宣称兼容。

验证PNG边界、重复预设、无效JSON、占位符损失、选择性关键词及重启持久化；本轮没有运行角色任务。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：5730c17b5ef47753efacc9de4664ec2275c94edc7b1532e0d180b328a96cd643。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 174 | 139 | 25 | — |
| .js | source | 1 | 360 | 338 | 54 | — |
| .md | source | 1 | 74 | — | — | 1006 |
| .ts | source | 6 | 1653 | 1353 | 178 | — |
| .tsx | source | 1 | 196 | 172 | 9 | — |
| .ts | test | 5 | 1216 | 1018 | 74 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/609476965/dsh-LorebookMD/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
