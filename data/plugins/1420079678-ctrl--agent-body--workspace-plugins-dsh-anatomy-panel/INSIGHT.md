# dsh-anatomy-panel

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)
<!-- END META -->

> **实现功能**：从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。

> **核心亮点**：把 dsh-organism 的分散文件映射成同源可视化页面，使开发期观察更直观；体征生成与事件采集不是本组件贡献。详见[Q01](#research-q01)。

> **风险与缺陷**：脉冲和器官等运行时字段进入 innerHTML 未转义；部分文件损坏仍返回 200 且面板可显示零/空。真实风险取决于上游字段可控性和宿主访问控制。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 面板解决谁的什么观察任务，增量归属在哪里？](#detail-section-11)
  - [Q02 · 数据读取、降级及刷新究竟如何工作？](#detail-section-12)
  - [Q03 · 同源面板的数据访问与 DOM 渲染安全吗？](#detail-section-13)
  - [Q04 · 开发期部署的首次、持续与失败恢复成本是什么？](#detail-section-14)
  - [Q05 · 怎样让体征面板可被信任，当前可在何范围观察？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已安装 dsh-organism 的本地开发者观察体征与调用，需对照原始事件和来源状态。详见[Q01](#research-q01)。

手动检查上游 JSON/JSONL 能直接看到原始状态；面板若要胜出需证明观察更快且不掩盖损坏或引入页面注入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 体征页 | 汇总上游状态 | 依赖 organism 文件，坏源可静默空 |
| 脉冲流 | 查看最近事件 | 最后 256KiB，首行可能截断 |
| 同源 JSON | 页面数据来源 | 访问控制依赖 Host，字段需安全渲染 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH webServer | 必需 | 挂两个同源路由 | 加载失败 |
| dsh-organism 运行时文件 | 体征必需 | JSON 和脉冲来源 | 缺 bloodstream 时 503，其他缺源可空 |
| 宿主访问控制 | 保护数据必需 | 限制页面/API | 路由自身无认证检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离 DSH 安装上游 organism 并核文件 | 数据格式与路径正确 |
| 注入 | 用开发注入或 profile bundle 加载面板 | 两路由可达 |
| 观察 | 打开 /anatomy，对照 data.json 和源文件 | 时间、脉冲和器官一致 |
| 异常 | 缺源或 HTML 内容时暂停依赖面板 | 查源文件、宿主权限和页面安全 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 与 organism 本机文件，金额未知 | dev 注入或 profile 注册；耗时未知 | 私有包、宿主兼容未测 |
| 持续使用 | 3 秒轮询与 JSON/256KiB 尾读；负载未知 | 对照源文件与异常状态；耗时未知 | 多标签页性能未测 |
| 失败恢复 | 误诊/暴露风险，金额未知 | 查损坏文件、权限和路由；耗时未知 | 部分坏源静默回退 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 汇总体征 | 多文件投影和页面轮询源码 | 与真实 Agent 状态一致性 |
| 故障提示 | bloodstream 缺失返回 503 | 其余源损坏仍可能 200/空值 |
| 数据安全 | 无外部请求调用 | Host 绑定/认证和 DOM 注入可达性 |

> **思考**：脉冲和器官等运行时字段进入 innerHTML 未转义；部分文件损坏仍返回 200 且面板可显示零/空。真实风险取决于上游字段可控性和宿主访问控制。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 dsh-organism 的分散文件映射成同源可视化页面，使开发期观察更直观；体征生成与事件采集不是本组件贡献。详见[Q01](#research-q01)。

把 dsh-organism 的分散文件映射成同源可视化页面，使开发期观察更直观；体征生成与事件采集不是本组件贡献。详见[Q01](#research-q01)。

单文件宿主路由与 bounded tail 易于试验；需把数据源 freshness、失败与安全渲染纳入观察契约。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

脉冲和器官等运行时字段进入 innerHTML 未转义；部分文件损坏仍返回 200 且面板可显示零/空。真实风险取决于上游字段可控性和宿主访问控制。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

限隔离本机开发 Host 观察，不能作为独立健康判据；共享可达环境应先核认证、渲染和来源状态。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认只读投影和轮询；数据完整性及访问控制依赖上游/宿主，DOM 直接插入未转义字段有注入路径，未做真实宿主复现。改进仍是假设。

- 已检查：作者 README、包清单、源码路径 workspace/plugins/dsh-anatomy-panel/README.md、workspace/plugins/dsh-anatomy-panel/package.json、workspace/plugins/dsh-anatomy-panel/lib/index.js、workspace/plugins/dsh-anatomy-panel/cordis.patch.yml 及固定范围 inventory；组件：workspace/plugins/dsh-anatomy-panel。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交组件 README/package/Host 源码；未执行目标代码、对照上游文件、宿主身份策略或恶意输入；旧 META 仅复用。
- 下一步：在隔离宿主构造正常/缺失/损坏/恶意字段及多标签页访问，对照 API/DOM、来源新鲜度、认证和响应耗时。

**分析版本**

- **仓库**：[1420079678-ctrl/agent-body](https://github.com/1420079678-ctrl/agent-body)
- **版本号**：0.1.0（[固定提交 9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是逐源 freshness/解析状态、文本安全渲染及明确路由认证边界，用恶意字段、丢源和多标签页夹具核结果与性能。详见[Q05](#research-q05)。

在隔离宿主构造正常/缺失/损坏/恶意字段及多标签页访问，对照 API/DOM、来源新鲜度、认证和响应耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 253 | 212 | 23 | — |
| .md | source | 1 | 55 | — | — | 630 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1420079678-ctrl/agent-body/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Agent-Body 解剖面板能否可信地展示实时运行体征，宿主同源页面暴露了哪些数据与渲染风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面板解决谁的什么观察任务，增量归属在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已安装 dsh-organism 的本机 DSH 开发者/运维，需看心跳、器官调用、反射、愈合和脉冲以排查运行状态。合格结果是数据能对应实际事件、刷新状态可解释、异常不伪装成正常，且未授权者不能获取敏感脉冲。相对手动打开 bloodstream/vitals/reflexes/pulse 文件，本组件把多份运行时文件投影为宿主 /anatomy 页面和 /anatomy/data.json，每 3 秒拉取；新增的是展示和组合，体征采集属于 dsh-organism 上游。包私有、README 标注开发期注入，不是可证实的公开即装组件。

#### 证据与依据

**依据 1 · 作者声明**：[workspace/plugins/dsh-anatomy-panel/README.md:1-30](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/README.md#L1-L30)

作者介绍体征页面、运行时文件和宿主路由。

<details>
<summary>查看原文（30行）</summary>

````text
# dsh-anatomy-panel — 解剖与体征面板（宿主半）

把 Agent-Body 的活体体征挂进 harness 自己的 HTTP 端点，浏览器打开 `http://127.0.0.1:<port>/anatomy` 即可看到：

- **心跳 / 血压 / 器官 / 伤口 / 愈合率 / 自训练**（突触 · 反射 · 技能 · 信任度）
- **器官**：按累计调用量排序，脉冲打到哪个器官那一格会亮一下
- **本体感觉**：真实脉冲流（心跳、肺循环、反射开火、器官调用）

数据**每次请求现读**运行时文件，不是快照：

```
$DSH_HOME/plugins/dsh-organism/
  ├─ bloodstream.json   心跳 / 血压 / 愈合账本 / 学习计数
  ├─ vitals.json        器官体征（[id, 统计] 对）
  ├─ reflexes.json      持久化反射弧
  └─ pulse.jsonl        真实脉冲流（只读尾部 256KB，避免大文件拖慢）
```

## 为什么是宿主半，不是客户端 slot

客户端 slot 的槽位是对的（`sidebar.panellist` + `main` 那一对），但客户端半必须是**模块加载器包裹的打包产物**
（`window.__ModuleLoader__.load({id, factory})`），需要 tsdown/vite 构建链。而体征数据本来就在宿主侧文件里，
用 `ctx.webServer.register` 挂两个路由就能拿到一个**不需要构建、可热注入、可随时卸载**的活体面板。

## 路由

| 路由 | 内容 |
| --- | --- |
| `GET /anatomy` | 自包含 HTML（原生 JS，每 3 秒拉一次 JSON，无外部依赖） |
| `GET /anatomy/data.json` | 上面那些文件的实时投影（器官 / 心跳 / 账本 / 脉冲） |
````

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:32-38](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L32-L38)

固定路由与依赖目录。

```text
const PANEL_PATH = '/anatomy'
const DATA_PATH = '/anatomy/data.json'

function organismDir() {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'plugins', 'dsh-organism')
}
```

**依据 3 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:216-252](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L216-L252)

Host 注册 HTML 与 JSON 路由。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx) {
  const send = (res, code, type, body) => {
    res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' })
    res.end(body)
  }

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: PANEL_PATH,
      handler: async (req, res) => {
        send(res, 200, 'text/html; charset=utf-8', panelHtml())
      },
    }),
  )

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: DATA_PATH,
      handler: async (req, res) => {
        try {
          const snap = await buildSnapshot(120)
          if (!snap.available) {
            send(res, 503, 'application/json; charset=utf-8',
              JSON.stringify({ error: 'organism runtime files not found', dir: snap.dir }))
            return
          }
          send(res, 200, 'application/json; charset=utf-8', JSON.stringify(snap))
        } catch (error) {
          send(res, 500, 'application/json; charset=utf-8', JSON.stringify({ error: String(error) }))
        }
      },
    }),
  )

  ctx.logger?.info?.(`anatomy panel at ${PANEL_PATH} (data ${DATA_PATH})`)
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/package.json:1-22](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/package.json#L1-L22)

私有宿主包声明。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "@dsh-external/dsh-anatomy-panel",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Anatomy panel for the Agent-Body organs: serves a live vitals dashboard (organs, heartbeat, healing ledger, learning counters, real pulse stream) straight from the runtime files, at /anatomy inside the harness itself. Host-only: no client bundle, no build step.",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

</details>

#### 缺口

- 未对照 dsh-organism 的实际事件生成和宿主状态
  **影响**：不能证明面板数字反映真实健康或具有诊断效度
  **进一步探讨**：固定上游状态样本并在目标宿主对照文件、JSON 和页面

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 数据读取、降级及刷新究竟如何工作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

每次 data.json 请求同步读三份 JSON（错误默默转 undefined），读取 pulse.jsonl 最后最多 256KiB，按 kind 过滤并截 note 170 字符，回传 up to 120 条及 DSH_HOME 数据路径。页面以 3 秒 interval fetch JSON 并重建统计和脉冲 DOM；缺 bloodstream.json 才返回 503，其余单文件坏/丢会以空对象、空器官或空脉冲显示且仍 200。故“器官未安装有 503”只对该标志文件成立，部分坏数据会显示为零/横杠。尾文件 start 从任意字节切入，第一行 JSON 可截断而被跳过；这是 bounded tail 的可预期边界。组件不写上游文件，依赖 webServer 路由和上游文件布局。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:40-65](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L40-L65)

同步 JSON 读取与 256KiB 脉冲尾读。

<details>
<summary>查看原文（26行）</summary>

```text
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return undefined
  }
}

/** 读 pulse.jsonl 的尾部若干行（文件可能很大，只读最后 256KB）。 */
async function readTailLines(file, maxBytes, maxLines) {
  try {
    const size = statSync(file).size
    const start = Math.max(0, size - maxBytes)
    const stream = createReadStream(file, { start, end: size - 1, encoding: 'utf8' })
    const rl = createInterface({ input: stream, crlfDelay: Infinity })
    const lines = []
    for await (const line of rl) {
      if (line.trim()) lines.push(line)
      if (lines.length > maxLines * 2) lines.splice(0, lines.length - maxLines * 2)
    }
    stream.close()
    return lines.slice(-maxLines)
  } catch {
    return []
  }
}
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:67-131](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L67-L131)

状态投影、available 判据和脉冲过滤。

<details>
<summary>查看原文（65行）</summary>

```text
const KEEP_KINDS = new Set(['heart', 'reflex', 'alert', 'discover', 'law', 'obey', 'organ', 'call'])

async function buildSnapshot(pulseLimit) {
  const dir = organismDir()
  const blood = readJson(join(dir, 'bloodstream.json')) ?? {}
  const vitals = readJson(join(dir, 'vitals.json')) ?? {}
  const reflexes = readJson(join(dir, 'reflexes.json')) ?? []

  const organs = []
  for (const item of vitals.organs ?? []) {
    if (!Array.isArray(item) || item.length < 2 || typeof item[1] !== 'object') continue
    const st = item[1] ?? {}
    organs.push({
      id: String(item[0]),
      calls: Number(st.calls ?? 0),
      ok: Number(st.ok ?? 0),
      fail: Number(st.fail ?? 0),
      fatigue: Number(st.fatigue ?? 0),
    })
  }
  organs.sort((a, b) => b.calls - a.calls)

  const raw = await readTailLines(join(dir, 'pulse.jsonl'), 262144, pulseLimit * 3)
  const pulses = []
  for (const line of raw) {
    try {
      const j = JSON.parse(line)
      if (!KEEP_KINDS.has(j.kind)) continue
      pulses.push({
        t: j.t ?? 0,
        k: j.kind ?? '',
        o: j.organ ?? '',
        tool: j.tool ?? '',
        n: String(j.note ?? '').slice(0, 170),
      })
    } catch {
      // 单行坏数据不该让整面板失败：跳过，继续读下一行
    }
  }

  const healing = blood.healing ?? {}
  const learning = blood.learning ?? {}
  const pressure = blood.pressure ?? {}

  return {
    at: Date.now(),
    available: existsSync(join(dir, 'bloodstream.json')),
    dir,
    beat: blood.beat ?? null,
    rhythm: blood.rhythm ?? null,
    heartRate: blood.heartRate ?? null,
    systolic: pressure.systolic ?? null,
    diastolic: pressure.diastolic ?? null,
    healed: healing.healed ?? null,
    open: healing.open ?? null,
    chronic: healing.chronic ?? null,
    healRate: healing.rate == null ? null : Math.round(Number(healing.rate) * 1000) / 10,
    synapses: learning.synapses ?? null,
    reflexesLearned: learning.reflexes ?? null,
    skills: learning.skills ?? null,
    trust: learning.trust ?? null,
    reflexesPersisted: Array.isArray(reflexes) ? reflexes.length : 0,
    organs,
    pulses: pulses.slice(-pulseLimit),
  }
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:183-213](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L183-L213)

页面 3 秒轮询和 DOM 展示。

<details>
<summary>查看原文（31行）</summary>

```text
async function tick(){
  try{
    const r = await fetch('/anatomy/data.json', { cache: 'no-store' });
    if(!r.ok){ $('meta').innerHTML = '<span class="stale">数据不可用（HTTP ' + r.status + '）—— 器官可能未安装</span>'; return; }
    const d = await r.json();
    $('stats').innerHTML = [
      ['心跳', d.beat != null ? '#' + d.beat : '—', (d.heartRate != null ? d.heartRate + '/分 · ' : '') + (d.rhythm || '')],
      ['血压', d.systolic != null ? d.systolic + '/' + d.diastolic : '—', '收缩压=活跃告警'],
      ['器官', d.organs.length, '有体征记录的'],
      ['伤口', d.healed != null ? d.healed + ' 已愈' : '—', (d.open ?? '—') + ' 未愈 · ' + (d.chronic ?? '—') + ' 慢性'],
      ['愈合率', d.healRate != null ? d.healRate + '%' : '—', '复检通过才闭合'],
      ['自训练', (d.synapses ?? 0) + ' 突触 · ' + (d.reflexesLearned ?? 0) + ' 反射', (d.skills ?? 0) + ' 技能 · 信任度 ' + (d.trust ?? '—')],
    ].map(([k,v,s]) => '<div class="card"><div class="k">' + k + '</div><div class="v">' + v + (s ? ' <small>' + s + '</small>' : '') + '</div></div>').join('');
    if ($('body').childElementCount !== d.organs.length || bodyCount !== d.organs.length) {
      $('body').innerHTML = d.organs.map(o => '<span class="organ" data-id="' + o.id + '" title="调用 ' + o.calls + ' · 成功 ' + o.ok + ' · 失败 ' + o.fail + '">' + o.id + '<small>' + o.calls + '</small></span>').join('');
      bodyCount = d.organs.length;
    }
    const tail = d.pulses.slice(-18).reverse();
    $('stream').innerHTML = tail.map(p => '<div class="' + (cls[p.k] || 'hm') + '">' + pulseText(p) + '</div>').join('');
    const newest = tail.length ? tail[0] : null;
    if (newest && newest.t > lastSeen) {
      lastSeen = newest.t;
      if (newest.o) { const t = document.querySelector('.organ[data-id="' + newest.o + '"]'); if (t) { t.classList.add('hit'); setTimeout(() => t.classList.remove('hit'), 900); } }
    }
    $('meta').textContent = '采样 ' + new Date(d.at).toLocaleTimeString() + ' · 数据目录 ' + d.dir + ' · 本机数据，不上传';
  } catch(e){
    $('meta').innerHTML = '<span class="stale">读取失败：' + e + '</span>';
  }
}
tick(); setInterval(tick, 3000);
</script></body></html>`
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:232-249](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L232-L249)

仅 bloodstream 不存在时返回 503。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: DATA_PATH,
      handler: async (req, res) => {
        try {
          const snap = await buildSnapshot(120)
          if (!snap.available) {
            send(res, 503, 'application/json; charset=utf-8',
              JSON.stringify({ error: 'organism runtime files not found', dir: snap.dir }))
            return
          }
          send(res, 200, 'application/json; charset=utf-8', JSON.stringify(snap))
        } catch (error) {
          send(res, 500, 'application/json; charset=utf-8', JSON.stringify({ error: String(error) }))
        }
      },
    }),
