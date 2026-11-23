# Windows MCP 桌面集成

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[3eeb984](https://github.com/helloHub1212/dsh-windows-mcp/tree/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019)

<!-- BEGIN META -->
[![GitHub ★ 2,200](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C200&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/helloHub1212/dsh-windows-mcp) [![npm 30d 826,247](https://img.shields.io/static/v1?label=npm+30d&message=826%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp) [![最新发布 2026-11-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-windows-mcp)
<!-- END META -->

> **功能**：通过 DSH 的 MCP 桥连接 Windows 桌面工具，并提供会话开关、诊断和依赖版本管理。

> **亮点**：[Q01](#research-q01) 显示，本包把官方桌面桥、依赖维护和诊断接到 DSH；[Q02](#research-q02) 与 [Q03](#research-q03) 进一步将授权按会话判定，并将工具可见性和分派拒绝分层。增量属于宿主集成及权限组织，Windows 操作能力仍归上游，节时收益没有实测。

> **主要限制**：[Q02](#research-q02) 的有界决定表可能淘汰显式撤销，使判定回落到默认或祖先授权；[Q03](#research-q03) 的认证不可观察配置仍可处理写入。两者是源码边界，未复现越权；它们使“会话开关就是完整安全边界”的主张不能直接成立。

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
  - [Q01 · 桌面任务的入口和真正能力由谁提供？](#detail-section-11)
  - [Q02 · 会话授权、继承和退出如何确定，何时可能偏离用户决定？](#detail-section-12)
  - [Q03 · 隐藏工具与调用拒绝是否一致，浏览器写授权有什么边界？](#detail-section-13)
  - [Q04 · 诊断能否证明桌面输入会命中目标？](#detail-section-14)
  - [Q05 · 依赖安装和版本切换失败后，用户如何恢复？](#detail-section-15)
  - [Q06 · 何种任务值得继续观察，成本和停止条件是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适用对象是需要检查没有稳定 API 的 Windows 应用、且能准备独立测试桌面的 DSH 使用者。一个合格观察任务应同时给出当前窗口的可读描述与对应画面，由使用者核对目标，而不能只接受工具返回成功。原办法是人工截图并交接窗口状态，或自己维护 Windows-MCP 与宿主桥的配置。本包把桥配置、诊断、依赖版本管理和会话控制放入宿主，减少的是这些接线工作的分散，而非证明桌面任务更快。

人工截图和窗口交接、手工维护 Windows-MCP bridge，以及应用已有稳定 API 的直接读取。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| windows_mcp_doctor | 报告桥、工具链和桌面诊断 | 诊断计数不能证明输入命中 |
| windows_desktop | 按需揭示桌面工具定义 | 当前会话须授权，定义来自已注册桥 |
| 会话控制开关 | 设置本会话允许或拒绝 | 默认与继承、容量淘汰影响判定 |
| 版本安装与激活 | 管理上游服务、切换和回滚 | 依赖 uv；桥/状态非原子落盘 |
| 设置页面 | 编辑桥参数、默认授权与更新策略 | 部分桥参数需重启；设置文件受同用户权限控制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 带官方 MCP bridge 及 tools 服务的 DSH | 必需 | 加载桥、限制及分派拦截 | 门禁层可能跳过，保持桌面关闭 |
| Windows 交互桌面与 Windows-MCP | 桌面任务必需 | 截图、窗口和输入 | 本包诊断不等于实际可操作 |
| uv、Python 与包索引 | 托管安装必需 | 下载固定工具版本 | 由安装状态报告失败，需用户排障 |
| connection.browserAuth | 浏览器写操作认证需要 | 校验签名 cookie | 不可观察时不强制拒绝，需可信本地部署 |
| 可用备用版本与 profile 写权限 | 升级恢复需要 | 切换 bridge 指向 | 状态落盘可能部分完成 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者固定宿主和上游版本，准备无敏感内容桌面 | 桥与实际可执行路径一致 |
| 授权 | 使用者在当前会话打开控制，保持 defaultGrant 关闭 | 工具表与分派结果都符合本会话决定 |
| 观察 | 助手先揭示截图与窗口观察 | 使用者核对同一目标窗口和画面 |
| 恢复 | 使用者检查安装日志、桥与版本文件 | 部分落盘先人工核对，不把失败当自动回滚 |
| 退出 | 使用者关闭当前授权或禁用桥并重启 | 后续桌面调用拒绝，恢复人工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 工具链下载及版本目录资源 | 配置宿主、解释器、桌面与权限 | 下载金额、耗时未知 |
| 持续使用 | 图片传输、模型额度、后台更新查询 | 核对窗口、授权与诊断 | 单任务请求数和时间未知 |
| 失败恢复 | 重试下载、备用版本及日志 | 停桥、重启、核对部分写入 | 恢复成功率和耗时未知 |
| 退出 | 保留或清理工具链空间 | 禁用桥，核对调用拒绝 | 未实测完整退出时间 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主集成 | patch 与 apply 接通诊断、桥和设置 | 实际宿主兼容及任务合格率 |
| 会话控制 | 最近决定、子智能体继承和分派判定可追踪 | 容量淘汰及多窗口真实行为 |
| 工具按需揭示 | 已注册能力按请求展开 | 实际上下文节省和端到端收益 |
| 安装维护 | 占用检查和版本激活有明确失败分支 | 扫描漏检、部分失败与实际恢复效果 |

> **思考**：[Q02](#research-q02) 的有界决定表可能淘汰显式撤销，使判定回落到默认或祖先授权；[Q03](#research-q03) 的认证不可观察配置仍可处理写入。两者是源码边界，未复现越权；它们使“会话开关就是完整安全边界”的主张不能直接成立。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 显示，本包把官方桌面桥、依赖维护和诊断接到 DSH；[Q02](#research-q02) 与 [Q03](#research-q03) 进一步将授权按会话判定，并将工具可见性和分派拒绝分层。增量属于宿主集成及权限组织，Windows 操作能力仍归上游，节时收益没有实测。

[Q03](#research-q03) 的限制替换、防重入和 continuation 保留值得借鉴，移植必须匹配宿主 tools 生命周期；[Q02](#research-q02) 的有界授权缓存提示撤销语义应独立设计。[Q05](#research-q05) 明示部分落盘比误报成功更可诊断，但不是原子恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的有界决定表可能淘汰显式撤销，使判定回落到默认或祖先授权；[Q03](#research-q03) 的认证不可观察配置仍可处理写入。两者是源码边界，未复现越权；它们使“会话开关就是完整安全边界”的主张不能直接成立。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 建议保持观察。先固定宿主与上游版本，关闭默认授权，在无敏感内容桌面核对会话开关、工具表、拒绝及画面；授权异常或目标不一致就停用 bridge 并重启，恢复人工处理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本宿主集成和权限状态机制已有源码依据；授权淘汰后果为源码推导，非运行复现；未来门槛和撤销缓存设计均未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、README.zh.md、lib/index.js、lib/client.js、lib/settings.js、lib/desktop-probe.js、lib/processes.js、lib/updater.js、lib/dependency.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已核查固定 package、patch、宿主入口、客户端会话开关、授权与工具分派、设置、桌面诊断和版本维护关键路径；官方宿主/Windows-MCP实现未由本次源码包独立验证。
- 下一步：仅执行材料读取和本工程装配，未安装或运行目标插件、测试、Windows 桌面或付费实验。未把作者宿主验收声明升级为本次运行结果。

**分析版本**

- **仓库**：[helloHub1212/dsh-windows-mcp](https://github.com/helloHub1212/dsh-windows-mcp)
- **版本号**：0.2.11（[固定提交 3eeb984](https://github.com/helloHub1212/dsh-windows-mcp/tree/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出将诊断冲突作为观察到交互的分阶段门槛；[Q02](#research-q02) 提出将明确撤销与可淘汰的允许缓存分开。二者均未验证，应分别比较错目标操作、撤销后分派、误拦及额外人工；若改善不能抵偿新增负担，就退回简单禁用桥和人工确认。

仅执行材料读取和本工程装配，未安装或运行目标插件、测试、Windows 桌面或付费实验。未把作者宿主验收声明升级为本次运行结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1145 | — | — | 13612 |
| .js | source | 10 | 5987 | 4592 | 1089 | — |
| .mjs | source | 4 | 382 | 296 | 53 | — |
| .mjs | test | 5 | 2777 | 2318 | 205 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/helloHub1212/dsh-windows-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/helloHub1212/dsh-windows-mcp/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/helloHub1212/dsh-windows-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多会话 DSH 用户能否在可控权限和维护负担下，将 Windows 桌面观察交给助手？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面任务的入口和真正能力由谁提供？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用对象是需要检查没有稳定 API 的 Windows 应用、且能准备独立测试桌面的 DSH 使用者。一个合格观察任务应同时给出当前窗口的可读描述与对应画面，由使用者核对目标，而不能只接受工具返回成功。原办法是人工截图并交接窗口状态，或自己维护 Windows-MCP 与宿主桥的配置。本包把桥配置、诊断、依赖版本管理和会话控制放入宿主，减少的是这些接线工作的分散，而非证明桌面任务更快。

package 导出 lib/index.js 与 lib/client.js，bundle patch 挂载自身和官方 @deepseek-ai/dsh-mcp-client 两行；桥以 stdio 启动 windows-mcp@0.8.8，默认 disabled，避免安装依赖阻塞宿主启动。apply 实际注册诊断、状态路由、工具门禁和揭示入口。截图、键鼠等具体能力来自上游 Windows-MCP 与官方桥，不能算成本包独立实现。若应用已有稳定 API，改用桌面工具反而增加焦点、窗口和缩放约束。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-13](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/package.json#L8-L13)

宿主与客户端导出位置。

```text
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
```

**依据 2 · 源码核查**：[cordis.patch.yml:43-69](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/cordis.patch.yml#L43-L69)

实际双挂载、默认禁用和固定 Python 工具。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    - id: windows-mcp-plugin
      name: dsh-windows-mcp

    - id: windows-mcp-bridge
      name: "@deepseek-ai/dsh-mcp-client"
      # Inert until the installer points it at a real executable (see above):
      # a cold `uvx` resolve inside DSH's startup can hang the whole window.
      disabled: true
      config:
        # Namespace for every tool name: mcp__windows__Screenshot, ...
        serverName: windows
        transport: stdio
        # Only reached if someone re-enables this row without rewriting
        # `command`; harmless, because by then the toolchain is installed.
        command: uvx
        args:
          # Pinned for reproducibility. Replace with `windows-mcp` to float, or
          # with an absolute path to a fixed interpreter (`python -m windows_mcp`).
          - windows-mcp@0.8.8
          - serve
          # Curation: drop the tools DSH already covers (its own shell and file
          # tools), plus `App`, which upstream only supports reliably on an
          # English Windows install. Never list `ControlStatus` here — upstream
          # keeps it unconditionally.
          - --exclude-tools
          - App,PowerShell,FileSystem
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1428-1448](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L1428-L1448)

宿主装配到具体功能。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx) {
  try {
    const warn = makeLogger(ctx);
    settings = readSettings(stateDirectory);
    updater = createUpdater({
      warn,
      resolver: which,
      pinned: windowsMcpVersionPin(readText(patchPath)),
      preferredMirror: () => (settings === null ? "auto" : settings.plugin.preferredMirror),
      writeBridge: (executable) =>
        writeBridgeOverride(executable, {
          warn,
          version: selfVersion(),
          settings: settings === null ? null : bridgeSettingsOf(settings),
        }),
    });
    auditStartup(warn);
    registerDoctor(ctx, warn);
    registerStateRoute(ctx, warn);
    registerToolGate(ctx, warn);
    registerRevealTool(ctx, warn);
```

</details>

#### 缺口

- 没有同任务人工配置与插件方案的对照记录
  **影响**：只能确认集成机制，不能量化节时或需求强度
  **进一步探讨**：固定一个可复位 Windows 窗口，比较合格截图描述、配置步骤及人工复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话授权、继承和退出如何确定，何时可能偏离用户决定？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

授权以 sessionGrants 内存 Map 保存，值 false 是显式撤销，不是缺省。grantedFor 沿当前会话及最多八层祖先寻找最近明确决定，只有 header.origin 为 subagent 才继承；普通 fork 不沿父链。没有明确决定时回落到 defaultGrant，设置默认 false；未携带会话身份的调用拒绝。由此可以解释两个普通窗口的决定分离、子智能体继承以及重启后内存决定消失，但若用户将 defaultGrant 打开，新会话及重启后的未决定会话仍可能直接授权，不能笼统称“重启必关”。

rememberGrant 按最后写入顺序保留最多 256 条决定，超过后删除最早项。源码上可推导一个重要边界：如果最早条目是显式 false，而默认授权为 true，或其仍有获准祖先，淘汰后再次判定会回落为获准。此处是根据状态分支推导的授权语义，不是已复现的越权事件。容量限制避免任意 sessionId 写入无限增长，却使撤销记录的生命周期与容量绑在一起；还没有会话结束时清除记录的可见接线。将明确撤销与可淘汰的允许缓存分开，可能比统一淘汰更容易保持用户预期。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:343-385](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L343-L385)

祖先链限制、subagent 条件、最近决定和默认回落。

<details>
<summary>查看原文（43行）</summary>

```text
function grantChainOf(session, lookup) {
  const chain = [];
  let current = session;
  for (let depth = 0; depth < 8 && current !== null && current !== undefined; depth += 1) {
    chain.push(current);
    const header = current.header;
    if (header?.origin !== "subagent" || typeof header.parentSession !== "string") break;
    current = lookup(header.parentSession);
  }
  return chain;
}

/**
 * True when the desktop is granted for this agent's conversation. The nearest
 * explicit decision wins, so a session can also revoke what its lineage granted
 * without touching the parent's switch. A conversation whose whole lineage has
 * never decided falls back to the settings default; a call that names no session
 * at all is refused, whatever that default says.
 */
function grantedFor(agent, lookup) {
  const session = agent?.session;
  if (session === null || session === undefined) {
    const fallback = sessionIdOf(agent);
    if (fallback === null) return false;
    const explicit = sessionGrants.get(fallback);
    return explicit === undefined ? defaultGrantEnabled() : explicit;
  }
  for (const candidate of grantChainOf(session, lookup)) {
    const explicit = sessionGrants.get(candidate.id);
    if (explicit !== undefined) return explicit;
  }
  return defaultGrantEnabled();
}

/** The grant for one session id, which is what the pill asks the route about. */
function grantedForSessionId(sessionId, lookup) {
  if (typeof sessionId !== "string" || sessionId === "") return false;
  const session = lookup(sessionId);
  if (session === null || session === undefined) {
    const explicit = sessionGrants.get(sessionId);
    return explicit === undefined ? defaultGrantEnabled() : explicit;
  }
  return grantedFor({ session }, lookup);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:388-400](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L388-L400)

有界 Map 删除最早决定。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Record one session's decision. Re-inserting keeps the map in
 * least-recently-written order and the bound keeps a page that mints session ids
 * from turning the route into a memory amplifier.
 */
function rememberGrant(sessionId, enabled) {
  sessionGrants.delete(sessionId);
  sessionGrants.set(sessionId, enabled === true);
  while (sessionGrants.size > MAX_GRANT_ENTRIES) {
    const oldest = sessionGrants.keys().next().value;
    if (typeof oldest !== "string") break;
    sessionGrants.delete(oldest);
  }
```

</details>

**依据 3 · 源码核查**：[lib/settings.js:46-57](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/settings.js#L46-L57)

defaultGrant 默认为 false，与懒揭示独立。

<details>
<summary>查看原文（12行）</summary>

```text
  plugin: Object.freeze({
    autoCheckUpdates: true,
    preferredMirror: "auto",
    // Hide the bridged desktop tools behind a one-line entry the model has to
    // ask for; the default is the cheap mode, and the Settings page can turn
    // it off for workflows that want every schema up front.
    lazyTools: true,
    // What a session that has never touched the composer pill starts with. The
    // pill itself always wins per session; this is only the fallback, and it
    // ships off so a fresh install grants the desktop to nobody by accident.
    defaultGrant: false,
  }),
```

</details>

#### 缺口

- 未取得跨256个决定的真实宿主授权轨迹
  **影响**：容量淘汰后的撤销语义为源码推导，不能称为运行复现
  **进一步探讨**：在无桌面副作用的宿主桩或隔离宿主记录被撤销会话、默认授权、祖先授权及淘汰前后的分派结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐藏工具与调用拒绝是否一致，浏览器写授权有什么边界？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

插件按已注册工具重新计算 deny 集合，在每个 Agent 的 tools 作用域隐藏未获准或未揭示的 Windows 工具。先 dispose 原限制，再建立新限制，并以 applying 标志阻止 tools/change 同步递归；pre-step 无论限制结果如何仍调用 next，把决策权交回宿主。另一层 tools.guard 在分派时再查当前会话授权和揭示状态，因此历史中记住工具名并不自动获得执行权。windows_desktop 只负责按需揭示定义，授权关闭时返回提示，不自己授予桌面权限。缺少 restrict 或 guard 方法时对应层直接跳过，因此两层机制的存在不等于所有宿主配置都能执行门禁。

客户端将 slot 注入的 sessionId 随 POST 发送，状态路由写入该会话后重新应用限制。HTTP 写操作仅在 browserAuth.isAuthenticated 明确 false 时拒绝；connection 服务不可观察时返回 null，并继续处理，页面报告 unobservable。这是部署边界，不能把签名 cookie 当作无条件认证。cookie 检查的是浏览器会话，所检查代码未将请求中的 sessionId 与浏览器身份再绑定；应按单一可信本地窗口理解，不能据此承诺多用户租户隔离。同一系统用户若能改 settings 文件仍可改 defaultGrant，浏览器门禁不限制文件系统权限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:461-487](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L461-L487)

deny 依赖当前会话授权与揭示结果。

<details>
<summary>查看原文（27行）</summary>

```text
  /** Tools this agent must not see right now, limited to what is registered. */
  function denyFor(agent) {
    let known;
    try {
      known = serviceOf()?.schemas?.();
    } catch {
      return null;
    }
    if (!Array.isArray(known)) return null;
    // The decision is the conversation's, not the host's: two windows can sit
    // on opposite sides of the switch at the same time.
    const granted = grantedFor(agent, lookup);
    const deny = [];
    for (const schema of known) {
      const name = Array.isArray(schema) ? schema[0] : schema?.name;
      if (typeof name !== "string") continue;
      if (name === REVEAL_TOOL_NAME) {
        // The entry itself is dead weight when the desktop is off or when every
        // schema is always shown.
        if (!granted || !lazyToolsEnabled()) deny.push(name);
        continue;
      }
      if (!isBridgedToolName(name)) continue;
      if (granted && isToolRevealed(agent, name)) continue;
      deny.push(name);
    }
    return deny;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:508-529](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L508-L529)

限制替换及防重入。

<details>
<summary>查看原文（22行）</summary>

```text
  function applyToAgent(agent) {
    if (applying) return;
    if (agent === null || typeof agent !== "object") return;
    live.add(agent);
    applying = true;
    try {
      const scoped = agent?.ctx?.get?.("tools") ?? agent?.ctx?.tools;
      if (typeof scoped?.restrict !== "function") return;
      const deny = denyFor(agent);
      if (deny === null) return;
      const key = deny.slice().sort().join(",");
      const previous = applied.get(agent);
      if (previous !== undefined && previous.key === key) return;
      release(agent);
      if (deny.length === 0) return;
      try {
        applied.set(agent, { key, dispose: scoped.restrict({ deny }) });
      } catch (error) {
        warn(`could not restrict desktop tools: ${String(error)}`);
      }
    } finally {
      applying = false;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:581-605](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L581-L605)

continuation 与分派拒绝。

<details>
<summary>查看原文（25行）</summary>

```text
    hook("agent/pre-step", async (payload, next) => {
      try { applyToAgent(payload?.agent); } catch { /* a gate failure must never break the step */ }
      return typeof next === "function" ? next() : undefined;
    });
    // The bridge registers its tools after startup, so a restriction computed
    // from an empty registry has to be recomputed once they exist.
    hook("tools/change", () => { reapply(); });
  }

  if (typeof ctx?.inject !== "function") return;
  try {
    ctx.inject(["tools"], (scoped) => {
      try {
        if (scoped?.tools) toolsService = scoped.tools;
        if (typeof scoped?.tools?.guard !== "function") return;
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!grantedFor(execution?.agent, lookup)) {
            return `Computer Use is switched off for this session, so "${name}" is not available. Switch the Computer Use control on in this session's composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
          return undefined;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1031-1062](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L1031-L1062)

认证不可观察时为 null，guard 仅拒绝 false。

<details>
<summary>查看原文（32行）</summary>

```text
        const browserSession = (request) => {
          const connection = connectionService();
          const auth = connection === null || connection === undefined ? null : connection.browserAuth;
          if (auth === null || auth === undefined || typeof auth.isAuthenticated !== "function") return null;
          let secure = false;
          try {
            secure = scoped.get("webServer")?.protocol === "https:";
          } catch {
            secure = false;
          }
          try {
            return auth.isAuthenticated(request, secure) === true;
          } catch {
            return false;
          }
        };

        /**
         * Refuse a mutation that did not come from the GUI window. Reads stay
         * open; every POST that changes the flag, the patch layer, the settings
         * or the toolchain has to prove it speaks for the browser session.
         */
        const guarded = (handler) => (request, response) => {
          if (request.method === "POST" && browserSession(request) === false) {
            respond(response, 401, {
              error: "this change has to come from the DSH window",
              hint: "The request carried no signed session cookie. Use the composer switch or the Settings page: a script, or a model with shell access, cannot turn desktop control on for itself.",
            });
            return;
          }
          handler(request, response);
        };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1174-1184](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L1174-L1184)

请求 sessionId 校验后进入内存 Map。

<details>
<summary>查看原文（11行）</summary>

```text
            const sessionId = typeof next?.sessionId === "string" ? next.sessionId.trim().slice(0, 128) : "";
            if (typeof next?.enabled !== "boolean" || sessionId === "") {
              respond(response, 400, {
                error: "expected { enabled: boolean, sessionId: string }",
                hint: "the switch belongs to one conversation: a host-wide write would silently move every other window too",
              });
              return;
            }
            rememberGrant(sessionId, next.enabled);
            if (reapplyToolGate !== null) reapplyToolGate();
            respond(response, 200, snapshot(sessionId));
```

</details>

**依据 6 · 源码核查**：[lib/client.js:348-360](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/client.js#L348-L360)

客户端 POST 携带当前会话身份。

<details>
<summary>查看原文（13行）</summary>

```text
        if (view.phase === "loading" || view.busy) return;
        var next = !view.enabled;
        busyRef.current = true;
        setView({ phase: view.phase, enabled: next, bridged: view.bridged, busy: true, error: null });
        try {
          fetch(apiUrl(STATE_PATH), {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ enabled: next, sessionId: sessionId }),
          })
            .then(function (response) {
              if (!response.ok) throw new Error("HTTP " + response.status);
              return response.json();
```

</details>

#### 缺口

- 未独立取得对应版本官方 bridge、tools 服务和 browserAuth 的完整实现
  **影响**：可确认本包接线和退让分支，不能证明宿主认证及限制 API 的实现边界
  **进一步探讨**：绑定实际宿主版本核对 restrict、guard、browserAuth 与会话身份契约；缺任一层时保持桌面关闭

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 诊断能否证明桌面输入会命中目标？

**研究主题**：缺陷与关键质疑、新假设与验证

#### 完整回答

不能。doctor 会运行桌面探测并生成可读报告；desktop-probe 用固定 PowerShell 片段获取 UIA 顶层元素数量、原生窗口句柄数和系统 DPI。UIA 不超过一个且窗口句柄不少于三个时，报告归因于上游 UIA 故障；高缩放时提示坐标偏移。前两者是诊断启发式，进程权限、桌面活动及应用树结构也可影响计数，不能由一次计数证明特定上游问题，更不能由截图成功推出 Click 命中。上游图像缩放、物理输入抢占等在 README 中属于作者说明，本轮没有检查上游实现或记录真实输入。

可从这种“诊断信号与最终动作结果分离”推导一个未验证设计：当 UIA 与窗口句柄矛盾，或截图尺度未确认时，先停留在观察状态，展示目标窗口及坐标换算，再由用户确认后放开交互。相对全开关，它增加按任务结果分阶段授权，需要维护窗口和尺度状态，可能增加误拦。最小比较应在相同无敏感信息的可复位 Windows 桌面，对照现有开关与分阶段方案，统计错目标输入、人工确认次数及最终合格率；若没有降低错误却显著增加阻断，假设被削弱。

#### 证据与依据

**依据 1 · 源码核查**：[lib/desktop-probe.js:35-44](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/desktop-probe.js#L35-L44)

诊断数据实际采集来源。

<details>
<summary>查看原文（10行）</summary>

```text
 */
const PROBE_SCRIPT = [
  "$ErrorActionPreference = 'SilentlyContinue'",
  "$uia = -1",
  "try { Add-Type -AssemblyName UIAutomationClient | Out-Null; $root = [System.Windows.Automation.AutomationElement]::RootElement; $uia = @($root.FindAll([System.Windows.Automation.TreeScope]::Children, [System.Windows.Automation.Condition]::TrueCondition)).Count } catch { $uia = -1 }",
  "$win = -1",
  "try { $win = @(Get-Process | Where-Object { $_.MainWindowHandle -ne 0 }).Count } catch { $win = -1 }",
  "$scale = -1",
  "try { Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public static class DshDpiProbe { [DllImport(\"user32.dll\")] public static extern uint GetDpiForSystem(); }' | Out-Null; $scale = [math]::Round([DshDpiProbe]::GetDpiForSystem() / 96.0, 3) } catch { $scale = -1 }",
  "Write-Output ('{\"uia\":' + $uia + ',\"windows\":' + $win + ',\"scale\":' + $scale + '}')",
```

</details>

**依据 2 · 源码核查**：[lib/desktop-probe.js:104-125](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/desktop-probe.js#L104-L125)

启发式阈值与高 DPI 提示。

<details>
<summary>查看原文（22行）</summary>

```text
  const handles = probe.windowHandles;
  const scale = probe.displayScale;
  const parts = [];
  parts.push(uia === null || uia === undefined ? "UI Automation unavailable" : `UI Automation sees ${uia} top-level window(s)`);
  if (handles !== null && handles !== undefined) parts.push(`${handles} window handle(s)`);
  if (scale !== null && scale !== undefined) parts.push(`display scale ${Math.round(scale * 100)}%`);

  const notes = [];
  if (
    typeof uia === "number" &&
    typeof handles === "number" &&
    handles >= 3 &&
    uia <= 1
  ) {
    notes.push(
      `UI Automation enumerates ${uia} window(s) while ${handles} window handle(s) exist. Snapshot then prints "No windows found" / "No elements" and Move/Click/Type report success without acting: this is upstream ${UPSTREAM_UIA_ISSUE}, not an install, mirror, or sandbox problem. Signing out of the Windows session (or rebooting) usually restores UI Automation; the durable fix has to land upstream.`,
    );
  }
  if (typeof scale === "number" && scale >= 1.25) {
    notes.push(
      `the primary display runs at ${Math.round(scale * 100)}% scaling. Upstream #607 divides absolute Move/Click coordinates by that factor, so requested positions land nearer the top-left than asked (1500,1100 arrives near ${Math.round(1500 / scale)},${Math.round(1100 / scale)} at this scale). Treat absolute coordinates as unreliable at non-100% scale and prefer reading positions from a Snapshot.`,
    );
```

</details>

**依据 3 · 源码核查**：[lib/index.js:929-955](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L929-L955)

doctor 工具执行探测，异常后仍返回报告。

<details>
<summary>查看原文（27行）</summary>

```text
        const dispose = scoped.tools.register({
          name: TOOL_NAME,
          description:
            "Diagnose the Windows-MCP bridge bundled by dsh-windows-mcp: uv/uvx availability, the ~/.windows-mcp install, the effective bridge row, which mcp__windows__* tools are registered, and a live desktop probe (UI Automation windows and display scaling). Use this when the Windows desktop tools are missing, failing, or report success while doing nothing.",
          parameters: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          output: {
            schema: {
              type: "object",
              properties: { report: { type: "string" } },
              required: ["report"],
              additionalProperties: false,
            },
            render(_args, value) {
              const report = typeof value?.report === "string" ? value.report : JSON.stringify(value, null, 2);
              return [{ type: "text", text: report }];
            },
          },
          async execute(_args, exec) {
            // Bounded and read-only; the probe resolves to `{ error }` instead
            // of throwing, so the report is printed either way.
            const probe = await probeDesktop();
            return { report: buildReport(scoped.tools, probe, exec?.agent, lookup) };
          },
```

</details>

#### 缺口

- 缺少同版本多DPI和UIA失常下的目标窗口及点击结果对照
  **影响**：不能证明诊断准确性或所提门槛降低误操作
  **进一步探讨**：同任务记录原始计数、目标窗口、坐标、实际变化和额外确认，用反例检验门槛

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖安装和版本切换失败后，用户如何恢复？

**研究主题**：依赖、兼容与流程、工程质量与复用、效果与总成本

#### 完整回答

宿主需要能加载官方 MCP bridge；Windows 桌面能力需要对应服务进程和交互会话，托管安装还依赖 uv、Python 解释器及包索引。updater 在启动 uv 前检查目标版本目录下的活动进程，找到则拒绝原位重装并建议先换版本或停桥重启。processes 在非 Windows、超时、启动异常或读取异常时都返回空列表，preflight 对空列表放行，所以这是尽力保护，扫描与安装之间也有时间窗口。不能把它当作完整的目录锁。镜像读失败和本地安装错误需要区别处理，避免在本地失败时无意义地遍历镜像。

安装结果只有版本标记匹配且可执行文件存在才进入激活。激活先写 profile bridge，再写版本状态；后一步失败时返回“bridge 已写但版本文件失败”，不是自动回滚事务。rollback 也是重新激活上个版本，需要用户核对有效 profile 行和实际进程、按提示重启。相较手工维护路径，版本目录、日志和回滚入口便于集中查找，但下载、解释器、占用和部分落盘仍由用户排障承担，首次与失败恢复耗时未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/updater.js:180-203](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/updater.js#L180-L203)

扫描空列表放行，命中目标进程拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
    try {
      entries = await inspectProcesses();
    } catch {
      entries = [];
    }
    if (!Array.isArray(entries) || entries.length === 0) return { ok: true };
    let toolRoot;
    try {
      toolRoot = versionToolRoot(root, version);
    } catch {
      return { ok: true };
    }
    const running = processesUnder(toolRoot, entries);
    if (running.length === 0) return { ok: true };
    // Another install may have started while the scan ran; do not overwrite it.
    if (installState.phase === "installing") return { ok: false, error: "an install is already running" };
    const pids = running
      .slice(0, 3)
      .map((entry) => `PID ${entry.pid}`)
      .join(", ");
    const message =
      `Windows-MCP is running from ${toolRoot} (${pids}). Installing in place would delete that environment while it is in use and leave it unable to start. ` +
      "Switch to another installed version (or disable the bridge), restart DSH, then install this version again.";
    return refuseInstall(version, message);
```

</details>

**依据 2 · 源码核查**：[lib/processes.js:88-122](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/processes.js#L88-L122)

平台、超时与启动异常结果。

<details>
<summary>查看原文（35行）</summary>

```text
export function listProcesses(options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : PROCESS_SCAN_TIMEOUT_MS;
  const platform = typeof options.platform === "string" ? options.platform : process.platform;
  if (platform !== "win32") return Promise.resolve([]);
  const launcher = typeof options.spawn === "function" ? options.spawn : spawn;

  return new Promise((resolve) => {
    let settled = false;
    let timer = null;
    let child = null;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      resolve(value);
    };

    try {
      timer = setTimeout(() => {
        try {
          if (child !== null && typeof child.kill === "function") child.kill();
        } catch {
          /* the result is already decided */
        }
        finish([]);
      }, timeoutMs);
      child = launcher(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", SCAN_SCRIPT],
        { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
      );
    } catch {
      finish([]);
      return;
    }
```

</details>

**依据 3 · 源码核查**：[lib/updater.js:393-411](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/updater.js#L393-L411)

安装产物检查和超时。

<details>
<summary>查看原文（19行）</summary>

```text
        const installedVersion = toolVersionIn(toolDirectory);
        const executable = executableIn(toolDirectory);
        if (installedVersion !== version || executable === null) {
          finish({
            ok: false,
            error: `uv finished, but ${toolDirectory} does not contain windows-mcp ${version}`,
          });
          return;
        }
        finish({ ok: true, executable, toolDirectory });
      });
      timer = setTimeout(() => {
        append("install timed out after 30 minutes");
        try {
          running.kill();
        } catch {
          /* already gone */
        }
        finish({ ok: false, error: "install timed out" });
```

</details>

**依据 4 · 源码核查**：[lib/updater.js:417-438](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/updater.js#L417-L438)

桥与版本状态两阶段落盘，部分失败明示。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Rewrite the bridge to the given managed version and remember it. */
  function activate(version) {
    const executable = activeInstall({ active: version }, home)?.executable ?? null;
    if (executable === null) {
      return { ok: false, error: `Windows-MCP ${version} is not installed under ${root}` };
    }
    let bridge;
    try {
      bridge = writeBridge(executable);
    } catch (error) {
      bridge = { ok: false, error: String(error) };
    }
    if (bridge?.ok !== true) return { ok: false, error: bridge?.error ?? "the bridge row could not be written", bridge };
    const state = readVersionsState(home);
    const next = activateVersion(state, version);
    try {
      writeVersionsState(next, home);
    } catch (error) {
      return { ok: false, error: `the bridge was written, but the versions file could not be updated: ${String(error)}`, bridge };
    }
    installState.bridge = bridge;
    return { ok: true, version, executable, bridge };
```

</details>

**依据 5 · 源码核查**：[lib/updater.js:522-535](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/updater.js#L522-L535)

激活与回滚需要已安装版本。

<details>
<summary>查看原文（14行）</summary>

```text
  /** Switch to a version that is already installed (no download). */
  function activateInstalled(version) {
    if (installState.phase === "installing") return { ok: false, error: "an install is already running" };
    const activated = activate(version);
    return { ...activated, view: view() };
  }

  /** Go back to the version that the active one replaced. */
  function rollback() {
    const state = readVersionsState(home);
    if (state.previous === null) return { ok: false, error: "there is no previous version to go back to", view: view() };
    const target = state.previous;
    const activated = activate(target);
    return { ...activated, rolledBackFrom: state.active, view: view() };
```

</details>

#### 缺口

- 缺少目标进程不可见、并发启动以及版本状态写失败时的实际恢复记录
  **影响**：不能证明所有占用可发现或回滚无状态分歧
  **进一步探讨**：分别观察扫描失败、同目录占用和第二次落盘失败，核对桥指向、状态文件及实际子进程

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 何种任务值得继续观察，成本和停止条件是什么？

**研究主题**：采用判断、效果与总成本、场景与需求

#### 完整回答

当前建议观察，适合能准备一次性 Windows 桌面、理解窗口和权限边界的插件维护者研究宿主集成，而不据此交给普通用户持续控制重要桌面。先固定宿主与 Python 工具版本，关闭新会话默认授权，以截图和窗口描述一致为第一项合格结果；有稳定 API 的任务优先采用 API，偶发截图者可保留人工交接。桥接、会话决定与懒揭示有可追溯源码增量，但实际认证配置、门禁兼容、撤销记录淘汰及目标输入仍影响可控性。

首次投入包括下载安装、版本目录空间和配置排障；持续投入包括图像传输、模型请求、人工核对窗口及授权；失败恢复包括停桥、重启、版本切换和检查部分写入状态；退出需禁用 bridge 并核对工具表与调用拒绝，恢复人工观察。没有现金金额、耗时、合格次数及同任务对照，不能称免费、低成本或节省固定比例。若关闭后仍能调用、授权出现在不预期会话、目标画面不一致或桥与版本状态冲突，应停止自动操作，由人确认 profile 和进程。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:43-69](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/cordis.patch.yml#L43-L69)

退回禁用 bridge 的配置边界。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    - id: windows-mcp-plugin
      name: dsh-windows-mcp

    - id: windows-mcp-bridge
      name: "@deepseek-ai/dsh-mcp-client"
      # Inert until the installer points it at a real executable (see above):
      # a cold `uvx` resolve inside DSH's startup can hang the whole window.
      disabled: true
      config:
        # Namespace for every tool name: mcp__windows__Screenshot, ...
        serverName: windows
        transport: stdio
        # Only reached if someone re-enables this row without rewriting
        # `command`; harmless, because by then the toolchain is installed.
        command: uvx
        args:
          # Pinned for reproducibility. Replace with `windows-mcp` to float, or
          # with an absolute path to a fixed interpreter (`python -m windows_mcp`).
          - windows-mcp@0.8.8
          - serve
          # Curation: drop the tools DSH already covers (its own shell and file
          # tools), plus `App`, which upstream only supports reliably on an
          # English Windows install. Never list `ControlStatus` here — upstream
          # keeps it unconditionally.
          - --exclude-tools
          - App,PowerShell,FileSystem
```

</details>

**依据 2 · 源码核查**：[lib/index.js:343-400](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L343-L400)

采用必须考虑会话继承、默认授权与有界决定。

<details>
<summary>查看原文（58行）</summary>

```text
function grantChainOf(session, lookup) {
  const chain = [];
  let current = session;
  for (let depth = 0; depth < 8 && current !== null && current !== undefined; depth += 1) {
    chain.push(current);
    const header = current.header;
    if (header?.origin !== "subagent" || typeof header.parentSession !== "string") break;
    current = lookup(header.parentSession);
  }
  return chain;
}

/**
 * True when the desktop is granted for this agent's conversation. The nearest
 * explicit decision wins, so a session can also revoke what its lineage granted
 * without touching the parent's switch. A conversation whose whole lineage has
 * never decided falls back to the settings default; a call that names no session
 * at all is refused, whatever that default says.
 */
function grantedFor(agent, lookup) {
  const session = agent?.session;
  if (session === null || session === undefined) {
    const fallback = sessionIdOf(agent);
    if (fallback === null) return false;
    const explicit = sessionGrants.get(fallback);
    return explicit === undefined ? defaultGrantEnabled() : explicit;
  }
  for (const candidate of grantChainOf(session, lookup)) {
    const explicit = sessionGrants.get(candidate.id);
    if (explicit !== undefined) return explicit;
  }
  return defaultGrantEnabled();
}

/** The grant for one session id, which is what the pill asks the route about. */
function grantedForSessionId(sessionId, lookup) {
  if (typeof sessionId !== "string" || sessionId === "") return false;
  const session = lookup(sessionId);
  if (session === null || session === undefined) {
    const explicit = sessionGrants.get(sessionId);
    return explicit === undefined ? defaultGrantEnabled() : explicit;
  }
  return grantedFor({ session }, lookup);
}

/**
 * Record one session's decision. Re-inserting keeps the map in
 * least-recently-written order and the bound keeps a page that mints session ids
 * from turning the route into a memory amplifier.
 */
function rememberGrant(sessionId, enabled) {
  sessionGrants.delete(sessionId);
  sessionGrants.set(sessionId, enabled === true);
  while (sessionGrants.size > MAX_GRANT_ENTRIES) {
    const oldest = sessionGrants.keys().next().value;
    if (typeof oldest !== "string") break;
    sessionGrants.delete(oldest);
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:595-605](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/index.js#L595-L605)

关闭后的分派拒绝是退出检查依据。

<details>
<summary>查看原文（11行）</summary>

```text
        if (typeof scoped?.tools?.guard !== "function") return;
        scoped.tools.guard((execution) => {
          const name = execution?.name;
          if (!isBridgedToolName(name)) return undefined;
          if (!grantedFor(execution?.agent, lookup)) {
            return `Computer Use is switched off for this session, so "${name}" is not available. Switch the Computer Use control on in this session's composer and retry.`;
          }
          if (!isToolRevealed(execution?.agent, name)) {
            return `"${name}" is hidden to save context. Call ${REVEAL_TOOL_NAME} first (with no arguments it reveals every desktop capability), then retry.`;
          }
          return undefined;
```

</details>

**依据 4 · 源码核查**：[lib/updater.js:417-438](https://github.com/helloHub1212/dsh-windows-mcp/blob/3eeb98423d26f5878b5ddf3f3abaa065e3e3f019/lib/updater.js#L417-L438)

失败恢复需检查桥/版本状态分歧。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Rewrite the bridge to the given managed version and remember it. */
  function activate(version) {
    const executable = activeInstall({ active: version }, home)?.executable ?? null;
    if (executable === null) {
      return { ok: false, error: `Windows-MCP ${version} is not installed under ${root}` };
    }
    let bridge;
    try {
      bridge = writeBridge(executable);
    } catch (error) {
      bridge = { ok: false, error: String(error) };
    }
    if (bridge?.ok !== true) return { ok: false, error: bridge?.error ?? "the bridge row could not be written", bridge };
    const state = readVersionsState(home);
    const next = activateVersion(state, version);
    try {
      writeVersionsState(next, home);
    } catch (error) {
      return { ok: false, error: `the bridge was written, but the versions file could not be updated: ${String(error)}`, bridge };
    }
    installState.bridge = bridge;
    return { ok: true, version, executable, bridge };
```

</details>

#### 缺口

- 没有同条件合格桌面任务的质量、总耗时和人工负担记录
  **影响**：无法证明采用收益覆盖全周期负担
  **进一步探讨**：固定公开任务与人工或API基线，计入失败重试与复核，并观察退出后是否仍有桌面副作用

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
