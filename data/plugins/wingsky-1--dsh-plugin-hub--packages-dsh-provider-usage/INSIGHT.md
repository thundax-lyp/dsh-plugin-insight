# dsh-provider-usage

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wingsky-1/dsh-plugin-hub) [![npm 30d 1,888](https://img.shields.io/static/v1?label=npm+30d&message=1%2C888&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-provider-usage) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-provider-usage)
<!-- END META -->

> **功能**：在 DSH Web 中展示多 provider 用量与历史趋势。

> **亮点**：把多个供应商的可读取数据放进会话旁的胶囊和历史。取数失败时保留错误状态和最后成功采样时间，缓存失败值也保持警示，避免看到旧值就把它当成当前状态。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：部分供应商余额差额为估算，最后成功采样与即时账单也有时间差。用户适配器在形状校验前已经通过 import 执行，因此只靠契约校验无法控制代码与凭据访问。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 用量面板解决什么重复任务，输出与简单替代有何不同？](#detail-section-11)
  - [Q02 · 适配器如何取数、存历史和渲染？失败时如何标记陈旧数据？](#detail-section-12)
  - [Q03 · 密钥、HTML 输出和估算误差有哪些边界？](#detail-section-13)
  - [Q04 · 哪些条件下值得安装，如何核验准确性和退出？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需查看 DSH 当前 provider 余额/用量并对比历史的用户。插件提供常驻胶囊和详情面板，支持 DeepSeek 官方余额/区间推算和 OpenCode Go 三窗口用量，也允许自定义 adapter。相比逐个平台登录查看，它在 DSH 内集中展示；官方无用量 API 时的余额差额是估算，不是账单或预算保证。

官方供应商页面可按其自身时区、账户与账单口径复查，逐页查看需要切换上下文。插件将选定接口的样本集中到 DSH，比较时必须使用同一账号、时间窗和数据口径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 供应商适配 | 取供应商余额或计量窗口 | 支持内置和自定义适配器，自定义实际执行代码 |
| 胶囊与历史 | 查看当前、之前采样及时间趋势 | 显示的是适配器提供的口径 |
| 陈旧降级 | 失败时提示取数错误与最后成功值 | 无有效历史则不能回显数值，陈旧值不用于实时对账 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web 宿主与用量客户端 | 加载胶囊和可按供应商查看的统计 | 固定宿主组合未验收 |
| 内置适配器及供应商凭据 | 读取余额或时间窗用量 | 需核对账号、端点和 API 实际口径 |
| 可读历史存储 | 供最近成功样本、历史显示及陈旧降级 | 读取失败时返回报错及空占位数据 |

| 阶段 | 操作 | 异常与退出 |
| --- | --- | --- |
| 固定样本 | 只启用一个可信内置适配器，选一项官方可回查余额或窗口值 | 先确认密钥来源和期望账号 |
| 模拟失败 | 对照看板、官方值、历史及时间标记，随后人为造成一次取数失败 | 失败帧只显示最近成功样本，不作为新采样 |
| 退出 | 退回官方界面并禁用适配器 | 另行核对历史保留及配置密钥，勿先载入陌生代码 |

**效果与成本**

| 阶段 | 现金与资源 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 接入 | 要求供应商接口和可用账号 | 配置单个适配器并核对取数口径 | 各供应商收费和接入时间未知 |
| 跟踪 | 轮询、请求、写入按日历史 | 检查陈旧提示，区分估算和账单 | 真实网络负载与查询节时未测 |
| 恢复 | 重取、审计已保存历史或停用适配器 | 回查官方数值及配置密钥 | 历史文件保留和恢复工时未测 |

| 效果项 | 当前源码可支持 | 未验证项 |
| --- | --- | --- |
| 集中核对余额与时段 | 胶囊与历史共享同一适配后的数据模型 | 跨供应商统计口径和账单一致性仍需确认 |
| 避免把失败当新数据 | 失败帧缺写盘 rawData 并保留成功时间，客户端警示 cached 错误 | 真实用户能否识别陈旧值未验收 |

> **思考**：部分供应商余额差额为估算，最后成功采样与即时账单也有时间差。用户适配器在形状校验前已经通过 import 执行，因此只靠契约校验无法控制代码与凭据访问。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多个供应商的可读取数据放进会话旁的胶囊和历史。取数失败时保留错误状态和最后成功采样时间，缓存失败值也保持警示，避免看到旧值就把它当成当前状态。[Q01](#research-q01) [Q02](#research-q02)

适配器取数经信号与时间预算包装，只有成功帧携带新鲜原始数据。失败时可读最近成功样本并保留失败标志。宿主交给渲染器 esc，再净化 HTML，UI 直接消费此输出。自定义 adapter 在检查契约之前先 import，不能当作不执行的配置文件。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

部分供应商余额差额为估算，最后成功采样与即时账单也有时间差。用户适配器在形状校验前已经通过 import 执行，因此只靠契约校验无法控制代码与凭据访问。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先只用一个可信内置适配器核对官方值、时间窗和最近成功记录，再用测试凭据检查失败状态。无法区分估算和账单、陈旧提示不可靠或密钥来源不明时，停用该适配器并回到官方用量页。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核实适配器调用、陈旧回显和 HTML 净化接线。实际供应商配额、账单一致性、使用者对警示的理解和收益未知。

- 已检查：作者 README、包清单、源码路径 packages/dsh-provider-usage/README.md、packages/dsh-provider-usage/src/index.ts、packages/dsh-provider-usage/src/server/pipeline/v2.ts、packages/dsh-provider-usage/src/server/registry/registry.ts、packages/dsh-provider-usage/src/client/float-view.ts、packages/dsh-provider-usage/src/client/settings/usage.tsx、packages/dsh-provider-usage/src/server/registry/user-adapter-loader.ts 及固定范围 inventory；组件：packages/dsh-provider-usage。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 wingsky-1/dsh-plugin-hub packages/dsh-provider-usage 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：选一个供应商账号，在同一时间窗对照官方界面、本次采样和落盘历史。注入一次限流或无效凭据，检查错误后的警示点、旧值时间和无新增历史。金额或时段无法对齐时回官方页。[Q04](#research-q04)

**分析版本**

- **仓库**：[wingsky-1/dsh-plugin-hub](https://github.com/wingsky-1/dsh-plugin-hub)
- **版本号**：0.2.11（[固定提交 62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在频繁切换供应商的工作中，同时显示最后成功时间、陈旧警示和官方入口，可能减少把旧余额误用于当前决策。用同一测试账户注入一次限流，对比插件与逐页查看的时间、误用旧值及金额差异。若陈旧失误增加或口径对不上，保留官方页为复核入口。[Q04](#research-q04)

选一个供应商账号，在同一时间窗对照官方界面、本次采样和落盘历史。注入一次限流或无效凭据，检查错误后的警示点、旧值时间和无新增历史。金额或时段无法对齐时回官方页。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2314 | — | — | 31958 |
| .ts | source | 105 | 22746 | 16208 | 4984 | — |
| .tsx | source | 8 | 5926 | 5003 | 712 | — |
| .mjs | source | 3 | 2440 | 1768 | 472 | — |
| .ts | test | 135 | 50760 | 42077 | 3430 | — |
| .mjs | test | 3 | 775 | 616 | 126 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/wingsky-1/dsh-plugin-hub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多 provider 用量面板能否在不泄露 API 密钥且明确推算/陈旧状态的前提下提供可信的消费观察？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用量面板解决什么重复任务，输出与简单替代有何不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需查看 DSH 当前 provider 余额/用量并对比历史的用户。插件提供常驻胶囊和详情面板，支持 DeepSeek 官方余额/区间推算和 OpenCode Go 三窗口用量，也允许自定义 adapter。相比逐个平台登录查看，它在 DSH 内集中展示；官方无用量 API 时的余额差额是估算，不是账单或预算保证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-provider-usage/README.md:5-11](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/README.md#L5-L11)

定位、多 provider、内置适配器及 host 端渲染。

```text
DSH（DeepSeek Harness）Web GUI 插件：**多 provider 通用用量统计框架**（v2 适配器契约）。

聊天界面右上角常驻悬浮胶囊，展示当前模型 provider 的用量信息；点击展开详情面板。
内置两套适配器开箱即用——**DeepSeek 官方**（余额 + 峰谷倒计时徽标 + 每日用量推算）与
**OpenCode Go**（官方 `/v1/usage` 三窗口用量）；其他任意数据源只需按 v2 契约写一个
mjs 适配器文件即可接入（设置页检测/添加/切换热插拔，见「适配器开发指南」）。
渲染在**宿主端**完成——适配器返回 HTML、客户端只做注入，密钥不进浏览器。
```

**依据 2 · 作者声明**：[packages/dsh-provider-usage/README.md:23-34](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/README.md#L23-L34)

作者描述估算方法、凭据处理、历史缓存和清理。

<details>
<summary>查看原文（12行）</summary>

```text
- **通用框架 + 开箱即用**：一套 v2 适配器契约承载任意 provider；DeepSeek 官方与
  OpenCode Go 两套适配器内置，装完即显示用量
- **接入任意数据源只需一个 mjs 文件**：`fetchData` / `formatCapsule` / `formatPanel`
  三个导出即完成接入；设置页检测/添加/切换热插拔，改文件自动热更新
- **官方没有用量接口也能算**：DeepSeek 内置适配器以区间记账法推算每日消耗
  （纯消费区间 = 余额降幅，可与平台账单对账；充值独立列示不混算；异常区间不计），
  余额折线充值时刻自动断轴平移，附峰谷倒计时徽标与 15 日用量柱形面板
- **密钥不出宿主**：取数在宿主端执行，密钥只在宿主端持有与使用、不下发浏览器
  （推荐凭据链 / env 注入；显式 `apiKey` 配置会随宿主配置落盘并以 0600 保护）；
  渲染输出双层净化（`esc()` 转义义务 + 结构化净化兜底），XSS 双重防线
- **历史可回溯、性能有兜底**：按天分片 JSONL 落盘（0600）、超龄超量自动清理；
  面板渲染进程内缓存 + stats 缓存 + 后台预热，数据未变时重复请求零重算
```

</details>

**依据 3 · 源码核查**：[packages/dsh-provider-usage/src/index.ts:1-18](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/index.ts#L1-L18)

包入口显式导出插件和 adapter 契约。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * dsh-provider-usage —— 包组合根入口（#768 D13）。
 *
 * 薄转发：全部符号经 ./apply/index.ts（装配层组合根）透出，本文件不定义行为。
 * 为什么是显式具名转发而不是 export *：export-surface-snapshot 的提取器只读具名导出与声明块（不跟随星导出），星转发会让主入口导出面读出为空而判红。
 * 新增公共符号时两处同步加名（漂移即门禁红）。
 *
 * 导出面收窄（#875 M2b 批次 2）：本入口从 64 条收到 41 条，撤出 23 条能力内部
 * 形状。判据与逐条证据见 scripts/data/dsh-provider-usage-export-faces.json 的
 * 规则段（(b)/(d) 三支）；撤出前已穷举包外消费方——全仓无任何代码 import 本包
 * （dsh-mcp-manager 的 FloatBreakpoint/ViewportPoint/RectLike 是它自己
 * src/shared/placement-math.ts:60/71/101 的独立副本，sseData 取自仓级
 * shared/host-utils.ts:71，均非从本包导入）。域门面（各 server/<域>/interface.ts）
 * 继续导出这些符号，包内测试走深路径不受影响；唯一从产物入口 lib/index.js 消费的
 * test/e2e/smoke.test.ts:207 只用 apply/inject/ROUTES/HotReloadableAdapter，
 * 四条全在保留侧。
 */
export { HotReloadableAdapter, ROUTES, apply, inject, name } from "./apply/index.ts";
```

</details>

#### 缺口

- 没有实际账单对照、用户用量决策或准确性基线。
  **影响**：余额变化可能混入充值/退款/汇率
  **进一步探讨**：对照 provider 明细账单并标注估算误差。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 适配器如何取数、存历史和渲染？失败时如何标记陈旧数据？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

服务器端运行 adapter.fetchData，5 秒超时并合并取消信号；成功数据进入按日分片历史并输出 capsule HTML，失败时展示 stale 状态及最后成功值，不把失败值记为新鲜历史。客户端轮询/会话 provider 投影刷新面板；自定义 adapter 需要遵循契约并提供 endpoint/key。

失败帧没有 rawData，表示无需把失败结果当作新历史。最后成功条目读取失败时，本次仍返回 error，只用空数据占位。客户端只要见到 stale 或 error 就显示警示，即使失败值在短期缓存进入 cached 也不会变成正常。旧值的更新时间来自 lastSuccessAt。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:67-115](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L67-L115)

执行超时受控 fetch、记录成功历史并返回新鲜结果。

<details>
<summary>查看原文（49行）</summary>

```text
export async function runV2Pipeline(ctx: V2PipelineContext): Promise<V2PipelineResult> {
  const { adapter, provider } = ctx;
  const fetchedAt = Date.now();

  // fail-fast：管道内部组装断言——组装前提非法时不发起任何取数，
  // 直接产出既有 error 帧（stale + error），不让请求悬挂。这是管线自身的防御性
  // 检查，不是对用户适配器的契约行为约束（不改 FetchContext 契约、不新增配置项）。
  if (!hasUsableTimeout(ctx.timeoutMs)) return assemblyFailure(ctx, fetchedAt);

  // 2. safeFetchData（5s 固定超时 + 序列化 + 错误隔离）。
  const fetched = await safeFetchData(
    // 闭包接收合并信号（超时兜底 × ctx.signal 外部信号，手动级联合流）
    // 并放进 adapter.fetchData 入参——适配器把 ctx.signal 透传给底层 fetch 即获得真取消能力
    // （deepseek-official 直传 fetch、opencode-go 监听 signal 均立即受益）；
    // 0 参 fetchData 忽略入参不受影响。
    async (signal) => {
      const fetcher: typeof fetch = ctx.fetchImpl ?? fetch;
      return adapter.fetchData({
        ...buildFetchContext(ctx),
        signal,
        fetch: fetcher,
      } as unknown as FetchContext);
    },
    ctx.timeoutMs,
    ctx.signal,
  );

  if (fetched.error !== undefined) return staleFailure(ctx, fetchedAt, fetched.error);

  // 3. 落盘历史（按天分片 JSONL；失败不阻断展示，只记日志）
  const data = fetched.data ?? {};
  const capsuleHtml = await renderCapsule(ctx, {
    time: fetchedAt,
    data,
    status: "fresh",
  });

  return {
    ok: true,
    configured: true,
    reason: null,
    error: null,
    fetchedAt,
    provider,
    adapterName: adapter.name,
    status: "fresh",
    capsuleHtml,
    rawData: data,
  };
```

</details>

**依据 2 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:157-200](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L157-L200)

失败转为 stale 并保留最后成功时间/数据。

<details>
<summary>查看原文（44行）</summary>

```text
 * 取数失败帧（stale 胶囊 + status:'stale' + error，不带 rawData → 上层不落盘历史，
 * 错误帧绝不以 fresh 身份进历史）。
 */
async function staleFailure(
  ctx: V2PipelineContext,
  fetchedAt: number,
  error: string,
): Promise<V2PipelineResult> {
  // 带值降级：注入 history 时读取最后一条成功数据喂给 formatCapsule——
  // 数值部分始终渲染最后成功值（避免健康值跌成 "--"），数据来源状态交给
  // 客户端圆点颜色表达（dou-dot-warn 黄点 = 陈旧降级，见 client pillDotLevel）。
  // history 读取失败视同无历史（空 data 占位），绝不因兜底读失败而改变错误帧语义。
  const last = await lastSuccessfulEntry(ctx);
  const capsuleHtml = await renderCapsule(ctx, {
    time: fetchedAt,
    data: last?.data ?? {},
    status: "stale",
    error,
  });
  return {
    ok: false,
    configured: true,
    reason: "fetch-failed",
    error,
    fetchedAt,
    provider: ctx.provider,
    adapterName: ctx.adapter.name,
    status: "stale",
    ...(capsuleHtml !== undefined ? { capsuleHtml } : {}),
    ...(last !== null ? { lastSuccessAt: last.time } : {}),
  };
}

/** 最后一条成功帧（读失败/无历史/非对象载荷/t 非法一律 null）。 */
async function lastSuccessfulEntry(
  ctx: V2PipelineContext,
): Promise<{ time: number; data: Record<string, unknown> } | null> {
  if (ctx.history === undefined) return null;
  const lastEntry = await ctx.history.last(ctx.provider, ctx.adapter.name).catch(() => null);
  if (lastEntry === null || !lastEntry.data || typeof lastEntry.data !== "object") return null;
  const time = lastEntry.time;
  // 非正时刻防御：损坏分片不得让客户端渲染出「2 万天前」（#1167 评审批次 P2）。
  if (typeof time !== "number" || !Number.isFinite(time) || time <= 0) return null;
  return { time, data: lastEntry.data };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-provider-usage/src/server/registry/registry.ts:129-155](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/registry/registry.ts#L129-L155)

注册表保留候选与错误状态。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * 适配器注册表（候选 + 唯一启用）。
 * @param opts.diag - 诊断收集器（缺省 console.warn）。
 * @param opts.sanitizePath - 错误消息路径脱敏（把绝对路径归约为 `~` 形态，信息面最小披露）。
 */
export function makeAdapterRegistry(
  opts: { diag?: (m: string) => void; sanitizePath?: (s: string) => string } = {},
) {
  const diag = opts.diag ?? ((m: string): void => console.warn("[dsh-provider-usage]", m));
  const sanitizePath = opts.sanitizePath ?? ((s: string): string => s);
  /** provider → 有序候选条目。 */
  const candidatesByProvider = new Map<string, AdapterEntry[]>();
  /** provider → 当前启用 name。 */
  const enabledNames = new Map<string, string>();
  /** 已注册 name 集合（同 name 重复拒绝）。 */
  const registeredNames = new Set<string>();
  /** 最近一次错误登记（key = name 或 file:<basename>）。 */
  const lastErrors = new Map<string, AdapterErrorInfo>();
  /** 最近一次已登记的 seam 诊断签名（同签名不重复登记，防每轮取数刷时间戳与日志）。 */
  let lastSeamDiagnostic: string | undefined;

  /** 登记一次适配器错误（warn + 记录最近一次；同 key 覆盖）。 */
  function recordError(key: string, kind: "load" | "exec", message: string): void {
    lastErrors.set(key, { at: Date.now(), kind, message: sanitizePath(message) });
    diag(`适配器 ${key} ${kind === "load" ? "加载" : "执行"}错误：${sanitizePath(message)}`);
  }

```

</details>

**依据 4 · 作者声明**：[packages/dsh-provider-usage/README.md:68-91](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/README.md#L68-L91)

描述服务端取数、缓存和 provider 跟随刷新。

<details>
<summary>查看原文（24行）</summary>

````text
## 工作原理（v2）

```
宿主端（Node）                                客户端（浏览器）
─────────────────────────────                ─────────────────────
预热定时器(5min) ─┐
                  ├→ getStats()               60s 轮询 /stats（取数前先复检
客户端轮询 ───────┘   │ Mutex 互斥锁              会话当前 provider，#71 自愈）
                      │ 60s 缓存              胶囊框架 ← capsuleHtml
                      │ 5s 取数超时           面板框架 ← panelHtml(/history，90s 兜底缓存)
                      ↓
                adapter.fetchData(ctx)   ← 用户 mjs（apiEndpoint/staticPath/apiKey 注入）
                      ↓
                按天分片 JSONL 历史落盘 ──→ 面板渲染缓存全清（主失效）
                      ↓
                adapter.formatCapsule/Panel() → 净化 → HTML 下发
```

内置适配器 `opencode-go-builtin`（OpenCode Go 官方 `/v1/usage` 三窗口用量）与
`deepseek-official-builtin`（DeepSeek 官方余额 + 峰谷倒计时徽标，见下节）开箱即用。

> provider 跟随语义（0.1.2 投影面，#383）：切换会话即时刷新；会话内切模型经宿主
> modelSelection 投影帧（control frame type:projection）实时推送、客户端**切完即重拉**；
> 信号缺失最坏场景由每次取数前的复检兜底自愈（#71）——最长一个轮询周期内收敛。
````

</details>

**依据 5 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:76-115](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L76-L115)

adapter 传入信号与新鲜返回形状；适配器须实际接收 signal 才能取消底层调用。

<details>
<summary>查看原文（40行）</summary>

```text
  // 2. safeFetchData（5s 固定超时 + 序列化 + 错误隔离）。
  const fetched = await safeFetchData(
    // 闭包接收合并信号（超时兜底 × ctx.signal 外部信号，手动级联合流）
    // 并放进 adapter.fetchData 入参——适配器把 ctx.signal 透传给底层 fetch 即获得真取消能力
    // （deepseek-official 直传 fetch、opencode-go 监听 signal 均立即受益）；
    // 0 参 fetchData 忽略入参不受影响。
    async (signal) => {
      const fetcher: typeof fetch = ctx.fetchImpl ?? fetch;
      return adapter.fetchData({
        ...buildFetchContext(ctx),
        signal,
        fetch: fetcher,
      } as unknown as FetchContext);
    },
    ctx.timeoutMs,
    ctx.signal,
  );

  if (fetched.error !== undefined) return staleFailure(ctx, fetchedAt, fetched.error);

  // 3. 落盘历史（按天分片 JSONL；失败不阻断展示，只记日志）
  const data = fetched.data ?? {};
  const capsuleHtml = await renderCapsule(ctx, {
    time: fetchedAt,
    data,
    status: "fresh",
  });

  return {
    ok: true,
    configured: true,
    reason: null,
    error: null,
    fetchedAt,
    provider,
    adapterName: adapter.name,
    status: "fresh",
    capsuleHtml,
    rawData: data,
  };
```

</details>

**依据 6 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:156-200](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L156-L200)

失败帧的旧值、错误、缺失时处理及成功时间字段。

<details>
<summary>查看原文（45行）</summary>

```text
/**
 * 取数失败帧（stale 胶囊 + status:'stale' + error，不带 rawData → 上层不落盘历史，
 * 错误帧绝不以 fresh 身份进历史）。
 */
async function staleFailure(
  ctx: V2PipelineContext,
  fetchedAt: number,
  error: string,
): Promise<V2PipelineResult> {
  // 带值降级：注入 history 时读取最后一条成功数据喂给 formatCapsule——
  // 数值部分始终渲染最后成功值（避免健康值跌成 "--"），数据来源状态交给
  // 客户端圆点颜色表达（dou-dot-warn 黄点 = 陈旧降级，见 client pillDotLevel）。
  // history 读取失败视同无历史（空 data 占位），绝不因兜底读失败而改变错误帧语义。
  const last = await lastSuccessfulEntry(ctx);
  const capsuleHtml = await renderCapsule(ctx, {
    time: fetchedAt,
    data: last?.data ?? {},
    status: "stale",
    error,
  });
  return {
    ok: false,
    configured: true,
    reason: "fetch-failed",
    error,
    fetchedAt,
    provider: ctx.provider,
    adapterName: ctx.adapter.name,
    status: "stale",
    ...(capsuleHtml !== undefined ? { capsuleHtml } : {}),
    ...(last !== null ? { lastSuccessAt: last.time } : {}),
  };
}

/** 最后一条成功帧（读失败/无历史/非对象载荷/t 非法一律 null）。 */
async function lastSuccessfulEntry(
  ctx: V2PipelineContext,
): Promise<{ time: number; data: Record<string, unknown> } | null> {
  if (ctx.history === undefined) return null;
  const lastEntry = await ctx.history.last(ctx.provider, ctx.adapter.name).catch(() => null);
  if (lastEntry === null || !lastEntry.data || typeof lastEntry.data !== "object") return null;
  const time = lastEntry.time;
  // 非正时刻防御：损坏分片不得让客户端渲染出「2 万天前」（#1167 评审批次 P2）。
  if (typeof time !== "number" || !Number.isFinite(time) || time <= 0) return null;
  return { time, data: lastEntry.data };
```

</details>

**依据 7 · 源码核查**：[packages/dsh-provider-usage/src/client/float-view.ts:39-62](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/client/float-view.ts#L39-L62)

stale 或 error 分支和最后更新时间的防御检查。

<details>
<summary>查看原文（24行）</summary>

```text
 * 状态点等级：fresh/cached（成功取数）→ ok；stale 或带 error → warn；未配置 → err。
 * 失败帧在缓存期内 status 可能是 cached：只要带 error 也必须是 warn，
 * 不得出现「绿点 + 取数失败 + 最后更新」自相矛盾（#1167 评审批次 P2）。
 */
export function pillDotLevel(stats: StatsResponseV2 | null): "ok" | "warn" | "err" {
  if (stats === null) return "warn"; // 启动加载中：黄点（非错误）
  if (!stats.configured) return "err"; // 确实未配置/无启用适配器
  if (stats.status === "stale") return "warn"; // 降级陈旧（含 busy：取数进行中）
  if (stats.error !== null && stats.error !== undefined) return "warn"; // cached 失败帧
  return "ok";
}

/**
 * 取数失败但带旧值降级时，胶囊追加的「最后成功更新」文案（纯）。
 * 判据只看 error + lastSuccessAt：失败帧在缓存期内 status 可能是 cached，
 * 若再要求 status==="stale" 会让标注每 30s 抖动（#1163）。
 */
export function staleAgeText(stats: StatsResponseV2 | null): string {
  if (stats === null) return "";
  if (stats.error === null || stats.error === undefined) return "";
  const at = stats.lastSuccessAt;
  // 下界/未来值防御：损坏历史分片可能给 0/负数/未来时刻，不能渲染成「2 万天前」。
  if (typeof at !== "number" || !Number.isFinite(at) || at <= 0 || at > Date.now()) return "";
  const age = fmtAge(at);
```

</details>

#### 缺口

- 没有真实 provider 凭据或端点联调，轮询/缓存延迟未实测。
  **影响**：真实 API 行为和速率限制未知
  **进一步探讨**：使用测试账户检查成功、限流、超时和 stale 显示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 密钥、HTML 输出和估算误差有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

密钥在宿主侧解析和使用，README 声明不下发浏览器，并声明有 HTML 净化保护；但显式 apiKey 可能随宿主配置落盘，需控制文件权限。自定义 adapter 属可执行代码且可获得 fetch/API 配置，属于信任边界。无官方接口的余额差额估算存在充值和异常区间处理假设；stale 表示数据不是最新，不能当实时预算。

宿主调用适配器格式化时传入 esc，并将得到的 HTML 交给 sanitizeHtml；设置页对 capsuleHtml 的展示信任这一路服务端净化。用户适配器加载使用宿主进程的 import，随后才检查形状，契约校验无法撤回事先发生的顶层代码动作。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-provider-usage/README.md:27-34](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/README.md#L27-L34)

作者说明余额估算、宿主密钥和HTML净化、历史留存。

```text
- **官方没有用量接口也能算**：DeepSeek 内置适配器以区间记账法推算每日消耗
  （纯消费区间 = 余额降幅，可与平台账单对账；充值独立列示不混算；异常区间不计），
  余额折线充值时刻自动断轴平移，附峰谷倒计时徽标与 15 日用量柱形面板
- **密钥不出宿主**：取数在宿主端执行，密钥只在宿主端持有与使用、不下发浏览器
  （推荐凭据链 / env 注入；显式 `apiKey` 配置会随宿主配置落盘并以 0600 保护）；
  渲染输出双层净化（`esc()` 转义义务 + 结构化净化兜底），XSS 双重防线
- **历史可回溯、性能有兜底**：按天分片 JSONL 落盘（0600）、超龄超量自动清理；
  面板渲染进程内缓存 + stats 缓存 + 后台预热，数据未变时重复请求零重算
```

**依据 2 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:71-94](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L71-L94)

超时和失败进入 stale 分支。

<details>
<summary>查看原文（24行）</summary>

```text
  // fail-fast：管道内部组装断言——组装前提非法时不发起任何取数，
  // 直接产出既有 error 帧（stale + error），不让请求悬挂。这是管线自身的防御性
  // 检查，不是对用户适配器的契约行为约束（不改 FetchContext 契约、不新增配置项）。
  if (!hasUsableTimeout(ctx.timeoutMs)) return assemblyFailure(ctx, fetchedAt);

  // 2. safeFetchData（5s 固定超时 + 序列化 + 错误隔离）。
  const fetched = await safeFetchData(
    // 闭包接收合并信号（超时兜底 × ctx.signal 外部信号，手动级联合流）
    // 并放进 adapter.fetchData 入参——适配器把 ctx.signal 透传给底层 fetch 即获得真取消能力
    // （deepseek-official 直传 fetch、opencode-go 监听 signal 均立即受益）；
    // 0 参 fetchData 忽略入参不受影响。
    async (signal) => {
      const fetcher: typeof fetch = ctx.fetchImpl ?? fetch;
      return adapter.fetchData({
        ...buildFetchContext(ctx),
        signal,
        fetch: fetcher,
      } as unknown as FetchContext);
    },
    ctx.timeoutMs,
    ctx.signal,
  );

  if (fetched.error !== undefined) return staleFailure(ctx, fetchedAt, fetched.error);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-provider-usage/src/server/registry/registry.ts:99-110](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/registry/registry.ts#L99-L110)

重复 adapter name 冲突时保留旧项。

<details>
<summary>查看原文（12行）</summary>

```text
export function rejectDuplicateName(
  adapter: UsageStatsAdapter,
  oldEntries: ReadonlyMap<string, AdapterEntry>,
  registeredNames: ReadonlySet<string>,
): ReplaceFileResult | null {
  if (oldEntries.has(adapter.name) || !registeredNames.has(adapter.name)) return null;
  return {
    ok: false,
    code: "duplicate-name",
    detail: `适配器 name 冲突：${adapter.name}（已被其他适配器占用，旧条目保留）`,
  };
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:203-216](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L203-L216)

传入 esc 并在宿主净化产出。

<details>
<summary>查看原文（14行）</summary>

```text
/** 胶囊渲染入参（宿主注入的 esc 随包下发，内置/用户适配器同形可用）。 */
type CapsuleInput = Parameters<UsageStatsAdapter["formatCapsule"]>[0];

/** safeFormat formatCapsule（宿主端渲染 HTML）+ 净化；失败/非字符串产出 undefined。 */
async function renderCapsule(
  ctx: V2PipelineContext,
  input: Omit<CapsuleInput, "esc">,
): Promise<string | undefined> {
  const formatted = await safeFormat(
    () => ctx.adapter.formatCapsule({ ...input, esc }),
    "formatCapsule",
    ctx.timeoutMs,
  );
  return formatted.html !== undefined ? sanitizeHtml(formatted.html) : undefined;
```

</details>

**依据 5 · 源码核查**：[packages/dsh-provider-usage/src/client/settings/usage.tsx:203-213](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/client/settings/usage.tsx#L203-L213)

设置页直接消费已生成 capsuleHtml。

<details>
<summary>查看原文（11行）</summary>

```text
    </div>
  );
}

/** provider 状态行正文（职责：宿主 capsuleHtml / 错误文案 / 无数据 三态）。 */
function providerStatusBody(s: StatsView | null | undefined): React.ReactElement {
  if (s?.capsuleHtml) return <div dangerouslySetInnerHTML={{ __html: s.capsuleHtml }} />;
  if (s?.error) {
    return (
      <div style={{ color: "var(--dsw-alias-state-error-primary,#d64545)" }}>{String(s.error)}</div>
    );
```

</details>

**依据 6 · 源码核查**：[packages/dsh-provider-usage/src/server/registry/user-adapter-loader.ts:10-34](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/registry/user-adapter-loader.ts#L10-L34)

先使用动态 import 载入用户代码，再做契约检查。

<details>
<summary>查看原文（25行）</summary>

```text
export async function loadUserHostAdapterFile(file: string): Promise<unknown> {
  const url = pathToFileURL(file).href;
  const mod = (await import(url)) as Record<string, unknown>;
  return mod.default ?? mod;
}

/** 加载 + 契约校验（inspect / add / 启动加载共用）。 */
export async function loadUserAdapterChecked(
  file: string,
  registry?: AdapterRegistry,
): Promise<{ ok: true; adapter: UsageStatsAdapter } | { ok: false; code: string; detail: string }> {
  let mod: unknown;
  try {
    mod = await loadUserHostAdapterFile(file);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (registry) registry.recordError(`file:${basename(file)}`, "load", msg);
    return { ok: false, code: "adapter-load-failed", detail: msg };
  }
  const candidate = (mod ?? null) as unknown;
  const detail = describeUsageStatsAdapterShape(candidate);
  if (detail !== null) {
    if (registry)
      registry.recordError(`file:${basename(file)}`, "load", `契约校验失败（${detail}），已拒收`);
    return { ok: false, code: "invalid-adapter", detail: `契约校验失败（${detail}）` };
```

</details>

#### 缺口

- 本轮未审查所有内置 adapter 的 endpoint、密钥日志与实际 HTML 内容。
  **影响**：外发/泄漏和估算偏差仍未知
  **进一步探讨**：审查适配器源码及宿主配置权限，避免不可信自定义 adapter。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些条件下值得安装，如何核验准确性和退出？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合需要在 DSH 内监看多个 provider、并接受部分数据为估算值的用户。先仅启用一个可信内置 adapter，与 provider 官方页面核对余额/用量及 stale 状态，再决定是否导入自定义 adapter。持续成本是 API 访问、轮询、历史文件和维护 adapter；若估算与账单偏差影响决策或不能确认密钥处理，停用并回到 provider 官方界面。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-provider-usage/README.md:13-19](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/README.md#L13-L19)

安装、重启和生效步骤。

````text
## 一键安装

```sh
dsh plugin --profile web add @wingsky-1/dsh-provider-usage
```

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。
````

**依据 2 · 作者声明**：[packages/dsh-provider-usage/README.md:23-34](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/README.md#L23-L34)

内置路线、适配器和持久历史的作者说明。

<details>
<summary>查看原文（12行）</summary>

```text
- **通用框架 + 开箱即用**：一套 v2 适配器契约承载任意 provider；DeepSeek 官方与
  OpenCode Go 两套适配器内置，装完即显示用量
- **接入任意数据源只需一个 mjs 文件**：`fetchData` / `formatCapsule` / `formatPanel`
  三个导出即完成接入；设置页检测/添加/切换热插拔，改文件自动热更新
- **官方没有用量接口也能算**：DeepSeek 内置适配器以区间记账法推算每日消耗
  （纯消费区间 = 余额降幅，可与平台账单对账；充值独立列示不混算；异常区间不计），
  余额折线充值时刻自动断轴平移，附峰谷倒计时徽标与 15 日用量柱形面板
- **密钥不出宿主**：取数在宿主端执行，密钥只在宿主端持有与使用、不下发浏览器
  （推荐凭据链 / env 注入；显式 `apiKey` 配置会随宿主配置落盘并以 0600 保护）；
  渲染输出双层净化（`esc()` 转义义务 + 结构化净化兜底），XSS 双重防线
- **历史可回溯、性能有兜底**：按天分片 JSONL 落盘（0600）、超龄超量自动清理；
  面板渲染进程内缓存 + stats 缓存 + 后台预热，数据未变时重复请求零重算
```

</details>

**依据 3 · 源码核查**：[packages/dsh-provider-usage/src/server/pipeline/v2.ts:94-115](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-provider-usage/src/server/pipeline/v2.ts#L94-L115)

失败不会作为 fresh 数据写入历史。

<details>
<summary>查看原文（22行）</summary>

```text
  if (fetched.error !== undefined) return staleFailure(ctx, fetchedAt, fetched.error);

  // 3. 落盘历史（按天分片 JSONL；失败不阻断展示，只记日志）
  const data = fetched.data ?? {};
  const capsuleHtml = await renderCapsule(ctx, {
    time: fetchedAt,
    data,
    status: "fresh",
  });

  return {
    ok: true,
    configured: true,
    reason: null,
    error: null,
    fetchedAt,
    provider,
    adapterName: adapter.name,
    status: "fresh",
    capsuleHtml,
    rawData: data,
  };
```

</details>

#### 缺口

- 没有provider账单对照、长期历史维护或真实费用记录。
  **影响**：用少量周期对比官方账单并记录误差/调用限制，出现影响消费决策的偏差即关闭估算路线。
  **进一步探讨**：用少量周期对比官方账单并记录误差/调用限制，出现影响消费决策的偏差即关闭估算路线。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
