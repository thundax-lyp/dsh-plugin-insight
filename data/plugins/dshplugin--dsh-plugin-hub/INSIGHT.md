# DSH Plugin Hub

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3028ea9](https://github.com/dshplugin/dsh-plugin-hub/tree/3028ea9c0f23f24fa2c73eb4051710356f627390)

<!-- BEGIN META -->
[![npm 30d 55,304](https://img.shields.io/static/v1?label=npm+30d&message=55%2C304&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin) [![最新发布 2026-11-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)
<!-- END META -->

> **功能**：在 DeepSeek Harness 设置中浏览社区插件，管理安装、更新、卸载和任务日志。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 显示，市场在同一设置入口接好目录、变更队列与回查，并在常规日志缺失时保留实际命令、registry 和 profile 供用户排查。

> **主要限制**：[Q02](#research-q02) 显示，目录包映射验证失败后仍可继续安装；构建失败恢复会修改 profile 的持久许可，且部分旧规则在归一时可能从精确来源降为裸包名。

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
  - [Q01 · 设置页如何把一个目录条目变成可定位的本地操作？](#detail-section-11)
  - [Q02 · 标为目录安装时，包名映射、精确版本和脚本权限在哪里生效？](#detail-section-12)
  - [Q03 · 当安装失败、取消或宿主未加载时，界面状态究竟证明了什么？](#detail-section-13)
  - [Q04 · 哪种试用有明确退出条件，怎样验证更严格的确认计划？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 DSH Web profile 的用户可以在设置查阅一个已知社区包，并回查对应安装任务与已装版本。

过去可以先浏览原仓库和 npm，再手动在指定 profile 运行官方管理命令，并自己比对命令结果与实际已装包。市场集中其中的发现与回查步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设置页插件市场 | 从宿主设置浏览 DSH 社区条目 | Web 客户端需要 slots、locale 与宿主路由 |
| 目录代理及缓存 | 查询目录并在网络异常时读取旧结果 | 回退内容可能很旧，需另核目标 |
| 本地插件变更队列 | 排队执行安装、更新或卸载 | 绑定 profile，依赖 CLI，取消需复核文件 |
| 任务状态与故障诊断 | 回查结果、操作日志和排查提示 | 输出形态和可读取日志决定诊断范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 客户端 slots、locale 及宿主 webServer | 是 | 显示设置入口并使用同源接口 | 面板或路由无法完成挂载 |
| 目录源或可读取的本地缓存 | 查找目录需要 | 获取条目和统计 | 有旧缓存时可能继续显示旧结果 |
| 可用的 dsh、pnpm 与 npm registry | profile 安装需要 | 解析并执行目标包变更 | 环境损坏或仓库不可达时进入失败诊断 |
| 宿主 loader | 即时加载部分变更时需要 | 运行期应用包变更 | 可能需要重启或刷新 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者备份一次性 Web profile、确认安装目标和宿主 | 只在该 profile 查找和核对 |
| 加载 | 宿主装入插件市场，用户进入设置页 | 读取目标条目与当前依赖 |
| 受控变更 | 操作者按预先核实的工具和版本执行单一任务 | 核对任务 ID、依赖、锁文件、许可和加载 |
| 恢复 | 若诊断与实际版本或文件不符，操作者停手检查 profile | 以备份和宿主状态确认恢复结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 目录、包及缓存消耗网络与磁盘 | 备份或另建 profile，核对候选 | 资源量、工时未知 |
| 持续使用 | 目录刷新、安装、构建及日志占资源 | 查看终态，按场景核对许可及已装版本 | 未测单位合格任务成本 |
| 失败恢复 | 重试可能再次下载或构建 | 对照日志、依赖与配置，按条件恢复 | 诊断分类缩小候选原因，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发现 | 同源目录代理、缓存回退和设置入口 | 线上覆盖、缓存新鲜度及节时 |
| 操作与回查 | 任务 ID、进度、终态及已装版本字段 | 真实 profile 下的加载成功率 |
| 故障定位 | 稀疏错误补充运行条件，特定 pnpm 缺失有独立提示 | 对全部环境问题的分类准确率 |

> **思考**：[Q02](#research-q02) 显示，目录包映射验证失败后仍可继续安装；构建失败恢复会修改 profile 的持久许可，且部分旧规则在归一时可能从精确来源降为裸包名。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 显示，市场在同一设置入口接好目录、变更队列与回查，并在常规日志缺失时保留实际命令、registry 和 profile 供用户排查。

宿主入口、UI 接线、队列和诊断分类分别负责不同阶段。错误报告携带最少的 registry 主机信息和实际运行参数以便排查；共享报告前仍需检查其中的本机路径。构建许可归一处理 pnpm 解析约束，但要留意裸包名比精确条件更宽。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示，目录包映射验证失败后仍可继续安装；构建失败恢复会修改 profile 的持久许可，且部分旧规则在归一时可能从精确来源降为裸包名。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先用一次性 Web profile 查一个已知仓库并核对包名、版本和已装记录。若发现错配、突然需要构建放行或诊断无法解释实际文件变化，停止市场变更并回到原仓库和官方管理命令。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持设置接入、目录回退、队列与失败诊断。实际宿主兼容、部署状态和同任务收益仍待核实。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、tsdown.config.ts、src/client/index.tsx、src/server/http/catalog.ts、src/server/http/install.ts、src/server/http/shared.ts、src/server/services/install/task-queue.ts、src/server/services/profile/profile.ts、src/client/hooks/useTaskQueue.ts、src/client/logic/failures.ts、src/client/components/modals/NotificationsModal.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：重点覆盖 Web 设置、目录代理、普通 npm profile 安装、构建许可和任务诊断。全局 npm 通道只用于区分作用域，外部目录审核和 registry 行为未作独立测量。
- 下一步：在可丢弃 Web profile 分别采集正常安装、目录错配、构建受限和损坏 pnpm 的同任务结果，对照依赖文件、实际版本、权限改动、故障归因及人工操作时间。

**分析版本**

- **仓库**：[dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)
- **版本号**：2.4.0（[固定提交 3028ea9](https://github.com/dshplugin/dsh-plugin-hub/tree/3028ea9c0f23f24fa2c73eb4051710356f627390)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导，执行前把精确目标、registry 与新增构建许可绑定到一份短期确认计划，可能减少用户未批准的变更。

在可丢弃 Web profile 分别采集正常安装、目录错配、构建受限和损坏 pnpm 的同任务结果，对照依赖文件、实际版本、权限改动、故障归因及人工操作时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 83 | 2959 | — | — | 29241 |
| .js | source | 36 | 13259 | 11023 | 2328 | — |
| .mjs | source | 5 | 401 | 273 | 93 | — |
| .tsx | source | 26 | 5730 | 4544 | 1021 | — |
| .ts | source | 57 | 9964 | 6987 | 2592 | — |
| .ts | test | 31 | 3587 | 2688 | 749 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-18），可前往 [GitHub Issues](https://github.com/dshplugin/dsh-plugin-hub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经常维护 DSH Web 插件的用户能否在设置页核实社区包、安装副作用和失败归因，并据此决定何时继续操作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设置页如何把一个目录条目变成可定位的本地操作？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

频繁维护 DSH Web 插件的操作者可以在同一个设置面板定位已知候选，观察该 profile 的变更任务并核对已装版本。合格结果是从对应仓库、包名和版本追到任务 ID，再以本地依赖及宿主加载状态确认结果。手工浏览仓库和运行官方插件命令能够完成相同的底层变更，但操作者要自行把待办、命令输出和已装状态关联起来。

宿主模块把路由装到当前 profile 的 webServer 上，浏览器客户端通过宿主 slots 注入设置页，并在 locale 中尝试注册葡语。目录请求由同源 API 经当前代理设置获取；有一小时本地缓存，强制刷新失败仍会返回任意年龄的旧内容。葡语界面仍取英文目录。UI 能收敛导航和查询步骤，但目录正常打开或按下刷新都无法确认仓库与包映射仍有效。

服务将安装请求交给队列并返回任务 ID，队列调用 DSH CLI 处理，界面继续查询任务终态。这个组合的增量在于把目录、排队和结果回查接在一起。作者的目录规模、人工审核覆盖和真实操作节时仍需单独确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:17-22](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/lib/index.js#L17-L22)

实际宿主导出从已确定的 profile 绑定 webServer 与可选 loader。

```text
export function apply(ctx, config = {}) {
    const profile = config.profile ?? readProfileArg('web');
    ctx.inject(['webServer'], (host) => {
        host.effect(() => mountPluginHubRoutes(host.webServer, profile, host.loader), 'dsh-plugin: http routes');
    });
}
```

**依据 2 · 源码核查**：[src/client/index.tsx:18-41](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/client/index.tsx#L18-L41)

浏览器模块注入 locale 与 slots，注册独立设置面板。

<details>
<summary>查看原文（24行）</summary>

```text
export const name = NS
export const inject = ['slots', 'locale']

export function apply(ctx: HubClientContext): void {
  // 宿主内置语言只有 zh / en；pt 必须先注册进语言目录，否则 setLocale('pt') 会抛
  // 「locale "pt" is not registered」。别的语言包可能已经注册过 pt（含 pt-BR 这类），
  // 重复注册会抛错 —— 那种情况沿用已有定义即可，不能因此让整个插件加载失败。
  ctx.effect(() => {
    try {
      return ctx.locale.addLanguage(PT_LANGUAGE)
    } catch {
      return undefined
    }
  }, `${NS}: pt language`)
  ctx.effect(() => ctx.locale.register(NS, { zh, en, pt }), `${NS}: dictionaries`)
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: NS,
    order: 60,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t, locale: ctx.locale }),
  }, () => h(PluginHubSection, { t, locale: ctx.locale })))
```

</details>

**依据 3 · 源码核查**：[src/server/http/catalog.ts:119-149](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/catalog.ts#L119-L149)

目录语言只有中英，强制刷新绕过正常 TTL，回源失败仍用旧缓存。

<details>
<summary>查看原文（31行）</summary>

```text
        const isStats = url.searchParams.get('stats') === '1'
        // 目录语言：只有中文目录和英文目录两份。除 zh 以外的界面语言（en、pt…）
        // 都取英文目录，避免非中文用户拿到中文插件描述。
        const lang = url.searchParams.get('lang') === 'zh' ? 'zh' : 'en'
        const target = isStats
          ? 'https://api.dsh-plugin.org/stats.json'
          : `https://api.dsh-plugin.org/plugins.${lang}.json`
        // 1 小时本地缓存：命中直接返回（跨重启生效，插件市场秒开），未命中才走 curl 拉远程。
        // refresh=1 跳过 TTL 缓存直接回源（「强制刷新」用）；成功后照样覆盖缓存，
        // 失败仍回退旧缓存，所以强制刷新不会把可用的旧数据弄丢。
        const cacheFile = catalogCacheFile(profile, isStats ? 'stats' : `plugins-${lang}`)
        const forceRefresh = url.searchParams.get('refresh') === '1'
        const cached = forceRefresh ? null : readCatalogCache(cacheFile, CATALOG_CACHE_TTL_MS)
        if (cached !== null) {
          try {
            sendJson(response, 200, JSON.parse(cached))
            return
          } catch {
            // 缓存正文损坏：忽略，走重新拉取并覆盖写盘
          }
        }
        const r = await fetchCatalogOnce(target, proxy)
        if (!r.ok || r.body === '') {
          // 实时拉取失败：退回任意年龄的本地缓存（上次成功数据），
          // 避免证书吊销受阻 / 网络抖动时整个插件市场打不开 —— 数据可能过期，但好过空白。
          const stale = readCatalogCache(cacheFile, Number.POSITIVE_INFINITY)
          if (stale !== null) {
            try {
              sendJson(response, 200, JSON.parse(stale))
              return
            } catch {
```

</details>

**依据 4 · 源码核查**：[src/server/http/install.ts:197-222](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/install.ts#L197-L222)

入队并返回任务 ID，说明 HTTP 成功只取得任务 ID。

<details>
<summary>查看原文（26行）</summary>

```text
          if (hasQueuedTarget(target)) {
            sendJson(response, 409, { error: `already queued: ${target}` })
            return
          }
          // 后台启动 CLI；客户端轮询 /status 获取进度
          const task = startPluginMutation({
            // mode=update（已安装目标的覆盖更新）以 update 动作入队：
            // 日志按 update 类别写入磁盘（update.start/done/fail），实际 CLI 执行仍是 add <target>@latest
            action: mode === 'update' ? 'update' : 'add',
            profile,
            target,
            // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不因安装目标形态而变
            displayTarget: githubRepoOf(displayRepo) ?? undefined,
            // 覆盖更新：npm 命令显式 @latest（pnpm add 无版本对已存在依赖是幂等的，不加版本不会真更新）
            updateNpm: mode === 'update',
            // 运行中 loader：安装成功后把新插件热加载进 loader，非桌面端 + 纯服务端插件无需重启即生效
            loader,
            timeoutMs: COMMAND_TIMEOUT_MS,
            env: mutationEnv(settings),
            // 候选源（首选在前）：任务内遇到传输层失败时按顺序换源重试
            registries: ordered,
            installSpec,
            // 自定义安装入口渠道：日志/报错据此溯源
            installChannel,
          })
          sendJson(response, 200, { ok: true, task: task.id })
```

</details>

#### 缺口

- 未核对在线目录与 npm 包的实时对应关系。
  **影响**：无法据目录规模或刷新操作担保新鲜度。
  **进一步探讨**：在同一天抽样比对卡片、仓库声明、registry 元数据和本地已装版本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 标为目录安装时，包名映射、精确版本和脚本权限在哪里生效？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

普通目录安装先校验请求、目标包名和可选版本语法，再尝试根据展示仓库验证 npm 包属于该仓库且为 DSH 包。映射为真才记入已解析映射；false 不会返回拒绝，且 source 为 catalog 时跳过自定义 npm 安装开关。由此只能判断来源检查可改善回显匹配，无法把它作为目录安装的拒绝边界。可信 POST 是宿主请求约束，本机原生请求可以没有 Origin，而且它与 registry 中的制品归属是两个独立环节。

显式版本可以 pin，新装时尽力从首选源查过冷却期的版本；查不到时继续，未锁定的普通包可由 runner 增补 @latest。这里最多保证已选安装 spec 会交给命令，不能由目录上显示的版本一律推导实际安装版本。自定义源、网络或目标不确定时，用户还需核对将实际使用的 registry。

安装与更新走 profile pnpm 时，runner 先尝试修复已有 allowBuilds 键。精确版本留存，可识别的 Git 归档换成仓库键，其他 spec 可能降成裸包名；多个旧键归一到同一键时 Map 后写值覆盖。遇到 Git prepare 或依赖构建被拒时，runner 还会直接写 true 并重试。源内没有在这一分支展示二次授权，写盘可先于任务最终成功。因此任何要求批准每个精确包版本的操作者，都需要把实际 pnpm-workspace.yaml 与预期许可逐项比对。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/http/shared.ts:147-177](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/shared.ts#L147-L177)

请求需要 POST 和来源校验；来源规则中包含无 Origin 和宿主协议。

<details>
<summary>查看原文（31行）</summary>

```text
  // 此时所有 POST 都会被判成 untrusted origin。浏览器对 POST 请求
  // 必定携带 Origin（含同源 POST 与跨站表单），能省略该头的只有本机原生客户端，
  // 而它们本来就能伪造任意 Origin，因此放行不扩大 CSRF 面。
  if (origin === undefined || origin === '') return true
  try {
    const url = new URL(origin)
    // 桌面端（Electron 宿主）的页面跑在宿主自定义协议下，origin 形如 `dsh-app://app`，
    // 与 Host（如 localhost:3081）必然不等，因此必须显式放行该协议，否则桌面端全部 POST
    // 都会被判成 untrusted origin。该协议只有宿主自身能产生，外部网页无法把 Origin
    // 伪造成 `dsh-app://…`，放行不扩大 CSRF 面。
    if (url.protocol === 'dsh-app:') return true
    // 按归一化后的「主机名:端口」比较：`localhost` / `127.0.0.1` / `[::1]` 不再互相拒绝，
    // 端口仍然必须一致（另一个本机进程不能被当成同一来源）。
    return loopbackAuthority(url.host) === hostKey
  } catch {
    return false
  }
}

export function requireMethod(request: IncomingMessage, response: ServerResponse, method: 'GET' | 'POST'): boolean {
  if (request.method === method) return true
  response.writeHead(405, { allow: method })
  response.end()
  return false
}

export function requireTrustedPost(request: IncomingMessage, response: ServerResponse): boolean {
  if (!requireMethod(request, response, 'POST')) return false
  if (isSameOrigin(request)) return true
  sendJson(response, 403, { error: 'untrusted origin' })
  return false
```

</details>

**依据 2 · 源码核查**：[src/server/http/install.ts:121-147](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/install.ts#L121-L147)

同一路径中可核对包名与版本格式、映射成功支路、目录开关例外。

<details>
<summary>查看原文（27行）</summary>

```text
          // 自定义安装目标只接受 npm 包名（@scope/name 或 name）。
          if (!validPackageName(rawRepo)) {
            sendJson(response, 400, { error: 'unsupported install target: expected an npm package name' })
            return
          }
          const target = rawRepo
          // 锁定精确版本（Hub 自我更新）：最新版可能仍在 pnpm 发布冷却期内，
          // 客户端提示的是「已过冷却期」的版本，服务端必须按该版本安装而不是 @latest。
          const pinVersion = typeof (body as { version?: unknown }).version === 'string'
            ? (body as { version: string }).version.trim()
            : ''
          if (pinVersion !== '' && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?$/.test(pinVersion)) {
            sendJson(response, 400, { error: 'invalid version' })
            return
          }
          // 已尝试的安装方式（供失败提 Issue 预填）：保持为空
          const attempts: string[] = []
          // 目录插件安装：目录数据可能滞后于打包拆分，确认目录下发的 npm 目标确为该仓库的 DSH 包，
          // 命中则记录 repo → 包名映射，客户端据此把依赖 key 匹配回仓库、列表立即显示「已安装」。
          const catalogRepo = source === 'catalog' ? githubRepoOf(displayRepo) : null
          if (catalogRepo !== null) {
            const catalogTargetIsDsh = await isDshNpmPackageForRepo(rawRepo, catalogRepo, settings.npmRegistry, effectiveProxy, pinVersion)
            if (catalogTargetIsDsh) recordResolvedNpmPackage(profile, catalogRepo, rawRepo)
          }
          // 命令行安装（目录外）受「启用 NPM 安装」开关控制；目录插件安装走目录白名单，不受开关影响。
          if (source !== 'catalog' && !settings.enableNpmInstall) {
            sendJson(response, 403, { error: 'npm installs are disabled by the security settings' })
```

</details>

**依据 3 · 源码核查**：[src/server/http/install.ts:160-184](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/install.ts#L160-L184)

新装按顺序探测 registry，全部不可达时在入队前中止。

<details>
<summary>查看原文（25行）</summary>

```text
          // 安装前网络探测：探 registry 根而非具体包（404 是「包不存在」而非网络不通）；仅新安装执行，更新跳过。
          // 首选源不通时按候选顺序继续探下一个，能通的那个提到首位供实际安装使用。
          // 全部不通则 400 拦下并打 [network] 标记，客户端据此提示网络问题，而非插件问题。
          let ordered = registries
          if (already === null) {
            const tried: string[] = []
            let chosen: string | null = null
            for (const candidate of registries) {
              tried.push(candidate)
              const net = await probeUrl(`${candidate}/`, effectiveProxy, 6000)
              if (net.ok) {
                chosen = candidate
                break
              }
            }
            if (chosen === null) {
              // 错误消息按界面语言输出，让用户看清是网络问题而非插件问题
              const hosts = tried.map(registryHost).join(' → ')
              const error = lang === 'zh'
                ? `[network] 安装已中止：安装前无法连接到 npm 源（${hosts}）—— 您的网络似乎不通或被拦截（断网 / DNS 解析失败 / 防火墙 / 代理配置问题）。这不是插件本身的问题，请检查网络连接或代理设置，运行「系统诊断」检测各通道连通性后重试。`
                : `[network] install aborted: cannot reach the npm registry (${hosts}) before install — your network connection appears to be down or blocked (DNS / proxy / firewall). This is not a problem with the plugin itself. Check your connection or proxy settings, run the connectivity diagnostic, then retry.`
              sendJson(response, 400, { error, attempts })
              return
            }
            ordered = [chosen, ...registries.filter((r) => r !== chosen)]
```

</details>

**依据 4 · 源码核查**：[src/server/http/install.ts:186-194](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/install.ts#L186-L194)

版本查询无结果时保留未锁定策略。

```text
          // 新安装锁定「已过发布冷却期」的最高稳定版：pnpm 对发布还不满 24 小时的版本会不提示地回退，
          // 锁定后装到的就是预期版本。更新已有目标时客户端已按冷却期筛选，继续走 @latest。
          let installSpec = pinVersion !== '' ? `${target}@${pinVersion}` : undefined
          if (installSpec === undefined && already === null) {
            // 解析源与安装首选源一致，锁定的版本一定存在于真正会用的那个源；解析失败则不锁定，不阻断安装。
            // 超时 5s：网络刚探测通过，卡住时也不能把安装请求拖到默认的 8s
            const release = await lookupReleaseAge(target, ordered[0] ?? '', effectiveProxy, 5000)
            if (release !== null && release.installable !== null) installSpec = `${target}@${release.installable.version}`
          }
```

**依据 5 · 源码核查**：[src/server/services/install/task-queue.ts:226-232](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L226-L232)

未锁定的普通 add 或 update 目标显式补 @latest。

```text
export function npmInstallTargetOf(target: string, opts: { update: boolean; global: boolean; pinned?: string; add?: boolean }): string {
  if (opts.global || githubRepoOf(target) !== null) return target
  if (opts.pinned !== undefined && opts.pinned !== '') return opts.pinned
  // 裸包名才补 @latest：pnpm 对已存在的精确 spec 是幂等的，不显式要求就会留用旧版本
  if (!(opts.update || opts.add) || !validPackageName(target)) return target
  return `${target}@latest`
}
```

**依据 6 · 源码核查**：[src/server/services/profile/profile.ts:211-235](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/profile/profile.ts#L211-L235)

版本键、仓库键和裸包名的分流。

<details>
<summary>查看原文（25行）</summary>

```text
export function safeAllowBuildsKey(key: string): string {
  const at = key.startsWith('@') ? key.indexOf('@', 1) : key.indexOf('@')
  if (at <= 0) return key
  const name = key.slice(0, at)
  const spec = key.slice(at + 1)
  if (EXACT_VERSION_RE.test(spec)) return key
  const repo = gitRepoKeyOf(spec)
  return repo === null ? name : `${name}@${repo}`
}

/**
 * git-hosted spec → pnpm 认的 repo key。pnpm 报错里打印的是实际 fetch 的 tarball 地址
 * （codeload / bitbucket get / GitLab `-/archive`），直接写回会被当版本解析；
 * 归一成 `git+<repo>.git` 后 pnpm 走 gitRepos 规则匹配。认不出则返回 null。
 */
function gitRepoKeyOf(spec: string): string | null {
  if (spec.startsWith('git+')) return spec
  const github = /^https:\/\/codeload\.github\.com\/([^/]+)\/([^/]+)\/tar\.gz\//.exec(spec)
  if (github !== null) return `git+https://github.com/${github[1]}/${github[2]}.git`
  const bitbucket = /^https:\/\/bitbucket\.org\/([^/]+)\/([^/]+)\/get\//.exec(spec)
  if (bitbucket !== null) return `git+https://bitbucket.org/${bitbucket[1]}/${bitbucket[2]}.git`
  // GitLab / Gitea 等：https://host/owner/repo/-/archive/<ref>/...
  const generic = /^https:\/\/([^/]+)\/(.+?)\/-\/archive\/[^/]+\//.exec(spec)
  if (generic !== null) return `git+https://${generic[1]}/${generic[2]}.git`
  if (/^https?:\/\/.+\.git(?:#.*)?$/.test(spec)) return `git+${spec}`
```

</details>

**依据 7 · 源码核查**：[src/server/services/profile/profile.ts:243-253](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/profile/profile.ts#L243-L253)

既有配置依次归一后写回，重名键按 Map 后写生效。

<details>
<summary>查看原文（11行）</summary>

```text
export function sanitizeAllowBuilds(profile: string): boolean {
  const file = join(profileDirectory(profile), 'pnpm-workspace.yaml')
  let yaml = ''
  try { yaml = readFileSync(file, 'utf8') } catch { return false }
  if (Array.from(yaml.matchAll(ALLOW_BLOCK_RE)).length === 0) return false
  const before = readAllowBuilds(yaml)
  const after = new Map<string, string>()
  for (const [k, v] of before) after.set(safeAllowBuildsKey(k), v)
  if (after.size === before.size && Array.from(after).every(([k, v]) => before.get(k) === v)) return false
  writeFileSync(file, writeAllowBuilds(yaml, after))
  return true
```

</details>

**依据 8 · 源码核查**：[src/server/services/profile/profile.ts:266-272](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/profile/profile.ts#L266-L272)

重试许可向配置写 true。

```text
export function addAllowBuildsKey(profile: string, key: string): void {
  const file = join(profileDirectory(profile), 'pnpm-workspace.yaml')
  let yaml = ''
  try { yaml = readFileSync(file, 'utf8') } catch { /* 文件不存在，下方创建 */ }
  const map = readAllowBuilds(yaml)
  map.set(safeAllowBuildsKey(key), 'true')
  writeFileSync(file, writeAllowBuilds(yaml, map))
```

**依据 9 · 源码核查**：[src/server/services/install/task-queue.ts:945-982](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L945-L982)

装前维修、Git prepare 和忽略构建各有实际调用，分支可重新 spawn。

<details>
<summary>查看原文（38行）</summary>

```text
  if (options.action !== 'remove' && (options.globalNpm ?? []).length === 0) {
    try { sanitizeAllowBuilds(options.profile) } catch { /* 读不到/写不进就按原样继续 */ }
  }
  let result = await spawnMutation(options)
  // allowBuilds 放行 / 装后入口校验都是 profile 专属（pnpm 装进 profile 的场景）；
  // 全局 npm 安装直接走 npm，无 pnpm allowBuilds 拦截、也不进 profile，跳过这两类恢复
  // 安装与更新（同为 add 通道执行）共享同一套恢复路径；卸载不适用
  if (options.action !== 'remove' && result.exitCode !== 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const output = `${result.stderr}\n${result.stdout}`
    // git 源：pnpm 打印的 key@url 提示
    if (output.includes('ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED')) {
      const key = parseAllowBuildsKey(output)
      if (key !== null) {
        if (options.task) {
          // 首次尝试已把任务标为失败；重置它，让重试重新以 running 任务形式流式输出进度。
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${key}`)
        }
        addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
    // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
    // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
    // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
    // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
    if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
      const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`)
      if (keys.length === 0 && githubRepoOf(options.target) === null) keys.push(options.target)
      if (keys.length > 0) {
        if (options.task) {
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${keys.join(', ')}`)
        }
        for (const key of keys) addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
```

</details>

#### 缺口

- 未验证目标 pnpm 版本对归一键的匹配范围及安装失败后保留的文件。
  **影响**：不能推断用户环境一定触发或一定避开许可扩大。
  **进一步探讨**：用一次性 profile 比较精确包、仓库归一及无法识别来源三个样本的配置差异和运行日志。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 当安装失败、取消或宿主未加载时，界面状态究竟证明了什么？

**研究主题**：工程质量与复用、功能与机制、效果与总成本

#### 完整回答

队列将请求写入内存状态，运转时记录任务开始和终态。运行中取消会标记 cancelled 并结束当前子进程，待运行项则从队列移除。这里没有恢复 profile 旧清单的调用。刷新页面能跟随仍可查询的任务，客户端会再次请求 /status；服务端失联或找不到记录时客户端移除该项，因此列表消失不能当作系统已经回滚。CLI 退出成功后还会检查声明文件，缺文件可把任务改为失败并清除待重启记录，该处没有撤销已经写入的依赖。界面提示需要的重启或刷新同样属于任务结果，不表示实际功能已能在该进程调用。

故障信息的新增收益是能把部分非常相似的现象分开。命令报告失败但只有包装提示时，服务先尝试补取操作日志，仍缺有效内容时附退出方式、registry 主机及实际命令、工作目录和 profile。前端将 pnpm 入口模块缺失的特定错误形态归作环境问题，有服务端诊断标记时放弃该启发式，让更具体的证据处理。通知页给对应修复指引，分发缺文件则有独立标记。日志改进让人工排查有抓手，仍需要操作者核实路径与状态。若转贴报告，实际命令和本机目录也要复核。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/services/install/task-queue.ts:118-135](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L118-L135)

两种取消分支的实际动作，没有清单回退。

<details>
<summary>查看原文（18行）</summary>

```text
export function cancelTask(id: number): boolean {
  const task = tasks.get(id)
  if (!task) return false
  if (task.status === 'pending') {
    const index = queue.findIndex((it) => it.task === task)
    if (index >= 0) queue.splice(index, 1)
    task.status = 'cancelled'
    pushLine(task, '[cancelled]')
    return true
  }
  if (task.status === 'running') {
    task.status = 'cancelled'
    pushLine(task, '[cancelled]')
    const child = runningChildren.get(id)
    if (child) stopChild(child)
    return true
  }
  return false
```

</details>

**依据 2 · 源码核查**：[src/server/services/install/task-queue.ts:325-361](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L325-L361)

任务首先登记、排队、开始记录与调度，后台 worker 调用实际变更。

<details>
<summary>查看原文（37行）</summary>

```text
  nextTaskId = nextTaskId >= Number.MAX_SAFE_INTEGER ? 1 : nextTaskId + 1
  tasks.set(task.id, task)
  if (tasks.size > MAX_TASKS) {
    let removed = false
    tasks.forEach((candidate, id) => {
      if (!removed && candidate.status !== 'running' && candidate.status !== 'pending') {
        tasks.delete(id)
        removed = true
      }
    })
  }
  queue.push({ task, options: { ...options } })
  // 任务输出首行标记入口渠道（ASCII 标记，乱码免疫）：进度面板/失败明细里能溯源「从哪张卡片发起」
  if (options.installChannel !== undefined) {
    pushLine(task, `[install-channel] ${options.installChannel}`)
  }
  // 系统日志：记录任务入队（安装/卸载/更新开始），自定义安装带入口渠道后缀
  const category = mutationCategory(options.action)
  appendLog(options.profile, {
    at: Date.now(),
    level: 'info',
    category,
    event: `${category}.start`,
    message: `${mutationVerb(options.action)} ${options.displayTarget ?? options.target}${channelLabel(options.installChannel)}`,
  })
  pumpQueue()
  return task
}

/** 队列 worker：同一时刻最多跑一个变更；占位空出时取下一个 pending 任务。 */
function pumpQueue(): void {
  if (hasRunningTask()) return
  const item = queue.find((it) => it.task.status === 'pending')
  if (!item) return
  const { task, options } = item
  task.status = 'running'
  void runPluginMutation({ ...options, task })
```

</details>

**依据 3 · 源码核查**：[src/client/hooks/useTaskQueue.ts:285-313](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/client/hooks/useTaskQueue.ts#L285-L313)

客户端回读终态和重启提示，失联或未知时移除行。

<details>
<summary>查看原文（29行）</summary>

```text
      const res = await fetch(`/dsh-plugin-hub/status?task=${q.id}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json() as { task?: { status?: string; lines?: string[]; attempts?: string[]; needsRestart?: unknown; needsReload?: unknown; bundleDeselected?: unknown; installedVersion?: unknown } }
        const task = data.task
        if (task !== undefined) {
          status = task.status ?? 'failed'
          lines = task.lines ?? []
          attempts = Array.isArray(task.attempts) ? task.attempts : undefined
          bundleDeselected = task.bundleDeselected === true ? true : undefined
          installedVersion = typeof task.installedVersion === 'string' && task.installedVersion !== '' ? task.installedVersion : undefined
          // 终态带出的「是否需要重启 / 是否只需刷新」覆盖本地（服务端 done 时按 loader 热加载/即时移除情况设置）
          const needsRestart = typeof task.needsRestart === 'boolean' ? task.needsRestart : q.needsRestart
          const needsReload = typeof task.needsReload === 'boolean' ? task.needsReload : (q.needsReload ?? false)
          if (status === 'done') {
            const settled = { ...q, needsRestart, needsReload, bundleDeselected: bundleDeselected === true ? true : q.bundleDeselected, installedVersion }
            // 卸载成功走进度过渡动画；安装成功直接收尾
            if (q.kind === 'uninstall') settleDone(settled, lines)
            else finishQueueTask(true, settled, lines)
            return
          }
          if (status === 'failed') {
            // 服务端终态带出的尝试记录覆盖本地：以实际执行为准
            finishQueueTask(false, { ...q, attempts }, lines)
            return
          }
        }
      }
    } catch { /* 服务端不可达：按失败处理 */ }
    applyQueue((prev) => prev.filter((x) => x.id !== q.id)) // cancelled / 未知
```

</details>

**依据 4 · 源码核查**：[src/server/services/install/task-queue.ts:896-911](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L896-L911)

失败补充字段包括命令、工作目录和 profile，registry 用主机名。

<details>
<summary>查看原文（16行）</summary>

```text
export function sparseFailureMarker(result: InstallResult, options: {
  action: 'add' | 'remove' | 'update'
  profile: string
  registries?: string[]
}): string {
  const verb = options.action === 'remove' ? 'uninstall' : options.action === 'update' ? 'update' : 'install'
  const outcome = result.timedOut ? 'timed out' : `exited with code ${result.exitCode ?? '?'}`
  const registry = result.registry ?? options.registries?.[0] ?? 'unknown'
  const spawn = result.spawn
  return [
    `[no-output] the ${verb} command ${outcome} and printed nothing but its wrapper line`,
    `registry: ${registryHost(registry)}`,
    spawn === undefined ? '' : `spawn: ${spawn.file} ${spawn.args.join(' ')} (cwd ${spawn.cwd}, shell ${spawn.shell})`,
    `profile: ${profileDirectory(options.profile)}`,
    'no pnpm log under .plugin-manager/logs — attach hub.log when reporting',
  ].filter((part) => part !== '').join(' | ')
```

</details>

**依据 5 · 源码核查**：[src/server/services/install/task-queue.ts:991-1003](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L991-L1003)

入口缺失检查在 CLI 成功之后报打包错误并清理待重启记录。

<details>
<summary>查看原文（13行）</summary>

```text
  if (options.action !== 'remove' && result.exitCode === 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const verified = verifyInstalledEntry(options.profile, options.target)
    if (verified.name !== null && verified.missing !== null) {
      clearPendingRestart(options.displayTarget ?? options.target)
      const detail = `[packaging] ${verified.name}: declared file missing: ${verified.missing} (the published package is missing this file — report it to the author)`
      if (options.task && options.task.status !== 'cancelled') {
        options.task.status = 'failed'
        options.task.exitCode = null
        options.task.progress = 0
        pushLine(options.task, detail)
      }
      return { exitCode: 1, timedOut: false, error: `declared file missing: ${verified.missing}`, stdout: result.stdout, stderr: `${result.stderr}\n${detail}` }
    }
```

</details>

**依据 6 · 源码核查**：[src/server/services/install/task-queue.ts:1005-1032](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L1005-L1032)

日志回捞和空输出补充在最终错误记录上生效。

<details>
<summary>查看原文（28行）</summary>

```text
  // 宿主只把一行摘要（`dsh: plugin command failed; diagnostics: <path>`）回显到控制台、真正的报错
  // 写进该日志文件时，前端拿不到任何错误特征、只能归为「未知」。按该路径回捞日志尾部补进失败信息。
  // 只在输出本就不含错误码时回捞 —— pnpm 已回显报错时无需多读一次文件。
  // 超时同样回捞：被强杀前 pnpm 往往已经把真实原因写进 operation 日志。
  if ((result.exitCode !== 0 || result.timedOut) && !/\bERR_[A-Z0-9_]+\b/.test(`${result.stderr}\n${result.stdout}`)) {
    const output = `${result.stderr}\n${result.stdout}`
    const backfilled = tappedLog !== '' ? tappedLog : backfillOperationLog(output, profileDir)
    if (backfilled !== null) {
      if (options.task && options.task.status !== 'cancelled') {
        pushLine(options.task, '[pnpm log] DSH did not echo pnpm output — recovered the operation log from disk')
        for (const line of backfilled.split(/\r?\n/)) if (line.trim() !== '') pushLine(options.task, line.trimEnd())
      }
      result = { ...result, stderr: `${result.stderr}\n${backfilled}` }
    } else if (options.task && options.task.status !== 'cancelled') {
      if (operationLogPathOf(output) !== null) {
        // 诊断路径在、日志却取不到：留一行证据，否则下一次同类上报又只剩宿主那句摘要、看不出根因
        pushLine(options.task, '[pnpm log] the host-reported diagnostics log could not be read from disk (missing, empty, or unreadable)')
      }
    }
  }
  // 失败但输出里只剩外层包装（`Command failed with exit code 1: pnpm add …`）时，上报正文会退化成
  // 一句「安装失败」：既看不出跑了什么，也看不出连的是哪个源（#6118 的形态）。补一条诊断标记，
  // 把实际启动参数、profile 目录与生效的 registry 带进日志和上报正文。
  if ((result.exitCode !== 0 || result.timedOut) && lacksDiagnosticContent(`${result.stderr}\n${result.stdout}`)) {
    const line = sparseFailureMarker(result, options)
    if (options.task && options.task.status !== 'cancelled') pushLine(options.task, line)
    result = { ...result, stderr: `${result.stderr}\n${line}` }
  }
```

</details>

**依据 7 · 源码核查**：[src/client/logic/failures.ts:259-267](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/client/logic/failures.ts#L259-L267)

特征匹配只接受特定 pnpm 入口缺失形态，并让位给本服务更明确的诊断标记。

```text
  // 本机缺 pnpm。必须在 dshMissing 之前 —— 后者的裸「command not found」会吞掉 pnpm 缺失
  if (/\[pnpm-missing\]|pnpm not found|pnpm: command not found|spawn pnpm ENOENT|'pnpm' 不是内部或外部命令|"pnpm" 不是内部或外部命令|pnpm['"]?\s*is not recognized/i.test(message)) return 'pnpmMissing'
  // pnpm 命令在、但入口模块缺失：全局 pnpm 安装损坏（store 链接目录被清空），或宿主内置的 pnpm
  // 运行时没打进这次发行包。日志形态是 Node 的 `Cannot find module '…\pnpm\bin\pnpm.mjs'`，
  // 还没进到依赖解析 —— 装任何插件都会同样失败，属本机环境，不能兜底成 unclassified（#806/#810）。
  // 但本服务注入的诊断标记比这条日志形状更权威（例如装后校验的 [packaging]），
  // 同时出现时跳过这里，交给后面的标记分支判定
  if (!hasOwnDiagnosticMarker(message)
      && /Cannot find module [^\n]*[\\/]pnpm(?:[\\/][^\n]*)?\.(?:c|m)?js\b|ERR_MODULE_NOT_FOUND[^\n]*[\\/]pnpm/i.test(message)) return 'pnpmBroken'
```

**依据 8 · 源码核查**：[src/client/components/modals/NotificationsModal.tsx:289-298](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/client/components/modals/NotificationsModal.tsx#L289-L298)

通知页对 pnpm 缺失和入口损坏给出不同提示。

<details>
<summary>查看原文（10行）</summary>

```text
                    if (kind === 'pnpmMissing') {
                      // 找到了 dsh 但缺 pnpm（dsh 用它管理 profile 插件；dsh 报 pnpm not found on PATH）：
                      // 本机缺 pnpm，不是插件问题 —— 给安装指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmMissingHint'))
                    }
                    if (kind === 'pnpmBroken') {
                      // pnpm 命令在但入口模块缺失（全局安装损坏 / 宿主内置 pnpm 没打全）：
                      // 装任何插件都会同样失败，给修复指引，不引导提 Issue
                      return h('div', { className: styles.failPrepareHint }, t('failPnpmBrokenHint'))
                    }
```

</details>

#### 缺口

- 没有各种本机和随应用分发环境的真实故障样本。
  **影响**：无法知道分类准确率，也不能确认取消后复原时间。
  **进一步探讨**：在相同固定宿主版本分别模拟损坏的 pnpm、缺文件的目标包和运行中取消，对照配置、文件与诊断。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪种试用有明确退出条件，怎样验证更严格的确认计划？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合已有可丢弃 Web profile 的 DSH 维护者先浏览已知社区包，核对原仓库、包名与显示版本，再从同一页检查已有安装记录。相对手工切换目录和命令，这里能把现有依赖与目录并排审视。只读仍会访问目录和可能使用旧缓存，但不需要触发安装路由。正式 profile 不能接受自动改写构建许可，或者目录无法落实到目标包及版本时，应停止使用市场的变更入口，回到原仓库及官方管理命令核对。若在隔离环境验证变更，试验前保留 profile 文件，对照任务 ID、依赖、锁文件、许可键和宿主加载，不能用任务标签代替对照。成本包括搭建隔离 profile、核查 registry、处理日志与恢复状态，现金和耗时未测。

由映射 false 后继续、解析不到发布版本仍可入队、构建拦截后写 true 三点，可推导一个待验证设计。执行前显示包名、精确版本、registry、需要新放行的键及 profile 的短期确认计划；实际执行重新核对它们，遇到新增许可则回到确认。用同一批合法包、错误映射包和需构建包，比较现有流程与确认计划的意外写入次数、正确完成率和额外人工步骤；如果只能挡住可接受的包，却不能减少未预期的许可变化，假设即缺乏支持。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/http/catalog.ts:107-128](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/catalog.ts#L107-L128)

浏览通过独立 GET 接口完成，目录取数与变更入口分离。

<details>
<summary>查看原文（22行）</summary>

```text
      path: '/dsh-plugin-hub/catalog',
      handler: async (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 目录/统计数据服务端代理：浏览器不直连 dsh-plugin.org，统一经此路由
        // 转发（curl 子进程注入代理 env），与 npm / git 安装通道走同一代理规则，
        // 「npm / git / 目录数据请求统一走该代理」的设置文案因此真实生效。
        const url = new URL(request.url ?? '/', 'http://localhost')
        const settings = loadSettings(profile)
        // 代理优先级与安装/诊断一致：设置里的代理 → 系统代理 → 环境变量 → 直连
        const proxy = settings.proxy !== ''
          ? settings.proxy
          : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
        const isStats = url.searchParams.get('stats') === '1'
        // 目录语言：只有中文目录和英文目录两份。除 zh 以外的界面语言（en、pt…）
        // 都取英文目录，避免非中文用户拿到中文插件描述。
        const lang = url.searchParams.get('lang') === 'zh' ? 'zh' : 'en'
        const target = isStats
          ? 'https://api.dsh-plugin.org/stats.json'
          : `https://api.dsh-plugin.org/plugins.${lang}.json`
        // 1 小时本地缓存：命中直接返回（跨重启生效，插件市场秒开），未命中才走 curl 拉远程。
        // refresh=1 跳过 TTL 缓存直接回源（「强制刷新」用）；成功后照样覆盖缓存，
        // 失败仍回退旧缓存，所以强制刷新不会把可用的旧数据弄丢。
```

</details>

**依据 2 · 源码核查**：[src/server/http/install.ts:138-148](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/install.ts#L138-L148)

目录匹配与开关分支解释了为什么确认计划要绑定身份。

<details>
<summary>查看原文（11行）</summary>

```text
          // 目录插件安装：目录数据可能滞后于打包拆分，确认目录下发的 npm 目标确为该仓库的 DSH 包，
          // 命中则记录 repo → 包名映射，客户端据此把依赖 key 匹配回仓库、列表立即显示「已安装」。
          const catalogRepo = source === 'catalog' ? githubRepoOf(displayRepo) : null
          if (catalogRepo !== null) {
            const catalogTargetIsDsh = await isDshNpmPackageForRepo(rawRepo, catalogRepo, settings.npmRegistry, effectiveProxy, pinVersion)
            if (catalogTargetIsDsh) recordResolvedNpmPackage(profile, catalogRepo, rawRepo)
          }
          // 命令行安装（目录外）受「启用 NPM 安装」开关控制；目录插件安装走目录白名单，不受开关影响。
          if (source !== 'catalog' && !settings.enableNpmInstall) {
            sendJson(response, 403, { error: 'npm installs are disabled by the security settings' })
            return
```

</details>

**依据 3 · 源码核查**：[src/server/http/install.ts:186-194](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/http/install.ts#L186-L194)

可执行版本并非始终预先锁定。

```text
          // 新安装锁定「已过发布冷却期」的最高稳定版：pnpm 对发布还不满 24 小时的版本会不提示地回退，
          // 锁定后装到的就是预期版本。更新已有目标时客户端已按冷却期筛选，继续走 @latest。
          let installSpec = pinVersion !== '' ? `${target}@${pinVersion}` : undefined
          if (installSpec === undefined && already === null) {
            // 解析源与安装首选源一致，锁定的版本一定存在于真正会用的那个源；解析失败则不锁定，不阻断安装。
            // 超时 5s：网络刚探测通过，卡住时也不能把安装请求拖到默认的 8s
            const release = await lookupReleaseAge(target, ordered[0] ?? '', effectiveProxy, 5000)
            if (release !== null && release.installable !== null) installSpec = `${target}@${release.installable.version}`
          }
```

**依据 4 · 源码核查**：[src/server/services/install/task-queue.ts:968-984](https://github.com/dshplugin/dsh-plugin-hub/blob/3028ea9c0f23f24fa2c73eb4051710356f627390/src/server/services/install/task-queue.ts#L968-L984)

自动放行说明显式绑定构建许可可能改善哪项决策。

<details>
<summary>查看原文（17行）</summary>

```text
    // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
    // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
    // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
    // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
    if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
      const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`)
      if (keys.length === 0 && githubRepoOf(options.target) === null) keys.push(options.target)
      if (keys.length > 0) {
        if (options.task) {
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${keys.join(', ')}`)
        }
        for (const key of keys) addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
```

</details>

#### 缺口

- 确认计划是未实现假设，无同任务效果对照。
  **影响**：无法判断人为多一步是否值得。
  **进一步探讨**：记录合法目标提交成功和异常目标拒绝的总成本，对照意外变更而非只比是否最终安装。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
