# Code RAG 索引面板

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5c8ddfb](https://github.com/Ankali-Aylina/code-rag/tree/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ankali-Aylina/code-rag) [![npm 30d 711](https://img.shields.io/static/v1?label=npm+30d&message=711&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code-rag-index-panel) [![最新发布 2026-08-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-code-rag-index-panel)
<!-- END META -->

> **功能**：在DSH会话显示Code RAG索引状态与进度，并提供索引操作、设置和诊断卡片。

> **亮点**：把索引状态、进度、依赖诊断与手动动作放入编码现场，并分离选模式与资源触发。[Q03](#research-q03) 贡献属于控制流程，不是新检索算法。

> **主要限制**：端口在线与诊断绿灯并不证明当前根和索引新鲜度；多实例选最新、集合404判不可达及setup执行脚本须明确。[Q04](#research-q04)

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
  - [Q01 · 谁需要会话中的索引可见性？](#detail-section-11)
  - [Q02 · 前端、宿主半部与索引服务如何连通？](#detail-section-12)
  - [Q03 · 相对命令行和MCP操作，新增了什么？](#detail-section-13)
  - [Q04 · 多服务与工作区映射会使哪些判断失真？](#detail-section-14)
  - [Q05 · 安装、首次索引和日常维护依赖什么？](#detail-section-15)
  - [Q06 · 哪些工程模式可复用，哪些薄弱点值得注意？](#detail-section-16)
  - [Q07 · 索引新鲜度驱动检索准入是否值得做？](#detail-section-17)
  - [Q08 · 哪些部署值得试用？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已运行code-rag的开发者在DSH会话中查看和维护当前根索引。

对照现有MCP索引命令和直接HTTP状态查询；原生文件搜索是需求较轻时的替代，未进行召回质量或节时排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 索引状态与动作 | 当前根进度、增量、重建和取消 | 需code-rag服务；直连动作错误反馈有限 |
| 诊断与配置 | 查看依赖问题并写配置 | 需宿主桥；保存不等于运行配置生效 |
| 模式显示约束 | 仅Code RAG会话显示或全局显示 | settings缺失默认严格；不自动索引 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web/React/slots | 界面必需 | dock及设置卡 | 入口不可用 |
| webServer | 设置诊断必需 | 本机桥 | host行等待；直连条仍依其环境 |
| code-rag服务 | 索引必需 | 本地HTTP索引操作 | 按钮等待服务 |
| Qdrant/Ollama/嵌入模型 | 底层索引必需 | 向量存储与嵌入 | 面板不能替代其准备 |
| settings/schemastery | 新设置卡可选 | 显示范围配置 | 退化到兼容卡和默认严格 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户准备服务、模型和profile接入 | 预设和dist产物存在 |
| 2 | 重启DSH选择Code RAG会话 | 显示条且不自动索引 |
| 3 | 核对根后手动增量索引 | 任务状态与实际向量变化一致 |
| 4 | 遇错诊断、必要时取消或重建 | 明确setup会执行脚本；失败保留错误 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型、向量库和索引占磁盘算力；金额未知 | 环境部署、根核对；耗时未知 | 不把本地组件称零成本 |
| 持续使用 | 轮询和增量嵌入资源 | 配置变更后重启与排错 | 实际规模性能未测 |
| 失败恢复 | 取消、重建重复计算 | 检查多实例、孤儿向量与根 | 全量重建成本未量化 |
| 迁移 | 重新setup和配置适配 | 仓库路径更改需重接入 | profile写入需备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 维护可见性 | 进度和依赖问题列表 | 实际排错节时 |
| 避免无意索引 | 选模式不自动触发 | 真实宿主是否完全按预期 |
| 检索质量 | 面板可控制底层索引 | 召回、代码正确率和新鲜度未测 |

> **思考**：端口在线与诊断绿灯并不证明当前根和索引新鲜度；多实例选最新、集合404判不可达及setup执行脚本须明确。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把索引状态、进度、依赖诊断与手动动作放入编码现场，并分离选模式与资源触发。[Q03](#research-q03) 贡献属于控制流程，不是新检索算法。

回环守卫、超时、白名单原子配置写入和路由清理可复用；预设正则解析、双份默认值和客户端未读取动作错误体增加维护风险。

<a id="detail-section-5"></a>

### 1.4 主要限制

端口在线与诊断绿灯并不证明当前根和索引新鲜度；多实例选最新、集合404判不可达及setup执行脚本须明确。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议已有本机code-rag基础设施且能核对目标根的开发者试用；普通搜索需求先比较现有工具，setup和重建须按实际写入与算力操作处理。[Q08](#research-q08)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认面板、代理与配置机制；未验证真实多服务根映射或检索收益；新鲜度准入是假设。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-code-rag-index-panel/README.md、plugins/dsh-code-rag-index-panel/README.zh.md、plugins/dsh-code-rag-index-panel/package.json、plugins/dsh-code-rag-index-panel/lib/index.js、plugins/dsh-code-rag-index-panel/lib/client.js、plugins/dsh-code-rag-index-panel/cordis.patch.yml 及固定范围 inventory；组件：plugins/dsh-code-rag-index-panel。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件源码及同版本作者说明；不执行setup、索引、依赖安装或宿主运行，不把根仓库算法作为组件独有成果。
- 下一步：隔离profile用小仓库验证当前根、索引/取消、错误状态与配置重启生效；再做多实例和分支切换实验，避免以服务在线替代新鲜度验收。

**分析版本**

- **仓库**：[Ankali-Aylina/code-rag](https://github.com/Ankali-Aylina/code-rag)
- **版本号**：1.4.1（[固定提交 5c8ddfb](https://github.com/Ankali-Aylina/code-rag/tree/5c8ddfbde8a6dd0fff6d1292595064ea647edd83)）
- **版本日期**：2026-08-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是以工作区和索引代次指纹标记过期检索，并允许明确选择刷新，可减少旧代码引用；需同时计等待和嵌入资源。[Q07](#research-q07)

隔离profile用小仓库验证当前根、索引/取消、错误状态与配置重启生效；再做多实例和分支切换实验，避免以服务在线替代新鲜度验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1467 | 1278 | 151 | — |
| .md | source | 2 | 318 | — | — | 3235 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Ankali-Aylina/code-rag/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Code RAG索引面板能否把索引状态和维护操作带入当前代码会话，增量与跨服务边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话中的索引可见性？

**研究主题**：场景与需求

#### 完整回答

面向已采用code-rag检索服务、需要知道当前代码工作区是否已索引的开发者。合格结果是会话能识别目标根、显示任务状态，并让用户明确触发增量索引、全量重建或取消；不是由面板自己生成更准确检索。作者说明输入框上方状态条和设置诊断卡片，客户端实际注册conversation.input.dock。替代方式是调用MCP索引工具或直接查本地HTTP状态；插件把操作放回编码会话，减少来回查服务的步骤，但没有实测节时。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-code-rag-index-panel/README.zh.md:5-19](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/README.zh.md#L5-L19)

作者界定索引状态和动作。

<details>
<summary>查看原文（15行）</summary>

```text
DeepSeek Harness 客户端插件：**Code RAG 索引面板**（索引状态条 + 设置页诊断与配置卡片）。

在会话输入框上方（`conversation.input.dock` 插槽）渲染一条索引状态条：

- 显示：当前根、索引状态、**进行中任务的进度条**（% / 文件 / 分块）、错误明细；
- 按钮：**开始索引**（增量）/ **全量重建** / **取消**；
- 数据与按钮操作与 MCP 工具（`mcp__code_rag__*`）同源，直连 code-rag 服务器的
  本地 HTTP 端点（`GET /api/status`、`POST /api/index`、`POST /api/cancel`，
  端口 8756 起自动探测 31 个端口）。

## 功能

- **索引状态条**：当前根 / 索引状态 / 实时进度（% + 文件 + 分块）/ 错误明细，按钮 开始索引 / 全量重建 / 取消；
- **设置诊断卡片**：设置页「插件」区（新架构）与「Web 插件」区（兼容层）双位置出现，一键检测服务器 / Qdrant / Ollama / 预设 / 配置并列出问题清单，可编辑配置、执行索引动作；
- **显示范围开关**：仅 Code RAG 模式会话（默认，严格）或所有会话；
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:928-940](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L928-L940)

输入框dock注册实际入口。

<details>
<summary>查看原文（13行）</summary>

```text
    ctx.slots.inject('conversation.input.dock', function () {
      return ctx.slots.register(
        {
          name: 'conversation.input.dock',
          id: 'code-rag-index',
          order: 30,
          inject: function (sessionId) {
            return { sessionId: sessionId, scope: settingsScope, sessions: ctx.sessions }
          }
        },
        IndexDock
      )
    })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 前端、宿主半部与索引服务如何连通？

**研究主题**：功能与机制

#### 完整回答

有两条路径。输入框状态条直接扫描本机8756起31个端口并轮询/api/status，动作直接POST索引服务/api/index或/api/cancel。设置卡片则经过宿主/api/code-rag/diag、config、action桥；宿主读取panel.json和预设文件、探测Qdrant及Ollama，代理索引或在仓库执行setup。严格显示模式只按会话preset是否code-rag判定，服务在线不再让其他会话显示；选模式本身不自动索引。面板是控制与诊断层，索引算法和向量检索属于同仓库服务，不能归为该组件独有能力。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:183-198](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L183-L198)

服务端端口发现。

<details>
<summary>查看原文（16行）</summary>

```text
/** 定位正在运行的索引服务器：panel.json 端口优先，其次探测 8756-8786 选最新。 */
const findServerPort = async (panel) => {
  if (panel.port > 0) {
    const status = await fetchJson(`http://127.0.0.1:${panel.port}/api/status`)
    if (status?.ok === true) return { port: panel.port, status }
  }
  const candidates = await Promise.all(
    Array.from({ length: 31 }, (_, i) => 8756 + i).map(async (port) => {
      const status = await fetchJson(`http://127.0.0.1:${port}/api/status`, {}, 1200)
      return status?.ok === true ? { port, status } : null
    }),
  )
  const found = candidates.filter(Boolean)
  if (found.length === 0) return { port: 0, status: null }
  found.sort((a, b) => (a.status.startedAt < b.status.startedAt ? 1 : -1))
  return found[0]
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:429-462](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L429-L462)

直连动作与根选择。

<details>
<summary>查看原文（34行）</summary>

```text

    // 目标根：默认始终是当前会话工作区——任意工作区都能直接索引/检索，
    // 服务器对未认识的根按需创建上下文（/api/index 接受任意 root）。
    // 仅当工作区根被"证实不是代码库"（索引任务扫描到 0 个文件）时，
    // 才回退到服务器当前根（例如工作区只是会话目录、代码库在其子目录）。
    var wsRootState = workspaceCwd && info && info.roots
      ? info.roots.find(function (r) { return r.root === workspaceCwd })
      : null
    var wsTask = wsRootState ? wsRootState.task : null
    var wsKnownNonCodebase = !!wsRootState && wsRootState.files === 0 && !!wsTask &&
      wsTask.total === 0 && (wsTask.status === 'error' || wsTask.status === 'done')
    var targetRoot = wsKnownNonCodebase
      ? (info && info.currentRoot ? info.currentRoot : workspaceCwd)
      : workspaceCwd
    var act = async function (full) {
      if (port === 0 || busy || !targetRoot) return
      setBusy(true)
      try {
        await fetchWithTimeout('http://127.0.0.1:' + port + '/api/index', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ root: targetRoot, full: full === true })
        })
      } catch (e) { setOffline(true) }
      setBusy(false)
    }
    var cancel = async function () {
      if (port === 0 || !targetRoot) return
      try {
        await fetchWithTimeout('http://127.0.0.1:' + port + '/api/cancel', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ root: targetRoot })
        })
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:480-499](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L480-L499)

严格preset判定和等待启动。

<details>
<summary>查看原文（20行）</summary>

```text
    // 严格模式（默认）：仅 Code RAG 模式会话显示；设置里关掉 strictIndexBar 则所有会话显示。
    // 注意：严格模式只按会话预设判定，**绝不以服务器在线兜底**——code-rag 服务器由
    // 某个 Code RAG 会话拉起后会常驻（例如切到标准模式会话仍在跑），若探测到服务器
    // 就让所有会话显示索引条，会违背「仅 Code RAG 模式会话」的语义（v1.4.1 修复）。
    // v1.4.0 起 preset 通过实时快照 + sessions.list 订阅可靠落地，不再需要时序兜底。
    // ⚠️ scopeValue 为 undefined 是合法状态（命名空间未注册/尚未加载），必须视为
    //    「未设置」→ 严格模式默认；直接读 .strictIndexBar 会 TypeError 导致槽位崩溃。
    var scopeValue = scope && typeof scope.getSnapshot === 'function' ? scope.getSnapshot().value : null
    var strict = scopeValue === null || scopeValue === undefined || scopeValue.strictIndexBar !== false
    var isCodeRag = sessionPreset === 'code-rag'
    var serverUp = port > 0 || info !== null
    if (strict && !isCodeRag) return null

    var statusText = isCodeRag && !serverUp
      // Code RAG 模式会话但服务器尚未就绪（选了模式未发消息 / 服务器启动中）：
      // 条已显示，按钮禁用，就绪后自动可用 —— 绝不自动开始索引。
      ? t('d.serverStarting')
      : offline
        ? t('d.serverNotFound')
        : !info
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:395-423](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L395-L423)

设置动作包含setup及服务代理。

<details>
<summary>查看原文（29行）</summary>

```text
    if (actionName === 'setup') {
      const preset = readPreset()
      const repoDir = preset.mainJs ? dirname(dirname(preset.mainJs)) : null
      const result = await runSetup(repoDir, root ?? preset.root ?? preset.cwd)
      writeJson(res, result.ok ? 200 : 500, { ok: result.ok, output: result.output })
      return
    }
    const panel = readPanel()
    const server = await findServerPort(panel)
    if (!server.status) {
      writeJson(res, 503, { ok: false, error: { code: 'SERVER_DOWN', message: '索引服务器未运行（请先启动 Code RAG 模式会话）' } })
      return
    }
    const base = `http://127.0.0.1:${server.port}`
    let result
    if (actionName === 'cancel') {
      result = await fetchJson(`${base}/api/cancel`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(root ? { root } : {}),
      }, 5000)
    } else {
      result = await fetchJson(`${base}/api/index`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ root: root ?? undefined, full: actionName === 'rebuild' }),
      }, 5000)
    }
    writeJson(res, result ? 200 : 502, result ?? { ok: false, error: { code: 'PROXY_FAILED', message: '索引服务器无响应' } })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对命令行和MCP操作，新增了什么？

**研究主题**：贡献与相对优势

#### 完整回答

明确增量是把根目录、进度和依赖诊断放在任务现场，并把配置修复和索引动作组合为可见维护流程。用户可以先看到Ollama模型缺失、Qdrant不可达、预设产物缺失等具体原因，再手动处理，而非仅收到检索失败。显示严格绑定会话模式、未发消息即展示且不自动索引，是对资源触发和会话语义的实用约束。HTTP代理、轮询、配置白名单是成熟工程方法；未识别新检索算法，不能把底层code-rag检索效果或整个仓库能力都算为面板贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:316-333](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L316-L333)

问题列表覆盖服务依赖和孤儿向量。

<details>
<summary>查看原文（18行）</summary>

```text
    const issues = []
    if (!preset.exists) issues.push('模式预设未安装（在 code-rag 仓库运行 npm run setup）')
    if (preset.mainJs && !existsSync(preset.mainJs)) issues.push(`dist/main.js 不存在（先 npm run build）：${preset.mainJs}`)
    if (!server.status) issues.push('索引服务器未运行（请启动 Code RAG 模式会话）')
    if (!qdrant.reachable) issues.push(`Qdrant 不可达：${effective.qdrantUrl}（请启动 Docker 容器）`)
    else if (!qdrant.hasCollection) issues.push(`Qdrant 集合「${effective.collection}」不存在（首次请先索引）`)
    if (!ollama.reachable) issues.push(`Ollama 不可达：${effective.ollamaUrl}`)
    else if (!ollama.hasModel) issues.push(`嵌入模型「${effective.embedModel}」未安装（ollama pull ${effective.embedModel}）`)
    // 索引一致性：状态文件（files）与 Qdrant（vectors）应同步；中断的索引任务会留下孤儿向量
    for (const r of server.status?.roots ?? []) {
      const files = Number(r.files) || 0
      const vectors = Number(r.vectors) || 0
      if (files === 0 && vectors > 0) {
        issues.push(`「${r.root}」有 ${vectors} 个孤立向量但状态文件无记录（索引任务曾被中断）—— 对该根执行一次全量重建可修复`)
      } else if (files > 0 && vectors === 0) {
        issues.push(`「${r.root}」状态文件记录 ${files} 个文件但 Qdrant 无向量（集合可能被清过）—— 对该根执行一次索引可修复`)
      }
    }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:480-499](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L480-L499)

显示与动作触发分开。

<details>
<summary>查看原文（20行）</summary>

```text
    // 严格模式（默认）：仅 Code RAG 模式会话显示；设置里关掉 strictIndexBar 则所有会话显示。
    // 注意：严格模式只按会话预设判定，**绝不以服务器在线兜底**——code-rag 服务器由
    // 某个 Code RAG 会话拉起后会常驻（例如切到标准模式会话仍在跑），若探测到服务器
    // 就让所有会话显示索引条，会违背「仅 Code RAG 模式会话」的语义（v1.4.1 修复）。
    // v1.4.0 起 preset 通过实时快照 + sessions.list 订阅可靠落地，不再需要时序兜底。
    // ⚠️ scopeValue 为 undefined 是合法状态（命名空间未注册/尚未加载），必须视为
    //    「未设置」→ 严格模式默认；直接读 .strictIndexBar 会 TypeError 导致槽位崩溃。
    var scopeValue = scope && typeof scope.getSnapshot === 'function' ? scope.getSnapshot().value : null
    var strict = scopeValue === null || scopeValue === undefined || scopeValue.strictIndexBar !== false
    var isCodeRag = sessionPreset === 'code-rag'
    var serverUp = port > 0 || info !== null
    if (strict && !isCodeRag) return null

    var statusText = isCodeRag && !serverUp
      // Code RAG 模式会话但服务器尚未就绪（选了模式未发消息 / 服务器启动中）：
      // 条已显示，按钮禁用，就绪后自动可用 —— 绝不自动开始索引。
      ? t('d.serverStarting')
      : offline
        ? t('d.serverNotFound')
        : !info
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多服务与工作区映射会使哪些判断失真？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前根选择以会话cwd优先，只有发现该根零文件且任务完成或错误才回退服务器当前根；这是有条件的回退，不保证用户意图与扫描根完全一致。端口发现优先panel端口，否则取startedAt最新服务，没有独立实例身份或项目绑定认证；多服务场景应核对面板显示的根。诊断的Qdrant探测只请求具体集合，404与服务不可达同样返回null，hasCollection缺失分支因此不能可靠区分两者。config只验证root存在并写白名单字段，数字仅检查有限值，不限定维度或分块合理范围。setup动作会执行仓库脚本，并非只读诊断。上述边界影响信任和维护，不能从绿灯推导检索质量。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:429-442](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L429-L442)

根回退条件。

<details>
<summary>查看原文（14行）</summary>

```text

    // 目标根：默认始终是当前会话工作区——任意工作区都能直接索引/检索，
    // 服务器对未认识的根按需创建上下文（/api/index 接受任意 root）。
    // 仅当工作区根被"证实不是代码库"（索引任务扫描到 0 个文件）时，
    // 才回退到服务器当前根（例如工作区只是会话目录、代码库在其子目录）。
    var wsRootState = workspaceCwd && info && info.roots
      ? info.roots.find(function (r) { return r.root === workspaceCwd })
      : null
    var wsTask = wsRootState ? wsRootState.task : null
    var wsKnownNonCodebase = !!wsRootState && wsRootState.files === 0 && !!wsTask &&
      wsTask.total === 0 && (wsTask.status === 'error' || wsTask.status === 'done')
    var targetRoot = wsKnownNonCodebase
      ? (info && info.currentRoot ? info.currentRoot : workspaceCwd)
      : workspaceCwd
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:184-205](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L184-L205)

端口选择和集合探测返回。

<details>
<summary>查看原文（22行）</summary>

```text
const findServerPort = async (panel) => {
  if (panel.port > 0) {
    const status = await fetchJson(`http://127.0.0.1:${panel.port}/api/status`)
    if (status?.ok === true) return { port: panel.port, status }
  }
  const candidates = await Promise.all(
    Array.from({ length: 31 }, (_, i) => 8756 + i).map(async (port) => {
      const status = await fetchJson(`http://127.0.0.1:${port}/api/status`, {}, 1200)
      return status?.ok === true ? { port, status } : null
    }),
  )
  const found = candidates.filter(Boolean)
  if (found.length === 0) return { port: 0, status: null }
  found.sort((a, b) => (a.status.startedAt < b.status.startedAt ? 1 : -1))
  return found[0]
}

/** 探测 Qdrant：集合可达性 + 目标集合是否存在。 */
const probeQdrant = async (qdrantUrl, collection) => {
  const base = await fetchJson(`${qdrantUrl.replace(/\/+$/, '')}/collections/${collection}`)
  if (base === null) return { reachable: false, hasCollection: false }
  return { reachable: true, hasCollection: true, status: base.result?.status ?? null }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:239-253](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L239-L253)

数值仅有限检查并原子写配置。

<details>
<summary>查看原文（15行）</summary>

```text
      } else if (typeof DEFAULTS[key] === 'number') {
        // 数值键：非法输入跳过该键（避免 NaN → JSON null 污染配置）
        const n = Number(patch[key])
        if (Number.isFinite(n)) merged[key] = n
      } else {
        merged[key] = String(patch[key])
      }
    }
  }
  const dir = join(root, '.code-rag')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'config.json')
  const tmp = `${file}.tmp`
  writeFileSync(tmp, JSON.stringify(merged, null, 2), 'utf8')
  renameSync(tmp, file)
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:395-399](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L395-L399)

setup确实执行脚本。

```text
    if (actionName === 'setup') {
      const preset = readPreset()
      const repoDir = preset.mainJs ? dirname(dirname(preset.mainJs)) : null
      const result = await runSetup(repoDir, root ?? preset.root ?? preset.cwd)
      writeJson(res, result.ok ? 200 : 500, { ok: result.ok, output: result.output })
```

#### 缺口

- 多实例误连与根回退在实际多项目部署中的影响未知
  **影响**：不能保证当前索引总与当前会话代码一致
  **进一步探讨**：同时启动两个服务、切换cwd并比较请求root与实际索引集合。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、首次索引和日常维护依赖什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

该包不是独立RAG服务。需要运行的code-rag服务器、Qdrant向量库、Ollama及匹配维度的嵌入模型；面板宿主端要求webServer，设置命名空间可选依赖settings和schemastery，前端要求React与slots。README推荐根仓库setup接入profile，该操作会修改profile并要求构建产物，不能只把本组件npm安装成功视为可用。首次拉模型、建立索引需要本机磁盘、内存、CPU或加速资源；日常轮询和重建也有开销，现金及时间均未测。保存配置要重启Code RAG会话才生效，环境变量与CLI优先级可能覆盖配置文件。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-code-rag-index-panel/README.zh.md:32-40](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/README.zh.md#L32-L40)

作者声明Qdrant和Ollama前提。

````text
```

## 环境依赖（本地免费，需先就绪）

索引依赖两个本机免费组件：**Qdrant**（向量库，端口 6333）与 **Ollama**（本地嵌入，
端口 11434）。二者缺一不可，首次索引前请确保就绪。

### Qdrant（Docker）

````

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:27-35](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L27-L35)

webServer是注入前提。

```text
/**
 * webServer 必须用 inject 声明（而非 ctx.get 探测）：
 * inject 是 Cordis 的就绪等待机制——服务注册完成后才调用 apply；
 * ctx.get() 在 apply 时立即查询，服务尚未就绪会返回 undefined，
 * 导致正常 Web 部署下路由注册被静默跳过（v1.2.0 实测踩坑）。
 * 无 webServer 的部署（如 Electron）插件行保持等待而非崩溃，
 * 客户端索引条仍可直连 code-rag 服务器。
 */
export const inject = ['webServer']
```

**依据 3 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:440-457](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L440-L457)

settings注册可退化。

<details>
<summary>查看原文（18行）</summary>

```text
const registerPanelSettings = (ctx) => {
  let z = null
  try { z = hostRequire('schemastery') } catch { return }
  if (!z || typeof z.object !== 'function' || typeof z.boolean !== 'function') return
  const register = (settingsCtx) => {
    try {
      const schema = z.object({ strictIndexBar: z.boolean().required(false) })
      settingsCtx.settings.register(PANEL_SETTINGS_NS, schema)
    } catch { /* 重复注册/校验失败等：不影响其它功能 */ }
  }
  try {
    if (typeof ctx.inject === 'function') {
      ctx.inject(['settings'], register)
    } else {
      const s = ctx.get('settings')
      if (s && typeof s.register === 'function') register({ settings: s })
    }
  } catch { /* ignore */ }
```

</details>

**依据 4 · 作者声明**：[plugins/dsh-code-rag-index-panel/README.zh.md:93-107](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/README.zh.md#L93-L107)

配置及生效条件。

<details>
<summary>查看原文（15行）</summary>

```text
修改 `lib/index.js`（host 半部，如端点/命名空间注册）则需**重启 DSH** 生效。

## 使用

1. 在 DSH Web 模式选择器里选 **Code RAG 模式** 新建会话（保持其运行，索引服务器随之启动）；
2. 输入框上方出现索引条后，点 **开始索引**（增量）或 **全量重建**，进度实时显示（% / 文件 / 分块）；
3. 换工作区时让模型调用 `mcp__code_rag__set_root` 切换根后再索引（或直接在设置卡片里改 root）；
4. 需要调整 Qdrant / Ollama / 嵌入模型 / 分块等参数时，在设置卡片里修改并保存（写入
   `<root>/.code-rag/config.json`，重启 Code RAG 模式会话后生效）。

## 配置（<root>/.code-rag/config.json）

优先级（从低到高）：**内置默认值 < 配置文件 < 环境变量（`CODE_RAG_*`）< 命令行参数**。
设置卡片可编辑以下白名单键（保存即写入该文件）：

```

</details>

#### 缺口

- 本地模型与索引规模对应资源成本未量化
  **影响**：无法比较面板流程和命令行的端到端负担
  **进一步探讨**：固定仓库、模型和硬件，计首扫、增量和重建时间及用户修复步骤。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些工程模式可复用，哪些薄弱点值得注意？

**研究主题**：工程质量与复用

#### 完整回答

宿主桥具回环socket、Host、Origin和cross-site守卫，fetch有超时，配置经白名单合并后临时文件rename；路由disposer在effect中回收。这些适合复用为本地服务控制面板。限制是预设配置用逐行正则提取而非完整YAML解析，复杂格式可能读错；默认值在服务与面板两处镜像，存在漂移维护成本。客户端直连索引动作等待fetch但没有读取HTTP错误体，与设置桥的结构化错误展示不完全一致，失败可能要依靠后续轮询发现。复用时应统一实例身份、错误协议和配置schema，而非复制端口猜测逻辑。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:105-139](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L105-L139)

回环守卫与网络超时。

<details>
<summary>查看原文（35行）</summary>

```text
/** 环回请求守卫：socket 地址 + Host 头 + Origin 三重校验（同 dsh-doctor 模式）。 */
const isLoopbackRequest = (req) => {
  const ipv4 = (v) => {
    const parts = String(v).split('.')
    return parts.length === 4 && parts[0] === '127' && parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255)
  }
  const remote = String(req.socket?.remoteAddress ?? '').toLowerCase()
  const loopbackAddr = remote === '::1' || remote.startsWith('::ffff:127.') || ipv4(remote)
  if (!loopbackAddr) return false
  const host = req.headers.host
  if (typeof host !== 'string') return false
  let hostUrl
  try { hostUrl = new URL('http://' + host) } catch { return false }
  const hostname = hostUrl.hostname.toLowerCase()
  if (hostname !== 'localhost' && hostname !== '[::1]' && !ipv4(hostname)) return false
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return true
  try { return new URL(origin).host === hostUrl.host } catch { return false }
}

/** 带超时的 fetch（返回 null 表示不可达）。 */
const fetchJson = async (url, opts = {}, timeoutMs = 2000) => {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  timer.unref?.()
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:156-180](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L156-L180)

按行解析预设文件。

<details>
<summary>查看原文（25行）</summary>

```text
/** 从预设 agent.cordis.yml 的 mcp-code-rag 行提取 main.js / root / cwd。 */
const readPreset = () => {
  let text = null
  try {
    if (existsSync(PRESET_FILE)) text = readFileSync(PRESET_FILE, 'utf8')
  } catch { /* ignore */ }
  const out = { path: PRESET_FILE, exists: text !== null, mainJs: null, root: null, cwd: null }
  if (!text) return out
  const lines = text.split(/\r?\n/)
  let inMcp = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^- id:/.test(line)) { inMcp = /mcp-code-rag/.test(line); continue }
    if (!inMcp) continue
    const arg = line.match(/^\s*-\s*'([^']*)'/)
    if (arg) {
      const value = arg[1]
      if (out.mainJs === null && /dist[/\\]main\.js$/.test(value)) out.mainJs = value
      else if (out.root === null && value !== 'serve' && !value.startsWith('-')) out.root = value
      continue
    }
    const cwd = line.match(/^\s*cwd:\s*'([^']*)'/)
    if (cwd) out.cwd = cwd[1]
  }
  return out
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:248-254](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L248-L254)

临时写后rename。

```text
  const dir = join(root, '.code-rag')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'config.json')
  const tmp = `${file}.tmp`
  writeFileSync(tmp, JSON.stringify(merged, null, 2), 'utf8')
  renameSync(tmp, file)
  return { path: file, values: merged }
```

**依据 4 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:460-468](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L460-L468)

