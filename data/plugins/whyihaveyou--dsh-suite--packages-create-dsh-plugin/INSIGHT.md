# create-dsh-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 350](https://img.shields.io/static/v1?label=npm+30d&message=350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/create-dsh-plugin) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/create-dsh-plugin)
<!-- END META -->

> **功能**：生成五类 DSH 插件骨架并提供编译与配置检查的开发者命令行工具

> **亮点**：[Q01](#research-q01) 把五类接线和生命周期示例、版本选择与社区命名声明集中到CLI，减少手抄遗漏；[Q04](#research-q04) verify是编译/配置检查，不能称行为验收。

> **主要限制**：[Q03](#research-q03) preset删除id未限目录、webui直接覆盖写文件且卡片显示创建，生成物必须人工修补；[Q04](#research-q04) 字符串dump-config检查不能证明工具/UI/清理已工作。

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
  - [Q01 · 脚手架为谁解决什么，是否等于成品插件？](#detail-section-11)
  - [Q02 · 版本、命名和生成如何工作，失败如何留下文件？](#detail-section-12)
  - [Q03 · 模板中哪些边界必须开发者修补？](#detail-section-13)
  - [Q04 · --verify实际证明什么，采用和退出成本是什么？](#detail-section-14)
  - [Q05 · 什么改进能把示例变为可靠起点？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH插件开发者需要带接线示例的起始工程，见 [Q01](#research-q01)。

参照从文档和示例手工复制包、patch、工具和Web注册，复用DSH接口和tsc；没有新插件执行引擎或业务算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 五模板 | tool/events/webui/panel/preset-pack骨架 | 业务逻辑需实现，写删模板须修补 |
| tag解析 | 精确写入当次版本 | offline fallback不证明兼容 |
| 命名清单 | 社区坐标声明 | 非ID预留 |
| verify | 安装/编译/profile配置检查 | 未实际调用或UI验收 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
|---|---|---|
| Node ^22.19或≥24 | CLI | 无运行npm依赖不等于不联网 |
| npm registry | tag解析/依赖 | 失败用内置旧版，兼容未知 |
| npm/pnpm、npx DSH | 可选verify | npx未精确锁版，执行生命周期 |
| tools/webServer等宿主服务 | 生成物运行 | 各模板不同，生成成功非接线验收 |

#### 启动步骤

| 步骤 | 动作 | 验收/恢复 |
|---|---|---|
| 准备 | 新空目录，明确模板与版本 | 错模板可能回落tool，核实际结果 |
| 生成 | 检查所有文件/patch/命名 | 部分失败先人工核查再清理 |
| 修改 | 修路径/覆盖边界，写业务逻辑 | preset删除不得保留原样 |
| 验收 | 分层编译、配置、实际行为/卸载/回放 | verify只前两层 |
| 退出 | 未安装时删新目录；安装后清profile | 业务已写删文件不自动恢复 |

**效果与成本**

#### 成本

| 阶段 | 资源现金 | 人工时间与未知 |
|---|---|---|
| 首次 | 网络/包缓存/构建空间 | 模板选择、代码审阅与实现，金额工时未知 |
| 持续 | 更新宿主与依赖 | 易变接口兼容维护，净节省未测 |
| 失败 | 半成品、node_modules及临时home | 清理和写删恢复，可能无备份 |
| 退出 | 新目录/profile/缓存保留 | 分开清理，副作用不自动回滚 |

#### 效果

| 效果 | 支持 | 未知 |
|---|---|---|
| 接线学习 | 五模板和effect示例 | 新人开发成功率/节时 |
| 编译配置 | verify流程存在 | 当前实际执行与宿主行为 |
| 安全可部署 | 已识别路径/写入边界缺口 | 外层宿主认证与实际可达性 |
| 命名 | 可选清单规范化 | 社区接受与占用情况 |

> **思考**：[Q03](#research-q03) preset删除id未限目录、webui直接覆盖写文件且卡片显示创建，生成物必须人工修补；[Q04](#research-q04) 字符串dump-config检查不能证明工具/UI/清理已工作。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把五类接线和生命周期示例、版本选择与社区命名声明集中到CLI，减少手抄遗漏；[Q04](#research-q04) verify是编译/配置检查，不能称行为验收。

拒绝非空目录、effect清理与可回放meta提供具体示范；错误模板静默回落、逐文件非事务、可变npx宿主和字符串verify削弱可重复验收。模板的host文件操作继承进程权限，生成器不能提供额外沙箱。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) preset删除id未限目录、webui直接覆盖写文件且卡片显示创建，生成物必须人工修补；[Q04](#research-q04) 字符串dump-config检查不能证明工具/UI/清理已工作。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，见 [Q04](#research-q04)。可先只读学习tool/events接线；在新空目录审阅生成物并修复写删边界，补真实行为/卸载验收后再考虑安装。verify通过不足以扩大到正式profile，出现越界/覆盖或假验收立即停止并恢复备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持骨架生成和配置检查；写删模板有具体危险路径、验证结论过强，本轮没有目标执行。

- 已检查：作者 README、包清单、源码路径 packages/create-dsh-plugin/src/cli.js、packages/create-dsh-plugin/templates/tool/src/index.ts、packages/create-dsh-plugin/templates/events/src/index.ts、packages/create-dsh-plugin/src/util.js、packages/create-dsh-plugin/src/generate.js、packages/create-dsh-plugin/src/naming.js、packages/create-dsh-plugin/templates/preset-pack/src/index.ts、packages/create-dsh-plugin/templates/webui/src/index.ts、packages/create-dsh-plugin/src/verify.js、packages/create-dsh-plugin/package.json 及固定范围 inventory；组件：packages/create-dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取CLI、生成器、util版本/进程、verify、命名及五类模板关键Host实现；未完整审浏览器脚本、向导与全部测试。只研究组件，不把同仓其他插件贡献并入。
- 下一步：仅固定源码检查，未执行脚手架、npm查询、install/build或verify；危险路径为静态数据流判断，未利用或删除任何目标文件。

**分析版本**

- **仓库**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)
- **版本号**：0.2.3（[固定提交 3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证的安全默认与分层行为契约：限定文件归属和边界、固定宿主版、逐模板实际调用和回放，以越界/旧文件/假配置反例否定。

仅固定源码检查，未执行脚手架、npm查询、install/build或verify；危险路径为静态数据流判断，未利用或删除任何目标文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 385 | — | — | 2933 |
| .js | source | 10 | 884 | 723 | 88 | — |
| .ts | source | 5 | 392 | 248 | 106 | — |
| .mjs | test | 1 | 207 | 181 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/whyihaveyou/dsh-suite/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分生成便利、模板安全与真实行为验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 脚手架为谁解决什么，是否等于成品插件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

create-dsh-plugin是开发者CLI基础工具，不是模型可调用插件。相对手抄示例，它提供tool、events、webui、panel、preset-pack五类模板，填包名/插件名/工具名、版本和坑点说明，帮助开发者先搭可修改骨架。tool注册defineTool；events展示监听/next与effect清理；webui展示可回放卡片；panel展示host route/browser分工；preset-pack展示用户预设复制。贡献是重复接线知识的组织，继承DSH接口与TypeScript能力，不提供业务任务逻辑。五类模板成熟度不同，不能因一项能生成就推全部安全可部署。

#### 证据与依据

**依据 1 · 源码核查**：[packages/create-dsh-plugin/src/cli.js:21-83](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/cli.js#L21-L83)

解析CLI并按模板生成后可选verify。

<details>
<summary>查看原文（63行）</summary>

```text
async function main() {
  const { targetDir, flags } = parseArgs(process.argv.slice(2))

  if (flags.help) { console.log(HELP); return }
  if (flags.version) { console.log(version()); return }

  let cfg = {
    targetDir,
    name: flags.name,
    template: flags.template,
    pluginId: flags['plugin-id'],
    toolName: flags['tool-name'],
    registryOwner: flags['registry-owner'],
    registryName: flags['registry-name'],
    verify: flags.verify === true ? true : undefined,
    skipInstall: flags['skip-install'] === true,
  }

  // Non-interactive: enough info OR --yes. Otherwise run the bilingual wizard.
  const needWizard = !cfg.targetDir || !cfg.template
  if (needWizard && !flags.yes) {
    cfg = await runWizard(cfg)
  }

  if (!cfg.targetDir) {
    console.error(err('✘ 需要项目目录 / a project directory is required (or use the wizard)'))
    process.exit(1)
  }
  cfg.template = cfg.template && TEMPLATES.includes(cfg.template) ? cfg.template : 'tool'
  if (!TEMPLATES.includes(cfg.template)) {
    console.error(err(`✘ 未知模板 / unknown template: ${cfg.template} (choose ${TEMPLATES.join('|')})`))
    process.exit(1)
  }

  try {
    // Fill remaining fields with safe defaults (bilingual note).
    cfg.name = cfg.name || pkgNameFromDir(cfg.targetDir)
    if (cfg.registryName && !cfg.registryOwner) {
      throw new Error('--registry-name requires --registry-owner')
    }
    const meta = TEMPLATE_META[cfg.template]
    const registryIdentity = cfg.registryOwner
      ? registryIdentityFromPackage(cfg.name, cfg.registryOwner, cfg.registryName)
      : null
    if (registryIdentity) {
      cfg.registryOwner = registryIdentity.namespace
      cfg.registryName = registryIdentity.name
    }
    cfg.pluginId = cfg.pluginId || registryIdentity?.loaderId || pluginIdFromPkg(cfg.name)
    if (meta.asksToolName) cfg.toolName = cfg.toolName || registryIdentity?.toolName || toolNameFromPkg(cfg.name)
    cfg.verify = cfg.verify === true

    const result = await generate(cfg)

    if (cfg.verify) {
      const pass = await verify(result)
      if (!pass) process.exit(1)
    }

    console.log(`\n${info('下一步 / Next steps:')}`)
    const addSpec = /^([/]|[A-Za-z]:[\\/])/.test(cfg.targetDir) ? cfg.targetDir : `./${cfg.targetDir}`
    console.log(paint(c.dim, `  cd ${cfg.targetDir}`))
    if (!cfg.skipInstall) console.log(paint(c.dim, '  pnpm install && pnpm run build'))
```

</details>

**依据 2 · 源码核查**：[packages/create-dsh-plugin/templates/tool/src/index.ts:16-29](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/templates/tool/src/index.ts#L16-L29)

defineTool注册入口。

<details>
<summary>查看原文（14行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

// Plugin display name, shown in loader diagnostics.
export const name = '{{PLUGIN_ID}}'

// Wait until the host's tool registry (`ctx.tools`) is ready before running.
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    // The name the model uses to call this tool.
    name: '{{TOOL_NAME}}',
    // What the model sees — keep it task-relevant.
```

</details>

**依据 3 · 源码核查**：[packages/create-dsh-plugin/templates/events/src/index.ts:16-62](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/templates/events/src/index.ts#L16-L62)

事件与effect清理示例。

<details>
<summary>查看原文（47行）</summary>

```text
  let toolChanges = 0
  let toolPreExecutes = 0

  // ① Durable session firehose (emit): fires whenever a session's log grows —
  //    turn/step boundaries, user/assistant messages, tool results, …
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    sessionEvents += 1
    if (sessionEvents <= 5 || sessionEvents % 25 === 0) {
      console.log(
        `[{{PLUGIN_ID}}] session/event #${sessionEvents} type=${event.type} session=${String(session.id)}`,
      )
    }
  })

  // ② Live registry change (emit): fires the moment any tool is registered or
  //    unregistered — including by sibling plugins in the same composition.
  ctx.on('tools/change', () => {
    toolChanges += 1
    console.log(`[{{PLUGIN_ID}}] tools/change #${toolChanges}`)
  })

  // ③ Tool execution pipeline (waterfall): log, then delegate with next().
  //    NOT calling next() would short-circuit and block the tool call.
  ctx.on('tools/pre-execute', (exec: ToolExecution, next: () => Promise<PreToolDecision>) => {
    toolPreExecutes += 1
    console.log(`[{{PLUGIN_ID}}] tools/pre-execute #${toolPreExecutes} tool=${exec.name}`)
    return next()
  })

  // ④ ctx.on() is already an EFFECT (auto-disposed on unload). For a resource
  //    Cordis does NOT manage (a timer/connection/watcher), wrap it in
  //    ctx.effect() and return a disposer — the reversible-cleanup proof:
  //    unload this plugin and watch the DISPOSED line print.
  ctx.effect(() => {
    const timer = setInterval(() => {
      console.log(
        `[{{PLUGIN_ID}}] heartbeat sessionEvents=${sessionEvents} toolPreExecutes=${toolPreExecutes} toolChanges=${toolChanges}`,
      )
    }, 30_000)
    return () => {
      clearInterval(timer)
      console.log(`[{{PLUGIN_ID}}] DISPOSED — listeners removed, timer cleared`)
    }
  })

  console.log(`[{{PLUGIN_ID}}] listeners registered: session/event + tools/change + tools/pre-execute`)
}
```

</details>

#### 缺口

- 当前提交没有本次生成、安装或宿主行为执行。
  **影响**：不能声称模板可安全部署或节省具体工时。
  **进一步探讨**：先修边界，再在隔离目录逐模板执行反例与回放验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本、命名和生成如何工作，失败如何留下文件？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

generate先并行npm view取next/latest tags，失败用内置rc.6等默认值；精确写入单包版本只能固定当次解析值，不证明多包组合互相兼容。目标非空拒绝覆盖，但这是一次预检查，之后按文件顺序替换文本写入，非事务，写到一半异常留下半成品，下一次非空拒绝需要人工核查清理。CLI将不在TEMPLATES的值直接回落tool，后续unknown-template判断因此不可达，错误模板名可能默默生成tool。registry-owner可选命名清单明确是社区声明，不是ID预留；带owner时校验npm/slug/工具名，不能扩展为所有手写参数都已转义安全。普通generate也访问npm；零npm运行依赖不等于离线生成。

#### 证据与依据

**依据 1 · 源码核查**：[packages/create-dsh-plugin/src/util.js:57-91](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/util.js#L57-L91)

npm tag并行查找及静态fallback。

<details>
<summary>查看原文（35行）</summary>

```text
 * Resolve the CURRENT `next`-tag versions of the harness packages from npm.
 * This is the whole point of the scaffold: npm's `latest` dist-tag for
 * `@deepseek-ai/dsh-tools` is a STALE 0.0.1-rc.1; the real line lives under
 * the `next` tag (0.1.0-rc.x). We pin the resolved value EXACTLY so generated
 * projects never drift onto a broken/old version.
 * Falls back to bundled defaults when offline so a plain `generate` never fails.
 */
export async function resolveDshVersions() {
  const defaults = {
    dshTools: '0.1.0-rc.6',
    dshSession: '0.1.0-rc.6',
    cordis: '4.0.1',
    schemastery: '3.18.1',
    dsh: '0.1.0-rc.6',
  }
  const tag = async (pkg, tagName, fallback) => {
    // npm view <pkg> dist-tags.next  ->  "0.1.0-rc.6\n"
    const r = await run('npm', ['view', pkg, `dist-tags.${tagName}`, '--json'], { timeout: 15000 })
    if (r.code !== 0) return fallback
    try {
      const parsed = JSON.parse(r.stdout.trim())
      const v = typeof parsed === 'string' ? parsed : parsed[tagName]
      return v && typeof v === 'string' ? v : fallback
    } catch { return fallback }
  }
  const [dshTools, dshSession, cordis, schemastery, dsh] = await Promise.all([
    tag('@deepseek-ai/dsh-tools', 'next', defaults.dshTools),
    tag('@deepseek-ai/dsh-session', 'next', defaults.dshSession),
    tag('@deepseek-ai/cordis', 'latest', defaults.cordis),
    tag('@deepseek-ai/schemastery', 'latest', defaults.schemastery),
    tag('@deepseek-ai/dsh', 'next', defaults.dsh),
  ])
  return { dshTools, dshSession, cordis, schemastery, dsh }
}

```

</details>

**依据 2 · 源码核查**：[packages/create-dsh-plugin/src/generate.js:40-91](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/generate.js#L40-L91)

预检查后逐文件替换写入。

<details>
<summary>查看原文（52行）</summary>

```text
export async function generate(cfg) {
  const meta = TEMPLATE_META[cfg.template]
  const versions = await resolveDshVersions()

  const targetAbs = resolve(cfg.targetDir)
  if (await exists(targetAbs) && await readdir(targetAbs).then((l) => l.length > 0)) {
    throw new Error(
      `target directory ${JSON.stringify(cfg.targetDir)} is not empty — refusing to overwrite (目录非空，拒绝覆盖). Choose a new directory or empty it first.`,
    )
  }

  const tokens = {
    PKG_NAME: cfg.name,
    PKG_DESCRIPTION: `${cfg.name} — a DeepSeek Harness plugin (${cfg.template} template).`,
    PLUGIN_ID: cfg.pluginId,
    TOOL_NAME: cfg.toolName || 'my_tool',
    DSH_TOOLS_VERSION: versions.dshTools,
    DSH_SESSION_VERSION: versions.dshSession,
    CORDIS_VERSION: versions.cordis,
    SCHEMASTERY_VERSION: versions.schemastery,
    DSH_VERSION: versions.dsh,
    YEAR: String(new Date().getFullYear()),
    PITFALLS: renderPitfalls(),
  }

  const replace = (content) =>
    content.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in tokens ? tokens[key] : m))

  const srcRoot = join(TEMPLATES_ROOT, cfg.template)
  const files = await listFiles(srcRoot)
  const written = []
  for (const rel of files) {
    const content = replace(await readText(join(srcRoot, rel)))
    await writeFileDeep(join(targetAbs, rel), content)
    written.push(rel)
  }

  const namingManifest = createNamingManifest(cfg)
  if (namingManifest) {
    const namingFile = 'dsh-plugin.naming.json'
    await writeFileDeep(join(targetAbs, namingFile), `${JSON.stringify(namingManifest, null, 2)}\n`)
    written.push(namingFile)
  }

  console.log('')
  console.log(ok(`✔ Generated ${cfg.template} plugin in ${targetAbs} (生成完成)`))
  console.log(paint(c.dim, `  template: ${cfg.template}  package: ${cfg.name}  plugin-id: ${cfg.pluginId}`))
  console.log(paint(c.dim, `  @deepseek-ai/dsh-tools pinned to ${versions.dshTools} (next tag; latest is stale 0.0.1-rc.1)`))
  console.log(paint(c.dim, `  files: ${written.join(', ')}`))
  if (namingManifest) {
    console.log(paint(c.dim, `  community coordinate: ${namingManifest.plugin.coordinate} (not a reservation)`))
  }
```

</details>

**依据 3 · 源码核查**：[packages/create-dsh-plugin/src/cli.js:45-52](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/cli.js#L45-L52)

未知模板提前回落tool。

```text
  if (!cfg.targetDir) {
    console.error(err('✘ 需要项目目录 / a project directory is required (or use the wizard)'))
    process.exit(1)
  }
  cfg.template = cfg.template && TEMPLATES.includes(cfg.template) ? cfg.template : 'tool'
  if (!TEMPLATES.includes(cfg.template)) {
    console.error(err(`✘ 未知模板 / unknown template: ${cfg.template} (choose ${TEMPLATES.join('|')})`))
    process.exit(1)
```

**依据 4 · 源码核查**：[packages/create-dsh-plugin/src/naming.js:10-32](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/naming.js#L10-L32)

社区身份规范化验证。

<details>
<summary>查看原文（23行）</summary>

```text
export function registryIdentityFromPackage(packageName, owner, requestedName) {
  const normalizedPackageName = String(packageName).trim()
  if (!packageNamePattern.test(normalizedPackageName) || normalizedPackageName.length > 214) {
    throw new Error('--name must be a valid lowercase npm package name when --registry-owner is supplied')
  }
  const namespace = String(owner).trim().toLowerCase()
  if (!namespacePattern.test(namespace) || namespace.length > 63) {
    throw new Error('--registry-owner must be a lowercase GitHub owner such as alice or alice-labs')
  }
  const packageSlug = normalizedPackageName.split('/').pop()
  const derivedName = packageSlug.replace(/^dsh-(?:plugin-)?/, '') || packageSlug
  const name = String(requestedName || derivedName).trim().toLowerCase()
  if (!pluginNamePattern.test(name) || name.length > 63) {
    throw new Error('--registry-name must use lowercase kebab-case')
  }
  return {
    namespace,
    name,
    coordinate: `${namespace}/${name}`,
    loaderId: `${namespace}-${name}`,
    toolName: `${namespace}-${name}`.replaceAll('-', '_'),
  }
}
```

</details>

#### 缺口

- 当前提交没有本次生成、安装或宿主行为执行。
  **影响**：不能声称模板可安全部署或节省具体工时。
  **进一步探讨**：先修边界，再在隔离目录逐模板执行反例与回放验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模板中哪些边界必须开发者修补？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

preset-pack从请求JSON取得id后直接join(userRoot,id)，remove用recursive rm；没有校验id来自bundled列表，也没有规范化后目录约束。id为..可落到DSH_HOME，文件删除范围超出预设，这是固定源码确认的危险路径，真实远端可达性还取决宿主HTTP认证/监听边界，本轮未检查该外层，不能写成已验证外网漏洞。apply还有覆盖既有预设和分文件写入的恢复问题。webui工具resolve用户path后writeFile可覆盖任意进程可写目标，结果卡却oldText:null表示创建，未读旧文；宿主工具审批/权限边界不能由生成器保证。模板演示可回放与disposer有学习价值，但不应原样用于含写/删能力的正式应用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/create-dsh-plugin/templates/preset-pack/src/index.ts:56-70](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/templates/preset-pack/src/index.ts#L56-L70)

未校验id的路径拼接与递归删除。

<details>
<summary>查看原文（15行）</summary>

```text
function applyPreset(id: string) {
  const src = join(PRESETS_DIR, id)
  if (!existsSync(join(src, 'agent.cordis.yml'))) return { ok: false, error: 'unknown preset: ' + id }
  const dst = join(userRoot(), id)
  mkdirSync(dst, { recursive: true })
  for (const f of ['agent.cordis.yml', 'preset.yml']) {
    writeFileSync(join(dst, f), readFileSync(join(src, f)))
  }
  return { ok: true, id, files: [join(dst, 'agent.cordis.yml'), join(dst, 'preset.yml')] }
}

function removePreset(id: string) {
  const dst = join(userRoot(), id)
  if (existsSync(dst)) rmSync(dst, { recursive: true, force: true })
  return { ok: true, id }
```

</details>

**依据 2 · 源码核查**：[packages/create-dsh-plugin/templates/preset-pack/src/index.ts:90-107](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/templates/preset-pack/src/index.ts#L90-L107)

HTTP请求id直接传apply/remove。

<details>
<summary>查看原文（18行）</summary>

```text
    const d1 = ws.register({ kind: 'exact', path: '/{{PLUGIN_ID}}/list', handler: (_req, res) => json(listPresets())(_req, res) })
    const d2 = ws.register({ kind: 'exact', path: '/{{PLUGIN_ID}}/apply', handler: (req, res) => {
      let raw = ''
      req.on('data', (c: Buffer) => { raw += c })
      req.on('end', () => {
        let id = ''
        try { id = String(JSON.parse(raw || '{}').id || '') } catch { /* ignore */ }
        json(id ? applyPreset(id) : { ok: false, error: 'missing id' })(req, res)
      })
    } })
    const d3 = ws.register({ kind: 'exact', path: '/{{PLUGIN_ID}}/remove', handler: (req, res) => {
      let raw = ''
      req.on('data', (c: Buffer) => { raw += c })
      req.on('end', () => {
        let id = ''
        try { id = String(JSON.parse(raw || '{}').id || '') } catch { /* ignore */ }
        json(id ? removePreset(id) : { ok: false, error: 'missing id' })(req, res)
      })
```

</details>

**依据 3 · 源码核查**：[packages/create-dsh-plugin/templates/webui/src/index.ts:64-76](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/templates/webui/src/index.ts#L64-L76)

oldText:null与直接覆盖writeFile。

<details>
<summary>查看原文（13行）</summary>

```text
      const meta = result.meta as { path?: string; content?: string } | undefined
      const path = meta?.path ?? ''
      return {
        card: 'diff',
        title: `Wrote ${path}`,
        diffs: [{ path, oldText: null, newText: meta?.content ?? '' }],
      }
    },

    async execute(args) {
      const abs = resolve(args.path)
      await writeFile(abs, args.content, 'utf8')
      return { path: abs, bytes: Buffer.byteLength(args.content, 'utf8') }
```

</details>

#### 缺口

- 当前提交没有本次生成、安装或宿主行为执行。
  **影响**：不能声称模板可安全部署或节省具体工时。
  **进一步探讨**：先修边界，再在隔离目录逐模板执行反例与回放验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · --verify实际证明什么，采用和退出成本是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

verify安装依赖、tsc build、以临时DSH_HOME执行plugin add，再dump-config检查stdout是否含pluginId或包名。这只能支持编译/配置行存在，不调用工具、触发事件、打开panel或回放卡片；字符串可出现于非目标行，不能据“VERIFY PASSED”认定插件行为和卸载清理通过。npx -y @deepseek-ai/dsh没有锁版本，可能与生成的next版不一致。安装会执行包生命周期和联网，临时home只隔离profile，项目node_modules/生成文件及外部包缓存保留；本轮未执行。首次成本是Node、npm/pnpm、网络和构建/审阅；持续是跟踪易变DSH接口、修补模板；失败清半成品、依赖与临时环境，工时费用未知。建议观察，先只读学习tool/events，待写删边界和行为验收补齐才试用生成物；删除新目录可撤回尚未安装骨架，已安装profile和写删业务副作用需另恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/create-dsh-plugin/src/verify.js:20-60](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/verify.js#L20-L60)

安装build、临时profile及包含字符串检查。

<details>
<summary>查看原文（41行）</summary>

```text
  const pnpm = await which('pnpm')
  if (!pnpm) console.log(warn('⚠ pnpm not found on PATH — `dsh plugin add` needs it; install via corepack. Continuing with npm for the project build.'))
  const pm = pnpm ? 'pnpm' : 'npm'
  const cwd = dirname(targetAbs)
  const env = process.env

  // [1/4] install
  console.log(paint(c.dim, `\n[1/4] ${pm} install  →  ${targetAbs}`))
  let r = await run(pm, ['install'], { cwd: targetAbs, timeout: 300000, env })
  if (r.code !== 0) return fail(`${pm} install`, r)
  console.log(ok('✔ install ok'))

  // [2/4] build (tsc)
  console.log(paint(c.dim, `\n[2/4] ${pm} run build`))
  r = await run(pm, ['run', 'build'], { cwd: targetAbs, timeout: 180000, env })
  if (r.code !== 0) return fail(`${pm} run build`, r)
  console.log(ok('✔ build ok (tsc → dist/)'))

  // [3/4] install into a temp profile via dsh plugin add
  console.log(paint(c.dim, '\n[3/4] dsh plugin add → temp profile'))
  const dshHome = await mkdtemp(join(tmpdir(), 'dsh-verify-'))
  const profile = 'verify'
  r = await run('npx', ['-y', '@deepseek-ai/dsh', 'plugin', '--profile', profile, 'add', targetAbs], {
    cwd, timeout: 300000, env: { ...env, DSH_HOME: dshHome },
  })
  if (r.code !== 0) { await rm(dshHome, { recursive: true, force: true }); return fail('dsh plugin add', r) }
  console.log(ok('✔ dsh plugin add ok'))

  // [4/4] dump-config must contain the plugin row
  console.log(paint(c.dim, '\n[4/4] dump-config → check plugin row'))
  r = await run('npx', ['-y', '@deepseek-ai/dsh', '--profile', profile, '--dump-config'], {
    cwd, timeout: 120000, env: { ...env, DSH_HOME: dshHome },
  })
  await rm(dshHome, { recursive: true, force: true })
  const found = r.stdout.includes(cfg.pluginId) || r.stdout.includes(cfg.name)
  if (r.code !== 0 || !found) return fail('dump-config (plugin row not found)', r)
  console.log(ok(`✔ dump-config contains plugin row "${cfg.pluginId}"`))

  console.log(`\n${ok('✔ VERIFY PASSED — the plugin compiles and loads into a real DSH profile (验证通过)')}`)
  return true
}
```

</details>

**依据 2 · 源码核查**：[packages/create-dsh-plugin/src/util.js:39-48](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/util.js#L39-L48)

spawn执行继承环境，收集结果。

<details>
<summary>查看原文（10行）</summary>

```text
export function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, spawnOpts(opts))
    let out = ''
    let errout = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { errout += d })
    child.on('error', (e) => resolve({ code: -1, stdout: out, stderr: String(e) }))
    child.on('close', (code) => resolve({ code, stdout: out, stderr: errout }))
  })
```

</details>

**依据 3 · 源码核查**：[packages/create-dsh-plugin/package.json:1-32](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/package.json#L1-L32)

CLI、Node、无运行依赖。

<details>
<summary>查看原文（32行）</summary>

```text
{
  "name": "create-dsh-plugin",
  "version": "0.2.3",
  "description": "Scaffold a DeepSeek Harness (DSH) plugin in seconds — tool / events / webui templates, next-tag version pinning, and a built-in --verify smoke test.",
  "license": "MIT",
  "type": "module",
  "bin": {
    "create-dsh-plugin": "./src/cli.js"
  },
  "files": [
    "src",
    "templates",
    "README.md"
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "keywords": [
    "deepseek",
    "deepseek-harness",
    "dsh",
    "plugin",
    "cordis",
    "scaffold",
    "create-dsh-plugin"
  ],
  "scripts": {
    "test": "node --test",
    "test:verify": "DSH_SMOKE_VERIFY=1 node --test"
  },
  "dependencies": {},
  "devDependencies": {}
```

</details>

#### 缺口

- 当前提交没有本次生成、安装或宿主行为执行。
  **影响**：不能声称模板可安全部署或节省具体工时。
  **进一步探讨**：先修边界，再在隔离目录逐模板执行反例与回放验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进能把示例变为可靠起点？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02-Q04推导未验证的模板行为契约：默认模板只读；写入显式限定工作区且创建时exclusive，修改先保存旧文；preset id需bundled白名单+canonical边界，删除仅删有本工具ownership标记文件。verify绑定精确宿主与解析版本，启动并实际调用工具、测试卸载、panel路由及旧日志回放，分层显示编译/配置/行为结果。用..、越界软链接、既有文件、生成中断、错误模板名和仅配置中含字符串作反例；任何删到预设根外、假通过或覆盖未备份旧文件即否定充分性。这增加开发者验收成本，能否减少后续返工要与人工示例对照，不算当前已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/create-dsh-plugin/src/cli.js:45-52](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/cli.js#L45-L52)

错误模板名反例。

```text
  if (!cfg.targetDir) {
    console.error(err('✘ 需要项目目录 / a project directory is required (or use the wizard)'))
    process.exit(1)
  }
  cfg.template = cfg.template && TEMPLATES.includes(cfg.template) ? cfg.template : 'tool'
  if (!TEMPLATES.includes(cfg.template)) {
    console.error(err(`✘ 未知模板 / unknown template: ${cfg.template} (choose ${TEMPLATES.join('|')})`))
    process.exit(1)
```

**依据 2 · 源码核查**：[packages/create-dsh-plugin/templates/preset-pack/src/index.ts:67-70](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/templates/preset-pack/src/index.ts#L67-L70)

删除范围反例。

```text
function removePreset(id: string) {
  const dst = join(userRoot(), id)
  if (existsSync(dst)) rmSync(dst, { recursive: true, force: true })
  return { ok: true, id }
```

**依据 3 · 源码核查**：[packages/create-dsh-plugin/src/verify.js:48-58](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/create-dsh-plugin/src/verify.js#L48-L58)

字符串存在不能证明行为。

<details>
<summary>查看原文（11行）</summary>

```text
  // [4/4] dump-config must contain the plugin row
  console.log(paint(c.dim, '\n[4/4] dump-config → check plugin row'))
  r = await run('npx', ['-y', '@deepseek-ai/dsh', '--profile', profile, '--dump-config'], {
    cwd, timeout: 120000, env: { ...env, DSH_HOME: dshHome },
  })
  await rm(dshHome, { recursive: true, force: true })
  const found = r.stdout.includes(cfg.pluginId) || r.stdout.includes(cfg.name)
  if (r.code !== 0 || !found) return fail('dump-config (plugin row not found)', r)
  console.log(ok(`✔ dump-config contains plugin row "${cfg.pluginId}"`))

  console.log(`\n${ok('✔ VERIFY PASSED — the plugin compiles and loads into a real DSH profile (验证通过)')}`)
```

</details>

#### 缺口

- 当前提交没有本次生成、安装或宿主行为执行。
  **影响**：不能声称模板可安全部署或节省具体工时。
  **进一步探讨**：先修边界，再在隔离目录逐模板执行反例与回放验收。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
