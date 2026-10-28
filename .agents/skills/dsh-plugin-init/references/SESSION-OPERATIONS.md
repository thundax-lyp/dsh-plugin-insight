# 会话与合并恢复

状态语义见[数据契约](../../_shared/references/DATA-CONTRACT.md#唯一当前快照与本轮增量)，正常流程见[列表编排 Skill](../SKILL.md)。本页只规定暂存、合并、中断和清理的处理方式。

## 新轮次与同轮恢复

- 新轮次读取唯一当前快照及其摘要，不要求上一轮 SESSION 或归档。旧过程文件缺失不算正式快照损坏。已合并轮次不作为新调用的恢复目标；新调用先读取正式research_blocks排除已知同版本受阻，再按显式重试优先、更新、新项补足，选择与额度见数据契约。
- 同轮恢复读取本轮会话、固定选择、基线摘要及暂存材料，验证检查点后跳过完整项，不重置上限或替换受阻项；显式同轮重试见下方命令。
- 已暂存项发现语义错误时，在修改原件前用 `snapshot reopen --work <WORK> --input <REOPEN.json>` 预览，核对后加 `--apply`。输入为 `{ id, record_digest, reason }`，其中摘要用共享 `digest` 对读取器还原的 `work.records[id]` 计算。入口依数据契约保留 `reopened/<record_digest>.json` 备份并解除该项检查点；再退回 worker 修订、重新验收暂存。重复解除、摘要不符或基线变化均拒绝，不手改 WORK。
- 已暂存证据从 WORK 的内嵌正文校验，不依赖原 artifact 标签对应的历史文件。尚未暂存的材料丢失、当前观察／原稿丢失或摘要不符时，仅重做受影响的未合并记录；不能复制旧会话、刷新时间或从正式档案反写指纹以伪造完成。
- 当前快照缺少来源成员清单或比较维度时标 unknown，重新采集，不从历史 manifest 拼造完整基线。

## 拆分过程与迁移

INIT 的频繁更新过滤在新 WORK 固定 selection.cooldown_ids；具体窗口与例外见 [INIT Skill](../SKILL.md#频繁更新过滤)，同轮恢复不重算墙上时间。

新建 WORK 为 v2 索引：固定清单只存 INPUT，变化按下标存 QUEUE，状态与单项结果按内容摘要独立存放。SESSION 是指向 WORK 的兼容入口；读取器完成校验后还原既有内存结构，业务脚本不各自拼装。完整不变量见数据契约。

- `npm run snapshot -- migrate-work --work data/runs/<round>/WORK.json`：预览源格式、语义摘要和原文件大小，不写文件。
- 同命令加 `--apply`：持有 WORK 与 SESSION 锁，保留旧 WORK／SESSION 原始字节，准备依赖并校验，再原子切换 WORK；回读摘要一致才报告迁移完成。
- 原件保留在该轮 `migration-originals/work-storage-v1/`，迁移报告为 `WORK-MIGRATION.json`；备份、未知文件和中断残留不由 clean 自动删除。
- v1 继续兼容读取及暂存。v2 的 next、stage、block、plan、apply、prepare 与 assemble 共用读取器；旧 research 命令拒绝直接修改 v2 SESSION，使用 snapshot 对 WORK 操作。
- 路径、引用或摘要失效时停止，不静默回退原件或刷新摘要。切换前中断可重试；切换后中断以 WORK 为准恢复兼容入口和迁移报告。拆分不改变固定选择、观察批次、检查时间或正式快照。

## 正式快照存储迁移

`snapshot migrate-storage --backup <新的备份目录>` 显式把 v3 分桶组件和独立证据迁为同名 slug 目录内的 research.json／meta.json。迁移读取当前正式快照，不读取旧 runs，不重新分析；备份保存旧索引、状态、组件和证据全部原始字节，包含未提交修改。备份必须在 catalog 外且未存在，重复迁移只校验当前成果。具体内容不变量与事务恢复见数据契约。

迁移改变正式基线，旧未合并 WORK 不能直接覆盖新快照；保留旧过程用于核对，新研究从 catalog 新建轮次。已合并过程不必重写。迁移遇到缺少原稿但仍有旧发布稿时按数据契约原样保存为保留稿，不从展示稿反推研究结论。`snapshot reindex` 从当前 slug 目录重建查询索引，校验全局顺序与完整语义，不改变研究或 META。

本次存储迁移的实际范围与校验见[迁移验证](STORAGE-MIGRATION-EVIDENCE.md)。

## 组件推荐迁移与复核

`npm run snapshot -- assess-recommendations --input <ASSESSMENTS.json>` 预览；核对后加 `--apply` 持正式锁校验、原子合并并重生成页面。可用于给已有研究补推荐评估，不重做源码研究；不得据此宣称新安装或运行验证。旧组件缺字段时补为未评估、分数null；只对输入中已实际复核的组件赋予结论和分数，保留其他已有评估。历史独立推荐名单退出真相源，不从缺席推断不推荐。

输入必须包含 base_digest（共享digest对还原后的正式快照计算）、reviewed_at 和 assessments 映射；每个稳定ID对应 revision、decision、reason、criteria，criteria结构与单项ANALYSIS.recommendation一致。当前发布项仅接受匹配已完成研究版本及不早于研究时间的复核；未发布但保留研究档案的组件只允许observe／not_recommended，须引用确实存在的同版本源码证据并强制needs_review，不恢复发布记录。install另引用宿主验收。命令同步分析摘要但不改源码检查时间、原稿或轮次事务；正式基线变化时先重读再复核，不覆盖并发。已应用输入再次执行因基线变化而拒绝，应先回读当前结论，不自动重放。

## 暂存与最终合并

- 所选项为空时允许仅推进全局来源核查信息与轮次时间；完整扫描候选仅保存于本轮 INPUT／WORK，不写入 catalog 当前成果，保留既有研究和展示记录；所选项全部受阻时，只要每项有完整持久block，也允许仅合并受阻原因；既无成功也无完整block则拒绝。
- plan 与 apply 均拒绝仍有 pending 所选项的 WORK；先完成或明确登记 blocked，再合并成功项及持久受阻记录。逐项 stage 仍可在同轮其他项 pending 时暂存，不实现部分合并后的重基线。

- 研究过程中的 plan／apply 只作用于本轮候选；正式快照在最终合并前保持不变。
- 合并计划同时绑定正式基线和候选摘要，核对身份、版本、证据、结论依赖和展示输入。正式基线变化时重新计划并审阅冲突。
- 支撑当前结论的分析与证据先准备到正式引用位置，再通过一致的事务提交当前状态。回读提交结果后才能报告已合并。
- 中断发生在提交点前，正式状态仍为旧快照；提交点后回读实际合并标识与摘要，已合并的增量不得重复应用。
- 单项失败或未完成不替换有效记录；需要标记旧结论失效时，将有证据的失效判断作为独立可校验记录处理。
- 锁存在时停止写入，核对 PID 和实际写入者；确认无活跃写入者后才能清理遗留锁，不自动抢占。

## 合并后清理

清理前须按 INIT 第8步执行 `npm run export:meta-manifests -- --work <WORK.json>` 的预览、`--apply` 和最终只读回读，确认 npm 与 Git 清单均无待写差异。路径未部署、身份解析、并发更新或任一回读失败时保留 WORK；单独 npm 回写成功不能视为双清单已完成。目标字段和事务语义以[数据契约](../../_shared/references/DATA-CONTRACT.md#外部-meta-双清单回写)为准。

按[输出标准](OUTPUT-STANDARD.md#本地-runs-与-git-清单)检查本轮合并结果、当前引用及恢复需求。确认当前快照可独立校验和生成后，预览并清理无引用的已合并副本，不要求永久归档。
未合并增量、待处理失败材料、活动锁和用途不明的文件保留；当前引用仍指向 runs 时先完成落位，不能先删文件。
旧历史文件是否迁移或删除另按实际任务执行，本次规范变更本身不执行清理。

## 命令与兼容输出

- `npm run snapshot -- start --input <INPUT.json> --work data/runs/<round>/WORK.json [--limit N] [--retry-plugin <id>]`：重试参数可重复，仅在用户明确要求时传入；指定已登记受阻候选优先占正常额度。省略 `--limit` 默认40，绑定当前快照摘要并固定选择，不读取上轮会话。
- `block --work ... --plugin <id> --input <reason.json>`：reason包含稳定reason_code、可读reason及自包含问题详情；写入本轮block，最终由plan/apply落入正式快照。
- `retry --work ... --plugin <id>`：用户明确要求时，重置未合并的已选blocked项为pending后重新准备，原始失败材料保留；不改变固定选择或额度。已合并事务不能重置，开启新轮并指定--retry-plugin。
- 新轮 `snapshot start` 在截断额度前按数据契约固定综合热度排序，保存 selection.heat；旧 WORK 和同轮恢复不重新排行。
- `next --work ...` 按固定 selected_ids 返回本轮待处理项；`stage --work ... --plugin <id> --observations ... --report ... --display ...` 校验完整单项记录，只更新 WORK／本轮 SESSION。
- `plan --work ... --out ...` 产生合并候选；`apply --plan ...` 持锁复核并原子更新正式快照，重复执行同一结果不重复追加。
- apply 已成功而生成中断时，直接执行 `snapshot render`；不重新研究或重复应用观察。
- `snapshot validate` 和 `npm run check` 校验正式快照及派生成果；不要求旧 runs 或 manifest 存在。
- `snapshot clean --work ...` 预览；加 `--apply` 只清理已确认合并、全部完成的已知材料。未知文件保留，受阻项需要恢复时拒绝清理。
- `snapshot bootstrap` 仅用于现有旧数据的首次迁移，记录缺失原件，不制造新研究。已有正式快照时拒绝再次初始化。

轻量更新遵循数据契约“目录与维护信息的轻量更新”：新 WORK 固定 metadata_only_ids，旧 WORK 恢复保持原选择。不合并扫描候选到正式研究，按需执行 `npm run refresh:meta -- --plugin <稳定ID>`（可重复）定向刷新；不在未合并事务期间改写正式基线，不重新准备源码证据。

旧 research／publication 命令保留兼容读取能力，但不得对正式派生档案单独 apply。META 刷新同样先更新内存候选，校验正式快照摘要、持锁原子写入后再生成页面。

## 下载失败与材料准备恢复

`npm run prepare:selected -- --work data/runs/<round>/WORK.json` 按固定仓库与提交组织最多4个工作单元。每个仓库下载、校验成功后立即准备其组件，不等待全轮下载完成；某仓库失败只影响该仓库同版本组件，其他项继续。准备失败以非零状态退出，不自动登记正式 research_block、不补位，也不改变固定选择或版本。

下载使用 HTTP/1.1、浅层部分克隆（`blob:none`）及源码／配置／文档稀疏检出，缺失的 Git 对象按需读取；inventory 仍从固定提交的完整组件树统计，不把稀疏工作区当成全量目录。单条子进程命令上限180秒，Git 连续30秒低于1024字节／秒时中止；下载与检出最多尝试2次，耗尽后继续其他仓库。命令超时终止进程组（Windows仅终止直接子进程）。复用前核对 HEAD 和干净状态；除既有纯换行修复外，发现已有修改时拒绝覆盖。

本轮准备器维护以下本地过程材料，不写入正式档案：

- `PREPARATION-ATTEMPTS.jsonl`：追加记录命令开始、完成和失败；失败保留命令参数、耗时、退出码、信号、超时标志和 stdout／stderr。后续成功不抹去旧失败；有开始而无结束的记录表示该次执行未完成确认。
- `PREPARATION-STATE.json`：每项成功后原子保存四份材料的内容摘要，绑定会话、输入摘要和固定选择。重新执行同一命令时，只有 HEAD、工作区和四份材料摘要均通过校验的项才跳过；失败、缺失或摘要变化的项重新准备，已完成研究项不重写。
- `PREPARATION-CACHES.json`：冻结首次准备的 npm／Git 缓存及来源、缓存读取错误和采集时间；同轮重试复用，不重取热度或重选版本。缓存不可用仍按原规则回源采集，不将未知值填0。
- `PREPARATION.json`：最近一次执行汇总；完整失败历史以追加日志为准。

准备器用本轮 `PREPARATION.lock` 排除并发执行；锁记录 PID 和开始时间。异常终止后先确认该 PID 和相关子进程均已退出，再人工清理遗留锁，随后重跑原命令；不自动抢锁。运行中的研究者不得移动或改写已被 WORK 引用的材料。以上过程文件按既有 runs 清理规则保留，不能为了重试删除失败日志或重建固定队列。
