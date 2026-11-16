# Hatoba Agent 插件

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[831d84d](https://github.com/scarletkc/Hatoba/tree/831d84da32d6309167129c90e1661e22ee013070/packaging/agent-plugin)

<!-- BEGIN META -->
[![GitHub ★ 247](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=247&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/scarletkc/Hatoba) [![最新发布 2026-11-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/hatoba-agent-plugin)
<!-- END META -->

> **功能**：让 DeepSeek Harness 等代理使用 Hatoba 保存的 SSH 主机执行命令和复制文件。

> **亮点**：发布时将同一份技能带入 DSH，代理可把主机解析与连接交回已有的 Hatoba 桌面进程，直接读取远端输出和退出状态。这项适配的价值随用户已保存的主机数量与重复检查频率而增加。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：启用外部访问后，当前系统用户下能访问 IPC 的程序可借用已保存主机权限。进程退出或关闭开关后，仍需检查已开始的远端工作有无留下副作用。[Q03](#research-q03)

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
  - [Q01 · 固定版本如何把仓库外层的技能带入 DSH profile？](#detail-section-11)
  - [Q02 · 一次保存主机的检查如何产生可核对回执，替代了哪些步骤？](#detail-section-12)
  - [Q03 · 谁可以触发远程副作用，关停、文件覆盖和共享笔记意味着什么？](#detail-section-13)
  - [Q04 · 在什么工作负载上值得尝试，哪种授权收窄可以检验增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已将开发或测试主机存进 Hatoba、日常从桌面 DSH 排查远程状态的用户，可以让代理对选定的主机发起检查并收回结果。

原流程要用户在 Hatoba 窗口选主机手动执行，或另外维护供代理使用的 SSH 别名与认证。已有成熟 SSH 配置的用户获得的只是保存条目的入口便利。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主机清单 | 取得保存主机名称和 ID | 本机解锁且外部访问打开 |
| 命令执行 | 读取远端状态并收回输出、错误和退出状态 | 同用户可达 IPC，依赖远端账号权限 |
| 文件复制 | 本机和一台保存主机间传输文件 | 指定目标路径，特权失败可能需要人工修复 |
| 主机记忆 | 读写共享的主机使用笔记 | 核对内容来源和是否过时 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 含技能文件系统的 DSH profile | 必需 | 安装并加载包 | 入口或技能不可用，兼容版本仍待核实 |
| 本地已解锁 Hatoba 和两个设置 | 必需 | 接受同用户的 CLI 请求 | 连接失败或库锁定 |
| 保存的 SSH 主机与远端账号 | 必需 | 执行检查并决定权限 | 名称歧义须确认实际 ID |
| 窗口认证、sudo | 按请求 | 主机密钥、密码或特权 | 需要用户介入，可配置禁用提示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 加载 | 用户装到当前 profile 并重启 | 确认可发现 hatoba-cli 技能 |
| 核对 | 代理查看命令帮助及保存的主机 | 用唯一 ID，失败时检查本机路径和访问设置 |
| 检查 | 代理执行一项只读 SSH 检查 | 标准输出与返回状态均符合预期 |
| 关停 | 用户关闭外部访问或锁定 Hatoba | 确认新请求失败，并独立复查可能已开始的远端工作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 现有桌面和测试机资源，增量账单未知 | 安装重启、认证、核对 profile 与帐号 | 依赖技能装载和本机 IPC |
| 持续 | 复用远端资源，实际用量未知 | 处理首次确认、管理账号及活动记录 | 重复操作节时未经测量 |
| 失败恢复 | 远端可能遗留进程或文件，损失未知 | 检查回执、远端状态及退出权限 | 普通检查与特权文件写入风险不同 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 复用保存主机 | 固定源码按主机 ID 组装桌面 SSH 连接 | 本机与隔离 profile 的可达率 |
| 检查结果可复核 | CLI 映射输出帧、服务端返回命令状态 | 同任务成功率和时间变化 |
| 凭据留在桌面进程 | 认证配置由 desktop 从已解锁的库组装 | 未做凭据流全面审计 |

> **思考**：启用外部访问后，当前系统用户下能访问 IPC 的程序可借用已保存主机权限。进程退出或关闭开关后，仍需检查已开始的远端工作有无留下副作用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：发布时将同一份技能带入 DSH，代理可把主机解析与连接交回已有的 Hatoba 桌面进程，直接读取远端输出和退出状态。这项适配的价值随用户已保存的主机数量与重复检查频率而增加。[Q01](#research-q01) [Q02](#research-q02)

包模板和技能分离，发布脚本将素材写回入口预期位置。协议把输出、通知和结束状态拆成不同类型，能把认证等待与执行结果区分。需要把桌面端活动记录随解锁会话结束而清空的行为纳入试用核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

启用外部访问后，当前系统用户下能访问 IPC 的程序可借用已保存主机权限。进程退出或关闭开关后，仍需检查已开始的远端工作有无留下副作用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先把测试账号限制为只读，再选一台有唯一 ID 的测试主机查看磁盘用量。核对退出状态、主机身份和窗口活动记录，任一步失效就锁定客户端并改为人工检查。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已从固定源码确认技能打包、软件间通信和回传路径。更细授权、实际租用环境中的试用成本和效率都待对照验证。

- 已检查：作者 README、包清单、源码路径 packaging/agent-plugin/package.json、packaging/agent-plugin/cordis.patch.yml、packaging/agent-plugin/index.mjs、scripts/release/agent-plugin.mjs、.github/workflows/release.yml、packaging/agent-plugin/README.md、skills/hatoba-cli/SKILL.md、crates/hatoba-cli/src/client.rs、apps/desktop/src-tauri/src/cli_access.rs、apps/desktop/src-tauri/src/commands/cli.rs、crates/hatoba-cli/src/args.rs 及固定范围 inventory；组件：packaging/agent-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件是 Hatoba 仓库的 Agent 插件子目录，本次抽查定版的构建和桌面 CLI 桥接，不扩展为整仓安全审计。
- 下一步：用限定远端权限的测试帐号比较本机已解锁、锁定及隔离环境的只读检查，核对输出、主机 ID、返回码，并记录授权后人工确认的次数。

**分析版本**

- **仓库**：[scarletkc/Hatoba](https://github.com/scarletkc/Hatoba)
- **版本号**：未声明（[固定提交 831d84d](https://github.com/scarletkc/Hatoba/tree/831d84da32d6309167129c90e1661e22ee013070)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用限时、限定主机和只读命令的授权把信任范围收窄到一次检查。这项设计尚待验证，用正确主机率、确认次数和写入拒绝结果对照当前的账户级开关。[Q04](#research-q04)

用限定远端权限的测试帐号比较本机已解锁、锁定及隔离环境的只读检查，核对输出、主机 ID、返回码，并记录授权后人工确认的次数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 15 | 12 | 0 | — |
| .md | source | 1 | 48 | — | — | 245 |

</details>

**活跃度**

[![Issue 未关闭 57](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=57&color=737b86&logo=github)](https://github.com/scarletkc/Hatoba/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=41&color=737b86&logo=github)](https://github.com/scarletkc/Hatoba/issues?q=is%3Aissue+created%3A2026-10-17T04%3A12%3A58.039Z..2026-11-16T04%3A12%3A58.039Z) [![近30天关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/scarletkc/Hatoba/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T04%3A12%3A58.039Z..2026-11-16T04%3A12%3A58.039Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对于已经用 Hatoba 保存 SSH 主机的 DSH 用户，标准包能否在不复制凭据的前提下，让代理用可核对的输出完成一次远程检查，并且在哪些授权与故障边界下才值得启用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定版本如何把仓库外层的技能带入 DSH profile？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

发布模板和可用产物之间有一道复制步骤。包清单指定 Cordis 补丁，补丁以包内相对入口加载 index.mjs。入口声明需要宿主的 skills 服务，并将自己旁边的 skills 目录以 hatoba 提供者身份交给技能文件系统，配置只扫描指定目录。发布打包器从根清单读取版本，把仓库根的 hatoba-cli 技能复制到生成包的同名目录；直接以 Git checkout 的 packaging/agent-plugin 作为包根时，入口旁没有该目录。固定发布工作流构建该成品再发布到 npm，并受稳定版和发布开关约束。

桌面用户将包加到 desktop profile，Web 用户加到 web profile，启动对应配置后，代理才能按技能调用本机的 Hatoba 命令。两种安装方式都是作者说明。Webhook、额外模型工具和桌面凭据导出均不在这条注册链上。Web profile 的代理若实际跑在远程节点，装载技能也不足以让节点访问用户电脑上的 Hatoba 进程。

#### 证据与依据

**依据 1 · 源码核查**：[packaging/agent-plugin/package.json:20-24](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/packaging/agent-plugin/package.json#L20-L24)

包清单指向 Cordis bundle 补丁。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

**依据 2 · 源码核查**：[packaging/agent-plugin/cordis.patch.yml:1-3](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/packaging/agent-plugin/cordis.patch.yml#L1-L3)

补丁定位发布包的 index.mjs。

```text
- insert:
    - id: hatoba
      name: "hatoba-agent-plugin/index.mjs"
```

**依据 3 · 源码核查**：[packaging/agent-plugin/index.mjs:1-15](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/packaging/agent-plugin/index.mjs#L1-L15)

宿主注入 skills，提供者扫描发布包旁的 skills。

<details>
<summary>查看原文（15行）</summary>

```text
import { fileURLToPath } from "node:url";
import * as SkillFilesystem from "@deepseek-ai/dsh-skill-filesystem";

const SKILLS_DIR = fileURLToPath(new URL("./skills", import.meta.url));

export const name = "hatoba";
export const inject = ["skills"];

export function apply(ctx) {
  ctx.plugin(SkillFilesystem, {
    providerName: "hatoba",
    includeDefaultRoots: false,
    customSkillDirs: [SKILLS_DIR],
  });
}
```

</details>

**依据 4 · 源码核查**：[scripts/release/agent-plugin.mjs:10-24](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/scripts/release/agent-plugin.mjs#L10-L24)

启动打包时把根技能放进扫描路径，版本从根清单取得。

<details>
<summary>查看原文（15行）</summary>

```text
export function versionedManifest(root, manifest) {
  const { name, ...fields } = JSON.parse(readFileSync(join(root, PACKAGE_DIR, manifest), "utf8"));
  const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  return { name, version, ...fields };
}

export function writePackage(root, output) {
  if (existsSync(output) && readdirSync(output).length > 0) throw new Error(`${output} is not empty.`);
  for (const file of PACKAGE_FILES) cpSync(join(root, PACKAGE_DIR, file), join(output, file));
  for (const manifest of MANIFESTS) {
    mkdirSync(dirname(join(output, manifest)), { recursive: true });
    writeFileSync(join(output, manifest), `${JSON.stringify(versionedManifest(root, manifest), null, 2)}\n`);
  }
  cpSync(join(root, "skills/hatoba-cli"), join(output, "skills/hatoba-cli"), { recursive: true });
  cpSync(join(root, "LICENSE"), join(output, "LICENSE"));
```

</details>

**依据 5 · 源码核查**：[.github/workflows/release.yml:285-301](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/.github/workflows/release.yml#L285-L301)

正式发布由非预发布与变量共同决定，对指定提交打包。

<details>
<summary>查看原文（17行）</summary>

```text
    if: needs.preflight.outputs.prerelease == 'false' && vars.NPM_PUBLISH == 'true'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    environment: packages
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ needs.preflight.outputs.sha }}
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org
      - run: node scripts/release/agent-plugin.mjs target/hatoba-agent-plugin
```

</details>

**依据 6 · 作者声明**：[packaging/agent-plugin/README.md:30-40](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/packaging/agent-plugin/README.md#L30-L40)

作者为 desktop 与 web 给出各自的 profile 安装命令。

<details>
<summary>查看原文（11行）</summary>

````text
## DeepSeek Harness

Install the plugin into the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) profile you run, then
restart the harness if it is running. The desktop app runs the `desktop` profile, and `dsh web` runs `web`:

```sh
# For the desktop app
dsh plugin --profile desktop add hatoba-agent-plugin
# For dsh web
dsh plugin --profile web add hatoba-agent-plugin
```
````

</details>

#### 缺口

- 固定提交与注册表下载物未作字节比对，且实际 profile 的技能目录装载与本机 IPC 可达性未测。
  **影响**：源码链足以确认插件身份，实际哪种环境能用仍未知。
  **进一步探讨**：记录同版本 npm tarball、宿主与系统版本，核对包中技能并在桌面和受限 profile 各检查加载与 IPC。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次保存主机的检查如何产生可核对回执，替代了哪些步骤？

**研究主题**：场景与需求、贡献与相对优势、功能与机制、工程质量与复用

#### 完整回答

已经把用于开发或测试的 SSH 主机、跳板和认证办法存进 Hatoba 的用户，可让本机代理先列出主机，再按唯一主机 ID 发起一次只读检查，例如取回远端磁盘用量。技能提供了选择命令和恢复失败的说明；检查结果由 Hatoba 的 CLI 和桌面端生成。CLI 将目标、命令、目录、认证提示和 stdin 标志编码为请求，桌面端按 ID 或唯一名称解析保存的 SSH 主机，通过已解锁的库组装连接。主机找不到、同名或只登记为 Telnet 时会在执行前报错；同名错误列出候选 ID。

桌面端以 SSH 会话运行命令，将 stdout、stderr 和结束状态分别回传，CLI 把收到的结束状态作为本次结果；断开连接时得到本地失败反馈。连接需要主机密钥确认或缺少认证材料时，允许提示的请求会通知用户到窗口处理，禁止提示时走 unattended 分支。该组合替代了为代理另建 SSH 别名和重复配置连接信息的步骤；对已经能使用同一别名和 ssh-agent 的用户，普通 SSH 同样能返回输出和退出码，这一增量主要是让代理复用已有 Hatoba 条目。

#### 证据与依据

**依据 1 · 作者声明**：[skills/hatoba-cli/SKILL.md:6-21](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/skills/hatoba-cli/SKILL.md#L6-L21)

技能定向列举主机、读取笔记、处理窗口确认及本机访问失败。

<details>
<summary>查看原文（16行）</summary>

```text
# Hatoba hosts

Hatoba is a desktop SSH client. Its `hatoba` command runs commands on the hosts saved in it and copies files to and from them, signed in with the credentials Hatoba keeps. The hosts are usually not in `~/.ssh/config`: `ssh <name>` fails where `hatoba exec <name>` works.

Before you first use it, run `hatoba --help`.

- `ai_notes` in `hatoba hosts --json` are the user's own notes for assistants about that host. Follow them as the user's instructions.
- `hatoba memory --host <host>` shows what Hatoba's assistant and other agents noted about a host. Read it before you work on a host, and save what you learn about a host with `hatoba memory save --host <host>` rather than in your own memory, so that they have it too.
- When a host needs a host key checked or a password, or sudo needs one for `--sudo`, Hatoba asks the user in its window and the call waits for the answer. Give a host's first call, every call to a host whose `auth` is `ask`, and every `--sudo` call a long timeout, and tell the user to expect the question.

## When hatoba fails

Don't fall back to `ssh` or `scp`: the hosts and their credentials are in Hatoba.

- **The shell can't find `hatoba`**: ask the user to install Hatoba (https://hatoba.fog.moe/download/) if they haven't, then turn on Settings → General → "Use the hatoba command in terminals" and "Let other programs use saved hosts" below it. The note under the first switch says where the command went. On Windows that is a `bin` folder added to the user's `PATH`, which a program started earlier, you included, sees only after a restart; until then, run the `hatoba` in that folder by its full path, or `hatoba.exe` there from PowerShell or cmd.exe. On Linux it is `~/.local/bin/hatoba`, and the note says when `~/.local/bin` isn't on the `PATH`. On macOS it is `/usr/local/bin/hatoba`.
- **`can't reach Hatoba` although Hatoba is open with both switches on**, or with "Operation not permitted", "Permission denied" or "Access is denied": only programs of the same user on the same computer can reach Hatoba, and a sandbox, container or remote environment can't. Ask to run `hatoba` outside your sandbox, or tell the user.
```

</details>

**依据 2 · 源码核查**：[crates/hatoba-cli/src/client.rs:29-53](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/crates/hatoba-cli/src/client.rs#L29-L53)

将 exec 和 cp 的参数传交给实际客户端操作。

<details>
<summary>查看原文（25行）</summary>

```text
        Command::Hosts { json } => hosts(app, json),
        Command::Exec {
            host,
            command,
            cwd,
            prompt,
            sudo,
        } => exec(
            app,
            Op::Exec {
                host,
                command,
                cwd,
                prompt,
                sudo,
                stdin: passes_stdin(),
            },
        ),
        Command::Copy {
            source,
            target,
            prompt,
            sudo,
            mode,
        } => copy(app, source, target, prompt, sudo, mode),
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:568-599](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L568-L599)

解析唯一保存的 SSH 主机，并对名称歧义给出候选 ID。

<details>
<summary>查看原文（32行）</summary>

```text
/// The saved host a command names: by its id, or by its name as `hatoba <name>` finds it
/// (HOST-13), which several hosts may share. Only SSH hosts run commands and copy files, and
/// `hatoba memory` names only them; naming a Telnet host says so (TELNET-01).
pub(crate) fn find_host(vault: &Vault, wanted: &str) -> Result<(String, Host), String> {
    if let Some(host) = vault.get(wanted).and_then(Item::as_host) {
        return Ok((wanted.to_owned(), host.clone()));
    }
    let key = wanted.trim().to_lowercase();
    let mut named: Vec<(String, Host)> = vault
        .hosts()
        .into_iter()
        .filter(|(_, h)| h.name.trim().to_lowercase() == key)
        .collect();
    match named.len() {
        1 => Ok(named.remove(0)),
        0 => Err(match telnet_name(vault, wanted, &key) {
            Some(name) => format!(
                "{wanted} is a Telnet host, and exec, cp and memory work only on SSH hosts. Run \
                 hatoba {name} to open it in Hatoba."
            ),
            None => {
                format!("no saved host is named {wanted}. Run hatoba hosts to see their names.")
            }
        }),
        n => {
            named.sort_by(|a, b| a.0.cmp(&b.0));
            let ids: Vec<&str> = named.iter().map(|(id, _)| id.as_str()).collect();
            Err(format!(
                "{n} saved hosts are named {wanted}. Name one by its id instead: {}.",
                ids.join(", ")
            ))
        }
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:744-764](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L744-L764)

从解锁库构造 SSH 配置，禁止提示时走无人值守连接并传播失败。

<details>
<summary>查看原文（21行）</summary>

```text
    async fn connect(&self, target: &Target) -> AppResult<SshSession> {
        let overrides = Overrides {
            ask_password: self.prompt,
            ..Overrides::default()
        };
        let cfg = state(self.app)
            .with_unlocked(|v| {
                let host = v
                    .get(&target.id)
                    .and_then(Item::as_host)
                    .cloned()
                    .ok_or_else(|| AppError::not_found("host"))?;
                ssh::build_config(v, &host, Some(&target.id), Some(&overrides))
            })
            .map_err(|e| AppError::internal(config_error(&e, &target.name)))?;
        if !self.prompt {
            let (result, outcome) =
                ssh::connect_unattended(self.app, cfg, Some(self.banner_printer())).await;
            return result
                .map_err(|e| AppError::internal(unattended_error(&e, &outcome, &target.name)));
        }
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:766-787](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L766-L787)

打开桌面窗口进行主机密钥或登录确认，并回传等待通知。

<details>
<summary>查看原文（22行）</summary>

```text
        let tx = self.tx.downgrade();
        let app = self.app.clone();
        let on_ask: OnAsk = Arc::new(move |asking| {
            crate::platform::window::reopen_main(&app);
            let text = match asking {
                Asking::HostKey { target } => {
                    format!("waiting for you to check the host key of {target} in Hatoba")
                }
                Asking::SignIn { target } => {
                    format!("waiting for you to sign in to {target} in Hatoba")
                }
            };
            if let Some(tx) = tx.upgrade() {
                let _ = tx.try_send(Frame::Notice(text));
            }
        });
        ssh::connect_asking(
            self.app,
            cfg,
            None,
            Some(on_ask),
            Some(self.banner_printer()),
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:1068-1094](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L1068-L1094)

SSH 命令运行时，拆分标准输出、错误和取消信号。

<details>
<summary>查看原文（27行）</summary>

```text
    let token = uuid::Uuid::new_v4().simple().to_string();
    // The command's stdin did not come, and an empty one in its place would run it on input it
    // was not given.
    let no_stdin = CancellationToken::new();
    let (output, mut pieces) = mpsc::channel(16);
    let run = remote_command::run_streaming_as(
        &lease.session,
        command,
        cwd,
        &run_as,
        stdin,
        async {
            tokio::select! {
                () = ctx.stopped() => {}
                () = no_stdin.cancelled() => {}
            }
        },
        output,
    );
    let pass_on = async {
        while let Some(piece) = pieces.recv().await {
            let frame = match piece {
                Output::Stdout(bytes) => Frame::Stdout(bytes.to_vec()),
                Output::Stderr(bytes) => Frame::Stderr(bytes.to_vec()),
            };
            // Without a reader, the command is stopping already.
            let _ = ctx.tx.send(frame).await;
```

</details>

**依据 7 · 源码核查**：[crates/hatoba-cli/src/client.rs:158-185](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/crates/hatoba-cli/src/client.rs#L158-L185)

本地将接收帧转为输出及退出状态，连接早断则失败。

<details>
<summary>查看原文（28行）</summary>

```text
fn exec(app: &App, op: Op) -> i32 {
    let mut stream = match request(app, op) {
        Ok(stream) => stream,
        Err(message) => return fail(&message, EXEC_FAILED),
    };
    let mut stdout = io::stdout().lock();
    let mut stderr = io::stderr();
    loop {
        match Frame::read(&mut stream) {
            Ok(Some(Frame::Stdout(bytes))) => {
                // The reader went away, as `| head` does: the command stops with the connection.
                if write_out(&mut stdout, &bytes).is_err() {
                    return EXEC_FAILED;
                }
            }
            Ok(Some(Frame::Stderr(bytes))) => {
                let _ = write_out(&mut stderr, &bytes);
            }
            Ok(Some(Frame::Notice(text))) => eprintln!("hatoba: {text}"),
            Ok(Some(Frame::SendStdin(token))) => send_stdin(*app, token),
            Ok(Some(Frame::End(end))) => return ended(end, EXEC_FAILED),
            Ok(Some(_)) => {}
            Ok(None) | Err(_) => {
                return fail(
                    "the connection to Hatoba ended before the command did",
                    EXEC_FAILED,
                );
            }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 谁可以触发远程副作用，关停、文件覆盖和共享笔记意味着什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

授权粒度由 Hatoba 桌面端的两项本地设置、解锁状态和当前 OS 用户共同形成。Unix 套接字设置为 0600 并核对对端 UID，Windows 管道配置为仅所有者且拒绝远程客户端。入口在处理普通请求前检查协议版本与保险库状态，从已保存的主机选择目标。当前核查到的关键路径按登录用户权限执行，既未要求来自特定 DSH 实例，也未按每条命令要求独立审批。认证时弹出的密码或主机密钥窗口约束的是特定连接条件，已经取得认证的命令仍可能直接执行。使用此能力的信任边界由桌面用户判断，代理阅读到的主机记忆也可由本机其他获权程序更新，适合作为可核查线索。

关闭任一开关会取消监听和当前执行代次，锁定库还会清空活动列表并关连接池。取消后应核对实际远端状态；命令已经运行的写入无自动回滚承诺，且源代码内置帮助明确表示部分远端环境可能继续运行，特权复制失败还可能留下截短文件。若只需检查，测试账号无写权限可比依赖提示更直接限制影响。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/commands/cli.rs:99-113](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/commands/cli.rs#L99-L113)

两个开关都启用才允许接收 CLI，任一缺省为关。

<details>
<summary>查看原文（15行）</summary>

```text
/// Whether the app listens for the command's own commands (HOST-15): while the command and the
/// setting are both on. Readable while the vault is locked.
pub fn access_on(vault: &Vault) -> bool {
    flag(vault, PREF).unwrap_or(false) && flag(vault, ACCESS_PREF).unwrap_or(false)
}

fn enabled(vault: &Vault) -> AppResult<bool> {
    flag(vault, PREF)
}

fn flag(vault: &Vault, key: &str) -> AppResult<bool> {
    Ok(stored_prefs(vault.local_prefs()?.as_deref())
        .get(key)
        .and_then(Value::as_bool)
        .unwrap_or(false))
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:212-226](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L212-L226)

关开关时取消监听和当前操作代次。

<details>
<summary>查看原文（15行）</summary>

```text
/// Starts or stops listening as the device's prefs say (`commands::cli::access_on`).
pub fn sync(app: &AppHandle) {
    let state = state(app);
    let on = crate::commands::cli::access_on(&state.vault());
    let mut listener = lock(&state.cli.listener);
    if on == listener.is_some() {
        return;
    }
    if !on {
        if let Some(stop) = listener.take() {
            stop.cancel();
        }
        drop(listener);
        state.cli.end_epoch();
        return;
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:245-257](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L245-L257)

Windows IPC 配置仅所有者并拒绝远程请求。

<details>
<summary>查看原文（13行）</summary>

```text
async fn listen(app: &AppHandle, stop: &CancellationToken) -> std::io::Result<()> {
    use tokio::net::windows::named_pipe::{NamedPipeServer, ServerOptions};

    let name = hatoba_cli::endpoint::endpoint(crate::CLI_APP.identifier)?;
    let security = hatoba_cli::endpoint::OwnerOnly::new()?;
    let create = |first: bool| -> std::io::Result<NamedPipeServer> {
        // SAFETY: the security attributes live in `security`, past the call.
        unsafe {
            ServerOptions::new()
                .first_pipe_instance(first)
                .reject_remote_clients(true)
                .create_with_security_attributes_raw(&name, security.as_ptr())
        }
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:284-305](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L284-L305)

Unix IPC 权限 0600，并核对对端 UID。

<details>
<summary>查看原文（22行）</summary>

```text
    let path = hatoba_cli::endpoint::endpoint(crate::CLI_APP.identifier)?;
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir)?;
    }
    // Left by an app that did not quit cleanly; only one Hatoba runs at a time.
    let _ = std::fs::remove_file(&path);
    let listener = tokio::net::UnixListener::bind(&path)?;
    std::fs::set_permissions(&path, std::fs::Permissions::from_mode(0o600))?;
    let bound = std::fs::metadata(&path)?;
    let owner = bound.uid();
    let mut idle = tokio::time::interval(IDLE_CHECK);
    let result = loop {
        tokio::select! {
            () = stop.cancelled() => break Ok(()),
            _ = idle.tick() => state(app).cli.pool.close_idle(pool::IDLE),
            accepted = listener.accept() => match accepted {
                // Another user's process, which the socket's mode keeps out already.
                Ok((stream, _)) if peer_uid(&stream).is_ok_and(|uid| uid == owner) => {
                    tauri::async_runtime::spawn(serve(app.clone(), stream));
                }
                Ok(_) => {}
                Err(e) => break Err(e),
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:414-443](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L414-L443)

逐请求校验协议版本、捕获取消代次与保险库解锁状态，提示为操作参数。

<details>
<summary>查看原文（30行）</summary>

```text
    if request.version != VERSION {
        return End::error(
            "this hatoba command comes from another version of Hatoba. Quit and reopen Hatoba, \
             which updates it, then run it again.",
        );
    }
    let state = state(app);
    // Taken before the vault is checked, so a lock that comes in between still stops what follows.
    let epoch = state.cli.epoch();
    if !state.vault().is_unlocked() {
        return End::error(LOCKED);
    }
    let prompt = match &request.op {
        Op::Hosts
        | Op::Stdin { .. }
        | Op::Memories { .. }
        | Op::MemorySave { .. }
        | Op::MemoryDelete { .. } => false,
        Op::Exec { prompt, .. } | Op::Upload { prompt, .. } | Op::Download { prompt, .. } => {
            *prompt
        }
    };
    let ctx = Ctx {
        app,
        tx,
        epoch,
        gone,
        prompt,
    };
    match request.op {
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:110-116](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L110-L116)

关停代次会关连接池并清理暂留 sudo 与 stdin 状态。

```text
    fn end_epoch(&self) {
        std::mem::take(&mut *lock(&self.epoch)).cancel();
        self.pool.close_all();
        lock(&self.sudo).clear();
        lock(&self.sudo_turns).clear();
        lock(&self.stdin).clear();
    }
```

**依据 7 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:147-153](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L147-L153)

锁定库时同时清空活动历史。

```text
    /// SEC-03: nothing runs behind the lock screen, no connection stays, and the list of what ran
    /// is forgotten.
    pub fn lock(&self, app: &AppHandle) {
        self.end_epoch();
        lock(&self.activity).clear();
        self.emit(app);
    }
```

**依据 8 · 作者声明**：[crates/hatoba-cli/src/args.rs:39-58](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/crates/hatoba-cli/src/args.rs#L39-L58)

内置帮助披露退出与中断差异和特权复制失败边界。

<details>
<summary>查看原文（20行）</summary>

```text
exec runs the command with the host's login shell and without a terminal. A
stdin from a pipe or a file is the command's, as with ssh, so a script or a
file's content needs no quoting: hatoba exec db 'sh -s' < deploy.sh. From a
terminal or /dev/null, the command's stdin is empty. exec prints the command's
stdout and stderr as they come and exits with the command's exit status, or
with 255 when Hatoba failed, which may be after the command started. Ending
exec stops the command and what it started; on hosts without sh, such as
Windows, it may keep running. A command that ends by itself leaves what it
started in the background running. hosts and cp exit with 1 when they fail,
and a command line hatoba can't read exits with 2.

--sudo runs the command as root through sudo, which has to let the login user
run sh as root. The command starts in the same directory with the same shell,
but with the environment sudo sets, so ~ and $HOME in it are root's. cp --sudo
copies the file as root, as sudo cp would: a file already at the target keeps
its owner and permissions, a new one belongs to root, --mode sets the
permissions of either, and a copy to the host that fails while writing can
leave the file cut short. When sudo asks for a password, Hatoba tries the
host's saved password, then asks in its window and remembers the answer until
it locks or the host has had no --sudo for 15 minutes.
```

</details>

**依据 9 · 源码核查**：[crates/hatoba-cli/src/client.rs:54-70](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/crates/hatoba-cli/src/client.rs#L54-L70)

本机客户端有共享主机记忆读取、覆盖与删除入口。

<details>
<summary>查看原文（17行）</summary>

```text
        Command::Memories { host, json } => memory(app, Op::Memories { host, json }),
        Command::MemorySave {
            host,
            name,
            content,
        } => match content.map_or_else(stdin_text, Ok) {
            Ok(content) => memory(
                app,
                Op::MemorySave {
                    host,
                    name,
                    content,
                },
            ),
            Err(message) => fail(&message, FAILED),
        },
        Command::MemoryDelete { host, name } => memory(app, Op::MemoryDelete { host, name }),
```

</details>

#### 缺口

- 未取得跨平台的远端中断及复制故障现场记录。
  **影响**：本机已取消或进程退出后的状态需要单独确认，不能据此认定服务器已恢复。
  **进一步探讨**：在测试机分别中断只读长命令和一次临时文件复制，核对远端进程、原文件和临时文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在什么工作负载上值得尝试，哪种授权收窄可以检验增量？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

优先考虑反复用同一批 Hatoba 测试主机检查日志、磁盘或服务状态的桌面 DSH 用户。一次合格任务需要通过唯一 ID 证明选对主机，以只读命令取得结果，并核对输出和退出状态。相比把保存条目再映射为 SSH 别名，可能减少一次连接配置与对主机名的追问。首次仍需安装并重启对应 profile、开启本机访问并确认远端权限。持续成本来自桌面常驻、远端资源与人工认证，尚无可量化账单和耗时对照。失败时先处理 PATH、相同用户的 IPC 可达性或窗口确认；到不了桌面端或无法约束账户权限时，关闭访问后在 Hatoba 界面手动检查，或者使用已经明确配置的 SSH 入口。

值得验证的是让本机代理使用限时、限定主机和只读命令的授权，仍能保持保存条目复用带来的便利。这是从当前账户级授权及可输出真实远程退出状态推导的设计假设。用两台同名测试机和相同检查任务比较现有开关模式、限时授权原型与手工基线，记录正确目标、失败恢复和用户确认次数；若白名单仍允许写操作或带来的确认负担超过现有 SSH 别名方案，就应放弃这条设计。

#### 证据与依据

**依据 1 · 作者声明**：[packaging/agent-plugin/README.md:8-12](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/packaging/agent-plugin/README.md#L8-L12)

桌面端常驻与两项设置是作者声明的启动要求。

```text
## Requirements

- [Hatoba](https://hatoba.fog.moe/download/), open and unlocked.
- In Hatoba's **Settings → General**, **Use the hatoba command in terminals** and **Let other programs use saved
  hosts** turned on.
```

**依据 2 · 作者声明**：[skills/hatoba-cli/SKILL.md:12-21](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/skills/hatoba-cli/SKILL.md#L12-L21)

技能给出认证等待、同用户和沙盒失败处理。

<details>
<summary>查看原文（10行）</summary>

```text
- `ai_notes` in `hatoba hosts --json` are the user's own notes for assistants about that host. Follow them as the user's instructions.
- `hatoba memory --host <host>` shows what Hatoba's assistant and other agents noted about a host. Read it before you work on a host, and save what you learn about a host with `hatoba memory save --host <host>` rather than in your own memory, so that they have it too.
- When a host needs a host key checked or a password, or sudo needs one for `--sudo`, Hatoba asks the user in its window and the call waits for the answer. Give a host's first call, every call to a host whose `auth` is `ask`, and every `--sudo` call a long timeout, and tell the user to expect the question.

## When hatoba fails

Don't fall back to `ssh` or `scp`: the hosts and their credentials are in Hatoba.

- **The shell can't find `hatoba`**: ask the user to install Hatoba (https://hatoba.fog.moe/download/) if they haven't, then turn on Settings → General → "Use the hatoba command in terminals" and "Let other programs use saved hosts" below it. The note under the first switch says where the command went. On Windows that is a `bin` folder added to the user's `PATH`, which a program started earlier, you included, sees only after a restart; until then, run the `hatoba` in that folder by its full path, or `hatoba.exe` there from PowerShell or cmd.exe. On Linux it is `~/.local/bin/hatoba`, and the note says when `~/.local/bin` isn't on the `PATH`. On macOS it is `/usr/local/bin/hatoba`.
- **`can't reach Hatoba` although Hatoba is open with both switches on**, or with "Operation not permitted", "Permission denied" or "Access is denied": only programs of the same user on the same computer can reach Hatoba, and a sandbox, container or remote environment can't. Ask to run `hatoba` outside your sandbox, or tell the user.
```

</details>

**依据 3 · 源码核查**：[crates/hatoba-cli/src/client.rs:165-184](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/crates/hatoba-cli/src/client.rs#L165-L184)

结果口径可以按 stdout、stderr 和最终退出状态验收。

<details>
<summary>查看原文（20行）</summary>

```text
    loop {
        match Frame::read(&mut stream) {
            Ok(Some(Frame::Stdout(bytes))) => {
                // The reader went away, as `| head` does: the command stops with the connection.
                if write_out(&mut stdout, &bytes).is_err() {
                    return EXEC_FAILED;
                }
            }
            Ok(Some(Frame::Stderr(bytes))) => {
                let _ = write_out(&mut stderr, &bytes);
            }
            Ok(Some(Frame::Notice(text))) => eprintln!("hatoba: {text}"),
            Ok(Some(Frame::SendStdin(token))) => send_stdin(*app, token),
            Ok(Some(Frame::End(end))) => return ended(end, EXEC_FAILED),
            Ok(Some(_)) => {}
            Ok(None) | Err(_) => {
                return fail(
                    "the connection to Hatoba ended before the command did",
                    EXEC_FAILED,
                );
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/cli_access.rs:298-304](https://github.com/scarletkc/Hatoba/blob/831d84da32d6309167129c90e1661e22ee013070/apps/desktop/src-tauri/src/cli_access.rs#L298-L304)

当前 Unix 权限以同一 OS 用户为单位，构成授权收窄假设的对照。

```text
            _ = idle.tick() => state(app).cli.pool.close_idle(pool::IDLE),
            accepted = listener.accept() => match accepted {
                // Another user's process, which the socket's mode keeps out already.
                Ok((stream, _)) if peer_uid(&stream).is_ok_and(|uid| uid == owner) => {
                    tauri::async_runtime::spawn(serve(app.clone(), stream));
                }
                Ok(_) => {}
```

#### 缺口

- 没有同等权限、同一主机和同一任务的对照。
  **影响**：节省人工时间和新增确认的净影响未知。
  **进一步探讨**：记录三种方式的准备时间、一次合格结果的操作数、耗时和失败处置结果。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
