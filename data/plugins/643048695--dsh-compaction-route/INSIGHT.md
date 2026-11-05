# dsh-compaction-route

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5a04121](https://github.com/643048695/dsh-compaction-route/tree/5a041215c4769a8dc2432ce54f0645f0687d6be3)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 为会话压缩选择主摘要模型及失败后的备用模型。

> **亮点**：[Q01](#research-q01) 将摘要路由与普通对话分开，提供终止错误后的备用。

> **主要限制**：[Q02](#research-q02) 仅指定错误结果重试，备用仍会收到历史。

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
  - [Q01 · 哪些调用会换目标？](#detail-section-11)
  - [Q02 · 哪些失败无效或增加代价？](#detail-section-12)
  - [Q03 · 怎样试用和退出？](#detail-section-13)
  - [Q04 · 怎样避免误判实际路由？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要处理 DSH 长历史压缩失败的开发者。

沿用宿主摘要配置，手工缩短历史或改模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 摘要路由 | 选择压缩目标 | 须有 compaction purpose 与主模型 |
| 备用 | 处理指定终止错误 | 取消和抛出错误不重试 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 提供 stream waterfall | 保持原摘要 |
| 主模型 | 启用必需 | 压缩首选 | 未配置时透传 |
| 备用模型 | 可选 | 指定错误后重试 | 无备用则返回原结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选隔离会话和允许的模型 | 不使用敏感历史 |
| 验证 | 操作者注入终止错误和取消 | 核对实际调用 |
| 退出 | 用户禁用或清空主目标 | 确认原摘要恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 测试请求费用未知 | 配置窗口与授权 | 未实测 |
| 持续 | 最多两路尝试的费用待测 | 复核日志和模型 | 取决于失败率 |
| 恢复 | 重复请求消耗未知 | 改窗口或缩历史 | 不盲目重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 路由 | 压缩 purpose 才接管 | 真实宿主是否标记 |
| 备用 | 终止错误后下一目标 | 实际压缩成功率 |

> **思考**：[Q02](#research-q02) 仅指定错误结果重试，备用仍会收到历史。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将摘要路由与普通对话分开，提供终止错误后的备用。

[Q01](#research-q01) 使用自调用标记避免在全局 waterfall 无限递归。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 仅指定错误结果重试，备用仍会收到历史。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用允许发送的虚拟历史验证。[Q02](#research-q02) 同时检查取消和备用费用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定代码与作者测试边界，未运行宿主。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主入口、包及配置说明，未执行插件。
- 下一步：验证普通请求透传、主错误触发备用、抛错和取消不重试。

**分析版本**

- **仓库**：[643048695/dsh-compaction-route](https://github.com/643048695/dsh-compaction-route)
- **版本号**：0.2.1（[固定提交 5a04121](https://github.com/643048695/dsh-compaction-route/tree/5a041215c4769a8dc2432ce54f0645f0687d6be3)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 关联配置目标与实际尝试以减少错误归因。

验证普通请求透传、主错误触发备用、抛错和取消不重试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 376 | — | — | 4713 |
| .js | source | 2 | 685 | 482 | 157 | — |
| .mjs | test | 1 | 174 | 142 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：压缩路由是否改变历史重放的恢复与成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些调用会换目标？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

长会话压缩因默认摘要模型容纳不下重放时，用户可将摘要改走另一模型，而无需改变主要对话路由。插件仅拦截指定 compaction purpose，有主目标时重新调用 llm.stream，覆盖目标及可选 effort。它标记新调用对象避免重入循环。没有主目标即透传，备用不会单独触发。区别于改宿主摘要配置，插件提供一条错误后备用路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:183-219](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/lib/index.js#L183-L219)

无主配置和 purpose 过滤

<details>
<summary>查看原文（37行）</summary>

```text
  /** Read the routing plan. Called per compaction so a settings edit applies at once. */
  const plan = () => {
    if (plain(settings.enabled, true) !== true) return undefined
    const primary = parseTarget(plain(settings.primary, NO_TARGET))
    // A fallback without a primary is meaningless — there is nothing to fail — and
    // treating it as the primary would silently route compaction somewhere the
    // person never chose. No primary means this plugin stays transparent.
    if (primary === undefined) return undefined
    const chain = [primary]
    const fallback = parseTarget(plain(settings.fallback, NO_TARGET))
    if (fallback !== undefined) chain.push(fallback)
    return {
      chain,
      effort: plain(settings.effort, 'high'),
      log: plain(settings.log, true) === true
    }
  }

  ctx.inject(['llm'], (scope) => {
    const llm = scope.llm
    if (llm === undefined) {
      ctx.logger?.warn('[compaction-route] no llm service; compaction routing stays inert')
      return
    }

    /**
     * The waterfall listener. Async generator: the value returned here IS the
     * chunk stream the caller iterates.
     */
    const handler = async function * (options, next) {
      if (options === null || typeof options !== 'object') return yield * next()
      if (options.purpose !== COMPACTION_PURPOSE) return yield * next()
      // Our own retry re-enters the waterfall; hand it straight to the adapter.
      if (OWN_CALLS.has(options)) return yield * next()

      const route = plan()
      if (route === undefined) return yield * next()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:225-237](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/lib/index.js#L225-L237)

调用重写与重入标记

<details>
<summary>查看原文（13行）</summary>

```text
      for (let index = 0; index < chain.length; index += 1) {
        const target = chain[index]
        const isLast = index === chain.length - 1
        const call = {
          ...options,
          ...target,
          ...effort === undefined ? {} : { reasoningEffort: effort }
        }
        OWN_CALLS.add(call)

        let chunks
        try {
          chunks = await collectAttempt(llm.stream(call))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:272-277](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/lib/index.js#L272-L277)

实际 waterfall 注册

```text
    // \`prepend\` makes this the outermost listener so it wraps every inner
    // middleware and the adapter itself; \`global\` keeps it visible to dispatches
    // from any scope (the compaction engine mounts inside each agent preset's
    // isolated realm).
    scope.on('llm/stream', handler, { global: true, prepend: true })
    ctx.logger?.info('[compaction-route] mounted; configure it in Settings -> Plugins')
```

**依据 4 · 作者声明**：[README.md:39-47](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/README.md#L39-L47)

作者定义用途

```text
## What it does

Listens on the `llm/stream` waterfall — the single seam every model call passes through — and for `purpose === "compaction"` requests **only**:

1. rewrites the target to the configured **primary**;
2. if that attempt ends in a terminal error chunk, retries the same request on the **fallback**;
3. yields the first attempt that succeeds, or the last attempt's outcome.

Every other request — chat turns, subagents, session titles, web search — falls straight through untouched.
```

#### 缺口

- 未在目标宿主捕获真实 purpose 或摘要请求
  **影响**：无法判断目标版本是否走相同入口
  **进一步探讨**：在隔离宿主对照普通聊天和受控压缩

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些失败无效或增加代价？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

插件在返回前收集整次尝试的 chunk，再区分终止错误和取消。只有错误结果有后续目标时会重试，抛出的中间件或消费者异常直接传播。已取消时不换路由。备用窗口也不足时可能重复同一失败，两次调用都可能占资源。因为请求复制了原始选项和上下文，备用提供方的允许数据范围须提前核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:225-268](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/lib/index.js#L225-L268)

整流缓冲、重试和取消

<details>
<summary>查看原文（44行）</summary>

```text
      for (let index = 0; index < chain.length; index += 1) {
        const target = chain[index]
        const isLast = index === chain.length - 1
        const call = {
          ...options,
          ...target,
          ...effort === undefined ? {} : { reasoningEffort: effort }
        }
        OWN_CALLS.add(call)

        let chunks
        try {
          chunks = await collectAttempt(llm.stream(call))
        } catch (error) {
          // A thrown middleware or consumer failure is not a provider outcome
          // this seam can retry; surface it exactly as the unpatched runtime would.
          throw error
        }

        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
          return
        }

        if (signal !== undefined && signal.aborted === true) {
          yield * chunks
          return
        }

        if (isLast) {
          if (route.log) {
            ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); no candidate left')
          }
          yield * chunks
          return
        }

        if (route.log) {
          ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); retrying on ' + labelOf(chain[index + 1]))
        }
```

</details>

**依据 2 · 作者声明**：[README.md:82-86](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/README.md#L82-L86)

备用窗口比较

```text
## Choosing a fallback

A fallback rescues an *oversized replay* only when its window is **larger** than the primary's. Two same-size routes just repeat the same rejection.

The card raises a warning when the fallback's window is **≤** the primary's, and when both are the same model.
```

**依据 3 · 作者声明**：[README.md:108-114](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/README.md#L108-L114)

作者列失败边界

```text
## Notes and limits

- **Retry is on terminal error chunks only.** A thrown middleware or consumer failure is surfaced exactly as the unpatched runtime would — this seam does not swallow it.
- **Cancellation wins.** An aborted call is never retried.
- **Only compaction is touched.** `purpose` is the discriminator, so nothing else is rerouted.
- **The engine's own event still records its configured target.** `compaction/summary` reports the engine's `summarizationProvider` / `summarizationModel`, not this plugin's override; a fallback win shows up as this plugin's log line instead. Point the engine's own row at the same primary if you want the session log to agree.
- **Not a substitute for a smaller history.** If the replay exceeds *every* window you have, no fallback helps; that is a compaction-policy problem, not a routing one.
```

#### 缺口

- 未执行长重放或实际供应商调用
  **影响**：不能估计调用费用、缓冲占用及信息暴露范围
  **进一步探讨**：用受控服务记录请求、终止、取消和大窗口回放

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

插件为宿主加客户端配置，作者报告 fake llm 测试及指定宿主契约核查。主目标默认空，支持在独立 profile 用虚拟历史配置明确主、备目标并分别记录失败和成功。设为空或禁用可回到原始摘要路由，仍应核实实际请求。首次需要模型及合适宿主，持续承担一次或两次摘要和潜在较长等待。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:19-28](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/package.json#L19-L28)

宿主客户端入口

<details>
<summary>查看原文（10行）</summary>

```text
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "scripts": {
    "test": "node test/host.test.mjs"
```

</details>

**依据 2 · 作者声明**：[README.md:65-86](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/README.md#L65-L86)

热配置和窗口选择

<details>
<summary>查看原文（22行）</summary>

```text
## Configure

*Settings → Plugins → dsh-compaction-route → Configuration.*

| Field | Meaning |
|---|---|
| **Enable routing** | Off leaves the engine exactly as it was. |
| **Primary model** | The summarizer used first. |
| **Fallback model** | Tried when the primary ends in an error. Empty disables the fallback. |
| **Reasoning effort** | Effort for compaction calls; empty keeps the provider's default. |

Both dropdowns are built from **the models actually installed in your profile** — read from the `llm-pi-ai` settings namespace, so whatever you have is what you can pick — and each option shows its context window.

**A fresh install ships with both models empty and changes nothing.** Nothing is guessed: until you pick a primary, compaction behaves exactly as it did before. Naming a route in shipping code would be a guess that silently redirects someone else's profile at a provider it may not have — and a *fallback without a primary* is meaningless, so it does not start routing on its own.

Every field is `volatile`, so a change applies to the **next** compaction with no restart.

## Choosing a fallback

A fallback rescues an *oversized replay* only when its window is **larger** than the primary's. Two same-size routes just repeat the same rejection.

The card raises a warning when the fallback's window is **≤** the primary's, and when both are the same model.
```

</details>

**依据 3 · 作者声明**：[README.md:116-123](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/README.md#L116-L123)

作者测试边界

```text
## Compatibility

Checked against `@deepseek-ai/dsh` **0.2.1-rc.5** — the core bundled with the current desktop build — and against the `0.1.7` line it was first written for. The rc.4 `conversation.chat.reasoning.body` change (`text` vs `rawText`) was read and does not apply here: this plugin renders into `plugins.bundle.config`, never a reasoning body.

"Checked" for this plugin means two concrete things, both re-runnable from the repo:

1. **The seams still exist.** The host half needs `llm/stream` (waterfall, with `purpose`, `signal` and `reasoningEffort` on the options it rewrites) and the browser half needs `plugins.bundle.config` plus the `llm-pi-ai` settings namespace it enumerates models from. All three are present in the 0.2.1-rc.5 core; if any of them disappears a future release, the plugin goes inert rather than breaking a chat turn (see the fall-through tests).
2. **The behaviour holds.** `npm test` drives the compiled host half against a fake `llm.stream` and asserts the rewrites, the fallback chain, the abort rule and the re-entrancy guard.
```

#### 缺口

- 未实际安装、禁用或测耗时
  **影响**：真实宿主兼容与成本未知
  **进一步探讨**：用固定短历史核对路由和停用回退

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样避免误判实际路由？

**研究主题**：新假设与验证

#### 完整回答

作者说明宿主 summary 事件记录原配置，而备用成功有插件日志。可将实际模型、尝试序号与摘要事件关联，保持配置目标和实际目标两列。用虚拟成功、备用成功与两次失败比较核对人员的正确归因及时间。若误判和对账耗时无改善则撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:108-114](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/README.md#L108-L114)

事件与插件日志的口径差异

```text
## Notes and limits

- **Retry is on terminal error chunks only.** A thrown middleware or consumer failure is surfaced exactly as the unpatched runtime would — this seam does not swallow it.
- **Cancellation wins.** An aborted call is never retried.
- **Only compaction is touched.** `purpose` is the discriminator, so nothing else is rerouted.
- **The engine's own event still records its configured target.** `compaction/summary` reports the engine's `summarizationProvider` / `summarizationModel`, not this plugin's override; a fallback win shows up as this plugin's log line instead. Point the engine's own row at the same primary if you want the session log to agree.
- **Not a substitute for a smaller history.** If the replay exceeds *every* window you have, no fallback helps; that is a compaction-policy problem, not a routing one.
```

**依据 2 · 源码核查**：[lib/index.js:244-268](https://github.com/643048695/dsh-compaction-route/blob/5a041215c4769a8dc2432ce54f0645f0687d6be3/lib/index.js#L244-L268)

实际尝试日志与结果

<details>
<summary>查看原文（25行）</summary>

```text
        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
          return
        }

        if (signal !== undefined && signal.aborted === true) {
          yield * chunks
          return
        }

        if (isLast) {
          if (route.log) {
            ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); no candidate left')
          }
          yield * chunks
          return
        }

        if (route.log) {
          ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); retrying on ' + labelOf(chain[index + 1]))
        }
```

</details>

#### 缺口

- 未验证事件桥接能力或用户需求
  **影响**：无法确定实施代价和收益
  **进一步探讨**：先确认可传递请求 ID，再做故障对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
