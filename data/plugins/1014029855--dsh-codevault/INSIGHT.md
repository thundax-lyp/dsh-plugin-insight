# dsh-codevault

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

> 把源码阅读整理成可检索的仓库、文件和符号卡片，并关联本地知识库。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)
<!-- END META -->

## 版本

固定提交 [14dcb88d65f7d9fcf30b3e6adac5764f705ffae9](https://github.com/1014029855/dsh-codevault/tree/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9)

## 用途与采用点评

- **用途**：反复阅读相同代码的人需要保留带对象身份的笔记，减少重复整理。
- **亮点**：入口注册 code-reading Skill、read/vault 工具及 /codevault，配置档案目录与可选只读 vault。
- **思考**：对象卡片比聊天时间线容易复用；写得整齐不等于理解准确或跟上代码变更。
- **建议**：先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。

## 场景与替代办法

Markdown 阅读笔记最易迁移；插件额外价值在结构化工具和检索，不是自动保证理解。

## 依赖与流程

依赖本地文件和宿主工具注册，关联 Obsidian 是可选配置；效果依赖笔记质量。

阅读后保存卡片、检索关联知识，再展开原文件核对；失效时更新或删除卡片。

## 成本与效果

生成和维护卡片需要模型与人工审阅；只有重复使用时才可能抵消整理成本。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8ec2a3fcb0cd930465b5988484856c0713c74edf82b52bb54cae9ef7ade8b172。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 631 | — | — | 9752 |
| .js | source | 7 | 2634 | 2320 | 316 | — |
| .mjs | source | 1 | 390 | 335 | 27 | — |
| .ts | source | 7 | 3048 | 2463 | 394 | — |

排除 7 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：源码卡片和 vault 查询维护。
- **Skill**：code-reading 阅读框架。
- **用户命令**：/codevault 档案入口。

## 工程亮点

档案根与只读 vault 分开配置有利于职责清晰；跨工具迁移需核对链接与对象身份。

## 分发与兼容

包版本 0.3.0，Markdown 与 JSONL 档案在本地管理，接入依赖 DSH tools、commands、skills。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证笔记语义正确性、旧卡片过时识别或复杂仓库的检索召回。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用重命名、源码变更、重复对象和删除恢复样本检查档案一致性与引用可追溯。

## 活跃度

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1014029855/dsh-codevault/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
