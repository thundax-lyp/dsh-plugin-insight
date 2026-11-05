# dsh-super-injector

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e2fca6e](https://github.com/yjh051108/dsh-super-injector/tree/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974)

<!-- BEGIN META -->
[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-super-injector)
<!-- END META -->

> **功能**：在 DSH 运行时加载、重载和管理本地插件包。

> **亮点**：[Q01](#research-q01) 将本地开发构建产物接到运行时 loader。

> **主要限制**：[Q02](#research-q02) Web 和模型工具入口的预检及串行边界有差异。

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
  - [Q01 · 如何加载和记录开发插件？](#detail-section-11)
  - [Q02 · 注入入口的检查是否相同？](#detail-section-12)
  - [Q03 · 怎样控制试用和退出成本？](#detail-section-13)
  - [Q04 · 怎样减少入口差异？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁构建与验证本地 DSH 插件的开发者。

使用常规 bundle 安装和重启，手工核对配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 运行时注入 | 加载本地构建包 | 需要可信代码和兼容宿主 |
| 管理 | 查看并清理注入记录 | 需核对链接和重启 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 loader 与客户端 | 必需 | 装配和刷新模块 | 使用常规安装 |
| 可信本地包 | 注入必需 | 由宿主加载 | 停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择独立 profile 和惰性包 | 限定网络和路径 |
| 观察 | 操作者对照工具和 Web 入口 | 核对副作用 |
| 退出 | 核对 entry、链接和记录 | 重启复查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 构建资源未知 | 准备兼容环境 | 未实测 |
| 持续 | 构建和监听消耗 | 维护产物和清单 | 实际收益未知 |
| 恢复 | 重启成本未知 | 核对链接与状态 | 部分失败需人工 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 热装配 | loader 与客户端接线 | 真实速度 |
| 管理 | 注册表与状态 | 卸载和重启一致性 |

> **思考**：[Q02](#research-q02) Web 和模型工具入口的预检及串行边界有差异。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将本地开发构建产物接到运行时 loader。

[Q02](#research-q02) 工具路径具有前置检查，底层加载仍需宿主控制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Web 和模型工具入口的预检及串行边界有差异。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只在隔离 profile 验证惰性包。[Q02](#research-q02) 明确入口权限后再考虑扩大。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码表明运行时装配存在，真实宿主及权限未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定工具、loader 和 Web 入口代表路径，未执行。
- 下一步：对照两个入口的坏包、授权、加载失败和退出。

**分析版本**

- **仓库**：[yjh051108/dsh-super-injector](https://github.com/yjh051108/dsh-super-injector)
- **版本号**：0.3.6（[固定提交 e2fca6e](https://github.com/yjh051108/dsh-super-injector/tree/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 共用预检和状态回执以减少边界差异。

对照两个入口的坏包、授权、加载失败和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 963 | — | — | 12689 |
| .mjs | source | 6 | 672 | 539 | 84 | — |
| .ts | source | 5 | 4742 | 3238 | 1379 | — |
| .mjs | test | 5 | 696 | 442 | 190 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/yjh051108/dsh-super-injector/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：运行时注入如何缩短迭代，哪些入口承担不同校验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何加载和记录开发插件？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本地反复构建 DSH 扩展的开发者通常改配置后重启。注入函数读取目标 package.json，检查已有激活项，链接目录到 profile 解析路径并调用 loader.create。成功后整理 entry、刷新客户端并写入注入记录。因而开发迭代可绕过每次手写持久 patch 的步骤，但仍会改变 profile 的链接和重启恢复清单。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2396-2415](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L2396-L2415)

包读取和防重

<details>
<summary>查看原文（20行）</summary>

```text
  /** 注入一个本地插件包：junction → loader.create → 记录清单。 */
  async function inject(dir: string): Promise<string> {
    const absDir = resolve(dir)
    const pkgPath = join(absDir, 'package.json')
    if (!existsSync(absDir) || !statSync(absDir).isDirectory()) return `ERROR: 目录不存在或不可访问: ${absDir}`
    if (!existsSync(pkgPath)) return `ERROR: ${absDir} 存在但没有 package.json（不是插件包目录）`
    let pkg: { name?: string }
    try {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    } catch (e) {
      return 'ERROR: package.json 解析失败: ' + String(e)
    }
    const pkgName = pkg.name
    if (!pkgName) return 'ERROR: package.json 缺 name'

    // 清理同名残留 entry（disposed/failed），防止堆积与重载错位
    cleanupStaleEntries(pkgName)

    if (hasActiveEntry(pkgName)) return `INFO: ${pkgName} 已激活运行，跳过注入`
    purgeCache(absDir)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2417-2458](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L2417-L2458)

链接、装配、清单及反馈

<details>
<summary>查看原文（42行）</summary>

```text
    // junction 链接到 profile node_modules（scoped 包需要两级目录）
    // ⚠️ 悬空 junction 必须重建（实测踩坑）：目标目录被删后 existsSync 返回
    // **false**（跟随链接检查目标）——判断链接存在必须用 lstatSync（链接本身
    // 还在）。悬空链接复用 → import ENOENT / symlink EEXIST。
    const scoped = pkgName.startsWith('@')
    const parts = scoped ? pkgName.split('/') : [pkgName]
    const linkDir = join(profileNodeModules, ...parts)
    try {
      let linkExists = false
      try { linkExists = lstatSync(linkDir).isSymbolicLink() || lstatSync(linkDir).isDirectory() } catch { /* 不存在 */ }
      if (!linkExists || !isHealthyLink(linkDir)) {
        if (linkExists) {
          // ⚠️ 只删链接本身，绝不递归进目标（见 removeLinkOnly 注释）。
          try { removeLinkOnly(linkDir) } catch { /* 删除失败尝试覆盖 */ }
        }
        mkdirSync(dirname(linkDir), { recursive: true })
        symlinkSync(absDir, linkDir, 'junction')
      }
    } catch (e) {
      return `ERROR: 建立 junction 失败（${linkDir}）: ${String(e)}`
    }

    // 运行时装配
    try {
      await ctx.loader.create({ name: pkgName, config: {} })
    } catch (e) {
      return `ERROR: loader.create 失败: ${e instanceof Error ? e.stack : String(e)}`
    }
    // 清 disabled（幽灵 entry 隔离）：注入即完整生效（host + client UI）
    normalizeEntriesByName(pkgName)
    // client 模块补扫（loader.create 的 microtask flush 在 normalize 前已跑）
    refreshClientRow(pkgName)

    const list = readRegistry()
    if (!list.some(e => e.dir === absDir)) {
      list.push({ dir: absDir, name: pkgName, at: new Date().toISOString() })
      writeRegistry(list)
    }
    const hostOk = hasActiveEntry(pkgName)
    const client = clientStatus(pkgName)
    recordOp('inject', hostOk)
    return `OK: ${pkgName} 已注入（junction=${linkDir}）\n- host ${hostOk ? '✓' : '✗'}\n- ${client}`
```

</details>

**依据 3 · 作者声明**：[README.md:234-247](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/README.md#L234-L247)

作者对照开发流程

<details>
<summary>查看原文（14行）</summary>

```text
## 典型工作流

**装模组**：拿到插件包（package.json + lib/ 产物）→ 对 AI 说 `dev_inject_plugin`（参数 = 插件包绝对路径）→ 当场生效（下一 step 工具可见）。

**开发迭代**：改代码 → build → 自动 watch 约 1.5 秒自动重载（或 `dev_reload_package`）→ 验证 → 稳定后 `dev_stage_promote` 一键转正。

**卸载**：`dev_uninject_plugin`（参数 = 包名子串）→ 工具/监听/路由/client 表全清，免重启。

## 机制

1. **junction 链接**插件包到 `~/.dsh/profiles/web/node_modules`（loader 标准解析路径）；
2. **`ctx.loader.create({ name, config })`** 运行时装配（完整 ctx）；
3. **清单持久化**（`~/.dsh/super-injector/registry.json`），重启后自动恢复注入；
4. **client 联动**：注入/重载后清除 entry disabled 标记并补扫 client 模块表（`client-modules.processOne`），浏览器端 bundle rev 联动更新。
```

</details>

#### 缺口

- 未运行宿主、热换或客户端动作
  **影响**：无法确定速度和宿主兼容
  **进一步探讨**：在临时 profile 用惰性插件核对工具和客户端

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 注入入口的检查是否相同？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

dev_inject_plugin 工具先检查客户端骨架和构建产物，再进入 handoff 与操作锁。Web 的 POST /inject 直接调用底层 inject；在该 handler 中未见同样的检查、操作锁或独立授权判据。底层解析包名与链接后加载宿主代码，不等于沙箱。loader.create 报错前已可能建立链接，返回错误不能证明环境未变。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2998-3035](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L2998-L3035)

工具入口预检与锁

<details>
<summary>查看原文（38行）</summary>

```text
  safeRegister(defineTool({
    name: 'dev_inject_plugin',
    description: '超级模组注入器：运行时注入任意本地 DSH 插件包（junction 链接 + loader.create，不碰 patch/package.json、不重启）。参数 = 插件包目录绝对路径（含 package.json 与 lib/）',
    parameters: {
      dir: { type: 'string', required: true, description: '插件包目录绝对路径（如 F:/dsh/03-dev-infra/dsh-xxx）' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args: unknown, value: unknown) => [{ type: 'text', text: String(value) }],
    },
    async execute(args: { dir: string }) {
      const dir = String(args.dir ?? '').trim()
      if (!dir) return 'ERROR: dir 必填（插件包目录绝对路径）'
      // ⚠️ 注入前 client 骨架校验（2026-08 pixel-forge 事件教训：参考源污染
      // 会把"缺 inject/name"的老坑传播给新插件——注入即检查，有问题先修再注入）
      // 2026-08-14 升级（用户反馈）：①同时检查编译产物 lib/client.js（只有
      // lib 无 src 的插件此前绕过检查）②缺 inject 改为**阻断**（警告不够——
      // 漏 inject 的 client 注入后 Tab 必挂）③restore 恢复路径同样校验
      // （pixel-forge 事件：坏 client 插件在 registry → 新会话 autoRestore
      // 恢复 → client apply 失败 → 整个 HARNESS 启动失败——用户被迫手动修）
      // 2026-08-14 二次升级（index build 事件教训）：追加构建产物新鲜度校验
      // ——lib/client.js 缺失/非 tsdown 产物 → 阻断（前端必挂）；src 比产物
      // 新（漏构建）→ 警告（注入不阻断，但 audit 留痕提醒）。
      const problems = clientSkeletonProblems(resolve(dir))
      const fresh = buildFreshnessProblems(resolve(dir))
      const block = [...problems, ...fresh.block]
      if (block.length > 0) {
        return 'ERROR: 注入前校验发现 client 骨架/构建产物问题（已阻断——缺 inject 的 client 注入后 Tab 必挂，缺 client bundle 前端必挂）：\n- ' + block.join('\n- ')
          + '\n修复：参照脚手架模板补骨架 → npm run build:all（host + client 两步构建）→ 再注入'
      }
      if (fresh.warn.length > 0) {
        auditLog('inject-stale-artifacts', `${dir}: ${fresh.warn.join('; ')}`)
        logger.warn('[super-injector] 注入 %s 构建产物可能过期（未阻断）: %s', dir, fresh.warn.join('; '))
      }
      // 同上（2026-09-12）：工具边界统一有界交接——注入同样要 await 别的 fiber 生命周期。
      // ⚠️ 嵌套顺序有意义：**handoff 在外（先设边界）· withOpLock 在内（再拿操作锁）**。
      return handoff('inject', dir, HANDOFF_MS, () => withOpLock(() => inject(dir)))
    },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:4155-4182](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L4155-L4182)

Web 入口直接调用

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/super-injector/api',
    handler: async (req: any, res: any) => {
      const send = (code: number, obj: unknown): void => {
        res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(obj))
      }
      try {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const path = url.pathname.replace(/^\/super-injector\/api/, '') || '/'
        if (req.method === 'GET' && path === '/list') {
          const entries = readRegistry().map((e) => ({ ...e, active: hasActiveEntry(e.name) }))
          return send(200, { ok: true, entries, stats: opStats, clientDeclared: !!process.env.DSH_WEB })
        }
        if (req.method === 'POST' && path === '/uninstall') {
          const body = JSON.parse(await readBody(req))
          const match = String(body?.match ?? '').trim()
          if (!match) return send(400, { ok: false, error: 'match 必填' })
          const result = await uninject(match)
          return send(200, { ok: true, result })
        }
        if (req.method === 'POST' && path === '/inject') {
          const body = JSON.parse(await readBody(req))
          const dir = String(body?.dir ?? '').trim()
          if (!dir) return send(400, { ok: false, error: 'dir 必填' })
          const result = await inject(dir)
          return send(200, { ok: true, result })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2417-2443](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L2417-L2443)

错误前可能有链接变更

<details>
<summary>查看原文（27行）</summary>

```text
    // junction 链接到 profile node_modules（scoped 包需要两级目录）
    // ⚠️ 悬空 junction 必须重建（实测踩坑）：目标目录被删后 existsSync 返回
    // **false**（跟随链接检查目标）——判断链接存在必须用 lstatSync（链接本身
    // 还在）。悬空链接复用 → import ENOENT / symlink EEXIST。
    const scoped = pkgName.startsWith('@')
    const parts = scoped ? pkgName.split('/') : [pkgName]
    const linkDir = join(profileNodeModules, ...parts)
    try {
      let linkExists = false
      try { linkExists = lstatSync(linkDir).isSymbolicLink() || lstatSync(linkDir).isDirectory() } catch { /* 不存在 */ }
      if (!linkExists || !isHealthyLink(linkDir)) {
        if (linkExists) {
          // ⚠️ 只删链接本身，绝不递归进目标（见 removeLinkOnly 注释）。
          try { removeLinkOnly(linkDir) } catch { /* 删除失败尝试覆盖 */ }
        }
        mkdirSync(dirname(linkDir), { recursive: true })
        symlinkSync(absDir, linkDir, 'junction')
      }
    } catch (e) {
      return `ERROR: 建立 junction 失败（${linkDir}）: ${String(e)}`
    }

    // 运行时装配
    try {
      await ctx.loader.create({ name: pkgName, config: {} })
    } catch (e) {
      return `ERROR: loader.create 失败: ${e instanceof Error ? e.stack : String(e)}`
```

</details>

#### 缺口

- 未检查上游 Web 认证和各入口并发行为
  **影响**：无法确认实际可触发用户或部分失败清理
  **进一步探讨**：在隔离环境模拟未知权限、坏包和并发

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样控制试用和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

注入器自身由 bundle 挂载，运行需兼容 loader 和客户端服务。作者列宽范围 peer 及内部结构接线，不能当任意宿主验收。只在临时 profile 试用可信本地包，并核对自动恢复是否启用。移除测试包时检查 entry、链接和 registry，重启后复核，避免把即时列表状态视作彻底退出。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-43](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/package.json#L28-L43)

bundle 和 peer 声明

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc <2",
    "@deepseek-ai/cordis": ">=4.0.0-rc <5",
    "@deepseek-ai/schemastery": "^3.18.2"
```

</details>

**依据 2 · 作者声明**：[README.md:76-86](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/README.md#L76-L86)

作者说明卸载及自动恢复

<details>
<summary>查看原文（11行）</summary>

```text
## 特性

- 🔥 **热重载 + 自重载**：`dev_reload_package` 整包重载（清缓存 → 重新 import → 重建 fiber，失败回滚保留旧代）；注入器自身也支持自重载（自杀 → 全局定时器重建）
- 🤖 **自动 watch**：注入即自动监听插件目录，改代码 build 后约 1.5 秒自动重载（无需手动触发）
- 🖥️ **注入插件 UI 完整生效**：清除 loader 幽灵 entry 隔离（normalizeEntry），client 模块补扫/联动/卸载清理——注入的插件 host 工具 + 图谱/面板等 UI 全部可用
- 🧪 **开发侧挂区（staging）+ 持久化**：测试工具挂"后侧"不进 tools schema、缓存零污染；`dev_stage_promote` 一键转正；staging 落盘，**自重载/重启后转正工具自动恢复**
- 🧹 **一键卸载**：`dev_uninject_plugin` fiber 全清理（工具/监听/路由/client 表）→ 清注入清单 → 删 junction，免重启
- 🛠️ **路由自愈**：`dev_clear_routes` 直捣 webserver 内部路由表，热重载残留的孤儿路由免重启清除
- 🔁 **重启自动恢复**：注入清单持久化（`~/.dsh/super-injector/registry.json`），web 重启后自动归位
- 📊 **操作自检**：每次注入/重载/安装返回 `host ✓ / client ✓` 双验证；`dev_plugin_status` 含操作成功率统计
- 🛡️ **失败可重试**：`hasActiveEntry` 权威防重 + 失败残留缓存自动清理 + 残留 entry 自动清理
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2450-2464](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L2450-L2464)

清单与自卸载限制

<details>
<summary>查看原文（15行）</summary>

```text
    const list = readRegistry()
    if (!list.some(e => e.dir === absDir)) {
      list.push({ dir: absDir, name: pkgName, at: new Date().toISOString() })
      writeRegistry(list)
    }
    const hostOk = hasActiveEntry(pkgName)
    const client = clientStatus(pkgName)
    recordOp('inject', hostOk)
    return `OK: ${pkgName} 已注入（junction=${linkDir}）\n- host ${hostOk ? '✓' : '✗'}\n- ${client}`
  }

  /** 卸载一个已注入的插件包：卸 entry（fiber dispose）→ 清 registry → 删 junction。 */
  async function uninject(match: string, allowSelf = false): Promise<string> {
    // 自举卸载（allowSelf）：卸运行时 entry，保留 registry/junction/bundles 装配链，重启自动装回。
    if (match.includes('super-injector') && !allowSelf) return 'ERROR: 拒绝卸载 dsh-super-injector 自身（引导器不可卸载；自举卸载需 self=true）'
```

</details>

#### 缺口

- 未执行注入、卸载、重启与清理
  **影响**：不能量化迭代收益和恢复时间
  **进一步探讨**：用惰性包观察三处状态及重启后结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少入口差异？

**研究主题**：新假设与验证

#### 完整回答

可让模型工具和 Web 路由共同调用授权后操作函数，将骨架、构建检查和锁结果做成一份结构化回执。用同一坏包、同时两次注入和加载失败对照现有分支，测拒绝一致性、残留链接及额外时间。若差异不降或正常迭代明显变慢，就重新评估。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:3021-3035](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L3021-L3035)

已有工具校验可作对照

<details>
<summary>查看原文（15行）</summary>

```text
      const problems = clientSkeletonProblems(resolve(dir))
      const fresh = buildFreshnessProblems(resolve(dir))
      const block = [...problems, ...fresh.block]
      if (block.length > 0) {
        return 'ERROR: 注入前校验发现 client 骨架/构建产物问题（已阻断——缺 inject 的 client 注入后 Tab 必挂，缺 client bundle 前端必挂）：\n- ' + block.join('\n- ')
          + '\n修复：参照脚手架模板补骨架 → npm run build:all（host + client 两步构建）→ 再注入'
      }
      if (fresh.warn.length > 0) {
        auditLog('inject-stale-artifacts', `${dir}: ${fresh.warn.join('; ')}`)
        logger.warn('[super-injector] 注入 %s 构建产物可能过期（未阻断）: %s', dir, fresh.warn.join('; '))
      }
      // 同上（2026-09-12）：工具边界统一有界交接——注入同样要 await 别的 fiber 生命周期。
      // ⚠️ 嵌套顺序有意义：**handoff 在外（先设边界）· withOpLock 在内（再拿操作锁）**。
      return handoff('inject', dir, HANDOFF_MS, () => withOpLock(() => inject(dir)))
    },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:4177-4182](https://github.com/yjh051108/dsh-super-injector/blob/e2fca6e2dc5d926bb33fbd1376780bb5e93f4974/src/index.ts#L4177-L4182)

Web 直接进入底层操作

```text
        if (req.method === 'POST' && path === '/inject') {
          const body = JSON.parse(await readBody(req))
          const dir = String(body?.dir ?? '').trim()
          if (!dir) return send(400, { ok: false, error: 'dir 必填' })
          const result = await inject(dir)
          return send(200, { ok: true, result })
```

#### 缺口

- 未测上游是否还有等价约束
  **影响**：无法确定集中入口的实际增量
  **进一步探讨**：先复核授权及调用链，再做同输入对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
