# dsh-wsl-ssh-agent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9971638](https://github.com/173787247/dsh-wsl-ssh-agent/tree/99716388c9fa204b53bb6e931a239810d4524a0b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent)
<!-- END META -->

> **实现功能**：检查WSL宿主SSH_AUTH_SOCK路径、ssh-add身份数量与常见密钥文件名/npiperelay存在，提供转发和认证排查提示。

> **核心亮点**：将socket/身份数量和常见桥痕迹聚合为只读提示，正常结果不回key指纹正文、不读私钥内容，区分SSH/HTTPS。详见[Q02](#research-q02)。

> **风险与缺陷**：sockAlive仅exists、key文件仅名字，ssh-add失败变0并丢ok/code且render漏detail，易把错误当无身份；直接exec不接signal/config，ok非目标授权。详见[Q03](#research-q03)。

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
  - [Q01 · 适合什么SSH故障，ok能证明Git认证吗？](#detail-section-11)
  - [Q02 · 检查范围和隐私减量如何实现？](#detail-section-12)
  - [Q03 · 诊断状态、错误与进程治理有何不足？](#detail-section-13)
  - [Q04 · 启动流程和首次持续恢复成本是什么？](#detail-section-14)
  - [Q05 · 推荐与继续探讨入口是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向WSL内DSH做Git SSH失败、需要知道当前host进程有无SSH_AUTH_SOCK、agent身份数量和常见Windows桥安装痕迹的用户。ssh_agent_hint是诊断/文字建议，不启动agent/桥、不加载私钥、不执行ssh -T或Git推送，也不读密钥文件正文。

合格结果需分清socket路径存在、agent可通信、有身份、目标仓库授权四层。ok只sockAlive && keyCount>0，不证明GitHub接受该key、目标repo权限或实际SSH网络成功。基线手查env/ssh-add/目录名，增量聚合小范围元数据和“不粘贴私钥”提醒。

人工env/ssh-add/目录排查，插件省汇总但非真实连接/授权证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| socket检查 | env路径存在 | 非isSocket/活连接 |
| 身份计数 | ssh-add -l行数 | 错误0非无key，非目标授权 |
| key/桥痕迹 | 常见文件名/exists | 非内容/格式/权限验证 |
| 转发建议 | SSH/HTTPS路径引导 | 不建立桥/不加载key |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| WSL/Node>=18与DSH tools/systemPrompt | 启用工具/指引 | apply环境缓存，包无精确host peer |
| 可信PATH内ssh-add与当前agent env | 查询身份数量 | 不证明目标host授权，不接远端workspace环境 |
| .ssh目录可列名 | 名称启发式 | 不读正文/不保证所有key发现 |
| npiperelay/Windows agent | 可选转发建议 | 仅查存在，未创建桥 |
| 元数据披露许可 | 路径/数量/错误入上下文 | 不粘私钥不等无隐私 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核WSL/服务/PATH | 不先更改agent/添加key |
| 查看 | 分别看socket存在/数量/桥 | live只是exists，0不一定无身份 |
| 追因 | 查结构错误/实际权限与进程 | 当前render漏detail，需更细状态 |
| 决策 | 必要时读者审核转发/授权范围 | 提示文本不等用户授权建立桥 |
| 维护 | env/socket变化重新核当前host | 不把cachedWSL/本机home当所有会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包/既有SSH工具，桥如需另装 | 核互操作/PATH/agent与元数据范围 | 工时/费用未知 |
| 持续使用 | 每次列名/exists与ssh-add进程、工具结果上下文 | 解释状态与审权限 | 无独立网络/模型调用不等总token费0，实际延迟未知 |
| 失败恢复 | 重试查询、清失效socket/桥属后续动作 | 排权限/无工具/超时与误无身份建议 | 插件不修改密钥故无自有回滚；读者后续授权恢复成本未知 |



#### 效果

| 目标 | 增量 | 限制 |
| --- | --- | --- |
| 聚合排查 | socket/数量/常见桥一处 | 存在不等可用，失败混淆 |
| 减key内容披露 | 成功不回ssh-add完整stdout，不读私钥 | 路径/存在/异常仍敏感 |
| 引导SSH/HTTPS分工 | 明文提示 | 非认证/权限验收 |

源码没有替用户加载key/转发/SSH登录，不把建议当执行；真实诊断准确率和省时未对照。本轮不调用ssh-add、私钥目录或Windows桥。

> **思考**：sockAlive仅exists、key文件仅名字，ssh-add失败变0并丢ok/code且render漏detail，易把错误当无身份；直接exec不接signal/config，ok非目标授权。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将socket/身份数量和常见桥痕迹聚合为只读提示，正常结果不回key指纹正文、不读私钥内容，区分SSH/HTTPS。详见[Q02](#research-q02)。

将socket/身份数量和常见桥痕迹聚合为只读提示，正常结果不回key指纹正文、不读私钥内容，区分SSH/HTTPS。详见[Q02](#research-q02)。

sockAlive只是exists(sock)，未stat.isSocket/连接验证；普通文件、失效socket节点也可被说成live socket。hasPrivateKeys仅文件名模式，不读格式/类型/权限，名匹配目录也可能true，自定义key文件名会漏；目录不可读catch false，不能等同确无私钥。桥exists也不证明可执行/版本/Windows服务可用。

ssh-add失败或超时统一keyCount0，execute丢list.ok/code，仅保detail；buildAdvice遇sockAlive+0就说“shows no identities”并建议ssh-add，实际可能是权限/工具不存在/超时。formatter不展示sshAddDetail或顶层error，读者更难看见失败原因。ok=false既可能无agent也可能未授权查询，不能做根因结论。

命令经child_process直接运行而非host subprocess/sandboxPolicy，按PATH找ssh-add并继承当前环境。配置timeoutMs默认15s只作用外工具，core_config未用，内层固定5s且无exec.signal；取消/配置更短不保证同步停进程。无并发总上限，工具标并发安全意味着多个查询可同时发生。指导中的socat桥能让WSL利用Windows agent签名能力，但本插件没有建立/授权该桥，读者应另审可访问者而非盲复制。

<a id="detail-section-5"></a>

### 1.4 主要限制

sockAlive仅exists、key文件仅名字，ssh-add失败变0并丢ok/code且render漏detail，易把错误当无身份；直接exec不接signal/config，ok非目标授权。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，可信个人WSL只读提示，明确存在/身份不等认证；共享桥授权/强治理先观察。详见[Q05](#research-q05)。

合格结果需分清socket路径存在、agent可通信、有身份、目标仓库授权四层。ok只sockAlive && keyCount>0，不证明GitHub接受该key、目标repo权限或实际SSH网络成功。基线手查env/ssh-add/目录名，增量聚合小范围元数据和“不粘贴私钥”提醒。

采用建议：有试用，可信个人WSL只读提示，明确存在/身份不等认证；共享桥授权/强治理先观察。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。只读元数据与正常输出减量明确，live/empty/认证语义必须分开，错误可见/进程治理需核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/ssh-agent.js、lib/wsl-host.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：三运行JS/包，重点真实读取与ssh-add路径；不调用agent/列真实.ssh/读取私钥/建立桥或运行目标测试。
- 下一步：可继续合成socket类型/退出码/失败/取消mock核分层标签和建议，避免触碰真实凭据或agent。

**分析版本**

- **仓库**：[173787247/dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent)
- **版本号**：0.2.0（[固定提交 9971638](https://github.com/173787247/dsh-wsl-ssh-agent/tree/99716388c9fa204b53bb6e931a239810d4524a0b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索分层socket/查询退出/身份与时点收据，最小化内容并统一host预算，比较误建议/披露；未实现。详见[Q05](#research-q05)。

可继续合成socket类型/退出码/失败/取消mock核分层标签和建议，避免触碰真实凭据或agent。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 104 | — | — | 616 |
| .js | source | 3 | 247 | 221 | 4 | — |
| .js | test | 1 | 39 | 35 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent/issues?q=is%3Aissue+created%3A2026-09-22T09%3A34%3A55.208Z..2026-10-22T09%3A34%3A55.208Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A34%3A55.208Z..2026-10-22T09%3A34%3A55.208Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核socket/身份/认证四层区别、密钥减量/真实读取、失败/进程预算与转发授权、成本及采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么SSH故障，ok能证明Git认证吗？

**研究主题**：场景与需求

#### 完整回答

面向WSL内DSH做Git SSH失败、需要知道当前host进程有无SSH_AUTH_SOCK、agent身份数量和常见Windows桥安装痕迹的用户。ssh_agent_hint是诊断/文字建议，不启动agent/桥、不加载私钥、不执行ssh -T或Git推送，也不读密钥文件正文。

合格结果需分清socket路径存在、agent可通信、有身份、目标仓库授权四层。ok只sockAlive && keyCount>0，不证明GitHub接受该key、目标repo权限或实际SSH网络成功。基线手查env/ssh-add/目录名，增量聚合小范围元数据和“不粘贴私钥”提醒。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/README.md#L5-L13)

作者提示/无key正文定位。

```text
DeepSeek Harness plugin: Hint how to forward the Windows OpenSSH agent into WSL without dumping secrets.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Diagnoses the WSL SSH agent socket and the npiperelay bridge. It does not print key material.
```

**依据 2 · 源码核查**：[lib/ssh-agent.js:114-144](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L114-L144)

实际汇总/ok。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检查范围和隐私减量如何实现？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply一次detectWsl，非WSL返回错误；执行读取当前process.env的socket路径，exists检查，再从homedir/.ssh列名字，匹配id_ed25519/id_rsa/id_ecdsa或.pem判hasPrivateKeys。候选npiperelay来自NPIPERELAY、两固定路径及PATH推用户scoop/go路径，仅exists不启动它。

唯一活动命令是node execFile ssh-add固定[-l]，5秒超时，成功stdout计非空行数，常规结果只保存“n identities”而不返回指纹/注释全文。建议按sock/数量/桥路径输出，并区分HTTPS认证另查cred_hint。无网络认证请求/文件写/模型API，静态命令建议不是实际自动执行。

贡献是元数据减量的聚合诊断/提示和宿主入口，非新的SSH转发/密钥管理技术。路径/用户名/密钥存在布尔与异常detail仍是身份元数据，会进宿主模型上下文，不能称没有敏感面。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:7-30](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/index.js#L7-L30)

环境门/入口。

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

**依据 2 · 源码核查**：[lib/ssh-agent.js:30-55](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L30-L55)

桥候选/文件名扫描。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:59-73](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L59-L73)

固定ssh-add与成功减量。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/ssh-agent.js:84-110](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L84-L110)

仅建议文字。

<details>
<summary>查看原文（27行）</summary>

```text
  const tips = [
    "Do not paste private keys into chat.",
  ];
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 诊断状态、错误与进程治理有何不足？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

sockAlive只是exists(sock)，未stat.isSocket/连接验证；普通文件、失效socket节点也可被说成live socket。hasPrivateKeys仅文件名模式，不读格式/类型/权限，名匹配目录也可能true，自定义key文件名会漏；目录不可读catch false，不能等同确无私钥。桥exists也不证明可执行/版本/Windows服务可用。

ssh-add失败或超时统一keyCount0，execute丢list.ok/code，仅保detail；buildAdvice遇sockAlive+0就说“shows no identities”并建议ssh-add，实际可能是权限/工具不存在/超时。formatter不展示sshAddDetail或顶层error，读者更难看见失败原因。ok=false既可能无agent也可能未授权查询，不能做根因结论。

命令经child_process直接运行而非host subprocess/sandboxPolicy，按PATH找ssh-add并继承当前环境。配置timeoutMs默认15s只作用外工具，core_config未用，内层固定5s且无exec.signal；取消/配置更短不保证同步停进程。无并发总上限，工具标并发安全意味着多个查询可同时发生。指导中的socat桥能让WSL利用Windows agent签名能力，但本插件没有建立/授权该桥，读者应另审可访问者而非盲复制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh-agent.js:48-55](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L48-L55)

文件名/失败混淆。

```text
export function hasSshPrivateKeys({ home = homedir(), exists = existsSync, readdir = readdirSync } = {}) {
  const dir = `${home}/.ssh`.replace(/\\/g, "/");
  if (!exists(dir)) return false;
  try {
    const names = readdir(dir);
    return names.some((n) => n === "id_ed25519" || n === "id_rsa" || n === "id_ecdsa" || /\.pem$/i.test(n));
  } catch {
    return false;
```

**依据 2 · 源码核查**：[lib/ssh-agent.js:59-73](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L59-L73)

错误/code/固定预算。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:87-106](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L87-L106)

live/noidentity/桥建议。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/ssh-agent.js:114-143](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L114-L143)

exists与丢list.ok/code。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/ssh-agent.js:20-26](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L20-L26)

formatter漏detail/error。

```text
export function format(v) {
  const lines = [`ssh_agent_hint ok=${v.ok} SSH_AUTH_SOCK=${v.sock || "(unset)"}`];
  if (v.sockAlive != null) lines.push(`sockAlive: ${v.sockAlive}`);
  if (v.keyCount != null) lines.push(`sshAddKeys: ${v.keyCount}`);
  if (v.hasPrivateKeys != null) lines.push(`hasPrivateKeysInHome: ${v.hasPrivateKeys}`);
  if (v.npiperelay != null) lines.push(`npiperelay: ${v.npiperelay}`);
  for (const a of v.advice || []) lines.push(`- ${a}`);
```

**依据 6 · 源码核查**：[index.js:26-30](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/index.js#L26-L30)

外预算无signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

#### 缺口

- socket存在但不可通信、ssh-add各退出状态和取消后的进程/诊断表现未模拟。
  **影响**：不保证live/noidentity标签准确或总预算/即时取消。
  **进一步探讨**：mock文件类型与退出码/超时/无工具，区分missing/existing/unreachable/empty/loaded，核signal传递，不读真实SSH目录或调用agent。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动流程和首次持续恢复成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| WSL/Node>=18与DSH tools/systemPrompt | 启用工具/指引 | apply环境缓存，包无精确host peer |
| 可信PATH内ssh-add与当前agent env | 查询身份数量 | 不证明目标host授权，不接远端workspace环境 |
| .ssh目录可列名 | 名称启发式 | 不读正文/不保证所有key发现 |
| npiperelay/Windows agent | 可选转发建议 | 仅查存在，未创建桥 |
| 元数据披露许可 | 路径/数量/错误入上下文 | 不粘私钥不等无隐私 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核WSL/服务/PATH | 不先更改agent/添加key |
| 查看 | 分别看socket存在/数量/桥 | live只是exists，0不一定无身份 |
| 追因 | 查结构错误/实际权限与进程 | 当前render漏detail，需更细状态 |
| 决策 | 必要时读者审核转发/授权范围 | 提示文本不等用户授权建立桥 |
| 维护 | env/socket变化重新核当前host | 不把cachedWSL/本机home当所有会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包/既有SSH工具，桥如需另装 | 核互操作/PATH/agent与元数据范围 | 工时/费用未知 |
| 持续使用 | 每次列名/exists与ssh-add进程、工具结果上下文 | 解释状态与审权限 | 无独立网络/模型调用不等总token费0，实际延迟未知 |
| 失败恢复 | 重试查询、清失效socket/桥属后续动作 | 排权限/无工具/超时与误无身份建议 | 插件不修改密钥故无自有回滚；读者后续授权恢复成本未知 |

#### 效果

| 目标 | 增量 | 限制 |
| --- | --- | --- |
| 聚合排查 | socket/数量/常见桥一处 | 存在不等可用，失败混淆 |
| 减key内容披露 | 成功不回ssh-add完整stdout，不读私钥 | 路径/存在/异常仍敏感 |
| 引导SSH/HTTPS分工 | 明文提示 | 非认证/权限验收 |

源码没有替用户加载key/转发/SSH登录，不把建议当执行；真实诊断准确率和省时未对照。本轮不调用ssh-add、私钥目录或Windows桥。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-22](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/package.json#L14-L22)

Node/包。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/*.test.js"
  },
  "files": [
```

**依据 2 · 源码核查**：[lib/ssh-agent.js:59-73](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L59-L73)

进程/减量。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:99-110](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L99-L110)

后续建议非动作。

<details>
<summary>查看原文（12行）</summary>

```text
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

#### 缺口

- 与人工排查的正确归因率/时间/上下文披露成本没有比较。
  **影响**：不能量化更安全或省时。
  **进一步探讨**：用合成socket/目录/进程stub矩阵标真实状态，对照误建议和人工步骤，不访问真实凭据。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐与继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。可信个人WSL下当只读元数据提示有用，不读key正文/不建立桥，常规成功身份数量也做减量；先了解live/hasPrivateKeys只是词法/存在启发。需强诊断、共享主机转发授权或严格取消治理先观察，不因ok就认为SSH/Git权限验收。

由exists当live、失败0当无身份推导“分层agent状态收据”。分别标路径不存在/非socket/存在未连接、查询退出码/错误/超时、empty/loaded与检查时点；不回指纹/注释，必要信息最小化。query通过host seam统一signal/预算，建议只在已知状态给动作，Windows桥权限另列需读者决定。

未实现。反例是agent列出key不证明目标repo接受，或硬件key需交互才可签名；即使新收据loaded仍不能升格authenticated。最小对照含普通文件socket路径、过期节点、目录不可读/自定义key、ssh-add退出1/2/超时、PATH无工具、取消/多并发。若仍错标live/empty或把失败隐藏成操作建议，假设被反证；若增加查询/披露而不降误建议，收益不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/ssh-agent.js:114-143](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L114-L143)

分层状态基线。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/ssh-agent.js:59-73](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L59-L73)

错误与预算基线。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/ssh-agent.js:87-106](https://github.com/173787247/dsh-wsl-ssh-agent/blob/99716388c9fa204b53bb6e931a239810d4524a0b/lib/ssh-agent.js#L87-L106)

条件建议基线。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

#### 缺口

- 分层agent状态与宿主预算方案未实现。
  **影响**：不计当前准确/治理优势。
  **进一步探讨**：合成最小文件/进程stub对照标签/错误可见和披露，不接真实agent或加载key。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
