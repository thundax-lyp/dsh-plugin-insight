# Grove

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e6df354](https://github.com/alxshelepenok/grove/tree/e6df354c0c0e1ea614984ab8d2e3e6832f024474)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/alxshelepenok/grove)
<!-- END META -->

> **功能**：以持久化图记录工程目标、工作项和证据，提供 CLI、MCP 及独立 DSH 适配器。

> **亮点**：为跨会话进度增加前置条件和可核查的记录字段，后续代理可查下一项及对应包。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：CLI 检查图条件和证据字段，仍需要独立核验实际测试；DSH 适配器的项目目录和版本要另查。[Q03](#research-q03)

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
  - [Q01 · 什么跨会话任务值得维护一份图？](#detail-section-11)
  - [Q02 · 根项目与 DSH 子包怎样连接？](#detail-section-12)
  - [Q03 · 完成状态能证明什么，接入代价由谁承担？](#detail-section-13)
  - [Q04 · 怎样试用与检验更强的证据门槛？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用于跨会话维护工程目标、任务依赖和验收记录。

普通 issue、文档及 CI 可记录同类状态；Grove 增加显式依赖和程序门槛。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图状态与交接 | 组织任务、证据和下一步 | 根 CLI 负责规则 |
| DSH 适配 | 把 CLI 接为模型工具 | 需使用独立子包及可信 CLI |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| Grove CLI | 执行图与状态规则 | 固定可信版本 |
| 独立 DSH 子包 | 模型工具适配 | 匹配宿主和工作目录 |

| 阶段 | 操作 | 检查 |
| --- | --- | --- |
| 准备 | 建立有依赖的两个工作项 | 就绪条件正确 |
| 交接 | 另一会话读取下一项 | 能复做验收 |

**效果与成本**

| 环节 | 负担 | 待测 |
| --- | --- | --- |
| 维护 | 补依赖、证据与状态 | 实际节省与恢复耗时 |

| 结果 | 支持 | 待测 |
| --- | --- | --- |
| 交接可追溯 | 图和状态门槛 | 证据回放率与效率 |

> **思考**：CLI 检查图条件和证据字段，仍需要独立核验实际测试；DSH 适配器的项目目录和版本要另查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为跨会话进度增加前置条件和可核查的记录字段，后续代理可查下一项及对应包。[Q01](#research-q01) [Q02](#research-q02)

状态规则留在 CLI，适配层只转 argv；根工具与独立包的版本、项目定位和运行边界需区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

CLI 检查图条件和证据字段，仍需要独立核验实际测试；DSH 适配器的项目目录和版本要另查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用独立 CLI 小样本，不迁移生产任务；用第二会话核证据并确认项目定位。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持图状态和 DSH 子包接线。真实交接收益、运行可靠性与宿主版本未验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/dsh/src/tools/read.ts、packages/core/src/ops.rs、Cargo.toml、packages/dsh/package.json、packages/dsh/src/index.ts、packages/dsh/src/grove-cli.ts、packages/dsh/src/tools/mutate.ts、packages/core/src/guards.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓库源码级研究，覆盖核心状态守卫和 DSH 子包适配。未执行 CLI、MCP、桌面、安装或宿主。
- 下一步：在两个项目之间核对项目选择，记录缺证据拒绝及真实测试回放。

**分析版本**

- **仓库**：[alxshelepenok/grove](https://github.com/alxshelepenok/grove)
- **版本号**：未声明（[固定提交 e6df354](https://github.com/alxshelepenok/grove/tree/e6df354c0c0e1ea614984ab8d2e3e6832f024474)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对比引入可重放命令和固定输入后的误报、误拒及维护成本。尚未验证。[Q04](#research-q04)

在两个项目之间核对项目选择，记录缺证据拒绝及真实测试回放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 25 | 4874 | — | — | 33708 |
| .js | source | 44 | 4894 | 4485 | 0 | — |
| .js | test | 11 | 704 | 641 | 0 | — |
| .mjs | source | 1 | 33 | 28 | 0 | — |
| .ts | test | 3 | 240 | 188 | 0 | — |
| .ts | source | 4 | 282 | 269 | 0 | — |
| .mjs | example | 1 | 44 | 38 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/alxshelepenok/grove/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Grove 是否能为跨会话的工程工作提供可核查交接，DSH 适配器和 CLI 各负责什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么跨会话任务值得维护一份图？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

跨会话重构中的开发者需要留下目标、依赖、验收条件和可反查证据，让新会话不必重新猜测前序工作。Grove 将工作拆成节点并为下一项生成执行包；合格结果是新操作者能根据包解释工作为何就绪，按证据重做检验。相比只在任务列表记完成，它给状态转换加结构门槛；相比已有严格 issue 和 CI 的团队，额外记录可能重复。它的贡献是组织和约束进度记录，不直接保证代码正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-49](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/README.md#L20-L49)

作者说明跨会话及节点证据的用途。

<details>
<summary>查看原文（30行）</summary>

```text
<p align="center"><i><b>G</b>raph-driven <b>R</b>easoning <b>O</b>ver <b>V</b>erified <b>E</b>vidence. A formal workflow protocol designed to keep deep, long-running projects coherent across sessions, agents, and months.</i></p>

Long-running agent work fails in a predictable way: decisions and assumptions
drift out of view as sessions grow, agents report work done that is not done,
and after a few months the codebase no longer matches what anyone believes about
it, so nobody can say why a given line exists.

Grove fits reasoning-heavy work that outlives a single session: long refactors,
multi-session features, security and compliance work where every conclusion
needs an audit trail. The protocol picks the next step, so you stop
re-explaining the project to every new session.

**What this gives you:**

- **Atomic progress:** every task is mechanically proven, not just claimed.
- **Hierarchy over compression:** context is strictly structured, never lossily
  summarized.
- **Absolute reproducibility:** every action is recorded, so any step, decision,
  or assumption can be replayed and retraced.
- **Continuity across agents:** if an agent stops mid-goal, another agent on
  another client or model resumes from verified state.
- **Total ownership:** every goal, decision, task, question, and assumption is
  stored in a persistent historical graph that belongs entirely to you.

Grove enforces its rules as deterministic invariants stored in a single
checksummed lockfile: the agent cannot declare work done without falsifiable
evidence, start unready tasks, or hallucinate progress. Instead of lossy prompt
compression or summarization, project state lives in a typed reasoning graph
with machine-checkable edges, and each step receives exactly the execution
packet it needs, and nothing more.
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/tools/read.ts:37-52](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/tools/read.ts#L37-L52)

适配器提供当前状态及下一项查询。

<details>
<summary>查看原文（16行）</summary>

```text
  return [
    readTool({
      name: "grove_status",
      description: "Show Grove project status: work in progress, alignment triggers, and invariant notes. Read-only.",
      parameters: {},
      argv: () => ["status"],
    }, bin),
    readTool({
      name: "grove_next",
      description: "Propose the next work item (ready set intersected with the critical path) with its full execution packet. Read-only.",
      parameters: {},
      argv: () => ["next"],
    }, bin),
    readTool({
      name: "grove_ready",
      description: "List work items ready to start, critical-path first. Read-only.",
```

</details>

**依据 3 · 源码核查**：[packages/core/src/ops.rs:501-526](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/core/src/ops.rs#L501-L526)

工作项进展受 DoR 约束。

<details>
<summary>查看原文（26行）</summary>

```text
        {
            let n = st.nodes.get(id).expect("checked");
            if n.kind == Kind::W && new_status == "progress" && !dor(st, n, false) {
                let missing: Vec<String> = dor_breakdown(st, n, false)
                    .iter()
                    .filter(|(_, ok, _)| !ok)
                    .map(|(label, _, _)| label.clone())
                    .collect();
                let mut r = OpResult::fail_diag(
                    EXIT_GUARD,
                    Diagnostic::error(
                        Code::Invariant,
                        &format!(
                            "DoR is not satisfied for {}, inspect readiness for the failing conjuncts",
                            n.id
                        ),
                    ),
                );
                r.journal
                    .push(wrap_journal_record("set", jinv_dor_reject(&n.id, &missing)));
                return r;
            }
        }
        let verdict = {
            let n = st.nodes.get(id).expect("checked");
            guard_status_transition(st, n, new_status)
```

</details>

#### 缺口

- 没有跨会话团队对照。
  **影响**：不能估计交接节省或实际执行包质量。
  **进一步探讨**：对同一小型重构比较 issue 与 Grove 两次交接。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根项目与 DSH 子包怎样连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

固定条目覆盖仓库根，根 Cargo workspace 包含 core、MCP 和桌面项目，并非可直接安装的 DSH 包。packages/dsh 是独立 dsh-grove 子包，入口注入 tools 并注册读写两组工具。工具把请求组装成 argv，经 execFile 调配置的 grove CLI，返回 raw stdout；写工具能从参数转交 --session，否则继承环境。真正的 DoR、状态和锁由 CLI 处理，适配器不重复实现。调用有进程超时和缓冲上限。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:1-3](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/Cargo.toml#L1-L3)

根目录身份是 Rust workspace。

```text
[workspace]
resolver = "2"
members = ["packages/core", "packages/mcp", "packages/desktop/src-tauri"]
```

**依据 2 · 源码核查**：[packages/dsh/package.json:2-25](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/package.json#L2-L25)

DSH 子包清单、编译和 bundle。

<details>
<summary>查看原文（24行）</summary>

```text
  "name": "dsh-grove",
  "version": "0.2.1",
  "description": "DeepSeek Harness bundle that exposes the Grove CLI as agent tools.",
  "license": "AGPL-3.0",
  "type": "module",
  "main": "target/index.js",
  "types": "target/index.d.ts",
  "files": [
    "target",
    "cordis.patch.yml"
  ],
  "scripts": {
    "build": "bun build src/index.ts src/grove-cli.ts src/tools/read.ts src/tools/mutate.ts --outdir=target --target=node --format=esm '--external=@deepseek-ai/*' && tsc -p tsconfig.json --emitDeclarationOnly",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "bun test"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "0.0.1-rc.1"
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/index.ts:5-17](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/index.ts#L5-L17)

实际注册读写工具。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = "dsh-grove";
export const inject = ["tools"];

export interface Config {
  bin?: string;
}

export const apply = (ctx: Context, config?: Config): void => {
  const bin = config?.bin ?? "grove";
  for (const tool of [...createReadTools(bin), ...createMutateTools(bin)]) {
    ctx.tools.register(tool);
  }
};
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/grove-cli.ts:9-25](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/grove-cli.ts#L9-L25)

CLI 路径、超时和 stdout。

<details>
<summary>查看原文（17行）</summary>

```text
export const runGrove = (args: string[], options: GroveRunOptions = {}): Promise<string> => {
  const bin = options.bin ?? "grove";
  return new Promise((resolve, reject) => {
    execFile(
      bin,
      args,
      { cwd: options.cwd, timeout: options.timeoutMs ?? 60_000, maxBuffer: 16 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const detail = typeof stderr === "string" && stderr.trim().length > 0 ? stderr.trim() : error.message;
          reject(new Error(`grove ${args.join(" ")} failed: ${detail}`));
          return;
        }
        resolve(stdout);
      },
    );
  });
```

</details>

**依据 5 · 源码核查**：[packages/dsh/src/tools/mutate.ts:30-37](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/tools/mutate.ts#L30-L37)

会话参数随命令传给 CLI。

```text
      render: (_args, value) => [{ type: "text", text: value.stdout }],
    },
    async execute(args) {
      const argv = spec.argv(args);
      const session = (args as { session?: string }).session;
      if (session !== undefined) argv.push(`--session=${session}`);
      const stdout = await runGrove(argv, { bin });
      return { stdout };
```

#### 缺口

- 没有当前宿主的真实安装记录。
  **影响**：只能确定固定源码接线。
  **进一步探讨**：在临时 Profile 验证注册、输出与卸载。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成状态能证明什么，接入代价由谁承担？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

CLI 的 done 守卫检查前序条件、研究类产生边以及证据行非空，并要求每个关联目标的 fitness 变更。它证明这些图内字段存在且相容，不能据这段判断记录的测试真的执行或可重现；证据来源和真实性需外部复核。适配器的读写调用只传 bin、不传 cwd，因此需要验证实际 Host 进程从何处解析项目。根工具与 DSH 子包要单独准备，固定包 peer 依赖写的是旧版 dsh-tools；不要以 README 路径为当前可加载证据。初次迁移、为每项维护证据与恢复状态可能高于普通记录，跨会话收益未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/guards.rs:135-170](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/core/src/guards.rs#L135-L170)

done 判据是图状态及证据字段检查。

<details>
<summary>查看原文（36行）</summary>

```text
    if n.kind == Kind::W && new == "done" {
        if !preds_clear(st, &n.id) {
            return GuardVerdict::Reject(vec![Diagnostic::error(
                Code::Invariant,
                "predecessors not cleared (goal blockers must be verified, not merely declined, partial, or unverified)",
            )]);
        }
        if n.wtype.as_deref() == Some("spike") {
            let has_produces = st
                .edges
                .iter()
                .any(|e| e.label == "produces" && e.from == n.id);
            if !has_produces {
                return GuardVerdict::Reject(vec![Diagnostic::error(
                    Code::Invariant,
                    &format!(
                        "{} is a done spike but produces is empty (no outgoing produces edges)",
                        n.id
                    ),
                )]);
            }
        }
        if n.lines("evidence").is_empty() {
            return GuardVerdict::Reject(vec![Diagnostic::error(
                Code::Invariant,
                &format!("{} has no evidence, record evidence for the item", n.id),
            )]);
        }
        let f = n.fitness();
        for g in n.lines("goals") {
            if !f.contains_key(&g) {
                return GuardVerdict::Reject(vec![Diagnostic::error_details(
                    Code::Invariant,
                    &format!("missing fitness delta for {g}, stage a delta for every linked goal"),
                    vec![
                        ("goal".to_string(), g.clone()),
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/tools/read.ts:25-29](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/tools/read.ts#L25-L29)

工具不指定项目 cwd。

```text
      render: (_args, value) => [{ type: "text", text: value.stdout }],
    },
    async execute(args) {
      const stdout = await runGrove(spec.argv(args), { bin });
      return { stdout };
```

**依据 3 · 源码核查**：[packages/dsh/src/tools/mutate.ts:30-37](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/tools/mutate.ts#L30-L37)

写工具同样只传 bin。

```text
      render: (_args, value) => [{ type: "text", text: value.stdout }],
    },
    async execute(args) {
      const argv = spec.argv(args);
      const session = (args as { session?: string }).session;
      if (session !== undefined) argv.push(`--session=${session}`);
      const stdout = await runGrove(argv, { bin });
      return { stdout };
```

**依据 4 · 源码核查**：[packages/dsh/package.json:18-25](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/package.json#L18-L25)

bundle 与 peer 约束。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "0.0.1-rc.1"
```

#### 缺口

- 未跑多项目 Host 与当前 DSH。
  **影响**：不能确认默认项目选择和实际兼容。
  **进一步探讨**：用隔离目录和相同节点 ID 验证选中项目，再核对同版构建。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用与检验更强的证据门槛？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先在新建的独立项目用 CLI 记录两项有前置关系的工作，验证错误顺序能被拒绝，并由第二会话按执行包独立运行测试。若维护负担大、项目解析错误或证据不能回放，保留原 issue 与 CI。一个未验证的方向是给完成证据增加可选的固定命令、输入版本和结果摘要，由独立进程复验后标记强证据。与只查非空证据对照，统计交接后不能复现和误拒率；若拒绝率上升却无重现增益，不值得增加这道门槛。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/guards.rs:135-170](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/core/src/guards.rs#L135-L170)

当前图内证据门槛便于做对照。

<details>
<summary>查看原文（36行）</summary>

```text
    if n.kind == Kind::W && new == "done" {
        if !preds_clear(st, &n.id) {
            return GuardVerdict::Reject(vec![Diagnostic::error(
                Code::Invariant,
                "predecessors not cleared (goal blockers must be verified, not merely declined, partial, or unverified)",
            )]);
        }
        if n.wtype.as_deref() == Some("spike") {
            let has_produces = st
                .edges
                .iter()
                .any(|e| e.label == "produces" && e.from == n.id);
            if !has_produces {
                return GuardVerdict::Reject(vec![Diagnostic::error(
                    Code::Invariant,
                    &format!(
                        "{} is a done spike but produces is empty (no outgoing produces edges)",
                        n.id
                    ),
                )]);
            }
        }
        if n.lines("evidence").is_empty() {
            return GuardVerdict::Reject(vec![Diagnostic::error(
                Code::Invariant,
                &format!("{} has no evidence, record evidence for the item", n.id),
            )]);
        }
        let f = n.fitness();
        for g in n.lines("goals") {
            if !f.contains_key(&g) {
                return GuardVerdict::Reject(vec![Diagnostic::error_details(
                    Code::Invariant,
                    &format!("missing fitness delta for {g}, stage a delta for every linked goal"),
                    vec![
                        ("goal".to_string(), g.clone()),
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/tools/mutate.ts:87-104](https://github.com/alxshelepenok/grove/blob/e6df354c0c0e1ea614984ab8d2e3e6832f024474/packages/dsh/src/tools/mutate.ts#L87-L104)

适配器暴露证据与状态动作。

<details>
<summary>查看原文（18行）</summary>

```text
    mutateTool({
      name: "grove_set",
      description: "Set one guarded attribute of a node (status, cynefin, type, title, area, ...). Status transitions are enforced by CLI invariants.",
      parameters: {
        id: { type: "string", required: true, description: "Node id." },
        key: { type: "string", required: true, description: "Attribute key, e.g. status." },
        value: { type: "string", required: true, description: "New value, e.g. progress." },
        session: SESSION_PARAM,
      },
      argv: (args) => ["set", args.id, `${args.key}=${args.value}`],
    }, bin),
    mutateTool({
      name: "grove_evidence",
      description: "Append one falsifiable evidence line to a work item (test output, commit hash, build log).",
      parameters: {
        id: { type: "string", required: true, description: "Work item id, e.g. W-12." },
        text: { type: "string", required: true, description: "Evidence line." },
        session: SESSION_PARAM,
```

</details>

#### 缺口

- 缺独立回放对照。
  **影响**：仅支持独立 CLI 小样本。
  **进一步探讨**：记录一次就绪、一次拒绝及一次跨会话重做。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
