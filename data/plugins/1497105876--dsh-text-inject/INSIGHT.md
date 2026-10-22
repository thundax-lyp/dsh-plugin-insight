# dsh-text-inject

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[42970dd](https://github.com/1497105876/dsh-text-inject/tree/42970dd9743730259ba04af40f5ece1db1e7c7bc)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：通过独立 Markdown 文件与设置页管理 DSH 系统提示词和运行时上下文的热加载插件。

> **核心亮点**：把提示词文本从官方配置独立出来，提供设置页、预览、历史备份与热加载。详见[Q01](#research-q01)。

> **风险与缺陷**：[context] 不按 README 的 trigger 条件门控；GET/POST 路由可读改完整提示词，必须核宿主外层权限。详见[Q03](#research-q03)和[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 独立文件提示词配置服务什么场景？](#detail-section-11)
  - [Q02 · 文件解析、热加载和历史备份怎样闭合？](#detail-section-12)
  - [Q03 · README 的 kind 去重和 trigger 关键词门控仍然生效吗？](#detail-section-13)
  - [Q04 · 同源数据路由的读取/写入边界是什么？](#detail-section-14)
  - [Q05 · 如何以可审查方式启用注入并控制长期代价？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户维护常驻约束与背景文本；初始示例会自动注册，应先处理。详见[Q01](#research-q01)。

手工改官方提示词配置可实现常驻文字；独立文件和 UI 易维护，但仍需承担 Token/权限成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| system/context 块 | 注入规则/背景 | 示例默认生效 |
| 热加载/备份 | 维护回滚 | watch/敏感历史 |
| trigger/kind | README 所述门控 | 源码未使用、保存丢失 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH systemPrompt | 必需 | system/context 注册 | 注入失效 |
| webServer/slots | 设置页 | 状态/保存/预览 | UI 不可用 |
| 本地文件系统 | 必需 | inject.md/历史/监听 | 无法保存/热加载 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | profile 加包/重启 | 设置页可见 |
| 初始化 | 清种子示例 | 预览无占位文字 |
| 配置 | 加 system/context 块并保存 | 预览和实际会话核对 |
| 回滚 | history 恢复 | 文件/装配回到旧版 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Web/独立 inject.md | 手工安装/删示例 | 兼容未测 |
| 每轮 | 系统/上下文文本可能增加 token | 控块数/预览 | trigger 当前无效 |
| 历史 | 默认最多30份原文备份 | 审敏感数据/权限 | 文件/路由鉴权未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 文件热加载 | fs.watch/撤销重挂 | 各平台可靠性 |
| 备份/恢复 | history 文件 | 敏感数据保护 |
| 条件上下文 | README 声明 trigger | 源码未实现 |

> **思考**：[context] 不按 README 的 trigger 条件门控；GET/POST 路由可读改完整提示词，必须核宿主外层权限。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把提示词文本从官方配置独立出来，提供设置页、预览、历史备份与热加载。详见[Q01](#research-q01)。

把提示词文本从官方配置独立出来，提供设置页、预览、历史备份与热加载。详见[Q01](#research-q01)。

撤旧注册再重挂/清理处理细致；条件门控与序列化往返、路由权限边界需优先修。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[context] 不按 README 的 trigger 条件门控；GET/POST 路由可读改完整提示词，必须核宿主外层权限。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在受控 profile 观察试用；先删示例、核预览和路由权限，敏感提示词不直接放入。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核文件/热加载；README 的 kind/trigger 门控在现代码未使用且保存会丢字段，数据路由内层无鉴权，外层未知。

- 已检查：作者 README、包清单、源码路径 README.md、inject.md、lib/index.js、lib/parser.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、inject.md、lib/parser.js、lib/index.js、客户端入口及包声明；未运行目标插件/宿主，旧 META 仅复用。
- 下一步：目标 DSH 测初装示例、trigger/kind 往返、preview 与真实请求、fs.watch 原子保存、路由鉴权和历史权限。

**分析版本**

- **仓库**：[1497105876/dsh-text-inject](https://github.com/1497105876/dsh-text-inject)
- **版本号**：0.2.0-rc.2（[固定提交 42970dd](https://github.com/1497105876/dsh-text-inject/tree/42970dd9743730259ba04af40f5ece1db1e7c7bc)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为门控文档/实现对齐、路由授权、文件版本冲突与敏感历史管理。详见[Q05](#research-q05)。

目标 DSH 测初装示例、trigger/kind 往返、preview 与真实请求、fs.watch 原子保存、路由鉴权和历史权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 800 | — | — | 7117 |
| .js | source | 3 | 2288 | 1833 | 296 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1497105876/dsh-text-inject/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**文件化提示词注入是否按声明的条件生效、可回滚且读写权限可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立文件提示词配置服务什么场景？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件把用户维护的 inject.md 块显示在 DSH 设置页，可将 [system] 文字注册为系统提示词段、[context] 注册为运行时上下文段，支持启停、热加载、备份与恢复。适合需要在用户文件中管理常驻规则/动态背景的个人工作流。首次加载会从包内 inject.md 复制种子文件，其中两个示例块默认 enabled 且正文非空；若不删，会实际进入提示词/上下文，造成无意义文字污染。实际宿主装配和 Token 成本未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-22](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/README.md#L7-L22)

作者功能与数据文件定位

<details>
<summary>查看原文（16行）</summary>

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
| 历史备份 | 每次保存自动把上一版存进 `history/`，可查看 / 一键恢复（保留最近 30 份） |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:207-226](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L207-L226)

首次复制种子文件

<details>
<summary>查看原文（20行）</summary>

```text
  function ensureDirs() {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
      if (!fs.existsSync(dataFile)) {
        let seed = "";
        try { seed = fs.readFileSync(SEED_FILE, "utf8"); } catch (e) {}
        if (!seed) {
          seed =
            "# @gw/dsh-text-inject — 文字注入配置\n\n" +
            "## [system] 示例提示词\n描述: 这段会拼进系统提示词\n\n在这里写要常驻注入的内容。\n";
        }
        fs.writeFileSync(dataFile, seed, "utf8");
      }
    } catch (e) {
      warn(`[gw-text-inject] 初始化数据目录失败: ${e?.message}`);
    }
  }

  const readRaw = () => { try { return fs.readFileSync(dataFile, "utf8"); } catch (e) { return ""; } };
```

</details>

**依据 3 · 源码核查**：[inject.md:22-29](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/inject.md#L22-L29)

默认启用的两个示例块

```text
在这里写要常驻注入的内容。比如输出风格要求、领域约定、硬性规则。

## [context] 示例上下文
描述: 运行时上下文示例，可以删掉

这里写会随任务变化、但不需要每轮重申的背景信息。

它作为快照注入：内容没变时不会重复发送，改了才会追加一条新快照作废旧快照。
```

**依据 4 · 源码核查**：[lib/index.js:364-390](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L364-L390)

启用块实际注册

<details>
<summary>查看原文（27行）</summary>

```text
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

- 目标宿主如何呈现示例块/具体 token 增量未测
  **影响：**不能把初装默认配置视为空白安全状态
  **进一步探讨：**目标安装后预览真实装配并先删除示例

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件解析、热加载和历史备份怎样闭合？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

parser 以 ## [system|context] 标题切块，只在正文之前解析元数据；Host 每次 reload 先撤销旧 system/context 注册再按 order 重挂，监听目录 fs.watch 后150ms 防抖，设置页保存时先备份旧文件、写新文件并 reload。历史数量默认30份，读/恢复通过同源路由；卸载 effect 释放 watcher、路由和注册。实现可以不重启生效，但 fs.watch 对原子保存/平台差异的真实表现未核。备份包含完整注入文本，可能保留敏感上下文。

#### 证据与依据

**依据 1 · 源码核查**：[lib/parser.js:21-136](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/parser.js#L21-L136)

块语法与元数据

<details>
<summary>查看原文（116行）</summary>

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

/** 排序默认值：系统提示词侧 40（紧跟官方人格段 0 之后）。 */
const DEFAULT_SYSTEM_ORDER = 40;
/** 排序默认值：运行时上下文侧 125（错开官方 110/115/120，避免同序歧义）。 */
const DEFAULT_CONTEXT_ORDER = 125;

/**
 * 判断 enabled 的真假。空值视为「真」（默认开启）。
 * @param raw - `enabled:` 后面的原始字符串。
 * @returns 是否启用。
 */
function truthy(raw) {
  if (raw === undefined || raw === null) return true;
  const s = String(raw).trim().toLowerCase();
  if (!s) return true;
  return !["false", "0", "no", "off", "否", "关", "关闭"].includes(s);
}

/**
 * 解析数据文件为块数组。
 * @param raw - 文件全文。
 * @returns 块数组 `{id, type, title, desc, order, trigger, kind, enabled, body, line}`。
 */
export function parseBlocks(raw) {
  const lines = String(raw || "").split(/\r?\n/);
  const out = [];
  let cur = null;
  let inMeta = false;
  let bodyLines = [];

  const flush = () => {
    if (!cur) return;
    cur.body = bodyLines.join("\n").replace(/^\n+/, "").replace(/\s+$/, "");
    cur.title = cur.title.trim();
    out.push(cur);
    cur = null;
    bodyLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = HEAD_RE.exec(line.trim());
    if (m) {
      flush();
      cur = {
        id: "", // 由调用方按需生成（稳定 id 用 type+序号）
        type: m[1].toLowerCase(),
        title: m[2] || "",
        desc: "",
        order: null,
        trigger: "",
        kind: "",
        enabled: true,
        body: "",
        line: i + 1,
      };
      inMeta = true;
      continue;
    }
    if (!cur) continue; // 块外的内容（说明头等）忽略

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
    }
    bodyLines.push(line);
  }
  flush();

  // 补默认值 + 生成稳定 id（同名同类型时追加序号，保证唯一）
  const seen = new Map();
  for (const b of out) {
    if (b.order === null || !Number.isFinite(b.order)) {
      b.order = b.type === "system" ? DEFAULT_SYSTEM_ORDER : DEFAULT_CONTEXT_ORDER;
    }
    const base = `${b.type}:${b.title || "untitled"}`;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    b.id = n === 1 ? base : `${base}#${n}`;
  }
  return out;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:307-331](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L307-L331)

备份及保留数

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:351-436](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L351-L436)

撤销重挂/热加载

<details>
<summary>查看原文（86行）</summary>

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
  }

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
  } catch (e) {
    // 目录监听失败时退回单文件监听（聊胜于无）
    try { watcher = fs.watch(dataFile, onFsEvent); } catch (e2) {
      warn(`[gw-text-inject] 监听数据文件失败: ${e2?.message}`);
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:650-728](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L650-L728)

保存/恢复/清理

<details>
<summary>查看原文（79行）</summary>

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
      }

      return json(res, 404, { error: "未知接口" });
    } catch (e) {
      try { json(res, 500, { error: String(e?.message || e) }); } catch (e2) {}
    }
  }

  let routeDisposer = null;
  try {
    if (ctx.webServer && typeof ctx.webServer.register === "function") {
      routeDisposer = ctx.webServer.register({ kind: "prefix", path: ROUTE_PREFIX, handler });
      log(`[gw-text-inject] 数据端点已注册：${ROUTE_PREFIX}/state`);
    } else {
      warn("[gw-text-inject] 未找到 ctx.webServer，设置页数据通道不可用（注入功能不受影响）");
    }
  } catch (e) {
    warn(`[gw-text-inject] 注册数据端点失败: ${e?.message}`);
  }

  // ── 清理 ───────────────────────────────────────────────────
  function dispose() {
    disposed = true;
    clearTimeout(reloadTimer);
    releaseAll(sysDisposers);
    releaseAll(ctxDisposers);
    release(routeDisposer);
    release(watcher);
  }

  // 这里必须用 ctx.effect 登记清理，**不能**只靠 `return dispose`。
  //
  // 坑：cordis 的 isConstructor() 只看函数有没有 .prototype，而 function 声明天生
  // 带 prototype（箭头函数/async 函数没有）。所以插件导出的 apply 会被判定为「构造
  // 函数」，加载时走的是 `new apply(ctx, config)` —— 而 new 会丢弃返回值。
  // 结果：`return dispose` 在真实加载路径下等于没写，路由永远摘不掉（实测卸载后
  // /gw-text-inject 仍占用，重复注册报 duplicate prefix route）。
  // 官方插件（dsh-time-context 等）同样用 function 声明，一律靠 ctx.effect 收尾。
  //
  // dispose 是幂等的（数组已空、null 直接跳过），万一调用方同时拿到返回值也不会出事。
  if (typeof ctx.effect === "function") {
    ctx.effect(() => dispose, "@gw/dsh-text-inject");
  }
```

</details>

#### 缺口

- 目标平台 fs.watch 与备份权限/容量未测
  **影响：**不能保证每次外部编辑即时生效或历史无隐私代价
  **进一步探讨：**原子保存/热加载/卸载/备份权限矩阵

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · README 的 kind 去重和 trigger 关键词门控仍然生效吗？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

README 称 [context] 可用 kind 去重、trigger 关键词门控，但固定源码注释说明旧 v1 机制已改为 systemPrompt.context 快照：parser 虽读 kind/trigger，registerAll 只将 name/order/text 交给 sp.context，没有按触发词判断。serializeBlocks 也不输出 kind/trigger，设置页保存后会从文件中删除原有这些元数据。故依 README 编写“只在关键词出现时注入”的规则并不会按预期门控，可能扩大每轮上下文/Token；真实宿主快照去重仍需验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-18](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/README.md#L15-L18)

作者 kind/trigger 功能声明

```text
| 能力 | 说明 |
|---|---|
| 提示词注入 | `## [system] 名称` 块 → 追加进系统提示词，每轮对话生效 |
| 上下文注入 | `## [context] 名称` 块 → 合成一条 user 消息注入会话；`kind` 去重、`trigger` 关键词门控 |
```

**依据 2 · 作者声明**：[README.md:64-75](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/README.md#L64-L75)

作者示例/规则

<details>
<summary>查看原文（12行）</summary>

````text
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

**依据 3 · 源码核查**：[lib/parser.js:27-38](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/parser.js#L27-L38)

parser 接受旧字段

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/parser.js:158-175](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/parser.js#L158-L175)

序列化丢 kind/trigger

<details>
<summary>查看原文（18行）</summary>

```text
  const parts = [];
  for (const b of Array.isArray(blocks) ? blocks : []) {
    if (!b || (b.type !== "system" && b.type !== "context")) continue;
    const type = b.type;
    const title = String(b.title || "").trim() || "未命名";
    const meta = [];
    if (String(b.desc || "").trim()) meta.push(`描述: ${String(b.desc).trim()}`);
    if (Number.isFinite(b.order)) {
      const dflt = type === "system" ? DEFAULT_SYSTEM_ORDER : DEFAULT_CONTEXT_ORDER;
      if (b.order !== dflt) meta.push(`排序: ${b.order}`);
    }
    if (b.enabled === false) meta.push("启用: false");
    const body = String(b.body || "").replace(/\s+$/, "");
    parts.push(
      [`## [${type}] ${title}`, ...meta, "", body].join("\n")
    );
  }
  return head + (parts.length ? parts.join("\n\n") + "\n" : "");
```

</details>

**依据 5 · 源码核查**：[lib/index.js:380-387](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L380-L387)

context 注册未使用字段

```text
      try {
        if (b.type === "system") {
          sysDisposers.push(sp.section({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nSys++;
        } else {
          ctxDisposers.push(sp.context({ name: SECTION_PREFIX + title, order: effective, text: b.body }));
          nCtx++;
        }
```

#### 缺口

- 宿主 systemPrompt.context 的快照发送细节未测
  **影响：**不能宣称关键词门控/按 kind 去重现存
  **进一步探讨：**修文档或实现条件逻辑，并做触发/保存往返测试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 同源数据路由的读取/写入边界是什么？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Host 注册 /gw-text-inject 前缀路由，GET state/raw/diff 可读当前与历史注入原文，POST save/restore/pin 可修改文件；handler 内没有独立认证/Origin/CSRF 校验。README 说同源只是前端访问方式，不等于授权；webServer 外层是否保护该前缀未知，不能直接认定远端可调用。若外层没有严格权限，读写系统提示词的影响高。readBody 以字符数超过4e6时 destroy 请求，没有正常 413 回复；文件写入同步执行，写入容量/并发冲突亦需目标验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:77-86](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/README.md#L77-L86)

作者同源路由说明

<details>
<summary>查看原文（10行）</summary>

```text
## 设置页数据通道

前端无本地文件桥，读写经 host 的 webServer 路由（**同源**，无 CORS、不额外占端口）：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/gw-text-inject/state` | `{ file, raw, blocks, history }` |
| POST | `/gw-text-inject/save` | body `{ blocks }` → 保存 + 自动备份 |
| POST | `/gw-text-inject/restore` | body `{ name }` → 恢复某份备份 |
| GET | `/gw-text-inject/raw?name=<备份名>` | 读某份备份原文 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:529-565](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L529-L565)

数据通道与状态原文

<details>
<summary>查看原文（37行）</summary>

```text
  // ── 数据通道：webServer 路由（同源）──────────────────────
  function json(res, code, obj) {
    res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify(obj));
  }
  function readBody(req) {
    return new Promise((resolve) => {
      let buf = "";
      req.on("data", (c) => {
        buf += c;
        if (buf.length > 4e6) { try { req.destroy(); } catch (e) {} }
      });
      req.on("end", () => resolve(buf));
      req.on("error", () => resolve(""));
    });
  }
  const parseJson = (s) => { try { return JSON.parse(s); } catch (e) { return null; } };

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

**依据 3 · 源码核查**：[lib/index.js:605-685](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L605-L685)

历史读取/写入/恢复

<details>
<summary>查看原文（81行）</summary>

```text
      // 读某份历史原文
      if (req.method === "GET" && p === "/raw") {
        const safe = path.basename(q.get("name") || "");
        if (!safe) return json(res, 400, { error: "缺少 name" });
        try {
          return json(res, 200, { name: safe, raw: fs.readFileSync(path.join(historyDir, safe), "utf8") });
        } catch (e) {
          return json(res, 404, { error: "找不到这份历史" });
        }
      }

      // 某份历史 vs 当前版本的差异
      if (req.method === "GET" && p === "/diff") {
        const safe = path.basename(q.get("name") || "");
        if (!safe) return json(res, 400, { error: "缺少 name" });
        let old = "";
        try {
          old = fs.readFileSync(path.join(historyDir, safe), "utf8");
        } catch (e) {
          return json(res, 404, { error: "找不到这份历史" });
        }
        const baseName = path.basename(q.get("base") || "");
        let base = readRaw();
        let baseLabel = "当前版本";
        if (baseName) {
          try {
            base = fs.readFileSync(path.join(historyDir, baseName), "utf8");
            baseLabel = baseName;
          } catch (e) {}
        }
        return json(res, 200, { name: safe, base: baseLabel, ...diffLines(old, base) });
      }

      // 钉住 / 取消钉住
      if (req.method === "POST" && p === "/pin") {
        const body = parseJson(await readBody(req)) || {};
        const safe = path.basename(String(body.name || ""));
        if (!safe) return json(res, 400, { error: "缺少 name" });
        const pinned = readPinned();
        if (body.pinned === false) pinned.delete(safe);
        else pinned.add(safe);
        writePinned(pinned);
        return json(res, 200, { ok: true, history: listHistory() });
      }

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

**依据 4 · 源码核查**：[lib/index.js:694-703](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L694-L703)

注册路由无内层鉴权

<details>
<summary>查看原文（10行）</summary>

```text
  let routeDisposer = null;
  try {
    if (ctx.webServer && typeof ctx.webServer.register === "function") {
      routeDisposer = ctx.webServer.register({ kind: "prefix", path: ROUTE_PREFIX, handler });
      log(`[gw-text-inject] 数据端点已注册：${ROUTE_PREFIX}/state`);
    } else {
      warn("[gw-text-inject] 未找到 ctx.webServer，设置页数据通道不可用（注入功能不受影响）");
    }
  } catch (e) {
    warn(`[gw-text-inject] 注册数据端点失败: ${e?.message}`);
```

</details>

#### 缺口

- 目标 webServer 外层会话/CSRF 保护未知
  **影响：**不能仅因同源就认为提示词读写已授权
  **进一步探讨：**目标宿主审路由鉴权/跨站请求/并发保存

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何以可审查方式启用注入并控制长期代价？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

安装后先检查默认示例、删除或禁用，使用 /preview 核系统段和上下文段，再在少量会话比较 token/回答变化；包含敏感文本时审文件/历史目录权限，谨慎对待备份恢复。不要依赖 README 的 trigger/kind 门控；需要按场景动态注入时先实现真正条件选择或改用其他机制。候选改进包括更新文档与保存往返、路由授权、文件大小/并发版本保护、脱敏备份；均非当前能力。建议观察性试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-52](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/README.md#L24-L52)

作者安装/默认路径

<details>
<summary>查看原文（29行）</summary>

````text
## 安装

1. 把本包放进对应 profile 的 node_modules（scope 目录 `@gw`）：

   ```bash
   # web profile（桌面客户端则换成 profiles/desktop）
   cp -r dsh-text-inject ~/.dsh/profiles/web/node_modules/@gw/
   ```

2. 在 profile 的 `cordis.patch.yml` 追加 loader 入口：

   ```yaml
   - insert:
       - id: gw-text-inject
         name: '@gw/dsh-text-inject'
   ```

3. 重启 dsh，打开设置页 → 左侧栏出现「**文字注入**」。

数据文件默认在 `~/.dsh/text-inject/inject.md`，插件首次加载会自动创建（含示例块）。
想换位置，在 loader 入口加 `config.file`：

```yaml
- insert:
    - id: gw-text-inject
      name: '@gw/dsh-text-inject'
      config:
        file: 'C:/Users/<你的用户名>/Desktop/文字注入.md'
```
````

</details>

**依据 2 · 源码核查**：[lib/index.js:553-603](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L553-L603)

状态/预览能力

<details>
<summary>查看原文（51行）</summary>

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
      });

      // 读状态
      if (req.method === "GET" && (p === "/state" || p === "/")) return json(res, 200, snapshot());

      // 实时预览：调官方装配
      if (req.method === "POST" && p === "/preview") {
        const body = parseJson(await readBody(req)) || {};
        const out = { ok: true, scopes: [], errors: [...registerErrors] };
        // 全局
        try {
          out.global = await buildPreview(undefined);
          out.scopes.push("global");
        } catch (e) {
          out.ok = false;
          out.errors.push(`全局装配失败：${e?.message || e}`);
        }
        // 当前活跃 agent（可能有 agent 作用域专属的段）
        try {
          // ctx.get 是拿「可选服务」的官方写法。直接写 ctx.agents 会在没声明
          // inject 时抛 'cannot get property "agents" without inject'，
          // 把 agent 作用域的段全漏掉。
          const agentsSvc = ctx.get ? ctx.get("agents") : undefined;
          const agents = agentsSvc?.list?.();
          if (Array.isArray(agents) && agents.length) {
            const scoped = [];
            for (const a of agents) {
              try {
                const r = await buildPreview(a);
                scoped.push({ id: a?.id ?? "agent", ...r });
              } catch (e) {
                out.errors.push(`agent「${a?.id}」装配失败：${e?.message || e}`);
              }
            }
            if (scoped.length) { out.scoped = scoped; out.scopes.push("agent"); }
          }
        } catch (e) {
          out.errors.push(`读取活跃 agent 失败：${e?.message || e}`);
        }
        // 只传作用域里明确要求的那部分（避免把整个 agent 对象序列化出去）
        return json(res, 200, out);
      }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:650-685](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/index.js#L650-L685)

备份/保存/恢复

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

**依据 4 · 源码核查**：[lib/parser.js:158-175](https://github.com/1497105876/dsh-text-inject/blob/42970dd9743730259ba04af40f5ece1db1e7c7bc/lib/parser.js#L158-L175)

保存语义

<details>
<summary>查看原文（18行）</summary>

```text
  const parts = [];
  for (const b of Array.isArray(blocks) ? blocks : []) {
    if (!b || (b.type !== "system" && b.type !== "context")) continue;
    const type = b.type;
    const title = String(b.title || "").trim() || "未命名";
    const meta = [];
    if (String(b.desc || "").trim()) meta.push(`描述: ${String(b.desc).trim()}`);
    if (Number.isFinite(b.order)) {
      const dflt = type === "system" ? DEFAULT_SYSTEM_ORDER : DEFAULT_CONTEXT_ORDER;
      if (b.order !== dflt) meta.push(`排序: ${b.order}`);
    }
    if (b.enabled === false) meta.push("启用: false");
    const body = String(b.body || "").replace(/\s+$/, "");
    parts.push(
      [`## [${type}] ${title}`, ...meta, "", body].join("\n")
    );
  }
  return head + (parts.length ? parts.join("\n\n") + "\n" : "");
```

</details>

#### 缺口

- 真实效果/成本、宿主注入优先级与鉴权未测
  **影响：**不能直接用于敏感全局提示词
  **进一步探讨：**受控 profile 预览/路由权限/Token 差异验收

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
