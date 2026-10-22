# dsh-wsl-systemd

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a2e7fba](https://github.com/173787247/dsh-wsl-systemd/tree/a2e7fba0ac5ac273634697e1503fdb6676cc557f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd)
<!-- END META -->

> **实现功能**：为DSH提供用户systemd可用性探测、服务列表、单位属性与近期日志的只读工具，不启动或停止服务。

> **核心亮点**：把用户systemd手工list/show/journal整合为五入口四操作，提供单位约束、固定argv与结构化观察回执；不提供修复。详见[Q02](#research-q02)。

> **风险与缺陷**：发现命令which没有error/timeout，执行取消未贯穿；stderr无界、成功render隐藏truncated，日志只读仍可能披露秘密。详见[Q03](#research-q03)。

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
  - [Q01 · 只读systemd工具适合什么诊断任务？](#detail-section-11)
  - [Q02 · 模型入口、单位约束和结果是怎样实现的？](#detail-section-12)
  - [Q03 · 超时、截断和健康判断是否可靠？](#detail-section-13)
  - [Q04 · 启用条件与三阶段成本怎样区分？](#detail-section-14)
  - [Q05 · 是否值得采用，后续探索什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合DSH宿主处在目标Linux/WSL用户会话、需要查看Ollama/自托管API等用户服务的状态和近期日志的维护者。基线手工执行systemctl --user与journalctl --user，再把结果交给模型；插件提供可调用的固定读操作与结构化/文本回执，不启动/停止/enable服务。

合格交付是明确当前执行用户/用户bus可用性、单位状态/日志及截断/失败边界，而不是自动修复或证明服务健康。代码不选择WSL发行版、不切远端、不提供sudo；所在进程的环境/权限决定所查对象。journal内容会作为工具输出进入DSH与可能的模型上下文，读操作不等于无敏感数据风险。

手工systemctl --user与journalctl --user查询并贴结果；现有增量为模型工具入口与观察回执，不改变运维修复验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态探测 | 路径/XDG/用户bus估计 | ok不是健康 |
| list/show | 服务列表/限定属性 | 当前进程用户，不切发行版 |
| journal两别名 | 近期日志 | 默认50/上限200，可能敏感/截断 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18、DSH tools/systemPrompt | 包和五入口注册 | README兼容性为作者说明 |
| bash、systemctl/journalctl及用户bus | 发现与查询 | 无发行版切换/远端执行；which无自身超时 |
| 当前用户XDG环境及日志权限 | 查用户单元 | 权限不足不等服务不存在 |
| timeoutMs正数默认15000 | run超时/工具期限 | 不保证取消发现过程/子树 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | profile包/patch与目标用户匹配 | 不把Windows/远端环境当同一bus |
| 先状态 | 核二进制路径/XDG/userAvailable | ok=true非健康保证 |
| 选单位 | list/show再journal | 正确.service等后缀和权限 |
| 读收据 | 同时核ok/error/truncated | render可能只展示文本 |
| 失败恢复 | 人工检查bus/路径/参数/日志权限 | 无自动服务重启，不以重试放大日志曝光 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包与工具prompt上下文 | 核bash/bus/权限/目标用户 | 工时/主机费用未知 |
| 持续使用 | 每次发现与查询子进程、日志/模型上下文 | 选单位、读状态与脱敏日志 | 无独立LLM API不等总模型费用0；输出/延时未知 |
| 失败恢复 | 超时/残留进程与重新查询资源 | 查bus/截断/命令失败，人工恢复服务另行授权 | stderr无界/取消未闭合；恢复耗时未知 |



#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少手拼命令 | 固定用户list/show/journal入口 | 非根因分析或修复 |
| 约束输入 | 单位正则/直接argv/行数限制 | 起始短横线/小数与发现超时待补 |
| 交付可读观察 | 状态属性/日志回执 | render隐藏截断，日志可能敏感 |

分发包v0.1.1/MIT，与README早期表0.1.0存在文本漂移；以package固定版本为准，不调用外部kit链接替它补宿主验收。

> **思考**：发现命令which没有error/timeout，执行取消未贯穿；stderr无界、成功render隐藏truncated，日志只读仍可能披露秘密。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把用户systemd手工list/show/journal整合为五入口四操作，提供单位约束、固定argv与结构化观察回执；不提供修复。详见[Q02](#research-q02)。

把用户systemd手工list/show/journal整合为五入口四操作，提供单位约束、固定argv与结构化观察回执；不提供修复。详见[Q02](#research-q02)。

最明显的边界在命令发现。which只监听close，不监听spawn error，也没有timeout；bash缺失时error事件可能未处理，bash登录初始化卡住则Promise不结算。工具注册timeoutMs不等于底层进程必被取消，execute不接AbortSignal。run虽有SIGKILL定时器，但只kill直接child、不保证进程树，stderr无限累加；stdout超过200000才kill，单chunk可越限，不能称严格内存上限。

list/journal只有run成功exit0才返回40000字符/truncated。200000超限kill通常code=null，被当命令失败，只剩stderr/code，非完整截断收据。render对成功只显示output，隐藏truncated字段，读者看到的文本可能以为完整；status ok=true表示探测回执生成，不代表systemctl存在/userbus可达，userAvailable接受0/1/3是启发式，不能当服务健康。

assertUnit允许起始短横线，show将它直接放在argv且未加--，可能被systemctl当选项而非单位；这是参数语义/可用性边界，不据此声称任意shell执行。journal的-u下一参数与show不同，不能一概称同种注入。lines允许小数，Math clamp不取整，可能让journalctl拒绝非整数。作者测试仅检查ollama.service与x;y，不覆盖进程/超时/截断/用户bus。

<a id="detail-section-5"></a>

### 1.4 主要限制

发现命令which没有error/timeout，执行取消未贯穿；stderr无界、成功render隐藏truncated，日志只读仍可能披露秘密。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，先核用户bus/日志脱敏和失败截断；严格取消/内存边界场景先观察。详见[Q05](#research-q05)。

合格交付是明确当前执行用户/用户bus可用性、单位状态/日志及截断/失败边界，而不是自动修复或证明服务健康。代码不选择WSL发行版、不切远端、不提供sudo；所在进程的环境/权限决定所查对象。journal内容会作为工具输出进入DSH与可能的模型上下文，读操作不等于无敏感数据风险。

采用建议：有试用，先核用户bus/日志脱敏和失败截断；严格取消/内存边界场景先观察。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。只读固定命令成立，执行预算/回执与日志边界有明确限制。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/systemd.js、cordis.patch.yml、test/systemd.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整index/lib、配置/包/README和作者两个测试断言；不执行systemctl/journal/bash/目标测试/宿主。
- 下一步：可继续假执行器/脱敏样例对照发现失败、取消、双流超限和回执完整性，不控制真实服务。

**分析版本**

- **仓库**：[173787247/dsh-wsl-systemd](https://github.com/173787247/dsh-wsl-systemd)
- **版本号**：0.1.1（[固定提交 a2e7fba](https://github.com/173787247/dsh-wsl-systemd/tree/a2e7fba0ac5ac273634697e1503fdb6676cc557f)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索贯穿发现/执行deadline、双流预算和显式截断/阶段回执，以假执行器对照终止和信息保留；未实现。详见[Q05](#research-q05)。

可继续假执行器/脱敏样例对照发现失败、取消、双流超限和回执完整性，不控制真实服务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 487 |
| .js | source | 2 | 246 | 226 | 2 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd/issues?q=is%3Aissue+created%3A2026-09-22T09%3A56%3A31.521Z..2026-10-22T09%3A56%3A31.521Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A56%3A31.521Z..2026-10-22T09%3A56%3A31.521Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核用户会话只读范围、固定命令与回执、发现/执行预算/日志边界、成本及可证伪改进。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 只读systemd工具适合什么诊断任务？

**研究主题**：场景与需求

#### 完整回答

适合DSH宿主处在目标Linux/WSL用户会话、需要查看Ollama/自托管API等用户服务的状态和近期日志的维护者。基线手工执行systemctl --user与journalctl --user，再把结果交给模型；插件提供可调用的固定读操作与结构化/文本回执，不启动/停止/enable服务。

合格交付是明确当前执行用户/用户bus可用性、单位状态/日志及截断/失败边界，而不是自动修复或证明服务健康。代码不选择WSL发行版、不切远端、不提供sudo；所在进程的环境/权限决定所查对象。journal内容会作为工具输出进入DSH与可能的模型上下文，读操作不等于无敏感数据风险。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-35](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/README.md#L22-L35)

作者用途和只读边界。

<details>
<summary>查看原文（14行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `systemd_status` | systemctl 是否可用 |
| `systemd_user_list` | 用户服务列表 |
| `systemd_user_show` | 单元状态 |
| `systemd_user_journal` | 近期日志 |

## 配置要点

`timeoutMs`

不能 start/stop/enable。适合查 Ollama 等用户单元。
```

</details>

**依据 2 · 源码核查**：[index.js:14-18](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js#L14-L18)

仅用户会话提示契约。

```text
  ctx.systemPrompt.section({
    name: "tool:systemd",
    order: 122,
    text: "dsh-wsl-systemd inspects systemd --user units (list/show/journal). It cannot start/stop/enable services. Useful for Ollama or self-hosted API user units in WSL.",
  });
```

**依据 3 · 源码核查**：[lib/systemd.js:71-109](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L71-L109)

实际固定命令。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型入口、单位约束和结果是怎样实现的？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply可enabled=false退出，否则注册systemd_status、systemd_user_list、systemd_user_show、journal_tail和别名systemd_user_journal，共五个入口、四种操作；不是五个独立诊断算法。systemPrompt简述只读范围，无独立Skill/后台轮询。

status用bash -lc command -v发现systemctl/journalctl，返回XDG_RUNTIME_DIR，并运行--user is-system-running按0/1/3估计userAvailable。list固定--type=service --all --no-pager --plain，show固定Id/ActiveState/SubState/MainPID/FragmentPath属性，journal固定--user/-u/-n/short-iso；单位名称限制字符/后缀/长度，执行主体spawn直接argv而非把用户unit拼shell。journal默认50行、限制1到200，结果maxOut默认40000字符截断并给truncated。

show按首等号拆属性，list/journal返回文本；工具层捕异常为ok=false/error，status执行本身没有同样局部catch。贡献是把手工只读命令收拢成模型可发现且基本有界的接口，权限仍是进程用户，不是额外隔离。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-32](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js#L6-L32)

配置/status入口。

<details>
<summary>查看原文（27行）</summary>

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
    presentResult: (_a, r) => ({ card: "generic", title: "systemd status", content: r.content }),
  });
```

</details>

**依据 2 · 源码核查**：[index.js:55-129](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js#L55-L129)

show与journal别名。

<details>
<summary>查看原文（75行）</summary>

```text
  ctx.tools.register({
    name: "systemd_user_show",
    description: "systemctl --user show <unit> (ActiveState, MainPID, …).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["unit"],
      properties: { unit: { type: "string", description: "e.g. ollama.service" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await userShow({ unit: args.unit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "user show" }),
    presentResult: (_a, r) => ({ card: "generic", title: "user show", content: r.content }),
  });

  async function executeJournal(args) {
    return userJournal({ unit: args.unit, lines: args.lines, timeoutMs });
  }

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
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "journal tail" }),
    presentResult: (_a, r) => ({ card: "generic", title: "journal tail", content: r.content }),
  });

  ctx.tools.register({
    name: "systemd_user_journal",
    description: "Alias of journal_tail (read-only).",
    parameters: journalParams,
    output: journalOutput,
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await executeJournal(args);
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "user journal" }),
    presentResult: (_a, r) => ({ card: "generic", title: "user journal", content: r.content }),
```

</details>

**依据 3 · 源码核查**：[lib/systemd.js:14-45](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L14-L45)

单位验证/直接spawn。

<details>
<summary>查看原文（32行）</summary>

```text
export function assertUnit(name) {
  const n = String(name || "").trim();
  // user units like ollama.service
  if (!n || !/^[A-Za-z0-9@._+-]+\.(service|timer|socket|target)$/.test(n) || n.length > 128) {
    throw new Error("invalid systemd unit name");
  }
  return n;
}

export function run(bin, args, timeoutMs = 15_000) {
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
      if (stdout.length > 200_000) child.kill("SIGKILL");
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
  });
```

</details>

**依据 4 · 源码核查**：[lib/systemd.js:48-109](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L48-L109)

状态估计/输出。

<details>
<summary>查看原文（62行）</summary>

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
}

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时、截断和健康判断是否可靠？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最明显的边界在命令发现。which只监听close，不监听spawn error，也没有timeout；bash缺失时error事件可能未处理，bash登录初始化卡住则Promise不结算。工具注册timeoutMs不等于底层进程必被取消，execute不接AbortSignal。run虽有SIGKILL定时器，但只kill直接child、不保证进程树，stderr无限累加；stdout超过200000才kill，单chunk可越限，不能称严格内存上限。

list/journal只有run成功exit0才返回40000字符/truncated。200000超限kill通常code=null，被当命令失败，只剩stderr/code，非完整截断收据。render对成功只显示output，隐藏truncated字段，读者看到的文本可能以为完整；status ok=true表示探测回执生成，不代表systemctl存在/userbus可达，userAvailable接受0/1/3是启发式，不能当服务健康。

assertUnit允许起始短横线，show将它直接放在argv且未加--，可能被systemctl当选项而非单位；这是参数语义/可用性边界，不据此声称任意shell执行。journal的-u下一参数与show不同，不能一概称同种注入。lines允许小数，Math clamp不取整，可能让journalctl拒绝非整数。作者测试仅检查ollama.service与x;y，不覆盖进程/超时/截断/用户bus。

#### 证据与依据

**依据 1 · 源码核查**：[lib/systemd.js:3-11](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L3-L11)

发现无error/timeout。

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

**依据 2 · 源码核查**：[lib/systemd.js:14-45](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L14-L45)

允许短横线/输出缓冲。

<details>
<summary>查看原文（32行）</summary>

```text
export function assertUnit(name) {
  const n = String(name || "").trim();
  // user units like ollama.service
  if (!n || !/^[A-Za-z0-9@._+-]+\.(service|timer|socket|target)$/.test(n) || n.length > 128) {
    throw new Error("invalid systemd unit name");
  }
  return n;
}

export function run(bin, args, timeoutMs = 15_000) {
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
      if (stdout.length > 200_000) child.kill("SIGKILL");
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
  });
```

</details>

**依据 3 · 源码核查**：[lib/systemd.js:48-68](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L48-L68)

ok与启发式。

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

**依据 4 · 源码核查**：[lib/systemd.js:82-109](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L82-L109)

showargv与小数lines。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[index.js:38-48](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js#L38-L48)

成功render隐藏truncated。

<details>
<summary>查看原文（11行）</summary>

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await userListUnits({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 6 · 源码核查**：[test/systemd.test.js:1-8](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/test/systemd.test.js#L1-L8)

仅两个单位断言。

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assertUnit } from "../lib/systemd.js";

describe("unit", () => {
  it("ok", () => assert.equal(assertUnit("ollama.service"), "ollama.service"));
  it("bad", () => assert.throws(() => assertUnit("x;y"), /invalid/));
});
```

#### 缺口

- 宿主超时是否终止这些child及子进程、实际systemctl对各参数的语义未独立核。
  **影响**：不能把工具超时/参数正则当完整执行隔离。
  **进一步探讨**：固定假子进程模拟error/挂起/输出/取消，并按目标systemd手册核argv边界，不发真实服务控制。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启用条件与三阶段成本怎样区分？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18、DSH tools/systemPrompt | 包和五入口注册 | README兼容性为作者说明 |
| bash、systemctl/journalctl及用户bus | 发现与查询 | 无发行版切换/远端执行；which无自身超时 |
| 当前用户XDG环境及日志权限 | 查用户单元 | 权限不足不等服务不存在 |
| timeoutMs正数默认15000 | run超时/工具期限 | 不保证取消发现过程/子树 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | profile包/patch与目标用户匹配 | 不把Windows/远端环境当同一bus |
| 先状态 | 核二进制路径/XDG/userAvailable | ok=true非健康保证 |
| 选单位 | list/show再journal | 正确.service等后缀和权限 |
| 读收据 | 同时核ok/error/truncated | render可能只展示文本 |
| 失败恢复 | 人工检查bus/路径/参数/日志权限 | 无自动服务重启，不以重试放大日志曝光 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包与工具prompt上下文 | 核bash/bus/权限/目标用户 | 工时/主机费用未知 |
| 持续使用 | 每次发现与查询子进程、日志/模型上下文 | 选单位、读状态与脱敏日志 | 无独立LLM API不等总模型费用0；输出/延时未知 |
| 失败恢复 | 超时/残留进程与重新查询资源 | 查bus/截断/命令失败，人工恢复服务另行授权 | stderr无界/取消未闭合；恢复耗时未知 |

#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少手拼命令 | 固定用户list/show/journal入口 | 非根因分析或修复 |
| 约束输入 | 单位正则/直接argv/行数限制 | 起始短横线/小数与发现超时待补 |
| 交付可读观察 | 状态属性/日志回执 | render隐藏截断，日志可能敏感 |

分发包v0.1.1/MIT，与README早期表0.1.0存在文本漂移；以package固定版本为准，不调用外部kit链接替它补宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/package.json#L1-L14)

固定包/Node/入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-wsl-systemd",
  "version": "0.1.1",
  "description": "DeepSeek Harness WSL plugin: systemd --user list/show/journal (read-only).",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-systemd.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "systemd"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
}
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/cordis.patch.yml#L1-L6)

enabled与timeout。

```text
- insert:
    - id: dsh-wsl-systemd
      name: dsh-wsl-systemd
      config:
        enabled: true
        timeoutMs: 15000
```

**依据 3 · 源码核查**：[index.js:133-136](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js#L133-L136)

正数配置归一化。

```text
function positive(v, fb) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fb;
}
```

**依据 4 · 作者声明**：[README.md:7-10](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/README.md#L7-L10)

旧表版本。

```text
| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |
```

**依据 5 · 作者声明**：[README.md:37-44](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/README.md#L37-L44)

作者兼容性引用不作本轮事实。

```text
## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-systemd` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

#### 缺口

- 与手工查询相比的诊断用时/判断准确率及日志上下文成本未知。
  **影响**：不能量化效率收益或把只读当低成本保证。
  **进一步探讨**：固定脱敏故障样例比较人工步骤/正确判断/输出规模。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否值得采用，后续探索什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用，适合熟悉用户systemd并能审查日志的个人维护环境。只读固定命令比开放任意shell更容易理解，但必须先确认执行用户/bus、避免秘密进入journal输出，保留truncated/error；要求严格取消/内存界限的环境先观察。它不能修复服务，提示模型只读也不隔离其它工具。

由发现无timeout/error、run缓冲/取消与render丢元数据可推导“贯穿发现和查询的只读诊断回执”。把总deadline/signal传入which与run，明确error/timeout/overlimit状态，限制stdout/stderr字节并可保留尾部/脱敏摘要，render显示目标用户/时间/截断与失败阶段；单位拒绝起始短横线并整数化行数。

未实现。以原版为对照，用假执行器覆盖缺bash、挂起发现、大stderr/单chunk stdout、cancel、unit短横线/小数、bus不可达，比较终止后的进程/缓冲上界与回执完整性。反例是脱敏抹掉关键故障、过严单位规则拒绝合法转义实例、预算太短使健康bus也误报失败。若deadline后仍留下运行工作、超限却显示完整成功或关键诊断准确性下降，则方案假设被反证。无需控制真实服务，新增实现/样例维护成本单独计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/systemd.js:3-45](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js#L3-L45)

贯穿执行预算的推导起点。

<details>
<summary>查看原文（43行）</summary>

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

export function assertUnit(name) {
  const n = String(name || "").trim();
  // user units like ollama.service
  if (!n || !/^[A-Za-z0-9@._+-]+\.(service|timer|socket|target)$/.test(n) || n.length > 128) {
    throw new Error("invalid systemd unit name");
  }
  return n;
}

export function run(bin, args, timeoutMs = 15_000) {
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
      if (stdout.length > 200_000) child.kill("SIGKILL");
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
  });
```

</details>

**依据 2 · 源码核查**：[index.js:38-48](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js#L38-L48)

回执展示的推导起点。

<details>
<summary>查看原文（11行）</summary>

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.output }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await userListUnits({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

#### 缺口

- 贯穿取消/双流限额/阶段回执方案未实现。
  **影响**：不计现有可靠性/创新。
  **进一步探讨**：固定假执行器和脱敏输出矩阵对照终止/信息保留。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
