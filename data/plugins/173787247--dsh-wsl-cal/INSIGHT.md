# dsh-wsl-cal

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[107fbe3](https://github.com/173787247/dsh-wsl-cal/tree/107fbe3a9c6184859b95d518421baa2e363968fa)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-cal)
<!-- END META -->

> **功能**：在 DSH 中查看 khal 日历、今日议程和未来数日事项。

> **亮点**：[Q01](#research-q01) 将当前 khal 配置的议程接到 DSH，会话内即可查阅。

> **主要限制**：[Q02](#research-q02) 时间含义和新鲜度沿用 khal，截断后不应把未显示的事项当作不存在。

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
  - [Q01 · 已有 khal 的用户怎样在 DSH 查询日程？](#detail-section-11)
  - [Q02 · 日程的时间范围和完整性如何确定？](#detail-section-12)
  - [Q03 · 如何试用并发现过期日程？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需要在工作会话安排新任务前核对近期日程。

直接运行 khal 或打开原日历。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 日历和议程 | 核对近期安排 | 取决于当前 khal 配置和同步 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| khal 与测试日历 | 必需 | 读取当前配置 | 无 CLI 或配置时失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建立测试日历 | 不含私人事项 |
| 比对 | 用户查询今日与多日 | 核对原时间及完整性 |
| 退出 | 用户回原日历 | 按原件排期 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 验证 CLI 和时区 | 依赖已配置日历 |
| 持续 | 查询成本未知 | 复核同步与截断 | 不自动刷新远端 |
| 失败 | 排查耗时未知 | 回原日历 | 避免漏看冲突 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 议程查看 | 返回今日与多日文本 | 日历冲突识别与节时 |

> **思考**：[Q02](#research-q02) 时间含义和新鲜度沿用 khal，截断后不应把未显示的事项当作不存在。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将当前 khal 配置的议程接到 DSH，会话内即可查阅。

[Q02](#research-q02) 日历数来自上限后的切片，不能作为完整库存。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 时间含义和新鲜度沿用 khal，截断后不应把未显示的事项当作不存在。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用合成事项确认本地时区、跨日和输出完整性。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认查询和返回范围，实际时区、同步与节时待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/cal.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查。未运行目标、khal 或 DSH。
- 下一步：验证日历配置、时间边界、非零退出和截断。

**分析版本**

- **仓库**：[173787247/dsh-wsl-cal](https://github.com/173787247/dsh-wsl-cal)
- **版本号**：0.1.1（[固定提交 107fbe3](https://github.com/173787247/dsh-wsl-cal/tree/107fbe3a9c6184859b95d518421baa2e363968fa)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 显示时间范围及同步来源，比较过期和跨日误判。

验证日历配置、时间边界、非零退出和截断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 450 |
| .js | source | 2 | 197 | 181 | 2 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-cal/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-cal/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-cal/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 khal 的用户能否在 DSH 查阅可核对的近期日程？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 khal 的用户怎样在 DSH 查询日程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可列出 khal 日历，再查今天或未来数日的事项。相比打开终端，工具让会话直接取得当前配置下的 agenda，适合在安排任务前找出具体冲突。工具既不选择单一日历，也不执行远端同步，结果仅反映当前 khal 环境可见内容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/README.md#L5-L15)

作者用途与加载。

<details>
<summary>查看原文（11行）</summary>

````text
日历只读：khal list / today。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-cal
````

</details>

**依据 2 · 源码核查**：[lib/cal.js:65-90](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/lib/cal.js#L65-L90)

列表和时间段命令。

<details>
<summary>查看原文（26行）</summary>

```text
export async function khalCalendars({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["printcalendars"], { timeoutMs: timeoutMs || 10_000, maxOut: 8_000 });
  if (r.code !== 0) throw new Error(`khal printcalendars failed: ${r.stderr || r.code}`);
  const calendars = r.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
  return { ok: true, count: calendars.length, calendars };
}

export async function khalList({ days = 7, timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const d = Math.min(31, Math.max(1, Number(days) || 7));
  // khal list today today+Nd
  const r = await run(bin, ["list", "today", `${d}d`], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`khal list failed: ${r.stderr || r.code}`);
  return { ok: true, days: d, truncated: r.truncated, output: r.stdout };
}

export async function khalAgenda({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["list", "today"], { timeoutMs, maxOut: 20_000 });
  if (r.code !== 0) throw new Error(`khal agenda failed: ${r.stderr || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout };
```

</details>

#### 缺口

- 未比较查日程耗时
  **影响**：不能断言有用户节时
  **进一步探讨**：用同一测试日历比较直接 khal 与工具

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 日程的时间范围和完整性如何确定？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

查询将 days 夹在 1 到 31，传递 today 和 Nd 给 khal，时区、日期解析和同步新鲜度依赖宿主与 khal 配置。列表最多返回 50 个日历名，count 只是切片后数量。议程只包装截断后的原文本，子进程超限或非零时错误处理与普通空议程不同，调用方仍需查当天配置和数据更新时间。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cal.js:14-41](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/lib/cal.js#L14-L41)

进程时限与 stdout 截断。

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { timeoutMs = 15_000, maxOut = 40_000 } = {}) {
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

**依据 2 · 源码核查**：[lib/cal.js:44-74](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/lib/cal.js#L44-L74)

探测和日历计数。

<details>
<summary>查看原文（31行）</summary>

```text
export async function calStatus() {
  const khal = (await which("khal")) || null;
  let version = null;
  let calendarCount = null;
  if (khal) {
    try {
      const ver = await run(khal, ["--version"], { timeoutMs: 5_000, maxOut: 500 });
      version = (ver.stdout || ver.stderr || "").trim().slice(0, 200) || null;
    } catch {
      /* ignore */
    }
    try {
      const cals = await khalCalendars({ timeoutMs: 8_000 });
      calendarCount = Array.isArray(cals.calendars) ? cals.calendars.length : null;
    } catch {
      calendarCount = null;
    }
  }
  return { ok: true, khal, version, calendarCount };
}

export async function khalCalendars({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["printcalendars"], { timeoutMs: timeoutMs || 10_000, maxOut: 8_000 });
  if (r.code !== 0) throw new Error(`khal printcalendars failed: ${r.stderr || r.code}`);
  const calendars = r.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);
  return { ok: true, count: calendars.length, calendars };
```

</details>

**依据 3 · 源码核查**：[lib/cal.js:77-90](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/lib/cal.js#L77-L90)

固定参数及结果。

<details>
<summary>查看原文（14行）</summary>

```text
export async function khalList({ days = 7, timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const d = Math.min(31, Math.max(1, Number(days) || 7));
  // khal list today today+Nd
  const r = await run(bin, ["list", "today", `${d}d`], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`khal list failed: ${r.stderr || r.code}`);
  return { ok: true, days: d, truncated: r.truncated, output: r.stdout };
}

export async function khalAgenda({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["list", "today"], { timeoutMs, maxOut: 20_000 });
  if (r.code !== 0) throw new Error(`khal agenda failed: ${r.stderr || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout };
```

</details>

**依据 4 · 源码核查**：[index.js:78-96](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/index.js#L78-L96)

days 注册和调用。

<details>
<summary>查看原文（19行）</summary>

```text
    name: "cal_list",
    description: "khal list next N days (default 7, max 31).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { days: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output || "(none)" }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await khalList({ days: args?.days, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
```

</details>

#### 缺口

- 未验证当前 khal 日期语义及日历同步
  **影响**：不能确定跨日事件和远端新事件的覆盖
  **进一步探讨**：构造跨时区、多日历和已更新但未同步的样例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并发现过期日程？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

用无敏感事项的本地 khal 配置，在独立 DSH profile 对照原命令读取今天和多日，检查时区和完整性。不符则停用并回日历原件。可验证加上宿主时区、实际查询范围与同步来源说明，是否降低把旧副本当最新日程的概率。对照跨日与未同步事件，测冲突判断和附加检查时间，无改善则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-29](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/index.js#L6-L29)

宿主开关与状态工具。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
```

</details>

**依据 2 · 源码核查**：[lib/cal.js:77-90](https://github.com/173787247/dsh-wsl-cal/blob/107fbe3a9c6184859b95d518421baa2e363968fa/lib/cal.js#L77-L90)

返回结构未给时区和同步时间。

<details>
<summary>查看原文（14行）</summary>

```text
export async function khalList({ days = 7, timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const d = Math.min(31, Math.max(1, Number(days) || 7));
  // khal list today today+Nd
  const r = await run(bin, ["list", "today", `${d}d`], { timeoutMs, maxOut: 40_000 });
  if (r.code !== 0) throw new Error(`khal list failed: ${r.stderr || r.code}`);
  return { ok: true, days: d, truncated: r.truncated, output: r.stdout };
}

export async function khalAgenda({ timeoutMs } = {}) {
  const bin = (await which("khal")) || "khal";
  const r = await run(bin, ["list", "today"], { timeoutMs, maxOut: 20_000 });
  if (r.code !== 0) throw new Error(`khal agenda failed: ${r.stderr || r.code}`);
  return { ok: true, truncated: r.truncated, output: r.stdout };
```

</details>

#### 缺口

- 无真实宿主、CLI 与改法对照
  **影响**：实际接入与复核成本未知
  **进一步探讨**：用合成日历测试缺配置、时区、过期及长输出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
