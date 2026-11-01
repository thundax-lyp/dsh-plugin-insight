# dsh-plugin-orchd

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7e18bff](https://github.com/7bder/dsh-plugin-orchd/tree/7e18bff1340d91eedd6422e306f9a73b43cdbcc9)

<!-- BEGIN META -->
[![npm 30d 660](https://img.shields.io/static/v1?label=npm+30d&message=660&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-orchd)
<!-- END META -->

> **功能**：在 DSH 侧栏查看当前项目的 orchd 任务状态。

> **亮点**：[Q02](#research-q02) 将会话绑定、只读调用与面板集中。

> **主要限制**：[Q03](#research-q03) 项目引擎仍是可执行代码，安装入口会注入会话提示。

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
  - [Q01 · 只读侧栏对项目协作有什么增量？](#detail-section-11)
  - [Q02 · 项目绑定及只读调用怎样实现？](#detail-section-12)
  - [Q03 · 只读面板是否代表不会触发任何后续写入？](#detail-section-13)
  - [Q04 · 何时适用及如何排查？](#detail-section-14)
  - [Q05 · 怎样让用户判断是否刷新或回引擎核对？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中跟踪 orchd 项目任务和评审的用户。

使用 orchd CLI 或已有任务看板查询。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 项目解析 | 会话绑定根 | 空 allowRoots 不额外约束 |
| 只读白名单 | 查询状态 | 仍执行项目引擎 |
| 超时 | 停止等待并 kill 子进程 | 后代未证结束 |
| 安装入口 | 注入接入提示 | 后续动作受用户授权与宿主约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 会话 | 必需 | 解析项目根 | 无法定位时报告错误 |
| Python 和可信 orchd | 读取必需 | 查询状态 | 检测未安装或失败 |
| allowRoots | 可选 | 收窄项目根 | 空值不额外限制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对可信项目与 Python | 无引擎时按需接入 |
| 打开 | 用户进入对应 DSH 会话 | 核对推导项目根 |
| 查看 | 面板读取看板和依赖 | 失败或过期时刷新 |
| 验收 | 用户回 CLI 或原始产物确认 | 不以缓存视图证明任务完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python 和引擎费用未知 | 安装与配置时间未知 | 信任项目代码 |
| 持续使用 | 子进程资源消耗未知 | 状态核对耗时未知 | 缓存可能过期 |
| 失败恢复 | 重试资源费用未知 | 排查项目与进程耗时未知 | 实机未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 同屏查看 | 作者描述看板及时间线 | 节省时间及误判率 |
| 白名单 | 源码限制命令形状 | 不可信引擎的实际副作用 |
| 超时 | 调用 child.kill | 后代进程终止 |

> **思考**：[Q03](#research-q03) 项目引擎仍是可执行代码，安装入口会注入会话提示。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将会话绑定、只读调用与面板集中。

[Q02](#research-q02) 会话推导和白名单减少路径和命令暴露，不能替代沙箱。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 项目引擎仍是可执行代码，安装入口会注入会话提示。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在可信项目启用，核对根并用原始状态复核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定插件源码静态核查，未运行 orchd、Python 或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、lib/project.js、lib/orchd-cli.js、lib/install-entry.js、lib/routes.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定插件静态检查；未运行外部 orchd 或宿主。
- 下一步：隔离可信项目测试缓存、会话切换、超时和调用前后文件变化。

**分析版本**

- **仓库**：[7bder/dsh-plugin-orchd](https://github.com/7bder/dsh-plugin-orchd)
- **版本号**：0.1.2（[固定提交 7e18bff](https://github.com/7bder/dsh-plugin-orchd/tree/7e18bff1340d91eedd6422e306f9a73b43cdbcc9)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照现有刷新与 TTL 展示状态来源，测过期误判。

隔离可信项目测试缓存、会话切换、超时和调用前后文件变化。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 16 | 7648 | 5472 | 1695 | — |
| .md | source | 1 | 121 | — | — | 1318 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/7bder/dsh-plugin-orchd/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查只读侧栏、会话绑定和外部引擎边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 只读侧栏对项目协作有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 项目会话中查看 orchd 看板和依赖可减少切换；原 orchd CLI 或手工查看已有状态，面板不执行 claim、done 等写命令。任务是否真实完成仍要看引擎和实际产物。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-14](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/README.md#L1-L14)

作者说明只读面板。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-plugin-orchd

Read-only **orchd** panel for the DeepSeek Harness (DSH) **right sidebar**: open a project session and see that
project's task board, dependency graph, ideas and review timeline next to the conversation.
No project configuration — the plugin derives the project from the session.

把 [orchd](https://github.com/7bder/orchd-core) 的项目状态带进 DSH 右侧栏的**只读面板**：

> 点开一个项目会话，面板自动检测这个项目有没有用 orchd。
> 装了 → 同屏显示任务看板、依赖图、想法与审查时间线；没装 → 给一个接入入口。

**面板没有任何写操作**：`claim` / `done` / `review` / `merge` / `amend` 一律不出现在 UI 里。

---
```

</details>

**依据 2 · 源码核查**：[lib/orchd-cli.js:31-45](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/orchd-cli.js#L31-L45)

读命令白名单。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * 读命令白名单（fail-closed）。
 *
 * 每一项声明允许的参数形态；`args` 里 `:task-id` 之类的占位符由调用方按自身语义校验，
 * 这里只做「形状」匹配：固定词必须逐字相等，`<>` 表示一个自由参数。
 *
 * 刻意**不**包含（docs/03 第 4.1/4.3/9 节的理由）：
 *   - `request`：本参考项目 `config.allow_auto_claim: true`，会真的认领任务（高危）；
 *   - `watchdog --takeover` / `doctor --fix`：flag 触发的写路径；
 *   - `session current`：会写 `last_seen`；
 *   - `git` / `check`：前者是写操作的入口，后者昂贵。
 */
export const READ_WHITELIST = Object.freeze([
  { name: 'status', shapes: [[], ['--all'], ['<task-id>'], ['--text']], why: '全局快照 / 单任务卡片' },
  { name: 'show', shapes: [['<task-id>']], why: 'status <id> 的别名' },
```

</details>

#### 缺口

- 未比较真实任务
  **影响**：不能量化协作收益
  **进一步探讨**：对照 CLI 测查找任务时间和误判。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目绑定及只读调用怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

项目根由会话关联工作区或 session header cwd 推导，allowRoots 非空时再限制，空值不附加收敛。CLI 白名单约束命令及参数形状，子进程环境关闭自动清理并不传会话身份；超时或取消调用 child.kill。实际启动项目自带 Python/引擎，白名单不是操作系统沙箱，恶意或偏离契约的项目代码仍需信任。

#### 证据与依据

**依据 1 · 源码核查**：[lib/project.js:35-45](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/project.js#L35-L45)

由会话推导根。

<details>
<summary>查看原文（11行）</summary>

```text
 * @param {object} config 规范化后的配置
 * @returns {Promise<ProjectResolution | { error: { reason: string, detail?: object } }>}
 */
export async function resolveProjectRoot(ctx, sessionId, config) {
  const warnings = []

  if (typeof sessionId !== 'string' || sessionId.trim() === '') {
    return { error: { reason: 'project-root-unresolved', detail: { why: 'session id is empty' } } }
  }

  // 1) 调试覆写：allowRoots 只影响「允许哪些根通过」，不改变推导顺序。
```

</details>

**依据 2 · 源码核查**：[lib/project.js:74-104](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/project.js#L74-L104)

header 回退及 allowRoots。

<details>
<summary>查看原文（31行）</summary>

```text
  if (derived === null && registry !== undefined && registry !== null && typeof registry.readSessionHeader === 'function') {
    try {
      const header = await registry.readSessionHeader(sessionId)
      if (typeof header?.cwd === 'string' && isAbsolute(header.cwd)) sessionCwd = header.cwd
      else warnings.push('session header has no absolute cwd')
    } catch (error) {
      warnings.push(`readSessionHeader failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (derived === null && sessionCwd !== null) {
    derived = { root: canonicalPath(sessionCwd), source: 'session-cwd', workspaceId: null }
  }

  if (derived === null) {
    return {
      error: {
        reason: 'project-root-unresolved',
        detail: { sessionId, warnings }
      }
    }
  }

  // allowRoots 收敛（Q5：默认空 = 不限制）
  if (Array.isArray(config.allowRoots) && config.allowRoots.length > 0) {
    const allowed = config.allowRoots.map((entry) => keyOf(entry))
    if (!allowed.includes(keyOf(derived.root))) {
      return {
        error: {
          reason: 'project-root-not-allowed',
          detail: { root: derived.root, allowRoots: config.allowRoots }
```

</details>

**依据 3 · 源码核查**：[lib/orchd-cli.js:20-45](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/orchd-cli.js#L20-L45)

环境约束与白名单。

<details>
<summary>查看原文（26行）</summary>

```text
export const CHILD_ENV = Object.freeze({
  /** 关闭僵尸会话自动回收（`status` 会做 prune_orphans + auto_clean）。 */
  ORCHD_AUTO_CLEAN: 'off',
  /** 关闭回收留痕的 stderr 输出，保证 stdout 干净。 */
  ORCHD_QUIET: '1',
  /** 避免中文在管道下的编码异常。 */
  PYTHONIOENCODING: 'utf-8',
  /** 不在项目内产生 `__pycache__`（插件自己的加固，非引擎要求）。 */
  PYTHONDONTWRITEBYTECODE: '1'
})

/**
 * 读命令白名单（fail-closed）。
 *
 * 每一项声明允许的参数形态；`args` 里 `:task-id` 之类的占位符由调用方按自身语义校验，
 * 这里只做「形状」匹配：固定词必须逐字相等，`<>` 表示一个自由参数。
 *
 * 刻意**不**包含（docs/03 第 4.1/4.3/9 节的理由）：
 *   - `request`：本参考项目 `config.allow_auto_claim: true`，会真的认领任务（高危）；
 *   - `watchdog --takeover` / `doctor --fix`：flag 触发的写路径；
 *   - `session current`：会写 `last_seen`；
 *   - `git` / `check`：前者是写操作的入口，后者昂贵。
 */
export const READ_WHITELIST = Object.freeze([
  { name: 'status', shapes: [[], ['--all'], ['<task-id>'], ['--text']], why: '全局快照 / 单任务卡片' },
  { name: 'show', shapes: [['<task-id>']], why: 'status <id> 的别名' },
```

</details>

**依据 4 · 源码核查**：[lib/orchd-cli.js:229-237](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/orchd-cli.js#L229-L237)

spawn 与环境。

```text
    let child
    try {
      child = spawnImpl(command, commandArgs, {
        // cwd 必须是主工作树（见函数头注释的 E036 说明）
        cwd,
        windowsHide: true,
        // env 是**白名单式**构造：只带出必要变量 + 我们的只读开关，
        // 绝不把宿主的 ORCHD_SESSION_ID（若存在）传下去（FR-10.1）。
        env: buildChildEnv(),
```

**依据 5 · 源码核查**：[lib/orchd-cli.js:247-264](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/orchd-cli.js#L247-L264)

超时及取消。

<details>
<summary>查看原文（18行）</summary>

```text
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      try {
        child.kill()
      } catch {
        /* 忽略：可能已退出 */
      }
    }, Math.max(1, timeoutMs))

    const onAbort = () => {
      try {
        child.kill()
      } catch {
        /* 忽略 */
      }
    }
```

</details>

#### 缺口

- 未运行 orchd 或验证子进程所有副作用
  **影响**：不能将白名单视作内核隔离
  **进一步探讨**：在隔离可信项目测调用、超时和磁盘差异。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读面板是否代表不会触发任何后续写入？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

正常状态读取走白名单，但安装入口可把固定接入提示注入当前 Agent 会话；这不是插件直接执行安装，后续模型可能基于提示采取动作，需用户授权和宿主控制。面板缓存也可能暂时过期，不能把展示视为即时事实或外部引擎安全性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/install-entry.js:1-9](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/install-entry.js#L1-L9)

显式接入路径向会话注入消息。

```text
/**
 * 安装入口 A 路径：把「接入 orchd」的指令注入当前会话（FR-3.2/3.3/3.5、NFR-2.4）。
 *
 * 设计要点（机制与证据见 docs/04 第 9/9.1b/9.1c 节）：
 *   - **注入完全在宿主侧**：`ctx.agents.get(sessionId)` 取 Agent → `agent.steer(用户消息)`。
 *     因此不需要「浏览器主动触发命令」（V3 不是前置条件）。
 *   - **文本是插件内常量**（NFR-2.4）：只允许拼接配置里的仓库地址与固定命令，绝不读项目文件内容。
 *   - **只有用户显式确认才会调用**：本模块只被 `POST /orchd/api/install-inject` 调用一次，
 *     任何轮询/刷新路径都不得触碰（FR-3.3/FR-3.5）。
```

**依据 2 · 源码核查**：[README.md:1-14](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/README.md#L1-L14)

面板不含任务写按钮。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-plugin-orchd

Read-only **orchd** panel for the DeepSeek Harness (DSH) **right sidebar**: open a project session and see that
project's task board, dependency graph, ideas and review timeline next to the conversation.
No project configuration — the plugin derives the project from the session.

把 [orchd](https://github.com/7bder/orchd-core) 的项目状态带进 DSH 右侧栏的**只读面板**：

> 点开一个项目会话，面板自动检测这个项目有没有用 orchd。
> 装了 → 同屏显示任务看板、依赖图、想法与审查时间线；没装 → 给一个接入入口。

**面板没有任何写操作**：`claim` / `done` / `review` / `merge` / `amend` 一律不出现在 UI 里。

---
```

</details>

**依据 3 · 源码核查**：[README.md:64-72](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/README.md#L64-L72)

缓存和超时配置。

```text
  面板跑的是**项目自带的**引擎入口 `python <项目>/.orchd/__main__.py`，插件不自带、不安装引擎。

## 只读保证

这是硬约束，不是口号：

- 命令白名单 **fail-closed**：不在白名单里的子进程调用根本不 spawn，被拒时记一行结构化日志。
- 子进程环境**剥掉会话身份**，读命令不会带出任何会被引擎当成「有人在动这个任务」的变量。
- 不直读账本、不碰锁、不写项目文件；面板不做文件导出（诊断信息只复制到剪贴板）。
```

#### 缺口

- 未运行 UI、会话注入和外部引擎
  **影响**：不知宿主后续实际行为
  **进一步探讨**：隔离测试接入确认、会话变化、过期缓存和引擎异常。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时适用及如何排查？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、Python 和可信项目内 orchd；使用者先检查会话所指项目与 root，按需设置 allowRoots。检测失败或数据不一致时刷新并回 CLI/账本核实；超时杀子进程不证明所有后代已退出。依赖、权限和维护成本未实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/project.js:74-104](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/project.js#L74-L104)

会话回退与根限制。

<details>
<summary>查看原文（31行）</summary>

```text
  if (derived === null && registry !== undefined && registry !== null && typeof registry.readSessionHeader === 'function') {
    try {
      const header = await registry.readSessionHeader(sessionId)
      if (typeof header?.cwd === 'string' && isAbsolute(header.cwd)) sessionCwd = header.cwd
      else warnings.push('session header has no absolute cwd')
    } catch (error) {
      warnings.push(`readSessionHeader failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (derived === null && sessionCwd !== null) {
    derived = { root: canonicalPath(sessionCwd), source: 'session-cwd', workspaceId: null }
  }

  if (derived === null) {
    return {
      error: {
        reason: 'project-root-unresolved',
        detail: { sessionId, warnings }
      }
    }
  }

  // allowRoots 收敛（Q5：默认空 = 不限制）
  if (Array.isArray(config.allowRoots) && config.allowRoots.length > 0) {
    const allowed = config.allowRoots.map((entry) => keyOf(entry))
    if (!allowed.includes(keyOf(derived.root))) {
      return {
        error: {
          reason: 'project-root-not-allowed',
          detail: { root: derived.root, allowRoots: config.allowRoots }
```

</details>

**依据 2 · 源码核查**：[lib/orchd-cli.js:229-237](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/orchd-cli.js#L229-L237)

运行项目引擎。

```text
    let child
    try {
      child = spawnImpl(command, commandArgs, {
        // cwd 必须是主工作树（见函数头注释的 E036 说明）
        cwd,
        windowsHide: true,
        // env 是**白名单式**构造：只带出必要变量 + 我们的只读开关，
        // 绝不把宿主的 ORCHD_SESSION_ID（若存在）传下去（FR-10.1）。
        env: buildChildEnv(),
```

**依据 3 · 源码核查**：[lib/orchd-cli.js:247-264](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/orchd-cli.js#L247-L264)

超时和中止仅调用 child.kill。

<details>
<summary>查看原文（18行）</summary>

```text
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      try {
        child.kill()
      } catch {
        /* 忽略：可能已退出 */
      }
    }, Math.max(1, timeoutMs))

    const onAbort = () => {
      try {
        child.kill()
      } catch {
        /* 忽略 */
      }
    }
```

</details>

#### 缺口

- 未部署或核查引擎实现
  **影响**：兼容性和副作用未知
  **进一步探讨**：隔离可信项目比较只读调用前后状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让用户判断是否刷新或回引擎核对？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有面板已有缓存 TTL、手动刷新和超时区分，是直接反证；假设展示该项目最近一次成功读取的时间、根与来源状态可辅助决定刷新或回 CLI 查证。对照现有界面，注入 TTL 内项目变化、会话切换、超时和正常场景，比较错误依据过期数据决策、误报、查证时长与视觉负担；无改善、误导或成本抵消收益则否定。尚未穷尽客户端是否已有等价显示。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:64-72](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/README.md#L64-L72)

已有 TTL 和超时配置。

```text
  面板跑的是**项目自带的**引擎入口 `python <项目>/.orchd/__main__.py`，插件不自带、不安装引擎。

## 只读保证

这是硬约束，不是口号：

- 命令白名单 **fail-closed**：不在白名单里的子进程调用根本不 spawn，被拒时记一行结构化日志。
- 子进程环境**剥掉会话身份**，读命令不会带出任何会被引擎当成「有人在动这个任务」的变量。
- 不直读账本、不碰锁、不写项目文件；面板不做文件导出（诊断信息只复制到剪贴板）。
```

**依据 2 · 源码核查**：[lib/project.js:74-104](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/project.js#L74-L104)

会话路径和限制。

<details>
<summary>查看原文（31行）</summary>

```text
  if (derived === null && registry !== undefined && registry !== null && typeof registry.readSessionHeader === 'function') {
    try {
      const header = await registry.readSessionHeader(sessionId)
      if (typeof header?.cwd === 'string' && isAbsolute(header.cwd)) sessionCwd = header.cwd
      else warnings.push('session header has no absolute cwd')
    } catch (error) {
      warnings.push(`readSessionHeader failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (derived === null && sessionCwd !== null) {
    derived = { root: canonicalPath(sessionCwd), source: 'session-cwd', workspaceId: null }
  }

  if (derived === null) {
    return {
      error: {
        reason: 'project-root-unresolved',
        detail: { sessionId, warnings }
      }
    }
  }

  // allowRoots 收敛（Q5：默认空 = 不限制）
  if (Array.isArray(config.allowRoots) && config.allowRoots.length > 0) {
    const allowed = config.allowRoots.map((entry) => keyOf(entry))
    if (!allowed.includes(keyOf(derived.root))) {
      return {
        error: {
          reason: 'project-root-not-allowed',
          detail: { root: derived.root, allowRoots: config.allowRoots }
```

</details>

**依据 3 · 源码核查**：[lib/routes.js:196-203](https://github.com/7bder/dsh-plugin-orchd/blob/7e18bff1340d91eedd6422e306f9a73b43cdbcc9/lib/routes.js#L196-L203)

refresh 入口。

```text
  const sessionId = url.searchParams.get('session') ?? ''
  if (sessionId === '') {
    sendJson(res, 400, envelope({ ok: false, startedAt, error: { kind: 'bad_request', reason: 'missing-session', message: 'query parameter `session` is required' } }))
    return
  }

  try {
    const loaded = await loadContext(deps, sessionId, { refresh: url.searchParams.get('refresh') === '1' })
```

#### 缺口

- 未穷尽 UI 及引擎时间语义
  **影响**：不能认定新增状态缺口
  **进一步探讨**：固定项目回放比较现有界面和原型。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