```

</details>

#### 缺口

- 实际文件规模、并发轮询量和部分损坏频率未知
  **影响**：不能量化 Host 响应阻塞与误诊概率
  **进一步探讨**：构造缺失/损坏/并发文件样本，观察 API 状态和读取耗时

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 同源面板的数据访问与 DOM 渲染安全吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

README 称依赖 Harness 自身访问控制，但本组件路由 handler 自身不检查身份或 Origin，真实可见范围取决于外部 webServer；API 回传绝对本机数据目录及脉冲 note/tool/organ。页面把 d.beat/rhythm、organ id、pulseText(note/tool/organ) 等来自运行时文件的值直接拼入 innerHTML，未做 HTML 转义；若脉冲或器官字段可由工具或外部数据影响，可能形成宿主同源脚本注入，进而读取同源受保护资源。代码没有跨域或远传调用，但“只在本机流转”还取决于 Host 绑定地址和身份验证。以上是静态危险路径，尚未执行恶意输入/宿主安全测试。

#### 证据与依据

**依据 1 · 作者声明**：[workspace/plugins/dsh-anatomy-panel/README.md:42-46](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/README.md#L42-L46)

作者对只读、本机和宿主访问控制的主张。

```text
## 边界

- 只读：不写任何文件，不改变器官行为。
- 数据只在本机流转；`/anatomy/data.json` 与其他 harness 路由同源，靠 harness 自身的访问控制保护。
- 器官未安装时 `/anatomy` 仍然可开，数据接口返回 503 并说明缺哪个目录（不静默显示空面板）。
```

**依据 2 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:89-130](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L89-L130)

脉冲文本与绝对目录进入 JSON。

<details>
<summary>查看原文（42行）</summary>

```text
  const raw = await readTailLines(join(dir, 'pulse.jsonl'), 262144, pulseLimit * 3)
  const pulses = []
  for (const line of raw) {
    try {
      const j = JSON.parse(line)
      if (!KEEP_KINDS.has(j.kind)) continue
      pulses.push({
        t: j.t ?? 0,
        k: j.kind ?? '',
        o: j.organ ?? '',
        tool: j.tool ?? '',
        n: String(j.note ?? '').slice(0, 170),
      })
    } catch {
      // 单行坏数据不该让整面板失败：跳过，继续读下一行
    }
  }

  const healing = blood.healing ?? {}
  const learning = blood.learning ?? {}
  const pressure = blood.pressure ?? {}

  return {
    at: Date.now(),
    available: existsSync(join(dir, 'bloodstream.json')),
    dir,
    beat: blood.beat ?? null,
    rhythm: blood.rhythm ?? null,
    heartRate: blood.heartRate ?? null,
    systolic: pressure.systolic ?? null,
    diastolic: pressure.diastolic ?? null,
    healed: healing.healed ?? null,
    open: healing.open ?? null,
    chronic: healing.chronic ?? null,
    healRate: healing.rate == null ? null : Math.round(Number(healing.rate) * 1000) / 10,
    synapses: learning.synapses ?? null,
    reflexesLearned: learning.reflexes ?? null,
    skills: learning.skills ?? null,
    trust: learning.trust ?? null,
    reflexesPersisted: Array.isArray(reflexes) ? reflexes.length : 0,
    organs,
    pulses: pulses.slice(-pulseLimit),
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:183-209](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L183-L209)

