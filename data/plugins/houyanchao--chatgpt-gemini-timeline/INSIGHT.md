# Timeline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[cfaa5c6](https://github.com/houyanchao/chatgpt-gemini-timeline/tree/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6)

<!-- BEGIN META -->
[![GitHub ★ 469](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=469&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/houyanchao/chatgpt-gemini-timeline)
<!-- END META -->

> **功能**：为 AI 网页对话提供时间轴、收藏、提示词与导出等辅助能力的浏览器扩展

> **亮点**：[Q02](#research-q02) 将虚拟化页面接口快照与当前对话缓存结合，补齐提问导航文案并管理SPA生命周期。

> **主要限制**：[Q03](#research-q03) 未捕获的轮次只能回退缓存/占位，接口匹配和DOM落点随平台变化；节点出现不等于完整或正确导航。

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
  - [Q01 · 根对象属于什么类型，为谁解决什么？](#detail-section-11)
  - [Q02 · 提问文本怎样变成可点击节点？](#detail-section-12)
  - [Q03 · 虚拟化和页面变化会留下什么未知，权限如何影响选择？](#detail-section-13)
  - [Q04 · 谁可试用，怎样判断时间轴比滚动更好？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向频繁回看AI网页长会话的用户，用提问节点导航和整理对话；根是浏览器扩展。

页面滚动、浏览器查找与手工收藏；DSH原生dsh-timeline在另一仓库，不借其身份。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 时间轴导航 | 按提问定位历史轮次 | 受接口捕获和DOM兼容约束 |
| 当前对话文本缓存 | 补虚拟化轮次文案 | 缺捕获时可能占位 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持扩展的浏览器与权限 | 必需 | 内容脚本和本地状态 | 保留原页面 |
| 受支持站点DOM/API | 时间轴必需 | 识别轮次与获取文本 | 占位/降级时人工查找 |
| 非敏感样本和数据备份 | 试用必需 | 评估权限与退出 | 不迁入重要收藏/备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户单站点非敏感会话试用 | 能见预期节点和文案 |
| 2 | 用户点已知轮次并切换会话 | 落点正确且不串缓存 |
| 3 | 用户禁用并核原页面 | 缺节点/误跳则回滚动查找 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 浏览器扩展存储 | 核权限、选择平台和备份 | 耗时未知 |
| 持续 | 页面脚本/缓存资源 | 适配变更与整理收藏 | 内存/节时未测 |
| 失败恢复 | 导出或重建本地状态 | 辨认占位和误跳 | 未审计云备份完整性 |
| 退出 | 保留必要导出文件 | 关闭扩展回原页面 | 收藏迁移单独核实 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 长对话定位 | 提问缓存与marker跳转 | 真实页面覆盖和查找时间 |
| 降级可解释 | 无捕获退占位的机制 | 用户能否识别遗漏 |

> **思考**：[Q03](#research-q03) 未捕获的轮次只能回退缓存/占位，接口匹配和DOM落点随平台变化；节点出现不等于完整或正确导航。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将虚拟化页面接口快照与当前对话缓存结合，补齐提问导航文案并管理SPA生命周期。

[Q02](#research-q02) 请求序号与路由版本防过期更新可借鉴；[Q03](#research-q03)接口/DOM耦合要求持续兼容核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 未捕获的轮次只能回退缓存/占位，接口匹配和DOM落点随平台变化；节点出现不等于完整或正确导航。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 接受权限者先用单站非敏感长会话核已知节点和落点；缺失、误跳或缓存串会话时关闭功能并回原页面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

浏览器导航接线与捕获降级有源码支持；当前真实站点兼容、覆盖和提效未实测。

- 已检查：作者 README、包清单、源码路径 README.md、manifest.json、js/timeline/index.js、js/timeline/adapters/chatgpt.js、js/apiCapture/chatgpt.js、js/timeline/timeline-manager.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Manifest、时间轴entry、ChatGPT adapter/接口捕获和manager点击链；未全面审计全部站点、备份、导出、运行器和宠物。
- 下一步：同浏览器同会话比较原页面、当前时间轴与覆盖提示版，包含首次未渲染轮次/SPA切页，测误跳漏找、查找时间和内存。

**分析版本**

- **仓库**：[houyanchao/chatgpt-gemini-timeline](https://github.com/houyanchao/chatgpt-gemini-timeline)
- **版本号**：4.7.7（[固定提交 cfaa5c6](https://github.com/houyanchao/chatgpt-gemini-timeline/tree/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6)）
- **版本日期**：2026-09-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导明确展示节点数据来源/覆盖状态的未验证改进，以误找、误跳和耗时比较，无改善则推翻。

同浏览器同会话比较原页面、当前时间轴与覆盖提示版，包含首次未渲染轮次/SPA切页，测误跳漏找、查找时间和内存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 174 | 54044 | 37922 | 9850 | — |
| .md | source | 10 | 2048 | — | — | 12627 |

</details>

**活跃度**

[![Issue 未关闭 104](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=104&color=737b86&logo=github)](https://github.com/houyanchao/chatgpt-gemini-timeline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=15&color=737b86&logo=github)](https://github.com/houyanchao/chatgpt-gemini-timeline/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/houyanchao/chatgpt-gemini-timeline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器长对话时间轴在页面虚拟化与变化时能否提供可信定位？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根对象属于什么类型，为谁解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本根仓库是Manifest V3浏览器扩展，按通用工具tool建档；README明确DSH原生版本在另一个dsh-timeline仓库，不能把它作为本根已验收能力。目标是经常回看长AI会话的人，合格结果是找到指定历史提问并跳到正确轮次。基线是页面滚动、浏览器查找和手工收藏；实际增量是按提问建立导航和整理入口。收藏、导出、备份等为附加能力，本轮重点核查ChatGPT时间轴主线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-40](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/README.md#L24-L40)

独立DSH仓库与长对话问题

<details>
<summary>查看原文（17行）</summary>

```text
## DeepSeek Harness

Timeline 现已支持 DeepSeek Harness。如果你在用 DeepSeek Harness，可以安装原生插件 **dsh-timeline** —— 时间轴、收藏文件夹、提示词库、对话导出、公式复制，熟悉的功能都在，主题跟随、开箱即用。

仓库地址：<https://github.com/houyanchao/dsh-timeline>

## Timeline是什么？

Timeline 是专为 ChatGPT、Gemini、DeepSeek 等 AI 对话页面打造的浏览器提效插件。它不改平台原有界面，只在页面里补上长对话真正缺的能力：时间轴导航、收藏整理、提示词库、对话导出、公式复制和数据备份。

和 AI 聊得越久，翻找就越费劲：

- 想回看某次提问，只能一路往上滚。
- 有价值的结论散落在不同会话里，事后很难再找到。
- 公式、代码、图表不好带走，复制粘贴也费事。
- 各平台输入习惯不一样，常用提示词和追问流程要反复操作。
- 插件数据困在单个浏览器里，换设备或换浏览器不好迁移。
```

</details>

**依据 2 · 源码核查**：[manifest.json:1-28](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/manifest.json#L1-L28)

浏览器扩展版本、权限和content script

<details>
<summary>查看原文（28行）</summary>

```text
{
  "manifest_version": 3,
  "name": "__MSG_extName__",
  "short_name": "Timeline",
  "version": "4.7.7",
  "description": "__MSG_extDescription__",
  "default_locale": "en",
  "author": "yanchao hou",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  
  "permissions": [
    "storage",
    "unlimitedStorage",
    "identity",
    "activeTab"
  ],
  
  "background": {
    "service_worker": "js/background.js"
  },
  
  "content_scripts": [
    {
      "matches": [
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提问文本怎样变成可点击节点？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

entry选择站点adapter，确认路由与用户消息选择器后启动，重试带initVersion防切页后的过期初始化。ChatGPT adapter维护当前对话文本缓存，向MAIN world捕获模块发同步事件取接口快照。捕获模块包装页面fetch，识别会话GET响应后clone JSON，按请求序号避免旧响应覆盖新数据。manager订阅当前会话文本更新补占位文案，点击时间轴点按targetTurnId找marker.element并smoothScrollTo。因此贡献是把网页提问和导航生命周期连起来，尤其缓解虚拟化下DOM未保留文本；不是平台原生消息存储能力。

#### 证据与依据

**依据 1 · 源码核查**：[js/timeline/index.js:25-35](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/index.js#L25-L35)

adapter与会话路由

<details>
<summary>查看原文（11行）</summary>

```text
// Check if current route is a conversation page (uses adapter)
async function resolveCurrentAdapter() {
    if (!currentAdapter) {
        currentAdapter = await adapterRegistry.detectAdapter();
    }
    return currentAdapter;
}

async function isConversationRoute(pathname = location.pathname) {
    const currentAdapter = await resolveCurrentAdapter();
    return currentAdapter ? currentAdapter.isConversationRoute(pathname) : false;
```

</details>

**依据 2 · 源码核查**：[js/timeline/index.js:64-90](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/index.js#L64-L90)

选择器检查和过期重试取消

<details>
<summary>查看原文（27行）</summary>

```text
// Helper function: lightweight check if timeline can be initialized
async function canInitialize() {
    const adapter = await resolveCurrentAdapter();
    if (!adapter) return false;
    
    adapter.prepareTimelineNodes?.({
        force: true,
        reason: 'initialization-check'
    });
    const selector = adapter.getUserMessageSelector();
    if (!selector) return false;
    return document.querySelector(selector) !== null;
}

// Initialize timeline with retry mechanism (exponential backoff)
async function initWithRetry(version, delays, retryIndex = 0) {
    // Check if we've exceeded max retries
    if (retryIndex >= delays.length) {
        return;
    }
    
    // Wait for the specified delay
    await sleep(delays[retryIndex]);
    
    // Check if version is still current (user may have navigated away)
    if (version !== initVersion) {
        return; // Version mismatch, cancel this retry
```

</details>

**依据 3 · 源码核查**：[js/timeline/adapters/chatgpt.js:39-74](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/adapters/chatgpt.js#L39-L74)

接口快照缓存合并

<details>
<summary>查看原文（36行）</summary>

```text
    _pullConvTexts(conversationId) {
        let received = null;
        const handler = (event) => {
            if (typeof event.detail !== 'string') return;
            try {
                const payload = JSON.parse(event.detail);
                if (payload?.conversationId === conversationId) received = payload;
            } catch {
                received = null;
            }
        };
        document.addEventListener('ait-gpt-user-texts-result', handler, { once: true });
        document.dispatchEvent(new CustomEvent('ait-gpt-user-texts-pull', {
            detail: conversationId
        }));
        document.removeEventListener('ait-gpt-user-texts-result', handler);

        const texts = received ? received.texts : null;
        if (!texts) return 0;

        const nextCapturedTextIds = new Set(Object.keys(texts));
        let changedCount = 0;
        // 只清理上一份 API 快照拥有、但最新快照已不存在的键。
        // DOM 机会性缓存的新增消息不在 _capturedTextIds 中，因此会被保留。
        this._capturedTextIds.forEach(id => {
            if (!nextCapturedTextIds.has(id) && this._turnTextCache.delete(id)) {
                changedCount++;
            }
        });
        Object.entries(texts).forEach(([id, txt]) => {
            const previous = this._turnTextCache.get(id);
            this._cacheTurnText(id, txt);
            if (this._turnTextCache.get(id) !== previous) changedCount++;
        });
        this._capturedTextIds = nextCapturedTextIds;
        return changedCount;
```

</details>

**依据 4 · 源码核查**：[js/apiCapture/chatgpt.js:151-179](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/apiCapture/chatgpt.js#L151-L179)

真实fetch响应捕获与序号保护

<details>
<summary>查看原文（29行）</summary>

```text
  // ---- fetch 补丁 ----
  // 匹配 GET /backend-api/conversation/{uuid}（POST /backend-api/conversation 是发消息的 SSE 流，排除）
  const CONV_URL_RE = /\/backend-api\/conversation\/([0-9a-f][0-9a-f-]{18,})(?:[?#]|$)/i;
  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const p = origFetch.apply(this, args);
    try {
      const rawUrl = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      const method = String(args[1]?.method || (typeof args[0] === 'object' ? args[0]?.method : '') || 'GET').toUpperCase();
      const match = rawUrl.match(CONV_URL_RE);
      if (match && method === 'GET') {
        const conversationId = match[1];
        const requestSequence = ++nextRequestSequence;
        p.then(resp => {
          if (resp && resp.ok) {
            resp.clone().json()
              .then(json => {
                const latestApplied = latestAppliedRequestByConversation.get(conversationId) || 0;
                if (requestSequence < latestApplied) return;
                if (capture(conversationId, json)) {
                  latestAppliedRequestByConversation.set(conversationId, requestSequence);
                }
              })
              .catch(() => {});
          }
        }).catch(() => {});
      }
    } catch { /* 补丁逻辑绝不影响页面请求本身 */ }
    return p;
```

</details>

**依据 5 · 源码核查**：[js/timeline/timeline-manager.js:1820-1854](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/timeline-manager.js#L1820-L1854)

更新订阅及点击到滚动

<details>
<summary>查看原文（35行）</summary>

```text
    setupEventListeners() {
        // 平台适配器完成外部数据同步后，只补齐占位符文案，不重建节点几何信息。
        this._unsubscribeCapturedChatsData = this.adapter.subscribeCapturedChatsDataUpdated?.((detail) => {
            if (this._destroyed) return;
            const conversationId = detail?.conversationId;
            if (!conversationId || conversationId !== this.conversationId) return;
            this.refreshPlaceholderSummaries();
        }) || null;

        // ✅ 长按标记功能：长按节点切换图钉
        let longPressTimer = null;
        let longPressTarget = null;
        let longPressStartPos = null;
        let longPressTriggered = false; // 标记长按是否已触发，用于阻止点击事件
        
        this.onTimelineBarClick = (e) => {
            // ✅ 如果刚刚触发了长按，阻止点击事件（避免长按后又滚动）
            if (longPressTriggered) {
                longPressTriggered = false;
                return;
            }
            
            const dot = e.target.closest('.ait-timeline-dot');
            if (dot) {
                const targetId = dot.dataset.targetTurnId;
                // Find target element by matching marker ID
                const marker = this.markers.find(m => m.id === targetId);
                const targetElement = marker?.element;
                if (targetElement) {
                    // Only scroll; let scroll-based computation set active to avoid double-flash
                    this.smoothScrollTo(targetElement);
                }
            }
        };
        this.ui.timelineBar.addEventListener('click', this.onTimelineBarClick);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 虚拟化和页面变化会留下什么未知，权限如何影响选择？

**研究主题**：缺陷与关键质疑

#### 完整回答

adapter说明接口未捕获时回退渲染期缓存和占位符；从未渲染轮次在DOM中没有文本，缓存补全不是无条件保证。捕获只识别特定/backend-api/conversation GET格式，异常静默，不会由一次节点出现证明全会话覆盖。点击还依赖marker仍有目标元素；文案完整和几何跳转正确需分别验收。manifest广泛匹配all_urls并有storage/unlimitedStorage/identity权限，实际站点检测收窄功能并不取消权限范围，用户需结合信任与资料敏感性选择。此范围未全面审计云备份、导出或代码运行功能。 manifest 为 ChatGPT 捕获脚本单列 MAIN world/document_start，而另一个内容脚本匹配 all_urls；这两类接入范围需分开读，不把捕获脚本误写成监听所有网站的相同接口。

#### 证据与依据

**依据 1 · 源码核查**：[js/timeline/adapters/chatgpt.js:14-35](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/adapters/chatgpt.js#L14-L35)

虚拟化与缺捕获的降级链

<details>
<summary>查看原文（22行）</summary>

```text
        // 内存文本缓存：nodeId → 提问文本（仅当前对话有效，切换对话 URL 时清空）
        // 新版虚拟化会把视口外轮次的 React 子树整体卸载（DOM/fiber 均无文本），
        // 只能在轮次渲染出来时缓存，空壳期回退缓存值
        this._turnTextCache = new Map();
        this._capturedTextIds = new Set(); // 上一份 API 完整快照包含的消息 ID
        this._textCacheConvId = null; // 缓存所属的对话 id
        this._turnRolesDirty = true;
        this._usesVirtualizedTurnSelector = false;
    }

    /**
     * 从 MAIN world 接口拦截模块（apiCapture/chatgpt.js）同步拉取
     * 当前对话的全量提问文本，同步进当前对话的内存缓存。
     *
     * 数据来源：模块在 document_start 补丁 fetch，捕获页面自己发起的
     * GET /backend-api/conversation/{id} 响应 mapping —— 这是唯一能让
     * 「从未渲染过的虚拟化轮次」在首次渲染时就有文案的数据源
     * （DOM/fiber 里物理不存在，调试探测已证实）。
     *
     * 同步事件往返，模块未就绪/未捕获到数据时静默返回，走既有降级链
     * （渲染期缓存 → 占位符）。切换对话时先拉取一次；如果接口稍后才完成，
     * 拦截模块会派发更新事件，由时间轴再次拉取，不做轮询。
```

</details>

**依据 2 · 源码核查**：[js/apiCapture/chatgpt.js:153-179](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/apiCapture/chatgpt.js#L153-L179)

特定接口匹配与静默异常

<details>
<summary>查看原文（27行）</summary>

```text
  const CONV_URL_RE = /\/backend-api\/conversation\/([0-9a-f][0-9a-f-]{18,})(?:[?#]|$)/i;
  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const p = origFetch.apply(this, args);
    try {
      const rawUrl = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      const method = String(args[1]?.method || (typeof args[0] === 'object' ? args[0]?.method : '') || 'GET').toUpperCase();
      const match = rawUrl.match(CONV_URL_RE);
      if (match && method === 'GET') {
        const conversationId = match[1];
        const requestSequence = ++nextRequestSequence;
        p.then(resp => {
          if (resp && resp.ok) {
            resp.clone().json()
              .then(json => {
                const latestApplied = latestAppliedRequestByConversation.get(conversationId) || 0;
                if (requestSequence < latestApplied) return;
                if (capture(conversationId, json)) {
                  latestAppliedRequestByConversation.set(conversationId, requestSequence);
                }
              })
              .catch(() => {});
          }
        }).catch(() => {});
      }
    } catch { /* 补丁逻辑绝不影响页面请求本身 */ }
    return p;
```

</details>

**依据 3 · 源码核查**：[js/timeline/timeline-manager.js:1842-1850](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/timeline-manager.js#L1842-L1850)

跳转依赖marker元素

```text
            const dot = e.target.closest('.ait-timeline-dot');
            if (dot) {
                const targetId = dot.dataset.targetTurnId;
                // Find target element by matching marker ID
                const marker = this.markers.find(m => m.id === targetId);
                const targetElement = marker?.element;
                if (targetElement) {
                    // Only scroll; let scroll-based computation set active to avoid double-flash
                    this.smoothScrollTo(targetElement);
```

**依据 4 · 源码核查**：[manifest.json:15-40](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/manifest.json#L15-L40)

权限与all_urls注入范围

<details>
<summary>查看原文（26行）</summary>

```text
  "permissions": [
    "storage",
    "unlimitedStorage",
    "identity",
    "activeTab"
  ],
  
  "background": {
    "service_worker": "js/background.js"
  },
  
  "content_scripts": [
    {
      "matches": [
        "https://chatgpt.com/*",
        "https://chat.openai.com/*"
      ],
      "js": [
        "js/apiCapture/chatgpt.js"
      ],
      "world": "MAIN",
      "run_at": "document_start"
    },
    {
      "matches": [
        "<all_urls>"
```

</details>

#### 缺口

- 当前真实网页DOM/API兼容及虚拟化长会话覆盖率未知
  **影响**：不能保证完整回看或所有平台可用
  **进一步探讨**：选非敏感长对话，核节点文案、首次未渲染轮次与点击落点

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可试用，怎样判断时间轴比滚动更好？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

频繁回看长会话且接受浏览器扩展权限的用户可先在一个非敏感站点试用，核对已知轮次、切会话和禁用后恢复页面。首次是安装/权限与备份已有扩展数据，持续有浏览器资源和页面适配维护，失败退回原页面滚动/查找；没有本轮查找节时和内存数据。由捕获/占位降级推导未验证假设：显示“当前节点已捕获、DOM缓存或未加载”覆盖状态，可减少误以为时间轴完整。对同一长会话比较普通滚动、当前时间轴和加覆盖提示版本，测找到正确轮次时间、漏找与误跳；无改善或提示负担抵消导航收益则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-53](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/README.md#L42-L53)

安装和按功能停用的作者说明

<details>
<summary>查看原文（12行）</summary>

```text
## 安装

推荐通过浏览器官方商店安装：

| 浏览器 | 安装入口 |
| --- | --- |
| Chrome | **[安装 Chrome 版](https://chromewebstore.google.com/detail/timeline-ai-chat/fgebdnlceacaiaeikopldglhffljjlhh)** |
| Microsoft Edge | **[安装 Edge 版](https://microsoftedge.microsoft.com/addons/detail/ai-timeline%EF%BC%9A%E5%8A%A9%E4%BD%A0%E4%BD%BF%E7%94%A8-ai-%E6%95%88%E7%8E%87%E7%BF%BB%E5%80%8D-/ekednjjojnhlajfobalaaihkibbdcbab)** |
| Firefox | **[安装 Firefox 版](https://addons.mozilla.org/en-US/firefox/addon/ai-timeline/)** |
| DeepSeek Harness | **[前往 GitHub 安装 dsh-timeline](https://github.com/houyanchao/dsh-timeline)** |

安装后打开受支持的 AI 对话页面即可使用。大多数功能默认开启，也可以在扩展设置面板中按平台或功能关闭。
```

</details>

**依据 2 · 源码核查**：[js/timeline/adapters/chatgpt.js:14-35](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/adapters/chatgpt.js#L14-L35)

捕获/占位状态提供假设依据

<details>
<summary>查看原文（22行）</summary>

```text
        // 内存文本缓存：nodeId → 提问文本（仅当前对话有效，切换对话 URL 时清空）
        // 新版虚拟化会把视口外轮次的 React 子树整体卸载（DOM/fiber 均无文本），
        // 只能在轮次渲染出来时缓存，空壳期回退缓存值
        this._turnTextCache = new Map();
        this._capturedTextIds = new Set(); // 上一份 API 完整快照包含的消息 ID
        this._textCacheConvId = null; // 缓存所属的对话 id
        this._turnRolesDirty = true;
        this._usesVirtualizedTurnSelector = false;
    }

    /**
     * 从 MAIN world 接口拦截模块（apiCapture/chatgpt.js）同步拉取
     * 当前对话的全量提问文本，同步进当前对话的内存缓存。
     *
     * 数据来源：模块在 document_start 补丁 fetch，捕获页面自己发起的
     * GET /backend-api/conversation/{id} 响应 mapping —— 这是唯一能让
     * 「从未渲染过的虚拟化轮次」在首次渲染时就有文案的数据源
     * （DOM/fiber 里物理不存在，调试探测已证实）。
     *
     * 同步事件往返，模块未就绪/未捕获到数据时静默返回，走既有降级链
     * （渲染期缓存 → 占位符）。切换对话时先拉取一次；如果接口稍后才完成，
     * 拦截模块会派发更新事件，由时间轴再次拉取，不做轮询。
```

</details>

**依据 3 · 源码核查**：[js/timeline/timeline-manager.js:1842-1850](https://github.com/houyanchao/chatgpt-gemini-timeline/blob/cfaa5c6eb1849cb85778fc98df3ce9690cda80e6/js/timeline/timeline-manager.js#L1842-L1850)

实际定位判据

```text
            const dot = e.target.closest('.ait-timeline-dot');
            if (dot) {
                const targetId = dot.dataset.targetTurnId;
                // Find target element by matching marker ID
                const marker = this.markers.find(m => m.id === targetId);
                const targetElement = marker?.element;
                if (targetElement) {
                    // Only scroll; let scroll-based computation set active to avoid double-flash
                    this.smoothScrollTo(targetElement);
```

#### 缺口

- 查找节时、内存开销与覆盖提示效果未测
  **影响**：不能把提效宣传当已证收益
  **进一步探讨**：固定浏览器/页面/会话负载，对比查找时间、误跳及资源

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
