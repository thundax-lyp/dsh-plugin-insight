# 软件交付

[返回首页](../../README.md)

## 分类导航

- [dsh-project-memory](#plugin-1339316901-root)：在项目内保留任务、文件关联、文档／符号索引和经验，帮助新会话恢复工作。
- [TaskSwarm — 并行开发任务编排](#plugin-1333800488-root)：把能拆开的开发任务按依赖分波，在 Git worktree 中并行执行，再评审和集成。

### 软件交付（2）

<a id="plugin-1339316901-root"></a>

#### [dsh-project-memory](20261019T074011Z-smoke-1339316901-root-detail.md)

[![GitHub Star 23](https://img.shields.io/static/v1?label=stars&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm近30天下载 4537](https://img.shields.io/static/v1?label=npm+30d&message=4%2C537&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · 最后推送：前天（2026-10-17）

- **用途：**在项目内保留任务、文件关联、文档／符号索引和经验，帮助新会话恢复工作。
- **亮点：**默认读到再索引，召回附来源；确定性索引不用模型调用，能从较小范围试起。
- **关键质疑：**多保存、多召回是否真的减少恢复时间与错误？目录所说“零成本”没有覆盖默认嵌入表、提示占用、噪声治理和跨作用域经验维护。
- **建议：**本轮优先试用候选：同一项目经常换会话、已有明确任务验收的人，可先做单项目对照；尚不能作为安装推荐。

<a id="plugin-1333800488-root"></a>

#### [TaskSwarm — 并行开发任务编排](20261019T074011Z-smoke-1333800488-root-detail.md)

[![GitHub Star 3](https://img.shields.io/static/v1?label=stars&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm) · [![npm近30天下载 0](https://img.shields.io/static/v1?label=npm+30d&message=0&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-taskswarm) · 最后推送：2个月前（2026-08-16）

- **用途：**把能拆开的开发任务按依赖分波，在 Git worktree 中并行执行，再评审和集成。
- **亮点：**把任务包、隔离工作区、调度和串行合并组织成可观察流程，适合已有测试标准的独立任务。
- **关键质疑：**多 Agent 省下的等待，能否覆盖拆任务、模型评审、冲突处理与最终验收？当前 npm 入口不可用，评审分支也未保证“明确 PASS 才放行”。
- **建议：**目前继续观察；分发与宿主兼容确认后，在可丢弃仓库里试，保留最终人工验收。

## 更新时间

2026-10-19
