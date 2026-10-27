# DSH Cost Tracker

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[576f6e7](https://github.com/Angelyeye/dsh-cost-tracker/tree/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Angelyeye/dsh-cost-tracker) [![npm 30d 1,601](https://img.shields.io/static/v1?label=npm+30d&message=1%2C601&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@angelyeye/dsh-cost-tracker) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@angelyeye/dsh-cost-tracker)
<!-- END META -->

> **功能**：在DSH中记录模型调用用量与估算费用，提供账本、可视化、余额和可选云同步。

> **亮点**：[Q03](#research-q03)支持会话归属、计价时代与双轨口径的集成贡献；相对厂商账单增加会话解释，不将本地估算称为真实结算。

> **主要限制**：[Q04](#research-q04)指出无usage与价格规则会造成账单差额，且启动无条件修补宿主UI产物。仅本地账本并不能隔离这一写入；若不能准备可丢弃宿主副本和原文件备份，应观察而非在日常宿主直接试用，停插件也不证明产物还原。

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
  - [Q01 · 多模型用户怎样从会话用量得到可对账的费用结果？](#detail-section-11)
  - [Q02 · 一次流式调用如何进入账本，失败和缺usage时会怎样？](#detail-section-12)
  - [Q03 · 相对厂商账单或简单token脚本，增量在何处？](#detail-section-13)
  - [Q04 · 最可能使费用统计失真的前提是什么，是否有宿主副作用？](#detail-section-14)
  - [Q05 · 本地计量、余额和云端汇总的依赖应如何区分？](#detail-section-15)
  - [Q06 · 自动计量的全周期成本与恢复退路是什么？](#detail-section-16)
  - [Q07 · 哪些计量设计可复用，哪些恢复声明需降格？](#detail-section-17)
  - [Q08 · 如何让缺usage与价格不明不再静默变成低支出？](#detail-section-18)
  - [Q09 · 谁可先试本地统计，什么时候停止把结果当账单？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合反复使用多个模型、希望把会话token与日/月支出分开的DSH Web用户。交付物是按模型和日期归集的估算账本、真实按量与订阅等值的不同口径，以及可导出的明细/汇总。原办法是分别查厂商账单并手工映射会话；插件弥补会话维度和本地联查，但不替代供应商结算单。作者描述多机汇总为可选自建服务，不应将本地持久化声明理解为所有模式均不联网。

实质增量是把宿主会话标识、按时间选择计价时代、订阅等值分轨和明细/永久日汇总组合成可查询的本地账本。相比厂商账单，能解释单会话/模型而非仅账号总额；相比简单token乘现价，避免历史价格统一回算以及混算订阅等值。它是计量与工作流集成，不证明估算更接近真实结算；厂商账单仍是钱款基线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量账本 | 按会话模型归集token与估算金额 | 依赖usage，缺失可漏记 |
| 分轨口径 | 区分按量钱款与订阅等值 | 需核对价格与套餐分类 |
| 余额与配额 | 联查账户状态 | 对应账号凭据与联网 |
| 可选云汇总 | 合并多机用量 | 需另部署服务及设置同步 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| tools/webServer及usage流 | 本地核心必需 | 记录与查询 | 无usage请求不入账 |
| 可写本地存储 | 必需 | 账本持久化 | 失败需备份恢复 |
| 厂商凭据 | 查询余额配额必需 | 远端账户接口 | 本地统计可保留 |
| 自建云服务 | 云同步必需 | 多机并集 | 可只用本地 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装重启并核价 | 看板与工具可见 |
| 2 | 宿主输出usage并记账 | 明细与口径一致 |
| 3 | 用户对厂商账单 | 差额不能解释则停止结算用途 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主及磁盘，金额未知 | 安装、价格与订阅核对 | 耗时未测 |
| 持续 | 采集/落盘及可选云服务 | 维护价格与差额对账 | 不承诺节费 |
| 失败恢复 | 备份和重新导入资源 | 校验损坏、缺usage和重复数据 | 旧明细压缩不可逆 |
| 退出 | 云端数据和UI补丁可能保留 | 停插件并核对数据/备份 | 无痕卸载未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话费用归集 | usage钩子与按时间计价存在 | 与真实结算误差 |
| 本地历史 | 明细压缩为永久日汇总 | 多实例并发一致性 |
| 降低对账负担 | 具备查询导出入口 | 节时及减少差错的实测 |

> **思考**：[Q04](#research-q04)指出无usage与价格规则会造成账单差额，且启动无条件修补宿主UI产物。仅本地账本并不能隔离这一写入；若不能准备可丢弃宿主副本和原文件备份，应观察而非在日常宿主直接试用，停插件也不证明产物还原。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)支持会话归属、计价时代与双轨口径的集成贡献；相对厂商账单增加会话解释，不将本地估算称为真实结算。

计价逻辑、存储、凭据和导入分别拆模块，有助于独立复用。存储采用PID临时文件、rename及瞬时失败退避，并明确拒绝失败后直接覆盖，减少半文件风险；但这不解决多个实例的账本合并，注释说明实例锁只提示不阻断。可借鉴的是将金钱口径与展示分离、标注estimated、保留明细来源；移植需对齐usage事件和价格来源。测试文件存在不能视为本轮执行通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)指出无usage与价格规则会造成账单差额，且启动无条件修补宿主UI产物。仅本地账本并不能隔离这一写入；若不能准备可丢弃宿主副本和原文件备份，应观察而非在日常宿主直接试用，停插件也不证明产物还原。

<a id="detail-section-6"></a>

### 1.5 使用建议

只建议需要会话级费用线索且能准备可丢弃宿主副本的用户，先在该副本仅启本地账本，对正常、缓存、取消三类调用与厂商账单核对。启动ensureNavIconPatch无条件执行，仅本地不能隔离宿主产物写入；试用前要保留宿主原文件和插件自己的备份，并比较修改范围。若usage、价格或订阅口径解释不了差额，停止预算/结算用途；若补丁或退出残留不能核清，停插件并从独立原件恢复宿主，退回厂商账单与CSV对账。不能把停插件等同产物自动还原。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、store.js、credstore.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是把“已知计价记录”和“无法计价调用”分成双账簿，按会话显示覆盖率及差额待核对项，而非用已计费用代表总费用。推导来自无usage就跳过与estimated价格标签。对照同一批含取消请求的厂商账单，测双账簿是否提高差额定位率；若捕获不到独立请求标识或额外记录仍不能解释差额，就否定该设计。该假设不改变本版已实现能力。

**分析版本**

- **仓库**：[Angelyeye/dsh-cost-tracker](https://github.com/Angelyeye/dsh-cost-tracker)
- **版本号**：1.10.1（[固定提交 576f6e7](https://github.com/Angelyeye/dsh-cost-tracker/tree/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的已计价/待对账双账簿，以差额定位率检验是否比单总额更可用。

未验证假设是把“已知计价记录”和“无法计价调用”分成双账簿，按会话显示覆盖率及差额待核对项，而非用已计费用代表总费用。推导来自无usage就跳过与estimated价格标签。对照同一批含取消请求的厂商账单，测双账簿是否提高差额定位率；若捕获不到独立请求标识或额外记录仍不能解释差额，就否定该设计。该假设不改变本版已实现能力。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 15 | 10235 | 7669 | 2209 | — |
| .md | source | 6 | 2888 | — | — | 59744 |
| .mjs | source | 3 | 355 | 268 | 61 | — |
| .js | test | 22 | 6399 | 4972 | 1029 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Angelyeye/dsh-cost-tracker/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Angelyeye/dsh-cost-tracker/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Angelyeye/dsh-cost-tracker/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断DSH Cost Tracker的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多模型用户怎样从会话用量得到可对账的费用结果？

**研究主题**：场景与需求

#### 完整回答

适合反复使用多个模型、希望把会话token与日/月支出分开的DSH Web用户。交付物是按模型和日期归集的估算账本、真实按量与订阅等值的不同口径，以及可导出的明细/汇总。原办法是分别查厂商账单并手工映射会话；插件弥补会话维度和本地联查，但不替代供应商结算单。作者描述多机汇总为可选自建服务，不应将本地持久化声明理解为所有模式均不联网。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-51](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/README.md#L27-L51)

功能与真实账款/订阅等值分离声明

<details>
<summary>查看原文（25行）</summary>

```text
## 它能做什么?

| | 功能 | 说明 |
| --- | --- | --- |
| 💰 | **花费统计** | 每一次 API 调用自动记账:输入 / 输出 / 缓存命中 / 缓存写入 Tokens 与费用(缓存写入按缓存命中价计),按天、按模型聚合 |
| ⏰ | **峰谷定价** | 内置单价表,高峰时段(北京时间周一至周五 9:00–12:00、14:00–18:00,**不含中国法定节假日**)与闲时半价自动区分,**周末与法定节假日全天计为闲时**(节假日表 2026 全年 33 天,可在配置页覆盖/停用;调休补班的周六周日不计高峰),本地模型(ollama 等)计 0;**单价表按「计费时代」分版**(`legacy` / `v41`),北京时间 2026-09-10 12:00 起自动切换为 V4.1 Flash 新价(2.0 / 0.04 / 8.0 高峰),并按官方脚注把旧 V4-Flash 系请求路由到 V4.1 Flash 计费;**`deepseek-v4-pro` 维持自有牌价 9.0 / 27.0 / 0.30 不做路由**(官方 2026-09-14 撤销了下线计划) |
| 🔔 | **峰谷计价提示** | **设置 → 花费统计 → 右上角齿轮 → 峰谷计价与提示**(v1.9.0 起设置集中在此,改完即可预览;DSH 0.1.7-alpha.2 起入口在「花费统计」页头的齿轮,v1.9.3):当前档位/距下次切换倒计时时段条、样式切换(**简洁单行·按24h比例** / **环形表盘·相位色点**)、简洁样式可选**双行紧凑**(上下布局,条上文下/文上条下)、「显示时间」开关、峰/谷切换前弹窗提醒与浏览器系统通知、提前提醒分钟、弹窗位置(右下角/屏幕中心)、提醒类型;侧边栏底部常驻显示时段条(窄栏/展开自适应)。看板上的同名面板改为只读回显 |
| 📌 | **六组概览卡** | 设置页顶部六张卡:今日费用 / 本月费用 / 总花费 / API 请求次数 / Tokens / **总余额**。前三个金额卡**不含订阅会员等效费用**,订阅以附注展示 |
| 👁️ | **视觉模型** | 支持 `deepseek-v4-flash-vision-exp`:legacy 时代单价与 flash 一致,2026-09-10 12:00 起随 V4.1 Flash 新价计费(该旧名已下线,请求由 V4.1 Flash 提供);图片按官方规则换算 token(每张上限 384 个,以接口用量计费) |
| 🏷️ | **官方模型名对齐** | 计费支持**官方现役名 `deepseek-flash`**(价格卡脚注 (1):「模型名请使用 `deepseek-flash`」),旧写法 `deepseek-v4.1-flash` 等归一化后命中同一档价,避免因官方改名而落入兜底估算 |
| 📊 | **可视化仪表盘** | 设置页新增「花费统计」:概览卡片、消费柱状图(按峰谷/按模型)、分模型的请求次数与 Tokens 图表,**全部支持鼠标悬停查看明细** |
| 🧭 | **多机汇总(云端同步)** | 可对接**自建云端服务**(独立仓库 `dsh-cost-cloud`,零运行时依赖):多台电脑的用量汇总到一处,看板顶部出现 **本机 / 本机+云端 / 仅云端** 三态开关,并支持**设备 × Agent 矩阵**(行合计 = 列合计 = 总计);上报内容仅 token 数、费用、时间戳与标识符,可选会话脱敏 |
| 🔥 | **用量热力图** | 设置页新增「Token 用量统计」:类 Codex 的 **26 周日用量方格热图**,按天着色(输入 / 缓存 / 输出 / 费用),悬停看当日明细、今天高亮描边,顶部显示全时段累计;**跟随三态视图**——「本机+云端 / 仅云端」下自动并入云端按天用量(卡片标题右侧标注当前口径) |
| 📈 | **订阅配额监控** | Kimi Coding Plan、**火山方舟 Coding Plan** 等订阅套餐:配额进度条、重置倒计时、等效按量费用参考。火山方舟走管控面 OpenAPI(HMAC 签名),需 AccessKeyID + SecretAccessKey |
| 💳 | **余额查询** | 一键查询 DeepSeek 官方账户余额(总余额 / 充值 / 赠送 / 状态);**已登录 DSH 账号时直接读 Platform 钱包(充值 / 赠金),不再需要 API Key(v1.9.6)** |
| 🤖 | **Agent 工具** | 直接在对话里问:"我现在花了多少钱?"——Agent 会调用 `cost_stats` / `cost_prices` 等工具回答 |
| 🔻 | **状态栏** | 聊天输入框下方实时显示:**本会话花费**(胶囊分段:本会话 / 订阅套餐 / 分模型),按会话实际用到的模型与订阅拆分,**多模型默认折叠只显示 top2,点击展开全部明细**;订阅显示具体套餐名,不再展示配额与调用次数 |
| 👁️ | **界面显示开关** | 输入框上方的花费胶囊、侧边栏峰谷时段条、设置页「花费统计」看板**三个落点各自可关**(设置 → 花费统计 → 右上角齿轮 → 数据与界面 → 界面显示),勾选即刻生效;**只影响显示**,记账、云端同步与 Agent 工具照常,配置入口(齿轮页)本身不受开关控制 |
| 💾 | **本地持久化** | 数据存本机 `~/.dsh/storages/cost-tracker-records.json`,重启不丢、不上传;**明细保留最近 180 天,更早自动压缩为永久日汇总,全时段统计永远精确且内存/磁盘有界** |
| 🕰️ | **历史导入(v1.9.0)** | 回放宿主会话日志,**把装插件之前的对话调用补录进账本**(按各自时间戳的旧价计费);只补插件不可能记到的部分(安装前 / 停机缺口),幂等可重复执行,导入记录标记 `source=import` 以便区分 |
| 🔄 | **官方价格同步(v1.9.0)** | 一键抓取官方定价页、解析各模型峰价并对比差异,应用后构建**新的计费时代**(只影响之后,历史口径不回改);每日可自动核对(只提示、不自动应用),页面改版时宁可不同步也绝不写错价 |
| 🌐 | **多厂商价格目录(v1.9.0)** | 内置 15 家厂商 / 141 个模型条目(USD→CNY 按可配汇率折算),OpenAI / Anthropic / Gemini / Qwen 等内置表之外的模型也能按**精确价**入账;支持宽松/严格匹配与**手动覆盖价** |
| ⚖️ | **Plan 与按量双轨(v1.9.0)** | 工具栏「含 Plan 总额」开关一键切换口径:关闭只算按量真金白银、订阅以附注展示;打开则金额 = 按量 + 订阅等值,图表按天并入「订阅等值」段 |
| 🔐 | **凭据零落盘(v1.9.0)** | 云端令牌与火山 SecretAccessKey 只写 DSH 凭据库(配置文件零明文,旧版明文启动时自动迁移);任何响应只回显布尔;出站请求白名单 + 强制 https + 拒绝跟随重定向(防凭据外带) |
| 📤 | **CSV 导出** | 一键导出明细 + 日汇总(purpose=rollup),方便用 Excel / Numbers 做进一步分析 |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次流式调用如何进入账本，失败和缺usage时会怎样？

**研究主题**：功能与机制

#### 完整回答

插件监听llm/stream并透传chunk，在finally使用最后一个usage入账；没有usage则不创建费用记录。recordUsage读取provider/model/sessionId和purpose，以调用完成时刻选择价格并标准化token，store.add后安排落盘与同步。这个链路保留模型流式输出，但中途终止且无usage的调用可能产生供应商费用却无本地记录，因此完整账单不能由“每次API自动记账”文案保证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:614-657](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L614-L657)

实际采集钩子、finally和无usage分支

<details>
<summary>查看原文（44行）</summary>

```text
    function recordUsage(options, usage, ts) {
      const provider = toStr(options && options.provider)
      const model = toStr(options && options.model)
      if (!provider && !model) return
      const np = normProvider(provider)
      // 记下最近一次实际使用的 provider：summary 据此判断该预热哪家的配额缓存
      if (np) lastProviderSeen = np
      // 按「调用发生的时刻」选单价版本（跨 2026-09-10 12:00 / 2026-09-14 12:00 自动切换，无需重启）。
      // 视觉模型（deepseek-v4-flash-vision-exp）的图片 token 已含在接口
      // prompt_tokens 中（每张≤384 tokens），由 normalizeTokens 归入 input
      const tokens = normalizeTokens(usage)
      const price = priceForAt(np, model, ts, tokens)
      store.add({
        // 被路由的请求以「实际计费模型规范名」入账（如 V4-Pro → deepseek-flash、
        // 旧名 deepseek-v4-flash → deepseek-flash），使按模型聚合看到的就是真实计费口径。
        ts, provider, model: price.model,
        sessionId: toStr(options && options.sessionId),
        purpose: toStr(options && options.purpose),
        cost: price.cost,
        estimated: price.estimated,
        period: price.period,
        tokens,
        subscription: price.subscription,
        source: 'live', // v1.9.0：与历史导入（source:'import'）区分，覆盖判定只认 live
      })
      schedulePersist()
      scheduleSync(4000)
    }

    async function* wrapStream(source, options) {
      let usage = null
      try {
        for await (const chunk of source) {
          if (chunk && chunk.type === 'usage' && chunk.usage) usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          try { recordUsage(options, usage, Date.now()) } catch (e) { console.error('cost record failed', e) }
        }
      }
    }

    ctx.on('llm/stream', (options, next) => wrapStream(next(), options))
```

</details>

#### 缺口

- 无usage的异常请求有多少计费缺口未知
  **影响**：影响完整费用与账单对齐
  **进一步探讨**：对照供应商结算中的失败/取消调用与本地明细，按缺usage单列差额

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对厂商账单或简单token脚本，增量在何处？

**研究主题**：贡献与相对优势

#### 完整回答

实质增量是把宿主会话标识、按时间选择计价时代、订阅等值分轨和明细/永久日汇总组合成可查询的本地账本。相比厂商账单，能解释单会话/模型而非仅账号总额；相比简单token乘现价，避免历史价格统一回算以及混算订阅等值。它是计量与工作流集成，不证明估算更接近真实结算；厂商账单仍是钱款基线。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:614-640](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L614-L640)

会话与计价时代映射

<details>
<summary>查看原文（27行）</summary>

```text
    function recordUsage(options, usage, ts) {
      const provider = toStr(options && options.provider)
      const model = toStr(options && options.model)
      if (!provider && !model) return
      const np = normProvider(provider)
      // 记下最近一次实际使用的 provider：summary 据此判断该预热哪家的配额缓存
      if (np) lastProviderSeen = np
      // 按「调用发生的时刻」选单价版本（跨 2026-09-10 12:00 / 2026-09-14 12:00 自动切换，无需重启）。
      // 视觉模型（deepseek-v4-flash-vision-exp）的图片 token 已含在接口
      // prompt_tokens 中（每张≤384 tokens），由 normalizeTokens 归入 input
      const tokens = normalizeTokens(usage)
      const price = priceForAt(np, model, ts, tokens)
      store.add({
        // 被路由的请求以「实际计费模型规范名」入账（如 V4-Pro → deepseek-flash、
        // 旧名 deepseek-v4-flash → deepseek-flash），使按模型聚合看到的就是真实计费口径。
        ts, provider, model: price.model,
        sessionId: toStr(options && options.sessionId),
        purpose: toStr(options && options.purpose),
        cost: price.cost,
        estimated: price.estimated,
        period: price.period,
        tokens,
        subscription: price.subscription,
        source: 'live', // v1.9.0：与历史导入（source:'import'）区分，覆盖判定只认 live
      })
      schedulePersist()
      scheduleSync(4000)
```

</details>

**依据 2 · 源码核查**：[store.js:4-17](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/store.js#L4-L17)

明细压缩与序号策略

<details>
<summary>查看原文（14行）</summary>

```text
// 数据保留策略（v1.1.2 起）：
//   明细记录（details）保留最近 DETAIL_DAYS 天；更早的记录自动按
//   「天 + 模型」压缩为永久日汇总（rollups）。全时段统计 = 明细 + 汇总，
//   永远精确，且内存 / 磁盘 / 写入量有界。
//
// 云端同步支持（v1.8.0 起）：
//   · 每条明细带单调递增 `seq`（加载时补齐、写入时分配），云端凭它增量拉取；
//   · `resetEpoch` 在 clear() 时 +1，使「清空后重新导入」不被云端判为重复；
//   · seq 与 resetEpoch 随文件持久化，旧文件（无这两个字段）自动兼容升级。
//
// 文件格式：
//   v2: { v: 2, seq: n, resetEpoch: n, details: [...], rollups: { dayKey: { modelKey: entry } } }
//   v1（旧版裸数组）在 load() 时自动迁移；损坏文件自动备份为
//   .corrupt-<时间戳> 并从零开始，不阻断启动。
```

</details>

**依据 3 · 作者声明**：[README.md:47-49](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/README.md#L47-L49)

时代与双轨口径声明

```text
| 🔄 | **官方价格同步(v1.9.0)** | 一键抓取官方定价页、解析各模型峰价并对比差异,应用后构建**新的计费时代**(只影响之后,历史口径不回改);每日可自动核对(只提示、不自动应用),页面改版时宁可不同步也绝不写错价 |
| 🌐 | **多厂商价格目录(v1.9.0)** | 内置 15 家厂商 / 141 个模型条目(USD→CNY 按可配汇率折算),OpenAI / Anthropic / Gemini / Qwen 等内置表之外的模型也能按**精确价**入账;支持宽松/严格匹配与**手动覆盖价** |
| ⚖️ | **Plan 与按量双轨(v1.9.0)** | 工具栏「含 Plan 总额」开关一键切换口径:关闭只算按量真金白银、订阅以附注展示;打开则金额 = 按量 + 订阅等值,图表按天并入「订阅等值」段 |
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 最可能使费用统计失真的前提是什么，是否有宿主副作用？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键前提是usage、模型归一化、价格表和订阅分类同时匹配真实结算。finally只记最终usage，缺失则漏记，价格与时区更新又由规则承担。另一个明确副作用是启动会搜寻并直接修补宿主设置包client.js来改图标，备份后rename覆盖；这超出纯只读计量器，宿主升级或多插件补丁竞争需人工排查。已看见补丁行为，未运行并未证明它造成故障。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:154-197](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L154-L197)

实际写宿主产物及启动调用

<details>
<summary>查看原文（44行）</summary>

```text
export function ensureNavIconPatch(opts) {
  const log = (opts && opts.log) || (() => {})
  try {
    const entry = (opts && opts.entry) || (process.argv && process.argv[1]) || ''
    // 全局安装通常通过符号链接启动（如 /opt/homebrew/bin/dsh），需同时尝试 realpath
    const entries = [entry]
    try { const real = realpathSync(entry); if (real && real !== entry) entries.push(real) } catch (e) {}
    let shellFile = ''
    for (const e0 of entries) {
      let dir = dirname(e0)
      for (let i = 0; i < 8 && dir && dir !== dirname(dir); i++) {
        const candidate = join(dir, 'node_modules', '@deepseek-ai', 'dsh-client-ui-settings-general', 'lib', 'client.js')
        if (existsSync(candidate)) { shellFile = candidate; break }
        dir = dirname(dir)
      }
      if (shellFile) break
    }
    if (!shellFile) { log('skip: settings shell not found'); return false }
    const src = readFileSync(shellFile, 'utf8')
    if (src.includes('id === "cost-dashboard"')) { log('ok: already patched'); return true }
    const anchor = /function navIcon\(id\)\s*\{\s*/.exec(src)
    if (!anchor) { log('skip: navIcon() not found (shell layout changed?)'); return false }
    if (!src.includes('react_jsx_runtime') || !src.includes('SettingsRoot_module_css_default')) {
      log('skip: expected identifiers missing (shell layout changed?)'); return false
    }
    if (!existsSync(shellFile + '.cost-tracker-bak')) writeFileSync(shellFile + '.cost-tracker-bak', src)
    const at = anchor.index + anchor[0].length
    const tmp = shellFile + '.cost-tracker-tmp'
    writeFileSync(tmp, src.slice(0, at) + NAV_ICON_BRANCH + src.slice(at))
    renameSync(tmp, shellFile)
    log('ok: patch applied -> ' + shellFile)
    return true
  } catch (e) {
    log('skip: ' + String(e && e.message ? e.message : e))
    return false
  }
}

export default {
  name: 'cost-tracker',
  inject: ['tools', 'webServer'],
  apply(ctx) {
    // 侧边栏图标补丁自愈（DSH 升级覆盖外壳后自动重打；失败静默跳过）
    ensureNavIconPatch({ log: (m) => startupLog('[cost-tracker] nav-icon ' + m) })
```

</details>

**依据 2 · 源码核查**：[index.js:643-657](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L643-L657)

无usage不计费

<details>
<summary>查看原文（15行）</summary>

```text
    async function* wrapStream(source, options) {
      let usage = null
      try {
        for await (const chunk of source) {
          if (chunk && chunk.type === 'usage' && chunk.usage) usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          try { recordUsage(options, usage, Date.now()) } catch (e) { console.error('cost record failed', e) }
        }
      }
    }

    ctx.on('llm/stream', (options, next) => wrapStream(next(), options))
```

</details>

#### 缺口

- 估算与供应商最终结算的误差未提供同条件对照
  **影响**：不能用于财务结算或承诺节费
  **进一步探讨**：选含取消、缓存和订阅的固定调用集，逐笔对账并归因

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 本地计量、余额和云端汇总的依赖应如何区分？

**研究主题**：依赖、兼容与流程

#### 完整回答

本地计量需要宿主tools/webServer与llm/stream语义、可写存储和当前模型价格配置。余额、Kimi/火山配额才需要各自账号或凭据；云端汇总另依赖自建服务。凭据请求通过白名单、HTTPS与手动重定向路径，不能因存在凭据库就认为所有自建端点安全。用户可先仅本地统计以收窄服务依赖，禁用显示不会停止记账与同步，退出应停插件而非只关UI。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:48-89](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L48-L89)

可选云端、计费与凭据配置

<details>
<summary>查看原文（42行）</summary>

```text
const SyncSchema = Schema.object({
  deviceName: Schema.string().default(undefined).description('本机在看板上显示的名字'),
  cloudEnabled: Schema.boolean().default(undefined).description('启用云端同步'),
  cloudUrl: Schema.string().default(undefined).description('云端服务地址，如 https://cost.example.com'),
  cloudToken: Schema.string().role('secret').default(undefined).description('共享引导令牌（保存后写入 DSH 凭据库，配置文件不落明文）'),
  syncIntervalSec: Schema.natural().default(undefined).description('自动同步间隔秒（15-3600）'),
  syncBatchSize: Schema.natural().default(undefined).description('单批明细条数（50-2000）'),
  maskSessionId: Schema.boolean().default(undefined).description('会话脱敏（上报前做不可逆哈希）'),
  includePurpose: Schema.boolean().default(undefined).description('上报 purpose（项目归属）'),
  syncRollups: Schema.boolean().default(undefined).description('上报历史日汇总快照'),
  syncSinceDays: Schema.natural().default(undefined).description('补传起始窗口天数（0 = 不限）'),
  cloudView: Schema.string().default(undefined).description('看板视图：local / local+cloud / cloud'),
  // 峰谷计价与提示（v1.9.0 起配置卡是唯一编辑入口，设置页只读展示）
  peakEnabled: Schema.boolean().default(undefined).description('启用 DeepSeek 峰谷时段价格'),
  peakNotice: Schema.boolean().default(undefined).description('峰时高价时段显著提示'),
  peakStyle: Schema.string().default(undefined).description('时段条样式：compact / classic'),
  peakShowTickLabels: Schema.boolean().default(undefined).description('环形表盘显示时间刻度'),
  peakCompactStack: Schema.boolean().default(undefined).description('简洁样式双行紧凑（上下布局）'),
  peakCompactOrder: Schema.string().default(undefined).description('双行紧凑排布：bar-first / text-first'),
  peakAlertEnabled: Schema.boolean().default(undefined).description('峰/谷切换前弹窗提醒'),
  peakAlertAhead: Schema.natural().default(undefined).description('提前提醒分钟数（1-30）'),
  peakAlertTarget: Schema.string().default(undefined).description('提醒类型：both / peak / offpeak'),
  peakAlertPosition: Schema.string().default(undefined).description('弹窗位置：corner / center'),
  peakAlertWebNotify: Schema.boolean().default(undefined).description('同步发送浏览器系统通知'),
  peakHolidays: Schema.string().default(undefined).description('中国法定节假日列表（空=内置表；none=停用；否则 "YYYY-MM-DD" 逗号/空白分隔）'),
  // 双轨计费 + 价格目录（v1.9.0）
  showTotalWithPlan: Schema.boolean().default(undefined).description('金额含 Plan 等值总额（关闭只算按量）'),
  priceMatch: Schema.string().default(undefined).description('目录匹配模式：fuzzy / exact'),
  catalogFxRate: Schema.natural().default(undefined).description('目录价 USD→CNY 汇率'),
  planOverrides: Schema.any().default(undefined).description('订阅归类覆盖 {provider/model|provider/*: plan|api}'),
  priceOverrides: Schema.any().default(undefined).description('手动覆盖价 {provider/model: {input,output,cacheRead,cacheWrite}}'),
  // 历史导入 + 价格同步（v1.9.0）
  autoImport: Schema.boolean().default(undefined).description('启动时自动回放宿主会话日志补录历史'),
  priceSyncUrl: Schema.string().default(undefined).description('官方定价页地址'),
  priceSyncAutoCheck: Schema.boolean().default(undefined).description('每日自动核对官方价（只提示不应用）'),
  // 界面显示（v1.8.12）：三个前端落点各自显隐，缺省/非布尔 = 可见
  uiDockEnabled: Schema.boolean().default(undefined).description('显示输入框上方的花费胶囊'),
  uiPeakEnabled: Schema.boolean().default(undefined).description('显示侧边栏峰谷时段条'),
  uiDashboardEnabled: Schema.boolean().default(undefined).description('显示设置页「花费统计」看板'),
  // 火山方舟配额（v1.8.14）：AK 明文（控制台可见），SK 保存后写入 DSH 凭据库
  volcengineAccessKeyId: Schema.string().default(undefined).description('火山引擎 AccessKeyID（留空则用凭据库 / 环境变量）'),
  volcengineSecretAccessKey: Schema.string().role('secret').default(undefined).description('火山引擎 SecretAccessKey（保存后写入凭据库，不落配置文件）'),
```

</details>

**依据 2 · 源码核查**：[index.js:192-197](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L192-L197)

必需宿主服务

```text
export default {
  name: 'cost-tracker',
  inject: ['tools', 'webServer'],
  apply(ctx) {
    // 侧边栏图标补丁自愈（DSH 升级覆盖外壳后自动重打；失败静默跳过）
    ensureNavIconPatch({ log: (m) => startupLog('[cost-tracker] nav-icon ' + m) })
```

**依据 3 · 源码核查**：[credstore.js:145-158](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/credstore.js#L145-L158)

非本机HTTPS约束

<details>
<summary>查看原文（14行）</summary>

```text
 */
export function assertAllowedHost(url, allowHosts) {
  const host = hostnameOf(url)
  if (!host) return { ok: false, reason: 'URL 无法解析', host: '' }
  const list = (allowHosts || []).map((h) => String(h || '').toLowerCase()).filter(Boolean)
  const lower = host.toLowerCase()
  if (list.length && list.indexOf(lower) < 0) {
    return { ok: false, reason: '目标主机不在出站白名单内：' + lower + '（允许：' + list.join(', ') + '）', host: lower }
  }
  const proto = String(new URL(String(url)).protocol || '').toLowerCase()
  if (proto !== 'https:' && !isLoopbackHost(host)) {
    return { ok: false, reason: '非本机地址必须使用 https（当前 ' + proto + '）', host: lower }
  }
  return { ok: true, reason: '', host: lower }
```

</details>

**依据 4 · 作者声明**：[README.md:44-50](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/README.md#L44-L50)

显隐和凭据边界声明

```text
| 👁️ | **界面显示开关** | 输入框上方的花费胶囊、侧边栏峰谷时段条、设置页「花费统计」看板**三个落点各自可关**(设置 → 花费统计 → 右上角齿轮 → 数据与界面 → 界面显示),勾选即刻生效;**只影响显示**,记账、云端同步与 Agent 工具照常,配置入口(齿轮页)本身不受开关控制 |
| 💾 | **本地持久化** | 数据存本机 `~/.dsh/storages/cost-tracker-records.json`,重启不丢、不上传;**明细保留最近 180 天,更早自动压缩为永久日汇总,全时段统计永远精确且内存/磁盘有界** |
| 🕰️ | **历史导入(v1.9.0)** | 回放宿主会话日志,**把装插件之前的对话调用补录进账本**(按各自时间戳的旧价计费);只补插件不可能记到的部分(安装前 / 停机缺口),幂等可重复执行,导入记录标记 `source=import` 以便区分 |
| 🔄 | **官方价格同步(v1.9.0)** | 一键抓取官方定价页、解析各模型峰价并对比差异,应用后构建**新的计费时代**(只影响之后,历史口径不回改);每日可自动核对(只提示、不自动应用),页面改版时宁可不同步也绝不写错价 |
| 🌐 | **多厂商价格目录(v1.9.0)** | 内置 15 家厂商 / 141 个模型条目(USD→CNY 按可配汇率折算),OpenAI / Anthropic / Gemini / Qwen 等内置表之外的模型也能按**精确价**入账;支持宽松/严格匹配与**手动覆盖价** |
| ⚖️ | **Plan 与按量双轨(v1.9.0)** | 工具栏「含 Plan 总额」开关一键切换口径:关闭只算按量真金白银、订阅以附注展示;打开则金额 = 按量 + 订阅等值,图表按天并入「订阅等值」段 |
| 🔐 | **凭据零落盘(v1.9.0)** | 云端令牌与火山 SecretAccessKey 只写 DSH 凭据库(配置文件零明文,旧版明文启动时自动迁移);任何响应只回显布尔;出站请求白名单 + 强制 https + 拒绝跟随重定向(防凭据外带) |
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 自动计量的全周期成本与恢复退路是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需要安装、重启和价格/订阅口径确认，不能默认所有内置模型价匹配合同价。持续承担采集、落盘、价格维护和可选云同步，资源和时间未测。180天明细压缩为日汇总，长期明细粒度不能恢复；损坏文件备份并从零开始，用户要用备份或供应商账单对账。停插件可退出采集，历史数据独立于包目录，但宿主图标补丁与云端数据需要另核对，不能接受“卸载无痕”为已验证结论。

#### 证据与依据

**依据 1 · 源码核查**：[store.js:4-17](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/store.js#L4-L17)

明细压缩与损坏处理

<details>
<summary>查看原文（14行）</summary>

```text
// 数据保留策略（v1.1.2 起）：
//   明细记录（details）保留最近 DETAIL_DAYS 天；更早的记录自动按
//   「天 + 模型」压缩为永久日汇总（rollups）。全时段统计 = 明细 + 汇总，
//   永远精确，且内存 / 磁盘 / 写入量有界。
//
// 云端同步支持（v1.8.0 起）：
//   · 每条明细带单调递增 `seq`（加载时补齐、写入时分配），云端凭它增量拉取；
//   · `resetEpoch` 在 clear() 时 +1，使「清空后重新导入」不被云端判为重复；
//   · seq 与 resetEpoch 随文件持久化，旧文件（无这两个字段）自动兼容升级。
//
// 文件格式：
//   v2: { v: 2, seq: n, resetEpoch: n, details: [...], rollups: { dayKey: { modelKey: entry } } }
//   v1（旧版裸数组）在 load() 时自动迁移；损坏文件自动备份为
//   .corrupt-<时间戳> 并从零开始，不阻断启动。
```

</details>

**依据 2 · 源码核查**：[store.js:90-130](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/store.js#L90-L130)

临时写rename失败不直接覆盖

<details>
<summary>查看原文（41行）</summary>

```text
/**
 * 原子落盘：写临时文件 → rename 覆盖目标。
 *
 * · 临时文件名带 **pid**：两个实例各写各的临时文件，不会互相盖掉半个文件
 *   （旧实现固定用 `<file>.tmp`，两实例必然抢同一个临时文件）。
 * · rename 遇瞬时占用时按 20/40/80/160ms 退避重试（默认 5 次，约 0.3s）。
 * · 仍失败**不做**「直接覆盖写」：那会让并发读方看到半个 JSON，而 store.load()
 *   一旦读到半个 JSON 会把文件改名为 `.corrupt-*` 并清空 —— 损失远大于「晚几秒落盘」。
 *   数据留在内存里，由调用方稍后重试（见 index.js 的 writeRecords 重试链）。
 *
 * @returns {{ok:boolean, attempts:number, mode:'rename'|'failed', error?:Error|null, transient?:boolean}}
 */
export function writeFileAtomic(filePath, data, opts) {
  const o = opts || {}
  const fs = Object.assign({ mkdirSync, writeFileSync, renameSync, unlinkSync }, o.fs || {})
  const sleep = o.sleep || sleepSync
  const tries = Math.max(1, Number(o.tries) || 5)
  const tmp = filePath + '.' + process.pid + '.tmp'
  const cleanup = () => { try { fs.unlinkSync(tmp) } catch (e) { /* 已被 rename 走或从未创建 */ } }
  try {
    fs.mkdirSync(dirname(filePath), { recursive: true, mode: PRIVATE_DIR_MODE })
    fs.writeFileSync(tmp, data, { encoding: 'utf8', mode: PRIVATE_FILE_MODE })
  } catch (e) {
    cleanup()
    return { ok: false, attempts: 0, mode: 'failed', error: e, transient: isTransientRenameError(e) }
  }
  let attempts = 0
  let last = null
  for (let i = 0; i < tries; i++) {
    attempts += 1
    try {
      fs.renameSync(tmp, filePath)
      return { ok: true, attempts, mode: 'rename', error: last }
    } catch (e) {
      last = e
      if (!isTransientRenameError(e)) break
      if (i < tries - 1) sleep(20 * Math.pow(2, i))
    }
  }
  cleanup()
  return { ok: false, attempts, mode: 'failed', error: last, transient: isTransientRenameError(last) }
```

</details>

**依据 3 · 作者声明**：[README.md:169-169](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/README.md#L169-L169)

数据路径独立声明

```text
**数据不会丢**:用量记录在 `~/.dsh/storages/cost-tracker-records.json`,与插件目录、包名、安装方式全都无关。
```

#### 缺口

- 宿主UI补丁卸载后的恢复完整性和全周期采用耗时未知
  **影响**：仅停插件不能证明宿主产物还原，成本退路需独立备份
  **进一步探讨**：在可丢弃宿主安装中核对启动前后产物与备份，显式恢复并核验hash；另记录计价维护和对账人工时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些计量设计可复用，哪些恢复声明需降格？

**研究主题**：工程质量与复用

#### 完整回答

计价逻辑、存储、凭据和导入分别拆模块，有助于独立复用。存储采用PID临时文件、rename及瞬时失败退避，并明确拒绝失败后直接覆盖，减少半文件风险；但这不解决多个实例的账本合并，注释说明实例锁只提示不阻断。可借鉴的是将金钱口径与展示分离、标注estimated、保留明细来源；移植需对齐usage事件和价格来源。测试文件存在不能视为本轮执行通过。

#### 证据与依据

**依据 1 · 源码核查**：[store.js:90-130](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/store.js#L90-L130)

原子文件保存与拒绝半写降级

<details>
<summary>查看原文（41行）</summary>

```text
/**
 * 原子落盘：写临时文件 → rename 覆盖目标。
 *
 * · 临时文件名带 **pid**：两个实例各写各的临时文件，不会互相盖掉半个文件
 *   （旧实现固定用 `<file>.tmp`，两实例必然抢同一个临时文件）。
 * · rename 遇瞬时占用时按 20/40/80/160ms 退避重试（默认 5 次，约 0.3s）。
 * · 仍失败**不做**「直接覆盖写」：那会让并发读方看到半个 JSON，而 store.load()
 *   一旦读到半个 JSON 会把文件改名为 `.corrupt-*` 并清空 —— 损失远大于「晚几秒落盘」。
 *   数据留在内存里，由调用方稍后重试（见 index.js 的 writeRecords 重试链）。
 *
 * @returns {{ok:boolean, attempts:number, mode:'rename'|'failed', error?:Error|null, transient?:boolean}}
 */
export function writeFileAtomic(filePath, data, opts) {
  const o = opts || {}
  const fs = Object.assign({ mkdirSync, writeFileSync, renameSync, unlinkSync }, o.fs || {})
  const sleep = o.sleep || sleepSync
  const tries = Math.max(1, Number(o.tries) || 5)
  const tmp = filePath + '.' + process.pid + '.tmp'
  const cleanup = () => { try { fs.unlinkSync(tmp) } catch (e) { /* 已被 rename 走或从未创建 */ } }
  try {
    fs.mkdirSync(dirname(filePath), { recursive: true, mode: PRIVATE_DIR_MODE })
    fs.writeFileSync(tmp, data, { encoding: 'utf8', mode: PRIVATE_FILE_MODE })
  } catch (e) {
    cleanup()
    return { ok: false, attempts: 0, mode: 'failed', error: e, transient: isTransientRenameError(e) }
  }
  let attempts = 0
  let last = null
  for (let i = 0; i < tries; i++) {
    attempts += 1
    try {
      fs.renameSync(tmp, filePath)
      return { ok: true, attempts, mode: 'rename', error: last }
    } catch (e) {
      last = e
      if (!isTransientRenameError(e)) break
      if (i < tries - 1) sleep(20 * Math.pow(2, i))
    }
  }
  cleanup()
  return { ok: false, attempts, mode: 'failed', error: last, transient: isTransientRenameError(last) }
```

</details>

**依据 2 · 源码核查**：[store.js:142-145](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/store.js#L142-L145)

实例锁只提示

```text
// ---------- 实例锁（只提示，不阻断） ----------
/** 进程是否存活：Windows 上 EPERM 表示「存在但无权限」，同样算存活 */
function pidAlive(pid) {
  try {
```

**依据 3 · 源码核查**：[index.js:12-37](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L12-L37)

计价存储导入模块边界

<details>
<summary>查看原文（26行）</summary>

```text
import { createStore, collectTotals, DETAIL_DAYS, MAX_AXIS_DAYS, PRIVATE_DIR_MODE, PRIVATE_FILE_MODE } from './store.js'
import { PRICE_ERAS, V41_EFFECTIVE_AT, exactModelsAt, eraAt, SUBSCRIPTION_RATES, PROVIDER_RATES, GENERIC_RATES, PEAK_WINDOWS, PEAK_HOUR_WINDOWS, isPeak, peakPhaseAt, priceFor, computeCost, normalizeTokens, subscriptionPlanFor, volcenginePlanModels, VOLCENGINE_PLAN_PROVIDER_KEYS, VOLCENGINE_PLAN_RATES, setSyncedEras, getSyncedEras, setPriceOverrides, getPriceOverrides, setPeakHolidays, getPeakHolidays } from './pricing.js'
import {
  normalizePeakConfig, defaultPeakConfig, peakEffective,
  normalizeCloudConfig, defaultCloudConfig, normalizePluginConfig,
  normalizeUiConfig, defaultUiConfig, UI_SURFACES,
  normalizeVolcengineConfig, defaultVolcengineConfig,
  normalizeBillingConfig, defaultBillingConfig,
  normalizeImportConfig, defaultImportConfig,
  normalizePriceSyncConfig, defaultPriceSyncConfig,
  normalizeSecurityConfig, defaultSecurityConfig,
  DEFAULT_PRICING_DOC_URL,
} from './config.js'
import {
  queryVolcenginePlan, VOLCENGINE_KEY_ENVS, VOLCENGINE_SECRET_ENVS, VOLC_WINDOW_LABELS,
} from './volcengine.js'
import { createSyncEngine, setPluginVersion, SOURCE as SYNC_SOURCE, SYNC_VERSION, loadIdentity } from './sync.js'
import { Schema } from './schema.js'
import { catalogEntryFor, CATALOG_META, catalogProviders, catalogFingerprint, CATALOG_FX_DEFAULT } from './vendor-catalog.js'
import { fetchOfficialPrices, buildSyncedEra, diffAgainstEra } from './price-sync.js'
import { createCredSeam, migrateLegacySecrets, safeFetch, CRED_REFS, hostnameOf } from './credstore.js'
// 账号登录态（DSH 0.2.1-rc.2+）余额投影：纯函数，单独成文件便于单测
import { accountClientMeta, mapAccountBalance, accountBalanceFailure } from './account.js'
// 跨版本读取 settings（0.2.x 的 SettingsForms 已无 get()，改走 describe()）
import { readSettingsSection } from './settings.js'
import { listSessionLogs, planAndBuildImports, loadManifest, IMPORT_SOURCE } from './import.js'
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何让缺usage与价格不明不再静默变成低支出？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把“已知计价记录”和“无法计价调用”分成双账簿，按会话显示覆盖率及差额待核对项，而非用已计费用代表总费用。推导来自无usage就跳过与estimated价格标签。对照同一批含取消请求的厂商账单，测双账簿是否提高差额定位率；若捕获不到独立请求标识或额外记录仍不能解释差额，就否定该设计。该假设不改变本版已实现能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:614-657](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L614-L657)

无usage缺口及estimated字段支持假设

<details>
<summary>查看原文（44行）</summary>

```text
    function recordUsage(options, usage, ts) {
      const provider = toStr(options && options.provider)
      const model = toStr(options && options.model)
      if (!provider && !model) return
      const np = normProvider(provider)
      // 记下最近一次实际使用的 provider：summary 据此判断该预热哪家的配额缓存
      if (np) lastProviderSeen = np
      // 按「调用发生的时刻」选单价版本（跨 2026-09-10 12:00 / 2026-09-14 12:00 自动切换，无需重启）。
      // 视觉模型（deepseek-v4-flash-vision-exp）的图片 token 已含在接口
      // prompt_tokens 中（每张≤384 tokens），由 normalizeTokens 归入 input
      const tokens = normalizeTokens(usage)
      const price = priceForAt(np, model, ts, tokens)
      store.add({
        // 被路由的请求以「实际计费模型规范名」入账（如 V4-Pro → deepseek-flash、
        // 旧名 deepseek-v4-flash → deepseek-flash），使按模型聚合看到的就是真实计费口径。
        ts, provider, model: price.model,
        sessionId: toStr(options && options.sessionId),
        purpose: toStr(options && options.purpose),
        cost: price.cost,
        estimated: price.estimated,
        period: price.period,
        tokens,
        subscription: price.subscription,
        source: 'live', // v1.9.0：与历史导入（source:'import'）区分，覆盖判定只认 live
      })
      schedulePersist()
      scheduleSync(4000)
    }

    async function* wrapStream(source, options) {
      let usage = null
      try {
        for await (const chunk of source) {
          if (chunk && chunk.type === 'usage' && chunk.usage) usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          try { recordUsage(options, usage, Date.now()) } catch (e) { console.error('cost record failed', e) }
        }
      }
    }

    ctx.on('llm/stream', (options, next) => wrapStream(next(), options))
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁可先试本地统计，什么时候停止把结果当账单？

**研究主题**：采用判断

#### 完整回答

只建议需要会话级费用线索且能准备可丢弃宿主副本的用户，先在该副本仅启本地账本，对正常、缓存、取消三类调用与厂商账单核对。启动ensureNavIconPatch无条件执行，仅本地不能隔离宿主产物写入；试用前要保留宿主原文件和插件自己的备份，并比较修改范围。若usage、价格或订阅口径解释不了差额，停止预算/结算用途；若补丁或退出残留不能核清，停插件并从独立原件恢复宿主，退回厂商账单与CSV对账。不能把停插件等同产物自动还原。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:154-197](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L154-L197)

补丁副作用与退路边界

<details>
<summary>查看原文（44行）</summary>

```text
export function ensureNavIconPatch(opts) {
  const log = (opts && opts.log) || (() => {})
  try {
    const entry = (opts && opts.entry) || (process.argv && process.argv[1]) || ''
    // 全局安装通常通过符号链接启动（如 /opt/homebrew/bin/dsh），需同时尝试 realpath
    const entries = [entry]
    try { const real = realpathSync(entry); if (real && real !== entry) entries.push(real) } catch (e) {}
    let shellFile = ''
    for (const e0 of entries) {
      let dir = dirname(e0)
      for (let i = 0; i < 8 && dir && dir !== dirname(dir); i++) {
        const candidate = join(dir, 'node_modules', '@deepseek-ai', 'dsh-client-ui-settings-general', 'lib', 'client.js')
        if (existsSync(candidate)) { shellFile = candidate; break }
        dir = dirname(dir)
      }
      if (shellFile) break
    }
    if (!shellFile) { log('skip: settings shell not found'); return false }
    const src = readFileSync(shellFile, 'utf8')
    if (src.includes('id === "cost-dashboard"')) { log('ok: already patched'); return true }
    const anchor = /function navIcon\(id\)\s*\{\s*/.exec(src)
    if (!anchor) { log('skip: navIcon() not found (shell layout changed?)'); return false }
    if (!src.includes('react_jsx_runtime') || !src.includes('SettingsRoot_module_css_default')) {
      log('skip: expected identifiers missing (shell layout changed?)'); return false
    }
    if (!existsSync(shellFile + '.cost-tracker-bak')) writeFileSync(shellFile + '.cost-tracker-bak', src)
    const at = anchor.index + anchor[0].length
    const tmp = shellFile + '.cost-tracker-tmp'
    writeFileSync(tmp, src.slice(0, at) + NAV_ICON_BRANCH + src.slice(at))
    renameSync(tmp, shellFile)
    log('ok: patch applied -> ' + shellFile)
    return true
  } catch (e) {
    log('skip: ' + String(e && e.message ? e.message : e))
    return false
  }
}

export default {
  name: 'cost-tracker',
  inject: ['tools', 'webServer'],
  apply(ctx) {
    // 侧边栏图标补丁自愈（DSH 升级覆盖外壳后自动重打；失败静默跳过）
    ensureNavIconPatch({ log: (m) => startupLog('[cost-tracker] nav-icon ' + m) })
```

</details>

**依据 2 · 源码核查**：[index.js:614-657](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/index.js#L614-L657)

核对调用类别的机制依据

<details>
<summary>查看原文（44行）</summary>

```text
    function recordUsage(options, usage, ts) {
      const provider = toStr(options && options.provider)
      const model = toStr(options && options.model)
      if (!provider && !model) return
      const np = normProvider(provider)
      // 记下最近一次实际使用的 provider：summary 据此判断该预热哪家的配额缓存
      if (np) lastProviderSeen = np
      // 按「调用发生的时刻」选单价版本（跨 2026-09-10 12:00 / 2026-09-14 12:00 自动切换，无需重启）。
      // 视觉模型（deepseek-v4-flash-vision-exp）的图片 token 已含在接口
      // prompt_tokens 中（每张≤384 tokens），由 normalizeTokens 归入 input
      const tokens = normalizeTokens(usage)
      const price = priceForAt(np, model, ts, tokens)
      store.add({
        // 被路由的请求以「实际计费模型规范名」入账（如 V4-Pro → deepseek-flash、
        // 旧名 deepseek-v4-flash → deepseek-flash），使按模型聚合看到的就是真实计费口径。
        ts, provider, model: price.model,
        sessionId: toStr(options && options.sessionId),
        purpose: toStr(options && options.purpose),
        cost: price.cost,
        estimated: price.estimated,
        period: price.period,
        tokens,
        subscription: price.subscription,
        source: 'live', // v1.9.0：与历史导入（source:'import'）区分，覆盖判定只认 live
      })
      schedulePersist()
      scheduleSync(4000)
    }

    async function* wrapStream(source, options) {
      let usage = null
      try {
        for await (const chunk of source) {
          if (chunk && chunk.type === 'usage' && chunk.usage) usage = chunk.usage
          yield chunk
        }
      } finally {
        if (usage) {
          try { recordUsage(options, usage, Date.now()) } catch (e) { console.error('cost record failed', e) }
        }
      }
    }

    ctx.on('llm/stream', (options, next) => wrapStream(next(), options))
```

</details>

**依据 3 · 作者声明**：[README.md:51-51](https://github.com/Angelyeye/dsh-cost-tracker/blob/576f6e756a1064481ec5e8ca4ef0c5ade1cc21b6/README.md#L51-L51)

CSV输出声明

```text
| 📤 | **CSV 导出** | 一键导出明细 + 日汇总(purpose=rollup),方便用 Excel / Numbers 做进一步分析 |
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
