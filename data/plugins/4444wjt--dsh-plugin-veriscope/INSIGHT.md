# dsh-plugin-veriscope

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[5299b64](https://github.com/4444wjt/dsh-plugin-veriscope/tree/5299b64087bbfa5beef6ae2e336045468f1af01d)

<!-- BEGIN META -->
[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope)
<!-- END META -->

> **实现功能**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

> **核心亮点**：把阈值判定、缺证据保留和当前性回执接合，减少只看旧均值的误读。详见[Q01](#research-q01)。

> **风险与缺陷**：门禁仅消费所提供分数，不证明样本总体/评分真实，本地摘要不抵抗整体重写，child kill不等进程树回收。详见[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 归档门禁解决什么问题？](#detail-section-11)
  - [Q02 · builtin如何处理缺分、坏分和小数边界？](#detail-section-12)
  - [Q03 · 回执与replay怎么绑定运行条件？](#detail-section-13)
  - [Q04 · 受管完成和宿主入口的边界是什么？](#detail-section-14)
  - [Q05 · 运行成本和测试证据有什么实际限制？](#detail-section-15)
  - [Q06 · 怎样采用，继续探讨什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者交付前核已有评测与阈值，避免旧PASS被无条件复用。详见[Q01](#research-q01)。

手工阈值脚本或评测均值截图，回执不等重新评测正确。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| builtin/replay | 已有评分门禁 | 不评分/不证真 |
| 回执/status | 当前性复核 | 可信本地范围 |
| managed | DSH登记完成 | 非全发布拦截，builtin不支持 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=22.19 | builtin | 无Python必要 |
| 显式持久状态目录 | 回执/原文 | 丢目录非完整备份 |
| VeriScope/venv/契约 | replay | 版本漂移REVIEW |
| 宿主tools/session | DSH managed | MCP/CLI无此完成入口 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备分数和策略 | 维护者 | 总体/单位明确 |
| 选builtin或replay | 用户 | 不混判定口径 |
| 查看三态和回执 | 用户 | recording与verdict分开 |
| 发布前status | 用户 | 当前范围，外部责任另核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 评分/策略/持久状态 | 单位方向和总体范围核对 | 评分/策略和单位方向需核；准备金额/工时未知 |
| 持续使用 | 本地计算与全输入副本 | 维护归档保留策略，核对评分单位与范围 | 无新评测模型调用；全输入副本存储与本地计算规模未知 |
| 失败恢复 | 原归档和完整状态备份 | 判定/回执/当前性分开查 | 原归档/完整状态备份需保留；分查判定/回执/当前性工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 缺分不误放 | PASS/FAIL/REVIEW | 导出前删除看不到 |
| 小数阈值明确 | V2原词元精确比较 | 单位/评分真实性声明 |
| 旧结论失效 | scope/输出摘要status | 非外部签名/永久有效 |

> **思考**：门禁仅消费所提供分数，不证明样本总体/评分真实，本地摘要不抵抗整体重写，child kill不等进程树回收。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把阈值判定、缺证据保留和当前性回执接合，减少只看旧均值的误读。详见[Q01](#research-q01)。

把阈值判定、缺证据保留和当前性回执接合，减少只看旧均值的误读。详见[Q01](#research-q01)。

保守三态、wx/硬链发布和两次受管重查可借鉴，进程回收与总体来源仍独立。详见[Q05](#research-q05)。

固定源码下，task-monitor汇总会话活动并提供工作区Git commit/push及GitHub发布入口；dsh-verify把给定JSON步骤映射为Playwright动作/断言并汇总步骤PASS；VeriScope核评分回执当前绑定并限制自有managed完成记录，builtin不支持bind/complete。三者分别解决活动可见性、给定检查可重复执行与历史裁决追溯，没有把三种状态、最终产物版本和Git/GitHub副作用接成共同事务。task-monitor写入口未消费另两者结果，verify PASS不绑定提交哈希，VeriScope完成仅wx写完成文件，因此不能用任一面板/断言PASS/完成记录替代最终发布放行。保留未验证设计方向，由外部发布适配器以一次性令牌绑定最终产物哈希、目标远端和当前PASS范围，副作用前复核、之后记确定结果，未知结果不盲重试。最小反证用检查后改文件、切分支/远端、提交后推送失败及响应丢失，要求旧令牌拒用、同令牌不重复发且保留未知结果。若仍错放行或恢复工时不降则否定；本轮没有组合安装或执行效果证据。

比较依据见[263311487-ux/dsh-verify](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L135-L154)、[3450892121/dsh-task-monitor](https://github.com/3450892121/dsh-task-monitor/blob/e628e3ea76cf0f7f0a3489b93c9f00271daeb791/dsh-task-monitor/index.js#L675-L691)、[4444wjt/dsh-plugin-veriscope](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/managed.js#L16-L43)。

<a id="detail-section-5"></a>

### 1.4 主要限制

门禁仅消费所提供分数，不证明样本总体/评分真实，本地摘要不抵抗整体重写，child kill不等进程树回收。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

三态/精确小数与回执范围可查，来源真实性、所有传递依赖及外部发布不在保证内。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/builtin.js、lib/builtin-rules.js、lib/builtin-receipt.js、lib/status.js、lib/config.js、lib/replay.js、lib/managed.js、lib/bridge.js、lib/process.js、tests/row-threshold.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口、builtin正规化/两策略判定/回执/状态，replay执行关键链、managed/bridge及代表小数测试；未穷尽分享/MCP解析/全部安全路径。
- 下一步：进一步从删样本、整体状态改写、终止忽略和重启binding探讨来源/恢复。

**分析版本**

- **仓库**：[4444wjt/dsh-plugin-veriscope](https://github.com/4444wjt/dsh-plugin-veriscope)
- **版本号**：0.6.0（[固定提交 5299b64](https://github.com/4444wjt/dsh-plugin-veriscope/tree/5299b64087bbfa5beef6ae2e336045468f1af01d)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究独立签名评测清单/总体计数及可恢复受管ID、进程组强杀，比较错放行与恢复。当前未验证。详见[Q06](#research-q06)。

进一步从删样本、整体状态改写、终止忽略和重启binding探讨来源/恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1628 | — | — | 32791 |
| .js | source | 29 | 2763 | 2598 | 71 | — |
| .md | example | 2 | 29 | — | — | 518 |
| .mjs | source | 6 | 333 | 316 | 5 | — |
| .js | test | 21 | 2744 | 2598 | 6 | — |
| .mjs | example | 1 | 43 | 41 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/4444wjt/dsh-plugin-veriscope/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/4444wjt/dsh-plugin-veriscope/issues?q=is%3Aissue+created%3A2026-09-22T06%3A27%3A18.814Z..2026-10-22T06%3A27%3A18.814Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/4444wjt/dsh-plugin-veriscope/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A27%3A18.814Z..2026-10-22T06%3A27%3A18.814Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有评分三态门禁怎样判定、留痕和失效，能承担哪一层交付责任？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 归档门禁解决什么问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有评测结果的维护者，在交付前按显式阈值重放/检查并保存可追溯回执，区分历史PASS/FAIL和当前绑定是否仍有效。两条引擎要分清，replay调用固定契约的原VeriScope Python脚本，builtin仅Node消费逐条已有评分与策略，不重新评分、不调用评测模型。它解决“这些提供的数据按这份策略能否通过”，不证明答案事实正确、评测样本全量或来源真实。

贡献是三态保守判定、输入/策略/判定代码/环境绑定与回执生命周期，较只保一张均值截图更能解释旧结论何时失效；算法阈值和哈希本身已有。builtin不用于bind/complete，replay受管完成只是插件自己的登记入口，不是拦住所有聊天宣称完成、CI发布或外部系统动作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-10](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/README.md#L5-L10)

作者定位。

```text
**给 AI 回答质量做发布门禁**：判定一批已经评测过的结果能不能发布，并留下可复验的回执。

- **两条通道**：重放 VeriScope 归档（调原 Python 门禁）；或仅用 Node 对任意已有逐条评分做阈值判定——不需要 VeriScope、Python 或 pandas
- **三态**：通过／失败／待复核。待复核永不转为通过，已确认失败不被附加异常掩盖
- **回执**：绑定输入、策略、判定器与环境；条件一变，旧结论自动失效
- **不评分、不调用模型**：只消费已有结果，不重新评测
```

**依据 2 · 作者声明**：[README.md:48-56](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/README.md#L48-L56)

两引擎和原评分边界。

```text
- 支持 `GateArchiveV1` 和 Ragas `result.to_pandas().to_json(orient="records")` 布局；策略显式选择 `GatePolicyV1` 或 `GatePolicyV2`，不猜测字段或阈值。
- 对全部输入记录算等权均值；缺失值不补零、不跳过。完整均值不达标，或已知有效行违反显式逐条阈值，为 FAIL；其余缺证据为 REVIEW，全部完整达标才 PASS。
- 不把 `faithfulness` 改成 `pos_faithfulness`；B2 的 PASS 不等同原门禁，不证明评分或回答事实正确，也不检查导出前被删掉的记录。
- DSH／MCP 都提供 check；CLI 安装后的命令为 `veriscope-check`。`doctor({engine:"builtin"})` 不探测 Python；status／list 支持两种回执。
- B2 使用 ReceiptV2，首版只有文本，不接入 bind／complete；DSH 导出支持 JSON／Markdown，B2 暂不支持 share。回执仍无限保留，不自动清理。

**均值通过，仍可看到最差一条。** 每指标显示最差有效行及未达均值阈值的条数；诊断本身不改裁决。需要逐条拦截时，用 `GatePolicyV2` 加 `row_threshold`，沿用该指标的方向和单位。例如构造分数的均值为 0.81、其中一条为 0.41：只查均值可 PASS，显式要求每条 ≥0.5 才 FAIL。V2 使用 JSON 原数字词元作精确十进制比较；V1 原浮点判定保持不变。

规范、策略和导出方式见包内 `docs/B2.md`、`schemas/`、`examples/builtin/`。样例为文档构造，非真实评测。0.6.0 已发布至 npm；Windows 与 Ubuntu 远端 CI（含固定上游真实回放）均已验证，Claude 完整结构化错误交付仍待验。0.5.0 历史验收保留在 `docs/acceptance-b2-v0.5.0.json`。
```

**依据 3 · 源码核查**：[lib/builtin.js:11-17](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin.js#L11-L17)

明确限制。

```text
export const BUILTIN_LIMITATIONS = Object.freeze([
  '只消费已有评分，检查全部输入记录的等权均值及显式逐条阈值；诊断提示本身不改裁决，不评分、不调用模型。',
  '无法发现导出前已删除的记录；完整性仅针对所提供的输入，不证明原评测全量完整。',
  '来源和单位为提供方声明，不证明评分或回答事实正确，也不等同原 VeriScope 正样本门禁。',
  '回执仅检测可信本地记录的变化；不抵御能整体重写状态根的用户。',
  'B2 不用于 bind/complete，不授权发布；当前有效性须另查 status。',
])
```

**依据 4 · 源码核查**：[lib/status.js:12-16](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/status.js#L12-L16)

状态边界。

```text
export const STATUS_LIMITATIONS = [
  '仅确认查询时所列绑定项；未封存全部传递依赖和操作系统，检查后仍可能变化。',
  '摘要用于可信本地记录的变化检测，不提供外部签名或抗整体恶意重写保证。',
  '不重新评分或调用评测模型；普通聊天与外部发布不受此完成入口控制。',
]
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · builtin如何处理缺分、坏分和小数边界？

**研究主题**：功能与机制

#### 完整回答

normalize仅接受GateArchiveV1或指定Ragas records对象数组，最多十万行，每行唯一ID，按策略显式指标选列，缺失/非法不删行不补零。V1等权均值需所有提供行完整才比较，有任何已确认FAIL优先于其他REVIEW，空/不完整为REVIEW；Kahan与溢出缩放重算减少浮点异常，但不是精确十进制。

V2从原JSON数字词元解析精确小数，用总和与阈值乘条数比较避免除法舍入；可选row_threshold沿用方向/单位，只要有效行有违反就FAIL，剩余缺失不能把已知失败改REVIEW。最差行/低于均值阈值条数诊断本身不改裁决。仅均值达标可能掩盖单例，读者应显式选V2逐行规则；来源、单位仍由提供者声明，不比较不同评测器分数是否可比。

#### 证据与依据

**依据 1 · 源码核查**：[lib/builtin-rules.js:72-96](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin-rules.js#L72-L96)

输入正规化。

<details>
<summary>查看原文（25行）</summary>

```text
export function normalizeArchive(value, policy, format = 'gate-archive-v1') {
  if (!BUILTIN_FORMATS.includes(format)) reject('BUILTIN_FORMAT_UNSUPPORTED', '仅支持 GateArchiveV1 或指定的 Ragas records JSON 布局。')
  let source, rows
  if (format === 'ragas-records-v1') {
    if (!Array.isArray(value) || value.some(row => !object(row))) reject('BUILTIN_ARCHIVE_INVALID', 'Ragas 输入必须为 to_pandas().to_json(orient="records") 的对象数组，不读取汇总字典或其他布局。')
    source = { producer: 'ragas', version: null }
    rows = value.map((scores, index) => ({ id: `row-${index + 1}`, scores }))
  } else {
    if (!keys(value, ['schema_version', 'source', 'rows']) || value.schema_version !== 'GateArchiveV1'
      || !keys(value.source, ['producer', 'version'], ['producer']) || !text(value.source.producer)
      || (value.source.version !== undefined && value.source.version !== null && (typeof value.source.version !== 'string' || value.source.version.length > 128))
      || !Array.isArray(value.rows)) reject('BUILTIN_ARCHIVE_INVALID', '需要 GateArchiveV1、来源声明及逐条 scores，不能用汇总均值替代。')
    source = { producer: value.source.producer, version: value.source.version ?? null }
    rows = value.rows
  }
  if (rows.length > BUILTIN_LIMITS.rows) reject('FILE_LIMIT', '逐条记录超过 100,000 条上限。')
  const ids = new Set()
  const normalized = rows.map(row => {
    if (!keys(row, ['id', 'scores']) || !text(row.id) || ids.has(row.id) || !object(row.scores)) reject('BUILTIN_ARCHIVE_INVALID', '每条记录需要唯一的非空 id 和 scores 对象；不删除无效记录。')
    ids.add(row.id)
    // Select only explicitly requested, identically named columns. Missing and
    // malformed values are preserved, never coerced or filtered out.
    return { id: row.id, scores: Object.fromEntries(policy.rules.filter(rule => Object.hasOwn(row.scores, rule.metric)).map(rule => [rule.metric, row.scores[rule.metric]])) }
  })
  return { schema_version: 'GateArchiveV1', source, rows: normalized }
```

</details>

**依据 2 · 源码核查**：[lib/builtin-rules.js:99-145](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin-rules.js#L99-L145)

V1完整均值。

<details>
<summary>查看原文（47行）</summary>

```text
export function evaluateThresholds(archive, policy, sources) {
  if (policy.schema_version === 'GatePolicyV2') return evaluateDecimalThresholds(archive, policy, sources)
  const metrics = policy.rules.map(rule => {
    const result = { metric: rule.metric, unit: rule.unit, operator: rule.operator, threshold: rule.threshold, range: rule.range ?? null,
      aggregation: 'mean', population: 'all_provided_rows', total_count: archive.rows.length, valid_count: 0, missing_count: 0, invalid_count: 0,
      mean: null, status: 'REVIEW', reason_code: 'EMPTY_DATA', issues: [], issues_truncated: false }
    let sum = 0, compensation = 0
    for (const row of archive.rows) {
      const value = row.scores[rule.metric]
      let reason
      if (!Object.hasOwn(row.scores, rule.metric) || value === null) { result.missing_count++; reason = 'MISSING_VALUE' }
      else if (!finite(value) || (rule.range?.min !== undefined && value < rule.range.min) || (rule.range?.max !== undefined && value > rule.range.max)) { result.invalid_count++; reason = 'INVALID_VALUE' }
      else {
        result.valid_count++
        // Sum before dividing so subnormal values are not rounded to zero
        // before aggregation. Kahan summation follows original row order.
        const term = value - compensation
        const next = sum + term
        compensation = (next - sum) - term; sum = next
      }
      if (reason) {
        if (result.issues.length < BUILTIN_LIMITS.issues) result.issues.push({ row_id: row.id, reason_code: reason })
        else result.issues_truncated = true
      }
    }
    if (!result.total_count) return result
    if (result.missing_count || result.invalid_count) { result.reason_code = 'METRIC_INCOMPLETE'; return result }
    let mean = sum / result.total_count
    if (!Number.isFinite(mean)) {
      // Retry only the arithmetic after sum overflow, with scaled finite
      // terms. This does not filter rows, round scores, or rerun any model.
      sum = 0; compensation = 0
      for (const row of archive.rows) {
        const term = row.scores[rule.metric] / result.total_count - compensation
        const next = sum + term
        compensation = (next - sum) - term; sum = next
      }
      mean = sum
    }
    if (!Number.isFinite(mean)) { result.reason_code = 'AGGREGATE_UNAVAILABLE'; return result }
    result.mean = Object.is(mean, -0) ? 0 : mean
    result.status = (rule.operator === 'gte' ? result.mean >= rule.threshold : result.mean <= rule.threshold) ? 'PASS' : 'FAIL'
    result.reason_code = result.status === 'PASS' ? 'THRESHOLD_PASSED' : 'THRESHOLD_FAILED'
    return result
  })
  const status = metrics.some(metric => metric.status === 'FAIL') ? 'FAIL' : metrics.every(metric => metric.status === 'PASS') ? 'PASS' : 'REVIEW'
  return diagnoseV1(archive, policy, { status, gate_passed: status === 'REVIEW' ? null : status === 'PASS', metrics })
```

</details>

**依据 3 · 源码核查**：[lib/builtin-rules.js:148-197](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin-rules.js#L148-L197)

V2原词元与FAIL优先。

<details>
<summary>查看原文（50行）</summary>

```text
function evaluateDecimalThresholds(archive, policy, sources) {
  const rules = decimalRules(policy, sources?.policy)
  const metrics = policy.rules.map((rule, index) => {
    const r = rules[index], d = diagnostics(), rowConstraint = r.row ? { operator: rule.operator, threshold: rule.row_threshold,
      decimal_threshold: decimalString(r.row), status: 'REVIEW', violation_count: 0, row_ids: [], truncated: false } : null
    const result = { metric: rule.metric, unit: rule.unit, operator: rule.operator, threshold: rule.threshold, range: rule.range ?? null,
      aggregation: 'mean', population: 'all_provided_rows', total_count: archive.rows.length, valid_count: 0, missing_count: 0, invalid_count: 0,
      mean: null, mean_status: 'REVIEW', status: 'REVIEW', reason_code: 'EMPTY_DATA', issues: [], issues_truncated: false,
      diagnostics: d, row_constraint: rowConstraint, decimal: { threshold: decimalString(r.threshold), sum: null, count: archive.rows.length, mean_is_approximate: true } }
    let sum = parseDecimalToken('0'), worst = null, displaySum = 0, compensation = 0
    for (const [i, row] of archive.rows.entries()) {
      const value = row.scores[rule.metric]
      let reason, exact
      if (!Object.hasOwn(row.scores, rule.metric) || value === null) { result.missing_count++; reason = 'MISSING_VALUE' }
      else {
        try {
          if (!finite(value)) throw new Error('type')
          const pointer = sources?.format === 'ragas-records-v1' ? `/${i}/${escapePointer(rule.metric)}` : `/rows/${i}/scores/${escapePointer(rule.metric)}`
          exact = parseDecimalToken(numberToken(sources?.archive, pointer, value))
          if ((r.min && compareDecimal(exact, r.min) < 0) || (r.max && compareDecimal(exact, r.max) > 0)) throw new Error('range')
        } catch (error) { result.invalid_count++; reason = error.code === 'DECIMAL_LIMIT' ? 'DECIMAL_LIMIT' : 'INVALID_VALUE' }
        if (!reason) {
          result.valid_count++
          sum = sumDecimals([sum, exact])
          const term = value - compensation, next = displaySum + term
          compensation = (next - displaySum) - term; displaySum = next
          if (!worst || !passes(rule.operator, compareDecimal(exact, worst))) { worst = exact; d.worst = { row_id: row.id, value, decimal: decimalString(exact) } }
          if (!passes(rule.operator, compareDecimal(exact, r.threshold))) { d.outside_mean_threshold_count++; addId(d, row.id) }
          if (rowConstraint && !passes(rule.operator, compareDecimal(exact, r.row))) { rowConstraint.violation_count++; addId(rowConstraint, row.id) }
        }
      }
      if (reason) { if (result.issues.length < BUILTIN_LIMITS.issues) result.issues.push({ row_id: row.id, reason_code: reason }); else result.issues_truncated = true }
    }
    const complete = result.total_count > 0 && !result.missing_count && !result.invalid_count
    // No partial mean is emitted. Exact arithmetic does not divide or round.
    if (complete) {
      result.decimal.sum = decimalString(sum)
      let mean = displaySum / result.total_count
      if (!Number.isFinite(mean)) { mean = 0; compensation = 0; for (const row of archive.rows) { const term = row.scores[rule.metric] / result.total_count - compensation, next = mean + term; compensation = (next - mean) - term; mean = next } }
      result.mean = Number.isFinite(mean) ? (Object.is(mean, -0) ? 0 : mean) : null
      result.mean_status = passes(rule.operator, compareMean(sum, result.total_count, r.threshold)) ? 'PASS' : 'FAIL'
    }
    if (rowConstraint) rowConstraint.status = rowConstraint.violation_count ? 'FAIL' : complete ? 'PASS' : 'REVIEW'
    result.status = result.mean_status === 'FAIL' || rowConstraint?.status === 'FAIL' ? 'FAIL' : complete ? 'PASS' : 'REVIEW'
    result.reason_code = rowConstraint?.status === 'FAIL' ? 'ROW_THRESHOLD_FAILED' : !result.total_count ? 'EMPTY_DATA' : !complete ? 'METRIC_INCOMPLETE' : result.mean_status === 'FAIL' ? 'THRESHOLD_FAILED' : 'THRESHOLD_PASSED'
    return result
  })
  const status = metrics.some(m => m.status === 'FAIL') ? 'FAIL' : metrics.every(m => m.status === 'PASS') ? 'PASS' : 'REVIEW'
  return { status, gate_passed: status === 'REVIEW' ? null : status === 'PASS', metrics }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回执与replay怎么绑定运行条件？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

builtin在读前/读后捕获运行文件与Node环境，原输入/策略留字节快照，判定后/记录中重查scope，UUID目录wx写输入/策略/normalized/report；receipt用随机临时文件fsync再硬链接发布，避免覆盖。status校验回执摘要和输出哈希，再比较当前原输入/策略、插件文件和环境；历史裁决保留，变化仅使当前REVIEW/STALE。摘要用于可信本地变化检测，能整体重写状态目录者仍可重算哈希，不是外部签名/不可抵赖。

replay需显式或Windows默认VeriScope根、指定venv Python/pandas与匹配契约，不回退任意PATH；先快照归档，再shell:false调用gate_replay.py，核exit、输出、stderr及执行后源/契约/scope，异常保留REVIEW而不把code1直接当确认FAIL。Node>=22.19、宿主可选精确SDK候选版；builtin要求显式持久状态目录，不需Python。传递依赖/OS全部状态未封存，status之后仍可变化，不保证永久有效。

#### 证据与依据

**依据 1 · 源码核查**：[lib/builtin.js:30-69](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin.js#L30-L69)

多次scope和留痕。

<details>
<summary>查看原文（40行）</summary>

```text
    try {
      const input = checkArguments(args)
      builtinStore(fixed) // validate explicit configuration before reading sources; no directory creation
      cancelled(signal)
      const captured = captureBuiltinInputs(input, fixed)
      report.engine = { ...captured.scope.engine }
      report.policy = captured.policy; report.source = { ...captured.archive.source, verification: 'declared_only', format: input.format }
      await setImmediate(); cancelled(signal)
      const result = evaluateThresholds(captured.archive, captured.policy, captured.sources)
      Object.assign(report, result, { judgement: result.status })
      report.execution.executed = true
      report.evidence = result.metrics.map(metric => ({ kind: 'metric_rows', metric: metric.metric,
        input_sha256: captured.scope.input.sha256, policy_sha256: captured.scope.policy.sha256,
        locator: input.format === 'ragas-records-v1' ? { column: metric.metric } : { field: 'rows[].scores', metric: metric.metric },
        total_count: metric.total_count, valid_count: metric.valid_count }))
      await setImmediate(); cancelled(signal)
      if (digest(captured.scope) !== digest(captureBuiltinCurrentScope(captured.scope, fixed))) throw new ReviewError('SCOPE_CHANGED', '检查期间输入、策略、插件或环境发生变化；不能生成可复用回执。')
      const store = builtinStore(fixed, true)
      directory = path.join(store.runsDir, report.run_id)
      fs.mkdirSync(directory, { mode: 0o700 })
      recording.artifacts_path = directory
      for (const [name, bytes] of [['input.json', captured.archiveBytes], ['policy.json', captured.policyBytes], ['normalized.json', JSON.stringify(captured.archive, null, 2) + '\n']]) {
        fs.writeFileSync(path.join(directory, name), bytes, { flag: 'wx', mode: 0o600 })
      }
      cancelled(signal)
      if (digest(captured.scope) !== digest(captureBuiltinCurrentScope(captured.scope, fixed))) throw new ReviewError('SCOPE_CHANGED', '记录期间绑定项变化，未发布回执。')
      report.execution.elapsed_ms = performance.now() - started
      // report.json is the immutable judgment core. Post-publication recording
      // metadata is returned separately, avoiding a receipt/report hash cycle.
      fs.writeFileSync(path.join(directory, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
      writeBuiltinReceipt(directory, report, captured.scope)
      recording.receipt_available = true; recording.eligible_at_recording = report.status === 'PASS'
    } catch (error) {
      report.execution.errors.push({ code: errorCode(error), message: error instanceof ReviewError ? error.message : '本地检查或留痕失败；请核查来源、状态目录与权限。',
        ...(error instanceof ReviewError && error.diagnostic ? { diagnostic: error.diagnostic } : {}) })
      if (report.status !== 'FAIL') { report.status = 'REVIEW'; report.gate_passed = null }
      report.execution.elapsed_ms = performance.now() - started
      if (directory) {
        // Never overwrite a report, receipt, source snapshot, or earlier error.
        try { fs.writeFileSync(path.join(directory, 'recording-error.json'), JSON.stringify({ ...report, recording }, null, 2) + '\n', { flag: 'wx', mode: 0o600 }) } catch { /* original failure remains in the returned diagnostic */ }
```

</details>

**依据 2 · 源码核查**：[lib/builtin-receipt.js:30-81](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin-receipt.js#L30-L81)

字节指纹/发布。

<details>
<summary>查看原文（52行）</summary>

```text
function snapshot(filename, limit) {
  const realPath = fs.realpathSync(filename), bytes = readBounded(realPath, limit)
  if (realPath !== fs.realpathSync(filename)) throw new ReviewError('CHECK_RACE', '读取期间来源路径发生变化。')
  return { bytes, fingerprint: { path: path.resolve(filename), real_path: realPath, bytes: bytes.length, sha256: sha256(bytes) } }
}
const located = bytes => { const raw = new TextDecoder('utf8', { fatal: true }).decode(bytes); return { raw, ...parseLocatedJson(raw) } }
const json = bytes => located(bytes).value
function runtimeScope(options) {
  const root = options.pluginRoot ?? PACKAGE_ROOT
  const files = Object.fromEntries(BUILTIN_FILES.map(relative => [relative, sha256(readBounded(path.join(root, relative), 4 * 1024 * 1024))]))
  const pkg = json(readBounded(path.join(root, 'package.json'), 65536))
  return { plugin: { root: fs.realpathSync(root), version: pkg.version, files, coverage: [...BUILTIN_FILES] },
    environment: { node: process.version, platform: process.platform, arch: process.arch, executable: fs.realpathSync(process.execPath) } }
}

export function captureBuiltinInputs(input, options) {
  const firstRuntime = runtimeScope(options)
  const archiveFile = snapshot(input.archive_path, LIMITS.inputBytes), policyFile = snapshot(input.policy_path, 1024 * 1024)
  const policySource = located(policyFile.bytes), archiveSource = located(archiveFile.bytes)
  const policy = validatePolicy(policySource.value, policySource), archive = normalizeArchive(archiveSource.value, policy, input.format)
  const runtime = runtimeScope(options)
  if (digest(firstRuntime) !== digest(runtime)) throw new ReviewError('CHECK_RACE', '读取期间插件或 Node 环境发生变化。')
  const scope = { engine: { ...engineForPolicy(policy) }, adapter: { id: input.format, version: '1.0.0' }, input: archiveFile.fingerprint,
    policy: policyFile.fingerprint, normalized_sha256: digest(archive), policy_spec_sha256: digest(policy), ...runtime }
  return { archive, policy, sources: { archive: archiveSource, policy: policySource, format: input.format }, archiveBytes: archiveFile.bytes, policyBytes: policyFile.bytes, scope }
}

// Status only fingerprints sources and code; it never executes a second
// judgment. Identical bytes + adapter + policy bind the recorded normalization.
export function captureBuiltinCurrentScope(original, options) {
  if (!isBuiltinEngine(original.engine)) throw new ReviewError('RECEIPT_INVALID', '未知 B2 判定器。')
  return { ...original, engine: { ...original.engine }, adapter: { id: original.adapter.id, version: '1.0.0' },
    input: fingerprint(original.input.path, LIMITS.inputBytes), policy: fingerprint(original.policy.path, 1024 * 1024), ...runtimeScope(options) }
}

export function writeBuiltinReceipt(directory, report, scope) {
  if (report.schema_version !== 'BuiltinGateReportV1' || report.execution?.executed !== true || !scope || !isBuiltinEngine(report.engine)
    || digest(report.engine) !== digest(engineForPolicy(report.policy ?? {})) || digest(scope.engine) !== digest(report.engine)
    || !['PASS', 'FAIL', 'REVIEW'].includes(report.status)) throw new ReviewError('NO_EXECUTED_CHECK', '未实际执行 B2 判定，不能生成回执。')
  const outputs = Object.fromEntries(BUILTIN_OUTPUTS.map(name => {
    const bytes = readBounded(path.join(directory, name), 32 * 1024 * 1024)
    return [name, { sha256: sha256(bytes), bytes: bytes.length }]
  }))
  const payload = { run_id: report.run_id, created_at_utc: new Date().toISOString(), historical_verdict: report.status,
    engine: { ...report.engine }, scope, scope_digest: digest(scope), outputs }
  const receipt = { schema_version: 'ReceiptV2', payload, integrity_sha256: digest(payload) }
  const temporary = path.join(directory, `.receipt-${randomUUID()}.tmp`)
  try {
    const handle = fs.openSync(temporary, 'wx', 0o600)
    try { fs.writeFileSync(handle, JSON.stringify(receipt, null, 2) + '\n'); fs.fsyncSync(handle) } finally { fs.closeSync(handle) }
    fs.linkSync(temporary, path.join(directory, 'receipt.json'))
  } finally { try { fs.unlinkSync(temporary) } catch {} }
```

</details>

**依据 3 · 源码核查**：[lib/status.js:23-60](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/status.js#L23-L60)

校验和当前性。

<details>
<summary>查看原文（38行）</summary>

```text
export function readRecord(args, options) {
  const run = locateRun(options, args.run_id)
  const receiptFile = path.join(run.directory, 'receipt.json')
  if (fs.lstatSync(receiptFile).isSymbolicLink()) throw new ReviewError('STATE_PATH_ESCAPE', '回执不得重定向。')
  const raw = readBounded(receiptFile, 1024 * 1024)
  const receipt = parseLocatedJson(new TextDecoder('utf8', { fatal: true }).decode(raw)).value
  const p = receipt.payload
  if (receipt.schema_version === 'ReceiptV2') return readBuiltinRecord(run, raw, receipt, options)
  if (receipt.schema_version !== 'ReceiptV1' || !p || p.run_id !== run.runId || !['PASS', 'FAIL', 'REVIEW'].includes(p.historical_verdict) || digest(p) !== receipt.integrity_sha256 || digest(p.scope) !== p.scope_digest) throw new ReviewError('RECEIPT_INVALID', '回执版本、结构或摘要校验失败。')
  if (!p.scope?.input || !p.scope?.thresholds || !p.outputs || !p.scope?.plugin || !p.scope.environment) throw new ReviewError('RECEIPT_INVALID', '回执字段不完整。')
  for (const name of ['report.json', 'stdout.txt', 'stderr.txt']) {
    const filename = path.join(run.directory, name)
    if (fs.lstatSync(filename).isSymbolicLink()) throw new ReviewError('STATE_PATH_ESCAPE', '输出记录不得重定向。')
    const bytes = readBounded(filename, name === 'report.json' ? 32 * 1024 * 1024 : 2 * 1024 * 1024)
    if (sha256(bytes) !== p.outputs[name]?.sha256 || bytes.length !== p.outputs[name]?.bytes) throw new ReviewError('OUTPUT_CHANGED', '原报告或原始日志已变化。')
  }
  if (fs.lstatSync(receiptFile).isSymbolicLink()) throw new ReviewError('STATE_PATH_ESCAPE', '回执不得重定向。')
  const report = JSON.parse(readBounded(path.join(run.directory, 'report.json'), 32 * 1024 * 1024))
  if (report.run_id !== p.run_id || report.status !== p.historical_verdict || report.gate_passed !== (report.status === 'PASS' ? true : report.status === 'FAIL' ? false : null)) throw new ReviewError('RECEIPT_INVALID', '原报告与回执裁决不一致。')
  return { run, raw, receipt, report }
}
function checkBuiltinStatus(args, options, signal, record, value) {
  const { receipt, report, raw } = record, original = receipt.payload.scope
  value.engine = { ...original.engine }
  value.sources.push({ kind: 'policy', ...original.policy })
  value.details = { engine: value.engine, policy: report.policy, environment: original.environment, input: original.input, policy_file: original.policy }
  if (Object.keys(args).some(key => key !== 'run_id')) throw new ReviewError('BUILTIN_POLICY_ARGUMENT', 'B2 状态不接受 faith、ctx 或 baseline_run_id；策略绑定原文件，修改后须重新 check。')
  if (signal?.aborted) throw new ReviewError('CANCELLED', '状态检查已取消。')
  const current = captureBuiltinCurrentScope(original, options)
  const changed = builtinScopeChanges(original, current)
  if (!raw.equals(readRecord(args, options).raw) || signal?.aborted) throw new ReviewError('CHECK_RACE', '状态检查期间回执发生变化或请求取消。')
  value.changes = changed.changes; value.reason_codes = changed.reason_codes
  if (changed.reason_codes.length) { value.freshness = 'STALE'; value.next_step = 'B2 绑定项已变化；重新 check 才能取得当前回执，历史裁决保留。' }
  else {
    value.freshness = 'FRESH'; value.current_verdict = report.status; value.gate_passed = report.gate_passed
    value.reason_codes = [report.status === 'REVIEW' ? 'CORE_REVIEW' : 'BINDINGS_UNCHANGED']
    value.next_step = report.status === 'PASS' ? '所列 B2 绑定项当前未变；不用于 bind/complete，也不证明评分正确。'
      : report.status === 'FAIL' ? 'B2 门禁仍失败；查看完整指标及策略，修复后重新 check。' : 'B2 原判定待复核；补齐数据后重新 check。'
```

</details>

**依据 4 · 源码核查**：[lib/config.js:29-50](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/config.js#L29-L50)

根与venv。

<details>
<summary>查看原文（22行）</summary>

```text
export function resolveRootConfiguration(env = process.env, { platform = process.platform } = {}) {
  const rootOverride = explicit(env, 'VERISCOPE_ROOT')
  if (rootOverride === undefined && platform !== 'win32') throw new ReviewError('INVALID_CONFIGURATION', '非 Windows 平台必须显式设置 VERISCOPE_ROOT 为 VeriScope 根目录的绝对路径。')
  const veriscopeRoot = requirePath(rootOverride ?? DEFAULT_WINDOWS_ROOT, 'directory', 'VeriScope 根目录')
  const scriptPath = requirePath(path.join(veriscopeRoot, 'scripts', 'gate_replay.py'), 'file', '门禁重放脚本')
  return Object.freeze({ veriscopeRoot, scriptPath, source: rootOverride === undefined ? 'default' : 'environment' })
}

export function resolveConfiguration(env = process.env, { platform = process.platform } = {}) {
  const { veriscopeRoot, scriptPath, source } = resolveRootConfiguration(env, { platform })
  const pythonOverride = explicit(env, 'VERISCOPE_PYTHON')
  let pythonPath = pythonOverride
  if (pythonPath === undefined) {
    const suffix = platform === 'win32' ? ['Scripts', 'python.exe'] : ['bin', 'python']
    pythonPath = ['.venv', 'venv'].map(name => path.join(veriscopeRoot, name, ...suffix))
      .find(candidate => { try { return fs.statSync(candidate).isFile() } catch { return false } })
    if (!pythonPath) throw new ReviewError('PYTHON_NOT_FOUND', '未找到项目 venv Python；请设置 VERISCOPE_PYTHON，禁止回退全局 PATH。')
  }
  pythonPath = requirePath(pythonPath, 'file', 'Python 解释器', true)
  return Object.freeze({
    veriscopeRoot, pythonPath, scriptPath,
    sources: { veriscopeRoot: source, pythonPath: pythonOverride === undefined ? 'venv_probe' : 'environment' },
```

</details>

**依据 5 · 源码核查**：[lib/replay.js:118-153](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/replay.js#L118-L153)

快照与进程/结果核查。

<details>
<summary>查看原文（36行）</summary>

```text
          environment = await probeEnvironment(config, { ...options, runner }, signal)
          report.execution.python = { version: environment.python.version, pandas: environment.pandas.version, executable: environment.python.real_path, pandas_metadata_sha256: environment.pandas.metadata_sha256 }
        } catch { throw new ReviewError('PYTHON_UNAVAILABLE', '无法确认 Python／pandas 或发行元数据；请显式配置可用环境。') }
        receiptScope = await captureScope(input, { ...options, selectedContract: selected }, signal, environment)
        temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'veriscope-replay-'))
        const snapshot = path.join(temporary, 'input.json')
        fs.writeFileSync(snapshot, archive.bytes, { flag: 'wx', mode: 0o600 })
        const commandArgs = ['-B', config.scriptPath, snapshot, '--faith', String(input.faith), '--ctx', String(input.ctx)]
        if (baseline) {
          const baselineSnapshot = path.join(temporary, 'baseline.json')
          fs.writeFileSync(baselineSnapshot, baseline.bytes, { flag: 'wx', mode: 0o600 })
          commandArgs.push('--baseline', baselineSnapshot)
        }
        report.execution.command = { executable: config.pythonPath, args: commandArgs, cwd: config.veriscopeRoot, shell: false }
        processResult = await runner(config.pythonPath, commandArgs, { cwd: config.veriscopeRoot, signal, timeoutMs: LIMITS.timeoutMs, outputBytes: LIMITS.outputBytes, env })
        report.exit_code = processResult.code
        report.execution.process = { reason: processResult.reason, error: processResult.error, signal: processResult.signal, elapsed_ms: processResult.elapsed_ms, stdout_bytes: processResult.stdout_bytes, stderr_bytes: processResult.stderr_bytes }
        parsed = parseReplayOutput(processResult.stdout, archive, Boolean(baseline))
        report.execution.errors.push(...parsed.errors)
        if (processResult.reason || processResult.error || processResult.signal) report.execution.errors.push(issue('PROCESS_INCOMPLETE', `执行未正常完成：${processResult.reason ?? processResult.error ?? processResult.signal}`))
        if (![0, 1, 2].includes(processResult.code)) report.execution.errors.push(issue('UNKNOWN_EXIT', '退出码不属于已核验契约。'))
        if (processResult.code === 2) report.execution.errors.push(issue('UPSTREAM_INVALID_INPUT', '上游拒绝输入，退出码 2。'))
        if (processResult.code === 0 && parsed.gate !== true) report.execution.errors.push(issue('EXIT_OUTPUT_CONFLICT', '退出码 0 与裁决文本冲突。'))
        if (processResult.code === 1 && !parsed.confirmedFailure) report.execution.errors.push(issue('EXIT_OUTPUT_CONFLICT', '退出码 1 缺少可靠的拦截标记；可能是 Python 异常，保留待复核。'))
        if (processResult.stderr.trim()) report.execution.errors.push(issue('UPSTREAM_STDERR', '上游产生 stderr，请查看原始日志；不自动放行。'))
        for (const source of [archive, baseline].filter(Boolean)) {
          try { if (sha256(fs.readFileSync(source.path)) !== source.sha256) report.execution.errors.push(issue('SOURCE_CHANGED', '运行期间原归档发生变化；本次使用先前字节快照。')) }
          catch { report.execution.errors.push(issue('SOURCE_CHANGED', '运行后原归档不可读。')) }
        }
        try { verifyContract(config.veriscopeRoot, selected.contract) } catch (error) { report.execution.errors.push(issue(error.code, error.message)) }
        try {
          const currentScope = await captureScope(input, { ...options, selectedContract: selected }, signal)
          if (digest(receiptScope) !== digest(currentScope)) throw new ReviewError('SCOPE_CHANGED', '运行期间绑定项变化，不能生成可复用回执。')
        } catch (error) {
          receiptScope = null
          report.execution.errors.push(issue(error.code ?? 'SCOPE_UNAVAILABLE', '运行后无法确认回执绑定范围。'))
```

</details>

**依据 6 · 源码核查**：[package.json:59-76](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/package.json#L59-L76)

Node/peer。

<details>
<summary>查看原文（18行）</summary>

```text
  "license": "MIT",
  "engines": {
    "node": ">=22.19.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "0.2.1-alpha.2",
    "@deepseek-ai/dsh-skill": "0.2.1-alpha.2"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-skill": {
      "optional": true
    },
    "@deepseek-ai/dsh-tools": {
      "optional": true
    }
  },
  "exports": {
    ".": "./index.js",
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 受管完成和宿主入口的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

DSH工具取真实execution.agent.session.id，受管bindings按session+task分区，bind检查回执当前性，complete重查两次PASS/范围一致再wx保存完成记录；builtin显式不支持受管凭据，能防误将另一引擎通过当replay完成。bindings只内存，重启/卸载丢失，remind只是agent/turn-stopping时steer一次通知，不是阻塞普通会话或发布。最终检查到写完成间仍有时间窗，记录代表当时所查范围。

状态bridge要求POST、loopback Origin且严格同源、JSON和实际remoteAddress回环、4KB body及sessionRuns关联，比只信Host强；但session_id来自请求，不是独立用户凭据，仍限可信本地。索引remember最多256会话每会话512条，超限不再登记会使结果卡重查不可用，工具本身仍可查。MCP/CLI不提供原生卡和受管完成，不能把有MCP等同宿主治理全覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-27](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/index.js#L17-L27)

会话记忆额度。

<details>
<summary>查看原文（11行）</summary>

```text
  const lifetime = new AbortController(), sessionRuns = new Map()
  const disposers = []
  const signal = execution => execution?.signal ? AbortSignal.any([execution.signal, lifetime.signal]) : lifetime.signal
  const remember = (value, execution) => {
    const sessionId = sessionIdentity(execution), runId = value.run_id ?? value.status?.run_id
    if (sessionId && runId && !lifetime.signal.aborted) {
      if (!sessionRuns.has(sessionId) && sessionRuns.size < 256) sessionRuns.set(sessionId, new Set())
      const runs = sessionRuns.get(sessionId)
      if (runs && runs.size < 512) runs.add(runId)
    }
    if (value.schema_version !== '1.0') value.session_id = sessionId
```

</details>

**依据 2 · 源码核查**：[index.js:48-64](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/index.js#L48-L64)

Skill/工具/bridge与提醒。

<details>
<summary>查看原文（17行）</summary>

```text
    const skills = ctx.get('skills')
    if (skills && typeof skills.register === 'function') disposers.push(skills.register({ name, description: '离线重放鉴真全域 VeriScope AI 归档门禁，保留失败、待复核和来源。', content: readFileSync(skillPath, 'utf8'), source: 'runtime', provider: name }))
    for (const tool of catalog.tools) disposers.push(ctx.tools.register(defineTool({
      name: tool.name, description: tool.description, parameters: toolParameters(tool.inputSchema),
      output: { schema: toValueSpec(tool.outputSchema), ...(tool.presentation === 'gate' ? { presentationMeta: (args, value) => presentationMeta(args, value, tool.render) } : {}),
        render: (_args, value) => [{ type: 'text', text: tool.render(value) }] },
      execute: async (args, execution) => {
        const value = await tool.call(args, { signal: signal(execution), sessionId: sessionIdentity(execution), execution })
        if (tool.presentation === 'gate') return remember(value, execution)
        for (const item of value.items ?? []) if (item.run_id) remember(item, execution)
        return value
      },
    })))
    const bridge = ctx.inject(['webServer'], bridgeCtx => registerStatusBridge(bridgeCtx, statusService, sessionRuns))
    disposers.push(() => bridge.dispose())
    if (config.completionMode === 'remind') disposers.push(ctx.on('agent/turn-stopping', event => managed.remind(event)))
    disposers.push(() => { lifetime.abort(); catalog.dispose(); sessionRuns.clear() })
```

</details>

**依据 3 · 源码核查**：[lib/managed.js:16-43](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/managed.js#L16-L43)

绑定。

<details>
<summary>查看原文（28行）</summary>

```text
export function createManagedService(options = {}) {
  const statusService = options.statusService ?? createStatusService(options)
  const bindings = new Map(), reminders = new Set(), inFlight = new Set()
  let active = true
  const key = (session, task) => JSON.stringify([session, task])
  const denied = (code, status = null) => ({ schema_version: 'ManagedGateV1', accepted: false, reason_code: code, status })
  const inputs = args => {
    if (!args || typeof args !== 'object' || !TASK.test(args.task_id) || !args.run_id) return false
    try { validRunId(args.run_id); return true } catch { return false }
  }
  return {
    async bind(args, execution) {
      const session = sessionIdentity(execution)
      if (!active || !session || execution?.signal?.aborted) return denied('SESSION_REQUIRED_OR_CANCELLED')
      if (!inputs(args) || Object.keys(args).some(k => !['task_id', 'run_id', 'faith', 'ctx', 'baseline_run_id'].includes(k))) return denied('INVALID_BIND_ARGUMENT')
      const id = key(session, args.task_id)
      if (bindings.has(id)) return denied('TASK_ALREADY_BOUND')
      const { task_id, ...policy } = args
      const status = await statusService.status(policy, { signal: execution.signal })
      if (['builtin-threshold-v1', 'builtin-threshold-v2'].includes(status.engine?.id)) return denied('BUILTIN_MANAGED_UNSUPPORTED', status)
      if (!active || execution.signal?.aborted) return denied('CANCELLED', status)
      if (status.integrity !== 'VALID' || status.freshness !== 'FRESH') return denied('RECEIPT_NOT_CURRENT', status)
      if (bindings.has(id)) return denied('TASK_ALREADY_BOUND', status)
      if (bindings.size >= 256) return denied('BINDING_LIMIT', status)
      bindings.set(id, { session, task_id, run_id: args.run_id, policy, scope: status.scope_digest, complete: false })
      return { schema_version: 'ManagedGateV1', accepted: true, reason_code: 'BOUND', status }
    },
    async complete(args, execution) {
```

</details>

**依据 4 · 源码核查**：[lib/managed.js:55-91](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/managed.js#L55-L91)

重查完成与提醒。

<details>
<summary>查看原文（37行）</summary>

```text
      }
      if (binding.complete || inFlight.has(id)) return denied('ALREADY_COMPLETED_OR_IN_FLIGHT')
      inFlight.add(id)
      try {
        const status = await statusService.status(binding.policy, { signal: execution.signal })
        if (['builtin-threshold-v1', 'builtin-threshold-v2'].includes(status.engine?.id)) return denied('BUILTIN_MANAGED_UNSUPPORTED', status)
        if (!active || execution.signal?.aborted) return denied('CANCELLED', status)
        if (status.current_verdict !== 'PASS' || status.gate_passed !== true || status.freshness !== 'FRESH' || status.integrity !== 'VALID' || status.scope_digest !== binding.scope) return denied('CURRENT_PASS_REQUIRED', status)
        // Commit only after another real check, never after an optimistic client response.
        const final = await statusService.status(binding.policy, { signal: execution.signal })
        if (!active || execution.signal?.aborted || final.current_verdict !== 'PASS' || final.scope_digest !== binding.scope || final.integrity !== 'VALID' || final.freshness !== 'FRESH') return denied('FINAL_CHECK_FAILED', final)
        try {
          const root = storePaths(options, true).stateRoot, directory = path.join(root, 'completions')
          fs.mkdirSync(directory, { recursive: true })
          if (fs.lstatSync(directory).isSymbolicLink()) throw new Error('completion path redirected')
          const filename = path.join(directory, randomUUID() + '.json')
          fs.writeFileSync(filename, JSON.stringify({ schema_version: 'ManagedCompletionV1', session_id: session, task_id: args.task_id, run_id: args.run_id, scope_digest: binding.scope, checked_at_utc: final.checked_at_utc, completed_at_utc: new Date().toISOString() }) + '\n', { flag: 'wx', mode: 0o600 })
        } catch { return denied('COMPLETION_WRITE_FAILED', final) }
        binding.complete = true
        return { schema_version: 'ManagedGateV1', accepted: true, reason_code: 'COMPLETED', status: final }
      } finally { inFlight.delete(id) }
    },
    async remind(event) {
      const session = sessionIdentity(event), turn = event?.turn
      if (!active || !session || !Number.isSafeInteger(turn) || turn < 0 || event?.signal?.aborted || typeof event.agent?.steer !== 'function') return false
      const pending = [...bindings.values()].find(b => b.session === session && !b.complete)
      if (!pending) return false
      // One reminder per session/turn AND per bound task/scope prevents steer recursion.
      const turnKey = key(session, `turn:${turn}`), scopeKey = key(session, `${pending.task_id}:${pending.scope}`)
      if (reminders.has(turnKey) || reminders.has(scopeKey) || reminders.size >= 512) return false
      reminders.add(turnKey); reminders.add(scopeKey)
      try {
        event.agent.steer({ id: randomUUID(), role: 'user', source: { kind: 'veriscope-gate-reminder', form: 'notice', summary: `受管任务 ${pending.task_id} 待完成` }, content: [{ type: 'text', text: `受管任务 ${pending.task_id} 尚未完成。请检查当前回执，再调用 veriscope_gate_complete；待复核和失败均不能登记完成。此消息仅为提醒。` }] })
        return true
      } catch { return false }
    },
    dispose() { active = false; bindings.clear(); reminders.clear(); inFlight.clear() },
```

</details>

**依据 5 · 源码核查**：[lib/bridge.js:2-24](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/bridge.js#L2-L24)

本地来源与关联。

<details>
<summary>查看原文（23行）</summary>

```text
export function registerStatusBridge(ctx, statusService, sessionRuns) {
  const server = ctx.get('webServer')
  if (!server?.register) return () => {}
  return server.register({ kind: 'exact', path: '/veriscope/status', async handler(req, res) {
    const send = (code, value) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)) }
    if (req.method !== 'POST') { send(405, { error: '仅支持重新检查' }); return }
    const origin = req.headers.origin, expected = `${server.protocol}//${req.headers.host}`
    let localOrigin = false
    try { localOrigin = ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(origin).hostname) } catch {}
    if (!localOrigin || origin !== expected || !/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '') || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) { send(403, { error: '来源或请求类型无效' }); return }
    let body = '', size = 0
    try {
      for await (const chunk of req) { size += chunk.length; if (size > 4096) { send(413, { error: '请求过大' }); return } body += chunk.toString('utf8') }
      const args = JSON.parse(body)
      if (!args || Object.keys(args).some(k => !['session_id', 'run_id', 'policy'].includes(k)) || !sessionRuns.get(args.session_id)?.has(args.run_id)) { send(403, { error: '本会话没有此运行记录，请先调用状态工具' }); return }
      const policy = Object.hasOwn(args, 'policy') ? args.policy : {}
      if (!policy || typeof policy !== 'object' || Array.isArray(policy) || Object.keys(policy).some(k => !['faith', 'ctx', 'baseline_run_id'].includes(k)) ||
        ['faith', 'ctx'].some(k => Object.hasOwn(policy, k) && (typeof policy[k] !== 'number' || !Number.isFinite(policy[k]) || policy[k] < 0 || policy[k] > 1)) ||
        (Object.hasOwn(policy, 'baseline_run_id') && policy.baseline_run_id !== null && (typeof policy.baseline_run_id !== 'string' || policy.baseline_run_id.length !== 36 || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(policy.baseline_run_id)))) { send(400, { error: '门禁策略无效，请使用状态工具核实' }); return }
      send(200, await statusService.status({ ...policy, run_id: args.run_id }))
    } catch { if (!res.writableEnded) send(400, { error: '重新检查失败，请使用状态工具' }) }
  } })
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 运行成本和测试证据有什么实际限制？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

门禁不再调用评分模型，首次主要成本是准备完整逐条分数、明确单位/方向/均值与逐行阈值、持久状态及备份；replay另需对齐上游/Python环境。持续builtin最多十万行百规则、同步读取/数字词元与精确运算有CPU/内存成本，边界校验避免无限自由输入但最大规模延迟未量化。每次保存输入副本/报告/回执，历史默认无限保留，资料含原评分/路径可能敏感，需自己的磁盘保留策略。

replay进程收stdout/stderr有字节上限、timeout与abort均kill直接child，完成promise等close；没有额外强杀升级或进程树回收，忽略终止/派生孙进程时不宜宣称绝对有界停止。失败保留recording-error与原材料，不因附加异常掩盖已知FAIL是积极设计。测试涉及小数边界、缺失、篡改和managed等，当前只读代表逻辑，未运行；作者的远端/宿主记录仍是作者报告。恢复要区分原始判定、回执是否发布、当前scope失效和记录错误，不能只重试到PASS。

#### 证据与依据

**依据 1 · 源码核查**：[lib/process.js:4-39](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/process.js#L4-L39)

进程限制与close。

<details>
<summary>查看原文（36行）</summary>

```text
export function runBoundedProcess(executable, args, { cwd, signal, timeoutMs = LIMITS.timeoutMs, outputBytes = LIMITS.outputBytes, env = process.env } = {}) {
  return new Promise(resolve => {
    const start = performance.now()
    const chunks = { stdout: [], stderr: [] }
    const lengths = { stdout: 0, stderr: 0 }
    let child, timer, reason = null, error = null, settled = false
    const stop = value => { if (!reason) reason = value; child?.kill() }
    const abort = () => stop('cancelled')
    const done = (code, terminationSignal) => {
      if (settled) return
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort)
      resolve({
        code, signal: terminationSignal, reason, error,
        stdout: Buffer.concat(chunks.stdout).toString('utf8'), stderr: Buffer.concat(chunks.stderr).toString('utf8'),
        elapsed_ms: performance.now() - start, stdout_bytes: lengths.stdout, stderr_bytes: lengths.stderr,
      })
    }
    if (signal?.aborted) { reason = 'cancelled'; done(null, null); return }
    try {
      child = spawn(executable, args, { cwd, env: { ...env, PYTHONUTF8: '1', PYTHONDONTWRITEBYTECODE: '1', PYTHON_DOTENV_DISABLED: '1' }, shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (caught) { reason = 'spawn_error'; error = caught.code ?? 'SPAWN_ERROR'; done(null, null); return }
    for (const stream of ['stdout', 'stderr']) {
      child[stream].on('data', data => {
        const remaining = Math.max(0, outputBytes - lengths[stream])
        if (remaining) chunks[stream].push(data.subarray(0, remaining))
        lengths[stream] += data.length
        if (lengths[stream] > outputBytes) stop('output_limit')
      })
    }
    child.on('error', caught => { error = caught.code ?? 'SPAWN_ERROR'; reason ??= 'spawn_error' })
    child.on('close', (code, terminationSignal) => done(code, terminationSignal))
    signal?.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => stop('timeout'), timeoutMs)
    timer.unref?.()
  })
}
```

</details>

**依据 2 · 源码核查**：[lib/builtin.js:57-69](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin.js#L57-L69)

失败留痕。

<details>
<summary>查看原文（13行）</summary>

```text
      // report.json is the immutable judgment core. Post-publication recording
      // metadata is returned separately, avoiding a receipt/report hash cycle.
      fs.writeFileSync(path.join(directory, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
      writeBuiltinReceipt(directory, report, captured.scope)
      recording.receipt_available = true; recording.eligible_at_recording = report.status === 'PASS'
    } catch (error) {
      report.execution.errors.push({ code: errorCode(error), message: error instanceof ReviewError ? error.message : '本地检查或留痕失败；请核查来源、状态目录与权限。',
        ...(error instanceof ReviewError && error.diagnostic ? { diagnostic: error.diagnostic } : {}) })
      if (report.status !== 'FAIL') { report.status = 'REVIEW'; report.gate_passed = null }
      report.execution.elapsed_ms = performance.now() - started
      if (directory) {
        // Never overwrite a report, receipt, source snapshot, or earlier error.
        try { fs.writeFileSync(path.join(directory, 'recording-error.json'), JSON.stringify({ ...report, recording }, null, 2) + '\n', { flag: 'wx', mode: 0o600 }) } catch { /* original failure remains in the returned diagnostic */ }
```

</details>

**依据 3 · 源码核查**：[lib/builtin-rules.js:4-9](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin-rules.js#L4-L9)

规模上限。

```text
export const BUILTIN_ENGINE = Object.freeze({ id: 'builtin-threshold-v1', version: '1.0.0' })
export const BUILTIN_ENGINE_V2 = Object.freeze({ id: 'builtin-threshold-v2', version: '2.0.0' })
export const isBuiltinEngine = engine => [BUILTIN_ENGINE, BUILTIN_ENGINE_V2].some(e => engine?.id === e.id && engine.version === e.version)
export const engineForPolicy = policy => policy.schema_version === 'GatePolicyV2' ? BUILTIN_ENGINE_V2 : BUILTIN_ENGINE
export const BUILTIN_FORMATS = Object.freeze(['gate-archive-v1', 'ragas-records-v1'])
export const BUILTIN_LIMITS = Object.freeze({ rows: 100_000, rules: 100, issues: 20 })
```

**依据 4 · 作者声明**：[README.md:25-25](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/README.md#L25-L25)

完整状态备份。

```text
> **升级提示（0.4.0 起）**：旧回执的当前有效性将进入 REVIEW，历史 PASS／FAIL 不会改写。升级前请备份完整状态目录及原归档，并使用插件外的持久状态目录；包内 `.local` 可能随重装丢失，单独导出回执不是完整备份。ReceiptV1 重新 replay，ReceiptV2 重新 check，取得新版回执。
```

**依据 5 · 作者声明**：[README.md:52-56](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/README.md#L52-L56)

无限保留与作者验证声称。

```text
- B2 使用 ReceiptV2，首版只有文本，不接入 bind／complete；DSH 导出支持 JSON／Markdown，B2 暂不支持 share。回执仍无限保留，不自动清理。

**均值通过，仍可看到最差一条。** 每指标显示最差有效行及未达均值阈值的条数；诊断本身不改裁决。需要逐条拦截时，用 `GatePolicyV2` 加 `row_threshold`，沿用该指标的方向和单位。例如构造分数的均值为 0.81、其中一条为 0.41：只查均值可 PASS，显式要求每条 ≥0.5 才 FAIL。V2 使用 JSON 原数字词元作精确十进制比较；V1 原浮点判定保持不变。

规范、策略和导出方式见包内 `docs/B2.md`、`schemas/`、`examples/builtin/`。样例为文档构造，非真实评测。0.6.0 已发布至 npm；Windows 与 Ubuntu 远端 CI（含固定上游真实回放）均已验证，Claude 完整结构化错误交付仍待验。0.5.0 历史验收保留在 `docs/acceptance-b2-v0.5.0.json`。
```

**依据 6 · 源码核查**：[tests/row-threshold.test.js:1-35](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/tests/row-threshold.test.js#L1-L35)

代表测试夹具入口。

<details>
<summary>查看原文（35行）</summary>

```text
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { temporary } from './helpers.js'
import { createBuiltinService, renderBuiltinReport } from '../lib/builtin.js'
import { createStatusService, readRecord } from '../lib/status.js'
import { createManagedService } from '../lib/managed.js'
import { createExportService } from '../lib/export.js'
import { validToolArguments } from '../lib/mcp.js'

const repo = fileURLToPath(new URL('../', import.meta.url))
function fixture(t, tokens, { version = 'GatePolicyV2', threshold = '0.8', row, operator = 'gte', range, metric = 'quality', ragas = false } = {}) {
  const root = temporary(t), input = path.join(root, 'scores.json'), policy = path.join(root, 'policy.json')
  const key = JSON.stringify(metric)
  const scores = tokens.map((token, i) => ragas ? `{${key}:${token}}` : `{"id":"row-${i+1}","scores":{${key}:${token}}}`)
  fs.writeFileSync(input, ragas ? `[${scores.join(',')}]` : `{"schema_version":"GateArchiveV1","source":{"producer":"constructed-test"},"rows":[${scores.join(',')}]}`)
  fs.writeFileSync(policy, `{"schema_version":"${version}","aggregation":"mean","population":"all_provided_rows","rules":[{"metric":${key},"unit":"test","operator":"${operator}","threshold":${threshold}${row === undefined ? '' : ',"row_threshold":'+row}${range ? ',"range":'+range : ''}}]}`)
  const options = { env: { VERISCOPE_STATE_DIR: path.join(root, 'state') } }
  const args = { archive_path: input, policy_path: policy, ...(ragas ? { format: 'ragas-records-v1' } : {}) }
  return { root, args, options, service: createBuiltinService(options), statuses: createStatusService(options) }
}
async function run(t, tokens, options) { const f = fixture(t, tokens, options); const report = await f.service.check(f.args); return { ...f, report, metric: report.metrics[0] } }

test('V1 mean PASS exposes a low row diagnostically without silently changing its verdict', async t => {
  const { report, metric } = await run(t, ['.92','.41','.95','.87','.9'].map(v => '0'+v), { version: 'GatePolicyV1' })
  assert.equal(report.status, 'PASS'); assert.equal(report.engine.id, 'builtin-threshold-v1')
  assert.equal(metric.diagnostics.worst.row_id, 'row-2'); assert.equal(metric.diagnostics.worst.value, .41)
  assert.equal(metric.diagnostics.outside_mean_threshold_count, 1); assert.equal(metric.diagnostics.affects_verdict, false)
})

for (const version of ['GatePolicyV1','GatePolicyV2']) test(`decimal boundary explicitly versioned: ${version}`, async t => {
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样采用，继续探讨什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有可靠评分、愿意显式定义策略的可信本地维护者可试用builtin，先以构造边界/缺失反例核阈值语义并保存状态目录；PASS只作输入范围内阈值符合，发布仍由读者负责。replay适合已固定上游/环境的流程，先读doctor与status范围，不能把旧历史PASS或就绪环境直接当可发布。多用户不可信状态目录、要求抗整体篡改、公正评分证明或自动执行发布，应另建边界。

进一步可研究把评测输入生成清单/删样本计数和评测器版本加入独立签名来源，区别“所有提供行”和真实评测总体；运行采用进程组与强杀升级，结合独立状态存储/受管操作ID恢复。基线为本地摘要、直接child kill和内存bindings，反例含导出前删除失败样本、单位换口径、整体重写状态、status后改输入、忽略终止/孙进程和重启后complete。比较错误放行、复核可解释性、停止耗时及维护/恢复工时；外部真实性提升假设尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/builtin.js:11-17](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin.js#L11-L17)

提供行与可信记录边界。

```text
export const BUILTIN_LIMITATIONS = Object.freeze([
  '只消费已有评分，检查全部输入记录的等权均值及显式逐条阈值；诊断提示本身不改裁决，不评分、不调用模型。',
  '无法发现导出前已删除的记录；完整性仅针对所提供的输入，不证明原评测全量完整。',
  '来源和单位为提供方声明，不证明评分或回答事实正确，也不等同原 VeriScope 正样本门禁。',
  '回执仅检测可信本地记录的变化；不抵御能整体重写状态根的用户。',
  'B2 不用于 bind/complete，不授权发布；当前有效性须另查 status。',
])
```

**依据 2 · 源码核查**：[lib/status.js:12-16](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/status.js#L12-L16)

绑定时间范围。

```text
export const STATUS_LIMITATIONS = [
  '仅确认查询时所列绑定项；未封存全部传递依赖和操作系统，检查后仍可能变化。',
  '摘要用于可信本地记录的变化检测，不提供外部签名或抗整体恶意重写保证。',
  '不重新评分或调用评测模型；普通聊天与外部发布不受此完成入口控制。',
]
```

**依据 3 · 源码核查**：[lib/process.js:4-39](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/process.js#L4-L39)

直接子进程。

<details>
<summary>查看原文（36行）</summary>

```text
export function runBoundedProcess(executable, args, { cwd, signal, timeoutMs = LIMITS.timeoutMs, outputBytes = LIMITS.outputBytes, env = process.env } = {}) {
  return new Promise(resolve => {
    const start = performance.now()
    const chunks = { stdout: [], stderr: [] }
    const lengths = { stdout: 0, stderr: 0 }
    let child, timer, reason = null, error = null, settled = false
    const stop = value => { if (!reason) reason = value; child?.kill() }
    const abort = () => stop('cancelled')
    const done = (code, terminationSignal) => {
      if (settled) return
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort)
      resolve({
        code, signal: terminationSignal, reason, error,
        stdout: Buffer.concat(chunks.stdout).toString('utf8'), stderr: Buffer.concat(chunks.stderr).toString('utf8'),
        elapsed_ms: performance.now() - start, stdout_bytes: lengths.stdout, stderr_bytes: lengths.stderr,
      })
    }
    if (signal?.aborted) { reason = 'cancelled'; done(null, null); return }
    try {
      child = spawn(executable, args, { cwd, env: { ...env, PYTHONUTF8: '1', PYTHONDONTWRITEBYTECODE: '1', PYTHON_DOTENV_DISABLED: '1' }, shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (caught) { reason = 'spawn_error'; error = caught.code ?? 'SPAWN_ERROR'; done(null, null); return }
    for (const stream of ['stdout', 'stderr']) {
      child[stream].on('data', data => {
        const remaining = Math.max(0, outputBytes - lengths[stream])
        if (remaining) chunks[stream].push(data.subarray(0, remaining))
        lengths[stream] += data.length
        if (lengths[stream] > outputBytes) stop('output_limit')
      })
    }
    child.on('error', caught => { error = caught.code ?? 'SPAWN_ERROR'; reason ??= 'spawn_error' })
    child.on('close', (code, terminationSignal) => done(code, terminationSignal))
    signal?.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => stop('timeout'), timeoutMs)
    timer.unref?.()
  })
}
```

</details>

**依据 4 · 源码核查**：[lib/managed.js:16-20](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/managed.js#L16-L20)

内存绑定。

```text
export function createManagedService(options = {}) {
  const statusService = options.statusService ?? createStatusService(options)
  const bindings = new Map(), reminders = new Set(), inFlight = new Set()
  let active = true
  const key = (session, task) => JSON.stringify([session, task])
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
