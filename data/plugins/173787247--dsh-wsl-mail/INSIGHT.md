# dsh-wsl-mail

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[455e0ea](https://github.com/173787247/dsh-wsl-mail/tree/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-mail)
<!-- END META -->

> **实现功能**：通过本机 Himalaya 与 notmuch CLI 向 DSH 提供信封列表、未读概况和邮件搜索。

> **核心亮点**：把本机邮件元数据和索引摘要以只读工具给 Agent，降低命令行检索步骤。详见[Q01](#research-q01)。

> **风险与缺陷**：notmuch 缺失时“未读”计数实际为近期信封数；长 JSON 输出截断后仍可能以 ok:true 文本呈现。详见[Q02](#research-q02)与[Q03](#research-q03)。

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
  - [Q01 · 邮件插件可支持哪些只读场景？](#detail-section-11)
  - [Q02 · 未读计数与列表分别如何产生？](#detail-section-12)
  - [Q03 · 输出截断和 fallback 会影响读者看到的邮件吗？](#detail-section-13)
  - [Q04 · 搜索结果和邮件内容的隐私边界是什么？](#detail-section-14)
  - [Q05 · 怎样先试用并避免未读误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本机邮件客户端已配置时做只读收件箱初筛；不读完整正文或发送邮件。详见[Q01](#research-q01)。

手工 Himalaya/notmuch 原生命令可完整掌握账户和索引状态；插件只简化 Agent 调用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 未读概况 | 快速初筛 | 后备不是未读数 |
| 列表/搜索 | 找主题/摘要 | 长结果截断 |
| 只读 | 不发送/删除 | 邮件元数据进模型 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools | 必需 | Agent 入口 | 无工具 |
| Himalaya | list 必需 | 邮箱信封 | 列表不可用 |
| notmuch | search 必需 | 本地索引/准确未读 | 后备样本 |
| 邮箱配置/索引作业 | 必需 | 数据来源 | 陈旧/空结果 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 自查 | mail_status | CLI 在 PATH |
| 核未读 | mail_unread | 看 backend/note |
| 检索 | list/notmuch | 与客户端对照 |
| 复核 | 长结果和隐私 | 截断不直接结案 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 接入 | Himalaya/notmuch 配置 | 邮箱/索引管理 | 兼容未测 |
| 查询 | CLI/索引检索 | 核样本与截断 | 时延未知 |
| 隐私 | 邮件元数据进模型 | 授权/脱敏 | 目标边界未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 信封/搜索 | CLI 封装 | 索引实时性 |
| 未读数 | notmuch count | 后备同语义 |
| 只读 | 无 send/delete 工具 | 底层 CLI 完全无副作用 |

> **思考**：notmuch 缺失时“未读”计数实际为近期信封数；长 JSON 输出截断后仍可能以 ok:true 文本呈现。详见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本机邮件元数据和索引摘要以只读工具给 Agent，降低命令行检索步骤。详见[Q01](#research-q01)。

把本机邮件元数据和索引摘要以只读工具给 Agent，降低命令行检索步骤。详见[Q01](#research-q01)。

spawn 参数数组与回退便于复用；未读后备语义/截断异常需显式标记。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

notmuch 缺失时“未读”计数实际为近期信封数；长 JSON 输出截断后仍可能以 ok:true 文本呈现。详见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核 mail_status 与未读语义，Himalaya fallback 仅视近期样本，敏感邮箱限制 Agent 访问。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核四工具；Himalaya 后备 count 不是未读总数，索引新鲜度外部依赖，长输出可能截断；目标 CLI 未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/mail.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、index.js、lib/mail.js、package.json；未执行邮件 CLI/目标宿主。旧 META 仅复用。
- 下一步：目标邮箱测试 notmuch 新鲜度、无 notmuch fallback、大输出/JSON异常、敏感元数据呈现。

**分析版本**

- **仓库**：[173787247/dsh-wsl-mail](https://github.com/173787247/dsh-wsl-mail)
- **版本号**：0.1.1（[固定提交 455e0ea](https://github.com/173787247/dsh-wsl-mail/tree/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为返回 countKind/索引时间、严格标示截断并限制 stderr 内存。详见[Q05](#research-q05)。

目标邮箱测试 notmuch 新鲜度、无 notmuch fallback、大输出/JSON异常、敏感元数据呈现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 115 | — | — | 460 |
| .js | source | 2 | 263 | 246 | 3 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-mail/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：邮件只读工具的未读计数、索引新鲜度与输出边界是否足以支持收件箱分诊？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 邮件插件可支持哪些只读场景？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件在 DSH 注册 mail_status、mail_unread、mail_list、mail_notmuch 四个工具，分别查 CLI、未读概况、Himalaya 信封列表和 notmuch 摘要搜索。README 工具表仅列 status/list/notmuch，未列源码中的 unread；代码没有注册发送/删除调用。适合本机邮件客户端已配置后做收件箱初筛与本地索引检索；不是完整邮件正文阅读、自动回复或账户配置器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-34](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/README.md#L5-L34)

作者只读说明与三项工具表

<details>
<summary>查看原文（30行）</summary>

````text
邮件只读：himalaya list / notmuch search。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-mail
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-mail
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `mail_status` | CLI 是否可用 |
| `mail_list` | himalaya 信封列表 |
| `mail_notmuch` | notmuch 搜索 |

## 配置要点

`timeoutMs`

不发送、不删除。自行配置 himalaya/notmuch；勿贴 IMAP 密码。
````

</details>

**依据 2 · 源码核查**：[index.js:20-129](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/index.js#L20-L129)

源码四工具注册

<details>
<summary>查看原文（110行）</summary>

```text
  ctx.tools.register({
    name: "mail_status",
    description: "Whether himalaya / notmuch are on PATH.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return mailStatus();
    },
    presentCall: () => ({ card: "generic", title: "mail status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mail status", content: r.content }),
  });

  ctx.tools.register({
    name: "mail_unread",
    description: "Unread mail count (notmuch tag:unread preferred; else recent himalaya INBOX). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { limit: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `backend=${v.backend} count=${v.count}${v.note ? `\n${v.note}` : ""}\n${JSON.stringify(v.samples || v.envelopes || [], null, 2)}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await mailUnread({ limit: args?.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mail unread" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mail unread", content: r.content }),
  });

  ctx.tools.register({
    name: "mail_list",
    description: "himalaya envelope list (folder, capped).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        folder: { type: "string" },
        limit: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.envelopes || []).map((e) => `${e.id}\t${e.date}\t${e.subject}`).join("\n") ||
                v.output ||
                "(none)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await himalayaList({ folder: args?.folder, limit: args?.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mail list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mail list", content: r.content }),
  });

  ctx.tools.register({
    name: "mail_notmuch",
    description: "notmuch search --format=json (capped).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["query"],
      properties: { query: { type: "string" }, limit: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : JSON.stringify(v.results || v.output, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await notmuchSearch({ query: args.query, limit: args.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "notmuch" }),
    presentResult: (_a, r) => ({ card: "generic", title: "notmuch", content: r.content }),
  });
```

</details>

**依据 3 · 源码核查**：[lib/mail.js:44-49](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L44-L49)

CLI 状态

```text
export async function mailStatus() {
  return {
    ok: true,
    himalaya: (await which("himalaya")) || null,
    notmuch: (await which("notmuch")) || null,
  };
```

#### 缺口

- 目标 himalaya/notmuch 配置与邮箱授权未核
  **影响**：可用工具数与文档不一致；只读范围不涵盖底层客户端副作用
  **进一步探讨**：目标 CLI 账户只读测试

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 未读计数与列表分别如何产生？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

mail_unread 优先 notmuch count tag:unread 得总数，再 search 取最多10条样本；若 notmuch 不在 PATH，则用 Himalaya INBOX 近期信封列表代替，并在 note 说它没有未读过滤。后一分支的 count 只是取回信封数，不能当未读邮件总数。notmuch 索引由外部程序维护，本插件未调用 sync/reindex，因此计数新鲜度取决于外围作业。CLI 由 spawn(bin,args) 数组调用，query 限500字符、搜索/列表上限50条。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mail.js:52-79](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L52-L79)

未读两条分支

<details>
<summary>查看原文（28行）</summary>

```text
/** High-freq unread count via notmuch (preferred) or himalaya INBOX sample. */
export async function mailUnread({ limit = 20, timeoutMs } = {}) {
  const notmuch = await which("notmuch");
  if (notmuch) {
    const countR = await run(notmuch, ["count", "tag:unread"], { timeoutMs: timeoutMs || 15_000, maxOut: 200 });
    if (countR.code !== 0) throw new Error(`notmuch count failed: ${countR.stderr || countR.code}`);
    const count = Number((countR.stdout || "").trim()) || 0;
    let samples = [];
    try {
      const search = await notmuchSearch({ query: "tag:unread", limit, timeoutMs });
      samples = search.results || [];
    } catch {
      samples = [];
    }
    return { ok: true, backend: "notmuch", count, samples: samples.slice(0, Math.min(10, Number(limit) || 20)) };
  }
  const himalaya = await which("himalaya");
  if (!himalaya) throw new Error("neither notmuch nor himalaya on PATH");
  const list = await himalayaList({ folder: "INBOX", limit, timeoutMs });
  return {
    ok: true,
    backend: "himalaya",
    count: list.count ?? (list.envelopes || []).length,
    note: "himalaya has no unread filter here — showing recent INBOX envelopes",
    envelopes: list.envelopes || null,
    output: list.output || null,
  };
}
```

</details>

**依据 2 · 源码核查**：[lib/mail.js:81-127](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L81-L127)

列表/搜索限制

<details>
<summary>查看原文（47行）</summary>

```text
export async function himalayaList({ folder = "INBOX", limit = 20, timeoutMs } = {}) {
  const bin = (await which("himalaya")) || "himalaya";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const folderSafe = String(folder || "INBOX").replace(/[^A-Za-z0-9._/+-]/g, "");
  // himalaya envelope list
  const r = await run(bin, ["envelope", "list", "-f", folderSafe, "-s", String(n), "-o", "json"], {
    timeoutMs,
    maxOut: 80_000,
  });
  if (r.code !== 0) {
    // fallback without json
    const r2 = await run(bin, ["envelope", "list", "-f", folderSafe, "-s", String(n)], { timeoutMs });
    if (r2.code !== 0) throw new Error(`himalaya list failed: ${r2.stderr || r2.code}`);
    return { ok: true, folder: folderSafe, output: r2.stdout, truncated: r2.truncated };
  }
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, folder: folderSafe, output: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((e) => ({
    id: e.id,
    subject: e.subject,
    from: e.from,
    date: e.date,
  }));
  return { ok: true, folder: folderSafe, count: list.length, envelopes: list };
}

export async function notmuchSearch({ query, limit = 20, timeoutMs } = {}) {
  const q = String(query || "").trim();
  if (!q || q.length > 500) throw new Error("invalid notmuch query");
  const bin = (await which("notmuch")) || "notmuch";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const r = await run(bin, ["search", "--limit", String(n), "--format=json", "--output=summary", q], {
    timeoutMs,
    maxOut: 80_000,
  });
  if (r.code !== 0) throw new Error(`notmuch search failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, output: r.stdout };
  }
  return { ok: true, count: Array.isArray(items) ? items.length : 0, results: items };
```

</details>

**依据 3 · 源码核查**：[index.js:34-65](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/index.js#L34-L65)

未读工具呈现

<details>
<summary>查看原文（32行）</summary>

```text
  ctx.tools.register({
    name: "mail_unread",
    description: "Unread mail count (notmuch tag:unread preferred; else recent himalaya INBOX). Read-only.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: { limit: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `backend=${v.backend} count=${v.count}${v.note ? `\n${v.note}` : ""}\n${JSON.stringify(v.samples || v.envelopes || [], null, 2)}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await mailUnread({ limit: args?.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mail unread" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mail unread", content: r.content }),
  });
```

</details>

#### 缺口

- 目标 notmuch 索引更新时间/多账户同步未知
  **影响**：Himalaya 后备计数若当未读会误判积压
  **进一步探讨**：目标收件箱与 notmuch 最新状态对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输出截断和 fallback 会影响读者看到的邮件吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

Himalaya 先请求 JSON，失败则重试普通文本；若 JSON 解析失败却命令退出0，也把截断的原始 stdout 作为 ok:true 返回。run 在 stdout 超过 maxOut 两倍才 kill，然后最多保留 maxOut；JSON 可能因此不完整，转为原文，无法明确区分格式异常与真实信封。stderr 运行时不断累计仅最终截4k。mail_list 的模型渲染只显示 id/date/subject，省略 from，原始结果是否附模型需看宿主。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mail.js:14-41](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L14-L41)

输出/超时实现

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { timeoutMs = 30_000, maxOut = 60_000 } = {}) {
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

**依据 2 · 源码核查**：[lib/mail.js:81-108](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L81-L108)

JSON/文本回退

<details>
<summary>查看原文（28行）</summary>

```text
export async function himalayaList({ folder = "INBOX", limit = 20, timeoutMs } = {}) {
  const bin = (await which("himalaya")) || "himalaya";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const folderSafe = String(folder || "INBOX").replace(/[^A-Za-z0-9._/+-]/g, "");
  // himalaya envelope list
  const r = await run(bin, ["envelope", "list", "-f", folderSafe, "-s", String(n), "-o", "json"], {
    timeoutMs,
    maxOut: 80_000,
  });
  if (r.code !== 0) {
    // fallback without json
    const r2 = await run(bin, ["envelope", "list", "-f", folderSafe, "-s", String(n)], { timeoutMs });
    if (r2.code !== 0) throw new Error(`himalaya list failed: ${r2.stderr || r2.code}`);
    return { ok: true, folder: folderSafe, output: r2.stdout, truncated: r2.truncated };
  }
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, folder: folderSafe, output: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((e) => ({
    id: e.id,
    subject: e.subject,
    from: e.from,
    date: e.date,
  }));
  return { ok: true, folder: folderSafe, count: list.length, envelopes: list };
```

</details>

**依据 3 · 源码核查**：[index.js:78-102](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/index.js#L78-L102)

mail_list 渲染

<details>
<summary>查看原文（25行）</summary>

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.envelopes || []).map((e) => `${e.id}\t${e.date}\t${e.subject}`).join("\n") ||
                v.output ||
                "(none)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await himalayaList({ folder: args?.folder, limit: args?.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mail list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mail list", content: r.content }),
```

</details>

#### 缺口

- 目标大量邮件/超长主题与宿主原始结构可见性未知
  **影响**：截断/缺发件人会损失分诊线索
  **进一步探讨**：目标大列表和 JSON 错误对照 CLI

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 搜索结果和邮件内容的隐私边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具把主题、日期、信封和 notmuch 搜索摘要渲染给 Agent；即使只读，敏感通信元数据与片段仍可进入模型上下文。CLI 读取的是本机 Himalaya 配置/notmuch 索引；插件并不从聊天获取 IMAP 密码。query 作为单个 spawn 参数，不经 shell 拼接，降低命令注入风险；但 Agent 对哪个邮箱/文件有访问由当前进程凭据和 CLI 设置决定，不是插件逐账户授权。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-34](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/README.md#L30-L34)

作者提醒自行配置/勿贴密码

```text
## 配置要点

`timeoutMs`

不发送、不删除。自行配置 himalaya/notmuch；勿贴 IMAP 密码。
```

**依据 2 · 源码核查**：[lib/mail.js:14-17](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L14-L17)

spawn 数组

```text
export function run(bin, args, { timeoutMs = 30_000, maxOut = 60_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
```

**依据 3 · 源码核查**：[lib/mail.js:81-127](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L81-L127)

信封/搜索输出

<details>
<summary>查看原文（47行）</summary>

```text
export async function himalayaList({ folder = "INBOX", limit = 20, timeoutMs } = {}) {
  const bin = (await which("himalaya")) || "himalaya";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const folderSafe = String(folder || "INBOX").replace(/[^A-Za-z0-9._/+-]/g, "");
  // himalaya envelope list
  const r = await run(bin, ["envelope", "list", "-f", folderSafe, "-s", String(n), "-o", "json"], {
    timeoutMs,
    maxOut: 80_000,
  });
  if (r.code !== 0) {
    // fallback without json
    const r2 = await run(bin, ["envelope", "list", "-f", folderSafe, "-s", String(n)], { timeoutMs });
    if (r2.code !== 0) throw new Error(`himalaya list failed: ${r2.stderr || r2.code}`);
    return { ok: true, folder: folderSafe, output: r2.stdout, truncated: r2.truncated };
  }
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, folder: folderSafe, output: r.stdout };
  }
  const list = (Array.isArray(items) ? items : []).slice(0, n).map((e) => ({
    id: e.id,
    subject: e.subject,
    from: e.from,
    date: e.date,
  }));
  return { ok: true, folder: folderSafe, count: list.length, envelopes: list };
}

export async function notmuchSearch({ query, limit = 20, timeoutMs } = {}) {
  const q = String(query || "").trim();
  if (!q || q.length > 500) throw new Error("invalid notmuch query");
  const bin = (await which("notmuch")) || "notmuch";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const r = await run(bin, ["search", "--limit", String(n), "--format=json", "--output=summary", q], {
    timeoutMs,
    maxOut: 80_000,
  });
  if (r.code !== 0) throw new Error(`notmuch search failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, output: r.stdout };
  }
  return { ok: true, count: Array.isArray(items) ? items.length : 0, results: items };
```

</details>

**依据 4 · 源码核查**：[index.js:67-129](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/index.js#L67-L129)

模型渲染

<details>
<summary>查看原文（63行）</summary>

```text
  ctx.tools.register({
    name: "mail_list",
    description: "himalaya envelope list (folder, capped).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        folder: { type: "string" },
        limit: { type: "number" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.envelopes || []).map((e) => `${e.id}\t${e.date}\t${e.subject}`).join("\n") ||
                v.output ||
                "(none)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await himalayaList({ folder: args?.folder, limit: args?.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "mail list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "mail list", content: r.content }),
  });

  ctx.tools.register({
    name: "mail_notmuch",
    description: "notmuch search --format=json (capped).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["query"],
      properties: { query: { type: "string" }, limit: { type: "number" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : JSON.stringify(v.results || v.output, null, 2) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await notmuchSearch({ query: args.query, limit: args.limit, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "notmuch" }),
    presentResult: (_a, r) => ({ card: "generic", title: "notmuch", content: r.content }),
  });
```

</details>

#### 缺口

- 目标 DSH 模型隐私/账户边界未知
  **影响**：只读也可能暴露敏感邮件元数据
  **进一步探讨**：目标权限与数据发送范围审计

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样先试用并避免未读误判？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先在隔离本机配置 Himalaya/notmuch，确认 mail_status，再用已知收件箱和 notmuch tag:unread 对照；若 only Himalaya，界面必须视 count 为近期信封样本数而非未读总量。对长搜索结果核截断，避免把空结果当无邮件；性能取决于外部 CLI/索引与邮箱规模，未测。未实现改进可区分 countKind=unread/recent、暴露 index 时间、限制 stderr 与提供正文/发件人经授权显示。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-34](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/README.md#L12-L34)

安装与配置说明

<details>
<summary>查看原文（23行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-mail
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-mail
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `mail_status` | CLI 是否可用 |
| `mail_list` | himalaya 信封列表 |
| `mail_notmuch` | notmuch 搜索 |

## 配置要点

`timeoutMs`

不发送、不删除。自行配置 himalaya/notmuch；勿贴 IMAP 密码。
````

</details>

**依据 2 · 源码核查**：[lib/mail.js:52-79](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L52-L79)

未读语义

<details>
<summary>查看原文（28行）</summary>

```text
/** High-freq unread count via notmuch (preferred) or himalaya INBOX sample. */
export async function mailUnread({ limit = 20, timeoutMs } = {}) {
  const notmuch = await which("notmuch");
  if (notmuch) {
    const countR = await run(notmuch, ["count", "tag:unread"], { timeoutMs: timeoutMs || 15_000, maxOut: 200 });
    if (countR.code !== 0) throw new Error(`notmuch count failed: ${countR.stderr || countR.code}`);
    const count = Number((countR.stdout || "").trim()) || 0;
    let samples = [];
    try {
      const search = await notmuchSearch({ query: "tag:unread", limit, timeoutMs });
      samples = search.results || [];
    } catch {
      samples = [];
    }
    return { ok: true, backend: "notmuch", count, samples: samples.slice(0, Math.min(10, Number(limit) || 20)) };
  }
  const himalaya = await which("himalaya");
  if (!himalaya) throw new Error("neither notmuch nor himalaya on PATH");
  const list = await himalayaList({ folder: "INBOX", limit, timeoutMs });
  return {
    ok: true,
    backend: "himalaya",
    count: list.count ?? (list.envelopes || []).length,
    note: "himalaya has no unread filter here — showing recent INBOX envelopes",
    envelopes: list.envelopes || null,
    output: list.output || null,
  };
}
```

</details>

**依据 3 · 源码核查**：[lib/mail.js:14-41](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L14-L41)

输出边界

<details>
<summary>查看原文（28行）</summary>

```text
export function run(bin, args, { timeoutMs = 30_000, maxOut = 60_000 } = {}) {
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

**依据 4 · 源码核查**：[lib/mail.js:111-127](https://github.com/173787247/dsh-wsl-mail/blob/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc/lib/mail.js#L111-L127)

notmuch 搜索

<details>
<summary>查看原文（17行）</summary>

```text
export async function notmuchSearch({ query, limit = 20, timeoutMs } = {}) {
  const q = String(query || "").trim();
  if (!q || q.length > 500) throw new Error("invalid notmuch query");
  const bin = (await which("notmuch")) || "notmuch";
  const n = Math.min(50, Math.max(1, Number(limit) || 20));
  const r = await run(bin, ["search", "--limit", String(n), "--format=json", "--output=summary", q], {
    timeoutMs,
    maxOut: 80_000,
  });
  if (r.code !== 0) throw new Error(`notmuch search failed: ${r.stderr || r.code}`);
  let items;
  try {
    items = JSON.parse(r.stdout || "[]");
  } catch {
    return { ok: true, output: r.stdout };
  }
  return { ok: true, count: Array.isArray(items) ? items.length : 0, results: items };
```

</details>

#### 缺口

- 目标邮箱量/索引延迟与用户操作成本未知
  **影响**：不能据样本计数自动处理邮件
  **进一步探讨**：目标多账户、新到邮件、无 notmuch 场景验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
