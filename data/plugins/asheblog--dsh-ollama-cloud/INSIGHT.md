# dsh-ollama-cloud

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2230ae4](https://github.com/Asheblog/dsh-ollama-cloud/tree/2230ae4d77eeff2f8347993b62bd69f9c1e13916)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asheblog/dsh-ollama-cloud)
<!-- END META -->

> **功能**：接入 Ollama 云端或本地模型，动态发现模型与推理档位，并显示云端用量。

> **亮点**：[Q01](#research-q01) 的增量是原生元信息与宿主模型选择、用量通道的联接；[Q02](#research-q02) 同代connection快照减少飞行请求与配置漂移。聊天协议能力明确归属上游PiAiAdapter。

> **主要限制**：[Q03](#research-q03) 中目录成员与能力描述不等于真实任务可用，best-effort对齐警告也不能证明兼容。暂态保留防止误下架，同时保留能力未知风险。

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
  - [Q01 · 相比手配OpenAI兼容端点，此接入多做什么？](#detail-section-11)
  - [Q02 · 凭据、目录、聊天和配额怎样相连？](#detail-section-12)
  - [Q03 · 自动目录和版本对齐何时不足以证明模型可用？](#detail-section-13)
  - [Q04 · 接入与持续使用的负担是否支持试用？](#detail-section-14)
  - [Q05 · 可否把目录与配额的时效显式绑定给用户？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已使用Ollama云模型或自建兼容服务的DSH用户，合格结果是选择实际存在的模型、正确传递可用推理档位并完成同一聊天任务。手配兼容URL可解决基础对话，此插件增加原生tags/show发现、档位映射、目录刷新和配额界面。核心聊天继承官方PiAiAdapter，不应把上游协议转换算作本插件原创。增量是把端点特有元信息变为宿主可用选择与运维反馈。

参照手配OpenAI兼容URL和官方PiAiAdapter；未运行跨供应商效果或费用排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Ollama聊天route | 通过兼容接口用模型 | 委托官方PiAiAdapter，云端需key |
| 原生目录发现 | 获取模型和元信息 | show失败会保留未知能力条目 |
| 推理档位 | 将模型档位交给宿主 | 依赖端点声明与配置 |
| 配额读取 | 看窗口额度与重置 | balance不支持或暂态错误需区分 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm与共享PiAiAdapter | 必需 | route与聊天 | 版本契约漂移可失败 |
| Ollama兼容聊天/原生API | 必需 | 对话与模型发现 | 缓存可能保留旧目录 |
| 凭据引用 | 云端必需 | 认证 | 明确MISSING_CREDENTIAL |
| connection注入webServer | 用量UI必需 | 配额RPC | 聊天可独立，UI说明需重启 |
| web服务 | 搜索可选 | 搜索抓取 | 不影响纯聊天 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户处理route冲突及key | 只注册一个ollama-cloud |
| 重启 | 宿主加载adapter与目录 | 能列模型且凭据解析 |
| 试用 | 用户短文本、工具与取消 | stream和档位一致 |
| 核对 | 用户看配额方向和诊断 | 与端点读数相符，失败不当作零 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Ollama账号与宿主资源；价格未知 | 移除冲突route、配key并重启 | 耗时未知 |
| 持续使用 | 模型费用、目录与配额网络 | 跟踪宿主/pi-ai和端点元信息 | 套餐和调用量未知 |
| 失败恢复 | 重试与潜在重复调用 | 查诊断、切模型、核对旧缓存 | 真实故障成本未测 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 动态目录 | tags/show与退役判定 | 每模型实际调用能力 |
| 请求一致性 | prepareCall绑定快照 | 跨代际宿主兼容 |
| 配额可见 | remaining转换与时间字段 | 端点实时读数和界面理解 |

> **思考**：[Q03](#research-q03) 中目录成员与能力描述不等于真实任务可用，best-effort对齐警告也不能证明兼容。暂态保留防止误下架，同时保留能力未知风险。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的增量是原生元信息与宿主模型选择、用量通道的联接；[Q02](#research-q02) 同代connection快照减少飞行请求与配置漂移。聊天协议能力明确归属上游PiAiAdapter。

把官方聊天adapter与供应商目录/凭据事实分开有利于复用。缺凭据主动失败、发现未知不误删和同代prepared调用是可借鉴点；复制到其他服务需重新定义retired语义、缓存身份和错误分类，不能只换baseURL。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 中目录成员与能力描述不等于真实任务可用，best-effort对齐警告也不能证明兼容。暂态保留防止误下架，同时保留能力未知风险。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有Ollama凭据且可锁宿主版本的用户，以短文本和一个可丢弃工具任务试接入。首次要移除同route的dsh-llm-ollama冲突，配置key和完整重启；持续有模型调用费用、目录发现和配额轮询流量，以及上游升级维护。网络重试、缓存旧目录和人工切回模型也应计入失败成本。没有套餐与同任务账单，不给节省金额。成功需聊天、取消、工具结果和当前档位确实一致，配额方向与供应商页面相符；重复适配器冲突、能力误报或费用不可解释时停止扩大。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

适配委托、目录发现与配额解析有源码依据；真实端点能力及宿主契约未验收；统一时效标记是假设。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、src/index.ts、src/adapter.ts、src/discovery.ts、src/alignment.ts、src/usage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、adapter、index、discovery、alignment及usage关键路径。
- 下一步：- 已检查固定源码与作者材料。
- 未访问目标云端、执行模型、测试或宿主安装。
- 实时目录、套餐、工具能力和代际兼容未知。

**分析版本**

- **仓库**：[Asheblog/dsh-ollama-cloud](https://github.com/Asheblog/dsh-ollama-cloud)
- **版本号**：0.4.2（[固定提交 2230ae4](https://github.com/Asheblog/dsh-ollama-cloud/tree/2230ae4d77eeff2f8347993b62bd69f9c1e13916)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出统一端点时效和验证状态的未验证设计，用误选与过期额度判断实验检验，而非把更多状态展示自动视为收益。

- 已检查固定源码与作者材料。
- 未访问目标云端、执行模型、测试或宿主安装。
- 实时目录、套餐、工具能力和代际兼容未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1640 | — | — | 21748 |
| .js | source | 17 | 4542 | 3099 | 1366 | — |
| .mjs | source | 4 | 320 | 210 | 84 | — |
| .ts | source | 16 | 3762 | 2155 | 1342 | — |
| .ts | test | 18 | 3337 | 2795 | 246 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Asheblog/dsh-ollama-cloud/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Ollama Cloud接入能否保留官方适配器能力并可靠呈现目录和配额？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比手配OpenAI兼容端点，此接入多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已使用Ollama云模型或自建兼容服务的DSH用户，合格结果是选择实际存在的模型、正确传递可用推理档位并完成同一聊天任务。手配兼容URL可解决基础对话，此插件增加原生tags/show发现、档位映射、目录刷新和配额界面。核心聊天继承官方PiAiAdapter，不应把上游协议转换算作本插件原创。增量是把端点特有元信息变为宿主可用选择与运维反馈。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:5-9](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/README.zh.md#L5-L9)

列明兼容聊天、原生发现及动态目录目标。

```text
DeepSeek Harness 的 Ollama Cloud 供应商插件：装完即用，并且**每个模型的思维链强度都是可调的**。

聊天走 Ollama 的 OpenAI 兼容接口（`https://ollama.com/v1`），模型发现走它自己的原生接口（`/api/tags`、`/api/show`），Web 搜索/抓取则注册成 Harness 的 `ctx.web` 能力。每个模型对外公布的思考档位（off / low / high / max 等）直接来自 Ollama 对该模型的 `thinking` 元数据，所以 composer 里的 Effort 选择器调的是真实能力，不是猜的。

模型目录同样不随插件版本冻结：**每次装载时插件都会问配置的端点当前提供哪些模型，并把答案用在本次会话里**，同时缓存给下次启动；长时间运行的会话还会按间隔再刷。于是 Ollama 新增、下架或改了档位的模型，都不需要等插件更新。
```

**依据 2 · 源码核查**：[src/adapter.ts:97-115](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/adapter.ts#L97-L115)

聊天构造官方PiAiAdapter，明确归属。

<details>
<summary>查看原文（19行）</summary>

```text
  /** The delegated adapter for the current connection facts. */
  private current(): AdapterSnapshot {
    const options = this.config.options()
    if (this.snapshot !== undefined && this.snapshot.options === options) return this.snapshot
    const profile = createPiAiProfile(options)
    const profiles = new Map([[options.provider, profile]])
    const adapter = new PiAiAdapter({
      profiles: () => profiles,
      resolveApiKey: () => this.config.resolveApiKey(options),
      auth: this.auth,
      ...this.config.resolveAttachments === undefined
        ? {}
        : { resolveAttachments: this.config.resolveAttachments },
      ...this.config.onReplayDegrade === undefined
        ? {}
        : { onReplayDegrade: this.config.onReplayDegrade },
    })
    this.snapshot = { options, adapter }
    return this.snapshot
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据、目录、聊天和配额怎样相连？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

宿主注册ollama-cloud适配器，adapter以当前connection对象构造快照；prepareCall将模型信息和stream绑定同一代，避免配置改动让飞行请求混用。缺指定凭据时明确抛MISSING_CREDENTIAL，未指定引用才允许无认证本地服务。发现按tags列模型并分批show读取能力，404/410删除，其他暂时失败保留只含id条目。配额从remaining_percent转成usedFraction供RPC，账户key由宿主解析。依赖llm及共享PiAiAdapter，配额UI另需connection通道，搜索另需web服务。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:145-160](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/adapter.ts#L145-L160)

同代prepare与委托stream。

<details>
<summary>查看原文（16行）</summary>

```text
  override async prepareCall(
    provider: string,
    model: string,
    signal?: AbortSignal,
  ): Promise<PreparedAdapterCall> {
    const snapshot = this.current()
    const prepared = await snapshot.adapter.prepareCall(provider, model, signal)
    return {
      model: withDefaultEffort(prepared.model, model, snapshot.options),
      stream: (options: GenerateOptions) => prepared.stream(options),
    }
  }

  /** @returns the chunk stream from the delegated adapter. */
  override stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    return this.current().adapter.stream(options)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:134-147](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/index.ts#L134-L147)

明确凭据缺失错误。

<details>
<summary>查看原文（14行）</summary>

```text
export function createRouteApiKeyResolver(
  resolveCredential: ResolveCredential,
): (facts: ConnectionOptions) => Promise<string | undefined> {
  return async (facts) => {
    const reference = facts.apiKeyEnv
    if (reference === undefined) return undefined
    const key = await resolveCredential(reference)
    if (key !== undefined) return key
    throw new LlmError(
      `llm-ollama-cloud: no API key for provider route "${PROVIDER}";`
      + ` its configuration resolves "${reference}", which is not set —`
      + ' store it through the credentials service (the Models page or plugin settings) or export it,'
      + ' and clear the reference only if the endpoint authenticates on its own',
      'MISSING_CREDENTIAL',
```

</details>

**依据 3 · 源码核查**：[src/discovery.ts:288-325](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/discovery.ts#L288-L325)

发现列表及缺失/暂态区分。

<details>
<summary>查看原文（38行）</summary>

```text
  const listing = await deps.fetch(`${base}/tags`, {
    headers,
    redirect: 'error',
    signal: attemptSignal(signal, timeoutMs),
  })
  if (!listing.ok) {
    await listing.body?.cancel()
    throw new Error(`ollama-cloud discovery: ${base}/tags answered ${listing.status}`)
  }
  const ids = decodeTagsResponse(await listing.json())

  const entries: OllamaModelEntry[] = []
  const described: string[] = []
  for (let start = 0; start < ids.length; start += DETAIL_CONCURRENCY) {
    const batch = ids.slice(start, start + DETAIL_CONCURRENCY)
    const details: DetailResult[] = await Promise.all(
      batch.map(async (id): Promise<DetailResult> => {
        try {
          const answer = await postJson(`${base}/show`, { model: id }, headers, deps, signal, timeoutMs)
          if (!answer.ok) return { id, missing: MISSING_STATUSES.has(answer.status) }
          return { id, entry: decodeShowResponse(id, answer.body), missing: false }
        } catch (error) {
          if (signal?.aborted === true) throw error
          return { id, missing: false }
        }
      }),
    )
    for (const detail of details) {
      if (detail.missing) continue
      if (detail.entry === undefined) {
        // No answer yet: the listing still says the model exists, so it is
        // served with only what the listing said.
        entries.push({ id: detail.id })
        continue
      }
      described.push(detail.id)
      entries.push(detail.entry)
    }
```

</details>

**依据 4 · 源码核查**：[src/usage.ts:117-160](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/usage.ts#L117-L160)

remaining和used互补映射。

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * Turn one `remaining_percent` reading into the consumed fraction the panel
 * meters.
 *
 * The endpoint reports what is left and the panel meters what was spent, so
 * the two are complements. A reading is a percentage with two decimals, and
 * the complement of one is not exact in binary floating point — `95.55` leaves
 * `0.04449999999999996` — so it is rounded to six decimals, which keeps the
 * number the endpoint meant on the wire and at the panel's own rounding to a
 * tenth. A reading outside the range is clamped rather than dropped: an
 * overshoot is an artefact of a percentage, not a missing window, and blanking
 * a panel over `100.4%` would hide a reading that is fine.
 *
 * @param remainingPercent - the window's remaining allowance, as reported.
 * @returns the consumed fraction, in `0..1`.
 */
function consumedFraction(remainingPercent: number): number {
  const clamped = Math.min(100, Math.max(0, remainingPercent))
  return Math.round(((100 - clamped) / 100) * 1e6) / 1e6
}

/**
 * Read the window's reset instant, normalized to ISO.
 *
 * An instant the panel cannot read is *no* instant rather than a failure: the
 * panel then falls back to the cadence it documents for that window, which is
 * a worse label than the endpoint's own but never a wrong one.
 */
function readResetInstant(window: Record<string, unknown>): string | undefined {
  const raw = window.resets_at
  if (typeof raw !== 'string' || raw.length === 0) return undefined
  const parsed = Date.parse(raw)
  return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString()
}

/** Decode one window, or `undefined` when it is not a usable window. */
function decodeWindow(id: UsageWindowId, value: unknown): OllamaUsageWindow | undefined {
  if (!isRecord(value)) return undefined
  const remaining = value.remaining_percent
  if (typeof remaining !== 'number' || !Number.isFinite(remaining)) return undefined
  const resetsAt = readResetInstant(value)
  return {
    id,
    usedFraction: consumedFraction(remaining),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动目录和版本对齐何时不足以证明模型可用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

tags存在不代表show完整回答，暂态失败条目仍会保留；能力元信息表达供应商声明，未证明工具调用、视觉或推理档位都在真实任务中生效。官方共享adapter与插件自带pi-ai可能版本漂移，alignment尽力读取manifest并警告，读不到会静默，因而无警告不等于契约兼容。配置快照和失败不删真模型是合理可靠性取舍，但可能暂时显示能力不明条目。README的具体内置模型表仅是固定作者快照，不当作本轮实时可用目录。

#### 证据与依据

**依据 1 · 源码核查**：[src/discovery.ts:315-325](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/discovery.ts#L315-L325)

show失败保留id但未声明能力。

<details>
<summary>查看原文（11行）</summary>

```text
    for (const detail of details) {
      if (detail.missing) continue
      if (detail.entry === undefined) {
        // No answer yet: the listing still says the model exists, so it is
        // served with only what the listing said.
        entries.push({ id: detail.id })
        continue
      }
      described.push(detail.id)
      entries.push(detail.entry)
    }
```

</details>

**依据 2 · 源码核查**：[src/alignment.ts:16-31](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/alignment.ts#L16-L31)

best-effort诊断的非阻塞边界。

<details>
<summary>查看原文（16行）</summary>

```text
 * The route no longer depends on the two copies agreeing (see
 * {@link contextTolerantStreams} in ./profile.ts), but a mismatch still means
 * the harness asks for a contract this build was not written against, so this
 * module turns whatever facts it can reach into one mount-time warning that
 * names the versions. Two limits are deliberate:
 *
 * - **Best effort.** The harness manifest is read through several resolvers
 *   (the host's shared-package resolution, the app's runtime manifest, the
 *   plugin-relative resolver) and any failure is *silence*, never a throw: a
 *   host that hides its manifest must not lose a working route over a
 *   diagnostic. `reportAlignment` logs the loaded version at debug level so the
 *   facts it did reach are still inspectable.
 * - **Build-time first.** A scheduled CI check
 *   (`scripts/check-pi-ai-alignment.mjs`) watches the same boundary against the
 *   published harness, which is the reliable signal; the mount warning only
 *   helps the installations that already carry this code.
```

</details>

#### 缺口

- 固定插件与实际宿主PiAiAdapter代际，以及端点每项模型能力的真实效果未确认。
  **影响**：不能把模型出现和诊断无告警当可用性验收。
  **进一步探讨**：锁宿主、pi-ai和端点版本，以文本、工具、视觉及推理档位矩阵检查流输出与错误恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入与持续使用的负担是否支持试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已有Ollama凭据且可锁宿主版本的用户，以短文本和一个可丢弃工具任务试接入。首次要移除同route的dsh-llm-ollama冲突，配置key和完整重启；持续有模型调用费用、目录发现和配额轮询流量，以及上游升级维护。网络重试、缓存旧目录和人工切回模型也应计入失败成本。没有套餐与同任务账单，不给节省金额。成功需聊天、取消、工具结果和当前档位确实一致，配额方向与供应商页面相符；重复适配器冲突、能力误报或费用不可解释时停止扩大。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:22-37](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/README.zh.md#L22-L37)

凭据、route冲突及按会话档位。

<details>
<summary>查看原文（16行）</summary>

````text
安装后重启 Harness，然后在 **Settings → Models** 里给 Ollama Cloud 填 API Key（写入只写凭据存储），或者直接提供环境变量：

```sh
export OLLAMA_API_KEY=...        # Linux / macOS
$env:OLLAMA_API_KEY = "..."      # Windows PowerShell
```

Key 在 <https://ollama.com/settings/keys> 申请。模型目录与元数据接口是匿名的，所以**没填 Key 也能看到模型列表**，只是发请求会报 `MISSING_CREDENTIAL`。

> **与 `dsh-llm-ollama` 二选一。** 两者都注册 `ollama-cloud` 这条 route，同时安装会在装载时冲突（`DUPLICATE_ADAPTER`）。装本插件前请先从 profile 的 bundles 里移除 `dsh-llm-ollama`。

## 用法

1. 在 composer 的模型选择器（或 `/model`）里选一个 `ollama-cloud` 模型。
2. 同一个菜单里选**推理强度**：可选项随模型变化，默认值取自 Ollama 的模型默认值。
3. 思考内容会像其他供应商一样出现在会话里；强度是**按会话**保存的，运行中的回合保留它开始时的档位。
````

</details>

**依据 2 · 源码核查**：[src/usage.ts:50-60](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/usage.ts#L50-L60)

配额读取有超时及一次暂态重试延迟。

<details>
<summary>查看原文（11行）</summary>

```text
/** Default per-attempt budget for a usage read, matching the other non-chat requests. */
export const DEFAULT_USAGE_TIMEOUT_MS = 15000

/**
 * Delay before the one retry a transient failure earns.
 *
 * Short on purpose: what this exists for is an upstream — or a proxy in front
 * of it — hiccup, and the panel is a background read, so the cost of waiting is
 * paid by an element nobody is staring at.
 */
export const RETRY_DELAY_MS = 500
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否把目录与配额的时效显式绑定给用户？

**研究主题**：新假设与验证

#### 完整回答

现有能力依赖实时发现、缓存和可暂时保留的配额读数，推导未验证方案是给选择器和配额统一附上端点身份、采集时间、fresh/stale及已验证能力，并把异常刷新与正在使用模型分离。可能避免用户把旧目录或旧额度视为当前承诺，代价是更多状态和UI解释。最小实验模拟tags失败、show暂态错误、模型下架与balance不支持，比较误选率和用户对剩余额度的理解；如果标签仍不能帮助识别过期或造成错误阻断，就削弱方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/discovery.ts:257-268](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/discovery.ts#L257-L268)

发现明确区分暂态与退役，为时效状态提供依据。

<details>
<summary>查看原文（12行）</summary>

```text
 * Three outcomes are kept apart, because they mean different things:
 *
 * - **described** — the endpoint answered; the entry carries its metadata.
 * - **retired** — the endpoint answered 404/410 for a model its own listing
 *   still names: it is gone, so it is left out of the catalog rather than
 *   offered and left to fail at request time.
 * - **unknown** — the detail request timed out or failed some other way. The
 *   model is kept, undeclared, and the next pass describes it; dropping a real
 *   model because one request was slow would hide it for a whole interval.
 *
 * A refused *listing* fails the whole call, so a caller reports the endpoint
 * problem instead of showing an empty catalog.
```

</details>

**依据 2 · 源码核查**：[src/usage.ts:78-84](https://github.com/Asheblog/dsh-ollama-cloud/blob/2230ae4d77eeff2f8347993b62bd69f9c1e13916/src/usage.ts#L78-L84)

配额快照已有fetchedAt可用。

```text
/** One decoded allowance snapshot. */
export interface OllamaUsageSnapshot {
  /** When this plugin read the endpoint. */
  readonly fetchedAt: string
  /** Windows the endpoint reported, in {@link USAGE_WINDOW_IDS} order. */
  readonly windows: readonly OllamaUsageWindow[]
}
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
