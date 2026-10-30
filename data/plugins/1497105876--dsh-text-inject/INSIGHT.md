# 文字注入

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ce9e443](https://github.com/1497105876/dsh-text-inject/tree/ce9e4439da23b03060166def143dc0200ca6b369)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：用独立Markdown和Web卡片管理常驻system/context文本，带热加载/历史/装配预览；范围与恢复需验。

> **亮点**：把独立内容文件、GUI管理、目录watch/统一disposer与官方注入接口衔接，并已有global/agent装配与历史工具；增量是内容管理/生命周期接线，不是通用Agent、项目门控或任务质量保障。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：trigger/kind未传入注册，预览不是草稿/最终请求；管理API能读写提示和预览其他段却无组件准入，热替换/备份也非事务。profile回落/共享history和Markdown分块须核，源码条件未当真实泄露/删除，见[Q03](#research-q03)。

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
  - [Q01 · 独立文件注入解决什么，作用范围和原生能力怎样分清？](#detail-section-11)
  - [Q02 · 编辑、保存、热加载、备份和真正注册如何串联？](#detail-section-12)
  - [Q03 · trigger、预览、profile、解析和HTTP权限的实际边界是什么？](#detail-section-13)
  - [Q04 · 依赖、操作、四阶段成本和效果怎样验收？](#detail-section-14)
  - [Q05 · 已有预览之外，什么增量仍值得验证？](#detail-section-15)
  - [Q06 · 现在如何采用，什么时候停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：明确希望常驻且频繁维护规则/背景的用户，以正确文件版本/作用域进入真实请求并能禁用恢复验收；保存ok不是完成。见[Q01](#research-q01)。

相比配置长文本，文件与卡片/历史/现有预览减少内容耦合；原生项目指令/说明文件、编辑器和Git是简单替代。官方section/context、投影去重与模型能力不归本插件原创，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 常驻文本管理 | 独立Markdown与system/context注册 | 无trigger/kind门控，实际请求/投影归宿主 |
| 文件/卡片热编辑 | GUI基础校验、watch和disposer重载 | 自动保存、非无损Markdown/非原子切换，无CAS |
| 已有装配视图 | global/活跃agent全部段、mine/errors/anchors | 当前注册快照，非未存草稿/最终请求，访问须保护 |
| 历史恢复 | 备份/diff/pin/restore | 备份失败仍写、pin可超量、history需独占，恢复另验 |

**流程与依赖**

正确profile/独占数据与history、受保护管理访问、兼容systemPrompt/客户端和明确常驻意图是前提；schema缺失可降级，官方投影不替作用域验收。完整条件表见[Q04](#research-q04)。

先核/state真实路径和访问，缩成短块，知道切卡会自动保存，再查backup/errors/已有预览与授权请求；冲突/恢复/退出不明先停注入而非再写覆盖。步骤见[Q04](#research-q04)。

**效果与成本**

主要成本是常驻输入、全文预览/历史和故障恢复人工；context注释不等零token，长文件LCS也有主线程/行数乘积内存负担。四阶段明细集中[Q04](#research-q04)，未测现金/工时/净节省。

已确认文件与装配管理可检查；预览、保存/备份和最终请求是不同证据，不能用注册数或作者会话统计充当效果。效果表见[Q04](#research-q04)，新量与最强简单替代见[Q05](#research-q05)。

> **思考**：trigger/kind未传入注册，预览不是草稿/最终请求；管理API能读写提示和预览其他段却无组件准入，热替换/备份也非事务。profile回落/共享history和Markdown分块须核，源码条件未当真实泄露/删除，见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把独立内容文件、GUI管理、目录watch/统一disposer与官方注入接口衔接，并已有global/agent装配与历史工具；增量是内容管理/生命周期接线，不是通用Agent、项目门控或任务质量保障。见[Q01](#research-q01)、[Q02](#research-q02)。

目录watch和多形态disposer/错误列表、当前装配与历史工具值得借鉴；移植须同时定义草稿/文件版本、作用域、冲突和注册交换，不以兼容字段或保存ok掩盖语义漂移。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

trigger/kind未传入注册，预览不是草稿/最终请求；管理API能读写提示和预览其他段却无组件准入，热替换/备份也非事务。profile回落/共享history和Markdown分块须核，源码条件未当真实泄露/删除，见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：先验管理访问/目录与旧字段、草稿/注册/请求和恢复一致性，限定非敏感短文本；出现越范围/误装配/备份异常即停新注入、查已发内容后回退，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持独立文件管理、正式注册/热加载、历史及现有装配预览；作用范围、管理访问和完整恢复未运行。观察，先核权限/文件和真实请求。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、inject.md、lib/client.js、lib/index.js、lib/parser.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根/补丁/seed、实际Host/parser/Client，定向追卡片自动保存/当前预览、类型/元字段/围栏语义、序列化/校验/备份/裁剪/restore、profile探测/回落、section/context/disposer/watch、全局/agent assemble和HTTP历史/读写/退出。未全审全部UI/宿主准入、真实RuntimeContextProjection/请求或跨进程文件，未执行目标/作者实验/HTTP/模型。
- 下一步：只读固定Git/准备原件和研究装配；未安装、执行目标/作者实验/HTTP、真实注入或模型。后续核profile回落、代码围栏、自动保存/外改、备份/注册故障、准入/预览/真实请求和卸载，再评净工时/token，见[Q06](#research-q06)。

**分析版本**

- **仓库**：[1497105876/dsh-text-inject](https://github.com/1497105876/dsh-text-inject)
- **版本号**：2.1.1001（[固定提交 ce9e443](https://github.com/1497105876/dsh-text-inject/tree/ce9e4439da23b03060166def143dc0200ca6b369)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

已有预览不能重提；先修旧字段/分块、权限与冲突/恢复，再验证文件版本→注册快照→授权请求块清单是否胜过简单警告、现有preview和原生指令/编辑器。未实现/验证，见[Q05](#research-q05)。

只读固定Git/准备原件和研究装配；未安装、执行目标/作者实验/HTTP、真实注入或模型。后续核profile回落、代码围栏、自动保存/外改、备份/注册故障、准入/预览/真实请求和卸载，再评净工时/token，见[Q06](#research-q06)。

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

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/1497105876/dsh-text-inject/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核独立Markdown从编辑/存储到实际段/预览/请求的版本与适用范围，检查旧语义、管理访问及恢复退出，决定是否值得替代原生文件管理。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立文件注入解决什么，作用范围和原生能力怎样分清？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根组件是DSH插件@gw/dsh-text-inject2.1.1001、MIT，tracked ESM Host/parser和Web客户端，不是模型、Skill或独立Agent。Node声明>=18，DSH engine/peer为>=0.2.1-rc.2 <0.3.0；Host强依赖systemPrompt和webServer，客户端用slots/locale注册设置分区。schema运行时尝试从环境解析schemastery，失败会不做schema校验继续，不能拿宽声明或日志当所有宿主组合已验。

它适合明确希望常驻、经常修改规则/背景且能核适用范围的用户，验收单位是正确文件版本在正确作用域进入真正模型请求，并能禁用/恢复，而不是卡片保存ok。独立Markdown与Web卡片/历史/预览减少长文本混进宿主配置的负担；对单项目内容，原生项目说明/指令文件、编辑器与Git可能更简单。模型质量、去重/投影与工具循环由宿主/模型承担，不计为本插件原创。

当前[system]直接注册静态section，[context]直接注册静态context；它没有按项目/关键词做自己的门控。根profile装载通常提供给该组合的装配调用，具体Cordis作用域和某次llm调用是否经过该装配应另核，不能称所有模型请求自动覆盖。system排序最小0、context默认125是排序语义，不是权限/安全边界；关闭不等擦除已经发过的文本、会话历史、备份或供应商数据。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-34](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/package.json#L1-L34)

根身份、入口、Node/DSH声明。

<details>
<summary>查看原文（34行）</summary>

```text
{
  "name": "@gw/dsh-text-inject",
  "version": "2.1.1001",
  "description": "在 dsh 官方设置页左侧栏添加「文字注入」：把文字注入系统提示词或会话上下文，内容存于独立文件，支持热加载与历史备份。Text injection into the system prompt or session context from a DSH Settings page, persisted in a standalone file with hot-reload and history.",
  "license": "MIT",
  "author": "gw",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1497105876/dsh-text-inject.git"
  },
  "homepage": "https://github.com/1497105876/dsh-text-inject#readme",
  "bugs": {
    "url": "https://github.com/1497105876/dsh-text-inject/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "inject.md",
    "README.md"
  ],
  "engines": {
    "node": ">=18",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.1-rc.2 <0.3.0"
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-12](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/cordis.patch.yml#L1-L12)

真实根profile插入。

<details>
<summary>查看原文（12行）</summary>

```text
# @gw/dsh-text-inject profile patch layer — insert one loader entry.
#
# The browser half is picked up by dsh-client-modules through the package's
# dsh.client declaration, exactly like the shipped ui-* packages.
#
# 安装：包放进 profiles/<profile>/node_modules/@gw/dsh-text-inject/ 后，
# 在对应 profile 的 cordis.patch.yml 追加同样的 insert 块（或在包被 dsh
# 识别后由 dsh.bundle.patch 自动接入）。
# 卸载：删掉该 insert 块 + 删除 node_modules/@gw/dsh-text-inject/。
- insert:
    - id: gw-text-inject
      name: '@gw/dsh-text-inject'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:49-73](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L49-L73)

强依赖及MIN_ORDER=0。

<details>
<summary>查看原文（25行）</summary>

```text
export const name = "@gw/dsh-text-inject";

/** 硬依赖（cordis 红线：访问 ctx.xxx 必须先 inject，否则 apply 期直接抛错）。 */
export const inject = ["systemPrompt", "webServer"];

// ────────────────────────────────────────────────────────────────
//  位置开放度开关
// ────────────────────────────────────────────────────────────────
/**
 * 系统提示词侧允许的最小 order。
 *
 * `0` 是官方 `deployment:persona`（人格段）的位置，它之前是三条固定段：
 *   -1000 harness:identity   固定开场白
 *    -900 harness:source     来源信息
 *    -800 web:surface        界面标识
 *
 * 按产品取舍，界面只允许把块放在 0 及之后，所以这里锁成 0。
 * **想放开到固定段之前（比如插进开场白和来源信息之间），把这个数改成 -1000 即可**，
 * 界面的位置下拉会自动长出对应的可选项，不必改别的代码。
 *
 * 上下文侧不受此限制（那边是 110 / 115 / 120 三档，默认插在 125）。
 */
export const MIN_ORDER = 0;

// ────────────────────────────────────────────────────────────────
```

</details>

**依据 4 · 源码核查**：[lib/index.js:163-175](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L163-L175)

schema可缺失继续。

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

**依据 5 · 源码核查**：[lib/index.js:444-470](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L444-L470)

真正section/context静态注册。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 6 · 源码核查**：[lib/client.js:1341-1380](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/client.js#L1341-L1380)

客户端设置插槽与服务。

<details>
<summary>查看原文（40行）</summary>

```text
    // ───────────────────────── 插件体 ─────────────────────────
    var inject = ["slots", "locale"];

    function apply(ctx) {
      if (!React) { try { console.warn("[gw-text-inject] react 不可用，跳过设置页"); } catch (e) {} return; }
      if (!ctx || !ctx.slots || typeof ctx.slots.inject !== "function") {
        try { console.warn("[gw-text-inject] ctx.slots 不可用，跳过设置页"); } catch (e) {}
        return;
      }
      try { console.log("[gw-text-inject] v3 已加载"); } catch (e) {}

      // 词典：拿不到 locale 也能工作（t() 自己兜底走中文）
      try {
        if (ctx.locale && typeof ctx.locale.register === "function") ctx.locale.register(NS, { zh: UI_zh, en: UI_en });
      } catch (e) {
        try { console.warn("[gw-text-inject] 词典注册失败", e); } catch (e2) {}
      }

      try {
        ctx.slots.inject("settings.section", function () {
          return ctx.slots.register({
            name: "settings.section",
            id: "gw-text-inject",
            order: 60,
            label: function () { return t("nav"); },
            locale: NS,
            inject: function () { return { t: t }; },
          }, function () { return React.createElement(View, null); });
        });
        try { console.log("[gw-text-inject] 设置页「文字注入」已注册"); } catch (e) {}
      } catch (e) {
        try { console.error("[gw-text-inject] 设置页注册失败", e); } catch (e2) {}
      }
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  },
});
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编辑、保存、热加载、备份和真正注册如何串联？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

parseBlocks按标准二级块头解析类型、标题和元数据，给默认排序/启用与稳定id；serializeBlocks重建规范文件。UI saveAll把草稿合并、规范数字，POST blocks；收起或切换已有卡片在dirty时也会saveAll(true)，不是只有点击总保存才落盘。后端/save会基础校验类型、非空/同类重复标题及数字order，再序列化、备份、直接writeFileSync、reload。这个GUI路径有校验，不能泛称所有重复标题都无拦截。

loadState读文件/parse；registerAll先释放所有旧system/context disposer，再逐块跳过禁用/空正文并按标题注册，单块错误留registerErrors。释放兼容函数、dispose和close形态；目录watch用150ms去抖，目录失败才退文件watch，兼容编辑器原子替换是实际设计。整组替换仍不是事务：撤旧后任何注册失败可部分生效，读失败readRaw回空串也可使这次装配为空；没有先成功新组再交换旧组的保证。

备份对当前非空文本生成不撞名文件，保留被pin历史并按mtime裁剪；失败/空文本返回null，保存照写新文件。restore先读历史、备份当前，再直接写回并reload，没有与/save相同的blocks预校验；外部编辑/历史恢复也不经该校验。因此需要分别验GUI、外部改写和恢复，而不是用一次保存ok推全部正确。

保存没有expected version/hash或文件比较交换，GUI旧草稿可以覆盖外部编辑后的新文件；备份若成功可提供回退，但非冲突拒绝。直接写文件及先撤旧后注册不构成原子热切换，保存返回ok仍需看errors/真实输入；失败回退不会自动恢复上一个全部有效注册。

#### 证据与依据

**依据 1 · 源码核查**：[lib/parser.js:62-132](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/parser.js#L62-L132)

实际解析及默认/唯一id。

<details>
<summary>查看原文（71行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/parser.js:144-176](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/parser.js#L144-L176)

实际规范序列化。

<details>
<summary>查看原文（33行）</summary>

```text
export function serializeBlocks(blocks) {
  const head = [
    "# @gw/dsh-text-inject — 文字注入配置",
    "#",
    "# 块头写法：## [system] 标题   或   ## [context] 标题",
    "# 可选元数据行（写在块头下方，正文之前）：",
    "#   描述: 一句话说明（只有你看，不进提示词）",
    "#   排序: 数字，决定拼在提示词里的位置；系统侧默认 40，上下文侧默认 125",
    "#   启用: false 可临时停用这个块",
    "#",
    "# 这个文件由设置页「文字注入」维护，也可以直接手改（保存即热加载）。",
    "",
  ].join("\n");

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
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:768-809](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/client.js#L768-L809)

UI真实save与错误/清草稿。

<details>
<summary>查看原文（42行）</summary>

```text
      function saveAll(silent) {
        var st = stRef.current;
        var blocks = mergedAll();
        if (!blocks.length && !st.blocks.length) return Promise.resolve(null);
        // 标题是段名的来源，空的会让 host 拒收整份；本地先拦，别白跑一趟
        for (var v = 0; v < blocks.length; v++) {
          if (!String(blocks[v].title || "").trim()) {
            setSaveState("");
            setSt(function (p) { return Object.assign({}, p, { error: t("titleEmptyBlock") }); });
            return Promise.resolve(null);
          }
        }
        setBusy(true);
        setSaveState("saving");
        for (var i = 0; i < blocks.length; i++) {
          var n = Number(blocks[i].order);
          blocks[i] = Object.assign({}, blocks[i], {
            order: blocks[i].order === null || blocks[i].order === undefined || blocks[i].order === "" || !Number.isFinite(n) ? null : n,
          });
        }
        return post(API + "/save", { blocks: blocks }).then(function (d) {
          setBusy(false);
          if (!d || d.error) {
            setSaveState("");
            setSt(function (p) {
              return Object.assign({}, p, { error: (d && d.error) || "save failed", errors: (d && d.errors) || [] });
            });
            return d;
          }
          clearDrafts();
          setSt(function (p) {
            return Object.assign({}, p, {
              error: "", errors: d.errors || [], blocks: d.blocks || p.blocks,
              history: d.history || p.history, file: d.file || p.file,
            });
          });
          if (silent !== true) setSaveState("saved");
          setTimeout(function () { setSaveState(""); }, 1800);
          refreshPreview();
          return d;
        }).catch(function () {
          setBusy(false);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:829-839](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/client.js#L829-L839)

切换/收起卡片会自动保存。

<details>
<summary>查看原文（11行）</summary>

```text
      function toggleOpen(i) {
        setMenuOpen(false);
        if (openIdx === i) {
          setOpenIdx(-1);
          if (dirtyCount) saveAll(true);       // 收起时落盘
          return;
        }
        if (openIdx >= 0 && dirtyCount) saveAll(true);   // 换块前先把上一个落盘
        setOpenIdx(i);
      }

```

</details>

**依据 5 · 源码核查**：[lib/index.js:582-604](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L582-L604)

后端基础校验，含同类重复标题。

<details>
<summary>查看原文（23行）</summary>

```text
  function validateBlocks(blocks) {
    const errs = [];
    if (!Array.isArray(blocks)) return ["数据格式不对：blocks 必须是数组"];
    const seen = new Set();
    blocks.forEach((b, i) => {
      const at = `第 ${i + 1} 个块`;
      if (!b || typeof b !== "object") return errs.push(`${at}：不是对象`);
      if (b.type !== "system" && b.type !== "context") return errs.push(`${at}：类型必须是 system 或 context`);
      const title = String(b.title || "").trim();
      if (!title) errs.push(`${at}：标题不能为空`);
      const key = `${b.type}:${title}`;
      if (title) {
        if (seen.has(key)) errs.push(`「${title}」在同类下重复了，段名会撞车导致注册失败`);
        seen.add(key);
      }
      if (b.order !== undefined && b.order !== null && b.order !== "" && !Number.isFinite(Number(b.order))) {
        errs.push(`${at}：排序必须是数字`);
      }
      if (b.enabled === undefined) b.enabled = true;
    });
    return errs;
  }

```

</details>

**依据 6 · 源码核查**：[lib/index.js:726-761](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L726-L761)

save/restore真实写盘/备份/reload，无版本条件。

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

**依据 7 · 源码核查**：[lib/index.js:383-408](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L383-L408)

备份/裁剪及失败返回null。

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

**依据 8 · 源码核查**：[lib/index.js:189-207](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L189-L207)

release/releaseAll真实兼容函数/dispose/close。

<details>
<summary>查看原文（19行）</summary>

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
}

// ────────────────────────────────────────────────────────────────
//  简单行级 diff（LCS）
```

</details>

**依据 9 · 源码核查**：[lib/index.js:300-303](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L300-L303)

实际读失败返回空串。

```text
  }

  const readRaw = () => { try { return fs.readFileSync(dataFile, "utf8"); } catch (e) { return ""; } };

```

**依据 10 · 源码核查**：[lib/index.js:421-470](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L421-L470)

实际parse→先释放、后逐块注册和errors。

<details>
<summary>查看原文（50行）</summary>

```text
  function loadState() {
    const raw = readRaw();
    state = { raw, blocks: parseBlocks(raw) };
    return state;
  }

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

**依据 11 · 源码核查**：[lib/index.js:473-514](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L473-L514)

load/register与watch去抖/回落。

<details>
<summary>查看原文（42行）</summary>

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
  } catch (e) {
    // 目录监听失败时退回单文件监听（聊胜于无）
    try { watcher = fs.watch(dataFile, onFsEvent); } catch (e2) {
      warn(`[gw-text-inject] 监听数据文件失败: ${e2?.message}`);
    }
  }

  // ── 预览：调官方装配，拿「下一轮将要发出」的真实内容 ────────
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · trigger、预览、profile、解析和HTTP权限的实际边界是什么？

**研究主题**：缺陷与关键质疑、功能与机制、工程质量与复用

#### 完整回答

README仍称context用kind去重、trigger关键词门控，但当前registerAll只传name/order/text；parser保留并吞掉旧字段，serializer又不输出kind/trigger。不能依赖它们限制敏感/长文本出现范围，宿主ContextProjection去重亦只归作者/宿主契约，本轮未读实际宿主实现。格式也不是无损Markdown编辑：块外内容会被忽略并在GUI保存时重建说明头；parser对每行trim后先看块头，不跟踪代码围栏，所以正文/代码示例中的标准块头也会分新块。保存基础验证在序列化前，不是重解析整份结果的语义校验。

“装配预览”已经实现，不能再把新增预览当方向。/preview调用systemPrompt.assemble，先全局、再在agents.list返回数组时遍历其中agent，返回全部sections/contexts文本，以mine区分自己的段；它不只返回本插件内容。UI refreshPreview发空body，看当前已注册状态，不是未保存草稿的dry-run，也不是下一次实际请求原件；动态段/调用scope及之后的请求改写仍可能不同。UI已有其他插件绕过接口的caveat，仍不能由“模型视角”文案推最终模型字节相同。

HTTP前缀handler有state/raw/diff/pin/preview/save/restore，组件内未见connection admission、登录/Origin或每agent所属者检查。能触达handler的调用者可读当前注入/历史，preview还可返回其他段/活跃agent装配文本，并改变常驻提示；同源/无CORS不等权限认证。历史name用basename约束在history内，不能因此说可随意读写全文件系统；真实宿主/反代/网络暴露未核，不宣称匿名公网攻击已复现。

默认路径按环境/argv/安装目录/桌面服务识别已有profile，失败回固定用户家目录~/.dsh/text-inject/inject.md；这个LEGACY回落不按DSH_HOME重新计算，不能用环境隔离假设保证不同profile不会共享。config.file可改目录，historyDir就是同目录/history，裁剪按其中所有.md而非仅自己前缀；必须给独占历史目录，不把共享history当安全位置。钉住免裁也意味着30不是严格总量上限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-22](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/README.md#L15-L22)

作者仍承诺trigger/kind。

```text
| 能力 | 说明 |
|---|---|
| 提示词注入 | `## [system] 名称` 块 → 追加进系统提示词，每轮对话生效 |
| 上下文注入 | `## [context] 名称` 块 → 合成一条 user 消息注入会话；`kind` 去重、`trigger` 关键词门控 |
| 增删改 | 设置页以卡片列出所有块，支持新增 / 编辑 / 删除 / 启停 |
| 独立文件 | 内容全部写在你自己的一份 `inject.md`，与官方配置隔离 |
| 热加载 | 改文件保存即生效（`fs.watch`），或在设置页点保存；都不用重启 dsh |
| 历史备份 | 每次保存自动把上一版存进 `history/`，可查看 / 一键恢复（保留最近 30 份） |
```

**依据 2 · 源码核查**：[lib/index.js:456-465](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L456-L465)

实际注册没有trigger/kind。

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

**依据 3 · 源码核查**：[lib/parser.js:20-37](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/parser.js#L20-L37)

真实块头正则与兼容元字段。

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
```

</details>

**依据 4 · 源码核查**：[lib/parser.js:80-121](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/parser.js#L80-L121)

标准块头先识别，无代码围栏状态。

<details>
<summary>查看原文（42行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/parser.js:144-176](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/parser.js#L144-L176)

序列化重建/不保留旧字段。

<details>
<summary>查看原文（33行）</summary>

```text
export function serializeBlocks(blocks) {
  const head = [
    "# @gw/dsh-text-inject — 文字注入配置",
    "#",
    "# 块头写法：## [system] 标题   或   ## [context] 标题",
    "# 可选元数据行（写在块头下方，正文之前）：",
    "#   描述: 一句话说明（只有你看，不进提示词）",
    "#   排序: 数字，决定拼在提示词里的位置；系统侧默认 40，上下文侧默认 125",
    "#   启用: false 可临时停用这个块",
    "#",
    "# 这个文件由设置页「文字注入」维护，也可以直接手改（保存即热加载）。",
    "",
  ].join("\n");

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
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:520-545](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L520-L545)

已有assemble预览返回全部段。

<details>
<summary>查看原文（26行）</summary>

```text
  async function buildPreview(scope) {
    const sp = ctx.systemPrompt;
    const context = scope ? { agent: scope, scope } : {};
    const asm = await sp.assemble(context);

    const shape = (list, kind) =>
      (list || []).map((s, idx) => ({
        name: s.name,
        text: String(s.text ?? ""),
        chars: String(s.text ?? "").length,
        mine: String(s.name).startsWith(SECTION_PREFIX),
        // assemble() 的返回值不带 order（官方在映射时就丢掉了），
        // 所以官方段只给顺序位次，我们自己的段能精确给出 order。
        index: idx,
        order: myOrderOf(s.name, kind),
        kind,
      }));

    const sys = shape(asm.sections, "system");
    const ctxSections = shape(asm.contexts, "context");
    return {
      system: { sections: sys, totalChars: sys.reduce((a, s) => a + s.chars, 0) },
      context: { sections: ctxSections, totalChars: ctxSections.reduce((a, s) => a + s.chars, 0) },
    };
  }

```

</details>

**依据 7 · 源码核查**：[lib/index.js:623-680](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L623-L680)

真实state/preview及全部活跃agent循环，无局部准入。

<details>
<summary>查看原文（58行）</summary>

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

**依据 8 · 源码核查**：[lib/client.js:98-100](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/client.js#L98-L100)

已有预览和绕接口改写caveat。

```text
      preview: "模型视角",
      previewHint: "下一轮请求实际会用到的内容。改动下一轮生效，不用重启。",
      previewCaveat: "显示的是通过应用注册接口装配的结果；若别的插件绕过标准接口直接改写请求，可能不在这里。",
```

**依据 9 · 源码核查**：[lib/client.js:731-751](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/client.js#L731-L751)

真实UI空body预览caller。

<details>
<summary>查看原文（21行）</summary>

```text
      function refreshPreview() {
        setPv(function (p) { return Object.assign({}, p, { loading: true, err: "" }); });
        if (pvTimer.current) clearTimeout(pvTimer.current);
        pvTimer.current = setTimeout(function () {
          post(API + "/preview", {}).then(function (d) {
            if (!d || d.ok === false) {
              setPv(function (p) {
                return Object.assign({}, p, {
                  loading: false, data: d || null,
                  err: (d && (d.errors || [])[0]) || t("previewError"),
                });
              });
              return;
            }
            setPv(function (p) { return Object.assign({}, p, { loading: false, err: "", data: d }); });
          }).catch(function () {
            setPv(function (p) { return Object.assign({}, p, { loading: false, err: t("previewError") }); });
          });
        }, 220);
      }

```

</details>

**依据 10 · 源码核查**：[lib/index.js:682-725](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L682-L725)

历史basename和pin/diff作用范围。

<details>
<summary>查看原文（44行）</summary>

```text
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

```

</details>

**依据 11 · 源码核查**：[lib/index.js:117-152](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L117-L152)

profile实际识别、legacy固定路径。

<details>
<summary>查看原文（36行）</summary>

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
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.resolve(HERE, "..", "inject.md");
/** 旧版全局数据目录（未识别到 profile 时的回落位置）。 */
const LEGACY_DATA_FILE = path.join(os.homedir(), ".dsh", "text-inject", "inject.md");
const ROUTE_PREFIX = "/gw-text-inject";
```

</details>

**依据 12 · 源码核查**：[lib/index.js:270-277](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L270-L277)

config.file/历史目录关系。

```text
export function apply(ctx, config = {}) {
  const dataFile = config.file ? path.resolve(String(config.file)) : defaultDataFile(ctx);
  const dataDir = path.dirname(dataFile);
  const historyDir = path.join(dataDir, "history");
  const pinnedFile = path.join(historyDir, ".pinned.json");
  const historyLimit = Number.isFinite(config.historyLimit)
    ? Math.max(1, Math.floor(config.historyLimit))
    : DEFAULT_HISTORY_LIMIT;
```

**依据 13 · 源码核查**：[lib/index.js:388-405](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L388-L405)

裁剪所有.md，pin例外。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、操作、四阶段成本和效果怎样验收？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

每轮system段与context快照是否重复、缓存/投影如何处理，归宿主与模型；不能以去重注释推零token或实际少发。历史/全文预览与diff也要资源：diffLines直接分配行数乘积的Uint32 LCS表，没有长文件专门阈值，长文本的主线程/内存和模型上下文代价都要测。页面/文件方便不代表适合大知识库。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配Node/DSH systemPrompt/webServer | 必需 | 正式段注册、装配和数据API | 服务/方法不同可注册失败，不以peer范围当兼容实测 |
| Web slots/locale与受保护访问 | 管理界面必需 | 编辑、预览/历史及全段文本 | 无局部准入，当前宿主/反代需单独验 |
| 正确profile/独占数据与history目录 | 必需核实 | 控制谁的文件被读写/裁剪 | 识别失败回固定家目录，不依赖DSH_HOME假设隔离 |
| 可信短文本及明确常驻意图 | 内容前提 | 静态system/context段 | trigger/kind不提供项目/关键词门禁，避免误用敏感背景 |
| schemastery可解析 | 配置校验条件 | 提前校验file/historyLimit | 缺失会继续无schema，仍需人工核配置 |
| 官方投影/真实请求证据 | 效果验收前提 | 验去重、禁用和实际输入 | 预览不代表草稿/最终请求，关闭不清已有历史/远端数据 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 确认路径/权限 | 操作者核/state路径、profile与独占history及管理访问 | 不是预期目录就先停止编辑/注入 |
| 小文本接入 | 明确静态作用范围，去旧trigger假设，不在正文写可误分块标头 | 解析/注册段数、order和真实内容一致 |
| 保存/预览 | 知道切/收卡片会自动写；核backup/errors及已有预览 | ok非全部生效，预览非最终请求；再查授权单次真实输入 |
| 恢复/冲突矩阵 | 外改、旧草稿、写失败、重复/围栏、restore和watch | 文件/备份/实际注册可对应，不覆盖未决改动 |
| 禁用/退出 | 关块并核下一轮，卸载释放route/watch/disposer，保管/清理备份 | 不期望自动抹历史/上游数据；无完整生效则回原生文件管理 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次接入 | 宿主/本地目录、模型测试与备份资源 | 选profile/范围、整理块、权限/实际装配检查 | 未有真实安装/金额/工时及宿主兼容 |
| 持续使用 | 常驻输入/投影/cache、全文预览、history与LCS diff | 维护规则/作用域、查旧字段/部分注册 | 不知实际tokens/缓存/每轮频率；长期pin可超30份 |
| 失败恢复 | 文件覆盖/部分注册、备份不足/误裁剪资源 | 手工对账版本、恢复/核真实输入与watch | 备份失败不阻保存，无原子切换/CAS，代价未测 |
| 停用/迁移 | 独立文件/历史/已发文本和备份/清理资源 | 核disposer/watch/API退出，转原生指令/编辑器Git | 有退出代码，未验真实注销/历史清除；供应商/会话记录另管 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 内容管理 | 文件/卡片、序列化、基础校验和历史 | 净节时/误编辑率、无损格式/并发安全 |
| 注入/热加载 | section/context、watch、错误与统一disposer | 当前宿主实际请求、投影去重和原子替换 |
| 预览/恢复 | global/agent assemble、diff/pin/restore | 草稿等于生效、最终请求相同、每次有备份 |
| 收益/成本 | 常驻规则可由用户维护 | 任务质量/输入成本/权限/恢复净收益 |

本轮只读固定源码/准备原件，不执行目标、作者实验、注入、预览或HTTP写；189会话等数字仅作者叙述，未知费用/工时不填0。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:27-34](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/package.json#L27-L34)

宿主/Node要求。

```text
  ],
  "engines": {
    "node": ">=18",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.1-rc.2 <0.3.0"
  },
```

**依据 2 · 源码核查**：[lib/index.js:163-175](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L163-L175)

schema缺失处理。

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

**依据 3 · 源码核查**：[lib/index.js:215-233](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L215-L233)

LCS按行数乘积分配/计算。

<details>
<summary>查看原文（19行）</summary>

```text
function diffLines(before, after) {
  const a = String(before || "").split(/\r?\n/);
  const b = String(after || "").split(/\r?\n/);

  // LCS 长度表。数据文件通常几百行，O(n*m) 完全够用。
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const lines = [];
  let added = 0;
  let removed = 0;
  let i = 0;
  let j = 0;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:726-761](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L726-L761)

保存/恢复实际文件责任。

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

**依据 5 · 源码核查**：[lib/index.js:783-806](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L783-L806)

实际effect退出释放，不删数据/历史。

<details>
<summary>查看原文（24行）</summary>

```text
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
  return dispose;
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有预览之外，什么增量仍值得验证？

**研究主题**：新假设与验证、工程质量与复用、贡献与相对优势

#### 完整回答

已有全局/活跃agent装配预览、mine标记、注册errors、排序anchors、历史raw/diff/pin/restore，不能把“新增有效预览”作为当前缺口，也不能将官方投影当本插件创新。应先修当前语义：README/旧字段提示、围栏/块体再分块、版本冲突、备份确认/注册切换，以及管理访问范围。这些主要是正确性工作，不等于独立生产插件机会。

待证方向是将“文件/草稿版本→实际注册快照→一次授权模型请求用到的块”关联，明确忽略的元字段和适用范围，给出最小版本/块清单而非收集所有agent全文。它不同于现有/preview的当前装配：要能发现草稿尚未应用、部分注册、越过关键词假设和请求之后被改写等差异。需要宿主提供真实请求的可授权观察能力，目前未实现/验证；不能从预览推已拥有这条证据链。

最强替代是修说明、加旧字段/分块警告和冲突拒绝，结合现有preview、原生项目指令、编辑器与Git，不一定要增加一个追踪平台。最小实验让愿意维护规则的用户处理旧trigger、围栏样例、重复名、外改和两个profile的短文件，比较误注入发现率、恢复/操作工时和多余输入；若简单警告/手工核对已同样好，或增加收集/确认却不减错误，就否定方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:520-545](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L520-L545)

已有完整当前装配预览。

<details>
<summary>查看原文（26行）</summary>

```text
  async function buildPreview(scope) {
    const sp = ctx.systemPrompt;
    const context = scope ? { agent: scope, scope } : {};
    const asm = await sp.assemble(context);

    const shape = (list, kind) =>
      (list || []).map((s, idx) => ({
        name: s.name,
        text: String(s.text ?? ""),
        chars: String(s.text ?? "").length,
        mine: String(s.name).startsWith(SECTION_PREFIX),
        // assemble() 的返回值不带 order（官方在映射时就丢掉了），
        // 所以官方段只给顺序位次，我们自己的段能精确给出 order。
        index: idx,
        order: myOrderOf(s.name, kind),
        kind,
      }));

    const sys = shape(asm.sections, "system");
    const ctxSections = shape(asm.contexts, "context");
    return {
      system: { sections: sys, totalChars: sys.reduce((a, s) => a + s.chars, 0) },
      context: { sections: ctxSections, totalChars: ctxSections.reduce((a, s) => a + s.chars, 0) },
    };
  }

```

</details>

**依据 2 · 源码核查**：[lib/index.js:645-680](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L645-L680)

已有global/agent装配尝试及errors。

<details>
<summary>查看原文（36行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/index.js:726-740](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L726-L740)

保存状态不等原子注册/实际请求。

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

**依据 4 · 源码核查**：[lib/parser.js:80-121](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/parser.js#L80-L121)

语义警告/分块对照的真实基础。

<details>
<summary>查看原文（42行）</summary>

```text
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在如何采用，什么时候停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议观察，先核管理访问、实际profile与语义边界，再考虑非敏感短文本的小样。适合明确要常驻规则、频繁编辑且能核真实请求的人；不是给含敏感资料的条件触发/按项目知识库提供隔离保证。先在独占目录缩到一个块，确认正常、改动、禁用和恢复后实际注册/请求，而不是直接导入大量旧trigger文件。

最低验收要覆盖真实路径回落、切卡自动保存、外部编辑冲突、围栏内块头、GUI与restore差异、备份失败/部分注册、global/agent预览的访问和下一轮输入，以及卸载释放/备份保留。任何跨profile共享非预期文件、无权访问、范围/装配错误或备份不可信，应停新注入、核受影响版本/已发送内容，恢复原文件并回原生项目指令或编辑器流程；不靠再保存掩盖未决。

采用判断依据实际文件/预览/注册机制和反证，不因源码可核自动建议安装，也不把作者会话实测或未来请求关联算当前效果。当前没有真实任务质量、净节省、兼容或完整退出实验，因此不升为持续安装承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:140-152](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L140-L152)

实际路径及legacy回落。

<details>
<summary>查看原文（13行）</summary>

```text
export function defaultDataFile(ctx) {
  const profile = detectProfileName({ ctx });
  const home = String(process.env.DSH_HOME || "").trim() || path.join(os.homedir(), ".dsh");
  return profile
    ? path.join(home, "profiles", profile, "text-inject", "inject.md")
    : LEGACY_DATA_FILE;
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.resolve(HERE, "..", "inject.md");
/** 旧版全局数据目录（未识别到 profile 时的回落位置）。 */
const LEGACY_DATA_FILE = path.join(os.homedir(), ".dsh", "text-inject", "inject.md");
const ROUTE_PREFIX = "/gw-text-inject";
```

</details>

**依据 2 · 源码核查**：[lib/client.js:829-839](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/client.js#L829-L839)

自动保存触发。

<details>
<summary>查看原文（11行）</summary>

```text
      function toggleOpen(i) {
        setMenuOpen(false);
        if (openIdx === i) {
          setOpenIdx(-1);
          if (dirtyCount) saveAll(true);       // 收起时落盘
          return;
        }
        if (openIdx >= 0 && dirtyCount) saveAll(true);   // 换块前先把上一个落盘
        setOpenIdx(i);
      }

```

</details>

**依据 3 · 源码核查**：[lib/index.js:428-465](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L428-L465)

注册/禁用/部分错误边界。

<details>
<summary>查看原文（38行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:783-806](https://github.com/1497105876/dsh-text-inject/blob/ce9e4439da23b03060166def143dc0200ca6b369/lib/index.js#L783-L806)

退出callee。

<details>
<summary>查看原文（24行）</summary>

```text
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
  return dispose;
}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
