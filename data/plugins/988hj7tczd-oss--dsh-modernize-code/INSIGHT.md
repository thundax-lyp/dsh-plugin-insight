# dsh-modernize-code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4d11010](https://github.com/988hj7tczd-oss/dsh-modernize-code/tree/4d110103666fde9515b9a8077b7e0458d00023a8)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：通过 Skill 和两个 Python 工具辅助遗留代码预检与热点扫描；迁移方案与改码依赖模型/人工。

> **核心亮点**：把五问六检与热点线索纳入可重复入口，详见[Q01](#research-q01)。

> **风险与缺陷**：浅层检查的 READY 与固定权重热点不能当迁移安全结论；out 文件写入范围也须约束，详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 现代化工作流实际自动化到哪一步？](#detail-section-11)
  - [Q02 · 预检与热点结论可作为迁移决策依据吗？](#detail-section-12)
  - [Q03 · 使用权限和交付边界是否清晰？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：规划遗留代码迁移前，先收集环境缺口与静态热点，再制定分阶段路线图。

人工清点环境与 grep 式模式查找，手写迁移路线图。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 自动化 | 边界 |
| --- | --- | --- |
| preflight | 报告 5 问/6 检 | 不运行构建或测试 |
| assess | 模式候选排序 | 正则误报/漏报 |
| map/transform | Skill 指令 | 依赖模型/人工 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、subprocess、skills peer | 必需 | 挂 Skill、运行两个模型工具 | 缺失无法装配 |
| Python 3 | 工具运行必需 | 执行包内预检/扫描脚本 | 报告工具失败 |
| 可写项目/指定输出目录 | 生成报告必需 | 写 PREFLIGHT/热点 Markdown | 脚本写入失败 |
| 相邻 dsh-src link | 仅开发构建形态 | 满足本仓库开发引用 | 发布运行形态需另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 负责人限定项目/输出根、明确五问与六检 | 路径可写且授权清楚 |
| 加载 | 安装 Skill、确认 Python 与工具注册 | 只确认注册，不当成宿主成功证明 |
| 任务 | 跑 preflight/assess 并人工核候选热点 | 报告与实际构建/测试分开标识 |
| 验收/恢复 | 对照真实构建测试、修正误报并留回滚点 | 不把无 FAIL 当迁移安全 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH tools/subprocess/skills 与 Python 3；开发 link dsh-src 可能占磁盘，现金未知 | 确定项目范围、五问/六检输入与可写报告目录；耗时未知 | 报告不是构建/测试通过证明 |
| 持续使用 | 每次 Python 扫描及报告文件占 CPU/磁盘；实际量值未知 | 人工复核热点、跑真实构建/测试并维护阶段路线；工时未知 | 正则评分未校准业务风险 |
| 失败恢复 | 重跑扫描/回滚误导性路线可能增加算力与报告版本；金额未知 | 修正越界 out、重做人工标注/报告与迁移回滚；耗时未知 | 真实宿主权限及跨项目误报未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 预检报告 | Q01/Q02 证明浅层条件扫描与 Markdown 输出 | 真实构建/测试是否通过 |
| 热点候选 | Q02 证明正则/结构启发式与评分 | 缺陷准确率和业务重要性 |
| 路线图 | Skill 文本指导模型分阶段规划 | 真实迁移收益和回滚效果 |

> **思考**：浅层检查的 READY 与固定权重热点不能当迁移安全结论；out 文件写入范围也须约束，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把五问六检与热点线索纳入可重复入口，详见[Q01](#research-q01)。

把五问六检与热点线索纳入可重复入口，详见[Q01](#research-q01)。

固定 argv 非 shell 调脚本、超时中止；preflight 只探测，assess 用启发式规则。

<a id="detail-section-5"></a>

### 1.4 主要限制

浅层检查的 READY 与固定权重热点不能当迁移安全结论；out 文件写入范围也须约束，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用隔离副本运行两工具，限定 out，人工标注热点、运行真实构建/测试后再定路线图；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证明预检/扫描与文件写入；未见自动迁移引擎，实际宿主行为未测。

- 已检查：作者 README、包清单、源码路径 README.md、PERMISSIONS.md、src/skill-mount.ts、src/modernize-tools.ts、skills/dsh-modernize-code/SKILL.md、skills/dsh-modernize-code/scripts/preflight.py、skills/dsh-modernize-code/scripts/detect-patterns.py、docs/store-evidence.md、tests/smoke.e2e.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的源码、Skill、Python、文档；不运行目标脚本或宿主。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：隔离宿主测试安装/卸载、out 范围、报告覆盖；独立项目标注误报漏报与真实构建/测试。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-modernize-code](https://github.com/988hj7tczd-oss/dsh-modernize-code)
- **版本号**：0.1.2（[固定提交 4d11010](https://github.com/988hj7tczd-oss/dsh-modernize-code/tree/4d110103666fde9515b9a8077b7e0458d00023a8)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将实际构建/测试证据及人工热点标注接入报告、限制 out 到指定目录，可提升决策可靠性；待验证，详见[Q02](#research-q02)、[Q03](#research-q03)。

隔离宿主测试安装/卸载、out 范围、报告覆盖；独立项目标注误报漏报与真实构建/测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 593 | — | — | 7457 |
| .ts | source | 2 | 217 | 160 | 45 | — |
| .js | example | 4 | 248 | 207 | 21 | — |
| .ts | test | 1 | 274 | 230 | 30 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-modernize-code/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-modernize-code/issues?q=is%3Aissue+created%3A2026-09-22T07%3A18%3A43.803Z..2026-10-22T07%3A18%3A43.803Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-modernize-code/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A18%3A43.803Z..2026-10-22T07%3A18%3A43.803Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**区分 Skill 工作流、离线静态线索与宿主工具实际执行边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 现代化工作流实际自动化到哪一步？

**研究主题：**场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件挂载一个 Skill 和两个工具：preflight 以 Python 生成 5 问/6 检查的 PREFLIGHT.md，assess 以正则与简易结构启发式扫描生成热点；map 与 transform 是 Skill 对模型的工作流指令，没有自动迁移引擎。工具注册使用宿主 subprocess、固定非 shell argv 调脚本，报告默认写入被扫描项目。

#### 证据与依据

**依据 1 · 源码核查**：[src/skill-mount.ts:23-36](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/src/skill-mount.ts#L23-L36)

挂载 Skill provider。

<details>
<summary>查看原文（14行）</summary>

```text
export const name = 'modernize-skill-mount'

export const inject = ['skills']

export function apply(ctx: Context): void {
  const skillsRoot = fileURLToPath(new URL('../skills/', import.meta.url))

  mountFileSystemSkills(ctx, {
    providerName: 'dsh-modernize-code',
    includeDefaultRoots: false,
    customSkillDirs: [skillsRoot],
    watch: false,
  })
}
```

</details>

**依据 2 · 源码核查**：[src/modernize-tools.ts:97-180](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/src/modernize-tools.ts#L97-L180)

两个模型工具及写报告路径。

<details>
<summary>查看原文（84行）</summary>

```text
export function apply(ctx: Context): void {
  const dir = scriptsDir()

  ctx.tools.register(defineTool({
    name: 'modernize-preflight',
    description: 'Run the DSH modernize-code preflight: environment readiness check for a legacy project. ' +
      'Asks the 5 non-blocking human questions (business-criticality, build, deploy, team constraints, success metrics) ' +
      'and runs 6 automated checks (analyzer availability, build chain, source integrity, test capability, ' +
      'target-stack gaps, scope boundary), then writes PREFLIGHT.md with ready/not-ready conclusion and ' +
      'unanswered questions listed verbatim as open items. Never modifies the project.',
    parameters: {
      projectDir: {
        type: 'string',
        required: true,
        description: 'Absolute path of the legacy project directory to inspect.',
      },
      answersJson: {
        type: 'string',
        description: 'Optional path to a JSON answers file with keys ' +
          'business_critical/build_method/deploy_method/team_constraints/success_metrics; ' +
          'questions without an answer stay open items and never block the checks.',
      },
      targets: {
        type: 'array',
        description: 'Optional target-stack gap prescan flags, e.g. ["ts", "container"].',
      },
      out: {
        type: 'string',
        description: 'PREFLIGHT.md output path. Defaults to <projectDir>/PREFLIGHT.md.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      const argv = [args.projectDir]
      if (args.answersJson) argv.push('--answers', args.answersJson)
      if (args.targets) argv.push('--targets', args.targets.join(','))
      if (args.out) argv.push('--out', args.out)
      const stdout = await runScript(ctx, `${dir}preflight.py`, argv, args.projectDir)
      if (args.out === undefined) {
        // 默认输出写在项目目录；返回脚本本身打印的摘要 + 报告路径。
        return `${stdout}\n[report] ${args.projectDir}/PREFLIGHT.md`
      }
      return `${stdout}\n[report] ${args.out}`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'modernize-assess',
    description: 'Run the DSH modernize-code assessment: static legacy-pattern scan of a project ' +
      '(callback nesting, global state, magic numbers, giant functions, duplicate code, eval, ' +
      'string concatenation, ES5 var, deep nesting) and write a legacy-hotspots.md report ranked by ' +
      'impact/risk/migration-cost heuristics. Read-only; never modifies the project.',
    parameters: {
      projectDir: {
        type: 'string',
        required: true,
        description: 'Absolute path of the legacy project directory to scan.',
      },
      out: {
        type: 'string',
        description: 'legacy-hotspots.md output path. Defaults to <projectDir>/legacy-hotspots.md.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      // Always write the report file (documented default = projectDir/legacy-hotspots.md)
      // and keep stdout pure JSON for JSON.parse below.
      const out = args.out ?? join(args.projectDir, 'legacy-hotspots.md')
      const argv = ['--json', '--out', out]
      const stdout = await runScript(ctx, `${dir}detect-patterns.py`, argv, args.projectDir)
      const { hotspots } = JSON.parse(stdout) as {
        hotspots: Array<{ key: string; total: number; top: Array<string> }>
      }
      const lines = hotspots.map(h => `- ${h.key}: ${h.total} hits${h.top[0] ? ` (e.g. ${h.top[0]})` : ''}`)
      return `Scan complete. Ranked hotspots:\n${lines.join('\n')}\n[report] ${out}` +
        `\n[project] ${basename(args.projectDir)}`
    },
  }))
```

</details>

**依据 3 · 源码核查**：[skills/dsh-modernize-code/SKILL.md:29-40](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/SKILL.md#L29-L40)

四阶段分工。

<details>
<summary>查看原文（12行）</summary>

````text
## 工作流总览

```
preflight ──► assess ──► map ──► transform（逐块循环，每块验证后进入下一块）
    │             │        │            │
    │             │        │            └── 每块：方案+命令交用户确认 → 执行 → 验证 → 提交
    │             │        └── 路线图：阶段化，每阶段含「回滚点 + 验证命令」
    │             └── detect-patterns.py 扫描 + 模型生成热区清单（影响面/风险/成本排序）
    └── 5 个不阻塞问题 + 6 项自动检查 → PREFLIGHT.md（open items 不丢、不替答）
```

四个阶段可独立触发（用户只想要预检/只想要评估时不必走完全流程）。
````

</details>

**依据 4 · 作者声明**：[README.md:16-30](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/README.md#L16-L30)

作者描述完整工作流。

<details>
<summary>查看原文（15行）</summary>

````text
## 工作流

```
preflight ──► assess ──► map ──► transform（逐块循环）
```

| 阶段 | 做什么 | 产物 | 产出工具 |
| --- | --- | --- | --- |
| preflight | 5 个不阻塞问题 + 6 项自动检查 | `PREFLIGHT.md`（就绪/未就绪 + open items） | `scripts/preflight.py` / 工具 `modernize-preflight` |
| assess | 遗留模式静态扫描 + 模型热区清单 | `legacy-hotspots.md`（影响面×风险÷成本排序） | `scripts/detect-patterns.py` / 工具 `modernize-assess` |
| map | 阶段化迁移路线图 | `MIGRATION_ROADMAP.md` | `references/modernization-map.md` 模板 |
| transform | 逐块增量迁移（禁止大爆炸，改码交用户确认） | 每阶段的回滚点 + 验证记录 | SKILL.md 纪律 |

核心行为要求（与上游同款）：**问了不阻塞、报告不漏项**——Check 0 的 5 个问题
提出后立即继续跑 Check 1–6；未答问题原样列为 open items，绝不悄悄丢弃、绝不替答。
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预检与热点结论可作为迁移决策依据吗？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

preflight 只探测 PATH 中分析工具、构建文件存在、相对引用和测试文件/runner 存在，不执行构建、测试或分析工具；无 FAIL 即标记就绪，最多表示这些浅层前提通过，不代表迁移安全。detect-patterns 基于正则、花括号/缩进和重复行窗口，score 是固定 impact×risk÷cost，未理解语言语义或业务重要性；脚本明确要求模型补充判断。因此热点是候选线索，不是已验证缺陷或实际 ROI 排序。

#### 证据与依据

**依据 1 · 源码核查**：[skills/dsh-modernize-code/scripts/preflight.py:52-101](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/preflight.py#L52-L101)

分析工具/构建定义仅探测。

<details>
<summary>查看原文（50行）</summary>

```text
# 分析工具（静态扫描参数——只探测可用性，不执行任何工具）


def check_analyzer_available():
    """Check 1 — 分析工具可用性。"""
    tools = ["ruff", "pyflakes", "pylint", "mypy", "eslint", "tsc"]
    found = {t: shutil.which(t) for t in tools}
    found = {t: p for t, p in found.items() if p}
    if found:
        status = "PASS"
        detail = "、".join("`{}`".format(t) for t in sorted(found))
        evidence = "PATH 中找到分析工具：{}。".format(detail)
    else:
        status = "WARN"
        evidence = "PATH 中未找到 {}；可用 projects 下的 detect-patterns.py 做静态扫描兜底。".format(
            "/".join(tools)
        )
    return {"key": "analyzer", "status": status, "evidence": evidence, "items": []}


def check_build_chain(project: Path):
    """Check 2 — 构建链。"""
    builds = []
    pkg_json = project / "package.json"
    if pkg_json.exists():
        try:
            pkg = json.loads(pkg_json.read_text(encoding="utf-8"))
            scripts = pkg.get("scripts") or {}
            if isinstance(scripts, dict) and scripts:
                builds.append("package.json scripts: {}".format(
                    ", ".join("{}:{}".format(k, v) for k, v in list(scripts.items())[:5])
                ))
            else:
                builds.append("package.json（无 scripts）")
        except Exception:
            builds.append("package.json（解析失败）")
    for f in ["Makefile", "build.sh", "pyproject.toml", "setup.py", "setup.cfg",
              "Cargo.toml", "go.mod", "pom.xml", "build.gradle"]:
        if (project / f).exists():
            builds.append(f)
    if builds:
        return {"key": "build", "status": "PASS",
                "evidence": "命中构建定义：{}。".format("、".join(builds)), "items": builds}
    if (project / "package.json").exists():
        return {"key": "build", "status": "WARN",
                "evidence": "存在 package.json 但无 build/scripts 可复现构建，请补充构建命令。",
                "items": []}
    return {"key": "build", "status": "FAIL",
            "evidence": "未找到任何构建定义（package.json scripts / Makefile / pyproject.toml 等），构建不可复现。",
            "items": []}
```

</details>

**依据 2 · 源码核查**：[skills/dsh-modernize-code/scripts/preflight.py:201-229](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/preflight.py#L201-L229)

测试文件和 runner 存在即 PASS。

<details>
<summary>查看原文（29行）</summary>

```text
TEST_FILE_HINTS = ("test_", "_test.", ".test.", ".spec.", "__tests__")


def check_test_capability(project: Path, src_files):
    """Check 4 — 测试运行能力。"""
    test_files = [f for f in src_files
                  if any(h in f.name for h in TEST_FILE_HINTS)
                  or "__tests__" in f.parts]
    runner = shutil.which("pytest") or shutil.which("node")
    has_runner = runner is not None
    runner_name = os.path.basename(runner) if runner else "无"
    if test_files and has_runner:
        return {"key": "test", "status": "PASS",
                "evidence": "发现 {} 个测试文件，runner 可用（{}）。".format(
                    len(test_files), runner_name),
                "items": [str(f) for f in test_files[:10]]}
    if test_files and not has_runner:
        return {"key": "test", "status": "WARN",
                "evidence": "发现 {} 个测试文件但 runner（pytest/node）不可用，迁移验证缺执行环境。".format(
                    len(test_files)),
                "items": [str(f) for f in test_files[:10]]}
    if not test_files and has_runner:
        return {"key": "test", "status": "WARN",
                "evidence": "runner 可用（{}）但未发现测试文件，迁移阶段建议先补冒烟基线。".format(
                    runner_name),
                "items": []}
    return {"key": "test", "status": "WARN",
            "evidence": "未发现测试文件且 runner（pytest/node）不可用——迁移验证缺安全网。",
            "items": []}
```

</details>

**依据 3 · 源码核查**：[skills/dsh-modernize-code/scripts/preflight.py:337-365](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/preflight.py#L337-L365)

无 FAIL 判就绪。

<details>
<summary>查看原文（29行）</summary>

```text
    # ---- Check 1–6：全部执行完才出报告 ----
    src_files = walk_source_files(project)
    checks = [
        check_analyzer_available(),
        check_build_chain(project),
        check_source_integrity(project),
        check_test_capability(project, src_files),
        check_target_stack(project, src_files, args.targets.split(",")),
        check_scope_boundary(project, src_files),
    ]
    by_key = {c["key"]: c for c in checks}
    fails = [c for c in checks if c["status"] == "FAIL"]
    warns = [c for c in checks if c["status"] == "WARN"]
    ready = not fails

    # ---- 组装 PREFLIGHT.md ----
    lines = []
    lines.append("# Preflight — {}".format(name))
    lines.append("")
    lines.append("> 生成：DSH modernize-code preflight（离线）；上游行为对齐：5 问不阻塞、"
                 "6 项检查全部执行、open items 不丢不替答。")
    lines.append("")
    lines.append("## 结论")
    if ready:
        lines.append("- 状态：🟢 **就绪**——Check 1–6 无 FAIL，可以进入 assess。")
    else:
        lines.append("- 状态：🔴 **未就绪**——以下检查 FAIL，需先消除阻塞项：")
        for c in fails:
            lines.append("  - {}：{}".format(c["key"], c["evidence"]))
```

</details>

**依据 4 · 源码核查**：[skills/dsh-modernize-code/scripts/detect-patterns.py:34-65](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/detect-patterns.py#L34-L65)

模式和固定权重。

<details>
<summary>查看原文（32行）</summary>

```text
# 模式定义：key / 名称 / 正则线索 / 影响面 / 风险 / 迁移成本 / 说明
# score = impact * risk / cost（成本越低分越高）
PATTERNS = [
    dict(key="callback_nesting", name="回调嵌套", impact=5, risk=4, cost=2,
         regex=re.compile(r"\.then\s*\(|function\s*\([^)]*,\s*(?:err|callback|done)\b"),
         hint="发现 Promise 链/回调式控制流，评估 async/await 拍平"),
    dict(key="global_state", name="全局状态", impact=5, risk=5, cost=3,
         regex=re.compile(r"^global\.\w+\s*=|^window\.\w+\s*=|^var\s+\w+\s*=",
                          re.MULTILINE),
         hint="模块顶层/全局可变状态，注意隐性耦合与测试污染"),
    dict(key="magic_numbers", name="魔法数", impact=3, risk=2, cost=1,
         regex=re.compile(r"(?<![\w.])-?\d{2,}(?![\w.])"),
         hint="裸数字字面量，建议提取命名常量/配置"),
    dict(key="giant_function", name="巨型函数", impact=5, risk=3, cost=3,
         regex=None,  # 由函数体行数实现
         hint="函数体超长，拆分前先提取纯函数"),
    dict(key="duplicate_code", name="重复代码", impact=4, risk=4, cost=2,
         regex=None,  # 由行窗口实现
         hint="多处逐行相同代码块，合并前先比对行为"),
    dict(key="eval_usage", name="eval/动态执行", impact=2, risk=5, cost=3,
         regex=re.compile(r"\beval\s*\(|\bnew\s+Function\s*\(|\bexec\s*\(|compile\s*\(\s*['\"][^'\"]*['\"]\s*,\s*['\"]exec"),
         hint="动态执行有注入/调试/性能风险，改为白名单映射"),
    dict(key="string_concat", name="字符串拼接", impact=2, risk=2, cost=1,
         regex=re.compile(r"['\"][^'\"]*['\"]\s*\+|[\w\)\]]\s*\+\s*['\"]"),
         hint="字符串拼接路径/查询/HTML，改用模板字符串/参数化"),
    dict(key="var_es5", name="ES5 var", impact=2, risk=2, cost=1,
         regex=re.compile(r"\bvar\s+[A-Za-z_$]\w*"),
         hint="var 提升易致意外覆盖，改为 const/let"),
    dict(key="deep_nesting", name="深嵌套", impact=3, risk=3, cost=3,
         regex=None,  # 由缩进深度实现
         hint="缩进过深，早退/拆函数"),
]
```

</details>

**依据 5 · 源码核查**：[skills/dsh-modernize-code/scripts/detect-patterns.py:245-259](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/detect-patterns.py#L245-L259)

排序公式与输出。

<details>
<summary>查看原文（15行）</summary>

```text
def build_report(project: Path, results, scanned_count):
    patterns = []
    for pat in PATTERNS:
        entry = results.get(pat["key"], {"hits": []})
        hits = entry["hits"]
        score = round(pat["impact"] * pat["risk"] / pat["cost"], 1)
        patterns.append(dict(
            key=pat["key"], name=pat["name"],
            total=len(hits),
            files_hit=len({h.split(":")[0] for h in hits}),
            impact=pat["impact"], risk=pat["risk"], cost=pat["cost"],
            score=score, hint=pat["hint"],
            top=sorted(hits)[:8],
        ))
    patterns.sort(key=lambda p: (-p["score"], -p["total"]))
```

</details>

#### 缺口

- 未对独立遗留项目人工标注对照
  **影响：**误报/漏报及排序效果未知
  **进一步探讨：**抽样人工标注后计算 precision/recall 并验证迁移排序

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用权限和交付边界是否清晰？

**研究主题：**依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

运行依赖 DSH peer services 和本机 Python，开发形态还要求同级 dsh-src link 检出。工具未修改代码，但默认写两个报告，且 out 参数直接传给脚本，脚本对任意 out_path 的 parent mkdir 再 write_text；故 PERMISSIONS 的“仅两个固定报告文件”不覆盖用户可指定输出路径。宿主应约束可写位置并让用户审阅报告。README/STORE 文档只列离线证据和待补真实 Profile 证据，不能算已验证实际商店运行。

成本分期：首次使用涉及DSH tools/subprocess/skills 与 Python 3；开发 link dsh-src 可能占磁盘，现金未知，人工需确定项目范围、五问/六检输入与可写报告目录；耗时未知；持续使用涉及每次 Python 扫描及报告文件占 CPU/磁盘；实际量值未知，人工需人工复核热点、跑真实构建/测试并维护阶段路线；工时未知；失败恢复涉及重跑扫描/回滚误导性路线可能增加算力与报告版本；金额未知，人工需修正越界 out、重做人工标注/报告与迁移回滚；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 的 preflight 只核文件/命令存在，热点用正则与固定分数；Q03 的 out 可指向任意可写路径。相对当前预检和静态线索，若接入真实构建/测试证据、人工标注热点，并把 out 限在指定根下，可让报告更适合分阶段决策。条件是不同语言测试命令与团队标注可获得，代价为额外运行/审阅。最小证伪：在有假构建文件但构建失败、正则误报及越界 out 的隔离项目比较报告；若新报告仍标就绪/高优先或仍写出授权根，则假设失败。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/README.md#L3-L9)

相邻 dsh-src 开发依赖。

```text
> [!IMPORTANT]
> **依赖前置：相邻 `dsh-src` 检出（`link:` 依赖）**
> 本项目在开发形态下使用 `link:` 依赖指向相邻的 DeepSeek Harness 源码检出（`dsh-src`），
> 与当前仓库保持同一父目录布局（`<parent>/dsh-src`）。克隆本仓库后：
> 1. 先把官方 `deepseek-ai/deepseek-harness` 检出到与本仓库同级的 `dsh-src/` 目录，并执行其 `pnpm install && pnpm run build`；
> 2. 再按下方「安装」一节执行本仓库的 `pnpm install --offline && pnpm build` 与测试。
> 发布到 npm 的版本会尽量把 `link:` 依赖替换为 registry 真实版本；无法替换的内部包保持 `link:`，见各包 README 说明。
```

**依据 2 · 源码核查**：[src/modernize-tools.ts:108-142](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/src/modernize-tools.ts#L108-L142)

out 原样传给 preflight。

<details>
<summary>查看原文（35行）</summary>

```text
      projectDir: {
        type: 'string',
        required: true,
        description: 'Absolute path of the legacy project directory to inspect.',
      },
      answersJson: {
        type: 'string',
        description: 'Optional path to a JSON answers file with keys ' +
          'business_critical/build_method/deploy_method/team_constraints/success_metrics; ' +
          'questions without an answer stay open items and never block the checks.',
      },
      targets: {
        type: 'array',
        description: 'Optional target-stack gap prescan flags, e.g. ["ts", "container"].',
      },
      out: {
        type: 'string',
        description: 'PREFLIGHT.md output path. Defaults to <projectDir>/PREFLIGHT.md.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      const argv = [args.projectDir]
      if (args.answersJson) argv.push('--answers', args.answersJson)
      if (args.targets) argv.push('--targets', args.targets.join(','))
      if (args.out) argv.push('--out', args.out)
      const stdout = await runScript(ctx, `${dir}preflight.py`, argv, args.projectDir)
      if (args.out === undefined) {
        // 默认输出写在项目目录；返回脚本本身打印的摘要 + 报告路径。
        return `${stdout}\n[report] ${args.projectDir}/PREFLIGHT.md`
      }
      return `${stdout}\n[report] ${args.out}`
```

</details>

**依据 3 · 源码核查**：[skills/dsh-modernize-code/scripts/preflight.py:425-427](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/skills/dsh-modernize-code/scripts/preflight.py#L425-L427)

任意 out 路径创建并写入。

```text
    out_path = Path(args.out) if args.out else project / "PREFLIGHT.md"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")
```

**依据 4 · 作者声明**：[PERMISSIONS.md:6-20](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/PERMISSIONS.md#L6-L20)

权限声明。

<details>
<summary>查看原文（15行）</summary>

```text
## 运行时行为
- **目的**：对遗留项目做**只读评估**（preflight 环境检查 + detect-patterns 遗留模式扫描），
  生成 `PREFLIGHT.md` / `legacy-hotspots.md` 报告文件。
- **读取**：被扫描项目目录（`projectDir`）内的源码文件（前缀匹配，不做全树无差别读之外的动作）。
- **写入**：仅两个报告文件：
  - `<projectDir>/PREFLIGHT.md`
  - `<projectDir>/legacy-hotspots.md`
  写入经本插件自定义 `--out` 参数指定；不做任何其他文件写、不修改被测代码。
- **命令执行**：经宿主 `ctx.subprocess` 以**固定 argv（非 shell）**调用本机 `python3` 运行
  包内脚本 `skills/dsh-modernize-code/scripts/{preflight,detect-patterns}.py`。
  命令行任何位置都不拼接用户/模型输入（无 shell 解释，无注入面）。
- **网络**：无。脚本与工具源码均无 fetch/http/requests/urllib/socket 导入（冒烟测试逐文件扫描断言）。
- **凭据/密钥**：不读取、不写、不转发任何凭据。
- **外部服务**：无（不调用任何 SaaS / 远程 API / 云资源）。
- **全局资源**：不安装全局包、不修改 DSH 宿主配置之外的内容。
```

</details>

**依据 5 · 作者声明**：[README.md:108-115](https://github.com/988hj7tczd-oss/dsh-modernize-code/blob/4d110103666fde9515b9a8077b7e0458d00023a8/README.md#L108-L115)

真实 Profile 证据待补。

```text
## 权限、失败边界与 DSH STORE 状态

- **权限/失败边界**：见 [PERMISSIONS.md](./PERMISSIONS.md)——运行时仅读取被扫描项目
  目录、经宿主 `ctx.subprocess` 以非 shell 固定 argv 执行本地 `python3` 包内脚本、
  在项目目录写入 `PREFLIGHT.md` / `legacy-hotspots.md`；无网络、无凭据、无外部服务；
  超时/非零退出/JSON 解析失败均为结构化错误。
- **DSH STORE 一次性 Profile 证据**：见 [docs/store-evidence.md](./docs/store-evidence.md)
  （安装/启动/卸载步骤 + 已完成的离线证据；真实 Profile 运行记录在宿主上执行该文档补全）。
```

#### 缺口

- 未在宿主测沙箱路径权限
  **影响：**实际可写范围取决于宿主 subprocess 身份
  **进一步探讨：**隔离环境测 out 越界和报告覆盖并补真实 Profile 安装/卸载

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
