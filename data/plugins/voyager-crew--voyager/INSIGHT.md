# Voyager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3bf3219](https://github.com/voyager-crew/voyager/tree/3bf32199b1fe8ecbca6fb0339ec59752d997ff92)

<!-- BEGIN META -->
[![GitHub ★ 20,508](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C508&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/voyager-crew/voyager) [![npm 30d 1,508](https://img.shields.io/static/v1?label=npm+30d&message=1%2C508&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager) [![最新发布 2015-02-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2015-02-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager)
<!-- END META -->

> **功能**：浏览器扩展，为聊天网页提供阅读、整理和对话导出。

> **亮点**：整合聊天网页阅读与导出，并提供插件授权与效果生命周期；DeepSeek 网站支持不等同 DSH 宿主插件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：授权、脚本注册及实际生效不同；导出格式支持和 scope 释放不证明所有消息、附件完整或所有 DOM 已恢复。[Q03](#research-q03)

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
  - [Q01 · 用户获得什么，浏览器扩展与 DSH 是什么关系？](#detail-section-11)
  - [Q02 · 本地声明如何进入页面及释放？](#detail-section-12)
  - [Q03 · 导出和可撤销效果能否证明所有内容完整？](#detail-section-13)
  - [Q04 · 采用和退出的成本在哪里？](#detail-section-14)
  - [Q05 · 如何验证站点变更后的功能与撤销？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨聊天网页整理和导出的用户；原网页与手工复制是基线。[Q01](#research-q01)

原网页、书签、手工复制或原生导出。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 页面插件 | 在授权站点增强体验 | 需对应站点权限 |
| 对话导出 | 生成 JSON 等格式 | 内容完整须对照 |
| 生命周期 | 释放旧效果 | 具体 DOM 恢复须验证 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容浏览器扩展宿主 | 必需 | 内容脚本 | 无法运行 |
| 目标站点与 host 权限 | 对应功能必需 | 页面访问 | 不注入 |
| 可核对对话 | 导出验证必需 | 确认完整 | 不依赖导出 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 授权 | 选择最少站点 | 核对实际权限 |
| 使用 | 用非敏感对话试读和导出 | 对照原文 |
| 退出 | 关闭功能检查恢复 | 有残留则停用扩展 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器扩展资源 | 授权与配置 | optional all_urls 需审查 |
| 持续 | 本地存储与维护 | 核对导出 | 站点变化影响未知 |
| 恢复 | 导出文件保管 | 验证撤销与删除 | 隐私和残留需检查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 插件生命周期 | 已授权站点注册及 scope 释放 | 所有页面完整恢复 |
| 对话导出 | 多格式分派与 JSON 下载 | 所有消息附件完整 |

> **思考**：授权、脚本注册及实际生效不同；导出格式支持和 scope 释放不证明所有消息、附件完整或所有 DOM 已恢复。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：整合聊天网页阅读与导出，并提供插件授权与效果生命周期；DeepSeek 网站支持不等同 DSH 宿主插件。[Q01](#research-q01) [Q02](#research-q02)

按已授权来源动态注册，串行同步避免并发重复；scope 释放后重启，但具体页面效果需实测。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

授权、脚本注册及实际生效不同；导出格式支持和 scope 释放不证明所有消息、附件完整或所有 DOM 已恢复。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

最小站点授权并用非敏感对话核验导出与关闭恢复；异常即停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持站点授权过滤、生命周期和代表 JSON 导出；未运行浏览器或目标网站。

- 已检查：作者 README、包清单、源码路径 package.json、manifest.json、src/pages/background/siteAccessRegistration.ts、src/pages/popup/hooks/useLocalPlugins.ts、src/features/plugins/runtime/primitiveLifecycle.ts、src/features/export/services/ConversationExportService.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 4677 个指定扩展名文件、排除 3、解析错误 0；静态核查代表站点注册、生命周期和导出，不运行浏览器。
- 下一步：固定浏览器及站点，测试权限、动态注册、导出完整性和禁用后的恢复。

**分析版本**

- **仓库**：[voyager-crew/voyager](https://github.com/voyager-crew/voyager)
- **版本号**：2.3.0（[固定提交 3bf3219](https://github.com/voyager-crew/voyager/tree/3bf32199b1fe8ecbca6fb0339ec59752d997ff92)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：站点变化后显示注入、选择器和释放证据可缩短故障发现；须对照现有控制测误报与隐私。[Q05](#research-q05)

固定浏览器及站点，测试权限、动态注册、导出完整性和禁用后的恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1112 | 45082 | — | — | 509198 |
| .ts | source | 1812 | 251450 | 203862 | 27575 | — |
| .cjs | source | 6 | 1209 | 1025 | 53 | — |
| .ts | test | 1485 | 288596 | 251112 | 8727 | — |
| .mts | source | 1 | 207 | 79 | 131 | — |
| .js | source | 14 | 3228 | 2529 | 405 | — |
| .mjs | source | 16 | 1733 | 1521 | 67 | — |
| .js | test | 11 | 1501 | 1293 | 62 | — |
| .tsx | test | 109 | 23150 | 20418 | 549 | — |
| .tsx | source | 100 | 14102 | 12423 | 845 | — |
| .ts | example | 11 | 1685 | 1575 | 44 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/voyager-crew/voyager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器扩展如何挂载站点和导出对话，其权限、释放与完整性边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户获得什么，浏览器扩展与 DSH 是什么关系？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Voyager 是浏览器扩展，面向聊天网页用户提供阅读、整理和对话导出；替代为原网页、书签、手工复制或原生导出。包描述提及 DeepSeek 聊天网站，不等于 DSH 原生插件或已验证 DSH 宿主集成。manifest 以 Gemini 来源为默认脚本范围，其他来源可能需要可选授权和动态注册，不能仅凭支持列表断言每站都生效。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/package.json#L1-L5)

包描述与版本。

```text
{
  "name": "voyager",
  "version": "2.3.0",
  "description": "A better workspace for Gemini, Claude, ChatGPT, and DeepSeek: prompts, reading tools, organization, export, and more.",
  "packageManager": "bun@1.3.12",
```

**依据 2 · 源码核查**：[manifest.json:27-44](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/manifest.json#L27-L44)

默认和可选 host 权限。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[manifest.json:52-61](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/manifest.json#L52-L61)

默认内容脚本匹配范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "content_scripts": [
    {
      "matches": [
        "https://gemini.google.com/*",
        "https://business.gemini.google/*",
        "https://aistudio.google.com/*",
        "https://aistudio.google.cn/*"
      ],
      "js": ["src/pages/content/index.tsx"],
      "css": ["contentStyle.css"]
```

</details>

**依据 4 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:302-308](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/pages/background/siteAccessRegistration.ts#L302-L308)

启用插件与已授予站点的动态注册。

```text
  /**
   * Plugin ecosystem — dynamic content-script registration.
   *
   * Mirrors syncCustomContentScripts: derive the origins of currently-ENABLED
   * plugins, keep only those the user has already granted host permission
   * for, and (re)register the content script for them. The content script runs
   * `startPluginHost()`, which mounts the enabled plugin on the page.
```

#### 缺口

- 未运行浏览器扩展、目标网页或导出
  **影响**：不能证明实际注入、撤销或导出内容完整
  **进一步探讨**：固定浏览器和站点版本，在非敏感对话验证权限与导出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地声明如何进入页面及释放？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

扩展维护本地插件导入与启用状态，后台根据启用插件来源过滤已授予 host 权限，动态注册内容脚本并串行化同步，避免并发重复注入；页面生命周期管理 scope，设置变化时释放旧实例再重启。授予权限、注册、实际加载和页面效果是不同阶段；可选全站权限的存在使用户必须核对实际授权范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/popup/hooks/useLocalPlugins.ts:76-80](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/pages/popup/hooks/useLocalPlugins.ts#L76-L80)

本地插件导入与列表入口。

```text
/** Local plugin list plus import / export / remove for the popup plugin page. */
export function useLocalPlugins() {
  const [entries, setEntries] = useState<readonly LocalPluginEntry[]>([]);
  const [result, setResult] = useState<LocalPluginImportResult | null>(null);
  const [busy, setBusy] = useState(false);
```

**依据 2 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:292-311](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/pages/background/siteAccessRegistration.ts#L292-L311)

串行同步与启用/授权边界。

<details>
<summary>查看原文（20行）</summary>

```text
  // Serialized: concurrent syncs (storage listener + permission events) would
  // otherwise race the ping-then-inject sequence and double-inject.
  let pluginContentScriptSyncQueue: Promise<void> = Promise.resolve();

  function syncPluginContentScripts(): Promise<void> {
    const next = pluginContentScriptSyncQueue.then(() => doSyncPluginContentScripts());
    pluginContentScriptSyncQueue = next.catch(() => {});
    return next;
  }

  /**
   * Plugin ecosystem — dynamic content-script registration.
   *
   * Mirrors syncCustomContentScripts: derive the origins of currently-ENABLED
   * plugins, keep only those the user has already granted host permission
   * for, and (re)register the content script for them. The content script runs
   * `startPluginHost()`, which mounts the enabled plugin on the page.
   *
   * Plugin enable-state is the single source of truth (storage.local); permissions
   * and registrations are derived from it.
```

</details>

**依据 3 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:313-329](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/pages/background/siteAccessRegistration.ts#L313-L329)

载入启用插件并过滤已授权来源。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/features/plugins/runtime/primitiveLifecycle.ts:118-138](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/plugins/runtime/primitiveLifecycle.ts#L118-L138)

设置变更释放和重新激活。

<details>
<summary>查看原文（21行）</summary>

```text
 * Dispose the primitives' scope, then re-activate under the new settings
 * (serialized). Always chain: while a restart is still disposing there is no
 * scope to take, but the newer settings must still get their activation once
 * the queue drains — otherwise the stale restart bails on them and the plugin
 * ends up with no primitives at all.
 */
export function restartPrimitives(
  entry: PrimitiveSlot,
  settings: PluginSettings,
  env: PrimitiveEnv,
): void {
  const previous = entry.primitiveScope;
  entry.primitiveScope = undefined;
  entry.primitiveRestart = (entry.primitiveRestart ?? Promise.resolve()).then(async () => {
    if (previous) await previous.dispose();
    if (!env.isCurrent(entry)) return;
    if (entry.settings !== settings) return;
    activatePrimitives(entry, settings, env);
  });
  // Begin teardown now: an immediate unmount cannot reach the scope held by this queue.
  void previous?.dispose();
```

</details>

#### 缺口

- 未运行浏览器扩展、目标网页或导出
  **影响**：不能证明实际注入、撤销或导出内容完整
  **进一步探讨**：固定浏览器和站点版本，在非敏感对话验证权限与导出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 导出和可撤销效果能否证明所有内容完整？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

导出服务按格式分派 JSON、Markdown、PDF、图像等路径，JSON 组装对话并下载；源码表明代表链条，不能证明目标网页所有消息、附件、隐藏内容均被采集。scope 释放与动态注册减少残留，但站点 DOM、权限和扩展版本变化仍可能使具体效果失效；应在非敏感对话核对原文和导出内容，而非把健康状态当全面质量认证。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/export/services/ConversationExportService.ts:37-68](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/export/services/ConversationExportService.ts#L37-L68)

按输出格式分派。

<details>
<summary>查看原文（32行）</summary>

```text
   * Export conversation in specified format
   */
  static async export(
    turns: ChatTurn[],
    metadata: ConversationMetadata,
    options: ExportOptions,
  ): Promise<ExportResult> {
    try {
      this.assertNotAborted(options.signal);
      const layout: ExportLayout = options.layout ?? 'conversation';
      if (layout === 'document') {
        return await this.exportDocument(turns, metadata, options);
      }

      const conversationOptions: ExportOptions = {
        ...options,
        speakerLabels: options.speakerLabels ?? DEFAULT_EXPORT_SPEAKER_LABELS,
      };

      switch (conversationOptions.format) {
        case 'json':
          return this.exportJSON(turns, metadata, conversationOptions);

        case 'markdown':
          return await this.exportMarkdown(turns, metadata, conversationOptions);

        case 'pdf':
          return await this.exportPDF(turns, metadata, conversationOptions);

        case 'image':
          return await this.exportImage(turns, metadata, conversationOptions);

```

</details>

**依据 2 · 源码核查**：[src/features/export/services/ConversationExportService.ts:130-161](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/export/services/ConversationExportService.ts#L130-L161)

JSON 组装与下载。

<details>
<summary>查看原文（32行）</summary>

```text
   * Export as JSON, with the same Markdown-formatted content as the Markdown export.
   */
  private static exportJSON(
    turns: ChatTurn[],
    metadata: ConversationMetadata,
    options: ExportOptions,
  ): ExportResult {
    const processedItems = turns.map((turn) => {
      const attachments = turn.userContent
        ? turn.userContent.attachments
        : (turn.attachments ?? []);
      return {
        user: turn.userContent?.text || turn.user,
        assistant: turn.assistantContent?.text || turn.assistant,
        starred: turn.starred,
        ...(attachments.length > 0 ? { attachments } : {}),
      };
    });

    const payload = {
      format: this.CHAT_JSON_FORMAT,
      url: metadata.url,
      exportedAt: metadata.exportedAt,
      count: metadata.count,
      title: metadata.title,
      items: processedItems,
    };

    const filename =
      options.filename || this.generateFilename('json', metadata.title, metadata.platform);
    this.assertNotAborted(options.signal);
    this.downloadJSON(payload, filename);
```

</details>

**依据 3 · 源码核查**：[src/features/plugins/runtime/primitiveLifecycle.ts:118-138](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/plugins/runtime/primitiveLifecycle.ts#L118-L138)

释放和重建的生命周期。

<details>
<summary>查看原文（21行）</summary>

```text
 * Dispose the primitives' scope, then re-activate under the new settings
 * (serialized). Always chain: while a restart is still disposing there is no
 * scope to take, but the newer settings must still get their activation once
 * the queue drains — otherwise the stale restart bails on them and the plugin
 * ends up with no primitives at all.
 */
export function restartPrimitives(
  entry: PrimitiveSlot,
  settings: PluginSettings,
  env: PrimitiveEnv,
): void {
  const previous = entry.primitiveScope;
  entry.primitiveScope = undefined;
  entry.primitiveRestart = (entry.primitiveRestart ?? Promise.resolve()).then(async () => {
    if (previous) await previous.dispose();
    if (!env.isCurrent(entry)) return;
    if (entry.settings !== settings) return;
    activatePrimitives(entry, settings, env);
  });
  // Begin teardown now: an immediate unmount cannot reach the scope held by this queue.
  void previous?.dispose();
```

</details>

#### 缺口

- 未运行浏览器扩展、目标网页或导出
  **影响**：不能证明实际注入、撤销或导出内容完整
  **进一步探讨**：固定浏览器和站点版本，在非敏感对话验证权限与导出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出的成本在哪里？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要兼容浏览器、站点页面及用户授予的 host 权限；可选 all_urls 和 Google Drive file scope 需要按功能与实际授权审查。网站改版、导出内容核对及扩展升级增加维护；对话导出可能包含私人信息。先在非敏感对话启用最少站点并核对导出、关闭功能后检查页面恢复；发现越权、缺消息或残留时停用并回退网页原生方式。

#### 证据与依据

**依据 1 · 源码核查**：[manifest.json:27-44](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/manifest.json#L27-L44)

权限和 OAuth scope。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:302-311](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/pages/background/siteAccessRegistration.ts#L302-L311)

只对已授予来源动态注册。

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * Plugin ecosystem — dynamic content-script registration.
   *
   * Mirrors syncCustomContentScripts: derive the origins of currently-ENABLED
   * plugins, keep only those the user has already granted host permission
   * for, and (re)register the content script for them. The content script runs
   * `startPluginHost()`, which mounts the enabled plugin on the page.
   *
   * Plugin enable-state is the single source of truth (storage.local); permissions
   * and registrations are derived from it.
```

</details>

**依据 3 · 源码核查**：[src/features/export/services/ConversationExportService.ts:130-161](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/export/services/ConversationExportService.ts#L130-L161)

导出数据落地路径。

<details>
<summary>查看原文（32行）</summary>

```text
   * Export as JSON, with the same Markdown-formatted content as the Markdown export.
   */
  private static exportJSON(
    turns: ChatTurn[],
    metadata: ConversationMetadata,
    options: ExportOptions,
  ): ExportResult {
    const processedItems = turns.map((turn) => {
      const attachments = turn.userContent
        ? turn.userContent.attachments
        : (turn.attachments ?? []);
      return {
        user: turn.userContent?.text || turn.user,
        assistant: turn.assistantContent?.text || turn.assistant,
        starred: turn.starred,
        ...(attachments.length > 0 ? { attachments } : {}),
      };
    });

    const payload = {
      format: this.CHAT_JSON_FORMAT,
      url: metadata.url,
      exportedAt: metadata.exportedAt,
      count: metadata.count,
      title: metadata.title,
      items: processedItems,
    };

    const filename =
      options.filename || this.generateFilename('json', metadata.title, metadata.platform);
    this.assertNotAborted(options.signal);
    this.downloadJSON(payload, filename);
```

</details>

#### 缺口

- 未运行浏览器扩展、目标网页或导出
  **影响**：不能证明实际注入、撤销或导出内容完整
  **进一步探讨**：固定浏览器和站点版本，在非敏感对话验证权限与导出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证站点变更后的功能与撤销？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：在站点版本变化后展示插件注入、关键选择器和释放结果的可审阅健康证据，可能缩短发现失效和残留的时间；现有授权过滤、scope 释放及格式分派是反证，不是此前没有保护。对照现有 UI，在目标 DOM 改变、撤销权限、中途切换设置、长对话及附件样本上测缺失率、误报、恢复时间与隐私暴露；若不能改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:292-311](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/pages/background/siteAccessRegistration.ts#L292-L311)

已有串行与权限过滤。

<details>
<summary>查看原文（20行）</summary>

```text
  // Serialized: concurrent syncs (storage listener + permission events) would
  // otherwise race the ping-then-inject sequence and double-inject.
  let pluginContentScriptSyncQueue: Promise<void> = Promise.resolve();

  function syncPluginContentScripts(): Promise<void> {
    const next = pluginContentScriptSyncQueue.then(() => doSyncPluginContentScripts());
    pluginContentScriptSyncQueue = next.catch(() => {});
    return next;
  }

  /**
   * Plugin ecosystem — dynamic content-script registration.
   *
   * Mirrors syncCustomContentScripts: derive the origins of currently-ENABLED
   * plugins, keep only those the user has already granted host permission
   * for, and (re)register the content script for them. The content script runs
   * `startPluginHost()`, which mounts the enabled plugin on the page.
   *
   * Plugin enable-state is the single source of truth (storage.local); permissions
   * and registrations are derived from it.
```

</details>

**依据 2 · 源码核查**：[src/features/plugins/runtime/primitiveLifecycle.ts:118-138](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/plugins/runtime/primitiveLifecycle.ts#L118-L138)

已有 scope 释放。

<details>
<summary>查看原文（21行）</summary>

```text
 * Dispose the primitives' scope, then re-activate under the new settings
 * (serialized). Always chain: while a restart is still disposing there is no
 * scope to take, but the newer settings must still get their activation once
 * the queue drains — otherwise the stale restart bails on them and the plugin
 * ends up with no primitives at all.
 */
export function restartPrimitives(
  entry: PrimitiveSlot,
  settings: PluginSettings,
  env: PrimitiveEnv,
): void {
  const previous = entry.primitiveScope;
  entry.primitiveScope = undefined;
  entry.primitiveRestart = (entry.primitiveRestart ?? Promise.resolve()).then(async () => {
    if (previous) await previous.dispose();
    if (!env.isCurrent(entry)) return;
    if (entry.settings !== settings) return;
    activatePrimitives(entry, settings, env);
  });
  // Begin teardown now: an immediate unmount cannot reach the scope held by this queue.
  void previous?.dispose();
```

</details>

**依据 3 · 源码核查**：[src/features/export/services/ConversationExportService.ts:37-68](https://github.com/voyager-crew/voyager/blob/3bf32199b1fe8ecbca6fb0339ec59752d997ff92/src/features/export/services/ConversationExportService.ts#L37-L68)

已有导出分派。

<details>
<summary>查看原文（32行）</summary>

```text
   * Export conversation in specified format
   */
  static async export(
    turns: ChatTurn[],
    metadata: ConversationMetadata,
    options: ExportOptions,
  ): Promise<ExportResult> {
    try {
      this.assertNotAborted(options.signal);
      const layout: ExportLayout = options.layout ?? 'conversation';
      if (layout === 'document') {
        return await this.exportDocument(turns, metadata, options);
      }

      const conversationOptions: ExportOptions = {
        ...options,
        speakerLabels: options.speakerLabels ?? DEFAULT_EXPORT_SPEAKER_LABELS,
      };

      switch (conversationOptions.format) {
        case 'json':
          return this.exportJSON(turns, metadata, conversationOptions);

        case 'markdown':
          return await this.exportMarkdown(turns, metadata, conversationOptions);

        case 'pdf':
          return await this.exportPDF(turns, metadata, conversationOptions);

        case 'image':
          return await this.exportImage(turns, metadata, conversationOptions);

```

</details>

#### 缺口

- 未运行浏览器扩展、目标网页或导出
  **影响**：不能证明实际注入、撤销或导出内容完整
  **进一步探讨**：固定浏览器和站点版本，在非敏感对话验证权限与导出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
