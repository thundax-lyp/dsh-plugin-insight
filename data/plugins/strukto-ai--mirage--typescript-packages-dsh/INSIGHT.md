# Mirage DSH Providers

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[62c160c](https://github.com/strukto-ai/mirage/tree/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh)

<!-- BEGIN META -->
[![GitHub ★ 3,724](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C724&color=yellow&logo=github&style=flat)](https://github.com/strukto-ai/mirage) [![npm 30d 1,080](https://img.shields.io/static/v1?label=npm+30d&message=1%2C080&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@struktoai/mirage-dsh) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@struktoai/mirage-dsh)
<!-- END META -->

> **实现功能**：将DSH文件、Shell、子进程和溢出输出接口接到Mirage虚拟工作区。

> **核心亮点**：[Q02](#research-q02)相对独立SDK工具，本组件保留DSH接口并统一fs、shell与spill世界，workspace所有权和session绑定有明确适配增量。

> **风险与缺陷**：[Q03](#research-q03)无版本backend让陈旧写保护降级，替换provider还改变host搜索/cwd语义；能加载不能等同完整兼容。

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
  - [Q01 · DSH适配组件与Mirage根平台各自负责什么？](#detail-section-11)
  - [Q02 · 如何避免文件、shell和大输出落在不同世界？](#detail-section-12)
  - [Q03 · 换provider后哪些原生行为发生变化？](#detail-section-13)
  - [Q04 · 接入和退出是否可在现有profile上安全尝试？](#detail-section-14)
  - [Q05 · 能否在加载时验证整个虚拟世界的一致性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本组件@struktoai/mirage-dsh是可加载DSH bundle，负责把DSH文件和shell接口接到Mirage挂载工作区；根项目的虚拟终端、数据源和runtime由其他包提供。目标是需要让Agent只见一组受控数据源的平台开发者，合格结果是DSH文件工具、bash和溢出结果在同一个虚拟世界读取，而不是意外回到host磁盘。原办法保留DSH默认fs/bash加外部数据工具；仅做本地编码不需要替换整套provider。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件后端 | 把文件操作导向mount | 版本token依backend |
| Shell后端 | 同工作区执行命令 | host cwd和工具有差异 |
| 输出存储 | spill留在虚拟世界 | 需配置可访问目录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH/Node与Mirage包 | 必需 | provider接线 | 加载失败 |
| workspace或mounts恰一 | 必需 | 世界所有权 | 明确拒绝配置 |
| approval | ask规则时必需 | 人工许可 | 保持pending |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 克隆profile装bundle | 默认provider已替换 |
| 2 | 配RAM/只读mount | 文件与shell同源 |
| 3 | 核对版本拒绝和spill | 异常恢复原profile |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | SDK、runtime和mount | provider/权限配置 | 迁移时间未知 |
| 持续 | backend API与job | 版本兼容维护 | 金额未知 |
| 失败恢复 | job与spill核对 | 恢复profile和存储 | RAM持久性不可假定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 同世界provider | service与session配置 | 全任务兼容 |
| 并发保护 | 有版本时token | 无版本backend降级影响 |

> **思考**：[Q03](#research-q03)无版本backend让陈旧写保护降级，替换provider还改变host搜索/cwd语义；能加载不能等同完整兼容。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)相对独立SDK工具，本组件保留DSH接口并统一fs、shell与spill世界，workspace所有权和session绑定有明确适配增量。

[Q02](#research-q02)相对独立SDK工具，本组件保留DSH接口并统一fs、shell与spill世界，workspace所有权和session绑定有明确适配增量。

owned/adopted workspace拒绝无效参数、ready错误保持可见，值得复用。移植需共同保持fs版本、shell会话、approval与spill语义；本组件统计不应包含核心平台作为自身规模。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)无版本backend让陈旧写保护降级，替换provider还改变host搜索/cwd语义；能加载不能等同完整兼容。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要让DSH仅访问受控挂载的平台开发者可在克隆profile里试用该适配。相比另加SDK工具，它把文件、shell和大输出统一到同一虚拟工作区，但真实任务兼容尚未验收。若backend版本保护或原有工具替换影响当前任务，就停止迁移并恢复原profile。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 typescript/packages/dsh/README.md、typescript/packages/dsh/package.json、typescript/packages/dsh/cordis.patch.yml、typescript/packages/dsh/src/service.ts、typescript/packages/dsh/src/fs.ts、typescript/packages/dsh/src/shell.ts、typescript/packages/dsh/src/approval.ts 及固定范围 inventory；组件：typescript/packages/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[strukto-ai/mirage](https://github.com/strukto-ai/mirage)
- **版本号**：0.0.8-alpha.2（[固定提交 62c160c](https://github.com/strukto-ai/mirage/tree/62c160c6f47d455cf1bb604ed55c419f8ed254c2)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出fs/shell/spill一致性探针的未验证假设，用版本缺失与并发任务检验预测价值。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 254 | — | — | 3996 |
| .ts | test | 10 | 3593 | 3027 | 260 | — |
| .ts | source | 16 | 3232 | 1906 | 1145 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/strukto-ai/mirage/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Mirage DSH Providers的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH适配组件与Mirage根平台各自负责什么？

**研究主题**：场景与需求、采用判断

#### 完整回答

本组件@struktoai/mirage-dsh是可加载DSH bundle，负责把DSH文件和shell接口接到Mirage挂载工作区；根项目的虚拟终端、数据源和runtime由其他包提供。目标是需要让Agent只见一组受控数据源的平台开发者，合格结果是DSH文件工具、bash和溢出结果在同一个虚拟世界读取，而不是意外回到host磁盘。原办法保留DSH默认fs/bash加外部数据工具；仅做本地编码不需要替换整套provider。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/package.json:1-12](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/package.json#L1-L12)

组件身份与仓库子路径

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@struktoai/mirage-dsh",
  "version": "0.0.8-alpha.2",
  "description": "DeepSeek Harness (dsh) providers backed by a mirage workspace: ctx.fs and ctx.shell over mounts",
  "homepage": "https://github.com/strukto-ai/mirage#readme",
  "bugs": {
    "url": "https://github.com/strukto-ai/mirage/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/strukto-ai/mirage.git",
    "directory": "typescript/packages/dsh"
```

</details>

**依据 2 · 源码核查**：[typescript/packages/dsh/cordis.patch.yml:1-9](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/cordis.patch.yml#L1-L9)

替换provider而非独立根平台

```text
# The mirage bundle patch. Applied over dsh-base by `dsh --profile <name>`
# after `dsh plugin --profile <name> add @struktoai/mirage-dsh`: it swaps
# the filesystem and shell providers for mirage-backed ones, so dsh's file
# tools and bash tool operate on a workspace of mounted VFS instead
# of the host disk.
#
# Override the `mirage` row's config in the profile's own cordis.patch.yml
# to mount real VFS (the block form is `vfs` registry name,
# `mode`, and the VFS's `config`; `!!js` expressions resolve env vars
```

#### 缺口

- 没有目标DSH部署的完整任务验收。
  **影响**：缺少实际DSH部署验收，不能把provider加载视为任务通过。
  **进一步探讨**：在克隆profile针对fs、bash、spill执行同一可丢弃文件任务并核对来源一致性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何避免文件、shell和大输出落在不同世界？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

bundle关闭host subprocess/fs/bash/PowerShell/search及spill-local，插入mirage service、fs、subprocess、shell和spill-store。service要求workspace或mounts恰一来源，owned workspace可配profiles并将ask接到宿主approval；adopted workspace不接受被忽略的构造参数且生命周期仍归embedder。shell有sessionId绑定契约，默认每命令临时fork，绑定后cd/export可持续；fs也可绑定同名session。相对直接用SDK工具，增量是保留DSH原生工具接口同时统一工作区、权限与输出存储，不把核心VFS贡献重复算到adapter。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/cordis.patch.yml:1-9](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/cordis.patch.yml#L1-L9)

替换目的

```text
# The mirage bundle patch. Applied over dsh-base by `dsh --profile <name>`
# after `dsh plugin --profile <name> add @struktoai/mirage-dsh`: it swaps
# the filesystem and shell providers for mirage-backed ones, so dsh's file
# tools and bash tool operate on a workspace of mounted VFS instead
# of the host disk.
#
# Override the `mirage` row's config in the profile's own cordis.patch.yml
# to mount real VFS (the block form is `vfs` registry name,
# `mode`, and the VFS's `config`; `!!js` expressions resolve env vars
```

**依据 2 · 源码核查**：[typescript/packages/dsh/src/service.ts:177-206](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/service.ts#L177-L206)

owned/adopted配置边界

<details>
<summary>查看原文（30行）</summary>

```text
  constructor(ctx: Context, config: MirageConfig = {}) {
    super(ctx, 'mirage')
    if (config.workspace !== undefined && config.mounts !== undefined) {
      throw new Error('mirage: pass either workspace or mounts, not both')
    }
    if (config.workspace !== undefined) {
      // An adopted workspace is already built, so runtimes and constructor
      // options can no longer reach it. Saying so beats accepting a config
      // whose runtimes silently never load, which is what the workspace and
      // mounts pair above already refuses to do.
      // `profiles` and `profile` join them for the same reason, and one
      // more: an adopted workspace's roles and its `onAsk` are the
      // embedder's own, so silently re-answering its asks through
      // `ctx.approval` would take over a seam it may already have filled.
      if (
        config.runtimes !== undefined ||
        config.workspaceOptions !== undefined ||
        config.profiles !== undefined ||
        config.profile !== undefined
      ) {
        throw new Error(
          'mirage: runtimes, profiles, profile and workspaceOptions configure a service-owned workspace, not an adopted workspace',
        )
      }
      this.built = config.workspace
      this.ready = Promise.resolve(config.workspace)
      return
    }
    if (config.mounts === undefined) {
      throw new Error('mirage: one of workspace or mounts is required')
```

</details>

**依据 3 · 源码核查**：[typescript/packages/dsh/src/service.ts:215-245](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/service.ts#L215-L245)

profile解析、approval和异步ready

<details>
<summary>查看原文（31行）</summary>

```text
    if (config.profiles !== undefined) {
      if (options.profiles !== undefined) {
        throw new Error('mirage: pass profiles or workspaceOptions.profiles, not both')
      }
      options.profiles = parseProfiles(config.profiles)
    }
    if (config.profile !== undefined) {
      if (options.profile !== undefined) {
        throw new Error('mirage: pass profile or workspaceOptions.profile, not both')
      }
      options.profile = config.profile
    }
    // How an asked line gets answered. Installed for every service-owned
    // workspace rather than only under a composed `ctx.approval`, because
    // the two are one answer to mirage (an unset `onAsk` and a handler
    // returning null both leave the ask pending) and installing always is
    // what finds an approver composed after this plugin. An explicit
    // `workspaceOptions.onAsk` is the embedder's decision and stands.
    options.onAsk ??= askThroughApproval(ctx)
    this.plannedRuntimes = options.runtimes?.map(builtEntry)
    if (this.plannedRuntimes !== undefined) options.runtimes = [...this.plannedRuntimes]
    const blocks = Object.values(config.mounts).some(isMountBlock)
    if (blocks) {
      this.ready = this.open(config.mounts, options)
      // A declarative mount resolves asynchronously and nothing awaits
      // `ready` until a provider's first call, so a failure here would
      // reach the process as an unhandled rejection and take the whole
      // harness down over a typo in a patch file. This only marks the
      // rejection observed; `ready` still rejects for every real caller,
      // and the disposer below still sees it.
      void this.ready.catch(() => undefined)
```

</details>

**依据 4 · 源码核查**：[typescript/packages/dsh/src/shell.ts:91-113](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/shell.ts#L91-L113)

持续session与临时fork语义

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * Bind every command to this named workspace session. By default each
   * command runs in an ephemeral fork of the workspace's default session,
   * so nothing persists between calls, which is the one-shot contract of
   * dsh's bash tool. With a session bound, `cd`, `export`, and function
   * definitions persist across calls, the persistent-shell contract. The
   * session is created on first use if the workspace does not have it; an
   * existing session is adopted as is. While one command still runs in the
   * session (one left running in the background), the next runs on a copy
   * of the session beside it rather than waiting for it to end, so its
   * `cd` and `export` last for that command alone.
   *
   * A spec carrying an explicit `env`, or a `workdir` that names a real
   * directory in this world, still runs as a one-call subshell of the
   * bound session, per mirage's `ExecuteOptions` semantics: both say
   * "just for this command". The two things dsh injects on every call
   * are deliberately not read that way, since neither carries that
   * intent and either would fork every command and leave the binding
   * with nothing to persist. A workdir resolved on the harness's own
   * machine names nothing here and is dropped; the managed `DSH_*`
   * snapshot is seeded into the session instead.
   */
  sessionId?: string
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 换provider后哪些原生行为发生变化？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

host目录cwd在虚拟世界可能没有意义，bundle因此说明忽略host工作目录；PowerShell和host ripgrep搜索被禁用，用户必须用虚拟shell能力替代。fs版本token优先fingerprint/revision，若后端连modified/size也不提供则返回unversioned，陈旧写保护降级为always-fresh，不能当严格并发保护。ask桥在调用时寻找live approver，缺approval保持pending而非自动允许。完整权限边界仍依赖Mirage配置与backend，不能只凭read-only字样断言隔离。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/src/fs.ts:70-80](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/fs.ts#L70-L80)

版本保护降级条件

<details>
<summary>查看原文（11行）</summary>

```text
// The freshness token behind FsVersion. Backends that report a fingerprint
// or revision get a content-derived token; the rest fall back to metadata
// (modified + size), and a backend reporting neither yields a constant, so
// stale guards degrade to always-fresh there instead of always-stale.
function versionOf(stat: FileStat): FsVersion {
  if (stat.fingerprint !== null) return FsVersion(`fp:${stat.fingerprint}`)
  if (stat.revision !== null) return FsVersion(`rev:${stat.revision}`)
  if (stat.modified !== null || stat.size !== null) {
    return FsVersion(`meta:${stat.modified ?? ''}:${String(stat.size ?? '')}`)
  }
  return FsVersion('unversioned')
```

</details>

**依据 2 · 源码核查**：[typescript/packages/dsh/src/approval.ts:56-84](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/approval.ts#L56-L84)

动态发现approver及缺失语义

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * dsh's approval channel, or null when the composition has none.
 *
 * Read through `ctx.get`, not as `ctx.approval`. A plain property read
 * of a service this plugin does not `inject` does not answer undefined,
 * it throws (`cannot get property "approval" without inject`), so
 * probing that way would turn every ask in a composition without an
 * approver into a thrown error instead of a pending one. `ctx.get` is
 * cordis's documented read "without the inject requirement", and its
 * default strictness answers only a provider whose fiber is live, so an
 * unloaded approval plugin reads as absent rather than as a stale
 * channel nobody is listening on.
 *
 * Declaring `inject` instead would be wrong in the other direction: it
 * would make an approval channel a load requirement, and a headless
 * composition that legitimately has none would fail to compose at all.
 *
 * Read at ask time rather than captured when the plugin loads, because
 * cordis composes plugins in whatever order the profile lists them and a
 * snapshot taken at load would miss an approver registered after this.
 *
 * @param ctx the cordis context to read.
 * @returns the approver, or null when nothing provides one.
 */
export function approverOf(ctx: Context): Approver | null {
  const held: unknown = ctx.get('approval')
  if (held === null || typeof held !== 'object') return null
  const { request } = held as { request?: unknown }
  return typeof request === 'function' ? (held as Approver) : null
```

</details>

**依据 3 · 源码核查**：[typescript/packages/dsh/src/shell.ts:91-113](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/shell.ts#L91-L113)

cwd和并发session限制

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * Bind every command to this named workspace session. By default each
   * command runs in an ephemeral fork of the workspace's default session,
   * so nothing persists between calls, which is the one-shot contract of
   * dsh's bash tool. With a session bound, `cd`, `export`, and function
   * definitions persist across calls, the persistent-shell contract. The
   * session is created on first use if the workspace does not have it; an
   * existing session is adopted as is. While one command still runs in the
   * session (one left running in the background), the next runs on a copy
   * of the session beside it rather than waiting for it to end, so its
   * `cd` and `export` last for that command alone.
   *
   * A spec carrying an explicit `env`, or a `workdir` that names a real
   * directory in this world, still runs as a one-call subshell of the
   * bound session, per mirage's `ExecuteOptions` semantics: both say
   * "just for this command". The two things dsh injects on every call
   * are deliberately not read that way, since neither carries that
   * intent and either would fork every command and leave the binding
   * with nothing to persist. A workdir resolved on the harness's own
   * machine names nothing here and is dropped; the managed `DSH_*`
   * snapshot is seeded into the session instead.
   */
  sessionId?: string
```

</details>

#### 缺口

- 不同后端并发写、审批缺失恢复及完整bundle切换尚未验收。
  **影响**：无版本backend可能静默降低陈旧写保护，影响并发修改正确性。
  **进一步探讨**：对无fingerprint/revision/metadata后端注入并发写，检查保护退化；同时检查approval缺失后的pending处理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入和退出是否可在现有profile上安全尝试？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次不仅安装包，还需配置mount、凭据、runtime与session profile；bundle明确替换原有fs/shell等provider，不能把它当加一个小工具。持续要维护DSH peers与Mirage backend语义；失败需核对虚拟存储里的文件和后台job，再恢复原profile。默认RAM/tmp适合隔离试验，但重启后持久性不能假定。建议只在克隆profile和测试挂载试用，暂不迁移唯一工作profile。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/package.json:19-21](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/package.json#L19-L21)

Node版本条件

```text
  "type": "module",
  "engines": {
    "node": "^22.20 || ^24.12 || >=25"
```

**依据 2 · 源码核查**：[typescript/packages/dsh/cordis.patch.yml:1-9](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/cordis.patch.yml#L1-L9)

整套provider替换

```text
# The mirage bundle patch. Applied over dsh-base by `dsh --profile <name>`
# after `dsh plugin --profile <name> add @struktoai/mirage-dsh`: it swaps
# the filesystem and shell providers for mirage-backed ones, so dsh's file
# tools and bash tool operate on a workspace of mounted VFS instead
# of the host disk.
#
# Override the `mirage` row's config in the profile's own cordis.patch.yml
# to mount real VFS (the block form is `vfs` registry name,
# `mode`, and the VFS's `config`; `!!js` expressions resolve env vars
```

**依据 3 · 源码核查**：[typescript/packages/dsh/src/service.ts:177-206](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/service.ts#L177-L206)

工作区所有权

<details>
<summary>查看原文（30行）</summary>

```text
  constructor(ctx: Context, config: MirageConfig = {}) {
    super(ctx, 'mirage')
    if (config.workspace !== undefined && config.mounts !== undefined) {
      throw new Error('mirage: pass either workspace or mounts, not both')
    }
    if (config.workspace !== undefined) {
      // An adopted workspace is already built, so runtimes and constructor
      // options can no longer reach it. Saying so beats accepting a config
      // whose runtimes silently never load, which is what the workspace and
      // mounts pair above already refuses to do.
      // `profiles` and `profile` join them for the same reason, and one
      // more: an adopted workspace's roles and its `onAsk` are the
      // embedder's own, so silently re-answering its asks through
      // `ctx.approval` would take over a seam it may already have filled.
      if (
        config.runtimes !== undefined ||
        config.workspaceOptions !== undefined ||
        config.profiles !== undefined ||
        config.profile !== undefined
      ) {
        throw new Error(
          'mirage: runtimes, profiles, profile and workspaceOptions configure a service-owned workspace, not an adopted workspace',
        )
      }
      this.built = config.workspace
      this.ready = Promise.resolve(config.workspace)
      return
    }
    if (config.mounts === undefined) {
      throw new Error('mirage: one of workspace or mounts is required')
```

</details>

#### 缺口

- 退出时job、spill和持久mount状态的清理成本未测。
  **影响**：退出时虚拟文件和job状态可能仍需人工核对。
  **进一步探讨**：检查service.dispose及subprocess/spill清理，再在克隆profile演练恢复默认providers与持久挂载数据核对。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否在加载时验证整个虚拟世界的一致性？

**研究主题**：新假设与验证

#### 完整回答

由fs版本降级和shell绑定差异推导未验证假设：在启用bundle前给部署者一个固定只读探针，核对fs与shell对同文件的可见性、版本token、只读拒绝与spill定位，可提前发现“能加载但不同世界”的配置。增量是provider之间的语义验收而非再加一个连接器。对RAM与无版本backend分别运行小文件读写和并发冲突对照，若探针无法预测真实任务失败或误报过多，则收窄为明确后端组合。

#### 证据与依据

**依据 1 · 源码核查**：[typescript/packages/dsh/src/fs.ts:70-80](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/fs.ts#L70-L80)

版本语义差异

<details>
<summary>查看原文（11行）</summary>

```text
// The freshness token behind FsVersion. Backends that report a fingerprint
// or revision get a content-derived token; the rest fall back to metadata
// (modified + size), and a backend reporting neither yields a constant, so
// stale guards degrade to always-fresh there instead of always-stale.
function versionOf(stat: FileStat): FsVersion {
  if (stat.fingerprint !== null) return FsVersion(`fp:${stat.fingerprint}`)
  if (stat.revision !== null) return FsVersion(`rev:${stat.revision}`)
  if (stat.modified !== null || stat.size !== null) {
    return FsVersion(`meta:${stat.modified ?? ''}:${String(stat.size ?? '')}`)
  }
  return FsVersion('unversioned')
```

</details>

**依据 2 · 源码核查**：[typescript/packages/dsh/src/service.ts:215-245](https://github.com/strukto-ai/mirage/blob/62c160c6f47d455cf1bb604ed55c419f8ed254c2/typescript/packages/dsh/src/service.ts#L215-L245)

集中workspace和profile配置可承载探针

<details>
<summary>查看原文（31行）</summary>

```text
    if (config.profiles !== undefined) {
      if (options.profiles !== undefined) {
        throw new Error('mirage: pass profiles or workspaceOptions.profiles, not both')
      }
      options.profiles = parseProfiles(config.profiles)
    }
    if (config.profile !== undefined) {
      if (options.profile !== undefined) {
        throw new Error('mirage: pass profile or workspaceOptions.profile, not both')
      }
      options.profile = config.profile
    }
    // How an asked line gets answered. Installed for every service-owned
    // workspace rather than only under a composed `ctx.approval`, because
    // the two are one answer to mirage (an unset `onAsk` and a handler
    // returning null both leave the ask pending) and installing always is
    // what finds an approver composed after this plugin. An explicit
    // `workspaceOptions.onAsk` is the embedder's decision and stands.
    options.onAsk ??= askThroughApproval(ctx)
    this.plannedRuntimes = options.runtimes?.map(builtEntry)
    if (this.plannedRuntimes !== undefined) options.runtimes = [...this.plannedRuntimes]
    const blocks = Object.values(config.mounts).some(isMountBlock)
    if (blocks) {
      this.ready = this.open(config.mounts, options)
      // A declarative mount resolves asynchronously and nothing awaits
      // `ready` until a provider's first call, so a failure here would
      // reach the process as an unhandled rejection and take the whole
      // harness down over a typo in a patch file. This only marks the
      // rejection observed; `ready` still rejects for every real caller,
      // and the disposer below still sees it.
      void this.ready.catch(() => undefined)
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
