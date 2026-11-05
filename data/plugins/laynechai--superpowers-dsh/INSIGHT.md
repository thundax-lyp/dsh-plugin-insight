# Superpowers DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cc0c87f](https://github.com/LayneChai/superpowers-dsh/tree/cc0c87f3a7a8627b175465f36a99e971e7eed507)

<!-- BEGIN META -->
[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LayneChai/superpowers-dsh) [![npm 30d 6,155](https://img.shields.io/static/v1?label=npm+30d&message=6%2C155&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/superpowers-dsh) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/superpowers-dsh)
<!-- END META -->

> **功能**：将上游软件开发方法作为可调用 DSH 技能注册

> **亮点**：[Q01](#research-q01) 把上游方法统一接入 DSH 技能目录。

> **主要限制**：[Q03](#research-q03) 技能内容为模型指导，执行和同名优先级需实测。

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
  - [Q01 · 谁需要这组技能？](#detail-section-11)
  - [Q02 · 插件如何交付技能？](#detail-section-12)
  - [Q03 · 是否强制执行工程流程？](#detail-section-13)
  - [Q04 · 如何最小成本采用？](#detail-section-14)
  - [Q05 · 什么结果支持保留？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者希望在 DSH 中复用规划、调试与验证约定。

逐个复制 SKILL.md 或项目内维护指令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工安装 | 单独选择流程 | 需维护路径和版本 |
| Superpowers DSH | 统一发现与调用 | 需管理规则重叠 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills registry | 必需 | 注册与发现技能 | 目标 profile 验证 |
| 上游技能文本 | 随包 | 工程方法 | 评估与团队规范一致性 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离 profile 与固定任务 | 保留无插件基准 |
| 执行 | 分别运行调试 | 观察技能调用 |
| 复核 | 比较验证与冲突 | 留存工具轨迹 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装渠道成本未知 | 配置及重启耗时未知 | 依宿主变化 |
| 持续 | 提示开销未知 | 处理规则冲突耗时未知 | 依任务及已装技能变化 |
| 恢复 | 版本回退成本未知 | 卸载和恢复目录耗时未知 | 取决于 profile |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 目录发现 | 核对列表和正文 | 技能与资源可读取 |
| 工作流收益 | 对照复现与验证步骤 | 记录越权和回归结果 |

> **思考**：[Q03](#research-q03) 技能内容为模型指导，执行和同名优先级需实测。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把上游方法统一接入 DSH 技能目录。

技能注册、解析和资源定位均可从固定源码追踪。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 技能内容为模型指导，执行和同名优先级需实测。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离 profile 选择一个技能，对照团队现有规范。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的让同一 profile 的开发会话可选加载统一工作流。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、skills/test-driven-development/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的让同一 profile 的开发会话可选加载统一工作流。未执行目标代码或实际宿主验证。
- 下一步：至少保留一轮工具轨迹供对照。

**分析版本**

- **仓库**：[LayneChai/superpowers-dsh](https://github.com/LayneChai/superpowers-dsh)
- **版本号**：0.4.0（[固定提交 cc0c87f](https://github.com/LayneChai/superpowers-dsh/tree/cc0c87f3a7a8627b175465f36a99e971e7eed507)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 统一注册可能减少配置成本，并提高缺陷修复中实际执行验证的比例。

至少保留一轮工具轨迹供对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 483 | 355 | 73 | — |
| .md | source | 67 | 9501 | — | — | 57264 |
| .mjs | source | 3 | 723 | 536 | 130 | — |
| .cjs | source | 1 | 723 | 575 | 76 | — |
| .ts | source | 1 | 158 | 74 | 71 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/LayneChai/superpowers-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让同一 profile 的开发会话可选加载统一工作流

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这组技能？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 内反复进行规划、调试和验证的开发者。与逐个复制技能相比，一个插件提供上游 Superpowers 的统一安装入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-23](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/README.md#L13-L23)

作者说明上游移植和 host 层用途

<details>
<summary>查看原文（11行）</summary>

```text
# superpowers-dsh

为 **DeepSeek Harness (DSH)** 打造的 Superpowers 插件包：把
[obra/superpowers](https://github.com/obra/superpowers) 的核心技能
（Claude-Code 技能库：TDD、调试、规划、协作模式）移植到 DSH 的 Cordis
插件架构上。

插件会向 `ctx.skills` 注册表的 **host 层** 注册一个技能提供者，因此每个
agent preset 的作用域链都会合并这些技能。技能正文随包分发
（`skills/<name>/SKILL.md`），通过 `import.meta.url` 定位——这是包的
组装事实，不需要任何用户配置。
```

</details>

**依据 2 · 作者声明**：[README.md:36-40](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/README.md#L36-L40)

作者列出 15 个技能及同步版本

```text
## 在 DeepSeek Harness 中安装与使用

这是 DeepSeek Harness 的**插件包**。安装后会把下面的 15 个技能注册进
host 技能注册表，你 profile 里的每个 agent 会话都能在技能目录中看到它们，
并可用 `skill` 工具加载。技能内容同步自上游 **obra/superpowers v7.0.1**。
```

#### 缺口

- 技能集合可能覆盖现有团队指令。
  **影响**：统一发现减少手工维护。
  **进一步探讨**：只选一个调试任务先验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件如何交付技能？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

provider 枚举每个子目录的 SKILL.md，抽取元数据，注册可由用户或模型调用的候选。取正文时带资源目录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:88-116](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/lib/index.js#L88-L116)

目录发现并构造候选

<details>
<summary>查看原文（29行）</summary>

```text
async function discoverCandidates(skillsRoot, signal) {
  let entries
  try {
    entries = await readdir(skillsRoot, { withFileTypes: true })
  } catch {
    return []
  }
  const candidates = []
  for (const entry of entries) {
    if (signal?.aborted) break
    if (!entry.isDirectory()) continue
    const skillDir = join(skillsRoot, entry.name)
    const skillFile = join(skillDir, 'SKILL.md')
    const parsed = await parseSkillFile(skillFile, signal)
    if (parsed === undefined) continue
    candidates.push({
      name: parsed.name,
      description: parsed.description,
      ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
      invocation: { modelInvocable: true, userInvocable: true },
      source: SOURCE,
      provider: name,
      rank: PACKAGED_SKILL_RANK,
      locator: skillDir,
      path: skillFile,
      ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {})
    })
  }
  return candidates
```

</details>

**依据 2 · 源码核查**：[lib/index.js:119-143](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/lib/index.js#L119-L143)

注册 provider 并在读取时设置资源根

<details>
<summary>查看原文（25行）</summary>

```text
/** Register the packaged superpowers provider on `ctx.skills`. */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: { modelInvocable: true, userInvocable: true },
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
```

</details>

#### 缺口

- 缺失或无法解析的技能不会进入候选。
  **影响**：路径与资源能跟随包分发。
  **进一步探讨**：检查列表、读取及资源定位。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 是否强制执行工程流程？

**研究主题**：缺陷与关键质疑

#### 完整回答

TDD 文件要求先看到失败再改代码，这是给 agent 的文本指导。provider 暴露文本，源材料没有证明模型会严格执行。解析器只处理单行键值，扩展元数据也需测试。

#### 证据与依据

**依据 1 · 源码核查**：[skills/test-driven-development/SKILL.md:6-27](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/skills/test-driven-development/SKILL.md#L6-L27)

测试先行和例外以技能文本表达

<details>
<summary>查看原文（22行）</summary>

```text
# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (ask your human partner):**
- Throwaway prototypes
- Generated code
- Configuration files
```

</details>

**依据 2 · 源码核查**：[lib/index.js:37-53](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/lib/index.js#L37-L53)

元数据用单行正则解析

<details>
<summary>查看原文（17行）</summary>

```text
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const block = text.slice(3, end)
  const body = text.slice(end + 4).replace(/^\n+/, '')
  const metadata = {}
  for (const line of block.split('\n')) {
    const match = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line.trim())
    if (!match) continue
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    metadata[match[1]] = value
  }
  return { metadata, body }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:119-143](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/lib/index.js#L119-L143)

读取返回内容和调用元数据

<details>
<summary>查看原文（25行）</summary>

```text
/** Register the packaged superpowers provider on `ctx.skills`. */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: { modelInvocable: true, userInvocable: true },
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
```

</details>

#### 缺口

- 同名技能与团队规则冲突时需确认宿主行为。
  **影响**：规范能否执行取决于实际会话。
  **进一步探讨**：为同名技能和项目禁令设计反例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何最小成本采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者说明需用 DSH 插件命令挂入 profile 并重启，也可用本地 tarball。隔离 profile 先确认技能列表和行为。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-99](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/README.md#L65-L99)

作者区分普通 npm 安装与 DSH profile 安装

<details>
<summary>查看原文（35行）</summary>

````text

包已发布到 npm，名为 `superpowers-dsh`（国内会自动同步到 npmmirror 镜像）：

```sh
dsh plugin --profile web add superpowers-dsh
```

> 必须用 `dsh plugin` 形式——直接 `npm install superpowers-dsh` 只会把包当
> 普通库装到当前目录，**不会**注册进任何 DeepSeek Harness profile，技能
> 永远不会被加载。

### 从 GitHub 安装

```sh
# 任意目录下执行
dsh plugin --profile web add https://github.com/LayneChai/superpowers-dsh.git
```

### 从 tarball 或本地文件夹安装

```sh
# tarball（例如 Release 里的 superpowers-dsh-0.1.0.tgz）
dsh plugin --profile web add C:\路径\to\superpowers-dsh-0.1.0.tgz

# 或解压后的插件文件夹（pnpm 以链接方式安装，改完重启即生效）
dsh plugin --profile web add C:\路径\to\superpowers-dsh
```

### 重启并验证

bundle 层在 profile 启动时挂载，所以需要**重启 profile**（停掉后重新运行
`dsh web` / `npx @deepseek-ai/dsh web`，再刷新浏览器）。确认层已组合：

```sh
dsh --profile web --dump-config     # 必须出现 `superpowers-dsh` 行
````

</details>

#### 缺口

- profile 内多个 agent 可能见到同一组技能。
  **影响**：试用要看现有规则是否重复。
  **进一步探讨**：用隔离 profile 并固定包版本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果支持保留？

**研究主题**：新假设与验证

#### 完整回答

用同一个可复现 bug 比较原配置与启用版，记录定位步骤、额外上下文、回归验证与越权行为，关注是否真的执行最小验证。

#### 证据与依据

**依据 1 · 源码核查**：[skills/test-driven-development/SKILL.md:6-27](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/skills/test-driven-development/SKILL.md#L6-L27)

技能规定了可观察的测试过程

<details>
<summary>查看原文（22行）</summary>

```text
# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (ask your human partner):**
- Throwaway prototypes
- Generated code
- Configuration files
```

</details>

**依据 2 · 源码核查**：[lib/index.js:119-143](https://github.com/LayneChai/superpowers-dsh/blob/cc0c87f3a7a8627b175465f36a99e971e7eed507/lib/index.js#L119-L143)

内容在调用时提供给 agent

<details>
<summary>查看原文（25行）</summary>

```text
/** Register the packaged superpowers provider on `ctx.skills`. */
function apply(ctx) {
  const skillsRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
  ctx.skills.registerProvider((control) => ({
    name,
    async list(options) {
      return discoverCandidates(skillsRoot, options.signal)
    },
    async get(candidate, options) {
      const parsed = await parseSkillFile(candidate.path, options.signal)
      if (parsed === undefined) return undefined
      return {
        name: parsed.name,
        description: parsed.description,
        ...(parsed.whenToUse !== undefined ? { whenToUse: parsed.whenToUse } : {}),
        invocation: { modelInvocable: true, userInvocable: true },
        source: SOURCE,
        provider: name,
        resourceBase: { kind: 'directory', path: candidate.locator },
        path: candidate.path,
        ...(Object.keys(parsed.metadata).length > 0 ? { metadata: parsed.metadata } : {}),
        content: parsed.content
      }
    }
  }))
```

</details>

#### 缺口

- 缺少同任务对照。
  **影响**：可区分技能发现和行为收益。
  **进一步探讨**：至少保留一轮工具轨迹供对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
