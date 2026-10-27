# dsh-wsl-compose

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[bea57df](https://github.com/173787247/dsh-wsl-compose/tree/bea57df86854983d90c8ac9219d15db1235c1652)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-compose)
<!-- END META -->

> **功能**：为 DSH 提供 Docker Compose 状态、容器列表、日志与可选 up/down 的本机运维工具。

> **亮点**：把 Compose 诊断与基本启动/停止接入 DSH 工具，并默认关闭变更。详见[Q01](#research-q01)。

> **主要限制**：双布尔条件不等于人工二次确认，开启变更且空 allowRoots 时可触及任意项目；超时需核实际 daemon 状态。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · Compose 工具覆盖哪些诊断与变更任务？](#detail-section-11)
  - [Q02 · 路径、命令和输出的边界如何实现？](#detail-section-12)
  - [Q03 · “双重确认”是不是人工审批？](#detail-section-13)
  - [Q04 · 超时与失败恢复能否证明操作未发生？](#detail-section-14)
  - [Q05 · 怎样在不误停服务的前提下试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可信项目目录中的 Docker Compose 初筛与受控变更；生产操作需宿主审批。详见[Q01](#research-q01)。

手工 docker compose CLI 可明确 cwd 和人为确认；插件减少 Agent 排障步骤，但不替代审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 状态/日志 | 运维初筛 | 输出截断 |
| up/down | 启停容器 | confirm 非人工审批 |
| allowRoots | 限项目 | 空数组无约束 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools | 必需 | Agent 入口 | 无工具 |
| Docker Compose/daemon | 必需 | 执行操作 | 失败 |
| 项目目录/权限 | 必需 | cwd | 无法操作 |
| 宿主审批 | 生产建议 | 变更许可 | 仅模型布尔确认 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 限界 | 设 allowRoots | 项目 realpath 在根内 |
| 诊断 | status/ps/logs | 记录截断 |
| 审批 | 人工确认 up/down | 宿主授权 |
| 复核 | 操作后 ps/logs | 超时核 daemon |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 接入 | Docker/Compose/DSH | 配 allowRoots | 兼容未测 |
| 诊断 | 日志读取 | 复核截断/权限 | 时延未知 |
| 变更 | 容器启动/停机 | 审批/状态对账 | 生产代价未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| ps/logs | 数组命令/输出截断 | 完整状态 |
| up/down | 双布尔门槛 | 人工审批 |
| 超时 | 杀 CLI | daemon 回滚 |

> **思考**：双布尔条件不等于人工二次确认，开启变更且空 allowRoots 时可触及任意项目；超时需核实际 daemon 状态。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Compose 诊断与基本启动/停止接入 DSH 工具，并默认关闭变更。详见[Q01](#research-q01)。

使用 spawn 参数数组和 realpath 有借鉴价值；默认目录与确认/超时语义需加强。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

双布尔条件不等于人工二次确认，开启变更且空 allowRoots 时可触及任意项目；超时需核实际 daemon 状态。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

默认只读并限制项目根；变更前后用宿主人工审批和 ps 对账，超时不盲重试。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持五工具；空 allowRoots 不限目录，confirm 仅工具参数非人类审批，超时无法证明 daemon 回滚；目标 Docker 未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/compose.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/compose.js、package.json；未执行 docker/目标工具。旧 META 仅复用。
- 下一步：目标隔离 Docker 项目测路径根、符号链接、超时、长日志与 up/down 宿主审批。

**分析版本**

- **仓库**：[173787247/dsh-wsl-compose](https://github.com/173787247/dsh-wsl-compose)
- **版本号**：0.1.1（[固定提交 bea57df](https://github.com/173787247/dsh-wsl-compose/tree/bea57df86854983d90c8ac9219d15db1235c1652)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为强制目录根、宿主用户审批、stderr 流界及超时返回待复核状态。详见[Q05](#research-q05)。

目标隔离 Docker 项目测路径根、符号链接、超时、长日志与 up/down 宿主审批。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 120 | — | — | 508 |
| .js | source | 2 | 306 | 284 | 5 | — |
| .js | test | 1 | 13 | 12 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-compose/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Compose 运维工具的目录隔离、确认语义及超时后状态是否足以支持安全采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Compose 工具覆盖哪些诊断与变更任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件为 DSH 注册 compose_status、compose_ps、compose_logs、compose_up、compose_down；前三者用于检查 Docker/项目容器和日志，后二者触发 up -d 或 down。作者称默认不允许变更，源码 allowMutate 只有显式 true 才打开。适合可信本机项目目录的运维辅助；不是 Compose 配置审计、发布编排或 Docker 权限隔离，docker 命令自身权限仍决定实际副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-36](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/README.md#L5-L36)

作者功能/默认变更配置

<details>
<summary>查看原文（32行）</summary>

````text
docker compose：ps/logs；up/down 需双重确认。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-compose
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-compose
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `compose_status` | docker 是否可用 |
| `compose_ps` | compose ps |
| `compose_logs` | 日志尾 |
| `compose_up` | up -d（危险） |
| `compose_down` | down（危险） |

## 配置要点

`allowRoots / allowMutate / timeoutMs`

默认 `allowMutate: false`。变更必须 `allowMutate=true` 且工具参数 `confirm=true`。互补 `docker_doctor`。
````

</details>

**依据 2 · 源码核查**：[index.js:11-25](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L11-L25)

配置/提示

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-compose] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  const allowMutate = config.allowMutate === true;
  console.log(`[dsh-wsl-compose] allowMutate=${allowMutate}`);

  ctx.systemPrompt.section({
    name: "tool:compose",
    order: 121,
    text: "dsh-wsl-compose wraps docker compose: prefer compose_ps and compose_logs. compose_up / compose_down require confirm=true and only work when allowMutate=true in plugin config. Complements docker_doctor; does not replace it.",
  });
```

</details>

**依据 3 · 源码核查**：[index.js:27-101](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L27-L101)

诊断工具

<details>
<summary>查看原文（75行）</summary>

```text
  ctx.tools.register({
    name: "compose_status",
    description: "Whether docker / compose plugin are on PATH; compose version + allowMutate flag.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
    isConcurrencySafe: () => true,
    async execute() {
      return { ...(await composeStatus()), allowMutate, allowRootsCount: allowRoots.length };
    },
    presentCall: () => ({ card: "generic", title: "compose status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose status", content: r.content }),
  });

  ctx.tools.register({
    name: "compose_ps",
    description: "docker compose ps for a project directory.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir"],
      properties: { projectDir: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await composePs({ projectDir: args.projectDir, allowRoots, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose ps" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose ps", content: r.content }),
  });

  ctx.tools.register({
    name: "compose_logs",
    description: "Tail docker compose logs (capped). Optional service name.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir"],
      properties: {
        projectDir: { type: "string" },
        service: { type: "string" },
        tail: { type: "number" },
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
        return await composeLogs({
          projectDir: args.projectDir,
          service: args.service,
          tail: args.tail,
          allowRoots,
          timeoutMs,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose logs" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose logs", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[index.js:103-173](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L103-L173)

变更工具

<details>
<summary>查看原文（71行）</summary>

```text
  ctx.tools.register({
    name: "compose_up",
    description: "docker compose up -d. Requires plugin allowMutate=true AND confirm=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir", "confirm"],
      properties: {
        projectDir: { type: "string" },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "ok" }],
    },
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_up disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "up",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose up" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose up", content: r.content }),
  });

  ctx.tools.register({
    name: "compose_down",
    description: "docker compose down. Requires plugin allowMutate=true AND confirm=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir", "confirm"],
      properties: {
        projectDir: { type: "string" },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "ok" }],
    },
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_down disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "down",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose down" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose down", content: r.content }),
  });
```

</details>

#### 缺口

- 目标 Docker/Compose 和 DSH 工具权限未测
  **影响**：不能据注册判断目标容器可用
  **进一步探讨**：目标隔离项目 status/ps/logs 对照 docker CLI

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径、命令和输出的边界如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

项目目录先 resolve，存在时 realpath，再与 allowRoots 列表根路径比较；仅在 allowRoots 非空时执行限制，空列表默认允许任意 cwd。命令以 spawn(bin,args,{cwd}) 数组调用，避免把 service/projectDir 拼入 shell；service 仅允许字母数字点下划线短横。日志 tail 限1–500，stdout 截60k/80k 等；但 stderr 在进程运行中持续累加，最终只截4k，无实时大小上限。目录在校验到 spawn 之间也可能被替换，需目标环境确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/compose.js:16-31](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L16-L31)

路径和可选根检查

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveProject(dir, allowRoots = []) {
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
    if (!ok) throw new Error(`compose project outside allowRoots: ${real}`);
  }
  return real;
}
```

</details>

**依据 2 · 源码核查**：[lib/compose.js:33-60](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L33-L60)

spawn/输出/超时

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { cwd, timeoutMs = 60_000, maxOut = 80_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
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
        stderr: stderr.slice(0, 4000),
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

**依据 3 · 源码核查**：[lib/compose.js:88-111](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L88-L111)

ps/logs及参数限制

<details>
<summary>查看原文（24行）</summary>

```text
export async function composePs({ projectDir, allowRoots, timeoutMs }) {
  const cwd = resolveProject(projectDir, allowRoots);
  const { docker } = await composeBin();
  const r = await run(docker, ["compose", "ps", "--format", "json"], { cwd, timeoutMs });
  if (r.code !== 0) {
    // try table format
    const r2 = await run(docker, ["compose", "ps"], { cwd, timeoutMs });
    if (r2.code !== 0) throw new Error(`compose ps failed: ${r2.stderr || r2.code}`);
    return { ok: true, project: cwd, output: r2.stdout, truncated: r2.truncated };
  }
  return { ok: true, project: cwd, output: r.stdout, truncated: r.truncated };
}

export async function composeLogs({ projectDir, service, tail = 80, allowRoots, timeoutMs, maxOut = 60_000 }) {
  const cwd = resolveProject(projectDir, allowRoots);
  const svc = String(service || "").trim();
  if (svc && !/^[A-Za-z0-9._-]+$/.test(svc)) throw new Error("invalid service name");
  const n = Math.min(500, Math.max(1, Number(tail) || 80));
  const { docker } = await composeBin();
  const args = ["compose", "logs", "--no-color", "--tail", String(n)];
  if (svc) args.push(svc);
  const r = await run(docker, args, { cwd, timeoutMs, maxOut });
  if (r.code !== 0) throw new Error(`compose logs failed: ${r.stderr || r.code}`);
  return { ok: true, project: cwd, service: svc || null, output: r.stdout, truncated: r.truncated };
```

</details>

#### 缺口

- 目标文件系统符号链接竞争、超大 stderr 未测
  **影响**：默认目录范围宽，恶意日志可耗内存
  **进一步探讨**：隔离目录/大 stderr/路径替换测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “双重确认”是不是人工审批？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

up/down 执行前检查插件配置 allowMutate，composeUpDown 再要求工具参数 confirm===true；该 confirm 由工具调用者/模型可传入，并未见人类审批服务或交互确认。allowRoots 默认空，则一旦管理员开启 allowMutate，工具可对任意可达目录执行 up/down。对于生产环境应配置窄 allowRoots 并在宿主层设置用户审批；不要把两个布尔条件描述成人工二次确认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-36](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/README.md#L32-L36)

作者双条件说法

```text
## 配置要点

`allowRoots / allowMutate / timeoutMs`

默认 `allowMutate: false`。变更必须 `allowMutate=true` 且工具参数 `confirm=true`。互补 `docker_doctor`。
```

**依据 2 · 源码核查**：[index.js:16-19](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L16-L19)

allowMutate 默认仅 true

```text
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  const allowMutate = config.allowMutate === true;
  console.log(`[dsh-wsl-compose] allowMutate=${allowMutate}`);
```

**依据 3 · 源码核查**：[index.js:103-168](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L103-L168)

up/down 布尔门槛

<details>
<summary>查看原文（66行）</summary>

```text
  ctx.tools.register({
    name: "compose_up",
    description: "docker compose up -d. Requires plugin allowMutate=true AND confirm=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir", "confirm"],
      properties: {
        projectDir: { type: "string" },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "ok" }],
    },
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_up disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "up",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose up" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose up", content: r.content }),
  });

  ctx.tools.register({
    name: "compose_down",
    description: "docker compose down. Requires plugin allowMutate=true AND confirm=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir", "confirm"],
      properties: {
        projectDir: { type: "string" },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "ok" }],
    },
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_down disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "down",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 4 · 源码核查**：[lib/compose.js:16-30](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L16-L30)

空 allowRoots 不限制

<details>
<summary>查看原文（15行）</summary>

```text
export function resolveProject(dir, allowRoots = []) {
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
    if (!ok) throw new Error(`compose project outside allowRoots: ${real}`);
  }
  return real;
```

</details>

**依据 5 · 源码核查**：[lib/compose.js:114-126](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L114-L126)

confirm 工具参数检查

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Dangerous: up/down require confirm=true explicitly.
 */
export async function composeUpDown({ projectDir, action, confirm, allowRoots, timeoutMs }) {
  if (confirm !== true) throw new Error(`${action} refused: pass confirm=true`);
  const act = String(action || "").toLowerCase();
  if (act !== "up" && act !== "down") throw new Error("action must be up or down");
  const cwd = resolveProject(projectDir, allowRoots);
  const { docker } = await composeBin();
  const args = act === "up" ? ["compose", "up", "-d"] : ["compose", "down"];
  const r = await run(docker, args, { cwd, timeoutMs: timeoutMs || 180_000, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`compose ${act} failed: ${r.stderr || r.code}`);
  return { ok: true, project: cwd, action: act, output: r.stdout || r.stderr };
```

</details>

#### 缺口

- 宿主工具批准策略未核
  **影响**：可能产生意外容器启动/停止
  **进一步探讨**：目标宿主确认调用前审批与根范围

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 超时与失败恢复能否证明操作未发生？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

run 超时后向 child 发送 SIGKILL 并 reject；这只终止本地 docker CLI，不能证明 Docker daemon 已回滚 up/down 已提交的容器状态。标准输出截断、stderr 仅截4k，失败后仍需 docker compose ps/logs 或 daemon 状态复核；不能因超时直接重试非幂等操作。工具 up/down 标至少180秒，底层同值，但实际网络/容器启动耗时未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/compose.js:33-60](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L33-L60)

进程超时/输出

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { cwd, timeoutMs = 60_000, maxOut = 80_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
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
        stderr: stderr.slice(0, 4000),
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

**依据 2 · 源码核查**：[lib/compose.js:114-126](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L114-L126)

up/down 调用

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Dangerous: up/down require confirm=true explicitly.
 */
export async function composeUpDown({ projectDir, action, confirm, allowRoots, timeoutMs }) {
  if (confirm !== true) throw new Error(`${action} refused: pass confirm=true`);
  const act = String(action || "").toLowerCase();
  if (act !== "up" && act !== "down") throw new Error("action must be up or down");
  const cwd = resolveProject(projectDir, allowRoots);
  const { docker } = await composeBin();
  const args = act === "up" ? ["compose", "up", "-d"] : ["compose", "down"];
  const r = await run(docker, args, { cwd, timeoutMs: timeoutMs || 180_000, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`compose ${act} failed: ${r.stderr || r.code}`);
  return { ok: true, project: cwd, action: act, output: r.stdout || r.stderr };
```

</details>

**依据 3 · 源码核查**：[index.js:119-130](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L119-L130)

变更工具时限

<details>
<summary>查看原文（12行）</summary>

```text
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_up disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "up",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
```

</details>

**依据 4 · 作者声明**：[README.md:22-36](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/README.md#L22-L36)

操作范围

<details>
<summary>查看原文（15行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `compose_status` | docker 是否可用 |
| `compose_ps` | compose ps |
| `compose_logs` | 日志尾 |
| `compose_up` | up -d（危险） |
| `compose_down` | down（危险） |

## 配置要点

`allowRoots / allowMutate / timeoutMs`

默认 `allowMutate: false`。变更必须 `allowMutate=true` 且工具参数 `confirm=true`。互补 `docker_doctor`。
```

</details>

#### 缺口

- 目标 daemon 超时后状态未知
  **影响**：误重试可能扩大变更
  **进一步探讨**：隔离 Compose 项目模拟超时并核服务状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样在不误停服务的前提下试用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先在无关键业务的 Docker 项目只启用 status/ps/logs，配置 allowRoots 为固定 realpath；确需 up/down 时由人类明确允许环境与操作，并用宿主审批机制控制模型工具，操作前后各记 ps 状态和日志。部署成本包含 Docker 服务、日志可见性、人工确认与超时后的状态对账；金额/时延未知。改进可让 allowRoots 必填、与宿主审批联动、为 stderr 加界、超时返回需复核状态；这些尚未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-36](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/README.md#L12-L36)

作者安装/配置

<details>
<summary>查看原文（25行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-compose
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-compose
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `compose_status` | docker 是否可用 |
| `compose_ps` | compose ps |
| `compose_logs` | 日志尾 |
| `compose_up` | up -d（危险） |
| `compose_down` | down（危险） |

## 配置要点

`allowRoots / allowMutate / timeoutMs`

默认 `allowMutate: false`。变更必须 `allowMutate=true` 且工具参数 `confirm=true`。互补 `docker_doctor`。
````

</details>

**依据 2 · 源码核查**：[lib/compose.js:16-60](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/lib/compose.js#L16-L60)

目录/进程边界

<details>
<summary>查看原文（45行）</summary>

```text
export function resolveProject(dir, allowRoots = []) {
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
    if (!ok) throw new Error(`compose project outside allowRoots: ${real}`);
  }
  return real;
}

export function run(bin, args, { cwd, timeoutMs = 60_000, maxOut = 80_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
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
        stderr: stderr.slice(0, 4000),
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

**依据 3 · 源码核查**：[index.js:103-173](https://github.com/173787247/dsh-wsl-compose/blob/bea57df86854983d90c8ac9219d15db1235c1652/index.js#L103-L173)

变更调用条件

<details>
<summary>查看原文（71行）</summary>

```text
  ctx.tools.register({
    name: "compose_up",
    description: "docker compose up -d. Requires plugin allowMutate=true AND confirm=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir", "confirm"],
      properties: {
        projectDir: { type: "string" },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "ok" }],
    },
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_up disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "up",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose up" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose up", content: r.content }),
  });

  ctx.tools.register({
    name: "compose_down",
    description: "docker compose down. Requires plugin allowMutate=true AND confirm=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["projectDir", "confirm"],
      properties: {
        projectDir: { type: "string" },
        confirm: { type: "boolean" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "ok" }],
    },
    timeoutMs: Math.max(timeoutMs, 180_000),
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!allowMutate) return { ok: false, error: "compose_down disabled (set config.allowMutate=true)" };
      try {
        return await composeUpDown({
          projectDir: args.projectDir,
          action: "down",
          confirm: args.confirm,
          allowRoots,
          timeoutMs: Math.max(timeoutMs, 180_000),
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "compose down" }),
    presentResult: (_a, r) => ({ card: "generic", title: "compose down", content: r.content }),
  });
```

</details>

#### 缺口

- 目标宿主审批、实际服务中断代价未知
  **影响**：不能直接推广到生产变更
  **进一步探讨**：隔离项目完成诊断/变更/超时矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
