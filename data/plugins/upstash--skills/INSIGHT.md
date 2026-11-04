# Upstash Agent Skills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[adffa88](https://github.com/upstash/skills/tree/adffa8896cd8e75649366a34183ecab6156e33c0)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/upstash/skills)
<!-- END META -->

> **功能**：为 DSH 加载 Upstash 产品技能并接入外部 MCP 服务。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把产品文档和条件式 MCP 连接汇入宿主。

> **主要限制**：[Q03](#research-q03) 固定仓库提交仍执行 MCP latest，服务权限和运行版本未固定。

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
  - [Q01 · 用户得到的是哪些能力？](#detail-section-11)
  - [Q02 · DSH 如何连接技能、凭据与 MCP？](#detail-section-12)
  - [Q03 · 固定仓库提交能否固定 MCP 行为及权限？](#detail-section-13)
  - [Q04 · 凭据、临时数据及退出需要考虑什么？](#detail-section-14)
  - [Q05 · 固定外部版本和展示连接状态是否能改善可控性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向开发或管理 Upstash 服务的 DSH 用户。

对照手动阅读 Upstash SDK 文档、配置 MCP 与管理凭据；本仓库增加产品技能索引和 DSH 接线，外部服务能力另行验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill | 读取产品文档和操作指导 | 并非服务执行实现 |
| MCP | 使用外部服务工具 | 需要凭据、网络及外部包，版本动态 |
| 登录命令 | 保存两个凭据引用 | 逐项写入，可能部分成功 |
| 临时 Redis 指导 | 原型临时存储 | 作者提示不用于敏感或生产数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skills、credentials、commands | 加载必需 | 技能、凭据和命令 | 不能假定插件加载成功 |
| email 与 API key | MCP 条件 | 授权服务 | 缺一项不挂载 MCP |
| npx、网络和外部服务 | MCP 条件 | 下载并运行 latest | 启动或连接可能失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主和隔离账号 | 采用适当权限与预算 |
| 连接 | 用户配置凭据并观察服务 | 通过实际调用核查权限 |
| 使用 | 代理读取技能或调用 MCP | 用户核验生成代码与变更 |
| 退出 | 用户撤销凭据并检查资源 | 确认数据和费用处置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络和账号费用未知 | 安装、凭据和权限设置 | 兼容性未测 |
| 持续使用 | 外部服务与模型费用未知 | 复核工具与结果 | 实际收益未测 |
| 失败恢复 | 重试成本未知 | 检查凭据及连接 | 逐项设置可能部分成功 |
| 退出 | 清理费用未知 | 撤销密钥、检查资源 | 自动删除未证实 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 指导 | 产品技能与索引 | 代码质量和正确率 |
| 接线 | 条件挂载 MCP | 实际工具权限与可用性 |
| 凭据 | 注册命令与更新监听 | 实际存储和退出清理 |

> **思考**：[Q03](#research-q03) 固定仓库提交仍执行 MCP latest，服务权限和运行版本未固定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把产品文档和条件式 MCP 连接汇入宿主。

[Q02](#research-q02) 串行刷新并依次写入凭据；[Q03](#research-q03) MCP 版本仍动态解析。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 固定仓库提交仍执行 MCP latest，服务权限和运行版本未固定。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离账号中检查权限、数据与费用，退出时分别处理凭据和资源。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持技能和条件挂载接线；外部 MCP、服务权限、凭据持久性及真实任务均未运行验证。

- 已检查：作者 README、包清单、源码路径 .dsh-plugin/cordis.patch.yml、.dsh-plugin/index.mjs、skills/upstash/SKILL.md、skills/upstash-cli/SKILL.md、README.md、skills/upstash-redis-start/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH 入口、bundle、生成脚本及综合、CLI、临时 Redis 代表性技能；未全面审计所有 173 个文件或外部 MCP。
- 下一步：只读固定源码；未构建、安装、调用远程服务、执行技能或测试宿主。

**分析版本**

- **仓库**：[upstash/skills](https://github.com/upstash/skills)
- **版本号**：未声明（[固定提交 adffa88](https://github.com/upstash/skills/tree/adffa8896cd8e75649366a34183ecab6156e33c0)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设固定版本、连接状态和凭据预检查可改善可控性；尚未验证。

只读固定源码；未构建、安装、调用远程服务、执行技能或测试宿主。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 439 | 310 | 77 | — |
| .md | source | 167 | 26280 | — | — | 111806 |
| .ts | source | 2 | 776 | 606 | 72 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/upstash/skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/upstash/skills/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/upstash/skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对技能提供、凭据与 MCP 接线及其边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户得到的是哪些能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该仓库面向使用 Upstash SDK 或管理服务的编码代理：提供多个产品 Skill 和生成的综合索引，并在 DSH bundle 中安装独立 Skill provider 与 MCP 接线。Skill 是模型读取的操作指导，不是 SDK 或服务的执行实现；账号操作由外部 MCP 服务提供，其能力和权限不能由说明直接证明。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/cordis.patch.yml:1-9](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/cordis.patch.yml#L1-L9)

bundle 插入插件入口。

```text
# DeepSeek Harness bundle layer. Applied when a profile lists this package in
# its `dsh.profile.bundles`; see `dsh.bundle` in the repository package.json.
#
# One row: the plugin mounts the skill provider and the Upstash MCP server
# itself, because the MCP credentials come from the managed credential
# document rather than from the environment.
- insert:
    - id: upstash
      name: "upstash-skills/.dsh-plugin/index.mjs"
```

**依据 2 · 源码核查**：[.dsh-plugin/index.mjs:25-39](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L25-L39)

独立文件系统 Skill provider。

<details>
<summary>查看原文（15行）</summary>

```text
/** The skill root shipped with this package. */
const SKILLS_DIR = fileURLToPath(new URL("../skills", import.meta.url));

export const name = "upstash";
export const inject = ["skills", "credentials", "commands"];

export function apply(ctx) {
  // 1. Skills. `includeDefaultRoots: false` keeps this provider to its own
  // root, so it adds the Upstash skills without shadowing or duplicating the
  // project and user roots the shipped filesystem provider already scans.
  ctx.plugin(SkillFilesystem, {
    providerName: "upstash",
    includeDefaultRoots: false,
    customSkillDirs: [SKILLS_DIR],
  });
```

</details>

**依据 3 · 源码核查**：[skills/upstash/SKILL.md:10-18](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/skills/upstash/SKILL.md#L10-L18)

综合技能按用途指向产品文档和 MCP。

```text
# Upstash Skills

This skill combines documentation for all Upstash SDKs. Pick the relevant sub-skill below.

If Upstash MCP tools are available in this session, prefer them for account and data operations —
creating and inspecting databases, indexes and Blob buckets, running Redis commands, reading stats,
logs and the DLQ, and remote work in a Box (shell, browser, git, preview URLs, PRs, screenshots
uploaded to Blob; see `upstash-box-remote-work`). The sub-skills below are for writing application code; reach for
`upstash-cli` only when there is no MCP or the work is inherently shell work.
```

#### 缺口

- 未运行代理、SDK 或服务，不能证明生成的应用正确
  **影响**：不能确认运行效果
  **进一步探讨**：在隔离项目核查技能发现、实际工具及调用结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 如何连接技能、凭据与 MCP？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件注入 skills、credentials、commands；以仓库 skills 为独立根挂载文件系统 provider。初始化及相关凭据更新触发串行 remount：先 dispose 旧实例，再解析 email 与 API key，缺任一值不启动；齐全时通过 stdio 使用 npx -y @upstash/mcp-server@latest 并显式传入凭据。命令 /upstash-login 设置 recordInput false，再依次检查可写性和保存两个引用；第二项不可写或设置失败时第一项可能已改变，并触发刷新，非原子写。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/index.mjs:28-39](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L28-L39)

注入和技能注册。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = "upstash";
export const inject = ["skills", "credentials", "commands"];

export function apply(ctx) {
  // 1. Skills. `includeDefaultRoots: false` keeps this provider to its own
  // root, so it adds the Upstash skills without shadowing or duplicating the
  // project and user roots the shipped filesystem provider already scans.
  ctx.plugin(SkillFilesystem, {
    providerName: "upstash",
    includeDefaultRoots: false,
    customSkillDirs: [SKILLS_DIR],
  });
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/index.mjs:41-89](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L41-L89)

凭据解析、串行重挂与 latest 子进程。

<details>
<summary>查看原文（49行）</summary>

```text
  // 2. MCP server. Mounted once both credentials resolve, and remounted
  // whenever either changes — `credentials/updated` fires on `set`, `unset`,
  // and external edits of the document alike.
  let fiber;
  let queue = Promise.resolve();

  const remount = async () => {
    await fiber?.dispose();
    fiber = undefined;

    const [email, apiKey] = await Promise.all([
      ctx.credentials.resolve(EMAIL),
      ctx.credentials.resolve(API_KEY),
    ]);
    if (!email || !apiKey) {
      ctx.logger.info(
        `upstash: ${EMAIL} and ${API_KEY} are not both configured — MCP server not started. Run /upstash-login to store them.`,
      );
      return;
    }

    fiber = ctx.plugin(McpClient, {
      serverName: "upstash",
      transport: "stdio",
      // Fetched by `npx` rather than declared as a dependency of this package,
      // so installing the bundle stays dependency-free. The first start of a
      // fresh version needs network access; npx serves it from cache after that.
      command: "npx",
      args: ["-y", "@upstash/mcp-server@latest"],
      // The subprocess scrub strips credential-shaped names (/KEY|PASSWORD|
      // SECRET|TOKEN/i) from the inherited environment, so the API key has to
      // be handed to the child explicitly.
      env: { [EMAIL]: email.value, [API_KEY]: apiKey.value },
    });
  };

  // Serialized: `/upstash-login` stores two references and so emits two
  // events, and overlapping remounts would orphan a spawned server.
  const refresh = () => {
    queue = queue.then(remount).catch((error) => {
      ctx.logger.error(`upstash: failed to start the MCP server: ${String(error)}`);
    });
  };

  ctx.on("credentials/updated", (ref) => {
    if (ref === EMAIL || ref === API_KEY) refresh();
  });

  refresh();
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/index.mjs:91-124](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L91-L124)

命令输入、检查和逐项保存。

<details>
<summary>查看原文（34行）</summary>

```text
  // 3. Credential entry. A bundle distributed outside the harness repository
  // cannot contribute a Settings card (namespace exposure is a Host allowlist),
  // so a command is the way in. `recordInput: false` keeps the key out of the
  // session log, and command results never enter model history.
  ctx.commands.register({
    name: "upstash-login",
    description: "Store Upstash credentials for the Upstash MCP server",
    input: { hint: "<email> <api-key>" },
    recordInput: false,
    handler: async ({ rawInput }) => {
      const [email, apiKey, ...rest] = rawInput.trim().split(/\s+/);
      if (!email || !apiKey || rest.length > 0) {
        return { kind: "error", text: "Usage: /upstash-login <email> <api-key>" };
      }

      for (const [ref, value] of [
        [EMAIL, email],
        [API_KEY, apiKey],
      ]) {
        // A value inherited from the launching environment always outranks the
        // managed document, so storing one would silently have no effect.
        const info = await ctx.credentials.describe(ref);
        if (!info.writable) {
          return {
            kind: "error",
            text: `${ref} is supplied by the environment dsh was launched with (source: ${info.source}). Unset it there and retry.`,
          };
        }
        await ctx.credentials.set(ref, value);
      }

      return { kind: "success", text: "Upstash credentials stored. The MCP server is connecting." };
    },
  });
```

</details>

#### 缺口

- 宿主事件、日志及凭据服务实际语义未运行
  **影响**：不能确认运行效果
  **进一步探讨**：测试单项失败、并发更新、卸载和重连。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定仓库提交能否固定 MCP 行为及权限？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。DSH 入口显式执行 @upstash/mcp-server@latest，固定研究提交无法固定未来实际下载版本；它是外部 npm 包和网络服务，源码未在本组件验证。技能要求优先调用 MCP 的管理与数据操作，其中包括创建、删除和远程工作，实际可见工具、授权及变更能力由服务与凭据决定；recordInput false 仅是命令注册选项，不能单凭它保证所有日志或传输不泄露。DSH 这里是本地 stdio 与 email/API key，不应套用其他客户端的远程 OAuth 安装描述。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/index.mjs:47-74](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L47-L74)

明确采用 latest、stdio、凭据环境。

<details>
<summary>查看原文（28行）</summary>

```text
  const remount = async () => {
    await fiber?.dispose();
    fiber = undefined;

    const [email, apiKey] = await Promise.all([
      ctx.credentials.resolve(EMAIL),
      ctx.credentials.resolve(API_KEY),
    ]);
    if (!email || !apiKey) {
      ctx.logger.info(
        `upstash: ${EMAIL} and ${API_KEY} are not both configured — MCP server not started. Run /upstash-login to store them.`,
      );
      return;
    }

    fiber = ctx.plugin(McpClient, {
      serverName: "upstash",
      transport: "stdio",
      // Fetched by `npx` rather than declared as a dependency of this package,
      // so installing the bundle stays dependency-free. The first start of a
      // fresh version needs network access; npx serves it from cache after that.
      command: "npx",
      args: ["-y", "@upstash/mcp-server@latest"],
      // The subprocess scrub strips credential-shaped names (/KEY|PASSWORD|
      // SECRET|TOKEN/i) from the inherited environment, so the API key has to
      // be handed to the child explicitly.
      env: { [EMAIL]: email.value, [API_KEY]: apiKey.value },
    });
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/index.mjs:91-103](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L91-L103)

不记录命令输入的声明和设置。

<details>
<summary>查看原文（13行）</summary>

```text
  // 3. Credential entry. A bundle distributed outside the harness repository
  // cannot contribute a Settings card (namespace exposure is a Host allowlist),
  // so a command is the way in. `recordInput: false` keeps the key out of the
  // session log, and command results never enter model history.
  ctx.commands.register({
    name: "upstash-login",
    description: "Store Upstash credentials for the Upstash MCP server",
    input: { hint: "<email> <api-key>" },
    recordInput: false,
    handler: async ({ rawInput }) => {
      const [email, apiKey, ...rest] = rawInput.trim().split(/\s+/);
      if (!email || !apiKey || rest.length > 0) {
        return { kind: "error", text: "Usage: /upstash-login <email> <api-key>" };
```

</details>

**依据 3 · 源码核查**：[skills/upstash/SKILL.md:10-18](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/skills/upstash/SKILL.md#L10-L18)

综合技能描述账号与数据操作。

```text
# Upstash Skills

This skill combines documentation for all Upstash SDKs. Pick the relevant sub-skill below.

If Upstash MCP tools are available in this session, prefer them for account and data operations —
creating and inspecting databases, indexes and Blob buckets, running Redis commands, reading stats,
logs and the DLQ, and remote work in a Box (shell, browser, git, preview URLs, PRs, screenshots
uploaded to Blob; see `upstash-box-remote-work`). The sub-skills below are for writing application code; reach for
`upstash-cli` only when there is no MCP or the work is inherently shell work.
```

**依据 4 · 源码核查**：[skills/upstash-cli/SKILL.md:54-61](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/skills/upstash-cli/SKILL.md#L54-L61)

技能建议尽可能使用只读 API key。

````text
Alternatives — env vars (also auto-loaded from a `.env` in cwd), or `--email` / `--api-key` inline, or `--env-path <path>` to point at a specific `.env`:

```bash
export UPSTASH_EMAIL=you@example.com
export UPSTASH_API_KEY=your_api_key
```

Precedence: flags > env vars > `.env` > saved config. Prefer a **read-only** API key for agents when possible — mutations fail at the API, the same way they would in the console.
````

#### 缺口

- 未锁定外部版本或检验权限
  **影响**：无法证明运行行为及安全性
  **进一步探讨**：固定 MCP 版本并用只读密钥在隔离账号验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、临时数据及退出需要考虑什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

安装需要兼容 DSH 与网络下载外部 MCP，作者文档要求 pnpm；命令接收账号 email 与密钥，凭据解析后以子进程环境传递。技能还建议临时 Redis 使用 POST 创建、以 UUID 重新取回凭据，并明确不可用于 PII、秘密或生产数据，作者称默认三天过期；该说明属于远端服务声明而非本次验证。停用 bundle 与撤销 API key、处理已创建资源和本地凭据是不同动作，费用、卸载后残留与服务数据生命周期未测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:134-151](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/README.md#L134-L151)

DSH 安装与凭据使用说明。

<details>
<summary>查看原文（18行）</summary>

````text

### Agent Skills CLI

```bash
npx skills add upstash/skills
```

### DeepSeek Harness

Installs the skills **and** the [Upstash MCP server](#mcp-server) in one step. Requires
`pnpm` on your `PATH`.

```bash
# Install into a profile (`web` is the one `dsh web` boots)
dsh plugin --profile web add github:upstash/skills

# Start the harness
dsh web
````

</details>

**依据 2 · 源码核查**：[.dsh-plugin/index.mjs:62-74](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L62-L74)

显式把凭据交给 MCP 子进程。

<details>
<summary>查看原文（13行）</summary>

```text
    fiber = ctx.plugin(McpClient, {
      serverName: "upstash",
      transport: "stdio",
      // Fetched by `npx` rather than declared as a dependency of this package,
      // so installing the bundle stays dependency-free. The first start of a
      // fresh version needs network access; npx serves it from cache after that.
      command: "npx",
      args: ["-y", "@upstash/mcp-server@latest"],
      // The subprocess scrub strips credential-shaped names (/KEY|PASSWORD|
      // SECRET|TOKEN/i) from the inherited environment, so the API key has to
      // be handed to the child explicitly.
      env: { [EMAIL]: email.value, [API_KEY]: apiKey.value },
    });
```

</details>

**依据 3 · 源码核查**：[skills/upstash-redis-start/SKILL.md:10-30](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/skills/upstash-redis-start/SKILL.md#L10-L30)

临时 Redis 边界和重取方式。

<details>
<summary>查看原文（21行）</summary>

````text
# Upstash Redis for Agents (`start-redis`)

A zero-config Redis database for AI agents — **no signup, no UI, no SDK setup**. One HTTP request returns a working endpoint + token. Databases live for **3 days** unless the user claims them.

Use this when:
- The agent needs Redis right now and the user has not given you credentials.
- You want short-term memory across tool calls, conversation history, a sub-agent work queue, or recent-first ranked recall.

This is built for quick experiments, prototypes, and demos rather than production workloads or anything tied to a real user account — the database is temporary and unauthenticated until claimed, so keep PII, secrets, and production credentials out of it.

## Create or re-fetch a database

```bash
# Generate a fresh UUIDv4 yourself, then POST it as the Idempotency-Key.
# The UUIDv4 you send becomes the database id.
curl -X POST -H "Idempotency-Key: <uuidv4>" https://upstash.com/start-redis
```

- Sending your own UUIDv4 makes the first call **retry-safe** — if the response is lost, retrying with the same UUID returns the same database instead of minting a duplicate.
- Re-POST with the same `Idempotency-Key` to **re-fetch credentials** for an existing database.
- The header is optional. Omit it to mint a new database with a server-generated id (returned in the response — re-fetch later by passing that id back as `Idempotency-Key`). Only UUIDv4 is accepted.
````

</details>

**依据 4 · 源码核查**：[skills/upstash-redis-start/SKILL.md:68-73](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/skills/upstash-redis-start/SKILL.md#L68-L73)

要求告知用户过期与敏感数据限制。

```text
## Tell the user

After provisioning, surface the **console URL** from the response to the user. Make clear that:
- The database expires in 3 days.
- They can view usage at the console URL and click **Claim** to keep it.
- This is unauthenticated scratch storage — don't put secrets or PII in it.
```

#### 缺口

- 未核对真实计费、主机凭据存储或资源删除
  **影响**：不能保证无残留
  **进一步探讨**：在隔离账号核对费用、撤销和资源清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 固定外部版本和展示连接状态是否能改善可控性？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：允许用户固定 MCP 版本并在 DSH 显示实际版本、权限范围和连接失败，同时在凭据写入前检查两个引用，可能减少版本漂移与半更新误解。可用缺凭据、第二项不可写、服务启动失败与新版本变化对照试验；如果界面显示已连接却无法调用，或固定版本导致不可恢复的不兼容，此假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/index.mjs:47-82](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L47-L82)

目前 latest 与失败日志。

<details>
<summary>查看原文（36行）</summary>

```text
  const remount = async () => {
    await fiber?.dispose();
    fiber = undefined;

    const [email, apiKey] = await Promise.all([
      ctx.credentials.resolve(EMAIL),
      ctx.credentials.resolve(API_KEY),
    ]);
    if (!email || !apiKey) {
      ctx.logger.info(
        `upstash: ${EMAIL} and ${API_KEY} are not both configured — MCP server not started. Run /upstash-login to store them.`,
      );
      return;
    }

    fiber = ctx.plugin(McpClient, {
      serverName: "upstash",
      transport: "stdio",
      // Fetched by `npx` rather than declared as a dependency of this package,
      // so installing the bundle stays dependency-free. The first start of a
      // fresh version needs network access; npx serves it from cache after that.
      command: "npx",
      args: ["-y", "@upstash/mcp-server@latest"],
      // The subprocess scrub strips credential-shaped names (/KEY|PASSWORD|
      // SECRET|TOKEN/i) from the inherited environment, so the API key has to
      // be handed to the child explicitly.
      env: { [EMAIL]: email.value, [API_KEY]: apiKey.value },
    });
  };

  // Serialized: `/upstash-login` stores two references and so emits two
  // events, and overlapping remounts would orphan a spawned server.
  const refresh = () => {
    queue = queue.then(remount).catch((error) => {
      ctx.logger.error(`upstash: failed to start the MCP server: ${String(error)}`);
    });
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/index.mjs:100-122](https://github.com/upstash/skills/blob/adffa8896cd8e75649366a34183ecab6156e33c0/.dsh-plugin/index.mjs#L100-L122)

当前凭据逐项检查和写入。

<details>
<summary>查看原文（23行）</summary>

```text
    handler: async ({ rawInput }) => {
      const [email, apiKey, ...rest] = rawInput.trim().split(/\s+/);
      if (!email || !apiKey || rest.length > 0) {
        return { kind: "error", text: "Usage: /upstash-login <email> <api-key>" };
      }

      for (const [ref, value] of [
        [EMAIL, email],
        [API_KEY, apiKey],
      ]) {
        // A value inherited from the launching environment always outranks the
        // managed document, so storing one would silently have no effect.
        const info = await ctx.credentials.describe(ref);
        if (!info.writable) {
          return {
            kind: "error",
            text: `${ref} is supplied by the environment dsh was launched with (source: ${info.source}). Unset it there and retry.`,
          };
        }
        await ctx.credentials.set(ref, value);
      }

      return { kind: "success", text: "Upstash credentials stored. The MCP server is connecting." };
```

</details>

#### 缺口

- 方案未实现、没有用户测试
  **影响**：不能证明减少故障
  **进一步探讨**：在隔离宿主实施并对照连接和凭据状态。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
