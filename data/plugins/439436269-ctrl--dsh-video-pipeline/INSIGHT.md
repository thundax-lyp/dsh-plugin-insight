# dsh-video-pipeline

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[82a85d2](https://github.com/439436269-ctrl/dsh-video-pipeline/tree/82a85d20b67d1d398d49009462d61a741f5a8d51)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline)
<!-- END META -->

> **实现功能**：以 DSH skill provider 提供 19 个视频制作、核验和多平台发布技能与脚本。

> **核心亮点**：把多阶段短视频生产、核验和发布经验包装为可在 DSH 发现的技能目录。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：环境变量 ARK_API_KEY 会替换到 Agent 可见技能正文；脚本占位符不替换、外部依赖和平台账号不随包提供。详见[Q03](#research-q03)。

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
  - [Q01 · 技能包给 DSH 视频工作流提供什么？](#detail-section-11)
  - [Q02 · provider 怎样解析覆盖和资源，哪里会失配？](#detail-section-12)
  - [Q03 · 占位符与公开素材有哪些实际安全边界？](#detail-section-13)
  - [Q04 · 怎样安全试用并评估它的生产效率？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有短视频/AI 短剧素材生产需求，希望把多工具环节、质量门与发布回写串成可发现技能。

人工拼接 TTS、图视频生成、ffmpeg 合成和各平台发布脚本；技能包组织分工与交接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| provider | DSH 技能目录 | 需宿主兼容 |
| 流水线说明 | 交接与门槛 | 无自动环境配置 |
| 占位符 | 适配用户路径/坐标 | API key 可进正文 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH skills registry | 注册/加载技能 | 目录不可见 |
| ffmpeg/Python/Node/Playwright | 制作与平台脚本 | 对应环节失败 |
| 各平台账号/API | 生成和发布 | 无法运行 |
| 安全凭据处理 | 避免 key 进上下文 | 可能泄露 |

#### 受控试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 加载目录与 resourceBase | 19 候选可见 |
| 制作 | 用测试素材只跑少数技能 | 产物可复核 |
| 核验 | 运行 media-verify 并人审 | 音画质量通过 |
| 发布 | 单平台试点且用户确认 | 平台回读成功 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 初次 | ffmpeg/Python/浏览器/平台账号 | 包不装外部工具 |
| 生产 | 图视频 API 与人工选片 | 费用/质量因任务变化 |
| 发布 | 账号、审核、验证和回写 | 需明确用户确认 |
| 安全 | key 存储和上下文检查 | 正文替换可能暴露密钥 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 目录 | 19 个内置 SKILL.md | 目标宿主兼容 |
| 编排 | 阶段/质量/发布门说明 | 成片质量与效率 |
| 脱敏 | 作者导入器与记录 | 新配置的凭据暴露 |

> **思考**：环境变量 ARK_API_KEY 会替换到 Agent 可见技能正文；脚本占位符不替换、外部依赖和平台账号不随包提供。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多阶段短视频生产、核验和发布经验包装为可在 DSH 发现的技能目录。详见[Q01](#research-q01)、[Q02](#research-q02)。

把多阶段短视频生产、核验和发布经验包装为可在 DSH 发现的技能目录。详见[Q01](#research-q01)、[Q02](#research-q02)。

provider 一层扫描技能目录、frontmatter 校验、rank 600 与 enabledSkills；get 替换正文/描述占位符，脚本资源原样返回。

<a id="detail-section-5"></a>

### 1.4 主要限制

环境变量 ARK_API_KEY 会替换到 Agent 可见技能正文；脚本占位符不替换、外部依赖和平台账号不随包提供。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先只启用无外部发布的生成/核验技能，用测试素材逐环节验证；不要把真实 ARK_API_KEY 注入技能正文。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可确认 19 技能与 provider；并非自动开箱生产。ARK_API_KEY 环境值可进入技能正文，作者实录未独立复现。

- 已检查：作者 README、包清单、源码路径 README.md、VERIFY.md、package.json、lib/index.js、lib/provider.js、lib/placeholders.js、skills/video-pipeline/SKILL.md、skills/quad-platform-publish/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态阅读固定版 README、provider、占位符与代表性总入口/发布技能；未运行目标插件、脚本或平台账号。
- 下一步：对打包产物加载 19 技能；哨兵 key 检查技能输出/模型上下文；测试素材跑制作、核验及各平台受控试发布并记录费用/耗时。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-video-pipeline](https://github.com/439436269-ctrl/dsh-video-pipeline)
- **版本号**：0.1.1（[固定提交 82a85d2](https://github.com/439436269-ctrl/dsh-video-pipeline/tree/82a85d20b67d1d398d49009462d61a741f5a8d51)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

采用秘密引用/受控工具而非正文替换，并维护平台版本/费用/发布门端到端回归，可降低迁移风险；现版未实现。详见[Q04](#research-q04)。

对打包产物加载 19 技能；哨兵 key 检查技能输出/模型上下文；测试素材跑制作、核验及各平台受控试发布并记录费用/耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 49 | 6103 | — | — | 100616 |
| .js | source | 5 | 631 | 399 | 192 | — |
| .mjs | source | 25 | 3975 | 3185 | 561 | — |
| .mjs | test | 2 | 368 | 290 | 42 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline/issues?q=is%3Aissue+created%3A2026-09-22T05%3A57%3A13.473Z..2026-10-22T05%3A57%3A13.473Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A57%3A13.473Z..2026-10-22T05%3A57%3A13.473Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 19 个视频生产/发布 skill 的提供机制、运行前置和占位符/凭据边界，区分作者实录与可复用能力。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 技能包给 DSH 视频工作流提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定仓库 skills/ 下有 19 个 SKILL.md，覆盖总入口、编排、TTS/图/视频/运镜/合成/核验/数据复盘与多平台发布；Host 插件通过 ctx.skills provider 报告候选，用户不必复制目录。它交付的是指令、脚本和资源路径，并不自动安装 ffmpeg、Python、浏览器、平台凭据或替用户完成发布。README/VERIFY 中的生产与安装实录属于作者报告，且部分平台能力取决于账号状态、登录和外部服务。对有既有视频生产链的用户，主要贡献是环节交接/质量门/发布门被组织进一个可发现目录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-69](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/index.js#L1-L69)

插件以 ctx.skills 注册内置 provider。

<details>
<summary>查看原文（69行）</summary>

```text
/**
 * dsh-video-pipeline — bundled video-production skills for the DeepSeek Harness.
 *
 * Mounting this plugin registers a skill provider on `ctx.skills` that serves
 * the `skills/` directory shipped inside the package. Every bundled skill then
 * shows up in the agent's skill catalog with no copy step, and the orchestration
 * skill can reach its atomic skills by name because they are all in one catalog.
 *
 * Nothing here depends on another package: the provider interface is a plain
 * object, so the plugin declares no runtime dependency and cannot hit a peer
 * range resolution failure on install.
 *
 * @module dsh-video-pipeline
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePlaceholders } from './placeholders.js';
import { createBundledSkillProvider, PROVIDER_NAME } from './provider.js';

/** Cordis plugin name. */
export const name = PROVIDER_NAME;

/** Directory holding the bundled skills, relative to this module. */
const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills');

/**
 * Emit a warning through whatever logging surface the host context exposes.
 * The context shape differs between host versions, so this never throws: a
 * missing logger must not take the provider down with it.
 * @param {object} ctx - cordis context.
 * @param {string} message - warning text.
 */
function warn(ctx, message) {
  try {
    const logger = typeof ctx?.logger === 'function' ? ctx.logger(PROVIDER_NAME) : ctx?.logger;
    if (logger && typeof logger.warn === 'function') {
      logger.warn(message);
      return;
    }
  } catch {
    /* fall through to the console */
  }
  try {
    console.warn(`[${PROVIDER_NAME}] ${message}`);
  } catch {
    /* nothing left to report to */
  }
}

/**
 * Register the bundled skill provider.
 * @param {object} ctx - cordis context.
 * @param {object} [config] - loader row config.
 * @param {string[]} [config.enabledSkills] - when non-empty, only these bundled skills are served.
 * @param {Record<string, string>} [config.placeholders] - `{{TOKEN}}` overrides for the bundled bodies.
 */
export function apply(ctx, config = {}) {
  const settings = config && typeof config === 'object' ? config : {};
  const providerOptions = {
    skillsDir: SKILLS_DIR,
    enabledSkills: settings.enabledSkills,
    placeholderMap: resolvePlaceholders(settings.placeholders),
    onWarn: (message) => warn(ctx, message),
  };

  ctx.inject(['skills'], (skillCtx) => {
    skillCtx.skills.registerProvider(() => createBundledSkillProvider(providerOptions));
  });
```

</details>

**依据 2 · 源码核查**：[lib/provider.js:52-169](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/provider.js#L52-L169)

扫描技能目录、验证 frontmatter 并按 rank 600 提供候选。

<details>
<summary>查看原文（118行）</summary>

```text
function discover(skillsDir, warn) {
  let dirents;
  try {
    dirents = readdirSync(skillsDir, { withFileTypes: true });
  } catch (error) {
    warn(`cannot read bundled skills directory ${skillsDir}: ${error.message}`);
    return [];
  }

  const found = [];
  for (const dirent of dirents) {
    const full = join(skillsDir, dirent.name);
    if (dirent.isDirectory()) {
      const file = join(full, SKILL_FILE);
      try {
        if (statSync(file).isFile()) found.push({ dir: full, file });
      } catch {
        warn(`skipping ${dirent.name}: no ${SKILL_FILE}`);
      }
      continue;
    }
    if (dirent.isFile() && dirent.name.endsWith('.md') && dirent.name !== SKILL_FILE) {
      found.push({ dir: skillsDir, file: full });
    }
  }
  return found;
}

/**
 * Read and validate one skill file into a provider candidate.
 * @param {{ dir: string, file: string }} entry - discovered skill file.
 * @param {(message: string) => void} warn - warning sink.
 * @returns {object | undefined} a candidate, or `undefined` when the file is unusable.
 */
function readCandidate(entry, warn) {
  let parsed;
  try {
    parsed = parseFrontmatter(readFileSync(entry.file, 'utf8'));
  } catch (error) {
    warn(`skipping ${entry.file}: ${error.message}`);
    return undefined;
  }

  const { attrs } = parsed;
  const name = typeof attrs.name === 'string' ? attrs.name.trim() : '';
  if (!isSkillName(name)) {
    warn(`skipping ${entry.file}: name must be kebab-case, got ${JSON.stringify(attrs.name)}`);
    return undefined;
  }
  const directoryName = basename(entry.dir);
  if (entry.file === join(entry.dir, SKILL_FILE) && directoryName !== name) {
    warn(`${name}: directory name ${directoryName} differs from frontmatter name (frontmatter wins)`);
  }

  const description = typeof attrs.description === 'string' ? attrs.description.trim() : '';
  if (!description) {
    warn(`skipping ${name}: description is required`);
    return undefined;
  }

  const { policy, error } = invocationPolicy(attrs);
  if (error) {
    warn(`skipping ${name}: ${error}`);
    return undefined;
  }

  const whenToUse = typeof attrs.whenToUse === 'string' ? attrs.whenToUse.trim() : undefined;
  const metadata = attrs.metadata && typeof attrs.metadata === 'object' && !Array.isArray(attrs.metadata)
    ? attrs.metadata
    : undefined;

  return {
    name,
    description,
    whenToUse,
    invocation: policy,
    source: 'bundled',
    provider: PROVIDER_NAME,
    path: entry.file,
    resourceBase: { kind: 'directory', path: entry.dir },
    rank: BUNDLED_SKILL_RANK,
    locator: entry.file,
    metadata,
  };
}

/**
 * Create the bundled skill provider registered on `ctx.skills`.
 * @param {object} options - provider options.
 * @param {string} options.skillsDir - absolute path to the bundled skills root.
 * @param {string[]} [options.enabledSkills] - when non-empty, only these skill names are served.
 * @param {Record<string, string>} [options.placeholderMap] - resolved `{{TOKEN}}` values.
 * @param {(message: string) => void} [options.onWarn] - warning sink.
 * @returns {{ name: string, list: Function, get: Function }} the provider.
 */
export function createBundledSkillProvider(options = {}) {
  const {
    skillsDir,
    enabledSkills = [],
    placeholderMap = {},
    onWarn,
  } = options;
  const warn = typeof onWarn === 'function' ? onWarn : () => {};
  const allowed = new Set((Array.isArray(enabledSkills) ? enabledSkills : []).map(String));
  let catalog;

  /**
   * Build (once) the validated catalog of candidates.
   * @returns {object[]} candidates sorted by name.
   */
  function candidates() {
    if (catalog) return catalog;
    catalog = discover(skillsDir, warn)
      .map((entry) => readCandidate(entry, warn))
      .filter(Boolean)
      .filter((candidate) => allowed.size === 0 || allowed.has(candidate.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    return catalog;
```

</details>

**依据 3 · 作者声明**：[README.md:1-125](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/README.md#L1-L125)

作者列举 19 个 skill、外部前置与生产环节。

<details>
<summary>查看原文（125行）</summary>

````text
# dsh-video-pipeline

把一条**跑通过的真实短视频生产流水线**作为内置 skill 装进 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)：共 19 个技能（1 个总入口 + 1 个编排 + 17 个原子），随插件一起出现在 agent 的技能目录里。

![19 个 skill 的关系与数据流](https://raw.githubusercontent.com/439436269-ctrl/dsh-video-pipeline/main/docs/skill-flow.png)

> 图：19 个 skill 按流水线阶段排列，以及它们之间的交接。实线＝产物数据流，虚线＝编排 skill 对原子 skill 的调度，橙色＝质量门，红色虚线＝数据复盘闭环。（源码 `docs/skill-flow.svg`，由 `node tools/make-flow-diagram.mjs` 生成——skill 集合变了改数据重跑即可。）

列间空隙只有十几像素，图上不写字，所以交接关系列在这里：

| 交接 | 传的是什么 |
|---|---|
| `chinese-tts` → `video-compose` | 配音 wav（先过读音校正，字幕仍写原字） |
| `ark-agent-plan-image` / `ark-seedream-image` / `dreamina-canvas-cli` → `image-to-video` | 关键帧 → 运镜镜头（三条生图线三选一，也可按镜头混用） |
| 三个生图 skill → `ark-seedance-video` | 关键帧当 i2v 首帧，用来锁人物形象 |
| 三个生图 skill → `video-cover` | 关键帧 → 双平台封面（图中以卡片注释表示，避免长线穿图） |
| `image-to-video` / `ark-seedance-video` → `video-compose` | 镜头 mp4（路线①图片运镜与路线②t2v 在这里汇合） |
| `video-compose` → `media-verify` | 成片（先核验再交付） |
| `media-verify` → `quad-platform-publish` | **核验通过才允许发布**（质量门） |
| `quad-platform-publish` → `bilibili-upload` / `tencent-upload` / `douyin-publish` / `xiaohongshu-skills` | 一平台一个 agent 并行发布 |
| `multi-platform-publish-orchestrator` | 与上一条并行的另一条路径：按 JSON 配置顺序批量发 |
| 发布 → `feishu-bitable` | 链接与状态回写 |
| `tangshi-data-review` → `tangshi-pipeline` | 三平台数据复盘修正选片权重与发布节奏（闭环） |
| `video-pipeline` → 其余全部 | 总入口：说明这包是什么、每个环节该加载哪个 skill |

被内置的 `tangshi-pipeline` 另自带一张更细的编排流程图（含两道确认门与并行发布的时序）：`skills/tangshi-pipeline/references/orchestration-flow.png`。

装完不需要往 `~/.agents/skills` 或 `~/.dsh/skills` 复制任何文件——插件自己注册一个 skill provider，把包内的 `skills/` 目录提供给 `ctx.skills`。

同一套 skill 还有一个**宿主中立版**，给 Claude Code / Codex 用（不带 DSH 的插件机制，占位符已落成可读值）：<https://github.com/439436269-ctrl/video-pipeline-skills>。

## 这个插件做了什么

- **提供 19 个 skill**（总入口 1 + 编排 1 + 原子 17），覆盖选题、配音、出图、出视频、运镜、合成、封面、核验、数据复盘、多平台发布、进度回写。
- **自撰一个总入口 skill**（`video-pipeline`），说明这包是什么、每个环节该加载哪个原子 skill、占位符怎么填。安装者没有原作者本机那套同名 skill，所以入口 skill 是这里唯一的起点。
- **不含任何运行时依赖**：只 import Node 内建模块，通过 `ctx.inject(['skills'])` 拿到注册表。没有 `dependencies`，也没有需要宿主解析的 `peerDependencies`，因此不存在 peer 范围解析失败（ERESOLVE）问题。
- **不动别人的 skill**：provider 以 rank 600 报告候选（内置 rank），如果你自己的项目/用户 skill 同名（rank 100-500），**你的版本胜出**，本包不会遮蔽它。

## 安装

```sh
# 从 npm
dsh plugin --profile web add dsh-video-pipeline

# 从 GitHub
dsh plugin --profile web add github:439436269-ctrl/dsh-video-pipeline

# 本地开发（软链到源码目录）
dsh plugin --profile web add "link:/path/to/dsh-video-pipeline"

# 卸载
dsh plugin --profile web remove dsh-video-pipeline
```

装完重启 DSH Desktop，然后问 agent「有哪些视频流水线的 skill」即可看到目录。

## 包内 skill

| skill | 类型 | 作用 |
|---|---|---|
| `video-pipeline` | 总入口（本包自撰） | 流水线骨架、环节与原子 skill 对照、占位符与前置依赖 |
| `tangshi-pipeline` | 编排 | 双版本（读诗版/故事版）批量生产与发布全流程：规格定稿、时序、成本基线、质量门 |
| `chinese-tts` | 原子·生产 | 中文配音：多音字读音校正（朝zhāo/还huán/重chóng/骑jì/教jiào/载zǎi）、音色与 context 模板 |
| `ark-agent-plan-image` | 原子·生产 | 火山 Agent Plan 通道文生图（扣 Plan 配额） |
| `ark-seedream-image` | 原子·生产 | 火山标准通道文生图（按量后付费），含价格表与开通指引 |
| `ark-seedance-video` | 原子·生产 | Seedance 文生视频 / 图生视频单条镜头，含 token 用量公式与任务管理 |
| `image-to-video` | 原子·生产 | 单张关键帧 → ffmpeg zoompan 运镜镜头 |
| `dreamina-canvas-cli` | 原子·生产 | 即梦画布 CLI（备用生成线） |
| `video-compose` | 原子·合成 | 镜头列表 + 配音时间轴 + SRT → 竖屏成片（一条 manifest） |
| `video-cover` | 原子·合成 | B 站 16:10 与竖屏双封面一次出图 |
| `media-verify` | 原子·核验 | astats 音频对位、线上音频版本比对、抽帧白屏检测 |
| `tangshi-data-review` | 原子·复盘 | 三平台播放数据采集、衰减分档与复盘报告 |
| `quad-platform-publish` | 编排·发布 | 四平台发布总控（含发布前读音核查与确认门） |
| `multi-platform-publish-orchestrator` | 编排·发布 | 按 JSON 配置顺序执行多平台发布 |
| `bilibili-upload` | 原子·发布 | B 站投稿与合集管理（biliup） |
| `tencent-upload` | 原子·发布 | 视频号上传与合集管理 |
| `douyin-publish` | 原子·发布 | 抖音创作者中心上传发布与合集管理 |
| `xiaohongshu-skills` | 原子·发布（第三方） | 小红书图文/视频发布、检索与互动，见 [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) |
| `feishu-bitable` | 协作 | 飞书多维表格读写（进度回写） |

## 配置

在 profile 的 `cordis.patch.yml` 里按 entry id 覆盖。**patch 对 `config` 是整块替换**，想保留的键要一并写出：

```yaml
- id: dsh-video-pipeline
  config:
    enabledSkills:            # 省略或空数组 = 放出全部 19 个
      - video-pipeline
      - video-compose
      - media-verify
    placeholders:             # 覆盖内置占位符；加载 skill 时替换正文里的 {{TOKEN}}
      FEISHU_BASE_APP: your_base_app_token
      FEISHU_TABLE: tblXXXXXXXXXX
      FEISHU_RECORD: recXXXXXXXXXX
      NAS_DELIVERABLE_DIR: /your/nas/deliverables
      ARK_API_KEY_FILE: /your/path/ark_key.txt
```

| 键 | 默认值 | 作用 |
|---|---|---|
| `enabledSkills` | `[]`（全部） | 只放出指定 skill；用于把包装成只做某一段能力 |
| `placeholders` | `{}` | 覆盖 `{{TOKEN}}` 的取值。取值优先级：本配置 → 环境变量 → 内置可读默认值 |

### 占位符

发布前把原作者环境相关的内容全换成了占位符。加载 skill 正文时按上表优先级替换成你的值：

| 占位符 | 含义 | 可用的环境变量 |
|---|---|---|
| `USER_HOME` | 本机用户目录 | `USERPROFILE` / `HOME` |
| `WORKSPACE` | 工作区根目录 | `DSH_WORKSPACE` / `WORKSPACE` |
| `ARK_API_KEY` | 火山方舟 API key | `ARK_API_KEY` / `ARK_STD_KEY` |
| `ARK_API_KEY_FILE` | 本地存放 key 的文件 | `ARK_API_KEY_FILE` |
| `FEISHU_BASE_APP` / `FEISHU_TABLE` / `FEISHU_RECORD` | 飞书多维表格坐标 | 同名 |
| `NAS_DELIVERABLE_DIR` / `NAS_DELIVERABLE_PARENT` / `NAS_HOST` | NAS 交付目录与主机 | 同名 |

**只替换 skill 正文**。`skills/*/scripts/` 下是真实脚本文件，里面的占位符需要你自己改成实际值——skill 正文会说明每个值的含义。

## 前置依赖

本包只提供 skill（指令与脚本），**不安装任何工具**：

- **ffmpeg**：合成、运镜、核验都依赖。`xfade`/`ass`/`loudnorm` 等滤镜需要较新版本。
- **Python 3** + `Pillow`：`scripts/` 下的 py 脚本（封面、图处理、封面比对）。
````

</details>

#### 缺口

- 未在目标 DSH 环境执行完整短片制作/发布。
  **影响**：无法把技能目录和作者实录当本轮成片质量或多平台成功证明。
  **进一步探讨**：在隔离素材与测试账号下逐环节验证产物、核验门和发布结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · provider 怎样解析覆盖和资源，哪里会失配？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

provider 只扫描 skills 根一层的目录 bundle/平铺 Markdown，读取 frontmatter 的 name、description、invocation，过滤 enabledSkills，按 rank 600 让较高优先级的用户/项目同名技能胜出。get 仅替换技能正文、描述和 whenToUse 中的占位符，resourceBase 指向原脚本目录，不改 scripts/ 内的占位符。于是“安装即见目录”可由源码理解，但“开箱即执行”不成立：脚本和本地路径、工具、账号还需使用者配置。固定树有另一个 authored 源文件，技能候选盘点数与实际 provider 可发现目录应分开；skills/ 目录下确有 19 个 SKILL.md。

#### 证据与依据

**依据 1 · 源码核查**：[lib/provider.js:52-169](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/provider.js#L52-L169)

一层扫描、frontmatter 校验、rank 600 与过滤。

<details>
<summary>查看原文（118行）</summary>

```text
function discover(skillsDir, warn) {
  let dirents;
  try {
    dirents = readdirSync(skillsDir, { withFileTypes: true });
  } catch (error) {
    warn(`cannot read bundled skills directory ${skillsDir}: ${error.message}`);
    return [];
  }

  const found = [];
  for (const dirent of dirents) {
    const full = join(skillsDir, dirent.name);
    if (dirent.isDirectory()) {
      const file = join(full, SKILL_FILE);
      try {
        if (statSync(file).isFile()) found.push({ dir: full, file });
      } catch {
        warn(`skipping ${dirent.name}: no ${SKILL_FILE}`);
      }
      continue;
    }
    if (dirent.isFile() && dirent.name.endsWith('.md') && dirent.name !== SKILL_FILE) {
      found.push({ dir: skillsDir, file: full });
    }
  }
  return found;
}

/**
 * Read and validate one skill file into a provider candidate.
 * @param {{ dir: string, file: string }} entry - discovered skill file.
 * @param {(message: string) => void} warn - warning sink.
 * @returns {object | undefined} a candidate, or `undefined` when the file is unusable.
 */
function readCandidate(entry, warn) {
  let parsed;
  try {
    parsed = parseFrontmatter(readFileSync(entry.file, 'utf8'));
  } catch (error) {
    warn(`skipping ${entry.file}: ${error.message}`);
    return undefined;
  }

  const { attrs } = parsed;
  const name = typeof attrs.name === 'string' ? attrs.name.trim() : '';
  if (!isSkillName(name)) {
    warn(`skipping ${entry.file}: name must be kebab-case, got ${JSON.stringify(attrs.name)}`);
    return undefined;
  }
  const directoryName = basename(entry.dir);
  if (entry.file === join(entry.dir, SKILL_FILE) && directoryName !== name) {
    warn(`${name}: directory name ${directoryName} differs from frontmatter name (frontmatter wins)`);
  }

  const description = typeof attrs.description === 'string' ? attrs.description.trim() : '';
  if (!description) {
    warn(`skipping ${name}: description is required`);
    return undefined;
  }

  const { policy, error } = invocationPolicy(attrs);
  if (error) {
    warn(`skipping ${name}: ${error}`);
    return undefined;
  }

  const whenToUse = typeof attrs.whenToUse === 'string' ? attrs.whenToUse.trim() : undefined;
  const metadata = attrs.metadata && typeof attrs.metadata === 'object' && !Array.isArray(attrs.metadata)
    ? attrs.metadata
    : undefined;

  return {
    name,
    description,
    whenToUse,
    invocation: policy,
    source: 'bundled',
    provider: PROVIDER_NAME,
    path: entry.file,
    resourceBase: { kind: 'directory', path: entry.dir },
    rank: BUNDLED_SKILL_RANK,
    locator: entry.file,
    metadata,
  };
}

/**
 * Create the bundled skill provider registered on `ctx.skills`.
 * @param {object} options - provider options.
 * @param {string} options.skillsDir - absolute path to the bundled skills root.
 * @param {string[]} [options.enabledSkills] - when non-empty, only these skill names are served.
 * @param {Record<string, string>} [options.placeholderMap] - resolved `{{TOKEN}}` values.
 * @param {(message: string) => void} [options.onWarn] - warning sink.
 * @returns {{ name: string, list: Function, get: Function }} the provider.
 */
export function createBundledSkillProvider(options = {}) {
  const {
    skillsDir,
    enabledSkills = [],
    placeholderMap = {},
    onWarn,
  } = options;
  const warn = typeof onWarn === 'function' ? onWarn : () => {};
  const allowed = new Set((Array.isArray(enabledSkills) ? enabledSkills : []).map(String));
  let catalog;

  /**
   * Build (once) the validated catalog of candidates.
   * @returns {object[]} candidates sorted by name.
   */
  function candidates() {
    if (catalog) return catalog;
    catalog = discover(skillsDir, warn)
      .map((entry) => readCandidate(entry, warn))
      .filter(Boolean)
      .filter((candidate) => allowed.size === 0 || allowed.has(candidate.name))
      .sort((a, b) => a.name.localeCompare(b.name));
    return catalog;
```

</details>

**依据 2 · 源码核查**：[lib/provider.js:172-213](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/provider.js#L172-L213)

get 时只替换正文/描述并返回 resourceBase。

<details>
<summary>查看原文（42行）</summary>

```text
  return {
    name: PROVIDER_NAME,

    /**
     * List every bundled skill for the current lookup.
     * @param {{ signal?: AbortSignal }} [lookup] - lookup options.
     * @returns {Promise<object[]>} provider candidates.
     */
    async list(lookup) {
      if (lookup?.signal?.aborted) return [];
      return candidates();
    },

    /**
     * Load one bundled skill body, with placeholders resolved.
     * @param {object} candidate - a candidate previously returned by `list`.
     * @param {{ signal?: AbortSignal }} [lookup] - lookup options.
     * @returns {Promise<object | undefined>} the full definition, or `undefined` when unreadable.
     */
    async get(candidate, lookup) {
      if (lookup?.signal?.aborted) return undefined;
      let parsed;
      try {
        parsed = parseFrontmatter(readFileSync(candidate.locator, 'utf8'));
      } catch (error) {
        warn(`cannot load ${candidate.name}: ${error.message}`);
        return undefined;
      }
      const { policy } = invocationPolicy(parsed.attrs);
      const content = applyPlaceholders(parsed.body.replace(/^\s*\n/, ''), placeholderMap);
      return {
        name: candidate.name,
        description: applyPlaceholders(candidate.description, placeholderMap),
        whenToUse: candidate.whenToUse ? applyPlaceholders(candidate.whenToUse, placeholderMap) : undefined,
        invocation: policy ?? candidate.invocation,
        source: 'bundled',
        provider: PROVIDER_NAME,
        path: candidate.path,
        resourceBase: candidate.resourceBase,
        metadata: candidate.metadata,
        content,
      };
```

</details>

**依据 3 · 源码核查**：[skills/video-pipeline/SKILL.md:67-86](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/skills/video-pipeline/SKILL.md#L67-L86)

技能总入口明确脚本占位符需另行修改并列前置。

<details>
<summary>查看原文（20行）</summary>

````text
  config:
    placeholders:
      FEISHU_BASE_APP: your_base_app_token
      NAS_DELIVERABLE_DIR: /your/nas/deliverables
```

**脚本里的占位符不会自动替换**：`scripts/` 下的 python/mjs 是真实脚本文件，里面的 `{{USER_HOME}}`、`<你的 …>` 需要你改成自己的值再跑。skill 正文里会说明每个值的含义。

## 前置依赖

- **ffmpeg**（合成、运镜、核验都依赖）——版本越新越好，`xfade`/`ass`/`loudnorm` 需要较新版。
- **Python 3**（`scripts/` 下的 py 脚本），配 `Pillow`（封面/图处理）。
- **Node.js**（`scripts/` 下的 mjs 脚本）+ 各平台需要时装 `playwright`。
- **各平台自己的凭据**：B 站 `biliup` 凭据、视频号/抖音/小红书的登录态。这些必须你自己登录获取，本包不含任何凭据。

## 打包说明与第三方代码

- 本包的 skill 来自一条真实生产流水线，发布前已**剥离**：真实 API key、cookie/登录态、平台账号 ID（作品号/合集号/UID）、个人绝对路径、内网地址，以及**全部真实运营数据**——包括五份数据复盘文档，以及正文里对作者账号播放表现的绝对数字与实测倍率（已改写成定性规则）。保留下来的是可执行的方法论：产能上限、发布时段、采样制度、选片权重、质量门。要按同样口径复现，用 `tangshi-data-review` 的采集脚本对自己的账号重跑。
- `xiaohongshu-skills` 是第三方 MIT 代码（`white0dew/XiaohongshuSkills`，LICENSE 署名 angiin），随包保留了其许可证与署名，详见 `THIRD-PARTY-NOTICES.md`。
- 部分 `scripts/` 里引用的输入文件（`posts.json`、`*-stats.json`、`dy_works_all.json` 等）是**采集脚本自己写出来的产物**，首次运行前并不存在——按顺序先跑采集再跑分析即可。
````

</details>

#### 缺口

- 未在当前宿主版本验证冲突优先级和资源路径。
  **影响**：真实安装中技能可见不等于脚本可跑。
  **进一步探讨**：从打包产物加载 19 个候选，并对各原子脚本做依赖/路径试运行。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 占位符与公开素材有哪些实际安全边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

resolvePlaceholders 优先从环境变量读取 ARK_API_KEY/ARK_STD_KEY，再允许插件配置覆盖；get 将 `{{ARK_API_KEY}}` 直接替换进 video-pipeline 的可见正文表格。若 Host 进程带真实 key，加载该技能会把密钥放进 Agent 上下文/技能响应，可能被会话记录、提示回显或外部模型看到；这和“包里没有凭据”是不同边界。README 表明脚本里的占位符不改，用户还得处理 Python/Node 脚本。导入器的 0 残留、作者 E2E/打包试验是作者报告，不是我们对未来配置和第三方技能安全的证明。包内还集成第三方小红书技能，外部依赖与许可边界需独立核查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/placeholders.js:21-95](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/placeholders.js#L21-L95)

ARK_API_KEY 从环境变量/覆盖读取并对正文做文本替换。

<details>
<summary>查看原文（75行）</summary>

```text
  USER_HOME: '%USERPROFILE%',
  WORKSPACE: '<你的工作区>',
  FEISHU_BASE_APP: '<飞书多维表格 base app_token>',
  FEISHU_TABLE: '<飞书数据表 table_id>',
  FEISHU_RECORD: '<飞书记录 record_id>',
  NAS_DELIVERABLE_DIR: '<NAS 交付目录，如 /sata1/public/公共分组/唐诗300首短剧>',
  NAS_DELIVERABLE_PARENT: '<NAS 交付目录的父目录>',
  NAS_HOST: '<NAS 主机>',
  ARK_API_KEY: '<设置环境变量 ARK_API_KEY>',
  ARK_API_KEY_FILE: '<本地保存 ARK key 的文件>',
});

/** Environment variables that fill a placeholder when the config does not. */
const ENV_SOURCES = Object.freeze({
  USER_HOME: ['USERPROFILE', 'HOME'],
  WORKSPACE: ['DSH_WORKSPACE', 'WORKSPACE'],
  ARK_API_KEY: ['ARK_API_KEY', 'ARK_STD_KEY'],
  NAS_DELIVERABLE_DIR: ['NAS_DELIVERABLE_DIR'],
  NAS_DELIVERABLE_PARENT: ['NAS_DELIVERABLE_PARENT'],
  NAS_HOST: ['NAS_HOST'],
  ARK_API_KEY_FILE: ['ARK_API_KEY_FILE'],
  FEISHU_BASE_APP: ['FEISHU_BASE_APP'],
  FEISHU_TABLE: ['FEISHU_TABLE'],
  FEISHU_RECORD: ['FEISHU_RECORD'],
});

/**
 * Build the effective placeholder map for one plugin instance.
 * Precedence: explicit config override, then environment, then built-in
 * default, then the local home directory as a last resort for `USER_HOME`.
 * @param {Record<string, unknown>} [overrides] - `config.placeholders` from the loader row.
 * @param {Record<string, string | undefined>} [env] - environment to read; defaults to `process.env`.
 * @returns {Record<string, string>} token to replacement text.
 */
export function resolvePlaceholders(overrides, env = process.env) {
  const map = { ...PLACEHOLDER_DEFAULTS };
  for (const [token, names] of Object.entries(ENV_SOURCES)) {
    for (const name of names) {
      const value = env?.[name];
      if (typeof value === 'string' && value.trim()) {
        map[token] = value;
        break;
      }
    }
  }
  if (map.USER_HOME === PLACEHOLDER_DEFAULTS.USER_HOME) {
    try {
      const home = homedir();
      if (home) map.USER_HOME = home;
    } catch {
      /* keep the readable default */
    }
  }
  if (overrides && typeof overrides === 'object') {
    for (const [token, value] of Object.entries(overrides)) {
      if (value === undefined || value === null) continue;
      map[token] = String(value);
    }
  }
  return map;
}

/**
 * Replace `{{TOKEN}}` occurrences with their resolved text.
 * Unknown tokens are left untouched so a typo stays visible instead of turning
 * into an empty string inside an instruction.
 * @param {string} text - skill body or description.
 * @param {Record<string, string>} map - resolved placeholders.
 * @returns {string} substituted text.
 */
export function applyPlaceholders(text, map) {
  if (typeof text !== 'string' || !text.includes('{{')) return text;
  return text.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (match, token) =>
    Object.prototype.hasOwnProperty.call(map, token) ? String(map[token]) : match);
}
```

</details>

**依据 2 · 源码核查**：[lib/provider.js:186-211](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/provider.js#L186-L211)

get 对技能正文和描述应用占位符。

<details>
<summary>查看原文（26行）</summary>

```text
     * Load one bundled skill body, with placeholders resolved.
     * @param {object} candidate - a candidate previously returned by `list`.
     * @param {{ signal?: AbortSignal }} [lookup] - lookup options.
     * @returns {Promise<object | undefined>} the full definition, or `undefined` when unreadable.
     */
    async get(candidate, lookup) {
      if (lookup?.signal?.aborted) return undefined;
      let parsed;
      try {
        parsed = parseFrontmatter(readFileSync(candidate.locator, 'utf8'));
      } catch (error) {
        warn(`cannot load ${candidate.name}: ${error.message}`);
        return undefined;
      }
      const { policy } = invocationPolicy(parsed.attrs);
      const content = applyPlaceholders(parsed.body.replace(/^\s*\n/, ''), placeholderMap);
      return {
        name: candidate.name,
        description: applyPlaceholders(candidate.description, placeholderMap),
        whenToUse: candidate.whenToUse ? applyPlaceholders(candidate.whenToUse, placeholderMap) : undefined,
        invocation: policy ?? candidate.invocation,
        source: 'bundled',
        provider: PROVIDER_NAME,
        path: candidate.path,
        resourceBase: candidate.resourceBase,
        metadata: candidate.metadata,
```

</details>

**依据 3 · 源码核查**：[skills/video-pipeline/SKILL.md:55-62](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/skills/video-pipeline/SKILL.md#L55-L62)

总入口正文含 ARK_API_KEY 占位符。

```text
|---|---|---|
| `{{USER_HOME}}` | 本机用户目录 | `USERPROFILE` / `HOME` |
| `{{WORKSPACE}}` | 你的工作区根目录 | `DSH_WORKSPACE` / `WORKSPACE` |
| `{{ARK_API_KEY}}` | 火山方舟 API key | `ARK_API_KEY` / `ARK_STD_KEY` |
| `{{ARK_API_KEY_FILE}}` | 本地存放 key 的文件路径 | `ARK_API_KEY_FILE` |
| `{{FEISHU_BASE_APP}}` / `{{FEISHU_TABLE}}` / `{{FEISHU_RECORD}}` | 飞书多维表格坐标 | 同名 |
| `{{NAS_DELIVERABLE_DIR}}` / `{{NAS_DELIVERABLE_PARENT}}` / `{{NAS_HOST}}` | NAS 交付目录与主机 | 同名 |

```

**依据 4 · 作者声明**：[README.md:136-173](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/README.md#L136-L173)

作者描述发布前脱敏、第三方包和脚本引用边界。

<details>
<summary>查看原文（38行）</summary>

````text
- **保留但清空为模板**：4 个「被剔除但脚本仍要读」的输入文件，以空结构随包（`heji-state.json`、`map-dushi.json`、`map-gushi.json`、`dy_t.example.json`）。

复扫门检查 4 类东西：密钥/账号标识/本机路径/内网地址残留、33 个脚本的语法可解析性（防止脱敏改写坏代码）、被剔除文件仍被引用、以及 SKILL.md 是否可被 provider 正常解析。当前结果：**85 个文件、0 处残留、语法全通过**。

### 已知边界

- 部分脚本的**输入**是采集脚本自己写出的产物（`posts.json`、`*-stats.json`、`dy_works_all.json`），首次运行前并不存在——先跑采集再跑分析。`tools/import-report.txt` 列出了全部这类引用。
- **不含真实运营数据**：`tangshi-pipeline` 的五份数据复盘文档（`references/data-review-*.md`）**已按作者要求剔除**，正文里对作者账号播放表现的绝对数字与实测倍率也一并改写成定性规则（改写与脱敏分开计数，见 `tools/import-report.txt`）。保留下的是提炼后的可执行规则——产能上限、发布时段、采样制度、选片权重；要复现同样的口径，用 `tangshi-data-review` 的采集脚本对自己的账号重跑。
- `xiaohongshu-skills` 是第三方 MIT 代码；上游 README（含赞助位与作者联系方式）未随包。
- **有一处正文提到本包未含的外部 skill**：`bilibili-upload` 的「论文视频投稿」路径依赖外部 skill `paper-bilibili-uploader`（来自第三方 `yhbcode000/paper-share-skills`）。本包不含它，相关章节已标明为外部；B 站投稿引擎 `biliup` 本身已包含。导入报告里会列出所有这类「提到但未打进包」的 skill（`tools/import-report.txt`）。

## 结构

```
dsh-video-pipeline/
├── package.json          # dsh.bundle.patch 是市场收录的硬性要求
├── cordis.patch.yml      # 往 profile 插一行宿主插件行
├── lib/
│   ├── index.js          # 插件入口：apply() 里向 ctx.skills 注册 provider
│   ├── provider.js       # 扫描 skills/、解析 frontmatter、rank 600、resourceBase
│   ├── frontmatter.js    # 无依赖的 YAML frontmatter 子集解析（含块标量与嵌套 map）
│   └── placeholders.js   # {{TOKEN}} 取值与替换
├── skills/               # 19 个 skill（由 tools/import-skills.mjs 生成）
├── authored/             # 本包自撰的 skill 源文件（导入时写入 skills/）
├── docs/                 # skill-flow.svg + .png（由 tools/make-flow-diagram.mjs 生成；不进制品包，README 用 raw 地址取）
├── tools/
│   ├── import-skills.mjs # 可复现导入器：--audit / --write / --verify
│   ├── scrub-rules.mjs   # 剔除、脱敏、文档准确性改写、残留扫描的唯一规则来源
│   ├── verify-artifact.mjs # 打包 → 解包 → 真实加载解出来的入口
│   ├── preflight.mjs     # 只读发布自检（远端占用 / git / 三道门 / 凭据）
│   ├── setup-repo.mjs    # 建仓 + 设 topics + 推送 + 核对远端 SHA
│   └── make-flow-diagram.mjs # 生成 docs/skill-flow.svg + .png
└── test/
    ├── provider.test.mjs # provider 行为 + 对真实 skills/ 的集成断言
    └── rules.test.mjs    # 规则回归：每个用例对应一个真实踩过的坑
```

## 开发
````

</details>

#### 缺口

- 没有验证真实 key 是否进入宿主日志/模型请求或工具输出。
  **影响**：泄露范围取决于 DSH 技能加载与会话保存方式。
  **进一步探讨**：用假的哨兵 key 加载技能并检查模型请求/会话存储，移除密钥正文替换。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安全试用并评估它的生产效率？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先按需启用少数非发布技能，从生成→合成→media-verify 在无真实账号的测试素材上跑通，并确认外部工具/依赖版本；任何 API 花费、公开发布和飞书回写按各技能内门槛由操作者显式确认。发布前对标题、封面、可见性和账号状态人工核对，不能因为作者历史实录就视新账户可用。建议默认不把 ARK_API_KEY 直接注入技能正文，改为本地安全文件/受控工具读取；对各平台做版本化端到端测试。成本含云生成、ffmpeg、浏览器登录、平台审查和手工复核，不能从 19 个目录推断节省时间。

#### 证据与依据

**依据 1 · 源码核查**：[skills/video-pipeline/SKILL.md:42-51](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/skills/video-pipeline/SKILL.md#L42-L51)

总入口列出花费确认、质量门与发布确认。

<details>
<summary>查看原文（10行）</summary>

```text
1. **选题与门①**：定诗题/题材 → 出报价（图 + 视频张数/秒数 × 刊例）→ **等用户确认再动 API 花钱**。
2. **生产**：TTS 配音 → 场景图 → 镜头（图片运镜 或 t2v）→ 合成 → 核验。生产段可以整段并行：图与视频先生成、统一 poll。
3. **质量门**：`media-verify` 核音频对位与静默窗、抽帧查白屏与人物一致性；不合格回炉，不进入发布。
4. **门②发布确认**：标题、封面、可见性给用户确认一次。**这一步不能省**——发布是外部可见动作。
5. **发布与回写**：按平台并行发布 → 回读平台确认成功 → 把链接与状态回写飞书。

顺序上两条硬经验：**生产与发布重叠**（发布 agent 跑起来后主线程就开始下一集），**同平台资源不共享浏览器 profile**（互相杀进程会让发布卡住）。

## 配置：占位符怎么填

```

</details>

**依据 2 · 作者声明**：[README.md:101-135](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/README.md#L101-L135)

作者列出外部工具/凭据与占位符配置。

<details>
<summary>查看原文（35行）</summary>

```text
|---|---|---|
| `enabledSkills` | `[]`（全部） | 只放出指定 skill；用于把包装成只做某一段能力 |
| `placeholders` | `{}` | 覆盖 `{{TOKEN}}` 的取值。取值优先级：本配置 → 环境变量 → 内置可读默认值 |

### 占位符

发布前把原作者环境相关的内容全换成了占位符。加载 skill 正文时按上表优先级替换成你的值：

| 占位符 | 含义 | 可用的环境变量 |
|---|---|---|
| `USER_HOME` | 本机用户目录 | `USERPROFILE` / `HOME` |
| `WORKSPACE` | 工作区根目录 | `DSH_WORKSPACE` / `WORKSPACE` |
| `ARK_API_KEY` | 火山方舟 API key | `ARK_API_KEY` / `ARK_STD_KEY` |
| `ARK_API_KEY_FILE` | 本地存放 key 的文件 | `ARK_API_KEY_FILE` |
| `FEISHU_BASE_APP` / `FEISHU_TABLE` / `FEISHU_RECORD` | 飞书多维表格坐标 | 同名 |
| `NAS_DELIVERABLE_DIR` / `NAS_DELIVERABLE_PARENT` / `NAS_HOST` | NAS 交付目录与主机 | 同名 |

**只替换 skill 正文**。`skills/*/scripts/` 下是真实脚本文件，里面的占位符需要你自己改成实际值——skill 正文会说明每个值的含义。

## 前置依赖

本包只提供 skill（指令与脚本），**不安装任何工具**：

- **ffmpeg**：合成、运镜、核验都依赖。`xfade`/`ass`/`loudnorm` 等滤镜需要较新版本。
- **Python 3** + `Pillow`：`scripts/` 下的 py 脚本（封面、图处理、封面比对）。
- **Node.js**：`scripts/` 下的 mjs 脚本。
- **playwright**：发布类 skill 需要时自行安装。
- **各平台凭据**：B 站 `biliup` 凭据、视频号/抖音/小红书登录态，必须你自己登录获取。**本包不含任何凭据、cookie 或真实账号 ID。**

## 发布前的脱敏（重要）

本包基于一条真实生产流水线，公开前做了逐文件的剔除与替换，并有独立的复扫门（`tools/import-skills.mjs --verify`）来证明结果：

- **删除**：真实 API key 文件、登录态缓存、Python 字节码、以及 170 个只属于原作者项目历史的文件（真实播放数据快照、合集映射、逐集一次性脚本、当时操作截图）。
- **替换为占位符**：飞书 base/table/record ID、NAS 路径与内网地址、本机绝对路径、以及真实账号/作品标识（视频号 FINDER_ID、抖音 aweme_id、B 站 UID 与 seasonId、小红书笔记与合集 ID、B 站稿件号）。
```

</details>

**依据 3 · 作者声明**：[VERIFY.md:1-116](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/VERIFY.md#L1-L116)

作者的隐私门、目录和打包安装记录。

<details>
<summary>查看原文（116行）</summary>

````text
# VERIFY.md — 验证记录

本文件记录 0.1.0 的验证过程与原始证据。按发布要求，路径已脱敏为 `%USERPROFILE%` / `<plugin dir>`。

环境：Windows，Node v22.16.0，pnpm 11.7.0，`dsh` CLI 0.1.5-rc.3。

## 1. 隐私门（P5）

```
$ node tools/import-skills.mjs --write
合计：保留 45，脱敏 35，准确性改写 15，剔除 175，自撰 1，模板 4
写入 85 个文件

$ node tools/import-skills.mjs --verify
校验 85 个文件（其中 33 个脚本做了语法解析）；残留 0 处
未发现密钥、账号标识、本机路径、内网地址残留，脚本语法可解析，全部通过。
exit 0
```

`--verify` 检查四类东西：密钥/账号标识/本机路径/内网地址残留、脚本语法可解析性、`SKILL.md` 可解析性、以及每个应存在的 skill 目录是否存在。

导入过程中门禁抓出并修掉了 5 个真实问题（说明这道门不是形式）：

| # | 问题 | 怎么发现的 | 处置 |
|---|---|---|---|
| 1 | `^map-.*\.json$` 这类锚定文件名的剔除规则对 `scripts/heji/map-*.json` 不生效，真实合集映射被当成保留文件 | `--audit` 报告里该文件出现在「改」而不是「删」 | 规则改为任意深度匹配 |
| 2 | `dropReason` 改为传 skill 前缀后，`^ARK_KEY\.txt$` 失效，**真实 API key 文件被复制进包** | `--verify` 残留扫描命中 `ARK API key` | 规则改为 `(^|\/)ARK_KEY\.txt$` |
| 3 | 脱敏把 `set_cover.mjs` 里的解析正则 `/encfilekey=([^&]*)/` 改成了 `/encfilekey=<签名>&]*)/` | 语法/残留扫描与逐行比对 | 删除该条过宽规则（真实签名值只存在于已剔除的数据文件里），残留判据改为匹配**签名的值**而不是参数名 |
| 4 | `bili_api.mjs` 内嵌整张 EP→BV 真实映射表（只替换了已知的一个 BV） | 独立宽形态扫描 `BV1[0-9A-Za-z]{9}` | 改为按形态替换全部稿件号 |
| 5 | `stage_writability_probe.py` 里飞书 table_id 被当作 **Python 变量名**，替换成 `{{TOKEN}}` 后语法错误 | `--verify` 的 Python 语法解析 | 增补「作标识符」形态规则，替换成合法标识符 |

另有一次自撰内容导致的失败：`video-pipeline/SKILL.md` 正文里写了字面的 `{{TOKEN}}`，被单测判为未知占位符 → 改写措辞。

还有一次是**门自身**的可移植性缺陷（加 CI 时暴露）：`.py` 的语法检查原本写死 `python`，在只有 `python3` 的机器（如 ubuntu CI runner）上会 `ENOENT`，被当成「语法失败」误报红灯。已改为先探测 `PYTHON` → `python3` → `python`，都不可用则如实报告「跳过」而不是失败。

另一个同类盲点：**无扩展名的文本文件**（`LICENSE`、`.gitkeep`）原本被判成二进制原样复制，于是既逃过残留扫描，也逃过行尾检查——「包内文本行尾统一为 LF」这句话当时并不成立（`skills/xiaohongshu-skills/LICENSE` 仍是 CRLF）。已补 `TEXT_FILENAMES` 与 `isTextPath()`，两处检查共用同一判据。

## 2. 单测（P3）

```
$ node --test test/provider.test.mjs
# tests 12   # pass 12   # fail 0
```

覆盖：frontmatter 三种形态（内联/块标量/嵌套 map）、非法 frontmatter 与非法布尔值必须被丢弃并告警、kebab-case 校验、占位符优先级与未知占位符保留、目录 bundle 与平铺文件发现、`enabledSkills` 过滤、不可读目录不抛异常、以及**对真实 `skills/` 目录的集成断言**（19 个 skill 全部可解析、描述非空、正文非空、无未声明的占位符）。

## 3. 临时 profile 装载（P1）

```
$ dsh --profile video-verify --from-default-profile web --dump-config    # 529 行，stderr 空
$ dsh plugin --profile video-verify add "link:<plugin dir>"
$ dsh --profile video-verify --dump-config
...
> # == dsh-video-pipeline
> - id: dsh-video-pipeline
>   name: dsh-video-pipeline
stderr: 空   exit 0
```

插件行出现在合成配置里，stderr 为空 → `dsh.bundle.patch` 被自动应用。

## 4. 真实挂载端到端（P3/P4）

用 headless 模板另建 profile，装同一个包，跑真实 agent 任务。

**4a. 内置 skill 进入了真实技能目录**

```
$ dsh --profile video-e2e "把技能目录里所有 skill 的 name 逐行列出来…"
… video-pipeline …（列表中含 video-pipeline，此前该名字在本机不存在）
```

反证：`%USERPROFILE%\.agents\skills\video-pipeline`、`%USERPROFILE%\.dsh\skills\video-pipeline`、`<cwd>\.dsh\skills`、`<cwd>\.agents\skills` 全部不存在 → 该条目只可能来自插件包内置目录。

**4b. 占位符在真实宿主里被替换**

```
$ dsh --profile video-e2e "加载 video-pipeline，报出占位符表 USER_HOME 一行的实际取值"
C:\Users\<user>
```

文件里写的是 `{{USER_HOME}}`，agent 看到的是本机真实路径 → 取值链（配置 → 环境变量 → 内置默认 → 本机 home）在真实宿主里生效。

**4c. rank 优先级：插件不遮蔽使用者自己的同名 skill**

```
$ dsh --profile video-e2e "加载 tangshi-pipeline，报出 skill 文件所在目录"
C:\Users\<user>\.agents\skills\tangshi-pipeline
```

解析到本机用户 skill（rank 500）而不是包内的内置副本（rank 600）→ 同名时使用者自己的版本胜出，符合设计。

**改动后复跑**（行尾归一、files 改 glob、新增 CI 与发布物检查之后，同一 profile 重跑一次）：

```
$ dsh --profile video-e2e "列出技能目录里 name 以 video- 开头的 skill"
video-compose
video-cover
video-pipeline
```

内置条目仍在目录里 → 上述改动没有破坏装载。

## 4b. 从 tarball 安装（分发路径，非 link:）

前面 3、4 节用的是 `link:` 指向源码目录，验证的是**开发路径**。真实安装（`dsh plugin add` 或从 npm/GitHub）走的是 tarball，于是另起一个 profile 装了打包产物：

```
$ npm pack --pack-destination <tmp>            # dsh-video-pipeline-0.1.0.tgz（564 KB）
$ dsh --profile video-tgz --from-default-profile headless --dump-config
$ dsh plugin --profile video-tgz add "file:<tmp>/dsh-video-pipeline-0.1.0.tgz"
+ dsh-video-pipeline file:.../dsh-video-pipeline-0.1.0.tgz

$ # 安装形态：确认是真的目录副本，不是软链
$ (Get-Item ...\profiles\video-tgz\node_modules\dsh-video-pipeline).LinkType
（空）→ 真实目录副本，等价于 npm 安装
````

</details>

#### 缺口

- 缺少独立成片质量、各平台发布与成本对照。
  **影响**：无法判断 19 技能组合的实际生产收益。
  **进一步探讨**：用相同素材/账号比较人工流程与技能包的耗时、返工、费用和成功率。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
