# DSH fnOS Integration

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[4058fee](https://github.com/FNOSP/fnos-dsh/tree/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin)

<!-- BEGIN META -->
[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FNOSP/fnos-dsh) [![npm 30d 9,447](https://img.shields.io/static/v1?label=npm+30d&message=9%2C447&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-fnos) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-fnos)
<!-- END META -->

> **功能**：把NAS授权目录、文件打开和主题接入fnOS应用载体

> **亮点**：[Q01](#research-q01) 集中系统载体、授权目录和主题接线。

> **主要限制**：[Q03](#research-q03) 缺uid时不执行用户ACL，ACL接口失败时可退为应用目录授权。来源门禁不能证明用户身份，当前源码不支持共享NAS用户隔离结论。

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
  - [Q01 · 对fnOS用户的具体贡献？](#detail-section-11)
  - [Q02 · 打开和路径验证如何接线？](#detail-section-12)
  - [Q03 · 授权和主题哪些边界值得关注？](#detail-section-13)
  - [Q04 · 怎样采用与退出？](#detail-section-14)
  - [Q05 · 什么结果推翻采用条件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：fnOS用户需从DSH打开授权NAS文件。

切到NAS文件管理器手找路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| NAS文件打开 | 目录定位和文件预览委托 | 需fnOS web carrier |
| 路径验证 | 核对进程访问与真实根，条件查询用户ACL | 不同入口应分别验收 |
| 主题跟随 | system时投影fnOS主题 | 显式DSH偏好优先 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| fnOS iframe与SDK | 系统功能必需 | 打开应用及主题 | standalone明确失败 |
| NAS授权与网关ACL | 文件访问必需 | 应用目录及条件用户ACL | 缺uid或API失败可降为应用范围，不能据此保证用户隔离 |
| DSH rc.2 | 作者前置 | 宿主接缝 | 其他版本另验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 只授权测试目录并记原主题 | 确认当前NAS用户 |
| 操作 | 分别打开目录和文件并测试拒绝 | 看实际应用和状态码 |
| 退出 | 停用并撤销测试授权 | 核对主题和系统授权 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | NAS环境资源未知 | 配置载体及测试用户耗时未知 | 部署成本未知 |
| 持续 | 文件与系统服务资源未知 | 权限变更和版本回归耗时未知 | 不同入口不可互相代验 |
| 恢复 | 清理资源未知 | 撤权、主题及设置对账耗时未知 | 卸载是否清理授权未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件委托 | 源码调用SDK打开 | 目标系统实际结果未知 |
| 路径限制 | 路由检查真实路径，用户ACL有降级 | 竞争和多入口一致性未知 |
| 主题 | 有条件投影和dispose恢复 | 实际组合兼容未验 |

> **思考**：[Q03](#research-q03) 缺uid时不执行用户ACL，ACL接口失败时可退为应用目录授权。来源门禁不能证明用户身份，当前源码不支持共享NAS用户隔离结论。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中系统载体、授权目录和主题接线。

真实路径和多层ACL验证，主题有条件投影和释放。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 缺uid时不执行用户ACL，ACL接口失败时可退为应用目录授权。来源门禁不能证明用户身份，当前源码不支持共享NAS用户隔离结论。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只在单用户隔离测试目录观察，先审外层网关和直达宿主路径；依赖多用户隔离的部署应继续使用fnOS原生文件管理器，直至逐入口证明用户权限。退出撤销系统授权并核对主题和设置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的让fnOS用户从DSH定位授权文件并正确处理拒绝。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-fnos-plugin/README.md、plugins/dsh-fnos-plugin/src/client/services/file-opener.ts、plugins/dsh-fnos-plugin/src/host/authorized-directories.ts、plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts、plugins/dsh-fnos-plugin/src/client/services/sdk-carrier.ts、plugins/dsh-fnos-plugin/src/client/index.ts 及固定范围 inventory；组件：plugins/dsh-fnos-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的让fnOS用户从DSH定位授权文件并正确处理拒绝。未执行目标代码或实际宿主验证。
- 下一步：保存SDK返回、网关身份和文件实际打开记录。

**分析版本**

- **仓库**：[FNOSP/fnos-dsh](https://github.com/FNOSP/fnos-dsh)
- **版本号**：7.0.16（[固定提交 4058fee](https://github.com/FNOSP/fnos-dsh/tree/4058feee0fa16d34e123f917978abe47c205f830)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少定位路径步骤而保持拒绝可见。

保存SDK返回、网关身份和文件实际打开记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 216 |
| .ts | source | 48 | 6171 | 4450 | 1230 | — |
| .tsx | source | 9 | 2061 | 1598 | 345 | — |
| .ts | test | 44 | 5886 | 4384 | 826 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让fnOS用户从DSH定位授权文件并正确处理拒绝

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对fnOS用户的具体贡献？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

NAS用户在DSH看到文件后，通常还需切到文件管理器找路径。本组件把目录或文件交给fnOS SDK对应打开方式，并提供授权目录设置及主题跟随。贡献是载体接线而非另造文件预览器。合格流程是授权目录可定位，文件打开正确应用，无权限时给出拒绝。普通浏览器不应被当作完整fnOS环境。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-fnos-plugin/README.md:13-20](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/README.md#L13-L20)

作者说明iframe依赖和功能

```text
装完重启 Web profile 即可。主题、文件授权和 fnOS 应用交互需要在 fnOS 的 iframe 里运行，普通浏览器只能用不依赖系统 SDK 的那部分界面。

## 功能

- 主题跟随 fnOS：DSH 设成跟随系统时，读取并监听 fnOS 当前主题
- 授权目录管理：在设置里查看和取消 NAS 目录访问权限
- 在应用中打开：把文件、链接丢进对应的 fnOS 应用
- 把 DSH 页面标题同步到 fnOS 应用窗口
```

**依据 2 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/file-opener.ts:32-43](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/file-opener.ts#L32-L43)

目录与文件调用不同SDK接口

<details>
<summary>查看原文（12行）</summary>

```text
export async function openFnosEntry(
  path: string,
  kind: 'directory' | 'file',
  createSdk: () => EntryOpenerSdk,
): Promise<void> {
  const sdk = createSdk()
  await sdk.ready()
  if (!sdk.isWeb || sdk.isStandaloneWeb) {
    throw new Error('fnOS iframe SDK did not initialize its web carrier')
  }
  if (kind === 'directory') await sdk.openFileManager(path)
  else await sdk.openFile(path)
```

</details>

#### 缺口

- 真实fnOS版本、应用映射和打开结果未验。
  **影响**：点击成功不证明文件被正确应用读取。
  **进一步探讨**：用虚构目录和非敏文件在目标fnOS验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 打开和路径验证如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端等待SDK ready，要求web且非standalone后调用文件或目录打开。宿主HTTP路由的authorize检查同源或本机对端，然后验证输入和真实路径、进程读取。用户ACL是条件检查：gatewayUserId仅解析X-Trim-Userid中的非负安全整数；没有uid时checkCurrentUserAcl直接把待查路径视为可读。有uid且API成功时才按用户ACL过滤；API失败时若存在应用声明根，退为这些根内可读，只有没有可用根才available:false并最终503。因此该链不能概括为始终强制用户ACL或失败关闭。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/file-opener.ts:19-43](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/file-opener.ts#L19-L43)

SDK委托和拒绝路径

<details>
<summary>查看原文（25行）</summary>

```text
 * 打开一个 NAS 条目：目录走文件管理器，文件走 fnOS 的打开/预览能力。
 *
 * 只在 web carrier 就绪时调用：fnOS iframe 未连上宿主时 SDK 以 standalone
 * 模式启动，调用会静默无效。这里显式失败，由调用方转成可见提示，不回退到
 * DSH 原生打开——NAS 服务容器里没有桌面环境，回退只会把错误藏起来。
 *
 * 路径直接传给 fnOS，不由插件预检：面板展示的授权列表可能滞后于 fnOS 的
 * ACL 状态，预检会误拒合法路径。是否允许由 fnOS 自行判断。
 *
 * @param path - 目标条目的内部路径。
 * @param kind - 条目类型，决定用文件管理器还是文件打开。
 * @param createSdk - SDK 工厂，由调用方传入。
 */
export async function openFnosEntry(
  path: string,
  kind: 'directory' | 'file',
  createSdk: () => EntryOpenerSdk,
): Promise<void> {
  const sdk = createSdk()
  await sdk.ready()
  if (!sdk.isWeb || sdk.isStandaloneWeb) {
    throw new Error('fnOS iframe SDK did not initialize its web carrier')
  }
  if (kind === 'directory') await sdk.openFileManager(path)
  else await sdk.openFile(path)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:564-605](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L564-L605)

进程、realpath和用户ACL检查

<details>
<summary>查看原文（42行）</summary>

```text
async function validateReadableAuthorizedPath(
  req: IncomingMessage | undefined,
  path: string,
  roots: readonly string[],
  checkUserAcl: UserAclChecker,
): Promise<PathValidationResult> {
  let pathStat: Stats
  try {
    pathStat = await stat(path)
  } catch {
    return { ok: false, failure: 'fnos-path-not-found' }
  }
  try {
    const mode = pathStat.isDirectory() ? fsConstants.R_OK | fsConstants.X_OK : fsConstants.R_OK
    await access(path, mode)
  } catch {
    return { ok: false, failure: 'fnos-path-not-readable' }
  }
  if (!await isResolvedPathWithinAuthorizedRoots(path, roots)) {
    return { ok: false, failure: 'fnos-path-not-authorized' }
  }

  const userAcl = await checkUserAcl(req, [path], roots)
  if (!userAcl.available) return { ok: false, failure: 'fnos-user-permission-unavailable' }
  if (!userAcl.readable.has(path)) return { ok: false, failure: 'fnos-user-permission-denied' }
  return { ok: true }
}

/**
 * Validate a DSH file/directory target using all applicable permission layers:
 * the app's real shared roots, the process's actual fs access, and the
 * current NAS user ACL supplied by the unified gateway.
 */
export async function validatePathForOpen(
  pathValue: unknown,
  req?: IncomingMessage,
  options: PathValidationOptions = {},
): Promise<PathValidationResult> {
  const path = normalizePathForAuthorization(pathValue)
  if (path === undefined) return { ok: false, failure: 'fnos-path-not-authorized' }
  const roots = await currentAuthorizedRoots(options)
  return validateReadableAuthorizedPath(req, path, roots, options.checkUserAcl ?? checkCurrentUserAcl)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:1306-1322](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L1306-L1322)

实际HTTP校验路由

<details>
<summary>查看原文（17行）</summary>

```text
      register({
        kind: 'exact',
        path: FNOS_PATH_OPEN_VALIDATION_PATH,
        handler: async (req, res) => {
          if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
          if (!authorize(req, res)) return
          try {
            const path = openPathValue(await readJsonBody(req))
            if (path === undefined) return json(res, 400, { error: 'invalid-fnos-path' })
            const validation = await validatePathForOpen(path, req)
            if (!validation.ok) {
              const status = validation.failure === 'fnos-path-not-found' ? 404
                : validation.failure === 'fnos-user-permission-unavailable' ? 503
                  : 403
              return json(res, status, { error: validation.failure })
            }
            json(res, 200, { ok: true })
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:139-143](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L139-L143)

网关uid解析

```text
export function gatewayUserId(req: IncomingMessage | undefined): number | undefined {
  const value = req === undefined ? undefined : header(req, 'x-trim-userid')?.trim()
  if (value === undefined || !/^\d+$/u.test(value)) return undefined
  const uid = Number(value)
  return Number.isSafeInteger(uid) && uid >= 0 ? uid : undefined
```

**依据 5 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:182-206](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L182-L206)

同源与loopback门禁

<details>
<summary>查看原文（25行）</summary>

```text
function localPeer(req: IncomingMessage): boolean {
  const remote = req.socket.remoteAddress
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

/**
 * Accept the NAS gateway's same-origin requests, but reject cross-site calls.
 *
 * Three independent rejections, strongest signal first:
 * 1. `sec-fetch-site: cross-site` — set by the browser, not forgeable by page
 *    scripts; rejected before anything else is considered.
 * 2. An `Origin` that disagrees with the delivered authority — catches a page
 *    on another site issuing a credentialed request.
 * 3. No `Origin` at all from a non-loopback peer — a same-origin browser request
 *    always carries one, so its absence means a non-browser client.
 *
 * The comparison is only meaningful because both sides read the same rewritten
 * `host`; see {@link requestOrigin}.
 */
export function isTrustedFnosRequest(req: IncomingMessage): boolean {
  const fetchSite = header(req, 'sec-fetch-site')?.trim().toLowerCase()
  if (fetchSite === 'cross-site') return false
  const origin = header(req, 'origin')
  if (origin !== undefined) return requestOrigin(req) === normalizeOrigin(origin)
  return localPeer(req)
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:322-352](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L322-L352)

缺uid直接可读及ACL失败应用根降级

<details>
<summary>查看原文（31行）</summary>

```text
export const checkCurrentUserAcl: UserAclChecker = async (req, paths, fallbackRoots = []) => {
  const uid = gatewayUserId(req)
  const normalizedPaths = normalizeAuthorizedPaths(paths)
  if (uid === undefined || normalizedPaths.length === 0) {
    return { available: true, readable: new Set(normalizedPaths) }
  }
  try {
    const data = await callFnOsApi<unknown>('trim.file.checkUserACL', {
      uid,
      path: normalizedPaths.length === 1 ? normalizedPaths[0] : normalizedPaths,
    })
    return userAclResult(data)
  } catch (error: unknown) {
    console.warn('[dsh-fnos] unable to check current fnOS user ACL', error)
    // The fnOS runtime already supplies the paths visible to the application
    // through its environment. This is also the source used by the workspace
    // card when the shared-access API is unavailable. Keep the picker usable
    // during that same degraded state, but retain the application root and
    // filesystem checks instead of treating every path as readable.
    const declaredRoots = mergeAuthorizedPaths(
      fallbackRoots,
      accessiblePathsFromEnvironment(),
      dataSharePathsFromEnvironment(),
      defaultApplicationPathsFromEnvironment(),
    )
    if (declaredRoots.length > 0) {
      const readable = normalizedPaths.filter(path => isPathWithinAuthorizedDirectory(path, declaredRoots))
      console.warn('[dsh-fnos] using fnOS declared paths because the current-user ACL query failed')
      return { available: true, readable: new Set(readable) }
    }
    return { available: false, readable: new Set() }
```

</details>

#### 缺口

- 各调用入口是否都执行同一ACL策略未全面验。
  **影响**：只测一个验证函数不能证明全部文件操作隔离。
  **进一步探讨**：对SDK打开、列表和修改分别做拒绝测试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 授权和主题哪些边界值得关注？

**研究主题**：缺陷与关键质疑

#### 完整回答

isTrustedFnosRequest拒绝cross-site，存在Origin时比较投递Host，无Origin仅接受loopback。这是请求来源门禁，不验证X-Trim-Userid的签发者。用户身份可信性依赖外层网关清洗和注入。当前实现确认在uid缺失时跳过用户ACL，在ACL查询失败且应用根非空时回退为应用范围，仍保留进程权限与realpath边界。该取舍维持应用可用性，却不能支撑多NAS用户隔离；不同用户对应用根内文件的权限可能被合并。SDK打开把最终权限交给fnOS，不能替代宿主列表或其他操作的审查。主题system投影和dispose恢复属独立界面机制。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:944-964](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L944-L964)

realpath限制和状态码

<details>
<summary>查看原文（21行）</summary>

```text
async function isResolvedPathWithinAuthorizedRoots(path: string, roots: readonly string[]): Promise<boolean> {
  try {
    const resolvedPath = normalizePathForAuthorization(await realpath(path))
    if (resolvedPath === undefined) return false
    return roots.some(root => root === '/' || resolvedPath === root || resolvedPath.startsWith(`${root}/`))
  } catch {
    return false
  }
}

function authorizedEntriesErrorForValidation(result: PathValidationResult): AuthorizedEntriesError {
  switch (result.failure) {
    case 'fnos-path-not-found':
      return new AuthorizedEntriesError('authorized-directory-not-found', 404)
    case 'fnos-path-not-readable':
    case 'fnos-user-permission-denied':
      return new AuthorizedEntriesError('authorized-directory-not-readable', 403)
    case 'fnos-user-permission-unavailable':
      return new AuthorizedEntriesError('fnos-user-permission-check-unavailable', 503)
    default:
      return new AuthorizedEntriesError('fnos-path-not-authorized', 403)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/file-opener.ts:25-26](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/file-opener.ts#L25-L26)

SDK路径最终权限由fnOS判

```text
 * 路径直接传给 fnOS，不由插件预检：面板展示的授权列表可能滞后于 fnOS 的
 * ACL 状态，预检会误拒合法路径。是否允许由 fnOS 自行判断。
```

**依据 3 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts:48-78](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts#L48-L78)

主题条件和恢复

<details>
<summary>查看原文（31行）</summary>

```text
  const refresh = (): void => {
    const theme = ctx.theme
    const preference = theme.getTheme().preference
    if (preference !== 'system') {
      if (isDshThemePreference(preference)) persistence.sync(preference, null)
      // DSH's ThemePresenter owns explicit light/dark DOM state. Do not
      // restore the state captured before the temporary system projection.
      clearSystemTheme(false)
      return
    }

    const fnosTheme = bridge.getTheme()
    persistence.sync(preference, fnosTheme)
    if (fnosTheme === null) return

    applySystemTheme(fnosTheme)
    // DSH's ThemePresenter also listens to theme/change. Re-apply after the
    // current event turn so the fnOS state wins regardless of listener order.
    queueMicrotask(() => {
      if (ctx.theme.getTheme().preference === 'system' && bridge.getTheme() === fnosTheme) {
        applySystemTheme(fnosTheme)
      }
    })
  }

  return {
    refresh,
    dispose(): void {
      clearSystemTheme(true)
    },
  }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/sdk-carrier.ts:3-8](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/sdk-carrier.ts#L3-L8)

iframe与UA为载体检测

```text
export function isEmbeddedFnosFrame(): boolean {
  return typeof window !== 'undefined' && window.parent !== window
}

export function shouldForceWebCarrier(userAgent: string, embedded: boolean): boolean {
  return embedded && /FNAppVer\//iu.test(userAgent)
```

**依据 5 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:139-143](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L139-L143)

网关uid解析

```text
export function gatewayUserId(req: IncomingMessage | undefined): number | undefined {
  const value = req === undefined ? undefined : header(req, 'x-trim-userid')?.trim()
  if (value === undefined || !/^\d+$/u.test(value)) return undefined
  const uid = Number(value)
  return Number.isSafeInteger(uid) && uid >= 0 ? uid : undefined
```

**依据 6 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:182-206](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L182-L206)

同源与loopback门禁

<details>
<summary>查看原文（25行）</summary>

```text
function localPeer(req: IncomingMessage): boolean {
  const remote = req.socket.remoteAddress
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

/**
 * Accept the NAS gateway's same-origin requests, but reject cross-site calls.
 *
 * Three independent rejections, strongest signal first:
 * 1. `sec-fetch-site: cross-site` — set by the browser, not forgeable by page
 *    scripts; rejected before anything else is considered.
 * 2. An `Origin` that disagrees with the delivered authority — catches a page
 *    on another site issuing a credentialed request.
 * 3. No `Origin` at all from a non-loopback peer — a same-origin browser request
 *    always carries one, so its absence means a non-browser client.
 *
 * The comparison is only meaningful because both sides read the same rewritten
 * `host`; see {@link requestOrigin}.
 */
export function isTrustedFnosRequest(req: IncomingMessage): boolean {
  const fetchSite = header(req, 'sec-fetch-site')?.trim().toLowerCase()
  if (fetchSite === 'cross-site') return false
  const origin = header(req, 'origin')
  if (origin !== undefined) return requestOrigin(req) === normalizeOrigin(origin)
  return localPeer(req)
```

</details>

**依据 7 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:322-352](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L322-L352)

缺uid直接可读及ACL失败应用根降级

<details>
<summary>查看原文（31行）</summary>

```text
export const checkCurrentUserAcl: UserAclChecker = async (req, paths, fallbackRoots = []) => {
  const uid = gatewayUserId(req)
  const normalizedPaths = normalizeAuthorizedPaths(paths)
  if (uid === undefined || normalizedPaths.length === 0) {
    return { available: true, readable: new Set(normalizedPaths) }
  }
  try {
    const data = await callFnOsApi<unknown>('trim.file.checkUserACL', {
      uid,
      path: normalizedPaths.length === 1 ? normalizedPaths[0] : normalizedPaths,
    })
    return userAclResult(data)
  } catch (error: unknown) {
    console.warn('[dsh-fnos] unable to check current fnOS user ACL', error)
    // The fnOS runtime already supplies the paths visible to the application
    // through its environment. This is also the source used by the workspace
    // card when the shared-access API is unavailable. Keep the picker usable
    // during that same degraded state, but retain the application root and
    // filesystem checks instead of treating every path as readable.
    const declaredRoots = mergeAuthorizedPaths(
      fallbackRoots,
      accessiblePathsFromEnvironment(),
      dataSharePathsFromEnvironment(),
      defaultApplicationPathsFromEnvironment(),
    )
    if (declaredRoots.length > 0) {
      const readable = normalizedPaths.filter(path => isPathWithinAuthorizedDirectory(path, declaredRoots))
      console.warn('[dsh-fnos] using fnOS declared paths because the current-user ACL query failed')
      return { available: true, readable: new Set(readable) }
    }
    return { available: false, readable: new Set() }
```

</details>

#### 缺口

- 外层网关是否可靠清洗X-Trim-Userid并阻止用户直达宿主未验。
  **影响**：若缺uid或可伪造身份请求可达，宿主可能只按应用根授权，无法确认用户级隔离。
  **进一步探讨**：用双用户、缺头、伪造头及绕网关路径检查整个部署。
- ACL API故障时应用根回退已由源码确认，但各修改入口的影响范围未完整核查。
  **影响**：共享部署可能把当前用户不可读文件暴露给应用可访问路径。
  **进一步探讨**：限制单人测试目录，逐个枚举列表、读、导出、重命名和删除操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

仅建议在单用户隔离测试目录观察，不用于依赖用户级隔离的共享NAS。需要作者指定rc.2、fnOS iframe和系统SDK，先记录原主题及系统授权。首次成本包括外层网关身份与直达路径审查，持续包括ACL故障和宿主升级回归。退出停用插件并在fnOS撤销测试目录，核对主题及授权留存。恢复文件入口需先用原生fnOS文件管理器验证用户权限。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-fnos-plugin/README.md:5-20](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/README.md#L5-L20)

安装及运行载体条件

<details>
<summary>查看原文（16行）</summary>

````text
## 安装

插件随 `fn-deepseek-harness` 自动安装。其他 DSH 环境手动安装，要求 DSH `0.2.0-rc.2` ：

```sh
dsh plugin --profile web add @tnnevol/dsh-fnos@7.0.16
```

装完重启 Web profile 即可。主题、文件授权和 fnOS 应用交互需要在 fnOS 的 iframe 里运行，普通浏览器只能用不依赖系统 SDK 的那部分界面。

## 功能

- 主题跟随 fnOS：DSH 设成跟随系统时，读取并监听 fnOS 当前主题
- 授权目录管理：在设置里查看和取消 NAS 目录访问权限
- 在应用中打开：把文件、链接丢进对应的 fnOS 应用
- 把 DSH 页面标题同步到 fnOS 应用窗口
````

</details>

**依据 2 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts:73-78](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts#L73-L78)

主题释放路径

```text
  return {
    refresh,
    dispose(): void {
      clearSystemTheme(true)
    },
  }
```

**依据 3 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/index.ts:108-115](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/index.ts#L108-L115)

文件与标题等effect接线

```text
  ctx.effect(() => installFnosRemotePathOpener(ctx.remote.session, {
    createSdk: createTrimApp,
    message: key => t(key),
  }), 'dsh-fnos: fnOS path opener')
  ctx.effect(() => installFnosPageTitle(createTrimApp), 'dsh-fnos: fnOS page title')
  ctx.effect(() => installFnosBrowserRefreshShortcut(), 'dsh-fnos: browser refresh shortcut')
  ctx.effect(() => installFnosSettingsShortcut(), 'dsh-fnos: settings shortcut')
  ctx.effect(() => installWorkspaceAuthorizedShortcut(t), 'dsh-fnos: workspace authorized shortcut')
```

**依据 4 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:139-143](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L139-L143)

网关uid解析

```text
export function gatewayUserId(req: IncomingMessage | undefined): number | undefined {
  const value = req === undefined ? undefined : header(req, 'x-trim-userid')?.trim()
  if (value === undefined || !/^\d+$/u.test(value)) return undefined
  const uid = Number(value)
  return Number.isSafeInteger(uid) && uid >= 0 ? uid : undefined
```

**依据 5 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:182-206](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L182-L206)

同源与loopback门禁

<details>
<summary>查看原文（25行）</summary>

```text
function localPeer(req: IncomingMessage): boolean {
  const remote = req.socket.remoteAddress
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

/**
 * Accept the NAS gateway's same-origin requests, but reject cross-site calls.
 *
 * Three independent rejections, strongest signal first:
 * 1. `sec-fetch-site: cross-site` — set by the browser, not forgeable by page
 *    scripts; rejected before anything else is considered.
 * 2. An `Origin` that disagrees with the delivered authority — catches a page
 *    on another site issuing a credentialed request.
 * 3. No `Origin` at all from a non-loopback peer — a same-origin browser request
 *    always carries one, so its absence means a non-browser client.
 *
 * The comparison is only meaningful because both sides read the same rewritten
 * `host`; see {@link requestOrigin}.
 */
export function isTrustedFnosRequest(req: IncomingMessage): boolean {
  const fetchSite = header(req, 'sec-fetch-site')?.trim().toLowerCase()
  if (fetchSite === 'cross-site') return false
  const origin = header(req, 'origin')
  if (origin !== undefined) return requestOrigin(req) === normalizeOrigin(origin)
  return localPeer(req)
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:322-352](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L322-L352)

缺uid直接可读及ACL失败应用根降级

<details>
<summary>查看原文（31行）</summary>

```text
export const checkCurrentUserAcl: UserAclChecker = async (req, paths, fallbackRoots = []) => {
  const uid = gatewayUserId(req)
  const normalizedPaths = normalizeAuthorizedPaths(paths)
  if (uid === undefined || normalizedPaths.length === 0) {
    return { available: true, readable: new Set(normalizedPaths) }
  }
  try {
    const data = await callFnOsApi<unknown>('trim.file.checkUserACL', {
      uid,
      path: normalizedPaths.length === 1 ? normalizedPaths[0] : normalizedPaths,
    })
    return userAclResult(data)
  } catch (error: unknown) {
    console.warn('[dsh-fnos] unable to check current fnOS user ACL', error)
    // The fnOS runtime already supplies the paths visible to the application
    // through its environment. This is also the source used by the workspace
    // card when the shared-access API is unavailable. Keep the picker usable
    // during that same degraded state, but retain the application root and
    // filesystem checks instead of treating every path as readable.
    const declaredRoots = mergeAuthorizedPaths(
      fallbackRoots,
      accessiblePathsFromEnvironment(),
      dataSharePathsFromEnvironment(),
      defaultApplicationPathsFromEnvironment(),
    )
    if (declaredRoots.length > 0) {
      const readable = normalizedPaths.filter(path => isPathWithinAuthorizedDirectory(path, declaredRoots))
      console.warn('[dsh-fnos] using fnOS declared paths because the current-user ACL query failed')
      return { available: true, readable: new Set(readable) }
    }
    return { available: false, readable: new Set() }
```

</details>

#### 缺口

- 卸载后NAS授权和本机持久设置留存未验。
  **影响**：只卸载bundle可能仍保留系统授权。
  **进一步探讨**：用系统授权页与原配置逐项对账。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果推翻采用条件？

**研究主题**：新假设与验证

#### 完整回答

同一文件任务比较手工文件管理器和插件打开，记录耗时、目标应用及错误。测试standalone、符号链接、ACL不可用、撤权后再次打开和双用户。若无权限打开成功、SDK未就绪静默完成或退出主题未恢复，停止在该环境采用。验证应在虚构目录进行。 特别把无X-Trim-Userid、伪造uid、ACL接口故障但应用根仍存在设为明确反例。若这些路径在共享部署仍能读取另一用户禁止的文件，则用户隔离采用目标被推翻。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/file-opener.ts:32-43](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/file-opener.ts#L32-L43)

载体错误可测

<details>
<summary>查看原文（12行）</summary>

```text
export async function openFnosEntry(
  path: string,
  kind: 'directory' | 'file',
  createSdk: () => EntryOpenerSdk,
): Promise<void> {
  const sdk = createSdk()
  await sdk.ready()
  if (!sdk.isWeb || sdk.isStandaloneWeb) {
    throw new Error('fnOS iframe SDK did not initialize its web carrier')
  }
  if (kind === 'directory') await sdk.openFileManager(path)
  else await sdk.openFile(path)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:564-589](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L564-L589)

授权拒绝可测

<details>
<summary>查看原文（26行）</summary>

```text
async function validateReadableAuthorizedPath(
  req: IncomingMessage | undefined,
  path: string,
  roots: readonly string[],
  checkUserAcl: UserAclChecker,
): Promise<PathValidationResult> {
  let pathStat: Stats
  try {
    pathStat = await stat(path)
  } catch {
    return { ok: false, failure: 'fnos-path-not-found' }
  }
  try {
    const mode = pathStat.isDirectory() ? fsConstants.R_OK | fsConstants.X_OK : fsConstants.R_OK
    await access(path, mode)
  } catch {
    return { ok: false, failure: 'fnos-path-not-readable' }
  }
  if (!await isResolvedPathWithinAuthorizedRoots(path, roots)) {
    return { ok: false, failure: 'fnos-path-not-authorized' }
  }

  const userAcl = await checkUserAcl(req, [path], roots)
  if (!userAcl.available) return { ok: false, failure: 'fnos-user-permission-unavailable' }
  if (!userAcl.readable.has(path)) return { ok: false, failure: 'fnos-user-permission-denied' }
  return { ok: true }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts:73-78](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/client/services/theme-controller.ts#L73-L78)

清理可测

```text
  return {
    refresh,
    dispose(): void {
      clearSystemTheme(true)
    },
  }
```

**依据 4 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:139-143](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L139-L143)

网关uid解析

```text
export function gatewayUserId(req: IncomingMessage | undefined): number | undefined {
  const value = req === undefined ? undefined : header(req, 'x-trim-userid')?.trim()
  if (value === undefined || !/^\d+$/u.test(value)) return undefined
  const uid = Number(value)
  return Number.isSafeInteger(uid) && uid >= 0 ? uid : undefined
```

**依据 5 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:182-206](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L182-L206)

同源与loopback门禁

<details>
<summary>查看原文（25行）</summary>

```text
function localPeer(req: IncomingMessage): boolean {
  const remote = req.socket.remoteAddress
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

/**
 * Accept the NAS gateway's same-origin requests, but reject cross-site calls.
 *
 * Three independent rejections, strongest signal first:
 * 1. `sec-fetch-site: cross-site` — set by the browser, not forgeable by page
 *    scripts; rejected before anything else is considered.
 * 2. An `Origin` that disagrees with the delivered authority — catches a page
 *    on another site issuing a credentialed request.
 * 3. No `Origin` at all from a non-loopback peer — a same-origin browser request
 *    always carries one, so its absence means a non-browser client.
 *
 * The comparison is only meaningful because both sides read the same rewritten
 * `host`; see {@link requestOrigin}.
 */
export function isTrustedFnosRequest(req: IncomingMessage): boolean {
  const fetchSite = header(req, 'sec-fetch-site')?.trim().toLowerCase()
  if (fetchSite === 'cross-site') return false
  const origin = header(req, 'origin')
  if (origin !== undefined) return requestOrigin(req) === normalizeOrigin(origin)
  return localPeer(req)
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-fnos-plugin/src/host/authorized-directories.ts:322-352](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-fnos-plugin/src/host/authorized-directories.ts#L322-L352)

缺uid直接可读及ACL失败应用根降级

<details>
<summary>查看原文（31行）</summary>

```text
export const checkCurrentUserAcl: UserAclChecker = async (req, paths, fallbackRoots = []) => {
  const uid = gatewayUserId(req)
  const normalizedPaths = normalizeAuthorizedPaths(paths)
  if (uid === undefined || normalizedPaths.length === 0) {
    return { available: true, readable: new Set(normalizedPaths) }
  }
  try {
    const data = await callFnOsApi<unknown>('trim.file.checkUserACL', {
      uid,
      path: normalizedPaths.length === 1 ? normalizedPaths[0] : normalizedPaths,
    })
    return userAclResult(data)
  } catch (error: unknown) {
    console.warn('[dsh-fnos] unable to check current fnOS user ACL', error)
    // The fnOS runtime already supplies the paths visible to the application
    // through its environment. This is also the source used by the workspace
    // card when the shared-access API is unavailable. Keep the picker usable
    // during that same degraded state, but retain the application root and
    // filesystem checks instead of treating every path as readable.
    const declaredRoots = mergeAuthorizedPaths(
      fallbackRoots,
      accessiblePathsFromEnvironment(),
      dataSharePathsFromEnvironment(),
      defaultApplicationPathsFromEnvironment(),
    )
    if (declaredRoots.length > 0) {
      const readable = normalizedPaths.filter(path => isPathWithinAuthorizedDirectory(path, declaredRoots))
      console.warn('[dsh-fnos] using fnOS declared paths because the current-user ACL query failed')
      return { available: true, readable: new Set(readable) }
    }
    return { available: false, readable: new Set() }
```

</details>

#### 缺口

- 未执行fnOS或NAS集成。
  **影响**：无法确认操作收益和系统授权是否按预期生效。
  **进一步探讨**：保存SDK返回、网关身份和文件实际打开记录。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
