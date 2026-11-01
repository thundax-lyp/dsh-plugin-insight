# dsh-remote-ssh-run

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f1c36a4](https://github.com/173787247/dsh-remote-ssh/tree/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-remote-ssh)
<!-- END META -->

> **功能**：在 DSH 中对配置主机执行白名单 SSH 命令。

> **亮点**：[Q01](#research-q01) 集中远程查询入口，[Q02](#research-q02) 将受配置限制的命令接到本机 SSH。

> **主要限制**：[Q03](#research-q03) 有限变更名单不能保证只读；accept-new 不预先核验首次主机密钥，超时不证明远端停止。

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
  - [Q01 · 远程 SSH 工具相对手工 SSH 的用途和范围是什么？](#detail-section-11)
  - [Q02 · 工具注册如何校验命令并调用 SSH？](#detail-section-12)
  - [Q03 · 默认只读、主机信任和失败的实际边界？](#detail-section-13)
  - [Q04 · 凭据、主机和具体采用退出条件是什么？](#detail-section-14)
  - [Q05 · 如何减少超时后重复执行的误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权用户希望从 DSH 查询远程 Unix 类主机。

用户在终端手工通过 SSH 执行并复核输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主机选择 | 查配置主机 | 首次密钥需独立核实 |
| SSH 执行 | 发允许的命令 | 参数副作用未全限制 |
| 探针 | 执行固定查询集合 | 受白名单限制 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH 工具服务和 Node | 必需 | 注册调用 | 无法使用 |
| 本机 SSH 与凭据 | 必需 | 建立认证连接 | 命令失败 |
| 已授权主机和低权限账户 | 必需 | 限制访问与副作用 | 不应连接 |
| 预核主机密钥 | 采用前重要 | 验证目标 | 首次 accept-new 不验证来源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核授权、主机密钥和低权限账号 | 不明则停止 |
| 配置 | 仅允许明确只读命令及参数 | 不授权其他能力 |
| 试用 | 在测试机运行无副作用探针 | 检查远端结果 |
| 异常 | 超时后核远端状态 | 未知时不盲目重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 配置 | SSH 基础设施成本未知 | 审核主机和密钥 | 权限依赖环境 |
| 运行 | 网络与主机成本未知 | 核命令和敏感输出 | 副作用未全部限制 |
| 失败 | 远端恢复成本未知 | 核进程及状态 | 本地超时不证明远端停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目标选择 | 限已配置主机 | 首次主机身份正确 |
| 命令 | 名称白名单和有限变更检查 | 任意允许命令只读 |
| 超时 | 杀本地 SSH 进程 | 远端动作停止 |

> **思考**：[Q03](#research-q03) 有限变更名单不能保证只读；accept-new 不预先核验首次主机密钥，超时不证明远端停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中远程查询入口，[Q02](#research-q02) 将受配置限制的命令接到本机 SSH。

[Q03](#research-q03) 检查有限命令名，不等于参数级只读；confirm 是工具布尔值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 有限变更名单不能保证只读；accept-new 不预先核验首次主机密钥，超时不证明远端停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离测试机与低权限账户预核 host key，只运行审查过的只读探针；未知状态先查远端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查主机与命令检查、SSH 参数和超时路径；未运行远端。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/ssh.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、工具注册和 SSH helper；未运行目标、连接主机或执行命令。
- 下一步：[Q05](#research-q05) 核现有审批界面后用延迟和先写后阻塞样例对照。

**分析版本**

- **仓库**：[173787247/dsh-remote-ssh](https://github.com/173787247/dsh-remote-ssh)
- **版本号**：0.1.1（[固定提交 f1c36a4](https://github.com/173787247/dsh-remote-ssh/tree/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显示身份来源及远端未知状态可减少误重跑；未验证。

[Q05](#research-q05) 核现有审批界面后用延迟和先写后阻塞样例对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 99 | — | — | 468 |
| .md | example | 1 | 73 | — | — | 317 |
| .js | source | 2 | 272 | 259 | 1 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 SSH 工具的允许范围、主机信任及失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程 SSH 工具相对手工 SSH 的用途和范围是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:3-5、18-31 描述从 DSH 对允许的 Unix/AIX/macOS 主机执行命令；相对用户自行打开 SSH 并复制输出，工具向模型提供配置主机和受限命令入口。远程 SSH 本身、账号权限和结果正确性不是插件提供；未在真实主机测节时、兼容或安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-5](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/README.md#L3-L5)

作者描述远程主机场景。

```text
> Optional companion to [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit). Not in `install.sh`.

用 **SSH** 把 Unix / IBM AIX / macOS 等旧世界主机接到 DeepSeek Harness（工具在 dsh 侧执行，默认只读 + 命令白名单）。
```

**依据 2 · 作者声明**：[README.md:18-31](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/README.md#L18-L31)

作者描述工具和本机 ssh-agent。

<details>
<summary>查看原文（14行）</summary>

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
````

</details>

**依据 3 · 源码核查**：[package.json:1-9](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/package.json#L1-L9)

插件与 Node 要求。

```text
{
  "name": "dsh-remote-ssh-run",
  "version": "0.1.1",
  "description": "DeepSeek Harness plugin: allowlisted SSH to Unix/AIX/macOS hosts (read-only by default).",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-remote-ssh.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
```

#### 缺口

- 未执行远程主机任务
  **影响**：不能证明效率或安全
  **进一步探讨**：用隔离主机与人工 SSH 对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具注册如何校验命令并调用 SSH？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:17-26 从配置读取 hosts、allowCommands、allowMutate 和限额；74-105 注册 remote_ssh_run，解析 hostId、校验 argv，再调 runSsh 并根据退出码返回 ok。ssh.js:17-25 在多主机时要求 id 并拒绝未知主机，29-45 检查换行、部分元字符、允许命令名和有限变更名单；66-84 用本机 spawn 启动 ssh、BatchMode 和 accept-new。此处不启动本地 shell，但不能据此断言远端参数传递具有完整的 shell 隔离或服务端命令无副作用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-26](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/index.js#L17-L26)

配置默认值与主机、命令列表。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-remote-ssh] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const maxOutputChars = positive(config.maxOutputChars, 40_000);
  const hosts = listHosts(config.hosts);
  const allowCommands = Array.isArray(config.allowCommands) ? config.allowCommands.map(String) : [];
  const allowMutate = config.allowMutate === true;
```

</details>

**依据 2 · 源码核查**：[index.js:74-105](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/index.js#L74-L105)

工具到 SSH 的调用链。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/ssh.js:17-25](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L17-L25)

选择配置主机。

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
```

**依据 4 · 源码核查**：[lib/ssh.js:29-45](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L29-L45)

参数与命令检查。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/ssh.js:66-84](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L66-L84)

本地 SSH 进程参数。

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

- 未执行 SSH 或远端 shell
  **影响**：不能保证参数语义、主机兼容与真实效果
  **进一步探讨**：隔离主机核实远端实际参数。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认只读、主机信任和失败的实际边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

ssh.js:29-45 允许列表按 basename 或完整名字匹配，只有列出的 rm、mv 等命令触发 allowMutate 和 confirm 双条件，未对所有命令参数判断副作用；若运维将可写命令或带写入参数的工具加入白名单，默认只读不能保证。index.js:88、97-103 的 confirm 是工具输入布尔值，源码不证明用户人工批准。ssh.js:68-74 用 StrictHostKeyChecking=accept-new，首次未知主机密钥会被接受而非事先核实；87-108 限时杀进程，stdout 限长但 stderr 先累加后截取，超时不能证明远端操作已停止或未发生。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh.js:29-45](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L29-L45)

白名单和有限变更命令检查。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:88-105](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/index.js#L88-L105)

confirm 是工具参数并参与检查。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/ssh.js:66-90](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L66-L90)

首次主机信任及超时杀本地进程。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/ssh.js:91-108](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L91-L108)

输出累加及截断。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行远端命令、安全或超时测试
  **影响**：无法保证只读、人工批准与远端停止
  **进一步探讨**：低权限测试主机核主机密钥和副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、主机和具体采用退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:1-9 声明 Node >=18，README:25-31 描述 SSH agent；需要本机 ssh、可达主机及已授权身份。首次应通过可信渠道预核主机密钥，按最小权限与只读账户配置极窄命令和参数；日志输出可能包含敏感信息，网络与人工排障成本未知。先只对测试机执行无副作用探针，未知主机、权限不明、超时或结果不完整时停止并在远端核实际状态，不能盲目重跑。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-9](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/package.json#L1-L9)

Node 及插件定位。

```text
{
  "name": "dsh-remote-ssh-run",
  "version": "0.1.1",
  "description": "DeepSeek Harness plugin: allowlisted SSH to Unix/AIX/macOS hosts (read-only by default).",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-remote-ssh.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
```

**依据 2 · 作者声明**：[README.md:25-31](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/README.md#L25-L31)

作者描述安装与 SSH 身份。

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-remote-ssh
```

在 profile 的 `cordis.patch.yml` 配置 `hosts` / `allowCommands`（见 `examples/hosts.cordis.snippet.yml`）。凭据走本机 ssh-agent（可与 [dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent) 配合）。
````

**依据 3 · 源码核查**：[lib/ssh.js:29-45](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L29-L45)

限制不是完整只读策略。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/ssh.js:66-90](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L66-L90)

主机信任和超时。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

#### 缺口

- 未验证实际 host key、身份和服务端行为
  **影响**：不能保证生产环境可控
  **进一步探讨**：可信渠道核密钥并用隔离低权限账号试用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少超时后重复执行的误判？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有工具返回 exit code、输出和超时错误，已有 allowMutate 与 confirm；简单再加确认复选框不能证明用户批准或远端未运行。设想客户端在每次请求显示目标指纹来源、命令及超时后 unknown 状态，并要求用户基于远端可核验的操作记录决定核查或重新提交；必须明示不自动重放，不能把本地进程终止当远端终止。对照现有输出，在远端延迟、先写后阻塞、网络中断和首次密钥变更下测误重跑和误认完成；无法可靠确认身份、状态未知被显示失败即安全或重复副作用不下降则否定。先核现有宿主界面是否已有等价决策流程。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:88-105](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/index.js#L88-L105)

已有确认字段及返回结果。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/ssh.js:66-108](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L66-L108)

已有主机信任、超时和输出。

<details>
<summary>查看原文（43行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/ssh.js:29-45](https://github.com/173787247/dsh-remote-ssh/blob/f1c36a403fb0ad78a6e2a1c77513775c4ce6ab40/lib/ssh.js#L29-L45)

现有限定命令规则。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

#### 缺口

- 未查全宿主 UI 与远端核验接口
  **影响**：新增性和效果未知
  **进一步探讨**：先核现有审批与故障模拟。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
