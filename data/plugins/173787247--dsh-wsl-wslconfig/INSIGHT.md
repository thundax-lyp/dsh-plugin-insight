# dsh-wsl-wslconfig

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[486d6ff](https://github.com/173787247/dsh-wsl-wslconfig/tree/486d6ffce7530bf46320c859ad9d4df502243d0f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wslconfig)
<!-- END META -->

> **实现功能**：读取推断路径下的Windows.wslconfig前段并给网络/内存提示，不能据此确认实际生效模式。

> **核心亮点**：把找配置和常见提示接入单工具，减少手工整理。详见[Q01](#research-q01)。

> **风险与缺陷**：猜测/Public文件未必生效配置，后2000字符不参与解析，读取失败仍ok并按空模式建议。详见[Q03](#research-q03)。

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
  - [Q01 · wslconfig提示解决什么，能证明网络已按配置运行吗？](#detail-section-11)
  - [Q02 · 找到的文件一定属于当前Windows用户吗？](#detail-section-12)
  - [Q03 · 截断、解析和错误处理如何影响结论？](#detail-section-13)
  - [Q04 · 工程和分阶段成本有哪些证据？](#detail-section-14)
  - [Q05 · 采用条件和继续探讨方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows与WSL网络/资源配置初步排查。详见[Q01](#research-q01)。

手工打开.wslconfig和套件文档；当前不是网络状态探针。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 候选路径 | 找配置 | 需核真实profile |
| 简化解析 | 展示设置 | 只前2000字符 |
| 静态建议 | 排障方向 | 不测活动模式 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/tools | 运行入口 | ABI匹配 |
| WSL与环境候选 | 路径选择 | 用户/盘符可能错 |
| Windows文件权限 | 读取 | 失败当前吞掉 |
| 套件relay/工具 | 建议方向 | 不检查存在/状态 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 明确真实profile | 用户 | 候选path正确 |
| 核原文可分享 | 用户 | 无敏感备注 |
| 读报告并查完整文件 | 用户 | 非截断误读 |
| 独立核活动网络 | 用户/外部工具 | 不靠配置推连通 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Windows挂载/宿主 | 核真实profile与可分享原文 | 先核真实profile及原文可分享性；准备工时未知 |
| 持续使用 | 同步全文读取/前段token | 截断/解析复核 | 截2000字符不限制全文读取；金额与IO/人工耗时未知 |
| 失败恢复 | 无插件写配置；外部重启影响WSL任务 | 备份并安排外部编辑/shutdown | 外部编辑/shutdown需独立安排；恢复工时未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 找配置 | 多候选存在 | 非权威profile来源 |
| 展示键值 | INI-ish前2000字符 | 无截断/完整性状态 |
| 建议模式 | 固定字符串分支 | 非活动网络检测 |

> **思考**：猜测/Public文件未必生效配置，后2000字符不参与解析，读取失败仍ok并按空模式建议。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把找配置和常见提示接入单工具，减少手工整理。详见[Q01](#research-q01)。

把找配置和常见提示接入单工具，减少手工整理。详见[Q01](#research-q01)。

依赖可注入而execute反例未覆盖，优先补来源和错误/截断状态。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

猜测/Public文件未必生效配置，后2000字符不参与解析，读取失败仍ok并按空模式建议。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

确定目标路径/原文安全后只作线索试用，空字段先核错误。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读链可核；用户路径推断/无截断标记/吞读取错误限制诊断可靠性。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/wslconfig.js、test/wslconfig.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整43行入口/145行配置模块/69行测试及README/package；通用WSL检测复用已读取固定实现，不访问真实Windows文件。
- 下一步：从错候选/后段键/权限错误/未重启反例核来源与状态分层。

**分析版本**

- **仓库**：[173787247/dsh-wsl-wslconfig](https://github.com/173787247/dsh-wsl-wslconfig)
- **版本号**：0.2.0（[固定提交 486d6ff](https://github.com/173787247/dsh-wsl-wslconfig/tree/486d6ffce7530bf46320c859ad9d4df502243d0f)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究来源/读取诊断及声明-加载-连通分层，比较误诊和原文外发量，尚未验证。详见[Q05](#research-q05)。

从错候选/后段键/权限错误/未重启反例核来源与状态分层。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 98 | — | — | 595 |
| .js | source | 3 | 245 | 217 | 5 | — |
| .js | test | 1 | 69 | 62 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wslconfig/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wslconfig/issues?q=is%3Aissue+created%3A2026-09-22T07%3A20%3A50.258Z..2026-10-22T07%3A20%3A50.258Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wslconfig/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A20%3A50.258Z..2026-10-22T07%3A20%3A50.258Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows配置来源、简化解析和静态建议如何支持排障，怎样区分文件声明与真实活动网络？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · wslconfig提示解决什么，能证明网络已按配置运行吗？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向Windows浏览器/本地模型与WSL互通排障者，工具找一份Windows.wslconfig，解析网络模式、memory/processors等，给mirrored/NAT及套件3081中继建议。相比手工找文件和读INI少些整理步骤，贡献是配置线索接到模型工具，不是网络检测或修复机制。

文件内容只是计划配置，不检查WSL/Windows版本支持、重启是否应用、活动网络模式、实际localhost连通和防火墙；不写文件、不自动shutdown、不创建portproxy。工具ok表示函数返回报告，不代表网络已通。README说判断与relay是否匹配，源码只按字符串分支，采用时须把报告当线索。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:4-10](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/README.md#L4-L10)

作者定位。

```text
DeepSeek Harness tool: **`wslconfig_hint`** — read-only parse of Windows `.wslconfig` (mirrored/memory) and advise dsh **:3081** relay (never `dsh --host 0.0.0.0`).

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Reads Windows .wslconfig and says whether mirrored or NAT networking matches the :3081 relay.
```

**依据 2 · 源码核查**：[lib/wslconfig.js:62-99](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L62-L99)

固定建议。

<details>
<summary>查看原文（38行）</summary>

```text
}

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
```

</details>

**依据 3 · 源码核查**：[lib/wslconfig.js:126-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L126-L145)

返回仅配置。

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

### Q02 · 找到的文件一定属于当前Windows用户吗？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

路径先取WINDOWS_USER，再从PATH里/mnt/c/Users片段或home路径猜用户名；若USERPROFILE可解析也加候选，最后加/mnt/c/Users/Public/.wslconfig，选第一个exists，否则返回第一候选。没有查询Windows当前登录profile或WSL实际配置来源，自定义挂载/其他系统盘会漏，Public里文件存在也不证明它是WSL生效配置。输出path可供读者复核，但不输出候选依据或“猜测”状态。

入口apply检测WSL，非WSL拒绝；Node>=18 ESM，宿主tools/systemPrompt、可读Windows挂载与正确环境变量为依赖。execute用宿主env/home、非agent scope路径，没有用户参数覆盖。核心无子进程/网络，用同步exists/readFile，本插件不依赖运行PowerShell（通用wsl-host虽有辅助但此处只用detectWsl）。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:102-124](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L102-L124)

候选推断与Public。

<details>
<summary>查看原文（23行）</summary>

```text
}

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
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:126-132](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L126-L132)

进程环境。

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const readFile = deps.readFile || readFileSync;
  const home = deps.home || homedir();
  const { path } = resolveWslconfigPath({ env, exists, home });
  const fileExists = Boolean(path && exists(path));
```

**依据 3 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/index.js#L7-L29)

WSL门/宿主。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[package.json:14-18](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/package.json#L14-L18)

Node。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 截断、解析和错误处理如何影响结论？

**研究主题**：缺陷与关键质疑

#### 完整回答

readFile先把整个文件读入内存，再slice前2000字符作为excerpt和解析输入，没有truncated或完整长度。若networkingMode或后续覆盖键在后面，会被忽略；截在值中间可能把半个词当配置，不能以excerpt缺键推原文件缺键。read失败被吞，仍exists=true、ok=true并空settings，建议把未取到mode当NAT/unset处理，权限/IO错误会伪装成有效配置缺失。

INI-ish解析只忽略整行注释，保留行内注释和引号为值，不严格校验类型/取值，根段也接受wsl2键；其它段记入raw而不填专门字段，故experimental.autoMemoryReclaim不等顶层autoMemoryReclaim字段。配置raw和前2000字原文都会回到模型及render，包括用户注释/自定义字段，虽然没有主动取凭据也不应假设原文全可外发。

mirrored/NAT/端口/OLLAMA_HOST等建议均是静态套件假设，不检测中继存在、host_reach已装、当前服务绑定或安全访问控制。尤其0.0.0.0的外部服务建议需要读者按实际网络范围判断，工具不执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:27-59](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L27-L59)

简化INI和raw。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:64-99](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L64-L99)

静态建议。

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/wslconfig.js:133-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L133-L145)

全文读/截断/吞异常。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/wslconfig.js:16-23](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L16-L23)

原文输出。

```text
export function format(v) {
  const lines = [`wslconfig_hint ok=${v.ok} path=${v.path || "?"} exists=${v.exists}`];
  if (v.settings && Object.keys(v.settings).length) {
    lines.push(
      `settings: networkingMode=${v.settings.networkingMode || "?"} memory=${v.settings.memory || "?"} processors=${v.settings.processors || "?"}`,
    );
  }
  if (v.excerpt) lines.push("---\n" + v.excerpt + "\n---");
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程和分阶段成本有哪些证据？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

核心路径可注入env/exists/readFile/home，便于不接真实系统测试；69行生产测试检查常规wsl2解析、建议文本、单候选解析和format，没有测试execute读取失败/2000截断/多用户候选冲突/非标准INI。buildAdvice的hostRamHintGiB测试能触发大内存建议，但execute不传该值，所以不能称本工具真的检测宿主RAM。本次只读不执行。

首次明确真实Windows用户路径和原文可分享性；持续少量同步文件检查/读取和提示token，没有独立网络API或后台循环。excerpt限制返回长度但不限制读取内存，异常大文件会占宿主事件循环/内存，外层timeout不能中断同步readFile。恢复无插件写入回滚；读者照建议编辑/shutdown影响所有WSL任务，属外部动作应自己备份/安排，不由工具保证恢复。未有排障节时对照。

#### 证据与依据

**依据 1 · 源码核查**：[test/wslconfig.test.js:1-69](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/test/wslconfig.test.js#L1-L69)

正常解析/建议/候选/format测试。

<details>
<summary>查看原文（69行）</summary>

```text
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildWslconfigAdvice,
  format,
  parseWslconfig,
  resolveWslconfigPath,
} from "../lib/wslconfig.js";

describe("parseWslconfig", () => {
  it("reads mirrored and memory", () => {
    const s = parseWslconfig(`[wsl2]
networkingMode=mirrored
memory=64GB
processors=16
dnsTunneling=true
`);
    assert.equal(s.networkingMode, "mirrored");
    assert.equal(s.memory, "64GB");
    assert.equal(s.processors, "16");
    assert.equal(s.dnsTunneling, "true");
  });
});

describe("buildWslconfigAdvice", () => {
  it("warns when missing file", () => {
    const tips = buildWslconfigAdvice({}, { exists: false });
    assert.ok(tips.some((t) => /No \.wslconfig/i.test(t)));
  });

  it("explains mirrored + dsh :3081", () => {
    const tips = buildWslconfigAdvice({ networkingMode: "mirrored" }, { exists: true });
    assert.ok(tips.some((t) => /3081/i.test(t)));
  });

  it("explains NAT and forbids dsh 0.0.0.0", () => {
    const tips = buildWslconfigAdvice({ networkingMode: "nat" }, { exists: true });
    assert.ok(tips.some((t) => /never dsh --host 0\.0\.0\.0/i.test(t)));
  });

  it("suggests memory cap on large hosts", () => {
    const tips = buildWslconfigAdvice({}, { exists: true, hostRamHintGiB: 250 });
    assert.ok(tips.some((t) => /memory=32GB|64GB/i.test(t)));
  });
});

describe("resolveWslconfigPath", () => {
  it("prefers WINDOWS_USER path when present", () => {
    const { path } = resolveWslconfigPath({
      env: { WINDOWS_USER: "tester" },
      exists: (p) => p.includes("/tester/.wslconfig"),
    });
    assert.equal(path, "/mnt/c/Users/tester/.wslconfig");
  });
});

describe("format", () => {
  it("includes settings line", () => {
    const text = format({
      ok: true,
      path: "/mnt/c/Users/a/.wslconfig",
      exists: true,
      settings: { networkingMode: "mirrored", memory: "32GB", processors: "8" },
      advice: ["tip"],
    });
    assert.match(text, /networkingMode=mirrored/);
    assert.match(text, /tip/);
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/wslconfig.js:90-94](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L90-L94)

可注入RAM提示。

```text
    tips.push(
      `memory=${settings.memory} is set. Leave headroom for Windows + GPU drivers; on large hosts prefer an explicit cap over letting WSL balloon unchecked.`,
    );
  } else if (hostRamHintGiB && hostRamHintGiB >= 64) {
    tips.push(
```

**依据 3 · 源码核查**：[lib/wslconfig.js:126-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L126-L145)

execute无RAM探测和同步读。

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

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件和继续探讨方向？

**研究主题**：新假设与验证、采用判断

#### 完整回答

知道当前Windows真实profile且配置短小者可作为只读提示试用，核输出path确是目标，原文先去除不该分享的备注，按文件声明与实际活动模式分别判断；出现exists但空设置不要直接跟NAT建议，应先排读取错误。复杂INI、大文件、多用户、自定义挂载或要求自动证明网络状态时不宜直接依赖。

继续可研究明确配置来源、bounded完整读取/截断状态、parse诊断和unknown字段，把“文件声明/已加载模式/实际连通”分层，静态建议可选显示而非默认当诊断。基线为当前猜路径+前2000字符+ok=true，反例包括Public伪候选、后2000关键值、权限失败、行内注释、experimental键和修改未重启。比较错模式/错用户诊断率、外发原文量及排障工时，尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wslconfig.js:102-145](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L102-L145)

来源/读取/ok基线。

<details>
<summary>查看原文（44行）</summary>

```text
}

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

**依据 2 · 源码核查**：[lib/wslconfig.js:27-59](https://github.com/173787247/dsh-wsl-wslconfig/blob/486d6ffce7530bf46320c859ad9d4df502243d0f/lib/wslconfig.js#L27-L59)

解析基线。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
