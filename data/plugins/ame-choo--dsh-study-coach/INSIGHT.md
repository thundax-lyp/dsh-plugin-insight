# dsh-study-coach

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[7c2c2d3](https://github.com/Ame-Choo/dsh-study-coach/tree/7c2c2d3f71cb49508e567674882eddb1b3a689ba)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/Ame-Choo/dsh-study-coach) [![npm 30d 353](https://img.shields.io/static/v1?label=npm+30d&message=353&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-study-coach) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-study-coach)
<!-- END META -->

> **实现功能**：用学习教练预设、知识图谱和证据账本组织个人学习，面板与专属工具共享学习档案。

> **核心亮点**：把“教练说学会了”拆成可追溯证据、受限阶段提升与可撤销重算，并将学习工具限定在教练预设，避免污染所有会话。真正变化是学习进展的记录与修订责任，非工具数量或人格提示本身。

> **风险与缺陷**：quiz/photo标签怎样证明真实做题且做对？study_record直接接收调用方kind、note与stage；闸门确认类型和累计数量，不独立检查题目难度、重复提交、答案正确性或照片内容。证据ID存在能约束引用悬空，却不能证明掌握度；文件级临时写rename也不构成多个档案间的原子事务。

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

> **用途**：需要长期追踪目标、材料版本、错题与复习的个人学习者；交付是可回看的学习证据和阶段判断，不能把教练给的档位当外部考试认证。

普通聊天辅导加笔记/间隔复习工具；本项统一证据与阶段账本，教学正确性仍须外部参照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：学习教练材料、证据与阶段约定，经预设customSkillDirs加载。
- **Agent/Preset**：study-coach学习预设及其专属工具模块。
- **模型工具**：预设作用域21个study工具管理学习档案和证据。
- **Host 路由**：/study面板与档案接口。
- **界面**：目标、图谱、掌握度、错题等学习面板。
- **后台**：本地独立面板服务器及会话事件桥。

**流程与依赖**

Host提供文件档案、/study面板与会话桥；预设作用域加载21个study工具和学习Skill。掌握度以带类型的证据记录积累，gateStage限制一次升一档并按quiz/photo计数；撤销证据后可重新推导阶段，学生事实引用实际证据ID。

DSH webServer/tools、可选agentPresets/sessionController，浏览器与可写本地学习目录；教学模型和教材来源另由用户选择。

建目标与材料→起草/确认知识图→学习和作答→工具记录证据→闸门推进阶段→错题/复习→必要时撤销并重算；面板和会话共享档案。

DSH插件包提供学习预设及/study；预设注册依赖agentPresets服务，工具经预设模块加载；独立本地面板服务器用于浏览器入口。

**效果与成本**

现金取决于学习会话所用模型，未见固定额外模型价格；人工要整理教材授权/版本、核验作答和维护档案；本地文件与面板也需备份，无学习增益测量。

让目标、材料、进展和错题形成可追溯关系，减少遗忘上下文；材料事实和学生表现仍需可信输入。

> **思考**：quiz/photo标签怎样证明真实做题且做对？study_record直接接收调用方kind、note与stage；闸门确认类型和累计数量，不独立检查题目难度、重复提交、答案正确性或照片内容。证据ID存在能约束引用悬空，却不能证明掌握度；文件级临时写rename也不构成多个档案间的原子事务。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把“教练说学会了”拆成可追溯证据、受限阶段提升与可撤销重算，并将学习工具限定在教练预设，避免污染所有会话。真正变化是学习进展的记录与修订责任，非工具数量或人格提示本身。

把“教练说学会了”拆成可追溯证据、受限阶段提升与可撤销重算，并将学习工具限定在教练预设，避免污染所有会话。真正变化是学习进展的记录与修订责任，非工具数量或人格提示本身。

预设内注册工具避免全局目录扩张；证据撤销保留历史且重算状态，原子替换单个JSON，独立面板限回环地址。Skill中的证据/材料边界有助协作，但提示约定不等同硬校验。

固定源码依据：[index.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/index.js)、[lib/preset.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/preset.js)、[lib/preset-tools.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/preset-tools.js)、[lib/tools.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/tools.js)、[lib/map.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/map.js)、[lib/store.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/store.js)、[lib/bridge.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/bridge.js)、[lib/panel-server.js](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/lib/panel-server.js)、[skills/study-coach/SKILL.md](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/skills/study-coach/SKILL.md)、[package.json](https://github.com/Ame-Choo/dsh-study-coach/blob/7c2c2d3f71cb49508e567674882eddb1b3a689ba/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

quiz/photo标签怎样证明真实做题且做对？study_record直接接收调用方kind、note与stage；闸门确认类型和累计数量，不独立检查题目难度、重复提交、答案正确性或照片内容。证据ID存在能约束引用悬空，却不能证明掌握度；文件级临时写rename也不构成多个档案间的原子事务。

<a id="detail-section-6"></a>

### 1.5 使用建议

有长期证据整理需求时可评估；先把档位用于复习安排，升学或资格判断仍需独立测评，不能用计数代替正确性核验。

核查状态：预设隔离、证据计数闸门和档案读写源码可确认；实际教学效果、证据真实性与宿主端到端交互未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.0；版本日期：2026-10-14（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[7c2c2d3f](https://github.com/Ame-Choo/dsh-study-coach/tree/7c2c2d3f71cb49508e567674882eddb1b3a689ba)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根入口、预设与专属工具注册、掌握度闸门、文件存储、会话桥和学习Skill的重要路径；未逐一验收全部面板页面或21工具运行，不执行学习会话。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

把“已提交作业”“已核验作答”“迁移题通过”分开，升档只消费可去重的核验证据，可能使阶段更接近真实掌握。以重复照片、自述伪装quiz、训练题通过但迁移题失败的固定案例盲评；若高档位仍不能预测独立迁移题表现，就否定该阶段设计的有效性。

未执行；拟逐项检查重复/伪标签证据能否升档、撤销能否重算及独立迁移题表现，另测缺预设服务与会话桥失败时降级。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 3637 | — | — | 81434 |
| .js | source | 39 | 18650 | 14578 | 2893 | — |
| .mjs | source | 5 | 404 | 284 | 90 | — |
| .js | test | 46 | 12456 | 10023 | 1143 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Ame-Choo/dsh-study-coach/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
