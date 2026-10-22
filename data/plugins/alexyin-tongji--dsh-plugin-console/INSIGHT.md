# dsh-plugin-console

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[224e539](https://github.com/AlexYin-Tongji/dsh-plugin-console/tree/224e53959c1b03f83993b80f8438b49b17d820d6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)
<!-- END META -->

> **实现功能**：在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。

> **核心亮点**：把来源核验、明确确认、精确安装、完整profile兼容检查及恢复串为管理闭环，增量在流程而非新包管理算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：canary改临时HOME但仍普通用户进程并继承多项环境变量，不是OS沙箱；真实profile变更与外部初始化副作用也非原子回滚。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要控制台，目录到真实安装如何连接？](#detail-section-11)
  - [Q02 · 相对手工CLI贡献在哪里，canary隔离到什么程度？](#detail-section-12)
  - [Q03 · 安装和退出有哪些强依赖？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复成本和效果怎么判断？](#detail-section-14)
  - [Q05 · 哪些机制可复用，可恢复变更收据怎么验证？](#detail-section-15)
  - [Q06 · 谁适合当前采用，什么时候停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地维护者集中核对目录来源、精确版本及活动profile，需区分已装与运行中状态。

官方CLI加手工来源/lockfile/Loader核对及备份；控制台集中步骤，但额外复制依赖树和完整profile启动也有成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 社区目录 | 来源/版本与文档核对 | 元数据验证非代码背书 |
| profile变更 | 安装/更新/删除/暂停 | 精确宿主、人工plan确认、真实写入 |
| canary/恢复 | 兼容检查与失败状态 | 临时目录不等OS隔离 |
| Harness升级 | npm全局精确升级与恢复 | 受安装方式/权限/网络约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24，DSH rc.6及固定Cordis/Loader peers | 主流程必需 | Host、profile和客户端接线 | 不能仅以Node能运行判断兼容 |
| 活动web profile及可写DSH_HOME | 管理必需 | manifest、lockfile、暂停配置和备份 | 非文件Loader或profile目录外拒绝 |
| HTTPS目录、npm/GitHub网络 | 商店验证必需 | 元数据、固定artifact和README | 可显示旧缓存，不能等同当前验证 |
| dsh/pnpm命令及完整profile canary可启动 | 安装/升级必需 | 真正包变更与验证 | 超时/失败进入恢复，非只改列表 |
| npm全局安装prefix | Harness升级必需 | 全局二进制重装 | 其他安装方式不提供升级 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者备份profile与插件数据并固定宿主 | 只选择信任代码，临时HOME非安全沙箱 |
| 加载 | 安装管理器到web profile并重启刷新 | 目录、已装与运行中状态分别可见 |
| 变更 | 人工核对plan来源、精确版本、警告再执行 | TTL、指纹、锁和artifact重检均通过 |
| 验收 | 检查安装、canary、回滚和重启提示 | canary通过仍需重启后实际功能判断 |
| 退出 | 卸载管理器，单独治理缓存/备份/目标插件数据 | 卸载不回退历史Harness升级或删除他包数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 固定DSH/Node环境与网络，金额未知 | 源码信任、profile盘点与备份 | 硬件与真实初始化耗时未测 |
| 持续使用 | 元数据请求、依赖树复制、安装及完整profile canary | 核对每次来源/版本/确认及重启 | 多插件profile会增加存储与启动开销 |
| 失败恢复 | 保留依赖备份、重装旧版、再次canary | 判断部分变更、进程清理和人工修复 | 回滚失败有独立状态，恢复时长未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 安装确定性 | plan绑定来源、精确版本、integrity与profile指纹 | 元数据与供应链本身可信程度 |
| 运行兼容 | 设计包含完整profile启动与client资源检查 | 实际UI/业务任务可用性 |
| 恢复 | 元数据/依赖备份和失败结果分类明确 | 断电、外部非协作写及任意插件副作用恢复 |

> **思考**：canary改临时HOME但仍普通用户进程并继承多项环境变量，不是OS沙箱；真实profile变更与外部初始化副作用也非原子回滚。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把来源核验、明确确认、精确安装、完整profile兼容检查及恢复串为管理闭环，增量在流程而非新包管理算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

把来源核验、明确确认、精确安装、完整profile兼容检查及恢复串为管理闭环，增量在流程而非新包管理算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

工程亮点是先plan后execute、短TTL/一次消费/指纹重检、来源和integrity绑定、profile锁目录的nonce拥有权与原子改名回收，及安装结果/进程清理/回滚分别报告。命令使用参数数组shell:false，避免把目标直接拼shell；但普通执行本身继承父环境，不能凭此称安全沙箱。

<a id="detail-section-5"></a>

### 1.4 主要限制

canary改临时HOME但仍普通用户进程并继承多项环境变量，不是OS沙箱；真实profile变更与外部初始化副作用也非原子回滚。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持限时指纹计划、官方CLI变更与canary/recovery组织；临时HOME并非OS隔离，真实安装初始化的外部副作用不由恢复覆盖。最小能力变更与恢复边界收据尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/catalog.ts、src/operations.ts、src/canary.ts、src/harness-operations.ts、package.json、src/lock.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/catalog、profile操作计划与执行恢复、锁及canary环境/启动，另核Harness升级回滚关键路径；未运行CLI/canary，不全面审计客户端和全部依赖。
- 下一步：进一步探讨可从假密钥、外目录写、分阶段失败与回滚网络中断的受控夹具入手，比较能力范围和真实恢复。

**分析版本**

- **仓库**：[AlexYin-Tongji/dsh-plugin-console](https://github.com/AlexYin-Tongji/dsh-plugin-console)
- **版本号**：0.3.2（[固定提交 224e539](https://github.com/AlexYin-Tongji/dsh-plugin-console/tree/224e53959c1b03f83993b80f8438b49b17d820d6)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨最小能力变更收据，列环境/目录/网络与恢复覆盖，再以白名单或OS约束缩小canary能力；兼容与隐私成本未验证。详见[Q05](#research-q05)。

进一步探讨可从假密钥、外目录写、分阶段失败与回滚网络中断的受控夹具入手，比较能力范围和真实恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 575 | — | — | 6287 |
| .js | source | 3 | 37319 | 26808 | 10660 | — |
| .ts | source | 20 | 6182 | 5643 | 198 | — |
| .tsx | source | 3 | 1236 | 1145 | 17 | — |
| .ts | test | 12 | 2689 | 2536 | 58 | — |
| .tsx | test | 3 | 481 | 448 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console/issues?q=is%3Aissue+created%3A2026-09-22T05%3A22%3A21.270Z..2026-10-22T05%3A22%3A21.270Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A22%3A21.270Z..2026-10-22T05%3A22%3A21.270Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查插件目录验证、计划到真实profile变更、canary信任及恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要控制台，目录到真实安装如何连接？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向维护自己DSH web profile、需要在多个社区插件间核对来源和版本的人。输入是HTTPS社区目录、活动profile和Loader运行态，输出是已核对的变更计划及真实包管理/配置变更。合格任务不仅显示已安装，还要精确版本、组合、canary结果及重启后的实际可用状态一致。

Host只从Loader baseUrl定位DSH_HOME/profiles内活动profile，不由客户端传任意路径；API要求POST，同源校验及写操作loopback限制。目录详情核对npm身份、repo、HTTPS tarball和integrity，GitHub路径固定commit。plan保存目标和profile指纹，有TTL；execute消耗plan，再取锁/重检，调用官方dsh CLI，验证安装、配置组合和canary，失败走恢复。这些步骤降低误装，不等代码经过安全审计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-20](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/README.md#L7-L20)

作者目标和plan/canary工作流。

<details>
<summary>查看原文（14行）</summary>

```text
`dsh-plugin-console` 是一个可安装到 DeepSeek Harness Web profile 的插件管理器：它把社区目录、当前 profile 的包清单和 Loader 运行态放在 Settings 的一级“插件管理”页面里，并通过官方 `dsh plugin` 命令完成安装、更新和删除。

## 已实现

- **插件商店**：默认同步 [awesome-dsh-plugin](https://awesome-dsh-plugin.com/plugins.json)，支持搜索、分类、分页和本地 last-known-good 缓存。
- **安装前验证**：npm 包检查合法 SemVer、repository、HTTPS tarball、SHA-512 integrity、`dsh.bundle.patch` 和生命周期脚本；GitHub 包固定到 40 位 commit，并确认 `package.json` 与声明的 patch 文件存在。
- **已安装清单**：读取当前 profile 的 direct dependencies、bundle 顺序、解析后的 package manifest、Loader entry/Fiber phase 和 Web client 能力。
- **使用说明**：读取 Markdown、MDX、RST、TXT 和无扩展名 README；Markdown 使用 README 专用的 GFM + 安全 HTML renderer，支持常见段落、链接、徽章和相对图片，所有文档都可切换到保留原文的源码视图。
- **快捷更新**：不会自动安装或更新。发现新版本后只显示更新按钮；用户点击后仍需复核目标版本和来源、勾选确认并再次点击“确认执行”。社区目录中的包按已验证 artifact 更新；目录外 npm 包只有在同名、同 repository、合法升级版本和 integrity 都成立时才可更新，并在确认页单独警告。
- **快捷删除**：只允许删除 direct dependency，系统 bundle 受保护；删除会同时清理 `dsh.profile.bundles` 中的对应层，确保下次启动不再加载已删除插件；删除包不会擅自删除包创建的数据。
- **暂停使用**：保留已安装依赖，通过 profile 的结构化 Loader patch 持久化 `disabled` 状态；可随时恢复，管理器自身不会允许自暂停。
- **隔离试运行**：安装或更新后，在临时 `DSH_HOME`、随机本地端口和隔离 HOME/TMP 中启动完整 Web profile；已安装的其他第三方 bundle 也会一起启动，因此插件间、插件与 DSH/Cordis 的初始化冲突会在新版本写入前被发现。目标 bundle 的 Loader 条目、精确包版本、客户端 bundle 的语法／执行／唯一包名注册／模块依赖和 HTTP 资源全部通过后才保留新版，否则自动恢复旧版本。浏览器内 UI 交互仍由用户在重启刷新后人工确认。
- **变更确认**：所有写操作先生成 5 分钟有效的 plan；执行前重新校验 profile 指纹、当前包状态和 artifact integrity，同一时间只允许一个变更。元数据实际变化后才按恢复后的 lockfile 做 frozen reinstall，不会先删除整个 `node_modules`；供应链策略在命令开始前拒绝时不会破坏现有依赖。
- **重启提示**：变更由 pnpm/profile manifest 持久化，当前 Loader 不会被伪装成已更新，页面会明确显示隔离试运行结果和重启后生效状态。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:139-165](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/index.ts#L139-L165)

同源与loopback校验。

<details>
<summary>查看原文（27行）</summary>

```text
function verifySameOrigin(req: IncomingMessage): void {
  const host = req.headers.host
  const origin = req.headers.origin
  const fetchSite = req.headers['sec-fetch-site']
  if (fetchSite !== undefined && fetchSite !== 'same-origin' && fetchSite !== 'same-site' && fetchSite !== 'none') {
    throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  }
  if (host === undefined || origin === undefined) throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  let url: URL
  try {
    url = new URL(origin)
  } catch {
    throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  }
  if ((url.protocol !== 'http:' && url.protocol !== 'https:') || url.host !== host) {
    throw new ApiFailure(403, 'origin-denied', 'Only same-origin WebUI requests are accepted.')
  }
}

function verifyLoopback(req: IncomingMessage): void {
  const address = req.socket.remoteAddress ?? ''
  if (address !== '127.0.0.1' && address !== '::1' && !address.startsWith('::ffff:127.')) {
    throw new ApiFailure(403, 'mutation-local-only', 'Plugin mutations are available only from the loopback WebUI.')
  }
}

function sendJson(res: ServerResponse, status: number, value: unknown): void {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:175-190](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/index.ts#L175-L190)

活动profile路径限制。

<details>
<summary>查看原文（16行）</summary>

```text

/** Resolve the profile path from the Loader's own base URL, never from client input. */
function profileDir(ctx: Context): string {
  if (ctx.baseUrl === undefined || !ctx.baseUrl.startsWith('file:')) {
    throw new Error('dsh-plugin-console requires a file-backed profile Loader baseUrl.')
  }
  const profilesRoot = resolve(dshHomePath('profiles'))
  const dir = resolve(fileURLToPath(ctx.baseUrl))
  const child = relative(profilesRoot, dir)
  if (child.length === 0 || child.startsWith('..') || isAbsolute(child)) {
    throw new Error('dsh-plugin-console can manage only the active profile under $DSH_HOME/profiles.')
  }
  return dir
}

/** Mount the manager against only the active profile. */
```

</details>

**依据 4 · 源码核查**：[src/catalog.ts:544-579](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/catalog.ts#L544-L579)

npm身份、repository和integrity核对。

<details>
<summary>查看原文（36行）</summary>

```text
  private async inspectNpm(item: CatalogPluginSummary, locale: UiLocale): Promise<CatalogPluginDetail> {
    const packageName = item.packageName
    if (packageName === null || !validNpmPackageName(packageName)) return invalidDetail(item, 'Catalog npm package name is invalid.')
    const encoded = encodeURIComponent(packageName)
    const signal = this.operationSignal()
    const { value } = await fetchJson(
      this.fetchImpl,
      `https://registry.npmjs.org/${encoded}/latest`,
      signal,
      Math.min(this.options.maxCatalogBytes, 1_000_000),
    )
    if (!isRecord(value)) return invalidDetail(item, 'npm metadata is invalid.')
    const manifest = manifestSummary(value)
    if (manifest === null || manifest.packageName !== packageName) return invalidDetail(item, 'npm package identity does not match the catalog.')
    const warnings = inspectionWarnings(manifest, value)
    if (!manifest.bundle) return invalidDetail(item, 'Published package does not declare an installable DSH bundle.', manifest, warnings)
    const dist = isRecord(value.dist) ? value.dist : {}
    const integrity = stringValue(dist.integrity)
    if (integrity === null || !validNpmIntegrity(integrity) || !validNpmTarball(dist.tarball)) {
      return invalidDetail(item, 'npm metadata has no valid HTTPS tarball and immutable integrity hash.', manifest, [...warnings, 'integrity-missing'])
    }
    const repository = normalizeGithubRepository(value.repository)
    if (repository === null || repository.toLocaleLowerCase() !== item.id) {
      return invalidDetail(item, 'npm package repository does not match the catalog repository.', manifest, [...warnings, 'repository-mismatch'])
    }
    const gitHead = typeof value.gitHead === 'string' && /^[0-9a-f]{40}$/i.test(value.gitHead) ? value.gitHead : null
    const readme = gitHead === null
      ? { text: null, source: null }
      : await fetchReadme(this.fetchImpl, repository, gitHead, locale, signal, this.options.maxReadmeBytes)
    return {
      ...item,
      verification: 'verified',
      verificationMessage: null,
      installSpec: `${packageName}@${manifest.version}`,
      commitSha: gitHead,
      integrity,
```

</details>

**依据 5 · 源码核查**：[src/operations.ts:709-746](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L709-L746)

plan TTL、指纹和一次消费。

<details>
<summary>查看原文（38行）</summary>

```text
    const expiresAt = new Date(this.now() + PLAN_TTL_MS).toISOString()
    const plan: OperationPlan & { readonly status: 'ready'; readonly planId: string } = {
      status: 'ready',
      planId,
      blockReason: null,
      profileName: this.options.profile.runtime.profileName,
      catalogId: input.catalogId,
      packageName: input.packageName,
      currentVersion: input.currentVersion,
      currentSpec: input.currentSpec,
      targetVersion: input.targetVersion,
      sourceSpec: input.sourceSpec,
      artifactIntegrity: input.artifactIntegrity,
      lifecycleScripts: [...input.lifecycleScripts],
      warnings: [...input.warnings],
      expiresAt,
      action: input.action,
    }
    this.plans.set(planId, { plan, fingerprint: this.options.profile.fingerprint() })
    return plan
  }

  async execute(planId: string): Promise<OperationResult> {
    this.prunePlans()
    if (this.disposed) return snapshotResult(this.options.profile, null, 'manager-disposed', null, false, 'not-needed', null)
    if (this.operation !== null || this.busy) return snapshotResult(this.options.profile, null, 'operation-busy', null, false, 'not-needed', null)
    const stored = this.plans.get(planId)
    this.plans.delete(planId)
    if (stored === undefined) return snapshotResult(this.options.profile, null, 'plan-invalid-or-expired', null, false, 'not-needed', null)
    if (Date.parse(stored.plan.expiresAt ?? '') <= this.now()) return snapshotResult(this.options.profile, stored.plan.action, 'plan-expired', stored.plan.packageName, false, 'not-needed', null)
    if (stored.fingerprint !== this.options.profile.fingerprint()) return snapshotResult(this.options.profile, stored.plan.action, 'profile-changed', stored.plan.packageName, false, 'not-needed', null)
    const plan = stored.plan
    if (plan.packageName === null) return snapshotResult(this.options.profile, plan.action, 'plan-invalid', null, false, 'not-needed', null)

    // Reserve synchronously before any filesystem or process await. A second
    // request in the same turn therefore cannot enter the mutation path.
    this.options.profile.setBusy(true)
    const operation = this.prepareAndRun(plan, stored.fingerprint)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对手工CLI贡献在哪里，canary隔离到什么程度？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把目录结构核验、明确确认、精确安装、完整profile启动检查、备份和恢复状态组织成闭环，减少维护者手工穿梭。它使用官方CLI和现有Loader，不是新包管理器；其已验证主要表示artifact/启动约定符合，不表示插件业务正确或安全背书。

关键限制是canary的“隔离”是临时数据目录与loopback启动，不是操作系统权限沙箱。环境从process.env复制后仅删除若干Node/npm变量，其他provider API key等仍可能继承；完整profile包含已有第三方bundle并会执行其初始化，进程仍以当前OS用户权限运行，代码可访问绝对路径或网络。修改HOME并不能撤销这些能力。本轮只静态核查，未让任何第三方代码实际读取凭据。

真实profile安装先发生，随后在副本验证，失败再恢复；备份覆盖metadata与依赖树，不可能撤销任意插件初始化的外部请求/其他路径写入。全局Harness更新会重装二进制，恢复旧版依赖网络与权限；不能把恢复分支称为跨资源原子事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/canary.ts:308-331](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/canary.ts#L308-L331)

复制父环境并仅清理列举变量。

<details>
<summary>查看原文（24行）</summary>

```text
function canaryEnvironment(root: string, nonce: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DSH_HOME: root,
    HOME: root,
    USERPROFILE: root,
    XDG_CONFIG_HOME: join(root, 'config'),
    XDG_CACHE_HOME: join(root, 'cache'),
    TMPDIR: join(root, 'tmp'),
    TMP: join(root, 'tmp'),
    TEMP: join(root, 'tmp'),
    DSH_PLUGIN_CONSOLE_CANARY_NONCE: nonce,
  }
  for (const name of [
    'CORDIS_SHARED',
    'DSH_SNAPSHOT',
    'DSH_WEB_URL',
    'NODE_PATH',
    'NODE_AUTH_TOKEN',
    'NPM_TOKEN',
    'NPM_CONFIG_USERCONFIG',
    'npm_config_userconfig',
  ]) delete env[name]
  return env
```

</details>

**依据 2 · 源码核查**：[src/canary.ts:348-363](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/canary.ts#L348-L363)

普通child_process以临时cwd/env启动，无OS隔离。

<details>
<summary>查看原文（16行）</summary>

```text
  const child = spawn(dshBin, [
    '--profile',
    profileName,
    '--patch',
    prepared.patchPath,
    '--host',
    '127.0.0.1',
    '--port',
    '0',
  ], {
    cwd: prepared.cwd,
    detached: process.platform !== 'win32',
    env: canaryEnvironment(prepared.root, nonce),
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
```

</details>

**依据 3 · 源码核查**：[src/operations.ts:878-909](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L878-L909)

真实profile调用安装后才验证。

<details>
<summary>查看原文（32行）</summary>

```text
          'plugin', '--profile', this.options.profile.runtime.profileName, 'add',
          '--save-exact', '--ignore-scripts', plan.sourceSpec as string,
        ]
    let removalTargets: readonly PluginActivationTarget[] = []
    if (plan.action === 'remove') {
      try {
        removalTargets = (await this.options.profile.activationDescriptor(plan.packageName as string)).targets
      } catch {
        // A malformed bundle cannot provide safe target names. The package
        // removal still proceeds, while manifest and dependency cleanup below
        // remain authoritative.
      }
    }
    let result: CommandResult
    try {
      result = await this.runCommand(args, this.options.profile.runtime.dir, this.timeoutMs)
    } catch (error) {
      preserveDependencyBackup(dependencies)
      return snapshotResult(
        this.options.profile,
        plan.action,
        'dsh-command-indeterminate',
        plan.packageName,
        false,
        'failed',
        errorMessage(error),
        'not-run',
        'failed',
      )
    }
    let mutationState: readonly FileBackup[]
    try {
```

</details>

**依据 4 · 源码核查**：[src/operations.ts:1012-1033](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L1012-L1033)

后续canary失败回滚。

<details>
<summary>查看原文（22行）</summary>

```text
      let canary: ActivationCanaryResult
      try {
        canary = await this.runIsolatedActivation(plan.packageName as string, plan.targetVersion as string)
      } catch (error) {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        return snapshotResult(this.options.profile, plan.action, 'canary-preparation-failed', plan.packageName, false, rollback, errorMessage(error), 'failed')
      }
      if (canary.status !== 'passed') {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        const detail = canary.detail === null ? null : redactProcessOutput(canary.detail)
        const cleanup = canary.code === 'canary-shutdown-failed' ? 'failed' : 'succeeded'
        return snapshotResult(this.options.profile, plan.action, canary.code, plan.packageName, false, rollback, detail, 'failed', cleanup)
      }
      if (await backupFilesChanged(mutationState)) {
        preserveDependencyBackup(dependencies)
        return snapshotResult(
          this.options.profile,
          plan.action,
          'profile-changed-during-canary',
          plan.packageName,
          false,
          'failed',
```

</details>

**依据 5 · 源码核查**：[src/harness-operations.ts:407-459](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/harness-operations.ts#L407-L459)

Harness旧版重装与再次canary可失败。

<details>
<summary>查看原文（53行）</summary>

```text
  private async rollbackFrom(
    plan: HarnessUpdatePlan,
    expectedEntries: readonly ComposedEntry[],
    expectedClientPackages: readonly string[],
    failedUpdate: CommandResult | null,
    profileDir: string,
    profileName: string,
    detail: string | null,
    mutationSuspected: boolean,
    failedProcessCleanup: HarnessUpdateResult['processCleanup'] = failedUpdate?.timedOut === true
      ? failedUpdate.processCleanup === false ? 'failed' : 'succeeded'
      : 'not-needed',
  ): Promise<HarnessUpdateResult> {
    if (!mutationSuspected) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    // The previous version may already be intact even after a failed command.
    const current = await this.options.harness.resolve()
    if (current.status === 'managed' && current.version === plan.currentVersion) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    try {
      const args = ['install', '--global', '--prefix', plan.prefix as string, `@deepseek-ai/dsh@${plan.currentVersion as string}`]
      const restore = await this.runCommand(this.options.npmBin, args, profileDir, this.timeoutMs)
      if (restore.unavailable || restore.timedOut || restore.code !== 0) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restore.output ?? 'Rollback reinstall failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      const restored = await verifyInstalledVersion(
        this.options.harness,
        this.runCommand,
        profileDir,
        this.timeoutMs,
        plan.currentVersion as string,
        plan.installRoot,
      )
      if (!restored.ok) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restored.detail ?? 'Rollback verification failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      let canary: HarnessCanaryResult
      try {
        canary = await this.probeActivation({
          profileDir,
          profileName,
          dshBin: restored.installation?.executablePath ?? '',
          expectedEntries,
          expectedClientPackages,
          timeoutMs: this.canaryTimeoutMs,
        })
      } catch (error) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${errorMessage(error)}`.trim(), 'failed', failedProcessCleanup)
      }
      if (canary.status !== 'passed') {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${canary.detail ?? 'Rollback canary failed.'}`.trim(), 'failed', failedProcessCleanup)
```

</details>

#### 缺口

- 未全面审计完整profile中每个第三方bundle的初始化副作用。
  **影响**：即使canary结构通过也不能保证密钥/文件/网络隔离。
  **进一步探讨**：可先列最小环境白名单与各bundle初始化I/O，按明确授权另用受限容器研究执行，不能以临时HOME代替。
- 断电、回滚中断、非协作外部CLI并发修改的最终恢复未验证。
  **影响**：有锁和备份不能保证所有故障下自动回到旧状态。
  **进一步探讨**：可从不同阶段故障注入与实际磁盘/进程状态盘点入手，核查哪些副作用受恢复覆盖。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装和退出有哪些强依赖？

**研究主题**：依赖、兼容与流程

#### 完整回答

package固定多项rc.6 peers、Node最低范围和客户端注入，表明Host/Client契约较紧。管理器需webServer和loader以及文件型活动profile。目录可用last-known-good缓存，但写入计划仍需真实artifact、CLI与网络依赖。npm全局Harness升级是另外一类更广副作用，不适用所有安装方式。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24，DSH rc.6及固定Cordis/Loader peers | 主流程必需 | Host、profile和客户端接线 | 不能仅以Node能运行判断兼容 |
| 活动web profile及可写DSH_HOME | 管理必需 | manifest、lockfile、暂停配置和备份 | 非文件Loader或profile目录外拒绝 |
| HTTPS目录、npm/GitHub网络 | 商店验证必需 | 元数据、固定artifact和README | 可显示旧缓存，不能等同当前验证 |
| dsh/pnpm命令及完整profile canary可启动 | 安装/升级必需 | 真正包变更与验证 | 超时/失败进入恢复，非只改列表 |
| npm全局安装prefix | Harness升级必需 | 全局二进制重装 | 其他安装方式不提供升级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者备份profile与插件数据并固定宿主 | 只选择信任代码，临时HOME非安全沙箱 |
| 加载 | 安装管理器到web profile并重启刷新 | 目录、已装与运行中状态分别可见 |
| 变更 | 人工核对plan来源、精确版本、警告再执行 | TTL、指纹、锁和artifact重检均通过 |
| 验收 | 检查安装、canary、回滚和重启提示 | canary通过仍需重启后实际功能判断 |
| 退出 | 卸载管理器，单独治理缓存/备份/目标插件数据 | 卸载不回退历史Harness升级或删除他包数据 |


#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-22](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/package.json#L18-L22)

Node/pnpm版本。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "pnpm": ">=10"
  },
  "packageManager": "pnpm@11.22.0",
```

**依据 2 · 源码核查**：[package.json:64-79](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/package.json#L64-L79)

web客户端注入。

<details>
<summary>查看原文（16行）</summary>

```text
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
  },
  "scripts": {
    "build": "tsdown",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "release:verify": "pnpm run typecheck && pnpm run build && pnpm run test",
    "check": "pnpm run release:verify",
    "prepack": "pnpm run release:verify",
    "watch": "tsdown --watch"
  },
  "dependencies": {
```

</details>

**依据 3 · 源码核查**：[package.json:95-113](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/package.json#L95-L113)

精确rc.6 peer及Cordis。

<details>
<summary>查看原文（19行）</summary>

```text
    "@deepseek-ai/schemastery": "3.18.1",
    "react": ">=18.2.0 <20.0.0",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.1.0-rc.6"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/",
    "provenance": true
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/cordis-plugin-group": "^1.0.1",
    "@deepseek-ai/cordis-plugin-include": "^1.0.6",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.2",
    "@deepseek-ai/dsh-app-boot": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-settings": "^0.1.0-rc.6",
```

</details>

**依据 4 · 源码核查**：[src/index.ts:34-35](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/index.ts#L34-L35)

host服务。

```text

export const name = 'plugin-console'
```

**依据 5 · 源码核查**：[src/index.ts:175-190](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/index.ts#L175-L190)

profile限定。

<details>
<summary>查看原文（16行）</summary>

```text

/** Resolve the profile path from the Loader's own base URL, never from client input. */
function profileDir(ctx: Context): string {
  if (ctx.baseUrl === undefined || !ctx.baseUrl.startsWith('file:')) {
    throw new Error('dsh-plugin-console requires a file-backed profile Loader baseUrl.')
  }
  const profilesRoot = resolve(dshHomePath('profiles'))
  const dir = resolve(fileURLToPath(ctx.baseUrl))
  const child = relative(profilesRoot, dir)
  if (child.length === 0 || child.startsWith('..') || isAbsolute(child)) {
    throw new Error('dsh-plugin-console can manage only the active profile under $DSH_HOME/profiles.')
  }
  return dir
}

/** Mount the manager against only the active profile. */
```

</details>

**依据 6 · 作者声明**：[README.md:27-49](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/README.md#L27-L49)

作者安装/重启说明。

<details>
<summary>查看原文（23行）</summary>

````text
```sh
# npm 发布版（显式 @latest，重复执行即可升级到最新版）
dsh plugin --profile web add dsh-plugin-console@latest

# 本地源码检出目录
dsh plugin --profile web add .
```

### 升级到新版本

已安装旧版时，重新执行不带版本号的 `add <包名>` **不会升级**：pnpm 会保留 profile 中已有的 `^x.y.z` 版本范围并报告 "Already up to date"。升级方式任选其一：

```sh
# 方式一：显式 @latest 重新解析最新版
dsh plugin --profile web add dsh-plugin-console@latest
```

方式二：在插件管理页面一键自更新（0.2.2 起内置）——Settings → 插件管理 → 已安装 → dsh-plugin-console → 更新。

无论哪种方式，更新完成后都需要重启 `dsh web` 并刷新浏览器：Web client module roster 在进程启动时扫描 profile 包，运行中的 Host 与已打开的页面仍持有旧的启动模块图。

### 没有拿到最新版？

````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复成本和效果怎么判断？

**研究主题**：效果与总成本

#### 完整回答

共同任务应是同一profile完成同一精确插件变更并恢复工作，不以按钮点击少或canary成功等同净收益。复制依赖树、完整profile启动、客户端图检查及恢复旧版都有CPU/磁盘、下载和等待成本；正常只读浏览无强制模型调用，某些被加载插件自身仍可有外部成本。金额与耗时不能从默认timeout直接反推。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 固定DSH/Node环境与网络，金额未知 | 源码信任、profile盘点与备份 | 硬件与真实初始化耗时未测 |
| 持续使用 | 元数据请求、依赖树复制、安装及完整profile canary | 核对每次来源/版本/确认及重启 | 多插件profile会增加存储与启动开销 |
| 失败恢复 | 保留依赖备份、重装旧版、再次canary | 判断部分变更、进程清理和人工修复 | 回滚失败有独立状态，恢复时长未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 安装确定性 | plan绑定来源、精确版本、integrity与profile指纹 | 元数据与供应链本身可信程度 |
| 运行兼容 | 设计包含完整profile启动与client资源检查 | 实际UI/业务任务可用性 |
| 恢复 | 元数据/依赖备份和失败结果分类明确 | 断电、外部非协作写及任意插件副作用恢复 |


#### 证据与依据

**依据 1 · 源码核查**：[src/operations.ts:354-365](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L354-L365)

备份node_modules依赖树。

<details>
<summary>查看原文（12行）</summary>

```text
async function backupDependencies(profileDir: string): Promise<DependencyBackup> {
  const root = await mkdtemp(join(profileDir, '.dsh-plugin-console-recovery-'))
  const source = join(profileDir, 'node_modules')
  const snapshot = join(root, 'node_modules')
  try {
    if (!(await pathExists(source))) return { root, snapshot: null, preserve: false }
    await copyDependencyTree(source, snapshot)
    return { root, snapshot, preserve: false }
  } catch (error) {
    await rm(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }).catch(() => undefined)
    throw error
  }
```

</details>

**依据 2 · 源码核查**：[src/operations.ts:154-213](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L154-L213)

外部命令、输出与超时清理。

<details>
<summary>查看原文（60行）</summary>

```text
export async function command(
  executable: string,
  args: readonly string[],
  cwd: string,
  timeoutMs: number,
): Promise<CommandResult> {
  let stdout = ''
  let stderr = ''
  let stdoutTruncated = false
  let startError: Error | null = null
  const child = spawn(executable, [...args], {
    cwd,
    detached: process.platform !== 'win32',
    shell: false,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout?.on('data', (chunk: Buffer) => {
    stdout += chunk.toString('utf8')
    if (stdout.length > MAX_STDOUT_CHARS) {
      stdout = stdout.slice(-MAX_STDOUT_CHARS)
      stdoutTruncated = true
    }
  })
  child.stderr?.on('data', (chunk: Buffer) => {
    stderr += chunk.toString('utf8')
    if (stderr.length > MAX_OUTPUT_CHARS) stderr = stderr.slice(-MAX_OUTPUT_CHARS)
  })
  const exited = processExit(child, error => { startError = error })
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<null>(resolve => {
    timeoutHandle = setTimeout(() => resolve(null), timeoutMs)
  })
  const exit = await Promise.race([exited, timeout])
  if (timeoutHandle !== undefined) clearTimeout(timeoutHandle)
  let timedOut = false
  let processCleanup = true
  if (exit === null) {
    timedOut = true
    processCleanup = await terminateProcessTree(child, exited)
    if (!processCleanup) stderr += '\nThe timed-out command process tree could not be terminated completely.'
  }
  const output = redactProcessOutput(`${stdout}\n${stderr}`)
  if (startError !== null) {
    return {
      code: 1,
      unavailable: (startError as NodeJS.ErrnoException).code === 'ENOENT',
      timedOut,
      output: output ?? errorMessage(startError),
      stdout: stdout.trim().length === 0 ? null : stdout,
      stdoutTruncated,
      processCleanup,
    }
  }
  return {
    code: exit?.code ?? null,
    unavailable: false,
    timedOut,
    output,
    stdout: stdout.trim().length === 0 ? null : stdout,
```

</details>

**依据 3 · 源码核查**：[src/operations.ts:1012-1040](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L1012-L1040)

完整canary与外部变更拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
      let canary: ActivationCanaryResult
      try {
        canary = await this.runIsolatedActivation(plan.packageName as string, plan.targetVersion as string)
      } catch (error) {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        return snapshotResult(this.options.profile, plan.action, 'canary-preparation-failed', plan.packageName, false, rollback, errorMessage(error), 'failed')
      }
      if (canary.status !== 'passed') {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        const detail = canary.detail === null ? null : redactProcessOutput(canary.detail)
        const cleanup = canary.code === 'canary-shutdown-failed' ? 'failed' : 'succeeded'
        return snapshotResult(this.options.profile, plan.action, canary.code, plan.packageName, false, rollback, detail, 'failed', cleanup)
      }
      if (await backupFilesChanged(mutationState)) {
        preserveDependencyBackup(dependencies)
        return snapshotResult(
          this.options.profile,
          plan.action,
          'profile-changed-during-canary',
          plan.packageName,
          false,
          'failed',
          'The profile changed outside this operation while the isolated canary was running; the tested snapshot was not accepted.',
          'failed',
          'succeeded',
        )
      }
      const finalRow = (await this.options.profile.list('zh', false)).find(row => row.packageName === plan.packageName)
      if (finalRow === undefined || finalRow.version !== plan.targetVersion || !requestedSpecMatchesPlan(finalRow.requestedSpec, plan)) {
```

</details>

**依据 4 · 源码核查**：[src/harness-operations.ts:407-459](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/harness-operations.ts#L407-L459)

恢复旧Harness及复验再次承担成本。

<details>
<summary>查看原文（53行）</summary>

```text
  private async rollbackFrom(
    plan: HarnessUpdatePlan,
    expectedEntries: readonly ComposedEntry[],
    expectedClientPackages: readonly string[],
    failedUpdate: CommandResult | null,
    profileDir: string,
    profileName: string,
    detail: string | null,
    mutationSuspected: boolean,
    failedProcessCleanup: HarnessUpdateResult['processCleanup'] = failedUpdate?.timedOut === true
      ? failedUpdate.processCleanup === false ? 'failed' : 'succeeded'
      : 'not-needed',
  ): Promise<HarnessUpdateResult> {
    if (!mutationSuspected) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    // The previous version may already be intact even after a failed command.
    const current = await this.options.harness.resolve()
    if (current.status === 'managed' && current.version === plan.currentVersion) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    try {
      const args = ['install', '--global', '--prefix', plan.prefix as string, `@deepseek-ai/dsh@${plan.currentVersion as string}`]
      const restore = await this.runCommand(this.options.npmBin, args, profileDir, this.timeoutMs)
      if (restore.unavailable || restore.timedOut || restore.code !== 0) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restore.output ?? 'Rollback reinstall failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      const restored = await verifyInstalledVersion(
        this.options.harness,
        this.runCommand,
        profileDir,
        this.timeoutMs,
        plan.currentVersion as string,
        plan.installRoot,
      )
      if (!restored.ok) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restored.detail ?? 'Rollback verification failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      let canary: HarnessCanaryResult
      try {
        canary = await this.probeActivation({
          profileDir,
          profileName,
          dshBin: restored.installation?.executablePath ?? '',
          expectedEntries,
          expectedClientPackages,
          timeoutMs: this.canaryTimeoutMs,
        })
      } catch (error) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${errorMessage(error)}`.trim(), 'failed', failedProcessCleanup)
      }
      if (canary.status !== 'passed') {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${canary.detail ?? 'Rollback canary failed.'}`.trim(), 'failed', failedProcessCleanup)
```

</details>

#### 缺口

- 缺少同profile手工CLI与控制台在成功/失败变更的完整时间、磁盘及修复人时对照。
  **影响**：不能给出更省时间/更可靠的量化承诺。
  **进一步探讨**：可用固定依赖集合比较精确安装、版本冲突及恢复任务，分别记录下载、复制、canary和人工判断。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些机制可复用，可恢复变更收据怎么验证？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

工程亮点是先plan后execute、短TTL/一次消费/指纹重检、来源和integrity绑定、profile锁目录的nonce拥有权与原子改名回收，及安装结果/进程清理/回滚分别报告。命令使用参数数组shell:false，避免把目标直接拼shell；但普通执行本身继承父环境，不能凭此称安全沙箱。

可继续探讨“最小能力变更收据”。plan记录待执行代码、允许环境键、数据目录/网络预期与回滚覆盖资源，canary使用环境白名单和可选OS约束；执行后保留可读的精确版本、验证、未知副作用和恢复位置。相对现有快照恢复，新增的是信任/副作用边界可审阅，而非更多通过标记。假设未验证，代价是适配多插件依赖、兼容失败和收据隐私治理。可用读取不应继承的假密钥、外目录写、启动失败及回滚网络失败夹具，比较泄露、不可恢复变更与人工修复时间；若白名单破坏正常插件且无可靠替代，应修正方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/lock.ts:39-86](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/lock.ts#L39-L86)

nonce锁拥有权与stale目录原子回收。

<details>
<summary>查看原文（48行）</summary>

```text
export async function acquireProfileLock(profileDir: string): Promise<() => Promise<void>> {
  await mkdir(profileDir, { recursive: true })
  const lockDir = join(profileDir, LOCK_DIR)
  const ownerPath = join(lockDir, OWNER_FILE)
  const nonce = randomUUID()

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await mkdir(lockDir, { mode: 0o700 })
      await writeFile(ownerPath, `${JSON.stringify({ pid: process.pid, nonce, createdAt: new Date().toISOString() })}\n`, {
        encoding: 'utf8',
        flag: 'wx',
        mode: 0o600,
      })
      return async () => {
        const current = await owner(ownerPath)
        if (current?.nonce !== nonce || current.pid !== process.pid) return
        await rm(lockDir, { recursive: true, force: true })
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      await delay(OWNER_WRITE_GRACE_MS)
      const current = await owner(ownerPath)
      if (current !== null && pidAlive(current.pid)) throw new ProfileLockedError()
      if (current === null) {
        let info
        try {
          info = await stat(lockDir)
        } catch (statError) {
          if ((statError as NodeJS.ErrnoException).code === 'ENOENT') continue
          throw statError
        }
        if (Date.now() - info.mtimeMs < OWNERLESS_STALE_MS) throw new ProfileLockedError()
      }
      // Claim the exact stale directory before removing it. Deleting lockDir
      // directly would let two reclaimers race and remove a new owner's lock.
      const staleDir = join(profileDir, `${LOCK_DIR}.stale-${nonce}-${String(attempt)}`)
      try {
        await rename(lockDir, staleDir)
      } catch (renameError) {
        if ((renameError as NodeJS.ErrnoException).code === 'ENOENT') continue
        throw renameError
      }
      await rm(staleDir, { recursive: true, force: true })
    }
  }
  throw new ProfileLockedError()
}
```

</details>

**依据 2 · 源码核查**：[src/operations.ts:731-746](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L731-L746)

一次消费与运行并发拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
  async execute(planId: string): Promise<OperationResult> {
    this.prunePlans()
    if (this.disposed) return snapshotResult(this.options.profile, null, 'manager-disposed', null, false, 'not-needed', null)
    if (this.operation !== null || this.busy) return snapshotResult(this.options.profile, null, 'operation-busy', null, false, 'not-needed', null)
    const stored = this.plans.get(planId)
    this.plans.delete(planId)
    if (stored === undefined) return snapshotResult(this.options.profile, null, 'plan-invalid-or-expired', null, false, 'not-needed', null)
    if (Date.parse(stored.plan.expiresAt ?? '') <= this.now()) return snapshotResult(this.options.profile, stored.plan.action, 'plan-expired', stored.plan.packageName, false, 'not-needed', null)
    if (stored.fingerprint !== this.options.profile.fingerprint()) return snapshotResult(this.options.profile, stored.plan.action, 'profile-changed', stored.plan.packageName, false, 'not-needed', null)
    const plan = stored.plan
    if (plan.packageName === null) return snapshotResult(this.options.profile, plan.action, 'plan-invalid', null, false, 'not-needed', null)

    // Reserve synchronously before any filesystem or process await. A second
    // request in the same turn therefore cannot enter the mutation path.
    this.options.profile.setBusy(true)
    const operation = this.prepareAndRun(plan, stored.fingerprint)
```

</details>

**依据 3 · 源码核查**：[src/operations.ts:154-170](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L154-L170)

参数数组shell:false仍继承环境。

<details>
<summary>查看原文（17行）</summary>

```text
export async function command(
  executable: string,
  args: readonly string[],
  cwd: string,
  timeoutMs: number,
): Promise<CommandResult> {
  let stdout = ''
  let stderr = ''
  let stdoutTruncated = false
  let startError: Error | null = null
  const child = spawn(executable, [...args], {
    cwd,
    detached: process.platform !== 'win32',
    shell: false,
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
```

</details>

**依据 4 · 源码核查**：[src/canary.ts:308-331](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/canary.ts#L308-L331)

白名单假设的源代码起点。

<details>
<summary>查看原文（24行）</summary>

```text
function canaryEnvironment(root: string, nonce: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DSH_HOME: root,
    HOME: root,
    USERPROFILE: root,
    XDG_CONFIG_HOME: join(root, 'config'),
    XDG_CACHE_HOME: join(root, 'cache'),
    TMPDIR: join(root, 'tmp'),
    TMP: join(root, 'tmp'),
    TEMP: join(root, 'tmp'),
    DSH_PLUGIN_CONSOLE_CANARY_NONCE: nonce,
  }
  for (const name of [
    'CORDIS_SHARED',
    'DSH_SNAPSHOT',
    'DSH_WEB_URL',
    'NODE_PATH',
    'NODE_AUTH_TOKEN',
    'NPM_TOKEN',
    'NPM_CONFIG_USERCONFIG',
    'npm_config_userconfig',
  ]) delete env[name]
  return env
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合当前采用，什么时候停止？

**研究主题**：采用判断

#### 完整回答

推荐trial，限本地单人维护、能盘点信任代码和恢复profile的使用者。控制台整合安装前核对和失败处理有实用价值，但只把canary当兼容线索，不能将未知社区包作为沙箱中可随意启动的对象。不要把Harness升级和普通插件浏览的风险混为一谈。

继续探讨可先只读目录/已装清单，核对精确宿主契约与备份，然后在无真实密钥的可丢弃副本按明确授权研究单个可信包变更。来源/版本变化、锁冲突、进程未清理、rollback failed或canary运行时profile被外部改动都应停止追加写入，保留备份与收据后盘点实际状态。扩大使用需补Q02的能力隔离与Q04成本结果，本轮不执行安装或canary。

#### 证据与依据

**依据 1 · 源码核查**：[src/operations.ts:1012-1040](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/operations.ts#L1012-L1040)

canary/外部profile变化的失败分支。

<details>
<summary>查看原文（29行）</summary>

```text
      let canary: ActivationCanaryResult
      try {
        canary = await this.runIsolatedActivation(plan.packageName as string, plan.targetVersion as string)
      } catch (error) {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        return snapshotResult(this.options.profile, plan.action, 'canary-preparation-failed', plan.packageName, false, rollback, errorMessage(error), 'failed')
      }
      if (canary.status !== 'passed') {
        const rollback = await this.rollback(backups, true, plan, mutationState, dependencies)
        const detail = canary.detail === null ? null : redactProcessOutput(canary.detail)
        const cleanup = canary.code === 'canary-shutdown-failed' ? 'failed' : 'succeeded'
        return snapshotResult(this.options.profile, plan.action, canary.code, plan.packageName, false, rollback, detail, 'failed', cleanup)
      }
      if (await backupFilesChanged(mutationState)) {
        preserveDependencyBackup(dependencies)
        return snapshotResult(
          this.options.profile,
          plan.action,
          'profile-changed-during-canary',
          plan.packageName,
          false,
          'failed',
          'The profile changed outside this operation while the isolated canary was running; the tested snapshot was not accepted.',
          'failed',
          'succeeded',
        )
      }
      const finalRow = (await this.options.profile.list('zh', false)).find(row => row.packageName === plan.packageName)
      if (finalRow === undefined || finalRow.version !== plan.targetVersion || !requestedSpecMatchesPlan(finalRow.requestedSpec, plan)) {
```

</details>

**依据 2 · 源码核查**：[src/canary.ts:308-331](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/canary.ts#L308-L331)

继承环境影响信任范围。

<details>
<summary>查看原文（24行）</summary>

```text
function canaryEnvironment(root: string, nonce: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DSH_HOME: root,
    HOME: root,
    USERPROFILE: root,
    XDG_CONFIG_HOME: join(root, 'config'),
    XDG_CACHE_HOME: join(root, 'cache'),
    TMPDIR: join(root, 'tmp'),
    TMP: join(root, 'tmp'),
    TEMP: join(root, 'tmp'),
    DSH_PLUGIN_CONSOLE_CANARY_NONCE: nonce,
  }
  for (const name of [
    'CORDIS_SHARED',
    'DSH_SNAPSHOT',
    'DSH_WEB_URL',
    'NODE_PATH',
    'NODE_AUTH_TOKEN',
    'NPM_TOKEN',
    'NPM_CONFIG_USERCONFIG',
    'npm_config_userconfig',
  ]) delete env[name]
  return env
```

</details>

**依据 3 · 源码核查**：[src/harness-operations.ts:407-459](https://github.com/AlexYin-Tongji/dsh-plugin-console/blob/224e53959c1b03f83993b80f8438b49b17d820d6/src/harness-operations.ts#L407-L459)

全局升级恢复可失败。

<details>
<summary>查看原文（53行）</summary>

```text
  private async rollbackFrom(
    plan: HarnessUpdatePlan,
    expectedEntries: readonly ComposedEntry[],
    expectedClientPackages: readonly string[],
    failedUpdate: CommandResult | null,
    profileDir: string,
    profileName: string,
    detail: string | null,
    mutationSuspected: boolean,
    failedProcessCleanup: HarnessUpdateResult['processCleanup'] = failedUpdate?.timedOut === true
      ? failedUpdate.processCleanup === false ? 'failed' : 'succeeded'
      : 'not-needed',
  ): Promise<HarnessUpdateResult> {
    if (!mutationSuspected) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    // The previous version may already be intact even after a failed command.
    const current = await this.options.harness.resolve()
    if (current.status === 'managed' && current.version === plan.currentVersion) {
      return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'not-needed', detail, 'not-run', failedProcessCleanup)
    }
    try {
      const args = ['install', '--global', '--prefix', plan.prefix as string, `@deepseek-ai/dsh@${plan.currentVersion as string}`]
      const restore = await this.runCommand(this.options.npmBin, args, profileDir, this.timeoutMs)
      if (restore.unavailable || restore.timedOut || restore.code !== 0) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restore.output ?? 'Rollback reinstall failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      const restored = await verifyInstalledVersion(
        this.options.harness,
        this.runCommand,
        profileDir,
        this.timeoutMs,
        plan.currentVersion as string,
        plan.installRoot,
      )
      if (!restored.ok) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${restored.detail ?? 'Rollback verification failed.'}`.trim(), 'not-run', failedProcessCleanup)
      }
      let canary: HarnessCanaryResult
      try {
        canary = await this.probeActivation({
          profileDir,
          profileName,
          dshBin: restored.installation?.executablePath ?? '',
          expectedEntries,
          expectedClientPackages,
          timeoutMs: this.canaryTimeoutMs,
        })
      } catch (error) {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${errorMessage(error)}`.trim(), 'failed', failedProcessCleanup)
      }
      if (canary.status !== 'passed') {
        return this.snapshot('failed', 'harness-update-command-failed', plan, false, 'failed', `${detail ?? ''} ${canary.detail ?? 'Rollback canary failed.'}`.trim(), 'failed', failedProcessCleanup)
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
