# MJS 名称与接口清单

覆盖仓库当前全部 MJS。能力入口按任务调用；内部模块由入口组合，不要求 Skill 逐个执行；兼容入口保留旧协议，不增加日常步骤。

表中入参列列出业务参数，函数可选的请求器、缓存器及 root 等执行上下文以源码签名为准。出参同时注明主要文件写入；人工验收、计划与应用仍由调用者分步决定。各文件名链接到实际实现，CLI 命令以根 [package.json](../../package.json) 为准。

## 能力入口

| MJS | 功能 | 入参 | 出参与写入 |
| --- | --- | --- | --- |
| [prepare-research.mjs](../../.agents/skills/dsh-plugin-init/scripts/prepare-research.mjs) | 准备整轮或指定插件的材料；支持恢复 | research:prepare：来源 checkout、轮次 ID、检查时间、额度；或 --input；恢复 --work；research:materials：--work、可选 --plugin | RESEARCH-PREPARATION.json、选择摘要、四份材料路径、待办与错误；写入轮次准备产物 |
| [assemble-insight.mjs](../../.agents/skills/dsh-plugin-insight/scripts/assemble-insight.mjs) | 装配人工研究结论 | --work、--plugin、--analysis | 报告、观察、展示文件路径；写入研究产物与 REVIEWED-SOURCE |
| [research-acceptance.mjs](../../.agents/skills/dsh-plugin-init/scripts/research-acceptance.mjs) | 准备验收包、读取正文、保存人工决定并暂存 | prepare：--work --input --out；read：--bundle --plugin，可选 --question 或 --artifact；stage：--bundle --input --out | BUNDLE、正文或带摘要的 DECISIONS 与暂存状态；submit／stage --decisions 保留兼容；不代替人工判断 |
| [snapshot-data.mjs](../../.agents/skills/dsh-plugin-init/scripts/snapshot-data.mjs) | 快照操作分派；计划与应用分开调用 | 子命令与其参数；research:plan：--work；research:apply：--plan | 各操作 JSON 结果；plan 生成计划，apply 验证并应用；也分派退修、受阻、清理和存储维护 |
| [refresh-meta.mjs](../../.agents/skills/dsh-plugin-init/scripts/refresh-meta.mjs) | 刷新当前发布条目的固定 META | --input，可选重复 --plugin、--npm-publication-only | 更新 META、脚本变化检查与刷新结果；CLI 同时重生成页面，不重写人工研究判断 |
| [render-research.mjs](../../.agents/skills/dsh-plugin-init/scripts/render-research.mjs) | 渲染研究页面或核对生成一致性 | --input，可选 --check；模块 renderPublication(input, root, context) | 生成页面；检查模式报告差异；快照输入转交 renderSnapshot |
| [export-meta-manifests.mjs](../../.agents/skills/dsh-plugin-init/scripts/export-meta-manifests.mjs) | 同步 npm 与 Git 双清单，应用后回读确认 | --work，可选 --repository、--branch、--apply | 两份清单差异、同步结果、verified_commit_sha、remaining_changes；默认预览，应用时写远端 |
| [codex-review.mjs](../../.agents/skills/codex-comment-fix/scripts/codex-review.mjs) | 检查 Codex 评论并按处置计划应用 | inspect：可选 --pr、--out、--codex-login（仓库取当前 checkout）；apply：--plan、可选 --apply | 评论及汇总发现、处置计划／执行结果；应用可能写 GitHub，遵循授权边界 |
| [npm-meta.mjs](../../.agents/skills/_shared/scripts/npm-meta.mjs) | 获取一个包的固定 npm META | CLI：包名；getNpmMetadata(packageName, options) | npm 下载数、时间窗口、发布信息及来源、cache_error；已有有效缓存字段直接采用，缺失字段回源 |
| [github-meta.mjs](../../.agents/skills/_shared/scripts/github-meta.mjs) | 获取一个仓库的固定 GitHub META；同模块维护 Git 缓存解析与索引 | CLI：OWNER/REPO，可选 --repository-id；getGithubMetadata({repository, repository_id, checked_at}, context) | 经校验的 GitHub META、采集状态及错误；缓存函数接收文本／仓库身份，返回缓存 Map／快照／单仓库 META |

