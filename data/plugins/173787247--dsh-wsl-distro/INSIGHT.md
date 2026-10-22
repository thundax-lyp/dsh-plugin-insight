# dsh-wsl-distro

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[5a6f710](https://github.com/173787247/dsh-wsl-distro/tree/5a6f71031271a53d6e16abd267c59fbc69685a92)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro)
<!-- END META -->

> **实现功能**：查询WSL宿主当前发行版与os-release，解析Windows默认/已安装发行版列表，并提示跨发行版路径身份差异。

> **核心亮点**：把env/os与固定wsl列表结构化并提醒当前/默认不同，减少跨发行版路径猜测和手查。详见[Q02](#research-q02)。

> **风险与缺陷**：current/os缓存与实时list无时点，UTF8去NUL非完整编码处理、单token/英文状态可能漏；直接exec内10s不接外timeout/signal，ok不证明完整/路径可用。详见[Q03](#research-q03)。

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
  - [Q01 · 为什么需要发行版信息，结果不能替代什么？](#detail-section-11)
  - [Q02 · 信息采集、解析与提示如何组合？](#detail-section-12)
  - [Q03 · 本地化、进程与失败边界有哪些缺口？](#detail-section-13)
  - [Q04 · 如何启动使用并衡量成本？](#detail-section-14)
  - [Q05 · 推荐与可继续探讨入口是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向DSH host在WSL里、Windows默认发行版与当前进程所在发行版可能不同的用户。distro_info展示当前env名称、os-release、wsl.exe -l -v结构列表/默认星号并提示UNC不要跨发行版猜/home。

合格结果是明确host当前与Windows默认身份、采集时点/失败/解析未知，避免把另一发行版文件误当当前。不是切换/安装/终止发行版，不查用户home映射、不验证路径权限或Windows UNC实际可用。基线手查env、os-release与wsl列表，增量是统一结构化工具和提前提示。

手动env/os/wsl -l -v查信息，插件统一呈现但未证明完整率/省时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| current/os | host环境身份 | apply缓存非远端Agent身份 |
| list/default | Windows发行版列表 | 编码/单token/partial限制 |
| 差异提示 | 避免猜/home/UNC | 不检查存在/权限 |
| 查询进程 | 固定wsl -l -v | 直接exec 10s，不接signal |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18和DSH tools/systemPrompt | ESM/工具/提示 | 包无精确host peer锁定 |
| 可信WSL env和/etc/os-release | 当前host身份 | apply缓存，失败空未说明原因 |
| Windows互操作/PATH内wsl.exe | 每次列表 | 固定只读argv，直接子进程非host治理 |
| 环境元数据披露许可 | 展示/模型上下文 | 不读文件内容不等无隐私 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核WSL/互操作/注册契约 | 无需模型账号/Agent Teams |
| 调用 | 看current与default，核list.ok/raw | 不将空结构当无发行版 |
| 路径决策 | 先确认目标distro/用户/路径 | 信息工具不验证UNC/权限 |
| 故障 | 核编码/本地化/PATH/10s预算 | 重试前核是否仍有进程 |
| 更新 | env/os变更后重载或重新采集 | 输出当前缓存未必新鲜 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用WSL/小包与系统元数据 | 核互操作/宿主服务/PATH | 工时/金额未知 |
| 持续使用 | 每调用wsl.exe进程/列表IO和工具上下文 | 阅读发行版身份/默认差异 | 无独立网络/模型调用不等总token费0，实际时延未知 |
| 失败恢复 | 重试进程/重载缓存 | 排编码/超时/互操作与手核raw | 无写操作故无发行版回滚，恢复时间未知 |



#### 效果

| 目标 | 增量 | 边界 |
| --- | --- | --- |
| 避免跨distro猜路径 | 当前/默认并列与提示 | 不验证实际home/UNC |
| 少手查信息 | 结构列表/回退raw | 编码/partial可漏 |
| 副作用小 | 固定只读-list argv | 非host进程治理/全局预算 |

作者测试是英文列表/差异建议/格式化正例，缺真实OS/本地化/取消验证设计；本轮只读不执行测试/系统查询。

> **思考**：current/os缓存与实时list无时点，UTF8去NUL非完整编码处理、单token/英文状态可能漏；直接exec内10s不接外timeout/signal，ok不证明完整/路径可用。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把env/os与固定wsl列表结构化并提醒当前/默认不同，减少跨发行版路径猜测和手查。详见[Q02](#research-q02)。

把env/os与固定wsl列表结构化并提醒当前/默认不同，减少跨发行版路径猜测和手查。详见[Q02](#research-q02)。

parser只接受name/state各一个非空白token和数字version，未识别列本地化/多词状态/空格名称等结构；非匹配行静默忽略。Running提示只查英文/running/i，其他语言同等状态不出running摘要。stdout按utf8解码后删NUL能恢复部分ASCII形状，但不是完整UTF16解码，非ASCII发行版名称/状态不保证正确。部分行解析成功时render不再展示raw，漏行不显式标partial；空列表ok不证明无发行版。

实际子进程是node child_process.execFile，不走宿主subprocess/sandboxPolicy；固定wsl.exe从PATH查找，依可信宿主环境，不自证明二进制身份。内层固定10s、工具timeoutMs配置默认15s但未传listDistros也不接exec.signal，所以改变外层不改变真实exec预算，取消未必立即停进程。无自定义maxBuffer依Node默认，超限走错误而非部分列表；并发安全标true会允许多个列表进程，非全局请求预算。

读取/结果包含os字段、发行版名和raw错误，不持久写、不直接网络/模型，但进入宿主上下文仍是环境元数据披露。current/os读取失败退空未保存原因；检测WSL只env/release，不验证互操作wsl.exe可用。raw注册和无精确peer声明需核目标host工具契约，不能把套件外部矩阵当本轮加载结论。

<a id="detail-section-5"></a>

### 1.4 主要限制

current/os缓存与实时list无时点，UTF8去NUL非完整编码处理、单token/英文状态可能漏；直接exec内10s不接外timeout/signal，ok不证明完整/路径可用。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，可信本机WSL常规英文列表先看raw/ok并核路径身份；本地化/远端身份/严格治理先观察。详见[Q05](#research-q05)。

合格结果是明确host当前与Windows默认身份、采集时点/失败/解析未知，避免把另一发行版文件误当当前。不是切换/安装/终止发行版，不查用户home映射、不验证路径权限或Windows UNC实际可用。基线手查env、os-release与wsl列表，增量是统一结构化工具和提前提示。

采用建议：有试用，可信本机WSL常规英文列表先看raw/ok并核路径身份；本地化/远端身份/严格治理先观察。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。只读发行版差异提示明确，列表完整性/编码与host身份时点、进程预算需核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/distro.js、lib/wsl-host.js、test/distro.test.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：三运行JS与包/英文测试设计完整读取；不运行wsl.exe/PowerShell/目标测试或改发行版配置。
- 下一步：可继续用固定编码/本地化/缺行与延迟exec mock核partial/时点/取消及目标身份，不运行系统查询。

**分析版本**

- **仓库**：[173787247/dsh-wsl-distro](https://github.com/173787247/dsh-wsl-distro)
- **版本号**：0.2.0（[固定提交 5a6f710](https://github.com/173787247/dsh-wsl-distro/tree/5a6f71031271a53d6e16abd267c59fbc69685a92)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索来源/时点/partial与编码明确的环境收据，统一宿主进程signal/预算，比较误判与采集开销；未实现。详见[Q05](#research-q05)。

可继续用固定编码/本地化/缺行与延迟exec mock核partial/时点/取消及目标身份，不运行系统查询。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 95 | — | — | 549 |
| .js | source | 3 | 238 | 211 | 5 | — |
| .js | test | 1 | 56 | 53 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+created%3A2026-09-22T09%3A27%3A39.719Z..2026-10-22T09%3A27%3A39.719Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A27%3A39.719Z..2026-10-22T09%3A27%3A39.719Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核host当前与默认区别、实时/缓存来源、列表编码与完整性、固定只读子进程预算、成本与采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么需要发行版信息，结果不能替代什么？

**研究主题**：场景与需求

#### 完整回答

面向DSH host在WSL里、Windows默认发行版与当前进程所在发行版可能不同的用户。distro_info展示当前env名称、os-release、wsl.exe -l -v结构列表/默认星号并提示UNC不要跨发行版猜/home。

合格结果是明确host当前与Windows默认身份、采集时点/失败/解析未知，避免把另一发行版文件误当当前。不是切换/安装/终止发行版，不查用户home映射、不验证路径权限或Windows UNC实际可用。基线手查env、os-release与wsl列表，增量是统一结构化工具和提前提示。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-29](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/README.md#L17-L29)

作者信息/跨发行版定位。

<details>
<summary>查看原文（13行）</summary>

````text
**`distro_info`**: current distro, os-release, structured `wsl -l -v` (default vs session).

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-distro
npm test
```

MIT

## Where it sits

Reports wsl -l -v: default distro vs the one the agent is in, plus UNC path safety.

````

</details>

**依据 2 · 源码核查**：[index.js:50-54](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/index.js#L50-L54)

实际只列/建议。

```text
    async execute() {
      const list = wsl ? await listDistros() : { ok: false, error: "not WSL", distros: [], defaultName: "", raw: "" };
      const info = { wsl, current, os, list };
      info.advice = buildDistroAdvice(info);
      return info;
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 信息采集、解析与提示如何组合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply缓存detectWsl/currentDistro/readOsReleaseFields，current只取WSL_DISTRO_NAME、os同步读/etc/os-release按大写KEY=VALUE取去双引号值。systemPrompt启动就写host发行版/os。每次工具若wsl=true才实际execFile wsl.exe固定[-l,-v]，输出去NUL、按四列正则提默认星号、name、state、version。

列表新采集而current/os是apply时旧值，输出没有分别时间/来源，不能称同一时点全新探测。会话执行参数未参与current识别，描述This agent实际为宿主进程环境，不保证远端工作区/代理运行环境身份。

固定argv无用户命令插值，读失败list.ok=false并给error/raw，parser无匹配但命令0仍ok=true，render可在无结构行时显raw，是有用的人工回退。贡献是成熟系统信息查询加结构/默认差异提示，不是发行版隔离/路径修复机制。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-28](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/index.js#L13-L28)

apply缓存和提示。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();
  const current = currentDistro();
  const os = readOsReleaseFields();

  ctx.systemPrompt.section({
    name: "wsl-distro",
    order: 14,
    text: [
      current
        ? `You are running inside WSL distro "${current}"${os.PRETTY_NAME ? ` (${os.PRETTY_NAME})` : ""}.`
        : "WSL distro name is unknown; verify before writing \\\\wsl$\\ paths.",
      "Other installed distros may have different users and home directories. Use distro_info when unsure.",
    ].join(" "),
  });
```

</details>

**依据 2 · 源码核查**：[lib/distro.js:7-23](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L7-L23)

env/os读取。

<details>
<summary>查看原文（17行）</summary>

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
  }
```

</details>

**依据 3 · 源码核查**：[lib/distro.js:30-66](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L30-L66)

表解析/固定argv/错误。

<details>
<summary>查看原文（37行）</summary>

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
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      distros: [],
      defaultName: "",
      raw: "",
    };
```

</details>

**依据 4 · 源码核查**：[lib/distro.js:70-111](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L70-L111)

建议和raw回退。

<details>
<summary>查看原文（42行）</summary>

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
  if (info.os?.PRETTY_NAME) tips.push(`os-release: ${info.os.PRETTY_NAME}`);
  const running = (info.list?.distros || []).filter((d) => /running/i.test(d.state));
  if (running.length) tips.push(`Running: ${running.map((d) => d.name).join(", ")}`);
  return tips;
}

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
  for (const tip of info.advice || []) lines.push(`- ${tip}`);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地化、进程与失败边界有哪些缺口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

parser只接受name/state各一个非空白token和数字version，未识别列本地化/多词状态/空格名称等结构；非匹配行静默忽略。Running提示只查英文/running/i，其他语言同等状态不出running摘要。stdout按utf8解码后删NUL能恢复部分ASCII形状，但不是完整UTF16解码，非ASCII发行版名称/状态不保证正确。部分行解析成功时render不再展示raw，漏行不显式标partial；空列表ok不证明无发行版。

实际子进程是node child_process.execFile，不走宿主subprocess/sandboxPolicy；固定wsl.exe从PATH查找，依可信宿主环境，不自证明二进制身份。内层固定10s、工具timeoutMs配置默认15s但未传listDistros也不接exec.signal，所以改变外层不改变真实exec预算，取消未必立即停进程。无自定义maxBuffer依Node默认，超限走错误而非部分列表；并发安全标true会允许多个列表进程，非全局请求预算。

读取/结果包含os字段、发行版名和raw错误，不持久写、不直接网络/模型，但进入宿主上下文仍是环境元数据披露。current/os读取失败退空未保存原因；检测WSL只env/release，不验证互操作wsl.exe可用。raw注册和无精确peer声明需核目标host工具契约，不能把套件外部矩阵当本轮加载结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/distro.js:30-58](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L30-L58)

单token/utf8/去NUL/10s。

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

**依据 2 · 源码核查**：[lib/distro.js:89-111](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L89-L111)

英文状态/raw显示。

<details>
<summary>查看原文（23行）</summary>

```text
  const running = (info.list?.distros || []).filter((d) => /running/i.test(d.state));
  if (running.length) tips.push(`Running: ${running.map((d) => d.name).join(", ")}`);
  return tips;
}

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
  for (const tip of info.advice || []) lines.push(`- ${tip}`);
```

</details>

**依据 3 · 源码核查**：[index.js:14-17](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/index.js#L14-L17)

配置与缓存。

```text
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();
  const current = currentDistro();
  const os = readOsReleaseFields();
```

**依据 4 · 源码核查**：[index.js:48-54](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/index.js#L48-L54)

外timeout不传/无exec signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      const list = wsl ? await listDistros() : { ok: false, error: "not WSL", distros: [], defaultName: "", raw: "" };
      const info = { wsl, current, os, list };
      info.advice = buildDistroAdvice(info);
      return info;
```

**依据 5 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/wsl-host.js#L21-L27)

WSL弱判定。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

#### 缺口

- 真实本地化/非ASCII列表、取消/外层超时与不同host注册契约未矩阵核对。
  **影响**：不保证全语言/完整列表或立刻取消。
  **进一步探讨**：用固定UTF16/UTF8与多词/局部坏行mock及延迟exec核partial/身份/预算，不运行wsl命令。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何启动使用并衡量成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18和DSH tools/systemPrompt | ESM/工具/提示 | 包无精确host peer锁定 |
| 可信WSL env和/etc/os-release | 当前host身份 | apply缓存，失败空未说明原因 |
| Windows互操作/PATH内wsl.exe | 每次列表 | 固定只读argv，直接子进程非host治理 |
| 环境元数据披露许可 | 展示/模型上下文 | 不读文件内容不等无隐私 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核WSL/互操作/注册契约 | 无需模型账号/Agent Teams |
| 调用 | 看current与default，核list.ok/raw | 不将空结构当无发行版 |
| 路径决策 | 先确认目标distro/用户/路径 | 信息工具不验证UNC/权限 |
| 故障 | 核编码/本地化/PATH/10s预算 | 重试前核是否仍有进程 |
| 更新 | env/os变更后重载或重新采集 | 输出当前缓存未必新鲜 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用WSL/小包与系统元数据 | 核互操作/宿主服务/PATH | 工时/金额未知 |
| 持续使用 | 每调用wsl.exe进程/列表IO和工具上下文 | 阅读发行版身份/默认差异 | 无独立网络/模型调用不等总token费0，实际时延未知 |
| 失败恢复 | 重试进程/重载缓存 | 排编码/超时/互操作与手核raw | 无写操作故无发行版回滚，恢复时间未知 |

#### 效果

| 目标 | 增量 | 边界 |
| --- | --- | --- |
| 避免跨distro猜路径 | 当前/默认并列与提示 | 不验证实际home/UNC |
| 少手查信息 | 结构列表/回退raw | 编码/partial可漏 |
| 副作用小 | 固定只读-list argv | 非host进程治理/全局预算 |

作者测试是英文列表/差异建议/格式化正例，缺真实OS/本地化/取消验证设计；本轮只读不执行测试/系统查询。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-22](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/package.json#L14-L22)

Node/包。

```text
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/distro.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.zh.md", "LICENSE",
    "CHANGELOG.md",
    "CONTRIBUTING.md"],
  "keywords": ["dsh-plugin", "deepseek-harness", "wsl", "distro"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

**依据 2 · 源码核查**：[test/distro.test.js:9-21](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/test/distro.test.js#L9-L21)

作者英文解析正例。

<details>
<summary>查看原文（13行）</summary>

```text
describe("parseWslListVerbose", () => {
  it("parses default star and versions", () => {
    const sample = `
  NAME              STATE           VERSION
* Ubuntu-24.04      Running         2
  docker-desktop    Stopped         2
`;
    const { distros, defaultName } = parseWslListVerbose(sample);
    assert.equal(defaultName, "Ubuntu-24.04");
    assert.equal(distros.length, 2);
    assert.equal(distros[0].isDefault, true);
    assert.equal(distros[0].version, 2);
    assert.equal(distros[1].name, "docker-desktop");
```

</details>

**依据 3 · 源码核查**：[test/distro.test.js:25-39](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/test/distro.test.js#L25-L39)

差异提示正例。

<details>
<summary>查看原文（15行）</summary>

```text
describe("buildDistroAdvice", () => {
  it("warns current vs default mismatch", () => {
    const tips = buildDistroAdvice({
      current: "Ubuntu-24.04",
      os: { PRETTY_NAME: "Ubuntu 24.04" },
      list: {
        defaultName: "docker-desktop",
        distros: [
          { name: "Ubuntu-24.04", state: "Running", version: 2, isDefault: false },
          { name: "docker-desktop", state: "Stopped", version: 2, isDefault: true },
        ],
      },
    });
    assert.ok(tips.some((t) => /Default distro is "docker-desktop"/i.test(t)));
    assert.ok(tips.some((t) => /wsl\$\\Ubuntu-24.04/i.test(t)));
```

</details>

**依据 4 · 源码核查**：[lib/distro.js:49-66](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L49-L66)

实际资源/失败。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

#### 缺口

- 与手动查询相比的错发行版率/响应时间/总上下文没有对照。
  **影响**：不量化省时或错误减少。
  **进一步探讨**：固定多发行版任务与mock列表，让人工判目标，比较误判/缺项/阅读成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐与可继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。可信个人WSL/正常英文ASCII列表可快速核当前与默认，固定查询不改发行版；先看raw/list.ok并独立核目标路径。多语言/非ASCII、远端Agent身份或严格取消/权限治理场景先观察，不能把列表当文件访问保证。

由host缓存与实时list混用、无partial解析与预算脱节，可推导“带采集来源/时间/解析完整性的环境收据”。每次区分host env/os与Windows列表的时点，明确unknown/partial和原始编码；保数字状态与本地化映射，无法解析不宣无发行版。经宿主subprocess传signal和同一timeout，记录受理/退出/取消。

未实现。反例是host进程环境不代表远程任务目标，即使完全新采集也不能推远端身份；方案应要求显式target而非假装推断。最小对照含UTF16非ASCII、多词/局部坏行、env缺失、default改变、outertimeout<10s/取消与非零退出。若仍把partial当完整、身份时点混淆或取消后进程留存却报完成，核心假设被反证；比较新增采集延迟/披露量与误判减少，不以更多字段等同更安全。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:14-17](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/index.js#L14-L17)

缓存时点基线。

```text
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();
  const current = currentDistro();
  const os = readOsReleaseFields();
```

**依据 2 · 源码核查**：[index.js:48-54](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/index.js#L48-L54)

预算基线。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      const list = wsl ? await listDistros() : { ok: false, error: "not WSL", distros: [], defaultName: "", raw: "" };
      const info = { wsl, current, os, list };
      info.advice = buildDistroAdvice(info);
      return info;
```

**依据 3 · 源码核查**：[lib/distro.js:30-66](https://github.com/173787247/dsh-wsl-distro/blob/5a6f71031271a53d6e16abd267c59fbc69685a92/lib/distro.js#L30-L66)

解析/退出基线。

<details>
<summary>查看原文（37行）</summary>

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
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      distros: [],
      defaultName: "",
      raw: "",
    };
```

</details>

#### 缺口

- 新环境收据/宿主进程预算方案未实现。
  **影响**：不计当前完整性/治理优势。
  **进一步探讨**：固定mock编码/身份/进程时序对照误判与资源，不调用Windows命令。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
