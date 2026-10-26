# dsh-wsl-helm

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[f63ba08](https://github.com/173787247/dsh-wsl-helm/tree/f63ba0892507034e8d31c3969c2b5e1b277fbd60)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-helm)
<!-- END META -->

> **实现功能**：将 Helm 的发布列表、状态和历史查询接入 DSH 模型工具。

> **核心亮点**：把 Helm CLI 的常用只读操作封装成 Agent 工具，控制动词并标识输出截断；增量是调用边界与呈现，发布语义仍属 Helm。详见[Q01](#research-q01)。

> **风险与缺陷**：guardContext 对空值直接放行，配置白名单不约束 Helm 默认上下文；此外 stderr 只在返回时裁剪而非累计限量。不能把“只读”误解为目标正确或无敏感信息。详见[Q03](#research-q03)。

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
  - [Q01 · 插件解决何种发布查询任务，真正的增量相对 Helm CLI 在哪里？](#detail-section-11)
  - [Q02 · 输入从模型工具到 Helm 子进程如何流转，超时与输出限制意味着什么？](#detail-section-12)
  - [Q03 · allowedContexts 能否在省略 context 时限制实际集群？](#detail-section-13)
  - [Q04 · 首次配置、持续查询和失败恢复的成本及敏感边界是什么？](#detail-section-14)
  - [Q05 · 从默认上下文漏洞如何推导可验证的改进？](#detail-section-15)
  - [Q06 · 何种条件下可试用只读工具，哪些判断仍需人工完成？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用于 Kubernetes 发布排查前的只读查询；合格输出须明确集群与命名空间，不能代替健康判断。详见[Q01](#research-q01)。

直接 Helm CLI 或运维控制台可查相同数据；插件仅降低 Agent 接入成本，不替代目标授权和发布判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Helm 可用性 | 看版本和部分环境 | env 可能含敏感路径/配置 |
| list/status/history | 查询 release | 需显式 context/namespace 和集群权限 |
| 输出限制 | 避免长 stdout 直接呈现 | stderr 仅返回截断，不是内存总上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt 与 Node | 必需 | 注册模型工具 | 无入口 |
| Helm CLI、kubeconfig 和网络 | 查询必需 | 访问 release | 工具报错/超时 |
| Kubernetes 只读权限与明确 context | 可信查询必需 | 固定实际目标 | 省略时可落默认集群 |
| 人工复核输出 | 运维判断需要 | 解释截断/敏感信息 | 状态不等于健康 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 运维者核只读账号、集群和 namespace | CLI 确认目标 |
| 查询 | Agent 显式传 context 调用 list/status/history | 与同条件 Helm 结果一致 |
| 判断 | 人工看截断/敏感信息与业务健康 | 不直接以文本自动升级/回滚 |
| 异常 | 核 Helm 错误、权限和默认上下文 | 停止引用错目标结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、Helm、kubeconfig/网络；金额未知 | 配只读权限、context 和白名单；耗时未知 | 省略 context 会退默认 |
| 持续使用 | Helm 子进程/集群 API/输出 token；资源未知 | 复核目标、截断与发布含义；频率未知 | stderr 未累计限量 |
| 失败恢复 | 日志/配置排查；金额未知 | 诊断超时、错集群和权限；耗时未知 | 插件不回滚部署 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发布查询 | list/status/history 的工具到 Helm 链 | 真实集群准确率和提效 |
| 命令边界 | 只读动词和 argv、release 名校验 | 默认上下文目标安全 |
| 输出控制 | timeout 与 stdout 返回裁剪 | stderr 内存峰值和敏感信息保护 |

> **思考**：guardContext 对空值直接放行，配置白名单不约束 Helm 默认上下文；此外 stderr 只在返回时裁剪而非累计限量。不能把“只读”误解为目标正确或无敏感信息。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Helm CLI 的常用只读操作封装成 Agent 工具，控制动词并标识输出截断；增量是调用边界与呈现，发布语义仍属 Helm。详见[Q01](#research-q01)。

把 Helm CLI 的常用只读操作封装成 Agent 工具，控制动词并标识输出截断；增量是调用边界与呈现，发布语义仍属 Helm。详见[Q01](#research-q01)。

结构化只读工具与 argv spawn 可借鉴；白名单必须约束实际默认目标，输出限量须覆盖累计缓冲。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

guardContext 对空值直接放行，配置白名单不约束 Helm 默认上下文；此外 stderr 只在返回时裁剪而非累计限量。不能把“只读”误解为目标正确或无敏感信息。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先用显式 context 的只读账号在测试集群对照原生 Helm；不要把 allowedContexts 或状态文本单独当自动决策依据。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实窄只读查询和输出处理；allowedContexts 对空 context 失效是静态调用链结论，未连接集群复现；新设计假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/helm.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、index.js、lib/helm.js；未执行目标插件/测试/Helm 或连接集群；旧 META 仅复用。
- 下一步：允许/禁止的两个集群间切换默认 context，省略与显式调用比较目标和拒绝；假 Helm 高 stderr/stdout 测内存、超时及截断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-helm](https://github.com/173787247/dsh-wsl-helm)
- **版本号**：0.1.1（[固定提交 f63ba08](https://github.com/173787247/dsh-wsl-helm/tree/f63ba0892507034e8d31c3969c2b5e1b277fbd60)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是每次解析实际 context 并统一按白名单检查、回显目标，同时限制 stderr 累计；双集群和高输出夹具评估正确率、延迟与内存。详见[Q05](#research-q05)。

允许/禁止的两个集群间切换默认 context，省略与显式调用比较目标和拒绝；假 Helm 高 stderr/stdout 测内存、超时及截断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 469 |
| .js | source | 2 | 299 | 277 | 5 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-helm/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-wsl-helm 的只读发布查询是否准确约束 Helm 目标集群与输出成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件解决何种发布查询任务，真正的增量相对 Helm CLI 在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH 中维护 Kubernetes 发布的运维者，先查询 release 列表、指定 release 状态和历史，再由人决定后续动作。合格结果要同时知道查询目标集群/命名空间、输出是否截断以及与原生 Helm 同条件一致；只读查询不证明部署健康，也不执行修复。相对直接运行 helm list/status/history，增量是窄模型工具、显式参数、基本错误包装和输出裁剪；Helm 的发布语义、权限与连接能力仍由上游提供。作者 README 列的就是这三类查询，代码还有 status 工具与别名。提示文本/底层 assertHelmArgs 提到 get/show/search/template，但本组件并未为模型注册通用这些能力，不能把白名单条目都算插件已交付工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-35](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/README.md#L5-L35)

作者描述只读任务、命令与配置。

<details>
<summary>查看原文（31行）</summary>

````text
Helm 只读：list / status / history。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-helm
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-helm
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `helm_status_tool` | helm 版本 |
| `helm_list` | release 列表 |
| `helm_release_status` | release 状态 |
| `helm_history` | 历史 |

## 配置要点

`allowedContexts / maxOutputChars / timeoutMs`

禁止 install/upgrade/uninstall。可配 `allowedContexts`。
````

</details>

**依据 2 · 源码核查**：[index.js:16-20](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L16-L20)

系统提示的命令描述。

```text
  ctx.systemPrompt.section({
    name: "tool:helm",
    order: 133,
    text: "dsh-wsl-helm is read-only (list/status/get/history/show/search/template). No install/upgrade/uninstall. Pair with dsh-wsl-k8s. Prefer helm_list then helm_status.",
  });
```

**依据 3 · 源码核查**：[index.js:22-95](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L22-L95)

status probe 与 list 工具注册。

<details>
<summary>查看原文（74行）</summary>

```text
  ctx.tools.register({
    name: "helm_status_tool",
    description: "Whether helm is on PATH; short version + env snippet (read-only).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
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
      }
    },
    presentCall: () => ({ card: "generic", title: "helm tool" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm tool", content: r.content }),
  });

  ctx.tools.register({
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
```

</details>

**依据 4 · 源码核查**：[index.js:98-200](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L98-L200)

status、别名与 history 的实际工具注册。

<details>
<summary>查看原文（103行）</summary>

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
  };

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
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "helm status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm status", content: r.content }),
  });

  ctx.tools.register({
    name: "helm_history",
    description: "helm history <release> (read-only).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["release"],
      properties: {
        release: { type: "string" },
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
        const rel = String(args.release || "").trim();
        if (!/^[A-Za-z0-9._-]+$/.test(rel)) throw new Error("invalid release name");
        const ctxName = guardContext(args.context, allowedContexts);
        const a = ["history", rel];
        if (args.namespace) a.push("-n", String(args.namespace));
        assertHelmArgs(a);
        const r = await runHelm(a, { timeoutMs, maxOut: maxOutputChars, kubeContext: ctxName });
        if (r.code !== 0) throw new Error(r.stderr || `exit ${r.code}`);
        return { ok: true, output: r.stdout, truncated: r.truncated };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "helm history" }),
    presentResult: (_a, r) => ({ card: "generic", title: "helm history", content: r.content }),
  });
}
```

</details>

**依据 5 · 源码核查**：[lib/helm.js:19-40](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L19-L40)

内部 allow set 广于实际模型工具。

<details>
<summary>查看原文（22行）</summary>

```text
// Allow only read-ish helm verbs
const ALLOWED = new Set(["list", "status", "get", "history", "show", "search", "version", "env", "template"]);
// env is read-only metadata for status probes

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
}
```

</details>

#### 缺口

- 未对真实集群和原生 Helm 输出作独立对照
  **影响**：不能证明查询成功率、运维节时或发布健康判断
  **进一步探讨**：隔离集群按相同 context/namespace 对比 CLI 与工具输出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入从模型工具到 Helm 子进程如何流转，超时与输出限制意味着什么？

**研究主题**：功能与机制

#### 完整回答

工具接收 allNamespaces/namespace/context 或 release，release 名按字母数字点下划线横线校验，参数数组交给 spawn("helm",...) 而非 shell。runHelm 将显式 kubeContext 追加 --kube-context，30 秒默认定时 SIGKILL；stdout 超过 maxOut 的两倍会杀进程，返回值最多 maxOut 字符并标记 truncated。stderr 在进程期间持续追加到字符串，只在返回时切前 4000 字符，故 maxOutputChars 不是进程内总内存上限。timeout reject 与 close resolve 存在多事件竞态但 Promise 只采纳首次；未在高输出下实测。错误被工具包装成 ok=false。status probe 还读取 helm env 中部分 HELM_* 行，需注意路径/仓库信息可敏感。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:62-95](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L62-L95)

list 参数、执行与错误包装。

<details>
<summary>查看原文（34行）</summary>

```text
  ctx.tools.register({
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
```

</details>

**依据 2 · 源码核查**：[index.js:98-108](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L98-L108)

release 名和 namespace/context 输入。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/helm.js:53-83](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L53-L83)

子进程、超时、stdout/stderr 收集与返回裁剪。

<details>
<summary>查看原文（31行）</summary>

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
  });
}
```

</details>

**依据 4 · 源码核查**：[index.js:22-57](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L22-L57)

status probe 读取版本和部分 Helm 环境。

<details>
<summary>查看原文（36行）</summary>

```text
  ctx.tools.register({
    name: "helm_status_tool",
    description: "Whether helm is on PATH; short version + env snippet (read-only).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
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
      }
    },
```

</details>

#### 缺口

- 未在真实 Helm/集群下测试大 stdout/stderr 与超时
  **影响**：不能给资源上限和失败恢复的实际保证
  **进一步探讨**：隔离假 helm 输出夹具测内存、超时、截断标记与错误

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · allowedContexts 能否在省略 context 时限制实际集群？

**研究主题**：缺陷与关键质疑

#### 完整回答

guardContext 将空 context 直接返回 undefined，不对 allowedContexts 做检查；runHelm 只有拿到非空 kubeContext 才加 --kube-context。于是调用者省略 context 时，Helm 会使用进程/配置的默认上下文，即使配置了 allowedContexts；如果默认集群不在列表中，源码没有阻断。allowedContexts 因此仅限制显式传入的名称，不是完整的集群授权边界。命名空间字符串交给单个 argv，防 shell 注入，但与集群的最终权限仍取决于 kubeconfig/RBAC。此处是静态调用链推导，未连接真实集群复现错目标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/helm.js:85-92](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L85-L92)

空 context 跳过白名单。

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

**依据 2 · 源码核查**：[lib/helm.js:53-57](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L53-L57)

未给 kubeContext 时不附加参数。

```text
export function runHelm(args, { timeoutMs = 30_000, maxOut = 60_000, kubeContext } = {}) {
  const final = [...args];
  if (kubeContext) final.push("--kube-context", String(kubeContext));
  return new Promise((resolvePromise, reject) => {
    const child = spawn("helm", final, { stdio: ["ignore", "pipe", "pipe"] });
```

**依据 3 · 源码核查**：[index.js:11-14](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L11-L14)

白名单来自配置。

```text
  const timeoutMs = positive(config.timeoutMs, 30_000);
  const maxOutputChars = positive(config.maxOutputChars, 60_000);
  const allowedContexts = Array.isArray(config.allowedContexts) ? config.allowedContexts.map(String) : [];
  console.log(`[dsh-wsl-helm] read-only allowedContexts=${allowedContexts.length || "any"}`);
```

**依据 4 · 源码核查**：[index.js:80-89](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L80-L89)

list 将 guardContext 结果直接用于 Helm。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[index.js:98-107](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L98-L107)

status 同样使用 guardContext。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 没有两个可区分集群的默认上下文切换实测
  **影响**：不能确认宿主实际默认目标与错查次数
  **进一步探讨**：切换允许/不允许默认 context，省略和显式输入分别核最终集群与拒绝行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次配置、持续查询和失败恢复的成本及敏感边界是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需要 DSH 工具服务、Helm CLI、可用 kubeconfig/网络、读取发布信息的 Kubernetes 权限和明确 context；作者 README 给出 web profile 安装与最低 DSH 版本，但未在本轮核兼容。持续查询消耗集群 API/网络、子进程与模型上下文，history/status 可能含敏感发布配置；maxOutputChars 限制展示但不等于脱敏或总进程内存限制。白名单维护、默认上下文确认与人工判断发布健康是常态成本。失败恢复包含超时、截断、错集群查询和凭据/网络问题的诊断；插件不提供事务/回滚，现金、查询延迟、人工耗时和事故率未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-44](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/README.md#L12-L44)

作者安装、配置和兼容说明。

<details>
<summary>查看原文（33行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-helm
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-helm
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `helm_status_tool` | helm 版本 |
| `helm_list` | release 列表 |
| `helm_release_status` | release 状态 |
| `helm_history` | 历史 |

## 配置要点

`allowedContexts / maxOutputChars / timeoutMs`

禁止 install/upgrade/uninstall。可配 `allowedContexts`。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-helm` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
````

</details>

**依据 2 · 源码核查**：[package.json:1-13](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/package.json#L1-L13)

Node 与包声明。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-wsl-helm",
  "version": "0.1.1",
  "description": "DeepSeek Harness WSL plugin: read-only helm list/status/history.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-helm.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "helm", "kubernetes"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 3 · 源码核查**：[lib/helm.js:53-83](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L53-L83)

子进程网络/资源和裁剪机制。

<details>
<summary>查看原文（31行）</summary>

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
  });
}
```

</details>

**依据 4 · 源码核查**：[index.js:62-95](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L62-L95)

工具呈现只读结果和截断状态。

<details>
<summary>查看原文（34行）</summary>

```text
  ctx.tools.register({
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
```

</details>

#### 缺口

- 集群 API 成本、输出敏感信息分布与人工运维时间未知
  **影响**：不能声称低成本或事故减少
  **进一步探讨**：在测试集群记录请求耗时、输出规模、脱敏审阅和错误处置时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从默认上下文漏洞如何推导可验证的改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

把固定只读操作映射为结构化工具和 argv spawn 是可借鉴的最小权限设计；但 allowedContexts 的语义需要覆盖省略参数。未验证方向是调用前取得 Helm 实际当前 context，将其解析为明确名称并始终检查白名单，再把所用目标连同 namespace 回显；必要时缓存当前 context，但须绑定 kubeconfig 版本，避免缓存漂移。还应限制 stderr 的累计字节而非仅返回切片，并区分输出截断与健康状态。最小实验在两个集群间切换默认 context，分别省略/显式传参，核调用实际目标、拒绝正确率、额外查询时间；高 stderr 夹具测内存。改进未实现，不能写成现有效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/helm.js:23-40](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L23-L40)

已有限定动词和部分子命令。

<details>
<summary>查看原文（18行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/helm.js:53-92](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L53-L92)

运行与空 context 白名单缺口。

<details>
<summary>查看原文（40行）</summary>

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
  });
}

export function guardContext(context, allowedContexts = []) {
  const c = String(context || "").trim();
  if (!c) return undefined;
  if (allowedContexts.length && !allowedContexts.includes(c)) {
    throw new Error(`kube-context not in allowedContexts: ${c}`);
  }
  return c;
}
```

</details>

**依据 3 · 源码核查**：[index.js:80-107](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L80-L107)

list/status 的上下文流转。

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

#### 缺口

- 显式解析/绑定方案未实现或测量
  **影响**：不能证明风险降低与额外成本可接受
  **进一步探讨**：隔离原型比较错目标率、误拒绝、延迟及资源峰值

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 何种条件下可试用只读工具，哪些判断仍需人工完成？

**研究主题**：采用判断

#### 完整回答

可在测试集群或明确显式 context 的只读账号下观察：先用原生 kubectl/helm 确认目标，再调用 list/status/history，核 output 与 truncated 标志。不能以 allowedContexts 配置替代运行时目标核实，也不要把 release 状态文本当业务健康或回滚依据；Helm 输出可能含敏感信息。采用建议为 observe，待省略 context 的白名单语义修正并在双集群夹具验证后再试用更广场景。本轮未安装、运行 Helm、接入集群或目标测试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/helm.js:85-92](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/lib/helm.js#L85-L92)

省略 context 绕过白名单检查。

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

**依据 2 · 源码核查**：[index.js:62-95](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/index.js#L62-L95)

列表只读查询与截断输出。

<details>
<summary>查看原文（34行）</summary>

```text
  ctx.tools.register({
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
```

</details>

**依据 3 · 作者声明**：[README.md:22-35](https://github.com/173787247/dsh-wsl-helm/blob/f63ba0892507034e8d31c3969c2b5e1b277fbd60/README.md#L22-L35)

作者说明工具与配置。

<details>
<summary>查看原文（14行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `helm_status_tool` | helm 版本 |
| `helm_list` | release 列表 |
| `helm_release_status` | release 状态 |
| `helm_history` | 历史 |

## 配置要点

`allowedContexts / maxOutputChars / timeoutMs`

禁止 install/upgrade/uninstall。可配 `allowedContexts`。
```

</details>

#### 缺口

- 无真实集群正确率或事故率证据
  **影响**：不能推荐生产环境自动决策
  **进一步探讨**：先双集群/只读账号验目标，再人工复核真实发布状态

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
