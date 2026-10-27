# MC Mods Dev Bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[565cc1f](https://github.com/7starsseeker/MCModsDevBridge/tree/565cc1f65d78af2c7842aac0769df3ce01f31366)

<!-- BEGIN META -->
[![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/mcmodsdevbridge)
<!-- END META -->

> **功能**：驱动真实 Minecraft 服务端与客户端运行场景 JSON，采集探针证据并覆盖 Fabric、Forge、NeoForge。

> **亮点**：相对人工点测，它把真实双端启动、交互、断言、证据和清理压成可调用流程，并从上游 Forge 1.20.1 扩到 26.3 三 loader。它提供验证基础设施而非测试设计；绿色只证明已写断言，声音、动画手感等仍需人工。 详见[Q03](#research-q03)。

> **主要限制**：最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 MC Mods Dev Bridge，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · MC Mods Dev Bridge 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，MC Mods Dev Bridge 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 MC Mods Dev Bridge 的核心价值不成立？](#detail-section-14)
  - [Q05 · MC Mods Dev Bridge 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · MC Mods Dev Bridge 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · MC Mods Dev Bridge 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 MC Mods Dev Bridge？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Minecraft 26.3 模组开发者在 AI 写完代码后仍需手工启动游戏、连接、op、操作 UI 和收集证据；基线是人工点测或单侧单元测试。合格结果是同一场景在目标 loader 的真实 server/client 上完成断言，保留日志、截图与 probe 响应，失败后进程和安装文件可清理。 详见[Q01](#research-q01)。

Minecraft 26.3 模组开发者在 AI 写完代码后仍需手工启动游戏、连接、op、操作 UI 和收集证据；基线是人工点测或单侧单元测试。合格结果是同一场景在目标 loader 的真实 server/client 上完成断言，保留日志、截图与 probe 响应，失败后进程和安装文件可清理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 真实双端 devrun | 启动服务端/客户端、连接并跑场景 | Windows、MC26.3、JDK25；资源开销高 |
| 场景 DSL | 对 probe HTTP 响应做重试和断言 | 只证明声明的可观察状态 |
| 多 loader 支持 | 覆盖 Fabric/Forge/NeoForge | 模组本身必须提供对应 loader 构建 |
| 证据与清理 | 保存日志/截图并 teardown | 崩溃后仍需检查残留进程/端口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows/PowerShell/JDK25 | 必需 | 启动 MC 26.3 双端 | 缺失则 preflight 失败 |
| 合法 server/client/loader | 必需 | 真实被测运行时 | 仓库不提供或下载 |
| probe jar 与实例注册表 | 必需 | HTTP 观察和路径解析 | 缺失无法执行场景 |
| DSH tools/skills | 可选 | 让 agent 调用与读取知识 | 可直接运行脚本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者装游戏/loader、probe并注册实例 | preflight 列出所有路径和版本 |
| 设计 | 编写场景与断言 | 成功标准绑定具体 probe 字段 |
| 执行 | 工具启动双端并逐步调用 probe | 非零退出即失败，证据落目录 |
| 恢复/验收 | teardown、查端口/进程并人工看体验项 | 残留或证据缺失则该批不合格 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 游戏/硬件/JDK资源；金额未知 | 安装三 loader、probe、注册实例、写场景 | 准备时长和许可条件未量化 |
| 每个用例 | 双 Java 进程 CPU/内存/磁盘日志 | 等待启动并审证据/体验 | 按“断言全过且清理完成”计量 |
| 失败恢复 | 重启进程和重复场景资源 | 杀残留、释放39002、核安装manifest | 崩溃后清理完整性未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 自动可观察验证 | 源码/README定义 probe 和 DSL | 对真实模组缺陷的检出率 |
| 多 loader 回归 | 统一编排三种 loader | 跨 loader 等价性 |
| 人工减负 | 可自动连接、op、断言、取证 | 声音/动画/UI手感仍需人工 |

> **思考**：最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对人工点测，它把真实双端启动、交互、断言、证据和清理压成可调用流程，并从上游 Forge 1.20.1 扩到 26.3 三 loader。它提供验证基础设施而非测试设计；绿色只证明已写断言，声音、动画手感等仍需人工。 详见[Q03](#research-q03)。

DSH wrapper 保持薄层，核心 devrun 可脱离宿主运行；probe 安装用 manifest+sha256 控制卸载，natives 缓存带锁，失败非零退出。可复用的是“真实系统+场景 DSL+证据目录+清理”闭环；迁移到新 MC 版本需维护协议、loader 骨架、启动参数和 probe API。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合维护 MC 26.3 多 loader 模组、已有合法实例且能承担真实进程成本的团队观察；先只做 preflight 和一个 smoke 场景，验收 teardown、证据目录、/mods 双侧一致与端口恢复。普通玩家、非 Windows、旧 MC 版本或没有测试设计能力的团队不适合。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码与作者材料确认了两个 DSH 工具、可选 Skills、PowerShell devrun、双端 probe 场景和证据采集接线；本轮没有启动 Minecraft、Java、loader 或固定端口服务，因而不确认三 loader 真机兼容、teardown 完整性，也不把 probe 绿色结果等同玩家体验合格。

- 已检查：作者 README、包清单、源码路径 README.md、tools/dsh-plugin/mcdev-devrun/dsh.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 565cc1f65d78af2c7842aac0769df3ce01f31366 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在隔离 Windows 游戏实例只选择一个 loader，从 preflight、smoke、故障步骤到 teardown 全链记录；要求日志/截图/probe响应齐全、残留 Java/39002 为零，再让人盲审 probe 不覆盖的体验项。

**分析版本**

- **仓库**：[7starsseeker/MCModsDevBridge](https://github.com/7starsseeker/MCModsDevBridge)
- **版本号**：1.0.3（[固定提交 565cc1f](https://github.com/7starsseeker/MCModsDevBridge/tree/565cc1f65d78af2c7842aac0769df3ce01f31366)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为场景 DSL 加入“人类观察检查点”，在自动 probe 通过后只抽取无法数据化的声音/动画/UI 手感步骤，可显著压缩人工验收。最小实验选 20 个模组功能，对纯人工、纯 probe、混合检查点比较缺陷发现、人工分钟、假阳性与遗漏；混合组漏掉任何高严重度体验缺陷即削弱假设。 详见[Q08](#research-q08)。

在隔离 Windows 游戏实例只选择一个 loader，从 preflight、smoke、故障步骤到 teardown 全链记录；要求日志/截图/probe响应齐全、残留 Java/39002 为零，再让人盲审 probe 不覆盖的体验项。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 7777 | — | — | 108377 |
| .md | example | 2 | 117 | — | — | 1722 |
| .mjs | source | 4 | 589 | 421 | 119 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/7starsseeker/MCModsDevBridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：MC Mods Dev Bridge 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 MC Mods Dev Bridge，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

Minecraft 26.3 模组开发者在 AI 写完代码后仍需手工启动游戏、连接、op、操作 UI 和收集证据；基线是人工点测或单侧单元测试。合格结果是同一场景在目标 loader 的真实 server/client 上完成断言，保留日志、截图与 probe 响应，失败后进程和安装文件可清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-45](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/README.md#L24-L45)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
Turn "the AI finished writing a mod, and now a human has to click through the game" into one executable pipeline: **start a real test server → start a real client → connect + op → run a scenario JSON → collect evidence → tear down**, across **Fabric / Forge / NeoForge**.

Target: Minecraft **26.3**, Java **25**, Windows.

> This is **development tooling**, not a mod for players. The probe mod it ships exists only so that an agent can see and drive a real game.

---

## What it does

- **Server probe** (`lab/shared/.../ProbeServer.java`): state, commands, blocks / NBT, drops, logs, tick control, action backend; block reads and writes take a `dim` parameter (unknown dimension → 400).
- **Client probe** (`lab/shared/.../ClientProbeServer.java` + `action/ClientActionBackend.java`): UI widget tree, slots, scripted input (click / right-click / keys), screenshots, chat commands, `/chat/tail` (the chat and actionbar the client is **currently** showing, so you can assert "it really appeared on the player's screen").
- **End-to-end orchestration** (`scripts/devrun.ps1`): read the instance registry → start the server → wait for readiness → start the client → connect and op → run the scenario step by step → collect evidence → tear down; non-zero exit code on failure. Steps support `retry` (wait for a state to appear); assertions support exact match (`json`), field contains substring (`contains`), field does **not** contain substring (`notContains`), raw response body contains substring (`text`), and body does **not** contain substring (`textNot`); both probes expose `GET /mods`, which is how a cross-loader setup proves what each side actually loaded. LWJGL natives are extracted **once** into `.cache/natives/<mc version>-<arch>/` (guarded by a file lock), so an evidence directory stays at a few dozen KB of logs instead of ~18 MB.
- **DSH plugin** (`tools/dsh-plugin/mcdev-devrun/`): wraps the same orchestration as the `mcdev_devrun` / `mcdev_scenarios` tools, so an agent can call it directly.

## What it does not do

**It provides capabilities, not answers to "what should be tested".**

- **No test cases for any specific mod.** Which features to test, which text to assert, how fine-grained to go — that depends on what you are building at the time. The JSON files in `scenarios/` are **examples and self-checks**, not a coverage promise and not a recommended list.
- **It does not replace your own hands-on pass.** Sound effects, the purple transition animation, F3 readouts, UI feel, how a combo feels — none of that has a data channel, so a human still has to look at the game. The suite takes over the part that *can* be verified automatically and leaves the human time for the part that only a human can judge.
- **It does not decide "good enough" for you.** A green scenario only means the assertions you wrote hold; it does not mean the feature is complete.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MC Mods Dev Bridge 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

DSH 层注册 mcdev_devrun 与 mcdev_scenarios，并可注册 11 个 Skill；工具启动 PowerShell devrun，后者解析实例注册表，启动 server/client、等待 probe、连接与授权、逐步执行 JSON HTTP probe、收集 evidence，最后 teardown。客户端可 gradle/standalone/external，跨 loader 通过双方 /mods 断言确认。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-plugin/mcdev-devrun/dsh.mjs:170-266](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/tools/dsh-plugin/mcdev-devrun/dsh.mjs#L170-L266)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（97行）</summary>

```text
export function apply(ctx) {
  // 知识层：把「只有真机才知道」的开发知识注册成 skill（skills/ 目录，见 skills-provider.mjs）。
  // 用 ctx.inject 而不是写进顶层 inject —— skills 服务缺席时只是没有知识层，工具照常注册。
  ctx.inject(['skills'], (skillCtx) => registerSkills(skillCtx))

  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_devrun',
      description:
        '一条命令跑 MC 探针的端到端编排：起测试服 → 起客户端(runClient) → 连服+op → 执行场景 JSON → ' +
        '取证 → 收尾。三家加载器各自独立的服目录/端口；`-Family all` 串行跑三家并汇总（客户端探针端口 ' +
        '39002 共用，不能并行）。场景里可用 {{player}} 占位符和 waitMs。返回结论行 + 输出尾巴 + 取证目录。' +
        '这是 scripts/devrun.ps1 的包装，逻辑不在插件里。',
      parameters: {
        type: 'object',
        properties: {
          family: {
            type: 'string',
            enum: ['fabric', 'forge', 'neoforge', 'all'],
            description: '哪个加载器；all = 三家串行矩阵。默认 fabric。',
          },
          scenario: {
            type: 'string',
            description: '场景文件（相对工作区），默认 scenarios\\smoke.json。',
          },
          mods: {
            type: 'array',
            items: { type: 'string' },
            description: '额外要塞进测试服 mods/ 的被测 mod jar 路径（矩阵模式传不进去，会被忽略）。',
          },
          keepRunning: {
            type: 'boolean',
            description: 'true = 跑完不收尾（留服和客户端给人工排障）。矩阵模式不支持。',
          },
          timeoutMin: {
            type: 'number',
            description: '总超时（分钟），默认 single=15 / all=45。超时会杀进程并如实报告。',
          },
        },
      },
      async execute(args, exec) {
        const root = resolveRoot(exec?.cwd)
        const family = String(args?.family ?? 'fabric')
        const scenario = String(args?.scenario ?? 'scenarios\\smoke.json')
        const timeoutMin = Number(args?.timeoutMin) || (family === 'all' ? 45 : 15)
        const ps1 = join(root, 'scripts', 'devrun.ps1')
        const argv = ['-Family', family, '-Scenario', scenario]
        if (Array.isArray(args?.mods) && args.mods.length && family !== 'all') {
          argv.push('-Mods', args.mods.join(','))
        }
        if (args?.keepRunning && family !== 'all') argv.push('-KeepRunning')

        log(`devrun ${family} ${scenario} (timeout ${timeoutMin}m)`)
        const res = await runPs1(ps1, argv, { cwd: root, timeoutMs: timeoutMin * 60_000 })
        const { verdict, evidence } = extractVerdict(res.out)
        const parts = []
        parts.push(`devrun ${family} → ${verdict ?? '(no summary line)'}${res.timedOut ? ' [TIMEOUT]' : ''}`)
        if (evidence) parts.push(`evidence: ${evidence}`)
        const head = summarizeEvidence(evidence)
        if (head) parts.push('--- summary.md ---\n' + head)
        parts.push('--- output tail ---\n' + tail(res.out.trim() || '(no stdout)'))
        if (res.err.trim()) parts.push('[stderr]\n' + tail(res.err.trim(), 3000))
        if (!res.timedOut && res.code !== 0) parts.push(`[exit ${res.code}]`)
        return parts.join('\n')
      },
    })

    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_scenarios',
      description:
        '列出 MC 探针端到端编排可用的场景文件（scenarios/*.json）及其名称、说明、步骤数。' +
        '写新场景前先用它看现有格式与命名。',
      parameters: { type: 'object', properties: {} },
      async execute(_args, exec) {
        const root = resolveRoot(exec?.cwd)
        const dir = join(root, 'scenarios')
        if (!existsSync(dir)) return `没有 scenarios 目录：${dir}`
        const rows = []
        for (const entry of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
          const full = join(dir, entry)
          try {
            const sc = JSON.parse(readFileSync(full, 'utf8'))
            rows.push(
              `- ${entry} — ${sc.name ?? '(unnamed)'}，${Array.isArray(sc.steps) ? sc.steps.length : 0} 步` +
                (sc.description ? `\n    ${sc.description}` : ''),
            )
          } catch (e) {
            rows.push(`- ${entry} — 解析失败：${e?.message ?? e}`)
          }
        }
        return `工作区：${root}\n${rows.join('\n')}`
      },
    })

    log('tools registered')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，MC Mods Dev Bridge 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对人工点测，它把真实双端启动、交互、断言、证据和清理压成可调用流程，并从上游 Forge 1.20.1 扩到 26.3 三 loader。它提供验证基础设施而非测试设计；绿色只证明已写断言，声音、动画手感等仍需人工。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-45](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/README.md#L24-L45)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
Turn "the AI finished writing a mod, and now a human has to click through the game" into one executable pipeline: **start a real test server → start a real client → connect + op → run a scenario JSON → collect evidence → tear down**, across **Fabric / Forge / NeoForge**.

Target: Minecraft **26.3**, Java **25**, Windows.

> This is **development tooling**, not a mod for players. The probe mod it ships exists only so that an agent can see and drive a real game.

---

## What it does

- **Server probe** (`lab/shared/.../ProbeServer.java`): state, commands, blocks / NBT, drops, logs, tick control, action backend; block reads and writes take a `dim` parameter (unknown dimension → 400).
- **Client probe** (`lab/shared/.../ClientProbeServer.java` + `action/ClientActionBackend.java`): UI widget tree, slots, scripted input (click / right-click / keys), screenshots, chat commands, `/chat/tail` (the chat and actionbar the client is **currently** showing, so you can assert "it really appeared on the player's screen").
- **End-to-end orchestration** (`scripts/devrun.ps1`): read the instance registry → start the server → wait for readiness → start the client → connect and op → run the scenario step by step → collect evidence → tear down; non-zero exit code on failure. Steps support `retry` (wait for a state to appear); assertions support exact match (`json`), field contains substring (`contains`), field does **not** contain substring (`notContains`), raw response body contains substring (`text`), and body does **not** contain substring (`textNot`); both probes expose `GET /mods`, which is how a cross-loader setup proves what each side actually loaded. LWJGL natives are extracted **once** into `.cache/natives/<mc version>-<arch>/` (guarded by a file lock), so an evidence directory stays at a few dozen KB of logs instead of ~18 MB.
- **DSH plugin** (`tools/dsh-plugin/mcdev-devrun/`): wraps the same orchestration as the `mcdev_devrun` / `mcdev_scenarios` tools, so an agent can call it directly.

## What it does not do

**It provides capabilities, not answers to "what should be tested".**

- **No test cases for any specific mod.** Which features to test, which text to assert, how fine-grained to go — that depends on what you are building at the time. The JSON files in `scenarios/` are **examples and self-checks**, not a coverage promise and not a recommended list.
- **It does not replace your own hands-on pass.** Sound effects, the purple transition animation, F3 readouts, UI feel, how a combo feels — none of that has a data channel, so a human still has to look at the game. The suite takes over the part that *can* be verified automatically and leaves the human time for the part that only a human can judge.
- **It does not decide "good enough" for you.** A green scenario only means the assertions you wrote hold; it does not mean the feature is complete.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 MC Mods Dev Bridge 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键质疑是探针观察面是否代表玩家体验。HTTP probe 会改变被测环境，场景可能只验证探针可见状态而漏掉渲染、时序或 loader 特有问题；固定端口 39002 使客户端并发受限。环境包含游戏账号/安装、Java 25、loader 和大型进程，失败恢复成本高。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-plugin/mcdev-devrun/dsh.mjs:170-266](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/tools/dsh-plugin/mcdev-devrun/dsh.mjs#L170-L266)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（97行）</summary>

```text
export function apply(ctx) {
  // 知识层：把「只有真机才知道」的开发知识注册成 skill（skills/ 目录，见 skills-provider.mjs）。
  // 用 ctx.inject 而不是写进顶层 inject —— skills 服务缺席时只是没有知识层，工具照常注册。
  ctx.inject(['skills'], (skillCtx) => registerSkills(skillCtx))

  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_devrun',
      description:
        '一条命令跑 MC 探针的端到端编排：起测试服 → 起客户端(runClient) → 连服+op → 执行场景 JSON → ' +
        '取证 → 收尾。三家加载器各自独立的服目录/端口；`-Family all` 串行跑三家并汇总（客户端探针端口 ' +
        '39002 共用，不能并行）。场景里可用 {{player}} 占位符和 waitMs。返回结论行 + 输出尾巴 + 取证目录。' +
        '这是 scripts/devrun.ps1 的包装，逻辑不在插件里。',
      parameters: {
        type: 'object',
        properties: {
          family: {
            type: 'string',
            enum: ['fabric', 'forge', 'neoforge', 'all'],
            description: '哪个加载器；all = 三家串行矩阵。默认 fabric。',
          },
          scenario: {
            type: 'string',
            description: '场景文件（相对工作区），默认 scenarios\\smoke.json。',
          },
          mods: {
            type: 'array',
            items: { type: 'string' },
            description: '额外要塞进测试服 mods/ 的被测 mod jar 路径（矩阵模式传不进去，会被忽略）。',
          },
          keepRunning: {
            type: 'boolean',
            description: 'true = 跑完不收尾（留服和客户端给人工排障）。矩阵模式不支持。',
          },
          timeoutMin: {
            type: 'number',
            description: '总超时（分钟），默认 single=15 / all=45。超时会杀进程并如实报告。',
          },
        },
      },
      async execute(args, exec) {
        const root = resolveRoot(exec?.cwd)
        const family = String(args?.family ?? 'fabric')
        const scenario = String(args?.scenario ?? 'scenarios\\smoke.json')
        const timeoutMin = Number(args?.timeoutMin) || (family === 'all' ? 45 : 15)
        const ps1 = join(root, 'scripts', 'devrun.ps1')
        const argv = ['-Family', family, '-Scenario', scenario]
        if (Array.isArray(args?.mods) && args.mods.length && family !== 'all') {
          argv.push('-Mods', args.mods.join(','))
        }
        if (args?.keepRunning && family !== 'all') argv.push('-KeepRunning')

        log(`devrun ${family} ${scenario} (timeout ${timeoutMin}m)`)
        const res = await runPs1(ps1, argv, { cwd: root, timeoutMs: timeoutMin * 60_000 })
        const { verdict, evidence } = extractVerdict(res.out)
        const parts = []
        parts.push(`devrun ${family} → ${verdict ?? '(no summary line)'}${res.timedOut ? ' [TIMEOUT]' : ''}`)
        if (evidence) parts.push(`evidence: ${evidence}`)
        const head = summarizeEvidence(evidence)
        if (head) parts.push('--- summary.md ---\n' + head)
        parts.push('--- output tail ---\n' + tail(res.out.trim() || '(no stdout)'))
        if (res.err.trim()) parts.push('[stderr]\n' + tail(res.err.trim(), 3000))
        if (!res.timedOut && res.code !== 0) parts.push(`[exit ${res.code}]`)
        return parts.join('\n')
      },
    })

    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_scenarios',
      description:
        '列出 MC 探针端到端编排可用的场景文件（scenarios/*.json）及其名称、说明、步骤数。' +
        '写新场景前先用它看现有格式与命名。',
      parameters: { type: 'object', properties: {} },
      async execute(_args, exec) {
        const root = resolveRoot(exec?.cwd)
        const dir = join(root, 'scenarios')
        if (!existsSync(dir)) return `没有 scenarios 目录：${dir}`
        const rows = []
        for (const entry of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
          const full = join(dir, entry)
          try {
            const sc = JSON.parse(readFileSync(full, 'utf8'))
            rows.push(
              `- ${entry} — ${sc.name ?? '(unnamed)'}，${Array.isArray(sc.steps) ? sc.steps.length : 0} 步` +
                (sc.description ? `\n    ${sc.description}` : ''),
            )
          } catch (e) {
            rows.push(`- ${entry} — 解析失败：${e?.message ?? e}`)
          }
        }
        return `工作区：${root}\n${rows.join('\n')}`
      },
    })

    log('tools registered')
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · MC Mods Dev Bridge 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

Windows、Node≥20、PowerShell、JDK25、MC 26.3 server/client 与相应 Fabric/Forge/NeoForge 安装是效果前提；probe jar 和实例绝对路径需本地准备，仓库不带游戏文件。DSH 插件可选，直接脚本也可；客户端外部模式需用户先启动。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-45](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/README.md#L24-L45)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
Turn "the AI finished writing a mod, and now a human has to click through the game" into one executable pipeline: **start a real test server → start a real client → connect + op → run a scenario JSON → collect evidence → tear down**, across **Fabric / Forge / NeoForge**.

Target: Minecraft **26.3**, Java **25**, Windows.

> This is **development tooling**, not a mod for players. The probe mod it ships exists only so that an agent can see and drive a real game.

---

## What it does

- **Server probe** (`lab/shared/.../ProbeServer.java`): state, commands, blocks / NBT, drops, logs, tick control, action backend; block reads and writes take a `dim` parameter (unknown dimension → 400).
- **Client probe** (`lab/shared/.../ClientProbeServer.java` + `action/ClientActionBackend.java`): UI widget tree, slots, scripted input (click / right-click / keys), screenshots, chat commands, `/chat/tail` (the chat and actionbar the client is **currently** showing, so you can assert "it really appeared on the player's screen").
- **End-to-end orchestration** (`scripts/devrun.ps1`): read the instance registry → start the server → wait for readiness → start the client → connect and op → run the scenario step by step → collect evidence → tear down; non-zero exit code on failure. Steps support `retry` (wait for a state to appear); assertions support exact match (`json`), field contains substring (`contains`), field does **not** contain substring (`notContains`), raw response body contains substring (`text`), and body does **not** contain substring (`textNot`); both probes expose `GET /mods`, which is how a cross-loader setup proves what each side actually loaded. LWJGL natives are extracted **once** into `.cache/natives/<mc version>-<arch>/` (guarded by a file lock), so an evidence directory stays at a few dozen KB of logs instead of ~18 MB.
- **DSH plugin** (`tools/dsh-plugin/mcdev-devrun/`): wraps the same orchestration as the `mcdev_devrun` / `mcdev_scenarios` tools, so an agent can call it directly.

## What it does not do

**It provides capabilities, not answers to "what should be tested".**

- **No test cases for any specific mod.** Which features to test, which text to assert, how fine-grained to go — that depends on what you are building at the time. The JSON files in `scenarios/` are **examples and self-checks**, not a coverage promise and not a recommended list.
- **It does not replace your own hands-on pass.** Sound effects, the purple transition animation, F3 readouts, UI feel, how a combo feels — none of that has a data channel, so a human still has to look at the game. The suite takes over the part that *can* be verified automatically and leaves the human time for the part that only a human can judge.
- **It does not decide "good enough" for you.** A green scenario only means the assertions you wrote hold; it does not mean the feature is complete.
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · MC Mods Dev Bridge 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次成本是准备合法游戏安装、三类 loader/JDK、构建或取得 probe、注册实例与写场景；持续每个合格用例消耗 server/client 启动时间、CPU/内存、日志和人工设计断言；失败恢复要杀残留 Java、释放固定端口、核对安装 manifest并重跑受影响场景，不能只看非零退出码。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-plugin/mcdev-devrun/dsh.mjs:170-266](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/tools/dsh-plugin/mcdev-devrun/dsh.mjs#L170-L266)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（97行）</summary>

```text
export function apply(ctx) {
  // 知识层：把「只有真机才知道」的开发知识注册成 skill（skills/ 目录，见 skills-provider.mjs）。
  // 用 ctx.inject 而不是写进顶层 inject —— skills 服务缺席时只是没有知识层，工具照常注册。
  ctx.inject(['skills'], (skillCtx) => registerSkills(skillCtx))

  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_devrun',
      description:
        '一条命令跑 MC 探针的端到端编排：起测试服 → 起客户端(runClient) → 连服+op → 执行场景 JSON → ' +
        '取证 → 收尾。三家加载器各自独立的服目录/端口；`-Family all` 串行跑三家并汇总（客户端探针端口 ' +
        '39002 共用，不能并行）。场景里可用 {{player}} 占位符和 waitMs。返回结论行 + 输出尾巴 + 取证目录。' +
        '这是 scripts/devrun.ps1 的包装，逻辑不在插件里。',
      parameters: {
        type: 'object',
        properties: {
          family: {
            type: 'string',
            enum: ['fabric', 'forge', 'neoforge', 'all'],
            description: '哪个加载器；all = 三家串行矩阵。默认 fabric。',
          },
          scenario: {
            type: 'string',
            description: '场景文件（相对工作区），默认 scenarios\\smoke.json。',
          },
          mods: {
            type: 'array',
            items: { type: 'string' },
            description: '额外要塞进测试服 mods/ 的被测 mod jar 路径（矩阵模式传不进去，会被忽略）。',
          },
          keepRunning: {
            type: 'boolean',
            description: 'true = 跑完不收尾（留服和客户端给人工排障）。矩阵模式不支持。',
          },
          timeoutMin: {
            type: 'number',
            description: '总超时（分钟），默认 single=15 / all=45。超时会杀进程并如实报告。',
          },
        },
      },
      async execute(args, exec) {
        const root = resolveRoot(exec?.cwd)
        const family = String(args?.family ?? 'fabric')
        const scenario = String(args?.scenario ?? 'scenarios\\smoke.json')
        const timeoutMin = Number(args?.timeoutMin) || (family === 'all' ? 45 : 15)
        const ps1 = join(root, 'scripts', 'devrun.ps1')
        const argv = ['-Family', family, '-Scenario', scenario]
        if (Array.isArray(args?.mods) && args.mods.length && family !== 'all') {
          argv.push('-Mods', args.mods.join(','))
        }
        if (args?.keepRunning && family !== 'all') argv.push('-KeepRunning')

        log(`devrun ${family} ${scenario} (timeout ${timeoutMin}m)`)
        const res = await runPs1(ps1, argv, { cwd: root, timeoutMs: timeoutMin * 60_000 })
        const { verdict, evidence } = extractVerdict(res.out)
        const parts = []
        parts.push(`devrun ${family} → ${verdict ?? '(no summary line)'}${res.timedOut ? ' [TIMEOUT]' : ''}`)
        if (evidence) parts.push(`evidence: ${evidence}`)
        const head = summarizeEvidence(evidence)
        if (head) parts.push('--- summary.md ---\n' + head)
        parts.push('--- output tail ---\n' + tail(res.out.trim() || '(no stdout)'))
        if (res.err.trim()) parts.push('[stderr]\n' + tail(res.err.trim(), 3000))
        if (!res.timedOut && res.code !== 0) parts.push(`[exit ${res.code}]`)
        return parts.join('\n')
      },
    })

    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_scenarios',
      description:
        '列出 MC 探针端到端编排可用的场景文件（scenarios/*.json）及其名称、说明、步骤数。' +
        '写新场景前先用它看现有格式与命名。',
      parameters: { type: 'object', properties: {} },
      async execute(_args, exec) {
        const root = resolveRoot(exec?.cwd)
        const dir = join(root, 'scenarios')
        if (!existsSync(dir)) return `没有 scenarios 目录：${dir}`
        const rows = []
        for (const entry of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
          const full = join(dir, entry)
          try {
            const sc = JSON.parse(readFileSync(full, 'utf8'))
            rows.push(
              `- ${entry} — ${sc.name ?? '(unnamed)'}，${Array.isArray(sc.steps) ? sc.steps.length : 0} 步` +
                (sc.description ? `\n    ${sc.description}` : ''),
            )
          } catch (e) {
            rows.push(`- ${entry} — 解析失败：${e?.message ?? e}`)
          }
        }
        return `工作区：${root}\n${rows.join('\n')}`
      },
    })

    log('tools registered')
```

</details>

#### 缺口

- probe 通过与真实玩家可接受体验之间的相关性未知
  **影响**：可能产生“自动绿但体验坏”的错误信心
  **进一步探讨**：选20个含渲染/声音/UI的真实缺陷，比较 probe 与人审检出率、耗时和遗漏严重度

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · MC Mods Dev Bridge 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

DSH wrapper 保持薄层，核心 devrun 可脱离宿主运行；probe 安装用 manifest+sha256 控制卸载，natives 缓存带锁，失败非零退出。可复用的是“真实系统+场景 DSL+证据目录+清理”闭环；迁移到新 MC 版本需维护协议、loader 骨架、启动参数和 probe API。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-plugin/mcdev-devrun/dsh.mjs:170-266](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/tools/dsh-plugin/mcdev-devrun/dsh.mjs#L170-L266)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（97行）</summary>

```text
export function apply(ctx) {
  // 知识层：把「只有真机才知道」的开发知识注册成 skill（skills/ 目录，见 skills-provider.mjs）。
  // 用 ctx.inject 而不是写进顶层 inject —— skills 服务缺席时只是没有知识层，工具照常注册。
  ctx.inject(['skills'], (skillCtx) => registerSkills(skillCtx))

  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_devrun',
      description:
        '一条命令跑 MC 探针的端到端编排：起测试服 → 起客户端(runClient) → 连服+op → 执行场景 JSON → ' +
        '取证 → 收尾。三家加载器各自独立的服目录/端口；`-Family all` 串行跑三家并汇总（客户端探针端口 ' +
        '39002 共用，不能并行）。场景里可用 {{player}} 占位符和 waitMs。返回结论行 + 输出尾巴 + 取证目录。' +
        '这是 scripts/devrun.ps1 的包装，逻辑不在插件里。',
      parameters: {
        type: 'object',
        properties: {
          family: {
            type: 'string',
            enum: ['fabric', 'forge', 'neoforge', 'all'],
            description: '哪个加载器；all = 三家串行矩阵。默认 fabric。',
          },
          scenario: {
            type: 'string',
            description: '场景文件（相对工作区），默认 scenarios\\smoke.json。',
          },
          mods: {
            type: 'array',
            items: { type: 'string' },
            description: '额外要塞进测试服 mods/ 的被测 mod jar 路径（矩阵模式传不进去，会被忽略）。',
          },
          keepRunning: {
            type: 'boolean',
            description: 'true = 跑完不收尾（留服和客户端给人工排障）。矩阵模式不支持。',
          },
          timeoutMin: {
            type: 'number',
            description: '总超时（分钟），默认 single=15 / all=45。超时会杀进程并如实报告。',
          },
        },
      },
      async execute(args, exec) {
        const root = resolveRoot(exec?.cwd)
        const family = String(args?.family ?? 'fabric')
        const scenario = String(args?.scenario ?? 'scenarios\\smoke.json')
        const timeoutMin = Number(args?.timeoutMin) || (family === 'all' ? 45 : 15)
        const ps1 = join(root, 'scripts', 'devrun.ps1')
        const argv = ['-Family', family, '-Scenario', scenario]
        if (Array.isArray(args?.mods) && args.mods.length && family !== 'all') {
          argv.push('-Mods', args.mods.join(','))
        }
        if (args?.keepRunning && family !== 'all') argv.push('-KeepRunning')

        log(`devrun ${family} ${scenario} (timeout ${timeoutMin}m)`)
        const res = await runPs1(ps1, argv, { cwd: root, timeoutMs: timeoutMin * 60_000 })
        const { verdict, evidence } = extractVerdict(res.out)
        const parts = []
        parts.push(`devrun ${family} → ${verdict ?? '(no summary line)'}${res.timedOut ? ' [TIMEOUT]' : ''}`)
        if (evidence) parts.push(`evidence: ${evidence}`)
        const head = summarizeEvidence(evidence)
        if (head) parts.push('--- summary.md ---\n' + head)
        parts.push('--- output tail ---\n' + tail(res.out.trim() || '(no stdout)'))
        if (res.err.trim()) parts.push('[stderr]\n' + tail(res.err.trim(), 3000))
        if (!res.timedOut && res.code !== 0) parts.push(`[exit ${res.code}]`)
        return parts.join('\n')
      },
    })

    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_scenarios',
      description:
        '列出 MC 探针端到端编排可用的场景文件（scenarios/*.json）及其名称、说明、步骤数。' +
        '写新场景前先用它看现有格式与命名。',
      parameters: { type: 'object', properties: {} },
      async execute(_args, exec) {
        const root = resolveRoot(exec?.cwd)
        const dir = join(root, 'scenarios')
        if (!existsSync(dir)) return `没有 scenarios 目录：${dir}`
        const rows = []
        for (const entry of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
          const full = join(dir, entry)
          try {
            const sc = JSON.parse(readFileSync(full, 'utf8'))
            rows.push(
              `- ${entry} — ${sc.name ?? '(unnamed)'}，${Array.isArray(sc.steps) ? sc.steps.length : 0} 步` +
                (sc.description ? `\n    ${sc.description}` : ''),
            )
          } catch (e) {
            rows.push(`- ${entry} — 解析失败：${e?.message ?? e}`)
          }
        }
        return `工作区：${root}\n${rows.join('\n')}`
      },
    })

    log('tools registered')
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为场景 DSL 加入“人类观察检查点”，在自动 probe 通过后只抽取无法数据化的声音/动画/UI 手感步骤，可显著压缩人工验收。最小实验选 20 个模组功能，对纯人工、纯 probe、混合检查点比较缺陷发现、人工分钟、假阳性与遗漏；混合组漏掉任何高严重度体验缺陷即削弱假设。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-plugin/mcdev-devrun/dsh.mjs:170-266](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/tools/dsh-plugin/mcdev-devrun/dsh.mjs#L170-L266)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（97行）</summary>

```text
export function apply(ctx) {
  // 知识层：把「只有真机才知道」的开发知识注册成 skill（skills/ 目录，见 skills-provider.mjs）。
  // 用 ctx.inject 而不是写进顶层 inject —— skills 服务缺席时只是没有知识层，工具照常注册。
  ctx.inject(['skills'], (skillCtx) => registerSkills(skillCtx))

  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_devrun',
      description:
        '一条命令跑 MC 探针的端到端编排：起测试服 → 起客户端(runClient) → 连服+op → 执行场景 JSON → ' +
        '取证 → 收尾。三家加载器各自独立的服目录/端口；`-Family all` 串行跑三家并汇总（客户端探针端口 ' +
        '39002 共用，不能并行）。场景里可用 {{player}} 占位符和 waitMs。返回结论行 + 输出尾巴 + 取证目录。' +
        '这是 scripts/devrun.ps1 的包装，逻辑不在插件里。',
      parameters: {
        type: 'object',
        properties: {
          family: {
            type: 'string',
            enum: ['fabric', 'forge', 'neoforge', 'all'],
            description: '哪个加载器；all = 三家串行矩阵。默认 fabric。',
          },
          scenario: {
            type: 'string',
            description: '场景文件（相对工作区），默认 scenarios\\smoke.json。',
          },
          mods: {
            type: 'array',
            items: { type: 'string' },
            description: '额外要塞进测试服 mods/ 的被测 mod jar 路径（矩阵模式传不进去，会被忽略）。',
          },
          keepRunning: {
            type: 'boolean',
            description: 'true = 跑完不收尾（留服和客户端给人工排障）。矩阵模式不支持。',
          },
          timeoutMin: {
            type: 'number',
            description: '总超时（分钟），默认 single=15 / all=45。超时会杀进程并如实报告。',
          },
        },
      },
      async execute(args, exec) {
        const root = resolveRoot(exec?.cwd)
        const family = String(args?.family ?? 'fabric')
        const scenario = String(args?.scenario ?? 'scenarios\\smoke.json')
        const timeoutMin = Number(args?.timeoutMin) || (family === 'all' ? 45 : 15)
        const ps1 = join(root, 'scripts', 'devrun.ps1')
        const argv = ['-Family', family, '-Scenario', scenario]
        if (Array.isArray(args?.mods) && args.mods.length && family !== 'all') {
          argv.push('-Mods', args.mods.join(','))
        }
        if (args?.keepRunning && family !== 'all') argv.push('-KeepRunning')

        log(`devrun ${family} ${scenario} (timeout ${timeoutMin}m)`)
        const res = await runPs1(ps1, argv, { cwd: root, timeoutMs: timeoutMin * 60_000 })
        const { verdict, evidence } = extractVerdict(res.out)
        const parts = []
        parts.push(`devrun ${family} → ${verdict ?? '(no summary line)'}${res.timedOut ? ' [TIMEOUT]' : ''}`)
        if (evidence) parts.push(`evidence: ${evidence}`)
        const head = summarizeEvidence(evidence)
        if (head) parts.push('--- summary.md ---\n' + head)
        parts.push('--- output tail ---\n' + tail(res.out.trim() || '(no stdout)'))
        if (res.err.trim()) parts.push('[stderr]\n' + tail(res.err.trim(), 3000))
        if (!res.timedOut && res.code !== 0) parts.push(`[exit ${res.code}]`)
        return parts.join('\n')
      },
    })

    toolCtx.tools.register({
      ...asText,
      name: 'mcdev_scenarios',
      description:
        '列出 MC 探针端到端编排可用的场景文件（scenarios/*.json）及其名称、说明、步骤数。' +
        '写新场景前先用它看现有格式与命名。',
      parameters: { type: 'object', properties: {} },
      async execute(_args, exec) {
        const root = resolveRoot(exec?.cwd)
        const dir = join(root, 'scenarios')
        if (!existsSync(dir)) return `没有 scenarios 目录：${dir}`
        const rows = []
        for (const entry of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
          const full = join(dir, entry)
          try {
            const sc = JSON.parse(readFileSync(full, 'utf8'))
            rows.push(
              `- ${entry} — ${sc.name ?? '(unnamed)'}，${Array.isArray(sc.steps) ? sc.steps.length : 0} 步` +
                (sc.description ? `\n    ${sc.description}` : ''),
            )
          } catch (e) {
            rows.push(`- ${entry} — 解析失败：${e?.message ?? e}`)
          }
        }
        return `工作区：${root}\n${rows.join('\n')}`
      },
    })

    log('tools registered')
```

</details>

#### 缺口

- probe 通过与真实玩家可接受体验之间的相关性未知
  **影响**：可能产生“自动绿但体验坏”的错误信心
  **进一步探讨**：选20个含渲染/声音/UI的真实缺陷，比较 probe 与人审检出率、耗时和遗漏严重度

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 MC Mods Dev Bridge？

**研究主题**：采用判断

#### 完整回答

适合维护 MC 26.3 多 loader 模组、已有合法实例且能承担真实进程成本的团队观察；先只做 preflight 和一个 smoke 场景，验收 teardown、证据目录、/mods 双侧一致与端口恢复。普通玩家、非 Windows、旧 MC 版本或没有测试设计能力的团队不适合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-45](https://github.com/7starsseeker/MCModsDevBridge/blob/565cc1f65d78af2c7842aac0769df3ce01f31366/README.md#L24-L45)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
Turn "the AI finished writing a mod, and now a human has to click through the game" into one executable pipeline: **start a real test server → start a real client → connect + op → run a scenario JSON → collect evidence → tear down**, across **Fabric / Forge / NeoForge**.

Target: Minecraft **26.3**, Java **25**, Windows.

> This is **development tooling**, not a mod for players. The probe mod it ships exists only so that an agent can see and drive a real game.

---

## What it does

- **Server probe** (`lab/shared/.../ProbeServer.java`): state, commands, blocks / NBT, drops, logs, tick control, action backend; block reads and writes take a `dim` parameter (unknown dimension → 400).
- **Client probe** (`lab/shared/.../ClientProbeServer.java` + `action/ClientActionBackend.java`): UI widget tree, slots, scripted input (click / right-click / keys), screenshots, chat commands, `/chat/tail` (the chat and actionbar the client is **currently** showing, so you can assert "it really appeared on the player's screen").
- **End-to-end orchestration** (`scripts/devrun.ps1`): read the instance registry → start the server → wait for readiness → start the client → connect and op → run the scenario step by step → collect evidence → tear down; non-zero exit code on failure. Steps support `retry` (wait for a state to appear); assertions support exact match (`json`), field contains substring (`contains`), field does **not** contain substring (`notContains`), raw response body contains substring (`text`), and body does **not** contain substring (`textNot`); both probes expose `GET /mods`, which is how a cross-loader setup proves what each side actually loaded. LWJGL natives are extracted **once** into `.cache/natives/<mc version>-<arch>/` (guarded by a file lock), so an evidence directory stays at a few dozen KB of logs instead of ~18 MB.
- **DSH plugin** (`tools/dsh-plugin/mcdev-devrun/`): wraps the same orchestration as the `mcdev_devrun` / `mcdev_scenarios` tools, so an agent can call it directly.

## What it does not do

**It provides capabilities, not answers to "what should be tested".**

- **No test cases for any specific mod.** Which features to test, which text to assert, how fine-grained to go — that depends on what you are building at the time. The JSON files in `scenarios/` are **examples and self-checks**, not a coverage promise and not a recommended list.
- **It does not replace your own hands-on pass.** Sound effects, the purple transition animation, F3 readouts, UI feel, how a combo feels — none of that has a data channel, so a human still has to look at the game. The suite takes over the part that *can* be verified automatically and leaves the human time for the part that only a human can judge.
- **It does not decide "good enough" for you.** A green scenario only means the assertions you wrote hold; it does not mean the feature is complete.
```

</details>

#### 缺口

- probe 通过与真实玩家可接受体验之间的相关性未知
  **影响**：可能产生“自动绿但体验坏”的错误信心
  **进一步探讨**：选20个含渲染/声音/UI的真实缺陷，比较 probe 与人审检出率、耗时和遗漏严重度

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
