# dsh-pr-description

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7608cb9](https://github.com/988hj7tczd-oss/dsh-pr-description/tree/7608cb9b7b61447a3aff14491537ba7ee8caad6b)

<!-- BEGIN META -->
[![npm 30d 368](https://img.shields.io/static/v1?label=npm+30d&message=368&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pr-description) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pr-description)
<!-- END META -->

> **实现功能**：读取分支差异生成 PR 标题和五段描述，可选确认、保存与调用 gh 创建 PR。

> **核心亮点**：将 Git 差异事实、有限符号与 breaking 规则、五段模板、可选确认和 gh 动作连接成 DSH 工具；减少统计排版，未实现模型理解业务动机。详见[Q02](#research-q02)。

> **风险与缺陷**：自动 base 可选错；正则符号与模板不知真实测试。输出经 Node fs 按用户路径直接写，未见本工具内 containment；confirm 只预览标题与路径，openPr 是实际远端创建。详见[Q03](#research-q03)。

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
  - [Q01 · 什么开发任务需要 PR 描述草稿，怎样才算合格？](#detail-section-11)
  - [Q02 · Git 事实如何变成文案，增量相对原有办法在哪里？](#detail-section-12)
  - [Q03 · 输出路径、确认和外部 PR 动作的边界是什么？](#detail-section-13)
  - [Q04 · 启动、持续使用和失败恢复需谁付出什么代价？](#detail-section-14)
  - [Q05 · 适合如何采用，怎样检验更可信的草稿设计？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有分支提交、需要快速整理可编辑 PR 草稿的开发者；合格结果须正确 base 和人工核事实。

替代是手动 Git diff 加团队 PR 模板或人工让模型解释差异；本工具选择确定性事实与模板，不等同代码评审。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 差异草稿 | 从已提交分支生成标题、五段与自审清单 | 必须核对 base；规则与正则不理解业务动机 |
| 写前确认 | 在落盘前让用户选择确认或取消 | 默认关闭，确认只显示标题和路径 |
| 本地保存 | 输出 Markdown 文件 | output 可指定，写入范围受运行环境约束 |
| 可选 PR 创建 | 调 gh pr create | 需 gh/认证/权限，不自动 push，失败保留草稿 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/subprocess、Node>=22.18 | 加载必需 | 工具与受控 Git 进程 | 工具不能运行 |
| Git 工作树、提交和正确 base | 每次生成必需 | 差异事实 | 无仓库/提交/base 时结构化失败 |
| userQuestions | confirm 才必需 | 写前询问 | 缺失时 ASK_USER_UNAVAILABLE |
| gh、认证和远端权限 | openPr 才必需 | 创建远端 PR | 不可用或失败时仅保留本地草稿 |
| 可写输出路径 | 写入必需 | 保存 Markdown | Node fs 写失败；具体范围由运行环境决定 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者确认仓库、目标 base 和输出目录 | HEAD 与目标分支可比较 |
| 生成 | 工具读取 Git 差异并渲染模板 | 检查统计、符号和 breaking，不当作语义审查 |
| 审阅 | 人工补动机、实际测试和风险 | confirm 默认关闭，标题/路径确认不够全文审查 |
| 落盘 | 工具写 PR_DESCRIPTION.md 或指定路径 | 保存失败应保留原草稿并修路径 |
| 创建 | 仅显式 openPr 后调用 gh | 核远端 URL；失败时仍有本地描述 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、Git 与可选 gh 资源；金额未知 | 明确 base、workdir、输出路径和认证 | 源码开发另需相邻 dsh-src；安装耗时未知 |
| 持续使用 | 本地 Git/模板计算，模型调用非本工具必需 | 复核动机、测试、breaking 和团队格式 | 人工改写分钟与错误率未知 |
| 失败恢复 | 重跑/远端创建失败可能占用资源；金额未知 | 校正 base、diff、写入路径或 gh 状态 | PR 评审返工与恢复工时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统计和格式 | Git 差异汇总、五段模板与自审清单 | 净节时和团队接受率 |
| 确认 | 取消可阻止本地写入 | 内容是否经充分审阅 |
| 创建 PR | openPr 可调用 gh | 远端权限、成功率和文案质量 |

固定源码只能证明路径存在，未执行目标工具或同条件 PR 评审。

> **思考**：自动 base 可选错；正则符号与模板不知真实测试。输出经 Node fs 按用户路径直接写，未见本工具内 containment；confirm 只预览标题与路径，openPr 是实际远端创建。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将 Git 差异事实、有限符号与 breaking 规则、五段模板、可选确认和 gh 动作连接成 DSH 工具；减少统计排版，未实现模型理解业务动机。详见[Q02](#research-q02)。

将 Git 差异事实、有限符号与 breaking 规则、五段模板、可选确认和 gh 动作连接成 DSH 工具；减少统计排版，未实现模型理解业务动机。详见[Q02](#research-q02)。

固定 argv 经 subprocess 执行、采集上限和 lossy 标识、纯解析层与可选确认使流程易审阅。Node fs 直接按 resolve(workdir,outputFile) 写入，和受控命令的权限边界不同；confirm 未展示全文，gh 失败只是保留草稿。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动 base 可选错；正则符号与模板不知真实测试。输出经 Node fs 按用户路径直接写，未见本工具内 containment；confirm 只预览标题与路径，openPr 是实际远端创建。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先显式给 base 和安全输出路径，生成本地草稿并核对动机、测试、breaking；只有明确要发 PR 时才启用 openPr。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持确定性草稿流程；文案语义和写入范围需人工/宿主核验；逐段证据绑定是未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/tools/pr-describe.ts、src/diff-analysis.ts、src/templates.ts、src/gh.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交 README、package、主流程、Git 解析、模板、gh 和测试意图；未运行目标工具或创建 PR。
- 下一步：进一步探讨在隔离仓库做错误 base、rename/二进制、大 diff、取消、越界路径和 gh 失败样本，盲审草稿事实与人工改写时间；不发真实 PR。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-pr-description](https://github.com/988hj7tczd-oss/dsh-pr-description)
- **版本号**：0.1.1（[固定提交 7608cb9](https://github.com/988hj7tczd-oss/dsh-pr-description/tree/7608cb9b7b61447a3aff14491537ba7ee8caad6b)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可让描述每段引用 diff 事实，无法由 diff 证明的动机与测试保留待填写，并用重命名、多语言和未跑测试样本比较错误与改写时间；未实现。详见[Q05](#research-q05)。

进一步探讨在隔离仓库做错误 base、rename/二进制、大 diff、取消、越界路径和 gh 失败样本，盲审草稿事实与人工改写时间；不发真实 PR。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 262 | — | — | 3250 |
| .mjs | source | 1 | 44 | 29 | 12 | — |
| .ts | source | 6 | 1325 | 1029 | 203 | — |
| .ts | test | 1 | 260 | 206 | 26 | — |
| .mjs | test | 1 | 468 | 387 | 36 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-pr-description/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-pr-description/issues?q=is%3Aissue+created%3A2026-09-22T05%3A15%3A24.057Z..2026-10-22T05%3A15%3A24.057Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-pr-description/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A15%3A24.057Z..2026-10-22T05%3A15%3A24.057Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断确定性 PR 草稿工具的工作增量、写入边界与采用价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么开发任务需要 PR 描述草稿，怎样才算合格？

**研究主题：**场景与需求

#### 完整回答

适合已提交分支改动、需要快速整理文件范围和可编辑 PR 草稿的开发者。合格交付是用正确 base 比较 HEAD，统计可追溯、五段文案不把猜测写成事实，作者补齐动机、测试结果和风险，然后人工决定是否提交 PR。工具的默认输出是本地 PR_DESCRIPTION.md；openPr 才会触发 gh 创建远端 PR，不能混作一个结果。替代流程是开发者手动查看 git diff、填写团队 PR 模板，或让模型总结 diff；本工具的确定性模板减少格式和统计劳动，但 README 明说当前未调用 LLM，也无法自行知道业务意图和已执行测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-28](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/README.md#L12-L28)

作者描述五段、可选确认与 gh，也明确无 LLM 语义填充。

<details>
<summary>查看原文（17行）</summary>

```text
DSH 原生工具：分析当前分支 diff，自动生成符合 **Conventional Commits** 的 PR 标题、动机/方案/影响/测试/风险五段描述与**自审清单**，输出 Markdown 到工作区并在会话内渲染；可选 `confirm` 交互确认与 `openPr` 直接调用 gh CLI 提 PR。

> 项目定位（2026-08 调研）：DSH 社区已有大量「代码评审」，但「PR 描述自动生成」无人做。本插件只借鉴上游 `anthropics/claude-plugins-official` 评审类插件的**工作流顺序**（范围 → diff → 聚焦），文案与实现全部自写，License 为 MIT。

## 功能

- `pr_describe` 工具，流程对齐评审工作流：
  1. **确定范围**：`git diff --name-status <base>...HEAD`；`base` 缺省自动探测（`origin/HEAD` → `origin/main` → `origin/master` → `main` → `master` → `develop` → `HEAD~1`），探测失败给出结构化错误提示显式指定；
  2. **统计与归类**：新增/修改/删除文件数、`+/-` 行数；按 `docs / test / chore / feat / fix / refactor` 确定性归类（规则见下）；
  3. **符号提取**：新增函数/类/导出（轻量正则，去重、上限 16）；
  4. **生成 PR 文本**：`feat(scope): 动词短句` 标题 + 动机/方案（引用文件与符号）/影响范围/测试建议/风险与开放问题五段 + 自审清单（4 项）；
  5. **confirm / openPr**：`confirm: true` 走 ask-user 交互确认，取消则不落盘；`openPr: true` 且 gh 可用时直接 `gh pr create --title --body-file`（不自动 push）。
- 结果写入 `PR_DESCRIPTION.md`（默认，可经 `output` / 配置 `outputFile` 修改）+ 会话内 Markdown 渲染。
- 解析失败（非 git 仓库 / 无提交 / 无差异 / base 不存在）返回带稳定 `code` 的结构化错误。
- BREAKING CHANGE 标注**当且仅当**检测到破坏性信号：`BREAKING CHANGE:` 注解、`package.json` 主版本提升、删除公开导出且同文件无同名新增。

> 说明：当前「动机/方案/影响/测试/风险」五段为**确定性模板拼装**（由 diff 统计、符号提取与破坏性信号直接填充文案），**未调用 LLM**；PROMPT §4.4 中「调用模型填充五段」尚未实现，如需语义润色请自行在生成后接入模型处理。
```

</details>

**依据 2 · 源码核查**：[src/tools/pr-describe.ts:129-165](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L129-L165)

单一工具的参数与默认输出。

<details>
<summary>查看原文（37行）</summary>

```text
export function createPrDescribeTool(ctx: Context, config: PrDescribeToolConfig) {
  return defineTool({
    name: 'pr_describe',
    description: '分析当前分支相对基线的 diff，生成符合 Conventional Commits 的 PR 标题、'
      + '动机/方案/影响/测试/风险五段描述与自审清单，写入 PR_DESCRIPTION.md（默认）并在会话中渲染；'
      + '可选交互确认（confirm）与直接调用 gh CLI 提 PR（openPr）。'
      + '若当前目录不是 git 仓库、没有提交或没有可对比的差异，会给出结构化错误并提示先 commit 或显式指定 base。',
    parameters: {
      workdir: {
        type: 'string',
        description: 'git 仓库目录；缺省使用插件配置的 workdir 或当前进程工作目录。',
      },
      base: {
        type: 'string',
        description: '对比基线（如 main / origin/main / HEAD~1）；缺省自动探测远端默认分支，探测失败时回退 HEAD~1。',
      },
      titleStyle: {
        type: 'string',
        enum: ['conventional', 'plain'],
        default: DEFAULTS.titleStyle,
        description: '标题风格：conventional 输出 `feat(scope): add xxx`，plain 省略类型前缀。',
      },
      confirm: {
        type: 'boolean',
        default: false,
        description: '生成前用 ask-user 交互确认；用户选择取消则不写入任何文件。',
      },
      openPr: {
        type: 'boolean',
        default: false,
        description: 'gh CLI 可用时直接执行 `gh pr create --title --body-file`；不可用则跳过并在结果中说明（不自动 push）。',
      },
      output: {
        type: 'string',
        default: 'PR_DESCRIPTION.md',
        description: '描述输出文件（相对 workdir）；默认 PR_DESCRIPTION.md。',
      },
```

</details>

**依据 3 · 源码核查**：[package.json:1-15](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/package.json#L1-L15)

包描述和导出入口。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-pr-description",
  "version": "0.1.1",
  "description": "DSH native tool: analyze the current branch diff, generate a Conventional Commits PR title, motivation/scheme/testing/risk description and a self-review checklist, write PR_DESCRIPTION.md, and optionally open the PR via the gh CLI.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./src/*": "./src/*",
    "./cordis.yml": "./cordis.yml",
    "./package.json": "./package.json"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Git 事实如何变成文案，增量相对原有办法在哪里？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

主流程先判断 Git 工作树和提交，显式 base 优先，其次配置值，再自动探测；然后读取分支差异，按文件状态和增删行统计，正则提取最多 16 个新增符号，规则分类变更与 breaking 信号，最后模板生成标题、动机/方案/影响/测试/风险和自审清单。Git 命令通过 ctx.subprocess 的 argv 数组运行，输出有大小上限，lossy 情况向上层传递。可归于插件的增量是把 Git 事实采集、轻量分类、模板、可选确认及 gh 动作接成 DSH 工具；Git、gh 和 Conventional Commits 不是本插件发明。相对手工复制统计可减少重复格式工作，但正则符号与关键词不能判断变更真实目的、接口兼容或测试通过，文本中有事实的部分需要逐项核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/pr-describe.ts:61-100](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L61-L100)

固定 argv runner 与有界输出、lossy 标记。

<details>
<summary>查看原文（40行）</summary>

```text
/** 用 ctx.subprocess 实现 GitRunner seam（collect 模式 + 固定 git 环境）。 */
function createSubprocessRunner(ctx: Context, defaultCwd: string): GitRunner {
  return {
    async runGit(argv, opts) {
      const cwd = opts?.cwd ?? defaultCwd
      const signal = opts?.signal
      const handle = ctx.subprocess.spawn({
        argv: [...argv],
        cwd,
        stdio: {
          stdin: 'ignore',
          stdout: { maxBytes: MAX_STDOUT, spill: { maxBytes: 32 * 1024 * 1024 } },
          stderr: { maxBytes: MAX_STDERR, spill: { maxBytes: 8 * 1024 * 1024 } },
        },
        graceMs: 5_000,
        ...(signal !== undefined ? { signal } : {}),
        env: { ...GIT_ENV },
      })
      let outcome
      try {
        outcome = await handle.done
      } catch (error: unknown) {
        return { code: -1, stdout: '', stderr: String(error) }
      }
      const stdoutRead = handle.collected.stdout?.readFrom(0) ?? { text: '', lossy: false, spillPath: undefined }
      const stderr = handle.collected.stderr?.readFrom(0).text ?? ''
      const base = {
        code: outcome.exitCode ?? (outcome.signal !== null && outcome.signal !== undefined ? -1 : -2),
        stdout: stdoutRead.text,
        stderr,
      }
      if (stdoutRead.lossy === true) {
        // C2/L1：超大输出（lossy）不再静默截断——把截断信息带给上层做 DIFF_TOO_LARGE 判定。
        return stdoutRead.spillPath !== undefined
          ? { ...base, truncated: true as const, spillPath: stdoutRead.spillPath }
          : { ...base, truncated: true as const }
      }
      return base
    },
  }
```

</details>

**依据 2 · 源码核查**：[src/tools/pr-describe.ts:221-268](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L221-L268)

base、diff 事实、分类和模板生成顺序。

<details>
<summary>查看原文（48行）</summary>

```text
      /* 阶段 1：范围 */
      throwIfAborted(signal)
      const repo = await isGitRepo(runner, workdir, signal)
      if (!repo) {
        throw new CommandError('NOT_A_GIT_REPO', `"${workdir}" 不是 git 工作树；请先在 git 仓库内运行，或通过 workdir 参数指定仓库目录`)
      }
      throwIfAborted(signal)
      const committed = await hasCommits(runner, workdir, signal)
      if (!committed) {
        throw new CommandError('EMPTY_REPO', '仓库还没有任何提交；请先 commit 一次，再生成 PR 描述')
      }
      throwIfAborted(signal)
      const baseExplicit = args.base !== undefined && args.base.length > 0 ? args.base : config.defaultBase
      const base = baseExplicit !== undefined && baseExplicit.length > 0 ? baseExplicit : await resolveBase(runner, workdir, signal)
      if (base === null) {
        throw new CommandError('BASE_DETECTION_FAILED', '无法自动探测默认分支（未找到 origin/HEAD、main/master/develop 与父提交）；请显式传入 base 参数')
      }

      /* 阶段 2-3：统计与符号 */
      throwIfAborted(signal)
      const facts = await loadDiffFacts(runner, workdir, base, signal)
      const sections = facts.sections
      const type = classifyChangeType(sections, facts.symbols)
      const scope = deriveScope(facts.records)
      const breaking = detectBreakingSignal(facts)

      /* 阶段 4：生成 PR 文本 */
      throwIfAborted(signal)
      const titleParts = deriveTitleParts({ type, scope, symbols: facts.symbols, sections })
      const title = renderTitle(titleParts, titleStyle)
      const markdown = renderMarkdown({
        title,
        branch: facts.branch,
        base: facts.base,
        outputFile,
        type,
        scope,
        filesAdded: facts.filesAdded,
        filesModified: facts.filesModified,
        filesDeleted: facts.filesDeleted,
        binaryFiles: facts.binaryFiles,
        linesAdded: facts.linesAdded,
        linesDeleted: facts.linesDeleted,
        symbols: facts.symbols,
        sections,
        records: facts.records,
        breaking,
      }, locale)
```

</details>

**依据 3 · 源码核查**：[src/diff-analysis.ts:242-280](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/diff-analysis.ts#L242-L280)

有限符号正则和 16 个上限。

<details>
<summary>查看原文（39行）</summary>

```text
/** 单行声明正则表：命中即视为新增符号。 */
const SYMBOL_PATTERNS: Array<{ kind: SymbolHit['kind']; regex: RegExp }> = [
  { kind: 'function', regex: /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/u },
  { kind: 'function', regex: /^(?:export\s+)?(?:async\s+)?function\s*\*([A-Za-z_$][\w$]*)/u },
  { kind: 'class', regex: /^(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/u },
  { kind: 'type', regex: /^(?:export\s+)?(?:interface|type)\s+([A-Za-z_$][\w$]*)/u },
  { kind: 'function', regex: /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\(|=>|function\b)/u },
  { kind: 'export', regex: /^export\s+default\s+(?:function|class|type|interface)\s+([A-Za-z_$][\w$]*)/u },
]

/** 命名导出花括号：`export { a, b as c }` → a、c。 */
const NAMED_EXPORT_PATTERN = /^export\s*\{([^}]+)\}/u
const NAMED_EXPORT_ITEM = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/u

/** 单次调用最多提取的符号数，避免超大 diff 拖垮输出。 */
export const MAX_SYMBOLS = 16

/**
 * 从各文件分区提取新增符号并去重。
 * @param sections - `git diff --unified=1` 解析出的分区。
 * @returns 按出现顺序去重后的符号（上限 MAX_SYMBOLS）。
 */
export function extractSymbols(sections: DiffSection[]): SymbolHit[] {
  const seen = new Set<string>()
  const hits: SymbolHit[] = []
  for (const section of sections) {
    for (const line of section.added) {
      for (const { kind, regex } of SYMBOL_PATTERNS) {
        const match = regex.exec(line)
        if (match === null || match[1] === undefined) continue
        const name = match[1]
        const key = `${kind}:${name}:${section.file}`
        if (seen.has(key)) continue
        seen.add(key)
        hits.push({ kind, name, file: section.file })
        if (hits.length >= MAX_SYMBOLS) return hits
        break
      }
    }
```

</details>

**依据 4 · 作者声明**：[README.md:18-28](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/README.md#L18-L28)

作者披露确定性规则与未实现模型填充。

<details>
<summary>查看原文（11行）</summary>

```text
- `pr_describe` 工具，流程对齐评审工作流：
  1. **确定范围**：`git diff --name-status <base>...HEAD`；`base` 缺省自动探测（`origin/HEAD` → `origin/main` → `origin/master` → `main` → `master` → `develop` → `HEAD~1`），探测失败给出结构化错误提示显式指定；
  2. **统计与归类**：新增/修改/删除文件数、`+/-` 行数；按 `docs / test / chore / feat / fix / refactor` 确定性归类（规则见下）；
  3. **符号提取**：新增函数/类/导出（轻量正则，去重、上限 16）；
  4. **生成 PR 文本**：`feat(scope): 动词短句` 标题 + 动机/方案（引用文件与符号）/影响范围/测试建议/风险与开放问题五段 + 自审清单（4 项）；
  5. **confirm / openPr**：`confirm: true` 走 ask-user 交互确认，取消则不落盘；`openPr: true` 且 gh 可用时直接 `gh pr create --title --body-file`（不自动 push）。
- 结果写入 `PR_DESCRIPTION.md`（默认，可经 `output` / 配置 `outputFile` 修改）+ 会话内 Markdown 渲染。
- 解析失败（非 git 仓库 / 无提交 / 无差异 / base 不存在）返回带稳定 `code` 的结构化错误。
- BREAKING CHANGE 标注**当且仅当**检测到破坏性信号：`BREAKING CHANGE:` 注解、`package.json` 主版本提升、删除公开导出且同文件无同名新增。

> 说明：当前「动机/方案/影响/测试/风险」五段为**确定性模板拼装**（由 diff 统计、符号提取与破坏性信号直接填充文案），**未调用 LLM**；PROMPT §4.4 中「调用模型填充五段」尚未实现，如需语义润色请自行在生成后接入模型处理。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输出路径、确认和外部 PR 动作的边界是什么？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

confirm 默认为 false；设为 true 时借 userQuestions 提问，取消在写入前返回。确认文本只展示标题和输出路径，不逐段展示五段正文；不能当成内容审阅。写入用 resolve(workdir,outputFile) 后直接 mkdir/writeFile，未见本工具内使用 ctx.fs containment 或对绝对/父级路径拒绝；因此可配置路径的写范围取决于调用者权限与运行环境，不能凭 package 的默认 writePaths 宣称只写工作区内 PR_DESCRIPTION.md。openPr 默认为 false；启用时检查 gh 是否存在，再执行 gh pr create，失败保留本地描述并返回跳过原因，不自动 push。固定 argv 和取消检查是值得复用的工程做法，但错误 base、rename 处理及启发式 breaking 仍可能产生有说服力而不准确的文案。本轮没有实际执行越界写、取消或远端创建，以上是源码边界分析。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/pr-describe.ts:151-165](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L151-L165)

确认与 openPr 默认均关闭，输出路径可输入。

<details>
<summary>查看原文（15行）</summary>

```text
      confirm: {
        type: 'boolean',
        default: false,
        description: '生成前用 ask-user 交互确认；用户选择取消则不写入任何文件。',
      },
      openPr: {
        type: 'boolean',
        default: false,
        description: 'gh CLI 可用时直接执行 `gh pr create --title --body-file`；不可用则跳过并在结果中说明（不自动 push）。',
      },
      output: {
        type: 'string',
        default: 'PR_DESCRIPTION.md',
        description: '描述输出文件（相对 workdir）；默认 PR_DESCRIPTION.md。',
      },
```

</details>

**依据 2 · 源码核查**：[src/tools/pr-describe.ts:270-333](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L270-L333)

取消、Node fs 写入、gh 可选执行与失败反馈。

<details>
<summary>查看原文（64行）</summary>

```text
      /* 阶段 5：confirm → 落盘 → openPr */
      let canceled = false
      if (args.confirm === true) {
        const userQuestions = ctx.get('userQuestions')
        if (userQuestions === undefined) {
          throw new CommandError('ASK_USER_UNAVAILABLE', '当前会话没有 userQuestions 服务，无法交互确认；请去掉 confirm 参数后重试')
        }
        const answer = await userQuestions.ask({
          questions: [{
            id: 'confirm-pr-describe',
            header: 'PR 描述预览',
            question: `确认生成 PR 描述并写入 ${outputFile} ？\n\n标题：${title}`,
            options: [
              { label: '确认生成', description: `将以下 PR 描述写入 ${outputFile}` },
              { label: '取消', description: '不写入任何文件' },
            ],
          }],
          ...(exec.agent !== undefined ? { agent: exec.agent } : {}),
          signal,
        })
        const selected = answer.answers[0]?.selected ?? []
        canceled = !selected.includes('确认生成')
      }
      if (canceled) {
        return {
          ok: false,
          canceled: true,
          title,
          type,
          scope: scope ?? '',
          breaking: breaking.breaking,
          breakingReasons: [...breaking.reasons],
          file: '',
          prCreated: false,
          summary: summaryOf(facts),
          markdown,
        }
      }

      throwIfAborted(signal)
      const absolutePath = resolve(workdir, outputFile)
      try {
        await mkdir(dirname(absolutePath), { recursive: true })
        await writeFile(absolutePath, markdown, 'utf8')
      } catch (error: unknown) {
        throw new CommandError('OUTPUT_WRITE_FAILED', `写入 ${absolutePath} 失败：${(error as Error).message}`)
      }

      let prCreated = false
      let prUrl: string | undefined
      let prSkippedReason: string | undefined
      if (args.openPr === true) {
        throwIfAborted(signal)
        const gh = await ghInstalled(runner, workdir, signal)
        if (!gh) {
          prSkippedReason = `未检测到 gh CLI（或不在 PATH），已跳过提 PR；描述已写入 ${outputFile}`
        } else {
          try {
            prUrl = await createPullRequest(runner, { cwd: workdir, title, bodyFile: absolutePath, signal })
            prCreated = true
          } catch (error: unknown) {
            prSkippedReason = `gh pr create 失败：${(error as Error).message}`
          }
        }
```

</details>

**依据 3 · 源码核查**：[src/gh.ts:12-42](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/gh.ts#L12-L42)

gh 探测和创建命令的实际参数。

<details>
<summary>查看原文（31行）</summary>

```text
/** `gh --version` 成功即认定 gh 可用（后续认证失败在 createPullRequest 时抛出）。 */
export async function ghInstalled(runner: GitRunner, cwd: string, signal?: AbortSignal): Promise<boolean> {
  const result = await runner.runGit(['gh', '--version'], { cwd, signal })
  return result.code === 0
}

export interface CreatePullRequestOptions {
  /** 当前工作目录（gh 从该目录推导 repo）。 */
  cwd: string
  title: string
  /** PR body 文件路径（推荐直接传 PR_DESCRIPTION.md）。 */
  bodyFile: string
  signal?: AbortSignal
}

/**
 * `gh pr create --title <title> --body-file <bodyFile>`，返回 PR URL。
 * 失败时抛出带 GH_PR_CREATE_FAILED 说明的 Error（含 stderr）。
 */
export async function createPullRequest(runner: GitRunner, options: CreatePullRequestOptions): Promise<string> {
  const result = await runner.runGit(
    ['gh', 'pr', 'create', '--title', options.title, '--body-file', options.bodyFile],
    { cwd: options.cwd, signal: options.signal },
  )
  if (result.code !== 0) {
    throw new Error(
      `GH_PR_CREATE_FAILED: gh pr create 失败（退出码 ${result.code}）\n${result.stderr.trim() || result.stdout.trim()}`,
    )
  }
  const firstLine = result.stdout.split('\n').map((line) => line.trim()).find((line) => line.length > 0)
  return firstLine ?? ''
```

</details>

**依据 4 · 源码核查**：[src/diff-analysis.ts:49-50](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/diff-analysis.ts#L49-L50)

文件状态解析采用 --no-renames 的三态。

```text
/** 简单文件名状态（--no-renames 下 git 只会给出 A/M/D）。 */
export type FileStatus = 'A' | 'M' | 'D'
```

#### 缺口

- 未在目标宿主复现绝对或父级 output 的有效写范围。
  **影响：**无法把源码推断写成已发生的越界事故。
  **进一步探讨：**在隔离目录用绝对路径和 ../ 输出试验并记录宿主权限限制。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续使用和失败恢复需谁付出什么代价？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

插件依赖 DSH tools/subprocess、Git 和可读取的已提交分支；开发源码形态还依赖相邻 dsh-src 检出，生产包能否直接加载须按实际包验证。confirm 需要 userQuestions 服务，openPr 另需 gh、认证及远端权限。首次使用要确认 base、workdir、输出路径和宿主权限；持续使用需人工核动机、测试事实、breaking 与团队模板；失败恢复要处理无仓库/无提交/无差异、过大 diff、错误 base、写入或 gh 失败。脚本自身未调用模型，不等于完整任务没有人工成本。现金与人工时间未知，没有同任务对照；创建 PR 涉及外部状态，不能拿本地草稿成功替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/README.md#L3-L9)

源码开发环境的相邻检出要求。

```text
> [!IMPORTANT]
> **依赖前置：相邻 `dsh-src` 检出（`link:` 依赖）**
> 本项目在开发形态下使用 `link:` 依赖指向相邻的 DeepSeek Harness 源码检出（`dsh-src`），
> 与当前仓库保持同一父目录布局（`<parent>/dsh-src`）。克隆本仓库后：
> 1. 先把官方 `deepseek-ai/deepseek-harness` 检出到与本仓库同级的 `dsh-src/` 目录，并执行其 `pnpm install && pnpm run build`；
> 2. 再按下方「安装」一节执行本仓库的 `pnpm install --offline && pnpm build` 与测试。
> 发布到 npm 的版本会尽量把 `link:` 依赖替换为 registry 真实版本；无法替换的内部包保持 `link:`，见各包 README 说明。
```

**依据 2 · 源码核查**：[package.json:25-80](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/package.json#L25-L80)

运行兼容、权限和依赖声明。

<details>
<summary>查看原文（56行）</summary>

```text
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.yml"
    },
    "compatibility": {
      "node": ">=22.18.0",
      "dsh": ">=0.1.0"
    },
    "permissions": {
      "summary": "分析当前分支 diff（git）→ 生成 Conventional Commits PR 标题/描述/自审清单，写 PR_DESCRIPTION.md；可选 gh 提 PR。命令固定 argv 非 shell。",
      "commands": [
        "git diff --name-status <base>...HEAD",
        "git diff --numstat <base>...HEAD",
        "git diff --unified=1 <base>...HEAD",
        "gh pr create (可选，用户确认)"
      ],
      "writePaths": [
        "<workspace>/PR_DESCRIPTION.md"
      ],
      "externalServices": [
        "（可选 gh 提 PR 时访问 github.com）"
      ],
      "failureBoundaries": [
        "DIFF_TOO_LARGE 截断抛错（含 spillPath）",
        "base 探测失败结构化错误",
        "分类启发式收敛"
      ],
      "lifecycleEvidence": [
        "offline 57 assertions",
        "入口 import OK"
      ]
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json && node scripts/fix-dts-imports.mjs",
    "test": "node tests/smoke.offline.mjs",
    "test:e2e": "vitest run tests/smoke.e2e.ts",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/dsh-subprocess": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "devDependencies": {
    "@types/node": "^26.0.0",
    "typescript": "^5.5.0",
    "vitest": "^4.1.0"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "0.1.1-rc.2",
    "@deepseek-ai/dsh-subprocess": "0.1.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.1"
```

</details>

**依据 3 · 源码核查**：[src/tools/pr-describe.ts:213-237](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L213-L237)

Git/base 前置检查。

<details>
<summary>查看原文（25行）</summary>

```text
    async execute(args, exec) {
      const signal = exec.signal
      const workdir = args.workdir !== undefined && args.workdir.length > 0 ? args.workdir : config.workdir ?? process.cwd()
      const runner = createSubprocessRunner(ctx, workdir)
      const locale: Locale = args.locale ?? config.locale
      const titleStyle: TitleStyle = args.titleStyle ?? config.defaultTitleStyle
      const outputFile = args.output !== undefined && args.output.length > 0 ? args.output : config.outputFile

      /* 阶段 1：范围 */
      throwIfAborted(signal)
      const repo = await isGitRepo(runner, workdir, signal)
      if (!repo) {
        throw new CommandError('NOT_A_GIT_REPO', `"${workdir}" 不是 git 工作树；请先在 git 仓库内运行，或通过 workdir 参数指定仓库目录`)
      }
      throwIfAborted(signal)
      const committed = await hasCommits(runner, workdir, signal)
      if (!committed) {
        throw new CommandError('EMPTY_REPO', '仓库还没有任何提交；请先 commit 一次，再生成 PR 描述')
      }
      throwIfAborted(signal)
      const baseExplicit = args.base !== undefined && args.base.length > 0 ? args.base : config.defaultBase
      const base = baseExplicit !== undefined && baseExplicit.length > 0 ? baseExplicit : await resolveBase(runner, workdir, signal)
      if (base === null) {
        throw new CommandError('BASE_DETECTION_FAILED', '无法自动探测默认分支（未找到 origin/HEAD、main/master/develop 与父提交）；请显式传入 base 参数')
      }
```

</details>

**依据 4 · 源码核查**：[src/tools/pr-describe.ts:270-333](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L270-L333)

可选 userQuestions 和 gh 依赖、失败分支。

<details>
<summary>查看原文（64行）</summary>

```text
      /* 阶段 5：confirm → 落盘 → openPr */
      let canceled = false
      if (args.confirm === true) {
        const userQuestions = ctx.get('userQuestions')
        if (userQuestions === undefined) {
          throw new CommandError('ASK_USER_UNAVAILABLE', '当前会话没有 userQuestions 服务，无法交互确认；请去掉 confirm 参数后重试')
        }
        const answer = await userQuestions.ask({
          questions: [{
            id: 'confirm-pr-describe',
            header: 'PR 描述预览',
            question: `确认生成 PR 描述并写入 ${outputFile} ？\n\n标题：${title}`,
            options: [
              { label: '确认生成', description: `将以下 PR 描述写入 ${outputFile}` },
              { label: '取消', description: '不写入任何文件' },
            ],
          }],
          ...(exec.agent !== undefined ? { agent: exec.agent } : {}),
          signal,
        })
        const selected = answer.answers[0]?.selected ?? []
        canceled = !selected.includes('确认生成')
      }
      if (canceled) {
        return {
          ok: false,
          canceled: true,
          title,
          type,
          scope: scope ?? '',
          breaking: breaking.breaking,
          breakingReasons: [...breaking.reasons],
          file: '',
          prCreated: false,
          summary: summaryOf(facts),
          markdown,
        }
      }

      throwIfAborted(signal)
      const absolutePath = resolve(workdir, outputFile)
      try {
        await mkdir(dirname(absolutePath), { recursive: true })
        await writeFile(absolutePath, markdown, 'utf8')
      } catch (error: unknown) {
        throw new CommandError('OUTPUT_WRITE_FAILED', `写入 ${absolutePath} 失败：${(error as Error).message}`)
      }

      let prCreated = false
      let prUrl: string | undefined
      let prSkippedReason: string | undefined
      if (args.openPr === true) {
        throwIfAborted(signal)
        const gh = await ghInstalled(runner, workdir, signal)
        if (!gh) {
          prSkippedReason = `未检测到 gh CLI（或不在 PATH），已跳过提 PR；描述已写入 ${outputFile}`
        } else {
          try {
            prUrl = await createPullRequest(runner, { cwd: workdir, title, bodyFile: absolutePath, signal })
            prCreated = true
          } catch (error: unknown) {
            prSkippedReason = `gh pr create 失败：${(error as Error).message}`
          }
        }
```

</details>

#### 缺口

- 没有同任务草稿编辑时间、事实错误率及评审结果对照。
  **影响：**无法估算净节时或审阅成本。
  **进一步探讨：**用固定分支样本由人工填写和工具草稿各做一次，盲审事实错误、修改分钟和遗漏测试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合如何采用，怎样检验更可信的草稿设计？

**研究主题：**新假设与验证、采用判断

#### 完整回答

建议先把工具当本地草稿生成器，显式提供 base，核对统计、文件、breaking、动机与实际跑过的测试，再由人编辑；只有确认远端创建意图时才启用 openPr。输出路径应限制在预期目录，团队可在外层施加权限边界。若分支以重命名、多语言声明或难从 diff 推断业务动机为主，模板的便利下降。未验证设计是假设每段陈述关联具体 diff 证据，并将不能从 Git 推出的动机与测试结果留为待填写项，不用完整语气填补未知。用仅重命名、跨语言、未跑测试及真实 bugfix 分支对照现有模板，比较事实错误率、人工改写分钟和审阅者误信率；如果只是增加链接却不降低错误，应否定。该设计未实现，不计现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/pr-describe.ts:239-268](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L239-L268)

模板输入以统计、符号与 breaking 信号为主。

<details>
<summary>查看原文（30行）</summary>

```text
      /* 阶段 2-3：统计与符号 */
      throwIfAborted(signal)
      const facts = await loadDiffFacts(runner, workdir, base, signal)
      const sections = facts.sections
      const type = classifyChangeType(sections, facts.symbols)
      const scope = deriveScope(facts.records)
      const breaking = detectBreakingSignal(facts)

      /* 阶段 4：生成 PR 文本 */
      throwIfAborted(signal)
      const titleParts = deriveTitleParts({ type, scope, symbols: facts.symbols, sections })
      const title = renderTitle(titleParts, titleStyle)
      const markdown = renderMarkdown({
        title,
        branch: facts.branch,
        base: facts.base,
        outputFile,
        type,
        scope,
        filesAdded: facts.filesAdded,
        filesModified: facts.filesModified,
        filesDeleted: facts.filesDeleted,
        binaryFiles: facts.binaryFiles,
        linesAdded: facts.linesAdded,
        linesDeleted: facts.linesDeleted,
        symbols: facts.symbols,
        sections,
        records: facts.records,
        breaking,
      }, locale)
```

</details>

**依据 2 · 源码核查**：[src/diff-analysis.ts:242-280](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/diff-analysis.ts#L242-L280)

符号正则范围有限。

<details>
<summary>查看原文（39行）</summary>

```text
/** 单行声明正则表：命中即视为新增符号。 */
const SYMBOL_PATTERNS: Array<{ kind: SymbolHit['kind']; regex: RegExp }> = [
  { kind: 'function', regex: /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/u },
  { kind: 'function', regex: /^(?:export\s+)?(?:async\s+)?function\s*\*([A-Za-z_$][\w$]*)/u },
  { kind: 'class', regex: /^(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)/u },
  { kind: 'type', regex: /^(?:export\s+)?(?:interface|type)\s+([A-Za-z_$][\w$]*)/u },
  { kind: 'function', regex: /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\(|=>|function\b)/u },
  { kind: 'export', regex: /^export\s+default\s+(?:function|class|type|interface)\s+([A-Za-z_$][\w$]*)/u },
]

/** 命名导出花括号：`export { a, b as c }` → a、c。 */
const NAMED_EXPORT_PATTERN = /^export\s*\{([^}]+)\}/u
const NAMED_EXPORT_ITEM = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/u

/** 单次调用最多提取的符号数，避免超大 diff 拖垮输出。 */
export const MAX_SYMBOLS = 16

/**
 * 从各文件分区提取新增符号并去重。
 * @param sections - `git diff --unified=1` 解析出的分区。
 * @returns 按出现顺序去重后的符号（上限 MAX_SYMBOLS）。
 */
export function extractSymbols(sections: DiffSection[]): SymbolHit[] {
  const seen = new Set<string>()
  const hits: SymbolHit[] = []
  for (const section of sections) {
    for (const line of section.added) {
      for (const { kind, regex } of SYMBOL_PATTERNS) {
        const match = regex.exec(line)
        if (match === null || match[1] === undefined) continue
        const name = match[1]
        const key = `${kind}:${name}:${section.file}`
        if (seen.has(key)) continue
        seen.add(key)
        hits.push({ kind, name, file: section.file })
        if (hits.length >= MAX_SYMBOLS) return hits
        break
      }
    }
```

</details>

**依据 3 · 作者声明**：[README.md:26-28](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/README.md#L26-L28)

作者承认五段为确定性拼装、无模型语义。

```text
- BREAKING CHANGE 标注**当且仅当**检测到破坏性信号：`BREAKING CHANGE:` 注解、`package.json` 主版本提升、删除公开导出且同文件无同名新增。

> 说明：当前「动机/方案/影响/测试/风险」五段为**确定性模板拼装**（由 diff 统计、符号提取与破坏性信号直接填充文案），**未调用 LLM**；PROMPT §4.4 中「调用模型填充五段」尚未实现，如需语义润色请自行在生成后接入模型处理。
```

**依据 4 · 源码核查**：[src/tools/pr-describe.ts:318-333](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts#L318-L333)

openPr 为单独可选外部动作。

<details>
<summary>查看原文（16行）</summary>

```text
      let prCreated = false
      let prUrl: string | undefined
      let prSkippedReason: string | undefined
      if (args.openPr === true) {
        throwIfAborted(signal)
        const gh = await ghInstalled(runner, workdir, signal)
        if (!gh) {
          prSkippedReason = `未检测到 gh CLI（或不在 PATH），已跳过提 PR；描述已写入 ${outputFile}`
        } else {
          try {
            prUrl = await createPullRequest(runner, { cwd: workdir, title, bodyFile: absolutePath, signal })
            prCreated = true
          } catch (error: unknown) {
            prSkippedReason = `gh pr create 失败：${(error as Error).message}`
          }
        }
```

</details>

#### 缺口

- 逐段证据绑定与未知项留空方案未实现或评测。
  **影响：**不能把它算作当前文案可靠性改进。
  **进一步探讨：**以固定分支和盲审者比较事实错误、修改时间与误信。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
