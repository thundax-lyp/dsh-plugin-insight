# Mole DSH Skill

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ce56a5b](https://github.com/tw93/Mole/tree/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole)

<!-- BEGIN META -->
[![GitHub ★ 74,465](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74%2C465&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tw93/Mole) [![npm 30d 849](https://img.shields.io/static/v1?label=npm+30d&message=849&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mole) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mole)
<!-- END META -->

> **功能**：在 DSH 中用 Mole CLI 指导磁盘占用查询、清理预览、应用卸载和系统状态检查。

> **亮点**：将多平台的读、预览、确认和交接组织成对话步骤；核心清理能力仍由 Mole CLI 提供。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：注册器不执行授权校验，实际非交互清理会直接运行且重扫，用户确认的范围可能与执行时不同。[Q03](#research-q03)

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
  - [Q01 · 相比直接读 Mole 帮助，Skill 提供什么？](#detail-section-11)
  - [Q02 · 宿主怎样找到规则，平台差异怎样处理？](#detail-section-12)
  - [Q03 · 预览和授权为何仍不足以保证删除安全？](#detail-section-13)
  - [Q04 · 如何验证解释流程，减少预览和实际的范围差？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用本机 macOS 或 Windows、希望知道磁盘占用和清理风险的人，可通过对话获得 Mole 输出的解释。

直接阅读 CLI 帮助和手工执行同样可诊断，但要自己区分平台与处置风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Skill 注册 | 对话中调用 Mole 指南 | 依赖宿主 provider |
| 诊断说明 | 解释 CLI 输出 | 需本地平台与版本 |
| 预览交接 | 指导用户决定是否执行 | 批准属于对话规则 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| 本机 DSH | 加载 Skill | 需 skills 服务 |
| Mole CLI 与本机 shell | 读磁盘或运行维护 | 按平台与版本验证，云端不适用 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 用假 CLI 检查匹配平台 | 缺依赖只记录 |
| 持续 | 解释只读报告和风险 | 不能将预览当执行结果 |
| 退出 | 停止在诊断，禁用 Skill | 确认外部 CLI 由用户独立维护 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 人工 | 每份正确报告的核查时间 | 未测量 |
| 恢复 | 重建缓存或人工恢复文件 | 某些删除不可恢复 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 理解占用 | 正确区分缓存与用户数据 | 不预估腾出量 |
| 减少误删 | 已批准范围与真实候选一致 | 机制尚未验证 |

> **思考**：注册器不执行授权校验，实际非交互清理会直接运行且重扫，用户确认的范围可能与执行时不同。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多平台的读、预览、确认和交接组织成对话步骤；核心清理能力仍由 Mole CLI 提供。[Q01](#research-q01) [Q02](#research-q02)

共用说明和平台 references 让注册器很小，真实删除控制依赖外部 CLI、宿主和用户。

<a id="detail-section-5"></a>

### 1.4 主要限制

注册器不执行授权校验，实际非交互清理会直接运行且重扫，用户确认的范围可能与执行时不同。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在假 CLI 做诊断和预览演练。实际环境仅考虑经独立权限限制的只读诊断；不能确认处置范围时停在报告。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 Skill 注册，平台说明与清理效果未经本轮执行。

- 已检查：作者 README、包清单、源码路径 plugins/mole/index.js、plugins/mole/skills/mole/SKILL.md、plugins/mole/skills/mole/references/windows.md、plugins/mole/skills/mole/references/macos.md、plugins/mole/package.json、plugins/mole/cordis.patch.yml 及固定范围 inventory；组件：plugins/mole。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖 plugins/mole 子组件及随包两套平台说明；未执行外部 CLI、安装或目标系统。
- 下一步：使用假 CLI 测版本、只读结果、权限拒绝及预览漂移，检查是否正确拒绝进入删除。

**分析版本**

- **仓库**：[tw93/Mole](https://github.com/tw93/Mole)
- **版本号**：0.1.3（[固定提交 ce56a5b](https://github.com/tw93/Mole/tree/ce56a5b386e3acc10ff031473007f1de584f7fee)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用具备时限的候选清单约束批准，执行前检查是否漂移；如果正常批准大量受阻而越范围不减，就保留原有人工流程。[Q04](#research-q04)

使用假 CLI 测版本、只读结果、权限拒绝及预览漂移，检查是否正确拒绝进入删除。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 74 | 58 | 9 | — |
| .md | source | 5 | 509 | — | — | 5029 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/tw93/Mole/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 129](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=129&color=737b86&logo=github)](https://github.com/tw93/Mole/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 133](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=133&color=737b86&logo=github)](https://github.com/tw93/Mole/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 Mole 的 DSH Skill 能否让磁盘诊断更易核查，以及预览和真实删除的授权边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比直接读 Mole 帮助，Skill 提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

磁盘不足但不熟悉命令的本地 DSH 用户，可让助手按平台读取 Mole 的诊断结果，把占用和可能的处置分开解释。直接用 CLI 帮助同样能查询；Skill 的增量主要是把诊断、预览、人确认与终端交接变成可触发的对话步骤。入口只注册 bundled Skill provider，CLI 并未由此实现。文档开头的大容量清理属于预期用途，合格结果应是说明真正占用和可恢复性，不能预告具体释放值。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/mole/README.md:1-11](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/README.md#L1-L11)

作者描述查询与清理用途。

<details>
<summary>查看原文（11行）</summary>

```text
# Mole agent skill

Use AI to clear tens of GB of junk, remove apps and leftovers, and make your computer feel lighter.

Ask "clean up my computer", "optimize my computer" or "uninstall this app", and your agent finds the junk on your system, lists all of it, and cleans only after you agree.

If Mole is not installed yet, your agent asks first and installs it once you agree.

If you prefer an app, use the official [Mole](https://mole.fit/) app.

Install it in Claude Code with `/plugin marketplace add tw93/Mole` then `/plugin install mole@mole`, in Codex with `codex plugin marketplace add tw93/Mole` then `codex plugin add mole@mole`, or in DeepSeek Harness with `dsh plugin --profile <name> add dsh-mole`.
```

</details>

**依据 2 · 源码核查**：[plugins/mole/index.js:40-65](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/index.js#L40-L65)

注册的是 Skill 内容、调用方式和资源目录。

<details>
<summary>查看原文（26行）</summary>

```text
const provider = {
  name: PROVIDER,
  async list() {
    const { description } = await loadSkill()
    return [{
      name: 'mole',
      description,
      invocation: INVOCATION,
      provider: PROVIDER,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      rank: RANK,
      locator: SKILL_FILE,
    }]
  },
  async get() {
    const { description, content } = await loadSkill()
    return {
      name: 'mole',
      description,
      invocation: INVOCATION,
      provider: PROVIDER,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      content,
    }
```

</details>

**依据 3 · 源码核查**：[plugins/mole/index.js:69-74](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/index.js#L69-L74)

DSH 依赖 skills，只注册 provider。

```text
export const name = 'dsh-mole'
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
```

**依据 4 · 源码核查**：[plugins/mole/skills/mole/SKILL.md:20-38](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/SKILL.md#L20-L38)

界定真实文件风险及平台辨识。

<details>
<summary>查看原文（19行）</summary>

```text
Mole (`mo`) is a maintenance CLI with two editions that share one command
set: Mole CLI (macOS) and Mole CLI (Windows). It deletes real files on the
user's own machine. Your job is to read the machine, show the user exactly what
would change, and hand them the decision. Done means the user's question is
answered from Mole's own output, and nothing was removed that the user had not
seen and approved.

## 1. Identify the edition

Run `mo --version`. The second line names the system (`macOS: …` or
`Windows: …`). Then read exactly one reference and use only its commands:

- macOS: [references/macos.md](references/macos.md)
- Windows: [references/windows.md](references/windows.md)

The two editions differ in flags, JSON fields and what goes to the Trash or
Recycle Bin, so never carry a command across. If the installed version is older
than the one the reference names, or a flag is rejected, run
`mo <command> --help` and trust it over this skill.
```

</details>

#### 缺口

- 没有本机任务的操作成本和收益测量
  **影响**：不能判断较 CLI 帮助提升多少
  **进一步探讨**：让同一诊断任务分别使用说明和原生命令帮助，比较误分类

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主怎样找到规则，平台差异怎样处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口读取 SKILL.md 并归一 CRLF，以 frontmatter 提取 description 和触发词，向模型与用户开放调用，资源目录指向平台说明。操作要求先查看当前版本并只读取一套平台参考。Windows 卸载和部分预览需交用户终端，macOS 的卸载预览与清理有不同参数。这种组织便于复用同一 Skill，但版本差异和同名用户 Skill 优先会改变用户实际看到的内容。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/mole/index.js:10-33](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/index.js#L10-L33)

资源路径、优先级和 frontmatter 解析。

<details>
<summary>查看原文（24行）</summary>

```text
const SKILL_DIR = fileURLToPath(new URL('./skills/mole/', import.meta.url))
const SKILL_FILE = new URL('./skills/mole/SKILL.md', import.meta.url)
const PROVIDER = 'dsh-mole'
// BUNDLED_SKILL_RANK in @deepseek-ai/dsh-skill: a user's own `mole` skill wins.
const RANK = 600
const INVOCATION = { modelInvocable: true, userInvocable: true }
const RESOURCE_BASE = { kind: 'directory', path: SKILL_DIR }

function parseSkill(raw) {
  // A Git checkout on Windows may turn line endings into CRLF.
  const text = raw.replace(/\r\n/gu, '\n')
  const match = /^---\n([\s\S]*?)\n---\n/u.exec(text)
  if (match === null) throw new Error('dsh-mole: SKILL.md has no frontmatter')
  const field = (key) => {
    const line = new RegExp(`^${key}: (".*")$`, 'mu').exec(match[1])
    if (line === null) throw new Error(`dsh-mole: SKILL.md has no ${key}`)
    return JSON.parse(line[1])
  }
  return {
    // The host's catalog shows the model only name and description, so the
    // non-English trigger phrases have to live in the description here.
    description: `${field('description')} Triggers: ${field('when_to_use')}`,
    content: text.slice(match[0].length).trim(),
  }
```

</details>

**依据 2 · 源码核查**：[plugins/mole/skills/mole/SKILL.md:27-42](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/SKILL.md#L27-L42)

实际版本与平台决定命令。

<details>
<summary>查看原文（16行）</summary>

```text
## 1. Identify the edition

Run `mo --version`. The second line names the system (`macOS: …` or
`Windows: …`). Then read exactly one reference and use only its commands:

- macOS: [references/macos.md](references/macos.md)
- Windows: [references/windows.md](references/windows.md)

The two editions differ in flags, JSON fields and what goes to the Trash or
Recycle Bin, so never carry a command across. If the installed version is older
than the one the reference names, or a flag is rejected, run
`mo <command> --help` and trust it over this skill.

If `mo` is not found, tell the system from the shell (`uname` prints `Darwin`;
in PowerShell, `$env:OS` is `Windows_NT`), say so and offer the install command
from that system's reference. Install only after the user agrees.
```

</details>

**依据 3 · 源码核查**：[plugins/mole/skills/mole/references/windows.md:24-48](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/references/windows.md#L24-L48)

Windows 非交互及终端分工。

<details>
<summary>查看原文（25行）</summary>

```text
| Command | Without a console (how an agent runs it) | Who runs the real thing |
|---|---|---|
| `mo analyze --json [path]` | Read-only JSON | Agent |
| `mo status --json` / `mo status --watch --interval=1s` | Read-only JSON / NDJSON; write the interval with `=`, which 1.36.0 and older also parse | Agent |
| `mo history --json --limit N` | Read-only JSON, N is 1-200 | Agent |
| `mo uninstall --list` | Read-only JSON app inventory | Agent |
| `mo clean --dry-run` | Preview, writes the path list | Agent |
| `mo clean` | **Starts immediately, no confirmation.** User-level cleanup only | Agent after consent |
| `mo clean --system` | Needs an Administrator PowerShell, for the preview too: without it `mo clean --system --dry-run` shows only the user-level part | User, in an elevated PowerShell: `mo clean --system --dry-run`, then `mo clean --system` |
| `mo clean --game-media`, `mo clean --gpu-shaders` | Opt-in extras: game replays, screenshots and recordings older than 90 days; GPU shader caches that games rebuild on next launch | Agent after consent, only when the user asked for them |
| `mo optimize --dry-run` | Preview of maintenance tasks | Agent |
| `mo optimize` | **Starts immediately, no confirmation.** It ends with a y/N question about System File Checker, which takes minutes | Agent after consent; SFC is the user's call in their own console |
| `mo purge --dry-run` | Prints the project count and total, then opens a selection list that reads keys from a console; without one it errors out or waits | User. `mo purge --help` lists the folders it scans, and the agent may run that |
| `mo purge` | Selection list and a y/N confirmation | User |
| `mo uninstall --dry-run` | Selection list, needs a console | User |
| `mo uninstall` | Selection list, then each app's own uninstaller | User |
| `mo clean --whitelist` | Opens the whitelist in Notepad and waits | User, or edit the file (below) |
| `mo purge --paths` | Interactive editor | User |

`mo uninstall` takes no app name. After `--list`, tell the user which entry to
pick by its `name`; the selection list supports type-to-search. Ask them to run
`mo uninstall --dry-run` first, which names the uninstaller each app would use.
The vendor's uninstaller decides what it removes inside its own folder, such as
a game library or local saves; warn the user when the app keeps data there. There is no
`--yes` on any Windows command, and no installer or slim command.
```

</details>

**依据 4 · 源码核查**：[plugins/mole/skills/mole/references/macos.md:21-38](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/references/macos.md#L21-L38)

macOS 非交互和卸载分工。

<details>
<summary>查看原文（18行）</summary>

```text
| Command | Without a terminal (how an agent runs it) | Who runs the real thing |
|---|---|---|
| `mo analyze --json [path]` | Read-only JSON | Agent |
| `mo status --json` / `mo status --watch --interval 1s` | Read-only JSON / NDJSON | Agent |
| `mo history --json --limit N` | Read-only JSON, N is 1-200 | Agent |
| `mo uninstall --list` | Read-only JSON app inventory | Agent |
| `mo clean --dry-run` | Preview, writes the path list | Agent |
| `mo clean` | **Starts immediately, no confirmation.** User-level cleanup runs; system-level cleanup runs only if a sudo session is already cached, otherwise it is skipped and the output says so | Agent after consent, or the user for a full run including system caches |
| `mo optimize --dry-run` | Preview of maintenance tasks | Agent |
| `mo optimize` | **Starts immediately, no confirmation.** Tasks that need admin access are skipped without a cached sudo session | Agent after consent, or the user |
| `mo purge --dry-run` | Preview of project artifacts | Agent |
| `mo purge --yes` | Removes every eligible candidate unattended; without `--yes` a non-terminal run refuses | Agent only after consent to that exact candidate list |
| `mo uninstall --dry-run <name>` | Prints the removal plan and ends with "Dry run complete" and exit 0. Mole 1.61.0 and older end with "Uninstall confirmation needs an interactive terminal" and exit 1 instead; either way nothing was removed | Agent |
| `mo uninstall <name>` | Refuses without a terminal | User |
| `mo installer --dry-run` | Preview of `.dmg`, `.pkg`, `.iso`, `.xip`, `.zip` installers | Agent |
| `mo installer` | Selection list, needs a terminal | User |
| `mo slim --dry-run` | Lists universal apps and the Intel code that could be removed | Agent |
| `mo slim` | Without a terminal it only lists apps | User |
```

</details>

#### 缺口

- 实际 DSH 版本、注册优先级和本机 CLI 未验证
  **影响**：不能承诺自动匹配所有命令
  **进一步探讨**：在假宿主中确认同名规则排序，用替身返回两平台版本检查选择

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预览和授权为何仍不足以保证删除安全？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

Skill 指示先预览再征得用户同意，但 DSH 适配器不检查同意或限制 shell。两套参考说明非交互 clean 可立即执行，预览只是快照且真实执行重扫；macOS 缓存的管理员会话还影响系统范围。Windows 的 clean 和 purge 永久删除，卸载由厂商程序决定。Skill 的 sandbox 章节对 uninstall --list 是否可读前后有不一致表述，实际失败应按本机返回诊断而不能把空结果解释成无占用。环境至少需要本机 shell、Mole CLI 和符合包声明的 DSH。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/mole/skills/mole/SKILL.md:44-70](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/SKILL.md#L44-L70)

对话级同意，预览与实际重扫，终端交接。

<details>
<summary>查看原文（27行）</summary>

```text
## 2. Rules

1. **Read before you change.** Answer with the read-only commands first:
   `analyze --json`, `status --json`, `history --json`, `uninstall --list`, and
   every `--dry-run`. They are safe to run without asking.
2. **Preview before every removal.** Run the command with `--dry-run`, read
   the result, and summarize it for the user: total size, the largest groups,
   and for each group whether it is gone for good, goes to the Trash or Recycle
   Bin, or needs a download to rebuild. A preview is a snapshot; the real run
   rescans, so do not promise an exact number.
3. **Get consent before you type a removing command.** Without a terminal,
   `mo clean` and `mo optimize` do not ask for confirmation: they start as soon
   as they are invoked. The consent therefore has to come first, in this
   conversation, after the user has seen the preview. "Why is my disk full" is
   a question, not consent; "go ahead and clean those" after the preview is.
   Consent covers what the preview showed. `mo clean` and `mo optimize` have no
   selection list, so if the user wants only part of it, protect the rest first;
   commands with a list go to the user.
4. **Some steps belong to the user's terminal.** App uninstall, interactive
   selection lists, whitelist editors, and anything that needs an administrator
   password or an elevated shell cannot be completed from an agent. Give the
   user the exact command to run in their own terminal and stop. Never run
   `sudo`, ask for a password, or try to elevate.
5. **Use only the surfaces in the reference.** Never parse a full-screen TUI
   frame, never invent a flag such as `--yes` or `--force` where the reference
   does not list it, and never fall back to `rm`, `find -delete` or
   `Remove-Item` to remove what Mole skipped or protected. A skip is Mole's
```

</details>

**依据 2 · 源码核查**：[plugins/mole/skills/mole/SKILL.md:81-107](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/SKILL.md#L81-L107)

指出 sandbox 假成功和清单描述分歧。

<details>
<summary>查看原文（27行）</summary>

```text
## 3. If your shell is sandboxed

Many agent hosts deny writes outside the workspace. Mole writes under the home
folder, and removing a file counts as a write, so a sandbox changes what its
output means. The signs are `Operation not permitted` or `No such file or
directory` on `clean-list.txt` or `operations.log`, `audit log unavailable`,
`Unable to create a safe cleanup preview file`, and `top_processes: null` with
`fork/exec /bin/ps: operation not permitted`. On Windows they are `Access to the
path ... is denied` on `.config`, `clean-list.txt` or `app_scan_cache`, and a
bare `Access is denied` in the language of the system. There `mo analyze --json`
and `mo status --json` still work; `mo clean --dry-run`, `mo optimize --dry-run`
and `mo uninstall --list` do not.

- A failed preview is the sandbox, not an empty result and not a Mole bug. Say
  so.
- `mo --version` failing on `.config` on Windows means Mole has never run for
  this user. Running `mo --version` once in their own terminal creates the
  folder, and the read-only commands then work here.
- **Never run a removing command inside the sandbox.** `mo clean` can print
  `Cleanup complete` and exit 0 with nothing removed, because a denied delete
  reads as nothing to clean.
- Ask for wider access through the host's approval flow, for the exact command
  and with the reason, only if the host offers one. Otherwise give the user the
  command for their own terminal and stop. Rule 3 still applies either way.
- `status`, `analyze`, `history` and `uninstall --list` still read inside a
  sandbox. Without `top_processes`, say which process is using the CPU is
  unknown and hand the user `mo status`.
```

</details>

**依据 3 · 源码核查**：[plugins/mole/skills/mole/references/windows.md:56-67](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/references/windows.md#L56-L67)

永久删除、回收站与卸载边界。

<details>
<summary>查看原文（12行）</summary>

```text
## What a removal can be undone

- `mo clean`, `mo purge` and `mo optimize` delete permanently. `mo clean` does
  not empty the Recycle Bin.
- `mo uninstall` runs the app's registered uninstaller, which behaves as that
  vendor wrote it. Afterwards Mole moves a verified leftover install folder to
  the Recycle Bin, never deleting it permanently.
- Files deleted inside the interactive `mo analyze` go to the Recycle Bin.
- `mo purge` targets build output and dependency folders (`node_modules`,
  `target`, `build`, `dist`, `venv` and similar). Build output rebuilds
  offline; dependency folders need a download. Git-tracked content and nested
  repositories are kept.
```

</details>

**依据 4 · 源码核查**：[plugins/mole/skills/mole/references/macos.md:27-38](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/references/macos.md#L27-L38)

已缓存 sudo 会话与非交互执行说明。

<details>
<summary>查看原文（12行）</summary>

```text
| `mo clean --dry-run` | Preview, writes the path list | Agent |
| `mo clean` | **Starts immediately, no confirmation.** User-level cleanup runs; system-level cleanup runs only if a sudo session is already cached, otherwise it is skipped and the output says so | Agent after consent, or the user for a full run including system caches |
| `mo optimize --dry-run` | Preview of maintenance tasks | Agent |
| `mo optimize` | **Starts immediately, no confirmation.** Tasks that need admin access are skipped without a cached sudo session | Agent after consent, or the user |
| `mo purge --dry-run` | Preview of project artifacts | Agent |
| `mo purge --yes` | Removes every eligible candidate unattended; without `--yes` a non-terminal run refuses | Agent only after consent to that exact candidate list |
| `mo uninstall --dry-run <name>` | Prints the removal plan and ends with "Dry run complete" and exit 0. Mole 1.61.0 and older end with "Uninstall confirmation needs an interactive terminal" and exit 1 instead; either way nothing was removed | Agent |
| `mo uninstall <name>` | Refuses without a terminal | User |
| `mo installer --dry-run` | Preview of `.dmg`, `.pkg`, `.iso`, `.xip`, `.zip` installers | Agent |
| `mo installer` | Selection list, needs a terminal | User |
| `mo slim --dry-run` | Lists universal apps and the Intel code that could be removed | Agent |
| `mo slim` | Without a terminal it only lists apps | User |
```

</details>

**依据 5 · 源码核查**：[plugins/mole/package.json:32-38](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/package.json#L32-L38)

DSH 包要求和补丁。

```text
  "engines": {
    "dsh": ">=0.2.0 <0.3.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

#### 缺口

- CLI 实际删除和已缓存权限未在本轮执行
  **影响**：不能确认预览和实际一致
  **进一步探讨**：仅用假 CLI 重放二次扫描差异和拒绝，验证 Skill 能停止

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证解释流程，减少预览和实际的范围差？

**研究主题**：采用判断、新假设与验证

#### 完整回答

保留观察。用户可先拿假 CLI 的诊断和历史结果判断助手是否能解释占用，保持真实文件不变。若验证真实环境，应独立限制为只读诊断接口；Skill 文本本身没有建立删除隔离。可将预览候选及扫描条件形成有时限的批准清单，执行前若重扫变化则退回再确认。以同一批假文件模拟预览后新增、目录换指向和管理员权限变化，统计超范围路径与额外中断；若未减超范围却普遍挡住正常批准，则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/mole/skills/mole/SKILL.md:49-61](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/skills/mole/SKILL.md#L49-L61)

当前批准仅覆盖预览，真实重扫。

<details>
<summary>查看原文（13行）</summary>

```text
2. **Preview before every removal.** Run the command with `--dry-run`, read
   the result, and summarize it for the user: total size, the largest groups,
   and for each group whether it is gone for good, goes to the Trash or Recycle
   Bin, or needs a download to rebuild. A preview is a snapshot; the real run
   rescans, so do not promise an exact number.
3. **Get consent before you type a removing command.** Without a terminal,
   `mo clean` and `mo optimize` do not ask for confirmation: they start as soon
   as they are invoked. The consent therefore has to come first, in this
   conversation, after the user has seen the preview. "Why is my disk full" is
   a question, not consent; "go ahead and clean those" after the preview is.
   Consent covers what the preview showed. `mo clean` and `mo optimize` have no
   selection list, so if the user wants only part of it, protect the rest first;
   commands with a list go to the user.
```

</details>

**依据 2 · 源码核查**：[plugins/mole/index.js:69-74](https://github.com/tw93/Mole/blob/ce56a5b386e3acc10ff031473007f1de584f7fee/plugins/mole/index.js#L69-L74)

适配器没有批准执行控制，可作对照。

```text
export const name = 'dsh-mole'
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
```

#### 缺口

- 上游 CLI 是否提供可固定候选的接口未知
  **影响**：假设的实现成本未知
  **进一步探讨**：先在替身证明清单差异处理，再核对固定 CLI 接口

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
