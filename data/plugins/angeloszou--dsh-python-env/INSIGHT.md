# dsh-python-env

> 为 DSH 提供 Python 虚拟环境发现、创建、装包、卸包与删除工具，并支持镜像和代理重试。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d24039c](https://github.com/AngelosZou/dsh-python-env/tree/d24039c579b644101577383ef5734fff78d43439)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env) [![npm 30d 1,346](https://img.shields.io/static/v1?label=npm+30d&message=1%2C346&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-python-env) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-python-env)
<!-- END META -->

**使用建议**：先观察，暂不直接给日常profile启用。愿意核查的维护者应在无敏感数据的可丢弃系统中明确指定环境、审核固定依赖并验证路径和参数反例；任何非允许写入或目标歧义都停止。完成真实宿主与完整任务验收后再决定是否试用。详见[Q09](#research-q09)。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)
- [研究问题与完整回答](#detail-section-9)
  - [Q01 · 谁需要它，怎样定义一次合格的 Python 项目任务？](#detail-section-10)
  - [Q02 · 入口如何完成注册、发现、安装和代码执行的衔接？](#detail-section-11)
  - [Q03 · 相比显式 venv/pip 流程，它增加了什么，哪些能力归属上游？](#detail-section-12)
  - [Q04 · 工作区约束和目标选择在哪些输入或状态下可能不成立？](#detail-section-13)
  - [Q05 · 启动、持续使用和失败恢复分别依赖什么？](#detail-section-14)
  - [Q06 · 完成一个合格任务的现金与人工成本如何构成？](#detail-section-15)
  - [Q07 · 实现哪些设计值得借鉴，可靠性尚缺什么？](#detail-section-16)
  - [Q08 · 由约束缺口能推导什么新设计，如何支持或推翻？](#detail-section-17)
  - [Q09 · 现在适合谁试用，怎样验收并决定停止？](#detail-section-18)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

已核查：固定提交的工具注册、环境选择、安装与失败分支；已有贡献为集成解释。关键约束存在静态缺口，未运行复现；新设计是假设。推荐观察，未安装、未执行目标测试、未做真实宿主验收。

[重点创新推演与最小验证](#innovation)

- **用途**：适合在 DSH 中为可信 Python 项目准备依赖、需要避开 shell 网络或临时目录限制的开发者；代码运行仍需显式使用工具返回的解释器。

- **建议**：未验证假设：由宿主签发明确目标环境、依赖与网络路由的可审阅操作计划，结合参数约束和真正受限的构建执行环境，可能保留便利并减少目标歧义。它增加确认、隔离维护和跨进程协调负担，需用正常任务与链接外指、参数改写等反例同时检验，不计为插件已有贡献。详见[Q08](#research-q08)。

采用建议：先观察，暂不直接给日常profile启用。愿意核查的维护者应在无敏感数据的可丢弃系统中明确指定环境、审核固定依赖并验证路径和参数反例；任何非允许写入或目标歧义都停止。完成真实宿主与完整任务验收后再决定是否试用。详见[Q09](#research-q09)。

简单替代是显式指定项目解释器执行venv/pip，再运行项目验收；本研究只比较实现和操作责任，没有执行同条件速度/效果对照，也未核查uv机制。

<a id="detail-section-3"></a>

### 能力、流程与成本

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 环境发现（pyenv_discover） | 查找环境，报告解释器、版本和 pip 状态 | 扫描深度和目录数量有上限；发现不代表自动激活，也不证明物理路径位于工作区内 |
| 环境创建（pyenv_create） | 使用 Python 标准库创建 venv | 需要可写会话及可用 Python；venv 不提供系统级隔离 |
| 依赖安装（pyenv_install） | 向选定环境安装包，必要时修复 pip、处理部分网络失败 | 需核对环境、包参数与来源；可能自动创建环境，失败不保证回滚 |
| 依赖卸载（pyenv_uninstall） | 从选定环境移除包 | 需要可写会话及已有环境；不自动建环境，不撤销安装时的全部副作用 |
| 环境删除（pyenv_remove） | 删除选定虚拟环境 | 需要可写会话，核对环境标记和目标内容；词法路径检查不等于物理隔离，删除不等于完整回滚 |
| Python 环境指导（python-env Skill） | 指导模型使用环境工具及明确的解释器路径 | 为程序化注册的指导，不自行执行脚本，也不保证模型遵循 |
| 后台安装任务（jobs） | 将安装放入后台，提供日志与终止处理 | 依赖宿主 jobs 服务；取消、超时后的实际环境状态仍需验收，本次未运行验证 |

**流程与依赖**

**启动与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node.js ≥20、Cordis ^4.0.1 | 启动必需（包声明） | 提供运行时与插件框架 | 不满足声明的兼容条件；本次未做安装验证 |
| DSH profile 的 tools、skills、subprocess、jobs、sandboxPolicy、systemPrompt 服务 | 启动必需（inject 声明） | 注册工具与指导，提供执行和策略接口 | 宿主须满足服务注入契约；本次未验证缺服务时的挂载行为 |
| 可解析的 @deepseek-ai/dsh-tools 模块 | 启动必需（源码导入） | 提供工具实现所用接口 | 模块无法解析会阻断加载；peer 仅列 Cordis，独立 npm 安装是否满足未知 |
| Python ≥3.8，目标环境解释器可执行 | 创建和使用环境时必需（作者要求） | 创建 venv、探测状态及运行 python -m pip | 对应操作失败；不自动激活 shell，执行脚本仍需显式使用正确解释器 |
| sandboxPolicy 可解析且会话为 workspace-write 或 danger-full-access | 写操作时必需 | 允许创建、安装、卸包与删除 | 策略缺失或只读时拒绝写操作；可写模式不等于操作系统隔离 |
| 可用包来源及必要的网络访问 | 下载依赖时必需 | 获取包及构建依赖 | 网络类失败可能触发镜像/代理回退；已有本地材料的离线安装另论，不把索引当所有操作的硬依赖 |
| multiFolder 服务及额外根配置 | 可选 | 将额外工作目录纳入允许根 | 缺失、接口不兼容或查询异常时使用空额外根列表，主工作区仍可用 |

上述版本来自作者和包声明，不代表本次已验证跨版本兼容。无需 uv/virtualenv；索引和代理的选择、物理路径与包参数限制仍需核对。表格提供操作入口，不能替代下面的流程和边界分析。

启动需要 Node>=20、包的 Cordis ^4.0.1 peer、提供声明服务的 DSH profile，以及可用 Python>=3.8；无需 uv/virtualenv。代码还直接导入 @deepseek-ai/dsh-tools，而 package peer 只列 Cordis，因此安装可用性依赖宿主/组合环境能解析该模块，本次没有独立 npm 安装验证。不能据此直接宣布发布包必坏。

持续生效依赖宿主服务契约、允许写的会话模式、目标环境可执行与可用索引/代理。sandboxPolicy 缺失会拒绝写操作，这是合理的失败关闭；subprocess 缺失则对应工具报错。multi-folder 是可选服务，缺失或异常降级为空列表，不使主工作区功能依赖另一个插件。

用户先安装并重启后端，选择可信项目与目标环境，模型调用发现/创建/安装，用户仍需检查安装结果和解释器，再运行实际脚本。网络失败由插件分类重试，包不存在则停止；超时需人工决定拆包或调整索引，不存在事务回滚包安装或损坏环境的机制。删除环境仍需先确认目标与内容，不能把删除venv理解成撤销宿主代码可能造成的副作用。

**启动步骤**

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1. 准备与加载 | 用户将插件加入提供所需服务的 DSH profile，按作者说明重启后端 | 核对插件、五个工具与动态 Skill 已加载；本次未做宿主验收 |
| 2. 发现并选定环境 | 模型调用发现工具；用户或调用者确认项目、允许根和目标 venv | 明确环境与解释器；多根同名 .venv 时显式指定目标，不只依赖自动偏好 |
| 3. 创建或安装 | 写工具检查会话策略，通过宿主 subprocess 创建环境、检查/修复 pip 并安装可信依赖 | 只读或策略缺失时拒绝；无环境时可能自动创建 .venv，不能把“安装失败”理解为没有副作用 |
| 4. 处理失败或后台任务 | 插件区分网络与包解析错误，必要时尝试镜像/代理或交给 jobs；用户查看结果 | 超时或取消后核对退出状态与环境，再决定重试或拆包；不存在事务回滚保证 |
| 5. 验收与使用 | 用户核对安装位置、包状态，用返回的解释器显式运行目标脚本 | 以正确环境完成实际任务为准；发现目标歧义或非允许写入时停止，删除 venv 不等于撤销全部宿主副作用 |


包入口指向 lib/index.js，profile patch 插入插件行；apply 逐一注册五个模型工具、一个动态 Skill 和一个系统提示段。它不是注册 Agent/Preset，也没有自行提供执行 Python 脚本的工具。宿主需提供 tools、skills、subprocess、jobs、sandboxPolicy、systemPrompt 服务，声明存在不等于当前宿主能够挂载。

发现流程遍历主工作区与可选 secondary roots，按 pyvenv.cfg 或惯例名字识别候选，再报告 marker、解释器位置、版本和 pip 状态。真正选择写入目标时，仅 marker 候选参与；没有显式 venv 参数时从各允许根发现环境，单个直接用，多个则找第一个名字为 .venv 的候选，否则要求调用者指定。这个偏好并不等于项目语义匹配。

install 先检查会话可写、取得额外根并准备缓存，再校验参数。没有环境才在主工作区创建 .venv；选中后找到环境解释器，运行 python -m pip --version，必要时 ensurepip 修复，然后调用 pip install。环境创建和包安装均通过宿主 subprocess 的 argv，而不是 shell 字符串。网络错误可以换镜像和尝试本地代理，后台分支交给 jobs，结果保留尝试路径。工具返回后模型还要显式用该解释器运行脚本；没有自动激活状态。

**效果与成本**

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地运行、下载、磁盘及宿主模型调用可能产生投入；实际金额未知 | 安装插件、重启后端、确认 Python 与目标环境、审核依赖和索引；耗时未知 | MIT 许可不等于完整任务零成本；未核实实际账单、配置耗时或安装成功率 |
| 持续使用 | 依赖下载与构建占用网络、计算和磁盘，宿主模型调用量及费用未知 | 明确环境和解释器、核对包状态与交付结果，处理日常变更；频率和耗时未知 | .dsh-pyenv 缓存及临时目录会占项目磁盘；无任务量和缓存占用样本，不能计算单位成本 |
| 失败恢复 | 额外网络尝试、模型调用及环境重建可能重复消耗资源；次数、金额未知 | 查看日志、确认超时后的环境状态，决定重试、拆包、换索引或重建；恢复耗时未知 | 无事务回滚保证；两分钟预算不代表任务能在两分钟内完成，后台不自动延长预算 |
| 迁移或退出（适用时） | 缓存保留、迁移或重建所需存储和计算量未知 | 保留依赖版本、核对标准 venv/pip 环境及持久目录；清理和迁移耗时未知 | 删除环境不等于清理全部缓存或撤销宿主副作用；未测迁移成本 |

计量单位应是一份指定项目依赖已装入正确环境、并用该解释器通过预定脚本或测试的交付；安装命令退出0仅是中间结果。源码没有计时或效果样本，不能报节省百分比、ROI或单位成本。

现金方面，MIT代码没有声明插件订阅费用；下载流量、本地磁盘/计算和宿主所用模型调用由用户环境决定。首次人工投入包括装插件、重启后端、确认 Python/venv 可用、审核依赖及索引；日常投入仍有读取错误、明确解释器和验证交付。pip缓存与临时目录置于 .dsh-pyenv，会占项目磁盘，移除环境没有同时清理全部缓存的承诺。

失败成本包括多次网络尝试、模型反复调用、人工排查以及半完成环境重建。两分钟预算是一种可解释的交互取舍，不是大型科学计算依赖在两分钟内必能安装；后台仍有同一上限，因此换后台不是延长任务预算的办法。若用户已有可靠脚本且网络正常，插件的注册与维护成本可能超过便利收益；真正受沙箱网络限制的用户才更可能得到额外价值。迁移离开时环境仍是标准venv/pip，但应保留需求版本和核对持久目录，不能声称自动清理。

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 环境管理与状态反馈 | 源码存在五个管理工具、解释器定位和结构化结果 | 真实宿主加载与端到端任务成功率未知 |
| 网络失败处理 | 源码区分部分错误并实现镜像/代理回退 | 在目标网络下是否提高成功率、增加多少等待未知；不保证解决依赖冲突 |
| 后台安装 | 实现 jobs 接线、日志与终止处理 | 实际交互改善、取消后的环境状态及恢复负担未验证 |
| 人工效率与经济收益 | 可解释便利来自工具接线与故障反馈，属于机制判断 | 无同条件合格任务对照；节时、ROI、总费用与单位合格任务成本未知 |

可确认价值是结构化管理和故障解释；尚无证据量化合格任务成功率、速度或人工节省。镜像重试与后台执行不会自动解决依赖冲突、包构建权限和最终脚本验收。

- **思考**：最影响贡献成立的是：转为宿主执行后，工作区约束是否足够？词法路径守卫没有物理路径核对，发现逻辑允许符号链接，普通包规格可直接进入 pip argv，显式索引还接受 HTTP；这些限制使“仅工作区写入”不能被当作隔离保证。均为静态核查，未做越界复现。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：贡献是把标准 venv/pip 接到 DSH 的结构化工具、模式检查、错误收据和模型指引中，减少每次手写命令的接线负担；不是新的隔离技术。参照为显式解释器的手工流程，尚无同条件效果对照。详见[Q03](#research-q03)。

贡献是把标准 venv/pip 接到 DSH 的结构化工具、模式检查、错误收据和模型指引中，减少每次手写命令的接线负担；不是新的隔离技术。参照为显式解释器的手工流程，尚无同条件效果对照。详见[Q03](#research-q03)。

工程上把环境发现、目标解析、路径守卫、pip重试、进程与展示分开，五工具复用模块，值得借鉴的是结构化结果与可解释停止原因、缺策略拒绝写入、网络失败与包解析失败区别处理。复用到其他宿主需要重新实现 subprocess/jobs/sandboxPolicy 接口，不能只复制提示词。后台生命周期还要核对终止、日志和异常归属。

测试材料覆盖词法路径、版本候选、环境解析、镜像/代理及mock宿主工具；这些是实际读到的测试定义，没有执行成功证据。guard测试没有物理符号链接反例；pip测试以单独SSLError文本断言不重试，而分类器没有显式排除所有TLS错误，混合含“Could not fetch URL”文本仍可能命中网络标记。这表示测试覆盖比宣传窄，不能说“TLS绝不重试”已被完整保证。

其他静态边界：显式 Python 命令按空白切分，含空格的可执行路径可能解析成多个参数；多根多个 .venv 的偏好欠缺项目意图；缓存目录是相对固定路径，并无跨进程锁。作者也注明第二个DSH进程不协调。现有调度互斥只能推断某宿主调度范围内串行，不是文件系统全局互斥。

完整 Git 文件树已用于统计；语义核查覆盖所有 lib 生产模块及README、package、SECURITY与重点测试，其他测试只作清单和定向抽读，不能称全仓审计。内嵌 Skill 是运行时对象注册，不含SKILL.md，因此inventory的零静态SKILL候选不应误报为无Skill。

<a id="detail-section-5"></a>

### 主要限制

最影响贡献成立的是：转为宿主执行后，工作区约束是否足够？词法路径守卫没有物理路径核对，发现逻辑允许符号链接，普通包规格可直接进入 pip argv，显式索引还接受 HTTP；这些限制使“仅工作区写入”不能被当作隔离保证。均为静态核查，未做越界复现。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SECURITY.md、lib/constants.js、lib/envdir.js、lib/guard.js、lib/guidance.js、lib/index.js、lib/layout.js、lib/paths.js、lib/pip.js、lib/policy.js、lib/python.js、lib/render.js、lib/runner.js、lib/secondary.js、lib/skill.js、lib/tools/create.js、lib/tools/discover.js、lib/tools/install.js、lib/tools/remove.js、lib/tools/uninstall.js、lib/venv.js、test/guard.test.js、test/pip.test.js、test/venv.test.js、test/secondary.test.js、test/smoke.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整固定Git树用于统计；人工覆盖全部lib生产模块与作者README/package/SECURITY、重点测试；其余测试仅清单与定向抽读。未执行插件、测试或安装，不是安全审计，也不验证宿主服务或效果。
- 下一步：下一步先核对并收窄自由参数与物理路径边界，再在固定宿主的无凭据丢弃环境验收：五工具加载、只读拒写、明确目标安装与运行、符号链接/选项反例、取消超时、禁用与卸载；记录完整执行条件、写入差异和合格率。未取得这些结果前不升级结论。

**分析版本**

- **仓库**：[AngelosZou/dsh-python-env](https://github.com/AngelosZou/dsh-python-env)
- **版本号**：0.1.2（[固定提交 d24039c](https://github.com/AngelosZou/dsh-python-env/tree/d24039c579b644101577383ef5734fff78d43439)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：由宿主签发明确目标环境、依赖与网络路由的可审阅操作计划，结合参数约束和真正受限的构建执行环境，可能保留便利并减少目标歧义。它增加确认、隔离维护和跨进程协调负担，需用正常任务与链接外指、参数改写等反例同时检验，不计为插件已有贡献。详见[Q08](#research-q08)。

下一步先核对并收窄自由参数与物理路径边界，再在固定宿主的无凭据丢弃环境验收：五工具加载、只读拒写、明确目标安装与运行、符号链接/选项反例、取消超时、禁用与卸载；记录完整执行条件、写入差异和合格率。未取得这些结果前不升级结论。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 735 | — | — | 6673 |
| .js | source | 20 | 2205 | 1639 | 464 | — |
| .js | test | 10 | 1267 | 1119 | 65 | — |
| .mjs | test | 1 | 51 | 37 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env/issues?q=is%3Aissue+created%3A2026-09-21T08%3A03%3A08.828Z..2026-10-21T08%3A03%3A08.828Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A03%3A08.828Z..2026-10-21T08%3A03%3A08.828Z)



统计日期：2026-10-21。

<a id="detail-section-9"></a>

## 研究问题与完整回答

**插件研究总目标：**该固定版本能否通过宿主环境管理工具改善可信 Python 项目的依赖准备，同时对目标选择、写入范围和失败恢复给出足够约束？

<a id="research-q01"></a>

<a id="detail-section-10"></a>

### Q01 · 谁需要它，怎样定义一次合格的 Python 项目任务？

**研究主题：**场景与需求

**回答状态：**部分回答，仍有缺口

#### 完整回答

它针对在 DSH 会话中维护 Python 项目、安装依赖却遇到 shell 网络或临时目录限制的开发者。作者把痛点解释为宿主 shell 沙箱限制；这属于作者对使用环境的陈述，本次没有在真实 DSH 中重现。合格结果应是指定项目的虚拟环境可识别、依赖装入目标环境、用该环境的解释器完成任务，并且预期范围以外没有变化；仅收到工具成功文本还不够。

它提供环境管理，不接管 Python 脚本执行。README 示例和内嵌 Skill 明确要求把返回的解释器路径交给普通 shell；不能把“创建环境”理解成后续所有 python 命令自动切换。原有办法是用户显式执行项目解释器的 venv/pip 命令，或由已有环境管理器准备环境，再让模型使用绝对解释器路径。本次比较的是这条简单流程与插件的宿主接线，不把 uv 的性能或锁定能力当成已核查对照。

适合的重复任务是给可信项目补充少量已审核依赖、检查或删除可丢弃环境；生产依赖升级、自动处理陌生仓库或必须把包构建隔离在受限系统中的场景不由本插件单独解决。未发现独立用户频次、故障率或需求访谈，因而不能从明确用途推出需求已被市场验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-27](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/README.md#L13-L27)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `README.md` · 行 13–27。文件 SHA-256：`286a6abbb6b8a7ff576670d3c5b38adc35ef35bb14706f78739de676ca5b3b27`。

作者列出用途、五工具、宿主通道及基础要求。

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin that gives one project (workspace) agent-facing Python virtual environment management:

- **Five model tools** — `pyenv_discover`, `pyenv_create`, `pyenv_install`, `pyenv_uninstall`, `pyenv_remove` — plus the `python-env` skill and a system-prompt guidance section.
- Runs the **standard library** `python -m venv` / `pip` through the platform **subprocess channel** (host process) instead of the sandboxed shell, so venv creation, `ensurepip` bootstrapping, and package-index network access work where shell-side pip fails.
- **Mirror and proxy fallback** — on a network-classified failure, installs retry across PyPI mirrors (TUNA, Aliyun, USTC) and probe common local proxy ports; `index` / `proxy` arguments pin either.
- **Workspace confinement** — every path resolves inside the session workspace (case-insensitive on Windows); caches and temp state live under `<workspace>/.dsh-pyenv/`; commands are argv arrays (no shell); the global Python environment, host pip cache, and system temp are never touched.
- **Cross-platform** — Windows / macOS / Linux layouts and interpreter chains (`Scripts` vs `bin`, `py -3` vs `python3`).
- **No third-party dependency** — no uv, no virtualenv, no other plugin. A pip-less environment is repaired offline via `ensurepip`.
- **Session policy parity** — the mutating tools consult the session's sandbox policy and refuse to run in read-only sessions; discovery stays available everywhere.

## Requirements

- Node.js >= 20
- A DSH profile composed from `@deepseek-ai/dsh-base` (it provides the `subprocess`, `jobs`, `tools`, and `skills` services the plugin uses)
- Python >= 3.8 (on PATH, or passed explicitly) — only for the environments the plugin manages
```

**依据 2 · 源码核查**：[lib/skill.js:31-35](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/skill.js#L31-L35)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/skill.js` · 行 31–35。文件 SHA-256：`c6bfa918d36aff59287e2d36bdacbe25c4d143f5354b59037fa19c24c320beb4`。

明确把执行代码留给普通shell，必须用返回解释器。

```text
## Running code from an environment
Use the interpreter path the tools report with your normal shell tools:
- Windows: \`<venv>\\Scripts\\python.exe\`
- macOS/Linux: \`<venv>/bin/python\`
Run tests and scripts with that interpreter so installed packages are importable. Creating/installing stays with the tools; running code stays in the shell.
```

#### 未知项

- **未知：**没有真实 DSH 任务或独立用户样本。
  **影响：**需求频率与端到端改善未知。
  **下一步：**收集同一宿主中 shell 失败的具体任务，并以同输入对照显式解释器流程。

<a id="research-q02"></a>

<a id="detail-section-11"></a>

### Q02 · 入口如何完成注册、发现、安装和代码执行的衔接？

**研究主题：**功能与机制

**回答状态：**部分回答，仍有缺口

#### 完整回答

包入口指向 lib/index.js，profile patch 插入插件行；apply 逐一注册五个模型工具、一个动态 Skill 和一个系统提示段。它不是注册 Agent/Preset，也没有自行提供执行 Python 脚本的工具。宿主需提供 tools、skills、subprocess、jobs、sandboxPolicy、systemPrompt 服务，声明存在不等于当前宿主能够挂载。

发现流程遍历主工作区与可选 secondary roots，按 pyvenv.cfg 或惯例名字识别候选，再报告 marker、解释器位置、版本和 pip 状态。真正选择写入目标时，仅 marker 候选参与；没有显式 venv 参数时从各允许根发现环境，单个直接用，多个则找第一个名字为 .venv 的候选，否则要求调用者指定。这个偏好并不等于项目语义匹配。

install 先检查会话可写、取得额外根并准备缓存，再校验参数。没有环境才在主工作区创建 .venv；选中后找到环境解释器，运行 python -m pip --version，必要时 ensurepip 修复，然后调用 pip install。环境创建和包安装均通过宿主 subprocess 的 argv，而不是 shell 字符串。网络错误可以换镜像和尝试本地代理，后台分支交给 jobs，结果保留尝试路径。工具返回后模型还要显式用该解释器运行脚本；没有自动激活状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:46-65](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/index.js#L46-L65)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/index.js` · 行 46–65。文件 SHA-256：`0012aed6b3f0021524d1b2b3b1c5c802cddf8e7f0ab8bf36478c1cd64b79183e`。

入口注册及宿主依赖可直接核查。

```text
import { registerSkill } from './skill.js'
import { registerGuidance } from './guidance.js'
import { registerDiscoverTool } from './tools/discover.js'
import { registerCreateTool } from './tools/create.js'
import { registerInstallTool } from './tools/install.js'
import { registerUninstallTool } from './tools/uninstall.js'
import { registerRemoveTool } from './tools/remove.js'

export const name = 'dsh-python-env'
export const inject = ['tools', 'skills', 'subprocess', 'jobs', 'sandboxPolicy', 'systemPrompt']

export function apply(ctx) {
  registerSkill(ctx)
  registerGuidance(ctx)
  registerDiscoverTool(ctx)
  registerCreateTool(ctx)
  registerInstallTool(ctx)
  registerUninstallTool(ctx)
  registerRemoveTool(ctx)
}
```

**依据 2 · 源码核查**：[lib/venv.js:43-74](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/venv.js#L43-L74)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/venv.js` · 行 43–74。文件 SHA-256：`6b9ca9e90ac3b590b4c2e903315f7826a09df9cde227b74a45f8c6f13df2db64`。

目标选择按marker与.venv偏好，没有项目归属判据。

```text
export async function resolveExistingVenv(ws, requested, extraRoots = []) {
  if (requested !== undefined && String(requested).trim().length > 0) {
    const dir = resolveVenvArg(requested, ws, extraRoots)
    let exists = false
    try {
      exists = (await stat(dir)).isDirectory()
    } catch {
      // absent — reject below
    }
    if (!exists) throw new Error('venv not found: ' + dir)
    if (!(await isVenvDir(dir))) throw new Error('not a virtual environment (no pyvenv.cfg): ' + dir)
    return dir
  }
  const candidates = []
  const seen = new Set()
  for (const root of [ws, ...extraRoots]) {
    for (const candidate of await discoverVenvCandidates(root)) {
      if (!candidate.byMarker) continue
      const key = process.platform === 'win32' ? candidate.dir.toLowerCase() : candidate.dir
      if (seen.has(key)) continue
      seen.add(key)
      candidates.push(candidate)
    }
  }
  if (candidates.length === 0) return null
  if (candidates.length === 1) return candidates[0].dir
  const preferred = candidates.find((candidate) => candidate.name.toLowerCase() === '.venv')
  if (preferred !== undefined) return preferred.dir
  throw new Error(
    'multiple virtual environments found; pass "venv" to choose: ' + candidates.map((candidate) => candidate.dir).join(', '),
  )
}
```

**依据 3 · 源码核查**：[lib/tools/install.js:245-280](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js#L245-L280)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/tools/install.js` · 行 245–280。文件 SHA-256：`5582df9738f3cf6450ded7a7cfcfc312c150b06f9aef47df3051b253a170eb2e`。

安装使用选定解释器，ensurepip后构造调用选项。

```text
                throw new Error('auto venv creation failed\n' + (createResult.stderr.text + '\n' + createResult.stdout.text).slice(-2000))
              }
              if (!(await isVenvDir(venvDir))) {
                throw new Error('auto venv creation reported success but ' + venvDir + ' has no pyvenv.cfg marker')
              }
            }
            const venvPython = await pickVenvInterpreter(venvDir)
            if (venvPython === null) throw new Error('virtual environment has no usable interpreter: ' + venvDir)
            await ensurePip(subprocess, venvPython, ws, env, exec && exec.signal, (handle) => { current = handle })
            if (deadline.fired()) {
              return { error: renderStopReason({ tool: 'pyenv_install', operation: 'ensuring pip in ' + venvDir, budgetMs }) }
            }

            const opts = {
              subprocess,
              signal: exec && exec.signal,
              cwd: ws,
              venvPython,
              specs: normalizedSpecs,
              requirementsPath,
              index: args.index,
              proxy: args.proxy,
              upgrade: args.upgrade === true,
              env,
              onSpawn: (handle) => { current = handle },
            }

            if (args.run_in_background === true) {
              if (deadline.fired()) {
                return { error: renderStopReason({ tool: 'pyenv_install', operation: 'preparing the background install', budgetMs }) }
              }
              if (exec && exec.signal && exec.signal.aborted) throw new Error('tool call aborted')
              const log = new JobLog()
              let live = null
              let capped = false
              const capTimer = setTimeout(() => {
```

#### 未知项

- **未知：**没有真实宿主加载和调用记录。
  **影响：**工具Schema兼容、服务提供与后台生命周期未验收。
  **下一步：**在固定DSH版本检查加载、五工具schema及前台/后台一条完整调用。

<a id="research-q03"></a>

<a id="detail-section-12"></a>

### Q03 · 相比显式 venv/pip 流程，它增加了什么，哪些能力归属上游？

**研究主题：**贡献与相对优势

**回答状态：**部分回答，仍有缺口

#### 完整回答

可确认的增量是把标准库 venv、pip、宿主 subprocess 与模型工具编排连接起来：模型有结构化参数与结果，知道何时创建、如何修复 pip，遇到网络失败会走镜像/代理链，并通过 Skill 提示使用返回解释器。相对每次让模型拼 shell 命令，这提供固定入口、统一错误报告和会话写模式检查；这些是可读源码支持的集成贡献。

环境隔离与依赖安装来自 Python venv/pip，进程启动、终止和后台任务能力来自宿主服务。插件没有新造解析器、锁文件求解器或系统级沙箱。与简单脚本相比，DSH 服务接线和模型指引是额外价值，但也增加宿主接口耦合。单纯“可从宿主访问网络”不是新的安全隔离机制。

最强支持在于代码确实把选择环境、修复和重试连接成一条流程；最强限制则是“所有写入仅工作区”无法由现有词法路径检查与缓存变量证明（见Q04）。因此贡献可以成立为可信项目的便利集成，不能上升为既解决网络限制又维持完整沙箱边界的证明。没有同条件运行，不能说更快、更稳或优于 uv。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:75-82](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/README.md#L75-L82)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `README.md` · 行 75–82。文件 SHA-256：`286a6abbb6b8a7ff576670d3c5b38adc35ef35bb14706f78739de676ca5b3b27`。

作者机制说明含标准库、宿主、镜像与提示的组合。

```text
## How it works

- **Subprocess channel** — the DSH shell sandbox blocks CPython's owner-only temp directories (Windows `[Errno 13]` during `ensurepip`/wheel unpacking) and package-index network access. Plugin code runs in the host process, so every python/pip/venv invocation goes through `ctx.subprocess` (the same channel the graphlint plugin uses) with argv arrays, byte-capped collected output, and tree-scoped termination. The unrestricted token is compensated by the confinement model below — not by weakening the sandbox.
- **Confinement** — every model-influenced path passes `guardWorkspacePath` (absolute resolution + containment, `..`-safe); venv names are single-segment regex-validated and re-guarded after `join`; children get `PIP_CACHE_DIR` / TMP / TEMP / TMPDIR re-pointed into `<workspace>/.dsh-pyenv/`.
- **Install attempt chain** — default index first; a network-classified failure (connection reset/timeout/DNS — never "No matching distribution found" or TLS errors) falls back across TUNA → Aliyun → USTC mirrors and, once, probes common local proxy ports (7890, 7891, 10809, 10808, 8888) to retry the same index through a live one.
- **ensurepip repair** — `<venv-python> -m ensurepip --upgrade` bootstraps pip offline from bundled wheels; when ensurepip itself is absent the error carries the Debian/Ubuntu `python3-venv` hint.
- **Concurrency** — mutating tools declare `isConcurrencySafe: false`, so the scheduler serializes them; discovery stays read-only.
- **Skill & guidance** — the `python-env` skill teaches tool-first usage and the "never escalate for pip" rule; one system-prompt section (`dsh-python-env:guidance`, order 120) reminds every session that the pyenv tools are the sanctioned path.
```

**依据 2 · 源码核查**：[lib/pip.js:135-155](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L135-L155)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/pip.js` · 行 135–155。文件 SHA-256：`5b532a17253dacbbed3687811aa732205d0d14f14e9c8118af9ba267cd848087`。

pip修复仍使用上游Python模块。

```text
export async function ensurePip(subprocess, venvPython, cwd, env, signal, onSpawn) {
  const probe = await runForeground(
    subprocess,
    { argv: [venvPython, '-m', 'pip', '--version'], cwd, stdio: stdioSpec(), graceMs: 5_000, env },
    signal,
    onSpawn,
  )
  if (probe.exitCode === 0) return
  const boot = await runForeground(
    subprocess,
    { argv: [venvPython, '-m', 'ensurepip', '--upgrade'], cwd, stdio: stdioSpec(), graceMs: 30_000, env },
    signal,
    onSpawn,
  )
  if (boot.exitCode === 0) return
  const stderr = boot.stderr.text + '\n' + boot.stdout.text
  let hint = ''
  if (/No module named ensurepip|ensurepip is (disabled|not available)/i.test(stderr)) {
    hint = ' The interpreter cannot bootstrap pip (missing ensurepip; on Debian/Ubuntu install the python3-venv package).'
  }
  throw new Error('pip is missing from the virtual environment and could not be bootstrapped.' + hint + '\n' + stderr.slice(-2000))
```

**依据 3 · 源码核查**：[lib/guidance.js:11-25](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/guidance.js#L11-L25)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/guidance.js` · 行 11–25。文件 SHA-256：`5da9ab1d25531074d0e6669986c77e85acb8b474f84e3c6a6f2452dc10d72a0a`。

向模型注入工具优先及显式解释器指引。

```text
const GUIDANCE_TEXT =
  'Python environment management (creating a virtual environment, installing or uninstalling packages) must go through the pyenv_* tools ' +
  'provided by the dsh-python-env plugin: pyenv_discover, pyenv_create, pyenv_install, pyenv_uninstall, pyenv_remove. ' +
  'Do not run pip, python -m venv, or ensurepip directly in a shell — the shell sandbox blocks pip\'s temporary directories and ' +
  'package-index network access; the tools execute through the host channel with every write confined to the workspace ' +
  '(.dsh-pyenv holds the caches) and never touch the global Python environment. ' +
  'The mutating tools respect the session sandbox mode and refuse to run in read-only sessions. ' +
  'Run code with the interpreter path the tools report (Windows <venv>\\Scripts\\python.exe, macOS/Linux <venv>/bin/python).'

export function registerGuidance(ctx) {
  ctx.systemPrompt.section({
    name: SECTION_NAME,
    order: SECTION_ORDER,
    text: () => GUIDANCE_TEXT,
  })
```

#### 未知项

- **未知：**没有固定宿主原生工具或同类插件的实现对照。
  **影响：**只能识别相对手工流程的集成增量，不能判断生态首创。
  **下一步：**固定宿主版本与一个简单脚本基线，逐步比对任务成功率和人工介入。

<a id="research-q04"></a>

<a id="detail-section-13"></a>

### Q04 · 工作区约束和目标选择在哪些输入或状态下可能不成立？

**研究主题：**缺陷与关键质疑

**回答状态：**部分回答，仍有缺口

#### 完整回答

核心质疑是：为解决 shell 受限而提升到宿主执行后，补偿控制是否真正覆盖写入目标？已有明确支持：四个写工具先检查 sandboxPolicy；路径用 resolve/relative 限制词法逃逸，安装用选定环境的 python -m pip，无 shell 插值。这能防止一类常规误操作，但不足以支持“所有写入物理限制在工作区”。

第一，guard 不解析 realpath，而发现逻辑主动把符号链接当作可进入的目录；marker 与解释器存在性通过 stat 检查。若工作区内目录链接指向外部环境，逻辑路径仍可看似位于工作区，后续选中的解释器可能属于外部。这里确认的是实现没有物理路径约束，不是已执行的越界复现；操作系统权限与具体链接布局决定结果。

第二，普通 packages 项只做文本、长度、数量检查，editable 分支之外原样保留；pip 构造器把每项追加为 argv。因此无需 shell 注入，pip 自身选项仍可能进入参数解析，例如 --target/--prefix 类改变目标的参数。requirements 文件内容也没有在插件层解析约束。实际 pip 版本的解析与最终写入需另做隔离验证，不能将“argv 数组”当作禁止 pip 选项的证明。

第三，SECURITY 声称仅 HTTPS，而 normalizeIndexUrl 明确接受 http(s)，这是可直接确认的文档/实现不一致。包构建本来就以宿主权限运行，env 中缓存和 tmp 重定向不会变成操作系统写隔离。多个允许根都有 .venv 时，选择第一个候选而非显式确认，也可能把正确包安到错误项目。这些边界改变采用条件：只在没有敏感宿主数据的可丢弃环境中评估，不能依靠插件承担不可信代码隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/guard.js:19-24](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/guard.js#L19-L24)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/guard.js` · 行 19–24。文件 SHA-256：`e1660aaa9cae29529636dc3a054fc9205b54345427ae35aed06df1b29db98d0c`。

isWithin仅比较相对路径。

```text
/** True when `target` equals `root` or lies inside it (case-insensitive on Windows). */
export function isWithin(root, target, platform = process.platform) {
  const rel = relative(root, target)
  if (rel === '') return true
  const normalized = platform === 'win32' ? rel.toLowerCase() : rel
  return normalized !== '..' && !normalized.startsWith('..' + sep) && !isAbsolute(normalized)
```

**依据 2 · 源码核查**：[lib/guard.js:45-66](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/guard.js#L45-L66)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/guard.js` · 行 45–66。文件 SHA-256：`e1660aaa9cae29529636dc3a054fc9205b54345427ae35aed06df1b29db98d0c`。

两个guard没有realpath或物理目录身份校验。

```text
export function guardWorkspacePath(requested, sessionRoot, label) {
  const root = resolve(sessionRoot)
  const target = resolve(root, requested === undefined || String(requested).trim().length === 0 ? root : requested)
  if (isWithin(root, target)) return target
  throw new OutsideWorkspaceError(target, root, label)
}

/**
 * Multi-root guard: the primary workspace plus optional extra roots
 * (e.g. dsh-multi-folder secondary working directories). Relative paths
 * still resolve against the primary workspace; an absolute target is
 * accepted when it lands inside ANY allowed root. With no extra roots this
 * is exactly guardWorkspacePath.
 */
export function guardAllowedPath(requested, sessionRoot, extraRoots, label) {
  const primary = resolve(sessionRoot)
  const target = resolve(primary, requested === undefined || String(requested).trim().length === 0 ? primary : requested)
  const roots = [primary, ...(Array.isArray(extraRoots) ? extraRoots : [])]
  for (const root of roots) {
    if (isWithin(resolve(root), target)) return target
  }
  throw new OutsideWorkspaceError(target, primary, label)
```

**依据 3 · 源码核查**：[lib/layout.js:29-35](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/layout.js#L29-L35)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/layout.js` · 行 29–35。文件 SHA-256：`791da7e7ed454c942fa10734e3b32283859767c17239ce844224658350373f2f`。

发现逻辑包含目录符号链接。

```text
/** Directory entries that are directories (or symlinks to them), names only. */
export async function listSubdirs(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
      .map((entry) => entry.name)
```

**依据 4 · 源码核查**：[lib/tools/install.js:174-196](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js#L174-L196)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/tools/install.js` · 行 174–196。文件 SHA-256：`5582df9738f3cf6450ded7a7cfcfc312c150b06f9aef47df3051b253a170eb2e`。

普通spec并未排除任意pip选项。

```text
          const specs = []
          if (args.packages !== undefined) {
            if (!Array.isArray(args.packages)) throw new Error('packages must be an array of requirement strings')
            for (const raw of args.packages) {
              const spec = typeof raw === 'string' ? raw.trim() : ''
              if (spec.length === 0) continue
              if (spec.length > MAX_SPEC_LENGTH) {
                throw new Error('package spec too long (max ' + MAX_SPEC_LENGTH + '): ' + spec.slice(0, 80) + '...')
              }
              specs.push(spec)
            }
            if (specs.length > MAX_PACKAGES) throw new Error('too many packages (max ' + MAX_PACKAGES + ')')
          }
          let requirementsPath
          if (args.requirements !== undefined && String(args.requirements).trim().length > 0) {
            requirementsPath = guardAllowedPath(args.requirements, ws, extraRoots, 'requirements')
            const info = await stat(requirementsPath)
            if (!info.isFile()) throw new Error('requirements is not a file: ' + requirementsPath)
          }
          if (specs.length === 0 && requirementsPath === undefined) {
            throw new Error('nothing to install: pass "packages" and/or a "requirements" file')
          }
          const normalizedSpecs = validateAndNormalizeSpecs(specs, ws, extraRoots)
```

**依据 5 · 源码核查**：[lib/pip.js:100-120](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L100-L120)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/pip.js` · 行 100–120。文件 SHA-256：`5b532a17253dacbbed3687811aa732205d0d14f14e9c8118af9ba267cd848087`。

spec逐项追加argv，不设置选项解析边界。

```text
/** Full `pip install` argv; index/proxy/upgrade are omitted when unset. */
export function buildInstallArgv({ venvPython, specs, requirementsPath, indexUrl, proxyUrl, upgrade }) {
  const argv = [
    venvPython,
    '-m',
    'pip',
    'install',
    '--disable-pip-version-check',
    '--no-color',
    '--no-input',
    '--retries',
    PIP_RETRIES,
    '--timeout',
    PIP_SOCKET_TIMEOUT,
  ]
  if (upgrade === true) argv.push('--upgrade')
  if (indexUrl !== undefined && indexUrl !== null) argv.push('--index-url', indexUrl)
  if (proxyUrl !== undefined && proxyUrl !== null) argv.push('--proxy', proxyUrl)
  if (requirementsPath !== undefined) argv.push('-r', requirementsPath)
  for (const spec of specs) argv.push(spec)
  return argv
```

**依据 6 · 源码核查**：[lib/pip.js:61-67](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L61-L67)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/pip.js` · 行 61–67。文件 SHA-256：`5b532a17253dacbbed3687811aa732205d0d14f14e9c8118af9ba267cd848087`。

显式index接受HTTP和HTTPS。

```text
/** An explicit index override must be a real http(s) URL. */
export function normalizeIndexUrl(raw) {
  const text = String(raw ?? '').trim()
  if (text.length === 0) return undefined
  if (!/^https?:\/\//i.test(text)) throw new Error('index must be an http(s) URL, e.g. https://pypi.tuna.tsinghua.edu.cn/simple')
  return text.replace(/\/+$/, '')
}
```

**依据 7 · 作者声明**：[SECURITY.md:85-94](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/SECURITY.md#L85-L94)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `SECURITY.md` · 行 85–94。文件 SHA-256：`f1708917c9da9514ce5596992c0a026eae5365a8bd72d82bdd05e30a56d0dfe5`。

仅HTTPS与每次写入工作区是作者安全宣称。

```text
- **Opt-in**: the plugin is installed per profile by the user; profiles
  whose agents must not install packages should not load it.
- **Index trust**: only HTTPS index URLs are accepted; the defaults and
  the mirror chain (TUNA/Aliyun/USTC) are long-standing public mirrors.
- **Hash pinning**: pip's own hash enforcement is honored — pass a hashed
  requirements file to `pyenv_install` and pip verifies every artifact.
- **Blast radius**: every write lands in the workspace (venv,
  `.dsh-pyenv`); a compromised environment is disposable with
  `pyenv_remove` and cannot silently mutate the global Python
  installation.
```

**依据 8 · 源码核查**：[lib/venv.js:76-94](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/venv.js#L76-L94)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/venv.js` · 行 76–94。文件 SHA-256：`6b9ca9e90ac3b590b4c2e903315f7826a09df9cde227b74a45f8c6f13df2db64`。

解释器存在性通过stat判断，并未解析环境目录物理归属。

```text
async function firstExisting(candidates) {
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate)
      if (info.isFile()) return candidate
    } catch {
      // not present — try the next candidate
    }
  }
  return null
}

/** Absolute path of the environment's interpreter, or null. */
export function pickVenvInterpreter(venvDir, platform = process.platform) {
  return firstExisting(venvPythonCandidates(venvDir, platform))
}

export function venvHasPip(venvDir, platform = process.platform) {
  return firstExisting(venvPipCandidates(venvDir, platform)).then((path) => path !== null)
```

#### 未知项

- **未知：**未构造符号链接/参数改写/requirements间接引用的运行复现。
  **影响：**尚不能报告具体可利用影响或受影响平台范围。
  **下一步：**在无凭据的丢弃容器，针对词法目录链接、--target与HTTP输入分别记录真实argv、拒绝结果及写入差异。

<a id="research-q05"></a>

<a id="detail-section-14"></a>

### Q05 · 启动、持续使用和失败恢复分别依赖什么？

**研究主题：**依赖、兼容与流程

**回答状态：**部分回答，仍有缺口

#### 完整回答

**启动与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node.js ≥20、Cordis ^4.0.1 | 启动必需（包声明） | 提供运行时与插件框架 | 不满足声明的兼容条件；本次未做安装验证 |
| DSH profile 的 tools、skills、subprocess、jobs、sandboxPolicy、systemPrompt 服务 | 启动必需（inject 声明） | 注册工具与指导，提供执行和策略接口 | 宿主须满足服务注入契约；本次未验证缺服务时的挂载行为 |
| 可解析的 @deepseek-ai/dsh-tools 模块 | 启动必需（源码导入） | 提供工具实现所用接口 | 模块无法解析会阻断加载；peer 仅列 Cordis，独立 npm 安装是否满足未知 |
| Python ≥3.8，目标环境解释器可执行 | 创建和使用环境时必需（作者要求） | 创建 venv、探测状态及运行 python -m pip | 对应操作失败；不自动激活 shell，执行脚本仍需显式使用正确解释器 |
| sandboxPolicy 可解析且会话为 workspace-write 或 danger-full-access | 写操作时必需 | 允许创建、安装、卸包与删除 | 策略缺失或只读时拒绝写操作；可写模式不等于操作系统隔离 |
| 可用包来源及必要的网络访问 | 下载依赖时必需 | 获取包及构建依赖 | 网络类失败可能触发镜像/代理回退；已有本地材料的离线安装另论，不把索引当所有操作的硬依赖 |
| multiFolder 服务及额外根配置 | 可选 | 将额外工作目录纳入允许根 | 缺失、接口不兼容或查询异常时使用空额外根列表，主工作区仍可用 |

上述版本来自作者和包声明，不代表本次已验证跨版本兼容。无需 uv/virtualenv；索引和代理的选择、物理路径与包参数限制仍需核对。表格提供操作入口，不能替代下面的流程和边界分析。

**启动步骤**

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1. 准备与加载 | 用户将插件加入提供所需服务的 DSH profile，按作者说明重启后端 | 核对插件、五个工具与动态 Skill 已加载；本次未做宿主验收 |
| 2. 发现并选定环境 | 模型调用发现工具；用户或调用者确认项目、允许根和目标 venv | 明确环境与解释器；多根同名 .venv 时显式指定目标，不只依赖自动偏好 |
| 3. 创建或安装 | 写工具检查会话策略，通过宿主 subprocess 创建环境、检查/修复 pip 并安装可信依赖 | 只读或策略缺失时拒绝；无环境时可能自动创建 .venv，不能把“安装失败”理解为没有副作用 |
| 4. 处理失败或后台任务 | 插件区分网络与包解析错误，必要时尝试镜像/代理或交给 jobs；用户查看结果 | 超时或取消后核对退出状态与环境，再决定重试或拆包；不存在事务回滚保证 |
| 5. 验收与使用 | 用户核对安装位置、包状态，用返回的解释器显式运行目标脚本 | 以正确环境完成实际任务为准；发现目标歧义或非允许写入时停止，删除 venv 不等于撤销全部宿主副作用 |


启动需要 Node>=20、包的 Cordis ^4.0.1 peer、提供声明服务的 DSH profile，以及可用 Python>=3.8；无需 uv/virtualenv。代码还直接导入 @deepseek-ai/dsh-tools，而 package peer 只列 Cordis，因此安装可用性依赖宿主/组合环境能解析该模块，本次没有独立 npm 安装验证。不能据此直接宣布发布包必坏。

持续生效依赖宿主服务契约、允许写的会话模式、目标环境可执行与可用索引/代理。sandboxPolicy 缺失会拒绝写操作，这是合理的失败关闭；subprocess 缺失则对应工具报错。multi-folder 是可选服务，缺失或异常降级为空列表，不使主工作区功能依赖另一个插件。

用户先安装并重启后端，选择可信项目与目标环境，模型调用发现/创建/安装，用户仍需检查安装结果和解释器，再运行实际脚本。网络失败由插件分类重试，包不存在则停止；超时需人工决定拆包或调整索引，不存在事务回滚包安装或损坏环境的机制。删除环境仍需先确认目标与内容，不能把删除venv理解成撤销宿主代码可能造成的副作用。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:35-48](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/package.json#L35-L48)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `package.json` · 行 35–48。文件 SHA-256：`9039d68f9d01e1c76e714e7178d8ecfd2d7ce626360b7395eb52ed15873799cd`。

运行与peer依赖声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
```

**依据 2 · 源码核查**：[lib/policy.js:14-40](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/policy.js#L14-L40)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/policy.js` · 行 14–40。文件 SHA-256：`773db36fe50e84beef6f9319f4e48511e3f5b76273b6d8fbef1178d5ee909548`。

缺服务或非可写模式拒绝写入。

```text
/** The session's standing sandbox mode, or undefined when unmountable. */
export function sessionSandboxMode(ctx, exec) {
  const sandboxPolicy = ctx.get('sandboxPolicy')
  if (sandboxPolicy === undefined || typeof sandboxPolicy.resolve !== 'function') return undefined
  const standing = sandboxPolicy.resolve(exec && exec.agent ? { session: exec.agent.session } : {})
  return standing && typeof standing.mode === 'string' ? String(standing.mode) : undefined
}

/**
 * Allow only when the session's mode grants workspace writes. Throws
 * otherwise — including when no policy service is mounted (the plugin
 * cannot verify permission, so it must not proceed).
 */
export function assertWritableSession(ctx, exec, action) {
  const mode = sessionSandboxMode(ctx, exec)
  if (mode === undefined) {
    throw new Error(
      "dsh-python-env: cannot " + action + ': no sandbox policy service is mounted, so the session\'s write permission cannot be verified',
    )
  }
  if (!WRITABLE_MODES.includes(mode)) {
    throw new Error(
      'dsh-python-env: cannot ' + action + ': the session is in "' + mode +
        '" mode, which forbids workspace mutations. Switch the session to workspace-write or danger-full-access first.',
    )
  }
  return mode
```

**依据 3 · 源码核查**：[lib/secondary.js:25-35](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/secondary.js#L25-L35)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/secondary.js` · 行 25–35。文件 SHA-256：`0b4588bfd166266e1b12980f6cb74a8698451e8f5b337e2da7af04c3260c5689`。

可选多根服务异常时降级。

```text
export async function secondaryDirs(ctx, ws) {
  const service = ctx.get('multiFolder')
  if (service === undefined || typeof service.list !== 'function') return []
  try {
    const result = await service.list(ws)
    const dirs = Array.isArray(result && result.dirs) ? result.dirs : []
    return dirs.filter((dir) => typeof dir === 'string' && dir.length > 0)
  } catch {
    // absent, incompatible, or failing — behave as if multi-folder were not installed
    return []
  }
```

**依据 4 · 源码核查**：[lib/pip.js:205-232](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L205-L232)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/pip.js` · 行 205–232。文件 SHA-256：`5b532a17253dacbbed3687811aa732205d0d14f14e9c8118af9ba267cd848087`。

失败分类决定重试或停止。

```text
  for (let i = 0; i < attempts.length; i += 1) {
    if (shouldStop !== undefined && shouldStop()) break
    const attempt = attempts[i]
    const argv = buildInstallArgv({ venvPython, specs, requirementsPath, indexUrl: attempt.indexUrl, proxyUrl, upgrade })
    // Short grace: when a deadline fires, the tree must settle fast so the
    // tool can return its detailed stop-reason close to the time budget.
    const spec = { argv, cwd, stdio: stdioSpec(), graceMs: 5_000, env }
    const result = await runForegroundWith(signal, subprocess, spec, onSpawn)
    tried.push(shapeAttempt(attempt.id, proxyUrl, result.exitCode))
    last = { result, argv }
    if (onAttempt !== undefined) onAttempt(result)
    if (result.exitCode === 0) {
      return { ok: true, result, tried, indexUsed: attempt.id, proxyUsed: proxyUrl === undefined ? null : proxyUrl }
    }
    if (shouldStop !== undefined && shouldStop()) break
    if (classifyNetworkFailure(result.stderr.text)) {
      if (proxyUrl === undefined && !probedLocal) {
        probedLocal = true
        const port = await probeFn()
        if (port !== null && port !== undefined) {
          proxyUrl = 'http://127.0.0.1:' + port
          i -= 1 // retry the same index through the discovered proxy
          continue
        }
      }
      continue // next mirror
    }
    break // non-network failure: surface immediately
```

#### 未知项

- **未知：**没有固定宿主版本的依赖安装和服务挂载验证。
  **影响：**可安装性与可选多目录兼容仍未知。
  **下一步：**使用锁定版本宿主做加载/只读/缺服务/多根异常矩阵，保存完整环境与日志。

<a id="research-q06"></a>

<a id="detail-section-15"></a>

### Q06 · 完成一个合格任务的现金与人工成本如何构成？

**研究主题：**效果与总成本

**回答状态：**部分回答，仍有缺口

#### 完整回答

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地运行、下载、磁盘及宿主模型调用可能产生投入；实际金额未知 | 安装插件、重启后端、确认 Python 与目标环境、审核依赖和索引；耗时未知 | MIT 许可不等于完整任务零成本；未核实实际账单、配置耗时或安装成功率 |
| 持续使用 | 依赖下载与构建占用网络、计算和磁盘，宿主模型调用量及费用未知 | 明确环境和解释器、核对包状态与交付结果，处理日常变更；频率和耗时未知 | .dsh-pyenv 缓存及临时目录会占项目磁盘；无任务量和缓存占用样本，不能计算单位成本 |
| 失败恢复 | 额外网络尝试、模型调用及环境重建可能重复消耗资源；次数、金额未知 | 查看日志、确认超时后的环境状态，决定重试、拆包、换索引或重建；恢复耗时未知 | 无事务回滚保证；两分钟预算不代表任务能在两分钟内完成，后台不自动延长预算 |
| 迁移或退出（适用时） | 缓存保留、迁移或重建所需存储和计算量未知 | 保留依赖版本、核对标准 venv/pip 环境及持久目录；清理和迁移耗时未知 | 删除环境不等于清理全部缓存或撤销宿主副作用；未测迁移成本 |

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 环境管理与状态反馈 | 源码存在五个管理工具、解释器定位和结构化结果 | 真实宿主加载与端到端任务成功率未知 |
| 网络失败处理 | 源码区分部分错误并实现镜像/代理回退 | 在目标网络下是否提高成功率、增加多少等待未知；不保证解决依赖冲突 |
| 后台安装 | 实现 jobs 接线、日志与终止处理 | 实际交互改善、取消后的环境状态及恢复负担未验证 |
| 人工效率与经济收益 | 可解释便利来自工具接线与故障反馈，属于机制判断 | 无同条件合格任务对照；节时、ROI、总费用与单位合格任务成本未知 |

计量单位应是一份指定项目依赖已装入正确环境、并用该解释器通过预定脚本或测试的交付；安装命令退出0仅是中间结果。源码没有计时或效果样本，不能报节省百分比、ROI或单位成本。

现金方面，MIT代码没有声明插件订阅费用；下载流量、本地磁盘/计算和宿主所用模型调用由用户环境决定。首次人工投入包括装插件、重启后端、确认 Python/venv 可用、审核依赖及索引；日常投入仍有读取错误、明确解释器和验证交付。pip缓存与临时目录置于 .dsh-pyenv，会占项目磁盘，移除环境没有同时清理全部缓存的承诺。

失败成本包括多次网络尝试、模型反复调用、人工排查以及半完成环境重建。两分钟预算是一种可解释的交互取舍，不是大型科学计算依赖在两分钟内必能安装；后台仍有同一上限，因此换后台不是延长任务预算的办法。若用户已有可靠脚本且网络正常，插件的注册与维护成本可能超过便利收益；真正受沙箱网络限制的用户才更可能得到额外价值。迁移离开时环境仍是标准venv/pip，但应保留需求版本和核对持久目录，不能声称自动清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-73](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/README.md#L69-L73)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `README.md` · 行 69–73。文件 SHA-256：`286a6abbb6b8a7ff576670d3c5b38adc35ef35bb14706f78739de676ca5b3b27`。

作者说明只读策略、操作方式及前后台预算。

```text
- The mutating tools (create / install / uninstall / remove) respect the session sandbox mode and refuse to run in **read-only** sessions; discovery still works.
- Common flows are all covered: pin versions (`"pkg==1.2.3"`), upgrade (`upgrade: true`), install from `requirements.txt` (`requirements`), and editable installs of local projects (`packages: ["-e", "."]` — the editable path must stay inside the workspace; remote/VCS editable URLs are rejected).
- Without a `venv` argument, `pyenv_install` uses the single discovered environment (preferring `.venv`), auto-creates `.venv` when none exists, and asks for an explicit `venv` when several exist.
- Background installs register with the jobs registry — poll with `job_output`, stop with `job_kill`.
- **Two-minute budget.** Every pyenv tool must finish within 2 minutes (discovery within 1). A tool that exceeds its budget terminates the running process tree and returns a detailed stop-reason — what was still running, the attempts tried, the last output, likely causes, and next steps — instead of hanging or reporting a bare timeout. Background installs share the same 2-minute cap; a per-call `timeoutMs` override on install/uninstall is honored but capped at 120000 ms.
```

**依据 2 · 源码核查**：[lib/envdir.js:14-35](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/envdir.js#L14-L35)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/envdir.js` · 行 14–35。文件 SHA-256：`7b78ef23402ed187483abd96da447c1d59d5860b2e13426dd82ce8ca38c9ccd4`。

缓存和临时目录持久存在于工作区。

```text
export function envRoot(ws) {
  return join(ws, ENV_DIR_NAME)
}

export function cacheDir(ws) {
  return join(envRoot(ws), CACHE_DIR_NAME)
}

export function tmpDir(ws) {
  return join(envRoot(ws), TMP_DIR_NAME)
}

/** Create the workspace cache/tmp tree (idempotent) plus its .gitignore. */
export async function ensureEnvDirs(ws) {
  const root = envRoot(ws)
  await mkdir(cacheDir(ws), { recursive: true })
  await mkdir(tmpDir(ws), { recursive: true })
  try {
    await writeFile(join(root, '.gitignore'), CACHE_DIR_NAME + '/\n' + TMP_DIR_NAME + '/\n', { flag: 'wx' })
  } catch {
    // already present — keep the existing file
  }
```

**依据 3 · 源码核查**：[lib/constants.js:64-81](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/constants.js#L64-L81)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/constants.js` · 行 64–81。文件 SHA-256：`035f3cee1d7669a6ed40907c157eee0c895d8a087db8de5a2d84b046acc44919`。

两分钟预算和默认多个索引。

```text
/** Shared budget for the mutating tools (create / install / uninstall / remove). */
export const DEFAULT_TOOL_TIMEOUT_MS = 120_000
/** Default budget for installs, also the ceiling any per-call timeoutMs override is capped at. */
export const DEFAULT_INSTALL_TIMEOUT_MS = 120_000
/** Hard ceiling for a model-supplied timeoutMs override on install/uninstall. */
export const MAX_TOOL_TIMEOUT_MS = 120_000
/** Hard cap for background installs (jobs outlive the tool call; same 2-minute budget). */
export const BACKGROUND_INSTALL_CAP_MS = 120_000

/**
 * Mirror fallback chain. `indexUrl: null` means pip's own default index
 * resolution (pip config + PIP_INDEX_URL), i.e. plain PyPI for most users.
 */
export const DEFAULT_INDEXES = [
  { id: 'default', indexUrl: null },
  { id: 'tuna', indexUrl: 'https://pypi.tuna.tsinghua.edu.cn/simple' },
  { id: 'aliyun', indexUrl: 'https://mirrors.aliyun.com/pypi/simple/' },
  { id: 'ustc', indexUrl: 'https://mirrors.ustc.edu.cn/simple' },
```

#### 未知项

- **未知：**没有任务时长、磁盘峰值、失败率或模型费用记录。
  **影响：**不能把集成便利换算成经济收益。
  **下一步：**以固定依赖集记录完整试次现金、人工分钟、重试数与合格率，并与手工流程比较。

<a id="research-q07"></a>

<a id="detail-section-16"></a>

### Q07 · 实现哪些设计值得借鉴，可靠性尚缺什么？

**研究主题：**工程质量与复用

**回答状态：**部分回答，仍有缺口

#### 完整回答

工程上把环境发现、目标解析、路径守卫、pip重试、进程与展示分开，五工具复用模块，值得借鉴的是结构化结果与可解释停止原因、缺策略拒绝写入、网络失败与包解析失败区别处理。复用到其他宿主需要重新实现 subprocess/jobs/sandboxPolicy 接口，不能只复制提示词。后台生命周期还要核对终止、日志和异常归属。

测试材料覆盖词法路径、版本候选、环境解析、镜像/代理及mock宿主工具；这些是实际读到的测试定义，没有执行成功证据。guard测试没有物理符号链接反例；pip测试以单独SSLError文本断言不重试，而分类器没有显式排除所有TLS错误，混合含“Could not fetch URL”文本仍可能命中网络标记。这表示测试覆盖比宣传窄，不能说“TLS绝不重试”已被完整保证。

其他静态边界：显式 Python 命令按空白切分，含空格的可执行路径可能解析成多个参数；多根多个 .venv 的偏好欠缺项目意图；缓存目录是相对固定路径，并无跨进程锁。作者也注明第二个DSH进程不协调。现有调度互斥只能推断某宿主调度范围内串行，不是文件系统全局互斥。

完整 Git 文件树已用于统计；语义核查覆盖所有 lib 生产模块及README、package、SECURITY与重点测试，其他测试只作清单和定向抽读，不能称全仓审计。内嵌 Skill 是运行时对象注册，不含SKILL.md，因此inventory的零静态SKILL候选不应误报为无Skill。

#### 证据与依据

**依据 1 · 源码核查**：[lib/runner.js:29-67](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/runner.js#L29-L67)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/runner.js` · 行 29–67。文件 SHA-256：`c5049aea393e162565e3bdf5f8f980dc7469d2c30aa185896a2282a5ffeec5ff`。

统一进程结果和可终止deadline机制。

```text
/**
 * Run one subprocess to completion and shape the outcome into the canonical
 * foreground value ({ exitCode, timedOut, stdout, stderr }). `done` rejects
 * only on spawn-level failure, which is allowed to propagate. An optional
 * `onSpawn` callback receives the handle right after spawn so callers can
 * terminate the live process from their own deadline watchdog.
 */
export async function runForeground(subprocess, spec, signal, onSpawn) {
  const handle = subprocess.spawn(signal === undefined ? spec : { ...spec, signal })
  if (onSpawn !== undefined) onSpawn(handle)
  const outcome = await handle.done
  return {
    exitCode: outcome.exitCode === undefined ? null : outcome.exitCode,
    timedOut: outcome.exitCode === null,
    stdout: shapeStream(handle.collected && handle.collected.stdout),
    stderr: shapeStream(handle.collected && handle.collected.stderr),
  }
}

/**
 * Arm a cooperative deadline for a tool's execute body. When `budgetMs`
 * elapses the callback terminates the currently tracked subprocess handle
 * (the one returned by `getHandle`, refreshed by each spawn's onSpawn hook)
 * and `fired()` flips so the caller can return a detailed stop-reason instead
 * of a normal result. The timer is unref'd and must be cleared with
 * `dispose()` once the body settles.
 */
export function armDeadline(budgetMs, getHandle) {
  let fired = false
  const timer = setTimeout(() => {
    fired = true
    const handle = getHandle()
    if (handle !== null && handle !== undefined && typeof handle.terminate === 'function') handle.terminate()
  }, budgetMs)
  if (typeof timer.unref === 'function') timer.unref()
  return {
    fired: () => fired,
    dispose: () => clearTimeout(timer),
  }
```

**依据 2 · 源码核查**：[lib/pip.js:24-51](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L24-L51)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/pip.js` · 行 24–51。文件 SHA-256：`5b532a17253dacbbed3687811aa732205d0d14f14e9c8118af9ba267cd848087`。

通用网络标记可与TLS组合文本冲突。

```text
const NETWORK_MARKERS = [
  /connection\s+(?:reset|aborted|refused|failed)/i,
  /failed to establish a new connection/i,
  /getaddrinfo|name or service not known|nodename nor servname/i,
  /(?:connect|read)\s*timed?\s*out/i,
  /timed out/i,
  /network is unreachable/i,
  /no route to host/i,
  /proxyerror/i,
  /retrying \(retry\(total=/i,
  /could not fetch url/i,
]

/**
 * Whether pip's stderr describes a network-level failure worth retrying on
 * another index or through a proxy. Resolution failures and TLS errors are
 * deliberately excluded.
 */
export function classifyNetworkFailure(stderrText) {
  const text = String(stderrText ?? '')
  if (
    text.includes('No matching distribution found') ||
    text.includes('ERROR: Could not find a version') ||
    text.includes('ERROR: No matching distribution')
  ) {
    return false
  }
  return NETWORK_MARKERS.some((marker) => marker.test(text))
```

**依据 3 · 源码核查**：[test/pip.test.js:28-33](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/test/pip.test.js#L28-L33)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `test/pip.test.js` · 行 28–33。文件 SHA-256：`a9273613fb2abbeb5cd146a0affda06dedbfe23f4564dc7e5a53d689118d9d13`。

测试仅给单独TLS错误字串。

```text
test('classifyNetworkFailure: resolution and TLS errors are NOT retryable', () => {
  assert.equal(classifyNetworkFailure('ERROR: No matching distribution found for demo'), false)
  assert.equal(classifyNetworkFailure('ERROR: Could not find a version that satisfies the requirement demo'), false)
  assert.equal(classifyNetworkFailure('SSLError: certificate verify failed'), false)
  assert.equal(classifyNetworkFailure(''), false)
})
```

**依据 4 · 源码核查**：[lib/python.js:32-38](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/python.js#L32-L38)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/python.js` · 行 32–38。文件 SHA-256：`3ce0636adcb9977fc9ffd9c3bc366d37adbb6246695f6d3890a0fe95beb6352c`。

显式命令按空白切分。

```text
export function candidateList(requested, platform = process.platform) {
  const text = requested === undefined ? '' : String(requested).trim()
  if (text.length > 0) {
    const tokens = text.split(/\s+/)
    if (tokens.some((token) => token.length === 0)) return []
    return [{ argv: tokens, label: text }]
  }
```

**依据 5 · 作者声明**：[SECURITY.md:99-108](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/SECURITY.md#L99-L108)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `SECURITY.md` · 行 99–108。文件 SHA-256：`f1708917c9da9514ce5596992c0a026eae5365a8bd72d82bdd05e30a56d0dfe5`。

作者明确跨DSH进程不协调。

```text
## Residual risks (accepted)

- Package code (wheels, sdist build scripts) runs with host privileges.
  This is inherent to installing Python packages anywhere and is why the
  plugin is opt-in. Do not install it in profiles whose agents should not
  be able to install packages at all.
- A second DSH process against the same workspace is not coordinated
  (documented limitation, not a security boundary breach).
- The plugin's own code runs with host privileges; it is dependency-free
  and its only execution surface is the five tools documented above.
```

**依据 6 · 源码核查**：[lib/skill.js:8-15](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/skill.js#L8-L15)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/skill.js` · 行 8–15。文件 SHA-256：`c6bfa918d36aff59287e2d36bdacbe25c4d143f5354b59037fa19c24c320beb4`。

程序化Skill定义。

```text
const SKILL = {
  name: 'python-env',
  description:
    'Manage workspace Python virtual environments through the pyenv_* tools (discover, create, install, remove) without sandbox, network, or subprocess pitfalls.',
  whenToUse:
    'When a task needs Python packages installed, a virtual environment created/discovered/removed in the workspace, or when pip / python -m venv fails in a shell with permission or network errors.',
  source: 'custom',
  invocation: { modelInvocable: true, userInvocable: true },
```

#### 未知项

- **未知：**未运行测试，未做多进程或平台矩阵。
  **影响：**测试通过率、Windows路径行为与日志取消语义不可确认。
  **下一步：**先扩展反例测试，再在三平台固定宿主中验证；分别记录源码定义与运行结果。

<a id="research-q08"></a>

<a id="detail-section-17"></a>

### Q08 · 由约束缺口能推导什么新设计，如何支持或推翻？

**研究主题：**新假设与验证

**回答状态：**部分回答，仍有缺口

#### 完整回答

未验证假设：把“若干自由字符串+词法路径”改为宿主签发的环境操作计划，可能同时保留便利并减少目标歧义。推导起点是Q02自动选择跨根环境、Q04词法检查与自由pip选项、Q07跨进程协调缺口；这不是插件当前已有能力，也没有证明用户愿意承担额外确认。

最小方案由宿主先列出允许根、真实目录身份与解释器，要求选择固定环境ID；生成操作计划，显示目标、依赖版本、索引/代理和构建权限，再执行。参数解析限制允许选项，requirements递归依赖必须审阅；物理路径检查还需防检查后替换，因此仅realpath不足以解决竞态。真正不可信包安装应由宿主提供容器或等效系统隔离，这引入镜像维护、兼容和存储负担，不能说加一层路径guard即可完成。

状态所有权：宿主拥有根与权限，插件拥有计划及环境映射，包管理器负责解析，操作系统隔离负责包构建副作用，模型只能提出计划。测试对照现有流程，使用单根正常安装、多根同名环境、链接外指、普通spec选项、requirements间接引用、异常中止与第二进程竞争七类输入。预先要求所有非允许目标写入均被拒绝且正常任务仍可完成；同时记录确认次数、总时长与误拒绝。只要有外部写入，或相同正确率下人工负担明显更高且没有风险收益，即否定当前设计版本。整个方案保持假设，不能计为本插件创新分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/venv.js:56-73](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/venv.js#L56-L73)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/venv.js` · 行 56–73。文件 SHA-256：`6b9ca9e90ac3b590b4c2e903315f7826a09df9cde227b74a45f8c6f13df2db64`。

跨根目标自动选择是计划显式化的推导起点。

```text
  const candidates = []
  const seen = new Set()
  for (const root of [ws, ...extraRoots]) {
    for (const candidate of await discoverVenvCandidates(root)) {
      if (!candidate.byMarker) continue
      const key = process.platform === 'win32' ? candidate.dir.toLowerCase() : candidate.dir
      if (seen.has(key)) continue
      seen.add(key)
      candidates.push(candidate)
    }
  }
  if (candidates.length === 0) return null
  if (candidates.length === 1) return candidates[0].dir
  const preferred = candidates.find((candidate) => candidate.name.toLowerCase() === '.venv')
  if (preferred !== undefined) return preferred.dir
  throw new Error(
    'multiple virtual environments found; pass "venv" to choose: ' + candidates.map((candidate) => candidate.dir).join(', '),
  )
```

**依据 2 · 源码核查**：[lib/pip.js:115-120](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L115-L120)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/pip.js` · 行 115–120。文件 SHA-256：`5b532a17253dacbbed3687811aa732205d0d14f14e9c8118af9ba267cd848087`。

自由参数与实际执行参数衔接需要约束。

```text
  if (upgrade === true) argv.push('--upgrade')
  if (indexUrl !== undefined && indexUrl !== null) argv.push('--index-url', indexUrl)
  if (proxyUrl !== undefined && proxyUrl !== null) argv.push('--proxy', proxyUrl)
  if (requirementsPath !== undefined) argv.push('-r', requirementsPath)
  for (const spec of specs) argv.push(spec)
  return argv
```

**依据 3 · 源码核查**：[lib/guard.js:59-66](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/guard.js#L59-L66)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/guard.js` · 行 59–66。文件 SHA-256：`e1660aaa9cae29529636dc3a054fc9205b54345427ae35aed06df1b29db98d0c`。

当前权限来源是路径集合，没有环境对象身份。

```text
export function guardAllowedPath(requested, sessionRoot, extraRoots, label) {
  const primary = resolve(sessionRoot)
  const target = resolve(primary, requested === undefined || String(requested).trim().length === 0 ? primary : requested)
  const roots = [primary, ...(Array.isArray(extraRoots) ? extraRoots : [])]
  for (const root of roots) {
    if (isWithin(resolve(root), target)) return target
  }
  throw new OutsideWorkspaceError(target, primary, label)
```

#### 未知项

- **未知：**设计未实现，隔离能力和用户确认负担未知。
  **影响：**不能主张安全性或端到端效率已改善。
  **下一步：**先实现仅可审阅计划的原型，在丢弃环境跑预设反例与手工基线。

<a id="research-q09"></a>

<a id="detail-section-18"></a>

### Q09 · 现在适合谁试用，怎样验收并决定停止？

**研究主题：**采用判断

**回答状态：**部分回答，仍有缺口

#### 完整回答

当前建议为观察：确有工具接线与错误解释的价值，但核心补偿控制存在静态缺口，不宜直接给需要工作区隔离保证的常规DSH profile启用。观察不是认定全部功能失效；有能力审阅输入并提供无敏感数据、可丢弃系统环境的维护者，可以验证它作为可信包管理便利层的价值，这属于后续受控研究路径，不是本次已完成试用。

开始前确认宿主版本与服务、显式目标环境、可信固定依赖和索引；不要让模型自由处理陌生包或requirements。验收至少包括工具加载、只读会话拒绝四写操作、正确环境安装与解释器运行、网络失败可解释、取消/超时无孤儿任务、禁用插件后环境仍可处理。关键反例是外指链接和参数改写：不能在不验证它们前依赖“仅写工作区”。

停止标准是目标歧义、任何非允许写入、错误报告掩盖失败或任务需要绕过既定权限。未来若修复约束、完成宿主验证且对照证明负担值得，再考虑限定试用或持续安装。本次只有源码证据，不升级为安装推荐；推荐评分独立衡量场景、额外价值、证据与成本，不拿热度或创新分代替。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-43](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/README.md#L23-L43)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `README.md` · 行 23–43。文件 SHA-256：`286a6abbb6b8a7ff576670d3c5b38adc35ef35bb14706f78739de676ca5b3b27`。

安装前提与重启要求。

````text
## Requirements

- Node.js >= 20
- A DSH profile composed from `@deepseek-ai/dsh-base` (it provides the `subprocess`, `jobs`, `tools`, and `skills` services the plugin uses)
- Python >= 3.8 (on PATH, or passed explicitly) — only for the environments the plugin manages

## Install

From npm:

```bash
dsh plugin --profile web add dsh-python-env
```

From a local checkout (development):

```bash
dsh plugin --profile web add link:<absolute-path-to-this-repo>
```

Then **restart the DSH backend** — the host composition loads at process start. The tools appear in new sessions: `pyenv_discover`, `pyenv_create`, `pyenv_install`, `pyenv_uninstall`, `pyenv_remove`, plus the `python-env` skill.
````

**依据 2 · 源码核查**：[lib/policy.js:27-40](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/policy.js#L27-L40)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/policy.js` · 行 27–40。文件 SHA-256：`773db36fe50e84beef6f9319f4e48511e3f5b76273b6d8fbef1178d5ee909548`。

只读与缺策略的验收基准。

```text
export function assertWritableSession(ctx, exec, action) {
  const mode = sessionSandboxMode(ctx, exec)
  if (mode === undefined) {
    throw new Error(
      "dsh-python-env: cannot " + action + ': no sandbox policy service is mounted, so the session\'s write permission cannot be verified',
    )
  }
  if (!WRITABLE_MODES.includes(mode)) {
    throw new Error(
      'dsh-python-env: cannot ' + action + ': the session is in "' + mode +
        '" mode, which forbids workspace mutations. Switch the session to workspace-write or danger-full-access first.',
    )
  }
  return mode
```

**依据 3 · 源码核查**：[lib/tools/install.js:174-196](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js#L174-L196)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/tools/install.js` · 行 174–196。文件 SHA-256：`5582df9738f3cf6450ded7a7cfcfc312c150b06f9aef47df3051b253a170eb2e`。

采用建议受参数边界缺口影响。

```text
          const specs = []
          if (args.packages !== undefined) {
            if (!Array.isArray(args.packages)) throw new Error('packages must be an array of requirement strings')
            for (const raw of args.packages) {
              const spec = typeof raw === 'string' ? raw.trim() : ''
              if (spec.length === 0) continue
              if (spec.length > MAX_SPEC_LENGTH) {
                throw new Error('package spec too long (max ' + MAX_SPEC_LENGTH + '): ' + spec.slice(0, 80) + '...')
              }
              specs.push(spec)
            }
            if (specs.length > MAX_PACKAGES) throw new Error('too many packages (max ' + MAX_PACKAGES + ')')
          }
          let requirementsPath
          if (args.requirements !== undefined && String(args.requirements).trim().length > 0) {
            requirementsPath = guardAllowedPath(args.requirements, ws, extraRoots, 'requirements')
            const info = await stat(requirementsPath)
            if (!info.isFile()) throw new Error('requirements is not a file: ' + requirementsPath)
          }
          if (specs.length === 0 && requirementsPath === undefined) {
            throw new Error('nothing to install: pass "packages" and/or a "requirements" file')
          }
          const normalizedSpecs = validateAndNormalizeSpecs(specs, ws, extraRoots)
```

**依据 4 · 源码核查**：[lib/skill.js:31-43](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/skill.js#L31-L43)

Git 定位：仓库 `https://github.com/AngelosZou/dsh-python-env` · 提交 `d24039c579b644101577383ef5734fff78d43439` · 相对路径 `lib/skill.js` · 行 31–43。文件 SHA-256：`c6bfa918d36aff59287e2d36bdacbe25c4d143f5354b59037fa19c24c320beb4`。

显式解释器与第三方代码风险需继续人工承担。

```text
## Running code from an environment
Use the interpreter path the tools report with your normal shell tools:
- Windows: \`<venv>\\Scripts\\python.exe\`
- macOS/Linux: \`<venv>/bin/python\`
Run tests and scripts with that interpreter so installed packages are importable. Creating/installing stays with the tools; running code stays in the shell.

## Behavior notes
- The mutating tools (create / install / uninstall / remove) respect the session's sandbox mode: they refuse to run in read-only sessions. Discovery still works.
- Every tool is budgeted to finish within 2 minutes (discovery within 1). A tool that exceeds its budget terminates the running process tree and returns a detailed stop-reason (what was still running, attempts tried, last output, likely causes, next steps) instead of hanging; a per-call \`timeoutMs\` on install/uninstall is honored but capped at 120000 ms.
- \`pyenv_install\` repairs a missing pip via \`ensurepip\` automatically.
- On network failure the install retries across mirrors (TUNA, Aliyun, USTC) and probes common local proxy ports; pin a mirror/proxy with the \`index\`/\`proxy\` arguments when needed. If an install cannot finish within the 2-minute budget, retry with fewer packages or a pinned index/proxy instead of waiting.
- Every mutation stays inside the workspace (\`.dsh-pyenv\` holds caches and temp state); the global Python environment is never touched.
- Installing packages executes third-party code — install only what the task needs, prefer pinned versions, and remember any environment is disposable with \`pyenv_remove\`.
```

#### 未知项

- **未知：**没有安装、真实宿主、核心任务及禁用/卸载验收。
  **影响：**不足以建议持续安装或普通profile直接试用。
  **下一步：**先修约束并保存同版本宿主验收，按目标选择、路径反例及完整任务结果重新评估。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
