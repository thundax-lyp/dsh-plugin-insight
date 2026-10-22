# dsh-wsl-terraform

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[549e4b8](https://github.com/173787247/dsh-wsl-terraform/tree/549e4b82570a4a13ab900ac03c5593421a8c16e4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform)
<!-- END META -->

> **实现功能**：在DSH中检查Terraform/OpenTofu状态、验证配置、解析plan变更数量和列出state资源地址，不提供apply或destroy工具。

> **核心亮点**：把固定validate/plan/state命令与参数化目录、计数/错误结果接入DSH，限制模型可选IaC动作。详见[Q02](#research-q02)。

> **风险与缺陷**：plan仅exit1拒绝，其他exit/null可ok:true；先截stdout可能丢Plan尾行，state500条截断未标，render隐藏部分状态。allowRoots默认空无限制且继承Host环境，不等价沙箱。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 它帮助什么基础设施审阅任务？](#detail-section-11)
  - [Q02 · 固定CLI接线和摘要具体如何形成？](#detail-section-12)
  - [Q03 · 哪些返回可能被误读为安全或完整？](#detail-section-13)
  - [Q04 · 启动与操作需要哪些条件？](#detail-section-14)
  - [Q05 · 超时、输出预算和恢复有什么局限？](#detail-section-15)
  - [Q06 · 成本效果和推荐是什么，怎样继续改进？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有初始化Terraform/OpenTofu项目的开发/运维人员，在DSH查CLI版本、validate、变更计数摘要和state资源地址列表。适合先了解拟变更数量、验证配置与资源范围，不提供apply/destroy接口，不取代完整plan评审、云权限和变更审批。

合格结果必须明确目录、实际CLI/版本、exitcode、是否完整与摘要未知项。add/change/destroy计数不说明具体风险或费用，state list只资源地址不证明资源状态正确；No changes也需对应成功完整plan，不能从输出没解析到Plan行推为零变更。

人工执行同CLI是基线。插件减少命令接线并给结构结果，仍依赖项目/provider/backend和云身份。没有apply动作是代码可证的窄范围，不能外推成读取任意陌生项目都没有网络、本地写入或外部程序行为。

人工同CLI执行validate/plan/state并评完整结果；插件减少接线但不替代IaC评审、凭据控制和云审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态/版本 | 查实际Terraform/tofu | version未严格核exit，PATH不是兼容验收 |
| validate | 检配置 | 依初始化provider与宿主环境 |
| plan计数 | add/change/destroy摘要 | 默认refresh，截断/其他exit需核 |
| state地址 | 列资源地址 | 500条上限未完整标记 |
| 固定命令面 | 不提供apply/destroy | 不构成provider/网络/文件沙箱 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools/systemPrompt | 必需 | 注册五工具含alias | kit可选不代表已配环境 |
| bash及terraform或tofu | 必需 | PATH探测/执行 | which缺error监听，缺bash要核失败 |
| 已初始化项目/provider/backend | plan/state | 配置验证/资源查询 | 不自动init，不安装provider |
| 最小云/状态读取权限 | 远端场景 | plan刷新/读state | Host环境被继承，需人工控制 |
| 显式狭窄allowRoots | 使用前提 | 限目录 | 空数组默认无限制 |
| 可信项目和完整plan审阅 | 业务条件 | 判断资源变更 | 计数不能替代危险项评审 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定CLI/provider和项目、最小凭据/根 | 不直接给陌生项目Host凭据 |
| 状态 | 核实际CLI/版本 | status可见不等于backend可用 |
| 校验 | validate先行 | 结构ok:false也要核error/output |
| 计划 | 明确refresh策略并单目录串行 | 仅exit0/2解释成功，检查truncated |
| 资源 | state地址与完整原始列表核对 | >500或字节cap不当全部 |
| 决策 | 人评完整plan/变更审批 | 插件不执行apply/destroy |
| 恢复 | 核锁/子进程/错误来源 | 超时不推断远端完全停止 |

包无npm运行依赖自动装CLI；README首表版本0.1.0与包0.1.1有滞后，以固定包声明为版本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用IaC项目/provider与凭据资源 | 初始化项目/provider、核最小凭据/根/版本 | 不替代原工具链准备，时间/费用未知 |
| 持续使用 | plan刷新/状态网络、provider计算与模型阅读 | 检查项目状态与plan内容 | 云API/时延/费用依项目，不估金额 |
| 失败恢复 | 重复plan/进程清理资源 | 核锁/凭据/截断误判、CLI/进程清理 | 缺明确run/kill/partial收据增加复核，时间/费用未知 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 限动作 | 固定validate/plan/state，不开放apply | 不是执行沙箱或无网络保证 |
| 便捷计数 | 英文summary regex与state地址 | 长输出/其他exit会影响正确性 |
| 简化调用 | DSH参数化工具和统一错误 | 无同任务效率测量 |

> **思考**：plan仅exit1拒绝，其他exit/null可ok:true；先截stdout可能丢Plan尾行，state500条截断未标，render隐藏部分状态。allowRoots默认空无限制且继承Host环境，不等价沙箱。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把固定validate/plan/state命令与参数化目录、计数/错误结果接入DSH，限制模型可选IaC动作。详见[Q02](#research-q02)。

把固定validate/plan/state命令与参数化目录、计数/错误结果接入DSH，限制模型可选IaC动作。详见[Q02](#research-q02)。

run有error监听和timeout kill，优于无异常分支；stdout长度到2×maxOut才kill、返回前再裁maxOut，有truncated标记。stderr无限拼字符串，末尾裁8000只限制返回，不限内存。maxOut字符长度也不等于字节或token配额。

没有执行signal到run，没有进程组/后代管理；超时reject后child close可能再resolve但Promise已settled，不代表已杀远端provider事务。工具捕获异常只返error字符串，缺run ID/信号/是否因超限被杀的分类。which独立bash只有close监听，无error或超时，主run保护不覆盖二进制探测。

作者测试仅英文summary一例，不覆盖真实CLI、exit/state截断/信号。tfVersion不核r.code直接ok:true，可能把失败文本当version。读取固定源码不应把作者“只读”标签当这些恢复路径均已验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

plan仅exit1拒绝，其他exit/null可ok:true；先截stdout可能丢Plan尾行，state500条截断未标，render隐藏部分状态。allowRoots默认空无限制且继承Host环境，不等价沙箱。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先假CLI验证exit/截断收据和明确批准根/最小权限，不直接在生产云项目启用。详见[Q06](#research-q06)。

合格结果必须明确目录、实际CLI/版本、exitcode、是否完整与摘要未知项。add/change/destroy计数不说明具体风险或费用，state list只资源地址不证明资源状态正确；No changes也需对应成功完整plan，不能从输出没解析到Plan行推为零变更。

人工执行同CLI是基线。插件减少命令接线并给结构结果，仍依赖项目/provider/backend和云身份。没有apply动作是代码可证的窄范围，不能外推成读取任意陌生项目都没有网络、本地写入或外部程序行为。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。固定无apply动作成立，其他exit误归成功、摘要/资源截断与默认无根/执行预算边界需核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.js、lib/tf.js、test/tf.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取全部index/lib核心、包/bundle/README与作者正则测试；不运行Terraform/OpenTofu、云/state访问或宿主测试。
- 下一步：可继续用假CLI覆盖0/1/2/7/null、末尾Plan裁剪、501state/半行、并发取消和大stderr，对比结果/完整性及残留。

**分析版本**

- **仓库**：[173787247/dsh-wsl-terraform](https://github.com/173787247/dsh-wsl-terraform)
- **版本号**：0.1.1（[固定提交 549e4b8](https://github.com/173787247/dsh-wsl-terraform/tree/549e4b82570a4a13ab900ac03c5593421a8c16e4)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索仅exit0/2成功、完整原件hash/摘要来源、state完整性收据和最小env/signal/单目录串行，比较误判与资源成本；未实现。详见[Q06](#research-q06)。

可继续用假CLI覆盖0/1/2/7/null、末尾Plan裁剪、501state/半行、并发取消和大stderr，对比结果/完整性及残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 117 | — | — | 472 |
| .js | source | 2 | 327 | 303 | 3 | — |
| .js | test | 1 | 11 | 10 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform/issues?q=is%3Aissue+created%3A2026-09-22T06%3A36%3A22.478Z..2026-10-22T06%3A36%3A22.478Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-terraform/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A36%3A22.478Z..2026-10-22T06%3A36%3A22.478Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本核Terraform/OpenTofu窄动作面，重点成功/变更/截断收据与Host执行边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它帮助什么基础设施审阅任务？

**研究主题**：场景与需求

#### 完整回答

面向已有初始化Terraform/OpenTofu项目的开发/运维人员，在DSH查CLI版本、validate、变更计数摘要和state资源地址列表。适合先了解拟变更数量、验证配置与资源范围，不提供apply/destroy接口，不取代完整plan评审、云权限和变更审批。

合格结果必须明确目录、实际CLI/版本、exitcode、是否完整与摘要未知项。add/change/destroy计数不说明具体风险或费用，state list只资源地址不证明资源状态正确；No changes也需对应成功完整plan，不能从输出没解析到Plan行推为零变更。

人工执行同CLI是基线。插件减少命令接线并给结构结果，仍依赖项目/provider/backend和云身份。没有apply动作是代码可证的窄范围，不能外推成读取任意陌生项目都没有网络、本地写入或外部程序行为。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-5](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/README.md#L5-L5)

plan/state never apply作者定位。

```text
terraform/tofu：plan 摘要 + state list（永不 apply）。
```

**依据 2 · 源码核查**：[index.js:44-103](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/index.js#L44-L103)

validate和plan工具面。

<details>
<summary>查看原文（60行）</summary>

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
    presentCall: () => ({ card: "generic", title: "tf validate" }),
    presentResult: (_a, r) => ({ card: "generic", title: "tf validate", content: r.content }),
  });

  ctx.tools.register({
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

**依据 3 · 源码核查**：[lib/tf.js:114-139](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L114-L139)

固定plan argv与计数解析。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/tf.js:142-154](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L142-L154)

state地址列表。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定CLI接线和摘要具体如何形成？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

工具状态先bash command -v探terraform/tofu，优先terraform，工具包含status、validate、plan_summary、state_list与兼容别名terraform_state_list。resolveDir用已有路径realpath，配置roots时核归属，然后spawn固定argv，在cwd执行，继承Host env并强制TF_IN_AUTOMATION/TF_INPUT。没有模型可传任意子命令/额外argv的参数。

plan用-no-color/-input=false/-detailed-exitcode，refresh=false才额外加-refresh=false。run收stdout并截maxOut，summarizePlan正则抓英文Plan数量或No changes，否则三个值null。null保留未知比编0好，但输入输出截断/退出分类会影响可信度。state list分行计数并最多返500。

贡献是只开放准备/审阅动作、目录参数和统一结果接DSH，避免直接给模型整个Terraform shell；不是新IaC分析算法，没有JSON plan语义核查或危险变更判定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tf.js:5-30](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L5-L30)

CLI探测与物理目录。

<details>
<summary>查看原文（26行）</summary>

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((r) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => r(c === 0 ? out.trim() : ""));
  });
}

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
```

</details>

**依据 2 · 源码核查**：[lib/tf.js:33-58](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L33-L58)

fixed argv spawn/环境/收集。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/tf.js:94-101](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L94-L101)

CLI优先与版本。

```text
async function bin() {
  return (await which("terraform")) || (await which("tofu")) || "terraform";
}

export async function tfVersion({ timeoutMs } = {}) {
  const b = await bin();
  const r = await run(b, ["version"], { timeoutMs: timeoutMs || 15_000, maxOut: 10_000 });
  return { ok: true, bin: b, output: (r.stdout || r.stderr).trim() };
```

**依据 4 · 源码核查**：[lib/tf.js:104-139](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L104-L139)

plan参数和英文正则。

<details>
<summary>查看原文（36行）</summary>

```text
/** Read-only: terraform plan -no-color (never apply). */
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

**依据 5 · 源码核查**：[index.js:132-165](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/index.js#L132-L165)

state和兼容别名。

<details>
<summary>查看原文（34行）</summary>

```text
  ctx.tools.register({
    name: "tf_state_list",
    description: "terraform/tofu state list (read-only resource addresses).",
    parameters: stateListParams,
    output: stateListOutput,
    timeoutMs: Math.min(timeoutMs, 60_000),
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await executeStateList(args);
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "tf state list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "tf state list", content: r.content }),
  });

  ctx.tools.register({
    name: "terraform_state_list",
    description: "Alias of tf_state_list (read-only).",
    parameters: stateListParams,
    output: stateListOutput,
    timeoutMs: Math.min(timeoutMs, 60_000),
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await executeStateList(args);
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "terraform state list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "terraform state list", content: r.content }),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些返回可能被误读为安全或完整？

**研究主题**：缺陷与关键质疑

#### 完整回答

allowRoots只有非空才约束，默认空数组无限制cwd；已有目录realpath可拒根外链接，但不是provider/data/backend读取权限沙箱。run继承全部Host环境，默认plan refresh=true，配置/provider可能读取远端状态、运行外部数据源/程序或产生锁/本地产物；源码没有宿主subprocess/sandboxPolicy或凭据最小化。它不显式apply基础设施，仍不能称所有动作纯副作用自由。

plan只对exit1抛错，其他非0/2包括stdout超限kill后的null close code都走ok:true，hasChanges仅code2。因而“不等于2”不能安全解释为无变化。stdout在run先截，摘要通常在末尾，若输出超过cap，可能summary null；工具render再截8000字符且不显示exit/truncated字段，模型看到的正文可能掩盖完整性状态。

state resources先取run已截字符串，count为这些分行数量，可能含最后半行；返回再slice500，却只沿用字节截断flag，没有>500的条数截断标记。正常多资源列表也可count>500但resources仅500而truncated=false。所有工具concurrencySafe含plan，同目录plan可能争backend锁；不是独立任务队列。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tf.js:16-30](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L16-L30)

非空roots才约束。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/tf.js:33-58](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L33-L58)

全env/截stdout/close code。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/tf.js:104-129](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L104-L129)

refresh默认与仅exit1拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
/** Read-only: terraform plan -no-color (never apply). */
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

**依据 4 · 源码核查**：[lib/tf.js:142-154](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L142-L154)

500条限制没修truncated。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[index.js:82-103](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/index.js#L82-L103)

render裁剪和plan concurrencySafe。

<details>
<summary>查看原文（22行）</summary>

```text
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

#### 缺口

- 具体provider/backend/外部数据源的行为与云权限未读项目配置。
  **影响**：不能给陌生项目无副作用或云最小权限保证。
  **进一步探讨**：可继续用无云权限的受控项目核只读凭据、provider/external能力与锁/文件写入。
- 超限kill、其他exit、长plan/500+state实际呈现未受控运行。
  **影响**：不称已发生误报，但代码不保证正确状态分类。
  **进一步探讨**：假CLI覆盖0/1/2/7/null、尾部摘要与501地址，核结构与render都保留状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动与操作需要哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools/systemPrompt | 必需 | 注册五工具含alias | kit可选不代表已配环境 |
| bash及terraform或tofu | 必需 | PATH探测/执行 | which缺error监听，缺bash要核失败 |
| 已初始化项目/provider/backend | plan/state | 配置验证/资源查询 | 不自动init，不安装provider |
| 最小云/状态读取权限 | 远端场景 | plan刷新/读state | Host环境被继承，需人工控制 |
| 显式狭窄allowRoots | 使用前提 | 限目录 | 空数组默认无限制 |
| 可信项目和完整plan审阅 | 业务条件 | 判断资源变更 | 计数不能替代危险项评审 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定CLI/provider和项目、最小凭据/根 | 不直接给陌生项目Host凭据 |
| 状态 | 核实际CLI/版本 | status可见不等于backend可用 |
| 校验 | validate先行 | 结构ok:false也要核error/output |
| 计划 | 明确refresh策略并单目录串行 | 仅exit0/2解释成功，检查truncated |
| 资源 | state地址与完整原始列表核对 | >500或字节cap不当全部 |
| 决策 | 人评完整plan/变更审批 | 插件不执行apply/destroy |
| 恢复 | 核锁/子进程/错误来源 | 超时不推断远端完全停止 |

包无npm运行依赖自动装CLI；README首表版本0.1.0与包0.1.1有滞后，以固定包声明为版本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/package.json#L1-L13)

版本/Node/bundle与无CLI安装。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-wsl-terraform",
  "version": "0.1.1",
  "description": "DeepSeek Harness WSL plugin: terraform/tofu plan summary + state list (never apply).",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-terraform.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "terraform"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/cordis.patch.yml#L1-L7)

空roots默认。

```text
- insert:
    - id: dsh-wsl-terraform
      name: dsh-wsl-terraform
      config:
        enabled: true
        timeoutMs: 180000
        allowRoots: []
```

**依据 3 · 源码核查**：[lib/tf.js:79-95](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L79-L95)

validate和bin选择。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 4 · 作者声明**：[README.md:7-10](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/README.md#L7-L10)

作者首表旧版本。

```text
| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 超时、输出预算和恢复有什么局限？

**研究主题**：工程质量与复用

#### 完整回答

run有error监听和timeout kill，优于无异常分支；stdout长度到2×maxOut才kill、返回前再裁maxOut，有truncated标记。stderr无限拼字符串，末尾裁8000只限制返回，不限内存。maxOut字符长度也不等于字节或token配额。

没有执行signal到run，没有进程组/后代管理；超时reject后child close可能再resolve但Promise已settled，不代表已杀远端provider事务。工具捕获异常只返error字符串，缺run ID/信号/是否因超限被杀的分类。which独立bash只有close监听，无error或超时，主run保护不覆盖二进制探测。

作者测试仅英文summary一例，不覆盖真实CLI、exit/state截断/信号。tfVersion不核r.code直接ok:true，可能把失败文本当version。读取固定源码不应把作者“只读”标签当这些恢复路径均已验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tf.js:33-64](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L33-L64)

timeout/output/stderr/error。

<details>
<summary>查看原文（32行）</summary>

```text
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
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
```

</details>

**依据 2 · 源码核查**：[lib/tf.js:5-13](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L5-L13)

which无error/timeout。

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((r) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => r(c === 0 ? out.trim() : ""));
  });
```

**依据 3 · 源码核查**：[lib/tf.js:98-101](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L98-L101)

version未核code。

```text
export async function tfVersion({ timeoutMs } = {}) {
  const b = await bin();
  const r = await run(b, ["version"], { timeoutMs: timeoutMs || 15_000, maxOut: 10_000 });
  return { ok: true, bin: b, output: (r.stdout || r.stderr).trim() };
```

**依据 4 · 源码核查**：[test/tf.test.js:1-11](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/test/tf.test.js#L1-L11)

单summary作者测试。

<details>
<summary>查看原文（11行）</summary>

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { summarizePlan } from "../lib/tf.js";

describe("plan summary", () => {
  it("parses", () => {
    const s = summarizePlan("Plan: 1 to add, 2 to change, 0 to destroy.");
    assert.equal(s.add, 1);
    assert.equal(s.change, 2);
  });
});
```

</details>

#### 缺口

- 进程取消/后代/锁恢复与大stderr资源占用没有受控记录。
  **影响**：不能保证取消即停止或完整资源有界。
  **进一步探讨**：假CLI派生子进程/大量stderr，取消/超时核剩余进程、内存和锁文件。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本效果和推荐是什么，怎样继续改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用IaC项目/provider与凭据资源 | 初始化项目/provider、核最小凭据/根/版本 | 不替代原工具链准备，时间/费用未知 |
| 持续使用 | plan刷新/状态网络、provider计算与模型阅读 | 检查项目状态与plan内容 | 云API/时延/费用依项目，不估金额 |
| 失败恢复 | 重复plan/进程清理资源 | 核锁/凭据/截断误判、CLI/进程清理 | 缺明确run/kill/partial收据增加复核，时间/费用未知 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 限动作 | 固定validate/plan/state，不开放apply | 不是执行沙箱或无网络保证 |
| 便捷计数 | 英文summary regex与state地址 | 长输出/其他exit会影响正确性 |
| 简化调用 | DSH参数化工具和统一错误 | 无同任务效率测量 |

先观察。窄动作面有价值，但exit成功判定/截断完整性直接影响“是否有变化”的读者判断，默认无roots、Host环境和取消/内存边界也需先明确；不直接给生产云项目推荐安装。可用假CLI/无云凭据项目审查输出收据。

可探讨“状态完整的plan审阅收据”。仅0/2成功、其他exit/signal明确失败，保存完整原件hash并让摘要引用来源，state返回total/returned/partial与游标，所有渲染保状态；执行绑定批准目录/最小env和signal，单目录串行。对比当前正则短文本，更容易防止把少数据/被杀当无变更。

未实现。最小对照用0/2/1/7/null、Plan末尾被裁、501地址/半行、同目录并发/取消和大stderr，比较误判率、完整性可见、残留资源和额外耗时；不能仅看摘要解析单测通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tf.js:114-139](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L114-L139)

成功分类/原件摘要方案基线。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/tf.js:142-154](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L142-L154)

total/partial方案基线。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/tf.js:33-64](https://github.com/173787247/dsh-wsl-terraform/blob/549e4b82570a4a13ab900ac03c5593421a8c16e4/lib/tf.js#L33-L64)

受管执行/资源方案基线。

<details>
<summary>查看原文（32行）</summary>

```text
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
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
```

</details>

#### 缺口

- 人工CLI与插件的变更误判、完整性与操作成本无同项目对照。
  **影响**：不能量化效率或评审质量收益。
  **进一步探讨**：固定匿名plan/state输出与受控CLI状态表，比较准确结果和人工步骤。
- 完整plan收据/版本原件和受管执行方案未实现。
  **影响**：不计现有能力或评分优势。
  **进一步探讨**：先假CLI故障矩阵验证不把非成功说成无变更。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
