# dsh-damage-pulse

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[26e8d5c](https://github.com/wssfk12138/dsh-damage-pulse/tree/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf)

<!-- BEGIN META -->
[![GitHub ★ 283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wssfk12138/dsh-damage-pulse) [![npm 30d 6,438](https://img.shields.io/static/v1?label=npm+30d&message=6%2C438&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-damage-pulse) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-damage-pulse)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供用量、费用与余额监控，并以鲸鱼娘动画反馈 Token 消耗。

> **亮点**：[Q01](#research-q01) 的固定计费快照和原始用量分离，加上 [Q02](#research-q02) 的受限描述符和凭据轮换迟到结果检查，构成可解释的消费观察集成；动画和汇总未证明节省费用。

> **主要限制**：[Q03](#research-q03) 显示内存更新成功后才尝试写JSONL，落盘失败仍返回并继续回调；消费动画不证明记录耐久保存。本地规则、usage覆盖与供应商实际扣账仍有边界。

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
  - [Q01 · 消费反馈服务谁，采集与估价怎样分工？](#detail-section-11)
  - [Q02 · 余额脚本和凭据轮换如何隔离旧结果？](#detail-section-12)
  - [Q03 · 本地账本与模块生命周期能否支撑耐久历史？](#detail-section-13)
  - [Q04 · 什么条件下值得试，怎样核成本与退出？](#detail-section-14)
  - [Q05 · 如何减少金额与耐久状态的误读？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向反复观察个人 DSH 用量的用户，合格结果是记录可追溯且未知不冒充零费用；不直接用于财务对账。

原办法是读宿主usage和供应商记录，再人工对应模型/缓存/规则。本包集中观察与反馈，供应商实际扣款仍是独立依据，未完成效率对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| live用量采集 | 观察模型和缓存分量 | 仅有usage的model事件，来源覆盖有限 |
| 可选计费 | 按固定规则估价 | unpriced不等于免费，非供应商结算 |
| 本地历史 | 回读请求明细 | JSONL写失败不阻断内存反馈 |
| 供应商余额 | 同屏查看当前身份余额 | 需合法脚本/凭据，真实服务未验收 |
| 预算与缓存提醒 | 提示消费变化 | 不阻断请求 |
| 模块生命周期 | 按需启停与保留数据 | 需完整载荷与明确删除选择 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH host/client、Node及完整runtime包 | 启动必需 | 加载manifest与模块/客户端 | 不完整源码包拒绝启动；作者兼容声明未独立复现 |
| sessions、credentials、settings | 核心必需 | 采集、设置与身份接缝 | 必选注入未就绪不可据欢迎页判断成功 |
| live model usage | 采集必需 | 原始量与sourceEventSeq | 没有usage不能据此生成完整账单 |
| billing模块与已核规则 | 估价必需 | 本地费用决策 | 可仅留unpriced原始量，不把0当免费 |
| 当前provider凭据与脚本 | 特定余额查询必需 | Host请求与响应解析 | 无身份/非法脚本暂停，不借别的key |
| 可写本地账本目录 | 耐久历史必需 | JSONL保存和回读 | 写失败可能只剩内存反馈 |
| 微信与其他通知服务 | 可选 | 发送提醒 | 不作为基础采集必需，预算不阻断请求 |

细节与边界见 [Q02](#research-q02) 至 [Q04](#research-q04)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并匹配profile/发布包 | 完整runtime与宿主兼容，拒用未构建源码冒充发布包 |
| 加载 | 宿主验证载荷并启动core/选装模块 | 用已知请求核实际采集，而非截图 |
| 观察 | 用户查provider/model、usage与规则 | 未定价明确，估价与真实账单分开 |
| 恢复 | 用户查落盘/余额身份、暂停异常模块 | 保留JSONL和日志核对，不盲目删历史 |
| 退出 | 用户选择保留历史后卸载/停用 | 采集停止、原数据可追溯；删除另按选择 |

[Q03](#research-q03) 区分模块事务与账本耐久，不能相互替代。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 依赖与存储金额未知 | 包/profile、规则和来源核对耗时未知 | 完整runtime必需 |
| 持续使用 | 日志、轮询、UI与模型调用，资源量未知 | 持续规则/账单抽查 | 无节费数据 |
| 失败恢复 | 重试/缺记录资源未知 | 对账内存/JSONL/身份，耗时未知 | 写盘fail-soft仍有缺口 |
| 升级退出 | 备份和包文件量未知 | 选择数据保留并核模块状态 | 不以清空账本修启动 |

以完成一组来源可追溯请求为比较单位，无总尝试/合格数不算单位成本。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量记录 | live事件、sourceEventSeq去重与原始量 | 覆盖与落盘完整性 |
| 金额反馈 | 冻结规则接缝及unpriced状态 | 真实扣账一致和行为节费 |
| 余额 | 当前身份与迟到结果复核 | 全部provider语义/可用性 |
| 预算提醒 | 阈值后发布通知 | 不取消请求，未测决策效果 |

[Q04](#research-q04) 的采用条件以个人观察为限。

> **思考**：[Q03](#research-q03) 显示内存更新成功后才尝试写JSONL，落盘失败仍返回并继续回调；消费动画不证明记录耐久保存。本地规则、usage覆盖与供应商实际扣账仍有边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的固定计费快照和原始用量分离，加上 [Q02](#research-q02) 的受限描述符和凭据轮换迟到结果检查，构成可解释的消费观察集成；动画和汇总未证明节省费用。

[Q02](#research-q02) 无key脚本、Host凭据和响应后身份复核值得借鉴，复制时需连同网络策略和scope生命周期；[Q03](#research-q03) 载荷验证、lease与tombstone解释模块退出，但账本耐久仍需独立状态，不能仅按回调名判成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示内存更新成功后才尝试写JSONL，落盘失败仍返回并继续回调；消费动画不证明记录耐久保存。本地规则、usage覆盖与供应商实际扣账仍有边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只观察用量与明细，以已知请求核来源、规则、写盘和供应商记录；有需要再开脚本/通知。未定价、落盘或身份异常就暂停相关模块并保留记录回供应商核对，不把动画当结算。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核根组件采集、估价接缝、余额隔离、账本与模块生命周期源码；未运行目标宿主、外部供应商或通知。可信状态摘要为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/dsh-token-monitor/src/balance-provider.ts、plugins/dsh-token-monitor/src/balance-registry.ts、plugins/dsh-token-monitor/src/balance-script.ts、plugins/dsh-token-monitor/src/collector-core.ts、plugins/dsh-token-monitor/src/index.ts、plugins/dsh-token-monitor/src/module-bootstrap.ts、plugins/dsh-token-monitor/src/provider-notifications.ts、plugins/dsh-token-monitor/src/runtime-core.ts、plugins/dsh-token-monitor/src/runtime-host.ts、plugins/dsh-token-monitor/src/storage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件完整inventory，人工定向核入口/core、live采集、估价接缝、存储、余额脚本/身份/registry与模块生命周期；未全审UI、所有provider、通知、更新和网络安全面。
- 下一步：未执行目标代码、安装、测试、宿主、模型或外部服务；作者截图含合成/接口替身说明，不当本地验证。后续按已知请求、写盘失败与凭据轮换核可追溯性和用户误读。

**分析版本**

- **仓库**：[wssfk12138/dsh-damage-pulse](https://github.com/wssfk12138/dsh-damage-pulse)
- **版本号**：4.3.2（[固定提交 26e8d5c](https://github.com/wssfk12138/dsh-damage-pulse/tree/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 探索在反馈旁显示来源覆盖、估价、耐久和余额时间；现有billingStatus与updatedAt已存在，需先核UI，再对照故障任务检验是否减少误读。

未执行目标代码、安装、测试、宿主、模型或外部服务；作者截图含合成/接口替身说明，不当本地验证。后续按已知请求、写盘失败与凭据轮换核可追溯性和用户误读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1378 | — | — | 22144 |
| .js | source | 2 | 72221 | 62612 | 10538 | — |
| .ts | source | 125 | 14608 | 11700 | 1919 | — |
| .tsx | source | 20 | 5575 | 4864 | 454 | — |
| .tsx | test | 25 | 5035 | 4429 | 211 | — |
| .ts | test | 99 | 10354 | 9335 | 301 | — |
| .mjs | source | 5 | 547 | 498 | 44 | — |
| .ts | example | 2 | 105 | 102 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/wssfk12138/dsh-damage-pulse/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/wssfk12138/dsh-damage-pulse/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/wssfk12138/dsh-damage-pulse/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个人用户能否用消费反馈准确理解来源、估价和余额，而不把界面金额误当完整耐久账单？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 消费反馈服务谁，采集与估价怎样分工？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常在 DSH 做个人编程/研究任务、希望随调用观察 Token 分量与估计费用的用户是直接对象。原办法是读供应商账单或宿主 usage，再人工核模型、缓存和时间；本包把明细、历史、余额和动画放到会话旁。合格结果应能追溯单次记录的 provider/model、Token 与规则，发现没有定价或来源缺失；桌宠的伤害数字不是合格账单标准。

真实入口 bootModules 加载模块 runtime，core 再注册 collector。collector 只接 live assistant/message 中 model 来源且有 usage 的记录，保存 sourceEventSeq，开始流时冻结可用计费快照，然后调用选装 billing 计价。无 billing 时保留 unpriced 原始量，不能把金额字段0解释成免费请求。runtime-core 的回调把记录交给 billing/观察者，另由兼容 writer写会话行；源码体现原始采集与估价的责任分离。

这一集成能减少人工拼分量和规则的步骤，但本地计价并非供应商实际扣款，覆盖范围仍受宿主事件和模型 usage 限制。重复源事件去重和计费快照有具体依据，真实费用节省、动画是否改善预算决策则没有同条件结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-15](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/README.md#L15-L15)

作者的用量、费用、余额定位。

```text
为 DeepSeek Harness 提供用量、费用与余额监控：查看单次调用、会话累计和历史统计，让鲸鱼娘陪你观察每次 Token 消耗。
```

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/index.ts:23-34](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/index.ts#L23-L34)

入口实际加载模块。

<details>
<summary>查看原文（12行）</summary>

```text
export async function apply(ctx: Context, config: TokenMonitorUserConfig): Promise<void> {
  registerUserSettings(ctx, config)
  const pluginRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  // Source checkouts keep the browser bundle beside the workspace package. A
  // packed install has no workspace tree, so prefer the installed runtime/client
  // payload and fall back to the monolithic package lib directory.
  const sourceClient = resolve(pluginRoot, '../../packages/client/ui-token-monitor/lib')
  const runtimeClient = resolve(pluginRoot, 'runtime/client')
  const packagedClient = resolve(pluginRoot, 'lib')
  const isSourceTree = pluginRoot.replaceAll('\\', '/').endsWith('/plugins/dsh-token-monitor')
  const clientRoot = existsSync(runtimeClient) ? runtimeClient : isSourceTree ? sourceClient : packagedClient
  await bootModules(ctx, pluginRoot, clientRoot)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/runtime-core.ts:50-70](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/runtime-core.ts#L50-L70)

真实 core注册与collector接线。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context, services: ModuleServices, installed: (id: string) => boolean): { drainSettings(): Promise<void> } {
  ctx.inject(['sessionProjections'], projection => {
    projection.effect(() => projection.sessionProjections.register(createTokenCostProjectionDefinition(services.priceTable())), 'token-monitor: usage projection')
  })
  ctx.inject(['sessionProjections', 'sessionProjectionCache', 'sessionPersistence'], migrateMissingTokenCost)
  const work = new ModuleWork()
  ctx.effect(() => () => work.stop(), 'token-monitor: settings writes')
  // 宿主未确认会落盘 ignorable 标记时不写会话用量行：没有标记的未知事件会让整份
  // 会话日志被读取端拒绝解释（issue #24），停写后金额仍由插件账本与兜底路由提供。
  const sessionRecords = new SessionRecordWriter({
    onStop: status => ctx.logger.warn(`token-monitor: ${status.detail}`),
  })
  if (!sessionRecords.enabled()) {
    const status = sessionRecords.status()
    ctx.logger.warn(`token-monitor: 已停写会话用量记录（capability=${status.capability}）：${status.detail}`)
  }
  attachUsageCollector(ctx, services.storage, {
    readBilling: () => services.billing?.readSnapshot(),
    priceRecord: (record, frozen) => services.billing?.priceRecord(record, frozen) ?? record,
    onPersistedRecord: (record, kind) => { services.billing?.onPersistedRecord(record, kind); services.observeRecord?.(record, kind) },
    appendUsageRecord: (session, record) => { sessionRecords.append(session, record) },
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-token-monitor/src/collector-core.ts:18-50](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/collector-core.ts#L18-L50)

live usage、冻结快照、unpriced及后续回调。

<details>
<summary>查看原文（33行）</summary>

```text
export function attachUsageCollector(ctx: Context, storage: UsageStorage, options: UsageCollectorOptions): void {
  const requests = new WeakMap<Session, { turn: number; step: number; billing: BillingSnapshot }>()
  let active = true
  ctx.effect(() => () => { active = false }, 'token-monitor: usage capture lifetime')
  ctx.on('agent/assistant-stream', ({ agent, frame }) => {
    if (frame.type === 'start') {
      const billing = options.readBilling?.()
      if (billing !== undefined) requests.set(agent.session, { turn: frame.turn, step: frame.step, billing: structuredClone(billing) })
    } else if (frame.type === 'end') requests.delete(agent.session)
  })
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    if (!active || event.type !== 'assistant/message') return
    if (typeof session.firstLiveSeq === 'number' && event.seq < session.firstLiveSeq) return
    const usage = event.data.usage, source = event.data.message.source
    if (usage === undefined || source.kind !== 'model') return
    const raw: UsageRecord = {
      sessionId: session.id, turn: event.data.turn, step: event.data.step, sourceEventSeq: event.seq,
      timestamp: event.time, provider: source.provider, model: source.model, inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens, cacheReadTokens: usage.cacheReadTokens ?? 0, cacheWriteTokens: usage.cacheWriteTokens ?? 0,
      reasoningTokens: usage.reasoningTokens ?? 0, cost: 0, costInput: 0, costOutput: 0, costCache: 0, costCacheRead: 0,
      costCacheWrite: 0, peak: false, billingStatus: 'unpriced',
    }
    if (!isValidUsageRecord(raw)) return
    const request = requests.get(session)
    const frozen = request?.turn === raw.turn && request.step === raw.step ? request.billing : options.readBilling?.()
    const record = options.priceRecord?.(raw, frozen) ?? raw
    if (!isValidUsageRecord(record) || storage.add(record) === undefined) return
    const kind = record.inputTokens > 0 || record.cacheWriteTokens > 0 ? 'miss' : 'normal'
    options.onPersistedRecord?.(record, kind)
    queueMicrotask(() => {
      if (!active) return
      options.appendUsageRecord?.(session, record)
    })
```

</details>

#### 缺口

- 没有用户任务与供应商账单的同条件独立对照。
  **影响**：不能证明反馈正确性覆盖全部请求，也不能声称节费。
  **进一步探讨**：在固定版本记录一组已知请求、总尝试和账单，逐条核 provider/model、usage、规则与金额。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 余额脚本和凭据轮换如何隔离旧结果？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

余额脚本在受限 QuickJS 上下文返回请求描述符或解析 JSON，代码设置32KiB脚本、8MiB内存、栈和100ms中断限制，没有向 VM 注入 Node、环境或网络。Host 按当前 provider 的显式 credential reference 读取 key 与 endpoint，再执行请求，脚本本身不接触 key。这种职责分离比让用户脚本直接拿密钥发任意请求更便于审阅，但本研究没有穷尽网络地址、所有请求解析和解释器逃逸边界。

registry 在请求前读脚本与身份，变化时 invalidate 并换 generation；响应到达后再次读取 revision/key/baseURL，检查停止、abort及当前entry相同才缓存结果。因此凭据轮换或脚本修改后，不应仅靠旧 Promise 完成就回填新身份余额。失败删除缓存并退避，带 updatedAt 和 credentialGeneration 输出；这是源码机制而非真实供应商连接已成功。

实际用途仍依赖供应商响应语义、批准脚本和当前凭据。余额、credits 和套餐窗口不应被混成同一货币；没有身份或无合法脚本时暂停比借用另一provider key更合理。复用这套设计需同时保留 Host 请求约束、身份复核和生命周期，而不能只复制一个 QuickJS 超时。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/balance-script.ts:69-103](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/balance-script.ts#L69-L103)

VM 限制与只复制 JSON 的脚本边界。

<details>
<summary>查看原文（35行）</summary>

```text
/** Run one adapter phase with no Node, environment, module loader, timers or network globals.
 * @param script Complete expression returning { request, parse(response) }.
 * @param response JSON response for parsing; omitted when inspecting the request.
 * @returns JSON copied out of the isolated interpreter.
 */
export async function evaluateBalanceScript(script: string, response?: unknown): Promise<unknown> {
  if (Buffer.byteLength(script, 'utf8') > MAX_BALANCE_SCRIPT_BYTES) throw new Error('Balance script exceeds 32 KiB')
  const quickjs = await getQuickJS()
  const runtime = quickjs.newRuntime()
  runtime.setMemoryLimit(8 * 1024 * 1024)
  runtime.setMaxStackSize(256 * 1024)
  const deadline = Date.now() + 100
  runtime.setInterruptHandler(() => Date.now() >= deadline)
  const vm = runtime.newContext()
  try {
    const responseJson = response === undefined ? undefined : JSON.stringify(response)
    if (responseJson !== undefined && Buffer.byteLength(responseJson) > MAX_BALANCE_RESPONSE_BYTES) throw new Error('Balance response exceeds 256 KiB')
    const value = vm.evalCode(`"use strict"; (() => {
      const adapter = (${script}\n);
      if (!adapter || typeof adapter.parse !== 'function') throw new Error('Expected request and parse(response)');
      const result = ${responseJson === undefined ? 'adapter.request' : `adapter.parse(${responseJson})`};
      if (result && typeof result.then === 'function') throw new Error('Async adapters are unsupported');
      return JSON.stringify(result);
    })()`, 'balance-adapter.js')
    if (value.error) {
      // Do not dump untrusted error messages, which may contain response secrets.
      value.error.dispose()
      throw new Error('Balance script failed validation or exceeded execution limits')
    }
    try {
      const json = vm.getString(value.value)
      if (Buffer.byteLength(json) > MAX_BALANCE_RESPONSE_BYTES) throw new Error('Balance script output is too large')
      return JSON.parse(json) as unknown
    } finally { value.value.dispose() }
  } finally { vm.dispose(); runtime.dispose() }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/balance-provider.ts:30-58](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/balance-provider.ts#L30-L58)

按当前provider解析凭据和endpoint。

<details>
<summary>查看原文（29行）</summary>

```text
export async function resolveBalanceIdentity(
  ctx: Context,
  provider: string,
  balanceProvider?: BalanceProviderEntry,
): Promise<BalanceIdentity | undefined> {
  if (balanceProvider !== undefined) {
    const resolved = await ctx.credentials.resolve(credentialRef(balanceProvider.apiKeyEnv))
    if (!resolved?.value) return undefined
    return { apiKey: resolved.value, baseURL: balanceProvider.baseURL }
  }
  const descriptor = ctx.llm.listConfigurableProviders().find(item => item.provider === provider)
  if (!descriptor || descriptor.error) return undefined
  // 活配置里没有该 namespace 的描述符时视为不可解析。
  let profile: unknown = ctx.settings.describe().find(item => item.ns === descriptor.settingsNs)?.value
  for (const key of descriptor.settingsPath) {
    if (!profile || typeof profile !== 'object') return undefined
    profile = (profile as Record<string, unknown>)[key]
  }
  if (!profile || typeof profile !== 'object') return undefined
  const fields = profile as Record<string, unknown>
  const official = isOfficialProvider(provider)
    && (descriptor.settingsNs === 'llm-deepseek' || descriptor.settingsNs === 'llm-deepseek-account')
  const ref = fields.apiKeyEnv ?? (official ? 'DEEPSEEK_API_KEY' : undefined)
  const baseURL = fields.baseURL ?? (official ? launchEnvironmentOf(ctx).get('DEEPSEEK_BASE_URL')?.value ?? 'https://api.deepseek.com' : undefined)
    ?? PROVIDER_BASE_URL_FALLBACKS[provider]
  if (typeof ref !== 'string' || !ref || typeof baseURL !== 'string') return undefined
  const resolved = await ctx.credentials.resolve(credentialRef(ref))
  if (!resolved?.value) return undefined
  return { apiKey: resolved.value, baseURL }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/balance-registry.ts:78-119](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/balance-registry.ts#L78-L119)

请求前后身份/revision检查与失败缓存处理。

<details>
<summary>查看原文（42行）</summary>

```text
    const [script, identity] = await Promise.all([this.dependencies.readScript(provider), this.dependencies.resolveIdentity(provider)])
    if (this.stopped || generation !== (this.generations.get(provider) ?? 0)) return {}
    if (script.status !== 'valid' || !script.request || !identity) { this.invalidate(provider); return {} }
    let entry = this.entries.get(provider)
    if (!entry || entry.revision !== script.revision || entry.identity.apiKey !== identity.apiKey || entry.identity.baseURL !== identity.baseURL) {
      this.invalidate(provider)
      entry = { identity, revision: script.revision, generation: randomUUID(), controller: new AbortController(), nextAttempt: 0, failures: 0 }
      this.entries.set(provider, entry)
    }
    if (entry.pending) return { result: entry.pending }
    const now = this.dependencies.now ?? Date.now
    if (now() < entry.nextAttempt || this.active >= 4) return entry.value ? { result: entry.value } : {}
    const current = entry
    this.active++
    current.pending = (async () => {
      try {
        const raw = await this.dependencies.request(script.request!, identity.baseURL, identity.apiKey, current.controller.signal)
        const balance = validateScriptBalance(await evaluateBalanceScript(script.script, raw))
        const [latestScript, latestIdentity] = await Promise.all([this.dependencies.readScript(provider), this.dependencies.resolveIdentity(provider)])
        if (this.stopped || current.controller.signal.aborted || this.entries.get(provider) !== current) return undefined
        if (latestScript.revision !== current.revision || latestScript.status !== 'valid'
          || latestIdentity?.apiKey !== identity.apiKey || latestIdentity.baseURL !== identity.baseURL) { this.invalidate(provider); return undefined }
        current.value = { ...balance, updatedAt: now(), provider, scriptRevision: script.revision, credentialGeneration: current.generation }
        current.failures = 0
        current.lastFailure = undefined
        current.nextAttempt = now() + 15_000
        return current.value
      } catch (error) {
        // No upstream exception or response content is exposed to logs or clients.
        delete current.value
        current.failures++
        // Recovery stays fast: an ordinary transport failure waits one poll interval instead of
        // growing exponentially, so a restarted proxy is picked up by the next scheduled read.
        // An upstream 429 keeps the wait it asked for; a policy refusal keeps the same short
        // interval because the address rule is recorded rather than the exemption widened.
        const requested = error instanceof BalanceNetworkError ? error.retryAfterMs : undefined
        current.nextAttempt = now() + (requested ?? 15_000)
        // One diagnostic per failure streak or classification change; never per retry.
        const kind = error instanceof BalanceNetworkError ? error.kind : 'transport'
        if (current.failures === 1 || current.lastFailure !== kind) this.dependencies.warn?.('dsh-token-monitor: balance query failed (' + kind + ')')
        current.lastFailure = kind
        return undefined
```

</details>

#### 缺口

- 未穷尽balance-network和各供应商响应语义、真实网络效果。
  **影响**：不能把受限脚本等同于完整安全证明或所有余额正确。
  **进一步探讨**：固定provider和脚本后定向核网络策略、身份轮换、迟到结果及真实余额语义。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地账本与模块生命周期能否支撑耐久历史？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最影响“消费记录可靠”的限制是内存累计成功不等于明细耐久保存。UsageStorage.add 先 fold并加入records/dailySpend，再 append usage.jsonl；写失败只 warn仍返回next。collector据返回继续 onPersistedRecord，名称不能证明落盘成功；源事件去重集合也在写盘前标记。因此当前进程可继续显示和提醒，重启后却可能缺这一行。冷启动对缺失/损坏行采取 fail-soft，进一步要求读者不要把汇总当财务对账。

同时应保留有力反证。sourceEventSeq与sessionId去重能抑制同一live源重复，读取历史也经过验证；模块 bootstrap 在运行前核manifest和core artifact并恢复事务，state置于profile外于包载荷，有独占lease、tombstone与重启恢复。这些是清晰的生命周期工程，不应因账本写失败就称全包没有恢复设计。

安装完整性与数据完整性是不同保证。根包要求打包 runtime/manifest；直接源码或不完整tgz可能无法启动。模块start/stop由Cordis子scope承接，停止core可停止采集，保留数据与删除数据需要用户明确选择。发布说明中的实际桌面截图和测试属于作者材料，本次没有运行复现，未将其当本地证据。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:139-163](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/storage.ts#L139-L163)

先更新内存/去重再写盘，异常不阻止返回。

<details>
<summary>查看原文（25行）</summary>

```text
  /** 把一条单次记录累加到对应会话，并追加持久化明细。 */
  add(record: UsageRecord): SessionSummary | undefined {
    if (!isValidUsageRecord(record)) return undefined
    if (this.isDuplicateSourceEvent(record)) return undefined
    const next = this.fold(record)
    this.summaries.set(record.sessionId, next)

    // 明细：内存缓存 + JSONL 追加（fail-soft，落盘失败不影响运行时）。
    this.records.push(record)
    this.addToDailySpend(record)
    try {
      appendFileSync(join(this.dataDir, 'usage.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
    } catch (error) {
      console.warn(`[dsh-token-monitor] 明细落盘失败: ${String(error)}`)
    }

    return next
  }

  private isDuplicateSourceEvent(record: UsageRecord): boolean {
    if (record.sourceEventSeq === undefined) return false
    const key = JSON.stringify([record.sessionId, record.sourceEventSeq])
    if (this.seenSourceEvents.has(key)) return true
    this.seenSourceEvents.add(key)
    return false
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:65-94](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/storage.ts#L65-L94)

历史fail-soft，坏行和读取失败边界。

<details>
<summary>查看原文（30行）</summary>

```text
  /** 冷启动回读历史明细（fail-soft：文件缺失/损坏行静默跳过）。 */
  private loadHistory(): void {
    try {
      const text = readFileSync(join(this.dataDir, 'usage.jsonl'), 'utf8')
      let excluded = 0
      for (const line of text.split('\n')) {
        const trimmed = line.trim()
        if (trimmed === '') continue
        try {
          const record = normalizeUsageRecord(JSON.parse(trimmed))
          if (record !== undefined && isValidUsageRecord(record)) {
            if (this.isDuplicateSourceEvent(record)) continue
            this.records.push(record)
            this.summaries.set(record.sessionId, this.fold(record))
            this.addToDailySpend(record)
          }
          else excluded++
        } catch {
          // 跳过损坏的行
        }
      }
      if (this.records.length > 0) {
        console.log(`[dsh-token-monitor] 已加载 ${this.records.length} 条历史明细`)
      }
      if (excluded > 0) {
        console.log(`[dsh-token-monitor] 已从运行时汇总排除 ${excluded} 条不合格历史明细（原始 JSONL 未修改）`)
      }
    } catch {
      // 首次运行无文件，静默
    }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/collector-core.ts:43-50](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/collector-core.ts#L43-L50)

storage成功返回后仍发后续回调。

```text
    const record = options.priceRecord?.(raw, frozen) ?? raw
    if (!isValidUsageRecord(record) || storage.add(record) === undefined) return
    const kind = record.inputTokens > 0 || record.cacheWriteTokens > 0 ? 'miss' : 'normal'
    options.onPersistedRecord?.(record, kind)
    queueMicrotask(() => {
      if (!active) return
      options.appendUsageRecord?.(session, record)
    })
```

**依据 4 · 源码核查**：[plugins/dsh-token-monitor/src/module-bootstrap.ts:47-85](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/module-bootstrap.ts#L47-L85)

独占lease、状态、事务恢复和载荷验证。

<details>
<summary>查看原文（39行）</summary>

```text
export async function bootModules(ctx: Context, pluginRoot: string, clientRoot: string): Promise<void> {
  const runtime = resolve(pluginRoot, 'runtime')
  await assertInstalledPayload(runtime)
  // Package managers replace node_modules during upgrades. Keep tombstones and
  // the transaction journal in the profile, outside the installed payload.
  const stateFile = resolve(pluginRoot, '..', '..', '.dsh-damage-pulse', 'module-state.json')
  const legacyStateFile = resolve(runtime, 'state.json')
  const roots: ArtifactRoots = { host: resolve(runtime, 'host'), assets: resolve(runtime, 'assets'), client: clientRoot }
  await mkdir(dirname(stateFile), { recursive: true })
  const releaseLease = await acquireModuleLease(stateFile)
  ctx.effect(() => releaseLease, 'token-monitor: exclusive installed runtime')
  await recoverModuleLock(stateFile)
  const { manifest, removed } = await withFileLock(stateFile, async () => {
    try { await readFile(stateFile, 'utf8') }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      // In-place installations can migrate the old package-local state.
      // A legacy transaction needs recovery with its original package first.
      try {
        await readFile(legacyStateFile + '.transaction.json', 'utf8')
        throw new Error('LEGACY_MODULE_RECOVERY_REQUIRED')
      } catch (journalError) {
        if ((journalError as NodeJS.ErrnoException).code !== 'ENOENT') throw journalError
      }
      try { await atomicJson(stateFile, JSON.parse(await readFile(legacyStateFile, 'utf8'))) }
      catch (legacyError) { if ((legacyError as NodeJS.ErrnoException).code !== 'ENOENT') throw legacyError }
    }
    await recoverModuleTransaction(stateFile, roots)
    let state: { manifest?: unknown; wholePlugin?: { pending?: boolean }; removed?: Record<string, { pending?: boolean }> } | undefined
    try { state = JSON.parse(await readFile(stateFile, 'utf8')) }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
    const packaged = JSON.parse(await readFile(resolve(runtime, 'manifest.json'), 'utf8'))
    // Pending deletion still owns the previous release's paths. Only a completed
    // whole removal can evaluate a replacement package for reinstatement.
    const pending = state?.wholePlugin?.pending || Object.values(state?.removed ?? {}).some(record => record.pending)
    const manifest = state?.wholePlugin && pending && state.manifest
      ? validateManifest(state.manifest) : selectBootManifest(packaged, state?.wholePlugin ? undefined : state?.manifest)
    if (!state?.wholePlugin) for (const file of manifest.core) await verifyArtifact(roots, file)
    return { manifest, removed: !!state?.wholePlugin }
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-token-monitor/src/runtime-host.ts:42-61](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/runtime-host.ts#L42-L61)

模块和core子scope启动/停止。

<details>
<summary>查看原文（20行）</summary>

```text
  const lifecycle: ModuleLifecycle = {
    async start(id) {
      if (children.has(id)) return
      const feature: RuntimeFeature = options.loadFeature ? await options.loadFeature(id) : await import(pathToFileURL(resolve(roots.host, `${id}.mjs`)).href + `?v=${manifest.version}`)
      const child = ctx.plugin({ name: `token-monitor-${id}`, apply: (scope: Context) => feature.apply(scope, services) })
      children.set(id, child)
      try { await child.await() } catch (error) { await child.dispose(); children.delete(id); throw error }
    },
    async stop(id) {
      await coreRuntime?.drainSettings()
      const child = children.get(id)
      if (child) { await child.dispose(); children.delete(id) }
    },
    async startCore() {
      if (coreChild) return
      coreChild = ctx.plugin({ name: 'token-monitor-background-core', apply(scope: Context) { coreRuntime = core.apply(scope, services, id => manager.isInstalled(id)) } })
      await coreChild.await()
    },
    async stopCore() {
      if (coreChild) { await coreChild.dispose(); coreChild = undefined; coreRuntime = undefined }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下值得试，怎样核成本与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

适合把它当个人消费观察器，先只开用量和明细，用少量有明确usage的请求核来源、缓存、规则和供应商记录；没有余额凭据也能观察原始量。只有账单精确结算、硬预算拦截或合规耐久账本需求的人，不宜直接依赖它。预算检测代码发布通知，没有取消请求控制；提醒之后用户仍需自己停止或调整任务。

首次需匹配宿主客户端和完整发布载荷，必要的sessions/credentials/settings与客户端注入面；持续付出JSONL增长、轮询、UI与可选脚本/通知服务成本，并人工复核规则。所有资源量、配置耗时和节省金额均未知，不因作者赞助或可安装就写免费。微信/更新模块未全审，应在确认需要、权限和退路后另开，而不是把它们当核心采集启动条件。

停止条件是明细无法与来源对应、出现unpriced却被误认成零费、写盘告警或余额身份不符。此时暂停相关可选功能，保留原始账本与宿主日志，回到供应商记录核对；卸载前选择保留配置和历史，不能清空账本来掩盖故障。若日常复核负担大于同屏观察的便利，应退出试用。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/index.ts:16-18](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/index.ts#L16-L18)

核心必选服务。

```text
export const name = 'dsh-token-monitor'
export { Config } from './config-base.ts'
export const inject = ['sessions', 'credentials', 'settings']
```

**依据 2 · 作者声明**：[README.md:24-35](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/README.md#L24-L35)

作者安装完整包、profile与凭据说明。

<details>
<summary>查看原文（12行）</summary>

````text
**当前源码版本：4.3.2，适配 DeepSeek Harness 0.2.1-rc.1 至 rc.5。** 4.3.0 与 4.3.1 缺少 `0.2.1-rc.4` 的兼容声明，会被该宿主的兼容检查跳过。4.3.2 刚发布时会受包管理器约 24 小时的新版本等待期影响；需要立即安装时请指定版本，或使用 Release 里完整的 `.tgz`。

在桌面版「插件」页添加包名 `dsh-damage-pulse`，或下载 Release 中完整的 `.tgz` 后添加其文件路径。也可用 CLI 安装 npm 当前发布版：

```powershell
dsh plugin --profile desktop add dsh-damage-pulse
```

将 `desktop` 换成实际使用的 profile 名。安装后**完整退出桌面程序（含托盘）再启动**，在悬浮卡右键的「卸载与更新」核对版本。

- 需要指定版本时，使用对应 Release 的预编译 `.tgz`；不要直接安装仓库 URL、`github:` 地址、`Source code` 压缩包或未打包的源码目录，它们缺少运行载荷。
- 页面提示已安装时，先移除再添加完整包；保留配置和历史数据，不用清空账本解决启动问题。
````

</details>

**依据 3 · 作者声明**：[README.md:118-137](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/README.md#L118-L137)

作者明确预算不阻断和模块保留数据。

<details>
<summary>查看原文（20行）</summary>

```text
### 提醒与微信通知

可设置每日预算、峰谷切换和连续缓存命中异常提醒，通过鲸鱼娘气泡或 ClawBot 微信发送。预算提醒不会阻止或取消请求。业务通知默认关闭，测试消息可独立发送；设置面板提供扫码登录、连接状态、刷新、重连与断开操作。

<p align="center"><img src="docs/assets/readme/settings-dialog.png" alt="提醒规则、通知渠道与微信连接" width="720"></p>

<details>
<summary>查看提醒规则与微信示例</summary>

<p align="center"><img src="docs/assets/readme/notification-settings.png" alt="预算、峰谷与缓存异常提醒" width="520"></p>

<p align="center"><img src="docs/assets/readme/dsh-damage-pulse-wechat-live.jpg" alt="微信通知示例" width="520"></p>

</details>

### 模块管理与更新

桌宠、数据概览、通知、计费规则和微信渠道五个模块可独立卸载，状态在重启与升级后保留。默认保留配置和历史；取消保留选项会清除对应模块的数据。整体卸载会停止用量采集。

「卸载与更新」可检查 GitHub Release，并在校验版本、下载来源与 SHA-256 后安装。正常升级保留设置、账本和已卸载模块状态。
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-token-monitor/src/provider-notifications.ts:55-62](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/provider-notifications.ts#L55-L62)

预算阈值实际发布通知。

```text
    const anomaly = detector.observe(record)
    if (anomaly) publish(record.provider, createCacheHitAnomalyNotification(anomaly, record), formatCacheHitAnomalyMessage(anomaly))
    if ((record.billingStatus !== undefined && record.billingStatus !== 'priced') || beijingDateKey(record.timestamp) !== beijingDateKey(timestamp)) return
    const state = budgetFor(record.provider, timestamp)
    const date = beijingDateKey(timestamp)
    state.total = { ...state.total, date, cost: (state.total.date === date ? state.total.cost : 0) + record.cost, updatedAt: timestamp }
    const crossing = state.tracker.observe(state.total, config.dailyBudgetCny, config.dailyBudgetEnabled)
    if (crossing && config.budgetExceededNotificationEnabled) publish(record.provider, createBudgetThresholdNotification(crossing, timestamp, record.provider), formatBudgetThresholdMessage(crossing))
```

**依据 5 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:139-155](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/storage.ts#L139-L155)

耐久失败需要用户对账的实际负担。

<details>
<summary>查看原文（17行）</summary>

```text
  /** 把一条单次记录累加到对应会话，并追加持久化明细。 */
  add(record: UsageRecord): SessionSummary | undefined {
    if (!isValidUsageRecord(record)) return undefined
    if (this.isDuplicateSourceEvent(record)) return undefined
    const next = this.fold(record)
    this.summaries.set(record.sessionId, next)

    // 明细：内存缓存 + JSONL 追加（fail-soft，落盘失败不影响运行时）。
    this.records.push(record)
    this.addToDailySpend(record)
    try {
      appendFileSync(join(this.dataDir, 'usage.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
    } catch (error) {
      console.warn(`[dsh-token-monitor] 明细落盘失败: ${String(error)}`)
    }

    return next
```

</details>

#### 缺口

- 无资源基准、工作量记录与预算行为效果对照。
  **影响**：不能推算ROI、节费率或单位合格任务成本。
  **进一步探讨**：固定任务与规则，比较原账单流程和插件流程，记录全部复核时间、存储/CPU、错误及总费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少金额与耐久状态的误读？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设可在现有金额和charge反馈旁持续提供来源覆盖、priced/unpriced、耐久保存和余额采集时间四类可追溯状态，让用户先判断这笔数能否用于决策。推导来自Q01的本地规则估价、Q03的内存/磁盘分离以及Q02的余额更新时间；拟议增量是解释可信度，不能让估价自动成为供应商扣款。

反证是记录已带billingStatus、sourceEventSeq，余额已带updatedAt和generation，且已有失败告警，因此不能说系统完全没有状态。需要先核产品哪些位置已呈现，再只补真正遗漏的信息，防止把同一数据重复成噪声。

最小实验在同一桌面版本安排正常计价、未知模型、磁盘不可写、凭据轮换/迟到结果几类合成演练，比较现有UI和状态摘要原型。观察用户能否发现不完整、是否错误把金额用于结算、核对耗时和打断负担；若已有UI同样清楚、摘要滞后或干扰更多则否定。未得到这种用户证据前，它只是未验证设计，不是已确认需求或本包已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-token-monitor/src/collector-core.ts:33-46](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/collector-core.ts#L33-L46)

现有原始来源和unpriced字段。

<details>
<summary>查看原文（14行）</summary>

```text
    const raw: UsageRecord = {
      sessionId: session.id, turn: event.data.turn, step: event.data.step, sourceEventSeq: event.seq,
      timestamp: event.time, provider: source.provider, model: source.model, inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens, cacheReadTokens: usage.cacheReadTokens ?? 0, cacheWriteTokens: usage.cacheWriteTokens ?? 0,
      reasoningTokens: usage.reasoningTokens ?? 0, cost: 0, costInput: 0, costOutput: 0, costCache: 0, costCacheRead: 0,
      costCacheWrite: 0, peak: false, billingStatus: 'unpriced',
    }
    if (!isValidUsageRecord(raw)) return
    const request = requests.get(session)
    const frozen = request?.turn === raw.turn && request.step === raw.step ? request.billing : options.readBilling?.()
    const record = options.priceRecord?.(raw, frozen) ?? raw
    if (!isValidUsageRecord(record) || storage.add(record) === undefined) return
    const kind = record.inputTokens > 0 || record.cacheWriteTokens > 0 ? 'miss' : 'normal'
    options.onPersistedRecord?.(record, kind)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-token-monitor/src/storage.ts:146-155](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/storage.ts#L146-L155)

落盘失败与内存回传分离。

<details>
<summary>查看原文（10行）</summary>

```text
    // 明细：内存缓存 + JSONL 追加（fail-soft，落盘失败不影响运行时）。
    this.records.push(record)
    this.addToDailySpend(record)
    try {
      appendFileSync(join(this.dataDir, 'usage.jsonl'), `${JSON.stringify(record)}\n`, 'utf8')
    } catch (error) {
      console.warn(`[dsh-token-monitor] 明细落盘失败: ${String(error)}`)
    }

    return next
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-token-monitor/src/balance-registry.ts:94-104](https://github.com/wssfk12138/dsh-damage-pulse/blob/26e8d5ce3689f6bb4b053b14a6e953adc37d8fdf/plugins/dsh-token-monitor/src/balance-registry.ts#L94-L104)

余额身份检查和updatedAt已存在。

<details>
<summary>查看原文（11行）</summary>

```text
        const raw = await this.dependencies.request(script.request!, identity.baseURL, identity.apiKey, current.controller.signal)
        const balance = validateScriptBalance(await evaluateBalanceScript(script.script, raw))
        const [latestScript, latestIdentity] = await Promise.all([this.dependencies.readScript(provider), this.dependencies.resolveIdentity(provider)])
        if (this.stopped || current.controller.signal.aborted || this.entries.get(provider) !== current) return undefined
        if (latestScript.revision !== current.revision || latestScript.status !== 'valid'
          || latestIdentity?.apiKey !== identity.apiKey || latestIdentity.baseURL !== identity.baseURL) { this.invalidate(provider); return undefined }
        current.value = { ...balance, updatedAt: now(), provider, scriptRevision: script.revision, credentialGeneration: current.generation }
        current.failures = 0
        current.lastFailure = undefined
        current.nextAttempt = now() + 15_000
        return current.value
```

</details>

#### 缺口

- 未完整核全部UI状态呈现，也无用户误读和原型对照。
  **影响**：不能确认新增摘要的必要性或净收益。
  **进一步探讨**：先读当前具体展示，再按故障演练交叉对照，保留否定结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
