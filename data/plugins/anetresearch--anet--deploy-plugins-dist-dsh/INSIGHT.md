# ANet DSH bundle

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d03c528](https://github.com/ANetResearch/ANet/tree/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)
<!-- END META -->

> **实现功能**：把 ANet 节点、身份与 MCP 工具及操作 Skill 接入 DSH。

> **核心亮点**：贡献是把二进制、身份与MCP/Skill入口统一到宿主bundle，减少多个入口各用不同配置的错误；网络协议、节点能力归属ANet上游，不能计为DSH适配原创。[Q01](#research-q01)

> **风险与缺陷**：启用bundle可能触发下载、执行安装器、启动节点并加入公共hub，接入便利与副作用扩大同时存在；固定插件提交并不固定届时下载的远端安装器。[Q03](#research-q03)

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
  - [Q01 · DSH组件相对手配MCP增加什么？](#detail-section-11)
  - [Q02 · 设置如何进入MCP和Skill且在停用时恢复？](#detail-section-12)
  - [Q03 · 自动安装的便利改变哪些信任和副作用边界？](#detail-section-13)
  - [Q04 · 为什么当前建议观察而非普遍试用？](#detail-section-14)
  - [Q05 · 安装预检与网络加入分离能否降低误启动？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要在DSH会话使用ANet节点与网络服务的用户；合格结果是同一身份、同一二进制下完成明确网络任务并核对结果。

手工安装anet再配置MCP能完成同样网络能力，但需要分别维护身份、路径和Skill；bundle主要减少配置分歧。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP接入 | 从DSH调用ANet | 需核心二进制和网络身份 |
| 操作Skill | 引导安装与状态核对 | registry缺失时不影响MCP |
| 自动安装启动器 | 缺失核心时准备运行环境 | 会执行远端安装器，可关闭 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client | MCP必需 | stdio连接anet | 无法提供网络工具 |
| ANet二进制与身份 | 任务必需 | 启动节点并访问网络 | 指定错误路径报错，不安装其他副本 |
| 外网与官方安装器 | 自动安装必需 | 下载核心程序 | 可设NO_INSTALL并预装 |
| skills registry | Skill可选 | 注册操作说明 | MCP仍可独立工作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户预检安装器、二进制和身份；按需关闭自动安装 | resolve显示预期路径 |
| 2 | 加载bundle并连接MCP | stderr诊断与协议stdout分离 |
| 3 | 用只读状态Skill核对节点和身份 | 确认后才进行有副作用网络操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 下载与本地节点资源，金额未知 | 核查安装、身份和网络加入 | 自动安装等待可达15分钟上限，不是实测耗时 |
| 持续使用 | 节点网络、模型及可能外部服务费未知 | 管理身份和节点生命周期 | 不推断协议任务免费 |
| 失败恢复 | 安装日志、锁与重连资源 | 核查原安装与状态后恢复 | 不应反复启动未知安装 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置一致 | MCP与Skill共享路径身份 | 实际网络任务成功率 |
| 自动安装 | 锁、超时、stderr路径存在 | 远端安装器与各平台真实行为 |

> **思考**：启用bundle可能触发下载、执行安装器、启动节点并加入公共hub，接入便利与副作用扩大同时存在；固定插件提交并不固定届时下载的远端安装器。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：贡献是把二进制、身份与MCP/Skill入口统一到宿主bundle，减少多个入口各用不同配置的错误；网络协议、节点能力归属ANet上游，不能计为DSH适配原创。[Q01](#research-q01)

贡献是把二进制、身份与MCP/Skill入口统一到宿主bundle，减少多个入口各用不同配置的错误；网络协议、节点能力归属ANet上游，不能计为DSH适配原创。[Q01](#research-q01)

设置键封闭校验和按值恢复环境避免覆盖后来的写入者，是小型宿主适配可借鉴的所有权设计。安装器将stdout留给MCP并滤掉相对PATH，降低工作区命令劫持面；仍需信任远端脚本和签名链，未完成全供应链审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

启用bundle可能触发下载、执行安装器、启动节点并加入公共hub，接入便利与副作用扩大同时存在；固定插件提交并不固定届时下载的远端安装器。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；先手工预装并明确是否加入公共网络，确认身份与二进制来源后再在隔离profile使用只读状态入口。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 deploy/plugins/dist/dsh/README.md、deploy/plugins/dist/dsh/index.js、deploy/plugins/dist/dsh/cordis.patch.yml、deploy/plugins/dist/dsh/bin/anet-install.sh、deploy/plugins/dist/dsh/skills.js 及固定范围 inventory；组件：deploy/plugins/dist/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：研究边界是deploy/plugins/dist/dsh及启动脚本，不审计整个Go网络或付款协议。
- 下一步：以预装/缺失/错误路径及并发启动验证解析和锁；在隔离环境核对禁用自动安装是否真正无新增进程、以及实际二进制摘要。没有运行本方案。

**分析版本**

- **仓库**：[ANetResearch/ANet](https://github.com/ANetResearch/ANet)
- **版本号**：0.3.0（[固定提交 d03c528](https://github.com/ANetResearch/ANet/tree/d03c5282a69647dc8a301e53b02ab376692d5ac5)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把安装与网络加入拆成显式的预检和确认阶段，并记录实际二进制摘要；比较误启动和配置错误率，若步骤增加而错误没有下降则否定。[Q05](#research-q05)

以预装/缺失/错误路径及并发启动验证解析和锁；在隔离环境核对禁用自动安装是否真正无新增进程、以及实际二进制摘要。没有运行本方案。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ANetResearch/ANet/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：ANetResearch/ANet 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH组件相对手配MCP增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

组件不重做ANet网络协议，主要把同一个二进制路径和身份提供给MCP行与Skill命令。合格结果是任务入口不再出现身份或路径分叉，并能拿到明确状态。手工MCP配置也能完成网络工作，所以贡献是接入和生命周期管理。仅从bundle无法证明节点任务质量或公共网络需求。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:1-17](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/index.js#L1-L17)

明确bundle分工和共享配置目的。

<details>
<summary>查看原文（17行）</summary>

```text
// The anet plugin for DeepSeek Harness (DSH): settings and bundle directory.
//
// The bundle layer (cordis.patch.yml) mounts this module and the MCP client row
// that starts bin/anet-mcp (bin/anet-mcp.cmd on Windows). This module does two
// things:
//
//   1. It provides the service `anetPlugin` ({ root, settings }) to the MCP row,
//      because a patch has no variable for the directory of the bundle.
//   2. It applies the two settings, anetPath and identity, to the environment of
//      the DSH process (ANET_PLUGIN_BIN, ANET_PLUGIN_IDENTITY), so that the MCP
//      server and the commands of the skills reach the same executable and
//      identity (bin/anet-run.sh reads them). The previous values are restored
//      when the plugin is disposed.
//
// The skills are registered by skills.js, a second row of the patch, so that
// the MCP server also works in a profile without a skill registry.
// The module depends on nothing but Node.js.
```

</details>

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/cordis.patch.yml:4-24](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/cordis.patch.yml#L4-L24)

三个挂载行固定实际接入结构。

<details>
<summary>查看原文（21行）</summary>

```text
- insert:
    - id: anet-plugin
      name: dsh-anet
      config:
        anetPath: ''
        identity: ''
    - id: anet-skills
      name: ./skills.js
    - id: anet-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      inject: [anetPlugin]
      config:
        serverName: anet
        transport: stdio
        # bin/anet-mcp on Linux and macOS; on Windows the same path selects bin/anet-mcp.cmd.
        command: !!js "ctx.anetPlugin.root + '/bin/anet-mcp'"
        args: []
        env:
          ANET_PLUGIN_BIN: !!js "ctx.anetPlugin.settings.anetPath"
          ANET_PLUGIN_IDENTITY: !!js "ctx.anetPlugin.settings.identity"
        toolCallTimeoutMs: 900000
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置如何进入MCP和Skill且在停用时恢复？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

resolveSettings仅接受两个键，配置非空值优先环境变量，避免拼错参数被忽略。apply提供anetPlugin服务并设置进程环境，MCP patch同时将设置显式传到子进程。dispose只恢复仍等于本组件写入值的变量，保留后来所有者的修改。Skill注册独立成行，因此没有skills服务时MCP仍有机会工作。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:31-73](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/index.js#L31-L73)

设置解析、环境所有权与dispose。

<details>
<summary>查看原文（43行）</summary>

```text
// The effective settings: a non-empty value of the plugin row wins over the
// environment variable of the same setting. Unknown keys are errors, so that a
// misspelled setting does not pass silently.
export function resolveSettings(config, env) {
  const given = config ?? {}
  if (typeof given !== 'object' || Array.isArray(given)) throw new TypeError('dsh-anet: the plugin configuration must be a mapping')
  const known = new Set(SETTINGS.map(([key]) => key))
  for (const key of Object.keys(given)) {
    if (!known.has(key)) throw new Error(`dsh-anet: unknown setting "${key}" (expected ${[...known].join(', ')})`)
  }
  const settings = {}
  for (const [key, variable] of SETTINGS) {
    const value = given[key]
    if (value !== undefined && value !== null && typeof value !== 'string') throw new TypeError(`dsh-anet: setting "${key}" must be a string`)
    settings[key] = value || env[variable] || ''
  }
  return settings
}

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
}

export function apply(ctx, config) {
  const settings = resolveSettings(config, process.env)
  ctx.provide('anetPlugin', { root: bundleRoot, settings })
  ctx.on('dispose', applyEnvironment(settings, process.env))
}
```

</details>

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/cordis.patch.yml:12-24](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/cordis.patch.yml#L12-L24)

stdio MCP环境和900秒调用上限。

<details>
<summary>查看原文（13行）</summary>

```text
    - id: anet-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      inject: [anetPlugin]
      config:
        serverName: anet
        transport: stdio
        # bin/anet-mcp on Linux and macOS; on Windows the same path selects bin/anet-mcp.cmd.
        command: !!js "ctx.anetPlugin.root + '/bin/anet-mcp'"
        args: []
        env:
          ANET_PLUGIN_BIN: !!js "ctx.anetPlugin.settings.anetPath"
          ANET_PLUGIN_IDENTITY: !!js "ctx.anetPlugin.settings.identity"
        toolCallTimeoutMs: 900000
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动安装的便利改变哪些信任和副作用边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

启动器缺二进制时能下载并运行远端脚本，默认安装节点并加入公共hub。脚本的锁、超时、独立会话与stderr日志有助于完整性和诊断，但不等于固定插件版本锁住安装内容。源码注释声称远端安装器校验签名和摘要，本轮只检查启动层，不能将注释当独立验证。相对PATH过滤可减少工作区可执行文件误选，仍无法消除远端供应链信任。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/bin/anet-install.sh:4-47](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/bin/anet-install.sh#L4-L47)

自动安装、加入网络、锁和等待边界。

<details>
<summary>查看原文（44行）</summary>

```text
# `sh anet-install.sh [installer arguments]` downloads https://agentnetwork.org.cn/install.sh
# into a new private directory, runs it only when the download succeeded, and
# removes the directory afterwards. The installer checks the signed release
# manifest and the SHA-256 of the binary and stops without changing anything
# when a check fails; by default it installs anet for this user, starts the
# node and joins the public hub. The script exists so that an agent host that
# refuses command substitution in a shell command can still run the
# installation as one plain command (the anet-setup skill).
#
# `sh anet-install.sh --mcp` is the first step of the MCP launcher
# (anet-mcp.sh): it installs anet when the runner finds no anet executable, so
# that enabling the plugin is enough to have anet installed and its node
# running. It does nothing when the environment variable ANET_PLUGIN_NO_INSTALL
# is set to a value other than 0, when the plugin setting anetPath is set (an
# invalid one is reported by the runner, and no other copy is installed), and
# in a POSIX shell on Windows (anet-mcp.cmd installs there). Otherwise it runs
# the installer without arguments: nothing from the workspace or the session
# reaches it, the user's settings select nothing of it either. The installer
# runs
#   * with no input and no controlling terminal (in a session of its own, with
#     setsid or Perl where available), so that it never asks for a password
#     on the terminal of the host, and never reads the MCP session;
#   * in the user's home directory, not in the working directory of the
#     session (a workspace);
#   * with its output written to install.log in the state directory, which is
#     copied to standard error afterwards (the launcher sends this script's
#     output to standard error: standard output is the MCP session). Because
#     the installer does not write to the host's pipe and has a session of
#     its own, a host that gives up on a slow start does not end it halfway;
#     it finishes, and the next session finds anet.
# It waits for the installer at most 15 minutes, and exits with status 0 in
# every case: the launcher goes on, and the runner reports anet as missing
# when the installation did not succeed.
#
# One installation at a time. Both forms hold the lock directory
# <state>/install.lock while the installer runs, with the process ID of the
# holder and its start time (as ps prints it) in the file pid; <state> is
# $XDG_CACHE_HOME/anet-plugin, or ~/.cache/anet-plugin (an absolute path only;
# without one the --mcp form installs nothing). Another host that starts at
# the same moment waits for it, at most 10 minutes (5 for the plain form), and
# then installs nothing itself when the first installation left an anet
# behind. A lock whose holder no longer runs (no process with that ID, or one
# that started at another time: the ID was reused), or that is older than 30
# minutes, is removed.
```

</details>

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/bin/anet-install.sh:50-68](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/bin/anet-install.sh#L50-L68)

PATH绝对目录过滤为具体防护。

<details>
<summary>查看原文（19行）</summary>

```text
# Programs (sh, sed, uname and the others) are found only in the absolute
# directories of PATH: a relative entry (such as "." or an empty one) would
# find a file of the working directory of the session, which can be an
# untrusted workspace. This comes before the first command that is not built
# into the shell, and the scripts started from here inherit it.
_abs=
_ifs=$IFS
IFS=:
set -f
for _d in ${PATH:-}; do
  case $_d in
    /*) _abs=${_abs:+$_abs:}$_d ;;
  esac
done
IFS=$_ifs
set +f
PATH=${_abs:-/usr/bin:/bin}
export PATH
unset _abs _ifs _d
```

</details>

#### 缺口

- 实际下载安装器及核心版本未固定核验
  **影响**：限制供应链与跨平台可靠性判断
  **进一步探讨**：固定安装器字节、签名和二进制摘要，在隔离环境核验行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为什么当前建议观察而非普遍试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

现有ANet用户可能通过bundle降低多入口配置成本，但没有该网络任务的用户要承担身份、节点、网络和外部服务负担。自动安装最长等待不是日常耗时，不能拿上限估算真实效率。建议先预装核心并关闭自动安装，用只读状态确认路径和身份，再决定是否允许公共连接。停止DSH插件也不应被假定等于卸载节点或抹除身份，退出需要独立核对。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/bin/anet-install.sh:13-36](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/bin/anet-install.sh#L13-L36)

缺失/自定义路径和NO_INSTALL分支。

<details>
<summary>查看原文（24行）</summary>

```text
# `sh anet-install.sh --mcp` is the first step of the MCP launcher
# (anet-mcp.sh): it installs anet when the runner finds no anet executable, so
# that enabling the plugin is enough to have anet installed and its node
# running. It does nothing when the environment variable ANET_PLUGIN_NO_INSTALL
# is set to a value other than 0, when the plugin setting anetPath is set (an
# invalid one is reported by the runner, and no other copy is installed), and
# in a POSIX shell on Windows (anet-mcp.cmd installs there). Otherwise it runs
# the installer without arguments: nothing from the workspace or the session
# reaches it, the user's settings select nothing of it either. The installer
# runs
#   * with no input and no controlling terminal (in a session of its own, with
#     setsid or Perl where available), so that it never asks for a password
#     on the terminal of the host, and never reads the MCP session;
#   * in the user's home directory, not in the working directory of the
#     session (a workspace);
#   * with its output written to install.log in the state directory, which is
#     copied to standard error afterwards (the launcher sends this script's
#     output to standard error: standard output is the MCP session). Because
#     the installer does not write to the host's pipe and has a session of
#     its own, a host that gives up on a slow start does not end it halfway;
#     it finishes, and the next session finds anet.
# It waits for the installer at most 15 minutes, and exits with status 0 in
# every case: the launcher goes on, and the runner reports anet as missing
# when the installation did not succeed.
```

</details>

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/index.js:50-73](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/index.js#L50-L73)

dispose只明确恢复环境，不证明外部节点退出。

<details>
<summary>查看原文（24行）</summary>

```text
// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
}

export function apply(ctx, config) {
  const settings = resolveSettings(config, process.env)
  ctx.provide('anetPlugin', { root: bundleRoot, settings })
  ctx.on('dispose', applyEnvironment(settings, process.env))
}
```

</details>

#### 缺口

- 端到端任务和节点退出成本未知
  **影响**：不能量化接入收益或长期运维成本
  **进一步探讨**：在明确任务与预算下记录合格结果、节点资源和退出残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装预检与网络加入分离能否降低误启动？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是先报告解析路径、将下载内容摘要和默认网络副作用展示给用户，再显式完成安装和加入。现有NO_INSTALL与resolve能力使这条分离有现实基础。对照自动一体启动与分阶段流程，记录错误身份、重复安装、意外网络加入和总人工时间；若错误不下降或步骤负担超过收益，则维持现状更合理。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/bin/anet-install.sh:13-21](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/bin/anet-install.sh#L13-L21)

现有可关闭自动安装为拆分流程基础。

```text
# `sh anet-install.sh --mcp` is the first step of the MCP launcher
# (anet-mcp.sh): it installs anet when the runner finds no anet executable, so
# that enabling the plugin is enough to have anet installed and its node
# running. It does nothing when the environment variable ANET_PLUGIN_NO_INSTALL
# is set to a value other than 0, when the plugin setting anetPath is set (an
# invalid one is reported by the runner, and no other copy is installed), and
# in a POSIX shell on Windows (anet-mcp.cmd installs there). Otherwise it runs
# the installer without arguments: nothing from the workspace or the session
# reaches it, the user's settings select nothing of it either. The installer
```

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/bin/anet-install.sh:88-92](https://github.com/ANetResearch/ANet/blob/d03c5282a69647dc8a301e53b02ab376692d5ac5/deploy/plugins/dist/dsh/bin/anet-install.sh#L88-L92)

resolve探测支持预检设计。

```text
# anet_missing: whether the runner finds no anet executable and no anetPath is
# set (its --resolve prints "executable: not found" exactly then).
anet_missing() {
  [ "$(sh "$here/anet-run.sh" --resolve 2>/dev/null | sed -n 1p)" = "executable: not found" ]
}
```

#### 缺口

- 分阶段流程的需求和收益未测
  **影响**：假设不能计入当前bundle贡献
  **进一步探讨**：以隔离用户任务比较错误和时间后决定。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
