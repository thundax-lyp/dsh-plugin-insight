# Superdesign Skill

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[f9f05cd](https://github.com/superdesigndev/superdesign-skill/tree/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b)

<!-- BEGIN META -->
[![GitHub ★ 904](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=904&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/superdesigndev/superdesign-skill)
<!-- END META -->

> **功能**：为编码Agent提供UI、演示稿和图形设计流程，并通过CLI连接Superdesign画布。

> **亮点**：把现状、设计系统、目标草稿和预算化上下文接到可继续的设计流程，贡献在方法与包装，不能算外部设计模型原创。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：缓存路径检查与上传限制是文本协议，未见本仓库强制验证器；CLI和云端实现不在此处，不能把要求写成已实现隔离或效果保证。[Q02](#research-q02)

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
  - [Q01 · 设计Skill比通用前端提示增加什么？](#detail-section-11)
  - [Q02 · DSH注册和续作缓存分别由谁执行？](#detail-section-12)
  - [Q03 · 为什么应先用可公开界面片段试用？](#detail-section-13)
  - [Q04 · 续作协议哪些值得复用，怎样避免陈旧上下文？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在已有代码库持续迭代UI与视觉草稿的开发者和设计者。

本地设计系统加直接HTML/CSS编辑，或现有设计工具。远端画布的价值需与上下文准备和复核成本一起比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设计任务路由 | UI、演示稿和图形流程导航 | 依赖外部CLI与服务 |
| 草稿续作协议 | 复用目标与上下文 | 文本要求非强制校验器 |
| DSH Skill provider | 发布打包Skill资源 | 真实宿主加载未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容宿主与Skill入口 | 必需 | 读方法与参考 | 不安装重复入口 |
| shell、Superdesign CLI与登录 | 远端设计必需 | 项目与草稿调用 | 只有Skill文件不能设计 |
| 有意选择的UI源码与素材 | 现有项目设计必需 | 上下文和品牌 | 不把整个工程自动上传 |
| 费用和数据范围确认 | 远端操作必需 | 控制模型调用及源码发送 | 当前价格与保留策略未核实 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核对CLI、登录与公开示例范围 | 能明确将发送哪些文件 |
| 2 | Agent提取设计系统并指定目标草稿 | 目标ID与当前方向一致 |
| 3 | 用户审阅一次迭代及本地导出 | 检查视觉、可编辑性与费用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI、服务和模型用量 | init、现状复制、上下文筛选 | 价格及准备时间未知 |
| 持续使用 | 设计迭代与素材生成 | 选择方向、视觉复核和状态维护 | 哈希复用只可能节省发现成本 |
| 失败恢复 | 重复生成可能追加用量 | 核对远端project/draft后重试 | 本仓库无服务幂等证明 |
| 退出 | 导出设计与保存笔记 | 停用CLI/Skill并清理远端数据 | 服务数据删除规则未知 |

已有设计任务者可用可公开UI片段进行小范围试用，先核对费用和发送内容。涉及不可外发源码或需要确定性本地修正时，直接在本地设计系统和代码上修改。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 连续设计状态 | 目标、草稿与哈希的协议 | 实际节省时间与遗漏依赖 |
| 宿主加载 | provider list/get与apply | 当前宿主真实兼容 |
| 设计质量 | 作者产品主张 | 视觉偏好、代码可用性和费用 |

> **思考**：缓存路径检查与上传限制是文本协议，未见本仓库强制验证器；CLI和云端实现不在此处，不能把要求写成已实现隔离或效果保证。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把现状、设计系统、目标草稿和预算化上下文接到可继续的设计流程，贡献在方法与包装，不能算外部设计模型原创。[Q01](#research-q01) [Q02](#research-q02)

可借鉴的是把远端草稿、精确上下文路径及全文件哈希绑定到稳定页面目标；明确选择源草稿而不从版本号猜方向，也不在多分支时自动替用户挑选。适配器从Skill原文读取description，减少双处描述漂移。

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存路径检查与上传限制是文本协议，未见本仓库强制验证器；CLI和云端实现不在此处，不能把要求写成已实现隔离或效果保证。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

有设计迭代需求者可先用可公开UI片段试用，核对发送文件、费用和目标草稿后再生成；私密源码或确定性小修优先本地直接修改，不把缓存状态当持续上传许可。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill注册与续作协议已检查；外部设计引擎、实际上传与审美收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、skills/superdesign/SKILL.md、dsh/index.js、skills/superdesign/references/RESUME.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查DSH注册、Skill路由与续作协议，未执行外部CLI、上传本地源码或审计云服务。
- 下一步：在公开UI样本比较冷/暖恢复及共享token变化，记录陈旧设计、上下文量、视觉修改和费用。

**分析版本**

- **仓库**：[superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill)
- **版本号**：0.6.0（[固定提交 f9f05cd](https://github.com/superdesigndev/superdesign-skill/tree/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b)）
- **版本日期**：2026-08-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

比较依赖感知的定向刷新与全量发现，检查共享视觉依赖变化时陈旧草稿和人工修正；先核对现有规则，尚未验证。[Q04](#research-q04)

在公开UI样本比较冷/暖恢复及共享token变化，记录陈旧设计、上下文量、视觉修改和费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 2202 | — | — | 25518 |
| .js | source | 1 | 112 | 64 | 40 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/superdesigndev/superdesign-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/superdesigndev/superdesign-skill/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/superdesigndev/superdesign-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：设计上下文及草稿续作协议能否减少重复发现，远端依赖与上传边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设计Skill比通用前端提示增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在已有代码库迭代UI、演示稿或营销图的开发者和设计者。交付是可分支设计草稿、设计系统与可继续编辑的上下文，而不是直接宣称生产页面已验收。相较一次让模型写HTML，协议要求先识别已有代码、提取设计系统并区分现有页面复制与新设计，让不同方向可比较且能继续。

贡献主要是工作方法与跨宿主包装；审美质量、设计模型和云画布属于外部Superdesign产品，本仓库没有该引擎实现。简单确定的CSS或文案修正可直接在本地完成，不必初始化整套远端项目。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-25](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/README.md#L17-L25)

作者说明目标人群、设计系统与跨会话续作。

```text
**Superdesign is an AI product design agent.** It gives coding agents (Claude Code, Cursor, Codex, and 70+ others) real design judgment, so the UI they ship looks considered instead of generic.

- **What it does** — finds design direction, sets up design systems, approves presentation outlines, and generates + iterates high-quality UI, slide decks, and graphics on an infinite canvas.
- **Who it's for** — developers, indie hackers, and product/UI designers who want to go from idea to shippable UI fast without leaving their coding agent.
- **How it's different** — style-preset skills just swap in a theme or a component library. Superdesign designs *into* your existing design system: it reads your code for context, gathers real style references, and produces branchable drafts you refine.
- **Cross-session continuity** — after the first real-codebase design, the skill remembers the project, draft, extracted components, and budgeted source-context bundle so later unchanged iterations resume without repeating codebase discovery.
- **Two ways in** — this skill from any coding agent, or the web app at [superdesign.dev](https://superdesign.dev).

> **Not the legacy IDE extension.** The archived open-source `superdesigndev/superdesign` VS Code extension is an older, separate project. This skill and [superdesign.dev](https://superdesign.dev) are the current, maintained product.
```

**依据 2 · 源码核查**：[skills/superdesign/SKILL.md:10-22](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/SKILL.md#L10-L22)

Skill按任务路由不同参考并区分继续与分支。

<details>
<summary>查看原文（13行）</summary>

```text
# Core scenarios (what this skill handles)

1. **Analyze a codebase for design work** — `superdesign init` builds reusable UI context in `.superdesign/init/`; read [INIT.md](references/INIT.md).
2. **Design, reproduce, or improve UI** — create pages, features, flows, and new products on the canvas; read [SUPERDESIGN.md](references/SUPERDESIGN.md).
3. **Choose and compare leading design models** — run `list-models`, select a model suited to the task, or use different models to explore independent directions.
4. **Create design systems and reusable components** — establish visual foundations, extract patterns, and design connected multi-page experiences.
5. **Design from a live website or reference URL** — extract and apply its design language; read [WEBSITE.md](references/WEBSITE.md).
6. **Create or export presentations** — plan an editable slide outline, approve it in chat, generate a real presentation draft, make slide-safe edits, or reconstruct an editable PPTX when requested and supported; read [PRESENTATION.md](references/PRESENTATION.md).
7. **Create graphics** — posters, covers, social posts, thumbnails, flyers, and ads; read [GRAPHIC.md](references/GRAPHIC.md).
8. **Generate supporting images or video** — use native image generation when appropriate or choose from Superdesign's generation models; read [ASSET_GENERATION.md](references/ASSET_GENERATION.md).
9. **Continue or directly correct existing work** — resume saved targets through [RESUME.md](references/RESUME.md), or use [design-with-your-model.md](references/design-with-your-model.md) when direct authoring is the right path.

When continuing a draft, follow [SUPERDESIGN.md](references/SUPERDESIGN.md) **ITERATION MODE ROUTING**: replace refines the selected direction with version history; branch is only for alternatives the user wants to compare.
```

</details>

**依据 3 · 作者声明**：[README.md:144-160](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/README.md#L144-L160)

复制现状和设计修改明确分开。

<details>
<summary>查看原文（17行）</summary>

```text
## replica_html_template rules (Canvas only)

The purpose of replica html template is creating a lightweight version of existing UI so design agent can iterate on top of it (Since superdesign doesn't have access to your codebase directly, this is important context)

Overall process for designing features on top of existing app:
1. Identify & understand existing UI of page related
2. Create/update a pixel perfect replica html in `.superdesign/replica_html_template/<name>.html` (Only replicate how UI look now, do NOT design)
  - If design task is redesign profile page, then replicate current profile page UI pixel perfectly
  - If design task is add new button to side panel, identify which page side panel is using, then replicate that page UI pixel perfectly

**replica_html_template = BEFORE state (what exists now).** It provides context for Superdesign agent.
Actual design will be done via superdesign agent, by passing the prompt

The replica_html_template must contain **ONLY UI that currently exists in the codebase**. 
- **DO NOT** design or improve anything in the replica_html_template
- **DO NOT** add placeholder sections like `<!-- NEW FEATURE - DESIGN THIS -->`
- **DO** create pixel-perfect replica of current UI state
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH注册和续作缓存分别由谁执行？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

dsh/index.js直接读取打包Skill内容及description，list/get返回resourceBase、rank和可调用信息，apply注册skills provider。无构建步骤的小ESM适配器减少额外宿主依赖副本，实际注册的是一个Skill，不是多个设计模型工具。

RESUME文本要求把resume.json当仓库不可信缓存，验证路径、符号链接、秘密输入、目标ID与contextFiles/fingerprint集合后再调用CLI；全文件哈希匹配才走暖恢复。这是给执行Agent的协议，仓库未提供执行这些检查的独立强制验证器，不能当作程序已阻止路径逃逸或秘密上传。保存的远端ID也不代表上传授权。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:62-96](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/dsh/index.js#L62-L96)

provider从同一Skill原文生成候选和内容。

<details>
<summary>查看原文（35行）</summary>

```text
async function loadSkill(signal) {
  const content = await readFile(SKILL_BODY_URL, { encoding: 'utf8', signal })
  const description = readDescription(content)
  if (description === undefined) return undefined
  return { description, content }
}

const provider = {
  name: PROVIDER_NAME,
  async list(options = {}) {
    const skill = await loadSkill(options.signal)
    if (skill === undefined) return []
    return [{
      name: SKILL_NAME,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      rank: BUNDLED_SKILL_RANK,
      locator: SKILL_BODY_URL,
    }]
  },
  async get(_candidate, options = {}) {
    const skill = await loadSkill(options.signal)
    if (skill === undefined) return undefined
    return {
      name: SKILL_NAME,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      content: skill.content,
    }
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:100-112](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/dsh/index.js#L100-L112)

DSH实际注册skills provider。

<details>
<summary>查看原文（13行）</summary>

```text
/** Cordis plugin name. */
export const name = 'superdesign-skill'
/** The registry this plugin contributes to. */
export const inject = ['skills']

/**
 * Register the packaged Superdesign skill on `ctx.skills`.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx - the plugin context.
 */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
```

</details>

**依据 3 · 源码核查**：[skills/superdesign/references/RESUME.md:67-93](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/references/RESUME.md#L67-L93)

缓存字段和信任检查的文本要求。

<details>
<summary>查看原文（27行）</summary>

```text
Rules:

- Keys in `targets` are stable route or feature identifiers (`/`, `/dashboard`, `settings-panel`).
- A target created by `execute-flow-pages` may also store `sourceTarget` and `sourceDraftId` to preserve its origin. These fields are informational; its own `activeDraftId`, context, and fingerprints control later resume.
- `contextFiles` stores the exact, already-budgeted `--context-file` arguments, including line ranges. Do not rediscover or reread them on an ordinary warm resume; after the trust checks below, pass the validated entries to the next generation command. Read or extend only the smallest relevant subset when the request triggers **Targeted context expansion** below.
- `referenceIds` optionally stores only the curated canvas image-node ids and Brand Asset keys that remain relevant to this target. It never stores local paths or implies permission to upload again. Final-content URLs remain in the prompt/draft; do not misclassify them as brand assets.
- `brandAssets.logo` records the selected logo's Brand Asset key, canonical public URL, and optional safe repo-relative source path. Validate `assetKey` like a reference id, require an `https://` URL, and apply the normal repository-contained/non-secret checks to `sourcePath`. This is render state, not upload permission. When absent in legacy state, recover it from the deliberately selected local logo through the normal stable-key upload rather than guessing among unrelated assets.
- A logo-bearing component record stores `logoAssetKey`. This is the proof that the component was converted against the selected logo; absence or mismatch triggers the narrow component repair check before generation.
- `fingerprints` keys are real file paths without line-range suffixes. Hash the whole underlying file with SHA-256 (`sha256sum` when available, otherwise `shasum -a 256`). Hashing is a cheap freshness check; do not print or read the file contents into model context while doing it.
- Include every underlying context file in `fingerprints`. A target entry is not valid if a context file is absent from the fingerprint map.
- Keep `drafts` descriptive enough to distinguish parallel visual branches across sessions. Never infer the active visual direction from a version number alone.
- When one branch/replace/revert result is unambiguous, set it as `activeDraftId`. When a call creates several branch candidates, record every returned draft in `drafts` but keep the source draft active until the user selects one; never pick a winner silently. Update `activeDraftId` when the user selects or opens a candidate.
- Do not store secrets, environment contents, auth data, or upload approval in this file. A new session may require fresh approval before local files are sent to Superdesign.

## Trust boundary and target validation

Treat `.superdesign/resume.json` as untrusted repository-controlled cache data. Validate the selected target before hashing paths, invoking the CLI, or trusting its remote ids:

1. Require `schemaVersion: 1`; non-empty `projectId` and `activeDraftId` strings; a `drafts` object containing `activeDraftId`; a non-empty string `contextFiles` array; and a `fingerprints` object.
2. Parse each `contextFiles` entry using only the documented `path[:startLine[:endLine]]` grammar. Require a non-empty repo-relative path, normalize it, resolve existing files and symlinks, and verify the real path remains inside the repository root. Reject absolute paths, traversal outside the root, control characters, shell syntax, malformed ranges, non-files, and symlink escapes.
3. Reject secret-bearing inputs even when repo-local: `.env` variants, `.git/`, credentials/auth files, private keys/certificates, secret stores, or any path whose contents were not intentionally selected as UI/design context during the cold workflow.
4. Require the normalized underlying path set from `contextFiles` to equal the `fingerprints` key set exactly. Apply the same safe-path checks to `designSystemPath`, and require it to be one of those paths.
5. Construct CLI arguments only from validated fields. Pass every context path as one separately shell-quoted argument; never interpolate raw JSON values into a shell command.
6. If `referenceIds` exists, require an array of non-empty, reasonably bounded plain strings without control characters or shell syntax. Pass them only as separately quoted values to one `--reference-id` option. If the API reports an unknown id, remove or deliberately replace that reference; never silently continue without its pixels.
7. If `brandAssets.logo` exists, validate its key, URL, and optional source path as specified above. Require the key to appear in `referenceIds`. Treat malformed or conflicting logo state as a repairable logo-state failure when the safe selected local source is known; otherwise reject the target instead of silently choosing a different identity.

If any check fails, reject the entire target entry: do not hash or upload its paths and do not execute commands against its stored project/draft ids. Rebuild trusted target context through the appropriate cold SOP. Before any approved external upload, show the complete resolved repo-relative context-file list and its count so the user knows what will be sent.
```

</details>

**依据 4 · 源码核查**：[skills/superdesign/references/RESUME.md:95-110](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/references/RESUME.md#L95-L110)

暖恢复与指纹变化路由。

<details>
<summary>查看原文（16行）</summary>

```text
## Resume eligibility and freshness routing

Use resume routing before the cold existing/new-target SOP when ALL are true:

1. The request addresses the same saved route/feature. This is state-driven: "change", "redesign", or a direct instruction remains eligible. An explicit request to start over from fresh current-UI ground truth, or a different uninitialized target, does not use this target's warm state.
2. `.superdesign/resume.json` has a matching target entry that passes the trust/schema validation above.
3. All six init files pass the cheap complete test (exist and are non-empty). Do not read their contents.
4. The target's design-system and context files exist.
5. Every validated underlying context file has exactly one stored fingerprint.

After these structural checks, route by freshness:

- **All fingerprints match:** follow the warm-resume procedure. Do NOT read the six init files, retrace imports, reopen source files, rescan brand assets, recalculate the payload budget, call `list-components`, create a project, or reproduce the existing UI again unless the request meets the narrow **Targeted context expansion** rule.
- **Logo-bearing saved components are a narrow invariant check, not cold rediscovery:** when the target uses `brandAssets.logo` and a saved Navbar/Footer/Header or other component has a logo position, require its `logoAssetKey` to equal the selected logo key. If the field is absent/mismatched, the component predates the logo, or its template is known to contain a substitute, resolve the canonical logo URL through the same stable-key upload and `update-component` before generation. Record the matching `logoAssetKey`; keep the rest of the warm context untouched.
- **One or more fingerprints differ:** the target remains resume-eligible. Follow **Incremental refresh**; do not route cold merely because a hash changed.
- **A structural/trust check fails, required files are absent, or incremental refresh determines the saved context is unreliable:** reject resume and use the appropriate cold SOP.
```

</details>

#### 缺口

- 外部CLI、云端权限、上传实现和协议执行情况未在当前源码核查。
  **影响**：不能从Skill要求推断强制的数据隔离或服务安全。
  **进一步探讨**：对公开示例项目检查实际CLI输入、上传列表、远端目标及路径逃逸拒绝行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么应先用可公开界面片段试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容宿主与Skill入口 | 必需 | 读方法与参考 | 不安装重复入口 |
| shell、Superdesign CLI与登录 | 远端设计必需 | 项目与草稿调用 | 只有Skill文件不能设计 |
| 有意选择的UI源码与素材 | 现有项目设计必需 | 上下文和品牌 | 不把整个工程自动上传 |
| 费用和数据范围确认 | 远端操作必需 | 控制模型调用及源码发送 | 当前价格与保留策略未核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核对CLI、登录与公开示例范围 | 能明确将发送哪些文件 |
| 2 | Agent提取设计系统并指定目标草稿 | 目标ID与当前方向一致 |
| 3 | 用户审阅一次迭代及本地导出 | 检查视觉、可编辑性与费用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI、服务和模型用量 | init、现状复制、上下文筛选 | 价格及准备时间未知 |
| 持续使用 | 设计迭代与素材生成 | 选择方向、视觉复核和状态维护 | 哈希复用只可能节省发现成本 |
| 失败恢复 | 重复生成可能追加用量 | 核对远端project/draft后重试 | 本仓库无服务幂等证明 |
| 退出 | 导出设计与保存笔记 | 停用CLI/Skill并清理远端数据 | 服务数据删除规则未知 |

已有设计任务者可用可公开UI片段进行小范围试用，先核对费用和发送内容。涉及不可外发源码或需要确定性本地修正时，直接在本地设计系统和代码上修改。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-51](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/README.md#L29-L51)

Skill之外另需CLI和登录。

<details>
<summary>查看原文（23行）</summary>

````text
## Install

**Any coding agent** — installs the skill for any of the [70+ supported coding agents](https://github.com/vercel-labs/skills#supported-agents):

```
npx skills add superdesigndev/superdesign-skill
```

**Claude Code** — install it as a plugin instead, so it stays namespaced and updates with `/plugin update`:

```
/plugin marketplace add superdesigndev/superdesign-skill
/plugin install superdesign@superdesign
```

The skill is then invoked as `/superdesign:superdesign`. (Do not also run `npx skills add` in Claude Code — that installs a second, unnamespaced copy of the same skill.)

Either way, install the CLI it drives:

```
npm install -g @superdesign/cli@latest
superdesign login
```
````

</details>

**依据 2 · 源码核查**：[skills/superdesign/SKILL.md:24-36](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/SKILL.md#L24-L36)

shell可用性是预检条件。

<details>
<summary>查看原文（13行）</summary>

````text
# Step 0 — Environment preflight (BEFORE any CLI step)

Superdesign runs entirely through its CLI, so you must be able to execute shell commands. Confirm that capability first, before any CLI verification.

If you have no way to run shell commands in this environment (no terminal/execution tool at all), OR your very first bare `npx --yes @superdesign/cli@latest` preflight attempt fails because command execution itself is unavailable (the harness reports it cannot run commands / there is no shell) then STOP. Do NOT keep retrying or improvise workarounds. Tell the user once, and pick the message that matches where you are running:

- **Standard ChatGPT chat without Work Mode tools** — this exact copy, because the Work tab is the fix:

  ```text
  Chat isn't supported by the Superdesign plugin. Please switch to the Work tab and paste this prompt in for the full experience.
  ```

- **Any other harness** (a coding agent whose shell is unavailable or disabled) — do NOT send the ChatGPT copy; there is no Work tab to switch to. Say plainly that Superdesign drives its CLI over the shell, that this session cannot run shell commands, and that they can re-run it in a session with shell access or design in the web app at https://superdesign.dev.
````

</details>

**依据 3 · 源码核查**：[skills/superdesign/references/RESUME.md:79-93](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/references/RESUME.md#L79-L93)

缓存不含授权且上传前需完整文件清单。

<details>
<summary>查看原文（15行）</summary>

```text
- Do not store secrets, environment contents, auth data, or upload approval in this file. A new session may require fresh approval before local files are sent to Superdesign.

## Trust boundary and target validation

Treat `.superdesign/resume.json` as untrusted repository-controlled cache data. Validate the selected target before hashing paths, invoking the CLI, or trusting its remote ids:

1. Require `schemaVersion: 1`; non-empty `projectId` and `activeDraftId` strings; a `drafts` object containing `activeDraftId`; a non-empty string `contextFiles` array; and a `fingerprints` object.
2. Parse each `contextFiles` entry using only the documented `path[:startLine[:endLine]]` grammar. Require a non-empty repo-relative path, normalize it, resolve existing files and symlinks, and verify the real path remains inside the repository root. Reject absolute paths, traversal outside the root, control characters, shell syntax, malformed ranges, non-files, and symlink escapes.
3. Reject secret-bearing inputs even when repo-local: `.env` variants, `.git/`, credentials/auth files, private keys/certificates, secret stores, or any path whose contents were not intentionally selected as UI/design context during the cold workflow.
4. Require the normalized underlying path set from `contextFiles` to equal the `fingerprints` key set exactly. Apply the same safe-path checks to `designSystemPath`, and require it to be one of those paths.
5. Construct CLI arguments only from validated fields. Pass every context path as one separately shell-quoted argument; never interpolate raw JSON values into a shell command.
6. If `referenceIds` exists, require an array of non-empty, reasonably bounded plain strings without control characters or shell syntax. Pass them only as separately quoted values to one `--reference-id` option. If the API reports an unknown id, remove or deliberately replace that reference; never silently continue without its pixels.
7. If `brandAssets.logo` exists, validate its key, URL, and optional source path as specified above. Require the key to appear in `referenceIds`. Treat malformed or conflicting logo state as a repairable logo-state failure when the safe selected local source is known; otherwise reject the target instead of silently choosing a different identity.

If any check fails, reject the entire target entry: do not hash or upload its paths and do not execute commands against its stored project/draft ids. Rebuild trusted target context through the appropriate cold SOP. Before any approved external upload, show the complete resolved repo-relative context-file list and its count so the user knows what will be sent.
```

</details>

**依据 4 · 源码核查**：[skills/superdesign/references/RESUME.md:123-135](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/references/RESUME.md#L123-L135)

续作核对草稿并按修改性质路由。

<details>
<summary>查看原文（13行）</summary>

```text
## Warm-resume procedure

1. Apply the init-complete test with file existence/non-empty checks only.
2. Read `.superdesign/resume.json`, select the target/draft by the priority above, and apply the trust/schema/path validation before using any stored field.
3. Verify validated context-file existence and SHA-256 fingerprints without reading file contents. Route mismatches to **Incremental refresh**.
4. Run the session's one bare CLI preflight.
5. Call `get-design --draft-id <activeDraftId> --json` to verify the saved draft and inspect its current version before iteration/revert. The canonical invocation is already specified here; do not run `get-design --help` first unless the command rejects it or the needed flags differ.
6. Gather only unresolved user intent. Do not repeat questions already answered by the saved target/draft state. Apply **Targeted context expansion** only when the request cannot be framed accurately from the user's words plus the fetched active draft.
7. Run the appropriate command:
   - precise deterministic HTML/CSS/content correction: `get-design --output`, edit, then `import-design-draft --into`
   - creative or structural refinement of the selected/active direction: `iterate-design-draft --mode replace`
   - requested alternative directions, variants, or comparison: `iterate-design-draft --mode branch`
   - revert: `revert-design-draft`
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 续作协议哪些值得复用，怎样避免陈旧上下文？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是把远端草稿、精确上下文路径及全文件哈希绑定到稳定页面目标；明确选择源草稿而不从版本号猜方向，也不在多分支时自动替用户挑选。适配器从Skill原文读取description，减少双处描述漂移。

未验证假设是只对真实参与设计的依赖图做变化检查，既减少重复发现又不遗漏被上下游共享组件影响的页面。当前协议按存储的contextFiles比哈希，未进入集合的依赖变化能否触发扩展需另查。用直接页面改动、共享token改动、未选组件改动三组，对照全量重新分析和暖恢复，记录陈旧草稿、上下文量与人工修正时间；若暖恢复漏掉关键视觉变化，就增加定向依赖而非无条件重扫。

#### 证据与依据

**依据 1 · 源码核查**：[skills/superdesign/references/RESUME.md:69-78](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/references/RESUME.md#L69-L78)

精确上下文及哈希、分支选择规则。

<details>
<summary>查看原文（10行）</summary>

```text
- Keys in `targets` are stable route or feature identifiers (`/`, `/dashboard`, `settings-panel`).
- A target created by `execute-flow-pages` may also store `sourceTarget` and `sourceDraftId` to preserve its origin. These fields are informational; its own `activeDraftId`, context, and fingerprints control later resume.
- `contextFiles` stores the exact, already-budgeted `--context-file` arguments, including line ranges. Do not rediscover or reread them on an ordinary warm resume; after the trust checks below, pass the validated entries to the next generation command. Read or extend only the smallest relevant subset when the request triggers **Targeted context expansion** below.
- `referenceIds` optionally stores only the curated canvas image-node ids and Brand Asset keys that remain relevant to this target. It never stores local paths or implies permission to upload again. Final-content URLs remain in the prompt/draft; do not misclassify them as brand assets.
- `brandAssets.logo` records the selected logo's Brand Asset key, canonical public URL, and optional safe repo-relative source path. Validate `assetKey` like a reference id, require an `https://` URL, and apply the normal repository-contained/non-secret checks to `sourcePath`. This is render state, not upload permission. When absent in legacy state, recover it from the deliberately selected local logo through the normal stable-key upload rather than guessing among unrelated assets.
- A logo-bearing component record stores `logoAssetKey`. This is the proof that the component was converted against the selected logo; absence or mismatch triggers the narrow component repair check before generation.
- `fingerprints` keys are real file paths without line-range suffixes. Hash the whole underlying file with SHA-256 (`sha256sum` when available, otherwise `shasum -a 256`). Hashing is a cheap freshness check; do not print or read the file contents into model context while doing it.
- Include every underlying context file in `fingerprints`. A target entry is not valid if a context file is absent from the fingerprint map.
- Keep `drafts` descriptive enough to distinguish parallel visual branches across sessions. Never infer the active visual direction from a version number alone.
- When one branch/replace/revert result is unambiguous, set it as `activeDraftId`. When a call creates several branch candidates, record every returned draft in `drafts` but keep the source draft active until the user selects one; never pick a winner silently. Update `activeDraftId` when the user selects or opens a candidate.
```

</details>

**依据 2 · 源码核查**：[skills/superdesign/references/RESUME.md:99-110](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/skills/superdesign/references/RESUME.md#L99-L110)

暖恢复按既有上下文指纹路由。

<details>
<summary>查看原文（12行）</summary>

```text
1. The request addresses the same saved route/feature. This is state-driven: "change", "redesign", or a direct instruction remains eligible. An explicit request to start over from fresh current-UI ground truth, or a different uninitialized target, does not use this target's warm state.
2. `.superdesign/resume.json` has a matching target entry that passes the trust/schema validation above.
3. All six init files pass the cheap complete test (exist and are non-empty). Do not read their contents.
4. The target's design-system and context files exist.
5. Every validated underlying context file has exactly one stored fingerprint.

After these structural checks, route by freshness:

- **All fingerprints match:** follow the warm-resume procedure. Do NOT read the six init files, retrace imports, reopen source files, rescan brand assets, recalculate the payload budget, call `list-components`, create a project, or reproduce the existing UI again unless the request meets the narrow **Targeted context expansion** rule.
- **Logo-bearing saved components are a narrow invariant check, not cold rediscovery:** when the target uses `brandAssets.logo` and a saved Navbar/Footer/Header or other component has a logo position, require its `logoAssetKey` to equal the selected logo key. If the field is absent/mismatched, the component predates the logo, or its template is known to contain a substitute, resolve the canonical logo URL through the same stable-key upload and `update-component` before generation. Record the matching `logoAssetKey`; keep the rest of the warm context untouched.
- **One or more fingerprints differ:** the target remains resume-eligible. Follow **Incremental refresh**; do not route cold merely because a hash changed.
- **A structural/trust check fails, required files are absent, or incremental refresh determines the saved context is unreliable:** reject resume and use the appropriate cold SOP.
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:30-54](https://github.com/superdesigndev/superdesign-skill/blob/f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b/dsh/index.js#L30-L54)

description从Skill单源解析。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Read the one-line `description` from SKILL.md's frontmatter.
 *
 * SKILL.md is the single source of truth for how the skill routes; copying its
 * description into this file would be a second copy that silently rots. The
 * frontmatter is two flat keys, so a full YAML parser (and its dependency)
 * would be more surface than the job needs.
 *
 * @param {string} body - the raw SKILL.md contents.
 * @returns {string | undefined} the description, or undefined when absent.
 */
function readDescription(body) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(body)
  if (!frontmatter) return undefined
  const line = /^description:[ \t]*(.+)$/m.exec(frontmatter[1])
  if (!line) return undefined
  const raw = line[1].trim()
  if (raw.startsWith('"') && raw.endsWith('"') && raw.length > 1) {
    return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }
  if (raw.startsWith("'") && raw.endsWith("'") && raw.length > 1) {
    return raw.slice(1, -1).replace(/''/g, "'")
  }
  return raw
}
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
