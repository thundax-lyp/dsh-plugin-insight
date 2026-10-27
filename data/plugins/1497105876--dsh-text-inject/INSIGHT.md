# dsh-text-inject

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[42c698e](https://github.com/1497105876/dsh-text-inject/tree/42c698eb9b0967afdf940f01809701f9274d1cf9)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在DSH设置页管理独立Markdown中的系统提示和上下文块，支持热加载与历史备份。

> **亮点**：将常驻文本与宿主配置分离，提供文件/设置页双入口和历史恢复；注入能力继承官方接口。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：README的trigger门控不在当前context注册中，用户可能误判注入范围；整组热替换与备份也无事务保证。见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要独立注入文件？](#detail-section-11)
  - [Q02 · 热加载和备份如何实现？](#detail-section-12)
  - [Q03 · trigger与去重说明是否符合源码？](#detail-section-13)
  - [Q04 · 依赖、资源与失败成本是什么？](#detail-section-14)
  - [Q05 · 可验证什么改进及何时试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁编辑常驻规则和项目背景者用独立文件管理内容，以真实装配为验收。

手工配置注入或按需粘贴是直接替代；插件便利性不证明常驻注入比按需提供更省token。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| system/context块 | 常驻规则与背景 | 当前未实现trigger门控 |
| 热加载 | 文件改后重新注册 | 整组非原子，需看错误 |
| 历史恢复 | 保存旧文本并恢复 | 备份可能失败，钉住项不裁 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH systemPrompt/webServer | 启动必需 | 注入与同源数据路由 | 注册失败不能视作生效 |
| 实际profile路径和可写文件 | 内容管理必需 | 隔离数据与备份 | 识别失败回全局，需人工确认 |
| 设置页/locale客户端 | UI必需 | 编辑和预览 | 可保文件但UI未验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确认profile文件与备份 | 无意外共享路径 |
| 2 | 用户保存短块并看实际装配 | 内容、顺序和范围符合预期 |
| 3 | 用户改文件、禁用和恢复 | 下一轮一致，否则停注入并恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地文件与宿主资源未知 | 安装、分块、装配核对 | profile路径需确认 |
| 持续使用 | 常驻提示token与历史存储 | 规则维护、重复内容审阅 | 无模型调用量与价格实测 |
| 失败恢复 | 备份/重试资源未知 | 部分注册、watch和文件恢复 | 备份失败仍可保存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文本维护 | 独立文件与设置页接线 | 节时和任务质量 |
| 热加载 | watch和重新注册存在 | 宿主实际下一轮装配 |
| 恢复 | 历史备份与restore路径 | 全部保存都有备份或原子性 |

> **思考**：README的trigger门控不在当前context注册中，用户可能误判注入范围；整组热替换与备份也无事务保证。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将常驻文本与宿主配置分离，提供文件/设置页双入口和历史恢复；注入能力继承官方接口。见 [Q01](#research-q01)、[Q02](#research-q02)。

目录监听兼容编辑器替换，disposer归一化值得复用；逐块注册与错误列表便于定位。应避免将兼容字段静默保留成虚假功能；直接文件写与整组重注册需要更明确的失败状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

README的trigger门控不在当前context注册中，用户可能误判注入范围；整组热替换与备份也无事务保证。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用短文本，先验收实际装配、路径、禁用与恢复；不能依赖trigger门控。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持独立文件与热加载；trigger文档与实现不符；任务收益和宿主行为未验证，预览改进为假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/parser.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定README、parser与host；不执行目标代码或宿主，不复用源码注释中的作者实测。
- 下一步：无关键词、重复标题、外部替换保存、禁用和恢复矩阵核对真实模型输入，测错误和人工时间。

**分析版本**

- **仓库**：[1497105876/dsh-text-inject](https://github.com/1497105876/dsh-text-inject)
- **版本号**：0.2.0-rc.3（[固定提交 42c698e](https://github.com/1497105876/dsh-text-inject/tree/42c698eb9b0967afdf940f01809701f9274d1cf9)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的有效装配预览与旧字段警告，可能减少误注入；比较错误发现率和多余token决定是否值得增加交互。见 [Q05](#research-q05)。

无关键词、重复标题、外部替换保存、禁用和恢复矩阵核对真实模型输入，测错误和人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 800 | — | — | 7163 |
| .js | source | 3 | 2364 | 1892 | 308 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立Markdown热加载能否可靠管理DSH常驻文本，且不使用户误解注入范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要独立注入文件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合频繁编辑DSH常驻规则或项目背景、希望文本可在编辑器和版本管理中维护的人。合格结果是下一轮模型收到预期块且禁用/恢复有效，不是设置页保存成功。相对在配置里塞长文本，独立Markdown加管理界面降低内容与宿主配置耦合；相对每轮手工粘贴，调用systemPrompt接口可由宿主处理上下文投影。贡献为内容管理和宿主适配，不能将官方section/context机制归为原创，也不能由常驻注入推断任务质量提高。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-21](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/README.md#L7-L21)

作者独立文件、热加载与历史定位

<details>
<summary>查看原文（15行）</summary>

```text
在 dsh（DeepSeek Harness）**官方设置页左侧栏**添加一个「**文字注入**」分区：把文字注入到
**系统提示词**（每轮生效）或**会话上下文**；内容存于**独立文件**，支持**热加载**与**历史备份**。

不碰官方 `inject-system-prompt` 那种"在官方配置里塞字段"的做法——你的文字写在你自己的一份
`inject.md` 里，随手可改。

## 功能

| 能力 | 说明 |
|---|---|
| 提示词注入 | `## [system] 名称` 块 → 追加进系统提示词，每轮对话生效 |
| 上下文注入 | `## [context] 名称` 块 → 合成一条 user 消息注入会话；`kind` 去重、`trigger` 关键词门控 |
| 增删改 | 设置页以卡片列出所有块，支持新增 / 编辑 / 删除 / 启停 |
| 独立文件 | 内容全部写在你自己的一份 `inject.md`，与官方配置隔离 |
| 热加载 | 改文件保存即生效（`fs.watch`），或在设置页点保存；都不用重启 dsh |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:456-465](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L456-L465)

实际调用官方section/context

<details>
<summary>查看原文（10行）</summary>

```text
      try {
        if (b.type === "system") {
          sysDisposers.push(sp.section({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nSys++;
        } else {
          ctxDisposers.push(sp.context({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nCtx++;
        }
      } catch (e) {
        registerErrors.push(`「${title}」注册失败：${e?.message || e}`);
```

</details>

#### 缺口

- 没有频繁编辑任务的人工时间和错误对照
  **影响**：便利性收益未量化
  **进一步探讨**：比较配置编辑/手粘贴与插件的合格装配时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 热加载和备份如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

文件解析成system/context块，reload先读取，再释放全部旧注册，再按标题注册新块；函数/对象/close三种disposer被统一处理。目录watch以150ms去抖，兼容编辑器原子替换，目录watch失败才退单文件。保存先尝试备份旧文本，再直接writeFileSync新文本并reload；历史文件撞名递增，钉住项不裁剪。值得借鉴的是目录监听与生命周期清理，但整组撤旧再注册不构成原子热切换；重复标题或单块失败可留下部分生效状态，registerErrors会暴露，用户仍需看装配预览。备份失败返回null但保存仍可继续，不能保证每次保存都有可恢复历史。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:189-203](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L189-L203)

统一清理disposer

<details>
<summary>查看原文（15行）</summary>

```text
function release(d) {
  if (!d) return;
  try {
    if (typeof d === "function") d();
    else if (typeof d.dispose === "function") d.dispose();
    else if (typeof d.close === "function") d.close();
  } catch (e) {
    /* 释放失败不该影响其它清理 */
  }
}

/** 释放一整组 disposer 并清空数组。 */
function releaseAll(list) {
  const items = list.splice(0).reverse();
  for (const d of items) release(d);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:383-408](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L383-L408)

备份与裁剪，失败返回null

<details>
<summary>查看原文（26行）</summary>

```text
  function backup() {
    try {
      const cur = readRaw();
      if (!cur.trim()) return null;
      const fn = nextBackupName();
      fs.writeFileSync(path.join(historyDir, fn), cur, "utf8");

      // 裁剪：钉住的不裁。同样要按时间新旧判断（见 listHistory 里的说明）。
      const pinned = readPinned();
      const all = fs.readdirSync(historyDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => {
          let mtime = 0;
          try { mtime = fs.statSync(path.join(historyDir, f)).mtimeMs; } catch (e) {}
          return { f, mtime };
        })
        .sort((x, y) => (x.mtime - y.mtime) || x.f.localeCompare(y.f)); // 最旧的在前
      const removable = all.filter((x) => !pinned.has(x.f));
      const overflow = all.length - historyLimit;
      for (let i = 0; i < overflow && i < removable.length; i++) {
        try { fs.unlinkSync(path.join(historyDir, removable[i].f)); } catch (e) {}
      }
      return fn;
    } catch (e) {
      warn(`[gw-text-inject] 备份失败: ${e?.message}`);
      return null;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:427-470](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L427-L470)

整组释放再逐块注册

<details>
<summary>查看原文（44行）</summary>

```text
  /** 按官方规则注册所有块。先全部撤掉旧的，再注册新的（顺序不能反，否则撞名）。 */
  function registerAll() {
    releaseAll(sysDisposers);
    releaseAll(ctxDisposers);
    registerErrors = [];
    if (disposed) return;

    const sp = ctx.systemPrompt;
    if (!sp || typeof sp.section !== "function" || typeof sp.context !== "function") {
      registerErrors.push("systemPrompt 服务不可用，注入未生效");
      return;
    }

    let nSys = 0;
    let nCtx = 0;
    for (const b of state.blocks) {
      if (!b.enabled) continue;
      if (!b.body || !b.body.trim()) continue;

      const title = (b.title || "").trim();
      if (!title) {
        registerErrors.push(`有一个 ${b.type === "system" ? "系统提示词" : "上下文"}块没有标题，已被跳过`);
        continue;
      }

      const order = Number.isFinite(b.order) ? b.order : (b.type === "system" ? DEFAULT_SYSTEM_ORDER : DEFAULT_CONTEXT_ORDER);
      // 系统侧落在固定段之前的，按 MIN_ORDER 抬高（只提示，不阻断）
      const effective = b.type === "system" ? Math.max(order, MIN_ORDER) : order;

      try {
        if (b.type === "system") {
          sysDisposers.push(sp.section({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nSys++;
        } else {
          ctxDisposers.push(sp.context({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nCtx++;
        }
      } catch (e) {
        registerErrors.push(`「${title}」注册失败：${e?.message || e}`);
      }
    }

    if (nSys || nCtx) log(`[gw-text-inject] 已注册 ${nSys} 个系统提示词块、${nCtx} 个上下文块`);
    for (const err of registerErrors) warn(`[gw-text-inject] ${err}`);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:496-510](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L496-L510)

目录watch与去抖

<details>
<summary>查看原文（15行）</summary>

```text
  // ── 热加载（盯目录，不是文件）────────────────────────────
  const onFsEvent = () => {
    if (disposed) return;
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      if (disposed) return;
      reload("文件变化");
    }, 150);
  };
  try {
    watcher = fs.watch(dataDir, onFsEvent);
  } catch (e) {
    // 目录监听失败时退回单文件监听（聊胜于无）
    try { watcher = fs.watch(dataFile, onFsEvent); } catch (e2) {
      warn(`[gw-text-inject] 监听数据文件失败: ${e2?.message}`);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:726-740](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L726-L740)

保存路径未强制备份成功

<details>
<summary>查看原文（15行）</summary>

```text
      // 保存（带校验）
      if (req.method === "POST" && p === "/save") {
        const body = parseJson(await readBody(req));
        const blocks = body && body.blocks;
        const errs = validateBlocks(blocks);
        if (errs.length) return json(res, 400, { error: errs[0], errors: errs });
        const raw = serializeBlocks(blocks);
        const backupName = backup();
        try {
          fs.writeFileSync(dataFile, raw, "utf8");
        } catch (e) {
          return json(res, 500, { error: `写入失败：${e?.message}` });
        }
        reload("保存");
        return json(res, 200, { ok: true, backup: backupName, ...snapshot() });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · trigger与去重说明是否符合源码？

**研究主题**：缺陷与关键质疑

#### 完整回答

README仍描述kind去重和trigger关键词门控，但当前host的注册仅传name/order/text，未传trigger或kind；源码注释明确移除了trigger，parser保留旧字段只为兼容。因此不能按README承诺“命中关键词才注入”，在当前实现中已启用context块可能由宿主正常上下文机制持续参与装配。去重属于宿主RuntimeContextProjection契约，本轮未读固定宿主实现/运行，不保证跨轮行为。首要风险是用户以为条件限定的敏感或大段背景实际成为常驻内容，从而增加上下文与错误适用范围；这是文档/实现不一致的静态发现，不是已经发生信息泄露。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-21](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/README.md#L15-L21)

作者仍宣称trigger/kind

```text
| 能力 | 说明 |
|---|---|
| 提示词注入 | `## [system] 名称` 块 → 追加进系统提示词，每轮对话生效 |
| 上下文注入 | `## [context] 名称` 块 → 合成一条 user 消息注入会话；`kind` 去重、`trigger` 关键词门控 |
| 增删改 | 设置页以卡片列出所有块，支持新增 / 编辑 / 删除 / 启停 |
| 独立文件 | 内容全部写在你自己的一份 `inject.md`，与官方配置隔离 |
| 热加载 | 改文件保存即生效（`fs.watch`），或在设置页点保存；都不用重启 dsh |
```

**依据 2 · 源码核查**：[lib/index.js:15-37](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L15-L37)

作者解释改走官方context并移除trigger

<details>
<summary>查看原文（23行）</summary>

```text
// [1] 上下文改走官方通道。
//     v1 自己手搓 agent/pre-step 往 messages 里塞 user 消息，source 写成
//     `{kind: b.kind}`（例如 `{kind:"123"}`）。但官方 MessageSourceMap 是封闭
//     联合，插件消息唯一口子是 `{kind:"plugin", plugin:string} & ContextFormed`，
//     所以 v1 的 source 非法；而且它的去重集合取的是「本轮待进消息」而非会话
//     历史，跨轮必然失效 → 每轮重复注入。
//     实测：扫 189 个真实会话、141319 个事件，v1 的 context 块内容命中 0 次。
//     现在改走 ctx.systemPrompt.context()，由 agent-loop 的 RuntimeContextProjection
//     自动完成「投影成合法 user 消息 + 内容没变不重发 + 新快照作废旧快照」。
//
// [2] disposer 形态修正（这是个会让热加载彻底失效的真 bug）。
//     ctx.effect() 返回的是**函数**（规范里 disposer 可以是函数，也可以是带
//     .dispose() 的对象）。v1 只判断 `typeof d.dispose === "function"`，永远为假，
//     于是旧注册从不清理 → 重新注册撞名报 "already registered" → 改完内容不生效。
//     实测复现：改内容后装配结果仍是旧值。本文件统一用 release() 处理三种形态。
//
// [3] 去掉 32 个短横线装饰符。官方各段之间用 "\n\n" 拼接，不需要自己加分隔线；
//     v1 那些横线原样进了提示词（占 token 还干扰模型）。
//
// [4] fs.watch 从「盯单个文件」改成「盯目录」。Windows 上编辑器保存是
//     「写临时文件 → 替换」，句柄会静默失效。
//
// [5] 去掉 trigger 门控（用户要求）。它是 v1 自造的、非官方的概念。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:456-465](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L456-L465)

实际context注册无trigger/kind

<details>
<summary>查看原文（10行）</summary>

```text
      try {
        if (b.type === "system") {
          sysDisposers.push(sp.section({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nSys++;
        } else {
          ctxDisposers.push(sp.context({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nCtx++;
        }
      } catch (e) {
        registerErrors.push(`「${title}」注册失败：${e?.message || e}`);
```

</details>

**依据 4 · 源码核查**：[lib/parser.js:14-18](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/parser.js#L14-L18)

保留旧kind的解析边界

```text
//
// 规则：
//   - 块头 `## [system|context] 标题`，标题必填（界面层校验，这里只负责解析）
//   - 块头后紧跟连续元数据行，第一个「非元数据且非空」的行开始算正文
//   - 元数据键大小写不敏感，也认中文别名
```

#### 缺口

- 当前宿主去重、预览与实际模型请求一致性未验证
  **影响**：限制对敏感文本和长块的采用
  **进一步探讨**：在隔离会话检查无关键词/改块/禁用后的真实装配

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、资源与失败成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

强依赖systemPrompt和webServer，client另依赖设置页/locale；profile识别失败回全局旧目录，必须确认实际文件路径，避免多profile意外共享。首次成本是安装接线、整理块与检查装配；持续成本主要是注入文本token和维护历史，现金随模型与任务量未知。失败恢复包括部分注册失败、文件外部改动、watch失效以及备份不足时手工恢复。schema依赖解析不到时不做schema校验而继续，提升可加载性但降低配置提前失败能力；不能把宽peer范围看成所有宿主都已验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:49-52](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L49-L52)

强依赖

```text
export const name = "@gw/dsh-text-inject";

/** 硬依赖（cordis 红线：访问 ctx.xxx 必须先 inject，否则 apply 期直接抛错）。 */
export const inject = ["systemPrompt", "webServer"];
```

**依据 2 · 源码核查**：[lib/index.js:117-145](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L117-L145)

profile识别与回落

<details>
<summary>查看原文（29行）</summary>

```text
export function detectProfileName({ ctx = null, env = process.env, argv = process.argv.slice(2), moduleUrl = import.meta.url } = {}) {
  const home = String(env.DSH_HOME || "").trim() || path.join(os.homedir(), ".dsh");
  const profilesDir = path.join(home, "profiles");
  const valid = (name) => {
    const n = sanitizeProfileName(name);
    return n && fs.existsSync(path.join(profilesDir, n)) ? n : "";
  };
  const fromEnv = valid(env.DSH_PROFILE);
  if (fromEnv) return fromEnv;
  const fromArgv = valid(profileNameFromArgv(argv));
  if (fromArgv) return fromArgv;
  const fromLocation = valid(profileNameFromModuleUrl(moduleUrl, profilesDir));
  if (fromLocation) return fromLocation;
  try {
    const dp = ctx && typeof ctx.get === "function" ? ctx.get("desktopProfiles") : null;
    const current = dp && typeof dp === "object" ? dp.current : null;
    return valid(current && typeof current.name === "string" ? current.name : "");
  } catch (e) {
    return "";
  }
}

/** 默认数据文件：识别到 profile 时落在 <home>/profiles/<名>/text-inject/ 下。 */
export function defaultDataFile(ctx) {
  const profile = detectProfileName({ ctx });
  const home = String(process.env.DSH_HOME || "").trim() || path.join(os.homedir(), ".dsh");
  return profile
    ? path.join(home, "profiles", profile, "text-inject", "inject.md")
    : LEGACY_DATA_FILE;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:163-175](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L163-L175)

schema缺失时继续

<details>
<summary>查看原文（13行）</summary>

```text
let Config;
try {
  const req = createRequire(import.meta.url);
  const loaded = req("@deepseek-ai/schemastery");
  const z = (loaded && loaded.default) || loaded;
  if (z && typeof z.object === "function") {
    Config = z.object({
      file: z.string().default(""),
      historyLimit: z.number().default(DEFAULT_HISTORY_LIMIT),
    });
  }
} catch (e) {
  Config = undefined; // 拿不到 schemastery 就不做 schema 校验，功能不受影响
```

</details>

**依据 4 · 源码核查**：[lib/index.js:726-761](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L726-L761)

保存和恢复的文件副作用

<details>
<summary>查看原文（36行）</summary>

```text
      // 保存（带校验）
      if (req.method === "POST" && p === "/save") {
        const body = parseJson(await readBody(req));
        const blocks = body && body.blocks;
        const errs = validateBlocks(blocks);
        if (errs.length) return json(res, 400, { error: errs[0], errors: errs });
        const raw = serializeBlocks(blocks);
        const backupName = backup();
        try {
          fs.writeFileSync(dataFile, raw, "utf8");
        } catch (e) {
          return json(res, 500, { error: `写入失败：${e?.message}` });
        }
        reload("保存");
        return json(res, 200, { ok: true, backup: backupName, ...snapshot() });
      }

      // 恢复某份历史
      if (req.method === "POST" && p === "/restore") {
        const body = parseJson(await readBody(req)) || {};
        const safe = path.basename(String(body.name || ""));
        if (!safe) return json(res, 400, { error: "缺少 name" });
        let raw = "";
        try {
          raw = fs.readFileSync(path.join(historyDir, safe), "utf8");
        } catch (e) {
          return json(res, 404, { error: "找不到这份历史" });
        }
        backup();
        try {
          fs.writeFileSync(dataFile, raw, "utf8");
        } catch (e) {
          return json(res, 500, { error: `写入失败：${e?.message}` });
        }
        reload("恢复历史");
        return json(res, 200, { ok: true, ...snapshot() });
```

</details>

#### 缺口

- 耗时、token增量及真实宿主兼容未测
  **影响**：总成本与可靠性未知
  **进一步探讨**：记录实际模型输入长度和保存/恢复/卸载验收

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可验证什么改进及何时试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是保存前显示“此轮实际装配及适用范围”，同时对旧trigger字段显式警告，比保留静默兼容更少误注入。依据是Q03的字段语义漂移和Q02的部分注册状态。最小实验将含trigger、重复标题、空块、错误order的文件交给使用者，比较现状与显式预览的错误发现率、恢复时间及多余token；若用户无需该提示且增加操作却不减少错误，则否定。当前建议有限试用非敏感短文本，先核对实际profile路径、无关键词轮次和禁用/恢复/卸载；不能依赖trigger限制范围。若装配与预期不一致则停止注入并回退原文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:434-465](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L434-L465)

有效装配和注册错误可形成预览输入

<details>
<summary>查看原文（32行）</summary>

```text
    const sp = ctx.systemPrompt;
    if (!sp || typeof sp.section !== "function" || typeof sp.context !== "function") {
      registerErrors.push("systemPrompt 服务不可用，注入未生效");
      return;
    }

    let nSys = 0;
    let nCtx = 0;
    for (const b of state.blocks) {
      if (!b.enabled) continue;
      if (!b.body || !b.body.trim()) continue;

      const title = (b.title || "").trim();
      if (!title) {
        registerErrors.push(`有一个 ${b.type === "system" ? "系统提示词" : "上下文"}块没有标题，已被跳过`);
        continue;
      }

      const order = Number.isFinite(b.order) ? b.order : (b.type === "system" ? DEFAULT_SYSTEM_ORDER : DEFAULT_CONTEXT_ORDER);
      // 系统侧落在固定段之前的，按 MIN_ORDER 抬高（只提示，不阻断）
      const effective = b.type === "system" ? Math.max(order, MIN_ORDER) : order;

      try {
        if (b.type === "system") {
          sysDisposers.push(sp.section({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nSys++;
        } else {
          ctxDisposers.push(sp.context({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nCtx++;
        }
      } catch (e) {
        registerErrors.push(`「${title}」注册失败：${e?.message || e}`);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:726-740](https://github.com/1497105876/dsh-text-inject/blob/42c698eb9b0967afdf940f01809701f9274d1cf9/lib/index.js#L726-L740)

保存后返回状态但非原子保证

<details>
<summary>查看原文（15行）</summary>

```text
      // 保存（带校验）
      if (req.method === "POST" && p === "/save") {
        const body = parseJson(await readBody(req));
        const blocks = body && body.blocks;
        const errs = validateBlocks(blocks);
        if (errs.length) return json(res, 400, { error: errs[0], errors: errs });
        const raw = serializeBlocks(blocks);
        const backupName = backup();
        try {
          fs.writeFileSync(dataFile, raw, "utf8");
        } catch (e) {
          return json(res, 500, { error: `写入失败：${e?.message}` });
        }
        reload("保存");
        return json(res, 200, { ok: true, backup: backupName, ...snapshot() });
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
