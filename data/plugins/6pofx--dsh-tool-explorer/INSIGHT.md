# dsh-tool-explorer

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[63ea4c8](https://github.com/6pofx/dsh-tool-explorer/tree/63ea4c8192f715c3157af69e71fef67915db8af1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer) [![npm 30d 655](https://img.shields.io/static/v1?label=npm+30d&message=655&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer)
<!-- END META -->

> **实现功能**：在DSH Web集中浏览、编辑、安装与切换技能，管理和探测MCP服务器。

> **核心亮点**：将技能文件、共享lock/回收对象及MCP patch组织成可视管理交付，批选同仓一次下载省重复资源；承认作者所列社区参照。详见[Q01](#research-q01)。

> **风险与缺陷**：技能改名只写MD后删旧目录，表单userInvocable键不等平台键，升级不保ref；Origin不等认证，多文件恢复不能靠HTTP成功判断。详见[Q04](#research-q04)。

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
  - [Q01 · 控制台为谁管理什么，真正交付增量是什么？](#detail-section-11)
  - [Q02 · 路由管理面与MCP测试的权限/秘密边界在哪里？](#detail-section-12)
  - [Q03 · MCP配置修改和状态展示有哪些真实保证？](#detail-section-13)
  - [Q04 · 技能编辑、改名和双调用开关能保留原技能吗？](#detail-section-14)
  - [Q05 · GitHub安装/升级是否固定来源与预览一致？](#detail-section-15)
  - [Q06 · 回收站与持久化能恢复到删除前吗？](#detail-section-16)
  - [Q07 · 跨版本适配、自补丁与三阶段成本有哪些限制？](#detail-section-17)
  - [Q08 · 采用判断和可证伪改进方向是什么？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本机DSH管理员集中维护技能与MCP，需受信管理面和备份。详见[Q01](#research-q01)。

手改SKILL.md/lock/patch及各Agent配置，分开SDK测试；本项集中管理及恢复对象。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 技能目录/双开关 | 浏览及按调用方式控制 | 非自带Skill，user根限定 |
| 安装/升级/回收 | 用户技能持久管理 | 改名附件/ref/事务缺口 |
| MCP配置与探测 | 分层patch/导入/SDK连接 | 真进程/网络，active非业务健康 |
| 显式补丁脚本 | 调整宿主MCP等待/stderr | 需另调用，升级后重做 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH Web/Node20+ | 路由及UI | 宿主管理鉴权/slot接口 |
| user技能根/共享lock | 编辑安装/恢复 | 双根同名/元数据一致 |
| MCP SDK/命令或URL | 独立探测 | 真执行进程/网络，非沙箱 |
| 备份/磁盘/可信下载源 | 配置与技能变更 | ref固定/资源限额由维护者核 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份/限定管理面 | 管理员 | 原始技能附件与元数据可恢复 |
| 安装重启核设置页 | 管理员 | 版本/服务齐全 |
| 核目标根/层及命令来源 | 管理员 | 不凭显示active当验收 |
| 变更后对齐目录/lock/加载 | 管理员 | 保附件/ref/当前版本 |
| 失败保留中间材料 | 管理员 | 不仅依HTTP200/回收计数 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node20+/DSH Web、依赖、技能及MCP程序 | 备份两个patch/技能根/lock，审核命令、URL与导入秘密 | 金额/安装工时未知，MCP服务独立收费/权限 |
| 持续使用 | tarball下载/临时解压、技能树hash、探测子进程与网络 | 核来源/升级差异、配置HMR与实际工具可用，管理双根同名 | 批选同仓一次下载省重复流量；无包体/解压配额，规模上限未知 |
| 失败恢复 | 备份/回收站/Git来源、重下依赖 | 对齐技能文件与lock/manifest，保留失联垃圾，恢复被重命名丢附件 | 原子rename不等目录+lock事务，恢复人时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中管理 | 文件/patch/UI流程 | 修改与加载版本一致性 |
| 可恢复对象 | 根外trash及lock快照 | 多资源故障完整恢复 |
| 批选安装 | 一仓一次下载解压 | 来源固定/内容安全/容量上限 |

> **思考**：技能改名只写MD后删旧目录，表单userInvocable键不等平台键，升级不保ref；Origin不等认证，多文件恢复不能靠HTTP成功判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将技能文件、共享lock/回收对象及MCP patch组织成可视管理交付，批选同仓一次下载省重复资源；承认作者所列社区参照。详见[Q01](#research-q01)。

将技能文件、共享lock/回收对象及MCP patch组织成可视管理交付，批选同仓一次下载省重复资源；承认作者所列社区参照。详见[Q01](#research-q01)。

结构接口/lazy agent lookup、双轴开关、根外trash和局部patch文本手术可借鉴；原子单文件不等目录事务。详见[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

技能改名只写MD后删旧目录，表单userInvocable键不等平台键，升级不保ref；Origin不等认证，多文件恢复不能靠HTTP成功判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先备份技能/lock/patch，受信本机可继续核展示与独立开关，避免唯一bundle直接改名升级。详见[Q08](#research-q08)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

集中管理/回收对象有源码贡献；改名附件丢失、ref漂移与多资源恢复限制采用；事务化管理为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/http.ts、src/routes.ts、src/mcp.ts、src/skills.ts、src/skills-install.ts、src/skills-trash.ts、src/patch-text.ts、src/settings.ts、src/client/index.ts、src/client/McpSection.tsx、scripts/mcp-client-patches.mjs、scripts/patch-mcp-client.mjs、scripts/selftest.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定src管理链、client入口/部分MCP表单、README与补丁脚本及代表selftest；无构建lib字节，不运行目标/MCP/下载。
- 下一步：按完整bundle改名、ref漂移、同根别名/同名、两进程及目录/lock/manifest失败检验版本绑定事务。

**分析版本**

- **仓库**：[6pofx/dsh-tool-explorer](https://github.com/6pofx/dsh-tool-explorer)
- **版本号**：0.4.4（[固定提交 63ea4c8](https://github.com/6pofx/dsh-tool-explorer/tree/63ea4c8192f715c3157af69e71fef67915db8af1)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

服务端commit/完整目录摘要与必填版本绑定管理事务，整bundle改名、文件与lock/manifest可辨认提交，按漂移和失败反例检验，未验证。详见[Q08](#research-q08)。

按完整bundle改名、ref漂移、同根别名/同名、两进程及目录/lock/manifest失败检验版本绑定事务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1034 | — | — | 12909 |
| .mjs | source | 8 | 1248 | 892 | 256 | — |
| .ts | source | 13 | 3823 | 3058 | 520 | — |
| .tsx | source | 3 | 1472 | 1332 | 47 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer/issues?q=is%3Aissue+created%3A2026-09-22T10%3A34%3A36.923Z..2026-10-22T10%3A34%3A36.923Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A34%3A36.923Z..2026-10-22T10%3A34%3A36.923Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核控制台对技能/MCP持久管理的实际增量与来源、权限和恢复合同。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 控制台为谁管理什么，真正交付增量是什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

适用于维护DSH Web技能和MCP配置的本机管理员。合格结果是目标技能文件/调用开关或所选patch层更新，目录和实际加载工具一致；不是页面显示active就证明MCP业务可用。替代是手改SKILL.md、共享lock与Cordis patch、逐台手测MCP；本项集中目录、编辑、双调用开关、GitHub批选、可恢复删除、跨Agent配置导入和独立SDK探测，交付的是可持久的配置/技能及恢复清单，减少分散操作。

作者明确参考skill-hub回收站等社区项目，未独立核其版本或等效性，不能据作者表称本项原创首创。可识别增量是将回收站移到所有技能根外、快照lock，双轴开关及来源目录组合，而非新协议或推理算法。host只注入webServer/loader/tools/skills并mount路由，client设置页；没有自带研究Skill、Agent/preset或模型工具，所管理项不能冒作插件自身能力。运行构建lib/client不在本checkout，本轮核固定TS和脚本，未声称核npm字节。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-43](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/README.md#L9-L43)

作者功能。

<details>
<summary>查看原文（35行）</summary>

```text
Management console for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh): a Web settings page where you can **browse, install, update, edit and toggle skills**, and **add, edit, enable/disable, test and monitor MCP servers**.

## Compatibility

**One build serves every supported DSH line.** The settings surface has moved three times around this plugin — module-level helpers (0.1.0-rc.7 … 0.1.4), the provider method that replaced them (0.1.5), and entry-Config forms (0.2.x) — so `src/settings.ts` imports **no** runtime symbol from `@deepseek-ai/dsh-settings` at all: it pins to the parts that did not move and feature-detects the rest. On 0.2.x the plugin's exported `Config` schema is what puts its preferences into the platform settings page.

| DSH | Status |
|---|---|
| `0.2.1-rc.2` (current) | Supported — boot, host routes, live Config form and client bundle verified at runtime |
| `0.1.5-rc.2` | Supported — same feature set via the 0.1.x settings namespace |
| `0.1.1-rc.2` | Supported — boot, host routes, settings and client bundle re-verified at runtime |
| Rest of `0.1.0-rc.7` … `0.1.4` | Expected to work: this line exposes the same `ctx.settings.register(ns, schema, { base })` surface |
| Host without `ctx.settings` | Loads and works; preferences fall back to the composition entry config |

Host-half changes need a `dsh web` restart; client-half changes hot-reload. After a **dsh upgrade**, re-run the [local mcp-client patches](#local-dsh-mcp-client-patches) — an upgrade restores the official `dsh-mcp-client` bytes.

## Features

**Skills**
- Full catalog across every provider (project/user/bundled/plugin) merged with the shared `.skill-lock.json`
- **Hierarchical browse by source**: collapsible source tree (project-dsh → project-agents → custom → user-dsh → user-agents → runtime → bundled), each source subdivided by provider, with loaded/disabled counts; source + state filters and flat view
- Search, detail preview, online create/edit (kebab-case validation, frontmatter form, Markdown body)
- **Independent model / user invocation switches** — turn off the model call for a skill alone (`disable-model-invocation`) while keeping the `/` menu, or vice versa; both off = fully disabled
- **Recoverable trash**: deleting a user-root skill moves it to `<dshHome>/skills-trash` (lock entry snapshotted); restore puts it back byte-identically, or purge / empty for permanent removal
- Install from GitHub: URL parsing (`owner/repo`, tree paths, `#branch`), candidate preview with **multi-select / select-all batch install** (one repo = one tarball download, conflicts reported per skill), install into `~/.agents/skills` or `~/.dsh/skills`, update check/apply (backup + rollback), uninstall
- `skillFolderHash` is byte-compatible with the Skills CLI (`npx skills`)

**MCP**
- Server list with live state (fiber phase), tool inventory and per-server tool counts
- Add/edit/delete servers (stdio + streamable-http) and **enable/disable** toggles — all through the profile patch layer (HMR hot-applies, no restart)
- Cross-agent import: scan `~/.claude.json`, `~/.cursor/mcp.json`, `~/.codex/config.toml` (TOML), `~/.cline/mcp_settings.json`, `~/.roo/mcp.json`, `~/.continue/mcp.json`, `~/.codeium/windsurf/mcp_config.json` and import in one click
- Test connection with an independent SDK probe (never disturbs running instances)
- Write fencing (expected-hash) against concurrent hand edits

## Install
```

</details>

**依据 2 · 作者声明**：[README.md:86-103](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/README.md#L86-L103)

作者参照归属。

<details>
<summary>查看原文（18行）</summary>

```text
- [BAIKAI23333/dsh-skills-manager](https://github.com/BAIKAI23333/dsh-skills-manager) — settings-page skills manager
- [peiqi10086/dsh-skills-market](https://github.com/peiqi10086/dsh-skills-market) — sidebar skills panel (user/project/bundled) + SkillHub marketplace

Design notes: we keep the platform-documented frontmatter dual switches (`disable-model-invocation` / `user-invocable`) instead of skill-hub's `SKILL.md.disabled` rename, and keep the trash **outside** every skill root so provider watchers never observe it.

## Layout

| Path | Purpose |
|---|---|
| `src/index.ts` | Host entry; plain host object built from injected services (never mutate the Cordis scope proxy) |
| `src/routes.ts` | HTTP routes under `/dsh-tool-explorer/api/*` (same-origin enforced on writes) |
| `src/mcp.ts` | MCP manager: patch-layer CRUD, enable/disable, state derivation, SDK probe |
| `src/skills.ts` | Skills catalog (registry × lock file × disk), edit/toggle, per-axis model/user invocation, frontmatter parsing (full YAML) |
| `src/skills-trash.ts` | Recoverable trash: delete-to-trash, restore, purge, empty (`<dshHome>/skills-trash` + manifest) |
| `src/skills-install.ts` | GitHub install ecosystem: tarball fetch (regional proxy), candidate discovery, lock v3, CLI-compatible folder hash |
| `src/agents-mcp.ts` | Cross-agent MCP import (JSON + Codex TOML subset parser) |
| `src/patch-text.ts` | Patch-layer dialect: parse (`!!js` tolerant), surgical row edits, `[]` placeholder handling, atomic writes |
| `scripts/` | Client bundle wrapper/check, self-test, and **local dsh-mcp-client patches** (see below; the patch tooling also ships in the npm package) |
```

</details>

**依据 3 · 源码核查**：[src/index.ts:24-55](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/index.ts#L24-L55)

host作用。

<details>
<summary>查看原文（32行）</summary>

```text
export function apply(ctx: Context, config?: unknown): void {
  // `config` arrives resolved through `Config` on every supported host line
  // (volatile fields as reference objects); the settings getter re-reads the
  // fiber on each call so live form edits land without a remount.
  const getSettings = installToolExplorerSettings(ctx, config)

  ctx.inject(['webServer', 'loader', 'tools', 'skills'], (hostCtx: Context) => {
    // The scoped ctx is an active fiber PROXY: setting undeclared properties
    // on it throws. Read the injected services out into a plain host object
    // instead — the shape the feature modules consume.
    const scoped = hostCtx as unknown as ToolExplorerHost
    const host: ToolExplorerHost = {
      webServer: scoped.webServer,
      loader: scoped.loader,
      tools: scoped.tools,
      skills: scoped.skills,
      // Optional agent inventory, resolved LAZILY per request (never during
      // apply): a synchronous ctx.get('agents') at boot can wait for a
      // service that is still mounting and hang the whole dsh startup
      // (observed: no console output for 40+ minutes until rollback).
      agentsLookup: () => {
        try {
          return ctx.get('agents') as ReturnType<NonNullable<ToolExplorerHost['agentsLookup']>> | undefined
        } catch {
          return undefined
        }
      },
      profileName: argvProfile(),
    }
    ctx.effect(() => mountRoutes(host, getSettings), 'dsh-tool-explorer: http routes')
  })
}
```

</details>

**依据 4 · 源码核查**：[src/skills-trash.ts:1-13](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts#L1-L13)

回收站增量。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Recoverable skill trash (M5): deleting a user-root skill moves its
 * directory (or flat file) into `<dshHome>/skills-trash` and records a
 * manifest entry; restore puts it back — including its lockfile entry —
 * while purge / empty removes it permanently.
 *
 * Mirrors the recoverable-trash pattern of dsh-skill-hub (`.trash/` rename
 * + restore + clear), but keeps the trash OUTSIDE every skill root so the
 * filesystem provider's watchers never observe it, and snapshots the lock
 * entry so restore is byte-compatible with the Skills CLI lock state.
 *
 * All writes are atomic (temp + rename) like every other write in this
 * plugin; moves fall back to copy+delete when rename crosses volumes.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路由管理面与MCP测试的权限/秘密边界在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

HTTP helper要求写请求Origin的host与Host相同，缺字段拒绝，POST/PUT/DELETE均走相同检查；body上限64KiB、no-store是有益基础。比较只host不比scheme，没有token/用户/peer/管理员角色校验，非浏览器客户端可自行构造两header；这是跨站请求防线，不能充当操作认证。GET导入源和MCP详情无需本地同源校验，响应含原始env/headers、command/cwd与来源路径，秘密会进入浏览器。实际可读范围必须由宿主webServer认证/监听配置限定，不推断公网暴露或已利用。

MCP test会真的以stdio command/args/env/cwd启动进程，或带headers连接任意http(s)服务，initialize/tools/list也可产生服务初始化副作用；不是静态只读检查或沙箱。validate只要求stdio非空command/http(s)URL及基础类型，无私网/metadata限制、可执行白名单或独立确认凭证；信任的是管理员配置。UI警示不能授权不可信请求。配置写入后HMR的真实执行权限同宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/http.ts:18-40](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/http.ts#L18-L40)

Host匹配及body限制。

<details>
<summary>查看原文（23行）</summary>

```text
/** True when the request's Origin matches its Host — checked on every POST route. */
export function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin
  const host = request.headers.host
  if (origin === undefined || host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** Read and parse a JSON request body, rejecting anything over `maxBytes`. */
export async function readJsonBody(request: IncomingMessage, maxBytes = 65536): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBytes) throw new Error('request body too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:180-203](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/routes.ts#L180-L203)

测试/导入源路由。

<details>
<summary>查看原文（24行）</summary>

```text
    path: '/dsh-tool-explorer/api/mcp/test',
    handler: async (request, response) => {
      if (!requireMethod(request, response, ['POST'])) return
      if (!requireSameOrigin(request, response)) return
      await handleTestServer(request, response)
    },
  }))

  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-tool-explorer/api/mcp/import-sources',
    handler: (request, response) => {
      if (!requireMethod(request, response, ['GET'])) return
      handleImportSources(host, request, response)
    },
  }))

  disposers.push(host.webServer.register({
    kind: 'exact',
    path: '/dsh-tool-explorer/api/mcp/import',
    handler: async (request, response) => {
      if (!requireMethod(request, response, ['POST'])) return
      if (!requireSameOrigin(request, response)) return
      await handleImport(host, request, response)
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:500-527](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/routes.ts#L500-L527)

原始env/header导出。

<details>
<summary>查看原文（28行）</summary>

```text
    exists: source.exists,
    servers: source.servers.map(server => {
      const serverName = normalizeServerName(server.name)
      return {
        name: server.name,
        transport: server.type === 'streamable-http' || server.url !== undefined ? 'streamable-http' : 'stdio',
        command: server.command,
        url: server.url,
        args: server.args,
        env: server.env,
        cwd: server.cwd,
        headers: server.headers,
        // The name dsh would register this server under, when it differs.
        renameTo: serverName !== null && serverName !== server.name ? serverName : undefined,
        conflict: serverName !== null && taken.has(serverName),
      }
    }),
  }))
  sendJson(response, 200, { ok: true, sources })
}

async function handleImport(host: ToolExplorerHost, request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>
    const selections = Array.isArray(body.selections) ? body.selections : []
    const layer: PatchLayer = body.layer === 'home' ? 'home' : 'profile'
    const imported: Array<{ name: string; id: string }> = []
    const skipped: Array<{ name: string; reason: string }> = []
```

</details>

**依据 4 · 源码核查**：[src/mcp.ts:211-251](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L211-L251)

参数验证。

<details>
<summary>查看原文（41行）</summary>

```text
export function validateSpec(spec: unknown): { ok: true; spec: McpServerSpec } | { ok: false; errors: string[] } {
  if (typeof spec !== 'object' || spec === null || Array.isArray(spec)) {
    return { ok: false, errors: ['spec must be an object'] }
  }
  const record = spec as Record<string, unknown>
  const errors: string[] = []
  const serverName = typeof record.serverName === 'string' ? record.serverName.trim() : ''
  if (!SERVER_NAME_PATTERN.test(serverName)) {
    errors.push('serverName must be 1-32 characters of [A-Za-z0-9_-]')
  }
  const transport = record.transport
  if (transport !== 'stdio' && transport !== 'streamable-http') {
    errors.push('transport must be "stdio" or "streamable-http"')
  }
  const command = typeof record.command === 'string' ? record.command : ''
  if (transport === 'stdio' && command.trim() === '') {
    errors.push('command is required for stdio servers')
  }
  const url = typeof record.url === 'string' ? record.url : ''
  if (transport === 'streamable-http') {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error()
    } catch {
      errors.push('a valid http(s) url is required for streamable-http servers')
    }
  }
  if (record.args !== undefined && (!Array.isArray(record.args) || !record.args.every(arg => typeof arg === 'string'))) {
    errors.push('args must be an array of strings')
  }
  if (record.env !== undefined && !isStringRecord(record.env)) {
    errors.push('env must be an object of string values')
  }
  if (record.headers !== undefined && !isStringRecord(record.headers)) {
    errors.push('headers must be an object of string values')
  }
  if (errors.length > 0) return { ok: false, errors }
  const normalized = asSpec({ serverName, transport: transport as 'stdio' | 'streamable-http', ...record })
  if (normalized === null) return { ok: false, errors: ['spec could not be normalized'] }
  return { ok: true, spec: normalized }
}
```

</details>

**依据 5 · 源码核查**：[src/mcp.ts:501-553](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L501-L553)

实际进程/HTTP SDK探测。

<details>
<summary>查看原文（53行）</summary>

```text
function transportFor(spec: McpServerSpec): StdioClientTransport | StreamableHTTPClientTransport {
  if (spec.transport === 'stdio') {
    const env = { ...getDefaultEnvironment(), ...(spec.env ?? {}) }
    return new StdioClientTransport({
      command: spec.command!,
      args: spec.args ?? [],
      env,
      cwd: spec.cwd,
      stderr: 'pipe',
    })
  }
  return new StreamableHTTPClientTransport(new URL(spec.url!), {
    requestInit: spec.headers !== undefined ? { headers: spec.headers } : undefined,
  })
}

/**
 * Probe one server with an independent SDK client: initialize + tools/list.
 * The probe shadows nothing — it closes every transport it opens and cannot
 * trigger the runtime reconnection machinery.
 */
export async function testConnection(spec: McpServerSpec): Promise<ProbeResult> {
  if (spec.transport === 'stdio' && (spec.command === undefined || spec.command === '')) {
    return { ok: false, latencyMs: 0, toolCount: 0, tools: [], error: 'command is required for stdio servers' }
  }
  if (spec.transport === 'streamable-http' && spec.url === undefined) {
    return { ok: false, latencyMs: 0, toolCount: 0, tools: [], error: 'url is required for streamable-http servers' }
  }
  const client = new Client({ name: 'dsh-tool-explorer', version: '0.1.0' })
  const transport = transportFor(spec)
  const started = Date.now()
  try {
    await client.connect(transport, { timeout: TEST_TIMEOUT_MS })
    const result = await client.listTools({}, { timeout: TEST_TIMEOUT_MS })
    const latencyMs = Date.now() - started
    return {
      ok: true,
      latencyMs,
      toolCount: result.tools.length,
      tools: result.tools.map(tool => tool.name),
    }
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - started,
      toolCount: 0,
      tools: [],
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    await client.close().catch(() => undefined)
  }
}
```

</details>

#### 缺口

- 固定宿主webServer的访问身份、监听与敏感GET保护
  **影响**：本插件不具独立管理员认证，无法保证共享/远程部署秘密不被读或配置不被改
  **进一步探讨**：核宿主路由鉴权和部署入口，将命令/URL/导入秘密视受信管理操作，不拿Origin当身份

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · MCP配置修改和状态展示有哪些真实保证？

**研究主题**：工程质量与复用、功能与机制、缺陷与关键质疑

#### 完整回答

MCP通过profile/home patch层文本手术追加insert/override/disabled或删除相关row，保留未修改文本，!!js作不执行的自定义YAML节点；profile来自--profile独立参数，没处理等号形式，默认web。列表读loader fiber数字phase和工具前缀计数，patch存在但未加载显示missing，active仅fiber状态，不是握手或工具执行通过。独立test与运行树分离，只证明当前一次连接列工具，不能证明配置HMR已应用或同一运行实例健康。

expectedHash与当前文件hash比较可防已读后手改，但undefined直接跳过，HTTP未强制提供；同步单进程检查到write之间没有await，不能夸大同进程HTTP必然交错，也不是跨进程原子CAS。外部写入仍可在校验与rename间发生；import用现场hash不是用户预览hash，源被重扫后可导入与预览不同内容。atomicWrite只保单文件替换，读patch异常都当null，配置读权限/IO失败不区分不存在。

updateServer的others先filter去掉spec.serverName再includes同一个值，重复名判断恒不命中；添加时能防重复不等编辑也防。setEnabled按view.patchLayer选归属，但loader条目优先且patchLayer=null，实际源元数据丢失时默认profile，不能总称自动找到home原行。probe两步各TEST_TIMEOUT，不是全局预算，finally close吞错且不额外限时，stdio stderr pipe未显式消费，异常输出/清理仍需具体SDK契约。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:87-94](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/routes.ts#L87-L94)

profile选择。

```text
  const flag = argv.indexOf('--profile')
  if (flag !== -1 && flag + 1 < argv.length && !argv[flag + 1]!.startsWith('-')) return argv[flag + 1]!
  return 'web'
}

function requireSameOrigin(request: IncomingMessage, response: ServerResponse): boolean {
  if (!sameOrigin(request)) {
    sendJson(response, 403, { error: 'untrusted origin' })
```

**依据 2 · 源码核查**：[src/mcp.ts:319-362](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L319-L362)

运行/patch状态。

<details>
<summary>查看原文（44行）</summary>

```text
export function listServers(host: McpHost): McpServerView[] {
  const views = new Map<string, McpServerView>()
  for (const entry of host.loader.entries()) {
    if (entry.options?.name !== MCP_PLUGIN_NAME || entry.options.id === undefined) continue
    const config = asSpec(entry.options.config)
    if (config === null) continue
    const enabled = entry.disabled === true || entry.options.disabled === true ? false : true
    const phase = entry.fiber?.state === undefined ? null : FIBER_PHASE[entry.fiber.state] ?? null
    const tools = host.tools.schemas().filter(tool => tool.name.startsWith(`mcp__${config.serverName}__`))
    views.set(entry.options.id, {
      id: entry.options.id,
      serverName: config.serverName,
      transport: config.transport,
      summary: specSummary(config),
      enabled,
      state: enabled ? (phase ?? 'missing') : 'disabled',
      toolCount: tools.length,
      patchLayer: null,
      config,
    })
  }
  for (const [layer, path] of Object.entries(patchPathsOf(host)) as Array<[PatchLayer, string]>) {
    for (const row of serverRowsFromPatch(path)) {
      if (!views.has(row.id)) {
        views.set(row.id, {
          id: row.id,
          serverName: row.config.serverName,
          transport: row.config.transport,
          summary: specSummary(row.config),
          enabled: true,
          state: 'missing',
          toolCount: 0,
          patchLayer: layer,
          config: row.config,
        })
      }
    }
  }
  const sorted = [...views.values()].sort((a, b) => a.serverName.localeCompare(b.serverName))
  return sorted
}

interface DetailedView extends McpServerView {
  tools: Array<{ name: string; description: string; paramCount: number }>
```

</details>

**依据 3 · 源码核查**：[src/mcp.ts:390-398](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L390-L398)

可选fence。

```text
function verifyFencing(path: string, expectedHash: string | null | undefined): string | null {
  const current = patchHash(path)
  if (expectedHash === undefined) return null
  if (current !== expectedHash) {
    return `the patch file changed since it was read (expected ${expectedHash ?? 'missing'}, found ${current ?? 'missing'}); reload and retry`
  }
  return null
}

```

**依据 4 · 源码核查**：[src/mcp.ts:430-490](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L430-L490)

编辑重复判断/层选择。

<details>
<summary>查看原文（61行）</summary>

```text
export function updateServer(host: McpHost, id: string, spec: McpServerSpec, options: WriteOptions): { ok: true } | { ok: false; error: string } {
  const { path } = writeTarget(host, options)
  const conflict = verifyFencing(path, options.expectedHash)
  if (conflict !== null) return { ok: false, error: conflict }
  const others = existingServerNames(host).filter(name => name !== spec.serverName)
  // The CURRENT name may swap to a new one; the old name then frees up.
  const current = findView(host, id)?.serverName
  if (others.includes(spec.serverName) && current !== spec.serverName) {
    return { ok: false, error: `serverName "${spec.serverName}" is already in use; every live server needs a unique name` }
  }
  const text = readPatchOrNull(path)
  if (text === null) return { ok: false, error: 'the target patch layer does not exist yet; add the server first' }
  const appended = appendRowBlock(text, overrideRowBlock(id, sanitizeSpec(spec)))
  if (!appended.ok) return { ok: false, error: appended.reason }
  atomicWrite(path, appended.text)
  return { ok: true }
}

/** Remove a server: drop every row (insert/override/disable) for its id. */
export function removeServer(host: McpHost, id: string, options: WriteOptions): { ok: true } | { ok: false; error: string } {
  const { path } = writeTarget(host, options)
  const conflict = verifyFencing(path, options.expectedHash)
  if (conflict !== null) return { ok: false, error: conflict }
  const text = readPatchOrNull(path)
  if (text === null) return { ok: false, error: 'the target patch layer has no content to remove from' }
  const next = removeRowsForId(text, id)
  if (next === text) {
    return { ok: false, error: `no rows for "${id}" were found in ${path}` }
  }
  atomicWrite(path, next)
  return { ok: true }
}

/** Find one server view by id (loader + patch rows). */
export function findView(host: McpHost, id: string): McpServerView | null {
  return listServers(host).find(view => view.id === id) ?? null
}

/**
 * Enable/disable a server by writing a `disabled: true|false` row into the
 * patch layer that owns the entry (profile when the row lives there, home
 * when it does — an override in a lower layer cannot reach a higher layer's
 * insert). A loader-only entry (no patch row) is toggled in the profile
 * layer, which discards its row's source metadata.
 */
export function setServerEnabled(host: McpHost, id: string, enabled: boolean, options: WriteOptions): { ok: true } | { ok: false; error: string } {
  const view = findView(host, id)
  if (view === null) return { ok: false, error: `server "${id}" not found` }
  const layer: PatchLayer = view.patchLayer === 'home' ? 'home' : 'profile'
  const { path } = writeTarget(host, { ...options, layer })
  const conflict = verifyFencing(path, options.expectedHash)
  if (conflict !== null) return { ok: false, error: conflict }
  const text = readPatchOrNull(path)
  if (text === null) return { ok: false, error: 'the target patch layer does not exist yet' }
  const cleaned = removeDisabledRowsForId(text, id)
  const appended = appendRowBlock(cleaned, toggleRowBlock(id, !enabled))
  if (!appended.ok) return { ok: false, error: appended.reason }
  atomicWrite(path, appended.text)
  return { ok: true }
}

```

</details>

**依据 5 · 源码核查**：[src/routes.ts:532-570](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/routes.ts#L532-L570)

导入重扫与现场hash。

<details>
<summary>查看原文（39行）</summary>

```text
      const targetPath = (item as Record<string, unknown>).path
      const targetName = (item as Record<string, unknown>).name
      if (typeof targetPath !== 'string' || typeof targetName !== 'string') {
        skipped.push({ name: '?', reason: 'invalid selection' })
        continue
      }
      const found = sources.find(source => source.path === targetPath)?.servers.find(server => server.name === targetName)
      if (found === undefined) {
        skipped.push({ name: targetName, reason: 'server no longer present in source config' })
        continue
      }
      const serverName = normalizeServerName(found.name)
      if (serverName === null) {
        skipped.push({ name: found.name, reason: 'name cannot be normalized onto [A-Za-z0-9_-]{1,32}' })
        continue
      }
      const spec: McpServerSpec = {
        serverName,
        transport: found.type === 'streamable-http' || found.url !== undefined ? 'streamable-http' : 'stdio',
      }
      if (found.command !== undefined) spec.command = found.command
      if (found.args !== undefined) spec.args = found.args
      if (found.env !== undefined) spec.env = found.env
      if (found.cwd !== undefined) spec.cwd = found.cwd
      if (found.url !== undefined) spec.url = found.url
      if (found.headers !== undefined) spec.headers = found.headers
      const validated = validateSpec(spec)
      if (!validated.ok) {
        skipped.push({ name: serverName, reason: validated.errors.join('; ') })
        continue
      }
      const targetPathFile = patchPathsOf(host)[layer]
      const result = addServer(host, validated.spec, {
        layer,
        expectedHash: patchHash(targetPathFile),
      })
      if (result.ok) imported.push({ name: serverName, id: result.id })
      else skipped.push({ name: serverName, reason: result.error })
    }
```

</details>

**依据 6 · 源码核查**：[src/patch-text.ts:204-227](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/patch-text.ts#L204-L227)

原子替换/读错null。

<details>
<summary>查看原文（24行）</summary>

```text
export function atomicWrite(path: string, text: string): void {
  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`
  writeFileSync(tmp, text, 'utf8')
  try {
    renameSync(tmp, path)
  } catch (error) {
    try {
      // Windows rename-over-existing can race with the HMR reader; retry once.
      renameSync(tmp, path)
    } catch {
      throw error
    }
  }
}

/** Read a patch file; `null` when it does not exist. */
export function readPatchOrNull(path: string): string | null {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return null
  }
}

```

</details>

**依据 7 · 源码核查**：[src/mcp.ts:522-553](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L522-L553)

分阶段探测/close。

<details>
<summary>查看原文（32行）</summary>

```text
export async function testConnection(spec: McpServerSpec): Promise<ProbeResult> {
  if (spec.transport === 'stdio' && (spec.command === undefined || spec.command === '')) {
    return { ok: false, latencyMs: 0, toolCount: 0, tools: [], error: 'command is required for stdio servers' }
  }
  if (spec.transport === 'streamable-http' && spec.url === undefined) {
    return { ok: false, latencyMs: 0, toolCount: 0, tools: [], error: 'url is required for streamable-http servers' }
  }
  const client = new Client({ name: 'dsh-tool-explorer', version: '0.1.0' })
  const transport = transportFor(spec)
  const started = Date.now()
  try {
    await client.connect(transport, { timeout: TEST_TIMEOUT_MS })
    const result = await client.listTools({}, { timeout: TEST_TIMEOUT_MS })
    const latencyMs = Date.now() - started
    return {
      ok: true,
      latencyMs,
      toolCount: result.tools.length,
      tools: result.tools.map(tool => tool.name),
    }
  } catch (error) {
    return {
      ok: false,
      latencyMs: Date.now() - started,
      toolCount: 0,
      tools: [],
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    await client.close().catch(() => undefined)
  }
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 技能编辑、改名和双调用开关能保留原技能吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

目录合并runtime registry、两个user根磁盘和共享lock，选第一个可用live agent scope，不是当前选中工作区。同名按name合并/磁盘首根优先，不能把全局列表当每会话精确可调用集。仅user根可编辑/切换/删除，项目/bundled只展示；kebab-case验证防名称路径穿越，边界检查仍是字符串前缀，未realpath排除根中符号链接。

独立invocation action正确改disable-model-invocation/user-invocable并保留其它frontmatter，是实际便利；create/update的toFrontmatter却用userInvocable驼峰键，序列器会作为额外键写下，不是平台user-invocable。于是编辑表单所选用户不可调用不能等同独立开关的真实效果。update重建frontmatter仅已知字段，原metadata等未带回；serializer虽保输入extra，重建输入已经丢了。

尤其重命名先在新目录写一个SKILL.md，再rmSync旧dir recursive，没有迁移scripts/references/assets；bundle附属材料会被删而新技能只剩MD，不能描述为无损目录rename。flat file dirNameOf还去.md得到不存在同名无扩展路径，旧flat可能保留与新bundle重复。无expected content hash与备份/回收站，界面预览不是修改完整性保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/skills.ts:67-96](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L67-L96)

首个agent scope。

<details>
<summary>查看原文（30行）</summary>

```text
 * The skills registry is scope-layered: Web mounts the filesystem provider
 * inside each session's agent preset, so the user-root catalog is only
 * visible from an agent's scope. Resolve one live agent as the viewing scope
 * (mirrors what dsh-tool-skill passes on every read).
 */
export function agentScopeOf(host: SkillsHost): unknown | undefined {
  let agents: AgentsLike | undefined
  try {
    agents = host.agentsLookup?.()
  } catch {
    return undefined
  }
  if (agents === undefined) return undefined
  try {
    for (const entry of agents.list() ?? []) {
      if (entry === null || typeof entry !== 'object') continue
      // Any live agent entry is a valid viewing scope — we only READ the
      // registry, so an idle (not currently running) agent is fine. The
      // running gate was borrowed from dshmarket's mutation guard and
      // produced the misleading host-only view while the page was open
      // without an active turn.
      if (typeof entry.id !== 'string' || entry.id === '') continue
      const scope = agents.get?.(entry.id)
      if (scope !== undefined) return scope
    }
  } catch {
    return undefined
  }
  return undefined
}
```

</details>

**依据 2 · 源码核查**：[src/skills.ts:230-252](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L230-L252)

合并/磁盘首根。

<details>
<summary>查看原文（23行）</summary>

```text
async function collectSkills(host: SkillsHost): Promise<{ skills: SkillListView[]; complete: boolean; viewScope: 'agent' | 'host'; trashCount: number }> {
  const lock = readSkillLock(host) ?? {}
  const disk = new Map<string, { source: string; path: string }>()
  for (const root of userSkillRoots(host)) {
    for (const [name, path] of scanRoot(root.path)) {
      if (!disk.has(name)) disk.set(name, { source: root.source, path })
    }
  }
  let summaries: SkillSummaryLike[] = []
  let complete = true
  const scope = agentScopeOf(host)
  const lookup = scope === undefined ? {} : { scope }
  try {
    summaries = await host.skills.list(lookup)
  } catch {
    complete = false
  }
  const byName = new Map(summaries.map(summary => [summary.name, summary]))
  const views: SkillListView[] = []
  const seen = new Set<string>()

  for (const summary of summaries) {
    seen.add(summary.name)
```

</details>

**依据 3 · 源码核查**：[src/skills.ts:407-429](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L407-L429)

toFrontmatter与词法边界。

<details>
<summary>查看原文（23行）</summary>

```text
    ...(write.disableModelInvocation !== undefined ? { 'disable-model-invocation': write.disableModelInvocation } : {}),
    ...(write.userInvocable !== undefined ? { userInvocable: write.userInvocable } : {}),
  }
}

/** Atomic write of a skill file (temp + rename). */
function atomicWrite(path: string, text: string): void {
  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`
  writeFileSync(tmp, text, 'utf8')
  renameSync(tmp, path)
}

/** True when a path lives under one of the user skill roots. */
export function userRootOf(host: SkillsHost, path: string): { source: string; root: string } | null {
  for (const root of userSkillRoots(host)) {
    const normalized = root.path.replace(/[\\/]+$/u, '')
    if (path === normalized || path.startsWith(`${normalized}/`) || path.startsWith(`${normalized}\\`)) {
      return { source: root.source, root: normalized }
    }
  }
  return null
}

```

</details>

**依据 4 · 源码核查**：[src/skills.ts:452-490](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L452-L490)

改名只写MD删旧目录。

<details>
<summary>查看原文（39行）</summary>

```text
export function updateSkill(
  host: SkillsHost,
  currentName: string,
  input: unknown,
): { ok: true; name: string } | { ok: false; errors: string[] } {
  const validated = validateSkillWrite(input)
  if (!validated.ok) return { ok: false, errors: validated.errors }
  const lock = readSkillLock(host) ?? {}
  // Resolve the current file path: registry path first, then disk scan.
  let path = diskPathFor(host, currentName)
  const userRoot = path !== null ? userRootOf(host, path) : null
  if (path === null || userRoot === null) {
    return { ok: false, errors: [`skill "${currentName}" is not editable (only ~/.agents/skills and ~/.dsh/skills skills can be edited)`] }
  }
  let dir = dirNameOf(path)
  const newDir = join(userRoot.root, validated.write.name)
  const newPath = join(newDir, 'SKILL.md')
  if (validated.write.name !== currentName && existsSync(newDir)) {
    return { ok: false, errors: [`a skill named "${validated.write.name}" already exists`] }
  }
  const text = serializeSkillFile(toFrontmatter(validated.write), validated.write.body)
  if (validated.write.name !== currentName) {
    mkdirSync(newDir, { recursive: true })
    atomicWrite(newPath, text)
    // Remove the old directory only if it is the one we manage (safe: it
    // contains only this skill's files at user root).
    try {
      rmSync(dir, { recursive: true, force: true })
    } catch {
      // leftover files are harmless; the new copy is authoritative
    }
    if (lock[currentName] !== undefined) {
      lock[validated.write.name] = lock[currentName]
      delete lock[currentName]
      writeSkillLock(host, lock)
    }
    path = newPath
  } else {
    atomicWrite(path, text)
```

</details>

**依据 5 · 源码核查**：[src/skills.ts:519-569](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L519-L569)

独立双轴开关/flat路径。

<details>
<summary>查看原文（51行）</summary>

```text
 * (the skill disappears from the model catalog but stays in the `/` menu);
 * `user: false` writes only `user-invocable: false`. Enabling removes the
 * matching key and leaves the other axis untouched.
 */
export function setSkillInvocation(
  host: SkillsHost,
  name: string,
  patch: { model?: boolean; user?: boolean },
): { ok: true; changes: string[] } | { ok: false; error: string } {
  if (patch.model === undefined && patch.user === undefined) {
    return { ok: false, error: 'at least one of model/user must be provided' }
  }
  const path = diskPathFor(host, name)
  if (path === null || userRootOf(host, path) === null) {
    return { ok: false, error: `skill "${name}" is not editable (only user-root skills can be switched)` }
  }
  const parsed = readSkillFile(path)
  if (parsed === null) return { ok: false, error: `could not parse ${path}` }
  const frontmatter = parsed.frontmatter
  const changes: string[] = []
  if (patch.model !== undefined) {
    if (patch.model) delete frontmatter['disable-model-invocation']
    else frontmatter['disable-model-invocation'] = true
    changes.push(`model:${patch.model ? 'on' : 'off'}`)
  }
  if (patch.user !== undefined) {
    if (patch.user) delete frontmatter['user-invocable']
    else frontmatter['user-invocable'] = false
    changes.push(`user:${patch.user ? 'on' : 'off'}`)
  }
  atomicWrite(path, serializeSkillFile(frontmatter, parsed.body))
  return { ok: true, changes }
}

/**
 * Resolve the SKILL.md path for a name (registry → disk scan). Never follows
 * the lock file, so a user-root skill left on disk after its lock entry was
 * removed stays addressable (the trash/restore flow relies on this).
 */
export function diskPathFor(host: SkillsHost, name: string): string | null {
  for (const root of userSkillRoots(host)) {
    for (const [diskName, path] of scanRoot(root.path)) {
      if (diskName === name) return path
    }
  }
  return null
}

function dirNameOf(path: string): string {
  return path.replace(/[\\/]SKILL\.md$/u, '').replace(/\.md$/u, '')
}
```

</details>

**依据 6 · 源码核查**：[src/skills.ts:402-410](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L402-L410)

编辑仅重建已知字段，用户开关用驼峰键

```text
function toFrontmatter(write: SkillWrite): SkillFrontmatter {
  return {
    name: write.name,
    description: write.description,
    ...(write.whenToUse !== undefined ? { whenToUse: write.whenToUse } : {}),
    ...(write.disableModelInvocation !== undefined ? { 'disable-model-invocation': write.disableModelInvocation } : {}),
    ...(write.userInvocable !== undefined ? { userInvocable: write.userInvocable } : {}),
  }
}
```

**依据 7 · 源码核查**：[src/skills.ts:345-362](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L345-L362)

序列器保extra只对输入仍有的字段成立

<details>
<summary>查看原文（18行）</summary>

```text
export function serializeSkillFile(frontmatter: SkillFrontmatter, body: string): string {
  const keys = ['name', 'description', 'whenToUse', 'disable-model-invocation', 'user-invocable']
  const record: Record<string, unknown> = {}
  for (const key of keys) {
    if (key === 'name' || key === 'description' || key === 'whenToUse'
      || key === 'disable-model-invocation' || key === 'user-invocable') {
      const value = frontmatter[key]
      if (value !== undefined) record[key] = value
      else if (key === 'name' || key === 'description') return `invalid frontmatter: missing ${key}`
    }
  }
  // Preserve any extra keys (metadata etc.) the editor did not touch.
  for (const [key, value] of Object.entries(frontmatter)) {
    if (!keys.includes(key)) record[key] = value
  }
  const head = dump(record, { indent: 2, lineWidth: -1, noRefs: true, flowLevel: 4 }).trimEnd()
  return `---\n${head}\n---\n${body.startsWith('\n') ? body.slice(1) : body}\n`
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · GitHub安装/升级是否固定来源与预览一致？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

批选同仓仅下载/解压一次、每项冲突独立报告，这是具体资源节省机制。目录hash按相对路径+字节排序SHA256，帮助检出文件变化，但不含符号链接、权限等元数据，不是来源真实性或安全扫描。默认下载先加gh-proxy.com，源码没有README概括的直连失败后再代理流程；redirect跟随，arrayBuffer整包无字节上限，解压无本地展开配额/文件数限制，tar库防护边界需按其版本另核。

预览与install重新下载HEAD/branch，仅比frontmatter.name，body/脚本内容可变；客户端传target/candidates/sourceUrl，服务端不绑定预览hash，candidate.skillPath仅字符串直接join，无规范containment/realpath核。name虽kebab安全，源目录不等可信固定包。branch下载始终refs/heads，不能把commit或tag描述成已支持固定ref；tree单branch/含斜杠branch解析亦有限。

lock记录source owner/repo、URL、skillPath/hash，未保存branch/revision，日后update重parse sourceUrl默认为HEAD，可能从原分支切默认分支。root skillPath存SKILL.md但update只去除/ SKILL.md后缀，根项仍成SKILL.md目录再找SKILL.md，可能无法更新。升级不先比较本地hash与旧lock确定人工改动，只要remote不同即覆盖。backup在copy失败时能回滚，但copy成功后删除backup再写lock，lock失败会留下新文件/旧记录，无目录+lock事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/skills-install.ts:29-65](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L29-L65)

URL/ref解析。

<details>
<summary>查看原文（37行）</summary>

```text

/** Parse a GitHub input into a target; null for anything non-github. */
export function parseGitHubInput(input: string): GitHubTarget | null {
  let text = input.trim()
  if (text === '') return null
  // Strip leading protocol forms.
  if (/^https?:\/\/(?:www\.)?github\.com\//i.test(text)) text = text.replace(/^https?:\/\/(?:www\.)?github\.com\//i, '')
  else if (/^git@github\.com:/i.test(text)) text = text.replace(/^git@github\.com:/i, '')
  else if (/^github:/i.test(text)) text = text.slice('github:'.length)
  // owner/repo[/tree/[branch/][path]] or owner/repo[/path][#branch] or owner/repo.git
  text = text.replace(/^\/+/u, '').replace(/\.git$/i, '')
  const at = text.indexOf('#')
  let branch: string | undefined
  if (at !== -1) {
    branch = text.slice(at + 1).trim() || undefined
    text = text.slice(0, at)
  }
  const segments = text.split('/').filter(segment => segment !== '')
  if (segments.length < 2) return null
  const [owner, repo, ...rest] = segments
  if (owner === undefined || repo === undefined) return null
  if (!/^[A-Za-z0-9_.-]+$/u.test(owner) || !/^[A-Za-z0-9_.-]+$/u.test(repo)) return null
  let path: string | undefined
  if (rest.length > 0) {
    const afterTree = rest[0] === 'tree' ? rest.slice(1) : rest
    if (afterTree.length > 0) {
      // `tree/<branch>/<path>`: the first segment may be the branch.
      if (rest[0] === 'tree' && afterTree.length >= 2) {
        if (branch === undefined) branch = afterTree[0]
        path = afterTree.slice(1).join('/')
      } else {
        // owner/repo/<path> — ambiguous; take the whole remainder as path.
        path = afterTree.join('/')
      }
    }
  }
  return { owner, repo, branch, path: path !== undefined && path !== '' ? path : undefined }
```

</details>

**依据 2 · 源码核查**：[src/skills-install.ts:88-117](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L88-L117)

下载无包体上限。

<details>
<summary>查看原文（30行）</summary>

```text
  if (target.branch !== undefined && target.branch !== '') {
    return `https://codeload.github.com/${target.owner}/${target.repo}/tar.gz/refs/heads/${encodeURIComponent(target.branch)}`
  }
  return `https://codeload.github.com/${target.owner}/${target.repo}/tar.gz/HEAD`
}

/** Download the repo tarball; throws with the error text on failure. */
export async function fetchRepoTarball(host: SkillsHost, target: GitHubTarget, signal?: AbortSignal): Promise<Buffer> {
  const url = throughProxy(githubProxyOf(host), downloadUrlFor(target))
  const fetchImpl = (host as { fetchImpl?: typeof fetch }).fetchImpl ?? fetch
  let response: Response
  try {
    response = await fetchImpl(url, { signal: signal ?? AbortSignal.timeout(120_000), redirect: 'follow' })
  } catch (error) {
    throw new Error(`download failed (${url.slice(0, 80)}…): ${error instanceof Error ? error.message : String(error)}`)
  }
  if (!response.ok) throw new Error(`download failed: HTTP ${response.status} (${url.slice(0, 90)}…)`)
  return Buffer.from(await response.arrayBuffer())
}

/** Extract a tarball buffer into a fresh temp dir; returns the extraction root. */
export async function extractTarball(buffer: Buffer): Promise<string> {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-te-install-'))
  writeFileSync(join(dir, 'repo.tar.gz'), buffer)
  await tar.x({ file: join(dir, 'repo.tar.gz'), cwd: dir, strip: 1 })
  rmSync(join(dir, 'repo.tar.gz'), { force: true })
  return dir
}

/** All directories exactly one level deeper than `base` (after strip). */
```

</details>

**依据 3 · 源码核查**：[src/skills-install.ts:183-209](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L183-L209)

hash边界。

<details>
<summary>查看原文（27行）</summary>

```text
  const files: Array<{ relativePath: string; content: Buffer }> = []
  const collect = (base: string, current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue
        collect(base, full)
      } else if (entry.isFile()) {
        files.push({
          relativePath: relative(base, full).split('\\').join('/'),
          content: readFileSync(full),
        })
      }
    }
  }
  collect(skillDir, skillDir)
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
  const hash = createHash('sha256')
  for (const file of files) {
    hash.update(file.relativePath)
    hash.update(file.content)
  }
  return hash.digest('hex')
}

/** One preview result (candidates for a repo URL). */
export interface InstallPreview {
```

</details>

**依据 4 · 源码核查**：[src/skills-install.ts:245-284](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L245-L284)

源path、名字检查和lock字段。

<details>
<summary>查看原文（40行）</summary>

```text
  extracted: string,
  preview: InstallPreview,
  candidate: InstallCandidate,
  rootLabel: '~/.agents/skills' | '~/.dsh/skills',
  lock: Record<string, LockEntry>,
): Promise<{ ok: true; name: string; lock: LockEntry } | { ok: false; error: string }> {
  const target = preview.target
  const root = userSkillRoots(host).find(item => item.label === rootLabel)
  if (root === undefined) return { ok: false, error: 'unknown skill root' }
  const name = candidate.name
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)) {
    return { ok: false, error: `skill name "${name}" is not kebab-case; the filesystem provider would reject it` }
  }
  const dest = join(root.path, name)
  if (existsSync(dest)) {
    return { ok: false, error: `a skill named "${name}" already exists in ${rootLabel}` }
  }
  const sourceDir = candidate.skillPath === '' ? extracted : join(extracted, candidate.skillPath)
  if (!existsSync(join(sourceDir, 'SKILL.md'))) {
    return { ok: false, error: `SKILL.md not found at repo path "${candidate.skillPath}"` }
  }
  // Verify the installed name matches the frontmatter (rename safety).
  const parsed = readSkillFile(join(sourceDir, 'SKILL.md'))
  if (parsed === null || parsed.frontmatter.name !== name) {
    return { ok: false, error: 'frontmatter name changed between preview and install; retry' }
  }
  mkdirSync(dest, { recursive: true })
  cpSync(sourceDir, dest, { recursive: true })
  const skillFolderHash = await computeSkillFolderHash(dest)
  const now = new Date().toISOString()
  lock[name] = {
    source: `${target.owner}/${target.repo}`,
    sourceType: 'github',
    sourceUrl: preview.sourceUrl,
    skillPath: candidate.skillPath === '' ? 'SKILL.md' : `${candidate.skillPath}/SKILL.md`,
    skillFolderHash,
    installedAt: now,
    updatedAt: now,
  }
  return { ok: true, name, lock: lock[name]! }
```

</details>

**依据 5 · 源码核查**：[src/skills-install.ts:314-337](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L314-L337)

批选一次下载。

<details>
<summary>查看原文（24行）</summary>

```text
export async function installCandidates(
  host: SkillsHost,
  preview: InstallPreview,
  candidates: InstallCandidate[],
  rootLabel: '~/.agents/skills' | '~/.dsh/skills',
  signal?: AbortSignal,
): Promise<{ ok: true; installed: Array<{ name: string }>; skipped: Array<{ name: string; error: string }> } | { ok: false; error: string }> {
  if (candidates.length === 0) return { ok: false, error: 'no candidates selected' }
  const buffer = await fetchRepoTarball(host, preview.target, signal)
  const extracted = await extractTarball(buffer)
  const lock = readSkillLock(host) ?? {}
  const installed: Array<{ name: string }> = []
  const skipped: Array<{ name: string; error: string }> = []
  try {
    for (const candidate of candidates) {
      const result = await installOneFromExtracted(host, extracted, preview, candidate, rootLabel, lock)
      if (result.ok) installed.push({ name: result.name })
      else skipped.push({ name: candidate.name, error: result.error })
    }
  } finally {
    rmSync(extracted, { recursive: true, force: true })
  }
  if (installed.length > 0) writeSkillLock(host, lock)
  return { ok: true, installed, skipped }
```

</details>

**依据 6 · 源码核查**：[src/skills-install.ts:341-359](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L341-L359)

root path更新定位。

<details>
<summary>查看原文（19行）</summary>

```text
export async function checkSkillUpdate(host: SkillsHost, name: string): Promise<{ ok: true; updateAvailable: boolean; currentHash?: string; targetHash?: string } | { ok: false; error: string }> {
  const lock = (readSkillLock(host) ?? {})[name]
  if (lock === undefined) return { ok: false, error: `skill "${name}" is not lockfile-managed` }
  const localDir = skillsRootFor(host, name)
  if (localDir === null) return { ok: false, error: `skill "${name}" not found on disk` }
  const target = parseGitHubInput(lock.sourceUrl ?? `${lock.source ?? ''}`)
  if (target === null) return { ok: false, error: 'lockfile source could not be parsed as GitHub' }
  const buffer = await fetchRepoTarball(host, target)
  const extracted = await extractTarball(buffer)
  const skillPath = typeof lock.skillPath === 'string' ? lock.skillPath.replace(/\/SKILL\.md$/u, '') : ''
  const remoteDir = skillPath === '' ? extracted : join(extracted, skillPath)
  if (!existsSync(join(remoteDir, 'SKILL.md'))) {
    rmSync(extracted, { recursive: true, force: true })
    return { ok: false, error: `SKILL.md not found at repo path "${skillPath}"` }
  }
  const targetHash = await computeSkillFolderHash(remoteDir)
  const currentHash = await computeSkillFolderHash(localDir)
  rmSync(extracted, { recursive: true, force: true })
  return { ok: true, updateAvailable: currentHash !== targetHash, currentHash, targetHash }
```

</details>

**依据 7 · 源码核查**：[src/skills-install.ts:372-415](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L372-L415)

升级覆盖和backup/lock顺序。

<details>
<summary>查看原文（44行）</summary>

```text
export async function updateSkillFromSource(host: SkillsHost, name: string): Promise<{ ok: true; name: string; updated: boolean } | { ok: false; error: string }> {
  const lock = (readSkillLock(host) ?? {})[name]
  if (lock === undefined) return { ok: false, error: `skill "${name}" is not lockfile-managed` }
  const localDir = skillsRootFor(host, name)
  if (localDir === null) return { ok: false, error: `skill "${name}" not found on disk` }
  const parent = localDir.replace(/[\\/][^\\/]+$/u, '')
  const target = parseGitHubInput(lock.sourceUrl ?? `${lock.source ?? ''}`)
  if (target === null) return { ok: false, error: 'lockfile source could not be parsed as GitHub' }
  const buffer = await fetchRepoTarball(host, target)
  const extracted = await extractTarball(buffer)
  const skillPath = typeof lock.skillPath === 'string' ? lock.skillPath.replace(/\/SKILL\.md$/u, '') : ''
  const remoteDir = skillPath === '' ? extracted : join(extracted, skillPath)
  if (!existsSync(join(remoteDir, 'SKILL.md'))) {
    rmSync(extracted, { recursive: true, force: true })
    return { ok: false, error: `SKILL.md not found at repo path "${skillPath}"` }
  }
  const localHash = await computeSkillFolderHash(localDir)
  const remoteHash = await computeSkillFolderHash(remoteDir)
  if (localHash === remoteHash) {
    rmSync(extracted, { recursive: true, force: true })
    return { ok: true, name, updated: false }
  }
  const backup = `${parent}/.${name}.bak`
  await fsRmBackup(backup)
  if (existsSync(backup)) rmSync(backup, { recursive: true, force: true })
  if (existsSync(localDir)) {
    cpSync(localDir, backup, { recursive: true })
    rmSync(localDir, { recursive: true, force: true })
  }
  try {
    cpSync(remoteDir, localDir, { recursive: true })
  } catch (error) {
    // Roll back.
    rmSync(localDir, { recursive: true, force: true })
    if (existsSync(backup)) cpSync(backup, localDir, { recursive: true })
    rmSync(extracted, { recursive: true, force: true })
    return { ok: false, error: `update failed and was rolled back: ${error instanceof Error ? error.message : String(error)}` }
  }
  rmSync(extracted, { recursive: true, force: true })
  rmSync(backup, { recursive: true, force: true })
  const all = readSkillLock(host) ?? {}
  if (all[name] !== undefined) all[name] = { ...all[name], updatedAt: new Date().toISOString(), skillFolderHash: remoteHash }
  writeSkillLock(host, all)
  return { ok: true, name, updated: true }
```

</details>

**依据 8 · 源码核查**：[src/routes.ts:760-794](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/routes.ts#L760-L794)

客户端候选未绑定预览。

<details>
<summary>查看原文（35行）</summary>

```text

async function handleInstallSkill(host: ToolExplorerHost, request: IncomingMessage, response: ServerResponse): Promise<void> {
  try {
    const body = await readJsonBody(request) as Record<string, unknown>
    const target = body.target as { owner?: unknown; repo?: unknown; branch?: unknown; path?: unknown } | undefined
    if (target === undefined || typeof target.owner !== 'string' || typeof target.repo !== 'string') {
      sendJson(response, 400, { error: 'target is required (owner/repo from the preview)' })
      return
    }
    // Accept a batch (`candidates`) or the legacy single `candidate` shape.
    const candidates: InstallCandidate[] = []
    const skippedInput: Array<{ name: string; error: string }> = []
    const rawList = Array.isArray(body.candidates)
      ? body.candidates
      : (typeof body.candidate === 'object' && body.candidate !== null ? [body.candidate] : [])
    for (const item of rawList) {
      const record = item as Record<string, unknown>
      if (typeof record?.name === 'string' && typeof record?.skillPath === 'string') {
        candidates.push(record as unknown as InstallCandidate)
      } else {
        skippedInput.push({ name: typeof record?.name === 'string' ? record.name : '?', error: 'invalid candidate' })
      }
    }
    if (candidates.length === 0) {
      const message = skippedInput.length > 0
        ? `no valid candidates (${skippedInput.map(item => item.name).join(', ')})`
        : 'at least one candidate is required (from the preview)'
      sendJson(response, 400, { error: message })
      return
    }
    const sourceUrl = typeof body.sourceUrl === 'string' ? body.sourceUrl : `https://github.com/${target.owner}/${target.repo}.git`
    const preview: InstallPreview = { target: { owner: target.owner, repo: target.repo, ...(typeof target.branch === 'string' && target.branch !== '' ? { branch: target.branch } : {}), ...(typeof target.path === 'string' && target.path !== '' ? { path: target.path } : {}) }, sourceUrl, candidates }
    const root = body.root === '~/.dsh/skills' ? '~/.dsh/skills' : '~/.agents/skills'
    const result = await installCandidates(host, preview, candidates, root)
    if (!result.ok) {
```

</details>

**依据 9 · 源码核查**：[src/skills-install.ts:216-227](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L216-L227)

preview sourceUrl规范为repo.git不保branch

<details>
<summary>查看原文（12行）</summary>

```text
export async function previewInstall(host: SkillsHost, input: string): Promise<InstallPreview> {
  const target = parseGitHubInput(input)
  if (target === null) throw new Error('invalid GitHub URL — expected https://github.com/owner/repo[/path] owner/repo[/path] or owner/repo#branch')
  const buffer = await fetchRepoTarball(host, target)
  const root = await extractTarball(buffer)
  const candidates = discoverCandidates(root, target.path)
  rmSync(root, { recursive: true, force: true })
  return {
    target,
    sourceUrl: `https://github.com/${target.owner}/${target.repo}.git`,
    candidates,
  }
```

</details>

#### 缺口

- tar依赖版本对符号链接/特殊entry的实际防护与宿主provider如何加载依赖目录
  **影响**：不能把解压库默认行为当自身安全承诺，源目录和附属脚本需人工审查
  **进一步探讨**：核固定依赖原文与允许包结构，以超大包、外链、预览后变更和root技能更新路径反例检验

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 回收站与持久化能恢复到删除前吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

把trash移出技能根避免watcher把删除对象重新发现，并记录lock快照与原路径；原路径已存在则拒恢复，EXDEV才copy+delete，正常rename减少无谓复制，这些是具体工程优点。

但trash先删lock并写盘，再移动目录，最后写manifest，任何中间失败无补偿；restore先搬回文件再写lock/drop manifest，同样非原子，单文件rename不能证明全流程一致。manifest坏/不可读当空且只验version/items数组，后续写可能遗失旧条目；恢复信任manifest.originalPath，没有复核仍处现有效root。purge/empty吞rm错误仍丢manifest并回ok/purged，磁盘残留不再可见，不能当已确认永久擦除。

共享lock坏时读null，write在parse失败后从空开始，可能覆盖其它记录；无CAS/跨进程锁。preview/extract错误不全由finally清临时目录，安装copy/hash失败或lock写失败亦可能留已装文件，批选部分完成不是全组原子回滚。恢复判据应是文件/lock/manifest三者实对齐，不能只看HTTP200。

#### 证据与依据

**依据 1 · 源码核查**：[src/skills-trash.ts:62-110](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts#L62-L110)

manifest/移动。

<details>
<summary>查看原文（49行）</summary>

```text
export function trashRootOf(host: SkillsHost): string {
  return join(dshHomeOf(host), 'skills-trash')
}

/** Read the trash manifest; an absent or corrupt file reads as empty. */
export function readTrashManifest(host: SkillsHost): TrashManifest {
  try {
    const parsed = JSON.parse(readFileSync(join(trashRootOf(host), 'manifest.json'), 'utf8')) as Partial<TrashManifest>
    if (parsed.version === 1 && Array.isArray(parsed.items)) return parsed as TrashManifest
  } catch {
    // absent or corrupt — treat as empty
  }
  return emptyManifest()
}

/** Write the trash manifest atomically (temp + rename). */
export function writeTrashManifest(host: SkillsHost, manifest: TrashManifest): void {
  const path = join(trashRootOf(host), 'manifest.json')
  mkdirSync(trashRootOf(host), { recursive: true })
  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`
  writeFileSync(tmp, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  renameSync(tmp, path)
}

/** Number of recoverable-trash items (surfaces in the skills list payload). */
export function trashCountOf(host: SkillsHost): number {
  return readTrashManifest(host).items.length
}

/** The trash directory for one item id. */
function trashDirFor(host: SkillsHost, id: string): string {
  return join(trashRootOf(host), id)
}

/** Move a directory or file; rename first, copy+delete on EXDEV (cross-volume). */
function moveEntry(source: string, destination: string): void {
  try {
    renameSync(source, destination)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EXDEV') throw error
    mkdirSync(destination.replace(/[\\/][^\\/]+$/u, ''), { recursive: true })
    cpSync(source, destination, { recursive: true })
    rmSync(source, { recursive: true, force: true })
  }
}

/** Build a unique trash id (`<name>-<stamp>`), never colliding on disk. */
function nextTrashId(host: SkillsHost, name: string): string {
  const stamp = new Date().toISOString().replace(/[-:T.]/gu, '').slice(0, 15)
```

</details>

**依据 2 · 源码核查**：[src/skills-trash.ts:124-171](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts#L124-L171)

trash写入顺序。

<details>
<summary>查看原文（48行）</summary>

```text
 */
export function trashSkill(host: SkillsHost, name: string): { ok: true; id: string } | { ok: false; error: string } {
  if (!isSkillName(name)) return { ok: false, error: 'invalid skill name' }
  const path = diskPathFor(host, name)
  if (path === null) return { ok: false, error: `skill "${name}" not found on disk` }
  const userRoot = userRootOf(host, path)
  if (userRoot === null) {
    return { ok: false, error: `skill "${name}" is not deletable (only ~/.agents/skills and ~/.dsh/skills skills can be deleted)` }
  }
  const kind: 'bundle' | 'file' = path.replace(/\\/gu, '/').endsWith('/SKILL.md') ? 'bundle' : 'file'
  const originalPath = kind === 'bundle' ? path.slice(0, path.length - 'SKILL.md'.length - 1) : path
  if (!existsSync(originalPath)) return { ok: false, error: `skill "${name}" is not deletable (${originalPath} missing)` }

  const id = nextTrashId(host, name)
  const lock = readSkillLock(host) ?? {}
  const snapshot = lock[name] ?? null
  if (snapshot !== null) {
    delete lock[name]
    writeSkillLock(host, lock)
  }

  mkdirSync(trashRootOf(host), { recursive: true })
  const dest = trashDirFor(host, id)
  if (kind === 'bundle') {
    moveEntry(originalPath, dest)
  } else {
    mkdirSync(dest, { recursive: true })
    moveEntry(originalPath, join(dest, `${name}.md`))
  }

  const manifest = readTrashManifest(host)
  manifest.items.push({
    id,
    name,
    source: userRoot.source,
    rootLabel: userSkillRoots(host).find(item => item.path === userRoot.root)?.label ?? userRoot.root,
    originalPath,
    kind,
    lock: snapshot,
    deletedAt: new Date().toISOString(),
  })
  writeTrashManifest(host, manifest)
  return { ok: true, id }
}

/** The browser-facing trash listing (manifest order, newest first). */
export function listTrash(host: SkillsHost): { items: TrashItemView[] } {
  const root = trashRootOf(host)
```

</details>

**依据 3 · 源码核查**：[src/skills-trash.ts:202-231](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts#L202-L231)

恢复顺序。

<details>
<summary>查看原文（30行）</summary>

```text
 */
export function restoreTrashItem(host: SkillsHost, id: string): { ok: true; name: string } | { ok: false; error: string } {
  const item = findItem(host, id)
  if (item === null) return { ok: false, error: `trash item "${id}" not found` }
  if (existsSync(item.originalPath)) {
    return { ok: false, error: `cannot restore "${item.name}": ${item.originalPath} already exists` }
  }
  const source = trashDirFor(host, item.id)
  if (!existsSync(source)) return { ok: false, error: `cannot restore "${item.name}": trash copy is missing` }
  mkdirSync(item.originalPath.replace(/[\\/][^\\/]+$/u, ''), { recursive: true })
  if (item.kind === 'bundle') {
    moveEntry(source, item.originalPath)
  } else {
    moveEntry(join(source, `${item.name}.md`), item.originalPath)
    try {
      rmSync(source, { recursive: true, force: true })
    } catch {
      // leftover trash dir is harmless; the file copy is authoritative
    }
  }
  if (item.lock !== null) {
    const lock = readSkillLock(host) ?? {}
    lock[item.name] = item.lock
    writeSkillLock(host, lock)
  }
  dropItem(host, id)
  return { ok: true, name: item.name }
}

/** Permanently delete one trashed skill (no recovery after this). */
```

</details>

**依据 4 · 源码核查**：[src/skills-trash.ts:234-256](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts#L234-L256)

吞删除失败。

<details>
<summary>查看原文（23行）</summary>

```text
  if (item === null) return { ok: false, error: `trash item "${id}" not found` }
  try {
    rmSync(trashDirFor(host, item.id), { recursive: true, force: true })
  } catch {
    // best effort; the manifest entry is authoritative
  }
  dropItem(host, id)
  return { ok: true, name: item.name }
}

/** Permanently delete every trashed skill. */
export function emptyTrash(host: SkillsHost): { ok: true; purged: number } {
  const manifest = readTrashManifest(host)
  const count = manifest.items.length
  for (const item of manifest.items) {
    try {
      rmSync(trashDirFor(host, item.id), { recursive: true, force: true })
    } catch {
      // best effort
    }
  }
  writeTrashManifest(host, emptyManifest())
  return { ok: true, purged: count }
```

</details>

**依据 5 · 源码核查**：[src/skills.ts:126-156](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L126-L156)

lock读坏/写。

<details>
<summary>查看原文（31行）</summary>

```text
export function readSkillLock(host: SkillsHost): Record<string, LockEntry> | null {
  try {
    const parsed = JSON.parse(readFileSync(join(agentsHomeOf(host), '.skill-lock.json'), 'utf8')) as {
      version?: number
      skills?: Record<string, LockEntry>
    }
    return typeof parsed.skills === 'object' && parsed.skills !== null ? parsed.skills : null
  } catch {
    return null
  }
}

/** Write the shared lock file, preserving top-level keys (version, dismissed, ...). */
export function writeSkillLock(host: SkillsHost, skills: Record<string, LockEntry>): void {
  const path = join(agentsHomeOf(host), '.skill-lock.json')
  let existing: Record<string, unknown> = {}
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
    existing = parsed
  } catch {
    existing = {}
  }
  const next = { ...existing, skills, version: typeof existing.version === 'number' ? existing.version : 3 }
  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`
  writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  renameSync(tmp, path)
}

/**
 * Scan one user root for skills: directory bundles `<name>/SKILL.md` and
 * flat `<name>.md` files (one level deep, mirroring discovery).
```

</details>

**依据 6 · 源码核查**：[src/skills-install.ts:290-337](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L290-L337)

批选异常/锁写。

<details>
<summary>查看原文（48行）</summary>

```text
  preview: InstallPreview,
  candidate: InstallCandidate,
  rootLabel: '~/.agents/skills' | '~/.dsh/skills',
  signal?: AbortSignal,
): Promise<{ ok: true; name: string; lock: LockEntry } | { ok: false; error: string }> {
  const buffer = await fetchRepoTarball(host, preview.target, signal)
  const extracted = await extractTarball(buffer)
  const lock = readSkillLock(host) ?? {}
  try {
    const result = await installOneFromExtracted(host, extracted, preview, candidate, rootLabel, lock)
    if (!result.ok) return result
    writeSkillLock(host, lock)
    return result
  } finally {
    rmSync(extracted, { recursive: true, force: true })
  }
}

/**
 * Batch-install several candidates from one repo preview. The tarball is
 * downloaded and extracted exactly once; each candidate installs
 * independently and conflicts/skips are reported per skill, so a partial
 * selection never blocks the rest.
 */
export async function installCandidates(
  host: SkillsHost,
  preview: InstallPreview,
  candidates: InstallCandidate[],
  rootLabel: '~/.agents/skills' | '~/.dsh/skills',
  signal?: AbortSignal,
): Promise<{ ok: true; installed: Array<{ name: string }>; skipped: Array<{ name: string; error: string }> } | { ok: false; error: string }> {
  if (candidates.length === 0) return { ok: false, error: 'no candidates selected' }
  const buffer = await fetchRepoTarball(host, preview.target, signal)
  const extracted = await extractTarball(buffer)
  const lock = readSkillLock(host) ?? {}
  const installed: Array<{ name: string }> = []
  const skipped: Array<{ name: string; error: string }> = []
  try {
    for (const candidate of candidates) {
      const result = await installOneFromExtracted(host, extracted, preview, candidate, rootLabel, lock)
      if (result.ok) installed.push({ name: result.name })
      else skipped.push({ name: candidate.name, error: result.error })
    }
  } finally {
    rmSync(extracted, { recursive: true, force: true })
  }
  if (installed.length > 0) writeSkillLock(host, lock)
  return { ok: true, installed, skipped }
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 跨版本适配、自补丁与三阶段成本有哪些限制？

**研究主题**：效果与总成本、依赖、兼容与流程、工程质量与复用

#### 完整回答

Node>=20，Cordis/schemastery，MCP SDK、yaml/tar与Web client依赖；host用结构接口避免硬导入移动的settings helper，运行时探测register/volatile并按fiber重新读配置，这是可借鉴的兼容方式。README多版本runtime验证是作者报告，本轮不继承为独立验收；固定源码未带构建字节，不执行构建。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node20+/DSH Web、依赖、技能及MCP程序 | 备份两个patch/技能根/lock，审核命令、URL与导入秘密 | 金额/安装工时未知，MCP服务独立收费/权限 |
| 持续使用 | tarball下载/临时解压、技能树hash、探测子进程与网络 | 核来源/升级差异、配置HMR与实际工具可用，管理双根同名 | 批选同仓一次下载省重复流量；无包体/解压配额，规模上限未知 |
| 失败恢复 | 备份/回收站/Git来源、重下依赖 | 对齐技能文件与lock/manifest，保留失联垃圾，恢复被重命名丢附件 | 原子rename不等目录+lock事务，恢复人时未知 |

额外mcp-client修补脚本需显式调用，不是apply自动改宿主。补丁以needle/marker字面替换，升级会覆盖需重做；stderr默认ignore减少控制台噪声也隐藏诊断，env可恢复inherit。startupWait声明0禁用但实际replacement仍race setTimeout(0)，应解释为马上放过等待，而非恢复原无限等；它只放开boot等待，后台握手继续，不等服务可用。若使用补丁要单独保官方备份并核目标字节，不能将本控制台安装称已解决所有版本启动问题。selftest覆盖fakehost路由/文件和探测脚本但未运行，断言数非本轮证据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:64-82](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/package.json#L64-L82)

依赖。

<details>
<summary>查看原文（19行）</summary>

```text
    "@deepseek-ai/schemastery": {
      "optional": true
    }
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.30.0",
    "js-yaml": "^4.1.0",
    "tar": "^7.5.22"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.1-rc.2",
    "@deepseek-ai/dsh-settings": "0.2.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.5",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^24.0.0",
    "@types/react": "~18.3.1",
    "@types/react-dom": "~18.3.1",
```

</details>

**依据 2 · 源码核查**：[src/settings.ts:126-165](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/settings.ts#L126-L165)

live设置探测。

<details>
<summary>查看原文（40行）</summary>

```text
 */
function liveSettings(ctx: Context, entry: unknown): ToolExplorerSettings {
  const fiber = (ctx as { fiber?: { config?: unknown } }).fiber
  return resolveSettings(fiber?.config ?? entry)
}

/**
 * Hand back a getter over the currently authoritative settings value.
 *
 * @param ctx - the plugin's own context; it owns any namespace registration.
 * @param entry - the config this activation received, used as the base layer
 *   for a 0.1.x namespace and as the fallback value when nothing is attached.
 * @returns a thunk re-reading the settings on every call.
 */
export function installToolExplorerSettings(
  ctx: Context,
  entry: unknown,
): () => ToolExplorerSettings {
  let source = (): ToolExplorerSettings => liveSettings(ctx, entry)
  ctx.inject(['settings'], (settingsCtx: Context) => {
    // 0.1.x only: that provider owns a namespace registry. 0.2.x replaced it
    // with SettingsForms, whose forms edit this entry's config directly, so
    // there is nothing to register and the fiber read above already wins.
    const provider = (settingsCtx as { settings?: LegacySettingsProvider }).settings
    if (provider === undefined || typeof provider.register !== 'function') return
    const scope = provider.register(TOOL_EXPLORER_SETTINGS_NS, ToolExplorerSettingsSchema, {
      base: resolveSettings(entry),
    })
    source = () => {
      try {
        return resolveSettings(scope.get())
      } catch {
        // The scope is torn down with its fiber; a request that arrives after
        // that must degrade to the config instead of failing every route.
        return liveSettings(ctx, entry)
      }
    }
  })
  return () => source()
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:40-50](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/index.ts#L40-L50)

agent懒解析。

<details>
<summary>查看原文（11行）</summary>

```text
      // Optional agent inventory, resolved LAZILY per request (never during
      // apply): a synchronous ctx.get('agents') at boot can wait for a
      // service that is still mounting and hang the whole dsh startup
      // (observed: no console output for 40+ minutes until rollback).
      agentsLookup: () => {
        try {
          return ctx.get('agents') as ReturnType<NonNullable<ToolExplorerHost['agentsLookup']>> | undefined
        } catch {
          return undefined
        }
      },
```

</details>

**依据 4 · 源码核查**：[scripts/mcp-client-patches.mjs:44-65](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/scripts/mcp-client-patches.mjs#L44-L65)

startup实际替换。

<details>
<summary>查看原文（22行）</summary>

```text
  id: 'startup-wait',
  label: 'bound the mcp-client startup wait (a down/hanging MCP server must not block the ready line)',
  marker: 'patch-mcp-client-async',
  backupSuffix: '.async.bak',
  needle:
    '\tconst outcome = await connection.ready;\n' +
    '\tif (outcome.error !== void 0 && config.failOnStartupError) throw new Error(`mcp-client(${config.serverName}): initial connection or tool synchronization failed`, { cause: outcome.error });',
  replacement:
    '\t// Local patch (patch-mcp-client-async): bound the startup wait so a\n' +
    '\t// hanging/unreachable server cannot block dsh web from finishing boot.\n' +
    '\tconst startupWaitMs = Number.parseInt(process.env.DSH_MCP_STARTUP_TIMEOUT_MS ?? "", 10);\n' +
    '\tconst startupTimeoutMs = Number.isFinite(startupWaitMs) && startupWaitMs >= 0 ? startupWaitMs : 3000;\n' +
    '\tconst outcome = await Promise.race([\n' +
    '\t\tconnection.ready,\n' +
    '\t\tnew Promise((resolve) => setTimeout(() => resolve(null), startupTimeoutMs))\n' +
    '\t]);\n' +
    '\tif (outcome !== null && outcome.error !== void 0 && config.failOnStartupError) throw new Error(`mcp-client(${config.serverName}): initial connection or tool synchronization failed`, { cause: outcome.error });',
}

/**
 * Silence stdio server stderr.
 *
```

</details>

**依据 5 · 源码核查**：[scripts/mcp-client-patches.mjs:73-83](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/scripts/mcp-client-patches.mjs#L73-L83)

stderr替换。

<details>
<summary>查看原文（11行）</summary>

```text
  id: 'stdio-stderr',
  label: 'silence stdio MCP server stderr (banners/JSON logs must not flood the dsh console)',
  marker: 'DSH_MCP_STDERR',
  backupSuffix: '.bak',
  needle: 'env: buildChildEnv(config.env),',
  replacement: `env: buildChildEnv(config.env),
			stderr: process.env.DSH_MCP_STDERR === "inherit" ? "inherit" : "ignore",`,
}

/** Every patch, in application order. */
export const MCP_CLIENT_PATCHES = [PATCH_STDIO_STDERR, PATCH_STARTUP_WAIT]
```

</details>

**依据 6 · 源码核查**：[scripts/patch-mcp-client.mjs:25-28](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/scripts/patch-mcp-client.mjs#L25-L28)

显式脚本。

```text
import { runPatches } from './mcp-client-patch.mjs'
import { MCP_CLIENT_PATCHES } from './mcp-client-patches.mjs'

process.exitCode = runPatches(MCP_CLIENT_PATCHES)
```

**依据 7 · 源码核查**：[scripts/selftest.mjs:622-655](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/scripts/selftest.mjs#L622-L655)

代表mock安装升级/回收断言。

<details>
<summary>查看原文（34行）</summary>

```text
  check('check sees no update (v1)', checkRes.status === 200 && checkRes.payload.updateAvailable === false)
  currentTarball = tarballV2
  checkRes = await call(`/dsh-tool-explorer/api/skills/alpha-skill/check`, { method: 'POST', body: {} })
  check('check sees update (v2)', checkRes.status === 200 && checkRes.payload.updateAvailable === true)

  const updated = await call(`/dsh-tool-explorer/api/skills/alpha-skill/update`, { method: 'POST', body: {} })
  check('update applies v2', updated.status === 200 && updated.payload.updated === true, JSON.stringify(updated.payload))
  const updatedText = readFileSync(join(installedDir, 'SKILL.md'), 'utf8')
  check('content replaced', updatedText.includes('Version two'))
  check('backup cleaned', !existsSync(join(userSkillsRoot, '.alpha-skill.bak')))
  const lockUpdated = JSON.parse(readFileSync(join(agentsHome, '.skill-lock.json'), 'utf8'))
  check('updatedAt refreshed on update', lockUpdated.skills['alpha-skill']?.updatedAt !== lockUpdated.skills['alpha-skill']?.installedAt)

  const conflict = await call('/dsh-tool-explorer/api/skills/install', {
    method: 'POST',
    body: {
      target: preview.payload.preview.target,
      sourceUrl: preview.payload.preview.sourceUrl,
      candidate: preview.payload.preview.candidates.find((c) => c.name === 'alpha-skill'),
      root: '~/.agents/skills',
    },
  })
  check('reinstall conflicts (409)', conflict.status === 409)

  const removed = await call('/dsh-tool-explorer/api/skills/alpha-skill', { method: 'DELETE' })
  check('uninstall moves skill to trash', removed.status === 200, JSON.stringify(removed.payload))
  check('skill dir removed from root', !existsSync(installedDir))
  const lockFinal = JSON.parse(readFileSync(join(agentsHome, '.skill-lock.json'), 'utf8'))
  check('lock entry removed, others kept', lockFinal.skills['alpha-skill'] === undefined && lockFinal.skills['echo-skill'] !== undefined)
  const trashAfterUninstall = await call('/dsh-tool-explorer/api/skills/trash')
  const alphaTrash = trashAfterUninstall.payload.items.find(item => item.name === 'alpha-skill')
  check('installed skill recoverable from trash', alphaTrash !== undefined && alphaTrash.managed === true && alphaTrash.exists === true)
  const alphaPurge = await call('/dsh-tool-explorer/api/skills/trash/purge', { method: 'POST', body: { id: alphaTrash.id } })
  check('purged from trash', alphaPurge.status === 200 && alphaPurge.payload.items.length === 0)
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 采用判断和可证伪改进方向是什么？

**研究主题**：采用判断、贡献与相对优势、新假设与验证

#### 完整回答

建议观察，受信本机管理员可研究目录展示/独立调用开关/MCP配置视图，先备份用户技能、lock和patch。已有贡献是把手工技能文件与MCP配置组织成可视的管理流程、可恢复对象和配置diff入口；不是新技能算法。关键限制包括编辑改名删附件、表单用户开关键错误、升级来源ref丢失、回收站多文件非事务和管理面仅Origin栅栏，直接在唯一技能副本/共享远程管理面使用需先解决。没有因未做宿主冒烟自动降级。

可探讨“版本绑定管理事务”。参照当前预览后重下、目录/lock分开写、optional hash，服务端固定repo commit+完整候选内容摘要，规范源和目标物理路径，所有变更有必填版本与管理身份；先stage完整目录及lock/manifest意图，提交失败保可辨认恢复态，改名迁移整个bundle，敏感字段按需取用不全量GET。对MCP显示配置版本、加载版本、探测时间/对象，不把fiber active等同验收。

反例为预览后源变更、同名异根、改名含references、flat文件、root技能更新、branch安装再HEAD更新、lock/manifest磁盘失败、两个进程编辑与purge拒删。若提交成功但文件/元数据错配或附件缺失、或未受权写仍成立，则否定事务/身份保证；新增存储/审批维护若超过减少的手工恢复则不支持经济性。未实现验证，不计入现有分数。

#### 证据与依据

**依据 1 · 源码核查**：[src/skills.ts:452-490](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills.ts#L452-L490)

改名基线。

<details>
<summary>查看原文（39行）</summary>

```text
export function updateSkill(
  host: SkillsHost,
  currentName: string,
  input: unknown,
): { ok: true; name: string } | { ok: false; errors: string[] } {
  const validated = validateSkillWrite(input)
  if (!validated.ok) return { ok: false, errors: validated.errors }
  const lock = readSkillLock(host) ?? {}
  // Resolve the current file path: registry path first, then disk scan.
  let path = diskPathFor(host, currentName)
  const userRoot = path !== null ? userRootOf(host, path) : null
  if (path === null || userRoot === null) {
    return { ok: false, errors: [`skill "${currentName}" is not editable (only ~/.agents/skills and ~/.dsh/skills skills can be edited)`] }
  }
  let dir = dirNameOf(path)
  const newDir = join(userRoot.root, validated.write.name)
  const newPath = join(newDir, 'SKILL.md')
  if (validated.write.name !== currentName && existsSync(newDir)) {
    return { ok: false, errors: [`a skill named "${validated.write.name}" already exists`] }
  }
  const text = serializeSkillFile(toFrontmatter(validated.write), validated.write.body)
  if (validated.write.name !== currentName) {
    mkdirSync(newDir, { recursive: true })
    atomicWrite(newPath, text)
    // Remove the old directory only if it is the one we manage (safe: it
    // contains only this skill's files at user root).
    try {
      rmSync(dir, { recursive: true, force: true })
    } catch {
      // leftover files are harmless; the new copy is authoritative
    }
    if (lock[currentName] !== undefined) {
      lock[validated.write.name] = lock[currentName]
      delete lock[currentName]
      writeSkillLock(host, lock)
    }
    path = newPath
  } else {
    atomicWrite(path, text)
```

</details>

**依据 2 · 源码核查**：[src/skills-install.ts:245-284](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts#L245-L284)

预览/锁来源基线。

<details>
<summary>查看原文（40行）</summary>

```text
  extracted: string,
  preview: InstallPreview,
  candidate: InstallCandidate,
  rootLabel: '~/.agents/skills' | '~/.dsh/skills',
  lock: Record<string, LockEntry>,
): Promise<{ ok: true; name: string; lock: LockEntry } | { ok: false; error: string }> {
  const target = preview.target
  const root = userSkillRoots(host).find(item => item.label === rootLabel)
  if (root === undefined) return { ok: false, error: 'unknown skill root' }
  const name = candidate.name
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name)) {
    return { ok: false, error: `skill name "${name}" is not kebab-case; the filesystem provider would reject it` }
  }
  const dest = join(root.path, name)
  if (existsSync(dest)) {
    return { ok: false, error: `a skill named "${name}" already exists in ${rootLabel}` }
  }
  const sourceDir = candidate.skillPath === '' ? extracted : join(extracted, candidate.skillPath)
  if (!existsSync(join(sourceDir, 'SKILL.md'))) {
    return { ok: false, error: `SKILL.md not found at repo path "${candidate.skillPath}"` }
  }
  // Verify the installed name matches the frontmatter (rename safety).
  const parsed = readSkillFile(join(sourceDir, 'SKILL.md'))
  if (parsed === null || parsed.frontmatter.name !== name) {
    return { ok: false, error: 'frontmatter name changed between preview and install; retry' }
  }
  mkdirSync(dest, { recursive: true })
  cpSync(sourceDir, dest, { recursive: true })
  const skillFolderHash = await computeSkillFolderHash(dest)
  const now = new Date().toISOString()
  lock[name] = {
    source: `${target.owner}/${target.repo}`,
    sourceType: 'github',
    sourceUrl: preview.sourceUrl,
    skillPath: candidate.skillPath === '' ? 'SKILL.md' : `${candidate.skillPath}/SKILL.md`,
    skillFolderHash,
    installedAt: now,
    updatedAt: now,
  }
  return { ok: true, name, lock: lock[name]! }
```

</details>

**依据 3 · 源码核查**：[src/skills-trash.ts:124-171](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts#L124-L171)

多资源顺序。

<details>
<summary>查看原文（48行）</summary>

```text
 */
export function trashSkill(host: SkillsHost, name: string): { ok: true; id: string } | { ok: false; error: string } {
  if (!isSkillName(name)) return { ok: false, error: 'invalid skill name' }
  const path = diskPathFor(host, name)
  if (path === null) return { ok: false, error: `skill "${name}" not found on disk` }
  const userRoot = userRootOf(host, path)
  if (userRoot === null) {
    return { ok: false, error: `skill "${name}" is not deletable (only ~/.agents/skills and ~/.dsh/skills skills can be deleted)` }
  }
  const kind: 'bundle' | 'file' = path.replace(/\\/gu, '/').endsWith('/SKILL.md') ? 'bundle' : 'file'
  const originalPath = kind === 'bundle' ? path.slice(0, path.length - 'SKILL.md'.length - 1) : path
  if (!existsSync(originalPath)) return { ok: false, error: `skill "${name}" is not deletable (${originalPath} missing)` }

  const id = nextTrashId(host, name)
  const lock = readSkillLock(host) ?? {}
  const snapshot = lock[name] ?? null
  if (snapshot !== null) {
    delete lock[name]
    writeSkillLock(host, lock)
  }

  mkdirSync(trashRootOf(host), { recursive: true })
  const dest = trashDirFor(host, id)
  if (kind === 'bundle') {
    moveEntry(originalPath, dest)
  } else {
    mkdirSync(dest, { recursive: true })
    moveEntry(originalPath, join(dest, `${name}.md`))
  }

  const manifest = readTrashManifest(host)
  manifest.items.push({
    id,
    name,
    source: userRoot.source,
    rootLabel: userSkillRoots(host).find(item => item.path === userRoot.root)?.label ?? userRoot.root,
    originalPath,
    kind,
    lock: snapshot,
    deletedAt: new Date().toISOString(),
  })
  writeTrashManifest(host, manifest)
  return { ok: true, id }
}

/** The browser-facing trash listing (manifest order, newest first). */
export function listTrash(host: SkillsHost): { items: TrashItemView[] } {
  const root = trashRootOf(host)
```

</details>

**依据 4 · 源码核查**：[src/mcp.ts:390-398](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts#L390-L398)

可选hash。

```text
function verifyFencing(path: string, expectedHash: string | null | undefined): string | null {
  const current = patchHash(path)
  if (expectedHash === undefined) return null
  if (current !== expectedHash) {
    return `the patch file changed since it was read (expected ${expectedHash ?? 'missing'}, found ${current ?? 'missing'}); reload and retry`
  }
  return null
}

```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
