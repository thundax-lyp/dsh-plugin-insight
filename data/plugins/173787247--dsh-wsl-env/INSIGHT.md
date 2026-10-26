# dsh-wsl-env

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a674c70](https://github.com/173787247/dsh-wsl-env/tree/a674c704757b733503f224ce2e3cf6ac5d1b6c8a)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-env)
<!-- END META -->

> **实现功能**：检测WSL并给系统提示补发行版、路径映射和跨Windows操作指导，减少环境背景重复说明。

> **核心亮点**：把局部环境事实和常见WSL指导自动填入模型背景。详见[Q01](#research-q01)。

> **风险与缺陷**：固定/mnt/c和always强制可误述环境，排障工具未核存在，工作区提示不等隔离。详见[Q03](#research-q03)。

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
  - [Q01 · 什么场景需要环境提示，能改变执行环境吗？](#detail-section-11)
  - [Q02 · 如何识别环境和用户，启动依赖有哪些？](#detail-section-12)
  - [Q03 · 哪些提示可能不准确或超出本插件能力？](#detail-section-13)
  - [Q04 · 测试和运行成本怎样评估？](#detail-section-14)
  - [Q05 · 采用建议与可验证方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：浏览器在Windows、工具跑WSL的混合工作流。详见[Q01](#research-q01)。

手工环境说明/宿主事实段，本文只评价自动填充。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 环境事实段 | WSL/Windows背景 | 不是模型工具 |
| 路径示例 | 减少盘符误用 | 固定/mnt/c规则 |
| 套件建议 | 排障顺序 | 不安装或检查工具 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=18/ESM | 入口 | 版本兼容 |
| systemPrompt | 注册事实段 | 宿主契约 |
| WSL变量/内核/目录 | 探测 | 固定规则误差 |
| 可选套件工具 | 排障建议 | 本插件不检查安装 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装/配置when | 用户 | 实际WSL |
| 新会话查SYSTEM | 用户 | 用户/映射正确 |
| 修特殊挂载提示 | 用户 | 与真实路径一致 |
| 执行仍核命令 | 用户/模型 | 提示无强制性 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/宿主 | 核新会话事实 | 需核SYSTEM事实和实际挂载；安装工时未知 |
| 持续使用 | 固定提示token | 挂载/工具变化维护 | 无网络/后台任务；固定提示增加模型上下文，费用未知 |
| 失败恢复 | 无插件文件写入；新会话仍使用宿主 | 停用/改提示并新建会话 | 新会话/改配置的人工时间未知；无插件文件回滚 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 环境识别 | 变量/kernel | 可继承误报 |
| 路径指导 | 目录存在后示例 | 固定/mnt/c |
| 少误操作 | 自然语言提醒 | 无参数/权限约束 |

> **思考**：固定/mnt/c和always强制可误述环境，排障工具未核存在，工作区提示不等隔离。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把局部环境事实和常见WSL指导自动填入模型背景。详见[Q01](#research-q01)。

把局部环境事实和常见WSL指导自动填入模型背景。详见[Q01](#research-q01)。

依赖注入纯函数易审计，未接网络模式与apply生命周期需区分。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

固定/mnt/c和always强制可误述环境，排障工具未核存在，工作区提示不等隔离。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

标准WSL用户核提示后试用，特殊挂载明确纠正。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

检测/文本链可查，挂载固定与套件工具未检查，提示不是执行约束。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/wsl.js、test/wsl.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整入口/环境函数/77行测试及README/package；不扩展研究套件链接或验证外部工具功能。
- 下一步：对假变量/自定义挂载和缺工具进行事实段误差对照。

**分析版本**

- **仓库**：[173787247/dsh-wsl-env](https://github.com/173787247/dsh-wsl-env)
- **版本号**：0.3.0（[固定提交 a674c70](https://github.com/173787247/dsh-wsl-env/tree/a674c704757b733503f224ce2e3cf6ac5d1b6c8a)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分离事实与可选建议，实测挂载/工具存在并比较错误路径率和提示成本，尚未验证。详见[Q05](#research-q05)。

对假变量/自定义挂载和缺工具进行事实段误差对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 121 | 103 | 4 | — |
| .md | source | 2 | 196 | — | — | 1114 |
| .js | test | 1 | 77 | 65 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-env/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-env/issues?q=is%3Aissue+created%3A2026-09-22T07%3A05%3A59.283Z..2026-10-22T07%3A05%3A59.283Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-env/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A05%3A59.283Z..2026-10-22T07%3A05%3A59.283Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL提示事实如何生成，软指导/实际探测/执行权限如何区分？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么场景需要环境提示，能改变执行环境吗？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH实际跑WSL而浏览器在Windows时，模型可能错用PowerShell或盘符路径。此插件在systemPrompt增加发行版、Linux用户名、/mnt/c映射、工作区优先和代理/本地模型排障提示，减少每次手工重复背景。它不改shell、不转换工具参数、不挂载路径、不修DNS，也不限制工具权限；“不扫整个Windows目录”只是给模型的自然语言要求。

基线是用户手工系统提示或宿主自身环境说明，贡献是用局部探测自动填充并统一WSL套件指导。只读源码可确认提示生成，不能由此推出模型遵循率或任务成功提升。对原生Windows/普通Linux默认跳过，适用面聚焦混合WSL用户。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-51](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/README.md#L39-L51)

作者问题与注入内容。

<details>
<summary>查看原文（13行）</summary>

```text
The model often assumes a Windows shell (`C:\`, PowerShell) even when the agent runs in Linux/WSL. This plugin adds a short system-prompt section so it prefers Linux paths, understands `/mnt/c`, and knows about Node 24 proxy quirks.

## What gets injected

Kept short on purpose:

- Distro name and Linux user
- Linux path mapping (`C:\Users\...` → `/mnt/c/Users/...`)
- CRLF / git caveats on `/mnt/c`
- Prefer Linux home over the Windows mount for day-to-day work
- `NODE_USE_ENV_PROXY=1` when Node 24 must use `HTTP(S)_PROXY`

## Install
```

</details>

**依据 2 · 源码核查**：[index.js:11-40](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/index.js#L11-L40)

跳过规则及提示文本。

<details>
<summary>查看原文（30行）</summary>

```text
  const wsl = detectWsl();

  if (when === "wsl" && !wsl) {
    console.log("[dsh-wsl-env] not running in WSL; skipping prompt injection");
    return;
  }

  const distro = distroName();
  const linuxUser = os.userInfo().username;
  const windowsUser = resolveWindowsUser(linuxUser);
  let text = [
    `You are running inside Windows Subsystem for Linux (${distro}) as ${linuxUser}.`,
    "The browser may be on Windows, but tools and the shell run in Linux.",
    "",
    "Path and shell rules:",
    "- Use bash and Linux paths. Do not use PowerShell, cmd.exe, or Windows drive letters as command paths.",
    `- ${windowsPathRule(windowsUser || linuxUser)}`,
    "- Prefer the selected workspace and the current session working directory. Do not scan the entire Windows home or Desktop unless asked.",
    "- Node, git, python, and package managers mean the Linux copies in this distro, not the Windows ones.",
    "- Files under /mnt/c often have CRLF endings. Strip carriage returns before running a script with bash.",
    "- Prefer the current session working directory and /home for git and new files. Do not treat /mnt/c as the daily working tree unless asked.",
    "- Node 24 fetch ignores HTTP_PROXY/HTTPS_PROXY unless NODE_USE_ENV_PROXY=1. Set that when a Node script must use the proxy.",
    "",
    "Local LLM on Windows (Ollama / LM Studio / vLLM / Unsloth Desktop):",
    "- dsh runs in WSL; the inference server often runs on Windows. Use host_reach to find a reachable baseURL (127.0.0.1 vs Windows host IP depends on WSL networking mode).",
    "- Paste host_reach providerSnippets into ~/.dsh/settings.yaml under llm-pi-ai.providers; export the matching *_API_KEY dummy env vars before dsh web.",
    "- Ollama: align settings contextWindow with the model's real n_ctx (OLLAMA_NUM_CTX / Modelfile). A settings value of 131072 when Ollama n_ctx=8192 causes API errors.",
    "- Unsloth Desktop (llama-server, often :8080) is separate from Unsloth Studio; Flash-Next multi-shard GGUF may not load in plain Ollama.",
    "",
    "When connectivity fails, run tools in order: host_reach (local LLM) → net_doctor (HTTPS/proxy) → wsl_dns → wsl_clock. See dsh-wsl-kit docs/TROUBLESHOOTING.zh.md.",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何识别环境和用户，启动依赖有哪些？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

detectWsl信任WSL_DISTRO_NAME或WSL_INTEROP任一非空，否则读/proc/sys/kernel/osrelease匹配microsoft；异常返回false。发行版优先WSL_DISTRO_NAME，再取/etc/os-release PRETTY_NAME。Windows用户名从USERPROFILE解析/Users/名，先查该/mnt/c/Users目录，再查Linux同名目录，否则回传profile候选；最终windowsPathRule再查目录，不存在则给泛化name例子。未枚举Windows家目录，不启动子进程。

Node>=18 ESM，宿主只需systemPrompt服务，没有模型工具、Skill或命令注册。when仅always会强制，其他值皆归wsl；order有限数字否则15，extraNotes转字符串。环境读取发生apply一次，已有会话的实际提示取决宿主提示快照，README建议新会话。when=always在非WSL也会写“运行在WSL”句子，不能将其作准确自动检测保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl.js:4-48](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/lib/wsl.js#L4-L48)

检测/发行版/目录映射。

<details>
<summary>查看原文（45行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) {
    return true;
  }
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function userFromWindowsHome(home) {
  if (!home) return "";
  const normalized = String(home).replace(/\\/g, "/");
  const match = normalized.match(/\/Users\/([^/]+)/i);
  return match ? match[1] : "";
}

export function resolveWindowsUser(linuxUser, { env = process.env, exists = existsSync } = {}) {
  const fromProfile = userFromWindowsHome(env.USERPROFILE);
  const names = [...new Set([fromProfile, linuxUser].filter(Boolean))];
  for (const name of names) {
    if (exists(`/mnt/c/Users/${name}`)) return name;
  }
  return fromProfile || "";
}

export function windowsPathRule(user, { exists = existsSync } = {}) {
  const linuxHome = user ? `/mnt/c/Users/${user}` : "";
  if (user && exists(linuxHome)) {
    return `A Windows path such as C:\\Users\\${user}\\project is ${linuxHome}/project in this environment.`;
  }
  return "A Windows path such as C:\\Users\\name\\project is /mnt/c/Users/name/project in this environment.";
}

export function distroName({ env = process.env, readOsReleaseFile = readEtcOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME) return env.WSL_DISTRO_NAME;
  try {
    const text = readOsReleaseFile();
    const pretty = text.match(/^PRETTY_NAME="?([^"\n]+)"?/m);
    if (pretty) return pretty[1];
  } catch {
    // /etc/os-release is missing on some test hosts
  }
  return "WSL";
```

</details>

**依据 2 · 源码核查**：[index.js:4-20](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/index.js#L4-L20)

注入服务/配置。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-wsl-env";
export const inject = ["systemPrompt"];

export function apply(ctx, config = {}) {
  const when = config.when === "always" ? "always" : "wsl";
  const extra = String(config.extraNotes ?? "").trim();
  const order = Number.isFinite(config.order) ? config.order : 15;
  const wsl = detectWsl();

  if (when === "wsl" && !wsl) {
    console.log("[dsh-wsl-env] not running in WSL; skipping prompt injection");
    return;
  }

  const distro = distroName();
  const linuxUser = os.userInfo().username;
  const windowsUser = resolveWindowsUser(linuxUser);
```

</details>

**依据 3 · 源码核查**：[index.js:47-52](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/index.js#L47-L52)

固定section提交。

```text
  ctx.systemPrompt.section({
    name: "runtime:wsl-windows",
    order,
    text,
  });
}
```

**依据 4 · 源码核查**：[package.json:14-18](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/package.json#L14-L18)

运行入口与Node。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

**依据 5 · 作者声明**：[README.md:65-67](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/README.md#L65-L67)

新会话说明。

```text
3. Search for `Windows Subsystem for Linux`.

You should see the distro name and path mapping. The UI concatenates sections, so the internal id `runtime:wsl-windows` may not appear as a heading.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些提示可能不准确或超出本插件能力？

**研究主题**：缺陷与关键质疑

#### 完整回答

环境变量是提示启发式，继承错误WSL变量可误报，when=always会主动略过实际判断。映射固定/mnt/c，不能反映自定义automount root或不同系统盘；目录存在只说明该路径可见，不证明它对应当前Windows登录者。Linux用户名由os.userInfo获取，失效无局部catch可能阻止apply，其他读取大多有降级。

Node24 fetch代理、本地模型上下文和Unsloth等内容是固定指导，不是运行期探测；建议host_reach/net_doctor/wsl_dns/wsl_clock但不检查这些工具是否安装。没有配套工具时提示会指向不可用能力。不得把这段指导当已经核过网络/模型，亦不得把软性的工作区要求当隔离。额外notes及用户名/发行版直接进系统提示，操作者应可信；用户和宿主仍负责工具执行权限与敏感路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wsl.js:4-12](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/lib/wsl.js#L4-L12)

环境变量信任。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) {
    return true;
  }
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 2 · 源码核查**：[lib/wsl.js:22-37](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/lib/wsl.js#L22-L37)

固定挂载规则。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveWindowsUser(linuxUser, { env = process.env, exists = existsSync } = {}) {
  const fromProfile = userFromWindowsHome(env.USERPROFILE);
  const names = [...new Set([fromProfile, linuxUser].filter(Boolean))];
  for (const name of names) {
    if (exists(`/mnt/c/Users/${name}`)) return name;
  }
  return fromProfile || "";
}

export function windowsPathRule(user, { exists = existsSync } = {}) {
  const linuxHome = user ? `/mnt/c/Users/${user}` : "";
  if (user && exists(linuxHome)) {
    return `A Windows path such as C:\\Users\\${user}\\project is ${linuxHome}/project in this environment.`;
  }
  return "A Windows path such as C:\\Users\\name\\project is /mnt/c/Users/name/project in this environment.";
}
```

</details>

**依据 3 · 源码核查**：[index.js:18-40](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/index.js#L18-L40)

用户读取与固定指导。

<details>
<summary>查看原文（23行）</summary>

```text
  const distro = distroName();
  const linuxUser = os.userInfo().username;
  const windowsUser = resolveWindowsUser(linuxUser);
  let text = [
    `You are running inside Windows Subsystem for Linux (${distro}) as ${linuxUser}.`,
    "The browser may be on Windows, but tools and the shell run in Linux.",
    "",
    "Path and shell rules:",
    "- Use bash and Linux paths. Do not use PowerShell, cmd.exe, or Windows drive letters as command paths.",
    `- ${windowsPathRule(windowsUser || linuxUser)}`,
    "- Prefer the selected workspace and the current session working directory. Do not scan the entire Windows home or Desktop unless asked.",
    "- Node, git, python, and package managers mean the Linux copies in this distro, not the Windows ones.",
    "- Files under /mnt/c often have CRLF endings. Strip carriage returns before running a script with bash.",
    "- Prefer the current session working directory and /home for git and new files. Do not treat /mnt/c as the daily working tree unless asked.",
    "- Node 24 fetch ignores HTTP_PROXY/HTTPS_PROXY unless NODE_USE_ENV_PROXY=1. Set that when a Node script must use the proxy.",
    "",
    "Local LLM on Windows (Ollama / LM Studio / vLLM / Unsloth Desktop):",
    "- dsh runs in WSL; the inference server often runs on Windows. Use host_reach to find a reachable baseURL (127.0.0.1 vs Windows host IP depends on WSL networking mode).",
    "- Paste host_reach providerSnippets into ~/.dsh/settings.yaml under llm-pi-ai.providers; export the matching *_API_KEY dummy env vars before dsh web.",
    "- Ollama: align settings contextWindow with the model's real n_ctx (OLLAMA_NUM_CTX / Modelfile). A settings value of 131072 when Ollama n_ctx=8192 causes API errors.",
    "- Unsloth Desktop (llama-server, often :8080) is separate from Unsloth Studio; Flash-Next multi-shard GGUF may not load in plain Ollama.",
    "",
    "When connectivity fails, run tools in order: host_reach (local LLM) → net_doctor (HTTPS/proxy) → wsl_dns → wsl_clock. See dsh-wsl-kit docs/TROUBLESHOOTING.zh.md.",
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试和运行成本怎样评估？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

测试直接导入生产检测/映射函数，用注入env、读文件和exists覆盖变量优先、kernel匹配、缺文件降级、用户候选和泛化映射，结构轻便且不依赖宿主。未覆盖实际apply注册/清理、非WSL强制文本、自定义挂载或模型遵循。readWslNetworkingMode虽提供却未被index使用，不能声称本插件探测后动态选NAT/mirrored路径。本次不执行测试。

首次安装并检查新会话SYSTEM段，按本地挂载/配套工具修extraNotes；持续为少量同步环境文件检查和固定系统提示token，没有网络/后台任务，也无独立模型调用费用。每次模型请求携带该段可能增加上下文token，未给可量化节省。失败恢复改配置或停用并新建会话，无本插件文件写入回滚；宿主section生命周期由宿主负责，apply未显式保存disposer。

#### 证据与依据

**依据 1 · 源码核查**：[test/wsl.test.js:1-77](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/test/wsl.test.js#L1-L77)

生产函数依赖注入测试。

<details>
<summary>查看原文（77行）</summary>

```text
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectWsl, distroName, resolveWindowsUser, userFromWindowsHome, windowsPathRule } from "../lib/wsl.js";

describe("detectWsl", () => {
  it("trusts WSL_DISTRO_NAME", () => {
    assert.equal(detectWsl({ env: { WSL_DISTRO_NAME: "Ubuntu-24.04" }, readRelease: () => { throw new Error("unused"); } }), true);
  });

  it("trusts WSL_INTEROP", () => {
    assert.equal(detectWsl({ env: { WSL_INTEROP: "/run/WSL/1_interop" }, readRelease: () => { throw new Error("unused"); } }), true);
  });

  it("reads the kernel osrelease when env is empty", () => {
    assert.equal(detectWsl({ env: {}, readRelease: () => "6.8.0-microsoft-standard-WSL2" }), true);
    assert.equal(detectWsl({ env: {}, readRelease: () => "6.8.0-generic" }), false);
  });

  it("returns false when osrelease cannot be read", () => {
    assert.equal(detectWsl({ env: {}, readRelease: () => { throw new Error("ENOENT"); } }), false);
  });
});

describe("windowsPathRule", () => {
  it("uses the Linux username when /mnt/c/Users/<user> exists", () => {
    const text = windowsPathRule("alice", { exists: (p) => p === "/mnt/c/Users/alice" });
    assert.match(text, /C:\\Users\\alice\\project/);
    assert.match(text, /\/mnt\/c\/Users\/alice\/project/);
  });

  it("falls back to a generic mapping when that home is missing", () => {
    const text = windowsPathRule("alice", { exists: () => false });
    assert.match(text, /C:\\Users\\name\\project/);
    assert.match(text, /\/mnt\/c\/Users\/name\/project/);
  });
});

describe("userFromWindowsHome", () => {
  it("reads the Windows username from USERPROFILE", () => {
    assert.equal(userFromWindowsHome("C:\\Users\\alice"), "alice");
    assert.equal(userFromWindowsHome("/mnt/c/Users/alice"), "alice");
    assert.equal(userFromWindowsHome(""), "");
  });
});

describe("resolveWindowsUser", () => {
  it("prefers USERPROFILE when that Windows home is mounted", () => {
    const name = resolveWindowsUser("linuxuser", {
      env: { USERPROFILE: "C:\\Users\\alice" },
      exists: (p) => p === "/mnt/c/Users/alice",
    });
    assert.equal(name, "alice");
  });

  it("falls back to the Linux username when that home is mounted", () => {
    const name = resolveWindowsUser("alice", {
      env: {},
      exists: (p) => p === "/mnt/c/Users/alice",
    });
    assert.equal(name, "alice");
  });
});

describe("distroName", () => {
  it("prefers WSL_DISTRO_NAME", () => {
    assert.equal(distroName({ env: { WSL_DISTRO_NAME: "Ubuntu-24.04" }, readOsReleaseFile: () => { throw new Error("unused"); } }), "Ubuntu-24.04");
  });

  it("reads PRETTY_NAME from os-release when the env var is missing", () => {
    const text = 'NAME="Ubuntu"\nPRETTY_NAME="Ubuntu 24.04.3 LTS"\n';
    assert.equal(distroName({ env: {}, readOsReleaseFile: () => text }), "Ubuntu 24.04.3 LTS");
  });

  it("falls back to WSL when os-release is missing", () => {
    assert.equal(distroName({ env: {}, readOsReleaseFile: () => { throw new Error("ENOENT"); } }), "WSL");
  });
});
```

</details>

**依据 2 · 源码核查**：[lib/wsl.js:50-60](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/lib/wsl.js#L50-L60)

网络模式函数未接入口。

<details>
<summary>查看原文（11行）</summary>

```text

/** Reads networkingMode from /etc/wsl.conf when present (mirrored | nat | unknown). */
export function readWslNetworkingMode({ readFile = readFileSync } = {}) {
  try {
    const text = readFile("/etc/wsl.conf", "utf8");
    const m = text.match(/^\s*networkingMode\s*=\s*(\w+)/im);
    if (m) return m[1].toLowerCase();
  } catch {
    /* ignore */
  }
  return "unknown";
```

</details>

**依据 3 · 源码核查**：[index.js:47-52](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/index.js#L47-L52)

直接注册section。

```text
  ctx.systemPrompt.section({
    name: "runtime:wsl-windows",
    order,
    text,
  });
}
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用建议与可验证方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

标准/mnt/c的WSL用户可试用这段轻量提示，核发行版/用户例子与实际工作目录，确认提到的工具已装；自定义挂载在extraNotes明确替代，非WSL不要用always伪造环境。它适合少重复解释环境，不承担路径安全或网络修复。

可进一步研究“事实段”和“可选套件建议”分离，挂载信息实测而非固定路径、工具存在时才加排障链，并给事实来源和版本。基线为当前固定段，反例包括继承假WSL变量、重映射盘、自定义用户名、缺套件工具以及环境变化后的旧会话。比较错误shell/路径调用率、提示token和人工纠正次数；尚无对照，创新在可核实上下文维护而非新的WSL机制。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:21-40](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/index.js#L21-L40)

事实和建议混合基线。

<details>
<summary>查看原文（20行）</summary>

```text
  let text = [
    `You are running inside Windows Subsystem for Linux (${distro}) as ${linuxUser}.`,
    "The browser may be on Windows, but tools and the shell run in Linux.",
    "",
    "Path and shell rules:",
    "- Use bash and Linux paths. Do not use PowerShell, cmd.exe, or Windows drive letters as command paths.",
    `- ${windowsPathRule(windowsUser || linuxUser)}`,
    "- Prefer the selected workspace and the current session working directory. Do not scan the entire Windows home or Desktop unless asked.",
    "- Node, git, python, and package managers mean the Linux copies in this distro, not the Windows ones.",
    "- Files under /mnt/c often have CRLF endings. Strip carriage returns before running a script with bash.",
    "- Prefer the current session working directory and /home for git and new files. Do not treat /mnt/c as the daily working tree unless asked.",
    "- Node 24 fetch ignores HTTP_PROXY/HTTPS_PROXY unless NODE_USE_ENV_PROXY=1. Set that when a Node script must use the proxy.",
    "",
    "Local LLM on Windows (Ollama / LM Studio / vLLM / Unsloth Desktop):",
    "- dsh runs in WSL; the inference server often runs on Windows. Use host_reach to find a reachable baseURL (127.0.0.1 vs Windows host IP depends on WSL networking mode).",
    "- Paste host_reach providerSnippets into ~/.dsh/settings.yaml under llm-pi-ai.providers; export the matching *_API_KEY dummy env vars before dsh web.",
    "- Ollama: align settings contextWindow with the model's real n_ctx (OLLAMA_NUM_CTX / Modelfile). A settings value of 131072 when Ollama n_ctx=8192 causes API errors.",
    "- Unsloth Desktop (llama-server, often :8080) is separate from Unsloth Studio; Flash-Next multi-shard GGUF may not load in plain Ollama.",
    "",
    "When connectivity fails, run tools in order: host_reach (local LLM) → net_doctor (HTTPS/proxy) → wsl_dns → wsl_clock. See dsh-wsl-kit docs/TROUBLESHOOTING.zh.md.",
```

</details>

**依据 2 · 源码核查**：[lib/wsl.js:22-37](https://github.com/173787247/dsh-wsl-env/blob/a674c704757b733503f224ce2e3cf6ac5d1b6c8a/lib/wsl.js#L22-L37)

映射基线。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveWindowsUser(linuxUser, { env = process.env, exists = existsSync } = {}) {
  const fromProfile = userFromWindowsHome(env.USERPROFILE);
  const names = [...new Set([fromProfile, linuxUser].filter(Boolean))];
  for (const name of names) {
    if (exists(`/mnt/c/Users/${name}`)) return name;
  }
  return fromProfile || "";
}

export function windowsPathRule(user, { exists = existsSync } = {}) {
  const linuxHome = user ? `/mnt/c/Users/${user}` : "";
  if (user && exists(linuxHome)) {
    return `A Windows path such as C:\\Users\\${user}\\project is ${linuxHome}/project in this environment.`;
  }
  return "A Windows path such as C:\\Users\\name\\project is /mnt/c/Users/name/project in this environment.";
}
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
