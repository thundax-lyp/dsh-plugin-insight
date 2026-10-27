# dsh-plugin-adapter

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[478a132](https://github.com/1624318455/dsh-plugin-adapter/tree/478a132e79c14e7a125b5bdb7571bbda300a5411)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-adapter)
<!-- END META -->

> **实现功能**：在 DSH 注册原生 LlmAdapter，接入 OpenCode Zen 匿名模型并维护模型目录。

> **核心亮点**：相对手填兼容 provider，增加目录过滤、事件转换与上下文/输出预算协调；协议能力继承 pi-ai，仓库注明 fork。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：默认路径可能启动 Bun 子进程和回环端口，与无额外进程的作者描述不一致；代理失败还可能直连。缺 Bun 的可用性需要验证。见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要匿名模型与合格结果是什么？](#detail-section-11)
  - [Q02 · 目录和请求怎样到达宿主？](#detail-section-12)
  - [Q03 · 无需额外进程的承诺成立吗？](#detail-section-13)
  - [Q04 · 启动与失败需要用户付出什么？](#detail-section-14)
  - [Q05 · 能推导什么可证伪的改进？](#detail-section-15)
  - [Q06 · 当前适合何种采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有 DSH、需要在同一会话选择 Zen 匿名模型的开发者，以有效响应及工具事件为交付。

简单替代是继续使用 OpenCode CLI 或手填兼容 provider；没有同条件质量与成本对照，不宣称更优。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生模型适配 | 在 DSH 选择匿名 Zen 模型 | 上游可用性、协议和宿主契约需验证 |
| 模型目录 | 实时列表、价格判定与静态回退 | 列表可见不证明聊天可用 |
| Bun relay | 以 Bun fetch 转发 Zen 请求 | 另需 Bun 子进程，可能从代理回退直连 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm/settings/credentials、Node≥20 | 启动必需 | 注册原生 adapter | 缺 llm 时日志报错，不能调用 |
| Zen/models.dev HTTPS | 模型调用/目录所需 | 获取目录与响应 | 缓存可保列表但不保证聊天可用 |
| Bun 与已审核出站策略 | 默认 relay 路径所需 | 转发 Zen HTTP/SSE | 缺 Bun 退 Node；代理异常可能直连 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 管理员核对包、Bun 与网络策略 | 确认实际传输分支 |
| 2 | 用户安装并重启 DSH | zen-free 可发现，仍需响应验收 |
| 3 | 用户验证文本、工具、取消并禁用 | 响应正确且 relay/目录停止，否则回退原 provider |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/DSH、可选但影响可用性的 Bun、网络资源；金额未知 | 安装、出站策略与 relay 核查，耗时未知 | 根包 private；需确认实际包与宿主版本 |
| 持续使用 | 目录刷新、模型和网络消耗；匿名服务费用保障未知 | 上游变化与模型退役维护，工时未知 | 免费目录不等于长期服务承诺 |
| 失败恢复 | 重试及探测消耗未知 | 区分限流、Bun、代理与模型故障 | 未测全链路恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型接入 | provider 注册与目录机制可见 | 实际可调用率 |
| 压缩预算 | 输出上限受窗口约束 | 真实任务质量和首事件时延 |
| 恢复 | dispose 与 fallback 代码存在 | 进程退出及网络策略符合性 |

> **思考**：默认路径可能启动 Bun 子进程和回环端口，与无额外进程的作者描述不一致；代理失败还可能直连。缺 Bun 的可用性需要验证。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手填兼容 provider，增加目录过滤、事件转换与上下文/输出预算协调；协议能力继承 pi-ai，仓库注明 fork。见 [Q01](#research-q01)、[Q02](#research-q02)。

相对手填兼容 provider，增加目录过滤、事件转换与上下文/输出预算协调；协议能力继承 pi-ai，仓库注明 fork。见 [Q01](#research-q01)、[Q02](#research-q02)。

结构化宿主接口降低编译依赖，目录与 adapter 分离便于移植；上游协议交给 pi-ai。预算协调值得借鉴，但移植必须复核宿主压缩器预留语义。relay 自动直连属于应明确配置的取舍，不将源码注释中的作者实测当独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认路径可能启动 Bun 子进程和回环端口，与无额外进程的作者描述不一致；代理失败还可能直连。缺 Bun 的可用性需要验证。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先完成非敏感隔离环境的 relay/代理/工具事件/退出验收；受控出站环境暂缓采用。见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持原生 provider 集成贡献；上游可用性与宿主效果未验证；诊断状态假设未验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、packages/plugin/package.json、packages/plugin/src/index.ts、packages/plugin/src/adapter/catalog.ts、packages/plugin/src/adapter/zen-adapter.ts、packages/plugin/src/adapter/zen-relay.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查固定源码和作者说明，未执行安装、测试、模型调用或宿主验收；IP pool 仅核查入口，不作完整审计。
- 下一步：最小验证覆盖目录断网、Bun 缺失、代理失败和模型退役，并记录合格任务率、诊断时间、实际目的地址与退出状态。

**分析版本**

- **仓库**：[1624318455/dsh-plugin-adapter](https://github.com/1624318455/dsh-plugin-adapter)
- **版本号**：未声明（[固定提交 478a132](https://github.com/1624318455/dsh-plugin-adapter/tree/478a132e79c14e7a125b5bdb7571bbda300a5411)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的分层就绪状态与显式降级策略，可能减少误重试；以四种故障比较诊断时间和额外流量，收益不显著即否定。见 [Q05](#research-q05)。

最小验证覆盖目录断网、Bun 缺失、代理失败和模型退役，并记录合格任务率、诊断时间、实际目的地址与退出状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2676 | — | — | 41736 |
| .ts | source | 31 | 8781 | 6184 | 2090 | — |
| .tsx | source | 1 | 1138 | 994 | 84 | — |
| .ts | test | 28 | 5368 | 4491 | 624 | — |
| .mts | test | 4 | 383 | 278 | 74 | — |
| .mjs | source | 1 | 21 | 10 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：该固定版本能否以原生模型适配降低 DSH 接入匿名 Zen 的负担，哪些传输与容量条件限制其价值？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要匿名模型与合格结果是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已有 DSH 环境、希望将匿名 Zen 模型放入同一会话工作流的个人开发者。合格交付是模型可发现、响应与工具事件正确传回 DSH，而不是仅显示模型名称。作者宣称免 Key 与免进程；源码可支持前者的匿名凭据接线，但后者需按 Q03 收窄。相对另开 OpenCode CLI，本插件把模型调用接入 DSH；相对手填 OpenAI 兼容 provider，增加目录过滤、消息/事件转换和容量元数据约束。此为集成贡献，包作者字段明确说明 fork 来源，不能将 pi-ai 协议或 Zen 服务算作原创。没有同任务结果对照，不能确认匿名通道比已有付费 provider 更划算。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:28-48](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/README.zh-CN.md#L28-L48)

作者说明 provider、匿名通道和无 sidecar 的主张

<details>
<summary>查看原文（21行）</summary>

```text
[OpenCode Zen](https://opencode.ai/zen) 的**匿名免费通道**——也就是
OpenCode 官方 CLI 无需登录即可使用的那批免费模型，它们会以 `zen-free`
这个常规 provider 出现在你的 DSH 模型选择器里（`opencode2dsh` 保留为
旧会话的兼容别名）。

插件发出的请求与 OpenCode CLI 的流量完全同形（相同的 User-Agent、相同的
关联请求头），模型目录通过三级回退链保持新鲜。不用登录任何账号，也不用
自己部署任何东西。

## 特性

- **零凭据、零配置**——匿名通道不需要任何 Key；装好、重启、开聊
- **原生 adapter，无 sidecar**——一个 npm 包，没有子进程、没有二进制、没有本地端口（旧版 Go sidecar 不随包发行，见 `legacy/`）
- **CLI 同形伪装**——请求携带 OpenCode CLI 的 User-Agent 和整套会话/请求/项目关联头，按会话派生
- **思考等级可选**——带推理的免费模型在 DSH 模型选择器里出现思考等级选项（模型声明档位的按声明展示，其余提供 Off/Minimal/Low/Medium/High）；Off 向上游发送 `reasoning_effort: "none"` 真正停思考，不选则保持上游默认
- **实时目录 + 三级回退**——上游实时列表 ∩ 免费判定（models.dev 价格为 0，或名字带 `-free` 由通道本身免费供应），断网时依次回退到磁盘缓存与已验证的静态名单
- **自愈能力**——启动期快速重试、周期刷新，并落盘健康快照便于排查
- **规范的错误呈现**——上游故障（限流、鉴权、超时、传输）以分类的 finish 原因送达 DSH，重试策略始终由 DSH 掌控

## 安装

```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:14-24](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/zen-adapter.ts#L14-L24)

明确复用 pi-ai 传输并实现宿主 adapter 契约

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * The TS adapter: registers as a DSH LlmAdapter for the `zen-free` route
 * (plus the `opencode2dsh` legacy alias for pre-rename sessions)
 * and streams directly from the OpenCode Zen anonymous lane. The wire layer is
 * pi-ai's openai-completions implementation for most models (the same one DSH
 * uses for every OpenAI-compatible provider), plus pi-ai's openai-responses
 * for Responses-only models (muse-spark-*); this module adds the CLI disguise
 * headers, the derived session/request ids, and the free-model catalog.
 *
 * Adapter contract: dsh-llm LlmAdapter (providerInfo/listModels/resolveModel/
 * prepareCall/stream) — structural, no host import.
```

</details>

**依据 3 · 源码核查**：[packages/plugin/package.json:21-29](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/package.json#L21-L29)

仓库归属与 fork 声明

```text
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1624318455/dsh-plugin-adapter.git"
  },
  "homepage": "https://github.com/1624318455/dsh-plugin-adapter#readme",
  "bugs": "https://github.com/1624318455/dsh-plugin-adapter/issues",
  "author": "1624318455 (fork of FishBottle7/opencode2dsh)",
  "engines": {
    "node": ">=20"
```

#### 缺口

- 未采集真实用户反复任务与合格率
  **影响**：需求强度及收益未知
  **进一步探讨**：使用者提供同一批 DSH 任务，对照原 provider

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录和请求怎样到达宿主？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index 创建 ModelCatalog 与 ZenAdapter 后立即向 zen-free 和旧别名注册；目录在后台启动，模型选择器实时读目录，因而注册成功不等于上游可用。catalog 的设计将实时列表、models.dev 免费判断与静态名单组合；静态名单中明确区分 chat 与 listing 依据，listing 不能当聊天验收。适配器将模型输出上限压到上下文窗口四分之一，避免宿主为输出预留空间后没有消息预算；这是一项具体的跨接口适配取舍，可能牺牲最大输出长度换取有效压缩预算。宿主耦合集中在结构接口与事件映射，但上游模型目录和字段语义仍需要持续维护。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:151-166](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L151-L166)

adapter 注册与目录后台启动

<details>
<summary>查看原文（16行）</summary>

```text
  // page or cordis.patch.yml; disabled keeps the process byte-for-byte on
  // direct. Lifecycle (assembly on first enable, live reconfigure, dispose) is
  // owned by applyIpPoolSettings through the plugin fiber. The probe-model
  // dropdown rows include the live catalog, so this must run after the
  // catalog instance exists.
  applyIpPoolSettings(ctx, config, logger, { listLiveModels: () => catalog.list() })

  // Register immediately: the provider must appear in the selector right
  // away, even while the catalog is still warming up (listModels is read
  // live at selector time, so models appear as refreshes land).
  ctx.llm.registerAdapter([PROVIDER_ID, LEGACY_PROVIDER_ID], adapter)
  logger.info(`dsh-plugin-adapter: adapter registered for "${PROVIDER_ID}" (legacy alias "${LEGACY_PROVIDER_ID}", catalog warms up in background)`)
  void catalog.start().catch((err) => {
    logger.error(`dsh-plugin-adapter: catalog start failed: ${err instanceof Error ? err.message : String(err)}`)
  })

```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/catalog.ts:6-43](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/catalog.ts#L6-L43)

三级目录来源与静态名单证据层级

<details>
<summary>查看原文（38行）</summary>

```text
/**
 * Port of agent/internal/catalog (opencode2api models.go + model_metadata.go,
 * trimmed to the single anonymous Zen lane) plus the S3 static fallback:
 *
 *   S1  GET {zen}/v1/models            live catalog (in-sale ids, free or paid)
 *   S2  GET https://models.dev/api.json  pricing metadata -> free decision
 *   S3  compile-time verified ids       last-resort bootstrap list
 *
 * /v1/models-equivalent exposure = S1 ∩ S2-allowed (or S3 while S1 is pending).
 */

export const ZEN_BASE_URL = 'https://opencode.ai/zen'

/**
 * Bootstrap / vouch list (S3): ids the anonymous lane serves for free.
 *
 * The list doubles as the fallback catalog while the live Zen directory
 * (S1) has not loaded yet, and as the deprecation vouch: an id here stays
 * exposed even when models.dev retires its entry (hy3-free case). Keep it in
 * sync with the live free lane — a stale entry means the picker offers a
 * model the lane no longer serves.
 *
 * Verification status per id is spelled out in the comment: "chat" means a
 * real anonymous chat succeeded, "listing" means the live Zen directory and
 * models.dev agree the id is free (price 0) but this repo never chat-tested
 * it.
 */
export const staticFreeModels: string[] = [
  'big-pickle', // chat 2026-10-26 (live via the v2 fingerprint + Bun relay)
  'nemotron-3.5-lightning-free', // chat 2026-09-01
  'deepseek-v4.1-flash-free', // chat 2026-10-26 (the lane's suggested default)
  'beam-free', // listing (Zen + models.dev price 0, 2026-10-22)
  'flint-40b-free', // listing (Zen + models.dev price 0, 2026-10-22)
  'glm-5.3-flash-free', // chat 2026-10-26
  'longcat-2.5-preview-free', // listing (Zen + models.dev price 0, 2026-10-22)
  'mimo-v2.6-flash-free', // listing (Zen + models.dev price 0, 2026-10-22)
  'nemotron-3.5-super-vl-free', // chat 2026-10-26
]
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:47-95](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/zen-adapter.ts#L47-L95)

输出上限与上下文窗口约束

<details>
<summary>查看原文（49行）</summary>

```text
const DEFAULT_MAX_TOKENS = 32768

/**
 * Output tokens the adapter may advertise for a window.
 *
 * The host reserves the advertised output limit INSIDE the advertised
 * context window: dsh-compaction-basic computes
 * `messageBudget = contextWindow - reservedCompletionTokens` (the reserve is
 * the request's `maxTokens`, i.e. exactly what we advertise) and throws a
 * target-pressure config error when that budget is not positive. The turn
 * then continues UNCOMPACTED (the error is only logged as a warning), so the
 * surface keeps growing until the lane cannot answer it any more.
 *
 * Measured 2026-10-22: minimax-m3.1-flash-free (1,000,000/512,000 in
 * models.dev) capped to a 131,072 window kept advertising 512,000 output
 * tokens, the reserve blew the message budget, compaction never ran, and the
 * session's surface reached 256,327 prompt tokens before the lane answered
 * with an empty length-stopped response.
 *
 * A quarter of the window keeps the envelope valid (the budget stays
 * positive even with the host's 64K headroom) and matches what the free
 * models actually produce (32K output).
 */
export function outputLimitFor(limits: ModelLimits): number {
  const quarter = Math.floor(limits.contextWindow / 4)
  return Math.max(1, Math.min(limits.maxTokens, quarter))
}

/**
 * Resolve the advertised limits: per-model metadata/static first, generic
 * defaults last. `contextWindowCap` (config.contextWindow) trims the
 * advertised window: DSH compacts against the window the adapter reports, so
 * a 1M-token model never triggers compaction and every turn re-sends the
 * whole (growing) surface — the single biggest latency and quota lever.
 *
 * The output limit is then clamped into that window (see
 * {@link outputLimitFor}): an output limit that does not fit the window
 * breaks the host's compaction envelope.
 */
function limitsFor(catalog: CatalogLike, model: string, contextWindowCap?: number): ModelLimits {
  const limits = catalog.modelLimits?.(model) ?? { contextWindow: DEFAULT_CONTEXT_WINDOW, maxTokens: DEFAULT_MAX_TOKENS }
  const contextWindow =
    contextWindowCap === undefined || contextWindowCap <= 0 ? limits.contextWindow : Math.min(limits.contextWindow, contextWindowCap)
  return { contextWindow, maxTokens: outputLimitFor({ contextWindow, maxTokens: limits.maxTokens }) }
}

/**
 * Reasoning-effort vocabulary the adapter owns end to end (dsh-llm treats the
 * ids as opaque: whatever resolveModel advertises comes back on
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 无需额外进程的承诺成立吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能对当前默认路径作此保证。入口在未启用 IP pool、且 relay 未显式关闭时尝试创建 Bun relay；relay 文件导入 spawn，并在 Bun.serve 上创建 127.0.0.1 随机端口 HTTP 服务。它避免了旧 Go sidecar，但仍是另一种子进程及回环转发。缺 Bun 时返回 null，入口保留 Node 栈并告警免费通道可能 429；这是源码中的降级风险，注释中的 6/6 与 5/5 是作者报告而非本研究实测。另一个影响数据路径的取舍是代理异常后 relay 会在进程生命周期内改为直连；要求全部出站走代理的环境必须先审核此分支，不能仅按“已配置 proxyUrl”推断流量约束。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:107-133](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L107-L133)

默认 relay 条件、Bun 缺失告警及 transport 分支

<details>
<summary>查看原文（27行）</summary>

```text
  // Two jobs: (1) the free tier refuses Node's own HTTP client whatever the
  // request looks like (measured 2026-10-26: identical body, Node 0/6 vs Bun
  // 5/5), so the lane is re-originated by a loopback relay run by bun;
  // (2) the ambient proxy dispatcher reuses CONNECT tunnels that Clash/v2rayN
  // silently close, so a direct proxy path still pins pipelining: 0.
  // The IP pool owns the dispatcher when it is enabled (and already pins
  // pipelining: 0), so this seam stays off then.
  const relay = cfg.ipPool?.enabled === true || cfg.transport?.relay === 'off'
    ? null
    : createZenRelay({
      bunPath: cfg.transport?.bunPath,
      proxyUrl: cfg.transport?.proxyUrl,
      log: (message) => logger.info(`dsh-plugin-adapter: ${message}`),
    })
  if (relay === null && cfg.transport?.relay !== 'off' && cfg.ipPool?.enabled !== true) {
    logger.warn('dsh-plugin-adapter: bun was not found, so the Zen lane keeps the Node HTTP stack; the free tier currently answers that stack with 429 FreeUsageLimitError (install bun, or set transport.bunPath)')
  }
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
      relay,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-relay.ts:21-25](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/zen-relay.ts#L21-L25)

子进程依赖

```text
import { spawn, type ChildProcessByStdio } from 'node:child_process'
import type { Readable } from 'node:stream'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
```

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-relay.ts:53-85](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/zen-relay.ts#L53-L85)

回环服务与代理失败后直连

<details>
<summary>查看原文（33行）</summary>

```text
const server = Bun.serve({
  hostname: '127.0.0.1',
  port: 0,
  idleTimeout: 255,
  async fetch(req) {
    try {
      const url = new URL(req.url)
      const target = upstream + url.pathname + url.search
      const headers = new Headers(req.headers)
      headers.delete('host')
      headers.delete('accept-encoding')
      const init = { method: req.method, headers }
      if (keepAlive) init.keepalive = true
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = await req.arrayBuffer()
      }
      let res
      if (proxy && !proxyBroken) {
        // A configured proxy is tried first, then the direct path: Bun's proxy
        // support is picky (a mixed HTTP/SOCKS inbound answers CONNECT with
        // ECONNRESET), while a direct call usually works and must not be lost
        // to a proxy the user only configured for other plugins. One failure is
        // enough to stop paying for it on every request; a child restart (new
        // plugin load) retests.
        try {
          res = await call(target, init, true)
        } catch (err) {
          proxyBroken = true
          console.error('proxy unusable, using direct for the rest of this process: ' + (err && err.message ? err.message : err))
          res = await call(target, init, false)
        }
      } else {
        res = await call(target, init, false)
```

</details>

#### 缺口

- 同版本 Bun relay、代理失败、无 Bun 的真实宿主表现未执行
  **影响**：不能确认可用性和网络策略适配
  **进一步探讨**：隔离环境逐分支记录进程、目的地址、首事件与错误

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动与失败需要用户付出什么？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

启动需要 DSH llm/credentials/settings 服务与 Node≥20，实际发布包位于 packages/plugin，根包是 private 包装。匿名免费是作者/目录分类，不是未来服务保障；当前研究没有查询实时价格、调用或总费用。首次投入包括安装包、确认 Bun 与出站策略、审查旧数据迁移；持续投入包括目录刷新和上游兼容维护。失败时既要核查上游限流，也要区分 Bun、代理、Node 回退与模型退役，不能把所有错误都归为模型质量。入口保存健康状态并在卸载时停止目录、恢复 transport 和 dispose relay，但这仅支持生命周期设计，未证明所有子进程均实际退出。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/package.json:1-11](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/package.json#L1-L11)

发布包版本与入口

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "@memef1f1y/dsh-plugin-adapter",
  "version": "0.5.0",
  "description": "Free OpenCode Zen models for DeepSeek Harness (DSH): native dsh-llm adapter plugin, no API key.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./client": "./lib/client.js"
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/index.ts:55-82](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L55-L82)

宿主服务及模式选择

<details>
<summary>查看原文（28行）</summary>

```text
/** Cordis plugin id. Must match cordis.patch.yml (package + repository). */
export const name = 'dsh-plugin-adapter'
export const inject = ['llm', 'credentials', 'settings'] as const
export function apply(ctx: PluginContext, config: DshPluginAdapterConfig = {}): { ready: Promise<ReadyInfo> } {
  if (resolveConfig(config).mode === 'sidecar') return applySidecar(ctx, config)
  return applyAdapter(ctx, config)
}

/**
 * Adapter mode: catalog + LlmAdapter registration. The adapter registration
 * is disposed with the plugin fiber (registerAdapter uses ctx.effect
 * internally); we only own the catalog refresh loop here.
 */
function applyAdapter(ctx: PluginContext, config: DshPluginAdapterConfig): { ready: Promise<{ port: number; version: string }> } {
  const logger = ctx.logger
  const cfg = resolveConfig(config)
  const ready = Promise.resolve({ port: 0, version: 'adapter' })

  if (!ctx.llm || typeof ctx.llm.registerAdapter !== 'function') {
    logger.error('dsh-plugin-adapter: llm service unavailable; adapter mode cannot register')
    return { ready }
  }

  // IP-pool exit routing (docs/ip-pool.md IP-1..IP-5): manual proxies,
  // pinned, free sources, subscriptions, and (IP-5) the settings namespace
  // with live apply + the /status /probe bridge. Opt-in via settings page or
  // cordis.patch.yml; disabled keeps the process byte-for-byte on direct.
  // Lifecycle (assembly on first enable, live reconfigure, dispose) is owned
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/index.ts:86-106](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L86-L106)

数据目录、健康状态与目录刷新

<details>
<summary>查看原文（21行）</summary>

```text
  // as a rollback path (data-dir.ts).
  const dataDir = resolveDataDir({ logger }).dir
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
    cachePath: defaultCachePath(dataDir),
    onRefresh: (status, lastError) => {
      writeStatus(status, lastError)
      if (lastError) logger.warn(`dsh-plugin-adapter: catalog refresh issue: ${lastError}`)
    },
  })
  // Zen-lane transport (adapter/transport.ts + adapter/zen-relay.ts).
  //
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/index.ts:187-195](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L187-L195)

清理目录、transport 和 relay

```text
      relay?.dispose()
    })
  }
  return { ready }
}

function applySidecar(ctx: PluginContext, config: DshPluginAdapterConfig): { ready: Promise<ReadyInfo> } {
  const cfg = resolveConfig(config)
  const logger = ctx.logger
```

#### 缺口

- 安装、长期负载及恢复人工时未测
  **影响**：单位合格任务现金和时间不可计算
  **进一步探讨**：以一组可验收任务记录全部重试与排障时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能推导什么可证伪的改进？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是将“provider 已注册”改为分层就绪状态（目录可用、relay 进程可用、上游最近一次有效 SSE）并对代理直连回退提供显式策略，会比当前日志加自动降级更容易定位故障。推导来自 Q02 中目录后台加载与 Q03 中传输栈变化：用户看到模型却不知道哪个前提未满足。最小实验只需在隔离宿主比较现有界面与一个只读状态面板，对目录断网、Bun 缺失、代理拒绝、模型退役各做注入；统计首个正确诊断时间、误重试数、额外探测流量。若诊断没有变快或新增探测消耗匿名额度导致任务失败，则否定收益假设。状态和探测必须由插件生命周期统一拥有，不另起第二个轮询器。此方案未实现、未验证，也未计入贡献评分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:86-106](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L86-L106)

已有状态文件可作为状态投影基础

<details>
<summary>查看原文（21行）</summary>

```text
  // as a rollback path (data-dir.ts).
  const dataDir = resolveDataDir({ logger }).dir
  const statusPath = join(dataDir, 'adapter-status.json')
  const writeStatus = (status: CatalogSnapshot, lastError: string): void => {
    void writeFile(
      statusPath,
      JSON.stringify({ ...status, lastError, writtenAt: new Date().toISOString() }, null, 2),
      'utf8',
    ).catch(() => {})
  }

  const catalog = new ModelCatalog({
    refreshSeconds: cfg.refreshSeconds,
    cachePath: defaultCachePath(dataDir),
    onRefresh: (status, lastError) => {
      writeStatus(status, lastError)
      if (lastError) logger.warn(`dsh-plugin-adapter: catalog refresh issue: ${lastError}`)
    },
  })
  // Zen-lane transport (adapter/transport.ts + adapter/zen-relay.ts).
  //
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/index.ts:151-166](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L151-L166)

先注册后目录加载的状态差

<details>
<summary>查看原文（16行）</summary>

```text
  // page or cordis.patch.yml; disabled keeps the process byte-for-byte on
  // direct. Lifecycle (assembly on first enable, live reconfigure, dispose) is
  // owned by applyIpPoolSettings through the plugin fiber. The probe-model
  // dropdown rows include the live catalog, so this must run after the
  // catalog instance exists.
  applyIpPoolSettings(ctx, config, logger, { listLiveModels: () => catalog.list() })

  // Register immediately: the provider must appear in the selector right
  // away, even while the catalog is still warming up (listModels is read
  // live at selector time, so models appear as refreshes land).
  ctx.llm.registerAdapter([PROVIDER_ID, LEGACY_PROVIDER_ID], adapter)
  logger.info(`dsh-plugin-adapter: adapter registered for "${PROVIDER_ID}" (legacy alias "${LEGACY_PROVIDER_ID}", catalog warms up in background)`)
  void catalog.start().catch((err) => {
    logger.error(`dsh-plugin-adapter: catalog start failed: ${err instanceof Error ? err.message : String(err)}`)
  })

```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/adapter/zen-relay.ts:121-129](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/zen-relay.ts#L121-L129)

relay 已有 isReady 与 ensure 状态接口

```text
export interface ZenRelay {
  /** True once the child is listening and the port is known. */
  isReady(): boolean
  /** Start (or restart) the child; false when bun is unavailable. */
  ensure(): Promise<boolean>
  /** Forward one request to the relay; the response body streams through. */
  forward(input: unknown, init?: Record<string, unknown>): Promise<Response>
  dispose(): void
  describe(): string
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前适合何种采用？

**研究主题**：采用判断

#### 完整回答

当前建议观察。匿名目录与原生 adapter 有明确集成价值，但默认执行形态与作者“无额外进程”描述冲突，并存在代理失败直连分支；对出站受控环境，这会改变采用前提。可以先在非敏感隔离环境完成可控试验，验收模型列表、文本/工具事件、取消、无 Bun、relay 崩溃与禁用后进程退出；未经这些同版本验证，不建议持续安装。已使用独立 CLI 且不需要 DSH 会话整合的人收益较小。若只验证模型能回复而不验证工具事件与恢复，不能改变当前建议。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/index.ts:107-133](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/index.ts#L107-L133)

默认传输策略决定采用条件

<details>
<summary>查看原文（27行）</summary>

```text
  // Two jobs: (1) the free tier refuses Node's own HTTP client whatever the
  // request looks like (measured 2026-10-26: identical body, Node 0/6 vs Bun
  // 5/5), so the lane is re-originated by a loopback relay run by bun;
  // (2) the ambient proxy dispatcher reuses CONNECT tunnels that Clash/v2rayN
  // silently close, so a direct proxy path still pins pipelining: 0.
  // The IP pool owns the dispatcher when it is enabled (and already pins
  // pipelining: 0), so this seam stays off then.
  const relay = cfg.ipPool?.enabled === true || cfg.transport?.relay === 'off'
    ? null
    : createZenRelay({
      bunPath: cfg.transport?.bunPath,
      proxyUrl: cfg.transport?.proxyUrl,
      log: (message) => logger.info(`dsh-plugin-adapter: ${message}`),
    })
  if (relay === null && cfg.transport?.relay !== 'off' && cfg.ipPool?.enabled !== true) {
    logger.warn('dsh-plugin-adapter: bun was not found, so the Zen lane keeps the Node HTTP stack; the free tier currently answers that stack with 429 FreeUsageLimitError (install bun, or set transport.bunPath)')
  }
  const transport = cfg.ipPool?.enabled === true
    ? null
    : createZenTransport({
      proxyUrl: cfg.transport?.proxyUrl,
      noReuse: cfg.transport?.noReuse,
      relay,
    })
  if (transport) {
    logger.info(`dsh-plugin-adapter: ${transport.describe()}`)
  } else if (cfg.transport?.proxyUrl) {
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/adapter/zen-adapter.ts:14-24](https://github.com/1624318455/dsh-plugin-adapter/blob/478a132e79c14e7a125b5bdb7571bbda300a5411/packages/plugin/src/adapter/zen-adapter.ts#L14-L24)

适配能力与依赖边界

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * The TS adapter: registers as a DSH LlmAdapter for the `zen-free` route
 * (plus the `opencode2dsh` legacy alias for pre-rename sessions)
 * and streams directly from the OpenCode Zen anonymous lane. The wire layer is
 * pi-ai's openai-completions implementation for most models (the same one DSH
 * uses for every OpenAI-compatible provider), plus pi-ai's openai-responses
 * for Responses-only models (muse-spark-*); this module adds the CLI disguise
 * headers, the derived session/request ids, and the free-model catalog.
 *
 * Adapter contract: dsh-llm LlmAdapter (providerInfo/listModels/resolveModel/
 * prepareCall/stream) — structural, no host import.
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
