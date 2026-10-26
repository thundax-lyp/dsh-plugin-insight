# dsh-wrapup-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[99734eb](https://github.com/566001/dsh-wrapup-guard/tree/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/566001/dsh-wrapup-guard) [![npm 30d 74](https://img.shields.io/static/v1?label=npm+30d&message=74&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wrapup-guard) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wrapup-guard)
<!-- END META -->

> **实现功能**：用 wrapup_check 记录收尾检查轮次并在三轮空问题报告后提示完成。

> **核心亮点**：把收尾过程显式化为检查工具、轮次状态和通知，降低遗漏提醒成本，但保证依赖如实调用/上报。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：check 未与 report 门槛绑定，缺人工 checks 只是提醒，三次空 problems 可绕开所谓全面检查；状态落盘失败也被吞掉。详见[Q03](#research-q03)。

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
  - [Q01 · 目标用户、基线和交付是什么？](#detail-section-11)
  - [Q02 · 自动命令和连续三轮怎样实现？](#detail-section-12)
  - [Q03 · “强制全面检查”是否真能保证检查发生？](#detail-section-13)
  - [Q04 · 通知、多会话和采用成本边界是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 开发任务交付前的测试、审查、构建和一致性核对。

模型自行宣布任务结束，或人工跑测试和对照清单；本插件加入提示、自动脚本和三轮自报状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 限制 |
| --- | --- | --- |
| wrapup_check | 命令检查与三轮记账 | 不绑定同轮检查证据 |
| status route/client | 显示最近完成报告 | 宿主内存 latest、未按会话筛选 |

**流程与依赖**

#### 启动依赖

| 条件 | 用途 | 缺失/不满足 |
| --- | --- | --- |
| DSH tools/systemPrompt 注入 | 注册工具和提醒 | 无法使用或未被提醒 |
| Node/npm 与项目脚本 | 自动检查 | 只能手动查或命令失败 |
| DSH_HOME/用户目录可写 | 跨轮持久化 | 静默丢状态 |
| Web Server/客户端 | 可视通知 | 工具报告仍可返回 |


#### 流程

| 步骤 | 实际动作 | 应核验 |
| --- | --- | --- |
| start | 初始化状态与探测命令 | 脚本副作用、会话目录 |
| check | 顺序运行发现的脚本 | 失败与输出证据 |
| 人工检查 | 模型审查/构建/一致性 | 实际执行记录 |
| report | 依据问题数组计数 | 当前实现不核前两步 |
| 通知 | 三次空数组后轮询卡片 | 报告归属与可见性 |

**效果与成本**

#### 成本

| 阶段 | 资源/时间 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 首次使用 | 安装 profile 包并重启 DSH | 核项目检查脚本、副作用与权限 | 宿主未验 |
| 每轮收尾 | 每条脚本最多180秒，理论需三轮以上 | 做审查、构建、一致性并核输出 | 总耗时和质量收益未测 |
| 故障恢复 | 重跑失败脚本、排查状态文件/路由 | 人工核证是否真完成 | 写盘失败静默 |


#### 效果

| 项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 检查提醒 | 系统提示及工具说明 | 模型必然调用 |
| 三轮状态 | 空问题报告累计到三 | 每轮真的全面检查 |
| 完成通知 | 路由和客户端轮询 | 跨用户隔离与重启恢复 |

> **思考**：check 未与 report 门槛绑定，缺人工 checks 只是提醒，三次空 problems 可绕开所谓全面检查；状态落盘失败也被吞掉。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把收尾过程显式化为检查工具、轮次状态和通知，降低遗漏提醒成本，但保证依赖如实调用/上报。详见[Q01](#research-q01)、[Q02](#research-q02)。

把收尾过程显式化为检查工具、轮次状态和通知，降低遗漏提醒成本，但保证依赖如实调用/上报。详见[Q01](#research-q01)、[Q02](#research-q02)。

脚本名称白名单只限制发现集合，不限制脚本自身副作用。输出在完成时裁剪，收集中无界；saveState 吞错，每次调用仍读盘；report 不核同轮 check 结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

check 未与 report 门槛绑定，缺人工 checks 只是提醒，三次空 problems 可绕开所谓全面检查；状态落盘失败也被吞掉。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅建议隔离项目观察试用。若要用于正式交付，须先证明同轮检查可追溯、失败不会空报放行，并明确多会话显示隔离。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

状态机与脚本执行可由固定源码核查；report 不要求同轮 check 或完整人工检查，三次空报告即可静态放行；宿主与用户行为未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、client/client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态检查 README、package、宿主源码和客户端；未执行目标包、目标检查脚本或 DSH 宿主。
- 下一步：用临时项目做有失败脚本、漏 check、缺人工 checks、状态目录只读、长日志及双会话场景，观察误放行、资源与通知归属。

**分析版本**

- **仓库**：[566001/dsh-wrapup-guard](https://github.com/566001/dsh-wrapup-guard)
- **版本号**：0.1.0（[固定提交 99734eb](https://github.com/566001/dsh-wrapup-guard/tree/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

同轮证据绑定、失败阻断和按会话隔离通知，若在漏查/失败/多会话测试中降低误放行且耗时可接受，再考虑作为质量门；本版未实现。详见[Q04](#research-q04)。

用临时项目做有失败脚本、漏 check、缺人工 checks、状态目录只读、长日志及双会话场景，观察误放行、资源与通知归属。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 947 | 761 | 105 | — |
| .md | source | 1 | 165 | — | — | 1501 |
| .mjs | source | 2 | 187 | 131 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/566001/dsh-wrapup-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/566001/dsh-wrapup-guard/issues?q=is%3Aissue+created%3A2026-09-22T05%3A24%3A59.181Z..2026-10-22T05%3A24%3A59.181Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/566001/dsh-wrapup-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A24%3A59.181Z..2026-10-22T05%3A24%3A59.181Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实固定版收尾门槛的状态机、检查与通知边界，判断能否作为可信的交付保证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、基线和交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向用 DSH 完成开发任务、容易在交付前遗漏测试、审查或文档核对的个人或团队。作者主张在任务完成时由模型调用 wrapup_check，按 start→check→人工审查/构建/一致性→report 循环，连续三轮零问题后出具完成报告并通知。相对原来由模型自行决定何时宣告完成，它提供命名的检查项、命令探测执行、轮次计数和可见报告；真正代码审查、修复与最终事实真实性仍由模型和用户负责。合格交付应至少看到所查命令及结果、人工审查证据、问题修复后复核、可追溯的三轮结果，而不仅是一个 fixed-point 字样。固定版本入口注册模型工具、提示段、Web 状态路由，客户端轮询显示卡片；这些是实现范围，不证明 DSH 宿主已经接受或所有用户都会按提示调用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-40](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/README.md#L16-L40)

作者提出收尾遗漏问题、四类分工与三轮零问题目标。

<details>
<summary>查看原文（25行）</summary>

````text
## 它解决什么问题

AI 干完活常说「改好了」，但没跑测试、没看有没有引入回归、没核对文档。
这个插件把「收尾」变成一个有门槛的动作：

```
全面检查 → 发现问题 → 修复 → 再全面检查 → …
        ↑__________________________|
  直到连续 3 轮零问题 → 通知用户「收尾完成」
```

**只要有未修复的问题就必然被打回**；哪怕这轮只是修了个小 bug，也**不算干净**
（计数归零）。这样才不会被「边查边修、修完就说好了」糊弄过去。

---

## 分工

| 谁 | 负责什么 |
|---|---|
| **插件** | 轮次状态机、连续干净计数、**自动跑命令类检查**（测试 / lint / audit）、判定放行、通知用户 |
| **AI** | 代码审查、构建 / 运行验证、一致性检查，以及**真正的修复动作** |

插件是纯 JS，它没法「理解」代码审查发现的问题并动手修 —— 那是 AI 的活。
插件做的是**纪律**：计数、拦截、放行、报告。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:491-518](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L491-L518)

定义并注册 wrapup_check 模型工具，提示调用顺序。

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.inject(['tools'], (toolsCtx) => {
    const tools = toolsCtx.get('tools')
    if (tools === undefined || tools === null) return

    const definition = {
      name: TOOL_NAME,
      description: [
        '收尾自检哨兵：任务做得差不多时调用它，进入「全面检查 → 发现问题 → 修复 → 再全面检查」的循环，',
        '直到连续 ' + DRY_ROUNDS + ' 轮全面检查都没有发现任何问题，才判定收尾完成并通知用户。',
        '',
        '用法（严格按顺序）：',
        '1. action="start" —— 开始收尾，重置计数。',
        '2. action="check" —— 插件自动跑项目里的测试 / lint / audit，把原始输出返回给你。',
        '3. 你自己再完成另外三类：代码审查、构建/运行验证、一致性检查。',
        '4. action="report" —— 如实汇报本轮发现的问题（problems），并声明你做了哪几类检查（checks）。',
        '   只要还有未修复的问题，插件会打回；有修复动作的轮次不计入「连续干净」，计数归零。',
        '5. 重复 2~4。**只有连续 ' + DRY_ROUNDS + ' 轮 problems 为空数组**才放行，届时会通知用户。',
        '',
        '诚实是硬要求：不要把没跑的命令说成跑了，不要把没修的问题标成已修。',
        '这个工具的全部价值，就是拦住「差不多可以了」。',
      ].join('\n'),
      parameters: TOOL_PARAMETERS,
      output: {
        schema: TOOL_OUTPUT_SCHEMA,
        render: (_args, value) => [{ type: 'text', text: value.message }],
      },

      async execute(args, exec) {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:751-768](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L751-L768)

安装系统提示段以鼓励模型在交付前调用。

<details>
<summary>查看原文（18行）</summary>

```text
  /* ---------- 给模型的一段系统提示（让它知道该在什么时候用） ---------- */
  ctx.inject(['systemPrompt'], (promptCtx) => {
    const prompt = promptCtx.get('systemPrompt')
    if (prompt === undefined || prompt === null) return
    const text = [
      '## 收尾自检（wrapup_check）',
      '当你认为一件开发任务已经做完、准备交付时，**先调用 `' + TOOL_NAME + '` 跑收尾自检**，不要直接说「搞定了」。',
      '流程：`action="start"` → `action="check"`（插件自动跑测试/lint/audit）→ 自己完成代码审查、构建验证、一致性检查 ' +
        '→ `action="report"` 如实汇报（有未修复的问题会被打回；有修复动作的轮次不计入「连续干净」）。',
      '规则：**连续 ' + DRY_ROUNDS + ' 轮全面检查零问题**才算收尾完成，届时会通知用户。',
      '不要在没跑的情况下宣称检查通过；不要为了尽快通过而漏报问题。',
    ].join('\n')
    promptCtx.effect(
      () => prompt.section({ name: 'wrapup-guard', order: 155, text }),
      'dsh-wrapup-guard: prompt section',
    )
  })
}
```

</details>

**依据 4 · 源码核查**：[client/client.js:132-145](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/client/client.js#L132-L145)

浏览器端轮询路由并以完成时间和 sessionId 去重。

<details>
<summary>查看原文（14行）</summary>

```text
    async function poll() {
      try {
        const res = await fetch(ROUTE, { headers: { accept: 'application/json' }, cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const record = data !== null && typeof data === 'object' ? data.latest : null
        if (record === null || record === undefined) return
        const key = String(record.finishedAt || '') + '|' + String(record.sessionId || '')
        if (key === lastSeen) return
        lastSeen = key
        showCard(record)
      } catch {
        /* 宿主还没就绪或页面正在卸载：下一轮再试 */
      }
```

</details>

#### 缺口

- 未在真实 DSH 会话内验证调用时机和用户是否遵循提示。
  **影响**：不能把提示视为强制交付门槛。
  **进一步探讨**：用隔离任务记录模型未调用工具时能否照常交付，以及用户看到的完整检查证据。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动命令和连续三轮怎样实现？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

detectCommands 只识别 package.json 中 test/lint/typecheck/check 四种非空脚本，以及 tools/audit.js、tools/check.js、tools/selftest.mjs 存在的文件；依次通过 npm run 或 node 启动，不分析命令内容。因此“白名单”限制的是脚本名称，并不保证脚本无副作用，项目自己的 check 可以做任意事。每条命令顺序执行，180 秒超时；Windows 经 cmd.exe 启动并用 taskkill 杀树，非 Windows 只 kill 直接子进程。输出在完成时截到尾部 24000 字符，但收集期间 stdout/stderr 都无长度上限，长日志仍可积累内存。状态以 sessionId 文件持久化，start 清零，report 中未修复或本轮修复的问题清零，空 problems 则 dryStreak 加一，到三触发 fixed-point 和通知。这个状态机能记账，却没有把外部命令运行证据绑定到 report。state 保存失败被吞掉，注释声称内存更新，但每次 execute 都重新 loadState，没有持续会话内存状态作为退路。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:65-110](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L65-L110)

固定脚本名和文件名探测及执行顺序。

<details>
<summary>查看原文（46行）</summary>

```text
/**
 * 从项目根探测应该跑哪些命令。
 *
 * 只做「读文件 + 看存在性」，绝不猜：package.json 里有 script 才跑，有对应
 * 的检查脚本文件才跑。探测不到任何命令时返回空数组 —— 那是合法结果，说明
 * 这个项目的命令类检查要靠 AI 手动完成，不是错误。
 *
 * 注意「只认白名单」的取舍：本插件自己用的就是 `npm run check` +
 * `tools/selftest.mjs`，而旧白名单只认 test/lint/typecheck，导致它连自己的
 * 仓库都检查不了（恒报「没有可自动运行的检查」）。所以 `check` 与
 * `tools/selftest.mjs` 也纳入白名单 —— 它们同样是约定俗成的检查名，
 * 不是靠猜脚本内容。
 */
const NPM_CHECK_SCRIPTS = ['test', 'lint', 'typecheck', 'check']
const TOOL_CHECK_FILES = ['tools/audit.js', 'tools/check.js', 'tools/selftest.mjs']

function detectCommands(cwd) {
  const out = []
  const pkgPath = join(cwd, 'package.json')

  if (existsSync(pkgPath)) {
    let pkg
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    } catch {
      pkg = null
    }
    const scripts = pkg !== null && pkg !== undefined && typeof pkg.scripts === 'object' && pkg.scripts !== null
      ? pkg.scripts
      : {}
    // 只认这些约定俗成的脚本名，顺序即优先级。
    for (const key of NPM_CHECK_SCRIPTS) {
      if (typeof scripts[key] === 'string' && scripts[key].trim() !== '') {
        out.push({ id: 'npm:' + key, cmd: 'npm', args: ['run', key], source: 'package.json scripts.' + key })
      }
    }
  }

  // 项目自带的静态检查脚本（这个工作区的项目就是这么组织的）。
  for (const rel of TOOL_CHECK_FILES) {
    if (existsSync(join(cwd, rel))) {
      out.push({ id: 'node:' + rel, cmd: 'node', args: [rel], source: rel })
    }
  }

  return out
```

</details>

**依据 2 · 源码核查**：[lib/index.js:122-151](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L122-L151)

Windows cmd.exe 与 taskkill、非 Windows 子进程 kill 分支。

<details>
<summary>查看原文（30行）</summary>

```text
function buildSpawnSpec(spec) {
  if (process.platform !== 'win32') {
    return { cmd: spec.cmd, args: spec.args, shell: false }
  }
  // 只在**确实需要**时加引号：给每个 token 都套引号会让 cmd 把
  // `""npm" "run""` 当成一个整体命令名，反而报「不是内部或外部命令」。
  const quote = (s) => {
    const text = String(s)
    return /[\s&|<>^()"]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text
  }
  const line = [spec.cmd, ...spec.args].map(quote).join(' ')
  return { cmd: 'cmd.exe', args: ['/d', '/s', '/c', line], shell: false }
}

/**
 * 杀掉一整棵进程树。
 *
 * Windows 上没有进程组可以一次性收拾：npm → cmd.exe → node 是一条链，
 * `child.kill()` 只放倒第一环。必须用 `taskkill /T /F` 连子孙一起带走，
 * 否则孙进程会继续持有 stdout 管道，'close' 迟迟不触发。
 */
function killTree(child) {
  if (child === undefined || child === null || child.pid === undefined) return
  if (process.platform === 'win32') {
    try {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true })
    } catch { /* 尽力而为 */ }
    return
  }
  try { child.kill('SIGKILL') } catch { /* 进程可能已经退出 */ }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:193-255](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L193-L255)

输出字符串持续累积、完成时裁剪、180秒超时与兜底。

<details>
<summary>查看原文（63行）</summary>

```text
    let stdout = ''
    let stderr = ''
    let timedOut = false

    // 结果构造器必须在**任何**定时器之前定义：超时兜底路径会调用它，
    // 而定时器最早在下一轮宏任务才触发 —— 虽然实际上不会撞上 TDZ，
    // 但把定义提到使用点之前，才是这段代码能自证正确的前提。
    const buildResult = ({ code, timedOut: to, errorText }) => {
      const tail = (text) => (text.length <= MAX_OUTPUT_CHARS ? text : '…(截断)\n' + text.slice(-MAX_OUTPUT_CHARS))
      if (errorText !== undefined) {
        return {
          id: spec.id,
          command: spec.cmd + ' ' + spec.args.join(' '),
          source: spec.source,
          ok: false,
          exitCode: typeof code === 'number' ? code : null,
          timedOut: false,
          ms: Date.now() - started,
          output: errorText,
        }
      }
      const body = stdout + (stderr ? (stdout ? '\n' : '') + stderr : '')
      return {
        id: spec.id,
        command: spec.cmd + ' ' + spec.args.join(' '),
        source: spec.source,
        ok: !to && code === 0,
        exitCode: typeof code === 'number' ? code : null,
        timedOut: to,
        ms: Date.now() - started,
        output: to
          ? '命令超时（超过 ' + Math.round(CMD_TIMEOUT_MS / 1000) + ' 秒）被杀掉。\n' + tail(body)
          : tail(body),
      }
    }

    // Windows 上我们跑的是 cmd.exe，npm 又是它的子进程：只 kill cmd.exe 会留下
    // 孙进程继续持有 stdout 管道，'close' 得等孙进程自己结束才触发 —— 超时就形同
    // 虚设（实测 2 秒超时拖到 60 秒才返回）。所以超时要连整棵进程树一起杀。
    let killTimer = null
    const timer = setTimeout(() => {
      timedOut = true
      killTree(child)
      // 兜底：树杀之后管道若仍被别处持有，最多再等 5 秒就强制收尾。
      killTimer = setTimeout(() => {
        finish(buildResult({ code: null, timedOut: true }))
      }, 5_000)
    }, CMD_TIMEOUT_MS)

    child.stdout?.on('data', (d) => { stdout += d.toString('utf8') })
    child.stderr?.on('data', (d) => { stderr += d.toString('utf8') })

    child.on('error', (err) => {
      clearTimeout(timer)
      if (killTimer !== null) clearTimeout(killTimer)
      const text = '执行出错：' + String((err && err.message) || err)
      finish(buildResult({ code: null, timedOut: false, errorText: text }))
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      if (killTimer !== null) clearTimeout(killTimer)
      finish(buildResult({ code, timedOut }))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:304-325](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L304-L325)

状态每次读盘，写盘异常静默吞掉。

<details>
<summary>查看原文（22行）</summary>

```text
function loadState(sessionId) {
  try {
    const raw = readFileSync(statePath(sessionId), 'utf8')
    const data = JSON.parse(raw)
    if (data === null || typeof data !== 'object' || Array.isArray(data)) return emptyState()
    const base = emptyState()
    return { ...base, ...data, history: Array.isArray(data.history) ? data.history : [] }
  } catch {
    return emptyState()
  }
}

function saveState(sessionId, state) {
  const file = statePath(sessionId)
  try {
    mkdirSync(dirname(file), { recursive: true })
    const tmp = file + '.tmp-' + process.pid
    writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8')
    renameSync(tmp, file)
  } catch {
    /* 落盘失败不该让工具调用失败：状态在内存里也已经更新了 */
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:637-724](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L637-L724)

report 轮次、清零、三轮通过与通知。

<details>
<summary>查看原文（88行）</summary>

```text
          state.round += 1
          const entry = {
            round: state.round,
            problemCount: problems.length,
            fixedCount: problems.filter((p) => p !== null && typeof p === 'object' && p.fixed === true).length,
            unfixedCount: unfixed.length,
            summary: typeof input.summary === 'string' ? input.summary : '',
            declaredChecks: [...declaredSet],
            at: new Date().toISOString(),
          }

          // —— 拦住：有问题没修 ——
          if (unfixed.length > 0) {
            state.dryStreak = 0
            entry.outcome = 'blocked-unfixed'
            state.history.push(entry)
            const detail = unfixed
              .map((p, i) => {
                const item = p !== null && typeof p === 'object' ? p : {}
                const where = typeof item.where === 'string' && item.where !== '' ? item.where + '：' : ''
                const what = typeof item.what === 'string' ? item.what : '（未描述）'
                return '  ' + (i + 1) + '. ' + where + what
              })
              .join('\n')
            return snapshot(
              'continue',
              '打回：第 ' + state.round + ' 轮还有 ' + unfixed.length + ' 个问题没有修复，不能算干净（连续计数已归零）。' +
                '\n未修复的问题：\n' + detail +
                '\n\n请逐个修掉，然后**重新做一次全面检查**再 report。',
              { missingKinds },
            )
          }

          // —— 拦住：不干净（有已修问题）——
          if (problems.length > 0) {
            state.dryStreak = 0
            entry.outcome = 'blocked-dirty'
            state.history.push(entry)
            return snapshot(
              'continue',
              '第 ' + state.round + ' 轮修复了 ' + entry.fixedCount + ' 个问题，所以这一轮不算干净（连续计数归零）。' +
                '\n继续：再做一次**全面检查**（check + 三类人工检查），确认没有新问题、旧问题也没复发，然后 report。',
              { missingKinds },
            )
          }

          // —— 干净的一轮 ——
          state.dryStreak += 1
          entry.outcome = 'clean'
          entry.missingKinds = missingKinds
          state.history.push(entry)

          if (state.dryStreak >= DRY_ROUNDS) {
            state.active = false
            state.completedAt = new Date().toISOString()
            const fixedTotal = state.history.reduce((n, h) => n + (h.fixedCount || 0), 0)
            const problemsTotal = state.history.reduce((n, h) => n + (h.problemCount || 0), 0)
            const okLines = state.history
              .filter((h) => h.outcome === 'clean')
              .map((h) => '  · 第 ' + h.round + ' 轮：零问题')
              .join('\n')
            const fixLines = state.history
              .filter((h) => (h.fixedCount || 0) > 0)
              .map((h) => '  · 第 ' + h.round + ' 轮：修了 ' + h.fixedCount + ' 个 —— ' + clip(h.summary, 200))
              .join('\n')
            const report =
              '✅ 收尾自检通过：连续 ' + DRY_ROUNDS + ' 轮全面检查零问题。\n' +
              '（共 ' + state.round + ' 轮，累计发现 ' + problemsTotal + ' 个问题、修复 ' + fixedTotal + ' 个）' +
              (fixLines !== '' ? '\n\n修复记录：\n' + fixLines : '') +
              (okLines !== '' ? '\n\n放行的三轮：\n' + okLines : '')

            if (!state.notified) {
              state.notified = true
              const record = {
                sessionId,
                cwd,
                rounds: state.round,
                problemsTotal,
                fixedTotal,
                report,
                finishedAt: state.completedAt,
              }
              latest = record
              notify(sessionId, record)
            }

            return snapshot('fixed-point', report + '\n\n可以把上面的报告转述给用户，任务收尾完成。', {
              missingKinds: [],
```

</details>

#### 缺口

- 未在 Windows/Linux 下执行超时、多层子进程与长输出压力测试。
  **影响**：无法量化进程清理、内存或超时真实边界。
  **进一步探讨**：使用隔离假项目模拟长日志、孙进程和写盘错误，核系统资源及实际返回。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “强制全面检查”是否真能保证检查发生？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。report 仅要求 problems 为数组；并未要求本轮先调用 check。check 的结果只随该次工具返回，不进入 state 或 report 的判定。report 对人工检查只计算 missingKinds，干净轮即使三类全缺仍加 dryStreak；第三轮达到阈值时直接返回 fixed-point 且 missingKinds 被写为 []，此前的缺项提示不构成拒绝。因此连续三次 report({problems:[]}) 从静态控制流即可放行，即便没有一次自动命令或人工检查。check 发现失败时仅给模型文字提醒，模型如漏报/误报会被计作干净。README 中“强制”“全面”“只有连续三轮全面检查”是作者意图而非程序保证；工具能约束如实上报的问题计数，却不能证实没有未上报的问题。还要区分：本轮没有执行目标代码，此处是固定源码的控制流结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-28](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/README.md#L3-L28)

作者描述强制全面检查、三轮零问题后完成。

<details>
<summary>查看原文（26行）</summary>

````text
> **EN** — A DeepSeek Harness plugin that turns "task finished" into a gate:
> it enforces a **check → fix → re-check** loop, auto-runs your command-class
> checks, **blocks any round that still has unfixed problems**, and only calls
> the task done after **three consecutive clean full checks** — then notifies the user.
> Built to stop the "good enough" hand-off.

一个 DeepSeek Harness 插件：**在任务收尾时强制「检查 → 修复 → 再检查」的循环，
直到连续三次全面检查都没有发现问题，才判定收尾完成并通知用户。**

它的存在意义只有一个：**拦住「差不多可以了」。**

---

## 它解决什么问题

AI 干完活常说「改好了」，但没跑测试、没看有没有引入回归、没核对文档。
这个插件把「收尾」变成一个有门槛的动作：

```
全面检查 → 发现问题 → 修复 → 再全面检查 → …
        ↑__________________________|
  直到连续 3 轮零问题 → 通知用户「收尾完成」
```

**只要有未修复的问题就必然被打回**；哪怕这轮只是修了个小 bug，也**不算干净**
（计数归零）。这样才不会被「边查边修、修完就说好了」糊弄过去。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:583-609](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L583-L609)

check 结果作为工具响应返回，未记录在 state。

<details>
<summary>查看原文（27行）</summary>

```text
        /* ---------- check：自动跑命令 ---------- */
        if (action === 'check') {
          if (!state.active) {
            return snapshot('idle', '收尾自检还没开始。请先 action="start"。')
          }
          const { specs, results } = await runAllCommands(cwd)
          if (specs.length === 0) {
            return snapshot(
              'continue',
              '没有可自动运行的命令类检查（未发现 package.json 的 test/lint/typecheck，也没有 tools/audit.js、tools/check.js）。' +
                '\n请你自己手动完成这一类检查，再和其它三类一起 report。',
            )
          }
          const failed = results.filter((r) => !r.ok)
          const lines = results.map((r) => {
            const head = (r.ok ? '✓' : r.timedOut ? '⏱ 超时' : '✗ 失败') + '  ' + r.command + '  (' + r.ms + 'ms' + (r.exitCode !== null ? ', exit ' + r.exitCode : '') + ')'
            const body = r.ok ? clip(r.output, 400) : clip(r.output, 3000)
            return head + '\n' + (body === '' ? '（无输出）' : body.replace(/\n/g, '\n  '))
          })
          const tail = failed.length === 0
            ? '\n\n命令类检查全部通过。请继续完成代码审查 / 构建验证 / 一致性检查，然后 action="report"。'
            : '\n\n有 ' + failed.length + ' 条命令失败——这些都算「本轮发现的问题」，修好之前不要 report 成干净。'
          return snapshot(
            'continue',
            '自动检查结果（' + results.length + ' 条）：\n' + lines.join('\n\n') + tail,
            { commands: results },
          )
```

</details>

**依据 3 · 源码核查**：[lib/index.js:612-630](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L612-L630)

report 只要求 problems 数组；manual checks 缺项仅生成 missingKinds。

<details>
<summary>查看原文（19行）</summary>

```text
        /* ---------- report：汇报本轮结论 ---------- */
        if (action === 'report') {
          if (!state.active) {
            return snapshot('idle', '收尾自检还没开始。请先 action="start"。')
          }

          const problems = Array.isArray(input.problems) ? input.problems : null
          if (problems === null) {
            return snapshot(
              'continue',
              'report 必须带上 problems 数组（本轮全面检查发现的问题；完全干净就传空数组 []）。' +
                '空数组才是唯一的「干净」信号——缺参数不等于干净。',
            )
          }

          const declared = Array.isArray(input.checks) ? input.checks : []
          const declaredSet = new Set(declared.filter((k) => typeof k === 'string'))
          // 「命令类」只要跑过 check 就算做了；这里只校验三类人工检查有没有声明。
          const missingKinds = ['review', 'build', 'consistency'].filter((k) => !declaredSet.has(k))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:683-741](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L683-L741)

缺人工检查的干净轮仍累加，到第三轮照常 fixed-point。

<details>
<summary>查看原文（59行）</summary>

```text
          // —— 干净的一轮 ——
          state.dryStreak += 1
          entry.outcome = 'clean'
          entry.missingKinds = missingKinds
          state.history.push(entry)

          if (state.dryStreak >= DRY_ROUNDS) {
            state.active = false
            state.completedAt = new Date().toISOString()
            const fixedTotal = state.history.reduce((n, h) => n + (h.fixedCount || 0), 0)
            const problemsTotal = state.history.reduce((n, h) => n + (h.problemCount || 0), 0)
            const okLines = state.history
              .filter((h) => h.outcome === 'clean')
              .map((h) => '  · 第 ' + h.round + ' 轮：零问题')
              .join('\n')
            const fixLines = state.history
              .filter((h) => (h.fixedCount || 0) > 0)
              .map((h) => '  · 第 ' + h.round + ' 轮：修了 ' + h.fixedCount + ' 个 —— ' + clip(h.summary, 200))
              .join('\n')
            const report =
              '✅ 收尾自检通过：连续 ' + DRY_ROUNDS + ' 轮全面检查零问题。\n' +
              '（共 ' + state.round + ' 轮，累计发现 ' + problemsTotal + ' 个问题、修复 ' + fixedTotal + ' 个）' +
              (fixLines !== '' ? '\n\n修复记录：\n' + fixLines : '') +
              (okLines !== '' ? '\n\n放行的三轮：\n' + okLines : '')

            if (!state.notified) {
              state.notified = true
              const record = {
                sessionId,
                cwd,
                rounds: state.round,
                problemsTotal,
                fixedTotal,
                report,
                finishedAt: state.completedAt,
              }
              latest = record
              notify(sessionId, record)
            }

            return snapshot('fixed-point', report + '\n\n可以把上面的报告转述给用户，任务收尾完成。', {
              missingKinds: [],
            })
          }

          const remaining = DRY_ROUNDS - state.dryStreak
          const warn =
            missingKinds.length > 0
              ? '\n\n注意：你声明的手动检查里缺少 ' + missingKinds.map((k) => CHECK_KINDS.find((c) => c.id === k).label).join('、') +
                '。空 problems 只有在**四类检查都做了**的前提下才算数——下次请补齐（或明确说明为什么这一类不适用）。'
              : ''
          return snapshot(
            'continue',
            '第 ' + state.round + ' 轮零问题，连续干净 ' + state.dryStreak + ' / ' + DRY_ROUNDS + '（还差 ' + remaining + ' 轮）。' +
              warn +
              '\n\n下一轮：再完整跑一遍全部四类检查（不要只看刚才改的地方），确认没有新的问题，然后 report。' +
              (warn !== '' ? '' : ''),
            { missingKinds },
          )
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 通知、多会话和采用成本边界是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

客户端每四秒轮询统一 status 路由；宿主内存仅存最近一次 latest，无用户/会话筛选，路由返回这个记录。页面拿到新 finishedAt|sessionId 即显示报告卡片。若同宿主多个会话或用户并行，静态设计上会把最近完成报告给能访问这条路由的浏览器；报告包含 sessionId、cwd 和任务汇总，是否形成跨用户可见性要看 DSH Web 路由的认证和隔离，本轮未验。latest 不持久化，宿主重启后浏览器不能通过路由恢复旧通知，README 的“刷新页面自愈”只在宿主仍保有 latest 时成立。采用需安装 profile 包、重启、接受插件自动运行项目内脚本的副作用和最长每条180秒×每轮命令数×至少三轮的时间成本；命令通过本身不等于业务验收。当前建议仅在隔离项目试用，不能将固定版本当审计级质量门。可改进但本版未实现：每轮生成不可伪造的 check 记录和检查项完成记录，report 需引用同轮结果且失败阻断；对会话/用户隔离通知、显式展示未通过证据。最小验证用有失败脚本与两个会话的临时项目，对比漏 check、漏手工类别、失败后空 report 和路由可见性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:445-489](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L445-L489)

全局 latest 和不带会话筛选的 GET 路由。

<details>
<summary>查看原文（45行）</summary>

```text
export function apply(ctx) {
  /** 最近一次完成的收尾记录，供浏览器端轮询展示。 */
  let latest = null

  const notify = (sessionId, payload) => {
    try {
      ctx.emit('wrapup-guard/completed', { sessionId, ...payload })
    } catch {
      /* 没有监听者（例如非 Web 前端）时静默即可；工具返回值里也有完整报告 */
    }
  }

  /* ---------- 浏览器端轮询用的只读路由 ---------- */
  //
  // 一次收尾完成就写一次 `latest`；客户端 `fetch` 它并弹出通知。这样刷新页面
  // 也能看到最近一次结果，不需要持久订阅。
  ctx.inject(['webServer'], (hostCtx) => {
    const server = hostCtx.webServer
    if (server === undefined || server === null || typeof server.register !== 'function') return
    hostCtx.effect(
      () =>
        server.register({
          kind: 'exact',
          path: '/dsh-wrapup-guard/status',
          handler: (request, response) => {
            if (request !== undefined && request !== null && request.method !== 'GET' &&
                request.method !== undefined && request.method !== null) {
              try { response.writeHead(405, { allow: 'GET' }); response.end() } catch { /* ignore */ }
              return
            }
            const body = JSON.stringify({ latest })
            try {
              response.writeHead(200, {
                'content-type': 'application/json; charset=utf-8',
                'cache-control': 'no-store',
              })
              response.end(body)
            } catch {
              /* 路由失败不该影响工具本身 */
            }
          },
        }),
      'dsh-wrapup-guard: status route',
    )
  })
```

</details>

**依据 2 · 源码核查**：[client/client.js:132-145](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/client/client.js#L132-L145)

轮询与显示去重的实际键。

<details>
<summary>查看原文（14行）</summary>

```text
    async function poll() {
      try {
        const res = await fetch(ROUTE, { headers: { accept: 'application/json' }, cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const record = data !== null && typeof data === 'object' ? data.latest : null
        if (record === null || record === undefined) return
        const key = String(record.finishedAt || '') + '|' + String(record.sessionId || '')
        if (key === lastSeen) return
        lastSeen = key
        showCard(record)
      } catch {
        /* 宿主还没就绪或页面正在卸载：下一轮再试 */
      }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:24-29](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/lib/index.js#L24-L29)

三轮阈值、单命令180秒超时。

```text
/** 连续这么多轮「全面检查无问题」才算收尾完成。用户要求的是三次。 */
const DRY_ROUNDS = 3
/** 单条检查命令的超时（毫秒）。足够跑完一次测试，又不至于挂死。 */
const CMD_TIMEOUT_MS = 180_000
/** 捕获输出上限，避免一条刷屏的日志把内存吃光。 */
const MAX_OUTPUT_CHARS = 24_000
```

**依据 4 · 作者声明**：[README.md:100-139](https://github.com/566001/dsh-wrapup-guard/blob/99734eba9a8d8cd4c3d3701c0de4eaf7586d9ff2/README.md#L100-L139)

作者通知、安装和重启说明。

<details>
<summary>查看原文（40行）</summary>

````text
## 通知

达到「连续 3 轮零问题」时：

- 宿主端写一份完成记录，并通过 `/dsh-wrapup-guard/status` 暴露给浏览器端；
- 浏览器端轮询这个路由，右下角弹出**完成卡片**（含汇总：共几轮、修了几个问题、
  完整报告），12 秒后自动收成小徽章，点开可再看；
- 工具返回值里同时带完整报告，AI 会把它转述给用户。

---

## 安装

```jsonc
// profiles/<profile>/package.json
{
  "dependencies": {
    "dsh-wrapup-guard": "^0.1.0"
  },
  "dsh": {
    "profile": {
      "bundles": ["…", "dsh-wrapup-guard"]
    }
  }
}
```

> 本地开发时依赖可写 `file:/absolute/path/to/dsh-wrapup-guard`；
> 从 npm 安装则直接写版本号。

然后在该 profile 目录用 DSH 自带的 pnpm 安装：

```bash
node <DSH>/resources/runtime/pnpm/bin/pnpm.cjs install --no-frozen-lockfile
```

> `file:` 依赖会被**复制**进 profile 的 `node_modules`，所以改了源码之后要重跑
> install 才能在 DSH 里生效。

**改完需要重启 DSH**（插件行的加载在启动时完成）。
````

</details>

#### 缺口

- 真实 DSH Web 路由的认证、profile/会话隔离未验证。
  **影响**：不能断言跨用户泄露或通知一定可见。
  **进一步探讨**：在两个隔离会话和不同用户访问同一路由，记录响应与卡片归属。
- 强制同轮检查记录与路由会话隔离尚未实现。
  **影响**：属于改进方案，不可算现有能力。
  **进一步探讨**：实现原型后以漏 check、失败、长日志、重启矩阵对照误放行与额外耗时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
