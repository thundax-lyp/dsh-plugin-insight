# dsh-usage-analytics

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6b44b37](https://github.com/3361805598-gif/dsh-usage-analytics/tree/6b44b372e475188acd71feef81e8451b70c05483)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)
<!-- END META -->

> **实现功能**：在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。

> **核心亮点**：把持久会话修订、流式去重、fork继承排除和本地时区图表组合成可重建的个人统计链，比简单累加消息更明确处理重复来源；不等同供应商计费协议。详见[Q02](#research-q02)。

> **风险与缺陷**：known只代表响应有任一有效用量字段，其余缺失可归零；显式技能success也不证明任务成功。请求围栏不是身份鉴权，重建期间结果要结合索引状态解释。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要这些图表，统计能回答什么和不能回答什么？](#detail-section-11)
  - [Q02 · 原始事件如何归集且避免重复计算？](#detail-section-12)
  - [Q03 · 删除、重建、请求围栏与工程恢复有何边界？](#detail-section-13)
  - [Q04 · 启动、界面查询与错误恢复依赖什么？](#detail-section-14)
  - [Q05 · 成本和效果有哪些能成立的判断？](#detail-section-15)
  - [Q06 · 采用与可证伪创新方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户按本地时区回顾模型用量与技能活动，合格结果需同时解释覆盖率和索引状态，不能直接当账单或业务绩效。

逐条阅读轨迹或写日志分析脚本是直接替代；插件增加窗口、时区、模型和技能分布的交互汇总，未替代账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 时间窗口图表 | 本地时区1/7/30天Token活动 | 仅源事件报告用量，不估算缺失 |
| 模型分布 | 查看provider/model调用及Token | 不转换成金额 |
| 技能状态 | 自动/显式来源与成功/失败/未完成 | 显式调用成功不等于业务完成 |
| 重建派生缓存 | 从持久源重新计算 | 202是启动，等待index状态；不删原会话 |
| 周期与实时同步 | 修订号跳过未变会话，回填变化 | 变更会话从0重读，资源未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=20与DSH web | 声明必需 | 宿主索引和设置界面 | 非web不提供该设置页 |
| 特定0.1.1-rc.2宿主peer与Cordis ^4.0.1 | 包声明必需 | 持久会话、存储域及web接口 | 其他版本兼容未由本次证明 |
| webServer/webRuntime/sessionPersistence/sessions/storageDomain | 注入必需 | 路由、围栏、源读取、flush和缓存 | 任一接口不符可阻断统计链 |
| zod ^4.3.6 | 运行依赖 | 派生记录schema | 包/格式不一致需排查 |
| 可读原会话及TokenUsage | 效果必需 | 重算与真实用量来源 | 缺用量不估算，源不可读影响完整性 |
| slots与客户端设置包 | web分支必需 | 注册个人分析分区 | 不出现界面，不等于没有后台索引 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对包来源、固定版本和宿主依赖 | 不把GitHub源码自动等同已核实tgz |
| 加载 | 安装作者分发包或自行检查构建后加入profile，重启并硬刷新 | 宿主/客户端一致，设置出现个人分析 |
| 查阅 | 选择窗口，检查时区、index状态与coverage | ready之外结果需结合失败和缺失项解释 |
| 恢复 | 先确认原会话可读，再重建派生缓存 | 202仅表示启动，等待索引结束再判断成功 |
| 退出 | 移除插件并重启宿主 | 不依赖删除原会话清理插件 |

查询hook按10秒轮询并在卸载或窗口改变时取消请求。重建请求有本地AbortController与重复点击保护，但取消浏览器请求不是取消宿主重建。原会话、插件缓存和浏览器展示三层状态需分别理解。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装包、存储域和全量会话读取资源，量未知 | 版本匹配、安装重启与核对用量口径 | 首次索引按现有会话数量处理，耗时未测 |
| 持续使用 | 每分钟校准、turn/end整会话重算、界面10秒轮询 | 解释coverage、时区和技能状态 | 90天限制明细，不等于源扫描成本只覆盖90天 |
| 失败恢复 | 重建删除缓存再重读全会话；I/O未知 | 确认原件、等待索引、核对失败及误解 | 202不是成功完成，源数据缺失不能靠缓存修复 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 汇总可读性 | 1/7/30天本地时区图表与覆盖信息可查 | 是否减少实际排查时间 |
| 重复计数控制 | 继承前缀、终止chunk和revision机制 | 所有宿主/供应商事件形态下准确性 |
| 隐私收敛 | 派生schema不存正文、参数与结果 | 多人部署鉴权和元数据敏感性 |

changed会话使用readFrom(id,0)重读，再过滤90天明细；长期大历史会话即使只显示30天，也可能付出更大的解析成本。源revision未变可跳过重算，但summary每次仍聚合内存记录。没有会话量、事件量、端到端时延和人工对照，不给低成本或节时比例。

> **思考**：known只代表响应有任一有效用量字段，其余缺失可归零；显式技能success也不证明任务成功。请求围栏不是身份鉴权，重建期间结果要结合索引状态解释。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把持久会话修订、流式去重、fork继承排除和本地时区图表组合成可重建的个人统计链，比简单累加消息更明确处理重复来源；不等同供应商计费协议。详见[Q02](#research-q02)。

把持久会话修订、流式去重、fork继承排除和本地时区图表组合成可重建的个人统计链，比简单累加消息更明确处理重复来源；不等同供应商计费协议。详见[Q02](#research-q02)。

最影响统计解释的是“已知”只有响应级标记，不能当作所有Token字段都完整。usageFrom只要任一受支持字段是有效非负数字就标作有用量，其余缺失或非法字段变0。因此只有reasoning字段的响应也可known=true却total=0。coverage表示响应是否出现至少一个有效字段，不证明账单完整。显式技能调用在user/message事件直接标success，表示调用被识别，不证明技能执行与业务成果成功。

工程上，队列串行化重建、实时写入和周期补齐；rebuildPending和refreshPending去重，reducerVersion让旧解析规则自动重算。重建只删插件自己的表再回填，不删除原会话。重建中的summary可读到阶段性空/部分记录，所以indexing/partial/error必须参与解释，不能把一瞬间的零当历史归零。写失败后队列捕获错误、周期重试，保留可恢复方向，但没有事务化重建快照切换。

trust-fence核验Host是否回环或trustedHosts、拒绝cross-site及不匹配Origin，但无Origin时放行。这是来源围栏而非用户身份鉴权，POST rebuild没有独立认证。它不证明远程多人环境隔离，派生数据虽没有正文仍包含模型、技能名和使用节奏。源码包的pack脚本带--ignore-scripts，与README称npm run pack都会经prepack检查存在静态冲突，不能仅凭作者打包说明认定每份分发产物已校验。本轮未执行打包、攻击或恢复实验。

<a id="detail-section-5"></a>

### 1.4 主要限制

known只代表响应有任一有效用量字段，其余缺失可归零；显式技能success也不证明任务成功。请求围栏不是身份鉴权，重建期间结果要结合索引状态解释。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人本机用户可用少量可人工核对的会话试用；先确认宿主依赖与访问控制，遇到用量无法对账、索引持续失败即停止依赖图表。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持本地事件归集和缓存恢复贡献；字段完整性、部署鉴权与任务收益仍有边界；字段级对账收据是未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/analytics/reducer.ts、src/analytics/indexer.ts、src/analytics/summary.ts、src/analytics/spec.ts、src/server/trust-fence.ts、src/server/http.ts、src/client/index.tsx、src/client/useUsageInsights.ts、lib/index.mjs、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码阅读宿主入口、reducer/indexer/summary/schema、请求围栏、客户端接线和轮询，抽读已提交lib入口；未完整核查分发tgz与构建等价、上层鉴权或性能，未执行目标代码。
- 下一步：进一步探讨可从缺字段、重复chunk、fork继承与重建失败样本对账入手，再按历史事件规模比较索引资源和人工排查时间。

**分析版本**

- **仓库**：[3361805598-gif/dsh-usage-analytics](https://github.com/3361805598-gif/dsh-usage-analytics)
- **版本号**：0.2.1（[固定提交 6b44b37](https://github.com/3361805598-gif/dsh-usage-analytics/tree/6b44b372e475188acd71feef81e8451b70c05483)）
- **版本日期**：2026-09-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索字段级覆盖与源修订对账收据，用真实缺字段和重复事件样本比较是否减少误判及解释时间；当前未实现，不计为插件已有创新。详见[Q06](#research-q06)。

进一步探讨可从缺字段、重复chunk、fork继承与重建失败样本对账入手，再按历史事件规模比较索引资源和人工排查时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 166 | — | — | 1834 |
| .tsx | source | 6 | 213 | 198 | 1 | — |
| .js | source | 1 | 779 | 758 | 176 | — |
| .mjs | source | 2 | 738 | 722 | 26 | — |
| .ts | source | 14 | 814 | 719 | 19 | — |
| .ts | test | 4 | 338 | 309 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics/issues?q=is%3Aissue+created%3A2026-09-22T04%3A49%3A05.505Z..2026-10-22T04%3A49%3A05.505Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A49%3A05.505Z..2026-10-22T04%3A49%3A05.505Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本本地个人用量统计的事件口径、缓存可靠性、信任边界与采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这些图表，统计能回答什么和不能回答什么？

**研究主题**：场景与需求

#### 完整回答

面向在本地DSH web持续使用模型和技能、想知道何时使用最多、哪些模型占主要Token的人。任务是把原始会话事件转成按本地时区的1/7/30天视图，检查用量构成和技能调用状态。合格输出同时交代统计窗口、时区、用量覆盖率、不可读会话与索引状态，不能只有一个总Token数字。

原来可逐个读取轨迹或编写会话日志分析脚本。插件增加设置内可交互的热力图、模型分布和技能状态，降低人工汇总负担。它只回答被持久化事件记录到的活动，不是供应商账单、任务价值或生产效率评估。Token没有价格、折扣和失败任务成本映射，技能工具返回成功也不等于最终业务交付合格。

原始会话仍是可重算来源，派生索引不保存正文和工具参数。这使它适合本机个人行为回顾，而不是直接交给团队当费用分摊或员工绩效依据。部署中会话可读范围、源事件完整性和本地时区都会影响解释。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-33](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/README.md#L20-L33)

作者列出图表、窗口和派生数据边界。

<details>
<summary>查看原文（14行）</summary>

```text

## 功能

- 设置页新增「个人分析」分区，按 1 / 7 / 30 天切换统计窗口；
- 今日小时柱图、7 天小时热力图、30 天可点击日历；日期和小时明细按本机时区归类；
- Token 构成条与分类占比，推理用量作为输出子集单独说明；
- 模型分布：显示提供方、调用次数、Token 与用量占比，支持展开完整列表；
- 技能调用：区分自动 / 显式来源，显示成功、失败、未完成数量及成功率；
- 「重建统计缓存」只删除本插件的派生索引，再从原始 DSH 会话重新归集。

## 数据边界

插件只写入自己的派生索引（时间戳、数值型 Token 用量、模型标识、技能名、调用来源和结果）。不写入提示词、模型回复、工具参数、工具结果、工作目录或密钥。Token 与技能明细按 90 天窗口清理（启动时及运行期间每分钟执行）；会话修订号等同步元数据会保留到源会话删除；「重建统计缓存」只删除该派生索引，然后从原始 DSH 会话重新归集，绝不删除会话。

```

</details>

**依据 2 · 源码核查**：[src/analytics/summary.ts:101-109](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/summary.ts#L101-L109)

返回窗口、时区、索引和coverage，支撑合格输出标准。

```text
  totals.activeDays = activeDays.size
  const denominator = knownAttempts + unknownAttempts
  return {
    schemaVersion: 1, range: options.range, timeZone: options.timeZone, generatedAt: now, index: { ...options.index },
    totals, heatmap, ...(calendar ? { calendar } : {}),
    models: [...modelMap.values()].sort((a, b) => b.total - a.total),
    skills: [...skillMap.values()].sort((a, b) => b.calls - a.calls),
    coverage: { percent: denominator ? Math.round((knownAttempts / denominator) * 100) : 100, knownAttempts, unknownAttempts, unreadableSessions: options.unreadableSessions ?? 0, missingParents },
  }
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 原始事件如何归集且避免重复计算？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

启动时打开usage_insights存储域，读入会话记录、清理90天外明细、监听turn/end并后台补齐索引。每次实时同步先flush会话，再从持久化读取事件，而不是直接拿可能已进入下一轮的内存数组。周期同步按会话ID、创建时间、sourceRevision与reducerVersion判定是否需要整会话重算；删除源会话时删除对应派生记录。

reducer跳过seedLength以内继承事件，按turn:step记住流式attempt。终止chunk已记账时，assistant/message只作备用而不再加一次；无用量的响应仍进入known=false的统计。总Token为input+output+cacheRead+cacheWrite，reasoning保留展示但不重复加进总量。技能调用按callId和result配对，未结束的自动调用标incomplete，显式调用另记来源。

贡献是把事件去重、继承前缀处理、持久化修订与本地时区聚合组合成可重建的个人分析链。相较直接累加消息Token，它更明确避免流式终止消息和fork继承的重复计数；相较原始轨迹，它增加可交互汇总。这属于可检查的数据管线增量，不是新的费用计量协议。部署入口实际为lib/index.mjs，本轮也抽读了对应已提交产物中的核心usage归一化实现，未证明整个构建产物与TS逐字等价。

#### 证据与依据

**依据 1 · 源码核查**：[src/analytics/indexer.ts:91-111](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/indexer.ts#L91-L111)

实时同步先flush再读落盘，失败保留partial并等待重试。

<details>
<summary>查看原文（21行）</summary>

```text
  private installLiveReducer(): void {
    const events = this.ctx as unknown as { on(name: string, listener: (session: LiveSession, event: SessionEventLike) => void): void }
    events.on('session/event', (session, event) => {
      // A turn boundary is both stable and cheap: flush source events first, then replace the whole fact record.
      if (event.type === 'turn/end') void this.enqueue(() => this.syncLive(session))
    })
  }

  private async syncLive(session: LiveSession): Promise<void> {
    try {
      await this.ctx.sessions.flush(session)
      const snapshots = await this.ctx.sessionPersistence.listSnapshots()
      const snapshot = snapshots.find((item) => item.header.id === session.id)
      if (!snapshot) return
      // Read durable events: the live array may already contain the next, unflushed turn.
      const source = await this.ctx.sessionPersistence.readFrom(session.id, 0)
      const record = reduceSession(source.meta, source.events, String(snapshot.revision))
      await this.save(record)
    } catch {
      // The periodic reconciliation retries failures without publishing live-only facts.
      this.index.state = 'partial'
```

</details>

**依据 2 · 源码核查**：[src/analytics/indexer.ts:115-140](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/indexer.ts#L115-L140)

按修订和reducer版本重算并清理源删除。

<details>
<summary>查看原文（26行）</summary>

```text
  private async backfill(): Promise<void> {
    try {
      await this.prune()
      const snapshots = await this.ctx.sessionPersistence.listSnapshots()
      const available = new Set(snapshots.map((item) => item.header.id))
      this.index = { state: 'indexing', processedSessions: 0, totalSessions: snapshots.length, failures: 0 }
      for (const key of [...this.records.keys()]) {
        if (!available.has(key)) { await this.table.delete(key); this.records.delete(key) }
      }
      for (const snapshot of snapshots) {
        const existing = this.records.get(snapshot.header.id)
        const revision = String(snapshot.revision)
        if (existing?.reducerVersion === REDUCER_VERSION && existing.sourceCreatedAt === snapshot.header.createdAt && String(existing.sourceRevision) === revision) {
          this.index.processedSessions += 1
          continue
        }
        try {
          const source = await this.ctx.sessionPersistence.readFrom(snapshot.header.id, 0)
          await this.save(reduceSession(source.meta, source.events, revision))
        } catch {
          this.index.failures += 1
        } finally {
          this.index.processedSessions += 1
        }
      }
      this.index.state = this.index.failures ? 'partial' : 'ready'
```

</details>

**依据 3 · 源码核查**：[src/analytics/reducer.ts:64-117](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/reducer.ts#L64-L117)

继承前缀、流式终止与组装消息去重。

<details>
<summary>查看原文（54行）</summary>

```text
/** Reduce a durable session event stream into privacy-preserving facts. */
export function reduceSession(header: SessionHeaderLike, events: SessionEventLike[], revision: string | number, now = Date.now()): SessionUsageRecord {
  const usage: UsageFact[] = []
  const skills: SkillFact[] = []
  const attempts = new Map<string, { usage?: TokenBreakdown; terminal: boolean; provider: string; model: string }>()
  const pendingSkills = new Map<string, { name: string; at: number; turn: unknown }>()
  let currentModel = { provider: 'unknown', model: 'unknown' }
  const inheritedPrefix = header.seedLength ?? 0

  for (const event of events) {
    if (event.seq < inheritedPrefix || !event.data || typeof event.data !== 'object') continue
    const data = event.data as Record<string, unknown>

    if (event.type === 'request/header') {
      const candidate = data.header
      if (candidate && typeof candidate === 'object') currentModel = providerAndModel(candidate as Record<string, unknown>)
      continue
    }

    if (event.type === 'assistant/chunk') {
      const attempt = attempts.get(keyOf(data)) ?? { terminal: false, ...currentModel }
      const chunk = data.chunk
      if (chunk && typeof chunk === 'object') {
        const raw = chunk as Record<string, unknown>
        const reported = usageFrom(raw.usage)
        if (reported) attempt.usage = reported
        if (raw.finish && !attempt.terminal) {
          attempt.terminal = true
          const token = attempt.usage ?? emptyTokens()
          usage.push({ at: event.time, provider: attempt.provider, model: attempt.model, known: Boolean(attempt.usage), ...token })
        }
      }
      attempts.set(keyOf(data), attempt)
      continue
    }

    if (event.type === 'assistant/message') {
      const attempt = attempts.get(keyOf(data))
      // A streamed terminal attempt is authoritative. The assembled message is its fallback only.
      if (!attempt?.terminal) {
        const message = data.message
        const rawMessage = message && typeof message === 'object' ? message as Record<string, unknown> : {}
        const reported = usageFrom(data.usage) ?? usageFrom(rawMessage.usage) ?? attempt?.usage
        const token = reported ?? emptyTokens()
        const source = rawMessage.source && typeof rawMessage.source === 'object' ? rawMessage.source as Record<string, unknown> : {}
        usage.push({
          at: event.time,
          provider: typeof source.provider === 'string' ? source.provider : currentModel.provider,
          model: typeof source.model === 'string' ? source.model : currentModel.model,
          known: Boolean(reported),
          ...token,
        })
      }
      continue
```

</details>

**依据 4 · 源码核查**：[src/analytics/reducer.ts:11-24](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/reducer.ts#L11-L24)

总量及reasoning子集口径。

<details>
<summary>查看原文（14行）</summary>

```text
function usageFrom(value: unknown): TokenBreakdown | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const seen = ['inputTokens', 'outputTokens', 'cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens']
    .some((key) => typeof raw[key] === 'number' && Number.isFinite(raw[key]) && raw[key] >= 0)
  if (!seen) return undefined
  const input = numberOf(raw.inputTokens)
  const output = numberOf(raw.outputTokens)
  const cacheRead = numberOf(raw.cacheReadTokens)
  const cacheWrite = numberOf(raw.cacheWriteTokens)
  const reasoning = numberOf(raw.reasoningTokens)
  // reasoning is a subset of output in DSH TokenUsage, never add it twice.
  return { input, output, cacheRead, cacheWrite, reasoning, total: input + output + cacheRead + cacheWrite }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 删除、重建、请求围栏与工程恢复有何边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最影响统计解释的是“已知”只有响应级标记，不能当作所有Token字段都完整。usageFrom只要任一受支持字段是有效非负数字就标作有用量，其余缺失或非法字段变0。因此只有reasoning字段的响应也可known=true却total=0。coverage表示响应是否出现至少一个有效字段，不证明账单完整。显式技能调用在user/message事件直接标success，表示调用被识别，不证明技能执行与业务成果成功。

工程上，队列串行化重建、实时写入和周期补齐；rebuildPending和refreshPending去重，reducerVersion让旧解析规则自动重算。重建只删插件自己的表再回填，不删除原会话。重建中的summary可读到阶段性空/部分记录，所以indexing/partial/error必须参与解释，不能把一瞬间的零当历史归零。写失败后队列捕获错误、周期重试，保留可恢复方向，但没有事务化重建快照切换。

trust-fence核验Host是否回环或trustedHosts、拒绝cross-site及不匹配Origin，但无Origin时放行。这是来源围栏而非用户身份鉴权，POST rebuild没有独立认证。它不证明远程多人环境隔离，派生数据虽没有正文仍包含模型、技能名和使用节奏。源码包的pack脚本带--ignore-scripts，与README称npm run pack都会经prepack检查存在静态冲突，不能仅凭作者打包说明认定每份分发产物已校验。本轮未执行打包、攻击或恢复实验。

#### 证据与依据

**依据 1 · 源码核查**：[src/analytics/reducer.ts:11-24](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/reducer.ts#L11-L24)

任意一个有效字段即可known，其余numberOf回0，是coverage的实际边界。

<details>
<summary>查看原文（14行）</summary>

```text
function usageFrom(value: unknown): TokenBreakdown | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const seen = ['inputTokens', 'outputTokens', 'cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens']
    .some((key) => typeof raw[key] === 'number' && Number.isFinite(raw[key]) && raw[key] >= 0)
  if (!seen) return undefined
  const input = numberOf(raw.inputTokens)
  const output = numberOf(raw.outputTokens)
  const cacheRead = numberOf(raw.cacheReadTokens)
  const cacheWrite = numberOf(raw.cacheWriteTokens)
  const reasoning = numberOf(raw.reasoningTokens)
  // reasoning is a subset of output in DSH TokenUsage, never add it twice.
  return { input, output, cacheRead, cacheWrite, reasoning, total: input + output + cacheRead + cacheWrite }
}
```

</details>

**依据 2 · 源码核查**：[src/analytics/reducer.ts:135-140](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/reducer.ts#L135-L140)

显式技能调用事件直接标success，不能解释为最终成功。

```text
    if (event.type === 'user/message') {
      const message = data.message ?? data
      const source = message && typeof message === 'object' ? (message as Record<string, unknown>).source : undefined
      if (source && typeof source === 'object' && (source as Record<string, unknown>).kind === 'skill-invocation') {
        const name = (source as Record<string, unknown>).name
        skills.push({ at: event.time, name: typeof name === 'string' ? name : '未知技能', origin: 'explicit', status: 'success' })
```

**依据 3 · 源码核查**：[src/analytics/indexer.ts:52-70](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/indexer.ts#L52-L70)

重建逐项删除后回填，队列捕获错误，无候选快照原子切换。

<details>
<summary>查看原文（19行）</summary>

```text
  rebuild(): Promise<void> {
    if (this.rebuildPending) return this.rebuildPending
    this.index = { state: 'indexing', processedSessions: 0, totalSessions: this.records.size, failures: 0 }
    this.rebuildPending = this.enqueue(async () => {
      for (const key of [...this.table.keys()]) {
        await this.table.delete(key)
        this.records.delete(key)
      }
      await this.backfill()
    }).finally(() => { this.rebuildPending = undefined })
    return this.rebuildPending
  }

  private enqueue(operation: () => Promise<void>): Promise<void> {
    this.queue = this.queue.then(async () => {
      if (this.disposed) return
      try { await operation() } catch { this.index.state = 'error' }
    })
    return this.queue
```

</details>

**依据 4 · 源码核查**：[src/server/trust-fence.ts:21-39](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/server/trust-fence.ts#L21-L39)

无Origin允许、Host名单检查不是身份认证。

<details>
<summary>查看原文（19行）</summary>

```text
export function isTrustedRequest(request: { headers: IncomingHttpHeaders }, trustedHosts: readonly string[]): boolean {
  const host = one(request.headers, 'host')
  const hostUrl = host ? authority(host) : undefined
  if (!hostUrl) return false
  const trusted = trustedHosts.some((candidate) => {
    const allowed = authority(candidate)
    return allowed && (allowed.port === '' ? allowed.hostname === hostUrl.hostname : allowed.host === hostUrl.host)
  })
  if (!loopback(hostUrl.hostname) && !trusted) return false
  if (Array.isArray(request.headers.origin) || Array.isArray(request.headers['sec-fetch-site'])) return false
  if (one(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = one(request.headers, 'origin')
  if (!origin) return true
  try {
    const source = new URL(origin)
    return (source.protocol === 'http:' || source.protocol === 'https:')
      && !source.username && !source.password && source.pathname === '/' && !source.search && !source.hash
      && source.host === hostUrl.host
  } catch { return false }
```

</details>

**依据 5 · 源码核查**：[package.json:25-34](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/package.json#L25-L34)

pack命令使用--ignore-scripts，不能照搬README的prepack保证。

<details>
<summary>查看原文（10行）</summary>

```text
  "scripts": {
    "build": "tsdown --config tsdown.config.ts && tsc -p tsconfig.build.json",
    "preview:ui": "node scripts/preview.mjs",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "npm run typecheck && npm test && npm run build",
    "prepack": "npm run check",
    "pack": "mkdir -p dist && npm pack --ignore-scripts --pack-destination dist",
    "clean": "node -e \"const fs=require('fs'); for (const f of fs.readdirSync('.')) { if (f.endsWith('.tgz')) fs.unlinkSync(f) }\""
  },
```

</details>

#### 缺口

- 未核对各模型实际TokenUsage字段完整性和供应商账单。
  **影响**：known响应率不能变成计费覆盖率或精确总费用。
  **进一步探讨**：可用缺字段、零字段和部分字段的真实响应样本逐项对账，区分响应覆盖与字段覆盖。
- 部署中的用户认证及可信主机配置未完整核查。
  **影响**：不能认可多人或公网场景的统计保密性。
  **进一步探讨**：可从实际webRuntime trustedHosts与上层访问认证链入手，核对匿名查询和重建请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、界面查询与错误恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=20与DSH web | 声明必需 | 宿主索引和设置界面 | 非web不提供该设置页 |
| 特定0.1.1-rc.2宿主peer与Cordis ^4.0.1 | 包声明必需 | 持久会话、存储域及web接口 | 其他版本兼容未由本次证明 |
| webServer/webRuntime/sessionPersistence/sessions/storageDomain | 注入必需 | 路由、围栏、源读取、flush和缓存 | 任一接口不符可阻断统计链 |
| zod ^4.3.6 | 运行依赖 | 派生记录schema | 包/格式不一致需排查 |
| 可读原会话及TokenUsage | 效果必需 | 重算与真实用量来源 | 缺用量不估算，源不可读影响完整性 |
| slots与客户端设置包 | web分支必需 | 注册个人分析分区 | 不出现界面，不等于没有后台索引 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对包来源、固定版本和宿主依赖 | 不把GitHub源码自动等同已核实tgz |
| 加载 | 安装作者分发包或自行检查构建后加入profile，重启并硬刷新 | 宿主/客户端一致，设置出现个人分析 |
| 查阅 | 选择窗口，检查时区、index状态与coverage | ready之外结果需结合失败和缺失项解释 |
| 恢复 | 先确认原会话可读，再重建派生缓存 | 202仅表示启动，等待索引结束再判断成功 |
| 退出 | 移除插件并重启宿主 | 不依赖删除原会话清理插件 |

查询hook按10秒轮询并在卸载或窗口改变时取消请求。重建请求有本地AbortController与重复点击保护，但取消浏览器请求不是取消宿主重建。原会话、插件缓存和浏览器展示三层状态需分别理解。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:8-38](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/index.ts#L8-L38)

服务注入、summary路由和rebuild异步202语义。

<details>
<summary>查看原文（31行）</summary>

```text
export const name = 'dsh-usage-analytics'
export const inject = ['webServer', 'webRuntime', 'sessionPersistence', 'sessions', 'storageDomain']

type PluginContext = Context & {
  webRuntime: { trustedHosts: readonly string[] }
  webServer: { register(route: { kind: 'prefix'; path: string; handler(req: IncomingMessage, res: ServerResponse): void | Promise<void> }): () => void }
}

const API_ROOT = '/dsh-usage-analytics/api'
const ranges = new Set<UsageRange>(['1d', '7d', '30d'])

export async function apply(ctx: PluginContext): Promise<void> {
  const index = new UsageInsightsIndex(ctx as never)
  await index.start()
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix', path: API_ROOT,
    async handler(req, res) {
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) { sendJson(res, 403, { ok: false, error: 'forbidden' }); return }
      const url = new URL(req.url ?? API_ROOT, 'http://dsh.local')
      const path = url.pathname.slice(API_ROOT.length)
      if ((req.method ?? 'GET') === 'GET' && path === '/summary') {
        const range = url.searchParams.get('range') ?? '7d'
        const timeZone = url.searchParams.get('timeZone') ?? Intl.DateTimeFormat().resolvedOptions().timeZone
        if (!ranges.has(range as UsageRange)) { sendJson(res, 400, { ok: false, error: 'invalid-range' }); return }
        try { sendJson(res, 200, { ok: true, value: index.summary(range as UsageRange, timeZone) }) }
        catch { sendJson(res, 400, { ok: false, error: 'invalid-time-zone' }) }
        return
      }
      if ((req.method ?? 'GET') === 'POST' && path === '/rebuild') {
        void index.rebuild()
        sendJson(res, 202, { ok: true, value: { started: true } })
```

</details>

**依据 2 · 源码核查**：[package.json:37-66](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/package.json#L37-L66)

运行时和peer依赖声明。

<details>
<summary>查看原文（30行）</summary>

```text
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "inject": ["@deepseek-ai/dsh-client-runtime", "@deepseek-ai/dsh-client-ui-settings"],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-runtime": "0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.1.1-rc.2",
    "@deepseek-ai/dsh-host-webserver": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session-persistence": "0.1.1-rc.2",
    "@deepseek-ai/dsh-storage-domain": "0.1.1-rc.2",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-client-runtime": { "optional": true },
    "@deepseek-ai/dsh-client-ui-settings": { "optional": true },
    "react": { "optional": true }
  },
  "dependencies": { "zod": "^4.3.6" },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-runtime": "0.1.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.1.1-rc.2",
    "@deepseek-ai/dsh-host-webserver": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session": "0.1.1-rc.2",
    "@deepseek-ai/dsh-session-persistence": "0.1.1-rc.2",
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:5-13](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/client/index.tsx#L5-L13)

设置分区实际注册。

```text
export const name = 'dsh-usage-analytics-client'
export const inject = ['slots']

export function apply(ctx: Context & { slots: { inject(name: string, callback: () => unknown): unknown; register(options: unknown, component: unknown): unknown } }): void {
  ensureUsageInsightsStyles()
  ctx.effect(() => installUsageInsightsNavIcon(), 'usageInsights.navIcon')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'personal-insights', order: 30, label: () => '个人分析',
  }, UsageInsightsPage))
```

**依据 4 · 源码核查**：[src/client/useUsageInsights.ts:15-52](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/client/useUsageInsights.ts#L15-L52)

轮询、取消与重建请求生命周期。

<details>
<summary>查看原文（38行）</summary>

```text
  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    const poll = async () => {
      setLoading(true)
      try {
        const value = await getSummary(range, controller.signal)
        if (!controller.signal.aborted) { setStored(value); setError(undefined) }
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '无法读取分析数据')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
          timer = setTimeout(() => void poll(), 10_000)
        }
      }
    }
    setError(undefined)
    void poll()
    return () => { controller.abort(); clearTimeout(timer) }
  }, [range, refresh])

  useEffect(() => () => rebuildRequest.current?.abort(), [])
  const reload = useCallback(() => setRefresh((value) => value + 1), [])
  const rebuild = useCallback(async () => {
    if (rebuildRequest.current) return
    const controller = new AbortController()
    rebuildRequest.current = controller
    setRebuilding(true)
    try {
      await rebuildIndex(controller.signal)
      if (!controller.signal.aborted) reload()
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '无法启动重建')
    } finally {
      if (!controller.signal.aborted) setRebuilding(false)
      rebuildRequest.current = undefined
    }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 成本和效果有哪些能成立的判断？

**研究主题**：效果与总成本

#### 完整回答

合格任务是准确回答一个统计窗口内“哪些活动在何时产生了多少已报告用量”，并能解释缺失与索引失败。它不以模型调用减少作为效果标准，因为插件本身不限制模型或改变任务流程。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装包、存储域和全量会话读取资源，量未知 | 版本匹配、安装重启与核对用量口径 | 首次索引按现有会话数量处理，耗时未测 |
| 持续使用 | 每分钟校准、turn/end整会话重算、界面10秒轮询 | 解释coverage、时区和技能状态 | 90天限制明细，不等于源扫描成本只覆盖90天 |
| 失败恢复 | 重建删除缓存再重读全会话；I/O未知 | 确认原件、等待索引、核对失败及误解 | 202不是成功完成，源数据缺失不能靠缓存修复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 汇总可读性 | 1/7/30天本地时区图表与覆盖信息可查 | 是否减少实际排查时间 |
| 重复计数控制 | 继承前缀、终止chunk和revision机制 | 所有宿主/供应商事件形态下准确性 |
| 隐私收敛 | 派生schema不存正文、参数与结果 | 多人部署鉴权和元数据敏感性 |

changed会话使用readFrom(id,0)重读，再过滤90天明细；长期大历史会话即使只显示30天，也可能付出更大的解析成本。源revision未变可跳过重算，但summary每次仍聚合内存记录。没有会话量、事件量、端到端时延和人工对照，不给低成本或节时比例。

#### 证据与依据

**依据 1 · 源码核查**：[src/analytics/indexer.ts:99-108](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/indexer.ts#L99-L108)

每轮flush后从0重读整个会话。

<details>
<summary>查看原文（10行）</summary>

```text
  private async syncLive(session: LiveSession): Promise<void> {
    try {
      await this.ctx.sessions.flush(session)
      const snapshots = await this.ctx.sessionPersistence.listSnapshots()
      const snapshot = snapshots.find((item) => item.header.id === session.id)
      if (!snapshot) return
      // Read durable events: the live array may already contain the next, unflushed turn.
      const source = await this.ctx.sessionPersistence.readFrom(session.id, 0)
      const record = reduceSession(source.meta, source.events, String(snapshot.revision))
      await this.save(record)
```

</details>

**依据 2 · 源码核查**：[src/analytics/indexer.ts:115-140](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/indexer.ts#L115-L140)

周期按revision跳过或重读，会话删除同步。

<details>
<summary>查看原文（26行）</summary>

```text
  private async backfill(): Promise<void> {
    try {
      await this.prune()
      const snapshots = await this.ctx.sessionPersistence.listSnapshots()
      const available = new Set(snapshots.map((item) => item.header.id))
      this.index = { state: 'indexing', processedSessions: 0, totalSessions: snapshots.length, failures: 0 }
      for (const key of [...this.records.keys()]) {
        if (!available.has(key)) { await this.table.delete(key); this.records.delete(key) }
      }
      for (const snapshot of snapshots) {
        const existing = this.records.get(snapshot.header.id)
        const revision = String(snapshot.revision)
        if (existing?.reducerVersion === REDUCER_VERSION && existing.sourceCreatedAt === snapshot.header.createdAt && String(existing.sourceRevision) === revision) {
          this.index.processedSessions += 1
          continue
        }
        try {
          const source = await this.ctx.sessionPersistence.readFrom(snapshot.header.id, 0)
          await this.save(reduceSession(source.meta, source.events, revision))
        } catch {
          this.index.failures += 1
        } finally {
          this.index.processedSessions += 1
        }
      }
      this.index.state = this.index.failures ? 'partial' : 'ready'
```

</details>

**依据 3 · 源码核查**：[src/analytics/summary.ts:67-99](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/summary.ts#L67-L99)

查询遍历记录与事实并按本地天分组。

<details>
<summary>查看原文（33行）</summary>

```text
  const materialized = [...records]
  for (const record of materialized) recordIds.add(record.sessionId)

  for (const record of materialized) {
    if (record.parentSession && !recordIds.has(record.parentSession)) missingParents += 1
    for (const item of record.usage) {
      const { day, hour } = localParts(item.at, formatter)
      if (!selected.has(day)) continue
      activeDays.add(day); totals.modelCalls += 1; addTokens(totals, item); upsertModel(modelMap, item)
      if (item.known) knownAttempts += 1; else unknownAttempts += 1
      const cell = heatmapByKey.get(heatmapKey(options.range, day, hour))
      if (cell) { cell.attempts += 1; if (!item.known) cell.unknownAttempts += 1; addTokens(cell, item) }
      const calendarDay = calendarByDay.get(day)
      if (calendarDay) {
        calendarDay.attempts += 1
        if (!item.known) calendarDay.unknownAttempts += 1
        addTokens(calendarDay, item)
        const calendarHour = calendarDay.hours[hour]
        if (calendarHour) {
          calendarHour.attempts += 1
          if (!item.known) calendarHour.unknownAttempts += 1
          calendarHour.total += item.total
        }
      }
    }
    for (const item of record.skills) {
      if (!selected.has(localParts(item.at, formatter).day)) continue
      totals.skillCalls += 1
      const target = skillMap.get(item.name) ?? { name: item.name, calls: 0, automatic: 0, explicit: 0, success: 0, failure: 0, incomplete: 0 }
      target.calls += 1; target[item.origin] += 1; target[item.status] += 1
      if (!target.lastUsedAt || target.lastUsedAt < item.at) target.lastUsedAt = item.at
      skillMap.set(item.name, target)
    }
```

</details>

**依据 4 · 源码核查**：[src/analytics/spec.ts:5-20](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/spec.ts#L5-L20)

派生schema限定字段，不包含原文内容。

<details>
<summary>查看原文（16行）</summary>

```text
const token = z.object({
  at: z.number(), provider: z.string(), model: z.string(), known: z.boolean(),
  input: z.number(), output: z.number(), cacheRead: z.number(), cacheWrite: z.number(), reasoning: z.number(), total: z.number(),
})
const skill = z.object({
  at: z.number(), name: z.string(), origin: z.enum(['automatic', 'explicit']), status: z.enum(['success', 'failure', 'incomplete']), durationMs: z.number().optional(),
})
const record = z.object({
  schemaVersion: z.literal(1), reducerVersion: z.number().optional(), sessionId: z.string(), sourceCreatedAt: z.number(), sourceRevision: z.union([z.string(), z.number()]), parentSession: z.string().optional(),
  origin: z.enum(['root', 'subagent']), updatedAt: z.number(), usage: z.array(token), skills: z.array(skill),
}) satisfies z.ZodType<SessionUsageRecord>

export const usageInsightsDomain = defineDomain({
  // Keep v1 readable: preview builds wrote numeric revisions, while current DSH writes opaque strings.
  name: 'usage_insights', version: 1,
  tables: { sessions: domainTable<string, SessionUsageRecord>(record) },
```

</details>

#### 缺口

- 缺少大历史会话与多会话场景的索引、查询和人工对照数据。
  **影响**：不能量化维护开销或判断汇总收益是否超过持续扫描成本。
  **进一步探讨**：可按会话总数与事件数分层，比较首次、增量和重建耗时及同任务人工排查时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 采用与可证伪创新方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议试用，适合本机单用户DSH、愿意把统计看作已记录事件分析而不是账单的人。主链路有持久源、去重和重建机制，默认不留正文，试用目标可限定为小样本人工对账。先核对宿主版本和访问控制，选含流式、fork和显式技能的会话，比对原始事件、known/unknown和技能状态；若总量无法解释、持续partial/error或重建读不到原件，应停止依据图表作判断。

由known的响应级口径可推导字段级覆盖与对账收据假设。每次汇总同时给出哪些字段确实被供应商报告、哪些只是缺省0，以及reducer版本、源会话修订集合和读取失败清单，可能让用户区分“没有消耗”与“没拿到字段”。它会增加数据模型、历史迁移和界面负担，不能为了更复杂而做。

最小对照使用完整、部分、零用量、重复chunk和继承前缀样本，比较当前known比例和字段覆盖收据能否让审阅者更准确判断可对账范围，再记录解释耗时。若额外信息不减少误判或产生更多混淆，应否定收益。该方向未实现、不计入现有创新分；也不声称插件已经达到同版本安装、核心功能和卸载验收，故不是值得安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/analytics/reducer.ts:11-24](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/reducer.ts#L11-L24)

部分字段归零与响应known是字段覆盖假设的事实起点。

<details>
<summary>查看原文（14行）</summary>

```text
function usageFrom(value: unknown): TokenBreakdown | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const seen = ['inputTokens', 'outputTokens', 'cacheReadTokens', 'cacheWriteTokens', 'reasoningTokens']
    .some((key) => typeof raw[key] === 'number' && Number.isFinite(raw[key]) && raw[key] >= 0)
  if (!seen) return undefined
  const input = numberOf(raw.inputTokens)
  const output = numberOf(raw.outputTokens)
  const cacheRead = numberOf(raw.cacheReadTokens)
  const cacheWrite = numberOf(raw.cacheWriteTokens)
  const reasoning = numberOf(raw.reasoningTokens)
  // reasoning is a subset of output in DSH TokenUsage, never add it twice.
  return { input, output, cacheRead, cacheWrite, reasoning, total: input + output + cacheRead + cacheWrite }
}
```

</details>

**依据 2 · 源码核查**：[src/analytics/summary.ts:102-109](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/summary.ts#L102-L109)

当前coverage以响应数为分母，缺字段未独立列示。

```text
  const denominator = knownAttempts + unknownAttempts
  return {
    schemaVersion: 1, range: options.range, timeZone: options.timeZone, generatedAt: now, index: { ...options.index },
    totals, heatmap, ...(calendar ? { calendar } : {}),
    models: [...modelMap.values()].sort((a, b) => b.total - a.total),
    skills: [...skillMap.values()].sort((a, b) => b.calls - a.calls),
    coverage: { percent: denominator ? Math.round((knownAttempts / denominator) * 100) : 100, knownAttempts, unknownAttempts, unreadableSessions: options.unreadableSessions ?? 0, missingParents },
  }
```

**依据 3 · 源码核查**：[src/index.ts:25-38](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/index.ts#L25-L38)

试用必须考虑访问围栏与异步重建状态。

<details>
<summary>查看原文（14行）</summary>

```text
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) { sendJson(res, 403, { ok: false, error: 'forbidden' }); return }
      const url = new URL(req.url ?? API_ROOT, 'http://dsh.local')
      const path = url.pathname.slice(API_ROOT.length)
      if ((req.method ?? 'GET') === 'GET' && path === '/summary') {
        const range = url.searchParams.get('range') ?? '7d'
        const timeZone = url.searchParams.get('timeZone') ?? Intl.DateTimeFormat().resolvedOptions().timeZone
        if (!ranges.has(range as UsageRange)) { sendJson(res, 400, { ok: false, error: 'invalid-range' }); return }
        try { sendJson(res, 200, { ok: true, value: index.summary(range as UsageRange, timeZone) }) }
        catch { sendJson(res, 400, { ok: false, error: 'invalid-time-zone' }) }
        return
      }
      if ((req.method ?? 'GET') === 'POST' && path === '/rebuild') {
        void index.rebuild()
        sendJson(res, 202, { ok: true, value: { started: true } })
```

</details>

#### 缺口

- 字段级覆盖是否降低真实用户对Token数据的误判尚无实验。
  **影响**：只能作为设计假设，不提高当前统计完整性或采用等级。
  **进一步探讨**：可先对固定样本进行盲判对账任务，比较误判和解释时间再决定是否实现。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
