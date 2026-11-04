# SumSec-Skills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cbc1fa0](https://github.com/SummerSec/SumSec-Skills/tree/cbc1fa05add0dc20c1b298a6302b28476885fbbf)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SummerSec/SumSec-Skills)
<!-- END META -->

> **功能**：按插件整理中文写作、开发工具及其他 Agent Skill，并提供多宿主入口。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 组织多个来源和 DSH 目录，不将镜像能力算作本仓原创。

> **主要限制**：[Q02](#research-q02) 后层替换 provider 整体配置，其他自定义根能否保留取决于宿主合并。

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
  - [Q01 · 这个集合帮助谁，与单独安装 Skill 有何区别？](#detail-section-11)
  - [Q02 · DSH 怎样发现集合，配置合并有哪些边界？](#detail-section-12)
  - [Q03 · 使用与安装的依赖、副作用及退出条件是什么？](#detail-section-13)
  - [Q04 · 如何验证多 bundle 下的 Skill 根目录合并改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨多个 Agent 宿主复用写作与开发指引的用户。

逐项下载或配置宿主原生 Skill 也可使用；集合集中组织路径和分发入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多类 Skill | 集中提供任务指引 | 来源和权限按项核对 |
| DSH 发现 | 挂载九个根 | provider config 替换与宿主顺序待测 |
| 静态校验 | 检查目录和 patch 一致 | 不等于运行加载验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH filesystem provider | DSH 加载需要 | 发现九个根 | 行为依宿主和 patch 顺序 |
| 各 Skill 所需脚本及工具 | 相应 Skill 需要 | 执行具体任务 | 不可假定全部可用 |
| Python 和子模块 | 同步路径可能需要 | postinstall 同步 | 条件不满足时跳过 |
| 人工授权及审阅 | 写入或外部操作需要 | 控制副作用 | 指引不替代实际授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 审查目标 Skill 与 patch | 备份已有根配置 |
| 加载 | 在隔离 profile 应用配置 | 检查实际发现项 |
| 执行 | 按具体 Skill 核所需工具 | 写入须有授权 |
| 退出 | 停止加载并恢复配置 | 重新检查原根 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行及安装资源未知 | 审查上游和配置 | 宿主加载未测 |
| 持续 | 模型及外部工具费用未知 | 更新与逐项复核 | 各 Skill 差异大 |
| 恢复 | 资源成本未知 | 恢复 provider 配置 | 多 bundle 行为未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中发现 | 九个根配置与静态检查 | 宿主实际发现和其他根保留 |
| 代表任务指导 | 两份 Skill 文本 | 成果正确性及节时 |
| 多宿主组织 | 包与 README 声明 | 全部平台兼容 |

> **思考**：[Q02](#research-q02) 后层替换 provider 整体配置，其他自定义根能否保留取决于宿主合并。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 组织多个来源和 DSH 目录，不将镜像能力算作本仓原创。

[Q02](#research-q02) 共享根表和静态校验有助检测配置漂移，但不等同宿主合并验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 后层替换 provider 整体配置，其他自定义根能否保留取决于宿主合并。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离 profile 审查所需 Skill、安装副作用和原配置；发现冲突时停止加载并恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向检查 DSH patch、校验器和代表 Skill；未安装或运行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/cordis.patch.yml、scripts/plugin-skill-roots.mjs、scripts/validate-dsh.mjs、scripts/postinstall.mjs、dev-tools/skills/git-commit-pr/SKILL.md、writing-zh/skills/humanizer-zh/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根包、DSH patch、postinstall、校验器及两个代表 Skill；未审全部 Skill、外部服务或其他宿主加载。
- 下一步：固定 DSH 版本，以两个 bundle 比较实际发现项、配置顺序和恢复。

**分析版本**

- **仓库**：[SummerSec/SumSec-Skills](https://github.com/SummerSec/SumSec-Skills)
- **版本号**：1.0.49（[固定提交 cbc1fa0](https://github.com/SummerSec/SumSec-Skills/tree/cbc1fa05add0dc20c1b298a6302b28476885fbbf)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设可组合追加或预览根目录可减少配置误失，尚未验证。

固定 DSH 版本，以两个 bundle 比较实际发现项、配置顺序和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 165 | 39006 | — | — | 230175 |
| .md | example | 15 | 3539 | — | — | 11783 |
| .js | source | 21 | 2392 | 1723 | 361 | — |
| .mjs | source | 5 | 144 | 120 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/SummerSec/SumSec-Skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/SummerSec/SumSec-Skills/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SummerSec/SumSec-Skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查多宿主 Skill 集合、DSH 发现和安装边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个集合帮助谁，与单独安装 Skill 有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目将中文写作、开发工具和多个引用或封装的 Skill 按插件组织，面向希望在多种 Agent 宿主复用这些指引的用户。单独安装各个 Skill 也能完成类似任务；这里的增量是统一目录、版本和多宿主入口，不能把第三方镜像和上游能力都算成本仓原创。候选 Skill 数量不表示全都可被宿主加载或产生可靠效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/README.md#L1-L35)

作者说明分类及原创、镜像区分。

<details>
<summary>查看原文（35行）</summary>

````text
# SumSec-Skills

SummerSec 个人 **Agent Skills 集合**，按类别分插件管理。

![SumSec-Skills 项目说明](assets/sumsec-skills-illustrations/02-project-introduction.png)

## 仓库布局

```
SumSec-Skills/
├── writing-zh/              # 中文写作插件
│   └── skills/
│       ├── humanizer-zh/       去 AI 味润色
│       ├── eli5-zh/            按听众讲解
│       ├── ste-zh/             按 ASD-STE100 汇报
│       └── sumsec-illustrations/  SumSec 博客正文配图
├── dev-tools/               # 开发工具插件
│   └── skills/
│       ├── git-commit-pr/         Git 提交与 PR
│       ├── agent-chat-history/    对话历史检索
│       └── frontend-design/       前端界面实现
├── agents-dev/              # Agent 开发生态插件（聚合）
│   └── skills/
│       ├── skill-creator/         技能创建（claude-plugins-official）
│       ├── writing-rules/         Hook rules 生成（hookify）
│       ├── agent-sdk-dev/         Agent SDK 开发
│       ├── claude-agents-symlink/ CLAUDE.md 指向 AGENTS.md
│       ├── skill-optimizer/       Skill 审计优化
│       ├── multi-platform-plugin-guide/  多平台版本对齐
│       └── workflow-skill-creator/       流程编排 Skill 设计
├── skills/                  # 通用 skill 聚合入口（symlink 到各插件 skills）
├── plugin-dev/              # 镜像：插件开发七件套（agent/command/hook/skill/MCP/structure/settings）
├── claude-md-management/    # 镜像：CLAUDE.md 维护
├── hookify/                 # 原创：Hook 创建工具
├── cloudflare-email/        # Cloudflare 临时邮箱插件
````

</details>

**依据 2 · 源码核查**：[package.json:20-37](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/package.json#L20-L37)

Pi 根列表和 DSH patch 声明。

<details>
<summary>查看原文（18行）</summary>

```text
  "pi": {
    "skills": [
      "./writing-zh/skills",
      "./dev-tools/skills",
      "./agents-dev/skills",
      "./plugin-dev/skills",
      "./claude-md-management/skills",
      "./hookify/skills",
      "./cloudflare-email/skills",
      "./taste-skill/skills",
      "./semantic-linter/skills"
    ],
    "image": "https://raw.githubusercontent.com/SummerSec/SumSec-Skills/master/assets/sumsec-skills-illustrations/02-project-introduction.png"
  },
  "dsh": {
    "bundle": {
      "patch": "./dsh/cordis.patch.yml"
    }
```

</details>

#### 缺口

- 未逐个审计全部 Skill 或实测加载
  **影响**：不能证明集合完整性和任务效果
  **进一步探讨**：按宿主逐项列实际发现项并抽样执行隔离任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 怎样发现集合，配置合并有哪些边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

DSH bundle patch 指向官方 skill-filesystem provider，设置 includeDefaultRoots 为 true，并指定九个相对 patch 的 customSkillDirs。文件注释明确此后层替换该行完整 config，因此保留默认根不等于自动保留别的 bundle 为同一 provider 配置的自定义根；组合顺序及宿主版本须实测。仓库 validator 只检查声明、目录、每根至少一个一层 SKILL.md 和根列表一致，不能证明宿主运行发现或每个 Skill 的安全与可用。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cordis.patch.yml:1-19](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/dsh/cordis.patch.yml#L1-L19)

完整配置替换与九个根。

<details>
<summary>查看原文（19行）</summary>

```text
# SumSec-Skills bundle layer for DeepSeek Harness.
# The base bundle already inserts this row; this later layer replaces its
# complete config and points the official filesystem provider at each plugin's
# real skill root. baseUrl is the URL of this patch file in the installed bundle.
- id: skill-filesystem
  name: '@deepseek-ai/dsh-skill-filesystem'
  config:
    providerName: filesystem
    includeDefaultRoots: true
    customSkillDirs:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../writing-zh/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../dev-tools/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../agents-dev/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../plugin-dev/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../claude-md-management/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../hookify/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../cloudflare-email/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../taste-skill/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../semantic-linter/skills/', baseUrl))"
```

</details>

**依据 2 · 源码核查**：[scripts/plugin-skill-roots.mjs:1-14](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/scripts/plugin-skill-roots.mjs#L1-L14)

共享根清单。

<details>
<summary>查看原文（14行）</summary>

```text
/** Plugin Skill roots shared by DSH and Pi validators. Paths are relative to the repo root. */
export const PLUGIN_SKILL_ROOTS = [
  "writing-zh/skills",
  "dev-tools/skills",
  "agents-dev/skills",
  "plugin-dev/skills",
  "claude-md-management/skills",
  "hookify/skills",
  "cloudflare-email/skills",
  "taste-skill/skills",
  "semantic-linter/skills",
];

export const PI_SKILL_PATHS = PLUGIN_SKILL_ROOTS.map((root) => `./${root}`);
```

</details>

**依据 3 · 源码核查**：[scripts/validate-dsh.mjs:11-36](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/scripts/validate-dsh.mjs#L11-L36)

本仓检查的是路径和 patch 文本。

<details>
<summary>查看原文（26行）</summary>

```text
assert.equal(packageJson.dsh?.bundle?.patch, "./dsh/cordis.patch.yml");
assert.ok(packageJson.keywords?.includes("dsh"));
assert.ok(packageJson.keywords?.includes("deepseek-harness"));

const patchPath = path.join(root, packageJson.dsh.bundle.patch);
const patch = fs.readFileSync(patchPath, "utf8");
assert.match(patch, /^\s*#(?:.|\r?\n)*?\r?\n- id: skill-filesystem\r?\n/m);
assert.match(patch, /name: '@deepseek-ai\/dsh-skill-filesystem'/);
assert.match(patch, /providerName: filesystem/);
assert.match(patch, /includeDefaultRoots: true/);

for (const skillRoot of expectedRoots) {
  const absoluteRoot = path.join(root, skillRoot);
  assert.ok(fs.statSync(absoluteRoot).isDirectory(), `missing DSH skill root: ${skillRoot}`);
  const bundles = fs
    .readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(absoluteRoot, entry.name, "SKILL.md")));
  assert.ok(bundles.length > 0, `no one-level SKILL.md bundles in ${skillRoot}`);
  const expression = `new URL('../${skillRoot}/', baseUrl)`;
  assert.ok(patch.includes(expression), `DSH patch does not mount ${skillRoot}`);
}

const configuredRoots = [...patch.matchAll(/new URL\('\.\.\/([^']+\/skills)\/', baseUrl\)/g)].map(
  (match) => match[1],
);
assert.deepEqual(configuredRoots, expectedRoots);
```

</details>

#### 缺口

- 未运行宿主合并其他 bundle
  **影响**：不能确认其他自定义根实际受影响或完整发现
  **进一步探讨**：在固定 DSH 版本对照两 patch 顺序并检查发现结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用与安装的依赖、副作用及退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

DSH 入口依赖宿主 filesystem provider 和相对目录；仓库 postinstall 在检测到特定环境或未初始化子模块时跳过，否则调用 Python 同步脚本，这不是只读安装。不同子 Skill 可能运行本地工具或请求外部服务，权限、网络和数据边界应逐项审阅；本轮未执行安装或同步。先在隔离副本核 patch、已配置根及所需 Skill，再手动审阅输出；若发现配置冲突、不需要的自动脚本或权限不符，就停止加载并恢复原配置。模型费用、安装维护和复核时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:34-45](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/package.json#L34-L45)

DSH 与 postinstall 声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./dsh/cordis.patch.yml"
    }
  },
  "scripts": {
    "sync": "python .claude/skills/sync-skills/scripts/sync-skills.py",
    "sync:dry": "python .claude/skills/sync-skills/scripts/sync-skills.py --dry-run",
    "sync:clean": "python .claude/skills/sync-skills/scripts/sync-skills.py --clean",
    "validate:dsh": "node scripts/validate-dsh.mjs",
    "validate:pi": "node scripts/validate-pi.mjs",
    "postinstall": "node scripts/postinstall.mjs"
```

</details>

**依据 2 · 源码核查**：[scripts/postinstall.mjs:13-24](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/scripts/postinstall.mjs#L13-L24)

跳过条件和 Python 同步入口。

<details>
<summary>查看原文（12行）</summary>

```text
if (process.env.PI_CODING_AGENT === "true" || process.env.AI_AGENT === "pi") {
  skip("Pi package install");
}

const submoduleGit = path.join(root, "claude-plugins-official", ".git");
if (!fs.existsSync(submoduleGit)) {
  skip("submodules not initialized");
}

const script = path.join(root, ".claude", "skills", "sync-skills", "scripts", "sync-skills.py");
const result = spawnSync("python", [script], { cwd: root, stdio: "inherit" });
process.exit(result.status ?? 1);
```

</details>

**依据 3 · 源码核查**：[dev-tools/skills/git-commit-pr/SKILL.md:19-27](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/dev-tools/skills/git-commit-pr/SKILL.md#L19-L27)

代表 Skill 含明确外部写入边界。

```text
## 操作边界

- 只在用户明确要求“提交 / 推送 / 创建 PR/MR”时执行这些动作。
- 不要默认 `git add .`；先列出变更，再确认是“全部提交”还是“指定文件提交”。
- 不要提交疑似敏感文件，如 `.env`、密钥、凭证、tokens、私钥导出文件；若用户坚持，先明确提醒风险。
- 不要擅自改 `git config`。
- 不要默认使用 `--force` / `--force-with-lease` / `--amend` / `--no-verify`；只有用户明确同意后才能使用。
- 若当前在 `master` / `main` 且要新增本地提交，优先新建分支，不要直接在主干上开发式提交。
- 若工作区有与本次目标无关的脏改动，先让用户决定是只暂存相关文件，还是拆分处理。
```

**依据 4 · 源码核查**：[writing-zh/skills/humanizer-zh/SKILL.md:20-25](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/writing-zh/skills/humanizer-zh/SKILL.md#L20-L25)

代表 Skill 的本地 CLI 与人工核查。

```text
## 能力概览

1. **本地 CLI**（`scripts/`，[humanize-chinese](https://github.com/voidborne-d/humanize-chinese)，MIT）：检测、改写、对比、风格与学术降重。
2. **深度指南**：对话内精修或 CLI 后的语义润色。**默认 = 成稿清理（白名单）**：硬性边界 + 实证改写规则；识别时可对照 [pattern-catalog.md](references/pattern-catalog.md)，但未命中白名单的文字必须原样保留。

**路径选择：** 需要分数、批量、`--seed` 复现 → 用 CLI（脚本可能比白名单更激进，定稿前通读）。只能对话改写 → 深度指南。用户明确要求「注入个性 / 鲜活改写」时，才可参考 pattern-catalog「个性与灵魂」，且仍须信息守恒。CLI 完成后可再跑 `detect_cn.py -s` 复核。深度指南默认含「反 AI 审查」多步交付（见「处理流程」）。
```

#### 缺口

- 未运行安装或审计所有同步脚本与网络路径
  **影响**：不能确认对环境的完整副作用
  **进一步探讨**：隔离副本检查安装计划及每项指引的实际工具调用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证多 bundle 下的 Skill 根目录合并改进？

**研究主题**：新假设与验证

#### 完整回答

假设让各包以可组合方式向宿主追加自身根，或者在安装预览中显式显示替换前后所有根，可减少覆盖其他配置的风险；这不是当前 patch 已证明支持的行为。固定两个带不同 customSkillDirs 的 bundle，比较当前顺序与追加/预览方案的发现项、误失项、冲突提示和维护成本；若宿主本来已合并、误失不减少或复杂度过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cordis.patch.yml:1-19](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/dsh/cordis.patch.yml#L1-L19)

替换 config 和当前根设置。

<details>
<summary>查看原文（19行）</summary>

```text
# SumSec-Skills bundle layer for DeepSeek Harness.
# The base bundle already inserts this row; this later layer replaces its
# complete config and points the official filesystem provider at each plugin's
# real skill root. baseUrl is the URL of this patch file in the installed bundle.
- id: skill-filesystem
  name: '@deepseek-ai/dsh-skill-filesystem'
  config:
    providerName: filesystem
    includeDefaultRoots: true
    customSkillDirs:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../writing-zh/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../dev-tools/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../agents-dev/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../plugin-dev/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../claude-md-management/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../hookify/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../cloudflare-email/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../taste-skill/skills/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../semantic-linter/skills/', baseUrl))"
```

</details>

**依据 2 · 源码核查**：[scripts/validate-dsh.mjs:22-36](https://github.com/SummerSec/SumSec-Skills/blob/cbc1fa05add0dc20c1b298a6302b28476885fbbf/scripts/validate-dsh.mjs#L22-L36)

单集合静态路径检查。

<details>
<summary>查看原文（15行）</summary>

```text
for (const skillRoot of expectedRoots) {
  const absoluteRoot = path.join(root, skillRoot);
  assert.ok(fs.statSync(absoluteRoot).isDirectory(), `missing DSH skill root: ${skillRoot}`);
  const bundles = fs
    .readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(absoluteRoot, entry.name, "SKILL.md")));
  assert.ok(bundles.length > 0, `no one-level SKILL.md bundles in ${skillRoot}`);
  const expression = `new URL('../${skillRoot}/', baseUrl)`;
  assert.ok(patch.includes(expression), `DSH patch does not mount ${skillRoot}`);
}

const configuredRoots = [...patch.matchAll(/new URL\('\.\.\/([^']+\/skills)\/', baseUrl\)/g)].map(
  (match) => match[1],
);
assert.deepEqual(configuredRoots, expectedRoots);
```

</details>

#### 缺口

- 宿主是否有可组合根接口及多 bundle 行为未知
  **影响**：不能断言方案可行或当前已发生覆盖
  **进一步探讨**：固定宿主与两个 bundle 在隔离 profile 验证。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
