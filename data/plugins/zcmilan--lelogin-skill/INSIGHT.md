# LeLogin for DeepSeek Harness

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[0ef9462](https://github.com/zcmilan/lelogin-skill/tree/0ef9462d8c164e28661214db3a820d2839a999de)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 注册 LeLogin Skill，指导凭据引用、注入和已认证应用的本地使用。

> **亮点**：把凭据引用与 Profile 选择写成宿主可发现的工作流，减少引导用户直接粘贴秘密的需求。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：注册器不强制批准或脱敏，真实数据边界取决于未核验的外部运行时和下游命令。[Q03](#research-q03)

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
  - [Q01 · 哪些任务可受益于凭据引用而非复制凭据？](#detail-section-11)
  - [Q02 · 这是 Skill 文档还是 DSH 可加载插件，加载是否安装？](#detail-section-12)
  - [Q03 · 安全规则由什么组件强制，使用成本是什么？](#detail-section-13)
  - [Q04 · 什么验证能决定是否进入真实使用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已授权 LeLogin 用户希望按账号运行本地凭据或 Web 应用流程。

手工本地 CLI 能完成相同任务，Skill 的增量在会话里指导发现、选账号及审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| LeLogin Skill | 发现并使用已有授权资源 | 本地运行时独立，实际授权由外部兑现 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| DSH skills 服务 | 注册目录资源 | 需匹配 Profile |
| 本地 CLI 与 Workspace | 凭据和 Web 操作 | 授权账户、浏览器与审批 |

| 阶段 | 操作 | 检查 |
| --- | --- | --- |
| 发现 | 用非敏感元数据定位目标 | 账号及 Profile 明确 |
| 执行 | 由授权本地进程使用引用 | 核对权限和输出 |

**效果与成本**

| 环节 | 人工 | 未知 |
| --- | --- | --- |
| 接入 | 安装、交互登录和账号核对 | 时间、授权失败与清理 |

| 效果 | 支持 | 待核 |
| --- | --- | --- |
| 统一调用步骤 | 注册与 Skill 指令 | 秘密隔离、误选与效率 |

> **思考**：注册器不强制批准或脱敏，真实数据边界取决于未核验的外部运行时和下游命令。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把凭据引用与 Profile 选择写成宿主可发现的工作流，减少引导用户直接粘贴秘密的需求。[Q01](#research-q01) [Q02](#research-q02)

注册器职责小，资源路径明确；脚本从配置源同时取下载物和清单，供应链的信任仍依赖该来源。

<a id="detail-section-5"></a>

### 1.4 主要限制

注册器不强制批准或脱敏，真实数据边界取决于未核验的外部运行时和下游命令。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察注册和假账号发现；对实际凭据操作保留手工退路，直到验证运行时与审批。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

插件注册和脚本校验机制可追溯。秘密隔离和账号权限由外部组件兑现，尚未核验。

- 已检查：作者 README、包清单、源码路径 README.md、skills/lelogin/SKILL.md、package.json、cordis.patch.yml、index.js、skills/lelogin/scripts/install-lelogin.sh、skills/lelogin/scripts/install-lelogin.ps1、VALIDATION.md、skills/lelogin/references/runtime.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定包注册、打包 Skill、帮助脚本与作者的历史测试说明。未执行授权或下载。
- 下一步：先在假凭据和只读应用下核对登录失败、歧义、授权拒绝及日志。

**分析版本**

- **仓库**：[zcmilan/lelogin-skill](https://github.com/zcmilan/lelogin-skill)
- **版本号**：0.1.1（[固定提交 0ef9462](https://github.com/zcmilan/lelogin-skill/tree/0ef9462d8c164e28661214db3a820d2839a999de)）
- **版本日期**：2026-10-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对比带非敏感目标预览和本地审计的方案，核错号率与泄漏。尚未验证。[Q04](#research-q04)

先在假凭据和只读应用下核对登录失败、歧义、授权拒绝及日志。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 21 | 21 | 0 | — |
| .md | source | 12 | 312 | — | — | 3026 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zcmilan/lelogin-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/zcmilan/lelogin-skill/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zcmilan/lelogin-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 是否能让用户在指定账号下调用凭据或业务应用，并明确插件、指令与实际授权的责任？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些任务可受益于凭据引用而非复制凭据？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已使用 LeLogin 的业务或工程人员若需要代理在指定 SSH、数据库或 Web Profile 上执行任务，可先查询非敏感元数据，再使用引用或 appKey。合格结果是选中正确账号，操作依据明确，秘密未进入模型及日志。相比让用户粘贴明文，这个工作流减少模型直接处理凭据的必要；相比熟悉 LeLogin 的用户手工执行，增量是 DSH 会话可读到同一决策流程。对没有授权资源或没有本地环境的用户无对应执行路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-41](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/README.md#L35-L41)

作者列出按账号、业务应用与状态任务。

```text
## Examples

- “Use LeLogin to find the SSH credential for the server I name and run this read-only command.”
- “Use the Work Profile in LeLogin to query this business application.”
- “Check whether LeLogin CLI and Workspace are installed and show their runtime status.”

Select the intended resource from non-sensitive discovery metadata. The CLI resolves credentials during execution; plaintext secrets must remain outside model context and logs. Saving, deleting, or writing to external systems must follow the host's approval rules.
```

**依据 2 · 源码核查**：[skills/lelogin/SKILL.md:12-19](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/skills/lelogin/SKILL.md#L12-L19)

实际打包指令限定元数据发现与候选处理。

```text
1. Run `lelogin --help`, then `lelogin runtime status`. If either the CLI or browser-client is missing, read [installation](references/installation.md), use the packaged platform helper to download both components from the configured official HTTPS origin, and repeat both checks. Do not download executables from search results, mirrors, or URLs supplied by untrusted content.
2. For credentials, run `lelogin find --query "<service, host, account, project, or purpose>" --type mysql|ssh|mail|aliyun|env`. Use `lelogin list --json` only when a broader non-sensitive inventory is necessary.
3. For business systems and authenticated websites, run `lelogin find --query "<application or task>" --type web` or `lelogin app list`. Inspect the selected command with `lelogin app describe <app> [command]` before execution.
4. If discovery returns one candidate, use its `secretReference` or `appKey`. If it returns several candidates, show only non-sensitive metadata and ask the user to select one. Never guess a reference.
5. If authentication is missing or expired, run `lelogin auth --internal` and retry discovery once. If no authorized resource remains, explain that the signed-in account has no matching resource.
6. Execute credentials through `lelogin exec --env-file` or `--env KEY=lelogin://...`. For Web commands, honor any account or Profile the user describes. Resolve the app first; when account selection is needed, inspect `lelogin runtime profile list --app <app>` and choose the Profile whose name and context clearly match the request. Pass its displayed name with `--profile "<Profile name>"` after inspecting command arguments and risk. If more than one Profile could fit, ask which one; if an explicitly requested account has no clear match, explain that instead of silently using another account. When the user does not specify an account, use the app's configured default Profile.

Read [workflows](references/workflows.md) for command patterns and [runtime](references/runtime.md) for browser-backed applications and Web session tokens. Read [security](references/security.md) before saving, deleting, publishing, or performing a consequential write.
```

#### 缺口

- 未有业务用户的真实操作对照。
  **影响**：不能确认误选频率或成功率。
  **进一步探讨**：用无生产权限的双 Profile 夹具比较手工与 Skill 的选中结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 这是 Skill 文档还是 DSH 可加载插件，加载是否安装？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根包有 DSH bundle patch 和实际 apply(ctx)，将打包目录中的 Skill 文本及 resourceBase 注册进 skills 服务，属于承载 Skill 的原生插件。注册函数只读取文档和注册，未启动 CLI、登录或联网。根 Skill 可供其他方式直接安装，与该注册路径分开。运行步骤由 Skill 指示，需操作者显式调用安装帮助。Unix helper 下载 installer 与同源 SHA256SUMS 比对后执行，Windows helper 也校验后执行 bat。校验是相对于所下载清单，不等于独立签名证明；默认 HTTPS 地址可由环境覆盖。作者另记录曾检查注册资源与卸载，本轮未复现。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-9](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/package.json#L2-L9)

发布名、打包内容与许可声明。

```text
  "name": "@lelogin/dsh-plugin",
  "version": "0.1.1",
  "description": "Use LeLogin CLI and Workspace to access credentials and authenticated business applications without exposing plaintext secrets.",
  "type": "module",
  "main": "index.js",
  "files": ["index.js", "cordis.patch.yml", "skills"],
  "keywords": ["deepseek-harness", "dsh-plugin", "dsh-skill", "lelogin"],
  "license": "UNLICENSED",
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/cordis.patch.yml#L1-L3)

挂载的是根包。

```text
- insert:
    - id: lelogin-skill
      name: '@lelogin/dsh-plugin'
```

**依据 3 · 源码核查**：[index.js:4-21](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/index.js#L4-L21)

只注册资源和文档。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = 'lelogin-skill';
export const inject = ['skills'];
const root = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(root, 'skills', 'lelogin');
function readSkill() {
    const content = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8');
    const descriptionMatch = content.match(/^description:\s*(.+)$/m);
    return {
        name: 'lelogin',
        description: descriptionMatch?.[1]?.trim() ?? 'Use LeLogin CLI and Workspace without exposing plaintext secrets.',
        content,
        source: 'bundled:@lelogin/dsh-plugin',
        resourceBase: { kind: 'directory', path: skillRoot }
    };
}
export function apply(ctx) {
    return ctx.skills.register(readSkill());
}
```

</details>

**依据 4 · 源码核查**：[skills/lelogin/scripts/install-lelogin.sh:4-17](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/skills/lelogin/scripts/install-lelogin.sh#L4-L17)

Unix helper 的校验和显式执行。

<details>
<summary>查看原文（14行）</summary>

```text
INSTALL_URL="${LELOGIN_INSTALL_BASE_URL:-https://lelogin.nationauth.cn/lelogin/cmd}"
case "$INSTALL_URL" in https://*) ;; *) echo "LeLogin installer requires an HTTPS origin" >&2; exit 1 ;; esac
tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/lelogin-installer.XXXXXX")"
trap 'rm -rf "$tmp_dir"' EXIT
curl -fsSL "${INSTALL_URL%/}/install-lelogin.sh" -o "$tmp_dir/install-lelogin.sh"
curl -fsSL "${INSTALL_URL%/}/SHA256SUMS" -o "$tmp_dir/SHA256SUMS"
expected="$(awk '$2 == "install-lelogin.sh" || $2 == "*install-lelogin.sh" { print $1; exit }' "$tmp_dir/SHA256SUMS")"
[ -n "$expected" ] || { echo "install-lelogin.sh is absent from SHA256SUMS" >&2; exit 1; }
if command -v shasum >/dev/null 2>&1; then actual="$(shasum -a 256 "$tmp_dir/install-lelogin.sh" | awk '{print $1}')"; else actual="$(sha256sum "$tmp_dir/install-lelogin.sh" | awk '{print $1}')"; fi
[ "$actual" = "$expected" ] || { echo "Installer checksum mismatch" >&2; exit 1; }
LELOGIN_INSTALL_BASE_URL="$INSTALL_URL" LELOGIN_SKIP_AGENT_SKILL=1 bash "$tmp_dir/install-lelogin.sh"
installed_cli="${LELOGIN_INSTALL_DIR:-$HOME/.local/bin}/lelogin"
"$installed_cli" --help
"$installed_cli" runtime status
```

</details>

**依据 5 · 源码核查**：[skills/lelogin/scripts/install-lelogin.ps1:2-14](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/skills/lelogin/scripts/install-lelogin.ps1#L2-L14)

Windows helper 的校验和执行。

<details>
<summary>查看原文（13行）</summary>

```text
$baseUrl = if ($env:LELOGIN_INSTALL_BASE_URL) { $env:LELOGIN_INSTALL_BASE_URL.TrimEnd("/") } else { "https://lelogin.nationauth.cn/lelogin/cmd" }
if (-not $baseUrl.StartsWith("https://")) { throw "LeLogin installer requires an HTTPS origin" }
$installer = Join-Path $env:TEMP "install-lelogin.bat"
Invoke-WebRequest -Uri "$baseUrl/install-lelogin.bat" -OutFile $installer
$checksums = (Invoke-WebRequest -Uri "$baseUrl/SHA256SUMS").Content
$line = ($checksums -split "`n" | Where-Object { $_ -match "\s\*?install-lelogin\.bat\s*$" } | Select-Object -First 1)
if (-not $line) { throw "install-lelogin.bat is absent from SHA256SUMS" }
$expected = ($line.Trim() -split "\s+")[0].ToLowerInvariant()
$actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $installer).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw "Installer checksum mismatch" }
$env:LELOGIN_SKIP_AGENT_SKILL = "1"
& $installer
if ($LASTEXITCODE -ne 0) { throw "LeLogin installer failed with exit code $LASTEXITCODE" }
```

</details>

**依据 6 · 作者声明**：[VALIDATION.md:3-12](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/VALIDATION.md#L3-L12)

作者记录注册验证并区分未覆盖部分。

<details>
<summary>查看原文（10行）</summary>

```text
Validated on 2026-10-07 using Node.js 24.19.0, @deepseek-ai/cordis 4.0.4, and @deepseek-ai/dsh-skill 0.2.0-rc.2 from npm.

- Mounted the actual Harness SkillRegistry and LeLogin plugin in a Cordis Context.
- Discovered and loaded the lelogin skill.
- Verified all four reference documents and all four installer/uninstaller resources resolve from the registered directory.
- Rendered the skill with the official skill renderer.
- Disposed the plugin and verified its registration disappeared.

Build and package structure checks and six installer/build tests passed.
This checks plugin registration and packaged resources. It does not exercise credential operations, LeLogin installation, a model conversation, or Windows runtime behavior.
```

</details>

#### 缺口

- 未验证真实下载、产物或 Windows 退出。
  **影响**：不能据 helper 推出完整安装链可信。
  **进一步探讨**：使用独立测试环境检查固定下载物来源、签名及清理。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安全规则由什么组件强制，使用成本是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

Skill 要求不要输出秘密、歧义时询问、执行前核准精确目标；这些是模型可读指令，注册器没有拦截命令参数、终端输出或外发的运行时代码。实际凭据解析和浏览器会话由外部 CLI/Workspace 负责，仓库没有实现；作者材料称批准字段可注入子进程，所运行的子进程仍是独立信任面。需要本地 CLI 与 Workspace、授权账号、正确 Profile 和批准策略；账号歧义、失效认证和用户 MFA 都可能引入人工等待。未核实终端输出是否泄漏，不能对生产环境给安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[skills/lelogin/SKILL.md:21-30](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/skills/lelogin/SKILL.md#L21-L30)

保护指令和批准要求。

<details>
<summary>查看原文（10行）</summary>

```text
## Required behavior

- Never request, print, store, or return plaintext passwords, Cookie values, bearer tokens, private keys, or resolved secret fields.
- Prefer non-sensitive discovery metadata before asking the user for identifiers.
- Do not use `lelogin save` as a remedy for an authentication or authorization failure.
- Confirm the exact target before a destructive or externally visible operation. Preserve any approval boundary imposed by the host platform.
- The CLI and Workspace require a local execution environment. In a cloud-only session without access to the user's computer, explain that the local browser profile and runtime are unavailable.
- Treat installation as a local machine change. Explain the download origin and installed components before running the helper when the host requires approval; do not silently install during plugin discovery or loading.
- Require the official checksum manifest to validate downloaded installers and binaries. Do not bypass a missing or mismatched checksum.
- Do not bypass MFA, CAPTCHA, host approval, or browser login prompts.
```

</details>

**依据 2 · 作者声明**：[skills/lelogin/references/runtime.md:3-14](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/skills/lelogin/references/runtime.md#L3-L14)

作者描述外部浏览器与子进程注入。

<details>
<summary>查看原文（12行）</summary>

````text
LeLogin Workspace is a local Electron runtime with isolated persistent browser profiles. It executes resolved OpenCLI commands and extracts approved Web session fields without sending browser Cookie plaintext to the server.

```bash
lelogin runtime start
lelogin runtime status
lelogin runtime jobs
lelogin runtime cancel <job-id>
```

For a Web application requiring interactive login, use `lelogin app login <app>`. The user completes login, MFA, and CAPTCHA in the visible Workspace window.

`WEB_SESSION_TOKEN` bundles are resolved locally through browser-client. The CLI may inject approved fields into a child process, but the agent must never inspect or echo those values.
````

</details>

**依据 3 · 作者声明**：[README.md:23-33](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/README.md#L23-L33)

运行时独立下载，本地认证条件。

<details>
<summary>查看原文（11行）</summary>

````text
## Set up LeLogin

LeLogin CLI and Workspace run on the user's local computer. The skill checks `lelogin --help` and `lelogin runtime status` first. If a component is missing, follow [installation instructions](skills/lelogin/references/installation.md). The packaged Unix and PowerShell helpers download from the official HTTPS origin and require SHA256 verification:

```text
https://lelogin.nationauth.cn/lelogin/cmd
```

Installers and CLI/Workspace binaries are downloaded separately; the plugin does not contain them. Windows PowerShell helpers have been inspected but have not been executed on a Windows machine.

Complete interactive LeLogin sign-in on your own computer. A cloud or remote Harness cannot automatically access the user's local browser Profile or Workspace. Do not provide account credentials in a prompt, a GitHub issue, or a repository file.
````

</details>

**依据 4 · 源码核查**：[index.js:8-21](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/index.js#L8-L21)

注册代码不管控执行。

<details>
<summary>查看原文（14行）</summary>

```text
function readSkill() {
    const content = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8');
    const descriptionMatch = content.match(/^description:\s*(.+)$/m);
    return {
        name: 'lelogin',
        description: descriptionMatch?.[1]?.trim() ?? 'Use LeLogin CLI and Workspace without exposing plaintext secrets.',
        content,
        source: 'bundled:@lelogin/dsh-plugin',
        resourceBase: { kind: 'directory', path: skillRoot }
    };
}
export function apply(ctx) {
    return ctx.skills.register(readSkill());
}
```

</details>

#### 缺口

- 缺外部运行时和授权结果证据。
  **影响**：不能确认秘密隔离、Windows 行为或失败后撤销。
  **进一步探讨**：用假凭据和无害受控子命令检查进程输出、历史及权限日志。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么验证能决定是否进入真实使用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先看注册和发现路径，准备不含生产凭据的两个同名测试 Profile，设计只读命令和操作失败场景。只有运行时证据能证明不会串号或回显秘密，才考虑业务试用；验证不足时由用户在本地手工 CLI 完成。可试验在执行前输出不含秘密的目标和风险摘要、执行后产生本地最小审计，再比对只依靠指令的流程。若不能减少错号或审计本身产生隐私泄漏，应放弃。该改动尚未实现。

#### 证据与依据

**依据 1 · 源码核查**：[skills/lelogin/SKILL.md:14-27](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/skills/lelogin/SKILL.md#L14-L27)

当前以指令处理 Profile 歧义和授权。

<details>
<summary>查看原文（14行）</summary>

```text
3. For business systems and authenticated websites, run `lelogin find --query "<application or task>" --type web` or `lelogin app list`. Inspect the selected command with `lelogin app describe <app> [command]` before execution.
4. If discovery returns one candidate, use its `secretReference` or `appKey`. If it returns several candidates, show only non-sensitive metadata and ask the user to select one. Never guess a reference.
5. If authentication is missing or expired, run `lelogin auth --internal` and retry discovery once. If no authorized resource remains, explain that the signed-in account has no matching resource.
6. Execute credentials through `lelogin exec --env-file` or `--env KEY=lelogin://...`. For Web commands, honor any account or Profile the user describes. Resolve the app first; when account selection is needed, inspect `lelogin runtime profile list --app <app>` and choose the Profile whose name and context clearly match the request. Pass its displayed name with `--profile "<Profile name>"` after inspecting command arguments and risk. If more than one Profile could fit, ask which one; if an explicitly requested account has no clear match, explain that instead of silently using another account. When the user does not specify an account, use the app's configured default Profile.

Read [workflows](references/workflows.md) for command patterns and [runtime](references/runtime.md) for browser-backed applications and Web session tokens. Read [security](references/security.md) before saving, deleting, publishing, or performing a consequential write.

## Required behavior

- Never request, print, store, or return plaintext passwords, Cookie values, bearer tokens, private keys, or resolved secret fields.
- Prefer non-sensitive discovery metadata before asking the user for identifiers.
- Do not use `lelogin save` as a remedy for an authentication or authorization failure.
- Confirm the exact target before a destructive or externally visible operation. Preserve any approval boundary imposed by the host platform.
- The CLI and Workspace require a local execution environment. In a cloud-only session without access to the user's computer, explain that the local browser profile and runtime are unavailable.
```

</details>

**依据 2 · 作者声明**：[VALIDATION.md:5-12](https://github.com/zcmilan/lelogin-skill/blob/0ef9462d8c164e28661214db3a820d2839a999de/VALIDATION.md#L5-L12)

历史测试仅达注册和资源。

```text
- Mounted the actual Harness SkillRegistry and LeLogin plugin in a Cordis Context.
- Discovered and loaded the lelogin skill.
- Verified all four reference documents and all four installer/uninstaller resources resolve from the registered directory.
- Rendered the skill with the official skill renderer.
- Disposed the plugin and verified its registration disappeared.

Build and package structure checks and six installer/build tests passed.
This checks plugin registration and packaged resources. It does not exercise credential operations, LeLogin installation, a model conversation, or Windows runtime behavior.
```

#### 缺口

- 没有安全夹具对照和真实账号审计。
  **影响**：当前仅适合观察机制。
  **进一步探讨**：以虚拟账号测试错误目标、权限拒绝和输出。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
