# dsh-prompt-market

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ae2428f](https://github.com/yi-yezhiqiu/dsh-prompt-market/tree/ae2428f0a9c67b628cb14fd62d7073bb3d520720)

<!-- BEGIN META -->
[![GitHub ★ 111](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=111&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yi-yezhiqiu/dsh-prompt-market) [![npm 30d 858](https://img.shields.io/static/v1?label=npm+30d&message=858&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prompt-market) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prompt-market)
<!-- END META -->

> **功能**：在 DSH 输入框旁检索远端及本地提示词，并将选中内容写入草稿。

> **亮点**：把多来源检索、本地收藏和宿主草稿写入接在同一界面，带具体降级和写入反馈。[Q01](#research-q01)

> **主要限制**：缓存可能陈旧或截断，陌生选区仅弱确认；导出整份settings可能包含githubToken，过滤与本地存储都不等于内容或备份安全保证。[Q02](#research-q02)

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
  - [Q01 · 源获取、检索和草稿写入怎样接线？](#detail-section-11)
  - [Q02 · 来源失败、过滤和本地数据有哪些边界？](#detail-section-12)
  - [Q03 · 什么场景值得试用，成本和改进假设如何验证？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：重复使用提示词的人可在编辑器旁查找、收藏和自建素材，逐条阅读后放入草稿。[Q01](#research-q01)

浏览器书签和本地笔记已能保存复制；本组件减少跨窗口并保留来源状态，不创造提示词质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 市场检索 | 聚合远端及本地素材 | 源格式/网络有效，可能缓存降级 |
| 收藏与自建 | 复用并导出条目 | 依赖持久存储，导出settings需保护 |
| 草稿插入 | 在编辑器内取用 | 宿主动作契约，陌生选区弱确认 |
| 内容过滤 | 隐藏或标记规则命中项 | 非质量或注入保证 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
|---|---|---|---|
| Node ^22.19.0或>=24及DSH Web槽/React | 必需，声明和源码 | 加载界面 | 不挂载并记诊断 |
| inputActions捕获与插入 | 写入必需 | 操作草稿 | 明确拒绝，改手动复制 |
| 网络及源格式/CORS | 远端必需 | 拉取原始数据 | 旧缓存降级或报错 |
| localStorage可写 | 持久收藏必需 | 状态保存 | 内存降级，刷新可丢失 |
| GitHub token | 备用API可选 | 减少API限制 | 无token仍尝试，备份需保护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 判据与退路 |
|---|---|---|
| 准备 | 用户加载bundle并打开市场 | 可见按钮，诊断存储持久 |
| 取源 | 启用少量源并检索 | 检查状态、日期、许可和截断 |
| 使用 | 阅读条目并插入草稿 | 读回完整文本后才发送，未确认手动复制 |
| 备份退出 | 私存JSON或先清token | 不公开完整settings，停用后回笔记 |

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
|---|---|---|---|
| 首次 | 本地安装和网络下载 | 核对槽、源与存储 | 时间未知 |
| 持续 | 缓存磁盘/浏览器资源 | 筛选、改写、许可维护 | 无专用模型调用，费用未知 |
| 失败 | 重试和可能旧数据 | 核对草稿、缓存与存储错误 | 无效果保证 |
| 退出 | 私有备份空间 | 清token、导出并转回笔记 | 导出未脱敏 |

#### 效果

| 效果项 | 当前支持 | 尚不能确定 |
|---|---|---|
| 就地取用 | 检索与草稿插入接线 | 当前宿主成功率 |
| 来源透明 | 降级/缓存时间/截断状态 | 源实时完整性 |
| 内容收益 | 可读可改素材 | 任务质量或省时幅度 |

> **思考**：缓存可能陈旧或截断，陌生选区仅弱确认；导出整份settings可能包含githubToken，过滤与本地存储都不等于内容或备份安全保证。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多来源检索、本地收藏和宿主草稿写入接在同一界面，带具体降级和写入反馈。[Q01](#research-q01)

缓存保留降级状态与写入异步确认值得借鉴；规则过滤只改展示，整体settings导出与内存降级是明确边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存可能陈旧或截断，陌生选区仅弱确认；导出整份settings可能包含githubToken，过滤与本地存储都不等于内容或备份安全保证。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

用少量固定提示任务与笔记复制对照，先核对持久存储和草稿读回；备份私存或先清token，不以过滤代替人工阅读。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查来源、存储与实际UI写入接线，未执行宿主、联网或用户效果对照。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、index.js、client.js、core/api.js、core/sources.js、core/storage.js、core/net.js、core/filter.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查实际client槽/写入与核心来源、过滤、存储/导出；未全面审计所有格式适配、导入迁移或联网运行。
- 下一步：隔离宿主验证选区形状和本地存储，然后同任务对照检索时间、改写与误插；本次没有执行。

**分析版本**

- **仓库**：[yi-yezhiqiu/dsh-prompt-market](https://github.com/yi-yezhiqiu/dsh-prompt-market)
- **版本号**：0.1.3（[固定提交 ae2428f](https://github.com/yi-yezhiqiu/dsh-prompt-market/tree/ae2428f0a9c67b628cb14fd62d7073bb3d520720)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是分离可分享的去凭据导出与私有完整备份；固定样本若仍误带凭据或恢复不完整则推翻。[Q03](#research-q03)

隔离宿主验证选区形状和本地存储，然后同任务对照检索时间、改写与误插；本次没有执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 3559 | — | — | 37302 |
| .js | source | 29 | 20773 | 16777 | 3102 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/yi-yezhiqiu/dsh-prompt-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/yi-yezhiqiu/dsh-prompt-market/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yi-yezhiqiu/dsh-prompt-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器提示词市场怎样把远端素材写入草稿，来源与本地存储边界如何影响使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 源获取、检索和草稿写入怎样接线？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向反复从书签或笔记寻找提示词的DSH用户，本组件将远端源、自建条目和收藏放在输入框旁的市场，取代跨应用查找复制。Web客户端实际注册按钮与面板，数据层收集启用源和本地条目，按关键词检索、读时过滤、排序分页；源适配去重后缓存。选条目通过当前宿主inputActions.captureInsertion与insertText在同一tick写入草稿，并等待React刷新后核对读回，不替用户发送。它把素材库与编辑器连接起来，素材质量和宿主编辑能力不是其原创。真实client走ns.write，不以lib/write-draft备用文件推导当前回退路径；没有编辑动作或捕获抛错就拒绝。已知选区用预期全文hash/长度确认，未知形状仅以草稿变化作弱确认，所以应读回文本。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:6754-6781](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L6754-L6781)

实际按钮/面板槽注册和缺失React/slots时退出。

<details>
<summary>查看原文（28行）</summary>

```text
  ns.apply = function (ctx) {
    var stylesVia = 'none';
    try { stylesVia = ns.installStyles(ctx); } catch (e) { /* 样式失败不阻断装载（行内 style 兜底） */ }
    if (!ns.h) {
      ns.log('entry-error', { message: 'React 不可用：无法注册界面（不抛错，避免整块空白）' });
      return;
    }
    var Boundary = ns.makeBoundary();
    try {
      if (!ctx || !ctx.slots || typeof ctx.slots.inject !== 'function') {
        ns.log('entry-error', { message: 'ctx.slots 不可用' });
        return;
      }
      ctx.slots.inject(ns.SLOT_BUTTON, function () {
        return ctx.slots.register(
          { name: ns.SLOT_BUTTON, id: ns.ENTRY_BUTTON, order: 80, label: '提示词导入' },
          function (props) { return ns.h(Boundary, { slot: ns.SLOT_BUTTON }, ns.h(ns.ImportButton, props)); }
        );
      });
      ctx.slots.inject(ns.SLOT_PANEL, function () {
        return ctx.slots.register(
          { name: ns.SLOT_PANEL, id: ns.ENTRY_PANEL, order: 80, label: '提示词市场' },
          function (props) { return ns.h(Boundary, { slot: ns.SLOT_PANEL }, ns.h(ns.MarketPanel, props)); }
        );
      });
    } catch (e) {
      ns.log('entry-error', { message: ns.errText(e) });
    }
```

</details>

**依据 2 · 源码核查**：[core/api.js:193-238](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/api.js#L193-L238)

合并来源、关键词、过滤、排序与分页。

<details>
<summary>查看原文（46行）</summary>

```text
          Promise.resolve({ items: (s.favorites || []).concat(s.customs || []), errors: [] }),
          fetchEnabledSources(q)
        ]).then(function (both) {
          return { items: both[0].items.concat(both[1].items), errors: both[0].errors.concat(both[1].errors) };
        });
      } else {
        gather = fetchEnabledSources(q);
      }

      return gather.then(function (res) {
        var all = Array.isArray(res.items) ? res.items : [];
        /* 1) 关键字 */
        var searched = [];
        for (var i = 0; i < all.length; i++) {
          if (itemMatches(all[i], keyword)) searched.push(all[i]);
        }
        /* 2) 过滤（读取时应用） */
        var filteredResult = filterMod.apply ? filterMod.apply(searched, filterSettings) : { items: searched, stats: { input: searched.length, kept: searched.length, dropped: 0, filtered: false } };
        /* 3) 排序 */
        var sorted = sortItems(filteredResult.items, cfg.sort, keyword);
        /* 4) 分页 */
        var pageSize = text.num(q.pageSize);
        if (pageSize === null) pageSize = text.num(cfg.pageSize);
        if (pageSize === null) pageSize = 60;
        pageSize = text.clamp(pageSize, 1, 200);
        var page = text.num(q.page);
        if (page === null) page = 1;
        page = Math.max(1, Math.floor(page));
        var total = sorted.length;
        var start = (page - 1) * pageSize;
        var items = sorted.slice(start, start + pageSize);

        return {
          ok: true,
          tab: tab,
          q: keyword,
          page: page,
          pageSize: pageSize,
          total: total,
          hasMore: start + items.length < total,
          items: items,
          filteredCount: filteredResult.stats.dropped,
          filterStats: filteredResult.stats,
          errors: res.errors || [],
          sources: sourceStatus,
          degraded: (res.errors || []).some(function (e) { return e.degraded === true; })
```

</details>

**依据 3 · 源码核查**：[core/sources.js:330-375](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/sources.js#L330-L375)

适配、去重、写缓存和实时结果。

<details>
<summary>查看原文（46行）</summary>

```text
    function buildFromText(rawText, meta) {
      var adapted = normalize.adapt(rawText, src);
      if (!adapted.ok) {
        return fromCacheOrError(ERR.PARSE,
          '解析失败（结构可能已变化）：' + text.str(adapted.error || 'unknown'),
          { attempts: meta.attempts, httpStatus: meta.httpStatus });
      }
      var deduped = normalize.dedupe(adapted.items);
      var payload = {
        items: deduped.items,
        meta: {
          sourceId: src.id,
          url: meta.url,
          from: meta.from,
          fallbackUsed: meta.fallbackUsed === true,
          fetchedAt: text.nowIso(),
          itemCount: deduped.items.length,
          duplicatesRemoved: deduped.removed,
          detail: adapted.detail || {},
          httpStatus: meta.httpStatus,
          etag: meta.headers ? meta.headers.etag : '',
          lastModified: meta.headers ? meta.headers.lastModified : ''
        }
      };
      memoryCache[src.id] = { at: Date.now(), payload: payload };
      var cacheWrite = null;
      if (store && store.cacheSet) {
        cacheWrite = store.cacheSet(src.id, deduped.items, {
          url: meta.url,
          ref: src.ref || null,
          fetchedAt: payload.meta.fetchedAt,
          license: normalize.licenseOf ? normalize.licenseOf(src) : null
        });
      }
      var filtered = applyFilter(deduped.items, settings);
      return {
        ok: true,
        freshness: 'live',
        items: filtered.items,
        filteredOut: filtered.stats.dropped,
        filterStats: filtered.stats,
        source: src,
        error: null,
        meta: payload.meta,
        attempts: meta.attempts,
        cacheWrite: cacheWrite
```

</details>

**依据 4 · 源码核查**：[client.js:5497-5553](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L5497-L5553)

捕获与insertText同tick，抛错/假值拒绝，成功待确认。

<details>
<summary>查看原文（57行）</summary>

```text
  W.insert = function (input) {
    var opts = input || {};
    var actions = opts.actions;
    var text = ns.str(opts.text);
    var before = ns.fingerprint(W.readDraft(opts.getDraft));
    var out = baseReport('insert', before);
    var probe = W.inspect(actions);
    if (!probe.ok) {
      out.reason = probe.has ? W.MSG_CAPTURE_FAILED : W.MSG_NO_ACTIONS;
      out.rejectedAt = probe.has ? 'no-insertText-verb' : 'no-inputActions';
      W.log('write-insert', out);
      return out;
    }
    var cap = W.captureSpan(actions);
    if (!cap.ok) {
      out.reason = W.MSG_CAPTURE_FAILED + '（' + ns.str(cap.error) + '）';
      out.rejectedAt = 'captureInsertion-threw';
      out.method = 'insertText';
      W.log('write-insert', out);
      return out;
    }
    /* 同 tick：捕获与插入之间不得有 await */
    var returned = false;
    try {
      returned = actions.insertText(text, cap.span) === true;
    } catch (e) {
      out.method = 'insertText';
      out.insertTextReturned = null;
      out.rejectedAt = 'insertText-threw';
      out.reason = 'insertText 抛错：' + ns.errText(e);
      W.log('write-insert', out);
      return out;
    }
    out.method = 'insertText';
    out.insertTextReturned = returned;
    out.replaced = returned;
    var cov = W.coverage(cap.span, before.length, null);
    out.coversAll = cov.coversAll;
    out.coversAllBasis = cov.basis;
    out.endpointKeysUsed = cov.basis.endpointKeysUsed;
    out.whitelistMiss = cov.basis.whitelistMiss;
    out.revisionPresent = cov.basis.revisionPresent;
    var after = ns.fingerprint(W.readDraft(opts.getDraft));
    out.afterLength = after.length;
    out.afterHash = after.hash;
    if (returned !== true) {
      out.rejectedAt = 'insertText-returned-false';
      out.reason = 'insertText 返回假值：仅在「捕获后草稿版本未变」且「编辑器允许编辑」时插入成功（asar:403343）。请重试。';
      W.log('write-insert', out);
      return out;
    }
    /* 读回断言必须在 React 重渲染之后做（异步补做，见 W.finalizeInsert）。
       此处只标记 pending：同 tick 读到的仍是**旧草稿**，若就地判 verified 会把成功误报成未确认。 */
    out.pending = true;
    out.verified = null;
    W.log('write-insert-pending', out);
    return out;
```

</details>

**依据 5 · 源码核查**：[client.js:5561-5589](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L5561-L5589)

精确与弱读回判据。

<details>
<summary>查看原文（29行）</summary>

```text
  W.finalizeInsert = function (report, ctx) {
    var out = report && typeof report === 'object' ? report : {};
    var c = ctx && typeof ctx === 'object' ? ctx : {};
    var after = ns.fingerprint(c.draftAfter);
    out.afterLength = after.length;
    out.afterHash = after.hash;
    out.pending = false;
    if (out.insertTextReturned !== true) {
      out.verified = false;
      out.reason = out.reason || W.MSG_UNCONFIRMED;
      W.log('write-insert', out);
      return out;
    }
    var expected = W.expectedAfterInsert(ns.str(c.beforeDraft), c.normalizedRange, c.text);
    if (expected !== null) {
      out.verified = (after.hash === ns.hashText(expected) && after.length === expected.length);
      out.verifiedBy = 'expected-draft';
    } else if (ns.str(c.text) !== '' && after.hash !== ns.hashText(ns.str(c.beforeDraft))) {
      /* 选区形状在白名单外 ⇒ 退化为「草稿确实变了」的**弱判据**，并如实标注（评审 F-5：
         文案必须让用户看出这是弱判据，不能与强判据共用「已写入」） */
      out.verified = true;
      out.verifiedBy = 'draft-changed';
      out.verifiedStrength = 'weak';
      out.reason = W.MSG_INSERTED_WEAK;
    } else {
      out.verified = false;
    }
    out.reason = out.reason || (out.verified ? W.MSG_INSERTED : W.MSG_UNCONFIRMED);
    W.log('write-insert', out);
```

</details>

**依据 6 · 源码核查**：[client.js:6161-6186](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L6161-L6186)

真实UI动作调用写入并异步确认关闭面板。

<details>
<summary>查看原文（26行）</summary>

```text
  A.insertItem = function (item, ctx) {
    var st = ns.store.getState();
    var text = pickText(item, st.writeField);
    if (text === '') { publish({ action: 'insert', method: null, replaced: false, verified: false, reason: '该条目正文为空，未写入。' }); return; }
    var before = ctx.getDraft();
    var rep = ns.write.insert({ actions: ctx.actions, getDraft: ctx.getDraft, draft: before, text: text });
    publish(clone(rep));
    if (rep.pending !== true) {
      /* 与下面的 pending 分支同构：**verified !== true 时必须留下可见 reason**，不得静默 return
         （评审 F-4：既不关面板也不报错，用户看不到失败原因）。 */
      if (rep.verified === true) {
        ns.store.setState({ panelOpen: false });
      } else if (ns.str(rep.reason) === '') {
        var repSync = clone(rep);
        repSync.reason = '插入未确认：请重试（可先按 Ctrl+A 全选草稿再点「替换」）';
        publish(repSync);
      }
      return;
    }
    var range = rep.coversAllBasis ? rep.coversAllBasis.normalizedRange : null;
    setTimeout(function () {
      var fin = ns.write.finalizeInsert(rep, { beforeDraft: before, draftAfter: ctx.getDraft(), text: text, normalizedRange: range });
      publish(clone(fin));
      /* 验收 ③：插入成功后面板关闭；失败则保持打开并显示错误态 */
      if (fin.verified === true) ns.store.setState({ panelOpen: false });
    }, 0);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 来源失败、过滤和本地数据有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

网络或格式变化可回旧缓存，结果保留抓取时间、截断与degraded错误；旧缓存可继续取用但不证明最新或完整。过滤是读取时按规则隐藏或标记，原始规范化条目先入缓存，不能据此保证素材质量或对抗提示注入。localStorage通过可写探测后使用，不可用就退内存；内存本次可用但刷新后不持久，状态超限或写失败有明确错误，不能把“本地”解释成永不丢失。GitHub token只在GitHub API备用请求设置Authorization，不发给CDN或自定义源；然而token属于settings，导出直接包含整个settings，备份可能携带凭据，必须私存或先清token再导出。各素材源许可应分别核对，插件MIT不能覆盖所有内容。

#### 证据与依据

**依据 1 · 源码核查**：[core/sources.js:240-274](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/sources.js#L240-L274)

缓存回退携带时间/截断及降级错误。

<details>
<summary>查看原文（35行）</summary>

```text
    function fromCacheOrError(code, message, extra) {
      var entry = null;
      try {
        entry = store && store.cacheGet ? store.cacheGet(src.id) : null;
      } catch (e) {
        entry = null;
      }
      var details = {
        source: src,
        meta: entry ? {
          fetchedAt: entry.fetchedAt,
          url: entry.url,
          ref: entry.ref,
          itemCount: entry.itemCount,
          storedCount: entry.storedCount,
          truncated: entry.truncated === true
        } : null,
        attempts: extra && extra.attempts ? extra.attempts : 0,
        httpStatus: extra && extra.httpStatus ? extra.httpStatus : 0
      };
      if (entry && Array.isArray(entry.items) && entry.items.length > 0) {
        var cachedItems = applyFilter(entry.items, settings);
        details.ok = true;
        details.freshness = 'cache';
        details.items = cachedItems.items;
        details.filteredOut = cachedItems.stats.dropped;
        details.filterStats = cachedItems.stats;
        details.error = {
          code: code || ERR.NETWORK,
          message: (message || '抓取失败') + ' 已回退到本地缓存（' + entry.storedCount + ' / ' + entry.itemCount + ' 条，'
            + (entry.truncated ? '缓存已截断；' : '') + '抓取时间 ' + text.str(entry.fetchedAt) + '）。',
          showable: true,
          degraded: true
        };
        return details;
```

</details>

**依据 2 · 源码核查**：[core/sources.js:354-375](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/sources.js#L354-L375)

缓存保存后才过滤展示。

<details>
<summary>查看原文（22行）</summary>

```text
      memoryCache[src.id] = { at: Date.now(), payload: payload };
      var cacheWrite = null;
      if (store && store.cacheSet) {
        cacheWrite = store.cacheSet(src.id, deduped.items, {
          url: meta.url,
          ref: src.ref || null,
          fetchedAt: payload.meta.fetchedAt,
          license: normalize.licenseOf ? normalize.licenseOf(src) : null
        });
      }
      var filtered = applyFilter(deduped.items, settings);
      return {
        ok: true,
        freshness: 'live',
        items: filtered.items,
        filteredOut: filtered.stats.dropped,
        filterStats: filtered.stats,
        source: src,
        error: null,
        meta: payload.meta,
        attempts: meta.attempts,
        cacheWrite: cacheWrite
```

</details>

**依据 3 · 源码核查**：[core/filter.js:213-274](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/filter.js#L213-L274)

规则过滤为hide或mark。

<details>
<summary>查看原文（62行）</summary>

```text
  function apply(items, settings) {
    var compiledSet = (settings && settings.compiled && Array.isArray(settings.compiled))
      ? settings : compile(settings);
    var list = Array.isArray(items) ? items : [];
    var kept = [];
    var dropped = [];
    var flagged = [];
    var resultItems = [];

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item || typeof item !== 'object') continue;
      var res = checkItem(item, compiledSet);
      if (!res.blocked) {
        kept.push(item);
        resultItems.push(item);
        continue;
      }
      var annotated = item;
      if (compiledSet.enabled) {
        annotated = {};
        for (var k in item) {
          if (Object.prototype.hasOwnProperty.call(item, k)) annotated[k] = item[k];
        }
        annotated.filtered = true;
        annotated.filterMatches = res.matches;
      }
      if (compiledSet.enabled && compiledSet.actionMode === 'mark') {
        flagged.push(annotated);
        kept.push(annotated);
        resultItems.push(annotated);
      } else {
        dropped.push(annotated);
      }
    }

    return {
      items: resultItems,
      kept: kept,
      dropped: dropped,
      flagged: flagged,
      stats: {
        input: list.length,
        kept: kept.length,
        dropped: dropped.length,
        flagged: flagged.length,
        filtered: compiledSet.enabled,
        actionMode: compiledSet.actionMode
      }
    };
  }

  /* 默认设置（返回新对象，可直接写进 store） */
  function defaultSettings() {
    var d = constants.FILTER_DEFAULT_SETTINGS || {};
    return {
      enabled: d.enabled !== false,
      actionMode: d.actionMode === 'mark' ? 'mark' : 'hide',
      customTerms: (d.customTerms || []).slice(0),
      extraRuleIds: (d.extraRuleIds || []).slice(0),
      disabledRuleIds: (d.disabledRuleIds || []).slice(0)
    };
```

</details>

**依据 4 · 源码核查**：[core/storage.js:107-133](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/storage.js#L107-L133)

localStorage探测与内存降级。

<details>
<summary>查看原文（27行）</summary>

```text
    /* b) 浏览器 localStorage（零后端零权限的首选） */
    var ls = null;
    try { ls = globalThis.localStorage || null; } catch (e) { ls = null; }
    if (!ls && typeof globalThis.window !== 'undefined' && globalThis.window) {
      try { ls = globalThis.window.localStorage || null; } catch (e2) { ls = null; }
    }
    if (ls) {
      var pl = probeBackend(ls);
      if (pl.ok) {
        ls.kind = 'localStorage';
        ls.durable = true;
        ls.usable = true;
        report.kind = 'localStorage';
        report.durable = true;
        report.writable = true;
        report.reason = pl.reason;
        report.source = 'localStorage';
        return { backend: ls, report: report };
      }
      report.reason = (report.reason ? report.reason + ' | ' : '') + 'localStorage-unusable:' + pl.reason;
    } else {
      report.reason = (report.reason ? report.reason + ' | ' : '') + 'localStorage-absent';
    }

    /* c) 内存降级（可用但不持久化；UI 需提示） */
    var mem = memoryBackend();
    return { backend: mem, report: report };
```

</details>

**依据 5 · 源码核查**：[core/storage.js:447-487](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/storage.js#L447-L487)

大小与写失败检查，成功才更新状态。

<details>
<summary>查看原文（41行）</summary>

```text
    function persist(nextState) {
      nextState.appId = constants.APP_ID || nextState.appId;
      nextState.schemaVersion = CURRENT_SCHEMA;
      nextState.updatedAt = core.storage.nowIso(clock);
      nextState.revision = (text.num(nextState.revision) || 0) + 1;
      var payload = '';
      try {
        payload = JSON.stringify(nextState);
      } catch (e) {
        return { ok: false, code: constants.ERROR_CODES.STORAGE, message: '状态无法序列化：' + ((e && e.message) || 'unknown') };
      }
      var bytes = text.utf8Bytes(payload);
      var maxBytes = LIMITS.STATE_MAX_BYTES || 2 * 1024 * 1024;
      if (bytes > maxBytes) {
        return {
          ok: false,
          code: constants.ERROR_CODES.QUOTA,
          message: '本地状态大小 ' + bytes + ' 字节，超过上限 ' + maxBytes + ' 字节。'
            + '请删除部分自建提示词或收藏后重试（数据未被写入，当前会话内的改动可能丢失）。',
          bytes: bytes
        };
      }
      try {
        var wrote = backend.setItem(STATE_KEY, payload);
        if (wrote === false) {
          return { ok: false, code: constants.ERROR_CODES.STORAGE, message: '持久层拒绝了写入（无异常）' };
        }
      } catch (e2) {
        var isQuota = !!(e2 && (e2.name === 'QuotaExceededError' || e2.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e2.code === 22));
        return {
          ok: false,
          code: isQuota ? constants.ERROR_CODES.QUOTA : constants.ERROR_CODES.STORAGE,
          message: isQuota
            ? '本地存储配额已满（' + bytes + ' 字节写不进去）。可删除部分缓存或自建提示词后重试。'
            : '写入本地存储失败：' + ((e2 && e2.message) || 'unknown'),
          bytes: bytes
        };
      }
      state = nextState;
      return { ok: true, code: null, message: null, bytes: bytes, revision: state.revision };
    }
```

</details>

**依据 6 · 源码核查**：[core/net.js:100-114](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/core/net.js#L100-L114)

token仅挂GitHub备用headers。

<details>
<summary>查看原文（15行）</summary>

```text
    /* token 只发给 api.github.com；绝不把凭据带到 jsDelivr 或自定义源 */
    var token = text.str(options.token);
    var fallbackHeaders = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    if (token !== '') fallbackHeaders['Authorization'] = 'Bearer ' + token;
    if (!options.allowFallback) urls.fallback = '';
    return {
      primary: urls.primary,
      fallback: urls.fallback,
      kind: urls.kind,
      headers: headers,
      fallbackHeaders: fallbackHeaders
    };
```

</details>

**依据 7 · 源码核查**：[client.js:1510-1515](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L1510-L1515)

设置保留githubToken。

```text
    if (raw.filter && typeof raw.filter === 'object') {
      d.filter = filter.normalizeSettings ? filter.normalizeSettings(raw.filter) : d.filter;
    }
    if (typeof raw.allowGithubFallback === 'boolean') d.allowGithubFallback = raw.allowGithubFallback;
    if (typeof raw.githubToken === 'string') d.githubToken = raw.githubToken.slice(0, 200);
    if (typeof raw.locale === 'string' && raw.locale !== '') d.locale = raw.locale.slice(0, 20);
```

**依据 8 · 源码核查**：[client.js:2096-2125](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L2096-L2125)

导出直接携带settings且无脱敏。

<details>
<summary>查看原文（30行）</summary>

```text
  function buildExport(store, options) {
    var opts = options && typeof options === 'object' ? options : {};
    var state = store.toJSON();
    var payload = {
      appId: constants.APP_ID || 'dsh-prompt-market',
      kind: 'dsh-prompt-market-export',
      schemaVersion: CURRENT_SCHEMA,
      exportedAt: text.nowIso(),
      plugin: { name: 'dsh-prompt-market', dataApiMajor: constants.DATA_API_MAJOR || 1 },
      state: {
        favorites: state.favorites,
        customs: state.customs,
        sources: state.sources,
        tags: state.tags,
        settings: state.settings,
        licenseAcknowledged: state.licenseAcknowledged === true,
        appliedMigrations: state.appliedMigrations
      },
      counts: {
        favorites: state.favorites.length,
        customs: state.customs.length,
        tags: state.tags.length,
        sources: state.sources.length
      }
    };
    if (opts.includeCache === true) {
      payload.cache = store.cacheList();
    }
    payload.checksum = text.fnv1a32(JSON.stringify(payload.state));
    return { ok: true, code: null, message: null, payload: payload, fileName: 'prompt-market-backup-' + slug(text.nowIso()) + '.json' };
```

</details>

**依据 9 · 作者声明**：[README.md:64-66](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/README.md#L64-L66)

作者要求不同内容库区分版权署名。

```text
- 「**状态**」列显示每个源实际加载了多少条 —— 连接失败会**如实报错**，不静默假装成功
- 「**许可**」列把两个 MIT 库**区分开**：一个是 `MIT`，另一个是 `MIT-plexpt`
  （**版权人不同的两个库，署名不混用**）
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么场景值得试用，成本和改进假设如何验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合拥有可重复提示词、愿意逐条阅读并保留本地备份的人限定试用；只是偶尔复制一句时手动笔记更简单。首次需声明的Node范围、DSH Web React/slots和inputActions契约；远端源另依赖浏览器网络/CORS，已有收藏或自建条目可走本地。持续无插件专用模型调用，但下载/缓存、筛选维护、来源许可与人工改写有成本；本次没有金额、检索耗时或提示质量对照。先少量源核对真实条目与草稿，存储非持久、写入弱确认不稳定或备份需要公开分享时停止并回手动复制。未验证假设是建立不含凭据的可分享导出与私有完整备份两种明确格式：由settings整体导出的边界推导，可减少误分享，同时保留恢复能力；对有token和无token固定样本核对导出字段、恢复完整性及用户选错率，若仍误泄露或恢复损失则否定。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-22](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/package.json#L20-L22)

Node声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 源码核查**：[package.json:45-53](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/package.json#L45-L53)

bundle和立即Web客户端。

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
```

**依据 3 · 源码核查**：[client.js:6754-6781](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L6754-L6781)

界面依赖不可用时不挂载。

<details>
<summary>查看原文（28行）</summary>

```text
  ns.apply = function (ctx) {
    var stylesVia = 'none';
    try { stylesVia = ns.installStyles(ctx); } catch (e) { /* 样式失败不阻断装载（行内 style 兜底） */ }
    if (!ns.h) {
      ns.log('entry-error', { message: 'React 不可用：无法注册界面（不抛错，避免整块空白）' });
      return;
    }
    var Boundary = ns.makeBoundary();
    try {
      if (!ctx || !ctx.slots || typeof ctx.slots.inject !== 'function') {
        ns.log('entry-error', { message: 'ctx.slots 不可用' });
        return;
      }
      ctx.slots.inject(ns.SLOT_BUTTON, function () {
        return ctx.slots.register(
          { name: ns.SLOT_BUTTON, id: ns.ENTRY_BUTTON, order: 80, label: '提示词导入' },
          function (props) { return ns.h(Boundary, { slot: ns.SLOT_BUTTON }, ns.h(ns.ImportButton, props)); }
        );
      });
      ctx.slots.inject(ns.SLOT_PANEL, function () {
        return ctx.slots.register(
          { name: ns.SLOT_PANEL, id: ns.ENTRY_PANEL, order: 80, label: '提示词市场' },
          function (props) { return ns.h(Boundary, { slot: ns.SLOT_PANEL }, ns.h(ns.MarketPanel, props)); }
        );
      });
    } catch (e) {
      ns.log('entry-error', { message: ns.errText(e) });
    }
```

</details>

**依据 4 · 源码核查**：[client.js:2096-2125](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/client.js#L2096-L2125)

导出格式改进假设的当前依据。

<details>
<summary>查看原文（30行）</summary>

```text
  function buildExport(store, options) {
    var opts = options && typeof options === 'object' ? options : {};
    var state = store.toJSON();
    var payload = {
      appId: constants.APP_ID || 'dsh-prompt-market',
      kind: 'dsh-prompt-market-export',
      schemaVersion: CURRENT_SCHEMA,
      exportedAt: text.nowIso(),
      plugin: { name: 'dsh-prompt-market', dataApiMajor: constants.DATA_API_MAJOR || 1 },
      state: {
        favorites: state.favorites,
        customs: state.customs,
        sources: state.sources,
        tags: state.tags,
        settings: state.settings,
        licenseAcknowledged: state.licenseAcknowledged === true,
        appliedMigrations: state.appliedMigrations
      },
      counts: {
        favorites: state.favorites.length,
        customs: state.customs.length,
        tags: state.tags.length,
        sources: state.sources.length
      }
    };
    if (opts.includeCache === true) {
      payload.cache = store.cacheList();
    }
    payload.checksum = text.fnv1a32(JSON.stringify(payload.state));
    return { ok: true, code: null, message: null, payload: payload, fileName: 'prompt-market-backup-' + slug(text.nowIso()) + '.json' };
```

</details>

**依据 5 · 作者声明**：[README.md:94-102](https://github.com/yi-yezhiqiu/dsh-prompt-market/blob/ae2428f0a9c67b628cb14fd62d7073bb3d520720/README.md#L94-L102)

作者将散落查找复制描述为目标痛点。

````text
## 它解决什么问题

用 AI 写东西时，好用的提示词总是散落在浏览器书签、笔记、别人的聊天记录里。真要用的时候要么找不到，要么复制过来还得改半天。

这个插件把「**找提示词 → 用提示词**」压缩成两步：

```
点输入框左边的「提示词导入」  →  点某一条的「插入」
```
````

#### 缺口

- 未验证当前宿主草稿契约及远端源实时可达性。
  **影响**：静态链路不能保证安装后检索和写入可用。
  **进一步探讨**：在隔离宿主用少量源与有旧草稿样例读回核对。
- 没有重复任务的检索时间、改写负担或质量对照。
  **影响**：不能以条目数量推定生产力提升。
  **进一步探讨**：同一批提示任务对照笔记手动复制与市场。
- 分离导出格式尚未实现验证。
  **影响**：不是现有防泄露能力。
  **进一步探讨**：固定凭据样本验字段、恢复与用户选错率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
