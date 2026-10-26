# DSH Market

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e320461](https://github.com/dsh-market/dsh-market/tree/e320461dba3a7e99845f83c7bd106a2f1889dc7f)

<!-- BEGIN META -->
[![GitHub ★ 8,811](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C811&color=yellow&logo=github&style=flat)](https://github.com/dsh-market/dsh-market) [![npm 30d 538,384](https://img.shields.io/static/v1?label=npm+30d&message=538%2C384&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dshmarket)
<!-- END META -->

> **实现功能**：在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。

> **核心亮点**：[Q02](#research-q02)相对单次CLI安装，将新增包加载校验、entry冲突与磁盘manifest对账整合到维护链；它改变安装办结条件，但不是第三方插件安全保证。

> **风险与缺陷**：[Q03](#research-q03)市场与宿主共处故障域，旧版鉴权及进程崩溃恢复需单独验证；单文件rename和catch回滚不能当跨文件事务。

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
  - [Q01 · 多插件用户为什么需要额外市场，原生Discover是否已足够？](#detail-section-11)
  - [Q02 · 安装结果如何校验，失败会不会留下不可启动profile？](#detail-section-12)
  - [Q03 · 市场本身有执行权限时，信任和恢复边界在哪里？](#detail-section-13)
  - [Q04 · 图形维护是否把CLI成本转成更多恢复责任？](#detail-section-14)
  - [Q05 · 能否将加载校验变成可恢复变更计划？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是维护多个社区插件的DSH用户，任务包括发现、装入、更新和恢复profile；合格结果不是下载成功，而是profile仍能启动且目标插件实际接线。原办法为原生Discover加CLI及手动备份；README已承认同一目录可直接加入原生Discover，因此纯搜索并非独占价值。分组、备注、备份与故障恢复把多步维护放到一处，反复维护工作量较大时才更有价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 浏览目录 | 搜索社区组件 | 同目录也可接入原生Discover |
| 安装校验 | 核对entry和冲突 | 不等于业务功能通过 |
| 备份恢复 | 恢复profile文件 | 异常回滚不等于崩溃事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 正确DSH profile | 必需 | 加载市场 | Desktop/web不可混淆 |
| 包管理器与网络 | 安装必需 | 下载和构建 | 需排错 |
| 宿主request gate | 鉴权部署必需 | 共用宿主登录 | 旧版保障不同 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份并加载市场 | 市场出现在正确profile |
| 2 | 在克隆profile装一个插件 | entry校验和目标功能核对 |
| 3 | 练习禁用/恢复 | profile仍可启动 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包与备份空间 | profile辨识和备份 | 时间未知 |
| 持续 | Git/npm下载及构建 | 更新核对 | 第三方插件另计 |
| 失败恢复 | 重试、快照空间 | 对账及外部终端救援 | 崩溃恢复覆盖未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 维护链整合 | 路由和安装校验 | 相对CLI节时 |
| 错误处理 | 冲突移除与备份回滚 | 崩溃后全状态一致 |

> **思考**：[Q03](#research-q03)市场与宿主共处故障域，旧版鉴权及进程崩溃恢复需单独验证；单文件rename和catch回滚不能当跨文件事务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)相对单次CLI安装，将新增包加载校验、entry冲突与磁盘manifest对账整合到维护链；它改变安装办结条件，但不是第三方插件安全保证。

[Q02](#research-q02)相对单次CLI安装，将新增包加载校验、entry冲突与磁盘manifest对账整合到维护链；它改变安装办结条件，但不是第三方插件安全保证。

安装后以磁盘真相对账值得复用，host gate复用避免第二套登录；移植必须同时处理profile所有权、包管理副作用和宿主版本，不能只搬UI。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)市场与宿主共处故障域，旧版鉴权及进程崩溃恢复需单独验证；单文件rename和catch回滚不能当跨文件事务。

<a id="detail-section-6"></a>

### 1.5 使用建议

维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。相比分散CLI操作，市场加入加载校验和状态对账，但维护节时与全故障恢复未实测。若无法备份恢复或宿主鉴权版本不明，就停止修改主profile并退回原生Discover与人工维护。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/routes.ts、src/install.ts、src/backup.ts、src/http.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)
- **版本号**：1.70.2（[固定提交 e320461](https://github.com/dsh-market/dsh-market/tree/e320461dba3a7e99845f83c7bd106a2f1889dc7f)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)以独立profile试装和变更计划前移恢复责任，故障注入比较可启动性和修复耗时，假设未验证。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1187 | — | — | 19260 |
| .js | source | 1 | 16843 | 14695 | 3405 | — |
| .mjs | source | 12 | 1554 | 1004 | 455 | — |
| .ts | source | 70 | 35172 | 20984 | 12791 | — |
| .tsx | source | 12 | 12092 | 9393 | 2460 | — |
| .ts | test | 94 | 42483 | 31953 | 7753 | — |
| .tsx | test | 10 | 11462 | 9215 | 1454 | — |
| .md | test | 1 | 15 | — | — | 120 |
| .js | example | 4 | 244 | 72 | 155 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/dsh-market/dsh-market/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH Market的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多插件用户为什么需要额外市场，原生Discover是否已足够？

**研究主题**：场景与需求、采用判断

#### 完整回答

目标是维护多个社区插件的DSH用户，任务包括发现、装入、更新和恢复profile；合格结果不是下载成功，而是profile仍能启动且目标插件实际接线。原办法为原生Discover加CLI及手动备份；README已承认同一目录可直接加入原生Discover，因此纯搜索并非独占价值。分组、备注、备份与故障恢复把多步维护放到一处，反复维护工作量较大时才更有价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-14](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/README.md#L12-L14)

作者明确原生Discover可消费相同索引

```text
The plugin market inside DeepSeek Harness. On dsh 0.2.1+ it is a tab on the **Plugins** page, right next to **Installed**; on older hosts open Settings → **Plugin Market**. Browse, search, one-click install.

> 📡 **The same catalog is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere — dsh gives a source 15 seconds, and the GitHub Pages copies (`https://awesome-dsh-plugin.com/index.json` and `https://dshmarket.com/index.json`) can exceed that from some networks. The host's Discover tab and the `plugin_market` agent tool then search it.
```

**依据 2 · 作者声明**：[README.md:63-75](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/README.md#L63-L75)

维护流程主张及profile故障边界

<details>
<summary>查看原文（13行）</summary>

```text
- **Favorites** — bookmark plugins and themes from Discover or the Themes tab; a dedicated Favorites tab lists them with search, sort, and install actions. Bookmarks persist in the profile's market state (`state.json`); entries that leave the catalog can be cleared in one click
- **Groups** — organise installed plugins into named groups (rename, delete, and per-group search); a plugin lives in one group and ungrouped is the default. A group carries its own switch: all-on, all-off, or the mixed state its members are really in, so a working set can be switched as a unit without touching the rest. A group holds at most one theme. The grouping itself is local state in the profile's `state.json`
- **Notes** — write your own one-line description for any installed plugin and it replaces the author's on that row, so a shelf of forty plugins answers "why did I install this" in your words. Stored locally beside groups and favorites, never sent anywhere
- **Themes** — a dedicated tab for community themes and skins: install → active immediately, switch with one click (themes are mutually exclusive, your choice survives restarts), uninstall to revert
- **One-click install** — confirm the source, watch live progress; most plugins go live after a page refresh, no restart
- **Backup & restore** — export your profile's plugin list and configuration as readable JSON, import it on another machine, store it on WebDAV with daily auto-backup, or sync through a private GitHub Gist; restores **merge** (plugins installed after the backup are kept), validate before writing, and roll back on failure
- **Updates** — per-plugin update checks (npm version or pinned commit vs HEAD), one-click update, or update everything at once; the market updates itself the same way. A plugin installed from an archive link is updated only through its own source: a catalog entry that merely shares the name is never offered as its update, so updating cannot silently replace it with a different plugin. Each row with an update pending carries a **What changed** link — the release notes, or the commits when the version cannot be aligned to one. A notice you are not acting on can be ignored for the rest of the boot instead of being dismissed again on every reload — scoped to the running host, so a restart brings the reminder back and ignoring it is never the same as turning it off
- **Resilient GitHub routes** — in the China download region, Git refs, README content, and avatars each keep their own fallback order. The market remembers the last working route, switches only after transport/HTTP/payload validation fails, and rejects proxy error pages disguised as HTTP 200. If every built-in route fails, **Settings → Plugins → Plugin configuration → GitHub acceleration** accepts one persistent custom HTTPS prefix; `DSHM_GITHUB_PROXY` remains the operator-owned override
- **Public update API** — plugin-owned settings pages can use the versioned, capability-gated [update API v1](UPDATE-API-V1.md) (beta) instead of copying package-manager logic or depending on private Market UI responses
- **Uninstall** — two-step confirm; plugins installed this session are removed live
- **Hot disable / enable** — toggles write `- id: …` + `disabled: true|false` into the profile's `cordis.patch.yml` (the official patch layer, mechanism ported from [dsh-plugin-hub](https://github.com/Noob-stupid/dsh-plugin-hub)): DSH's HMR re-composes within ~1s, no restart, and the loader re-applies the choice on every boot; hand-edited patch rows show as badges, host-infrastructure plugins are protected from toggling, and a malformed patch file is never made worse
- **Restart when needed** — changes that cannot hot-load show a one-click restart beside the pending-change banner; the action is restricted to same-origin loopback requests
- **Recovery when a restart does not come back** — DSH's boot is all-or-nothing: one plugin that cannot load stops the whole process, and the market's own UI dies with the host it was serving from. Now that failure prompt offers **Adjust plugins**: the ones DSH blamed are marked red and left unticked, you choose what should be enabled at the next start, the choice is written through the same `cordis.patch.yml` rows the market's own toggles use (plus `dsh.profile.bundles` for a disable-carrier), and the boot is retried. It is served by the detached restart helper on the same address the page was already polling, so it works even though the host is gone — and opening the URL fresh renders a standalone version of the same page. When DSH starts normally, none of it appears
```

</details>

#### 缺口

- 没有同条件维护案例证明比原生Discover加CLI更省时。
  **影响**：多插件维护频率和人工基线未知，不能以目录规模代替采用收益。
  **进一步探讨**：让维护者选取同一组插件，用原生Discover加CLI与市场分别执行安装更新恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装结果如何校验，失败会不会留下不可启动profile？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

routes作为浏览器到宿主服务桥接，实际安装交给dsh-cli/install/profile模块。validateAddedPlugins从安装后磁盘枚举新增包，检查DSH manifest、可加载entry及与已有bundle的entry-id冲突，异常包执行移除与manifest对账。备份restore先验证路径和文件类型，用临时文件rename逐文件替换，并保留previous供错误时rollback。相对仅运行add命令，增量是将安装后的磁盘真相和加载冲突纳入办结标准；但逐文件rename不等于跨文件崩溃原子事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:1-8](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/routes.ts#L1-L8)

路由和实际执行责任分开

```text
/**
 * HTTP routes bridging the browser market UI to the host. This layer only
 * parses requests, calls the service modules, and serializes responses —
 * process spawning lives in dsh-cli.ts, filesystem reads in profile.ts,
 * orchestration in install.ts / themes.ts / updates.ts.
 *
 * Security: the install route executes a shell command, so it accepts only
 * same-origin POSTs and only sources present in the curated registry.
```

**依据 2 · 源码核查**：[src/install.ts:792-827](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/install.ts#L792-L827)

新增包与冲突校验

<details>
<summary>查看原文（36行）</summary>

```text
export async function validateAddedPlugins(
  run: PluginRunner, profile: string, before: Set<string>, explicitDir?: string, hostDirectory?: string | null,
): Promise<{ added: string[]; keep: string[]; removedBroken: string[]; conflicts: { name: string; id: string; owner: string }[] }> {
  const dir = profileDir(profile, explicitDir)
  const addedNow = Object.keys(readInstalled(profile, dir)).filter(n => !before.has(n))
  const keep: string[] = []
  const removedBroken: string[] = []
  const conflicts: { name: string; id: string; owner: string }[] = []
  // Compare against what the profile already loads, minus this install's own
  // additions — two pieces of one plugin are not "already installed".
  const existingBundles = readProfileBundles(dir).filter(name => !addedNow.includes(name))
  for (const n of addedNow) {
    const packageDir = join(dir, 'node_modules', n)
    // hasLoadableEntry, not entryArtifactExists: carrier bundles legitimately
    // ship no entry of their own (#103) and must not be uninstalled here.
    // The host install tree is passed too (#906): a carrier mounting only
    // in-box packages resolves nowhere under the profile, and judging it by
    // that alone deleted a package the host had just installed correctly.
    if (!hasDshManifest(packageDir) || !hasLoadableEntry(dir, n, hostDirectory ?? findDshInstallDir())) {
      removedBroken.push(n)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    const clash = conflictingEntryIds(dir, n, existingBundles)
    if (clash.length > 0) {
      // Keeping it would make the NEXT BOOT fail outright (#122).
      conflicts.push(...clash.map(hit => ({ name: n, ...hit })))
      removedBroken.push(n)
      logEvent('error', 'install',
        `${n}: loader entry id conflict with ${clash[0].owner} (${clash.map(hit => hit.id).join(', ')}) — removing, it would break the next boot`)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    keep.push(n)
  }
  return { added: addedNow, keep, removedBroken, conflicts }
```

</details>

**依据 3 · 源码核查**：[src/backup.ts:188-218](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/backup.ts#L188-L218)

逐文件替换与异常回滚

<details>
<summary>查看原文（31行）</summary>

```text
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 市场本身有执行权限时，信任和恢复边界在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

市场可以启动安装命令、改profile和备份，权限影响远大于只读目录。http的refuseUnadmitted调用宿主request gate，gate抛错按403拒绝；旧宿主缺gate则返回未拒绝，因此不能把新版登录保障外推到旧宿主。恢复回滚保留在进程内previous map，进程崩溃时不能靠catch完成全量回滚。安装源可信目录也只是来源约束，不是第三方代码安全审计。建议限定本地可恢复profile，先备份再做一个插件的安装/禁用/退出练习。

#### 证据与依据

**依据 1 · 源码核查**：[src/http.ts:40-87](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/http.ts#L40-L87)

宿主鉴权与旧版回退

<details>
<summary>查看原文（48行）</summary>

```text
/**
 * The host's own request gate, when it publishes one (#603).
 *
 * DSH's Host Connection service exposes `requestRejection(request)`: its
 * Host/Origin fence, then its browser login — 403, 401, or `undefined` for a
 * request it would admit to its own API. The market's routes never passed
 * through it: they are exact registrations on the bare webServer (see the
 * trusted-hosts note below), so with the login on, a client holding no session
 * could still read the market's state and install or remove plugins — which on
 * a deployment behind a proxy or a tunnel is code execution on that machine for
 * anyone who can reach the port. The fix is not a second login: it is asking
 * the one the host already runs.
 *
 * `undefined` source (a host older than this service, 0.1.0-rc.8) leaves every
 * route exactly as it was.
 */
export type HostRequestGate = (request: IncomingMessage) => number | undefined
let requestGateSource: () => HostRequestGate | undefined = () => undefined

/** Point the market at the host's request gate. Returns the previous source. */
export function setRequestGateSource(source: () => HostRequestGate | undefined): () => HostRequestGate | undefined {
  const previous = requestGateSource
  requestGateSource = source
  return previous
}

/**
 * Answer the request with the host's rejection, if it has one.
 * @returns true when the request was refused and answered here.
 */
export function refuseUnadmitted(request: IncomingMessage, response: ServerResponse): boolean {
  const gate = requestGateSource()
  if (gate === undefined) return false
  let status: number | undefined
  try {
    status = gate(request)
  } catch {
    // A gate that throws has not admitted anything. Failing open here would
    // turn a host bug into the exposure this exists to close.
    status = 403
  }
  if (status === undefined) return false
  sendJson(response, status, {
    error: status === 401
      ? '需要先登录 DSH：请重新打开 dsh web 启动时打印的那个网址。 / DSH login required: reopen the URL dsh web printed at startup.'
      : '这个请求来自不受信任的地址，已拒绝。 / This request came from an untrusted origin and was refused.',
  })
  return true
```

</details>

**依据 2 · 源码核查**：[src/backup.ts:188-218](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/backup.ts#L188-L218)

回滚依赖内存与异常控制流

<details>
<summary>查看原文（31行）</summary>

```text
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
  }
```

</details>

#### 缺口

- 跨进程崩溃、登录宿主版本及重启helper的完整故障覆盖未验收。
  **影响**：重启helper、跨文件崩溃和旧宿主鉴权路径未完整验收，不能给全故障恢复保证。
  **进一步探讨**：核对目标宿主gate版本，在克隆profile对rename中断、install后崩溃与helper恢复执行定向故障验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 图形维护是否把CLI成本转成更多恢复责任？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次要装入实际运行profile，Desktop与web profile路径不同；持续要维护市场、pnpm及插件版本，外部Git/npm下载与第三方build可能耗时。失败需检查磁盘manifest、锁和包状态，源码提供了对账及冲突移除，并不能保证所有插件副作用被撤销。收益是统一多插件维护的操作链，现金和人工耗时未知；可在克隆profile中试用，不应直接让唯一生产profile承受首次恢复实验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-38](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/README.md#L20-L38)

Desktop/web的安装差异

<details>
<summary>查看原文（19行）</summary>

````text
## Install

- **Official DSH Desktop:** Open **Settings → Plugins** in the app, search for
  `dshmarket`, and install it through the app's plugin manager. No command line
  is needed.
- **Regular `dsh web`:** Run this command, then restart `dsh web`:

  ```sh
  dsh plugin --profile web add dshmarket
  ```

- **Custom profile:** Replace `web` in that command with your host's actual
  profile name: `dsh plugin --profile <profile> add dshmarket`. Follow your
  host's restart instructions.

On a machine with DSH Desktop, running `dsh plugin --profile web add dshmarket`
may report success but installs the market into `profiles/web`, **not** the
profile used by the Desktop app. It will not appear in Desktop. Install through
the app's **Settings → Plugins** instead; Desktop's profile is managed by the app.
````

</details>

**依据 2 · 源码核查**：[src/install.ts:830-843](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/install.ts#L830-L843)

移除后的磁盘真相对账

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Run one removal this validation triggered and reconcile the manifest by
 * disk truth afterwards.
 *
 * The plugin command reconciles `dsh.profile.bundles` only when pnpm exits
 * 0, and a remove can fail AFTER completing every persistent step — the #65
 * write-order family — or exit 0 with the reconcile still not reflected in
 * the manifest. Either way the bundle row left behind names a package the
 * next boot cannot resolve, and the loader dies on the first such row: the
 * whole profile, not just this plugin, refuses to start, with the market's
 * own page unreachable. Disk truth decides the repair, deliberately: a
 * package that is gone gets its manifest rows dropped so the boot stays
 * loadable, while a package still on disk keeps them, because a retry needs
 * something to retry against.
```

</details>

#### 缺口

- 真实安装失败率、恢复耗时以及备份内凭据的运维负担未知。
  **影响**：恢复时间、备份含密钥管理及失败率未知，影响长期负担。
  **进一步探讨**：检查备份字段与保密边界，按同一故障集记录人工修复耗时、遗留文件和成功启动情况。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否将加载校验变成可恢复变更计划？

**研究主题**：新假设与验证

#### 完整回答

由新增包校验和备份回滚推导未验证假设：在独立profile先形成“变更前快照—试装—加载验证—用户确认”计划，可减少直接修改主profile后人工救援。增量是把恢复责任前移，而不是增加更多目录条目。以冲突entry、缺manifest和中途进程退出为固定故障集，对照直接安装与独立profile计划，核对可启动性、遗留状态和恢复时间；若宿主状态不能可靠迁移或成本大于手工备份，则不推广。

#### 证据与依据

**依据 1 · 源码核查**：[src/install.ts:792-827](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/install.ts#L792-L827)

已有加载校验可作为试装门

<details>
<summary>查看原文（36行）</summary>

```text
export async function validateAddedPlugins(
  run: PluginRunner, profile: string, before: Set<string>, explicitDir?: string, hostDirectory?: string | null,
): Promise<{ added: string[]; keep: string[]; removedBroken: string[]; conflicts: { name: string; id: string; owner: string }[] }> {
  const dir = profileDir(profile, explicitDir)
  const addedNow = Object.keys(readInstalled(profile, dir)).filter(n => !before.has(n))
  const keep: string[] = []
  const removedBroken: string[] = []
  const conflicts: { name: string; id: string; owner: string }[] = []
  // Compare against what the profile already loads, minus this install's own
  // additions — two pieces of one plugin are not "already installed".
  const existingBundles = readProfileBundles(dir).filter(name => !addedNow.includes(name))
  for (const n of addedNow) {
    const packageDir = join(dir, 'node_modules', n)
    // hasLoadableEntry, not entryArtifactExists: carrier bundles legitimately
    // ship no entry of their own (#103) and must not be uninstalled here.
    // The host install tree is passed too (#906): a carrier mounting only
    // in-box packages resolves nowhere under the profile, and judging it by
    // that alone deleted a package the host had just installed correctly.
    if (!hasDshManifest(packageDir) || !hasLoadableEntry(dir, n, hostDirectory ?? findDshInstallDir())) {
      removedBroken.push(n)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    const clash = conflictingEntryIds(dir, n, existingBundles)
    if (clash.length > 0) {
      // Keeping it would make the NEXT BOOT fail outright (#122).
      conflicts.push(...clash.map(hit => ({ name: n, ...hit })))
      removedBroken.push(n)
      logEvent('error', 'install',
        `${n}: loader entry id conflict with ${clash[0].owner} (${clash.map(hit => hit.id).join(', ')}) — removing, it would break the next boot`)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    keep.push(n)
  }
  return { added: addedNow, keep, removedBroken, conflicts }
```

</details>

**依据 2 · 源码核查**：[src/backup.ts:188-218](https://github.com/dsh-market/dsh-market/blob/e320461dba3a7e99845f83c7bd106a2f1889dc7f/src/backup.ts#L188-L218)

现有回滚机制的起点与边界

<details>
<summary>查看原文（31行）</summary>

```text
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
  }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