## 内部模块与底层组件

| MJS | 功能 | 入参 | 出参与写入 |
| --- | --- | --- | --- |
| [github-client.mjs](../../.agents/skills/_shared/scripts/github-client.mjs) | GitHub 访问：REST、GraphQL 批量身份解析、文件读写 | endpoint／query／仓库列表；或仓库、分支、路径、token；写入含基线 SHA、文件文本、提交消息 | API 响应、仓库身份 Map、文件文本与 SHA 或提交结果；写接口有远端副作用 |
| [research-scoring.mjs](../../.agents/skills/_shared/scripts/research-scoring.mjs) | 研究评估：装配、校验创新分与采用建议，读取有效分并排序推荐 | 人工分项与理由、插件、版本、时间、证据及依赖；或待排序条目 | 创新分、采用建议、有效分、推荐顺序或校验结果；不采集 META、不以热度替代研究判断 |
| [snapshot-storage.mjs](../../.agents/skills/_shared/scripts/snapshot-storage.mjs) | 快照存储：当前格式读写、旧格式解码、迁移、恢复与重建索引 | 索引路径、快照、组件身份／slug、校验和；或索引文本与 load 回调；迁移可含备份路径 | 还原快照、组件索引、文件路径或维护结果；写操作更新磁盘；旧格式解码为内部实现 |
| [research-work.mjs](../../.agents/skills/dsh-plugin-init/scripts/research-work.mjs) | 创建 WORK、暂存研究、退修、标记受阻 | INPUT、WORK 路径、额度／热度；或研究文件／受阻记录；退修含 apply | WORK 或操作结果；按操作写检查点，退修应用时备份旧产物 |
| [session-state.mjs](../../.agents/skills/dsh-plugin-init/scripts/session-state.mjs) | 校验与变更研究会话状态 | 会话、manifest、研究项及产物、基线 catalog | 校验结果、初始／更新会话、选中项 |
| [snapshot-state.mjs](../../.agents/skills/dsh-plugin-init/scripts/snapshot-state.mjs) | 读取并校验快照与 WORK | root、快照或 WORK | 经校验的快照／WORK；导出快照位置 |
| [snapshot-merge.mjs](../../.agents/skills/dsh-plugin-init/scripts/snapshot-merge.mjs) | 构造并应用快照合并计划 | planSnapshot(workPath, root)；applySnapshot(plan, root) | 合并计划或应用结果；应用写快照并回读 |
| [research-selection.mjs](../../.agents/skills/dsh-plugin-init/scripts/research-selection.mjs) | 按增量规则与热度选择研究项 | 基线、候选项、重试 ID、检查时间、热度或会话 | 选中项、抑制项、冷却项等选择结果 |
| [prepare-selected.mjs](../../.agents/skills/dsh-plugin-init/scripts/prepare-selected.mjs) | 为选中项恢复下载并准备机械材料；内部执行带超时的准备子进程 | WORK 路径；options 含可选 pluginIds、准备配置 | PREPARATION 结果、检查点与每项材料；不替换选中队列 |
| [build-research-input.mjs](../../.agents/skills/dsh-plugin-init/scripts/build-research-input.mjs) | 从两份来源 checkout 构造规范研究输入 | id、checkedAt、awesome、harness、catalog、完整性标记 | INPUT、来源问题；兼容 CLI 支持写出文件 |
| [render-snapshot.mjs](../../.agents/skills/dsh-plugin-init/scripts/render-snapshot.mjs) | 从当前快照生成或检查整套页面 | renderSnapshot(root, checkOnly) | status、snapshot_digest、files；生成时写页面 |
| [export-package-manifest.mjs](../../.agents/skills/dsh-plugin-init/scripts/export-package-manifest.mjs) | 构建、合并、校验 npm 包清单 | WORK／快照或远端与已验证包名集合 | 排序去重的包清单、文本或校验结果；保留单清单旧命令 |
| [export-git-manifest.mjs](../../.agents/skills/dsh-plugin-init/scripts/export-git-manifest.mjs) | 构建、合并、校验 Git 仓库清单 | WORK、快照；远端记录、候选记录、身份解析器 | Git 候选／合并清单、文本或校验结果 |
| [assess-recommendations.mjs](../../.agents/skills/dsh-plugin-init/scripts/assess-recommendations.mjs) | 给已有研究应用显式采用评估 | input.assessments、root、apply | 计数、评估条数、结果摘要；apply 时写快照 |
| [forget-research.mjs](../../.agents/skills/dsh-plugin-init/scripts/forget-research.mjs) | 按显式名单移除研究及关联发布引用 | {plugin_ids, base_digest}、root、apply | 移除数量、目录、关联结论与摘要；默认预览 |
| [clean-work.mjs](../../.agents/skills/dsh-plugin-init/scripts/clean-work.mjs) | 清理已完成交付的轮次文件 | WORK 路径、root、apply | 拟清理／已清理文件；保留未知与失败材料 |
| [bootstrap-snapshot.mjs](../../.agents/skills/dsh-plugin-init/scripts/bootstrap-snapshot.mjs) | 从既有档案建立初始快照 | root | 初始化快照与存储产物 |
| [maintain-runs.mjs](../../.agents/skills/dsh-plugin-init/scripts/maintain-runs.mjs) | 校验轮次命名并维护旧运行目录 | maintainRuns(apply)；validateRunNames()；verifyCleanup() | 校验／清理结果；应用时清理允许的运行文件 |
| [migrate-data.mjs](../../.agents/skills/dsh-plugin-init/scripts/migrate-data.mjs) | 迁移旧研究数据布局并校验 | migrate(apply)；verifyMigration() | 迁移计划／结果、迁移标记与校验结果 |
| [validate-data.mjs](../../.agents/skills/dsh-plugin-init/scripts/validate-data.mjs) | 执行仓库数据与检查点一致性检查 | 无 CLI 参数；读取当前档案、快照及本地运行数据 | 检查信息与退出码；不写数据 |
| [plugin-inventory.mjs](../../.agents/skills/dsh-plugin-insight/scripts/plugin-inventory.mjs) | 分析固定 Git 内容的文件与能力清单 | checkout、ref、组件路径；或文件集合与 metadata | 文件、语言／规模、组件能力等 INVENTORY；兼容 CLI 可写文件 |
| [prepare-plugin-materials.mjs](../../.agents/skills/dsh-plugin-insight/scripts/prepare-plugin-materials.mjs) | 从固定源码和清单构造研究材料包 | session、sessionPath、pluginId、checkout、inventory、inventoryPath、directoryEntries | MATERIALS 对象及来源内容摘要；CLI 写出指定文件 |
| [research-questions.mjs](../../.agents/skills/dsh-plugin-insight/scripts/research-questions.mjs) | 校验逐题研究并渲染逐题正文 | 问题对象；sourcePaths、readSource、repository、revision | 校验结果或 Markdown；导出研究主题集合 |
| [research-metrics.mjs](../../.agents/skills/_shared/scripts/research-metrics.mjs) | 批量采集研究排序用的冻结指标 | {items, metadata, checked_at}；可注入 npm／Git 缓存 | heat 指标快照，包含 Star、下载数、来源与错误；不进行人工评估 |
| [heat-score.mjs](../../.agents/skills/_shared/scripts/heat-score.mjs) | 校验冻结指标、计算热度并排序 | heat、候选 items、检查时间 | 子集指标、校验结果、分数映射或排序后的候选项 |
| [metadata-validation.mjs](../../.agents/skills/_shared/scripts/metadata-validation.mjs) | META 校验与指标时间语义 | npm 结果、META 对象或时间值 | 合法对象；对象不合法时抛错；时间检查返回布尔值 |
| [capture-github.mjs](../../.agents/skills/_shared/scripts/capture-github.mjs) | 采集固定 GitHub 仓库证据 | 仓库名、请求器；兼容 CLI：OWNER/REPO --out | GitHub 证据对象、发布指纹；CLI 写证据文件 |
| [git-reference.mjs](../../.agents/skills/_shared/scripts/git-reference.mjs) | 构造、校验、渲染固定 Git 引用 | repository_url、commit、path、内容或定位参数；或引用对象 | Git 引用、校验结果或固定版本 URL |
| [data-paths.mjs](../../.agents/skills/_shared/scripts/data-paths.mjs) | 解析数据目录与重定向 Markdown 链接 | 插件身份、root；或文本、原目录、目标目录 | 数据路径、slug、改写后的 Markdown；导出固定数据文件位置 |
| [plugin-data.mjs](../../.agents/skills/_shared/scripts/plugin-data.mjs) | 研究数据基础校验、摘要与原子读写 | catalog／observations／JSON 值与路径；兼容 CLI validate、plan、apply | 校验对象、digest、增量计划／应用结果；写接口写文件 |
| [publication-validation.mjs](../../.agents/skills/_shared/scripts/publication-validation.mjs) | 校验发布数据与展示数据 | PUBLICATION 或 DISPLAY 对象 | 合法对象／校验结果；不合法时抛错 |
| [work-storage.mjs](../../.agents/skills/_shared/scripts/work-storage.mjs) | 读写、迁移拆分 WORK 和会话存储 | 路径、WORK、split；迁移含 validate、apply | 还原后的 WORK／会话、存储文件列表、迁移结果；写入受调用参数控制 |
| [blocks.mjs](../../.agents/skills/dsh-plugin-init/scripts/publication/blocks.mjs) | 渲染发布页的徽章、榜单和导航块 | 研究条目、分类、推荐、日期、URL 等 | Markdown／HTML 片段或分类分组 |
| [detail-layout.mjs](../../.agents/skills/dsh-plugin-init/scripts/publication/detail-layout.mjs) | 拆分研究正文并组织详情页布局 | Markdown、报告、条目及 META／议题／建议等展示上下文 | 章节结构或详情页 Markdown |
| [template.mjs](../../.agents/skills/dsh-plugin-init/scripts/publication/template.mjs) | 加载发布模板并替换占位值 | 模板名、values；或模板文本与 values | 替换后的文本 |

## 兼容入口

| MJS | 功能 | 入参 | 出参与写入 |
| --- | --- | --- | --- |
| [research-session.mjs](../../.agents/skills/dsh-plugin-init/scripts/research-session.mjs) | 维护旧会话命令协议 | start／next／checkpoint／block／retry／invalidate／validate／manifest／publish 及各自文件参数 | 旧会话检查点、manifest 或发布结果；新轮流程使用 research:prepare |
| [publication-data.mjs](../../.agents/skills/dsh-plugin-init/scripts/publication-data.mjs) | 维护旧发布 manifest 的校验、计划与应用 | validate／plan／apply；发布输入、catalog、manifest 路径或计划 | 校验结果、发布计划或应用结果；当前快照流程由 snapshot-data 分派 |
| [capture-plugin-meta.mjs](../../.agents/skills/dsh-plugin-insight/scripts/capture-plugin-meta.mjs) | 组合 npm 与 GitHub META 的旧调用入口 | OWNER/REPO，可选 --npm，--out；保留旧 captureNpmDownloads 函数签名 | 聚合 META 文件；底层采集转交 npm-meta／github-meta |
