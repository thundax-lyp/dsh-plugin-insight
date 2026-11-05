# 新诉讼可视化

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[58f70a8](https://github.com/MiaoQichuan/new-litigation-visualization/tree/58f70a83350a421dc1571c357efaefb262e82c4b)

<!-- BEGIN META -->
[![GitHub ★ 142](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=142&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MiaoQichuan/new-litigation-visualization)
<!-- END META -->

> **功能**：把案件材料整理成有出处、可编辑和可打印的图表

> **亮点**：[Q01](#research-q01) 以独立布局和出处索引减少反复排版，同时提供 DSH 原生启动工具。

> **主要限制**：[Q03](#research-q03) 字符子序列守卫允许删字，人工仍须核查否定、事实归属和争议口径。

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
  - [Q01 · 这套模块给谁交付什么？](#detail-section-11)
  - [Q02 · DSH 怎样运行绘图脚本？](#detail-section-12)
  - [Q03 · 源码能保证事实与材料隔离吗？](#detail-section-13)
  - [Q04 · 采用时需准备什么？](#detail-section-14)
  - [Q05 · 怎样衡量是否值得扩大采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：法律工作人员需要向当事人解释案件经过并保留出处。

手工摘录后在办公软件绘制并逐项标注出处。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工制图 | 人工掌控事实取舍 | 反复排版及补出处 |
| 固定版本插件 | 结构化输入和可编辑产物 | 依赖环境并需要复核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python | 必需 | 本机执行 | 先跑自检 |
| Node 与 Office 格式依赖 | 按格式 | Word 等可选交付 | 按目标格式安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 虚构案件和人工时间轴基准 | 保留出处和用时 |
| 运行 | 自检后生成 SVG 与 PPTX | 记录宿主和依赖版本 |
| 复核 | 逐项比对原材料及打印预览 | 记录错漏和版面问题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地宿主和解释器未知 | 安装自检和选模块耗时未知 | 取决于工作站环境 |
| 持续 | 模型与格式生成未知 | 人工核对每项引文耗时未知 | 与卷宗页数和格式有关 |
| 恢复 | 跨机器部署未知 | 管理版本和办公室模板耗时未知 | 按宿主和打印要求变化 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 出处与事实 | 两名复核者逐项核对 | 记录错误、遗漏与归属 |
| A4 和复现 | 重复输入及实物预览 | 记录溢出与布局差异 |

> **思考**：[Q03](#research-q03) 字符子序列守卫允许删字，人工仍须核查否定、事实归属和争议口径。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 以独立布局和出处索引减少反复排版，同时提供 DSH 原生启动工具。

DSH 运行工具与七个上游技能共同构成入口，子进程支持超时和直接 argv。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 字符子序列守卫允许删字，人工仍须核查否定、事实归属和争议口径。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先以虚构材料试用时间轴，限制目标格式并保留复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的缩短脱敏案件时间轴制图与逐项核对。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/mqc-nlv-dsh/index.js、plugins/mqc-nlv-dsh/lib/run.js、plugins/mqc-nlv/skills/mqc-timeline-master/scripts/validate_map.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的缩短脱敏案件时间轴制图与逐项核对。未执行目标代码或实际宿主验证。
- 下一步：用虚构卷宗做双人盲审并留存逐项核对表。

**分析版本**

- **仓库**：[MiaoQichuan/new-litigation-visualization](https://github.com/MiaoQichuan/new-litigation-visualization)
- **版本号**：未声明（[固定提交 58f70a8](https://github.com/MiaoQichuan/new-litigation-visualization/tree/58f70a83350a421dc1571c357efaefb262e82c4b)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 同一虚构卷宗经插件制作的时间轴或可减少排版工时且保留出处核对质量。

用虚构卷宗做双人盲审并留存逐项核对表。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 120 | 13866 | — | — | 219604 |
| .js | source | 8 | 1018 | 836 | 125 | — |
| .mjs | test | 2 | 332 | 291 | 23 | — |
| .md | test | 1 | 748 | — | — | 4551 |
| .md | example | 1 | 17 | — | — | 369 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/MiaoQichuan/new-litigation-visualization/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：缩短脱敏案件时间轴制图与逐项核对

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这套模块给谁交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要整理案件经过、关系和争点的法律工作人员。对比手工摘录后重新排版，作者把案件材料抽取和可编辑图表交付合并到七个技能，DSH 提供原生运行工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-26](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/README.md#L17-L26)

作者将语义提取、几何布局和原句溯源分开

<details>
<summary>查看原文（10行）</summary>

```text
<p align="center"><b>把法律画出来</b> · Make the Law Visible<br/>给法律人的诉讼可视化工具集：把案件材料变成能直接放进诉讼材料的图和表。</p>

---

**Litigation visualization, made deterministic.** Seven installable skills that turn case
files and legal data into court-ready figures, charts and tables. The model only reads meaning; every coordinate,
size and character budget is computed by deterministic scripts from the physical size of an
A4 sheet. Text on a figure is always a subsequence of the source sentence, and every element
traces back to the document and sentence it came from. AGPL-3.0 licensed, no network calls, works
with any agent that reads `SKILL.md`.
```

</details>

**依据 2 · 作者声明**：[README.md:146-164](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/README.md#L146-L164)

作者提供 DSH 专用发行包和两个原生工具

<details>
<summary>查看原文（19行）</summary>

````text

```bash
python3 plugins/mqc-nlv/skills/mqc-litigation-visual-redraw/scripts/doctor.py
```

然后把材料丢给 agent，用中文说一句要什么即可，例如：

```
用时间轴大师，把这份判决书画成案件经过时间轴，交当事人看
```

<img src="assets/icons/dsh.png" width="44" alt="DeepSeek Harness 插件" align="left"/> **DeepSeek Harness**（v3.0.0 起有专门的插件 `mqc-nlv-dsh`，七个模块一次装好）：<br clear="left"/>

1. 电脑上先装 Python 3.9 或更新的版本（Windows 安装时第一页勾选「Add python.exe to PATH」）；
2. 从本仓库的 [Releases](https://github.com/MiaoQichuan/new-litigation-visualization/releases) 下载 `mqc-nlv-dsh-<版本>.tgz`；
3. 在 DeepSeek Harness 左侧点 **插件 → 添加插件**，填这个文件的完整路径（例如 `C:\Users\您\Downloads\mqc-nlv-dsh-3.0.0.tgz`，**不要带引号**；安装源保持「中国大陆镜像源」），安装后「立即启用」；
4. 完全退出再打开 DeepSeek Harness，新建会话，说「检查新诉讼可视化的环境」。

插件比单纯挂技能目录多做了三件事：自带 `nlv_check`（找本机的 Python，缺什么说清怎么装）与 `nlv_run`
````

</details>

#### 缺口

- 手工绘制后再逐条补证据出处容易重复工作。
  **影响**：可把交付与复核集中在同一份产物。
  **进一步探讨**：先选一个时间轴而非整套卷宗。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 怎样运行绘图脚本？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具登记环境自检和 Python 脚本调用。执行器校验脚本与工作目录，直接传 argv 给子进程并设置超时，避免中间 shell 的引号解析。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/mqc-nlv-dsh/index.js:62-96](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv-dsh/index.js#L62-L96)

环境检查汇总 Python 和各格式依赖

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'nlv_check',
    description:
      '新诉讼可视化：检查本机能不能运行七个诉讼可视化技能（Python 是否可用、版本、Excel / PNG / Word 等可选能力）。'
      + '第一次使用新诉讼可视化、或 nlv_run 报告找不到 Python 时调用；把返回的安装说明原样转告用户。',
    parameters: {
      refresh: { type: 'boolean', description: '重新查找 Python（用户刚装好 Python 时传 true）。' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, v) => textBlock(renderCheck(v)),
    },
    async execute(args, exec) {
      const py = await findPython({ refresh: args.refresh === true })
      const cwd = sessionCwd(ctx, exec)
      const shadow = shadowingCopies(SKILL_NAMES, cwd)
      const result = {
        plugin: VERSION,
        skills: SKILL_NAMES,
        python: py.ok ? { ok: true, version: py.version, command: [py.cmd, ...py.pre].join(' '), executable: py.executable } : { ok: false },
        tried: py.ok ? [] : py.tried,
        help: py.ok ? '' : installHelp(),
        optional: {},
        shadowed: shadow,
      }
      if (py.ok) {
        result.optional.excel = (await canImport(py, 'openpyxl')) ? '可用（openpyxl 随插件附带）' : '不可用：openpyxl 读不进来'
        result.optional.pillow = (await canImport(py, 'PIL')) ? '可用' : '未装（只影响庭审对抗图的 PNG 预览，可 pip install pillow numpy）'
      }
      const soffice = findSoffice()
      result.optional.libreoffice = soffice ? `可用：${soffice}` : '未装（PNG 预览、读 PPT 模板缩略图会跳过；SVG、PPTX、Excel 不受影响）'
      result.optional.graphviz = which('dot') ? '可用' : '未装（可选：V1 流程图有自带排版，不装也能出）'
      const hasNode = which('node')
      const hasDocx = existsSync(join(NODE_VENDOR, 'docx', 'dist', 'index.cjs'))
```

</details>

**依据 2 · 源码核查**：[plugins/mqc-nlv-dsh/index.js:104-134](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv-dsh/index.js#L104-L134)

原生工具接收技能脚本路径、参数和运行目录

<details>
<summary>查看原文（31行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'nlv_run',
    description:
      '新诉讼可视化：在用户的工作区里运行某个技能的 Python 脚本。技能说明里写成 `python3 <本技能目录>/scripts/x.py 参数…` 的命令，'
      + '一律改用本工具：skill 填技能名，script 填相对技能目录的路径（如 scripts/x.py），args 按顺序逐项填参数（不要自己加引号）。'
      + '不要在终端里直接敲 python3 / python。结果里的 files 是本次新写出的文件；成品请再用 present 交付给用户。',
    parameters: {
      skill: { type: 'string', required: true, ...(SKILL_NAMES.length ? { enum: SKILL_NAMES } : {}), description: '技能名，例如 mqc-legal-chart-master。' },
      script: { type: 'string', required: true, description: '相对技能目录的脚本路径，例如 scripts/make.py。' },
      args: { type: 'array', items: { type: 'string' }, description: '传给脚本的参数，按顺序每项一个，例如 ["examples/a.json", "-o", "图/a"]。路径写相对工作区的路径。' },
      workdir: { type: 'string', description: '在工作区里的哪个子目录运行；不写就是工作区本身。' },
      timeoutSec: { type: 'integer', description: '最长运行秒数，默认 600，最多 1800。' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, v) => textBlock(renderRun(v)),
    },
    async execute(args, exec) {
      const py = await findPython()
      if (!py.ok) {
        return { ok: false, reason: 'no-python', help: installHelp(), tried: py.tried }
      }
      const scriptPath = resolveScript(SKILLS_ROOT, args.skill, args.script)
      const cwd = resolveWorkdir(sessionCwd(ctx, exec), args.workdir)
      const timeoutSec = Math.min(1800, Math.max(5, args.timeoutSec ?? 600))
      const { argv, resolved } = resolveSkillFileArgs(args.args ?? [], cwd, join(SKILLS_ROOT, args.skill))
      const r = await runScript({
        python: py, scriptPath, args: argv, cwd, timeoutSec, signal: exec?.signal, pythonPath: [PY_VENDOR], nodePath: [NODE_VENDOR],
      })
      return { ok: r.exitCode === 0, skill: args.skill, python: py.version, ...(resolved.length ? { resolvedArgs: resolved } : {}), ...r }
    },
```

</details>

**依据 3 · 源码核查**：[plugins/mqc-nlv-dsh/lib/run.js:114-146](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv-dsh/lib/run.js#L114-L146)

直接启动子进程并处理超时和取消

<details>
<summary>查看原文（33行）</summary>

```text
export function runScript({ python, scriptPath, args = [], cwd, timeoutSec = 600, signal, pythonPath = [], nodePath = [] }) {
  return new Promise((resolvePromise, reject) => {
    const started = Date.now()
    const env = { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PYTHONDONTWRITEBYTECODE: '1', NLV_HOST: 'deepseek-harness' }
    const extra = pythonPath.filter((p) => existsSync(p))
    if (extra.length) env.PYTHONPATH = [...extra, ...(env.PYTHONPATH ? [env.PYTHONPATH] : [])].join(delimiter)
    // 脚本另起 node 写 Word 时（require('docx')），从随插件附带的 node_modules 找
    const nodeExtra = nodePath.filter((p) => existsSync(p))
    if (nodeExtra.length) env.NODE_PATH = [...nodeExtra, ...(env.NODE_PATH ? [env.NODE_PATH] : [])].join(delimiter)
    let child
    try {
      child = spawn(python.cmd, [...python.pre, scriptPath, ...args.map(String)], {
        cwd, env, windowsHide: true, detached: process.platform !== 'win32',
      })
    } catch (e) {
      return reject(new Error(`启动 Python 失败：${e?.message || e}`))
    }
    let out = Buffer.alloc(0)
    let err = Buffer.alloc(0)
    const keep = (buf, d) => {
      const b = Buffer.concat([buf, d])
      return b.length > MAX_CAPTURE ? b.subarray(b.length - MAX_CAPTURE) : b
    }
    child.stdout.on('data', (d) => { out = keep(out, d) })
    child.stderr.on('data', (d) => { err = keep(err, d) })
    let timedOut = false
    let aborted = false
    const timer = setTimeout(() => { timedOut = true; killTree(child) }, Math.max(5, timeoutSec) * 1000)
    const onAbort = () => { aborted = true; killTree(child) }
    if (signal) {
      if (signal.aborted) onAbort()
      else signal.addEventListener('abort', onAbort, { once: true })
    }
```

</details>

#### 缺口

- 本机环境和客户端交付仍需验证。
  **影响**：Windows 中文路径少一层 shell 转义。
  **进一步探讨**：用虚构材料试验带空格和中文的目录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 源码能保证事实与材料隔离吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

时间轴标题缩写有子序列守卫。保留原字符顺序仍可能删掉否定词，事实语义、引文归属和模型资料去向需独立核查。脚本及 cwd 检查也只覆盖这些路径，参数规则允许绝对路径通过。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/mqc-nlv/skills/mqc-timeline-master/scripts/validate_map.py:230-243](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv/skills/mqc-timeline-master/scripts/validate_map.py#L230-L243)

缩短标题按字符顺序校验

<details>
<summary>查看原文（14行）</summary>

```text
    # head_short 是给横向形态用的缩写。它必须是 head 的子序列：逐字按序取自
    # head，只许删不许改。这一条同时挡住两件事：改写，以及把短标题挂到别的
    # 事件上去。后者更危险，因为图看起来完全正常。
    for e in events:
        hs, hd = e.get("head_short"), e.get("head", "")
        if not hs:
            continue
        if len(hs) > 10:
            E.append(f"事件 {e.get('id','?')}: head_short 超过 10 字（{len(hs)} 字）")
        i = 0
        for ch in hs:
            i = hd.find(ch, i)
            if i < 0:
                E.append(f"事件 {e.get('id','?')}: head_short {hs!r} 不是 head 的子序列，"
```

</details>

**依据 2 · 源码核查**：[plugins/mqc-nlv-dsh/lib/run.js:28-72](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv-dsh/lib/run.js#L28-L72)

脚本和 cwd 有范围校验，绝对路径参数可传给脚本

<details>
<summary>查看原文（45行）</summary>

```text
export function resolveScript(skillsRoot, skill, script) {
  const skillDir = join(skillsRoot, skill)
  if (!existsSync(join(skillDir, 'SKILL.md'))) throw new Error(`没有这个技能：${skill}`)
  const s = String(script || '').trim().replace(/^["']|["']$/g, '')
  if (!s) throw new Error('script 不能为空，例如 scripts/make.py')
  let abs = isAbsolute(s) ? s : join(skillDir, s)
  if (!isAbsolute(s) && !existsSync(abs)) {
    // 模型有时会把技能名带进来：mqc-legal-chart-master/scripts/make.py
    const alt = join(skillsRoot, s)
    if (existsSync(alt)) abs = alt
  }
  if (!abs.toLowerCase().endsWith('.py')) throw new Error(`只能运行 .py 脚本，收到：${s}`)
  if (!existsSync(abs) || !statSync(abs).isFile()) throw new Error(`找不到脚本：${s}（相对技能目录 ${skill} 来写，例如 scripts/make.py）`)
  if (!isInside(abs, skillsRoot)) throw new Error(`只能运行随插件附带的技能脚本，这个路径在技能目录之外：${s}`)
  return real(abs)
}

/** 工作目录：会话工作区，或其中的子目录。 */
export function resolveWorkdir(sessionCwd, workdir) {
  const base = real(sessionCwd)
  if (!workdir) return base
  const abs = isAbsolute(workdir) ? workdir : join(base, workdir)
  if (!existsSync(abs) || !statSync(abs).isDirectory()) throw new Error(`工作目录不存在：${workdir}`)
  if (!isInside(abs, base)) throw new Error(`工作目录必须在当前会话的工作区之内：${workdir}`)
  return real(abs)
}

/**
 * 参数里写成「相对技能目录」的输入文件（例如示例 examples/a.json）：工作区里没有、技能目录里有，就换成完整路径。
 * 只换「看起来是相对路径、且在技能目录里确实存在的文件或文件夹」，输出路径（事先不存在）与选项不受影响。
 */
export function resolveSkillFileArgs(args, cwd, skillDir) {
  const resolved = []
  const argv = args.map((a) => {
    const s = String(a)
    if (!s || s.startsWith('-') || isAbsolute(s) || s.includes('\u0000')) return s
    if (existsSync(join(cwd, s))) return s
    const cand = join(skillDir, s)
    if (existsSync(cand) && isInside(cand, skillDir)) {
      resolved.push({ from: s, to: cand })
      return cand
    }
    return s
  })
  return { argv, resolved }
```

</details>

#### 缺口

- 案情语义失真和路径权限需单独评估。
  **影响**：合规制图不等于可直接交付案卷。
  **进一步探讨**：加入否定词、扫描件和混合证据的虚构反例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用时需准备什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依作者流程安装发布包和 Python 3.9+，Word 依赖 Node，旧同名技能可能优先于插件。先核查目标机器、宿主模型资料策略和必要格式。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:146-164](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/README.md#L146-L164)

发布包安装、Python、Node 及同名技能优先级由作者说明

<details>
<summary>查看原文（19行）</summary>

````text

```bash
python3 plugins/mqc-nlv/skills/mqc-litigation-visual-redraw/scripts/doctor.py
```

然后把材料丢给 agent，用中文说一句要什么即可，例如：

```
用时间轴大师，把这份判决书画成案件经过时间轴，交当事人看
```

<img src="assets/icons/dsh.png" width="44" alt="DeepSeek Harness 插件" align="left"/> **DeepSeek Harness**（v3.0.0 起有专门的插件 `mqc-nlv-dsh`，七个模块一次装好）：<br clear="left"/>

1. 电脑上先装 Python 3.9 或更新的版本（Windows 安装时第一页勾选「Add python.exe to PATH」）；
2. 从本仓库的 [Releases](https://github.com/MiaoQichuan/new-litigation-visualization/releases) 下载 `mqc-nlv-dsh-<版本>.tgz`；
3. 在 DeepSeek Harness 左侧点 **插件 → 添加插件**，填这个文件的完整路径（例如 `C:\Users\您\Downloads\mqc-nlv-dsh-3.0.0.tgz`，**不要带引号**；安装源保持「中国大陆镜像源」），安装后「立即启用」；
4. 完全退出再打开 DeepSeek Harness，新建会话，说「检查新诉讼可视化的环境」。

插件比单纯挂技能目录多做了三件事：自带 `nlv_check`（找本机的 Python，缺什么说清怎么装）与 `nlv_run`
````

</details>

**依据 2 · 源码核查**：[plugins/mqc-nlv-dsh/index.js:62-96](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv-dsh/index.js#L62-L96)

环境工具检查格式依赖

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx) {
  ctx.tools.register(defineTool({
    name: 'nlv_check',
    description:
      '新诉讼可视化：检查本机能不能运行七个诉讼可视化技能（Python 是否可用、版本、Excel / PNG / Word 等可选能力）。'
      + '第一次使用新诉讼可视化、或 nlv_run 报告找不到 Python 时调用；把返回的安装说明原样转告用户。',
    parameters: {
      refresh: { type: 'boolean', description: '重新查找 Python（用户刚装好 Python 时传 true）。' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, v) => textBlock(renderCheck(v)),
    },
    async execute(args, exec) {
      const py = await findPython({ refresh: args.refresh === true })
      const cwd = sessionCwd(ctx, exec)
      const shadow = shadowingCopies(SKILL_NAMES, cwd)
      const result = {
        plugin: VERSION,
        skills: SKILL_NAMES,
        python: py.ok ? { ok: true, version: py.version, command: [py.cmd, ...py.pre].join(' '), executable: py.executable } : { ok: false },
        tried: py.ok ? [] : py.tried,
        help: py.ok ? '' : installHelp(),
        optional: {},
        shadowed: shadow,
      }
      if (py.ok) {
        result.optional.excel = (await canImport(py, 'openpyxl')) ? '可用（openpyxl 随插件附带）' : '不可用：openpyxl 读不进来'
        result.optional.pillow = (await canImport(py, 'PIL')) ? '可用' : '未装（只影响庭审对抗图的 PNG 预览，可 pip install pillow numpy）'
      }
      const soffice = findSoffice()
      result.optional.libreoffice = soffice ? `可用：${soffice}` : '未装（PNG 预览、读 PPT 模板缩略图会跳过；SVG、PPTX、Excel 不受影响）'
      result.optional.graphviz = which('dot') ? '可用' : '未装（可选：V1 流程图有自带排版，不装也能出）'
      const hasNode = which('node')
      const hasDocx = existsSync(join(NODE_VENDOR, 'docx', 'dist', 'index.cjs'))
```

</details>

#### 缺口

- 办公室机器的依赖和可用输出格式可能不同。
  **影响**：依赖缺失会影响试用成本和交付。
  **进一步探讨**：先把 SVG 与 PPTX 作为单模块验收范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样衡量是否值得扩大采用？

**研究主题**：新假设与验证

#### 完整回答

同一份虚构卷宗对比手工和插件流程，记录处理耗时、语义错漏、出处命中和 A4 打印问题，另对同一结构化输入重复生成检查版面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-26](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/README.md#L17-L26)

作者把 A4 几何和文本可追溯设为目标

<details>
<summary>查看原文（10行）</summary>

```text
<p align="center"><b>把法律画出来</b> · Make the Law Visible<br/>给法律人的诉讼可视化工具集：把案件材料变成能直接放进诉讼材料的图和表。</p>

---

**Litigation visualization, made deterministic.** Seven installable skills that turn case
files and legal data into court-ready figures, charts and tables. The model only reads meaning; every coordinate,
size and character budget is computed by deterministic scripts from the physical size of an
A4 sheet. Text on a figure is always a subsequence of the source sentence, and every element
traces back to the document and sentence it came from. AGPL-3.0 licensed, no network calls, works
with any agent that reads `SKILL.md`.
```

</details>

**依据 2 · 源码核查**：[plugins/mqc-nlv/skills/mqc-timeline-master/scripts/validate_map.py:230-243](https://github.com/MiaoQichuan/new-litigation-visualization/blob/58f70a83350a421dc1571c357efaefb262e82c4b/plugins/mqc-nlv/skills/mqc-timeline-master/scripts/validate_map.py#L230-L243)

标题有可构造反例的校验点

<details>
<summary>查看原文（14行）</summary>

```text
    # head_short 是给横向形态用的缩写。它必须是 head 的子序列：逐字按序取自
    # head，只许删不许改。这一条同时挡住两件事：改写，以及把短标题挂到别的
    # 事件上去。后者更危险，因为图看起来完全正常。
    for e in events:
        hs, hd = e.get("head_short"), e.get("head", "")
        if not hs:
            continue
        if len(hs) > 10:
            E.append(f"事件 {e.get('id','?')}: head_short 超过 10 字（{len(hs)} 字）")
        i = 0
        for ch in hs:
            i = hd.find(ch, i)
            if i < 0:
                E.append(f"事件 {e.get('id','?')}: head_short {hs!r} 不是 head 的子序列，"
```

</details>

#### 缺口

- 现有材料未给出独立盲审数据。
  **影响**：可把渲染稳定性和抽取质量分开计量。
  **进一步探讨**：用虚构卷宗做双人盲审并留存逐项核对表。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
