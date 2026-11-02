# DSH Workspace Menu

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[03c0110](https://github.com/0imzero/dsh-workspace-menu/tree/03c01109fb90021c0ba89794565c9b3f7ead61b1)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0imzero/dsh-workspace-menu)
<!-- END META -->

> **功能**：为 DSH 首页工作区和会话提供右键与双击菜单，集中重命名、置顶、归档、路径及删除等操作。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把常用行操作与跨平台Host能力集中，并明确会话实际删除/等待状态；业务能力多数继承宿主，未测净节时或误操作下降。

> **主要限制**：[Q02](#research-q02) Host目录删除虽有请求信任和保护路径，仍直接接受绝对path且未绑定registry目标或确认计划。UI会中止未完成会话后的目录删除，但整链仍可能部分成功且不可撤回。

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
  - [Q01 · 菜单为谁减少哪些操作？](#detail-section-11)
  - [Q02 · 行身份、Host路由与删除失败如何接线？](#detail-section-12)
  - [Q03 · 依赖、操作成本与退出是否值得承担？](#detail-section-13)
  - [Q04 · 删除如何成为可恢复且可核对的交付？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁管理DSH工作区与会话的人可以在行上集中执行常用操作，避免来回找按钮。

[Q01](#research-q01) 多数动作有宿主原生入口，插件增量是集中菜单和系统文件管理器接线，不是创建新的工作区隔离或备份系统。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 行菜单 | 集中重命名、置顶、归档等操作 | 依赖私有fiber和宿主服务 |
| 文件管理器打开 | 打开本机目标 | 平台命令启动不保证可视结果 |
| 会话待删 | 占用解除后删除记录 | 可queued、可取消未执行项，永久操作需备份 |
| 工作区目录删除 | 递归移除目录后清registry | 接口未绑定workspace目标，可能部分成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH0.2.x匹配服务 | 必需，manifest>=0.2.1-rc.3 | Host/Client控制器 | 不支持由旧版声明推断加载 |
| React/DOM行结构 | 菜单身份必需 | 恢复workspace/session ID | 私有结构变化会失效或影响定位 |
| 本机文件管理器 | 打开目录时必需 | 平台opener | 命令失败返回错误；spawn成功不等用户已看到 |
| 可写DSH_HOME | 会话待删必需 | 队列和记录清理 | I/O/占用可保持queued |
| 独立备份和隔离数据 | 删除研究必需 | 处理不可逆/部分成功 | 不建议在唯一真实档案上试删 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对宿主/包来源与可丢弃数据 | 当前建议先观察，未安装 |
| 选择 | Client从行身份生成菜单 | 用户核对目标而非只看标题 |
| 删除会话 | 先归档并离开，再排队检查占用 | deleted与queued分开；取消归档可取消未执行项 |
| 删除工作区 | 全部会话实际删除后删目录和registry | 任一步异常停止，但前序可能已完成 |
| 退出恢复 | 停用并核对队列/归档/偏好 | 不把禁用当恢复数据，使用独立备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件文件与独立备份 | 核对版本、来源和fiber目标 | 金额/工时未知 |
| 持续使用 | DOM observer/RAF、本地偏好、重试timer | 核对目标和删除排队 | 大列表性能和净节时未测 |
| 失败恢复 | 外部备份、部分状态重建 | 区分记录/目录/registry阶段 | 永久rm没有内建撤销保证 |
| 退出 | 保留数据及偏好 | 检查待删标记、取消归档与清理偏好 | 重新启用可能恢复待删处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 操作入口 | 行菜单集中原生动作 | 人时与误操作改善 |
| 生命周期 | Host租约和Client清理 | 全部宿主升级兼容 |
| 删除交付 | queued/deleted区分与UI中止 | 目标授权、部分状态一致和恢复完整性 |

> **思考**：[Q02](#research-q02) Host目录删除虽有请求信任和保护路径，仍直接接受绝对path且未绑定registry目标或确认计划。UI会中止未完成会话后的目录删除，但整链仍可能部分成功且不可撤回。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把常用行操作与跨平台Host能力集中，并明确会话实际删除/等待状态；业务能力多数继承宿主，未测净节时或误操作下降。

[Q02](#research-q02)、[Q03](#research-q03) root Context路由租约、引用计数和effect清理值得复用；Client退出清observer/事件/RAF。它们减少重复注册与残留，不能替代永久删除授权与恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Host目录删除虽有请求信任和保护路径，仍直接接受绝对path且未绑定registry目标或确认计划。UI会中止未完成会话后的目录删除，但整链仍可能部分成功且不可撤回。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先观察并优先核查Host目标绑定与恢复。关闭危险菜单不约束Host接口；研究只用可丢弃副本，出目标偏差或部分删除立即停止，回原生入口并用备份恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查当前2.0.3的Host/Client和实际lib关键删除链；确认目标绑定设计限制，未执行删除或漏洞复现。采用先观察，未来恢复设计不计既有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、package.json、src/client/index.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定2.0.3，定向读取Host/Client身份、请求信任、待删、目录rm和产物关键链，未执行文件管理器、删除、测试或宿主验收，不审计整个DSH权限系统。
- 下一步：按[Q04](#research-q04)用可丢弃副本注入目标变化、占用、并发与阶段失败，对照目标错误、部分成功可辨认与备份恢复成本；不能恢复或误删不降则否定。本轮未执行。

**分析版本**

- **仓库**：[0imzero/dsh-workspace-menu](https://github.com/0imzero/dsh-workspace-menu)
- **版本号**：2.0.3（[固定提交 03c0110](https://github.com/0imzero/dsh-workspace-menu/tree/03c01109fb90021c0ba89794565c9b3f7ead61b1)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可研究Host按workspace身份固定的一次性删除计划、逐步回执与可回收目录，用目标变化和阶段失败比较误删与恢复负担；现有双确认/排队已存在，未来增量未验证。

按[Q04](#research-q04)用可丢弃副本注入目标变化、占用、并发与阶段失败，对照目标错误、部分成功可辨认与备份恢复成本；不能恢复或误删不降则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 454 | — | — | 3762 |
| .js | source | 2 | 1556 | 1471 | 86 | — |
| .mjs | source | 3 | 122 | 108 | 6 | — |
| .ts | source | 6 | 1920 | 1674 | 135 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/0imzero/dsh-workspace-menu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/0imzero/dsh-workspace-menu/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/0imzero/dsh-workspace-menu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：集中菜单能否正确绑定目标，Host删除与部分失败如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 菜单为谁减少哪些操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本插件面向频繁在DSH主页管理工作区和会话的使用者，把重命名、置顶、路径复制、打开文件管理器、归档和删除等动作放到行菜单。合格结果是用户意图对应正确的工作区/会话，并且已完成、排队和部分失败可区分；不是菜单项越多越好。基线是使用DSH已有按钮或系统文件管理器，插件的主要增量在操作集中和Host跨平台打开，而多数业务动作仍依赖宿主服务。

当前会话置顶共用宿主状态，工作区置顶/未读是浏览器localStorage偏好，不能当跨设备统一状态。永久会话删除由本插件Host实现且可等待占用解除，不应再归于archive-manager。根是有Host和Client接线的plugin；作者注明DSH0.2.x范围，但不代表所有版本已经验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-7](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/README.md#L5-L7)

作者明确菜单与宿主版本定位。

```text
给 DSH 首页的工作区和会话加上右键菜单。双击也能打开：需要重命名、复制路径或归档会话时，不用再到处找按钮。

> **兼容性：** v2.0.0 及以后适用于 DSH 0.2.x（`>= 0.2.1-rc.3`）。DSH 0.1.x 请使用 [v1.2.0](https://github.com/0imzero/dsh-workspace-menu/releases/tag/v1.2.0)。
```

**依据 2 · 作者声明**：[README.md:29-49](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/README.md#L29-L49)

能力与状态归属，明确自有Host删除和fiber依赖。

<details>
<summary>查看原文（21行）</summary>

```text
**工作区**

- 置顶或取消置顶、重命名
- 在文件管理器中打开、复制路径、新建会话
- 从列表中移除（保留磁盘文件），或删除工作区及其磁盘目录（二次确认）

**会话**

- 置顶或取消置顶、重命名、标记未读或已读
- 归档、取消归档、分叉会话
- 复制会话链接或标题，在新窗口中打开，打开所在目录
- 删除会话及其磁盘记录（二次确认）

## 使用说明

- 会话置顶与 DSH 自带的置顶功能共用状态；工作区置顶和会话未读标记保存在当前浏览器的 localStorage 中。
- 删除会话时会先归档并切到新对话；如果记录仍被 DSH 占用，插件会稍后重试。取消归档可取消尚未执行的删除。
- 文件管理器使用 Windows 资源管理器、macOS Finder，或 Linux 上可用的 `xdg-open`、`gio` 等程序。
- 新窗口使用插件提供的 `?session=<id>` 链接打开对应会话。
- 永久删除由插件的宿主路由处理，无需安装 `@mlgbnb/dsh-archive-manager`。会话记录位于 `$DSH_HOME/sessions/<工作区 slug>/<sessionId>/`。
- 插件通过 DOM 事件和 React fiber 定位工作区和会话行，不修改 DSH 内置源码。
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:151-174](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/client/index.ts#L151-L174)

偏好实际使用localStorage，失败退回当前会话内存行为。

<details>
<summary>查看原文（24行）</summary>

```text
function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      pinnedWorkspaces: Array.isArray(parsed.pinnedWorkspaces) ? parsed.pinnedWorkspaces : [],
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 行身份、Host路由与删除失败如何接线？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Client从treeitem DOM读取React私有fiber并向上检查props，识别workspaceId或具有特定字段的session node。它不改内置源码，但身份依赖私有结构，升级可能使动作入口失效或定位变化。Host路由有Host/Origin与cross-site围栏、POST检查和若干保护目录，这些是已有防护，不能说接口完全无保护。

仍有关键授权边界：delete-workspace-directory收取path，只校验绝对路径、NUL和保护目录，随后递归rm；没有用工作区ID把该path绑定registry记录，也没有接收UI双确认的服务端计划。UI关闭菜单项只限制可见入口，不能约束这一Host能力。该路径在package实际导出的lib/index.js也存在，属于源码确认的权限设计限制，未进行删除或利用复现。

会话删除则先归档停止活动，持久保存待删ID；处理中检查已归档、当前未加载、sessionPersistence状态与会话记录，删除后再detach/unpin/unarchive。取消归档会取消未执行队列。UI工作区删除会在任一会话未实际deleted时抛错中止目录删除，这是重要反证，不能继续声称会话失败还无条件删目录。不过已完成的前序会话删除和后续目录/registry仍非单事务，失败可能部分完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:183-222](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/client/index.ts#L183-L222)

实际fiber行身份恢复。

<details>
<summary>查看原文（40行）</summary>

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

function rowInfo(el: Element): RowInfo | undefined {
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
    return {
      kind: 'workspace',
      id: workspaceId,
      title: String(group.label ?? ''),
    }
  }
  return undefined
```

</details>

**依据 2 · 源码核查**：[src/index.ts:116-129](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L116-L129)

已有请求信任围栏。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:222-235](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L222-L235)

保护目录条件。

<details>
<summary>查看原文（14行）</summary>

```text
function isForbiddenDeletePath(path: string): boolean {
  const canonical = (value: string): string => {
    const result = resolve(value).replace(/[\\/]+$/, '')
    return process.platform === 'win32' ? result.toLowerCase() : result
  }
  const normalized = canonical(path)
  const home = dshHome()
  const forbidden = [process.cwd(), homedir(), home, process.env.SystemRoot ?? ''].filter(Boolean)
  for (const item of forbidden) {
    const n = canonical(item)
    if (normalized === n || n.startsWith(normalized + sep)) return true
  }
  if (normalized === '/' || normalized === '\\' || /^[a-zA-Z]:[\\/]?$/.test(normalized)) return true
  return false
```

</details>

**依据 4 · 源码核查**：[lib/index.js:337-355](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/lib/index.js#L337-L355)

实际导出产物接受path后递归删除，无registry绑定。

<details>
<summary>查看原文（19行）</summary>

```text
            path: '/dsh-workspace-menu/delete-workspace-directory',
            handler: async (req, res) => {
                if (!isTrustedApiRequest(req, ctx.webStartup.trustedHosts)) {
                    writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } });
                    return;
                }
                if (req.method !== 'POST') {
                    writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } });
                    return;
                }
                try {
                    const body = (await readJsonBody(req));
                    const raw = typeof body?.path === 'string' ? body.path : '';
                    if (!raw || !isAbsolute(raw) || raw.includes('\0') || isForbiddenDeletePath(raw)) {
                        writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid or protected directory' } });
                        return;
                    }
                    await rm(normalize(raw), { recursive: true, force: true });
                    writeJson(res, 200, { ok: true });
```

</details>

**依据 5 · 源码核查**：[src/index.ts:275-315](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L275-L315)

待删流程的状态检查及持久队列。

<details>
<summary>查看原文（41行）</summary>

```text
async function processPending(ctx: AppContext, id: string): Promise<boolean> {
  if (pendingInFlight.has(id)) return false
  pendingInFlight.add(id)
  try {
    // Unarchiving explicitly cancels a queued deletion.
    if (!ctx.workspaceRegistry.archivedSessionIds.includes(id)) {
      await rm(pendingPath(id), { force: true })
      return false
    }
    if (ctx.sessions.get(id)) return false
    const snapshot = await ctx.sessionPersistence.stat(id)
    if (snapshot !== undefined) {
      const handle = await ctx.sessionPersistence.open(id, 'write')
      const record = findSessionRecord(id)
      await handle.close()
      if (!record) throw new Error('session record not found under DSH_HOME')
      if (ctx.sessions.get(id)) return false
      await rm(record, { recursive: true, force: true })
    } else if (findSessionRecord(id)) {
      throw new Error('session storage could not be verified')
    }
    for (const workspace of ctx.workspaceRegistry.list()) {
      if (workspace.sessionIds.includes(id)) await workspace.detachSession(id)
    }
    await ctx.workspaceRegistry.unpinSession(id)
    await ctx.workspaceRegistry.unarchiveSession(id)
    await rm(pendingPath(id), { force: true })
    return true
  } catch (error) {
    console.warn('[dsh-workspace-menu] pending deletion will be retried', id, error)
    return false
  } finally {
    pendingInFlight.delete(id)
  }
}

async function queueSessionDeletion(ctx: AppContext, id: string): Promise<boolean> {
  await mkdir(pendingDir(), { recursive: true })
  await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true })
  await writeFile(pendingPath(id), JSON.stringify({ version: 1, id }), { flag: 'w' })
  return processPending(ctx, id)
```

</details>

**依据 6 · 源码核查**：[lib/client.js:617-635](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/lib/client.js#L617-L635)

会话未删除会阻止目录步骤，但前序步骤可能已完成。

<details>
<summary>查看原文（19行）</summary>

```text
			if (isFeatureEnabled(state, "workspaceDeleteDisk")) items.push({
				id: "delete-disk",
				label: t("menu.deleteWorkspace"),
				danger: true,
				disabled: !ws,
				onClick: () => {
					if (!ws) return;
					if (!window.confirm(t("dialog.deleteWorkspace", { title }))) return;
					if (!window.confirm(t("dialog.deleteWorkspaceTwice", { title }))) return;
					const run = async () => {
						for (const sessionId of ws.sessionIds) if (!await deleteSessionRecord(sessionId)) throw new Error(t("toast.deletionPending"));
						await deleteWorkspaceDirectory(ws.path);
						await ctx.workspaces.delete(workspaceId);
					};
					run().then(() => {
						flashMessage(t("toast.workspaceDeleted"));
					}).catch((e) => {
						console.warn("[dsh-workspace-menu] delete workspace disk failed", e);
						flashMessage(t("toast.deleteFailed", { reason: e instanceof Error ? e.message : String(e) }));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、操作成本与退出是否值得承担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

当前建议observe，先核查Host目标授权与不可逆删除恢复，而不是仅关闭危险菜单就认定可安全安装。用户收益主要是局部操作便利；可用DSH原生按钮完成多数任务，尚不足以覆盖任意绝对path删除路由的目标绑定缺口。需要DSH0.2.x服务、匹配React行结构和本机文件管理器；包manifest导出lib/Host与Client，源码声明的宽peer不等全部组合可用。

工程上按根Context共享路由引用计数，并在effect退出清timer/路由，Client也清observer、事件和RAF，减少热重载重复与残留。这些优点不能恢复已永久删除的数据。退出时禁用插件会停止重试timer，仍需检查DSH_HOME中的待删除标记、归档状态和浏览器偏好；直接重装可能重新处理持久待删项，须先确认是否取消归档。未核全部崩溃恢复和目录真实路径边界，也没有误操作率/节时实测。只在可丢弃隔离数据上研究该机制；出现目标不一致或部分删除便停止，并由独立备份人工恢复，不把接口成功当整个工作区已一致清理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-25](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/package.json#L13-L25)

实际导出与peer依赖。

<details>
<summary>查看原文（13行）</summary>

```text
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
    "cordis": ">=4.0.0-rc <5",
    "react": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[package.json:53-68](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/package.json#L53-L68)

DSH/Client声明范围。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:328-334](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L328-L334)

路由租约以root context为键。

```text
function acquireRoutes(ctx: AppContext): () => void {
  const key = (ctx as { root?: object }).root ?? ctx
  const existing = routeLeases.get(key)
  if (existing !== undefined) {
    existing.references += 1
    return () => releaseRoutes(key, existing)
  }
```

**依据 4 · 源码核查**：[src/index.ts:416-440](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L416-L440)

路由引用计数释放与timer/effect清理。

<details>
<summary>查看原文（25行）</summary>

```text
  const lease: RouteLease = {
    references: 1,
    dispose: () => {
      for (const dispose of disposers) dispose()
    },
  }
  routeLeases.set(key, lease)
  return () => releaseRoutes(key, lease)
}

function releaseRoutes(key: object, lease: RouteLease): void {
  lease.references -= 1
  if (lease.references !== 0 || routeLeases.get(key) !== lease) return
  routeLeases.delete(key)
  lease.dispose()
}

export function apply(ctx: AppContext): void {
  ctx.effect(() => {
    const dispose = acquireRoutes(ctx)
    void retryPending(ctx)
    const timer = setInterval(() => { void retryPending(ctx) }, 30_000)
    timer.unref?.()
    return () => { clearInterval(timer); dispose() }
  }, '@dsh-external/dsh-workspace-menu: host routes')
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:1096-1111](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/client/index.ts#L1096-L1111)

Client事件/observer/RAF清理。

<details>
<summary>查看原文（16行）</summary>

```text
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
      cleanup?.()
    }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:279-301](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L279-L301)

取消归档与待删标记/registry清理的关系。

<details>
<summary>查看原文（23行）</summary>

```text
    // Unarchiving explicitly cancels a queued deletion.
    if (!ctx.workspaceRegistry.archivedSessionIds.includes(id)) {
      await rm(pendingPath(id), { force: true })
      return false
    }
    if (ctx.sessions.get(id)) return false
    const snapshot = await ctx.sessionPersistence.stat(id)
    if (snapshot !== undefined) {
      const handle = await ctx.sessionPersistence.open(id, 'write')
      const record = findSessionRecord(id)
      await handle.close()
      if (!record) throw new Error('session record not found under DSH_HOME')
      if (ctx.sessions.get(id)) return false
      await rm(record, { recursive: true, force: true })
    } else if (findSessionRecord(id)) {
      throw new Error('session storage could not be verified')
    }
    for (const workspace of ctx.workspaceRegistry.list()) {
      if (workspace.sessionIds.includes(id)) await workspace.detachSession(id)
    }
    await ctx.workspaceRegistry.unpinSession(id)
    await ctx.workspaceRegistry.unarchiveSession(id)
    await rm(pendingPath(id), { force: true })
```

</details>

#### 缺口

- 未验证跨崩溃部分删除、真实路径/链接与待删重启后的完整恢复。
  **影响**：不可把永久删除看成可撤销或严格授权的交付。
  **进一步探讨**：在独立副本核对目标身份、链接路径、阶段中断和取消排队，记录外部备份恢复。
- 菜单对真实误操作率、管理耗时和大列表性能影响未知。
  **影响**：不能认定局部便利足以覆盖状态风险。
  **进一步探讨**：对同任务比较原生菜单与插件，计目标错误、部分失败和恢复投入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 删除如何成为可恢复且可核对的交付？

**研究主题**：新假设与验证

#### 完整回答

现有实现已经有双确认、Host信任围栏、保护目录、持久待删队列和取消归档；不能把这些当未来新增。可推导一个更窄的假设：Host先用workspaceId解析并固定物理目标、会话集合与操作代次，给UI展示一次性计划；执行时复核集合和路径，按步留回执，并把目录移到可回收位置而非直接永久rm。这样才把UI确认与Host实际目标联系起来，而不只是增加确认次数。

在可丢弃副本中对照当前链和计划链，注入工作区路径变化、会话占用、多个并发请求以及目录删除后registry更新失败。测错误目标、重复执行、部分成功可辨认率、恢复完整性、回收存储与确认时间。若计划仍能跨目标重放、真实路径改变未被拒绝，或维护/存储负担高于减少的恢复投入，则否定。它需要宿主registry和文件系统协作，本轮没有实现，也不宣称跨平台原子事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:375-383](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L375-L383)

当前目录删除未绑定workspace身份，是计划设计的针对点。

```text
        try {
          const body = (await readJsonBody(req)) as { path?: unknown } | null
          const raw = typeof body?.path === 'string' ? body.path : ''
          if (!raw || !isAbsolute(raw) || raw.includes('\0') || isForbiddenDeletePath(raw)) {
            writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'invalid or protected directory' } })
            return
          }
          await rm(normalize(raw), { recursive: true, force: true })
          writeJson(res, 200, { ok: true })
```

**依据 2 · 源码核查**：[src/client/index.ts:555-572](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/client/index.ts#L555-L572)

现有双确认和分步失败作为对照基线。

<details>
<summary>查看原文（18行）</summary>

```text
      onClick: () => {
        if (!ws) return
        const first = window.confirm(t('dialog.deleteWorkspace', { title }))
        if (!first) return
        const second = window.confirm(t('dialog.deleteWorkspaceTwice', { title }))
        if (!second) return
        const run = async (): Promise<void> => {
          for (const sessionId of ws.sessionIds) {
            if (!await deleteSessionRecord(sessionId)) throw new Error(t('toast.deletionPending'))
          }
          await deleteWorkspaceDirectory(ws.path)
          await ctx.workspaces.delete(workspaceId)
        }
        run().then(() => {
          flashMessage(t('toast.workspaceDeleted'))
        }).catch((e) => {
          console.warn('[dsh-workspace-menu] delete workspace disk failed', e)
          flashMessage(t('toast.deleteFailed', { reason: e instanceof Error ? e.message : String(e) }))
```

</details>

**依据 3 · 源码核查**：[src/index.ts:275-315](https://github.com/0imzero/dsh-workspace-menu/blob/03c01109fb90021c0ba89794565c9b3f7ead61b1/src/index.ts#L275-L315)

已有待删与取消机制是反证，未来设计不是重新命名它。

<details>
<summary>查看原文（41行）</summary>

```text
async function processPending(ctx: AppContext, id: string): Promise<boolean> {
  if (pendingInFlight.has(id)) return false
  pendingInFlight.add(id)
  try {
    // Unarchiving explicitly cancels a queued deletion.
    if (!ctx.workspaceRegistry.archivedSessionIds.includes(id)) {
      await rm(pendingPath(id), { force: true })
      return false
    }
    if (ctx.sessions.get(id)) return false
    const snapshot = await ctx.sessionPersistence.stat(id)
    if (snapshot !== undefined) {
      const handle = await ctx.sessionPersistence.open(id, 'write')
      const record = findSessionRecord(id)
      await handle.close()
      if (!record) throw new Error('session record not found under DSH_HOME')
      if (ctx.sessions.get(id)) return false
      await rm(record, { recursive: true, force: true })
    } else if (findSessionRecord(id)) {
      throw new Error('session storage could not be verified')
    }
    for (const workspace of ctx.workspaceRegistry.list()) {
      if (workspace.sessionIds.includes(id)) await workspace.detachSession(id)
    }
    await ctx.workspaceRegistry.unpinSession(id)
    await ctx.workspaceRegistry.unarchiveSession(id)
    await rm(pendingPath(id), { force: true })
    return true
  } catch (error) {
    console.warn('[dsh-workspace-menu] pending deletion will be retried', id, error)
    return false
  } finally {
    pendingInFlight.delete(id)
  }
}

async function queueSessionDeletion(ctx: AppContext, id: string): Promise<boolean> {
  await mkdir(pendingDir(), { recursive: true })
  await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true })
  await writeFile(pendingPath(id), JSON.stringify({ version: 1, id }), { flag: 'w' })
  return processPending(ctx, id)
```

</details>

#### 缺口

- 一次性计划与回收设计的兼容性、成本和恢复效果未实证。
  **影响**：不能据设计承诺不误删或跨平台原子性。
  **进一步探讨**：先做固定副本与故障注入对照，记录目标绑定和恢复失败。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
