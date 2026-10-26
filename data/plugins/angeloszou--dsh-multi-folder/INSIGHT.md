# dsh-multi-folder

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[445a803](https://github.com/AngelosZou/dsh-multi-folder/tree/445a803cdfdb917ab6d46b09aaf700be36bbf186)

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder) [![npm 30d 2,056](https://img.shields.io/static/v1?label=npm+30d&message=2%2C056&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-multi-folder) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-multi-folder)
<!-- END META -->

> **实现功能**：为DSH项目配置副工作目录，保持主cwd并将原文件和shell工具按单次目标重定根，附UI与@发现。

> **核心亮点**：不改主cwd、不加模型工具，通过原工具重定根、后台jobs适配和副根@发现提供跨仓流程。详见[Q01](#research-q01)。

> **风险与缺陷**：有损workspace文件名可碰撞，保存失败内存仍生效；用户专管及native-only宣称还依宿主认证/根布局和缺服务降级条件。详见[Q03](#research-q03)。

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
  - [Q01 · 跨目录能力解决什么任务，交付物是什么？](#detail-section-11)
  - [Q02 · 模式保持、前后台执行与错误所有权如何实现？](#detail-section-12)
  - [Q03 · 配置身份、保存与通知有哪些边界？](#detail-section-13)
  - [Q04 · “用户专管”RPC、配置守卫与原生UI降级是何种保证？](#detail-section-14)
  - [Q05 · @发现和工程测试支持哪些结论？](#detail-section-15)
  - [Q06 · 启动、持续工作与失败恢复成本如何核算？](#detail-section-16)
  - [Q07 · 推荐与未来方案从哪里推导？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向源码、测试和文档分布多个仓的DSH用户，保持主cwd并把每次原生写/执行定向一个受权副根，最终仍逐仓验收真实变更。

切会话/cwd、复制文件或手工临时授权是直接替代。比较相同跨仓变更的上下文重述、错根与回退成本；本插件不提供跨仓提交原子性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| write/edit/bash/pwsh拦截 | 副根内原工具执行 | standing模式不改，每命令一个写根 |
| UI/用户命令 | 维护副目录 | 真实授权改变，身份键非无损 |
| sessionless RPC/host浏览 | 创建前配置和目录交互 | 信任宿主认证，不受Agent沙箱限 |
| @发现/notice | 发现文件及提示变化 | 索引有限，通知仅已arm会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node20+、DSH fs/sandboxPolicy | 核心必需 | 解析与执行原策略 | 沙箱强制性依OS runner |
| shell/shellEnv/jobs | 对应执行必需 | 前后台命令及取消 | ABI需固定，不由方法存在保证未来兼容 |
| commands与Web/Typert | 配置入口按需 | 用户选择与sessionless管理 | 依宿主访问身份 |
| 可写配置存储 | 必需 | 每workspace副根列表 | 有损键/先内存后保存需核 |
| inputTrigger和文件读取 | @发现可选 | 副根索引 | 不改变读权限，索引不全需手查 |
| 本地native UI能力 | picker按需 | 打开系统对话框 | 缺服务fallback仍需可信本地条件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核项目 | 用户备份配置与各仓 | 路径身份无碰撞，store不在可写根 |
| 选副根 | 用户通过可信UI/命令明确授权 | 配置磁盘与内存一致 |
| 单根操作 | Agent设绝对workdir/file | primary走默认、副根仅当次重根 |
| 后台任务 | 用户核job和输出契约 | cwd明确，取消与副作用分别验 |
| 验收/退出 | 用户逐仓检查并移除副根 | 不宣称跨仓事务，失败先核现场 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node>=20、DSH base/Web与fs/sandboxPolicy；本地配置空间 | 核ABI、选择受权目录、备份配置并明确各仓写入根，工时未知 | 首次开启扩大可写范围，不能把选择目录当普通只读导航 |
| 持续使用 | fs/shell/jobs执行资源、@索引最多2万entry与4秒TTL缓存 | 每个命令正确设绝对workdir，跨仓工作拆分/审阅，耗时未知 | 不增加独立模型服务；原宿主Agent费用沿原模型，净节时未知 |
| 失败恢复 | 原配置/各仓Git备份与后台job管理资源 | 核错根/失败保存/旧缓存，逐仓撤销变更、清理job并重配 | 本插件无跨仓事务/统一回滚，配置失败可能内存先变；金额工时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同会话多仓执行 | 原工具按单次副根执行 | 固定OS/宿主强制性及实际任务收益 |
| 配置与发现 | UI/命令/JSON/@组合 | 身份碰撞/并发和旧UI响应 |
| 模式与后台 | standing模式拷贝、jobs取消适配 | 任意未来ABI与跨仓一致恢复 |

> **思考**：有损workspace文件名可碰撞，保存失败内存仍生效；用户专管及native-only宣称还依宿主认证/根布局和缺服务降级条件。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：不改主cwd、不加模型工具，通过原工具重定根、后台jobs适配和副根@发现提供跨仓流程。详见[Q01](#research-q01)。

不改主cwd、不加模型工具，通过原工具重定根、后台jobs适配和副根@发现提供跨仓流程。详见[Q01](#research-q01)。

primary优先返回默认管线与完整结果schema避免不必要扩根及执行后假失败，后台取消/错误所有权也有价值；路径键与配置发布顺序仍需修复。[Q02](#research-q02)、[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

有损workspace文件名可碰撞，保存失败内存仍生效；用户专管及native-only宣称还依宿主认证/根布局和缺服务降级条件。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，继续从无碰撞稳定身份、store不落Agent写根及明确UI能力约束着手。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

模式保持与跨根执行增量可核；workspace身份/保存与host信任有具体缺口；授权凭据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SECURITY.md、lib/index.js、lib/client.js、lib/native-picker.ps1、test/intercept.mjs、test/smoke-host.mjs、test/smoke-client.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：1703行host中配置、RPC/目录浏览/OS交互、索引、notice、fs/shell/job拦截完整关键链；1629行client的RPC/picker/session/@链和mock测试代表边界。未执行目标/宿主/测试。
- 下一步：按 [Q07](#research-q07) 的路径碰撞、保存失败、祖先根和旧请求后到反例检查版本授权凭据原型，另核primary操作不会借secondary祖先扩根以及结果符合宿主schema。

**分析版本**

- **仓库**：[AngelosZou/dsh-multi-folder](https://github.com/AngelosZou/dsh-multi-folder)
- **版本号**：0.3.4（[固定提交 445a803](https://github.com/AngelosZou/dsh-multi-folder/tree/445a803cdfdb917ab6d46b09aaf700be36bbf186)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

稳定workspace身份和有revision的目录授权凭据，CAS保存后广播并约束host UI能力；以碰撞/失败/远程/链接反例证伪，未验证。详见[Q07](#research-q07)。

按 [Q07](#research-q07) 的路径碰撞、保存失败、祖先根和旧请求后到反例检查版本授权凭据原型，另核primary操作不会借secondary祖先扩根以及结果符合宿主schema。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1320 | — | — | 12171 |
| .js | source | 2 | 3356 | 2442 | 777 | — |
| .mjs | test | 3 | 2398 | 1911 | 339 | — |

</details>

**活跃度**

[![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-multi-folder/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多目录执行增量能否在保持模式时保持配置身份与用户授权边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨目录能力解决什么任务，交付物是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向源码、测试、文档在不同仓的用户，希望一个DSH会话保持主cwd不动，又能对明确选择的副目录执行原生write/edit/bash/pwsh。不新增模型工具，复用宿主执行管线、用户命令和UI，且配合独立@候选来源。参照切会话/切cwd、手工宽松授权或复制文件，本项将每次操作定向副目录，模式本身沿站立策略，减少重新解释项目上下文和接线。

不能理解为一次shell拥有多个写根。单次workdir命中的最长副根成为唯一workspaceRoot；primary下运行git -C/cd不扩大写根，secondary下也不能同次写另一个仓。合格交付是选定目录可在原模式下完成目标修改、原cwd/模式和原工具外观保留，用户能确认各仓变更；不是跨仓一致性事务或全目录无条件写。业务交付仍是原代码/文档变更，新增的是可配置多仓执行及发现工作流，不是新的任务验收。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:13-24](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/README.md#L13-L24)

作者范围与无新工具。

<details>
<summary>查看原文（12行）</summary>

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin bundle that gives one project (workspace) a set of **secondary working directories**:

- The agent's core `cwd` and every other core attribute keep pointing at the **primary workspace**.
- Under **Workspace Write** mode the agent gains the **same read / write / edit / execute permissions** on the configured secondary directories as on the primary workspace — enforced by re-rooting the session's own sandbox policy, so every mode keeps its semantics (`read-only` still denies, `workspace-write` allows, `danger-full-access` allows).
- The directory list is **injected into the system prompt** and re-rendered per session assembly.
- Configuration changes notify the agent through a **non-interrupting message queue** — delivered at the next message boundary (user send or tool-call end), and **only when the directory set actually changed**.
- Configurable **before the session starts**: the session-creation page (new-session screen) offers a Multi-folder entry that reads and edits the same per-workspace configuration through a **sessionless remote API** (`multiFolder/*` endpoints) — no session id required.
- The **`@` file menu finds files in the configured directories**. The shipped `@` menu only ever searches the primary workspace, so this plugin contributes its own `@` group listing the secondary directories — headed by each directory.
- **No new tools.** Everything is a framework-level change (tool-pipeline interception) plus a UI-level change (a session-scoped header entry).

## Requirements

```

</details>

**依据 2 · 源码核查**：[README.md:87-91](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/README.md#L87-L91)

单命令单根限制。

```text
Each confined command runs under **exactly ONE writable root** — the workspace root the call is re-rooted to (the Windows ACL runner grants a single workspace write SID per process tree). Consequences:

- A command whose cwd stays the **primary workspace cannot create files inside a secondary directory**. `git -C <secondary> commit`, `cd <secondary>` inside a script, `git clone <url> <secondary>`, or absolute-path writes all fail with an OS-level `Permission denied` (e.g. `fatal: Unable to create '.../.git/index.lock': Permission denied`).
- Symmetrically, a command re-rooted to a secondary directory cannot write to the **primary workspace** (or another secondary directory) in the same invocation.
- **Rule for file-creating commands: set `workdir` to the directory the command writes into**, and pass it as an **absolute** path — a relative `workdir` is resolved against the primary workspace, and changing the process directory inside the command (`Set-Location` / `cd`) does not widen the writable root (the write then fails with an OS-level denial, Windows error 5). For git, run the command from inside the repository (pass `workdir` pointing at it) instead of using `git -C` from the primary workspace. The rule applies to `run_in_background: true` runs exactly as to foreground ones.
```

**依据 3 · 源码核查**：[lib/index.js:1456-1502](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1456-L1502)

write/edit策略。

<details>
<summary>查看原文（47行）</summary>

```text
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }

        if (exec.name === 'write') {
          owned = { policy }
          const outcome = await fs.writeText(target, String(args.content), undefined, exec.signal, policy)
          // Keep the observation layer coherent with the shipped write tool's
          // contract: a successful create/update is a presence observation.
          if (typeof ctx.emit === 'function') {
            ctx.emit('fs/observed', target, { kind: 'present', version: outcome.version }, exec)
          }
          const displayPath = displayPathOf(target, filePath)
          const value = {
            path: displayPath,
            operation: outcome.operation === 'create' ? 'create' : 'update',
            before: outcome.before === undefined || outcome.before === null ? null : outcome.before,
            after: outcome.after === undefined ? null : outcome.after,
          }
          const content = [{
            type: 'text',
            text:
              '<path>' + displayPath + '</path>\n<type>file</type>\n<content>\n' +
              (outcome.operation === 'create' ? 'Created' : 'Updated') +
              ' file\n</content>',
          }]
          return { isError: false, value, content }
        }

        const oldString = args && typeof args.old_string === 'string' ? args.old_string : null
        const newString = args && typeof args.new_string === 'string' ? args.new_string : null
        if (oldString === null || newString === null) return next()
        const replaceAll = args.replace_all === true
        owned = { policy }
        const outcome = await fs.editText(
          target,
          { oldString, newString, replaceAll },
          undefined,
          exec.signal,
          policy,
        )
        if (typeof ctx.emit === 'function') {
          ctx.emit('fs/observed', target, { kind: 'present', version: outcome.version }, exec)
        }
        const displayPath = displayPathOf(target, filePath)
        const value = { path: displayPath, before: outcome.before, after: outcome.after }
        const text = replaceAll
          ? 'The file ' + displayPath + ' has been updated. All occurrences were successfully replaced.'
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1510-1545](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1510-L1545)

shell工作根。

<details>
<summary>查看原文（36行）</summary>

```text
        const modernShell = shellUsesExecute(shell)
        if (dirs === null) return next()
        const rawWorkdir = args && typeof args.workdir === 'string' ? args.workdir : null
        const joined = rawWorkdir === null
          ? String(primary)
          : isAbsolute(rawWorkdir)
            ? rawWorkdir
            : String(primary).replace(/[\\/]+$/, '') + '/' + rawWorkdir
        // Canonicalize before containment matching, then run in the canonical
        // directory so confinement root and process cwd agree exactly.
        const workdirTarget = await fs.resolve(joined, { cwd: primary })
        const absWorkdir = fs.processPath(workdirTarget)
        // Same boundary as write/edit: a workdir inside the PRIMARY workspace
        // belongs to the default pipeline. Without this, a secondary directory
        // configured at an ANCESTOR of the workspace captures every ordinary
        // shell call (the default workdir is the primary workspace) and re-roots
        // its policy at that ancestor.
        if (typeof primary === 'string' && primary.length > 0 && pathInside(absWorkdir, primary)) return next()
        const hit = longestRootFirst(dirs).find((d) => pathInside(absWorkdir, d))
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }
        const shellEnv = ctx.get('shellEnv')
        const request = {
          command: String(args.command),
          workdir: absWorkdir,
          ...(args && args.timeoutMs !== undefined ? { timeoutMs: args.timeoutMs } : {}),
          ...(shellEnv !== undefined ? { dshEnv: shellEnv.collect(exec) } : {}),
          sandboxPolicy: policy,
        }

        // Background runs get the SAME re-rooted policy as foreground runs.
        // They register with the generic jobs runtime (`ctx.jobs`) exactly
        // like the shipped pwsh/bash tools do, so `job_output` / `job_kill`
        // and the finish notice keep working for the intercepted job.
        if (args && args.run_in_background === true) {
          // An aborted call belongs to the default pipeline, which raises the
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模式保持、前后台执行与错误所有权如何实现？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

tools/execute先await loadDirs防首调未水合，再只拦write/edit/pwsh/bash；先用fs.resolve/processPath核实际目标，最长根匹配后拷贝standing仅改workspaceRoot。write/edit直接调用宿主fs接口并发fs/observed，shell用宿主resolve/execute或旧run/start，收集shellEnv并传策略。非空sandbox_permissions交回原管线审批，匹配后拥有的失败则保原FS code/错误而非回落造成假primary拒绝。此处模式保持在代码上可核，OS强制性仍依宿主fs/sandbox执行器，不能从拷贝对象单独证明沙箱隔离。

后台通过jobs注册，现代execute分支owner为agent.id、旧接口为Agent，launch preparation在异步done里等待，job独立AbortController，cancel可在handle前后生效。现代后台onExpiry=none明确不继承前台deadline，stdout消费保留spill/loss和runner失败标记；不是给后台任务统一时间预算。前台传播exec.signal并投影结构化结果，shellRender只简化stdout/stderr/非零与denied，不同字段详尽程度依原工具和ABI。shellUsesExecute用单方法存在推定同时代jobs owner契约，是兼容性假设而非所有未来版本都成立。

当前明确把primary内部目标/工作目录交回默认管线，再匹配secondary；若副目录是primary祖先，不会借它重根普通primary操作。这是最小必要根的实质保护，不能继续把所有命中祖先的主目录操作视为扩根。后台结果带cwd，前台结果带cwd与数值timeoutMs，避免动作已执行却被宿主output schema拒绝并诱发重试；缺timeout回0只表示未报告，不证明实际无时限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1363-1439](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1363-L1439)

水合/拦截/显式升级。

<details>
<summary>查看原文（77行）</summary>

```text
      code === 'FS_SANDBOX_DENIED'
        ? '[sandbox: file access denied under ' + policy.mode + ' mode]\n' +
          '[sandbox: escalation available \u2014 retry this exact operation once with sandbox_permissions ' +
          '(the narrowest wider mode that suffices) + justification; the approval prompt asks the user]'
        : String(error && error.message ? error.message : error)
    return {
      isError: true,
      error: { message, ...(code === undefined ? {} : { info: { code } }) },
      content: [{ type: 'text', text: 'Error: ' + message }],
    }
  }

  ctx.on('tools/execute', async (exec, next) => {
    // Hydration must be AWAITED on the interception path, not fire-and-forget:
    // a first call that arrives before the config read resolves would see an
    // empty dirs cache, fall through to the default pipeline, and be fenced
    // against the PRIMARY workspace root — surfacing as a spurious
    // `[sandbox: file access denied under workspace-write mode]` for a
    // secondary-directory write/edit. `loadDirs` caches, so only the first
    // call pays the read.
    const headerCwd =
      exec.agent && exec.agent.session && exec.agent.session.header
        ? exec.agent.session.header.cwd
        : undefined
    if (typeof headerCwd === 'string' && headerCwd.length > 0) {
      await loadDirs(headerCwd)
    }
    if (!INTERCEPT_TOOLS.has(exec.name)) return next()
    // Non-null once the call's target has been resolved into a configured
    // secondary directory: from that point the interception OWNS the call and a
    // failure must be reported as this call's error, never handed back to the
    // default pipeline (which fences against the PRIMARY workspace root and
    // would answer any failure with the spurious workspace-write denial).
    let owned = null
    try {
      const args = exec.arguments
      const standing = sandboxPolicy.resolve(exec.agent ? { session: exec.agent.session } : {})
      const primary = standing.workspaceRoot
      // An explicit escalation request belongs to the default pipeline (it owns
      // the approval flow). Only a non-empty mode string is a request: a
      // null/empty value is not, and must not hand a secondary-directory
      // mutation to the primary-rooted pipeline.
      if (args && typeof args.sandbox_permissions === 'string' && args.sandbox_permissions.length > 0) return next()
      // The policy root is realpath-canonicalized by sandbox-policy while
      // hydration is keyed by the session cwd as spelled in the header; on a
      // workspace reached through a symlinked/junctioned ancestor the two
      // spellings differ, so consult both keys before falling through.
      const dirs =
        dirsForSync(primary) ??
        (typeof headerCwd === 'string' && headerCwd.length > 0 ? dirsForSync(headerCwd) : null)

      if (exec.name === 'write' || exec.name === 'edit') {
        const filePath = args && typeof args.file_path === 'string' ? args.file_path : null
        if (filePath === null) return next()
        // Resolve first so `..`, symlinks, and case differences canonicalize
        // before containment matching (same cwd the shipped tools use).
        let target
        try {
          target = await fs.resolve(filePath, { cwd: primary })
        } catch (error) {
          // An unresolvable ABSOLUTE path that is lexically inside a secondary
          // directory is still this plugin's call to answer: the default pipeline
          // would resolve it against the PRIMARY root and report the sandbox
          // denial, hiding the resolution failure.
          if (dirs !== null && isAbsolute(filePath)) {
            const rawHit = longestRootFirst(dirs).find((d) => pathInside(filePath, d))
            if (rawHit !== undefined) return ownedFailure(error, { ...standing, workspaceRoot: rawHit })
          }
          return next()
        }
        const abs = fs.processPath(target)
        // Security boundary: configuration is user-managed. Reject direct
        // write/edit attempts against the host-owned config file, even before
        // any directory matching. Both spellings of the workspace key are
        // checked (see the dirs lookup above).
        const guardHits = new Set(
          [primary, headerCwd].filter((p) => typeof p === 'string' && p.length > 0).map((p) => wsKey(configPathFor(p))),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1456-1504](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1456-L1504)

fs调用和观察。

<details>
<summary>查看原文（49行）</summary>

```text
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }

        if (exec.name === 'write') {
          owned = { policy }
          const outcome = await fs.writeText(target, String(args.content), undefined, exec.signal, policy)
          // Keep the observation layer coherent with the shipped write tool's
          // contract: a successful create/update is a presence observation.
          if (typeof ctx.emit === 'function') {
            ctx.emit('fs/observed', target, { kind: 'present', version: outcome.version }, exec)
          }
          const displayPath = displayPathOf(target, filePath)
          const value = {
            path: displayPath,
            operation: outcome.operation === 'create' ? 'create' : 'update',
            before: outcome.before === undefined || outcome.before === null ? null : outcome.before,
            after: outcome.after === undefined ? null : outcome.after,
          }
          const content = [{
            type: 'text',
            text:
              '<path>' + displayPath + '</path>\n<type>file</type>\n<content>\n' +
              (outcome.operation === 'create' ? 'Created' : 'Updated') +
              ' file\n</content>',
          }]
          return { isError: false, value, content }
        }

        const oldString = args && typeof args.old_string === 'string' ? args.old_string : null
        const newString = args && typeof args.new_string === 'string' ? args.new_string : null
        if (oldString === null || newString === null) return next()
        const replaceAll = args.replace_all === true
        owned = { policy }
        const outcome = await fs.editText(
          target,
          { oldString, newString, replaceAll },
          undefined,
          exec.signal,
          policy,
        )
        if (typeof ctx.emit === 'function') {
          ctx.emit('fs/observed', target, { kind: 'present', version: outcome.version }, exec)
        }
        const displayPath = displayPathOf(target, filePath)
        const value = { path: displayPath, before: outcome.before, after: outcome.after }
        const text = replaceAll
          ? 'The file ' + displayPath + ' has been updated. All occurrences were successfully replaced.'
          : 'The file ' + displayPath + ' has been updated successfully.'
        return { isError: false, value, content: [{ type: 'text', text }] }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1506-1645](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1506-L1645)

前后台壳与结果。

<details>
<summary>查看原文（140行）</summary>

```text

      if (exec.name === 'pwsh' || exec.name === 'bash') {
        const shell = ctx.get('shell')
        if (shell === undefined) return next()
        const modernShell = shellUsesExecute(shell)
        if (dirs === null) return next()
        const rawWorkdir = args && typeof args.workdir === 'string' ? args.workdir : null
        const joined = rawWorkdir === null
          ? String(primary)
          : isAbsolute(rawWorkdir)
            ? rawWorkdir
            : String(primary).replace(/[\\/]+$/, '') + '/' + rawWorkdir
        // Canonicalize before containment matching, then run in the canonical
        // directory so confinement root and process cwd agree exactly.
        const workdirTarget = await fs.resolve(joined, { cwd: primary })
        const absWorkdir = fs.processPath(workdirTarget)
        // Same boundary as write/edit: a workdir inside the PRIMARY workspace
        // belongs to the default pipeline. Without this, a secondary directory
        // configured at an ANCESTOR of the workspace captures every ordinary
        // shell call (the default workdir is the primary workspace) and re-roots
        // its policy at that ancestor.
        if (typeof primary === 'string' && primary.length > 0 && pathInside(absWorkdir, primary)) return next()
        const hit = longestRootFirst(dirs).find((d) => pathInside(absWorkdir, d))
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }
        const shellEnv = ctx.get('shellEnv')
        const request = {
          command: String(args.command),
          workdir: absWorkdir,
          ...(args && args.timeoutMs !== undefined ? { timeoutMs: args.timeoutMs } : {}),
          ...(shellEnv !== undefined ? { dshEnv: shellEnv.collect(exec) } : {}),
          sandboxPolicy: policy,
        }

        // Background runs get the SAME re-rooted policy as foreground runs.
        // They register with the generic jobs runtime (`ctx.jobs`) exactly
        // like the shipped pwsh/bash tools do, so `job_output` / `job_kill`
        // and the finish notice keep working for the intercepted job.
        if (args && args.run_in_background === true) {
          // An aborted call belongs to the default pipeline, which raises the
          // canonical abort error before anything starts.
          if (exec.signal && exec.signal.aborted) return next()
          const jobs = ctx.get('jobs')
          if (jobs === undefined) return next()
          owned = { policy }
          // `JobSpec.owner` is the owner's SessionId since 0.1.7-alpha.1
          // (`jobs-local` resolves it through `agents.get(id)`); the older seam
          // took the Agent itself. Passing the wrong shape throws
          // `session "[object Object]" has no live agent` and the background run
          // never starts. `Agent.id` IS the session id, which is the spelling
          // the shipped pwsh/bash tools register with.
          const jobId = jobs.start({
            kind: exec.name,
            label: String(args.command),
            ...(exec.agent ? { owner: modernShell ? exec.agent.id : exec.agent } : {}),
            run: () => startBackgroundJob(shell, request),
          })
          // The background branch of the tool's `output.schema` requires `cwd`
          // too; omitting it fails the kernel's oneOf check and replaces this
          // result with INVALID_TOOL_OUTPUT after the job has already started.
          return {
            isError: false,
            value: { kind: 'background', jobId, cwd: absWorkdir },
            content: [{ type: 'text', text: 'started background job ' + jobId }],
          }
        }

        owned = { policy }
        // One call site, two release shapes: 0.1.7-alpha.1 replaced
        // `shell.run(spec)` with `execute(spec)` + the handle's foreground
        // projection `result()`. See {@link shellUsesExecute}.
        const result = modernShell
          ? await (await shell.execute(shell.resolve({ ...request, signal: exec.signal }))).result()
          : await shell.run(shell.resolve({ ...request, signal: exec.signal }))
        if (result.aborted) {
          return {
            isError: true,
            error: { message: 'tool call aborted' },
            content: [{ type: 'text', text: '[aborted]' }],
          }
        }
        const stream = (s) => ({
          text: s && typeof s.text === 'string' ? s.text : '',
          truncated: !!(s && s.truncated),
          ...(s && s.spillPath !== undefined ? { spillPath: s.spillPath } : {}),
        })
        // This value is validated against the shipped tool's `output.schema`
        // by the kernel AFTER the command has already run, so every required
        // field must be present or the model gets `INVALID_TOOL_OUTPUT` for a
        // command that actually executed (and retries it). The foreground
        // branch requires `cwd` (string) and a NUMERIC `timeoutMs`.
        const value = {
          kind: 'foreground',
          cwd: absWorkdir,
          exitCode: result.exitCode === undefined ? null : result.exitCode,
          signal: result.signal === undefined ? null : result.signal,
          timedOut: !!result.timedOut,
          aborted: false,
          // Executors echo the resolved deadline; an older one that omits it
          // still has to satisfy `type: "number"` (0 means "no deadline was
          // reported", never a deadline the executor actually applied).
          timeoutMs: typeof result.timeoutMs === 'number' ? result.timeoutMs : 0,
          stdout: stream(result.stdout),
          stderr: stream(result.stderr),
          ...(result.sandbox !== undefined
            ? {
                sandbox: {
                  mode: String(result.sandbox.mode),
                  denied: !!result.sandbox.denied,
                  ...(result.sandbox.enforcement !== undefined
                    ? { enforcement: String(result.sandbox.enforcement) }
                    : {}),
                  ...(result.sandbox.runnerFailed !== undefined
                    ? { runnerFailed: !!result.sandbox.runnerFailed }
                    : {}),
                },
              }
            : {}),
        }
        return { isError: false, value, content: [{ type: 'text', text: shellRender(value) }] }
      }
      return next()
    } catch (error) {
      // A failure BEFORE the call was claimed (path resolution, config lookup,
      // shell service lookup) falls back to the default pipeline. A failure
      // AFTER the claim — the mutation or the shell run itself — does not: the
      // default pipeline fences the call against the PRIMARY workspace root, so
      // it could only answer with the spurious workspace-write denial and would
      // hide the real cause (for example a missing `old_string`).
      return owned === null ? next() : ownedFailure(error, owned.policy)
    }
  })

  // ---------------------------------------------------- hydration on start
  ctx.on('agent/created', (payload) => {
    const agent = payload && payload.agent
    if (agent && agent.session && agent.session.header) hydrate(agent.session.header.cwd)
  })

  // ------------------------------------------------------ /multi-folder cmd
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1274-1321](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1274-L1321)

后台生命周期。

<details>
<summary>查看原文（48行）</summary>

```text
   * run in a secondary directory fail immediately with
   * `Cannot read properties of undefined (reading 'then')` (`proc.done` read
   * off the un-awaited promise). The job-owned AbortSignal travels into
   * `shell.resolve`, so `cancel` stops a launch that has not published a handle
   * yet, and a rejected preparation settles the job as `failed` instead of
   * leaving it running forever. A background process outlives the tool call, so
   * no CALLER signal is forwarded, and it must not inherit a deadline:
   * `onExpiry: 'none'` is what makes the post-0.1.7 `execute()` path ignore
   * `timeoutMs`, which the retired `start()` did by construction. Without it a
   * background command would be killed at the executor's default timeout — a
   * silent behavior regression the shipped tools avoid the same way.
   */
  const startBackgroundJob = (shell, request) => {
    const controller = new AbortController()
    const modern = shellUsesExecute(shell)
    let proc
    const done = (async () => {
      try {
        const spec = shell.resolve({
          ...request,
          signal: controller.signal,
          ...(modern ? { onExpiry: 'none' } : {}),
        })
        proc = modern ? await shell.execute(spec) : await shell.start(spec)
        try {
          if (controller.signal.aborted) proc.kill()
        } finally {
          await proc.done
        }
        return processOutcome(proc)
      } catch (error) {
        return {
          status: controller.signal.aborted && proc === undefined ? 'killed' : 'failed',
          detail: error && error.message !== undefined ? String(error.message) : String(error),
        }
      }
    })()
    return {
      cancel: (reason) => {
        if (controller.signal.aborted) return
        controller.abort(reason)
        if (proc !== undefined) proc.kill()
      },
      done,
      readOutput: () => (proc === undefined ? '' : renderProcessRead(proc.readOutput(), proc.sandbox)),
    }
  }

```

</details>

**依据 5 · 源码核查**：[lib/index.js:1323-1360](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1323-L1360)

丢失/失败信息。

<details>
<summary>查看原文（38行）</summary>

```text
   * One consuming background read, shaped for `job_output`: the raw delta plus
   * loss/spill notices and sandbox markers, mirroring the shipped pwsh/bash
   * tools' background rendering. No escalation hint is appended — escalation
   * calls stay on the default pipeline, which re-roots at the primary
   * workspace, so this job can never receive a wider policy.
   */
  const renderProcessRead = (read, sandbox) => {
    const notices = []
    if (read.lossy) {
      const paths = [read.stdoutSpillPath, read.stderrSpillPath].filter((path) => path !== undefined)
      notices.push(
        '[some output was dropped from memory; full output: ' +
          (paths.length > 0 ? paths.join(', ') : '(unavailable)') +
          ']',
      )
    }
    if (sandbox && sandbox.runnerFailed) {
      notices.push(
        '[sandbox: the sandbox runner itself failed under ' + sandbox.mode +
          ' mode — the command did not run; this is a sandbox problem, not a command failure]',
      )
    } else if (sandbox && sandbox.denied) {
      notices.push('[sandbox: file access denied under ' + sandbox.mode + ' mode]')
    }
    if (notices.length === 0) return read.delta
    return read.delta + (read.delta.length > 0 && !read.delta.endsWith('\n') ? '\n' : '') + notices.join('\n')
  }

  /**
   * Model-facing failure for a call the interception OWNS (see the ownership
   * rule below). A claimed call is never handed back to the default pipeline,
   * so its real error reaches the model in the shipped tools' error envelope —
   * `Error: <message>` plus the `FS_*` code — instead of the primary-rooted
   * sandbox denial. A genuine sandbox denial (read-only mode) keeps the standard
   * marker plus the one-shot escalation hint, exactly as the shipped
   * `write`/`edit` tools render it, so the escalation flow is unchanged.
   */
  const ownedFailure = (error, policy) => {
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1448-1457](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1448-L1457)

primary内写入不匹配祖先secondary，保持默认根。

<details>
<summary>查看原文（10行）</summary>

```text
        // A target inside the PRIMARY workspace is the default pipeline's call.
        // Intercepting it would re-root the policy at an ANCESTOR secondary
        // directory (a configured parent of this workspace matches the target
        // too) and grant more than the call needs; the default pipeline already
        // serves it with the exact standing root.
        if (typeof primary === 'string' && primary.length > 0 && pathInside(abs, primary)) return next()
        if (dirs === null) return next()
        const hit = longestRootFirst(dirs).find((d) => pathInside(abs, d))
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1520-1537](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1520-L1537)

shell同样先保primary边界。

<details>
<summary>查看原文（18行）</summary>

```text
        const workdirTarget = await fs.resolve(joined, { cwd: primary })
        const absWorkdir = fs.processPath(workdirTarget)
        // Same boundary as write/edit: a workdir inside the PRIMARY workspace
        // belongs to the default pipeline. Without this, a secondary directory
        // configured at an ANCESTOR of the workspace captures every ordinary
        // shell call (the default workdir is the primary workspace) and re-roots
        // its policy at that ancestor.
        if (typeof primary === 'string' && primary.length > 0 && pathInside(absWorkdir, primary)) return next()
        const hit = longestRootFirst(dirs).find((d) => pathInside(absWorkdir, d))
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }
        const shellEnv = ctx.get('shellEnv')
        const request = {
          command: String(args.command),
          workdir: absWorkdir,
          ...(args && args.timeoutMs !== undefined ? { timeoutMs: args.timeoutMs } : {}),
          ...(shellEnv !== undefined ? { dshEnv: shellEnv.collect(exec) } : {}),
          sandboxPolicy: policy,
```

</details>

**依据 8 · 源码核查**：[lib/index.js:1563-1569](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1563-L1569)

后台结果补cwd避免执行后schema失败。

```text
          // The background branch of the tool's `output.schema` requires `cwd`
          // too; omitting it fails the kernel's oneOf check and replaces this
          // result with INVALID_TOOL_OUTPUT after the job has already started.
          return {
            isError: false,
            value: { kind: 'background', jobId, cwd: absWorkdir },
            content: [{ type: 'text', text: 'started background job ' + jobId }],
```

**依据 9 · 源码核查**：[lib/index.js:1592-1609](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1592-L1609)

前台数字timeoutMs为输出契约，不是已执行deadline证明。

<details>
<summary>查看原文（18行）</summary>

```text
        // This value is validated against the shipped tool's `output.schema`
        // by the kernel AFTER the command has already run, so every required
        // field must be present or the model gets `INVALID_TOOL_OUTPUT` for a
        // command that actually executed (and retries it). The foreground
        // branch requires `cwd` (string) and a NUMERIC `timeoutMs`.
        const value = {
          kind: 'foreground',
          cwd: absWorkdir,
          exitCode: result.exitCode === undefined ? null : result.exitCode,
          signal: result.signal === undefined ? null : result.signal,
          timedOut: !!result.timedOut,
          aborted: false,
          // Executors echo the resolved deadline; an older one that omits it
          // still has to satisfy `type: "number"` (0 means "no deadline was
          // reported", never a deadline the executor actually applied).
          timeoutMs: typeof result.timeoutMs === 'number' ? result.timeoutMs : 0,
          stdout: stream(result.stdout),
          stderr: stream(result.stderr),
```

</details>

#### 缺口

- 所部署fs.resolve/processPath、sandbox执行器、shell.execute与jobs.owner的固定ABI
  **影响**：模式对象保留不能独立代替OS隔离证明，兼容检测也不能保证任意新版接口
  **进一步探讨**：对照相同宿主提交的fs/runner/jobs契约核路径身份和前后台owner/取消行为

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置身份、保存与通知有哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

配置位于DSH_HOME/storages/multi-folder，文件名把ws所有非字母数字折叠为-并小写；例如/a/b与/a-b落同一个-a-b.json，中文路径也大量折叠，同名长度变化可碰撞。dirsCache/wsKey又在所有平台小写，POSIX /A与/a可混为一份配置。内存键与落盘键不是无损身份，可能把一个workspace的授权目录用于另一个，不能按每项目隔离保证。目录canonicalize依fs.resolve但不stat要求directory，load已有JSON只sanitize绝对字符串不重新canonicalize，旧符号链接/失效目录仍有条件。

coreAdd/Remove/Set均先entry.dirs=next再await saveDirs，写盘失败后本实例仍采用新权限目录而调用方报错，没有回滚/版本CAS。load读失败缓存空列表直到进程内更新/重启，不自动重读外部修复，load无single-flight并行首次读/写也有时序风险；多客户端并发修改无事务合并。save经宿主fs.writeText，未传expected version，是否原子依服务契约。

命令changed才armNotice，按当前session一条pending覆盖之前未消费内容，并在pre-step或post-execute先取先删，能避免双通道重复。但sessionless RPC core修改不armNotice，也不向同workspace其他已有session fanout；systemPrompt从同步缓存读，pre-step hydrate是fire-and-forget，首次装配可能来不及列目录，tools路径await只保障执行。故“所有配置变化下一边界通知”应收窄为当前命令通道已arm的session，不能把后台其他来源修改说成必达。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:95-97](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L95-L97)

有损文件键。

```text
const configDir = () => join(process.env.DSH_HOME || join(os.homedir(), '.dsh'), 'storages', 'multi-folder')
const configFileName = (ws) => String(ws).replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.json'
const configPathFor = (ws) => join(configDir(), configFileName(ws))
```

**依据 2 · 源码核查**：[lib/index.js:154-205](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L154-L205)

小写键/加载。

<details>
<summary>查看原文（52行）</summary>

```text
  const wsKey = (p) => String(p).replace(/\\/g, '/').toLowerCase().replace(/\/+$/, '')
  const isAbsolute = (p) => /^[A-Za-z]:[\\/]/.test(p) || p.startsWith('/') || p.startsWith('\\\\')
  const pathInside = (p, root) => {
    const P = wsKey(p)
    const R = wsKey(root)
    return P === R || P.startsWith(R + '/')
  }
  const displayPathOf = (target, fallback) =>
    target.displayPath !== undefined && target.displayPath !== null ? String(target.displayPath) : fallback
  const longestRootFirst = (dirs) => [...dirs].sort((a, b) => b.length - a.length)

  // ----------------------------------------------------------- config store
  function sanitizeDirs(list, ws) {
    const out = []
    const seen = new Set()
    for (const item of list) {
      if (typeof item !== 'string' || item.trim().length === 0) continue
      const abs = item.trim()
      if (!isAbsolute(abs)) continue
      if (wsKey(abs) === wsKey(ws)) continue // never the primary workspace itself
      const key = wsKey(abs)
      if (seen.has(key)) continue
      seen.add(key)
      out.push(abs)
    }
    return out
  }

  /** Canonical absolute path for a user-supplied directory (handles `..`, symlinks). */
  async function canonicalizeAbs(path) {
    try {
      const target = await fs.resolve(path.trim())
      return fs.processPath(target)
    } catch {
      return null
    }
  }

  async function loadDirs(ws) {
    if (typeof ws !== 'string' || ws.length === 0) return { dirs: [] }
    const key = wsKey(ws)
    const cached = dirsCache.get(key)
    if (cached !== undefined) return cached
    const fresh = { dirs: [] }
    try {
      const target = await fs.resolve(configPathFor(ws))
      const raw = await fs.readText(target)
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) fresh.dirs = sanitizeDirs(parsed, ws)
    } catch {
      // absent or unreadable config -> empty list
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:254-300](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L254-L300)

先内存后保存。

<details>
<summary>查看原文（47行）</summary>

```text

  const coreAdd = async (ws, path) => {
    ws = requireWorkspace(ws)
    if (typeof path !== 'string' || path.length === 0) throw new Error('add requires a path')
    if (!isAbsolute(path)) throw new Error('add requires an absolute path')
    const canonical = await canonicalizeAbs(path)
    if (canonical === null) throw new Error('cannot resolve path "' + path + '"')
    const entry = await loadDirs(ws)
    const next = sanitizeDirs([...entry.dirs, canonical], ws)
    const changed = next.length !== entry.dirs.length
    entry.dirs = next
    if (changed) await saveDirs(ws, next)
    return { workspace: ws, dirs: [...next], changed }
  }

  const coreRemove = async (ws, path) => {
    ws = requireWorkspace(ws)
    if (typeof path !== 'string' || path.length === 0) throw new Error('remove requires a path')
    const canonical = await canonicalizeAbs(path)
    const key = wsKey(canonical === null ? path : canonical)
    const entry = await loadDirs(ws)
    const next = entry.dirs.filter((d) => wsKey(d) !== key)
    const changed = next.length !== entry.dirs.length
    entry.dirs = next
    if (changed) await saveDirs(ws, next)
    return { workspace: ws, dirs: [...next], changed }
  }

  const coreSet = async (ws, paths) => {
    ws = requireWorkspace(ws)
    if (!Array.isArray(paths)) throw new Error('set requires an array of absolute paths')
    const canon = []
    for (const p of paths) {
      if (!isAbsolute(p)) throw new Error('set requires absolute paths')
      const c = await canonicalizeAbs(p)
      if (c === null) throw new Error('cannot resolve path "' + p + '"')
      canon.push(c)
    }
    const entry = await loadDirs(ws)
    const next = sanitizeDirs(canon, ws)
    const changed = JSON.stringify(next) !== JSON.stringify(entry.dirs)
    entry.dirs = next
    if (changed) await saveDirs(ws, next)
    return { workspace: ws, dirs: [...next], changed }
  }

  // ------------------------------------------------- owned directory picker
```

</details>

**依据 4 · 源码核查**：[lib/index.js:917-947](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L917-L947)

sessionless直接core。

<details>
<summary>查看原文（31行）</summary>

```text
  const reasonOf = (e) => String(e && e.message ? e.message : e)

  const multiFolderApi = {
    async list(workspace) {
      try {
        return await coreList(workspace)
      } catch (e) {
        throw new Error(remoteErrorMessage(e))
      }
    },
    async add(workspace, path) {
      try {
        return await coreAdd(workspace, path)
      } catch (e) {
        throw new Error(remoteErrorMessage(e))
      }
    },
    async remove(workspace, path) {
      try {
        return await coreRemove(workspace, path)
      } catch (e) {
        throw new Error(remoteErrorMessage(e))
      }
    },
    async set(workspace, dirs) {
      try {
        return await coreSet(workspace, dirs)
      } catch (e) {
        throw new Error(remoteErrorMessage(e))
      }
    },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1069-1083](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1069-L1083)

pending消费。

<details>
<summary>查看原文（15行）</summary>

```text

  const armNotice = (agent, text) => {
    if (!agent || !agent.session) return
    pendingNotices.set(String(agent.session.id), text)
  }

  const takeNotice = (agent) => {
    if (!agent || !agent.session) return undefined
    const key = String(agent.session.id)
    const text = pendingNotices.get(key)
    if (text !== undefined) pendingNotices.delete(key)
    return text
  }

  // -------------------------------------------- failure diagnosis (post-exec)
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1202-1225](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1202-L1225)

水合与通知边界。

<details>
<summary>查看原文（24行）</summary>

```text

  // ----------------------------------------------- notification (pre-step)
  ctx.on('agent/pre-step', async (payload, next) => {
    if (payload.agent && payload.agent.session && payload.agent.session.header) {
      hydrate(payload.agent.session.header.cwd)
    }
    const decision = await next()
    if (decision.kind !== 'enter') return decision
    const text = takeNotice(payload.agent)
    if (text === undefined) return decision
    return { kind: 'enter', messages: [noticeMessage(text), ...decision.messages] }
  })

  // --------------------------------------- notification (tool-call boundary)
  ctx.on('tools/post-execute', async (exec, result, next) => {
    const decision = await next()
    const extras = []
    const notice = takeNotice(exec.agent)
    if (notice !== undefined) extras.push(notice)
    const hint = await permissionHint(exec, result)
    if (hint !== undefined) extras.push(hint)
    if (extras.length === 0) return decision
    const msgs = extras.map((text) => noticeMessage(text))
    if (decision.kind === 'block') {
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1696-1708](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1696-L1708)

命令changed才arm。

<details>
<summary>查看原文（13行）</summary>

```text
            outcome = await coreSet(ws, argv.slice(1))
          } else {
            return {
              kind: 'error',
              text: 'multi-folder: unknown subcommand "' + sub + '" (use list / add / remove / set)',
            }
          }
          if (outcome.changed) {
            armNotice(
              invocation.agent,
              'Secondary working directories changed (dsh-multi-folder):\n' + dirsText(ws, outcome.dirs),
            )
          }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “用户专管”RPC、配置守卫与原生UI降级是何种保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

配置UI/用户命令复用core验证，RPC经typert共享/api，未直接注册为模型工具，这是降低模型无意改授权的正向设计；但host方法参数只requireWorkspace非空字符串，不校验调用者拥有该workspace或是否用户发起，依赖宿主可信浏览器认证及命令可见性。browse可浏览任意绝对目录，makeDir用Node mkdir创建任意fullyQualified parent下单段目录，不走Agent沙箱，reveal打开宿主既有目录。它们是有意的host UI权限，认证信任边界必须成立，不能称代码本层已证明Agent绝不可能调用。

write/edit守卫只拦当前primary/headerCwd对应配置文件，不是整个store路径，显式sandbox_permissions还在守卫前回默认管线。若用户配置祖先目录包含store、主根本身含store，或允许其他写接口/shell，不能从这两个工具的exact-file guard推出全路径不可修改；danger-full-access本来也不在隔离承诺内。应由受权目录策略保证store不落Agent写根，而非仅把它叫host-owned。

picker能力读失败/非native返回unavailable可避免误开宿主对话框，取消/失败也区分并传AbortSignal。但directoryPicker服务缺失或无capability时返回null，随后直接OS fallback；这没有已证明native/attended/loopback条件，和SECURITY“only native may fallback”并不完全一致。reveal只查存在directory，不检查当前访问者是否在宿主显示器前。WindowsPowerShell helper和macOS osascript都是真实宿主UI副作用，本轮只读未执行。

#### 证据与依据

**依据 1 · 源码核查**：[SECURITY.md:8-27](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/SECURITY.md#L8-L27)

作者用户专管保证。

<details>
<summary>查看原文（20行）</summary>

```text

1. **User-only configuration.** Secondary directories can only be added or removed by
   the user, through the session-header panel, the session-creation page panel, or
   the `/multi-folder` slash command. The two panels are backed by a sessionless
   `multiFolder/*` remote API on the trusted browser→host RPC channel — endpoints
   that exist only for the web UI and are never exposed as agent tools. The agent
   has no tool, command, or file path through which it can change the configuration.

2. **Host-owned configuration store.** Per-workspace configuration lives in
   `<DSH_HOME>/storages/multi-folder/<workspace-key>.json` — outside every agent
   sandbox root. The agent's own tools cannot read-write there under `read-only` or
   `workspace-write` (the sandbox fences the write path by the workspace root).

3. **Explicit write guard.** `write` / `edit` calls targeting the configuration
   file are short-circuited by the tool-pipeline interception with an explicit
   rejection message, independent of the session mode. This turns any attempt at
   self-escalation into a visible, explainable error instead of a silent no-op or a
   silent success.

4. **Mode parity, never escalation.** An intercepted secondary-directory operation runs
```

</details>

**依据 2 · 源码核查**：[lib/index.js:241-245](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L241-L245)

workspace仅非空。

```text
  // endpoints. Errors thrown here carry bare messages; each channel adds
  // its own `multi-folder: ` prefix.

  const requireWorkspace = (ws) => {
    if (typeof ws !== 'string' || ws.length === 0) throw new Error('workspace is required')
```

**依据 3 · 源码核查**：[lib/index.js:337-390](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L337-L390)

浏览/原生mkdir。

<details>
<summary>查看原文（54行）</summary>

```text
   * @returns the level's canonical path, its parent, the home directory, the child directories, and the cap state.
   */
  const coreBrowse = async (path) => {
    const requested = typeof path === 'string' && path.trim().length > 0 ? path.trim() : os.homedir()
    if (!fullyQualified(requested)) {
      throw new Error('browse requires a fully qualified path, got "' + requested + '"')
    }
    const target = await fs.resolve(requested)
    const absolute = fs.processPath(target)
    let children
    try {
      children = await fs.listDir(target)
    } catch (e) {
      throw new Error('cannot list "' + absolute + '": ' + String(e && e.message ? e.message : e))
    }
    const api = pathApiFor(absolute)
    const entries = []
    for (const child of children ?? []) {
      if (child === null || child === undefined || child.type !== 'directory') continue
      const entryName = String(child.name)
      entries.push({ name: entryName, path: api.join(absolute, entryName), hidden: entryName.startsWith('.') })
    }
    entries.sort((a, b) => a.name.localeCompare(b.name))
    const truncated = entries.length > MAX_BROWSE_ENTRIES
    if (truncated) entries.length = MAX_BROWSE_ENTRIES
    return { path: absolute, parent: parentOf(absolute), home: os.homedir(), entries, truncated }
  }

  /**
   * Create one child directory for the plugin's browser. Mirrors the shipped
   * browse backend: the parent must be fully qualified, the name one path
   * segment, and the creation non-recursive (the browser shows the parent, so
   * a missing level is a real failure, not a level to invent).
   * @param parent - fully qualified existing parent directory.
   * @param name - single path segment name.
   * @returns the created directory's canonical path.
   */
  const coreMakeDir = async (parent, name) => {
    if (typeof parent !== 'string' || !fullyQualified(parent)) {
      throw new Error('makeDir requires a fully qualified parent path')
    }
    if (typeof name !== 'string' || name.trim() === '' || name === '.' || name === '..' || /[/\\]/.test(name)) {
      throw new Error('makeDir requires a single path segment name')
    }
    const target = pathApiFor(parent).join(parent, name)
    try {
      await mkdir(target)
    } catch (e) {
      if (e && e.code === 'EEXIST') throw new Error('"' + target + '" already exists')
      throw new Error('cannot create "' + target + '": ' + String(e && e.message ? e.message : e))
    }
    return { path: target, parent }
  }

```

</details>

**依据 4 · 源码核查**：[lib/index.js:406-426](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L406-L426)

picker gate缺失返回null。

<details>
<summary>查看原文（21行）</summary>

```text
  const pickViaHostService = async (signal) => {
    let picker
    try {
      picker = ctx.get('directoryPicker')
    } catch {
      picker = undefined
    }
    if (!picker || typeof picker.capability !== 'function') return null
    let capability
    try {
      capability = picker.capability()
    } catch {
      return { path: null, via: 'unavailable' }
    }
    if (!capability || capability.kind !== 'native') return { path: null, via: 'unavailable' }
    if (typeof capability.pick !== 'function') return null
    const selected = await capability.pick(signal)
    return { path: typeof selected === 'string' && fullyQualified(selected) ? selected : null, via: 'host-native' }
  }

  /**
```

</details>

**依据 5 · 源码核查**：[lib/index.js:968-996](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L968-L996)

OS fallback条件。

<details>
<summary>查看原文（29行）</summary>

```text
    },
    /**
     * Open the system folder chooser on the host machine and report what came
     * back. `via` tells the client half apart the three outcomes it must
     * distinguish: a completed system dialog (`host-native` / `os-dialog` —
     * a null path means the user cancelled, so nothing must be opened), and
     * `unavailable`, where NO system picker could answer and the client should
     * keep using the plugin's own browser.
     */
    async pick(cwd, signal) {
      try {
        signal?.throwIfAborted()
        let native = null
        let nativeFailure = null
        try {
          native = await pickViaHostService(signal)
        } catch (e) {
          // A composed chooser that refuses or crashes must not take the session
          // down with it — the OS dialog below is exactly the second attempt.
          // The reason is still kept and logged, because a downgrade nobody can
          // explain afterwards is the failure mode this fallback exists to avoid.
          nativeFailure = e
          ctx.logger?.warn?.('multi-folder: the host directory picker failed: ' + reasonOf(nativeFailure))
        }
        signal?.throwIfAborted()
        if (native) return native
        const os = await pickViaOsDialog(cwd, signal)
        if (os) return os
        if (nativeFailure) throw new Error('the host directory picker failed: ' + reasonOf(nativeFailure))
```

</details>

**依据 6 · 源码核查**：[lib/index.js:585-620](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L585-L620)

reveal真实宿主动作。

<details>
<summary>查看原文（36行）</summary>

```text
   * terminal "open here"). Detached by design: the file manager outlives this
   * call, so there is no exit status to report and no error to invent.
   * @param path - fully qualified directory on the host.
   * @returns the canonical path and the helper that was asked to show it.
   */
  const coreReveal = async (path) => {
    if (typeof path !== 'string' || !fullyQualified(path)) {
      throw new Error('reveal requires a fully qualified path, got "' + String(path) + '"')
    }
    const target = await fs.resolve(path)
    const info = await fs.stat(target)
    if (!info || info.type !== 'directory') throw new Error('reveal requires an existing directory: "' + path + '"')
    const absolute = fs.processPath(target)
    const command = process.platform === 'win32' ? 'explorer.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open'
    let child
    try {
      child = spawn(command, [absolute], { detached: true, stdio: 'ignore' })
    } catch (e) {
      throw new Error('cannot open "' + absolute + '": ' + String(e && e.message ? e.message : e))
    }
    // A detached spawn reports a missing executable asynchronously, so wait for
    // 'spawn' before claiming success: otherwise a host without `xdg-open` would
    // report an opened file manager that never appeared. After that the process
    // is on its own — detached, unreferenced, and with a listener so a later
    // failure cannot surface as an unhandled 'error' event on the plugin.
    try {
      await new Promise((resolve, reject) => {
        child.once('spawn', resolve)
        child.once('error', reject)
      })
    } catch (e) {
      throw new Error('cannot open "' + absolute + '": ' + String(e && e.message ? e.message : e))
    }
    child.on('error', () => {})
    child.unref()
    return { path: absolute, via: command }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1410-1447](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1410-L1447)

升级早回与exact-file guard。

<details>
<summary>查看原文（38行）</summary>

```text
      const dirs =
        dirsForSync(primary) ??
        (typeof headerCwd === 'string' && headerCwd.length > 0 ? dirsForSync(headerCwd) : null)

      if (exec.name === 'write' || exec.name === 'edit') {
        const filePath = args && typeof args.file_path === 'string' ? args.file_path : null
        if (filePath === null) return next()
        // Resolve first so `..`, symlinks, and case differences canonicalize
        // before containment matching (same cwd the shipped tools use).
        let target
        try {
          target = await fs.resolve(filePath, { cwd: primary })
        } catch (error) {
          // An unresolvable ABSOLUTE path that is lexically inside a secondary
          // directory is still this plugin's call to answer: the default pipeline
          // would resolve it against the PRIMARY root and report the sandbox
          // denial, hiding the resolution failure.
          if (dirs !== null && isAbsolute(filePath)) {
            const rawHit = longestRootFirst(dirs).find((d) => pathInside(filePath, d))
            if (rawHit !== undefined) return ownedFailure(error, { ...standing, workspaceRoot: rawHit })
          }
          return next()
        }
        const abs = fs.processPath(target)
        // Security boundary: configuration is user-managed. Reject direct
        // write/edit attempts against the host-owned config file, even before
        // any directory matching. Both spellings of the workspace key are
        // checked (see the dirs lookup above).
        const guardHits = new Set(
          [primary, headerCwd].filter((p) => typeof p === 'string' && p.length > 0).map((p) => wsKey(configPathFor(p))),
        )
        if (guardHits.has(wsKey(abs))) {
          return {
            isError: true,
            error: { message: 'multi-folder configuration is user-managed' },
            content: [{ type: 'text', text: CONFIG_GUARD_TEXT }],
          }
        }
```

</details>

#### 缺口

- 共享/api调用者身份、用户命令/host服务可达性及native UI的远程/缺服务策略
  **影响**：本层未证实用户专管绝对不可绕过，远程环境fallback可能展示无人点击的宿主UI
  **进一步探讨**：核固定gateway/命令权限和directoryPicker缺失组成，明确允许根与host UI能力受理条件

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · @发现和工程测试支持哪些结论？

**研究主题**：工程质量与复用

#### 完整回答

新增@组依workspace取配置，BFS索引canonical去重、防junction回环、排除vendor/build名字、2万entry/4秒TTL/每次30候选，level最多500并拒..和歧义basename；相对按绝对前缀模糊匹配，按副根内相对路径评分更符合查找目的。它不改原provider，也不改变读权限。限制是scan没有single-flight/超时与全workspace缓存LRU，多并发autocomplete可能重复遍历；跨副根按顺序耗尽预算，后根可被饿死且bare查询结果没有index截断标记。level在fs.resolve后未重新核canonical仍在授权根，若symlink可到外部，结果dir标签可能仍称原副根；整体宿主reads不受此处写root限制，不应把@组当读隔离保证。

client三候选席位选一个、sessionless或session命令分流、picker关闭/unload abort、文件quote/目录Tab钻取有专门实现。常规refresh/mutate/browse回调没请求代号或取消，切会话/目录期间旧请求可patch全局panel，把旧状态画到当前面板；workspace publish有target检查，比session刷新更窄。运行时无浏览器构建步骤易读但维护ABI分支多。intercept测试导入真模块配mock fs/shell/jobs，涵盖水合、失败所有权、现代旧接口、取消/背景；smoke-host也mock文件树与picker，测试不是OS沙箱认证。client用React shim核行为，实际宿主合规声明仍作者范围。本轮只读这些代表测试，不执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:648-738](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L648-L738)

索引预算/缓存。

<details>
<summary>查看原文（91行）</summary>

```text
    '.next', '.nuxt', '.turbo', '.venv', '__pycache__', '.pytest_cache',
    '.mypy_cache', '.gradle',
  ])
  /** Entries retained per workspace across every configured directory. */
  const MAX_INDEX_ENTRIES = 20000
  /** Entries retained for one level listing. */
  const MAX_LEVEL_ENTRIES = 500
  /** Candidates one query returns. */
  const MAX_FILE_RESULTS = 30
  /**
   * How long one workspace's index answers before the next query rebuilds it.
   * Autocomplete is advisory, so a few seconds of staleness is invisible while
   * it bounds rebuild cost to one traversal per window — a config change is
   * caught immediately instead, by the directory signature.
   */
  const FILE_INDEX_TTL_MS = 4000
  /** wsKey(workspace) -> { sig, builtAt, entries } */
  const filesCache = new Map()

  const lastSegment = (p) => {
    const parts = String(p).replace(/[\\/]+$/, '').split(/[\\/]/)
    return parts.length === 0 ? '' : parts[parts.length - 1]
  }
  /** Absolute path in the forward-slash spelling the mention grammar carries. */
  const slashed = (p) => String(p).replace(/\\/g, '/')

  /**
   * Index one workspace's secondary directories: breadth-first, canonical-path
   * deduplicated (a junction/symlink pointing back up the tree cannot re-enter
   * the walk), excluding `INDEX_EXCLUDED` basenames, bounded by
   * `MAX_INDEX_ENTRIES` across all directories.
   * @param dirs - configured secondary directories.
   * @returns entries as `{ dir, rel, kind }`, `rel` forward-slashed inside `dir`.
   */
  const scanFiles = async (dirs) => {
    const entries = []
    const visited = new Set()
    for (const dir of dirs) {
      const queue = [{ abs: dir, rel: '' }]
      for (let cursor = 0; cursor < queue.length && entries.length < MAX_INDEX_ENTRIES; cursor += 1) {
        const level = queue[cursor]
        let target
        let absolute
        try {
          target = await fs.resolve(level.abs)
          absolute = fs.processPath(target)
        } catch {
          continue // an unresolvable level contributes nothing
        }
        const canonical = wsKey(absolute)
        if (visited.has(canonical)) continue
        visited.add(canonical)
        let children
        try {
          children = await fs.listDir(target)
        } catch {
          continue // an unreadable branch costs its own entries; the rest stay useful
        }
        const api = pathApiFor(absolute)
        for (const child of children ?? []) {
          if (child === null || child === undefined) continue
          const childName = String(child.name)
          const rel = level.rel === '' ? childName : level.rel + '/' + childName
          if (child.type === 'directory') {
            if (INDEX_EXCLUDED.has(childName)) continue
            entries.push({ dir, rel, kind: 'directory' })
            queue.push({ abs: api.join(absolute, childName), rel })
          } else if (child.type === 'file') {
            entries.push({ dir, rel, kind: 'file' })
          }
          if (entries.length >= MAX_INDEX_ENTRIES) break
        }
      }
    }
    return entries
  }

  /** One workspace's index, rebuilt when its directory set changes or the TTL lapses. */
  const indexFor = async (ws, dirs) => {
    const key = wsKey(ws)
    const sig = dirs.map(wsKey).join('|')
    const cached = filesCache.get(key)
    if (cached !== undefined && cached.sig === sig && Date.now() - cached.builtAt < FILE_INDEX_TTL_MS) {
      return cached.entries
    }
    const entries = await scanFiles(dirs)
    filesCache.set(key, { sig, builtAt: Date.now(), entries })
    return entries
  }

  /** Longest common subsequence gap score, mirroring the shipped provider. */
```

</details>

**依据 2 · 源码核查**：[lib/index.js:798-905](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L798-L905)

level与查询。

<details>
<summary>查看原文（108行）</summary>

```text
   * path, or reject it. `.` and empty segments are normalized away, and ANY
   * `..` segment is refused: without that, `@secondary/../../etc/` would list a
   * directory outside every configured root while still claiming the configured
   * directory as its owner — a candidate whose `dir` field lies, and a level
   * listing that escaped the set the user actually granted. The shipped
   * provider refuses the same escape for the same reason.
   * @returns the normalized relative path, or null when the query escapes.
   */
  const decodeInside = (inside) => {
    const segments = String(inside).split('/').filter((segment) => segment !== '' && segment !== '.')
    return segments.includes('..') ? null : segments.join('/')
  }

  /**
   * Resolve the directory part of a query to `(configured dir, in-dir path)`.
   * Two spellings are accepted: a fully qualified path inside a configured
   * directory (what a drill inserts), and a path whose first segment names a
   * configured directory by basename (`@secondary-spike/src/`). An ambiguous
   * basename (two configured directories sharing one) is refused, never
   * guessed.
   * @returns the resolved level, or null when the query names no configured directory.
   */
  const resolveLevel = (dirs, directory) => {
    const trimmed = String(directory).replace(/\/+$/, '')
    if (trimmed === '') return null
    const query = slashed(trimmed).toLowerCase()
    if (fullyQualified(trimmed)) {
      for (const dir of longestRootFirst(dirs)) {
        const root = slashed(dir).toLowerCase()
        if (query === root) return { dir, inside: '' }
        if (query.startsWith(root + '/')) {
          const inside = decodeInside(slashed(trimmed).slice(slashed(dir).length + 1))
          return inside === null ? null : { dir, inside }
        }
      }
      return null
    }
    const cut = trimmed.indexOf('/')
    const head = cut < 0 ? trimmed : trimmed.slice(0, cut)
    const inside = decodeInside(cut < 0 ? '' : trimmed.slice(cut + 1))
    if (inside === null) return null
    const matches = dirs.filter((dir) => lastSegment(dir).toLowerCase() === head.toLowerCase())
    if (matches.length !== 1) return null
    return { dir: matches[0], inside }
  }

  /** List one level of a configured secondary directory (files and directories). */
  const listLevel = async (dirs, directory, fragment) => {
    const empty = { candidates: [], truncated: false }
    const level = resolveLevel(dirs, directory)
    if (level === null) return empty
    const absolute = level.inside === '' ? level.dir : pathApiFor(level.dir).join(level.dir, ...level.inside.split('/'))
    let children
    try {
      children = await fs.listDir(await fs.resolve(absolute))
    } catch {
      return empty
    }
    const shown = []
    for (const child of children ?? []) {
      if (child === null || child === undefined) continue
      const childName = String(child.name)
      const kind = child.type === 'directory' ? 'directory' : child.type === 'file' ? 'file' : null
      if (kind === null) continue
      if (kind === 'directory' && INDEX_EXCLUDED.has(childName)) continue
      // Hidden entries stay reachable by asking for them explicitly, exactly
      // like the shipped provider (and this plugin's own directory browser).
      if (childName.startsWith('.') && !fragment.startsWith('.')) continue
      shown.push({ dir: level.dir, rel: level.inside === '' ? childName : level.inside + '/' + childName, kind })
    }
    const truncated = shown.length > MAX_LEVEL_ENTRIES
    if (truncated) shown.length = MAX_LEVEL_ENTRIES
    return { candidates: rankEntries(shown, fragment), truncated }
  }

  /**
   * Discover candidates for one `@` query across a workspace's configured
   * secondary directories. An empty query yields the directories themselves
   * (the menu's entry points); a query carrying a separator lists that level;
   * a bare fragment fuzzy-ranks the index.
   * @param ws - primary workspace path (configuration key).
   * @param query - path text following `@` or `@"`.
   * @returns the workspace, its configured directories, and the ranked candidates.
   */
  const coreListFiles = async (ws, query) => {
    ws = requireWorkspace(ws)
    const entry = await loadDirs(ws)
    const dirs = [...entry.dirs]
    const out = { workspace: ws, dirs, candidates: [], truncated: false }
    if (dirs.length === 0) return out
    const q = typeof query === 'string' ? query.replace(/\\/g, '/') : ''
    if (q === '') {
      out.candidates = dirs.map((dir) => ({ path: slashed(dir), kind: 'directory', dir, rel: '' }))
      return out
    }
    const slash = q.lastIndexOf('/')
    if (slash >= 0) {
      const level = await listLevel(dirs, q.slice(0, slash + 1), q.slice(slash + 1))
      out.candidates = level.candidates
      out.truncated = level.truncated
      return out
    }
    const index = await indexFor(ws, dirs)
    const visible = q.startsWith('.') ? index : index.filter((item) => !item.rel.split('/').some((segment) => segment.startsWith('.')))
    out.candidates = rankEntries(visible, q)
    return out
  }

```

</details>

**依据 3 · 源码核查**：[lib/client.js:454-495](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/client.js#L454-L495)

session刷新写全局状态。

<details>
<summary>查看原文（42行）</summary>

```text
        if (!sessionId) return;
        patch({ busy: true, error: null });
        runCommand(sessionId, '/multi-folder list').then(function (text) {
          var parsed = parseJsonLine(text);
          if (parsed) {
            sessionCache[sessionId] = { workspace: parsed.workspace, dirs: parsed.dirs };
          }
          patch({
            busy: false,
            workspace: parsed ? parsed.workspace : null,
            dirs: parsed ? parsed.dirs : [],
          });
        }).catch(function (e) {
          patch({ busy: false, error: String(e && e.message ? e.message : e) });
        });
      }

      function mutate(sessionId, line) {
        patch({ busy: true, error: null });
        return runCommand(sessionId, line).then(function (text) {
          var parsed = parseJsonLine(text);
          if (parsed) {
            sessionCache[sessionId] = { workspace: parsed.workspace, dirs: parsed.dirs };
            patch({
              busy: false,
              workspace: parsed.workspace,
              dirs: parsed.dirs,
            });
          } else {
            refresh(sessionId);
          }
        }).catch(function (e) {
          patch({ busy: false, error: String(e && e.message ? e.message : e) });
          refresh(sessionId);
        });
      }

      // -------------------------------------------- owned directory browser
      // The owned browser reads levels over `multiFolder/browse` and creates
      // directories through `multiFolder/makeDir`.

      /** Read one level into the store. A blank path asks the host for its
```

</details>

**依据 4 · 源码核查**：[lib/client.js:502-527](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/client.js#L502-L527)

browse回调。

<details>
<summary>查看原文（26行）</summary>

```text
            : { path: '', parent: null, home: '', entries: [], truncated: false };
          patch({
            browseBusy: false,
            browse: level,
            browseDraft: level.path,
            browseError: null,
            newDirName: '',
          });
          return level;
        }).catch(function (e) {
          patch({ browseBusy: false, browseError: String(e && e.message ? e.message : e) });
          return null;
        });
      }

      /** Open the OWNED browser at the panel's workspace (or the host home when
       *  the panel has no workspace path yet) and read its first level. Reachable
       *  from the panel at all times, and the automatic destination whenever the
       *  system picker cannot answer. */
      function openOwnedBrowser() {
        var snapshot = getSnapshot();
        patch({
          browseOpen: true,
          browse: null,
          browseBusy: false,
          browseError: null,
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1550-1623](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/client.js#L1550-L1623)

@候选与引用。

<details>
<summary>查看原文（74行）</summary>

```text
          // names the directory, so repeating it there says nothing.
          ...(parent === '' ? {} : { description: parent }),
          icon: kind === 'directory' ? 'folder' : 'file',
          section: heading,
          value: JSON.stringify({ kind: kind, path: path, mention: mention }),
          ...(kind === 'directory' ? { drill: true } : {}),
        }];
      }

      ctx.inject(['inputTriggers'], function (scope) {
        var registry = scope.inputTriggers;
        if (!registry || typeof registry.registerSource !== 'function') return;
        scope.effect(function () {
          return registry.registerSource({
            trigger: '@',
            name: NS,
            order: 10,
            // The menu titles a group from its source name via its OWN
            // dictionary (an unknown key renders verbatim), so the title row is
            // switched off: rows are headed by their directory section instead,
            // and an empty result renders nothing at all.
            showGroupTitle: false,
            candidates: function (session, request) {
              var summary = sessions.list.getSnapshot().byId[session.sessionId];
              var workspace = summary && summary.cwd;
              if (!workspace) return Promise.resolve([]);
              var preserveQuote = request.quoted === true;
              return remoteCall('multiFolder/listFiles', { workspace: workspace, query: request.query }).then(
                function (value) {
                  var items = value && Array.isArray(value.candidates) ? value.candidates : [];
                  var rows = [];
                  for (var i = 0; i < items.length; i += 1) {
                    var item = items[i];
                    rows = rows.concat(fileRow(item, preserveQuote, abbreviate(String(item.dir || ''))));
                  }
                  return rows;
                },
                // Autocomplete is advisory: a discovery failure is an empty
                // group, never a broken composer and never a failed send.
                function () { return []; },
              );
            },
            onPick: function (pick) {
              var chosen = rowValue(pick.candidate.value);
              if (chosen === undefined) return undefined;
              var name = lastSegment(chosen.path);
              // Tab / the row chevron refines the query in place instead of
              // settling the pick, so a directory descends one level: the
              // mention text becomes the live query, and the host resolves the
              // absolute spelling it just produced.
              if (chosen.kind === 'directory' && pick.action === 'drill') {
                return { text: chosen.mention, continue: true };
              }
              return {
                insert: {
                  source: NS,
                  ref: chosen.mention,
                  label: chosen.kind === 'directory' ? name + '/' : name,
                  appearance: chosen.kind === 'directory' ? 'folder' : 'file',
                  clipboardText: chosen.mention,
                },
              };
            },
            // The mention IS the model form (an `@path` token the prompt
            // grammar already defines), so serialization is the identity.
            codec: {
              clipboardText: function (ref) { return ref; },
              serialize: function (ref) { return Promise.resolve(ref); },
            },
          });
        }, 'dsh-multi-folder: @ discovery source');
      });
    }

```

</details>

**依据 6 · 源码核查**：[test/intercept.mjs:64-114](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/test/intercept.mjs#L64-L114)

fs/策略mock。

<details>
<summary>查看原文（51行）</summary>

```text
let startGate = null;
let startFailure = null;

const fsMock = {
  async resolve(path, opts) {
    const key = normalize(path);
    const isRel = !/^[A-Za-z]:[\\/]/.test(path) && !path.startsWith('/');
    const full = opts && opts.cwd && isRel ? normalize(opts.cwd + '/' + path) : key;
    return { displayPath: path, targetKey: full, processPath: full };
  },
  processPath(target) {
    return target.processPath;
  },
  async readText(target) {
    const key = configKey(target);
    const entry = configStore.get(key);
    if (entry !== undefined) return JSON.stringify(entry);
    throw new Error('no such file');
  },
  async writeText(target, content, expected, signal, policy) {
    writes.push({ path: String(target.processPath ?? target.displayPath), content, policy });
    if (writeFailure !== null) throw writeFailure;
    if (String(target.processPath ?? target.displayPath).replace(/\\/g, '/').includes('storages/multi-folder/')) {
      configStore.set(configKey(target), JSON.parse(content));
    }
    return { operation: 'create', version: 'v1', before: null, after: content };
  },
  async editText(target, edit, expected, signal, policy) {
    edits.push({ path: String(target.processPath ?? target.displayPath), edit, policy });
    if (editFailure !== null) throw editFailure;
    return { before: edit.oldString, after: edit.newString };
  },
};

const makeCtx = (listenersMap, overrides = {}, shellApi = 'legacy') => ({
  fs: fsMock,
  sandboxPolicy: {
    resolve(request) {
      const sid = request && request.session ? String(request.session.id) : undefined;
      return { mode: 'workspace-write', workspaceRoot: WS, ...(sid ? { sessionId: sid } : {}) };
    },
  },
  systemPrompt: {
    section(section) {
      sections.push(section);
      return () => {};
    },
  },
  emit(event, ...args) {
    emitted.push({ event, args });
  },
```

</details>

**依据 7 · 源码核查**：[test/intercept.mjs:746-821](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/test/intercept.mjs#L746-L821)

错误所有权/升级测试。

<details>
<summary>查看原文（76行）</summary>

```text
assert(!editFailed.content[0].text.includes('sandbox:'), 'no spurious sandbox marker on a local failure');
assert(editFailed.error.info && editFailed.error.info.code === 'FS_EDIT_NO_MATCH', 'FS code preserved in the error envelope');
assert(editFailed.error.message === editFailed.content[0].text.slice('Error: '.length), 'error message matches the rendered text');
editFailure = null;

// 17b. Same for `write`.
writeFailure = Object.assign(new Error('cannot write "' + SEC2 + '\\b.txt": the file is locked'), { code: 'FS_IO_ERROR' });
const writeFailed = await execWrite(
  { name: 'write', arguments: { file_path: SEC2 + '\\b.txt', content: 'x' }, agent, signal: undefined },
  countingNext,
);
assert(writeFailed !== 'PASSTHROUGH' && nextCalls === 0, 'failed secondary write stays intercepted');
assert(writeFailed.content[0].text.includes('the file is locked'), 'write real cause surfaced');
assert(writeFailed.error.info && writeFailed.error.info.code === 'FS_IO_ERROR', 'write FS code preserved');
writeFailure = null;

// 17c. A GENUINE sandbox denial keeps the shipped marker + escalation hint.
editFailure = Object.assign(new Error('cannot write "x": file access denied under read-only mode'), { code: 'FS_SANDBOX_DENIED' });
const deniedEdit = await execWrite(
  { name: 'edit', arguments: { file_path: SEC2 + '\\a.txt', old_string: 'a', new_string: 'b' }, agent, signal: undefined },
  countingNext,
);
assert(deniedEdit !== 'PASSTHROUGH' && nextCalls === 0, 'denied secondary edit stays intercepted');
assert(deniedEdit.error.info && deniedEdit.error.info.code === 'FS_SANDBOX_DENIED', 'denial code preserved');
assert(deniedEdit.content[0].text.includes('[sandbox: file access denied under workspace-write mode]'), 'denial marker rendered');
assert(deniedEdit.content[0].text.includes('escalation available'), 'one-shot escalation hint preserved');
editFailure = null;

// 17d. Only a REAL escalation request defers to the default pipeline; a
//      null/empty value is not one and must not re-root the call at the
//      primary workspace.
const nullEscalation = await execWrite(
  {
    name: 'edit',
    arguments: { file_path: SEC2 + '\\a.txt', old_string: 'a', new_string: 'b', sandbox_permissions: null, justification: null },
    agent,
    signal: undefined,
  },
  countingNext,
);
assert(nullEscalation !== 'PASSTHROUGH' && nullEscalation.isError === false, 'null sandbox_permissions still intercepted');

const emptyEscalation = await execWrite(
  {
    name: 'edit',
    arguments: { file_path: SEC2 + '\\a.txt', old_string: 'a', new_string: 'b', sandbox_permissions: '' },
    agent,
    signal: undefined,
  },
  countingNext,
);
assert(emptyEscalation !== 'PASSTHROUGH' && emptyEscalation.isError === false, 'empty sandbox_permissions still intercepted');

const realEscalation = await execWrite(
  {
    name: 'edit',
    arguments: { file_path: SEC2 + '\\a.txt', old_string: 'a', new_string: 'b', sandbox_permissions: 'danger-full-access', justification: 't' },
    agent,
    signal: undefined,
  },
  countingNext,
);
assert(realEscalation === 'PASSTHROUGH' && nextCalls === 1, 'real escalation still passes through');

// 17e. Targets outside every secondary directory keep the default pipeline.
const outsideAgain = await execWrite(
  { name: 'edit', arguments: { file_path: 'C:\\Windows\\Temp\\y.txt', old_string: 'a', new_string: 'b' }, agent, signal: undefined },
  countingNext,
);
assert(outsideAgain === 'PASSTHROUGH' && nextCalls === 2, 'non-secondary edit still passes through');

// 17f. An UNRESOLVABLE absolute path inside a secondary directory is still
//      answered here rather than fenced at the primary root.
const listenersR = new Map();
const ctxR = makeCtx(listenersR, {
  fs: {
```

</details>

**依据 8 · 源码核查**：[test/smoke-host.mjs:380-445](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/test/smoke-host.mjs#L380-L445)

picker mock及缺失环境。

<details>
<summary>查看原文（66行）</summary>

```text
// A native composition answers, and is the ONLY thing asked.
const pickController = new AbortController();
let receivedSignal;
mockCtx.get = (n) => (n === 'directoryPicker'
  ? { capability: () => ({ kind: 'native', pick: async (signal) => { receivedSignal = signal; return 'D:\\picked\\by\\host'; } }) }
  : undefined);
const pickedNative = await api.pick(ws, pickController.signal);
assert(pickedNative.via === 'host-native' && pickedNative.path === 'D:\\picked\\by\\host', 'a native composition answers the pick');
assert(receivedSignal === pickController.signal, 'native picker receives the caller signal');

const cancelled = new AbortController();
cancelled.abort();
await api.pick(ws, cancelled.signal).then(
  () => { throw new Error('FAIL: aborted pick should not return a selection'); },
  () => { assert(receivedSignal === pickController.signal, 'aborted pick does not open a chooser'); },
);

const inFlight = new AbortController();
mockCtx.get = (n) => (n === 'directoryPicker'
  ? { capability: () => ({ kind: 'native', pick: (signal) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  }) }) }
  : undefined);
const interrupted = api.pick(ws, inFlight.signal);
inFlight.abort();
await interrupted.then(
  () => { throw new Error('FAIL: aborted native picker should not fall through'); },
  () => {},
);

// The shipped Windows chooser worker has been observed to exit mid-call: the OS
// dialog is the second attempt, and a platform with no OS dialog to offer must
// REPORT that failure instead of answering `unavailable` as if the host had
// composed no picker at all.
mockCtx.get = (n) => (n === 'directoryPicker'
  ? { capability: () => ({ kind: 'native', pick: async () => { throw new Error('directory picker failed: worker exited'); } }) }
  : undefined);
await asUnsupportedPlatform(() => api.pick(ws)).then(
  () => { throw new Error('FAIL: a crashed native picker with no OS dialog must be reported'); },
  (e) => {
    assert(
      /host directory picker failed[\s\S]*worker exited/.test(String(e.message)),
      'native picker failure is reported: ' + String(e.message),
    );
  },
);

// A capability that cannot even be read is not proven native: the host must not
// be shown an OS dialog for it, so the client keeps its own browser.
mockCtx.get = (n) => (n === 'directoryPicker' ? { capability: () => { throw new Error('capability unavailable'); } } : undefined);
const unreadable = await api.pick();
assert(unreadable.via === 'unavailable' && unreadable.path === null, 'an unreadable capability is never asked');

// A browse-only composition must send the client to its browser, without
// opening the host machine's OS dialog.
let browseAsked = 0;
mockCtx.get = (n) => (n === 'directoryPicker'
  ? { capability: () => ({ kind: 'browse', list: async () => { browseAsked += 1; return {}; } }) }
  : undefined);
const noPicker = await api.pick();
assert(browseAsked === 0 && noPicker.via === 'unavailable', 'a browse-only composition is never asked');

// An absent service is not an error either, and the start directory is optional.
mockCtx.get = realGet;
const absent = await asUnsupportedPlatform(() => api.pick());
assert(absent.via === 'unavailable' && absent.path === null, 'an absent picker service degrades quietly');
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启动、持续工作与失败恢复成本如何核算？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要Node>=20，base+Web组合的fs/sandboxPolicy/systemPrompt，命令service软注入、shell/shellEnv/jobs按调用取得；sessionless需typert/gateway remotes，UI需connection/sessions/workspaces/slots/locale，@依inputTrigger可选。package兼容表为作者按发行版声明，不证明任意未来DSH；README的沙箱语义特别依OS runner，UI和原生picker还分Windows/macOS/Linux。



按一组跨仓任务成功且可回滚的总成本比较。保primary有助上下文稳定，每次单根执行仍需拆分、审查依赖和逐仓回退；副根/索引上限不是额外免费产能。首次配置扩大当前模式允许的目录，持续付fs/shell/jobs和索引资源，失败须核配置内存/磁盘与各仓副作用。没有同任务工时/成功率/金额，对净收益保留未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:44-78](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/package.json#L44-L78)

宿主兼容/Node/client依赖。

<details>
<summary>查看原文（35行）</summary>

```text
      "dshReleases": {
        "0.2.1-alpha.2": "compatible",
        "0.2.1-alpha.1": "compatible",
        "0.2.0-rc.1": "compatible",
        "0.1.7-rc.2": "compatible",
        "0.1.6-alpha.1": "compatible",
        "0.1.2-alpha.5": "compatible",
        "0.1.2-alpha.4": "compatible",
        "0.1.2-alpha.3": "compatible",
        "0.1.2-alpha.2": "compatible",
        "0.1.1-rc.2": "incompatible",
        "0.1.2-alpha.1": "compatible"
      }
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-api-gateway",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-input-trigger"
      ]
    }
  },
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:91-97](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L91-L97)

host服务。

```text
export const name = 'dsh-multi-folder'
export const inject = ['fs', 'sandboxPolicy', 'systemPrompt']

/** Host-owned store, outside every agent sandbox root. */
const configDir = () => join(process.env.DSH_HOME || join(os.homedir(), '.dsh'), 'storages', 'multi-folder')
const configFileName = (ws) => String(ws).replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.json'
const configPathFor = (ws) => join(configDir(), configFileName(ws))
```

**依据 3 · 源码核查**：[lib/index.js:1506-1573](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1506-L1573)

按调用取得执行服务。

<details>
<summary>查看原文（68行）</summary>

```text

      if (exec.name === 'pwsh' || exec.name === 'bash') {
        const shell = ctx.get('shell')
        if (shell === undefined) return next()
        const modernShell = shellUsesExecute(shell)
        if (dirs === null) return next()
        const rawWorkdir = args && typeof args.workdir === 'string' ? args.workdir : null
        const joined = rawWorkdir === null
          ? String(primary)
          : isAbsolute(rawWorkdir)
            ? rawWorkdir
            : String(primary).replace(/[\\/]+$/, '') + '/' + rawWorkdir
        // Canonicalize before containment matching, then run in the canonical
        // directory so confinement root and process cwd agree exactly.
        const workdirTarget = await fs.resolve(joined, { cwd: primary })
        const absWorkdir = fs.processPath(workdirTarget)
        // Same boundary as write/edit: a workdir inside the PRIMARY workspace
        // belongs to the default pipeline. Without this, a secondary directory
        // configured at an ANCESTOR of the workspace captures every ordinary
        // shell call (the default workdir is the primary workspace) and re-roots
        // its policy at that ancestor.
        if (typeof primary === 'string' && primary.length > 0 && pathInside(absWorkdir, primary)) return next()
        const hit = longestRootFirst(dirs).find((d) => pathInside(absWorkdir, d))
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }
        const shellEnv = ctx.get('shellEnv')
        const request = {
          command: String(args.command),
          workdir: absWorkdir,
          ...(args && args.timeoutMs !== undefined ? { timeoutMs: args.timeoutMs } : {}),
          ...(shellEnv !== undefined ? { dshEnv: shellEnv.collect(exec) } : {}),
          sandboxPolicy: policy,
        }

        // Background runs get the SAME re-rooted policy as foreground runs.
        // They register with the generic jobs runtime (`ctx.jobs`) exactly
        // like the shipped pwsh/bash tools do, so `job_output` / `job_kill`
        // and the finish notice keep working for the intercepted job.
        if (args && args.run_in_background === true) {
          // An aborted call belongs to the default pipeline, which raises the
          // canonical abort error before anything starts.
          if (exec.signal && exec.signal.aborted) return next()
          const jobs = ctx.get('jobs')
          if (jobs === undefined) return next()
          owned = { policy }
          // `JobSpec.owner` is the owner's SessionId since 0.1.7-alpha.1
          // (`jobs-local` resolves it through `agents.get(id)`); the older seam
          // took the Agent itself. Passing the wrong shape throws
          // `session "[object Object]" has no live agent` and the background run
          // never starts. `Agent.id` IS the session id, which is the spelling
          // the shipped pwsh/bash tools register with.
          const jobId = jobs.start({
            kind: exec.name,
            label: String(args.command),
            ...(exec.agent ? { owner: modernShell ? exec.agent.id : exec.agent } : {}),
            run: () => startBackgroundJob(shell, request),
          })
          // The background branch of the tool's `output.schema` requires `cwd`
          // too; omitting it fails the kernel's oneOf check and replaces this
          // result with INVALID_TOOL_OUTPUT after the job has already started.
          return {
            isError: false,
            value: { kind: 'background', jobId, cwd: absWorkdir },
            content: [{ type: 'text', text: 'started background job ' + jobId }],
          }
        }

        owned = { policy }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:285-299](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/client.js#L285-L299)

UI服务。

<details>
<summary>查看原文（15行）</summary>

```text
    var inject = ['remote', 'remote.commands', 'slots', 'workspaces', 'connection', 'sessions', 'locale'];

    function apply(ctx) {
      var slots = ctx.slots;
      var remote = ctx.remote;
      var workspaces = ctx.workspaces;
      var connection = ctx.connection;
      var sessions = ctx.sessions;
      var locale = ctx.locale;

      /** Register this plugin's dictionaries for every shipped locale
       *  (bilingual balance is enforced by the locale service). The
       *  registration is an effect on this plugin's fiber, so unloading the
       *  plugin withdraws the dictionaries. */
      ctx.effect(function () {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1713-1727](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1713-L1727)

RPC注册。

<details>
<summary>查看原文（15行）</summary>

```text
            text: 'multi-folder: ' + String(e && e.message ? e.message : e).replace(/^multi-folder:\s*/, ''),
          }
        }
      },
    })
  })

  // ------------------------------------------ sessionless remote API mounts
  // The plain-object service must be reachable through ctx.get('multiFolder')
  // with a visible typertRemote binding, and the typert registry entry makes
  // the endpoints claimable on the shared /api channel. Both are owned by
  // this plugin fiber, so unloading the plugin withdraws them together.
  ctx.provide('multiFolder', multiFolderApi)
  ctx.inject(['typert'], (t) => t.typert.register(REMOTE_CONTRIBUTION))
}
```

</details>

#### 缺口

- 具体宿主/OS下端到端跨仓成功率、配置冲突恢复和用户核对工时
  **影响**：不能把减少切cwd等同已验证净节时或跨仓一致交付
  **进一步探讨**：固定多仓任务与宿主提交，对照切会话基线，计正确修改/权限误配/恢复及总时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐与未来方案从哪里推导？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察。保持模式和单根执行的设计有明确价值，源码也认真适配后台取消与错误；影响默认采用的具体条件是有损workspace身份、保存失败仍更新内存、仅本层exact-file守卫和RPC/native降级的信任假设。继续探讨可先用可信单用户、路径键不碰撞且store不落任何Agent写根的受控项目，清楚列出选目录就是授予当前模式写/exec权限；不把普通文件导航UI当无副作用设置。

未来方向可为“有版本的目录授权凭据”。参照现有字符串→JSON和隐式standing reroot，将canonical workspace稳定身份、canonical副根、授权用户/宿主模式条件、revision与失效事件绑定；先CAS持久化再发布内存快照，所有当前session通知同一revision，picker/reveal要求明确本地UI能力，拦截按凭据复核最终root。最小反例用/a/b与/a-b、POSIX大小写/中文碰撞、配置写失败并发、祖先覆盖store、符号链接变更、远程无picker服务及老请求后到。若仍错用其他项目授权、报失败却生效或无人UI副作用，则否定安全/一致性；若增加操作负担却不减少错误则否定经济性。未验证，未计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:95-97](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L95-L97)

身份基线。

```text
const configDir = () => join(process.env.DSH_HOME || join(os.homedir(), '.dsh'), 'storages', 'multi-folder')
const configFileName = (ws) => String(ws).replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.json'
const configPathFor = (ws) => join(configDir(), configFileName(ws))
```

**依据 2 · 源码核查**：[lib/index.js:254-300](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L254-L300)

非事务内存。

<details>
<summary>查看原文（47行）</summary>

```text

  const coreAdd = async (ws, path) => {
    ws = requireWorkspace(ws)
    if (typeof path !== 'string' || path.length === 0) throw new Error('add requires a path')
    if (!isAbsolute(path)) throw new Error('add requires an absolute path')
    const canonical = await canonicalizeAbs(path)
    if (canonical === null) throw new Error('cannot resolve path "' + path + '"')
    const entry = await loadDirs(ws)
    const next = sanitizeDirs([...entry.dirs, canonical], ws)
    const changed = next.length !== entry.dirs.length
    entry.dirs = next
    if (changed) await saveDirs(ws, next)
    return { workspace: ws, dirs: [...next], changed }
  }

  const coreRemove = async (ws, path) => {
    ws = requireWorkspace(ws)
    if (typeof path !== 'string' || path.length === 0) throw new Error('remove requires a path')
    const canonical = await canonicalizeAbs(path)
    const key = wsKey(canonical === null ? path : canonical)
    const entry = await loadDirs(ws)
    const next = entry.dirs.filter((d) => wsKey(d) !== key)
    const changed = next.length !== entry.dirs.length
    entry.dirs = next
    if (changed) await saveDirs(ws, next)
    return { workspace: ws, dirs: [...next], changed }
  }

  const coreSet = async (ws, paths) => {
    ws = requireWorkspace(ws)
    if (!Array.isArray(paths)) throw new Error('set requires an array of absolute paths')
    const canon = []
    for (const p of paths) {
      if (!isAbsolute(p)) throw new Error('set requires absolute paths')
      const c = await canonicalizeAbs(p)
      if (c === null) throw new Error('cannot resolve path "' + p + '"')
      canon.push(c)
    }
    const entry = await loadDirs(ws)
    const next = sanitizeDirs(canon, ws)
    const changed = JSON.stringify(next) !== JSON.stringify(entry.dirs)
    entry.dirs = next
    if (changed) await saveDirs(ws, next)
    return { workspace: ws, dirs: [...next], changed }
  }

  // ------------------------------------------------- owned directory picker
```

</details>

**依据 3 · 源码核查**：[lib/index.js:406-426](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L406-L426)

能力降级。

<details>
<summary>查看原文（21行）</summary>

```text
  const pickViaHostService = async (signal) => {
    let picker
    try {
      picker = ctx.get('directoryPicker')
    } catch {
      picker = undefined
    }
    if (!picker || typeof picker.capability !== 'function') return null
    let capability
    try {
      capability = picker.capability()
    } catch {
      return { path: null, via: 'unavailable' }
    }
    if (!capability || capability.kind !== 'native') return { path: null, via: 'unavailable' }
    if (typeof capability.pick !== 'function') return null
    const selected = await capability.pick(signal)
    return { path: typeof selected === 'string' && fullyQualified(selected) ? selected : null, via: 'host-native' }
  }

  /**
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1440-1458](https://github.com/AngelosZou/dsh-multi-folder/blob/445a803cdfdb917ab6d46b09aaf700be36bbf186/lib/index.js#L1440-L1458)

守卫/根匹配。

<details>
<summary>查看原文（19行）</summary>

```text
        )
        if (guardHits.has(wsKey(abs))) {
          return {
            isError: true,
            error: { message: 'multi-folder configuration is user-managed' },
            content: [{ type: 'text', text: CONFIG_GUARD_TEXT }],
          }
        }
        // A target inside the PRIMARY workspace is the default pipeline's call.
        // Intercepting it would re-root the policy at an ANCESTOR secondary
        // directory (a configured parent of this workspace matches the target
        // too) and grant more than the call needs; the default pipeline already
        // serves it with the exact standing root.
        if (typeof primary === 'string' && primary.length > 0 && pathInside(abs, primary)) return next()
        if (dirs === null) return next()
        const hit = longestRootFirst(dirs).find((d) => pathInside(abs, d))
        if (hit === undefined) return next()
        const policy = { ...standing, workspaceRoot: hit }

```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
