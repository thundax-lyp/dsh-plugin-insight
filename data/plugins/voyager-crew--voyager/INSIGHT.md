# Voyager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[27aced8](https://github.com/voyager-crew/voyager/tree/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5)

<!-- BEGIN META -->
[![GitHub ★ 20,482](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C482&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/voyager-crew/voyager) [![npm 30d 1,630](https://img.shields.io/static/v1?label=npm+30d&message=1%2C630&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager) [![最新发布 2015-02-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2015-02-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager)
<!-- END META -->

> **功能**：为聊天网页集成阅读、组织和导出，并通过受限本地声明、目标守卫与生命周期账本管理页面增强功能。

> **亮点**：受限声明与第一方原语、生命周期清理、独占资源后继等待和选择器语义保护组合，降低散脚本的管理摩擦，效果仍需实际样本，见 [Q02](#research-q02)。

> **主要限制**：健康计数不是任务正确；属性原值与class owner机制不同，同名已有gv-类可被最终释放移除，不能宣称全保真；云/广域权限另核，见 [Q03](#research-q03)。

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
  - [Q01 · 用户获得什么，浏览器入口到可见结果是否接通？](#detail-section-11)
  - [Q02 · 本地声明如何进入Host，声明/释放边界在哪里？](#detail-section-12)
  - [Q03 · 可逆DOM、语义保护和健康状态分别能证明什么？](#detail-section-13)
  - [Q04 · 怎样以有限风险试用并计算四阶段成本？](#detail-section-14)
  - [Q05 · 未来方向必须比现有guard/测试/释放协议多什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：聊天网页用户整理/阅读/导出对话；本轮核本地声明与代表JSON导出链，见 [Q01](#research-q01)。

原生网页、书签/手工复制/原生导出与用户脚本；跨站功能整合和效果所有权是增量，不是新模型或自主Agent。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 阅读/组织/导出 | 聊天网页资料处理 | 本轮仅代表JSON链，不外推全格式 |
| 本地声明 | 调受限DOM/第一方原语 | 校验入库默认关闭，非任意JS |
| 目标/健康 | 已迁移语义守卫与零命中提示 | 不代表全目标/结果正确 |
| 释放/恢复 | 登记效果/资源后继协调 | 原类及清理错误有边界 |
| 云同步 | 可选远端副本 | 授权/身份/删除另验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持的浏览器/正确扩展成品 | 必需 | MV3客户端 | 源码不证明各商店成品一致 |
| 当前网页/站点adapter/获授权限 | 按页面 | 定位目标与动态注入 | 不满足不挂载，页面改变需复核 |
| 本地声明/具体引擎/受限原语 | 自定义时 | 无任意JS的配置扩展 | 校验拒绝或运行条件阻断 |
| 受管scope/效果账本 | 相关功能 | 清理和后继资源等待 | 未登记或失败清理不兜底 |
| 聊天账号/Drive等 | 部分功能 | 上游聊天/可选云同步 | 额外权限/费用/远端副本另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 首次 | 用户备份后按页授权 | 获授范围/正确成品明确 |
| 配置 | UI导入本地声明后手动启用 | 先校验，坏更新不静默替代 |
| 活动 | Host仲裁后原语/DOM或导出 | 核目标及内容，不能只看mounted |
| 停用 | scope/账本释放并待资源空闲 | 原态/监听器与挂起状态另验 |
| 退出 | 保存本地资料、撤权卸载重载 | 云与下载副本另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器/构建、上游账号未知 | 安装/授权/备份/样本核查 | 商店成品未运行 |
| 持续使用 | DOM观察/本地数据/可选云未知 | 站点兼容/声明版本/结果复核 | 净节时未测 |
| 失败恢复 | 部分文件/云副本/挂起未知 | 关功能/重载/核原文与已有对象 | 不以健康或成功提示判完成 |
| 退出 | 本地资料/云/下载留存未知 | 导出备份/撤权/卸载与云单独处理 | 未核自动删除闭环 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 日常整理导出 | 工具栏/对话框到JSON下载调用 | 内容完整/磁盘成功/节时 |
| 配置扩展 | 校验/禁用导入/受限原语 | 所有输入与站点可靠 |
| 可恢复运行 | scope/资源等待/属性叠层 | 已有类/外部副作用全恢复 |
| 目标保护 | 已迁移语义键守卫/零命中 | 全键正确和业务结果验收 |

> **思考**：健康计数不是任务正确；属性原值与class owner机制不同，同名已有gv-类可被最终释放移除，不能宣称全保真；云/广域权限另核，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：受限声明与第一方原语、生命周期清理、独占资源后继等待和选择器语义保护组合，降低散脚本的管理摩擦，效果仍需实际样本，见 [Q02](#research-q02)。

[Q02](#research-q02) 的效果所有权、异步释放与后继等待值得借鉴；[Q03](#research-q03) 分类型原值及语义覆盖的反例应成为验收条件。

<a id="detail-section-5"></a>

### 1.4 主要限制

健康计数不是任务正确；属性原值与class owner机制不同，同名已有gv-类可被最终释放移除，不能宣称全保真；云/广域权限另核，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

从非敏感小对话和少量功能开始，权限/正文/开关恢复不符即关功能并回原生流程，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的本地导入/Host/DOM/代表JSON下载活动链可核；未装扩展、未核商店成品或全站点/云。建议小范围按需试用。

- 已检查：作者 README、包清单、源码路径 manifest.json、package.json、src/core/selectors/semanticSnapshot.ts、src/features/export/services/ConversationExportService.ts、src/features/plugins/builtin/index.ts、src/features/plugins/local/LocalPluginSource.ts、src/features/plugins/local/localPluginImport.ts、src/features/plugins/local/localPluginRules.ts、src/features/plugins/local/localPluginStore.ts、src/features/plugins/local/validateLocalManifest.ts、src/features/plugins/runtime/PluginHost.ts、src/features/plugins/runtime/declarativeEngine.ts、src/features/plugins/runtime/domEffectLedger.ts、src/features/plugins/runtime/healthMonitor.ts、src/features/plugins/runtime/hostEngine.ts、src/features/plugins/runtime/mountedSettings.ts、src/features/plugins/runtime/pluginScope.ts、src/features/plugins/runtime/primitiveLifecycle.ts、src/features/plugins/runtime/releaseLedger.ts、src/features/plugins/runtime/targetedOps.ts、src/features/plugins/verbs/conversationExport/index.ts、src/features/plugins/verbs/registry.ts、src/pages/background/cloudSyncMessages.ts、src/pages/background/siteAccessRegistration.ts、src/pages/content/export/exportRun.ts、src/pages/content/export/index.ts、src/pages/content/export/pendingExportState.ts、src/pages/content/index.tsx、src/pages/popup/components/LocalPluginsPanel.tsx、src/pages/popup/components/PluginSiteSettings.tsx、src/pages/popup/hooks/useLocalPlugins.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已核固定材料身份/四摘要；读MV3和后台按权限动态注册、内容Host、弹窗导入到存储与运行、代表原语/JSON下载、语义adapter、DOM/scope/释放/健康。未装目标、跑作者测试，未穷审所有原语/站点/格式、账户隔离/云或商店包；下载动作不等文件落盘验收。
- 下一步：固定小对话核原文与JSON，固定DOM核原类/重叠顺序/迟到与抛错释放、语义错目标，另用测试账户核云与撤权/退出。

**分析版本**

- **仓库**：[voyager-crew/voyager](https://github.com/voyager-crew/voyager)
- **版本号**：2.2.1（[固定提交 27aced8](https://github.com/voyager-crew/voyager/tree/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

相对现有guard/释放增加原有class状态保留，并对固定对话任务记录内容/目标与开关恢复差异，比较错误和总维护成本，见 [Q05](#research-q05)。

固定小对话核原文与JSON，固定DOM核原类/重叠顺序/迟到与抛错释放、语义错目标，另用测试账户核云与撤权/退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1088 | 43253 | — | — | 488760 |
| .ts | source | 1603 | 226267 | 181583 | 26060 | — |
| .cjs | source | 6 | 1209 | 1025 | 53 | — |
| .ts | test | 1309 | 256166 | 221582 | 8095 | — |
| .mts | source | 1 | 207 | 79 | 131 | — |
| .js | source | 14 | 3228 | 2529 | 405 | — |
| .mjs | source | 16 | 1673 | 1466 | 63 | — |
| .js | test | 11 | 1501 | 1293 | 62 | — |
| .tsx | test | 76 | 17319 | 15311 | 373 | — |
| .tsx | source | 83 | 11891 | 10470 | 719 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器增强与本地声明插件的当前活动链能否支持正确任务结果及可恢复退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户获得什么，浏览器入口到可见结果是否接通？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Voyager是聊天网页增强浏览器客户端，不是DSH插件、模型或自主Agent。根包2.2.1不等商店所有浏览器发行版统一版本。面向经常整理/阅读/导出AI对话的用户，集成提示词、阅读、组织和导出；本轮核本地声明插件与代表对话导出，未全验每项站点功能。原生网页、书签/复制和用户脚本是对照，跨站统一开关与清理是工程增量，不能把功能数直接换成生产率。

MV3 manifest声明popup、内容脚本和后台。内容脚本启动PluginHost并注册退出清理；扩展站点由后台按已启插件与实际获授origin注册/注入，不是只有manifest静态Gemini列表，也不代表默认获全部站点权限。当前导出内建manifest选conversationExport原语，原语目录经eager glob进注册表，primitiveLifecycle取实现验证参数并activate；它启动createExportEntrypoint，挂工具栏并以点击打开导出对话框，runner把对话交给实际导出服务，JSON分支生成Blob/下载链接并click。这是会发起文件下载的活动链，不是已确认文件落盘、对话抽取完整或排版正确；PDF/图片等分支未逐一验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/package.json#L1-L5)

对象身份和包版本。

```text
{
  "name": "voyager",
  "version": "2.2.1",
  "description": "A better workspace for Gemini, Claude, ChatGPT, and DeepSeek: prompts, reading tools, organization, export, and more.",
  "packageManager": "bun@1.3.12",
```

**依据 2 · 源码核查**：[manifest.json:27-60](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/manifest.json#L27-L60)

权限与实际内容/后台入口。

<details>
<summary>查看原文（34行）</summary>

```text
  "permissions": ["storage", "identity", "scripting", "alarms", "activeTab"],
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
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": [
        "https://gemini.google.com/*",
        "https://business.gemini.google/*",
        "https://aistudio.google.com/*",
        "https://aistudio.google.cn/*"
      ],
      "js": ["src/pages/content/index.tsx"],
```

</details>

**依据 3 · 源码核查**：[src/pages/content/index.tsx:325-343](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/content/index.tsx#L325-L343)

真实Host启动和退出注册。

<details>
<summary>查看原文（19行）</summary>

```text
    const selectorStartup = startPageSelectors({
      url: location.href,
      doc: document,
      lifetime: pageLifetime.signal,
    });
    cleanupManager.registerCleanupFunction(
      selectorStartup.stop,
      CleanupPositions.CleanupPageSelectors,
    );
    selectorCurrent = selectorStartup.isCurrent;
    selectorsReady = selectorStartup.ready;
    cleanupManager.registerCleanupFunction(
      startPluginHost({
        admission: officialAdmission,
        initialAdapter: selectorStartup.initialAdapter,
        legacySettings: selectorStartup.legacySettings,
      }),
      CleanupPositions.CleanupPluginHost,
    );
```

</details>

**依据 4 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:300-326](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/background/siteAccessRegistration.ts#L300-L326)

按启用插件/已获授权限确定站点。

<details>
<summary>查看原文（27行）</summary>

```text
  async function doSyncPluginContentScripts(): Promise<void> {
    if (!chrome.scripting?.registerContentScripts) return;

    const enabledPlugins = await loadEnabledPlugins(loadPluginCatalog);
    // Own registration call and failure path: the guard never blocks the plugin host.
    await syncShadowKeyGuardRegistration({
      scripting: chrome.scripting,
      manifest: chrome.runtime.getManifest(),
      enabledPlugins,
      filterGranted: filterGrantedOrigins,
      toResource: isFirefox() ? toRelativeExtensionPath : (path) => path,
    });

    const manifestContentScript = chrome.runtime.getManifest().content_scripts?.[0];
    if (!manifestContentScript) return;

    const grantedMatches = await filterGrantedOrigins(pluginsToOriginPatterns(enabledPlugins));

    await unregisterRegisteredContentScripts(chrome.scripting, [
      PLUGIN_CONTENT_SCRIPT_ID,
      PLUGIN_EMBEDDED_CONTENT_SCRIPT_ID,
      CLAUDE_USAGE_MAIN_SCRIPT_ID,
      CHATGPT_PRO_USAGE_MAIN_SCRIPT_ID,
      BRIDGE_ACCOUNT_MAIN_SCRIPT_ID,
    ]);

    if (!grantedMatches.length) return;
```

</details>

**依据 5 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:383-388](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/background/siteAccessRegistration.ts#L383-L388)

真实注册与向已开页注入。

```text
      if (registrations.length) {
        await chrome.scripting.registerContentScripts(registrations);
      }
      // Inject into already-open matching tabs so the user sees the effect without
      // a manual reload.
      await injectVoyagerScriptIntoOpenTabs(topFrameOrigins, undefined, jsResources, cssResources);
```

**依据 6 · 源码核查**：[src/features/plugins/builtin/index.ts:250-263](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/builtin/index.ts#L250-L263)

导出manifest调用具体原语。

<details>
<summary>查看原文（14行）</summary>

```text
      },
    },
    author: 'voyager-official',
    category: 'productivity',
    license: 'GPL-3.0-or-later',
    // The primitive's own floor: the release stamp of its contract stamps this builtin too.
    engine: `>=${conversationExportContract.sinceEngine}`,
    tier: 'declarative',
    matches: ['https://chatgpt.com/*', 'https://chat.openai.com/*'],
    requires: { formFactors: ['desktop', 'mobile'] },
    // The primitive mounts ChatGPT's packaged reader (`exportSiteFor`), not the catalog one.
    contributes: { domOps: [{ op: 'native', handler: 'conversationExport', params: {} }] },
  },
  {
```

</details>

**依据 7 · 源码核查**：[src/features/plugins/verbs/registry.ts:60-66](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/verbs/registry.ts#L60-L66)

实际glob加载和查询实现。

```text
const DISCOVERED = discoverPrimitives(
  import.meta.glob<Readonly<Record<string, unknown>>>('./*/index.ts', { eager: true }),
);
const PRIMITIVES = DISCOVERED.primitives;

export function getPrimitive(name: string): Primitive<never> | undefined {
  return PRIMITIVES.get(name);
```

**依据 8 · 源码核查**：[src/features/plugins/runtime/primitiveLifecycle.ts:74-101](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/primitiveLifecycle.ts#L74-L101)

取实现/验证/activate。

<details>
<summary>查看原文（28行）</summary>

```text
  for (const op of ops) {
    const primitive = getPrimitive(op.handler);
    if (!primitive) {
      logger.warn('Unknown primitive', { id: entry.manifest.id, handler: op.handler });
      continue;
    }
    const rendered = renderNativeParams(op.params, entry.manifest.contributes.settings, settings);
    const params = rendered.success ? primitive.validateParams(rendered.data) : rendered;
    if (!params.success) {
      logger.warn('Invalid primitive params', {
        id: entry.manifest.id,
        handler: op.handler,
        issues: params.error,
      });
      continue;
    }
    try {
      const result = primitive.activate(scope, params.data, context);
      entry.primitiveActivations += 1;
      const adopt = (handle: void | PrimitiveHandle): void => {
        if (handle && entry.primitiveScope === scope) entry.primitiveHandles.push(handle);
      };
      if (result instanceof Promise) {
        result.then(adopt).catch((error) => {
          logger.error('Primitive activation failed', {
            id: entry.manifest.id,
            handler: op.handler,
            error: String(error),
```

</details>

**依据 9 · 源码核查**：[src/features/plugins/verbs/conversationExport/index.ts:20-49](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/verbs/conversationExport/index.ts#L20-L49)

原语到真实导出入口。

<details>
<summary>查看原文（30行）</summary>

```text
  activate(scope, _params, context) {
    context.setTargetCounter(
      () => context.doc.querySelectorAll('[data-gv-component="persistent-export-toolbar"]').length,
    );
    const exportSite = context.adapter ? exportSiteFor(context.adapter) : null;
    if (!exportSite) return;
    const { entryPoints } = exportSite;
    // Installed before the async mount: until the toolbar exists the popup hears "no conversation".
    const stopOpenListener =
      entryPoints.kind === 'toolbar' && entryPoints.opensFromPopup
        ? scope.effect(() => {
            const stop = startChatGptExportOpenListener(openPersistentExportToolbar);
            // dispose() aborts first but awaits the mount before this effect: go silent at the abort.
            scope.signal.addEventListener('abort', stop, { once: true });
            return () => {
              scope.signal.removeEventListener('abort', stop);
              stop();
            };
          }, 'conversation-export-popup-open')
        : null;
    const start = createExportEntrypoint(exportSite);
    scope.effect(
      () =>
        start({ signal: scope.signal }).catch((error: unknown) => {
          // Nothing mounted, so the popup reports the exporter unreachable, not an empty page.
          void stopOpenListener?.();
          throw error;
        }),
      'conversation-export',
    );
```

</details>

**依据 10 · 源码核查**：[src/pages/content/export/index.ts:38-80](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/content/export/index.ts#L38-L80)

创建runner和工具栏点击。

<details>
<summary>查看原文（43行）</summary>

```text
export function createExportEntrypoint(exportSite: ExportSite) {
  const exportRunner = createExportRunner({ site: exportSite });

  let activeExportDialog: ExportDialog | null = null;
  // A run cut by Gemini's preload reload resumes on the first mount of the page
  // only: a remount (the plugin switched off and on) must not restart a run the
  // switch abandoned.
  let pendingRunChecked = false;

  /**
   * Mount the export entry point for the current platform.
   *
   * The returned cleanup is platform-agnostic: the official plugin that owns
   * export on this host (ChatGPT's, Gemini's) calls it when it unmounts, and it
   * also ends the active run. Gemini's resume of a reloaded run starts here.
   */
  async function startExportButton(options: { signal?: AbortSignal } = {}): Promise<() => void> {
    // A mount aborted before it finished owns nothing; its late cleanup must not
    // touch the runner, which a newer mount may already be using.
    const noCleanup = () => {};
    if (options.signal?.aborted) return noCleanup;
    // Check for pending export immediately; the mount's abort ends the resumed run.
    if (exportSite.history && !pendingRunChecked) {
      pendingRunChecked = true;
      void exportRunner.resumePending(options.signal);
    }

    let lang = await readExportLanguage();
    if (options.signal?.aborted) return noCleanup;
    const dict = await loadExportDictionaries(lang);
    if (options.signal?.aborted) return noCleanup;
    const entryPoints = exportSite.entryPoints;

    if (entryPoints.kind === 'toolbar') {
      let toolbarHandle: ReturnType<typeof mountPersistentExportToolbar> | null = null;
      const mountToolbar = () => {
        const [label, tooltip] = entryPointTexts(dict, lang);
        toolbarHandle = mountPersistentExportToolbar({
          label,
          tooltip,
          onClick: () => void showExportDialog(dict, lang, { signal: options.signal }),
          siteId: exportSite.id,
          turnSelector: entryPoints.turnSelector,
```

</details>

**依据 11 · 源码核查**：[src/pages/content/export/exportRun.ts:428-443](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/content/export/exportRun.ts#L428-L443)

实际导出/成功失败处理。

<details>
<summary>查看原文（16行）</summary>

```text
        hideProgress = showExportProgress(exportingProgressText(t)).hide;
        const resultPromise = exportPendingConversation(
          state,
          turnsForExport,
          metadata,
          includeImageSource,
          signal,
        );
        const minVisiblePromise = new Promise((resolve) => setTimeout(resolve, 420));
        const [result] = await Promise.all([resultPromise, minVisiblePromise]);
        throwIfExportCancelled(signal);

        if (!result.success) {
          showExportAlert(resolveExportErrorMessage(result.error, t), t);
        } else {
          reportFinishedExport(result, state.format, t);
```

</details>

**依据 12 · 源码核查**：[src/pages/content/export/pendingExportState.ts:149-164](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/content/export/pendingExportState.ts#L149-L164)

转真实服务。

<details>
<summary>查看原文（16行）</summary>

```text
export function exportPendingConversation(
  state: PendingExportState,
  turns: ChatTurn[],
  metadata: ConversationMetadata,
  includeImageSource: boolean,
  signal?: AbortSignal,
) {
  return ConversationExportService.export(turns, metadata, {
    format: state.format,
    fontSize: state.fontSize,
    includeImageSource,
    imageWidth: state.imageWidth,
    usePromptAsTurnHeading: state.usePromptAsTurnHeading,
    speakerLabels: state.speakerLabels,
    signal,
  });
```

</details>

**依据 13 · 源码核查**：[src/features/export/services/ConversationExportService.ts:56-81](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/export/services/ConversationExportService.ts#L56-L81)

分格式执行而非只声明。

<details>
<summary>查看原文（26行）</summary>

```text
      switch (conversationOptions.format) {
        case 'json':
          return this.exportJSON(turns, metadata, conversationOptions);

        case 'markdown':
          return await this.exportMarkdown(turns, metadata, conversationOptions);

        case 'pdf':
          return await this.exportPDF(turns, metadata, conversationOptions);

        case 'image':
          return await this.exportImage(turns, metadata, conversationOptions);

        default:
          return {
            success: false,
            format: options.format,
            error: `Unsupported format: ${options.format}`,
          };
      }
    } catch (error) {
      return {
        success: false,
        format: options.format,
        error: this.normalizeError(error),
      };
```

</details>

**依据 14 · 源码核查**：[src/features/export/services/ConversationExportService.ts:158-164](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/export/services/ConversationExportService.ts#L158-L164)

JSON执行。

```text
    const filename =
      options.filename || this.generateFilename('json', metadata.title, metadata.platform);
    this.assertNotAborted(options.signal);
    this.downloadJSON(payload, filename);

    return {
      success: true,
```

**依据 15 · 源码核查**：[src/features/export/services/ConversationExportService.ts:489-504](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/export/services/ConversationExportService.ts#L489-L504)

Blob下载动作，不是磁盘提交确认。

<details>
<summary>查看原文（16行）</summary>

```text
  private static downloadJSON(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {
        /* ignore */
      }
```

</details>

#### 缺口

- 未装扩展、跑真实页面或核商店成品及各格式结果。
  **影响**：不能承诺跨站均可用、成功通知等于完整导出，或实际时间收益。
  **进一步探讨**：已知内容小对话对照网页原文和文件，核各目标站点/浏览器/权限与导出失败状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地声明如何进入Host，声明/释放边界在哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

弹窗设置组件实际挂LocalPluginsPanel，文件/粘贴动作经useLocalPlugins调importLocalPluginFiles/importLocalPlugin；后者校manifest才installDisabled，存储使用local命名空间并在一写中记录和关闭开关，复核时安装身份变化会拒绝。读取LocalPluginSource再次验证，Host订阅本地变化、串行重载，reconcile只为许可和资源仲裁获准项目调用mountOrUpdate→engine.mount。验证拒scripted层及浮动next引擎，限定站点、原语参数和本地gv-类规则；声明可调第一方原语，并非任意下载JS执行。

Engine实际注入styles/应用domOps/激活原语，Host创建时接同一引擎内DomEffectLedger与跨引擎ReleaseLedger。PluginScope.dispose先abort、逆序release并等待未完成启动/清理；清理异常被记录后继续，不是业务动作回滚证明。unmount移除style、释放DOM、发出释放Promise；Host在独占资源仍释放时阻后继并待空闲重排，永不settle的清理会一直阻该资源，不能假定有超时强行解锁。与直接用户脚本相比，所有权/退出可组合，但只覆盖通过这些机制登记的效果。设计明确借鉴cordis，不算原创生命周期范式。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/popup/components/PluginSiteSettings.tsx:88-94](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/popup/components/PluginSiteSettings.tsx#L88-L94)

设置页真实LocalPluginsPanel。

```text
        </CardContent>
      </Card>
      <div style={{ order: -1 }} className="flex flex-col gap-4">
        <PluginManager {...plugins} />
        <LocalPluginsPanel t={t} activeUrl={plugins.activeUrl} />
      </div>
    </>
```

**依据 2 · 源码核查**：[src/pages/popup/components/LocalPluginsPanel.tsx:166-193](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/popup/components/LocalPluginsPanel.tsx#L166-L193)

实际文件/粘贴导入事件。

<details>
<summary>查看原文（28行）</summary>

```text
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = '';
            if (files.length > 0) void local.importFiles(files);
          }}
        />
        {pasteOpen && (
          <div className="space-y-2">
            <textarea
              value={pasteText}
              onChange={(event) => setPasteText(event.target.value)}
              aria-label={t('localPluginsPasteLabel')}
              spellCheck={false}
              rows={6}
              placeholder='{ "id": "me.my-tweak", … }'
              className="bg-background border-border focus-visible:border-ring/70 focus-visible:ring-ring/30 w-full rounded-lg border p-2 font-mono text-[11px] transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:outline-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPasteOpen(false)}>
                {t('localPluginsCancel')}
              </Button>
              <Button
                size="sm"
                disabled={local.busy || pasteText.trim() === ''}
                onClick={() => void local.importText(pasteText)}
              >
                {t('localPluginsCheckAndImport')}
```

</details>

**依据 3 · 源码核查**：[src/pages/popup/hooks/useLocalPlugins.ts:120-141](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/popup/hooks/useLocalPlugins.ts#L120-L141)

UI hook到导入函数。

<details>
<summary>查看原文（22行）</summary>

```text
    (files: readonly File[]) =>
      runImport(async () => {
        const read = await readPickedFiles(files);
        return Array.isArray(read) ? importLocalPluginFiles(read) : read;
      }),
    [runImport],
  );

  /** Pasted text is read as a single `plugin.json` with its CSS inlined. */
  const importText = useCallback(
    (text: string) => runImport(() => importLocalPluginFiles([{ name: 'plugin.json', text }])),
    [runImport],
  );

  /**
   * A manifest already read and previewed (the AI-reply flow), imported as is,
   * and only over the install the preview was made against (`expectedInstalled`).
   */
  const importManifest = useCallback(
    (raw: unknown, expectedInstalled: string | null) =>
      runImport(() => importLocalPlugin(raw, undefined, { expectedInstalled })),
    [runImport],
```

</details>

**依据 4 · 源码核查**：[src/features/plugins/local/localPluginImport.ts:64-71](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/localPluginImport.ts#L64-L71)

默认install注入真实存储。

```text
const DEFAULT_DEPS: LocalPluginImportDeps = {
  loadRecords: loadLocalPluginRecords,
  installDisabled: (manifest, expectedInstalled) =>
    saveLocalPluginRecord(
      manifest,
      Date.now(),
      expectedInstalled === undefined ? {} : { expectedInstalled },
    ),
```

**依据 5 · 源码核查**：[src/features/plugins/local/localPluginImport.ts:88-111](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/localPluginImport.ts#L88-L111)

验证→保存与并发变更拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
export async function importLocalPlugin(
  raw: unknown,
  deps: LocalPluginImportDeps = DEFAULT_DEPS,
  options: LocalPluginImportOptions = {},
): Promise<LocalPluginImportResult> {
  const rawId =
    typeof raw === 'object' && raw !== null && 'id' in raw && typeof raw.id === 'string'
      ? toLocalPluginId(raw.id)
      : null;
  const records = await deps.loadRecords();
  const previousVersion = rawId ? recordVersion(records[rawId]) : undefined;
  const previous = previousVersion ? { previousVersion } : {};

  const result = validateLocalManifest(raw);
  if (!result.success) return { ok: false, issues: result.error, ...previous };

  const { manifest } = result.data;
  try {
    await deps.installDisabled(result.data.raw, options.expectedInstalled);
  } catch (error) {
    if (error instanceof LocalPluginChangedError) {
      const current = recordVersion((await deps.loadRecords())[manifest.id]);
      return {
        ok: false,
```

</details>

**依据 6 · 源码核查**：[src/features/plugins/local/localPluginStore.ts:138-175](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/localPluginStore.ts#L138-L175)

命名空间、锁与一次写入。

<details>
<summary>查看原文（38行）</summary>

```text
export async function saveLocalPluginRecord(
  manifest: Readonly<Record<string, unknown>>,
  now: number = Date.now(),
  options: SaveLocalPluginOptions = {},
): Promise<void> {
  const id = manifest.id;
  if (typeof id !== 'string' || !isLocalPluginId(id)) {
    throw new Error('local plugin id must be namespaced under local.');
  }
  const local = localArea();
  if (!local) throw new Error('extension storage is unavailable');
  await withPluginStorageLock(async () => {
    const stored = await readStoredMapStrict(local);
    const state = await readPluginStateStrict(local);
    const current = sanitizeLocalPluginRecords(stored);
    const previous = current[id];
    if (
      options.expectedInstalled !== undefined &&
      localPluginRecordSnapshot(previous) !== options.expectedInstalled
    ) {
      throw new LocalPluginChangedError(id);
    }
    if (!previous && Object.keys(current).length >= MAX_LOCAL_PLUGINS) {
      throw new Error(`at most ${MAX_LOCAL_PLUGINS} local plugins can be installed`);
    }
    const record: LocalPluginRecord = {
      manifest,
      importedAt: previous?.importedAt ?? now,
      updatedAt: now,
    };
    await local.set({
      [KEY]: { ...stored, [id]: record },
      [StorageKeys.PLUGINS_STATE]: withPluginDisabled(state, id, now),
    });
  });
}

/**
```

</details>

**依据 7 · 源码核查**：[src/features/plugins/local/LocalPluginSource.ts:34-49](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/LocalPluginSource.ts#L34-L49)

读取时重复验证。

<details>
<summary>查看原文（16行）</summary>

```text
  async list(): Promise<readonly PluginManifest[]> {
    const manifests: PluginManifest[] = [];
    for (const [id, record] of Object.entries(await this.loadRecords())) {
      const result = validateLocalManifest(record.manifest, undefined, { hostPolicy: 'defer' });
      if (result.success && result.data.manifest.id === id) {
        manifests.push(result.data.manifest);
      } else {
        logger.warn('Skipping invalid local plugin', {
          id,
          issues: result.success
            ? [{ path: 'id', message: 'does not match its key' }]
            : result.error,
        });
      }
    }
    return manifests;
```

</details>

**依据 8 · 源码核查**：[src/features/plugins/local/validateLocalManifest.ts:75-127](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/validateLocalManifest.ts#L75-L127)

引擎/层/参数/站点门槛。

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

**依据 9 · 源码核查**：[src/features/plugins/local/localPluginRules.ts:25-48](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/localPluginRules.ts#L25-L48)

gv-类限制。

<details>
<summary>查看原文（24行）</summary>

```text
/** Classes a local plugin adds: one class token that starts with `gv-`. */
export const LOCAL_CLASS_NAME_PATTERN = /^gv-[A-Za-z0-9_-]+$/;

/** Setting types the popup renders a control for; the rest are refused on import. */
export const LOCAL_SETTING_TYPES = ['boolean', 'number', 'select'] as const;

/** Sites whose `matches` contain at least one of the manifest's patterns. */
export function targetedSites(
  manifest: Pick<PluginManifest, 'matches'>,
  sites: readonly SiteAdapter[],
): readonly SiteAdapter[] {
  return sites.filter((site) =>
    manifest.matches.some((pattern) => patternWithinAny(pattern, site.matches)),
  );
}

function classNameIssues(manifest: PluginManifest): ManifestIssue[] {
  const issues: ManifestIssue[] = [];
  (manifest.contributes.domOps ?? []).forEach((op, index) => {
    if (op.op !== 'addClass' || LOCAL_CLASS_NAME_PATTERN.test(op.className)) return;
    issues.push({
      path: `contributes.domOps[${index}].className`,
      message: `"${op.className}" must be one class name starting with "gv-" (for example "gv-plugin-my-change")`,
    });
```

</details>

**依据 10 · 源码核查**：[src/features/plugins/runtime/PluginHost.ts:195-201](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/PluginHost.ts#L195-L201)

本地变化订阅。

```text
      };
      const host = this.context.host;
      if (host) this.unsubscribeCatalog = subscribeHostCatalog(host, onSourceChange);
      // An import, update or removal of a local plugin is a catalog change too.
      this.unsubscribeLocal = subscribeLocalPlugins(onSourceChange);
      const requeue = (): void => {
        if (this.generation === gen) void this.enqueue(() => this.reconcile(gen));
```

**依据 11 · 源码核查**：[src/features/plugins/runtime/PluginHost.ts:312-321](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/PluginHost.ts#L312-L321)

真实HostEngine接线。

<details>
<summary>查看原文（10行）</summary>

```text
  private createEngine(adapter: SiteAdapter | null): DeclarativeEngine {
    return createHostEngine({
      doc: this.doc,
      adapter,
      releases: this.releases,
      inspectPlugins: () => ({
        statuses: this.getStatuses(),
        manifests: runningManifests(this.manifests, this.frozen),
      }),
    });
```

</details>

**依据 12 · 源码核查**：[src/features/plugins/runtime/PluginHost.ts:406-423](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/PluginHost.ts#L406-L423)

释放/仲裁/实际mount。

<details>
<summary>查看原文（18行）</summary>

```text
    const wanted = verdicts.run;
    // Release what is no longer wanted first, so arbitration below already
    // sees a runtime handed over in this very pass as shutting down.
    const wantedIds = new Set(wanted.map((manifest) => manifest.id));
    unmountWhere(engine, this.pushedSettings, manifests, (id) => !wantedIds.has(id));
    const { granted, blocked } = arbitrate(wanted, verdicts.reserve, this.holders, {
      awaiting: verdicts.await,
      releasingBy: (resource) => this.releases.releasing(resource)?.pluginId ?? null,
    });
    // A running plugin arbitration kept off anyway (a holder never is, so normally none).
    unmountWhere(engine, this.pushedSettings, manifests, (id) => !granted.has(id));
    for (const block of blocked.values()) {
      if (block.reason === 'releasing') this.wakeWhenReleased(block.resources, gen);
    }
    for (const manifest of wanted) {
      if (!granted.has(manifest.id)) continue;
      const settings = resolveRunSettings(manifest, state, legacy);
      mountOrUpdate(engine, this.pushedSettings, manifest, settings);
```

</details>

**依据 13 · 源码核查**：[src/features/plugins/runtime/mountedSettings.ts:9-23](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/mountedSettings.ts#L9-L23)

真正engine.mount或update。

<details>
<summary>查看原文（15行）</summary>

```text
export function mountOrUpdate(
  engine: DeclarativeEngine,
  pushed: Map<string, string>,
  manifest: PluginManifest,
  settings: PluginSettings,
): void {
  const serialized = JSON.stringify(settings);
  if (!engine.isActive(manifest.id)) {
    engine.mount(manifest, settings);
  } else if (pushed.get(manifest.id) !== serialized) {
    engine.updateSettings(manifest.id, settings);
  } else {
    return;
  }
  pushed.set(manifest.id, serialized);
```

</details>

**依据 14 · 源码核查**：[src/features/plugins/runtime/declarativeEngine.ts:170-198](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/declarativeEngine.ts#L170-L198)

真实DOM/原语/作用域激活。

<details>
<summary>查看原文（29行）</summary>

```text
  mount(manifest: PluginManifest, settings: PluginSettings = {}): void {
    if (this.active.has(manifest.id)) return;
    this.ensureBaseStyle();
    const entry: ActivePlugin = {
      manifest,
      styleEl: null,
      settings,
      targetCounters: [],
      primitiveHandles: [],
      primitiveActivations: 0,
    };
    entry.nativeHandler = getNativeHandler(manifest.id);
    this.active.set(manifest.id, entry);
    this.injectStyles(entry);
    this.applyDomOps(entry);
    // First-party builtin plugins run JS via a registered native handler, in
    // lockstep with the declarative lifecycle. Scope-based handlers get a
    // fresh PluginScope per mount; a failed (sync or async) activation pays
    // back whatever it already registered instead of leaving a half-mount.
    if (entry.nativeHandler?.activate) {
      this.activateScope(entry, settings);
    } else {
      entry.nativeHandler?.start?.(settings);
    }
    // `native` ops invoke first-party primitives by name with validated params.
    activatePrimitives(entry, settings, this.primitiveEnv);
    this.trackHealth(entry);
    this.syncObserver();
    logger.info('Plugin mounted', { id: manifest.id });
```

</details>

**依据 15 · 源码核查**：[src/features/plugins/runtime/declarativeEngine.ts:301-322](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/declarativeEngine.ts#L301-L322)

真实释放Promise。

<details>
<summary>查看原文（22行）</summary>

```text
  unmount(id: string): Promise<void> {
    const entry = this.active.get(id);
    if (!entry) return Promise.resolve();

    // Scope disposal is async (it awaits in-flight startup and async
    // disposers) but claim-once: firing it here and moving on is safe — no
    // effect can double-run or leak, and a remount gets a fresh scope.
    const teardown: Array<Promise<void> | undefined> = [entry.scopeRestart, entry.primitiveRestart];
    if (entry.scope) teardown.push(entry.scope.dispose());
    else entry.nativeHandler?.stop?.();
    if (entry.primitiveScope) teardown.push(entry.primitiveScope.dispose());
    entry.primitiveScope = undefined;
    entry.styleEl?.remove();
    this.releasePlugin(id);
    this.health.forget(id);

    this.active.delete(id);
    this.syncObserver();
    logger.info('Plugin unmounted', { id });
    const released = Promise.allSettled(teardown).then(() => undefined);
    this.onRelease?.(entry.manifest, released);
    return released;
```

</details>

**依据 16 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:259-282](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/pluginScope.ts#L259-L282)

终止/逆序release/关闭后禁止注册。

<details>
<summary>查看原文（24行）</summary>

```text
  dispose(): Promise<void> {
    if (this.disposal) return this.disposal;
    this.disposed = true;
    // Publish the settlement before running any foreign code (abort listeners
    // may re-enter dispose(); they must receive this same promise).
    let settle!: () => void;
    this.disposal = new Promise<void>((r) => (settle = r));
    void (async () => {
      try {
        this.abort.abort();
        for (const entry of this.ledger.slice().reverse()) {
          await this.release(entry);
        }
        await Promise.allSettled(this.looseEnds);
      } finally {
        settle();
      }
    })();
    return this.disposal;
  }

  private assertLive(label: string): void {
    if (this.disposed) {
      throw new Error(`PluginScope is disposed; cannot register effect "${label}"`);
```

</details>

**依据 17 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:355-362](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/pluginScope.ts#L355-L362)

清理错误记录继续，不等实际资源已成功清除。

```text
  private async runDisposer(label: string, dispose: Dispose): Promise<void> {
    try {
      await dispose();
    } catch (error) {
      // The detail goes in the message: the extension error list shows a context object as [object Object].
      const detail = error instanceof Error ? (error.stack ?? error.message) : String(error);
      logger.error(`PluginScope disposer failed (${label}): ${detail}`);
    }
```

**依据 18 · 源码核查**：[src/features/plugins/runtime/releaseLedger.ts:29-45](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/releaseLedger.ts#L29-L45)

挂起释放登记/是否空闲。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Track `released` for the resources `pluginId` held; nothing to track without resources. */
  record(pluginId: string, resources: readonly ResourceId[], released: Promise<unknown>): void {
    if (resources.length === 0) return;
    const token = ++this.nextToken;
    this.pending.set(token, { token, pluginId, resources: [...resources] });
    const settle = (): void => {
      this.pending.delete(token);
      for (const resource of resources) this.notifyIfFree(resource);
    };
    released.then(settle, settle);
  }

  /** The oldest unfinished release of `resource`, or null when it is free. */
  releasing(resource: ResourceId): PendingRelease | null {
    for (const release of this.pending.values()) {
      if (release.resources.includes(resource)) return release;
    }
```

</details>

**依据 19 · 源码核查**：[src/features/plugins/runtime/PluginHost.ts:434-439](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/PluginHost.ts#L434-L439)

释放完成实际重新调度。

```text
  private wakeWhenReleased(resources: readonly string[], gen: number): void {
    for (const resource of resources) {
      // Keyed by generation: one queued pass per generation and resource.
      this.releases.whenFree(resource, String(gen), () => {
        if (this.generation === gen) void this.enqueue(() => this.reconcile(gen));
      });
```

**依据 20 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:1-23](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/pluginScope.ts#L1-L23)

作者明示借鉴与责任边界。

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

#### 缺口

- 未运行导入/并发更新/迟到启动、永久挂起或清理异常。
  **影响**：有生命周期协议不等所有第一方模块遵守，也不能保证退出后无残留或后继必能启动。
  **进一步探讨**：最小本地声明先导入关闭再启/停，构造迟到与抛错disposer，核DOM、监听器和被阻资源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可逆DOM、语义保护和健康状态分别能证明什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

当前HostEngine把withGuardedPageAdapter分别给原生和声明目标：受支持迁移键按页面语义视图逐次守卫，不能把语义保护当尚未实现；Gemini/自定义adapter或不在迁移合同的键保留其他分支，声明的sidebar/headerActions也有保留adapter值的例外。健康noEffect仍是有用户轮次且targets为零，另报零命中操作；它不等语义保护覆盖全目标，更不验导出内容正确或交互效果。

账本也需分类型：setAttribute首次捕获original并维护叠层，最后释放回原值；style另有longhand账本。本轮没有全验CSS语义。classOwners只记插件集合，addClass对本来已存在的同名类仍记owner，最后owner释放直接remove，targetedOps确实直接调用。因而“所有类恢复真原值”不成立：已存在同名类可被移除；本地规则限gv-前缀，不能扩大为任意宿主类名均可操作，也未实测触发频率。宿主后来写入的属性/未登记副作用更不能由原值账本自动保真。

无脚本的本地输入缩小扩展入口，不等整个客户端无JS、无网络或隐私审计通过。第一方原语、内容脚本、可选全网址/回环权限及云同步仍是信任边界；后台实际gv.sync.upload调用GoogleDrive上传。云身份/权限和删除需另验，本轮不对所有账号隔离/云路径下结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/plugins/runtime/hostEngine.ts:27-46](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/hostEngine.ts#L27-L46)

语义adapter与release真正注入。

<details>
<summary>查看原文（20行）</summary>

```text
export function createHostEngine(options: HostEngineOptions): DeclarativeEngine {
  const siteId = getPageSelectorSiteId(options.doc);
  const trackNativeDecorations =
    siteId !== null &&
    options.adapter?.id === siteId &&
    getSiteSelectorView(siteId).remoteKeys.size > 0;
  return new DeclarativeEngine({
    doc: options.doc,
    trackNativeDecorations,
    adapter: withGuardedPageAdapter(options.adapter, options.doc),
    targetAdapter: withGuardedPageAdapter(options.adapter, options.doc, 'declarative'),
    onHealthChange: (id, noEffect) => {
      logger.info('Plugin health changed', { id, noEffect });
    },
    shouldTrackHealth: (manifest) => tracksPluginHealth(manifest.id),
    inspectPlugins: options.inspectPlugins,
    // The mounted manifest decides what is released, so a plugin frozen
    // on its old version (D7) releases what that version claimed.
    onRelease: (manifest, released) => {
      options.releases.record(manifest.id, claimedResources(manifest), released);
```

</details>

**依据 2 · 源码核查**：[src/core/selectors/semanticSnapshot.ts:13-40](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/core/selectors/semanticSnapshot.ts#L13-L40)

按合同/键和站点分派守卫或保留。

<details>
<summary>查看原文（28行）</summary>

```text
export function pageSemanticSelector(
  adapter: Pick<SiteAdapter, 'id' | 'selectors'>,
  key: string,
  doc: Document | undefined = typeof document === 'undefined' ? undefined : document,
): string | undefined {
  const contract = getSiteSelectorContract(adapter.id);
  // Existing catalog semantics outside this migration still belong to the resolved adapter.
  if (!contract || (isSemanticSelectorKey(key) && !contract.keys.includes(key)))
    return adapter.selectors[key];
  const view = getSiteSelectorView(adapter.id);
  // OFF must retain cached upload owners and other baseline semantic overrides.
  if (isSemanticSelectorKey(key) && view.semanticSource === 'adapter')
    return adapter.selectors[key];
  return doc ? pageSemanticSelectorInView(key, view, doc) : view.profiles[key]?.join(',');
}

/** The claim is frozen by the operation owner; DOM ownership is proved at each read. */
export function pageSemanticSelectorInView(
  key: string,
  view: SiteSelectorView,
  doc: Document,
): string | undefined {
  if (isComposerSemanticKey(key) && view.siteId !== 'gemini')
    return guardedComposerSemanticSelector(key, view, doc);
  if (isSiteStructureKey(view.siteId, key)) return guardedSiteStructureSelector(key, view, doc);
  return view.siteId === 'chatgpt'
    ? guardedChatgptSemanticSelector(key, view, doc)
    : view.profiles[key]?.join(',');
```

</details>

**依据 3 · 源码核查**：[src/core/selectors/semanticSnapshot.ts:61-82](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/core/selectors/semanticSnapshot.ts#L61-L82)

Gemini及声明placement例外。

<details>
<summary>查看原文（22行）</summary>

```text
export function withGuardedPageAdapter(
  adapter: SiteAdapter | null,
  doc: Document,
  purpose: 'native' | 'declarative' = 'native',
): SiteAdapter | null {
  if (!adapter || adapter.id === 'gemini' || getPageSelectorSiteId(doc) !== adapter.id)
    return adapter;
  const selectors: Record<string, string> = {};
  for (const key of Object.keys(adapter.selectors)) {
    Object.defineProperty(selectors, key, {
      enumerable: true,
      get: () =>
        // Declarative ops keep the pre-contract site override trust; native placement still uses Tier B.
        purpose === 'declarative' && (key === 'sidebar' || key === 'headerActions')
          ? adapter.selectors[key]
          : (pageSemanticSelector(adapter, key, doc) ?? ':not(*)'),
    });
  }
  return { ...adapter, selectors };
}

/** Only remote semantic operations need to re-prove ownership after mounting. */
```

</details>

**依据 4 · 源码核查**：[src/features/plugins/runtime/healthMonitor.ts:112-130](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/healthMonitor.ts#L112-L130)

健康具体判定范围。

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

**依据 5 · 源码核查**：[src/features/plugins/runtime/declarativeEngine.ts:423-433](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/declarativeEngine.ts#L423-L433)

实际targetedOp→账本与释放。

<details>
<summary>查看原文（11行）</summary>

```text
  private applyOp(entry: ActivePlugin, op: DomOperation): void {
    if (!isTargetedOp(op)) return; // primitives run through activatePrimitives
    const render = (value: string): string => this.renderTemplate(entry, value);
    for (const el of this.queryAll(op.target)) {
      if (!applyOpToElement(this.ledger, entry.manifest.id, el, op, render)) return;
    }
  }

  /** Remove every contribution of `id` from the shared ledgers. */
  private releasePlugin(id: string): void {
    this.ledger.release(id);
```

</details>

**依据 6 · 源码核查**：[src/features/plugins/runtime/targetedOps.ts:24-36](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/targetedOps.ts#L24-L36)

addClass直接入账，无原class短路。

<details>
<summary>查看原文（13行）</summary>

```text
export function applyOpToElement(
  ledger: DomEffectLedger,
  id: string,
  el: Element,
  op: TargetedOperation,
  render: (value: string) => string,
): boolean {
  switch (op.op) {
    case 'addClass':
      ledger.addClass(id, el, op.className);
      break;
    case 'hide':
      ledger.addClass(id, el, PLUGIN_HIDDEN_CLASS);
```

</details>

**依据 7 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:26-31](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/domEffectLedger.ts#L26-L31)

classOwners无原值字段。

```text
export class DomEffectLedger {
  /** element → className → set of plugin ids that requested the class. */
  private readonly classOwners = new Map<Element, Map<string, Set<string>>>();
  /** element → attribute name → layer. */
  private readonly attrLayers = new Map<Element, Map<string, OverrideLayer>>();
  /** Shared original longhands and ordered declarations, including variable shorthands. */
```

**依据 8 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:41-65](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/domEffectLedger.ts#L41-L65)

已有class也入owners；属性另捕原值。

<details>
<summary>查看原文（25行）</summary>

```text
  addClass(id: string, el: Element, className: string): void {
    const perEl = mapGet(this.classOwners, el, () => new Map<string, Set<string>>());
    const owners = mapGet(perEl, className, () => new Set<string>());
    // Native decorations must not make later guarded semantic reads mistake the host for our UI.
    if (
      this.trackNativeDecorations &&
      !hasVoyagerOwner(el) &&
      !el.closest('[data-gv-component], [data-gv-layer], [data-gv-plugin]')
    )
      nativeDomDecorations.acquire(el, className, this);
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
```

</details>

**依据 9 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:73-103](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/domEffectLedger.ts#L73-L103)

最后class直接remove，属性按original/剩余叠层恢复。

<details>
<summary>查看原文（31行）</summary>

```text
  /** Remove every contribution of `id`, restoring the next-highest plugin's
   *  value (or the captured original when it was last). */
  release(id: string): void {
    for (const [el, perEl] of this.classOwners) {
      for (const [className, owners] of perEl) {
        if (owners.delete(id) && owners.size === 0) {
          if (this.trackNativeDecorations) nativeDomDecorations.release(el, className, this);
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

**依据 10 · 源码核查**：[src/features/plugins/local/localPluginRules.ts:25-48](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/localPluginRules.ts#L25-L48)

本地class仅gv-，收窄冲突范围。

<details>
<summary>查看原文（24行）</summary>

```text
/** Classes a local plugin adds: one class token that starts with `gv-`. */
export const LOCAL_CLASS_NAME_PATTERN = /^gv-[A-Za-z0-9_-]+$/;

/** Setting types the popup renders a control for; the rest are refused on import. */
export const LOCAL_SETTING_TYPES = ['boolean', 'number', 'select'] as const;

/** Sites whose `matches` contain at least one of the manifest's patterns. */
export function targetedSites(
  manifest: Pick<PluginManifest, 'matches'>,
  sites: readonly SiteAdapter[],
): readonly SiteAdapter[] {
  return sites.filter((site) =>
    manifest.matches.some((pattern) => patternWithinAny(pattern, site.matches)),
  );
}

function classNameIssues(manifest: PluginManifest): ManifestIssue[] {
  const issues: ManifestIssue[] = [];
  (manifest.contributes.domOps ?? []).forEach((op, index) => {
    if (op.op !== 'addClass' || LOCAL_CLASS_NAME_PATTERN.test(op.className)) return;
    issues.push({
      path: `contributes.domOps[${index}].className`,
      message: `"${op.className}" must be one class name starting with "gv-" (for example "gv-plugin-my-change")`,
    });
```

</details>

**依据 11 · 源码核查**：[manifest.json:27-46](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/manifest.json#L27-L46)

可选权限/OAuth边界。

<details>
<summary>查看原文（20行）</summary>

```text
  "permissions": ["storage", "identity", "scripting", "alarms", "activeTab"],
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
```

</details>

**依据 12 · 源码核查**：[src/pages/background/cloudSyncMessages.ts:267-278](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/background/cloudSyncMessages.ts#L267-L278)

真实云上传消息入口。

<details>
<summary>查看原文（12行）</summary>

```text
      case 'gv.sync.upload': {
        const {
          interactive,
          platform: rawPlatform,
          accountScope: rawScope,
          timelineHierarchyAccountScope: rawTimelineHierarchyScope,
          highlightAccountScope: rawHighlightScope,
          includeHighlights,
        } = payload as {
          interactive?: boolean;
          platform?: unknown;
          accountScope?: unknown;
```

</details>

**依据 13 · 源码核查**：[src/pages/background/cloudSyncMessages.ts:337-349](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/background/cloudSyncMessages.ts#L337-L349)

真实Drive上传调用。

<details>
<summary>查看原文（13行）</summary>

```text
              )
            : timelineHierarchyDataRaw;
        const settingsPayload = syncsSharedData ? await exportBackupableSyncSettings() : null;
        const pluginState = syncsSharedData ? await loadPluginState() : null;
        const success = await googleDriveSyncService.upload(
          folders,
          prompts,
          starredData,
          interactive !== false,
          platform,
          forksData,
          timelineHierarchyData,
          accountScope,
```

</details>

#### 缺口

- 同名类残留/移除在真实站点的影响频率、语义保护覆盖率和云端数据隔离/删除未测。
  **影响**：不能承诺保真回滚、健康即正确或数据完全只本地；涉及敏感对话应先限权限及关闭未验证云。
  **进一步探讨**：带原有gv-类与重叠开关的DOM对照，逐迁移键核正误目标；云只用测试账号核数据范围/授权/撤销与删除。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样以有限风险试用并计算四阶段成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合经常整理聊天记录、愿意逐站点核权限和导出内容的浏览器用户；先用无敏感小对话，只启所需阅读/导出，不从README功能数推全开。首次安装/自建需支持浏览器或Bun构建环境，授权与旧设置/数据备份花人工；上游聊天账号和付费计划、可选云空间费用独立于扩展，未核统一价格。持续有页面适配、选择器/原语版本、DOM观察以及组织复核负担，成本不能只算免费扩展。

失败先关有问题插件/退回页面原生导出与复制，保留目标/版本/开关次序和原文；不因mounted/healthy就反复导出覆盖旧档。卡住释放时重载页面是恢复候选，不是源代码证明无遗留；涉及云上传先查已有对象避免重复或误删。退出须分别保存本地数据、移除声明/撤权限/卸载并重载，云副本与已下载文件独立处理，不能声称卸载自动删除。未验证UI撤销/云删除闭环，不自动执行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:12-22](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/package.json#L12-L22)

分浏览器构建/本地环境。

<details>
<summary>查看原文（11行）</summary>

```text
  "scripts": {
    "bump": "bun scripts/bump-version.js",
    "build": "vite build --config vite.config.chrome.ts",
    "build:chrome": "vite build --config vite.config.chrome.ts",
    "build:edge": "bun scripts/build-edge.js",
    "build:firefox": "vite build --config vite.config.firefox.ts",
    "build:safari": "vite build --config vite.config.safari.ts && node scripts/verify-safari-resources.mjs",
    "build:all": "bun run build:chrome && bun run build:firefox && bun run build:safari",
    "build:browsers": "bun run build:all && bun run build:edge",
    "dev": "nodemon --config nodemon.chrome.json",
    "dev:chrome": "nodemon --config nodemon.chrome.json",
```

</details>

**依据 2 · 源码核查**：[manifest.json:27-46](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/manifest.json#L27-L46)

按需授权与云账户条件。

<details>
<summary>查看原文（20行）</summary>

```text
  "permissions": ["storage", "identity", "scripting", "alarms", "activeTab"],
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
```

</details>

**依据 3 · 源码核查**：[src/features/plugins/local/localPluginImport.ts:101-111](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/local/localPluginImport.ts#L101-L111)

先校验再安装，避免坏更新静默替代。

<details>
<summary>查看原文（11行）</summary>

```text
  const result = validateLocalManifest(raw);
  if (!result.success) return { ok: false, issues: result.error, ...previous };

  const { manifest } = result.data;
  try {
    await deps.installDisabled(result.data.raw, options.expectedInstalled);
  } catch (error) {
    if (error instanceof LocalPluginChangedError) {
      const current = recordVersion((await deps.loadRecords())[manifest.id]);
      return {
        ok: false,
```

</details>

**依据 4 · 源码核查**：[src/features/plugins/runtime/PluginHost.ts:406-423](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/PluginHost.ts#L406-L423)

开关/仲裁的机制基础。

<details>
<summary>查看原文（18行）</summary>

```text
    const wanted = verdicts.run;
    // Release what is no longer wanted first, so arbitration below already
    // sees a runtime handed over in this very pass as shutting down.
    const wantedIds = new Set(wanted.map((manifest) => manifest.id));
    unmountWhere(engine, this.pushedSettings, manifests, (id) => !wantedIds.has(id));
    const { granted, blocked } = arbitrate(wanted, verdicts.reserve, this.holders, {
      awaiting: verdicts.await,
      releasingBy: (resource) => this.releases.releasing(resource)?.pluginId ?? null,
    });
    // A running plugin arbitration kept off anyway (a holder never is, so normally none).
    unmountWhere(engine, this.pushedSettings, manifests, (id) => !granted.has(id));
    for (const block of blocked.values()) {
      if (block.reason === 'releasing') this.wakeWhenReleased(block.resources, gen);
    }
    for (const manifest of wanted) {
      if (!granted.has(manifest.id)) continue;
      const settings = resolveRunSettings(manifest, state, legacy);
      mountOrUpdate(engine, this.pushedSettings, manifest, settings);
```

</details>

**依据 5 · 源码核查**：[src/features/plugins/runtime/releaseLedger.ts:29-45](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/releaseLedger.ts#L29-L45)

挂起释放影响后继。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Track `released` for the resources `pluginId` held; nothing to track without resources. */
  record(pluginId: string, resources: readonly ResourceId[], released: Promise<unknown>): void {
    if (resources.length === 0) return;
    const token = ++this.nextToken;
    this.pending.set(token, { token, pluginId, resources: [...resources] });
    const settle = (): void => {
      this.pending.delete(token);
      for (const resource of resources) this.notifyIfFree(resource);
    };
    released.then(settle, settle);
  }

  /** The oldest unfinished release of `resource`, or null when it is free. */
  releasing(resource: ResourceId): PendingRelease | null {
    for (const release of this.pending.values()) {
      if (release.resources.includes(resource)) return release;
    }
```

</details>

**依据 6 · 源码核查**：[src/features/export/services/ConversationExportService.ts:489-504](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/export/services/ConversationExportService.ts#L489-L504)

已下载副本不属DOM释放。

<details>
<summary>查看原文（16行）</summary>

```text
  private static downloadJSON(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {
        /* ignore */
      }
```

</details>

**依据 7 · 源码核查**：[src/pages/background/cloudSyncMessages.ts:337-349](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/pages/background/cloudSyncMessages.ts#L337-L349)

云副本独立于扩展卸载。

<details>
<summary>查看原文（13行）</summary>

```text
              )
            : timelineHierarchyDataRaw;
        const settingsPayload = syncsSharedData ? await exportBackupableSyncSettings() : null;
        const pluginState = syncsSharedData ? await loadPluginState() : null;
        const success = await googleDriveSyncService.upload(
          folders,
          prompts,
          starredData,
          interactive !== false,
          platform,
          forksData,
          timelineHierarchyData,
          accountScope,
```

</details>

#### 缺口

- 无真实配置/恢复/退出计时、资源峰值、云账单或用户净收益样本。
  **影响**：不能报具体节时、免费总成本或一键卸载即清净。
  **进一步探讨**：记录首次配置与每次适配/复核时间，比较原生导出，核备份重载撤权及测试云资料处理后再扩功能。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 未来方向必须比现有guard/测试/释放协议多什么？

**研究主题**：新假设与验证

#### 完整回答

现有语义守卫、健康计数、作用域和独占释放协议都应直接承认，补相同机制不算新产品。本轮可证的具体缺口是同名类仅记owner而无原始存在状态，未来可先补原有类保留，再把与用户任务相关的对象/内容和开关前后差异形成可审证据，覆盖声明DOM与少量第一方原语；不能只输出mounted或targets数量。不是声称全仓从无测试，而是本轮未验到用户任务结果与开关恢复的统一接受证据。

最小对照用已有gv-类、双插件重叠、不同开关顺序、站点重绘/迟到清理、错误但非零目标及已知导出正文的样本，比较原生/脚本、当前Voyager和原类保留+结果对照版本。看错误目标率、原始状态丢失、内容遗漏、人工复核和适配维护总时间；如果只生成更多状态而不能减少这几类错误，或维护比原生方案贵，则否定增量，必要时只交局部修复而不做独立插件。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:41-60](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/domEffectLedger.ts#L41-L60)

新增原class状态相对当前owner有具体差异。

<details>
<summary>查看原文（20行）</summary>

```text
  addClass(id: string, el: Element, className: string): void {
    const perEl = mapGet(this.classOwners, el, () => new Map<string, Set<string>>());
    const owners = mapGet(perEl, className, () => new Set<string>());
    // Native decorations must not make later guarded semantic reads mistake the host for our UI.
    if (
      this.trackNativeDecorations &&
      !hasVoyagerOwner(el) &&
      !el.closest('[data-gv-component], [data-gv-layer], [data-gv-plugin]')
    )
      nativeDomDecorations.acquire(el, className, this);
    owners.add(id);
    // (Re)assert the class — also re-heals an SPA re-render that stripped it.
    if (!el.classList.contains(className)) el.classList.add(className);
  }

  setAttribute(id: string, el: Element, name: string, value: string): void {
    const perEl = mapGet(this.attrLayers, el, () => new Map<string, OverrideLayer>());
    const layer = mapGet(perEl, name, () => ({ original: el.getAttribute(name), stack: [] }));
    pushLayerValue(layer, id, value);
    el.setAttribute(name, topValue(layer));
```

</details>

**依据 2 · 源码核查**：[src/features/plugins/runtime/domEffectLedger.ts:75-96](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/domEffectLedger.ts#L75-L96)

当前类移除与属性原值明确不同。

<details>
<summary>查看原文（22行）</summary>

```text
  release(id: string): void {
    for (const [el, perEl] of this.classOwners) {
      for (const [className, owners] of perEl) {
        if (owners.delete(id) && owners.size === 0) {
          if (this.trackNativeDecorations) nativeDomDecorations.release(el, className, this);
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
```

</details>

**依据 3 · 源码核查**：[src/core/selectors/semanticSnapshot.ts:61-82](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/core/selectors/semanticSnapshot.ts#L61-L82)

已有守卫不算未来新实现。

<details>
<summary>查看原文（22行）</summary>

```text
export function withGuardedPageAdapter(
  adapter: SiteAdapter | null,
  doc: Document,
  purpose: 'native' | 'declarative' = 'native',
): SiteAdapter | null {
  if (!adapter || adapter.id === 'gemini' || getPageSelectorSiteId(doc) !== adapter.id)
    return adapter;
  const selectors: Record<string, string> = {};
  for (const key of Object.keys(adapter.selectors)) {
    Object.defineProperty(selectors, key, {
      enumerable: true,
      get: () =>
        // Declarative ops keep the pre-contract site override trust; native placement still uses Tier B.
        purpose === 'declarative' && (key === 'sidebar' || key === 'headerActions')
          ? adapter.selectors[key]
          : (pageSemanticSelector(adapter, key, doc) ?? ':not(*)'),
    });
  }
  return { ...adapter, selectors };
}

/** Only remote semantic operations need to re-prove ownership after mounting. */
```

</details>

**依据 4 · 源码核查**：[src/features/plugins/runtime/pluginScope.ts:259-277](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/pluginScope.ts#L259-L277)

已有退出屏障不重复归功。

<details>
<summary>查看原文（19行）</summary>

```text
  dispose(): Promise<void> {
    if (this.disposal) return this.disposal;
    this.disposed = true;
    // Publish the settlement before running any foreign code (abort listeners
    // may re-enter dispose(); they must receive this same promise).
    let settle!: () => void;
    this.disposal = new Promise<void>((r) => (settle = r));
    void (async () => {
      try {
        this.abort.abort();
        for (const entry of this.ledger.slice().reverse()) {
          await this.release(entry);
        }
        await Promise.allSettled(this.looseEnds);
      } finally {
        settle();
      }
    })();
    return this.disposal;
```

</details>

**依据 5 · 源码核查**：[src/features/plugins/runtime/healthMonitor.ts:112-130](https://github.com/voyager-crew/voyager/blob/27aced8f671b2a3fadcb0ad6262c43f4008ff9f5/src/features/plugins/runtime/healthMonitor.ts#L112-L130)

现有健康指标与结果验收区分。

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

#### 缺口

- 原类保留与结果对照尚未实现或做任务收益对照。
  **影响**：不能把局部静态缺口提升为用户愿付费的跨站治理产品，或计入当前贡献。
  **进一步探讨**：先以许可内固定DOM/对话样本盲核原态与输出，再访真实使用者核错误频率与维护成本，未改善则停。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
