# dsh-remote-ssh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d294fe0](https://github.com/173787247/dsh-remote-ssh/tree/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-remote-ssh)
<!-- END META -->

> **功能**：以 SSH 将远程 Unix/AIX/macOS 的白名单诊断命令接入 DSH Agent 工具。

> **亮点**：把跨平台旧主机诊断从 SSH CLI 接入 Agent 并附白名单与探测组。详见[Q01](#research-q01)。

> **主要限制**：远端命令参数解释和模型自填 confirm 不能替代安全 shell quoting/人工授权；只读依赖白名单与远端账号。详见[Q02](#research-q02)和[Q03](#research-q03)。

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
  - [Q01 · 远程 SSH 插件提供哪些实际诊断工具？](#detail-section-11)
  - [Q02 · 白名单与“argv 不走 shell”在何处生效？](#detail-section-12)
  - [Q03 · allowMutate+confirm 是真实人工审批吗？](#detail-section-13)
  - [Q04 · 连接身份与探测状态可能误导什么？](#detail-section-14)
  - [Q05 · 怎样在旧主机诊断中安全采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对配置好的旧系统主机执行诊断，前提是只读 SSH 账号与明确命令白名单。详见[Q01](#research-q01)。

人工 SSH 到主机可做相同诊断，插件加 Agent 接口与初级命令名门槛。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| status | 主机列表 | probe 可失败 |
| run | 执行白名单 | 远端解释未知 |
| probe | 批量诊断 | 外层 ok 非全成功 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| ssh CLI/密钥 | 必需 | 连接 | 失败 |
| 远端账号 | 必需 | 执行 | 无权限 |
| DSH tools | 必需 | Agent 入口 | 无工具 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | host/白名单/账号 | 最小权限 |
| 状态 | status/probe | 逐项 code/stderr |
| 执行 | 固定 argv run | 目标结果/审计 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 配 SSH 账号、密钥、已核指纹主机与固定白名单 | 本地密钥存储、远端账户与测试主机资源；新增现金金额未知 | 管理员核指纹、限权、逐命令审计和旧 OS 兼容调试，工时未知 | 远端 shell 分词不符需回退配置并重测 |
| 持续 | status/run/probe 逐项诊断 | 网络流量、远端 CPU/进程与日志存储；按量费用未知 | 值班人员核每项 code/stderr、维护白名单与密钥，工时未知 | 外层 ok 不能替代子项健康监控 |
| 失败恢复 | 处理误执行、密钥异常、误报健康或超时 | 隔离主机、凭据轮换、重试命令及可能业务损失，金额未知 | 调查远端日志、撤销权限、修复主机和重测审批，耗时未知 | 实际事故概率、恢复时间与旧主机兼容性未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 诊断 | 预设 probe 命令 | 目标旧系统兼容 |
| 白名单 | 命令名检查 | 完整只读 |
| 身份 | ssh-agent/密钥 | 指纹已确认 |

> **思考**：远端命令参数解释和模型自填 confirm 不能替代安全 shell quoting/人工授权；只读依赖白名单与远端账号。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把跨平台旧主机诊断从 SSH CLI 接入 Agent 并附白名单与探测组。详见[Q01](#research-q01)。

主机配置/OS probe 便于迁移；远端 shell 语义、有限 mutate 正则与外层 ok 需注意。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

远端命令参数解释和模型自填 confirm 不能替代安全 shell quoting/人工授权；只读依赖白名单与远端账号。详见[Q02](#research-q02)和[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用最小权限只读账号与固定命令，测试远端参数解释；变更另走人工审批。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核三工具；本地 argv 不等于远端无 shell，confirm 是模型布尔参数，首连 host key accept-new。目标 SSH 未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/ssh.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/ssh.js；未连接目标 SSH 主机。旧 META 复用。
- 下一步：隔离 SSH 主机测 host key、空格/引号/通配 argv、未列写命令、模型 confirm 和多命令超时。

**分析版本**

- **仓库**：[173787247/dsh-remote-ssh](https://github.com/173787247/dsh-remote-ssh)
- **版本号**：0.1.1（[固定提交 d294fe0](https://github.com/173787247/dsh-remote-ssh/tree/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未实现改进为固定远端 wrapper、host key pinning 和真实批准通道。详见[Q05](#research-q05)。

隔离 SSH 主机测 host key、空格/引号/通配 argv、未列写命令、模型 confirm 和多命令超时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 99 | — | — | 468 |
| .md | example | 1 | 73 | — | — | 317 |
| .js | source | 2 | 272 | 259 | 1 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-remote-ssh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：远程 SSH 的命令白名单、远端解释与人工授权边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程 SSH 插件提供哪些实际诊断工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

源码注册 remote_ssh_status、remote_ssh_run、remote_ssh_probe 三个工具；README 表只列 status/run。status 可列配置主机并对单主机尝试 uname；probe 依 OS hint 运行固定诊断组，逐命令核白名单，不许可的标为 skipped。适合已通过 ssh-agent/密钥管理 Unix/AIX/macOS 主机的诊断；只读取决于 allowCommands 内容与远程命令行为，插件并不理解每个可执行程序的副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-39](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/README.md#L18-L39)

作者两工具与安全说明

<details>
<summary>查看原文（22行）</summary>

````text
## 工具

| 工具 | 作用 |
|------|------|
| `remote_ssh_status` | 列出配置主机；可选 uname 探测 |
| `remote_ssh_run` | 在指定 hostId 上跑白名单 argv（不走 shell） |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-remote-ssh
```

在 profile 的 `cordis.patch.yml` 配置 `hosts` / `allowCommands`（见 `examples/hosts.cordis.snippet.yml`）。凭据走本机 ssh-agent（可与 [dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent) 配合）。

## 安全

- BatchMode SSH，禁止交互口令进聊天
- argv 禁止 shell 元字符与换行
- 破坏性命令需 allowMutate + confirm
- AIX 默认白名单含 oslevel / errpt / lsps / lparstat

````

</details>

**依据 2 · 源码核查**：[index.js:35-68](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L35-L68)

status

<details>
<summary>查看原文（34行）</summary>

```text
  ctx.tools.register({
    name: "remote_ssh_status",
    description: "List configured SSH hosts and optionally probe one with uname.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        hostId: { type: "string", description: "Probe this host; omit to only list" },
        probe: { type: "boolean", description: "default true when hostId set" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const out = { ok: true, hosts, allowCommands, allowMutate };
        if (args.hostId || (hosts.length === 1 && args.probe !== false)) {
          const host = resolveHost(hosts, args.hostId);
          if (args.probe === false) {
            out.selected = host;
          } else {
            const argv = assertAllowedCommand(["uname", "-a"], allowCommands);
            const r = await runSsh(host, argv, { timeoutMs, maxOutputChars });
            out.probe = { host: host.id, ...r };
          }
        }
        return out;
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e), hosts };
      }
```

</details>

**依据 3 · 源码核查**：[index.js:74-112](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L74-L112)

run

<details>
<summary>查看原文（39行）</summary>

```text
  ctx.tools.register({
    name: "remote_ssh_run",
    description: "Run an allowlisted argv on a configured SSH host (no shell). AIX/macOS/Linux.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["argv"],
      properties: {
        hostId: { type: "string" },
        argv: {
          type: "array",
          items: { type: "string" },
          description: "Executable + args, e.g. [\"df\",\"-h\"] or AIX [\"oslevel\",\"-s\"]",
        },
        confirm: { type: "boolean", description: "required with allowMutate for mutating cmds" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = resolveHost(hosts, args.hostId);
        const argv = assertAllowedCommand(args.argv, allowCommands, {
          allowMutate,
          confirm: args.confirm === true,
        });
        const r = await runSsh(host, argv, { timeoutMs, maxOutputChars });
        return { ok: r.code === 0, hostId: host.id, os: host.os, ...r };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "remote ssh run" }),
    presentResult: (_a, r) => ({ card: "generic", title: "remote ssh run", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[index.js:114-157](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L114-L157)

第三个 probe

<details>
<summary>查看原文（44行）</summary>

```text
  ctx.tools.register({
    name: "remote_ssh_probe",
    description:
      "Run a fixed read-only probe suite (uname/uptime/df/…) on a host. Skips commands not in allowCommands.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        hostId: { type: "string" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }],
    },
    timeoutMs: timeoutMs * 4,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = resolveHost(hosts, args.hostId);
        const suite = probeSuite(host.os);
        const results = [];
        for (const argv of suite) {
          try {
            const allowed = assertAllowedCommand(argv, allowCommands);
            const r = await runSsh(host, allowed, { timeoutMs, maxOutputChars });
            results.push({ argv: allowed, ok: r.code === 0, stdout: r.stdout, stderr: r.stderr });
          } catch (e) {
            results.push({
              argv,
              ok: false,
              skipped: true,
              error: e instanceof Error ? e.message : String(e),
            });
          }
        }
        return { ok: true, hostId: host.id, os: host.os, results };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "remote ssh probe" }),
    presentResult: (_a, r) => ({ card: "generic", title: "remote ssh probe", content: r.content }),
  });
```

</details>

**依据 5 · 源码核查**：[lib/ssh.js:48-64](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L48-L64)

OS 诊断组

<details>
<summary>查看原文（17行）</summary>

```text
/** Read-only probe argv lists; skip entries whose cmd is not allowlisted. */
export function probeSuite(osHint = "unix") {
  const os = String(osHint || "unix").toLowerCase();
  const common = [
    ["uname", "-a"],
    ["hostname"],
    ["uptime"],
    ["df", "-h"],
  ];
  if (os === "aix") {
    return [...common, ["oslevel", "-s"], ["errpt", "-a"], ["lsps", "-a"]];
  }
  if (os === "darwin" || os === "macos" || os === "mac") {
    return [...common, ["sw_vers"], ["vm_stat"]];
  }
  return [...common, ["free", "-m"], ["ps", "-eo", "pid,comm", "--sort=-pcpu"]];
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 白名单与“argv 不走 shell”在何处生效？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

本地 Node 用 spawn("ssh", sshArgs) 而非 shell 字符串，禁止换行和若干元字符，按 basename 或完整 argv[0] 比白名单。但 SSH 客户端会将目标后命令参数传给远端命令解释层；源码未为每个 argv 做远端 shell quoting，也把 `--` 放在目标 host 后当远端命令一部分。带空格、引号、通配等参数的真实语义需通过目标 SSH 测，不可把本地 spawn argv 直接等同端到端无 shell。安全配置应只允许固定、无用户可控复杂参数的命令。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-37](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/README.md#L22-L37)

作者不走 shell 主张

<details>
<summary>查看原文（16行）</summary>

````text
| `remote_ssh_status` | 列出配置主机；可选 uname 探测 |
| `remote_ssh_run` | 在指定 hostId 上跑白名单 argv（不走 shell） |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-remote-ssh
```

在 profile 的 `cordis.patch.yml` 配置 `hosts` / `allowCommands`（见 `examples/hosts.cordis.snippet.yml`）。凭据走本机 ssh-agent（可与 [dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent) 配合）。

## 安全

- BatchMode SSH，禁止交互口令进聊天
- argv 禁止 shell 元字符与换行
- 破坏性命令需 allowMutate + confirm
````

</details>

**依据 2 · 源码核查**：[lib/ssh.js:29-46](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L29-L46)

本地过滤/白名单

<details>
<summary>查看原文（18行）</summary>

```text
export function assertAllowedCommand(argv, allowCommands, { allowMutate = false, confirm = false } = {}) {
  const args = Array.isArray(argv) ? argv.map(String) : [];
  if (!args.length) throw new Error("argv required");
  if (args.some((a) => a.includes("\n") || a.includes("\r"))) throw new Error("newlines in argv blocked");
  for (const a of args) {
    if (/[;&|`$<>]/.test(a)) throw new Error(`shell metacharacter blocked in arg: ${a}`);
  }
  const cmd = basename(args[0]);
  const allow = new Set((allowCommands || []).map(String));
  if (!allow.has(cmd) && !allow.has(args[0])) {
    throw new Error(`command not in allowCommands: ${cmd}`);
  }
  const mutateRe = /^(rm|mv|cp|chmod|chown|kill|reboot|shutdown|mkfs|dd|crontab|useradd|passwd)$/;
  if (mutateRe.test(cmd) && !(allowMutate && confirm)) {
    throw new Error(`mutating command blocked without allowMutate+confirm: ${cmd}`);
  }
  return args;
}
```

</details>

**依据 3 · 源码核查**：[lib/ssh.js:66-84](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L66-L84)

SSH argv 构建与 spawn

<details>
<summary>查看原文（19行）</summary>

```text
export function runSsh(host, argv, { timeoutMs = 60_000, maxOutputChars = 40_000 } = {}) {
  const target = host.user ? `${host.user}@${host.host}` : host.host;
  const sshArgs = [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=10",
    "-o",
    "StrictHostKeyChecking=accept-new",
    "-p",
    String(host.port || 22),
  ];
  if (host.identityFile) {
    sshArgs.push("-i", String(host.identityFile));
    sshArgs.push("-o", "IdentitiesOnly=yes");
  }
  sshArgs.push(target, "--", ...argv);
  return new Promise((resolve, reject) => {
    const child = spawn("ssh", sshArgs, { stdio: ["ignore", "pipe", "pipe"] });
```

</details>

#### 缺口

- 目标 OpenSSH/远端 shell 对 `--` 和空格的行为未测
  **影响**：参数可能被错误分词或解释
  **进一步探讨**：隔离主机测空格/引号/通配/实际 argv

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · allowMutate+confirm 是真实人工审批吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

mutateRe 仅识别 rm/mv/cp/chmod/chown/kill/reboot/shutdown/mkfs/dd/crontab/useradd/passwd 这些 basename；若配置允许其他可写程序或危险选项，无法据此保证只读。confirm 是 remote_ssh_run 的模型工具布尔参数，并未调用宿主审批/用户提问，因此 allowMutate=true 时模型可自行填 confirm=true，不能视为人工批准。真正防写需远端账号权限、固定命令和独立审批策略。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:80-104](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L80-L104)

confirm 模型参数进入 guard

<details>
<summary>查看原文（25行）</summary>

```text
      required: ["argv"],
      properties: {
        hostId: { type: "string" },
        argv: {
          type: "array",
          items: { type: "string" },
          description: "Executable + args, e.g. [\"df\",\"-h\"] or AIX [\"oslevel\",\"-s\"]",
        },
        confirm: { type: "boolean", description: "required with allowMutate for mutating cmds" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = resolveHost(hosts, args.hostId);
        const argv = assertAllowedCommand(args.argv, allowCommands, {
          allowMutate,
          confirm: args.confirm === true,
        });
        const r = await runSsh(host, argv, { timeoutMs, maxOutputChars });
```

</details>

**依据 2 · 源码核查**：[lib/ssh.js:36-46](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L36-L46)

有限 mutating 命令正则

<details>
<summary>查看原文（11行）</summary>

```text
  const cmd = basename(args[0]);
  const allow = new Set((allowCommands || []).map(String));
  if (!allow.has(cmd) && !allow.has(args[0])) {
    throw new Error(`command not in allowCommands: ${cmd}`);
  }
  const mutateRe = /^(rm|mv|cp|chmod|chown|kill|reboot|shutdown|mkfs|dd|crontab|useradd|passwd)$/;
  if (mutateRe.test(cmd) && !(allowMutate && confirm)) {
    throw new Error(`mutating command blocked without allowMutate+confirm: ${cmd}`);
  }
  return args;
}
```

</details>

**依据 3 · 作者声明**：[README.md:33-39](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/README.md#L33-L39)

作者破坏性命令条件

```text
## 安全

- BatchMode SSH，禁止交互口令进聊天
- argv 禁止 shell 元字符与换行
- 破坏性命令需 allowMutate + confirm
- AIX 默认白名单含 oslevel / errpt / lsps / lparstat

```

#### 缺口

- 实际宿主工具审批设置未知
  **影响**：误将参数当人类确认可导致远端写入
  **进一步探讨**：用只读测试账号核未列 mutating 命令与审批

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 连接身份与探测状态可能误导什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

SSH 连接用 BatchMode=yes、ConnectTimeout=10、StrictHostKeyChecking=accept-new；首次主机密钥按 TOFU 接受，源码没有固定 known_hosts 指纹。未给 hostId 时单主机自动选取，多主机要求明确。status 的外层 ok:true 表示列出配置成功，probe 子结果可能非零；probe 工具逐项失败/跳过但外层仍 ok:true。仅看外层 ok 会漏掉远端不可达或诊断项失败。probe 连续运行多命令，最大工具 timeoutMs 为单命令的 4 倍，若 suite 多于四项、每项接近 timeout，可能先被宿主终止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh.js:17-27](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L17-L27)

host 选择

<details>
<summary>查看原文（11行）</summary>

```text
export function resolveHost(hosts, id) {
  const list = listHosts(hosts);
  if (!list.length) throw new Error("no hosts configured — set config.hosts in cordis.patch.yml");
  if (!id) {
    if (list.length === 1) return list[0];
    throw new Error(`hostId required; known: ${list.map((h) => h.id).join(", ")}`);
  }
  const hit = list.find((h) => h.id === id);
  if (!hit) throw new Error(`unknown hostId=${id}; known: ${list.map((h) => h.id).join(", ")}`);
  return hit;
}
```

</details>

**依据 2 · 源码核查**：[lib/ssh.js:66-82](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L66-L82)

BatchMode 与 accept-new

<details>
<summary>查看原文（17行）</summary>

```text
export function runSsh(host, argv, { timeoutMs = 60_000, maxOutputChars = 40_000 } = {}) {
  const target = host.user ? `${host.user}@${host.host}` : host.host;
  const sshArgs = [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=10",
    "-o",
    "StrictHostKeyChecking=accept-new",
    "-p",
    String(host.port || 22),
  ];
  if (host.identityFile) {
    sshArgs.push("-i", String(host.identityFile));
    sshArgs.push("-o", "IdentitiesOnly=yes");
  }
  sshArgs.push(target, "--", ...argv);
```

</details>

**依据 3 · 源码核查**：[index.js:52-68](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L52-L68)

status 外层 ok

<details>
<summary>查看原文（17行）</summary>

```text
    async execute(args) {
      try {
        const out = { ok: true, hosts, allowCommands, allowMutate };
        if (args.hostId || (hosts.length === 1 && args.probe !== false)) {
          const host = resolveHost(hosts, args.hostId);
          if (args.probe === false) {
            out.selected = host;
          } else {
            const argv = assertAllowedCommand(["uname", "-a"], allowCommands);
            const r = await runSsh(host, argv, { timeoutMs, maxOutputChars });
            out.probe = { host: host.id, ...r };
          }
        }
        return out;
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e), hosts };
      }
```

</details>

**依据 4 · 源码核查**：[index.js:129-151](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L129-L151)

probe 多命令/外层 ok

<details>
<summary>查看原文（23行）</summary>

```text
    timeoutMs: timeoutMs * 4,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = resolveHost(hosts, args.hostId);
        const suite = probeSuite(host.os);
        const results = [];
        for (const argv of suite) {
          try {
            const allowed = assertAllowedCommand(argv, allowCommands);
            const r = await runSsh(host, allowed, { timeoutMs, maxOutputChars });
            results.push({ argv: allowed, ok: r.code === 0, stdout: r.stdout, stderr: r.stderr });
          } catch (e) {
            results.push({
              argv,
              ok: false,
              skipped: true,
              error: e instanceof Error ? e.message : String(e),
            });
          }
        }
        return { ok: true, hostId: host.id, os: host.os, results };
      } catch (e) {
```

</details>

#### 缺口

- 目标主机/宿主超时未测
  **影响**：健康和身份信号可能被高估
  **进一步探讨**：已知主机指纹/故障探测矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样在旧主机诊断中安全采用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先用隔离、最小权限的 SSH 账号与已核指纹的 known_hosts，白名单只留业务允许的固定命令；status/probe 仅用于诊断，检查每项 code/stderr；任何变更命令必须走独立用户审批，不依赖 confirm=true 参数。对 AIX 等老系统需验证 argv 分词、环境路径、输出编码和超时。改进可用远端固定 wrapper 接收结构化参数、明确 host key pinning 和真实审批。实际兼容性与人力成本未知。 假设推导：现有本地 spawn argv/命令名白名单只约束本地进程参数，SSH 目标后的参数可能经远端解释；有限 mutateRe 也漏掉其他写程序，而 confirm 可由模型自填，accept-new 首连不校已知指纹，status/probe 外层 ok 不能代表所有子项成功。若换为远端受限账号下的固定 wrapper 接结构化参数、预置并核对 host key、变更走宿主独立人工审批，能在保留诊断入口的同时收紧远端解释、身份和授权边界。前提是能部署 wrapper、限制账号命令与取得审批通道；代价是运维部署、审批延迟及旧系统兼容调试。最小对照在隔离主机固定同一允许诊断，分别用原版/原型测试空格与元字符参数、未列写程序、模型自行传 confirm=true、首次/更换主机密钥、子诊断失败；比较实际执行命令、写入、主机身份判定和子项失败告警。若原型仍执行未授权写入、接受更换的密钥、绕过人工审批，或仍把失败 probe 报为健康，则证伪。wrapper、pinning 和独立审批均为未实现建议。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-39](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/README.md#L25-L39)

作者安装与安全

<details>
<summary>查看原文（15行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-remote-ssh
```

在 profile 的 `cordis.patch.yml` 配置 `hosts` / `allowCommands`（见 `examples/hosts.cordis.snippet.yml`）。凭据走本机 ssh-agent（可与 [dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent) 配合）。

## 安全

- BatchMode SSH，禁止交互口令进聊天
- argv 禁止 shell 元字符与换行
- 破坏性命令需 allowMutate + confirm
- AIX 默认白名单含 oslevel / errpt / lsps / lparstat

````

</details>

**依据 2 · 源码核查**：[lib/ssh.js:29-46](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L29-L46)

白名单

<details>
<summary>查看原文（18行）</summary>

```text
export function assertAllowedCommand(argv, allowCommands, { allowMutate = false, confirm = false } = {}) {
  const args = Array.isArray(argv) ? argv.map(String) : [];
  if (!args.length) throw new Error("argv required");
  if (args.some((a) => a.includes("\n") || a.includes("\r"))) throw new Error("newlines in argv blocked");
  for (const a of args) {
    if (/[;&|`$<>]/.test(a)) throw new Error(`shell metacharacter blocked in arg: ${a}`);
  }
  const cmd = basename(args[0]);
  const allow = new Set((allowCommands || []).map(String));
  if (!allow.has(cmd) && !allow.has(args[0])) {
    throw new Error(`command not in allowCommands: ${cmd}`);
  }
  const mutateRe = /^(rm|mv|cp|chmod|chown|kill|reboot|shutdown|mkfs|dd|crontab|useradd|passwd)$/;
  if (mutateRe.test(cmd) && !(allowMutate && confirm)) {
    throw new Error(`mutating command blocked without allowMutate+confirm: ${cmd}`);
  }
  return args;
}
```

</details>

**依据 3 · 源码核查**：[lib/ssh.js:66-113](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L66-L113)

执行与输出边界

<details>
<summary>查看原文（48行）</summary>

```text
export function runSsh(host, argv, { timeoutMs = 60_000, maxOutputChars = 40_000 } = {}) {
  const target = host.user ? `${host.user}@${host.host}` : host.host;
  const sshArgs = [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=10",
    "-o",
    "StrictHostKeyChecking=accept-new",
    "-p",
    String(host.port || 22),
  ];
  if (host.identityFile) {
    sshArgs.push("-i", String(host.identityFile));
    sshArgs.push("-o", "IdentitiesOnly=yes");
  }
  sshArgs.push(target, "--", ...argv);
  return new Promise((resolve, reject) => {
    const child = spawn("ssh", sshArgs, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("ssh timeout"));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (stdout.length > maxOutputChars * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(t);
      resolve({
        code,
        stdout: stdout.slice(0, maxOutputChars),
        stderr: stderr.slice(0, 4000),
        truncated: stdout.length > maxOutputChars,
        target,
        argv,
      });
    });
  });
```

</details>

**依据 4 · 源码核查**：[lib/ssh.js:29-46](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L29-L46)

本地过滤/白名单

<details>
<summary>查看原文（18行）</summary>

```text
export function assertAllowedCommand(argv, allowCommands, { allowMutate = false, confirm = false } = {}) {
  const args = Array.isArray(argv) ? argv.map(String) : [];
  if (!args.length) throw new Error("argv required");
  if (args.some((a) => a.includes("\n") || a.includes("\r"))) throw new Error("newlines in argv blocked");
  for (const a of args) {
    if (/[;&|`$<>]/.test(a)) throw new Error(`shell metacharacter blocked in arg: ${a}`);
  }
  const cmd = basename(args[0]);
  const allow = new Set((allowCommands || []).map(String));
  if (!allow.has(cmd) && !allow.has(args[0])) {
    throw new Error(`command not in allowCommands: ${cmd}`);
  }
  const mutateRe = /^(rm|mv|cp|chmod|chown|kill|reboot|shutdown|mkfs|dd|crontab|useradd|passwd)$/;
  if (mutateRe.test(cmd) && !(allowMutate && confirm)) {
    throw new Error(`mutating command blocked without allowMutate+confirm: ${cmd}`);
  }
  return args;
}
```

</details>

**依据 5 · 源码核查**：[lib/ssh.js:66-84](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L66-L84)

SSH argv 构建与 spawn

<details>
<summary>查看原文（19行）</summary>

```text
export function runSsh(host, argv, { timeoutMs = 60_000, maxOutputChars = 40_000 } = {}) {
  const target = host.user ? `${host.user}@${host.host}` : host.host;
  const sshArgs = [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=10",
    "-o",
    "StrictHostKeyChecking=accept-new",
    "-p",
    String(host.port || 22),
  ];
  if (host.identityFile) {
    sshArgs.push("-i", String(host.identityFile));
    sshArgs.push("-o", "IdentitiesOnly=yes");
  }
  sshArgs.push(target, "--", ...argv);
  return new Promise((resolve, reject) => {
    const child = spawn("ssh", sshArgs, { stdio: ["ignore", "pipe", "pipe"] });
```

</details>

**依据 6 · 源码核查**：[index.js:80-104](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L80-L104)

confirm 模型参数进入 guard

<details>
<summary>查看原文（25行）</summary>

```text
      required: ["argv"],
      properties: {
        hostId: { type: "string" },
        argv: {
          type: "array",
          items: { type: "string" },
          description: "Executable + args, e.g. [\"df\",\"-h\"] or AIX [\"oslevel\",\"-s\"]",
        },
        confirm: { type: "boolean", description: "required with allowMutate for mutating cmds" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.stdout || JSON.stringify(v, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = resolveHost(hosts, args.hostId);
        const argv = assertAllowedCommand(args.argv, allowCommands, {
          allowMutate,
          confirm: args.confirm === true,
        });
        const r = await runSsh(host, argv, { timeoutMs, maxOutputChars });
```

</details>

**依据 7 · 源码核查**：[lib/ssh.js:36-46](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L36-L46)

有限 mutating 命令正则

<details>
<summary>查看原文（11行）</summary>

```text
  const cmd = basename(args[0]);
  const allow = new Set((allowCommands || []).map(String));
  if (!allow.has(cmd) && !allow.has(args[0])) {
    throw new Error(`command not in allowCommands: ${cmd}`);
  }
  const mutateRe = /^(rm|mv|cp|chmod|chown|kill|reboot|shutdown|mkfs|dd|crontab|useradd|passwd)$/;
  if (mutateRe.test(cmd) && !(allowMutate && confirm)) {
    throw new Error(`mutating command blocked without allowMutate+confirm: ${cmd}`);
  }
  return args;
}
```

</details>

**依据 8 · 源码核查**：[lib/ssh.js:17-27](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L17-L27)

host 选择

<details>
<summary>查看原文（11行）</summary>

```text
export function resolveHost(hosts, id) {
  const list = listHosts(hosts);
  if (!list.length) throw new Error("no hosts configured — set config.hosts in cordis.patch.yml");
  if (!id) {
    if (list.length === 1) return list[0];
    throw new Error(`hostId required; known: ${list.map((h) => h.id).join(", ")}`);
  }
  const hit = list.find((h) => h.id === id);
  if (!hit) throw new Error(`unknown hostId=${id}; known: ${list.map((h) => h.id).join(", ")}`);
  return hit;
}
```

</details>

**依据 9 · 源码核查**：[lib/ssh.js:66-82](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/lib/ssh.js#L66-L82)

BatchMode 与 accept-new

<details>
<summary>查看原文（17行）</summary>

```text
export function runSsh(host, argv, { timeoutMs = 60_000, maxOutputChars = 40_000 } = {}) {
  const target = host.user ? `${host.user}@${host.host}` : host.host;
  const sshArgs = [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=10",
    "-o",
    "StrictHostKeyChecking=accept-new",
    "-p",
    String(host.port || 22),
  ];
  if (host.identityFile) {
    sshArgs.push("-i", String(host.identityFile));
    sshArgs.push("-o", "IdentitiesOnly=yes");
  }
  sshArgs.push(target, "--", ...argv);
```

</details>

**依据 10 · 源码核查**：[index.js:52-68](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L52-L68)

status 外层 ok

<details>
<summary>查看原文（17行）</summary>

```text
    async execute(args) {
      try {
        const out = { ok: true, hosts, allowCommands, allowMutate };
        if (args.hostId || (hosts.length === 1 && args.probe !== false)) {
          const host = resolveHost(hosts, args.hostId);
          if (args.probe === false) {
            out.selected = host;
          } else {
            const argv = assertAllowedCommand(["uname", "-a"], allowCommands);
            const r = await runSsh(host, argv, { timeoutMs, maxOutputChars });
            out.probe = { host: host.id, ...r };
          }
        }
        return out;
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e), hosts };
      }
```

</details>

**依据 11 · 源码核查**：[index.js:129-151](https://github.com/173787247/dsh-remote-ssh/blob/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd/index.js#L129-L151)

probe 多命令/外层 ok

<details>
<summary>查看原文（23行）</summary>

```text
    timeoutMs: timeoutMs * 4,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        const host = resolveHost(hosts, args.hostId);
        const suite = probeSuite(host.os);
        const results = [];
        for (const argv of suite) {
          try {
            const allowed = assertAllowedCommand(argv, allowCommands);
            const r = await runSsh(host, allowed, { timeoutMs, maxOutputChars });
            results.push({ argv: allowed, ok: r.code === 0, stdout: r.stdout, stderr: r.stderr });
          } catch (e) {
            results.push({
              argv,
              ok: false,
              skipped: true,
              error: e instanceof Error ? e.message : String(e),
            });
          }
        }
        return { ok: true, hostId: host.id, os: host.os, results };
      } catch (e) {
```

</details>

#### 缺口

- 目标旧系统环境/权限未测
  **影响**：不宜直接给生产管理员账号
  **进一步探讨**：隔离实验机的命令/身份/超时矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
