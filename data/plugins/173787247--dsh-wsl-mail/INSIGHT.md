# dsh-wsl-mail

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[6aec917](https://github.com/173787247/dsh-wsl-mail/tree/6aec917ff5878516bcf2fa5208c557311a850e37)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-mail)
<!-- END META -->

> **功能**：在 DSH 中查看邮件信封与未读概况，并通过 notmuch 搜索。

> **亮点**：[Q01](#research-q01) 把常用邮件初筛接到工作会话。

> **主要限制**：[Q02](#research-q02) 未读计数只在 notmuch 分支成立，Himalaya 返回近期收件箱样本。

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
  - [Q01 · 邮件插件适合做什么收件初筛？](#detail-section-11)
  - [Q02 · 未读概况为何不能直接横向比较？](#detail-section-12)
  - [Q03 · 怎样验收不同后端而不误读计数？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本地邮件工具的用户想先定位需要跟进的消息。

使用相同账户的原生邮件客户端或 CLI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 邮件概况与检索 | 从会话定位信封与原件 | 后端计数不同，范围依赖当前账号或索引 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| notmuch 索引或 Himalaya 账户 | 按任务必需 | 读取测试邮件 | 索引或账号未配置时失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置虚拟邮箱 | 无个人或生产数据 |
| 比对 | 用户查看未读和样本 | 核对口径与账号 |
| 退出 | 用户回原客户端 | 从原件确认状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 准备测试邮箱与索引 | 需分别核对后端 |
| 持续 | 读取开销未知 | 核对样本和新鲜度 | 结果可能含私人元数据 |
| 失败 | 排障未知 | 直接查原客户端 | 辨别失败与空数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 邮件初筛 | 可读信封与搜索摘要 | 查找准确率与节时 |

> **思考**：[Q02](#research-q02) 未读计数只在 notmuch 分支成立，Himalaya 返回近期收件箱样本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把常用邮件初筛接到工作会话。

[Q02](#research-q02) 按二进制存在性选择后端，notmuch 执行失败时没有转向 Himalaya。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 未读计数只在 notmuch 分支成立，Himalaya 返回近期收件箱样本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只用合成信封验证，明确 notmuch 未读计数和 Himalaya 样本的区别。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持入口和口径差异，真实账号与效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/mail.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查，未执行邮件请求、目标 CLI 或 DSH。
- 下一步：覆盖多账号、空样本、非 JSON 输出、字符过滤和未读口径。

**分析版本**

- **仓库**：[173787247/dsh-wsl-mail](https://github.com/173787247/dsh-wsl-mail)
- **版本号**：0.1.1（[固定提交 6aec917](https://github.com/173787247/dsh-wsl-mail/tree/6aec917ff5878516bcf2fa5208c557311a850e37)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 拆分两种计数并显式标记后端和失败，比较误读率。

覆盖多账号、空样本、非 JSON 输出、字符过滤和未读口径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 115 | — | — | 460 |
| .js | source | 2 | 263 | 246 | 3 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-mail/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-mail/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-mail/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否在 DSH 初筛测试邮箱，并区分未读数与收件箱样本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 邮件插件适合做什么收件初筛？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有本地邮件索引或 Himalaya 配置的用户可在 DSH 查询未读概况、邮件夹信封或按 notmuch 条件搜索。相对直接 CLI，插件把主题、发件人、日期与查询入口放进工作会话，减少界面切换。成功标准是找到正确账户和邮件原件，再通过邮件客户端核对上下文。当前注册的入口不发送邮件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/README.md#L5-L15)

作者定位。

<details>
<summary>查看原文（11行）</summary>

````text
邮件只读：himalaya list / notmuch search。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-mail
````

</details>

**依据 2 · 源码核查**：[lib/mail.js:81-108](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/lib/mail.js#L81-L108)

信封投影。

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

**依据 3 · 源码核查**：[lib/mail.js:111-127](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/lib/mail.js#L111-L127)

检索命令及结果。

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

- 未做同账户的任务对照
  **影响**：节时、漏读与筛选质量未知
  **进一步探讨**：对带不同邮件状态的测试邮箱复核

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 未读概况为何不能直接横向比较？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

找到 notmuch 就走 count tag:unread 和可选搜索，count 非零退出会失败，搜索失败则样本为空。只有没找到 notmuch 时才取 Himalaya 最近 INBOX 信封，计数是返回信封数而非未读数，结构化结果带说明。Himalaya 的 folder 通过删除不在字符表的字符而非拒绝，因此输入可能被改成另一个名字。它还在 JSON 请求失败或无法解析时返回原文本。notmuch 按 query 长度和数量约束，未额外隔离账户或输出范围。邮件元数据和搜索结果可进入模型会话，需要用测试帐号先确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mail.js:53-78](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/lib/mail.js#L53-L78)

后端分支与计数口径。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/mail.js:81-108](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/lib/mail.js#L81-L108)

文件夹处理与格式回退。

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

**依据 3 · 源码核查**：[lib/mail.js:111-127](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/lib/mail.js#L111-L127)

直接传 notmuch 查询。

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

**依据 4 · 源码核查**：[index.js:35-59](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/index.js#L35-L59)

未读工具注册和渲染。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行目标 CLI 或测试账户
  **影响**：不能保证文件夹映射、检索和错误提示符合预期
  **进一步探讨**：使用含 Unicode 文件夹和混合已读状态的虚拟邮箱

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验收不同后端而不误读计数？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

用独立配置和虚拟邮件确认实际账号、索引新鲜度及读取范围，将每个工具的结果同原客户端核对。若 Himalaya 样本被当作真实未读数，或私人邮件落到非预期上下文，就停用并回原客户端。可把 unreadCount 和 sampleCount 分开显示，在 notmuch 不可用或样本失败时给出独立状态。以同一测试邮箱的准确计数、过期索引及失败样本比较误读和复核时长，不能降低误读则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mail.js:44-78](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/lib/mail.js#L44-L78)

发现、计数和样本口径。

<details>
<summary>查看原文（35行）</summary>

```text
export async function mailStatus() {
  return {
    ok: true,
    himalaya: (await which("himalaya")) || null,
    notmuch: (await which("notmuch")) || null,
  };
}

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
```

</details>

**依据 2 · 源码核查**：[index.js:6-29](https://github.com/173787247/dsh-wsl-mail/blob/6aec917ff5878516bcf2fa5208c557311a850e37/index.js#L6-L29)

Host 开关与状态工具。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-mail] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 30_000);
  console.log("[dsh-wsl-mail] list/search only — no send");

  ctx.systemPrompt.section({
    name: "tool:mail",
    order: 139,
    text: "dsh-wsl-mail lists mail via himalaya envelopes or notmuch search. Prefer mail_unread for a quick unread check. It does not send or delete mail. Configure himalaya/notmuch yourself; never paste IMAP passwords into chat.",
  });

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
```

</details>

#### 缺口

- 未验证宿主、账号配置和诊断改法
  **影响**：无可靠接入或使用成本数据
  **进一步探讨**：以合成信封对照不同 CLI、账号和失败输出

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
