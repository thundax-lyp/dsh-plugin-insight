# dsh-visualize

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[b094643](https://github.com/Nagi-ovo/dsh-visualize/tree/b0946439d4dfe0ab8c66d25053e56383f3b487fd)

<!-- BEGIN META -->
[![GitHub ★ 335](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=335&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-visualize) [![npm 30d 6,080](https://img.shields.io/static/v1?label=npm+30d&message=6%2C080&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-visualize)
<!-- END META -->

> **功能**：在 DSH 对话中生成、更新交互式 HTML 卡片与独立页面，支持图片嵌入和本机交互状态保存。

> **亮点**：它把生成片段、沙箱展示、精确局部修订和会话重放接在同一对话内，读者选择还能在审阅后变成下一条问题；相对保存 HTML 再打开的流程，具体增量是减少文件交接并保持修订入口。浏览器、图表库与模型本身的能力不算本组件原创，实际理解效果仍未知。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：能展示、能修补不等于解释正确。检查器允许未改动的旧问题随警告保留，自修复只有有限启发式提醒；公式、数据和关键图片仍需用户核对。按会话分目录也不构成会话授权隔离，更新入口接受整个可视化根下的 HTML 路径，因此共享主目录场景需另验边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 哪些解释任务需要卡片，结果如何从模型调用进入对话并重放？](#detail-section-11)
  - [Q02 · 沙箱、图片与交互桥是否约束实际权限，失败时发生什么？](#detail-section-12)
  - [Q03 · 更新、自我修复与持久化相对手动 HTML 流程有什么增量？](#detail-section-13)
  - [Q04 · 启动、持续使用及退出需要哪些依赖和成本？](#detail-section-14)
  - [Q05 · 什么新方向值得验证，谁可在什么停止条件下试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 DSH Web 中讲解算法、比较参数或讨论界面原型的人，把模型生成的 HTML 直接作为可交互卡片交付。合格结果须能按已知规则交互且可回读，具体场景依据与边界见 [Q01](#research-q01)。

直接替代流程是模型输出 HTML、用户保存文件并另开浏览器，或只交付静态图。前者可以独立运行和归档，却需要用户交接文件；后者更适合无需交互的结论。这里比较的是交付与修订机制，本次未检查当前宿主所有原生可视化能力，也未实测端到端速度，不宣称优于全生态方案。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| visualize 工具创建 | 在对话内交付交互 HTML，可选宽卡和页面模式 | Web浏览器部分与模型片段必需，默认片段大小上限1000000字节 |
| visualize 工具更新 | 对副本做唯一文本替换 | 需原副本和精确匹配，不可并发更新，已有未触及问题可能保留为警告 |
| visualize Skill | 提供片段、主题与资源编写契约 | 需宿主Skill服务，不是Agent定义 |
| 图片嵌入 | 读工作区图片或下载公网图片用于卡片 | 受路径、地址、数量、体积与超时限制，缺路由按图降级 |
| 输入框草稿桥 | 把读者选择变为可审阅问题 | 较新宿主输入接口，仅草稿，不代发消息，不覆盖用户已改草稿 |
| 本机交互状态 | 保留滑块、选择及自定义状态 | 同浏览器同站点，限额淘汰，新窗口不回写，不是业务数据库 |
| 有限自修复提醒 | 在回合停止前提示模型补调用或修正特定问题 | 需宿主停止事件与steer，每回合最多两次，不保证修复成功 |
| 可视化设置 | 选择内置风格并编辑风格偏好 | 设置与文件编辑依赖较新宿主接口，可降级为手动配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 工具、Skill、文件系统服务及兼容 Cordis | 启动必需 | 注册工具、编写契约和文件访问 | 服务缺失无法按入口注册；包peer范围与作者兼容声明不等于实测 |
| DSH Web 客户端 slots 与 React | 交互展示必需 | 渲染工具卡片和生成预览 | TUI及缺浏览器部分退化为文本结果 |
| 较新宿主 connection、二进制文件和会话输入接口 | 图片或草稿桥必需 | 提供图片路由、工作区图片和写入草稿 | 各能力按接口探测降级，图片会报告无法交付 |
| 能生成正确片段的模型、可信数据与人工核对 | 效果必需 | 形成符合任务规则的交互解释 | 结构检查和自修复不能补足错误公式 |
| 片段使用的图表库或字体 CDN | 按片段可选 | 静态资源加载 | 网络不可达时对应组件可能失效；当前在线状态未知 |

实际调用与作者版本声明的区别见 [Q04](#research-q04)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户将固定插件加入 web profile，并重启刷新 | 配置包含插件，工具及浏览器卡片均出现；缺一端先排查服务版本 |
| 生成 | 模型加载 visualize 编写契约，再传入 HTML 片段 | 返回有正文元数据的卡片；检查拒绝则修正，图片失败按报告处理 |
| 修订 | 模型对现存副本执行唯一文本替换 | 新片段重新检查；不匹配时依据真实副本调整，不并发更新 |
| 验收 | 用户调一个已知参数、核对结果与刷新状态 | 结果与已知规则一致；反复修补、关键图片缺失或公式错误时退回静态材料 |

具体状态层次及失败副作用见 [Q03](#research-q03)、[Q04](#research-q04)。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、模型与存储资源，实际金额未知 | 安装、版本对齐、已知样例核对，耗时未知 | 兼容区间为作者声明 |
| 持续使用 | 生成和修复模型调用、卡片及图片存储 | 数据、公式和交互复核 | 未测任务频率、token或合格率 |
| 失败恢复 | 重试调用及可能重取图片 | 区分正文、副本、素材与浏览器状态，必要时重建 | 单文件原子不等于正文与图片清单事务 |
| 退出或迁移 | 需保留的素材与独立文件存储 | 保存重要参数并分别处理插件配置、磁盘和站点状态 | 无自动跨设备迁移依据 |

计量以正确交互且已核对公式的一张卡片为合格任务，包含全部重试与复核；当前没有合格任务数据，不能计算单位成本。见 [Q04](#research-q04)。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 对话内交付 | 源码接线将 HTML 放入工具元数据并由浏览器渲染 | 实际宿主、模型组合的可用率 |
| 局部修订 | 唯一匹配补丁及重新检查已实现 | 相对完整生成的净token和时间收益 |
| 有限继续修复 | 停止边界最多两次steer，指纹去重 | 修复成功率、误报和净效果 |
| 交互状态恢复 | 本机同站点存储，受配额和淘汰限制 | 跨设备延续，不应依赖其保存重要业务输入 |
| 讲解正确性 | 用户可交互探索 | 无同条件理解效果、计算正确率或端到端节时证据 |

机制、作者描述和未实测效果的界线见 [Q01](#research-q01)至[Q04](#research-q04)。

> **思考**：能展示、能修补不等于解释正确。检查器允许未改动的旧问题随警告保留，自修复只有有限启发式提醒；公式、数据和关键图片仍需用户核对。按会话分目录也不构成会话授权隔离，更新入口接受整个可视化根下的 HTML 路径，因此共享主目录场景需另验边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把生成片段、沙箱展示、精确局部修订和会话重放接在同一对话内，读者选择还能在审阅后变成下一条问题；相对保存 HTML 再打开的流程，具体增量是减少文件交接并保持修订入口。浏览器、图表库与模型本身的能力不算本组件原创，实际理解效果仍未知。见 [Q01](#research-q01)、[Q03](#research-q03)。

值得借鉴的实现是结果元数据与可编辑副本分工、精确补丁的唯一性检查、父页面核对message来源和草稿归属、实际DNS连接处检查图片地址。它们分别处理重放、修订定位、用户发言控制和服务端下载边界。原子写只覆盖单文件，目录布局不等于会话授权，自修复不等于内容验收；移植需要复现宿主事件和客户端作用域，不能直接复制工具描述。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

能展示、能修补不等于解释正确。检查器允许未改动的旧问题随警告保留，自修复只有有限启发式提醒；公式、数据和关键图片仍需用户核对。按会话分目录也不构成会话授权隔离，更新入口接受整个可视化根下的 HTML 路径，因此共享主目录场景需另验边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在个人、非敏感会话中用一张已知答案的卡片检查参数变化、刷新和局部修订。重要输入另存为可核验文件，关键图片缺失或计算不符时停止卡片扩展；共享主目录和跨设备业务表单另验权限与存储。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码，确认对话卡片和修订链路的实现，交付流程增量属于有材料支持的解释性判断。权限门禁仅陈述本组件范围，不承诺真实宿主安全或兼容。会话内标识与版本校验属于未实现、未验证的工程假设。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、src/index.ts、src/tool.ts、src/fragment.ts、src/client/index.tsx、src/client/VisualizeCard.tsx、src/client/prompt-bridge.ts、src/client/card-state.ts、src/window-doc.ts、src/shell.ts、src/images.ts、src/storage.ts、src/skill.ts、src/lint-gate.ts、src/self-repair.ts、src/viz-helper.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查服务端与浏览器注册、工具create/update、正文/图片存储、沙箱与消息桥、状态恢复及自修复。未全审全部lint规则、所有CDN库、宿主认证、构建JS与源码逐字一致性或npm制品对应关系；没有对外部网络状态作当前可用性承诺。
- 下一步：优先在固定模型和已知答案任务中比较静态图、独立HTML与对话卡片，记录正确率、人工核对时间、全部修复步骤和token；所有权假设另用两会话与陈旧版本输入核对拒绝结果和原件不变。上述实验均未执行，见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize)
- **版本号**：0.1.8（[固定提交 b094643](https://github.com/Nagi-ovo/dsh-visualize/tree/b0946439d4dfe0ab8c66d25053e56383f3b487fd)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

从创建按会话分目录、更新按全局根接受路径的差异，可推导尚未验证的会话内卡片标识方案。宿主签发卡片标识，并在更新时核对会话归属与预期内容版本，可能缩小跨会话误改和陈旧补丁覆盖，同时保留局部修订便利；代价是迁移、分享与旧路径兼容。用两会话的合法更新、越界标识、过期版本三组请求检验是否明确拒绝且原件不变，再比较正常操作负担；已有等价宿主隔离或兼容负担过高都会削弱增量。见 [Q05](#research-q05)。

优先在固定模型和已知答案任务中比较静态图、独立HTML与对话卡片，记录正确率、人工核对时间、全部修复步骤和token；所有权假设另用两会话与陈旧版本输入核对拒绝结果和原件不变。上述实验均未执行，见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 710 | — | — | 10118 |
| .js | source | 2 | 8476 | 6361 | 2261 | — |
| .ts | source | 27 | 7469 | 4737 | 2291 | — |
| .tsx | source | 6 | 2017 | 1353 | 517 | — |
| .ts | test | 20 | 3824 | 3140 | 388 | — |
| .tsx | test | 8 | 1397 | 1126 | 130 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-visualize/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-visualize/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-visualize/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对话内交互卡片能否形成可控、可恢复的解释交付，相对保存HTML再打开的流程增加了什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些解释任务需要卡片，结果如何从模型调用进入对话并重放？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向已经在 DSH Web 对话中解释算法、比较参数或讨论界面原型的人。作者以可调参数的排序算法、筛选看板和模拟器说明用途；这证明预期场景，不能证明这些人已反复采用。合格交付应当是读者能调参数、看到与已知规则一致的结果，刷新后仍能重读说明。单张静态图、精确导出或需要联网业务写回的任务，未必值得引入可执行 HTML。

接线同时包含宿主插件和浏览器插件。服务端 apply 注册 visualize 工具与 visualize Skill；Skill 不是一组 Agent，而是模型可加载的 HTML 编写契约。create 把 fragment 直接传给工具，先检查再写副本；presentationMeta 把 fragment、标题、模式、路径和图片引用放入持久工具结果。浏览器按 visualize 键注册工具卡片，并注册输入区预览与回合末卡片。因此它相对“模型给代码、用户保存 HTML 再开浏览器”的增量，是把生成、展示和后续修订放在同一个会话中，而非新的图表算法。

普通卡片与 page 模式使用同一渲染入口，page 会变为启动卡片。HTML 正文能由结果元数据重放，磁盘副本用于后续 update；外置图片仍需图片存储和服务，不能将正文重放误解为全部素材永不丢失。TUI 或缺少浏览器部分的客户端只能退化为工具结果文本。广泛宿主兼容属于作者声明，本次只确认版本探测和注册代码。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-44](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/README.md#L32-L44)

作者说明预期任务、模式、正文重放和图片依赖；用途和兼容声明不等于实际用户或运行验收。

<details>
<summary>查看原文（13行）</summary>

```text
兼容 DSH 0.1.1-rc.2 到 0.2.2-rc.1。

## 怎么用

直接告诉模型你想看什么，例如「做一个能调参数的排序算法可视化」。模型调用 `visualize`，把整段 HTML fragment 直接作为 `fragment` 参数传入（可选 `title`、`mode`），卡片在模型生成参数时就开始渲染。适合并排比较的内容可以使用 `mode: "wide"`。要修正已经画出的卡片，模型用 `action: "update"` 加上卡片的 `path` 和一处 `old_str` → `new_str` 替换，不必重发整段 markup；`path` 只用于 `update`。

要做的东西比一张聊天卡片大时，比如带筛选的数据看板、多视图工具、全屏模拟或完整的桌面端 mockup，模型会用 `mode: "page"` 做一个独立页面。对话里显示一张启动卡片：标题、一行说明（`summary` 参数）、页面的实时缩略图和「打开页面」按钮，点按钮后页面在新标签页里全尺寸打开。浏览器拦下新标签页时，可以点「在对话中展开」直接在对话里查看。用 `update` 改过页面后，已经打开的标签页不会自动刷新，再点一次「打开页面」即可。

卡片会跟随 DSH 的明暗主题，默认风格使用鲸鱼蓝配色（其他风格见下文）。聊天栏放不下时，点卡片标题行右侧的「在新窗口打开」按钮，可以在新标签页里全尺寸查看，页面沿用打开那一刻的主题，内容仍在同样的 sandboxed iframe 里运行。会话重放时，页面从持久化的工具结果恢复，不依赖原始 fragment 文件仍然存在。

每张卡片的 fragment 另存一份到 `~/.dsh/visualize/sessions/<会话 id>/<标题>-<hash>.<style>.html`（设置了 `DSH_HOME` 时在 `$DSH_HOME/visualize/` 下），按会话分开，不写进你的项目目录，`git status` 不会出现 `viz/`。`update` 改写的就是这份文件。旧版本写在工作区 `viz/` 下的卡片仍然可以 `update`，原地修改。插件不会自动清理这些文件，需要时可以直接删除 `~/.dsh/visualize/`，已有会话的卡片照常重放。

卡片也能显示它自己加载不了的图片：agent 刚存进工作区的图（matplotlib 画的 PNG、论文里的 figure），或者任意公开的网络图片。模型写 `<img data-viz-src="figs/loss.png">` 或 `<img data-viz-src="https://…">`，调用执行时插件读取文件或下载图片，确认内容确实是 PNG、JPEG、GIF、WebP 或 SVG（单张不超过 5 MB，每张卡片合计不超过 12 MB、最多 16 张），然后存到卡片旁边的 `~/.dsh/visualize/sessions/<会话 id>/images/`。卡片渲染时从那里取图，所以模型的上下文和会话日志里都没有图片字节，日志里每张图只记一条很短的引用。某张图失败时，卡片在原位显示一个带 alt 文字的占位框，其余部分照常渲染；工具结果会告诉模型哪张图失败、原因是什么，方便它改路径。用 `update` 改卡片时，已经下载过的网络图片直接复用，工作区文件重新读取，所以重新生成的图在下一次修改后就会显示出来。这项功能需要 DSH 0.1.7 及以上；更早的版本里卡片只显示占位框，工具结果会说明原因。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:75-94](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/index.ts#L75-L94)

宿主将工具、Skill、设置与自修复真正注册。

<details>
<summary>查看原文（20行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const style = () => readStyle(config.style)
  const imageRoute = registerImageRoute(ctx)
  const images = { delivery: () => imageRoute.ready }
  // The tool's description names the style, so it is rebuilt when the
  // setting changes; calls already read the style per call.
  let toolStyle = style()
  let disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style, images))
  const events = ctx as unknown as { on(name: 'loader/volatile-update', listener: () => void): unknown }
  events.on('loader/volatile-update', () => {
    if (style() === toolStyle) return
    disposeTool()
    toolStyle = style()
    disposeTool = ctx.tools.register(visualizeTool(ctx, config.maxFragmentBytes, style, images))
  })
  ctx.skills.registerProvider(() => visualizeSkillProvider(style, cwd => styleFileLocations(ctx, cwd)))
  injectPageConfig(ctx, style)
  registerStyleFiles(ctx)
  declineGeneratedSettingsPage(ctx)
  if (config.selfRepair !== false) installSelfRepair(ctx)
```

</details>

**依据 3 · 源码核查**：[src/tool.ts:195-207](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/tool.ts#L195-L207)

持久化元数据携带HTML正文与图片引用，支持区分正文和素材的重放边界。

<details>
<summary>查看原文（13行）</summary>

```text
      // Project the fragment into persisted meta so the card survives replay:
      // the canonical value is not on the wire, only content + meta are.
      presentationMeta: (_args, value) => ({
        kind: 'visualize',
        fragment: value.fragment,
        title: value.title,
        mode: value.mode,
        path: value.path,
        ...value.summary === undefined ? {} : { summary: value.summary },
        style: value.style ?? DEFAULT_STYLE,
        // References only; the card fetches the bytes from the image route.
        ...value.images?.length ? { images: value.images } : {},
      }),
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:75-112](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/index.tsx#L75-L112)

浏览器注册实际工具卡片、流式预览和回合末卡片。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // A session-scope registration's inject receives the session id; the sink
  // it builds lets a settled card put `dshViz.prompt` text into the composer,
  // and the id keys the card's saved state.
  ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
    {
      name: 'tool.call.toolview',
      key: 'visualize',
      inject: (sessionId: unknown) => sessionInjection(promptSinkFor(ctx, sessionId), sessionId),
    },
    VisualizeCard,
  ))
  // The dock reads the argument stream from Turn data the stream Definition
  // folds; without the registry (dsh 0.1.1) it reads the session partial. The
  // dock is declared while the Conversation service is still being built, so
  // the Definition waits on the service itself and lives with that fiber.
  ctx.inject(['uiConversation'], (scope: ClientContext) => {
    conversationEvents(scope)?.register(streamDefinition as ConversationNodeDefinition)
  })
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    { name: 'conversation.input.dock', id: 'visualize-stream', order: 30 },
    StreamingPreview,
  ))
  // The Chat target declares the turn tail after its own settings and the
  // Conversation registry are up, so both are resolvable here.
  ctx.slots.inject('conversation.chat.turnTail', () => {
    const events = conversationEvents(ctx)
    if (events === undefined) return () => undefined
    const disposeDefinition = events.register(turnCardsDefinition as ConversationNodeDefinition)
    const disposeTail = ctx.slots.register(turnTailOptions(ctx), TurnCards)
    return () => {
      disposeTail()
      disposeDefinition()
    }
  })
  // 设置 → 可视化: the card style picker and the user's style files.
  registerSettingsSection(ctx)
}
```

</details>

**依据 5 · 源码核查**：[src/client/VisualizeCard.tsx:379-401](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/VisualizeCard.tsx#L379-L401)

渲染器实际区分page启动卡和内联卡片。

<details>
<summary>查看原文（23行）</summary>

```text
export function Frame({ meta: persisted, callId, prompt, stateKey }: FrameProps) {
  // Every surface below builds from this meta, images already embedded.
  const meta = useCardImages(persisted)
  if (meta === undefined) return <div style={headerStyle}>{persisted.title} · {loadingImagesLabel()}</div>
  if (meta.mode === 'page') return <PageLauncher meta={meta} callId={callId} prompt={prompt} stateKey={stateKey} />
  const label = openLabel()
  return (
    <div style={cardStyle}>
      <div style={headerStyle} title={meta.path === '' ? meta.title : meta.path}>
        <span style={titleStyle}>{meta.title}</span>
        {meta.path !== '' && <span style={pathStyle}>{meta.path}</span>}
        <button
          type="button"
          style={openStyle}
          aria-label={label}
          title={label}
          onClick={() => openInWindow(meta, callId, stateKey)}
        >
          <OpenIcon />
        </button>
      </div>
      <SizedFrame meta={meta} callId={callId} prompt={prompt} stateKey={stateKey} />
    </div>
```

</details>

#### 缺口

- 没有真实解释任务的采用频率或理解效果对照。
  **影响**：不能从作者举例推出持续需求或节时。
  **进一步探讨**：用同一算法任务比较纯文字、独立HTML与对话卡片，记录答案正确率、操作次数及完成时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 沙箱、图片与交互桥是否约束实际权限，失败时发生什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

浏览器执行模型代码的范围受到显式约束。卡片和新窗口都用只含 allow-scripts 的 iframe sandbox，未授予同源权限；卡片文档另设 CSP，禁止普通网络连接、子框架、对象和表单提交，但允许内联脚本、求值及列明 CDN 的静态资源。因此这里的沙箱是权限分隔设计，并不是脚本正确性证明，也不是完全离线或不信任任何第三方脚本的环境。

输入框桥的门禁在父页面执行。消息须来自本卡片 contentWindow，带对应 token，并在 iframe 获得焦点及可用的用户激活状态下才处理；还有限长和限频。桥调用的是 setDraft，输入框已有用户自行编写或修改的草稿时保留原文，没有代用户发送消息的调用。这把一次卡片选择转为用户可以审阅的下一条问题，不能将它说成自动执行业务指令。

图片另走服务端受控读取。工作区图片同时检查规范路径与 fs.contains；网络图片每次跳转重查协议、凭据和目标地址，实际 socket DNS lookup 拒绝非公网地址，避免仅先解析再连接的检查空隙。默认单图5MiB、每卡12MiB、16图、每URL10秒和最多3跳。某图失败形成逐图报告而不拒绝整个片段；因此缺关键图片的卡片仍可能被展示，用户必须检查占位符而不能只看工具成功。

存储还有一个会改变部署建议的边界。create 按会话建目录，open 却只把路径限制在整个 visualize 根目录，随后直接用 Node 文件系统读写，没有将目标目录与调用会话ID比较。这是源码可确认的路径授权范围；若另一个会话的卡片路径被提供，插件自身没有会话归属门禁。它不等于已证明真实宿主存在跨用户利用，也不说明普通单用户使用已发生泄露；宿主身份和部署边界不在本组件中得到证明。共享主目录或多用户隔离场景不应依据“按会话分目录”认定安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/window-doc.ts:19-20](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/window-doc.ts#L19-L20)

沙箱标志只有allow-scripts。

```text
/** Sandbox flags shared by the in-chat card and the windowed page. */
export const FRAME_SANDBOX = 'allow-scripts'
```

**依据 2 · 源码核查**：[src/window-doc.ts:52-63](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/window-doc.ts#L52-L63)

新窗口仍把内容放入同样沙箱而非直接运行在顶层。

<details>
<summary>查看原文（12行）</summary>

```text
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>${escapeHtml(options.title)}</title>
<style>
:root { color-scheme: ${options.colorScheme}; background: ${background}; }
html, body { margin: 0; height: 100%; }
iframe { display: block; box-sizing: border-box; width: 100%; height: 100%; border: 0; padding: ${inset}; background: transparent; color-scheme: ${options.colorScheme}; }
</style>
</head>
<body><iframe sandbox="${FRAME_SANDBOX}" referrerpolicy="no-referrer" title="${escapeHtml(options.title)}" srcdoc="${escapeHtml(options.frameDoc)}"></iframe></body>
```

</details>

**依据 3 · 源码核查**：[src/shell.ts:24-48](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/shell.ts#L24-L48)

CSP禁止普通连接和表单，保留CDN、内联脚本及求值能力。

<details>
<summary>查看原文（25行）</summary>

```text
  'https://cdn.jsdelivr.net',
  'https://esm.sh',
  'https://fonts.bunny.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://unpkg.com',
] as const

const RESOURCE_SOURCES = ['blob:', 'data:', ...RESOURCE_ORIGINS].join(' ')

/** The frame document's Content-Security-Policy. */
export const FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  'connect-src blob: data:',
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')
```

</details>

**依据 4 · 源码核查**：[src/client/VisualizeCard.tsx:311-327](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/VisualizeCard.tsx#L311-L327)

父页面核对消息来源、token、用户交互和频率后调用桥。

<details>
<summary>查看原文（17行）</summary>

```text
function usePromptRelay(frameRef: RefObject<HTMLIFrameElement | null>, token: string, prompt: PromptSink | undefined) {
  const lastAt = useRef(-Infinity)
  useEffect(() => {
    if (prompt === undefined) return
    const onMessage = (event: MessageEvent) => {
      const frame = frameRef.current
      if (frame === null || event.source !== frame.contentWindow) return
      const text = readPromptMessage(event.data, token)
      if (text === undefined || !readerIsInFrame(frame)) return
      const now = performance.now()
      if (now - lastAt.current < PROMPT_INTERVAL_MS) return
      lastAt.current = now
      prompt(text)
    }
    addEventListener('message', onMessage)
    return () => removeEventListener('message', onMessage)
  }, [frameRef, token, prompt])
```

</details>

**依据 5 · 源码核查**：[src/client/prompt-bridge.ts:84-108](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/prompt-bridge.ts#L84-L108)

检查用户激活、忙碌和既有草稿，仅调用setDraft。

<details>
<summary>查看原文（25行）</summary>

```text
export function readerIsInFrame(frame: HTMLIFrameElement): boolean {
  if (frame.ownerDocument.activeElement !== frame) return false
  const activation = (navigator as { userActivation?: { isActive?: boolean } }).userActivation
  return typeof activation?.isActive !== 'boolean' || activation.isActive
}

/**
 * Put prompt text into the composer when it is idle and holds nothing of the
 * reader's own: empty, or exactly what a card drafted there last.
 * @param input - the session's input facade.
 * @param text - cleaned prompt text.
 * @param carded - the text a card last drafted in this session, if any.
 * @returns the outcome.
 */
export function draftPrompt(input: ComposerInput, text: string, carded?: string): PromptOutcome {
  const state = input.state?.getSnapshot()
  if (state?.phase !== undefined && state.phase !== 'plain') return 'busy'
  const draft = state?.draft?.trim() ?? ''
  if (draft !== '' && draft !== carded) {
    input.notify?.('info', keptDraftNotice())
    return 'kept-draft'
  }
  input.setDraft(text)
  input.focus?.()
  return 'drafted'
```

</details>

**依据 6 · 源码核查**：[src/images.ts:57-63](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/images.ts#L57-L63)

默认下载与容量门限。

```text
export const DEFAULT_IMAGE_LIMITS: ImageLimits = {
  maxImageBytes: 5 * 1024 * 1024,
  maxCardBytes: 12 * 1024 * 1024,
  maxImages: 16,
  timeoutMs: 10_000,
  maxRedirects: 3,
}
```

**依据 7 · 源码核查**：[src/images.ts:325-353](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/images.ts#L325-L353)

工作区路径包含检查和文件类型/大小检查的实际调用。

<details>
<summary>查看原文（29行）</summary>

```text
export function workspaceImageReader(ctx: Context, root: string | undefined): FileReader {
  return async (path, signal, maxBytes) => {
    if (root === undefined) throw new ImageError('this conversation has no workspace to read files from')
    if (path === '~' || path.startsWith('~/')) {
      throw new ImageError('~ is not expanded; give the path relative to the workspace root')
    }
    const base = resolvePath(root)
    const lexical = resolvePath(base, path)
    if (!inside(base, lexical)) throw new ImageError('outside the workspace; only files inside the workspace can be embedded')
    const fs = ctx.fs as unknown as Partial<BinaryFs> | undefined
    if (typeof fs?.resolve !== 'function' || typeof fs.contains !== 'function'
      || typeof fs.stat !== 'function' || typeof fs.readBytes !== 'function') {
      throw new ImageError('this dsh host cannot read binary workspace files; save the image somewhere with an https URL instead')
    }
    const opts = { cwd: base, signal }
    const [rootTarget, target] = await Promise.all([fs.resolve(base, opts), fs.resolve(lexical, opts)])
    if (!fs.contains(rootTarget, target)) {
      throw new ImageError('resolves outside the workspace through a symlink; only files inside the workspace can be embedded')
    }
    // Accepted: a symlink swapped in between contains() and readBytes() could
    // still redirect the read. Doing that needs write access to the
    // workspace, which the agent already has along with tools that read
    // anything this could.
    const info = await fs.stat(target, signal)
    if (info === undefined) throw new ImageError('not found in the workspace; check the path relative to the workspace root')
    if (info.type !== 'file') throw new ImageError('not a regular file')
    if (info.size !== undefined && info.size > maxBytes) throw new TooLarge()
    try {
      return await fs.readBytes(target, signal, maxBytes)
```

</details>

**依据 8 · 源码核查**：[src/images.ts:439-472](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/images.ts#L439-L472)

逐跳重新检查并拒绝异常响应或超限。

<details>
<summary>查看原文（34行）</summary>

```text
export function urlFetcher(options: FetcherOptions): UrlFetcher {
  const policy = options.policy ?? publicOnly
  return async (url, signal, maxBytes) => {
    let current = url
    for (let hop = 0; ; hop += 1) {
      checkUrl(current, policy)
      const response = await get(current, policy, signal)
      const status = response.statusCode ?? 0
      // A body we do not read is destroyed, not drained: resume() would keep
      // pulling an unbounded one until the deadline. agent:false, so no
      // pooled socket is lost.
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.destroy()
        const location = response.headers.location
        if (location === undefined) throw new ImageError(`HTTP ${status} without a Location header`)
        if (hop >= options.maxRedirects) throw new ImageError(`more than ${options.maxRedirects} redirects`)
        current = parseUrl(new URL(location, current).href)
        continue
      }
      if (status !== 200) {
        response.destroy()
        throw new ImageError(`the server answered HTTP ${status}`)
      }
      const encoding = response.headers['content-encoding']
      if (encoding !== undefined && encoding !== 'identity') {
        response.destroy()
        throw new ImageError(`the server sent a ${encoding}-encoded body, which is not decoded here`)
      }
      const length = Number(response.headers['content-length'])
      if (Number.isFinite(length) && length > maxBytes) {
        response.destroy()
        throw new TooLarge()
      }
      return await readBody(response, maxBytes)
```

</details>

**依据 9 · 源码核查**：[src/images.ts:482-511](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/images.ts#L482-L511)

协议、凭据、IP及DNS解析结果门禁。

<details>
<summary>查看原文（30行）</summary>

```text
function checkUrl(url: URL, policy: AddressPolicy): void {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new ImageError(`redirected to a ${url.protocol} URL, which is not fetched`)
  if (url.username !== '' || url.password !== '') throw new ImageError('URLs with credentials are not fetched')
  const host = url.hostname.replace(/^\[|\]$/gu, '')
  const family = isIP(host)
  if (family !== 0 && !policy(host, family as 4 | 6)) throw new ImageError(blockedReason(url.hostname, host))
}

/** The SSRF refusal. */
function blockedReason(hostname: string, address: string): string {
  return `${hostname} is ${hostname === address ? '' : `${address}, `}a loopback, private or link-local address; `
    + 'card images are fetched from the public internet only — save a local image into the workspace and give its path'
}

/**
 * The guarded DNS lookup: every address a name resolves to must pass the
 * policy, or the connection fails before it is made.
 * @param policy - address policy.
 * @returns a `lookup` for `http.request`.
 */
function guardedLookup(policy: AddressPolicy) {
  return (hostname: string, options: LookupOptions, callback: (...args: unknown[]) => void): void => {
    dnsLookup(hostname, { ...options, all: true }, (error, addresses: LookupAddress[]) => {
      if (error !== null) return callback(error)
      const blocked = addresses.find(entry => !policy(entry.address, entry.family as 4 | 6))
      if (blocked !== undefined || addresses.length === 0) {
        return callback(new ImageError(blocked === undefined ? `${hostname} has no address` : blockedReason(hostname, blocked.address)))
      }
      if (options.all === true) return callback(null, addresses)
      callback(null, addresses[0]!.address, addresses[0]!.family)
```

</details>

**依据 10 · 源码核查**：[src/storage.ts:108-133](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/storage.ts#L108-L133)

create按sessionID分目录，open调用根范围ownedPath。

<details>
<summary>查看原文（26行）</summary>

```text
export function cardStore(ctx: Context, exec: CardExec): CardStore {
  const root = storeRoot(ctx)
  const sessionId = exec.agent?.session.id
  const workspace = workspaceFiles(ctx, exec)
  return {
    async create(name) {
      if (root === undefined || typeof sessionId !== 'string' || sessionId.length === 0) {
        return await workspace.open(`viz/${name}`)
      }
      return ownedFile(root, join(root, 'sessions', sessionSegment(sessionId), name))
    },
    images: root === undefined || typeof sessionId !== 'string' || sessionId.length === 0
      ? undefined
      : sessionImages(root, sessionSegment(sessionId)),
    workspaceRoot: workspace.root,
    async open(path) {
      const owned = root === undefined ? undefined : await ownedPath(root, path)
      if (owned !== undefined) return ownedFile(root!, owned)
      const legacy = await workspacePath(workspace.root, path)
      if (legacy === undefined) {
        throw new Error(
          `invalid visualization patch: ${JSON.stringify(path)} is not a card visualize can patch — pass the path `
          + 'a visualize call reported (a card in the session store, or a legacy viz/ .html copy inside the workspace)',
        )
      }
      return await workspace.open(legacy)
```

</details>

**依据 11 · 源码核查**：[src/storage.ts:218-257](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/storage.ts#L218-L257)

ownedPath只约束全局根和html后缀，ownedFile直接读写目标，不包含调用会话判断。

<details>
<summary>查看原文（40行）</summary>

```text
export async function ownedPath(root: string, path: string): Promise<string | undefined> {
  const expanded = path === '~' || path.startsWith('~/') ? join(homedir(), path.slice(1)) : path
  if (!isAbsolute(expanded)) return undefined
  const target = resolve(expanded)
  if (!inside(root, target) || !target.endsWith('.html')) return undefined
  // A symlink inside the store — the file or a directory above it — must not
  // carry a read or a write anywhere else.
  const real = await realpath(target).catch(async () => await realpath(dirname(target)).then(
    parent => join(parent, 'card.html'),
    () => undefined,
  ))
  // Nothing on disk yet: the card does not exist, and the read fails loudly.
  if (real === undefined) return target
  const realRoot = await realpath(root).catch(() => root)
  return inside(realRoot, real) ? target : undefined
}

/**
 * Whether `target` lies strictly below `root`.
 * @param root - absolute directory.
 * @param target - absolute path.
 * @returns true for a descendant, false for the root itself or anything outside.
 */
export function inside(root: string, target: string): boolean {
  const rel = relative(root, target)
  return rel.length > 0 && !rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel)
}

/**
 * A plugin-owned card file, read and written with node fs. Writes go through
 * a sibling temporary file and a rename, so a reader never sees half a card.
 * @param root - absolute store root, for the display form.
 * @param path - absolute file path below the root.
 * @returns the card file.
 */
function ownedFile(root: string, path: string): CardFile {
  return {
    displayPath: displayOf(path),
    read: async () => await readFile(path, 'utf8'),
    write: async content => await writeFileAtomic(path, content),
```

</details>

#### 缺口

- 真实宿主的用户身份、主目录共享策略及路由认证实现未核查。
  **影响**：不能将源码路径范围直接升级为已复现跨用户漏洞，也不能宣称多租户隔离。
  **进一步探讨**：在授权隔离环境中分别检查宿主身份、两个会话的文件权限和图片路由访问，再以明确拒绝结果验证边界。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 更新、自我修复与持久化相对手动 HTML 流程有什么增量？

**研究主题**：贡献与相对优势、缺陷与关键质疑、工程质量与复用

#### 完整回答

实际增量在持续修订和交付约束。update 读取现有副本，old_str 必须非空且恰好匹配一次，然后在同一路径写回；工具明确把update标为不可并发安全，create则可并发。相对于每次重新生成完整文件，它为小修订提供确定的文本定位，减少重新传入完整HTML的需要；尚无模型token账单或任务耗时对照，不能直接说更便宜或更快。

检查器会拒绝新引入的错误，已有错误若位于未改动处会转为警告，警告随成功结果返回。这是允许局部修补的取舍，意味着一次update通过不证明整张卡片符合全部规则。自修复监听持久会话事件，在回合停止前根据失败调用、部分破坏性交互警告、贴源码或只承诺绘图等事实发steer，要求模型继续步骤。每回合最多两次，同一指纹不重发，子Agent、被中断的信号及缺少宿主接口时不会继续。这里存在自主继续调用的宿主接线，但策略是启发式提醒而非自动修复成功保证；代码中对“用户要HTML代码”等请求有保守排除。

持久化分三层。工具结果保存正文，磁盘保存可更新副本及外置图片，浏览器localStorage保存用户交互。浏览器状态键包含会话与卡片路径，update保留路径使同一卡片可保留选择，重新create的内容寻址路径通常从默认值开始。状态大小按JSON字符串字符长度限制，每卡16×1024字符、全体256×1024字符，不能机械称为同量字节。超过总量会按修改时间淘汰旧卡片；存储拒绝时只留页内内存，刷新便失去。新窗口只读取快照，不回写浏览器状态。

可借鉴的是确定性小修订、检查结果进入模型反馈以及父页面拥有状态键。但用户有权把卡片用于其他场景，并不说明卡片拥有正确计算或跨设备数据交付能力。检查器主要围绕结构、资源和常见脚本问题工作，本次没有将其当作语义验证器；公式与数据依然由用户对照可信结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/fragment.ts:132-146](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/fragment.ts#L132-L146)

精确补丁拒绝零匹配、多匹配，只有唯一位置可替换。

<details>
<summary>查看原文（15行）</summary>

```text
export function applyFragmentPatch(base: string, oldStr: string, newStr: string): string {
  if (oldStr.length === 0) {
    throw new Error('invalid visualization patch: old_str is empty — pass the exact card text to replace')
  }
  const first = base.indexOf(oldStr)
  if (first === -1) {
    throw new Error(`invalid visualization patch: old_str does not appear in the card. ${nearestAnchor(base, oldStr)}`)
  }
  if (base.indexOf(oldStr, first + oldStr.length) !== -1) {
    throw new Error(
      `invalid visualization patch: old_str appears ${countOccurrences(base, oldStr)} times in the card — `
      + 'extend it with neighbouring lines until exactly one site matches',
    )
  }
  return base.slice(0, first) + newStr + base.slice(first + oldStr.length)
```

</details>

**依据 2 · 源码核查**：[src/tool.ts:209-246](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/tool.ts#L209-L246)

create并发安全、update不安全，并对实际修订片段重新检查。

<details>
<summary>查看原文（38行）</summary>

```text
    // A create writes only a content-addressed card file; concurrent
    // siblings target distinct names or identical bytes, so they cannot
    // conflict. An update reads a card before rewriting it, so parallel
    // updates would each patch a base the other has already superseded.
    isConcurrencySafe: args => (args.action ?? 'create') === 'create',
    async execute(args, exec) {
      const action = (args.action ?? 'create') as VisualizeAction
      // A page card's file name says so, so a patch that forgets to restate
      // the mode still re-renders a launcher rather than a 1280px page
      // squeezed into the chat column.
      const mode = modeOf(args.mode, args.path !== undefined && action === 'update' && args.path.endsWith(PAGE_SUFFIX))
      // Cards live in a per-session store under the harness home, outside the
      // user's project (see storage.ts); legacy `viz/` workspace copies from
      // earlier sessions stay patchable through the sandboxed fs seam.
      const store = cardStore(ctx, exec)
      // An update patches the stored copy, the one card state both halves
      // agree on: persisted meta is not readable from here, and the model's
      // own transcript may hold a fragment an earlier patch already replaced.
      // It rewrites that same file rather than deriving a new name, so a
      // second patch in the same reply builds on the first — a fresh path per
      // patch would leave later patches addressing a base already superseded,
      // and each would silently drop every edit but its own.
      let source: CardFile | undefined
      let fragment: string
      let base: string | undefined
      if (action === 'update') {
        source = await store.open(required(args.path, 'path', action))
        base = await source.read()
        fragment = applyFragmentPatch(
          base,
          required(args.old_str, 'old_str', action),
          present(args.new_str, 'new_str', action),
        )
      } else {
        fragment = required(args.fragment, 'fragment', action)
      }
      // Coded lint: errors throw (nothing renders or is written), warnings ride on the result.
      const { sizeBytes, warnings } = lint.check({ fragment, maxBytes: maxFragmentBytes, sessionId: exec.agent?.session.header?.id, base })
```

</details>

**依据 3 · 源码核查**：[src/lint-gate.ts:67-96](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/lint-gate.ts#L67-L96)

未触及的旧错误可降为警告，STOP是对模型的返回指引而非调度器硬预算。

<details>
<summary>查看原文（30行）</summary>

```text
  check(input: LintGateInput): LintGatePass {
    const { sizeBytes, findings } = lintFragment(input.fragment, input.maxBytes)
    const placed = input.base === undefined
      ? findings.map(finding => ({ finding, origin: 'new' as const }))
      : placeAgainstBase(findings, input.fragment, input.base, input.maxBytes)
    const blocking = (p: PlacedFinding): boolean => p.finding.severity === 'error' && p.origin !== 'preexisting'
    const errors = placed.filter(blocking)
    const warnings = placed.filter(p => !blocking(p))
    const patched = input.base !== undefined

    if (errors.length === 0) {
      if (input.sessionId !== undefined) this.streaks.delete(input.sessionId)
      return {
        sizeBytes,
        warnings: warnings.length === 0
          ? ''
          : `Lint warnings (the card rendered; patch these if they matter, positions are line:column in the ${patched ? 'patched card' : 'fragment'}):\n${formatFindings(warnings)}`,
      }
    }

    let message = formatRejection(errors, warnings, patched)
    if (input.sessionId !== undefined) {
      const stuck = this.recordRejection(input.sessionId, new Set(errors.map(p => p.finding.code)))
      if (stuck.length > 0) {
        const named = stuck.map(code => `${code} (${LINT_RULES[code].message})`).join('; ')
        message += `\n\nSTOP: ${stuck.join(', ')} has now rejected ${STOP_AFTER} visualize calls in a row. Do not call visualize again for this card. `
          + `Tell the user in your reply what is blocking it — ${named} — and ask how they want to proceed.`
      }
    }
    throw new Error(message)
```

</details>

**依据 4 · 源码核查**：[src/self-repair.ts:148-192](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/self-repair.ts#L148-L192)

计划器依据最后失败、卡片警告及回复形态选择提醒，代码请求和文件操作保守排除。

<details>
<summary>查看原文（45行）</summary>

```text
export function planRepairs(facts: TurnFacts): RepairPlan[] {
  const plans: RepairPlan[] = []
  const last = facts.lastVisualize
  if (last !== undefined && !last.ok && isOwnRejection(last.text) && !admitsFailure(facts.textAfterVisualize)) {
    plans.push({
      kind: 'failed-call',
      fingerprint: fingerprint('failed-call', last.text),
      text: `${TAG} Your last visualize call failed, so nothing rendered and the user sees no card. `
        + 'Apply the fixes that error listed and call visualize again now. '
        + 'If the card cannot be made to pass, tell the user in one sentence what blocks it instead.',
    })
  }
  for (const [path, card] of facts.cards) {
    const findings = breakingFindings(card.fragment)
    if (findings.length === 0) continue
    plans.push({
      kind: 'card-warnings',
      fingerprint: fingerprint('card-warnings', path, ...findings.map(f => `${f.code}@${f.offset}:${f.excerpt}`)),
      text: `${TAG} The card "${card.title}" rendered, but these findings leave it broken:\n${formatFindings(findings)}\n`
        + `Patch it now: visualize with action "update", path "${path}", its title restated. `
        + 'Then end your reply; do not mention this check.',
    })
  }
  if (facts.visualizeCalled || facts.fileToolCalled || facts.finalInterrupted || asksForCode(facts.userText)) return plans
  const fence = wantsVisual(facts.userText) ? cardShapedFence(facts.finalText) : undefined
  if (fence !== undefined) {
    plans.push({
      kind: 'pasted-markup',
      fingerprint: fingerprint('pasted-markup', fence),
      text: `${TAG} Your reply pastes HTML/SVG markup as a code block, so the user sees source code, not a rendered card. `
        + 'Call visualize now with that markup as `fragment` (a fragment only; load the visualize skill first if you have not), '
        + 'then add one or two sentences and do not paste the markup again. '
        + 'If the user wanted the code itself, end your turn with one short line instead.',
    })
  }
  const promise = fence === undefined ? promisedCard(facts.finalText) : undefined
  if (promise !== undefined) {
    plans.push({
      kind: 'promised-card',
      fingerprint: fingerprint('promised-card', promise),
      text: `${TAG} You said you would show a card, but the turn is ending without a visualize call. `
        + 'Call visualize now. If you decided against a card, end your turn with one short line.',
    })
  }
  return plans
```

</details>

**依据 5 · 源码核查**：[src/self-repair.ts:402-417](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/self-repair.ts#L402-L417)

实际停止边界有两次预算及指纹去重，并调用agent.steer。

<details>
<summary>查看原文（16行）</summary>

```text
  events.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (signal?.aborted === true || typeof agent?.steer !== 'function') return
    const key = sessionKey(agent.session)
    const state = key === undefined ? undefined : turns.get(key)
    if (state === undefined || state.turn !== turn || state.subagent) return
    if (state.steers >= MAX_STEERS_PER_TURN) return
    const plan = planRepairs(state.facts).find(p => !state.fingerprints.has(p.fingerprint))
    if (plan === undefined) return
    // Counted before sending: a re-entrant boundary must not deliver twice.
    state.fingerprints.add(plan.fingerprint)
    state.steers += 1
    try {
      agent.steer(correctionMessage(plan.text, agent.session?.header?.version) as never)
    } catch (error) {
      logger?.warn?.(`dsh-visualize: self-repair steer failed (${error instanceof Error ? error.message : String(error)})`)
    }
```

</details>

**依据 6 · 源码核查**：[src/client/card-state.ts:71-102](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/card-state.ts#L71-L102)

状态键及JSON字符长度限制，不按字节计量。

<details>
<summary>查看原文（32行）</summary>

```text
export function cardStateKey(session: string | undefined, path: string, callId: string): string {
  return `${session ?? ''}|${path === '' ? `call:${callId}` : path}`
}

/**
 * Whether a value is a plain JSON-style object (not an array, class instance or null).
 * @param value - candidate.
 * @returns true for a plain object.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value) as unknown
  return proto === Object.prototype || proto === null
}

/**
 * Normalise a state object through JSON, within the per-card cap.
 * @param value - candidate state.
 * @param maxChars - cap on its JSON length.
 * @returns the JSON-clean state and its JSON, or undefined when it is not one or too big.
 */
function cleanState(value: unknown, maxChars: number): { values: CardState; json: string } | undefined {
  if (!isPlainObject(value)) return undefined
  let json: string
  try {
    json = JSON.stringify(value)
  } catch {
    // Cycles and BigInts survive structured clone but not JSON.
    return undefined
  }
  if (json.length > maxChars) return undefined
  return { values: JSON.parse(json) as CardState, json }
```

</details>

**依据 7 · 源码核查**：[src/client/card-state.ts:196-237](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/card-state.ts#L196-L237)

按时间淘汰及存储失败保留内存的具体实现。

<details>
<summary>查看原文（42行）</summary>

```text
  function persist(store: StateStorage, key: string, json: string): void {
    const full = STORAGE_PREFIX + key
    if (json === '{}') {
      store.removeItem(full)
      return
    }
    const value = `{"t":${now()},"s":${json}}`
    const victims = others(store, full)
    let used = victims.reduce((sum, entry) => sum + entry.size, 0)
    while (used + full.length + value.length > totalMax && victims.length > 0) {
      const oldest = victims.shift()!
      store.removeItem(oldest.key)
      used -= oldest.size
    }
    // The host's stores share the quota: when it is full, give up our own
    // oldest cards before this one.
    for (;;) {
      try {
        store.setItem(full, value)
        return
      } catch (error) {
        const oldest = victims.shift()
        if (oldest === undefined) throw error
        store.removeItem(oldest.key)
      }
    }
  }

  function flush(): void {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    if (pending.size === 0) return
    const keys = [...pending]
    pending.clear()
    const store = open()
    if (store === undefined) return
    for (const key of keys) {
      try {
        persist(store, key, memory.get(key) ?? '{}')
      } catch {
        // Storage refused it; the page keeps it in memory.
      }
```

</details>

**依据 8 · 源码核查**：[src/client/VisualizeCard.tsx:500-504](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/VisualizeCard.tsx#L500-L504)

页面缩略图读保存状态但不写入。

```text
  // A distinct token: its height reports must never size another frame.
  // It shows the saved state but, inert, never changes it.
  const { doc, colorScheme } = useFrameDoc(
    meta, `thumb:${callId}`, 'page', false, stateKey === undefined ? undefined : { key: stateKey, saves: false },
  )
```

**依据 9 · 作者声明**：[README.md:48-52](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/README.md#L48-L52)

作者明确新窗口不保存改动，并说明自修复范围。

```text
卡片可以把内容交回对话。测验、选项、表单这类卡片在你点下按钮后，会把一句话（比如「我选了 B，帮我解释为什么 A 不对」）填进输入框。消息不会自动发出，你可以改完再发，也可以不发。改选另一个选项时，新的话会替换卡片刚才写进去的那句；输入框里有你自己写或改过的内容时，卡片不会覆盖它，只会弹出一条提示。这项功能需要 DSH 0.1.7 及以上；在新窗口打开的卡片不支持，卡片会隐藏这类按钮。

卡片会记住你在里面做的选择：拖过的滑块、勾选的选项、填写的文字、选中的标签页，以及模型用 `dshViz.state` 保存的其他选择（比如选中的节点、当前步骤）。刷新页面、重新打开会话、模型用 `update` 修改卡片之后，卡片都会恢复成你离开时的样子；重新画的新卡片从默认值开始。状态只存在这个浏览器里，放在 DSH 页面的 localStorage 中（键名以 `dsh-visualize:state:` 开头），按会话和卡片分开，不会上传，也不会同步到别的设备或浏览器；换一个端口打开 DSH 也算另一个站点。每张卡片最多 16 KB，所有卡片合计最多 256 KB，超出时最久没改动的卡片先被清掉。想全部清空，在浏览器开发者工具的 Application → Local Storage 里删掉这些键，或者清除这个站点的数据。页面卡片的缩略图和在新窗口打开的卡片会显示已保存的状态，但新窗口里的改动不会保存。浏览器禁止存储时（例如某些隐私模式），状态只在当前页面里保留：切换主题、修改卡片不会丢，刷新后就没了。

模型有时会在卡片还没真正交到你手上时就结束回答：最后一次 `visualize` 调用失败了却没有重试；卡片画出来了，但还带着会让它坏掉的 lint 警告（脚本查找不存在的元素 id、沙箱里加载不到的相对 URL）；把 HTML/SVG 当代码块贴进了回答；或者说了「我来画一张卡片」就停下了。遇到这些情况，插件会在这一轮结束前给模型发一句简短的提醒（steer），让它在同一轮里接着修好或补上调用。判断偏保守：你要的就是 HTML 代码或文件、这一轮写了项目文件、回合被你中断或出错时都不会提醒；颜色写死这类只影响风格的警告不算；每轮最多提醒 2 次，同一个问题只提醒一次。不需要的话，在 `cordis.patch.yml` 里这个插件的 `config` 下加 `selfRepair: false`。
```

#### 缺口

- 缺少检查器误报漏报与自修复净收益的同任务数据。
  **影响**：不能认定修复提高最终正确率，也不知道额外模型步骤是否抵消局部修订收益。
  **进一步探讨**：固定模型和题目，对关闭与开启自修复记录最终卡片正确率、额外步骤、token与人工修订时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续使用及退出需要哪些依赖和成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

宿主必须提供工具、Skill和文件系统服务，浏览器部分必须提供slots才能把工具结果转为卡片。作者声明兼容DSH 0.1.1-rc.2至0.2.2-rc.1；包中明确列出Cordis、schemastery、React和DSH相关peer范围，但这些声明不是本次逐版本运行结果。图片读取和卡片输入框桥需要较新的宿主接口，图片路由未注册时工具把图片报告为无法交付，设置或旧版桥缺失则按能力降级。

使用者先在web profile安装并重启刷新，再让模型加载编写契约、生成片段并检查卡片。卡片只允许静态CDN资源，动态联网业务应由宿主的其他工具完成并把结果交给卡片，不能因为能运行JS就把它当成任意网页。模型和数据质量是效果依赖，图表库、字体CDN可达性是某些片段的展示依赖；本次没有验证其当前在线状态。

首次投入包括安装、服务版本对齐与一个已知结果样例的检查；持续投入包括模型生成和修复、资源存储、人工核对数据与公式。恢复需要区分正文、图片和浏览器状态。图片解析发生在副本写入之前，取消会在写之前检查；但正文写与图片清单写是两个顺序操作，单文件原子rename不保证两者跨文件事务，写入中断不能据注释推成全部无副作用。磁盘副本删除后已有正文可重放，update将失去依据，外置图片也可能无法加载。浏览器站点数据清理只清交互状态，不等于移除磁盘素材。

没有费用、频率、耗时和合格结果数据，本次不能给单位成本。退出以停止加载插件、保留需要的HTML/素材和人工保存重要参数为退路；旧会话中的持久结果可能仍在，清理配置、磁盘和浏览器是不同动作。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-21](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/package.json#L1-L21)

包版本与客户端/构建导出共同定义安装形态。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "@nagi-ovo/dsh-visualize",
  "description": "DSH inline visualization plugin: a visualize tool + bundled skill let the model render interactive HTML fragments as sandboxed cards in the conversation (Codex /visualize semantics).",
  "icon": "assets/icon.svg",
  "version": "0.1.8",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets",
```

</details>

**依据 2 · 源码核查**：[src/index.ts:31-34](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/index.ts#L31-L34)

启动必须注入工具、Skill和fs服务。

```text
/** Cordis plugin name. */
export const name = 'dsh-visualize'
/** Required services: the tool registry, the skill registry, and the fs seam. */
export const inject = ['tools', 'skills', 'fs']
```

**依据 3 · 源码核查**：[src/index.ts:164-184](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/index.ts#L164-L184)

图片路由可选注入connection；ready状态传回工具。

<details>
<summary>查看原文（21行）</summary>

```text
function registerImageRoute(ctx: Context): { readonly ready: boolean } {
  const state = { ready: false }
  ctx.inject(['connection'], (scope) => {
    const fetch = (scope.get('connection') as { fetch?: Partial<ConnectionFetch> } | undefined)?.fetch
    if (typeof fetch?.register !== 'function') return
    const register = fetch.register.bind(fetch) as ConnectionFetch['register']
    scope.effect(() => {
      const dispose = register({
        path: IMAGE_ROUTE_PATH,
        methods: ['GET', 'HEAD'],
        requestBody: 'buffered',
        fetch: async request => await handleImageRequest(storeRoot(ctx), request),
      })
      state.ready = true
      return () => {
        state.ready = false
        return dispose()
      }
    }, 'dsh-visualize: card images route')
  })
  return state
```

</details>

**依据 4 · 源码核查**：[src/skill.ts:63-79](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/skill.ts#L63-L79)

Skill契约从随包文件加载，并附当前风格说明。

<details>
<summary>查看原文（17行）</summary>

```text
export function visualizeSkillProvider(
  style: StyleId | (() => StyleId) = DEFAULT_STYLE,
  locate: (cwd: string | undefined) => StyleFileLocations = () => ({}),
): SkillProvider {
  return {
    name: PROVIDER_NAME,
    list: () => Promise.resolve([CANDIDATE]),
    async get(_candidate, options): Promise<SkillDefinition> {
      const body = await readFile(SKILL_BODY_URL, 'utf8')
      return {
        name: CANDIDATE.name,
        description: CANDIDATE.description,
        invocation: CANDIDATE.invocation,
        provider: CANDIDATE.provider,
        source: CANDIDATE.source,
        resourceBase: RESOURCE_BASE,
        content: body + await activeStyleSection(typeof style === 'function' ? style() : style, locate(options?.cwd)),
```

</details>

**依据 5 · 作者声明**：[README.md:23-32](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/README.md#L23-L32)

作者安装流程和兼容区间。

<details>
<summary>查看原文（10行）</summary>

````text
推荐用 npm 装到 DSH 的 `web` profile：

```sh
dsh plugin --profile web add @nagi-ovo/dsh-visualize
# 如果 dsh web 正在运行，重启后刷新页面
```

也可以从 GitHub 安装：`dsh plugin --profile web add github:Nagi-ovo/dsh-visualize`。可以运行 `dsh --profile web --dump-config` 确认插件已经进入最终配置。需要修改源码时，克隆仓库并在仓库目录运行 `dsh plugin --profile web add .`；构建产物已经提交，不需要额外构建。使用社区 [plugin-registry](https://github.com/dsh-external/plugin-registry) 的用户也可以从「设置 → 插件」安装。

兼容 DSH 0.1.1-rc.2 到 0.2.2-rc.1。
````

</details>

**依据 6 · 作者声明**：[README.md:42-50](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/README.md#L42-L50)

作者说明副本、图片和浏览器状态的清理边界。

```text
每张卡片的 fragment 另存一份到 `~/.dsh/visualize/sessions/<会话 id>/<标题>-<hash>.<style>.html`（设置了 `DSH_HOME` 时在 `$DSH_HOME/visualize/` 下），按会话分开，不写进你的项目目录，`git status` 不会出现 `viz/`。`update` 改写的就是这份文件。旧版本写在工作区 `viz/` 下的卡片仍然可以 `update`，原地修改。插件不会自动清理这些文件，需要时可以直接删除 `~/.dsh/visualize/`，已有会话的卡片照常重放。

卡片也能显示它自己加载不了的图片：agent 刚存进工作区的图（matplotlib 画的 PNG、论文里的 figure），或者任意公开的网络图片。模型写 `<img data-viz-src="figs/loss.png">` 或 `<img data-viz-src="https://…">`，调用执行时插件读取文件或下载图片，确认内容确实是 PNG、JPEG、GIF、WebP 或 SVG（单张不超过 5 MB，每张卡片合计不超过 12 MB、最多 16 张），然后存到卡片旁边的 `~/.dsh/visualize/sessions/<会话 id>/images/`。卡片渲染时从那里取图，所以模型的上下文和会话日志里都没有图片字节，日志里每张图只记一条很短的引用。某张图失败时，卡片在原位显示一个带 alt 文字的占位框，其余部分照常渲染；工具结果会告诉模型哪张图失败、原因是什么，方便它改路径。用 `update` 改卡片时，已经下载过的网络图片直接复用，工作区文件重新读取，所以重新生成的图在下一次修改后就会显示出来。这项功能需要 DSH 0.1.7 及以上；更早的版本里卡片只显示占位框，工具结果会说明原因。

DSH 默认会把已完成回合的工具过程折叠起来。折叠时，这一轮画出的卡片会再显示在最终回答下方，不用展开过程也能看到；「工作步骤展示」选「完全展开」时则只在原位显示。

卡片可以把内容交回对话。测验、选项、表单这类卡片在你点下按钮后，会把一句话（比如「我选了 B，帮我解释为什么 A 不对」）填进输入框。消息不会自动发出，你可以改完再发，也可以不发。改选另一个选项时，新的话会替换卡片刚才写进去的那句；输入框里有你自己写或改过的内容时，卡片不会覆盖它，只会弹出一条提示。这项功能需要 DSH 0.1.7 及以上；在新窗口打开的卡片不支持，卡片会隐藏这类按钮。

卡片会记住你在里面做的选择：拖过的滑块、勾选的选项、填写的文字、选中的标签页，以及模型用 `dshViz.state` 保存的其他选择（比如选中的节点、当前步骤）。刷新页面、重新打开会话、模型用 `update` 修改卡片之后，卡片都会恢复成你离开时的样子；重新画的新卡片从默认值开始。状态只存在这个浏览器里，放在 DSH 页面的 localStorage 中（键名以 `dsh-visualize:state:` 开头），按会话和卡片分开，不会上传，也不会同步到别的设备或浏览器；换一个端口打开 DSH 也算另一个站点。每张卡片最多 16 KB，所有卡片合计最多 256 KB，超出时最久没改动的卡片先被清掉。想全部清空，在浏览器开发者工具的 Application → Local Storage 里删掉这些键，或者清除这个站点的数据。页面卡片的缩略图和在新窗口打开的卡片会显示已保存的状态，但新窗口里的改动不会保存。浏览器禁止存储时（例如某些隐私模式），状态只在当前页面里保留：切换主题、修改卡片不会丢，刷新后就没了。
```

**依据 7 · 源码核查**：[src/tool.ts:259-292](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/tool.ts#L259-L292)

先解析图片和检查取消，再依次写正文和图片清单，不是跨文件原子事务。

<details>
<summary>查看原文（34行）</summary>

```text
      // Images resolve before anything is written: a call cancelled during a
      // slow fetch must leave the card as it was, or its file would hold a
      // patch no result reported and a retry of the same old_str would miss.
      // A patch carries the URL images its card already fetched; workspace
      // files are re-read, so a regenerated figure shows after any patch.
      const previous: StoredImage[] = action === 'update' ? await target.images?.read() ?? [] : []
      const resolved = await resolveCardImages(fragment, {
        readFile: workspaceImageReader(ctx, store.workspaceRoot),
        fetchUrl,
        store: store.images,
        ...images.delivery() ? {} : { unavailable: NO_IMAGE_ROUTE },
        previous,
        limits: imageLimits,
        signal: exec.signal,
      })
      // Read as optional: specs drive execute without a signal.
      const signal: AbortSignal | undefined = exec.signal
      signal?.throwIfAborted()
      await target.write(fragment)
      await target.images?.write(resolved.images)
      const embedded = resolved.images.map(cardImageOf)
      const report = imageReport(embedded, resolved.failures)
      return {
        action,
        path: target.displayPath,
        title,
        mode,
        sizeBytes,
        fragment,
        ...summary ? { summary } : {},
        style: cardStyle,
        ...warnings ? { warnings } : {},
        ...embedded.length > 0 ? { images: embedded } : {},
        ...report === undefined ? {} : { imageReport: report },
```

</details>

**依据 8 · 源码核查**：[src/storage.ts:406-419](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/storage.ts#L406-L419)

单文件写通过临时文件加rename完成，约束只能声称到该层。

<details>
<summary>查看原文（14行）</summary>

```text
export async function writeFileAtomic(path: string, content: string | Uint8Array): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 })
  // Unique per write, not per millisecond: concurrent creates of the same
  // content-addressed card would otherwise share one temp file, and the
  // second rename would find it already moved. With distinct temps both
  // renames land, and identical bytes make the last one a no-op.
  const temp = `${path}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`
  try {
    await writeFile(temp, content, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    await rename(temp, path)
  } catch (error) {
    // EEXIST means the name was taken and the file is not ours to remove.
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') await rm(temp, { force: true }).catch(() => {})
    throw error
```

</details>

#### 缺口

- 缺少首次配置、日常模型调用与失败恢复的实际时间和费用记录。
  **影响**：无法计算合格讲解任务总成本，也不能给节时或收费结论。
  **进一步探讨**：按同一任务日志分开计现金、模型token、人工检查和所有重试，并以正确交互且公式核对通过的卡片计合格数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么新方向值得验证，谁可在什么停止条件下试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合在个人、非敏感的DSH Web会话中试用算法讲解、参数探索和界面讨论。先选自己能判断正确答案的小例子，让模型画卡片并修改一个参数；用户比较可见结果、刷新后状态及局部更新是否符合预期，再决定是否扩大。试用目标是减少离开对话保存和打开文件的交接，并不承诺理解效果或计算正确性。正式计算、需要跨设备保存重要输入的表单、多个互不信任会话共用主目录的场景都应另选有验证和权限边界的工具。出现关键图片缺失、公式与已知答案冲突、反复修复或旧状态影响解释时，停止扩展卡片，改用静态图或独立可核验文件。

从按会话创建目录但按全局根接受update路径这一事实，可推导一个尚未验证的工程假设。若把卡片访问改为由宿主签发的会话内标识，更新时同时检查会话归属和预期内容版本，就可能在保持精确修订便利的同时缩小跨会话误改和陈旧补丁覆盖的范围。它相对当前仅检查路径包含关系增加显式所有权与版本前提，不是已实现功能，也不证明市场需要一个新插件。代价包括会话迁移、旧路径兼容和分享卡片的授权流程。

最小验证可以使用两个隔离会话各创建一个已知HTML卡片，再对另一个会话的卡片标识、过期内容版本及合法本会话版本分别请求修改。成功应是前两类被确定拒绝且原文件不变，合法更新完成并保留可重放结果；同时与现路径流程比较正常修订所需步骤。若宿主本来就实施了等价隔离，或新增验证使合法迁移无法完成却没有减少误改，这个改造的增量会被削弱。另需比较一组已知答案的卡片与静态材料，才能判断交互形式是否带来净收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/storage.ts:108-133](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/storage.ts#L108-L133)

会话创建与全局根更新的差异直接构成所有权假设的出发点。

<details>
<summary>查看原文（26行）</summary>

```text
export function cardStore(ctx: Context, exec: CardExec): CardStore {
  const root = storeRoot(ctx)
  const sessionId = exec.agent?.session.id
  const workspace = workspaceFiles(ctx, exec)
  return {
    async create(name) {
      if (root === undefined || typeof sessionId !== 'string' || sessionId.length === 0) {
        return await workspace.open(`viz/${name}`)
      }
      return ownedFile(root, join(root, 'sessions', sessionSegment(sessionId), name))
    },
    images: root === undefined || typeof sessionId !== 'string' || sessionId.length === 0
      ? undefined
      : sessionImages(root, sessionSegment(sessionId)),
    workspaceRoot: workspace.root,
    async open(path) {
      const owned = root === undefined ? undefined : await ownedPath(root, path)
      if (owned !== undefined) return ownedFile(root!, owned)
      const legacy = await workspacePath(workspace.root, path)
      if (legacy === undefined) {
        throw new Error(
          `invalid visualization patch: ${JSON.stringify(path)} is not a card visualize can patch — pass the path `
          + 'a visualize call reported (a card in the session store, or a legacy viz/ .html copy inside the workspace)',
        )
      }
      return await workspace.open(legacy)
```

</details>

**依据 2 · 源码核查**：[src/storage.ts:218-232](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/storage.ts#L218-L232)

当前更新授权只检查根范围与路径，版本前提不存在于该入口。

<details>
<summary>查看原文（15行）</summary>

```text
export async function ownedPath(root: string, path: string): Promise<string | undefined> {
  const expanded = path === '~' || path.startsWith('~/') ? join(homedir(), path.slice(1)) : path
  if (!isAbsolute(expanded)) return undefined
  const target = resolve(expanded)
  if (!inside(root, target) || !target.endsWith('.html')) return undefined
  // A symlink inside the store — the file or a directory above it — must not
  // carry a read or a write anywhere else.
  const real = await realpath(target).catch(async () => await realpath(dirname(target)).then(
    parent => join(parent, 'card.html'),
    () => undefined,
  ))
  // Nothing on disk yet: the card does not exist, and the read fails loudly.
  if (real === undefined) return target
  const realRoot = await realpath(root).catch(() => root)
  return inside(realRoot, real) ? target : undefined
```

</details>

**依据 3 · 源码核查**：[src/fragment.ts:132-146](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/fragment.ts#L132-L146)

现有唯一文本匹配不等于绑定整个内容版本。

<details>
<summary>查看原文（15行）</summary>

```text
export function applyFragmentPatch(base: string, oldStr: string, newStr: string): string {
  if (oldStr.length === 0) {
    throw new Error('invalid visualization patch: old_str is empty — pass the exact card text to replace')
  }
  const first = base.indexOf(oldStr)
  if (first === -1) {
    throw new Error(`invalid visualization patch: old_str does not appear in the card. ${nearestAnchor(base, oldStr)}`)
  }
  if (base.indexOf(oldStr, first + oldStr.length) !== -1) {
    throw new Error(
      `invalid visualization patch: old_str appears ${countOccurrences(base, oldStr)} times in the card — `
      + 'extend it with neighbouring lines until exactly one site matches',
    )
  }
  return base.slice(0, first) + newStr + base.slice(first + oldStr.length)
```

</details>

**依据 4 · 源码核查**：[src/client/card-state.ts:196-237](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/client/card-state.ts#L196-L237)

状态可淘汰或只存内存，使重要业务输入不适合只依赖卡片。

<details>
<summary>查看原文（42行）</summary>

```text
  function persist(store: StateStorage, key: string, json: string): void {
    const full = STORAGE_PREFIX + key
    if (json === '{}') {
      store.removeItem(full)
      return
    }
    const value = `{"t":${now()},"s":${json}}`
    const victims = others(store, full)
    let used = victims.reduce((sum, entry) => sum + entry.size, 0)
    while (used + full.length + value.length > totalMax && victims.length > 0) {
      const oldest = victims.shift()!
      store.removeItem(oldest.key)
      used -= oldest.size
    }
    // The host's stores share the quota: when it is full, give up our own
    // oldest cards before this one.
    for (;;) {
      try {
        store.setItem(full, value)
        return
      } catch (error) {
        const oldest = victims.shift()
        if (oldest === undefined) throw error
        store.removeItem(oldest.key)
      }
    }
  }

  function flush(): void {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    if (pending.size === 0) return
    const keys = [...pending]
    pending.clear()
    const store = open()
    if (store === undefined) return
    for (const key of keys) {
      try {
        persist(store, key, memory.get(key) ?? '{}')
      } catch {
        // Storage refused it; the page keeps it in memory.
      }
```

</details>

**依据 5 · 源码核查**：[src/self-repair.ts:402-417](https://github.com/Nagi-ovo/dsh-visualize/blob/b0946439d4dfe0ab8c66d25053e56383f3b487fd/src/self-repair.ts#L402-L417)

有限自修复不能作为正确交付保证。

<details>
<summary>查看原文（16行）</summary>

```text
  events.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (signal?.aborted === true || typeof agent?.steer !== 'function') return
    const key = sessionKey(agent.session)
    const state = key === undefined ? undefined : turns.get(key)
    if (state === undefined || state.turn !== turn || state.subagent) return
    if (state.steers >= MAX_STEERS_PER_TURN) return
    const plan = planRepairs(state.facts).find(p => !state.fingerprints.has(p.fingerprint))
    if (plan === undefined) return
    // Counted before sending: a re-entrant boundary must not deliver twice.
    state.fingerprints.add(plan.fingerprint)
    state.steers += 1
    try {
      agent.steer(correctionMessage(plan.text, agent.session?.header?.version) as never)
    } catch (error) {
      logger?.warn?.(`dsh-visualize: self-repair steer failed (${error instanceof Error ? error.message : String(error)})`)
    }
```

</details>

#### 缺口

- 会话内标识与预期版本检查方案尚未实现，也没有隔离环境对照。
  **影响**：它只是可证伪的工程假设，不能计入插件现有创新。
  **进一步探讨**：比较合法修订、跨会话误用与陈旧版本三类结果，并记录迁移兼容负担及拒绝后原件是否不变。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