数据值直接拼到 innerHTML。

<details>
<summary>查看原文（27行）</summary>

```text
async function tick(){
  try{
    const r = await fetch('/anatomy/data.json', { cache: 'no-store' });
    if(!r.ok){ $('meta').innerHTML = '<span class="stale">数据不可用（HTTP ' + r.status + '）—— 器官可能未安装</span>'; return; }
    const d = await r.json();
    $('stats').innerHTML = [
      ['心跳', d.beat != null ? '#' + d.beat : '—', (d.heartRate != null ? d.heartRate + '/分 · ' : '') + (d.rhythm || '')],
      ['血压', d.systolic != null ? d.systolic + '/' + d.diastolic : '—', '收缩压=活跃告警'],
      ['器官', d.organs.length, '有体征记录的'],
      ['伤口', d.healed != null ? d.healed + ' 已愈' : '—', (d.open ?? '—') + ' 未愈 · ' + (d.chronic ?? '—') + ' 慢性'],
      ['愈合率', d.healRate != null ? d.healRate + '%' : '—', '复检通过才闭合'],
      ['自训练', (d.synapses ?? 0) + ' 突触 · ' + (d.reflexesLearned ?? 0) + ' 反射', (d.skills ?? 0) + ' 技能 · 信任度 ' + (d.trust ?? '—')],
    ].map(([k,v,s]) => '<div class="card"><div class="k">' + k + '</div><div class="v">' + v + (s ? ' <small>' + s + '</small>' : '') + '</div></div>').join('');
    if ($('body').childElementCount !== d.organs.length || bodyCount !== d.organs.length) {
      $('body').innerHTML = d.organs.map(o => '<span class="organ" data-id="' + o.id + '" title="调用 ' + o.calls + ' · 成功 ' + o.ok + ' · 失败 ' + o.fail + '">' + o.id + '<small>' + o.calls + '</small></span>').join('');
      bodyCount = d.organs.length;
    }
    const tail = d.pulses.slice(-18).reverse();
    $('stream').innerHTML = tail.map(p => '<div class="' + (cls[p.k] || 'hm') + '">' + pulseText(p) + '</div>').join('');
    const newest = tail.length ? tail[0] : null;
    if (newest && newest.t > lastSeen) {
      lastSeen = newest.t;
      if (newest.o) { const t = document.querySelector('.organ[data-id="' + newest.o + '"]'); if (t) { t.classList.add('hit'); setTimeout(() => t.classList.remove('hit'), 900); } }
    }
    $('meta').textContent = '采样 ' + new Date(d.at).toLocaleTimeString() + ' · 数据目录 ' + d.dir + ' · 本机数据，不上传';
  } catch(e){
    $('meta').innerHTML = '<span class="stale">读取失败：' + e + '</span>';
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:216-250](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L216-L250)

路由层无独立身份检查。

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx) {
  const send = (res, code, type, body) => {
    res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' })
    res.end(body)
  }

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: PANEL_PATH,
      handler: async (req, res) => {
        send(res, 200, 'text/html; charset=utf-8', panelHtml())
      },
    }),
  )

  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: DATA_PATH,
      handler: async (req, res) => {
        try {
          const snap = await buildSnapshot(120)
          if (!snap.available) {
            send(res, 503, 'application/json; charset=utf-8',
              JSON.stringify({ error: 'organism runtime files not found', dir: snap.dir }))
            return
          }
          send(res, 200, 'application/json; charset=utf-8', JSON.stringify(snap))
        } catch (error) {
          send(res, 500, 'application/json; charset=utf-8', JSON.stringify({ error: String(error) }))
        }
      },
    }),
  )
```

