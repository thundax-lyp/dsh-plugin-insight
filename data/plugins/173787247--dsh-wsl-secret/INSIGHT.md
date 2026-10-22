# dsh-wsl-secret

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[be996ef](https://github.com/173787247/dsh-wsl-secret/tree/be996ef420b165aebb759cda3957e65a966efe22)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret)
<!-- END META -->

> **实现功能**：为 DSH 提供 pass/age 名单读取、预览和进程环境变量转交。

> **核心亮点**：把已有 pass/age 操作接入 DSH 工具并提供默认拒读和 to_env 流程；底层加密仍由外部工具承担。详见[Q02](#research-q02)。

> **风险与缺陷**：to_env 将明文放进整个进程环境，预览泄露首尾字符/长度；age 路径仅词法前缀判断、reveal 可给原始 value，不能当跨插件隔离。详见[Q03](#research-q03)。

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
  - [Q01 · 用户要完成什么密钥任务，哪些结果算合格？](#detail-section-11)
  - [Q02 · pass/age 读取、名单与环境变量怎样接线？](#detail-section-12)
  - [Q03 · “不暴露完整密钥”的边界和路径防护有什么缺口？](#detail-section-13)
  - [Q04 · 初始化、持续及恢复成本是什么？](#detail-section-14)
  - [Q05 · 如何试用并验证更窄的密钥传递机制？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL/Linux 用户用已有 pass/age 密钥驱动同一 DSH 进程的其他工具，需避免聊天暴露与跨插件扩散。

基线为直接 pass/age 或宿主密钥服务；本包降低 Agent 接线工作，但未提供加密和跨插件隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| secret_status | 查看配置 | 不代表密钥可读 |
| pass list/exists | 名称检查 | 名称仍可能敏感 |
| pass/age get | 预览/可选 reveal | 默认预览泄首尾和长度 |
| to_env | 后续工具读取 | 全进程可见、未见撤销 |

**流程与依赖**

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| pass/age 和密钥身份 | 实际解密 | 工具报错 |
| DSH tools/systemPrompt | 注册入口 | 插件不工作 |
| 非空 allowPrefixes | 白名单 | 全部读取拒绝 |
| 受信任同进程插件 | env 明文范围 | 不宜使用 to_env |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 准备 | 用假密钥设置单一前缀 | 空名单仍拒读 |
| 检查 | status、list、exists | 仅允许前缀可见 |
| 使用 | reveal=false、有限 to_env | 原始值不在工具结果 |
| 清理 | 轮换密钥并重启进程 | 环境残留消除 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 首次 | pass/age、身份和名单设置 | 配置分钟 |
| 持续 | 解密子进程及密钥轮换 | 延迟/人工时间 |
| 失败 | 排查缺工具、拒读、解密及环境残留 | 恢复工时 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 默认拒读 | 空 allowPrefixes 抛错 | 宿主整体授权边界 |
| 隐藏完整值 | 默认预览、to_env 只回预览 | 进程其他插件能否读取的管控 |
| age 目录 | 词法路径前缀 | 符号链接越界防护 |

> **思考**：to_env 将明文放进整个进程环境，预览泄露首尾字符/长度；age 路径仅词法前缀判断、reveal 可给原始 value，不能当跨插件隔离。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把已有 pass/age 操作接入 DSH 工具并提供默认拒读和 to_env 流程；底层加密仍由外部工具承担。详见[Q02](#research-q02)。

把已有 pass/age 操作接入 DSH 工具并提供默认拒读和 to_env 流程；底层加密仍由外部工具承担。详见[Q02](#research-q02)。

spawn 使用 argv 数组避免一般命令拼接；stdout 有字符上限，stderr 无显式上限。pass 入口防 .. 和非法字符；age 使用词法 resolve 未见 realpath。to_env 使用进程全局变量，代码未见清理。

<a id="detail-section-5"></a>

### 1.4 主要限制

to_env 将明文放进整个进程环境，预览泄露首尾字符/长度；age 路径仅词法前缀判断、reveal 可给原始 value，不能当跨插件隔离。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

受信任单租户进程先用假密钥验名单与输出，保持 reveal=false；高敏/多插件隔离需求优先正式范围化凭据服务。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认默认名单和预览，但全局环境及 reveal 结构化值、符号链接路径边界未做宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/secret.js、test/secret.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核 README、package、index.js、lib/secret.js、测试源码；未运行插件、测试或读真实密钥。
- 下一步：假密钥与 symlink 故障注入，核允许/拒绝、结构化结果与宿主日志；双插件检查 env 可见性、轮换和恢复工时。

**分析版本**

- **仓库**：[173787247/dsh-wsl-secret](https://github.com/173787247/dsh-wsl-secret)
- **版本号**：0.2.0（[固定提交 be996ef](https://github.com/173787247/dsh-wsl-secret/tree/be996ef420b165aebb759cda3957e65a966efe22)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

短时工具级句柄结合 realpath 路径复核可能缩小明文可见范围和符号链接越界；需假密钥双插件对照，尚未实现。详见[Q05](#research-q05)。

假密钥与 symlink 故障注入，核允许/拒绝、结构化结果与宿主日志；双插件检查 env 可见性、轮换和恢复工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 255 | — | — | 1189 |
| .js | source | 2 | 540 | 500 | 9 | — |
| .js | test | 1 | 49 | 48 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+created%3A2026-09-22T05%3A25%3A55.156Z..2026-10-22T05%3A25%3A55.156Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A25%3A55.156Z..2026-10-22T05%3A25%3A55.156Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 pass/age 插件的真实转交边界与适用信任范围。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户要完成什么密钥任务，哪些结果算合格？

**研究主题**：场景与需求

#### 完整回答

WSL/Linux DSH 用户希望从已有 pass/age 存储取应用密钥，供同一进程中后续工具调用使用，并避免把完整值放进聊天。README 给出 status、列名、存在性、to_env 的流程；空 allowPrefixes 默认拒绝读取。合格结果还应防跨前缀读取、控制进程内可见范围和生命周期。基线是 shell 手工用 pass/age 或宿主正式凭据服务；本插件缩短工具衔接，但不改变底层加解密能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-19](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/README.md#L5-L19)

作者定位、环境和默认拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
在 DSH（Cordis）里**安全读取** pass / age 密钥。

| | |
|---|---|
| npm | `dsh-wsl-secret` |
| 环境 | WSL/Linux，PATH 上有 `pass` 和/或 `age` |
| 默认 | **不配 `allowPrefixes` 就读不了**（故意的） |
| 对比 | `dsh-wsl-cred` = Git 凭据提示；本插件 = 应用 API Key |

## 为什么要单独插件

- **`dsh-wsl-cred`** → 只给 Git 推送/拉取的凭据*提示*
- **`dsh-wsl-secret`** → OpenRouter、Discord Bot Token 等应用密钥

`secret_status` 显示 `ready=false` = 已安装但**未配置**，属正常安全默认。
```

</details>

**依据 2 · 作者声明**：[README.md:56-74](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/README.md#L56-L74)

作者推荐流程。

<details>
<summary>查看原文（19行）</summary>

````text
### 4. 推荐工具链

| 步骤 | 工具 | 结果 |
|------|------|------|
| 检查 | `secret_status` | `ready=true` |
| 列举 | `secret_pass_list` | 只有名字 |
| 确认 | `secret_pass_exists` | `{ exists: true }` |
| **使用** | `secret_to_env` | 写入 `process.env`，聊天里只有 preview |
| 可选 | `secret_pass_get` | 预览（少用；勿开 reveal） |

```json
{ "name": "secret_to_env", "arguments": {
  "name": "dsh/openrouter",
  "envKey": "OPENROUTER_API_KEY"
}}
```

之后**同一 dsh 进程**内其它工具可读 `process.env.OPENROUTER_API_KEY`。

````

</details>

**依据 3 · 源码核查**：[index.js:14-37](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L14-L37)

空名单和提示注册。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-secret] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const allowPrefixes = Array.isArray(config.allowPrefixes) ? config.allowPrefixes.map(String) : [];
  const reveal = config.reveal === true;
  console.log(
    `[dsh-wsl-secret] allowPrefixes=${allowPrefixes.length} reveal=${reveal}` +
      (allowPrefixes.length ? "" : " (empty allowlist → all reads refused)"),
  );

  ctx.systemPrompt.section({
    name: "tool:secret",
    order: 133,
    text: [
      "dsh-wsl-secret reads pass/age secrets only under config.allowPrefixes.",
      "Preferred flow: secret_pass_exists → secret_to_env (puts value in process.env, returns preview only) → call other tools.",
      "Avoid secret_pass_get with reveal; never paste secrets into chat.",
      "If allowPrefixes is empty, every read fails — tell the user to configure the plugin.",
      "dsh-wsl-cred is for Git credential hints only; use this plugin for app API keys.",
    ].join(" "),
  });
```

</details>

**依据 4 · 源码核查**：[index.js:43-69](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L43-L69)

状态入口。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register({
    name: "secret_status",
    description:
      "Show whether pass/age exist, password-store path, and current allowPrefixes. Does not list or dump secrets.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      ...commonOut,
      render: (_a, v) => [{ type: "text", text: formatStatus(v) }],
    },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      const st = await secretStatus();
      return {
        ...st,
        allowPrefixes,
        reveal,
        ready: allowPrefixes.length > 0,
        howToConfigure:
          allowPrefixes.length > 0
            ? null
            : "Edit profile cordis.patch.yml → dsh-wsl-secret config.allowPrefixes (e.g. [\"dsh\"]). See plugin README.",
      };
    },
    presentCall: () => ({ card: "generic", title: "Secret status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Secret status", content: r.content }),
  });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · pass/age 读取、名单与环境变量怎样接线？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

插件注册 7 个工具；lib 对 pass 名做字符和前缀校验，age 文件先 resolve 后检查是否在配置目录，再用 spawn 参数数组调用 pass show 或 age -d。默认 reveal=false 返回首尾各两字符及长度或短值 ***；to_env 内部读取完整值写 process.env，返回预览。相对手工调用，增量是模型工具入口、名单默认拒绝和预览/环境变量转交，不是新的密钥库或加密实现。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:43-69](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L43-L69)

状态工具。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register({
    name: "secret_status",
    description:
      "Show whether pass/age exist, password-store path, and current allowPrefixes. Does not list or dump secrets.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      ...commonOut,
      render: (_a, v) => [{ type: "text", text: formatStatus(v) }],
    },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      const st = await secretStatus();
      return {
        ...st,
        allowPrefixes,
        reveal,
        ready: allowPrefixes.length > 0,
        howToConfigure:
          allowPrefixes.length > 0
            ? null
            : "Edit profile cordis.patch.yml → dsh-wsl-secret config.allowPrefixes (e.g. [\"dsh\"]). See plugin README.",
      };
    },
    presentCall: () => ({ card: "generic", title: "Secret status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "Secret status", content: r.content }),
  });
```

</details>

**依据 2 · 源码核查**：[index.js:71-202](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L71-L202)

pass 列表、检查、to_env、get 入口。

<details>
<summary>查看原文（132行）</summary>

```text
  ctx.tools.register({
    name: "secret_pass_list",
    description: "List pass entry names under allowPrefixes (names only, no values). Optional prefix filter.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", description: "Optional narrower prefix under allowlist" },
        max: { type: "number" },
      },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : [`secret_pass_list count=${v.count}`, ...(v.entries || []).map((e) => `- ${e}`)].join("\n"),
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await passList({ allowPrefixes, prefix: args?.prefix, max: args?.max || 100 });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pass list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pass list", content: r.content }),
  });

  ctx.tools.register({
    name: "secret_pass_exists",
    description: "Check whether a pass entry exists under allowPrefixes (boolean only).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: { name: { type: "string" } },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : `${v.entry}: ${v.exists ? "exists" : "missing"}` },
      ],
    },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await passExists(args.name, { allowPrefixes });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pass exists" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pass exists", content: r.content }),
  });

  ctx.tools.register({
    name: "secret_to_env",
    description:
      "PREFERRED: load a pass entry into process.env[envKey] for later tools. Returns preview only — not the full secret. Example: name=dsh/openrouter envKey=OPENROUTER_API_KEY.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name", "envKey"],
      properties: {
        name: { type: "string", description: "pass entry under allowPrefixes" },
        envKey: { type: "string", description: "Environment variable name, e.g. OPENROUTER_API_KEY" },
      },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : `ok envKey=${v.envKey} entry=${v.entry} preview=${v.preview}\n${v.note || ""}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await passToEnv(args.name, args.envKey, { allowPrefixes, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "secret → env" }),
    presentResult: (_a, r) => ({ card: "generic", title: "secret → env", content: r.content }),
  });

  ctx.tools.register({
    name: "secret_pass_get",
    description:
      "Read a pass entry. With reveal=false (default config) only preview is returned. Prefer secret_to_env instead.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: { name: { type: "string", description: "pass entry e.g. dsh/openrouter" } },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : `entry=${v.entry} preview=${v.preview}${v.value ? "\n(value present — reveal on)" : ""}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await passShow(args.name, { allowPrefixes, timeoutMs, reveal });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pass get" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pass get", content: r.content }),
```

</details>

**依据 3 · 源码核查**：[index.js:205-278](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L205-L278)

age 两个入口。

<details>
<summary>查看原文（74行）</summary>

```text
  ctx.tools.register({
    name: "secret_age_to_env",
    description: "Decrypt an age file under filesystem allowPrefixes into process.env[envKey]. Preview only in result.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path", "envKey"],
      properties: {
        path: { type: "string" },
        envKey: { type: "string" },
        identityFile: { type: "string" },
      },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : `ok envKey=${v.envKey} path=${v.path} preview=${v.preview}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await ageToEnv(args.path, args.envKey, {
          allowPrefixes,
          timeoutMs,
          identityFile: args.identityFile,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "age → env" }),
    presentResult: (_a, r) => ({ card: "generic", title: "age → env", content: r.content }),
  });

  ctx.tools.register({
    name: "secret_age_decrypt",
    description: "Decrypt an age file under allowPrefixes. Prefer secret_age_to_env. Preview unless reveal=true.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string" },
        identityFile: { type: "string", description: "Optional age identity (-i)" },
      },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : `path=${v.path} preview=${v.preview}` },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await ageDecrypt(args.path, {
          allowPrefixes,
          timeoutMs,
          reveal,
          identityFile: args.identityFile,
        });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "age decrypt" }),
    presentResult: (_a, r) => ({ card: "generic", title: "age decrypt", content: r.content }),
  });
```

</details>

**依据 4 · 源码核查**：[lib/secret.js:50-87](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L50-L87)

pass 和 age 名单校验。

<details>
<summary>查看原文（38行）</summary>

```text
/** pass entry name like Foo/bar — must match allowPrefixes (prefix/) or exact. */
export function assertPassName(name, allowPrefixes = []) {
  const n = String(name || "").trim().replace(/^\/+/, "");
  if (!n || n.includes("..") || n.includes("\0")) throw new Error("invalid pass name");
  if (!/^[A-Za-z0-9._/@+-]+$/.test(n)) throw new Error("pass name has illegal chars");
  if (!allowPrefixes.length) {
    throw new Error("allowPrefixes empty — set config.allowPrefixes in cordis.patch.yml first");
  }
  const ok = allowPrefixes.some((p) => {
    const pref = normalizePrefix(p);
    if (!pref) return false;
    // directory roots for age look like paths — skip those for pass names
    if (pref.startsWith("~") || pref.startsWith("/") || /^[A-Za-z]:/.test(pref)) return false;
    return n === pref || n.startsWith(pref + "/");
  });
  if (!ok) throw new Error(`pass entry not under allowPrefixes: ${n}`);
  return n;
}

export function assertAgePath(filePath, allowPrefixes = []) {
  const abs = resolve(String(filePath || "").trim());
  if (abs.includes("\0")) throw new Error("invalid age path");
  if (!allowPrefixes.length) throw new Error("allowPrefixes empty");
  const home = homedir();
  const candidates = allowPrefixes
    .map((p) => String(p).trim())
    .filter((p) => p.startsWith("~") || p.startsWith("/") || /^[A-Za-z]:/.test(p) || p.includes("/") || p.includes("\\"))
    .map((p) => resolve(p.startsWith("~") ? p.replace(/^~/, home) : p));
  if (!candidates.length) {
    throw new Error("no filesystem allowPrefixes for age (use absolute or ~/ paths)");
  }
  const ok = candidates.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return abs === r || abs.startsWith(r + "/") || abs.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`age file outside allowPrefixes: ${abs}`);
  if (!existsSync(abs)) throw new Error("age file missing");
  return abs;
```

</details>

**依据 5 · 源码核查**：[lib/secret.js:160-173](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L160-L173)

pass show 读取与预览。

<details>
<summary>查看原文（14行）</summary>

```text
export async function passShow(name, { allowPrefixes, timeoutMs, reveal }) {
  const entry = assertPassName(name, allowPrefixes);
  const bin = (await which("pass")) || "pass";
  const { code, stdout, stderr } = await run(bin, ["show", entry], timeoutMs);
  if (code !== 0) throw new Error(`pass failed: ${stderr || code}`);
  // first line is the secret; rest often metadata
  const lines = stdout.replace(/\r\n/g, "\n").split("\n");
  const raw = lines[0] || "";
  return {
    ok: true,
    entry,
    preview: redactSecret(raw, reveal),
    value: reveal ? raw : undefined,
  };
```

</details>

**依据 6 · 源码核查**：[lib/secret.js:194-243](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L194-L243)

to_env 与 age 解密。

<details>
<summary>查看原文（50行）</summary>

```text
/**
 * Load pass entry into process.env[envKey] for later tools in this dsh process.
 * Never returns the secret value (only preview + envKeys).
 */
export async function passToEnv(name, envKey, { allowPrefixes, timeoutMs }) {
  const key = assertEnvKey(envKey);
  const shown = await passShow(name, { allowPrefixes, timeoutMs, reveal: true });
  process.env[key] = shown.value;
  return {
    ok: true,
    entry: shown.entry,
    envKey: key,
    preview: redactSecret(shown.value, false),
    note: "Secret is in process.env for this dsh process only; not shown in full. Prefer this over reveal.",
  };
}

export async function ageDecrypt(filePath, { allowPrefixes, timeoutMs, reveal, identityFile }) {
  const file = assertAgePath(filePath, allowPrefixes);
  const bin = (await which("age")) || "age";
  const args = ["-d"];
  if (identityFile) {
    const id = resolve(String(identityFile));
    if (!existsSync(id)) throw new Error("identity file missing");
    args.push("-i", id);
  }
  args.push(file);
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0) throw new Error(`age failed: ${stderr || code}`);
  const raw = stdout;
  return { ok: true, path: file, preview: redactSecret(raw, reveal), value: reveal ? raw : undefined };
}

export async function ageToEnv(filePath, envKey, { allowPrefixes, timeoutMs, identityFile }) {
  const key = assertEnvKey(envKey);
  const dec = await ageDecrypt(filePath, {
    allowPrefixes,
    timeoutMs,
    reveal: true,
    identityFile,
  });
  const value = String(dec.value || "").split("\n")[0] || "";
  process.env[key] = value;
  return {
    ok: true,
    path: dec.path,
    envKey: key,
    preview: redactSecret(value, false),
    note: "Secret is in process.env for this dsh process only; not shown in full.",
  };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “不暴露完整密钥”的边界和路径防护有什么缺口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

默认 reveal=false 确实不把完整密钥作为工具结果返回，但预览泄出前后各两字符和长度；若配置 reveal=true，passShow/ageDecrypt 的结构化结果含 value，render 文字是否隐藏不能证明宿主存储、日志或调用者收不到完整值。to_env 把值写全局 process.env，同进程其他插件可读，代码没有 per-tool 授权、过期或撤销。age 路径只做词法 resolve/前缀校验后检查存在，未 realpath 跟随符号链接复核；允许目录下若有指向外部的符号链接，边界可能失效，需复现。identityFile 只查存在，不受 age 路径白名单限制。故此包适合受信任宿主内的便利转交，不能当跨插件密钥隔离器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/secret.js:69-87](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L69-L87)

age 是词法路径与前缀判断，未见 realpath。

<details>
<summary>查看原文（19行）</summary>

```text
export function assertAgePath(filePath, allowPrefixes = []) {
  const abs = resolve(String(filePath || "").trim());
  if (abs.includes("\0")) throw new Error("invalid age path");
  if (!allowPrefixes.length) throw new Error("allowPrefixes empty");
  const home = homedir();
  const candidates = allowPrefixes
    .map((p) => String(p).trim())
    .filter((p) => p.startsWith("~") || p.startsWith("/") || /^[A-Za-z]:/.test(p) || p.includes("/") || p.includes("\\"))
    .map((p) => resolve(p.startsWith("~") ? p.replace(/^~/, home) : p));
  if (!candidates.length) {
    throw new Error("no filesystem allowPrefixes for age (use absolute or ~/ paths)");
  }
  const ok = candidates.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return abs === r || abs.startsWith(r + "/") || abs.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`age file outside allowPrefixes: ${abs}`);
  if (!existsSync(abs)) throw new Error("age file missing");
  return abs;
```

</details>

**依据 2 · 源码核查**：[lib/secret.js:90-103](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L90-L103)

预览与 envKey 校验。

<details>
<summary>查看原文（14行）</summary>

```text
export function redactSecret(text, reveal) {
  const s = String(text || "");
  if (reveal) return s;
  if (!s) return "";
  if (s.length <= 8) return "***";
  return `${s.slice(0, 2)}…${s.slice(-2)} (len=${s.length})`;
}

export function assertEnvKey(key) {
  const k = String(key || "").trim();
  if (!ENV_KEY_RE.test(k)) throw new Error(`invalid env key: ${key}`);
  if (k === "PATH" || k === "HOME" || k === "USER") throw new Error(`refusing to overwrite ${k}`);
  return k;
}
```

</details>

**依据 3 · 源码核查**：[lib/secret.js:160-173](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L160-L173)

reveal 可返回 value。

<details>
<summary>查看原文（14行）</summary>

```text
export async function passShow(name, { allowPrefixes, timeoutMs, reveal }) {
  const entry = assertPassName(name, allowPrefixes);
  const bin = (await which("pass")) || "pass";
  const { code, stdout, stderr } = await run(bin, ["show", entry], timeoutMs);
  if (code !== 0) throw new Error(`pass failed: ${stderr || code}`);
  // first line is the secret; rest often metadata
  const lines = stdout.replace(/\r\n/g, "\n").split("\n");
  const raw = lines[0] || "";
  return {
    ok: true,
    entry,
    preview: redactSecret(raw, reveal),
    value: reveal ? raw : undefined,
  };
```

</details>

**依据 4 · 源码核查**：[lib/secret.js:194-208](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L194-L208)

to_env 写全局 process.env。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Load pass entry into process.env[envKey] for later tools in this dsh process.
 * Never returns the secret value (only preview + envKeys).
 */
export async function passToEnv(name, envKey, { allowPrefixes, timeoutMs }) {
  const key = assertEnvKey(envKey);
  const shown = await passShow(name, { allowPrefixes, timeoutMs, reveal: true });
  process.env[key] = shown.value;
  return {
    ok: true,
    entry: shown.entry,
    envKey: key,
    preview: redactSecret(shown.value, false),
    note: "Secret is in process.env for this dsh process only; not shown in full. Prefer this over reveal.",
  };
```

</details>

**依据 5 · 源码核查**：[lib/secret.js:211-243](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L211-L243)

age 身份文件与环境转交。

<details>
<summary>查看原文（33行）</summary>

```text
export async function ageDecrypt(filePath, { allowPrefixes, timeoutMs, reveal, identityFile }) {
  const file = assertAgePath(filePath, allowPrefixes);
  const bin = (await which("age")) || "age";
  const args = ["-d"];
  if (identityFile) {
    const id = resolve(String(identityFile));
    if (!existsSync(id)) throw new Error("identity file missing");
    args.push("-i", id);
  }
  args.push(file);
  const { code, stdout, stderr } = await run(bin, args, timeoutMs);
  if (code !== 0) throw new Error(`age failed: ${stderr || code}`);
  const raw = stdout;
  return { ok: true, path: file, preview: redactSecret(raw, reveal), value: reveal ? raw : undefined };
}

export async function ageToEnv(filePath, envKey, { allowPrefixes, timeoutMs, identityFile }) {
  const key = assertEnvKey(envKey);
  const dec = await ageDecrypt(filePath, {
    allowPrefixes,
    timeoutMs,
    reveal: true,
    identityFile,
  });
  const value = String(dec.value || "").split("\n")[0] || "";
  process.env[key] = value;
  return {
    ok: true,
    path: dec.path,
    envKey: key,
    preview: redactSecret(value, false),
    note: "Secret is in process.env for this dsh process only; not shown in full.",
  };
```

</details>

**依据 6 · 源码核查**：[index.js:173-202](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L173-L202)

pass_get render 和结构化输出。

<details>
<summary>查看原文（30行）</summary>

```text
  ctx.tools.register({
    name: "secret_pass_get",
    description:
      "Read a pass entry. With reveal=false (default config) only preview is returned. Prefer secret_to_env instead.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: { name: { type: "string", description: "pass entry e.g. dsh/openrouter" } },
    },
    output: {
      ...commonOut,
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : `entry=${v.entry} preview=${v.preview}${v.value ? "\n(value present — reveal on)" : ""}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await passShow(args.name, { allowPrefixes, timeoutMs, reveal });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "pass get" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pass get", content: r.content }),
```

</details>

#### 缺口

- 未用符号链接测试 age 路径。
  **影响**：越界属于源码推断，实际行为需独立复现。
  **进一步探讨**：在允许根内放指向根外的 .age 符号链接，核拒绝/读取并对比 realpath。
- 未核宿主对结构化 value 的保存与模型可见规则。
  **影响**：reveal=true 的泄露面无法量化。
  **进一步探讨**：隔离假密钥记录工具原始结果、UI、日志与后续 Agent 上下文。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 初始化、持续及恢复成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要 WSL/Linux 的 pass/age、可用 GPG/age 身份、Cordis tools/systemPrompt 与允许前缀配置；源码包声明 Node>=18，而 README 单列 DSH 最低 0.1.2。使用中每次读取起子进程并可至默认 15 秒，stdout 超 200k 会杀进程，stderr 未见大小上限；写进程环境会一直持续到覆盖或进程结束。人工需维护密钥目录、身份、名单和轮换，失败要区分缺工具、解密错误、超时、前缀拒绝及进程污染。没有单位调用延迟或事故率数据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/package.json#L1-L13)

版本 0.2.0、Node 与安装文件。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-wsl-secret",
  "version": "0.2.0",
  "description": "DeepSeek Harness WSL plugin: pass/age secrets with allowlist; list/exists; secret_to_env without dumping values into chat.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-secret.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "pass", "age", "secrets"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 2 · 作者声明**：[README.md:21-52](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/README.md#L21-L52)

工具、密钥和名单设置。

<details>
<summary>查看原文（32行）</summary>

````text
## 5 分钟上手

### 1. 装工具（一次）

```bash
sudo apt install pass age
# 需要时: pass init <gpg-id>
```

### 2. 密钥放在同一前缀下

```bash
pass insert dsh/openrouter
pass insert dsh/discord-bot
```

### 3. Cordis 放行该前缀

编辑 profile 的 `cordis.patch.yml`（例如 `~/.dsh/profiles/web/cordis.patch.yml`）：

```yaml
plugins:
  dsh-wsl-secret:
    enabled: true
    path: /mnt/c/Users/你/Desktop/AIFullStackDevelopment/dsh-wsl-secret
    config:
      allowPrefixes:
        - dsh
        # - ~/secrets          # age 用文件系统根
      reveal: false
      timeoutMs: 15000
```
````

</details>

**依据 3 · 作者声明**：[README.md:98-105](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/README.md#L98-L105)

作者 DSH 兼容声明。

```text
## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-secret` **0.2.0** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

**依据 4 · 源码核查**：[index.js:19-25](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L19-L25)

默认超时/名单/reveal。

```text
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const allowPrefixes = Array.isArray(config.allowPrefixes) ? config.allowPrefixes.map(String) : [];
  const reveal = config.reveal === true;
  console.log(
    `[dsh-wsl-secret] allowPrefixes=${allowPrefixes.length} reveal=${reveal}` +
      (allowPrefixes.length ? "" : " (empty allowlist → all reads refused)"),
  );
```

**依据 5 · 源码核查**：[lib/secret.js:19-42](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L19-L42)

子进程、超时和 stdout 上限。

<details>
<summary>查看原文（24行）</summary>

```text
export function run(bin, args, timeoutMs = 15_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"], env: process.env });
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
}
```

</details>

**依据 6 · 源码核查**：[lib/secret.js:194-208](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L194-L208)

进程环境持久写入。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Load pass entry into process.env[envKey] for later tools in this dsh process.
 * Never returns the secret value (only preview + envKeys).
 */
export async function passToEnv(name, envKey, { allowPrefixes, timeoutMs }) {
  const key = assertEnvKey(envKey);
  const shown = await passShow(name, { allowPrefixes, timeoutMs, reveal: true });
  process.env[key] = shown.value;
  return {
    ok: true,
    entry: shown.entry,
    envKey: key,
    preview: redactSecret(shown.value, false),
    note: "Secret is in process.env for this dsh process only; not shown in full. Prefer this over reveal.",
  };
```

</details>

#### 缺口

- 无真实初始化、读取延迟和轮换成本测量。
  **影响**：不能证明比手工或宿主凭据服务净省时。
  **进一步探讨**：用假密钥记录配置分钟、读取延迟、失败恢复与清理时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用并验证更窄的密钥传递机制？

**研究主题**：新假设与验证、采用判断

#### 完整回答

仅在单租户、受信任 DSH 进程中以假密钥先验名单和结果，生产时优先宿主范围化凭据服务；不启用 reveal，避免把高敏密钥放全局 process.env。若必须用本包，限定单一前缀和后续工具，做好进程重启轮换。可提出未实现假设：短时工具级句柄代替进程全局 env，并在 age 文件访问前按 realpath 复核，能减少跨插件暴露和符号链接越界；与现行 to_env 对照成功任务、明文可见进程数、失效时间与人工配置成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/secret.js:69-87](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L69-L87)

当前路径白名单实现。

<details>
<summary>查看原文（19行）</summary>

```text
export function assertAgePath(filePath, allowPrefixes = []) {
  const abs = resolve(String(filePath || "").trim());
  if (abs.includes("\0")) throw new Error("invalid age path");
  if (!allowPrefixes.length) throw new Error("allowPrefixes empty");
  const home = homedir();
  const candidates = allowPrefixes
    .map((p) => String(p).trim())
    .filter((p) => p.startsWith("~") || p.startsWith("/") || /^[A-Za-z]:/.test(p) || p.includes("/") || p.includes("\\"))
    .map((p) => resolve(p.startsWith("~") ? p.replace(/^~/, home) : p));
  if (!candidates.length) {
    throw new Error("no filesystem allowPrefixes for age (use absolute or ~/ paths)");
  }
  const ok = candidates.some((root) => {
    const r = root.replace(/[/\\]+$/, "");
    return abs === r || abs.startsWith(r + "/") || abs.startsWith(r + "\\");
  });
  if (!ok) throw new Error(`age file outside allowPrefixes: ${abs}`);
  if (!existsSync(abs)) throw new Error("age file missing");
  return abs;
```

</details>

**依据 2 · 源码核查**：[lib/secret.js:194-208](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/lib/secret.js#L194-L208)

全局 env 转交。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Load pass entry into process.env[envKey] for later tools in this dsh process.
 * Never returns the secret value (only preview + envKeys).
 */
export async function passToEnv(name, envKey, { allowPrefixes, timeoutMs }) {
  const key = assertEnvKey(envKey);
  const shown = await passShow(name, { allowPrefixes, timeoutMs, reveal: true });
  process.env[key] = shown.value;
  return {
    ok: true,
    entry: shown.entry,
    envKey: key,
    preview: redactSecret(shown.value, false),
    note: "Secret is in process.env for this dsh process only; not shown in full. Prefer this over reveal.",
  };
```

</details>

**依据 3 · 源码核查**：[index.js:19-37](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/index.js#L19-L37)

可默认关闭 reveal。

<details>
<summary>查看原文（19行）</summary>

```text
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const allowPrefixes = Array.isArray(config.allowPrefixes) ? config.allowPrefixes.map(String) : [];
  const reveal = config.reveal === true;
  console.log(
    `[dsh-wsl-secret] allowPrefixes=${allowPrefixes.length} reveal=${reveal}` +
      (allowPrefixes.length ? "" : " (empty allowlist → all reads refused)"),
  );

  ctx.systemPrompt.section({
    name: "tool:secret",
    order: 133,
    text: [
      "dsh-wsl-secret reads pass/age secrets only under config.allowPrefixes.",
      "Preferred flow: secret_pass_exists → secret_to_env (puts value in process.env, returns preview only) → call other tools.",
      "Avoid secret_pass_get with reveal; never paste secrets into chat.",
      "If allowPrefixes is empty, every read fails — tell the user to configure the plugin.",
      "dsh-wsl-cred is for Git credential hints only; use this plugin for app API keys.",
    ].join(" "),
  });
```

</details>

**依据 4 · 作者声明**：[README.md:87-95](https://github.com/173787247/dsh-wsl-secret/blob/be996ef420b165aebb759cda3957e65a966efe22/README.md#L87-L95)

作者安全模型。

```text
## 安全模型（摘要）

1. 空 `allowPrefixes` → 全部拒绝  
2. pass 名必须匹配前缀（`dsh` → `dsh/...`）  
3. age 路径必须在列表里的目录根下  
4. 默认 `reveal: false`，结果不含完整密钥  
5. 优先 `secret_to_env`，避免把明文塞进模型上下文  
6. 永远不要把密钥贴进聊天  

```

#### 缺口

- 句柄和 realpath 防护未实现。
  **影响**：不能把设想当当前能力或已证实收益。
  **进一步探讨**：假密钥双插件隔离及符号链接测试，比较暴露范围和任务成功率。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
