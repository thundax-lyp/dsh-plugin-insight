# dsh-engineering-workflow

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[3e251eb](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/tree/3e251eb78002625bcc238a42d9926d87c3a38bfe)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/82c86b8z86-stack/dsh-engineering-workflow)
<!-- END META -->

> **实现功能**：为 DSH 安装工程工作流预设及六个 Skill，覆盖需求、计划、TDD、子代理和验证。

> **核心亮点**：相对每次手贴工程提示，贡献是将superpowers方法改写为DSH原生工具映射，随预设分发并同步六个Skill。README明确承认方法来自obra/superpowers、工具组合来自DSH cordis、同步模式来自dsh-liangshen；增量是DSH五阶段路由与打包协作，非全新开发方法。

> **风险与缺陷**：“五阶段硬门禁”由什么强制？host只同步与公告，不监控测试先后或批准证据；Skill纪律依赖模型遵循，plan模式的宿主门禁只覆盖相应入口。syncOnePreset在源不同或有多余文件时prune/copy，会覆盖同名预设里的用户定制并删额外文件，自动更新不是无损合并。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、流程与依赖](#detail-section-3)
  - [1.3 效果、成本与限制](#detail-section-4)
  - [1.4 核心贡献与工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

希望在新开发会话采用统一工程纪律的团队，选择预设并按阶段Skill组织任务，交付设计、计划、测试和核验记录。

参照superpowers方法、DSH cordis预设及dsh-liangshen同步模式；不对上游当前版本或项目效果作测量比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

lib/index.js启动时逐字节同步presets到DSH_HOME/.agent-presets并清理同名目录多余文件，注册工作流公告；agent.cordis组合宿主工具与filesystem skills，方法规则保存在六个Skill。

- **Skill**：总纲及需求/计划/TDD/子代理/验证六个Skill。
- **Agent/Preset**：engineering-workflow工程预设与宿主工具组合。
- **后台**：预设字节同步和工作流公告。

DSH preset发现、systemPrompt、skills与预设内各工具（shell/plan/subagent/workflow等）；工具名和批准行为版本敏感。

host启动同步→新会话选工程预设→总纲路由→需求/计划批准→TDD/子任务→核验与分支收尾；Skill规则不自动生成真实验证证据。

host bundle无client，自同步同名preset；只有新会话用户选择才采用，已有/默认预设不自动切换；依赖宿主工具与schemastery。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

减少重复编写方法和阶段交接遗漏；不能由安装成功推导测试质量、代码可靠性或交付提速。

首次检查preset版本和工具可用性，迁移本地定制；持续承担多阶段批准、TDD、子代理审查与重新验证，模型调用和人工时间未测。

“五阶段硬门禁”由什么强制？host只同步与公告，不监控测试先后或批准证据；Skill纪律依赖模型遵循，plan模式的宿主门禁只覆盖相应入口。syncOnePreset在源不同或有多余文件时prune/copy，会覆盖同名预设里的用户定制并删额外文件，自动更新不是无损合并。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对每次手贴工程提示，贡献是将superpowers方法改写为DSH原生工具映射，随预设分发并同步六个Skill。README明确承认方法来自obra/superpowers、工具组合来自DSH cordis、同步模式来自dsh-liangshen；增量是DSH五阶段路由与打包协作，非全新开发方法。

字节比较使同步可核对、preset自带skills路径与方法来源归属清楚；prune镜像同步有明确所有权代价，应为用户改动提供overlay/冲突处理。

源码依据：[lib/index.js](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/lib/index.js)、[presets/engineering-workflow/agent.cordis.yml](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/agent.cordis.yml)、[presets/engineering-workflow/skills/engineering-workflow/SKILL.md](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/engineering-workflow/SKILL.md)、[presets/engineering-workflow/skills/workflow-tdd/SKILL.md](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-tdd/SKILL.md)、[presets/engineering-workflow/skills/workflow-verification/SKILL.md](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/skills/workflow-verification/SKILL.md)、[presets/engineering-workflow/NOTICE](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/presets/engineering-workflow/NOTICE)、[package.json](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/blob/3e251eb78002625bcc238a42d9926d87c3a38bfe/package.json)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：希望在新开发会话采用统一工程纪律的团队，选择预设并按阶段Skill组织任务，交付设计、计划、测试和核验记录。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **Skill**：总纲及需求/计划/TDD/子代理/验证六个Skill。
- **Agent/Preset**：engineering-workflow工程预设与宿主工具组合。
- **后台**：预设字节同步和工作流公告。

> **思考**：“五阶段硬门禁”由什么强制？host只同步与公告，不监控测试先后或批准证据；Skill纪律依赖模型遵循，plan模式的宿主门禁只覆盖相应入口。syncOnePreset在源不同或有多余文件时prune/copy，会覆盖同名预设里的用户定制并删额外文件，自动更新不是无损合并。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对每次手贴工程提示，贡献是将superpowers方法改写为DSH原生工具映射，随预设分发并同步六个Skill。README明确承认方法来自obra/superpowers、工具组合来自DSH cordis、同步模式来自dsh-liangshen；增量是DSH五阶段路由与打包协作，非全新开发方法。

<a id="detail-section-9"></a>

### 1.8 使用建议

对流程一致性有需求的团队先用非关键新会话试；备份同名预设定制，明确哪些步骤由宿主强制、哪些靠Skill遵循，再按任务复杂度使用。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认预设/Skill分发与同步；未执行同步或真实开发任务，README硬门禁不等于插件独立执行前强制拦截。未来流程证据检查是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.1；版本日期：2026-08-17（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[3e251eb7](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/tree/3e251eb78002625bcc238a42d9926d87c3a38bfe)；本次截止 2026-10-21T03:36:14Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读host同步、preset组合与总纲/阶段Skill；未执行同步、开发流程或目标测试，不把工具齐全当阶段保证。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：07ee1a984953098b088afd8af526bf1c6e658e5c46f084a0deeadadfe9ef6246。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 807 | — | — | 10378 |
| .js | source | 1 | 254 | 172 | 67 | — |
| .mjs | source | 3 | 198 | 138 | 50 | — |
| .mjs | test | 1 | 126 | 112 | 5 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：把每阶段产物/批准/测试输出变成可验证清单，并在同步预设时保留本地overlay与冲突报告，可同时提高流程可检查性和升级可维护性。由提示式门禁及镜像覆盖推导，未实现。用跳过RED、伪造测试声明、用户加本地Skill再升级三类对照，测漏检、误拦和定制保留；不能为了统一流程强制给低影响修改制造测试。

隔离DSH_HOME验证同步覆盖/失败、工具目录、阶段跳过和实际批准/RED证据；用独立任务对照流程负担，本轮未执行。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/82c86b8z86-stack/dsh-engineering-workflow/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
