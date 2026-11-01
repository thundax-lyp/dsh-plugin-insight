# dsh-wsl-distro

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[92bb411](https://github.com/173787247/dsh-wsl-distro/tree/92bb411eb4ec1e9d08c38fc618c766db04853a22)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-distro)
<!-- END META -->

> **功能**：查询 WSL 当前发行版与已安装发行版，并提示路径身份差异。

> **亮点**：[Q02](#research-q02) 把多来源身份和路径提醒汇集到工具结果。

> **主要限制**：[Q03](#research-q03) 部分行可静默略过，工具层超时未传入内部固定子进程超时。

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
  - [Q01 · 当前与默认发行版差异为何值得查看？](#detail-section-11)
  - [Q02 · 身份、列表和提示从何而来？](#detail-section-12)
  - [Q03 · 解析成功是否等于列表完整或可按配置取消？](#detail-section-13)
  - [Q04 · 什么情况下结果可用于路径判断？](#detail-section-14)
  - [Q05 · 如何帮助用户识别列表可能不完整？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 WSL 内辨认当前和 Windows 默认发行版的 DSH 用户。

手工查看环境变量、os-release 与 wsl.exe 原始输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 当前身份 | 识别当前发行版 | 加载时环境快照 |
| 列表解析 | 查看安装与默认 | 特定单词表格格式，可能部分漏行 |
| 路径建议 | 提醒跨发行版差异 | 不检查文件身份 |
| 原文回退 | 诊断零匹配 | 部分匹配时格式化不显示其余 raw |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH tools 和 systemPrompt | 必需 | 注册查询及提示 | 无法正常接入 |
| WSL 和可用 wsl.exe | 列表必需 | 查询 Windows 发行版 | 返回非 WSL 或子进程错误 |
| 可解析的输出格式 | 结构列表必需 | 提取名称、状态和版本 | 可漏行，需核对 raw |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认宿主和 WSL | 环境不满足时回系统查询 |
| 查询 | Agent 调用 distro_info | 检查 current、list 和错误 |
| 核对 | 用户比对原始列表和目标路径 | 部分解析或名称异常时停止假定 |
| 使用 | 用户确认发行版后继续操作 | 路径仍需验证实际文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 软件及系统资源费用未知 | 配置兼容性时间未知 | 需 WSL 和 DSH |
| 持续使用 | 子进程资源消耗未知 | 比对原文和路径时间未知 | 每次工具调用查询列表 |
| 失败恢复 | 重试资源费用未知 | 排查编码、进程与手工查询时间未知 | 内部固定 10 秒 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 身份提醒 | 源码比较当前与默认名称 | 实机误选率 |
| 结构列表 | 正则解析符合格式的行 | 部分和本地化输出完整性 |
| 失败提示 | 子进程异常返回错误，零匹配可显示 raw | 用户是否识别部分解析 |

> **思考**：[Q03](#research-q03) 部分行可静默略过，工具层超时未传入内部固定子进程超时。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把多来源身份和路径提醒汇集到工具结果。

[Q03](#research-q03) 静态与动态来源时点不同，部分行略过且两层超时未接线。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 部分行可静默略过，工具层超时未传入内部固定子进程超时。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 重要路径操作前核对系统原始输出和实际文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行 DSH、wsl.exe 或不同语言系统，假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/distro.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态核查；未运行 WSL、目标程序或本地测试。
- 下一步：在隔离 WSL 对照原始字节、语言、部分解析、超时及取消后的子进程。

**分析版本**

- **仓库**：[173787247/dsh-wsl-distro](https://github.com/173787247/dsh-wsl-distro)
- **版本号**：0.2.0（[固定提交 92bb411](https://github.com/173787247/dsh-wsl-distro/tree/92bb411eb4ec1e9d08c38fc618c766db04853a22)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照已有 raw 与差异提示，验证未解析行提示能否减少误选。

在隔离 WSL 对照原始字节、语言、部分解析、超时及取消后的子进程。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 95 | — | — | 549 |
| .js | source | 3 | 238 | 211 | 5 | — |
| .js | test | 1 | 56 | 53 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查当前与默认发行版来源、列表完整性和超时边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前与默认发行版差异为何值得查看？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 WSL 中执行任务且要构造 Windows UNC 或切换发行版的用户，需要知道当前进程环境与 Windows 默认发行版可能不同；系统 wsl.exe 和 os-release 手动查询也是替代。插件整合环境、系统信息和列表并给出路径提醒，合格判断仍须以实际发行版和文件身份核实；使用频率与错误降低未测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:26-28](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/README.md#L26-L28)

作者说明使用场景。

```text
## Where it sits

Reports wsl -l -v: default distro vs the one the agent is in, plus UNC path safety.
```

**依据 2 · 源码核查**：[lib/distro.js:70-87](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L70-L87)

当前和默认不同时的提醒。

<details>
<summary>查看原文（18行）</summary>

```text
export function buildDistroAdvice(info) {
  const tips = [];
  if (info.current) tips.push(`This agent is inside distro: ${info.current}`);
  else tips.push("WSL_DISTRO_NAME is unset; path mapping via \\\\wsl$\\ may be wrong.");

  const defaultName = info.list?.defaultName || "";
  if (info.current && defaultName && info.current !== defaultName) {
    tips.push(
      `Default distro is "${defaultName}" but this session is "${info.current}" — do not assume /home matches the default.`,
    );
  } else {
    tips.push("Default distro (`wsl -s`) may differ from this session — do not assume /home paths match another distro.");
  }

  tips.push("Usernames can differ across distros; prefer absolute paths.");
  tips.push(
    `Windows UNC must use this distro: \\\\wsl$\\${info.current || "<distro>"}\\… — verify with path_convert / wsl_workspace.`,
  );
```

</details>

#### 缺口

- 缺少真实使用频率和替代对照
  **影响**：不能证明收益大小
  **进一步探讨**：比较系统命令和插件的识别时间及错误目标。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 身份、列表和提示从何而来？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 时一次性探测 WSL、读取 WSL_DISTRO_NAME 和 /etc/os-release；每次 distro_info 若检测到 WSL 则调用 wsl.exe -l -v，UTF-8 解码后删除 NUL，以行正则解析名称、状态、版本和默认标记。列表调用异常返回 ok:false；格式化只在没有解析出任何发行版但有 raw 时显示原文。当前身份与 os-release 是加载时快照，列表是每次调用，不保证同一时点。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-17](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/index.js#L13-L17)

加载时捕获环境和系统信息。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();
  const current = currentDistro();
  const os = readOsReleaseFields();
```

**依据 2 · 源码核查**：[index.js:48-54](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/index.js#L48-L54)

工具执行请求列表并生成建议。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      const list = wsl ? await listDistros() : { ok: false, error: "not WSL", distros: [], defaultName: "", raw: "" };
      const info = { wsl, current, os, list };
      info.advice = buildDistroAdvice(info);
      return info;
```

**依据 3 · 源码核查**：[lib/distro.js:7-22](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L7-L22)

身份与 os-release 读取。

<details>
<summary>查看原文（16行）</summary>

```text
export function currentDistro({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "";
}

export function readOsReleaseFields({ readFile = readFileSync } = {}) {
  try {
    const text = readFile("/etc/os-release", "utf8");
    const out = {};
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (!m) continue;
      out[m[1]] = m[2].replace(/^"|"$/g, "");
    }
    return out;
  } catch {
    return {};
```

</details>

**依据 4 · 源码核查**：[lib/distro.js:30-58](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L30-L58)

正则解析和外部进程。

<details>
<summary>查看原文（29行）</summary>

```text
export function parseWslListVerbose(raw) {
  const text = String(raw || "").replace(/\0/g, "");
  const distros = [];
  let defaultName = "";
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^NAME\b/i.test(trimmed) || /^-+$/.test(trimmed)) continue;
    const m = trimmed.match(/^(\*)?\s*(\S+)\s+(\S+)\s+(\d+)\s*$/);
    if (!m) continue;
    const isDefault = Boolean(m[1]);
    const name = m[2];
    const state = m[3];
    const version = Number(m[4]);
    if (isDefault) defaultName = name;
    distros.push({ name, state, version, isDefault });
  }
  return { distros, defaultName };
}

export async function listDistros({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-v"], {
      encoding: "utf8",
      timeout: 10_000,
      windowsHide: true,
    });
    const raw = String(stdout || "").replace(/\0/g, "");
    const parsed = parseWslListVerbose(raw);
    return { ok: true, raw, ...parsed };
```

</details>

**依据 5 · 源码核查**：[lib/distro.js:94-110](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L94-L110)

列表、raw 或错误展示。

<details>
<summary>查看原文（17行）</summary>

```text
export function formatDistroReport(info) {
  const lines = ["distro_info", `current: ${info.current || "(unknown)"}`];
  if (info.os?.PRETTY_NAME) lines.push(`os: ${info.os.PRETTY_NAME}`);
  if (info.list?.defaultName) lines.push(`default: ${info.list.defaultName}`);
  if (info.list?.distros?.length) {
    lines.push("distros:");
    for (const d of info.list.distros) {
      lines.push(
        `  ${d.isDefault ? "*" : " "} ${d.name}  ${d.state}  WSL${d.version}`,
      );
    }
  } else if (info.list?.ok && info.list.raw) {
    lines.push("--- wsl -l -v ---");
    lines.push(info.list.raw.trim());
  } else if (info.list?.error) {
    lines.push(`wsl -l: ${info.list.error}`);
  }
```

</details>

#### 缺口

- 未运行 WSL 和本地化输出
  **影响**：不能确认输出编码或实际识别范围
  **进一步探讨**：隔离环境记录不同语言和非 ASCII 发行版名的原始输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 解析成功是否等于列表完整或可按配置取消？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

解析器只接受名称、状态都为单个非空白词且末尾为数字的行，不匹配行静默略过；只要至少一行匹配，格式化就显示结构行，不显示剩余 raw，因此部分解析可能被误认为完整。listDistros 把子进程 timeout 固定为 10000ms，工具层 timeoutMs 由配置设置但调用未向 listDistros 传递该值或取消信号；无法由工具声明推断底层子进程按相同预算或随宿主取消立即停止。UTF-8 读取后去 NUL 不保证所有非 ASCII UTF-16 输出可正确解码。

#### 证据与依据

**依据 1 · 源码核查**：[lib/distro.js:30-58](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L30-L58)

行匹配、UTF-8 与进程固定超时。

<details>
<summary>查看原文（29行）</summary>

```text
export function parseWslListVerbose(raw) {
  const text = String(raw || "").replace(/\0/g, "");
  const distros = [];
  let defaultName = "";
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^NAME\b/i.test(trimmed) || /^-+$/.test(trimmed)) continue;
    const m = trimmed.match(/^(\*)?\s*(\S+)\s+(\S+)\s+(\d+)\s*$/);
    if (!m) continue;
    const isDefault = Boolean(m[1]);
    const name = m[2];
    const state = m[3];
    const version = Number(m[4]);
    if (isDefault) defaultName = name;
    distros.push({ name, state, version, isDefault });
  }
  return { distros, defaultName };
}

export async function listDistros({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-v"], {
      encoding: "utf8",
      timeout: 10_000,
      windowsHide: true,
    });
    const raw = String(stdout || "").replace(/\0/g, "");
    const parsed = parseWslListVerbose(raw);
    return { ok: true, raw, ...parsed };
```

</details>

**依据 2 · 源码核查**：[lib/distro.js:94-110](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L94-L110)

只有零匹配时展示 raw。

<details>
<summary>查看原文（17行）</summary>

```text
export function formatDistroReport(info) {
  const lines = ["distro_info", `current: ${info.current || "(unknown)"}`];
  if (info.os?.PRETTY_NAME) lines.push(`os: ${info.os.PRETTY_NAME}`);
  if (info.list?.defaultName) lines.push(`default: ${info.list.defaultName}`);
  if (info.list?.distros?.length) {
    lines.push("distros:");
    for (const d of info.list.distros) {
      lines.push(
        `  ${d.isDefault ? "*" : " "} ${d.name}  ${d.state}  WSL${d.version}`,
      );
    }
  } else if (info.list?.ok && info.list.raw) {
    lines.push("--- wsl -l -v ---");
    lines.push(info.list.raw.trim());
  } else if (info.list?.error) {
    lines.push(`wsl -l: ${info.list.error}`);
  }
```

</details>

**依据 3 · 源码核查**：[index.js:13-16](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/index.js#L13-L16)

外层超时配置。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();
  const current = currentDistro();
```

**依据 4 · 源码核查**：[index.js:48-54](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/index.js#L48-L54)

不传入 timeout 或 signal 的实际调用。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      const list = wsl ? await listDistros() : { ok: false, error: "not WSL", distros: [], defaultName: "", raw: "" };
      const info = { wsl, current, os, list };
      info.advice = buildDistroAdvice(info);
      return info;
```

#### 缺口

- 未在真实本地化 WSL 中验证编码和取消
  **影响**：不能量化漏行或确认宿主对超时的具体处理
  **进一步探讨**：使用受控输出含部分匹配、多词状态和非 ASCII 名称并在隔离宿主检查进程退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么情况下结果可用于路径判断？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需兼容 DSH tools/systemPrompt、WSL 及可调用的 wsl.exe；当前名取环境变量，缺失时提示未知，系统文件读取失败返回空对象。用户应先对照原始系统列表及目标文件，特别是部分或本地化解析；外层超时和内部固定 10 秒应分别理解，不能将结果当作路径可访问性验证。费用与人工核查时间未知，失败时可回到系统工具手动查询。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:10-17](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/index.js#L10-L17)

宿主依赖与捕获。

```text
export const name = "dsh-wsl-distro";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();
  const current = currentDistro();
  const os = readOsReleaseFields();
```

**依据 2 · 源码核查**：[lib/distro.js:7-22](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L7-L22)

缺失名称与系统信息回退。

<details>
<summary>查看原文（16行）</summary>

```text
export function currentDistro({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "";
}

export function readOsReleaseFields({ readFile = readFileSync } = {}) {
  try {
    const text = readFile("/etc/os-release", "utf8");
    const out = {};
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (!m) continue;
      out[m[1]] = m[2].replace(/^"|"$/g, "");
    }
    return out;
  } catch {
    return {};
```

</details>

**依据 3 · 源码核查**：[lib/distro.js:49-67](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L49-L67)

子进程及失败返回。

<details>
<summary>查看原文（19行）</summary>

```text
export async function listDistros({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-v"], {
      encoding: "utf8",
      timeout: 10_000,
      windowsHide: true,
    });
    const raw = String(stdout || "").replace(/\0/g, "");
    const parsed = parseWslListVerbose(raw);
    return { ok: true, raw, ...parsed };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      distros: [],
      defaultName: "",
      raw: "",
    };
  }
```

</details>

#### 缺口

- 未测试宿主、系统命令或目标文件
  **影响**：不能保证兼容、时效和恢复负担
  **进一步探讨**：隔离 WSL 比较插件与系统原始输出及实际路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户识别列表可能不完整？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有零匹配时 raw 回退和当前/默认差异提醒，是直接反证；假设同时显示解析行数、未解析非表头行数以及可查看原文，帮助用户决定可否据列表选择发行版或需回系统命令核对。对照现有格式，在全部匹配、部分匹配、编码异常及命令失败条件下测错误发行版选择、漏报、人工核对时间和敏感输出暴露；若误选不降、误报或额外负担抵消收益则否定。当前原始输出本来已在结构结果中，提议是更明确暴露不完整性而非声称数据不存在。

#### 证据与依据

**依据 1 · 源码核查**：[lib/distro.js:30-45](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L30-L45)

不匹配行直接略过。

<details>
<summary>查看原文（16行）</summary>

```text
export function parseWslListVerbose(raw) {
  const text = String(raw || "").replace(/\0/g, "");
  const distros = [];
  let defaultName = "";
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^NAME\b/i.test(trimmed) || /^-+$/.test(trimmed)) continue;
    const m = trimmed.match(/^(\*)?\s*(\S+)\s+(\S+)\s+(\d+)\s*$/);
    if (!m) continue;
    const isDefault = Boolean(m[1]);
    const name = m[2];
    const state = m[3];
    const version = Number(m[4]);
    if (isDefault) defaultName = name;
    distros.push({ name, state, version, isDefault });
  }
```

</details>

**依据 2 · 源码核查**：[lib/distro.js:49-58](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L49-L58)

结构结果包含 raw。

<details>
<summary>查看原文（10行）</summary>

```text
export async function listDistros({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("wsl.exe", ["-l", "-v"], {
      encoding: "utf8",
      timeout: 10_000,
      windowsHide: true,
    });
    const raw = String(stdout || "").replace(/\0/g, "");
    const parsed = parseWslListVerbose(raw);
    return { ok: true, raw, ...parsed };
```

</details>

**依据 3 · 源码核查**：[lib/distro.js:94-110](https://github.com/173787247/dsh-wsl-distro/blob/92bb411eb4ec1e9d08c38fc618c766db04853a22/lib/distro.js#L94-L110)

零匹配才在文本格式显示 raw。

<details>
<summary>查看原文（17行）</summary>

```text
export function formatDistroReport(info) {
  const lines = ["distro_info", `current: ${info.current || "(unknown)"}`];
  if (info.os?.PRETTY_NAME) lines.push(`os: ${info.os.PRETTY_NAME}`);
  if (info.list?.defaultName) lines.push(`default: ${info.list.defaultName}`);
  if (info.list?.distros?.length) {
    lines.push("distros:");
    for (const d of info.list.distros) {
      lines.push(
        `  ${d.isDefault ? "*" : " "} ${d.name}  ${d.state}  WSL${d.version}`,
      );
    }
  } else if (info.list?.ok && info.list.raw) {
    lines.push("--- wsl -l -v ---");
    lines.push(info.list.raw.trim());
  } else if (info.list?.error) {
    lines.push(`wsl -l: ${info.list.error}`);
  }
```

</details>

#### 缺口

- 未测试用户和输出类型分布
  **影响**：不能断言提示增益或隐私代价
  **进一步探讨**：用匿名合成表格及真实许可样本对照两种展示。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
