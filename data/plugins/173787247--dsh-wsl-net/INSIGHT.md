# dsh-wsl-net

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[34fe43a](https://github.com/173787247/dsh-wsl-net/tree/34fe43ad0d3146d7a93265af142c9288e5c1d690)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-net)
<!-- END META -->

> **功能**：为 WSL 中的 DeepSeek Harness 诊断代理环境、宿主进程、端口监听与 HTTPS 可达性，并生成修复建议。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将进程差异、代理监听与HTTP响应组织成Agent可读报告，减少线索拼接。价值仍取决于PID正确和对探测语义的理解，未测节时。

> **主要限制**：[Q02](#research-q02) HTTP<500只是收到响应，不能证明业务成功；修复脚本会插入未脱敏代理值，默认共享subprocess包装没有显式还原路径。带凭据代理和共享宿主不适合直接采用。

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
  - [Q01 · 谁用诊断工具，相对手工排查增加什么？](#detail-section-11)
  - [Q02 · 报告与代理注入怎样实际接线，失败如何判断？](#detail-section-12)
  - [Q03 · 依赖、成本与退出能否支持试用？](#detail-section-13)
  - [Q04 · 如何避免把探测成功当业务成功？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL维护者可把工具进程、宿主进程、代理监听和HTTP响应集中查看，辅助排查Windows能联网而Agent失败。

[Q01](#research-q01) 相对手工查看env、PID、TCP和HTTP，主要增量是诊断归集与交接；不替代实际业务请求验证，也不等于外部kit所有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| net_doctor | 获取进程/代理/HTTP排障线索 | PID与状态须人工判读，非业务验收 |
| 修复建议脚本 | 交接环境修复步骤 | 不自动执行；原始代理可能进入输出 |
| 子进程代理包装 | 补代理别名和Node开关 | 默认开启，调用者env可覆盖；停用后需核对并重启 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/systemPrompt/subprocess | 加载必需 | 工具与代理包装 | 服务不满足不能按本链工作 |
| 兼容Node版本 | 必需 | fetch/AbortSignal等API | manifest>=18不证明全部小版本兼容 |
| /proc与pgrep权限 | 宿主env检查必需 | 找PID并读环境 | 返回缺失/错误，不代表无故障 |
| 正确代理与端口 | 代理路径必需 | 子进程路由和TCP探测 | open也不证明服务成功 |
| 无凭据测试环境 | 本研究试用条件 | 避免秘密进入脚本输出 | 带凭据环境暂缓采用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者确认PID、Node和无凭据代理，关闭injectChildProxy | 独立测试宿主；本轮未安装 |
| 诊断 | Agent选择target调用net_doctor | 分读env/TCP/HTTP，核对宿主身份 |
| 修复 | 人工审查脚本与本机路径后自行执行 | 本工具未自动修复；不可复制秘密到聊天 |
| 验收 | 维护者运行原业务的只读检查 | HTTP响应不替代业务结果 |
| 退出 | 停用配置，曾注入则重启宿主 | 核对原子进程环境后回手工诊断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 现有WSL/DSH与代理 | 版本、PID、配置和脚本审阅 | 金额与工时未知 |
| 持续使用 | 串行HTTP/TCP探测和报告上下文 | 判读层次、去敏与验证 | 未测相对手工节时 |
| 失败恢复 | 宿主重启和原环境 | 撤回错误代理，对账子进程行为 | 热禁用未见还原接线，恢复率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定位线索 | 分列工具/宿主env与监听 | 最新PID是否属于当前宿主 |
| HTTP响应 | <500判为可达 | 认证、下载和实际业务成功 |
| 修复交接 | 返回建议和脚本 | 脚本安全性、路径适用与恢复收益 |

> **思考**：[Q02](#research-q02) HTTP<500只是收到响应，不能证明业务成功；修复脚本会插入未脱敏代理值，默认共享subprocess包装没有显式还原路径。带凭据代理和共享宿主不适合直接采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将进程差异、代理监听与HTTP响应组织成Agent可读报告，减少线索拼接。价值仍取决于PID正确和对探测语义的理解，未测节时。

[Q02](#research-q02) 诊断函数与入口分离，spec.env覆盖默认代理且显式0保留，便于定向复用；脱敏未覆盖修复脚本，包装未接还原生命周期，移植前应先解决这两项。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) HTTP<500只是收到响应，不能证明业务成功；修复脚本会插入未脱敏代理值，默认共享subprocess包装没有显式还原路径。带凭据代理和共享宿主不适合直接采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 个人无凭据测试环境先关闭注入并核对PID，只把报告作为排障线索。发现脚本秘密或身份不明便停用；曾开启包装时重启宿主再核对原环境，不自动执行fix。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查工具注册、完整诊断/修复与包装路径；确认源码存在凭据进入脚本的路径，未用真实凭据运行复现。兼容与效果未知，未来设计分开。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/net.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查index.js、lib/net.js、README和package的固定版本；未运行任何网络诊断、目标测试、fix脚本或外部kit，不将作者Node描述当全版本验证。
- 下一步：按[Q04](#research-q04)在隔离环境用无敏感合成值比较分层判读、脚本回显与注入退出，计定位/恢复与总工时；若误诊或残留不降则否定。本轮未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-net](https://github.com/173787247/dsh-wsl-net)
- **版本号**：0.5.2（[固定提交 34fe43a](https://github.com/173787247/dsh-wsl-net/tree/34fe43ad0d3146d7a93265af142c9288e5c1d690)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可研究分层结果、只引用变量的无凭据修复计划和可还原注入，用固定故障比较误诊、回显及恢复成本；目前未实现或验证。

按[Q04](#research-q04)在隔离环境用无敏感合成值比较分层判读、脚本回显与注入退出，计定位/恢复与总工时；若误诊或残留不降则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 234 | — | — | 1564 |
| .js | source | 2 | 668 | 614 | 26 | — |
| .js | test | 1 | 260 | 238 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL诊断如何定位网络层次，代理注入与修复输出何时妨碍采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用诊断工具，相对手工排查增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WSL上的DSH维护者遇到Windows浏览器能访问而Agent/API/npm失败时，可以用net_doctor归集故障线索。合格结果是定位究竟为当前工具进程、宿主进程、代理监听还是HTTP响应问题，并据此验证一项安全修复；不是仅看到绿色ok。手工基线是分开查看环境、找PID、测试TCP和HTTP，插件把这些输出与建议组成一次可供Agent阅读的报告，减少手工拼接。它并非通用网页获取器，README明确不修复进程内web_fetch；外部kit脚本和环境配置能力不能全部归于本插件。

适用人群是已有WSL/代理维护能力者。对不使用代理、没有Linux/proc或有多个DSH宿主的环境，部分线索可能不适用。作者围绕Node24环境变量解释动机，这是固定版本的声明，不是本轮对所有Node小版本和代理类型的兼容验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/README.md#L5-L13)

作者限定WSL诊断用途，与进程内fetch分开。

```text
DeepSeek Harness **tool** plugin: `net_doctor` diagnoses why HTTPS works in the Windows browser but fails from the WSL agent—and returns **copy-paste fix scripts**.

Pairs with [dsh-wsl-env](https://github.com/173787247/dsh-wsl-env). Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Diagnoses why the Windows browser can reach HTTPS while the WSL agent cannot. In-process page fetch is dsh-wsl-fetch, not this plugin.
```

**依据 2 · 作者声明**：[README.md:37-50](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/README.md#L37-L50)

作者解释当前/宿主/监听/HTTP各层以及工具范围。

<details>
<summary>查看原文（14行）</summary>

```text
**Scope:** diagnoses proxy / Node 24 / DeepSeek+npm reachability for the agent process and child shells. It does **not** fix in-process `web_fetch` (use [dsh-wsl-fetch](https://github.com/173787247/dsh-wsl-fetch)). Prefer kit `restart-dsh-web.sh` so the **dsh main process** gets `NODE_USE_ENV_PROXY=1` and loopback-only `NO_PROXY`.

## Why

Clash / V2Ray often runs on Windows with `HTTP_PROXY=http://127.0.0.1:…`. Node **24** `fetch` ignores proxy env vars unless `NODE_USE_ENV_PROXY=1`. The browser can look fine while the agent cannot reach DeepSeek or npm.

## What it does

- Reports `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` / `NO_PROXY` (userinfo redacted), `NODE_USE_ENV_PROXY`, optional npm registry
- Also inspects the **running `dsh web` process** env (`dshWeb`) so you can tell tool-process vs host-process proxy flags apart
- TCP-probes the configured proxy port (`proxyListen`)
- Probes DeepSeek API and the npm registry (HTTP status &lt; 500 counts as reachable, including 401)
- Returns `advice` plus `fix.steps` / `fix.scripts` (reuses current proxy when set; otherwise a `127.0.0.1:7890` template you must edit)
- Optionally injects `NODE_USE_ENV_PROXY=1` and lowercase `http_proxy` aliases into bash/npm **child** processes (`injectChildProxy`)
```

</details>

**依据 3 · 源码核查**：[index.js:128-151](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L128-L151)

报告真实聚合当前env、HTTP探测、监听和宿主env。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args, exec) {
      const target = typeof args?.target === "string" ? args.target : "all";
      const allowed = new Set(["all", "env", "deepseek", "npm", "registry", "modelscope", "huggingface"]);
      const selected = allowed.has(target) ? target : "all";
      const env = readEnv();
      const probes = [];
      if (selected === "all" || selected === "deepseek") {
        probes.push(await probe("deepseek", "https://api.deepseek.com/", exec.signal, probeTimeoutMs));
      }
      for (const spec of registryProbeList(env, selected)) {
        probes.push(await probe(spec.name, spec.url, exec.signal, probeTimeoutMs));
      }
      const proxyListen = await probeProxyListen(env, { timeoutMs: Math.min(probeTimeoutMs, 2000) });
      const dshWeb = inspectDshWebEnv();
      const dshWebOut = dshWeb.env
        ? { ok: dshWeb.ok, pid: dshWeb.pid, error: dshWeb.error || "", env: redactEnv(dshWeb.env) }
        : { ok: dshWeb.ok, pid: dshWeb.pid, error: dshWeb.error || "", env: null };
      return {
        advice: buildAdvice(env, probes, selected, injectChildProxy, proxyListen, dshWeb),
        fix: buildFix(env, probes, injectChildProxy),
        env: redactEnv(env),
        probes,
        proxyListen,
        dshWeb: dshWebOut,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 报告与代理注入怎样实际接线，失败如何判断？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

apply注册net_doctor并提供系统提示；execute按target串行HTTP探测，再检查代理TCP和最新匹配dsh web PID的/proc环境。宿主PID由pgrep -n -f模式选取，未与当前会话建立强绑定，多个宿主时可能选错。HTTP探测把0<status<500标为ok，包含401/403/404以及手工重定向返回；它证明收到某类响应而非认证成功、下载成功或业务办结，500也不能直接等同网络不通。TCP open仅证明端口接受连接。

默认injectChildProxy=true会直接包装共享subprocess.spawn/spawnTerminal，向子进程补代理大小写别名和NODE_USE_ENV_PROXY；spec.env后覆盖新增值，调用者仍可指定自己的值，且显式0被保留。Symbol避免重复包装，但源码没有恢复original或dispose接线，禁用后不能推断旧共享服务立刻恢复。

环境字段对代理userinfo做脱敏，这是已实现保护；但execute把原始env交给buildFix，后者把原代理写入shell脚本，formatReport逐行输出script.code而未再次脱敏。有userinfo凭据的代理因此存在被带入工具返回/聊天的源码确认路径，未在本轮用真实凭据复现。脚本还含特定kit位置和示例端口，不能无检查直接执行。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:16-39](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L16-L39)

默认注入及工具注册。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const probeTimeoutMs = positive(config.probeTimeoutMs, 5_000);
  const injectChildProxy = config.injectChildProxy !== false;

  if (injectChildProxy) {
    installChildProxy(ctx.subprocess);
    console.log("[dsh-wsl-net] injecting NODE_USE_ENV_PROXY into subprocess env");
  }

  ctx.systemPrompt.section({
    name: "tool:net_doctor",
    order: 116,
    text: [
      "Use the net_doctor tool when DeepSeek API, Search, npm, ModelScope, or other HTTPS calls fail from this agent (TypeError: fetch failed is common).",
      "The browser on Windows can work while WSL Node fetch does not: Node 24 ignores HTTP_PROXY unless NODE_USE_ENV_PROXY=1.",
      injectChildProxy
        ? "This plugin also sets NODE_USE_ENV_PROXY=1 (and lowercase http_proxy aliases) on bash/npm child processes."
        : "Child bash/npm processes may still need NODE_USE_ENV_PROXY=1 even when this dsh process has it.",
      "Prefer dsh-wsl-kit scripts/restart-dsh-web.sh after fixing proxy. Do not guess proxy URLs; read advice and fix.scripts.",
    ].join(" "),
  });

  ctx.tools.register({
```

</details>

**依据 2 · 源码核查**：[index.js:128-151](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L128-L151)

原始env进入buildFix，报告env另脱敏。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args, exec) {
      const target = typeof args?.target === "string" ? args.target : "all";
      const allowed = new Set(["all", "env", "deepseek", "npm", "registry", "modelscope", "huggingface"]);
      const selected = allowed.has(target) ? target : "all";
      const env = readEnv();
      const probes = [];
      if (selected === "all" || selected === "deepseek") {
        probes.push(await probe("deepseek", "https://api.deepseek.com/", exec.signal, probeTimeoutMs));
      }
      for (const spec of registryProbeList(env, selected)) {
        probes.push(await probe(spec.name, spec.url, exec.signal, probeTimeoutMs));
      }
      const proxyListen = await probeProxyListen(env, { timeoutMs: Math.min(probeTimeoutMs, 2000) });
      const dshWeb = inspectDshWebEnv();
      const dshWebOut = dshWeb.env
        ? { ok: dshWeb.ok, pid: dshWeb.pid, error: dshWeb.error || "", env: redactEnv(dshWeb.env) }
        : { ok: dshWeb.ok, pid: dshWeb.pid, error: dshWeb.error || "", env: null };
      return {
        advice: buildAdvice(env, probes, selected, injectChildProxy, proxyListen, dshWeb),
        fix: buildFix(env, probes, injectChildProxy),
        env: redactEnv(env),
        probes,
        proxyListen,
        dshWeb: dshWebOut,
```

</details>

**依据 3 · 源码核查**：[index.js:163-177](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L163-L177)

共享subprocess包装且无还原路径。

<details>
<summary>查看原文（15行）</summary>

```text
const PATCHED = Symbol.for("dsh-wsl-net.subprocess-patched");

function installChildProxy(subprocess) {
  if (subprocess[PATCHED]) return;
  subprocess[PATCHED] = true;
  wrapSpawn(subprocess, "spawn");
  wrapSpawn(subprocess, "spawnTerminal");
}

function wrapSpawn(subprocess, method) {
  const original = subprocess[method];
  if (typeof original !== "function") return;
  subprocess[method] = function patchedSpawn(spec, ...rest) {
    return original.call(this, withChildProxyEnv(spec), ...rest);
  };
```

</details>

**依据 4 · 源码核查**：[index.js:185-212](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L185-L212)

HTTP状态规则和异常报告。

<details>
<summary>查看原文（28行）</summary>

```text
async function probe(name, url, callerSignal, probeTimeoutMs) {
  const started = Date.now();
  try {
    const signal = AbortSignal.any([
      callerSignal,
      AbortSignal.timeout(probeTimeoutMs),
    ]);
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal,
    });
    return {
      name,
      url,
      ok: res.status > 0 && res.status < 500,
      status: res.status,
      ms: Date.now() - started,
    };
  } catch (err) {
    const error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return {
      name,
      url,
      ok: false,
      error,
      ms: Date.now() - started,
    };
```

</details>

**依据 5 · 源码核查**：[lib/net.js:46-80](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L46-L80)

子环境默认值与调用者覆盖顺序。

<details>
<summary>查看原文（35行）</summary>

```text
export function childProxyEnv(env = process.env) {
  const extra = {};
  const http = env.HTTP_PROXY || env.http_proxy;
  const https = env.HTTPS_PROXY || env.https_proxy;
  const noProxy = env.NO_PROXY || env.no_proxy;
  const all = env.ALL_PROXY || env.all_proxy;
  if (http) {
    extra.HTTP_PROXY = http;
    extra.http_proxy = http;
  }
  if (https) {
    extra.HTTPS_PROXY = https;
    extra.https_proxy = https;
  }
  if (noProxy) {
    extra.NO_PROXY = noProxy;
    extra.no_proxy = noProxy;
  }
  if (all) {
    extra.ALL_PROXY = all;
    extra.all_proxy = all;
  }
  extra.NODE_USE_ENV_PROXY = env.NODE_USE_ENV_PROXY === "0" ? "0" : "1";
  return extra;
}

export function withChildProxyEnv(spec, env = process.env) {
  if (!spec || typeof spec !== "object") return spec;
  return {
    ...spec,
    env: {
      ...childProxyEnv(env),
      ...spec.env,
    },
  };
```

</details>

**依据 6 · 源码核查**：[lib/net.js:154-175](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L154-L175)

最新匹配PID而非当前会话绑定。

<details>
<summary>查看原文（22行）</summary>

```text
/** Find newest `dsh web` node pid via injectable pgrepFn(stdout lines). */
export function findDshWebPid({ pgrepFn } = {}) {
  try {
    const out =
      typeof pgrepFn === "function"
        ? String(pgrepFn() || "")
        : execFileSync("pgrep", ["-n", "-f", "node.*/dsh web"], {
            encoding: "utf8",
            timeout: 3000,
          });
    const line = String(out).trim().split(/\r?\n/).map((s) => s.trim()).find(Boolean);
    const pid = Number(line);
    return Number.isFinite(pid) && pid > 0 ? pid : 0;
  } catch {
    return 0;
  }
}

export function inspectDshWebEnv(deps = {}) {
  const pid = deps.pid ?? findDshWebPid(deps);
  if (!pid) return { ok: false, pid: 0, error: "dsh_web_not_found", env: null };
  return readProcEnv(pid, deps);
```

</details>

**依据 7 · 源码核查**：[lib/net.js:330-350](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L330-L350)

修复脚本插入原始代理值及固定位置。

<details>
<summary>查看原文（21行）</summary>

```text
export function buildFix(env, probes, injectChildProxy) {
  const steps = [];
  const scripts = [];
  const failed = probes.filter((p) => !p.ok);
  const proxyUrl = env.HTTP_PROXY || env.HTTPS_PROXY || env.ALL_PROXY || "";

  if (proxyOn(env) && !proxyHonored(env)) {
    steps.push(
      "Restart the dsh process with NODE_USE_ENV_PROXY=1 so Node 24 fetch (DeepSeek Search / API) honors HTTP(S)_PROXY.",
    );
    scripts.push({
      title: "restart-dsh-with-node-proxy",
      shell: "bash",
      code: [
        `export HTTP_PROXY=${shellQuote(proxyUrl)}`,
        `export HTTPS_PROXY=${shellQuote(env.HTTPS_PROXY || proxyUrl)}`,
        "export NODE_USE_ENV_PROXY=1",
        "# Preferred: kit script also starts the :3081 relay",
        "bash /mnt/c/Users/$USER/Desktop/AIFullStackDevelopment/dsh-wsl-kit/scripts/restart-dsh-web.sh",
        "# Or: dsh web --no-open --port 3080",
      ].join("\n"),
```

</details>

**依据 8 · 源码核查**：[lib/net.js:405-416](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L405-L416)

修复脚本直接输出，未再做URL脱敏。

<details>
<summary>查看原文（12行）</summary>

```text
  const fix = value.fix || { steps: [], scripts: [] };
  const fixLines = [
    "fix:",
    ...fix.steps.map((s) => `  - ${s}`),
  ];
  if (fix.scripts.length > 0) {
    fixLines.push("  scripts:");
    for (const script of fix.scripts) {
      fixLines.push(`    # ${script.title} (${script.shell})`);
      for (const line of String(script.code).split("\n")) {
        fixLines.push(`    ${line}`);
      }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、成本与退出能否支持试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

只建议熟悉个人WSL环境、使用无凭据代理且能隔离测试宿主的维护者，先以injectChildProxy=false试读诊断；不把它用于共享凭据环境或自动执行修复。依赖DSH的tools/systemPrompt/subprocess服务；宿主环境读取另需Linux/proc访问和pgrep，读取失败只返回缺失原因。package声明Node>=18，但实现使用AbortSignal.any等API与特定代理行为，本次未核各小版本，不能从engines宣称全范围兼容。

首次要确认实际PID、代理端口和配置；持续调用包含串行网络探测和报告上下文成本。未测费用、延迟、定位正确率和相对手工节时。无凭据条件和关闭注入把试用限制为可检查的诊断，但不消除报告中的私有地址/路径信息，分享前仍需复核。停止时移除插件配置；若曾开启注入，应重启受影响宿主恢复原服务对象，并核对原代理环境，再使用原手工排查。若无法确认PID、报告把认证错误当业务成功、修复脚本出现凭据或默认注入改变了任务行为，就停止使用而不是继续试修。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-23](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L13-L23)

服务前提与可关闭默认注入。

<details>
<summary>查看原文（11行）</summary>

```text
export const name = "dsh-wsl-net";
export const inject = ["tools", "systemPrompt", "subprocess"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const probeTimeoutMs = positive(config.probeTimeoutMs, 5_000);
  const injectChildProxy = config.injectChildProxy !== false;

  if (injectChildProxy) {
    installChildProxy(ctx.subprocess);
    console.log("[dsh-wsl-net] injecting NODE_USE_ENV_PROXY into subprocess env");
```

</details>

**依据 2 · 源码核查**：[lib/net.js:137-175](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L137-L175)

/proc/pgrep依赖与失败结果。

<details>
<summary>查看原文（39行）</summary>

```text
export function readProcEnv(pid, { readFileSyncFn = readFileSync, keys = PROXY_ENV_KEYS } = {}) {
  const n = Number(pid);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, pid: 0, error: "invalid_pid", env: null };
  try {
    const raw = readFileSyncFn(`/proc/${n}/environ`);
    const parsed = parseProcEnviron(raw, keys);
    return { ok: true, pid: n, error: "", env: readEnv(parsed) };
  } catch (err) {
    return {
      ok: false,
      pid: n,
      error: err instanceof Error ? err.message : String(err),
      env: null,
    };
  }
}

/** Find newest `dsh web` node pid via injectable pgrepFn(stdout lines). */
export function findDshWebPid({ pgrepFn } = {}) {
  try {
    const out =
      typeof pgrepFn === "function"
        ? String(pgrepFn() || "")
        : execFileSync("pgrep", ["-n", "-f", "node.*/dsh web"], {
            encoding: "utf8",
            timeout: 3000,
          });
    const line = String(out).trim().split(/\r?\n/).map((s) => s.trim()).find(Boolean);
    const pid = Number(line);
    return Number.isFinite(pid) && pid > 0 ? pid : 0;
  } catch {
    return 0;
  }
}

export function inspectDshWebEnv(deps = {}) {
  const pid = deps.pid ?? findDshWebPid(deps);
  if (!pid) return { ok: false, pid: 0, error: "dsh_web_not_found", env: null };
  return readProcEnv(pid, deps);
```

</details>

**依据 3 · 源码核查**：[package.json:14-20](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/package.json#L14-L20)

Node声明仅为清单条件，不是本次兼容验收。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/net.test.js"
```

**依据 4 · 源码核查**：[index.js:185-200](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L185-L200)

实际使用AbortSignal.any与timeout。

<details>
<summary>查看原文（16行）</summary>

```text
async function probe(name, url, callerSignal, probeTimeoutMs) {
  const started = Date.now();
  try {
    const signal = AbortSignal.any([
      callerSignal,
      AbortSignal.timeout(probeTimeoutMs),
    ]);
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal,
    });
    return {
      name,
      url,
      ok: res.status > 0 && res.status < 500,
```

</details>

**依据 5 · 源码核查**：[lib/net.js:330-350](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L330-L350)

凭据与固定路径使修复需人工核查。

<details>
<summary>查看原文（21行）</summary>

```text
export function buildFix(env, probes, injectChildProxy) {
  const steps = [];
  const scripts = [];
  const failed = probes.filter((p) => !p.ok);
  const proxyUrl = env.HTTP_PROXY || env.HTTPS_PROXY || env.ALL_PROXY || "";

  if (proxyOn(env) && !proxyHonored(env)) {
    steps.push(
      "Restart the dsh process with NODE_USE_ENV_PROXY=1 so Node 24 fetch (DeepSeek Search / API) honors HTTP(S)_PROXY.",
    );
    scripts.push({
      title: "restart-dsh-with-node-proxy",
      shell: "bash",
      code: [
        `export HTTP_PROXY=${shellQuote(proxyUrl)}`,
        `export HTTPS_PROXY=${shellQuote(env.HTTPS_PROXY || proxyUrl)}`,
        "export NODE_USE_ENV_PROXY=1",
        "# Preferred: kit script also starts the :3081 relay",
        "bash /mnt/c/Users/$USER/Desktop/AIFullStackDevelopment/dsh-wsl-kit/scripts/restart-dsh-web.sh",
        "# Or: dsh web --no-open --port 3080",
      ].join("\n"),
```

</details>

#### 缺口

- 没有真实宿主小版本、代理类型和禁用后服务恢复验证。
  **影响**：不能承诺广泛兼容或热禁用立即还原。
  **进一步探讨**：在独立测试宿主核对版本、进程身份、禁用/重启前后子环境与实际任务。
- 没有同故障手工诊断的成功率、时长与恢复成本。
  **影响**：无法量化节时或单位任务成本。
  **进一步探讨**：用无敏感值的固定故障集比较定位和恢复，全计失败尝试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何避免把探测成功当业务成功？

**研究主题**：新假设与验证

#### 完整回答

本插件已经把env、proxyListen和probes分列，不能声称缺少分层信息；可推导的改进假设是把易误读的ok进一步明确为传输响应、认证/服务状态和用户指定只读业务检查三层，并让修复计划只引用本地变量名而不回显代理凭据，再为注入保留可恢复生命周期。增量在于将已有诊断线索转成不夸大结果且可撤销的交接，而非增加更多探测数量。

用隔离宿主和合成无秘密值构造TCP可连但HTTP失败、401、404、500、多宿主PID、无代理、显式子环境覆盖等情形，对照当前与改进报告。观察维护者定位正确率、误执行脚本次数、敏感字段回显、恢复后环境一致性和总耗时。若分层仍被误读、恢复不能还原，或额外配置时间超过定位收益，则否定相应假设。本轮没有实现或运行这些改进，不能把其结果计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:145-151](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L145-L151)

已有分层报告是改进基线。

```text
      return {
        advice: buildAdvice(env, probes, selected, injectChildProxy, proxyListen, dshWeb),
        fix: buildFix(env, probes, injectChildProxy),
        env: redactEnv(env),
        probes,
        proxyListen,
        dshWeb: dshWebOut,
```

**依据 2 · 源码核查**：[index.js:197-202](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L197-L202)

ok当前取HTTP状态阈值，支持误读问题的机制推导。

```text
    return {
      name,
      url,
      ok: res.status > 0 && res.status < 500,
      status: res.status,
      ms: Date.now() - started,
```

**依据 3 · 源码核查**：[lib/net.js:343-350](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/lib/net.js#L343-L350)

修复目前直接写入值，支持不回显设计方向。

```text
      code: [
        `export HTTP_PROXY=${shellQuote(proxyUrl)}`,
        `export HTTPS_PROXY=${shellQuote(env.HTTPS_PROXY || proxyUrl)}`,
        "export NODE_USE_ENV_PROXY=1",
        "# Preferred: kit script also starts the :3081 relay",
        "bash /mnt/c/Users/$USER/Desktop/AIFullStackDevelopment/dsh-wsl-kit/scripts/restart-dsh-web.sh",
        "# Or: dsh web --no-open --port 3080",
      ].join("\n"),
```

**依据 4 · 源码核查**：[index.js:163-177](https://github.com/173787247/dsh-wsl-net/blob/34fe43ad0d3146d7a93265af142c9288e5c1d690/index.js#L163-L177)

包装生命周期是恢复实验的针对点。

<details>
<summary>查看原文（15行）</summary>

```text
const PATCHED = Symbol.for("dsh-wsl-net.subprocess-patched");

function installChildProxy(subprocess) {
  if (subprocess[PATCHED]) return;
  subprocess[PATCHED] = true;
  wrapSpawn(subprocess, "spawn");
  wrapSpawn(subprocess, "spawnTerminal");
}

function wrapSpawn(subprocess, method) {
  const original = subprocess[method];
  if (typeof original !== "function") return;
  subprocess[method] = function patchedSpawn(spec, ...rest) {
    return original.call(this, withChildProxyEnv(spec), ...rest);
  };
```

</details>

#### 缺口

- 分层报告、无凭据计划和还原设计的用户效果未测。
  **影响**：不能认定改进会降低误诊或恢复成本。
  **进一步探讨**：按固定故障对照定位/回显/还原结果，失败时分别否定设计。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
