# DSH Python Env

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d24039c](https://github.com/AngelosZou/dsh-python-env/tree/d24039c579b644101577383ef5734fff78d43439)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-python-env) [![npm 30d 1,121](https://img.shields.io/static/v1?label=npm+30d&message=1%2C121&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-python-env) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-python-env)
<!-- END META -->

> **实现功能**：管理工作区Python虚拟环境，提供发现、创建、安装、卸载和删除工具。

> **核心亮点**：将host侧venv/pip接入会话写权限、镜像回退和job状态，减少环境准备的人工交接；核心包管理来自Python。[Q03](#research-q03)

> **风险与缺陷**：词法路径检查不等于进程隔离，第三方构建仍拥有host权限，符号链接与pip选项需独立检验。[Q04](#research-q04)

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
  - [Q01 · 什么情况下host侧venv管理有价值？](#detail-section-11)
  - [Q02 · 如何选择环境、执行安装并回报状态？](#detail-section-12)
  - [Q03 · 比外部终端脚本增加了什么？](#detail-section-13)
  - [Q04 · “工作区限定”是否等于所有执行被隔离？](#detail-section-14)
  - [Q05 · 加载、权限及重试依赖是什么？](#detail-section-15)
  - [Q06 · 成本和效果如何计量？](#detail-section-16)
  - [Q07 · 哪些工程设计可借鉴？](#detail-section-17)
  - [Q08 · 由边界限制可推导何种改进？](#detail-section-18)
  - [Q09 · 谁应试用，怎样验收？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标用户是在DSH沙箱shell里遇到venv、临时目录或网络安装失败的开发者。合格结果是项目解释器能导入所需固定版本包，并可删除环境，不影响全局Python。简单替代是开发者在外部终端创建venv或使用uv；这里的增量是让Agent调用受控工具完成环境准备，而不是新的Python包管理器。

简单替代为外部终端python -m venv及固定版本pip安装；uv为另一环境管理路线，本次未做外部性能比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|pyenv_discover|发现环境及解释器|范围受深度与工作区约束|
|pyenv_create|创建标准venv|需可写模式和Python|
|pyenv_install|安装并处理网络回退|host权限执行包，非隔离构建|
|pyenv_uninstall|卸载环境内包|需明确目标环境|
|pyenv_remove|删除带标记的环境|需核对目录和标记|
|python-env|指导Agent使用环境工具|提示指导不等于权限约束|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node>=20与DSH宿主服务|启动必需|工具、job及策略|加载或操作失败|
|Python>=3.8|操作必需|venv与pip|需用户准备|
|可信包与索引|联网安装必需|供应依赖|不能保证安全安装|
|multi-folder|可选|扩展允许根目录|仍限主工作区|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|用户加载后重启backend|新会话出现五工具|
|选择|模型discover或显式venv|确认目标解释器|
|安装|模型固定包与索引|记录attempts，导入验证|
|恢复|用户核对部分状态再卸载或重建|不把超时当回滚|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|Python与包存储，金额未知|重启backend并核对解释器，耗时未知|需要可用宿主服务|
|持续使用|下载、构建和cache，金额未知|核对版本与目标venv，耗时未知|2分钟调用预算|
|失败恢复|重试或重建环境，金额未知|检查部分安装与依赖冲突，耗时未知|终止不等于回滚|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|环境管理|五工具和自动补修pip链路存在|真实平台成功率|
|权限|变更前检查会话可写模式|第三方包的全局副作用|
|恢复|网络错误触发回退并回报尝试|端到端节时及重试成本|

> **思考**：词法路径检查不等于进程隔离，第三方构建仍拥有host权限，符号链接与pip选项需独立检验。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将host侧venv/pip接入会话写权限、镜像回退和job状态，减少环境准备的人工交接；核心包管理来自Python。[Q03](#research-q03)

将host侧venv/pip接入会话写权限、镜像回退和job状态，减少环境准备的人工交接；核心包管理来自Python。[Q03](#research-q03)

职责拆为policy、guard、venv、pip和runner，方便单独检验；工具声明变更不可并发，降低同环境竞争。测试源码包含词法越界和辅助根目录覆盖，但这些用例不能证明真实文件系统符号链接隔离，也未在本轮执行。删除前检查pyvenv.cfg是防误删的一层证据，不是密码学环境身份，标记文件可被普通目录拥有。可借鉴fail-closed策略和带尝试链的失败说明，复用需匹配宿主服务语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

词法路径检查不等于进程隔离，第三方构建仍拥有host权限，符号链接与pip选项需独立检验。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

可信代码仓库的开发者可在一次性工作区试用。先显式选venv、固定包版本与可信索引，检查只读模式拒绝变更，再核查导入、卸载、删除及失败后部分状态。需要不可信代码执行隔离的团队应先观察，不能依赖本插件的路径检查替代OS沙箱。本次未安装或验收宿主，不支持直接“值得安装”的结论。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码与测试定义；没有运行目标代码，host隔离效果及未来假设未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/guard.js、lib/policy.js、lib/tools/install.js、lib/tools/remove.js、lib/pip.js、lib/venv.js、lib/skill.js、test/guard.test.js、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口、路径与权限控制、venv选择、pip尝试链及测试定义，未执行目标代码，不确认平台兼容或隔离保证。
- 下一步：在可丢弃工作区核查只读拒绝、固定包导入、失败恢复、symlink与pip参数边界，并计量与手动路线的总投入。

**分析版本**

- **仓库**：[AngelosZou/dsh-python-env](https://github.com/AngelosZou/dsh-python-env)
- **版本号**：0.1.2（[固定提交 d24039c](https://github.com/AngelosZou/dsh-python-env/tree/d24039c579b644101577383ef5734fff78d43439)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把允许包规格、完整真实路径和审批后的索引记录成安装计划，执行前显示目标与副作用，配合隔离构建，可保留自动配置便利而缩小host写入范围。推导来自词法guard和host pip的边界差距。最小验证使用常规wheel、源码构建包、符号链接及异常pip选项，对比当前与受限计划路线的拒绝准确性、完成率与额外人工；若合法任务阻塞而越界仍可发生，则否定该方案。 [Q08](#research-q08)

在可丢弃工作区核查只读拒绝、固定包导入、失败恢复、symlink与pip参数边界，并计量与手动路线的总投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 735 | — | — | 6673 |
| .js | source | 20 | 2205 | 1639 | 464 | — |
| .js | test | 10 | 1267 | 1119 | 65 | — |
| .mjs | test | 1 | 51 | 37 | 11 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AngelosZou/dsh-python-env/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：host侧Python环境工具能否减少沙箱安装失败，同时保留可信的权限和恢复边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么情况下host侧venv管理有价值？

**研究主题**：场景与需求

#### 完整回答

目标用户是在DSH沙箱shell里遇到venv、临时目录或网络安装失败的开发者。合格结果是项目解释器能导入所需固定版本包，并可删除环境，不影响全局Python。简单替代是开发者在外部终端创建venv或使用uv；这里的增量是让Agent调用受控工具完成环境准备，而不是新的Python包管理器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4-35](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/index.js#L4-L35)

源码注释明确沙箱与host执行的动机和工具边界。

<details>
<summary>查看原文（32行）</summary>

```text
 * Workspace-scoped Python virtual environment management for agents, built
 * around one core insight: the DSH shell sandbox blocks pip's temporary
 * directories and package-index network access, while plugin code runs in
 * the host process. This plugin therefore executes python/pip/venv through
 * the platform subprocess service (the graphlint channel) and compensates
 * for the unrestricted token with strict workspace confinement:
 *
 * 1. Five model-facing tools:
 *    - pyenv_discover — find environments (pyvenv.cfg marker or conventional
 *      names) up to two levels deep and report interpreter/version/pip.
 *    - pyenv_create — standard-library `python -m venv`, verified base
 *      interpreter, idempotent on existing environments.
 *    - pyenv_install — resolve target (explicit / discovered / auto-created
 *      .venv), repair pip via ensurepip, run pip through the mirror/proxy
 *      fallback chain; upgrade flag and workspace-confined editable installs;
 *      foreground or background via ctx.jobs.
 *    - pyenv_uninstall — remove packages from a workspace environment
 *      (`pip uninstall`, offline; never auto-creates an environment).
 *    - pyenv_remove — delete a real environment only.
 * 2. Every model-influenced path resolves through guardWorkspacePath and
 *    must stay inside the session workspace (case-insensitively on Windows).
 *    All plugin state lives under <workspace>/.dsh-pyenv (pip cache, tmp);
 *    children get TMP/TEMP/TMPDIR + PIP_CACHE_DIR re-pointed there, so the
 *    global Python environment, host pip cache, and system temp are never
 *    touched. Commands are argv arrays — no shell interpolation anywhere.
 * 3. Standard library only: no uv/virtualenv dependency. Cross-platform
 *    layouts (Scripts vs bin), interpreter chains (python/py -3 vs
 *    python3/python), and mirror fallback (default -> TUNA -> Aliyun ->
 *    USTC, plus one common-local-proxy-port probe) are built in.
 * 4. Session policy parity: the mutating tools consult the session's
 *    standing sandbox policy and refuse to run in read-only sessions —
 *    host-side execution must not outrank the granted mode.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何选择环境、执行安装并回报状态？

**研究主题**：功能与机制

#### 完整回答

入口注册五个工具、python-env Skill和提示段。install先核查会话可写权限，再收集允许的辅助根目录、设定cache/tmp、验证requirements路径、选择已有venv或创建.venv。后续ensurepip补修并执行pip尝试链，前台返回结果或注册后台job。多个候选优先名为.venv者，否则要求明确选择；多根目录中第一个.venv的发现次序仍影响默认目标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools/install.js:158-210](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js#L158-L210)

安装前置步骤与整调用deadline。

<details>
<summary>查看原文（53行）</summary>

```text
      isConcurrencySafe: () => false,
      async execute(args, exec) {
        try {
          const ws = sessionCwd(exec)
          assertWritableSession(ctx, exec, 'install packages')
          const extraRoots = await secondaryDirs(ctx, ws)
          await ensureEnvDirs(ws)
          const env = pythonChildEnv(ws)
          const subprocess = ctx.get('subprocess')
          if (subprocess === undefined) {
            throw new Error('dsh-python-env: no subprocess service is mounted (cannot install packages)')
          }
          // Per-call budget: model override allowed but capped at the 2-minute
          // ceiling — environment management must never run for tens of minutes.
          const budgetMs = Math.min(Number(args.timeoutMs) > 0 ? Number(args.timeoutMs) : DEFAULT_INSTALL_TIMEOUT_MS, MAX_TOOL_TIMEOUT_MS)

          const specs = []
          if (args.packages !== undefined) {
            if (!Array.isArray(args.packages)) throw new Error('packages must be an array of requirement strings')
            for (const raw of args.packages) {
              const spec = typeof raw === 'string' ? raw.trim() : ''
              if (spec.length === 0) continue
              if (spec.length > MAX_SPEC_LENGTH) {
                throw new Error('package spec too long (max ' + MAX_SPEC_LENGTH + '): ' + spec.slice(0, 80) + '...')
              }
              specs.push(spec)
            }
            if (specs.length > MAX_PACKAGES) throw new Error('too many packages (max ' + MAX_PACKAGES + ')')
          }
          let requirementsPath
          if (args.requirements !== undefined && String(args.requirements).trim().length > 0) {
            requirementsPath = guardAllowedPath(args.requirements, ws, extraRoots, 'requirements')
            const info = await stat(requirementsPath)
            if (!info.isFile()) throw new Error('requirements is not a file: ' + requirementsPath)
          }
          if (specs.length === 0 && requirementsPath === undefined) {
            throw new Error('nothing to install: pass "packages" and/or a "requirements" file')
          }
          const normalizedSpecs = validateAndNormalizeSpecs(specs, ws, extraRoots)

          // Resolve the target environment (shared logic with pyenv_uninstall).
          let venvDir = await resolveExistingVenv(ws, args.venv, extraRoots)
          let created = false
          if (venvDir === null) {
            venvDir = join(ws, DEFAULT_VENV_NAME)
            created = true
          }

          // Plugin-owned deadline covering the whole call: when it fires, the
          // live subprocess tree is terminated and a detailed stop-reason is
          // returned instead of the result (or a bare timeout error).
          let current = null
          const deadline = armDeadline(budgetMs, () => current)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比外部终端脚本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

增量是把宿主侧pip、工作区目标选择、会话写权限、镜像代理回退与可追踪job组合成模型工具。相对手动终端减少解释器路径与失败重试交接，相对裸host执行补充权限检查。venv和pip能力仍归Python标准工具，网络分类与工具编排是本项目实现；没有证明整体更快或比uv更可靠。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pip.js:195-232](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/pip.js#L195-L232)

区分网络失败并按index和proxy重试。

<details>
<summary>查看原文（38行）</summary>

```text
  const pinnedIndex = normalizeIndexUrl(index)
  const explicitProxy = normalizeProxyUrl(proxy)
  const ambient = explicitProxy === undefined ? ambientProxyEnv() : undefined
  const attempts = pinnedIndex !== undefined ? [{ id: 'custom-index', indexUrl: pinnedIndex }] : DEFAULT_INDEXES
  let proxyUrl = explicitProxy !== undefined ? explicitProxy : normalizeProxyUrl(ambient)
  const probeFn = probeProxy !== undefined ? probeProxy : probeLocalProxyPorts
  let probedLocal = false
  const tried = []
  let last = null

  for (let i = 0; i < attempts.length; i += 1) {
    if (shouldStop !== undefined && shouldStop()) break
    const attempt = attempts[i]
    const argv = buildInstallArgv({ venvPython, specs, requirementsPath, indexUrl: attempt.indexUrl, proxyUrl, upgrade })
    // Short grace: when a deadline fires, the tree must settle fast so the
    // tool can return its detailed stop-reason close to the time budget.
    const spec = { argv, cwd, stdio: stdioSpec(), graceMs: 5_000, env }
    const result = await runForegroundWith(signal, subprocess, spec, onSpawn)
    tried.push(shapeAttempt(attempt.id, proxyUrl, result.exitCode))
    last = { result, argv }
    if (onAttempt !== undefined) onAttempt(result)
    if (result.exitCode === 0) {
      return { ok: true, result, tried, indexUsed: attempt.id, proxyUsed: proxyUrl === undefined ? null : proxyUrl }
    }
    if (shouldStop !== undefined && shouldStop()) break
    if (classifyNetworkFailure(result.stderr.text)) {
      if (proxyUrl === undefined && !probedLocal) {
        probedLocal = true
        const port = await probeFn()
        if (port !== null && port !== undefined) {
          proxyUrl = 'http://127.0.0.1:' + port
          i -= 1 // retry the same index through the discovered proxy
          continue
        }
      }
      continue // next mirror
    }
    break // non-network failure: surface immediately
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “工作区限定”是否等于所有执行被隔离？

**研究主题**：缺陷与关键质疑

#### 完整回答

不是。guard使用resolve/relative做词法包含判断，未在此边界解析真实路径；工作区内指向外部的符号链接需要额外验证。更根本地，pip构建及包代码在host权限下运行，路径检查不能限制任意构建脚本副作用。普通spec还直接传入pip参数，不能将argv无shell解释等同pip选项安全。结论限于发现控制边界，未执行越界验证；只适合可信项目和依赖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/guard.js:45-66](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/guard.js#L45-L66)

路径控制为词法路径比较，而非OS隔离。

<details>
<summary>查看原文（22行）</summary>

```text
export function guardWorkspacePath(requested, sessionRoot, label) {
  const root = resolve(sessionRoot)
  const target = resolve(root, requested === undefined || String(requested).trim().length === 0 ? root : requested)
  if (isWithin(root, target)) return target
  throw new OutsideWorkspaceError(target, root, label)
}

/**
 * Multi-root guard: the primary workspace plus optional extra roots
 * (e.g. dsh-multi-folder secondary working directories). Relative paths
 * still resolve against the primary workspace; an absolute target is
 * accepted when it lands inside ANY allowed root. With no extra roots this
 * is exactly guardWorkspacePath.
 */
export function guardAllowedPath(requested, sessionRoot, extraRoots, label) {
  const primary = resolve(sessionRoot)
  const target = resolve(primary, requested === undefined || String(requested).trim().length === 0 ? primary : requested)
  const roots = [primary, ...(Array.isArray(extraRoots) ? extraRoots : [])]
  for (const root of roots) {
    if (isWithin(resolve(root), target)) return target
  }
  throw new OutsideWorkspaceError(target, primary, label)
```

</details>

#### 缺口

- 符号链接和pip参数的实际副作用没有受控复现
  **影响**：不能确认所有写入仅限工作区
  **进一步探讨**：在隔离宿主用外部哨兵文件与可控构建包检验写入范围，并审查参数白名单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 加载、权限及重试依赖是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要Node>=20、DSH tools/skills/subprocess/jobs/sandboxPolicy/systemPrompt和可用Python。策略服务缺失或非可写模式直接拒绝变更，发现工具仍可用于探测。联网安装依赖索引与代理；自定义index可关闭镜像链。安装不是自动审核包来源，多工作区兼容为可选。失败应根据返回attempts与pip输出区分依赖解析错误、网络错误和环境损坏。

#### 证据与依据

**依据 1 · 源码核查**：[lib/policy.js:12-40](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/policy.js#L12-L40)

缺策略服务fail closed与可写模式白名单。

<details>
<summary>查看原文（29行）</summary>

```text
export const WRITABLE_MODES = ['workspace-write', 'danger-full-access']

/** The session's standing sandbox mode, or undefined when unmountable. */
export function sessionSandboxMode(ctx, exec) {
  const sandboxPolicy = ctx.get('sandboxPolicy')
  if (sandboxPolicy === undefined || typeof sandboxPolicy.resolve !== 'function') return undefined
  const standing = sandboxPolicy.resolve(exec && exec.agent ? { session: exec.agent.session } : {})
  return standing && typeof standing.mode === 'string' ? String(standing.mode) : undefined
}

/**
 * Allow only when the session's mode grants workspace writes. Throws
 * otherwise — including when no policy service is mounted (the plugin
 * cannot verify permission, so it must not proceed).
 */
export function assertWritableSession(ctx, exec, action) {
  const mode = sessionSandboxMode(ctx, exec)
  if (mode === undefined) {
    throw new Error(
      "dsh-python-env: cannot " + action + ': no sandbox policy service is mounted, so the session\'s write permission cannot be verified',
    )
  }
  if (!WRITABLE_MODES.includes(mode)) {
    throw new Error(
      'dsh-python-env: cannot ' + action + ': the session is in "' + mode +
        '" mode, which forbids workspace mutations. Switch the session to workspace-write or danger-full-access first.',
    )
  }
  return mode
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本和效果如何计量？

**研究主题**：效果与总成本

#### 完整回答

以“环境中固定包可导入且可清理”为合格单位。首次要加载插件、重启backend并核对基础解释器；持续成本是包下载、磁盘、构建及人工核对；2分钟预算限制单调用等待但大包可能需重新规划。失败后不能把终止当回滚，应检查部分安装或重建venv。镜像回退增加请求和供应链选择，现金与耗时均无实测；未证明比手动终端减少端到端时间。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools/install.js:170-210](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js#L170-L210)

整调用预算覆盖准备与安装。

<details>
<summary>查看原文（41行）</summary>

```text
          // Per-call budget: model override allowed but capped at the 2-minute
          // ceiling — environment management must never run for tens of minutes.
          const budgetMs = Math.min(Number(args.timeoutMs) > 0 ? Number(args.timeoutMs) : DEFAULT_INSTALL_TIMEOUT_MS, MAX_TOOL_TIMEOUT_MS)

          const specs = []
          if (args.packages !== undefined) {
            if (!Array.isArray(args.packages)) throw new Error('packages must be an array of requirement strings')
            for (const raw of args.packages) {
              const spec = typeof raw === 'string' ? raw.trim() : ''
              if (spec.length === 0) continue
              if (spec.length > MAX_SPEC_LENGTH) {
                throw new Error('package spec too long (max ' + MAX_SPEC_LENGTH + '): ' + spec.slice(0, 80) + '...')
              }
              specs.push(spec)
            }
            if (specs.length > MAX_PACKAGES) throw new Error('too many packages (max ' + MAX_PACKAGES + ')')
          }
          let requirementsPath
          if (args.requirements !== undefined && String(args.requirements).trim().length > 0) {
            requirementsPath = guardAllowedPath(args.requirements, ws, extraRoots, 'requirements')
            const info = await stat(requirementsPath)
            if (!info.isFile()) throw new Error('requirements is not a file: ' + requirementsPath)
          }
          if (specs.length === 0 && requirementsPath === undefined) {
            throw new Error('nothing to install: pass "packages" and/or a "requirements" file')
          }
          const normalizedSpecs = validateAndNormalizeSpecs(specs, ws, extraRoots)

          // Resolve the target environment (shared logic with pyenv_uninstall).
          let venvDir = await resolveExistingVenv(ws, args.venv, extraRoots)
          let created = false
          if (venvDir === null) {
            venvDir = join(ws, DEFAULT_VENV_NAME)
            created = true
          }

          // Plugin-owned deadline covering the whole call: when it fires, the
          // live subprocess tree is terminated and a detailed stop-reason is
          // returned instead of the result (or a bare timeout error).
          let current = null
          const deadline = armDeadline(budgetMs, () => current)
```

</details>

#### 缺口

- 缺少代表性包安装的耗时、成功率及恢复投入
  **影响**：不能给出单位成本或节省比例
  **进一步探讨**：按同版本包集记录终端与工具两条路线的全部重试、人工时间和成功导入情况

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些工程设计可借鉴？

**研究主题**：工程质量与复用

#### 完整回答

职责拆为policy、guard、venv、pip和runner，方便单独检验；工具声明变更不可并发，降低同环境竞争。测试源码包含词法越界和辅助根目录覆盖，但这些用例不能证明真实文件系统符号链接隔离，也未在本轮执行。删除前检查pyvenv.cfg是防误删的一层证据，不是密码学环境身份，标记文件可被普通目录拥有。可借鉴fail-closed策略和带尝试链的失败说明，复用需匹配宿主服务语义。

#### 证据与依据

**依据 1 · 源码核查**：[test/guard.test.js:6-58](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/test/guard.test.js#L6-L58)

测试覆盖词法判断及辅助根目录，并未覆盖真实symlink。

<details>
<summary>查看原文（53行）</summary>

```text
test('isWithin: equality and containment', () => {
  assert.equal(isWithin('/a/b', '/a/b'), true)
  assert.equal(isWithin('/a/b', '/a/b/c'), true)
  assert.equal(isWithin('/a/b', '/a/b/c/d/e'), true)
})

test('isWithin: siblings and ancestors are outside', () => {
  assert.equal(isWithin('/a/b', '/a/bc'), false, 'sibling with common prefix')
  assert.equal(isWithin('/a/b', '/a'), false, 'ancestor')
  assert.equal(isWithin('/a/b', '/a/c'), false, 'sibling')
  assert.equal(isWithin('/a/b', '/'), false, 'root')
})

test('isWithin: windows case-insensitivity', () => {
  assert.equal(isWithin('C:\\Workspace', 'c:\\workspace\\venv', 'win32'), true)
  assert.equal(isWithin('C:\\Workspace', 'C:\\Workspace', 'win32'), true)
  assert.equal(isWithin('C:\\Workspace', 'C:\\Workspace2', 'win32'), false)
  assert.equal(isWithin('C:\\Workspace', 'C:\\Other\\venv', 'win32'), false)
})

test('guardWorkspacePath: resolves inside the workspace', () => {
  const ws = join('X:', 'ws') // platform-agnostic-ish: works for containment math on any OS
  assert.equal(guardWorkspacePath(undefined, ws), ws)
  assert.equal(guardWorkspacePath('', ws), ws)
  assert.equal(guardWorkspacePath('.venv', ws), join(ws, '.venv'))
  assert.equal(guardWorkspacePath(join(ws, 'a', '..', '.venv'), ws), join(ws, '.venv'), 'dot-dot that stays inside is allowed')
})

test('guardWorkspacePath: rejects escapes', () => {
  const ws = join('X:', 'ws')
  assert.throws(() => guardWorkspacePath('..', ws), OutsideWorkspaceError)
  assert.throws(() => guardWorkspacePath(join('X:', 'other'), ws), OutsideWorkspaceError)
  assert.throws(() => guardWorkspacePath(join(ws, '..', '..', 'escape'), ws), OutsideWorkspaceError)
  const error = (() => {
    try {
      guardWorkspacePath('..', ws, 'venv')
    } catch (e) {
      return e
    }
  })()
  assert.match(String(error.message), /venv must stay inside/)
})

test('guardAllowedPath: extra roots extend the allowed set', () => {
  const ws = join('X:', 'ws')
  const sec = join('X:', 'sec')
  assert.equal(guardAllowedPath(sec, ws, [sec]), sec)
  assert.equal(guardAllowedPath(join(sec, '.venv'), ws, [sec]), join(sec, '.venv'))
  assert.equal(guardAllowedPath('.venv', ws, [sec]), join(ws, '.venv'), 'relative paths stay primary')
  assert.equal(guardAllowedPath(undefined, ws, [sec]), ws)
  assert.throws(() => guardAllowedPath(join('X:', 'other'), ws, [sec]), OutsideWorkspaceError)
  assert.throws(() => guardAllowedPath(join(ws, '..', 'escape'), ws, [sec]), OutsideWorkspaceError)
  assert.equal(guardAllowedPath(join(ws, '.venv'), ws, []), join(ws, '.venv'), 'no extra roots = guardWorkspacePath')
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由边界限制可推导何种改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把允许包规格、完整真实路径和审批后的索引记录成安装计划，执行前显示目标与副作用，配合隔离构建，可保留自动配置便利而缩小host写入范围。推导来自词法guard和host pip的边界差距。最小验证使用常规wheel、源码构建包、符号链接及异常pip选项，对比当前与受限计划路线的拒绝准确性、完成率与额外人工；若合法任务阻塞而越界仍可发生，则否定该方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools/install.js:50-83](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/install.js#L50-L83)

只特殊处理editable规格，其他spec原样进入后续argv。

<details>
<summary>查看原文（34行）</summary>

```text
function validateAndNormalizeSpecs(specs, ws, extraRoots) {
  const out = []
  for (let i = 0; i < specs.length; i += 1) {
    const spec = specs[i]
    if (spec === '-e' || spec === '--editable') {
      if (i + 1 >= specs.length) throw new Error('editable spec "' + spec + '" is missing its project path')
      out.push(spec, editablePath(specs[i + 1], ws, extraRoots))
      i += 1
      continue
    }
    const longForm = /^--editable=(.+)$/.exec(spec)
    if (longForm !== null) {
      out.push('--editable=' + editablePath(longForm[1], ws, extraRoots))
      continue
    }
    const shortForm = /^-e(.+)$/.exec(spec)
    if (shortForm !== null) {
      out.push('-e', editablePath(shortForm[1], ws, extraRoots))
      continue
    }
    out.push(spec)
  }
  return out
}

function editablePath(raw, ws, extraRoots) {
  const text = String(raw).trim()
  if (text.length === 0) throw new Error('editable install requires a project path')
  if (/^(git|hg|svn|bzr)\+/.test(text) || /^https?:\/\//i.test(text)) {
    throw new Error(
      'editable install from ' + text.slice(0, 40) + ' is not supported: only local editable paths inside the session workspace are allowed (clone the project into the workspace first, or install it as a plain VCS requirement spec)',
    )
  }
  return guardAllowedPath(text, ws, extraRoots, 'editable path')
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁应试用，怎样验收？

**研究主题**：采用判断

#### 完整回答

可信代码仓库的开发者可在一次性工作区试用。先显式选venv、固定包版本与可信索引，检查只读模式拒绝变更，再核查导入、卸载、删除及失败后部分状态。需要不可信代码执行隔离的团队应先观察，不能依赖本插件的路径检查替代OS沙箱。本次未安装或验收宿主，不支持直接“值得安装”的结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools/remove.js:54-73](https://github.com/AngelosZou/dsh-python-env/blob/d24039c579b644101577383ef5734fff78d43439/lib/tools/remove.js#L54-L73)

删除验证及副作用位置。

<details>
<summary>查看原文（20行）</summary>

```text
        try {
          const ws = sessionCwd(exec)
          assertWritableSession(ctx, exec, 'remove a virtual environment')
          const extraRoots = await secondaryDirs(ctx, ws)
          if (args.venv === undefined || String(args.venv).trim().length === 0) {
            throw new Error('venv is required: the environment directory name or path to delete')
          }
          const target = resolveVenvArg(args.venv, ws, extraRoots)
          let exists = false
          try {
            exists = (await stat(target)).isDirectory()
          } catch {
            // absent — reject below
          }
          if (!exists) throw new Error('venv not found: ' + target)
          if (!(await isVenvDir(target))) {
            throw new Error('refusing to delete a non-virtual-environment directory (no pyvenv.cfg): ' + target)
          }
          await rm(target, { recursive: true, force: true })
          return { removed: true, name: basename(target), path: target }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
