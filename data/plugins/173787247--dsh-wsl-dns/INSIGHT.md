# dsh-wsl-dns

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5a89285](https://github.com/173787247/dsh-wsl-dns/tree/5a892859d088010e15f7227d0e8027ae4778a8fa)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-dns)
<!-- END META -->

> **功能**：提供 dns_doctor，对照 WSL 与 Windows 的 DNS IPv4 解析和 resolv.conf。

> **亮点**：[Q01](#research-q01) 两侧查询/配置片段汇为模型工具减少手查，复用既有系统解析能力。

> **主要限制**：[Q02](#research-q02) 错误折叠为空、ok只看WSL，两侧不同非劫持证明；总预算/取消未贯通。

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
  - [Q01 · 两侧DNS比较比手查多什么？](#detail-section-11)
  - [Q02 · ok与mismatch代表什么，查询失败如何处理？](#detail-section-12)
  - [Q03 · 什么条件和负担使诊断不再便宜？](#detail-section-13)
  - [Q04 · 采用判断与下一步增量是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL访问模型/GitHub/npm异常时需要比较两侧解析现象。

手查DNS命令与网络配置；差异不等根因。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 双侧IPv4 | 比较解析观察 | 非同解析链/无IPv6 |
| 差异标签 | 标记非空集合不同 | 非故障或劫持证明 |
| nameserver与建议 | 人工排查入口 | 无自动修复或回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WSL/PowerShell/Node>=18 | 必需 | 两侧解析 | 错误可能变空数组 |
| 匹配DSH | 必需 | 工具与提示 | 外链兼容未验 |
| 域名披露许可 | 必需 | 真实DNS查询 | 内网名/地址进入网络/上下文 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核域名和interop | 允许查询且原配置留存 |
| 查询 | Agent选有限hosts | 看两侧原结果而非只ok |
| 判断 | 人工对照原生命令 | 差异不直接修配置 |
| 退出 | 停用工具 | 已改网络另按记录恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原宿主/网络 | 核interop与披露 | 工时未知 |
| 持续 | 每host双查询/进程/上下文 | 解释差异 | 串行预算无上限约束 |
| 失败恢复 | 重查与可能网络停机 | 区分空结果原因 | 插件无回滚 |
| 退出 | 保留原配置 | 停用工具 | 不证明在途查询立即停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 地址对照 | IPv4集合标签 | 根因/IPv6/错误来源 |
| 配置线索 | 首nameserver | 完整解析链 |
| 排障入口 | 固定工具/提示 | 节时/误诊率/应用可用 |

> **思考**：[Q02](#research-q02) 错误折叠为空、ok只看WSL，两侧不同非劫持证明；总预算/取消未贯通。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 两侧查询/配置片段汇为模型工具减少手查，复用既有系统解析能力。

[Q02](#research-q02) 单引号转义/固定argv为具体防护；双API不同语义与错误折叠需要公开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 错误折叠为空、ok只看WSL，两侧不同非劫持证明；总预算/取消未贯通。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 观察并先补错误和预算，不以ok/mismatch自动修DNS；回原生查询核实。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持只读查询整合，未运行DNS/PowerShell；对自动诊断建议观察，收据未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/dns.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读README/清单/index/dns/wsl-host，复核全部旧findings；未执行DNS、PowerShell、测试或改网络。
- 下一步：CDN正常差异、IPv6-only、无A、Windows失败、多host超时对照，计入披露与误改配置。

**分析版本**

- **仓库**：[173787247/dsh-wsl-dns](https://github.com/173787247/dsh-wsl-dns)
- **版本号**：0.2.0（[固定提交 5a89285](https://github.com/173787247/dsh-wsl-dns/tree/5a892859d088010e15f7227d0e8027ae4778a8fa)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 比较收据保留来源/时间/错误与统一deadline；误改配置不降或额外披露不值得即否定。

CDN正常差异、IPv6-only、无A、Windows失败、多host超时对照，计入披露与误改配置。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 95 | — | — | 546 |
| .js | source | 3 | 261 | 234 | 2 | — |
| .js | test | 1 | 65 | 59 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-dns/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查双侧DNS观察的价值、结果语义与错误/预算边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两侧DNS比较比手查多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向WSL中DeepSeek/GitHub/npm异常的开发者，dns_doctor把三个默认域名或自定义hosts的两侧IPv4集合、首个resolv.conf nameserver和差异提示汇总到模型工具。合格结果是两侧可解释的解析观察，不是得到mismatch就自动改DNS。原生DNS/PowerShell负责查询，本插件增加统一入口与对照，熟悉nslookup/配置的偶发用户可直接手查。

index真实注入tools/systemPrompt，非WSL返回错误；未修改DNS或代理，也未访问HTTPS端点，故无法保证应用可用或减少故障。作者的split-DNS/劫持解释只是排查候选，正常CDN分配、缓存及顺序查询也会产生差异。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:17-28](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/README.md#L17-L28)

作者定位与不改代理。

<details>
<summary>查看原文（12行）</summary>

````text
**`dns_doctor`**: compare WSL vs Windows DNS for DeepSeek/GitHub/npm; flag mismatches.

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-dns
npm test
```

MIT

## Where it sits

Compares WSL resolv.conf with Windows DNS. It does not change the proxy.
````

</details>

**依据 2 · 源码核查**：[index.js:1-30](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/index.js#L1-L30)

注册与实际调用。

<details>
<summary>查看原文（30行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/dns.js";

export const name = "dsh-wsl-dns";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:dns_doctor",
    order: 116,
    text: "Use dns_doctor when HTTPS fails oddly: compare WSL vs Windows DNS for api.deepseek.com / GitHub / npm. Pair with net_doctor and clock_doctor.",
  });

  ctx.tools.register({
    name: "dns_doctor",
    description:
      "Compare WSL vs Windows DNS (A records) for DeepSeek/GitHub/npm; flag mismatches and resolv.conf nameserver.",
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

**依据 3 · 源码核查**：[lib/dns.js:75-105](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L75-L105)

建议的因果不由查询验证。

<details>
<summary>查看原文（31行）</summary>

```text
export function buildDnsAdvice({ resolvNameserver = "", results = [] } = {}) {
  const tips = [];
  const annotated = results[0]?.mismatch != null ? results : annotateResults(results);
  const failedWsl = annotated.filter((r) => r.wslEmpty);
  const mismatches = annotated.filter((r) => r.mismatch);
  const winOnlyFail = annotated.filter((r) => !r.wslEmpty && r.winEmpty);

  if (failedWsl.length) {
    tips.push(
      `WSL failed to resolve: ${failedWsl.map((r) => r.host).join(", ")}. Check VPN/DNS; try regenerating resolv.conf or networkingMode=mirrored (wslconfig_hint).`,
    );
  }
  if (mismatches.length) {
    tips.push(
      `WSL vs Windows A records differ for: ${mismatches.map((r) => r.host).join(", ")}. Often VPN split-DNS or hijacked resolv.conf — prefer mirrored networking or fix the Windows DNS the WSL nameserver points at.`,
    );
  }
  if (winOnlyFail.length) {
    tips.push(
      `Windows resolve failed while WSL succeeded for: ${winOnlyFail.map((r) => r.host).join(", ")}. Unusual; re-check PowerShell DNS / corporate filter.`,
    );
  }
  if (resolvNameserver) {
    tips.push(`resolv.conf nameserver=${resolvNameserver} (often the Windows host IP under NAT).`);
  }
  if (!failedWsl.length && !mismatches.length) {
    tips.push("WSL resolution looks OK for probed hosts.");
  }
  tips.push("If HTTPS still fails after DNS OK, run net_doctor (NODE_USE_ENV_PROXY / proxy port).");
  tips.push("TLS errors after laptop sleep may be clock skew — run clock_doctor.");
  return tips;
```

</details>

#### 缺口

- 缺少手查/同条件故障任务对照。
  **影响**：未知统一入口能否降低误诊或人工时间。
  **进一步探讨**：以CDN正常差异和真故障案例比较误判与排查步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · ok与mismatch代表什么，查询失败如何处理？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

WSL用dns.resolve4，Windows用GetHostAddresses再筛IPv4；不是同解析器/同缓存的受控比较。集合排序去重，只有双方非空且不等才mismatch；顶层ok只看WSL是否非空，因此Windows全失败或全部不一致也可能ok=true。format输出空数组却不显示notWsl顶层error，不能以ok或空数组推断网络健康/故障原因。

两个resolver都catch成[]，DNS无A、NXDOMAIN、超时、PowerShell缺失等原因丢失；IPv6-only也不在范围。每host先WSL后Windows串行，未保TTL/时间/解析来源。Windows每次15秒，core忽略_config，WSL没有插件显式期限，hosts无数量/长度上限；总等待可超过外层默认15秒，入口未接signal。单引号双写和固定execFile argv确实避免简单命令插值，不能据脚本字符串就声称任意注入。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dns.js:27-38](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L27-L38)

格式不呈现error。

<details>
<summary>查看原文（12行）</summary>

```text
export function format(v) {
  const lines = [`dns_doctor ok=${v.ok}`];
  if (v.resolvNameserver) lines.push(`resolv.conf nameserver: ${v.resolvNameserver}`);
  if (v.mismatchCount != null) lines.push(`mismatchHosts: ${v.mismatchCount}`);
  for (const r of v.results || []) {
    const flag = r.mismatch ? " MISMATCH" : "";
    lines.push(
      `${r.host}: wsl=[${(r.wsl || []).join(",")}] win=[${(r.windows || []).join(",")}]${flag}`,
    );
  }
  for (const a of v.advice || []) lines.push(`- ${a}`);
  return lines.join("\n");
```

</details>

**依据 2 · 源码核查**：[lib/dns.js:50-72](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L50-L72)

mismatch仅两非空。

<details>
<summary>查看原文（23行）</summary>

```text
/** Compare sorted unique IPv4 lists. */
export function ipsEqual(a = [], b = []) {
  const sa = [...new Set(a)].sort().join(",");
  const sb = [...new Set(b)].sort().join(",");
  return sa === sb;
}

export function annotateResults(results = []) {
  return results.map((r) => {
    const wsl = r.wsl || [];
    const windows = r.windows || [];
    const wslEmpty = wsl.length === 0;
    const winEmpty = windows.length === 0;
    const mismatch = !wslEmpty && !winEmpty && !ipsEqual(wsl, windows);
    return {
      host: r.host,
      wsl,
      windows,
      wslEmpty,
      winEmpty,
      mismatch,
    };
  });
```

</details>

**依据 3 · 源码核查**：[lib/dns.js:108-160](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L108-L160)

两API/错误折叠/顺序与ok。

<details>
<summary>查看原文（53行）</summary>

```text
async function resolveWsl(host) {
  try {
    return await dns.resolve4(host);
  } catch {
    return [];
  }
}

async function resolveWin(host) {
  try {
    const { stdout } = await runPowerShell(
      `([System.Net.Dns]::GetHostAddresses('${host.replace(/'/g, "''")}') | Where-Object { $_.AddressFamily -eq 'InterNetwork' } | ForEach-Object { $_.IPAddressToString }) -join ','`,
      { timeoutMs: 15_000 },
    );
    return String(stdout)
      .trim()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function execute(args, _config = {}, deps = {}) {
  const hosts =
    Array.isArray(args?.hosts) && args.hosts.length
      ? args.hosts.map(String)
      : ["api.github.com", "registry.npmjs.org", "api.deepseek.com"];
  const resolvNameserver = (deps.readResolvNameserver || readResolvNameserver)({
    readFile: deps.readFile || readFileSync,
  });
  const resolveWslFn = deps.resolveWsl || resolveWsl;
  const resolveWinFn = deps.resolveWin || resolveWin;
  const raw = [];
  for (const host of hosts) {
    raw.push({
      host,
      wsl: await resolveWslFn(host),
      windows: await resolveWinFn(host),
    });
  }
  const results = annotateResults(raw);
  const advice = buildDnsAdvice({ resolvNameserver, results });
  const failed = results.filter((r) => r.wslEmpty);
  return {
    ok: failed.length === 0,
    resolvNameserver,
    mismatchCount: results.filter((r) => r.mismatch).length,
    results,
    advice,
  };
}
```

</details>

**依据 4 · 源码核查**：[index.js:26-30](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/index.js#L26-L30)

信号未传。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 5 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/wsl-host.js#L34-L41)

固定argv进程执行。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

#### 缺口

- 实际错误频率/解析链和总预算未测。
  **影响**：不能保证诊断完整性或取消后无后台等待。
  **进一步探讨**：核无A/IPv6/Windows失败/多host慢查询，记录两侧原错误及真实完成时间。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件和负担使诊断不再便宜？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要Node>=18、匹配DSH、WSL互操作及PowerShell，Windows路径优先/mnt/c，非默认映射依赖PATH回退。README的套件最新验证是作者外链声明，本轮未核目标宿主。自定义域名会向DNS基础设施披露名字，nameserver和地址进入模型上下文可暴露内网元数据；它不改配置，但不是零网络或脱敏探针。

首次要核域名披露授权及interop；持续每host两侧查询与Windows进程，多host串行和并发工具叠加没有全局预算。没有独立付费接口不等本机/上下文成本为0，实际耗时未知。失败先确认错误类别而非照建议修改resolv.conf/mirrored networking；若人工已改配置需自备恢复记录，插件无回滚。退出停用工具不改原配置，不能当取消已发查询的证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-28](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/package.json#L14-L28)

运行/分发要求。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/*.test.js"
  },
  "files": [
    "index.js",
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
```

</details>

**依据 2 · 源码核查**：[lib/wsl-host.js:8-28](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/wsl-host.js#L8-L28)

bin与WSL条件。

<details>
<summary>查看原文（21行）</summary>

```text
const WINDOWS_BINS = {
  "powershell.exe": ["/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"],
  "cmd.exe": ["/mnt/c/Windows/System32/cmd.exe"],
  "explorer.exe": ["/mnt/c/Windows/explorer.exe"],
};

export function windowsBin(name, { exists = existsSync } = {}) {
  for (const p of WINDOWS_BINS[name] || []) {
    if (exists(p)) return p;
  }
  return name;
}

export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/dns.js:132-160](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L132-L160)

域名网络探测与多host负担。

<details>
<summary>查看原文（29行）</summary>

```text
export async function execute(args, _config = {}, deps = {}) {
  const hosts =
    Array.isArray(args?.hosts) && args.hosts.length
      ? args.hosts.map(String)
      : ["api.github.com", "registry.npmjs.org", "api.deepseek.com"];
  const resolvNameserver = (deps.readResolvNameserver || readResolvNameserver)({
    readFile: deps.readFile || readFileSync,
  });
  const resolveWslFn = deps.resolveWsl || resolveWsl;
  const resolveWinFn = deps.resolveWin || resolveWin;
  const raw = [];
  for (const host of hosts) {
    raw.push({
      host,
      wsl: await resolveWslFn(host),
      windows: await resolveWinFn(host),
    });
  }
  const results = annotateResults(raw);
  const advice = buildDnsAdvice({ resolvNameserver, results });
  const failed = results.filter((r) => r.wslEmpty);
  return {
    ok: failed.length === 0,
    resolvNameserver,
    mismatchCount: results.filter((r) => r.mismatch).length,
    results,
    advice,
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/dns.js:82-104](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L82-L104)

修改网络只是人工建议。

<details>
<summary>查看原文（23行）</summary>

```text
  if (failedWsl.length) {
    tips.push(
      `WSL failed to resolve: ${failedWsl.map((r) => r.host).join(", ")}. Check VPN/DNS; try regenerating resolv.conf or networkingMode=mirrored (wslconfig_hint).`,
    );
  }
  if (mismatches.length) {
    tips.push(
      `WSL vs Windows A records differ for: ${mismatches.map((r) => r.host).join(", ")}. Often VPN split-DNS or hijacked resolv.conf — prefer mirrored networking or fix the Windows DNS the WSL nameserver points at.`,
    );
  }
  if (winOnlyFail.length) {
    tips.push(
      `Windows resolve failed while WSL succeeded for: ${winOnlyFail.map((r) => r.host).join(", ")}. Unusual; re-check PowerShell DNS / corporate filter.`,
    );
  }
  if (resolvNameserver) {
    tips.push(`resolv.conf nameserver=${resolvNameserver} (often the Windows host IP under NAT).`);
  }
  if (!failedWsl.length && !mismatches.length) {
    tips.push("WSL resolution looks OK for probed hosts.");
  }
  tips.push("If HTTPS still fails after DNS OK, run net_doctor (NODE_USE_ENV_PROXY / proxy port).");
  tips.push("TLS errors after laptop sleep may be clock skew — run clock_doctor.");
```

</details>

#### 缺口

- 真实资源、目标宿主与内网披露策略未验。
  **影响**：成本和合规前提可能改变采用结论。
  **进一步探讨**：在允许的公共域名副本核查询/进程耗时，确认输出和模型路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用判断与下一步增量是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察，优先补错误/时间来源与总预算再用于自动诊断；允许可信单机用户看地址线索，但不以mismatch直接改DNS，也不用ok作为两侧健康。如果错误折叠、Windows失败或等待超预算，回原生DNS命令并保留原配置，先核原因。

可探索比较收据：每侧区分成功/无A/错误/未知，带API、采样时间和统一deadline，把观察差异和根因假设分离。现有空标志、地址集合和nameserver仍有用，增量不是再做一个差异标签。对CDN正常不一致、IPv6-only、PowerShell不存在与多host超时做对照，衡量误改配置率、人工确认时间和额外元数据披露。若不减少误判、只增加上下文负担或原生命令同样好，就否定；未实现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dns.js:57-72](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L57-L72)

已有空/差异标志作基线。

<details>
<summary>查看原文（16行）</summary>

```text
export function annotateResults(results = []) {
  return results.map((r) => {
    const wsl = r.wsl || [];
    const windows = r.windows || [];
    const wslEmpty = wsl.length === 0;
    const winEmpty = windows.length === 0;
    const mismatch = !wslEmpty && !winEmpty && !ipsEqual(wsl, windows);
    return {
      host: r.host,
      wsl,
      windows,
      wslEmpty,
      winEmpty,
      mismatch,
    };
  });
```

</details>

**依据 2 · 源码核查**：[lib/dns.js:108-160](https://github.com/173787247/dsh-wsl-dns/blob/5a892859d088010e15f7227d0e8027ae4778a8fa/lib/dns.js#L108-L160)

丢错/无总预算推导。

<details>
<summary>查看原文（53行）</summary>

```text
async function resolveWsl(host) {
  try {
    return await dns.resolve4(host);
  } catch {
    return [];
  }
}

async function resolveWin(host) {
  try {
    const { stdout } = await runPowerShell(
      `([System.Net.Dns]::GetHostAddresses('${host.replace(/'/g, "''")}') | Where-Object { $_.AddressFamily -eq 'InterNetwork' } | ForEach-Object { $_.IPAddressToString }) -join ','`,
      { timeoutMs: 15_000 },
    );
    return String(stdout)
      .trim()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function execute(args, _config = {}, deps = {}) {
  const hosts =
    Array.isArray(args?.hosts) && args.hosts.length
      ? args.hosts.map(String)
      : ["api.github.com", "registry.npmjs.org", "api.deepseek.com"];
  const resolvNameserver = (deps.readResolvNameserver || readResolvNameserver)({
    readFile: deps.readFile || readFileSync,
  });
  const resolveWslFn = deps.resolveWsl || resolveWsl;
  const resolveWinFn = deps.resolveWin || resolveWin;
  const raw = [];
  for (const host of hosts) {
    raw.push({
      host,
      wsl: await resolveWslFn(host),
      windows: await resolveWinFn(host),
    });
  }
  const results = annotateResults(raw);
  const advice = buildDnsAdvice({ resolvNameserver, results });
  const failed = results.filter((r) => r.wslEmpty);
  return {
    ok: failed.length === 0,
    resolvNameserver,
    mismatchCount: results.filter((r) => r.mismatch).length,
    results,
    advice,
  };
}
```

</details>

#### 缺口

- 收据尚无实现和任务对照。
  **影响**：不能计为现有可靠性收益。
  **进一步探讨**：先与错误保留的最小脚本比较，再评工具集成。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
