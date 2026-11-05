# dsh-wsl-tmux

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[44e6d93](https://github.com/173787247/dsh-wsl-tmux/tree/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tmux)
<!-- END META -->

> **功能**：在 DSH 中查看 tmux 会话及 pane 输出。

> **亮点**：[Q01](#research-q01) 把会话枚举和输出快照接到 DSH，可快速查一段运行线索。

> **主要限制**：[Q02](#research-q02) 当前只接受会话目标，读到哪个 pane 取决于 tmux，退出码 1 还可能表现成空列表。

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
  - [Q01 · 如何从会话回看后台终端输出？](#detail-section-11)
  - [Q02 · 会话名称与读取范围如何确定？](#detail-section-12)
  - [Q03 · 什么条件下试用，如何减少错 pane？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者要从当前会话查明后台任务是否报错。

直接运行原生 tmux 命令或打开对应 pane。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话枚举 | 定位后台运行 | 同 socket 且退出码 1 可报空 |
| 输出快照 | 读取近期终端文本 | 目标由 tmux 解析，字符可截断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| tmux 与可访问的 socket | 必需 | 枚举及捕获 | 可能无会话或权限失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户创建带测试标记的会话 | 无敏感输出 |
| 检查 | 用户读列表和快照并比对 | 确认实际 pane 和截断 |
| 退出 | 用户返回原生命令 | 保留原会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 准备 socket 和测试 pane | 访问范围需核对 |
| 持续 | 复制输出成本未知 | 复核目标和输出范围 | 会话中可能含敏感内容 |
| 失败 | 排障成本未知 | 用原生命令定位 | 空列表可能掩盖错误 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 后台取证 | 捕获输出且无需附着 | 目标准确率与节时 |

> **思考**：[Q02](#research-q02) 当前只接受会话目标，读到哪个 pane 取决于 tmux，退出码 1 还可能表现成空列表。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把会话枚举和输出快照接到 DSH，可快速查一段运行线索。

[Q02](#research-q02) 原生 capture 允许短历史，默认文本仍可能截断。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 当前只接受会话目标，读到哪个 pane 取决于 tmux，退出码 1 还可能表现成空列表。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从隔离测试 pane 开始，核对实际目标后再读运行信息。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持枚举和快照。目标解析、耗时与精确 pane 方案尚待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/tmux.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码分析，未运行 tmux、DSH 或目标测试。
- 下一步：同 socket 做多会话多 pane、退出码、超时及截断验收。

**分析版本**

- **仓库**：[173787247/dsh-wsl-tmux](https://github.com/173787247/dsh-wsl-tmux)
- **版本号**：0.1.1（[固定提交 44e6d93](https://github.com/173787247/dsh-wsl-tmux/tree/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 按精确 pane ID 捕获并回显，对照是否减少多 pane 误选。

同 socket 做多会话多 pane、退出码、超时及截断验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 448 |
| .js | source | 2 | 189 | 176 | 0 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-tmux/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否从 DSH 核对后台 tmux 的近期输出并确认读到正确 pane？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何从会话回看后台终端输出？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护者可先列出同一 tmux server 的会话、窗口数与附着状态，再读取选中会话目标 pane 的近期文本。相比 attach 到终端，capture-pane -p 可取快照而不进入交互，插件增加 DSH 工具入口与返回预算。screen 只出现在状态探测中，未提供 screen 捕获。合格线索是找对目标 pane 和异常行，仍需原终端核对完整上下文。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/README.md#L5-L15)

作者定位和入口。

<details>
<summary>查看原文（11行）</summary>

````text
只读查看 tmux 会话与 pane 输出。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-tmux
````

</details>

**依据 2 · 源码核查**：[lib/tmux.js:45-60](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L45-L60)

同时探测 tmux 和 screen，仅调用 tmux 计数。

<details>
<summary>查看原文（16行）</summary>

```text
export async function tmuxStatus() {
  const tmux = (await which("tmux")) || null;
  const screen = (await which("screen")) || null;
  let sessionCount = null;
  let version = null;
  if (tmux) {
    try {
      const ver = await run(tmux, ["-V"], 5_000);
      version = (ver.stdout || ver.stderr || "").trim() || null;
      const list = await tmuxList({ timeoutMs: 5_000 });
      sessionCount = Array.isArray(list.sessions) ? list.sessions.length : 0;
    } catch {
      sessionCount = null;
    }
  }
  return { ok: true, tmux, screen, version, sessionCount };
```

</details>

**依据 3 · 源码核查**：[lib/tmux.js:63-91](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L63-L91)

枚举和 capture 的参数。

<details>
<summary>查看原文（29行）</summary>

```text
export async function tmuxList({ timeoutMs = 10_000 } = {}) {
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(bin, ["list-sessions", "-F", "#{session_name}\t#{session_windows}\t#{session_attached}"], timeoutMs);
  if (code !== 0) {
    if (/no server|no sessions/i.test(stderr) || code === 1) return { ok: true, sessions: [] };
    throw new Error(`tmux list failed: ${stderr || code}`);
  }
  const sessions = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, windows, attached] = line.split("\t");
      return { name, windows: Number(windows) || 0, attached: attached === "1" };
    });
  return { ok: true, sessions };
}

export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
```

</details>

#### 缺口

- 真实运维任务节时未知
  **影响**：无法比较与直接 capture-pane 的差异
  **进一步探讨**：固定相同两个测试会话，比较定位输出时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话名称与读取范围如何确定？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

工具只接受一个 session 名称，字符校验排除分隔符后直接将其传给 -t，没有同时提供 pane ID 或限制允许会话。具体匹配哪个 pane 依赖 tmux target 解析。可读取 DSH 进程能够访问的同一服务器输出，屏幕文字可能含密钥或个人信息。请求的历史起点最多向上 500 行，最终返回还截断字符，不等同可核验完整历史。list 把任何退出码 1 折成成功空列表，空列表因此可能掩盖错误。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tmux.js:39-43](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L39-L43)

session 名称语法。

```text
export function assertSessionName(name) {
  const n = String(name || "").trim();
  if (!n || !/^[A-Za-z0-9._@+-]+$/.test(n) || n.length > 64) throw new Error("invalid tmux session name");
  return n;
}
```

**依据 2 · 源码核查**：[lib/tmux.js:63-77](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L63-L77)

退出码 1 回退为空。

<details>
<summary>查看原文（15行）</summary>

```text
export async function tmuxList({ timeoutMs = 10_000 } = {}) {
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(bin, ["list-sessions", "-F", "#{session_name}\t#{session_windows}\t#{session_attached}"], timeoutMs);
  if (code !== 0) {
    if (/no server|no sessions/i.test(stderr) || code === 1) return { ok: true, sessions: [] };
    throw new Error(`tmux list failed: ${stderr || code}`);
  }
  const sessions = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, windows, attached] = line.split("\t");
      return { name, windows: Number(windows) || 0, attached: attached === "1" };
    });
  return { ok: true, sessions };
```

</details>

**依据 3 · 源码核查**：[lib/tmux.js:80-91](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L80-L91)

目标和截断。

<details>
<summary>查看原文（12行）</summary>

```text
export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
```

</details>

**依据 4 · 源码核查**：[index.js:65-86](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/index.js#L65-L86)

调用参数只包含 session 与 lines。

<details>
<summary>查看原文（22行）</summary>

```text
    name: "tmux_capture",
    description: "Capture recent pane text from a tmux session (read-only).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["session"],
      properties: {
        session: { type: "string" },
        lines: { type: "number", description: "History lines to capture (default 80)" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.text }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await tmuxCapture({ session: args.session, lines: args.lines, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

#### 缺口

- 未在真实多 pane 或权限失败环境测 target
  **影响**：不能保证读的是用户意图中的 pane
  **进一步探讨**：在多 pane 会话放不同测试标记并核对错误码

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件下试用，如何减少错 pane？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在同一用户与 tmux socket 的隔离环境只放可公开的测试输出。比较 tmux_list、tmux_capture 和原生 capture，核对目标与截断，遇到空列表或目标不明时回原生终端。子进程限时，杀进程只终止调用，后台会话本身由 tmux 维护。可验证先列出精确 pane ID 再按 ID 捕获，并把 ID 回显，能否减少多 pane 的误选。用不同 active pane 状态对照，若误选未下降或操作负担明显升高则不采纳。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-28](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/index.js#L6-L28)

插件加载、停用与状态。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-tmux] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 10_000);
  console.log(`[dsh-wsl-tmux] timeoutMs=${timeoutMs}`);

  ctx.systemPrompt.section({
    name: "tool:tmux",
    order: 134,
    text: "dsh-wsl-tmux can list sessions and capture-pane text for long-running tasks. It does not send keys or kill sessions. Prefer tmux_list then tmux_capture.",
  });

  ctx.tools.register({
    name: "tmux_status",
    description: "Whether tmux/screen are on PATH; version + live session count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
    isConcurrencySafe: () => true,
    async execute() {
      return tmuxStatus();
```

</details>

**依据 2 · 源码核查**：[lib/tmux.js:14-35](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L14-L35)

子进程的时限与输出边界。

<details>
<summary>查看原文（22行）</summary>

```text
export function run(bin, args, timeoutMs = 10_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 500_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 3 · 源码核查**：[lib/tmux.js:80-91](https://github.com/173787247/dsh-wsl-tmux/blob/44e6d9306975d4f2d7a8449112c82ce3cbe2fdb9/lib/tmux.js#L80-L91)

目前只按 session 目标捕获。

<details>
<summary>查看原文（12行）</summary>

```text
export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
```

</details>

#### 缺口

- 未测 socket 权限和多 pane 对照
  **影响**：不能确认用户能正确选择或节时
  **进一步探讨**：以隔离 socket 验收目标、超时和并发切换

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