</details>

#### 缺口

- 上游字段可控性、Host 访问控制与 CSP 未核
  **影响**：不能判定真实 XSS 可达性或外部访问面
  **进一步探讨**：在隔离 Host 注入含 HTML 标记脉冲，核 DOM/CSP/路由认证和端口绑定

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 开发期部署的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

首次需已有 dsh-organism 数据文件和 DSH webServer，按 README 用 dev_inject_plugin 注入或手工登记 profile bundle；包 private 且无客户端构建。持续使用每打开一个页面每 3 秒会请求一次 JSON，Host 同步读多个 JSON 并读取 up to 256KiB 的尾文件；高并发开页可能造成主线程阻塞，具体耗时未测。失败恢复需辨认上游文件缺失、单文件解析失败但 API 仍 200、脉冲尾截断和宿主路由异常；手工对照源文件与最后写入时间。将数据投影与页面打包为宿主侧单文件、对 pulse 尾部限读取量可借鉴，但同步读与静默 fallback 削弱观察可信度。

#### 证据与依据

**依据 1 · 作者声明**：[workspace/plugins/dsh-anatomy-panel/README.md:19-40](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/README.md#L19-L40)

开发期安装和无客户端构建说明。

<details>
<summary>查看原文（22行）</summary>

````text
## 为什么是宿主半，不是客户端 slot

客户端 slot 的槽位是对的（`sidebar.panellist` + `main` 那一对），但客户端半必须是**模块加载器包裹的打包产物**
（`window.__ModuleLoader__.load({id, factory})`），需要 tsdown/vite 构建链。而体征数据本来就在宿主侧文件里，
用 `ctx.webServer.register` 挂两个路由就能拿到一个**不需要构建、可热注入、可随时卸载**的活体面板。

## 路由

| 路由 | 内容 |
| --- | --- |
| `GET /anatomy` | 自包含 HTML（原生 JS，每 3 秒拉一次 JSON，无外部依赖） |
| `GET /anatomy/data.json` | 上面那些文件的实时投影（器官 / 心跳 / 账本 / 脉冲） |

## 安装（开发期）

```
dev_inject_plugin D:\DeepSeekHarness\workspace\dsh-anatomy-panel
```

卸载：`dev_uninject_plugin @dsh-external/dsh-anatomy-panel`。
若要长期生效，把包注册进 profile 的 `dsh.profile.bundles` 并在改动后跑
`node bin/launch.mjs --check-startup` 验证桌面启动链路。
````

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/package.json:1-22](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/package.json#L1-L22)

私有包和 patch 注册。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "@dsh-external/dsh-anatomy-panel",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Anatomy panel for the Agent-Body organs: serves a live vitals dashboard (organs, heartbeat, healing ledger, learning counters, real pulse stream) straight from the runtime files, at /anatomy inside the harness itself. Host-only: no client bundle, no build step.",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:40-65](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L40-L65)

同步读与 bounded tail。

<details>
<summary>查看原文（26行）</summary>

```text
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return undefined
  }
}

/** 读 pulse.jsonl 的尾部若干行（文件可能很大，只读最后 256KB）。 */
async function readTailLines(file, maxBytes, maxLines) {
  try {
    const size = statSync(file).size
    const start = Math.max(0, size - maxBytes)
    const stream = createReadStream(file, { start, end: size - 1, encoding: 'utf8' })
    const rl = createInterface({ input: stream, crlfDelay: Infinity })
    const lines = []
    for await (const line of rl) {
      if (line.trim()) lines.push(line)
      if (lines.length > maxLines * 2) lines.splice(0, lines.length - maxLines * 2)
    }
    stream.close()
    return lines.slice(-maxLines)
  } catch {
    return []
  }
}
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:183-213](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L183-L213)

3 秒拉取。

<details>
<summary>查看原文（31行）</summary>

```text
async function tick(){
  try{
    const r = await fetch('/anatomy/data.json', { cache: 'no-store' });
    if(!r.ok){ $('meta').innerHTML = '<span class="stale">数据不可用（HTTP ' + r.status + '）—— 器官可能未安装</span>'; return; }
    const d = await r.json();
    $('stats').innerHTML = [
      ['心跳', d.beat != null ? '#' + d.beat : '—', (d.heartRate != null ? d.heartRate + '/分 · ' : '') + (d.rhythm || '')],
      ['血压', d.systolic != null ? d.systolic + '/' + d.diastolic : '—', '收缩压=活跃告警'],
      ['器官', d.organs.length, '有体征记录的'],
      ['伤口', d.healed != null ? d.healed + ' 已愈' : '—', (d.open ?? '—') + ' 未愈 · ' + (d.chronic ?? '—') + ' 慢性'],
      ['愈合率', d.healRate != null ? d.healRate + '%' : '—', '复检通过才闭合'],
      ['自训练', (d.synapses ?? 0) + ' 突触 · ' + (d.reflexesLearned ?? 0) + ' 反射', (d.skills ?? 0) + ' 技能 · 信任度 ' + (d.trust ?? '—')],
    ].map(([k,v,s]) => '<div class="card"><div class="k">' + k + '</div><div class="v">' + v + (s ? ' <small>' + s + '</small>' : '') + '</div></div>').join('');
    if ($('body').childElementCount !== d.organs.length || bodyCount !== d.organs.length) {
      $('body').innerHTML = d.organs.map(o => '<span class="organ" data-id="' + o.id + '" title="调用 ' + o.calls + ' · 成功 ' + o.ok + ' · 失败 ' + o.fail + '">' + o.id + '<small>' + o.calls + '</small></span>').join('');
      bodyCount = d.organs.length;
    }
    const tail = d.pulses.slice(-18).reverse();
    $('stream').innerHTML = tail.map(p => '<div class="' + (cls[p.k] || 'hm') + '">' + pulseText(p) + '</div>').join('');
    const newest = tail.length ? tail[0] : null;
    if (newest && newest.t > lastSeen) {
      lastSeen = newest.t;
      if (newest.o) { const t = document.querySelector('.organ[data-id="' + newest.o + '"]'); if (t) { t.classList.add('hit'); setTimeout(() => t.classList.remove('hit'), 900); } }
    }
    $('meta').textContent = '采样 ' + new Date(d.at).toLocaleTimeString() + ' · 数据目录 ' + d.dir + ' · 本机数据，不上传';
  } catch(e){
    $('meta').innerHTML = '<span class="stale">读取失败：' + e + '</span>';
  }
}
tick(); setInterval(tick, 3000);
</script></body></html>`
```

</details>

#### 缺口

- 宿主版本、读耗时、故障恢复时间未测
  **影响**：不能估算运维成本或高并发可用性
  **进一步探讨**：模拟多标签页和损坏文件，量测响应延迟并核提示质量

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让体征面板可被信任，当前可在何范围观察？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证设计是假设面板应把每份数据源的 freshness、解析状态与最后采样时间作为独立字段返回，字段用 textContent/DOM API 渲染，脉冲标注来源并由 Host 明确认证/绑定策略；再考虑异步或缓存读以降低多标签页负担。最小验证以正常/缺失/损坏/恶意 HTML 的 bloodstream、vitals、pulse 文件组合，检查 API 状态、DOM 安全和来源对齐，并在 Host 暴露地址下测试未授权访问。当前仅可在隔离的本地开发 Host 中观察器官状态；安全面和数据准确性未证实时不建议在共享或公网可达 Host 上开此路由。推荐 observe，不能将可视化仪表盘当作独立健康诊断。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:40-45](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L40-L45)

