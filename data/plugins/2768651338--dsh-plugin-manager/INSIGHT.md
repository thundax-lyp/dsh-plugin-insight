# dsh-plugin-manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[df0a232](https://github.com/2768651338/dsh-plugin-manager/tree/df0a23258ed3761bcce12ad20958ba2c2a647a4c)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2768651338/dsh-plugin-manager) [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)
<!-- END META -->

> **实现功能**：在 DSH 设置中展示插件中文用途与备注，并提供启停、目录覆盖及配置备份导入导出。

> **核心亮点**：将用途说明、备注和局部启停编辑整合进设置，保留原生包管理并区分来源与用户安装；增量是维护流程便利而非新包管理能力。详见[Q01](#research-q01)。

> **风险与缺陷**：写入安全不能只看函数名，rename受阻后直接覆盖、备份失败仍继续，队列也非跨进程锁；全局patch与多文件导入可能部分完成。静态风险尚未故障注入。详见[Q03](#research-q03)。

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
  - [Q01 · 官方已有管理器时增加什么？](#detail-section-11)
  - [Q02 · 列表、备注和启停怎样读写？](#detail-section-12)
  - [Q03 · 原子写、备份和热生效有何限制？](#detail-section-13)
  - [Q04 · 三阶段成本和工程可借鉴点是什么？](#detail-section-14)
  - [Q05 · 可提出何种验证/采用方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多插件用户需要识别用途并正确启停，合格结果包括只改预期配置且宿主实际生效；目录备注不是能力证明。详见[Q01](#research-q01)。

读README并手工编辑patch，或用官方管理器；本插件增强说明/备注和局部编辑，不替代包安装卸载真相。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目录与备注 | 理解插件 | 用户覆盖/目录可能过期 |
| UI启停 | 局部修改disabled | 全局配置且有格式限制 |
| 备份导入导出 | 迁移维护配置 | 多文件部分成功需核对 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| DSH loader/typert/gateway | 条目与Remote授权 | 不匹配影响可达/权限 |
| React及settings slot | 管理页面 | 未加载无UI |
| 全局patch/overrides可写 | 启停与备注 | 写失败或降级需恢复 |
| 宿主watch/HMR | 实际热生效 | 文件成功不等运行成功 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装并备份独立副本 | 维护者 | 命名空间不冲突 |
| 核对模块用途/来源 | 用户 | 不只信目录描述 |
| 副本启停后看实际状态 | 维护者 | 配置diff与loader一致 |
| 失败核对部分完成 | 维护者 | 所有文件可恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主与配置副本 | 安装、目录与备份核对 | 先核目录与原配置副本；安装工时未知 |
| 持续使用 | 状态读取、写盘、可选HTTPS目录 | 理解模块并检查启停，节省未测 | 读写/可选HTTPS资源未计量；理解模块和启停节时未知 |
| 失败恢复 | 多份配置回读与宿主重载 | 恢复patch/备注/manifest，核对部分完成 | 多文件部分完成需逐份核；恢复时间未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 易读插件用途 | 目录与用户备注 | 可能过期，不证明能力 |
| 少手工YAML | 局部行编辑和拒绝表达式 | 只覆盖可识别格式 |
| 配置恢复 | 尽力备份与文件写入 | 原子降级、多文件非事务 |

> **思考**：写入安全不能只看函数名，rename受阻后直接覆盖、备份失败仍继续，队列也非跨进程锁；全局patch与多文件导入可能部分完成。静态风险尚未故障注入。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将用途说明、备注和局部启停编辑整合进设置，保留原生包管理并区分来源与用户安装；增量是维护流程便利而非新包管理能力。详见[Q01](#research-q01)。

将用途说明、备注和局部启停编辑整合进设置，保留原生包管理并区分来源与用户安装；增量是维护流程便利而非新包管理能力。详见[Q01](#research-q01)。

局部编辑保留注释、写前校验和结构化拒绝值得借鉴；原子fallback与跨进程冲突需明确，类型/单测不能替代实际热生效。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

写入安全不能只看函数名，rename受阻后直接覆盖、备份失败仍继续，队列也非跨进程锁；全局patch与多文件导入可能部分完成。静态风险尚未故障注入。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，在副本先核对owner权限、全局影响和锁占用/中断恢复，确认后再定义小范围试用；关键配置保留独立备份。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

目录增强和局部编辑流程有源码支持；原子写降级、备份失败及跨文件恢复限制采用。基线/生效回执为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、src/fs-safe.ts、src/patch-file.ts、src/origin.ts、tests/fs-safe.smoke.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交关键Gateway、客户端Remote、局部编辑、文件写及普通smoke材料；未完整审计全部导入/目录源和宿主权限，不作生产恢复保证。
- 下一步：进一步探讨可从文件占用、外部并发编辑、导入中断和宿主热重载失败四组反例入手，比较配置保留、恢复完整性与维护时间。

**分析版本**

- **仓库**：[2768651338/dsh-plugin-manager](https://github.com/2768651338/dsh-plugin-manager)
- **版本号**：0.9.0（[固定提交 df0a232](https://github.com/2768651338/dsh-plugin-manager/tree/df0a23258ed3761bcce12ad20958ba2c2a647a4c)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究预览diff、基线摘要、写后读回和宿主生效回执，配合导入恢复清单，以并发/锁占用/中断反例验证配置保留。当前未验证。详见[Q05](#research-q05)。

进一步探讨可从文件占用、外部并发编辑、导入中断和宿主热重载失败四组反例入手，比较配置保留、恢复完整性与维护时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2398 | — | — | 31250 |
| .js | source | 4 | 16781 | 15927 | 1500 | — |
| .ts | source | 17 | 3405 | 2667 | 513 | — |
| .mjs | source | 1 | 23 | 21 | 1 | — |
| .tsx | source | 1 | 973 | 886 | 49 | — |
| .mjs | test | 14 | 1514 | 1270 | 125 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/2768651338/dsh-plugin-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/2768651338/dsh-plugin-manager/issues?q=is%3Aissue+created%3A2026-09-22T05%3A03%3A50.312Z..2026-10-22T05%3A03%3A50.312Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/2768651338/dsh-plugin-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A03%3A50.312Z..2026-10-22T05%3A03%3A50.312Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何以说明目录和UI启停改善插件维护，其全局配置写入与恢复边界是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 官方已有管理器时增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向安装较多插件、难以从模块名判断用途的DSH用户。主要任务是用中文名称、用途、分类和自定义备注理解插件，并通过界面启停；合格结果是选中正确模块、只改预期配置、宿主实际按预期启用或停用，备注不冒充能力事实。官方插件管理仍处理安装卸载等能力，本插件采用独立dshPluginManager命名空间共存，不应被描述为替代官方包管理。

简单替代是读各项目README并手工编辑全局cordis.patch.yml。新增价值是把说明目录、用户备注和局部行编辑整合到设置页，并锁定系统行、拒绝表达式控制行。origin按官方scope粗分类，用户主动安装则看profile依赖，避免“官方来源就不是用户安装”的混淆；来源徽标不是可靠性或安全认证。说明目录可能滞后，仍需具体插件文档核查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-81](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/README.md#L67-L81)

作者问题与前后流程。

<details>
<summary>查看原文（15行）</summary>

```text
| Toggling is manual | Hand-edit `cordis.patch.yml` (easy to break) | One-click switch, surgical line-level edits, hot-reloaded in ~1s |
| Unknown plugins stay mysterious | Fallback text only | Add your own notes directly in the UI |
| Nothing is safe from fat fingers | Any row can be disabled | System rows locked, `!!js`-controlled rows labeled |

## Compatibility

| Item | Value |
|------|-------|
| DSH version | **0.2.1-rc.2**, with regression coverage for **0.2.0-rc.2** and **0.1.5-rc.3** |
| Verification | **2026-10-20**, Windows / Node 24: isolated SDK builds and tests, strict Host RPC and actual browser SlotRegistry lifecycle. This does not replace a Desktop acceptance check. |
| Install mechanism | `dsh plugin --profile web add` (bundle patch + dual-face row) |
| Depends on | typert-loader / api-gateway / client-modules rows shipped in `dsh-base` + `dsh-web-app` |

> The official launcher boots via tsx from source; this plugin's strict `./typert` registration is specifically designed to work under both plain-node and tsx source launch (covered by `tests/claims.e2e.mjs`). If you run a different DSH version, re-run the test suite before reporting issues.
>
```

</details>

**依据 2 · 源码核查**：[src/origin.ts:7-21](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/origin.ts#L7-L21)

官方分类与用户安装信号分离。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * 官方 scope 清单：只用于官方/社区粗分（来源徽标与「官方内置」筛选），
 * 不参与「是否用户安装」的判断——后者以 profile 依赖表为准（issue #1 的建议）。
 * @cordis 一并算官方：框架自带行，绝不可能是社区插件。
 */
const OFFICIAL_SCOPES: readonly string[] = ['@deepseek-ai/', '@cordis/']

/** 是否官方 scope 模块（非字符串输入一律按非官方兜底，不抛错）。 */
export function isOfficialModule(moduleName: unknown): boolean {
  return typeof moduleName === 'string' && OFFICIAL_SCOPES.some(scope => moduleName.startsWith(scope))
}

/** 模块名是否出现在 profile 依赖表里（用户主动安装信号，含 file: 等非常规 spec）。 */
export function isDeclaredDependency(dependencies: Readonly<Record<string, string>>, moduleName: unknown): boolean {
  return typeof moduleName === 'string' && Object.hasOwn(dependencies, moduleName)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:50-65](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/client/index.ts#L50-L65)

独立Remote命名空间及调用结果。

<details>
<summary>查看原文（16行）</summary>

```text
  type PluginManagerRemote = TypertRemoteNamespaceMap['dshPluginManager']
  const namespace = (): PluginManagerRemote => ctx.get('remote.dshPluginManager') as PluginManagerRemote

  const list: PluginManagerTabInjected['list'] = async () => {
    const result: RemoteResult<PluginManagerSnapshot> = await namespace().list()
    if (!result.ok) {
      throw new Error(`dshPluginManager.list failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
  }
  const setEnabled: PluginManagerTabInjected['setEnabled'] = async (entryId, enabled) => {
    const result: RemoteResult<SetEnabledResult> = await namespace().setEnabled(entryId, enabled)
    if (!result.ok) {
      throw new Error(`dshPluginManager.setEnabled failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 列表、备注和启停怎样读写？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

host以Typert Remote service提供list、setEnabled、备注和备份接口，客户端mount remote后获取命名空间，Remote传输失败抛给界面，业务accepted=false保留原因。启停先找实际loader entry并通过toggleGuard，再把entry映射到patchId，读全局patch后调用setRowDisabled；不能识别或!!js表达式控制就拒绝，避免追加重复行。变更前再读一次外部文件，在新内容上重新合并。

写操作放实例内Promise队列串行，writePatchFile先YAML校验、按天尽力备份再写。备注写独立overrides JSON，不编辑上游插件README。运行依赖宿主loader条目、typert/gateway、React与设置slot，热生效还靠宿主监视全局补丁。写accepted仅说明文件流程被接受，不能证明插件运行正常或依赖图完整。官方管理器和本命名空间隔离有助于避免服务冲突，但具体owner访问控制仍由目标宿主契约决定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:531-580](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L531-L580)

启停查找、guard、编辑、重读与队列。

<details>
<summary>查看原文（50行）</summary>

```text
  @Remote('setEnabled')
  setEnabled(entryId: string, enabled: boolean): Promise<SetEnabledResult> {
    const entry = this.findEntry(entryId)
    if (entry === undefined) {
      return Promise.resolve({ accepted: false, reason: 'not-found', message: `插件行不存在：${entryId}` })
    }
    const guarded = this.toggleGuard(entryId, entry.options.name)
    if (guarded !== undefined) return Promise.resolve(guarded)

    const patchId = this.patchIdOf(entryId)
    /** 无法识别行的拒绝结果（评估 P0-2：防静默追加重复行）。 */
    const unrecognized = (): SetEnabledResult => ({
      accepted: false,
      reason: 'unrecognized',
      message: '补丁文件里已存在该插件行，但行格式无法识别（行块首键必须是 id）；为避免写入重复行已拒绝本次操作，请手工检查 cordis.patch.yml',
    })
    const run = async (): Promise<SetEnabledResult> => {
      const path = globalPatchPath()
      try {
        const content = tryRead(path) ?? initialPatchFile()
        let edited = setRowDisabled(content, patchId, enabled)
        if (edited.blocked === 'expression') {
          return { accepted: false, reason: 'expression', message: '该插件由 !!js 表达式控制启停，请直接编辑配置文件' }
        }
        if (edited.blocked === 'unrecognized') return unrecognized()
        if (edited.changed) {
          // 写前重读一次：外部手工编辑与我们并发时，在最新内容上重做合并，避免丢更新。
          const current = tryRead(path)
          if (current !== undefined && current !== content) {
            edited = setRowDisabled(current, patchId, enabled)
            if (edited.blocked === 'expression') {
              return { accepted: false, reason: 'expression', message: '该插件由 !!js 表达式控制启停，请直接编辑配置文件' }
            }
            if (edited.blocked === 'unrecognized') return unrecognized()
          }
          this.writePatchFile(path, edited.content)
        }
        return { accepted: true }
      } catch (error) {
        return {
          accepted: false,
          reason: 'io-error',
          message: error instanceof Error ? error.message : String(error),
        }
      }
    }

    const queued = this.writeQueue.then(run, run)
    this.writeQueue = queued.then(() => {}, () => {})
    return queued
```

</details>

**依据 2 · 源码核查**：[src/index.ts:297-309](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L297-L309)

校验、每日备份及写入。

<details>
<summary>查看原文（13行）</summary>

```text
  private writePatchFile(path: string, content: string): void {
    assertWritablePatchYaml(content)
    const day = localDayKey(new Date())
    if (this.patchBackupDay !== day) {
      try {
        createTimestampedBackup(path, new Date())
        pruneBackups(path, PATCH_BACKUP_KEEP)
        this.patchBackupDay = day
      } catch {
        // 备份失败不阻断写盘；保持未备份状态，下次写前重试。
      }
    }
    writeFileAtomic(path, content)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:46-79](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/client/index.ts#L46-L79)

Remote错误解包与业务值返回。

<details>
<summary>查看原文（34行）</summary>

```text
  // 2) 注入面：解包 RemoteResult，抛错给界面层处理。
  // 不能把 remote.dshPluginManager 写进 inject（挂载发生在 apply 内，注入会让自身 fiber 永久 pending），
  // 也不能做 ctx.remote.dshPluginManager 属性访问（cordis 要求注入）；
  // 用免注入通道 ctx.get() 在挂载完成后取命名空间服务。
  type PluginManagerRemote = TypertRemoteNamespaceMap['dshPluginManager']
  const namespace = (): PluginManagerRemote => ctx.get('remote.dshPluginManager') as PluginManagerRemote

  const list: PluginManagerTabInjected['list'] = async () => {
    const result: RemoteResult<PluginManagerSnapshot> = await namespace().list()
    if (!result.ok) {
      throw new Error(`dshPluginManager.list failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
  }
  const setEnabled: PluginManagerTabInjected['setEnabled'] = async (entryId, enabled) => {
    const result: RemoteResult<SetEnabledResult> = await namespace().setEnabled(entryId, enabled)
    if (!result.ok) {
      throw new Error(`dshPluginManager.setEnabled failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
  }
  const setOverride: PluginManagerTabInjected['setOverride'] = async (moduleName, name, desc) => {
    const result: RemoteResult<CatalogEditResult> = await namespace().setOverride(moduleName, name, desc)
    if (!result.ok) {
      throw new Error(`dshPluginManager.setOverride failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
  }
  const removeOverride: PluginManagerTabInjected['removeOverride'] = async (moduleName) => {
    const result: RemoteResult<CatalogEditResult> = await namespace().removeOverride(moduleName)
    if (!result.ok) {
      throw new Error(`dshPluginManager.removeOverride failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 原子写、备份和热生效有何限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

文件写入不是无条件原子。fs-safe先同目录临时文件、fsync、rename重试，但EPERM/EBUSY/EACCES后会直接覆盖原文件；此分支若进程中断可失去原子替换保证。writePatchFile备份失败不阻断写入，且每日只尝试保留一个时点，不能据函数名或README承诺每次操作都可回退。

实例内队列和写前重读降低冲突，却不是跨进程锁或带摘要的compare-and-swap。另一个编辑者在重读与最终写入之间改变文件仍可能丢更新。全局patch修改还可能影响多个profile/会话，UI的一次启停不只改变当前页。备份导入依次写overrides、profile manifest和patch，所读路径不是一项跨文件事务，失败恢复需核对部分完成，不能称全有或全无。以上为静态条件风险，本轮未故障注入。

#### 证据与依据

**依据 1 · 源码核查**：[src/fs-safe.ts:36-66](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/fs-safe.ts#L36-L66)

rename失败后直接覆盖的明确降级。

<details>
<summary>查看原文（31行）</summary>

```text
/**
 * 原子替换写：先写同目录临时文件并 fsync 落盘，再 rename 到目标。
 * Windows 上目标被编辑器/杀毒软件占用（EPERM/EBUSY/EACCES）时重试数次，
 * 仍失败则降级为直接覆盖写（等价旧行为，不让启停整体失败）。
 */
export function writeFileAtomic(targetPath: string, data: string): void {
  const temp = join(
    dirname(targetPath),
    `${basename(targetPath)}.${process.pid}.${Date.now()}.${tempSeq++}.tmp`,
  )
  try {
    writeFileSync(temp, data, 'utf8')
    const fd = openSync(temp, 'r+')
    try {
      fsyncSync(fd)
    } finally {
      closeSync(fd)
    }
    renameWithRetry(temp, targetPath)
  } catch (error) {
    try {
      if (existsSync(temp)) unlinkSync(temp)
    } catch {
      // 清理失败不掩盖原始错误。
    }
    if (renameBlocked(error)) {
      // 降级：目标被长期占用时直接覆盖写（与旧版行为一致）。
      writeFileSync(targetPath, data, 'utf8')
      return
    }
    throw error
```

</details>

**依据 2 · 源码核查**：[src/index.ts:297-309](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L297-L309)

备份错误吞下且不阻断。

<details>
<summary>查看原文（13行）</summary>

```text
  private writePatchFile(path: string, content: string): void {
    assertWritablePatchYaml(content)
    const day = localDayKey(new Date())
    if (this.patchBackupDay !== day) {
      try {
        createTimestampedBackup(path, new Date())
        pruneBackups(path, PATCH_BACKUP_KEEP)
        this.patchBackupDay = day
      } catch {
        // 备份失败不阻断写盘；保持未备份状态，下次写前重试。
      }
    }
    writeFileAtomic(path, content)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:547-580](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L547-L580)

重读和实例队列之间仍无跨进程CAS。

<details>
<summary>查看原文（34行）</summary>

```text
    const run = async (): Promise<SetEnabledResult> => {
      const path = globalPatchPath()
      try {
        const content = tryRead(path) ?? initialPatchFile()
        let edited = setRowDisabled(content, patchId, enabled)
        if (edited.blocked === 'expression') {
          return { accepted: false, reason: 'expression', message: '该插件由 !!js 表达式控制启停，请直接编辑配置文件' }
        }
        if (edited.blocked === 'unrecognized') return unrecognized()
        if (edited.changed) {
          // 写前重读一次：外部手工编辑与我们并发时，在最新内容上重做合并，避免丢更新。
          const current = tryRead(path)
          if (current !== undefined && current !== content) {
            edited = setRowDisabled(current, patchId, enabled)
            if (edited.blocked === 'expression') {
              return { accepted: false, reason: 'expression', message: '该插件由 !!js 表达式控制启停，请直接编辑配置文件' }
            }
            if (edited.blocked === 'unrecognized') return unrecognized()
          }
          this.writePatchFile(path, edited.content)
        }
        return { accepted: true }
      } catch (error) {
        return {
          accepted: false,
          reason: 'io-error',
          message: error instanceof Error ? error.message : String(error),
        }
      }
    }

    const queued = this.writeQueue.then(run, run)
    this.writeQueue = queued.then(() => {}, () => {})
    return queued
```

</details>

**依据 4 · 源码核查**：[src/index.ts:659-724](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L659-L724)

导入依次写多份状态。

<details>
<summary>查看原文（66行）</summary>

```text
    const run = async (): Promise<BackupImportResult> => {
      try {
        if (typeof json !== 'string' || json.length === 0) {
          return { accepted: false, reason: 'invalid-format', message: '备份内容为空' }
        }
        if (json.length > MAX_IMPORT_JSON_CHARS) {
          return { accepted: false, reason: 'too-large', message: '备份文件过大（上限 2MB）' }
        }
        let parsed: unknown
        try {
          parsed = JSON.parse(json)
        } catch {
          return { accepted: false, reason: 'invalid-format', message: '备份文件不是合法的 JSON' }
        }
        const validation = validateBackupDocument(parsed)
        if (!validation.ok) {
          return { accepted: false, reason: 'invalid-format', message: validation.reason }
        }
        const doc = validation.document

        const profileDir = this.profileDir()
        if (profileDir === undefined) {
          return { accepted: false, reason: 'profile-not-found', message: '无法定位当前 profile 目录（缺少 package.json）' }
        }

        // 依赖安全审计：非常规 spec 必须经用户逐项确认（或确认后跳过），绝不静默合并。
        const audit = auditDependencySpecs(doc.dependencies, allowNonRegistrySpecs)
        if (allowNonRegistrySpecs === null && audit.pending.length > 0) {
          return {
            accepted: false,
            reason: 'confirmation-required',
            message: `备份包含 ${audit.pending.length} 个非常规依赖来源（本地路径 / 外部仓库等），安装时会执行其携带的代码，需逐项确认后才会写入`,
            pendingNonRegistrySpecs: audit.pending,
          }
        }

        // 1) 备注覆盖
        const overrides = readOverrides().overrides
        const overMerged = mergeOverrides(overrides, doc.overrides)
        this.writeOverrides(overMerged.merged)

        // 2) profile 清单：依赖（仅 registry 风格 + 已确认条目）+ bundles
        const manifestPath = join(profileDir, 'package.json')
        const manifest = readProfileManifest(manifestPath)
        const depsMerged = mergeDependencies(manifest.dependencies ?? {}, audit.writable)
        const bundlesMerged = mergeBundles(manifest.dsh?.profile?.bundles ?? [], doc.bundles)
        writeProfileManifest(manifestPath, {
          ...manifest,
          dependencies: depsMerged.merged,
          dsh: {
            ...manifest.dsh,
            profile: {
              ...manifest.dsh?.profile,
              bundles: bundlesMerged.merged,
            },
          },
        })

        // 3) 全局启停补丁（合并：按行应用备份里的启停状态，保留当前其余行；
        //    与 previewBackup 共用 mergePatchRows，保证预览与实际写入一致）
        let patchRowsRestored = 0
        if (doc.patchFile !== undefined) {
          const patchPath = globalPatchPath()
          const merged = mergePatchRows(tryRead(patchPath) ?? initialPatchFile(), doc.patchFile)
          patchRowsRestored = merged.rows.length
          if (patchRowsRestored > 0) this.writePatchFile(patchPath, merged.content)
```

</details>

#### 缺口

- 多个宿主进程/外部编辑者与导入中断的恢复状态尚未建立完整证明。
  **影响**：阻碍对关键全局配置给出稳定回滚保证。
  **进一步探讨**：在隔离profile副本上设计并发修改、文件占用和各写入点中断，回读所有文件及宿主生效状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和工程可借鉴点是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

局部文本编辑保留注释与!!js，比全量YAML序列化更尊重手工配置；解析器明确只识别顶层-id行，对不能安全理解的行拒绝，这种范围收缩值得借鉴。写前YAML回读、结构化拒绝原因和scope/安装信号分离也有维护价值。代价是格式适配、源码/构建产物及手写typert描述形状需要同步，不能从类型通过推出真实loader热重载正确。

首次投入是安装、核查模块说明和全局patch备份；持续不新增模型调用，但有读取目录、状态刷新、可能的自定义HTTPS目录源和磁盘配置写入。手工改YAML次数可能减少，实际节省和错误率未测。失败恢复需要从.bak或明确副本核对恢复全局patch、备注和manifest，再看loader是否重新加载；直接写fallback或部分导入会增加人工。smoke源码覆盖普通创建/覆盖和临时残留，却不等于Windows锁占用fallback或真实中断通过，本轮测试均只读。

#### 证据与依据

**依据 1 · 源码核查**：[src/patch-file.ts:1-5](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/patch-file.ts#L1-L5)

局部编辑保留文本而非全量重序列化。

```text
/**
 * 启停补丁文件（cordis.patch.yml）的手术式编辑：只增删目标行的 disabled 字段，
 * 保留文件里的其它行、注释与 !!js 表达式原样不动。不依赖 YAML 库——
 * 按“列 0 的 - ”切行块，行内匹配 id / disabled 键。
 * 写盘前的 YAML 回读校验在 patch-yaml 模块（编辑器本身保持零依赖）。
```

**依据 2 · 源码核查**：[src/patch-file.ts:55-84](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/patch-file.ts#L55-L84)

有限格式识别范围。

<details>
<summary>查看原文（30行）</summary>

```text
/** 把文件内容解析为顶层行块序列（忽略注释与空行，保留原文文本）。 */
export function parsePatchFile(content: string): PatchRowBlock[] {
  const lines = content.split(/\r?\n/)
  const blocks: PatchRowBlock[] = []
  let index = 0
  while (index < lines.length) {
    const line = lines[index] ?? ''
    if (!/^- /.test(line)) {
      index += 1
      continue
    }
    const start = index
    index += 1
    while (index < lines.length && !/^- /.test(lines[index] ?? '')) index += 1
    const blockLines = lines.slice(start, index)
    let id: string | null = null
    let disabledIndex = -1
    let disabledValue: string | null = null
    for (let at = 0; at < blockLines.length; at += 1) {
      const text = blockLines[at] ?? ''
      // 用 match 而非 exec：语义一致（非全局正则），且不触发安全扫描的命令执行误报。
      const idMatch = text.match(/^- id:\s*(.*)$/)
      if (idMatch) id = unquote(stripInlineComment(idMatch[1] ?? ''))
      const disabledMatch = text.match(/^(\s*)disabled:\s*(.*)$/)
      if (disabledMatch && disabledIndex < 0) {
        disabledIndex = at
        disabledValue = stripInlineComment(disabledMatch[2] ?? '')
      }
    }
    blocks.push({ lines: blockLines, start, end: index, id, disabledIndex, disabledValue })
```

</details>

**依据 3 · 源码核查**：[tests/fs-safe.smoke.mjs:12-29](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/tests/fs-safe.smoke.mjs#L12-L29)

普通原子写和备份内容的测试条件。

<details>
<summary>查看原文（18行）</summary>

```text
  // 1) writeFileAtomic：创建 + 覆盖 + 无临时文件残留
  {
    const target = join(dir, 'a.yml')
    writeFileAtomic(target, 'first\n')
    assert.strictEqual(readFileSync(target, 'utf8'), 'first\n')
    writeFileAtomic(target, 'second\n')
    assert.strictEqual(readFileSync(target, 'utf8'), 'second\n')
    assert.ok(!readdirSync(dir).some(name => name.endsWith('.tmp')), 'no temp leftovers')
    pass += 1
  }

  // 2) createTimestampedBackup：源缺失返回 undefined；存在时备份内容一致
  {
    const target = join(dir, 'b.yml')
    assert.strictEqual(createTimestampedBackup(target, new Date()), undefined)
    writeFileSync(target, 'payload\n', 'utf8')
    const backup = createTimestampedBackup(target, new Date(2026, 0, 2, 3, 4, 5))
    assert.ok(backup !== undefined && backup.endsWith('.20260102-030405.bak'), 'timestamped name: ' + String(backup))
```

</details>

#### 缺口

- 缺少代表性复杂patch和真实宿主热生效的错误率/恢复成本。
  **影响**：无法判定“一键”是否减少端到端维护负担。
  **进一步探讨**：固定带注释、表达式及不同格式patch，与人工编辑对照正确变更、实际生效和恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可提出何种验证/采用方向？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把启停变为预览diff、绑定基线摘要、写入后读回和宿主状态回执；原子替换不可用时返回明确失败，避免降级写被UI当安全成功。跨文件导入可用小型恢复清单记录已完成步骤。推导来自现有重读/备份意图与文件锁降级、部分导入的缺口。最小验证比较当前流程和候选流程在外部编辑、锁占用、中断及热重载失败下的原配置保留和读者判断；若回执没有绑定真实loader状态，不能称问题解决。

本轮建议观察，适合愿意管理profile副本的插件维护者继续核对。对关键全局配置，先保留独立备份、确认目标宿主owner边界，并在副本上核对启停和恢复再决定小范围试用。不能因为系统行锁定就让普通用户拥有修改全局运行状态的权限，也不以目录中文描述替代上游事实。当前没有同版本安装、核心启停/恢复及卸载验收，不给值得安装。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:547-580](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L547-L580)

基线重读已有起点但缺最终状态回执。

<details>
<summary>查看原文（34行）</summary>

```text
    const run = async (): Promise<SetEnabledResult> => {
      const path = globalPatchPath()
      try {
        const content = tryRead(path) ?? initialPatchFile()
        let edited = setRowDisabled(content, patchId, enabled)
        if (edited.blocked === 'expression') {
          return { accepted: false, reason: 'expression', message: '该插件由 !!js 表达式控制启停，请直接编辑配置文件' }
        }
        if (edited.blocked === 'unrecognized') return unrecognized()
        if (edited.changed) {
          // 写前重读一次：外部手工编辑与我们并发时，在最新内容上重做合并，避免丢更新。
          const current = tryRead(path)
          if (current !== undefined && current !== content) {
            edited = setRowDisabled(current, patchId, enabled)
            if (edited.blocked === 'expression') {
              return { accepted: false, reason: 'expression', message: '该插件由 !!js 表达式控制启停，请直接编辑配置文件' }
            }
            if (edited.blocked === 'unrecognized') return unrecognized()
          }
          this.writePatchFile(path, edited.content)
        }
        return { accepted: true }
      } catch (error) {
        return {
          accepted: false,
          reason: 'io-error',
          message: error instanceof Error ? error.message : String(error),
        }
      }
    }

    const queued = this.writeQueue.then(run, run)
    this.writeQueue = queued.then(() => {}, () => {})
    return queued
```

</details>

**依据 2 · 源码核查**：[src/fs-safe.ts:54-66](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/fs-safe.ts#L54-L66)

原子失败后的降级是改进触发。

<details>
<summary>查看原文（13行）</summary>

```text
    renameWithRetry(temp, targetPath)
  } catch (error) {
    try {
      if (existsSync(temp)) unlinkSync(temp)
    } catch {
      // 清理失败不掩盖原始错误。
    }
    if (renameBlocked(error)) {
      // 降级：目标被长期占用时直接覆盖写（与旧版行为一致）。
      writeFileSync(targetPath, data, 'utf8')
      return
    }
    throw error
```

</details>

**依据 3 · 源码核查**：[src/index.ts:659-724](https://github.com/2768651338/dsh-plugin-manager/blob/df0a23258ed3761bcce12ad20958ba2c2a647a4c/src/index.ts#L659-L724)

多文件导入需要恢复语义。

<details>
<summary>查看原文（66行）</summary>

```text
    const run = async (): Promise<BackupImportResult> => {
      try {
        if (typeof json !== 'string' || json.length === 0) {
          return { accepted: false, reason: 'invalid-format', message: '备份内容为空' }
        }
        if (json.length > MAX_IMPORT_JSON_CHARS) {
          return { accepted: false, reason: 'too-large', message: '备份文件过大（上限 2MB）' }
        }
        let parsed: unknown
        try {
          parsed = JSON.parse(json)
        } catch {
          return { accepted: false, reason: 'invalid-format', message: '备份文件不是合法的 JSON' }
        }
        const validation = validateBackupDocument(parsed)
        if (!validation.ok) {
          return { accepted: false, reason: 'invalid-format', message: validation.reason }
        }
        const doc = validation.document

        const profileDir = this.profileDir()
        if (profileDir === undefined) {
          return { accepted: false, reason: 'profile-not-found', message: '无法定位当前 profile 目录（缺少 package.json）' }
        }

        // 依赖安全审计：非常规 spec 必须经用户逐项确认（或确认后跳过），绝不静默合并。
        const audit = auditDependencySpecs(doc.dependencies, allowNonRegistrySpecs)
        if (allowNonRegistrySpecs === null && audit.pending.length > 0) {
          return {
            accepted: false,
            reason: 'confirmation-required',
            message: `备份包含 ${audit.pending.length} 个非常规依赖来源（本地路径 / 外部仓库等），安装时会执行其携带的代码，需逐项确认后才会写入`,
            pendingNonRegistrySpecs: audit.pending,
          }
        }

        // 1) 备注覆盖
        const overrides = readOverrides().overrides
        const overMerged = mergeOverrides(overrides, doc.overrides)
        this.writeOverrides(overMerged.merged)

        // 2) profile 清单：依赖（仅 registry 风格 + 已确认条目）+ bundles
        const manifestPath = join(profileDir, 'package.json')
        const manifest = readProfileManifest(manifestPath)
        const depsMerged = mergeDependencies(manifest.dependencies ?? {}, audit.writable)
        const bundlesMerged = mergeBundles(manifest.dsh?.profile?.bundles ?? [], doc.bundles)
        writeProfileManifest(manifestPath, {
          ...manifest,
          dependencies: depsMerged.merged,
          dsh: {
            ...manifest.dsh,
            profile: {
              ...manifest.dsh?.profile,
              bundles: bundlesMerged.merged,
            },
          },
        })

        // 3) 全局启停补丁（合并：按行应用备份里的启停状态，保留当前其余行；
        //    与 previewBackup 共用 mergePatchRows，保证预览与实际写入一致）
        let patchRowsRestored = 0
        if (doc.patchFile !== undefined) {
          const patchPath = globalPatchPath()
          const merged = mergePatchRows(tryRead(patchPath) ?? initialPatchFile(), doc.patchFile)
          patchRowsRestored = merged.rows.length
          if (patchRowsRestored > 0) this.writePatchFile(patchPath, merged.content)
```

</details>

#### 缺口

- 目标宿主owner权限和故障恢复闭包未完整核查。
  **影响**：阻碍常规关键配置试用。
  **进一步探讨**：固定宿主版本，先验证权限与隔离副本的失败恢复，再比较净便利。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
