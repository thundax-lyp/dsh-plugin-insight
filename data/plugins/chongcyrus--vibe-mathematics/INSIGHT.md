# Vibe Mathematics

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[92bc6d9](https://github.com/ChongCyrus/Vibe-Mathematics/tree/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChongCyrus/Vibe-Mathematics)
<!-- END META -->

> **功能**：为 DSH 提供多代理数学研究预设，支持任务、表决和形式化检查。

> **亮点**：把多代理研究的策略放进可替换的 pack，并保留可回读的作业和定论凭据。运行规则和宿主预设分开。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

> **主要限制**：Lean 作业通过、定义符合原题和 Verified 入轨是不同状态。共享状态的锁也会在有界等待后退化。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 这个版本安装后实际出现哪些预设？](#detail-section-11)
  - [Q02 · 研究策略如何挂入，状态如何保留？](#detail-section-12)
  - [Q03 · Lean 通过、忠实性与 Verified 分别证明什么？](#detail-section-13)
  - [Q04 · 何种研究任务适合小范围采用？](#detail-section-14)
  - [Q05 · 怎样判断证明回执是否减少错误定论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用 DSH 探索数学命题的研究者可以组织分工，留下审查、编译和定论的轨迹。

使用单 Agent、手工证明档案和独立 Lean 可以完成基本研究和核验。VMU 提供多代理协作和证据轨道，人工仍需判断命题是否忠实。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 研究预设 | 在 DSH 挂载 VMU | 默认策略需另配 |
| 形式化 | 检查 Lean 作业并保留回执 | 依工具链，需独立审核命题 |
| 定论轨道 | 保存决定和来源 | 证据等级依实际路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与实际安装包 | 必需 | 载入预设及宿主工具 | 检查配置及宿主日志 |
| 明确策略 pack | 自动研究组织需要 | 装配工作规则和角色 | 默认只提供框架能力 |
| 可写工作根 | 状态需要 | 持久化流程 | 查写入回执和恢复 |
| Lean 与宿主执行能力 | 形式化路径需要 | 运行编译 | 不将缺回执算通过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 研究者核对包、预设与 pack | 确认实际加载和角色 |
| 2 | 研究者以已知小定理检查编译与裁定 | 分别核对源文件、回执和忠实性 |
| 3 | 研究者独立重跑与审阅 | 不符就保留草稿并退出 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、模型和工具链资源，费用未知 | 检查预设与 Lean | 配置时间未知 |
| 持续 | 多代理请求、编译和状态存储，金额未知 | 审阅命题、定义与回执 | 每份合格结论用量未知 |
| 失败恢复 | 重跑资源未知 | 回读状态、独立复核 | 锁和重启需要单独检查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 协同研究 | 策略配置与持久状态分离 | 分工是否提高解题质量 |
| 编译核查 | 退出码、文件哈希、去重回执 | 真环境兼容与复杂证明效果 |
| 定论追溯 | 区分辩论、文献和形式化凭据 | 真实性和独立可复现率 |

> **思考**：Lean 作业通过、定义符合原题和 Verified 入轨是不同状态。共享状态的锁也会在有界等待后退化。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多代理研究的策略放进可替换的 pack，并保留可回读的作业和定论凭据。运行规则和宿主预设分开。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

预设、pack、宿主工具与独立状态有清晰入口。写入锁可退化，编译成功与记录裁定也需按不同接口解读。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Lean 作业通过、定义符合原题和 Verified 入轨是不同状态。共享状态的锁也会在有界等待后退化。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察配置和证据链，只用已知题核对所有步骤。任何定论都由研究者独立复核，缺回执或状态不一致时回原证明档案。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 VMU 接线、策略加载和不同证据状态。真实工具链、工作流收益与可复跑清单待验。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、docs-landed/00-README.md、docs/DEPRECATED-LEGACY-PRESETS.md、installer.js、package.json、preset-declaration.js、vibe-math-vmu/kernel/formal.js、vibe-math-vmu/kernel/lean.js、vibe-math-vmu/kernel/store.js、vibe-math-vmu/packs/v5r/tools.js、vibe-math-vmu/packs/v5r/verification-gates.js、vibe-math-vmu/packs/v5r/verified.js、vibe-math-vmu/vibe-math-vmu.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根 bundle、VMU 预设、代表性 v5r 定论与 Lean 路径。未检查全部 pack、外部脚本和宿主权限。
- 下一步：固定包、模型、宿主和 Lean 工具链，用已知命题、故障注入及独立审稿比较。

**分析版本**

- **仓库**：[ChongCyrus/Vibe-Mathematics](https://github.com/ChongCyrus/Vibe-Mathematics)
- **版本号**：2.8.5（[固定提交 92bc6d9](https://github.com/ChongCyrus/Vibe-Mathematics/tree/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将原题、构建回执、忠实性判断和最终结论合成可复跑清单，可能减少不完整证明被误标。按合格结论和审阅时间做对照。见 [Q05](#research-q05)。

固定包、模型、宿主和 Lean 工具链，用已知命题、故障注入及独立审稿比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 559 | 152268 | — | — | 3884227 |
| .js | source | 248 | 157420 | 111534 | 42799 | — |
| .mjs | source | 83 | 28253 | 20739 | 6246 | — |
| .mjs | test | 904 | 216315 | 168472 | 36467 | — |
| .mjs | example | 1 | 32 | 20 | 9 | — |
| .js | example | 3 | 1754 | 1370 | 322 | — |
| .md | test | 1 | 41 | — | — | 412 |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/ChongCyrus/Vibe-Mathematics/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ChongCyrus/Vibe-Mathematics/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ChongCyrus/Vibe-Mathematics/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：数学研究者在 DSH 中采用 VMU 时，怎样确认预设和策略真正加载，并区分机器检查、研究定论与恢复状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个版本安装后实际出现哪些预设？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

需要分工探索命题、评审证明尝试并保存过程的 DSH 用户，可以通过该 bundle 使用 VMU。固定根包 dsh-vibe-math 声明 2.8.5 和 DSH patch。当前 patch 的安装器行后是 vmu overlay、vibe-math-vmu 和 vibe-math-vmu-member 组合行。它们加载同一框架，成员席有自己配置。注册模块在异步注册前合入 overlay，再调用宿主 agentPresets.register。安装器判断新宿主机制时检查 register 能力，识别到组合行就跳过目录同步。旧宿主目录清单的起始项是 VMU，整个清单只有这一个对象。README 仍宣称四个旧预设，弃用说明则记载转为 VMU 加 pack。应以当前 patch 和实际宿主选项为准。包清单还标记 private，不能仅根据 README 的安装命令断言此提交对应公开 npm 字节。试用前应确定安装工件和宿主读取的是同一份配置。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-17](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/package.json#L2-L17)

根包身份、版本、private 和入口。

<details>
<summary>查看原文（16行）</summary>

```text
  "name": "dsh-vibe-math",
  "private": true,
  "description": "Multi-agent mathematical problem-solving & verification frameworks for DeepSeek Harness — FOUR agent presets in one install: vibe-math-v2 (probability-driven, classic: qs.json + Propos knowledge base + explorer→solver→review/debate verdict), vibe-math-v3 (THIRD-generation, classic: paper-style Markdown knowledge base with Problems/Progress/Propos/Methods/Verified + planner-agent scheduling that decides the next N actions + universal theory/method invention library + agents write their own Markdown directly via a per-file write lock), and vibe-math-v4 (FOURTH-generation: persistent self-organizing resident subagents that message & meet to decide all tasks, verify only by unanimous consensus, /compact at a context threshold, and stop only when all agree the problem is solved), and vibe-math-v5 (FIFTH-generation research institute: an academician as the organizational centre who decomposes and ASSIGNS work and chairs meetings; permanent researchers who hold the vote and may hire/fire their own temp workers; temp workers with no vote; a group chat and meetings; a durable per-recipient mailbox; a compare-and-set task DAG; and a boolean m-vote consensus rule where an object enters Verified/ only when at least m voting members agree AND every one of them returns exactly 1 or exactly 0). Installing this bundle auto-installs all four presets (v1 was removed at v2.0.0). Each preset also writes a FINAL PAPER by default when its run concludes — and does so BEFORE the run is marked complete: on v4/v5 the team co-authors its parts, merges them, cross-reviews, and the editor named by paperEditor finalises; the output is Paper/<run or institute id>/{paper.md,paper.tex,paper.pdf when a LaTeX engine is detected,paper.meta.json,paper.log.md} (params finalPaper/paperFormat/paperLanguage/paperCompilePdf/paperLatexCommand, plus paperEditor on v4/v5; see docs/final-paper.md).",
  "version": "2.8.5",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.2-alpha.4 <0.1.3-0 || >=0.1.3-alpha.2 <0.1.5-0 || >=0.1.5-alpha.1 <0.1.6-0 || >=0.1.6-alpha.1 <0.1.7-0 || >=0.1.7-alpha.1 <0.2.0-0 || >=0.2.0-alpha.1 <0.3.0-0 || >=0.2.1-alpha.1 <0.3.0-0"
  },
  "main": "installer.js",
  "exports": {
    ".": "./installer.js",
    "./installer": "./installer.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./vibe-math-vmu/vibe-math-vmu.js": "./vibe-math-vmu/vibe-math-vmu.js",
    "./preset-declaration": "./preset-declaration.js"
```

</details>

**依据 2 · 源码核查**：[package.json:900-905](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/package.json#L900-L905)

实际 bundle 声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "minVersion": "0.1.2-alpha.4",
    "testedVersion": "0.2.1-rc.2",
```

**依据 3 · 源码核查**：[cordis.patch.yml:29-46](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/cordis.patch.yml#L29-L46)

安装器、overlay 与主预设。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: vibe-math-preset-installer
      name: dsh-vibe-math/installer

# ── Vibe Math Unify ──────────────────────────────────────────────────────────────
- insert:
    # U14: the overlay target. Empty config ⇒ zero mechanism; a deployment patches THIS row, never the preset row.
    - id: vibe-math-vmu-overlay
      name: dsh-vibe-math/preset-declaration
      config: {}
    - id: preset-vibe-math-vmu
      name: dsh-vibe-math/preset-declaration
      config:
        id: vibe-math-vmu
        name: "Vibe Math Unify"
        description: "统一框架式研究/数学 agent 预设（vmu）：本身只提供能力与挂点（会议、表决、任务、归档、提示词管线、耐久、计算与形式化、资源与安全、总线与扩展点），运行机制完全由 settings ＋ 中间件（声明式规则／代码模块／脚本与工作流／外部插件）＋ 整合包定义；默认零机制，机制以 pack 形式提供（首个为 v5r-pack）。"
        order: 25
        plugins:
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:256-265](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/cordis.patch.yml#L256-L265)

成员席声明。

<details>
<summary>查看原文（10行）</summary>

```text
# ── Vibe Math Unify · 成员席 ────────────────────────────────────────────────
- insert:
    - id: preset-vibe-math-vmu-member
      name: dsh-vibe-math/preset-declaration
      config:
        id: vibe-math-vmu-member
        name: "Vibe Math Unify · 成员席"
        description: "vmu 的「成员席」预设：与 vibe-math-vmu 同一套框架能力（会议/表决/任务/归档/提示词管线/计算与形式化/资源与安全），但去掉了六类宿主出口 —— shell（bash/pwsh）、后台作业、自我分派子代理、联网读网页、直接问用户、以及人类的 /goal 目标环。理由是可测量的：成员做研究用的是 pack 工具（实测一个成员会话 20/20 次全走 pack、零宿主调用），而 shell 才是那条让成员读到宿主 app.asar 的逃逸通道；计算走 vibe_vmu_bridge（内核校验请求、超时、结构化结果、具名拒），Lean 走 pack 的 lean 面，向用户提要求只走「报告所办」这一条规则通道。"
        order: 26
        packToolAllow:
```

</details>

**依据 5 · 源码核查**：[installer.js:53-58](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/installer.js#L53-L58)

当前目录同步清单的预设项。

```text
export const PRESETS = [
  {
    src: 'vibe-math-vmu',
    dst: 'vibe-math-vmu',
    // vmu is the framework-first preset (vibe-math-unify): the runtime files plus its complete
    // design document set (docs/00..14), so every mechanism it can express is traceable to a
```

**依据 6 · 源码核查**：[installer.js:283-288](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/installer.js#L283-L288)

通过宿主 register 能力判断。

```text
  try {
    const ap = (ctx && ctx.get) ? ctx.get('agentPresets') : undefined
    if (ap !== undefined) return typeof ap.register === 'function' ? 'rows' : 'directory'
  } catch (e) { /* no service to ask: the directory form */ }
  return 'directory'
}
```

**依据 7 · 源码核查**：[installer.js:539-559](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/installer.js#L539-L559)

组合行分支不写旧目录，日志仍有旧描述。

<details>
<summary>查看原文（21行）</summary>

```text
export async function apply(ctx) {
  const logger = ctx && ctx.logger
  try {
    const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
    const here = dirname(fileURLToPath(import.meta.url))
    const presetRoot = join(dshHome, '.agent-presets')
    const stateFile = join(presetRoot, STATE_FILE)

    // WHICH MECHANISM THIS HOST USES decides whether the directory work below means anything, so it
    // is decided (and reported) before anything is written. The host self-check runs here too.
    const host = await checkHostCapabilities(ctx, logger)
    if (host && host.mechanism === 'rows') {
      logger?.info?.('[dsh-vibe-math] preset 声明方式：本宿主以组合行声明 agent preset' +
        (host.dshVersion ? '（DSH v' + host.dshVersion + '）' : '') + '，本包随附的 cordis.patch.yml 已声明四个 preset（dsh-vibe-math/preset-declaration）；' +
        '跳过 ' + presetRoot + ' 目录同步（该目录自 DSH 0.1.7 起不再被读取）。')
      if (existsSync(stateFile)) {
        logger?.info?.('[dsh-vibe-math] 提示：' + presetRoot + ' 里还留着旧版 DSH（≤ 0.1.6）读取过的 preset 副本，' +
          '当前宿主不会再读它们，可以安全删除（要自定义 preset，请在预设选择器里复制一份，或改 profile 的 cordis.patch.yml）。')
      }
      return
    }
```

</details>

**依据 8 · 源码核查**：[preset-declaration.js:128-145](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/preset-declaration.js#L128-L145)

读取 overlay 并注册预设。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => {
    let dispose
    let retired = false
    Promise.resolve()
      // ★ U14 / THE EVALUATION-TIMING FIX (Lead's finding): the overlay must be read HERE, at REGISTER time, not when
      // this declaration is applied. Row order is not a contract the bundle controls (the preset row can be applied
      // before the overlay row), and an `applyOverlay` evaluated at apply time read an EMPTY overlay map - which is why
      // the first version merged nothing, and why an unmatched key produced no warning (an empty overlay has no keys to
      // test). Deferring the read to this microtask means every row of the layer has been applied by the time it runs.
      .then(() => presets.register(Object.assign({}, base, {
        plugins: applyOverlay(config.plugins, overlayForPreset(config.id), warn),
      })))
      .then((unregister) => {
        // Unregistering runs the preset's whole scope disposer, so it can reject. An unhandled
        // rejection terminates the process on Node >= 15: a teardown must never kill the host.
        if (retired) { Promise.resolve().then(() => unregister()).catch(() => {}); return }
        dispose = unregister
      })
```

</details>

**依据 9 · 作者声明**：[README.md:9-19](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/README.md#L9-L19)

作者 README 仍宣称四预设。

<details>
<summary>查看原文（11行）</summary>

```text
> 运行在 **DeepSeek Harness** 内的一组 **agent preset**（`vibe-math-v2` / `vibe-math-v3` / `vibe-math-v4` / `vibe-math-v5`），
> 用多代理协作自动求解数学问题并对结论做多代理交叉验证。四个预设共享「**断点续跑**、
> **中途人工干预**、**进度汇报**、**自然语言驱动**」底座能力，但采用四代不同的求解架构：
> **💡 v4/v5 优先**——`vibe-math-v4`（「常驻自组织合作研究」架构）与 `vibe-math-v5`（最新的「研究所体系」）是**当前主要维护方向**；`vibe-math-v2` 与 `vibe-math-v3` 是**经典/早期架构**，已**成熟定型**，今后只做**适配兼容**维护（新能力只进 v4/v5）。四套都随包安装、可正常使用；详见 [`docs/maintenance-policy.md`](docs/maintenance-policy.md)。根据你的实际需求自行选择（详见下方「怎么选」）。
>
> - **`vibe-math-v2`（概率驱动 · JSON 数据层）· 经典**：`qs.json` 问题清单 + `Propos/` 命题库 + 概率驱动调度 + 代码启发式调度；
> - **`vibe-math-v3`（第三代 · 论文式 md + 规划代理 + 方法库）· 经典**：全部知识以 **Markdown 论文/研究报告式** 存储与续写（`Problems/` 问题清单+依赖+来源动机、`Progress/` 研究日志、`Propos/` 命题库、`Methods/` 通用理论发明库、`Verified/` 绝对可信）；调度前由**规划代理**自主制定接下来 N 步计划；解决过程中发明的理论/框架/工具/方法/思想由 **Method Keeper** 沉淀为可复用方法体系（如发明群论、泛函分析那样）。
> - **`vibe-math-v4`（第四代 · 常驻自组织合作研究）🧪 实验性**：一组**持久化常驻子代理**互相**留言 + 开会**，自主决定一切任务安排（无中央调度）；各自沉淀进度/命题/方法/子问题库并互相查阅；验证**仅当全体常驻一致（真 或 假）**才写入 `Verified/`，否则留库附概率；上下文达阈值自动 `/compact`；仅当全体一致认为原问题已解决才停止。
> - **`vibe-math-v5`（第五代 · 研究所体系）🧪 实验性 · 最新**：把常驻升级为一座**研究所**——**院士**（领头人 / 组织与协调中心，负责拆解与**分派**、定优先级、主持会议、督导进度）+ **常驻研究员**（有表决权，可自主雇佣/解雇自己的临时工）+ **临时工**（无表决权）；有**公共规章**、**群聊与会议**、**compare-and-set 任务板**、**真实解雇**；**≥ m 票布尔一致**才写入 `Verified/`（反向票阻塞、弃权不计票、未达门槛留库附平均概率）；状态存于研究所目录下的**加固 JSON** `State/<研究所>.v5state.json`（串行写、读前必 load），**不写入宿主会话日志**，零 token 成本。

安装本插件包（或手动复制预设）后，DSH 的预设选择器里会出现**四个** agent preset。
```

</details>

**依据 10 · 作者声明**：[docs/DEPRECATED-LEGACY-PRESETS.md:10-30](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/docs/DEPRECATED-LEGACY-PRESETS.md#L10-L30)

作者记录旧 preset 退出和 pack 对应范围。

<details>
<summary>查看原文（21行）</summary>

```text
| `vibe-math-v2` | 概率驱动 + JSON 数据层的经典实现：`qs.json` 问题清单 + `Propos/` 命题库 + 概率调度 + 代码启发式。 |
| `vibe-math-v3` | 论文式 Markdown + 规划代理 + 方法库：`Problems/`、`Progress/`、`Propos/`、`Methods/`、`Verified/`。 |
| `vibe-math-v4` | 常驻自组织合作研究：常驻子代理互相留言/开会、自主分派，无中央调度。 |
| `vibe-math-v5` | 研究所体系：院士（chair）+ 常驻研究员（member）+ 临时工（temp），有会议/票箱/任务板/规章。 |
| `vibe-math-v5r` | v5 的重构预览，与 v5 并存做过 A/B 对照；本轮之后它成为 v5r pack 的历史来源。 |

## 2. 为什么弃用

- 框架已收敛为 **`vibe-math-vmu`（能力）＋ `vibe-math-vmu/packs/<id>`（机构/政策）**；
- 旧五个 preset 是“一个目录自带全部实现”的历史形态，继续随包发布会造成“装哪一个 / 读哪份文档”的歧义；
- 新机构应通过 **换 pack** 表达，而不是复制整个 preset 目录。

## 3. 现在分别对应哪个 pack

| 旧 preset | 对应的 vmu pack | 说明 |
|---|---|---|
| `vibe-math-v3` | **`vibe-math-vmu/packs/v3`** | 机制复刻包（周期调度→规划→数据面→方法库→验证→人工门）。 |
| `vibe-math-v4` | **`vibe-math-vmu/packs/v5r`**（最近的对应物） | 没有逐字节的 v4 复刻包；v4 的“常驻自组织”语义由 v5r 研究所包覆盖。 |
| `vibe-math-v5` | **`vibe-math-vmu/packs/v5r`** | v5r 是 v5 的重构预览，机制/机构语义一致。 |
| `vibe-math-v5r` | **`vibe-math-vmu/packs/v5r`** | 同一 pack 的直接来源。 |
| `vibe-math-v2` | **无直接对应 pack** | 概率驱动 + JSON 数据层没有在 vmu 中复刻；只保留历史源码供追溯。 |
```

</details>

#### 缺口

- 未核对发布渠道中的包字节和不同 DSH 宿主的实际选项。
  **影响**：不能把 README、版本号或配置声明当作已安装。
  **进一步探讨**：在隔离 profile 固定包与宿主后，读实际预设列表和加载日志。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 研究策略如何挂入，状态如何保留？

**研究主题**：贡献与相对优势、功能与机制、工程质量与复用

#### 完整回答

相比给若干代理分工并在对话里手工记录，VMU 把工具面、研究策略和状态分开。主预设默认 overlay 是空对象，具体研究组织按 settings 和 pack 声明，源码读取配置指定的 pack 默认文件，记录冲突并让会话值覆盖默认值。不能把加载 VMU 等同于开启 v5r。状态实现按工作根使用独立 JSON，不靠宿主会话日志写入。修改路径在同内核串行，尝试跨内核独占创建锁文件，在进入修改时重新检查状态，再写临时文件并重命名。锁等待有界，超限会累加 lockSkips 并继续执行。因此文件替换可以完整，但在无锁情况下两个写者仍可能都从同一旧快照出发，后一个替换前一个结果。不能把原子重命名宣传为跨内核事务。对科研运行应核对实际 pack、可写状态根、运行日志及重开后的任务和投票记录。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:33-46](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/cordis.patch.yml#L33-L46)

overlay 默认空和主预设能力边界。

<details>
<summary>查看原文（14行）</summary>

```text
# ── Vibe Math Unify ──────────────────────────────────────────────────────────────
- insert:
    # U14: the overlay target. Empty config ⇒ zero mechanism; a deployment patches THIS row, never the preset row.
    - id: vibe-math-vmu-overlay
      name: dsh-vibe-math/preset-declaration
      config: {}
    - id: preset-vibe-math-vmu
      name: dsh-vibe-math/preset-declaration
      config:
        id: vibe-math-vmu
        name: "Vibe Math Unify"
        description: "统一框架式研究/数学 agent 预设（vmu）：本身只提供能力与挂点（会议、表决、任务、归档、提示词管线、耐久、计算与形式化、资源与安全、总线与扩展点），运行机制完全由 settings ＋ 中间件（声明式规则／代码模块／脚本与工作流／外部插件）＋ 整合包定义；默认零机制，机制以 pack 形式提供（首个为 v5r-pack）。"
        order: 25
        plugins:
```

</details>

**依据 2 · 源码核查**：[vibe-math-vmu/vibe-math-vmu.js:397-434](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/vibe-math-vmu.js#L397-L434)

实际 pack defaults、冲突标识和配置优先级。

<details>
<summary>查看原文（38行）</summary>

```text
    const wantedPacks = Array.isArray(config.packs) ? config.packs.filter((p) => typeof p === 'string') : []
    for (const name of wantedPacks) {
      try {
        const parsed = JSON.parse(readFileSync(join(here, 'packs', name, 'settings', 'defaults.json'), 'utf8'))
        const d = parsed && typeof parsed.defaults === 'object' && parsed.defaults ? parsed.defaults : {}
        for (const [k, v] of Object.entries(d)) {
          if (packDefaults[k] === undefined) { packDefaults[k] = v; packDefaultSource[k] = name; continue }
          // TWO PACKS WANT DIFFERENT DEFAULTS FOR ONE KEY: that is a declaration conflict, not a coin toss (D-02).
          if (JSON.stringify(packDefaults[k]) !== JSON.stringify(v)) {
            packMergeConflicts.push({ key: k, pack: name, otherPack: packDefaultSource[k], packValue: v, otherValue: packDefaults[k], code: 'VMU_PACK_CONFLICT' })
          }
        }
        defaultsFoldedIds.push(name)      } catch (e) {
        // Only a MISSING file is expected (a flat pack has no settings folder). Anything else is a real error and
        // must not be swallowed: a malformed defaults file would otherwise silently contribute no defaults at all.
        const missing = e && (e.code === 'ENOENT' || e.code === 'ERR_MODULE_NOT_FOUND')
        if (!missing) throw e
      }
    }
  }
  // ROUND 1 / K5 (D-02): ONE PRIORITY, AND AN OVERLAP IS NAMED. The order is `pack 默认 < preset Config／会话 settings
  // < 运行时 set` - so the session's value always wins and a pack default is only a preference. What this used to do
  // was `Object.assign({}, packDefaults, settings)`, which let a pack's default and a deployment's explicit value
  // COLLIDE IN SILENCE (the pack default simply disappeared). The collision is now reported by name, and only the two
  // declared doors (`vmu.packs.allowKernelOverride` / `allowOverride`, or naming the key in
  // `vmu.packs.activeOverrides`) open it - exactly the rule `kernel/pack.js` applies to its own settings layer (O4).
  /** The declared doors, as one predicate: the same three the loader honours. */
  const packOverrideDeclared = (key) => settings['vmu.packs.allowKernelOverride'] === true
    || settings['vmu.packs.allowOverride'] === true
    || (Array.isArray(settings['vmu.packs.activeOverrides']) && settings['vmu.packs.activeOverrides'].includes(key))
  for (const k of Object.keys(packDefaults)) {
    if (!Object.prototype.hasOwnProperty.call(settings, k)) continue
    if (JSON.stringify(settings[k]) === JSON.stringify(packDefaults[k])) continue
    if (packOverrideDeclared(k)) { packDefaultShadowed.push({ key: k, pack: packDefaultSource[k], packValue: packDefaults[k], sessionValue: settings[k], door: 'declared' }); continue }
    packMergeConflicts.push({ key: k, pack: packDefaultSource[k], packValue: packDefaults[k], sessionValue: settings[k], code: 'VMU_PACK_CONFLICT',
      hint: 'the session value WINS (pack 默认 < preset Config／会话 settings); to accept the pack value on purpose, list "' + k + '" in vmu.packs.activeOverrides (or set vmu.packs.allowKernelOverride) - O4 forbids a silent collision' })
  }
  const settingsWithPackDefaults = Object.assign({}, packDefaults, settings)
```

</details>

**依据 3 · 源码核查**：[vibe-math-vmu/kernel/store.js:168-182](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/store.js#L168-L182)

独立状态、锁路径及默认设置。

<details>
<summary>查看原文（15行）</summary>

```text
 * Create a Store over one JSON file. `clock` is injected so tests are deterministic (docs/01 R12):
 * the framework owns time, a caller never passes an instant.
 */
export function createStore({ root, migrators = [], clock = () => new Date().toISOString(),
  coherence = 'auto', lock = true, lockBackoffMs = 25, lockRetries = 40, lockTimeoutMs = 2000 } = {}) {
  if (typeof root !== 'string' || root.length === 0) {
    throw refuse('VMU_INVALID_ARGUMENT', 'createStore needs a workspace root', 'pass { root }')
  }
  const dir = join(root, 'vmu')
  const file = join(dir, 'state.json')
  const tmpFile = () => file + '.' + process.pid + '.' + Date.now() + '.' + Math.random().toString(36).slice(2, 8) + '.tmp'
  const lockFile = file + '.lock'
  // R30 / task-17: on Windows a rename onto a target that another handle still has open answers EPERM — a WINDOW, not a
  // corrupt file. The writer retries a BOUNDED number of attempts, re-reading the file first so a retry builds on the
  // other kernel's value instead of clobbering it; every retry and every give-up is counted (stats.writeRetries /
```

</details>

**依据 4 · 源码核查**：[vibe-math-vmu/kernel/store.js:249-270](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/store.js#L249-L270)

锁退化分支和计数。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Exclusive-create lock so two KERNELS cannot interleave a read-modify-write. Best effort and bounded. */
  const withFileLock = async (fn) => {
    if (!lock) return fn()
    const started = Date.now()
    let fd = null
    for (let i = 0; i < lockRetries; i++) {
      try { fd = openSync(lockFile, 'wx'); break } catch (e) {
        if (e && e.code !== 'EEXIST') break
        if (Date.now() - started > lockTimeoutMs) break
        await sleep(lockBackoffMs)
        stats.lockWaits += 1
      }
    }
    if (fd === null) {
      // A stale lock must not deadlock the institute: report it, then proceed WITHOUT it (the rename stays atomic).
      stats.lockSkips += 1
      return fn()
    }
    try {
      try { writeSync(fd, JSON.stringify({ pid: process.pid, at: clock() })) } catch { /* the content is advisory */ }
      return await fn()
    } finally { try { closeSync(fd) } catch { /* already closed */ } try { rmSync(lockFile) } catch { /* gone */ } }
```

</details>

**依据 5 · 源码核查**：[vibe-math-vmu/kernel/store.js:290-312](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/store.js#L290-L312)

临时文件替换与错误处理。

<details>
<summary>查看原文（23行）</summary>

```text

  const persist = async () => {
    const tmp = tmpFile()
    try {
      await writeFile(tmp, JSON.stringify(fold, null, 2) + '\n', 'utf8')
      await rename(tmp, file) // atomic: the visible file is always a complete document
    } catch (e) {
      // the temp copy is evidence of a write that did NOT land; leaving it behind would be a leak, not a record
      try { rmSync(tmp) } catch { /* already gone */ }
      if (e && e.code === 'ENOENT' && dirGone()) {
        // task-20: the ROOT is gone (a teardown that cannot be awaited). Name it, count it, and keep it out of the
        // transient-retry loop — retrying a deleted workspace can only burn attempts.
        const gone = refuse('VMU_STORE_FAILED',
          'the store directory disappeared while a write was in flight (' + dir + '): the write is NOT acknowledged and nothing was kept',
          'a teardown that removes the store root cannot be followed by a durable write; the write is refused by reason (' + ROOT_GONE + ') and counted in stats.writeRootGone, never silently')
        gone.reason = ROOT_GONE
        gone.cause = String((e && e.code) || '')
        throw gone
      }
      throw e
    }
    adoptStamp()
    stats.writes++
```

</details>

**依据 6 · 源码核查**：[vibe-math-vmu/kernel/store.js:337-375](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/store.js#L337-L375)

串行修改、重新读取与失败处理。

<details>
<summary>查看原文（39行）</summary>

```text
  const mutate = (key, where, compute, before, landed) => runExclusive(() => withFileLock(async () => {
    let attempt = 0
    for (;;) {
      attempt += 1
      if (!fold) throw refuse('VMU_STORE_FAILED', 'store is not open')
      // first attempt: the ordinary staleness check (honours coherence:'off'); a RETRY must forget the value that never
      // landed and read the file as it is now — that is recovery of a failed write, not a coherence inference.
      reloadIfStale(where, attempt > 1)
      assertKey(key)
      if (before) before()
      const prev = fold.keys[key]
      const next = compute(clone(prev))
      if (next === undefined) return { ok: true, key, version: fold.version, changed: false }
      fold.keys[key] = next
      try {
        await persist()
      } catch (e) {
        const code = e && e.code
        if (e && e.reason === ROOT_GONE) {
          // task-20: the store root was deleted under this write. It can never land, and a fire-and-forget caller (a
          // marker/ledger write that is not awaited) must not take the PROCESS down after every assertion passed: the
          // promise still REJECTS for an awaiting caller (the refusal is named), and this only keeps it from being an
          // unhandled rejection. The failure stays visible in stats.writeRootGone.
          stats.writeRootGone += 1
          resyncFromDisk()
          // the file is gone, so there is nothing to resync FROM: put the pre-mutation value back — an in-memory fold
          // that keeps a value the file never received is the "durable in appearance only" defect this suite exists for.
          if (stamp === null && fold && fold.keys) fold.keys[key] = prev
          throw e
        }
        if (!TRANSIENT_RENAME_CODES.has(code)) throw e
        if (attempt >= MAX_WRITE_ATTEMPTS) {
          stats.writeRetryGiveUps += 1
          resyncFromDisk()
          if (stamp === null && fold && fold.keys) fold.keys[key] = prev // unreadable file: keep the value the file HAS
          const err = refuse('VMU_STORE_FAILED',
            'the durable file could not be atomically replaced after ' + attempt + ' attempts (' + code + '): the write is NOT acknowledged',
            'another kernel or a plain reader still held the target; the in-memory fold was resynced to the file, so nothing was silently kept')
          err.attempts = attempt
```

</details>

#### 缺口

- 未运行两个真实内核的异常竞争与恢复。
  **影响**：不能确认退化路径在目标工作区会否造成任务、票箱或记录丢失。
  **进一步探讨**：在专用工作区模拟占锁和并行更新，回读最终 JSON 和对应操作回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Lean 通过、忠实性与 Verified 分别证明什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Lean 作业面新编译要求可观察退出码为 0 且文件前后哈希相同。同内容同构建键可复用已有成功作业，并返回去重标记，不能把这个回执写成此次新编译。VMU 另有 formal 检查面，默认对检测到的 sorry 拒绝，显式允许时会留下标记。这是独立路径，所查 v5r Lean 作业通过条件本身只比较退出码和哈希，不能假定每个传入作业都经过相同检查。v5r 忠实性工具要求主席席、可读取且通过的 Lean 作业，由裁定者判断形式定义和原题是否一致。裁为缺陷会记录撤回标记而不等于证伪。Verified 轨提升还处理辩论裁决和文献线索。比如文献规则检查非空引用和可用的目标绑定，并没有在该谓词内读取文献、复核定理或翻译定义。由此可按回执追溯框架采用了哪条证据路径，不能用轨道名称推导数学正确。独立验收仍需核对原命题、形式化条件、工具链和实际证明内容。

#### 证据与依据

**依据 1 · 源码核查**：[vibe-math-vmu/kernel/lean.js:489-510](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/lean.js#L489-L510)

同构建键复用过去通过，明确未重新编译。

<details>
<summary>查看原文（22行）</summary>

```text
    // ── F45 去重：与 settle **同源**（dedupeKey ＝ 内容哈希 ＋ 构建上下文，即 settle 要复核的那两个事实）。
    // 同内容同上下文已有一次「通过」⇒ 不重编译；改内容或改构建上下文才会重跑。
    j.dedupeKey = dedupeKeyOf(j.file, before)
    if (j.dedupeKey) {
      const memHit = [...jobs.values()].filter((x) => x.id !== j.id && x.passed === true && x.dedupeKey === j.dedupeKey)[0]
      let ofId = memHit ? memHit.id : ''
      if (!ofId) {
        try {
          const rows = await mirrorFor().list()
          const mHit = rows.filter((r) => !r.corrupt && r.rec.passed === true && r.rec.dedupeKey === j.dedupeKey && r.jobId !== j.id)[0]
          if (mHit) ofId = mHit.jobId
        } catch (e) { /* no mirror ⇒ no dedupe */ }
      }
      if (ofId) {
        j.state = 'settled'; j.passed = true; j.exitCode = 0; j.hashUnchanged = true
        j.hashAfter = before; j.endedAt = clock(); j.dedupedOf = ofId; j.reason = 'deduped'
        j.receipt = { ok: true, passed: true, deduped: true, of: ofId, exitCode: 0, hashUnchanged: true, isRefutation: false }
        note(j.id, 'settled:deduped', { of: ofId })
        await writeMirror(j)
        emit('lean/job-settled', { jobId: j.id, exitCode: 0, hashUnchanged: true, deduped: true, of: ofId })
        pushNotice(j, '【形式化结果】' + j.id + '：同内容同构建上下文已有通过（' + ofId + '）⇒ 去重，未重编译')
        Promise.resolve().then(pump)
```

</details>

**依据 2 · 源码核查**：[vibe-math-vmu/kernel/lean.js:623-644](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/lean.js#L623-L644)

新编译通过依据和失败回执。

<details>
<summary>查看原文（22行）</summary>

```text
    const after = await readHash(j.file)
    j.hashAfter = after === undefined ? null : after
    const hashUnchanged = before !== undefined && after !== undefined && before === after
    j.exitCode = exitCode
    j.hashUnchanged = hashUnchanged
    // **只有退出 0 且哈希未变** ⇒ passed（其余一律 failed；这是唯一的 passed 途径）
    j.passed = exitCode === 0 && hashUnchanged === true
    j.state = j.passed ? 'settled' : 'failed'
    j.endedAt = clock()
    j.receipt = j.passed
      ? { ok: true, passed: true, isRefutation: false, exitCode, hashUnchanged: true, stdout: capOut.text.slice(0, 4000),
          stdoutDroppedBytes: capOut.droppedBytes, stderrDroppedBytes: capErr.droppedBytes, hostLossy, spillPath: hostSpill }
      : Object.assign(refuse(exitCode === 0 ? 'VMU_LEAN_HASH_CHANGED' : 'VMU_LEAN_EXIT_NONZERO',
        exitCode === 0 ? '编译期间文件内容已变 ⇒ 结果不算 passed（hash 变了）'
          : 'Lean 退出码 ' + exitCode + (capErr.text ? '；stderr 尾部：' + capErr.text.slice(-800) : '（stderr 为空）'),
        exitCode === 0 ? '编译后不要再改文件；重跑一次' : '看 stdout/stderr 修证明；本面不猜结论'),
        { stdoutDroppedBytes: capOut.droppedBytes, stderrDroppedBytes: capErr.droppedBytes, hostLossy, spillPath: hostSpill,
          stdoutTail: capOut.text.slice(-2000), stderrTail: capErr.text.slice(-2000) })
    note(j.id, j.passed ? 'settled:passed' : 'failed:' + (j.receipt && j.receipt.code))
    await writeMirror(j)
    emit(j.passed ? 'lean/job-settled' : 'lean/job-failed',
      { jobId: j.id, exitCode, hashUnchanged, code: j.passed ? null : (j.receipt && j.receipt.code) || null })
```

</details>

**依据 3 · 源码核查**：[vibe-math-vmu/kernel/formal.js:125-129](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/formal.js#L125-L129)

独立 formal 面的 sorry 规则。

```text
    const allowSorry = args.allowSorry === true || c.allowSorry === true
    // ② sorry 默认拒 ＋ 点名位置
    if (sorry.length && !allowSorry) {
      return refuse('VMU_FORMAL_SORRY_FOUND', '检出 sorry（' + sorry.length + ' 处）：' + sorry.map((p) => p.line + ':' + p.col).join('、'),
        '把 sorry 补成真证明；确要放行须显式 allowSorry（且会被自曝 ✗）')
```

**依据 4 · 源码核查**：[vibe-math-vmu/packs/v5r/tools.js:2023-2053](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/tools.js#L2023-L2053)

忠实性判断要求主席与作业。

<details>
<summary>查看原文（31行）</summary>

```text
async function toolFidelityConclude(args = {}, { kernel } = {}) {
  const records = recordsOf(kernel)
  const cardId = has(args.card) ? str(args.card)
    : (has(args.id) ? str(args.id) : (has(args.proposition_id) ? str(args.proposition_id) : ''))
  if (!cardId) {
    throw refuse('VMU_INVALID_ARGUMENT', 'fidelity conclusion needs the proposition card it judges',
      'pass card:"<records id of the proposition card>"')
  }
  const decision = has(args.fidelity) ? str(args.fidelity).trim() : ''
  if (decision !== 'conform' && decision !== 'defect') {
    throw refuse('VMU_INVALID_ARGUMENT', 'fidelity must be "conform" or "defect"; got "' + decision + '"',
      'after a PASSING Lean run the debate judges correspondence only: "conform"＝形式化说的就是命题说的 ⇒ p=1 且入 verified；'
      + '"defect"＝不一致 ⇒ 撤回该卡的 verified 并记原因（defect 必须给 note）')
  }
  const chair = requireChairSeat(kernel, has(args.member) ? args.member : args.by, 'fidelity conclusion')
  const jobId = has(args.lean_job) ? str(args.lean_job)
    : (has(args.lean_job_id) ? str(args.lean_job_id) : '')
  const policy = leanPolicyOf(kernel)
  if (!jobId) {
    throw refuse('VMU_PACK_V5R_FIDELITY_LEAN_NOT_PASSED',
      'a conformance conclusion needs the PASSING Lean job that settled the formalisation (no job id was given)',
      'pass lean_job:"<job id from vibe_v5_lean_run / vibe_v5_lean_job>" — 没有编译通过的作业，"符合性"无从判定')
  }
  // ★★ RUN 152 (real machine, run 2, agent feedback F2): a Lean job created in an EARLIER kernel process lives only in
  // the durable mirror (`Formal/Jobs/<id>.json`), and the in-process lookup knows nothing about it until the mirror is
  // hydrated — so a continuation run got `VMU_PACK_V5R_FIDELITY_LEAN_NOT_PASSED … not readable on this deployment` for a
  // job whose pass the mirror holds (the workspace had lean-1..lean-5.json). Hydrate the mirror once and retry before
  // refusing; if it is still absent, the refusal names BOTH scopes so the reader knows what was searched.
  let lean = leanPassedOf(kernel, jobId)
  let mirrorHydrated = null
  // ★ the face is created only when the Host offers a spawn seam (kernel/index.js: `const lean = spawn ? … : null`), so the
```

</details>

**依据 5 · 源码核查**：[vibe-math-vmu/packs/v5r/tools.js:2064-2081](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/tools.js#L2064-L2081)

拒绝不可读或未通过的作业。

<details>
<summary>查看原文（18行）</summary>

```text
  if (!lean) {
    throw refuse('VMU_PACK_V5R_FIDELITY_LEAN_NOT_PASSED',
      'Lean job "' + jobId + '" is not readable on this deployment ('
      + (kernel && kernel.lean
        ? 'neither this kernel process nor the durable job mirror knows that id'
          + (mirrorHydrated && mirrorHydrated.dir !== undefined ? ' — the mirror was re-read: ' + String(mirrorHydrated.dir) + ' holds ' + String(mirrorHydrated.count) + ' job(s)' : '')
          + (mirrorHydrated && mirrorHydrated.error !== undefined ? ' — the mirror could not be read: ' + String(mirrorHydrated.error) : '')
        : 'the Host exposes no spawn seam, so this deployment has no Lean face at all')
      + ')',
      'run the formalisation first（vibe_v5_lean_run）或把真实作业 id 传进来；跨进程的作业由 `vibe_v5_lean_job { jobId }` 读镜像（Formal/Jobs/<id>.json，不是计算作业的 Math/Jobs），没有 Lean 面时这条收口无载体，不要假装编过')
  }
  if (lean.passed !== true) {
    throw refuse('VMU_PACK_V5R_FIDELITY_LEAN_NOT_PASSED',
      'Lean job "' + jobId + '" did NOT pass (state=' + str(lean.state) + '): conformance can only be judged on a formalisation that compiles',
      'fix the Lean file and re-run；缺陷路径也要求编译通过 —— "编译不过"不是"定义不忠实"')
  }
  const delivery = { lean: { jobId: lean.jobId, passed: lean.passed, state: lean.state, file: lean.file },
    policy: policy ? { formalVerify: policy.formalVerify, requireFormal: policy.requireFormal === true, encourageFormal: policy.encourageFormal === true } : null }
```

</details>

**依据 6 · 源码核查**：[vibe-math-vmu/packs/v5r/tools.js:2089-2118](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/tools.js#L2089-L2118)

缺陷撤回、持久标记和投影。

<details>
<summary>查看原文（30行）</summary>

```text
    const note = has(args.note) ? str(args.note).trim() : (has(args.reason) ? str(args.reason).trim() : '')
    const before = withdrawalOf(kernel, cardId)
    let declared = null
    let appended = false
    if (!before) {
      const res = await fidelityFace.declareDefect({ target: cardId, by: chair.id, note })
      if (!res || res.ok === false) {
        throw refuse(str(res && res.code) || 'VMU_STATE', (res && res.message) || 'the fidelity registry refused to record the defect',
          (res && res.hint) || 'a defect needs target + by + note（写清哪条定义/条件/假设/结论与命题原文不一致）')
      }
      declared = res
    } else if (note && before.note !== note) {
      const res = await fidelityFace.declareDefect({ target: cardId, by: chair.id, note })
      if (!res || res.ok === false) {
        throw refuse(str(res && res.code) || 'VMU_STATE', (res && res.message) || 'the fidelity registry refused to record the new defect',
          (res && res.hint) || 'a defect needs target + by + note')
      }
      declared = res
      appended = true
    }
    const marker = withdrawalOf(kernel, cardId)
    const stillVisible = findVerified(records, cardId, { fidelity: fidelityFace })
    const projection = cardProjectionOf(records, cardId)
    return Object.assign({ ok: true, tool: 'vibe_v5_fidelity_conclude', card: cardId, fidelity: 'defect',
      chair: chair.id, withdrawn: marker !== null, marker, alreadyWithdrawn: before !== null, appended,
      verifiedVisible: stillVisible !== null, cardP: projection ? projection.p : null,
      persisted: declared ? declared.persisted === true : null,
      enforced: [], enforcedScope: ENFORCED_SCOPE }, delivery,
    { note: '撤回是**耐久标记**，不是删行：verified 行还在盘上，但唯一读法（findVerified/verified 轨读面）从此看不见它；'
      + '再次 conform 会被 promoteVerified 以 `VMU_STATE` 拒（撤回不可被下一次收口撤销）。卡上的 p 不动 —— 撤回的是"结论"，不是"作者当时的估计"。' })
```

</details>

**依据 7 · 源码核查**：[vibe-math-vmu/packs/v5r/verification-gates.js:187-197](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/verification-gates.js#L187-L197)

文献与 Lean 加忠实性的证据入口。

<details>
<summary>查看原文（11行）</summary>

```text
  if (ev.literature && typeof ev.literature.reference === 'string' && ev.literature.reference.trim() !== '') {
    const target = ev.literature.subject === undefined || ev.literature.subject === null ? null : String(ev.literature.subject)
    if (!target || !cardId || target === cardId) return routed('literature', { evidenceForm: 'literature-reference', reference: ev.literature.reference.trim() })
  }
  if (ev.lean && ev.lean.passed === true && ev.lean.conformance && String(ev.lean.conformance.decision) === 'conform') {
    const target = ev.lean.subject !== undefined ? String(ev.lean.subject) : (ev.lean.cardId !== undefined ? String(ev.lean.cardId) : null)
    if (!target || !cardId || target === cardId) return routed('lean-conformance', { evidenceForm: 'lean-conformance', jobId: ev.lean.jobId || null })
  }
  const nearMiss = []
  if (ev.lean && ev.lean.passed === true && !(ev.lean.conformance && ev.lean.conformance.decision === 'conform')) {
    nearMiss.push('Lean 作业通过了，但**没有**「描述符合性」的裁定（`conformance.decision:"conform"`）—— lean 通过本身不等于 p=1')
```

</details>

**依据 8 · 源码核查**：[vibe-math-vmu/packs/v5r/tools.js:2973-2991](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/tools.js#L2973-L2991)

提升调用中的证伪或正向分支。

<details>
<summary>查看原文（19行）</summary>

```text
    const ruling = debateEvidenceOf(args)
    const unanimousZero = ruling && String(ruling.mode) === 'unanimous' && Number(ruling.value) === 0
    const subjectOk = !ruling || !ruling.subject || ruling.subject === sourceId
    if (!unanimousZero || !subjectOk || expectedForm !== 'debate-unanimous') {
      throw refuse('VMU_PACK_V5R_VERIFIED_NEEDS_JUDGE', 'promoting the DISPROOF of card ' + sourceId + ' needs the unanimous ruling that refuted it (mode:"unanimous", value:0' + (ruling && ruling.subject ? ', subject:' + sourceId : '') + ')',
        'pass debate_ruling:{mode:"unanimous", value:0, subject:"' + sourceId + '", ballotId:"<the ruling id>"} with warrant_kind:"debate-unanimous" — a p=0 row claims "we know this is false", so it must name what decided that too')
    }
  } else {
    pGate = p1Intent({ tool: 'vibe_v5_verified_promote', args, card: promoteCard, evidence: promoteEvidence })
    const pRefusal = gateRefuse(pGate)
    if (pRefusal) return pRefusal
    if (pGate.evidenceForm !== expectedForm) {
      throw refuse('VMU_PACK_V5R_P1_NEEDS_DEBATE', 'the promotion claims warrant_kind "' + warrantKind + '" but the evidence that passed is "' + String(pGate.evidenceForm) + '"',
        'pass the evidence the kind names: a debate ruling (mode unanimous, value 1) for debate-unanimous, a passed Lean job WITH its conformance decision for lean-conformance, a non-empty literature_ref for literature')
    }
  }
  const promoted = promoteVerified({ records, sourceId,
    warrant: { id: warrantId, kind: warrantKind, subject: sourceId },
    by: member, fidelity: kernel && kernel.fidelity ? kernel.fidelity : null })
```

</details>

**依据 9 · 源码核查**：[vibe-math-vmu/packs/v5r/verified.js:418-436](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/verified.js#L418-L436)

定论写入器检查命题与撤回状态。

<details>
<summary>查看原文（19行）</summary>

```text
  const card = parsed.card
  const logicalId = hasText(card.id) ? card.id : key
  const subject = text(warrant.subject).trim()
  if (subject && subject !== key && subject !== logicalId) {
    throw refuse('VMU_INVALID_ARGUMENT', 'warrant ' + text(warrant.id) + ' judged subject ' + subject + ', which is not card ' + key,
      'a warrant may only promote the card it was produced for')
  }
  if (card.p !== 1 && card.p !== 0) {
    throw refuse('VMU_STATE', 'card ' + key + ' is not settled (p=' + probText(card.p) + '), so it cannot enter the verified track',
      'only a SETTLED conclusion may be promoted: p=1 (真) or p=0 (假, with the unanimous ruling that refuted it). p in (0,1) is experience, not a conclusion — a debate settlement is what turns it into 1 or 0. Promote AFTER that settlement, never before it')
  }
  // ★ ROUND 97 (B1, independent audit): THE TRACK CARRIES *JUDGED* CONCLUSIONS — p=1 AND p=0 — NOT PREFERENCES.
  // The audit's real finding was the second half of this sentence: p=0 rows ARE part of the design (the p=1 gate reads
  // them as "this was disproven, it cannot set 1"), so narrowing admission to p=1 would have been a second lie. What
  // changed for real is the WRITE PATH: `vibe_v5_verified_promote` now demands the same four-evidence gate a p=1 write
  // does (a p=0 promotion demands a unanimous debate ruling at 0). This branch only refuses the UNSETTLED middle. 
  if (withdrawnBy(fidelity, logicalId)) {
    throw refuse('VMU_STATE', 'the archived proof of ' + logicalId + ' was WITHDRAWN by a fidelity defect marker, so it cannot be promoted (a withdrawal must not be undone by the next settlement)',
      'the defect marker is the shared truth for every reader; reinstating a proof means a new card/settlement, not deleting the marker')
```

</details>

#### 缺口

- 未用真实 Lean 环境比较作业面和 formal 面的结果。
  **影响**：不能证明归档中的每条记录都通过同一公理和完整性检查。
  **进一步探讨**：用忠实、漏条件、含未完成证明三类样本分别检查实际作业与独立形式化报告。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种研究任务适合小范围采用？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

已有 DSH、熟悉 Lean 并能独立审查证明的研究者，可观察一条已知小定理的分工与回执链。若使用 v5r，需要先核对实际加载的 pack、席位和工作根。成员席配置与主预设不同，但可见仍有宿主文件工具，不能由成员席名称推断完整隔离。调度与多个 Agent 会增加上下文、工具调用、磁盘状态以及失败后的人工检查。形式化路径需要宿主执行接口与可用 Lean，未取得编译回执时只能把结果留作待检材料。作者的已落地说明提供历史运行记录，但明确不是当前总覆盖清单，不能据此给当前任务估算用量。建议先观察现有证据链，在隔离工作区用不涉未公开研究的已知问题做验证。若宿主实际配置与声明不符，或 Verified 缺来源、证明与原题不符，应停止把它作为定论并回到独立 Lean 检查和人工审阅。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:258-265](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/cordis.patch.yml#L258-L265)

成员席及其声明边界。

```text
    - id: preset-vibe-math-vmu-member
      name: dsh-vibe-math/preset-declaration
      config:
        id: vibe-math-vmu-member
        name: "Vibe Math Unify · 成员席"
        description: "vmu 的「成员席」预设：与 vibe-math-vmu 同一套框架能力（会议/表决/任务/归档/提示词管线/计算与形式化/资源与安全），但去掉了六类宿主出口 —— shell（bash/pwsh）、后台作业、自我分派子代理、联网读网页、直接问用户、以及人类的 /goal 目标环。理由是可测量的：成员做研究用的是 pack 工具（实测一个成员会话 20/20 次全走 pack、零宿主调用），而 shell 才是那条让成员读到宿主 app.asar 的逃逸通道；计算走 vibe_vmu_bridge（内核校验请求、超时、结构化结果、具名拒），Lean 走 pack 的 lean 面，向用户提要求只走「报告所办」这一条规则通道。"
        order: 26
        packToolAllow:
```

**依据 2 · 源码核查**：[cordis.patch.yml:349-355](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/cordis.patch.yml#L349-L355)

成员席仍声明文件工具。

```text

          # ── shell ───────────────────────────────────────────────────────────────────
          - id: tool-fs
            name: '@deepseek-ai/dsh-tool-fs'

          - id: tool-fs-search
            name: '@deepseek-ai/dsh-tool-fs-search'
```

**依据 3 · 源码核查**：[vibe-math-vmu/packs/v5r/tools.js:2064-2078](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/tools.js#L2064-L2078)

缺 Lean 面或作业未通过的拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
  if (!lean) {
    throw refuse('VMU_PACK_V5R_FIDELITY_LEAN_NOT_PASSED',
      'Lean job "' + jobId + '" is not readable on this deployment ('
      + (kernel && kernel.lean
        ? 'neither this kernel process nor the durable job mirror knows that id'
          + (mirrorHydrated && mirrorHydrated.dir !== undefined ? ' — the mirror was re-read: ' + String(mirrorHydrated.dir) + ' holds ' + String(mirrorHydrated.count) + ' job(s)' : '')
          + (mirrorHydrated && mirrorHydrated.error !== undefined ? ' — the mirror could not be read: ' + String(mirrorHydrated.error) : '')
        : 'the Host exposes no spawn seam, so this deployment has no Lean face at all')
      + ')',
      'run the formalisation first（vibe_v5_lean_run）或把真实作业 id 传进来；跨进程的作业由 `vibe_v5_lean_job { jobId }` 读镜像（Formal/Jobs/<id>.json，不是计算作业的 Math/Jobs），没有 Lean 面时这条收口无载体，不要假装编过')
  }
  if (lean.passed !== true) {
    throw refuse('VMU_PACK_V5R_FIDELITY_LEAN_NOT_PASSED',
      'Lean job "' + jobId + '" did NOT pass (state=' + str(lean.state) + '): conformance can only be judged on a formalisation that compiles',
      'fix the Lean file and re-run；缺陷路径也要求编译通过 —— "编译不过"不是"定义不忠实"')
```

</details>

**依据 4 · 源码核查**：[vibe-math-vmu/kernel/store.js:249-265](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/store.js#L249-L265)

共享状态异常锁路径。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Exclusive-create lock so two KERNELS cannot interleave a read-modify-write. Best effort and bounded. */
  const withFileLock = async (fn) => {
    if (!lock) return fn()
    const started = Date.now()
    let fd = null
    for (let i = 0; i < lockRetries; i++) {
      try { fd = openSync(lockFile, 'wx'); break } catch (e) {
        if (e && e.code !== 'EEXIST') break
        if (Date.now() - started > lockTimeoutMs) break
        await sleep(lockBackoffMs)
        stats.lockWaits += 1
      }
    }
    if (fd === null) {
      // A stale lock must not deadlock the institute: report it, then proceed WITHOUT it (the rename stays atomic).
      stats.lockSkips += 1
      return fn()
```

</details>

**依据 5 · 作者声明**：[docs-landed/00-README.md:55-74](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/docs-landed/00-README.md#L55-L74)

作者标注历史覆盖与实验口径。

<details>
<summary>查看原文（20行）</summary>

```text
⇒ ★★★★ **定稿时 103/103 个 kernel 文件【全部】有人工审查或宣称级验证** ✓

> ★★★ **上面这张表是【定稿时】的账，不是【现在】的账**（补于目标 7）。
> ★★ **原因**：★ 当前派生读数是 **104 个模块**（`node scripts/generate-kernel-index.mjs --check`）⇒ ★ **那张表（88+15+0=103）没有第 104 个的位置**，所以"全部"这个词**只对着它自己的时点成立**。
> ★★ **所以读这张表要这样读**：★ **它说明"定稿时 103 个都有人看过"**；★ **它不说明"今天 104 个都有人看过"** —— 后者要看 `tests/audit-kernel-claims-*.mjs` 的实际读数与 `docs/02` 的生成式模块索引。
> ★ **这也是本卷为什么不手抄会漂移的数字**（见卷首快照声明）：★ **计数会变，时点会过**；★ 能派生的数字一律以生成式索引为准。

★ **而"检查有效"的证据不是"它通过"，★ 是它【抓到了什么】** —— ★ 见 §6 ✓

### 4.2 门 ②：真机实测各功能
★ **两次独立的真机运行**：★ 一次**逐面扫掠**（453s／4.3M tokens）、★ 一次**明确以测试为目的的完整流程**（541s／5.3M tokens）✓
★ **两次都触达 53 个面**；★ **拒绝全部具名且带可执行的下一步**；★ **零崩溃、零引擎消息** ✓

### 4.3 门 ③：完整流程结题
★ **`closureVote.cast === true` 已达成**（★ 判据是**全体有表决权者一致**，★ **不是"看起来收敛"**）✓
★ **累计三次**：★ 两次独立的收敛运行（`cast:true` ×18／×15·×17）＋ ★ 一次**明确告知"这是模拟、以测试功能为主"**的完整流程（★ 本次也是按用户要求的那一种）✓

### 4.4 ★★★★ 而**未验证**的部分 —— 具名，不藏
★ **kernel 的 88 个 L3 模块里，★ 每个仍有【未验证的具体宣称】**。★ 完整清单在：
★ **`docs/acceptance/audit-unverified-debt.md`**（★ 一份**逐模块**的"未验证清单"，★ 每条都写明**为什么**未验证）✓
```

</details>

#### 缺口

- 真实运行的错误率、模型成本和席位权限边界未知。
  **影响**：研究者不能据此直接用于发表或团队生产环境。
  **进一步探讨**：在独立工作区先以人工检查表验收命题、回执和状态，再测退出或更换方案。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断证明回执是否减少错误定论？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可试验为每个研究结论给出能重跑的核查清单，分别绑定题目文本、文件哈希、Lean 构建和通过类型、审阅者判断以及文献定位。现有作业回执有复用与通过区分，v5r 也已保存裁定来源。拟议增量是把相互独立的证据放在一个可人工复查的交付面，并避免把文献非空或主席裁定包装为机器验证。用相同定理和反例，对照单 Agent 加 Lean、当前 VMU 和带核查清单的版本。向各组加入窄化命题、陈旧缓存、缺文献和相同模型共同误判的样本，检查最终有多少正确且可重跑的结论、多少误标、人工审阅分钟和模型用量。若清单没有降低误标或只能靠额外审阅抵消，则无需增加一层展示。当前没有实测。

#### 证据与依据

**依据 1 · 源码核查**：[vibe-math-vmu/kernel/lean.js:489-509](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/kernel/lean.js#L489-L509)

已有通过去重与首次编译区分。

<details>
<summary>查看原文（21行）</summary>

```text
    // ── F45 去重：与 settle **同源**（dedupeKey ＝ 内容哈希 ＋ 构建上下文，即 settle 要复核的那两个事实）。
    // 同内容同上下文已有一次「通过」⇒ 不重编译；改内容或改构建上下文才会重跑。
    j.dedupeKey = dedupeKeyOf(j.file, before)
    if (j.dedupeKey) {
      const memHit = [...jobs.values()].filter((x) => x.id !== j.id && x.passed === true && x.dedupeKey === j.dedupeKey)[0]
      let ofId = memHit ? memHit.id : ''
      if (!ofId) {
        try {
          const rows = await mirrorFor().list()
          const mHit = rows.filter((r) => !r.corrupt && r.rec.passed === true && r.rec.dedupeKey === j.dedupeKey && r.jobId !== j.id)[0]
          if (mHit) ofId = mHit.jobId
        } catch (e) { /* no mirror ⇒ no dedupe */ }
      }
      if (ofId) {
        j.state = 'settled'; j.passed = true; j.exitCode = 0; j.hashUnchanged = true
        j.hashAfter = before; j.endedAt = clock(); j.dedupedOf = ofId; j.reason = 'deduped'
        j.receipt = { ok: true, passed: true, deduped: true, of: ofId, exitCode: 0, hashUnchanged: true, isRefutation: false }
        note(j.id, 'settled:deduped', { of: ofId })
        await writeMirror(j)
        emit('lean/job-settled', { jobId: j.id, exitCode: 0, hashUnchanged: true, deduped: true, of: ofId })
        pushNotice(j, '【形式化结果】' + j.id + '：同内容同构建上下文已有通过（' + ofId + '）⇒ 去重，未重编译')
```

</details>

**依据 2 · 源码核查**：[vibe-math-vmu/packs/v5r/verification-gates.js:187-197](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/verification-gates.js#L187-L197)

已有相异的凭据路径。

<details>
<summary>查看原文（11行）</summary>

```text
  if (ev.literature && typeof ev.literature.reference === 'string' && ev.literature.reference.trim() !== '') {
    const target = ev.literature.subject === undefined || ev.literature.subject === null ? null : String(ev.literature.subject)
    if (!target || !cardId || target === cardId) return routed('literature', { evidenceForm: 'literature-reference', reference: ev.literature.reference.trim() })
  }
  if (ev.lean && ev.lean.passed === true && ev.lean.conformance && String(ev.lean.conformance.decision) === 'conform') {
    const target = ev.lean.subject !== undefined ? String(ev.lean.subject) : (ev.lean.cardId !== undefined ? String(ev.lean.cardId) : null)
    if (!target || !cardId || target === cardId) return routed('lean-conformance', { evidenceForm: 'lean-conformance', jobId: ev.lean.jobId || null })
  }
  const nearMiss = []
  if (ev.lean && ev.lean.passed === true && !(ev.lean.conformance && ev.lean.conformance.decision === 'conform')) {
    nearMiss.push('Lean 作业通过了，但**没有**「描述符合性」的裁定（`conformance.decision:"conform"`）—— lean 通过本身不等于 p=1')
```

</details>

**依据 3 · 源码核查**：[vibe-math-vmu/packs/v5r/verified.js:438-456](https://github.com/ChongCyrus/Vibe-Mathematics/blob/92bc6d943bc7302d28b3f0924c0fcd6bfdb8250c/vibe-math-vmu/packs/v5r/verified.js#L438-L456)

归档行已记录来源与去重。

<details>
<summary>查看原文（19行）</summary>

```text
  const when = Number.isFinite(at) ? at : (Number.isFinite(src.updatedAt) ? src.updatedAt : null)
  const title = text(card.title || src.title || key).trim()
  const row = {
    cardId: key,
    p: card.p,
    warrant: text(warrant.id).trim(),
    source: text(warrant.kind).trim(),
    by: hasText(by) ? text(by).trim() : '',
    at: timeText(when),
    title,
    statement: card.statement,
    basis: 'warrant ' + text(warrant.id).trim() + ' (' + text(warrant.kind).trim() + ') subject ' + (subject || key)
      + '; conclusion ' + conclusionText(card.p, text(warrant.id).trim(), text(warrant.kind).trim()),
  }
  const body = composeVerifiedBody(row)
  const existing = findVerified(records, key, { fidelity })
  if (existing && sameFact(existing.body, body)) {
    return { ok: true, written: false, unchanged: true, id: existing.id, sourceId: key, cardId: key, p: card.p, conclusion: card.p === 1, warrant: { id: row.warrant, kind: row.source },
      note: 'the verified row already states this fact (the time line is ignored when comparing, like v3 writeVerifiedCardIfChanged)' }
```

</details>

#### 缺口

- 没有同题集对照和独立误标统计。
  **影响**：无法判断多代理或额外回执是否提高每个合格结论的产出。
  **进一步探讨**：固定模型与工具链做盲审，分别计合格结论、推断错误和投入。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
