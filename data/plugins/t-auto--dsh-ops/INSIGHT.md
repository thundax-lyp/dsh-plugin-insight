# dsh-ops

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[dfafddc](https://github.com/T-Auto/dsh-ops/tree/dfafddc941695090df2c6e2e323193785aec4eb6)

<!-- BEGIN META -->
[![GitHub ★ 4,272](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C272&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-ops) [![npm 30d 31,257](https://img.shields.io/static/v1?label=npm+30d&message=31%2C257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ops)
<!-- END META -->

> **实现功能**：为DSH提供紧凑文件、文档与PTC工具，并按需加载能力和替换部分官方工具。

> **核心亮点**：相对把全部工具schema常驻，渐进发现让常用面较小；相对只有字符串截断，结构化结果与session生命周期提供更明确的使用边界。具体贡献是紧凑工具面和替代准备检查的组合，而非工具数量多。是否少调用还取决于模型能否正确发现能力及紧凑结果是否保留足够信息。 依据[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是减少工具描述与结果内容会否增加漏读、重试或错误修改。源码的readiness只证明替代定义与归属可见，不证明与每个官方工具语义等价；结果缓存物理清理失败会留下临时文件，源码仅警告且不自动重试。安装dry-run同样只作静态路径检查，不能替代实际宿主兼容。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复读写大量文件或文档的DSH编码用户，目标是在可核对交付不变时减少冗长工具结果和模型往返。原办法是原生工具及模型自行写PTC脚本；合格结果必须同时保留完整文件修改、可追溯行号和错误，而不是单看输出token变少。README称其减少token是目标及作者实验，本轮不继承为已验证收益。

相对把全部工具schema常驻，渐进发现让常用面较小；相对只有字符串截断，结构化结果与session生命周期提供更明确的使用边界。具体贡献是紧凑工具面和替代准备检查的组合，而非工具数量多。是否少调用还取决于模型能否正确发现能力及紧凑结果是否保留足够信息。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件工具 | 紧凑读取和修改 | 需worker与结果复核 |
| 渐进发现 | 按需公开能力 | 模型需正确发现 |
| 官方工具替代 | 减少重复工具面 | 仅在替代就绪时遮蔽 |
| 结果引用 | 会话内复用输出 | 过期不保证物理已清理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH声明版本 | 必需 | scope与tools API | 不宣称兼容 |
| 平台worker | 文件操作必需 | 执行读写 | 准备不足回官方 |
| 工作区权限 | 修改必需 | 写文件 | 拒绝或人工处理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 安装目标profile并保留原生能力 | 核对worker |
| 2 | 用固定文件任务比较结果 | 内容完整再评估token |
| 3 | 错误时撤销replaceTools | 核对Git差异 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | worker与安装资源未知 | profile和配置核对 | 多平台功能不同 |
| 持续使用 | 模型总token未实测 | 完整性复核 | 不能仅计压缩输出 |
| 失败恢复 | 重试可能追加费用 | 原生回退及临时文件清理 | 引用失效不等于物理删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具面 | 按需配置与替代readiness | 端到端token节约 |
| 隔离 | Session与nonce绑定 | 实际平台全部清理 |

> **思考**：核心质疑是减少工具描述与结果内容会否增加漏读、重试或错误修改。源码的readiness只证明替代定义与归属可见，不证明与每个官方工具语义等价；结果缓存物理清理失败会留下临时文件，源码仅警告且不自动重试。安装dry-run同样只作静态路径检查，不能替代实际宿主兼容。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对把全部工具schema常驻，渐进发现让常用面较小；相对只有字符串截断，结构化结果与session生命周期提供更明确的使用边界。具体贡献是紧凑工具面和替代准备检查的组合，而非工具数量多。是否少调用还取决于模型能否正确发现能力及紧凑结果是否保留足够信息。 依据[Q03](#research-q03)。

相对把全部工具schema常驻，渐进发现让常用面较小；相对只有字符串截断，结构化结果与session生命周期提供更明确的使用边界。具体贡献是紧凑工具面和替代准备检查的组合，而非工具数量多。是否少调用还取决于模型能否正确发现能力及紧凑结果是否保留足够信息。 依据[Q03](#research-q03)。

可借鉴的是替代工具准备检查不接受同名外部定义、失败不进行半套遮蔽，以及每次会话重开分配新nonce。它们能抑制能力失配和旧结果越界复用；移植需保留宿主scope和销毁顺序。具体官方工具语义兼容仍需独立任务验证，不能由registry归属检查推出。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是减少工具描述与结果内容会否增加漏读、重试或错误修改。源码的readiness只证明替代定义与归属可见，不证明与每个官方工具语义等价；结果缓存物理清理失败会留下临时文件，源码仅警告且不自动重试。安装dry-run同样只作静态路径检查，不能替代实际宿主兼容。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可在备份或Git工作区内试用一个批量文件读取任务，先保持官方工具可恢复，再检查结果完整性。相比原生工具，它提供紧凑结果、按需能力和归属检查，但具体降本未独立验证。出现READINESS_BLOCKED、遗漏内容或反复重读时取消替代选择，回原生工具并核对文件差异。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/official-tool-hiding.ts、src/components/discovery/index.ts、src/kernel/result-lifecycle.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)
- **版本号**：0.4.1（[固定提交 dfafddc](https://github.com/T-Auto/dsh-ops/tree/dfafddc941695090df2c6e2e323193785aec4eb6)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为渐进工具加载加入“任务完整性优先”的回退：一旦紧凑结果缺少所需区域就回原生完整读取，可能减少节省token却多次返工的问题。固定文件/文档语料和模型，对比原生、OPS以及带回退策略，记录合格交付率、总token、重读和人工修复。若总成本无下降或漏改更多，则不应隐藏原生工具。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 76 | 11867 | — | — | 162333 |
| .mjs | source | 49 | 12386 | 8452 | 3318 | — |
| .mjs | example | 9 | 1421 | 901 | 432 | — |
| .ts | source | 132 | 11817 | 8881 | 2534 | — |
| .tsx | source | 5 | 207 | 207 | 0 | — |
| .mjs | test | 167 | 28612 | 24253 | 2875 | — |
| .ts | test | 9 | 396 | 301 | 81 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/T-Auto/dsh-ops/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向反复读写大量文件或文档的DSH编码用户，目标是在可核对交付不变时减少冗长工具结果和模型往返，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向反复读写大量文件或文档的DSH编码用户，目标是在可核对交付不变时减少冗长工具结果和模型往返。原办法是原生工具及模型自行写PTC脚本；合格结果必须同时保留完整文件修改、可追溯行号和错误，而不是单看输出token变少。README称其减少token是目标及作者实验，本轮不继承为已验证收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-29](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/README.md#L22-L29)

作者目标和工具范围。

```text

以提高token效率为目的，提供新增的ops系列工具并隐藏部分官方工具为方案的插件，低改动面，低侵入性，与其他插件广泛兼容。

- （仅windows平台）启用与dsh原生bash行为一致的ops_bash，并可选禁用powershell
- 启用 DSH 预留的 `tools_addition` 动态工具加载，并提供渐进式纰漏的工具，作为高级功能（如pdf、word读取、超多文件批量修改）的加载平台，大大减少常见特定场景的token消耗量，且不会导致系统提示词膨胀
- 为 Native 模式提供返回紧凑、带行号和更好错误回馈的工具以遏制报错循环，减少调用轮次
- 为 PTC 模式提供一些返回结构化 JSON 值的工具以降低 ai 在 ptc 模式下编写 TypeScript 代码的token总量和心智负担
- PTC SDK 目录包含 18 个 API：15 个文件/文档工具，加批处理、结果引用和加载器。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

根入口负责注册自有能力、NativeFileTools、会话shell及result lifecycle。file组件转入applyComponent，discovery配置控制allowedTools/alwaysLoaded和worker路径。隐藏官方工具是独立组件，核对替代定义确属当前native provider，缺失替代时计划不隐藏任何官方工具并返回READINESS_BLOCKED。结果按Session对象及nonce绑定，销毁时先阻止新工作、等待已有任务，再清理结果引用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:83-90](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/index.ts#L83-L90)

Native文件与生命周期接线。

```text
async function mountNativeFile(ctx: Context, config: ResolvedConfig, file: string | undefined): Promise<void> {
  mountResultLifecycle(ctx)
  const surface = new NativeFileTools({ ctx, config: { ...config, workerPath: file },
    report: (message, level) => report(ctx, message, level) })
  // `safeDispose` isolates synchronous teardown callbacks; a *rejecting promise* needs its own
  // catch, or the rejection is dropped and the worker's shutdown failure stays invisible (#30).
  ctx.effect(() => () => {
    return surface.stop().catch(error => report(ctx, `dsh-ops: native file worker shutdown failed: ${errorText(error)}`, 'warn'))
```

**依据 2 · 源码核查**：[src/official-tool-hiding.ts:50-75](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/official-tool-hiding.ts#L50-L75)

实际归属与准备检查。

<details>
<summary>查看原文（26行）</summary>

```text
    // Readiness examines the unmasked scope. It never accepts ops_<same-name>
    // as an equivalence claim, nor uses run_code as a native replacement.
    const readiness = (agent: object): boolean[] => {
      const owned = new Set(typeof tools.get === 'function' ? nativeProviders(ctx, agent).map(provider => provider.definition) : [])
      return replaceTools.map(tool => {
        const visible = typeof tools.get === 'function' ? tools.get(OFFICIAL_REPLACEMENTS[tool], agent) : undefined
        return visible !== undefined && owned.has(visible)
      })
    }
    const prepare = (agent: object, entry: Entry): Plan => {
      const names = typeof tools.schemas === 'function' ? tools.schemas(agent).map(schema => schema.name) : []
      const hidden = names.filter(hideable)
      const ready = readiness(agent)
      const missing = replaceTools.flatMap((tool, index) => {
        const replacement = OFFICIAL_REPLACEMENTS[tool]
        return names.includes(replacement) && ready[index]
          ? [] : [`${tool} -> ${replacement}`]
      })
      const diagnostics = [
        ...apiError.length ? [`missing host API: ${apiError.join(', ')}`] : [],
        ...entry.cleanupError ? [entry.cleanupError] : [],
        ...missing.length ? [`missing OPS surface: ${[...new Set(missing)].join(', ')}`] : [],
      ]
      const failure = diagnostics.length ? blocked(diagnostics.join('; ')) : undefined
      // A failed plan hides nothing: no partial mask over an unready scope.
      return { deny: failure ? [] : hidden, failure }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对把全部工具schema常驻，渐进发现让常用面较小；相对只有字符串截断，结构化结果与session生命周期提供更明确的使用边界。具体贡献是紧凑工具面和替代准备检查的组合，而非工具数量多。是否少调用还取决于模型能否正确发现能力及紧凑结果是否保留足够信息。

#### 证据与依据

**依据 1 · 源码核查**：[src/components/discovery/index.ts:4-12](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/components/discovery/index.ts#L4-L12)

按需能力配置。

```text
export const Config = settingsConfig(resolveDiscoveryConfig, {
  enabled: editable('boolean', 'Publish the discovery entry.'),
  maxResults: editable('number', 'Maximum capabilities selected per discovery call, from 1 to 5.'),
  allowedTools: editable('array', 'Implemented capabilities available for discovery.', { type: 'string' }),
  alwaysLoaded: editable('array', 'Allowed capabilities published without a discovery request.', { type: 'string' }),
  binaryPath: editable('string', 'Absolute native worker path; omit to use the packaged worker.'),
  required: editable('boolean', 'Fail activation when the native worker is unavailable.'),
  denyCredentialReads: editable('boolean', 'Refuse credential locations during file reads.'),
})
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是减少工具描述与结果内容会否增加漏读、重试或错误修改。源码的readiness只证明替代定义与归属可见，不证明与每个官方工具语义等价；结果缓存物理清理失败会留下临时文件，源码仅警告且不自动重试。安装dry-run同样只作静态路径检查，不能替代实际宿主兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/kernel/result-lifecycle.ts:66-81](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/kernel/result-lifecycle.ts#L66-L81)

引用过期与物理清理失败不同。

<details>
<summary>查看原文（16行）</summary>

```text
export function expireResultSession(ctx: Pick<LifecycleHost, 'root' | 'logger'>, session: ResultSession, disposed = true): Promise<void> {
  const state = owner(ctx), entry = state.sessions.get(session)
  if (disposed) state.expired.add(session)
  if (!entry) return Promise.resolve()
  if (entry.closing) return entry.closing
  entry.stopped = true
  // Publish the barrier before abort listeners can synchronously reopen the same id.
  entry.closing = Promise.resolve().then(async () => {
    await Promise.allSettled(entry.work.values())
    for (const cleanup of entry.cleanup.values()) {
      try { await cleanup() }
      catch { ctx.logger?.warn?.('dsh-ops: session result references expired; physical cache cleanup did not complete under current host authority. Temporary files remain for host or operator cleanup; no automatic retry is scheduled.') }
    }
    entry.cleanup.clear(); state.sessions.delete(session)
  })
  for (const controller of entry.work.keys()) controller.abort(new Error('Result session disposed'))
```

</details>

#### 缺口

- 替代定义就绪不能证明每项操作与官方工具语义等价。
  **影响**：不得默认隐藏后无损。
  **进一步探讨**：固定缺陷与大文件任务比较遗漏、重试及差异。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要声明的DSH宿主版本、对应平台的native worker及可信工作区权限。Windows Bash功能与跨平台文件工具应分开判断。隐藏工具前要确认替代能力，失败可移除replaceTools选择或禁用hide-official行；若临时文件清理失败需宿主或操作者处理，不应以结果引用过期理解为物理数据已删。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-tool-hiding.ts:24-30](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/official-tool-hiding.ts#L24-L30)

失败时移除替代选择或禁用行。

```text
const RUN_CODE = 'run_code'
const blocked = (detail: string): string => `READINESS_BLOCKED (EXECUTOR_UNAVAILABLE): dsh-ops hide-official cannot verify selected replacements: ${detail}. Restore the selected OPS tools, remove the selection from replaceTools, or disable the dsh-ops-hide-official row.`

export function apply(root: Context, raw?: unknown): void {
  const { replaceTools }: { replaceTools: OfficialReplacement[] } = resolveHidingConfig(raw)
  // Empty and legacy-only rows install no hooks and cannot block a session.
  if (!replaceTools.length) return
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次是安装目标profile、核对worker与工具面；持续包括模型调用、发现工具的额外回合及结果复核，失败包括读写重试和临时文件清理。没有同条件合格任务的实付、耗时和错误率，不能把作者benchmark图片认作普遍降本。节省schema token只有在完整任务仍正确时才算采用增量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-39](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/README.md#L32-L39)

作者基准声明与发布限制。

```text
  <img src="https://github.com/user-attachments/assets/8238e4cd-61aa-4740-83bf-3aa6dd61291b" height="300" alt="dsh token 效率">
  &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/a0c0fdfe-337a-43d5-8ca2-326d9287bfea" height="300" alt="第二张图">
</p>
<p align="center"><em>左：deepseek-v4.1-flash-1017在各harness的跑分与开销<br>右：ops在自用benchmark上取得的的成绩。完整benchmark将随后续更新发布<br>dsh-ops团队将致力于持续优化dsh的token效率，以更低的成本更好地完成同样的任务</em></p>

## 安装、更新、卸载

```

#### 缺口

- 同条件完整交付的总token、实付和人工修复未知。
  **影响**：仅支持有条件工具试用。
  **进一步探讨**：累计所有发现、重读、失败与人工成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的是替代工具准备检查不接受同名外部定义、失败不进行半套遮蔽，以及每次会话重开分配新nonce。它们能抑制能力失配和旧结果越界复用；移植需保留宿主scope和销毁顺序。具体官方工具语义兼容仍需独立任务验证，不能由registry归属检查推出。

#### 证据与依据

**依据 1 · 源码核查**：[src/kernel/result-lifecycle.ts:27-44](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/kernel/result-lifecycle.ts#L27-L44)

会话身份与nonce。

<details>
<summary>查看原文（18行）</summary>

```text
function live(ctx: Pick<LifecycleHost, 'root'>, session: ResultSession): LiveSession {
  const state = owner(ctx)
  if (state.expired.has(session)) throw new Error('Result session has expired')
  // The pinned SessionStore emits its exact stored Session object throughout one lifetime.
  if ([...state.sessions].some(([other, entry]) => other !== session && other.id === session.id && !entry.stopped)) {
    throw new Error('Another live session owns this identity')
  }
  let entry = state.sessions.get(session)
  if (!entry) {
    entry = { nonce: randomUUID(), stopped: false, work: new Map(), cleanup: new Map() }
    state.sessions.set(session, entry)
  }
  if (entry.stopped) throw new Error('Result session is closing')
  return entry
}
/** A reopened persisted session receives a fresh authority binding, even with the same id. */
export function resultSessionNonce(ctx: Pick<LifecycleHost, 'root'>, session: ResultSession): string {
  return live(ctx, session).nonce
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为渐进工具加载加入“任务完整性优先”的回退：一旦紧凑结果缺少所需区域就回原生完整读取，可能减少节省token却多次返工的问题。固定文件/文档语料和模型，对比原生、OPS以及带回退策略，记录合格交付率、总token、重读和人工修复。若总成本无下降或漏改更多，则不应隐藏原生工具。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-tool-hiding.ts:50-75](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/official-tool-hiding.ts#L50-L75)

替代存在不等于语义等价，为回退假设提供边界。

<details>
<summary>查看原文（26行）</summary>

```text
    // Readiness examines the unmasked scope. It never accepts ops_<same-name>
    // as an equivalence claim, nor uses run_code as a native replacement.
    const readiness = (agent: object): boolean[] => {
      const owned = new Set(typeof tools.get === 'function' ? nativeProviders(ctx, agent).map(provider => provider.definition) : [])
      return replaceTools.map(tool => {
        const visible = typeof tools.get === 'function' ? tools.get(OFFICIAL_REPLACEMENTS[tool], agent) : undefined
        return visible !== undefined && owned.has(visible)
      })
    }
    const prepare = (agent: object, entry: Entry): Plan => {
      const names = typeof tools.schemas === 'function' ? tools.schemas(agent).map(schema => schema.name) : []
      const hidden = names.filter(hideable)
      const ready = readiness(agent)
      const missing = replaceTools.flatMap((tool, index) => {
        const replacement = OFFICIAL_REPLACEMENTS[tool]
        return names.includes(replacement) && ready[index]
          ? [] : [`${tool} -> ${replacement}`]
      })
      const diagnostics = [
        ...apiError.length ? [`missing host API: ${apiError.join(', ')}`] : [],
        ...entry.cleanupError ? [entry.cleanupError] : [],
        ...missing.length ? [`missing OPS surface: ${[...new Set(missing)].join(', ')}`] : [],
      ]
      const failure = diagnostics.length ? blocked(diagnostics.join('; ')) : undefined
      // A failed plan hides nothing: no partial mask over an unready scope.
      return { deny: failure ? [] : hidden, failure }
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

可在备份或Git工作区内试用一个批量文件读取任务，先保持官方工具可恢复，再检查结果完整性。相比原生工具，它提供紧凑结果、按需能力和归属检查，但具体降本未独立验证。出现READINESS_BLOCKED、遗漏内容或反复重读时取消替代选择，回原生工具并核对文件差异。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-tool-hiding.ts:24-25](https://github.com/T-Auto/dsh-ops/blob/dfafddc941695090df2c6e2e323193785aec4eb6/src/official-tool-hiding.ts#L24-L25)

可识别失败与退出入口。

```text
const RUN_CODE = 'run_code'
const blocked = (detail: string): string => `READINESS_BLOCKED (EXECUTOR_UNAVAILABLE): dsh-ops hide-official cannot verify selected replacements: ${detail}. Restore the selected OPS tools, remove the selection from replaceTools, or disable the dsh-ops-hide-official row.`
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
