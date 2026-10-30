# Perfect Web Clone

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c846c37](https://github.com/ericshang98/Perfect-Web-Clone/tree/c846c37937a70497d37d082c26c85aa1289a9fa5)

<!-- BEGIN META -->
[![GitHub ★ 276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=276&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ericshang98/Perfect-Web-Clone)
<!-- END META -->

> **功能**：以Skill驱动宿主编码Agent，配套网页采集、分区和量化工具；root提供DSH shim，但分进程CLI活动工作区与综合门控是采用前必须核实的断点。

> **亮点**：分区证据/采集完整性、量化工具和残差交接组合；真实工具caller/callee已核，完整能力/活动步骤见[Q01](#research-q01)，度量边界见[Q02](#research-q02)。

> **主要限制**：CLI/DSH逐次进程无法继承内存sandbox；分区平均ok允许未评分或单项红，不能当完整交付，见[Q02](#research-q02)。

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
  - [Q01 · 真实入口、复刻活动链及相对直接提示的贡献是什么？](#detail-section-11)
  - [Q02 · 采集/门控真实做什么，CLI连续执行为何不能按账本直接认定？](#detail-section-12)
  - [Q03 · 依赖、资源、写入及退出成本如何影响首次采用？](#detail-section-13)
  - [Q04 · 值得形成什么方向，如何超越既有门控且证明有用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：前端从受控网页复刻React并查看分区残差；需求强度未验证，见[Q01](#research-q01)。

通用编码Agent+浏览器截图/编辑器、手工分区复刻；同源同预算下另与修复生命周期后的现有Skill对照，不把底座模型或Playwright归新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| perfect-web-clone Skill | 指导全页实现、行为/视觉修复、残差交接 | skills服务存在才自动注册；宿主遵守指令，非硬验收器 |
| pwc_extract | 捕获URL为source_id与源证据 | 独立Python/Chromium；失败完整性停止；动态全覆盖未证 |
| pwc_plan | 从source_id产生确定性分区计划 | 需已有完整源；不自动写组件 |
| pwc_assemble | 拼共享React/Vite文件 | 组件由宿主写；独立CLI活动对象不能据账本恢复 |
| pwc_build | 调Python活动sandbox构建 | 分进程找不到活动对象的断点见Q02；先修/核，不许成品已成功 |
| pwc_fingerprints | 扫描指定目录的源框架指纹正则 | 零命中不证明原创/行为或安全 |
| pwc_weight | 计压缩代码与资产体积 | 默认代码120KB，未设资产预算则资产不限制 |
| pwc_score | 比较ref/cand图像，可选分区bounds | 分区平均ok不等全部单项/行为合格，缺bounds另报 |

**流程与依赖**

Python/Chromium与npm shim分开、宿主模型/Node/磁盘网络均需；完整表及不满足处理见[Q03](#research-q03)。

Skill负责Agent连续阶段，Python量化不负责模型决策；完整步骤表见[Q01](#research-q01)，CLI构建/恢复断点见[Q02](#research-q02)。

**效果与成本**

首次须固定两套包并先修状态/隔离端口；持续模型迭代、失败作品保全和退出核进程都有成本，现金与工时未知分列于[Q03](#research-q03)。

源码支持采集失败可见、分区指标和资源报告，不支持已完成可用克隆或节时结论；实际效果表见[Q02](#research-q02)。

> **思考**：CLI/DSH逐次进程无法继承内存sandbox；分区平均ok允许未评分或单项红，不能当完整交付，见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：分区证据/采集完整性、量化工具和残差交接组合；真实工具caller/callee已核，完整能力/活动步骤见[Q01](#research-q01)，度量边界见[Q02](#research-q02)。

保留采集完整性和单项残差；CLI registry、aggregate ok与端口所有权分层检查，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

CLI/DSH逐次进程无法继承内存sandbox；分区平均ok允许未评分或单项红，不能当完整交付，见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。修跨进程对象并隔离默认端口/重置，再在可丢弃环境和受控页面试一条全链；不把top-level ok当用户接受，见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源闭合DSH工具→CLI→采集/组装/构建/指标callee；未运行/部署/验证发布物或复刻成品。静态发现跨CLI活动对象断点，当前观察而非直接生产采用。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、core/boxlite/__init__.py、core/boxlite/sandbox_manager.py、core/extractor/service.py、core/extractor/storage.py、core/gates/fidelity.py、core/gates/fingerprint.py、core/gates/weight.py、mcp_server/tools/build_deploy.py、mcp_server/tools/extraction.py、package.json、plugin/index.js、pwc/cli.py、pyproject.toml、skill/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工程统计仅覆盖INVENTORY所列JS/JSX/Markdown文件，未计核心Python；不等根全部代码，不补造Python数量或据行数推复杂度。completed与四材料摘要/SOURCE固定身份一致；无正式identity旧研究。读取root包/Skill与真实插件/CLI、采集失败、公开BoxLite factory/内存registry/build、图像/指纹/资源门和初始化/端口/退出。未执行目标、装包、模型/浏览器调用，未全审所有IR/recognizers/deploy/任意路径输入或外站。
- 下一步：先用分开的CLI进程确认同一source作品保留/可构建，再核缺bounds/红section/旧截图不误ready；受控页面对照人工/模型总投入与真实功能，见[Q04](#research-q04)。

**分析版本**

- **仓库**：[ericshang98/Perfect-Web-Clone](https://github.com/ericshang98/Perfect-Web-Clone)
- **版本号**：3.0.0（[固定提交 c846c37](https://github.com/ericshang98/Perfect-Web-Clone/tree/c846c37937a70497d37d082c26c85aa1289a9fa5)）
- **版本日期**：2026-08-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修生命周期/门结果语义，再验证固定产物与必需状态的交付核验接口；相对已有Skill增量、对照/指标/停止条件见[Q04](#research-q04)。

先用分开的CLI进程确认同一source作品保留/可构建，再核缺bounds/红section/旧截图不误ready；受控页面对照人工/模型总投入与真实功能，见[Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

本表仅覆盖所列 JS/JSX/Markdown，未计核心 Python；不代表根全部代码，不补造语言数量。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 172 | 157 | 3 | — |
| .md | source | 5 | 564 | — | — | 3100 |
| .jsx | source | 2 | 41 | 16 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/ericshang98/Perfect-Web-Clone/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/ericshang98/Perfect-Web-Clone/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ericshang98/Perfect-Web-Clone/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定源码上判定真实复刻链、可交付边界和可验证生产方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实入口、复刻活动链及相对直接提示的贡献是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向前端复刻人员，把给URL的模糊需求拆成捕获、分区、Agent写React、组装、构建、测量、修复和用户复核。场景明确，需求强度与相对通用编码Agent的收益未验证。作者把Skill称为产品；本次root同时有真实dsh.bundle patch、package.main=plugin/index.js，故物理归plugin，内含Skill/七个模型工具，另需独立Python CLI；不是根对象已自带独立模型循环。package与pyproject均声明3.0.0，代码旧注释v4不是另一个已核发行版本。

Host载patch后apply注册extract/plan/assemble/build/fingerprints/weight/score；存在skills服务才注册Skill原文，不存在不会由此自动获得工作流。工具用spawn参数数组启动PATH中的pwc并读取JSON，找不到CLI/非零退出明确失败。Python入口main接cmd_extract→真实抽取，cmd_plan→持久源计划，cmd_assemble→assemble_project，cmd_build→build_project，score→图像门。没有核Host的全部调度/确认行为，也未把目录名mcp_server当已交付可启动MCP服务。Skill要求当前宿主Agent持续写代码、按失败修复、不隐式部署、用户最终验收；这些是指令契约，工具本身未替宿主执行决策。

独立操作的用途与条件见主能力清单，以下保留完整活动步骤。

| 步骤 | 执行者与动作 | 判据/失败 |
|---|---|---|
| 捕获 | Python/Playwright取URL、原始与规范化材料 | 完整性红则停止，不凭猜测生成 |
| 计划/实现 | Python出分区，宿主Agent写各组件 | 不能只首屏或静态替代控件 |
| 组装/构建 | CLI组共享文件、尝试npm构建 | 本版本分进程活动对象断点，先核Q02 |
| 衡量/修复 | 图像与静态门输出，Agent择最早红门修复 | 逐项结果/行为另核，不能平均遮红 |
| 交接 | Agent报预览、证据和残差 | ready_for_user_review不等用户接受 |

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-34](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/package.json#L1-L34)

真实包/3.0.0/main/分发范围与bundle声明。

<details>
<summary>查看原文（34行）</summary>

```text
{
  "name": "perfect-web-clone",
  "version": "3.0.0",
  "description": "Pixel-perfect clones of any webpage. Paste a URL, get a measured Vite + React replica.",
  "keywords": [
    "pixel-perfect",
    "web-clone",
    "playwright",
    "dsh-plugin"
  ],
  "license": "MIT",
  "type": "module",
  "main": "plugin/index.js",
  "files": [
    "plugin",
    "cordis.patch.yml",
    "skill",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-tools": "*"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ericshang98/Perfect-Web-Clone.git"
  }
}
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:1-37](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/pyproject.toml#L1-L37)

Python版本、依赖与pwc入口。

<details>
<summary>查看原文（37行）</summary>

```text
[project]
name = "perfect-web-clone"
version = "3.0.0"
description = "Pixel-perfect clones of any webpage. Paste a URL, get a measured Vite + React replica."
readme = "README.md"
requires-python = ">=3.10"
license = { text = "MIT" }
authors = [{ name = "Perfect Web Clone" }]
keywords = ["web-clone", "pixel-perfect", "playwright"]
dependencies = [
    "pydantic>=2.5.0",
    "playwright>=1.44.0",
    "beautifulsoup4>=4.12.0",
    "httpx>=0.27.0",
    "pillow>=10.3.0",
    "lxml>=5.2.0",
    "scikit-image>=0.22.0",
    "numpy>=1.26.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "ruff>=0.4.0",
]

[project.scripts]
pwc = "pwc.cli:main"

[project.urls]
Homepage = "https://github.com/ericshang98/Perfect-Web-Clone"
Skill = "https://github.com/ericshang98/perfect-web-clone-skill"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/cordis.patch.yml#L1-L4)

实际Host加载映射。

```text
# Install: dsh plugin --profile web add github:ericshang98/Perfect-Web-Clone
- insert:
    - id: perfect-web-clone
      name: 'perfect-web-clone'
```

**依据 4 · 源码核查**：[plugin/index.js:14-44](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/plugin/index.js#L14-L44)

每次spawn独立pwc，PATH/退出失败。

<details>
<summary>查看原文（31行）</summary>

```text
function runPwc(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('pwc', args, {
      cwd: REPO_DIR,
      env: process.env,
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', (err) => {
      if (err && err.code === 'ENOENT') {
        reject(new Error(
          'pwc CLI not found on PATH. Install the Python package: pip install "git+https://github.com/ericshang98/Perfect-Web-Clone.git" && playwright install chromium',
        ))
        return
      }
      reject(err)
    })
    child.on('close', (code) => {
      const text = (stdout || stderr || '').trim()
      if (code !== 0) {
        reject(new Error(text || `pwc ${args.join(' ')} exited ${code}`))
        return
      }
      resolve(text)
    })
```

</details>

**依据 5 · 源码核查**：[plugin/index.js:58-89](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/plugin/index.js#L58-L89)

extract/plan/assemble真实注册到CLI。

<details>
<summary>查看原文（32行）</summary>

```text
    name: 'pwc_extract',
    description: 'Capture a live URL into immutable source evidence. Returns source_id plus capture summary. Never calls an LLM.',
    parameters: {
      url: { type: 'string', required: true, description: 'https URL to clone' },
    },
    async execute(args) {
      return parseJson(await runPwc(['extract', args.url]))
    },
  }))

  ctx.tools.register(defineTool({
    name: 'pwc_plan',
    description: 'Deterministic section plan for a captured source_id.',
    parameters: {
      source_id: { type: 'string', required: true, description: 'id returned by pwc_extract' },
    },
    async execute(args) {
      return parseJson(await runPwc(['plan', args.source_id]))
    },
  }))

  ctx.tools.register(defineTool({
    name: 'pwc_assemble',
    description: 'Write the Vite + React shell for a source_id. Does not invent section components.',
    parameters: {
      source_id: { type: 'string', required: true, description: 'id returned by pwc_extract' },
    },
    async execute(args) {
      return parseJson(await runPwc(['assemble', args.source_id]))
    },
  }))

```

</details>

**依据 6 · 源码核查**：[plugin/index.js:137-147](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/plugin/index.js#L137-L147)

只有skills服务存在才挂Skill。

<details>
<summary>查看原文（11行）</summary>

```text
  const skills = ctx.get('skills')
  if (skills) {
    skills.register({
      name: 'perfect-web-clone',
      description: 'Clone a live webpage into a measured Vite+React project. Use when the user pastes a URL to clone, copy, reproduce, replicate, or 复刻 a site.',
      content: readFileSync(SKILL_FILE, 'utf8'),
      source: 'runtime',
      provider: 'perfect-web-clone',
    })
  }
}
```

</details>

**依据 7 · 源码核查**：[pwc/cli.py:32-83](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/pwc/cli.py#L32-L83)

实际CLI调用者和工具callee。

<details>
<summary>查看原文（52行）</summary>

```text

def cmd_extract(args: argparse.Namespace) -> int:
    result = extract_page(args.url)
    return _exit_from(result)


def cmd_plan(args: argparse.Namespace) -> int:
    result = get_section_plan(args.source_id)
    return _exit_from(result)


def cmd_section(args: argparse.Namespace) -> int:
    result = get_section_data(args.source_id, args.name)
    return _exit_from(result)


def cmd_assemble(args: argparse.Namespace) -> int:
    from mcp_server.tools.build_deploy import assemble_project

    result = asyncio.run(assemble_project(args.source_id))
    return _exit_from(result)


def cmd_build(_args: argparse.Namespace) -> int:
    from mcp_server.tools.build_deploy import build_project

    result = asyncio.run(build_project())
    return _exit_from(result)


def cmd_fingerprints(args: argparse.Namespace) -> int:
    return _exit_from(scan_tree(args.dirpath))


def cmd_weight(args: argparse.Namespace) -> int:
    return _exit_from(measure_dist(args.dirpath, budget_kb=args.budget_kb))


def cmd_score(args: argparse.Namespace) -> int:
    if args.sections:
        with open(args.sections, encoding="utf-8") as fh:
            sections = json.load(fh)
        if isinstance(sections, dict) and "sections" in sections:
            sections = sections["sections"]
        payload = fidelity.score_by_section(
            args.ref,
            args.cand,
            sections,
            ref_page_height=args.ref_height,
            cand_page_height=args.cand_height,
        )
        return _exit_from(payload)
```

</details>

**依据 8 · 源码核查**：[skill/SKILL.md:17-60](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/skill/SKILL.md#L17-L60)

当前Agent执行、部署边界、行为/门/用户验收契约。

<details>
<summary>查看原文（44行）</summary>

```text
Pixel-perfect cloning is this skill. The current agent is the harness runtime.
`pwc` is the deterministic hands and eyes: it captures, persists, builds,
renders, replays, and measures. It never calls another model. You understand
the evidence, author code, and choose targeted repairs.

A single natural-language request such as “复刻 https://example.com” authorizes
the entire local reproduction workflow. Treat it as one user operation even
though the harness performs many internal tool calls and repair iterations.

Do not ask for routine confirmation when the request contains a usable URL.
Infer that a full-page clone is the default.
Continue across phases without returning control merely to announce progress or
request ordinary implementation choices. Ask only when a missing fact would
materially change scope, when credentials or new authority are required, or when
the user must resolve an external blocker.

Deployment is never implicit. Produce a local build and review URL by default;
deploy only when the user explicitly asks.

Use one owning agent for the whole page so global visual context survives across
sections. Do not delegate unless the user explicitly asks.

## Non-negotiable execution contract

1. Run capture, planning, authoring, build, verification, repair, and handoff as
   one continuous task.
2. Inspect every `ok` or `success` flag and its error evidence. Never invent a
   tool result.
3. Preserve immutable raw evidence separately from normalized evidence. Refuse
   to plan from an incomplete capture.
4. Reproduce every planned top-level section and every independently required
   critical region. Do not stop after the viewport or after a visually dominant
   subset.
5. Implement and replay every required common interaction: carousel, menu, tabs,
   accordion/details, and other contracts discovered during capture.
   A visually similar but inert control fails.
6. Run gates in dependency order. A downstream score cannot override an
   upstream structural or behavioral failure.
7. Repair the smallest owning component identified by evidence, rebuild, and
   re-run all affected gates.
8. Never hide, waive silently, or average away a red gate.
   A missing critical region cannot be offset by aggregate visual similarity.
9. End only in `ready_for_user_review` or `failed_with_residuals`.
   Only the user can accept the result.
```

</details>

#### 缺口

- 未装包、Host挂载、独立用户案例及全部MCP/旧内部接口未审。
  **影响**：不能把README承诺、Skill文本或Python模块目录当真实一键复刻成品、独立Agent/MCP交付或普遍需求。
  **进一步探讨**：固定npm/Python和宿主，先核工具/Skill实际出现，再对同源页面与通用Agent基线比较全过程；先解决Q02状态断点。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 采集/门控真实做什么，CLI连续执行为何不能按账本直接认定？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

采集service实际比较原始/规范化区域、页面高与截图高；不完整返回success=False，外层extract_page将失败摘要转ok:false。源材料默认落~/.pwc/sources，SourceStore确会写文件；不是“immutable”一词就有只写一次/密码学不可改证明。canvas等残差分类是有用提示，不是完整重演动态应用。

最重要断点在推荐CLI/当前DSH工具链。plugin.runPwc每次spawn新进程；cmd_assemble用asyncio.run执行组装，_require_sandbox先get_sandbox，空则create_sandbox(reset=True)。manager模块初始化_sandboxes={}、_singleton_id=None，创建随机sandbox-id并只登记内存，get_sandbox只查该字典；core.boxlite公开包装无磁盘重新附着。下一独立pwc build的cmd_build直接调用build_project→get_sandbox，空即抛“No sandbox exists”。因此从固定源码可推正常分次CLI/DSH assemble→build跨进程不能继承活动对象；没有执行复现，不称实测报错。再次独立assemble也会建新随机工作区，不能仅凭Skill要求检查run.json就断言跨进程恢复已实现。若外部调用者同一进程保有对象则可能使用这些函数；本轮未核到可启动MCP服务入口，不把这一可能当已交付替代。

评分还有独立边界：全图score_report的ok只看SSIM阈值0.97，mask_oversized为单独标志；分区score_by_section把无bounds记ungraded/ok:false，却总ok只要求graded>0且加权平均达标，不要求所有section合格/无ungraded。CLI _exit_from看顶层ok或success，不完成全门联合判定。Skill明确反对平均遮红、要求行为/结构/全部breakpoint状态；这比只看单次CLI退出码严格，Agent须逐项检查。weight默认限制压缩代码120KB，assets无给预算则不限制；fingerprint正则命中为0不是代码原创、功能或安全验收。

| 效果 | 已核依据 | 不能推出 |
|---|---|---|
| 捕获失败可见 | 完整性比较/失败envelope | 所有动态状态真实覆盖 |
| 定位视觉差异 | 分区bounds/单项分数/未评分计数 | 顶层ok即所有必需区合格 |
| 资源与指纹 | 代码预算/可选资产预算/正则 | 网页行为、全部资产约束、用户接受 |
| 可恢复生产 | 磁盘源/账本规则存在 | 跨CLI进程活动sandbox已恢复 |

#### 证据与依据

**依据 1 · 源码核查**：[core/extractor/service.py:287-316](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/extractor/service.py#L287-L316)

实际完整性判定和失败返回。

<details>
<summary>查看原文（30行）</summary>

```text
                raw_page = (raw_structure or {}).get("page") or {}
                normalized_page = (normalized_structure or {}).get("page") or {}
                capture_integrity = assess_capture_integrity(
                    pre_regions=(raw_structure or {}).get("regions") or [],
                    post_regions=(normalized_structure or {}).get("regions") or [],
                    pre_page_height=raw_page.get("height") or metadata.page_height,
                    post_page_height=normalized_page.get("height") or metadata.page_height,
                    raster_height=raster_h,
                    viewport_width=metadata.viewport_width,
                    viewport_height=metadata.viewport_height,
                )
                capture_integrity["normalization_mutations"] = baked
                if not capture_integrity.get("ok"):
                    return ExtractionResult(
                        success=False,
                        message="capture integrity failed",
                        error="capture_integrity_failed",
                        metadata=metadata,
                        dom_tree=dom_tree,
                        assets=assets,
                        raw_html=raw_html,
                        normalized_html=normalized_html,
                        raw_structure=raw_structure or {},
                        normalized_structure=normalized_structure or {},
                        interactions=interactions,
                        capture_integrity=capture_integrity,
                        raw_initial_b64=raw_initial_b64,
                        raw_full_b64=raw_full_b64,
                        screenshot_b64=screenshot_b64,
                        full_b64=full_b64,
```

</details>

**依据 2 · 源码核查**：[mcp_server/tools/extraction.py:481-515](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/mcp_server/tools/extraction.py#L481-L515)

实际采集调用/失败envelope与残差提示。

<details>
<summary>查看原文（35行）</summary>

```text
    try:
        result = _core_extract_page(url, opts)
    except Exception as exc:  # noqa: BLE001 — surface as a clean envelope.
        return _err(f"extraction failed: {exc}", url=url)

    summary = result.get("summary") or {}
    if not summary.get("success", True):
        return _err(
            summary.get("error") or "extraction reported failure.",
            source_id=result.get("source_id"),
            summary=summary,
        )

    # Pre-clone site typing: tells the brain up front whether this page can be
    # cloned to high fidelity (static / Shopify) or hits a known ceiling
    # (canvas/WebGL or scroll-choreography), so it never promises pixel-perfection
    # on a site whose visuals live in a runtime layer. Deterministic, no LLM.
    try:
        sid = result.get("source_id")
        store = SourceStore(sid) if sid else None
        raw_html = store.read_raw_html() if store else ""
        summary["site_classification"] = site_classifier.classify_site(raw_html or "", summary)
        # Surface canvas/WebGL main visuals as explicit residuals (never silently
        # dropped) so the brain can flag what a static clone cannot reproduce.
        dom = store.read_dom() if store else None
        residuals = capture_residuals.find_canvas_residuals(dom)
        if residuals:
            summary["capture_residuals"] = residuals
    except Exception:  # noqa: BLE001 — advisory, never fatal.
        pass

    return {
        "ok": True,
        "source_id": result.get("source_id"),
        "summary": summary,
```

</details>

**依据 3 · 源码核查**：[mcp_server/tools/build_deploy.py:60-83](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/mcp_server/tools/build_deploy.py#L60-L83)

组装要求活动sandbox，空时新建。

<details>
<summary>查看原文（24行）</summary>

```text
_SOURCE_MARKER = ".pwc/source-id"
_RUN_LEDGER = ".pwc/run.json"


async def _require_sandbox(source_id: Optional[str] = None) -> BoxLiteSandbox:
    """Return a sandbox that belongs to ``source_id``.

    Build/diagnose calls omit ``source_id`` and reuse the active sandbox.
    Assembly supplies it: the same source resumes in place, while a different
    source resets first so identically named section files from a previous site
    can never be mistaken for completed work.
    """
    sb = get_sandbox()
    created = sb is None
    if sb is None:
        sb = await create_sandbox(reset=True)

    if source_id is not None:
        active_source = await sb.read_file(_SOURCE_MARKER)
        if not created and active_source != source_id:
            sb = await create_sandbox(reset=True)
        await sb.write_file(_SOURCE_MARKER, source_id)

    return sb
```

</details>

**依据 4 · 源码核查**：[core/boxlite/__init__.py:115-122](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/__init__.py#L115-L122)

公开factory/get仅转调manager。

```text
async def create_sandbox(sandbox_id: Optional[str] = None, reset: bool = True) -> BoxLiteSandbox:
    """Create and initialize a sandbox (singleton by default). See sandbox_manager."""
    return await _create_sandbox(sandbox_id=sandbox_id, reset=reset)


def get_sandbox(sandbox_id: Optional[str] = None) -> Optional[BoxLiteSandbox]:
    """Return the active (or named) sandbox, or None if not yet created."""
    return _get_sandbox(sandbox_id)
```

**依据 5 · 源码核查**：[core/boxlite/sandbox_manager.py:237-244](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L237-L244)

缺省随机ID、磁盘路径与进程对象。

```text
    def __init__(self, sandbox_id: Optional[str] = None):
        self.sandbox_id = sandbox_id or f"sandbox-{uuid.uuid4().hex[:12]}"
        self.work_dir = Path(SANDBOX_BASE_DIR) / self.sandbox_id
        self.state = SandboxState(sandbox_id=self.sandbox_id)
        self.terminals: Dict[str, TerminalProcess] = {}
        self.dev_server_process: Optional[TerminalProcess] = None
        self._initialized = False
        self._lock = asyncio.Lock()
```

**依据 6 · 源码核查**：[core/boxlite/sandbox_manager.py:890-922](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L890-L922)

内存registry初始化/factory/get，无磁盘重连。

<details>
<summary>查看原文（33行）</summary>

```text
_sandboxes: Dict[str, BoxLiteSandbox] = {}

SINGLETON_MODE = os.getenv("BOXLITE_SINGLETON_MODE", "true").lower() in ("true", "1", "yes")
_singleton_id: Optional[str] = None


async def create_sandbox(sandbox_id: Optional[str] = None, reset: bool = True) -> BoxLiteSandbox:
    """Create (and initialize) a sandbox. In singleton mode reuses one instance.

    Returns an initialized BoxLiteSandbox with the default Vite scaffold written.
    """
    global _singleton_id
    if SINGLETON_MODE and _singleton_id and _singleton_id in _sandboxes:
        sb = _sandboxes[_singleton_id]
        if reset:
            await sb.initialize(reset=True)
        return sb

    sb = BoxLiteSandbox(sandbox_id)
    _sandboxes[sb.sandbox_id] = sb
    if SINGLETON_MODE:
        _singleton_id = sb.sandbox_id
    await sb.initialize(reset=True)
    return sb


def get_sandbox(sandbox_id: Optional[str] = None) -> Optional[BoxLiteSandbox]:
    """Fetch an existing sandbox by id (or the singleton if none given)."""
    if sandbox_id:
        return _sandboxes.get(sandbox_id)
    if SINGLETON_MODE and _singleton_id:
        return _sandboxes.get(_singleton_id)
    return next(iter(_sandboxes.values()), None)
```

</details>

**依据 7 · 源码核查**：[mcp_server/tools/build_deploy.py:565-579](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/mcp_server/tools/build_deploy.py#L565-L579)

build直接get，空即RuntimeError。

<details>
<summary>查看原文（15行）</summary>

```text
    sb = get_sandbox()
    if sb is None:
        raise RuntimeError(
            "No sandbox exists. Assemble the project (assemble_project) before building."
        )

    result = await sb.build()
    return {
        "success": result.success and bool(result.dist_dir),
        "exit_code": result.exit_code,
        "dist_dir": result.dist_dir,
        "duration_ms": result.duration_ms,
        "errors": _build_error_dicts(result.errors),
        "stdout_tail": (result.stdout or "")[-2000:],
        "stderr_tail": (result.stderr or "")[-2000:],
```

</details>

**依据 8 · 源码核查**：[pwc/cli.py:24-30](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/pwc/cli.py#L24-L30)

CLI退出依据顶层ok/success。

```text

def _exit_from(payload: dict[str, Any]) -> int:
    _dump(payload)
    ok = payload.get("ok")
    if ok is True or payload.get("success") is True:
        return 0
    return 1
```

**依据 9 · 源码核查**：[pwc/cli.py:48-59](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/pwc/cli.py#L48-L59)

分开的assemble/build命令实际callee。

<details>
<summary>查看原文（12行）</summary>

```text
def cmd_assemble(args: argparse.Namespace) -> int:
    from mcp_server.tools.build_deploy import assemble_project

    result = asyncio.run(assemble_project(args.source_id))
    return _exit_from(result)


def cmd_build(_args: argparse.Namespace) -> int:
    from mcp_server.tools.build_deploy import build_project

    result = asyncio.run(build_project())
    return _exit_from(result)
```

</details>

**依据 10 · 源码核查**：[core/gates/fidelity.py:70-90](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/gates/fidelity.py#L70-L90)

单图顶层ok与mask面积标志分离。

<details>
<summary>查看原文（21行）</summary>

```text
def score_report(
    ref_png: str,
    cand_png: str,
    threshold: float = DEFAULT_THRESHOLD,
    mask_regions: list[dict] | None = None,
) -> dict:
    """Score + provenance: the masked regions and area fraction are always logged.

    ``mask_oversized`` is True when the masked area exceeds ``MASK_AREA_CAP`` — a
    loud flag so masking can never silently hide a real miss.
    """
    s = score(ref_png, cand_png, mask_regions)
    frac = masked_fraction(mask_regions)
    return {
        "score": s,
        "threshold": threshold,
        "ok": s >= threshold,
        "masked_regions": mask_regions or [],
        "masked_fraction": frac,
        "mask_oversized": frac > MASK_AREA_CAP,
    }
```

</details>

**依据 11 · 源码核查**：[core/gates/fidelity.py:179-215](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/gates/fidelity.py#L179-L215)

分区未评分和总ok加权条件。

<details>
<summary>查看原文（37行）</summary>

```text
    rows: list[dict] = []
    graded = 0
    ungraded = 0
    for sec in sections:
        name = sec.get("name", "")
        rb, cb = sec.get("ref_bounds"), sec.get("cand_bounds")
        if not (_has_bounds(rb) and _has_bounds(cb)):
            ungraded += 1
            rows.append({
                "name": name, "score": None, "ok": False,
                "weight": 0.0, "graded": False, "reason": "missing bounds",
            })
            continue
        ref_crop = crop_region(ref_png, rb, ref_page_height)
        cand_crop = crop_region(cand_png, cb, cand_page_height)
        s = _ssim_images(ref_crop, cand_crop)
        graded += 1
        rows.append({
            "name": name, "score": s, "ok": s >= threshold,
            "weight": float(rb.get("height", 0)), "graded": True,
        })

    total_w = sum(r["weight"] for r in rows if r["graded"])
    if total_w > 0:
        agg = sum(r["score"] * r["weight"] for r in rows if r["graded"]) / total_w
    elif graded:  # graded sections with zero recorded height → simple mean
        agg = sum(r["score"] for r in rows if r["graded"]) / graded
    else:
        agg = 0.0

    return {
        "score": agg,
        "threshold": threshold,
        "ok": graded > 0 and agg >= threshold,
        "graded": graded,
        "ungraded": ungraded,
        "sections": rows,
```

</details>

**依据 12 · 源码核查**：[core/gates/weight.py:76-110](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/gates/weight.py#L76-L110)

代码/资产的不同计量与缺省约束。

<details>
<summary>查看原文（35行）</summary>

```text
    for root, _dirs, names in os.walk(dirpath):
        for name in names:
            path = os.path.join(root, name)
            ext = os.path.splitext(name)[1].lower()
            bucket = _TEXT_EXT_TO_TYPE.get(ext)
            if bucket is not None:
                size = _gzipped_size(path)
            else:
                bucket = "assets"
                size = _raw_size(path)
            by_type_bytes[bucket] = by_type_bytes.get(bucket, 0) + size

    total_bytes = sum(by_type_bytes.values())
    total_kb = total_bytes / 1024.0
    by_type_kb = {k: round(v / 1024.0, 3) for k, v in by_type_bytes.items()}

    # Code = everything that isn't a binary asset; assets = the "assets" bucket.
    asset_bytes = by_type_bytes.get("assets", 0)
    code_kb = (total_bytes - asset_bytes) / 1024.0
    asset_kb = asset_bytes / 1024.0

    code_ok = code_kb <= budget_kb
    asset_ok = (asset_budget_kb is None) or (asset_kb <= asset_budget_kb)

    return {
        "ok": code_ok and asset_ok,
        "total_kb": round(total_kb, 3),
        "budget_kb": budget_kb,
        "by_type": by_type_kb,
        "code_kb": round(code_kb, 3),
        "asset_kb": round(asset_kb, 3),
        "code_budget_kb": budget_kb,
        "asset_budget_kb": asset_budget_kb,
        "code_ok": code_ok,
        "asset_ok": asset_ok,
```

</details>

**依据 13 · 源码核查**：[core/gates/fingerprint.py:47-76](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/gates/fingerprint.py#L47-L76)

遍历与正则匹配到顶层ok。

<details>
<summary>查看原文（30行）</summary>

```text
    compiled = _compiled()
    by_pattern: Dict[str, int] = {p: 0 for p in _PATTERNS}
    offending: set = set()

    for root, _dirs, names in os.walk(dirpath):
        for name in names:
            ext = os.path.splitext(name)[1].lower()
            if ext not in _TEXT_EXTS:
                continue
            path = os.path.join(root, name)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                    text = fh.read()
            except (OSError, UnicodeError):
                continue
            file_hits = 0
            for rx, src in zip(compiled, _PATTERNS):
                n = len(rx.findall(text))
                if n:
                    by_pattern[src] += n
                    file_hits += n
            if file_hits:
                offending.add(path)

    by_pattern = {k: v for k, v in by_pattern.items() if v > 0}
    total = sum(by_pattern.values())
    return {
        "ok": total == 0,
        "total": total,
        "by_pattern": by_pattern,
```

</details>

**依据 14 · 源码核查**：[skill/SKILL.md:177-237](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/skill/SKILL.md#L177-L237)

已要求行为/所有状态/不可平均遮红和用户最终接受。

<details>
<summary>查看原文（61行）</summary>

```text
### 6. Verify in gate order

Start a local preview of `dist/` and retain its URL for user review. Verify at
the captured breakpoints and observable states.

Run:

1. Source integrity from extraction.
2. Critical structure: every planned section and `data-pwc-critical` anchor exists.
3. Required interaction replay in the preview (carousel, menu, tabs, accordion).
   Static look-alikes fail.
4. `pwc fingerprints <dist_dir>`
5. `pwc weight <dist_dir>`
6. Screenshot the clone and
   `pwc score --ref <source.png> --cand <clone.png>`
   Use `--sections` with per-section bounds when heights differ.
7. Compare to a same-source baseline when one exists.

Do not treat one aggregate SSIM number as acceptance. Structure, interaction,
and each required breakpoint/state remain individually visible in the result.

### 7. Repair automatically

While a required gate is red and budget remains:

1. Select the earliest failed hard gate; within it select the worst measured
   section or state.
2. Map its evidence to the owning component using section bounds, interaction
   ids, screenshot diffs, and diagnostic output.
3. Read the current component and `pwc section <source_id> <name>`.
4. Make one evidence-based repair to that component or shared token when the
   evidence proves the error is global.
5. Rebuild and replay every affected structural, behavioral, and visual gate.
6. Update `.pwc/run.json` with the attempt, measurement delta, and evidence
   paths.

Use at most five repair attempts per breakpoint × state. Stop early after one
non-improving retry followed by a second attempt that also fails to improve the
same metric. Preserve the best measured candidate; do not leave a regression as
the final artifact.

### 8. Hand off honestly

Set `ready_for_user_review` only when:

- capture integrity passed;
- all planned sections and critical anchors exist materially;
- all required common interactions replay successfully;
- the production build passed;
- fingerprints and required budgets passed;
- required visual breakpoint/state gates passed; and
- every claimed result has an evidence path or tool output.

Otherwise set `failed_with_residuals` and list every residual with its gate,
section/state, expected value, measured value, evidence, attempts, and reason for
stopping.

Return the local review URL, source project path, `dist/` path, evidence/report
paths, gate summary, and residuals. Say “ready for your review,” never “accepted”
or “pixel-perfect.” The user's visual and functional review is the final
decision.
```

</details>

#### 缺口

- 尚未隔离运行跨CLI流程、真实页面和人为缺项/高平均分对照。
  **影响**：构建与断点恢复不能按说明立即采用；量化ok也不能替代完整交付，采用需先修主链/验证缺项不会被绿色摘要遮蔽。
  **进一步探讨**：固定环境用两个独立CLI进程建/写/构建同一source，检查路径/内容保留；构造一个无bounds或红section且整体高分，逐项核ready判定，不执行真实部署。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、资源、写入及退出成本如何影响首次采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

npm发布files只有plugin/patch/skill/文档许可，不含Python core/templates；pwc须独立pip/Playwright Chromium，且shim不校验它与3.0.0 JS包匹配。Git安装示例无固定提交；本轮固定源码不等远端安装总相同。需要宿主Agent模型权限/计费与Node npm工具链，Python声明>=3.10，README Node20+只是要求，未核当前各平台组合。

BoxLite在此是本地进程与工作目录抽象，不据名称当容器/VM或不可信代码沙箱。实际build安装npm依赖再npm run build，远端页面/资源获取、生成组件/包脚本均需明确本地权限。initialize会清除当前工作区除node_modules外项目并写脚手架，还会_kill_port固定默认8080；该callee lsof取占用PID后kill -9，未见在这段核归属，不能把它说成只清本项目旧预览。随机workspace降低误覆盖既有项目概率，不等进程/端口隔离。退出须另停预览、确认子进程并保留/删源和作品；现有TerminalProcess.stop尝试TERM、超时KILL不证明全进程树已停。未把Python目录里的deploy函数当本次已核公开CLI部署路径；Skill明确部署需另授。

| 依赖/条件 | 是否必需 | 用途 | 缺失/不满足 |
|---|---|---|---|
| DSH tools、可选skills服务 | 该插件入口需tools | 注册模型工具/条件挂Skill | Host兼容/Skill加载另核 |
| 独立Python包+Chromium | 采集/CLI必需 | 浏览器、图像/分区处理 | npm单装不够，CLI版本不握手 |
| Node/npm/网络与磁盘 | 构建/下载必需 | 依赖安装、源资产、dist | 网络/权限/生命周期失败须处理 |
| 宿主Agent/Provider | 写码与修复必需 | 理解证据、改组件、决定下一步 | 核心工具不代替模型循环/业务判断 |
| 独立资料/端口/测试页面 | 初试必要条件 | 控制重置和端口清理范围 | 未隔离不宜直接试真实工作区 |

| 阶段 | 现金与资源 | 人工与时间 | 已知/未知 |
|---|---|---|---|
| 首次 | Python/Node/浏览器、网页资产/依赖磁盘；模型现金未知 | 固定两套包/Host，修或核跨进程主链、准备副本与端口 | 未测安装/初成品工时 |
| 持续 | 页面采集/模型轮次/构建资源 | 每状态最多五次修复是Skill预算规则，实际服从未知；逐项人工验行为 | 无总token/费用/收益实测 |
| 失败恢复 | 残留sources/sandboxes/node_modules/预览 | 不能盲目重复assemble；先备份手写组件与账本、核重置/活动对象/端口所有者 | 重做、流量、数据损失量未知 |
| 退出 | 本地证据/作品及环境依赖占用 | 停预览/核子进程、保留交付副本，再卸shim/Python并清所选资料 | 不许自动删除用户作品；无全树/远端回滚证明 |

#### 证据与依据

**依据 1 · 源码核查**：[package.json:12-29](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/package.json#L12-L29)

npm文件范围与Host peers，不含Python核心。

<details>
<summary>查看原文（18行）</summary>

```text
  "type": "module",
  "main": "plugin/index.js",
  "files": [
    "plugin",
    "cordis.patch.yml",
    "skill",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-tools": "*"
  },
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:3-22](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/pyproject.toml#L3-L22)

Python版本与真实依赖。

<details>
<summary>查看原文（20行）</summary>

```text
version = "3.0.0"
description = "Pixel-perfect clones of any webpage. Paste a URL, get a measured Vite + React replica."
readme = "README.md"
requires-python = ">=3.10"
license = { text = "MIT" }
authors = [{ name = "Perfect Web Clone" }]
keywords = ["web-clone", "pixel-perfect", "playwright"]
dependencies = [
    "pydantic>=2.5.0",
    "playwright>=1.44.0",
    "beautifulsoup4>=4.12.0",
    "httpx>=0.27.0",
    "pillow>=10.3.0",
    "lxml>=5.2.0",
    "scikit-image>=0.22.0",
    "numpy>=1.26.0",
]

[project.optional-dependencies]
dev = [
```

</details>

**依据 3 · 源码核查**：[README.md:27-38](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/README.md#L27-L38)

Node/安装要求与外部Skill。

<details>
<summary>查看原文（12行）</summary>

````text
Python 3.10+ and Node 20+.

```bash
pip install "git+https://github.com/ericshang98/Perfect-Web-Clone.git"
playwright install chromium
```

Load [`perfect-web-clone-skill`](https://github.com/ericshang98/perfect-web-clone-skill) into Claude Code, Codex, or any coding agent that can run `pwc`.

## How a clone run works

1. Capture the live URL (integrity-checked, assets localized)
````

</details>

**依据 4 · 源码核查**：[core/extractor/storage.py:47-52](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/extractor/storage.py#L47-L52)

源存储默认路径/环境变量。

```text
def default_storage_root() -> Path:
    """Where sources live. Overridable via `PWC_SOURCES_DIR` (or legacy `PWC3_SOURCES_DIR`)."""
    env = os.environ.get("PWC_SOURCES_DIR") or os.environ.get("PWC3_SOURCES_DIR")
    if env:
        return Path(env).expanduser().resolve()
    return (Path.home() / ".pwc" / "sources").resolve()
```

**依据 5 · 源码核查**：[core/extractor/storage.py:76-93](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/extractor/storage.py#L76-L93)

SourceStore实际写文件。

<details>
<summary>查看原文（18行）</summary>

```text
class SourceStore:
    """Reads/writes one extraction's directory. Pure filesystem; no network."""

    def __init__(self, source_id: str, root: Optional[Path] = None):
        self.source_id = source_id
        self.root = root or default_storage_root()
        self.dir = self.root / source_id

    # ---- write helpers ----

    def ensure_dirs(self) -> None:
        for sub in ("screenshots", "assets/images", "assets/fonts", "assets/scripts", "themes/dark"):
            (self.dir / sub).mkdir(parents=True, exist_ok=True)

    def write_text(self, rel: str, content: str) -> str:
        path = self.dir / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
```

</details>

**依据 6 · 源码核查**：[core/boxlite/sandbox_manager.py:56-63](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L56-L63)

本地资料根/固定默认端口/超时。

```text
SANDBOX_BASE_DIR = os.getenv("PWC_SANDBOX_DIR") or os.getenv(
    "BOXLITE_SANDBOX_DIR", str(Path.home() / ".pwc" / "sandboxes")
)
DEV_SERVER_PORT = int(os.getenv("BOXLITE_DEV_PORT", "8080"))
MAX_TERMINALS = 5
MAX_OUTPUT_LINES = 1000
DEFAULT_TIMEOUT = 60.0  # seconds
BUILD_TIMEOUT = float(os.getenv("BOXLITE_BUILD_TIMEOUT", "300"))  # seconds
```

**依据 7 · 源码核查**：[core/boxlite/sandbox_manager.py:257-292](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L257-L292)

initialize停现有对象/清端口/删旧文件再写脚手架。

<details>
<summary>查看原文（36行）</summary>

```text
    async def _do_initialize(self, reset: bool = False) -> SandboxState:
        logger.info(f"Initializing sandbox: {self.sandbox_id} (reset={reset})")
        self.state.status = SandboxStatus.CREATING

        try:
            if self.dev_server_process:
                await self.dev_server_process.stop()
                self.dev_server_process = None
            for terminal in list(self.terminals.values()):
                await terminal.stop()
            self.terminals.clear()
            self.state.terminals.clear()

            await self._kill_port(DEV_SERVER_PORT, max_attempts=10)

            self.state.preview_url = None
            self.state.preview = PreviewState()
            self.state.error = None
            self.state.forwarded_ports.clear()
            self._initialized = False

            if self.work_dir.exists():
                for item in self.work_dir.iterdir():
                    if item.name != "node_modules":
                        if item.is_dir():
                            shutil.rmtree(item)
                        else:
                            item.unlink()
            else:
                self.work_dir.mkdir(parents=True, exist_ok=True)

            self.state.files.clear()
            for path, content in DEFAULT_FILES.items():
                file_path = self.work_dir / path
                file_path.parent.mkdir(parents=True, exist_ok=True)
                file_path.write_text(content, encoding="utf-8")
```

</details>

**依据 8 · 源码核查**：[core/boxlite/sandbox_manager.py:529-554](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L529-L554)

npm install以及lsof→kill -9真实callee。

<details>
<summary>查看原文（26行）</summary>

```text
    async def install_dependencies(self, timeout: float = 180.0) -> CommandResult:
        return await self.exec("npm install", timeout=timeout)

    async def _kill_port(self, port: int, max_attempts: int = 10) -> bool:
        """Free a TCP port by killing whatever lsof finds bound to it."""
        for attempt in range(max_attempts):
            try:
                find = await asyncio.create_subprocess_shell(
                    f"lsof -ti:{port}",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout, _ = await find.communicate()
                pids = [p.strip() for p in stdout.decode().strip().split("\n") if p.strip()]
                if not pids:
                    return True
                for pid in pids:
                    try:
                        k = await asyncio.create_subprocess_shell(
                            f"kill -9 {pid}",
                            stdout=asyncio.subprocess.PIPE,
                            stderr=asyncio.subprocess.PIPE,
                        )
                        await k.communicate()
                    except Exception as e:  # noqa: BLE001
                        logger.warning(f"[KillPort] failed to kill {pid}: {e}")
```

</details>

**依据 9 · 源码核查**：[core/boxlite/sandbox_manager.py:690-724](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L690-L724)

实际build先依赖安装后npm脚本。

<details>
<summary>查看原文（35行）</summary>

```text
    async def build(self) -> BuildResult:
        """Run `npm run build` and report exit code, output, and parsed errors.

        Ensures dependencies are installed, then produces the static `dist/`.
        On failure, runs terminal + static detection over the build output so
        Claude Code can locate and fix the breakage.
        """
        install = await self.install_dependencies()
        if not install.success:
            return BuildResult(
                success=False,
                exit_code=install.exit_code,
                stdout=install.stdout,
                stderr=install.stderr,
                duration_ms=install.duration_ms,
                errors=[
                    BuildError(
                        type="NPM Error",
                        message=install.stderr[:500] or "npm install failed",
                        source="terminal",  # type: ignore[arg-type]
                    )
                ],
            )

        result = await self.exec("npm run build", timeout=BUILD_TIMEOUT)
        dist_dir = self.work_dir / "dist"
        errors: List[BuildError] = []
        if not result.success:
            errors = await self._parse_build_output(result.stdout + "\n" + result.stderr)

        return BuildResult(
            success=result.success,
            exit_code=result.exit_code,
            stdout=result.stdout,
            stderr=result.stderr,
```

</details>

**依据 10 · 源码核查**：[core/boxlite/sandbox_manager.py:207-226](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/boxlite/sandbox_manager.py#L207-L226)

terminal TERM/KILL边界，不是全进程树保证。

<details>
<summary>查看原文（20行）</summary>

```text
    async def stop(self) -> None:
        for task in self._read_tasks:
            if not task.done():
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
        self._read_tasks = []

        if self.process:
            try:
                self.process.terminate()
                await asyncio.wait_for(self.process.wait(), timeout=5.0)
            except asyncio.TimeoutError:
                self.process.kill()
            except Exception as e:  # noqa: BLE001
                logger.error(f"Error stopping process: {e}")

        self.session.is_running = False
```

</details>

**依据 11 · 源码核查**：[skill/SKILL.md:200-237](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/skill/SKILL.md#L200-L237)

修复次数/无改善停止和交付，不隐式接受。

<details>
<summary>查看原文（38行）</summary>

```text
While a required gate is red and budget remains:

1. Select the earliest failed hard gate; within it select the worst measured
   section or state.
2. Map its evidence to the owning component using section bounds, interaction
   ids, screenshot diffs, and diagnostic output.
3. Read the current component and `pwc section <source_id> <name>`.
4. Make one evidence-based repair to that component or shared token when the
   evidence proves the error is global.
5. Rebuild and replay every affected structural, behavioral, and visual gate.
6. Update `.pwc/run.json` with the attempt, measurement delta, and evidence
   paths.

Use at most five repair attempts per breakpoint × state. Stop early after one
non-improving retry followed by a second attempt that also fails to improve the
same metric. Preserve the best measured candidate; do not leave a regression as
the final artifact.

### 8. Hand off honestly

Set `ready_for_user_review` only when:

- capture integrity passed;
- all planned sections and critical anchors exist materially;
- all required common interactions replay successfully;
- the production build passed;
- fingerprints and required budgets passed;
- required visual breakpoint/state gates passed; and
- every claimed result has an evidence path or tool output.

Otherwise set `failed_with_residuals` and list every residual with its gate,
section/state, expected value, measured value, evidence, attempts, and reason for
stopping.

Return the local review URL, source project path, `dist/` path, evidence/report
paths, gate summary, and residuals. Say “ready for your review,” never “accepted”
or “pixel-perfect.” The user's visual and functional review is the final
decision.
```

</details>

#### 缺口

- 无匹配发布物、主机隔离/完整退出与模型资源实测。
  **影响**：不能向生产用户许诺安全无残留或低成本复刻；按默认端口试验还可能影响别的进程，必须先明确隔离范围。
  **进一步探讨**：仅在可丢弃环境/受控测试URL核安装、两次命令、重置、端口占用、退出及账单；优先修活动对象和端口所有权，不拿作者示例当兼容验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 值得形成什么方向，如何超越既有门控且证明有用？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可借鉴的是分区证据和明确残差交接，不是另起“自动复刻Agent”名字或再加SSIM/五次修复。当前Skill已经要求完整结构、行为回放、状态覆盖与不能平均遮红；source完整性、分区图像/资源/指纹门也已实现。跨CLI活动状态断点与顶层ok语义应先在本仓修复，不是独立插件商业机会；本轮未证成本节省/有人愿付费。

在这些前置修复后，才检验“固定产物的交付核验层”：要求artifact/hash、source_id、required section/state/interaction清单与证据来自同一次有效构建；缺bounds/缺结果/旧截图必须unknown或failed，不得只平均ok，再把当前Skill口头约束变成可供其他编码Agent复用的检查接口。它不是已有run.json文本或分区分数的换名，增量是跨进程同对象及全部必需项关联、过时证据拒绝；并不发明新的网页生成模型。用户点击接受仍由人，不把自动校验当需求满意。

最低对照先用受控静态页、菜单/轮播页、缺一关键区域、异步状态页；同源/同模型预算的通用Agent+浏览器、当前Skill+修过生命周期、增加核验层三组。核验方使用独立预设的任务与必需清单，注入无bounds/低分被高权重遮盖、旧构建截图、新进程续作、卡死预览；记录错误ready、漏区/错行为、恢复后的文件保留、最终人工修正分钟、模型/采集/构建用量与维护成本。先验明确错误ready不能高于基线，不能新增用户文件损失；若现有Skill已稳定处理全部案例或核验层只增加重复录入/工时、不能减少误交付，则停止独立方向，把必要修复留在原项目。真实用户需求、样本阈值与付费条件仍须先验证。

#### 证据与依据

**依据 1 · 源码核查**：[skill/SKILL.md:43-60](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/skill/SKILL.md#L43-L60)

完整/行为/不遮红/用户决策已经是现有要求。

<details>
<summary>查看原文（18行）</summary>

```text
2. Inspect every `ok` or `success` flag and its error evidence. Never invent a
   tool result.
3. Preserve immutable raw evidence separately from normalized evidence. Refuse
   to plan from an incomplete capture.
4. Reproduce every planned top-level section and every independently required
   critical region. Do not stop after the viewport or after a visually dominant
   subset.
5. Implement and replay every required common interaction: carousel, menu, tabs,
   accordion/details, and other contracts discovered during capture.
   A visually similar but inert control fails.
6. Run gates in dependency order. A downstream score cannot override an
   upstream structural or behavioral failure.
7. Repair the smallest owning component identified by evidence, rebuild, and
   re-run all affected gates.
8. Never hide, waive silently, or average away a red gate.
   A missing critical region cannot be offset by aggregate visual similarity.
9. End only in `ready_for_user_review` or `failed_with_residuals`.
   Only the user can accept the result.
```

</details>

**依据 2 · 源码核查**：[skill/SKILL.md:200-237](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/skill/SKILL.md#L200-L237)

现有修复与交接范围，未来不能重复计贡献。

<details>
<summary>查看原文（38行）</summary>

```text
While a required gate is red and budget remains:

1. Select the earliest failed hard gate; within it select the worst measured
   section or state.
2. Map its evidence to the owning component using section bounds, interaction
   ids, screenshot diffs, and diagnostic output.
3. Read the current component and `pwc section <source_id> <name>`.
4. Make one evidence-based repair to that component or shared token when the
   evidence proves the error is global.
5. Rebuild and replay every affected structural, behavioral, and visual gate.
6. Update `.pwc/run.json` with the attempt, measurement delta, and evidence
   paths.

Use at most five repair attempts per breakpoint × state. Stop early after one
non-improving retry followed by a second attempt that also fails to improve the
same metric. Preserve the best measured candidate; do not leave a regression as
the final artifact.

### 8. Hand off honestly

Set `ready_for_user_review` only when:

- capture integrity passed;
- all planned sections and critical anchors exist materially;
- all required common interactions replay successfully;
- the production build passed;
- fingerprints and required budgets passed;
- required visual breakpoint/state gates passed; and
- every claimed result has an evidence path or tool output.

Otherwise set `failed_with_residuals` and list every residual with its gate,
section/state, expected value, measured value, evidence, attempts, and reason for
stopping.

Return the local review URL, source project path, `dist/` path, evidence/report
paths, gate summary, and residuals. Say “ready for your review,” never “accepted”
or “pixel-perfect.” The user's visual and functional review is the final
decision.
```

</details>

**依据 3 · 源码核查**：[mcp_server/tools/build_deploy.py:64-83](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/mcp_server/tools/build_deploy.py#L64-L83)

已有source marker与同进程切源reset，未来须补跨进程。

<details>
<summary>查看原文（20行）</summary>

```text
async def _require_sandbox(source_id: Optional[str] = None) -> BoxLiteSandbox:
    """Return a sandbox that belongs to ``source_id``.

    Build/diagnose calls omit ``source_id`` and reuse the active sandbox.
    Assembly supplies it: the same source resumes in place, while a different
    source resets first so identically named section files from a previous site
    can never be mistaken for completed work.
    """
    sb = get_sandbox()
    created = sb is None
    if sb is None:
        sb = await create_sandbox(reset=True)

    if source_id is not None:
        active_source = await sb.read_file(_SOURCE_MARKER)
        if not created and active_source != source_id:
            sb = await create_sandbox(reset=True)
        await sb.write_file(_SOURCE_MARKER, source_id)

    return sb
```

</details>

**依据 4 · 源码核查**：[core/gates/fidelity.py:179-215](https://github.com/ericshang98/Perfect-Web-Clone/blob/c846c37937a70497d37d082c26c85aa1289a9fa5/core/gates/fidelity.py#L179-L215)

未来总表需改进已有加权/未评分输出语义。

<details>
<summary>查看原文（37行）</summary>

```text
    rows: list[dict] = []
    graded = 0
    ungraded = 0
    for sec in sections:
        name = sec.get("name", "")
        rb, cb = sec.get("ref_bounds"), sec.get("cand_bounds")
        if not (_has_bounds(rb) and _has_bounds(cb)):
            ungraded += 1
            rows.append({
                "name": name, "score": None, "ok": False,
                "weight": 0.0, "graded": False, "reason": "missing bounds",
            })
            continue
        ref_crop = crop_region(ref_png, rb, ref_page_height)
        cand_crop = crop_region(cand_png, cb, cand_page_height)
        s = _ssim_images(ref_crop, cand_crop)
        graded += 1
        rows.append({
            "name": name, "score": s, "ok": s >= threshold,
            "weight": float(rb.get("height", 0)), "graded": True,
        })

    total_w = sum(r["weight"] for r in rows if r["graded"])
    if total_w > 0:
        agg = sum(r["score"] * r["weight"] for r in rows if r["graded"]) / total_w
    elif graded:  # graded sections with zero recorded height → simple mean
        agg = sum(r["score"] for r in rows if r["graded"]) / graded
    else:
        agg = 0.0

    return {
        "score": agg,
        "threshold": threshold,
        "ok": graded > 0 and agg >= threshold,
        "graded": graded,
        "ungraded": ungraded,
        "sections": rows,
```

</details>

#### 缺口

- 没有真实复刻人员对照、需求频率或独立核验层经济性验证。
  **影响**：只能把核验层作为前置修复后的可证伪方向，不能据清晰设计就声称生产插件值得投资。
  **进一步探讨**：先获得合法可用受控页面与用户任务清单，独立评审四类案例，定错误ready/修正时间/总费门槛；无收益停独立产品。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
