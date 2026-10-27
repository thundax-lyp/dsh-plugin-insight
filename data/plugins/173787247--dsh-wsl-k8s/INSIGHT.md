# dsh-wsl-k8s

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[003a48d](https://github.com/173787247/dsh-wsl-k8s/tree/003a48d9e45841b4f0869d9e3eaad2275bab485b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-k8s)
<!-- END META -->

> **功能**：将 kubectl 状态、上下文、get、describe 与日志读取封装为 DSH 工具。

> **亮点**：将常用 kubectl 只读查询做成模型工具并限制动词与输出，减少手工复制诊断信息；集群权限和语义仍由 kubectl/RBAC 提供。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：allowedContexts 对空 context 直接放行，get/describe/logs 可沿用 kubeconfig 当前集群；contexts 过滤仅影响显示，status 也不门控。不能将该配置当生产隔离。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要它，交付哪些诊断信息？](#detail-section-11)
  - [Q02 · 命令白名单、输出和日志上限如何实现？](#detail-section-12)
  - [Q03 · allowedContexts 是否严格限制所有集群查询？](#detail-section-13)
  - [Q04 · 采用负担和最小改进验证是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 kubeconfig 的开发/运维人员用 DSH 辅助集群只读排障。

手工 kubectl get/describe/logs 后把输出交给 AI；插件把固定只读子命令嵌入 DSH tool。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| status/contexts | 查 kubectl 和当前配置 | status 会触达当前集群，清单仅过滤展示 |
| get/describe | 读对象状态与细节 | 必须核 RBAC 和实际 context |
| logs | 截尾读取 Pod 日志 | 可能含敏感内容，tail 有上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| kubectl/kubeconfig | 必需 | 连接目标集群 | 工具失败或走错误当前上下文 |
| RBAC 最小权限 | 生产必需 | 限实际读取 | 插件白名单不能代替 |
| DSH tools/systemPrompt | 注册必需 | 模型工具和提示 | 缺失时不可用 |
| allowedContexts | 可选 | 显式 context 筛选 | 省略 context 不受其约束 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置独立低权限 kubeconfig | 当前/允许集群明确 |
| 探测 | Agent 查 status/contexts | 与用户预期一致，注意清单只过滤显示 |
| 查询 | 显式指定 context、namespace、对象 | 有用结果且无敏感误泄露 |
| 退出 | 用户停用并核工具消失 | 本轮未做宿主验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | kubectl、网络与集群资源，现金未知 | 配 kubeconfig、RBAC 和允许集群 | 宿主安装未验 |
| 持续使用 | 每次进程/API 请求与日志上下文 | 核查询目标和敏感输出 | 延迟/配额未测 |
| 失败恢复 | 超时/重试资源未知 | 查 context、RBAC、网络、对象 | 不应放宽权限掩盖故障 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 常用只读查询 | get/describe/logs/status/context 源码可见 | 真实集群诊断正确性和延迟 |
| 输出边界 | tail 和 stdout 裁剪可见 | 巨量 stderr 和参数解析行为 |
| 上下文清单 | 显式 context 可拒绝 | 省略 context 时当前集群不门控 |

> **思考**：allowedContexts 对空 context 直接放行，get/describe/logs 可沿用 kubeconfig 当前集群；contexts 过滤仅影响显示，status 也不门控。不能将该配置当生产隔离。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将常用 kubectl 只读查询做成模型工具并限制动词与输出，减少手工复制诊断信息；集群权限和语义仍由 kubectl/RBAC 提供。详见[Q01](#research-q01)、[Q02](#research-q02)。

spawn 独立 argv 且只暴露固定工具，避免任意 shell 命令；只读动词与输出裁剪降低一般副作用。允许清单只检查显式 context，且资源名称/输出格式未作完整参数语义验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

allowedContexts 对空 context 直接放行，get/describe/logs 可沿用 kubeconfig 当前集群；contexts 过滤仅影响显示，status 也不门控。不能将该配置当生产隔离。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。先在独立低权限测试集群核默认/显式 context 和敏感输出，再考虑用于实际排障；生产不依赖 allowedContexts 单独隔离。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读动词和输出限制有源码证据；allowedContexts 未约束省略 context 的当前集群，实际 RBAC/宿主行为未验证；默认门控是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/kubectl.js、test/k8s.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交阅读 README、工具入口、kubectl runner 与单测源码；未运行目标代码或接触 kubeconfig/集群。
- 下一步：在两个隔离测试集群用同 kubeconfig 切换当前上下文，比较省略/显式 context、敏感对象、输出/错误和退出行为。

**分析版本**

- **仓库**：[173787247/dsh-wsl-k8s](https://github.com/173787247/dsh-wsl-k8s)
- **版本号**：0.1.1（[固定提交 003a48d](https://github.com/173787247/dsh-wsl-k8s/tree/003a48d9e45841b4f0869d9e3eaad2275bab485b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可对所有查询解析并固定当前 context，非允许上下文拒绝，配合两测试集群比较误放行、误拒与延迟；本版未实现。详见[Q04](#research-q04)。

在两个隔离测试集群用同 kubeconfig 切换当前上下文，比较省略/显式 context、敏感对象、输出/错误和退出行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 123 | — | — | 524 |
| .js | source | 2 | 344 | 327 | 2 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-k8s/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-k8s/issues?q=is%3Aissue+created%3A2026-09-22T05%3A22%3A13.264Z..2026-10-22T05%3A22%3A13.264Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-k8s/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A22%3A13.264Z..2026-10-22T05%3A22%3A13.264Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本只读 Kubernetes 工具的查询能力、集群上下文边界和真实采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要它，交付哪些诊断信息？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本包面向已配置 kubectl/kubeconfig、需要让 DSH 读取 Kubernetes 对象状态和日志的开发或运维人员。工具提供 k8s_status、k8s_contexts、k8s_get、k8s_describe、k8s_logs；合格结果是明确所查集群/命名空间、输出未被误截断、日志足够用于排障，同时不会意外把其它上下文或敏感对象返回给模型。README 最短说明强调 get/describe/logs 不做 apply/delete/exec，入口实际还有 status 与 contexts。

原办法是用户手动执行相同 kubectl 命令再贴给 AI。插件的增量是把常用只读命令封装为有参数的模型工具，限制动词、日志尾数和返回长度，并让用户可配置上下文清单；它并未创建新的集群诊断算法，也不能替代 Kubernetes RBAC。读取 Secret、ConfigMap 或 Pod 日志仍可能暴露敏感值，不能用“只读”推断无安全成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-38](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/README.md#L1-L38)

作者声明只读诊断用途、安装与 allowedContexts 配置。

<details>
<summary>查看原文（38行）</summary>

````text
# dsh-wsl-k8s

> **语言：** **中文**（本页） · [English](./README.en.md)

只读 **kubectl** 工具：`k8s_get` / `k8s_describe` / `k8s_logs`。

**不能** apply / delete / exec / port-forward。适合排障看状态，不改集群。

## 最短上手

```sh
# kubectl 已配置好 kubeconfig
dsh plugin --profile web add github:173787247/dsh-wsl-k8s
```

## 工具

| 工具 | 作用 |
|------|------|
| `k8s_status` | kubectl 是否可用、当前 context |
| `k8s_get` | `kubectl get`（输出有长度上限） |
| `k8s_describe` | `kubectl describe` |
| `k8s_logs` | Pod 日志（截断） |

## 配置

```yaml
config:
  enabled: true
  timeoutMs: 30000
  maxOutputChars: 40000
  # 非空时只允许这些 context；空 = 不限制（仍只读）
  allowedContexts: []
  # 例: allowedContexts: [dev, staging]
```

生产集群建议显式写 `allowedContexts`，并保证 kubeconfig 本身权限最小。

````

</details>

**依据 2 · 源码核查**：[index.js:18-35](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/index.js#L18-L35)

status 工具与提示文字列明上下文/查询类别。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:k8s",
    order: 132,
    text: "dsh-wsl-k8s exposes read-only kubectl (contexts/get/describe/logs/top/config view). It cannot apply/delete/exec. Prefer k8s_contexts then k8s_get. k8s_logs tail is capped. Set allowedContexts in config for production clusters.",
  });

  ctx.tools.register({
    name: "k8s_status",
    description: "kubectl client/server reachability, current context, and context count (read-only).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        const ver = await runKubectl(["version", "--client=true", "-o", "yaml"], { timeoutMs, maxOutputChars });
        const ctxOut = await runKubectl(["config", "current-context"], { timeoutMs, maxOutputChars });
        const listOut = await runKubectl(["config", "get-contexts"], { timeoutMs, maxOutputChars });
```

</details>

**依据 3 · 源码核查**：[index.js:106-207](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/index.js#L106-L207)

get/describe/logs 的实际参数与输出路径。

<details>
<summary>查看原文（102行）</summary>

```text
  ctx.tools.register({
    name: "k8s_get",
    description: "kubectl get RESOURCE (read-only). Optional namespace and context.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["resource"],
      properties: {
        resource: { type: "string", description: "e.g. pods, deploy, svc/my-svc" },
        namespace: { type: "string" },
        context: { type: "string" },
        output: { type: "string", description: "wide|yaml|json|name (default wide)" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || "" }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const a = ["get", String(args.resource)];
        if (args.namespace) a.push("-n", String(args.namespace));
        a.push("-o", String(args.output || "wide"));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, ...out };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "k8s get" }),
    presentResult: (_a, r) => ({ card: "generic", title: "k8s get", content: r.content }),
  });

  ctx.tools.register({
    name: "k8s_describe",
    description: "kubectl describe RESOURCE NAME (read-only).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["resource", "name"],
      properties: {
        resource: { type: "string" },
        name: { type: "string" },
        namespace: { type: "string" },
        context: { type: "string" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || "" }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const a = ["describe", String(args.resource), String(args.name)];
        if (args.namespace) a.push("-n", String(args.namespace));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, ...out };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "k8s describe" }),
    presentResult: (_a, r) => ({ card: "generic", title: "k8s describe", content: r.content }),
  });

  ctx.tools.register({
    name: "k8s_logs",
    description: "kubectl logs POD (tail capped by config.maxTail, default 500). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["pod"],
      properties: {
        pod: { type: "string" },
        namespace: { type: "string" },
        container: { type: "string" },
        tail: { type: "number", description: `Lines from end (default ${defaultTail}, max ${maxTail})` },
        context: { type: "string" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || "" }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const tail = clampTail(args.tail, { defaultTail, maxTail });
        const a = ["logs", String(args.pod), `--tail=${tail}`];
        if (args.namespace) a.push("-n", String(args.namespace));
        if (args.container) a.push("-c", String(args.container));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, tail, ...out };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "k8s logs" }),
    presentResult: (_a, r) => ({ card: "generic", title: "k8s logs", content: r.content }),
  });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令白名单、输出和日志上限如何实现？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

工具通过 Node spawn('kubectl', finalArgs) 传单独 argv，stdin 忽略、stdout/stderr 管道读取，超时杀子进程。assertReadonlyArgs 允许 get、describe、logs 等读动词，拒绝写动词、config 的非查询子命令以及 --raw；入口只构造 status/contexts/get/describe/logs 五个工具。get 允许 resource、namespace、context、output；describe 用 resource/name；logs 用 pod/container 和默认100、最大受配置限制且硬上限2000的 tail。stdout 默认截到40000字符，stderr 截到4000，过大 stdout 会 kill。

这能减少任意 shell 命令执行和无界日志进入模型上下文，但 output/resource/name 等来自调用者，并未验证以 '-' 起始的值是否会被 kubectl 当作额外选项；参数并非 shell 注入，也不能仅凭静态代码断言可越权。stderr 在截断前持续字符串累积，强大量 stderr 的内存边界不如 stdout 明确。状态工具中的 server reachability 会向当前 kubeconfig 集群请求版本，与单纯本地命令检查不同。运行依赖可执行 kubectl、有效 kubeconfig 和 Kubernetes RBAC；README 所称 WSL 套件归属不等于本组件强制检测 WSL。

#### 证据与依据

**依据 1 · 源码核查**：[lib/kubectl.js:3-53](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/lib/kubectl.js#L3-L53)

读动词筛选和禁止 --raw 的精确范围。

<details>
<summary>查看原文（51行）</summary>

```text
const WRITE_VERBS = new Set([
  "apply",
  "create",
  "delete",
  "edit",
  "patch",
  "replace",
  "scale",
  "rollout",
  "exec",
  "cp",
  "run",
  "expose",
  "annotate",
  "label",
  "taint",
  "cordon",
  "drain",
  "uncordon",
]);

export function assertReadonlyArgs(args) {
  const list = Array.isArray(args) ? args.map(String) : [];
  if (!list.length) throw new Error("kubectl args required");
  // allow: get, describe, logs, top, api-resources, version, cluster-info, config view/get-contexts/current-context
  const allowed = new Set([
    "get",
    "describe",
    "logs",
    "top",
    "api-resources",
    "api-versions",
    "version",
    "cluster-info",
    "explain",
    "auth",
    "config",
  ]);
  if (!allowed.has(list[0])) throw new Error(`kubectl verb not allowed: ${list[0]} (read-only plugin)`);
  if (WRITE_VERBS.has(list[0])) throw new Error("write verb blocked");
  if (list[0] === "config") {
    const sub = list[1] || "";
    const okSub = new Set(["view", "get-contexts", "current-context", "get-clusters"]);
    if (!okSub.has(sub)) throw new Error(`kubectl config subcommand not allowed: ${sub}`);
  }
  if (list[0] === "auth" && list[1] !== "can-i") throw new Error("only kubectl auth can-i allowed");
  for (const a of list) {
    if (a === "--raw" || a.startsWith("--raw=")) throw new Error("--raw blocked");
  }
  return list;
}
```

</details>

**依据 2 · 源码核查**：[lib/kubectl.js:55-93](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/lib/kubectl.js#L55-L93)

tail、spawn、超时、stdout/stderr 裁剪。

<details>
<summary>查看原文（39行）</summary>

```text
export function clampTail(tail, { defaultTail = 100, maxTail = 500 } = {}) {
  const max = Math.min(2000, Math.max(1, Number(maxTail) || 500));
  const d = Math.min(max, Math.max(1, Number(defaultTail) || 100));
  const n = Number(tail);
  if (!Number.isFinite(n) || n <= 0) return d;
  return Math.min(max, Math.max(1, Math.floor(n)));
}

export function runKubectl(args, { timeoutMs = 30_000, maxOutputChars = 40_000, context } = {}) {
  const finalArgs = [...args];
  if (context) finalArgs.unshift("--context", String(context));
  return new Promise((resolve, reject) => {
    const child = spawn("kubectl", finalArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("kubectl timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOutputChars * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolve({
        code,
        stdout: stdout.slice(0, maxOutputChars),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOutputChars,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}
```

</details>

**依据 3 · 源码核查**：[index.js:106-207](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/index.js#L106-L207)

五工具中三种对象查询的调用参数。

<details>
<summary>查看原文（102行）</summary>

```text
  ctx.tools.register({
    name: "k8s_get",
    description: "kubectl get RESOURCE (read-only). Optional namespace and context.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["resource"],
      properties: {
        resource: { type: "string", description: "e.g. pods, deploy, svc/my-svc" },
        namespace: { type: "string" },
        context: { type: "string" },
        output: { type: "string", description: "wide|yaml|json|name (default wide)" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || "" }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const a = ["get", String(args.resource)];
        if (args.namespace) a.push("-n", String(args.namespace));
        a.push("-o", String(args.output || "wide"));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, ...out };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "k8s get" }),
    presentResult: (_a, r) => ({ card: "generic", title: "k8s get", content: r.content }),
  });

  ctx.tools.register({
    name: "k8s_describe",
    description: "kubectl describe RESOURCE NAME (read-only).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["resource", "name"],
      properties: {
        resource: { type: "string" },
        name: { type: "string" },
        namespace: { type: "string" },
        context: { type: "string" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || "" }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const a = ["describe", String(args.resource), String(args.name)];
        if (args.namespace) a.push("-n", String(args.namespace));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, ...out };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "k8s describe" }),
    presentResult: (_a, r) => ({ card: "generic", title: "k8s describe", content: r.content }),
  });

  ctx.tools.register({
    name: "k8s_logs",
    description: "kubectl logs POD (tail capped by config.maxTail, default 500). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["pod"],
      properties: {
        pod: { type: "string" },
        namespace: { type: "string" },
        container: { type: "string" },
        tail: { type: "number", description: `Lines from end (default ${defaultTail}, max ${maxTail})` },
        context: { type: "string" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || "" }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const tail = clampTail(args.tail, { defaultTail, maxTail });
        const a = ["logs", String(args.pod), `--tail=${tail}`];
        if (args.namespace) a.push("-n", String(args.namespace));
        if (args.container) a.push("-c", String(args.container));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, tail, ...out };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "k8s logs" }),
    presentResult: (_a, r) => ({ card: "generic", title: "k8s logs", content: r.content }),
  });
```

</details>

#### 缺口

- 没有本轮 kubectl 版本下以连字符开头的模型参数和大量 stderr 对照。
  **影响**：不能保证所有用户参数只作资源名，也不能量化进程/内存上界。
  **进一步探讨**：在临时集群和假 kubectl 中测试参数解析、极长 stderr、超时与错误呈现。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · allowedContexts 是否严格限制所有集群查询？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

没有覆盖默认上下文。guardContext 对空 context 直接返回 undefined，即使 allowedContexts 非空；runKubectl 只有 context truthy 时才加入 --context，因此 get/describe/logs 在调用方不传 context 时仍使用 kubeconfig 当前上下文。若当前上下文不在 allowedContexts，配置字面意思与执行路径不一致。k8s_contexts 只是先运行 config get-contexts 再过滤显示列表；这不改变当前上下文或限制其它查询。k8s_status 也直接运行 current-context 与 server version，并返回 currentContext，不经过允许清单。

所以 allowedContexts 至多约束显式传入的 context；真实集群访问仍受 kubeconfig/RBAC 约束，但不该把该配置称为生产集群的充分隔离。源码测试断言 guardContext('prod',['dev']) 会抛错，却没有测试空 context 加白名单、当前上下文不在白名单的读取路径。get/describe/logs 的只读性质不消除对生产 Secret、日志或资源元数据的查看风险。此结论是固定源码语义，并未实际访问集群。

#### 证据与依据

**依据 1 · 源码核查**：[lib/kubectl.js:63-66](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/lib/kubectl.js#L63-L66)

未传 context 时 finalArgs 不加 --context。

```text
export function runKubectl(args, { timeoutMs = 30_000, maxOutputChars = 40_000, context } = {}) {
  const finalArgs = [...args];
  if (context) finalArgs.unshift("--context", String(context));
  return new Promise((resolve, reject) => {
```

**依据 2 · 源码核查**：[lib/kubectl.js:95-102](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/lib/kubectl.js#L95-L102)

guardContext 空值直接返回，不查 allowedContexts。

```text
export function guardContext(context, allowedContexts = []) {
  const c = String(context || "").trim();
  if (!c) return undefined;
  if (allowedContexts.length && !allowedContexts.includes(c)) {
    throw new Error(`context not in allowedContexts: ${c}`);
  }
  return c;
}
```

**依据 3 · 源码核查**：[index.js:31-53](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/index.js#L31-L53)

status 查询 kubeconfig 当前上下文及 server，不做白名单门控。

<details>
<summary>查看原文（23行）</summary>

```text
    async execute() {
      try {
        const ver = await runKubectl(["version", "--client=true", "-o", "yaml"], { timeoutMs, maxOutputChars });
        const ctxOut = await runKubectl(["config", "current-context"], { timeoutMs, maxOutputChars });
        const listOut = await runKubectl(["config", "get-contexts"], { timeoutMs, maxOutputChars });
        const contexts = parseContextsTable(listOut.stdout);
        let server = null;
        try {
          const srv = await runKubectl(["version", "-o", "yaml"], { timeoutMs: Math.min(timeoutMs, 15_000), maxOutputChars: 8_000 });
          if (srv.code === 0) server = "reachable";
          else server = { ok: false, stderr: (srv.stderr || "").slice(0, 200) };
        } catch (e) {
          server = { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
        return {
          ok: true,
          client: ver.stdout.trim().slice(0, 4000),
          currentContext: ctxOut.code === 0 ? ctxOut.stdout.trim() : null,
          contextCount: contexts.length,
          allowedContexts,
          maxTail,
          defaultTail,
          server,
```

</details>

**依据 4 · 源码核查**：[index.js:83-101](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/index.js#L83-L101)

contexts 仅对展示结果过滤。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute() {
      try {
        assertReadonlyArgs(["config", "get-contexts"]);
        const out = await runKubectl(["config", "get-contexts"], { timeoutMs, maxOutputChars });
        if (out.code !== 0) throw new Error(out.stderr || `exit ${out.code}`);
        let contexts = parseContextsTable(out.stdout);
        if (allowedContexts.length) {
          contexts = contexts.filter((c) => allowedContexts.includes(c.name));
        }
        return {
          ok: true,
          count: contexts.length,
          current: contexts.find((c) => c.current)?.name || null,
          contexts: contexts.slice(0, 100),
        };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
```

</details>

**依据 5 · 源码核查**：[test/k8s.test.js:5-23](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/test/k8s.test.js#L5-L23)

测试只有显式不允许上下文与 tail 断言，缺默认上下文场景。

<details>
<summary>查看原文（19行）</summary>

```text
describe("kubectl guard", () => {
  it("allows get", () => {
    assert.deepEqual(assertReadonlyArgs(["get", "pods"]), ["get", "pods"]);
  });
  it("blocks apply", () => {
    assert.throws(() => assertReadonlyArgs(["apply", "-f", "x"]), /not allowed|blocked/);
  });
  it("allows config get-contexts", () => {
    assert.deepEqual(assertReadonlyArgs(["config", "get-contexts"]), ["config", "get-contexts"]);
  });
  it("guards context allowlist", () => {
    assert.equal(guardContext("dev", ["dev"]), "dev");
    assert.throws(() => guardContext("prod", ["dev"]), /allowedContexts/);
  });
  it("clamps log tail", () => {
    assert.equal(clampTail(9999, { maxTail: 500 }), 500);
    assert.equal(clampTail(undefined, { defaultTail: 80, maxTail: 500 }), 80);
    assert.equal(clampTail(10, { maxTail: 500 }), 10);
  });
```

</details>

#### 缺口

- 未在具有多个上下文的 kubeconfig 与真实 RBAC 下验证默认路径。
  **影响**：静态配置缺口已成立，但无法量化实际可读取内容。
  **进一步探讨**：在两个隔离测试集群间把不允许的上下文设为当前，分别省略/显式指定 context，验证工具实际请求目标。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用负担和最小改进验证是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次使用需安装组件、配置 kubectl/kubeconfig 和最小权限 RBAC，明确允许查询的集群与命名空间；持续每次请求产生 kubectl 子进程及集群 API 读取，可能占用配额，返回日志和对象还需人工审阅。错误或超时需要查上下文、网络、RBAC、命名空间和对象名称，而不能盲目放宽允许清单。现金、延迟和集群负载未本轮测量。

当前建议观察，特别是生产集群不应仅依赖 allowedContexts；即使工具不暴露写动词，也应先用独立低权限 kubeconfig 和非敏感测试环境。可提出未实现的默认上下文强制门控：所有工具在查询前解析当前 context，若不在允许清单则拒绝，且将显式 context 固定传给 kubectl；status/contexts 也需定义一致的展示规则。最小验证以允许/不允许两个测试集群、当前上下文切换、显式/省略 context、Secret 读取和错误分支作为矩阵，记录实际命中集群、拒绝正确率与额外延迟。若新门控阻断合法路径或仍可通过模型参数选错上下文，则方案需修正。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-44](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/README.md#L18-L44)

作者建议生产场景配置 allowedContexts 与最小权限。

<details>
<summary>查看原文（27行）</summary>

````text
| 工具 | 作用 |
|------|------|
| `k8s_status` | kubectl 是否可用、当前 context |
| `k8s_get` | `kubectl get`（输出有长度上限） |
| `k8s_describe` | `kubectl describe` |
| `k8s_logs` | Pod 日志（截断） |

## 配置

```yaml
config:
  enabled: true
  timeoutMs: 30000
  maxOutputChars: 40000
  # 非空时只允许这些 context；空 = 不限制（仍只读）
  allowedContexts: []
  # 例: allowedContexts: [dev, staging]
```

生产集群建议显式写 `allowedContexts`，并保证 kubeconfig 本身权限最小。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-k8s` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
````

</details>

**依据 2 · 源码核查**：[lib/kubectl.js:63-102](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/lib/kubectl.js#L63-L102)

默认上下文不门控是改进对照基线。

<details>
<summary>查看原文（40行）</summary>

```text
export function runKubectl(args, { timeoutMs = 30_000, maxOutputChars = 40_000, context } = {}) {
  const finalArgs = [...args];
  if (context) finalArgs.unshift("--context", String(context));
  return new Promise((resolve, reject) => {
    const child = spawn("kubectl", finalArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("kubectl timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOutputChars * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolve({
        code,
        stdout: stdout.slice(0, maxOutputChars),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOutputChars,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}

export function guardContext(context, allowedContexts = []) {
  const c = String(context || "").trim();
  if (!c) return undefined;
  if (allowedContexts.length && !allowedContexts.includes(c)) {
    throw new Error(`context not in allowedContexts: ${c}`);
  }
  return c;
}
```

</details>

**依据 3 · 源码核查**：[index.js:123-131](https://github.com/173787247/dsh-wsl-k8s/blob/003a48d9e45841b4f0869d9e3eaad2275bab485b/index.js#L123-L131)

get 可直接省略 context 并执行读取。

```text
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const a = ["get", String(args.resource)];
        if (args.namespace) a.push("-n", String(args.namespace));
        a.push("-o", String(args.output || "wide"));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, ...out };
```

#### 缺口

- 强制默认上下文门控未实现，缺两个测试集群的对照。
  **影响**：不能算现有隔离能力或提高采用成熟度。
  **进一步探讨**：在隔离 kubeconfig 切换当前上下文并记录实际请求集群与拒绝行为。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
