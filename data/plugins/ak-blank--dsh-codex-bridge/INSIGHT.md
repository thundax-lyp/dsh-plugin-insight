# dsh-codex-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a1983e4](https://github.com/AK-blank/dsh-codex-bridge/tree/a1983e49aed212c87cc82e06bccd1f4e1760c4d2)

<!-- BEGIN META -->
[![npm 30d 47](https://img.shields.io/static/v1?label=npm+30d&message=47&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codex-bridge) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-codex-bridge)
<!-- END META -->

> **实现功能**：通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。

> **核心亮点**：把只读额度、委派执行、模型/effort护栏和结构化结果连成DSH双工具，减少手工终端接线。参见[Q01](#research-q01)。

> **风险与缺陷**：缓存百分比与进程内锁不是额度预留；超时/取消并不回滚已写产物，布尔开关也不能独立证明用户授权。参见[Q03](#research-q03)。

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
  - [Q01 · 额度感知委派适合谁，与直接CLI相比交付什么？](#detail-section-11)
  - [Q02 · RPC、额度策略、执行和失败如何衔接？](#detail-section-12)
  - [Q03 · 额度护栏是否硬预算，超时与权限会留下什么？](#detail-section-13)
  - [Q04 · 何时有限试用，如何证伪新的预算收据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已登录Codex的DSH开发者委派自包含任务，须同时验答案/产物与用量；调用方负责上下文整理。

直接codex exec加手动额度检查是参照；本项减少接线，不能认定默认模型策略在所有任务更省。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| codex_status | 额度/模型快照 | 已登录CLI，非预算预留 |
| codex_delegate | 独立任务执行 | 消耗共享额度，失败非回滚 |
| 策略护栏 | 模型/effort及开关 | 参数许可依上层，非账号级锁 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH tools | 启动必需 | 双工具注册 | 无入口 |
| Codex CLI已登录/协议匹配 | 执行必需 | 额度与任务 | 结构化错误，先修登录/版本 |
| 账号额度、正确cwd/沙箱 | 任务必需 | 可控执行 | 阻断或先人工核许可 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核登录/模型，Agent读status | 快照可解释，未知不当充足 |
| 2 | 用户定义任务/cwd/权限 | 自包含、可验收和可恢复 |
| 3 | Agent委派、用户核答案/工作树 | 额度及产物一致；失败先核不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Codex安装/账号 | 登录、配模型与cwd | 资格/金额未核 |
| 持续使用 | 共享额度、临时文件与进程 | 整理自包含任务/验答案 | 百分比非token预留 |
| 失败恢复 | 可能已消耗额度与产物 | 查工作树/线程/日志，勿盲重试 | 不自动回滚，恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 额度感知 | 窗口解析和策略 | 任务预算上界/净节省 |
| 委派 | CLI执行与结构化结果 | 质量/耗时收益与账号模型 |
| 恢复 | 超时/取消和事件摘要 | 幂等重跑或产物回滚 |

> **思考**：缓存百分比与进程内锁不是额度预留；超时/取消并不回滚已写产物，布尔开关也不能独立证明用户授权。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把只读额度、委派执行、模型/effort护栏和结构化结果连成DSH双工具，减少手工终端接线。参见[Q01](#research-q01)。

把只读额度、委派执行、模型/effort护栏和结构化结果连成DSH双工具，减少手工终端接线。参见[Q01](#research-q01)。

额度策略/子进程适配分离与显式错误字段值得复用；注意进程内锁、秒参数命名及输出截断，移植需RPC契约和产物核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存百分比与进程内锁不是额度预留；超时/取消并不回滚已写产物，布尔开关也不能独立证明用户授权。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单人已有账号先只读短任务，核模型/额度/结果；写任务用可恢复工作树，超时先验产物，高价/低额需真实用户接受。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

额度与执行接线有源码支持；账号预算、真实CLI可用性和任务收益未验；任务收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/codex.js、lib/policy.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Host两工具、策略、CLI状态/执行主链；不运行Codex或消耗额度，不验证当前账号模型/沙箱。
- 下一步：未运行目标。先隔离核RPC/只读输出，再在授权预算下测并发消费、中断、缺窗口和截断的总成本/重复产物。

**分析版本**

- **仓库**：[AK-blank/dsh-codex-bridge](https://github.com/AK-blank/dsh-codex-bridge)
- **版本号**：1.1.1（[固定提交 a1983e4](https://github.com/AK-blank/dsh-codex-bridge/tree/a1983e49aed212c87cc82e06bccd1f4e1760c4d2)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为任务预算/产物收据和未知结果先核后续，比较共享消费、中断和截断下的总用量及重复副作用。参见[Q04](#research-q04)。

未运行目标。先隔离核RPC/只读输出，再在授权预算下测并发消费、中断、缺窗口和截断的总成本/重复产物。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1772 | 1469 | 213 | — |
| .md | source | 2 | 286 | — | — | 2277 |
| .mjs | source | 1 | 594 | 551 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-codex-bridge/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：额度感知委派的贡献、预算与执行恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 额度感知委派适合谁，与直接CLI相比交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有Codex登录、在DSH中希望把独立难题交另一执行器的开发者可先读额度再委派。合格交付包括自包含任务、正确cwd/权限、可核答案或文件变化，以及用量/错误状态；不是只启动进程。两个工具区分只读状态与消耗额度的exec，减少人手切终端并传回结果。

相对直接codex exec，增量是额度快照、模型/effort策略、显式高价与低额开关和结构化摘要；模型能力和执行器归属Codex，不算本插件原创。DSH上下文不会自动共享，编写任务与二次验收仍由调用方承担。作者报告某配置模型未列目录也可用，只是其账号/CLI经验，本轮不验证实际可用性或额度消耗比例。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-16](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/README.md#L1-L16)

两个工具和状态来源。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-codex-bridge

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) bundle that lets the agent read the local **Codex CLI** quota and delegate hard tasks to `codex exec` with a model and reasoning effort that fit the current ChatGPT-plan budget.

It is a host-only DSH plugin: two tools, no browser half, no build step, and no npm dependencies.

> Unofficial community plugin. Not affiliated with or endorsed by OpenAI, Codex, or DeepSeek.

## What it adds

| Tool | What it does | Codex usage |
|---|---|---|
| `codex_status` | Reads the 5-hour and weekly ChatGPT-plan windows, reset times, credits, the model ladder, and the quota-aware recommendation. | none |
| `codex_delegate` | Runs one non-interactive `codex exec` task in a chosen directory and returns the answer, token usage, thread id, and the quota left afterwards. | yes |

`codex_status` talks to `codex app-server` (`account/rateLimits/read`, `model/list`). `codex_delegate` is the only path that spends model usage.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:473-503](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/index.js#L473-L503)

自包含task与策略输入。

<details>
<summary>查看原文（31行）</summary>

```text
    async execute(args, exec) {
      try {
        const task = typeof args?.task === 'string' ? args.task : '';
        if (task.trim() === '') return failure('INVALID_TASK', 'task must be a non-empty string');
        if (task.length > MAX_TASK_CHARS) {
          return failure('TASK_TOO_LARGE', `task is ${task.length} characters; the limit is ${MAX_TASK_CHARS}`);
        }
        const complexity = COMPLEXITIES.includes(args?.complexity) ? args.complexity : 'standard';
        const model = typeof args?.model === 'string' && args.model !== '' ? args.model : 'auto';
        const effort = typeof args?.reasoning_effort === 'string' && args.reasoning_effort !== '' ? args.reasoning_effort : 'auto';
        const sandbox = args?.sandbox === 'workspace-write' ? 'workspace-write' : args?.sandbox === 'read-only' ? 'read-only' : cfg.defaultSandbox;
        const timeoutSeconds = clampTimeout(args?.timeout_seconds, cfg);
        const cwd = resolveCwd(args?.cwd, exec);

        const status = await runtime.getStatus(false);
        if (status.ok !== true) {
          return failure(status.code ?? 'STATUS_UNAVAILABLE', `cannot read Codex quota: ${status.message ?? 'unknown error'}`, {
            hint: hintFor(status.code),
            ...(typeof status.stderrTail === 'string' ? { stderrTail: status.stderrTail } : {}),
          });
        }
        const choice = resolveChoice({
          ladder: status.models ?? [],
          budget: status.budget,
          cfg,
          complexity,
          model,
          effort,
          allowLowQuota: args?.allow_low_quota === true,
          allowExpensiveModel: args?.allow_expensive_model === true,
        });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · RPC、额度策略、执行和失败如何衔接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

状态通过codex app-server读取账号窗口和模型目录，runtime缓存30秒并合并并发；选择策略正常用默认角色、reserve/unknown转保守角色，blocked需显式布尔放行，高价角色也需布尔开关。执行前核cwd/任务长度，globalThis锁避免同进程重叠，随后spawn exec并解析NDJSON线程、答案、用量和事件。结束后失效缓存并强制读额度。

子进程超时/取消先TERM再KILL，临时最后答案文件作为备用并清理，返回截断标志。这些状态分离与结构化结果可复用；锁仅当前Node进程，不是共享账号级额度预留。函数参数timeoutMs实际按秒消费，当前调用也传秒所以链路一致，但命名/类型说明误导后续维护，不应误报当前超时缩短千倍。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:311-322](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/index.js#L311-L322)

进程内锁。

<details>
<summary>查看原文（12行）</summary>

```text
function acquireRunLock(cfg) {
  const current = globalThis[RUN_LOCK];
  if (current !== undefined) {
    const age = Date.now() - (typeof current === 'number' ? current : 0);
    if (age < (cfg.maxTimeoutSeconds + 120) * 1000) return false;
  }
  globalThis[RUN_LOCK] = Date.now();
  return true;
}

function releaseRunLock() {
  delete globalThis[RUN_LOCK];
```

</details>

**依据 2 · 源码核查**：[lib/index.js:483-525](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/index.js#L483-L525)

缓存状态、选择、执行和后验。

<details>
<summary>查看原文（43行）</summary>

```text
        const sandbox = args?.sandbox === 'workspace-write' ? 'workspace-write' : args?.sandbox === 'read-only' ? 'read-only' : cfg.defaultSandbox;
        const timeoutSeconds = clampTimeout(args?.timeout_seconds, cfg);
        const cwd = resolveCwd(args?.cwd, exec);

        const status = await runtime.getStatus(false);
        if (status.ok !== true) {
          return failure(status.code ?? 'STATUS_UNAVAILABLE', `cannot read Codex quota: ${status.message ?? 'unknown error'}`, {
            hint: hintFor(status.code),
            ...(typeof status.stderrTail === 'string' ? { stderrTail: status.stderrTail } : {}),
          });
        }
        const choice = resolveChoice({
          ladder: status.models ?? [],
          budget: status.budget,
          cfg,
          complexity,
          model,
          effort,
          allowLowQuota: args?.allow_low_quota === true,
          allowExpensiveModel: args?.allow_expensive_model === true,
        });
        if (!acquireRunLock(cfg)) {
          return failure('CODEX_BUSY', 'another Codex run is already in progress; wait for it to finish', {
            hint: 'Retry after the running codex_delegate call returns.',
          });
        }
        let run;
        try {
          run = await runCodex(cfg, {
            task,
            model: choice.model,
            effort: choice.effort,
            cwd,
            sandbox,
            timeoutMs: timeoutSeconds,
            maxOutputChars: cfg.maxOutputChars,
            signal: exec.signal,
          });
        } finally {
          releaseRunLock();
          runtime.invalidate();
        }
        const statusAfter = await runtime.getStatus(true).catch(() => null);
```

</details>

**依据 3 · 源码核查**：[lib/codex.js:370-418](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/codex.js#L370-L418)

结果/截断/错误分类。

<details>
<summary>查看原文（49行）</summary>

```text
    const finish = (exitCode, closeSignal, spawnError) => {
      if (settled) return;
      settled = true;
      if (stdoutBuffer.trim() !== '') consumeEvent(stdoutBuffer.trim());
      stdoutBuffer = '';
      if (answer === '') {
        try {
          if (fs.existsSync(outputFile)) {
            const fromFile = fs.readFileSync(outputFile, 'utf8').trim();
            if (fromFile !== '') answer = fromFile;
          }
        } catch {
          // The message stream is the primary channel.
        }
      }
      cleanup();
      const answerChars = answer.length;
      const truncated = answerChars > maxOutputChars;
      const answerOut = truncated
        ? `${answer.slice(0, maxOutputChars)}\n\n[truncated: ${answerChars - maxOutputChars} more characters]`
        : answer;
      if (spawnError !== undefined) {
        errors.push(spawnError.message);
      }
      const ok = spawnError === undefined && !timedOut && !aborted && exitCode === 0 && !turnFailed;
      let code = null;
      if (!ok) {
        const blob = `${errors.join('\n')}\n${stderr}`.toLowerCase();
        if (spawnError?.code === 'ENOENT') code = 'CODEX_NOT_FOUND';
        else if (timedOut) code = 'CODEX_TIMEOUT';
        else if (aborted) code = 'CODEX_ABORTED';
        else if (blob.includes('usage limit') || blob.includes('rate limit') || blob.includes('quota')) code = 'CODEX_QUOTA';
        else if (blob.includes('not logged in') || blob.includes('login') || blob.includes('unauthorized')) code = 'CODEX_AUTH';
        else code = 'CODEX_FAILED';
      }
      resolve({
        ok,
        code,
        exitCode: typeof exitCode === 'number' ? exitCode : null,
        signal: closeSignal ?? null,
        timedOut,
        aborted,
        durationMs: Date.now() - startedAt,
        threadId,
        answer: answerOut,
        answerChars,
        truncated,
        usage,
        commandCount,
```

</details>

**依据 4 · 源码核查**：[lib/codex.js:529-535](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/codex.js#L529-L535)

timeoutMs实际按秒。

```text
    const seconds = Math.max(5, Math.min(cfg.maxTimeoutSeconds, timeoutMs));
    timer = setTimeout(() => {
      timedOut = true;
      killTree(child, 'SIGTERM');
      forceTimer = setTimeout(() => killTree(child, 'SIGKILL'), 2500);
      forceTimer.unref?.();
    }, seconds * 1000);
```

**依据 5 · 源码核查**：[lib/policy.js:347-369](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/policy.js#L347-L369)

unknown也走保守策略。

<details>
<summary>查看原文（23行）</summary>

```text
export function recommend(ladder, budget, cfg) {
  const defaultModel = findRole(ladder, 'default', 0);
  const fallbackModel = findRole(ladder, 'fallback', ladder.length - 1);
  if (defaultModel === null || fallbackModel === null) {
    return Object.fromEntries(COMPLEXITIES.map((complexity) => [complexity, { model: cfg.minModel, effort: cfg.minEffort }]));
  }
  const normal = {
    simple: [defaultModel, cfg.defaultEffort],
    standard: [defaultModel, cfg.defaultEffort],
    hard: [defaultModel, cfg.defaultEffort],
    critical: [defaultModel, cfg.defaultEffort],
  };
  const conservative = {
    simple: [fallbackModel, 'medium'],
    standard: [fallbackModel, 'medium'],
    hard: [fallbackModel, 'medium'],
    critical: [fallbackModel, 'high'],
  };
  const table = budget.level === 'normal' ? normal : conservative;
  const result = {};
  for (const complexity of COMPLEXITIES) {
    const [model, effort] = table[complexity];
    result[complexity] = { model: model.id, effort: supportedEffort(model, effort, cfg) };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 额度护栏是否硬预算，超时与权限会留下什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

额度是账号窗口百分比快照，执行用缓存且其他客户端可能同时消费；进程内串行不能限制任务最多花多少，更不能证明reserve模型更省给定任务总成本。unknown窗口返回保守建议而非拒绝，显式model仍按角色检查；allow_expensive_model/allow_low_quota只看调用参数，用户真实许可依赖上层，插件没有独立验证。

默认read-only降低写入风险，workspace-write由调用者选择并交Codex自身沙箱解释，不能仅凭本插件宣称完整文件访问边界。超时/abort返回失败但此前可能已写文件/执行命令，不允许不检查就重跑；ephemeral默认使长期线程恢复证据较少，截断答案又增加回查需求。首次要安装登录/核CLI协议，日常额度+任务整理和验收，失败要核工作树/日志/用量。金额、人时和模型选择净收益未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:483-519](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/index.js#L483-L519)

权限与布尔开关、缓存状态。

<details>
<summary>查看原文（37行）</summary>

```text
        const sandbox = args?.sandbox === 'workspace-write' ? 'workspace-write' : args?.sandbox === 'read-only' ? 'read-only' : cfg.defaultSandbox;
        const timeoutSeconds = clampTimeout(args?.timeout_seconds, cfg);
        const cwd = resolveCwd(args?.cwd, exec);

        const status = await runtime.getStatus(false);
        if (status.ok !== true) {
          return failure(status.code ?? 'STATUS_UNAVAILABLE', `cannot read Codex quota: ${status.message ?? 'unknown error'}`, {
            hint: hintFor(status.code),
            ...(typeof status.stderrTail === 'string' ? { stderrTail: status.stderrTail } : {}),
          });
        }
        const choice = resolveChoice({
          ladder: status.models ?? [],
          budget: status.budget,
          cfg,
          complexity,
          model,
          effort,
          allowLowQuota: args?.allow_low_quota === true,
          allowExpensiveModel: args?.allow_expensive_model === true,
        });
        if (!acquireRunLock(cfg)) {
          return failure('CODEX_BUSY', 'another Codex run is already in progress; wait for it to finish', {
            hint: 'Retry after the running codex_delegate call returns.',
          });
        }
        let run;
        try {
          run = await runCodex(cfg, {
            task,
            model: choice.model,
            effort: choice.effort,
            cwd,
            sandbox,
            timeoutMs: timeoutSeconds,
            maxOutputChars: cfg.maxOutputChars,
            signal: exec.signal,
```

</details>

**依据 2 · 源码核查**：[lib/policy.js:276-295](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/policy.js#L276-L295)

缺失窗口unknown与阻断条件。

<details>
<summary>查看原文（20行）</summary>

```text
export function computeBudget(quota, cfg) {
  const reasons = [];
  const five = quota.fiveHour?.usedPercent ?? null;
  const week = quota.weekly?.usedPercent ?? null;
  const fiveLeft = quota.fiveHour?.remainingPercent ?? null;
  const weekLeft = quota.weekly?.remainingPercent ?? null;

  if (quota.rateLimitReachedType !== null) {
    return { level: 'blocked', reasons: [`the backend reports ${quota.rateLimitReachedType}`], fiveHourUsed: five, weeklyUsed: week, fiveHourLeft: fiveLeft, weeklyLeft: weekLeft };
  }
  if (quota.ordinaryUsageAllowed === false) {
    return { level: 'blocked', reasons: ['ordinary included usage is not allowed right now'], fiveHourUsed: five, weeklyUsed: week, fiveHourLeft: fiveLeft, weeklyLeft: weekLeft };
  }
  if (five === null || week === null) {
    return { level: 'unknown', reasons: ['at least one quota window was missing from the backend snapshot'], fiveHourUsed: five, weeklyUsed: week, fiveHourLeft: fiveLeft, weeklyLeft: weekLeft };
  }
  if (five >= cfg.stopPercent) reasons.push(`5-hour window is ${five}% used (stop threshold ${cfg.stopPercent}%)`);
  if (week >= cfg.stopPercent) reasons.push(`weekly window is ${week}% used (stop threshold ${cfg.stopPercent}%)`);
  if (reasons.length > 0) {
    return { level: 'blocked', reasons, fiveHourUsed: five, weeklyUsed: week, fiveHourLeft: fiveLeft, weeklyLeft: weekLeft };
```

</details>

**依据 3 · 源码核查**：[lib/policy.js:419-430](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/policy.js#L419-L430)

开关仅参数检查。

<details>
<summary>查看原文（12行）</summary>

```text
  if (entry.role === 'expensive' && input.allowExpensiveModel !== true) {
    throw new PolicyError(
      'EXPENSIVE_MODEL_GUARD',
      `${requestedModel} consumes the shared ChatGPT quota much faster and is never selected automatically; set allow_expensive_model=true only when the user explicitly asks for it`,
      { model: requestedModel },
    );
  }
  if (budget.level === 'blocked' && input.allowLowQuota !== true) {
    throw new PolicyError(
      'QUOTA_BLOCKED',
      `Codex ordinary usage is blocked: ${budget.reasons.join('; ')}. Wait for the window to reset, or retry with allow_low_quota=true if you accept the risk.`,
      { level: budget.level, reasons: budget.reasons },
```

</details>

**依据 4 · 源码核查**：[lib/codex.js:394-418](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/codex.js#L394-L418)

失败包含执行事件计数，非回滚。

<details>
<summary>查看原文（25行）</summary>

```text
      const ok = spawnError === undefined && !timedOut && !aborted && exitCode === 0 && !turnFailed;
      let code = null;
      if (!ok) {
        const blob = `${errors.join('\n')}\n${stderr}`.toLowerCase();
        if (spawnError?.code === 'ENOENT') code = 'CODEX_NOT_FOUND';
        else if (timedOut) code = 'CODEX_TIMEOUT';
        else if (aborted) code = 'CODEX_ABORTED';
        else if (blob.includes('usage limit') || blob.includes('rate limit') || blob.includes('quota')) code = 'CODEX_QUOTA';
        else if (blob.includes('not logged in') || blob.includes('login') || blob.includes('unauthorized')) code = 'CODEX_AUTH';
        else code = 'CODEX_FAILED';
      }
      resolve({
        ok,
        code,
        exitCode: typeof exitCode === 'number' ? exitCode : null,
        signal: closeSignal ?? null,
        timedOut,
        aborted,
        durationMs: Date.now() - startedAt,
        threadId,
        answer: answerOut,
        answerChars,
        truncated,
        usage,
        commandCount,
```

</details>

#### 缺口

- 目标Codex版本/账号、沙箱与用量效果未验
  **影响**：执行可用性、预算和退出恢复未确定
  **进一步探讨**：隔离核CLI协议/权限，保留前后工作树与实际用量，再测超时与取消，不直接重放未知结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时有限试用，如何证伪新的预算收据？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议已有Codex和版本控制能力的单人用户先只读、短时、自包含小任务试用，确认目录模型/effort、状态刷新、答案完整性；文件写入另开可恢复工作树并验变化。高价/低额度放行必须由用户明确接受，插件参数不代替授权。需要严格账号预算或自动幂等恢复的团队应先观察。

未验证假设是任务级预算/结果收据，把预估、启动、实际用量、线程、产物摘要和未知结果分开，超过可读预算先缩任务，失败后先核产物再决定继续。由快照不是预留与超时可能已写推导，它可能减少额度失控和重复副作用，代价是共享账号协调和证据存储。最小验证同任务预算下对照外部并发消费、缺窗口、执行中断和输出截断，核总用量、合格产物与重复修改；若预算更保守却不能减少超支/返工则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:511-555](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/index.js#L511-L555)

执行后状态/产物摘要字段与失败。

<details>
<summary>查看原文（45行）</summary>

```text
          run = await runCodex(cfg, {
            task,
            model: choice.model,
            effort: choice.effort,
            cwd,
            sandbox,
            timeoutMs: timeoutSeconds,
            maxOutputChars: cfg.maxOutputChars,
            signal: exec.signal,
          });
        } finally {
          releaseRunLock();
          runtime.invalidate();
        }
        const statusAfter = await runtime.getStatus(true).catch(() => null);
        const quotaAfter = compactQuota(statusAfter);
        const common = {
          model: choice.model,
          effort: choice.effort,
          complexity: choice.complexity,
          sandbox,
          cwd,
          durationMs: run.durationMs,
          ...(typeof run.exitCode === 'number' ? { exitCode: run.exitCode } : {}),
          ...(typeof run.signal === 'string' ? { signal: run.signal } : {}),
          timedOut: run.timedOut === true,
          aborted: run.aborted === true,
          ...(typeof run.threadId === 'string' ? { threadId: run.threadId } : {}),
          answer: run.answer,
          truncated: run.truncated === true,
          answerChars: run.answerChars,
          commandCount: run.commandCount,
          fileChangeCount: run.fileChangeCount,
          errors: run.errors,
          ...(run.usage !== null && run.usage !== undefined ? { usage: run.usage } : {}),
          ...(quotaAfter !== undefined ? { quotaAfter } : {}),
        };
        if (run.ok !== true) {
          return {
            ok: false,
            code: run.code ?? 'CODEX_FAILED',
            message: describeRunFailure(run, timeoutSeconds),
            ...(hintFor(run.code) !== undefined ? { hint: hintFor(run.code) } : {}),
            ...common,
            stderrTail: run.stderrTail,
```

</details>

**依据 2 · 源码核查**：[lib/index.js:311-322](https://github.com/AK-blank/dsh-codex-bridge/blob/a1983e49aed212c87cc82e06bccd1f4e1760c4d2/lib/index.js#L311-L322)

当前锁范围导出共享协调缺口。

<details>
<summary>查看原文（12行）</summary>

```text
function acquireRunLock(cfg) {
  const current = globalThis[RUN_LOCK];
  if (current !== undefined) {
    const age = Date.now() - (typeof current === 'number' ? current : 0);
    if (age < (cfg.maxTimeoutSeconds + 120) * 1000) return false;
  }
  globalThis[RUN_LOCK] = Date.now();
  return true;
}

function releaseRunLock() {
  delete globalThis[RUN_LOCK];
```

</details>

#### 缺口

- 任务预算收据与收益未验证
  **影响**：仍只是护栏，不是硬预算或恢复保证
  **进一步探讨**：在隔离账号预算允许下做四故障对照，记录总用量/重复修改

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
