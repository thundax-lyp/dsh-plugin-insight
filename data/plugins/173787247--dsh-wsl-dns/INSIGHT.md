# dsh-wsl-dns

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[04d6ff1](https://github.com/173787247/dsh-wsl-dns/tree/04d6ff1aff856dd22b78c53013a9286efa0ddc35)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns)
<!-- END META -->

> **实现功能**：在WSL内比较指定域名的WSL与Windows IPv4解析集合，展示首个nameserver及差异/排查提示。

> **核心亮点**：把两侧IPv4查询、集合差异和配置片段汇成模型工具，减少手查；固定PowerShell脚本对host单引号转义。详见[Q02](#research-q02)。

> **风险与缺陷**：两侧错误折叠[]、ok只WSL非空，地址不同非劫持根因；多host串行总预算不接config/signal，直接exec与域名/内网披露需核。详见[Q03](#research-q03)。

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
  - [Q01 · 适合什么故障调查，结果不能证明什么？](#detail-section-11)
  - [Q02 · 两侧查询、差异与ok如何产生？](#detail-section-12)
  - [Q03 · 失败、超时和披露边界在哪里？](#detail-section-13)
  - [Q04 · 启动使用及三阶段成本是什么？](#detail-section-14)
  - [Q05 · 推荐与继续探讨入口是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向WSL中DSH访问DeepSeek/GitHub/npm失败、希望比较两侧IPv4解析现象的用户。dns_doctor默认查三个域名，可传hosts，读/etc/resolv.conf第一条nameserver并展示WSL/Windows地址集合和建议。不改DNS/代理配置、不访问HTTPS业务端点，不证明TLS/应用可用。

合格结果应是把每侧解析方式、时间、成功/错误/未知和地址差异说清。地址不同不是DNS劫持/VPN故障的充分证据，相同也不能证明HTTPS成功；正常CDN/时间差/解析链差异都可能形成不同观察。基线是手查两侧解析再看配置，增量统一入口与差异标签，不是自动根因诊断或修复。

手动WSL/Windows解析与配置查询；插件省入口，不证明根因/网络修复效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 双侧IPv4 | 解析集合比较 | 方法/时间不同，非完整DNS |
| nameserver | resolv首个地址 | 不是所有配置/实际查询服务器 |
| mismatch/ok | 地址差异/WSL非空 | 非根因/Windows成功/HTTPS健康 |
| 建议 | 引导继续网络/时钟排查 | 不执行修复，因果需核 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18/DSH tools/systemPrompt | 工具/提示注册 | raw注册，无精确host peer |
| WSL和Windows PowerShell互操作 | 双侧比较 | apply缓存WSL，存在不等命令可运行 |
| DNS网络与可披露域名 | A查询 | 自定义内网域名会外发到解析链 |
| resolv.conf可读 | 第一nameserver展示 | 不代表完整服务器/实际查询路由 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 核互操作/宿主注册 | 不需模型账号但依真实网络 |
| 选host | 先少量允许披露的公共域名 | 不传秘密/大量任意名 |
| 看结果 | 分别看wslEmpty/winEmpty/mismatch | ok仅WSL非空，差异非根因 |
| 后续调查 | 固定时点/解析方式再比较 | 不因标签自动改DNS/代理 |
| 失败 | 核侧错误/预算/进程 | 当前错误被折叠空，需要手核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用DNS/PowerShell/本地包 | 核WSL互操作、域名披露许可 | 工时/金额未知 |
| 持续使用 | 每host两侧查询/Windows进程、resolv读取/结果上下文 | 解释差异与确认根因 | 无独立模型调用不等总token/网络成本0，真实时延未知 |
| 失败恢复 | 重试查询/进程与重复上下文 | 查空结果原因、超时/取消与恢复配置 | 插件不写DNS配置故无自动回滚；读者若照建议改配置另计，费用工时未知 |



#### 效果

| 目标 | 实现增量 | 边界 |
| --- | --- | --- |
| 两侧现象对照 | A地址集合/差异标签 | 非同解析器/同时间/根因证明 |
| 少手查询 | 模型工具统一输出 | 错误折叠空/顶层ok含义窄 |
| 排查入口 | DNS/网络/时钟建议 | 未执行验证/修复 |

测试仅集合顺序/差异建议/nameserver/format，不能证明实际网络因果或总预算。源码副作用限读取/查询与进程，不改DNS/代理；本轮也未运行这些查询。

> **思考**：两侧错误折叠[]、ok只WSL非空，地址不同非劫持根因；多host串行总预算不接config/signal，直接exec与域名/内网披露需核。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把两侧IPv4查询、集合差异和配置片段汇成模型工具，减少手查；固定PowerShell脚本对host单引号转义。详见[Q02](#research-q02)。

把两侧IPv4查询、集合差异和配置片段汇成模型工具，减少手查；固定PowerShell脚本对host单引号转义。详见[Q02](#research-q02)。

两侧resolver都catch→[]，丢失NXDOMAIN/无A/超时/权限/PowerShell不存在/解析错等原因。第一nameserver读失败也退空且无错误。于是空集合只表示这条路径无地址，不足以认定“域名不能解析”；只有IPv6结果的主机同样不在A记录观察范围。format不输出顶层error，notWSL返回error实际读者可能只见ok=false而没有原因。

工具timeoutMs来自config默认15s，但execute传config后core形参_config未用；每Windows查询硬15s、WSL resolve4无插件显式timeout/signal，多个host串行可能超过外层预算。hosts无数量/长度/重复上限，isConcurrencySafe=true也没有全局查询预算；宿主取消信号未传，外层超时不保证DNS/Windows子进程立即停。

runPowerShell直接node execFile而非宿主subprocess/sandboxPolicy，优先固定Windows路径存在则用、否则PATH，环境继承默认。脚本对单引号转义是具体防插值措施，不应虚构任意命令注入；仍依可信二进制和宿主环境。自定义hosts会产生真实DNS查询并向解析基础设施披露名字，默认三个公共域名也有网络探测，不是零网络；输出nameserver/地址可暴露内网元数据，没脱敏。

<a id="detail-section-5"></a>

### 1.4 主要限制

两侧错误折叠[]、ok只WSL非空，地址不同非劫持根因；多host串行总预算不接config/signal，直接exec与域名/内网披露需核。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先补两侧错误/来源/时间和总预算，mismatch仅现象不作自动修DNS依据。详见[Q05](#research-q05)。

合格结果应是把每侧解析方式、时间、成功/错误/未知和地址差异说清。地址不同不是DNS劫持/VPN故障的充分证据，相同也不能证明HTTPS成功；正常CDN/时间差/解析链差异都可能形成不同观察。基线是手查两侧解析再看配置，增量统一入口与差异标签，不是自动根因诊断或修复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。双侧A集合入口明确，因果建议/失败与预算语义需先收紧。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/dns.js、lib/wsl-host.js、test/dns.test.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：三运行JS完整和包/测试设计；不执行DNS/PowerShell/目标测试或修改网络配置。
- 下一步：可继续固定正常地址不同/无A/双侧错误/取消mock核错误建议、deadline与披露，不做真实网络外发。

**分析版本**

- **仓库**：[173787247/dsh-wsl-dns](https://github.com/173787247/dsh-wsl-dns)
- **版本号**：0.2.0（[固定提交 04d6ff1](https://github.com/173787247/dsh-wsl-dns/tree/04d6ff1aff856dd22b78c53013a9286efa0ddc35)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索带解析来源/时点/错误与统一deadline的比较收据，分开观察/一致/诊断，比较误诊与额外披露/等待；未实现。详见[Q05](#research-q05)。

可继续固定正常地址不同/无A/双侧错误/取消mock核错误建议、deadline与披露，不做真实网络外发。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 95 | — | — | 546 |
| .js | source | 3 | 261 | 234 | 2 | — |
| .js | test | 1 | 65 | 59 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+created%3A2026-09-22T09%3A31%3A39.457Z..2026-10-22T09%3A31%3A39.457Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A31%3A39.457Z..2026-10-22T09%3A31%3A39.457Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核双侧DNS观察/根因区别、错误/IPv4范围、网络披露与总预算/进程治理、成本与采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么故障调查，结果不能证明什么？

**研究主题**：场景与需求

#### 完整回答

面向WSL中DSH访问DeepSeek/GitHub/npm失败、希望比较两侧IPv4解析现象的用户。dns_doctor默认查三个域名，可传hosts，读/etc/resolv.conf第一条nameserver并展示WSL/Windows地址集合和建议。不改DNS/代理配置、不访问HTTPS业务端点，不证明TLS/应用可用。

合格结果应是把每侧解析方式、时间、成功/错误/未知和地址差异说清。地址不同不是DNS劫持/VPN故障的充分证据，相同也不能证明HTTPS成功；正常CDN/时间差/解析链差异都可能形成不同观察。基线是手查两侧解析再看配置，增量统一入口与差异标签，不是自动根因诊断或修复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-29](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/README.md#L17-L29)

作者比较/不改代理定位。

<details>
<summary>查看原文（13行）</summary>

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

**依据 2 · 源码核查**：[lib/dns.js:132-158](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L132-L158)

实际默认域名/结果。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 两侧查询、差异与ok如何产生？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

WSL侧dns.resolve4，Windows侧PowerShell调用System.Net.Dns.GetHostAddresses并滤InterNetwork，host单引号双写后嵌单引号串，固定PowerShell argv无用户命令拼接。两个不同API/缓存链和先后时点不是受控同解析器比较；代码未保TTL、CNAME、服务器/响应来源和时间。

按hosts顺序先await WSL再await Windows，收集后sorted unique地址集合相等比较；只有两侧非空且不同才mismatch。wslEmpty/winEmpty保结构，但ok仅看WSL是否空，Windows全失败甚至mismatch仍可ok=true。不能把顶层ok当两侧一致或网络健康。

建议把不一致解释为often split-DNS/hijacked resolv.conf并倾向mirrored/改DNS，但实现没有验证这些因果；应当后续排查假设。贡献为成熟查询/集合比较和模型内提示，不是新DNS测量/根因算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dns.js:50-71](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L50-L71)

集合/mismatch。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/dns.js:75-104](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L75-L104)

建议的因果范围。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/dns.js:108-128](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L108-L128)

两侧API/转义。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/dns.js:143-158](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L143-L158)

串行与ok定义。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/wsl-host.js:34-40](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/wsl-host.js#L34-L40)

固定argv/输出预算。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败、超时和披露边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

两侧resolver都catch→[]，丢失NXDOMAIN/无A/超时/权限/PowerShell不存在/解析错等原因。第一nameserver读失败也退空且无错误。于是空集合只表示这条路径无地址，不足以认定“域名不能解析”；只有IPv6结果的主机同样不在A记录观察范围。format不输出顶层error，notWSL返回error实际读者可能只见ok=false而没有原因。

工具timeoutMs来自config默认15s，但execute传config后core形参_config未用；每Windows查询硬15s、WSL resolve4无插件显式timeout/signal，多个host串行可能超过外层预算。hosts无数量/长度/重复上限，isConcurrencySafe=true也没有全局查询预算；宿主取消信号未传，外层超时不保证DNS/Windows子进程立即停。

runPowerShell直接node execFile而非宿主subprocess/sandboxPolicy，优先固定Windows路径存在则用、否则PATH，环境继承默认。脚本对单引号转义是具体防插值措施，不应虚构任意命令注入；仍依可信二进制和宿主环境。自定义hosts会产生真实DNS查询并向解析基础设施披露名字，默认三个公共域名也有网络探测，不是零网络；输出nameserver/地址可暴露内网元数据，没脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dns.js:41-46](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L41-L46)

nameserver失败空。

```text
export function readResolvNameserver({ readFile = readFileSync } = {}) {
  try {
    const m = readFile("/etc/resolv.conf", "utf8").match(/^nameserver\s+(\S+)/m);
    return m ? m[1] : "";
  } catch {
    return "";
```

**依据 2 · 源码核查**：[lib/dns.js:108-128](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L108-L128)

失败均空。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/dns.js:132-148](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L132-L148)

无限host/串行/config未用。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[index.js:26-30](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/index.js#L26-L30)

外预算与无exec signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

**依据 5 · 源码核查**：[lib/wsl-host.js:8-18](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/wsl-host.js#L8-L18)

二进制回退。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[lib/wsl-host.js:34-40](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/wsl-host.js#L34-L40)

直接exec。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
```

**依据 7 · 源码核查**：[lib/dns.js:27-37](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L27-L37)

format不显error。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

#### 缺口

- 慢/失败解析、IPv6-only与取消后的实际查询/进程状态未受控对照。
  **影响**：不能保证完整错误归因或总15秒/即时取消。
  **进一步探讨**：mock每侧错误类型/延迟/取消与大hosts数组，核总预算和partial/error，不做真实DNS外发。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动使用及三阶段成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18/DSH tools/systemPrompt | 工具/提示注册 | raw注册，无精确host peer |
| WSL和Windows PowerShell互操作 | 双侧比较 | apply缓存WSL，存在不等命令可运行 |
| DNS网络与可披露域名 | A查询 | 自定义内网域名会外发到解析链 |
| resolv.conf可读 | 第一nameserver展示 | 不代表完整服务器/实际查询路由 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 核互操作/宿主注册 | 不需模型账号但依真实网络 |
| 选host | 先少量允许披露的公共域名 | 不传秘密/大量任意名 |
| 看结果 | 分别看wslEmpty/winEmpty/mismatch | ok仅WSL非空，差异非根因 |
| 后续调查 | 固定时点/解析方式再比较 | 不因标签自动改DNS/代理 |
| 失败 | 核侧错误/预算/进程 | 当前错误被折叠空，需要手核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用DNS/PowerShell/本地包 | 核WSL互操作、域名披露许可 | 工时/金额未知 |
| 持续使用 | 每host两侧查询/Windows进程、resolv读取/结果上下文 | 解释差异与确认根因 | 无独立模型调用不等总token/网络成本0，真实时延未知 |
| 失败恢复 | 重试查询/进程与重复上下文 | 查空结果原因、超时/取消与恢复配置 | 插件不写DNS配置故无自动回滚；读者若照建议改配置另计，费用工时未知 |

#### 效果

| 目标 | 实现增量 | 边界 |
| --- | --- | --- |
| 两侧现象对照 | A地址集合/差异标签 | 非同解析器/同时间/根因证明 |
| 少手查询 | 模型工具统一输出 | 错误折叠空/顶层ok含义窄 |
| 排查入口 | DNS/网络/时钟建议 | 未执行验证/修复 |

测试仅集合顺序/差异建议/nameserver/format，不能证明实际网络因果或总预算。源码副作用限读取/查询与进程，不改DNS/代理；本轮也未运行这些查询。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-22](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/package.json#L14-L22)

Node/包。

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
```

**依据 2 · 源码核查**：[test/dns.test.js:11-22](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/test/dns.test.js#L11-L22)

作者集合测试。

<details>
<summary>查看原文（12行）</summary>

```text
describe("ipsEqual / annotateResults", () => {
  it("detects mismatch ignoring order", () => {
    assert.equal(ipsEqual(["1.1.1.1", "8.8.8.8"], ["8.8.8.8", "1.1.1.1"]), true);
    assert.equal(ipsEqual(["1.1.1.1"], ["8.8.8.8"]), false);
  });

  it("flags mismatch when both sides non-empty and differ", () => {
    const [r] = annotateResults([
      { host: "api.deepseek.com", wsl: ["1.1.1.1"], windows: ["8.8.8.8"] },
    ]);
    assert.equal(r.mismatch, true);
  });
```

</details>

**依据 3 · 源码核查**：[test/dns.test.js:25-49](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/test/dns.test.js#L25-L49)

作者建议/文件解析测试。

<details>
<summary>查看原文（25行）</summary>

```text
describe("buildDnsAdvice", () => {
  it("mentions mismatch and net_doctor", () => {
    const tips = buildDnsAdvice({
      resolvNameserver: "172.20.1.1",
      results: annotateResults([
        { host: "api.deepseek.com", wsl: ["1.1.1.1"], windows: ["8.8.8.8"] },
      ]),
    });
    assert.ok(tips.some((t) => /differ/i.test(t)));
    assert.ok(tips.some((t) => /net_doctor/i.test(t)));
  });

  it("mentions WSL resolve failure", () => {
    const tips = buildDnsAdvice({
      results: annotateResults([{ host: "x.com", wsl: [], windows: ["1.1.1.1"] }]),
    });
    assert.ok(tips.some((t) => /failed to resolve/i.test(t)));
  });
});

describe("readResolvNameserver", () => {
  it("parses nameserver line", () => {
    assert.equal(
      readResolvNameserver({ readFile: () => "nameserver 172.20.64.1\n" }),
      "172.20.64.1",
```

</details>

**依据 4 · 源码核查**：[lib/dns.js:143-158](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L143-L158)

资源/结果。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

#### 缺口

- 与手动两侧查询相比的正确归因率、排障时间及总资源成本无对照。
  **影响**：不能量化修复成功/省时。
  **进一步探讨**：固定mock DNS场景含正常不同地址，人工标根因与未知，比较错误建议/查证步骤，不改真实网络。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐与继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

观察。两侧查询入口有价值，集合比较和单引号转义清楚；但错误丢失、总预算脱节和将地址差异偏向劫持/配置问题的建议容易促成错误操作。先补每侧结构错误/时间/解析方式与保守建议，再小范围试用；不据当前mismatch自动改DNS/代理。

从“差异只是观察却被解释成根因”和“多查询无总deadline”推导“来源/时点/错误分层的比较收据”。每侧保方法、服务器可知范围、A/AAAA/CNAME/TTL（可得才填）、开始结束/错误，统一总预算与signal，局部未完成标unknown；顶层区分collected/consistent/diagnosed。建议只列可检验假设，明确CDN/顺序差异反例而不先给修配置结论。

未实现。最小对照含正常CDN不同、两侧不同解析链、NXDOMAIN/无A/IPv6-only、PowerShell失败、串行超预算/取消、Windows失败但WSL成功。若仍把非空差异诊为劫持、失败都空或总预算后仍宣完成，核心假设被反证；若额外记录泄露内网名字/增加等待却不降误诊，净收益不成立。度量错误建议与人工确认时间，不只比mismatch识别率。

#### 证据与依据

**依据 1 · 源码核查**：[lib/dns.js:75-104](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L75-L104)

因果建议基线。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/dns.js:108-128](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L108-L128)

错误收据基线。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/dns.js:132-158](https://github.com/173787247/dsh-wsl-dns/blob/04d6ff1aff856dd22b78c53013a9286efa0ddc35/lib/dns.js#L132-L158)

预算/分层状态基线。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

#### 缺口

- 结构比较收据/统一预算/保守因果提示方案未实现。
  **影响**：不计现有诊断准确或治理优势。
  **进一步探讨**：固定mock场景比较误诊/错误可见/等待与披露，无真实查询/配置变更。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
