# dsh-workspace-menu

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[afd5551](https://github.com/0imzero/dsh-workspace-menu/tree/afd55510f82821cde60a8364e42f752e244b5b31)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu)
<!-- END META -->

> **实现功能**：为DSH工作区和会话行增加右键/双击菜单，集中置顶、复制、归档及目录打开/删除操作。

> **核心亮点**：集中常见行操作并提供跨平台文件管理器接线，依赖宿主与archive-manager完成多数业务动作。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：Host递归删除接受绝对path而不绑定注册workspace/确认计划，UI双确认与功能开关不能约束接口；会话清理失败还会继续删目录。详见[Q02](#research-q02)。

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
  - [Q01 · 这个菜单适合谁，行操作怎样落到真实副作用？](#detail-section-11)
  - [Q02 · 集成贡献和最重要的删除边界是什么？](#detail-section-12)
  - [Q03 · 依赖、退出和三阶段成本效果如何评估？](#detail-section-13)
  - [Q04 · 工程上能复用什么，删除计划假设怎样证伪？](#detail-section-14)
  - [Q05 · 当前建议是什么，何时停止？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要频繁管理DSH主页会话与工作区的读者，正确目标与分步结果比菜单数量更重要。

原生会话/工作区菜单加OS文件管理器可替代；插件集中入口但引入fiber兼容与目录删除权限面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 行菜单 | 复制/置顶/重命名/归档等 | 私有fiber与宿主形状依赖 |
| OS打开 | 打开目录或文件管理器 | spawn成功非打开完成 |
| 永久删除 | 会话记录与目录清理 | 多阶段不可恢复，Host目标未绑定 |
| 本地偏好 | 置顶/未读/功能开关 | 浏览器本地，非服务端权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web、Cordis与React18 | 主流程必需 | 会话/工作区服务、槽位、DOM | peer范围宽不证明全部兼容 |
| 内部React fiber/行props形状 | 行定位必需 | 找到session/workspace ID | 宿主改布局可能错配或无菜单 |
| webServer/webRuntime与OS文件管理器 | Host动作必需 | Host/Origin围栏、打开目录 | spawn成功不等文件管理器完成 |
| archive-manager | 永久删除链必需 | 删除会话磁盘记录 | 不是声明的自动依赖，本插件未验证其全部行为 |
| localStorage | 偏好/置顶/未读持久化 | 浏览器本地状态 | 禁用或清站点丢失偏好 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定Release包和宿主，核对Host危险路由 | 不把关闭UI删除开关当作禁用Host删除 |
| 加载 | 安装web profile并重启刷新 | 双击/右键能定位预期行 |
| 使用 | 优先核对复制、置顶等可逆动作 | ID、目录与当前行一致 |
| 退出 | 停用插件并检查路由/DOM清理，单独清偏好 | 卸载不能恢复已经删除的数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Release包与可选archive-manager，金额未知 | 核对来源、宿主行结构及备份 | 不强制模型调用 |
| 持续使用 | DOM观察/徽标刷新和浏览器本地存储 | 核对行定位与功能开关 | 大会话列表刷新成本未测 |
| 失败恢复 | 偏好重设、版本回退及外部备份恢复 | 区分会话记录/目录/registry部分完成 | 永久删除本身无内建撤回 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 操作可达 | 集中常见菜单动作 | 同任务人时与误操作率 |
| 兼容维护 | 不改内置源码并清理监听 | fiber/DOM升级兼容性 |
| 删除交付 | 调用记录删除与目录删除 | 全部记录均成功及可恢复性 |

> **思考**：Host递归删除接受绝对path而不绑定注册workspace/确认计划，UI双确认与功能开关不能约束接口；会话清理失败还会继续删目录。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：集中常见行操作并提供跨平台文件管理器接线，依赖宿主与archive-manager完成多数业务动作。详见[Q01](#research-q01)与[Q02](#research-q02)。

集中常见行操作并提供跨平台文件管理器接线，依赖宿主与archive-manager完成多数业务动作。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是路由按WebServer WeakMap共享引用计数，避免热重载重复注册；UI observer/事件/RAF/effect清理以及按平台用参数数组调用文件管理器，也减少资源残留。它们不能代替目录授权或恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host递归删除接受绝对path而不绑定注册workspace/确认计划，UI双确认与功能开关不能约束接口；会话清理失败还会继续删目录。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，优先核查/修正Host目标授权与分步恢复；UI关闭危险项不能替代Host控制。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工作区/会话菜单的界面接线与原生服务复用；绝对路径递归删除未绑定已注册工作区，不能视为受限安全删除。一次性版本绑定删除及恢复收据仍为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.ts、src/index.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整Host及Client行定位、删除链、本地偏好和生命周期；未审计archive-manager或执行文件管理器/删除。
- 下一步：进一步探讨可用无rm桩测试非注册路径、重复确认、第N会话失败及fiber误配，先看目标绑定与分步恢复。

**分析版本**

- **仓库**：[0imzero/dsh-workspace-menu](https://github.com/0imzero/dsh-workspace-menu)
- **版本号**：1.2.0（[固定提交 afd5551](https://github.com/0imzero/dsh-workspace-menu/tree/afd55510f82821cde60a8364e42f752e244b5b31)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨workspace/物理路径绑定的一次性恢复删除计划，按步留收据并提供回收位置；有存储和跨插件协作成本，未验证。详见[Q04](#research-q04)。

进一步探讨可用无rm桩测试非注册路径、重复确认、第N会话失败及fiber误配，先看目标绑定与分步恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 340 | — | — | 2797 |
| .js | source | 2 | 1251 | 1215 | 37 | — |
| .mjs | source | 1 | 34 | 24 | 4 | — |
| .ts | source | 3 | 1472 | 1355 | 43 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu/issues?q=is%3Aissue+created%3A2026-09-22T05%3A29%3A18.788Z..2026-10-22T05%3A29%3A18.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A29%3A18.788Z..2026-10-22T05%3A29%3A18.788Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查主页菜单交互、Host目录动作及永久删除的目标与恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个菜单适合谁，行操作怎样落到真实副作用？

**研究主题：**场景与需求、功能与机制

#### 完整回答

适合在DSH主页管理大量会话/工作区并希望右键快速操作的人。输入是DOM命中的行、fiber恢复的session/workspace标识和浏览器偏好，输出可能是复制/置顶，也可能是Host打开目录、原生会话操作或永久磁盘删除。合格动作需目标ID和路径正确，不能只看菜单弹出。

Client从__reactFiber$和memoizedProps向上最多30层识别行，调用宿主sessions/workspaces服务；置顶/未读等保存在localStorage，深链接轮询等待会话清单。Host提供打开文件管理器与删除目录两条POST路由。永久删除会话复用archive-manager，目录由本包rm，职责分开不等一致事务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/README.md#L3-L12)

作者场景及能力归属。

<details>
<summary>查看原文（10行）</summary>

```text
把 DSH 主页的工作区和会话管理补齐：双击或右键，就能置顶、重命名、打开资源管理器、归档、分叉、复制、新窗口打开。所有开关都收在通用设置里，按需开启。

## 亮点

- **工作区操作**：置顶、重命名、在资源管理器中打开、复制路径、新建会话、从列表移除、删除工作区（含磁盘）
- **会话操作**：置顶、重命名、标记未读/已读、归档、分叉、复制会话链接、复制会话标题、在新窗口中打开、打开所在目录、删除会话（含磁盘记录）
- **跨平台**：Windows 用资源管理器，macOS 用 Finder，Linux 自动选择 `xdg-open` / `gio` / 常见文件管理器
- **设置集成**：功能开关放在 DSH 通用设置里，支持折叠，逐项开关，不用的时候不会占菜单
- **不动内置源码**：通过 DOM 事件和 React fiber 定位工作区/会话行，不修改 DSH 自带代码
- **删除与归档管理不冲突**：永久删除会话复用 `@mlgbnb/dsh-archive-manager`，本插件只负责移除工作区目录，不直接改写归档/projcache 文件
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:188-220](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L188-L220)

fiber内部属性识别目标。

<details>
<summary>查看原文（33行）</summary>

```text
 * Read the React fiber attached to a built-in row DOM node and recover the
 * component props (group/node). This lets us map a row to its workspace/session
 * id without touching the built-in package source.
 */
function fiberPropsOf(el: Element): Record<string, any> | undefined {
  const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$'))
  if (!key) return undefined
  let fiber: any = (el as any)[key]
  for (let i = 0; fiber && i < 30; i++) {
    const props = fiber.memoizedProps
    const sessionNode = props?.node?.id !== undefined
      && typeof props.node.updatedAt === 'number'
      && typeof props.node.blank === 'boolean'
    if (props && (props.group !== undefined || sessionNode)) return props
    fiber = fiber.return
  }
  return undefined
}

function rowInfo(el: Element, sessions: ISessions, workspaces: IWorkspaces): RowInfo | undefined {
  const props = fiberPropsOf(el)
  if (props?.node?.id !== undefined && typeof props.node.updatedAt === 'number' && typeof props.node.blank === 'boolean') {
    const node = props.node
    return {
      kind: 'session',
      id: String(node.id),
      title: String(node.title ?? node.displayTitle ?? ''),
    }
  }
  if (props?.group !== undefined) {
    const group = props.group
    const workspaceId = group.workspaceId === undefined ? '' : String(group.workspaceId)
    if (!workspaceId) return undefined
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:157-179](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L157-L179)

偏好localStorage。

<details>
<summary>查看原文（23行）</summary>

```text
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      pinnedWorkspaces: Array.isArray(parsed.pinnedWorkspaces) ? parsed.pinnedWorkspaces : [],
      pinnedSessions: Array.isArray(parsed.pinnedSessions) ? parsed.pinnedSessions : [],
      unreadSessions: Array.isArray(parsed.unreadSessions) ? parsed.unreadSessions : [],
      features: { ...DEFAULT_FEATURES, ...(parsed.features ?? {}) },
    }
  } catch {
    return defaultState()
  }
}

function isFeatureEnabled(state: PersistedState, key: FeatureKey): boolean {
  return state.features[key] !== false
}

function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable — keep the session-local behavior only.
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:276-307](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L276-L307)

会话与目录分别请求。

<details>
<summary>查看原文（32行）</summary>

```text
/** 永久删除会话：复用 dsh-archive-manager 的删除接口，避免与它冲突。 */
async function permanentDeleteSession(sessionId: string): Promise<void> {
  const response = await fetch('/api/dsh-archive-manager/delete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  if (!response.ok) {
    let message = `delete failed (${response.status})`
    try {
      const data = await response.json() as { error?: string }
      if (data.error) message = data.error
    } catch {
      // keep status message
    }
    throw new Error(message)
  }
}

/** 删除工作区目录（会话记录先交给 dsh-archive-manager 清理，目录由本插件安全移除）。 */
async function deleteWorkspaceDirectory(path: string): Promise<void> {
  const response = await fetch('/dsh-workspace-menu/delete-workspace-directory', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path }),
  })
  if (!response.ok) {
    let message = `delete failed (${response.status})`
    try {
      const data = await response.json() as { error?: { message?: string } }
      if (data.error?.message) message = data.error.message
    } catch {
```

</details>

**依据 5 · 源码核查**：[src/index.ts:213-261](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L213-L261)

Host动作路由。

<details>
<summary>查看原文（49行）</summary>

```text
  if (existing !== undefined) {
    existing.references += 1
    return () => releaseRoutes(ctx.webServer, existing)
  }

  const disposers = [
    ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-workspace-menu/open-in-explorer',
      handler: async (req, res) => {
        if (!isTrustedApiRequest(req, ctx.webRuntime.trustedHosts)) {
          writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
          return
        }
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        try {
          const body = (await readJsonBody(req)) as { path?: unknown } | null
          const raw = typeof body?.path === 'string' ? body.path : ''
          if (!raw || !isAbsolute(raw) || raw.includes('\0')) {
            writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid absolute path' } })
            return
          }
          await openInOs(raw)
          writeJson(res, 200, { ok: true })
        } catch (error) {
          writeJson(res, 400, { ok: false, error: { code: 'open-failed', message: error instanceof Error ? error.message : String(error) } })
        }
      },
    }),
    ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-workspace-menu/delete-workspace-directory',
      handler: async (req, res) => {
        if (!isTrustedApiRequest(req, ctx.webRuntime.trustedHosts)) {
          writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
          return
        }
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        try {
          const body = (await readJsonBody(req)) as { path?: unknown } | null
          const raw = typeof body?.path === 'string' ? body.path : ''
          if (!raw || !isAbsolute(raw) || raw.includes('\0') || isForbiddenDeletePath(raw)) {
            writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid or protected directory' } })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 集成贡献和最重要的删除边界是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献在常见会话/工作区动作的交互集中和跨平台文件管理器接线，避免改内置源码。大部分业务动作仍来自宿主和archive-manager；采用React私有fiber虽不修改源码，却引入未公开结构依赖，不能据此承诺无侵入兼容。

关键限制是删除目录Host API接受客户端绝对path，除NUL和少数等值禁止路径外，不核对workspaceRegistry、workspace ID、物理路径或同次确认。Host/Origin围栏限制请求来源，不构成目标目录授权，浏览器双确认只在UI里，Host路由始终注册且不读取功能开关。具备同Host调用能力者可能对非注册目录触发递归rm；本轮未调用或删除。

UI多阶段删除也有部分完成问题，每个会话记录删除错误被catch后继续，然后删目录、移除registry，最后可显示工作区已删除，即便记录清理失败。反过来目录删除失败时先前成功删除的会话记录也不会自动恢复。文件管理器spawn事件即成功，Linux回退并不等待打开程序后续失败，不保证用户真正看到了目录。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:96-111](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L96-L111)

Host/Origin围栏且Origin缺省允许。

<details>
<summary>查看原文（16行）</summary>

```text

function isTrustedApiRequest(req: HttpRequest, trustedHosts: readonly string[]): boolean {
  const host = header(req.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false
  if (header(req.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(req.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:197-207](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L197-L207)

仅少数等值禁止路径。

<details>
<summary>查看原文（11行）</summary>

```text
}

function isForbiddenDeletePath(path: string): boolean {
  const normalized = normalize(path)
  const dshHome = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  const forbidden = [process.cwd(), homedir(), dshHome, process.env.SystemRoot ?? ''].filter(Boolean)
  for (const item of forbidden) {
    const n = normalize(item)
    if (normalized === n || normalized === n + sep) return true
  }
  if (normalized === '/' || normalized === '\\' || /^[a-zA-Z]:[\\/]?$/.test(normalized)) return true
```

</details>

**依据 3 · 源码核查**：[src/index.ts:245-268](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L245-L268)

Host删除绝对路径后直接recursive rm。

<details>
<summary>查看原文（24行）</summary>

```text
    ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-workspace-menu/delete-workspace-directory',
      handler: async (req, res) => {
        if (!isTrustedApiRequest(req, ctx.webRuntime.trustedHosts)) {
          writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
          return
        }
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        try {
          const body = (await readJsonBody(req)) as { path?: unknown } | null
          const raw = typeof body?.path === 'string' ? body.path : ''
          if (!raw || !isAbsolute(raw) || raw.includes('\0') || isForbiddenDeletePath(raw)) {
            writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid or protected directory' } })
            return
          }
          await rm(normalize(raw), { recursive: true, force: true })
          writeJson(res, 200, { ok: true })
        } catch (error) {
          writeJson(res, 400, { ok: false, error: { code: 'delete-failed', message: error instanceof Error ? error.message : String(error) } })
        }
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:555-581](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L555-L581)

UI确认与会话失败吞掉后继续目录删除。

<details>
<summary>查看原文（27行）</summary>

```text
      id: 'delete-disk',
      label: '删除工作区（含磁盘）',
      danger: true,
      disabled: !ws,
      onClick: () => {
        if (!ws) return
        const first = window.confirm(`确定要删除工作区“${title}”吗？\n这会删除该目录下的所有文件。`)
        if (!first) return
        const second = window.confirm(`再次确认：删除工作区“${title}”将永久移除磁盘目录与全部会话记录，且无法恢复。\n确定继续吗？`)
        if (!second) return
        const run = async (): Promise<void> => {
          // 会话记录统一交给 dsh-archive-manager 删除，避免两套逻辑冲突。
          for (const sessionId of ws.sessionIds) {
            await permanentDeleteSession(sessionId).catch(() => undefined)
          }
          await deleteWorkspaceDirectory(ws.path)
          await ctx.workspaces.delete(workspaceId)
          void ctx.workspaces.refresh()
        }
        run().then(() => {
          flashMessage('工作区已删除')
        }).catch((e) => {
          console.warn('[dsh-workspace-menu] delete workspace disk failed', e)
          flashMessage(`删除失败：${e instanceof Error ? e.message : String(e)}`)
        })
      },
    })
```

</details>

**依据 5 · 源码核查**：[src/index.ts:142-161](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L142-L161)

spawn事件即resolve。

<details>
<summary>查看原文（20行）</summary>

```text
    let settled = false
    const child = spawn(cmd, args, { detached: true, stdio: 'ignore' })
    child.on('error', (error) => {
      if (settled) return
      settled = true
      reject(error)
    })
    child.on('spawn', () => {
      if (settled) return
      settled = true
      child.unref()
      resolve()
    })
    child.on('exit', (code) => {
      if (settled) return
      settled = true
      if (code === 0 || code === null) resolve()
      else reject(new Error(`opener exited with code ${code}`))
    })
  })
```

</details>

#### 缺口

- 实际Host外层认证、可信Host配置和调用者范围未完整确定。
  **影响：**不能将插件内目标校验缺失等同已经可由任意外部站点利用。
  **进一步探讨：**可从固定Host认证与可信来源入手，用不执行rm的桩验证非注册目录和缺确认请求是否会被拒绝。
- archive-manager固定实现与恢复能力未在本轮审计。
  **影响：**不能承诺删除记录可靠或会话/目录跨系统回滚。
  **进一步探讨：**可另固定其版本研究失败响应、幂等及恢复材料，先看分步结果而不只最终toast。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、退出和三阶段成本效果如何评估？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

包private:true，作者主分发是Release tgz，README包名不等npm可直接安装。peer声明范围较宽，真实兼容仍受fiber/DOM结构影响。永久删除依赖archive-manager但package未列为自动依赖，需维护者另核；停用不等清除localStorage，更不能恢复已删除文件。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web、Cordis与React18 | 主流程必需 | 会话/工作区服务、槽位、DOM | peer范围宽不证明全部兼容 |
| 内部React fiber/行props形状 | 行定位必需 | 找到session/workspace ID | 宿主改布局可能错配或无菜单 |
| webServer/webRuntime与OS文件管理器 | Host动作必需 | Host/Origin围栏、打开目录 | spawn成功不等文件管理器完成 |
| archive-manager | 永久删除链必需 | 删除会话磁盘记录 | 不是声明的自动依赖，本插件未验证其全部行为 |
| localStorage | 偏好/置顶/未读持久化 | 浏览器本地状态 | 禁用或清站点丢失偏好 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定Release包和宿主，核对Host危险路由 | 不把关闭UI删除开关当作禁用Host删除 |
| 加载 | 安装web profile并重启刷新 | 双击/右键能定位预期行 |
| 使用 | 优先核对复制、置顶等可逆动作 | ID、目录与当前行一致 |
| 退出 | 停用插件并检查路由/DOM清理，单独清偏好 | 卸载不能恢复已经删除的数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Release包与可选archive-manager，金额未知 | 核对来源、宿主行结构及备份 | 不强制模型调用 |
| 持续使用 | DOM观察/徽标刷新和浏览器本地存储 | 核对行定位与功能开关 | 大会话列表刷新成本未测 |
| 失败恢复 | 偏好重设、版本回退及外部备份恢复 | 区分会话记录/目录/registry部分完成 | 永久删除本身无内建撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 操作可达 | 集中常见菜单动作 | 同任务人时与误操作率 |
| 兼容维护 | 不改内置源码并清理监听 | fiber/DOM升级兼容性 |
| 删除交付 | 调用记录删除与目录删除 | 全部记录均成功及可恢复性 |

完整任务应统计准确完成同一管理动作的人时、错行/误删和恢复成本，不按菜单项目数量计收益。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-23](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/package.json#L2-L23)

版本、private与peer。

<details>
<summary>查看原文（22行）</summary>

```text
  "name": "@dsh-external/dsh-workspace-menu",
  "version": "1.2.0",
  "description": "DSH 主页工作区/会话右键与双击增强菜单：置顶、重命名、资源管理器打开、归档、分叉、复制、新窗口等",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.en.md",
    "LICENSE"
  ],
  "license": "BSD-3-Clause",
  "peerDependencies": {
    "@deepseek-ai/dsh-client-runtime": ">=0.0.1-rc <2",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.0.1-rc <2",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.0.1-rc <2",
    "cordis": ">=4.0.0-rc <5",
    "react": "^18.2.0"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:39-62](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/README.md#L39-L62)

作者Release安装、localStorage与删除依赖。

<details>
<summary>查看原文（24行）</summary>

````text
设置集成在 DSH 通用设置（General）里，可以单独开关每个功能。

## 安装

从 Releases 下载 tgz，然后：

```bash
dsh plugin --profile web add dsh-external-dsh-workspace-menu-1.2.0.tgz
```

本地开发：

```bash
npm install
npm run build
```

## 说明

- “在资源管理器中打开”由 Host 调用系统文件管理器：Windows 用资源管理器，macOS 用 Finder，Linux 自动选择 `xdg-open` / `gio` / 常见文件管理器。
- 置顶和未读状态存在浏览器 localStorage。
- 新窗口打开依赖 `?session=<id>` 深链。
- 设置项位于 DSH 设置 → 通用设置，可折叠展开。
- “删除会话（含磁盘记录）”和“删除工作区（含磁盘）”都需要安装 `@mlgbnb/dsh-archive-manager`；会话记录由它删除，本插件只负责移除工作区目录。
````

</details>

**依据 3 · 源码核查**：[src/client/index.ts:1093-1125](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L1093-L1125)

DOM观察与生命周期清理。

<details>
<summary>查看原文（33行）</summary>

```text
      if (!document.body) {
        document.addEventListener('DOMContentLoaded', start, { once: true })
        return
      }
      started = true
      const removeStyle = injectStyles()
      const onDoubleClick = (event: MouseEvent): void => handleRowEvent(event, ctx)
      const onContextMenu = (event: MouseEvent): void => handleRowEvent(event, ctx)
      document.addEventListener('dblclick', onDoubleClick, true)
      document.addEventListener('contextmenu', onContextMenu, true)

      let raf = 0
      const observer = new MutationObserver(() => {
        window.cancelAnimationFrame(raf)
        raf = window.requestAnimationFrame(() => refreshBadges(ctx))
      })
      observer.observe(document.body, { childList: true, subtree: true })
      refreshBadges(ctx)

      cleanup = () => {
        window.cancelAnimationFrame(raf)
        observer.disconnect()
        document.removeEventListener('dblclick', onDoubleClick, true)
        document.removeEventListener('contextmenu', onContextMenu, true)
        removeStyle()
        removeMenu()
        document.querySelectorAll(`.${MODAL_CLASS}-backdrop`).forEach((el) => el.remove())
      }
    }

    start()
    return () => {
      if (!started) document.removeEventListener('DOMContentLoaded', start)
```

</details>

#### 缺口

- 没有同列表规模下原生与菜单操作的人时、错误率、DOM刷新负担和恢复对照。
  **影响：**不能量化提效或宣称大列表平滑。
  **进一步探讨：**可先比较复制/置顶/归档等可逆任务，记录正确ID与耗时，再用桩模拟删除各阶段失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程上能复用什么，删除计划假设怎样证伪？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用的是路由按WebServer WeakMap共享引用计数，避免热重载重复注册；UI observer/事件/RAF/effect清理以及按平台用参数数组调用文件管理器，也减少资源残留。它们不能代替目录授权或恢复。

由Q02可探讨未验证的“绑定workspace的可恢复删除计划”。Host从真实registry和realpath解析目标，生成短时一次性计划，明确会话集合、目录指纹及备份/回收站位置，确认后逐步执行并保留每步收据，任一步失败明确部分完成而非成功toast。相对当前任意path和UI确认，它增加副作用目标与恢复所有权，代价是存储、并发状态与archive-manager协作。可用非注册路径、路径替换、重复计划和第N会话失败的无删除桩检查拒绝率与恢复覆盖；若仍有未知目标或无法回收，应停止真正删除链。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:51-60](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L51-L60)

共享route lease设计。

<details>
<summary>查看原文（10行）</summary>

```text
interface RouteLease {
  references: number
  dispose: () => void
}

// The development hot-reloader can apply the same linked bundle more than
// once. New DSH WebServer versions reject duplicate exact routes, so route
// ownership is shared by all plugin instances that use the same server.
const routeLeases = new WeakMap<WebServer, RouteLease>()

```

</details>

**依据 2 · 源码核查**：[src/index.ts:270-291](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L270-L291)

引用计数释放路由。

<details>
<summary>查看原文（22行）</summary>

```text
    }),
  ]
  const lease: RouteLease = {
    references: 1,
    dispose: () => {
      for (const dispose of disposers) dispose()
    },
  }
  routeLeases.set(ctx.webServer, lease)
  return () => releaseRoutes(ctx.webServer, lease)
}

function releaseRoutes(webServer: WebServer, lease: RouteLease): void {
  lease.references -= 1
  if (lease.references !== 0 || routeLeases.get(webServer) !== lease) return
  routeLeases.delete(webServer)
  lease.dispose()
}

export function apply(ctx: AppContext): void {
  ctx.effect(() => acquireRoutes(ctx), '@dsh-external/dsh-workspace-menu: host routes')
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:1105-1125](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L1105-L1125)

observer/事件/RAF清理。

<details>
<summary>查看原文（21行）</summary>

```text
      const observer = new MutationObserver(() => {
        window.cancelAnimationFrame(raf)
        raf = window.requestAnimationFrame(() => refreshBadges(ctx))
      })
      observer.observe(document.body, { childList: true, subtree: true })
      refreshBadges(ctx)

      cleanup = () => {
        window.cancelAnimationFrame(raf)
        observer.disconnect()
        document.removeEventListener('dblclick', onDoubleClick, true)
        document.removeEventListener('contextmenu', onContextMenu, true)
        removeStyle()
        removeMenu()
        document.querySelectorAll(`.${MODAL_CLASS}-backdrop`).forEach((el) => el.remove())
      }
    }

    start()
    return () => {
      if (!started) document.removeEventListener('DOMContentLoaded', start)
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:565-574](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L565-L574)

假设针对当前分步副作用。

<details>
<summary>查看原文（10行）</summary>

```text
        const run = async (): Promise<void> => {
          // 会话记录统一交给 dsh-archive-manager 删除，避免两套逻辑冲突。
          for (const sessionId of ws.sessionIds) {
            await permanentDeleteSession(sessionId).catch(() => undefined)
          }
          await deleteWorkspaceDirectory(ws.path)
          await ctx.workspaces.delete(workspaceId)
          void ctx.workspaces.refresh()
        }
        run().then(() => {
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前建议是什么，何时停止？

**研究主题：**采用判断

#### 完整回答

推荐observe。复制/置顶/重命名等集中菜单有清楚用途，但开启插件同时注册真实递归删除接口，关闭界面删除开关不能限制该接口，当前目标授权和部分完成处理影响整包采用。应先修Host目标与计划边界，再评估trial，而不是仅提示读者小心点击。

继续探讨可先用只读源码与无rm桩检查Host来源、workspace ID/realpath绑定和记录删除失败；再在明确授权下研究可恢复副本。若目标无法唯一对应、出现非注册路径、记录清理失败仍宣告全部成功、fiber错配或备份不明，应停止相关操作。建议由Q02权限、Q03成本与Q04恢复假设共同决定，本轮不执行目标代码。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:245-268](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts#L245-L268)

整包加载时注册危险路由。

<details>
<summary>查看原文（24行）</summary>

```text
    ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-workspace-menu/delete-workspace-directory',
      handler: async (req, res) => {
        if (!isTrustedApiRequest(req, ctx.webRuntime.trustedHosts)) {
          writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
          return
        }
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        try {
          const body = (await readJsonBody(req)) as { path?: unknown } | null
          const raw = typeof body?.path === 'string' ? body.path : ''
          if (!raw || !isAbsolute(raw) || raw.includes('\0') || isForbiddenDeletePath(raw)) {
            writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid or protected directory' } })
            return
          }
          await rm(normalize(raw), { recursive: true, force: true })
          writeJson(res, 200, { ok: true })
        } catch (error) {
          writeJson(res, 400, { ok: false, error: { code: 'delete-failed', message: error instanceof Error ? error.message : String(error) } })
        }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:555-581](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts#L555-L581)

UI开关/双确认不能成为Host授权。

<details>
<summary>查看原文（27行）</summary>

```text
      id: 'delete-disk',
      label: '删除工作区（含磁盘）',
      danger: true,
      disabled: !ws,
      onClick: () => {
        if (!ws) return
        const first = window.confirm(`确定要删除工作区“${title}”吗？\n这会删除该目录下的所有文件。`)
        if (!first) return
        const second = window.confirm(`再次确认：删除工作区“${title}”将永久移除磁盘目录与全部会话记录，且无法恢复。\n确定继续吗？`)
        if (!second) return
        const run = async (): Promise<void> => {
          // 会话记录统一交给 dsh-archive-manager 删除，避免两套逻辑冲突。
          for (const sessionId of ws.sessionIds) {
            await permanentDeleteSession(sessionId).catch(() => undefined)
          }
          await deleteWorkspaceDirectory(ws.path)
          await ctx.workspaces.delete(workspaceId)
          void ctx.workspaces.refresh()
        }
        run().then(() => {
          flashMessage('工作区已删除')
        }).catch((e) => {
          console.warn('[dsh-workspace-menu] delete workspace disk failed', e)
          flashMessage(`删除失败：${e instanceof Error ? e.message : String(e)}`)
        })
      },
    })
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
