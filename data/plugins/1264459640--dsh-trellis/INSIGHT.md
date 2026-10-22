# dsh-trellis

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b6b1d52](https://github.com/1264459640/dsh-trellis/tree/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,538](https://img.shields.io/static/v1?label=npm+30d&message=1%2C538&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)
<!-- END META -->

> **实现功能**：在 DSH 用阶段、任务步骤和产物组织开发，提供看板与可选规划保护。

> **核心亮点**：借鉴Trellis阶段思想，把任务状态、阶段产物与会话绑定集中到DSH；相较散落TODO，完结前统一检查步骤与Git，并给规划期保留受限文档写口。真正增量是可读写的工作流状态和宿主集成；Git及沙箱能力归上游，状态完成不等于业务验收。

> **风险与缺陷**：人工门禁是否可信？applyStepUpdate仍接受调用方verifiedBy=human，没有独立批准事件证据；规划保护是工具名denylist，bash/pwsh和其他插件工具保留，不能构成全面只读。modified_files由调用方声明可放行清单外修改；产物白名单控制写入路径却不证明内容已审，git status超时或异常还会以warning放行。因此三个门槛约束记录格式，未证明真实批准/变更全集/结果正确。

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

> **用途**：面向多阶段特性、修复与重构任务，交付方案产物、实现记录和步骤验收状态；简单修改可继续用Git/CI与短计划。

人工计划加Git/CI无需本插件；本项把状态与上下文集中，适合长任务，但不会取代CI、审查和权限控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：状态、任务创建/更新/跳过/归档、产物更新及UI设置工具。
- **Host 路由**：Trellis状态/看板/会话绑定API，含浏览器同源信任检查。
- **事件监听**：system-prompt/assemble与agent/pre-step注入阶段上下文和工具裁剪。
- **界面**：Web任务状态与看板；具体静态交互未运行。

**流程与依赖**

入口在项目allowlist内解析.trellis，注册任务创建/更新/归档/跳过、状态及产物工具；task.json保存步骤，阶段与status合并后验证一致性。规划期裁剪指定工具但保留产物工具，使方案可写；Web路由提供状态、看板和绑定，提示装配按当前阶段注入上下文。

DSH tools/system-prompt、dshFs/sandboxPolicy、sessions和可选Web；本地Git及.trellis目录。

解析项目→选择/创建任务→写规划文档→推进阶段→更新步骤及验证字段→完结/归档检查；看板推进将意图交给Agent，具体操作仍经模型工具。

DSH Cordis bundle/client与peer依赖见固定package，allowlist主动启用；自动补缺Skill会写本地文件，需维护升级归属。

**效果与成本**

现金随宿主模型与验证任务；人工是配置allowlist、建立方案/步骤、批准及复核记录，自动补缺Skill与任务迁移另有维护成本，暂无同条件工时/返工率数据。

减少任务和产物散落、促进交接；前提是团队真实维护步骤并核验产物，不能把完成标记或Git干净当质量结论。

> **思考**：人工门禁是否可信？applyStepUpdate仍接受调用方verifiedBy=human，没有独立批准事件证据；规划保护是工具名denylist，bash/pwsh和其他插件工具保留，不能构成全面只读。modified_files由调用方声明可放行清单外修改；产物白名单控制写入路径却不证明内容已审，git status超时或异常还会以warning放行。因此三个门槛约束记录格式，未证明真实批准/变更全集/结果正确。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：借鉴Trellis阶段思想，把任务状态、阶段产物与会话绑定集中到DSH；相较散落TODO，完结前统一检查步骤与Git，并给规划期保留受限文档写口。真正增量是可读写的工作流状态和宿主集成；Git及沙箱能力归上游，状态完成不等于业务验收。

借鉴Trellis阶段思想，把任务状态、阶段产物与会话绑定集中到DSH；相较散落TODO，完结前统一检查步骤与Git，并给规划期保留受限文档写口。真正增量是可读写的工作流状态和宿主集成；Git及沙箱能力归上游，状态完成不等于业务验收。

task更新按合并状态验证规划阶段不能标in_progress；更新数据不再顺带改会话绑定，避免过期更新覆盖新绑定。artifact只允许任务内预定Markdown名且经dshFs/sandbox写入；trust.js明确仿上游同源规则并非认证层。

固定源码依据：[lib/index.js](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/lib/index.js)、[lib/task.js](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/lib/task.js)、[lib/readonly.js](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/lib/readonly.js)、[lib/artifact.js](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/lib/artifact.js)、[lib/git.js](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/lib/git.js)、[lib/trust.js](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/lib/trust.js)、[package.json](https://github.com/1264459640/dsh-trellis/blob/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

人工门禁是否可信？applyStepUpdate仍接受调用方verifiedBy=human，没有独立批准事件证据；规划保护是工具名denylist，bash/pwsh和其他插件工具保留，不能构成全面只读。modified_files由调用方声明可放行清单外修改；产物白名单控制写入路径却不证明内容已审，git status超时或异常还会以warning放行。因此三个门槛约束记录格式，未证明真实批准/变更全集/结果正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有阶段化工程习惯的项目可列为任务组织候选；如需不可伪造的人类签署或强制只读，当前机制不足以单独承担。

核查状态：任务状态与产物写入机制源码支持；人工验收真实性、全面只读和协作收益未获运行验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.4.1；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[b6b1d526](https://github.com/1264459640/dsh-trellis/tree/b6b1d5260d3d41a5d9cc2e703ad7cae0e6680f6f)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件入口、任务持久化、产物白名单、规划过滤、Git检查、Web信任规则及看板接线；未审计全部文件，未运行宿主；不将状态字段视为独立验收。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

以宿主批准事件ID绑定方案摘要、步骤与提交版本，再核对实际Git变更全集，可能把自报验收转成可追溯验收。以伪造human、批准后改方案、遗漏修改文件的反例验证全部被拒且合法流程通过；若仍可直接改JSON绕过，则需要明确其仅为协作约束而非安全边界。

尚未执行最小验证：用伪造人工字段、shell写入和漏报文件核对门槛边界，再以并发绑定/过期更新检查持久化一致性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 138 | 8731 | — | — | 139514 |
| .md | test | 2 | 293 | — | — | 5524 |
| .mjs | source | 3 | 728 | 571 | 106 | — |
| .js | source | 15 | 8011 | 6060 | 1601 | — |
| .js | test | 13 | 3427 | 2788 | 325 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+created%3A2026-09-21T07%3A58%3A49.419Z..2026-10-21T07%3A58%3A49.419Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T07%3A58%3A49.419Z..2026-10-21T07%3A58%3A49.419Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
