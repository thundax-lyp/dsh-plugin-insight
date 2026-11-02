# dsh-wsl-ssh-agent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b1c2cca](https://github.com/173787247/dsh-wsl-ssh-agent/tree/b1c2cca9e63657086d6539671969b56097a37a8c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-ssh-agent)
<!-- END META -->

> **功能**：只读汇总WSL进程socket、agent身份数量及常见桥线索，不读私钥正文、不建桥或验证远程认证。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 元数据减量诊断与SSH/HTTPS分工，成功不返key全文/指纹注释，不启动桥或读私钥内容。

> **主要限制**：[Q03](#research-q03) sockAlive只是exists、私钥只是名字；查询失败归0并在文本漏detail，ok不等目标授权，配置/取消未接内部命令。

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
  - [Q01 · agent元数据能回答哪些SSH认证问题？](#detail-section-11)
  - [Q02 · env、文件名、桥与命令怎样生成结果？](#detail-section-12)
  - [Q03 · live socket、private keys与无身份建议可能误导吗？](#detail-section-13)
  - [Q04 · 个人试用和分层收据怎样限定？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL Git SSH排障的个人用户需分socket/可通信/身份/目标授权，报告不是认证完成。

手查env/目录与ssh-add；聚合线索非新转发/密钥管理机制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| socket/key数量 | 认证初筛 | exists非通信，失败可能归0 |
| key/桥痕迹 | 路径提示 | 名字/存在非权限格式可执行 |
| 文字建议 | 分SSH/HTTPS | 非自动执行/签名授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18/WSL | 必需 | 注册只读报告 | 兼容另验 |
| Host agent env/ssh-add | 查询必需 | socket/身份数量 | 失败不当无身份 |
| 可列home/.ssh | 名线索按需 | 常用key存在性 | 不读正文，名字非真实私钥 |
| 共享桥权限审查 | 用桥前提 | Windows签名可访问者 | 插件仅建议不授权建桥 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 预检 | 个人环境/元数据可外发 | 不用共享桥自动化 |
| 初筛 | 报socket/数量/桥痕迹 | 本地核query错误/目标环境 |
| 验证 | 目标认证另授权独立查 | ok不等远端权限 |
| 停止 | 错归空/隐私不清停工具 | 回原生ssh-add/权限核验 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/SSH，桥按需另装 | 环境/元数据权限 | 工时/金额未知 |
| 持续 | 列名/exists/ssh-add/结果token | 分错误与身份/认证 | 无独立API非总token费0 |
| 失败恢复 | 重查/桥排障属后续 | 查权限/工具/超时 | 插件无自有写，用户变更另还原 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合线索 | socket/数量/桥一处 | 查询错误根因/目标身份 |
| 减量披露 | 正常不回ssh-add全文/不读私钥 | 路径/异常元数据可否进入模型 |
| 分工建议 | SSH与HTTPS区别 | 桥/远端认证真实成功 |

> **思考**：[Q03](#research-q03) sockAlive只是exists、私钥只是名字；查询失败归0并在文本漏detail，ok不等目标授权，配置/取消未接内部命令。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 元数据减量诊断与SSH/HTTPS分工，成功不返key全文/指纹注释，不启动桥或读私钥内容。

[Q02](#research-q02) 固定参数和注入deps、成功数量减量可复用；[Q03](#research-q03) 存在/通信/授权分层，最终format保真错误，timeout声明非取消链。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) sockAlive只是exists、私钥只是名字；查询失败归0并在文本漏detail，ok不等目标授权，配置/取消未接内部命令。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可信个人WSL可只读初筛但核原生命令；共享桥/强治理先观察，错误或隐私不清停用，不自动加载key或建桥。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

重核完整入口/146行ssh-agent、检测与全部正式findings；未调用agent/读取真实.ssh/私钥或执行目标/网络测试。

- 已检查：作者 README、包清单、源码路径 index.js、lib/ssh-agent.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整入口/core及WSL检测/包，未读真实agent或私钥目录、不建立桥/运行目标测试。
- 下一步：[Q04](#research-q04) 假socket/退出/身份/桥矩阵核误建议/披露与预算，目标认证独立授权，本轮未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent)
- **版本号**：0.2.0（[固定提交 b1c2cca](https://github.com/173787247/dsh-wsl-ssh-agent/tree/b1c2cca9e63657086d6539671969b56097a37a8c)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证socket/查询退出/身份/时点分层与统一预算，最小化输出下比较误建议/披露/等待，非新私钥读取。

[Q04](#research-q04) 假socket/退出/身份/桥矩阵核误建议/披露与预算，目标认证独立授权，本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 104 | — | — | 616 |
| .js | source | 3 | 247 | 221 | 4 | — |
| .js | test | 1 | 39 | 35 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-ssh-agent/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：SSH agent状态线索能支持什么认证建议，如何保真错误与元数据范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · agent元数据能回答哪些SSH认证问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ssh_agent_hint给WSL的DSH用户在Git SSH失败时集中查当前Host进程SSH_AUTH_SOCK、ssh-add身份数量、常见私钥文件名与npiperelay存在。基线是本地手查env/ssh-add和路径，增量为模型可读提示与SSH/HTTPS分工。它不启动agent/桥、不加载key、不读取私钥正文、不执行ssh -T或git push。

合格结果必须分路径存在、agent能通信、有身份、目标仓库授权四层；ok只sockAlive&&keyCount>0，不证明GitHub接受key、网络可达或repo权限。成功ssh-add输出减成数量不回指纹/注释是具体披露收缩，仍有用户名路径/存在性/异常detail元数据，不叫无敏感面。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:11-29](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/index.js#L11-L29)

注册与工具范围。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:ssh_agent_hint",
    order: 121,
    text: "Use ssh_agent_hint when git SSH / github.com auth fails: checks SSH_AUTH_SOCK, ssh-add -l, ~/.ssh keys (names only), npiperelay. Never paste private keys. HTTPS push → cred_hint.",
  });

  ctx.tools.register({
    name: "ssh_agent_hint",
    description:
      "Diagnose WSL SSH agent socket, loaded keys, and Windows OpenSSH/npiperelay bridge (never returns key material).",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
```

</details>

**依据 2 · 源码核查**：[lib/ssh-agent.js:59-74](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L59-L74)

固定只读命令和成功输出减量。

<details>
<summary>查看原文（16行）</summary>

```text
export async function sshAddList({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("ssh-add", ["-l"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    const text = String(stdout || "").trim();
    if (/no identities/i.test(text)) return { ok: true, keyCount: 0, detail: text };
    const lines = text ? text.split(/\r?\n/).filter(Boolean) : [];
    return { ok: true, keyCount: lines.length, detail: lines.length ? `${lines.length} identities` : text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // exit 1 often = no agent / no identities
    const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
    return { ok: false, keyCount: 0, detail: msg, code: code == null ? "" : String(code) };
  }
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:114-145](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L114-L145)

最终报告与ok判据。

<details>
<summary>查看原文（32行）</summary>

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const sock = env.SSH_AUTH_SOCK || "";
  const sockAlive = Boolean(sock && exists(sock));
  const npiperelay = detectNpiperelay({ env, exists });
  const hasPrivateKeys = hasSshPrivateKeys({
    home: deps.home || homedir(),
    exists,
    readdir: deps.readdir || readdirSync,
  });
  const list = deps.sshAddList
    ? await deps.sshAddList()
    : await sshAddList({ execFileFn: deps.execFileFn || execFileAsync });
  const keyCount = list.keyCount || 0;
  const advice = buildSshAgentAdvice({
    sock,
    sockAlive,
    keyCount,
    hasPrivateKeys,
    npiperelay,
  });
  return {
    ok: sockAlive && keyCount > 0,
    sock,
    sockAlive,
    keyCount,
    hasPrivateKeys,
    npiperelay: npiperelay || "",
    sshAddDetail: list.detail || "",
    advice,
  };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · env、文件名、桥与命令怎样生成结果？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

入口启动时detectWsl，非WSL直接失败；core无参数，读process.env和home，sockAlive仅exists(sock)。.ssh若存在列名字，匹配id_ed25519/id_rsa/id_ecdsa或.pem就hasPrivateKeys；npiperelay从env、两固定路径及PATH推断用户scoop/go路径，均仅exists不执行。

唯一活动命令直接execFile PATH ssh-add [-l]，固定5秒，不经宿主subprocess策略。成功数非空行并回n identities，失败记录ok/code/detail；core把keyCount||0带建议却丢ok/code，format也不显示sshAddDetail和顶层error。入口timeoutMs默认15秒只宿主声明，core_config不用/未传exec.signal；与内层5秒取消非一链。模块/注入deps和固定参数值得复用，但query错误必须在最终文本保真。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh-agent.js:30-56](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L30-L56)

候选桥与只列名字。

<details>
<summary>查看原文（27行）</summary>

```text
export function detectNpiperelay({ env = process.env, exists = existsSync } = {}) {
  const candidates = [
    env.NPIPERELAY,
    "/usr/local/bin/npiperelay.exe",
    "/mnt/c/Users/Public/npiperelay.exe",
  ].filter(Boolean);
  // common scoop/user path via /mnt/c/Users/<from PATH>
  const m = (env.PATH || "").match(/\/mnt\/c\/Users\/([^/\\]+)/);
  if (m) {
    candidates.push(`/mnt/c/Users/${m[1]}/scoop/shims/npiperelay.exe`);
    candidates.push(`/mnt/c/Users/${m[1]}/go/bin/npiperelay.exe`);
  }
  for (const p of candidates) {
    if (p && exists(p)) return p;
  }
  return "";
}

export function hasSshPrivateKeys({ home = homedir(), exists = existsSync, readdir = readdirSync } = {}) {
  const dir = `${home}/.ssh`.replace(/\\/g, "/");
  if (!exists(dir)) return false;
  try {
    const names = readdir(dir);
    return names.some((n) => n === "id_ed25519" || n === "id_rsa" || n === "id_ecdsa" || /\.pem$/i.test(n));
  } catch {
    return false;
  }
```

</details>

**依据 2 · 源码核查**：[lib/ssh-agent.js:59-74](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L59-L74)

exec超时与错误对象。

<details>
<summary>查看原文（16行）</summary>

```text
export async function sshAddList({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("ssh-add", ["-l"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    const text = String(stdout || "").trim();
    if (/no identities/i.test(text)) return { ok: true, keyCount: 0, detail: text };
    const lines = text ? text.split(/\r?\n/).filter(Boolean) : [];
    return { ok: true, keyCount: lines.length, detail: lines.length ? `${lines.length} identities` : text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // exit 1 often = no agent / no identities
    const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
    return { ok: false, keyCount: 0, detail: msg, code: code == null ? "" : String(code) };
  }
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:114-145](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L114-L145)

core丢查询状态。

<details>
<summary>查看原文（32行）</summary>

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const sock = env.SSH_AUTH_SOCK || "";
  const sockAlive = Boolean(sock && exists(sock));
  const npiperelay = detectNpiperelay({ env, exists });
  const hasPrivateKeys = hasSshPrivateKeys({
    home: deps.home || homedir(),
    exists,
    readdir: deps.readdir || readdirSync,
  });
  const list = deps.sshAddList
    ? await deps.sshAddList()
    : await sshAddList({ execFileFn: deps.execFileFn || execFileAsync });
  const keyCount = list.keyCount || 0;
  const advice = buildSshAgentAdvice({
    sock,
    sockAlive,
    keyCount,
    hasPrivateKeys,
    npiperelay,
  });
  return {
    ok: sockAlive && keyCount > 0,
    sock,
    sockAlive,
    keyCount,
    hasPrivateKeys,
    npiperelay: npiperelay || "",
    sshAddDetail: list.detail || "",
    advice,
  };
```

</details>

**依据 4 · 源码核查**：[lib/ssh-agent.js:20-27](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L20-L27)

render丢detail/error。

```text
export function format(v) {
  const lines = [`ssh_agent_hint ok=${v.ok} SSH_AUTH_SOCK=${v.sock || "(unset)"}`];
  if (v.sockAlive != null) lines.push(`sockAlive: ${v.sockAlive}`);
  if (v.keyCount != null) lines.push(`sshAddKeys: ${v.keyCount}`);
  if (v.hasPrivateKeys != null) lines.push(`hasPrivateKeysInHome: ${v.hasPrivateKeys}`);
  if (v.npiperelay != null) lines.push(`npiperelay: ${v.npiperelay}`);
  for (const a of v.advice || []) lines.push(`- ${a}`);
  return lines.join("\n");
```

**依据 5 · 源码核查**：[index.js:7-30](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/index.js#L7-L30)

WSL/timeout/执行接口。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:ssh_agent_hint",
    order: 121,
    text: "Use ssh_agent_hint when git SSH / github.com auth fails: checks SSH_AUTH_SOCK, ssh-add -l, ~/.ssh keys (names only), npiperelay. Never paste private keys. HTTPS push → cred_hint.",
  });

  ctx.tools.register({
    name: "ssh_agent_hint",
    description:
      "Diagnose WSL SSH agent socket, loaded keys, and Windows OpenSSH/npiperelay bridge (never returns key material).",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · live socket、private keys与无身份建议可能误导吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

sockAlive只exists，不检查socket类型或连接，普通文件/失效socket节点也可叫live；私钥只文件名不stat类型/权限/格式，匹配目录可true、定制命名会漏、不可读catch false不等确无key。npiperelay存在不证可执行/版本或Windows服务正常。

ssh-add权限/未安装/超时与真无身份都keyCount0，若路径exists建议统一“shows no identities，run ssh-add”，会把查询失败当状态结论；实际query detail虽在JSON却文本不见。故报告只能初筛，不能据它自动加载密钥或扩大Windows agent桥访问。socat建议能扩大谁可调用签名能力，但本插件没建立/授权桥，必须独立审共享权限。未调用真实agent/列真实.ssh，不声称发生泄密或已错误加载。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh-agent.js:48-56](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L48-L56)

私钥名启发式和吞错。

```text
export function hasSshPrivateKeys({ home = homedir(), exists = existsSync, readdir = readdirSync } = {}) {
  const dir = `${home}/.ssh`.replace(/\\/g, "/");
  if (!exists(dir)) return false;
  try {
    const names = readdir(dir);
    return names.some((n) => n === "id_ed25519" || n === "id_rsa" || n === "id_ecdsa" || /\.pem$/i.test(n));
  } catch {
    return false;
  }
```

**依据 2 · 源码核查**：[lib/ssh-agent.js:87-110](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L87-L110)

live/no identities与桥静态建议。

<details>
<summary>查看原文（24行）</summary>

```text
  if (!sock) {
    tips.push("SSH_AUTH_SOCK is unset — no agent socket in this process.");
  } else if (!sockAlive) {
    tips.push(`SSH_AUTH_SOCK=${sock} is set but the socket path is missing (stale agent).`);
  } else {
    tips.push("SSH_AUTH_SOCK points at a live socket.");
  }
  if (keyCount === 0 && sockAlive) {
    tips.push("ssh-add -l shows no identities — run ssh-add ~/.ssh/id_ed25519 (or forward Windows agent).");
  } else if (keyCount > 0) {
    tips.push(`Agent reports ${keyCount} loaded key(s).`);
  }
  if (hasPrivateKeys && !sockAlive) {
    tips.push("~/.ssh has private key files but no live agent — start ssh-agent or forward Windows OpenSSH agent.");
  }
  if (npiperelay) {
    tips.push(`Found npiperelay at ${npiperelay} — you can bridge \\\\.\\pipe\\openssh-ssh-agent into WSL.`);
  } else {
    tips.push(
      "Windows OpenSSH agent bridge: install npiperelay, then socat UNIX-LISTEN:$SSH_AUTH_SOCK,fork EXEC:\"npiperelay.exe -ei -s //./pipe/openssh-ssh-agent\",nofork",
    );
  }
  tips.push("HTTPS git push is separate — use cred_hint / Git Credential Manager; SSH remotes need this agent.");
  tips.push("Verify: ssh-add -l && ssh -T git@github.com");
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:117-128](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L117-L128)

exists与查询失败归0。

<details>
<summary>查看原文（12行）</summary>

```text
  const sock = env.SSH_AUTH_SOCK || "";
  const sockAlive = Boolean(sock && exists(sock));
  const npiperelay = detectNpiperelay({ env, exists });
  const hasPrivateKeys = hasSshPrivateKeys({
    home: deps.home || homedir(),
    exists,
    readdir: deps.readdir || readdirSync,
  });
  const list = deps.sshAddList
    ? await deps.sshAddList()
    : await sshAddList({ execFileFn: deps.execFileFn || execFileAsync });
  const keyCount = list.keyCount || 0;
```

</details>

**依据 4 · 源码核查**：[lib/ssh-agent.js:20-27](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L20-L27)

最终可见信息差异。

```text
export function format(v) {
  const lines = [`ssh_agent_hint ok=${v.ok} SSH_AUTH_SOCK=${v.sock || "(unset)"}`];
  if (v.sockAlive != null) lines.push(`sockAlive: ${v.sockAlive}`);
  if (v.keyCount != null) lines.push(`sshAddKeys: ${v.keyCount}`);
  if (v.hasPrivateKeys != null) lines.push(`hasPrivateKeysInHome: ${v.hasPrivateKeys}`);
  if (v.npiperelay != null) lines.push(`npiperelay: ${v.npiperelay}`);
  for (const a of v.advice || []) lines.push(`- ${a}`);
  return lines.join("\n");
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 个人试用和分层收据怎样限定？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可信个人WSL可限定只读提示小试，先审元数据是否可进模型，核Host环境不是假定会话/Windows其他终端环境相同；不用它证明远程授权，不自动照建议加载key/建桥。共享agent或治理要求强的环境先观察，需核桥签名权限/宿主工具授权。首次核interop/PATH/socket与元数据，持续每次exists/列名/ssh-add及结果token和人工复核，金额/延迟未知；无插件网络/写入不等模型费用零。失败回本地原生ssh-add错误与独立授权验收，停工具无自有写回滚，但后续桥/密钥加载由用户另处理。

未验证假设是路径存在/类型、查询退出/超时、身份数与观测时点分开，保留最小化报告、统一预算/取消；已有成功输出减量不能重复计新贡献。以假socket普通文件、权限拒绝/无ssh-add/timeout、0与N身份、匹配名目录/定制名和桥不可执行夹具比较误建议/披露/总等待。若现有提示足够或检测增加不必要接触/维护成本，则不扩展；不读取真实私钥、不自动做SSH联网测试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh-agent.js:59-74](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L59-L74)

查询分类实验源。

<details>
<summary>查看原文（16行）</summary>

```text
export async function sshAddList({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("ssh-add", ["-l"], {
      encoding: "utf8",
      timeout: 5_000,
    });
    const text = String(stdout || "").trim();
    if (/no identities/i.test(text)) return { ok: true, keyCount: 0, detail: text };
    const lines = text ? text.split(/\r?\n/).filter(Boolean) : [];
    return { ok: true, keyCount: lines.length, detail: lines.length ? `${lines.length} identities` : text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // exit 1 often = no agent / no identities
    const code = err && typeof err === "object" && "code" in err ? err.code : undefined;
    return { ok: false, keyCount: 0, detail: msg, code: code == null ? "" : String(code) };
  }
```

</details>

**依据 2 · 源码核查**：[lib/ssh-agent.js:114-145](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/lib/ssh-agent.js#L114-L145)

报告层级和时点缺口。

<details>
<summary>查看原文（32行）</summary>

```text
export async function execute(_args, _config = {}, deps = {}) {
  const env = deps.env || process.env;
  const exists = deps.exists || existsSync;
  const sock = env.SSH_AUTH_SOCK || "";
  const sockAlive = Boolean(sock && exists(sock));
  const npiperelay = detectNpiperelay({ env, exists });
  const hasPrivateKeys = hasSshPrivateKeys({
    home: deps.home || homedir(),
    exists,
    readdir: deps.readdir || readdirSync,
  });
  const list = deps.sshAddList
    ? await deps.sshAddList()
    : await sshAddList({ execFileFn: deps.execFileFn || execFileAsync });
  const keyCount = list.keyCount || 0;
  const advice = buildSshAgentAdvice({
    sock,
    sockAlive,
    keyCount,
    hasPrivateKeys,
    npiperelay,
  });
  return {
    ok: sockAlive && keyCount > 0,
    sock,
    sockAlive,
    keyCount,
    hasPrivateKeys,
    npiperelay: npiperelay || "",
    sshAddDetail: list.detail || "",
    advice,
  };
```

</details>

**依据 3 · 源码核查**：[package.json:1-18](https://github.com/173787247/dsh-wsl-ssh-agent/blob/b1c2cca9e63657086d6539671969b56097a37a8c/package.json#L1-L18)

固定包/Node。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-wsl-ssh-agent",
  "version": "0.2.0",
  "description": "Diagnose WSL SSH agent socket, ssh-add keys, npiperelay bridge (no key material).",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-ssh-agent.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-ssh-agent/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-ssh-agent#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

</details>

#### 缺口

- 未真实Host/agent/桥及分层版本测试、成本与元数据权限核验
  **影响**：不能保证诊断准确或目标认证通过/净节时
  **进一步探讨**：先假依赖矩阵测误归空与披露，再个人非敏感环境核原生结果，记录全成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
