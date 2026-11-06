# Sessions Insight

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c1d34ca](https://github.com/Mt-Youya/dsh-plugins/tree/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Mt-Youya/dsh-plugins) [![npm 30d 742](https://img.shields.io/static/v1?label=npm+30d&message=742&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cyrusdoyle/dsh-sessions-insight) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cyrusdoyle/dsh-sessions-insight)
<!-- END META -->

> **功能**：在 DSH Web 中按项目查看 Claude Code、DSH 与 Codex 会话上下文，支持搜索、交接及会话管理。

> **亮点**：项目轴汇合三源并显式呈现估算/实值与缺口；handoff区分排队、一轮运行和结束，避免只凭prompt接受当成功，见 [Q01](#research-q01)至 [Q04](#research-q04)。

> **主要限制**：同源header不是鉴权，删除不可逆且多文件可部分成功；handoff内存baseline不耐重启、completed非业务验收，数值/价表不等真账，见 [Q03](#research-q03)至 [Q05](#research-q05)。

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
  - [Q01 · 本子包是什么，跨源会话浏览的自身贡献在哪？](#detail-section-11)
  - [Q02 · 扫描、解析、搜索和文件边界到哪里？](#detail-section-12)
  - [Q03 · exact、上下文和花费到底是什么？](#detail-section-13)
  - [Q04 · handoff是否真的创建会话，成功与取消怎样解释？](#detail-section-14)
  - [Q05 · 删除和管理是否只改本插件，权限与持久结果是什么？](#detail-section-15)
  - [Q06 · 哪些行为外发、使用负担与退出如何控制？](#detail-section-16)
  - [Q07 · 下一步能验证什么更有价值的方向？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨Claude/Codex/DSH工作的本地开发者按项目找历史上下文/工具/压缩片段，先用脱敏副本验证，见 [Q01](#research-q01)。

各客户端原生历史页与手读日志；本子包集中项目轴/数值依据/交接，不把同仓reader/kit都算自身原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 三源浏览 | 项目→session→turn | 部分解析/估算要看dataQuality |
| 搜索 | metadata或正文 | deep分页/预算非完整保证 |
| 金额解释 | 固定价表算usage | 非实账/未知保null或partial |
| handoff | 简报到Host新会话 | 实际执行/成本，completed非业务验收 |
| 管理 | metadata与删除 | sidecar可退，日志unlink不可逆 |
| AI/utility | 改名建议/余额/版本 | 外发可选，首试不用 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失与边界 |
| --- | --- | --- |
| DSH>=0.2.1-rc.5 / Node>=24.22.1 | 包声明Host/Web | 未实际安装验收 |
| React19.3.1/Host UI服务 | Web面板/设置 | 不因README证明兼容 |
| 三源根/DSH_HOME/投影 | 读取与观察 | 部分源缺失单独提示 |
| 同提交session-readers/kit | 解析/HTTP/UI基础 | 必要原件绑定、未全算法审计 |
| 本地可信监听/外部认证 | 私密日志访问 | header同源非鉴权 |
| 模型/凭据/Host命令 | AI或handoff可选 | 会外发/执行，首试排除 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 独立本地profile/DSH_HOME与脱敏源 | 核Node/Host版本 |
| 浏览 | 各一会话/项目 | 对原客户端缺口/精度 |
| 搜索 | fast与deep对照 | 看remaining/truncated |
| 限范围 | 不删除/管理/AI/handoff/utility | 不把浏览许可扩到执行 |
| 退出 | 卸载面板并核routes/索引 | 已投递任务另处理 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 兼容Host/Node/副本 | profile/源根/隐私配置 | 未测安装时间 |
| 持续 | 扫描/解码/缓存/索引 | 数值/来源核对 | 大日志负担未测 |
| 可选AI/交接 | 模型与工具资源 | 审简报/确认/任务验收 | 不用本地浏览推零费 |
| 失败/退出 | 部分删除/已有目标会话 | 备份与状态核对 | 卸载非任务回滚 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 跨源找回 | 三入口/项目UI/快慢搜索 | 完整解析/节时 |
| 数值解释 | basis/partial/null | 精确token/实付账单 |
| handoff | create/prompt/日志终态 | 业务完成/持久去重 |
| 会话管理 | sidecar/unlink真实写 | 多文件恢复/可信人批 |

> **思考**：同源header不是鉴权，删除不可逆且多文件可部分成功；handoff内存baseline不耐重启、completed非业务验收，数值/价表不等真账，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：项目轴汇合三源并显式呈现估算/实值与缺口；handoff区分排队、一轮运行和结束，避免只凭prompt接受当成功，见 [Q01](#research-q01)至 [Q04](#research-q04)。

有源隔离、缓存层次、数值依据、交接后观察及删除警告等真实机制；共享helper贡献独立归因，认证/持久幂等/完整解析不在已验范围，见 [Q02](#research-q02)至 [Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

同源header不是鉴权，删除不可逆且多文件可部分成功；handoff内存baseline不耐重启、completed非业务验收，数值/价表不等真账，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用限定独立可信本地Host及脱敏三源副本，只浏览/搜索并核原客户端。不要触删除/改名AI/交接或余额；权限/数值不明就停止回原历史页，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包Host/Web、三源详情入口、必要共享reader/HTTP原件、搜索/金额与handoff/删除/metadata/AI/utility主要路径已查；未运行或全审所有reader/Host认证。只建议独立本地profile脱敏副本浏览。

- 已检查：作者 README、包清单、源码路径 packages/plugin-kit-host/src/http.ts、packages/session-contract/src/guards/deletion.ts、packages/session-readers/src/dsh/session.ts、packages/session-readers/src/dsh/usage.ts、plugins/sessions-insight/package.json、plugins/sessions-insight/src/client/index.tsx、plugins/sessions-insight/src/client/ui/shared/precision.tsx、plugins/sessions-insight/src/host/handoff/handoff.ts、plugins/sessions-insight/src/host/http/delete-route.ts、plugins/sessions-insight/src/host/http/handoff-routes.ts、plugins/sessions-insight/src/host/http/management-route.ts、plugins/sessions-insight/src/host/http/route-utils.ts、plugins/sessions-insight/src/host/http/routes.ts、plugins/sessions-insight/src/host/http/server.ts、plugins/sessions-insight/src/host/http/utility-routes.ts、plugins/sessions-insight/src/host/management/ai-title.ts、plugins/sessions-insight/src/host/management/store.ts、plugins/sessions-insight/src/host/sources/claude.ts、plugins/sessions-insight/src/host/sources/codex.ts、plugins/sessions-insight/src/host/sources/delete.ts、plugins/sessions-insight/src/host/sources/dsh.ts、plugins/sessions-insight/src/host/sources/paths.ts、plugins/sessions-insight/src/host/utilities/https.ts、plugins/sessions-insight/src/host/views/brief.ts、plugins/sessions-insight/src/host/views/cost.ts、plugins/sessions-insight/src/host/views/search.ts、plugins/sessions-insight/src/index.ts、plugins/sessions-insight/src/protocol/settings.ts、plugins/sessions-insight/tsdown.config.ts、tooling/aliases.ts 及固定范围 inventory；组件：plugins/sessions-insight。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：子包/构建alias、Host/Web挂载、三source详情/DSH索引、必要同提交dsh reader入口/usage和kit HTTP、搜索/费用、handoff/brief、删除/metadata、AI/utility关键路径。未执行，未全审三reader归一化/解压/所有UI、Host鉴权/命令或余额凭据。
- 下一步：- 下一步：固定符合包要求Host，用脱敏三源片段对照浏览/数值/搜索。
- handoff仅隔离无副作用工具核丢回包/重启，业务验收另立。
- 未进行目标安装、真实日志/账号/模型调用。

**分析版本**

- **仓库**：[Mt-Youya/dsh-plugins](https://github.com/Mt-Youya/dsh-plugins)
- **版本号**：0.1.0（[固定提交 c1d34ca](https://github.com/Mt-Youya/dsh-plugins/tree/c1d34caff294293a09766fc42459a80987b17f28)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为持久handoff操作收据与分层验收，先核Host现有去重能力，再以三故障样本测误重试/误成功；已有能力足够则不开发，见 [Q07](#research-q07)。

- 下一步：固定符合包要求Host，用脱敏三源片段对照浏览/数值/搜索。
- handoff仅隔离无副作用工具核丢回包/重启，业务验收另立。
- 未进行目标安装、真实日志/账号/模型调用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 58 | 35 | 38 | — |
| .md | source | 2 | 500 | — | — | 6996 |
| .ts | source | 72 | 10048 | 7867 | 1606 | — |
| .tsx | source | 27 | 5959 | 5032 | 702 | — |
| .ts | test | 46 | 8451 | 7806 | 132 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Mt-Youya/dsh-plugins/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按子包核三源浏览/数值口径、真实交接和管理副作用，判断隔离只浏览采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本子包是什么，跨源会话浏览的自身贡献在哪？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

0.1.0是原生DSH Host/Web插件，注册Host路由并把独立Web面板挂进shell；不是同仓插件集合整体，也不只是离线报表。面向在Claude Code、Codex与DSH之间工作、要按项目回看上下文/工具/压缩和历史线索的本地开发者，参照各客户端逐个打开日志：子包统一workdir→session→turn浏览、搜索、精度说明与交接入口。解析/公共HTTP/UI基础设施由同仓shared packages继承，本项绑定实际使用的固定源文件，只归因面板/源装配与工作路径，不称所有reader算法本项原创或全审。合格结果是找到历史片段并读清数值依据；图表不是任务质量或账单准确证明。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sessions-insight/package.json:1-4](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/package.json#L1-L4)

子包名/版本/作者描述。

```text
{
  "name": "@cyrusdoyle/dsh-sessions-insight",
  "version": "0.1.0",
  "description": "Sessions insight and confirmed session deletion for the DSH Web GUI: what each turn actually fed the model, across Claude Code, DSH and Codex sessions.",
```

**依据 2 · 源码核查**：[plugins/sessions-insight/package.json:38-48](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/package.json#L38-L48)

独立Host和client导出。

<details>
<summary>查看原文（11行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json",
    "./locale/*": "./locale/*"
```

</details>

**依据 3 · 源码核查**：[plugins/sessions-insight/src/index.ts:304-327](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/index.ts#L304-L327)

真实源依赖与路由生命周期。

<details>
<summary>查看原文（24行）</summary>

```text
  const deps: RouteDeps & { aiTitles: AiTitleGenerator } = {
    sources,
    version: PLUGIN_VERSION,
    handoff,
    metadata: new SessionMetadataStore(),
    aiTitles,
    utilities,
  }
  const preload = { aborted: false }
  let timer: ReturnType<typeof setTimeout> | undefined
  const routes: WebRoute[] = [
    { kind: "exact", path: HEALTH_PATH, handler: handleHealth },
    createSettingsRoute(() => readSettings(config)),
    ...createRoutes(deps),
  ]
  const release = (disposers: readonly (() => void)[]): void => {
    if (timer !== undefined) globalThis.clearTimeout(timer)
    preload.aborted = true
    aiTitles.dispose()
    offCredentialUpdates()
    balance.invalidate()
    clearListCache(deps)
    for (const dispose of disposers) dispose()
    for (const source of sources) source.invalidate()
```

</details>

**依据 4 · 源码核查**：[plugins/sessions-insight/src/client/index.tsx:103-138](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/client/index.tsx#L103-L138)

真实Web设置/预载与面板注册。

<details>
<summary>查看原文（36行）</summary>

```text
  // its own, and nothing may touch the document before the factory runs.
  injectStyles()

  registerLocale(ctx, LOCALE_NS, { zh, en }, setRuntimeTranslate)

  const settingsStore = new SettingsStore()
  const utilityStore = new UtilityStore(createApi())
  const utilitySections = makeUtilitySections(utilityStore, settingsStore)
  try {
    // The bundle page reads through its own endpoint handle, so a retry there
    // does not depend on the panel having mounted first.
    registerSettings(ctx, settingsStore, utilitySections, createApi())
  } catch (error) {
    console.warn("[sessions-insight] settings registration failed", error)
  }
  ctx.effect?.(() => () => utilityStore.dispose(), "sessions-insight: utilities")

  const preload = new AbortController()
  const timer = setTimeout(() => {
    void preloadSessionLists(createApi(), preload.signal).catch(() => undefined)
  }, 0)
  ctx.effect?.(
    () => () => {
      clearTimeout(timer)
      preload.abort()
    },
    "sessions-insight: preload lists",
  )

  try {
    registerPanel(ctx, {
      id: PANEL_ID,
      order: PANEL_ORDER,
      locale: LOCALE_NS,
      // A thunk, not a string: the shell re-resolves the label on every locale
      // change, so the row follows the Language setting without a reload.
```

</details>

**依据 5 · 源码核查**：[plugins/sessions-insight/tsdown.config.ts:12-25](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/tsdown.config.ts#L12-L25)

构建使用workspace alias。

<details>
<summary>查看原文（14行）</summary>

```text
import { fileURLToPath } from "node:url"

import { workspaceAlias } from "../../tooling/aliases.ts"
import { createPluginConfig } from "../../tooling/tsdown/plugin-config.ts"

/** Package directory, with the trailing slash the config expects. */
const root = fileURLToPath(new URL(".", import.meta.url))

export default createPluginConfig({
  srcDir: `${root}src/`,
  outDir: `${root}lib/`,
  manifestPath: `${root}package.json`,
  alias: workspaceAlias(),
})
```

</details>

**依据 6 · 源码核查**：[tooling/aliases.ts:22-29](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/tooling/aliases.ts#L22-L29)

同提交源依赖映射。

```text
/** Package name → repo-relative path of its TypeScript entry. */
export const WORKSPACE_PACKAGES = {
  "@cyrusdoyle/dsh-plugin-kit": "packages/plugin-kit/src/index.ts",
  "@cyrusdoyle/dsh-session-contract": "packages/session-contract/src/index.ts",
  "@cyrusdoyle/dsh-session-readers": "packages/session-readers/src/index.ts",
  "@cyrusdoyle/dsh-plugin-kit-host": "packages/plugin-kit-host/src/index.ts",
  "@cyrusdoyle/dsh-plugin-kit-client": "packages/plugin-kit-client/src/index.ts",
} as const
```

#### 缺口

- 未运行三客户端/真实Host或用户找回任务对照。
  **影响**：不能证明跨版本/跨源数据完整或净节时。
  **进一步探讨**：以脱敏同项目三源小日志对照原客户端，核找回片段与缺口提示。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 扫描、解析、搜索和文件边界到哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

三source独立实例，列表/详情分开：DSH列表未解析用LIST_ITEM_UNPARSED，打开才readDshSession并缓存/提升索引；Codex/Claude详情也调用同仓reader并有文件上限/失败返回。单源ask捕获异常，/sources给该源失败状态而非拖垮其余源。缓存按文件变化线索失效，不是数据永不陈旧保证；DSH浏览还写本地轻索引，因此“只浏览”不等目录无任何写入，但不改原始会话。

路径helper对根和候选realpath再验证包含，Claude实际detail接该检查；并非借函数存在保证所有reader都无竞争。完整压缩解码/三源规范化不在本次全量审计范围，DSH必要reader已绑定入口：破帧/格式/投影过期、估算和残差会入dataQuality，不应把异常忽略为0。fast搜索只扫标题/首输入/workdir；deep才顺序打开会话，deadline在每会话前检查，单个detail可能越预算；响应remaining/truncated/nextCursor要保留，“0命中”不证明全库不存在。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sessions-insight/src/index.ts:163-170](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/index.ts#L163-L170)

三source构造。

```text
 * @returns one reader per source, in CONTEXT_SOURCES order.
 */
export function createSources(env: NodeJS.ProcessEnv = process.env): SessionSource[] {
  return [
    new ClaudeSource({ root: claudeRootFrom(env) }),
    new CodexSource({ root: codexRootFrom(env) }),
    new DshSource({ root: dshRootFrom(env) }),
  ]
```

**依据 2 · 源码核查**：[plugins/sessions-insight/src/host/http/route-utils.ts:25-30](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/route-utils.ts#L25-L30)

单源异常转问题。

```text
export async function ask<T>(source: SessionSource, run: () => Promise<T>): Promise<Sourced<T>> {
  try {
    return { ok: true, value: await run() }
  } catch (error) {
    return { ok: false, problem: problemOf(source, error) }
  }
```

**依据 3 · 源码核查**：[plugins/sessions-insight/src/host/http/routes.ts:101-125](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/routes.ts#L101-L125)

源状态分别汇总。

<details>
<summary>查看原文（25行）</summary>

```text
  return route(async (req, res) => {
    if (!guardRequest(req, res, ["GET", "HEAD"])) return
    const bySource = new Map<ContextSource, SourceStatus>()
    const answers = await Promise.all(
      deps.sources.map(async (source) => ({ source, result: await ask(source, () => source.status()) })),
    )
    for (const { source, result } of answers) {
      if (result.ok) {
        bySource.set(source.id, result.value)
        continue
      }
      const status: SourceStatus = {
        source: source.id,
        available: false,
        reason: "adapter-error",
        errorDetail: result.problem.detail ?? "",
      }
      bySource.set(source.id, status)
    }
    for (const source of CONTEXT_SOURCES) {
      if (bySource.has(source)) continue
      bySource.set(source, { source, available: false, reason: "root-missing" })
    }
    const value: SourcesValue = { sources: CONTEXT_SOURCES.map((source) => bySource.get(source) as SourceStatus) }
    writeOk(res, value)
```

</details>

**依据 4 · 源码核查**：[plugins/sessions-insight/src/host/sources/dsh.ts:415-447](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/dsh.ts#L415-L447)

列表未解析标记与候选。

<details>
<summary>查看原文（33行）</summary>

```text
    for (const entry of scan.entries) {
      if (entry.workdir !== workdir) continue
      if (!options.includeSubagents && entry.delegationDepth > 0) continue
      const cached = this.#parsed.get(this.#key(entry))
      const summary: SessionSummary = {
        source: "dsh",
        id: entry.id,
        workdir: entry.workdir,
        updatedAt: entry.updatedAt,
        bytes: entry.bytes,
        dataQuality: cached === undefined ? [LIST_ITEM_UNPARSED] : cached.session.dataQuality,
        delegationDepth: entry.delegationDepth,
      }
      // Header meta first; a session that has been opened keeps its parsed title
      // and first input as the authority.
      const title = cleanTitle(cached?.session.title ?? entry.title, entry.id)
      if (title !== undefined) summary.title = title
      const firstInput = cached === undefined ? entry.firstInput : (firstInputOf(cached.session) ?? entry.firstInput)
      if (firstInput !== undefined) summary.firstInput = firstInput
      rows.push(summary)
    }
    return rows
  }

  async candidates(): Promise<SearchCandidate[]> {
    const scan = await this.scan()
    return scan.entries.map((entry) => {
      const cached = this.#parsed.get(this.#key(entry))
      const candidate: SearchCandidate = { id: entry.id, workdir: entry.workdir, updatedAt: entry.updatedAt }
      const title = cleanTitle(cached?.session.title ?? entry.title, entry.id)
      if (title !== undefined) candidate.title = title
      const firstInput = cached === undefined ? entry.firstInput : (firstInputOf(cached.session) ?? entry.firstInput)
      if (firstInput !== undefined) candidate.firstInput = firstInput
```

</details>

**依据 5 · 源码核查**：[plugins/sessions-insight/src/host/sources/dsh.ts:452-474](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/dsh.ts#L452-L474)

打开详情真实reader/缓存/失败。

<details>
<summary>查看原文（23行）</summary>

```text
  async detail(id: string): Promise<ParsedSession | SourceFailure> {
    if (!isSafeId(id)) return { ok: false, error: "bad-request", detail: "invalid-session-id" }
    const scan = await this.scan()
    if (scan.state !== "ok") {
      return { ok: false, error: "source-unavailable", detail: `root-${scan.state}` }
    }
    const entry = scan.entries.find((candidate) => candidate.id === id)
    if (entry === undefined) return { ok: false, error: "not-found", detail: "session-not-found" }
    const key = this.#key(entry)
    const hit = this.#parsed.get(key)
    if (hit !== undefined) {
      return { ok: true, session: hit.session, bytes: hit.bytes, elapsedMs: 0, cached: true }
    }
    const started = Date.now()
    try {
      const result = await readDshSession(entry.path, { projectionRoot: this.#projectionRoot })
      const record: CachedSession = { session: result.session, bytes: entry.bytes, elapsedMs: Date.now() - started }
      await this.#promote(entry, record.session)
      this.#parsed.set(key, record)
      return { ok: true, session: record.session, bytes: record.bytes, elapsedMs: record.elapsedMs, cached: false }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown"
      return { ok: false, error: "parse-failed", detail: message.slice(0, 200) }
```

</details>

**依据 6 · 源码核查**：[plugins/sessions-insight/src/host/sources/dsh.ts:317-346](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/dsh.ts#L317-L346)

索引写与详情提升。

<details>
<summary>查看原文（30行）</summary>

```text
    entries.sort((a, b) => b.updatedAt - a.updatedAt)
    this.#index = new Map(next.map((entry) => [entry.path, entry]))
    if (changed || previous.size !== next.length) {
      await this.#saveIndex()
    }
    return { root: this.#root, state: "ok", entries, scannedAt }
  }

  #saveIndex(): Promise<void> {
    const entries = [...(this.#index?.values() ?? [])].map((entry) => ({ ...entry }))
    this.#saving = this.#saving.then(() => saveDshIndex(this.#indexPath, entries))
    return this.#saving
  }

  async #promote(entry: DshEntry, session: Session): Promise<void> {
    const info = await stat(entry.path)
    const indexed = this.#index?.get(entry.path)
    if (Math.round(info.mtimeMs) !== entry.updatedAt || info.size !== entry.bytes) return
    if (indexed?.mtimeMs !== entry.updatedAt || indexed.size !== entry.bytes) return
    const title = cleanTitle(session.title, entry.id)
    const firstInput = firstInputOf(session)
    if (title === undefined && firstInput === undefined) return
    if (title !== undefined) entry.title = indexed.title = title
    if (firstInput !== undefined) entry.firstInput = indexed.firstInput = firstInput
    const current = this.#scan?.entries.find((row) => row.path === entry.path)
    if (current !== undefined && this.#key(current) === this.#key(entry)) {
      if (title !== undefined) current.title = title
      if (firstInput !== undefined) current.firstInput = firstInput
    }
    await this.#saveIndex()
```

</details>

**依据 7 · 源码核查**：[plugins/sessions-insight/src/host/sources/codex.ts:363-394](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/codex.ts#L363-L394)

Codex详情入口/限额。

<details>
<summary>查看原文（32行）</summary>

```text
  async detail(id: string): Promise<ParsedSession | SourceFailure> {
    if (!isSafeId(id)) return { ok: false, error: "bad-request", detail: "invalid-session-id" }
    const scan = await this.scan()
    if (scan.state !== "ok") {
      return { ok: false, error: "source-unavailable", detail: `root-${scan.state}` }
    }
    const entry = scan.entries.find((candidate) => candidate.id === id)
    if (entry === undefined) return { ok: false, error: "not-found", detail: "session-not-found" }
    if (entry.bytes > this.#maxSessionBytes) {
      return { ok: false, error: "read-limit", detail: `bytes=${String(entry.bytes)}` }
    }
    const key = this.#key(entry)
    const hit = this.#parsed.get(key)
    if (hit !== undefined) {
      return { ok: true, session: this.#namedSession(hit.session, scan), bytes: hit.bytes, elapsedMs: 0, cached: true }
    }
    const started = Date.now()
    try {
      const result = await readCodexSession(entry.firstPath, { root: this.#root, index: scan.index })
      const record: CachedSession = { session: result.session, bytes: entry.bytes, elapsedMs: Date.now() - started }
      this.#parsed.set(key, record)
      return {
        ok: true,
        session: this.#namedSession(record.session, scan),
        bytes: record.bytes,
        elapsedMs: record.elapsedMs,
        cached: false,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown"
      return { ok: false, error: "parse-failed", detail: message.slice(0, 200) }
    }
```

</details>

**依据 8 · 源码核查**：[plugins/sessions-insight/src/host/sources/claude.ts:385-422](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/claude.ts#L385-L422)

Claude实际真实路径检查/reader。

<details>
<summary>查看原文（38行）</summary>

```text
  async detail(id: string): Promise<ParsedSession | SourceFailure> {
    if (!isSafeId(id)) return { ok: false, error: "bad-request", detail: "invalid-session-id" }
    const scan = await this.scan()
    if (scan.state !== "ok") {
      return { ok: false, error: "source-unavailable", detail: `root-${scan.state}` }
    }
    const file = scan.sessions.find((candidate) => candidate.id === id)
    if (file === undefined) return { ok: false, error: "not-found", detail: "session-not-found" }

    let info
    try {
      info = await stat(file.path)
    } catch {
      return { ok: false, error: "not-found", detail: "session-file-missing" }
    }
    // The id whitelist already refuses separators; this is the second line, and
    // the one that catches a symlinked transcript pointing outside the corpus.
    const real = await resolveInside(this.#config.root, file.path)
    if (real === undefined) return { ok: false, error: "forbidden", detail: "path-escape" }
    if (info.size > this.#config.maxSessionBytes) {
      return { ok: false, error: "read-limit", detail: `bytes=${String(info.size)}` }
    }

    const key = this.#key(id, info.size, Math.round(info.mtimeMs))
    const hit = this.#parsed.get(key)
    if (hit !== undefined) {
      return { ok: true, session: hit.session, bytes: hit.bytes, elapsedMs: 0, cached: true }
    }

    const started = Date.now()
    try {
      const result = await readClaudeSession(real)
      const record: CachedSession = { session: result.session, bytes: info.size, elapsedMs: Date.now() - started }
      this.#parsed.set(key, record)
      return { ok: true, session: record.session, bytes: record.bytes, elapsedMs: record.elapsedMs, cached: false }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown"
      return { ok: false, error: "parse-failed", detail: message.slice(0, 200) }
```

</details>

**依据 9 · 源码核查**：[plugins/sessions-insight/src/host/sources/paths.ts:99-124](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/paths.ts#L99-L124)

realpath包含规则。

<details>
<summary>查看原文（26行）</summary>

```text
export function isWithin(rootReal: string, candidateReal: string): boolean {
  if (candidateReal === rootReal) return true
  const rel = relative(rootReal, candidateReal)
  if (rel === "") return true
  if (isAbsolute(rel)) return false
  return rel !== ".." && !rel.startsWith(`..`)
}

/**
 * Resolve a candidate and prove it stays inside the root.
 * Both sides are realpath'd first, so a symlink pointing outside the corpus is
 * rejected even when its own path is inside.
 * @param root - the whitelisted root as configured.
 * @param candidate - the path to admit (may not exist).
 * @returns the realpath when admitted, undefined when missing or escaping.
 */
export async function resolveInside(root: string, candidate: string): Promise<string | undefined> {
  let rootReal: string
  let candidateReal: string
  try {
    rootReal = await realpath(root)
    candidateReal = await realpath(candidate)
  } catch {
    return undefined
  }
  return isWithin(rootReal, candidateReal) ? candidateReal : undefined
```

</details>

**依据 10 · 源码核查**：[packages/session-readers/src/dsh/session.ts:175-229](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/packages/session-readers/src/dsh/session.ts#L175-L229)

reader标记破帧/投影/估算/残差。

<details>
<summary>查看原文（55行）</summary>

```text
export async function readDshSession(path: string, options: DshReadOptions = {}): Promise<DshReadResult> {
  const started = Date.now()
  const dataQuality = new Set<string>()

  const { decoded, lines, events, invalid } = loadEvents(path)
  if (decoded.tornTail) dataQuality.add("torn-final-frame-dropped")
  if (decoded.badFrames > 0) dataQuality.add(`bad-frames:${decoded.badFrames}`)
  if (decoded.leadingBytes > 0) dataQuality.add(`bytes-before-first-frame:${decoded.leadingBytes}`)
  if (invalid > 0) dataQuality.add(`invalid-lines:${invalid}`)

  const header = readSessionHeader(events[0])
  const headerVersion = header.version
  if (headerVersion !== undefined && headerVersion !== 4) dataQuality.add(`format-version:${headerVersion}`)

  const lastLogSeq = lastSeqOf(events)
  const resolved = resolveProjection(path, header.id, lastLogSeq, options)
  const projectionStatus = resolved.status
  let projection = resolved.projection
  const usable = projection !== undefined && projectionStatus === "fresh"
  if (!usable) {
    if (projectionStatus === "stale") dataQuality.add("projection-stale")
    else dataQuality.add(`projection-${projectionStatus}`)
    projection = undefined
  }

  const fold = new SessionFold({ projection, usable, dataQuality, header })
  fold.fold(events)

  if (!fold.sawTurnEvents) dataQuality.add("turn-events-absent")

  // A turn whose slices could not be measured at all is flagged once here
  // rather than guessed at inside the attribution.
  const estimateTurns = fold.window.estimateTurnCount
  if (estimateTurns > 0 && fold.turns.length > 0) {
    dataQuality.add(`attribution-estimated-turns:${estimateTurns}`)
  }
  if (fold.window.negativeDeltaTurns > 0) {
    dataQuality.add(`projection-delta-negative:${fold.window.negativeDeltaTurns}`)
  }
  if (fold.turns.some((turn) => turn.attribution.residual !== undefined)) dataQuality.add("attribution-residual")
  // A negative residual means the slices claimed more than the window held; the
  // rule that forbids it without a structural gap is asserted in the tests.
  if (fold.turns.some((turn) => (turn.attribution.residual?.tokens ?? 0) < 0)) {
    dataQuality.add("attribution-over-counted")
  }

  const session: Session = {
    id: fold.sessionId ?? basename(dirname(path)),
    source: "dsh",
    workdir: fold.workdir ?? "",
    createdAt: Number.isFinite(fold.createdAt) ? fold.createdAt : (fold.turns[0]?.startedAt ?? 0),
    updatedAt: fold.updatedAt === 0 ? (fold.turns.at(-1)?.endedAt ?? 0) : fold.updatedAt,
    turns: fold.turns,
    segments: [path],
    dataQuality: [...dataQuality],
```

</details>

**依据 11 · 源码核查**：[plugins/sessions-insight/src/host/views/search.ts:93-134](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/search.ts#L93-L134)

fast仅元数据。

<details>
<summary>查看原文（42行）</summary>

```text
async function fastSearch(deps: SearchDeps, query: SearchQuery): Promise<SearchValue> {
  const started = Date.now()
  const needle = query.q.toLowerCase()
  const { queue, failures } = await collect(deps, query)
  const hits: SearchHit[] = []
  for (const item of queue) {
    if (hits.length >= query.limit) break
    const candidate = item.candidate
    const fields: string[] = []
    const title = candidate.manualTitle ?? cleanTitle(candidate.title, candidate.id)
    if (title !== undefined) fields.push(title)
    if (candidate.manualTitle !== undefined && candidate.title !== undefined) fields.push(candidate.title)
    if (candidate.firstInput !== undefined) fields.push(candidate.firstInput)
    if (candidate.workdir !== "") fields.push(candidate.workdir)
    const matched = fields.find((field) => field.toLowerCase().includes(needle))
    if (matched === undefined) continue
    const snippet = snippetAround(matched, needle) ?? matched
    const hit: SearchHit = {
      source: item.source.id,
      sessionId: candidate.id,
      workdir: candidate.workdir,
      // Metadata hits have no turn; 0 means "open the session, no specific turn".
      turnIndex: 0,
      at: candidate.updatedAt,
      field: "metadata",
      snippet,
      tier: "fast",
    }
    if (title !== undefined) hit.title = title
    if (candidate.firstInput !== undefined) hit.firstInput = candidate.firstInput
    hits.push(hit)
  }
  return {
    query: query.q,
    hits,
    scanned: queue.length,
    remaining: 0,
    elapsedMs: Date.now() - started,
    truncated: false,
    failures,
    tier: "fast",
  }
```

</details>

**依据 12 · 源码核查**：[plugins/sessions-insight/src/host/views/search.ts:205-269](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/search.ts#L205-L269)

deep逐项预算与剩余状态。

<details>
<summary>查看原文（65行）</summary>

```text
async function deepSearch(deps: SearchDeps, query: SearchQuery): Promise<SearchValue> {
  const started = Date.now()
  const deadline = started + (deps.deadlineMs ?? SEARCH_DEADLINE_MS)
  const needle = query.q.toLowerCase()
  const { queue, failures, failed } = await collect(deps, query)
  const hits: SearchHit[] = []
  const from = Math.min(Math.max(query.cursor, 0), queue.length)
  let cursor = from
  let truncated = false
  while (cursor < queue.length) {
    if (hits.length >= query.limit) {
      truncated = true
      break
    }
    if (Date.now() >= deadline) {
      truncated = true
      break
    }
    const item = queue[cursor]
    cursor += 1
    if (item === undefined) break
    const alias = item.candidate.manualTitle
    const aliasSnippet = alias === undefined ? undefined : snippetAround(alias, needle)
    if (aliasSnippet !== undefined) {
      hits.push({
        source: item.source.id,
        sessionId: item.candidate.id,
        workdir: item.candidate.workdir,
        turnIndex: 0,
        at: item.candidate.updatedAt,
        field: "metadata",
        snippet: aliasSnippet,
        tier: "deep",
        title: alias,
      })
      continue
    }
    let parsed
    try {
      parsed = await item.source.detail(item.candidate.id)
    } catch (error) {
      if (!failed.has(item.source.id)) {
        failed.add(item.source.id)
        failures.push(problemOf(item.source, error))
      }
      continue
    }
    if (!parsed.ok) continue
    const hit = firstHit(parsed.session, item.source, item.candidate, needle)
    if (hit !== undefined) hits.push(hit)
  }
  const remaining = Math.max(0, queue.length - cursor)
  if (remaining > 0) truncated = true
  const value: SearchValue = {
    query: query.q,
    hits,
    scanned: cursor - from,
    remaining,
    elapsedMs: Date.now() - started,
    truncated,
    failures,
    tier: "deep",
  }
  if (remaining > 0) value.nextCursor = cursor
  return value
```

</details>

#### 缺口

- 未完整审所有reader/解压/扫描和竞争，未测大日志/丢段。
  **影响**：浏览不能等同全量可靠复原；深搜预算非单请求硬截止。
  **进一步探讨**：三源副本逐项比原客户端，再用大/破帧/迁移日志核dataQuality和搜索分页/预算，不把未扫描当无记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · exact、上下文和花费到底是什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

DSH usage normalizer把每请求input/cacheRead/cacheWrite/output累加为turn用量，而context取最大prompt，非多请求usage总和；缺字段局部补0、全0视无reading，并计总量矛盾。它依赖源日志字段语义，exact表示来源口径而非独立数token证明。fresh projection才参与reader，估算/残差明确标记。UI precision显示exact/estimate、basis和字符/像素系数；系数是预设估算，不应当当前模型精确tokenizer。

cost按记录usage×固定价表逐通道算；缺usage/模型价amount=null，某通道无价记0但列unlisted/partial下限，不能把0认作免费。主价与参考表分开，按table/currency分组，未知模型不猜、无汇率换算。源码价格只证明本版本计算配置，不作2026-11实时供应商价格或用户实付结算，订阅/折扣/路由可能不匹配。报告只支持解释上下文和估算费用来源，不支持成本优化ROI。

#### 证据与依据

**依据 1 · 源码核查**：[packages/session-readers/src/dsh/usage.ts:36-45](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/packages/session-readers/src/dsh/usage.ts#L36-L45)

实际日志字段读取和缺值。

<details>
<summary>查看原文（10行）</summary>

```text
export function readDshUsage(usage: JsonObject | undefined): DshUsageReading | undefined {
  if (usage === undefined) return undefined
  const input = numberField(usage, "inputTokens") ?? 0
  const cacheRead = numberField(usage, "cacheReadTokens") ?? 0
  const cacheWrite = numberField(usage, "cacheWriteTokens") ?? 0
  const output = numberField(usage, "outputTokens") ?? 0
  const recorded = numberField(usage, "totalTokens")
  if (input === 0 && cacheRead === 0 && cacheWrite === 0 && output === 0) return undefined
  const prompt = input + cacheRead + cacheWrite
  return { input, cacheRead, cacheWrite, output, prompt, total: recorded ?? prompt + output }
```

</details>

**依据 2 · 源码核查**：[packages/session-readers/src/dsh/usage.ts:69-109](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/packages/session-readers/src/dsh/usage.ts#L69-L109)

累计用量与最大context区分。

<details>
<summary>查看原文（41行）</summary>

```text
  /** Fold one request into the turn. */
  observe(reading: DshUsageReading): void {
    this.input += reading.input
    this.cacheRead += reading.cacheRead
    this.cacheWrite += reading.cacheWrite
    this.output += reading.output
    this.requests += 1
    if (reading.prompt > this.peak) this.peak = reading.prompt
    // The recorded total is prompt + output; a disagreement means the log's own
    // arithmetic changed and every downstream figure needs re-checking.
    if (reading.total !== reading.prompt + reading.output) this.mismatched += 1
  }

  /** Requests folded so far. */
  get requestCount(): number {
    return this.requests
  }

  /** Largest prompt this turn sent; the turn's context size. */
  get peakContext(): number {
    return this.peak
  }

  /** Requests whose `totalTokens` did not equal prompt + output. */
  get inconsistentTotal(): number {
    return this.mismatched
  }

  /** True when at least one request was folded. */
  get seen(): boolean {
    return this.requests > 0
  }

  /** The turn's summed counters with the peak as its context size. */
  toUsage(): { input: number; cacheRead: number; cacheWrite: number; output: number; totalContext: number } {
    return {
      input: this.input,
      cacheRead: this.cacheRead,
      cacheWrite: this.cacheWrite,
      output: this.output,
      totalContext: this.peak,
```

</details>

**依据 3 · 源码核查**：[plugins/sessions-insight/src/client/ui/shared/precision.tsx:24-62](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/client/ui/shared/precision.tsx#L24-L62)

精度依据/系数与tooltip。

<details>
<summary>查看原文（39行）</summary>

```text
/** Calipers of the current adapters; see `src/core/attribution.ts`. */
export const CALIBRATION = {
  /** Characters per token for Latin-script text. */
  text: 2.6,
  /** Characters per token for CJK text. */
  cjk: 1.24,
  /** Characters per token for serialized tool schemas. */
  schema: 2.26,
  /** Pixels per token for an image. */
  pixelsPerToken: 750,
} as const

/**
 * Human sentence for one basis, used as the tooltip body.
 * @param basis - the measure's basis tag.
 */
export function basisTip(basis: Basis): string {
  switch (basis) {
    case "usage":
      return t("basis.tip.usage")
    case "chars-per-token":
      return t("basis.tip.chars-per-token", {
        text: CALIBRATION.text,
        cjk: CALIBRATION.cjk,
        schema: CALIBRATION.schema,
      })
    case "harness-projection":
      return t("basis.tip.harness-projection", { px: CALIBRATION.pixelsPerToken })
    case "byte-length":
      return t("basis.tip.byte-length")
    case "unattributed":
      return t("basis.tip.unattributed")
  }
}

/** The tooltip body for one measure: precision word, basis, calipers, value. */
export function measureTip(measure: Measure): string {
  const precision = measure.precision === "exact" ? t("precision.exact") : t("precision.estimate")
  return `${precision} · ${t(`basis.${measure.basis}`)} — ${basisTip(measure.basis)} (${formatTokens(measure.tokens)} tokens)`
```

</details>

**依据 4 · 源码核查**：[plugins/sessions-insight/src/client/ui/shared/precision.tsx:91-110](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/client/ui/shared/precision.tsx#L91-L110)

数值实际带精度mark和tooltip。

<details>
<summary>查看原文（20行）</summary>

```text
export function MeasureValue({
  measure,
  share,
  dense = false,
}: {
  measure: Measure
  share?: string
  dense?: boolean
}): ReactElement {
  const mark = measure.precision === "exact" ? "=" : "≈"
  const label = measureTip(measure)
  return (
    <span
      className="relative inline-flex items-baseline gap-1 font-mono text-[11px] outline-offset-2"
      data-precision={measure.precision}
      data-tip={label}
      tabIndex={0}
      aria-label={label}
    >
      <span className={measure.precision === "exact" ? "text-fg" : "text-fg-dim italic"}>
```

</details>

**依据 5 · 源码核查**：[plugins/sessions-insight/src/host/views/cost.ts:161-205](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/cost.ts#L161-L205)

通道价缺失和无usage/价的null。

<details>
<summary>查看原文（45行）</summary>

```text
function amountOf(
  usage: Usage,
  price: { input: number; output: number; cacheRead: number | null; cacheWrite: number | null },
  key: string,
): { amount: number; unlisted: string[] } {
  const unlisted: string[] = []
  const bucket = (tokens: number, rate: number | null, name: string): number => {
    if (tokens <= 0) return 0
    if (rate === null) {
      unlisted.push(`${key}#${name}`)
      return 0
    }
    return tokens * rate
  }
  const amount =
    bucket(usage.input, price.input, "input") +
    bucket(usage.cacheWrite, price.cacheWrite, "cacheWrite") +
    bucket(usage.cacheRead, price.cacheRead, "cacheRead") +
    bucket(usage.output, price.output, "output")
  return { amount: amount / 1_000_000, unlisted }
}

/**
 * Price every turn of a session against one table.
 * @param session - the session IR.
 * @param table - the table to read.
 * @returns that table's answer, index-aligned with `session.turns`.
 */
function priceWithTable(session: Session, table: PricingTable): TableCost {
  const turns: TurnCost[] = []
  const unpriced = new Set<string>()
  const provisionalModels = new Set<string>()
  const unlistedChannels = new Set<string>()
  const byCurrency: Partial<Record<Currency, CurrencyTotal>> = {}
  let provisional = false
  for (const turn of session.turns) {
    const usage = turn.usage
    const key = displayKey(turn.model?.provider, turn.model?.model)
    const price = lookupPrice(table, turn.model?.provider, turn.model?.model)
    const hitRate = usage === undefined ? null : rateOf(usage)
    if (usage === undefined || price === undefined) {
      if (key !== undefined && price === undefined) unpriced.add(key)
      const line: TurnCost = { index: turn.index, priced: false, amount: null, usd: null, cacheHitRate: hitRate }
      if (key !== undefined) line.model = key
      if (usage !== undefined) line.usage = usage
```

</details>

**依据 6 · 源码核查**：[plugins/sessions-insight/src/host/views/cost.ts:274-326](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/cost.ts#L274-L326)

主价选择与参考分离的真实计算。

<details>
<summary>查看原文（53行）</summary>

```text
    if (table !== undefined) computed[id] = priceWithTable(session, table)
  }
  const referenceTable = computed.openrouter

  const turns: TurnCost[] = []
  const groups = new Map<string, CostGroup>()
  const unpricedModels = new Set<string>()
  const unlisted = new Set<string>()
  const provisionalModels = new Set<string>()
  const primaryTables = new Set<TableId>()
  let partial = false
  let provisional = false
  let usdOnly = true
  let usdTotal = 0
  let priced = 0
  session.turns.forEach((turn, index) => {
    let chosen: { id: TableId; cost: TurnCost } | undefined
    for (const id of order) {
      const candidate = computed[id]?.turns[index]
      if (candidate !== undefined && candidate.priced) {
        chosen = { id, cost: candidate }
        break
      }
    }
    const key = displayKey(turn.model?.provider, turn.model?.model)
    const referenceTurn = referenceTable?.turns[index]
    if (chosen === undefined) {
      if (key !== undefined && primaryTableFor(turn.model?.provider, turn.model?.model, tables) === null) {
        unpricedModels.add(key)
      }
      const line: TurnCost = {
        index: turn.index,
        priced: false,
        amount: null,
        usd: null,
        cacheHitRate: turn.usage === undefined ? null : rateOf(turn.usage),
      }
      if (key !== undefined) line.model = key
      if (turn.usage !== undefined) line.usage = turn.usage
      turns.push(line)
      return
    }
    const line: TurnCost = { ...chosen.cost, tableId: chosen.id }
    if (line.usage === undefined && turn.usage !== undefined) line.usage = turn.usage
    if (
      referenceTurn !== undefined &&
      referenceTurn.priced &&
      referenceTurn.amount !== null &&
      referenceTurn.currency !== undefined &&
      (referenceTurn.amount !== line.amount || referenceTurn.currency !== line.currency)
    ) {
      line.reference = {
        tableId: "openrouter",
```

</details>

**依据 7 · 源码核查**：[plugins/sessions-insight/src/host/views/cost.ts:370-413](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/cost.ts#L370-L413)

币种/主参考分组和限定说明。

<details>
<summary>查看原文（44行）</summary>

```text
  const byCurrency: Partial<Record<Currency, CurrencyTotal>> = {}
  for (const group of groups.values()) {
    const slice = byCurrency[group.currency] ?? { amount: 0, pricedTurns: 0 }
    slice.amount = round(slice.amount + group.amount)
    slice.pricedTurns += group.pricedTurns
    byCurrency[group.currency] = slice
  }
  const single = primaryTables.size === 1 ? ([...primaryTables][0] as TableId) : null
  const pricing =
    (single === null ? undefined : computed[single]?.pricing) ??
    computed.official?.pricing ??
    (referenceTable?.pricing as TableCost["pricing"])
  const baseNote =
    "input 为未缓存余量；cacheRead 单列相加、不嵌套在 input 内（DSH/Codex 的缓存窗口已由 adapter 分离）。未覆盖模型记 null，不猜；未列价通道记 0 并标 partial（UI 用 ≥ 表示下限）。主价格只取 official（DeepSeek→官方 USD；Claude/GPT 无主价，只显示 openrouter 参考列），会话合计按 (tableId, currency) 分组；openrouter 仅作参考列，**不做汇率换算**，任何合计都不跨表、不跨币种。"
  const note = provisional ? `${baseNote} 含预览价：见会话内提示。` : baseNote
  return {
    source,
    sessionId: session.id,
    tableId: single,
    pricing,
    totals: {
      usd: priced > 0 && usdOnly ? round(usdTotal) : null,
      byCurrency,
      pricedTurns: priced,
      unpricedTurns: turns.length - priced,
      input,
      cacheRead,
      cacheWrite,
      output,
      cacheHitRate: promptTokens <= 0 ? null : cacheRead / promptTokens,
    },
    groups: [...groups.values()],
    reference:
      referenceTable === undefined
        ? null
        : { tableId: "openrouter", pricing: referenceTable.pricing, byCurrency: referenceTable.byCurrency },
    tables: computed,
    turns,
    unpricedModels: [...unpricedModels].sort(),
    partial,
    unlistedChannels: [...unlisted].sort(),
    provisionalModels: [...provisionalModels].sort(),
    provisional,
    note,
```

</details>

#### 缺口

- 未独立核全三adapter精度、价格现值和账单对照。
  **影响**：不能据exact/价表断言实际请求或支出精确。
  **进一步探讨**：固定模型/日志/计费记录比数值，检查partial/unpriced/provisional；不一致回官方usage/账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · handoff是否真的创建会话，成功与取消怎样解释？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

prepare从源detail生成六节简报，文件/决定/风险由工具路径与assistant文本模式抽取且截2000字符，可能漏项/把叙述当决定，用户须预览编辑。apply重新收cwd/brief，只校绝对存在目录/长度/ID，不证明来自prepare的简报已被人看过，也不把源id绑成授权令牌。Host实际workspaces.create→session.commands.create→prompt queue，可能启动模型/工具并产生费用与文件副作用；不是单纯复制日志，不能无确认点。

runner投递前读baselineSeq，投递成功先delivered；status读日志窗口，turn/start后running，turn/end reason completed才succeeded，否则failed。succeeded仅一轮结束，不是简报中业务目标已验收。create已成功而prompt拒绝可能留下空会话；prompt回包丢失也可能已排队，本方法不携signal或cancel命令，不可把HTTP断连当停止模型。jobs仅进程内最多64条，重启/淘汰丢baseline后退到全日志，既有sessionId或后续别的turn可能影响归因；不是耐久operation receipt/幂等保证。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sessions-insight/src/host/http/handoff-routes.ts:41-62](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/handoff-routes.ts#L41-L62)

prepare实际brief与结果。

<details>
<summary>查看原文（22行）</summary>

```text
    const session = answer.value.session
    if (session.workdir === "") {
      writeFail(res, "bad-request", "workdir-unknown:cwd-must-be-typed")
      return
    }
    const brief = extractBrief(session, request.locale)
    const value: BriefValue = {
      source: reader.id,
      sessionId: session.id,
      workdir: session.workdir,
      turns: session.turns.length,
      defaultCwd: session.workdir,
      brief: brief.text,
      chars: brief.chars,
      sections: brief.sections,
      fileCount: brief.files.length,
      decisionCount: brief.decisionCount,
      openCount: brief.openCount,
      commandCount: brief.commandCount,
    }
    if (session.title !== undefined) value.title = session.title
    writeOk(res, value)
```

</details>

**依据 2 · 源码核查**：[plugins/sessions-insight/src/host/views/brief.ts:141-184](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/brief.ts#L141-L184)

由工具/文本模式抽取的内容。

<details>
<summary>查看原文（44行）</summary>

```text
export function extractBrief(session: Session, locale = "zh"): BriefResult {
  const english = !/^zh(?:-|$)/i.test(locale)
  const noRecord = english ? "No record in the session log" : NO_RECORD
  const sectionTitles = english
    ? ([
        "Background and goals",
        "Changed files",
        "Decisions",
        "Open items and risks",
        "Next steps",
        "Verification commands",
      ] as const)
    : SECTION_TITLES
  const assistantTexts = session.turns.flatMap((turn) => turn.assistantText)
  const calls = session.turns.flatMap((turn) => turn.toolCalls)

  const fileCounts = new Map<string, { count: number; tools: Set<string> }>()
  for (const call of calls) {
    const path = pathOf(call)
    if (path === undefined) continue
    const entry = fileCounts.get(path)
    if (entry === undefined) fileCounts.set(path, { count: 1, tools: new Set([call.name]) })
    else {
      entry.count += 1
      entry.tools.add(call.name)
    }
  }
  const files = [...fileCounts.entries()]
    .sort((left, right) => right[1].count - left[1].count)
    .slice(0, 12)
    .map(
      ([path, meta]) =>
        `${path}${english ? " (" : "（"}${[...meta.tools].join("/")}${english ? ", " : "，"}×${String(meta.count)}${english ? ")" : "）"}`,
    )

  const decisions = collect(assistantTexts, DECISION, 6)
  const errors = calls
    .filter((call) => call.status === "error")
    .slice(0, 3)
    .map(
      (call) =>
        `${english ? `Tool ${call.name} failed: ` : `工具 ${call.name} 报错：`}${firstLine(outputText(call.output)) || (english ? "No output" : "无输出")}`,
    )
  const openItems = [...errors, ...collect(assistantTexts, OPEN, 6)].slice(0, 6)
```

</details>

**依据 3 · 源码核查**：[plugins/sessions-insight/src/host/views/brief.ts:226-253](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/views/brief.ts#L226-L253)

缺记录和2000字符截断。

<details>
<summary>查看原文（28行）</summary>

```text
  const sections: BriefSection[] = raw.map((section) => ({
    title: section.title,
    lines: section.lines.length === 0 ? [noRecord] : section.lines,
    empty: section.lines.length === 0,
  }))

  const header = `# ${english ? "Handoff brief" : "交接简报"}${title === undefined || title === "" ? "" : (english ? ": " : "：") + clip(title, 60)}`
  let text = `${header}\n`
  sections.forEach((section, index) => {
    text += `\n## ${String(index + 1)}. ${section.title}\n`
    for (const line of section.lines) text += `- ${line}\n`
  })
  if (text.length > BRIEF_LIMIT) {
    const marker = english
      ? "\n- (2000-character limit reached; remaining content omitted)\n"
      : "\n- （已达 2000 字上限，后续内容省略）\n"
    text = text.slice(0, BRIEF_LIMIT - marker.length) + marker
  }

  return {
    text,
    sections,
    files,
    decisionCount: decisions.length,
    openCount: openItems.length,
    commandCount: commands.length,
    chars: text.length,
  }
```

</details>

**依据 4 · 源码核查**：[plugins/sessions-insight/src/host/http/handoff-routes.ts:71-99](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/handoff-routes.ts#L71-L99)

apply重新取参数并真实调用runner。

<details>
<summary>查看原文（29行）</summary>

```text
export function handleHandoffApply(deps: RouteDeps): RouteHandler {
  return route(async (req, res) => {
    if (!guardRequest(req, res, ["POST"])) return
    if (!isJsonContentType(req)) {
      writeFail(res, "bad-request", "content-type-json-required")
      return
    }
    const body = await readJsonBody(req)
    const request = parseHandoffApply(body)
    if (request === undefined) {
      writeFail(res, "bad-request", "invalid-handoff-apply")
      return
    }
    if (deps.handoff === undefined) {
      writeFail(res, "handoff-unavailable", "runner-missing")
      return
    }
    const answer = await deps.handoff.apply({
      source: request.source,
      id: request.id,
      cwd: request.cwd,
      brief: request.brief,
      ...(request.sessionId === undefined ? {} : { sessionId: request.sessionId }),
    })
    if (!answer.ok) {
      writeFail(res, answer.error, answer.detail)
      return
    }
    writeOk(res, answer.value)
```

</details>

**依据 5 · 源码核查**：[plugins/sessions-insight/src/index.ts:214-234](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/index.ts#L214-L234)

Host命令/观察/workspace真实接线。

<details>
<summary>查看原文（21行）</summary>

```text
    return {
      create: (request) => create.call(inner, request),
      prompt: (request, source) => prompt.call(inner, request, source),
    }
  }
  const observedRoot = hostSessionsRoot()
  const handoff = new HandoffRunner({
    ...(commands() === undefined ? {} : { commands: commands() }),
    observe: (sessionId) => observeSession(observedRoot, sessionId),
    ...(ctx.workspaceController === undefined || ctx.workspaceRegistry === undefined
      ? {}
      : {
          workspaces: {
            create: (request: { path: string }) => ctx.workspaceController!.commands.create(request),
            attach: async (workspaceId: string, sessionId: string) => {
              const workspace = ctx.workspaceRegistry!.get(workspaceId)
              if (workspace === undefined) throw new Error("workspace/not-found")
              await workspace.attachSession(sessionId)
            },
          },
        }),
```

</details>

**依据 6 · 源码核查**：[plugins/sessions-insight/src/host/handoff/handoff.ts:215-268](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/handoff/handoff.ts#L215-L268)

真实create/prompt、baseline与delivered。

<details>
<summary>查看原文（54行）</summary>

```text
  async apply(input: HandoffApplyInput): Promise<{ ok: true; value: HandoffApplyValue } | HandoffFailure> {
    const commands = this.#deps.commands
    if (commands === undefined) return { ok: false, error: "handoff-unavailable", detail: "session-controller-missing" }
    const cwd = input.cwd.trim()
    if (cwd === "") return { ok: false, error: "bad-request", detail: "cwd-required" }
    if (!isAbsolute(cwd)) return { ok: false, error: "bad-request", detail: "cwd-not-absolute" }
    try {
      const info = await stat(cwd)
      if (!info.isDirectory()) return { ok: false, error: "bad-request", detail: "cwd-not-a-directory" }
    } catch {
      return { ok: false, error: "bad-request", detail: "cwd-missing" }
    }
    const brief = input.brief.trim()
    if (brief === "") return { ok: false, error: "bad-request", detail: "brief-required" }
    if (brief.length > HANDOFF_BRIEF_LIMIT) return { ok: false, error: "bad-request", detail: "brief-too-long" }
    if (input.sessionId !== undefined && !isSafeId(input.sessionId)) {
      return { ok: false, error: "bad-request", detail: "invalid-session-id" }
    }

    const workspaces = this.#deps.workspaces
    if (workspaces === undefined)
      return { ok: false, error: "handoff-unavailable", detail: "workspace-controller-missing" }
    let workspaceId: string
    try {
      workspaceId = (await workspaces.create({ path: cwd })).workspace.workspaceId
    } catch (error) {
      return { ok: false, error: "handoff-unavailable", detail: `workspace: ${messageOf(error).slice(0, 200)}` }
    }
    let created: unknown
    try {
      const request: { workspaceId: string; sessionId?: string; agentPreset?: string } = { workspaceId }
      if (input.sessionId !== undefined) request.sessionId = input.sessionId
      created = await commands.create(request)
    } catch (error) {
      return mapCallError(error, "create")
    }
    const sessionId = isObject(created) && typeof created["sessionId"] === "string" ? created["sessionId"] : undefined
    if (sessionId === undefined)
      return { ok: false, error: "handoff-unavailable", detail: "create-returned-no-session-id" }

    // Log order, not wall clock, bounds the observation window (see #jobs).
    const baselineSeq = await this.#baselineOf(sessionId)
    const requestId = `handoff-${sessionId}-${String(this.#now())}`
    try {
      await commands.prompt(
        { requestId, sessionId, mode: "queue", content: [{ type: "text", text: brief }] },
        { kind: "user", rpcId: requestId },
      )
    } catch (error) {
      return mapCallError(error, "prompt")
    }

    this.#remember(sessionId, baselineSeq)
    return { ok: true, value: { sessionId, state: "delivered", pollAfterMs: HANDOFF_POLL_MS } }
```

</details>

**依据 7 · 源码核查**：[plugins/sessions-insight/src/host/handoff/handoff.ts:292-349](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/handoff/handoff.ts#L292-L349)

状态窗口/一轮completed判断。

<details>
<summary>查看原文（58行）</summary>

```text
  async status(sessionId: string): Promise<{ ok: true; value: HandoffStatusValue } | HandoffFailure> {
    if (!isSafeId(sessionId)) return { ok: false, error: "bad-request", detail: "invalid-session-id" }
    const observe = this.#deps.observe
    if (observe === undefined) return { ok: false, error: "handoff-unavailable", detail: "observer-missing" }

    const started = this.#now()
    let events: ObservedEvent[] | undefined
    try {
      events = await observe(sessionId)
    } catch (error) {
      return { ok: false, error: "handoff-unavailable", detail: `observe: ${messageOf(error).slice(0, 200)}` }
    }
    if (events === undefined) {
      // The log is not on disk yet (or already gone): the handoff is still only
      // "delivered" from the caller's point of view.
      return { ok: true, value: { sessionId, state: "delivered", elapsedMs: this.#now() - started } }
    }

    const job = this.#jobs.get(sessionId)
    const baseline = job?.baselineSeq ?? -1
    const elapsedMs = Math.max(
      0,
      this.#now() - (job?.deliveredAt ?? events.find((event) => event.type === "turn/start")?.time ?? started),
    )
    // Log order first. The time fallback only applies when the whole log sits at
    // or below the baseline, i.e. when seq cannot separate old from new.
    const bySeq = events.filter((event) => event.seq > baseline)
    const inWindow = bySeq.length > 0 ? bySeq : events.filter((event) => event.time >= (job?.deliveredAt ?? 0))
    const progress = handoffProgress(inWindow)
    const sawTurnStart = inWindow.some((event) => event.type === "turn/start")
    let turnEnd = inWindow.find((event) => event.type === "turn/end")
    if (turnEnd === undefined) {
      // The Host may fold the boundary onto another record; fall back to the
      // first turn/end that follows the prompt's own user/message.
      const from = events.reduce(
        (last, event, index) => (event.type === "user/message" && event.seq > baseline ? index : last),
        -1,
      )
      if (from >= 0) turnEnd = events.slice(from + 1).find((event) => event.type === "turn/end")
    }
    if (turnEnd === undefined) {
      if (!sawTurnStart) {
        return { ok: true, value: { sessionId, state: "delivered", elapsedMs, progress } }
      }
      // A turn has started, so delivery is over: never report "delivered" here.
      // (Previous builds could, when turn/start predated the wall-clock window.)
      return { ok: true, value: { sessionId, state: "running", elapsedMs, progress } }
    }
    const kind = reasonKind(turnEnd.data)
    if (kind === "completed") {
      return { ok: true, value: { sessionId, state: "succeeded", seq: turnEnd.seq, elapsedMs, progress } }
    }
    const code = failureCodeOf(inWindow)
    const reason = code ?? kind ?? "unknown"
    const hint = FAILURE_HINTS[reason] ?? `turn/end reason=${reason}，会话日志里没有已知失败码`
    const raw = failureMessageOf(inWindow)
    const detail = raw === undefined ? hint : `${hint} 原始失败：${raw}`
    return { ok: true, value: { sessionId, state: "failed", reason, seq: turnEnd.seq, detail, elapsedMs, progress } }
```

</details>

**依据 8 · 源码核查**：[plugins/sessions-insight/src/host/handoff/handoff.ts:356-375](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/handoff/handoff.ts#L356-L375)

观察失败退路与进程内64条。

<details>
<summary>查看原文（20行）</summary>

```text
  async #baselineOf(sessionId: string): Promise<number> {
    const observe = this.#deps.observe
    if (observe === undefined) return -1
    try {
      const events = await observe(sessionId)
      if (events === undefined || events.length === 0) return -1
      return events.reduce((highest, event) => (event.seq > highest ? event.seq : highest), -1)
    } catch {
      // Observation is best-effort: without it the window starts at the first event.
      return -1
    }
  }

  #remember(sessionId: string, baselineSeq: number): void {
    this.#jobs.set(sessionId, { baselineSeq, deliveredAt: this.#now() })
    while (this.#jobs.size > JOB_LIMIT) {
      const oldest = this.#jobs.keys().next()
      if (oldest.done === true) break
      this.#jobs.delete(oldest.value)
    }
```

</details>

#### 缺口

- 没有真实Host投递/重启/丢回包或目标任务验收。
  **影响**：不能保证重复请求不重复工作、取消可中止，试用排除handoff。
  **进一步探讨**：用隔离Host/无副作用工具测试投递前后断回包、重启/并行turn，并独立验收最终任务；不明时先找目标session。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 删除和管理是否只改本插件，权限与持久结果是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

删除会调用source.remove到deleteLogs，整个目标集先realpath/lstat验证再逐个unlink，不递归删目录；多文件不是事务，后一个unlink失败可已有日志删除。route在日志删后metadata清失败仍成功带warning，finally清列表缓存，避免误导成可安全重试；但没有回收站。路由并不要求可信一次性人批令牌，前端确认不能约束直接HTTP调用。

手动title/group是DSH_HOME下metadata sidecar，进程内队列串行read-modify-write，临时wx600后rename，无跨进程锁/已验fsync。它不改原始会话文本，单独删元数据不恢复已删日志。所有这些route使用同仓kit的Origin/方法gate：无Origin允许，Origin只比host（无scheme），非浏览器可伪造，不是用户鉴权/租户边界。余额route另loopback并不能推出全会话路由都loopback。须部署在可信本地Host/外部认证层，禁止把读取私人会话的site公开给不可信网络。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sessions-insight/src/host/http/delete-route.ts:8-44](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/delete-route.ts#L8-L44)

真实删除、metadata warning与清缓存。

<details>
<summary>查看原文（37行）</summary>

```text
export function handleDeleteSession(deps: RouteDeps): RouteHandler {
  return route(async (req, res) => {
    if (!guardRequest(req, res, ["POST"])) return
    // Desktop validates dsh-app's origin before stripping Origin and Sec-Fetch-Site in its proxy.
    if (!isJsonContentType(req)) {
      writeFail(res, "bad-request", "content-type-json-required")
      return
    }
    const body = await readJsonBody(req)
    if (!isDeleteSessionValue(body)) {
      writeFail(res, "bad-request", "invalid-session-reference")
      return
    }
    const source = deps.sources.find((candidate) => candidate.id === body.source)
    if (source?.remove === undefined) {
      writeFail(res, "source-unavailable", "session-deletion-unavailable")
      return
    }
    try {
      const answer = await source.remove(body.id)
      if (!answer.ok) {
        writeFail(res, answer.error, answer.detail)
        return
      }
      try {
        await deps.metadata?.remove(body.source, body.id)
      } catch {
        // Original logs are already gone: do not report an irreversible success as a retryable failure.
        console.warn("[sessions-insight] deleted session metadata cleanup failed")
        writeOk(res, { ...body, metadataWarning: "metadata-cleanup-failed" })
        return
      }
      writeOk(res, body)
    } finally {
      // Partial filesystem failures must also drop old list answers.
      clearListCache(deps)
    }
```

</details>

**依据 2 · 源码核查**：[plugins/sessions-insight/src/host/sources/dsh.ts:349-359](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/dsh.ts#L349-L359)

DSH删除实际传日志集合。

<details>
<summary>查看原文（11行）</summary>

```text
  async remove(id: string): Promise<{ ok: true } | SourceFailure> {
    if (!isSafeId(id)) return { ok: false, error: "bad-request", detail: "invalid-session-id" }
    const scan = await this.scan()
    try {
      return await deleteLogs(
        this.root,
        scan.entries.filter((entry) => entry.id === id).map((entry) => entry.path),
      )
    } finally {
      this.invalidate()
    }
```

</details>

**依据 3 · 源码核查**：[plugins/sessions-insight/src/host/sources/delete.ts:7-18](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/sources/delete.ts#L7-L18)

先验证后逐文件unlink。

<details>
<summary>查看原文（12行）</summary>

```text
export async function deleteLogs(root: string, paths: readonly string[]): Promise<{ ok: true } | SourceFailure> {
  if (paths.length === 0) return { ok: false, error: "not-found", detail: "session-not-found" }
  const targets: string[] = []
  for (const path of paths) {
    const target = await resolveInside(root, path)
    if (target === undefined || !(await lstat(path)).isFile()) {
      return { ok: false, error: "forbidden", detail: "unsafe-session-path" }
    }
    targets.push(target)
  }
  for (const target of new Set(targets)) await unlink(target)
  return { ok: true }
```

</details>

**依据 4 · 源码核查**：[packages/session-contract/src/guards/deletion.ts:6-13](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/packages/session-contract/src/guards/deletion.ts#L6-L13)

删除请求只核source/id形状，不含可信批准令牌。

```text
export interface DeleteSessionValue {
  source: ContextSource
  id: string
}

export function isDeleteSessionValue(value: unknown): value is DeleteSessionValue {
  return isRecord(value) && isContextSource(value["source"]) && typeof value["id"] === "string" && isSafeId(value["id"])
}
```

**依据 5 · 源码核查**：[plugins/sessions-insight/src/host/management/store.ts:16-22](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/management/store.ts#L16-L22)

sidecar位置。

```text
export function metadataPathFrom(env: NodeJS.ProcessEnv = process.env): string {
  const home = env["DSH_HOME"]
  return join(
    home !== undefined && home.trim() !== "" ? home : join(homedir(), ".dsh"),
    "dsh-sessions-insight",
    "metadata.json",
  )
```

**依据 6 · 源码核查**：[plugins/sessions-insight/src/host/management/store.ts:35-88](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/management/store.ts#L35-L88)

进程内串行、临时文件rename和patch。

<details>
<summary>查看原文（54行）</summary>

```text
  #serial<T>(run: () => Promise<T>): Promise<T> {
    const pending = (queues.get(this.path) ?? Promise.resolve()).catch(() => undefined).then(run)
    queues.set(this.path, pending)
    void pending
      .finally(() => {
        if (queues.get(this.path) === pending) queues.delete(this.path)
      })
      .catch(() => undefined)
    return pending
  }

  async #read(): Promise<MetadataValue> {
    let text: string
    try {
      text = await readFile(this.path, "utf8")
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return { entries: [] }
      throw error
    }
    const value: unknown = JSON.parse(text)
    if (!isMetadataValue(value)) throw new Error("invalid-session-metadata-store")
    return value
  }

  async #write(value: MetadataValue): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true })
    const temporary = `${this.path}.${randomUUID()}.tmp`
    try {
      await writeFile(temporary, `${JSON.stringify(value)}\n`, { flag: "wx", mode: 0o600 })
      await rename(temporary, this.path)
    } finally {
      await rm(temporary, { force: true })
    }
  }

  read(): Promise<MetadataValue> {
    return this.#serial(() => this.#read())
  }

  patch(patch: MetadataPatch): Promise<SessionMetadata> {
    if (!isMetadataPatch(patch)) return Promise.reject(new Error("invalid-metadata-patch"))
    return this.#serial(async () => {
      const value = await this.#read()
      const index = value.entries.findIndex((entry) => entry.source === patch.source && entry.id === patch.id)
      const metadata: SessionMetadata = { ...(value.entries[index] ?? { source: patch.source, id: patch.id }) }
      for (const field of ["title", "group"] as const) {
        const text = patch[field]
        if (text === null) delete metadata[field]
        else if (text !== undefined) metadata[field] = text.trim()
      }
      if (index >= 0) value.entries.splice(index, 1)
      if (metadata.title !== undefined || metadata.group !== undefined) value.entries.push(metadata)
      await this.#write(value)
      return metadata
```

</details>

**依据 7 · 源码核查**：[plugins/sessions-insight/src/host/http/management-route.ts:24-48](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/management-route.ts#L24-L48)

读实际会话后patch。

<details>
<summary>查看原文（25行）</summary>

```text
    const body = await readJsonBody(req)
    if (!isMetadataPatch(body)) {
      writeFail(res, "bad-request", "invalid-metadata-patch")
      return
    }
    const source = deps.sources.find((candidate) => candidate.id === body.source)
    if (source === undefined) {
      writeFail(res, "source-unavailable", "source-not-configured")
      return
    }
    const answer = await ask(source, () => source.detail(body.id))
    if (!answer.ok) {
      writeFail(res, "source-unavailable", answer.problem.detail ?? "adapter-error")
      return
    }
    if (!answer.value.ok) {
      writeFail(res, answer.value.error, answer.value.detail)
      return
    }
    const metadata = await deps.metadata.patch(body)
    const session = answer.value.session
    const displayTitle = metadata.title ?? cleanTitle(session.title, session.id)
    const value: SessionMetadataValue = { metadata }
    if (displayTitle !== undefined) value.displayTitle = displayTitle
    writeOk(res, value)
```

</details>

**依据 8 · 源码核查**：[plugins/sessions-insight/src/host/http/server.ts:90-92](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/server.ts#L90-L92)

实际guard委托。

```text
export function guardRequest(req: IncomingMessage, res: ServerResponse, allowed: readonly string[]): boolean {
  return kitGuardRequest(req, res, allowed, STATUS_BY_CODE, REFUSALS)
}
```

**依据 9 · 源码核查**：[packages/plugin-kit-host/src/http.ts:56-80](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/packages/plugin-kit-host/src/http.ts#L56-L80)

header gate及无Origin允许。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Same-origin gate for a plugin's routes.
 *
 * The check is deliberately conservative and header-only: it refuses a
 * `Sec-Fetch-Site: cross-site` request, and refuses an `Origin` that does not
 * match the `Host` the request was addressed to. A same-origin GET carries no
 * `Origin` at all, so an absent header passes — the gate assumes read-only
 * routes on a listener bound to a concrete loopback address.
 *
 * This is a tripwire, not an authority boundary: a non-browser client can forge
 * both headers. Routes that read user data need a credential check on top.
 * @param req - the incoming request.
 * @returns true when the request may proceed.
 */
export function isSameOrigin(req: IncomingMessage): boolean {
  if (headerValue(req.headers, "sec-fetch-site") === "cross-site") return false
  const origin = headerValue(req.headers, "origin")
  if (origin === undefined) return true
  const host = headerValue(req.headers, "host")
  if (host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
```

</details>

**依据 10 · 源码核查**：[packages/plugin-kit-host/src/http.ts:201-217](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/packages/plugin-kit-host/src/http.ts#L201-L217)

真实仅origin/method门禁。

<details>
<summary>查看原文（17行）</summary>

```text
export function guardRequest<Code extends string>(
  req: IncomingMessage,
  res: ServerResponse,
  allowed: readonly string[],
  table: StatusTable<Code>,
  codes: RefusalCodes<Code>,
): boolean {
  if (!isSameOrigin(req)) {
    writeFail(res, table, codes.forbidden, "origin-mismatch")
    return false
  }
  const method = req.method ?? "GET"
  if (!allowed.includes(method)) {
    writeFail(res, table, codes.methodNotAllowed, method, { allow: allowed.join(", ") })
    return false
  }
  return true
```

</details>

#### 缺口

- 未查整套Host认证/代理、跨进程metadata或多文件删除故障。
  **影响**：不能宣称确认删除安全/整个部署只读，试用只副本不触删除。
  **进一步探讨**：绑定实际Host监听/认证契约，断开外部访问；在副本多文件删除中注入第二次unlink失败，核不可逆残留与warning。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些行为外发、使用负担与退出如何控制？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

余额与版本检查默认关，余额route另loopback/GET、限流与开关；版本手动check可越自动开关，HEAD只缓存。https仅固定DeepSeek余额/npm地址、大小/绝对deadline且非200拒绝不跟redirect，不能把它们与AI/handoff混成“无外发”。AI改名取前三段有界用户输入发当前默认模型，经prepareCall/stream/Abort并只返回建议；用户另保存metadata。会话内容仍可能敏感，默认模型数据策略/计费由宿主，取消不证明供应商未收。本轮未完整审余额凭据/完整UI/全部utility实现，试用全部关闭且不点手动检查/AI。

要求DSH>=0.2.1-rc.5及Node>=24.22.1/React19.3.1；这些是包声明，不因研究工程Node24.19可读源码就认为可运行。已有多宿主日志的用户可用独立DSH_HOME和脱敏源副本只浏览，核一会话/一次搜索及数值依据，不handoff/删除/改名/余额。首次配正确profile/源根、持续扫描解码缓存/索引磁盘、深搜大日志CPU与人工判读；只浏览不直接付模型费，但AI/交接会用模型与工具，具体费用/省时未知。退出关面板/插件清routes/AI任务/缓存，另保留/删除索引metadata；已有投递会话是Host状态，不因卸载自动停止或回滚，删日志需另备份。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sessions-insight/src/protocol/settings.ts:7-17](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/protocol/settings.ts#L7-L17)

utility默认关闭。

<details>
<summary>查看原文（11行）</summary>

```text
export const SETTINGS_DEFAULTS = Object.freeze({
  sessionOverview: true,
  skillsTab: true,
  waterfall: true,
  defaultToolsExpanded: false,
  // Both utilities leave the machine (balance: api.deepseek.com, version:
  // registry.npmjs.org) and the balance read needs a credential. A fresh
  // install sends nothing until the person opts in.
  deepseekBalance: false,
  autoCheckVersion: false,
})
```

</details>

**依据 2 · 源码核查**：[plugins/sessions-insight/src/host/http/utility-routes.ts:44-111](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/http/utility-routes.ts#L44-L111)

余额额外loopback/开关/限流与手动版本。

<details>
<summary>查看原文（68行）</summary>

```text
    {
      kind: "exact",
      path: BALANCE_PATH,
      handler: route(async (req, res, url) => {
        // No HEAD: a probe must never reach the provider, so the method gate answers 405.
        if (!guardRequest(req, res, ["GET"])) return
        if (!isLoopback(req)) {
          writeFail(res, "forbidden", "non-loopback")
          return
        }
        const allowed = new Set(["refresh", "locale", "timezoneOffsetSeconds"])
        const locale = url.searchParams.get("locale") ?? "en-US"
        const rawOffset = url.searchParams.get("timezoneOffsetSeconds") ?? "0"
        const timezoneOffsetSeconds = Number(rawOffset)
        if (
          [...url.searchParams.keys()].some((key) => !allowed.has(key)) ||
          !/^[a-z]{2,3}(?:-[a-zA-Z]{2,8})?$/.test(locale) ||
          !/^-?\d+$/.test(rawOffset) ||
          !Number.isInteger(timezoneOffsetSeconds) ||
          Math.abs(timezoneOffsetSeconds) > 86400 ||
          (url.searchParams.has("refresh") && url.searchParams.get("refresh") !== "1")
        ) {
          writeFail(res, "bad-request", "invalid-utility-query")
          return
        }
        // The switch only short-circuits an already valid request, so a bad query
        // stays a 400 whether the route is enabled or not.
        if (!deps.settings().deepseekBalance) {
          writeOk(res, { status: "disabled", checkedAt: Date.now() })
          return
        }
        const refresh = url.searchParams.get("refresh") === "1"
        // Cache hits and in-flight reuse reach neither the provider nor the
        // account, so they never spend a slot. A full window answers 429 with
        // `rate-limited` so the caller can retry rather than hammer the provider;
        // the code is route-specific because the shared envelope vocabulary has
        // no generic throttling entry.
        if (!deps.balance.wouldReuse(refresh) && !limiter.take()) {
          writeJson(res, 429, { ok: false, error: "rate-limited", detail: "balance-refresh-limited" })
          return
        }
        writeOk(res, await deps.balance.read({ locale, timezoneOffsetSeconds }, refresh))
      }),
    },
    {
      kind: "exact",
      path: VERSION_PATH,
      handler: route(async (req, res, url) => {
        if (!guardRequest(req, res, ["GET", "HEAD"])) return
        if (
          [...url.searchParams.keys()].some((key) => !["refresh", "check"].includes(key)) ||
          [...url.searchParams.values()].some((value) => value !== "1")
        ) {
          writeFail(res, "bad-request", "invalid-utility-query")
          return
        }
        const manual = url.searchParams.get("check") === "1"
        // Validated before the switch, for the same 400 either way.
        if (!manual && !deps.settings().autoCheckVersion) {
          writeOk(res, { ...deps.versions.peek(), status: "disabled" as const })
          return
        }
        // HEAD is a passive probe, never a network check.
        writeOk(
          res,
          req.method === "HEAD"
            ? deps.versions.peek()
            : await deps.versions.check(manual || url.searchParams.get("refresh") === "1"),
```

</details>

**依据 3 · 源码核查**：[plugins/sessions-insight/src/host/utilities/https.ts:7-16](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/utilities/https.ts#L7-L16)

固定端点与上限。

<details>
<summary>查看原文（10行）</summary>

```text
/** No caller-controlled URL, redirects, cookies, body or diagnostic text. */
export const UTILITY_ENDPOINTS = {
  balance: "https://api.deepseek.com/user/balance",
  "@cyrusdoyle/dsh-sessions-insight": "https://registry.npmjs.org/@cyrusdoyle%2Fdsh-sessions-insight/latest",
  "@cyrusdoyle/dsh-plugins": "https://registry.npmjs.org/@cyrusdoyle%2Fdsh-plugins/latest",
} as const
export const UTILITY_TIMEOUT_MS = 8_000
export const BALANCE_TIMEOUT_MS = 30_000
export const UTILITY_MAX_BYTES = 128 * 1024
export type UtilityRequest = (endpoint: keyof typeof UTILITY_ENDPOINTS, key?: string) => Promise<unknown>
```

</details>

**依据 4 · 源码核查**：[plugins/sessions-insight/src/host/utilities/https.ts:44-99](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/utilities/https.ts#L44-L99)

真实固定HTTPS/状态/大小/timeout。

<details>
<summary>查看原文（56行）</summary>

```text
    try {
      const request = get(
        UTILITY_ENDPOINTS[endpoint],
        {
          headers: {
            accept: "application/json",
            ...(endpoint === "balance" && key !== undefined ? { authorization: `Bearer ${key}` } : {}),
          },
        },
        (response) => {
          if (response.statusCode !== 200) {
            fail(
              response.statusCode === 401 || response.statusCode === 403
                ? "unauthorized"
                : response.statusCode === 429
                  ? "rate-limited"
                  : "http-error",
            )
            response.destroy()
            request.destroy()
            return
          }
          const chunks: Buffer[] = []
          let bytes = 0
          response.on("data", (chunk: Buffer) => {
            if (settled) return
            bytes += chunk.length
            if (bytes > UTILITY_MAX_BYTES) {
              fail("invalid-response")
              response.destroy()
              request.destroy()
            } else chunks.push(chunk)
          })
          response.on("error", () => fail("network"))
          response.on("aborted", () => fail("network"))
          response.on("close", () => fail("network"))
          response.on("end", () => {
            if (settled) return
            try {
              const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"))
              finish()
              resolve(value)
            } catch {
              fail("invalid-response")
            }
          })
        },
      )
      // Absolute deadline also bounds DNS/TLS and slow trickle responses.
      timer = setTimeout(
        () => {
          fail("timeout")
          request.destroy()
        },
        endpoint === "balance" ? BALANCE_TIMEOUT_MS : UTILITY_TIMEOUT_MS,
      )
```

</details>

**依据 5 · 源码核查**：[plugins/sessions-insight/src/host/management/ai-title.ts:67-83](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/management/ai-title.ts#L67-L83)

AI输入来自前三段用户话语且有界。

<details>
<summary>查看原文（17行）</summary>

```text
export function aiTitleInput(session: Session): string {
  const messages: string[] = []
  for (const turn of session.turns) {
    for (const text of turn.userInput) {
      if (text.trim().length === 0) continue
      let bounded = ""
      for (const character of text) {
        const candidate = JSON.stringify([...messages, bounded + character])
        if (Buffer.byteLength(candidate, "utf8") > AI_TITLE_INPUT_BYTES) break
        bounded += character
      }
      if (bounded.length > 0) messages.push(bounded)
      if (messages.length === 3 || bounded.length < text.length) return JSON.stringify(messages)
    }
  }
  if (messages.length === 0) fail("ai-naming-no-user-input")
  return JSON.stringify(messages)
```

</details>

**依据 6 · 源码核查**：[plugins/sessions-insight/src/host/management/ai-title.ts:211-277](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/management/ai-title.ts#L211-L277)

真实默认模型调用和取消。

<details>
<summary>查看原文（67行）</summary>

```text
  async suggest(ref: AiTitleRequest, session: Session, signal?: AbortSignal): Promise<AiTitleValue> {
    if (this.disposed) fail("ai-naming-unavailable")
    if (this.active !== undefined) fail("ai-naming-busy")
    const host = this.host()
    if (host === undefined) fail("ai-naming-unavailable")
    if (signal?.aborted) fail("ai-naming-cancelled")
    const controller = transferableAbortController()
    this.active = controller
    const cancel = () => controller.abort(new AiTitleError("ai-naming-cancelled"))
    signal?.addEventListener("abort", cancel, { once: true })
    const timer = setTimeout(() => controller.abort(new AiTitleError("ai-naming-timeout")), AI_TITLE_TIMEOUT_MS)
    try {
      const input = aiTitleInput(session)
      const selection = host.agentDefaultModel.currentSelection()
      if (!selection.provider?.trim() || !selection.model?.trim()) fail("ai-naming-unavailable")
      const call = await abortable(
        host.llm.prepareCall(
          {
            provider: selection.provider,
            model: selection.model,
            maxTokens: AI_TITLE_OUTPUT_TOKENS,
          },
          controller.signal,
          (controls, model) => ({
            ...controls,
            ...(model.reasoning?.efforts[0] === undefined ? {} : { reasoningEffort: model.reasoning.efforts[0].id }),
          }),
        ),
        controller.signal,
      )
      if (
        call.config.provider !== selection.provider ||
        call.config.model !== selection.model ||
        call.config.maxTokens !== AI_TITLE_OUTPUT_TOKENS
      )
        fail("ai-naming-invalid-config")
      const config = Object.freeze({
        ...call.config,
        ...(call.config.stop === undefined ? {} : { stop: Object.freeze([...call.config.stop]) }),
      })
      const options: LlmTitleOptions = Object.freeze({
        ...config,
        system: SYSTEM,
        purpose: "session-title",
        signal: controller.signal,
        messages: Object.freeze([
          Object.freeze({
            id: randomUUID(),
            role: "user" as const,
            content: Object.freeze([Object.freeze({ type: "text" as const, text: input })]),
            source: Object.freeze({ kind: "sessions-insight-ai-title" }),
          }),
        ]),
      })
      controller.signal.throwIfAborted()
      const text = await readTitle(call.stream(options), controller.signal)
      controller.signal.throwIfAborted()
      return { ...ref, title: filterAiTitle(text, ref.id), provider: config.provider, model: config.model }
    } catch (error) {
      if (controller.signal.aborted) throw controller.signal.reason
      controller.abort(new AiTitleError("ai-naming-cancelled"))
      if (error instanceof AiTitleError) throw error
      // Provider exceptions may contain endpoint credentials; never publish their message.
      throw new AiTitleError("ai-naming-unavailable")
    } finally {
      clearTimeout(timer)
      signal?.removeEventListener("abort", cancel)
```

</details>

**依据 7 · 源码核查**：[plugins/sessions-insight/src/index.ts:319-327](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/index.ts#L319-L327)

Host释放能力。

```text
  const release = (disposers: readonly (() => void)[]): void => {
    if (timer !== undefined) globalThis.clearTimeout(timer)
    preload.aborted = true
    aiTitles.dispose()
    offCredentialUpdates()
    balance.invalidate()
    clearListCache(deps)
    for (const dispose of disposers) dispose()
    for (const source of sources) source.invalidate()
```

**依据 8 · 源码核查**：[plugins/sessions-insight/package.json:60-94](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/package.json#L60-L94)

包声明Host/Node/peer版本。

<details>
<summary>查看原文（35行）</summary>

```text
    "release:minor": "pnpm version minor --no-git-tag-version && pnpm pack",
    "prepublishOnly": "pnpm typecheck && pnpm test && pnpm build"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "3.18.5"
  },
  "devDependencies": {
    "@base-ui/react": "^1.9.0",
    "@cyrusdoyle/dsh-plugin-kit": "workspace:*",
    "@cyrusdoyle/dsh-plugin-kit-client": "workspace:*",
    "@cyrusdoyle/dsh-plugin-kit-host": "workspace:*",
    "@cyrusdoyle/dsh-session-contract": "workspace:*",
    "@cyrusdoyle/dsh-session-readers": "workspace:*",
    "@hugeicons/core-free-icons": "^4.4.0",
    "@hugeicons/react": "^1.1.10",
    "cn": "^0.5.1"
  },
  "peerDependencies": {
    "react": "^19.3.1"
  },
  "icon": "icon.svg",
  "engines": {
    "node": ">=24.22.1"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.5"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
```

</details>

#### 缺口

- 没有真实安装、兼容/退出、来源完整性与净效果验证。
  **影响**：只能隔离副本只浏览，不对生产日志管理背书。
  **进一步探讨**：核包要求与实际Host，脱敏三源小日志和一次深搜对照；记录解码/找回时间与错误，再决定保留。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 下一步能验证什么更有价值的方向？

**研究主题**：新假设与验证

#### 完整回答

候选是handoff可持久操作收据：将源版本/编辑简报hash、目标session/requestId、投递/一轮终态/业务验收分别保存，丢回包或重启后先查目标而不是新建重做。依据是当前baseline/jobs仅进程内、prompt后才remember、completed不代表任务成功；不声称已复现重复投递。相对现有状态文字，在三个受控样本（prompt已排队断回包、重启、另一turn完成）测试能否减少误重试/误成功和维护成本。若Host已有持久request去重/receipt满足该需求，或简报不适合自动执行，则推翻，优先只复用其只读来源解释面板。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sessions-insight/src/host/handoff/handoff.ts:255-268](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/handoff/handoff.ts#L255-L268)

投递后才记本地job。

<details>
<summary>查看原文（14行）</summary>

```text
    // Log order, not wall clock, bounds the observation window (see #jobs).
    const baselineSeq = await this.#baselineOf(sessionId)
    const requestId = `handoff-${sessionId}-${String(this.#now())}`
    try {
      await commands.prompt(
        { requestId, sessionId, mode: "queue", content: [{ type: "text", text: brief }] },
        { kind: "user", rpcId: requestId },
      )
    } catch (error) {
      return mapCallError(error, "prompt")
    }

    this.#remember(sessionId, baselineSeq)
    return { ok: true, value: { sessionId, state: "delivered", pollAfterMs: HANDOFF_POLL_MS } }
```

</details>

**依据 2 · 源码核查**：[plugins/sessions-insight/src/host/handoff/handoff.ts:310-342](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/handoff/handoff.ts#L310-L342)

baseline缺失退路与completed。

<details>
<summary>查看原文（33行）</summary>

```text
    const job = this.#jobs.get(sessionId)
    const baseline = job?.baselineSeq ?? -1
    const elapsedMs = Math.max(
      0,
      this.#now() - (job?.deliveredAt ?? events.find((event) => event.type === "turn/start")?.time ?? started),
    )
    // Log order first. The time fallback only applies when the whole log sits at
    // or below the baseline, i.e. when seq cannot separate old from new.
    const bySeq = events.filter((event) => event.seq > baseline)
    const inWindow = bySeq.length > 0 ? bySeq : events.filter((event) => event.time >= (job?.deliveredAt ?? 0))
    const progress = handoffProgress(inWindow)
    const sawTurnStart = inWindow.some((event) => event.type === "turn/start")
    let turnEnd = inWindow.find((event) => event.type === "turn/end")
    if (turnEnd === undefined) {
      // The Host may fold the boundary onto another record; fall back to the
      // first turn/end that follows the prompt's own user/message.
      const from = events.reduce(
        (last, event, index) => (event.type === "user/message" && event.seq > baseline ? index : last),
        -1,
      )
      if (from >= 0) turnEnd = events.slice(from + 1).find((event) => event.type === "turn/end")
    }
    if (turnEnd === undefined) {
      if (!sawTurnStart) {
        return { ok: true, value: { sessionId, state: "delivered", elapsedMs, progress } }
      }
      // A turn has started, so delivery is over: never report "delivered" here.
      // (Previous builds could, when turn/start predated the wall-clock window.)
      return { ok: true, value: { sessionId, state: "running", elapsedMs, progress } }
    }
    const kind = reasonKind(turnEnd.data)
    if (kind === "completed") {
      return { ok: true, value: { sessionId, state: "succeeded", seq: turnEnd.seq, elapsedMs, progress } }
```

</details>

**依据 3 · 源码核查**：[plugins/sessions-insight/src/host/handoff/handoff.ts:369-375](https://github.com/Mt-Youya/dsh-plugins/blob/c1d34caff294293a09766fc42459a80987b17f28/plugins/sessions-insight/src/host/handoff/handoff.ts#L369-L375)

内存有界job。

```text
  #remember(sessionId: string, baselineSeq: number): void {
    this.#jobs.set(sessionId, { baselineSeq, deliveredAt: this.#now() })
    while (this.#jobs.size > JOB_LIMIT) {
      const oldest = this.#jobs.keys().next()
      if (oldest.done === true) break
      this.#jobs.delete(oldest.value)
    }
```

#### 缺口

- 持久收据/业务验收需求和Host可复用能力未验证。
  **影响**：是研究方向，非现有能力或商业成果。
  **进一步探讨**：先绑定Host request去重和会话命令实现，再做三样本对照后定是否开发。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
