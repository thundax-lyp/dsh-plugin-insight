---
name: dsh-plugin-init
description: 显式编排一轮 DSH 插件研究：固定来源与队列、分派单插件洞察、验收暂存、事务合并并生成页面。也用于明确要求的同轮恢复或仅重生成读者页面；普通排版讨论不启动研究。
---

# 插件列表与研究编排

父 Agent 管理来源、基线、选择、验收与最终合并，子 Agent 逐项执行洞察。完成是当前快照可独立校验和生成、双清单回读无差异；准备成功、子 Agent 回报或 stage 成功均不是完成标志。

## 先选择执行模式

| 用户请求 | 执行方式 | 不做的事 |
| --- | --- | --- |
| `$dsh-plugin-init [N]`／新一轮研究 | 新建未占用轮次，默认总额度40；N须为正整数 | 不因同日已有已合并轮次而复用旧任务 |
| 明确恢复未合并轮次 | 用共享读取器加载该轮 WORK，校验引用摘要后继续 | 不重选、不重置额度、不补位、不刷新已固定的时间或热度 |
| 仅改布局／写作并重生成 | 只执行[读者页面重新生成](references/HOW-TO-REGENERATE-PAGES.md) | 不扫描目录、不创建轮次、不调用洞察、不改原研究证据 |

## 按任务读取

