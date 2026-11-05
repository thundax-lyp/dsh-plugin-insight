# dsh-text-inject

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b554c73](https://github.com/1497105876/dsh-text-inject/tree/b554c73030733def392fbdb804c94dfd86525e1b)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 设置中管理可热加载的 Markdown 系统提示与上下文片段。

> **亮点**：[Q01](#research-q01) 将可编辑片段变为可重新挂载的宿主规则。

> **主要限制**：[Q01](#research-q01) 文档中的 trigger 不能从实际注册得到支持。[Q02](#research-q02) 编辑和读取的权限依赖宿主。

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
  - [Q01 · 注入与关键词行为是什么？](#detail-section-11)
  - [Q02 · 设置路由和写入边界是什么？](#detail-section-12)
  - [Q03 · 怎样以合成内容试用？](#detail-section-13)
  - [Q04 · 怎样解释未生效配置？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复复用项目说明和提示规则的 DSH 操作者。

每次手工粘贴或维护宿主原有规则。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 提示片段 | 复用系统规则与背景 | 以宿主实际注册为准 |
| 配置历史 | 保存与恢复 | 需核对编辑权限和路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 宿主提示服务 | 必需 | 挂载段落 | 无服务即无注入 |
| Web 服务 | 设置必需 | 读写片段 | 保留手工配置 |
| 独立文件路径 | 隔离试用必需 | 限定历史 | 先核对实际落盘 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户指定临时文件 | 避免共享路径 |
| 检查 | 操作者用合成标记观察请求 | 区分匹配与未匹配 |
| 退出 | 用户移除加载配置 | 按需处理历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主资源未知 | 准备合成资料 | 未实测 |
| 持续 | 提示 token 未测 | 维护片段 | 检查注入频率 |
| 失败恢复 | 重试成本未知 | 核对保存及注册 | 历史独立保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 片段维护 | 配置和运行时注册 | 实际匹配边界 |
| 历史 | 备份及恢复路径 | 中断和竞争行为 |

> **思考**：[Q01](#research-q01) 文档中的 trigger 不能从实际注册得到支持。[Q02](#research-q02) 编辑和读取的权限依赖宿主。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将可编辑片段变为可重新挂载的宿主规则。

[Q01](#research-q01) 文本解析和宿主注册分开，须以实际参数判断语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 文档中的 trigger 不能从实际注册得到支持。[Q02](#research-q02) 编辑和读取的权限依赖宿主。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从独立文件和合成内容开始。[Q02](#research-q02) 核对读取、编辑和恢复边界。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核对固定解析、注册和保存路径，未运行插件。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/parser.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主、解析与配置说明，未执行目标。
- 下一步：核对关键词反例、跨客户端保存和停用。

**分析版本**

- **仓库**：[1497105876/dsh-text-inject](https://github.com/1497105876/dsh-text-inject)
- **版本号**：2.1.101（[固定提交 b554c73](https://github.com/1497105876/dsh-text-inject/tree/b554c73030733def392fbdb804c94dfd86525e1b)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 区分已保存字段与实际挂载参数。

核对关键词反例、跨客户端保存和停用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 800 | — | — | 7163 |
| .js | source | 3 | 2364 | 1892 | 308 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-text-inject/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Markdown 规则何时注入、如何编辑与回退？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 注入与关键词行为是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复向模型复制项目背景的用户，可以将片段保存为 Markdown 块并随宿主加载。解析层识别 system 和 context 及元数据。固定宿主注册只核对 enabled、非空正文、标题和顺序，再将正文提交给 section 或 context。README 所述 kind 与 trigger 行为在这里没有传递给宿主，不能依赖关键词使内容只在指定轮次出现。相对手工复制，增量是集中编辑和热更新，暴露范围可能比作者示例宽。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-75](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/README.md#L54-L75)

作者描述关键词和 kind

<details>
<summary>查看原文（22行）</summary>

````text
## 数据文件格式

```md
# 任意标题（说明用，忽略）

## [system] 我的常驻规则
order: 40

这段会追加进系统提示词，每轮生效。

## [context] 项目背景
kind: gw-project
trigger: 项目,需求

当消息里出现「项目」或「需求」时，这段作为一条 user 消息注入会话。
```

- 块头：`## [system] 名称` 或 `## [context] 名称`（大小写不敏感）。
- 元数据：紧跟在块头之后、正文之前，**英文冒号**，只认 `order` / `kind` / `trigger` / `enabled`。
  一旦出现非元数据、非空行，后面就全是正文——所以正文里的「中文：」不会被误解析。
- `[context]` 块必须有 `kind`（唯一，用于去重）；`trigger` 留空 = 每轮注入。
- `enabled: false` 可临时禁用某块。
````

</details>

**依据 2 · 源码核查**：[lib/parser.js:21-38](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/parser.js#L21-L38)

解析接受这两个元数据字段

<details>
<summary>查看原文（18行）</summary>

```text
/** 块头正则：`## [system] 标题` / `## [context] 标题`（大小写不敏感）。 */
const HEAD_RE = /^##\s*\[\s*(system|context)\s*\]\s*(.*)$/i;

/** 元数据行正则：`键: 值`（键为标识符，值可空）。 */
const META_RE = /^([A-Za-z_\u4e00-\u9fa5][A-Za-z0-9_\u4e00-\u9fa5]*)\s*[:：]\s*(.*)$/;

/** 元数据键的别名映射（统一到内部规范名）。 */
const KEY_ALIAS = new Map([
  ["order", "order"], ["排序", "order"], ["顺序", "order"],
  ["desc", "desc"], ["description", "desc"], ["描述", "desc"], ["说明", "desc"], ["备注", "desc"],
  ["trigger", "trigger"], ["触发", "trigger"], ["关键词", "trigger"],
  ["enabled", "enabled"], ["启用", "enabled"],
  ["kind", "kind"], ["类型", "kind"],
  ["pinned", "pinned"], ["钉住", "pinned"],
]);

/** 会被当作元数据（而非正文）的键。 */
const META_KEYS = new Set(["order", "desc", "trigger", "enabled", "kind", "pinned"]);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:427-466](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L427-L466)

两类实际注册参数不含 trigger 或 kind

<details>
<summary>查看原文（40行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:473-506](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L473-L506)

文件变更后的刷新

<details>
<summary>查看原文（34行）</summary>

```text
  function reload(reason) {
    if (disposed) return;
    loadState();
    try {
      registerAll();
    } catch (e) {
      // 卸载竞态：定时器可能在插件已卸载后才触发，此时 ctx 已失效。
      // 这不是错误，静默吞掉即可，否则日志里会刷无意义的堆栈。
      if (disposed) return;
      warn(`[gw-text-inject] 热加载失败: ${e?.message}`);
      return;
    }
    log(`[gw-text-inject] 已热加载（${reason || "手动"}）：${state.blocks.length} 个块`);
  }

  ensureDirs();
  loadState();
  registerAll();
  log(
    `[gw-text-inject] 已加载：system ${state.blocks.filter((b) => b.type === "system").length} / ` +
      `context ${state.blocks.filter((b) => b.type === "context").length}；文件 ${dataFile}`
  );

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
```

</details>

#### 缺口

- 未实际观察宿主如何消费注册的 context
  **影响**：不能保证一段内容只在某类请求出现
  **进一步探讨**：用合成标记在匹配与不匹配的两条消息中检查实际模型输入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置路由和写入边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主通过 prefix 路由返回当前原文、路径和历史。保存校验块后先调用备份，再直接同步写入并 reload；恢复用 basename 解析指定历史并回写。所读 handler 分支未体现独立身份或角色校验，实际依赖宿主路由围栏。热刷新先撤销旧段，再逐项注册，失败项保留错误但不会整体恢复上一组。写入中断及跨客户端竞争没有在所读分支看到原子替换或版本条件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:623-641](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L623-L641)

原文及历史路径响应

<details>
<summary>查看原文（19行）</summary>

```text
  async function handler(req, res) {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      const p = url.pathname.slice(ROUTE_PREFIX.length) || "/";
      const q = url.searchParams;

      const snapshot = () => ({
        file: dataFile,
        raw: state.raw,
        blocks: state.blocks,
        history: listHistory(),
        errors: registerErrors,
        minOrder: MIN_ORDER,
        anchors: buildAnchors(),
        defaults: { system: DEFAULT_SYSTEM_ORDER, context: DEFAULT_CONTEXT_ORDER },
      });

      // 读状态
      if (req.method === "GET" && (p === "/state" || p === "/")) return json(res, 200, snapshot());
```

</details>

**依据 2 · 源码核查**：[lib/index.js:727-761](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L727-L761)

写入、历史恢复和响应

<details>
<summary>查看原文（35行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/index.js:770-774](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L770-L774)

Web 路由注册

```text
  let routeDisposer = null;
  try {
    if (ctx.webServer && typeof ctx.webServer.register === "function") {
      routeDisposer = ctx.webServer.register({ kind: "prefix", path: ROUTE_PREFIX, handler });
      log(`[gw-text-inject] 数据端点已注册：${ROUTE_PREFIX}/state`);
```

**依据 4 · 源码核查**：[lib/index.js:428-466](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L428-L466)

先释放旧段并逐块处理失败

<details>
<summary>查看原文（39行）</summary>

```text
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
```

</details>

#### 缺口

- 未验证宿主鉴权、跨标签页写入和故障恢复
  **影响**：无法确认生产数据完整性和保密性
  **进一步探讨**：用临时文件、两个客户端及虚拟隐私标记检查权限和失效

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样以合成内容试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

插件依赖宿主 systemPrompt 与 webServer，浏览器界面另有设置依赖。默认按 profile 选择文件，识别不到会落到共享路径，因此隔离试用应先明确配置文件并确认备份范围。持续使用的主要成本来自进入模型提示的重复内容和维护变更。移除加载配置不会自动删除数据和历史。若触发条件或授权验证失败，停用并恢复手工短片段。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:139-145](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L139-L145)

按 profile 的默认路径和回退

```text
/** 默认数据文件：识别到 profile 时落在 <home>/profiles/<名>/text-inject/ 下。 */
export function defaultDataFile(ctx) {
  const profile = detectProfileName({ ctx });
  const home = String(process.env.DSH_HOME || "").trim() || path.join(os.homedir(), ".dsh");
  return profile
    ? path.join(home, "profiles", profile, "text-inject", "inject.md")
    : LEGACY_DATA_FILE;
```

**依据 2 · 作者声明**：[README.md:88-94](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/README.md#L88-L94)

作者声明依赖

```text
## 依赖与兼容

- host 半依赖服务：`systemPrompt`（`@deepseek-ai/dsh-base` 提供）、`webServer`（`@deepseek-ai/dsh-host-webserver` 提供）。
- client 半依赖服务：`slots`、`locale`；`dsh.client.inject` 声明 `@deepseek-ai/dsh-client-locale`、`@deepseek-ai/dsh-client-ui-settings`。
- `dsh.client.platform = "web"`；`exports` 含 `"."` 与 `"./client"`。
- **兼容 dsh 0.1.2-rc.1 及以上**（含 0.1.7、0.2.0 全系列），通过 `peerDependencies["@deepseek-ai/dsh"]` 声明；同一份代码通吃，无需按 dsh 版本挑插件版本（最后验证 2026-10-01）。
- 官方 `@deepseek-ai/*` 包未列入 `dependencies`，由宿主 profile 提供。
```

**依据 3 · 作者声明**：[README.md:102-114](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/README.md#L102-L114)

退出、数据与提示成本

<details>
<summary>查看原文（13行）</summary>

```text
## 卸载

1. 删掉 profile `cordis.patch.yml` 里的 `gw-text-inject` insert 块。
2. 删除 `node_modules/@gw/dsh-text-inject/`。
3. 数据文件 `~/.dsh/text-inject/`（旧全局目录）与各 profile 的 `~/.dsh/profiles/<profile>/text-inject/`（含 `history/`）可按需保留或删除。
4. 重启 dsh。

## 权限与数据

- 读写的只有一份文件：默认 profile 专属目录下的 `inject.md` 及其 `history/` 备份（识别不到 profile 时回落 `~/.dsh/text-inject/`；可在 loader 配置里改到任意路径）。
- 不访问网络、不读凭据、不上报任何数据。
- 前端与 host 之间走 dsh 自己的 webServer **同源**路由（`/gw-text-inject/*`），不额外开端口、无跨域。
- 注入的内容会进入每一轮请求，等于放大提示词体积——`[context]` 块建议配 `trigger`，别全量常驻，否则白白烧 token。
```

</details>

#### 缺口

- 未实测提示体积、使用成本或卸载
  **影响**：无法给出真实资源与恢复时间
  **进一步探讨**：在隔离 profile 核对数据路径、提示与禁用结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样解释未生效配置？

**研究主题**：新假设与验证

#### 完整回答

可对已解析但未参与运行时注册的字段加提示，将已保存与已挂载区分开。用同一份含 trigger、重名和有效块的资料对照当前界面，核对用户能否正确判断哪些轮次有内容、哪些块失败。若误判率或排障时间没有下降，就不增加界面负担。

#### 证据与依据

**依据 1 · 源码核查**：[lib/parser.js:100-119](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/parser.js#L100-L119)

识别元数据

<details>
<summary>查看原文（20行）</summary>

```text
    if (inMeta) {
      const trimmed = line.trim();
      if (!trimmed) continue; // 元数据区的空行忽略，不算正文开始
      const mm = META_RE.exec(trimmed);
      const key = mm ? KEY_ALIAS.get(mm[1].toLowerCase()) : undefined;
      if (mm && key && META_KEYS.has(key)) {
        const val = mm[2] || "";
        if (key === "order") {
          const n = parseInt(val, 10);
          cur.order = Number.isFinite(n) ? n : cur.order;
        } else if (key === "enabled") {
          cur.enabled = truthy(val);
        } else if (key === "pinned") {
          cur.pinned = truthy(val);
        } else {
          cur[key] = String(val).trim();
        }
        continue;
      }
      inMeta = false; // 第一个非元数据行 = 正文开始，落到下面收集
```

</details>

**依据 2 · 源码核查**：[lib/index.js:452-466](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L452-L466)

实际参数与错误回传

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:629-637](https://github.com/1497105876/dsh-text-inject/blob/b554c73030733def392fbdb804c94dfd86525e1b/lib/index.js#L629-L637)

已有状态对象

```text
      const snapshot = () => ({
        file: dataFile,
        raw: state.raw,
        blocks: state.blocks,
        history: listHistory(),
        errors: registerErrors,
        minOrder: MIN_ORDER,
        anchors: buildAnchors(),
        defaults: { system: DEFAULT_SYSTEM_ORDER, context: DEFAULT_CONTEXT_ORDER },
```

#### 缺口

- 未检查所有客户端提示或用户判断
  **影响**：不能确定界面建议有增量
  **进一步探讨**：先走查现有预览，再做对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
