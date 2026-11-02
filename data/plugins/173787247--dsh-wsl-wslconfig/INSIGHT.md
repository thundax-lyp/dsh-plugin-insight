# dsh-wsl-wslconfig

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0008831](https://github.com/173787247/dsh-wsl-wslconfig/tree/00088318a3ab57e204fc213086e54c0c33d30019)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-wslconfig)
<!-- END META -->

> **功能**：只读寻找并解释.wslconfig前段键值，给网络和资源提示；猜测路径、截断和读取失败不能证明实际生效。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 配置定位/解释与常见建议接单工具，pure可注入便于核查，不提供生效/性能机制。

> **主要限制**：[Q03](#research-q03) 首存在候选非权威profile，截后键缺失/读取错仍ok和空mode建议；原文外发与整读成本不可被2000限额掩盖。

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
  - [Q01 · 配置线索服务什么任务，是否实际修配置？](#detail-section-11)
  - [Q02 · 候选路径、截断和INI-ish解析怎样执行？](#detail-section-12)
  - [Q03 · 当前profile、空值和建议是否可能错归属？](#detail-section-13)
  - [Q04 · 如何试用与验证来源/加载/连通分层？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户排Windows/WSL网络资源配置，先核真实profile及声明/加载/连通层。

手工找profile/Notepad读键并独立验网络；工具聚提示不编辑/重启。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 候选定位 | 找Windows配置线索 | 第一个exists非权威用户 |
| 解析/原文 | 展部分键与excerpt | 全读后截、错误吞/无覆盖标志 |
| 网络资源提示 | 用户手工后续处理 | 不证加载/连通，不自动shutdown |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18/WSL | 必需 | 工具注册/门控 | 兼容未验 |
| 可读Windows挂载/Host用户env | 读取需要 | 候选配置定位 | 猜测非权威profile |
| 原文可分享性核验 | 采用前提 | 防注释/路径外发 | 不预读不直接调用 |
| 配置备份/维护窗口 | 后续编辑前提 | 外部shutdown恢复 | 工具不写/不重启 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核来源 | 本地确认profile与原文 | 非Public误判目标 |
| 读提示 | 查path/exists/完整性/空键 | ok不当生效 |
| 编辑另办 | 备份安排WSL维护 | 不自动shutdown |
| 复核/退出 | 独立查加载/连通，异常回原件 | 停工具回Notepad/原生诊断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 挂载/宿主 | profile/原文隐私核验 | 费用工时未知 |
| 持续 | 同步全文读/前段token | 截断/解析复核 | 2000限输出非IO限 |
| 失败恢复 | 无插件写，外部编辑/重启资源 | 保原件、查目标/读取原因 | shutdown影响其他WSL任务，恢复量未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置定位 | 多候选存在 | 当前Windows真实profile |
| 键值展示 | 前2000 INI-ish | 后段/内联注释/section完整性 |
| 模式建议 | 字符串分支 | 活动配置/目标连通/净收益 |

> **思考**：[Q03](#research-q03) 首存在候选非权威profile，截后键缺失/读取错仍ok和空mode建议；原文外发与整读成本不可被2000限额掩盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 配置定位/解释与常见建议接单工具，pure可注入便于核查，不提供生效/性能机制。

[Q02](#research-q02) pure解析/deps注入可借鉴；[Q03](#research-q03) 来源/观测错误/覆盖不该压成成功，声明与运行状态应分层。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 首存在候选非权威profile，截后键缺失/读取错仍ok和空mode建议；原文外发与整读成本不可被2000限额掩盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先本地核真实path与原文安全后窄线索试用；空字段/冲突先查读取覆盖，不按ok改网络，后续编辑/shutdown另授权安排备份维护。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整重核固定43行入口/145行core/通用WSL检测、正式findings；未访问真实Windows文件/命令/网络或目标测试。

- 已检查：作者 README、包清单、源码路径 index.js、lib/wslconfig.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口/完整wslconfig、WSL检测/README/package；不读取真实配置、不执行Windows操作或当前规则兼容验收。
- 下一步：[Q04](#research-q04) 多profile/Public/不可读/内联注释/后段键与运行不符矩阵，测误诊/外发/人工，尚未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-wslconfig](https://github.com/173787247/dsh-wsl-wslconfig)
- **版本号**：0.2.0（[固定提交 0008831](https://github.com/173787247/dsh-wsl-wslconfig/tree/00088318a3ab57e204fc213086e54c0c33d30019)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 待验证来源确认/读取覆盖与声明-加载-连通收据及最小键输出，测误诊/原文外发和总代价，不自动改/shutdown。

[Q04](#research-q04) 多profile/Public/不可读/内联注释/后段键与运行不符矩阵，测误诊/外发/人工，尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 98 | — | — | 595 |
| .js | source | 3 | 245 | 217 | 5 | — |
| .js | test | 1 | 69 | 62 | 0 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-wslconfig/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-wslconfig/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：配置文件来源、读取覆盖和运行效果如何区分，怎样避免误配置建议？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 配置线索服务什么任务，是否实际修配置？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

wslconfig_hint只读寻找Windows .wslconfig，解析部分网络/内存/处理器键并给WSL/Windows网络资源建议。对象是localhost/本地模型连接或资源排障的个人用户，基线为找用户profile文件、Notepad/手查键值。增量是把候选定位和常见提示带进模型，不写配置、不测活动网络、不重启WSL或自动修复。

合格结果应明确读的是哪个用户的真实配置、完整读取是否成功，声明的值与已加载/实际连通分开；exists与ok不是“当前网络模式正确”。相关host_reach/relay/网络工具仅文字搭配，不把套件能力继承过来。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:8-25](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L8-L25)

无参数和文本报告。

<details>
<summary>查看原文（18行）</summary>

```text
export function parameters() {
  return { type: "object", additionalProperties: false, properties: {} };
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}

export function format(v) {
  const lines = [`wslconfig_hint ok=${v.ok} path=${v.path || "?"} exists=${v.exists}`];
  if (v.settings && Object.keys(v.settings).length) {
    lines.push(
      `settings: networkingMode=${v.settings.networkingMode || "?"} memory=${v.settings.memory || "?"} processors=${v.settings.processors || "?"}`,
    );
  }
  if (v.excerpt) lines.push("---\n" + v.excerpt + "\n---");
  for (const a of v.advice || []) lines.push(`- ${a}`);
  return lines.join("\n");
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:64-86](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L64-L86)

只读声明及静态网络建议。

<details>
<summary>查看原文（23行）</summary>

```text
export function buildWslconfigAdvice(settings = {}, { exists = false, hostRamHintGiB = null } = {}) {
  const tips = [
    "This tool is read-only — edit .wslconfig in Windows Notepad (user profile), then `wsl --shutdown`.",
  ];
  if (!exists) {
    tips.push(
      "No .wslconfig found yet. Creating one with networkingMode=mirrored often fixes Windows-browser ↔ WSL localhost and local LLM reachability.",
    );
  }

  const mode = settings.networkingMode;
  if (mode === "mirrored") {
    tips.push(
      "networkingMode=mirrored: Windows 127.0.0.1 usually reaches WSL listeners. For dsh UI use kit scripts/restart-dsh-web.sh → http://127.0.0.1:3081/ (dsh itself still binds 127.0.0.1:3080 only).",
    );
    tips.push("Local Ollama on Windows may work via 127.0.0.1 from WSL; still run host_reach to confirm baseURL.");
  } else if (mode === "nat" || !mode) {
    tips.push(
      "Classic NAT (or unset networkingMode): Windows browser often cannot hit WSL 127.0.0.1. Prefer mirrored, or use the :3081 relay / wsl_expose portproxy — never dsh --host 0.0.0.0.",
    );
    tips.push("Windows-hosted Ollama may need OLLAMA_HOST=0.0.0.0:11434 when WSL is NAT.");
  } else {
    tips.push(`networkingMode=${mode}: verify localhost behavior with host_reach and the :3081 relay.`);
```

</details>

**依据 3 · 源码核查**：[lib/wslconfig.js:126-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L126-L145)

实际只读执行。

<details>
<summary>查看原文（20行）</summary>

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const readFile = deps.readFile || readFileSync;
  const home = deps.home || homedir();
  const { path } = resolveWslconfigPath({ env, exists, home });
  const fileExists = Boolean(path && exists(path));
  let excerpt = "";
  let settings = parseWslconfig("");
  if (fileExists) {
    try {
      excerpt = readFile(path, "utf8").slice(0, 2000);
      settings = parseWslconfig(excerpt);
    } catch {
      /* ignore */
    }
  }
  const advice = buildWslconfigAdvice(settings, { exists: fileExists });
  return { ok: true, path, exists: fileExists, excerpt, settings, advice };
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选路径、截断和INI-ish解析怎样执行？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

入口WSL门控，依Host env/home猜Windows用户名：WINDOWS_USER、PATH中的/mnt/c/Users或home，再USERPROFILE抽Users，最后Public候选，取第一个exists；不调用权威Windows用户profile解析，参数也不能显式指定path。

存在则readFileSync完整UTF8读后截2000字符，解析也只用该excerpt。INI-ish按行分section/key=value、raw保存小写section.key，选定字段只接受wsl2或无section；不做完整INI语义/注释/值验证，也不验证Windows加载。失败catch忽略，仍返回exists原值、空settings/excerpt、ok:true并按空mode建议。fixed纯函数/deps可注入利于核查，但读取/错误/覆盖状态尚不显式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:104-123](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L104-L123)

猜路径及Public候选。

<details>
<summary>查看原文（20行）</summary>

```text
export function resolveWslconfigPath({
  env = process.env,
  exists = existsSync,
  home = homedir(),
} = {}) {
  const winUser =
    env.WINDOWS_USER ||
    (env.PATH || "").match(/\/mnt\/c\/Users\/([^/\\]+)/)?.[1] ||
    (home.match(/^\/mnt\/c\/Users\/([^/]+)/) || [])[1] ||
    "";
  const candidates = [];
  if (winUser) candidates.push(`/mnt/c/Users/${winUser}/.wslconfig`);
  // Common when HOME is Linux but Windows profile is still reachable
  if (env.USERPROFILE) {
    const m = String(env.USERPROFILE).replace(/\\/g, "/").match(/Users\/([^/]+)/i);
    if (m) candidates.push(`/mnt/c/Users/${m[1]}/.wslconfig`);
  }
  candidates.push("/mnt/c/Users/Public/.wslconfig");
  const existing = candidates.find((p) => exists(p));
  return { path: existing || candidates[0] || "", candidates };
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:28-61](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L28-L61)

实际section/value解析。

<details>
<summary>查看原文（34行）</summary>

```text
/** Parse key=value style .wslconfig (INI-ish; [wsl2] section). */
export function parseWslconfig(text) {
  const settings = {
    networkingMode: null,
    memory: null,
    processors: null,
    dnsTunneling: null,
    autoMemoryReclaim: null,
    raw: {},
  };
  let section = "";
  for (const line of String(text || "").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || t.startsWith(";")) continue;
    const sec = t.match(/^\[([^\]]+)\]$/);
    if (sec) {
      section = sec[1].toLowerCase();
      continue;
    }
    const kv = t.match(/^([^=]+)=(.*)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    const value = kv[2].trim();
    const lk = key.toLowerCase();
    settings.raw[section ? `${section}.${lk}` : lk] = value;
    if (section === "wsl2" || section === "") {
      if (lk === "networkingmode") settings.networkingMode = value.toLowerCase();
      if (lk === "memory") settings.memory = value;
      if (lk === "processors") settings.processors = value;
      if (lk === "dnstunneling") settings.dnsTunneling = value.toLowerCase();
      if (lk === "automemoryreclaim") settings.autoMemoryReclaim = value;
    }
  }
  return settings;
```

</details>

**依据 3 · 源码核查**：[lib/wslconfig.js:126-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L126-L145)

整读后截/吞错/ok。

<details>
<summary>查看原文（20行）</summary>

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const readFile = deps.readFile || readFileSync;
  const home = deps.home || homedir();
  const { path } = resolveWslconfigPath({ env, exists, home });
  const fileExists = Boolean(path && exists(path));
  let excerpt = "";
  let settings = parseWslconfig("");
  if (fileExists) {
    try {
      excerpt = readFile(path, "utf8").slice(0, 2000);
      settings = parseWslconfig(excerpt);
    } catch {
      /* ignore */
    }
  }
  const advice = buildWslconfigAdvice(settings, { exists: fileExists });
  return { ok: true, path, exists: fileExists, excerpt, settings, advice };
}
```

</details>

**依据 4 · 源码核查**：[index.js:7-30](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/index.js#L7-L30)

WSL/Host接口。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wslconfig_hint",
    order: 123,
    text: "Use wslconfig_hint before fixing Windows↔WSL networking: reads %UserProfile%\\.wslconfig (mirrored/memory) and reminds that dsh UI uses :3081 relay — never --host 0.0.0.0.",
  });

  ctx.tools.register({
    name: "wslconfig_hint",
    description: "Read-only parse of Windows .wslconfig (networkingMode/memory) plus mirrored vs NAT advice for dsh :3081.",
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
    },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 当前profile、空值和建议是否可能错归属？

**研究主题**：缺陷与关键质疑

#### 完整回答

存在的猜测/Public文件未必是真实运行用户加载的.wslconfig，多候选只取第一、不报候选冲突。后2000字符不解析且无truncated标志；前段大量注释可把有效键推出样本。逐行line.trim()会移除行首U+FEFF，因此开头BOM本身不是此解析器的失败条件，这是已有支持而非待修缺陷；内联注释没有规范处理，其他section只进raw不进指定字段，仍可能显示缺值但不是确无配置。

exists文件不可读时空mode仍ok，建议分支落nat/unset，用户可能被引导改网络而根因是读取失败。文本显示excerpt原文和raw字段会进入模型，含注释/路径等应先本地预读，不能称只回安全摘要。2000字符限输出不限制同步读内存/阻塞；配置timeout仅Host外层，core无signal。

声明mirrored/NAT仅字符串，不测已shutdown/reload、Windows版本支持或目标服务/防火墙。修改/运行wsl --shutdown会影响其他WSL任务，工具只提示未执行，用户须单独安排，不从读配置成功自动授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:104-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L104-L145)

候选/吞错/截断与结果。

<details>
<summary>查看原文（42行）</summary>

```text
export function resolveWslconfigPath({
  env = process.env,
  exists = existsSync,
  home = homedir(),
} = {}) {
  const winUser =
    env.WINDOWS_USER ||
    (env.PATH || "").match(/\/mnt\/c\/Users\/([^/\\]+)/)?.[1] ||
    (home.match(/^\/mnt\/c\/Users\/([^/]+)/) || [])[1] ||
    "";
  const candidates = [];
  if (winUser) candidates.push(`/mnt/c/Users/${winUser}/.wslconfig`);
  // Common when HOME is Linux but Windows profile is still reachable
  if (env.USERPROFILE) {
    const m = String(env.USERPROFILE).replace(/\\/g, "/").match(/Users\/([^/]+)/i);
    if (m) candidates.push(`/mnt/c/Users/${m[1]}/.wslconfig`);
  }
  candidates.push("/mnt/c/Users/Public/.wslconfig");
  const existing = candidates.find((p) => exists(p));
  return { path: existing || candidates[0] || "", candidates };
}

export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const readFile = deps.readFile || readFileSync;
  const home = deps.home || homedir();
  const { path } = resolveWslconfigPath({ env, exists, home });
  const fileExists = Boolean(path && exists(path));
  let excerpt = "";
  let settings = parseWslconfig("");
  if (fileExists) {
    try {
      excerpt = readFile(path, "utf8").slice(0, 2000);
      settings = parseWslconfig(excerpt);
    } catch {
      /* ignore */
    }
  }
  const advice = buildWslconfigAdvice(settings, { exists: fileExists });
  return { ok: true, path, exists: fileExists, excerpt, settings, advice };
}
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:16-24](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L16-L24)

原文excerpt进最终报告。

```text
export function format(v) {
  const lines = [`wslconfig_hint ok=${v.ok} path=${v.path || "?"} exists=${v.exists}`];
  if (v.settings && Object.keys(v.settings).length) {
    lines.push(
      `settings: networkingMode=${v.settings.networkingMode || "?"} memory=${v.settings.memory || "?"} processors=${v.settings.processors || "?"}`,
    );
  }
  if (v.excerpt) lines.push("---\n" + v.excerpt + "\n---");
  for (const a of v.advice || []) lines.push(`- ${a}`);
```

**依据 3 · 源码核查**：[lib/wslconfig.js:74-100](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L74-L100)

按字符串建议及外部shutdown。

<details>
<summary>查看原文（27行）</summary>

```text
  const mode = settings.networkingMode;
  if (mode === "mirrored") {
    tips.push(
      "networkingMode=mirrored: Windows 127.0.0.1 usually reaches WSL listeners. For dsh UI use kit scripts/restart-dsh-web.sh → http://127.0.0.1:3081/ (dsh itself still binds 127.0.0.1:3080 only).",
    );
    tips.push("Local Ollama on Windows may work via 127.0.0.1 from WSL; still run host_reach to confirm baseURL.");
  } else if (mode === "nat" || !mode) {
    tips.push(
      "Classic NAT (or unset networkingMode): Windows browser often cannot hit WSL 127.0.0.1. Prefer mirrored, or use the :3081 relay / wsl_expose portproxy — never dsh --host 0.0.0.0.",
    );
    tips.push("Windows-hosted Ollama may need OLLAMA_HOST=0.0.0.0:11434 when WSL is NAT.");
  } else {
    tips.push(`networkingMode=${mode}: verify localhost behavior with host_reach and the :3081 relay.`);
  }

  if (settings.memory) {
    tips.push(
      `memory=${settings.memory} is set. Leave headroom for Windows + GPU drivers; on large hosts prefer an explicit cap over letting WSL balloon unchecked.`,
    );
  } else if (hostRamHintGiB && hostRamHintGiB >= 64) {
    tips.push(
      `Host looks large (~${hostRamHintGiB} GiB hint). Consider memory=32GB or 64GB in [wsl2] so Windows UI/GPU stays responsive during heavy builds.`,
    );
  }

  tips.push("Other useful knobs: processors=, dnsTunneling=true, autoMemoryReclaim=drop/gradual.");
  tips.push("After edits: wsl --shutdown from PowerShell, reopen distro, then restart-dsh-web.sh.");
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用与验证来源/加载/连通分层？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已在本地核真实profile路径及原文可分享的个人用户可只作线索试用，空字段先检查读取/截断，而非照nat建议改文件。首次有Windows挂载/宿主和隐私预读，持续同步全文读/前段token及人工来源/完整性核对，工时/金额未知；无独立API并不等总费用0。工具无写回滚；采纳建议前备份真实配置、安排维护窗口及其他WSL任务，手工编辑/shutdown后独立核加载与连通，异常恢复原件/停工具回Notepad。

未验证方向是权威或显式用户确认的profile来源、读取error/coverage和声明→已加载→目标连通的分层收据，默认仅回必要键而非原文。已有path/exists/raw不等这些层。对照多个用户/Public、不可读、2000字符后键、section/内联注释及声明模式与实际不符，测错归属/错建议/原文外发和额外人工；若现有提示够或探测增加副作用/负担则不加，不自动shutdown或改网络。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:126-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L126-L145)

来源/读取/覆盖缺口。

<details>
<summary>查看原文（20行）</summary>

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const readFile = deps.readFile || readFileSync;
  const home = deps.home || homedir();
  const { path } = resolveWslconfigPath({ env, exists, home });
  const fileExists = Boolean(path && exists(path));
  let excerpt = "";
  let settings = parseWslconfig("");
  if (fileExists) {
    try {
      excerpt = readFile(path, "utf8").slice(0, 2000);
      settings = parseWslconfig(excerpt);
    } catch {
      /* ignore */
    }
  }
  const advice = buildWslconfigAdvice(settings, { exists: fileExists });
  return { ok: true, path, exists: fileExists, excerpt, settings, advice };
}
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:64-100](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/lib/wslconfig.js#L64-L100)

外部编辑/重启负担。

<details>
<summary>查看原文（37行）</summary>

```text
export function buildWslconfigAdvice(settings = {}, { exists = false, hostRamHintGiB = null } = {}) {
  const tips = [
    "This tool is read-only — edit .wslconfig in Windows Notepad (user profile), then `wsl --shutdown`.",
  ];
  if (!exists) {
    tips.push(
      "No .wslconfig found yet. Creating one with networkingMode=mirrored often fixes Windows-browser ↔ WSL localhost and local LLM reachability.",
    );
  }

  const mode = settings.networkingMode;
  if (mode === "mirrored") {
    tips.push(
      "networkingMode=mirrored: Windows 127.0.0.1 usually reaches WSL listeners. For dsh UI use kit scripts/restart-dsh-web.sh → http://127.0.0.1:3081/ (dsh itself still binds 127.0.0.1:3080 only).",
    );
    tips.push("Local Ollama on Windows may work via 127.0.0.1 from WSL; still run host_reach to confirm baseURL.");
  } else if (mode === "nat" || !mode) {
    tips.push(
      "Classic NAT (or unset networkingMode): Windows browser often cannot hit WSL 127.0.0.1. Prefer mirrored, or use the :3081 relay / wsl_expose portproxy — never dsh --host 0.0.0.0.",
    );
    tips.push("Windows-hosted Ollama may need OLLAMA_HOST=0.0.0.0:11434 when WSL is NAT.");
  } else {
    tips.push(`networkingMode=${mode}: verify localhost behavior with host_reach and the :3081 relay.`);
  }

  if (settings.memory) {
    tips.push(
      `memory=${settings.memory} is set. Leave headroom for Windows + GPU drivers; on large hosts prefer an explicit cap over letting WSL balloon unchecked.`,
    );
  } else if (hostRamHintGiB && hostRamHintGiB >= 64) {
    tips.push(
      `Host looks large (~${hostRamHintGiB} GiB hint). Consider memory=32GB or 64GB in [wsl2] so Windows UI/GPU stays responsive during heavy builds.`,
    );
  }

  tips.push("Other useful knobs: processors=, dnsTunneling=true, autoMemoryReclaim=drop/gradual.");
  tips.push("After edits: wsl --shutdown from PowerShell, reopen distro, then restart-dsh-web.sh.");
```

</details>

**依据 3 · 源码核查**：[package.json:1-18](https://github.com/173787247/dsh-wsl-wslconfig/blob/00088318a3ab57e204fc213086e54c0c33d30019/package.json#L1-L18)

包版本/Node。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-wsl-wslconfig",
  "version": "0.2.0",
  "description": "Parse Windows .wslconfig and advise mirrored/NAT + dsh :3081 relay.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-wslconfig.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-wslconfig/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-wslconfig#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

</details>

#### 缺口

- 未读取真实Windows配置/加载态、连通和改进版本对照
  **影响**：不能保证目标profile/生效或净排障收益
  **进一步探讨**：先本地核来源原文，假文件矩阵测试错误/覆盖，再单独授权实际加载/连通验证，记全成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
