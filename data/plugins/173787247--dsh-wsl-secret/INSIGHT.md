# dsh-wsl-secret

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[9e3617c](https://github.com/173787247/dsh-wsl-secret/tree/9e3617c76e3e33b988279899ca27680e854daca1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-secret)
<!-- END META -->

> **功能**：在 DSH 中查找 pass 条目、解密 pass 或 age 内容，并按需写入环境变量。

> **亮点**：[Q01](#research-q01) 在 DSH 中串起条目查找与环境变量注入，减少手工复制密钥的步骤。

> **主要限制**：[Q02](#research-q02) age 路径前缀是词法检查，reveal 会把明文放入结果。[Q03](#research-q03) 环境变量跨工具共享且可覆盖，没有单次生命周期。

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
  - [Q01 · 哪个凭据配置步骤被移入了 DSH？](#detail-section-11)
  - [Q02 · 前缀、解密路径与可见范围怎样受限？](#detail-section-12)
  - [Q03 · 如何试验环境注入并控制退出影响？](#detail-section-13)
  - [Q04 · 将密钥绑定到单次目标工具会减少跨任务暴露吗？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已用 pass 或 age 保存应用凭据的 WSL 开发者，需要给支持环境变量的 DSH 工具提供单行密钥。

直接通过受控进程配置注入密钥，或由目标工具读取单独配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态、列表与存在性 | 查找可用命令和 pass 条目 | ready 仅反映前缀配置 |
| 解密预览 | 检查 pass 或 age 输入 | reveal 可将原值写入结果 |
| 环境注入 | 交给目标工具读取 | 作用范围为 DSH 进程，允许同名覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node、DSH 与 bash | 必需 | 挂载工具并发现命令 | 工具加载或命令查找失败 |
| pass/GPG 或 age 与身份 | 相应解密必需 | 读取测试条目 | 存在性不代表可解密 |
| allowPrefixes | 读取必需 | 限定名称和词法路径 | 空配置拒绝读取 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置虚拟密钥和独立 DSH 进程 | 无真实凭据 |
| 调用 | 用户查存在性后向测试变量注入 | 验证目标工具能读且检查旁观范围 |
| 退出 | 用户停止隔离进程 | 回到原受控配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 现有工具与进程资源未知 | 配置前缀、密钥和虚拟样本 | 须区分 pass 和 age |
| 持续 | 耗时未知 | 复核环境范围、并发与预览 | 同名覆盖需要应用方处理 |
| 失败恢复 | 排障资源未知 | 停止测试进程并核对旧配置 | 插件不回滚已写变量 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 应用凭据交接 | 按已配置条目写入单行环境变量 | 真实下游可用性和节时 |
| 范围控制 | 前缀规则和输出预览 | 真实文件隔离、宿主结果留存与跨任务范围 |

> **思考**：[Q02](#research-q02) age 路径前缀是词法检查，reveal 会把明文放入结果。[Q03](#research-q03) 环境变量跨工具共享且可覆盖，没有单次生命周期。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在 DSH 中串起条目查找与环境变量注入，减少手工复制密钥的步骤。

[Q02](#research-q02) 当前路径检查未约束真实链接目标或 identity 文件位置，不能当作文件访问边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) age 路径前缀是词法检查，reveal 会把明文放入结果。[Q03](#research-q03) 环境变量跨工具共享且可覆盖，没有单次生命周期。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只在独立测试进程中用虚拟密钥核对作用域与日志。真实凭据优先沿用受控配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认配置、解密、预览与写入边界。真实宿主可见范围及单次注入方案尚待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/secret.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码核查 Host 入口、前缀、子进程、输出与环境注入。未执行插件、解密命令、宿主或真实凭据操作。
- 下一步：用虚拟值对照非法前缀、符号链接、reveal、同键并发、子进程继承与退出。

**分析版本**

- **仓库**：[173787247/dsh-wsl-secret](https://github.com/173787247/dsh-wsl-secret)
- **版本号**：0.2.0（[固定提交 9e3617c](https://github.com/173787247/dsh-wsl-secret/tree/9e3617c76e3e33b988279899ca27680e854daca1)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在获准目标的隔离子进程做单次注入，比较授权成功率、旁观读取率和启动耗时。

用虚拟值对照非法前缀、符号链接、reveal、同键并发、子进程继承与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 255 | — | — | 1189 |
| .js | source | 2 | 540 | 500 | 9 | — |
| .js | test | 1 | 49 | 48 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 pass 或 age 的操作者能否从 DSH 使用应用凭据，并控制密钥可见范围与生命周期？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪个凭据配置步骤被移入了 DSH？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 pass 或 age 的操作者可查条目存在性，再将授权条目的密钥写入 DSH 进程环境，省去手工复制到对话或重新启进程注入变量。pass 路径取解密输出首行，age 环境路径也只取首行，因此适合单行应用 API 密钥。合格结果是目标工具按预期读到密钥并完成目标操作，插件只完成写入环境，已缓存配置的工具可能不会重新读取。预览对长值暴露首末各两字符与长度，不能将预览理解为完全隐藏。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-17](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/README.md#L5-L17)

作者区分应用密钥和 Git 凭据提示。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:135-167](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L135-L167)

DSH 工具写入及文本预览。

<details>
<summary>查看原文（33行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/secret.js:90-96](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L90-L96)

预览掩码规则。

```text
export function redactSecret(text, reveal) {
  const s = String(text || "");
  if (reveal) return s;
  if (!s) return "";
  if (s.length <= 8) return "***";
  return `${s.slice(0, 2)}…${s.slice(-2)} (len=${s.length})`;
}
```

**依据 4 · 源码核查**：[lib/secret.js:160-173](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L160-L173)

pass 首行处理。

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

**依据 5 · 源码核查**：[lib/secret.js:198-208](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L198-L208)

实际写入进程环境。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 6 · 源码核查**：[lib/secret.js:227-243](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L227-L243)

age 环境注入取首行。

<details>
<summary>查看原文（17行）</summary>

```text
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

#### 缺口

- 没有下游工具读取时机和运行对照
  **影响**：无法确认哪些工具可在同一进程热用环境变量
  **进一步探讨**：仅以合成凭据验证实时读取与缓存配置的差异

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 前缀、解密路径与可见范围怎样受限？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

pass 路径检查名称字符、连续点和目录前缀，空列表拒绝；age 路径用 resolve 与字符串前缀判断后检查存在性，未解析真实路径，因此只验证词法位置，无法阻止批准目录中的符号链接指向外部。可传 identityFile，源码只 resolve 并检查存在，未用 allowPrefixes 限定 identity。进程是否有权读出目标、密钥是否能解密仍由文件权限和 age 行为决定。默认 reveal=false，直接读取只回预览。打开 reveal 后 passShow 和 ageDecrypt 会把原值作为结构化 value 返回，也把 preview 改成原值，工具渲染会写入该 preview。这与只看成功状态有直接差别。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-36](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L19-L36)

配置的默认值和作者意图。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[index.js:173-199](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L173-L199)

pass 工具文本直接输出 preview。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[index.js:244-273](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L244-L273)

age 工具接受 identityFile 并输出 preview。

<details>
<summary>查看原文（30行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/secret.js:50-96](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L50-L96)

词法检查与 reveal 对预览的影响。

<details>
<summary>查看原文（47行）</summary>

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
}

export function redactSecret(text, reveal) {
  const s = String(text || "");
  if (reveal) return s;
  if (!s) return "";
  if (s.length <= 8) return "***";
  return `${s.slice(0, 2)}…${s.slice(-2)} (len=${s.length})`;
}
```

</details>

**依据 5 · 源码核查**：[lib/secret.js:211-225](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L211-L225)

identity 路径和解密返回。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 未验证真实系统上链接、权限和宿主日志路径
  **影响**：不能把前缀校验当作文件隔离或日志保密
  **进一步探讨**：用无真实凭据的 fixture 对照外部链接、未获准路径、禁用 reveal 和已启用 reveal

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试验环境注入并控制退出影响？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node 18+ 和 bundle patch，Host 还需要 tools、systemPrompt 以及 bash 和所选解密工具、对应密钥。status 的 ready 只取决于前缀是否配置，不能证明可解密。envKey 校验变量名语法并禁止 PATH、HOME、USER，其余可由调用指定；同进程中其他工具可以读取它，子进程如果继承环境也可看到。注册将注入标为并发安全，但两次写同名变量会覆盖，未记录调用归属、回滚或过期机制。插件停用路径没有清理已有变量。只用虚拟值在隔离进程观察，验收目标工具、其他工具和新子进程的可见范围，随后停止测试进程并从原受控配置运行。进程共享环境或密钥值可能落入结果时，不应将真实凭据交给该路径。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-21](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L11-L21)

Host 服务、禁用与配置。

<details>
<summary>查看原文（11行）</summary>

```text
export const name = "dsh-wsl-secret";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-secret] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const allowPrefixes = Array.isArray(config.allowPrefixes) ? config.allowPrefixes.map(String) : [];
  const reveal = config.reveal === true;
```

</details>

**依据 2 · 源码核查**：[index.js:54-65](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L54-L65)

ready 只取决于前缀数。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[index.js:160-166](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L160-L166)

注入工具注册为并发安全。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await passToEnv(args.name, args.envKey, { allowPrefixes, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

**依据 4 · 源码核查**：[lib/secret.js:8-26](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L8-L26)

查找命令与子进程继承环境。

<details>
<summary>查看原文（19行）</summary>

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
}

export function run(bin, args, timeoutMs = 15_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"], env: process.env });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
```

</details>

**依据 5 · 源码核查**：[lib/secret.js:98-103](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L98-L103)

变量名称和三个保留变量。

```text
export function assertEnvKey(key) {
  const k = String(key || "").trim();
  if (!ENV_KEY_RE.test(k)) throw new Error(`invalid env key: ${key}`);
  if (k === "PATH" || k === "HOME" || k === "USER") throw new Error(`refusing to overwrite ${k}`);
  return k;
}
```

**依据 6 · 源码核查**：[lib/secret.js:198-208](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L198-L208)

进程级变量覆盖，没有回滚。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 7 · 源码核查**：[package.json:8-13](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/package.json#L8-L13)

声明 Node 和包接线。

```text
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "pass", "age", "secrets"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

#### 缺口

- 真实下游进程的环境继承和配置缓存未验收
  **影响**：无法保证一次注入只影响预期调用
  **进一步探讨**：以虚拟值进行两次同键注入、并发调用和停止进程后的作用域检查

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 将密钥绑定到单次目标工具会减少跨任务暴露吗？

**研究主题**：新假设与验证

#### 完整回答

现有注入返回掩码而将原值放在宿主进程级环境。可比较仅给获准目标工具的隔离子进程注入一次变量，任务结束即结束进程，默认结果只报成功状态。用相同虚拟凭据测试两个并发任务及一个无权旁观工具，记录授权操作成功率、非目标读取率和额外启动耗时。若目标兼容性明显下降或旁观者仍可通过宿主日志、子进程和并发任务读到值，则否定该方案。此处只提出待验证设计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/secret.js:198-208](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L198-L208)

进程级写入基线。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/secret.js:227-243](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/lib/secret.js#L227-L243)

age 路径同样全局写入。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 3 · 源码核查**：[index.js:148-164](https://github.com/173787247/dsh-wsl-secret/blob/9e3617c76e3e33b988279899ca27680e854daca1/index.js#L148-L164)

预览已经有独立投影，可对照调整。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

#### 缺口

- 没有作用域方案或对照试验
  **影响**：不能宣称隔离或收益成立
  **进一步探讨**：以合成值测授权成功、旁观读取和进程开销

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
