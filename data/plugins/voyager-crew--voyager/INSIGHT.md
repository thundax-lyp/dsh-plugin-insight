# Voyager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6fa19b4](https://github.com/voyager-crew/voyager/tree/6fa19b4ae51391fe95f909fcdaf11aaa252f2913)

<!-- BEGIN META -->
[![GitHub ★ 20,463](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C463&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/voyager-crew/voyager) [![npm 30d 1,566](https://img.shields.io/static/v1?label=npm+30d&message=1%2C566&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager) [![最新发布 2015-02-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2015-02-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager)
<!-- END META -->

> **功能**：浏览器聊天增强扩展，提供跨AI网页的提示、组织、阅读与导出功能，并支持声明式JSON插件。

> **亮点**：它把站点语义适配、内置能力原语和声明式插件分开，使同一JSON改动可在多个站点复用；副作用由宿主ledger集中回收，同一属性的多插件覆盖用有序层管理，避免禁用一个就破坏另一个。PluginScope明确借鉴Cordis并裁剪机制，不能将生命周期模式当全球原创。[Q02](#research-q02)

> **主要限制**：声明式插件“不运行自带JS”只约束插件输入，不等于整个扩展无网络或聊天读取能力；原语代码和浏览器权限仍是信任根。语义selector有匹配也不证明匹配了正确消息，当前health把“有用户轮次且目标为0”标异常，不能检出所有错位。因此跨站复用收益依赖真实页面兼容和禁用后状态检查。[Q03](#research-q03)

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
  - [Q01 · 浏览器增强服务什么任务，是否是DSH插件？](#detail-section-11)
  - [Q02 · 语义站点适配与回收如何支撑多插件组合？](#detail-section-12)
  - [Q03 · JSON约束和health标记是否足以保证正确与私密？](#detail-section-13)
  - [Q04 · 站点变化、权限和插件维护成本由谁承担？](#detail-section-14)
  - [Q05 · 语义契约样本能改进错位检测吗，谁先试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为经常在多个AI网页中检索、组织和导出聊天的用户，提供浏览器扩展及声明式本地插件。合格结果是增强正确页面、保留聊天与提示数据并能完整禁用新增效果；这是浏览器客户端，不是DSH宿主bundle。

网页原生搜索/导出、书签和userscript为基线。对比应固定站点、页面版本和任务，分别评正确性、隐私权限与维护投入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 跨站声明式增强 | JSON复用内置原语和站点语义 | 受站点、build原语和权限限制 |
| 本地插件验证 | 限制层、命名空间、参数和站点 | 不是全扩展隐私或正确性保证 |
| 组合副作用回收 | 启停多个插件时恢复DOM与资源 | 依赖所有效果正确登记，未运行验证 |
| 健康检测 | 提示有会话但零命中情况 | 不能识别所有非空错位目标 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持的浏览器扩展环境 | 启动必需 | 内容脚本、存储与扩展生命周期 | 不同浏览器包需各自验收 |
| 站点访问权限和当前适配器 | 页面增强必需 | 将语义对象定位到实际DOM | 改版可能无效或错位 |
| 内置原语和明确engine版本 | 本地插件必需 | 执行允许的声明能力 | 不支持参数/原语会被拒绝或阻断 |
| Google Drive或iCloud | 云同步可选 | 同步文件夹和提示 | 需另行账号授权及隐私核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装对应浏览器版本并授予所需站点权限 | 仅在预期站点注入，确认扩展权限 |
| 2 | 用户选择现成功能或导入JSON插件 | 输入通过本地验证与站点策略 |
| 3 | 宿主解析语义目标、调用原语并记ledger | 检查目标消息与功能行为，而非仅有DOM命中 |
| 4 | 用户禁用或切站点 | 核对样式、监听、原语资源和数据均符合预期 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器存储和扩展资源；金额未知 | 权限核对、站点配置及数据备份 | 本轮未安装 |
| 持续使用 | DOM观察、存储及可选云同步 | 站点改版回归、管理本地插件 | 资源开销和节时未测 |
| 失败恢复 | 重新加载页面与数据副本 | 排查selector错位、禁用残留和导出完整性 | 跨站恢复成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多站复用 | JSON、语义适配和原语分层 | 真实改版后的兼容覆盖 |
| 禁用清理 | 共享属性层与scope回收设计 | 所有站点和原语的完整恢复 |
| 本地输入约束 | 限定declarative、站点与原语参数 | 全扩展隐私/安全与业务任务收益 |

> **思考**：声明式插件“不运行自带JS”只约束插件输入，不等于整个扩展无网络或聊天读取能力；原语代码和浏览器权限仍是信任根。语义selector有匹配也不证明匹配了正确消息，当前health把“有用户轮次且目标为0”标异常，不能检出所有错位。因此跨站复用收益依赖真实页面兼容和禁用后状态检查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把站点语义适配、内置能力原语和声明式插件分开，使同一JSON改动可在多个站点复用；副作用由宿主ledger集中回收，同一属性的多插件覆盖用有序层管理，避免禁用一个就破坏另一个。PluginScope明确借鉴Cordis并裁剪机制，不能将生命周期模式当全球原创。[Q02](#research-q02)

共享ledger避免独立插件各存原值的恢复冲突，异步startup与dispose barrier有可复用价值。需保留Cordis来源与副作用注册契约；零目标健康检测不能替代语义正确性验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

声明式插件“不运行自带JS”只约束插件输入，不等于整个扩展无网络或聊天读取能力；原语代码和浏览器权限仍是信任根。语义selector有匹配也不证明匹配了正确消息，当前health把“有用户轮次且目标为0”标异常，不能检出所有错位。因此跨站复用收益依赖真实页面兼容和禁用后状态检查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

跨多个AI网页重复整理聊天的用户可先在一个非敏感站点试用单项功能，备份数据后再导入简单JSON，并测试启停、同页多插件和页面刷新。只需偶尔复制内容时原生搜索、书签或导出更简单。若页面改版导致错位或禁用后仍有影响，应停止该项功能并保留页面和插件版本供核查。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查浏览器身份、声明式输入与回收机制；未安装扩展或验证多站兼容、数据隐私和实际收益；语义契约样本为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、manifest.json、src/features/plugins/local/validateLocalManifest.ts、src/features/plugins/runtime/declarativeEngine.ts、src/features/plugins/runtime/pluginScope.ts、src/features/plugins/runtime/domEffectLedger.ts、src/features/plugins/runtime/healthMonitor.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读manifest、本地JSON验证、engine与scope/DOM ledger/health；未全审站点、导出和云同步，不访问真实聊天或运行浏览器扩展。
- 下一步：安装前备份非敏感样本，在一个站点启停单插件，再测双插件属性叠加、DOM改版与导出完整性，记录恢复和资源。

**分析版本**

- **仓库**：[voyager-crew/voyager](https://github.com/voyager-crew/voyager)
- **版本号**：2.2.1（[固定提交 6fa19b4](https://github.com/voyager-crew/voyager/tree/6fa19b4ae51391fe95f909fcdaf11aaa252f2913)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为每个站点适配器加一组版本化语义契约样本，检查“命中正确对象”而不只“命中非空”，并与ledger恢复样本一起作为目录更新门槛。对多站点DOM改版和双插件重叠构造回归集，比较漏检、错位和恢复时间；若维护样本成本高于修复收益，或样本无法代表真实页面，则保持有限站点支持。[Q05](#research-q05)

安装前备份非敏感样本，在一个站点启停单插件，再测双插件属性叠加、DOM改版与导出完整性，记录恢复和资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1058 | 41697 | — | — | 463112 |
| .ts | source | 1374 | 209471 | 166317 | 25345 | — |
| .cjs | source | 6 | 1209 | 1025 | 53 | — |
| .ts | test | 1054 | 222769 | 191185 | 7425 | — |
| .mts | source | 1 | 207 | 79 | 131 | — |
| .js | source | 14 | 3228 | 2529 | 405 | — |
| .mjs | source | 7 | 705 | 575 | 43 | — |
| .js | test | 7 | 755 | 610 | 48 | — |
| .tsx | test | 70 | 16722 | 14803 | 366 | — |
| .tsx | source | 81 | 11767 | 10350 | 725 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Voyager跨站声明式扩展的组合机制、权限与正确性边界，以及能否形成可控试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 浏览器增强服务什么任务，是否是DSH插件？

**研究主题**：场景与需求

#### 完整回答

README将对象描述为跨Gemini、ChatGPT、Claude、DeepSeek等网页的组织、时间线、导出与公式复制扩展，同时提示库可用于包括localhost的其他页面。manifest是MV3浏览器扩展，声明storage、identity、scripting等权限与内容脚本，未见根dsh.bundle。因此它可增强DSH网页体验，但不等于DSH宿主插件。基线是网页原生功能、书签与脚本；验收需保证正确页面、数据和可禁用行为，而非按照支持站点数量判定价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-60](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/README.md#L52-L60)

作者三层设计和跨站定位

```text
## How it works

Voyager keeps three things apart.

- **Sites.** One small file per site says where things are on its page: the sidebar, a message, the composer.
- **Primitives.** Abilities Voyager ships once and runs anywhere: a timeline, folders, formula copy, diagrams, export.
- **Plugins.** Plain JSON that points primitives and CSS at those places. Nothing in a plugin runs as code, and every change it makes comes off when you turn it off.

So a site that redesigns its page needs one file fixed, and on ChatGPT, Claude, DeepSeek and Kimi that fix arrives from the plugin catalog without an extension update. A new site is one more file. And a plugin written once runs on every site it names.
```

**依据 2 · 作者声明**：[README.md:108-113](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/README.md#L108-L113)

提示库与云同步的作者能力范围

```text
On every site, and on any other site you add, `localhost` included:

- **[Prompt library](https://voyager.nagi.fun/en/guide/prompts)**: one library that follows you, here inside [DeepSeek Harness](https://voyager.nagi.fun/en/guide/deepseek-harness).
- **[Cloud sync](https://voyager.nagi.fun/en/guide/cloud-sync)**: folders and prompts through Google Drive, or iCloud on Safari.

Gemini also gets [Deep Research export](https://voyager.nagi.fun/en/guide/deep-research), [watermark-free images](https://voyager.nagi.fun/en/guide/nanobanana), [forks](https://voyager.nagi.fun/en/guide/fork), [context sync](https://voyager.nagi.fun/en/guide/context-sync), a [default model](https://voyager.nagi.fun/en/guide/default-model) and a [Markdown fix](https://voyager.nagi.fun/en/guide/markdown-fix). The full table, with every plugin, is on the [plugins page](https://voyager.nagi.fun/en/guide/plugins).
```

**依据 3 · 源码核查**：[manifest.json:1-5](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/manifest.json#L1-L5)

MV3身份

```text
{
  "manifest_version": 3,
  "default_locale": "en",
  "name": "__MSG_extName__",
  "description": "__MSG_extDescription__",
```

**依据 4 · 源码核查**：[manifest.json:28-49](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/manifest.json#L28-L49)

浏览器权限及可选站点访问

<details>
<summary>查看原文（22行）</summary>

```text
  "optional_permissions": ["notifications"],
  "oauth2": {
    "client_id": "462948120910-vvunu0k3b4vi37u23mqnh77mbgdjcg78.apps.googleusercontent.com",
    "scopes": ["https://www.googleapis.com/auth/drive.file"]
  },
  "host_permissions": [
    "https://gemini.google.com/*",
    "https://business.gemini.google/*",
    "https://aistudio.google.com/*",
    "https://aistudio.google.cn/*",
    "https://*.googleapis.com/*",
    "https://accounts.google.com/*",
    "https://*.googleusercontent.com/*",
    "https://lh3.google.com/*",
    "https://*.ggpht.com/*"
  ],
  "optional_host_permissions": ["https://chatgpt.com/*", "http://127.0.0.1/*", "<all_urls>"],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; worker-src 'self'"
  },
  "background": {
    "service_worker": "src/pages/background/index.ts",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义站点适配与回收如何支撑多插件组合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

本地输入先规范local命名空间，拒绝scripted层和不具体engine版本，再复用manifest校验、原语参数与站点策略检查。DeclarativeEngine把styles/domOps解释为DOM行为，PluginScope记录监听、观察器和异步startup disposer。DomEffectLedger为属性捕获初始值和插件有序覆盖层；撤一个插件时恢复仍活跃的最高层，最后一个撤销才还原初始值。相对独立userscript各存原值，这减少多个插件互相恢复错误的机制风险；作者明确scope借鉴Cordis，贡献在简化与浏览器多站组合。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/plugins/local/validateLocalManifest.ts:75-127](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/local/validateLocalManifest.ts#L75-L127)

具体engine、层、原语及站点检查

<details>
<summary>查看原文（53行）</summary>

```text
  const engine = typeof input.engine === 'string' ? input.engine.trim() : input.engine;
  if (engine === '>=next' || engine === 'next') {
    return {
      success: false,
      error: [
        {
          path: 'engine',
          message:
            'local plugins need a concrete engine version; replace ">=next" with ">=x.y.z" from the primitive reference',
        },
      ],
    };
  }
  const issues: ManifestIssue[] = [];
  let raw: Record<string, unknown> = input;
  if (typeof input.id === 'string' && input.id.trim() !== '') {
    const id = toLocalPluginId(input.id);
    if (id) {
      raw = { ...input, id };
    } else {
      issues.push({
        path: 'id',
        message: 'must be a lowercase reverse-dotted id (a-z, 0-9, ".", "_", "-"), up to 100 chars',
      });
    }
  }
  if (input.tier === 'scripted') {
    issues.push({ path: 'tier', message: 'local plugins must be declarative' });
  }

  const result = validateManifest(raw);
  if (!result.success) return { success: false, error: [...issues, ...result.error] };
  const manifest = result.data;

  issues.push(
    ...primitiveShippabilityIssues(manifest),
    ...primitiveParamIssues(manifest),
    ...primitiveSettingIssues(manifest),
  );
  const supported = sites.flatMap((site) => site.matches);
  manifest.matches.forEach((pattern, index) => {
    if (patternWithinAny(pattern, supported)) return;
    issues.push({
      path: `matches[${index}]`,
      message: `"${pattern}" is outside the sites plugins can target (${supported.join(', ')})`,
    });
  });
  if (options.hostPolicy !== 'defer') issues.push(...manifestHostPolicyIssues(manifest));
  issues.push(...localPluginRuleIssues(manifest, sites));

  return issues.length > 0
    ? { success: false, error: issues }
    : { success: true, data: { manifest, raw } };
```

</details>

**依据 2 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:1-23](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/pluginScope.ts#L1-L23)

生命周期ledger及Cordis来源

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * PluginScope — the side-effect ledger for builtin (native-function) plugins.
 *
 * Every side effect a plugin creates (listener, observer, DOM node, timer,
 * injected style, network task) is registered through this scope and paid back
 * automatically, in reverse registration order, when the scope is disposed.
 * Plugins never hand-write teardown pairs; the host owns the ledger.
 *
 * Design cribbed from cordis (`fiber.effect`) with three deliberate cuts:
 * no Context proxy, no service dependency graph, no event bus.
 *
 * Ledger semantics (each entry is claim-once):
 *  - An effect occupies its ledger slot at REGISTRATION time, even when its
 *    disposer arrives later from a Promise — so `dispose()` is a real barrier
 *    that awaits in-flight startup work, and teardown order always follows
 *    registration order, not settlement order.
 *  - Every entry is disposed exactly once, whether through the effect's own
 *    remover, `dispose()`, or a mid-flight cancellation — concurrent callers
 *    await the same settlement instead of re-running the disposer.
 *  - `signal` aborts when disposal begins; bind all cancellable work to it.
 *  - One failing disposer is logged and never blocks the rest.
 *  - Contract: a disposer must not await `scope.dispose()` (self-deadlock),
 *    and effects cannot be registered once disposal has begun.
```

</details>

**依据 3 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:35-89](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/domEffectLedger.ts#L35-L89)

类归属和属性覆盖层的实际实现

<details>
<summary>查看原文（55行）</summary>

```text
  addClass(id: string, el: Element, className: string): void {
    const perEl = mapGet(this.classOwners, el, () => new Map<string, Set<string>>());
    const owners = mapGet(perEl, className, () => new Set<string>());
    owners.add(id);
    // (Re)assert the class — also re-heals an SPA re-render that stripped it.
    if (!el.classList.contains(className)) el.classList.add(className);
  }

  setAttribute(id: string, el: Element, name: string, value: string): void {
    const perEl = mapGet(this.attrLayers, el, () => new Map<string, OverrideLayer>());
    const layer = mapGet(perEl, name, () => ({ original: el.getAttribute(name), stack: [] }));
    pushLayerValue(layer, id, value);
    el.setAttribute(name, topValue(layer));
  }

  setStyle(id: string, el: HTMLElement, prop: string, value: string, priority = ''): void {
    const ledger = mapGet(this.styleLayers, el, () => new InlineStyleLedger(el));
    ledger.set(id, [prop, value, priority], this.styles().properties(prop));
  }

  styles(): InlineStyleParser {
    this.styleParser ??= new InlineStyleParser(this.doc);
    return this.styleParser;
  }

  /** Remove every contribution of `id`, restoring the next-highest plugin's
   *  value (or the captured original when it was last). */
  release(id: string): void {
    for (const [el, perEl] of this.classOwners) {
      for (const [className, owners] of perEl) {
        if (owners.delete(id) && owners.size === 0) {
          el.classList.remove(className);
          perEl.delete(className);
        }
      }
      if (perEl.size === 0) this.classOwners.delete(el);
    }

    for (const [el, perEl] of this.attrLayers) {
      for (const [name, layer] of perEl) {
        if (!removeLayerValue(layer, id)) continue;
        if (layer.stack.length === 0) {
          if (layer.original === null) el.removeAttribute(name);
          else el.setAttribute(name, layer.original);
          perEl.delete(name);
        } else {
          el.setAttribute(name, topValue(layer));
        }
      }
      if (perEl.size === 0) this.attrLayers.delete(el);
    }

    for (const [el, ledger] of this.styleLayers) {
      if (ledger.release(id)) this.styleLayers.delete(el);
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · JSON约束和health标记是否足以保证正确与私密？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是插件数据不携带自定义JS，并经与目录相同的验证，缩小了用户生成JSON直接执行任意代码的空间。但扩展本身包含原生原语、内容脚本和云授权，浏览器manifest仍声明网络站点和身份权限，不能把局部数据约束扩大为整个程序不读取或传输聊天的证明。healthMonitor主要判断有用户轮次时sample.targets是否为0；错误selector命中非空错误元素并不满足此异常条件。ledger也只说明其登记的副作用回收，未检查的原语不能自动继承完整恢复保证。未运行页面，不把风险当已复现错误。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/plugins/local/validateLocalManifest.ts:1-31](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/local/validateLocalManifest.ts#L1-L31)

本地插件约束的范围

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * The one gate every user-imported plugin passes, on import and again on every
 * read by `LocalPluginSource`.
 *
 * It is the remote catalog's gate plus local-only rules, never a weaker one:
 *   - `validateManifest` with its CSS and rendered-sink guards, exactly as a
 *     remote catalog entry gets it;
 *   - the id is forced into the `local.*` namespace;
 *   - `tier` must be `declarative` (no plugin-supplied JS, ever);
 *   - every `native` op names a primitive this build ships, with params that
 *     match its published spec, and `engine` admits no build older than it
 *     (the same rule `plugin:check` applies to official plugins);
 *   - every match pattern stays inside a site Voyager already supports: a
 *     plugin platform (the D18 rule official plugins follow) or a native
 *     surface (Gemini, AI Studio), so enabling a local plugin can only ask for
 *     host access Voyager already has or an official plugin could ask for;
 *   - the packaged host policy (`manifestHostPolicyIssues`), checked for each
 *     native surface the patterns reach: no `theme` there (Gemini and AI Studio
 *     keep Voyager's own accent; the popup's accent picker changes it), and a
 *     `native` op only for a public primitive explicitly listed in an owner
 *     entry's handlers (`featureOwners.ts`). Fixed-id builtins may own a
 *     feature without opening a public primitive.
 *     Import, paste and the CLI enforce this; reading already stored plugins
 *     passes `hostPolicy: 'defer'` instead, so
 *     a build that closes a primitive again (a rolled-back owner entry)
 *     keeps the user's plugin listed and `PluginHost` reports it as
 *     `blocked: host-policy` by the page's real host. Defer skips only this
 *     site policy, never the CSS, DOM, params, namespace or other checks;
 *   - the local-only rules in `localPluginRules.ts`: `gv-` classes, semantic
 *     keys and `site.json` sections every targeted site declares, settings the
 *     popup can render, and no `folders` on Gemini or AI Studio.
```

</details>

**依据 2 · 源码核查**：[manifest.json:28-49](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/manifest.json#L28-L49)

全扩展权限边界不同于JSON输入

<details>
<summary>查看原文（22行）</summary>

```text
  "optional_permissions": ["notifications"],
  "oauth2": {
    "client_id": "462948120910-vvunu0k3b4vi37u23mqnh77mbgdjcg78.apps.googleusercontent.com",
    "scopes": ["https://www.googleapis.com/auth/drive.file"]
  },
  "host_permissions": [
    "https://gemini.google.com/*",
    "https://business.gemini.google/*",
    "https://aistudio.google.com/*",
    "https://aistudio.google.cn/*",
    "https://*.googleapis.com/*",
    "https://accounts.google.com/*",
    "https://*.googleusercontent.com/*",
    "https://lh3.google.com/*",
    "https://*.ggpht.com/*"
  ],
  "optional_host_permissions": ["https://chatgpt.com/*", "http://127.0.0.1/*", "<all_urls>"],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; worker-src 'self'"
  },
  "background": {
    "service_worker": "src/pages/background/index.ts",
```

</details>

**依据 3 · 源码核查**：[src/features/plugins/runtime/healthMonitor.ts:112-130](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/healthMonitor.ts#L112-L130)

noEffect只检测零目标

<details>
<summary>查看原文（19行）</summary>

```text
  /** Evaluate every tracked plugin now (tests, and the quiet/deadline timers). */
  evaluateNow(): void {
    if (this.disposed || this.tracked.size === 0) return;
    this.clearDeadline();
    const userTurns = this.countUserTurns();
    for (const [id, entry] of this.tracked) {
      let sample = EMPTY_SAMPLE;
      try {
        sample = entry.sample();
      } catch {
        // A throwing sample reports nothing.
      }
      const noEffect = userTurns > 0 && sample.targets === 0;
      const zeroOps = missingOps(sample.ops, userTurns);
      if (entry.noEffect !== noEffect || !sameIndexes(entry.zeroOps, zeroOps)) {
        entry.noEffect = noEffect;
        entry.zeroOps = zeroOps;
        this.onChange?.(id, noEffect, zeroOps);
      }
```

</details>

**依据 4 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:12-23](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/pluginScope.ts#L12-L23)

回收依赖所有效果按契约注册

<details>
<summary>查看原文（12行）</summary>

```text
 * Ledger semantics (each entry is claim-once):
 *  - An effect occupies its ledger slot at REGISTRATION time, even when its
 *    disposer arrives later from a Promise — so `dispose()` is a real barrier
 *    that awaits in-flight startup work, and teardown order always follows
 *    registration order, not settlement order.
 *  - Every entry is disposed exactly once, whether through the effect's own
 *    remover, `dispose()`, or a mid-flight cancellation — concurrent callers
 *    await the same settlement instead of re-running the disposer.
 *  - `signal` aborts when disposal begins; bind all cancellable work to it.
 *  - One failing disposer is logged and never blocks the rest.
 *  - Contract: a disposer must not await `scope.dispose()` (self-deadlock),
 *    and effects cannot be registered once disposal has begun.
```

</details>

#### 缺口

- 未对实际站点页面与所有原语做正确命中和禁用复核
  **影响**：不能宣称所有站点兼容或全扩展隐私安全
  **进一步探讨**：在非敏感会话逐项核对语义目标、输出与禁用后DOM/监听状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 站点变化、权限和插件维护成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

浏览器安装、站点授权和正确语义适配是基础；本地插件只能使用当前build已发运原语，并受具体engine约束。扩展目录可更新站点适配，降低必须发新扩展包的部分负担，但没有消除对页面结构的依赖。用户首次需核对权限与备份数据，日常需回归常用功能和管理可选云同步，失败需排查selector及导出完整性。一次JSON通过不等于端到端通过，成本应按一次正确组织/导出任务分摊，时间和费用未知。详见[成本与效果](#cost-and-value)及[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-60](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/README.md#L54-L60)

作者说明站点适配可独立更新

```text
Voyager keeps three things apart.

- **Sites.** One small file per site says where things are on its page: the sidebar, a message, the composer.
- **Primitives.** Abilities Voyager ships once and runs anywhere: a timeline, folders, formula copy, diagrams, export.
- **Plugins.** Plain JSON that points primitives and CSS at those places. Nothing in a plugin runs as code, and every change it makes comes off when you turn it off.

So a site that redesigns its page needs one file fixed, and on ChatGPT, Claude, DeepSeek and Kimi that fix arrives from the plugin catalog without an extension update. A new site is one more file. And a plugin written once runs on every site it names.
```

**依据 2 · 源码核查**：[src/features/plugins/local/validateLocalManifest.ts:109-123](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/local/validateLocalManifest.ts#L109-L123)

原语、站点和host policy界限

<details>
<summary>查看原文（15行）</summary>

```text
  issues.push(
    ...primitiveShippabilityIssues(manifest),
    ...primitiveParamIssues(manifest),
    ...primitiveSettingIssues(manifest),
  );
  const supported = sites.flatMap((site) => site.matches);
  manifest.matches.forEach((pattern, index) => {
    if (patternWithinAny(pattern, supported)) return;
    issues.push({
      path: `matches[${index}]`,
      message: `"${pattern}" is outside the sites plugins can target (${supported.join(', ')})`,
    });
  });
  if (options.hostPolicy !== 'defer') issues.push(...manifestHostPolicyIssues(manifest));
  issues.push(...localPluginRuleIssues(manifest, sites));
```

</details>

**依据 3 · 源码核查**：[manifest.json:28-49](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/manifest.json#L28-L49)

实际权限依赖

<details>
<summary>查看原文（22行）</summary>

```text
  "optional_permissions": ["notifications"],
  "oauth2": {
    "client_id": "462948120910-vvunu0k3b4vi37u23mqnh77mbgdjcg78.apps.googleusercontent.com",
    "scopes": ["https://www.googleapis.com/auth/drive.file"]
  },
  "host_permissions": [
    "https://gemini.google.com/*",
    "https://business.gemini.google/*",
    "https://aistudio.google.com/*",
    "https://aistudio.google.cn/*",
    "https://*.googleapis.com/*",
    "https://accounts.google.com/*",
    "https://*.googleusercontent.com/*",
    "https://lh3.google.com/*",
    "https://*.ggpht.com/*"
  ],
  "optional_host_permissions": ["https://chatgpt.com/*", "http://127.0.0.1/*", "<all_urls>"],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; worker-src 'self'"
  },
  "background": {
    "service_worker": "src/pages/background/index.ts",
```

</details>

#### 缺口

- 没有多站改版、浏览器资源和人工维护样本
  **影响**：不能量化节约或目录更新的长期维护收益
  **进一步探讨**：记录同一任务在原生网页和扩展上的完成质量、权限步骤、修复时间及开销

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 语义契约样本能改进错位检测吗，谁先试？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由零命中健康检测的盲区推导“正确对象”样本，不必引入模型判断：可用已授权匿名DOM fixture标注消息、侧栏和composer对象，并验证同名语义在页面变体中仍正确。再构造两个插件改同一属性、异步启动时禁用等恢复样本，检查ledger的预期。以固定DOM改版集比较旧health与样本门禁的漏检和维护时间；高成本、低代表性或只改善测试而不改善实际页面时停止扩展。跨站高频用户可先在单站、单功能、非敏感内容和备份条件下试用，普通用户不必为插件数量采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/plugins/runtime/healthMonitor.ts:112-130](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/healthMonitor.ts#L112-L130)

零目标检测提供具体改进缺口

<details>
<summary>查看原文（19行）</summary>

```text
  /** Evaluate every tracked plugin now (tests, and the quiet/deadline timers). */
  evaluateNow(): void {
    if (this.disposed || this.tracked.size === 0) return;
    this.clearDeadline();
    const userTurns = this.countUserTurns();
    for (const [id, entry] of this.tracked) {
      let sample = EMPTY_SAMPLE;
      try {
        sample = entry.sample();
      } catch {
        // A throwing sample reports nothing.
      }
      const noEffect = userTurns > 0 && sample.targets === 0;
      const zeroOps = missingOps(sample.ops, userTurns);
      if (entry.noEffect !== noEffect || !sameIndexes(entry.zeroOps, zeroOps)) {
        entry.noEffect = noEffect;
        entry.zeroOps = zeroOps;
        this.onChange?.(id, noEffect, zeroOps);
      }
```

</details>

**依据 2 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:60-89](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/domEffectLedger.ts#L60-L89)

叠加恢复应纳入契约测试

<details>
<summary>查看原文（30行）</summary>

```text
  /** Remove every contribution of `id`, restoring the next-highest plugin's
   *  value (or the captured original when it was last). */
  release(id: string): void {
    for (const [el, perEl] of this.classOwners) {
      for (const [className, owners] of perEl) {
        if (owners.delete(id) && owners.size === 0) {
          el.classList.remove(className);
          perEl.delete(className);
        }
      }
      if (perEl.size === 0) this.classOwners.delete(el);
    }

    for (const [el, perEl] of this.attrLayers) {
      for (const [name, layer] of perEl) {
        if (!removeLayerValue(layer, id)) continue;
        if (layer.stack.length === 0) {
          if (layer.original === null) el.removeAttribute(name);
          else el.setAttribute(name, layer.original);
          perEl.delete(name);
        } else {
          el.setAttribute(name, topValue(layer));
        }
      }
      if (perEl.size === 0) this.attrLayers.delete(el);
    }

    for (const [el, ledger] of this.styleLayers) {
      if (ledger.release(id)) this.styleLayers.delete(el);
    }
```

</details>

**依据 3 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:12-23](https://github.com/voyager-crew/voyager/blob/6fa19b4ae51391fe95f909fcdaf11aaa252f2913/src/features/plugins/runtime/pluginScope.ts#L12-L23)

异步startup与回收契约

<details>
<summary>查看原文（12行）</summary>

```text
 * Ledger semantics (each entry is claim-once):
 *  - An effect occupies its ledger slot at REGISTRATION time, even when its
 *    disposer arrives later from a Promise — so `dispose()` is a real barrier
 *    that awaits in-flight startup work, and teardown order always follows
 *    registration order, not settlement order.
 *  - Every entry is disposed exactly once, whether through the effect's own
 *    remover, `dispose()`, or a mid-flight cancellation — concurrent callers
 *    await the same settlement instead of re-running the disposer.
 *  - `signal` aborts when disposal begins; bind all cancellable work to it.
 *  - One failing disposer is logged and never blocks the rest.
 *  - Contract: a disposer must not await `scope.dispose()` (self-deadlock),
 *    and effects cannot be registered once disposal has begun.
```

</details>

#### 缺口

- 契约样本的代表性与维护收益未验证
  **影响**：新假设不能算当前站点兼容能力
  **进一步探讨**：收集真实改版片段并与用户任务结果配对，控制样本维护负担

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
