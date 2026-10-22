# AI 残渣清运

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[d1efd79](https://github.com/1344738825/ai-residue-cleaner/tree/d1efd794049a2a26b8e75573b51df249bd72b62b)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：按规则把会话副产物移入可还原回收站，并提供项目结项归类、归档与清理清单。

> **核心亮点**：Host在turn/end后台派生Python清运；cleanup.py按规则移动文件并写manifest，项目open时跳过自动清理，结项时分类与归档。

> **风险与缺陷**：可逆移动及清单降低首次误收损失；规则覆盖面广且会过期真删，不应替代项目引用和保留策略。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：AI生成的探测、草稿和缓存污染工作区，用户需要减少整理负担并能恢复误收文件。

此前未入档；显式产出目录配合手工清理更透明，本项增量是自动回收、归档和还原入口。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **后台**：turn/end 调用Python清运及首条消息输出守则注入。
- **用户命令**：dry-run、结项、回收清单与还原子命令。

**流程与依赖**

需要Python3、项目可写目录及可靠cwd；依赖项目状态和忽略规则质量，磁盘空间不足可能影响移动与记录。

立项指定产出目录，工作期保留，结项先预览再归类清运；误收按manifest还原，保留期结束前人工确认重要原件。

**兼容条件**

0.1.1 private包，提供GitHub bundle与ZCode hooks；Python3为实际清运硬依赖，JS提示注入可单独工作。JS入口未见斜杠命令注册，README所称跨端命令一致性尚待宿主核实。

**效果与成本**

首次定义忽略规则和产出目录需人工，持续扫描和回收占I/O及空间；误分类恢复与过期损失不能算零成本。

> **思考**：可逆移动及清单降低首次误收损失；规则覆盖面广且会过期真删，不应替代项目引用和保留策略。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：Host在turn/end后台派生Python清运；cleanup.py按规则移动文件并写manifest，项目open时跳过自动清理，结项时分类与归档。

sessionCwd拒绝宿主/依赖目录，扫描跳过符号链接和嵌套仓库；restore检查既存路径，仍需验证中断后manifest与移动是否一致。

<a id="detail-section-4"></a>

## 4 使用建议

先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：名称规则不能证明文件可删除；回收站过期会真删。Python不纳入本工程JS/TS LOC，但已抽读核心清运代码。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在复制目录放入被引用图、符号链接、同名恢复目标与重要log，测试dry-run、结项、中断和恢复，再衡量人工检查时间。

**分析版本**

固定提交 [d1efd79](https://github.com/1344738825/ai-residue-cleaner/tree/d1efd794049a2a26b8e75573b51df249bd72b62b)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 196 | — | — | 2872 |
| .js | source | 1 | 229 | 163 | 52 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1344738825/ai-residue-cleaner/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
