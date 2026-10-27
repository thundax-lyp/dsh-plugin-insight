# @7dgroup/dsh-skill-7d-git-commit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[557e05f](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/tree/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)
<!-- END META -->

> **实现功能**：把 7DGroup Git 提交规范作为低优先级内嵌 Skill 注册到 DSH，并允许本地同名 Skill 覆盖。

> **核心亮点**：相对复制 Markdown，它提供可安装、可版本化且可被本地同名规则覆盖的规范载体；增量主要是分发和优先级接线，不是新的 Git 算法。其价值取决于团队确实使用 7DGroup 约定，通用 Conventional Commits 团队可能只需更小的本地说明。 详见[Q03](#research-q03)。

> **风险与缺陷**：关键质疑是组织规范是否与目标仓库一致。Skill 内容可指导消息，但无法证明 diff 已审阅、测试已通过或提交得到授权；若被更高优先级同名 Skill 阴影，安装包存在却不生效。把格式合规误当提交质量会放大自动提交风险。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 @7dgroup/dsh-skill-7d-git-commit，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · @7dgroup/dsh-skill-7d-git-commit 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，@7dgroup/dsh-skill-7d-git-commit 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 @7dgroup/dsh-skill-7d-git-commit 的核心价值不成立？](#detail-section-14)
  - [Q05 · @7dgroup/dsh-skill-7d-git-commit 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · @7dgroup/dsh-skill-7d-git-commit 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · @7dgroup/dsh-skill-7d-git-commit 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 @7dgroup/dsh-skill-7d-git-commit？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：采用 7DGroup commit 约定的团队希望代理在提交前稳定生成类型、范围、主题、正文等结构；基线是把规范复制进仓库 AGENTS 或人工审查。合格结果是消息符合仓库约定且不替用户执行未授权提交，本地项目规则能覆盖包内默认。 详见[Q01](#research-q01)。

采用 7DGroup commit 约定的团队希望代理在提交前稳定生成类型、范围、主题、正文等结构；基线是把规范复制进仓库 AGENTS 或人工审查。合格结果是消息符合仓库约定且不替用户执行未授权提交，本地项目规则能覆盖包内默认。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 7d-git-commit Skill | 指导代理生成团队约定的提交消息 | 只提供规范，不授予提交或推送权限 |
| 覆盖诊断 | 识别本地同名 Skill 阴影 | 保留高优先级项目规则，冲突需人工处理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills 服务 | 必需 | 注册并读取 bundled Skill | 缺失则目录无该 Skill |
| invariants 服务 | 必需 | 检查唯一可见 provider | 冲突会报告本地赢家 |
| Git 仓库规则与用户授权 | 任务必需 | 决定消息是否可用和能否提交 | Skill 不能替代治理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 管理员添加 composition bundle | 技能目录出现 7d-git-commit |
| 调用 | 代理在提交消息任务中读取 Skill | 输出符合 7D 字段约定的草案 |
| 审阅 | 用户核对 staged diff 与仓库规则 | 不一致时由本地 Skill 覆盖 |
| 提交 | 经单独授权后执行 Git | 无授权只交付消息草案 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包安装资源，未见外部服务费 | 比对组织规则并检查同名来源 | 规则对齐耗时未知 |
| 持续使用 | 无独立 API 费；占少量上下文 | 每次审 diff 和消息 | 不能省略授权确认 |
| 失败恢复 | 无远端副作用 | 解决 Skill 阴影或重写消息 | 不要自动 amend/force push |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 规范可发现性 | 源码确认 bundled provider 注册 | 真实团队一致性 |
| 项目可覆盖 | rank 600 让本地根优先 | 复杂多根冲突体验 |
| 提交质量 | Skill 给出流程与格式 | 测试、diff 正确性和批准未验证 |

> **思考**：关键质疑是组织规范是否与目标仓库一致。Skill 内容可指导消息，但无法证明 diff 已审阅、测试已通过或提交得到授权；若被更高优先级同名 Skill 阴影，安装包存在却不生效。把格式合规误当提交质量会放大自动提交风险。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对复制 Markdown，它提供可安装、可版本化且可被本地同名规则覆盖的规范载体；增量主要是分发和优先级接线，不是新的 Git 算法。其价值取决于团队确实使用 7DGroup 约定，通用 Conventional Commits 团队可能只需更小的本地说明。 详见[Q03](#research-q03)。

相对复制 Markdown，它提供可安装、可版本化且可被本地同名规则覆盖的规范载体；增量主要是分发和优先级接线，不是新的 Git 算法。其价值取决于团队确实使用 7DGroup 约定，通用 Conventional Commits 团队可能只需更小的本地说明。 详见[Q03](#research-q03)。

provider 将元数据、locator 和延迟 readFile 分开，rank 注释明确解释覆盖语义，invariant 可诊断同名赢家；这是可复用的“组织 Skill 包装”模式。迁移成本在于维护资产与实际团队规则同步，并避免包升级覆盖项目特例。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是组织规范是否与目标仓库一致。Skill 内容可指导消息，但无法证明 diff 已审阅、测试已通过或提交得到授权；若被更高优先级同名 Skill 阴影，安装包存在却不生效。把格式合规误当提交质量会放大自动提交风险。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已明确采用 7DGroup commit 规范且愿意保留提交授权门禁的团队试用；其他团队应先读 Skill 内容，和本地 COMMIT-RULES 对齐后再装。验收只看生成消息和覆盖优先级，绝不能把插件出现或 invariant 通过当作提交授权。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了包内 7d-git-commit Skill 以 bundled 最低优先级注册，并能诊断本地同名 Skill 阴影；本轮未在目标团队仓库生成或校验提交消息，故只确认规范分发与覆盖机制，不确认其和当前服务端 hook 一致，也不构成提交授权。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在隔离仓库仅生成不提交的 50 条消息，按真实 7D hook 校验并由维护者盲审 scope/type/subject；同时放置项目同名 Skill 验证覆盖来源，若包内规则频繁与 hook 分歧则停止采用。

**分析版本**

- **仓库**：[7dgroup-ai/dsh-skill-7d-git-commit](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit)
- **版本号**：0.1.0-rc.3（[固定提交 557e05f](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/tree/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将组织级提交 Skill 与服务端 hook 共享同一机器可读规则，可减少代理建议与 GitLab 拒绝规则漂移。最小验证在 50 个历史 diff 上比较人工消息、仅 Skill、Skill+同源 hook，统计一次通过率、语义误分类和人工修订分钟；hook 与 Skill 不一致仍频繁发生即否定。 详见[Q08](#research-q08)。

在隔离仓库仅生成不提交的 50 条消息，按真实 7D hook 校验并由维护者盲审 scope/type/subject；同时放置项目同名 Skill 验证覆盖来源，若包内规则频繁与 hook 分歧则停止采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1282 | — | — | 11820 |
| .ts | source | 3 | 142 | 78 | 51 | — |
| .ts | test | 1 | 36 | 32 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：@7dgroup/dsh-skill-7d-git-commit 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 @7dgroup/dsh-skill-7d-git-commit，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

采用 7DGroup commit 约定的团队希望代理在提交前稳定生成类型、范围、主题、正文等结构；基线是把规范复制进仓库 AGENTS 或人工审查。合格结果是消息符合仓库约定且不替用户执行未授权提交，本地项目规则能覆盖包内默认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-69](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/README.md#L43-L69)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

````text
## Features

- **Client-side commit validation** before `git commit` is executed.
- **9 fixed Chinese type tags** such as `【新增】`, `【修复】`, `【优化】`, `【文档】`, etc.
- **Title length, punctuation, forbidden characters/phrases, and wording rules** from the 7DGroup convention.
- **Body formatting rules**: numbered lists, max 70 chars per line.
- **Exemptions** for merge commits and emergency `[skip-check]` deployments.
- **Bundled reference** `references/git-commit-message.md` acts as the source of truth and is loaded on demand.
- **Zero core changes** — pure composition bundle.

## Project Structure

```
dsh-skill-7d-git-commit/
├── src/
│   ├── index.ts              # Cordis plugin: registers the skill provider
│   └── invariant.ts          # Package-owned invariant companion
├── assets/7d-git-commit/
│   ├── SKILL.md              # Skill body (validation logic)
│   └── references/
│       └── git-commit-message.md   # 7DGroup commit convention reference
├── assets/images/
│   └── 7d-git-commit-cover.jpg     # README cover image
├── tests/
│   └── skill-7d-git-commit.spec.ts
├── cordis.patch.yml          # Composition layer patch
├── tsdown.config.ts          # Self-contained transpile config
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · @7dgroup/dsh-skill-7d-git-commit 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

包把 assets/7d-git-commit/SKILL.md 暴露为 bundled provider，使用 BUNDLED_SKILL_RANK 注册到 ctx.skills；同名项目或用户目录 rank 更高时本地版本胜出。invariant 在目录里检查唯一可见项并把冲突来源写进错误。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-70](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/index.ts#L18-L70)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（53行）</summary>

```text
const SKILL_BODY_URL = new URL('../assets/7d-git-commit/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/7d-git-commit/', import.meta.url)).replace(/[\\/]$/, ''),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION = '7DGroup 提交规范适配 Skill：在生成 git commit message 前自动校验并套用 7DGroup 项目的提交规范，规避服务端 pre-receive hook 拦截。当用户需要 git commit 或生成提交信息时使用。'

// rank 语义（ctx.skills 同层同名技能按 rank 升序取优，小者胜出）：
//   项目 .dsh/skills=100 · 项目 .agents/skills=200 · custom=300 ·
//   ~/.dsh/skills=400 · ~/.agents/skills=500 · bundled=600
// BUNDLED_SKILL_RANK 是所有根中最低优先级，因此任何本地文件系统同名
// `7d-git-commit` 技能（如 ~/.agents/skills/7d-git-commit、项目 .agents/skills/）
// 都会覆盖本包技能。安装后会话中"看不到 7DGroup 版"多为该原因 ——
// 技能仍由本 provider 正常注册，只是被更高优先级的同名候选遮蔽，
// 诊断与处理见 README「故障排查」章节。

/* jscpd:ignore-start */
const CANDIDATE: SkillCandidate = {
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-git-commit'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-git-commit` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，@7dgroup/dsh-skill-7d-git-commit 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对复制 Markdown，它提供可安装、可版本化且可被本地同名规则覆盖的规范载体；增量主要是分发和优先级接线，不是新的 Git 算法。其价值取决于团队确实使用 7DGroup 约定，通用 Conventional Commits 团队可能只需更小的本地说明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-69](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/README.md#L43-L69)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

````text
## Features

- **Client-side commit validation** before `git commit` is executed.
- **9 fixed Chinese type tags** such as `【新增】`, `【修复】`, `【优化】`, `【文档】`, etc.
- **Title length, punctuation, forbidden characters/phrases, and wording rules** from the 7DGroup convention.
- **Body formatting rules**: numbered lists, max 70 chars per line.
- **Exemptions** for merge commits and emergency `[skip-check]` deployments.
- **Bundled reference** `references/git-commit-message.md` acts as the source of truth and is loaded on demand.
- **Zero core changes** — pure composition bundle.

## Project Structure

```
dsh-skill-7d-git-commit/
├── src/
│   ├── index.ts              # Cordis plugin: registers the skill provider
│   └── invariant.ts          # Package-owned invariant companion
├── assets/7d-git-commit/
│   ├── SKILL.md              # Skill body (validation logic)
│   └── references/
│       └── git-commit-message.md   # 7DGroup commit convention reference
├── assets/images/
│   └── 7d-git-commit-cover.jpg     # README cover image
├── tests/
│   └── skill-7d-git-commit.spec.ts
├── cordis.patch.yml          # Composition layer patch
├── tsdown.config.ts          # Self-contained transpile config
````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 @7dgroup/dsh-skill-7d-git-commit 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是组织规范是否与目标仓库一致。Skill 内容可指导消息，但无法证明 diff 已审阅、测试已通过或提交得到授权；若被更高优先级同名 Skill 阴影，安装包存在却不生效。把格式合规误当提交质量会放大自动提交风险。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-70](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/index.ts#L18-L70)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（53行）</summary>

```text
const SKILL_BODY_URL = new URL('../assets/7d-git-commit/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/7d-git-commit/', import.meta.url)).replace(/[\\/]$/, ''),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION = '7DGroup 提交规范适配 Skill：在生成 git commit message 前自动校验并套用 7DGroup 项目的提交规范，规避服务端 pre-receive hook 拦截。当用户需要 git commit 或生成提交信息时使用。'

// rank 语义（ctx.skills 同层同名技能按 rank 升序取优，小者胜出）：
//   项目 .dsh/skills=100 · 项目 .agents/skills=200 · custom=300 ·
//   ~/.dsh/skills=400 · ~/.agents/skills=500 · bundled=600
// BUNDLED_SKILL_RANK 是所有根中最低优先级，因此任何本地文件系统同名
// `7d-git-commit` 技能（如 ~/.agents/skills/7d-git-commit、项目 .agents/skills/）
// 都会覆盖本包技能。安装后会话中"看不到 7DGroup 版"多为该原因 ——
// 技能仍由本 provider 正常注册，只是被更高优先级的同名候选遮蔽，
// 诊断与处理见 README「故障排查」章节。

/* jscpd:ignore-start */
const CANDIDATE: SkillCandidate = {
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-git-commit'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-git-commit` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · @7dgroup/dsh-skill-7d-git-commit 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DSH skills 服务和 invariants，包内资产必须随发布存在；实际提交还依赖仓库 Git 状态、用户授权及项目自己的提交规则。冲突时应保留本地高优先级规则，而不是强行提升 bundled rank。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-69](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/README.md#L43-L69)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

````text
## Features

- **Client-side commit validation** before `git commit` is executed.
- **9 fixed Chinese type tags** such as `【新增】`, `【修复】`, `【优化】`, `【文档】`, etc.
- **Title length, punctuation, forbidden characters/phrases, and wording rules** from the 7DGroup convention.
- **Body formatting rules**: numbered lists, max 70 chars per line.
- **Exemptions** for merge commits and emergency `[skip-check]` deployments.
- **Bundled reference** `references/git-commit-message.md` acts as the source of truth and is loaded on demand.
- **Zero core changes** — pure composition bundle.

## Project Structure

```
dsh-skill-7d-git-commit/
├── src/
│   ├── index.ts              # Cordis plugin: registers the skill provider
│   └── invariant.ts          # Package-owned invariant companion
├── assets/7d-git-commit/
│   ├── SKILL.md              # Skill body (validation logic)
│   └── references/
│       └── git-commit-message.md   # 7DGroup commit convention reference
├── assets/images/
│   └── 7d-git-commit-cover.jpg     # README cover image
├── tests/
│   └── skill-7d-git-commit.spec.ts
├── cordis.patch.yml          # Composition layer patch
├── tsdown.config.ts          # Self-contained transpile config
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · @7dgroup/dsh-skill-7d-git-commit 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次仅安装 bundle 并确认目录中 7d-git-commit 的来源；持续成本是每次提交前读取 Skill、检查 staged diff 和人工确认消息；失败恢复针对阴影冲突应改名或移除重复 provider，针对格式错误只重写消息，不应重做代码或自动提交。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-70](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/index.ts#L18-L70)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（53行）</summary>

```text
const SKILL_BODY_URL = new URL('../assets/7d-git-commit/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/7d-git-commit/', import.meta.url)).replace(/[\\/]$/, ''),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION = '7DGroup 提交规范适配 Skill：在生成 git commit message 前自动校验并套用 7DGroup 项目的提交规范，规避服务端 pre-receive hook 拦截。当用户需要 git commit 或生成提交信息时使用。'

// rank 语义（ctx.skills 同层同名技能按 rank 升序取优，小者胜出）：
//   项目 .dsh/skills=100 · 项目 .agents/skills=200 · custom=300 ·
//   ~/.dsh/skills=400 · ~/.agents/skills=500 · bundled=600
// BUNDLED_SKILL_RANK 是所有根中最低优先级，因此任何本地文件系统同名
// `7d-git-commit` 技能（如 ~/.agents/skills/7d-git-commit、项目 .agents/skills/）
// 都会覆盖本包技能。安装后会话中"看不到 7DGroup 版"多为该原因 ——
// 技能仍由本 provider 正常注册，只是被更高优先级的同名候选遮蔽，
// 诊断与处理见 README「故障排查」章节。

/* jscpd:ignore-start */
const CANDIDATE: SkillCandidate = {
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-git-commit'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-git-commit` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
```

</details>

#### 缺口

- Skill 与目标团队当前服务端校验规则是否同源未知
  **影响**：规则漂移会导致消息看似合规仍被拒绝
  **进一步探讨**：抽取同一规则生成 Skill 与 hook，在 50 个历史 diff 上比较一次通过率和人工修订量

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · @7dgroup/dsh-skill-7d-git-commit 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

provider 将元数据、locator 和延迟 readFile 分开，rank 注释明确解释覆盖语义，invariant 可诊断同名赢家；这是可复用的“组织 Skill 包装”模式。迁移成本在于维护资产与实际团队规则同步，并避免包升级覆盖项目特例。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-70](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/index.ts#L18-L70)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（53行）</summary>

```text
const SKILL_BODY_URL = new URL('../assets/7d-git-commit/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/7d-git-commit/', import.meta.url)).replace(/[\\/]$/, ''),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION = '7DGroup 提交规范适配 Skill：在生成 git commit message 前自动校验并套用 7DGroup 项目的提交规范，规避服务端 pre-receive hook 拦截。当用户需要 git commit 或生成提交信息时使用。'

// rank 语义（ctx.skills 同层同名技能按 rank 升序取优，小者胜出）：
//   项目 .dsh/skills=100 · 项目 .agents/skills=200 · custom=300 ·
//   ~/.dsh/skills=400 · ~/.agents/skills=500 · bundled=600
// BUNDLED_SKILL_RANK 是所有根中最低优先级，因此任何本地文件系统同名
// `7d-git-commit` 技能（如 ~/.agents/skills/7d-git-commit、项目 .agents/skills/）
// 都会覆盖本包技能。安装后会话中"看不到 7DGroup 版"多为该原因 ——
// 技能仍由本 provider 正常注册，只是被更高优先级的同名候选遮蔽，
// 诊断与处理见 README「故障排查」章节。

/* jscpd:ignore-start */
const CANDIDATE: SkillCandidate = {
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-git-commit'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-git-commit` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将组织级提交 Skill 与服务端 hook 共享同一机器可读规则，可减少代理建议与 GitLab 拒绝规则漂移。最小验证在 50 个历史 diff 上比较人工消息、仅 Skill、Skill+同源 hook，统计一次通过率、语义误分类和人工修订分钟；hook 与 Skill 不一致仍频繁发生即否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-70](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/src/index.ts#L18-L70)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（53行）</summary>

```text
const SKILL_BODY_URL = new URL('../assets/7d-git-commit/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/7d-git-commit/', import.meta.url)).replace(/[\\/]$/, ''),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION = '7DGroup 提交规范适配 Skill：在生成 git commit message 前自动校验并套用 7DGroup 项目的提交规范，规避服务端 pre-receive hook 拦截。当用户需要 git commit 或生成提交信息时使用。'

// rank 语义（ctx.skills 同层同名技能按 rank 升序取优，小者胜出）：
//   项目 .dsh/skills=100 · 项目 .agents/skills=200 · custom=300 ·
//   ~/.dsh/skills=400 · ~/.agents/skills=500 · bundled=600
// BUNDLED_SKILL_RANK 是所有根中最低优先级，因此任何本地文件系统同名
// `7d-git-commit` 技能（如 ~/.agents/skills/7d-git-commit、项目 .agents/skills/）
// 都会覆盖本包技能。安装后会话中"看不到 7DGroup 版"多为该原因 ——
// 技能仍由本 provider 正常注册，只是被更高优先级的同名候选遮蔽，
// 诊断与处理见 README「故障排查」章节。

/* jscpd:ignore-start */
const CANDIDATE: SkillCandidate = {
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-git-commit'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-git-commit` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
```

</details>

#### 缺口

- Skill 与目标团队当前服务端校验规则是否同源未知
  **影响**：规则漂移会导致消息看似合规仍被拒绝
  **进一步探讨**：抽取同一规则生成 Skill 与 hook，在 50 个历史 diff 上比较一次通过率和人工修订量

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 @7dgroup/dsh-skill-7d-git-commit？

**研究主题**：采用判断

#### 完整回答

适合已明确采用 7DGroup commit 规范且愿意保留提交授权门禁的团队试用；其他团队应先读 Skill 内容，和本地 COMMIT-RULES 对齐后再装。验收只看生成消息和覆盖优先级，绝不能把插件出现或 invariant 通过当作提交授权。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-69](https://github.com/7dgroup-ai/dsh-skill-7d-git-commit/blob/557e05f51f85fb4d4b9f6ed8cedfce02350e7bd6/README.md#L43-L69)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（27行）</summary>

````text
## Features

- **Client-side commit validation** before `git commit` is executed.
- **9 fixed Chinese type tags** such as `【新增】`, `【修复】`, `【优化】`, `【文档】`, etc.
- **Title length, punctuation, forbidden characters/phrases, and wording rules** from the 7DGroup convention.
- **Body formatting rules**: numbered lists, max 70 chars per line.
- **Exemptions** for merge commits and emergency `[skip-check]` deployments.
- **Bundled reference** `references/git-commit-message.md` acts as the source of truth and is loaded on demand.
- **Zero core changes** — pure composition bundle.

## Project Structure

```
dsh-skill-7d-git-commit/
├── src/
│   ├── index.ts              # Cordis plugin: registers the skill provider
│   └── invariant.ts          # Package-owned invariant companion
├── assets/7d-git-commit/
│   ├── SKILL.md              # Skill body (validation logic)
│   └── references/
│       └── git-commit-message.md   # 7DGroup commit convention reference
├── assets/images/
│   └── 7d-git-commit-cover.jpg     # README cover image
├── tests/
│   └── skill-7d-git-commit.spec.ts
├── cordis.patch.yml          # Composition layer patch
├── tsdown.config.ts          # Self-contained transpile config
````

</details>

#### 缺口

- Skill 与目标团队当前服务端校验规则是否同源未知
  **影响**：规则漂移会导致消息看似合规仍被拒绝
  **进一步探讨**：抽取同一规则生成 Skill 与 hook，在 50 个历史 diff 上比较一次通过率和人工修订量

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
