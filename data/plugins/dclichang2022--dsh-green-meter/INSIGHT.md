# dsh-green-meter

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[73b61dd](https://github.com/dclichang2022/dsh-green-meter/tree/73b61dd3b5e0fc165310d0dfb85ff8673b87958c)

<!-- BEGIN META -->
[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dclichang2022/dsh-green-meter)
<!-- END META -->

> **功能**：Electron DSH 桌面整合 GPU 采样、能碳估算账本和费用控制台。

> **亮点**：[Q01](#research-q01) 集中展示请求账本、采样与参考系数。

> **主要限制**：[Q02](#research-q02) 时间积分不是独占请求能量，云和省钱为模型估算。

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
  - [Q01 · 桌面如何把对话账本和硬件采样放到一起？](#detail-section-11)
  - [Q02 · 所谓实测能量怎样归属请求？](#detail-section-12)
  - [Q03 · 什么验证足以支持用户用数字决策？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地或云模型用户希望观察资源趋势和系数。

普通 DSH 加独立硬件监控及手工表格。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面启动 | 内置 Host 与控制台 | 封装版本与 home 独立核对 |
| Token估算与写账 | 归档插件按usage计算能碳并追加JSONL | 模型系数估算，异步落盘可能滞后 |
| GPU采样 | 设备窗口功率积分 | NVIDIA、覆盖和并发限制 |
| 预算 | 估计超限后拒绝后续步骤 | 不是实时电表硬限 |
| 汇总导出 | JSONL汇总与CSV | 跳过坏行须核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows Electron 与内置 Host | 桌面需要 | 应用启动及日志 | 须验封装版本 |
| nvidia-smi 与支持 GPU | 实测路径需要 | 功率采样 | 不可用返回缺失而非实测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 建立基线 | 保存独立电表和空闲窗口 | 核对覆盖 |
| 运行任务 | 分开独占与并发 | 对齐账本身份和时间 |
| 解释结果 | 云系数与本地窗口分列 | 无校准只看趋势 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和测试电表成本未知 | 安装桌面及核对 vendor 记账 | 需硬件支持 |
| 持续 | 监测及存储开销未知 | 校准 GPU 基线和云/电网系数 | 两小时内窗口 |
| 失败 | 核算工时未知 | 保留 JSONL 和采样回独立监测 | 坏行被跳过会降低总数 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 观测 | 源码可合并采样和账本 | 独占请求真实误差 |
| 费用 | 源码生成假设 API 与电费对照 | 真实节省和云账单一致性 |

> **思考**：[Q02](#research-q02) 时间积分不是独占请求能量，云和省钱为模型估算。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中展示请求账本、采样与参考系数。

[Q02](#research-q02) 区间积分受覆盖、基线和记录身份影响。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 时间积分不是独占请求能量，云和省钱为模型估算。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 校准前仅观察趋势。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对 GPU 窗口、归档 token 估算与异步写账，未测硬件和 Host。

- 已检查：作者 README、包清单、源码路径 README.md、electron/main.js、electron/ledger.js、electron/power-meter.js、electron/console-data.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Electron 计量和两个 vendor tgz 的 package/运行时代码/估算与写账模块。归档原文及SHA保存在观察引用补充原件，未运行。
- 下一步：电表、并发、缺失、碰键及账单对照。

**分析版本**

- **仓库**：[dclichang2022/dsh-green-meter](https://github.com/dclichang2022/dsh-green-meter)
- **版本号**：0.1.3（[固定提交 73b61dd](https://github.com/dclichang2022/dsh-green-meter/tree/73b61dd3b5e0fc165310d0dfb85ff8673b87958c)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照电表和独立监控检验归属误差。

电表、并发、缺失、碰键及账单对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 17 | 4297 | 3492 | 569 | — |
| .md | source | 6 | 999 | — | — | 8863 |
| .mjs | source | 3 | 344 | 266 | 60 | — |
| .cjs | example | 1 | 11 | 6 | 5 | — |
| .cjs | source | 1 | 94 | 75 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/dclichang2022/dsh-green-meter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/dclichang2022/dsh-green-meter/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dclichang2022/dsh-green-meter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：能耗数字能否正确归属单次请求并帮助用户决策？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面如何把对话账本和硬件采样放到一起？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根项目交付 Electron 应用，给内置 DSH 设置独立 home/workspace 后启动 loopback Web 服务，控制台快照同时返回 ledger、derived、硬件和 measurement。已有账本按 schema 过滤后累计 token、energy_j 和 carbon_g，坏 JSON 行被跳过。NVIDIA 采样路径每次探测全部 GPU 的功耗，维护两小时滚动窗口；status 按账本最早记录算当前 session 区间，并把 perStep 计算映射到界面。因此可确认应用将账本估算与实际 GPU 采样两类数据合并展示；归档插件监听 assistant/message 的 usage，经 SessionTracker.record 和 estimateStep 生成一条 token-profile-estimate 行，再异步 append JSONL。prefill 是非负 input token 乘系数，decode 是 output 加 reasoning，再乘基值和受限上下文系数；cacheRead 计入上下文估计而不作为 prefill 再收费。它是 token 估算，不是硬件测量。已静态读取固定 vendor tgz，两个内部 package 均声明 0.1.1-rc.2，虽文件名是 rc.5。归档的运行时 lib/index.js 与可读 lib/types 模块包含相同记账逻辑，详见补充原件 ARCHIVE-INSPECTION.json；读取不执行代码。相对普通 DSH 界面，增量是可检查系数和硬件窗口，而非建立新的云电表。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-35](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/README.md#L13-L35)

桌面和两类计量主张。

<details>
<summary>查看原文（23行）</summary>

```text
### 1. 开箱即用的 DSH 桌面版

- 自带 Node.js 24 运行时和完整 DSH 发行版，**装完即用**，不需要 Node / pnpm / Python；
- 完整的 DSH 对话体验：模型管理、会话、工具调用、技能、子代理、工作流都在；
- Windows 安装包 + 便携版（zip 解压即用）。

### 2. 能耗 / 碳排控制台（主窗口）

| 页面 | 你能看到什么 |
| --- | --- |
| **控制台** | 本地碳排、本地能耗（估算与实测并列）、云端碳排（公开系数估算）、已省 API 费用；**近 30 天碳排**和**按任务轮次碳排**两张柱状图；硬件实时环图 |
| **会话** | 每个会话的 token、能耗、碳排、电费、省 API 费用 |
| **硬件监测** | NVIDIA 显卡全量遥测（显存 / 使用率 / 温度 / 功耗，**多卡支持**）；核显作为扩展监测；CPU / 内存曲线 |
| **预警** | 超支和异常提醒，见下 |
| **数据源** | 接入 OpenRouter 或自有中转站，拉取**真实花费**与 token 用量 |
| **参考数据** | 每个系数的出处与年份，全部可查证 |
| **碳台账** | 每一步的 JSONL 明细、实测能耗列、一键导出 CSV |
| **日志 / 设置** | harness 输出、碳强度 / 电价 / API 价格等基线设置 |

### 3. 两条计量路径（核心设计）

- **本地模型 → 实测**：检测到 NVIDIA 显卡后，持续采样功耗并积分，得到**真实能耗**，并按时间归属到每个请求步骤；需要每个模型自己的系数时，一键标定出本机的 J/token；
- **云端 API → 公开系数估算**：云端只能看到 token，因此 token→能耗一律用**公开权威系数**（不用本地标定去推演云端）。
```

</details>

**依据 2 · 源码核查**：[electron/main.js:136-166](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/main.js#L136-L166)

内置 Host 启动。

<details>
<summary>查看原文（31行）</summary>

```text
  writePatch(home, loadSettings(home))
  const port = await freePort()
  const workspace = path.join(home, 'workspace')
  const logs = path.join(userData, 'logs')
  fs.mkdirSync(workspace, { recursive: true })
  fs.mkdirSync(logs, { recursive: true })
  const logStream = fs.createWriteStream(logFile(), { flags: 'a' })

  const harnessEnv = {
    ...process.env,
    DSH_HOME: home,
    DSH_TELEMETRY_DISABLED: '1',
  }
  // In-tree home: the parent-directory walk resolves every plugin with no
  // links at all, which saves ~3 minutes of junction-farm mklink spawns and
  // the Windows symlink privilege entirely. Out-of-tree (per-machine) home:
  // let dsh-app-boot maintain its profiles/node_modules fallback instead.
  if (resolvedHomeInTree) harnessEnv.GREEN_DSH_NO_JUNCTIONS = '1'
  if (!HARNESS_NODE_PRESENT) harnessEnv.ELECTRON_RUN_AS_NODE = '1'
  const runner = HARNESS_NODE_PRESENT ? HARNESS_NODE : process.execPath

  harness = spawn(runner, [
    HARNESS_BIN, 'web',
    '--host', '127.0.0.1',
    '--port', String(port),
    '--no-open',
  ], {
    cwd: workspace,
    env: harnessEnv,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
```

</details>

**依据 3 · 源码核查**：[electron/main.js:340-363](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/main.js#L340-L363)

快照合并。

<details>
<summary>查看原文（24行）</summary>

```text
      electron: process.versions.electron,
      node: process.versions.node,
      platform: process.platform,
      harnessPort,
      harnessReady,
      runtimeNode: bundledNodeVersion,
      dshHome: dshHome(),
      ledgerPath: ledgerPath(dshHome()),
      logPath: logFile(),
      startedAt,
    },
    settings,
    profileKeys: PROFILE_KEYS,
    profile,
    ledger,
    derived,
    hardware: sampler.snapshot(),
    measurement: powerMeter.status(ledger),
    relay: relaySnapshot,
    reference: {
      catalog: referenceData.referenceCatalog(dshHome()),
      localGrid: referenceData.resolveGridFactor(settings, 'local'),
      cloudGrid: referenceData.resolveGridFactor(settings, 'cloud'),
    },
```

</details>

**依据 4 · 源码核查**：[electron/ledger.js:33-52](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/ledger.js#L33-L52)

账本过滤与汇总。

<details>
<summary>查看原文（20行）</summary>

```text
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue
    let row
    try {
      row = JSON.parse(line)
    } catch {
      continue
    }
    if (row === null || typeof row !== 'object' || row.schema_version !== 'dsh-green-meter.step.v1') continue
    if (typeof row.session_id === 'string') sessions.add(row.session_id)
    totals.requests += 1
    totals.inputTokens += Number(row.input_tokens) || 0
    totals.cachedTokens += Number(row.cached_read_tokens) || 0
    totals.outputTokens += Number(row.output_tokens) || 0
    totals.reasoningTokens += Number(row.reasoning_tokens) || 0
    totals.energyJ += Number(row.energy_j) || 0
    totals.carbonG += Number(row.carbon_g) || 0
  }
  totals.sessions = sessions.size
  return totals
```

</details>

**依据 5 · 源码核查**：[electron/power-meter.js:123-143](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/power-meter.js#L123-L143)

采样映射。

<details>
<summary>查看原文（21行）</summary>

```text
    /** Aggregate measurement state for the console snapshot. */
    status(ledger) {
      const now = Date.now()
      const lastHour = energyBetween(now - 3600_000, now)
      const sessionStart = ledger.recent.length === 0
        ? null
        : Date.parse(ledger.recent[ledger.recent.length - 1].ts ?? '')
      const session = sessionStart === null || Number.isNaN(sessionStart)
        ? null
        : energyBetween(sessionStart, now)
      return {
        available: gpuNames.length > 0,
        gpuNames,
        error: lastError,
        samples: samples.length,
        baselineW: samples.length === 0 ? null : baselineW(),
        currentW: samples.length === 0 ? null : samples[samples.length - 1].w,
        lastHourJ: lastHour === null ? null : lastHour.energyJ,
        sessionJ: session === null ? null : session.energyJ,
        perStep: perStep(ledger.recent),
      }
```

</details>

#### 缺口

- 归档已静态读到记账链，但真实硬件与退出落盘没有验收
  **影响**：无法证明每请求成本和屏幕总数正确
  **进一步探讨**：固定账本手工核算，再以独立电表对照硬件窗口

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 所谓实测能量怎样归属请求？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

energyBetween 对相邻采样梯形积分，减去近期窗口最小功率并钳到非负；无两点或无覆盖返回 null。perStep 将记录按时间排，区间从前一条记录到本条，结果键仅 turn.step。因此这是设备级功率窗口分配，不是单模型的独占电量：其他进程活动会混入，跨会话同 turn/step 是否碰键需验收；采样重启或两小时以外没有全程数据。云能耗另由参考系数计算，savedCny 用假设 API 价格减本地电费，不能解释为真实节省账单。误差可能来自采样覆盖、idle 基线、任务重叠、电网强度与云模型系数，需要逐一显示条件。归档 LedgerWriter 将 append promise 串联，事件处理先增加内存 energyTotals 再 void append；写失败或进程立刻退出可能导致内存预算与磁盘账本不一致。归档的预算 guard 在下一 pre-step 才检查估计累积值，不是中途硬停，也不能限制真实 GPU 电量。

#### 证据与依据

**依据 1 · 源码核查**：[electron/power-meter.js:42-66](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/power-meter.js#L42-L66)

基线和积分。

<details>
<summary>查看原文（25行）</summary>

```text
  function baselineW() {
    if (samples.length === 0) return 0
    const window = samples.slice(-BASELINE_WINDOW)
    return Math.min(...window.map(sample => sample.w))
  }

  /** Measured energy (J) between two epoch-ms instants. */
  function energyBetween(fromMs, toMs) {
    if (samples.length < 2) return null
    const baseline = baselineW()
    let energyJ = 0
    let covered = 0
    for (let index = 1; index < samples.length; index += 1) {
      const previous = samples[index - 1]
      const current = samples[index]
      if (current.t <= fromMs) continue
      if (previous.t >= toMs) break
      const deltaS = Math.max(0, Math.min(current.t, toMs) - Math.max(previous.t, fromMs)) / 1000
      if (deltaS <= 0) continue
      const effective = Math.max(0, (previous.w + current.w) / 2 - baseline)
      energyJ += effective * deltaS
      covered += deltaS
    }
    if (covered <= 0) return null
    return { energyJ, seconds: covered, baselineW: baseline }
```

</details>

**依据 2 · 源码核查**：[electron/power-meter.js:69-109](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/power-meter.js#L69-L109)

采样与时间归属。

<details>
<summary>查看原文（41行）</summary>

```text
  async function sample() {
    if (busy) return
    busy = true
    try {
      const gpus = await probeNvidia()
      if (gpus === null) {
        lastError = 'nvidia-smi 不可用'
        return
      }
      lastError = null
      gpuNames = gpus.map(gpu => gpu.name)
      const powerW = sumPower(gpus)
      if (powerW === null) return
      const now = Date.now()
      samples.push({ t: now, w: powerW })
      const cutoff = now - KEEP_MS
      while (samples.length > 0 && samples[0].t < cutoff) samples.shift()
    } finally {
      busy = false
    }
  }

  /**
   * Per-step measured energy for ledger rows (newest first). Each row is
   * attributed the integral from the previous row's timestamp to its own.
   */
  function perStep(rows) {
    if (rows.length === 0) return {}
    const ordered = [...rows].sort((left, right) => (left.ts ?? '').localeCompare(right.ts ?? ''))
    const result = {}
    let previousTs = null
    for (const row of ordered) {
      if (row.ts === null) continue
      const end = Date.parse(row.ts)
      if (Number.isNaN(end)) continue
      if (previousTs !== null && end > previousTs) {
        const measured = energyBetween(previousTs, end)
        if (measured !== null) result[`${row.turn}.${row.step}`] = measured.energyJ
      }
      previousTs = end
    }
```

</details>

**依据 3 · 源码核查**：[electron/console-data.js:300-324](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/console-data.js#L300-L324)

费用对照和云估算。

<details>
<summary>查看原文（25行）</summary>

```text
function derive(totals, settings, profile) {
  const kwh = totals.energyJ / 3_600_000
  const costCny = kwh * settings.priceCnyPerKwh
  const apiCostCny = totals.inputTokens * settings.apiPriceCnyPerMInput / 1_000_000
    + totals.cachedTokens * settings.apiPriceCnyPerMCached / 1_000_000
    + (totals.outputTokens + totals.reasoningTokens) * settings.apiPriceCnyPerMOutput / 1_000_000
  const cachePrefillJPerToken = profile?.prefillJPerToken ?? 0
  const cacheSavedJ = cachePrefillJPerToken * totals.cachedTokens
  const cacheSavedCarbonG = cacheSavedJ / 3_600_000 * settings.carbonFactorKgPerKwh * 1_000
  // Cloud side: a PUBLISHED token→energy fit (or per-request disclosure),
  // never this project's local calibration.
  const cloudGrid = referenceData.resolveGridFactor(settings, 'cloud')
  const cloud = referenceData.cloudEstimate(totals, settings, cloudGrid.kgPerKwh)
  return {
    kwh,
    costCny,
    apiCostCny,
    savedCny: apiCostCny - costCny,
    cacheSavedJ,
    cacheSavedCarbonG,
    trees: (totals.carbonG / 1_000) / TREE_CO2_KG_PER_YEAR,
    cloud,
  }
}

```

</details>

#### 缺口

- 没有并发工作负载与电表校准结果
  **影响**：单步实际能耗和省钱数字可能被误读
  **进一步探讨**：空闲/单任务/并发任务对照覆盖区间与 session 键

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么验证足以支持用户用数字决策？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在非关键 Windows 测试环境运行，仅比较观察数据，不据碳数字自动选模型。固定同一模型和任务，记录输入输出 token、硬件功率原样本和独立电表；空闲基线另测，重复独占/并发三轮，要求时间覆盖与缺失可见，人工合计和账本一致，跨会话不会覆盖。云端只验系数、年份和 token 换算，使用实际服务账单核对费用，明确假设 API 对照是另一模型。对照普通 DSH 加独立监测的工时；假设是统一窗口减少人工核算，若无法区分缺采样、并发能耗或估计误差，就推翻单请求计量使用范围并只保留趋势。退出可停应用和监测，保留 JSONL 与原始样本；已有账本坏行需检查原文件，不能把忽略后较小总数当节能。

#### 证据与依据

**依据 1 · 源码核查**：[electron/power-meter.js:42-109](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/power-meter.js#L42-L109)

校准和碰键测试依据。

<details>
<summary>查看原文（68行）</summary>

```text
  function baselineW() {
    if (samples.length === 0) return 0
    const window = samples.slice(-BASELINE_WINDOW)
    return Math.min(...window.map(sample => sample.w))
  }

  /** Measured energy (J) between two epoch-ms instants. */
  function energyBetween(fromMs, toMs) {
    if (samples.length < 2) return null
    const baseline = baselineW()
    let energyJ = 0
    let covered = 0
    for (let index = 1; index < samples.length; index += 1) {
      const previous = samples[index - 1]
      const current = samples[index]
      if (current.t <= fromMs) continue
      if (previous.t >= toMs) break
      const deltaS = Math.max(0, Math.min(current.t, toMs) - Math.max(previous.t, fromMs)) / 1000
      if (deltaS <= 0) continue
      const effective = Math.max(0, (previous.w + current.w) / 2 - baseline)
      energyJ += effective * deltaS
      covered += deltaS
    }
    if (covered <= 0) return null
    return { energyJ, seconds: covered, baselineW: baseline }
  }

  async function sample() {
    if (busy) return
    busy = true
    try {
      const gpus = await probeNvidia()
      if (gpus === null) {
        lastError = 'nvidia-smi 不可用'
        return
      }
      lastError = null
      gpuNames = gpus.map(gpu => gpu.name)
      const powerW = sumPower(gpus)
      if (powerW === null) return
      const now = Date.now()
      samples.push({ t: now, w: powerW })
      const cutoff = now - KEEP_MS
      while (samples.length > 0 && samples[0].t < cutoff) samples.shift()
    } finally {
      busy = false
    }
  }

  /**
   * Per-step measured energy for ledger rows (newest first). Each row is
   * attributed the integral from the previous row's timestamp to its own.
   */
  function perStep(rows) {
    if (rows.length === 0) return {}
    const ordered = [...rows].sort((left, right) => (left.ts ?? '').localeCompare(right.ts ?? ''))
    const result = {}
    let previousTs = null
    for (const row of ordered) {
      if (row.ts === null) continue
      const end = Date.parse(row.ts)
      if (Number.isNaN(end)) continue
      if (previousTs !== null && end > previousTs) {
        const measured = energyBetween(previousTs, end)
        if (measured !== null) result[`${row.turn}.${row.step}`] = measured.energyJ
      }
      previousTs = end
    }
```

</details>

**依据 2 · 源码核查**：[electron/ledger.js:33-52](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/ledger.js#L33-L52)

汇总完整性判据。

<details>
<summary>查看原文（20行）</summary>

```text
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue
    let row
    try {
      row = JSON.parse(line)
    } catch {
      continue
    }
    if (row === null || typeof row !== 'object' || row.schema_version !== 'dsh-green-meter.step.v1') continue
    if (typeof row.session_id === 'string') sessions.add(row.session_id)
    totals.requests += 1
    totals.inputTokens += Number(row.input_tokens) || 0
    totals.cachedTokens += Number(row.cached_read_tokens) || 0
    totals.outputTokens += Number(row.output_tokens) || 0
    totals.reasoningTokens += Number(row.reasoning_tokens) || 0
    totals.energyJ += Number(row.energy_j) || 0
    totals.carbonG += Number(row.carbon_g) || 0
  }
  totals.sessions = sessions.size
  return totals
```

</details>

**依据 3 · 源码核查**：[electron/main.js:377-385](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/main.js#L377-L385)

CSV 导出。

```text
    'ts_wall,session_id,turn,step,input_tokens,cached_read_tokens,output_tokens,reasoning_tokens,energy_j,carbon_g,profile_id,confidence',
    ...ledger.recent.map(row => [
      row.ts ?? '', row.sessionId, row.turn, row.step, row.inputTokens, row.cachedTokens,
      row.outputTokens, row.reasoningTokens, row.energyJ, row.carbonG, row.profileId, row.confidence,
    ].join(',')),
  ]
  const target = path.join(path.dirname(ledgerPath(dshHome())), `green-meter-export-${Date.now()}.csv`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, rows.join('\n') + '\n', 'utf8')
```

**依据 4 · 源码核查**：[electron/main.js:467-475](https://github.com/dclichang2022/dsh-green-meter/blob/73b61dd3b5e0fc165310d0dfb85ff8673b87958c/electron/main.js#L467-L475)

退出监测和 Host。

```text
  app.on('will-quit', () => { sampler.stop(); powerMeter.stop(); relay.stop(); stopHarness() })
  app.on('window-all-closed', () => { app.quit() })

  app.whenReady().then(async () => {
    userData = app.getPath('userData')
    startedAt = new Date().toISOString()
    sampler.start()
    powerMeter.start()
    relay.start()
```

#### 缺口

- 实测误差与用户成本未取得
  **影响**：尚不宜依据数值作能源/费用承诺
  **进一步探讨**：完成校准对照并报告误差和缺失率

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