- **新轮／恢复必读**：[数据契约](../_shared/references/DATA-CONTRACT.md)中的快照、身份、证据、会话、受阻与清理；[研究规范](../dsh-plugin-insight/references/RESEARCH-STANDARD.md)；[输出标准](references/OUTPUT-STANDARD.md)的产物位置、逐题交付与验收。
- **暂存、恢复、迁移、下载或清理**：按需读[会话与合并恢复](references/SESSION-OPERATIONS.md)。迁移只在任务确实涉及旧格式时执行。
- **验收研究与推荐**：读[逐题流程](../dsh-plugin-insight/references/QUESTION-WORKFLOW.md)、[评分标准](../dsh-plugin-insight/references/SCORING-STANDARD.md)及[推荐理由](../dsh-plugin-insight/references/QUESTION-ADOPTION.md#最值得推荐的具体用法)。
- **收到洞察交付**：使用[验收链操作](references/HOW-TO-ACCEPT-RESEARCH.md)，固定交付后逐题语义验收，再通过同一入口批量暂存。
- **字段、META、依赖或清单回写**：读数据契约对应章节；不要用整个文档的重复副本作第二真相源。

命令在工程根执行，Node 遵循 `.node-version`；依赖缺失才 `npm ci --ignore-scripts`。Git 协作由根 AGENTS 路由。不执行目标插件代码。GitHub 访问使用当前可用插件或已认证工具，不假设特定外部 Skill 名称。

## 当前快照与本轮增量

正式真相是 `data/catalog/<slug>/research.json`、独立 `meta.json`、`index.jsonl` 和 `state.json`，由共享存储器读取；README、分类与详情是生成物。`data/runs/<round>/WORK.json` 是尚未合并增量的入口，使用共享过程读取器，不手工拼接拆分文件。旧 SESSION、runs 或 manifest 缺失不阻止新研究，当前缺少比较依据时标 unknown。

新流程使用 `npm run snapshot -- ...`；已有快照不执行 bootstrap，不单独 apply 旧 research／publication 派生档案。不手改检查点、固定选择或摘要来通过验证。数据与事务语义以数据契约为准。

## 选择与额度

先核对全部已有成果，再选择需更新项，新研究项补足总额度。比较基线是该项最后成功完成的研究，不是后来只发现的新版本。源码／位置未知、迁移、依赖失效或 needs_review 按契约复核；仅目录／维护变化且相关依赖未失效时是轻量项，保留原研究，不占额度、不准备源码材料。

正式同版本受阻项在选前跳过，不占额度；用户明确重试才传 `start --retry-plugin <id>`（可重复）。选中后首次受阻仍占名额，不补位。同轮重试先 `snapshot retry`，保留失败材料；已合并轮次用新轮显式重试。

综合热度只决定研究排期。`start` 在截断额度前按[heat-v1](../_shared/references/DATA-CONTRACT.md#综合热度与固定队列)固定缓存、截止、来源和顺序：显式重试→已有更新→新项；后两组内按热度降序，同分按稳定 ID。缺失不填0，不猜 npm 身份；报告缓存错误及未知覆盖。恢复／合并不重取热度，不改变创新、采用或读者热榜口径。

## 频繁更新过滤

本规则只用于 INIT 的整轮候选选择，不限制用户独立调用单插件 INSIGHT。
以本轮固定 `checked_at` 与该插件最后一次成功完成 INSIGHT 的研究时间比较；不足 3 天（72 小时）时，即使出现新 revision／版本，也暂不作为版本更新项入选，不占额度、不准备材料、不调用 INSIGHT。恰满 72 小时后恢复正常版本比较。

时间优先取最后完成研究的 publication.records.checked_at；保留研究但未发布的项取档案 last_checked_at，不能使用 META 采集、目录发现、页面生成或新版本发布时间重置窗口。时间缺失、无效或晚于本轮检查时间时不应用过滤。

仅过滤版本更新：首次研究、仓库／组件路径迁移、未知或目录移除，本轮输入已改变现有结论／创新评分／采用推荐声明依赖的非 code 指纹（含跨插件依赖），以及已有结论 needs_review 或显式重试，不因本窗口被跳过。仅 code revision 改变仍适用窗口，不把正常版本依赖一概视为过滤例外。新版本如实保存在本轮 INPUT／WORK；保留原研究版本、报告、证据及研究时间，不标记“源码未变”或“已完成新版本研究”。后续新轮次仍与最后完成研究的版本比较，不能因窗口内已发现版本而永久漏掉更新。

本轮窗口判断及跳过 ID 固定在 selection.cooldown_ids，合并时按原基线与本轮 checked_at 复算；同轮恢复不随墙上时间重排。历史会话缺少该字段时维持原选择。单列频繁更新跳过数量，不算本轮完成或受阻。

## 执行流程

### 1. 读取基线并固定来源

检查工作区、正式快照摘要及 `research_blocks`。新轮分配 `data/runs/YYYY-MM-DD-NN/`；恢复按[恢复规则](references/SESSION-OPERATIONS.md#新轮次与同轮恢复)校验旧材料，只重做受影响的未合并项。

核查两个目录，固定干净 checkout 的完整提交、检查时间和读取范围。构建前后 HEAD 不变：

```sh
npm run research:input -- \
  --source-awesome ../dsh-plugin-insight-data/sources/awesome-dsh-plugin \
  --source-harness ../dsh-plugin-insight-data/sources/awesome-deepseek-harness \
  --id <session_id> --checked-at <ISO时间> \
  --out data/runs/<round>/INPUT.json \
  --problems data/runs/<round>/INPUT-PROBLEMS.json
```

只有完整读取且身份／默认分支无问题才加对应 `--complete-awesome`／`--complete-harness`。保留解析、重定向、身份和组件碰撞问题；来源不完整时不能推断目录移除。目录条目、去重组件、仓库分开计数。

### 2. 固定队列并准备材料

```sh
npm run snapshot -- start --input data/runs/<round>/INPUT.json --work data/runs/<round>/WORK.json --limit <N>
npm run snapshot -- next --work data/runs/<round>/WORK.json
npm run prepare:selected -- --work data/runs/<round>/WORK.json
```

使用固定 selected_ids、跳过集合、基线及额度，不反向改写它们。准备器只取源码、统计与 META，不形成结论；每仓库就绪即准备，单仓库失败不阻塞其他项。重跑原命令只复用提交、干净状态及四份材料摘要均正确的项。下载时限、日志与断点见[下载失败与材料准备恢复](references/SESSION-OPERATIONS.md#下载失败与材料准备恢复)。

准备器首次固定同一远端提交的 npm／Git 缓存，同轮重试复用；只复用契约允许的新鲜字段，保留真实采集时间与 commit/blob。缓存失败按规则回源并报告，不填0。失败不自动持久 block；确认具体受阻后由父 Agent 登记，继续其余已选项。

### 3. 分派单插件洞察

按下方[多 Agent 协作](#多-agent-协作)，将每项稳定 ID、固定提交、检查时间、深度、独占目录和当前相关分析／证据交给子 Agent，执行[洞察 Skill](../dsh-plugin-insight/SKILL.md)。所选更新项和新项均完整分析；未变项只保留，不伪造完成。同轮已完成且摘要正确的项跳过。

### 4. 验收并暂存

对照每项 PLAN，按问题 ID 读完整回答、证据、未知项与状态，检查贡献、质疑、假设和建议的推导。核对真实条目类型、身份、固定版本、材料摘要、findings 复核及两轴创新和四项采用评分；不能只核字段、题数和总分。确认完整问题对象与必要原件已自包含保存。

收到交付后将 `{ id, observations, report, display }` 数组保存为本轮 `DELIVERIES.json`，先预检查并绑定完整交付：

```sh
npm run acceptance -- prepare --work <WORK.json> --input <DELIVERIES.json> --out <BUNDLE.json>
npm run acceptance -- read --bundle <BUNDLE.json> --plugin <id>
npm run acceptance -- read --bundle <BUNDLE.json> --plugin <id> --question Q01
```

读取总览、计划和全部问题；不能将预检查通过、行号合法或模型自报作为语义验收。关键依赖仍需定向补查；补充原件必须独立读取和记录，不能只检查通常的源码问题数组。按[验收决定结构](references/HOW-TO-ACCEPT-RESEARCH.md#提交验收决定)撰写逐题决定、整体理由和依赖核查，发现缺口退回 worker。材料修订后用新文件名重新 prepare 和验收，旧决定不得复用。

```sh
npm run acceptance -- submit --bundle <BUNDLE.json> --input <REVIEWS.json> --out <DECISIONS.json>
npm run acceptance -- stage --bundle <BUNDLE.json> --decisions <DECISIONS.json>
```

验收入口复用现有 `stage-batch` 的 `stageRecords`，父 Agent 串行写 WORK；任何 revise、漏题、未核查补充材料或交付变化都拒绝暂存，正式快照保持不变。可将已就绪的一项或多项组成独立批次，不等待整轮。DISPLAY 仍为单项 metadata、summaries、capabilities、advice，不维护独立推荐名单。旧 `snapshot stage`／`stage-batch` 保留兼容，不能作为本流程跳过语义决定的退路。

受阻项保存稳定 `reason_code`、可读 reason、自包含问题详情，再 `block --work ... --plugin ... --input <reason.json>`；批量用 `block-batch` 的 `{ id, input }` 数组。保留有效旧成果，不用本轮 pending／blocked 将旧记录移出展示。

### 5. 汇总候选与采用结论

跨插件比较必须有实际依据并登记依赖；共性机制只形成有推导的假设，不从多个相似介绍推断需求。推荐评分复用已有问题，各项说明材料、反证与相邻档取舍；三句理由需能回答谁做什么、比原办法好在哪、何时退出。

核对全部当前有效研究的推荐有效性，保留未失效旧结论；不声称未实际复核对象已按新判据重评。仅定向复核推荐由 `snapshot assess-recommendations` 事务处理，不伪造新研究或刷新研究时间。META 按需独立刷新，不能在本轮合并前改写正式基线。

### 6. 计划、合并并生成

所有已选项 complete 或有具体持久 block 后，形成 plan，检查基线、合并范围、保留项与依赖，再 apply：

```sh
npm run snapshot -- plan --work <WORK.json> --out /tmp/dsh-snapshot-plan.json
npm run snapshot -- apply --plan /tmp/dsh-snapshot-plan.json
npm run check
```

基线漂移时重新读并处理冲突，不覆盖并发修改。提交点前保留旧快照；提交后回读事务标识和摘要。生成失败按恢复规则单独 render，不重复研究或追加观察。原件与引用必须落入当前快照，不能依赖待清理 runs。

### 7. 检查实际成果

从合并后全部有效组件生成 README 前5项、推荐页前50项、分类和详情；不为凑数升级推荐。按输出标准回读首页、三栏列表、分类和长短详情样例，核对数量、分类固定顺序、源码版本、完整回答、链接、条件与未验证状态。生成一致性通过不证明目标插件可用。

### 8. 回写双清单，确认后清理

`npm run check` 通过并回读正式成果后，依次执行：

```sh
npm run export:meta-manifests -- --work <WORK.json>
npm run export:meta-manifests -- --work <WORK.json> --apply
npm run export:meta-manifests -- --work <WORK.json>
```

预览须确认 npm／Git 已有、新增、保留历史、输出及删除数0，并报告输入组件、唯一仓库、已核实与缺失 npm 身份范围。Git 覆盖整轮固定 INPUT，不限已研究项；npm 只用核实包名。两份清单固定同一远端提交、以单个提交更新并回读；内容未变不制造提交。最后只读结果必须两份均 `changed: false`。

目标为私有 `thundax-lyp/dsh-plugin-meta` 的 `NPM-MANIFEST.jsonl` 与 `GIT-MANIFEST.jsonl`；身份、并发、文件未部署或任一回读失败均保留 WORK 并报告，不能回退旧文件名、扩大写入或清理本轮材料。详见[双清单契约](../_shared/references/DATA-CONTRACT.md#外部-meta-双清单回写)。

确认后 `snapshot clean --work ...` 预览，再加 `--apply` 只删已合并且全部完成的已知材料；失败、未知文件及活动锁保留。当前快照须能独立校验和生成。另行报告完成／本轮受阻、冷却跳过、正式同版本受阻跳过和来源缺口；所选范围完成不表示全生态研究完成。

## 多 Agent 协作

| 角色 | 写入范围 | 完成判据 |
| --- | --- | --- |
| 父 Agent | 来源、固定队列、WORK、正式快照与发布页面 | 逐题验收后串行 stage，统一 plan／apply、生成检查、清单回读 |
| 子 Agent | 分配组件的独占本轮材料、问题、分析、观察与展示输入 | 完整可核对交付；受阻保留材料、原因和下一步 |

单项也由子 Agent 执行。分派互不重叠的稳定 ID 与目录，提供同一固定基线的相关原稿、证据和依赖；WORK 读取器没有并发认领语义。子 Agent 不扩展候选、不 stage／plan／apply、不改共享或正式文件、不提交、不再委派。父 Agent 不用通用段落替代逐项研究；发现问题退回修正，不直接继承自报结论。基线漂移按冲突流程处理。

## 职责与授权

本 Skill 不自动安装、安排周期任务、提交或推送本工程、创建 PR 或对外发布；唯一例外是第8步限定目标的两份清单 API 同步。不删除远端历史包／仓库，不因规范更新迁移正式数据。只有用户明确要求丢弃研究时才走数据契约的 `snapshot forget` 预览／apply，不以受阻状态触发。

## 读者页面重新生成

明确要求重排或重新生成时，执行[专用流程](references/HOW-TO-REGENERATE-PAGES.md)。只读当前档案，以输出标准和模板组织三层阅读入口、成品语言和详情；`render:research` 后运行 `check` 并回读代表样例，不制造研究观察或改变证据等级。
