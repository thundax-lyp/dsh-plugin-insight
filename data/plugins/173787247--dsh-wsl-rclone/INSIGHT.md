# WSL rclone 查询工具

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4f242b3](https://github.com/173787247/dsh-wsl-rclone/tree/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-rclone)
<!-- END META -->

> **功能**：在 DSH 中查询 rclone 远程名称、目录条目与用量配额。

> **亮点**：[Q01](#research-q01) 用专用入口把远程文件枚举和配额结果带进 DSH。

> **主要限制**：[Q03](#research-q03) 名单为空等于不限远程名，非空名单也不限制目录前缀。

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
  - [Q01 · 哪些 rclone 任务可以留在 DSH 会话？](#detail-section-11)
  - [Q02 · 目录查询如何限深、限量和处理失败？](#detail-section-12)
  - [Q03 · 只读和 allowedRemotes 能约束什么？](#detail-section-13)
  - [Q04 · 如何做可退出的有限试用？](#detail-section-14)
  - [Q05 · 路径级限制能否降低共享远程误读？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已配置 rclone 的 DSH 用户可查询远程的文件名和用量。

手工 rclone 查询能控制凭据和参数，工具减少构造命令与搬运输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程枚举 | 查已配置名称 | 名单为空不限制 |
| 目录查询 | 列条目和截断信息 | 深度及输出有上限 |
| 用量 | 查配额和用量 | 依赖后端支持 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| rclone 和 bash | 必需 | 定位并运行查询 | 工具失败 |
| 测试远程和凭据 | 查远程必需 | 访问对象元数据 | 保留本地手工查询 |
| 非空远程名单 | 限定 remote 时需要 | 限制可查询名称 | 空时不限制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配置测试远程及名单 | 先检查拒绝路径 |
| 查询 | 列目录并检查截断 | 和 CLI 对照 |
| 退出 | 禁用插件 | 继续原有查询 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 凭据与网络开销未知 | 配置时间未知 | 依赖 WSL 工具链 |
| 持续 | 后端请求开销未知 | 核对列表耗时未知 | 响应有截断 |
| 恢复 | 重试开销未知 | 排查后端时间未知 | 保留 CLI |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 目录查询 | 固定 lsf 及上限 | 后端结果是否齐全 |
| 配额 | 优先 JSON 后尝试普通输出 | 后端是否支持 |

> **思考**：[Q03](#research-q03) 名单为空等于不限远程名，非空名单也不限制目录前缀。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用专用入口把远程文件枚举和配额结果带进 DSH。

查询使用参数数组，超时与输出边界分别约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 名单为空等于不限远程名，非空名单也不限制目录前缀。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先明确非空远程名单，再验证合成目录的允许、拒绝和截断。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核查命令、名单和限量；未运行 WSL 或实际远程。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/rclone.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口和 rclone 辅助源码，未运行 CLI、WSL 或目标远程。
- 下一步：用只含测试数据的远程核查名单、结果和退出。

**分析版本**

- **仓库**：[173787247/dsh-wsl-rclone](https://github.com/173787247/dsh-wsl-rclone)
- **版本号**：0.1.1（[固定提交 4f242b3](https://github.com/173787247/dsh-wsl-rclone/tree/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 测试前缀策略能否减少同一远程内的越界枚举。

用只含测试数据的远程核查名单、结果和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 481 |
| .js | source | 2 | 264 | 242 | 5 | — |
| .js | test | 1 | 7 | 7 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-rclone/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-rclone/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-rclone/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 rclone 工具的只读范围、名单行为和失败语义。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些 rclone 任务可以留在 DSH 会话？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有远程配置的操作者可用专用工具查远程名、目录条目和配额。相较让模型用通用 shell 写命令，它把入口缩小为几个预定操作并将结果映射成工具输出。清单不是下载或完整目录镜像；后端不支持配额时也不能承诺返回用量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-35](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/README.md#L22-L35)

作者给出的工具范围

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

**依据 2 · 源码核查**：[index.js:41-65](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L41-L65)

远程列表注册和结果

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[index.js:103-129](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L103-L129)

配额查询注册和错误

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

#### 缺口

- 未测真实远程和用户流程
  **影响**：不能比较查询时间及支持范围
  **进一步探讨**：选择一个测试远程对照 CLI 输出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录查询如何限深、限量和处理失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

执行固定 rclone lsf 参数数组，递归深度限制为 3，返回行数夹到最多 500，子进程还受超时及 stdout 裁剪限制。条目数量等于上限时标 truncated，即使真实数量恰好等于上限也可能标记，因此适合提醒信息可能不完整。超时杀的是启动的子进程；stderr 在输出前裁剪，采集过程本身未限长。about 在 JSON 调用非零时再试一次普通输出，因此一次逻辑查询可能启动两次进程。

#### 证据与依据

**依据 1 · 源码核查**：[lib/rclone.js:34-61](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/lib/rclone.js#L34-L61)

进程、时限和输出处理

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/rclone.js:96-108](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/lib/rclone.js#L96-L108)

固定参数与输出截断

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/rclone.js:111-127](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/lib/rclone.js#L111-L127)

配额查询的重试和解析

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

#### 缺口

- 未测慢后端及大量输出
  **影响**：不能确认内存、及时终止和完整性
  **进一步探讨**：用受控后端生成分页规模及超时案例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读和 allowedRemotes 能约束什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

配置只有非空名单才检查，lsf/about 按冒号前的远程名匹配。名单可限制暴露的远程名称，但代码不约束同一远程内的前缀、rclone 实际使用的凭据或网络目标。没有名单时校验还接受以冒号开头的路径并直接传给 rclone，不能认定仅会触达已命名的配置。工具输出会带文件名，status 的远程数量也来自完整列表而非名单后的数量，故只读描述不能当作保密边界。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-25](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L11-L25)

名单为空不设 guard

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

**依据 2 · 源码核查**：[index.js:27-35](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L27-L35)

状态工具汇总全量数量

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
```

**依据 3 · 源码核查**：[index.js:89-96](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L89-L96)

lsf 接线先查名单

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        guardRemote(args.path);
        return await rcloneLsf({ remotePath: args.path, maxEntries: args.maxEntries, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

**依据 4 · 源码核查**：[lib/rclone.js:20-31](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/lib/rclone.js#L20-L31)

输入可含冒号开头的路径

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/rclone.js:64-82](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/lib/rclone.js#L64-L82)

状态执行全量 listremotes

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

#### 缺口

- 未验证本机 rclone 后端及权限行为
  **影响**：不能确认所有路径的实际目标
  **进一步探讨**：配置受限测试账号并核对允许与拒绝的 remote

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何做可退出的有限试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 DSH web profile、宿主可找到的 rclone 以及预先配置的测试远程。先设非空 allowedRemotes，核查 status 和列表，再对允许前缀做一次查询并比较 CLI。看到意外文件名、后端报错或远程不可控时禁用插件，改用有明确凭据边界的手动查询。README 的版本表和兼容描述来自作者，包清单给出的固定版本为 0.1.1，本轮未复现宿主。费用、网络和排障时间未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-20](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/README.md#L12-L20)

作者安装入口

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-rclone
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-rclone
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`
````

**依据 2 · 作者声明**：[README.md:31-44](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/README.md#L31-L44)

配置和套件兼容口径

<details>
<summary>查看原文（14行）</summary>

```text
## 配置要点

`allowedRemotes / timeoutMs`

无 copy/sync/delete。建议 `allowedRemotes` 限制 egress。勿把 rclone.conf 密钥贴进聊天。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-rclone` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.2-alpha.3`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

</details>

**依据 3 · 源码核查**：[package.json:1-13](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/package.json#L1-L13)

固定版本及宿主包入口

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-wsl-rclone",
  "version": "0.1.1",
  "description": "DeepSeek Harness WSL plugin: read-only rclone listremotes/lsf/about.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-rclone.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "rclone"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 4 · 源码核查**：[index.js:6-12](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L6-L12)

可在入口禁用

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-rclone] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const allowedRemotes = Array.isArray(config.allowedRemotes) ? config.allowedRemotes.map(String) : [];
```

#### 缺口

- 未运行 WSL、rclone 或远程服务
  **影响**：无法保证可连接及退出行为
  **进一步探讨**：从无真实数据的测试远程开始

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 路径级限制能否降低共享远程误读？

**研究主题**：新假设与验证

#### 完整回答

现有名单只识别冒号前的名称。同一远程包含多个项目时，可验证服务端增加明确前缀约束是否能减少越出目标项目的枚举。用隔离后端测试同名远程的允许、相似和空前缀，分别记录误放和误拒；若兼容路径被大量拒绝或真实权限无改善，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:21-25](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/index.js#L21-L25)

名单只查远程名称

```text
  function guardRemote(remoteOrPath) {
    if (!allowedRemotes.length) return;
    const remote = String(remoteOrPath || "").split(":")[0];
    if (!allowedRemotes.includes(remote)) throw new Error(`remote not in allowedRemotes: ${remote}`);
  }
```

**依据 2 · 源码核查**：[lib/rclone.js:96-108](https://github.com/173787247/dsh-wsl-rclone/blob/4f242b333594b3f3d1ed6a7c24c891d607ac7c7d/lib/rclone.js#L96-L108)

直接传入完整远程路径

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

#### 缺口

- 前缀方案尚未实现
  **影响**：不能用它解释当前保护
  **进一步探讨**：做不同目录规则的拒绝对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
