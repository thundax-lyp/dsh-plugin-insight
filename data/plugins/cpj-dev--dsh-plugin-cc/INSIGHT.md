# dsh-plugin-cc

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ffa8e85](https://github.com/cpj-dev/dsh-plugin-cc/tree/ffa8e8599d45582b1c73062cefcb9fcd40c69a72)

<!-- BEGIN META -->
[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cpj-dev/dsh-plugin-cc)
<!-- END META -->

> **功能**：Claude Code 命令插件通过本地 bridge 委派 DSH 任务，支持结果保存及临时多轮。

> **亮点**：[Q01](#research-q01) 命令化委派并提供结果管理。

> **主要限制**：[Q02](#research-q02) 等待超时仍执行，停止会丢失内存会话。

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
  - [Q01 · Claude 用户如何把任务交给 DSH？](#detail-section-11)
  - [Q02 · 超时和停止会怎样影响多轮？](#detail-section-12)
  - [Q03 · 如何验证委派是否减少来回切换？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Claude Code 用户需要在当前仓库调用 DSH 审阅或执行任务。

手工复制任务到 DSH 终端并保存结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 任务委派 | 调用 DSH | 本地 CLI 和模型 |
| 多轮 | 短期续接 | 仅 broker 存活期间 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Claude Code、POSIX、DSH | 必需 | 挂载命令和运行任务 | Windows 未支持 |
| Node 与模型密钥 | 必需 | 启动和模型调用 | 版本需核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在测试仓库做 setup | 确认 pin |
| 委派 | 只读 review 后核对结果 | 查看存活任务 |
| 收尾 | 确认进程和结果 | 多轮停止会丢状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 安装 pin 和 profile | 核对工具模式 |
| 持续 | token 未知 | 审阅输出并监控进程 | 多轮占资源 |
| 失败 | 工时未知 | 查询状态再决定停止 | 不要盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨代理委派 | 同一命令取结果 | 实际准确率与节时 |

> **思考**：[Q02](#research-q02) 等待超时仍执行，停止会丢失内存会话。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 命令化委派并提供结果管理。

[Q02](#research-q02) broker 超时不取消。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 等待超时仍执行，停止会丢失内存会话。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只读任务，再演练超时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对权限 overlay 和 broker 生命周期，未执行。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/dsh/scripts/lib/dsh.mjs、plugins/dsh/scripts/dsh-broker.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Claude 插件 bridge、权限及 broker，未运行。
- 下一步：同任务对照、超时查询和进程树终止。

**分析版本**

- **仓库**：[cpj-dev/dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc)
- **版本号**：2.0.2（[固定提交 ffa8e85](https://github.com/cpj-dev/dsh-plugin-cc/tree/ffa8e8599d45582b1c73062cefcb9fcd40c69a72)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照手工入口测切换和恢复成本。

同任务对照、超时查询和进程树终止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 1717 | — | — | 24213 |
| .mjs | source | 20 | 5359 | 4087 | 881 | — |
| .mjs | test | 19 | 3483 | 2963 | 164 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/cpj-dev/dsh-plugin-cc/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/cpj-dev/dsh-plugin-cc/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/cpj-dev/dsh-plugin-cc/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Claude Code 用户能否便捷委派 DSH 任务并明确多轮存活边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Claude 用户如何把任务交给 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Claude Code 插件命令通过 bridge 启动 DSH，提供审阅、一次任务、后台委派和 broker 多轮。默认 standard 使用完整工具表，minimal 则固定两个工具。相对手动复制到终端，命令保存结果并可查看；它本身安装到 Claude Code，DSH 是外部运行时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-29](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/README.md#L9-L29)

产品入口及模式。

<details>
<summary>查看原文（21行）</summary>

```text
Claude Code plugin that runs **DeepSeek Harness** (`dsh`) from slash commands: review, critique, one-shot tasks, and resumable multi-turn sessions.

Pin: [`@deepseek-ai/dsh@0.1.1-rc.2`](https://www.npmjs.com/package/@deepseek-ai/dsh). After upgrading the plugin, rerun `/dsh:setup`. Re-verify [docs/dsh-compat.md](docs/dsh-compat.md) on every dsh upgrade.

## Agent modes

Default is **`standard`**. `minimal` and `anchored-standard` are switches — they are not the default.

| Mode | Tools the model sees |
|---|---|
| **`standard`** (default) | Full dsh-base catalog from request #1 (search, skills, subagents, …). No overlay. |
| `minimal` | bash + `str_replace_editor` for the **whole** run. Extra tools cannot appear later. |
| `anchored-standard` | Those two tools first. After this session records a tool call **or** an assistant reply, the next assemble restores the full catalog. |

Switch:

- this run: `/dsh:run --mode minimal …` or `--mode anchored-standard`
- this shell: `DSH_CC_MODE=minimal`
- this machine: `/dsh:setup --mode minimal`

A broker (`--session` / `--resume` / `/dsh:import`) keeps the mode it started with. Mismatch → `/dsh:stop --broker`.
```

</details>

**依据 2 · 作者声明**：[README.md:44-70](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/README.md#L44-L70)

命令与 bridge。

<details>
<summary>查看原文（27行）</summary>

```text
## Commands

| Command | What it does |
|---|---|
| `/dsh:check` | Readiness probe |
| `/dsh:setup` | Install pinned npm CLI (or `--harness`) and the multi-turn `cc` profile |
| `/dsh:review [focus]` | Read-only review of local changes |
| `/dsh:critique [focus]` | Structured adversarial critique |
| `/dsh:run <task>` | Task (`--write`, `--session`, `--resume`, `--mode`, `--background`) |
| `/dsh:delegate <task>` | Background handoff via the `dsh-delegate` subagent |
| `/dsh:import` | Weak-import this conversation into a resumable dsh session |
| `/dsh:runs` / `/dsh:show` | List runs / replay a stored result |
| `/dsh:stop` / `--broker` | Kill a run / the shared broker |

Flags and failure modes: [docs/commands.md](docs/commands.md). Recovery: [docs/troubleshooting.md](docs/troubleshooting.md).

## For agents

Read in this order; stop when you can act.

1. This README (modes + commands)
2. [docs/commands.md](docs/commands.md) — flags
3. [plugins/dsh/skills/dsh-delegate-runtime/SKILL.md](plugins/dsh/skills/dsh-delegate-runtime/SKILL.md) — how to invoke the bridge
4. [docs/dsh-compat.md](docs/dsh-compat.md) — DSH pin; re-verify on upgrade
5. [NOTICE](NOTICE) — third-party licenses (do not restate)

Entry: `plugins/dsh/scripts/dsh-bridge.mjs` (one subcommand per capability; stdout is user-facing). DSH argv and overlays: `plugins/dsh/scripts/lib/dsh.mjs`. Broker: `plugins/dsh/scripts/dsh-broker.mjs` — started by the bridge; **never start it by hand**. Tests: `npm test` (fake dsh, no API key).
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/scripts/lib/dsh.mjs:485-519](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/plugins/dsh/scripts/lib/dsh.mjs#L485-L519)

启动 overlay 固定权限。

<details>
<summary>查看原文（35行）</summary>

```text
 * - approval `never`: nobody is present to answer prompts; the sandbox mode
 *   stays the real safety boundary.
 * - a `permission` row whose single `unattended` preset matches exactly
 *   (mode, never): dsh-base's permission-presets service refuses to boot
 *   when the composed sandbox+approval pair names no preset, and it PINS the
 *   default preset's knobs into fresh sessions — so the preset must mirror
 *   the launch mode or it would override DSH_PERMISSION_MODE.
 */
export function buildUnattendedOverlayYaml(permissionMode) {
  const mode = normalizePermissionMode(permissionMode) ?? "read-only";
  return [
    "# generated by dsh-plugin-cc (unattended composition; see lib/dsh.mjs)",
    "- id: approval",
    "  config:",
    "    policy: never",
    "- id: permission",
    "  config:",
    "    presets:",
    "      unattended:",
    `        sandbox: ${yamlQuote(mode)}`,
    "        approval: never",
    "        name: unattended",
    `        description: ${yamlQuote("dsh-plugin-cc unattended run: sandbox fixed at launch, approvals disabled.")}`,
    "    defaultPreset: unattended",
    ""
  ].join("\n");
}

/** Write the per-mode unattended overlay under `<dir>/overlays`; returns its path. */
export function writeUnattendedOverlay(dir, permissionMode) {
  const mode = normalizePermissionMode(permissionMode) ?? "read-only";
  const overlaysDir = path.join(dir, "overlays");
  fs.mkdirSync(overlaysDir, { recursive: true });
  const file = path.join(overlaysDir, `unattended-${mode}.yml`);
  fs.writeFileSync(file, buildUnattendedOverlayYaml(mode), "utf8");
```

</details>

#### 缺口

- 真实跨产品交接未运行
  **影响**：不知道审阅和委派成功率
  **进一步探讨**：在测试仓库对照复制与 slash 命令

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 超时和停止会怎样影响多轮？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

broker 在每工作区提供 Unix socket，超时回报错误但运行时继续工作。停止 broker 通过终止进程放弃全部内存会话，不能推断任务收到超时就停止。默认只读，写权限在启动前确定，中途无人可审批。对话导入为文本摘要，图片和原生历史不保留。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/scripts/dsh-broker.mjs:227-238](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/plugins/dsh/scripts/dsh-broker.mjs#L227-L238)

等待超时仍执行。

<details>
<summary>查看原文（12行）</summary>

```text
  async run(sessionId, promptText, { timeoutMs = DEFAULT_BROKER_RUN_TIMEOUT_MS } = {}) {
    await this.ensureInitialized();
    const events = [];

    let settle;
    const done = new Promise((resolve, reject) => {
      settle = { resolve, reject };
    });
    const timer = setTimeout(() => {
      settle.reject(new Error(`run on session ${sessionId} timed out after ${timeoutMs}ms (the runtime keeps working; stop the broker to abort)`));
    }, timeoutMs);

```

</details>

**依据 2 · 源码核查**：[plugins/dsh/scripts/dsh-broker.mjs:294-307](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/plugins/dsh/scripts/dsh-broker.mjs#L294-L307)

结果及停止。

<details>
<summary>查看原文（14行）</summary>

```text
    return { sessionId, finalResponse: finalResponse(events), eventCount: events.length, generation: this.generation };
  }

  async shutdown() {
    if (!this.child) {
      return;
    }
    try {
      await this.request("shutdown", undefined, { timeoutMs: 3000 });
    } catch {
      // The runtime exits on shutdown (or is already gone); force below.
    }
    if (this.child) {
      this.child.kill("SIGTERM");
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/scripts/lib/dsh.mjs:485-519](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/plugins/dsh/scripts/lib/dsh.mjs#L485-L519)

只读默认和无人审批。

<details>
<summary>查看原文（35行）</summary>

```text
 * - approval `never`: nobody is present to answer prompts; the sandbox mode
 *   stays the real safety boundary.
 * - a `permission` row whose single `unattended` preset matches exactly
 *   (mode, never): dsh-base's permission-presets service refuses to boot
 *   when the composed sandbox+approval pair names no preset, and it PINS the
 *   default preset's knobs into fresh sessions — so the preset must mirror
 *   the launch mode or it would override DSH_PERMISSION_MODE.
 */
export function buildUnattendedOverlayYaml(permissionMode) {
  const mode = normalizePermissionMode(permissionMode) ?? "read-only";
  return [
    "# generated by dsh-plugin-cc (unattended composition; see lib/dsh.mjs)",
    "- id: approval",
    "  config:",
    "    policy: never",
    "- id: permission",
    "  config:",
    "    presets:",
    "      unattended:",
    `        sandbox: ${yamlQuote(mode)}`,
    "        approval: never",
    "        name: unattended",
    `        description: ${yamlQuote("dsh-plugin-cc unattended run: sandbox fixed at launch, approvals disabled.")}`,
    "    defaultPreset: unattended",
    ""
  ].join("\n");
}

/** Write the per-mode unattended overlay under `<dir>/overlays`; returns its path. */
export function writeUnattendedOverlay(dir, permissionMode) {
  const mode = normalizePermissionMode(permissionMode) ?? "read-only";
  const overlaysDir = path.join(dir, "overlays");
  fs.mkdirSync(overlaysDir, { recursive: true });
  const file = path.join(overlaysDir, `unattended-${mode}.yml`);
  fs.writeFileSync(file, buildUnattendedOverlayYaml(mode), "utf8");
```

</details>

**依据 4 · 作者声明**：[README.md:74-81](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/README.md#L74-L81)

导入、视觉和平台限制。

```text
## Known limitations (v1)

- No mid-run approvals. Permissions are decided before launch (`--write` or not).
- Fresh one-shot runs are not resumable. Only `--session` / `--resume` / `/dsh:import` record session ids, and those live only as long as the broker process.
- Stop = kill. The SDK wire has no per-turn cancel; stopping a mid-turn broker run discards in-memory sessions.
- `/dsh:import` is a compressed text digest, not native history replay. Non-text Claude blocks (including images) are dropped.
- Visual understanding stays with Claude. Slash `$ARGUMENTS` is text; this plugin never forwards pasted images to DSH. `--model deepseek-v4-flash-vision-exp` only changes the model id. There is no `--image` flag. Native DSH vision belongs in `dsh web` / TUI. In `standard`, DSH may `read_image` a repo file — that is not a product path for Claude chat images.
- POSIX only. Windows is out of scope.
```

#### 缺口

- 未验证孤儿进程和 ACK 丢失
  **影响**：副作用和重试结果未知
  **进一步探讨**：隔离环境演练超时后查询、终止与恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验证委派是否减少来回切换？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

POSIX 测试仓库先运行只读 review，确认生成结果、进程及权限，再对相同任务比较手工终端与插件的用时和输出。多轮最后单独演练停止丢失；若依赖图片、交互审批或持久恢复，就继续用原生 DSH 入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-42](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/README.md#L31-L42)

依赖和安装入口。

<details>
<summary>查看原文（12行）</summary>

````text
## Quick start

Needs Node >= 20 and a `DEEPSEEK_API_KEY`. `/dsh:setup` also needs Node >= 22.19, `npm`, and `pnpm` (`corepack enable`).

```bash
/plugin marketplace add cpj-dev/dsh-plugin-cc
/plugin install dsh@deepseek-dsh
/dsh:setup
/dsh:review
```

Already have a built [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) checkout? `/dsh:setup --harness <path>`. Already have a `dsh` binary? set `DSH_BINARY`. Uninstall: remove the plugin, the plugin data dir, and `~/.dsh/profiles/cc`.
````

</details>

**依据 2 · 作者声明**：[README.md:74-81](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/README.md#L74-L81)

停止采用条件。

```text
## Known limitations (v1)

- No mid-run approvals. Permissions are decided before launch (`--write` or not).
- Fresh one-shot runs are not resumable. Only `--session` / `--resume` / `/dsh:import` record session ids, and those live only as long as the broker process.
- Stop = kill. The SDK wire has no per-turn cancel; stopping a mid-turn broker run discards in-memory sessions.
- `/dsh:import` is a compressed text digest, not native history replay. Non-text Claude blocks (including images) are dropped.
- Visual understanding stays with Claude. Slash `$ARGUMENTS` is text; this plugin never forwards pasted images to DSH. `--model deepseek-v4-flash-vision-exp` only changes the model id. There is no `--image` flag. Native DSH vision belongs in `dsh web` / TUI. In `standard`, DSH may `read_image` a repo file — that is not a product path for Claude chat images.
- POSIX only. Windows is out of scope.
```

**依据 3 · 源码核查**：[plugins/dsh/scripts/dsh-broker.mjs:227-238](https://github.com/cpj-dev/dsh-plugin-cc/blob/ffa8e8599d45582b1c73062cefcb9fcd40c69a72/plugins/dsh/scripts/dsh-broker.mjs#L227-L238)

结果未知时的验证需求。

<details>
<summary>查看原文（12行）</summary>

```text
  async run(sessionId, promptText, { timeoutMs = DEFAULT_BROKER_RUN_TIMEOUT_MS } = {}) {
    await this.ensureInitialized();
    const events = [];

    let settle;
    const done = new Promise((resolve, reject) => {
      settle = { resolve, reject };
    });
    const timer = setTimeout(() => {
      settle.reject(new Error(`run on session ${sessionId} timed out after ${timeoutMs}ms (the runtime keeps working; stop the broker to abort)`));
    }, timeoutMs);

```

</details>

#### 缺口

- 无实际 token 与用户成本
  **影响**：净收益未知
  **进一步探讨**：记录两种入口的时间及失败恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
