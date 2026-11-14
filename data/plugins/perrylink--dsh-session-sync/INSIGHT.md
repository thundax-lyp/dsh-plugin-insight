# DSH Session Sync

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0920f12](https://github.com/PerryLink/dsh-session-sync/tree/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-session-sync) [![npm 30d 4,807](https://img.shields.io/static/v1?label=npm+30d&message=4%2C807&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-session-sync) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-session-sync)
<!-- END META -->

> **功能**：通过 Git 镜像在设备之间同步 DeepSeek Harness 会话。

> **亮点**：[Q02](#research-q02) 的三方计划把有分歧的另一份字节保存在单独文件，减少手工找回历史。

> **主要限制**：[Q03](#research-q03) 等待落盘可失败后继续。[Q04](#research-q04) 的加密缺依赖也会回退到明文，两种告警直接影响采用。

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
  - [Q01 · 两台设备上的 DSH 会话去哪里同步，有何增量？](#detail-section-11)
  - [Q02 · 推拉冲突如何保住双方，哪些文件仍可被删除？](#detail-section-12)
  - [Q03 · 哪条路径需要确认，自动推送等到了什么？](#detail-section-13)
  - [Q04 · 配置 encrypted 足以让远程历史保持密文吗？](#detail-section-14)
  - [Q05 · 怎样测试采用、退出和更严格的推送回执？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用两台设备的 DSH 用户可逐项核对会话在第二台设备的恢复。[Q01](#research-q01)

单向手工备份可覆盖无并发的迁移，双设备继续同一任务需要显式处理分歧。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 按命令推拉 | 在两个设备迁移日志 | 手动写入需要宿主确认 |
| 查看差异和历史 | 核查同步和找到 fork | 状态仅反映当前镜像 |
| 按轮次自动推送 | 自动更新另一端的候选日志 | 持久化等待失败可继续 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 会话、subprocess、命令及 storageDomain | 挂载需要 | 登记入口和写状态 | 先保持本地备份 |
| 专用 Git 仓库和凭据 | 同步需要 | 保存镜像与追踪分歧 | 缺远端拒绝推拉 |
| age 与身份 | 仅密文模式 | 加密远端内容 | 当前会降级并警告，停止测试推送 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者建测试镜像，关闭自动模式 | 明确根目录、远端与加密选择 |
| 同步 | 两设备手动推拉并检查分歧 | 复核 fork、最后一轮及本地恢复 |
| 中止 | 发现明文或丢事件后停用同步 | 回本地备份，检查 Git 历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 仓库、设备及存储未计量 | 准备独立备份和权限 | 密文条件须另核 |
| 持续 | 传输及历史增长未知 | 查看状态、分歧和加密 | 按合格会话交接计 |
| 恢复 | 重试与恢复用量未知 | 核对最后事件及保留副本 | 停用后仍需查历史 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双端分歧 | Git 路径保留语义 | 实际宿主续聊 |
| 条件密文 | 探测成功可选 age | 该远端当前历史是否全部密文 |
| 自动推送 | 尝试等待磁盘 | 目标宿主实际回执与落盘 |

> **思考**：[Q03](#research-q03) 等待落盘可失败后继续。[Q04](#research-q04) 的加密缺依赖也会回退到明文，两种告警直接影响采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 的三方计划把有分歧的另一份字节保存在单独文件，减少手工找回历史。

[Q02](#research-q02) 的字节判定和事务前后的恢复资料可借鉴。它处理的是镜像中的对象，仍须验证活跃会话的宿主持久化。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 等待落盘可失败后继续。[Q04](#research-q04) 的加密缺依赖也会回退到明文，两种告警直接影响采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先在隔离设备使用无敏感样本，比对两端历史与 Git 树。出现明文或最后事件缺失时停止同步。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实镜像、回退和确认机制。真实跨设备、宿主版本和加密部署仍需复核。

- 已检查：作者 README、包清单、源码路径 README.md、index.mjs、lib/engine.mjs、lib/merge.mjs、lib/mirror.mjs、lib/gate.mjs、lib/backend.mjs、lib/encrypted.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定 Git 入口、镜像、合并与边界分支，未运行 Git 同步、age、目标代码、宿主或测试。
- 下一步：[Q05](#research-q05) 对照配置缺失、超时和两端分歧，验证更严格回执是否降低误上传并保留正常重试。

**分析版本**

- **仓库**：[PerryLink/dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)
- **版本号**：0.3.1（[固定提交 0920f12](https://github.com/PerryLink/dsh-session-sync/tree/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可比较强制密文与持久化证据的回执，验证是否减少误推。

[Q05](#research-q05) 对照配置缺失、超时和两端分歧，验证更严格回执是否降低误上传并保留正常重试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2937 | — | — | 35185 |
| .mjs | source | 27 | 5165 | 3516 | 1383 | — |
| .mjs | test | 16 | 2902 | 2315 | 345 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-session-sync/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/PerryLink/dsh-session-sync/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)

暂未获取：近30天关闭。

统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：两台设备如何同步 DSH 会话并保留两边的进展，哪些条件会导致明文上传或不完整恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两台设备上的 DSH 会话去哪里同步，有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常在两台设备继续同一任务的人，可把一台的 DSH 会话文件映射到专用 Git 仓库，在另一台拉取恢复。原来用文件备份或同步盘时，用户得定位文件、处理冲突和决定哪份当主。扩展注册 /sync 和 sync_* 工具，提供状态与按会话的合并提示；状态来自 Git 后端及宿主存储的设备 ID、最近推拉和错误。合格结果是两台设备均能定位有完整最后一轮的记录，并能复核发生分歧时另一方内容。已有单机历史和普通复制可保留，不需要跨设备的人收益有限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-61](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/README.md#L37-L61)

用户场景及典型配置

<details>
<summary>查看原文（25行）</summary>

````text
## 它是什么

`dsh-session-sync` 把 DSH 会话存储（`$DSH_HOME/sessions`）镜像到一个专用 git 工作树，再同步到**你自己**控制的远端：没有云服务，没有第三方存储。会话文件按不透明字节复制，插件从不解析 JSONL/zstd——物理编码属于 harness，插件的职责只是搬运字节、合并 append-only 历史并报告状态。发生分歧时走 append-only 三方合并：**两边都保留**，远端版本留存为 fork 文件，绝不静默覆盖。默认 `backend: git` 是明文镜像；`backend: encrypted` 在镜像之上加一层 age 加密；自动模式全部可配置、可逆。

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-session-sync-flow-v5-dark.svg">
    <img src="docs/assets/dsh-session-sync-flow-v5-light.svg" width="100%" alt="dsh-session-sync 结构图：设备 A 的 $DSH_HOME/sessions 经字节镜像与提交，越过确认门推送到你自己的 git 远端；设备 B 拉取后逐文件三方合并（base/ours/theirs），再把会话恢复到本机，分歧时本地保留原路径、远端字节存为 fork 文件；fork 文件永不被删除或覆盖。">
  </picture>
</p>

## 三步上手

1. **安装**（三选一）：

   ```sh
   # git 通道（最新 main；等价于 git+https://github.com/PerryLink/dsh-session-sync.git）
   dsh plugin --profile web add github:PerryLink/dsh-session-sync
   # npm 通道（已发布版本）
   dsh plugin --profile web add dsh-session-sync
   # tarball 通道：本仓库 pnpm pack 后
   dsh plugin --profile web add ./dsh-session-sync-<version>.tgz
   ```

   无构建步骤——`index.mjs` 与 `lib/` 即发布产物。
````

</details>

**依据 2 · 源码核查**：[index.mjs:659-687](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L659-L687)

设备身份与状态记录

<details>
<summary>查看原文（29行）</summary>

```text

  /** 确保设备 id 已持久化并读入缓存。 */
  async function ensureMeta() {
    if (metaCache !== undefined) return metaCache
    const table = await tablePromise
    let state = await table.get(STATE_KEY)
    if (state === undefined) {
      state = { deviceId: randomUUID() }
      await table.put(STATE_KEY, state)
    }
    metaCache = state
    return state
  }

  /** 元数据补丁（引擎回调；串行写领域）。 */
  function reportMeta(patch) {
    void withMeta(async () => {
      try {
        const current = await ensureMeta()
        const next = { ...current, ...patch }
        // `undefined` 表示删除该键（清空 lastError），而不是写入一个非 JSON 值。
        for (const key of Object.keys(patch)) if (patch[key] === undefined) delete next[key]
        const table = await tablePromise
        await table.put(STATE_KEY, next)
        metaCache = next
      } catch (error) {
        warn(`sync metadata write failed: ${messageOf(error)}`)
      }
    })
```

</details>

**依据 3 · 源码核查**：[index.mjs:791-800](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L791-L800)

命令注册

<details>
<summary>查看原文（10行）</summary>

```text
  // Service Provider — /sync 命令注册进宿主 commands 服务；其 handler 是消费面（Consumer）。
  if (resolved.registerCommand) {
    ctx.commands.register({
      name: COMMAND_NAME,
      description: 'Cross-device session sync: status, pull/push the git mirror with keep-both conflict resolution, or diff against the last-fetched remote.',
      input: { hint: '[status | pull | push | diff | log | help]' },
      async handler(invocation) {
        return handleSyncCommand(invocation)
      },
    })
```

</details>

**依据 4 · 源码核查**：[index.mjs:894-899](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L894-L899)

选装模型工具注册

```text
  if (resolved.registerTools) {
    ctx.inject(['tools'], (toolCtx) => {
      toolCtx.tools.register(makeSyncStatusTool(engine, ensureMeta))
      toolCtx.tools.register(makeSyncPullTool({ engine, ctx, confirmVia: resolved.confirmVia, eventGate, logger }))
      toolCtx.tools.register(makeSyncPushTool({ engine, ctx, confirmVia: resolved.confirmVia, eventGate, logger }))
    })
```

#### 缺口

- 缺两种跨设备方式的直接对照
  **影响**：无法量化接续效率
  **进一步探讨**：对比单向备份、普通同步目录与两台有独立追加的测试设备

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 推拉冲突如何保住双方，哪些文件仍可被删除？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

引擎共享串行 Git 队列。push 镜像并提交会话存储，普通推送因远端前移被拒时先拉取调和再试一次；其他错误立即报告，重试也可能失败。冲突逐路径读取 base/ours/theirs。单侧改动延用该侧，双侧追加或分歧时本地保持主路径，存在远端字节时另存 fork；本地删但远端变时 fork 保存远端，本地原路径仍删。提交合并后，从镜像向会话库恢复普通文件和 cwd 投影。镜像上已移除且本地仍等于上次恢复摘要的文件会被清理，已编辑的保留。fork 原文件不会按正常会话文件直接覆回；用户可按冲突提示在宿主继续。不要将回执中的 push 成功等同于另一设备已经读到全部。

#### 证据与依据

**依据 1 · 源码核查**：[lib/engine.mjs:57-74](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/engine.mjs#L57-L74)

串行队列与缺 remote 失败

<details>
<summary>查看原文（18行）</summary>

```text
  #schedule(fn) {
    return this.#deps.git.schedule(fn)
  }

  /** 失败包装：脱敏 → reportError → 结构化错误结果。 */
  #fail(error) {
    const message = redactText(messageOf(error))
    this.#deps.reportError(message)
    this.#deps.logger.warn(`sync failed: ${message}`)
    return { ok: false, error: message }
  }

  /** remote 未配置时响亮失败（状态类操作不拦）。 */
  #requireRemote() {
    if (this.#deps.remote === undefined || this.#deps.remote.trim() === '') {
      throw new Error('no sync remote configured — set config.remote (status/diff work without one)')
    }
  }
```

</details>

**依据 2 · 源码核查**：[lib/engine.mjs:175-210](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/engine.mjs#L175-L210)

镜像、拒绝处理和结构化回执

<details>
<summary>查看原文（36行）</summary>

```text
  push(opts = {}) {
    return this.#schedule(async () => {
      try {
        this.#requireRemote()
        // git 命令以 repoDir 为 cwd，首次操作前必须保证它存在（cwd 缺失时
        // spawn 静默失败，甚至伪装成 exit 0）。
        await fs.mkdir(this.#deps.repoDir, { recursive: true })
        await this.#deps.git.bootstrap()
        const mirror = await this.#mirrorAndCommit('dsh-session-sync: push snapshot')
        try {
          await this.#deps.git.push({ signal: opts.signal })
        } catch (error) {
          if (!(error instanceof SyncError && error.code === 'PUSH_REJECTED')) {
            throw error
          }
          // 远端领先：先拉取调和（保留双方），再重推一次。
          this.#deps.logger.info('push rejected (remote moved); pulling and reconciling before one retry')
          const pulled = await this.#pullInternal(opts)
          if (!pulled.ok) throw error
          await this.#deps.git.push({ signal: opts.signal })
        }
        const head = await this.#deps.git.headSha()
        this.#deps.reportMeta({ lastPushAt: Date.now(), lastPushHead: head, lastError: undefined })
        this.#deps.logger.info(`sync push ok: head ${head ?? ''} (${mirror.mirrored} mirrored, ${mirror.deleted} deleted)`)
        const diagnostics = this.#mirrorDiagnostics(mirror)
        return {
          ok: true,
          pushed: true,
          head,
          mirrored: mirror.mirrored,
          deleted: mirror.deleted.length,
          remote: sanitizeRemote(this.#deps.remote),
          skippedSymlinks: diagnostics.skippedSymlinks,
          skippedSymlinkPaths: diagnostics.skippedSymlinkPaths,
          warnings: diagnostics.warnings,
        }
```

</details>

**依据 3 · 源码核查**：[lib/merge.mjs:39-62](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/merge.mjs#L39-L62)

分类基于字节及前缀

<details>
<summary>查看原文（24行）</summary>

```text
export function classifyPath(base, ours, theirs) {
  const b = norm(base)
  const o = norm(ours)
  const t = norm(theirs)
  if (o !== undefined && t !== undefined && o.equals(t)) {
    return { kind: MERGE_KINDS.IDENTICAL, keepOurs: true, forkTheirs: false }
  }
  if (o === undefined && t === undefined) {
    return { kind: MERGE_KINDS.IDENTICAL, keepOurs: true, forkTheirs: false }
  }
  // 仅本地变：远端仍是基点内容。
  if (equalsOrBothMissing(t, b)) {
    return { kind: MERGE_KINDS.OURS_ONLY, keepOurs: true, forkTheirs: false }
  }
  // 仅远端变：本地仍是基点内容 → 采纳远端（本地无增量，非覆盖）。
  if (equalsOrBothMissing(o, b)) {
    return { kind: MERGE_KINDS.THEIRS_ONLY, keepOurs: false, forkTheirs: false }
  }
  // 双边纯追加：共同基点前缀 + 各自后缀 → 两边保留，远端转 fork 文件。
  if (isPrefix(b, o) && isPrefix(b, t)) {
    return { kind: MERGE_KINDS.APPEND_BOTH, keepOurs: true, forkTheirs: true }
  }
  // 真实分歧（重写/打包/单侧删除等）：同样两边保留 + 响亮报告。
  return { kind: MERGE_KINDS.DIVERGED, keepOurs: true, forkTheirs: true }
```

</details>

**依据 4 · 源码核查**：[lib/engine.mjs:325-376](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/engine.mjs#L325-L376)

从 Git stage 取实际内容并写 fork

<details>
<summary>查看原文（52行）</summary>

```text
  async #resolveConflicts() {
    try {
      const conflicts = await this.#deps.git.conflictedPaths()
      const entries = []
      for (const conflict of conflicts) {
        const [base, ours, theirs] = await Promise.all([
          this.#deps.git.readStageBlob('1', conflict.path),
          this.#deps.git.readStageBlob('2', conflict.path),
          this.#deps.git.readStageBlob('3', conflict.path),
        ])
        entries.push({ path: conflict.path, base, ours, theirs })
      }
      const { resolutions, summary } = planMerge(entries)
      /** 路径 → ours/theirs 字节；某侧缺失即该侧删除了该文件（git 不登记其 stage）。 */
      const sides = new Map(entries.map(entry => [entry.path, entry]))
      const forks = []
      const now = new Date()
      // 严格 14 位 UTC 戳（yyyyMMddHHmmss）：与 lib/encrypted.mjs 同口径剔除 ISO
      // 分隔符（`-`/`:`/`T`）后再截断。仅去掉 `-`/`:` 会留下 `T`，使
      // forkFileName 的 /^\d{14}$/ 失配并静默回退到纪元戳。
      const stamp = now.toISOString().replace(/[-:T]/gu, '').slice(0, 14)
      for (const resolution of resolutions) {
        const side = sides.get(resolution.path)
        const hasOurs = side?.ours !== undefined
        const hasTheirs = side?.theirs !== undefined
        const absolute = path.join(this.#deps.repoDir, ...resolution.path.split('/'))
        // `checkout --ours/--theirs` 对缺失的 stage 会失败（`does not have
        // our/their version`），因此每一侧都先看它在冲突里是否存在。
        if (resolution.adoptTheirs) {
          if (hasTheirs) await this.#deps.git.checkoutStage('theirs', resolution.path)
          else await fs.rm(absolute, { force: true })
          continue
        }
        if (resolution.forkTheirs && hasTheirs) {
          // 先取 theirs 工作树字节 → 写 fork 文件 → 再恢复 ours 侧。
          await this.#deps.git.checkoutStage('theirs', resolution.path)
          const content = await fs.readFile(absolute)
          const forkName = forkFileName(path.posix.basename(resolution.path), stamp, this.deviceShort)
          await fs.writeFile(path.join(path.dirname(absolute), forkName), content)
          // ours 缺失＝本地已删除：保留删除，远端内容只以 fork 文件存续。
          if (hasOurs) await this.#deps.git.checkoutStage('ours', resolution.path)
          else await fs.rm(absolute, { force: true })
          const forkRel = path.posix.join(path.posix.dirname(resolution.path), forkName)
          forks.push(forkRel)
          continue
        }
        // 远端已删除（theirs 缺失）：保留本地版本，分歧照常计入 summary.diverged。
        if (hasOurs) await this.#deps.git.checkoutStage('ours', resolution.path)
        else await fs.rm(absolute, { force: true })
      }
      await this.#deps.git.addAll()
      return { adopted: summary.adopted, appended: summary.appended, diverged: summary.diverged, forks }
```

</details>

**依据 5 · 源码核查**：[lib/engine.mjs:265-291](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/engine.mjs#L265-L291)

合并后进入恢复

<details>
<summary>查看原文（27行）</summary>

```text
    }
    // 先清掉 stat-dirty：宿主原子写暂存文件会让 git 误判工作树有未提交改动，
    // 从而在 merge 时走 autostash 并失败（#29）。
    await this.#deps.git.refreshIndex()
    const merged = await this.#deps.git.beginMerge(remoteHead)
    if (!merged.inProgress) {
      this.#deps.reportMeta({ lastPullAt: Date.now() })
      return { ok: true, pulled: false, forks: [], adopted: 0, appended: 0, diverged: 0 }
    }
    let result
    if (merged.conflicted) {
      result = await this.#resolveConflicts()
    } else {
      result = { adopted: 0, appended: 0, diverged: 0, forks: [] }
      await this.#deps.git.addAll()
    }
    const newHead = await this.#deps.git.commitMerge()
    const mirrorRoot = path.join(this.#deps.repoDir, MIRROR_DIR)
    const pruned = await pruneRestoredSessions({ repoDir: this.#deps.repoDir, mirrorRoot, sessionRoot: this.#deps.sessionRoot })
    const restored = await restoreSessionRoot({
      repoDir: this.#deps.repoDir,
      mirrorRoot,
      sessionRoot: this.#deps.sessionRoot,
      cwdMap: this.#deps.cwdMap ?? [],
    })
    const pullWarnings = []
    if (restored.cwdUnmapped > 0) {
```

</details>

**依据 6 · 源码核查**：[lib/mirror.mjs:399-426](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/mirror.mjs#L399-L426)

恢复副本的有条件清理

<details>
<summary>查看原文（28行）</summary>

```text
export async function pruneRestoredSessions(deps) {
  const state = await readRestoreState(deps.repoDir)
  if (state.size === 0) return { pruned: [], keptEdited: [] }
  const projectionState = deps.projectionState ?? await readProjectionState(deps.repoDir)
  const mirror = await mirrorRelSet(deps.mirrorRoot)
  const pruned = []
  const keptEdited = []
  for (const [rel, expected] of [...state]) {
    const canonicalRel = projectionState.byProjected.get(rel)?.canonicalRel ?? rel
    if (mirror.has(canonicalRel)) continue
    const target = path.join(deps.sessionRoot, ...rel.split('/'))
    try {
      const st = await fs.lstat(target)
      if (st.isSymbolicLink()) { state.delete(rel); continue }
      const content = await fs.readFile(target)
      if (hashContent(content) === expected) {
        await unlinkFile(target)
        pruned.push(rel)
      } else {
        keptEdited.push(rel)
      }
    } catch {
      // already gone
    }
    state.delete(rel)
  }
  await writeRestoreState(deps.repoDir, state)
  return { pruned, keptEdited }
```

</details>

**依据 7 · 源码核查**：[lib/mirror.mjs:461-496](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/mirror.mjs#L461-L496)

跨平台投影与 fork 排除

<details>
<summary>查看原文（36行）</summary>

```text
  for (const entry of entries) {
    if (!entry.isFile()) { skipped += 1; continue }
    const parent = entry.parentPath ?? entry.path ?? mirrorRoot
    const absolute = path.join(parent, entry.name)
    const rel = path.relative(mirrorRoot, absolute).split(path.sep).join('/')
    const basename = path.posix.basename(rel)
    if (forkRe.test(basename) || HOST_ARTIFACT_NAME_RE.test(basename)) { skipped += 1; continue }
    const content = await fs.readFile(absolute)
    const plan = planRestoreFile({
      content,
      mirrorRel: rel,
      cwdMap: deps.cwdMap ?? [],
      sessionRoot: deps.sessionRoot,
      platform: deps.platform,
    })
    if (plan.kind === 'skipped') {
      cwdProjectionSkipped += 1
      // 无法投影（如 id 与目录不符）：保持镜像原样落盘，绝不写坏布局。
    }
    if (plan.kind === 'mapped') cwdMapped += 1
    if (plan.kind === 'placeholder') cwdUnmapped += 1
    if (plan.entry !== undefined) {
      nextEntries.push(plan.entry)
      // 映射目标 / 占位目录必须真实存在，宿主才能 realpath 并把它归入 workspace
      // （失败不影响可读性：会话仍会以 ungrouped 出现在列表里）。
      await fs.mkdir(plan.entry.projectedCwd, { recursive: true }).catch(() => {})
    }
    nextRelSet.add(plan.rel)
    const target = path.join(deps.sessionRoot, ...plan.rel.split('/'))
    let existed = false
    try {
      const st = await fs.lstat(target)
      if (st.isSymbolicLink()) { skipped += 1; continue }
      existed = true
    } catch { /* target absent */ }
    const wrote = await writeIfDifferent(target, plan.content, deps.sessionRoot)
```

</details>

#### 缺口

- 对活跃宿主状态和本地文件同时变化未实测
  **影响**：不能将保留冲突字节推广到全部并发写入
  **进一步探讨**：在隔离设备制造双边追加、删除冲突并用 git 对照实际恢复字节

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪条路径需要确认，自动推送等到了什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、功能与机制

#### 完整回答

手动推拉命令在调用引擎前必须经过 confirmSync。用户提问服务需要明确选项，自由文本不给通过；审批服务要求宿主有 turnBoundary 投影且存在开放回合，没有回答者、投影或开放回合即阻止调用，因此轮次间命令适合用提问服务。状态、差异和日志不触发该门。配置打开自动拉取、定时拉取或回合结束推送时走另一条调用链，直接执行引擎。自动 push 尝试等待 sessions.flush，若宿主不支持、超时或报错，会警告并继续推当前磁盘快照。因此要靠下一设备看到最后一轮及状态来验证同步完整，回执成功只证明该次推送已完成。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:839-885](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L839-L885)

手动命令的门与写入路径

<details>
<summary>查看原文（47行）</summary>

```text
      }
      if (action === 'log') {
        const status = await engine.status()
        const lines = status.lastCommits.length > 0 ? status.lastCommits : ['(no commits yet)']
        return { kind: 'success', text: `sync: last commits in ${repoDir}:\n${lines.map(line => `  ${line}`).join('\n')}` }
      }
      // pull / push：覆盖性操作必须经确认门（无回答者失败关闭）。
      const summary = action === 'push'
        ? 'Local session files will be mirrored, committed, and pushed to the sync remote (never force-pushed).'
        : 'Remote session changes will be merged into the local mirror with keep-both semantics (local kept, remote preserved as fork files).'
      const verdict = await confirmSync({ ctx, confirmVia: resolved.confirmVia, action, summary }, agent, signal)
      if (!verdict.allowed) {
        const reason = verdict.reason ?? 'no confirmation answerer (fail closed)'
        logger.info(`sync ${action} denied (${verdict.channel}: ${reason})`)
        return { kind: 'error', text: `sync: cancelled: ${reason}` }
      }
      if (action === 'push') {
        const result = await engine.push({ signal })
        if (session !== null && session !== undefined) {
          maybeAppendSessionEvent(session, SESSION_EVENTS.PUSH, {
            sessionId: session.id,
            ok: result.ok,
            error: result.error,
            pushed: result.pushed,
            mirrored: result.mirrored,
            deleted: result.deleted,
            head: result.head,
          }, eventGate, warn)
        }
        return { kind: result.ok ? 'success' : 'error', text: renderPush(result) }
      }
      const result = await engine.pull({ signal })
      if (session !== null && session !== undefined) {
        maybeAppendSessionEvent(session, SESSION_EVENTS.PULL, {
          sessionId: session.id,
          ok: result.ok,
          error: result.error,
          pulled: result.pulled,
          merged: result.merged,
          adopted: result.adopted,
          appended: result.appended,
          diverged: result.diverged,
          forks: result.forks,
          head: result.head,
        }, eventGate, warn)
      }
      return { kind: result.ok ? 'success' : 'error', text: renderPull(result) }
```

</details>

**依据 2 · 源码核查**：[lib/gate.mjs:82-150](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/gate.mjs#L82-L150)

两种服务的失败关闭判据

<details>
<summary>查看原文（69行）</summary>

```text
export async function confirmSync(deps, agent, signal) {
  const channel = pickChannel(deps.confirmVia, deps.ctx)
  const question = deps.action === 'push'
    ? 'Push local session changes to the sync remote?'
    : 'Pull remote session changes into the sync mirror?'
  const approveLabel = deps.action === 'push' ? 'Push' : 'Pull'
  if (channel === CONFIRM_CHANNELS.USER_QUESTIONS) {
    const service = deps.ctx.get('userQuestions')
    if (service === undefined || typeof service.ask !== 'function') {
      return { allowed: false, channel, reason: 'no userQuestions answerer (fail closed)' }
    }
    try {
      const answer = await service.ask({
        questions: [{
          id: CONFIRM_QUESTION_ID,
          question,
          detail: deps.summary,
          options: [
            { label: approveLabel, description: deps.summary },
            { label: 'Cancel', description: 'Do nothing.' },
          ],
        }],
        agent,
        signal,
      })
      const item = answer?.answers?.find(entry => entry.id === CONFIRM_QUESTION_ID)
      const selected = Array.isArray(item?.selected) ? item.selected : []
      const custom = typeof item?.custom === 'string' && item.custom.length > 0 ? item.custom : undefined
      if (custom !== undefined) {
        return { allowed: false, channel, reason: 'free-text answer is not an approval' }
      }
      if (selected.includes(approveLabel)) return { allowed: true, channel }
      return { allowed: false, channel, reason: `user chose not to ${deps.action}` }
    } catch (error) {
      return { allowed: false, channel, reason: `userQuestions ask failed: ${error instanceof Error ? error.message : String(error)}` }
    }
  }
  if (channel === CONFIRM_CHANNELS.APPROVAL) {
    // 宿主的 approval.request 无开放轮次即抛（审计对必须包在 turn 内）；
    // /sync 命令运行于轮次之间，这里前置检测并给出可操作文案。
    // 取数走宿主 turnBoundary 投影：投影缺席即失败关闭并写明原因，绝不
    // 回退读已删的 session.events（那会让 approval 通道恒失败且原因不可见）。
    const openTurn = openTurnFromProjection(deps.ctx, agent?.session)
    if (openTurn === undefined) {
      return {
        allowed: false,
        channel,
        reason: 'turn state unavailable: the sessionProjections.turnBoundary projection is not composed (mount @deepseek-ai/dsh-session-projection) — approval cannot be verified, set confirmVia: userQuestions',
      }
    }
    if (!openTurn) {
      return {
        allowed: false,
        channel,
        reason: 'approval requires an open turn; /sync commands run between turns — mount userQuestions or set confirmVia: userQuestions',
      }
    }
    const service = deps.ctx.get('approval')
    if (service === undefined || typeof service.request !== 'function') {
      return { allowed: false, channel, reason: 'no approval answerer (fail closed)' }
    }
    try {
      const outcome = await service.request({ agent, toolName: deps.action === 'push' ? 'sync_push' : 'sync_pull', reason: deps.summary, signal })
      if (outcome === 'allowed-once') return { allowed: true, channel }
      return { allowed: false, channel, reason: `approval outcome ${JSON.stringify(outcome)}` }
    } catch (error) {
      return { allowed: false, channel, reason: `approval ask failed: ${error instanceof Error ? error.message : String(error)}` }
    }
  }
```

</details>

**依据 3 · 源码核查**：[index.mjs:902-963](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L902-L963)

自动任务、等待配置和后备行为

<details>
<summary>查看原文（62行）</summary>

```text
  // --- 自动模式（全部 effect：事件/定时随插件卸载自动撤销）。
  // 挂载时自动拉取（配置即授权；失败只记日志，绝不阻断启动）。
  if (resolved.autoPullOnStart) {
    ctx.effect(() => {
      void engine.pull().then(result => {
        if (!result.ok) warn(`auto pull failed: ${result.error ?? 'unknown error'}`)
      })
      return () => {}
    }, `${PLUGIN_NAME}.auto-pull-on-start`)
  }

  // turn/end 自动推送（配置即授权；每轮结束先等该会话落盘，再拉快照推送）。
  if (resolved.autoPushOnTurnEnd) {
    // #30：有些宿主（Android/proot 的 DSH Go）不发 session/event；把"监听器已
    // 注册"记进日志，让外部可判断的是宿主事件还是插件注册。
    logger.info(`auto push listener registered (session/event turn/end → push); pullIntervalMinutes=${resolved.pullIntervalMinutes}; durabilityTimeoutMs=${resolved.durabilityTimeoutMs}`)
    let durabilityUnsupportedWarned = false
    const autoPush = async (session) => {
      // 宿主的 JSONL 持久化对 live 事件有 200ms 批量写窗（见 lib/durability.mjs）：
      // 不等这层落盘屏障，镜像就会缺最后一条 turn/end —— 跨设备恢复会看到未闭合
      // 轮次。等待有上限且绝不抛出：超时/失败只记日志，照常推送当前盘上快照。
      const durability = await waitForSessionDurability(session, {
        sessions: ctx.sessions,
        timeoutMs: resolved.durabilityTimeoutMs,
      })
      if (durability.timedOut === true) {
        warn(`auto push: session ${session.id} was not durable within ${resolved.durabilityTimeoutMs}ms; mirroring the current on-disk snapshot`)
      } else if (durability.unsupported === true) {
        if (!durabilityUnsupportedWarned) {
          durabilityUnsupportedWarned = true
          warn('auto push: this host exposes no sessions.flush(); mirroring without a durability wait (host older than 0.2.2)')
        }
      } else if (durability.error !== undefined) {
        warn(`auto push: durability wait failed for session ${session.id}: ${durability.error}; mirroring the current on-disk snapshot`)
      }
      const result = await engine.push()
      maybeAppendSessionEvent(session, SESSION_EVENTS.PUSH, {
        sessionId: session.id,
        ok: result.ok,
        error: result.error,
        pushed: result.pushed,
        mirrored: result.mirrored,
        deleted: result.deleted,
        head: result.head,
      }, eventGate, warn)
      if (!result.ok) warn(`auto push failed: ${result.error ?? 'unknown error'}`)
    }
    ctx.on('session/event', (session, event) => {
      if (event.type !== 'turn/end') return
      void autoPush(session).catch(error => warn(`auto push failed: ${messageOf(error)}`))
    })
  }

  // 周期拉取（pullIntervalMinutes > 0 时；定时器随 fiber 自动撤销）。
  if (resolved.pullIntervalMinutes > 0) {
    ctx.effect(() => {
      const timer = setInterval(() => {
        void engine.pull().then(result => {
          if (!result.ok) warn(`periodic pull failed: ${result.error ?? 'unknown error'}`)
        })
      }, resolved.pullIntervalMinutes * 60_000)
      return () => clearInterval(timer)
```

</details>

#### 缺口

- 版本差异与超时后的实际写窗未验证
  **影响**：自动推成功可能未包含最新 turn/end
  **进一步探讨**：对相同测试会话注入延迟，读取远端末事件及恢复后的续聊状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置 encrypted 足以让远程历史保持密文吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

固定代码明确会降级。第一次探测 age、ageRecipient、ageIdentity，没装二进制或缺任何一项时 mode=plaintext，记录警告，并走已有明文引擎。缓存的探测结果也意味着修复设置后要重新验证生效。正常 encrypted 路径依靠 age 和用户维护的身份，远端 Git 元数据和路径仍可见，本地会话及镜像本来就是明文。摘要脱敏用于日志和远端展示，复制的会话文件包含实际历史，不会由此变脱敏材料。私有远端只能限制可见者，访问或备份策略仍需要由其拥有者验证。同步根应与项目目录区分，并根据源码检查路径收容及符号链接策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/backend.mjs:42-57](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/backend.mjs#L42-L57)

缺少 age 或配置确实选择 plaintext

<details>
<summary>查看原文（16行）</summary>

```text
export function selectEncryptionMode({ backend, ageAvailable, ageRecipient, ageIdentity }) {
  if (backend !== BACKENDS.ENCRYPTED) return { mode: BACKEND_MODES.PLAINTEXT, warnings: [] }
  const warnings = []
  if (ageAvailable !== true) {
    warnings.push('age binary not found (probed `age --version`); mirror content will be pushed unencrypted')
  } else {
    if (typeof ageRecipient !== 'string' || ageRecipient.trim() === '') {
      warnings.push('ageRecipient is empty; mirror content will be pushed unencrypted')
    }
    if (typeof ageIdentity !== 'string' || ageIdentity.trim() === '') {
      warnings.push('ageIdentity is empty; mirror content will be pushed unencrypted')
    }
  }
  const mode = warnings.length === 0 ? BACKEND_MODES.ENCRYPTED : BACKEND_MODES.PLAINTEXT
  return { mode, warnings }
}
```

</details>

**依据 2 · 源码核查**：[lib/encrypted.mjs:251-264](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/encrypted.mjs#L251-L264)

实例持有可回退的明文引擎

<details>
<summary>查看原文（14行）</summary>

```text
    this.#plain = new SyncEngine({
      git: deps.git,
      sessionRoot: deps.sessionRoot,
      repoDir: deps.repoDir,
      remote: deps.remote,
      branch: deps.branch,
      deviceId: deps.deviceId ?? 'pending',
      reportMeta: deps.reportMeta,
      reportError: deps.reportError,
      onForks: deps.onForks,
      logger: deps.logger,
      cwdMap: this.#cwdMap,
      followSessionSymlinks: this.#followSessionSymlinks,
    })
```

</details>

**依据 3 · 源码核查**：[lib/encrypted.mjs:278-300](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/encrypted.mjs#L278-L300)

惰性探测、缓存与警告

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * 惰性探测并解析传输模式（首次操作触发，结果缓存）。
   * @returns {Promise<{mode: string, warnings: string[]}>}
   */
  probeMode() {
    if (this.#ready === undefined) {
      this.#ready = (async () => {
        const ageBin = await detectAge(this.#run, this.#ageBin, { timeoutMs: this.#timeoutMs, cwd: this.#repoDir })
        const selection = selectEncryptionMode({
          backend: BACKENDS.ENCRYPTED,
          ageAvailable: ageBin !== null,
          ageRecipient: this.#recipient,
          ageIdentity: this.#identity,
        })
        this.#warnings = selection.warnings
        for (const warning of selection.warnings) {
          this.#logger.warn(`session-sync encrypted backend degraded: ${warning}`)
        }
        return selection
      })()
    }
    return this.#ready
  }
```

</details>

**依据 4 · 作者声明**：[README.md:259-272](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/README.md#L259-L272)

作者说明密文、元数据、本地和明文后备范围

<details>
<summary>查看原文（14行）</summary>

```text
## 加密与威胁模型

`backend: encrypted` 在镜像之上增加一层可选的 **age** 加密：会话字节在提交与推送前加密为 `encrypted/**/*.age` 文件，合并前再解密回本地明文镜像。三方合并始终在本地明文上进行，因此追加式保留双方语义不变。

加密**保护**什么：

- **远端中的镜像内容。** 你推送的会话文件是 age 密文；远端主机、其运维者以及任何克隆该仓库的人，没有私钥都看不到明文的会话字节。

加密**不**保护什么（边界）：

- **密钥与 age 身份由你管理。** 接收方/身份文件从不由插件随包分发、存储或轮换。密钥泄露会使它保护的镜像内容暴露。请使用无口令身份并把它放在仓库之外。
- **远端实际仍是私有仓库。** git 元数据——提交信息、`.gitignore`、`encrypted/` 路径结构、分支名与推拉活动——对远端主机依然可见。加密隐藏的是*内容*，不是你在同步这个事实，也不是会话树的形态。
- **明文仍存在于本地。** `<repoDir>/sessions/` 的镜像在磁盘上是明文；加密保护的是传输中/远端的那份，而非本地磁盘加密或正在使用的会话存储。
- **优雅降级意味着明文。** 使用 `backend: encrypted` 时，若 `age` 缺失，或 `ageRecipient`/`ageIdentity` 为空，插件会回退到明文 git 路径**并在状态/日志中显式告警**——它绝不假装已经加密。在把远端当作已加密之前，先检查 `/sync status` 中的告警。
```

</details>

**依据 5 · 源码核查**：[index.mjs:619-629](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L619-L629)

加载时检查根目录嵌套

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx, config = {}) {
  const resolved = resolveConfig(config)
  if (resolved.enabled === false) return

  const logger = ctx.logger(PLUGIN_NAME)
  const warn = (message) => logger.warn(message)
  const eventGate = makeEventGate(KNOWN_SESSION_EVENT_TYPES, probeIgnorableAppend())

  const sessionRoot = resolveSessionRoot(resolved.sessionRoot)
  const repoDir = resolveRepoDir(resolved.repoDir)
  assertNestingSafe(sessionRoot, repoDir)
```

</details>

#### 缺口

- 未审核目标部署的 Git 历史、远端 ACL 或密钥管理
  **影响**：不能将配置等同于当前历史没有明文
  **进一步探讨**：在无敏感内容的私有镜像试验缺 age 与密钥缺失，直接核对每个提交的树

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样测试采用、退出和更严格的推送回执？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

当前宜观察需要迁移 DSH 对话且能管控两台设备与私有远端的人群。建议先只对两台隔离环境的一段虚构会话做手动试验。首次要设好专用仓库、依赖、确认服务和跨平台 cwd。持续有每次镜像和 Git 对象的盘占、传输与归并成本，人工要读分歧、确认接收侧可打开。退出可以停用同步配置、保留现有备份；已发布 Git 历史仍需按仓库策略处理。按一次能完整继续原任务的会话交接核算，成本、机器资源和时间分开。可检验一个增强协议，让 push 在加密必选策略缺依赖或宿主持久化尚未完成时停在本地，向用户提供重试和区分明文、密文、落盘状态的回执。对照当前警告后继续的行为，模拟 missing age、超时和双端分歧；如果现有状态已足以让操作者正确停手，或门控导致大量完整合法任务被阻断且无法重试，放弃该方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:148-182](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/README.md#L148-L182)

依赖、人工和自动配置

<details>
<summary>查看原文（35行）</summary>

```text
| 键 | 默认值 | 含义 |
|---|---|---|
| `remote` | `''` | 远端地址（pull/push 前必须非空；status/diff 无需） |
| `backend` | `git` | 同步后端：`git`（明文镜像）或 `encrypted`（age 加密镜像内容） |
| `sessionRoot` | `''` | 会话存储根；空 = `$DSH_HOME/sessions`（两者皆缺加载失败） |
| `repoDir` | `''` | 同步工作树根；空 = `$DSH_HOME/dsh-session-sync/repo` |
| `branch` | `main` | 远端分支名 |
| `autoPushOnTurnEnd` | `false` | 每个关闭轮次后推送 |
| `pullIntervalMinutes` | `0` | 每 N 分钟周期拉取（`0` = 关闭，最大 `10080`） |
| `cwdMap` | `[]` | 恢复期 cwd 投影表 `[{from, to}]`（最长前缀优先；未命中的跨平台 cwd 归一到 `<sessionRoot>/--unmapped--`，只读） |
| `followSessionSymlinks` | `false` | 是否跟随 realpath 仍在 `sessionRoot` 内的符号链接（Android/proot 诊断） |
| `confirmVia` | `auto` | 确认通道：`auto`（优先 userQuestions，其次 approval）、`userQuestions`、`approval` |

<details>
<summary>完整配置表（24 个键）</summary>

| 键 | 默认值 | 含义 |
|---|---|---|
| `enabled` | `true` | 总开关；`false` 卸载命令、工具、监听器与自动模式 |
| `backend` | `git` | 同步后端：`git`（明文镜像）或 `encrypted`（age 加密镜像内容） |
| `sessionRoot` | `''` | 会话存储根；空 = `$DSH_HOME/sessions`（两者皆缺加载失败） |
| `repoDir` | `''` | 同步工作树根；空 = `$DSH_HOME/dsh-session-sync/repo` |
| `remote` | `''` | 远端地址（pull/push 前必须非空；status/diff 无需） |
| `branch` | `main` | 远端分支名 |
| `gitBin` | `git` | git 可执行路径 |
| `ageBin` | `age` | age 可执行路径（`backend: encrypted` 时探测；缺失降级明文） |
| `ageRecipient` | `''` | age 收件人（公钥/身份串）；空 = 无法加密、降级明文 |
| `ageIdentity` | `''` | 无口令 age 私钥文件路径（用于解密）；空 = 无法解密、降级明文 |
| `autoPullOnStart` | `false` | 插件挂载时拉取一次（配置即授权，不再确认） |
| `autoPushOnTurnEnd` | `false` | 每个关闭轮次后推送 |
| `durabilityTimeoutMs` | `2000` | 自动推送前等待该会话落盘的上限：宿主 JSONL 对 live 事件有 200ms 批量写窗，这里调用公开的 `ctx.sessions.flush` 落盘屏障；超时只记日志并照常推送；`0` = 不等待 |
| `pullIntervalMinutes` | `0` | 每 N 分钟周期拉取（`0` = 关闭，最大 `10080`） |
| `cwdMap` | `[]` | 恢复期 cwd 投影表 `[{from, to}]`（最长前缀优先；未命中的跨平台 cwd 归一到 `<sessionRoot>/--unmapped--`，只读） |
| `followSessionSymlinks` | `false` | 是否跟随 realpath 仍在 `sessionRoot` 内的符号链接（Android/proot 诊断） |
| `confirmVia` | `auto` | 确认通道：`auto`（优先 userQuestions，其次 approval）、`userQuestions`、`approval` |
```

</details>

**依据 2 · 源码核查**：[lib/backend.mjs:42-57](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/backend.mjs#L42-L57)

可转为硬失败的条件

<details>
<summary>查看原文（16行）</summary>

```text
export function selectEncryptionMode({ backend, ageAvailable, ageRecipient, ageIdentity }) {
  if (backend !== BACKENDS.ENCRYPTED) return { mode: BACKEND_MODES.PLAINTEXT, warnings: [] }
  const warnings = []
  if (ageAvailable !== true) {
    warnings.push('age binary not found (probed `age --version`); mirror content will be pushed unencrypted')
  } else {
    if (typeof ageRecipient !== 'string' || ageRecipient.trim() === '') {
      warnings.push('ageRecipient is empty; mirror content will be pushed unencrypted')
    }
    if (typeof ageIdentity !== 'string' || ageIdentity.trim() === '') {
      warnings.push('ageIdentity is empty; mirror content will be pushed unencrypted')
    }
  }
  const mode = warnings.length === 0 ? BACKEND_MODES.ENCRYPTED : BACKEND_MODES.PLAINTEXT
  return { mode, warnings }
}
```

</details>

**依据 3 · 源码核查**：[index.mjs:919-951](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/index.mjs#L919-L951)

需要复核 durability 警告和之后推送

<details>
<summary>查看原文（33行）</summary>

```text
    const autoPush = async (session) => {
      // 宿主的 JSONL 持久化对 live 事件有 200ms 批量写窗（见 lib/durability.mjs）：
      // 不等这层落盘屏障，镜像就会缺最后一条 turn/end —— 跨设备恢复会看到未闭合
      // 轮次。等待有上限且绝不抛出：超时/失败只记日志，照常推送当前盘上快照。
      const durability = await waitForSessionDurability(session, {
        sessions: ctx.sessions,
        timeoutMs: resolved.durabilityTimeoutMs,
      })
      if (durability.timedOut === true) {
        warn(`auto push: session ${session.id} was not durable within ${resolved.durabilityTimeoutMs}ms; mirroring the current on-disk snapshot`)
      } else if (durability.unsupported === true) {
        if (!durabilityUnsupportedWarned) {
          durabilityUnsupportedWarned = true
          warn('auto push: this host exposes no sessions.flush(); mirroring without a durability wait (host older than 0.2.2)')
        }
      } else if (durability.error !== undefined) {
        warn(`auto push: durability wait failed for session ${session.id}: ${durability.error}; mirroring the current on-disk snapshot`)
      }
      const result = await engine.push()
      maybeAppendSessionEvent(session, SESSION_EVENTS.PUSH, {
        sessionId: session.id,
        ok: result.ok,
        error: result.error,
        pushed: result.pushed,
        mirrored: result.mirrored,
        deleted: result.deleted,
        head: result.head,
      }, eventGate, warn)
      if (!result.ok) warn(`auto push failed: ${result.error ?? 'unknown error'}`)
    }
    ctx.on('session/event', (session, event) => {
      if (event.type !== 'turn/end') return
      void autoPush(session).catch(error => warn(`auto push failed: ${messageOf(error)}`))
```

</details>

**依据 4 · 源码核查**：[lib/engine.mjs:196-209](https://github.com/PerryLink/dsh-session-sync/blob/0920f12c6b4ccd752fc1c4d91abccbc0f04cacdd/lib/engine.mjs#L196-L209)

推送回执结构

<details>
<summary>查看原文（14行）</summary>

```text
        const head = await this.#deps.git.headSha()
        this.#deps.reportMeta({ lastPushAt: Date.now(), lastPushHead: head, lastError: undefined })
        this.#deps.logger.info(`sync push ok: head ${head ?? ''} (${mirror.mirrored} mirrored, ${mirror.deleted} deleted)`)
        const diagnostics = this.#mirrorDiagnostics(mirror)
        return {
          ok: true,
          pushed: true,
          head,
          mirrored: mirror.mirrored,
          deleted: mirror.deleted.length,
          remote: sanitizeRemote(this.#deps.remote),
          skippedSymlinks: diagnostics.skippedSymlinks,
          skippedSymlinkPaths: diagnostics.skippedSymlinkPaths,
          warnings: diagnostics.warnings,
```

</details>

#### 缺口

- 没有测设备数、会话大小、费用与确认成本
  **影响**：无法证明自动化节约或改版更好
  **进一步探讨**：对照两套回执，记录完整会话、误明文上传、排障时间和重试成功率

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
