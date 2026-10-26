# dsh-codex-cua

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[45f14f4](https://github.com/16601134718/dsh-codex-cua/tree/45f14f45dbb1b0c964a34cb2ab1088f6515e445d)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：把 Codex 桌面端的本地 computer-use 运行时以 DSH Skill 形式安装并复用。

> **核心亮点**：相对每次启动 CUA 进程，它用常驻会话显著减少握手并保留变量，同时把操作规范随 Skill 分发；增量集中在运行时桥接与安装封装。 [Q03](#research-q03)

> **风险与缺陷**：它依赖未随插件交付的桌面运行时、Chrome 扩展和 macOS AX 权限，且卸载不移除写入的 Skill；本轮未验证这些外部组件的当前协议和安全边界。 [Q04](#research-q04)

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
  - [Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？](#detail-section-11)
  - [Q02 · 能力如何从入口、注册、调用到状态变化实现？](#detail-section-12)
  - [Q03 · 相对原生能力或简单替代，固定版本增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本及效果证据如何？](#detail-section-16)
  - [Q07 · 实现有哪些可靠性取舍和可复用设计？](#detail-section-17)
  - [Q08 · 由贡献和限制能推导什么未验证方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，成功与停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向 macOS 上需要从 DSH 操作 Chrome 或原生应用的用户，复用已有 Codex CUA 环境完成浏览器与 AX 自动化。 [Q01](#research-q01)

基线是直接运行 cua-repl 或手工操作；插件降低启动与使用规范成本，但引入常驻进程、跨应用权限和残留文件管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill 安装 | 幂等部署 CUA Skill、客户端与文档。 | 仅由固定版本源码确认；运行效果未验证 |
| 浏览器控制 | 通过持久会话驱动 Chrome 标签页。 | 仅由固定版本源码确认；运行效果未验证 |
| 原生应用控制 | 通过 Sky 辅助功能接口操作 macOS 应用。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| macOS、Python 3.9+ | 必需 | 运行 cuad.py 与原生 AX | doctor 报缺失，能力不可用 |
| Codex/ChatGPT CUA 运行时与 Chrome 扩展 | 必需 | 提供 cua-repl、浏览器宿主与 MCP | 插件只复制 Skill，不能补齐运行时 |
| Sky/辅助功能权限 | 原生应用必需 | 读取和操作 AX | 原生控制失败或权限过宽 |
| DSH_HOME 写权限与清理责任 | 安装必需 | 持久写入 Skill 文件 | 挂载失败仅警告；卸载不会自动删除 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 安装/doctor | 插件复制 Skill，用户执行 doctor | 四个资产存在且运行时/扩展/AX 就绪 |
| 观察 | Agent 获取 tab 或 app 状态 | 先识别确定目标，不合并未知后续动作 |
| 操作 | cuad 发送单次确定性代码到常驻会话 | 结果与目标状态一致 |
| 超时恢复 | 返回 unknown 时只重新观察 | 禁止重发写操作；daemon 下次调用可重启 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 桌面运行时、扩展、Python 与常驻进程 | 授权 AX、运行 doctor、校准环境 | 权限配置分钟未知 |
| 持续使用 | cua-repl 内存、JSONL、Chrome/Sky 进程 | 观察—操作—再观察 | 当前 p50/p95 延迟未测 |
| 失败恢复 | daemon 重启和重放只限当次请求 | unknown 后人工核对、卸载时删 Skill | 重复写概率与日志增长未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 热会话 | daemon 与持久 JS 上下文设计存在 | README 延迟是否可复现 |
| 双表面控制 | Chrome 与 macOS AX 调用规范存在 | 当前运行时/扩展协议兼容 |
| 写安全 | 文档要求 unknown 后不重发 | 机制是否强制防止重复副作用 |

> **思考**：它依赖未随插件交付的桌面运行时、Chrome 扩展和 macOS AX 权限，且卸载不移除写入的 Skill；本轮未验证这些外部组件的当前协议和安全边界。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对每次启动 CUA 进程，它用常驻会话显著减少握手并保留变量，同时把操作规范随 Skill 分发；增量集中在运行时桥接与安装封装。 [Q03](#research-q03)

相对每次启动 CUA 进程，它用常驻会话显著减少握手并保留变量，同时把操作规范随 Skill 分发；增量集中在运行时桥接与安装封装。 [Q03](#research-q03)

内容相同跳过写入且挂载失败不破坏 profile，安装器较克制；真正复杂性在随包复制的 Python daemon 和外部运行时，本轮没有执行验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

它依赖未随插件交付的桌面运行时、Chrome 扩展和 macOS AX 权限，且卸载不移除写入的 Skill；本轮未验证这些外部组件的当前协议和安全边界。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅适合已经配置并信任 Codex CUA、Chrome 扩展和 macOS AX 权限的技术用户观察；不应把它用于不可逆提交、付款或敏感应用。若只读任务热调用显著优于每次新建、超时后重观察不重复写且卸载残留可接受，再考虑受限试用；出现结果 unknown 后重复副作用或跨应用权限超范围即停用。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在隔离 macOS 测试账户运行 doctor，然后重复只读标题、Finder AX 和可撤销表单写入各多次；记录首次/热 p50/p95、unknown、daemon 重启、JSONL 增长，并在写后故意超时，只重观察最终提交次数。任何重复写或权限越界即否定写操作采用。

**分析版本**

- **仓库**：[16601134718/dsh-codex-cua](https://github.com/16601134718/dsh-codex-cua)
- **版本号**：0.1.0（[固定提交 45f14f4](https://github.com/16601134718/dsh-codex-cua/tree/45f14f45dbb1b0c964a34cb2ab1088f6515e445d)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可为写操作增加请求级幂等键和观察前置条件，让超时后的“结果未知”自动转为只读复核，减少重复点击或重复提交。 [Q08](#research-q08)

在隔离 macOS 测试账户运行 doctor，然后重复只读标题、Finder AX 和可撤销表单写入各多次；记录首次/热 p50/p95、unknown、daemon 重启、JSONL 增长，并在写后故意超时，只重观察最终提交次数。任何重复写或权限越界即否定写操作采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 778 | — | — | 5071 |
| .js | source | 1 | 96 | 64 | 25 | — |
| .mjs | source | 1 | 77 | 55 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/16601134718/dsh-codex-cua/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-codex-cua 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向 macOS 上需要从 DSH 操作 Chrome 或原生应用的用户，复用已有 Codex CUA 环境完成浏览器与 AX 自动化。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是直接运行 cua-repl 或手工操作；插件降低启动与使用规范成本，但引入常驻进程、跨应用权限和残留文件管理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

```text
# dsh-codex-cua

在 DeepSeek Harness 里直接使用 Codex 的 computer use 能力。

装一个插件，DSH 的 agent 就能操作 Chrome 和任意 macOS 原生应用 ——
走的是 ChatGPT / Codex 桌面端自带的运行时（`cua-repl` + Chrome 扩展 + Sky 原生 AX），
不需要启动 ChatGPT 应用，也不向 OpenAI 发送请求（`cua-repl` 为本地进程）。

---

## 为什么是「无缝」

装好之后**没有额外步骤**：

| 你做的 | 实际发生的 |
| --- | --- |
| 插件市场点安装，或 `dsh plugin add dsh-codex-cua` | 插件把 `codex-cua` 技能写入 `~/.dsh/skills/codex-cua/` |
| 开新会话，让 agent 操作网页或应用 | agent 加载该技能，直接调 `cuad.py` |

`SKILL.md` 里已经写好调用规范、踩坑清单和延迟基线，
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

插件挂载时幂等复制 SKILL、Python 客户端与文档到 DSH_HOME；客户端通过 JSONL 请求常驻 cua-repl，持久 JS 上下文连接 Chrome 扩展和 Sky。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对每次启动 CUA 进程，它用常驻会话显著减少握手并保留变量，同时把操作规范随 Skill 分发；增量集中在运行时桥接与安装封装。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：它依赖未随插件交付的桌面运行时、Chrome 扩展和 macOS AX 权限，且卸载不移除写入的 Skill；本轮未验证这些外部组件的当前协议和安全边界。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

仅适用于 macOS，需要 ChatGPT/Codex 桌面运行时、Chrome 扩展、Sky/AX 权限和 Python 3.9+；还会在 DSH_HOME 写入长期 Skill 文件。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是安装 Codex/ChatGPT 桌面运行时、Chrome 扩展、Sky/AX 权限与 Python 3.9，并允许插件向 DSH_HOME 写 Skill；持续成本是常驻 cua-repl 进程、JSONL 请求/响应日志和浏览器/AX 操作等待；失败恢复包括 daemon 重启、超时结果 unknown 后只读复核，以及手工清理卸载残留 Skill。合格单位是一项浏览器或原生应用操作只执行一次且最终状态可观察。当前缺首次握手分布、热调用延迟、超时率、重复写概率和权限审计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

#### 缺口

- 缺少当前桌面运行时版本上的首次/热调用延迟、unknown 比例、daemon 重启次数、日志增长和重复写副作用。
  **影响**：无法验证 README 延迟数字仍适用，也不能判断持久会话是否安全降低总负担。
  **进一步探讨**：在隔离 macOS 用户中执行只读、单次写入和故障注入任务，记录 p50/p95 延迟、unknown、重观察结果、JSONL 字节和重复动作。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

内容相同跳过写入且挂载失败不破坏 profile，安装器较克制；真正复杂性在随包复制的 Python daemon 和外部运行时，本轮没有执行验证。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可为写操作增加请求级幂等键和观察前置条件，让超时后的“结果未知”自动转为只读复核，减少重复点击或重复提交。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

仅适合已经配置并信任 Codex CUA、Chrome 扩展和 macOS AX 权限的技术用户观察；不应把它用于不可逆提交、付款或敏感应用。若只读任务热调用显著优于每次新建、超时后重观察不重复写且卸载残留可接受，再考虑受限试用；出现结果 unknown 后重复副作用或跨应用权限超范围即停用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/16601134718/dsh-codex-cua/blob/45f14f45dbb1b0c964a34cb2ab1088f6515e445d/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-codex-cua — bring Codex computer use into DeepSeek Harness.
 *
 * On mount, this plugin installs the `codex-cua` skill into the active DSH
 * home (~/.dsh/skills/codex-cua) together with its runtime client and docs.
 * From then on the agent can load the skill and drive Chrome and native macOS
 * apps through the Codex computer-use runtime.
 *
 * Design notes:
 *  - Never throw out of apply(); a failure must not break profile composition.
 *  - The skill is written idempotently and only replaced when its content
 *    actually changes, so re-mounts are cheap and do not churn mtimes.
 *  - Removal of the plugin does not delete the skill: the files are useful on
 *    their own, and deleting user data on uninstall is surprising.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-codex-cua'

const HERE = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(HERE, '..')
const ASSETS = join(PKG_ROOT, 'assets')

/** DSH home: honours DSH_HOME, otherwise ~/.dsh. */
function dshHome() {
  const explicit = process.env.DSH_HOME
  if (explicit && explicit.trim()) return explicit
  return join(homedir(), '.dsh')
}

const FILES = [
  ['SKILL.md', 'SKILL.md'],
  ['cuad.py', 'cuad.py'],
  ['docs/pitfalls.md', 'docs/pitfalls.md'],
  ['docs/protocol.md', 'docs/protocol.md'],
]

```

</details>

#### 缺口

- 未在当前 Codex 桌面运行时验证协议、权限范围、超时和卸载残留。
  **影响**：computer-use 写操作可能产生外部副作用，源码安装器并不能证明运行安全。
  **进一步探讨**：在测试账户执行可撤销表单写入，注入 daemon 崩溃与超时，只允许重观察，核对最终提交次数和 AX/Chrome 权限。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
