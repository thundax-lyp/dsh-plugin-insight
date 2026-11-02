# dsh-wsl-picker

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e111a43](https://github.com/173787247/dsh-wsl-picker/tree/e111a43ca2b48d6343e96ad5bb39b64a473e4d96)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-picker)
<!-- END META -->

> **功能**：向Agent列出WSL目录并提供根、Windows盘符和IM快捷入口，支持过滤截断，不登记工作区。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将根/盘符/IM快捷入口、过滤与截断结构交给Agent，减少人工拼目录结果；不混入工作区登记或Windows对话框。

> **主要限制**：[Q03](#research-q03) 无允许根/realpath隔离可列进程可读目录并跟软链接，名称外发有隐私；先全量同步读排序，15秒timeout与200返回项不保证限时/限工作量。

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
  - [Q01 · 目录枚举相对手工贴路径增加什么？](#detail-section-11)
  - [Q02 · start/path、过滤与截断怎样接线？](#detail-section-12)
  - [Q03 · 允许根、软链接、隐私和超时能保证什么？](#detail-section-13)
  - [Q04 · 采用要先核什么，怎样验证改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL用户定位/筛选目录再选择工作区，非图形文件选择和登记服务，路径元数据进入模型需授权。

本地ls并手工贴路径/用户选择；插件提供结构化导航线索，不改变目录访问权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| start/path导航 | Agent定位目录 | 默认/与显式空start→IM不同 |
| filter/隐藏项 | 缩结果范围 | 非权限根/敏感性规则 |
| 截断列表 | 控模型返回项 | 先全读排序，无分页/取消 |
| IM快捷根 | 找IM目录线索 | 不存在ok+hint，文本不展示hint，不登记 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18 | 必需 | 工具与结果进模型 | 兼容/授权先核 |
| WSL检测 | 必需 | 环境门控 | 非WSL返回失败 |
| 可读目录/挂载 | 必需 | 同步枚举 | 拒绝/慢盘可能阻塞 |
| 明确非敏感浏览范围 | 采用前提 | 防目录元数据外发 | 代码无根约束，先核宿主 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核范围 | 确认工具授权与非敏感目录 | 不默认开共享/全盘 |
| 定位 | 显式start/path及filter | 核parent/entries/truncated |
| 复核 | IM空看JSON hint，类型/路径回本地查 | 不当已登记工作区 |
| 停止 | 敏感/不全/慢盘停工具 | 回本地ls/手工选择 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/WSL | 安装/新会话与权限核验 | 工时未知 |
| 持续 | 同步读排序/stat/结果token | 筛选/截断复核 | 大目录/网络盘延迟未知 |
| 失败恢复 | 无文件写，已输出名无法撤回 | 权限/挂载/隐私处置 | 无分页/取消运行验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 快捷浏览 | parent/chips/filter | 挂载/IM可用与实际定位收益 |
| 完整性披露 | truncated显式 | 分页补齐和目录变动一致性 |
| 只读边界 | 不写/登记工作区 | 宿主授权/元数据隔离与延迟 |

> **思考**：[Q03](#research-q03) 无允许根/realpath隔离可列进程可读目录并跟软链接，名称外发有隐私；先全量同步读排序，15秒timeout与200返回项不保证限时/限工作量。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将根/盘符/IM快捷入口、过滤与截断结构交给Agent，减少人工拼目录结果；不混入工作区登记或Windows对话框。

[Q02](#research-q02) 优先级/结构错误/truncated清楚；[Q03](#research-q03) 同步全读/无根是关键约束，hint及other应在最终文本保真，不能用timeout声明代替取消接线。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 无允许根/realpath隔离可列进程可读目录并跟软链接，名称外发有隐私；先全量同步读排序，15秒timeout与200返回项不保证限时/限工作量。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察并核授权/浏览根，再考虑非敏感副本试；显式路径核截断，敏感或慢盘停止回本地ls，不把只读当隐私隔离。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整固定43行入口/174行picker及WSL检测、正式findings复核；未运行目录枚举/测试或读真实敏感路径，宿主授权未核。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/picker.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整入口/picker与WSL检测、README.zh/package；不读取真实目录、不核宿主授权实现或IM登记服务。
- 下一步：[Q04](#research-q04) 先核宿主根策略再非敏感夹具测symlink、权限、空IM和大/慢目录，比较误暴露、完整性和总成本。

**分析版本**

- **仓库**：[173787247/dsh-wsl-picker](https://github.com/173787247/dsh-wsl-picker)
- **版本号**：0.1.1（[固定提交 e111a43](https://github.com/173787247/dsh-wsl-picker/tree/e111a43ca2b48d6343e96ad5bb39b64a473e4d96)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 待验证允许根/敏感元数据与异步限时分页，对照已有filter/truncated和宿主策略测越界/完整性/负担，未实现不计贡献。

[Q04](#research-q04) 先核宿主根策略再非敏感夹具测symlink、权限、空IM和大/慢目录，比较误暴露、完整性和总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 127 | — | — | 741 |
| .js | source | 3 | 274 | 199 | 56 | — |
| .js | test | 1 | 27 | 23 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-picker/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：目录枚举如何帮助路径定位，允许范围/完整性与超时边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录枚举相对手工贴路径增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

实际是模型可调用的WSL目录枚举，不是Windows图形文件选择对话框，也不把用户选择登记成DSH/IM工作区。用户要从Linux根、/mnt Windows盘符或~/.dsh/im-workspace定位路径，相对ls和手工复制，它给parent、存在的快捷chips、过滤结果与truncated，帮助Agent继续问/查路径。

列表含文件及目录，最终选择/授权和工作区登记由用户或其他工具负责；read-only不是只列用户已选文件，不要把名字picker误作显式用户同意才读取。正确结果应目录归属/目标准确且知道是否完整，不是看到列表就认工作区已配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:5-17](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/README.zh.md#L5-L17)

作者浏览与不登记分工。

<details>
<summary>查看原文（13行）</summary>

````text
DeepSeek Harness 插件：从 / 与 /mnt Windows 盘符浏览 WSL 目录，便于选择工作区。

配套 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**。

[English → README.md](./README.md)

## 在套件里的位置

列出 / 和 /mnt 下的目录，方便选工作区。不负责登记 IM 工作区。

```mermaid
flowchart LR
  agent["dsh agent"] --> tool["wsl_picker"] --> fs["/ 与 /mnt 目录列表"]
````

</details>

**依据 2 · 源码核查**：[index.js:11-29](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/index.js#L11-L29)

实际模型工具注册。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:wsl_picker",
    order: 111,
    text: "Use wsl_picker to browse WSL dirs (/ and /mnt). Pass start=im (or empty start) for ~/.dsh/im-workspace quick entries; optional filter substring.",
  });

  ctx.tools.register({
    name: "wsl_picker",
    description: "Browse WSL directories (/ and /mnt). start=im or empty start lists ~/.dsh/im-workspace; optional filter.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

**依据 3 · 源码核查**：[lib/picker.js:164-173](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L164-L173)

返回数据而非登记操作。

<details>
<summary>查看原文（10行）</summary>

```text
  return {
    ok: true,
    path: abs,
    parent,
    chips,
    entries,
    truncated,
    filter: filterRaw || undefined,
    quick: quick || undefined,
  };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · start/path、过滤与截断怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

WSL入口门控；start字段存在且空或im时取IM根，非空start优先path；没有start且没有path默认/，因此提示“empty start”与完全省略字段不是同一行为。~/展开，其他相对输入直接在/下resolve，不基于会话cwd。chips只保存在的固定根及im。

execute同步exists/stat/readdir，默认隐藏dot项，filter是不区分大小写子串，排序全部names后按maxEntries默认200截断，再逐项stat分类。输出明确truncated但无offset/cursor，过滤可减少结果，不能在同一过滤自动翻页。IM快捷根不存在返回ok:true/空/hint；format没有打印hint，只看文本回执会漏掉“根未创建”原因。stat子项失败type=other，但格式化仍用[file]显示。

结构化返回与错误、start优先级、截断标志是可复用设计，实际全量读/排序发生在截断前，maxEntries不是枚举工作量上限。Node/DSH tools/prompt、WSL、可读目录及挂载是依赖，不需要Windows对话框/PowerShell才能执行本枚举。

#### 证据与依据

**依据 1 · 源码核查**：[lib/picker.js:68-107](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L68-L107)

快捷根和优先级/相对路径。

<details>
<summary>查看原文（40行）</summary>

```text
const CHIPS = ["/", "/home", "/mnt", "/mnt/c", "/mnt/d", "/mnt/e", "im"];

export function imWorkspaceRoot() {
  return join(homedir(), ".dsh", "im-workspace");
}

/** Resolve list root from start/path. Empty start or 'im' → ~/.dsh/im-workspace. */
export function resolveStart(args = {}) {
  const hasStart = typeof args.start === "string";
  const startRaw = hasStart ? args.start.trim() : null;
  const pathRaw = typeof args.path === "string" && args.path.trim() ? args.path.trim() : null;

  if (hasStart && (startRaw === "" || startRaw.toLowerCase() === "im")) {
    return { abs: imWorkspaceRoot(), quick: "im" };
  }
  if (startRaw) {
    if (startRaw.toLowerCase() === "im") return { abs: imWorkspaceRoot(), quick: "im" };
    const abs = resolveAbs(startRaw);
    return { abs, quick: null };
  }
  if (pathRaw) {
    if (pathRaw.toLowerCase() === "im") return { abs: imWorkspaceRoot(), quick: "im" };
    return { abs: resolveAbs(pathRaw), quick: null };
  }
  return { abs: "/", quick: null };
}

function resolveAbs(raw) {
  if (raw.startsWith("~/")) return `${homedir()}${raw.slice(1)}`;
  if (raw.startsWith("/")) return resolve(raw);
  return resolve(`/${raw}`);
}

function buildChips() {
  const im = imWorkspaceRoot();
  const chips = CHIPS.filter((c) => {
    if (c === "im") return existsSync(im);
    return existsSync(c) || c === "/";
  });
  return chips;
```

</details>

**依据 2 · 源码核查**：[lib/picker.js:110-151](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L110-L151)

IM不存在/错误/枚举过滤截断。

<details>
<summary>查看原文（42行）</summary>

```text
export async function execute(args, config = {}) {
  const maxEntries = Number(config.maxEntries) > 0 ? Number(config.maxEntries) : 200;
  const showHidden = args?.showHidden === true;
  const filterRaw = typeof args?.filter === "string" ? args.filter.trim() : "";
  const filterLc = filterRaw ? filterRaw.toLowerCase() : "";
  const { abs, quick } = resolveStart(args);
  const chips = buildChips();

  if (!abs.startsWith("/")) return { ok: false, path: abs, entries: [], chips, error: "absolute path required" };
  if (!existsSync(abs)) {
    if (quick === "im") {
      return {
        ok: true,
        path: abs,
        parent: resolve(abs, ".."),
        chips,
        entries: [],
        truncated: false,
        filter: filterRaw || undefined,
        hint: "im-workspace not created yet; install/start dsh-wsl-im or mkdir ~/.dsh/im-workspace",
      };
    }
    return { ok: false, path: abs, entries: [], chips, error: "path not found" };
  }
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
```

</details>

**依据 3 · 源码核查**：[lib/picker.js:153-173](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L153-L173)

逐项stat与最终返回。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
  }
  const parent = abs === "/" ? "/" : resolve(abs, "..");
  return {
    ok: true,
    path: abs,
    parent,
    chips,
    entries,
    truncated,
    filter: filterRaw || undefined,
    quick: quick || undefined,
  };
```

</details>

**依据 4 · 源码核查**：[lib/picker.js:57-65](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L57-L65)

文本丢hint/other类型差异。

```text
export function format(v) {
  const lines = [`wsl_picker path=${v.path || "?"} ok=${v.ok}`];
  if (v.chips) lines.push(`chips: ${v.chips.join(" ")}`);
  if (v.parent) lines.push(`parent: ${v.parent}`);
  if (v.filter) lines.push(`filter: ${v.filter}`);
  for (const e of v.entries || []) lines.push(`${e.type === "dir" ? "[dir]" : "[file]"} ${e.path}`);
  if (v.truncated) lines.push("(truncated)");
  if (v.error) lines.push(`error: ${v.error}`);
  return lines.join("\n");
```

**依据 5 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/index.js#L7-L29)

WSL及timeout声明。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_picker",
    order: 111,
    text: "Use wsl_picker to browse WSL dirs (/ and /mnt). Pass start=im (or empty start) for ~/.dsh/im-workspace quick entries; optional filter substring.",
  });

  ctx.tools.register({
    name: "wsl_picker",
    description: "Browse WSL directories (/ and /mnt). start=im or empty start lists ~/.dsh/im-workspace; optional filter.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 允许根、软链接、隐私和超时能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

代码无可配置允许根、realpath范围核验或会话工作区限制，任何进程有权限的绝对目录可列；stat跟随软链接，继续以链接路径浏览可到工作区之外。showHidden=false只是隐藏dot names，不是敏感目录策略，完整entries路径和名称进入模型，可能含用户/项目/私密目录元数据。未读文件内容是正面边界，但不等授权隔离。宿主工具权限/审批未核，不据此宣称已经跨用户泄漏。

工具15秒timeout无法在同步readdirSync/statSync占据事件循环时提供可验证的及时中断；大目录/慢网络挂载先全读再排序，默认200只限制返回/逐项stat数量，不限制前面读盘与排序。无signal、分页或稳定快照，目录变化可使列表过时或type other。以上源码限制不等实测卡死，真实延迟需测。敏感机器或共享Agent不应默认开放全根枚举。

#### 证据与依据

**依据 1 · 源码核查**：[lib/picker.js:95-99](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L95-L99)

任意绝对/根相对解析。

```text
function resolveAbs(raw) {
  if (raw.startsWith("~/")) return `${homedir()}${raw.slice(1)}`;
  if (raw.startsWith("/")) return resolve(raw);
  return resolve(`/${raw}`);
}
```

**依据 2 · 源码核查**：[lib/picker.js:134-161](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L134-L161)

同步调用、跟随stat和先读排序。

<details>
<summary>查看原文（28行）</summary>

```text
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
  const entries = [];
  for (const name of names) {
    const p = join(abs, name);
    let type = "file";
    try {
      type = statSync(p).isDirectory() ? "dir" : "file";
    } catch {
      type = "other";
    }
    entries.push({ name, path: p, type });
```

</details>

**依据 3 · 源码核查**：[index.js:25-29](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/index.js#L25-L29)

工具timeout未传取消到core。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 4 · 源码核查**：[lib/picker.js:147-151](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L147-L151)

隐藏/截断不是权限根。

```text
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用要先核什么，怎样验证改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议先观察：本地个人路径定位有便利，但敏感环境需先核宿主授权和目录暴露范围，再决定是否只在一次性非敏感目录试。显式给start/path并核truncated，IM空结果检查JSON hint而不当真空目录；读取路径不表示已登记工作区。首次有安装/重启新会话和权限/范围核验，持续为同步读盘/排序/逐项stat与结果token/人工筛选；失败查权限/挂载和截断，时间/模型金额未知。

无写文件不代表零风险/费用，已发模型的目录名无法靠停用撤回。停工具回本地ls/用户手工选择；路径敏感、列表不全或慢挂载阻塞即停，不用它当共享服务隔离。

未验证方向是允许根与realpath边界、敏感元数据策略、异步有deadline分页枚举，保留现有过滤/truncated但避免先全量工作。对照symlink出根、IM未创建、权限拒绝、20万条/慢挂载，测实际读取/返回范围、完整性/延迟与token和确认负担；若宿主已有等效根约束或新增分页复杂度抵收益则不加。本次不运行目标或目录探针。

#### 证据与依据

**依据 1 · 源码核查**：[lib/picker.js:118-151](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/lib/picker.js#L118-L151)

空根/错误/大目录路径与成本来源。

<details>
<summary>查看原文（34行）</summary>

```text
  if (!abs.startsWith("/")) return { ok: false, path: abs, entries: [], chips, error: "absolute path required" };
  if (!existsSync(abs)) {
    if (quick === "im") {
      return {
        ok: true,
        path: abs,
        parent: resolve(abs, ".."),
        chips,
        entries: [],
        truncated: false,
        filter: filterRaw || undefined,
        hint: "im-workspace not created yet; install/start dsh-wsl-im or mkdir ~/.dsh/im-workspace",
      };
    }
    return { ok: false, path: abs, entries: [], chips, error: "path not found" };
  }
  let st;
  try {
    st = statSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!st.isDirectory()) return { ok: false, path: abs, entries: [], chips, error: "not a directory" };
  let names = [];
  try {
    names = readdirSync(abs);
  } catch (err) {
    return { ok: false, path: abs, entries: [], chips, error: err.message };
  }
  if (!showHidden) names = names.filter((n) => !n.startsWith("."));
  if (filterLc) names = names.filter((n) => n.toLowerCase().includes(filterLc));
  names.sort((a, b) => a.localeCompare(b));
  const truncated = names.length > maxEntries;
  names = names.slice(0, maxEntries);
```

</details>

**依据 2 · 源码核查**：[package.json:1-18](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/package.json#L1-L18)

版本和Node声明。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-wsl-picker",
  "version": "0.1.1",
  "description": "Browse WSL directories from / and /mnt drives for workspace picking.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-picker.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-picker/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-picker#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

</details>

**依据 3 · 作者声明**：[README.zh.md:36-42](https://github.com/173787247/dsh-wsl-picker/blob/e111a43ca2b48d6343e96ad5bb39b64a473e4d96/README.zh.md#L36-L42)

作者安装/新会话条件。

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-picker
```

重启 `dsh web` 并开**新**会话。工具名：`wsl_picker`。
````

#### 缺口

- 未核宿主权限、敏感目录策略及大目录/慢挂载运行
  **影响**：不能常规开放或保证及时返回
  **进一步探讨**：先确认工具授权/根范围，再在非敏感夹具测目录/软链/错误/分页完整性与延迟。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
