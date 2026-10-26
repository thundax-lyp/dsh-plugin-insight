# dsh-model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[57c198b](https://github.com/AIcivilization/dsh-model/tree/57c198bbd973fea8cc63eea3dc36715da947bd7a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,009](https://img.shields.io/static/v1?label=npm+30d&message=2%2C009&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)
<!-- END META -->

> **实现功能**：整合模型中转、来源登录与管理、组合切换、设备密钥及每日签到，并同步到DSH。

> **核心亮点**：围绕上游CLIProxyAPI补齐多平台生命周期、来源/设备key与DSH管理接线，并把签到独立管理，减少多客户端重复配置。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：HTTP成功开始流转就结束fallback选择，流中失败不换；同JSON切到不同模型不保证工具/图像/质量等价，统一地址也不提供额度。参见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 统一模型与签到为谁交付什么，上游贡献如何分配？](#detail-section-11)
  - [Q02 · 安装与combo切换如何完成，哪些失败不能恢复？](#detail-section-12)
  - [Q03 · 密钥、自动签到、VPS与退出的总负担是什么？](#detail-section-13)
  - [Q04 · 怎样有限试用并检验新路由假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多来源、多客户端用户统一入口与运维；签到是独立账号动作，合格输出仍需核授权、实际来源和任务质量。

各客户端分别配置官方API或自行部署CLIProxyAPI为参照；本项减少管理接线，不替代来源授权或证明模型效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统一模型入口 | 多客户端共用配置 | 需引擎/有效授权，非额度提供 |
| 组合切换 | 请求失败时顺序降级 | 流中不重放、质量非等价 |
| 自动签到 | 领取已有账号积分 | 默认开启，第三方资格/网络 |
| 生命周期 | 安装/修复/卸载 | 多服务与可选远端，需运维 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、引擎资产/服务权限 | 核心必需 | 统一网关 | 停在引擎步骤，修复后重跑 |
| 供应商授权/网络/额度 | 各来源必需 | 请求与签到 | 换允许来源或停用，非凭空额度 |
| VPS root/Caddy/公网 | 远端可选 | 外部地址 | 只本机，避免扩大暴露 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装setup并备份 | 引擎校验与鉴权自检 |
| 2 | 用户接入少量来源/设备key | 实际可用且无key拒绝 |
| 3 | 用户核请求与fallback | 任务合格、实际来源/成本可查 |
| 4 | 用户禁用/卸载验收 | 服务/配置/远端逐步核，失败留home |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 二进制、服务、账号/可选VPS | 安装登录、鉴权/配置备份 | 金额和工时未核 |
| 持续使用 | 订阅/API、daemon、重试、存储 | 核用量/实际模型/自动签到 | 免费与积分为作者条件非保证 |
| 失败恢复 | 重试调用、轮换/重装 | 恢复配置、拆服务/远端、凭据 | 需分步验收，单位成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一接入 | 单地址/key与来源管理 | 各来源现时资格和费用 |
| 容错 | 请求开始前顺序切换 | 流中恢复/跨模型合格率 |
| 运维 | 资产校验、分步退出 | 全平台无损恢复与总成本 |

> **思考**：HTTP成功开始流转就结束fallback选择，流中失败不换；同JSON切到不同模型不保证工具/图像/质量等价，统一地址也不提供额度。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：围绕上游CLIProxyAPI补齐多平台生命周期、来源/设备key与DSH管理接线，并把签到独立管理，减少多客户端重复配置。参见[Q01](#research-q01)、[Q02](#research-q02)。

围绕上游CLIProxyAPI补齐多平台生命周期、来源/设备key与DSH管理接线，并把签到独立管理，减少多客户端重复配置。参见[Q01](#research-q01)、[Q02](#research-q02)。

资产SHA、禁止combo嵌套、分步错误汇总和卸载失败保home值得借鉴；来源转换、公开端点与流响应状态需分别建模，不能把成功码当合格答案。

<a id="detail-section-5"></a>

### 1.4 主要限制

HTTP成功开始流转就结束fallback选择，流中失败不换；同JSON切到不同模型不保证工具/图像/质量等价，统一地址也不提供额度。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有运维能力者本机少来源非敏感试用，先不开放远端并关闭不需签到；核授权/鉴权/流失败与退出。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

管理与切换机制有源码支持；第三方资格、费用、真实宿主及跨模型任务等价未验证，契约路由是假设。

- 已检查：作者 README、包清单、源码路径 src/commands/setup.ts、src/commands/uninstall.ts、src/engine/install.ts、src/combo.ts、src/checkin/index.ts、src/secrets.ts、plugin/index.js、engine-manifest.json、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核setup、资产校验、combo、签到、插件局部围栏和卸载；未执行引擎/登录/远端/模型，不全面审计所有供应商与原生服务实现。
- 下一步：未运行目标。先本机核鉴权/卸载，再以工具、图像、JSON、长上下文和429/流断对照合格率及总成本。

**分析版本**

- **仓库**：[AIcivilization/dsh-model](https://github.com/AIcivilization/dsh-model)
- **版本号**：0.23.1（[固定提交 57c198b](https://github.com/AIcivilization/dsh-model/tree/57c198bbd973fea8cc63eea3dc36715da947bd7a)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为能力/来源/预算契约约束fallback并输出实际尝试收据，以同预算合格任务率衡量而非HTTP成功率。参见[Q04](#research-q04)。

未运行目标。先本机核鉴权/卸载，再以工具、图像、JSON、长上下文和429/流断对照合格率及总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1533 | 1394 | 93 | — |
| .md | source | 5 | 1013 | — | — | 16081 |
| .mjs | source | 1 | 44 | 31 | 8 | — |
| .ts | source | 86 | 13867 | 10439 | 2476 | — |
| .ts | test | 30 | 2502 | 2247 | 93 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+created%3A2026-09-23T01%3A50%3A40.453Z..2026-10-23T01%3A50%3A40.453Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A50%3A40.453Z..2026-10-23T01%3A50%3A40.453Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一模型网关/签到的独立贡献、切换保真及运维成本是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一模型与签到为谁交付什么，上游贡献如何分配？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

有多个模型来源、希望DSH和其他OpenAI客户端共用地址的用户是主要对象；签到则面向已拥有Trae/Qoder/WorkBuddy账号的人。合格任务是鉴权后把指定请求送达允许来源、得到可用响应并能解释失败/用量；签到成功只说明账号积分领取状态，不自动变成任意模型可用额度。

相对每客户端分别配置供应商，本项整合引擎安装、守护、来源管理、每设备key、组合与DSH同步。CLIProxyAPI 8.0.13为明确上游，引擎协议与大量供应商兼容能力不可算插件原创；独立增量在生命周期和管理接线。README费用/积分是作者固定材料，不是当前价格或服务资格保证。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:22-61](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/README.md#L22-L61)

签到与统一入口/来源定位。

<details>
<summary>查看原文（40行）</summary>

```text
## 📅 1. 每日签到：积分自动到账

**最省心的一件事：每天的签到积分，不用再记着去领。**

| 产品 | 怎么接入 | 每天 |
|---|---|---|
| **Trae** | 本机装了 Trae 并登录过，自动识别，什么都不用做 | 签到送积分（实测每天 200） |
| **Qoder** | 粘贴一次个人访问令牌（国内版、国际版都行） | 领当天的签到积分 |
| **WorkBuddy 国内版** | 登录一次 | 签到送积分 |

- **自动签到默认打开**：北京时间零点后随机延后 5–55 分钟签好；失败的一小时后重试；电脑关机错过了，开机一分钟内补签。
- **结果看得见**：设置页顶部一行「今日已完成签到：…」，没签上的可以「一键签到」；签完在 dsh 右下角提示一次。
- **只签到，不碰积分**：积分留在你的账号里，照常在各家官方软件里用。命令行：`dsh-model checkin`。

## 🔁 2. 中转：一个地址、一把 key，用上所有模型

你手上的模型来源，各家接口、登录方式都不一样。dsh-model 把它们合成**一个 OpenAI 兼容地址**：

- **dsh 里自动出现**：全部模型按来源分组，不用手动配置。
- **其他软件也能用**：Cline、Continue、Cherry Studio、脚本……凡是支持 OpenAI 接口的，填同一个地址和 key 就行。
- **不怕限流**：自己排一个组合（如 Codex → Kimi → Gemini），一个限流、额度用完或出错，就自动换下一个。
- **心里有数**：套餐用量和重置倒计时、每个模型的成功率和速度、最近失败的原因和该怎么办；额度快用完时提醒。
- **默认安全**：始终要求 key，每台设备一把，可随时吊销；登录全在本机完成。
- **电脑和服务器都行**：Windows、macOS、Linux；装在 VPS 上（配合 [dsh-vps](https://github.com/AIcivilization/dsh-vps)）自动开一个 https 地址，电脑、手机随处用。卸载时把 dsh 的配置逐字节还原。

## 🧩 3. 模型提供：免费的、订阅的都能接

| 类型 | 来源 |
|---|---|
| **免费（推荐）** | **硅基流动**（国内直连，实名后部分模型免费）、**Gemini**（能上外网，免费模型里质量最好） |
| 免费 · 额度少 | Groq、OpenRouter（`:free` 模型） |
| 本机 | Ollama、LM Studio：启动后自动出现，不用登录 |
| 订阅 | Codex（ChatGPT Plus / Pro）、Kimi Code、Grok、Muse、Devin：在管理页里登录即可 |
| 按量付费 | DeepSeek 官方、OpenCode Zen、任意 OpenAI 兼容服务 |

每个来源都标出「免费 / 免费·额度少 / 需付费」，详见下面的[来源与费用](#来源与费用)。dsh-model 只负责转接，不提供额度。

> WorkBuddy：2026-10 起它会认出 dsh 发出的对话并拦下，所以 dsh-model 只用它来签到，模型默认不接进 dsh。


```

</details>

**依据 2 · 源码核查**：[engine-manifest.json:1-10](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/engine-manifest.json#L1-L10)

上游与固定版本/摘要。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "CLIProxyAPI",
  "repo": "router-for-me/CLIProxyAPI",
  "license": "MIT",
  "version": "8.0.13",
  "assets": {
    "darwin-aarch64": {
      "file": "CLIProxyAPI_8.0.13_darwin_aarch64.tar.gz",
      "url": "https://github.com/router-for-me/CLIProxyAPI/releases/download/v8.0.13/CLIProxyAPI_8.0.13_darwin_aarch64.tar.gz",
      "sha256": "652a192e3e38520253e330c4a094fa8916728370c3f213f127dbc56e35be7938"
```

</details>

**依据 3 · 源码核查**：[src/commands/setup.ts:72-105](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/commands/setup.ts#L72-L105)

引擎、daemon和插件接线。

<details>
<summary>查看原文（34行）</summary>

```text
    info('')
    info(bold(L('统一端点（引擎）', 'Unified endpoint (engine)')))
    let engineRunning = false
    await step('engine', async () => {
      engineRunning = await ensureEngine(ctx, all, { port: opts.port })
    })
    if (failures.includes('engine')) {
      warn(L('引擎没装好，后面的步骤都依赖它，先停在这里', 'The engine is not ready and everything else depends on it; stopping here'))
      return 1
    }

    info('')
    info(bold(L('守护进程', 'Daemon')))
    await step('daemon', () => ensureDaemon(ctx, all))

    info('')
    info(bold('OpenCode Zen'))
    if (opts.skipOpencode) skip(L('已跳过（--skip-opencode）', 'Skipped (--skip-opencode)'))
    // 安装时不问 key：要用的话在 dsh「设置 → dsh-model → 来源」里填，或执行 dsh-model opencode key
    else if (await opencodeConfigured(ctx)) await step('opencode', () => configureOpencode(ctx, all))
    else skip(L('没填 key，跳过；需要时在 dsh「设置 → dsh-model → 来源」里打开它（或执行 dsh-model opencode key）', 'No key, skipped; when you need it, turn it on in dsh Settings → dsh-model → Sources (or run dsh-model opencode key)'))

    info('')
    info(bold('WorkBuddy'))
    if (opts.skipWorkbuddy) skip(L('已跳过（--skip-workbuddy）', 'Skipped (--skip-workbuddy)'))
    else {
      await step('workbuddy', () => enableWorkbuddy(ctx, all))
      if (await userPluginInstalled(ctx, all)) warn(L('你自己装了 dsh-workbuddy-connect 插件：dsh 里会有两组 WorkBuddy 模型。不需要的话可在 dsh 的插件页移除它', 'You installed the dsh-workbuddy-connect plugin yourself: dsh will show two WorkBuddy groups. Remove it from the dsh Plugins page if you do not need it'))
    }

    info('')
    info(bold(L('dsh 插件页', 'dsh plugin page')))
    if (opts.skipDshPlugin) skip(L('已跳过（--skip-dsh-plugin）', 'Skipped (--skip-dsh-plugin)'))
    else await step('dsh-plugin', () => installDshPlugin(ctx, all))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装与combo切换如何完成，哪些失败不能恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

setup在锁内读取状态，分步骤迁移、下载校验引擎、安装服务/daemon、插件和同步；引擎失败停止后续，其他已识别错误汇总并保存，重跑用于修复。manifest固定各平台资产SHA，下载后核摘要；这是制品一致性，不是上游二进制独立安全审计。

combo禁止嵌套且至少两模型，daemon逐个把同一JSON请求替换model发回本机引擎。400/422仅在额度/上下文等关键词匹配才降级，其他状态可继续。收到HTTP成功和body就把流返回；中途流错误仅结束响应，不再切换。因此“出错自动换下一个”主要在开始流转前成立，不保证流中恢复。顺序failover会改变实际模型和来源，响应头带实际model，但调用方是否保留/展示需核。

#### 证据与依据

**依据 1 · 源码核查**：[src/commands/setup.ts:41-80](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/commands/setup.ts#L41-L80)

锁、分步与失败停止。

<details>
<summary>查看原文（40行）</summary>

```text
export async function setup(ctx: Ctx, opts: SetupOptions): Promise<number> {
  requireRootInVps(ctx)
  return withLock(ctx, async () => {
    const all = await loadAll(ctx)
    await ensureDir(ctx.paths.home, { owner: ctx.owner })
    resolveProxy(all, opts, await detectProxy(ctx.env, ctx.platform))
    if (opts.profile) all.config.dsh.profile = opts.profile

    const loc = await locateDsh(ctx, all.config.dsh.profile)
    all.config.dsh.profile = loc.profile
    ok(L(`dsh ${loc.version ?? ''}（profile：${loc.profile}）`, `dsh ${loc.version ?? ''} (profile: ${loc.profile})`))
    await saveAll(ctx, all)

    const failures: string[] = []
    const step = async (name: string, fn: () => Promise<unknown>) => {
      try {
        await fn()
      } catch (error) {
        if (!isDshModelError(error)) throw error
        failures.push(name)
        warn(`${error.message}${error.hint ? `\n  ${error.hint}` : ''}`)
      }
      await saveAll(ctx, all)
    }

    // v0.2.0 的做法（dsh 内置 opencode 路由、dsh-workbuddy-connect 插件）迁到统一端点
    await step('migrate', async () => {
      if (await migrateDshOpencode(ctx, all)) ok(L('已把 OpenCode 从 dsh 内置路由迁到统一端点', 'Moved OpenCode from the dsh built-in route to the unified endpoint'))
      if (await removeWorkbuddyPlugin(ctx, all)) ok(L('已移除上一版安装的 dsh-workbuddy-connect 插件，改用 dsh-model 自己的 bridge', 'Removed the dsh-workbuddy-connect plugin installed by the previous version; using dsh-model\'s own bridge'))
    })

    info('')
    info(bold(L('统一端点（引擎）', 'Unified endpoint (engine)')))
    let engineRunning = false
    await step('engine', async () => {
      engineRunning = await ensureEngine(ctx, all, { port: opts.port })
    })
    if (failures.includes('engine')) {
      warn(L('引擎没装好，后面的步骤都依赖它，先停在这里', 'The engine is not ready and everything else depends on it; stopping here'))
      return 1
```

</details>

**依据 2 · 源码核查**：[src/engine/install.ts:83-111](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/engine/install.ts#L83-L111)

资产摘要核对。

<details>
<summary>查看原文（29行）</summary>

```text
 * DSH_MODEL_ENGINE_ARCHIVE 可指向本地 tar.gz（离线 / 测试），同样要过 sha256 校验。
 */
export async function installVersion(ctx: Ctx, version: string, asset: ManifestAsset): Promise<boolean> {
  const bin = versionBinary(ctx, version)
  if (await exists(bin)) return false

  await ensureDir(ctx.paths.tmp, { owner: ctx.owner })
  await mkdir(ctx.paths.versionsDir, { recursive: true })
  const archive = join(ctx.paths.tmp, asset.file)
  const partial = join(ctx.paths.versionsDir, `${version}.partial`)
  try {
    const local = ctx.env.DSH_MODEL_ENGINE_ARCHIVE
    let data: Buffer
    if (local) {
      data = await readFile(local)
    } else {
      const res = await fetch(asset.url)
      if (!res.ok || !res.body) throw new DshModelError('engine_download_failed', L(`下载引擎失败：HTTP ${res.status}`, `Engine download failed: HTTP ${res.status}`), asset.url)
      await pipeline(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), createWriteStream(archive, { mode: 0o600 }))
      data = await readFile(archive)
    }
    const actual = sha256(data)
    if (actual !== asset.sha256) {
      throw new DshModelError(
        'engine_checksum_mismatch',
        L(`引擎文件校验失败：期望 ${asset.sha256}，实际 ${actual}`, `Engine checksum mismatch: expected ${asset.sha256}, got ${actual}`),
        L('文件可能被篡改或下载不完整，已中止。', 'The file may be tampered with or incomplete; aborted.'),
      )
    }
```

</details>

**依据 3 · 源码核查**：[src/combo.ts:34-55](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/combo.ts#L34-L55)

combo范围和错误判断。

<details>
<summary>查看原文（22行）</summary>

```text
export function normalizeCombo(input: { name?: unknown; models?: unknown }, available?: string[]): { name: string; models: string[] } {
  const name = String(input.name ?? '').trim()
  if (!name || name.length > 30) throw new DshModelError('bad_combo', L('组合要有名字（最多 30 个字）', 'A combo needs a name (up to 30 characters)'))
  const raw = Array.isArray(input.models) ? input.models.map((m) => String(m).trim()).filter(Boolean) : []
  const models = [...new Set(raw)]
  if (models.length < 2) throw new DshModelError('bad_combo', L('组合至少要两个模型', 'A combo needs at least two models'))
  if (models.length > MAX_COMBO_MODELS) throw new DshModelError('bad_combo', L(`组合最多 ${MAX_COMBO_MODELS} 个模型`, `A combo holds up to ${MAX_COMBO_MODELS} models`))
  const nested = models.find((m) => m.startsWith(`${COMBO_PREFIX}/`))
  if (nested) throw new DshModelError('bad_combo', L(`组合里不能再放组合（${nested}）`, `A combo cannot contain another combo (${nested})`))
  if (available) {
    const have = new Set(available)
    const missing = models.filter((m) => !have.has(m))
    if (missing.length) throw new DshModelError('bad_combo', L(`这些模型现在用不了：${missing.join('、')}`, `These models are not available now: ${missing.join(', ')}`))
  }
  return { name, models }
}

/** 这次失败值得换下一个吗：请求本身写错了（400 且不是额度/长度问题）换了也一样，直接返回 */
export function shouldFallBack(status: number, text: string): boolean {
  if (status !== 400 && status !== 422) return true
  if (BLOCKED_RE.test(text)) return true
  return /quota|rate|limit|credit|context|too long|too many tokens|maximum|exceed|overload|unavailable|not supported|unsupported/i.test(text)
```

</details>

**依据 4 · 源码核查**：[src/combo.ts:81-115](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/combo.ts#L81-L115)

逐模型发送与流中失败边界。

<details>
<summary>查看原文（35行）</summary>

```text
  for (const model of combo.models) {
    if (run.signal.aborted) return
    let upstream: Response
    try {
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
      })
    } catch (error) {
      if (run.signal.aborted) return
      last = { status: 502, text: String((error as Error).message ?? error) }
      tried.push(`${model}: ${last.text.slice(0, 120)}`)
      continue
    }
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
      const stream = Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0])
      stream.on('error', (error: unknown) => {
        log(`combo ${combo.id}: ${model} stream failed mid-flight: ${String(error)}`)
        if (res.writable) res.end()
      })
      stream.pipe(res)
      return
    }
    const text = await upstream.text().catch(() => '')
    last = { status: upstream.status, text }
    tried.push(`${model}: HTTP ${upstream.status}`)
    if (!shouldFallBack(upstream.status, text)) break
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 密钥、自动签到、VPS与退出的总负担是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

统一入口仍依赖各来源有效授权、网络/地区/套餐及模型能力。key和签到PAT成为本地敏感状态，插件路由有同源和随机页面token检查；但其注释“webServer上所以经过登录”不能代替对目标宿主认证层的独立核查。自动签到默认开启，按北京时间日期和随机延后判定、失败一小时再试，收益取决第三方服务且默认后台动作应明确告知用户。

VPS setup会额外部署admin和Caddy公开端点，root与远程暴露显著扩大维护边界，不能按桌面一条命令估成本。首次有二进制/服务/账号迁移，持续有模型费/订阅、VPS与daemon、跨来源重试和审核实际回答，失败恢复包括凭据轮换、配置还原、服务及远端拆除。uninstall逐步逆序且错误时保留home供重试，不能称所有情况下逐字节无损。免费/签到量、现金与人工分钟均未独立核实，未知不填0。

#### 证据与依据

**依据 1 · 源码核查**：[src/checkin/index.ts:71-102](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/checkin/index.ts#L71-L102)

签到持久、默认自动和一小时重试。

<details>
<summary>查看原文（32行）</summary>

```text
export async function runCheckin(home: string, checkers: Checker[], opts: { force?: boolean; owner?: Owner } = {}): Promise<CheckinItem[]> {
  const file = await loadCheckin(home)
  const { date } = beijingNow()
  const results = new Map(todayResults(file).map((r) => [r.id, r]))
  for (const c of checkers) {
    const prev = results.get(c.id)
    if (!opts.force && prev && prev.state !== 'failed') continue
    const at = new Date().toISOString()
    try {
      const r = await c.run()
      results.set(c.id, { id: c.id, label: c.label, state: r.state, ...(r.credit !== undefined ? { credit: r.credit } : {}), at })
    } catch (error) {
      const message = String((error as Error).message ?? error).slice(0, 200)
      results.set(c.id, { id: c.id, label: c.label, state: 'failed', message, at })
    }
  }
  const next: CheckinFile = { ...file, date, results: [...results.values()] }
  await writeJson(checkinPath(home), next, { owner: opts.owner })
  return next.results
}

/** 现在该不该自动签：打开了、过了今天的随机延后、有没签上的（失败的隔一小时再试） */
export function autoDue(file: CheckinFile, checkers: Checker[], now = new Date()): boolean {
  if (file.auto === false || !checkers.length) return false
  const { date, minutes } = beijingNow(now)
  const jitter = file.jitter?.date === date ? file.jitter.minutes : 0
  if (minutes < jitter) return false
  const today = new Map(todayResults(file, now).map((r) => [r.id, r]))
  return checkers.some((c) => {
    const r = today.get(c.id)
    if (!r) return true
    return r.state === 'failed' && now.getTime() - Date.parse(r.at) > 60 * 60 * 1000
```

</details>

**依据 2 · 源码核查**：[src/commands/setup.ts:107-123](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/commands/setup.ts#L107-L123)

VPS额外公开端点。

<details>
<summary>查看原文（17行）</summary>

```text
    // vps：让 dsh 管理页能直接点「更新 / 卸载」（root 执行，只认这两件事）
    if (ctx.mode === 'vps' && !ctx.serviceDisabled) await step('admin', () => installAdmin(ctx))

    // vps：自动在 dsh 的域名上开对外端点（没有域名就用 IP），自己的其他设备直接能用
    if (ctx.mode === 'vps') {
      info('')
      info(bold(L('对外端点', 'Public endpoint')))
      if (all.state.remote?.mode && all.state.remote.mode !== 'off' && all.state.remote.mode !== 'caddy') skip(L(`已用 ${all.state.remote.mode} 方式开放，保持不变`, `Already exposed via ${all.state.remote.mode}; unchanged`))
      else
        await step('public-endpoint', async () => {
          const host = await publicHost(all.config.remote.domain)
          const port = all.config.remote.publicPort ?? DEFAULT_PUBLIC_PORT
          await enableCaddy(ctx, all, host, port)
          all.config.remote.domain = host
          all.config.remote.publicPort = port
          ok(`https://${host}:${port}/v1`)
        })
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:125-129](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/plugin/index.js#L125-L129)

局部同源/token检查。

```text
function check(req, token, needToken = true) {
  if (req.method !== 'POST') return { code: 405, error: 'POST only' }
  if (!String(req.headers['content-type'] ?? '').includes('application/json')) return { code: 415, error: 'application/json only' }
  if (!sameOrigin(req)) return { code: 403, error: 'cross-site request refused' }
  if (needToken && String(req.headers[TOKEN_HEADER] ?? '') !== token) return { code: 403, error: 'wrong token' }
```

**依据 4 · 源码核查**：[src/commands/uninstall.ts:48-98](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/commands/uninstall.ts#L48-L98)

分步退出与失败保留状态。

<details>
<summary>查看原文（51行）</summary>

```text
  const errors: string[] = []
  const step = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn()
    } catch (error) {
      errors.push(`${name}: ${(error as Error).message}`)
      fail(`${name}: ${(error as Error).message}`)
    }
  }

  await step('remote', async () => {
    if (all.state.remote && all.state.remote.mode !== 'off') await disableRemote(ctx, all)
  })
  // 移除插件只是尽力而为：dsh 的 pnpm 可能因"新版本要等一天"的规则拒绝改动（2026-10-14 实测，连删除也会被拦）。
  // 这一步失败不该让卸载停在半路：服务、配置照样清掉，home 照样删，插件请用户在 dsh 的插件页手动删。
  try {
    if (await removeDshPlugin(ctx, all, { force: opts.removePlugin })) ok(L('已从 dsh 移除 dsh-model 插件', 'Removed the dsh-model plugin from dsh'))
  } catch (error) {
    warn(L(`没能自动从 dsh 移除 dsh-model 插件（${(error as Error).message}）：请在 dsh 的插件页里手动删掉它`, `Could not remove the dsh-model plugin from dsh automatically (${(error as Error).message}); remove it on the dsh Plugins page`))
  }
  await step('workbuddy', async () => {
    if (await removeWorkbuddyPlugin(ctx, all)) ok(L('已移除上一版安装的 WorkBuddy 插件', 'Removed the WorkBuddy plugin installed by a previous version'))
    if (await disableWorkbuddy(ctx, all)) ok(L('WorkBuddy bridge 服务已移除', 'WorkBuddy bridge service removed'))
  })
  await step('dsh', async () => {
    if (!all.state.dsh) return
    const r = await disconnectDsh(ctx, all.state)
    ok(L(`dsh 配置已还原（patch：${r.patch}，凭据：${r.cred}）`, `dsh config restored (patch: ${r.patch}, credentials: ${r.cred})`))
  })
  await saveAll(ctx, all).catch(() => {})
  await step('admin', async () => {
    if (ctx.mode === 'vps') await removeAdmin()
  })
  await step('service', async () => {
    if (ctx.serviceDisabled) return
    await serviceFor(ctx).uninstall()
    ok(L('系统服务已移除', 'Service removed'))
  })
  await step('auth-backup', async () => {
    if (!opts.keepAuth || !authCount) return
    const dest = join(homedir(), `dsh-model-auth-backup-${timestamp()}`)
    await cp(ctx.paths.auth, dest, { recursive: true, filter: (src) => !src.includes('/logs') })
    ok(L(`登录凭据已备份到 ${dest}`, `Credentials backed up to ${dest}`))
  })
  if (errors.length) {
    warn(L(`有 ${errors.length} 步失败，保留了 ${ctx.paths.home} 以便重试（再次执行 uninstall）`, `${errors.length} step(s) failed; kept ${ctx.paths.home} so you can retry (run uninstall again)`))
    return 1
  }
  // Windows：刚结束的进程可能还没完全退出、还占着目录，删除会短暂报 EBUSY / EPERM，重试一会儿
  await rm(ctx.paths.home, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 })
  ok(L(`已删除 ${ctx.paths.home}，卸载完成`, `Deleted ${ctx.paths.home}; uninstall complete`))
```

</details>

#### 缺口

- 第三方授权/费用、目标宿主认证与安装退出未验
  **影响**：可用性、成本和暴露面决定采用
  **进一步探讨**：只选合法可用的来源，读当前官方授权/费用及目标认证契约，再隔离核服务/禁用/卸载，不把作者声明作保证

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样有限试用并检验新路由假设？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议具备服务/凭据维护能力的人在本机非敏感范围试用，先只接一两个明确可用来源、禁用不需要的自动签到/远端，核无key拒绝、实际model、用量、流中失败和退出。新手或不允许转发/订阅来源不明的组织先观察，不用它替代来源自身授权。没有本轮宿主/服务验收，不判值得安装。

未验证假设是任务契约驱动的fallback，把上下文上限、工具/图像/结构化输出、允许来源和预算作为切换前条件，并留实际来源及尝试成本收据。由同JSON换model和流中不可重放推导，它可能让成功HTTP更接近合格任务，代价是能力元数据维护和少切换。最小对照在同任务/总预算下使用工具调用、图像、严格JSON和长上下文，注入429/流中断；比较合格交付率、未授权来源数、重试token与人工复核。若响应可达增加但合格率/总成本不优则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:81-110](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/combo.ts#L81-L110)

相同请求换model与流边界。

<details>
<summary>查看原文（30行）</summary>

```text
  for (const model of combo.models) {
    if (run.signal.aborted) return
    let upstream: Response
    try {
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
      })
    } catch (error) {
      if (run.signal.aborted) return
      last = { status: 502, text: String((error as Error).message ?? error) }
      tried.push(`${model}: ${last.text.slice(0, 120)}`)
      continue
    }
    if (upstream.ok && upstream.body) {
      if (tried.length) log(`combo ${combo.id}: ${model} answered after ${tried.length} failed (${tried.join(' | ')})`)
      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-cache',
        'X-Dsh-Model-Combo-Model': model,
      })
      const stream = Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0])
      stream.on('error', (error: unknown) => {
        log(`combo ${combo.id}: ${model} stream failed mid-flight: ${String(error)}`)
        if (res.writable) res.end()
      })
      stream.pipe(res)
      return
```

</details>

**依据 2 · 源码核查**：[src/commands/setup.ts:110-123](https://github.com/AIcivilization/dsh-model/blob/57c198bbd973fea8cc63eea3dc36715da947bd7a/src/commands/setup.ts#L110-L123)

公开端点可扩大边界，支持先本机建议。

<details>
<summary>查看原文（14行）</summary>

```text
    // vps：自动在 dsh 的域名上开对外端点（没有域名就用 IP），自己的其他设备直接能用
    if (ctx.mode === 'vps') {
      info('')
      info(bold(L('对外端点', 'Public endpoint')))
      if (all.state.remote?.mode && all.state.remote.mode !== 'off' && all.state.remote.mode !== 'caddy') skip(L(`已用 ${all.state.remote.mode} 方式开放，保持不变`, `Already exposed via ${all.state.remote.mode}; unchanged`))
      else
        await step('public-endpoint', async () => {
          const host = await publicHost(all.config.remote.domain)
          const port = all.config.remote.publicPort ?? DEFAULT_PUBLIC_PORT
          await enableCaddy(ctx, all, host, port)
          all.config.remote.domain = host
          all.config.remote.publicPort = port
          ok(`https://${host}:${port}/v1`)
        })
```

</details>

#### 缺口

- 契约路由和同预算任务收益未验证
  **影响**：不能把failover视为质量等价或节省费用
  **进一步探讨**：按四任务和两故障对照合格率、来源和总成本

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
