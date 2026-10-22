# dsh-hdc-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[51868ae](https://github.com/1na-ko/dsh-hdc-bridge/tree/51868ae19c9114ea1f7d148f708928c0c0d00e59)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,689](https://img.shields.io/static/v1?label=npm+30d&message=1%2C689&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)
<!-- END META -->

> **实现功能**：为 DSH 集成鸿蒙设备调试、截图/UI操作、官方知识查询及可选 DevEco 构建签名流程。

> **核心亮点**：把成熟hdc和官方工具链/知识接入DSH原生结果、图片和工程流程，减少手工材料交接；不将协议、官方文档与上游编译能力记为原创。详见[Q01](#research-q01)。

> **风险与缺陷**：工具层和面板不是同一执行权限通道，preferred设备单值也需宿主实例作用域才能兑现会话隔离；多设备自动选择可能偏离意图。这些静态边界尚未运行复现。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要原生鸿蒙闭环，相对直接hdc有何贡献？](#detail-section-11)
  - [Q02 · 设备选择、Shell调用和错误如何流动？](#detail-section-12)
  - [Q03 · 面板与工具层是否共享权限及目标边界？](#detail-section-13)
  - [Q04 · 工具链和知识可信度依赖什么？](#detail-section-14)
  - [Q05 · 工程和三阶段成本怎样？](#detail-section-15)
  - [Q06 · 可推导何种改进，当前如何采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：鸿蒙开发者需要在DSH内观察设备、改码、部署再验证，合格结果绑定正确设备和真实产物，不只是命令exit0。详见[Q01](#research-q01)。

直接hdc、DevEco CLI与文档/截图人工交接，或已有MCP能力层；插件重点在DSH闭环而非重写基础协议。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设备调试/UI | 观察和操作鸿蒙目标 | 明确target，含修改动作 |
| 工具链/知识 | 构建、签名、API与文档 | 本机版本及许可来源需对应 |
| 会话编译 | 维护工程根和部署 | 工程目录不等权限边界 |
| 设备面板 | 只读状态/截图与目标选择 | 直接进程和路由权限另核对 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| DSH shell/tools与策略 | 工具执行 | seam/策略不匹配拒绝 |
| hdc/授权设备 | 调试与部署 | 未连接不能闭环 |
| Studio或CLT、SDK/Java | 特定构建/签名/API查询 | 操作可用范围收窄 |
| skills及webServer可选 | 指引和面板 | 缺服务不等全部工具失败 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 准备工具链和设备 | 开发者 | 发现正确目标及API |
| 显式设target/工程 | 用户/Agent | 与预期设备和目录一致 |
| 观察改码构建部署 | Agent/开发者 | 业务ok与真实产物 |
| 再截图/日志验证 | 开发者 | 合格任务结果，不只exit0 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | SDK/Studio/CLT、设备和存储 | 连接、签名、API版本及策略核对 | SDK/设备/签名与策略依环境；初始金额和耗时未知 |
| 持续使用 | 编译、截图日志和模型调用 | 观察/部署/验证，收益未测 | 编译/截图日志与后续模型费依任务；净收益未知 |
| 失败恢复 | 重编译、安装和部分状态 | 核对旧产物、设备数据、签名与权限 | 重编/安装与旧产物/设备数据核对工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 设备闭环 | 列表/截图/安装与结果包装 | 正确业务仍需后续验证 |
| 知识版本化 | SDK/官方优先技能纪律 | 文档存在不保证工程可用 |
| 构建成功识别 | 输出及产物额外判据 | 旧产物/目标和签名需核对 |

> **思考**：工具层和面板不是同一执行权限通道，preferred设备单值也需宿主实例作用域才能兑现会话隔离；多设备自动选择可能偏离意图。这些静态边界尚未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把成熟hdc和官方工具链/知识接入DSH原生结果、图片和工程流程，减少手工材料交接；不将协议、官方文档与上游编译能力记为原创。详见[Q01](#research-q01)。

把成熟hdc和官方工具链/知识接入DSH原生结果、图片和工程流程，减少手工材料交接；不将协议、官方文档与上游编译能力记为原创。详见[Q01](#research-q01)。

core抽离、业务失败、保留输出状态可借鉴；面板直接进程与工具Shell策略不同，mock测试只证明包装。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

工具层和面板不是同一执行权限通道，preferred设备单值也需宿主实例作用域才能兑现会话隔离；多设备自动选择可能偏离意图。这些静态边界尚未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先核对core作用域和面板权限；显式target与工程、使用无真实数据设备，确认状态绑定后再决定受控试用。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具链编排和结构化结果有源码支持；多会话目标作用域及面板权限待核对。显式设备/产物收据为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/host.js、lib/hdc-core.mjs、lib/panel.mjs、lib/skills.mjs、lib/compile-output.mjs、lib/compile-session-cwd.mjs、scripts/smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核心工具接线、设备core、面板路由与进程、运行时技能、工程目录和mock测试；未全量审计25工具和各平台，不将作者真机声明当本轮验收。
- 下一步：进一步探讨可从双会话双设备状态、面板认证、旧HAP和签名/沙箱失败四类反例入手，再对照人工流程衡量正确部署和恢复成本。

**分析版本**

- **仓库**：[1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge)
- **版本号**：0.10.2（[固定提交 51868ae](https://github.com/1na-ko/dsh-hdc-bridge/tree/51868ae19c9114ea1f7d148f708928c0c0d00e59)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究显式会话/设备/工程/产物收据，以双设备双工程和连接切换序列比较误投目标及人工负担，当前未验证。详见[Q06](#research-q06)。

进一步探讨可从双会话双设备状态、面板认证、旧HAP和签名/沙箱失败四类反例入手，再对照人工流程衡量正确部署和恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 47 | 41131 | — | — | 270128 |
| .cjs | source | 1 | 458 | 361 | 36 | — |
| .js | source | 2 | 3281 | 2860 | 324 | — |
| .mjs | source | 17 | 3453 | 2904 | 377 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=grey&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+created%3A2026-09-22T05%3A01%3A00.154Z..2026-10-22T05%3A01%3A00.154Z) [![近30天关闭 6](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=grey&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A01%3A00.154Z..2026-10-22T05%3A01%3A00.154Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何组织鸿蒙设备调试与知识/编译闭环，其目标、权限和成功判据是否足以支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要原生鸿蒙闭环，相对直接hdc有何贡献？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有鸿蒙工程、真机或模拟器和本机工具链的开发者，让DSH Agent完成观察设备、截图/布局、改码、构建部署再验证。合格结果不仅是命令exit0，还需要正确目标设备、有效HAP与实际界面/运行状态符合任务。简单替代是人工执行hdc、DevEco和文档查询，再把截图与日志交给模型；MCP工具也已覆盖hdc层，因此不能把复用hdc协议记为原创。

插件增量在DSH原生工具结果、图片读取路径、会话工程目录、知识优先级和可解释失败的组合。skills明确先确定API版本、读本机SDK声明再查官方材料，编译能力移植也在源码声明上游归属。这些把分散操作组织成闭环，但不保证模型改代码正确或界面任务已达成。设备控制、签名与清数据等需要开发者实际掌握目标权限，不能只按工具数量评价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-12](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/README.md#L1-L12)

作者自述不重写hdc协议，价值是DSH闭环。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh-hdc-bridge

> DSH 原生鸿蒙开发助手：`hdc` 设备闭环调试（看设备 → 截图 → 看图 → 改码 → 装包 → 验证）＋ 官方优先版本化知识层（离线 Tier-1 随包 + SDK 机读 + 官方文档检索）＋ 可选官方 DevEco CLI 构建/签名通道。
> A DSH-native HarmonyOS dev assistant: the hdc device loop (inspect → screenshot → view → fix → install → verify), an official-first version-classified knowledge layer (offline Tier-1 bundled + SDK-accurate reads + official docs search), and an optional official DevEco CLI build/sign backend.

## 定位

[hdc_mcp](https://github.com/yushun667/hdc_mcp) 等 MCP 服务器已覆盖 hdc 能力层。本插件不重写 hdc 协议，直接复用本机 hdc 二进制（3.x），价值在 DSH 原生层：

- 会话内工具卡片与 `read_image` 原生闭环
- 按调用会话解析沙箱策略（与 `pwsh` 工具同款路线），截图写入 `<workspace>/.dsh-hdc/screenshots/`
- 结构化的失败上报（hdc 传输层退出码不可靠，插件用输出标记 + 落盘校验兜底）
```

</details>

**依据 2 · 源码核查**：[lib/skills.mjs:65-84](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/skills.mjs#L65-L84)

知识优先级与版本纪律是已有指导设计。

<details>
<summary>查看原文（20行）</summary>

```text
    name: 'harmonyos-knowledge',
    description: '鸿蒙开发知识层使用纪律：官方优先、按 API 版本分类、许可合规（hms_knowledge / hms_api / hms_docs / hms_api_change / hms_lint）。',
    whenToUse: '回答任何 ArkTS / ArkUI / API 能力、版本兼容性、废弃 API、lint 规范问题之前；或需要判断某 API 在目标版本是否可用时。',
    content: [
      '# 鸿蒙知识层使用纪律（官方优先、版本化、许可合规）',
      '',
      '## 数据源层级（严格按序，上层优先）',
      '**Tier 0 官方一手（本机运行时读取，随用户工具链版本，零再分发）**',
      '- hms_api：本机 SDK .d.ts，每条 API 带 @since/@deprecated/@syscap，精确到 API 版本 —— 回答"某 API 何时有/何时废弃"的首选',
      '- hms_docs：devecocli 官方本地文档库（开发指南/API 参考）',
      '- hms_api_change：官方跨版本破坏性变更扫描（check compat）',
      '- hms_lint rules：本机 DevEco 内置官方 lint 规则（Apache-2.0，本地读取）',
      '**Tier 1 随包内置（离线可用，无需 Studio/SDK/网络）**',
      '- hms_knowledge：OpenHarmony 官方文档逐字节选（CC-BY-4.0 已署名）—— 28 篇高频官方文档：API 模块（promptAction/router/notification/vibrator/http/ws/preferences/util/uiAbility/权限/context/hilog/abilityManager…）、窗口 window/Window 类、导航组件 Navigation、应用模型与 ArkTS 状态管理指南。catalog 列题 → read 先看目录再按小节读 → search 按关键词找题/小节',
      '- deveco-cli 技能（官方 SKILL.md 改写，MIT 已声明）',
      '**Tier 2 用户自装（仅指路，绝不随包）**：harmony-next.skills 等社区包（无 LICENSE，不可再分发）；官方 web 文档 developer.huawei.com（在线检索时优先官方站）',
      '',
      '## 查询速查',
      '- 概念/用法/示例（人读文档）：先 hms_knowledge（离线随包，秒回）；全量官方库走 hms_docs（需 devecocli）',
      '- 签名/版本/废弃判定（机读精确）：hms_api 的 @since/@deprecated/@syscap',
```

</details>

**依据 3 · 源码核查**：[lib/compile-session-cwd.mjs:1-8](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/compile-session-cwd.mjs#L1-L8)

会话编译目录能力明确上游归属。

```text
// Session-scoped HarmonyOS project root for the compile-assistance tools
// (switch_cwd stores it; build_project / start_app / arkts_check / hdc_log
// resolve it). In-process Map keyed by session id, mirroring the DevEco Code
// session-cwd helper:
//   gitcode.com/openharmony-sig/deveco-code
//   packages/opencode/src/tool/lib/session-cwd.ts
//   packages/opencode/src/tool/switch-cwd.ts
// Copyright (c) 2026 Huawei Device Co., Ltd. — Apache-2.0 (see notices.json).
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设备选择、Shell调用和错误如何流动？

**研究主题**：功能与机制

#### 完整回答

host注入shell/tools，按调用agent.session解析sandboxPolicy，再把command、timeout、输出上限、策略和workdir交给shell.resolve。适配新execute/result与旧run表面，core负责发现hdc、探测版本和构造目标命令。runHdc以退出码、timedOut与aborted给基础结果，具体安装/构建等再解释输出和产物。注册器统一捕获异常转为ok:false/error/hint，让模型看业务结果而非只依赖工具层异常。

设备请求显式target先写preferred，未给target优先复用仍Connected的preferred，否则选第一个Connected，再退到首条记录。这方便单设备调用，却不是多设备下的主动确认。截图工具落盘后提供给read_image；构建路径还有HAP检查，实际设备业务结果仍需后续观察。所谓闭环应由模型或人继续验证，而不是API返回ok就自动宣告任务完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:104-116](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/host.js#L104-L116)

按调用会话解析策略。

<details>
<summary>查看原文（13行）</summary>

```text
  // Resolve the per-call sandbox policy like the official pwsh tool does:
  // the calling session's immutable cwd is the workspace boundary. Without a
  // session, fall back to the deployment policy (the executor's own default).
  function resolvePolicyFor(exec) {
    if (!sandboxPolicy || typeof sandboxPolicy.resolve !== 'function') return undefined
    try {
      if (exec && exec.agent && exec.agent.session) return sandboxPolicy.resolve({ session: exec.agent.session })
      const session = realmSession()
      if (session) return sandboxPolicy.resolve({ session })
      return sandboxPolicy.resolve({})
    } catch {
      return undefined
    }
```

</details>

**依据 2 · 源码核查**：[lib/host.js:160-172](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/host.js#L160-L172)

Shell请求与版本seam接线。

<details>
<summary>查看原文（13行）</summary>

```text
  async function runShellRaw(command, timeoutMs, stdoutMaxBytes, policy, workdir) {
    const request = { command, timeoutMs, stdoutMaxBytes }
    const root = policyRoot(policy)
    if (policy !== undefined) request.sandboxPolicy = policy
    if (workdir) request.workdir = workdir
    else if (root) request.workdir = root
    const spec = shell.resolve(request)
    // DSH 0.2.0-rc.2 replaced ShellExecutor.run() with execute(spec) → a process
    // handle whose result() resolves to the same ShellRunResult — exitCode,
    // signal, timedOut, aborted, timeoutMs, stdout.text, stderr.text — that
    // every runShellRaw caller already consumes, so the new seam is the primary
    // path. Hosts on the older line (0.0.1-rc.5 through 0.1.5-rc.3, still what
    // npm's latest tag points at for the seam packages) expose run() instead:
```

</details>

**依据 3 · 源码核查**：[lib/host.js:648-664](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/host.js#L648-L664)

异常转结构化业务失败。

<details>
<summary>查看原文（17行）</summary>

```text
  function registerTool(definition) {
    const execute = definition && definition.execute
    if (typeof execute === 'function') {
      definition = {
        ...definition,
        async execute(args, exec) {
          try {
            return await execute.call(this, args, exec)
          } catch (e) {
            const message = String((e && e.message) || e)
            logInfo('[hdc-bridge] ' + (definition.name || 'tool') + ' threw: ' + message.slice(0, 200))
            return { ok: false, error: message, hint: throwHint(message) }
          }
        },
      }
    }
    ctx.tools.register(definition)
```

</details>

**依据 4 · 源码核查**：[lib/hdc-core.mjs:99-124](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/hdc-core.mjs#L99-L124)

基础执行结果和超时/取消判据。

<details>
<summary>查看原文（26行）</summary>

```text
  async function runHdc(argv, opts, policy) {
    opts = opts || {}
    if (!hdcPath) return { ok: false, exitCode: null, stdout: '', stderr: hdcError, timedOut: false, aborted: false }
    const full = []
    if (opts.target) {
      if (!TARGET_RE.test(opts.target)) return { ok: false, exitCode: null, stdout: '', stderr: 'invalid target id', timedOut: false, aborted: false }
      full.push('-t', psQuote(opts.target))
    }
    full.push(...argv)
    let result
    try {
      result = await runShellRaw(buildCommand(full), opts.timeoutMs || 30000, opts.stdoutMaxBytes || 262144, policy)
    } catch (e) {
      return { ok: false, exitCode: null, stdout: '', stderr: String(e && e.message ? e.message : e), timedOut: false, aborted: false }
    }
    const out = (result.stdout && result.stdout.text) || ''
    const err = (result.stderr && result.stderr.text) || ''
    return {
      ok: result.exitCode === 0 && !result.timedOut && !result.aborted,
      exitCode: result.exitCode,
      timedOut: result.timedOut === true,
      aborted: result.aborted === true,
      stdout: out,
      stderr: err,
      stdoutTruncated: (result.stdout && result.stdout.truncated) === true,
    }
```

</details>

**依据 5 · 源码核查**：[lib/hdc-core.mjs:156-181](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/hdc-core.mjs#L156-L181)

preferred与自动选择实际实现。

<details>
<summary>查看原文（26行）</summary>

```text
  function pickTarget(list, requested) {
    if (requested) return requested
    const connected = list.find((t) => /connected/i.test(t.state))
    return connected ? connected.id : (list[0] ? list[0].id : '')
  }

  // Session-scoped device memory: the last explicitly used or panel-
  // selected target, reused by every tool call that omits `target`.
  let preferredTarget = ''

  async function currentTarget(requested, policy) {
    const list = await listTargets(policy)
    const clean = requested ? String(requested).trim() : ''
    if (clean) {
      preferredTarget = clean
      return { target: clean, error: '' }
    }
    if (preferredTarget && list.targets.some((t) => t.id === preferredTarget && /connected/i.test(t.state))) {
      return { target: preferredTarget, error: '' }
    }
    const target = pickTarget(list.targets, '')
    if (!target) {
      return { target: '', error: 'No HarmonyOS device/emulator connected. Connect one (hdc_connect 127.0.0.1:5555 for an emulator) or start a DevEco emulator.' }
    }
    preferredTarget = target
    return { target, error: '' }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 面板与工具层是否共享权限及目标边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能将全插件概括为所有执行都经过同一会话沙箱。工具层明确传sandboxPolicy给宿主Shell，面板模块则以固定只读命令直接execFile，另有超时和缓存；面板REST路由返回设备状态和截图，还能改变preferred选择。所读路由片段只做HTTP method和目标是否Connected的检查，没有本地独立认证/来源判断，是否受宿主路由政策保护需另行确定。固定只读命令减少参数面，但截图与日志仍可能敏感。

设备preferred在createHdcCore闭包里是单个字符串，而编译cwd另用sessionID Map。源码注释称设备“session-scoped”，能否成立取决于宿主是否为每个会话隔离插件core实例，不能仅凭注释确认多会话互不干扰。自动选择第一个Connected也可能把未显式target的修改动作落到非预期设备。建议在多设备/多会话环境明确target并核对连接列表；本轮没有运行复现串扰或越权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/panel.mjs:1-8](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/panel.mjs#L1-L8)

面板明确采用直接hdc spawns。

```text
// Host half of the floating dev panel (web hosts only; headless profiles
// never fire the webServer inject, so they stay unchanged).
//
// The panel shows the WHOLE plugin, not just hdc: device detail (model,
// brand, OS, battery), system stats (memory/storage/display), hilog tail,
// per-device screenshots, and the plugin's own toolchain + knowledge state.
// Data comes from direct hdc spawns (fixed read-only command set, hard
// timeouts, watchdog) plus a toolchain bridge from the plugin services.
```

**依据 2 · 源码核查**：[lib/panel.mjs:30-42](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/panel.mjs#L30-L42)

直接execFile及固定超时。

<details>
<summary>查看原文（13行）</summary>

```text
function defaultProbe() {
  return {
    accessOk(p) { try { accessSync(p, constants.X_OK); return true } catch (e) { return false } },
    run(file, args, timeoutMs, maxBuffer) {
      return new Promise((resolve) => {
        try {
          execFile(file, args, { timeout: timeoutMs || 12000, maxBuffer: maxBuffer || 65536, windowsHide: true }, (error, stdout, stderr) => {
            resolve({ ok: !error, stdout: String(stdout || ''), stderr: String(stderr || (error && error.message) || '') })
          })
        } catch (e) {
          // Restricted sandboxes throw EPERM synchronously — degrade like runHdc does.
          resolve({ ok: false, stdout: '', stderr: String(e && e.message ? e.message : e) })
        }
```

</details>

**依据 3 · 源码核查**：[lib/panel.mjs:300-331](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/panel.mjs#L300-L331)

状态、刷新、选择和截图路由的本地校验。

<details>
<summary>查看原文（32行）</summary>

```text
  if (typeof ctx.inject === 'function') {
    ctx.inject(['webServer'], (webCtx) => {
      const ws = webCtx.webServer
      if (!ws || typeof ws.register !== 'function') return
      const register = (kind, path, handler) => webCtx.effect(() => ws.register({ kind, path, handler }), 'hdc-bridge panel: ' + path)
      register('exact', '/api2/hdc-bridge/panel-state', async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { ok: false, error: 'method not allowed' })
        if (!cache.state || Date.now() - cache.at > STATE_TTL) await refreshWithWatchdog(false, '')
        sendJson(res, 200, cache.state)
      })
      register('exact', '/api2/hdc-bridge/refresh', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method not allowed' })
        const body = await readBody(req)
        await refreshWithWatchdog(!body || body.shot !== false, body && typeof body.target === 'string' ? body.target.trim() : '')
        sendJson(res, 200, cache.state)
      })
      register('exact', '/api2/hdc-bridge/select', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method not allowed' })
        const body = await readBody(req)
        const target = body && typeof body.target === 'string' ? body.target.trim() : ''
        if (!target) return sendJson(res, 400, { ok: false, error: 'target is required' })
        const list = await listTargets()
        const hit = (list.targets || []).find((d) => d.id === target && /connected/i.test(d.state))
        if (!hit) return sendJson(res, 400, { ok: false, error: 'target is not connected: ' + target })
        if (bridge.setPreferred) bridge.setPreferred(target)
        await refreshWithWatchdog(false, '')
        sendJson(res, 200, cache.state)
      })
      register('exact', '/api2/hdc-bridge/screenshot.jpeg', (req, res) => {
        if (!cache.shotBytes) return sendJson(res, 404, { ok: false, error: 'no screenshot yet; POST /api2/hdc-bridge/refresh with {shot:true} first' })
        res.writeHead(200, { 'content-type': 'image/jpeg', 'cache-control': 'no-store' })
        res.end(cache.shotBytes)
```

</details>

**依据 4 · 源码核查**：[lib/hdc-core.mjs:162-181](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/hdc-core.mjs#L162-L181)

preferred是core闭包单值。

<details>
<summary>查看原文（20行）</summary>

```text
  // Session-scoped device memory: the last explicitly used or panel-
  // selected target, reused by every tool call that omits `target`.
  let preferredTarget = ''

  async function currentTarget(requested, policy) {
    const list = await listTargets(policy)
    const clean = requested ? String(requested).trim() : ''
    if (clean) {
      preferredTarget = clean
      return { target: clean, error: '' }
    }
    if (preferredTarget && list.targets.some((t) => t.id === preferredTarget && /connected/i.test(t.state))) {
      return { target: preferredTarget, error: '' }
    }
    const target = pickTarget(list.targets, '')
    if (!target) {
      return { target: '', error: 'No HarmonyOS device/emulator connected. Connect one (hdc_connect 127.0.0.1:5555 for an emulator) or start a DevEco emulator.' }
    }
    preferredTarget = target
    return { target, error: '' }
```

</details>

**依据 5 · 源码核查**：[lib/compile-session-cwd.mjs:13-32](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/compile-session-cwd.mjs#L13-L32)

工程cwd确实按sessionID存储，不能混同。

<details>
<summary>查看原文（20行）</summary>

```text
const sessionCwd = new Map()

export function setSessionCwd(sessionID, cwd) {
  const id = String(sessionID || '').trim()
  const dir = String(cwd || '').trim()
  if (!id || !dir) return
  sessionCwd.set(id, dir)
}

export function getSessionCwd(sessionID) {
  if (!sessionID) return undefined
  return sessionCwd.get(sessionID)
}

export function clearSessionCwd(sessionID) {
  if (!sessionID) {
    sessionCwd.clear()
    return
  }
  sessionCwd.delete(sessionID)
```

</details>

#### 缺口

- 宿主插件实例作用域与/api2自定义路由权限未固定。
  **影响**：影响多会话目标隔离和设备截图访问边界。
  **进一步探讨**：读取部署DSH固定提交的插件realm/路由注册策略，确认core每会话实例及REST认证，再判断共享部署范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工具链和知识可信度依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

实际操作依赖本机hdc、设备连接/授权、DevEco Studio或独立CLT、SDK、JBR/Java与项目签名条件；离线知识读取则不需要完整工具链。skills把原始SDK机读与官方节选分层，避免把旧文档当新API事实。随包知识和技能引用有上游许可说明，是内容来源管理，不等于每个API在当前工程都可用。

签名需要用户先完成devecocli auth login，源码会检查auth status输出，空输出或受限mojo通道不当成功。受限宿主策略可能阻断CLI和构建，回退到hvigor/hdc仍要核对产物，不能把“fallback执行了”当正确构建。编译目录可由switch_cwd改变但独立于immutable工作区策略，维护者需要知道工程根和权限边界不一定相同。目标API也可能由工程、设备、SDK不同来源给出，缺失或冲突应保留为条件而非自动选最新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/skills.mjs:20-64](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/skills.mjs#L20-L64)

官方CLI适配、平台条件及签名人工前提。

<details>
<summary>查看原文（45行）</summary>

```text
    name: 'deveco-cli',
    description: '华为官方 DevEco CLI（devecocli）构建/签名/lint/文档通道：hms_build、hms_lint、hms_docs、hms_api_change 的底层命令与约束。',
    whenToUse: '需要用官方工具链构建/签名/运行鸿蒙应用、跑官方 lint、查官方本地文档、扫描跨版本破坏性 API 变更时；或用户提到 devecocli/DevEco CLI。',
    content: [
      '# DevEco CLI（devecocli）技能',
      '',
      '> 本技能改写自华为官方仓库 SKILL.md（翻译摘要，非逐字复制）。',
      '> Copyright (c) 2026 Huawei Device Co., Ltd. — MIT License.',
      '> 官方原文：https://gitcode.com/openharmony-sig/deveco-cli/blob/develop/SKILL.md',
      '',
      '## 入口（本插件工具，优先用它们，参数已校验）',
      '- hms_build：status / build / run / sign / clean（CLI 缺失时自动回退本机 hvigorw）',
      '- hms_lint：rules（本机 57+ 官方规则索引）/ read-rule / check（devecocli check lint）',
      '- hms_docs：search / read / catalog（devecocli docs，官方本地文档库）',
      '- hms_api_change：versions / diff（devecocli check compat，官方跨版本破坏性变更扫描）',
      '',
      '## 安装与工具链形态（二选一）',
      '- A｜Studio 路线：npm i -g @deveco/deveco-cli（macOS/Windows，Node ≥18），本机装 DevEco Studio ≥6.0。',
      '- B｜独立 Command Line Tools（CLT）：华为官方 zip 发行版（codelinter/hvigorw/ohpm/emulator/内嵌 SDK），≥26.0.0，**Linux 仅此形态**。解压后把 <clt>/bin 加入 PATH，并设 DEVECO_CLI_CLT_PATH=<解压目录>（deveco-cli 不自动发现 CLT）。下载：developer.huawei.com/consumer/cn/download/command-line-tools-for-hmos。',
      '- 本插件会自动探测两种形态并把对应根注入环境变量；hms_setup 一眼可查当前 toolchainKind。',
      '',
      '## 直接命令速查',
      '- `build`：编译打包。`--modules <m1> <m2>@<target>` 指定模块；`--product <name>` 打整包；`build clean` 清理。',
      '- `run`：构建+安装+启动。`--module`、`--device <name|serial>`（多设备必填）、`--uninstall`（先卸载，解决签名 key 变更）、`--skip-build`、`--apply <file>` 增量快速部署（Studio ≥6.1.1）。',
      '- `check lint [path]`：官方 ArkTS lint。`--fix`、`--format json`（需 Studio ≥6.1.0）、`--limit <n>`。',
      '- `check compat`：扫描两个 SDK 版本间的破坏性 API 变更。`versions` 列可用版本；`--source-version X --target-version Y --format json --output-path <dir>`；必须 target > source。',
      '- `signature generate`：自动生成签名材料并写入 build-profile.json5。前置：`auth login` + 项目目录 + 已连接设备。',
      '- `auth login/status/logout`：华为开发者账号 OAuth（浏览器人工步骤）。',
      '- `docs search <kw>` / `docs read <id>` / `docs catalog`：官方本地文档检索。',
      '- `emulator list/start/stop`、`ui layout/screenshot/click/text`、`log --crash --bundle-name X`、`create --app-name X --api-level N`、`skills list/add`。',
      '',
      '## 硬性约束',
      '- Node ≥18；构建/签名/lint 需本机工具链：DevEco Studio ≥6.0（lint 默认，`--format json` 需 ≥6.1.0，`--apply` 需 ≥6.1.1）或独立 Command Line Tools ≥26.0.0（CLT 无内嵌 JDK，CI 场景另配 JAVA_HOME）。',
      '- 官方标注 [Outside sandbox]：build / run / signature generate / update / check compat —— 在受限沙箱中运行时提示用户放宽策略或人工执行。',
      '- 签名前置 `auth login` 是浏览器 OAuth，Agent 无法代办；未登录时给用户命令，不重试。',
      '',
      '## 错误速查',
      '- `Not logged in` → devecocli auth login',
      '- `error:install sign info inconsistent` → devecocli run --uninstall 或 signature generate --force',
      '- `Provision number exceeds limit` → AGC 控制台删旧测试 profile',
      '- `Product / Build mode not found` → 检查 build-profile.json5',
      '- `Multiple entry modules` → build 加 --modules，run 加 --module',
    ].join('\n'),
  }),
  skill({
```

</details>

**依据 2 · 源码核查**：[lib/skills.mjs:65-84](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/skills.mjs#L65-L84)

SDK/官方知识层级。

<details>
<summary>查看原文（20行）</summary>

```text
    name: 'harmonyos-knowledge',
    description: '鸿蒙开发知识层使用纪律：官方优先、按 API 版本分类、许可合规（hms_knowledge / hms_api / hms_docs / hms_api_change / hms_lint）。',
    whenToUse: '回答任何 ArkTS / ArkUI / API 能力、版本兼容性、废弃 API、lint 规范问题之前；或需要判断某 API 在目标版本是否可用时。',
    content: [
      '# 鸿蒙知识层使用纪律（官方优先、版本化、许可合规）',
      '',
      '## 数据源层级（严格按序，上层优先）',
      '**Tier 0 官方一手（本机运行时读取，随用户工具链版本，零再分发）**',
      '- hms_api：本机 SDK .d.ts，每条 API 带 @since/@deprecated/@syscap，精确到 API 版本 —— 回答"某 API 何时有/何时废弃"的首选',
      '- hms_docs：devecocli 官方本地文档库（开发指南/API 参考）',
      '- hms_api_change：官方跨版本破坏性变更扫描（check compat）',
      '- hms_lint rules：本机 DevEco 内置官方 lint 规则（Apache-2.0，本地读取）',
      '**Tier 1 随包内置（离线可用，无需 Studio/SDK/网络）**',
      '- hms_knowledge：OpenHarmony 官方文档逐字节选（CC-BY-4.0 已署名）—— 28 篇高频官方文档：API 模块（promptAction/router/notification/vibrator/http/ws/preferences/util/uiAbility/权限/context/hilog/abilityManager…）、窗口 window/Window 类、导航组件 Navigation、应用模型与 ArkTS 状态管理指南。catalog 列题 → read 先看目录再按小节读 → search 按关键词找题/小节',
      '- deveco-cli 技能（官方 SKILL.md 改写，MIT 已声明）',
      '**Tier 2 用户自装（仅指路，绝不随包）**：harmony-next.skills 等社区包（无 LICENSE，不可再分发）；官方 web 文档 developer.huawei.com（在线检索时优先官方站）',
      '',
      '## 查询速查',
      '- 概念/用法/示例（人读文档）：先 hms_knowledge（离线随包，秒回）；全量官方库走 hms_docs（需 devecocli）',
      '- 签名/版本/废弃判定（机读精确）：hms_api 的 @since/@deprecated/@syscap',
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1956-1966](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/host.js#L1956-L1966)

签名auth输出和受限通道检查。

<details>
<summary>查看原文（11行）</summary>

```text
        const status = await runCli(cli, ['auth', 'status'], { timeoutMs: 30000, stdoutMaxBytes: 16384, workdir: base }, policy)
        if (mojoFatal(status)) {
          return { ...outside, backend: 'devecocli', ok: false, stage: 'auth', error: 'devecocli mojo platform channel blocked in this sandbox (0x5) — sign needs [Outside sandbox] execution' }
        }
        const authOut = (status.stdout + status.stderr).trim()
        if (!authOut) {
          return { ...outside, backend: 'devecocli', ok: false, stage: 'auth', emptyOutput: true, error: 'devecocli auth status returned no output — the mojo channel is blocked in this sandbox, so the login state cannot be verified and signature generation would silently do nothing. Run devecocli auth login in a host terminal, or sign in DevEco Studio (Project Structure > Signing Configs).' }
        }
        const loggedIn = status.ok && !/not logged|未登录|not log in/i.test(authOut)
        if (!loggedIn) {
          return { ...outside, backend: 'devecocli', ok: false, stage: 'auth', error: 'Not logged in. Run once in a terminal: devecocli auth login (browser OAuth), then retry. A connected device is also required for device registration.' }
```

</details>

**依据 4 · 源码核查**：[lib/compile-session-cwd.mjs:39-49](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/compile-session-cwd.mjs#L39-L49)

项目根识别仅检查结构文件。

<details>
<summary>查看原文（11行）</summary>

```text
export function isHarmonyApplicationRoot(dir) {
  const isFile = (file) => {
    try {
      return statSync(file).isFile()
    } catch {
      return false
    }
  }
  if (isFile(join(dir, 'AppScope', 'app.json5'))) return true
  if (!isFile(join(dir, 'build-profile.json5'))) return false
  return isFile(join(dir, 'oh-package.json5')) || isFile(join(dir, 'oh-package.json'))
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程和三阶段成本怎样？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

可借鉴的是core抽离发现与目标漏斗、业务ok/error/hint统一、构建stdout/stderr清ANSI并保留尾部状态，以及对CLI不可靠成功信号再看实际产物。它们降低模型误把传输成功当业务成功的机会；但错误hint中“改用danger-full-access”只是插件建议，不能变成自动放宽权限授权。smoke源码以fake Shell驱动，未匹配命令默认空成功，能检查包装规则但不能证明设备/工具链真兼容，本轮也未执行。

首次成本是安装SDK/Studio或CLT、连接设备、签名与本地知识版本核对；持续成本包括编译资源、包安装、截图日志文件和面板轮询，设备操作可能修改应用数据。失败恢复要核对构建产物是否旧、安装部分状态、目标设备以及签名/权限问题，不应盲目clean或重装。没有任务耗时、API费或正确修复率的本轮实测，不能从工具集成推导节省比例；现金依工具链/设备和模型环境，人工学习与调试需单列。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:638-664](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/host.js#L638-L664)

错误hint与统一失败契约。

<details>
<summary>查看原文（27行）</summary>

```text
  // here so the { ok: false, error, hint } contract holds for all 25 tools.
  function throwHint(message) {
    if (isEnvFailure(message)) {
      return 'The host could not run this command: ' + (policyBlockedReason(undefined) === 'no usable sandbox policy for this call'
        ? 'no usable sandbox backend for the requested policy.'
        : policyBlockedReason(undefined)) + ' Restart DSH from a directory outside the OS temp tree (on Windows, not %USERPROFILE%), or re-run the session with danger-full-access.'
    }
    return 'Unexpected host error; run hdc_diag for the resolved shell flavor, hdc path and sandbox policy.'
  }

  function registerTool(definition) {
    const execute = definition && definition.execute
    if (typeof execute === 'function') {
      definition = {
        ...definition,
        async execute(args, exec) {
          try {
            return await execute.call(this, args, exec)
          } catch (e) {
            const message = String((e && e.message) || e)
            logInfo('[hdc-bridge] ' + (definition.name || 'tool') + ' threw: ' + message.slice(0, 200))
            return { ok: false, error: message, hint: throwHint(message) }
          }
        },
      }
    }
    ctx.tools.register(definition)
```

</details>

**依据 2 · 源码核查**：[lib/compile-output.mjs:62-105](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/compile-output.mjs#L62-L105)

尾部截断和状态保留。

<details>
<summary>查看原文（44行）</summary>

```text
export function formatBuildProjectOutput(opts) {
  const maxLines = opts.maxLines ?? MAX_OUTPUT_LINES
  const out = stripAnsi(opts.stdout)
  const err = stripAnsi(opts.stderr)
  const fullBody = formatStdoutStderr(opts.stdout, opts.stderr)
  const status = formatBuildStatusLine(opts.exitCode)
  const full = fullBody ? `${fullBody}\n${status}` : status

  const outLines = splitLines(out)
  const errLines = splitLines(err)
  const total = outLines.length + errLines.length

  let outBudget
  let errBudget
  if (outLines.length === 0) {
    outBudget = 0
    errBudget = maxLines
  } else if (errLines.length === 0) {
    outBudget = maxLines
    errBudget = 0
  } else if (total <= maxLines) {
    outBudget = outLines.length
    errBudget = errLines.length
  } else {
    outBudget = Math.ceil(maxLines / 2)
    errBudget = Math.floor(maxLines / 2)
    if (outLines.length < outBudget) {
      errBudget = maxLines - outLines.length
      outBudget = outLines.length
    } else if (errLines.length < errBudget) {
      outBudget = maxLines - errLines.length
      errBudget = errLines.length
    }
  }

  const outCut = takeLastLines(outLines, outBudget)
  const errCut = takeLastLines(errLines, errBudget)
  const truncated = total > maxLines || outCut.truncated || errCut.truncated

  const previewBody = `${outCut.lines.join('\n')}${errCut.lines.join('\n')}`
  const preview = previewBody ? `${previewBody}\n${status}` : status
  const text = truncated ? `${TRUNCATE_NOTICE}\n${preview}` : preview

  return { text, truncated, preview, full }
```

</details>

**依据 3 · 源码核查**：[scripts/smoke.mjs:1-4](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/scripts/smoke.mjs#L1-L4)

fake Shell验证范围。

```text
// dsh-hdc-bridge regression suite (no real hdc required — fake shell drives
// everything except panel.mjs, whose direct hdc spawn is exercised only for
// its graceful-degradation paths). Run: node scripts/smoke.mjs
const MOD_URL = new URL('../lib/host.js', import.meta.url).href
```

**依据 4 · 源码核查**：[scripts/smoke.mjs:24-39](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/scripts/smoke.mjs#L24-L39)

默认未匹配为空成功，限定测试证明。

<details>
<summary>查看原文（16行）</summary>

```text
let connected = ['DEV_A', 'DEV_B']
function deviceRows(list) { return list.map((id) => id + '\t\ttcp\tConnected\tlocalhost\thdc').join('\n') }
// First matching rule answers the command; default stays empty-success so
// unmatched probes degrade exactly like a silent failure would.
const DEFAULT_RULES = [
  [(c) => c.includes('list targets'), () => deviceRows(connected)],
  [(c) => c.includes('hilog'), () => 'I 00000/HiLog: smoke line'],
  [(c) => c.includes('PSVersionTable'), () => '7'],
  [(c) => c.includes('hdc') && c.includes('-v'), () => 'Ver: 3.2.0c'],
]
function outcomeFor(rules, spec, sink) {
  const cmd = spec.command || ''
  if (sink) sink.push(cmd)
  for (const [pred, reply] of rules) {
    if (pred(cmd)) { const text = typeof reply === 'function' ? reply(cmd) : reply; return { stdout: { text }, stderr: { text: '' }, exitCode: 0, timedOut: false } }
  }
```

</details>

#### 缺口

- 缺少目标平台的构建/部署正确率、面板负担与恢复投入对照。
  **影响**：不能确定集成便利相对手工工具链的净收益。
  **进一步探讨**：固定工程、设备和模型，对比独立hdc/CLI与插件流程的合格任务、总时间和恢复操作。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可推导何种改进，当前如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把每次修改设备的调用绑定到显式会话/设备/工程/产物收据，在执行前展示或确认不可省略目标，结果回指同一设备的观察证据。推导来自默认设备便利与多会话作用域不明、构建传输信号不足的张力。最小验证用两个模拟目标、两个工程和连接切换序列，对比默认preferred与显式绑定的误投目标、重复安装和人工确认次数；若只增加确认却不能防止绑定漂移，应否定该设计。

当前建议观察，适合已有鸿蒙工具链的维护者继续核对宿主实例和面板权限。单人单设备可降低风险，但当前源码不能普遍承诺会话隔离，先固定target、工程和允许动作，再定义不含真实数据的受控试用。需要多用户远程设备管理或无人值守破坏性动作时，不宜把该工具集当隔离系统。没有本轮安装、核心操作和卸载验收，不能给值得安装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hdc-core.mjs:156-181](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/hdc-core.mjs#L156-L181)

默认目标与preferred是改进推导起点。

<details>
<summary>查看原文（26行）</summary>

```text
  function pickTarget(list, requested) {
    if (requested) return requested
    const connected = list.find((t) => /connected/i.test(t.state))
    return connected ? connected.id : (list[0] ? list[0].id : '')
  }

  // Session-scoped device memory: the last explicitly used or panel-
  // selected target, reused by every tool call that omits `target`.
  let preferredTarget = ''

  async function currentTarget(requested, policy) {
    const list = await listTargets(policy)
    const clean = requested ? String(requested).trim() : ''
    if (clean) {
      preferredTarget = clean
      return { target: clean, error: '' }
    }
    if (preferredTarget && list.targets.some((t) => t.id === preferredTarget && /connected/i.test(t.state))) {
      return { target: preferredTarget, error: '' }
    }
    const target = pickTarget(list.targets, '')
    if (!target) {
      return { target: '', error: 'No HarmonyOS device/emulator connected. Connect one (hdc_connect 127.0.0.1:5555 for an emulator) or start a DevEco emulator.' }
    }
    preferredTarget = target
    return { target, error: '' }
```

</details>

**依据 2 · 源码核查**：[lib/panel.mjs:316-326](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/panel.mjs#L316-L326)

面板可修改preferred。

<details>
<summary>查看原文（11行）</summary>

```text
      register('exact', '/api2/hdc-bridge/select', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'method not allowed' })
        const body = await readBody(req)
        const target = body && typeof body.target === 'string' ? body.target.trim() : ''
        if (!target) return sendJson(res, 400, { ok: false, error: 'target is required' })
        const list = await listTargets()
        const hit = (list.targets || []).find((d) => d.id === target && /connected/i.test(d.state))
        if (!hit) return sendJson(res, 400, { ok: false, error: 'target is not connected: ' + target })
        if (bridge.setPreferred) bridge.setPreferred(target)
        await refreshWithWatchdog(false, '')
        sendJson(res, 200, cache.state)
```

</details>

**依据 3 · 源码核查**：[lib/compile-session-cwd.mjs:13-24](https://github.com/1na-ko/dsh-hdc-bridge/blob/51868ae19c9114ea1f7d148f708928c0c0d00e59/lib/compile-session-cwd.mjs#L13-L24)

工程按会话存储，可作为绑定的一部分。

<details>
<summary>查看原文（12行）</summary>

```text
const sessionCwd = new Map()

export function setSessionCwd(sessionID, cwd) {
  const id = String(sessionID || '').trim()
  const dir = String(cwd || '').trim()
  if (!id || !dir) return
  sessionCwd.set(id, dir)
}

export function getSessionCwd(sessionID) {
  if (!sessionID) return undefined
  return sessionCwd.get(sessionID)
```

</details>

#### 缺口

- 多会话实例、面板认证与目标绑定验收未形成完整证据。
  **影响**：阻碍当前升级为可控通用试用。
  **进一步探讨**：先核对宿主作用域和路由权限，再设计双设备双会话反例与明确停止标准。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
