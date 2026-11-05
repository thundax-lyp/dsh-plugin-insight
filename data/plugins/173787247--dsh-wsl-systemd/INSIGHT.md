# dsh-wsl-systemd

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[19222b8](https://github.com/173787247/dsh-wsl-systemd/tree/19222b82d1c4ee5a17b1c189f38589ee8972929b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-systemd)
<!-- END META -->

> **功能**：在 DSH 中查询 systemd 用户单元、状态和近期日志。

> **亮点**：[Q01](#research-q01) 聚合用户级服务状态和有限日志，支持排障初筛。

> **主要限制**：[Q02](#research-q02) userAvailable 是退出码推断，输出还可能截断，应用健康需独立核对。

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
  - [Q01 · 哪些 WSL 用户服务问题可在 DSH 初步诊断？](#detail-section-11)
  - [Q02 · 状态字段和日志范围可能怎样误导？](#detail-section-12)
  - [Q03 · 如何试用并区分总线不可用、日志为空与截断？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户服务异常时需要检查启动状态、PID 和近期日志。

直接在相同用户环境运行对应 systemctl 和 journalctl。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 用户服务状态 | 读取单元与关键属性 | 依赖用户总线 |
| 日志尾部 | 定位近期异常 | 权限与字符边界影响结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可用的用户总线与 systemctl | 查询服务必需 | 读取单元状态 | 存在二进制也可能无法访问总线 |
| journalctl 和读取权限 | 读取日志必需 | 返回近期行 | 权限不足或无记录 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择测试用户和单元 | 无敏感日志 |
| 取证 | 用户比较列表、属性和日志 | 确认服务与截断 |
| 退出 | 用户回原命令 | 服务状态继续由宿主管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 确认用户总线和 journal 权限 | 具体 WSL 环境影响接入 |
| 持续 | 读取开销未知 | 复核输出及时间范围 | 截断文本不完整 |
| 失败 | 排障耗时未知 | 直接查总线和日志 | 探测结果不能代替实际读取 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 排障 | 取得用户单元状态和近期日志 | 故障定位准确率与时间 |

> **思考**：[Q02](#research-q02) userAvailable 是退出码推断，输出还可能截断，应用健康需独立核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 聚合用户级服务状态和有限日志，支持排障初筛。

[Q02](#research-q02) userAvailable 只使用退出码，不能当成用户总线与 journal 的端到端探针。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) userAvailable 是退出码推断，输出还可能截断，应用健康需独立核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先对照原命令验证可读范围和日志截断，再用于测试服务排障。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认读取路径。真实 WSL 用户总线、日志可读性和诊断收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/systemd.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码和作者说明，未运行 systemd、日志工具、DSH 或目标测试。
- 下一步：以测试单元覆盖用户总线、日志无权、空输出、失败状态和截断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-systemd](https://github.com/173787247/dsh-wsl-systemd)
- **版本号**：0.1.1（[固定提交 19222b8](https://github.com/173787247/dsh-wsl-systemd/tree/19222b82d1c4ee5a17b1c189f38589ee8972929b)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 区分总线、权限和日志问题，比较是否减少错误诊断。

以测试单元覆盖用户总线、日志无权、空输出、失败状态和截断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 487 |
| .js | source | 2 | 246 | 226 | 2 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-systemd/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护 WSL 用户服务的人能否在 DSH 取得可核对的状态和日志线索？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些 WSL 用户服务问题可在 DSH 初步诊断？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当本机用户服务未启动或停止，操作者可先列出 service、查看单元状态与 MainPID，再读取该单元最近的日志。相比直接终端，DSH 能在一次排障会话收集这三类线索。工具不管理系统级服务，也没有 start 或 stop 入口。合格结果需明确属于当前用户的单元与时间段，不能仅凭一个 ActiveState 判断应用健康。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/README.md#L5-L15)

作者定位 user list/show/journal。

<details>
<summary>查看原文（11行）</summary>

````text
systemd --user 只读：list / show / journal。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-systemd
````

</details>

**依据 2 · 源码核查**：[lib/systemd.js:71-96](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L71-L96)

真实枚举与属性。

<details>
<summary>查看原文（26行）</summary>

```text
export async function userListUnits({ timeoutMs = 15_000, maxOut = 40_000 } = {}) {
  const bin = (await which("systemctl")) || "systemctl";
  const { code, stdout, stderr } = await run(
    bin,
    ["--user", "list-units", "--type=service", "--all", "--no-pager", "--plain"],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`systemctl --user list-units failed: ${stderr || code}`);
  return { ok: true, truncated: stdout.length > maxOut, output: stdout.slice(0, maxOut) };
}

export async function userShow({ unit, timeoutMs = 15_000 } = {}) {
  const u = assertUnit(unit);
  const bin = (await which("systemctl")) || "systemctl";
  const { code, stdout, stderr } = await run(
    bin,
    ["--user", "show", u, "-p", "Id", "-p", "ActiveState", "-p", "SubState", "-p", "MainPID", "-p", "FragmentPath", "--no-pager"],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`systemctl show failed: ${stderr || code}`);
  const props = {};
  for (const line of stdout.split("\n")) {
    const i = line.indexOf("=");
    if (i > 0) props[line.slice(0, i)] = line.slice(i + 1);
  }
  return { ok: true, unit: u, ...props };
```

</details>

**依据 3 · 源码核查**：[lib/systemd.js:99-110](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L99-L110)

日志读取参数和边界。

<details>
<summary>查看原文（12行）</summary>

```text
export async function userJournal({ unit, lines = 50, timeoutMs = 15_000, maxOut = 40_000 } = {}) {
  const u = assertUnit(unit);
  const n = Math.min(200, Math.max(1, Number(lines) || 50));
  const bin = (await which("journalctl")) || "journalctl";
  const { code, stdout, stderr } = await run(
    bin,
    ["--user", "-u", u, "-n", String(n), "--no-pager", "-o", "short-iso"],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`journalctl failed: ${stderr || code}`);
  return { ok: true, unit: u, truncated: stdout.length > maxOut, output: stdout.slice(0, maxOut) };
}
```

</details>

#### 缺口

- 没有用户级故障案例对照
  **影响**：未知是否减少切换或误诊
  **进一步探讨**：以已知失败单元和最近日志比较原命令与会话工具

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态字段和日志范围可能怎样误导？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

systemdStatus 先找二进制，用 systemctl --user is-system-running 退出码 0、1、3 猜测 userAvailable，不解析 stderr 或实际总线状态；XDG_RUNTIME_DIR 只从环境读取。应再用 list 或 show 验证。show 固定请求 Id、ActiveState、SubState、MainPID、FragmentPath，并按首个等号解析。日志通过 --user -u 定位，限制请求 1 到 200 行，且返回字符截断。工具文本只输出 output，不说明截断。允许 unit 后缀和字符集限制，并未做按单元授权。Host 的用户总线和 journal 权限决定能读什么。

#### 证据与依据

**依据 1 · 源码核查**：[lib/systemd.js:14-21](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L14-L21)

单元名检查。

```text
export function assertUnit(name) {
  const n = String(name || "").trim();
  // user units like ollama.service
  if (!n || !/^[A-Za-z0-9@._+-]+\.(service|timer|socket|target)$/.test(n) || n.length > 128) {
    throw new Error("invalid systemd unit name");
  }
  return n;
}
```

**依据 2 · 源码核查**：[lib/systemd.js:48-68](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L48-L68)

探测以退出码与环境猜测。

<details>
<summary>查看原文（21行）</summary>

```text
export async function systemdStatus() {
  const systemctl = (await which("systemctl")) || null;
  const journalctl = (await which("journalctl")) || null;
  let userAvailable = null;
  if (systemctl) {
    try {
      const { code } = await run(systemctl, ["--user", "is-system-running"], 5_000);
      // exit 0 = running; non-zero still means bus may be reachable
      userAvailable = code === 0 || code === 1 || code === 3;
    } catch {
      userAvailable = false;
    }
  }
  return {
    ok: true,
    systemctl,
    journalctl,
    userSession: process.env.XDG_RUNTIME_DIR || null,
    userAvailable,
    note: "user-session status only (no start/stop)",
  };
```

</details>

**依据 3 · 源码核查**：[lib/systemd.js:82-110](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L82-L110)

属性解析和日志命令。

<details>
<summary>查看原文（29行）</summary>

```text
export async function userShow({ unit, timeoutMs = 15_000 } = {}) {
  const u = assertUnit(unit);
  const bin = (await which("systemctl")) || "systemctl";
  const { code, stdout, stderr } = await run(
    bin,
    ["--user", "show", u, "-p", "Id", "-p", "ActiveState", "-p", "SubState", "-p", "MainPID", "-p", "FragmentPath", "--no-pager"],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`systemctl show failed: ${stderr || code}`);
  const props = {};
  for (const line of stdout.split("\n")) {
    const i = line.indexOf("=");
    if (i > 0) props[line.slice(0, i)] = line.slice(i + 1);
  }
  return { ok: true, unit: u, ...props };
}

export async function userJournal({ unit, lines = 50, timeoutMs = 15_000, maxOut = 40_000 } = {}) {
  const u = assertUnit(unit);
  const n = Math.min(200, Math.max(1, Number(lines) || 50));
  const bin = (await which("journalctl")) || "journalctl";
  const { code, stdout, stderr } = await run(
    bin,
    ["--user", "-u", u, "-n", String(n), "--no-pager", "-o", "short-iso"],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`journalctl failed: ${stderr || code}`);
  return { ok: true, unit: u, truncated: stdout.length > maxOut, output: stdout.slice(0, maxOut) };
}
```

</details>

**依据 4 · 源码核查**：[index.js:85-105](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/index.js#L85-L105)

日志文本渲染与实际注册。

<details>
<summary>查看原文（21行）</summary>

```text
  const journalParams = {
    type: "object",
    additionalProperties: false,
    required: ["unit"],
    properties: { unit: { type: "string" }, lines: { type: "number" } },
  };
  const journalOutput = {
    schema: { type: "object", additionalProperties: true },
    render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
  };

  ctx.tools.register({
    name: "journal_tail",
    description: "journalctl --user -u <unit> recent lines (capped). Read-only.",
    parameters: journalParams,
    output: journalOutput,
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await executeJournal(args);
```

</details>

#### 缺口

- 未测无用户总线、日志权限和命令解析
  **影响**：无法给出真实可读范围及状态误报率
  **进一步探讨**：用有总线、无总线、拒绝日志的测试用户核对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并区分总线不可用、日志为空与截断？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先用独立的测试用户和非敏感单元确认 systemctl、journalctl、用户总线和日志权限。依次查看 list、show 和 journal，确认 unit 的状态、时间和日志与原命令相符。工具不可用或输出不完整时回原生 journalctl，停用不会管理用户服务。可对照细分二进制缺失、总线不可达、权限拒绝、无日志和截断，并向调用者投影实际状态。若相同故障样本的正确诊断率未增或更多误判，则不采用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-30](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/index.js#L6-L30)

挂载及停用。

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-systemd] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);
  console.log("[dsh-wsl-systemd] user-session status only (no start/stop)");

  ctx.systemPrompt.section({
    name: "tool:systemd",
    order: 122,
    text: "dsh-wsl-systemd inspects systemd --user units (list/show/journal). It cannot start/stop/enable services. Useful for Ollama or self-hosted API user units in WSL.",
  });

  ctx.tools.register({
    name: "systemd_status",
    description: "Whether systemctl/journalctl are available; XDG_RUNTIME_DIR + user bus probe.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
    isConcurrencySafe: () => true,
    async execute() {
      return systemdStatus();
    },
    presentCall: () => ({ card: "generic", title: "systemd status" }),
```

</details>

**依据 2 · 源码核查**：[lib/systemd.js:48-68](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L48-L68)

现有粗略探测。

<details>
<summary>查看原文（21行）</summary>

```text
export async function systemdStatus() {
  const systemctl = (await which("systemctl")) || null;
  const journalctl = (await which("journalctl")) || null;
  let userAvailable = null;
  if (systemctl) {
    try {
      const { code } = await run(systemctl, ["--user", "is-system-running"], 5_000);
      // exit 0 = running; non-zero still means bus may be reachable
      userAvailable = code === 0 || code === 1 || code === 3;
    } catch {
      userAvailable = false;
    }
  }
  return {
    ok: true,
    systemctl,
    journalctl,
    userSession: process.env.XDG_RUNTIME_DIR || null,
    userAvailable,
    note: "user-session status only (no start/stop)",
  };
```

</details>

**依据 3 · 源码核查**：[lib/systemd.js:99-109](https://github.com/173787247/dsh-wsl-systemd/blob/19222b82d1c4ee5a17b1c189f38589ee8972929b/lib/systemd.js#L99-L109)

真实日志错误和截断字段。

<details>
<summary>查看原文（11行）</summary>

```text
export async function userJournal({ unit, lines = 50, timeoutMs = 15_000, maxOut = 40_000 } = {}) {
  const u = assertUnit(unit);
  const n = Math.min(200, Math.max(1, Number(lines) || 50));
  const bin = (await which("journalctl")) || "journalctl";
  const { code, stdout, stderr } = await run(
    bin,
    ["--user", "-u", u, "-n", String(n), "--no-pager", "-o", "short-iso"],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`journalctl failed: ${stderr || code}`);
  return { ok: true, unit: u, truncated: stdout.length > maxOut, output: stdout.slice(0, maxOut) };
```

</details>

#### 缺口

- 未测 WSL 各宿主的用户服务配置和诊断对照
  **影响**：实际接入耗时和分类收益未知
  **进一步探讨**：通过非敏感单元分别演练缺总线、无日志、权限失败和超长日志

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
