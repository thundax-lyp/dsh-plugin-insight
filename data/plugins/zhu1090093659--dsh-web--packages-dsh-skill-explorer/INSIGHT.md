# Skill Explorer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 132,871](https://img.shields.io/static/v1?label=npm+30d&message=132%2C871&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
<!-- END META -->

> **功能**：在 DSH Web 中按来源浏览并管理 Skill，支持创建、编辑和导入。

> **亮点**：[Q02](#research-q02) 把多来源扫描与文件操作集中到 Web 界面，并在读写前重新匹配路径；它不替代宿主技能加载语义或证明节时。

> **主要限制**：[Q03](#research-q03) 表明 provider 开关只影响面板，导入可能部分完成；[Q02](#research-q02) 的编辑重建 frontmatter，可能丢失未包含的字段。

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
  - [Q01 · 面向谁及需要哪些宿主依赖？](#detail-section-11)
  - [Q02 · 用户操作如何到枚举、读取和写入？](#detail-section-12)
  - [Q03 · 路径、权限、外部来源和失败边界是什么？](#detail-section-13)
  - [Q04 · 成本效果及可证伪假设？](#detail-section-14)
  - [Q05 · 谁可试用、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向管理多个技能来源的 DSH 用户；合格操作需要核对真实文件与会话生效状态。

用户也可直接浏览技能根、编辑文件并检查版本控制差异；本轮未比较耗时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多来源列表 | 集中查看技能及来源 | preset 私有作用域可能不覆盖 |
| 创建与编辑 | 管理 Skill 文件 | 编辑重构 frontmatter，需核对未保留字段 |
| 导入 | 从目录或压缩包创建文件 | 不复制其他资源，失败可能部分完成 |
| 面板 provider 开关 | 调整面板中插件技能状态 | 不改变宿主注册或实际模型接收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 及 webServer、skills、sessions | 必需 | 注册路由并扫描技能 | 面板及 Host 路径无法正常挂载 |
| 本地或有效配对访问 | 路由必需 | 控制文件管理请求 | 不满足时拒绝 |
| 备份和可信 Skill 来源 | 正式写入前必要的使用条件 | 恢复并审阅指令 | 无法核对误写或导入内容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并建立独立测试根 | 可核对并恢复原文件 |
| 浏览 | 用户打开面板并确认来源 | 与实际目录及会话核对 |
| 编辑或导入 | 用户选择可信小样并操作 | 检查完整文件差异和附件 |
| 失败 | 用户停止写入与重试 | 核对已落盘文件并恢复备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主和文件存储资源 | 配置、备份和核对来源 | 时间未知 |
| 持续使用 | 本地读写资源 | 对照字段、附件和生效状态 | 节时未测 |
| 失败恢复 | 备份与重新导入资源 | 核对部分落盘并恢复 | 耗时与成功率未知 |
| 退出 | 保存备份所需空间 | 恢复原文件或改用手工编辑 | 不自动还原所有变更 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多来源浏览 | 扫描和注册表汇总路径 | preset 范围的完整性 |
| 文件操作 | 编辑、创建与导入代码路径 | 未知字段保留与真实宿主生效 |

> **思考**：[Q03](#research-q03) 表明 provider 开关只影响面板，导入可能部分完成；[Q02](#research-q02) 的编辑重建 frontmatter，可能丢失未包含的字段。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把多来源扫描与文件操作集中到 Web 界面，并在读写前重新匹配路径；它不替代宿主技能加载语义或证明节时。

[Q03](#research-q03) 的访问门、路径重新扫描和独占导入是局部保护；普通创建并发及部分导入、provider 开关不等同宿主权限，必须明确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明 provider 开关只影响面板，导入可能部分完成；[Q02](#research-q02) 的编辑重建 frontmatter，可能丢失未包含的字段。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议备份并在隔离根试可信小样，核对完整差异与会话；落盘或生效状态不明时停止并恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持面板扫描和文件操作；真实宿主生效、完整字段保留及效果未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-skill-explorer/README.md、packages/dsh-skill-explorer/README.zh.md、packages/dsh-skill-explorer/package.json、packages/dsh-skill-explorer/src/index.ts、packages/dsh-skill-explorer/src/client/api.ts、packages/dsh-skill-explorer/src/client/index.ts、packages/dsh-skill-explorer/src/routes.ts、packages/dsh-skill-explorer/src/collect.ts、packages/dsh-skill-explorer/src/import.ts、packages/dsh-skill-explorer/src/pair-access.ts、packages/dsh-skill-explorer/src/loopback.ts 及固定范围 inventory；组件：packages/dsh-skill-explorer。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查该子包的 Host、客户端接口、文件写入和导入边界；不审计整个 monorepo、所有上游 provider 或配对服务。
- 下一步：固定宿主与插件版本，在隔离根核对复杂 frontmatter、链接、导入附件、并发和部分失败，再检查实际会话目录。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设写前展示完整差异及导入已落盘项可减少误改，需对照误改和恢复时间，尚未验证。

固定宿主与插件版本，在隔离根核对复杂 frontmatter、链接、导入附件、并发和部分失败，再检查实际会话目录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 478 | — | — | 6400 |
| .ts | source | 23 | 3917 | 2400 | 1277 | — |
| .tsx | source | 6 | 1148 | 886 | 201 | — |
| .ts | test | 16 | 4073 | 2981 | 661 | — |
| .tsx | test | 2 | 1026 | 780 | 159 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定该 DSH 插件如何枚举、编辑和导入 Skill，以及文件写入、来源、访问控制和恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁及需要哪些宿主依赖？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

这是用于 DSH Web 的 Skill 管理插件，供维护多个来源技能的用户查看、编辑、创建和导入文件；它本身不是被管理的一个 Skill。包声明 DSH 至少 0.2.1-rc.3、web 客户端入口，Host 需要 webServer、skills、sessions。合格结果是面板所指向的文件和会话实际加载的技能一致，并可恢复误操作；仅看到列表不证明模型实际收到内容。作者说明 preset 私有作用域的技能可能不在面板范围，模型看到什么仍须检查该会话的目录。未安装或启动宿主。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/package.json:1-35](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/package.json#L1-L35)

插件包、Host/客户端入口和宿主要求。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-skill-explorer",
  "description": "DSH skill center: browse loaded skills by source (bundled / project / user / custom / runtime), enable or disable, create and delete, in a web GUI panel.",
  "version": "0.4.13",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:20-24](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/index.ts#L20-L24)

Host 必需服务。

```text
/** Stable cordis plugin name. */
export const name = 'skill-explorer'

/** Services required before the skill center routes can mount. */
export const inject = ['webServer', 'skills', 'sessions']
```

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:18-34](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/README.zh.md#L18-L34)

技能中心使用场景。

<details>
<summary>查看原文（17行）</summary>

```text
DSH Web GUI 与官方桌面客户端的**技能中心**：按来源分级浏览已加载的全部 skill，启用/禁用模型调用，创建新技能，删除技能（移入可恢复的回收站）。

## 功能

- 侧边栏「技能中心」一行（位于 shell 自己的面板列表，与插件、定时、任务看板
  并列），打开的是**原生中栏页面**，带页签栏。该行负责打开面板，打开任意会话
  （或新建对话）即让中栏回到会话正文，与官方插件页、定时任务页一致；页面自身
  不再提供「返回会话」控件。
- **技能 tab**：按来源分级展示（系统内置 / 项目 `.dsh/skills` / 项目
  `.agents/skills` / 自定义目录 / 用户 `~/.dsh/skills` / 用户
  `~/.agents/skills` / 运行时注册），顶部搜索框按技能名或描述即时过滤
  （名称命中排在前面，Esc 清空），并与工作区选择叠加生效；
  每行显示描述、适用场景、可调用标记、启用/禁用开关（改写 SKILL.md
  frontmatter 的 `disable-model-invocation`，模型目录热刷新；插件提供的文件
  没有这条可写路径，其开关改由面板自己的存储记录）、复制为模板入口（把该技能复制为
  创建表单的起点）、编辑入口与删除按钮
  （文件移入 `.trash`，可恢复）；加载进行中隐藏刷新按钮。
```

</details>

**依据 4 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:153-160](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/README.zh.md#L153-L160)

preset 作用域覆盖限制。

```text
- frontmatter 解析为零依赖轻量实现（块标量、布尔、input 嵌套块）；不支持的
  生僻 YAML 特性以官方 dsh-skill-filesystem 提供方为准。
- 面板覆盖它扫描的文件系统根，加上 `ctx.skills` 注册表的全局层（bundled 与
  runtime 条目）。配在 host 平面 `skill-filesystem` 行上的 `customSkillDirs`
  会被扫描，因为宿主会读取该行配置；仅通过**某个 agent preset 自己的**
  `customSkillDirs` 或 preset 作用域提供方到达 agent 的技能不在此覆盖范围内，
  因为面板读取注册表时不带 viewing scope。因此面板里没有的技能，不一定模型也没有：
  会话能加载什么，以官方 `skill` 工具目录为准。
```

#### 缺口

- 目标宿主和具体会话的 Skill 注册与面板是否一致
  **影响**：影响用户能否安全管理实际生效的指令
  **进一步探讨**：在隔离 profile 对照面板和会话技能目录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 用户操作如何到枚举、读取和写入？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host apply 收集用户根、配置根、活动工作区和注册表，创建路由并注册到 WebServer；浏览器客户端请求 list 或提交 create、update。list 调用 collectSkills 并返回分组，read/update 将客户端的 name 与 path 作为声明，经最新扫描匹配才读取或写入。update 保留读取到的禁用标记后调用 overwriteSkillFile；实现会重新构造 frontmatter 与正文写回文件，除 name、description、whenToUse 和禁用标记外的原字段没有在该重构中保留。相比手工遍历多个根，它将列表与文件操作集中在面板；这不改变宿主技能加载语义，也不能证明会话实际效果或节省时间。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:63-67](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/index.ts#L63-L67)

解析根目录。

```text
function applyImpl(ctx: Context, config?: Config): void {
  if (config?.enabled === false) return
  const skillCtx = ctx as unknown as SkillContext
  const dshHome = config?.dshHome ?? process.env.DSH_HOME ?? homedir() + sep + '.dsh'
  const agentsHome = config?.agentsHome ?? process.env.DSH_AGENTS_HOME ?? homedir() + sep + '.agents'
```

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/index.ts:105-119](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/index.ts#L105-L119)

构造并注册路由。

<details>
<summary>查看原文（15行）</summary>

```text
  const routes = makeRoutes(ctx, {
    dshHome,
    agentsHome,
    customSkillDirs,
    registry: skillCtx.skills,
    activeSessionCwds,
    logger: { warn: (error: unknown) => ctx.logger.warn(error) },
  })

  ctx.effect(() => {
    const disposers = routes.map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'skill-explorer: routes')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/client/api.ts:125-137](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/client/api.ts#L125-L137)

客户端列表与开关请求。

<details>
<summary>查看原文（13行）</summary>

```text
/** Skill center API client. */
export class SkillApi {
  /** Fetch the grouped skill list. */
  async list(cwd?: string): Promise<ListPayload> {
    const url = typeof cwd === 'string' && cwd.trim() !== ''
      ? `${API.list}?cwd=${encodeURIComponent(cwd)}`
      : API.list
    return this.request<ListPayload>(url)
  }

  /** Enable or disable a skill (rewrites disable-model-invocation). */
  async setEnabled(name: string, path: string, enabled: boolean): Promise<{ name: string; enabled: boolean; modelInvocable: boolean; path?: string }> {
    return this.request(API.setEnabled, { method: 'POST', body: { name, path, enabled } })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/client/api.ts:153-165](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/client/api.ts#L153-L165)

客户端创建、读取、更新路径。

<details>
<summary>查看原文（13行）</summary>

```text
  /** Create a skill file under the user or project root. */
  async create(payload: { root: 'user' | 'project'; name: string; description: string; whenToUse?: string; content: string; cwd: string }): Promise<{ ok: true; name: string; path: string }> {
    return this.request(API.create, { method: 'POST', body: payload })
  }

  /** One skill's editable fields and body, resolved from the panel's path. */
  async read(name: string, path: string): Promise<{ name: string; path: string; description: string; whenToUse?: string; content: string }> {
    return this.request(`${API.read}?name=${encodeURIComponent(name)}&path=${encodeURIComponent(path)}`)
  }

  /** Rewrite an existing skill file in place (name and location unchanged). */
  async update(payload: { name: string; path: string; description: string; whenToUse?: string; content: string }): Promise<{ ok: true; name: string; path: string; disabled: boolean }> {
    return this.request(API.update, { method: 'POST', body: payload })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:236-250](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L236-L250)

列表扫描并构造响应。

<details>
<summary>查看原文（15行）</summary>

```text
  const routes: WebRoute[] = [
    {
      kind: 'exact',
      path: ROUTES.list,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'GET')) return
        try {
          const url = new URL(req.url ?? '/', 'http://x')
          // Project root base: explicit ?cwd= first, then active session
          // workspaces, process.cwd() last (panelCwd owns that order, and the
          // write routes resolve their workspace through the same helper).
          const cwd = panelCwd(queryParam(url, 'cwd'))
          const projectRoots = sessionProjectRoots()
          const { skills, complete } = await collectSkills(await collectOptions(cwd))
          writeJson(res, 200, buildPayload(skills, complete, cwd, [...new Set(projectRoots)]))
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:217-233](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L217-L233)

按最新扫描比对路径。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Resolve the exact file the panel showed, rejecting stale same-name fallbacks. */
  const resolveScannedSkill = async (
    name: string,
    expectedPath: string,
    cwd: string,
    res: ServerResponse,
  ): Promise<(SkillEntry & { path: string }) | undefined> => {
    const skill = await findSkill(name, cwd)
    if (skill?.path === undefined) {
      writeJson(res, 404, { error: `skill ${name} has no editable file` })
      return undefined
    }
    if (skill.path !== expectedPath) {
      writeJson(res, 409, { error: `skill ${name} changed since the panel loaded; refresh and retry` })
      return undefined
    }
    return skill as SkillEntry & { path: string }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:475-514](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L475-L514)

输入检查、链接拒绝、读取禁用标志并写入。

<details>
<summary>查看原文（40行）</summary>

```text
      path: ROUTES.update,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req, { maxBytes: 128 * 1024, objectOnly: true })
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
          }
          const payload = body as Record<string, unknown>
          const { name, path, description, whenToUse, content } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '') {
            writeJson(res, 400, { error: 'expected { name, path, description, content }' })
            return
          }
          if (typeof description !== 'string' || description.trim() === '') {
            writeJson(res, 400, { error: 'description is required' })
            return
          }
          if (typeof content !== 'string' || content.trim() === '') {
            writeJson(res, 400, { error: 'content is required' })
            return
          }
          if (Buffer.byteLength(content, 'utf8') > 64 * 1024) {
            writeJson(res, 400, { error: 'content exceeds 64KB limit' })
            return
          }
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink: rewriting it would edit a
          // file outside this skill root, so the panel must not offer it.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be edited` })
            return
          }
          // The enabled state is not part of the edit form: carry it over so an
          // edit never silently re-enables a disabled skill.
          const disabled = parseFrontmatter(readFileSync(skill.path, 'utf8')).disableModelInvocation === true
          const target = await overwriteSkillFile(skill.path, name, description.trim(), typeof whenToUse === 'string' ? whenToUse : undefined, content, disabled)
          writeJson(res, 200, { ok: true, name, path: target, disabled })
```

</details>

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:568-594](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/collect.ts#L568-L594)

重构 frontmatter 和原地覆盖。

<details>
<summary>查看原文（27行）</summary>

```text
/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
```

</details>

#### 缺口

- 重写后复杂 frontmatter 与宿主实际语义是否保留
  **影响**：可能改变技能配置或行为
  **进一步探讨**：对备份的复杂文件对照修改前后字节并在会话中确认

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径、权限、外部来源和失败边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

每条路由先检查本机回环或已配对设备以及方法；回环还检查连接地址、Host、转发头和跨站标记，这不是对所有部署方式的安全证明。编辑和删除拒绝扫描标记为链接的技能；启闭路径没有同样拒绝，作者说明目录链接会作用于目标，而单文件符号链接的原子改写可能替换链接自身。导入对压缩包数量和大小有限制，使用独占创建避免覆盖已有目标；逐项写入不是整体事务，后续失败时前面文件仍在。普通创建先检查存在再普通写入，检查和写入不是同一原子动作，并发时不能保证不覆盖。作者说明 zip 只取 SKILL.md 不带其他资源，插件提供技能的开关只影响面板视图而非宿主注册，因此不能当作权限禁用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:130-140](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L130-L140)

路由访问与方法门控。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Guard helper: fence + method check. */
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isSkillExplorerAllowed(ctx, req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/pair-access.ts:33-40](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/pair-access.ts#L33-L40)

回环或配对决定。

```text
 * Whether this request may enter the plugin's host routes.
 * @param ctx - host context; may expose remoteWebUiPairing.
 * @param request - the incoming HTTP request.
 * @returns true for loopback, or a live paired-device cookie.
 */
export function isPairedOrLoopbackAllowed(ctx: LookupCtx, request: IncomingMessage): boolean {
  if (isLoopbackRequest(request)) return true
  return lookupPairing(ctx)?.isPairedDevice(request) === true
```

**依据 3 · 源码核查**：[packages/dsh-skill-explorer/src/loopback.ts:65-91](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/loopback.ts#L65-L91)

回环、Host 和来源检查。

<details>
<summary>查看原文（27行）</summary>

```text
 * Request-level trust fence: a loopback socket address AND a loopback Host
 * header, plus browser same-origin markers. The socket address is
 * authoritative for a direct connection; a request that carries a forwarding
 * header is refused outright, because a proxy in front of the host makes both
 * the socket address and the Host header describe the proxy rather than the
 * client. X-Forwarded-For is therefore never evidence *for* loopback.
 */
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:502-514](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L502-L514)

编辑拒绝链接并重写。

<details>
<summary>查看原文（13行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink: rewriting it would edit a
          // file outside this skill root, so the panel must not offer it.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be edited` })
            return
          }
          // The enabled state is not part of the edit form: carry it over so an
          // edit never silently re-enables a disabled skill.
          const disabled = parseFrontmatter(readFileSync(skill.path, 'utf8')).disableModelInvocation === true
          const target = await overwriteSkillFile(skill.path, name, description.trim(), typeof whenToUse === 'string' ? whenToUse : undefined, content, disabled)
          writeJson(res, 200, { ok: true, name, path: target, disabled })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:538-548](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L538-L548)

删除拒绝链接并移入回收路径。

<details>
<summary>查看原文（11行）</summary>

```text
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // A linked skill lives behind a symlink (mount-of-intent content, not
          // created under this root). Deleting it would move the target's real
          // SKILL.md out of place, escaping this skill root — refuse deletion.
          if (skill.linked === true) {
            writeJson(res, 400, { error: `skill ${name} is a linked skill and cannot be deleted` })
            return
          }
          const moved = await trashSkillFile(skill.path)
          writeJson(res, 200, { ok: true, name, moved })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:292-312](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/routes.ts#L292-L312)

启闭路径未执行相同链接拒绝。

<details>
<summary>查看原文（21行）</summary>

```text
      path: ROUTES.setEnabled,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req, { maxBytes: 128 * 1024, objectOnly: true })
          if (body === null) {
            writeJson(res, 400, { error: 'invalid JSON body' })
            return
          }
          const payload = body as Record<string, unknown>
          const { name, path, enabled } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '' || typeof enabled !== 'boolean') {
            writeJson(res, 400, { error: 'expected { name, path, enabled }' })
            return
          }
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', enabled ? false : true)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:577-583](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/collect.ts#L577-L583)

普通创建的存在检查与写入分离。

```text
/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
```

**依据 8 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:369-399](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/import.ts#L369-L399)

导入逐项写入、独占创建及部分完成。

<details>
<summary>查看原文（31行）</summary>

```text

/**
 * Write the planned candidates into one skill root. Every write is a new file:
 * an existing SKILL.md is never overwritten, and a failure after the first
 * file leaves the earlier imports in place (each one is individually valid and
 * the panel simply lists them — the report says which succeeded).
 * @param plan - the plan from planImport.
 * @param baseDir - the target skill root.
 * @returns one outcome per plan item, in plan order.
 */
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
```

</details>

**依据 9 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:161-171](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/README.zh.md#L161-L171)

provider 开关、符号链接及导入资源的边界。

<details>
<summary>查看原文（11行）</summary>

```text
- **「由插件提供」**行的开关是**仅本面板生效**的视图决定：它改变的是本面板
  列出的可调用状态，宿主注册表照旧加载该技能，模型仍会收到它。要真正让这类
  技能不再进入模型，需要在它的 provider 获取它的位置（插件配置或随包文件）
  移除或停用它。
- 链接技能不可删除、不可编辑（见安全模型）；启用/禁用对链接技能正常（改写目标
  `SKILL.md` frontmatter）。目录型与「单文件」链接都能正常列出；「单文件」
  符号链接（指向单个 `.md`）在原子改写（rename）时会被替换为一个普通文件
  （链接不再保留），目标文件本身不受影响。
- 目录导入只读取一层、不递归：嵌套的目录树需要指向真正存放技能的那个目录。
  `.zip` 导入接受任意深度的 `SKILL.md`，因此「把技能目录压缩成包」可用，但压缩包里的
  其他文件会被忽略，而不会作为资源一并复制。
```

</details>

#### 缺口

- 高并发、文件系统替换及远程部署时实际风险
  **影响**：影响写入目标和访问边界
  **进一步探讨**：在隔离测试根验证并发、链接与访问，遇异常先停写核对文件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本效果及可证伪假设？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

首次使用需要兼容宿主、配置和备份；持续成本包括检查来源优先级、手动核对修改差异、Skill 附件和真实会话状态。导入失败后可能需要核对已创建项，不能盲目重试。没有同任务对照或人工时间数据证明面板节时。可提出未验证假设：写入前提供完整字节差异和 frontmatter 丢失提示，并在部分导入失败时展示已落盘项，可能减少误改和重复操作；代价是界面及并发核对复杂度。用隔离文件对比现有与改进流程，记录误改率、恢复时间和误导提示，效果不升或提示与实际落盘不符即否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:568-594](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/collect.ts#L568-L594)

编辑重建元数据及写回。

<details>
<summary>查看原文（27行）</summary>

```text
/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:369-399](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/import.ts#L369-L399)

导入可部分完成。

<details>
<summary>查看原文（31行）</summary>

```text

/**
 * Write the planned candidates into one skill root. Every write is a new file:
 * an existing SKILL.md is never overwritten, and a failure after the first
 * file leaves the earlier imports in place (each one is individually valid and
 * the panel simply lists them — the report says which succeeded).
 * @param plan - the plan from planImport.
 * @param baseDir - the target skill root.
 * @returns one outcome per plan item, in plan order.
 */
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
```

</details>

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:169-173](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/README.zh.md#L169-L173)

附件未导入及同名冲突。

```text
- 目录导入只读取一层、不递归：嵌套的目录树需要指向真正存放技能的那个目录。
  `.zip` 导入接受任意深度的 `SKILL.md`，因此「把技能目录压缩成包」可用，但压缩包里的
  其他文件会被忽略，而不会作为资源一并复制。
- 导入的同名技能若已在同级或更强来源解析，会报告为跳过（`exists` / `shadowed`）
  而不是替换该技能；要把这样的名字导入进来，需要先给候选改名。
```

#### 缺口

- 真实维护任务的耗时、错误率与恢复成本
  **影响**：无法判断单位合格操作是否更省
  **进一步探讨**：用相同备份样本比较人工与面板操作，并记录修复时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用、何时退出？

**研究主题**：采用判断

#### 完整回答

能够备份 Skill 目录并核对完整差异的 DSH 用户，可先在独立测试根编辑简单 Skill 或导入可信小样。相对手工找多个目录，它能把来源与操作集中展示；复杂 frontmatter、附件、链接和 provider 状态须通过真实文件及会话另行核查。出现字段丢失、目标路径或生效状态不明、导入失败时应停止写入和重试，先检查实际落盘及备份，恢复原文件并用原有编辑方式处理。需要强制关闭 provider 技能的人应修改真实 provider 配置，而非只依赖面板开关。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-skill-explorer/src/collect.ts:568-594](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/collect.ts#L568-L594)

编辑会重建 frontmatter。

<details>
<summary>查看原文（27行）</summary>

```text
/** Build the new skill file content (create route). */
export function buildSkillContent(name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): string {
  const lines = ['---', `name: ${name}`, `description: ${yamlQuote(description.replace(/[\r\n]/gu, ' '))}`]
  if (typeof whenToUse === 'string' && whenToUse.trim() !== '') lines.push(`whenToUse: ${yamlQuote(whenToUse.replace(/[\r\n]/gu, ' '))}`)
  if (disabled === true) lines.push('disable-model-invocation: true')
  lines.push('---', '', content.trim(), '')
  return lines.join('\n')
}

/** Create a skill file (mkdir -p + write). Returns the absolute target path. */
export async function writeSkillFile(baseDir: string, name: string, description: string, whenToUse: string | undefined, content: string): Promise<string> {
  const targetDir = join(baseDir, name)
  const target = join(targetDir, 'SKILL.md')
  if (existsSync(target)) throw new Error(`skill ${name} already exists at ${target}`)
  await mkdir(targetDir, { recursive: true })
  await writeFile(target, buildSkillContent(name, description.trim(), whenToUse, content, false), 'utf8')
  return target
}

/**
 * Overwrite an existing skill file in place (edit route). The caller has
 * already resolved the path through a fresh scan, and the enabled state is
 * carried over so an edit never silently re-enables a disabled skill.
 */
export async function overwriteSkillFile(path: string, name: string, description: string, whenToUse: string | undefined, content: string, disabled: boolean): Promise<string> {
  await writeFile(path, buildSkillContent(name, description.trim(), whenToUse, content, disabled), 'utf8')
  return path
```

</details>

**依据 2 · 源码核查**：[packages/dsh-skill-explorer/src/import.ts:369-399](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/src/import.ts#L369-L399)

失败前的已写文件保留。

<details>
<summary>查看原文（31行）</summary>

```text

/**
 * Write the planned candidates into one skill root. Every write is a new file:
 * an existing SKILL.md is never overwritten, and a failure after the first
 * file leaves the earlier imports in place (each one is individually valid and
 * the panel simply lists them — the report says which succeeded).
 * @param plan - the plan from planImport.
 * @param baseDir - the target skill root.
 * @returns one outcome per plan item, in plan order.
 */
export async function executeImport(plan: readonly ImportPlanItem[], baseDir: string): Promise<ImportOutcome[]> {
  const outcomes: ImportOutcome[] = []
  for (const item of plan) {
    const { candidate } = item
    if (item.decision === 'skip') {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: item.reason })
      continue
    }
    const targetDir = join(baseDir, candidate.name)
    const target = join(targetDir, 'SKILL.md')
    if (existsSync(target)) {
      outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'skipped', reason: 'exists' })
      continue
    }
    // The name is a validated kebab-case skill name, so this can only ever
    // create one directory directly under the target root. The write itself
    // uses O_EXCL ('wx'), so two concurrent imports of the same name cannot
    // both win even if both pass the existsSync check above.
    await mkdir(targetDir, { recursive: true })
    await writeFile(target, candidate.content, { encoding: 'utf8', flag: 'wx' })
    outcomes.push({ name: candidate.name, origin: candidate.origin, status: 'imported', path: target })
```

</details>

**依据 3 · 作者声明**：[packages/dsh-skill-explorer/README.zh.md:161-171](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-skill-explorer/README.zh.md#L161-L171)

面板开关及附件、链接限制。

<details>
<summary>查看原文（11行）</summary>

```text
- **「由插件提供」**行的开关是**仅本面板生效**的视图决定：它改变的是本面板
  列出的可调用状态，宿主注册表照旧加载该技能，模型仍会收到它。要真正让这类
  技能不再进入模型，需要在它的 provider 获取它的位置（插件配置或随包文件）
  移除或停用它。
- 链接技能不可删除、不可编辑（见安全模型）；启用/禁用对链接技能正常（改写目标
  `SKILL.md` frontmatter）。目录型与「单文件」链接都能正常列出；「单文件」
  符号链接（指向单个 `.md`）在原子改写（rename）时会被替换为一个普通文件
  （链接不再保留），目标文件本身不受影响。
- 目录导入只读取一层、不递归：嵌套的目录树需要指向真正存放技能的那个目录。
  `.zip` 导入接受任意深度的 `SKILL.md`，因此「把技能目录压缩成包」可用，但压缩包里的
  其他文件会被忽略，而不会作为资源一并复制。
```

</details>

#### 缺口

- 实际宿主中配置和恢复是否符合预期
  **影响**：决定能否管理正式技能
  **进一步探讨**：先在隔离 profile 比较原文件、备份与真实会话目录

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
