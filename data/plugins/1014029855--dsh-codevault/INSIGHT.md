# dsh-codevault

> 把源码阅读整理成可检索的仓库、文件和符号卡片，并关联本地知识库。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[14dcb88](https://github.com/1014029855/dsh-codevault/tree/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)
<!-- END META -->

**使用建议**：先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：反复阅读相同代码的人需要保留带对象身份的笔记，减少重复整理。

Markdown 阅读笔记最易迁移；插件额外价值在结构化工具和检索，不是自动保证理解。

## 能力与限制

- **模型工具**：源码卡片和 vault 查询维护。
- **Skill**：code-reading 阅读框架。
- **用户命令**：/codevault 档案入口。

**流程与依赖**

依赖本地文件和宿主工具注册，关联 Obsidian 是可选配置；效果依赖笔记质量。

阅读后保存卡片、检索关联知识，再展开原文件核对；失效时更新或删除卡片。

**兼容条件**

包版本 0.3.0，Markdown 与 JSONL 档案在本地管理，接入依赖 DSH tools、commands、skills。

**效果与成本**

生成和维护卡片需要模型与人工审阅；只有重复使用时才可能抵消整理成本。

- **思考**：对象卡片比聊天时间线容易复用；写得整齐不等于理解准确或跟上代码变更。

## 工程分析

- **亮点**：入口注册 code-reading Skill、read/vault 工具及 /codevault，配置档案目录与可选只读 vault。

档案根与只读 vault 分开配置有利于职责清晰；跨工具迁移需核对链接与对象身份。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证笔记语义正确性、旧卡片过时识别或复杂仓库的检索召回。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用重命名、源码变更、重复对象和删除恢复样本检查档案一致性与引用可追溯。

**分析版本**

固定提交 [14dcb88](https://github.com/1014029855/dsh-codevault/tree/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 631 | — | — | 9752 |
| .js | source | 7 | 2634 | 2320 | 316 | — |
| .mjs | source | 1 | 390 | 335 | 27 | — |
| .ts | source | 7 | 3048 | 2463 | 394 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1014029855/dsh-codevault/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
