# Our Free Model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[363c621](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/363c62115bc19803e44c2890c2c93582b95ff839)

<!-- BEGIN META -->
[![GitHub ★ 66,122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66%2C122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中接入匿名免费模型与多家模型通道，并提供组合路由和本地转发。

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 显示，固定目录与流式缓冲将多个上游的选择和部分提交前故障处理移入同一适配器。相对手工切换，推理片段可以留在候选缓冲区，避免因已显示推理文字而提前固定失败候选。

> **主要限制**：[Q03](#research-q03) 确认断路器已生效时，匿名候选可能在组合接收推进判定前抛错，后续候选无法接管。[Q04](#research-q04) 的本地等待窗口也只控制下一次尝试，实际额度和许可由上游决定。

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
  - [Q01 · 哪类用户能省掉重复配置，它与手工配置一个模型或启动独立服务相比具体增加什么？](#detail-section-11)
  - [Q02 · 上游目录、探测和用户设置如何变成实际可选择的模型？](#detail-section-12)
  - [Q03 · 组合模型在什么失败点会更换上游，切换后用户能认出真实输出和失败吗？](#detail-section-13)
  - [Q04 · 匿名免费通道如何处理限流与客户端门禁，能否视作持续可用额度？](#detail-section-14)
  - [Q05 · 采用者要承担哪些接入、维护和退出成本，何时应继续用单一端点？](#detail-section-15)
  - [Q06 · 如何在请求发出前减少跨上游的数据与配额误用，如何证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 用公开样例反复比较模型的开发者，可以在同一会话选择匿名或自配通道，按正常结束、有效正文和工具参数核对结果。

在现有 profile 为单一获准端点配置模型，在失败时读错误、手工切换再提交任务。已能稳定完成任务时，减少切换步骤的收益较小。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH 模型适配器 | 在同一会话选择不同模型 | 宿主需有 llm 服务，目录条目可能尚未探测 |
| 组合路由 | 在未提交答案时尝试后续模型 | 仅分类为可推进的结果，前置门禁可提前终止 |
| 本地转发 | 供本机客户端调用已配置模型 | 默认关闭，推理及目录需转发 Key |
| 模型目录和出口刷新 | 更新选择器与可用性线索 | 自动刷新只读清单和出口，生成探测由用户触发 |
| 设置与事件路由 | 查看、调整模型和网关状态 | 需 Web 服务，鉴权按路由与宿主连接条件处理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH profile 和 llm 服务 | 插件模式必需 | 注册适配器和模型路由 | 插件模型无法挂载 |
| Web 服务 | 看板必需 | 设置和事件流 | 看板路由延后挂载，LLM 入口另行注册 |
| 本机 Bun | 默认 OpenCode 官方推理 POST 必需 | 推理传输 | 名录仍可能读到，生成返回配置错误 |
| 上游许可与网络 | 相应通道必需 | 实际推理与目录 | 会遇到限流、拒绝、断网或费用变化 |
| 本地转发 Key | 使用本机转发时必需 | 访问模型和推理接口 | 未授权调用被拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者核对可信包和宿主版本，保留已有端点 | 使用独立 profile，版本与上游条件可定位 |
| 验证 | 开发者在选择器仅选一条获准通道，用公开样例测试 | 有正常终止和预期结果；目录返回不足以通过 |
| 联调 | 需要本机 API 时才启用转发并核对实际端口及 Key | 测试已授权客户端，失败切回已核准端点 |
| 退出 | 开发者移除 bundle，按需关闭监听和清理本地配置 | 验证原端点可用，单独核对上游留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地运行与网络资源 | 校验来源、宿主、Bun 及上游条件 | 安装耗时未知 |
| 持续使用 | 资源与费用取决于上游和实际发送次数 | 复核模型结果、数据去向和条款 | 额度、实际收费及合格任务成本未知 |
| 失败恢复 | 已发候选可能消耗额度或产生费用 | 看门禁和流错误，核对工具行为再切换 | 续接成功率与候选耗时未知 |
| 退出 | 原端点的调用与存储资源 | 移除 bundle、关闭转发及核对配置 | 上游留存和真实退出耗时未核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型发现 | 清单、缓存、探测和本地隐藏规则参与筛选 | 当前环境中的生成可用率 |
| 自动回退 | 只有提交前、符合推进判据的候选故障可切换 | 工具任务办结率与链路时延 |
| 费用 | 有本地额度窗口和通道选项 | 实际付费、提示留存与合格任务成本 |

> **思考**：[Q03](#research-q03) 确认断路器已生效时，匿名候选可能在组合接收推进判定前抛错，后续候选无法接管。[Q04](#research-q04) 的本地等待窗口也只控制下一次尝试，实际额度和许可由上游决定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 显示，固定目录与流式缓冲将多个上游的选择和部分提交前故障处理移入同一适配器。相对手工切换，推理片段可以留在候选缓冲区，避免因已显示推理文字而提前固定失败候选。

[Q02](#research-q02) 的目录和可用性分层保留临时故障下的候选，[Q03](#research-q03) 的流缓冲明确了用户输出提交时点。借用这套设计时，要让前置门禁也进入候选失败判据，并验证候选取消后是否仍有远端请求在途。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 确认断路器已生效时，匿名候选可能在组合接收推进判定前抛错，后续候选无法接管。[Q04](#research-q04) 的本地等待窗口也只控制下一次尝试，实际额度和许可由上游决定。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先把原端点留在独立 profile。只有在确认所选供应商接收数据的条件后，才使用公开样例检查正常回答、工具参数和请求去向。如果名单有模型却反复无法生成，或组合提前退出，保留错误并退回原端点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

现有实现可统一注册模型、合并目录并在符合判据时切换候选。已识别匿名断路器使组合提前退出的源码路径。按请求限制接收方属于待验证的设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、index.js、src/core.js、src/model-test.js、src/combos.js、src/adapter.js、src/http.js、src/egress.js、package.json、src/store.js、src/forward.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定源码中的 DSH 入口、匿名清单、组合与匿名通道传输、本机转发。未审计独立产品、所有账号通道、扩展沙箱或上游实时状态。
- 下一步：以受控端点制造首次限流和后续本地预拒绝，对比同一任务手工切换与组合。记录每个端点实际接收请求、模型结果、正常结束、工具参数和失败后是否接管，再用模拟敏感标签检查 [Q06](#research-q06) 的允许清单。

**分析版本**

- **仓库**：[Ebony-Vinyl/dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model)
- **版本号**：2.8.3（[固定提交 363c621](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/363c62115bc19803e44c2890c2c93582b95ff839)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出在每次请求进入候选前检查用户确认的接收方集合，尝试让故障切换服从该任务的数据边界；成效取决于标注准确性与维护负担。

以受控端点制造首次限流和后续本地预拒绝，对比同一任务手工切换与组合。记录每个端点实际接收请求、模型结果、正常结束、工具参数和失败后是否接管，再用模拟敏感标签检查 [Q06](#research-q06) 的允许清单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 102 | 42674 | 31272 | 9843 | — |
| .md | source | 102 | 9041 | — | — | 166857 |
| .mjs | source | 217 | 116191 | 101695 | 12923 | — |
| .tsx | source | 20 | 3063 | 2868 | 65 | — |
| .ts | source | 2 | 251 | 242 | 0 | — |
| .md | example | 1 | 8 | — | — | 159 |
| .mjs | example | 2 | 1551 | 1126 | 358 | — |

</details>

**活跃度**

[![Issue 未关闭 123](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=123&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 370](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=370&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 323](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=323&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 使用现有模型配置的开发者，能否借本插件使用匿名或聚合上游并在输出前切换，同时保住任务完成标准、明确请求去向和失败边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类用户能省掉重复配置，它与手工配置一个模型或启动独立服务相比具体增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在 DSH 反复用公开样例比较模型的个人开发者。原办法是逐个配置模型端点，遇到拒绝再手动换模型。插件根包由 Cordis 补丁挂载，apply 向宿主 LLM 注册同一个适配器及两个路由名，并从当前模型目录发布发现结果。这样测试者可以在同一个 DSH 会话选已知通道，或使用组合模型自动尝试后续候选。这里的增量是统一入口和切换时机，上游仍生成答案。若手头一个官方端点即可持续通过同一组文本和工具用例，统一配置的便利可能抵不过检查多家去向与失败策略的负担。独立服务使用另外的启动命令和数据目录，仅作为另一产品入口识别。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-33](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/README.md#L23-L33)

作者定位为免注册的 DSH 模型入口，另带兼容转发，并提出免费不限量主张。

<details>
<summary>查看原文（11行）</summary>

```text
> 你只需在 dsh 里装上这个插件，无需登录、注册、填 API Key 或任何其它操作，
> 就能用上包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型——完全免费，不限量。
>
> *All you do is install this plugin in dsh: no login, no sign-up, no API key, nothing
> else. The frontier models are just there — DeepSeek V4.1 Flash, Kimi K3 and the rest.
> Free, with no usage cap.*
>
> 模型清单跟随上游刷新，可用性由**你自己这台机器的网络出口**实测得出，
> 思考强度下发的是真实预算而不是提示词，另附一个 OpenAI 兼容的本地转发端口。
>
> 纯插件挂载：不改内核、无构建步骤、零依赖。
```

</details>

**依据 2 · 作者声明**：[README.md:102-119](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/README.md#L102-L119)

作者区分 DSH 插件和有独立端口、数据与 API Key 的本地服务。

<details>
<summary>查看原文（18行）</summary>

````text
## 独立本地服务（开发中）

仓库现在提供两个入口：下文安装的是 **DSH 插件**；`packages/standalone` 是
**无需安装 DSH 的独立本地服务**。从完整源码仓库运行：

```powershell
npm run start:standalone
```

独立服务默认使用 `~/.our-free-model` 和端口 `18900`，拥有自己的 API Key，
不读取插件数据。支持匿名/Kilo、EAC 和十个账号渠道，提供
Chat Completions、Responses API，以及独立网页管理（概览、模型、用量、聚合渠道、路由、
EAC、客户端与订阅、资源库、API 接入、设置与**插件中心**）。
插件中心与桌面端共用一套签名市场：渠道、增强与页面插件在此安装、启停、配置与卸载，
页面插件会直接出现在侧边栏的「插件」分组里。
启动后打开终端打印的一次性管理链接即可使用；账号在独立页面登录，也可手动导入插件账号备份。
启动、参数与验证见 [独立服务说明](packages/standalone/README.md)。
独立服务的安装制品与 Release 尚未发布。
````

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:5-8](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/cordis.patch.yml#L5-L8)

根包通过 bundle 补丁声明宿主入口。

```text
- insert:
    - id: our-free-model
      name: 'dsh-our-free-model'
      config: {}
```

**依据 4 · 源码核查**：[index.js:476-502](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/index.js#L476-L502)

适配器接入两个路由，发现入口强制更新列表并按成员表返回模型能力。

<details>
<summary>查看原文（27行）</summary>

```text
  const { state, adapter, refreshCatalog, refreshAvailability, watchEgress, fetchListing, publicModelRows, syncAggregateCatalog, clearLaneBreaker } = modelRuntime
  const runForwarded = modelRuntime.complete

  // ── registration ────────────────────────────────────────────────────────────
  const routes = () => Object.keys(state().membership)
  const registration = ctx.llm.registerAdapter([ROUTE_MAIN, ROUTE_REGION], adapter)
  ctx.llm.registerConfigurableProviders?.([
    { provider: ROUTE_MAIN, displayName: ROUTE_LABELS[ROUTE_MAIN], settingsNs: ctx.fiber?.entry?.options?.id ?? name, settingsPath: [] },
  ])

  // Advertise a probe endpoint for the in-app "detect models" button. It offers
  // what the picker itself advertises — a model the gateway refuses to route at
  // all must not be addable to a profile just because it still appears in the
  // upstream listing. Automatic availability probing is disabled by owner
  // policy, so discovery refreshes the listing only.
  ctx.llm.registerModelDiscovery?.(ctx.fiber?.entry?.options?.id ?? name, async () => {
    await refreshCatalog({ probe: false, force: true })
    const advertised = new Set(Object.values(state().membership).flat())
    return modelRuntime.catalog
      .filter(entry => advertised.has(entry.id))
      .map(entry => ({
        id: entry.id,
        name: entry.name,
        contextWindow: entry.contextWindow,
        maxTokens: entry.maxOutput,
        inputModalities: entry.vision ? ['text', 'image'] : ['text'],
      }))
```

</details>

#### 缺口

- 没有在同一 DSH 版本对照手工切换与组合模型完成任务的记录。
  **影响**：只能判断步骤变化，不能量化使用负担或需求强度。
  **进一步探讨**：以同一组公开样例检查正常答案、工具参数和人工切换次数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 上游目录、探测和用户设置如何变成实际可选择的模型？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

目录刷新先读取匿名入口，取得非空清单后写入缓存，取数失败时重建旧目录，缓存也无可用项时可落到内置候选；另合并 Kilo、已解锁通道以及其他配置。宿主定时器明确传入 probe: false，后台只读列表和出口。手动 /reprobe 才发生成探测，受匿名通道断路器约束，通常只测一项；通道的真实请求结果也能写入被动记录。成员计算排除 unavailable，但匿名候选全部被判不可用时先恢复候选，再继续应用隐藏和地区分组规则。unknown 因而仍可能被列出。作者关于选择器只广播可用模型的表述，应按实际过滤条件理解。手动文本测试可确认有非空正文和正常结束，它没有比较正文是否逐字为 OK，也没有验证工具任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/core.js:424-455](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L424-L455)

清单刷新更新匿名缓存，读取其余清单再重算成员。

<details>
<summary>查看原文（32行）</summary>

```text
  async function refreshCatalogOnce({ probe, force, throttleListing }) {
    const sources = {};
    let ids = [];
    if (throttleListing === true && !force && Date.now() - lastListingAt < LISTING_MIN_INTERVAL_MS && freeCatalog.length > 0) {
      ids = freeCatalog.map((entry) => entry.id);
      sources.free = { ok: true, count: freeCatalog.length, skipped: "recent" };
    } else {
      try {
        ids = parseListing(await fetchListing());
        lastListingAt = Date.now();
      } catch (error) {
        if (!disposed) logger.warn?.(`our-free-model: model listing refresh failed (${error?.message ?? error}); keeping the cached catalog`);
      }
    }
    if (disposed) return { catalog, sources };
    if (ids.length > 0) {
      freeCatalog = buildCatalog(ids);
      catalogStore.update({ at: Date.now(), entries: freeCatalog.map((entry) => entry.id) });
      catalogStore.flush();
      settings.update({ catalogSyncedAt: Date.now() });
    } else {
      freeCatalog = materializeCatalog(catalogStore.get().entries ?? []);
    }
    if (sources.free === void 0) sources.free = { ok: ids.length > 0, count: freeCatalog.length };
    sources.sealed = await refreshSealedRoster();
    if (disposed) return { catalog, sources };
    sources.kilo = { ok: await refreshKiloRoster(), count: kiloCatalog.length };
    if (disposed) return { catalog, sources };
    mergeCatalogs();
    if (probe) await refreshAvailability(force);
    emitTopology();
    return { catalog, sources };
```

</details>

**依据 2 · 源码核查**：[src/core.js:692-715](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L692-L715)

旧目录恢复有内置回退，成员表应用不可用、地区、隐藏和全部拒绝保留规则。

<details>
<summary>查看原文（24行）</summary>

```text
function materializeCatalog(ids) {
  const rebuilt = buildCatalog(ids);
  return rebuilt.length > 0 ? rebuilt : FALLBACK_CATALOG;
}
function computeMembership(catalog, availabilitySnapshot, settings) {
  const expose = settings?.exposeRegionModels !== false;
  const verdictOf = (entry) => modelAvailability(entry.id, availabilitySnapshot, Boolean(entry.channel)).availability;
  const probeable = catalog.filter((entry) => !entry.channel);
  const refusedAll = probeable.length > 0 && probeable.every((entry) => verdictOf(entry) === STATE.unavailable);
  let usable = catalog.filter((entry) => verdictOf(entry) !== STATE.unavailable);
  if (refusedAll) usable = catalog;
  const main = [];
  const region = [];
  for (const entry of usable) {
    if (isModelHidden(entry, settings)) continue;
    const verdict = verdictOf(entry);
    if (verdict !== STATE.regionBlocked) main.push(entry.id);
    else if (expose) region.push(entry.id);
  }
  const membership = {};
  if (main.length > 0) membership[ROUTE_MAIN2] = main;
  if (region.length > 0) membership[ROUTE_REGION2] = region;
  return membership;
}
```

</details>

**依据 3 · 源码核查**：[index.js:1647-1658](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/index.js#L1647-L1658)

周期刷新仅获取目录和出口信息。

<details>
<summary>查看原文（12行）</summary>

```text
  // Automatic availability probing is disabled by owner policy. This loop only
  // refreshes the listing and reads the egress; the interval keeps its setting
  // name for upgrade compatibility. `/reprobe` is the only path that still asks
  // for a probe, and it is driven by a manual button.
  every(() => {
    void (async () => {
      await watchEgress()
      // throttleListing: the periodic round may keep the cached roster when it
      // just refreshed — the upstream listing is read at most once per window.
      await refreshCatalog({ probe: false, throttleListing: true })
    })().catch(error => logger.warn?.(`our-free-model: periodic refresh failed (${error?.message ?? error})`))
  }, () => positiveOr(settings.get().probeIntervalMinutes, 15, 1) * 60_000)
```

</details>

**依据 4 · 源码核查**：[src/core.js:519-524](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L519-L524)

单次探测只选指定匿名模型或至多一个默认候选。

```text
  async function runProbeRound(onlyModel) {
    const generation = egressGeneration;
    const probeable = catalog.filter((entry) => !entry.channel && !isComboEntry(entry));
    const targets = typeof onlyModel === "string" && onlyModel !== "" ? probeable.filter((entry) => entry.id === onlyModel) : probeable.filter((entry) => entry.pinned === true).slice(0, 1).length > 0 ? probeable.filter((entry) => entry.pinned === true).slice(0, 1) : probeable.slice(0, 1);
    if (targets.length === 0) return {};
    const results = await probeCatalog(targets, { attributionUserAgent, signal: lifetime.signal }, (id, result) => {
```

**依据 5 · 源码核查**：[src/core.js:556-564](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L556-L564)

手动刷新先看断路器，并复用同出口代次的进行中探测。

```text
  async function refreshAvailability(force = false, { model } = {}) {
    if (disposed) return {};
    if (!force && probeBackoffUntil > Date.now()) return {};
    const gate = laneGate();
    if (!gate.ok) return { skipped: gate.state, retryAt: gate.retryAt, message: gate.message };
    if (probeRound !== null && probeRoundGeneration === egressGeneration) return probeRound;
    probeRoundGeneration = egressGeneration;
    const round = runProbeRound(model);
    probeRound = round;
```

**依据 6 · 源码核查**：[src/model-test.js:22-34](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/model-test.js#L22-L34)

文本测试验收的是正常结束且有非空正文，无工具调用。

<details>
<summary>查看原文（13行）</summary>

```text
    if (chunk.type === 'tool-call-delta' || (chunk.type === 'block-end' && chunk.block?.type === 'tool-call'))
      throw new UpstreamError('Text test returned an unexpected tool call', CODE.server)
    if (chunk.type === 'usage') usage = chunk.usage
    if (chunk.type === 'finish') {
      if (chunk.upstreamFinish !== undefined && !['stop', 'end_turn', 'stop_sequence'].includes(chunk.upstreamFinish))
        throw new UpstreamError('Text test did not finish normally: ' + String(chunk.upstreamFinish), CODE.server)
      if (chunk.reason?.kind !== 'stop')
        throw new UpstreamError(chunk.reason?.failure?.message ?? chunk.reason?.kind ?? 'Text test did not finish normally', chunk.reason?.failure?.code ?? CODE.server)
      finished = true
    }
  }
  if (!finished) throw new UpstreamError('Text test ended without a normal finish', CODE.empty)
  if (!text.trim()) throw new UpstreamError('Text test returned no response text', CODE.empty)
```

</details>

#### 缺口

- 没有当前出口上目录和任务成功率的观测。
  **影响**：界面条目无法证明真实生成或工具能力。
  **进一步探讨**：分别记录清单刷新、单一公开提示与一项固定工具任务的结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 组合模型在什么失败点会更换上游，切换后用户能认出真实输出和失败吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

运行时按成员模型 ID 展开组合、去重并避开递归环。常规回退保持配置顺序，轮转根据粘滞设置改起点，配额或用量策略另据近期数据重排。组合逐候选运行并缓冲输出，只有非空正文或工具调用等答案事件会提交，单纯推理不会固定候选。若候选在提交前返回可推进结果，缓冲被丢弃并试下一项；提交后保留原候选，后续错误会结束该尝试。等待迭代超时会请求关闭候选再推进，关闭是尽力操作，源码没有等待旧传输结束再切换。更关键的是匿名通道已经受断路器拦截时，runSingle 在流处理 try 之前直接抛错，runCombo 等待候选的语句也不捕获拒绝。这条路径不会进入检查 advance 的分支，链中后项即使来自另一供应商也不会由这次组合继续尝试。流输出看不见被丢弃的尝试，已发请求仍可能被上游处理和计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/combos.js:179-202](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/combos.js#L179-L202)

从固定目录展开、去重，配额数据有时间边界。

<details>
<summary>查看原文（24行）</summary>

```text
export function comboChain(entry, catalog, options = {}) {
  const ids = Array.isArray(entry?.combo) ? entry.combo : []
  const byId = new Map()
  for (const row of catalog) byId.set(row.id, row)
  const path = new Set(options.path ?? [])
  if (path.has(entry?.id)) return []
  path.add(entry?.id)
  const dedup = new Set()
  const members = ids.flatMap(id => {
    const row = byId.get(id)
    return row ? isComboEntry(row) ? comboChain(row, catalog, { ...options, path }) : [row] : []
  }).filter(row => { if (dedup.has(row.id)) return false; dedup.add(row.id); return true })
  if (members.length <= 1) return members
  if (['smart', 'usage', 'pace'].includes(entry.strategy)) {
    const now = Number.isFinite(options.now) ? options.now : Date.now()
    const readings = row => {
      const quota = options.quota?.[row.id]
      const checked = Date.parse(quota?.checkedAt ?? '')
      if (!quota || !['ok', 'available'].includes(quota.status) || !Number.isFinite(checked) || now - checked > 15 * 60_000 || checked > now + 60_000) return []
      return (quota.windows ?? []).filter(window => {
        const reset = Date.parse(window.resetsAt ?? '')
        return typeof window.remainingPercent === 'number' && window.remainingPercent >= 0 && window.remainingPercent <= 100
          && (!Number.isFinite(reset) || reset > now)
      })
```

</details>

**依据 2 · 源码核查**：[src/combos.js:216-240](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/combos.js#L216-L240)

配额、用量和节奏排序，以及轮转起点和粘滞状态更新。

<details>
<summary>查看原文（25行）</summary>

```text
    return members.map(score).sort((left, right) => {
      if (left.exhausted !== right.exhausted) return left.exhausted ? 1 : -1
      if (entry.strategy === 'usage') {
        if ((left.usage !== null) !== (right.usage !== null)) return left.usage !== null ? -1 : 1
        if (left.usage !== null && right.usage !== null && left.usage !== right.usage) return left.usage - right.usage
      } else if (entry.strategy === 'pace') {
        if ((left.pace !== null) !== (right.pace !== null)) return left.pace !== null ? -1 : 1
        if (left.pace !== null && right.pace !== null && left.pace !== right.pace) return right.pace - left.pace
      } else {
        if (left.known !== right.known) return left.known ? -1 : 1
        if (left.reset !== right.reset) return left.reset - right.reset
      }
      return left.index - right.index
    }).filter(value => !value.exhausted).map(value => value.row)
  }
  if (entry.strategy !== 'round-robin') return members
  const limit = Number.isFinite(Number(entry.stickyLimit)) && Number(entry.stickyLimit) > 0 ? Math.trunc(Number(entry.stickyLimit)) : 1
  const cursor = rotation.get(entry.id) ?? { index: 0, used: 0 }
  const index = Math.min(Math.max(cursor.index, 0), members.length - 1)
  const ordered = [...members.slice(index), ...members.slice(0, index)]
  if (options.peek !== true) {
    const used = cursor.used + 1
    rotation.set(entry.id, used >= limit ? { index: (index + 1) % members.length, used: 0 } : { index, used })
  }
  return ordered
```

</details>

**依据 3 · 源码核查**：[src/adapter.js:288-331](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L288-L331)

候选迭代和输出缓冲，只有正常返回带 advance 的结果会走下一项。

<details>
<summary>查看原文（44行）</summary>

```text
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = committed ? await iterator.next() : await nextOrSilence(iterator, CHAIN_SILENCE_MS)
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
          held.length = 0
        }
      }
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
    }
    rejectedTurn(candidates.length)
    yield { type: 'finish', reason: { kind: 'error', failure: {
      message: `the chain "${entry.name}" exhausted every candidate: ${tried.join('; ')}`,
      code: CODE.server,
    } } }
```

</details>

**依据 4 · 源码核查**：[src/adapter.js:986-994](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L986-L994)

正文与工具事件提交，推理块被排除。

```text
function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
}
```

**依据 5 · 源码核查**：[src/adapter.js:63-75](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L63-L75)

沉默超时产生可推进结果，迭代器拒绝本身未捕获，关闭不等待。

<details>
<summary>查看原文（13行）</summary>

```text
async function nextOrSilence(iterator, ms) {
  let timer
  try {
    const silence = new Promise(resolve => { timer = setTimeout(() => resolve(SILENT_CANDIDATE), ms) })
    const row = await Promise.race([iterator.next(), silence])
    if (row !== SILENT_CANDIDATE) return row
    // Best effort: a pending next() cannot be interrupted, but the generator's
    // own finally blocks abort its transport once it settles.
    try { iterator.return?.(undefined) } catch {}
    return { done: true, value: { advance: true, verdict: null } }
  } finally {
    clearTimeout(timer)
  }
```

</details>

**依据 6 · 源码核查**：[src/adapter.js:382-396](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L382-L396)

匿名通道已被断路器挡住时在流尝试内部异常分类前抛出。

<details>
<summary>查看原文（15行）</summary>

```text
    const freeLane = !sealed && !kilo && !aggregate && !extension && !isComboEntry(entry) && !isSubscriptionEntry(entry)
    if (freeLane) {
      // The quota breaker: a window the upstream opened on this egress is a
      // wall no model/session/UA choice moves (issue #767 measured exactly
      // that), so the lane refuses locally instead of feeding the wall another
      // request. `重试` here means changing the exit or waiting for `retryAt`.
      const gate = this.deps.freeLaneGate?.()
      if (gate?.ok === false) {
        const when = Number.isFinite(gate.retryAt) ? new Date(gate.retryAt).toISOString() : 'until the exit changes'
        throw new UpstreamError(
          `the OpenCode free quota window is open on this egress${gate.message ? `: ${gate.message}` : ''} — retry after ${when}, or switch the lane's exit proxy; Kilo and extension channels are unaffected`,
          CODE.quota,
          { ...(Number.isFinite(gate.retryAt) ? { providerRetryAfterMs: Math.max(1000, gate.retryAt - Date.now()) } : {}), laneQuota: true, laneState: gate.state })
      }
    }
```

</details>

**依据 7 · 源码核查**：[src/adapter.js:628-635](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L628-L635)

流内失败有分类和推进判据，局部门禁抛错不经过这一段。

```text
      const advanceVerdict = (code, message, status) => {
        if (plan.allowAdvance !== true || options.signal?.aborted === true || sawAnswer) return { advance: false, verdict: null }
        const verdict = classifyFailure({ status, code, message })
        return { advance: shouldAdvance(verdict) || code === CODE.client || code === CODE.region, verdict }
      }
      try {
        const reader = readStream(channel.read(), wire, renameMap, () => Date.now(), {
          startIndex: nextIndex, checkpointLimit: policy.checkpointLimit,
```

**依据 8 · 源码核查**：[src/adapter.js:543-568](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L543-L568)

候选按不同通道把推理请求交给不同发送实现。

<details>
<summary>查看原文（26行）</summary>

```text
      const request = (sealed
        ? postSealedTurn(this.deps, payload, controller.signal, value => channel.push(value))
        : kilo
          ? postKiloStreamed({ body: payload, signal: controller.signal, onData: value => channel.push(value) })
          : aggregate
            ? postAggregateStreamed({
              config: settings.aggregate ?? {},
              providerId: entry.providerId,
              modelId: entry.modelId,
              body: payload,
              session,
              signal: controller.signal,
              onData: value => channel.push(value),
            })
            : extension
              ? this.deps.extensionRuntime.prepareChat(entry, payload, session)
                .then(prepared => postCompatibleStreamed({
                  ...prepared,
                  signal: controller.signal,
                  onData: value => channel.push(value),
                }))
              : postStreamed({
          path: endpointFor(entry.id), body: payload, session,
          attributionUserAgent: snapshot.attributionUserAgent,
          signal: controller.signal,
          onData: value => channel.push(value),
```

</details>

#### 缺口

- 没有受控流端点和真实宿主中的取消、超时或工具回合观测。
  **影响**：静态可确定局部门禁跳出组合，无法确定各宿主呈现何种错误或旧请求何时结束。
  **进一步探讨**：隔离复现一次上游返回限流和下一回合本地预拒绝，记录候选出站和实际错误。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 匿名免费通道如何处理限流与客户端门禁，能否视作持续可用额度？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能按仓库首页的免配额宣传推定长期供给。匿名通道的真实请求失败分类为 quota 时，运行时保存 retryAt，有正数 Retry-After 时使用其秒数换算，否则以六小时为本地等待窗口。FreeTierError 等客户端门禁会将通道记为 locked。有效窗口和锁会在发推理前挡住匿名调用，代码没有把同一断路器直接施加到 Kilo 或扩展通道。时间达到 retryAt 只恢复本机尝试机会，出口变化和手动清除也只改本地状态。这个机制让反复碰壁有明确停止点，无法改变上游额度、地区政策或对客户端的许可。默认 OpenCode 官方域名推理 POST 需要本机 Bun，目录 GET 可以走另一传输，所以看见模型和能发出推理是两个条件。

#### 证据与依据

**依据 1 · 源码核查**：[src/http.js:107-115](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/http.js#L107-L115)

区分地区和额度错误，限流附带 Retry-After 换算结果。

```text
  if (type === 'RegionError' || /not available in your country|region/i.test(flat)) {
    return new UpstreamError(message, CODE.region, { status, type })
  }
  if (type !== 'permission_error' && (type === 'insufficient_quota' || error.code === 'insufficient_quota')) {
    return new UpstreamError(message, CODE.exhausted, { status, type })
  }
  if (type !== 'permission_error' && (status === 429 || type === 'FreeUsageLimitError' || /usage limit|rate limit/i.test(flat))) {
    return new UpstreamError(message, CODE.quota, { status, type, providerRetryAfterMs: retryAfterMs })
  }
```

**依据 2 · 源码核查**：[src/http.js:136-146](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/http.js#L136-L146)

单独分类上游客户端门禁。

<details>
<summary>查看原文（11行）</summary>

```text
  // The free lane's client gate (issue #310): 403 FreeTierError — "OpenCode's
  // free tier can only be used from within OpenCode" — names the client, not
  // the credential or the model. The stock classifier filed it as
  // INVALID_CREDENTIAL, which wiped the cached roster and sent users chasing
  // a re-login that cannot help: the upstream refuses this client's fingerprint
  // and no credential change alters that. Its own code keeps it out of both
  // the credential branch and the generic 4xx fallthrough, and the availability
  // probe reads it as a lane-level lock (src/probe.js) instead of leaving the
  // model in the picker as "unknown".
  if (type === 'FreeTierError' || /free tier can only be used from within/i.test(flat)) {
    return new UpstreamError(message, CODE.laneLocked, { status, type })
```

</details>

**依据 3 · 源码核查**：[src/http.js:168-172](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/http.js#L168-L172)

重试时间仅接受正数秒。

```text
/** Parse `Retry-After` into milliseconds, when the header carries a number. */
function retryAfter(header) {
  const seconds = Number(header)
  return Number.isFinite(seconds) && seconds > 0 ? Math.trunc(seconds * 1000) : undefined
}
```

**依据 4 · 源码核查**：[src/core.js:209-209](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L209-L209)

默认额度窗口为六小时。

```text
var LANE_QUOTA_DEFAULT_MS = 6 * 60 * 60 * 1e3;
```

**依据 5 · 源码核查**：[src/core.js:320-336](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L320-L336)

本地按到期时间或锁决定拦截，清除操作仅写本地状态。

<details>
<summary>查看原文（17行）</summary>

```text
  function laneGate() {
    const lane = laneRow();
    if (!lane || lane.state === "ok" || lane.state === void 0) return { ok: true };
    if (lane.state === "quota") {
      if (!Number.isFinite(lane.retryAt) || lane.retryAt <= Date.now()) return { ok: true };
      return { ok: false, state: "quota", retryAt: lane.retryAt, message: lane.message ?? "" };
    }
    if (lane.state === "locked") {
      return { ok: false, state: "locked", message: lane.message ?? "" };
    }
    return { ok: true };
  }
  function clearLaneBreaker() {
    const lane = laneRow();
    if (!lane || lane.state === "ok") return false;
    setLaneState("ok");
    return true;
```

</details>

**依据 6 · 源码核查**：[src/core.js:348-369](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/core.js#L348-L369)

真实匿名请求反馈更新通道状态与模型被动记录。

<details>
<summary>查看原文（22行）</summary>

```text
  function noteFreeLaneOutcome({ entry, ok, error } = {}) {
    if (disposed || !entry || entry.channel) return;
    if (ok === true) {
      const lane = laneRow();
      if (lane && lane.state !== "ok") setLaneState("ok");
      recordPassiveResult(entry.id, STATE.available);
      return;
    }
    const code = error?.code;
    if (code === CODE.quota) {
      const retryAfter = Number(error?.providerRetryAfterMs);
      const retryAt = Number.isFinite(retryAfter) && retryAfter > 0 ? Date.now() + retryAfter : Date.now() + LANE_QUOTA_DEFAULT_MS;
      setLaneState("quota", { retryAt, message: String(error?.message ?? "free usage limit reached").slice(0, 300) });
      recordPassiveResult(entry.id, STATE.throttled);
      return;
    }
    if (code === CODE.laneLocked) {
      setLaneState("locked", { message: String(error?.message ?? "the free tier answers this client only").slice(0, 300) });
      recordPassiveResult(entry.id, STATE.unavailable);
      return;
    }
    if (code === CODE.region) recordPassiveResult(entry.id, STATE.regionBlocked);
```

</details>

**依据 7 · 源码核查**：[src/egress.js:230-243](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/egress.js#L230-L243)

目录读取允许 Node 路径，默认官方推理没有 Bun 会返回配置错误。

<details>
<summary>查看原文（14行）</summary>

```text
    if (!isPost) {
      if (laneProxy !== null && freeLaneProxy !== null) return laneProxiedFetch(url, init, laneProxy)
      if (laneProxy !== null && relay === null) return laneProxiedFetch(url, init, laneProxy)
      if (relay !== null) return relayFetch(url, init, relay)
      return fetch(url, init)
    }
    const executable = findBunExecutable()
    if (!executable) {
      // This sentence is the user's only answer until they install Bun, so it
      // carries the fix inline, bilingually, without an "upstream failed" wrap.
      const error = new Error('OpenCode 免费车道推理需要本机 Bun：请安装 Bun（https://bun.sh 或 npm i -g bun）后重试，或把 Bun 可执行文件路径写入 OUR_FREE_MODEL_BUN 环境变量。/ Install Bun or set OUR_FREE_MODEL_BUN to its executable path (OUR_FREE_MODEL_FREE_TRANSPORT=node restores the legacy transport).')
      error.laneConfig = true
      throw error
    }
```

</details>

**依据 8 · 作者声明**：[README.md:743-746](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/README.md#L743-L746)

作者免责声明同时说明额度、隐私、服务政策及 EAC 授权边界。

```text
- **本插件是一个客户端，不是模型服务方。** 所有模型响应均由上述第三方上游（OpenCode Zen 网关、Kilo AI 公共网关、以及你自己部署的 EAC 网关）生成并传输；插件不托管、不修改、不过滤任何模型输出。模型可能产出错误、过时或有偏颇的内容，请自行核实后再使用。
- **免费不等于无限，也不等于私有。** 免费额度由上游单方面提供，随时可能限流、收费或下线；Kilo 免费池明确声明 prompt 可能被上游记录并用于改进服务。**请勿通过本插件的免费车道发送密码、密钥、个人身份信息、商业机密或任何你不愿第三方处理的内容**；生产与敏感场景请使用你自己的付费 API。
- **上游条款由你遵守。** 使用各渠道即表示你同意对应上游的服务条款与用量政策；因违反上游政策导致的限流、封禁或其它后果由使用者自行承担。插件不对任何上游的可用性、准确性或连续性作任何承诺。
- **EAC 渠道为协付性质。** 该渠道的凭据与网关由仓库维护者部署（GitHub 登录 + star 仓库解锁），仅限授权用户使用；请勿尝试绕过授权闸门，勿转售或共享渠道访问权——滥用会导致全体用户的通道被收紧。
```

#### 缺口

- 未验证当下出口的上游接受范围、额度与实际计费。
  **影响**：不能承诺稳定、免费或可以恢复。
  **进一步探讨**：采用前核对所选上游当前许可与费用条件，受控试验记录状态码和发送量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用者要承担哪些接入、维护和退出成本，何时应继续用单一端点？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在可用 DSH profile 中用插件入口注册适配器，只有看板依赖可选 Web 服务。默认匿名 OpenCode POST 需要本机 Bun。Kilo 等上游仍需要对应服务可达，EAC 和自带 Key 通道有各自授权条件。仓库根包为私有开发包，README 提供带 scope 的发行路径，不能因同名便把公开包当作同一交付。用本机 API 客户端还要显式启用转发、持有 Key 和确认实际绑定端口。转发默认关闭且回环，局域网中继另开。保留原端点作退路，先在独立 profile 使用公开样例测一条获准通道，检查正常结束、预期工具参数和上游去向。出现无法解释的上游切换、限额预拒绝、工具行为变化或不可接受的延迟时停止组合，切回已核准的单一端点。插件卸载可移除 bundle，源码有注销和关闭回调，但已有请求上游是否处理或保留仍需按服务商政策理解。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:125-141](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/package.json#L125-L141)

声明宿主补丁、Web 客户端与依赖范围。

<details>
<summary>查看原文（17行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": []
    }
  },
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-commands": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.4"
```

</details>

**依据 2 · 作者声明**：[README.md:121-138](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/README.md#L121-L138)

作者区分第三方裸名包和自述发布的带 scope 包。

<details>
<summary>查看原文（18行）</summary>

````text
## 安装

> **⚠️ 不要安装 npm 上那个裸名的 `dsh-our-free-model`。**
>
> npm 上的 `dsh-our-free-model` 包**不是本仓库发布的**。它由第三方打包，内容与本仓库
> 不一致：`index.js`、`client.js` 被改动，并额外包含本仓库从未有过的
> `src/channel-visibility.js`。装到它得不到本项目审核过的构建，也拿不到本仓库的签名
> 清单校验与应用内升级。
>
> 本仓库自己发布的是带 scope 的 **`@ebony-vinyl/dsh-our-free-model`**，与 Release 的
> `dsh-our-free-model-<版本>.tgz` 同源、同版本。只想走 npm 时可以装它：
>
> ```
> dsh plugin --profile web add @ebony-vinyl/dsh-our-free-model@2.8.3
> ```
>
> 注意它的包名带 scope，因此挂载条目是 `@ebony-vinyl/dsh-our-free-model`，与下文
> 裸包名的本地安装方式不能混用（同一个 profile 里只选一种）。
````

</details>

**依据 3 · 源码核查**：[index.js:1464-1471](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/index.js#L1464-L1471)

Web 服务出现后才挂载设置和事件路由。

```text
  ctx.inject(['webServer'], scoped => {
    const server = scoped.webServer
    scoped.effect(() => server.register({ kind: 'prefix', path: '/api/our-free-model', handler: api }), 'our-free-model: api routes')
    // The events stream is an exact route: exact dispatch outranks the prefix, so
    // the hub's handler owns the socket while every other path still lands on the
    // JSON API.
    scoped.effect(() => server.register({ kind: 'exact', path: '/api/our-free-model/events', handler: eventsRoute }), 'our-free-model: events stream')
    logger.info?.('our-free-model: settings API mounted at /api/our-free-model')
```

**依据 4 · 源码核查**：[src/store.js:188-195](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/store.js#L188-L195)

本地转发和局域网中继默认关闭。

```text
  /** Serve the OpenAI-compatible forward listener for other local harnesses. */
  forward: {
    enabled: false,
    host: '127.0.0.1',
    port: 18899,
    /** Reach that listener from other machines on the network; off by default,
     *  binds a routable address, and demands a key of its own (`forwardLanKey`). */
    lan: { enabled: false, port: 0 },
```

**依据 5 · 源码核查**：[src/forward.js:361-394](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/forward.js#L361-L394)

健康检查可先返回，模型目录及常用推理接口在密钥检查之后。

<details>
<summary>查看原文（34行）</summary>

```text
    // Liveness only, and deliberately before the key check: a caller probing
    // whether the port is up must not need the key to get an answer. It gets a
    // count of nothing — the model roster is what the authenticated routes serve.
    if (path === '/' || path === '/health') {
      json(res, 200, health())
      return
    }
    const googleKey = req.headers['x-goog-api-key'] ?? url.searchParams.get('key')
    const googleAuthorized = gemini && typeof settings.key === 'string' && settings.key !== ''
      && keyMatches(googleKey, settings.key)
    if (!authorized(req, settings.key) && !googleAuthorized) {
      if (gemini) { geminiError(res, 401, 'missing or invalid API key'); return }
      openAiError(res, 401, 'invalid_request_error', 'missing or invalid API key')
      return
    }
    if (gemini) {
      await serveCompletion(req, res, complete, geminiEndpoint({ readBody, json, modelRows, route: gemini, url }), heartbeatMs, trace)
      return
    }
    if (req.method === 'GET' && (path === '/v1/models' || path === '/models')) {
      json(res, 200, { object: 'list', data: modelRows() })
      return
    }
    if (req.method === 'POST' && (path === '/v1/chat/completions' || path === '/chat/completions')) {
      await serveCompletion(req, res, complete, chatCompletions, heartbeatMs, trace, { optimize })
      return
    }
    if (req.method === 'POST' && (path === '/v1/responses' || path === '/responses')) {
      await serveCompletion(req, res, complete, responsesEndpoint, heartbeatMs, trace, { optimize })
      return
    }
    if (req.method === 'POST' && (path === '/v1/messages' || path === '/messages')) {
      await serveCompletion(req, res, complete, messagesEndpoint, heartbeatMs, trace, { optimize })
      return
```

</details>

**依据 6 · 源码核查**：[index.js:1543-1561](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/index.js#L1543-L1561)

宿主卸载路径关闭监听器并注销适配器。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.effect(() => () => {
    void forward?.close().catch(() => {})
    void relay?.close().catch(() => {})
    void chanRelay?.close().catch(() => {})
    void outletRelay?.close().catch(() => {})
  }, 'our-free-model: forward listener')

  ctx.effect(() => () => { registration() }, 'our-free-model: adapter routes')

  ctx.effect(() => () => {
    disposed = true
    eacLoginPoller.reset()
    // The geography-reprobe timer belongs to this generation; without this it
    // outlives teardown and fires a forced probe round after the stores it
    // reads have been disposed (the rejection gets swallowed, quota burned).
    modelRuntime.dispose()
    push.dispose()
    watcher?.()
  }, 'our-free-model: push + watcher')
```

</details>

**依据 7 · 作者声明**：[README.md:736-745](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/README.md#L736-L745)

作者说明推理上下文去向、免费通道数据条件和服务政策。

<details>
<summary>查看原文（10行）</summary>

```text
你的 prompt、工具结果与随附图像会作为正常推理请求发送至所选模型对应的上游——与调用任何模型 API 相同。除此之外插件不上传任何内容：用量看板数据、设置、转发 Key 均只落在本机 DSH_HOME/our-free-model/。

免密不等于无人管理：免费车道通过 x-opencode-\* 指纹识别客户端、按会话统计免费额度，会因地区返回 403、因超量返回 429。**Kilo 免费池在其模型卡中明确声明：prompt 可能被上游提供方记录，并用于改进其服务**（原文见 kilo-auto/free 模型卡："Prompts may be logged by the upstream provider and used to improve their services. Not suitable for production or sensitive data workloads."）。模型集合与额度政策由上游决定，随时可能变更；插件仅能如实将不可用的模型从选择器中移除。

本节属于仓库文档。应用内的选择器、设置页与报错文案中仍不出现上游厂名（该约定见验收情况一节），但 Kilo 渠道的模型卡徽章悬停提示会告知"prompt 可能被上游记录"——这是选择模型时需要知道的信息。
## 免责声明

- **本插件是一个客户端，不是模型服务方。** 所有模型响应均由上述第三方上游（OpenCode Zen 网关、Kilo AI 公共网关、以及你自己部署的 EAC 网关）生成并传输；插件不托管、不修改、不过滤任何模型输出。模型可能产出错误、过时或有偏颇的内容，请自行核实后再使用。
- **免费不等于无限，也不等于私有。** 免费额度由上游单方面提供，随时可能限流、收费或下线；Kilo 免费池明确声明 prompt 可能被上游记录并用于改进服务。**请勿通过本插件的免费车道发送密码、密钥、个人身份信息、商业机密或任何你不愿第三方处理的内容**；生产与敏感场景请使用你自己的付费 API。
- **上游条款由你遵守。** 使用各渠道即表示你同意对应上游的服务条款与用量政策；因违反上游政策导致的限流、封禁或其它后果由使用者自行承担。插件不对任何上游的可用性、准确性或连续性作任何承诺。
```

</details>

#### 缺口

- 没有同版本安装、使用和移除的实测，也没有每个合格任务的费用、资源和耗时数据。
  **影响**：不能判断长期负担能否抵消配置和切换收益。
  **进一步探讨**：锁定 profile 和上游，分别记录接入、失败恢复、实际收费与切回原配置的人工耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何在请求发出前减少跨上游的数据与配额误用，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

现有组合模型可以用配置限制成员，近期配额策略会排序或过滤，但未看到被查的候选执行路径按当次输入的数据敏感等级建立上游允许清单。可在进入 runSingle 前加一层由用户预先确认的接收方集合，显示可能发送的候选及过期的费用信息，只给获准供应商发送。对照现有固定成员链，另测同一成员链加允许清单。用可控端点与无敏感的模拟标签制造首候选故障，记录发送到未授权上游的次数、正确任务完成率、首字时延和配置耗时。若不降低误发，或因为陈旧标记带来过多误拦截、办结损失或维护负担，则推翻在该场景的采用假设。这里只提出设计推演，当前实现已经能限制预配置成员。

#### 证据与依据

**依据 1 · 源码核查**：[src/combos.js:179-202](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/combos.js#L179-L202)

当前候选约束从组合 ID、目录和近期配额读数推导。

<details>
<summary>查看原文（24行）</summary>

```text
export function comboChain(entry, catalog, options = {}) {
  const ids = Array.isArray(entry?.combo) ? entry.combo : []
  const byId = new Map()
  for (const row of catalog) byId.set(row.id, row)
  const path = new Set(options.path ?? [])
  if (path.has(entry?.id)) return []
  path.add(entry?.id)
  const dedup = new Set()
  const members = ids.flatMap(id => {
    const row = byId.get(id)
    return row ? isComboEntry(row) ? comboChain(row, catalog, { ...options, path }) : [row] : []
  }).filter(row => { if (dedup.has(row.id)) return false; dedup.add(row.id); return true })
  if (members.length <= 1) return members
  if (['smart', 'usage', 'pace'].includes(entry.strategy)) {
    const now = Number.isFinite(options.now) ? options.now : Date.now()
    const readings = row => {
      const quota = options.quota?.[row.id]
      const checked = Date.parse(quota?.checkedAt ?? '')
      if (!quota || !['ok', 'available'].includes(quota.status) || !Number.isFinite(checked) || now - checked > 15 * 60_000 || checked > now + 60_000) return []
      return (quota.windows ?? []).filter(window => {
        const reset = Date.parse(window.resetsAt ?? '')
        return typeof window.remainingPercent === 'number' && window.remainingPercent >= 0 && window.remainingPercent <= 100
          && (!Number.isFinite(reset) || reset > now)
      })
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:282-296](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L282-L296)

候选序列直接进入单模型执行，是可加出站约束的位置。

<details>
<summary>查看原文（15行）</summary>

```text
    const candidates = comboChain(entry, snapshot.catalog, snapshot.routing ?? {})
    if (candidates.length === 0) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `the chain "${entry.name}" has no model available on this egress`, code: CODE.server } } }
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
```

</details>

**依据 3 · 源码核查**：[src/adapter.js:543-568](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/363c62115bc19803e44c2890c2c93582b95ff839/src/adapter.js#L543-L568)

不同候选可把请求发送到不同传输和上游。

<details>
<summary>查看原文（26行）</summary>

```text
      const request = (sealed
        ? postSealedTurn(this.deps, payload, controller.signal, value => channel.push(value))
        : kilo
          ? postKiloStreamed({ body: payload, signal: controller.signal, onData: value => channel.push(value) })
          : aggregate
            ? postAggregateStreamed({
              config: settings.aggregate ?? {},
              providerId: entry.providerId,
              modelId: entry.modelId,
              body: payload,
              session,
              signal: controller.signal,
              onData: value => channel.push(value),
            })
            : extension
              ? this.deps.extensionRuntime.prepareChat(entry, payload, session)
                .then(prepared => postCompatibleStreamed({
                  ...prepared,
                  signal: controller.signal,
                  onData: value => channel.push(value),
                }))
              : postStreamed({
          path: endpointFor(entry.id), body: payload, session,
          attributionUserAgent: snapshot.attributionUserAgent,
          signal: controller.signal,
          onData: value => channel.push(value),
```

</details>

#### 缺口

- 未验证按请求约束能否在用户正确标注与上游变更之间维持净收益。
  **影响**：不能将设想计入现有创新或采用得分。
  **进一步探讨**：用固定用例对比误发与误拦，并核对接收方标记过期和回退行为。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
