# dsh-wsl-compose

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[de7e941](https://github.com/173787247/dsh-wsl-compose/tree/de7e941a218af3959805e211a589e8850ab065b0)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-compose)
<!-- END META -->

> **功能**：在 DSH 中读取 Docker Compose 服务状态与日志，并按配置启停项目。

> **亮点**：[Q01](#research-q01) 把服务列表和尾部日志接进会话，便于先定位异常服务。

> **主要限制**：[Q02](#research-q02) 启停参数确认不证明真人批准，工作目录检查也未绑定 daemon 和项目。

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
  - [Q01 · Compose 工具在哪个诊断阶段有价值？](#detail-section-11)
  - [Q02 · 启停的两道检查能约束哪些副作用？](#detail-section-12)
  - [Q03 · 如何试用并降低启停目标误判？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 Docker Compose 的开发者需要找出本机测试服务故障。

直接指定 Docker context、Compose 配置和项目执行原生命令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 服务状态与日志 | 诊断容器异常 | 依赖 Compose 插件和 daemon |
| 启停 | 启动或停止项目 | 默认关闭变更，允许时还需 confirm |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Docker Compose 插件与 daemon | 必需 | 执行服务读取 | 仅旧 CLI 不够 |
| 明确 Docker context 与项目目录 | 受控使用必需 | 绑定测试目标 | 可能对错 daemon 或项目操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置隔离 daemon 并关闭变更 | 项目可弃用 |
| 诊断 | 用户查 ps 和服务日志 | 对照实际容器状态 |
| 退出 | 用户回原生 Compose | 超时先检查服务状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | daemon 资源未知 | 准备目录和权限 | 核对项目来源 |
| 持续 | 日志与服务开销未知 | 复核目标和截断 | 不要把表格当 JSON |
| 失败 | 恢复开销未知 | 检查 daemon 而非直接重试 | CLI 超时后可能仍有副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 故障定位 | 会话内取服务列表和日志尾部 | 实际排障耗时 |
| 启停 | 需要配置和 confirm 参数 | 真人批准与实际目标正确性 |

> **思考**：[Q02](#research-q02) 启停参数确认不证明真人批准，工作目录检查也未绑定 daemon 和项目。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把服务列表和尾部日志接进会话，便于先定位异常服务。

[Q02](#research-q02) 子进程退出只说明 CLI 结果，超时后的目标状态需重查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 启停参数确认不证明真人批准，工作目录检查也未绑定 daemon 和项目。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离测试项目只评估只读工具，变更时使用经核对目标的原生命令。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认命令接线与配置门槛。真实 daemon 权限、操作结果及目标绑定假设待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/compose.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 源码核查。未运行 Docker、DSH、目标测试或任何启停。
- 下一步：用可弃用项目检查旧 CLI、项目根、context、输出回退、超时与启停拒绝。

**分析版本**

- **仓库**：[173787247/dsh-wsl-compose](https://github.com/173787247/dsh-wsl-compose)
- **版本号**：0.1.1（[固定提交 de7e941](https://github.com/173787247/dsh-wsl-compose/tree/de7e941a218af3959805e211a589e8850ab065b0)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 在变更前绑定实际 context、项目和配置，比较错目标率与排障开销。

用可弃用项目检查旧 CLI、项目根、context、输出回退、超时与启停拒绝。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 120 | — | — | 508 |
| .js | source | 2 | 306 | 284 | 5 | — |
| .js | test | 1 | 13 | 12 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-compose/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者能否在 DSH 中诊断 Compose 服务并控制启停目标？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Compose 工具在哪个诊断阶段有价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

开发者可先列 Compose 服务并读取指定服务尾部日志，在 DSH 会话内确定哪个容器需进一步调查。原生 docker compose 已能给出同一信息，工具额外提供结构化目录、服务和尾行参数。ps 先请求 JSON，命令非零则回表格，输出字段不保证是同一格式。status 检测旧 docker-compose，但后续路径只调用 docker compose，所以只有旧二进制并不能使用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/README.md#L5-L15)

作者说明状态、日志及启停。

<details>
<summary>查看原文（11行）</summary>

````text
docker compose：ps/logs；up/down 需双重确认。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-compose
````

</details>

**依据 2 · 源码核查**：[lib/compose.js:63-98](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/lib/compose.js#L63-L98)

执行只走 Compose 插件，ps 有格式回退。

<details>
<summary>查看原文（36行）</summary>

```text
async function composeBin() {
  // prefer `docker compose` plugin; fall back to docker-compose
  const docker = (await which("docker")) || "docker";
  return { kind: "plugin", docker };
}

export async function composeStatus() {
  const docker = (await which("docker")) || null;
  const legacy = (await which("docker-compose")) || null;
  let composeVersion = null;
  if (docker) {
    try {
      const r = await run(docker, ["compose", "version", "--short"], { timeoutMs: 8_000, maxOut: 2_000 });
      if (r.code === 0) composeVersion = r.stdout.trim();
      else {
        const r2 = await run(docker, ["compose", "version"], { timeoutMs: 8_000, maxOut: 4_000 });
        composeVersion = (r2.stdout || r2.stderr || "").trim().slice(0, 200) || null;
      }
    } catch {
      composeVersion = null;
    }
  }
  return { ok: true, docker, dockerComposeLegacy: legacy, composeVersion };
}

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
```

</details>

**依据 3 · 源码核查**：[lib/compose.js:101-111](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/lib/compose.js#L101-L111)

日志尾行与服务约束。

<details>
<summary>查看原文（11行）</summary>

```text
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

- 没有对照真实故障的诊断效果
  **影响**：不能量化会话内取证增益
  **进一步探讨**：用含失败服务的测试项目核对格式和日志

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启停的两道检查能约束哪些副作用？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

必须配置 allowMutate=true，再由工具调用传 confirm=true，才运行 up -d 或 down。confirm 是模型调用参数，不能据此证明真人批准。allowRoots 检查工作目录的 realpath，空列表不限制目录，也未固定 Docker context 或 Compose 实际读取的配置。命令继承运行环境，Docker daemon 的账户权限与目标决定实际影响。超时杀死 CLI 后没有查询 daemon 结果，不能判断动作最终完成或取消。读路径仍可让日志进入会话；日志服务名语法允许连字符，后续直接作为参数传递，实际旗标解析需验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:16-24](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/index.js#L16-L24)

配置门槛。

```text
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  const allowMutate = config.allowMutate === true;
  console.log(`[dsh-wsl-compose] allowMutate=${allowMutate}`);

  ctx.systemPrompt.section({
    name: "tool:compose",
    order: 121,
    text: "dsh-wsl-compose wraps docker compose: prefer compose_ps and compose_logs. compose_up / compose_down require confirm=true and only work when allowMutate=true in plugin config. Complements docker_doctor; does not replace it.",
```

**依据 2 · 源码核查**：[index.js:119-133](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/index.js#L119-L133)

up 的调用检查和操作。

<details>
<summary>查看原文（15行）</summary>

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
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

</details>

**依据 3 · 源码核查**：[index.js:155-169](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/index.js#L155-L169)

down 的调用检查和操作。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/compose.js:16-41](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/lib/compose.js#L16-L41)

目录限制及客户端超时。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/compose.js:101-126](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/lib/compose.js#L101-L126)

日志及真实启停参数。

<details>
<summary>查看原文（26行）</summary>

```text
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
}

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

- 未验证目标选择、服务参数解析或超时后 daemon 状态
  **影响**：不能认为两道布尔检查提供可靠审批或取消
  **进一步探讨**：用可弃用项目和隔离 daemon 校验目标、权限和超时后状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并降低启停目标误判？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先只用 allowMutate=false，在隔离 Docker context 的测试目录验收 ps、logs 和无权限退出，确认 Docker Compose 插件而非旧 CLI。若需启停，当前最直接退路是使用已核对项目与 context 的原生命令，超时先核查 daemon 再决定是否重试。可试验在调用前绑定 Docker context、解析后的项目名和配置文件，向操作者显示并取得一次明确确认。把当前模型布尔值与目标绑定对照，在两项目、两 context 和配置变化时测错目标、拒绝率与额外时间。若仍有错目标或干扰正常取证则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-24](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/index.js#L12-L24)

默认关闭变更与目录配置。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/compose.js:63-85](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/lib/compose.js#L63-L85)

可用 Compose 路径。

<details>
<summary>查看原文（23行）</summary>

```text
async function composeBin() {
  // prefer `docker compose` plugin; fall back to docker-compose
  const docker = (await which("docker")) || "docker";
  return { kind: "plugin", docker };
}

export async function composeStatus() {
  const docker = (await which("docker")) || null;
  const legacy = (await which("docker-compose")) || null;
  let composeVersion = null;
  if (docker) {
    try {
      const r = await run(docker, ["compose", "version", "--short"], { timeoutMs: 8_000, maxOut: 2_000 });
      if (r.code === 0) composeVersion = r.stdout.trim();
      else {
        const r2 = await run(docker, ["compose", "version"], { timeoutMs: 8_000, maxOut: 4_000 });
        composeVersion = (r2.stdout || r2.stderr || "").trim().slice(0, 200) || null;
      }
    } catch {
      composeVersion = null;
    }
  }
  return { ok: true, docker, dockerComposeLegacy: legacy, composeVersion };
```

</details>

**依据 3 · 源码核查**：[lib/compose.js:117-126](https://github.com/173787247/dsh-wsl-compose/blob/de7e941a218af3959805e211a589e8850ab065b0/lib/compose.js#L117-L126)

当前只使用布尔确认与目录。

<details>
<summary>查看原文（10行）</summary>

```text
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

- 未测试 Docker 环境和目标绑定方案
  **影响**：恢复时间、误操作代价及审批效果未知
  **进一步探讨**：独立 daemon 验证读取、拒绝、模拟延迟和实际目标

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
