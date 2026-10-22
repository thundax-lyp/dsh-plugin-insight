# dsh-wsl-rclone

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[272a2ad](https://github.com/173787247/dsh-wsl-rclone/tree/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-rclone)
<!-- END META -->

> **实现功能**：把 rclone 的 remote 列表、文件名枚举和配额查看暴露为 DSH 只读工具。

> **核心亮点**：把现有 rclone 配置的只读观察能力接入 Agent。详见[Q01](#research-q01)。

> **风险与缺陷**：允许列表默认开放、lsf 先递归后切片可能带来远端访问与计费；健康 ok:true 易误判。详见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 只读 rclone 能力覆盖什么、不能做什么？](#detail-section-11)
  - [Q02 · 允许列表和路径校验能否约束 egress？](#detail-section-12)
  - [Q03 · 条目上限是否限制云端枚举量？](#detail-section-13)
  - [Q04 · status 与 about 的成功状态能代表什么？](#detail-section-14)
  - [Q05 · 怎样安全采用云端只读目录观察？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 rclone remote 时辅助查看云端目录与用量，适合只读诊断。详见[Q01](#research-q01)。

直接 rclone CLI 可做同样只读查询；插件主要提供 Agent 工具封装。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| listremotes | 找配置 | 仅名字 |
| lsf | 列文件 | 先枚举后截断 |
| about | 用量 | 后端不一定支持 |
| rclone_status | 查看rclone与remote基础状态 | 安装线索不等remote健康，计数非授权集合 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| rclone CLI | 必需 | 命令 | status rclone:null |
| rclone.conf 凭据 | 远端操作必需 | 访问 remote | 失败 |
| DSH tools | 必需 | Agent 入口 | 无工具 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 授权 | 只读 remote/白名单 | 可见范围 |
| 检查 | status/listremotes | 实际程序与 remote |
| 枚举 | 小路径 lsf/about | 成本与错误 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 安装 rclone、配只读 remote 与显式 allowedRemotes | 凭据/本地配置存储；云账户/订阅金额未知 | 限权限、校路径/动态 backend 工时未知 | 配错导致拒绝或外发，需轮换凭据 |
| 持续 | lsf 递归 depth3、about、listremotes | 云 list API/网络/进程资源；对象存储每次费用未知 | 缩小路径、审目录敏感性与账单，工时未知 | maxEntries 不能限上游请求数量 |
| 失败恢复 | 处理大目录输出杀进程、about 不支持、误访问 | 重试 API 请求和可能额外账单，金额未知 | 查日志/账单、收窄目录、禁动态 backend，工时未知 | 实际请求数和恢复时长未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 列目录 | rclone lsf | 大目录成本 |
| 配额 | rclone about | 后端支持 |
| 白名单 | remote 名过滤 | 空表默认安全 |

> **思考**：允许列表默认开放、lsf 先递归后切片可能带来远端访问与计费；健康 ok:true 易误判。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把现有 rclone 配置的只读观察能力接入 Agent。详见[Q01](#research-q01)。

把现有 rclone 配置的只读观察能力接入 Agent。详见[Q01](#research-q01)。

argv 避免 shell 拼接；默认 remote 策略和上游枚举限额需部署控制。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

允许列表默认开放、lsf 先递归后切片可能带来远端访问与计费；健康 ok:true 易误判。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只读凭据加显式 allowedRemotes，小路径先验；勿把 count 当总量或把 ok 当健康。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持只读命令；空 allowedRemotes 不限制且允许动态 backend，maxEntries 只截返回不限制上游枚举；status 无程序仍 ok:true。目标远端未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/rclone.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/rclone.js；未运行目标 rclone 或远端。旧 META 复用。
- 下一步：目标 rclone 测无 CLI、空/非空允许列表、动态 backend、大目录 list 请求量与 about 不支持。

**分析版本**

- **仓库**：[173787247/dsh-wsl-rclone](https://github.com/173787247/dsh-wsl-rclone)
- **版本号**：0.1.1（[固定提交 272a2ad](https://github.com/173787247/dsh-wsl-rclone/tree/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未实现的改进为默认拒绝远程、显式阻断动态 backend、真实上游分页/限额与健康语义。详见[Q05](#research-q05)。

目标 rclone 测无 CLI、空/非空允许列表、动态 backend、大目录 list 请求量与 about 不支持。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 481 |
| .js | source | 2 | 264 | 242 | 5 | — |
| .js | test | 1 | 7 | 7 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-rclone/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-rclone/issues?q=is%3Aissue+created%3A2026-09-20T09%3A42%3A25.824Z..2026-10-20T09%3A42%3A25.824Z)

暂未获取：近30天关闭。

统计日期：2026-10-20。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**rclone 只读工具的远程授权、枚举成本与健康状态是否清楚？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 只读 rclone 能力覆盖什么、不能做什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件注册 status、listremotes、lsf、about 四工具，只执行 version/listremotes/lsf/about，不暴露 copy/sync/delete。可在 Agent 对象存储或云盘现有 remote 上列名、查看配额，不能管理文件。读取仍会向配置的 remote 发送网络请求并暴露文件名/用量，需按最小授权配置 rclone.conf。README 顶部版本 0.1.0 与兼容表 0.1.1 不一致，固定包版需核 package.json。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/README.md#L1-L35)

作者只读用途与限制

<details>
<summary>查看原文（35行）</summary>

````text
# dsh-wsl-rclone

> **语言：** **中文**（本页） · [English](./README.en.md)

rclone 只读：listremotes / lsf / about。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-rclone
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-rclone
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `rclone_status` | rclone 是否可用 |
| `rclone_listremotes` | 远程名列表 |
| `rclone_lsf` | 列远程文件 |
| `rclone_about` | 用量/配额 |

## 配置要点

`allowedRemotes / timeoutMs`

无 copy/sync/delete。建议 `allowedRemotes` 限制 egress。勿把 rclone.conf 密钥贴进聊天。
````

</details>

**依据 2 · 作者声明**：[README.md:37-44](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/README.md#L37-L44)

版本表不一致

```text
## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-rclone` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

**依据 3 · 源码核查**：[index.js:27-130](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L27-L130)

四工具注册

<details>
<summary>查看原文（104行）</summary>

```text
  ctx.tools.register({
    name: "rclone_status",
    description: "Whether rclone is on PATH; version, remote count, allowedRemotes.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return { ...(await rcloneStatus()), allowedRemotes };
    },
    presentCall: () => ({ card: "generic", title: "rclone status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rclone status", content: r.content }),
  });

  ctx.tools.register({
    name: "rclone_listremotes",
    description: "List configured rclone remotes (names only).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.remotes || []).map((x) => `${x}:`).join("\n") || "(none)" },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        const r = await rcloneListRemotes({ timeoutMs });
        if (allowedRemotes.length) {
          r.remotes = (r.remotes || []).filter((x) => allowedRemotes.includes(x));
        }
        return r;
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "rclone remotes" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rclone remotes", content: r.content }),
  });

  ctx.tools.register({
    name: "rclone_lsf",
    description: "List remote files (rclone lsf, capped depth). Path like s3:bucket/prefix. No transfer.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string", description: "remote:path" },
        maxEntries: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : [`rclone_lsf count=${v.count}`, ...(v.entries || [])].join("\n"),
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        guardRemote(args.path);
        return await rcloneLsf({ remotePath: args.path, maxEntries: args.maxEntries, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "rclone lsf" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rclone lsf", content: r.content }),
  });

  ctx.tools.register({
    name: "rclone_about",
    description: "rclone about <remote>: (quota/usage when supported).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["remote"],
      properties: { remote: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : JSON.stringify(v.about || v.output, null, 2) },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        guardRemote(args.remote);
        return await rcloneAbout({ remote: args.remote, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "rclone about" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rclone about", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[lib/rclone.js:64-127](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L64-L127)

实际 CLI 子命令

<details>
<summary>查看原文（64行）</summary>

```text
export async function rcloneStatus() {
  const rclone = (await which("rclone")) || null;
  if (!rclone) return { ok: true, rclone: null, version: null, remoteCount: null };
  let version = null;
  let remoteCount = null;
  try {
    const ver = await run(rclone, ["version"], { timeoutMs: 8_000, maxOut: 4_000 });
    const line = (ver.stdout || "").split("\n").find((l) => /rclone\s+v/i.test(l)) || (ver.stdout || "").split("\n")[0];
    version = (line || "").trim() || null;
  } catch {
    /* ignore */
  }
  try {
    const rem = await rcloneListRemotes({ timeoutMs: 8_000 });
    remoteCount = Array.isArray(rem.remotes) ? rem.remotes.length : 0;
  } catch {
    remoteCount = null;
  }
  return { ok: true, rclone, version, remoteCount };
}

export async function rcloneListRemotes({ timeoutMs } = {}) {
  const bin = (await which("rclone")) || "rclone";
  const r = await run(bin, ["listremotes"], { timeoutMs: timeoutMs || 15_000, maxOut: 20_000 });
  if (r.code !== 0) throw new Error(`rclone listremotes failed: ${r.stderr || r.code}`);
  const remotes = r.stdout
    .split("\n")
    .map((s) => s.trim().replace(/:$/, ""))
    .filter(Boolean);
  return { ok: true, remotes };
}

export async function rcloneLsf({ remotePath, maxEntries = 100, timeoutMs, maxOut = 60_000 } = {}) {
  const path = assertRemotePath(remotePath);
  const n = Math.min(500, Math.max(1, Number(maxEntries) || 100));
  const bin = (await which("rclone")) || "rclone";
  // lsf is listing only — no transfer
  const r = await run(bin, ["lsf", "-R", "--max-depth", "3", path], { timeoutMs: timeoutMs || 60_000, maxOut });
  if (r.code !== 0) throw new Error(`rclone lsf failed: ${r.stderr || r.code}`);
  const entries = r.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n);
  return { ok: true, path, count: entries.length, truncated: r.truncated || entries.length >= n, entries };
}

export async function rcloneAbout({ remote, timeoutMs } = {}) {
  const name = assertRemote(remote);
  const bin = (await which("rclone")) || "rclone";
  const r = await run(bin, ["about", `${name}:`, "--json"], { timeoutMs: timeoutMs || 30_000, maxOut: 20_000 });
  if (r.code !== 0) {
    // some remotes lack about
    const r2 = await run(bin, ["about", `${name}:`], { timeoutMs: timeoutMs || 30_000, maxOut: 20_000 });
    if (r2.code !== 0) throw new Error(`rclone about failed: ${r2.stderr || r2.code}`);
    return { ok: true, remote: name, output: r2.stdout };
  }
  let json;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    json = null;
  }
  return { ok: true, remote: name, about: json, output: json ? null : r.stdout };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 允许列表和路径校验能否约束 egress？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

allowedRemotes 只在列表返回时过滤名字，并在 lsf/about 执行前取冒号前远程名做精确包含检查；空数组意味着任意 remote。assertRemotePath 仅需 remote:path 或以冒号开头的 rclone on-the-fly backend、拒 NUL/包含 ../超 500 字符；当允许列表非空，空 remote 会被 guard 拒绝；当未配列表则可通过 :backend: 形式，不受配置远程名约束。shell 只用于固定命令 `command -v rclone`，子命令用 spawn argv，避免参数注入。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-25](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L11-L25)

允许列表默认空与 guard

<details>
<summary>查看原文（15行）</summary>

```text
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const allowedRemotes = Array.isArray(config.allowedRemotes) ? config.allowedRemotes.map(String) : [];
  console.log(`[dsh-wsl-rclone] allowedRemotes=${allowedRemotes.length || "any (list/lsf/about only)"}`);

  ctx.systemPrompt.section({
    name: "tool:rclone",
    order: 136,
    text: "dsh-wsl-rclone is read-only: listremotes / lsf / about. No copy/sync/delete/move. Prefer allowedRemotes in config for egress control. Never paste rclone.conf secrets into chat.",
  });

  function guardRemote(remoteOrPath) {
    if (!allowedRemotes.length) return;
    const remote = String(remoteOrPath || "").split(":")[0];
    if (!allowedRemotes.includes(remote)) throw new Error(`remote not in allowedRemotes: ${remote}`);
  }
```

</details>

**依据 2 · 源码核查**：[index.js:53-60](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L53-L60)

listremotes 后过滤

```text
    async execute() {
      try {
        const r = await rcloneListRemotes({ timeoutMs });
        if (allowedRemotes.length) {
          r.remotes = (r.remotes || []).filter((x) => allowedRemotes.includes(x));
        }
        return r;
      } catch (e) {
```

**依据 3 · 源码核查**：[index.js:91-125](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L91-L125)

lsf/about 执行前 guard

<details>
<summary>查看原文（35行）</summary>

```text
    async execute(args) {
      try {
        guardRemote(args.path);
        return await rcloneLsf({ remotePath: args.path, maxEntries: args.maxEntries, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "rclone lsf" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rclone lsf", content: r.content }),
  });

  ctx.tools.register({
    name: "rclone_about",
    description: "rclone about <remote>: (quota/usage when supported).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["remote"],
      properties: { remote: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : JSON.stringify(v.about || v.output, null, 2) },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        guardRemote(args.remote);
        return await rcloneAbout({ remote: args.remote, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 4 · 源码核查**：[lib/rclone.js:20-32](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L20-L32)

允许以冒号开头路径

<details>
<summary>查看原文（13行）</summary>

```text
export function assertRemotePath(remotePath) {
  // remote:path form
  const s = String(remotePath || "").trim();
  if (!s || s.includes("\0") || s.includes("..")) throw new Error("invalid remote path");
  if (!/^[A-Za-z0-9._@+-]+:/.test(s) && !s.startsWith(":")) {
    // allow remote: or remote:folder
    throw new Error("path must be remote:path (e.g. s3:bucket/prefix)");
  }
  const remote = s.split(":")[0];
  if (remote) assertRemote(remote);
  if (s.length > 500) throw new Error("path too long");
  return s;
}
```

</details>

**依据 5 · 源码核查**：[lib/rclone.js:34-62](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L34-L62)

spawn argv

<details>
<summary>查看原文（29行）</summary>

```text
export function run(bin, args, { timeoutMs = 60_000, maxOut = 80_000 } = {}) {
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
}
```

</details>

#### 缺口

- 目标 rclone on-the-fly backend 语义未运行
  **影响：**默认允许配置外动态后端探测
  **进一步探讨：**目标隔离配置测 :backend: 与白名单

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 条目上限是否限制云端枚举量？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

rclone_lsf 调用 `lsf -R --max-depth 3 path`，命令结束后才按 maxEntries 取前 n，n 限 1..500；maxOut 最多保留 60K 字符，stdout 超过 2 倍会杀进程。因而 maxEntries 是返回上限，不是服务端/CLI 扫描上限；大 remote 仍会枚举、耗网络/请求额度，输出过大时杀进程而不是提供完整统计。count 是返回条目数，不是 remote 总数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/rclone.js:34-62](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L34-L62)

进程 stdout 上限与杀进程

<details>
<summary>查看原文（29行）</summary>

```text
export function run(bin, args, { timeoutMs = 60_000, maxOut = 80_000 } = {}) {
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
}
```

</details>

**依据 2 · 源码核查**：[lib/rclone.js:96-109](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L96-L109)

-R depth3 后切片 maxEntries

<details>
<summary>查看原文（14行）</summary>

```text
export async function rcloneLsf({ remotePath, maxEntries = 100, timeoutMs, maxOut = 60_000 } = {}) {
  const path = assertRemotePath(remotePath);
  const n = Math.min(500, Math.max(1, Number(maxEntries) || 100));
  const bin = (await which("rclone")) || "rclone";
  // lsf is listing only — no transfer
  const r = await run(bin, ["lsf", "-R", "--max-depth", "3", path], { timeoutMs: timeoutMs || 60_000, maxOut });
  if (r.code !== 0) throw new Error(`rclone lsf failed: ${r.stderr || r.code}`);
  const entries = r.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n);
  return { ok: true, path, count: entries.length, truncated: r.truncated || entries.length >= n, entries };
}
```

</details>

**依据 3 · 源码核查**：[index.js:68-100](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L68-L100)

工具参数与说明

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.tools.register({
    name: "rclone_lsf",
    description: "List remote files (rclone lsf, capped depth). Path like s3:bucket/prefix. No transfer.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string", description: "remote:path" },
        maxEntries: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : [`rclone_lsf count=${v.count}`, ...(v.entries || [])].join("\n"),
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        guardRemote(args.path);
        return await rcloneLsf({ remotePath: args.path, maxEntries: args.maxEntries, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "rclone lsf" }),
    presentResult: (_a, r) => ({ card: "generic", title: "rclone lsf", content: r.content }),
```

</details>

#### 缺口

- 目标大 remote 枚举请求成本未知
  **影响：**对对象存储可能产生较多 list API 费用
  **进一步探讨：**目标小/大桶对照请求次数与截断

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · status 与 about 的成功状态能代表什么？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

rclone_status 在没有 rclone 可执行文件时仍返回 ok:true、rclone:null；版本探测失败会忽略，remoteCount 获取失败常落 0/null，成功 JSON 不是环境健康保证。about 先加 --json，失败再退纯文本；有些 remote 不支持 about，两次调用会出错。allowedRemotes 对 listremotes 的可见名过滤，但 status.remoteCount 来自未过滤原始列表，可泄露总配置数。应按具体字段解释。

#### 证据与依据

**依据 1 · 源码核查**：[lib/rclone.js:64-83](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L64-L83)

status 缺程序仍 ok:true

<details>
<summary>查看原文（20行）</summary>

```text
export async function rcloneStatus() {
  const rclone = (await which("rclone")) || null;
  if (!rclone) return { ok: true, rclone: null, version: null, remoteCount: null };
  let version = null;
  let remoteCount = null;
  try {
    const ver = await run(rclone, ["version"], { timeoutMs: 8_000, maxOut: 4_000 });
    const line = (ver.stdout || "").split("\n").find((l) => /rclone\s+v/i.test(l)) || (ver.stdout || "").split("\n")[0];
    version = (line || "").trim() || null;
  } catch {
    /* ignore */
  }
  try {
    const rem = await rcloneListRemotes({ timeoutMs: 8_000 });
    remoteCount = Array.isArray(rem.remotes) ? rem.remotes.length : 0;
  } catch {
    remoteCount = null;
  }
  return { ok: true, rclone, version, remoteCount };
}
```

</details>

**依据 2 · 源码核查**：[lib/rclone.js:111-127](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L111-L127)

about 回退

<details>
<summary>查看原文（17行）</summary>

```text
export async function rcloneAbout({ remote, timeoutMs } = {}) {
  const name = assertRemote(remote);
  const bin = (await which("rclone")) || "rclone";
  const r = await run(bin, ["about", `${name}:`, "--json"], { timeoutMs: timeoutMs || 30_000, maxOut: 20_000 });
  if (r.code !== 0) {
    // some remotes lack about
    const r2 = await run(bin, ["about", `${name}:`], { timeoutMs: timeoutMs || 30_000, maxOut: 20_000 });
    if (r2.code !== 0) throw new Error(`rclone about failed: ${r2.stderr || r2.code}`);
    return { ok: true, remote: name, output: r2.stdout };
  }
  let json;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    json = null;
  }
  return { ok: true, remote: name, about: json, output: json ? null : r.stdout };
```

</details>

**依据 3 · 源码核查**：[index.js:27-36](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L27-L36)

status 拼 allowedRemotes

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.tools.register({
    name: "rclone_status",
    description: "Whether rclone is on PATH; version, remote count, allowedRemotes.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return { ...(await rcloneStatus()), allowedRemotes };
    },
```

</details>

**依据 4 · 源码核查**：[index.js:53-59](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L53-L59)

listremotes 过滤

```text
    async execute() {
      try {
        const r = await rcloneListRemotes({ timeoutMs });
        if (allowedRemotes.length) {
          r.remotes = (r.remotes || []).filter((x) => allowedRemotes.includes(x));
        }
        return r;
```

#### 缺口

- 目标后端 about 支持/工具耗时未测
  **影响：**自动诊断若只看 ok 会误判
  **进一步探讨：**目标无 rclone/不支持 about 的 remote 验证

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样安全采用云端只读目录观察？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

先为 rclone 准备只读凭据并设置 allowedRemotes 精确列表，做 status 和 listremotes 对照，再在小路径调用 lsf/about；避免将 rclone.conf 或敏感目录结果贴进会话。批量目录应在目标后端评估 list API 成本。若希望真正规模受控，需使用 rclone 自身分页/限额或后端特定接口，当前 maxEntries 不能限上游扫描。安全边界主要是 remote 凭据和允许列表。 假设推导：空 allowedRemotes 放行配置 remote 与动态 backend，lsf 先递归枚举再切 maxEntries，status 缺程序仍 ok:true；因此“只读”不能等同“受限访问与成本”。相对固定版，要求显式 remote 白名单并禁止 on-the-fly backend，使用后端可验证的上游分页/限额或拒绝超大枚举，且将健康拆为命令可执行/remote 可达，可减少意外 egress 与费用误判。条件是具体 rclone backend 支持可控分页/限流并可稳定统计请求；代价是新增配置和分批请求，可能不覆盖原本动态 backend 用户。最小对照用空白/白名单配置、:backend:、小/大对象存储桶和不支持 about 的 remote，比较固定版/原型的未授权目的地触达、list API 请求数/账单、返回完整性与健康误报率。若仍能触达白名单外后端或大桶请求数未下降，或正常小目录无法列出，则假设被证伪；上游限额不是当前 maxEntries 的已实现能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-35](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/README.md#L22-L35)

作者配置建议

<details>
<summary>查看原文（14行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `rclone_status` | rclone 是否可用 |
| `rclone_listremotes` | 远程名列表 |
| `rclone_lsf` | 列远程文件 |
| `rclone_about` | 用量/配额 |

## 配置要点

`allowedRemotes / timeoutMs`

无 copy/sync/delete。建议 `allowedRemotes` 限制 egress。勿把 rclone.conf 密钥贴进聊天。
```

</details>

**依据 2 · 源码核查**：[index.js:21-25](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/index.js#L21-L25)

允许列表

```text
  function guardRemote(remoteOrPath) {
    if (!allowedRemotes.length) return;
    const remote = String(remoteOrPath || "").split(":")[0];
    if (!allowedRemotes.includes(remote)) throw new Error(`remote not in allowedRemotes: ${remote}`);
  }
```

**依据 3 · 源码核查**：[lib/rclone.js:96-127](https://github.com/173787247/dsh-wsl-rclone/blob/272a2adaba5711ec6b5e7b45463bff5e0e04b6c9/lib/rclone.js#L96-L127)

远端命令

<details>
<summary>查看原文（32行）</summary>

```text
export async function rcloneLsf({ remotePath, maxEntries = 100, timeoutMs, maxOut = 60_000 } = {}) {
  const path = assertRemotePath(remotePath);
  const n = Math.min(500, Math.max(1, Number(maxEntries) || 100));
  const bin = (await which("rclone")) || "rclone";
  // lsf is listing only — no transfer
  const r = await run(bin, ["lsf", "-R", "--max-depth", "3", path], { timeoutMs: timeoutMs || 60_000, maxOut });
  if (r.code !== 0) throw new Error(`rclone lsf failed: ${r.stderr || r.code}`);
  const entries = r.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n);
  return { ok: true, path, count: entries.length, truncated: r.truncated || entries.length >= n, entries };
}

export async function rcloneAbout({ remote, timeoutMs } = {}) {
  const name = assertRemote(remote);
  const bin = (await which("rclone")) || "rclone";
  const r = await run(bin, ["about", `${name}:`, "--json"], { timeoutMs: timeoutMs || 30_000, maxOut: 20_000 });
  if (r.code !== 0) {
    // some remotes lack about
    const r2 = await run(bin, ["about", `${name}:`], { timeoutMs: timeoutMs || 30_000, maxOut: 20_000 });
    if (r2.code !== 0) throw new Error(`rclone about failed: ${r2.stderr || r2.code}`);
    return { ok: true, remote: name, output: r2.stdout };
  }
  let json;
  try {
    json = JSON.parse(r.stdout || "{}");
  } catch {
    json = null;
  }
  return { ok: true, remote: name, about: json, output: json ? null : r.stdout };
```

</details>

#### 缺口

- 真实对象存储计费/可见范围未知
  **影响：**只能当受控只读诊断工具
  **进一步探讨：**只读凭据小目录试点与审计

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