路由生命周期释放。

```text
/** Host 插件体：注册 /api/code-rag/* 路由（生命周期随插件回收；webServer 由 inject 保证就绪）。 */
export function apply(ctx) {
  const disposers = makeRoutes().map((route) => ctx.webServer.register(route))
  ctx.effect(() => {
    return () => {
      for (const dispose of disposers) dispose()
    }
  })
  registerPanelSettings(ctx)
```

**依据 5 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:443-462](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L443-L462)

直连动作未检查res.ok。

<details>
<summary>查看原文（20行）</summary>

```text
    var act = async function (full) {
      if (port === 0 || busy || !targetRoot) return
      setBusy(true)
      try {
        await fetchWithTimeout('http://127.0.0.1:' + port + '/api/index', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ root: targetRoot, full: full === true })
        })
      } catch (e) { setOffline(true) }
      setBusy(false)
    }
    var cancel = async function () {
      if (port === 0 || !targetRoot) return
      try {
        await fetchWithTimeout('http://127.0.0.1:' + port + '/api/cancel', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ root: targetRoot })
        })
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 索引新鲜度驱动检索准入是否值得做？

**研究主题**：新假设与验证

#### 完整回答

从当前面板已有根、任务状态、文件与向量一致性诊断，可提出未验证假设：在检索前比较工作区版本指纹与已完成索引指纹，并让用户选择更新或以“可能过期”状态继续，能减少把旧索引结果当最新代码的错误。增量不是自动重建一切，而是把新鲜度显式绑定检索证据。需要底层服务提供可靠指纹、任务代次和根身份，增加状态维护成本。最小验证对固定代码仓做新增、删除和分支切换，比较无门槛面板与显式新鲜度流程的过期引用、等待和额外嵌入量；若误阻塞频繁或错误未下降，则否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:324-333](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L324-L333)

文件与向量的粗粒度一致性已有入口。

<details>
<summary>查看原文（10行）</summary>

```text
    // 索引一致性：状态文件（files）与 Qdrant（vectors）应同步；中断的索引任务会留下孤儿向量
    for (const r of server.status?.roots ?? []) {
      const files = Number(r.files) || 0
      const vectors = Number(r.vectors) || 0
      if (files === 0 && vectors > 0) {
        issues.push(`「${r.root}」有 ${vectors} 个孤立向量但状态文件无记录（索引任务曾被中断）—— 对该根执行一次全量重建可修复`)
      } else if (files > 0 && vectors === 0) {
        issues.push(`「${r.root}」状态文件记录 ${files} 个文件但 Qdrant 无向量（集合可能被清过）—— 对该根执行一次索引可修复`)
      }
    }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/client.js:468-474](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/client.js#L468-L474)

当前root任务和进度已可读。

```text
    var serverRoot = info && info.currentRoot ? info.currentRoot : null
    var serverDiff = workspaceCwd && serverRoot && serverRoot !== workspaceCwd
    var onFallback = !!workspaceCwd && wsKnownNonCodebase && !!serverRoot && serverRoot !== workspaceCwd
    var rootState = info && info.roots && root ? info.roots.find(function (r) { return r.root === root }) : null
    var task = rootState ? rootState.task : null
    var running = task && task.status === 'running'
    var pct = task && task.total > 0 ? Math.round((task.done / task.total) * 100) : 0
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 哪些部署值得试用？

**研究主题**：采用判断

#### 完整回答

建议已有本机code-rag/Qdrant/Ollama并能核对根目录的开发者试用；先用小代码库手动索引、取消和恢复，观察诊断与底层状态是否一致。若只是普通文本搜索需求，原生文件搜索和MCP命令可能足够，不宜为面板单独引入整套向量基础设施。setup和全量重建须按有写入及算力副作用的操作使用，不当成无害绿灯按钮。未做本轮真实宿主验收，结论为trial，不能宣称值得持续安装或检索精度提高。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-code-rag-index-panel/README.zh.md:78-96](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/README.zh.md#L78-L96)

作者安装和使用流程。

<details>
<summary>查看原文（19行）</summary>

````text

**推荐**：在 code-rag 仓库根目录运行 `npm run setup`（scripts/setup.mjs）——
它会自动把本插件以 `file:` 依赖写入 web profile（`~/.dsh/profiles/web`）并同步
已安装副本，路径无需手工指定：

```json
"dependencies": { "dsh-code-rag-index-panel": "file:<code-rag 仓库>/plugins/dsh-code-rag-index-panel" },
"dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-code-rag-index-panel"] } }
```

> 若该包已发布到 npm，也可直接 `npm install dsh-code-rag-index-panel`（版本依赖），
> 此时无需本地路径。仓库挪位置后重新运行 `npm run setup` 即可。

改完 profile 配置后重启 DSH 生效（`dsh --profile web`）。之后修改
`lib/client.js` 会被 client-hmr 轮询到并自动热更新（浏览器无需刷新）；
修改 `lib/index.js`（host 半部，如端点/命名空间注册）则需**重启 DSH** 生效。

## 使用

````

</details>

**依据 2 · 源码核查**：[plugins/dsh-code-rag-index-panel/lib/index.js:395-423](https://github.com/Ankali-Aylina/code-rag/blob/5c8ddfbde8a6dd0fff6d1292595064ea647edd83/plugins/dsh-code-rag-index-panel/lib/index.js#L395-L423)

写入与动作的实际影响。

<details>
<summary>查看原文（29行）</summary>

```text
    if (actionName === 'setup') {
      const preset = readPreset()
      const repoDir = preset.mainJs ? dirname(dirname(preset.mainJs)) : null
      const result = await runSetup(repoDir, root ?? preset.root ?? preset.cwd)
      writeJson(res, result.ok ? 200 : 500, { ok: result.ok, output: result.output })
      return
    }
    const panel = readPanel()
    const server = await findServerPort(panel)
    if (!server.status) {
      writeJson(res, 503, { ok: false, error: { code: 'SERVER_DOWN', message: '索引服务器未运行（请先启动 Code RAG 模式会话）' } })
      return
    }
    const base = `http://127.0.0.1:${server.port}`
    let result
    if (actionName === 'cancel') {
      result = await fetchJson(`${base}/api/cancel`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(root ? { root } : {}),
      }, 5000)
    } else {
      result = await fetchJson(`${base}/api/index`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ root: root ?? undefined, full: actionName === 'rebuild' }),
      }, 5000)
    }
    writeJson(res, result ? 200 : 502, result ?? { ok: false, error: { code: 'PROXY_FAILED', message: '索引服务器无响应' } })
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
