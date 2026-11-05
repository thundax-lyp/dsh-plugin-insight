# dsh-wsl-helm

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0162d90](https://github.com/173787247/dsh-wsl-helm/tree/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-helm)
<!-- END META -->

> **功能**：在 DSH 中列出 Helm 发布并查看状态与历史。

> **亮点**：[Q01](#research-q01) 将发布枚举、状态与历史接进同一诊断会话。

> **主要限制**：[Q02](#research-q02) 允许列表不约束省略 context 的调用，输出也可能因截断而不全。

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
  - [Q01 · Helm 查询怎样帮助定位发布异常？](#detail-section-11)
  - [Q02 · 读操作如何选择集群，允许列表有何缺口？](#detail-section-12)
  - [Q03 · 怎样验收查询并减少读错集群？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 Kubernetes 发布的值班者需要核对 release 与 revision。

直接运行指定 kube-context 与 namespace 的 Helm 查询。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 发布枚举 | 确定 release 与命名空间 | 允许请求全部命名空间 |
| 状态与历史 | 核对部署 revision | 默认 context 未受允许列表检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Helm 与 kubeconfig | 必需 | 连接测试集群 | 查询失败或使用错误上下文 |
| 限制到测试集群的权限 | 受控验收必需 | 控制读取范围 | 默认 context 可超出预期 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户设置独立 kubeconfig | 仅测试凭据 |
| 取证 | 用户显式选择目标，读取状态和历史 | 同原命令比对 revision |
| 退出 | 用户退回 Helm | 不以截断历史作结论 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试集群资源未知 | 配置 Helm 与读取权限 | 需要独立凭据 |
| 持续 | 查询开销未知 | 确认实际集群和输出完整性 | 可发生输出截断 |
| 失败 | 排障资源未知 | 查权限或用原命令回读 | 不能默认空结果即无发布 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发布诊断 | 可查列表、状态及历史 | 事故诊断时长 |
| 上下文限制 | 显式参数受筛选 | 默认目标与实际 RBAC |

> **思考**：[Q02](#research-q02) 允许列表不约束省略 context 的调用，输出也可能因截断而不全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将发布枚举、状态与历史接进同一诊断会话。

[Q02](#research-q02) 子进程按固定动词执行，允许列表未覆盖空值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 允许列表不约束省略 context 的调用，输出也可能因截断而不全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅用测试 kubeconfig 对照同名发布，确定目标后再解释结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认查询和目标选择分支。实际访问范围、效率与假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/helm.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定源码，未运行 Helm、Kubernetes、宿主或目标测试。
- 下一步：用非生产集群验证显式、空和禁用上下文，检查截断与权限拒绝。

**分析版本**

- **仓库**：[173787247/dsh-wsl-helm](https://github.com/173787247/dsh-wsl-helm)
- **版本号**：0.1.1（[固定提交 0162d90](https://github.com/173787247/dsh-wsl-helm/tree/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 绑定并回显目标后，以同名 release 对照错集群率。

用非生产集群验证显式、空和禁用上下文，检查截断与权限拒绝。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 469 |
| .js | source | 2 | 299 | 277 | 5 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-helm/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：值班者能否从 DSH 读取 Helm 发布线索，并确认实际集群和命名空间？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Helm 查询怎样帮助定位发布异常？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

值班者可从 DSH 列出 release，再查指定发布状态和历史，定位本次部署与上一个 revision。原生 Helm 可提供相同结果，工具的增量是可由模型填入命名空间、context 与发布名并限定返回长度。helm_release_status 与 helm_status 共用实现，诊断结果仍需与实际集群及命名空间核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/README.md#L5-L15)

作者定位为 list/status/history。

<details>
<summary>查看原文（11行）</summary>

````text
Helm 只读：list / status / history。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-helm
````

</details>

**依据 2 · 源码核查**：[index.js:63-96](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L63-L96)

list 支持全命名空间。

<details>
<summary>查看原文（34行）</summary>

```text
    name: "helm_list",
    description: "helm list (-A optional). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        allNamespaces: { type: "boolean" },
        namespace: { type: "string" },
        context: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const ctxName = guardContext(args?.context, allowedContexts);
        const a = ["list"];
        if (args?.allNamespaces) a.push("-A");
        else if (args?.namespace) a.push("-n", String(args.namespace));
        assertHelmArgs(a);
        const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
        if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
        return { ok: true, output: r.stdout, truncated: r.truncated };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "helm list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm list", content: r.content }),
  });
```

</details>

**依据 3 · 源码核查**：[index.js:98-118](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L98-L118)

发布状态与目标。

<details>
<summary>查看原文（21行）</summary>

```text
  async function executeReleaseStatus(args) {
    const rel = String(args.release || "").trim();
    if (!/^[A-Za-z0-9._-]+$/.test(rel)) throw new Error("invalid release name");
    const ctxName = guardContext(args.context, allowedContexts);
    const a = ["status", rel];
    if (args.namespace) a.push("-n", String(args.namespace));
    assertHelmArgs(a);
    const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
    if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
    return { ok: true, release: rel, output: r.stdout, truncated: r.truncated };
  }

  const releaseStatusParams = {
    type: "object",
    additionalProperties: false,
    required: ["release"],
    properties: {
      release: { type: "string" },
      namespace: { type: "string" },
      context: { type: "string" },
    },
```

</details>

**依据 4 · 源码核查**：[index.js:121-155](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L121-L155)

状态和别名。

<details>
<summary>查看原文（35行）</summary>

```text
  ctx.tools.register({
    name: "helm_status",
    description: "helm status <release> (read-only release details).",
    parameters: releaseStatusParams,
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await executeReleaseStatus(args);
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "helm status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm status", content: r.content }),
  });

  ctx.tools.register({
    name: "helm_release_status",
    description: "Alias of helm_status (read-only).",
    parameters: releaseStatusParams,
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await executeReleaseStatus(args);
      } catch (e) {
```

</details>

#### 缺口

- 无真实发布事故的对照
  **影响**：无法量化排障速度与正确率
  **进一步探讨**：对同一失败 release 对照直接 Helm 和会话查询

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 读操作如何选择集群，允许列表有何缺口？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

工具固定 list、status、history 入口，args 校验以第一个动词为主，直接 spawn Helm。允许上下文检查只覆盖非空输入，省略 context 会走 Helm 默认目标，即使配置的允许列表不包含当前集群。list 可请求全部命名空间，插件不另限制授权范围。release 名称字符规则允许连字符且直接作为位置参数，源码未检查旗标形名字能否被 Helm 当成选项。输出截断使长历史可能只见一部分。状态工具运行 helm env 并选择部分环境行，实际访问与返回仍需按 Host 凭据和授权核查。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:29-55](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L29-L55)

工具探测与部分 env 输出。

<details>
<summary>查看原文（27行）</summary>

```text
    async execute() {
      const bin = (await which("helm")) || null;
      if (!bin) return { ok: true, helm: null, allowedContexts };
      try {
        const r = await runHelm(["version", "--short"], { timeoutMs: 10_000 });
        let envSnippet = null;
        try {
          const env = await runHelm(["env"], { timeoutMs: 10_000, maxOut: 8_000 });
          if (env.code === 0) {
            envSnippet = env.stdout
              .split("\n")
              .filter((l) => /HELM_(NAMESPACE|DRIVER|REGISTRY|REPOSITORY)/i.test(l))
              .slice(0, 12)
              .join("\n");
          }
        } catch {
          /* ignore */
        }
        return {
          ok: true,
          helm: bin,
          version: r.stdout.trim(),
          allowedContexts,
          envSnippet: envSnippet || null,
        };
      } catch (e) {
        return { ok: true, helm: bin, allowedContexts, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 2 · 源码核查**：[index.js:80-107](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L80-L107)

远端查询的上下文与命名空间。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args) {
      try {
        const ctxName = guardContext(args?.context, allowedContexts);
        const a = ["list"];
        if (args?.allNamespaces) a.push("-A");
        else if (args?.namespace) a.push("-n", String(args.namespace));
        assertHelmArgs(a);
        const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
        if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
        return { ok: true, output: r.stdout, truncated: r.truncated };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "helm list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm list", content: r.content }),
  });

  async function executeReleaseStatus(args) {
    const rel = String(args.release || "").trim();
    if (!/^[A-Za-z0-9._-]+$/.test(rel)) throw new Error("invalid release name");
    const ctxName = guardContext(args.context, allowedContexts);
    const a = ["status", rel];
    if (args.namespace) a.push("-n", String(args.namespace));
    assertHelmArgs(a);
    const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
    if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
    return { ok: true, release: rel, output: r.stdout, truncated: r.truncated };
```

</details>

**依据 3 · 源码核查**：[lib/helm.js:23-39](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/lib/helm.js#L23-L39)

固定命令检查。

<details>
<summary>查看原文（17行）</summary>

```text
export function assertHelmArgs(args) {
  const list = Array.isArray(args) ? args.map(String) : [];
  if (!list.length) throw new Error("helm args required");
  const verb = list[0];
  if (!ALLOWED.has(verb)) throw new Error(`helm verb not allowed: ${verb} (read-only plugin)`);
  if (verb === "get") {
    const sub = list[1] || "";
    const ok = new Set(["all", "hooks", "manifest", "notes", "values", "metadata"]);
    if (!ok.has(sub)) throw new Error(`helm get subcommand not allowed: ${sub}`);
  }
  if (verb === "show") {
    const sub = list[1] || "";
    const ok = new Set(["all", "chart", "readme", "values", "crds"]);
    if (!ok.has(sub)) throw new Error(`helm show subcommand not allowed: ${sub}`);
  }
  // template can render charts locally — allow but cap output
  return list;
```

</details>

**依据 4 · 源码核查**：[lib/helm.js:53-76](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/lib/helm.js#L53-L76)

仅显式加入 kubeContext，并截断。

<details>
<summary>查看原文（24行）</summary>

```text
export function runHelm(args, { timeoutMs = 30_000, maxOut = 60_000, kubeContext } = {}) {
  const final = [...args];
  if (kubeContext) final.push("--kube-context", String(kubeContext));
  return new Promise((resolvePromise, reject) => {
    const child = spawn("helm", final, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("helm timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
```

</details>

**依据 5 · 源码核查**：[lib/helm.js:85-92](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/lib/helm.js#L85-L92)

空值在允许列表检查前返回。

```text
export function guardContext(context, allowedContexts = []) {
  const c = String(context || "").trim();
  if (!c) return undefined;
  if (allowedContexts.length && !allowedContexts.includes(c)) {
    throw new Error(`kube-context not in allowedContexts: ${c}`);
  }
  return c;
}
```

#### 缺口

- 实际 Helm 旗标解析与 RBAC 未测
  **影响**：不能保证读取在允许 context 或预期命名空间
  **进一步探讨**：用两个可弃用 context 核对默认目标、显式拒绝及异常 release 输入

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收查询并减少读错集群？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在只有非生产凭据的 Host 安装 Helm，明确设置 kubeconfig 与最小读取权限，用显式 context 查询已知发布。将工具结果与同 context 的原命令比对。发现目标或输出完整性不明就回原命令，停用插件不改变发布流程。可验证要求每次远端查询绑定并回显 context 和 namespace，是否减少换默认集群后读错 revision。用两个同名 release 和可预测历史比较旧输出与绑定版的错读、延迟及误拒绝。无准确性改善或增加不可接受的阻断则弃用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-24](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L6-L24)

Host 接入配置和工具。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-helm] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxOutputChars = positive(config.maxOutputChars, 60_000);
  const allowedContexts = Array.isArray(config.allowedContexts) ? config.allowedContexts.map(String) : [];
  console.log(`[dsh-wsl-helm] read-only allowedContexts=${allowedContexts.length || "any"}`);

  ctx.systemPrompt.section({
    name: "tool:helm",
    order: 133,
    text: "dsh-wsl-helm is read-only (list/status/get/history/show/search/template). No install/upgrade/uninstall. Pair with dsh-wsl-k8s. Prefer helm_list then helm_status.",
  });

  ctx.tools.register({
    name: "helm_status_tool",
    description: "Whether helm is on PATH; short version + env snippet (read-only).",
```

</details>

**依据 2 · 源码核查**：[index.js:80-107](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/index.js#L80-L107)

默认和显式查询的接线。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args) {
      try {
        const ctxName = guardContext(args?.context, allowedContexts);
        const a = ["list"];
        if (args?.allNamespaces) a.push("-A");
        else if (args?.namespace) a.push("-n", String(args.namespace));
        assertHelmArgs(a);
        const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
        if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
        return { ok: true, output: r.stdout, truncated: r.truncated };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "helm list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm list", content: r.content }),
  });

  async function executeReleaseStatus(args) {
    const rel = String(args.release || "").trim();
    if (!/^[A-Za-z0-9._-]+$/.test(rel)) throw new Error("invalid release name");
    const ctxName = guardContext(args.context, allowedContexts);
    const a = ["status", rel];
    if (args.namespace) a.push("-n", String(args.namespace));
    assertHelmArgs(a);
    const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
    if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
    return { ok: true, release: rel, output: r.stdout, truncated: r.truncated };
```

</details>

**依据 3 · 源码核查**：[lib/helm.js:53-81](https://github.com/173787247/dsh-wsl-helm/blob/0162d90672fb4ea2225cacf7f2e7d8f1bc6e4d82/lib/helm.js#L53-L81)

输出边界与超时。

<details>
<summary>查看原文（29行）</summary>

```text
export function runHelm(args, { timeoutMs = 30_000, maxOut = 60_000, kubeContext } = {}) {
  const final = [...args];
  if (kubeContext) final.push("--kube-context", String(kubeContext));
  return new Promise((resolvePromise, reject) => {
    const child = spawn("helm", final, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("helm timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

#### 缺口

- 未验证安装权限、切换上下文和实际耗时
  **影响**：无法确认减少错读的效果
  **进一步探讨**：用不同命名空间的同名发布测试结果和退出

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
