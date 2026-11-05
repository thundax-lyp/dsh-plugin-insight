# dsh-wsl-terraform

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8ef6649](https://github.com/173787247/dsh-wsl-terraform/tree/8ef66496eab6eb0a152727b290847b47a28d4cbf)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-terraform)
<!-- END META -->

> **功能**：在 DSH 中验证 Terraform 或 OpenTofu 配置，并读取计划摘要和状态地址。

> **亮点**：[Q01](#research-q01) 集中给出配置验证、计划计数及资源地址的初步线索。

> **主要限制**：[Q02](#research-q02) plan 继承环境和凭据，且异常退出可能被包装成成功。

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
  - [Q01 · 计划摘要适合支持哪个基础设施决策？](#detail-section-11)
  - [Q02 · 不会 apply 是否足以保证 plan 没有外部影响？](#detail-section-12)
  - [Q03 · 怎样先做低风险验收，能否改善失败可见性？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：基础设施工程师在审阅 IaC 变更前核对资源影响范围。

在明确工作区及后端下运行原生 Terraform 或 OpenTofu。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 计划与验证 | 初步评估 IaC 变更 | 实际后端和退出状态需核对 |
| 状态列表 | 读取资源地址 | 截断及最多 500 项限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Terraform 或 OpenTofu 及已初始化项目 | 按命令必需 | 执行验证与计划 | 依赖缺失将失败 |
| 明确后端和测试权限 | 受控验收必需 | 控制计划读取范围 | 可能触发非预期访问 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对项目、工作区和后端 | 只用测试凭据 |
| 检查 | 用户比对 validate、plan 和状态列表 | 确认详细退出码和原输出 |
| 退出 | 用户改用原生命令 | 未知状态不据此批准变更 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试环境费用未知 | 初始化并配置后端 | 明确二进制与权限 |
| 持续 | provider 开销未知 | 查输出截断及计划目标 | 关闭 refresh 仍需核对访问 |
| 失败 | 恢复开销未知 | 区分信号退出与真正无变更 | 先查原始状态再重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 计划初筛 | 提取计数和状态地址 | 摘要对实际计划的覆盖 |
| 状态诊断 | 详细退出码和截断字段 | 正常文本可见性及不同错误处理 |

> **思考**：[Q02](#research-q02) plan 继承环境和凭据，且异常退出可能被包装成成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中给出配置验证、计划计数及资源地址的初步线索。

[Q02](#research-q02) 单靠 stdout 正则和未区分的退出码不足以作变更依据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) plan 继承环境和凭据，且异常退出可能被包装成成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用隔离工程验证真正无变更与信号退出，遇不确定结果回原计划。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认计划和状态接线。真实 provider、锁和计划可靠性未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/tf.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定代码和包说明。未运行 Terraform、OpenTofu、provider、宿主或测试。
- 下一步：测试 0、2、信号结束、截断、远端后端、禁 refresh 和状态列表边界。

**分析版本**

- **仓库**：[173787247/dsh-wsl-terraform](https://github.com/173787247/dsh-wsl-terraform)
- **版本号**：0.1.1（[固定提交 8ef6649](https://github.com/173787247/dsh-wsl-terraform/tree/8ef66496eab6eb0a152727b290847b47a28d4cbf)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 区分详细退出码、截断和来源，比较失败误判率。

测试 0、2、信号结束、截断、远端后端、禁 refresh 和状态列表边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 117 | — | — | 472 |
| .js | source | 2 | 327 | 303 | 3 | — |
| .js | test | 1 | 11 | 10 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-terraform/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：基础设施工程师能否用会话内计划摘要做初筛，并识别未知结束？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 计划摘要适合支持哪个基础设施决策？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

工程师可在审阅 IaC 变更时，从会话触发 validate、plan 和 state list，先确认配置能否解析、是否预计改变资源以及状态中的地址。相比直接命令，工具会提取增改删计数并限制输出。合格结果是判断是否值得深入读原计划，不能用计数直接审批变更。摘要找不到常见英文行时返回 null，资源列表最多提供前 500 项，计数基于已经截断的 stdout。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/README.md#L5-L15)

作者描述计划摘要、状态和安装。

<details>
<summary>查看原文（11行）</summary>

````text
terraform/tofu：plan 摘要 + state list（永不 apply）。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-terraform
````

</details>

**依据 2 · 源码核查**：[index.js:44-65](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/index.js#L44-L65)

validate 注册。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.register({
    name: "tf_validate_probe",
    description: "terraform/tofu validate -no-color (read-only dry probe). Never applies.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["dir"],
      properties: { dir: { type: "string", description: "Terraform working directory" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false && v.error ? v.error : v.output || JSON.stringify(v) }],
    },
    timeoutMs: Math.min(timeoutMs, 60_000),
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await tfValidateProbe({ dir: args.dir, allowRoots, timeoutMs: Math.min(timeoutMs, 60_000) });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
```

</details>

**依据 3 · 源码核查**：[lib/tf.js:132-155](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/lib/tf.js#L132-L155)

文本解析与资源列表上限。

<details>
<summary>查看原文（24行）</summary>

```text
export function summarizePlan(text) {
  const s = String(text || "");
  const m = s.match(/Plan:\s*(\d+)\s*to add,\s*(\d+)\s*to change,\s*(\d+)\s*to destroy/i);
  if (m) {
    return { add: Number(m[1]), change: Number(m[2]), destroy: Number(m[3]), line: m[0] };
  }
  if (/No changes/i.test(s)) return { add: 0, change: 0, destroy: 0, line: "No changes" };
  return { add: null, change: null, destroy: null, line: null };
}

export async function tfStateList({ dir, allowRoots, timeoutMs = 60_000, maxOut = 40_000 } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const b = await bin();
  const r = await run(b, ["state", "list"], { cwd, timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`terraform state list failed: ${r.stderr || r.code}`);
  const resources = r.stdout.split("\n").filter(Boolean);
  return {
    ok: true,
    dir: cwd,
    count: resources.length,
    truncated: r.truncated,
    resources: resources.slice(0, 500),
  };
}
```

</details>

#### 缺口

- 缺少固定项目的 plan 对照
  **影响**：无法确认摘要能覆盖实际输出变体
  **进一步探讨**：用可控项目测试 0、2、错误和长状态

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不会 apply 是否足以保证 plan 没有外部影响？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

调用固定 plan -no-color -input=false -detailed-exitcode，没有 apply。默认 refresh=true，关闭时只传 -refresh=false，没有禁网、禁 provider 或限制继承凭据。进程以项目目录执行并继承宿主环境，配置可调用哪些后端及 provider 仍取决于环境。允许根只验证 cwd。退出码 1 才报错，0、2 以外的其他值也会进入 ok=true；stdout 超限时运行器杀进程，close 的退出码可能为空并落入成功路径。文本摘要无法区分这种未知结束和正常无变化。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:71-103](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/index.js#L71-L103)

计划参数和状态渲染。

<details>
<summary>查看原文（33行）</summary>

```text
    name: "tf_plan_summary",
    description: "terraform/tofu plan -no-color (read-only). Returns Plan: add/change/destroy counts + capped output. Never applies.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["dir"],
      properties: {
        dir: { type: "string", description: "Terraform working directory" },
        refresh: { type: "boolean", description: "Default true; set false for faster offline-ish plan" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `hasChanges=${v.hasChanges} ${v.summary?.line || ""}\n${(v.output || "").slice(0, 8000)}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await tfPlanSummary({
          dir: args.dir,
          refresh: args.refresh !== false,
          allowRoots,
          timeoutMs,
        });
```

</details>

**依据 2 · 源码核查**：[lib/tf.js:16-58](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/lib/tf.js#L16-L58)

目录、环境继承和杀进程。

<details>
<summary>查看原文（43行）</summary>

```text
export function resolveDir(dir, allowRoots = []) {
  const abs = resolve(String(dir || ".").trim() || ".");
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  if (allowRoots.length) {
    const roots = allowRoots.map((r) => {
      const a = resolve(r);
      return existsSync(a) ? realpathSync(a) : a;
    });
    const ok = roots.some((root) => {
      const x = root.replace(/[/\\]+$/, "");
      return real === x || real.startsWith(x + "/") || real.startsWith(x + "\\");
    });
    if (!ok) throw new Error(`terraform dir outside allowRoots: ${real}`);
  }
  return real;
}

export function run(bin, args, { cwd, timeoutMs = 120_000, maxOut = 80_000, env } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...(env || {}), TF_IN_AUTOMATION: "1", TF_INPUT: "0" },
    });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
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
        stderr: stderr.slice(0, 8000),
        truncated: stdout.length > maxOut,
      });
```

</details>

**依据 3 · 源码核查**：[lib/tf.js:105-129](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/lib/tf.js#L105-L129)

仅 exit 1 抛错及摘要条件。

<details>
<summary>查看原文（25行）</summary>

```text
export async function tfPlanSummary({
  dir,
  allowRoots,
  timeoutMs = 180_000,
  maxOut = 60_000,
  refresh = true,
} = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const b = await bin();
  const args = ["plan", "-no-color", "-input=false", "-detailed-exitcode"];
  if (refresh === false) args.push("-refresh=false");
  const r = await run(b, args, { cwd, timeoutMs, maxOut });
  // exit 0 = no changes, 2 = changes, 1 = error
  if (r.code === 1) throw new Error(`terraform plan failed: ${r.stderr || r.stdout || r.code}`);
  const text = (r.stdout || "") + (r.stderr ? "\n" + r.stderr : "");
  const summary = summarizePlan(text);
  return {
    ok: true,
    dir: cwd,
    exitCode: r.code,
    hasChanges: r.code === 2,
    truncated: r.truncated || text.length > maxOut,
    summary,
    output: text.slice(0, maxOut),
  };
```

</details>

#### 缺口

- 未测试 provider 网络、锁和不同进程结束方式
  **影响**：不能宣称关闭 refresh 即离线或无副作用
  **进一步探讨**：用隔离凭据和模拟 provider 核对外部访问、信号退出和工作区

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样先做低风险验收，能否改善失败可见性？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在可弃用已初始化的工程中明确目录、Terraform 或 OpenTofu 版本和后端，使用非生产凭据。先对照 validate 和 state list，再将工具 plan 与原生输出逐一核对；插件没有执行变更，失败应回到同配置的原生命令。若退出码或截断不明，暂停使用摘要。可验证只将 0 与 2 识别为成功并把截断、来源目录和退出状态展示到模型文本，是否减少将失败误判无变化。用超长输出、信号退出和真正无变更样本对照，若误判不减或正常计划大量被拒绝则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:84-103](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/index.js#L84-L103)

文本仅显示变化、摘要和输出片段。

<details>
<summary>查看原文（20行）</summary>

```text
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `hasChanges=${v.hasChanges} ${v.summary?.line || ""}\n${(v.output || "").slice(0, 8000)}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await tfPlanSummary({
          dir: args.dir,
          refresh: args.refresh !== false,
          allowRoots,
          timeoutMs,
        });
```

</details>

**依据 2 · 源码核查**：[lib/tf.js:67-101](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/lib/tf.js#L67-L101)

二进制优先级与验证。

<details>
<summary>查看原文（35行）</summary>

```text
export async function tfStatus() {
  const terraform = (await which("terraform")) || null;
  const tofu = (await which("tofu")) || null;
  return {
    ok: true,
    terraform,
    tofu,
    preferredBin: terraform || tofu || null,
    note: "plan/state list only — never apply/destroy",
  };
}

/** Fast read-only dry probe: `terraform/tofu validate` (no apply). */
export async function tfValidateProbe({ dir, allowRoots, timeoutMs = 60_000, maxOut = 40_000 } = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const b = await bin();
  const r = await run(b, ["validate", "-no-color"], { cwd, timeoutMs, maxOut });
  return {
    ok: r.code === 0,
    dir: cwd,
    bin: b,
    exitCode: r.code,
    truncated: r.truncated,
    output: (r.stdout || r.stderr || "").slice(0, maxOut),
  };
}

async function bin() {
  return (await which("terraform")) || (await which("tofu")) || "terraform";
}

export async function tfVersion({ timeoutMs } = {}) {
  const b = await bin();
  const r = await run(b, ["version"], { timeoutMs: timeoutMs || 15_000, maxOut: 10_000 });
  return { ok: true, bin: b, output: (r.stdout || r.stderr).trim() };
```

</details>

**依据 3 · 源码核查**：[lib/tf.js:105-139](https://github.com/173787247/dsh-wsl-terraform/blob/8ef66496eab6eb0a152727b290847b47a28d4cbf/lib/tf.js#L105-L139)

现有状态与文本解析基线。

<details>
<summary>查看原文（35行）</summary>

```text
export async function tfPlanSummary({
  dir,
  allowRoots,
  timeoutMs = 180_000,
  maxOut = 60_000,
  refresh = true,
} = {}) {
  const cwd = resolveDir(dir, allowRoots);
  const b = await bin();
  const args = ["plan", "-no-color", "-input=false", "-detailed-exitcode"];
  if (refresh === false) args.push("-refresh=false");
  const r = await run(b, args, { cwd, timeoutMs, maxOut });
  // exit 0 = no changes, 2 = changes, 1 = error
  if (r.code === 1) throw new Error(`terraform plan failed: ${r.stderr || r.stdout || r.code}`);
  const text = (r.stdout || "") + (r.stderr ? "\n" + r.stderr : "");
  const summary = summarizePlan(text);
  return {
    ok: true,
    dir: cwd,
    exitCode: r.code,
    hasChanges: r.code === 2,
    truncated: r.truncated || text.length > maxOut,
    summary,
    output: text.slice(0, maxOut),
  };
}

export function summarizePlan(text) {
  const s = String(text || "");
  const m = s.match(/Plan:\s*(\d+)\s*to add,\s*(\d+)\s*to change,\s*(\d+)\s*to destroy/i);
  if (m) {
    return { add: Number(m[1]), change: Number(m[2]), destroy: Number(m[3]), line: m[0] };
  }
  if (/No changes/i.test(s)) return { add: 0, change: 0, destroy: 0, line: "No changes" };
  return { add: null, change: null, destroy: null, line: null };
```

</details>

#### 缺口

- 未测初始化、锁和摘要对照
  **影响**：无法确定运行负担及改法收益
  **进一步探讨**：使用隔离状态与 provider，记录错误分类和人工复核时长

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
