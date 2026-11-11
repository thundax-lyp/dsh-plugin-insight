# Voyager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[edb6fbc](https://github.com/voyager-crew/voyager/tree/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2)

<!-- BEGIN META -->
[![GitHub ★ 20,587](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C587&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/voyager-crew/voyager) [![npm 30d 1,260](https://img.shields.io/static/v1?label=npm+30d&message=1%2C260&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager) [![最新发布 2015-02-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2015-02-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/voyager)
<!-- END META -->

> **功能**：浏览器扩展提供提示词管理，并在受支持的聊天网站提供时间线、文件夹、对话导出和公式复制。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把扩展提示词库接入自定义本地 Web 页面，减少为每个页面维护模板的需要。

> **主要限制**：[Q03](#research-q03) 端口约束用于提示词面板覆盖。浏览器权限模式按整主机申请，所以必须独立核查授予范围。

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
  - [Q01 · 哪类操作适合共享库？](#detail-section-11)
  - [Q02 · 站点授权如何通到面板？](#detail-section-12)
  - [Q03 · 配端口能否隔离浏览器权限？](#detail-section-13)
  - [Q04 · 什么条件值得试，如何退出？](#detail-section-14)
  - [Q05 · 可否让授权范围更容易核对？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在同一浏览器配置中，交替使用 DSH Web 和其他聊天网页的用户可以复用常用提示词。

用系统文本片段或本地文件查找提示词，再手工复制到各站点。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 动态站点接入 | 在获准页面加载内容脚本 | 浏览器匹配模式为主机级 |
| 提示词面板 | 从同一扩展库查找提示词 | 自定义站点覆盖受端口约束，其他网站功能须单独核实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持动态脚本的浏览器 | 必需 | 授权后加载内容脚本 | 使用手工文本库 |
| DSH Web 与自定义主机端口 | DSH 场景必需 | 定位面板 | 端口改变时重新核对设置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 设置 | 用户添加已知 DSH 地址 | 浏览器授权范围可接受 |
| 复用 | 用户在两端定位同一非敏感模板 | 文本一致且无意外面板 |
| 退出 | 用户删除站点并核对浏览器撤销 | 确认重载和已开页的实际状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 扩展和浏览器配置资源 | 授权、重载与核对 | 配置耗时未知 |
| 持续 | 本地存储和页面资源 | 整理模板及修正端口 | 节时和页面负担未测 |
| 失败恢复 | 原模板库备份 | 撤销权限与重载检查 | 已开页清理时长未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提示词查找 | 同配置的扩展存储与多站点面板 | 实际编辑器兼容及查找收益 |
| 站点控制 | 浏览器授权和面板覆盖分别判断 | 各浏览器撤销后在途页面行为 |

> **思考**：[Q03](#research-q03) 端口约束用于提示词面板覆盖。浏览器权限模式按整主机申请，所以必须独立核查授予范围。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把扩展提示词库接入自定义本地 Web 页面，减少为每个页面维护模板的需要。

[Q02](#research-q02) 动态脚本重建使用实际权限清单。页面覆盖额外读取端口，但该判断层次不同于浏览器权限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 端口约束用于提示词面板覆盖。浏览器权限模式按整主机申请，所以必须独立核查授予范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用隔离浏览器配置和一条无敏感内容的提示词，核对主机授权和两个端口。出现非预期面板或权限时撤销站点、停用扩展并恢复手工提示词库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查站点授权、内容脚本注册和提示词覆盖源码。浏览器真实授权、撤销和实际使用效果待核实。

- 已检查：作者 README、包清单、源码路径 docs/en/guide/deepseek-harness.md、manifest.json、src/pages/background/siteAccessRegistration.ts、src/core/utils/customWebsites.ts、src/pages/content/prompt/promptManagerEngine.ts、src/pages/content/index.tsx、src/pages/content/initializationEntry.ts、src/pages/background/promptLibraryOwner.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查根浏览器扩展的 DSH Web 提示词接入。未核查其他站点全部导出、备份、桥接或配置行为。
- 下一步：在同主机两个本地端口用独立浏览器配置核查授权、脚本匹配、面板可见性、提示词与撤销结果。

**分析版本**

- **仓库**：[voyager-crew/voyager](https://github.com/voyager-crew/voyager)
- **版本号**：2.3.1（[固定提交 edb6fbc](https://github.com/voyager-crew/voyager/tree/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可把主机授权和面板端口分别展示，测试用户能否识别旁端口权限并正确撤销。

在同主机两个本地端口用独立浏览器配置核查授权、脚本匹配、面板可见性、提示词与撤销结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1122 | 45352 | — | — | 511831 |
| .ts | source | 1825 | 253047 | 205051 | 27863 | — |
| .cjs | source | 6 | 1209 | 1025 | 53 | — |
| .ts | test | 1499 | 290287 | 252535 | 8790 | — |
| .mts | source | 1 | 207 | 79 | 131 | — |
| .js | source | 14 | 3228 | 2529 | 405 | — |
| .mjs | source | 16 | 1733 | 1521 | 67 | — |
| .js | test | 11 | 1501 | 1293 | 62 | — |
| .tsx | test | 114 | 23575 | 20799 | 554 | — |
| .tsx | source | 101 | 14296 | 12608 | 848 | — |
| .ts | example | 11 | 1685 | 1575 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/voyager-crew/voyager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同时用 DSH Web 与其他聊天网页的用户，能否在有限授权下复用同一提示词库？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类操作适合共享库？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在同一浏览器配置中交替使用 DSH Web 和聊天网站、会重复查找及粘贴工作模板的用户，可从扩展的提示词面板读取同一份库，减少分别维护文本文件或每个网站一份模板。合格结果是查到同一已知版本的提示词，并把正确文本放入目标页面，仍由用户决定是否发送。作者的 DSH 指南将该接入限定在提示词管理，聊天时间线、文件夹和导出不能从其他网站外推到 DSH Web。

#### 证据与依据

**依据 1 · 作者声明**：[docs/en/guide/deepseek-harness.md:28-46](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/docs/en/guide/deepseek-harness.md#L28-L46)

作者描述浏览器站点授权、面板和共享提示词库。

<details>
<summary>查看原文（19行）</summary>

```text
### 2. Add it in the popup

![Click the toolbar puzzle icon, then click Voyager to open its popup](/assets/dsh-enable-steps-en.png)

In the popup's **Site access** card, under **Other websites**, enter `localhost:3080`. Click **Add website** and grant access.

### 3. Reload the page

The floating button appears in the bottom-right corner.

![Prompt Manager running inside DeepSeek Harness](/assets/prompt-manager-deepseek-harness.png)

## One library, everywhere

You don't get a separate library per site. You get one library that follows you.

Every prompt you saved on Gemini, Claude or ChatGPT is already there when you open DSH — all of them. It works the other way too: write a prompt inside DSH and it's waiting for you back on Gemini.

Same tags, same favourites, same search.
```

</details>

**依据 2 · 作者声明**：[docs/en/guide/deepseek-harness.md:50-56](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/docs/en/guide/deepseek-harness.md#L50-L56)

作者限定 DSH 自定义站点的功能并提及端口变化。

```text
## A few notes

**The port isn't fixed.** DSH is still a developer preview, and its default port may change. If it does, just add the new one.

**Only the Prompt Manager loads.** On a custom site like DSH, Timeline, Folders and the rest won't start. (On DeepSeek's own website, many of them are available as official plugins.)

**Your prompts never leave the machine.** DSH is local, Voyager's library is local. Nothing in the chain goes out.
```

**依据 3 · 源码核查**：[src/pages/background/promptLibraryOwner.ts:14-19](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/promptLibraryOwner.ts#L14-L19)

后台提示词库操作绑定扩展本地存储。

```text

export const promptLibraryOwner = createPromptLibraryOwner({
  area: {
    get: (key) => chrome.storage.local.get(key),
    set: (items) => chrome.storage.local.set(items),
  },
```

#### 缺口

- 实际模板重复使用频率和查找时间未测。
  **影响**：无法判断相对系统文本片段工具的净收益。
  **进一步探讨**：对相同模板和两个页面记录定位时间、粘贴准确率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 站点授权如何通到面板？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

后台将设置中的自定义站点展开为匹配模式，再检查浏览器实际权限。它注销旧的动态注册，仅在存在已授权匹配时登记新的内容脚本。内容页对未识别站点用 location.host 检查提示词覆盖，再进入自定义覆盖初始化。面板监听同步区中的站点配置变化，使用同一覆盖函数判断是否启用。注册脚本、面板挂载和某网站输入控件的兼容性分别要检查。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:124-135](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/siteAccessRegistration.ts#L124-L135)

权限读取失败或未获准不会加入获准模式。

<details>
<summary>查看原文（12行）</summary>

```text
  async function filterGrantedOrigins(patterns: string[]): Promise<string[]> {
    const granted: string[] = [];

    for (const origin of patterns) {
      try {
        const hasPermission = await browser.permissions.contains({ origins: [origin] });
        if (hasPermission) {
          granted.push(origin);
        }
      } catch (error) {
        console.warn('[Background] Failed to check permission for', origin, error);
      }
```

</details>

**依据 2 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:151-179](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/siteAccessRegistration.ts#L151-L179)

以已授权模式重建动态脚本。

<details>
<summary>查看原文（29行）</summary>

```text
  async function doSyncCustomContentScripts(domains?: string[]): Promise<void> {
    if (!chrome.scripting?.registerContentScripts) return;

    const manifestContentScript = chrome.runtime.getManifest().content_scripts?.[0];
    if (!manifestContentScript) return;

    const domainList =
      domains ??
      (
        await chrome.storage.sync.get({
          [CUSTOM_WEBSITE_KEY]: [],
        })
      )[CUSTOM_WEBSITE_KEY];

    const matchPatterns = Array.from(
      new Set(
        (Array.isArray(domainList) ? domainList : []).flatMap(toMatchPatterns).filter(Boolean),
      ),
    );

    const grantedMatches = await filterGrantedOrigins(matchPatterns);

    try {
      await chrome.scripting.unregisterContentScripts({ ids: [CUSTOM_CONTENT_SCRIPT_ID] });
    } catch {
      // No-op if script was not registered
    }

    if (!grantedMatches.length) return;
```

</details>

**依据 3 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:195-209](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/siteAccessRegistration.ts#L195-L209)

只把 grantedMatches 放入注册。

<details>
<summary>查看原文（15行）</summary>

```text
    try {
      await chrome.scripting.registerContentScripts([
        {
          id: CUSTOM_CONTENT_SCRIPT_ID,
          js: jsResources,
          css: cssResources,
          matches: grantedMatches,
          allFrames: manifestContentScript.all_frames,
          runAt,
          persistAcrossSessions: true,
        },
      ]);
      logger.info('[Background] Custom content scripts registered', { matches: grantedMatches });
    } catch (error) {
      console.error('[Background] Failed to register custom content scripts:', error);
```

</details>

**依据 4 · 源码核查**：[src/pages/content/index.tsx:418-422](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/content/index.tsx#L418-L422)

未知站点先读覆盖。

```text
      // Any other site runs only while a custom entry covers it.
      void readPromptCoverage(location.host).then((covered) => {
        if (covered) initializeFeatures();
      });
      return;
```

**依据 5 · 源码核查**：[src/pages/content/initializationEntry.ts:27-39](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/content/initializationEntry.ts#L27-L39)

自定义站点进入 followCoverage 分支。

<details>
<summary>查看原文（13行）</summary>

```text
export async function enterInitialization(
  page: Pick<Location, 'host' | 'hostname' | 'pathname' | 'search' | 'hash'>,
  doc: Document,
  deps: InitializationEntryDeps,
): Promise<InitializationEntry> {
  const readCoverage = deps.readCoverage ?? readPromptCoverage;
  const covered = await deps.settle(readCoverage(page.host));
  if (deps.beforeMount) await deps.settle(deps.beforeMount());
  if (covered) {
    await deps.settle(deps.followCoverage(page.host));
    return 'custom-coverage';
  }

```

</details>

**依据 6 · 源码核查**：[src/pages/content/prompt/promptManagerEngine.ts:191-208](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/content/prompt/promptManagerEngine.ts#L191-L208)

面板在同步区覆盖设置控制下启动。

<details>
<summary>查看原文（18行）</summary>

```text
    async followCoverage(host) {
      // Catalog pages have one panel owner: their coverage-bound PluginHost plugin.
      if (promptCoverageBindingForUrl(location.href)) return;
      const coverage = createNativeFeatureToggle(
        cleanup,
        {
          ...panel,
          toggle: {
            key: StorageKeys.PROMPT_CUSTOM_WEBSITES,
            isEnabled: (value) => customWebsitesIncludeHost(value, host),
            areas: ['sync'],
          },
        },
        lifetime,
        beforeMount,
      );
      follow(coverage);
      await applyInitial(coverage, await readPromptCoverage(host), 'the Prompt Manager');
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配端口能否隔离浏览器权限？

**研究主题**：缺陷与关键质疑

#### 完整回答

扩展应用内的覆盖检查要求固定的 hostname 和 port 对上。浏览器站点权限使用整主机模式，连具体端口都不编码。于是同一主机另一端口可以落入浏览器权限或内容脚本匹配范围，即使该端口没有提示词面板。扩展声明的可选全站能力也不说明用户已授予所有站点。站点清单在扩展同步存储，提示词库后台使用扩展本地存储，不能由此推定所有导出、备份或用户提交的数据均保持本地。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/utils/customWebsites.ts:94-110](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/core/utils/customWebsites.ts#L94-L110)

应用覆盖对明确端口做相等比较。

<details>
<summary>查看原文（17行）</summary>

```text
export function customWebsitesIncludeHost(value: unknown, host: string): boolean {
  const current = splitHostPort(
    host
      .trim()
      .toLowerCase()
      .replace(/^www\./, ''),
  );
  if (!current) return false;

  return sanitizeCustomWebsites(value).some((website) => {
    const entry = splitHostPort(website);
    if (!entry) return false;
    if (entry.port !== null) {
      return current.hostname === entry.hostname && current.port === entry.port;
    }
    return current.hostname === entry.hostname || current.hostname.endsWith(`.${entry.hostname}`);
  });
```

</details>

**依据 2 · 源码核查**：[src/core/utils/customWebsites.ts:113-130](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/core/utils/customWebsites.ts#L113-L130)

主机权限模式不含端口，并列本地 HTTP 与 HTTPS。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Host permission patterns to request for a stored entry.
 *
 * Extension match patterns cannot carry a port, so a port-pinned entry still has
 * to be granted for the whole host — the port only narrows where the content
 * script actually runs. Loopback and IP hosts also cannot take the `*.`
 * subdomain wildcard.
 */
export function customWebsiteOriginPatterns(value: unknown): string[] | null {
  const normalized = normalizeCustomWebsite(value);
  if (!normalized) return null;

  const parts = splitHostPort(normalized);
  if (!parts) return null;

  const { hostname } = parts;
  if (isLocalHostname(hostname)) return [`http://${hostname}/*`, `https://${hostname}/*`];
  return [`https://*.${hostname}/*`, `http://*.${hostname}/*`];
```

</details>

**依据 3 · 源码核查**：[manifest.json:27-44](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/manifest.json#L27-L44)

清单声明 scripting 和可选站点权限。

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

**依据 4 · 源码核查**：[src/pages/content/prompt/promptManagerEngine.ts:58-66](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/content/prompt/promptManagerEngine.ts#L58-L66)

站点覆盖设置读同步存储。

```text
/** Whether the custom-website list covers `host`, a `location.host`-shaped value. */
export async function readPromptCoverage(host: string): Promise<boolean> {
  try {
    const result = await chrome.storage.sync.get({ [StorageKeys.PROMPT_CUSTOM_WEBSITES]: [] });
    return customWebsitesIncludeHost(result?.[StorageKeys.PROMPT_CUSTOM_WEBSITES], host);
  } catch (error) {
    warnUnlessInvalidated('Failed to read the custom-website list', error);
    return false;
  }
```

**依据 5 · 源码核查**：[src/pages/background/promptLibraryOwner.ts:14-19](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/promptLibraryOwner.ts#L14-L19)

提示词库通过扩展本地存储读写。

```text

export const promptLibraryOwner = createPromptLibraryOwner({
  area: {
    get: (key) => chrome.storage.local.get(key),
    set: (items) => chrome.storage.local.set(items),
  },
```

#### 缺口

- 未在支持的各浏览器检查授权提示、旁端口注入和撤销状态。
  **影响**：用户无法仅凭面板消失确认站点权限已移除。
  **进一步探讨**：用两个本地端口检查扩展权限列表、脚本注册和面板变化。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件值得试，如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要已可访问的 DSH Web、支持扩展与动态脚本注册的浏览器，以及明确的站点授权。使用隔离浏览器配置，只存一条非敏感提示词，在 DSH Web 和另一获准页面核对检索、输入文本和页面状态。若提示词面板出现在意外站点，或浏览器授权主机范围超出接受范围，删除自定义站点并在浏览器管理页核查和撤销权限，必要时停用扩展，回到手工文本库。首次成本是安装、授权及两端检查，持续成本是维护模板和跟随端口变化，故障成本是重载与权限核验。

#### 证据与依据

**依据 1 · 作者声明**：[docs/en/guide/deepseek-harness.md:17-36](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/docs/en/guide/deepseek-harness.md#L17-L36)

作者给出 DSH Web、添加网站和重载步骤。

<details>
<summary>查看原文（20行）</summary>

````text
## Three steps

### 1. Start DSH

```bash
npm i -g @deepseek-ai/dsh
dsh web
```

Open `http://localhost:3080` in your browser.

### 2. Add it in the popup

![Click the toolbar puzzle icon, then click Voyager to open its popup](/assets/dsh-enable-steps-en.png)

In the popup's **Site access** card, under **Other websites**, enter `localhost:3080`. Click **Add website** and grant access.

### 3. Reload the page

The floating button appears in the bottom-right corner.
````

</details>

**依据 2 · 作者声明**：[docs/en/guide/deepseek-harness.md:50-54](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/docs/en/guide/deepseek-harness.md#L50-L54)

作者说明端口可能变化和自定义站点功能边界。

```text
## A few notes

**The port isn't fixed.** DSH is still a developer preview, and its default port may change. If it does, just add the new one.

**Only the Prompt Manager loads.** On a custom site like DSH, Timeline, Folders and the rest won't start. (On DeepSeek's own website, many of them are available as official plugins.)
```

**依据 3 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:171-179](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/siteAccessRegistration.ts#L171-L179)

新注册前注销旧内容脚本，但不会证明已注入的标签页即时卸载。

```text
    const grantedMatches = await filterGrantedOrigins(matchPatterns);

    try {
      await chrome.scripting.unregisterContentScripts({ ids: [CUSTOM_CONTENT_SCRIPT_ID] });
    } catch {
      // No-op if script was not registered
    }

    if (!grantedMatches.length) return;
```

**依据 4 · 源码核查**：[src/core/utils/customWebsites.ts:113-130](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/core/utils/customWebsites.ts#L113-L130)

整主机授权可能超过所需端口。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Host permission patterns to request for a stored entry.
 *
 * Extension match patterns cannot carry a port, so a port-pinned entry still has
 * to be granted for the whole host — the port only narrows where the content
 * script actually runs. Loopback and IP hosts also cannot take the `*.`
 * subdomain wildcard.
 */
export function customWebsiteOriginPatterns(value: unknown): string[] | null {
  const normalized = normalizeCustomWebsite(value);
  if (!normalized) return null;

  const parts = splitHostPort(normalized);
  if (!parts) return null;

  const { hostname } = parts;
  if (isLocalHostname(hostname)) return [`http://${hostname}/*`, `https://${hostname}/*`];
  return [`https://*.${hostname}/*`, `http://*.${hostname}/*`];
```

</details>

#### 缺口

- 撤销后既有页面的即时清理和浏览器配置迁移未验收。
  **影响**：实际退出时间与保存模板的迁移成本未知。
  **进一步探讨**：在两个端口的已开标签和重载标签对比清理，检查浏览器权限并恢复手工库。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否让授权范围更容易核对？

**研究主题**：新假设与验证

#### 完整回答

可以在添加自定义站点时分别显示浏览器将授予的主机范围与提示词面板的端口范围，撤销时再次显示两者当前状态。现在两种范围各有代码表示，用户却可能以单一地址理解整项授权。对同一主机的两个端口比较现有设置与双范围界面，测用户能否准确预测旁端口权限、完成撤销，以及新增理解时间。如果正确率未提升，或用户误将提示面板范围仍当作权限边界，方案需要放弃或重新设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/utils/customWebsites.ts:94-130](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/core/utils/customWebsites.ts#L94-L130)

应用内覆盖和授予主机权限使用两种不同匹配规则。

<details>
<summary>查看原文（37行）</summary>

```text
export function customWebsitesIncludeHost(value: unknown, host: string): boolean {
  const current = splitHostPort(
    host
      .trim()
      .toLowerCase()
      .replace(/^www\./, ''),
  );
  if (!current) return false;

  return sanitizeCustomWebsites(value).some((website) => {
    const entry = splitHostPort(website);
    if (!entry) return false;
    if (entry.port !== null) {
      return current.hostname === entry.hostname && current.port === entry.port;
    }
    return current.hostname === entry.hostname || current.hostname.endsWith(`.${entry.hostname}`);
  });
}

/**
 * Host permission patterns to request for a stored entry.
 *
 * Extension match patterns cannot carry a port, so a port-pinned entry still has
 * to be granted for the whole host — the port only narrows where the content
 * script actually runs. Loopback and IP hosts also cannot take the `*.`
 * subdomain wildcard.
 */
export function customWebsiteOriginPatterns(value: unknown): string[] | null {
  const normalized = normalizeCustomWebsite(value);
  if (!normalized) return null;

  const parts = splitHostPort(normalized);
  if (!parts) return null;

  const { hostname } = parts;
  if (isLocalHostname(hostname)) return [`http://${hostname}/*`, `https://${hostname}/*`];
  return [`https://*.${hostname}/*`, `http://*.${hostname}/*`];
```

</details>

**依据 2 · 源码核查**：[src/pages/background/siteAccessRegistration.ts:165-179](https://github.com/voyager-crew/voyager/blob/edb6fbc3d83ec18acb40ffa538f7368009c6bcb2/src/pages/background/siteAccessRegistration.ts#L165-L179)

注册基于匹配模式及浏览器实际授权。

<details>
<summary>查看原文（15行）</summary>

```text
    const matchPatterns = Array.from(
      new Set(
        (Array.isArray(domainList) ? domainList : []).flatMap(toMatchPatterns).filter(Boolean),
      ),
    );

    const grantedMatches = await filterGrantedOrigins(matchPatterns);

    try {
      await chrome.scripting.unregisterContentScripts({ ids: [CUSTOM_CONTENT_SCRIPT_ID] });
    } catch {
      // No-op if script was not registered
    }

    if (!grantedMatches.length) return;
```

</details>

#### 缺口

- 未实现双范围提示的对照原型。
  **影响**：是否减少误授权和误解未知。
  **进一步探讨**：用同主机双端口的模拟授权任务做可预测性与撤销对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
