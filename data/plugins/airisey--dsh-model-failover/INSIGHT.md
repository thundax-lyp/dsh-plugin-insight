# dsh-model-failover

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[20ed700](https://github.com/Airisey/dsh-model-failover/tree/20ed700e79dca02f1e54352de7bc763f59ec0191)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover)
<!-- END META -->

> **实现功能**：为 DSH 添加按优先级切换真实模型的 provider 路由、隔离状态与继续控制。

> **核心亮点**：相对失败后人工换模型，增量是流级提交点、错误分类与队列状态组合，避免切换前把两个候选的文本混写；包装provider模式有已知同类来源，不宣称首次。[Q01](#research-q01)

> **风险与缺陷**：不可见不代表上游没有计费或计算，长reasoning失败后丢弃再调用会增加成本和等待；可见文本/工具chunk后就不再隐式切换，不能承诺任务全程无中断。[Q03](#research-q03)

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
  - [Q01 · 自动切换最重要的增量是什么？](#detail-section-11)
  - [Q02 · 什么时候可以切换，什么时候必须停止？](#detail-section-12)
  - [Q03 · 无声切换是否等于无成本和不中断？](#detail-section-13)
  - [Q04 · 什么试用范围能避免把恢复变成重复执行？](#detail-section-14)
  - [Q05 · 预算感知策略能否优于固定队列？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已配置多个供应商、遇到额度或连接失败需要继续任务的用户；合格结果是不拼接不同候选的可见答案，且失败、费用和实际模型可追溯。

宿主原生重试或用户手动选模型更简单，但要人工处理已输出内容和任务上下文。插件按流提交边界自动化部分切换，不能替代输出质量与工具副作用验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 流级候选接力 | 输出前失败切换 | 提交后不隐式重放，依赖chunk协议 |
| 模板与隔离 | 保存优先级和失败状态 | 按会话/模板逻辑日，非质量保证 |
| 自动继续 | 处理截断/部分失败 | 有次数上限，可能增加费用与重复风险 |
| 状态面板 | 核对实际候选与日志 | 出字/探测不代表任务合格 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm服务与流协议 | 必需 | 注册包装provider及嵌套调用 | 不加载或协议不兼容 |
| 至少一个已配置真实模型 | 必需 | 实际生成 | 队列空或全部失败返回错误 |
| 多模型能力兼容与预算 | 切换效果必需 | 接续上下文/工具 | 能出字不保证任务合格 |
| WebServer | 设置页面需，非硬依赖 | 配队列和查状态 | headless接力仍可运行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置真实模型、模板和重试预算 | 队列有效且无递归路由 |
| 2 | 选择模型接力路由并执行可控任务 | 核对实际模型与隔离日志 |
| 3 | 失败/截断后核对提交状态及继续次数 | 已可见输出不盲重放工具；需要时人工接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多供应商账号/模型费用未知 | 配能力兼容队列与预算 | 试连接也可能产生调用费 |
| 持续使用 | 失败候选、reasoning缓存和重试均消耗资源 | 复核模型与任务质量 | 没有合格任务费用对照 |
| 失败恢复 | 同模型重试、继续及隔离状态 | 核对实际请求与外部工具副作用 | 可取消，不保证提交后自动接续 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输出前切换 | chunk缓存和提交点存在 | 真实协议组合下无拼接保证 |
| 隔离与错误分类 | 取消/不可切换错误有分支 | 总完成率与净费用改善 |
| 有界继续 | 次数上限和截断处理 | 跨模型答案质量与重复动作 |

> **思考**：不可见不代表上游没有计费或计算，长reasoning失败后丢弃再调用会增加成本和等待；可见文本/工具chunk后就不再隐式切换，不能承诺任务全程无中断。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对失败后人工换模型，增量是流级提交点、错误分类与队列状态组合，避免切换前把两个候选的文本混写；包装provider模式有已知同类来源，不宣称首次。[Q01](#research-q01)

相对失败后人工换模型，增量是流级提交点、错误分类与队列状态组合，避免切换前把两个候选的文本混写；包装provider模式有已知同类来源，不宣称首次。[Q01](#research-q01)

提交点显式化是可借鉴核心；tool-call-delta也触发提交有助于防止工具开始后悄悄换模型。插件向宿主声明零重试，避免外层再跑整队列。代价是依赖chunk语义和供应商错误分类，必须测各协议，而不是仅看能出字。

<a id="detail-section-5"></a>

### 1.4 主要限制

不可见不代表上游没有计费或计算，长reasoning失败后丢弃再调用会增加成本和等待；可见文本/工具chunk后就不再隐式切换，不能承诺任务全程无中断。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可用只读小任务和有上限预算试用。先关高次数自动继续，核对实际模型与失败调用费用；涉及写文件或外部服务时，提交后失败应人工确认，不盲目重跑。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/adapter.js、lib/health.js、lib/autocontinue.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查provider入口、候选缓存提交、取消/错误/隔离和重试控制；未用真实供应商或执行故障测试。
- 下一步：用固定流夹具覆盖reasoning后失败、工具开始、可见文本后失败、取消、上下文错误及全隔离，再用同预算真实任务对照人工切换；当前均未执行。

**分析版本**

- **仓库**：[Airisey/dsh-model-failover](https://github.com/Airisey/dsh-model-failover)
- **版本号**：1.0.0（[固定提交 20ed700](https://github.com/Airisey/dsh-model-failover/tree/20ed700e79dca02f1e54352de7bc763f59ec0191)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是按任务预算和候选失败成本决定重试/切换，并展示累计丢弃调用资源，可减少盲重试；固定预算故障对照中合格率不增或等待更长则否定。[Q05](#research-q05)

用固定流夹具覆盖reasoning后失败、工具开始、可见文本后失败、取消、上下文错误及全隔离，再用同预算真实任务对照人工切换；当前均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 5135 | 3259 | 1558 | — |
| .md | source | 1 | 315 | — | — | 6971 |
| .mjs | test | 4 | 4978 | 3966 | 460 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Airisey/dsh-model-failover/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Airisey/dsh-model-failover 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动切换最重要的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

手动换模型容易把失败候选的半段答案和新答案混在一起。插件在llm包装provider层缓存首个可见答案前的chunk，失败时整批丢弃后切下一候选，因而向调用方提供清晰提交边界。源码承认该包装模式来自已有同类，贡献是边界和队列管理的组合，不能归为全新路由范式。任务成功仍需模型理解上下文与工具契约。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:13-25](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L13-L25)

模式参照与缓存提交目的。

<details>
<summary>查看原文（13行）</summary>

```text
 * 本插件是「包装路由」（wrapper route）：在自己的 stream() 体内再调用一次
 * ctx.llm.stream()，把 provider/model 换成队列里的真实模型。modlens、
 * vision-router 用的都是这个模式，dsh-cost-meter 的注释里把它写得很明确。
 *
 * 整个设计的关键只有一条 —— **提交点**：
 * 候选模型产出的 chunk 先全部扣在手里，直到出现「用户会看见的答案内容」
 * （非空白 text-delta、tool-call-delta，或非 reasoning 的 block-end）才整批
 * 放行。在此之前失败，这一整轮就被整根丢掉，调用方一个字节都没看见，于是
 * 换模型是无声的、不会把两个模型的文字拼在一起。
 *
 * reasoning 的 delta 故意不算提交点：「思考了一分钟然后撞上额度墙」正是最
 * 值得切换的情形，扣住的思考跟着这一轮一起丢，调用方根本不知道发生过。
 */
```

</details>

**依据 2 · 源码核查**：[index.js:4-20](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/index.js#L4-L20)

注册路由及Host设置边界。

<details>
<summary>查看原文（17行）</summary>

```text
 * 这个插件只做一件事：往宿主 llm 服务里注册一条名为 `model-failover` 的
 * provider 路由，并在那条路由下挂一个模型（id `auto`）。用户在模型选择器里
 * 选中「模型接力 / 自动接力」以后，每次模型调用都会进入 lib/adapter.js 的
 * 队列：按设置页排好的优先级依次尝试真实模型，失败的按当日为单位隔离。
 *
 * 为什么是「注册一条路由」而不是「改写 agent loop 的默认模型」：
 *   - 模型选择器是路由导向的（分组严格按 provider 路由），注册路由就能让
 *     插件以「一个模型」的身份出现在设置里，正是需求要的形态；
 *   - 队列顺序属于用户的运行时状态，写进 profile 的 cordis 配置只会让
 *     「重置今天的隔离」变成一次配置热重载；
 *   - 宿主在 llm 层已经把「一次调用」抽象成一条流，包装整条流是唯一能保证
 *     「换模型对调用方不可见」的位置（见 lib/adapter.js 的提交点说明）。
 *
 * 设置页的读写在同一个 host 进程里通过插件自己的同源 HTTP 路由
 * `${API_PREFIX}/*` 完成 —— 浏览器半身（client.js）是一个手写的 ModuleLoader
 * bundle，它不走 Remote 绑定，只 fetch 这些路由。这条路径与 dsh 版本无关，
 * 也不依赖任何未公开的类型化接口。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 什么时候可以切换，什么时候必须停止？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

非空白text-delta、tool-call-delta或非reasoning block-end触发提交，随后chunk直接透传；提交前才可丢弃候选。用户取消和不可切换请求错误返回原结局，不继续撞墙；截断有独立继续处理，失败候选在重试耗尽后才隔离。外层providerRetryPolicy设零重试防宿主重复跑整队列。正常/异常链路明确，但真实协议仍需同版本验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:93-107](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L93-L107)

提交判据包含工具chunk。

<details>
<summary>查看原文（15行）</summary>

```text
 * 这个 chunk 是否代表「调用方已经看见了答案」。
 *
 * 判据与宿主 assistant-stream 的可见性定义对齐：只有非空白的文本才是答案，
 * 流式工具调用一旦开始就意味着这轮已经有产品，reasoning 与它的 block-end
 * 都不算 —— 让 reasoning 的 block-end 提交，会把队列钉死在它本该熬过去的
 * 那次失败之前一个 chunk。
 */
export function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
```

</details>

**依据 2 · 源码核查**：[lib/adapter.js:230-238](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L230-L238)

关闭外层自动重试。

```text

  /**
   * 接力队列自己做重试与切换，所以这条路由对外声明「不做重试」。
   *
   * 否则 llm-retry 会把整条队列再跑一遍：每一轮都要等每个坏模型各自超时，
   * 延迟成倍放大，而队列本身已经把「所有候选都试过」这件事做完了。
   */
  providerRetryPolicy(_provider) {
    return { mode: 'normal', maxRetries: 0, retryableCodes: [NEVER_RETRY], ...DEFAULT_BACKOFF }
```

**依据 3 · 源码核查**：[lib/adapter.js:568-598](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L568-L598)

取消、不可切换和隔离顺序。

<details>
<summary>查看原文（31行）</summary>

```text
      // 用户自己按了停止：换模型救不回来，把真实结局原样交出去。
      if (options?.signal?.aborted === true || failure?.code === 'ABORTED') {
        for (const chunk of held) yield chunk
        return
      }

      // 请求本身的问题（上下文超长之类）：换模型只会再撞一次墙。
      if (failure !== undefined && NON_FAILOVER_CODES.has(failure.code)) {
        for (const chunk of held) yield chunk
        this.log.warn(`model-failover: ${provider}/${model} 以不可切换的错误结束 (${failure.code})`)
        return
      }

      // 这个候选还有一次「继续」没用完：先别判它今天不行。
      //
      // 隔离的语义是「今天它出不了东西」，而这要等它的重试都用完才能下结论：
      // 失败一次、被一句「继续」叫起来接着写完的模型是**能用**的，把它隔离掉
      // 反而会让今天的任务从这里绕开一个明明好好的模型。只有队列里的下一个
      // 步骤换人了（或者没有下一步了），才说明这个候选这次真的交不出东西。
      const next = steps[index + 1]
      if (next !== undefined && next.candidate.provider === provider && next.candidate.model === model) continue

      // 这个候选今天出了问题 —— 隔离到下一个逻辑日，后面的任务不会再从它开始。
      this.health.markBroken(key, {
        code: failure?.code,
        message: failure?.message,
        at: this.now(),
        sessionId,
        templateId,
      })
      this.health.file.flush()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 无声切换是否等于无成本和不中断？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不等于。reasoning可在提交前被丢弃，但上游已消耗计算和可能计费。用户看不到失败内容，等待和总费用仍存在。提交后的失败不再跨候选重试，避免拼接及工具重复，这也意味着无法兑现全程自动无中断。每个模型能力和reasoning档位有区别，候选接续不证明交付质量相同。当前仅源码支持此设计取舍，没有真实供应商费用或错误率数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:17-24](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L17-L24)

不可见reasoning也会被丢弃。

```text
 * 整个设计的关键只有一条 —— **提交点**：
 * 候选模型产出的 chunk 先全部扣在手里，直到出现「用户会看见的答案内容」
 * （非空白 text-delta、tool-call-delta，或非 reasoning 的 block-end）才整批
 * 放行。在此之前失败，这一整轮就被整根丢掉，调用方一个字节都没看见，于是
 * 换模型是无声的、不会把两个模型的文字拼在一起。
 *
 * reasoning 的 delta 故意不算提交点：「思考了一分钟然后撞上额度墙」正是最
 * 值得切换的情形，扣住的思考跟着这一轮一起丢，调用方根本不知道发生过。
```

**依据 2 · 源码核查**：[lib/adapter.js:730-740](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L730-L740)

提交后直接透传边界。

<details>
<summary>查看原文（11行）</summary>

```text
        if (committed) {
          yield chunk
          continue
        }
        held.push(chunk)
        if (commitsAnswer(chunk)) {
          committed = true
          for (const pending of held) yield pending
          held.length = 0
        }
      }
```

</details>

**依据 3 · 源码核查**：[lib/adapter.js:630-660](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L630-L660)

候选档位需要单独适配。

<details>
<summary>查看原文（31行）</summary>

```text
  /**
   * 这一轮该给这个候选带什么思考强度。
   *
   * 规则只有一条：**只发这个模型自己声明支持的档位**。
   *
   * 宿主在调用适配器之前会拿我对外声明的档位表（队列的并集）校验一次性
   * `reasoningEffort`，但候选模型各自的小表才算数 —— 把一个它不认识的枚举值
   * 发下去，适配器会以 UNSUPPORTED_REASONING_EFFORT 拒绝整个请求，那等于把
   * 一个本来好好的模型判成「今天出不了东西」而被隔离。
   *
   * 认不出来（还没问到档位表，或确实不支持）就不发，让目标模型用自己的默认
   * 档位 —— 也就是它平时的表现。
   *
   * 优先级：队列里给这个模型设的档位 > 调用方给「模型接力」这条路由选的档位。
   * 前者是这个模型的专属选择，后者是「这一轮大家统一用哪个档位」的意图，所以
   * 用户为某个模型明确设过的值不会被它盖掉；反过来，没设过的模型会跟着路由
   * 的档位走，而不是默默用默认档位。
   */
  #effortFor(candidate, requested) {
    const known = this.catalog.reasoningFor(candidate.provider, candidate.model)
    const supported = (value) => known !== undefined && known.efforts.some((effort) => effort.id === value)
    const configured =
      typeof candidate.reasoningEffort === 'string' && candidate.reasoningEffort !== ''
        ? candidate.reasoningEffort
        : undefined
    if (configured !== undefined) {
      if (supported(configured)) return configured
      this.log.warn(
        `model-failover: ${candidate.provider}/${candidate.model} 不认识档位「${configured}」，这一轮改用它的默认档位`,
      )
      return undefined
```

</details>

#### 缺口

- 同预算完成率、额外费用和流协议兼容未知
  **影响**：决定是否值得持续采用
  **进一步探讨**：用相同任务和预算比较原生重试、人工切换与接力，计入所有失败调用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么试用范围能避免把恢复变成重复执行？

**研究主题**：效果与总成本、采用判断

#### 完整回答

从只读任务和少数已核对能力的候选开始，限制同模型重试和自动继续；记录所有尝试而非只算最终成功调用。工具开始已触发提交，失败后应核对现实副作用，不能重新启动整个任务假定前一轮未发生。队列模板和隔离减少人工操作，但诊断模型、维护权限与费用仍是用户责任，没有现金与耗时数据不宣称省钱。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:93-107](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L93-L107)

工具chunk提交支撑谨慎恢复。

<details>
<summary>查看原文（15行）</summary>

```text
 * 这个 chunk 是否代表「调用方已经看见了答案」。
 *
 * 判据与宿主 assistant-stream 的可见性定义对齐：只有非空白的文本才是答案，
 * 流式工具调用一旦开始就意味着这轮已经有产品，reasoning 与它的 block-end
 * 都不算 —— 让 reasoning 的 block-end 提交，会把队列钉死在它本该熬过去的
 * 那次失败之前一个 chunk。
 */
export function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
```

</details>

**依据 2 · 源码核查**：[index.js:68-87](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/index.js#L68-L87)

继续与探测上限是成本控制而非免费保证。

<details>
<summary>查看原文（20行）</summary>

```text
/** 「自动继续」连续补发次数的硬上限：再大就只是把同一堵墙撞更多次。 */
const AUTO_CONTINUE_HARD_LIMIT = 20

/** 「继续」前的等待秒数上限：再多就不如让用户自己决定什么时候重试了。 */
const CONTINUE_DELAY_HARD_LIMIT = 300

/** 同一个模型额外重试几次的上限，和 lib/constants.js 的 MAX_SAME_MODEL_RETRIES 一致。 */
const SAME_MODEL_RETRIES_HARD_LIMIT = MAX_SAME_MODEL_RETRIES

/**
 * 试连接时的输出上限。
 *
 * 试连接只需要证明「连得上、能出字」，不需要它写完一句话。压到 8 个 token，
 * 一次探测的花销就跟用户随手打一句问候差不多；被截断也算通（说明它在正常
 * 写字），所以不会因为上限太小而误报失败。
 */
const PROBE_MAX_TOKENS = 8

/** 单个模型试连接的等待上限。超过就当作「连不上」，免得一个卡死的供应商拖住整轮测试。 */
const PROBE_TIMEOUT_MS = 15_000
```

</details>

**依据 3 · 源码核查**：[lib/adapter.js:599-612](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L599-L612)

日志实际记录继续数用于核对。

<details>
<summary>查看原文（14行）</summary>

```text
      this.log.push({
        at: this.now(),
        kind: 'quarantine',
        provider,
        model,
        // 事件日志里也带上会话：隔离是按会话算的，没有这个字段就分不清某一行
        // 是哪个会话撞的墙。模板同理 —— 一个模板一条队列。
        sessionId,
        templateId,
        code: failure?.code ?? CODE_NO_VISIBLE_OUTPUT,
        message: failure?.message ?? '',
        // 如实记录这一跳**实际**带了几条「继续」—— 本机网络没通时它是 0，
        // 而不是 plan() 里排的那个数。事件日志是排查问题的依据，不能写计划值。
        continues,
```

</details>

#### 缺口

- 候选任务质量与失败总成本未测
  **影响**：试用不能升级为持续安装推荐
  **进一步探讨**：先记录小任务的合格率、总费用、延迟与人工接管次数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 预算感知策略能否优于固定队列？

**研究主题**：新假设与验证

#### 完整回答

未验证假设在每次切换前核对任务剩余预算、该候选历史失败成本与能力匹配，同时展示被丢弃调用的累计资源。现有固定重试次数与每日隔离只粗略控制失败，不能判断本任务重试是否划算。以同一故障注入任务和现金上限比较合格完成数、等待和人工接管；若策略估计误差导致更差完成率或更长等待，则否定，不把隐藏失败当可靠性提升。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:44-53](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L44-L53)

固定重试策略是比较基线。

<details>
<summary>查看原文（10行）</summary>

```text
 * 同一个模型最多试几次（含第一次）。
 *
 * 旧配置里只有一个布尔开关 `retrySameModelOnce`，它表达的是「多试一次」；
 * 现在这件事要能调，因为同一个模型背后可能是好几个账号。没设过新键时按
 * 老开关折算：关掉过就是只试一次，否则用默认值。
 */
function sameModelTries(settings) {
  const raw = settings?.sameModelRetries
  if (Number.isInteger(raw) && raw >= 0) return Math.min(raw, MAX_SAME_MODEL_RETRIES) + 1
  return (settings?.retrySameModelOnce === false ? 0 : 2) + 1
```

</details>

**依据 2 · 源码核查**：[lib/adapter.js:590-615](https://github.com/Airisey/dsh-model-failover/blob/20ed700e79dca02f1e54352de7bc763f59ec0191/lib/adapter.js#L590-L615)

按日隔离提供可扩展但粗粒度的状态。

<details>
<summary>查看原文（26行）</summary>

```text
      // 这个候选今天出了问题 —— 隔离到下一个逻辑日，后面的任务不会再从它开始。
      this.health.markBroken(key, {
        code: failure?.code,
        message: failure?.message,
        at: this.now(),
        sessionId,
        templateId,
      })
      this.health.file.flush()
      this.log.push({
        at: this.now(),
        kind: 'quarantine',
        provider,
        model,
        // 事件日志里也带上会话：隔离是按会话算的，没有这个字段就分不清某一行
        // 是哪个会话撞的墙。模板同理 —— 一个模板一条队列。
        sessionId,
        templateId,
        code: failure?.code ?? CODE_NO_VISIBLE_OUTPUT,
        message: failure?.message ?? '',
        // 如实记录这一跳**实际**带了几条「继续」—— 本机网络没通时它是 0，
        // 而不是 plan() 里排的那个数。事件日志是排查问题的依据，不能写计划值。
        continues,
      })
      this.log.warn(
        `model-failover: ${provider}/${model} 无法输出 (${failure?.code ?? CODE_NO_VISIBLE_OUTPUT})，隔离到明天 ${settings.resetHour} 点`,
```

</details>

#### 缺口

- 预算数据和新策略未实现验证
  **影响**：不能计入当前贡献或经济收益
  **进一步探讨**：先离线回放固定调用账单与失败轨迹比较。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
