# dsh-sidebar-git-graph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4dfefb3](https://github.com/AFunDog/dsh-sidebar-git-graph/tree/4dfefb3cc465be189fa1806f0bc9a33d30006a95)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph)
<!-- END META -->

> **实现功能**：在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。

> **核心亮点**：把Git图谱、工作树与差异接到DSH会话，在手选、标签和历史提示间明确优先级并显示回退原因；贡献属于可解释的接线与信息组织，不是新的Git机制。详见[Q03](#research-q03)。

> **风险与缺陷**：只读不能保证授权隔离或快照一致性。无工作区候选时存在claimed-unfenced退路，图谱与改动独立读取可能跨时点；这些是静态边界，未作越权或竞态复现。详见[Q04](#research-q04)。

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
  - [Q01 · 谁需要会话内图谱，怎样才算读对仓库及改动？](#detail-section-11)
  - [Q02 · 从会话选择到图谱与差异的完整链路是什么？](#detail-section-12)
  - [Q03 · 相比 Git CLI 和外部图形客户端，实际贡献在哪里？](#detail-section-13)
  - [Q04 · 只读及仓库选择能否保证视图可信、安全？](#detail-section-14)
  - [Q05 · 安装、生效和恢复需要什么？](#detail-section-15)
  - [Q06 · 一次正确定位改动的收益和总成本是什么？](#detail-section-16)
  - [Q07 · 哪些工程设计可靠且可复用？](#detail-section-17)
  - [Q08 · 能从视图非原子性推导什么新设计？](#detail-section-18)
  - [Q09 · 哪些人值得试用，什么条件应停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在多工作树会话中确认仓库、分支和改动归属；合格结果需交代选择来源、截断和本地新鲜度。

Git CLI 分别读取log/status/diff或外部图形客户端能完成信息查询；插件增加会话接线，不能替代写入和远端同步。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提交关系图 | 在侧栏看分支、合并与 refs | 本地 Git 历史，默认400条、单次最多2000条 |
| 工作树改动区 | 分开看冲突、未暂存与暂存文件 | 超过3000行改动会截断，计数失败保留未知 |
| 文件差异 | 点击工作区或提交文件查看 patch | 单文件512KiB上限，比较基准取决于区域 |
| 多仓库与 worktree 选择 | 跟随手选、会话标签或提示切换 | 标签和路径会回退，必须核对来源和原因 |
| 双侧栏接入 | 原生 DSH 与 betterSidebar 入口 | 浏览器 web 平台，增强侧栏为可选 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19、DSH >=0.1.7-rc.1 | 包声明必需 | ESM 宿主和插件接口 | 声明不等于已实测所有版本兼容 |
| DSH web 与 webServer | 启动必需 | HTTP API 和浏览器侧栏 | 无 webServer 无法注册宿主路由 |
| PATH 中的 Git 与可读仓库 | 查看任务必需 | log、status、diff、worktree | 返回 no-git／not-a-repo 等错误 |
| betterSidebar | 可选 | 增强侧栏的标签和设置 | 约两秒观察后走原生侧栏接口 |
| sessionWorktree 服务 | 可选 | 按会话标签选择工作树 | 使用手选、提示或工作目录回退 |
| GitHub 固定版本材料 | 作者给出的分发方式 | 获取本插件 | 不能用同名 npm 插件替代 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认 web profile、Git 和仓库路径 | 可读目标仓库，明确安装来源 |
| 加载 | 用户安装固定来源后重启 dsh web 并硬刷新 | 宿主路由和客户端版本一致 |
| 查阅 | 在侧栏选图谱，核对仓库根和选择提示 | 图谱、改动区与实际目标相符 |
| 恢复 | 缺 Git 修 PATH；旧宿主提示先重启；仓库缺失重新选择 | 不把空结果当作无改动 |

持久工作区解析还会退回宿主存储文件，带来对未公开布局的兼容耦合。浏览器侧与宿主侧更新方式不同，硬刷新不能代替宿主重启。禁用时路由和注册通过 ctx.effect 绑定生命周期，源码体现清理意图，但没有借此声称真实卸载已经通过。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地 Node、Git、宿主与浏览器资源；金额未知 | 安装固定来源、重启、刷新、确认目标仓库 | 没有本次安装耗时数据 |
| 持续使用 | 刷新触发多条 Git 读取与目录扫描；实际 CPU/IO 未测 | 解释截断、新鲜度和选择来源，必要时终端复核 | 单条 Git 10 秒超时、48MiB 输出预算不等于整页耗时上限 |
| 失败恢复 | 重读与重新扫描的资源未知 | 修 PATH、缩扫描深度、重选已存在 worktree、重启旧宿主 | 需要判断失败是空结果、旧版本还是范围限制 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内查阅 | 图谱、改动和差异集成 | 定位时间和正确率的净改善 |
| 资源边界 | 有扫描、查询、patch限制和缓存 | 大仓库端到端成本及尾延迟 |

> **思考**：只读不能保证授权隔离或快照一致性。无工作区候选时存在claimed-unfenced退路，图谱与改动独立读取可能跨时点；这些是静态边界，未作越权或竞态复现。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把Git图谱、工作树与差异接到DSH会话，在手选、标签和历史提示间明确优先级并显示回退原因；贡献属于可解释的接线与信息组织，不是新的Git机制。详见[Q03](#research-q03)。

把Git图谱、工作树与差异接到DSH会话，在手选、标签和历史提示间明确优先级并显示回退原因；贡献属于可解释的接线与信息组织，不是新的Git机制。详见[Q03](#research-q03)。

值得复用的是宿主 IO 与纯解析层分离。git-read、changes、commit-files 构造固定 argv 并解析 NUL 分隔记录，宿主集中执行进程、处理超时及响应。changes 统一输出路径安全 flags，commit-files 复用这些属性，降低分叉实现逐渐漂移的可能。迁移时仍要保留 Git 特定的比较语义，例如暂存区相对 HEAD、未暂存相对索引、冲突用普通 unified 格式，以及 no-index 返回码的特殊处理。

另一处值得借鉴的是对“不知道”和“没有”的区分。计数命令失败用 countsAvailable，而不是直接画成零；扫描和 patch 超限分别带标记；选择失败原因进入响应。工作树请求还做 pending 去重，减少同一次刷新重复执行。客户端请求序号抑制晚到响应，但不会提供全链路事务一致性。

维护代价也明确。主 index 负责多种解析与策略编排，client 是较长的手写 bundle，读者需跨多层理解生命周期与状态；工作区 fallback 读取宿主非公开存储布局，版本适配责任仍在插件。测试 runner 自动发现测试文件并先做语法检查，是测试遗漏防线。这里只检查 runner 和部分 route 断言，没有运行测试，也不能由测试存在推断全部行为正确。

<a id="detail-section-5"></a>

### 1.4 主要限制

只读不能保证授权隔离或快照一致性。无工作区候选时存在claimed-unfenced退路，图谱与改动独立读取可能跨时点；这些是静态边界，未作越权或竞态复现。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地单用户开发者可先用小仓库试用并与CLI核对；先审查webServer访问控制，出现静默换库、未说明截断或无法解释的差异即回到CLI。尚不足以推荐持续安装。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献是源码支持的会话集成与选择透明化；效率优势没有同任务对照；读取收据为未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、lib/workspace.js、lib/repos.js、lib/git-read.js、lib/changes.js、lib/commit-files.js、lib/worktrees.js、scripts/test.mjs、test/route.test.cjs、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交源码研究，读取宿主、客户端、Git解析、仓库扫描及部分测试；未覆盖完整宿主认证链，未执行目标代码。
- 下一步：进一步探讨可从两个worktree的并发修改时间线入手，对照CLI核对归属、截断与状态变化提示，再比较人工时间和误判。

**分析版本**

- **仓库**：[AFunDog/dsh-sidebar-git-graph](https://github.com/AFunDog/dsh-sidebar-git-graph)
- **版本号**：0.5.0（[固定提交 4dfefb3](https://github.com/AFunDog/dsh-sidebar-git-graph/tree/4dfefb3cc465be189fa1806f0bc9a33d30006a95)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索共同读取收据与状态变化提示，以显式呈现跨请求不一致；需比较误判、误报和尾延迟，当前未实现，不计为已有创新。详见[Q08](#research-q08)。

进一步探讨可从两个worktree的并发修改时间线入手，对照CLI核对归属、截断与状态变化提示，再比较人工时间和误判。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1002 | — | — | 14207 |
| .js | source | 8 | 5448 | 3463 | 1718 | — |
| .mjs | source | 2 | 170 | 124 | 31 | — |
| .cjs | test | 19 | 5248 | 3821 | 960 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph/issues?q=is%3Aissue+created%3A2026-09-22T04%3A37%3A45.612Z..2026-10-22T04%3A37%3A45.612Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A37%3A45.612Z..2026-10-22T04%3A37%3A45.612Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本会话内只读 Git 图谱的实现贡献、可信边界与采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话内图谱，怎样才算读对仓库及改动？

**研究主题**：场景与需求

#### 完整回答

面向在 DSH web 中持续审阅代码、切换会话和使用多个 Git worktree 的开发者。任务不是执行版本控制，而是确认当前会话实际对应哪个仓库、分支、提交关系以及暂存和未暂存改动。合格结果必须同时交代仓库根、选择来源、工作树和本地数据的新鲜度，不能只画出一张看似完整的图。

原有办法是离开会话，在终端分别执行 git log、status 和 diff，或打开外部 Git 图形客户端。插件把这些读取放到侧栏，减少上下文切换，并提供点击提交查看文件清单和 patch 的入口。它不替代提交审查的业务判断，不执行提交、切分支或远端同步。未提交的大文件、超限历史和远端尚未 fetch 的变化都不能凭侧栏视觉完整性确认。

场景依据来自作者的用途定义和源码中的工作树选择优先级，并非真实用户使用频率调查。对只需要提交、推送或合并操作的人，额外侧栏不能完成目标流程；对频繁多工作树观察任务则存在明确的集成价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-12](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/README.md#L6-L12)

作者定义当前会话内的只读图谱和工作树改动用途。

```text
给 **DSH（DeepSeek Harness）** 加一个右侧栏页面：把当前会话的仓库画成**分支/合并关系图**
（VS Code 风格 —— 彩色泳道、分叉与汇入的贝塞尔曲线、ref 芯片、点开看提交详情），
并在它上方给出**工作树改动区**。

**只读**：不 checkout、不 commit、不 reset、不 rebase、不 fetch/push、不 add、不 restore、
不 `worktree add/remove/prune`。
只跑 `rev-parse`、`status`、`for-each-ref`、`log`、`diff`、`worktree list` 六条命令。
```

**依据 2 · 源码核查**：[lib/index.js:675-717](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L675-L717)

手动选择和会话标签均经仓库根验证，标签选择失败保留原因，支撑正确归属的合格标准。

<details>
<summary>查看原文（43行）</summary>

```text
  if (requested !== null) {
    // 三道闸都过了才认：路径关系合法（或它是本仓库的另一个工作树）、目录存在、
    // 且 git 确认它自己就是仓库根（不是仓库里的子目录）。
    if (repoRelationAllowed(workspaceCwd, requested, worktreePaths) && existsSync(requested)) {
      const check = await repoRootOf(requested)
      const claimed = canonical(requested) ?? requested
      if (check.ok === true && check.root === claimed) {
        root = claimed
        source = 'requested'
      } else reason = 'not-root'
    } else if (!existsSync(requested)) {
      // 目录不在有两种：被删了，或它是个 prunable 的工作树（git 还记着它）。
      reason = worktreesRaw.some((entry) => entry.prunable === true && (canonical(entry.path) ?? entry.path) === (canonical(requested) ?? requested))
        ? 'prunable'
        : 'missing'
    } else reason = 'fenced'
  }

  // 档 2：会话 worktree 标签。用户没在页面上手点（或手点的没认）时才轮到这里。
  //
  // 标签指向的路径**仍要过与 `repo` 同一套闸**——标签是用户设的，但它是**另一个插件**
  // 给的，跨插件的数据一样不可信。过不了就**如实记下原因**（`tagReason`），
  // 由前端说清「标签指的那个用不了，改画了 X」，绝不静默换仓库还不吭声。
  let tagReason = null
  let tagRequested = null
  if (root === null && tagged !== null) {
    tagRequested = tagged.path
    if (!existsSync(tagged.path)) {
      tagReason = 'missing'
    } else if (!repoRelationAllowed(workspaceCwd, tagged.path, worktreePaths)) {
      tagReason = 'fenced'
    } else {
      const check = await repoRootOf(tagged.path)
      const claimed = canonical(tagged.path) ?? tagged.path
      if (check.ok === true && check.root === claimed) {
        root = claimed
        source = 'session-worktree'
      } else tagReason = 'not-root'
    }
  }

  // 档 3：客户端上次记住的仓库（提示，不是点名）。
  if (root === null && hintRaw !== null) {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从会话选择到图谱与差异的完整链路是什么？

**研究主题**：功能与机制

#### 完整回答

浏览器侧 GraphView 读取 sessionId、cwd、插件设置和本地记住的仓库提示，随后并发请求 graph 与 changes。宿主只挂一个 POST 路由，通过 method 将图谱、工作树改动、单文件差异、提交文件清单和提交差异分派给对应处理器；未知 method 返回错误，避免把不支持的能力误当成功。

仓库解析先选择工作目录，再由 Git 验证仓库根、查询关联工作树并扫描嵌套仓库。显式选择优先，其次为会话 worktree 标签、历史提示、当前目录所属仓库和扫描结果。graph 并行读取 status、refs 和 log，纯函数解析后装配 selection、工作树、截断和新鲜度信息。changes 独立读取 porcelain v2 状态和两组 numstat，映射冲突、未暂存、暂存三区。

单文件 diff 会先验证相对路径，再根据暂存、未暂存、冲突和未跟踪状态选择不同 argv。未跟踪 diff 使用 no-index，退出码 1 在有差异时按正常结果处理。客户端按需取得提交清单和 patch，并用请求序号丢弃旧响应。这里的并发缩短等待链，但图谱和改动并非同一时点的原子快照；请求序号只能防止旧网络响应覆盖新请求，不能冻结仓库。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1429-1452](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/client.js#L1429-L1452)

同一刷新并行请求 graph 与 changes，序号仅丢弃过期刷新。

<details>
<summary>查看原文（24行）</summary>

```text

      const load = useCallback(async () => {
        const seq = requestSeq.current + 1
        requestSeq.current = seq
        setState((previous) => (previous.status === 'ready' ? { ...previous, refreshing: true } : { status: 'loading' }))
        setChangesState((previous) => (previous.status === 'ready' ? { ...previous, refreshing: true } : { status: 'loading' }))
        // 两个请求并发：图谱与改动互不依赖，串起来只会让页面慢一倍。
        const [graphOutcome, changesOutcome] = await Promise.all([
          requestGraph({ sessionId, cwd, repo: repoChoice, repoHint, scanDepth, max: maxCommits, skip: 0, scope }),
          requestChanges({ sessionId, cwd, repo: repoChoice, repoHint, scanDepth }),
        ])
        if (requestSeq.current !== seq) return
        if (graphOutcome.ok) setState({ status: 'ready', value: graphOutcome.value, refreshing: false })
        else setState({ status: 'error', error: graphOutcome.error })
        // 形状校验见 looksLikeChanges 的注释：旧版宿主会把 `changes` 当 `graph` 回，
        // 不校验就会把「一个改动都没问过」显示成「没有未提交的改动」。
        if (changesOutcome.ok && looksLikeChanges(changesOutcome.value)) {
          setChangesState({ status: 'ready', value: changesOutcome.value, refreshing: false })
        } else if (changesOutcome.ok) {
          setChangesState({ status: 'error', error: { code: 'stale-host', message: STALE_HOST_COPY } })
        } else {
          setChangesState({ status: 'error', error: changesOutcome.error })
        }
      }, [sessionId, cwd, repoChoice, scanDepth, maxCommits, scope])
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1188-1219](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L1188-L1219)

唯一 POST 路由及五种方法的静态分派。

<details>
<summary>查看原文（32行）</summary>

```text
async function handleRoute(ctx, req, res) {
  let rpcId = 'unknown'
  try {
    if (req.method !== 'POST') {
      sendJson(res, 405, { type: 'server-response', rpcId, result: { ok: false, error: { code: 'method', message: 'POST only' } } })
      return
    }
    if (!isTrustedRequest(req)) {
      sendJson(res, 403, { type: 'server-response', rpcId, result: { ok: false, error: { code: 'forbidden', message: 'cross-origin request refused' } } })
      return
    }
    const raw = await readBody(req)
    let payload = {}
    // 客户端一直在信封里发 `method`，宿主侧此前忽略它（只服务 graph）。现在接上：
    // 未知 method 明确回错，而不是当成 graph 静默跑一遍 log（那会让人以为"改了没生效"）。
    let method = 'graph'
    try {
      const body = raw !== '' ? JSON.parse(raw) : {}
      if (body !== null && typeof body === 'object') {
        if (typeof body.rpcId === 'string') rpcId = body.rpcId
        if (typeof body.method === 'string' && body.method !== '') method = body.method
        if (body.payload !== null && typeof body.payload === 'object') payload = body.payload
      }
    } catch (error) { /* 解析失败也照常回包 */ }

    let outcome
    if (method === 'graph') outcome = await handleGraph(ctx, payload)
    else if (method === 'changes') outcome = await handleChanges(ctx, payload)
    else if (method === 'diff') outcome = await handleDiff(ctx, payload)
    else if (method === 'commit') outcome = await handleCommit(ctx, payload)
    else if (method === 'commitDiff') outcome = await handleCommitDiff(ctx, payload)
    else outcome = fail('bad-method', `未知的 method：${method}`)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:981-1027](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L981-L1027)

路径验证、不同 diff 模式和 no-index 退出码处理。

<details>
<summary>查看原文（47行）</summary>

```text
async function handleDiff(ctx, payload) {
  const rawPath = typeof payload.path === 'string' ? payload.path : ''
  // 路径围栏在**跑 git 之前**：非法路径连仓库都不用解析，直接回。
  if (!isRepoRelativePath(rawPath)) {
    return fail('bad-path', '路径不合法（只接受仓库根相对路径）')
  }
  const rawOrig = typeof payload.origPath === 'string' && payload.origPath !== '' ? payload.origPath : ''
  if (rawOrig !== '' && !isRepoRelativePath(rawOrig)) {
    return fail('bad-path', '原路径不合法（只接受仓库根相对路径）')
  }

  const resolved = await resolveRepo(ctx, payload)
  if (resolved.ok === false) return { ok: false, error: resolved.error }
  const { root } = resolved

  const section = payload.section === 'staged' ? 'staged' : 'unstaged'
  const untracked = payload.untracked === true
  const unmerged = payload.unmerged === true
  // 未跟踪文件只可能出现在「更改」段；反过来说「暂存的未跟踪文件」是自相矛盾的请求。
  if (untracked && section === 'staged') {
    return fail('bad-request', '未跟踪的文件不会有暂存改动')
  }
  if (untracked && unmerged) {
    return fail('bad-request', '未跟踪与未合并不可能同时成立')
  }
  const base = { path: rawPath, section, origPath: rawOrig === '' ? undefined : rawOrig }

  const result = await runGit(diffArgv(root, {
    section,
    path: rawPath,
    origPath: rawOrig,
    untracked,
    unmerged,
  }), { cwd: root })

  // `--no-index` 在「有差异」时返回 1 且 stdout 是完整 patch、stderr 为空。
  // 不特判的表现是「未跟踪文件永远打不开 diff」，而且没有任何错误信息可查（实测）。
  const noIndexDiff = untracked && result.ok === false && result.code === '1'
  if (!result.ok && !noIndexDiff) {
    return fail('git-failed', 'git diff 失败', { detail: stderrTail(result) })
  }

  return patchValue(result, base)
}

/**
 * patch 文本 → 客户端载荷。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比 Git CLI 和外部图形客户端，实际贡献在哪里？

**研究主题**：贡献与相对优势

#### 完整回答

源码支持的贡献是把成熟 Git 读取和图形展示接到会话身份、worktree 标签与 DSH 侧栏，而不是发明新的 Git 存储或提交图语义。最具体的增量是选择优先级。用户本次手动点名可以覆盖标签，历史 localStorage 选择降为 repoHint，避免旧记忆永远压住会话标签。标签过期时返回原因，不无声改画另一个仓库。

另一项集成贡献是双侧栏路径。浏览器先等待 betterSidebar 服务，短观察窗后使用原生 sidebarRightTabs 和 slot 接口。这样可选侧栏增强不是强制安装依赖。单文件 bundle 没有额外构建层，移植者可以直接定位实际部署代码，不过这也增加大型文件阅读负担。

参照 Git CLI，增量主要在信息组织和会话接线，读取能力由 Git 提供；参照外部图形客户端，优势假设是减少会话切换，并非已经证实的图形能力领先。没有同任务收益对照，不能由界面更集中推出审查更准确。最值得借鉴的是把选择来源与回退原因作为数据契约，而非隐藏在 UI 默认行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1397-1407](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/client.js#L1397-L1407)

将已记住仓库降为提示，明确手选、标签和提示的区别。

<details>
<summary>查看原文（11行）</summary>

```text
      // 再看 cwd 所在仓库）。只有**真的在下拉里点过**才会被设上 —— 见 rememberRepoChoice
      // 与 savedRepoHint 的区别。
      const [repoChoice, setRepoChoice] = useState(undefined)
      // localStorage 里**上次记住**的仓库：降级成**提示**发给宿主，不再当点名。
      //
      // ⚠️ 这个降级是「图谱跟随会话 worktree」联动的**关键**（2026-10-01）：
      // 此前它是以 `repo` **点名**发出去的，于是一旦用户点过一次下拉，那个记忆就
      // **永远压过会话标签**，标签永远轮不到。降级成 `repoHint` 之后优先级变成
      // 「手点 > 会话标签 > 上次记住 > cwd 所在仓库」，与用户直觉一致。
      const [repoHint, setRepoHint] = useState(() => readSavedRepo(cwd))
      // 段的折叠状态（照 VS Code 两段式）。持久化到 localStorage。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:831-848](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L831-L848)

响应显式保存选择来源、标签失败原因与回退。

<details>
<summary>查看原文（18行）</summary>

```text
    source,
    // 点名了但没认（仓库被删了 / 换机器了 / 路径出围栏了 / 它是个 prunable 工作树）→
    // 前端按 `reason` 说准确的话，别一律讲成"仓库不在了"。
    fallback: requested !== null && source !== 'requested',
    reason: requested !== null && source !== 'requested' ? reason : null,
    // ── 会话 worktree 联动（2026-10-01）────────────────────────────────────
    // `source === 'session-worktree'` 表示这次是**跟着会话标签**画的。
    // `tagged` 是标签指向的路径（没有标签时为 null）；
    // `tagReason` 是「有标签但用不了」的原因，前端要说出来而不是默默换一个。
    tagged: tagRequested,
    tagReason,
    tagApplied: source === 'session-worktree',
  }
  // 载荷形状版本：客户端据此判断宿主半是不是旧版（PIT-060：宿主半改动要重启，
  // 浏览器半刷新即换，前后端版本错位是常态；旧宿主会**忽略**新字段却回 ok:true）。
  // 4 = 增加 `workspace.stale`（原来挑中的工作目录已被删、这次换了一个画）。
  value.schema = 4
  value.worktrees = summarizeWorktrees(worktreesRaw, worktrees)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2273-2305](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/client.js#L2273-L2305)

betterSidebar 观察窗、原生注册回退与单次 claim。

<details>
<summary>查看原文（33行）</summary>

```text
    function apply(ctx) {
      let claimed = false
      const claim = () => {
        if (claimed) return false
        claimed = true
        return true
      }

      // 回退观察窗：better-sidebar 若在场，它 provide 在 apply 开头，通常同一次 tick 就能看到；
      // 2s 内没等到就用原生注册（此后即使它再出现也不重复注册）。
      let attempts = 0
      const timer = setInterval(() => {
        attempts += 1
        if (claimed) { clearInterval(timer); return }
        if (ctx.get('betterSidebar') !== undefined) { clearInterval(timer); return }
        if (attempts >= 40) {
          clearInterval(timer)
          if (claim() && registerNative(ctx)) log(ctx, 'info', 'dsh-sidebar-git-graph: registered the native sidebar tab (dsh-better-sidebar absent)')
        }
      }, 50)
      ctx.effect(() => () => clearInterval(timer), 'dsh-sidebar-git-graph: fallback timer')

      ctx.inject(['betterSidebar'], (scoped) => {
        clearInterval(timer)
        if (!claim()) return
        const service = scoped.get('betterSidebar')
        if (service === undefined || service === null || typeof service.registerTab !== 'function') {
          if (registerNative(ctx)) log(ctx, 'info', 'dsh-sidebar-git-graph: registered the native sidebar tab (service shape unexpected)')
          return
        }
        scoped.effect(() => service.registerTab(betterSidebarTab(service)), 'dsh-sidebar-git-graph: better-sidebar tab')
        log(ctx, 'info', 'dsh-sidebar-git-graph: registered the sidebar tab through dsh-better-sidebar')
      })
```

</details>

#### 缺口

- 没有同任务 Git CLI／外部图形客户端的判断正确率和切换时间对照。
  **影响**：只能确认实现上的集成增量，不能确认用户效率优势。
  **进一步探讨**：可从包含两个 worktree、过期标签与远端陈旧状态的盲任务对照入手，同时记录定位正确率和人工时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 只读及仓库选择能否保证视图可信、安全？

**研究主题**：缺陷与关键质疑

#### 完整回答

只读 argv、固定方法分派、相对路径验证和禁止外部 diff/textconv 为降低副作用提供了实际支持，但不能把“只读”理解为授权隔离或同一时点准确性。尤其要区分有工作区候选时的围栏和无候选的退路。chooseCandidate 在 candidates 为空且客户端 cwd 存在时直接接纳 claimed-unfenced；因此“所有请求只可读取已登记工作区”不是无条件成立的保证。测试源码也显式期待这一退路，说明它是设计行为而非本次复现出的异常。

请求围栏接受 same-origin、same-site 或 none；没有相关头时也允许请求。它提供部分浏览器来源检查，不是账户认证，不能单凭这段代码推断公网或多用户部署已安全。暴露范围和上层 webServer 鉴权要独立核查，本次未核查完整宿主部署链。

视图方面，多个 Git 命令并行读取。并发修改时状态、refs、log、计数和后来点击的 patch 可能分别对应不同瞬间。refs 或图谱 status 失败时还会退为空 refs 或默认状态，图形成功不代表所有辅助读取成功。查询上限及远端新鲜度信息能提醒一部分不完整性，却不把历史窗口转成全量仓库证明。以上是静态可见边界，未进行攻击或竞态复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:274-299](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L274-L299)

无宿主候选时允许 claimed-unfenced，反证绝对工作区白名单承诺。

<details>
<summary>查看原文（26行）</summary>

```text
function chooseCandidate(ctx, dshHome, payload) {
  const sessionId = typeof payload.sessionId === 'string' && payload.sessionId !== '' ? payload.sessionId : undefined
  const candidates = resolutionCandidates(ctx, dshHome, sessionId)
  const allowed = new Set()
  for (const candidate of candidates) {
    const key = canonical(candidate.path)
    if (key !== null) allowed.add(key)
  }
  const claimed = typeof payload.cwd === 'string' && payload.cwd !== '' ? payload.cwd : undefined
  // 存在性只查一次：既用来决定要不要采纳，也用来决定要不要记进 skippedClaim。
  const claimedAlive = claimed !== undefined && existsSync(claimed)
  if (claimedAlive) {
    const key = canonical(claimed)
    if (key !== null && (allowed.has(key) || isBackedByWorkspace(ctx, dshHome, claimed))) {
      return { cwd: claimed, source: 'claimed' }
    }
    // 没有任何宿主候选时（本机没登记工作区）给客户端路径一个机会：能 rev-parse 出来就用。
    if (candidates.length === 0) return { cwd: claimed, source: 'claimed-unfenced' }
  }
  if (candidates.length === 0) {
    // 一个宿主候选都没有、客户端给的路径又不存在：照旧把它带下去，让 resolveRepo 报出
    // **具体是哪个目录没了**。"拿不到工作目录：会话没有记录 cwd，也没有已注册的工作区"
    // 会把诊断带偏——那是另一回事（本机没登记过任何工作区）。
    if (claimed !== undefined) return { cwd: claimed, source: 'claimed-unfenced' }
    return null
  }
```

</details>

**依据 2 · 源码核查**：[lib/workspace.js:209-231](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/workspace.js#L209-L231)

来源检查允许 same-site 和无头请求，不包含用户身份鉴权。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * 浏览器同源信任围栏。
 *
 * 带 `sec-fetch-site` 的现代浏览器是主判据；缺它时退回 `Origin` 与 `Host` 比对。
 * 两个头都没有的请求（curl / 脚本）放行——真正的边界是「只能查已注册工作区」，
 * 而不是「只有浏览器能问」（见 index.js 的 chooseCandidate）。
 * @param req - node http 请求。
 * @returns 是否可信。
 */
export function isTrustedRequest(req) {
  const headers = req !== null && req !== undefined && req.headers !== undefined ? req.headers : {}
  const site = headers['sec-fetch-site']
  if (typeof site === 'string' && site !== '') {
    return site === 'same-origin' || site === 'same-site' || site === 'none'
  }
  const origin = headers.origin
  if (typeof origin === 'string' && origin !== '') {
    try {
      return new URL(origin).host === headers.host
    } catch (error) { return false }
  }
  return true
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:793-809](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L793-L809)

status、refs、log 并发读取且辅助失败有默认值。

<details>
<summary>查看原文（17行）</summary>

```text
  const [statusResult, refsResult, logResult] = await Promise.all([
    runGit(statusArgv(root), { cwd: root }),
    runGit(refsArgv(root), { cwd: root }),
    runGit(logArgv(root, { max, skip, scope }), { cwd: root }),
  ])
  if (!logResult.ok) {
    return fail('git-failed', 'git log 失败', { detail: stderrTail(logResult) })
  }

  const commits = parseLog(logResult.stdout)
  const refs = refsResult.ok ? parseRefs(refsResult.stdout) : []
  const status = statusResult.ok
    ? parseStatus(statusResult.stdout)
    : { branch: null, upstream: null, ahead: 0, behind: 0, dirty: 0, detached: false, initial: false }

  const value = buildSnapshot({
    root,
```

</details>

**依据 4 · 源码核查**：[test/route.test.cjs:153-165](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/test/route.test.cjs#L153-L165)

测试明确预期无工作区表时采用 claimed-unfenced；这里只阅读测试，没有执行。

<details>
<summary>查看原文（13行）</summary>

```text
  assert.ok(refNames.includes('branch:main'), `refs 缺 main：${refNames.join(',')}`)
  assert.ok(refNames.includes('branch:feature/pet'), `refs 缺 feature/pet：${refNames.join(',')}`)
  assert.ok(refNames.includes('tag:v-test'), `refs 缺标签：${refNames.join(',')}`)
  assert.ok(!refNames.some((entry) => entry.endsWith('/HEAD')), 'origin/HEAD 不该出现')
  assert.strictEqual(value.refs.find((ref) => ref.name === 'main').isCurrent, true)
  assert.strictEqual(value.truncated, false)
  assert.strictEqual(value.workspace.source, 'claimed-unfenced', '本机没有工作区表时应走无围栏兜底')

  // 只取 1 条 → 必须报截断。
  const limited = await handleGraph(ctx, { cwd: repo, max: 1 })
  assert.strictEqual(limited.ok, true)
  assert.strictEqual(limited.value.commits.length, 1)
  assert.strictEqual(limited.value.truncated, true)
```

</details>

#### 缺口

- 未独立核查部署中的宿主认证、监听范围和反向代理访问控制。
  **影响**：不能支持多人或公网环境中的读取保密性结论。
  **进一步探讨**：继续讨论可从实际部署的 webServer 鉴权链与匿名请求路径入手，核对工作区无候选时的读取权限。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、生效和恢复需要什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19、DSH >=0.1.7-rc.1 | 包声明必需 | ESM 宿主和插件接口 | 声明不等于已实测所有版本兼容 |
| DSH web 与 webServer | 启动必需 | HTTP API 和浏览器侧栏 | 无 webServer 无法注册宿主路由 |
| PATH 中的 Git 与可读仓库 | 查看任务必需 | log、status、diff、worktree | 返回 no-git／not-a-repo 等错误 |
| betterSidebar | 可选 | 增强侧栏的标签和设置 | 约两秒观察后走原生侧栏接口 |
| sessionWorktree 服务 | 可选 | 按会话标签选择工作树 | 使用手选、提示或工作目录回退 |
| GitHub 固定版本材料 | 作者给出的分发方式 | 获取本插件 | 不能用同名 npm 插件替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认 web profile、Git 和仓库路径 | 可读目标仓库，明确安装来源 |
| 加载 | 用户安装固定来源后重启 dsh web 并硬刷新 | 宿主路由和客户端版本一致 |
| 查阅 | 在侧栏选图谱，核对仓库根和选择提示 | 图谱、改动区与实际目标相符 |
| 恢复 | 缺 Git 修 PATH；旧宿主提示先重启；仓库缺失重新选择 | 不把空结果当作无改动 |

持久工作区解析还会退回宿主存储文件，带来对未公开布局的兼容耦合。浏览器侧与宿主侧更新方式不同，硬刷新不能代替宿主重启。禁用时路由和注册通过 ctx.effect 绑定生命周期，源码体现清理意图，但没有借此声称真实卸载已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:48-66](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/package.json#L48-L66)

声明 Node、DSH peer 和 web client 平台要求。

<details>
<summary>查看原文（19行）</summary>

```text
  ],
  "engines": {
    "node": ">=22.19"
  },
  "scripts": {
    "test": "node scripts/test.mjs"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.1.7-rc.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "host": {
      "platform": "any"
    },
    "client": {
      "platform": "web"
```

</details>

**依据 2 · 作者声明**：[README.md:62-92](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/README.md#L62-L92)

作者给出 GitHub 安装、重启、刷新及可选侧栏路径。

<details>
<summary>查看原文（31行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add github:AFunDog/dsh-sidebar-git-graph
```

装完**重启 `dsh web`**（宿主半要挂路由），再硬刷新浏览器。打开右侧栏选「Git 图谱」——
装了 dsh-better-sidebar 时它在 `+` 菜单里；裸 DSH 下就在侧栏的**引导页**上（该格已经放着引导页时
`+` 控件不会绘制）。
页面跟随你**正在看的会话**：切会话就重新读那个会话的工作区。

<details>
<summary>钉版本 / 从本地克隆安装</summary>

```sh
# 钉 tag（推荐：lockfile 会记下解析到的 commit）
dsh plugin --profile web add github:AFunDog/dsh-sidebar-git-graph#v0.2.0

# 从本地克隆（只接受**绝对**路径 —— 相对路径会被 spec 解析器拒绝）
dsh plugin --profile web add /path/to/dsh-sidebar-git-graph
```
</details>

### 装没装 dsh-better-sidebar 都能用

页面会自动二选一：

| 你的环境 | 行为 |
|---|---|
| 装了 [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) | 走它的公开扩展点 `ctx.betterSidebar.registerTab`：出现在 `+` 菜单，并在**设置 → 侧边卡片**里得到一张卡片（开关 + 一个"每次加载条数"的插件设置），名字是「Git 图谱」。 |
| 裸 DSH | 走 DSH 原生的侧栏 tab 类型（`ctx.sidebarRightTabs` + `sidebar.right.pane.tab` 槽）：同一列、同一个 `+` 菜单，只是没有那张设置卡片。 |
````

</details>

**依据 3 · 源码核查**：[lib/client.js:2273-2305](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/client.js#L2273-L2305)

可选服务观察窗和生命周期清理。

<details>
<summary>查看原文（33行）</summary>

```text
    function apply(ctx) {
      let claimed = false
      const claim = () => {
        if (claimed) return false
        claimed = true
        return true
      }

      // 回退观察窗：better-sidebar 若在场，它 provide 在 apply 开头，通常同一次 tick 就能看到；
      // 2s 内没等到就用原生注册（此后即使它再出现也不重复注册）。
      let attempts = 0
      const timer = setInterval(() => {
        attempts += 1
        if (claimed) { clearInterval(timer); return }
        if (ctx.get('betterSidebar') !== undefined) { clearInterval(timer); return }
        if (attempts >= 40) {
          clearInterval(timer)
          if (claim() && registerNative(ctx)) log(ctx, 'info', 'dsh-sidebar-git-graph: registered the native sidebar tab (dsh-better-sidebar absent)')
        }
      }, 50)
      ctx.effect(() => () => clearInterval(timer), 'dsh-sidebar-git-graph: fallback timer')

      ctx.inject(['betterSidebar'], (scoped) => {
        clearInterval(timer)
        if (!claim()) return
        const service = scoped.get('betterSidebar')
        if (service === undefined || service === null || typeof service.registerTab !== 'function') {
          if (registerNative(ctx)) log(ctx, 'info', 'dsh-sidebar-git-graph: registered the native sidebar tab (service shape unexpected)')
          return
        }
        scoped.effect(() => service.registerTab(betterSidebarTab(service)), 'dsh-sidebar-git-graph: better-sidebar tab')
        log(ctx, 'info', 'dsh-sidebar-git-graph: registered the sidebar tab through dsh-better-sidebar')
      })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1257-1278](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L1257-L1278)

宿主路由经 effect 注册。

<details>
<summary>查看原文（22行）</summary>

```text
  fetchFreshness,
  upstreamRefFile,
  upstreamOfBranch,
}

export function apply(ctx) {
  const webServer = ctx.get('webServer')
  if (webServer === undefined || webServer === null || typeof webServer.register !== 'function') {
    ctx.logger.warn('dsh-sidebar-git-graph: webServer unavailable, /dsh-sidebar-git-graph/api not served')
    return
  }
  const route = {
    kind: 'prefix',
    path: ROUTE,
    handler: (req, res) => {
      // handler 里任何抛出都会变成宿主侧未处理错误：在这里兜住，绝不让它冒出去。
      handleRoute(ctx, req, res).catch((error) => {
        ctx.logger.warn(`dsh-sidebar-git-graph: request failed: ${String(error)}`)
      })
    },
  }
  ctx.effect(() => webServer.register(route), 'dsh-sidebar-git-graph: /dsh-sidebar-git-graph/api route')
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一次正确定位改动的收益和总成本是什么？

**研究主题**：效果与总成本

#### 完整回答

合格任务定义为对指定会话准确给出仓库、分支、工作树，以及某个暂存或未暂存文件的正确差异；仅成功显示页面不算合格。源码展示出按需读 patch、限制历史条数和缓存工作树清单等资源控制，但没有任务级耗时、错误率和机器资源测量。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地 Node、Git、宿主与浏览器资源；金额未知 | 安装固定来源、重启、刷新、确认目标仓库 | 没有本次安装耗时数据 |
| 持续使用 | 刷新触发多条 Git 读取与目录扫描；实际 CPU/IO 未测 | 解释截断、新鲜度和选择来源，必要时终端复核 | 单条 Git 10 秒超时、48MiB 输出预算不等于整页耗时上限 |
| 失败恢复 | 重读与重新扫描的资源未知 | 修 PATH、缩扫描深度、重选已存在 worktree、重启旧宿主 | 需要判断失败是空结果、旧版本还是范围限制 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中查阅 | 图谱与改动在会话侧栏合并呈现 | 实际节省的切换时间 |
| 扫盘负担控制 | 深度、目录数、仓库数、时间预算与截断状态 | 大目录里每批探测造成的最坏尾延迟 |
| 重复请求控制 | worktree 查询有 pending 去重及缓存 | 不同任务负载下命中率和总体资源收益 |

扫描的时间预算在循环边界检查，不是强制中止每次文件系统操作。每次 refresh 并发 graph 和 changes，在慢盘或持续修改仓库中，省下界面切换的收益可能被等待和复核抵消。没有合格交付数和实付资源成本，不能计算单位任务成本或 ROI。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:86-93](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L86-L93)

单查询预算和请求体限制，不能等同整任务成本。

```text
/** 单次请求默认/最大提交条数。 */
const DEFAULT_MAX = 400
const HARD_MAX = 2000
/** 单条 git 命令的预算。 */
const TIMEOUT_MS = 10000
const MAX_BUFFER = 48 * 1024 * 1024
/** 请求体上限（只含 sessionId/cwd/几个数字）。 */
const MAX_BODY = 64 * 1024
```

**依据 2 · 源码核查**：[lib/index.js:318-365](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L318-L365)

扫描缓存及 worktree pending 去重。

<details>
<summary>查看原文（48行）</summary>

```text
async function scanWorkspace(workspaceCwd, maxDepth) {
  const key = `${workspaceCwd}\u0000${maxDepth}`
  const now = Date.now()
  const cached = scanCache.get(key)
  if (cached !== undefined && now - cached.at < SCAN_TTL_MS) return cached.value
  const value = await discoverRepos(workspaceCwd, { maxDepth })
  if (scanCache.size > 64) scanCache.clear()
  scanCache.set(key, { at: now, value })
  return value
}

/**
 * 一个仓库的工作树清单（带缓存 + 并发去重）。
 *
 * 为什么要有它：**关联工作树在目录上可以与主工作区毫无关系**（实测是两个兄弟目录），
 * 所以按文件系统扫盘永远发现不了它们；而 `git worktree list` 是 git 自己给的权威清单。
 * 详见 lib/worktrees.js 的文件头。
 *
 * 缓存与去重都是必要的：页面一次刷新会并发发 `graph` 与 `changes` 两个请求，
 * 没有 in-flight 去重就会同时起两条一模一样的 git 进程。
 * @param root - 仓库根（任意一个工作树的根都行，git 会给出全集）。
 * @returns 工作树数组（**未**过滤 prunable，调用方按需过 listableWorktrees）。
 */
const worktreeCache = new Map()
async function listWorktrees(root) {
  const key = canonical(root) ?? root
  const now = Date.now()
  const cached = worktreeCache.get(key)
  if (cached !== undefined) {
    if (cached.pending !== undefined) return cached.pending
    if (now - cached.at < SCAN_TTL_MS) return cached.value
  }
  const pending = (async () => {
    const result = await runGit(worktreeListArgv(root), { cwd: root })
    // 命令失败一律当作「没有工作树」——那正是旧行为，不该让工作树这一个加分项
    // 把整个页面变成错误页（老 git 没有 --porcelain 时就是这个样子）。
    if (!result.ok) return []
    return parseWorktrees(result.stdout)
  })()
  if (worktreeCache.size > 64) worktreeCache.clear()
  worktreeCache.set(key, { at: now, pending })
  const value = await pending
  worktreeCache.set(key, { at: Date.now(), value })
  return value
}


/**
```

</details>

**依据 3 · 源码核查**：[lib/repos.js:96-153](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/repos.js#L96-L153)

循环式扫描预算和批量目录读取。

<details>
<summary>查看原文（58行）</summary>

```text
export async function discoverRepos(rootDir, options) {
  const settings = options === undefined || options === null ? {} : options
  const requested = Number.isFinite(settings.maxDepth) ? Math.trunc(settings.maxDepth) : DEFAULT_DEPTH
  const maxDepth = Math.min(MAX_DEPTH, Math.max(0, requested))
  const started = Date.now()
  const found = []
  const truncated = { repos: false, dirs: false, time: false }
  let dirsVisited = 0

  if (maxDepth === 0) {
    // 关掉扫描：只认工作区根自己（父级仓库由 index.js 用 rev-parse 单独补）。
    if (await hasGitEntry(rootDir)) found.push({ dir: rootDir, depth: 0 })
    return finish(found, rootDir, truncated, { dirs: 0, ms: Date.now() - started })
  }

  let queue = [{ dir: rootDir, depth: 0 }]
  // 所有 push 都走它：批次是按目录并发处理的，一个批次里可能一次冒出好几个仓库，
  // 只在循环顶端查上限会冲过头（实测：130 个仓库的目录一趟冲到 128 条）。
  const add = (dir, depth) => {
    if (found.length >= MAX_REPOS) { truncated.repos = true; return false }
    found.push({ dir, depth })
    return true
  }

  while (queue.length > 0) {
    if (found.length >= MAX_REPOS) { truncated.repos = true; break }
    if (dirsVisited >= MAX_DIRS) { truncated.dirs = true; break }
    if (Date.now() - started > TIME_BUDGET_MS) { truncated.time = true; break }

    const batch = queue.splice(0, CONCURRENCY)
    const read = await Promise.all(batch.map((item) => readEntries(item.dir)))
    const probes = []

    for (let index = 0; index < batch.length; index += 1) {
      const item = batch[index]
      const entries = read[index]
      dirsVisited += 1
      if (entries === null) continue
      let isRepo = false
      for (const entry of entries) {
        if (entry.name === '.git') { isRepo = true; continue }
        // 链接的 isDirectory() 为 false，天然被挡在外面（见文件头第 4 条）。
        if (!entry.isDirectory()) continue
        const child = join(item.dir, entry.name)
        if (SKIP_DIRS.has(entry.name)) { probes.push(child); continue }
        if (item.depth < maxDepth) queue.push({ dir: child, depth: item.depth + 1 })
      }
      if (isRepo && !add(item.dir, item.depth)) break
    }

    // 被跳过的目录只做一次 stat：命中就说明它自己是个仓库，照样列出来。
    if (probes.length > 0) {
      const hits = await Promise.all(probes.map((dir) => hasGitEntry(dir)))
      for (let index = 0; index < probes.length; index += 1) {
        if (hits[index] && !add(probes[index], -1)) break
      }
    }
  }
```

</details>

#### 缺口

- 没有按仓库规模、文件数量和存储介质分层的端到端成本与任务正确率数据。
  **影响**：无法证明集中侧栏降低总任务成本，也不能估计大仓库使用阈值。
  **进一步探讨**：可从同一批定位任务的 CLI 对照和分层仓库样本入手，分别记录资源、人工复核和失败恢复。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些工程设计可靠且可复用？

**研究主题**：工程质量与复用

#### 完整回答

值得复用的是宿主 IO 与纯解析层分离。git-read、changes、commit-files 构造固定 argv 并解析 NUL 分隔记录，宿主集中执行进程、处理超时及响应。changes 统一输出路径安全 flags，commit-files 复用这些属性，降低分叉实现逐渐漂移的可能。迁移时仍要保留 Git 特定的比较语义，例如暂存区相对 HEAD、未暂存相对索引、冲突用普通 unified 格式，以及 no-index 返回码的特殊处理。

另一处值得借鉴的是对“不知道”和“没有”的区分。计数命令失败用 countsAvailable，而不是直接画成零；扫描和 patch 超限分别带标记；选择失败原因进入响应。工作树请求还做 pending 去重，减少同一次刷新重复执行。客户端请求序号抑制晚到响应，但不会提供全链路事务一致性。

维护代价也明确。主 index 负责多种解析与策略编排，client 是较长的手写 bundle，读者需跨多层理解生命周期与状态；工作区 fallback 读取宿主非公开存储布局，版本适配责任仍在插件。测试 runner 自动发现测试文件并先做语法检查，是测试遗漏防线。这里只检查 runner 和部分 route 断言，没有运行测试，也不能由测试存在推断全部行为正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/changes.js:27-48](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/changes.js#L27-L48)

集中定义 literal pathspec 与禁止外部 diff/textconv 的公共 flags。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * 只读命令共用的顶层选项。
 *
 * `--literal-pathspecs` 是关键的一条：关掉 pathspec 的魔法语法，`:(glob)`、`:(exclude)`、
 * 前导 `:` 之类一律按字面路径处理。没有它，客户端传来的 `path` 就能变成一条 pathspec 表达式
 * （例如 `:(top)*`），把「只读一个文件」放大成「读整个仓库」。
 *
 * ⚠️ **导出它是给 commit-files.js 用的，不要复制一份**：这两条是安全属性（关掉 pathspec 魔法、
 * 关掉 textconv），复制出去迟早有一份被改、另一份没跟上，而这种漂移不报错。
 */
export const SAFE_FLAGS = [
  '-c', 'core.quotepath=false',
  '-c', 'i18n.logOutputEncoding=UTF-8',
  '--no-optional-locks',
  '--literal-pathspecs',
]

/**
 * patch 相关的稳定选项：不要颜色、不要外部 diff、不要 textconv（否则会执行仓库配置里的命令）。
 * 同样**导出给 commit-files.js 复用**，理由同上。
 */
export const PATCH_FLAGS = ['--no-color', '--no-ext-diff', '--no-textconv', '--unified=3']
```

</details>

**依据 2 · 源码核查**：[lib/index.js:950-966](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L950-L966)

countsAvailable 显式保留未知计数，避免错误零值。

<details>
<summary>查看原文（17行）</summary>

```text
        staged: summarizeRows(sections.staged),
      },
      truncated: parsed.truncated,
      // 计数命令失败时不是「没有改动」，而是「不知道」——如实带出去，页面才好说话。
      countsAvailable: stagedCounts.ok && unstagedCounts.ok,
      // `stale` 同图谱载荷：这次的工作目录是跳过一条死路径之后的那个。
      workspace: { cwd: chosen.cwd, source: chosen.source, stale: chosen.stale ?? null },
      // 仓库清单也带在这里：下拉框此前只挂在 graph 载荷上，graph 一失败（或它还没回来）
      // 下拉就整个消失——而改动区自己的请求明明也能给出同一份清单。
      repos: buildRepoList({
        workspaceCwd,
        cwdRoot: cwdRepo.ok === true ? cwdRepo.root : null,
        scanned,
        selected: root,
        worktrees,
      }),
      reposTruncated: scanned.truncated,
```

</details>

**依据 3 · 源码核查**：[scripts/test.mjs:36-56](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/scripts/test.mjs#L36-L56)

自动发现 lib 与测试，空测试目录失败；只作静态检查。

<details>
<summary>查看原文（21行）</summary>

```text
for (const file of readdirSync(libDir).filter((name) => name.endsWith('.js')).sort()) {
  if (!run(`node --check lib/${file}`, ['--check', join('lib', file)])) failures.push(`lib/${file}`)
}

// 2) 测试文件自动发现：test/*.test.cjs，跑完全部再汇总（不要第一个失败就停，
//    不然一次只能修一个问题）。
const testDir = join(root, 'test')
const tests = readdirSync(testDir).filter((name) => name.endsWith('.test.cjs')).sort()
if (tests.length === 0) {
  console.error('test/ 下没发现任何 *.test.cjs —— 这不是"全过了"，是清单空了')
  process.exit(1)
}
for (const file of tests) {
  if (!run(`node test/${file}`, [join('test', file)])) failures.push(`test/${file}`)
}

if (failures.length > 0) {
  console.error(`\n${failures.length} 项失败：\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
console.log(`\n全部通过：${tests.length} 个测试文件 + lib 语法检查`)
```

</details>

**依据 4 · 源码核查**：[lib/workspace.js:1-17](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/workspace.js#L1-L17)

作者明确 fallback 依赖非公开宿主布局。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * dsh-sidebar-git-graph 宿主半的「定位工作区」与「信任围栏」两件事。
 *
 * 定位优先级（越靠前越可信）：
 *   1. 宿主自己的会话记录 `ctx.get('sessions').get(id).header.cwd`（服务在就直接用）；
 *   2. 持久化工作区表 `~/.dsh/storages/workspace.json` 里该 sessionId 所属工作区；
 *   3. `ctx.get('workspaceRegistry').list()` 里的工作区路径（按 sessionId 命中优先）；
 *   4. 兜底：扫 `~/.dsh/sessions/` 找最近写入的会话所在目录。
 *
 * 客户端传来的 `cwd` 不可信，只有在它能被上面的结果背书（同一个路径，或落在某个
 * 已注册工作区之内）时才采用——见 index.js 的 chooseCandidate。
 *
 * 第 2、4 条读的是 DSH 自己的落盘布局（`storages/workspace.json` 的 `tables.workspaces`、
 * `sessions/<编码路径>/<会话id>/`），属于**未公开的实现细节**：它们只是服务缺失时的兜底，
 * 前两条（服务）才是正路。DSH 改了这套布局也不会让插件失效——最差是退回"没有候选"分支。
 */
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs'
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能从视图非原子性推导什么新设计？

**研究主题**：新假设与验证

#### 完整回答

可以推导一种未验证的读取收据设计。现在 graph 和 changes 分别解析仓库并读取不同数据，之后 diff 又发独立请求。请求序号保障的是 UI 请求次序，不是仓库版本一致。因此可尝试让同次刷新返回共同的仓库解析收据、读取前后 HEAD／索引指纹和时间窗口；客户端在收据不一致时明确标为已变化，文件 diff 可显示自己相对哪个状态。

相对当前做法，增量不是把多条读取伪装成事务，而是把非原子性公开为可判断状态。潜在收益是减少并发提交或暂存时对归属的误判。新增负担包括额外读取、收据缓存和状态变化提示，频繁变动仓库可能让界面过度警报，故不能直接认为更好。

最小对照可采用一个持续在两个 worktree 中修改、暂存、提交的可控仓库，比较现有双请求与收据设计在相同脚本时间线下对 HEAD、暂存差异归属和错误提示的表现。记录不一致状态被识别的比例、误报率和 p95 延迟。若没有降低误判，或额外等待抵消收益，就应否定收益主张。该方案未实现、未执行，也不计入现有创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1429-1452](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/client.js#L1429-L1452)

同次刷新使用独立 graph、changes 请求，是收据假设的起点。

<details>
<summary>查看原文（24行）</summary>

```text

      const load = useCallback(async () => {
        const seq = requestSeq.current + 1
        requestSeq.current = seq
        setState((previous) => (previous.status === 'ready' ? { ...previous, refreshing: true } : { status: 'loading' }))
        setChangesState((previous) => (previous.status === 'ready' ? { ...previous, refreshing: true } : { status: 'loading' }))
        // 两个请求并发：图谱与改动互不依赖，串起来只会让页面慢一倍。
        const [graphOutcome, changesOutcome] = await Promise.all([
          requestGraph({ sessionId, cwd, repo: repoChoice, repoHint, scanDepth, max: maxCommits, skip: 0, scope }),
          requestChanges({ sessionId, cwd, repo: repoChoice, repoHint, scanDepth }),
        ])
        if (requestSeq.current !== seq) return
        if (graphOutcome.ok) setState({ status: 'ready', value: graphOutcome.value, refreshing: false })
        else setState({ status: 'error', error: graphOutcome.error })
        // 形状校验见 looksLikeChanges 的注释：旧版宿主会把 `changes` 当 `graph` 回，
        // 不校验就会把「一个改动都没问过」显示成「没有未提交的改动」。
        if (changesOutcome.ok && looksLikeChanges(changesOutcome.value)) {
          setChangesState({ status: 'ready', value: changesOutcome.value, refreshing: false })
        } else if (changesOutcome.ok) {
          setChangesState({ status: 'error', error: { code: 'stale-host', message: STALE_HOST_COPY } })
        } else {
          setChangesState({ status: 'error', error: changesOutcome.error })
        }
      }, [sessionId, cwd, repoChoice, scanDepth, maxCommits, scope])
```

</details>

**依据 2 · 源码核查**：[lib/index.js:793-809](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L793-L809)

单图谱也由多条并行命令组成，不能仅合并 HTTP 请求就宣称原子。

<details>
<summary>查看原文（17行）</summary>

```text
  const [statusResult, refsResult, logResult] = await Promise.all([
    runGit(statusArgv(root), { cwd: root }),
    runGit(refsArgv(root), { cwd: root }),
    runGit(logArgv(root, { max, skip, scope }), { cwd: root }),
  ])
  if (!logResult.ok) {
    return fail('git-failed', 'git log 失败', { detail: stderrTail(logResult) })
  }

  const commits = parseLog(logResult.stdout)
  const refs = refsResult.ok ? parseRefs(refsResult.stdout) : []
  const status = statusResult.ok
    ? parseStatus(statusResult.stdout)
    : { branch: null, upstream: null, ahead: 0, behind: 0, dirty: 0, detached: false, initial: false }

  const value = buildSnapshot({
    root,
```

</details>

#### 缺口

- 读取收据是否能减少真实判断错误尚无实验结果。
  **影响**：只能作为设计假设，不能提升本插件现有能力或采用等级。
  **进一步探讨**：继续探讨可先用可控并发修改时间线比较误判、误报和延迟，再决定是否值得实现。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人值得试用，什么条件应停止？

**研究主题**：采用判断

#### 完整回答

建议结论为试用。适合在本地单用户 DSH web 中频繁检查多 worktree 关系、愿意核对仓库与新鲜度提示的开发者。只读设计和可选侧栏回退提供了可控试用路径，实际价值是会话内查阅，不是替代 Git 写入流程或给出安全审查结论。

开始前明确 webServer 的访问控制和安装来源，选择一个可回溯的小仓库，核对显式仓库、会话标签、暂存和未暂存差异是否与 Git CLI 一致。发现静默换库、旧宿主假空结果、未标明截断或不能解释的内容差异时，应停止依赖图谱作判断并回到 CLI。GitHub 分发名和另一个作者的 npm 同名项目不可混用。

不建议在未审查访问控制的多人或公网宿主直接依赖其读取围栏，也不适合把视图当成远端已同步和仓库状态原子一致的证明。没有本轮同版本安装、核心功能和禁用验收，不给值得安装结论。上述边界会压低证据分，但并不抹去源码可见的集成价值；后续采用判断应以任务正确率和复核负担为核心，而非 Star 或代码规模。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:103-137](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/README.md#L103-L137)

作者明示只读、截断、远端与分发边界；其真机声明不当作本次宿主验收。

<details>
<summary>查看原文（35行）</summary>

```text
## 已知限制

- **只读是设计**：不暂存、不提交、不切分支、不 push。要改工作树就用别的工具。
- **未跟踪文件没有 +/− 计数**：`git diff --no-index` 只比较两个路径，要行数就得**每个文件起一个进程**
  （一个还没 `add` 过的仓库里可能是几百次）。所以段头只统计拿得到计数的行，拿不到的**留空**，
  而不是印一个会被读成「没有改动」的 `0`。一个文件两侧都改过（`MM`）会**同时出现在两段**——
  那正是这两段的含义。
- **内嵌的独立仓库是一行不可点的目录**：git 不会下钻进「仓库里的仓库」（`-uall` 也不下钻），
  所以外层仓库只看得见一个目录，它没有 diff 可显示。页面在那一行上说明原因，而不是点了没反应。
- **上限**：一次最多 3000 行改动、单个文件最多 512 KiB patch；两者都会在页面上如实说明，
  而不是悄悄截掉。
- **窗口有上限**（单次最多 2000 条，默认 400）；更老的历史会明确提示"被截断"，而不是静默丢弃。
- **仓库发现是有上限的扫盘**：层数、目录数、仓库数、耗时四道闸门，踩到任何一条都会在页面上
  如实说明（而不是假装清单就是全的）；解决办法是把扫描层数调小。显然不会住着"想单独画的仓库"
  的目录（`node_modules`、`target`、`.venv`、构建产物…）不向下递归——但每个仍会 stat 一次，
  所以一个恰好叫 `build` 的仓库不会被漏掉。
- **下拉里只会出现从工作区够得到的仓库**：工作区自身、它里面的、把它包住的那个，以及
  **工作区所属仓库的工作树**（以 `git worktree list` 为准）。别的路径即使浏览器点名，宿主也会
  拒绝；并且会用 `rev-parse` 复核它确实是仓库根。
- **工作目录被删了就不再拿它当工作区**：会话/标签页手里的那个路径可能是一条**已经删掉的关联
  工作树**（活干完就删是常态）。宿主会跳过它、改用仍然存在的候选继续画，并在页面上说清
  "上次的工作目录（…）已经不在了，这次改画 …"——而不是整页只剩一句「工作目录不存在」。
- **每个工作树各读各的**：`git status` 与 `git log` 都是按工作树算的，所以每个工作树显示自己的
  分支、自己的未提交改动、自己的 `HEAD`；页面从不把两个工作树合成一份。
  目录已不在的（`prunable`）与裸仓库不列出，只在提示里给出条数。
- **提交的文件清单有上限**：一个提交最多列 2000 个文件（初始提交在大仓库上可能有上万个），
  超了会写明「共 N 个，只列了前 M 个」，绝不悄悄少列。合并提交列的是**相对第一父提交**的改动
  （与 VS Code 同口径）；空提交如实说「没有任何文件改动」。
- **搜索不过滤图**（理由见特性一节）。
- **泳道配色**由 DSH 主题令牌 + `color-mix()` 派生；不支持 `color-mix()` 的浏览器退化为四个主题状态色循环。
- 在 DSH `0.1.7-rc.2` + `dsh-better-sidebar` 0.21.1 上真机验证过；原生回退路径有同一套测试覆盖，
  但真机使用得少一些。
- npm 上的 `dsh-git-graph` 是**另一个作者的另一个插件**
  （[enoughpower/dsh-git-graph](https://www.npmjs.com/package/dsh-git-graph)）。
  本插件是 `@zeng/dsh-sidebar-git-graph`，目前只从 GitHub 分发。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:274-299](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/index.js#L274-L299)

无候选时的未围栏回退要求采用前独立核查访问控制。

<details>
<summary>查看原文（26行）</summary>

```text
function chooseCandidate(ctx, dshHome, payload) {
  const sessionId = typeof payload.sessionId === 'string' && payload.sessionId !== '' ? payload.sessionId : undefined
  const candidates = resolutionCandidates(ctx, dshHome, sessionId)
  const allowed = new Set()
  for (const candidate of candidates) {
    const key = canonical(candidate.path)
    if (key !== null) allowed.add(key)
  }
  const claimed = typeof payload.cwd === 'string' && payload.cwd !== '' ? payload.cwd : undefined
  // 存在性只查一次：既用来决定要不要采纳，也用来决定要不要记进 skippedClaim。
  const claimedAlive = claimed !== undefined && existsSync(claimed)
  if (claimedAlive) {
    const key = canonical(claimed)
    if (key !== null && (allowed.has(key) || isBackedByWorkspace(ctx, dshHome, claimed))) {
      return { cwd: claimed, source: 'claimed' }
    }
    // 没有任何宿主候选时（本机没登记工作区）给客户端路径一个机会：能 rev-parse 出来就用。
    if (candidates.length === 0) return { cwd: claimed, source: 'claimed-unfenced' }
  }
  if (candidates.length === 0) {
    // 一个宿主候选都没有、客户端给的路径又不存在：照旧把它带下去，让 resolveRepo 报出
    // **具体是哪个目录没了**。"拿不到工作目录：会话没有记录 cwd，也没有已注册的工作区"
    // 会把诊断带偏——那是另一回事（本机没登记过任何工作区）。
    if (claimed !== undefined) return { cwd: claimed, source: 'claimed-unfenced' }
    return null
  }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1437-1450](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/client.js#L1437-L1450)

对旧宿主载荷形状核查提供可观察的试用停止条件。

<details>
<summary>查看原文（14行）</summary>

```text
          requestGraph({ sessionId, cwd, repo: repoChoice, repoHint, scanDepth, max: maxCommits, skip: 0, scope }),
          requestChanges({ sessionId, cwd, repo: repoChoice, repoHint, scanDepth }),
        ])
        if (requestSeq.current !== seq) return
        if (graphOutcome.ok) setState({ status: 'ready', value: graphOutcome.value, refreshing: false })
        else setState({ status: 'error', error: graphOutcome.error })
        // 形状校验见 looksLikeChanges 的注释：旧版宿主会把 `changes` 当 `graph` 回，
        // 不校验就会把「一个改动都没问过」显示成「没有未提交的改动」。
        if (changesOutcome.ok && looksLikeChanges(changesOutcome.value)) {
          setChangesState({ status: 'ready', value: changesOutcome.value, refreshing: false })
        } else if (changesOutcome.ok) {
          setChangesState({ status: 'error', error: { code: 'stale-host', message: STALE_HOST_COPY } })
        } else {
          setChangesState({ status: 'error', error: changesOutcome.error })
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
