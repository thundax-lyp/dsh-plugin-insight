# dsh-hdc-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[61b3e6d](https://github.com/1na-ko/dsh-hdc-bridge/tree/61b3e6d827e644c96fdfb527114ef9e5e3b17e06)

<!-- BEGIN META -->
[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,874](https://img.shields.io/static/v1?label=npm+30d&message=1%2C874&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hdc-bridge)
<!-- END META -->

> **功能**：在 DSH 中连接鸿蒙设备调试、版本化 API 知识、工程构建和部署，并提供设备面板。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把成熟hdc、官方工具链和知识接入原生工具、图片与工程流程，结构化失败/产物核验减少只看命令成功的误判；不把上游协议/文档算原创。

> **主要限制**：[Q03](#research-q03) 的preferred设备单值需要宿主实例作用域才能兑现会话隔离，工具Shell和面板直接进程也不是同一权限通道。已有Host/Origin等请求栅栏，但多会话设备语义仍未运行验收。

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
  - [Q01 · 本包比直接 hdc 或官方 CLI 增加什么？](#detail-section-11)
  - [Q02 · 工具如何从会话走到设备与业务结果？](#detail-section-12)
  - [Q03 · 会话设备记忆和面板权限能否视为同一保证？](#detail-section-13)
  - [Q04 · 采用负担与受控探索应如何安排？](#detail-section-14)
  - [Q05 · 执行收据是否能减少目标混淆？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 为在 DSH 内反复改码、部署和看设备的鸿蒙开发者减少手动材料交接；合格结果是正确设备的真实行为，而非exit0。

直接hdc/官方CLI、SDK文档与人工图片/日志回传是基线。本包继承协议和编译知识，新增原生接缝，未做同条件效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设备列表/目标选择 | 确认连接设备 | 默认记忆作用域需核，多设备显式target |
| 安装与设备验证 | 部署hap并看UI/日志 | 有外部副作用，ok不替代真实验收 |
| Shell执行适配 | 通过宿主策略调用hdc | execute/result或旧run契约 |
| 构建产物检查 | 结合hap字段判断构建 | 存在不证明签名/新旧/业务正确 |
| 设备面板 | 同屏看设备状态 | 直接进程通道，有请求围栏非每会话授权 |
| 工程目录记忆 | 编译工具选工程 | sessionID内存Map，非耐久配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Shell/tools 与匹配API | 工具必需 | 策略解析、执行和注册 | 双seam均无则明确不兼容 |
| 本机hdc和调试授权设备 | 设备操作必需 | 连接/截图/安装/日志 | 无设备降级；多设备显式target |
| SDK、Studio或CLT、签名配置 | 构建部署按任务必需 | 编译/检查/签名 | 回退和错误提示不保证产物可装 |
| 图像模型 | 看截图时必需 | 理解设备图像 | 可改用UI dump文本但语义仍需核验 |
| Web客户端/服务与信任主机 | 面板必需 | 状态和截图路由 | headless不等于核心工具失败；围栏非会话授权 |
| 本地知识与目标API条件 | 知识任务必需 | 版本化查阅 | 文档存在不证明工程支持 |

[Q03](#research-q03) 的实例作用域需先确认，不能用依赖安装替代。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离样例工程/无真实数据设备，固定目标和工具链 | 版本/权限/target明确 |
| 核作用域 | 用户在两会话切换显式/默认设备并检查面板 | 接收设备与意图相同，否则停止部署 |
| 构建 | 模型调用工具，用户核ok和hap字段 | 不只读文字成功，旧产物人工核对 |
| 部署验证 | 用户明确target，工具安装并读UI/日志 | 正确设备实际行为合格 |
| 失败退出 | 停用工具/面板并回直接CLI | 核部分文件/设备变化，不假定回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 工具链/设备/存储和模型费用未知 | 连接/签名/API/作用域核对耗时未知 | npm零依赖不等于零环境负担 |
| 持续 | 构建/截图/日志与模型资源未知 | 复核目标、产物和真实行为 | 无节时对照 |
| 失败恢复 | 重编/重装资源未知 | 旧hap、设备数据、签名与权限核对 | 失败不证明副作用回滚 |
| 退出 | 备份/残留文件量未知 | 停用后回直接CLI，保留样例证据 | 设备操作的外部副作用需另查 |

以正确设备上一项合格应用行为为单位，缺尝试/合格数不算单位成本。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生设备闭环 | 工具注册、结果包装与图片/日志交接 | 目标设备正确性及用户效率 |
| 构建成功判断 | 输出和hap存在额外核查 | 产物新旧/签名与真实行为 |
| 面板请求限制 | Host/Origin/peer等独立栅栏 | 真实部署会话/设备授权 |
| 版本知识 | 接入SDK/官方材料声明 | 工程兑现与业务正确性 |

> **思考**：[Q03](#research-q03) 的preferred设备单值需要宿主实例作用域才能兑现会话隔离，工具Shell和面板直接进程也不是同一权限通道。已有Host/Origin等请求栅栏，但多会话设备语义仍未运行验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把成熟hdc、官方工具链和知识接入原生工具、图片与工程流程，结构化失败/产物核验减少只看命令成功的误判；不把上游协议/文档算原创。

[Q02](#research-q02) core抽离、Shell双契约适配和业务失败包装可借鉴；[Q03](#research-q03) 独立请求围栏值得复用但需匹配反向代理，设备单值状态不可直接当多会话设计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的preferred设备单值需要宿主实例作用域才能兑现会话隔离，工具Shell和面板直接进程也不是同一权限通道。已有Host/Origin等请求栅栏，但多会话设备语义仍未运行验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察作用域，在无真实数据设备上以显式target做列表/诊断，确认实例隔离和面板可达范围后再决定受控部署。目标、策略或产物不明确就停止自动化，回直接CLI逐步核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查原生工具、Shell接线、设备选择、面板围栏与产物判据；宿主实例作用域及目标设备运行未验收。收据方案待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/compile-session-cwd.mjs、lib/hdc-core.mjs、lib/host.js、lib/http-guard.mjs、lib/panel.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：人工定向核根组件host入口、Shell/工具包装、core设备、面板直接进程与http guard、工程cwd和构建产物；未全审全部工具、知识、签名/升级路线与各平台。
- 下一步：未运行目标代码、作者smoke、宿主或设备测试；作者矩阵保留为声明。下一步优先真实实例作用域与双设备/工程序列，随后核部署结果和恢复成本。

**分析版本**

- **仓库**：[1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge)
- **版本号**：0.10.3（[固定提交 61b3e6d](https://github.com/1na-ko/dsh-hdc-bridge/tree/61b3e6d827e644c96fdfb527114ef9e5e3b17e06)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用会话/工程/设备/产物收据连接已有状态，检验双设备双工程下的误投与确认负担；当前为未验证假设。

未运行目标代码、作者smoke、宿主或设备测试；作者矩阵保留为声明。下一步优先真实实例作用域与双设备/工程序列，随后核部署结果和恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 48 | 41172 | — | — | 271633 |
| .cjs | source | 1 | 458 | 361 | 36 | — |
| .mjs | source | 19 | 4021 | 3332 | 487 | — |
| .js | source | 2 | 3328 | 2895 | 335 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/1na-ko/dsh-hdc-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：设备闭环是否把调用会话、工程、设备和产物保持一致，代价与权限边界是否可核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本包比直接 hdc 或官方 CLI 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 内修改 HarmonyOS 工程、反复观察设备、安装和验证应用的开发者，是本包的具体对象。原办法是模型说明与手动 hdc/DevEco CLI 之间复制命令、截图、日志和知识；本包把这些交接变成原生模型工具、图片结果、运行时技能和 Web 面板。合格交付应是目标工程构建产物被安装到预期设备，并用真实界面或日志核验行为，而不只是返回exit0。

入口以Cordis apply挂 tools，package声明bundle和Web client，属于原生DSH插件。它复用本机hdc协议、官方编译器/文档与SDK，增量是原生接缝、版本化知识检索及统一失败包装，不是重写设备协议或新编译算法。作者列出的真机测试矩阵属于作者报告，本轮不据此声称运行通过；也没有与直接CLI同任务耗时对照。

如果开发者已有成熟CLI脚本且很少把设备结果交给模型，新增工具面不一定值得。更值得核查的是任务身份是否贯穿会话、工程、设备和产物，避免自动化让错误目标执行得更快。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-14](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/README.md#L3-L14)

作者定位、原方案与原生接缝。

<details>
<summary>查看原文（12行）</summary>

```text
> DSH 原生鸿蒙开发助手：`hdc` 设备闭环调试（看设备 → 截图 → 看图 → 改码 → 装包 → 验证）＋ 官方优先版本化知识层（离线 Tier-1 随包 + SDK 机读 + 官方文档检索）＋ 可选官方 DevEco CLI 构建/签名通道。
> A DSH-native HarmonyOS dev assistant: the hdc device loop (inspect → screenshot → view → fix → install → verify), an official-first version-classified knowledge layer (offline Tier-1 bundled + SDK-accurate reads + official docs search), and an optional official DevEco CLI build/sign backend.

## 定位

[hdc_mcp](https://github.com/yushun667/hdc_mcp) 等 MCP 服务器已覆盖 hdc 能力层。本插件不重写 hdc 协议，直接复用本机 hdc 二进制（3.x），价值在 DSH 原生层：

- 会话内工具卡片与 `read_image` 原生闭环
- 按调用会话解析沙箱策略（与 `pwsh` 工具同款路线），截图写入 `<workspace>/.dsh-hdc/screenshots/`
- 结构化的失败上报（hdc 传输层退出码不可靠，插件用输出标记 + 落盘校验兜底）
- v0.7 起面板按官方 client 插件形态集成（边栏入口 + 浮动面板 + 官方主题），v0.9 补齐会话级编译、静态检查、部署与日志工具（switch_cwd / build_project / arkts_check / start_app / hdc_log）

```

</details>

**依据 2 · 源码核查**：[lib/host.js:19-20](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L19-L20)

原生插件名与服务注入。

```text
export const name = 'hdc-bridge'
export const inject = ['shell', 'tools']
```

**依据 3 · 源码核查**：[lib/host.js:652-668](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L652-L668)

真实工具注册与业务失败包装。

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

#### 缺口

- 缺少与直接CLI的同条件任务效果和交接时间对照。
  **影响**：不能把原生集成直接称提高成功率或效率。
  **进一步探讨**：固定工程、设备、模型和任务，对比正确部署、人工交接与复核耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何从会话走到设备与业务结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具execute接exec，经policyFor解析调用会话策略，再由runShellRaw把策略/workdir交给宿主shell.resolve；优先execute(spec)并等handle.result，旧宿主回退run。hdc-core负责发现本机二进制、列目标与命令参数，具体工具再解释业务输出。registerTool统一捕获异常返回ok:false/error/hint，因此模型和调用者必须读业务值，不以没有抛异常当成功。

以安装为例，先currentTarget，再校验hapPath，hdc install默认替换，并把stdout/stderr的error/failed标记纳入成功判据；成功提示仍要求截图或UI dump验证。这比只看hdc退出码多一层，但字符串标记可能受CLI版本/语言影响，不能证明业务正确。构建路径还检查hap存在并暴露artifactVerified/hapBefore/hapAfter，仍需确认签名和真实设备行为。

工程上抽出core、结构化失败和双shell seam值得借鉴；移植需保持宿主权限/取消、输出上限与设备语义。进程超时、取消或构建失败后，设备/文件可能已有部分变化，不能仅凭本次ok:false假设已回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:105-119](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L105-L119)

按调用会话解析策略的入口。

<details>
<summary>查看原文（15行）</summary>

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
  }

```

</details>

**依据 2 · 源码核查**：[lib/host.js:164-186](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L164-L186)

shell真实resolve/execute/result及旧run回退。

<details>
<summary>查看原文（23行）</summary>

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
    // fall back to it rather than failing the whole plugin (issue #8).
    if (typeof shell.execute === 'function') {
      const handle = await shell.execute(spec)
      return handle && typeof handle.result === 'function' ? await handle.result() : handle
    }
    if (typeof shell.run === 'function') return shell.run(spec)
    // Neither seam exists: report the host mismatch honestly instead of letting
    // the failure surface as a bogus "hdc not found" (the misleading mode
    // reported in issue #8).
    throw new Error('Unsupported DSH shell seam: ctx.shell exposes neither execute() (DSH 0.1.7-rc.2+) nor run() (DSH up to 0.1.5). Upgrade @deepseek-ai/dsh.')
```

</details>

**依据 3 · 源码核查**：[lib/host.js:334-350](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L334-L350)

安装目标、参数、输出标记和后续验证。

<details>
<summary>查看原文（17行）</summary>

```text
  async function install(args, policy) {
    args = args || {}
    const cur = await currentTarget(args.target, policy)
    if (cur.error) return { ok: false, error: cur.error }
    if (typeof args.hapPath !== 'string' || !args.hapPath.trim()) return { ok: false, error: 'hapPath is required (path to a built .hap file)' }
    const argv = ['install']
    if (args.replace !== false) argv.push('-r')
    // Windows hdc resolves forward-slash absolute paths against the cwd and
    // double-joins them; normalize to backslashes on the pwsh host dialect.
    const hapRaw = args.hapPath.trim()
    const hap = (typeof process !== 'undefined' && process.platform === 'win32') ? hapRaw.replace(/\//g, '\\') : hapRaw
    argv.push(psQuote(hap))
    const r = await runHdc(argv, { target: cur.target, timeoutMs: 180000, stdoutMaxBytes: 262144 }, policy)
    const text = r.stdout + '\n' + r.stderr
    const ok = r.ok && !/error|failed|fail/i.test(text)
    const hint = ok ? 'Installed. Run hdc_screenshot or hdc_ui_dump to verify the UI.' : errorHint(text)
    return { ok, exitCode: r.exitCode, stdout: tailText(r.stdout, 4000), stderr: tailText(r.stderr, 2000), timedOut: r.timedOut, hint }
```

</details>

**依据 4 · 源码核查**：[lib/host.js:652-668](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L652-L668)

异常统一业务失败。

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

**依据 5 · 源码核查**：[lib/host.js:1915-1932](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L1915-L1932)

构建额外核产物，仍保留后端信息。

<details>
<summary>查看原文（18行）</summary>

```text
            const hapAfter = await findNewestHap(base, policy)
            const artifactVerified = args.action === 'clean' ? !hapAfter : Boolean(hapAfter)
            if (artifactVerified) {
              return { ...outside, backend: 'devecocli', ok: true, exitCode: deExit, timedOut: r.timedOut, output: compileOut.stripAnsi(deOutput), artifactVerified, hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(null) }
            }
            deOutput += '\n\ndevecocli returned success but artifact state was not verified; using hvigor fallback.'
          }
          // devecocli failed or its channel was mojo-blocked — fall through to
          // the direct hvigorw build instead of only reporting the block.
        }
        const fb = await hvigorDirectBuild({ base, product: q(args.product) || 'default', mode: q(args.buildMode) || 'debug', timeoutMs, policy, task: args.action === 'clean' ? 'clean' : 'assembleHap' })
        if (fb.available && fb.ok) {
          const hapAfter = await findNewestHap(base, policy)
          const artifactVerified = args.action === 'clean' ? !hapAfter : Boolean(hapAfter)
          if (artifactVerified) {
            return { ...outside, backend: 'hvigorw', ok: true, exitCode: fb.exitCode, timedOut: fb.timedOut, output: compileOut.stripAnsi(fb.output), artifactVerified, hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(fb), note2: (deMojo ? 'devecocli channel was mojo-blocked in this sandbox (0x5) — fell back to the direct hvigorw build. ' : 'devecocli failed — used the direct hvigorw build. ') + 'hvigorw uses the signingConfigs already present in build-profile.json5; unsigned builds cannot install on a device.' }
          }
          return { ...outside, backend: 'hvigorw', ok: false, exitCode: fb.exitCode, timedOut: fb.timedOut, output: compileOut.stripAnsi(fb.output), error: args.action === 'clean' ? 'hvigorw reported success but build outputs were not cleaned' : 'hvigorw reported success but no .hap artifact was produced', hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(fb) }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话设备记忆和面板权限能否视为同一保证？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能把会话沙箱策略等同于所有设备交互的统一权限。host apply只创建一份hdcCore，core内preferredTarget是单值，未按sessionId建Map；显式target会改变它，缺省先沿用在线preferred，再回退连接目标。README称会话设备记忆，兑现这一范围仍取决于宿主如何实例化插件。若一实例承接多个会话，静态结构提示交叉影响风险，但本次未在真实装配中复现，不断言所有部署必然串设备。对比之下compile-session-cwd明确按sessionID Map保存工程目录。

面板使用execFile直接运行固定设备命令，和模型工具的宿主Shell策略不是同一路。它并非任意跨站无防护，panel挂载时调用独立checkPanelRequest，检查Host、Origin、Sec-Fetch-Site、回环peer和非读取JSON类型；反向代理需信任主机配置。这些栅栏缩小浏览器调用面，但不是每个session/device的授权证明，也不阻止同源操作者按面板能力访问设备。

采用前最需要确认实际插件实例作用域、面板可达身份和默认设备变化。多设备时应显式指定target与工程，设备掉线后重新确认，不依赖自动回退继续破坏性动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:253-266](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L253-L266)

apply内创建一份hdcCore并向工具和面板提供接缝。

<details>
<summary>查看原文（14行）</summary>

```text
  const hdcCore = createHdcCore({
    runShellRaw,
    psQuote,
    detectShellFlavor,
    getShellFlavor: () => shellFlavor,
    setShellFlavor: (v) => {
      if (v !== shellFlavor) dropCliCache('shell flavor changed to ' + v)
      shellFlavor = v
      shellFlavorDetected = true
    },
    fsService,
    extraRoots: extraSdkRoots,
    log: logInfo,
  })
```

</details>

**依据 2 · 源码核查**：[lib/hdc-core.mjs:230-249](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/hdc-core.mjs#L230-L249)

preferredTarget单值与自动回退。

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

**依据 3 · 源码核查**：[lib/compile-session-cwd.mjs:13-30](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/compile-session-cwd.mjs#L13-L30)

工程cwd按sessionID map，和设备状态对照。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/panel.mjs:29-43](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/panel.mjs#L29-L43)

直接execFile探测，不走模型Shell seam。

<details>
<summary>查看原文（15行）</summary>

```text
// Direct-spown probe primitives kept behind an injectable seam so tests can
// simulate machines where only PATH resolves hdc.
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

**依据 5 · 源码核查**：[lib/http-guard.mjs:96-143](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/http-guard.mjs#L96-L143)

已有浏览器请求栅栏。

<details>
<summary>查看原文（48行）</summary>

```text

  if (String(headers['sec-fetch-site'] || '').toLowerCase() === 'cross-site') {
    return deny(403, 'cross-site', 'Cross-site requests are refused on the panel routes.')
  }

  const origin = headers.origin
  if (origin !== undefined && origin !== '') {
    let originUrl = null
    try { originUrl = new URL(String(origin)) } catch { originUrl = null }
    if (!originUrl || (originUrl.protocol !== 'http:' && originUrl.protocol !== 'https:')) {
      return deny(403, 'origin-mismatch', 'The Origin header is not a usable http(s) origin.')
    }
    const originAuthority = parseAuthority(originUrl.host)
    if (!sameAuthority(originAuthority, host, originUrl.protocol)) {
      return deny(403, 'origin-mismatch', 'The Origin does not match the Host this panel is served from.')
    }
  }

  if (isLoopbackHostname(host.hostname)) {
    const peer = request && request.socket ? request.socket.remoteAddress : ''
    if (!isLoopbackAddress(peer)) {
      return deny(403, 'peer-not-local', 'A loopback Host is only accepted from a loopback peer.')
    }
  } else {
    const allowed = options.trustedAuthorities !== undefined
      ? options.trustedAuthorities
      : trustedAuthorities()
    const bind = options.bindHost ? parseAuthority(options.bindHost) : null
    const served = options.servedOrigin ? parseAuthority(String(options.servedOrigin).replace(/^[a-z]+:\/\//i, '')) : null
    if (!matchesTrusted(host, allowed) && !(bind && bind.hostname === host.hostname) && !(served && served.hostname === host.hostname)) {
      return deny(403, 'host-untrusted',
        'This host is not trusted for the panel routes. Reaching the panel through a LAN address or a tunnel requires it in ' + PANEL_TRUST_ENV + '.')
    }
  }

  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const type = String(headers['content-type'] || '').toLowerCase()
    if (!type.startsWith('application/json')) {
      return deny(415, 'content-type', 'State-changing panel routes require Content-Type: application/json.')
    }
  }

  return { ok: true, status: 200, reason: '', hint: '' }
}

function deny(status, reason, hint) {
  return { ok: false, status, reason, hint }
}
```

</details>

**依据 6 · 源码核查**：[lib/panel.mjs:333-350](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/panel.mjs#L333-L350)

面板真实调用checkPanelRequest。

<details>
<summary>查看原文（18行）</summary>

```text
      // panel routes are same-origin control surfaces, not a public API. The
      // fence lives in lib/http-guard.mjs so the regression suite can drive
      // each rule without an HTTP server.
      const refused = new Set()
      function guard(req, res) {
        let verdict
        try {
          verdict = checkPanelRequest(req, {
            trustedAuthorities: trustedAuthorities(),
            bindHost: bindHostOf(ws),
            servedOrigin: servedOriginOf(ws),
          })
        } catch (e) {
          verdict = { ok: false, status: 403, reason: 'guard-error', hint: String(e && e.message ? e.message : e) }
        }
        if (verdict.ok) return true
        const host = String((req && req.headers && req.headers.host) || '')
        const key = verdict.reason + '|' + host
```

</details>

#### 缺口

- 未取得实际宿主的插件实例隔离与多会话/多设备执行证据。
  **影响**：不能确认preferredTarget的会话语义，也不能把面板围栏当租户授权。
  **进一步探讨**：在隔离宿主创建两会话、两工程与两设备，交叉显式/缺省target、掉线和面板选择，核真实接收者。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用负担与受控探索应如何安排？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

本轮建议先观察关键作用域，再决定受控试用。开发者需要兼容DSH Shell/tools，设备调试授权和本机hdc；构建/签名另需SDK、Studio或CLT、项目配置与证书。纯文本模型可读UI dump，截图理解依赖图像能力；离线知识可在无设备时用，但文档存在不保证目标API/工程能编译。

工具链安装、设备资源和模型调用费用、每次构建时间均未测；还要承担签名、版本/路径、默认设备及部分失败恢复的人工核查。可先在无真实数据的设备使用显式target做只读列表和诊断，确认作用域/面板访问，再做可恢复样例工程安装。构建文字成功要连同产物和设备效果验收，删除数据/卸载等动作单独评估。

如果设备被默认切到非预期目标、策略无法明确、旧产物被当新结果或面板访问超出预期，就停止相关工具/面板，回直接CLI与人工验收并核设备状态；不能把无依赖npm包理解成无环境负担，也不能据作者矩阵承诺本机兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:70-89](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/README.md#L70-L89)

作者工具链、SDK和可选后端条件。

<details>
<summary>查看原文（20行）</summary>

````text
dsh --profile <name> --dump-config   # 确认出现 dsh-hdc-bridge 层 / confirms the dsh-hdc-bridge layer
dsh --profile <name>
```

## 环境要求

- **DSH ≥ 0.1.7-rc.2（推荐 ≥ 0.2.0-rc.2，0.2.0-rc.2 已实测）**：上游 0.2.0-rc.2 起把 `ctx.shell.run()` 换成 `resolve()` + `execute()`（句柄 `result()` 取结果）——新契约为准；0.1.5 及更早的旧线（`run()`）由兼容垫片接管，两条线都可用。两条 seam 都不存在的宿主会直接给出「seam 缺失」的明确报错，而不是误导性的 `hdc not found`
- HarmonyOS 设备/模拟器；真机需开发者模式 + USB 调试
- hdc 二进制自动探测（工具与面板共用同一套候选源）：显式 `devecoPath` / `DEVECO_STUDIO_HOME` / `DEVECO_HOME` / `DEVECO_SDK_HOME` → Windows 注册表（含 WOW6432Node）→ 非默认 DevEco/CLT SDK 根 → 默认安装根（apiVer 覆盖 default/10…18）→ PATH 回退（`where.exe` / `Get-Command` / `which`）；面板优先复用工具层已解析路径，两侧行为一致
- 截图查看需图像输入模型；纯文本模型可用 `hdc_ui_dump` 做文本化 UI 检查
- 可选后端 `@deveco/deveco-cli`（MIT）**不随插件安装**（插件零依赖，安装期不执行任何第三方脚本），工具链二选一：
  - **路线 A｜DevEco Studio**：本机装 DevEco Studio ≥ 6.1.0（macOS/Windows）+ `npm i -g @deveco/deveco-cli`；
  - **路线 B｜独立 Command Line Tools**：华为官方 zip 发行版（codelinter / hvigorw / ohpm / emulator / 内嵌 SDK，≥ 26.0.0，解压即用），下载自 developer.huawei.com/consumer/cn/download/command-line-tools-for-hmos，设置 `DEVECO_CLI_CLT_PATH`（或 `COMMAND_LINE_TOOL_PATH`）指向解压目录即可被自动识别；根识别支持 `version.txt` 与无 `version.txt` 的发行形态（HNP/系统集成包：以 `sdk/default` 布局为准，世代号取自 `sdk/default/sdk-pkg.json`）；**Linux 主机仅支持此形态**。
  - 未安装时相关工具全部优雅降级并给出安装指引；`hms_setup` 一眼可查当前 `toolchainKind`（studio / clt）。签名前需一次人工 `devecocli auth login`（浏览器 OAuth）
- 本机无任何工具链时仍可用：hdc_* 全部工具、设备面板与 Tier-1 离线知识层（随包内置）
- `hms_api` / `hms_lint rules` 直接读本机 DevEco Studio/SDK 安装（零再分发）；未装 Studio 时这两项降级并给出指引
- `hms_knowledge` 的 Tier-1 官方知识节选随包内置（28 篇约 1.7MB，CC-BY-4.0 逐字节选并附署名 + 逐文件溯源），**离线可用**，无需任何本机安装
- `hms_api_change`（check compat）需要更高版本的 DevEco Studio（实测 6.1.0.830 报"min required 26.0.0.810"）；不满足时工具返回官方错误原文 + 升级指引，并提示先用 `hms_api` 的 `@since/@deprecated` 版本知识

## 依赖与许可合规
````

</details>

**依据 2 · 源码核查**：[lib/host.js:1915-1932](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L1915-L1932)

构建产物核验而不只文字。

<details>
<summary>查看原文（18行）</summary>

```text
            const hapAfter = await findNewestHap(base, policy)
            const artifactVerified = args.action === 'clean' ? !hapAfter : Boolean(hapAfter)
            if (artifactVerified) {
              return { ...outside, backend: 'devecocli', ok: true, exitCode: deExit, timedOut: r.timedOut, output: compileOut.stripAnsi(deOutput), artifactVerified, hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(null) }
            }
            deOutput += '\n\ndevecocli returned success but artifact state was not verified; using hvigor fallback.'
          }
          // devecocli failed or its channel was mojo-blocked — fall through to
          // the direct hvigorw build instead of only reporting the block.
        }
        const fb = await hvigorDirectBuild({ base, product: q(args.product) || 'default', mode: q(args.buildMode) || 'debug', timeoutMs, policy, task: args.action === 'clean' ? 'clean' : 'assembleHap' })
        if (fb.available && fb.ok) {
          const hapAfter = await findNewestHap(base, policy)
          const artifactVerified = args.action === 'clean' ? !hapAfter : Boolean(hapAfter)
          if (artifactVerified) {
            return { ...outside, backend: 'hvigorw', ok: true, exitCode: fb.exitCode, timedOut: fb.timedOut, output: compileOut.stripAnsi(fb.output), artifactVerified, hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(fb), note2: (deMojo ? 'devecocli channel was mojo-blocked in this sandbox (0x5) — fell back to the direct hvigorw build. ' : 'devecocli failed — used the direct hvigorw build. ') + 'hvigorw uses the signingConfigs already present in build-profile.json5; unsigned builds cannot install on a device.' }
          }
          return { ...outside, backend: 'hvigorw', ok: false, exitCode: fb.exitCode, timedOut: fb.timedOut, output: compileOut.stripAnsi(fb.output), error: args.action === 'clean' ? 'hvigorw reported success but build outputs were not cleaned' : 'hvigorw reported success but no .hap artifact was produced', hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(fb) }
```

</details>

**依据 3 · 源码核查**：[lib/hdc-core.mjs:234-249](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/hdc-core.mjs#L234-L249)

默认设备变化带来的核对责任。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/host.js:334-350](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L334-L350)

设备安装后仍需验证。

<details>
<summary>查看原文（17行）</summary>

```text
  async function install(args, policy) {
    args = args || {}
    const cur = await currentTarget(args.target, policy)
    if (cur.error) return { ok: false, error: cur.error }
    if (typeof args.hapPath !== 'string' || !args.hapPath.trim()) return { ok: false, error: 'hapPath is required (path to a built .hap file)' }
    const argv = ['install']
    if (args.replace !== false) argv.push('-r')
    // Windows hdc resolves forward-slash absolute paths against the cwd and
    // double-joins them; normalize to backslashes on the pwsh host dialect.
    const hapRaw = args.hapPath.trim()
    const hap = (typeof process !== 'undefined' && process.platform === 'win32') ? hapRaw.replace(/\//g, '\\') : hapRaw
    argv.push(psQuote(hap))
    const r = await runHdc(argv, { target: cur.target, timeoutMs: 180000, stdoutMaxBytes: 262144 }, policy)
    const text = r.stdout + '\n' + r.stderr
    const ok = r.ok && !/error|failed|fail/i.test(text)
    const hint = ok ? 'Installed. Run hdc_screenshot or hdc_ui_dump to verify the UI.' : errorHint(text)
    return { ok, exitCode: r.exitCode, stdout: tailText(r.stdout, 4000), stderr: tailText(r.stderr, 2000), timedOut: r.timedOut, hint }
```

</details>

#### 缺口

- 无目标环境资源/耗时与合格部署对照，也缺作用域验收。
  **影响**：不支持节时、成功率或单位合格任务成本判断。
  **进一步探讨**：先核双会话作用域，再记录同一工程从构建到设备验收的全尝试、资源和人工时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 执行收据是否能减少目标混淆？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设在执行前后提供同一份会话、工程、显式/回退设备及产物身份收据，让操作者确认“这次在哪做了什么”。推导来自Q03的设备默认选择与Q02的产物存在性判据；它不是替代宿主沙箱，也不让未验收产物自动可信。

已有preferred/preferredActive、编译cwd和hapBefore/hapAfter是反证，不能声称完全缺状态。新增部分应只连接这些分散字段，并在自动回退时要求更明确确认；如果实际宿主每会话隔离已解决设备记忆问题，收据的收益可能很小。

可用两会话两设备两工程安排连接切换、增量构建、旧hap和超时，比较当前输出与收据原型的误投设备、错误部署、查错耗时和确认次数。若没有降低错误、提示本身过期或新增确认负担抵消收益，应否定。作用域事实和用户需要都尚未验证，不将该构想算现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hdc-core.mjs:234-249](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/hdc-core.mjs#L234-L249)

显式与回退设备选择。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/host.js:1915-1932](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/host.js#L1915-L1932)

已有产物前后状态可作为收据基础。

<details>
<summary>查看原文（18行）</summary>

```text
            const hapAfter = await findNewestHap(base, policy)
            const artifactVerified = args.action === 'clean' ? !hapAfter : Boolean(hapAfter)
            if (artifactVerified) {
              return { ...outside, backend: 'devecocli', ok: true, exitCode: deExit, timedOut: r.timedOut, output: compileOut.stripAnsi(deOutput), artifactVerified, hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(null) }
            }
            deOutput += '\n\ndevecocli returned success but artifact state was not verified; using hvigor fallback.'
          }
          // devecocli failed or its channel was mojo-blocked — fall through to
          // the direct hvigorw build instead of only reporting the block.
        }
        const fb = await hvigorDirectBuild({ base, product: q(args.product) || 'default', mode: q(args.buildMode) || 'debug', timeoutMs, policy, task: args.action === 'clean' ? 'clean' : 'assembleHap' })
        if (fb.available && fb.ok) {
          const hapAfter = await findNewestHap(base, policy)
          const artifactVerified = args.action === 'clean' ? !hapAfter : Boolean(hapAfter)
          if (artifactVerified) {
            return { ...outside, backend: 'hvigorw', ok: true, exitCode: fb.exitCode, timedOut: fb.timedOut, output: compileOut.stripAnsi(fb.output), artifactVerified, hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(fb), note2: (deMojo ? 'devecocli channel was mojo-blocked in this sandbox (0x5) — fell back to the direct hvigorw build. ' : 'devecocli failed — used the direct hvigorw build. ') + 'hvigorw uses the signingConfigs already present in build-profile.json5; unsigned builds cannot install on a device.' }
          }
          return { ...outside, backend: 'hvigorw', ok: false, exitCode: fb.exitCode, timedOut: fb.timedOut, output: compileOut.stripAnsi(fb.output), error: args.action === 'clean' ? 'hvigorw reported success but build outputs were not cleaned' : 'hvigorw reported success but no .hap artifact was produced', hapBefore: hapBefore || '', hapAfter: hapAfter || '', ...hvigorDiag(fb) }
```

</details>

**依据 3 · 源码核查**：[lib/compile-session-cwd.mjs:13-30](https://github.com/1na-ko/dsh-hdc-bridge/blob/61b3e6d827e644c96fdfb527114ef9e5e3b17e06/lib/compile-session-cwd.mjs#L13-L30)

已有会话工程映射。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

#### 缺口

- 没有收据原型、用户混淆反馈或双设备对照。
  **影响**：只能提出待验证假设，不能称已确认需求。
  **进一步探讨**：固定作用域后做故障序列对照，保留负结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
