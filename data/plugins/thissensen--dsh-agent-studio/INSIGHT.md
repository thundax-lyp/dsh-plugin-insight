# DSH Agent Studio

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e289253](https://github.com/thissensen/dsh-agent-studio/tree/e289253f4854da0f2676b140ea34d218af45506d)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/thissensen/dsh-agent-studio) [![npm 30d 3,345](https://img.shields.io/static/v1?label=npm+30d&message=3%2C345&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-studio) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-studio)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中配置 Agent 的提示词、工具、技能、子代理和模型，并提供按角色委派。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将角色绑定带入批次发起，并按目标配置返回启动回执或等待结算。

> **主要限制**：[Q03](#research-q03) PTC 预算提高默认启用并影响整个宿主进程。阻塞批若无法写临时文件，只返回元数据与错误，正文不会回填。

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
  - [Q01 · 哪类团队任务适合批量委派？](#detail-section-11)
  - [Q02 · 如何绑定身份并决定是否等待？](#detail-section-12)
  - [Q03 · 阻塞批有什么恢复和进程边界？](#detail-section-13)
  - [Q04 · 怎样试用而不扩大运行负担？](#detail-section-14)
  - [Q05 · 能否使用单批等待上限替代进程放宽？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要经常向不同角色委派独立核查任务的 DSH 使用者，可用预设和子会话身份管理批次。

官方子代理或独立会话可逐项发起，角色配对和结果汇总由操作者维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 角色委派 | 绑定预设角色和子会话 | 需要宿主接受指定 ID |
| 阻塞批结果 | 等待逐项结束并保存成功正文 | 临时写入失败只报告元数据和错误 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 子代理服务 | 必需 | 以预设 ID 关联角色 | 传输不支持时停止 |
| PTC runtime | 预算开关才依赖 | 修改 PTC 上限 | 服务缺失时该分支不挂载 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在独立进程记录原预算，显式关闭预算提高 | 两个实际值均恢复后再试 |
| 发起 | 用户派发合成任务 | 各自有正确角色和子会话 |
| 核对 | 用户收齐逐项结算 | 缺失或错配时停用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 配置与模型资源 | 建立角色并核对预算 | 耗时未知 |
| 持续 | 模型、并发槽和临时文件 | 跟踪逐项结果 | 费用及节时未知 |
| 失败 | 输出和运行状态留存 | 检查子会话及临时目录 | 重派前核查在途结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 角色绑定 | 调用前登记 childId | 真实宿主匹配率 |
| 批次交付 | 提供后台回执或阻塞结果文件 | 在途、落盘失败和恢复负担 |

> **思考**：[Q03](#research-q03) PTC 预算提高默认启用并影响整个宿主进程。阻塞批若无法写临时文件，只返回元数据与错误，正文不会回填。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将角色绑定带入批次发起，并按目标配置返回启动回执或等待结算。

[Q02](#research-q02) 先登记身份再启动，结果按原序号汇总。[Q03](#research-q03) 文件失败反馈与回收路径有明确边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) PTC 预算提高默认启用并影响整个宿主进程。阻塞批若无法写临时文件，只返回元数据与错误，正文不会回填。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用独立宿主进程，记录启用前的实际 PTC 预算。显式关闭默认开启的预算提高开关并回读两项上限，确认还原后再试非阻塞合成任务。无法核实恢复值或角色异常时停止并回官方流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定委派、结果落盘和预算调整源码。未运行宿主、模型或实测恢复。

- 已检查：作者 README、包清单、源码路径 src/host/delegate.ts、src/host/ptc-budget.ts、src/host/index.ts、README.md、src/host/config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦批量委派和 PTC 预算，不全面审核预设配置、模型备用路由与面板。
- 下一步：用专用隔离进程核对启用、显式关闭和卸载时的两项真实 PTC 配置，再测试后台、阻塞取消、名额不足和不可写临时目录。

**分析版本**

- **仓库**：[thissensen/dsh-agent-studio](https://github.com/thissensen/dsh-agent-studio)
- **版本号**：0.2.1（[固定提交 e289253](https://github.com/thissensen/dsh-agent-studio/tree/e289253f4854da0f2676b140ea34d218af45506d)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对每批单独限制等待并保留可查询结果，有望缩小对其他 PTC 任务的影响。

用专用隔离进程核对启用、显式关闭和卸载时的两项真实 PTC 配置，再测试后台、阻塞取消、名额不足和不可写临时目录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 22 | 5307 | 3258 | 2053 | — |
| .ts | source | 48 | 14572 | 8659 | 4168 | — |
| .md | source | 9 | 1143 | — | — | 21475 |
| .mjs | source | 2 | 207 | 105 | 71 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/thissensen/dsh-agent-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/thissensen/dsh-agent-studio/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/thissensen/dsh-agent-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护多个 Agent 角色的用户能否在 DSH 中获得可追溯的批量委派，并限定运行和产物边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类团队任务适合批量委派？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在同一 DSH 环境反复把互相独立的资料核查交给不同角色的使用者，可以预先定义角色再按角色发起任务。官方子代理或手工分会话仍可完成分派，Studio 的增量是把角色配置与子会话身份对应，并统一提供发起或结果入口。合格结果需按原题逐项核实产物和失败，不能把启动回执当作完成。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:200-208](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/README.md#L200-L208)

作者区分 Studio 和官方派活的角色登记及两种批次返回。

```text
### 已知边界

- **极简类预设（`minimal`）的段面改不动。** 这类预设的 persona 段带了 `complete: true` 标记，意思是「我就是完整的提示词，别再拼别的」。平台会在装配瀑布**跑完之后**把段清单强制换回那一段，插件在瀑布里算出来的白名单因此被盖掉——最终投递的永远是那一段。这是平台设计，不是插件的缺陷，而且它本来就只剩一段，损失有限。工具面、技能面没有这道后处理；`standard` / `code` / `cordis` 这类常规预设的段面也一切正常。
- **派活用插件自带的工具**：`studio_list_subagents` 现算子代理名册，`studio_delegate` 按代理 id 派活——**只有走它，子代理那套独立配置（提示词 / 工具 / 技能 / 模型）才认得出身份、才生效**。官方 `subagent` 工具不受特殊对待（工具集里有它就在），但它派出的子代理没有角色登记，只能按「这个预设绑定的主代理」那套面走。
- **同时派多个子代理，身份也配得准。** 每次派活都在调用**之前**预生成子会话 id——前台等结果与后台跑两档都是可续接的子会话，「子会话 → 代理」的映射先于创建写好，配对是精确的。平台在 `agent/created` 事件里不告诉插件「这次创建是哪一次派活触发的」，所以身份只能靠派活前登记这一条路。
- **派活只有一种形状：一批 `tasks`，等不等看目标那档。** `studio_delegate` 的入口只有一个 `tasks` 数组（派一个也写成一项），没有「单发」参数，也没有「要不要在后台跑」的参数——整批阻不阻塞由目标代理各自的**后台模式**决定，判定是 OR：**一项「阻塞」就整批阻塞**。代价是不阻塞的那几项会被同批连坐（一次工具调用只能交回一次结果，这是有意的取舍）。
  - **一项都不阻塞 ⇒ `{ kind: 'started', items }`**：调用立刻返回，每个子代理跑完由**平台逐条**发结算消息（带它的完整收尾文本）。每项 `{ agent, subagentId?, description?, error? }`；启动失败的那项没有 `subagentId`、带 `error`。
  - **至少一项阻塞 ⇒ `{ kind: 'foreground-batch', results, filePath?, fileError? }`**：整批一起启动、一起等，全部结算后返回；每项 `{ agent, ok, subagentId?, description?, error? }`。批量本身不限条数，但平台同时跑的子代理有上限（可在平台设置里调），到顶时超出的那几项各自返回错误并提示**拆成单独一次重派**，其余照常——一项失败不连坐整批。
  - **阻塞批的结果一律落盘，对话里只留一行落点。** 整批结果会写进系统临时目录下的一个 `.md`：`<系统 temp>/dsh-agent-studio/<会话 id 短哈希>/delegate-<UTC 时间戳>.md`，路径放在返回的顶层 `filePath` 上。文件里是**成功项的正文**，按原序号分节；失败项没有正文，原因在返回里。工具结果在对话里只有这几行：`本批结果已写入：<路径>（共 N 项：M 成功 · K 失败）`，失败项各占一行（`【序号】代理（名字） — 描述 · 失败 · 原因`），另有一行 `子代理：【序号】<id>、…`，列出本批每个可续聊的子代理会话（启动就没起来的项没有 id，不列）——**正文不进对话**，要读就按那个路径读文件；`results` 不含正文（写盘失败也不回填）。写盘失败时返回里换成 `fileError`、那一行改报原因：`文件没写成（<原因>）（共 N 项：M 成功 · K 失败）`。这些文件插件**不主动清理**。
```

**依据 2 · 源码核查**：[src/host/delegate.ts:544-576](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L544-L576)

每项预写角色身份并发起，非阻塞批返回启动结果。

<details>
<summary>查看原文（33行）</summary>

```text
            try {
                // 逐个启动：启动本身很快，子代理一起来就自己跑，总耗时由最慢的那一个决定。
                for (const [index, target] of targets.entries()) {
                    const label = target.description ?? agentDisplayName(target.agentConfig)
                    const spec = activationSpecFor(target.agentConfig, label, callAgent, signal)
                    // 阻塞批要结果还给这次调用（当场等）；不阻塞批要平台把结算通知逐条投给父模型。
                    spec.delivery = isBlockingBatch ? 'caller' : 'parent'
                    spec.request.prompt = [{ type: 'text', text: target.prompt }]

                    // 预生成会话 id ⇒ 映射在创建**之前**写好，零竞态：`startActivation` 采纳调用方
                    // 指定的 `childId`（不支持的传输层已由上面那道守卫挡下）。
                    const childId = randomUUID()
                    spec.childId = childId
                    noteChildAgent(childId, target.agentId)

                    try {
                        records.push({ index, target, activation: await subagents.startActivation(spec) })

                    } catch (err) {
                        const detail = errorText(err)
                        const hint = detail.includes('ACTIVATION_LIMIT_REACHED')
                            ? '（平台活跃子代理名额已满：把这一项拆成单独一次 studio_delegate 重派，或等前面的子代理结束后再派）'
                            : ''
                        records.push({ index, target, startError: `派活没起来：${detail}${hint}` })
                    }
                }

                const launched = records.filter((record) => record.activation !== undefined)
                // 一项都没起来 ⇒ 没有可等的对象：整次抛第一个启动错误，不返回一张空回执。
                if (launched.length === 0) throw Error(records[0].startError as string)

                if (!isBlockingBatch) {
                    return { kind: 'started', items: records.map((record) => startedItem(noteOf(record))) }
```

</details>

#### 缺口

- 真实团队的重复频率和减少的配对工作未测。
  **影响**：不能量化维护预设的净收益。
  **进一步探讨**：同一批资料核查比较人工分配和 Studio 的错配及复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何绑定身份并决定是否等待？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具逐项生成 childId，在 startActivation 前登记角色。只要一个目标设为前台等待，整批使用 caller 交付，并对已启动结果执行 allSettled；全后台的批次立即回传逐项启动回执。名额不足按项记录，所有项均未启动时抛错误。实际角色适配仍依赖宿主接受指定子会话 ID。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/delegate.ts:535-580](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L535-L580)

传输守卫、角色绑定、启动失败和等待分支。

<details>
<summary>查看原文（46行）</summary>

```text
                throw Error(`子代理传输层「${SPAWN_PROVIDER}」没注册或不支持可续接子代理，派活无处可去。`)
            }

            // 整批阻塞判定是 OR：一项「前台等待」就足以让整批变成阻塞批。
            const isBlockingBatch = targets.some((item) => item.agentConfig.background === 'foreground')
            const signal = (exec as StudioToolExec).signal as AbortSignal
            const records: DelegateRecord[] = []
            let firstDisposeError: unknown = undefined

            try {
                // 逐个启动：启动本身很快，子代理一起来就自己跑，总耗时由最慢的那一个决定。
                for (const [index, target] of targets.entries()) {
                    const label = target.description ?? agentDisplayName(target.agentConfig)
                    const spec = activationSpecFor(target.agentConfig, label, callAgent, signal)
                    // 阻塞批要结果还给这次调用（当场等）；不阻塞批要平台把结算通知逐条投给父模型。
                    spec.delivery = isBlockingBatch ? 'caller' : 'parent'
                    spec.request.prompt = [{ type: 'text', text: target.prompt }]

                    // 预生成会话 id ⇒ 映射在创建**之前**写好，零竞态：`startActivation` 采纳调用方
                    // 指定的 `childId`（不支持的传输层已由上面那道守卫挡下）。
                    const childId = randomUUID()
                    spec.childId = childId
                    noteChildAgent(childId, target.agentId)

                    try {
                        records.push({ index, target, activation: await subagents.startActivation(spec) })

                    } catch (err) {
                        const detail = errorText(err)
                        const hint = detail.includes('ACTIVATION_LIMIT_REACHED')
                            ? '（平台活跃子代理名额已满：把这一项拆成单独一次 studio_delegate 重派，或等前面的子代理结束后再派）'
                            : ''
                        records.push({ index, target, startError: `派活没起来：${detail}${hint}` })
                    }
                }

                const launched = records.filter((record) => record.activation !== undefined)
                // 一项都没起来 ⇒ 没有可等的对象：整次抛第一个启动错误，不返回一张空回执。
                if (launched.length === 0) throw Error(records[0].startError as string)

                if (!isBlockingBatch) {
                    return { kind: 'started', items: records.map((record) => startedItem(noteOf(record))) }
                }

                // 全部起来之后一次性等结算：并发在平台侧（子代理各自跑），这里只等它们各自落地。
                const settled = await Promise.allSettled(launched.map((record) => record.activation!.result))
```

</details>

**依据 2 · 源码核查**：[src/host/delegate.ts:585-613](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L585-L613)

已启动结果及失败按原序号归位，取消时上抛。

<details>
<summary>查看原文（29行）</summary>

```text
                for (const [position, outcome] of settled.entries()) {
                    const record = launched[position]
                    if (outcome.status === 'rejected' && signal?.aborted === true) {
                        if (cancelReason === undefined) cancelReason = outcome.reason
                        continue
                    }

                    results.set(record.index, settledItem(noteOf(record), outcome))
                }

                // 取消不做 partial：原始 rejection 包一层中文指路上抛，整次调用失败。
                if (cancelReason !== undefined) {
                    throw Error(
                        `这一批被取消或超时了（${errorText(cancelReason)}）；想等更久，把「突破 PTC 120 秒限制」打开。`,
                        { cause: cancelReason },
                    )
                }

                // 启动失败项在这里补。「每项都有结果」的校验必须在补完之后，否则一次正常的
                // 「名额已满」会让整批误报成内部错误。
                for (const record of records) {
                    if (record.startError === undefined) continue

                    results.set(record.index, startFailureItem(noteOf(record), record.startError))
                }

                if (results.size !== targets.length) throw Error('批量派活内部错误：有任务没拿到结果。')

                const 结果组: DelegateBatchEntry[] = targets.map((_target, index) => results.get(index)!)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 阻塞批有什么恢复和进程边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

插件配置把 ptcBreakLimit 默认设为 true，旧配置缺布尔值也补此默认。独立 PTC 服务挂载成功且字段可写时，插件记录已有值，并将整个进程共享 runtime 的 timeoutMs 和 maxTimeoutMs 都改为 2,147,483,647ms。关闭开关或卸载会尝试恢复记录的原值。阻塞批先用 allSettled 汇集已启动项，某项拒绝且信号已中止时，按源码直接抛出批次错误，跳过后面的聚合文件写入与部分结果返回。这不能证明子会话记录或外部副作用被撤销。正常聚合后若临时文件不可写，返回保留逐项元数据和 fileError，正文不会填进返回值。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/delegate.ts:625-648](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L625-L648)

临时文件结果、失败返回及阻塞激活释放。

<details>
<summary>查看原文（24行）</summary>

```text
                const 文件路径 = join(目录, `delegate-${时间戳}.md`)

                try {
                    await mkdir(目录, { recursive: true })
                    await writeFile(文件路径, spillFileText(结果组, config), 'utf8')

                    return { kind: 'foreground-batch', results: 对外结果组, filePath: 文件路径 }

                } catch (err) {
                    // 写不进去就只改落点行：正文不回填进返回值（不兜底），这一批的正文就是没写下来。
                    return { kind: 'foreground-batch', results: 对外结果组, fileError: errorText(err) }
                }

            } finally {
                // 释放这一次激活。子代理自然结算时平台已经自己关掉它（幂等），这里兜的是「结果
                // 已到、收尾还没走完」与异常路径——激活常驻会占住 maxActiveSubagents 的名额
                // （默认 8）。释放本身极罕见地抛错时它会盖掉上面的异常，这个取舍是有意的。
                // 只有阻塞批释放：不阻塞批的激活一释放就等于把还在平台上跑的子代理掐掉。
                if (isBlockingBatch) {
                    for (const record of records) {
                        if (record.activation === undefined) continue

                        try {
                            await record.activation.dispose()
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:41-48](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/index.ts#L41-L48)

宿主挂载预算调整。

```text
export function apply(ctx: Ctx, config: unknown) {
    const logger: Logger = ctx.logger ?? console
    logger.info?.('[agent-studio] host 半边已挂载')

    // 必须在 apply 顶层挂（不能挪进 settings 那条注入回调）：这条 inject **独占** `ptcRuntime`，
    // 缺这个服务时整段静默缺席——正是「这个 profile 没装 PTC」该有的降级，不进日志也不报错。
    // 开关每次现取现解包：volatile 字段是平台给的活引用，缓存下来的永远是第一次那个值。
    mountPtcBudget(ctx, logger, () => readConfig(config).ptcBreakLimit === true)
```

**依据 3 · 源码核查**：[src/host/ptc-budget.ts:34-44](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/ptc-budget.ts#L34-L44)

监听配置并在卸载时还原。

<details>
<summary>查看原文（11行）</summary>

```text
export function mountPtcBudget(ctx: Ctx, logger: Logger, isEnabled: () => boolean): void {
    ctx.inject(['ptcRuntime'], (ptcCtx: Ctx) => {
        const runtime = ptcCtx.ptcRuntime
        const 同步预算 = (): void => applyPtcBudget(runtime, isEnabled(), logger)

        同步预算()
        // 不按命名空间过滤：读一个布尔的成本可忽略，过滤反而多一处静默失效点。
        ptcCtx.on('settings/document-updated', () => 同步预算())
        // 插件卸载 / reload 时还原，别把抬过的上限留给下一份插件实例。
        ptcCtx.effect?.(() => () => applyPtcBudget(runtime, false, logger), 'agent-studio: ptc budget')
    })
```

</details>

**依据 4 · 源码核查**：[src/host/ptc-budget.ts:58-80](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/ptc-budget.ts#L58-L80)

修改两个全局字段并处理写入异常。

<details>
<summary>查看原文（23行）</summary>

```text
    try {
        if (enabled) {
            // 已有原值就返回：重捕获会把抬高的值当原值，关了再也降不回来。
            if (已记录 !== undefined) return
            const 原值: 原预算 = { timeoutMs: config.timeoutMs, maxTimeoutMs: config.maxTimeoutMs }
            挂载表[ORIGINAL_BUDGET_KEY] = 原值
            config.timeoutMs = PTC_BUDGET_MAX_MS
            config.maxTimeoutMs = PTC_BUDGET_MAX_MS
            // 日志必须打捕获到的原值：两个字段此刻已被改过，读 config 只会看到上限。
            logger.info?.(`[agent-studio] 程序预算已抬到 ${PTC_BUDGET_MAX_MS} ms（原值 timeoutMs=${原值.timeoutMs}, maxTimeoutMs=${原值.maxTimeoutMs}）`)
            return
        }

        if (已记录 === undefined) return
        config.timeoutMs = 已记录.timeoutMs
        config.maxTimeoutMs = 已记录.maxTimeoutMs
        delete 挂载表[ORIGINAL_BUDGET_KEY]
        logger.info?.(`[agent-studio] 程序预算已还原（timeoutMs=${已记录.timeoutMs}, maxTimeoutMs=${已记录.maxTimeoutMs}）`)

    } catch (err) {
        if (已警告组.has(runtime)) return
        已警告组.add(runtime)
        logger.warn?.('[agent-studio] 程序预算改不动（config 被冻结或字段只读），该开关不生效', err)
```

</details>

**依据 5 · 作者声明**：[README.md:208-211](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/README.md#L208-L211)

作者说明临时文件保留与预算默认启用。

```text
  - **阻塞批的结果一律落盘，对话里只留一行落点。** 整批结果会写进系统临时目录下的一个 `.md`：`<系统 temp>/dsh-agent-studio/<会话 id 短哈希>/delegate-<UTC 时间戳>.md`，路径放在返回的顶层 `filePath` 上。文件里是**成功项的正文**，按原序号分节；失败项没有正文，原因在返回里。工具结果在对话里只有这几行：`本批结果已写入：<路径>（共 N 项：M 成功 · K 失败）`，失败项各占一行（`【序号】代理（名字） — 描述 · 失败 · 原因`），另有一行 `子代理：【序号】<id>、…`，列出本批每个可续聊的子代理会话（启动就没起来的项没有 id，不列）——**正文不进对话**，要读就按那个路径读文件；`results` 不含正文（写盘失败也不回填）。写盘失败时返回里换成 `fileError`、那一行改报原因：`文件没写成（<原因>）（共 N 项：M 成功 · K 失败）`。这些文件插件**不主动清理**。
- **工具候选不用先对话。** 预设注册即激活，面板直接读该预设此刻的工具面（`GET /tools?preset=`）；读不到时（工具服务缺席、预设破损）才退回按预设落盘的观察缓存。
- **自动降级只在配了备用候选时接管。** 候选链为空时插件完全不碰请求，重试就是平台默认的那套；接管之后重试上限以插件配置为准（每个候选各自算）。
- **「突破 PTC 120 秒限制」是进程级开关，默认开。** 它在保存行「注册到主页面」右边，点一下即时落盘、不进草稿：把 PTC 模式 `run_code` 程序的预算从默认 120 秒抬到平台计时器上限（约 24.8 天）。三点要记住：① 只对 PTC 模式生效，而且是**进程级全局**——主代理、子代理、所有程序一起放开；② 等后台 job、等嵌套工具的时间也算在这份预算里；③ 打开后写坏的死循环几乎不会自己停，只能手动中断。默认开是因为「阻塞」档的派活经常要等超过 120 秒。
```

**依据 6 · 源码核查**：[src/host/config.ts:86-91](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/config.ts#L86-L91)

默认开关为 true。

```text
 * 阻塞档（`foreground`）的派活经常要等超过 120 秒——平台默认的程序预算就是 120 秒，子代理
 * 还在干活时程序会先被杀掉，所以这类派活多的用法默认放大预算。代价说清楚：预算放大后，
 * 写坏的程序（死循环）不会自己停，只能手动停。
 */
export const DEFAULT_PTC_BREAK_LIMIT = true

```

**依据 7 · 源码核查**：[src/host/config.ts:225-230](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/config.ts#L225-L230)

开关采用该默认。

```text
    /**
     * 界面偏好，不是池：PTC 模式下把程序预算抬到平台计时器上限（默认开，理由见
     * `DEFAULT_PTC_BREAK_LIMIT`）。改成即时落盘、不进面板草稿——它一改就要立刻作用到
     * 进程里的运行时（`ptc-budget.ts` 监听 `settings/document-updated` 重算）。
     */
    ptcBreakLimit: z.boolean().default(DEFAULT_PTC_BREAK_LIMIT).volatile(),
```

**依据 8 · 源码核查**：[src/host/config.ts:270-276](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/config.ts#L270-L276)

旧配置缺少布尔值时恢复该默认。

```text
            typeof 项 === 'string' ? { id: 项 } : 项
        ))
    }

    if (typeof 当前配置.ptcBreakLimit !== 'boolean') {
        当前配置.ptcBreakLimit = DEFAULT_PTC_BREAK_LIMIT
    }
```

**依据 9 · 源码核查**：[src/host/delegate.ts:579-600](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L579-L600)

汇集结果后，拒绝且 signal 已中止的批次直接抛错。

<details>
<summary>查看原文（22行）</summary>

```text
                // 全部起来之后一次性等结算：并发在平台侧（子代理各自跑），这里只等它们各自落地。
                const settled = await Promise.allSettled(launched.map((record) => record.activation!.result))

                const results = new Map<number, DelegateBatchEntry>()
                let cancelReason: unknown = undefined

                for (const [position, outcome] of settled.entries()) {
                    const record = launched[position]
                    if (outcome.status === 'rejected' && signal?.aborted === true) {
                        if (cancelReason === undefined) cancelReason = outcome.reason
                        continue
                    }

                    results.set(record.index, settledItem(noteOf(record), outcome))
                }

                // 取消不做 partial：原始 rejection 包一层中文指路上抛，整次调用失败。
                if (cancelReason !== undefined) {
                    throw Error(
                        `这一批被取消或超时了（${errorText(cancelReason)}）；想等更久，把「突破 PTC 120 秒限制」打开。`,
                        { cause: cancelReason },
                    )
```

</details>

**依据 10 · 源码核查**：[src/host/delegate.ts:613-635](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L613-L635)

普通聚合返回项先去掉正文，写盘失败仍返回元数据及 fileError。

<details>
<summary>查看原文（23行）</summary>

```text
                const 结果组: DelegateBatchEntry[] = targets.map((_target, index) => results.get(index)!)

                // 对外项摘掉正文：正文只在盘上那份文件里，写盘失败也不回填（不兜底）。必须用解构
                // 删键，不能写 `output: undefined`——平台对返回值做 lossless JSON 快照，值为
                // undefined 的键会让整次输出判非法（坑册坑 55）。
                const 对外结果组: DelegateBatchItem[] = 结果组.map(({ output: _正文, ...item }) => item)

                // 目录与平台 spill 同构（会话 id 短哈希），但不复用它那个私有根（那是它自己 mkdtemp 出来的）。
                // 文件名取 UTC 时间戳：纯 ASCII、字典序即时间序。不主动清理——文件是给模型读的。
                const 会话id = callAgent.session?.id ?? ''
                const 目录 = join(tmpdir(), 'dsh-agent-studio', createHash('sha256').update(会话id).digest('hex').slice(0, 12))
                const 时间戳 = new Date().toISOString().slice(0, 23).replace(/[-:]/g, '').replace('T', '-').replace('.', '-')
                const 文件路径 = join(目录, `delegate-${时间戳}.md`)

                try {
                    await mkdir(目录, { recursive: true })
                    await writeFile(文件路径, spillFileText(结果组, config), 'utf8')

                    return { kind: 'foreground-batch', results: 对外结果组, filePath: 文件路径 }

                } catch (err) {
                    // 写不进去就只改落点行：正文不回填进返回值（不兜底），这一批的正文就是没写下来。
                    return { kind: 'foreground-batch', results: 对外结果组, fileError: errorText(err) }
```

</details>

#### 缺口

- 实际宿主的配置读回、挂载失败和并存插件行为未验证。
  **影响**：不能假定关闭界面开关就已经还原，也不能从取消推断已发任务被撤销。
  **进一步探讨**：在独立宿主进程比较启用前、显式关闭后的两个配置值，并对取消分支核对子会话。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用而不扩大运行负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先使用专用隔离 DSH 进程与 profile，记录启用插件前实际 PTC 的 timeoutMs 和 maxTimeoutMs。该开关默认打开。启用后须显式关闭「突破 PTC 120 秒限制」，从宿主实际配置或可信诊断回读两值，核实已回到启用前的状态；不能读回或值不一致就停止试用。之后仅发两项非阻塞合成任务，逐项检查角色、子会话和结算。需要支持指定 childId 的宿主服务及获准模型，失败时核对在途结果，恢复原配置并用官方工具分派。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/delegate.ts:535-567](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L535-L567)

传输要求与平台名额上限。

<details>
<summary>查看原文（33行）</summary>

```text
                throw Error(`子代理传输层「${SPAWN_PROVIDER}」没注册或不支持可续接子代理，派活无处可去。`)
            }

            // 整批阻塞判定是 OR：一项「前台等待」就足以让整批变成阻塞批。
            const isBlockingBatch = targets.some((item) => item.agentConfig.background === 'foreground')
            const signal = (exec as StudioToolExec).signal as AbortSignal
            const records: DelegateRecord[] = []
            let firstDisposeError: unknown = undefined

            try {
                // 逐个启动：启动本身很快，子代理一起来就自己跑，总耗时由最慢的那一个决定。
                for (const [index, target] of targets.entries()) {
                    const label = target.description ?? agentDisplayName(target.agentConfig)
                    const spec = activationSpecFor(target.agentConfig, label, callAgent, signal)
                    // 阻塞批要结果还给这次调用（当场等）；不阻塞批要平台把结算通知逐条投给父模型。
                    spec.delivery = isBlockingBatch ? 'caller' : 'parent'
                    spec.request.prompt = [{ type: 'text', text: target.prompt }]

                    // 预生成会话 id ⇒ 映射在创建**之前**写好，零竞态：`startActivation` 采纳调用方
                    // 指定的 `childId`（不支持的传输层已由上面那道守卫挡下）。
                    const childId = randomUUID()
                    spec.childId = childId
                    noteChildAgent(childId, target.agentId)

                    try {
                        records.push({ index, target, activation: await subagents.startActivation(spec) })

                    } catch (err) {
                        const detail = errorText(err)
                        const hint = detail.includes('ACTIVATION_LIMIT_REACHED')
                            ? '（平台活跃子代理名额已满：把这一项拆成单独一次 studio_delegate 重派，或等前面的子代理结束后再派）'
                            : ''
                        records.push({ index, target, startError: `派活没起来：${detail}${hint}` })
```

</details>

**依据 2 · 源码核查**：[src/host/ptc-budget.ts:58-75](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/ptc-budget.ts#L58-L75)

预算可还原到捕获值。

<details>
<summary>查看原文（18行）</summary>

```text
    try {
        if (enabled) {
            // 已有原值就返回：重捕获会把抬高的值当原值，关了再也降不回来。
            if (已记录 !== undefined) return
            const 原值: 原预算 = { timeoutMs: config.timeoutMs, maxTimeoutMs: config.maxTimeoutMs }
            挂载表[ORIGINAL_BUDGET_KEY] = 原值
            config.timeoutMs = PTC_BUDGET_MAX_MS
            config.maxTimeoutMs = PTC_BUDGET_MAX_MS
            // 日志必须打捕获到的原值：两个字段此刻已被改过，读 config 只会看到上限。
            logger.info?.(`[agent-studio] 程序预算已抬到 ${PTC_BUDGET_MAX_MS} ms（原值 timeoutMs=${原值.timeoutMs}, maxTimeoutMs=${原值.maxTimeoutMs}）`)
            return
        }

        if (已记录 === undefined) return
        config.timeoutMs = 已记录.timeoutMs
        config.maxTimeoutMs = 已记录.maxTimeoutMs
        delete 挂载表[ORIGINAL_BUDGET_KEY]
        logger.info?.(`[agent-studio] 程序预算已还原（timeoutMs=${已记录.timeoutMs}, maxTimeoutMs=${已记录.maxTimeoutMs}）`)
```

</details>

**依据 3 · 作者声明**：[README.md:205-211](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/README.md#L205-L211)

批次模式、临时文件与进程预算限制。

```text
- **派活只有一种形状：一批 `tasks`，等不等看目标那档。** `studio_delegate` 的入口只有一个 `tasks` 数组（派一个也写成一项），没有「单发」参数，也没有「要不要在后台跑」的参数——整批阻不阻塞由目标代理各自的**后台模式**决定，判定是 OR：**一项「阻塞」就整批阻塞**。代价是不阻塞的那几项会被同批连坐（一次工具调用只能交回一次结果，这是有意的取舍）。
  - **一项都不阻塞 ⇒ `{ kind: 'started', items }`**：调用立刻返回，每个子代理跑完由**平台逐条**发结算消息（带它的完整收尾文本）。每项 `{ agent, subagentId?, description?, error? }`；启动失败的那项没有 `subagentId`、带 `error`。
  - **至少一项阻塞 ⇒ `{ kind: 'foreground-batch', results, filePath?, fileError? }`**：整批一起启动、一起等，全部结算后返回；每项 `{ agent, ok, subagentId?, description?, error? }`。批量本身不限条数，但平台同时跑的子代理有上限（可在平台设置里调），到顶时超出的那几项各自返回错误并提示**拆成单独一次重派**，其余照常——一项失败不连坐整批。
  - **阻塞批的结果一律落盘，对话里只留一行落点。** 整批结果会写进系统临时目录下的一个 `.md`：`<系统 temp>/dsh-agent-studio/<会话 id 短哈希>/delegate-<UTC 时间戳>.md`，路径放在返回的顶层 `filePath` 上。文件里是**成功项的正文**，按原序号分节；失败项没有正文，原因在返回里。工具结果在对话里只有这几行：`本批结果已写入：<路径>（共 N 项：M 成功 · K 失败）`，失败项各占一行（`【序号】代理（名字） — 描述 · 失败 · 原因`），另有一行 `子代理：【序号】<id>、…`，列出本批每个可续聊的子代理会话（启动就没起来的项没有 id，不列）——**正文不进对话**，要读就按那个路径读文件；`results` 不含正文（写盘失败也不回填）。写盘失败时返回里换成 `fileError`、那一行改报原因：`文件没写成（<原因>）（共 N 项：M 成功 · K 失败）`。这些文件插件**不主动清理**。
- **工具候选不用先对话。** 预设注册即激活，面板直接读该预设此刻的工具面（`GET /tools?preset=`）；读不到时（工具服务缺席、预设破损）才退回按预设落盘的观察缓存。
- **自动降级只在配了备用候选时接管。** 候选链为空时插件完全不碰请求，重试就是平台默认的那套；接管之后重试上限以插件配置为准（每个候选各自算）。
- **「突破 PTC 120 秒限制」是进程级开关，默认开。** 它在保存行「注册到主页面」右边，点一下即时落盘、不进草稿：把 PTC 模式 `run_code` 程序的预算从默认 120 秒抬到平台计时器上限（约 24.8 天）。三点要记住：① 只对 PTC 模式生效，而且是**进程级全局**——主代理、子代理、所有程序一起放开；② 等后台 job、等嵌套工具的时间也算在这份预算里；③ 打开后写坏的死循环几乎不会自己停，只能手动中断。默认开是因为「阻塞」档的派活经常要等超过 120 秒。
```

**依据 4 · 源码核查**：[src/host/config.ts:86-91](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/config.ts#L86-L91)

实际默认值决定必须显式关闭。

```text
 * 阻塞档（`foreground`）的派活经常要等超过 120 秒——平台默认的程序预算就是 120 秒，子代理
 * 还在干活时程序会先被杀掉，所以这类派活多的用法默认放大预算。代价说清楚：预算放大后，
 * 写坏的程序（死循环）不会自己停，只能手动停。
 */
export const DEFAULT_PTC_BREAK_LIMIT = true

```

**依据 5 · 源码核查**：[src/host/ptc-budget.ts:34-44](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/ptc-budget.ts#L34-L44)

设置变更触发预算同步。

<details>
<summary>查看原文（11行）</summary>

```text
export function mountPtcBudget(ctx: Ctx, logger: Logger, isEnabled: () => boolean): void {
    ctx.inject(['ptcRuntime'], (ptcCtx: Ctx) => {
        const runtime = ptcCtx.ptcRuntime
        const 同步预算 = (): void => applyPtcBudget(runtime, isEnabled(), logger)

        同步预算()
        // 不按命名空间过滤：读一个布尔的成本可忽略，过滤反而多一处静默失效点。
        ptcCtx.on('settings/document-updated', () => 同步预算())
        // 插件卸载 / reload 时还原，别把抬过的上限留给下一份插件实例。
        ptcCtx.effect?.(() => () => applyPtcBudget(runtime, false, logger), 'agent-studio: ptc budget')
    })
```

</details>

**依据 6 · 源码核查**：[src/host/ptc-budget.ts:71-80](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/ptc-budget.ts#L71-L80)

恢复使用捕获值，失败可能只记录警告。

<details>
<summary>查看原文（10行）</summary>

```text
        if (已记录 === undefined) return
        config.timeoutMs = 已记录.timeoutMs
        config.maxTimeoutMs = 已记录.maxTimeoutMs
        delete 挂载表[ORIGINAL_BUDGET_KEY]
        logger.info?.(`[agent-studio] 程序预算已还原（timeoutMs=${已记录.timeoutMs}, maxTimeoutMs=${已记录.maxTimeoutMs}）`)

    } catch (err) {
        if (已警告组.has(runtime)) return
        已警告组.add(runtime)
        logger.warn?.('[agent-studio] 程序预算改不动（config 被冻结或字段只读），该开关不生效', err)
```

</details>

#### 缺口

- 模型调用成本、落盘空间及维护时间未测。
  **影响**：无法证明批量委派比手工分派便宜。
  **进一步探讨**：按完整核对后的合格子任务计量时间和上游用量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否使用单批等待上限替代进程放宽？

**研究主题**：新假设与验证

#### 完整回答

可试验只对当前批次提供显式等待预算，超过时转回可查询的子会话并保存已完成结果，其他 PTC 任务保持原配置。当前子会话标识和 caller/parent 交付提供线索，但切换回收能否成立取决于宿主能力。对同一慢任务批次比较进程级修改与批次限制，衡量结果保留、其他任务超时和人工恢复。若宿主不能安全续接或产生重复结算，则该假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/delegate.ts:549-580](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/delegate.ts#L549-L580)

交付路径与预置 childId。

<details>
<summary>查看原文（32行）</summary>

```text
                    // 阻塞批要结果还给这次调用（当场等）；不阻塞批要平台把结算通知逐条投给父模型。
                    spec.delivery = isBlockingBatch ? 'caller' : 'parent'
                    spec.request.prompt = [{ type: 'text', text: target.prompt }]

                    // 预生成会话 id ⇒ 映射在创建**之前**写好，零竞态：`startActivation` 采纳调用方
                    // 指定的 `childId`（不支持的传输层已由上面那道守卫挡下）。
                    const childId = randomUUID()
                    spec.childId = childId
                    noteChildAgent(childId, target.agentId)

                    try {
                        records.push({ index, target, activation: await subagents.startActivation(spec) })

                    } catch (err) {
                        const detail = errorText(err)
                        const hint = detail.includes('ACTIVATION_LIMIT_REACHED')
                            ? '（平台活跃子代理名额已满：把这一项拆成单独一次 studio_delegate 重派，或等前面的子代理结束后再派）'
                            : ''
                        records.push({ index, target, startError: `派活没起来：${detail}${hint}` })
                    }
                }

                const launched = records.filter((record) => record.activation !== undefined)
                // 一项都没起来 ⇒ 没有可等的对象：整次抛第一个启动错误，不返回一张空回执。
                if (launched.length === 0) throw Error(records[0].startError as string)

                if (!isBlockingBatch) {
                    return { kind: 'started', items: records.map((record) => startedItem(noteOf(record))) }
                }

                // 全部起来之后一次性等结算：并发在平台侧（子代理各自跑），这里只等它们各自落地。
                const settled = await Promise.allSettled(launched.map((record) => record.activation!.result))
```

</details>

**依据 2 · 源码核查**：[src/host/ptc-budget.ts:58-75](https://github.com/thissensen/dsh-agent-studio/blob/e289253f4854da0f2676b140ea34d218af45506d/src/host/ptc-budget.ts#L58-L75)

现有共享预算修改的对照基线。

<details>
<summary>查看原文（18行）</summary>

```text
    try {
        if (enabled) {
            // 已有原值就返回：重捕获会把抬高的值当原值，关了再也降不回来。
            if (已记录 !== undefined) return
            const 原值: 原预算 = { timeoutMs: config.timeoutMs, maxTimeoutMs: config.maxTimeoutMs }
            挂载表[ORIGINAL_BUDGET_KEY] = 原值
            config.timeoutMs = PTC_BUDGET_MAX_MS
            config.maxTimeoutMs = PTC_BUDGET_MAX_MS
            // 日志必须打捕获到的原值：两个字段此刻已被改过，读 config 只会看到上限。
            logger.info?.(`[agent-studio] 程序预算已抬到 ${PTC_BUDGET_MAX_MS} ms（原值 timeoutMs=${原值.timeoutMs}, maxTimeoutMs=${原值.maxTimeoutMs}）`)
            return
        }

        if (已记录 === undefined) return
        config.timeoutMs = 已记录.timeoutMs
        config.maxTimeoutMs = 已记录.maxTimeoutMs
        delete 挂载表[ORIGINAL_BUDGET_KEY]
        logger.info?.(`[agent-studio] 程序预算已还原（timeoutMs=${已记录.timeoutMs}, maxTimeoutMs=${已记录.maxTimeoutMs}）`)
```

</details>

#### 缺口

- 单批转换与结果查询未实现。
  **影响**：迁移可行性和收益未知。
  **进一步探讨**：做受控延迟并核对一次性结算。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
