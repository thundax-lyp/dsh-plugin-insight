# DSH Plugins Marketplace

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d408372](https://github.com/bradeGithub/DSH-Plugins-Marketplace/tree/d4083728c32fe224c97cb828285068de16418421)

<!-- BEGIN META -->
[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bradeGithub/DSH-Plugins-Marketplace) [![npm 30d 11,597](https://img.shields.io/static/v1?label=npm+30d&message=11%2C597&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-marketplace) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-marketplace)
<!-- END META -->

> **功能**：在 DSH 设置页浏览第三方插件与 Skill 索引，识别安装形态并组织材料、确认、安装和版本状态。

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02)把静态发现、异构安装材料/风险选择和profile管理集中GUI，减少手工识别分发形态。官方bundle拒绝不绕过与缓存来源核查是可追踪取舍，但第三方执行能力来自OS/宿主。

> **主要限制**：[Q02](#research-q02)multi-skill记录共享skillsDir而卸载递归删location，缺少逐Skill归属，可波及其他Skill；[Q03](#research-q03)仅本机/LAN控制非用户认证，确认不隔离代码，断线不取消。该缺陷限制正式安装/卸载推荐，不以安全扫描或数量抵消。

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
  - [Q01 · 市场相对GitHub手搜和宿主安装器增加什么？](#detail-section-11)
  - [Q02 · 从HTTP到风险确认/安装/卸载如何接线，失败能否局部恢复？](#detail-section-12)
  - [Q03 · 本机授权与供应链边界支持生产安装吗？](#detail-section-13)
  - [Q04 · 索引/状态能否等安装可信，新方向怎么证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH用户在GUI发现和管理第三方能力；原GitHub手搜+官方安装器基线。合格结果需预期来源与权限、可局部卸载及加载效果，不是收录/安装记录。

GitHub搜索与官方pluginManager已有发现/安装基础；根增加静态索引缓存、异构形态识别和交互，不冒领宿主bundle回滚。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 索引GUI | 发现第三方能力 | 收录/Star非安全背书 |
| 形态安装 | 材料/确认与manager分流 | 第三方执行有OS权限 |
| 卸载/记录 | 管理通过市场的安装 | multi-skill共享目录旁删缺陷 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/Node | 市场需 | API/UI | 缺服务apply失败 |
| Git/npm/pnpm/脚本解释器 | 形态相关 | 取包与执行 | 失败可能partial，非全回滚 |
| pluginManager与当前profile | 官方bundle路径需 | 宿主兼容/装配 | 明确拒绝不回退 |
| 用户信任/备份 | 执行前需 | 供应链和恢复 | 确认非sandbox |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 观察 | 读索引并回仓核固定来源 | 收录非背书 |
| 隔离验证 | 可丢弃profile测多Skill卸载 | 不碰重要能力库 |
| 确认 | 核材料/脚本权限和版本 | answers非用户认证 |
| 失败 | 查实际profile/目录/外部副作用 | HTTP断线非取消 |
| 退出 | 重要资料先独立备份，优先官方管理 | 不盲卸多Skill包 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网络/缓存/包工具 | profile与来源核查 | 金额工时未知 |
| 持续 | 第三方服务/存储 | 更新/供应链/徽章复核 | 索引不证质量 |
| 失败恢复 | partial与备份空间 | 修目录/patch/外部副作用 | 卸载旁删风险 |
| 退出 | records/log/cache与第三方数据 | 手工/官方回退和凭据撤销 | 非第三方动作回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现便利 | 缓存/单飞/GUI | 实时覆盖和推荐质量 |
| 安装组织 | 鉴权/确认/类型/官方分流 | 固定来源/运行效果 |
| 卸载归属 | records消费可追踪 | multi-skill局部删除不成立 |
| 安全 | 本机/LAN请求限制与扫描 | 用户隔离/代码无害 |

> **思考**：[Q02](#research-q02)multi-skill记录共享skillsDir而卸载递归删location，缺少逐Skill归属，可波及其他Skill；[Q03](#research-q03)仅本机/LAN控制非用户认证，确认不隔离代码，断线不取消。该缺陷限制正式安装/卸载推荐，不以安全扫描或数量抵消。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02)把静态发现、异构安装材料/风险选择和profile管理集中GUI，减少手工识别分发形态。官方bundle拒绝不绕过与缓存来源核查是可追踪取舍，但第三方执行能力来自OS/宿主。

[Q02](#research-q02)分层/原点缓存/官方拒绝不绕过可追溯，但位置汇总与卸载消费失配构成旁删缺陷；无统一事务/断线取消不应藏在界面成功后。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)multi-skill记录共享skillsDir而卸载递归删location，缺少逐Skill归属，可波及其他Skill；[Q03](#research-q03)仅本机/LAN控制非用户认证，确认不隔离代码，断线不取消。该缺陷限制正式安装/卸载推荐，不以安全扫描或数量抵消。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)正式管理observe，先修并在丢弃profile验multi-skill只删所属项。发现结果可回仓人工审，保留原官方安装/独立备份退路。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源支持市场/确认/官方或自有安装链；确定multi-skill卸载归属缺陷，未运行破坏性复现，生产观察。ownership是假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、lib/app/feedback.js、lib/app/install-exec.js、lib/app/install.js、lib/app/list-runtime.js、lib/app/uninstall.js、lib/http/auth.js、lib/http/routes.js、lib/index.js、lib/infra/proc.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定plugin source定向apply/auth/routes/list-runtime、prepare/preflight/executor/记录、multi-skill卸载、feedback/proc。未全审self-update签名/backup-WebDAV/全部client与第三方仓库，不执行安装或反馈。
- 下一步：[Q04](#research-q04)两既有Skill+多Skill包与冲突/改动矩阵先验证旁删；另核来源一致/失败恢复/真实宿主。本轮无目标执行。

**分析版本**

- **仓库**：[bradeGithub/DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace)
- **版本号**：1.7.2（[固定提交 d408372](https://github.com/bradeGithub/DSH-Plugins-Marketplace/tree/d4083728c32fe224c97cb828285068de16418421)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)逐文件/目录ownership与来源commit、hash/共享引用复核可能防旁删。可丢弃profile对照多包冲突/用户修改后卸载，旁删不降或误阻断过高则否定，未实现不计贡献。

[Q04](#research-q04)两既有Skill+多Skill包与冲突/改动矩阵先验证旁删；另核来源一致/失败恢复/真实宿主。本轮无目标执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 3659 | — | — | 72014 |
| .js | source | 45 | 10700 | 8612 | 1625 | — |
| .mjs | source | 20 | 7347 | 6190 | 995 | — |
| .mjs | example | 2 | 334 | 307 | 13 | — |
| .mjs | test | 101 | 21276 | 17782 | 2195 | — |

</details>

**活跃度**

[![Issue 未关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/bradeGithub/DSH-Plugins-Marketplace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 63](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=63&color=737b86&logo=github)](https://github.com/bradeGithub/DSH-Plugins-Marketplace/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 86](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=86&color=737b86&logo=github)](https://github.com/bradeGithub/DSH-Plugins-Marketplace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核市场安装与卸载真实权限/归属链，不以索引数量或徽章推安全。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场相对GitHub手搜和宿主安装器增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH市场plugin，为已有DSH用户在Web设置页发现第三方插件/Skill并启动安装。基线是GitHub搜索、读README、官方插件管理器安装和手工跟版本。合格结果应是安装预期固定来源、明确权限/材料并能局部卸载，列表数量或Star不是安全与兼容背书。根apply要webServer并惰性attach官方pluginManager；市场新增索引/类型识别/材料和风险交互，不把官方bundle兼容与回滚归为自己的新机制。

list-runtime对列表single-flight与10分钟缓存，来源cache有warning；可减少重复请求，但陈旧缓存和静态索引不等实时全生态。README的9500+/20000+与每2小时覆盖是作者声明，本轮不逐源确认。发布包1.7.2导出Host和Client，是真实DSH插件，不是纯目录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/README.md#L1-L15)

作者市场定位与数量宣称。

<details>
<summary>查看原文（15行）</summary>

```text
# DSH 插件市场（dsh-plugin-marketplace）

中文 · [English](README.en.md)

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）打造的插件市场插件：自动索引 GitHub `dsh-plugin` topic 下的全部插件，在 DSH Web GUI 设置页以卡片展示，支持一键安装、版本检测与自动更新，无需命令行。

<p align="center">
  <img src="https://img.shields.io/github/v/release/bradeGithub/DSH-Plugins-Marketplace?label=release" alt="Release">
  <img src="https://img.shields.io/github/actions/workflow/status/bradeGithub/DSH-Plugins-Marketplace/registry.yml?label=registry%20CI" alt="Registry CI">
  <img src="https://img.shields.io/github/stars/bradeGithub/DSH-Plugins-Marketplace?logo=github" alt="GitHub Stars">
  <img src="https://img.shields.io/github/license/bradeGithub/DSH-Plugins-Marketplace" alt="License">
</p>

<p align="center">
  <b>9500+</b> DSH 插件 &nbsp;·&nbsp; <b>20000+</b> 通用 Skills &nbsp;·&nbsp; <b>2 小时</b> 增量收录 &nbsp;·&nbsp; 浏览侧 <b>0</b> 次 GitHub API 调用
```

</details>

**依据 2 · 源码核查**：[package.json:1-25](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/package.json#L1-L25)

真实Host/client/bundle入口。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "dsh-plugin-marketplace",
  "version": "1.7.2",
  "description": "DSH插件市场 / DSH Plugin Marketplace: browse & install plugins from the GitHub topic:dsh-plugin",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "icon": "./assets/icon.svg",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "immediately": true
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1376-1393](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/index.js#L1376-L1393)

webServer与官方manager接入。

<details>
<summary>查看原文（18行）</summary>

```text
function apply(ctx) {
  const webServer = ctx.get("webServer");
  if (webServer === void 0) throw new Error("dsh-plugin-marketplace: webServer service unavailable");

  // 绑定进程内插件管理器（宿主自带的安装器）。惰性获取：老版本 DSH 没有这个服务，
  // 不能写进 export const inject（cordis 的 inject 项都是必需依赖，会导致插件起不来）。
  const builtinAvailable = pluginManagerAdapter.attach(ctx);
  ctx.logger?.info?.(builtinAvailable
    ? `dsh-plugin-marketplace: 已接入宿主内置插件管理器（${pluginManagerAdapter.profileDir() ?? "unknown profile"}）`
    : "dsh-plugin-marketplace: 宿主未提供内置插件管理器，安装/卸载使用市场自带路径");

  // 写操作会话 token 注入页面（LAN 模式校验用；回环模式注入无害）。
  // tapIndex 是 webserver 的 HTML 变换通道（fallback owner 每次 index 响应都调用）；
  // 低版本 DSH 无此 API 时跳过——LAN 写操作会因拿不到 token 而拒绝（fail-closed）。
  if (typeof webServer.tapIndex === "function") {
    const tapDisposer = webServer.tapIndex((html) => html.replace("</head>", `<script>window.__DSH_MP_TOKEN__="${auth.getToken()}"</script></head>`));
    // 0.1.7 运行时卸载契约：tapIndex 返回 disposer，随 fiber 卸载移除变换
    if (typeof ctx.effect === "function") ctx.effect(() => tapDisposer, "dsh-plugin-marketplace: tapIndex");
```

</details>

**依据 4 · 源码核查**：[lib/app/list-runtime.js:1-50](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/list-runtime.js#L1-L50)

TTL/single-flight与缓存来源警告。

<details>
<summary>查看原文（50行）</summary>

```text
// Runtime owner for in-memory marketplace list caching.
// Registry/cache IO is injected; HTTP filtering and response shaping stay outside.
export function createListRuntime({
  loadRegistryRepos,
  now = () => Date.now(),
  ttlMs = 10 * 60 * 1000,
  warn = () => {},
}) {
  const listSources = { dsh: "registry", skills: "registry" };
  const listCaches = {
    dsh: { at: 0, repos: null },
    skills: { at: 0, repos: null },
  };
  const listFetchings = { dsh: null, skills: null };

  function cacheFor(kind) {
    return listCaches[kind] ?? (listCaches[kind] = { at: 0, repos: null });
  }

  async function fetchAllRepos(kind = "dsh", force = false) {
    const result = await loadRegistryRepos(kind, force);
    const repos = Array.isArray(result?.repos) ? result.repos : [];
    listSources[kind] = result?.source ?? "registry";
    if (listSources[kind] === "cache") {
      warn(`[dsh-plugin-marketplace] 索引网络源与内置索引均不可用，使用本地磁盘缓存（${kind}，${repos.length} 条）`);
    }
    return repos;
  }

  async function getList(kind = "dsh", force = false) {
    const cache = cacheFor(kind);
    if (!force && cache.repos !== null && now() - cache.at <= ttlMs) return cache.repos;
    if (listFetchings[kind] == null) {
      listFetchings[kind] = fetchAllRepos(kind, force)
        .then((repos) => {
          listCaches[kind] = { at: now(), repos, source: listSources[kind] ?? "registry" };
          return repos;
        })
        .finally(() => {
          listFetchings[kind] = null;
        });
    }
    return await listFetchings[kind];
  }

  function getCacheState(kind = "dsh") {
    const cache = cacheFor(kind);
    return {
      at: cache.at,
      repos: Array.isArray(cache.repos)
```

</details>

#### 缺口

- 实时索引覆盖、各第三方包兼容与实际安装用户收益未验证。
  **影响**：不能以条目数或收录升级推荐。
  **进一步探讨**：固定一个测试profile，先独立核少量可信来源/版本与官方安装基线。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从HTTP到风险确认/安装/卸载如何接线，失败能否局部恢复？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

install路由先isWriteAllowed、参数格式、全局安装mutex并快照profile，prepare/cache→CLI hint flow→preflight→useCase。prepare比origin避免slug碰撞误用/误删，clone默认分支depth1并递归允许子模块；缓存复用和后续实际bundle github:repo依赖不天然绑定同一commit。preflight按类型提材料和secrets/vuln/bundle/script/npm生命周期/build等确认，answers字段是客户端返回选择，不是独立用户认证或受限执行权限。

index wrapper实时算canUseBuiltinInstaller，bundle官方manager可用就installBundle，明确拒绝直接抛错不复制绕过；不可用才市场旧路径。Skill/预设复制拒symlink，脚本直接bash/pwsh执行，授权后具备宿主OS能力，过滤env不等sandbox。useCase安装成功存location/names/version并排队反馈，失败清cache并返回failed，不见一项对所有已写profile/外部脚本副作用的统一事务撤销；HTTP断线没有在该链传AbortSignal，不能把请求失败当执行停止。

确认一个具体源码缺陷：多Skill安装返回type=skill、names多个、location=共享skillsDir。卸载分支只有agent-preset按names逐个删，skill进入通用location分支，允许location===skillsDir后recursive rm，能删除整个受管Skill目录并波及其他安装Skill。此判断来自确定的返回/消费接线，未运行破坏性复现；不能称完整卸载隔离。rm错误还被catch吞掉并计removed，不证明文件都已删除。

#### 证据与依据

**依据 1 · 源码核查**：[lib/http/routes.js:701-797](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/http/routes.js#L701-L797)

真实鉴权/锁/prepare/preflight/useCase链，无disconnect取消传递。

<details>
<summary>查看原文（97行）</summary>

```text
    path: "/api/marketplace/install",
    handler: async (req, res) => {
      const lang = langOf(req, { lang: "" });
      if (req.method !== "POST") return marketplaceJson(res, 405, { error: t(lang, "methodNotAllowed") });
      if (!(await isWriteAllowed(req))) return marketplaceJson(res, 403, { error: t(lang, "forbidden") });
      let body;
      try {
        body = await readJsonBody(req);
      } catch (error) {
        return marketplaceJson(res, error.status === 413 ? 413 : 400, {
          error: t(lang, error.status === 413 ? "bodyTooLarge" : "badRequest")
        });
      }
      const langFull = langOf(req, body);
      const repo0 = typeof body.repo === "string" ? body.repo.trim() : "";
      const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
      if (!/^[\w.-]+\/[\w.-]+$/.test(repo0)) return marketplaceJson(res, 400, { error: t(langFull, "badRepo") });
      const redirected = adaptorRedirectRepo(repo0);
      const repo = redirected ?? repo0;
      if (installMutex.isBusy()) return marketplaceJson(res, 409, { error: t(langFull, "installBusy") });
      const installProfile = profileName();
      const installProfilePaths = {
        profileDir: profileDir(installProfile),
        nodeModules: profileNodeModules(installProfile),
        patchFile: profilePatchFile(installProfile),
        packageFile: profilePackageFile(installProfile)
      };
      return await runInstallExclusive(res, langFull, "installBusy", async () => {
        const started = Date.now();
        const log = [];
        const logLine = (line) => {
          const clipped = String(line ?? "").slice(0, LOG_LINE_MAX);
          log.push(clipped);
          pushLog(`install ${repo}: ${clipped}`);
        };
        let cacheDir = null;
        let npmTargetUsed = null;
        const emitInstall = (status, error_code = null) => {
          pushEvent({ event: `install.${status}`, level: status === "failed" ? "error" : "info", error_code, duration_ms: Date.now() - started, message: `${repo} ${status}` });
        };
        try {
          if (redirected) logLine(t(langFull, "adaptorRedirected", { from: repo0, to: redirected }));
          const [owner, repoName] = repo.split("/");
          cacheDir = join(CACHE_DIR, `${slugify(owner)}__${slugify(repoName)}`);
          const prepared = await prepareInstallCache({ repo, cacheDir, logLine, lang: langFull });
          cacheDir = prepared.cacheDir;
          const cliResult = await runInstallCliFlow({ repo, cacheDir, installProfile, log, logLine, lang: langFull, answers });
          cacheDir = cliResult.cacheDir;
          npmTargetUsed = cliResult.npmTargetUsed;
          if (cliResult.status !== "continue") {
            emitInstall(cliResult.status);
            return marketplaceJson(res, 200, cliResult);
          }
          // 内置安装器明确拒绝（DSH peer 不兼容 / registry 与 supply-chain 策略 / pnpm 失败）：
          // 如实上报，绝不回退到市场自带的复制路径绕过宿主判定。
          if (cliResult.status === "failed") {
            emitInstall("failed", cliResult.errorCode ?? null);
            return marketplaceJson(res, 200, cliResult);
          }
          const cliCommand = cliResult.cliCommand;
          const preflight = await runInstallPreflight({
            cacheDir,
            repo,
            answers,
            log,
            logLine,
            lang: langFull,
            cliCommand
          });
          if (preflight.status !== "continue") {
            emitInstall(preflight.status);
            return marketplaceJson(res, 200, preflight);
          }
          const type = preflight.type;
          const scannedVars = preflight.scannedVars;
          logLine(t(langFull, "step4"));
          const result = await runInstallUseCase({
            type,
            cacheDir,
            repo,
            answers,
            log,
            logLine,
            lang: langFull,
            envAllowList: scannedVars,
            npmTarget: npmTargetUsed,
            npmTargetUsed,
            profilePaths: installProfilePaths,
            cliCommand: preflight.cliCommand
          });
          emitInstall(result.status);
          return marketplaceJson(res, 200, result);
        } catch (error) {
          // prepareInstall 为避让 slug 碰撞可能改占用带后缀的目录（error.installCacheDir）——
          // 失败清理必须删实际占用目录，否则误删他人缓存（含 script 型安装的 location）。
          const failedDir = typeof error?.installCacheDir === "string" ? error.installCacheDir : cacheDir;
          if (failedDir) await rm(failedDir, { recursive: true, force: true }).catch(() => {});
```

</details>

**依据 2 · 源码核查**：[lib/app/install.js:50-99](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install.js#L50-L99)

origin缓存身份与浅clone。

<details>
<summary>查看原文（50行）</summary>

```text
  return async function prepareInstall({ repo, cacheDir, logLine, lang }) {
    logLine(message(lang, "step1", { repo }));
    await mkdir(cacheRoot, { recursive: true });

    // slug 碰撞防护：仅凭 mtime 复用会在复用窗内给碰撞仓库装上错误内容；且 script 型
    // 安装的 location 就是 cacheDir，误删他人目录会毁掉其已安装载荷。故候选目录存在时
    // 先比对 clone remote——属主一致才复用/重建，属主不符（含来源不可识别，宁留勿删）
    // 顺延带 ~N 后缀的目录。
    const want = normalizeRepoRef(repo);
    let dir = cacheDir;
    let reused = false;
    for (let probe = 0; probe < MAX_DIR_PROBES; probe++) {
      const st = await stat(dir).catch(() => null);
      if (!st || !st.isDirectory()) break; // 目录不存在 → 占用
      const remote = await cacheRemoteOf(dir);
      if (want !== null && remote === want) {
        reused = now() - st.mtimeMs < cacheReuseMs; // 本仓库缓存：新鲜复用、过期重建
        break;
      }
      dir = `${cacheDir}~${probe + 2}`; // 他人占用/来源不明 → 探测下一个带后缀候选
    }

    if (reused) {
      logLine(message(lang, "cacheReuse"));
      return { cacheDir: dir, reused: true };
    }

    try {
      await rm(dir, { recursive: true, force: true });
      await runGit(["clone", "--depth", "1", `https://github.com/${repo}.git`, dir], { timeout: 180000 });
      logLine(message(lang, "cloneDone"));

      if (await exists(joinPath(dir, ".gitmodules"))) {
        const gitmodules = await readFile(joinPath(dir, ".gitmodules"), "utf8").catch(() => "");
        const { unsafe } = parseGitmodulesUrls(gitmodules);
        if (unsafe.length > 0) throw new Error(message(lang, "submoduleUnsafe", { urls: unsafe.join(", ") }));
        await runGit(["-c", "protocol.file.allow=never", "submodule", "update", "--init", "--recursive", "--depth", "1"], {
          cwd: dir,
          timeout: 180000
        });
        logLine(message(lang, "submoduleDone"));
      }
    } catch (error) {
      // 顺延到带后缀目录时把实际占用目录标到错误上——调用方的失败清理默认只删
      // 原始 cacheDir，不标注会把他人占用的原始目录误删。
      if (dir !== cacheDir && error && typeof error === "object") error.installCacheDir = dir;
      throw error;
    }

    return { cacheDir: dir, reused: false };
```

</details>

**依据 3 · 源码核查**：[lib/app/install.js:376-417](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install.js#L376-L417)

类型和材料questions状态。

<details>
<summary>查看原文（42行）</summary>

```text
  return async function runInstallPreflight({
    cacheDir,
    repo,
    answers = {},
    log,
    logLine,
    lang,
    cliCommand = null
  }) {
    const detect = await detectTypeDetail(cacheDir);
    const type = detect.type;
    logLine(message(lang, "step2", { type: message(lang, `type.${type}`) }));
    logLine(message(lang, "typeReason", {
      matched: message(lang, detect.reasonKey),
      hint: message(lang, detect.hintKey)
    }));

    const pluginRoots = type === "cordis-plugin" ? await findPluginRoots(cacheDir) : [];
    const pkgDirs = pluginRoots.length > 0 ? pluginRoots : [cacheDir];
    const scannedVars = ["script", "cordis-plugin"].includes(type)
      ? [...new Set((await Promise.all(pkgDirs.map((dir) => scanRequirements(dir)))).flat())].slice(0, 8)
      : [];
    const required = scannedVars.filter((name) => !(name in answers));
    logLine(message(lang, "step3", {
      list: required.length === 0 ? message(lang, "none") : required.join(", ")
    }));
    if (required.length > 0) {
      logLine(message(lang, "awaiting"));
      return {
        status: "awaiting-input",
        repo,
        type,
        questions: required.map((name) => ({
          id: name,
          header: message(lang, "qEnvHeader", { repo, v: name }),
          question: message(lang, "qEnv", { v: name })
        })),
        log
      };
    }

    if (answers.__confirm_secrets__ === void 0) {
```

</details>

**依据 4 · 源码核查**：[lib/app/install.js:483-543](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install.js#L483-L543)

bundle/script风险确认门。

<details>
<summary>查看原文（61行）</summary>

```text
    if (type === "bundle" && answers.__confirm_bundle__ === void 0) {
      const pkg = await readPackageJsonObject(cacheDir).catch(() => null);
      const patch = pkg?.dsh?.bundle?.patch ?? "";
      const pkgName = typeof pkg?.name === "string" && pkg.name.length > 0 ? pkg.name : repo;
      logLine(message(lang, "bundleGateDetected", { name: pkgName }));
      return {
        status: "awaiting-input",
        repo,
        type,
        questions: [{
          id: "__confirm_bundle__",
          header: message(lang, "qBundleHeader"),
          question: message(lang, "qBundle", { repo, name: pkgName, patch }),
          options: [
            { value: "allow", label: message(lang, "optAllow"), description: message(lang, "optBundleAllowDesc") },
            { value: "deny", label: message(lang, "optDeny"), description: message(lang, "optBundleDenyDesc") }
          ]
        }],
        log
      };
    }
    if (type === "bundle" && String(answers.__confirm_bundle__) === "deny") {
      await cleanup(cacheDir);
      logLine(message(lang, "bundleCancelled"));
      return { status: "aborted", repo, type, log };
    }

    if (type === "script" && answers.__confirm_script__ === void 0) {
      logLine(message(lang, "scriptDetected"));
      const scriptFiles = [];
      for (const file of ["install.ps1", "install.sh"]) {
        if (await exists(joinPath(cacheDir, file))) scriptFiles.push(file);
      }
      const hazardHits = (await Promise.all(scriptFiles.map((file) => scanScriptHazards(joinPath(cacheDir, file)))))
        .flatMap((hits, index) => hits.map((hit) => ({ ...hit, file: scriptFiles[index] })));
      if (hazardHits.length > 0) logLine(message(lang, "scriptHazardsFound", { n: hazardHits.length }));
      const hazards = hazardHits
        .map((hit) => `  ${hit.file}#L${hit.line} [${message(lang, `hazard.${hit.category}`)}] ${hit.text}`)
        .join("\n");
      return {
        status: "awaiting-input",
        repo,
        type,
        questions: [{
          id: "__confirm_script__",
          header: message(lang, "qScriptHeader"),
          question: hazardHits.length > 0
            ? message(lang, "qScriptHazards", { repo, n: hazardHits.length, hazards })
            : message(lang, "qScript", { repo }),
          options: [
            { value: "continue", label: message(lang, "optContinue"), description: message(lang, "optContinueDesc") },
            { value: "cancel", label: message(lang, "optCancel"), description: message(lang, "optCancelDesc") }
          ]
        }],
        log
      };
    }
    if (type === "script" && String(answers.__confirm_script__) !== "continue") {
      logLine(message(lang, "scriptCancelled"));
      await cleanup(cacheDir);
      return { status: "aborted", repo, type, log };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1542-1562](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/index.js#L1542-L1562)

wrapper实际注入builtinAllowed。

<details>
<summary>查看原文（21行）</summary>

```text
async function installRepo({ type, cacheDir, repo, log, answers, logLine, lang, envAllowList = [], npmTarget = null, profilePaths = null }) {
  const installProfilePaths = profilePaths ?? {
    profileDir: profileDir(),
    nodeModules: profileNodeModules(),
    patchFile: profilePatchFile(),
    packageFile: profilePackageFile()
  };
  return await runInstallExecutor({
    type,
    cacheDir,
    repo,
    log,
    answers,
    logLine,
    lang,
    envAllowList,
    npmTarget,
    profilePaths: installProfilePaths,
    // 每次安装时求值：目标 profile 可在面板里切换，内置安装器只能操作当前 profile。
    builtinAllowed: canUseBuiltinInstaller()
  });
```

</details>

**依据 6 · 源码核查**：[lib/app/install-exec.js:21-60](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install-exec.js#L21-L60)

官方拒绝不回退和复制symlink过滤。

<details>
<summary>查看原文（40行）</summary>

```text
   * 用 DSH 内置插件管理器安装一个 bundle 包（桌面端/0.2.0+ 的首选路径）。
   *
   * - `{ used: false }`：内置路径不可用（服务未挂载、老版本 DSH，或目标 profile 不是
   *   当前运行中的 profile）——调用方回退市场自带注册路径；
   * - `{ used: true }`：内置路径接手并成功；`needsRestart` 表示宿主需要重启才生效；
   * - **`used: true` 但失败时直接抛错，不静默回退**：内置安装器是宿主权威路径，
   *   它的拒绝（DSH peer 不兼容 incompatible-version、supply-chain 策略、pnpm 失败）
   *   不应被市场自己的复制路径绕过。
   */
  async function installViaBuiltin({ pkgName, depSpec, logLine, lang, allowed }) {
    if (allowed !== true) return { used: false };
    if (!pluginManager || typeof pluginManager.available !== "function" || !pluginManager.available()) {
      return { used: false };
    }
    logLine(message(lang, "builtinInstallStart", { spec: depSpec }));
    const result = await pluginManager.installBundle(depSpec, { activate: true });
    if (result.unavailable === true) return { used: false };
    if (result.ok !== true) {
      throw new Error(message(lang, "builtinInstallFail", {
        name: pkgName,
        err: result.error ?? result.application ?? "unknown",
      }));
    }
    const needsRestart = result.needsRestart === true;
    logLine(message(lang, needsRestart ? "builtinInstallRestart" : "builtinInstallDone", { name: pkgName }));
    return { used: true, needsRestart, application: result.application ?? null };
  }
  // fs.cp 默认解引用符号链接（verbatimSymlinks:false）：恶意仓库可提交指向宿主文件
  // （如 ~/.ssh/id_rsa）的 symlink，unix 下会把宿主文件内容一并拷进安装目录（越界读）。
  // 不取 verbatimSymlinks:true——原样保留链接只是把越界推迟到加载方 resolve 时；
  // 在注入的 copyFilter 之上叠加 lstat 检查，符号链接一律拒拷（lstat 失败同拒，fail-closed）。
  const withoutSymlinks = (filter) => async (src, dest) => {
    const details = await lstat(src).catch(() => null);
    if (!details || details.isSymbolicLink()) return false;
    return filter(src, dest);
  };

  return async function installRepo({
    type,
    cacheDir,
```

</details>

**依据 7 · 源码核查**：[lib/app/install-exec.js:165-180](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install-exec.js#L165-L180)

脚本真实执行。

<details>
<summary>查看原文（16行）</summary>

```text
    if (type === "script") {
      const hasPs1 = await exists(joinPath(cacheDir, "install.ps1"));
      const hasSh = await exists(joinPath(cacheDir, "install.sh"));
      const usePs1 = hasPs1 && (!hasSh || isWindows);
      if (usePs1) {
        logLine(message(lang, "runPs1"));
        await runScript(joinPath(cacheDir, "install.ps1"), { cwd: cacheDir, env, timeout: 600000 });
      } else if (hasSh) {
        logLine(message(lang, "runSh"));
        await runScript(joinPath(cacheDir, "install.sh"), { cwd: cacheDir, env, timeout: 600000 });
      } else {
        throw new Error(message(lang, "noScript", { repo }));
      }
      logLine(message(lang, "scriptDone", { dir: cacheDir }));
      return { type, location: cacheDir };
    }
```

</details>

**依据 8 · 源码核查**：[lib/app/install.js:746-819](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install.js#L746-L819)

记录/反馈/失败cleanup，不是全事务。

<details>
<summary>查看原文（74行）</summary>

```text
      let installed = false;
      if (result && INSTALLABLE_TYPES.has(result.type)) {
        await saveInstalled(repo, {
          type: result.type,
          name: result.name ?? null,
          names: Array.isArray(result.names) && result.names.length > 0 ? result.names : null,
          location: result.location ?? null,
          version: result.version ?? null,
          bundle: result.bundle === true,
          installedAt: now(),
          envKeys: envAllowList.length > 0 ? envAllowList : null
        });
        await queueFeedbackSafe({
          repo,
          name: result.name ?? repo,
          type: result.type,
          version: result.version ?? null,
          installedAt: now(),
          method: npmTargetUsed ? "cli-npm-fallback" : "market-direct",
          reinstall: Boolean(getInstalledRecord(repo)),
          envProfile: await buildEnvProfile(),
          logSnapshot: buildFeedbackLogSnapshot(log)
        }, logLine, lang);
        if (translate) logLine(translate(lang, "feedbackQueued"));
        installed = true;
      }
      const latestVersion = await readPackageVersion(cacheDir);
      if (result && result.type === "instructions") {
        await cleanupCache(cacheDir);
        return {
          status: "manual",
          repo,
          type: "instructions",
          url: `https://github.com/${repo}`,
          ...(cliCommand ? { cliCommand } : {}),
          log
        };
      }
      return {
        status: "done",
        repo,
        installed,
        latestVersion,
        ...result,
        ...(cliCommand ? { cliCommand } : {}),
        log
      };
    } catch (error) {
      await cleanupCache(cacheDir);
      const errText = [error?.message, error?.stderr].filter(Boolean).join("\n");
      const hint = classifyInstallFailure(errText, lang);
      logLine(translate(lang, "fail", { err: String(error?.message ?? error) }));
      if (hint) logLine(hint);
      // 安装失败同样入队反馈（outcome=install-failed + 结构化 errorClass），
      // 让「未走到成功路径」的失败也进入待提交队列。
      await queueFeedbackSafe({
        repo,
        name: repo,
        type: type ?? null,
        version: null,
        installedAt: now(),
        method: npmTargetUsed ? "cli-npm-fallback" : "market-direct",
        outcome: "install-failed",
        errorClass: classifyInstallFailureKind ? classifyInstallFailureKind(errText) : "unclassified",
        envProfile: await buildEnvProfile(),
        logSnapshot: buildFeedbackLogSnapshot(log)
      }, logLine, lang);
      return {
        status: "failed",
        repo,
        log,
        error: hint
          ? `${String(error?.message ?? error)}\n\n${hint}`
          : String(error?.message ?? error)
```

</details>

**依据 9 · 源码核查**：[lib/app/install-exec.js:85-107](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install-exec.js#L85-L107)

multi-skill location为共享skillsDir。

<details>
<summary>查看原文（23行）</summary>

```text
      const installed = [];
      await mkdir(skillsDir, { recursive: true });
      for (const root of roots) {
        let skillName = slugify(roots.length === 1 ? repo.split("/")[1] : root.split(pathSep).at(-1));
        try {
          const text = await readSkillManifest(root);
          const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          const match = fm && fm[1].match(/^name:\s*"?([a-z0-9][a-z0-9-]*)"?$/m);
          if (match) skillName = match[1];
        } catch {}
        const dest = joinPath(skillsDir, skillName);
        await rm(dest, { recursive: true, force: true });
        await cp(root, dest, { recursive: true, filter: withoutSymlinks(copyFilter(root, true)) });
        installed.push({ name: skillName, location: dest });
        logLine(message(lang, "skillInstalled", { name: skillName, dest }));
      }
      return {
        type,
        name: installed.length === 1 ? installed[0].name : `${installed.length}-skills`,
        names: installed.map((item) => item.name),
        count: installed.length,
        location: installed.length === 1 ? installed[0].location : skillsDir,
      };
```

</details>

**依据 10 · 源码核查**：[lib/app/uninstall.js:42-73](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/uninstall.js#L42-L73)

skill卸载允许整共享目录并吞rm错误。

<details>
<summary>查看原文（32行）</summary>

```text
    try {
      if (record.type === "skill" || record.type === "agent-preset") {
        // skill / agent 预设：直接删除安装目录（location 即目标目录，且必须在受管目录内）。
        // 多预设记录（嵌套预设仓库）location 是 PRESETS_DIR 本身——必须按 names 逐个删，
        // 绝不能整体删除（会误删其他预设）。
        if (record.type === "agent-preset" && Array.isArray(record.names) && record.names.length > 0) {
          for (const presetName of record.names) {
            const target = joinPath(managedDirs.presetsDir, presetName);
            if (resolvePath(target).startsWith(resolvePath(managedDirs.presetsDir) + pathSep)) {
              await rm(target, { recursive: true, force: true }).catch(() => {});
              removed++;
            }
          }
        } else {
          // 安全约束：多 skill / 多预设仓库安装时 location 记为 SKILLS_DIR / PRESETS_DIR 本身
          //（无尾分隔符，见 installRepo 多根分支）——此前仅前缀校验恒 false，rm 被跳过、
          // 目录残留而记录已删；精确相等（=== 目录本身）同样放行，仍受受管目录约束，无越界。
          const location = String(record.location ?? "");
          const skillsDir = resolvePath(managedDirs.skillsDir);
          const presetsDir = resolvePath(managedDirs.presetsDir);
          const loc = resolvePath(location);
          const insideManaged = loc === skillsDir || loc === presetsDir
            || loc.startsWith(skillsDir + pathSep) || loc.startsWith(presetsDir + pathSep);
          if (location && insideManaged) {
            await rm(location, { recursive: true, force: true }).catch(() => {});
            removed++;
          }
        }
      } else if (record.type === "cordis-plugin" || record.type === "bundle" || record.type === "cli") {
        // 多插件仓库按记录的子包名逐个删除；单插件用 name（包名）；旧记录退化为 location 推断。
        // cli 类型（官方 CLI 安装，如 `dsh plugin add dshmarket`）同样按包目录 + patch 条目清理。
        // 安全校验：`!/-plugins$/` 是防呆——个别仓库把 record.name 存成了
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本机授权与供应链边界支持生产安装吗？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需DSH webServer、Node及Git/npm/pnpm/脚本环境，Desktop bundle路径还依官方pluginManager与当前profile，第三方代码/依赖/凭据/平台兼容各不同。本轮不执行市场、第三方安装、自更新、备份还原或发GitHub反馈。鉴权是自定义CSRF头、可信Host、同host Origin；无Origin的本地脚本可过，socket回环直接写，LAN还需lanWrite=true和会话token。它不是用户/租户登录，多用户和反向代理部署必须另审，不能把持有市场页面当最小权限账号。

脚本/lifecycle确认是执行未知代码的知情选择，不保证不会外发或改OS。secrets/漏洞扫描也不能证明没有恶意行为，任何徽章不代替来源审阅。反馈安装成功/失败先入本地队列，GitHub提交经独立feedback接口与token/manual URL；安装记录/日志/环境与反馈token留存需要独立核隐私，不把“临时安装材料不落盘”扩成所有凭据都不存。

对正式安装/卸载建议observe，先修multi-skill共享目录删除并验证固定来源与部分失败恢复。首次维护测试profile、备份与官方安装器差异，持续跟索引/第三方升级及审核，失败需核profile/目录/脚本外部副作用，卸载依installed记录且不回滚第三方数据。现金包括网络/存储及第三方服务，工时金额未知；退回只读GitHub发现+官方安装器、人工审源码，避免在已有重要Skill库试卸载。

#### 证据与依据

**依据 1 · 源码核查**：[lib/http/auth.js:22-58](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/http/auth.js#L22-L58)

Host/Origin/CSRF与socket回环/LAN token，无用户登录。

<details>
<summary>查看原文（37行）</summary>

```text
  function isTrustedRequest(req) {
    // headers 缺失时按不可信拒绝（fail-closed）——不抛错，避免调用侧兜底成 500
    const headers = req.headers ?? {};
    if (headers[CSRF_HEADER] !== "1") return false;
    if (!isTrustedHost(headers["host"])) return false;
    const origin = headers["origin"];
    if (!origin) return true; // 无 Origin 的非浏览器调用方（本地脚本/curl）放行
    try {
      return new URL(origin).host === String(headers["host"] ?? "");
    } catch {
      return false;
    }
  }

  /** LAN 写模式配置：config.json 的 lanWrite === true 才开启；文件缺失/损坏视为未开启（默认安全）。 */
  async function isLanWriteEnabled() {
    try {
      const cfg = await readConfig();
      return Boolean(cfg && cfg.lanWrite === true);
    } catch {
      return false;
    }
  }

  /** 写操作放行判定：isTrustedRequest（CSRF 头 + Host 白名单 + Origin）之上叠加—— */
  async function isWriteAllowed(req) {
    if (!isTrustedRequest(req)) return false;
    // 回环判定基于 socket 远端地址（连接层，不可伪造）——LAN 客户端自报 Host: 127.0.0.1
    // 可同时绕过 Host 白名单与 token；IPv4-mapped IPv6（::ffff:x.x.x.x）归一。
    // remoteAddress 恒为 IP 字面量（不含 "localhost" 主机名形态），只需覆盖两种回环写法。
    const remote = String(req.socket?.remoteAddress ?? "").replace(/^::ffff:/i, "").toLowerCase();
    if (remote === "127.0.0.1" || remote === "::1") return true;
    // LAN：需显式开启 lanWrite + 会话 token（timing-safe，长度不同直接拒绝防泄露）
    if (!(await isLanWriteEnabled())) return false;
    const got = String(req.headers[WRITE_TOKEN_HEADER] ?? "");
    if (got.length !== writeToken.length) return false;
    return timingSafeEqual(Buffer.from(got), Buffer.from(writeToken));
```

</details>

**依据 2 · 源码核查**：[lib/infra/proc.js:41-88](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/infra/proc.js#L41-L88)

npm/pnpm/dsh/bash/pwsh实际环境依赖。

<details>
<summary>查看原文（48行）</summary>

```text
  async function runNpm(args, opts = {}) {
    if (platform === "win32") {
      if (await exists(npmCliPath)) return await execFileSafe(processExecPath, [npmCliPath, ...args], opts);
      return await execFileSafe("cmd.exe", ["/c", "npm.cmd", ...args], opts);
    }
    return await execFileSafe("npm", args, opts);
  }

  async function runPnpm(args, opts = {}) {
    if (platform === "win32") {
      return await execFileSafe("cmd.exe", ["/d", "/s", "/c", "pnpm", ...args], opts);
    }
    return await execFileSafe("pnpm", args, opts);
  }

  async function runGit(args, opts = {}) {
    return await execFileSafe("git", args, opts);
  }

  async function runDsh(args, opts = {}) {
    if (platform === "win32") {
      const file = await exists(currentDshCliPath()) ? currentDshCliPath() : "dsh";
      return await execFileSafe("cmd.exe", ["/c", file, ...args], opts);
    }
    return await execFileSafe("dsh", args, opts);
  }

  async function runScript(scriptPath, opts = {}) {
    if (String(scriptPath).toLowerCase().endsWith(".ps1")) {
      return await execFileSafe(
        "pwsh",
        ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath],
        opts
      );
    }
    let shArgs = [scriptPath];
    if (platform === "win32") {
      const result = injectedSpawnSync("bash", ["--version"], {
        encoding: "utf8",
        windowsHide: true,
      });
      if (result?.status === 0 && !/msys|MINGW/i.test(`${result.stdout ?? ""}${result.stderr ?? ""}`)) {
        shArgs = [wslPosixPath(scriptPath)];
      }
    }
    return await execFileSafe("bash", shArgs, opts);
  }

```

</details>

**依据 3 · 源码核查**：[lib/app/feedback.js:22-31](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/feedback.js#L22-L31)

反馈pending/token本地persist。

<details>
<summary>查看原文（10行）</summary>

```text

  const persist = async () => {
    await mkdir(marketRoot, { recursive: true });
    await writeFile(
      feedbackFile,
      JSON.stringify({ pending: pendingFeedback, token: feedbackToken }, null, 2),
      "utf8"
    );
  };

```

</details>

**依据 4 · 源码核查**：[lib/app/feedback.js:73-104](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/feedback.js#L73-L104)

GitHub token或manual URL提交，不是安装即自动发。

<details>
<summary>查看原文（32行）</summary>

```text

  const submitToGitHub = async (entry, ok, note) => {
    const withLog = !ok;
    const { title, body } = buildIssue(entry, ok, note, withLog);
    // manualUrl 先用含日志 body；编码后超阈值降级为无日志版（无日志恒 ~700 字符，不再二次检查）
    const manualUrlFor = (issueBody) => `https://github.com/${selfUpdateRepo}/issues/new?${new URLSearchParams({ title, body: issueBody }).toString()}`;
    let manualUrl = manualUrlFor(body);
    if (manualUrl.length > MANUAL_URL_MAX) manualUrl = manualUrlFor(buildIssue(entry, ok, note, false).body);
    if (!feedbackToken) return { manualUrl };

    const createIssue = async (withLabels) => {
      const labels = ["install-feedback", ...(ok ? [] : ["install-failed"] )];
      const payload = { title, body };
      if (withLabels) payload.labels = labels;
      return await fetchImpl(`https://api.github.com/repos/${selfUpdateRepo}/issues`, {
        method: "POST",
        headers: {
          "User-Agent": "dsh-plugin-marketplace",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${feedbackToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: timeoutSignal()
      });
    };

    try {
      let response = await createIssue(true);
      if (response.status === 422) response = await createIssue(false);
      if (!response.ok) return { manualUrl, error: `GitHub API ${response.status}` };
      const issue = JSON.parse((await readBodyLimited(response)).toString("utf8"));
```

</details>

**依据 5 · 源码核查**：[lib/http/routes.js:475-501](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/http/routes.js#L475-L501)

反馈独立POST端点与写鉴权。

<details>
<summary>查看原文（27行）</summary>

```text
    handler: async (req, res) => {
      const lang = langOf(req, { lang: "" });
      if (req.method !== "POST") return marketplaceJson(res, 405, { error: t(lang, "methodNotAllowed") });
      if (!(await isWriteAllowed(req))) return marketplaceJson(res, 403, { error: t(lang, "forbidden") });
      let body;
      try {
        body = await readJsonBody(req);
      } catch (error) {
        return marketplaceJson(res, error.status === 413 ? 413 : 400, {
          error: t(lang, error.status === 413 ? "bodyTooLarge" : "badRequest")
        });
      }
      const repo = typeof body.repo === "string" ? body.repo.trim() : "";
      const ok = body.ok === true;
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : "";
      if (!repo) return marketplaceJson(res, 400, { error: t(lang, "badRepo") });
      const feedback = await feedbackUseCase.submitFeedback({ repo, ok, note, lang });
      if (feedback.status === "not-found") {
        pushEvent({ event: "feedback.not_found", level: "warn", error_code: "feedback_not_found", message: repo });
        return marketplaceJson(res, 200, { status: "done", issueUrl: null, error: feedback.error });
      }
      pushEvent({ event: "feedback.done", level: "info", message: repo });
      return marketplaceJson(res, 200, feedback);
    }
  });

  register({
```

</details>

**依据 6 · 源码核查**：[lib/app/uninstall.js:33-69](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/uninstall.js#L33-L69)

卸载依记录和删除风险。

<details>
<summary>查看原文（37行）</summary>

```text
}) {
  return async function runUninstallUseCase({ repo, log, logLine, lang }) {
    const record = getInstalledRecord(repo);
    if (!record) {
      logLine(translate(lang, "uninstallNone"));
      return { status: "done", repo, removed: 0, log };
    }
    logLine(translate(lang, "uninstalling", { repo }));
    let removed = 0;
    try {
      if (record.type === "skill" || record.type === "agent-preset") {
        // skill / agent 预设：直接删除安装目录（location 即目标目录，且必须在受管目录内）。
        // 多预设记录（嵌套预设仓库）location 是 PRESETS_DIR 本身——必须按 names 逐个删，
        // 绝不能整体删除（会误删其他预设）。
        if (record.type === "agent-preset" && Array.isArray(record.names) && record.names.length > 0) {
          for (const presetName of record.names) {
            const target = joinPath(managedDirs.presetsDir, presetName);
            if (resolvePath(target).startsWith(resolvePath(managedDirs.presetsDir) + pathSep)) {
              await rm(target, { recursive: true, force: true }).catch(() => {});
              removed++;
            }
          }
        } else {
          // 安全约束：多 skill / 多预设仓库安装时 location 记为 SKILLS_DIR / PRESETS_DIR 本身
          //（无尾分隔符，见 installRepo 多根分支）——此前仅前缀校验恒 false，rm 被跳过、
          // 目录残留而记录已删；精确相等（=== 目录本身）同样放行，仍受受管目录约束，无越界。
          const location = String(record.location ?? "");
          const skillsDir = resolvePath(managedDirs.skillsDir);
          const presetsDir = resolvePath(managedDirs.presetsDir);
          const loc = resolvePath(location);
          const insideManaged = loc === skillsDir || loc === presetsDir
            || loc.startsWith(skillsDir + pathSep) || loc.startsWith(presetsDir + pathSep);
          if (location && insideManaged) {
            await rm(location, { recursive: true, force: true }).catch(() => {});
            removed++;
          }
        }
```

</details>

#### 缺口

- 全安装形态固定宿主、部分失败和多Skill卸载修复未运行验证。
  **影响**：核心安全恢复缺陷使生产采用不能成立。
  **进一步探讨**：先在可丢弃profile用两个已有Skill+多Skill包验证只删所属项，修复后再核失败/重启/来源一致性。
- 供应链全路径、签名自更新/备份/WebDAV和日志隐私未全量审。
  **影响**：不承诺执行安全、数据回滚或全包验签。
  **进一步探讨**：启用相关能力前逐项固定来源、权限、秘密和恢复矩阵，第三方先人工审。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 索引/状态能否等安装可信，新方向怎么证伪？

**研究主题**：新假设与验证

#### 完整回答

索引只证明被收录，安装记录证明市场流程写了记录，版本比对不等实际加载成功或任务效果。origin同仓缓存可防slug碰撞，但默认分支clone/版本字段和另一次官方github解析仍可能与用户看到的审查材料不同，本轮未量化这种漂移。

从Q02multi-skill owner丢失可推导未实现方向：以逐安装文件/目录清单和来源commit建立ownership，卸载只删除该清单且复核当前hash/共享引用，可能比一条location更少误删。相对现names/location记录增量是删除依据和冲突可见性，不是承诺所有脚本可撤销。最小实验在可丢弃profile建A/B Skill、装多Skill C、制造同名冲突/用户修改再卸载C，对比现行与ownership方案的旁删、残留和人工恢复；旁删不降或安全冲突误阻断过高则否定。未实现不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/app/install-exec.js:85-107](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install-exec.js#L85-L107)

多Skill归属被汇总location。

<details>
<summary>查看原文（23行）</summary>

```text
      const installed = [];
      await mkdir(skillsDir, { recursive: true });
      for (const root of roots) {
        let skillName = slugify(roots.length === 1 ? repo.split("/")[1] : root.split(pathSep).at(-1));
        try {
          const text = await readSkillManifest(root);
          const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          const match = fm && fm[1].match(/^name:\s*"?([a-z0-9][a-z0-9-]*)"?$/m);
          if (match) skillName = match[1];
        } catch {}
        const dest = joinPath(skillsDir, skillName);
        await rm(dest, { recursive: true, force: true });
        await cp(root, dest, { recursive: true, filter: withoutSymlinks(copyFilter(root, true)) });
        installed.push({ name: skillName, location: dest });
        logLine(message(lang, "skillInstalled", { name: skillName, dest }));
      }
      return {
        type,
        name: installed.length === 1 ? installed[0].name : `${installed.length}-skills`,
        names: installed.map((item) => item.name),
        count: installed.length,
        location: installed.length === 1 ? installed[0].location : skillsDir,
      };
```

</details>

**依据 2 · 源码核查**：[lib/app/uninstall.js:42-73](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/uninstall.js#L42-L73)

卸载消费location导致owner缺口。

<details>
<summary>查看原文（32行）</summary>

```text
    try {
      if (record.type === "skill" || record.type === "agent-preset") {
        // skill / agent 预设：直接删除安装目录（location 即目标目录，且必须在受管目录内）。
        // 多预设记录（嵌套预设仓库）location 是 PRESETS_DIR 本身——必须按 names 逐个删，
        // 绝不能整体删除（会误删其他预设）。
        if (record.type === "agent-preset" && Array.isArray(record.names) && record.names.length > 0) {
          for (const presetName of record.names) {
            const target = joinPath(managedDirs.presetsDir, presetName);
            if (resolvePath(target).startsWith(resolvePath(managedDirs.presetsDir) + pathSep)) {
              await rm(target, { recursive: true, force: true }).catch(() => {});
              removed++;
            }
          }
        } else {
          // 安全约束：多 skill / 多预设仓库安装时 location 记为 SKILLS_DIR / PRESETS_DIR 本身
          //（无尾分隔符，见 installRepo 多根分支）——此前仅前缀校验恒 false，rm 被跳过、
          // 目录残留而记录已删；精确相等（=== 目录本身）同样放行，仍受受管目录约束，无越界。
          const location = String(record.location ?? "");
          const skillsDir = resolvePath(managedDirs.skillsDir);
          const presetsDir = resolvePath(managedDirs.presetsDir);
          const loc = resolvePath(location);
          const insideManaged = loc === skillsDir || loc === presetsDir
            || loc.startsWith(skillsDir + pathSep) || loc.startsWith(presetsDir + pathSep);
          if (location && insideManaged) {
            await rm(location, { recursive: true, force: true }).catch(() => {});
            removed++;
          }
        }
      } else if (record.type === "cordis-plugin" || record.type === "bundle" || record.type === "cli") {
        // 多插件仓库按记录的子包名逐个删除；单插件用 name（包名）；旧记录退化为 location 推断。
        // cli 类型（官方 CLI 安装，如 `dsh plugin add dshmarket`）同样按包目录 + patch 条目清理。
        // 安全校验：`!/-plugins$/` 是防呆——个别仓库把 record.name 存成了
```

</details>

**依据 3 · 源码核查**：[lib/app/install.js:746-770](https://github.com/bradeGithub/DSH-Plugins-Marketplace/blob/d4083728c32fe224c97cb828285068de16418421/lib/app/install.js#L746-L770)

现持久记录names/location/version。

<details>
<summary>查看原文（25行）</summary>

```text
      let installed = false;
      if (result && INSTALLABLE_TYPES.has(result.type)) {
        await saveInstalled(repo, {
          type: result.type,
          name: result.name ?? null,
          names: Array.isArray(result.names) && result.names.length > 0 ? result.names : null,
          location: result.location ?? null,
          version: result.version ?? null,
          bundle: result.bundle === true,
          installedAt: now(),
          envKeys: envAllowList.length > 0 ? envAllowList : null
        });
        await queueFeedbackSafe({
          repo,
          name: result.name ?? repo,
          type: result.type,
          version: result.version ?? null,
          installedAt: now(),
          method: npmTargetUsed ? "cli-npm-fallback" : "market-direct",
          reinstall: Boolean(getInstalledRecord(repo)),
          envProfile: await buildEnvProfile(),
          logSnapshot: buildFeedbackLogSnapshot(log)
        }, logLine, lang);
        if (translate) logLine(translate(lang, "feedbackQueued"));
        installed = true;
```

</details>

#### 缺口

- ownership卸载可否减少旁删/恢复投入未试验。
  **影响**：未来假设不能提高当前采用。
  **进一步探讨**：可丢弃profile冲突/用户修改反例对照旁删残留与成本，无改善则放弃。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
