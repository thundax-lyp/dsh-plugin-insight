# dsh-wsl-k8s

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[71e6c1c](https://github.com/173787247/dsh-wsl-k8s/tree/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-k8s)
<!-- END META -->

> **功能**：在 DSH 中查询 kubectl 上下文、资源状态、对象详情和 Pod 日志。

> **亮点**：[Q01](#research-q01) 把常用查询整理为结构化 DSH 工具，并为日志设置尾行和输出边界。

> **主要限制**：[Q02](#research-q02) 允许列表只限制显式 context。默认探测和读取仍可能使用其他当前集群，工具入口也不能代替 RBAC。

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
  - [Q01 · 值班者能从 DSH 获得哪些 Kubernetes 排障线索？](#detail-section-11)
  - [Q02 · 只读与 context 限制在哪些分支生效？](#detail-section-12)
  - [Q03 · 在什么条件下可以评估这组工具，失败时怎么判断？](#detail-section-13)
  - [Q04 · 把上下文绑定到每个访问集群的工具是否更可靠？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：值班者在已有 kubeconfig 的机器上，需要从 Pod 状态和日志定位部署异常。

直接执行 kubectl 可取得同一原始材料，并明确控制上下文和输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 上下文与状态 | 定位 kubeconfig 及目标 | 状态使用当前 context |
| 资源与日志 | 采集排障线索 | 权限由集群控制，输出可截断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| kubectl 与测试 kubeconfig | 必需 | 读取目标集群 | 无连接或凭据时无法取证 |
| 最小 RBAC 权限 | 受控试用必需 | 限定实际读取范围 | 可能访问超出预期的资源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立单集群测试配置 | 无生产凭据 |
| 取证 | 用户显式选择 context 和 namespace | 同原生命令核对对象 |
| 退出 | 用户切回原生命令 | 不使用空输出判断资源不存在 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 集群资源未知 | 准备 kubeconfig 和 RBAC | 须验证当前默认 context |
| 持续 | 日志采集开销未知 | 复核输出完整性 | 长输出可能截断 |
| 失败 | 诊断成本未知 | 核对 stderr、权限和网络 | 工具文本可能省略错误 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 诊断 | 可读取状态与日志尾部 | 排障实际节时 |
| 目标限制 | 仅显式 context 有允许值检查 | 宿主 RBAC 与选项处理 |

> **思考**：[Q02](#research-q02) 允许列表只限制显式 context。默认探测和读取仍可能使用其他当前集群，工具入口也不能代替 RBAC。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把常用查询整理为结构化 DSH 工具，并为日志设置尾行和输出边界。

[Q02](#research-q02) 直接 spawn 消除 shell 插值，但参数字段仍由 kubectl 解析。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 允许列表只限制显式 context。默认探测和读取仍可能使用其他当前集群，工具入口也不能代替 RBAC。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只在无生产凭据的测试 profile 验证两类 context 和非零退出，确认读取边界后再评估采用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实查询注册、参数和默认上下文路径。访问控制效果、诊断增益与假设仍需验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/kubectl.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码与作者说明。未运行插件、kubectl、宿主或测试集群。
- 下一步：用测试集群验收 context、RBAC、非零退出、截断与否定输入。

**分析版本**

- **仓库**：[173787247/dsh-wsl-k8s](https://github.com/173787247/dsh-wsl-k8s)
- **版本号**：0.1.1（[固定提交 71e6c1c](https://github.com/173787247/dsh-wsl-k8s/tree/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在所有远端探测前绑定并回显实际 context，有机会减少跨集群误读，需以两个测试集群做请求对照。

用测试集群验收 context、RBAC、非零退出、截断与否定输入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 123 | — | — | 524 |
| .js | source | 2 | 344 | 327 | 2 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-k8s/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-k8s/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-k8s/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：值班者能否在 DSH 中读取足以定位故障的 Kubernetes 线索，并限制到预期集群？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 值班者能从 DSH 获得哪些 Kubernetes 排障线索？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

值班者可以先看 context，再获取 Pod 或 Deployment 状态、describe 细节和某容器的日志尾部。相比离开会话手动组织 kubectl 命令，插件新增的是有参数结构的模型工具和输出约束，集群的查询能力来自 kubectl。日志使用固定尾行参数，配置允许调节但夹在 1 至 2000。源码实际注册 status、contexts、get、describe、logs，系统提示列出的 top 和 config view 没有独立工具。合格结果应明确来自哪个集群和命名空间，并能够回到原命令核实；需要历史日志、指标或修复时仍要其他入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-14](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/README.md#L5-L14)

作者把用途定位为现有 kubeconfig 下的诊断。

<details>
<summary>查看原文（10行）</summary>

````text
只读 **kubectl** 工具：`k8s_get` / `k8s_describe` / `k8s_logs`。

**不能** apply / delete / exec / port-forward。适合排障看状态，不改集群。

## 最短上手

```sh
# kubectl 已配置好 kubeconfig
dsh plugin --profile web add github:173787247/dsh-wsl-k8s
```
````

</details>

**依据 2 · 源码核查**：[index.js:18-24](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L18-L24)

提示文案与工具接线须区分。

```text
  ctx.systemPrompt.section({
    name: "tool:k8s",
    order: 132,
    text: "dsh-wsl-k8s exposes read-only kubectl (contexts/get/describe/logs/top/config view). It cannot apply/delete/exec. Prefer k8s_contexts then k8s_get. k8s_logs tail is capped. Set allowedContexts in config for production clusters.",
  });

  ctx.tools.register({
```

**依据 3 · 源码核查**：[index.js:63-97](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L63-L97)

上下文列表及筛选。

<details>
<summary>查看原文（35行）</summary>

```text
  ctx.tools.register({
    name: "k8s_contexts",
    description: "List kubectl contexts (name/cluster/current). Honors allowedContexts filter when set.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.contexts || [])
                  .map((c) => `${c.current ? "*" : " "} ${c.name}\tcluster=${c.cluster || "-"}\tns=${c.namespace || "-"}`)
                  .join("\n") || "(none)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
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
```

</details>

**依据 4 · 源码核查**：[index.js:173-200](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L173-L200)

日志真实参数与执行。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/kubectl.js:55-61](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/lib/kubectl.js#L55-L61)

日志尾行限幅。

```text
export function clampTail(tail, { defaultTail = 100, maxTail = 500 } = {}) {
  const max = Math.min(2000, Math.max(1, Number(maxTail) || 500));
  const d = Math.min(max, Math.max(1, Number(defaultTail) || 100));
  const n = Number(tail);
  if (!Number.isFinite(n) || n <= 0) return d;
  return Math.min(max, Math.max(1, Math.floor(n)));
}
```

#### 缺口

- 未比较排障耗时和错误诊断
  **影响**：无法量化工具化的实际增益
  **进一步探讨**：同一测试事故记录直接命令与会话工具的取证时间和正确率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 只读与 context 限制在哪些分支生效？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

get、describe、logs 固定首个 kubectl 子命令，检查允许动词并拦截 --raw，直接 spawn 可避免 shell 展开。但 get 的 resource、describe 的 name、logs 的 pod 等直接作为参数传给 kubectl，没有用参数分隔符或逐字段验证拒绝以连字符开头的 token。插件自身不会挡下所有 kubectl 选项。实际可接受和优先级取决于 kubectl 解析，源码不能证明集群授权或任意旗标的效果。

allowedContexts 只在 context 参数显式非空时做成员检查。省略或空白返回 undefined，不向 kubectl 传 --context，于是使用当前 kubeconfig，哪怕它不在配置列表。status 的 server version 也直接用当前 kubeconfig，而 contexts 仅过滤其展示列表。get 没有限制资源种类，日志和资源数据可含敏感内容，进程权限仍由 kubeconfig 及服务器 RBAC 决定。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:123-132](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L123-L132)

get 参数构造及运行。

<details>
<summary>查看原文（10行）</summary>

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
      } catch (e) {
```

</details>

**依据 2 · 源码核查**：[index.js:157-165](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L157-L165)

describe 直接传 name。

```text
    async execute(args) {
      try {
        const context = guardContext(args.context, allowedContexts);
        const a = ["describe", String(args.resource), String(args.name)];
        if (args.namespace) a.push("-n", String(args.namespace));
        assertReadonlyArgs(a);
        const out = await runKubectl(a, { timeoutMs, maxOutputChars, context });
        return { ok: out.code === 0, ...out };
      } catch (e) {
```

**依据 3 · 源码核查**：[index.js:191-201](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L191-L201)

logs 直接传 pod 和容器。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[index.js:31-53](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L31-L53)

状态探测未调用 guardContext。

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

**依据 5 · 源码核查**：[lib/kubectl.js:24-52](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/lib/kubectl.js#L24-L52)

动词及 raw 过滤。

<details>
<summary>查看原文（29行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[lib/kubectl.js:63-67](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/lib/kubectl.js#L63-L67)

添加 context 并直接 spawn。

```text
export function runKubectl(args, { timeoutMs = 30_000, maxOutputChars = 40_000, context } = {}) {
  const finalArgs = [...args];
  if (context) finalArgs.unshift("--context", String(context));
  return new Promise((resolve, reject) => {
    const child = spawn("kubectl", finalArgs, { stdio: ["ignore", "pipe", "pipe"] });
```

**依据 7 · 源码核查**：[lib/kubectl.js:95-102](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/lib/kubectl.js#L95-L102)

空 context 在检查前返回。

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

#### 缺口

- 没有在固定 kubectl 版本验证选项解析与 RBAC
  **影响**：无法给出实际访问范围或完整拒绝矩阵
  **进一步探讨**：用非生产集群与测试凭据核对空 context、显式禁用 context、旗标形输入及资源拒绝

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 在什么条件下可以评估这组工具，失败时怎么判断？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先在专用测试 kubeconfig 中只留目标集群与最小读取权限，使用 status 查看客户端和 server，再显式指定 context、namespace 读取已知对象及短日志。工具默认子进程限 30 秒，超时会发 SIGKILL 并拒绝；stdout 达配置值两倍时也杀进程，返回时截断，stderr 只在返回截取，收集过程未提前限长。get 等对非零退出构造 ok=false 并带 stderr，但文本投影读取 error 字段，故非零退出时默认渲染可能没有错误内容，不能将空文本当作没有资源。生产或保密数据使用前要先校验上下文控制与输出去向。失败回同一测试凭据的原生命令。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-14](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/README.md#L9-L14)

作者要求现有 kubectl 和 kubeconfig。

````text
## 最短上手

```sh
# kubectl 已配置好 kubeconfig
dsh plugin --profile web add github:173787247/dsh-wsl-k8s
```
````

**依据 2 · 源码核查**：[index.js:11-15](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L11-L15)

超时、输出和尾行配置。

```text
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxOutputChars = positive(config.maxOutputChars, 40_000);
  const maxTail = positive(config.maxTail, 500);
  const defaultTail = positive(config.defaultTail, 100);
  const allowedContexts = Array.isArray(config.allowedContexts) ? config.allowedContexts.map(String) : [];
```

**依据 3 · 源码核查**：[index.js:118-134](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L118-L134)

get 的非零退出与文本投影字段不一致。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/kubectl.js:63-91](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/lib/kubectl.js#L63-L91)

计时、截断及错误路径。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

#### 缺口

- 实际 WSL 加载、模型输出及长日志开销未知
  **影响**：无法估算诊断链路的维护和复核时长
  **进一步探讨**：测试 profile 分别演练权限拒绝、命令不存在、超时和输出超限

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 把上下文绑定到每个访问集群的工具是否更可靠？

**研究主题**：新假设与验证

#### 完整回答

当前 contexts 列表已按允许值筛选，但默认读取和 status 探测仍可走当前集群。可验证在配置允许列表时要求显式 context 或固定配置目标，并把实际目标与失败原因一并传给调用者，能否减少对错集群的取证。用相同两个测试 context，随机改变当前 context，在默认、显式和禁用输入下对照请求目标、误阻断率和排障耗时。若仍能访问禁用集群，或频繁阻断正确目标且无误读改善，则不采纳。此方案尚未实现验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:83-97](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L83-L97)

目录列表已经筛选允许项。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:31-43](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/index.js#L31-L43)

状态路径依赖当前目标。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/kubectl.js:95-102](https://github.com/173787247/dsh-wsl-k8s/blob/71e6c1ce7690ae454f4e5052aa52f9ac59153a0b/lib/kubectl.js#L95-L102)

省略 context 不能得到固定目标。

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

#### 缺口

- 未测上下文变化的用户误判频率
  **影响**：无法确认显式选择的收益超过新增操作
  **进一步探讨**：以隔离测试集群记录实际 API 请求和诊断完成时间

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
