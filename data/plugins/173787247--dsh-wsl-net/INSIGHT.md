# dsh-wsl-net

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c3f0f1c](https://github.com/173787247/dsh-wsl-net/tree/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net)
<!-- END META -->

> **实现功能**：诊断WSL与DSH代理环境、代理TCP端口及HTTP可达性，并生成修复提示和可选子进程代理注入。

> **核心亮点**：把环境、宿主PID、代理监听和服务响应集中为Agent诊断报告，减少手工信息拼接。详见[Q01](#research-q01)。

> **风险与缺陷**：HTTP<500不等业务成功，fix脚本使用未脱敏代理，默认全局包装也缺显式卸载还原。详见[Q03](#research-q03)。

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
  - [Q01 · 网络医生解决哪个故障，贡献来自哪里？](#detail-section-11)
  - [Q02 · 诊断和代理注入实际如何执行？](#detail-section-12)
  - [Q03 · 结果和修复内容有哪些容易误判的边界？](#detail-section-13)
  - [Q04 · 工程材料能证明什么，使用与恢复付出什么？](#detail-section-14)
  - [Q05 · 什么条件可试用，值得继续讨论的改进是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL/Windows网络环境不一致时辅助维护者定位故障层次。详见[Q01](#research-q01)。

读环境、/proc、TCP与curl/Node探测和人工脚本是简单替代，插件集中交接而不改变故障判据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 环境诊断 | 工具/宿主代理差异 | PID需确认 |
| HTTP/TCP检查 | 收窄网络层故障 | 不等业务成功 |
| 修复建议与注入 | 维护交接 | 秘密/路径/生命周期需控制 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| tools/systemPrompt/subprocess | 注册/提示/注入 | 宿主API需匹配 |
| fetch/AbortSignal.any | HTTP诊断 | 运行版需支持 |
| Linux /proc与pgrep | 宿主环境定位 | 权限/PID匹配影响结果 |
| 真实代理和可审阅脚本 | 修复 | 模板不能原样运行 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 关闭注入并确认环境 | 维护者 | 代理/Node/PID明确 |
| 选target诊断 | Agent | 区分TCP/HTTP/业务层 |
| 去秘密审阅fix | 维护者 | 路径/代理适配 |
| 修复并复核任务 | 维护者 | 真实目标任务成功 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有WSL/DSH/代理 | 确认Node、PID与安全脚本 | 默认可改变子进程环境；Node/PID/脚本核查工时未知 |
| 持续使用 | 串行HTTP/TCP探测 | 去秘密与判读，节时未知 | 串行HTTP/TCP和上下文成本未计量；无节时对照 |
| 失败恢复 | 原启动环境/重启 | 撤错误代理与恢复子进程行为 | 撤代理/重启目标进程的金额、工时与恢复率未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 进程差异 | tool/host env分列 | 最新PID可能非当前宿主 |
| 可达定位 | TCP和HTTP响应 | 不证明业务任务 |
| 修复交接 | 脚本建议 | 凭据/路径需人工审阅 |

> **思考**：HTTP<500不等业务成功，fix脚本使用未脱敏代理，默认全局包装也缺显式卸载还原。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把环境、宿主PID、代理监听和服务响应集中为Agent诊断报告，减少手工信息拼接。详见[Q01](#research-q01)。

把环境、宿主PID、代理监听和服务响应集中为Agent诊断报告，减少手工信息拼接。详见[Q01](#research-q01)。

函数分层且可注入测试依赖；需补修复输出脱敏和包装生命周期。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

HTTP<500不等业务成功，fix脚本使用未脱敏代理，默认全局包装也缺显式卸载还原。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人维护环境先禁用注入，有凭据环境先清理报告；不自动执行fix，不把HTTP ok当业务成功。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

诊断接线有源码支持，HTTP ok仅响应层，修复脚本脱敏和包装生命周期存在边界；分层安全修复为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、index.js、lib/net.js、test/net.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定提交入口、全部lib诊断函数、manifest和函数测试；未运行目标代码。
- 下一步：进一步从401/429、错误PID、凭据代理及卸载包装边界探讨，比较误诊、秘密输出和恢复步骤。

**分析版本**

- **仓库**：[173787247/dsh-wsl-net](https://github.com/173787247/dsh-wsl-net)
- **版本号**：0.5.2（[固定提交 c3f0f1c](https://github.com/173787247/dsh-wsl-net/tree/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究分层可达性判据、无凭据回显的修复计划与可恢复注入，以固定反例比较误诊和恢复成本。当前未验证。详见[Q05](#research-q05)。

进一步从401/429、错误PID、凭据代理及卸载包装边界探讨，比较误诊、秘密输出和恢复步骤。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 234 | — | — | 1564 |
| .js | source | 2 | 668 | 614 | 26 | — |
| .js | test | 1 | 260 | 238 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+created%3A2026-09-22T05%3A21%3A02.153Z..2026-10-22T05%3A21%3A02.153Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A21%3A02.153Z..2026-10-22T05%3A21%3A02.153Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本WSL网络诊断能区分哪些失败层次，代理注入和修复输出如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 网络医生解决哪个故障，贡献来自哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向Windows浏览器能访问HTTPS而WSL中的DSH/Node请求失败的维护者，合格产物是能区分工具进程与宿主进程代理环境、代理端口监听和目标HTTP响应层次的诊断报告，而不是业务API调用成功证明。README把进程内web_fetch转交配套插件，本插件既不配置模型也不提供网页抓取。

简单替代是手动读环境、检查/proc、TCP连接和curl/Node探测。插件将这些收集动作和修复提示装成net_doctor，减少跨进程信息拼接；贡献主要是故障工作流组合与Agent可调用入口。没有新代理协议或新的网络诊断算法，外部套件脚本的维护能力不能算本插件独立实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/README.md#L5-L13)

工具诊断与抓页范围分界。

```text
DeepSeek Harness **tool** plugin: `net_doctor` diagnoses why HTTPS works in the Windows browser but fails from the WSL agent—and returns **copy-paste fix scripts**.

Pairs with [dsh-wsl-env](https://github.com/173787247/dsh-wsl-env). Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Diagnoses why the Windows browser can reach HTTPS while the WSL agent cannot. In-process page fetch is dsh-wsl-fetch, not this plugin.
```

**依据 2 · 源码核查**：[index.js:129-152](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L129-L152)

分别返回env、probes、proxyListen与dshWeb。

<details>
<summary>查看原文（24行）</summary>

```text
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
      };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 诊断和代理注入实际如何执行？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply注入tools、systemPrompt和subprocess；默认injectChildProxy开启后直接包装subprocess.spawn及spawnTerminal，给后续调用补充代理大小写别名与NODE_USE_ENV_PROXY，spec.env最后覆盖，父进程明确0也保留。注册工具读取当前process.env，按target顺序GET固定服务或配置的npm registry，再检测一个代理地址TCP端口；另用pgrep选最新匹配node.*/dsh web的PID并读/proc/<pid>/environ。

工具本身不执行fix脚本，也不能通过对子进程注入修复已经运行的宿主fetch。Linux/WSL的/proc和pgrep、宿主subprocess对象可包装性、Node的fetch及AbortSignal.any是直接条件。package声明Node>=18，但并未按运行版本检测any和代理变量支持，不宜将这一下限等同完整功能兼容。多实例/多个profile时最新PID不保证是调用者宿主，需要读者确认PID对应关系。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-36](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L13-L36)

服务注入和默认全局子进程包装。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:163-191](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L163-L191)

Symbol防重复、方法替换及AbortSignal.any。

<details>
<summary>查看原文（29行）</summary>

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
}

function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function probe(name, url, callerSignal, probeTimeoutMs) {
  const started = Date.now();
  try {
    const signal = AbortSignal.any([
      callerSignal,
      AbortSignal.timeout(probeTimeoutMs),
    ]);
```

</details>

**依据 3 · 源码核查**：[lib/net.js:46-80](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L46-L80)

代理env合并优先级。

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

**依据 4 · 源码核查**：[lib/net.js:154-175](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L154-L175)

按最新匹配PID检查宿主。

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

**依据 5 · 源码核查**：[package.json:16-19](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/package.json#L16-L19)

声明Node>=18。

```text
  "engines": {
    "node": ">=18"
  },
  "scripts": {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 结果和修复内容有哪些容易误判的边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

HTTP探测使用GET且redirect manual，将任何大于0小于500的状态标为ok，因此401、403、404、429或重定向说明收到响应，不证明API权限、额度、模型或npm包下载成功。TCP open也只代表该地址接受连接，不证明代理协议、认证或转发可用；只选HTTP_PROXY优先的单一地址，不能代表HTTPS_PROXY各自健康。

环境输出仅对HTTP/HTTPS/ALL代理字段的URL userinfo脱敏；buildFix使用原始proxyUrl生成export脚本，再由formatReport直接打印，没有再次脱敏，因此有凭据的代理可能经fix.scripts暴露。npm_config_registry和probe URL也原样返回。不能依据README“不打印API keys”扩大为报告无秘密保证。重启脚本硬编码作者Windows桌面目录，未配置时还给7890示例，必须编辑并确认，不能直接自动执行。默认包装没有dispose还原，在共享subprocess服务上的实际影响生命周期需明确。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:185-203](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L185-L203)

manual重定向与<500状态判定。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/net.js:18-23](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L18-L23)

仅三个代理env字段脱敏。

```text
export function redactEnv(env) {
  const next = { ...env };
  for (const key of ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"]) {
    if (next[key]) next[key] = redactSecretUrl(next[key]);
  }
  return next;
```

**依据 3 · 源码核查**：[lib/net.js:202-235](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L202-L235)

单地址TCP检查。

<details>
<summary>查看原文（34行）</summary>

```text
export async function probeProxyListen(env, { probeFn, timeoutMs = 1500 } = {}) {
  const url = env.HTTP_PROXY || env.HTTPS_PROXY || env.ALL_PROXY || "";
  const endpoint = parseProxyEndpoint(url);
  if (!endpoint) {
    return { configured: false, open: false, url: "", host: "", port: 0, error: "no_proxy_url" };
  }
  const probe =
    probeFn ||
    ((host, port) =>
      new Promise((resolve) => {
        const sock = createConnection({ host, port });
        const done = (open, error) => {
          try {
            sock.destroy();
          } catch {
            /* ignore */
          }
          const row = { open };
          if (error) row.error = String(error);
          resolve(row);
        };
        sock.setTimeout(timeoutMs);
        sock.on("connect", () => done(true));
        sock.on("timeout", () => done(false, "timeout"));
        sock.on("error", (err) => done(false, err.message));
      }));
  const result = await probe(endpoint.host, endpoint.port);
  return {
    configured: true,
    open: Boolean(result.open),
    url: url.replace(/\/\/([^/@]+)@/, "//***@"),
    host: endpoint.host,
    port: endpoint.port,
    error: result.error || "",
```

</details>

**依据 4 · 源码核查**：[lib/net.js:330-369](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L330-L369)

原始代理写入脚本及硬编码目录。

<details>
<summary>查看原文（40行）</summary>

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
    });
    if (injectChildProxy) {
      steps.push("Child bash/npm already get NODE_USE_ENV_PROXY=1 from this plugin; the dsh host process itself still needs the restart above.");
    }
  }

  if (!proxyOn(env) && failed.length > 0) {
    steps.push("Set HTTP_PROXY/HTTPS_PROXY to your Windows Clash/V2Ray mixed port (typical http://127.0.0.1:7890), then restart dsh with NODE_USE_ENV_PROXY=1.");
    scripts.push({
      title: "template-set-proxy-then-start-dsh",
      shell: "bash",
      code: [
        "# Replace 7890 with your Clash/V2Ray mixed port from the Windows tray app.",
        "export HTTP_PROXY=http://127.0.0.1:7890",
        "export HTTPS_PROXY=http://127.0.0.1:7890",
        "export NODE_USE_ENV_PROXY=1",
        "dsh web",
      ].join("\n"),
    });
```

</details>

**依据 5 · 源码核查**：[lib/net.js:410-417](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L410-L417)

脚本内容直接展示。

```text
  if (fix.scripts.length > 0) {
    fixLines.push("  scripts:");
    for (const script of fix.scripts) {
      fixLines.push(`    # ${script.title} (${script.shell})`);
      for (const line of String(script.code).split("\n")) {
        fixLines.push(`    ${line}`);
      }
      fixLines.push("");
```

**依据 6 · 源码核查**：[index.js:163-178](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L163-L178)

包装无本地撤销处理。

<details>
<summary>查看原文（16行）</summary>

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
}
```

</details>

#### 缺口

- 宿主subprocess服务的作用域和卸载重建策略未在插件内定义
  **影响**：无法断言卸载会撤销包装，或不同profile完全隔离
  **进一步探讨**：阅读对应宿主版本服务生命周期，区分进程重启和热卸载

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程材料能证明什么，使用与恢复付出什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

lib/net.js把env、诊断建议和展示拆成函数，并为/proc读取、pgrep与TCP探测提供可注入依赖；测试检查env大小写、覆盖优先级、userinfo脱敏、脚本字符串、端口关闭及宿主环境建议。它们支撑这些分支的可检查性，但没有覆盖fix脚本凭据泄露、HTTP状态业务语义或包装卸载。测试文本被阅读，没有执行。

初次要确认真实代理、Node版本、目标宿主PID和可用重启脚本；默认包装会改变后续子进程环境，应先关闭注入只读诊断，再决定是否接受这项全局行为。持续成本主要是每次多目标串行请求、诊断提示上下文和人工判读，target=env也仍检查TCP与宿主。默认四个HTTP探测各5秒再加TCP及同步pgrep，20秒工具预算并非充裕保证，pgrep同步执行可占主线程至3秒。失败恢复要清除错误代理、恢复启动环境并重启正确进程；总节时、实际请求费和故障恢复率没有量化数据。

#### 证据与依据

**依据 1 · 源码核查**：[test/net.test.js:41-78](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/test/net.test.js#L41-L78)

子环境覆盖与registry测试。

<details>
<summary>查看原文（38行）</summary>

```text
describe("childProxyEnv", () => {
  it("mirrors lowercase aliases and sets NODE_USE_ENV_PROXY=1", () => {
    const extra = childProxyEnv({ HTTP_PROXY: "http://127.0.0.1:7890", ALL_PROXY: "socks5://127.0.0.1:7891" });
    assert.equal(extra.HTTP_PROXY, "http://127.0.0.1:7890");
    assert.equal(extra.http_proxy, "http://127.0.0.1:7890");
    assert.equal(extra.ALL_PROXY, "socks5://127.0.0.1:7891");
    assert.equal(extra.all_proxy, "socks5://127.0.0.1:7891");
    assert.equal(extra.NODE_USE_ENV_PROXY, "1");
  });

  it("keeps NODE_USE_ENV_PROXY=0 when the parent opted out", () => {
    const extra = childProxyEnv({ NODE_USE_ENV_PROXY: "0" });
    assert.equal(extra.NODE_USE_ENV_PROXY, "0");
  });
});

describe("withChildProxyEnv", () => {
  it("lets the spawn spec override inherited proxy env", () => {
    const spec = withChildProxyEnv(
      { command: "node", env: { NODE_USE_ENV_PROXY: "0" } },
      { HTTP_PROXY: "http://127.0.0.1:7890" },
    );
    assert.equal(spec.env.NODE_USE_ENV_PROXY, "0");
    assert.equal(spec.env.HTTP_PROXY, "http://127.0.0.1:7890");
  });

  it("returns non-objects unchanged", () => {
    assert.equal(withChildProxyEnv(null), null);
    assert.equal(withChildProxyEnv("bash"), "bash");
  });
});

describe("registryProbeList", () => {
  it("includes npm and modelscope for registry target", () => {
    const list = registryProbeList({ npm_config_registry: "https://registry.npmmirror.com/" }, "registry");
    assert.ok(list.some((p) => p.name === "npm"));
    assert.ok(list.some((p) => p.name === "modelscope"));
  });
```

</details>

**依据 2 · 源码核查**：[test/net.test.js:156-218](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/test/net.test.js#L156-L218)

脱敏、代理TCP与/proc注入测试。

<details>
<summary>查看原文（63行）</summary>

```text
describe("redactSecretUrl", () => {
  it("strips userinfo from proxy URLs", () => {
    assert.equal(redactSecretUrl("http://user:pass@127.0.0.1:7890"), "http://***@127.0.0.1:7890/");
    assert.equal(redactSecretUrl("http://127.0.0.1:7890"), "http://127.0.0.1:7890");
  });
});

describe("redactEnv", () => {
  it("redacts proxy fields and leaves other keys", () => {
    const env = redactEnv({
      HTTP_PROXY: "http://user:secret@127.0.0.1:7890",
      NODE_USE_ENV_PROXY: "1",
    });
    assert.equal(env.HTTP_PROXY, "http://***@127.0.0.1:7890/");
    assert.equal(env.NODE_USE_ENV_PROXY, "1");
  });
});

describe("parseProxyEndpoint / probeProxyListen", () => {
  it("parses host and port", () => {
    assert.deepEqual(parseProxyEndpoint("http://127.0.0.1:16006"), {
      host: "127.0.0.1",
      port: 16006,
      protocol: "http",
    });
  });

  it("reports closed proxy port via injectable probe", async () => {
    const listen = await probeProxyListen(
      { HTTP_PROXY: "http://127.0.0.1:16006" },
      { probeFn: async () => ({ open: false, error: "timeout" }) },
    );
    assert.equal(listen.configured, true);
    assert.equal(listen.open, false);
    assert.equal(listen.port, 16006);
  });

  it("mentions closed proxy in advice", () => {
    const advice = buildAdvice(
      { HTTP_PROXY: "http://127.0.0.1:16006", NODE_USE_ENV_PROXY: "1", WSL_DISTRO_NAME: "" },
      [{ ok: false, name: "deepseek", error: "TypeError: fetch failed" }],
      "all",
      true,
      { configured: true, open: false, host: "127.0.0.1", port: 16006, error: "timeout" },
    );
    assert.match(advice, /not accepting TCP/);
    assert.match(advice, /fetch failed/);
  });
});

describe("dsh web process env", () => {
  it("parses /proc environ and finds pid via injection", () => {
    const raw = Buffer.from("NODE_USE_ENV_PROXY=1\0HTTP_PROXY=http://127.0.0.1:9\0OTHER=x\0");
    const parsed = parseProcEnviron(raw);
    assert.equal(parsed.NODE_USE_ENV_PROXY, "1");
    assert.equal(parsed.HTTP_PROXY, "http://127.0.0.1:9");
    assert.equal(findDshWebPid({ pgrepFn: () => "4242\n" }), 4242);
    const got = readProcEnv(4242, {
      readFileSyncFn: () => raw,
    });
    assert.equal(got.ok, true);
    assert.equal(got.env.NODE_USE_ENV_PROXY, "1");
  });
```

</details>

**依据 3 · 源码核查**：[index.js:16-19](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L16-L19)

20秒总预算和5秒单探测默认。

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 20_000);
  const probeTimeoutMs = positive(config.probeTimeoutMs, 5_000);
  const injectChildProxy = config.injectChildProxy !== false;
```

**依据 4 · 源码核查**：[index.js:129-141](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L129-L141)

顺序HTTP后仍做TCP和宿主检查。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/net.js:154-163](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L154-L163)

同步pgrep最多3秒。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件可试用，值得继续讨论的改进是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议在个人WSL维护环境有条件试用，优先injectChildProxy=false，只提交去秘密后的报告；确认返回PID与真实宿主对应，并把HTTP ok解释为响应层可达。不得让Agent自动执行修复脚本，也不要把更改NO_PROXY为仅回环当所有企业内网都正确的处方。含代理或registry凭据的环境暂不原样回传，修复脚本也应人工去秘密。源码显示默认包装与敏感脚本输出的组合，限制其作为无感全局常驻诊断工具的适用性。

可继续讨论一个分层诊断与安全修复计划，明确区分TCP、HTTP响应、认证和业务任务，并让修复计划引用本地凭据而非回显，注入以可恢复开关管理。现有基线是手工分层诊断和人工编辑脚本；验证方向是401/429/重定向、双代理、凭据URL、错误PID与卸载场景的固定输入，比较误报、秘密暴露与人工恢复步数。它是研究假设，尚无效果数据，不当作现成功能。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-23](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/index.js#L19-L23)

注入默认开启且可禁用。

```text
  const injectChildProxy = config.injectChildProxy !== false;

  if (injectChildProxy) {
    installChildProxy(ctx.subprocess);
    console.log("[dsh-wsl-net] injecting NODE_USE_ENV_PROXY into subprocess env");
```

**依据 2 · 源码核查**：[lib/net.js:293-306](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L293-L306)

NO_PROXY启发建议与fetch failed归因。

<details>
<summary>查看原文（14行）</summary>

```text
  if (proxyOn(env) && riskyNoProxy(noProxyVal)) {
    lines.push(
      `NO_PROXY looks like Clash RFC1918/wildcards (${redactSecretUrl(noProxyVal) || "set"}) — Node may bypass the proxy incorrectly. Prefer kit restart-dsh-web.sh which sets NO_PROXY=127.0.0.1,localhost only.`,
    );
  }
  if (!proxyOn(env) && failed.length > 0) {
    lines.push("No HTTP_PROXY/HTTPS_PROXY in this process. If Clash/V2Ray runs on Windows, WSL often needs http://127.0.0.1:<mixed-port> (localhost forwards to Windows).");
  }
  if (proxyOn(env) && proxyHonored(env) && failed.length > 0) {
    lines.push("Proxy env is set and Node should honor it, but a probe still failed. Check that the proxy port is listening and allows api.deepseek.com / the npm registry.");
  }
  if (failed.some((p) => /fetch failed|TypeError/i.test(p.error || ""))) {
    lines.push(
      "Saw fetch failed / TypeError on a probe — classic Node-24-without-proxy symptom. Prefer restart-dsh-web.sh over guessing VPN toggles.",
```

</details>

**依据 3 · 源码核查**：[lib/net.js:330-369](https://github.com/173787247/dsh-wsl-net/blob/c3f0f1cafaa4ee667146cc5bb2f99d3d18fdc47f/lib/net.js#L330-L369)

修复脚本需要人工审阅。

<details>
<summary>查看原文（40行）</summary>

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
    });
    if (injectChildProxy) {
      steps.push("Child bash/npm already get NODE_USE_ENV_PROXY=1 from this plugin; the dsh host process itself still needs the restart above.");
    }
  }

  if (!proxyOn(env) && failed.length > 0) {
    steps.push("Set HTTP_PROXY/HTTPS_PROXY to your Windows Clash/V2Ray mixed port (typical http://127.0.0.1:7890), then restart dsh with NODE_USE_ENV_PROXY=1.");
    scripts.push({
      title: "template-set-proxy-then-start-dsh",
      shell: "bash",
      code: [
        "# Replace 7890 with your Clash/V2Ray mixed port from the Windows tray app.",
        "export HTTP_PROXY=http://127.0.0.1:7890",
        "export HTTPS_PROXY=http://127.0.0.1:7890",
        "export NODE_USE_ENV_PROXY=1",
        "dsh web",
      ].join("\n"),
    });
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
