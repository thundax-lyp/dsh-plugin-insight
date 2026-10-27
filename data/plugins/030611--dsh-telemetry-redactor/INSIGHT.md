# dsh-telemetry-redactor

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[811b0b1](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,162](https://img.shields.io/static/v1?label=npm+30d&message=1%2C162&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-telemetry-redactor)
<!-- END META -->

> **实现功能**：在DSH遥测记录导出副本中替换受支持的敏感键和凭据模式，保留原始会话日志。

> **核心亮点**：在后端收到记录前统一处理出站副本，保留原始事件，并用结构键、计数器例外及键冲突拒绝补足纯正则过滤。贡献是宿主边界内的安全组合，不是新秘密识别算法。详见[Q02](#research-q02)。

> **风险与缺陷**：局部过滤不能证明全局无泄漏，未知凭据、输入外配置、直接backend调用和更外层prepend均不受完全保护；fail-closed还依赖官方协调器只丢弃失败副本。以上为源码及作者边界，未独立复现。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要仅脱敏出站副本，怎样判定机制合格？](#detail-section-11)
  - [Q02 · 相对后端过滤有哪些增量，哪些缺陷会使承诺不成立？](#detail-section-12)
  - [Q03 · 安装、生效和退出分别依赖什么？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复的成本和效果能判断到哪里？](#detail-section-14)
  - [Q05 · 哪些工程设计值得复用，由此能推导什么新方向？](#detail-section-15)
  - [Q06 · 谁适合受控试用，何时必须停止依赖？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给已有遥测共享需求的维护者减少特定凭据进入后端的机会，验收同时核对副本过滤、canonical保留与计数器完整。

可在各后端单独过滤，也可停止共享和最小化采集。本插件集中处理官方waterfall副本，不替代后端访问治理，更不应修改canonical来换取表面无秘密。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 敏感键整值替换 | 移除命名明确的凭据字段 | enumerable字符串键，计数器有例外 |
| 固定字符串模式过滤 | 处理正文和错误中的已知凭据样式 | 未知、编码或短样式可能通过 |
| 异常结构拒绝 | 避免访问器、循环及键碰撞输出 | 丢弃副本依赖官方协调器 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19.0或>=24 | 启动必需 | 运行编译ESM入口 | 需先满足包运行条件 |
| Cordis ^4.0.1 | 启动必需 | 插件及waterfall组合 | 不承诺其他语义的dispatcher兼容 |
| dsh-session-telemetry >=0.1.0-rc.5且<0.2.0 | 生效必需 | 官方记录与异常包含契约 | 不得推定fail-closed |
| 已授权遥测后端与实际事件 | 价值兑现必需 | 存在需要过滤的出站副本 | 插件不会主动启用后端 |
| 全部外层监听器核查 | 安全敏感部署必需 | 防止过滤后再添加敏感值 | 仅有该插件不足证明最终副本安全 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者确认后端共享授权、版本和监听器 | 输入与实际导出路径符合边界 |
| 加载 | 安装固定包，检查resolved配置中的插入行 | replacement合法、fiber加载不报错 |
| 使用 | 用合成凭据事件核对受支持字段 | 后端副本被替换而canonical保持 |
| 失败/退出 | 排查拒绝记录与监听器，按宿主禁用规则 | 恢复原后端路径时重新评估共享风险 |

卸载后的遥测不再经过此过滤，退出不能被理解为更安全。源码用ctx.on注册，资源释放语义由Cordis生命周期负责；本轮未运行该生命周期。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包、宿主和配置审计资源，金额未知 | 字段盘点、版本与监听器核查 | 不需要新增模型API，但审计人时未知 |
| 持续使用 | 同步CPU、新对象与字符串分配 | 跟踪漏检、误删及被拒绝记录 | 没有吞吐、尾延迟或真实事件大小分布 |
| 失败恢复 | 丢弃副本造成观测空洞，重采资源未知 | 区分异常与真实缺失，修正输入或规则 | 不应从canonical重发时再次泄露 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 支持模式过滤 | 键和字符串规则可核查 | 组织真实秘密的召回与误删 |
| 保留输入事实 | 递归新建对象，不就地改原值 | 所有导出路径是否遵守协调器副本契约 |
| 异常拒绝 | 本插件抛异常，作者集成测试定义包含行为 | 实际部署的记录丢弃及告警可见性 |

收益是减少特定凭据进入后端的机会，不能估算为事故避免金额。完整性损失、失败排查和敏感数据最小采集仍是部署方成本。

> **思考**：局部过滤不能证明全局无泄漏，未知凭据、输入外配置、直接backend调用和更外层prepend均不受完全保护；fail-closed还依赖官方协调器只丢弃失败副本。以上为源码及作者边界，未独立复现。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在后端收到记录前统一处理出站副本，保留原始事件，并用结构键、计数器例外及键冲突拒绝补足纯正则过滤。贡献是宿主边界内的安全组合，不是新秘密识别算法。详见[Q02](#research-q02)。

在后端收到记录前统一处理出站副本，保留原始事件，并用结构键、计数器例外及键冲突拒绝补足纯正则过滤。贡献是宿主边界内的安全组合，不是新秘密识别算法。详见[Q02](#research-q02)。

可借鉴的是用descriptor读取数据属性，拒绝getter和非普通对象，避免过滤过程隐式执行普通访问器；用ancestors集合只检测当前递归链，允许同一对象在不同分支重复出现；键脱敏后先检查冲突，避免静默覆盖改变记录含义。这些是“宁可拒绝副本也不输出歧义结构”的可靠性取舍，不能推广成恶意Proxy沙箱，反射本身可能触发trap。

<a id="detail-section-5"></a>

### 1.4 主要限制

局部过滤不能证明全局无泄漏，未知凭据、输入外配置、直接backend调用和更外层prepend均不受完全保护；fail-closed还依赖官方协调器只丢弃失败副本。以上为源码及作者边界，未独立复现。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有遥测需求且可审计监听器顺序的维护者可小范围试用，先用合成凭据核对后端副本、canonical与拒绝记录；不能借此主动扩大共享，遇绕过或无法发现的误删就停止依赖。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的结构化出站副本过滤与宿主waterfall组合，广泛防泄漏效果未证明；隐私安全丢弃收据是未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、SECURITY.md、SECRET-MATRIX.md、cordis.patch.yml、tests/loader-composition.spec.ts、tests/adversarial.spec.ts、scripts/performance-smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定版本入口、配置、矩阵、安全说明及测试/性能定义；不执行目标代码与宿主冒烟，作者验证仅作为作者声明。
- 下一步：进一步探讨可从合成支持/未知凭据与外层监听器夹具入手，核对后端最终值、原始事件、丢弃可见性和宽对象资源开销。

**分析版本**

- **仓库**：[030611/dsh-telemetry-redactor](https://github.com/030611/dsh-telemetry-redactor)
- **版本号**：0.1.0（[固定提交 811b0b1](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨只含聚合原因的隐私安全丢弃收据，让过滤异常可观察而不带出原秘密；需核对收据自身泄漏和新增开销，尚未验证。详见[Q05](#research-q05)。

进一步探讨可从合成支持/未知凭据与外层监听器夹具入手，核对后端最终值、原始事件、丢弃可见性和宽对象资源开销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 393 | — | — | 4906 |
| .mjs | source | 4 | 110 | 102 | 0 | — |
| .ts | source | 4 | 313 | 273 | 15 | — |
| .ts | test | 3 | 408 | 363 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+created%3A2026-09-22T04%3A44%3A45.563Z..2026-10-22T04%3A44%3A45.563Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/030611/dsh-telemetry-redactor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A44%3A45.563Z..2026-10-22T04%3A44%3A45.563Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查出站遥测副本脱敏的机制、宿主组合边界、成本与适合的采用方式。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要仅脱敏出站副本，怎样判定机制合格？

**研究主题**：场景与需求、功能与机制

#### 完整回答

对象是已经明确选择遥测后端、又希望减少会话事件凭据外泄的部署维护者。输入是官方session-telemetry/record瀑布返回的JSON形态记录，输出是新构造的过滤记录。合格任务不只是看见[REDACTED]，还需受支持凭据不可达后端、原始会话事件保留、非敏感计数器不被破坏。未启用遥测的人不因此需要主动开启共享。

插件prepend注册监听器，先next()取得内部规则的最终记录，再递归构造数组或普通对象。键名经驼峰和分隔符切词，高风险键整值替换；token计量白名单避免把使用量字段误删。字符串按Bearer/Basic、sk、GitHub、Slack、JWT样式及具名赋值正则替换，凭据形态键名也会改写。源码没有文件或网络写入，保存canonical日志的保证仍来自宿主先深拷贝的契约，不能单靠本插件确认整个系统无泄露。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-23](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/README.md#L13-L23)

作者定义出站副本、官方协调器和原日志边界。

<details>
<summary>查看原文（11行）</summary>

````text
**Redact supported credential patterns from outbound telemetry copies before configured backends receive them—without rewriting canonical session logs.**

```sh
dsh plugin --profile web add dsh-telemetry-redactor
```

> Community-maintained and not an official DeepSeek project. Related trust-layer plugins: [Verification Receipt](https://github.com/030611/dsh-verification-receipt), [Evidence Audit](https://github.com/030611/qiushi-dsh-evidence-audit), and [Context Provenance](https://github.com/030611/dsh-context-provenance).

`dsh-telemetry-redactor` is a minimal DeepSeek Harness Profile Bundle that redacts sensitive values from session telemetry before a backend receives them. It mounts on the official `session-telemetry/record` waterfall, calls `next()` so other deployment rules still compose, and returns a new recursively redacted record.

The official telemetry coordinator deep-copies canonical session events before this waterfall and contains thrown rules per record. Therefore this plugin changes only the outbound copy: it never rewrites the canonical session log. In this document, **fail-closed means only that this coordinator withholds one failing export copy** and continues the agent loop. It is not a claim that every telemetry path or listener order is impossible to bypass.
````

</details>

**依据 2 · 源码核查**：[src/index.ts:68-98](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L68-L98)

键名分词、计数器例外和固定字符串规则。

<details>
<summary>查看原文（31行）</summary>

```text
function keyWords(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function isSensitiveKey(key: string): boolean {
  const words = keyWords(key)
  const compact = words.join('')
  if (TOKEN_METRIC_KEYS.has(compact)) return false
  if (SENSITIVE_COMPACT_KEYS.has(compact)) return true
  if (words.some(word => SENSITIVE_WORDS.has(word))) return true
  return words.some((word, index) =>
    (word === 'api' || word === 'private') && words[index + 1] === 'key')
}

function redactString(value: string, replacement: string): string {
  return value
    .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, (_match, scheme: string) => `${scheme} ${replacement}`)
    .replace(/\bsk-[A-Za-z0-9_-]{8,}/g, replacement)
    .replace(/\bgh(?:p|o|u|s|r)_[A-Za-z0-9]{20,}/g, replacement)
    .replace(/\bgithub_pat_[A-Za-z0-9_]{20,}/g, replacement)
    .replace(/\bxox(?:a|b|p|r|s)-[A-Za-z0-9-]{10,}/g, replacement)
    .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, replacement)
    .replace(
      /((?:access|refresh|id)[_-]?token|api[_-]?key|client[_-]?secret|password|secret|token)(\s*[=:]\s*)([^\s&;,"']+)/gi,
      (_match, label: string, separator: string) => `${label}${separator}${replacement}`,
    )
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:100-152](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L100-L152)

递归新建输出与键名改写。

<details>
<summary>查看原文（53行）</summary>

```text
function redactValue(
  value: unknown,
  replacement: string,
  ancestors: WeakSet<object>,
  depth: number,
): unknown {
  if (depth > MAX_NESTING_DEPTH) {
    throw new Error(`telemetry-redactor: record exceeds maximum nesting depth ${MAX_NESTING_DEPTH}`)
  }
  if (typeof value === 'string') return redactString(value, replacement)
  if (value === null || typeof value !== 'object') return value
  if (ancestors.has(value)) throw new Error('telemetry-redactor: record contains a cycle')

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      const descriptors = Object.getOwnPropertyDescriptors(value) as Record<string, PropertyDescriptor>
      const length = descriptors['length']?.value
      if (typeof length !== 'number') throw new Error('telemetry-redactor: invalid array length descriptor')
      const output = new Array<unknown>(length)
      for (let index = 0; index < length; index += 1) {
        const descriptor = descriptors[String(index)]
        if (descriptor === undefined) continue
        if (!('value' in descriptor)) {
          throw new Error('telemetry-redactor: accessor properties are unsupported')
        }
        output[index] = redactValue(descriptor.value, replacement, ancestors, depth + 1)
      }
      return output
    }
    const prototype = Object.getPrototypeOf(value)
    if (prototype !== Object.prototype && prototype !== null) {
      throw new Error('telemetry-redactor: only arrays and plain objects are supported')
    }

    const output: [string, unknown][] = []
    const outputKeys = new Set<string>()
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
      if (!descriptor.enumerable) continue
      if (!('value' in descriptor)) {
        throw new Error('telemetry-redactor: accessor properties are unsupported')
      }
      const redactedKey = redactString(key, replacement)
      if (outputKeys.has(redactedKey)) {
        throw new Error('telemetry-redactor: redacted key collision')
      }
      outputKeys.add(redactedKey)
      output.push([
        redactedKey,
        isSensitiveKey(key) ? replacement : redactValue(descriptor.value, replacement, ancestors, depth + 1),
      ])
    }
    return Object.fromEntries(output)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:169-180](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L169-L180)

next后的记录过滤与prepend注册。

<details>
<summary>查看原文（12行）</summary>

```text
function redactRecord(record: SessionTelemetryRecord, replacement: string): SessionTelemetryRecord {
  return redactValue(record, replacement, new WeakSet(), 0) as SessionTelemetryRecord
}

/**
 * Mount the telemetry export rule.
 * @param ctx - Cordis context that owns the telemetry waterfall.
 * @param config - validated redactor configuration.
 */
export function apply(ctx: Context, config: Config = {}): void {
  const replacement = resolveReplacement(config)
  ctx.on('session-telemetry/record', (_record, next) => redactRecord(next(), replacement), { prepend: true })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对后端过滤有哪些增量，哪些缺陷会使承诺不成立？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是将过滤前移到官方遥测record瀑布，在记录交给所选后端之前统一处理，而不是要求每个collector各自部署规则。与直接重写日志相比，它保留canonical事件供本地追溯；与单纯对整段字符串做正则相比，它加入结构键语义、普通对象检查、循环与深度拒绝，以及脱敏键冲突拒绝。成熟正则和递归不属新算法，价值来自边界明确的宿主组合。

最关键质疑是这种局部过滤能否被误读成全局防泄漏。未标记的随机密钥、编码值、短Bearer和无关字段中的Cookie可能通过；provider/exporter配置根本不在输入中。prepend包裹普通规则，但更外层的prepend监听器仍可在本插件返回后添加秘密，直接backend.emit也会绕开。发生深度、访问器或冲突异常时，本插件只抛出；“丢弃该副本并不中断agent”的行为依赖官方协调器。丢弃减少泄漏风险也损失观测完整性，应纳入运维取舍。上述机制和反例由源码及作者安全说明支持，未独立复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:106-149](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L106-L149)

拒绝超深、循环、访问器、非普通对象和键冲突。

<details>
<summary>查看原文（44行）</summary>

```text
  if (depth > MAX_NESTING_DEPTH) {
    throw new Error(`telemetry-redactor: record exceeds maximum nesting depth ${MAX_NESTING_DEPTH}`)
  }
  if (typeof value === 'string') return redactString(value, replacement)
  if (value === null || typeof value !== 'object') return value
  if (ancestors.has(value)) throw new Error('telemetry-redactor: record contains a cycle')

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      const descriptors = Object.getOwnPropertyDescriptors(value) as Record<string, PropertyDescriptor>
      const length = descriptors['length']?.value
      if (typeof length !== 'number') throw new Error('telemetry-redactor: invalid array length descriptor')
      const output = new Array<unknown>(length)
      for (let index = 0; index < length; index += 1) {
        const descriptor = descriptors[String(index)]
        if (descriptor === undefined) continue
        if (!('value' in descriptor)) {
          throw new Error('telemetry-redactor: accessor properties are unsupported')
        }
        output[index] = redactValue(descriptor.value, replacement, ancestors, depth + 1)
      }
      return output
    }
    const prototype = Object.getPrototypeOf(value)
    if (prototype !== Object.prototype && prototype !== null) {
      throw new Error('telemetry-redactor: only arrays and plain objects are supported')
    }

    const output: [string, unknown][] = []
    const outputKeys = new Set<string>()
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
      if (!descriptor.enumerable) continue
      if (!('value' in descriptor)) {
        throw new Error('telemetry-redactor: accessor properties are unsupported')
      }
      const redactedKey = redactString(key, replacement)
      if (outputKeys.has(redactedKey)) {
        throw new Error('telemetry-redactor: redacted key collision')
      }
      outputKeys.add(redactedKey)
      output.push([
        redactedKey,
        isSensitiveKey(key) ? replacement : redactValue(descriptor.value, replacement, ancestors, depth + 1),
```

</details>

**依据 2 · 作者声明**：[SECURITY.md:5-17](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/SECURITY.md#L5-L17)

作者限定fail-closed、外层监听器及输入范围。

<details>
<summary>查看原文（13行）</summary>

```text
The plugin transforms only the record returned by the official `session-telemetry/record` waterfall. It does not read or write files, open network connections, register model-facing capabilities, change backend sharing policy, or mutate the canonical session log.

Here, “fail-closed” has one narrow meaning: when mounted through the official `SessionTelemetryCoordinator`, a thrown rule is contained and that single export copy is not handed to that coordinator's backend. It does not mean the whole process, every backend call, or every possible listener ordering is unbypassable. Loading this listener into a third-party dispatcher that ignores the official containment contract is outside the supported boundary.

The listener registers with Cordis `prepend`, so it wraps normally registered rules and redacts their final return value. A later plugin can deliberately register another prepended outer listener and transform the already-redacted record afterward; deployment owners must review waterfall listeners and keep any such outer rule from adding sensitive data.

The fixed rules deliberately trade fidelity for non-disclosure. A sensitive key replaces its complete value, and recognized string credentials are replaced rather than partially masked. Credential-bearing key names are rewritten; a collision created by that rewrite rejects the record. The configurable replacement is public output text; supported credential patterns are rejected at load, but the plugin cannot prove arbitrary user-selected text is non-secret.

## Residual risk

Pattern redaction cannot guarantee detection of every opaque or novel credential. Deployments should also minimize telemetry collection, use the official default-disabled sharing policy until explicitly authorized, restrict collector access and retention, and treat exported records as sensitive even after redaction.

Provider and exporter configuration is outside the record waterfall. In particular, LLM `apiKey`/`apiKeyEnv`, provider request `headers`, OTel exporter `headers`, and collector endpoint credentials are never input to this plugin unless some other component explicitly copies them into a session event. Direct calls to a backend's `emit()`, and a later prepended outer listener that adds data after this plugin returns, bypass this rule. See [SECRET-MATRIX.md](SECRET-MATRIX.md).
```

</details>

**依据 3 · 作者声明**：[SECRET-MATRIX.md:17-25](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/SECRET-MATRIX.md#L17-L25)

作者明确未知/编码凭据及绕过路径。

```text
| Opaque/unlabelled value, novel credential format, encoded/encrypted value, short Bearer value, or Cookie text in an unrelated string | May pass unchanged | Unsupported; exported data remains sensitive |
| Percent-encoded label/separator | Detected only if enough literal text still matches a fixed rule | No decoding guarantee |
| Accessor, cycle, over-depth value, non-plain object, or key-redaction collision | Throws instead of exporting a partial/changed-meaning copy | Official coordinator drops only that one export copy |
| Proxy | Reflection traps may execute or throw; no isolation guarantee | Official `structuredClone` normally rejects it before this plugin; hostile direct dispatch unsupported |
| LLM/provider config (`apiKey`, `apiKeyEnv`, request `headers`) | Not seen | Outside `SessionTelemetryRecord` |
| OTel exporter config (`headers`, endpoint URL/query credentials) | Not seen | Outside `SessionTelemetryRecord` |
| Direct backend `emit()` or a later outer `prepend` listener | Can bypass or reintroduce data | Deployment/composition boundary; not fail-closed by this plugin |

The matrix describes detection, not declassification. Keep telemetry sharing minimal and treat every exported record as sensitive.
```

#### 缺口

- 未独立核对固定部署中协调器深拷贝和异常包含是否覆盖全部实际导出路径。
  **影响**：不能把局部过滤推成全后端防泄漏保证。
  **进一步探讨**：可从绑定版本协调器入口、backend调用和完整监听器清单继续追踪副本交付。
- 未知格式凭据召回率和误删率无真实任务基准。
  **影响**：无法判断适用组织的敏感字段是否充分覆盖。
  **进一步探讨**：可用合成且不含真实秘密的组织字段集，按支持矩阵分层记录漏检、误删与整条丢弃。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、生效和退出分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖package的DSH bundle patch、Cordis和遥测peer版本。patch只插入telemetry-redactor一行，不添加或替换后端；加载成功而没有实际record流时不会产生保护收益。replacement是唯一可配置项，长度1到128且不得匹配受支持凭据模式，key和pattern规则不可关闭。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19.0或>=24 | 启动必需 | 运行编译ESM入口 | 需先满足包运行条件 |
| Cordis ^4.0.1 | 启动必需 | 插件及waterfall组合 | 不承诺其他语义的dispatcher兼容 |
| dsh-session-telemetry >=0.1.0-rc.5且<0.2.0 | 生效必需 | 官方记录与异常包含契约 | 不得推定fail-closed |
| 已授权遥测后端与实际事件 | 价值兑现必需 | 存在需要过滤的出站副本 | 插件不会主动启用后端 |
| 全部外层监听器核查 | 安全敏感部署必需 | 防止过滤后再添加敏感值 | 仅有该插件不足证明最终副本安全 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者确认后端共享授权、版本和监听器 | 输入与实际导出路径符合边界 |
| 加载 | 安装固定包，检查resolved配置中的插入行 | replacement合法、fiber加载不报错 |
| 使用 | 用合成凭据事件核对受支持字段 | 后端副本被替换而canonical保持 |
| 失败/退出 | 排查拒绝记录与监听器，按宿主禁用规则 | 恢复原后端路径时重新评估共享风险 |

卸载后的遥测不再经过此过滤，退出不能被理解为更安全。源码用ctx.on注册，资源释放语义由Cordis生命周期负责；本轮未运行该生命周期。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-36](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/package.json#L28-L36)

运行时与编译入口声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
```

**依据 2 · 源码核查**：[package.json:69-78](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/package.json#L69-L78)

运行依赖及peer约束。

<details>
<summary>查看原文（10行）</summary>

```text
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "3.18.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session-telemetry": ">=0.1.0-rc.5 <0.2.0"
  },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/cordis.patch.yml#L1-L6)

仅插入规则不启用后端。

```text
# Profile-bundle layer: mount the export-copy rule without replacing the
# deployment's telemetry backend or editing the canonical session log.

- insert:
    - id: telemetry-redactor
      name: dsh-telemetry-redactor
```

**依据 4 · 源码核查**：[src/index.ts:158-180](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L158-L180)

replacement验证和事件挂载。

<details>
<summary>查看原文（23行）</summary>

```text
function resolveReplacement(config: Config): string {
  const replacement = config.replacement === undefined ? DEFAULT_REPLACEMENT : config.replacement
  if (replacement.length === 0 || replacement.length > MAX_REPLACEMENT_LENGTH) {
    throw new Error(`telemetry-redactor: replacement must contain 1..${MAX_REPLACEMENT_LENGTH} characters`)
  }
  if (redactString(replacement, DEFAULT_REPLACEMENT) !== replacement) {
    throw new Error('telemetry-redactor: replacement must not match a supported secret pattern')
  }
  return replacement
}

function redactRecord(record: SessionTelemetryRecord, replacement: string): SessionTelemetryRecord {
  return redactValue(record, replacement, new WeakSet(), 0) as SessionTelemetryRecord
}

/**
 * Mount the telemetry export rule.
 * @param ctx - Cordis context that owns the telemetry waterfall.
 * @param config - validated redactor configuration.
 */
export function apply(ctx: Context, config: Config = {}): void {
  const replacement = resolveReplacement(config)
  ctx.on('session-telemetry/record', (_record, next) => redactRecord(next(), replacement), { prepend: true })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复的成本和效果能判断到哪里？

**研究主题**：效果与总成本

#### 完整回答

计量单位是按约定字段正确过滤并成功交付的一条遥测副本，不能只统计处理过的记录数。代码同步遍历字符串与容器，深度上限64防止无界递归，但很宽的浅对象仍带来线性CPU及新输出分配。性能脚本设50000字段与2秒护栏，只是作者的检查方法，本轮没有运行，不能作为生产延迟指标。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包、宿主和配置审计资源，金额未知 | 字段盘点、版本与监听器核查 | 不需要新增模型API，但审计人时未知 |
| 持续使用 | 同步CPU、新对象与字符串分配 | 跟踪漏检、误删及被拒绝记录 | 没有吞吐、尾延迟或真实事件大小分布 |
| 失败恢复 | 丢弃副本造成观测空洞，重采资源未知 | 区分异常与真实缺失，修正输入或规则 | 不应从canonical重发时再次泄露 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 支持模式过滤 | 键和字符串规则可核查 | 组织真实秘密的召回与误删 |
| 保留输入事实 | 递归新建对象，不就地改原值 | 所有导出路径是否遵守协调器副本契约 |
| 异常拒绝 | 本插件抛异常，作者集成测试定义包含行为 | 实际部署的记录丢弃及告警可见性 |

收益是减少特定凭据进入后端的机会，不能估算为事故避免金额。完整性损失、失败排查和敏感数据最小采集仍是部署方成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:100-128](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L100-L128)

同步递归和新对象分配。

<details>
<summary>查看原文（29行）</summary>

```text
function redactValue(
  value: unknown,
  replacement: string,
  ancestors: WeakSet<object>,
  depth: number,
): unknown {
  if (depth > MAX_NESTING_DEPTH) {
    throw new Error(`telemetry-redactor: record exceeds maximum nesting depth ${MAX_NESTING_DEPTH}`)
  }
  if (typeof value === 'string') return redactString(value, replacement)
  if (value === null || typeof value !== 'object') return value
  if (ancestors.has(value)) throw new Error('telemetry-redactor: record contains a cycle')

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      const descriptors = Object.getOwnPropertyDescriptors(value) as Record<string, PropertyDescriptor>
      const length = descriptors['length']?.value
      if (typeof length !== 'number') throw new Error('telemetry-redactor: invalid array length descriptor')
      const output = new Array<unknown>(length)
      for (let index = 0; index < length; index += 1) {
        const descriptor = descriptors[String(index)]
        if (descriptor === undefined) continue
        if (!('value' in descriptor)) {
          throw new Error('telemetry-redactor: accessor properties are unsupported')
        }
        output[index] = redactValue(descriptor.value, replacement, ancestors, depth + 1)
      }
      return output
```

</details>

**依据 2 · 源码核查**：[scripts/performance-smoke.mjs:5-22](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/scripts/performance-smoke.mjs#L5-L22)

已读作者性能护栏，不当作本轮通过结果。

<details>
<summary>查看原文（18行）</summary>

```text
const fieldCount = 50_000
const body = Object.fromEntries(Array.from({ length: fieldCount }, (_, index) => [`metric_${index}`, index]))
const record = {
  channel: 'ledger',
  time: 1,
  severity: 'info',
  attributes: { 'session.id': 'performance', 'event.type': 'fixture', 'event.seq': 1 },
  body,
}
const ctx = new Context()
const fiber = await ctx.plugin(Redactor)
const started = performance.now()
const output = ctx.waterfall('session-telemetry/record', record, () => record)
const elapsedMillis = performance.now() - started
if (Object.keys(output.body).length !== fieldCount) throw new Error('performance-smoke: field loss')
if (elapsedMillis >= 2_000) throw new Error(`performance-smoke: ${elapsedMillis.toFixed(1)}ms exceeds 2000ms guard`)
await fiber.dispose()
console.log(`performance-smoke: PASS ${fieldCount} fields ${elapsedMillis.toFixed(1)}ms`)
```

</details>

**依据 3 · 源码核查**：[tests/loader-composition.spec.ts:90-107](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/tests/loader-composition.spec.ts#L90-L107)

超深事件不进入记录列表的静态断言。

<details>
<summary>查看原文（18行）</summary>

```text
    let tooDeep: Record<string, unknown> = { leaf: 'safe' }
    for (let index = 0; index < 70; index += 1) tooDeep = { child: tooDeep }
    const count = records.length
    const originalWarn = ctx.logger.warn
    const warnings: string[] = []
    ctx.logger.warn = (...args: unknown[]) => {
      warnings.push(args.map(String).join(' '))
    }
    ctx.emit('session/event', session, {
      type: 'fixture/deep',
      seq: 1,
      time: Date.now(),
      data: tooDeep,
      ignorable: true,
    } as never)
    expect(records).toHaveLength(count)
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('maximum nesting depth')
```

</details>

#### 缺口

- 缺少真实事件规模、尾延迟、误删及丢弃记录比例。
  **影响**：无法给出单位成本或吞吐保证，也不能判断丢弃对运维排障影响。
  **进一步探讨**：可从合成正常/超深/超宽记录集入手，记录CPU、内存、p95延迟与可用观测比例。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程设计值得复用，由此能推导什么新方向？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是用descriptor读取数据属性，拒绝getter和非普通对象，避免过滤过程隐式执行普通访问器；用ancestors集合只检测当前递归链，允许同一对象在不同分支重复出现；键脱敏后先检查冲突，避免静默覆盖改变记录含义。这些是“宁可拒绝副本也不输出歧义结构”的可靠性取舍，不能推广成恶意Proxy沙箱，反射本身可能触发trap。

从Q02/Q04可推导未验证的“隐私安全丢弃收据”。当前异常会让一条副本消失，如果协调器另发不含原值的聚合原因计数，并将其放在同样受审查的控制平面，就可能兼顾过滤拒绝与可观测性。新增负担是避免原因、键名或哈希成为另一泄漏通道，并需要宿主拥有可靠计数和生命周期。最小对照可比较当前丢弃、仅聚合原因和包含详细错误三种策略，以合成凭据扫描收据泄漏，记录排障正确率与额外成本；若收据泄漏信息或不能改善定位，就应否定。该假设不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:111-154](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L111-L154)

descriptor检查、祖先链和键冲突拒绝。

<details>
<summary>查看原文（44行）</summary>

```text
  if (ancestors.has(value)) throw new Error('telemetry-redactor: record contains a cycle')

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      const descriptors = Object.getOwnPropertyDescriptors(value) as Record<string, PropertyDescriptor>
      const length = descriptors['length']?.value
      if (typeof length !== 'number') throw new Error('telemetry-redactor: invalid array length descriptor')
      const output = new Array<unknown>(length)
      for (let index = 0; index < length; index += 1) {
        const descriptor = descriptors[String(index)]
        if (descriptor === undefined) continue
        if (!('value' in descriptor)) {
          throw new Error('telemetry-redactor: accessor properties are unsupported')
        }
        output[index] = redactValue(descriptor.value, replacement, ancestors, depth + 1)
      }
      return output
    }
    const prototype = Object.getPrototypeOf(value)
    if (prototype !== Object.prototype && prototype !== null) {
      throw new Error('telemetry-redactor: only arrays and plain objects are supported')
    }

    const output: [string, unknown][] = []
    const outputKeys = new Set<string>()
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
      if (!descriptor.enumerable) continue
      if (!('value' in descriptor)) {
        throw new Error('telemetry-redactor: accessor properties are unsupported')
      }
      const redactedKey = redactString(key, replacement)
      if (outputKeys.has(redactedKey)) {
        throw new Error('telemetry-redactor: redacted key collision')
      }
      outputKeys.add(redactedKey)
      output.push([
        redactedKey,
        isSensitiveKey(key) ? replacement : redactValue(descriptor.value, replacement, ancestors, depth + 1),
      ])
    }
    return Object.fromEntries(output)
  } finally {
    ancestors.delete(value)
```

</details>

**依据 2 · 源码核查**：[tests/adversarial.spec.ts:175-194](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/tests/adversarial.spec.ts#L175-L194)

作者用外层prepend展示组合绕过边界，不伪装成运行证据。

<details>
<summary>查看原文（20行）</summary>

```text
describe('listener composition boundary', () => {
  it('wraps ordinary listeners mounted before the redactor', async () => {
    const ctx = new Context()
    ctx.on('session-telemetry/record', (_candidate, next) => ({
      ...next(),
      body: { apiKey: secret('ordinary-listener') },
    }))
    await ctx.plugin(Redactor)
    const input = record({ safe: true })
    expect(JSON.stringify(ctx.waterfall('session-telemetry/record', input, () => input)))
      .not.toContain(secret('ordinary-listener'))
  })

  it('proves a more-outer prepended listener can bypass this rule', async () => {
    const ctx = new Context()
    await ctx.plugin(Redactor)
    const bypass = secret('outer-bypass')
    ctx.on('session-telemetry/record', () => record({ raw: bypass }), { prepend: true })
    const input = record({ safe: true })

```

</details>

**依据 3 · 作者声明**：[SECURITY.md:7-17](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/SECURITY.md#L7-L17)

单条副本丢弃与实际敏感性边界提供推导起点。

<details>
<summary>查看原文（11行）</summary>

```text
Here, “fail-closed” has one narrow meaning: when mounted through the official `SessionTelemetryCoordinator`, a thrown rule is contained and that single export copy is not handed to that coordinator's backend. It does not mean the whole process, every backend call, or every possible listener ordering is unbypassable. Loading this listener into a third-party dispatcher that ignores the official containment contract is outside the supported boundary.

The listener registers with Cordis `prepend`, so it wraps normally registered rules and redacts their final return value. A later plugin can deliberately register another prepended outer listener and transform the already-redacted record afterward; deployment owners must review waterfall listeners and keep any such outer rule from adding sensitive data.

The fixed rules deliberately trade fidelity for non-disclosure. A sensitive key replaces its complete value, and recognized string credentials are replaced rather than partially masked. Credential-bearing key names are rewritten; a collision created by that rewrite rejects the record. The configurable replacement is public output text; supported credential patterns are rejected at load, but the plugin cannot prove arbitrary user-selected text is non-secret.

## Residual risk

Pattern redaction cannot guarantee detection of every opaque or novel credential. Deployments should also minimize telemetry collection, use the official default-disabled sharing policy until explicitly authorized, restrict collector access and retention, and treat exported records as sensitive even after redaction.

Provider and exporter configuration is outside the record waterfall. In particular, LLM `apiKey`/`apiKeyEnv`, provider request `headers`, OTel exporter `headers`, and collector endpoint credentials are never input to this plugin unless some other component explicitly copies them into a session event. Direct calls to a backend's `emit()`, and a later prepended outer listener that adds data after this plugin returns, bypass this rule. See [SECRET-MATRIX.md](SECRET-MATRIX.md).
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合受控试用，何时必须停止依赖？

**研究主题**：采用判断

#### 完整回答

已有遥测共享需求且能核对Cordis/协调器版本与完整监听器顺序的维护者，可把它作为纵深防御的一层受控试用。它不会扩大模型能力，也不要求为使用插件主动开启遥测。试用应采用合成支持模式、计数器、未知opaque值、超深和键冲突样本，同时核对后端副本与canonical记录，观察被拒绝的可见性。

若发现过滤后外层规则重新加敏感数据、实际后端绕过waterfall、异常造成agent中断，或重要字段被误删而无人能发现，应停止依赖并先最小化/暂停共享。不能以安装该包替代数据最小采集、访问控制与留存治理。当前推荐trial而非install，静态实现与作者测试定义提供试用依据，尚无本轮同版本实际部署验收。关键限制见Q02，成本和恢复边界见Q04。

#### 证据与依据

**依据 1 · 作者声明**：[SECURITY.md:9-17](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/SECURITY.md#L9-L17)

监听器组合、最小采集和输入外路径直接影响采用。

```text
The listener registers with Cordis `prepend`, so it wraps normally registered rules and redacts their final return value. A later plugin can deliberately register another prepended outer listener and transform the already-redacted record afterward; deployment owners must review waterfall listeners and keep any such outer rule from adding sensitive data.

The fixed rules deliberately trade fidelity for non-disclosure. A sensitive key replaces its complete value, and recognized string credentials are replaced rather than partially masked. Credential-bearing key names are rewritten; a collision created by that rewrite rejects the record. The configurable replacement is public output text; supported credential patterns are rejected at load, but the plugin cannot prove arbitrary user-selected text is non-secret.

## Residual risk

Pattern redaction cannot guarantee detection of every opaque or novel credential. Deployments should also minimize telemetry collection, use the official default-disabled sharing policy until explicitly authorized, restrict collector access and retention, and treat exported records as sensitive even after redaction.

Provider and exporter configuration is outside the record waterfall. In particular, LLM `apiKey`/`apiKeyEnv`, provider request `headers`, OTel exporter `headers`, and collector endpoint credentials are never input to this plugin unless some other component explicitly copies them into a session event. Direct calls to a backend's `emit()`, and a later prepended outer listener that adds data after this plugin returns, bypass this rule. See [SECRET-MATRIX.md](SECRET-MATRIX.md).
```

**依据 2 · 源码核查**：[src/index.ts:178-180](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L178-L180)

本组件仅一条出站规则，支持收窄采用定位。

```text
export function apply(ctx: Context, config: Config = {}): void {
  const replacement = resolveReplacement(config)
  ctx.on('session-telemetry/record', (_record, next) => redactRecord(next(), replacement), { prepend: true })
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
