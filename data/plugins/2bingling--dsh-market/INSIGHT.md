# DSH Market

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[500057b](https://github.com/2BingLing/dsh-market/tree/500057b4e9f9940b4fecaa63a2893c7c313acc13)

<!-- BEGIN META -->
[![GitHub ★ 190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2BingLing/dsh-market)
<!-- END META -->

> **功能**：提供 DSH 插件、技能和整合包的市场浏览、搜索及宿主侧安装管理。

> **亮点**：[Q01](#research-q01) 将两种读者入口与市场目录关联。[Q02](#research-q02) 把部分重复安装复用为配方并保留验证。

> **主要限制**：[Q02](#research-q02) 过滤命令和子代理复核分别约束不同层面。[Q03](#research-q03) 部分失败可能保留已执行动作。

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
  - [Q01 · 根项目提供哪两种用户路径？](#detail-section-11)
  - [Q02 · 安装何时执行、何时转交？](#detail-section-12)
  - [Q03 · 如何试用与退出？](#detail-section-13)
  - [Q04 · 如何减少对冒烟成功的误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要发现、比较并在合适 profile 采用 DSH 扩展的开发者。

手工从目录找到项目并照 README 核对来源、装法和宿主行为。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 市场浏览 | 比较候选扩展 | 目录不等于宿主兼容 |
| 安装管理 | 执行符合条件的安装路径 | 需可信包、授权及宿主环境 |
| 代理复核 | 分析安装与风险 | 依赖宿主代理和权限约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 浏览器 | 只读市场需要 | 发现与比较候选 | 直接核对仓库 |
| 兼容 DSH 与插件子包 | 宿主安装管理需要 | 加载市场 RPC | 停止并核对 profile |
| 子代理服务 | 转交或安全模式需要 | 候选命令复核 | 保留只读比较 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 发现 | 用户比较候选和当前仓库 | 确认实际来源及装法 |
| 核对 | 操作者检查授权和隔离 | 缺口未清楚时不执行 |
| 验收 | 获授权后验证宿主表面和任务 | 核对恢复与残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与网络成本未知 | 版本、来源和权限核对 | 未测耗时 |
| 持续 | 配方和子代理资源 | 复核目录与实际兼容 | 命中率未重测 |
| 失败恢复 | 重新安装成本未知 | 检查之前执行的动作 | 回滚随分支不同 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 候选比较 | 产品区分 Web 与宿主版 | 推荐命中率 |
| 安装路由 | 过滤、配方与转交 | 真实安装及授权边界 |
| 验证 | 冒烟状态单列 | 宿主实际可用性 |

> **思考**：[Q02](#research-q02) 过滤命令和子代理复核分别约束不同层面。[Q03](#research-q03) 部分失败可能保留已执行动作。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将两种读者入口与市场目录关联。[Q02](#research-q02) 把部分重复安装复用为配方并保留验证。

[Q02](#research-q02) 直装保留过滤和冒烟结果，子代理分支依赖宿主。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 过滤命令和子代理复核分别约束不同层面。[Q03](#research-q03) 部分失败可能保留已执行动作。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先比较候选，待来源和授权边界明确再在独立 profile 验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定仓库源码覆盖主要安装路径及边界。未运行市场、插件、子代理或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin/core/src/installer.ts、plugin/core/src/router.ts、plugin/ui/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 workspace，抽查 Web 与宿主分工、安装路由与副作用，未执行任何目标代码。
- 下一步：用隔离 profile 和惰性安装样本核对权限、挂载与退出。

**分析版本**

- **仓库**：[2BingLing/dsh-market](https://github.com/2BingLing/dsh-market)
- **版本号**：0.1.0（[固定提交 500057b](https://github.com/2BingLing/dsh-market/tree/500057b4e9f9940b4fecaa63a2893c7c313acc13)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 按实际验证层级展示状态，检验是否减少把安装结果当成任务成功。

用隔离 profile 和惰性安装样本核对权限、挂载与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1140 | — | — | 17568 |
| .ts | source | 69 | 13177 | 10250 | 2157 | — |
| .ts | test | 35 | 5245 | 4584 | 276 | — |
| .js | source | 4 | 4911 | 4726 | 226 | — |
| .tsx | source | 16 | 4814 | 4282 | 375 | — |
| .mjs | test | 2 | 273 | 200 | 45 | — |
| .mjs | source | 23 | 1531 | 1205 | 222 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/2BingLing/dsh-market/issues?q=is%3Aissue+is%3Aopen) [![近30天关闭 125](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=125&color=737b86&logo=github)](https://github.com/2BingLing/dsh-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：近30天新建。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：市场项目怎样将检索和安装连起来，哪些检查能支持安装判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目提供哪两种用户路径？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

不知道 DSH 插件装法的用户可以先用 Web 市场发现和比较候选，宿主插件版进一步提供安装操作。根目录是私有 workspace，收集器、Web 和 plugin 子包分开。可挂载部分在插件工作区，不能将根包名称当成宿主插件入口。相对手工查 README 与调用安装器，宿主版的核心增量是把候选的类型、配方或命令连到安装器并做冒烟检查。插件服务通过市场 API 分派操作。目录评分和描述可辅助候选比较，其生成结果本身不证明兼容或安全。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/package.json#L1-L16)

根 workspace 与采集、Web 命令

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-market",
  "version": "0.1.0",
  "private": true,
  "description": "DSH Market —— DeepSeek Harness 生态内容市场（插件 · 技能 · 整合包）：持续收录 / 搜索 / 实用五维评分 / 个性化推荐 / 一键安装",
  "workspaces": [
    "schema",
    "collector",
    "web",
    "plugin/*"
  ],
  "scripts": {
    "collect": "npm run start -w collector",
    "test": "npm run test -w collector",
    "dev:web": "npm run dev -w web",
    "build:web": "npm run build -w web"
```

</details>

**依据 2 · 作者声明**：[README.md:24-37](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/README.md#L24-L37)

两种形态的定位

<details>
<summary>查看原文（14行）</summary>

```text
## 两种形态

<p align="center">
  <img src="./assets/readme/section-forms.svg" width="100%" alt="两种形态横幅：Web 版与插件版两个 Logo 通过同一份 plugins.json 数据相连">
</p>

DSH 生态增长极快，插件与技能散落在 GitHub 各处 —— **不知道哪个好用、怎么装、怎么组合成一套能干活的环境**。DSH Market 用一个平台收齐它们，并提供两种消费入口：

| | <img src="./assets/readme/logo-web.svg" width="26" alt="Web 版 Logo"> **Web 版**（已上线） | <img src="./assets/readme/logo-plugin.svg" width="26" alt="插件版 Logo"> **DSH 插件版**（开发完成） |
|---|---|---|
| **位置** | 浏览器 · GitHub Pages 纯静态站 | DSH 侧边栏 · cordis 插件 |
| **定位** | 发现与评估 | 安装与管理 |
| **内容** | 插件（cordis/skill）+ 整合包分区（生态内容市场） | 5-Tab 面板 · 一键安装 · 新手推荐 · 个性化推荐 · 场景推荐 · AI 代理安装（详见 [DSH 插件版](#dsh-插件版)）+ 整合包 Tab |
| **安装** | 零安装，浏览器打开即用 | `npx @deepseek-ai/dsh plugin --profile web add @dsh-market/plugin` |
```

</details>

**依据 3 · 作者声明**：[README.md:107-114](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/README.md#L107-L114)

作者说明安装分层与评分

```text
## 特性

- **持续收录** — 每天自动扫描 `dsh-plugin` / `dsh` 等 GitHub topic、社区精选列表，全量收录（当前 18327 个插件 + 整合包通道）
- **实用五维评分** — 维护活跃 / 实用度 / 生态热度 / 便捷度 / 信号质量，加权几何平均融合，每个插件附「为什么推荐」解释
- **中文体验** — 所有插件自动生成中文简介与中文功能标签；中文意图搜索（搜「记事本」命中"笔记"类插件，零 token）+「中文分类」筛选
- **一键安装** — 插件版确定性脚本路由：skill 型 `git clone`，cordis 型 `dsh plugin add`；失败可重试、可回滚
- **AI 安装（路由模式）** — 零 LLM 直装优先（配方缓存 / 解析命令 + 冒烟验证，75%+ 插件无需 AI），需要时交给极简协议子代理（JSON verdict 自动沉淀为配方）；安装度量本机记录（T0 命中率 / AI 参与率 / 成功率）
- **🛡 安全模式** — 确认安装时可开启：AI 安装前强制安全扫描（危险命令 `curl|sh` / 混淆执行 / 敏感信息收集回传 / 配置篡改 / 网络暴露与信任围栏 / 来源存疑），发现风险即中止不安装；针对 DSH 插件供应链与网络暴露面风险（如 QVD-2026-57410 CVSS 9.8），来源不明插件建议开启（消耗 token）
```

**依据 4 · 源码核查**：[plugin/ui/src/index.ts:913-936](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/ui/src/index.ts#L913-L936)

宿主市场 API 分派入口

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: '/market/api',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'method not allowed' }))
          return
        }
        try {
          const payload = (await readJsonBody(req)) as RpcRequest
          const result = await dispatch(payload.method, payload.args)
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ ok: true, result }))
        } catch (err) {
          res.writeHead(200, { 'content-type': 'application/json' })
          // P6：所有 RPC 错误统一附人话分类（客户端 RpcError.classified 取用）
          const msg = (err as Error).message ?? 'unknown error'
          res.end(JSON.stringify({ ok: false, error: msg, classified: classifyFailure(msg) }))
        }
      },
    }),
    'dsh-market: /market/api routes',
```

</details>

**依据 5 · 源码核查**：[plugin/core/src/router.ts:218-246](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/router.ts#L218-L246)

安装器选路前置与已装短路

<details>
<summary>查看原文（29行）</summary>

```text
export async function routeInstall(
  cfg: ResolvedConfig,
  plugin: DshPlugin,
  opts: RouteOptions,
): Promise<RouterResult> {
  const { profile, runner, force, onStep, useRecipe = true, signal } = opts;

  // 前置计算：解析命令（skill 目标规范化 + --profile 归一）+ cordis 冒烟对账包名（解析命令提取优先）
  const parsed = normalizeDshProfileCommands(
    normalizeSkillCommands(cfg, plugin, plugin.install?.commands ?? []),
    profile,
  );
  const pkgName = smokePkgName(plugin, parsed);

  // 0. 已装：直接跳过（零动作）
  if (!force && isInstalled(cfg, plugin, profile, pkgName)) {
    return { mode: "already", ok: true, alreadyInstalled: true, needAi: false };
  }

  const install = (commands: string[], smoke: SmokeCheck[]) =>
    installPlugin(cfg, plugin, {
      commands,
      smoke,
      targetProfile: profile,
      runner,
      force,
      onStep,
      signal,
    });
```

</details>

#### 缺口

- 未使用 Web 站或安装宿主插件，未测评分排序与真实候选质量
  **影响**：不能量化省时或推荐命中率
  **进一步探讨**：对照固定候选集，比较手工与市场的正确装法及耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装何时执行、何时转交？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

默认 AI 安装先尝试直装。若已装可直接返回，随后核对配方或过滤已解析的命令，保留白名单子集；无解析命令时还可能使用内置类型分支。安装与冒烟成功后可保存配方。安全模式跳过这段直装，交给子代理并在提示中要求扫描和停止。命令过滤是对所见字符串的检查，不能约束其启动的包代码。安全模式的筛查依赖子代理和宿主实际权限。市场路由可接受 POST 并按 method 分派，所见 handler 中没有独立的调用者验证；上游 webServer 如何认证与授权需按部署核对。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/core/src/router.ts:248-290](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/router.ts#L248-L290)

配方分支及冒烟失败转交

<details>
<summary>查看原文（43行）</summary>

```text
  // 1. 配方命中：环境指纹一致 + 未过期 + 类型一致 → 按配方执行
  if (useRecipe) {
    const recipe = readRecipe(cfg, plugin.id);
    if (
      recipe &&
      recipe.envFingerprint === envFingerprint() &&
      isRecipeFresh(recipe) &&
      recipe.commands.length > 0 &&
      recipe.type === plugin.type
    ) {
      // 命令安全门（issue #165 + #320）：配方命令归一 profile 后**逐条过滤**——
      // 白名单外命令丢弃（不执行），合法子集照常直装；全被丢才升级 T1
      const recipeNorm = normalizeDshProfileCommands(recipe.commands, profile);
      const recipeFilter = filterInstallCommands(plugin, recipeNorm, {
        allowedDestPrefix: cfg.skillsDir,
      });
      if (recipeFilter.pass.length === 0) {
        return {
          mode: "recipe",
          ok: false,
          needAi: true,
          reason: `配方命令未通过直装白名单（${recipeFilter.dropped[0]?.reason ?? "未知"}），已拦截，交 AI 复核`,
          recipe,
        };
      }
      const result = await install(
        recipeFilter.pass,
        recipe.smoke.length > 0 ? recipe.smoke : deriveSmokeCommands(cfg, plugin, profile, pkgName),
      );
      if (result.ok && !result.smokeFailed) {
        writeRecipe(cfg, {
          ...recipe,
          commands: recipeFilter.pass,
          verifiedAt: new Date().toISOString(),
          lastSmoke: "pass",
        });
        return { mode: "recipe", ok: true, needAi: false, result, recipe };
      }
      const reason = result.smokeFailed
        ? "配方冒烟验证失败（可能已过期），交 AI 复核"
        : `配方安装失败：${result.error ?? "未知"}，交 AI 复核`;
      if (result.smokeFailed) writeRecipe(cfg, { ...recipe, lastSmoke: "fail" });
      return { mode: "recipe", ok: false, needAi: true, reason, result, recipe };
```

</details>

**依据 2 · 源码核查**：[plugin/core/src/router.ts:294-336](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/router.ts#L294-L336)

解析命令过滤及内置回退

<details>
<summary>查看原文（43行）</summary>

```text
  // 2. collector 解析命令（有则优先执行；无则内置确定性路径兜底——两者都零 LLM）
  const smoke = deriveSmokeCommands(cfg, plugin, profile, pkgName);
  // 命令安全门（issue #165 + #320）：解析命令**逐条过滤**——白名单外命令丢弃（不执行），
  // 合法子集照常直装（如「add + update」混合批不再整批连坐）；全被丢才升级 T1（reason 带丢弃明细，
  // 告知 AI 不得原样重试被拦截的命令）
  const parsedFilter = filterInstallCommands(plugin, parsed, {
    allowedDestPrefix: cfg.skillsDir,
  });
  if (parsed.length > 0 && parsedFilter.pass.length === 0) {
    return {
      mode: "parsed",
      ok: false,
      needAi: true,
      reason: `解析命令未通过直装白名单（${parsedFilter.dropped[0]?.reason ?? "未知"}）：${parsedFilter.dropped
        .map((b) => b.command.slice(0, 80))
        .join(" ; ")}。直装已拦截、未执行任何命令；复核时不得原样重试被拦截的命令`,
      recipe: null,
    };
  }
  if (parsedFilter.dropped.length > 0) {
    // 丢弃明细进操作日志：直装结果可解释（丢过什么、为什么），不静默
    appendOpLog(cfg, {
      t: new Date().toISOString(),
      op: "install",
      ok: true,
      target: plugin.id,
      msg: `[guard] 丢弃非白名单命令 ${parsedFilter.dropped.length} 条：${parsedFilter.dropped
        .map((b) => `${b.command.slice(0, 60)}（${b.reason}）`)
        .join(" ; ")}`,
    });
  }
  const useParsed = parsedFilter.pass.length > 0;
  // 内置兜底：skill → git clone <repo> <skillsDir>/<name>；cordis → dsh plugin add <pkgName>
  const result = useParsed
    ? await install(parsedFilter.pass, smoke)
    : await installPlugin(cfg, plugin, {
        targetProfile: profile,
        runner,
        force,
        onStep,
        smoke,
        signal,
      });
```

</details>

**依据 3 · 源码核查**：[plugin/core/src/router.ts:337-352](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/router.ts#L337-L352)

冒烟成功后写入配方

<details>
<summary>查看原文（16行）</summary>

```text
  const mode: RouterMode = useParsed ? "parsed" : "builtin";
  if (result.ok && !result.smokeFailed) {
    // 学习配方：实际执行的命令（解析命令 / 内置规范命令）+ 推导冒烟 → 下次零 token
    const recipe: Recipe = {
      pluginId: plugin.id,
      version: null,
      envFingerprint: envFingerprint(),
      type: plugin.type,
      commands: useParsed ? parsedFilter.pass : canonicalCommands(cfg, plugin, profile),
      smoke,
      learnedFrom: "parsed",
      verifiedAt: new Date().toISOString(),
      lastSmoke: "pass",
    };
    writeRecipe(cfg, recipe);
    return { mode, ok: true, needAi: false, result, recipe };
```

</details>

**依据 4 · 源码核查**：[plugin/ui/src/index.ts:1419-1434](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/ui/src/index.ts#L1419-L1434)

安全模式跳过直装

<details>
<summary>查看原文（16行）</summary>

```text
}): Promise<unknown> {
  const { cfg, ctx, args, plugin, profile, security, signal, installId } = opts
  const t0 = security
    ? null
    : await routeInstall(cfg, plugin, {
        profile,
        runner: realRunner(),
        force: Boolean(args.force),
        signal,
      })
  // 取消后：不升级 T1、不记成功度量
  if (signal.aborted) {
    return { started: false, childSessionId: null, cancelled: true, ok: false, error: '安装已取消' }
  }
  // T0 已搞定：零 token，不需要子代理（安全模式下跳过 T0，不走这里）
  if (!security && t0 && !t0.needAi) {
```

</details>

**依据 5 · 源码核查**：[plugin/ui/src/index.ts:1020-1038](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/ui/src/index.ts#L1020-L1038)

子代理提示中的安全复核要求

<details>
<summary>查看原文（19行）</summary>

```text
  const security = opts?.security === true
  const securitySection = security
    ? [
        ``,
        `【⛔ 安全模式：产出命令前必须先扫描（2026-09 新增；防御供应链投毒 + QVD-2026-57410 CVSS 9.8 式网络暴露攻击）】`,
        `在产出 commands 之前，先完成以下安全检查：`,
        `1. 读插件仓库 README 全文关键段 + 安装用的脚本/清单（cordis.patch.yml / dsh.bundle / install.sh / package.json 等），逐个核对：`,
        `   a. 安装命令是否有危险模式：curl|sh、wget 后立即执行、下载二进制执行、base64 解码后执行、从不可信 URL 拉取代码；`,
        `   b. 是否收集/回传敏感信息：读取 API Key / Token / 环境变量（GITHUB_TOKEN、DEEPSEEK_API_KEY、OPENAI_API_KEY 等）并发送到外部地址；`,
        `   c. 是否篡改配置：patch 覆盖 harness 自身配置（sandbox/approval/权限）或把自身混入系统目录；`,
        `   d. 来源信号：仓库年龄与维护活跃、star 量级、是否近期新建（<30 天且低活跃的高危）；`,
        `   e. 网络暴露与信任围栏（QVD-2026-57410 实证：伪造 Host 头即可绕过 DSH 信任围栏，无需密钥直接命令执行——本地端口一旦出公网等于交出控制权）：`,
        `      - 安装脚本/文档是否把本地端口暴露到公网：绑定 0.0.0.0/:: 或 --host 0.0.0.0、EXPOSE、云服务器部署/域名反代/端口转发指引（ngrok、frp、cloudflared、localtunnel、花生壳、ssh -R 等）；`,
        `      - 自带 web 服务的插件是否弱化 Host/Origin 信任：allowedHosts 通配（true 或 "*"）、disableHostCheck、无条件信任 X-Forwarded-*，或诱导用户关闭 DSH 信任围栏/本机校验；`,
        `2. 结论必须明确：`,
        `   - 无风险 → 继续产出安装命令；`,
        `   - 发现可疑（危险命令 / 信息收集 / 配置篡改 / 网络暴露 / 来源存疑）→ **立即停止**：不产出 commands，输出 {"ok":false,"fail":"[security_blocked] <具体风险描述>"} 并结束。`,
        `3. 产出的 recipe 命令须附 "security": "no risk detected" 结论（recipe 仅支持 commands/smoke 字段时省略，安全结论写入 fail 之外无妨）。`,
      ].join('\n')
```

</details>

**依据 6 · 源码核查**：[plugin/ui/src/index.ts:1458-1478](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/ui/src/index.ts#L1458-L1478)

依赖宿主子代理并启动任务

<details>
<summary>查看原文（21行）</summary>

```text
  const agents = ctx.get('agents') as
    | {
        list?: () => Array<{ sessionId?: string; id?: string }>
        /** 0.1.5+：只返回顶层 agent */
        roots?: () => Array<{ sessionId?: string; id?: string }>
      }
    | undefined
  const subagents = ctx.get('subagents') as SubagentsService | undefined
  if (!subagents) throw new Error('子代理服务不可用')
  // 优先 roots()：安装子代理要挂在「当前根会话」下，不能挂到别的子代理上
  const agent = (agents?.roots?.() ?? agents?.list?.() ?? [])[0]
  if (!agent) throw new Error('当前会话代理不可用')
  const provider = subagents.list().includes('spawn') ? 'spawn' : subagents.list()[0]
  const prompt = buildInstallPrompt(plugin, profile, t0?.reason, { security })
  // #228 · 经双版本垫片启动（alpha.1 start / alpha.2 startActivation 自动适配）；
  // start/startActivation 的 promise 在 run 发布后 fulfill，只等发布（10s 超时保护）
  const run = await Promise.race([
    startSubagent(subagents, provider, {
      label: `安装 ${plugin.name}`,
      prompt: [{ type: 'text', text: prompt }],
      parent: agent,
```

</details>

**依据 7 · 源码核查**：[plugin/ui/src/index.ts:913-935](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/ui/src/index.ts#L913-L935)

POST 检查与 dispatch

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: '/market/api',
      handler: async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: 'method not allowed' }))
          return
        }
        try {
          const payload = (await readJsonBody(req)) as RpcRequest
          const result = await dispatch(payload.method, payload.args)
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ ok: true, result }))
        } catch (err) {
          res.writeHead(200, { 'content-type': 'application/json' })
          // P6：所有 RPC 错误统一附人话分类（客户端 RpcError.classified 取用）
          const msg = (err as Error).message ?? 'unknown error'
          res.end(JSON.stringify({ ok: false, error: msg, classified: classifyFailure(msg) }))
        }
      },
    }),
```

</details>

#### 缺口

- 未核对宿主 webServer 的中间件权限及子代理执行边界
  **影响**：不能判断哪些请求能触发安装或模型检查能否拦住恶意包
  **进一步探讨**：在隔离环境用无副作用标记命令核查调用者、权限和实际派发

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、采用判断、效果与总成本

#### 完整回答

目录比较可从浏览器开始，宿主安装则要核对 Web profile、真实插件子包、目标来源和版本，代理分支另需子代理服务。直装解析命令按序运行，取消或失败会返回错误，不能从返回值推断之前已执行动作被撤销。内置 skill 方案在替换目录时先备份，克隆失败有专用回滚。不同分支不能共用同一恢复承诺。安装器的快照和冒烟检查仍需配合检查目标 profile 以及当前挂载状态。初次优先停在只读浏览，失去可核对的来源或安全边界时保持原环境。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-37](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/README.md#L24-L37)

Web 与宿主条件差异

<details>
<summary>查看原文（14行）</summary>

```text
## 两种形态

<p align="center">
  <img src="./assets/readme/section-forms.svg" width="100%" alt="两种形态横幅：Web 版与插件版两个 Logo 通过同一份 plugins.json 数据相连">
</p>

DSH 生态增长极快，插件与技能散落在 GitHub 各处 —— **不知道哪个好用、怎么装、怎么组合成一套能干活的环境**。DSH Market 用一个平台收齐它们，并提供两种消费入口：

| | <img src="./assets/readme/logo-web.svg" width="26" alt="Web 版 Logo"> **Web 版**（已上线） | <img src="./assets/readme/logo-plugin.svg" width="26" alt="插件版 Logo"> **DSH 插件版**（开发完成） |
|---|---|---|
| **位置** | 浏览器 · GitHub Pages 纯静态站 | DSH 侧边栏 · cordis 插件 |
| **定位** | 发现与评估 | 安装与管理 |
| **内容** | 插件（cordis/skill）+ 整合包分区（生态内容市场） | 5-Tab 面板 · 一键安装 · 新手推荐 · 个性化推荐 · 场景推荐 · AI 代理安装（详见 [DSH 插件版](#dsh-插件版)）+ 整合包 Tab |
| **安装** | 零安装，浏览器打开即用 | `npx @deepseek-ai/dsh plugin --profile web add @dsh-market/plugin` |
```

</details>

**依据 2 · 源码核查**：[plugin/ui/src/index.ts:1458-1478](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/ui/src/index.ts#L1458-L1478)

子代理条件

<details>
<summary>查看原文（21行）</summary>

```text
  const agents = ctx.get('agents') as
    | {
        list?: () => Array<{ sessionId?: string; id?: string }>
        /** 0.1.5+：只返回顶层 agent */
        roots?: () => Array<{ sessionId?: string; id?: string }>
      }
    | undefined
  const subagents = ctx.get('subagents') as SubagentsService | undefined
  if (!subagents) throw new Error('子代理服务不可用')
  // 优先 roots()：安装子代理要挂在「当前根会话」下，不能挂到别的子代理上
  const agent = (agents?.roots?.() ?? agents?.list?.() ?? [])[0]
  if (!agent) throw new Error('当前会话代理不可用')
  const provider = subagents.list().includes('spawn') ? 'spawn' : subagents.list()[0]
  const prompt = buildInstallPrompt(plugin, profile, t0?.reason, { security })
  // #228 · 经双版本垫片启动（alpha.1 start / alpha.2 startActivation 自动适配）；
  // start/startActivation 的 promise 在 run 发布后 fulfill，只等发布（10s 超时保护）
  const run = await Promise.race([
    startSubagent(subagents, provider, {
      label: `安装 ${plugin.name}`,
      prompt: [{ type: 'text', text: prompt }],
      parent: agent,
```

</details>

**依据 3 · 源码核查**：[plugin/core/src/installer.ts:58-72](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/installer.ts#L58-L72)

三类安装分支和冒烟条件

<details>
<summary>查看原文（15行）</summary>

```text
  try {
    let r: InstallResult;
    if (options.commands && options.commands.length > 0) {
      r = await installByCommands(cfg, plugin, options, step, steps);
    } else if (plugin.type === "skill") {
      r = await installSkill(cfg, plugin, options, step, steps);
    } else {
      r = await installCordis(cfg, plugin, options, step, steps);
    }
    // 装后冒烟验证（dryRun 不执行；已装跳过场景也会验证存量健康；已取消不验证）
    if (r.ok && !options.dryRun && !options.signal?.aborted && options.smoke && options.smoke.length > 0) {
      r.smoke = await runSmoke(options.smoke, options.runner);
      r.smokeFailed = r.smoke.some((s) => !s.ok);
    }
    return r;
```

</details>

**依据 4 · 源码核查**：[plugin/core/src/installer.ts:99-118](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/installer.ts#L99-L118)

已解析命令逐步执行，失败路径只返回错误

<details>
<summary>查看原文（20行）</summary>

```text
    packageJsonBefore: null,
  };
  try {
    for (let i = 0; i < commands.length; i++) {
      if (options.signal?.aborted) {
        step(stepId, `执行 ${commands.length} 条安装命令`, "failed", "已取消");
        return { ok: false, steps, error: "安装已取消" };
      }
      const id = `cmd-${i}`;
      step(id, commands[i], "running");
      await runWithRetry(options, step, id, commands[i], PLUGIN_ADD_TIMEOUT);
      step(id, commands[i], "done");
    }
    step(stepId, `执行 ${commands.length} 条安装命令`, "done");
    saveSnapshot(cfg, snapshot);
    return { ok: true, steps, snapshot, requiresRestart: plugin.type !== "skill" };
  } catch (err) {
    step(stepId, "执行安装命令", "failed", (err as Error).message);
    return { ok: false, steps, error: (err as Error).message };
  }
```

</details>

**依据 5 · 源码核查**：[plugin/core/src/installer.ts:204-234](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/installer.ts#L204-L234)

内置 skill 备份及错误回滚

<details>
<summary>查看原文（31行）</summary>

```text
  try {
    if (!options.dryRun) {
      if (!existsSync(cfg.skillsDir)) mkdirSync(cfg.skillsDir, { recursive: true });
      // 目标已存在且 force：先备份为 .bak
      if (snapshot.existedBefore) {
        step("backup", "备份旧版本", "running");
        const bak = `${dest}.bak-${Date.now()}`;
        const { renameSync } = await import("node:fs");
        renameSync(dest, bak);
        snapshot.packageJsonBefore = bak;
        step("backup", "备份旧版本", "done", bak);
      }
      await runWithRetry(
        options,
        step,
        "clone",
        `git clone --depth 1 ${repoUrl} ${dest}`,
        SKILL_CLONE_TIMEOUT,
      );
      step("clone", `克隆 ${plugin.fullName}`, "done");
    } else {
      step("clone", `克隆 ${plugin.fullName}`, "done", "(dry-run)");
    }
  } catch (err) {
    step("clone", `克隆 ${plugin.fullName}`, "failed", (err as Error).message);
    await rollbackSkill(cfg, snapshot, options, step);
    throw err;
  }

  saveSnapshot(cfg, snapshot);
  return { ok: true, steps, snapshot };
```

</details>

#### 缺口

- 未执行安装、卸载或取消，对费用和恢复耗时无测量
  **影响**：不能确认生产环境恢复能力和转交代理成本
  **进一步探讨**：只在独立 profile 对照正常安装、中途失败及恢复清单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何减少对冒烟成功的误判？

**研究主题**：新假设与验证

#### 完整回答

现有安装结果区分 install ok 与 smokeFailed，冒烟可以由结构化检查或命令退出状态得出。可在界面进一步区分文件存在、已挂载、用户核心动作通过，保存实际检查层级而非给一个通过图标。对照现有界面和分层界面，注入已写文件但宿主未挂载以及已挂载但核心功能错误两种情形。测误判成功比例和诊断时长。若误判不降或导致更多无意义的操作，则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/core/src/installer.ts:58-72](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/installer.ts#L58-L72)

安装与冒烟两个状态

<details>
<summary>查看原文（15行）</summary>

```text
  try {
    let r: InstallResult;
    if (options.commands && options.commands.length > 0) {
      r = await installByCommands(cfg, plugin, options, step, steps);
    } else if (plugin.type === "skill") {
      r = await installSkill(cfg, plugin, options, step, steps);
    } else {
      r = await installCordis(cfg, plugin, options, step, steps);
    }
    // 装后冒烟验证（dryRun 不执行；已装跳过场景也会验证存量健康；已取消不验证）
    if (r.ok && !options.dryRun && !options.signal?.aborted && options.smoke && options.smoke.length > 0) {
      r.smoke = await runSmoke(options.smoke, options.runner);
      r.smokeFailed = r.smoke.some((s) => !s.ok);
    }
    return r;
```

</details>

**依据 2 · 源码核查**：[plugin/core/src/installer.ts:121-134](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/installer.ts#L121-L134)

命令式冒烟以退出状态为准

<details>
<summary>查看原文（14行）</summary>

```text
/** 冒烟验证：结构化检查进程内直查（零 shell、跨平台可靠）；命令字符串交给 shell（退出码 0 即通过） */
async function runSmoke(checks: SmokeCheck[], runner: CommandRunner): Promise<SmokeResult[]> {
  const out: SmokeResult[] = [];
  for (const check of checks) {
    if (typeof check === "string") {
      try {
        const r = await runner.run(check, { timeoutMs: 30_000 });
        out.push({
          label: check,
          command: check,
          ok: r.exitCode === 0,
          output: r.exitCode === 0 ? undefined : (r.stderr || r.stdout).slice(0, 300),
        });
      } catch (err) {
```

</details>

**依据 3 · 源码核查**：[plugin/core/src/router.ts:337-352](https://github.com/2BingLing/dsh-market/blob/500057b4e9f9940b4fecaa63a2893c7c313acc13/plugin/core/src/router.ts#L337-L352)

成功冒烟写入配方

<details>
<summary>查看原文（16行）</summary>

```text
  const mode: RouterMode = useParsed ? "parsed" : "builtin";
  if (result.ok && !result.smokeFailed) {
    // 学习配方：实际执行的命令（解析命令 / 内置规范命令）+ 推导冒烟 → 下次零 token
    const recipe: Recipe = {
      pluginId: plugin.id,
      version: null,
      envFingerprint: envFingerprint(),
      type: plugin.type,
      commands: useParsed ? parsedFilter.pass : canonicalCommands(cfg, plugin, profile),
      smoke,
      learnedFrom: "parsed",
      verifiedAt: new Date().toISOString(),
      lastSmoke: "pass",
    };
    writeRecipe(cfg, recipe);
    return { mode, ok: true, needAi: false, result, recipe };
```

</details>

#### 缺口

- 未逐个核对现有客户端状态，也未做对照实验
  **影响**：不能确定分层提示是否新增价值
  **进一步探讨**：先核对客户端标签，再用上述故障矩阵比较用户判断

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