解析错误被吞掉。

```text
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return undefined
  }
```

**依据 2 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:183-209](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L183-L209)

innerHTML、刷新和错误提示。

<details>
<summary>查看原文（27行）</summary>

```text
async function tick(){
  try{
    const r = await fetch('/anatomy/data.json', { cache: 'no-store' });
    if(!r.ok){ $('meta').innerHTML = '<span class="stale">数据不可用（HTTP ' + r.status + '）—— 器官可能未安装</span>'; return; }
    const d = await r.json();
    $('stats').innerHTML = [
      ['心跳', d.beat != null ? '#' + d.beat : '—', (d.heartRate != null ? d.heartRate + '/分 · ' : '') + (d.rhythm || '')],
      ['血压', d.systolic != null ? d.systolic + '/' + d.diastolic : '—', '收缩压=活跃告警'],
      ['器官', d.organs.length, '有体征记录的'],
      ['伤口', d.healed != null ? d.healed + ' 已愈' : '—', (d.open ?? '—') + ' 未愈 · ' + (d.chronic ?? '—') + ' 慢性'],
      ['愈合率', d.healRate != null ? d.healRate + '%' : '—', '复检通过才闭合'],
      ['自训练', (d.synapses ?? 0) + ' 突触 · ' + (d.reflexesLearned ?? 0) + ' 反射', (d.skills ?? 0) + ' 技能 · 信任度 ' + (d.trust ?? '—')],
    ].map(([k,v,s]) => '<div class="card"><div class="k">' + k + '</div><div class="v">' + v + (s ? ' <small>' + s + '</small>' : '') + '</div></div>').join('');
    if ($('body').childElementCount !== d.organs.length || bodyCount !== d.organs.length) {
      $('body').innerHTML = d.organs.map(o => '<span class="organ" data-id="' + o.id + '" title="调用 ' + o.calls + ' · 成功 ' + o.ok + ' · 失败 ' + o.fail + '">' + o.id + '<small>' + o.calls + '</small></span>').join('');
      bodyCount = d.organs.length;
    }
    const tail = d.pulses.slice(-18).reverse();
    $('stream').innerHTML = tail.map(p => '<div class="' + (cls[p.k] || 'hm') + '">' + pulseText(p) + '</div>').join('');
    const newest = tail.length ? tail[0] : null;
    if (newest && newest.t > lastSeen) {
      lastSeen = newest.t;
      if (newest.o) { const t = document.querySelector('.organ[data-id="' + newest.o + '"]'); if (t) { t.classList.add('hit'); setTimeout(() => t.classList.remove('hit'), 900); } }
    }
    $('meta').textContent = '采样 ' + new Date(d.at).toLocaleTimeString() + ' · 数据目录 ' + d.dir + ' · 本机数据，不上传';
  } catch(e){
    $('meta').innerHTML = '<span class="stale">读取失败：' + e + '</span>';
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-anatomy-panel/lib/index.js:232-249](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel/lib/index.js#L232-L249)

状态返回逻辑。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: DATA_PATH,
      handler: async (req, res) => {
        try {
          const snap = await buildSnapshot(120)
          if (!snap.available) {
            send(res, 503, 'application/json; charset=utf-8',
              JSON.stringify({ error: 'organism runtime files not found', dir: snap.dir }))
            return
          }
          send(res, 200, 'application/json; charset=utf-8', JSON.stringify(snap))
        } catch (error) {
          send(res, 500, 'application/json; charset=utf-8', JSON.stringify({ error: String(error) }))
        }
      },
    }),
```

</details>

#### 缺口

- 安全渲染和多源 freshness 契约未实现/测试
  **影响**：不能算作现有可信观察能力
  **进一步探讨**：构建小型夹具对照渲染注入、丢源提示和访问控制

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
