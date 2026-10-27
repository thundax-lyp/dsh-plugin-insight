# dsh-model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[44c466c](https://github.com/AIcivilization/dsh-model/tree/44c466cbbf62769b91f0647469dc529ecdc125ee)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,481](https://img.shields.io/static/v1?label=npm+30d&message=2%2C481&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model)
<!-- END META -->

> **实现功能**：整合模型来源、统一API中转、组合切换和每日签到，并提供DSH管理界面与命令行。

> **核心亮点**：在成熟代理引擎之上整合来源与客户端接线、组合和管理流程，减少多套配置；模型推理和额度仍来自上游。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：HTTP成功一旦开始转流就退出fallback，流中失败仅结束响应；替换model不保证工具、图像和质量等价，单地址不等合格交付。[Q03](#research-q03)

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
  - [Q01 · 统一中转、模型组合和签到面向何种重复任务？](#detail-section-11)
  - [Q02 · 安装资产、daemon路由与组合fallback如何实现？](#detail-section-12)
  - [Q03 · 流开始后的失败是否回退，不同模型能力是否等价？](#detail-section-13)
  - [Q04 · 账号、密钥、服务生命周期与卸载怎样闭合？](#detail-section-14)
  - [Q05 · 请求合格率的效果/成本与状态设计怎样核查？](#detail-section-15)
  - [Q06 · 能力契约加流边界回退能否减少假成功，适合谁试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给已有多模型账号且愿意运维本地/服务器服务的用户统一客户端接线。

直接配置各客户端或直接使用CLIProxyAPI是替代；本插件增量是来源/部署/管理流程，不作同任务质量排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统一API | 多客户端使用既有来源 | 上游额度/语义仍需核对 |
| combo | 候选模型顺序选择 | 流开始后不再fallback |
| 来源与签到管理 | 账号接入和日常操作 | 第三方规则/区域依赖，未执行 |
| setup/卸载 | 配置引擎服务与DSH | 分步状态需回读，非整体事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node、CLIProxyAPI、daemon | 必需 | 统一中转 | 无端点或控制失败 |
| 有效上游账号和区域网络 | 必需 | 实际模型/签到 | 不提供额度，错误或不可用 |
| DSH/Web连接 | DSH界面必需 | 配置模型与UI | CLI仍可独立使用 |
| 系统权限/服务工具 | 对应部署必需 | 常驻与退出 | 分步失败需核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | setup与来源登录 | 校验资产、服务与单模型 |
| 使用 | 客户端接统一地址后设置combo | 完整文本/工具结果，非仅HTTP成功 |
| 验收/退出 | 故障测试、卸载并回读 | 配置服务及凭据残余符合预期 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 引擎下载、服务和上游账号，金额未知 | 登录、密钥、客户端接线 | 各来源规则/网络不同 |
| 持续 | 常驻资源和多模型请求 | 监测流、额度与质量 | 合格任务总费用未知 |
| 失败恢复/退出 | 失败候选费用及备份 | 核对配置、服务、残余插件 | 单独warn的清理需人工检查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 接线统一 | 一个兼容端点和来源控制 | 全客户端语义兼容 |
| fallback | 首包前多候选重试 | 流后完整性和质量 |
| 签到/额度 | 作者声明及控制入口 | 当前账号真实收益与规则 |

> **思考**：HTTP成功一旦开始转流就退出fallback，流中失败仅结束响应；替换model不保证工具、图像和质量等价，单地址不等合格交付。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在成熟代理引擎之上整合来源与客户端接线、组合和管理流程，减少多套配置；模型推理和额度仍来自上游。[Q01](#research-q01)、[Q02](#research-q02)

在成熟代理引擎之上整合来源与客户端接线、组合和管理流程，减少多套配置；模型推理和额度仍来自上游。[Q01](#research-q01)、[Q02](#research-q02)

资产摘要、partial落位与状态锁可借鉴，禁止组合嵌套避免循环；分步清理保留恢复状态，但warn路径和流提交语义仍需独立验收。[Q04](#research-q04)、[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

HTTP成功一旦开始转流就退出fallback，流中失败仅结束响应；替换model不保证工具、图像和质量等价，单地址不等合格交付。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在非关键任务核对单来源工具/图像兼容，再加入能力相近的combo；检查流中断和卸载残余后限定试用。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

安装与组合主链有源码证据；流后错误不回退、能力等价和卸载残余需核对；能力契约与提交边界设计未验证。

- 已检查：作者 README、包清单、源码路径 src/combo.ts、src/engine/install.ts、src/commands/uninstall.ts、src/commands/setup.ts、plugin/index.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查组合、安装、setup/卸载与Web桥接入口；未运行服务、签到、账号登录、VPS发布或所有第三方桥接。
- 下一步：可进一步以首包前后断流、工具schema差异和卸载告警矩阵核查完整任务结果及总费用。

**分析版本**

- **仓库**：[AIcivilization/dsh-model](https://github.com/AIcivilization/dsh-model)
- **版本号**：0.23.3（[固定提交 44c466c](https://github.com/AIcivilization/dsh-model/tree/44c466cbbf62769b91f0647469dc529ecdc125ee)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是组合能力交集和首包提交边界，首包后显式不完整收据而非盲重试，以故障矩阵核对完整率及重复副作用。[Q06](#research-q06)

可进一步以首包前后断流、工具schema差异和卸载告警矩阵核查完整任务结果及总费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1534 | 1394 | 94 | — |
| .md | source | 5 | 1015 | — | — | 16188 |
| .mjs | source | 1 | 44 | 31 | 8 | — |
| .ts | source | 87 | 13952 | 10505 | 2491 | — |
| .ts | test | 31 | 2580 | 2316 | 97 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIcivilization/dsh-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对统一模型端点的编排贡献、流式回退边界与服务退出负担。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一中转、模型组合和签到面向何种重复任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已有多个模型账号的用户少维护多个客户端连接，把可用来源映射到一个OpenAI兼容端点，并管理签到与模型切换。相比逐客户端配置，增量是接线、来源登录、用量展示及失败候选的统一编排；推理引擎来自CLIProxyAPI，模型能力与额度仍来自上游，不能当插件提供免费额度。合格任务应是原客户端收到工具/文本等完整兼容结果，不是端口可访问或列表出现模型。签到服务受账号和供应商规则影响，作者积分数字只作版本声明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-57](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/README.md#L22-L57)

作者声明签到、统一端点及不提供额度。

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/engine/install.ts:1-5](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/engine/install.ts#L1-L5)

引擎下载/版本组织并非自研模型推理。

```text
// engine/install.ts — 下载、校验、解压、切换引擎版本
//
// 只信任仓库里 engine-manifest.json 的 sha256；校验不过直接失败。
// 版本目录 engine/versions/<v>/，current 软链指向在用版本，升级与回滚只切软链。
// Windows：发布包是 zip、程序叫 cli-proxy-api.exe；建软链要管理员，所以 current 用目录联接（junction），不需要权限。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装资产、daemon路由与组合fallback如何实现？

**研究主题**：功能与机制

#### 完整回答

setup持锁读取状态并按步骤安装/迁移，遇识别的错误记录failures且保存状态，不是整轮事务回滚。引擎从固定manifest取资产，下载校验sha256后解压到partial并rename，再激活版本。combo至少两模型、去重并禁止嵌套；接收到JSON请求后只替换model字段，依序通过本地引擎发请求，400/422根据错误文本决定是否继续，其余失败通常尝试下个。插件Web层转发到本机daemon控制接口，UI与实际转发分层。

#### 证据与依据

**依据 1 · 源码核查**：[src/commands/setup.ts:41-64](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/commands/setup.ts#L41-L64)

持锁与分步错误保存。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/engine/install.ts:112-134](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/engine/install.ts#L112-L134)

资产校验、partial与版本落位。

<details>
<summary>查看原文（23行）</summary>

```text
    if (actual !== asset.sha256) {
      throw new DshModelError(
        'engine_checksum_mismatch',
        L(`引擎文件校验失败：期望 ${asset.sha256}，实际 ${actual}`, `Engine checksum mismatch: expected ${asset.sha256}, got ${actual}`),
        L('文件可能被篡改或下载不完整，已中止。', 'The file may be tampered with or incomplete; aborted.'),
      )
    }
    if (local) {
      const { writeFile } = await import('node:fs/promises')
      await writeFile(archive, data, { mode: 0o600 })
    }
    await rm(partial, { recursive: true, force: true })
    await mkdir(partial, { recursive: true })
    const tar = await extract(archive, partial)
    if (tar.code !== 0) throw new DshModelError('engine_extract_failed', L(`解压引擎失败：${tar.stderr.trim()}`, `Failed to extract engine: ${tar.stderr.trim()}`))
    if (!(await exists(join(partial, ENGINE_BIN)))) throw new DshModelError('engine_extract_failed', L(`压缩包里没有 ${ENGINE_BIN}`, `${ENGINE_BIN} not found in archive`))
    if (process.platform !== 'win32') await chmod(join(partial, ENGINE_BIN), 0o755)
    await rename(partial, join(ctx.paths.versionsDir, version))
    if (ctx.owner) await run('chown', ['-R', `${ctx.owner.uid}:${ctx.owner.gid}`, ctx.paths.engineDir])
    return true
  } finally {
    await rm(archive, { force: true })
    await rm(partial, { recursive: true, force: true })
```

</details>

**依据 3 · 源码核查**：[src/combo.ts:34-55](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L34-L55)

组合约束和回退分类。

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

**依据 4 · 源码核查**：[src/combo.ts:70-115](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L70-L115)

顺序请求和模型替换。

<details>
<summary>查看原文（46行）</summary>

```text
export async function runCombo(run: ComboRun): Promise<void> {
  const { res, combo } = run
  const log = run.log ?? (() => {})
  let body: Record<string, unknown>
  try {
    body = JSON.parse(run.raw) as Record<string, unknown>
  } catch {
    return reply(res, 400, { error: { message: 'request body is not JSON', type: 'invalid_json', code: 'invalid_json' } })
  }
  const tried: string[] = []
  let last: { status: number; text: string } | undefined
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

### Q03 · 流开始后的失败是否回退，不同模型能力是否等价？

**研究主题**：缺陷与关键质疑

#### 完整回答

不会。收到ok且有body后立即发响应头、pipe并return，流中error只写日志和end，已不再进入下一个候选。未解析SSE结束标志或验证工具调用完整性，因此HTTP成功不能保证合格模型交付。请求原样仅替换model，也不检查各候选上下文、图像、工具schema与推理参数的能力契约；同一请求跨模型可得到不等价答案。源码支持“启动前某些失败自动换”，不支持笼统“不怕出错”的端到端保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:97-110](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L97-L110)

流一开始就退出候选循环，错误结束响应。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 2 · 源码核查**：[src/combo.ts:85-89](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L85-L89)

仅替换model而无能力归一。

```text
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
```

**依据 3 · 作者声明**：[README.md:38-45](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/README.md#L38-L45)

作者的统一和回退主张需收窄。

```text
你手上的模型来源，各家接口、登录方式都不一样。dsh-model 把它们合成**一个 OpenAI 兼容地址**：

- **dsh 里自动出现**：全部模型按来源分组，不用手动配置。
- **其他软件也能用**：Cline、Continue、Cherry Studio、脚本……凡是支持 OpenAI 接口的，填同一个地址和 key 就行。
- **不怕限流**：自己排一个组合（如 Codex → Kimi → Gemini），一个限流、额度用完或出错，就自动换下一个。
- **心里有数**：套餐用量和重置倒计时、每个模型的成功率和速度、最近失败的原因和该怎么办；额度快用完时提醒。
- **默认安全**：始终要求 key，每台设备一把，可随时吊销；登录全在本机完成。
- **电脑和服务器都行**：Windows、macOS、Linux；装在 VPS 上（配合 [dsh-vps](https://github.com/AIcivilization/dsh-vps)）自动开一个 https 地址，电脑、手机随处用。卸载时把 dsh 的配置逐字节还原。
```

#### 缺口

- 流中失败/截断、工具调用不完整及跨模型质量无同条件结果
  **影响**：不能证明组合提高合格率或降低任务成本
  **进一步探讨**：注入首包前/后断流和坏工具参数，按完整任务输出核验并对齐模型能力

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 账号、密钥、服务生命周期与卸载怎样闭合？

**研究主题**：依赖、兼容与流程

#### 完整回答

使用需Node、可启动的CLIProxyAPI和daemon、上游账号/区域网络及接入客户端；VPS还涉及系统服务和远端公开地址。Web入口说明同源POST、页面token与控制白名单，但本轮只核查接线未完成全路由安全审计。卸载按步骤拆除远端/DSH/服务，errors非空保留home供重试；不过removeDshPlugin失败只warn而未进入统一step错误列表，不能仅凭errors为空就断言所有可选插件都已移除。凭据备份需用户明确选择keep-auth，退出应核对残余状态而非盲重放setup。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:1-7](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/plugin/index.js#L1-L7)

Web与daemon数据边界声明。

```text
// plugin/index.js — dsh-model 的 dsh 插件（宿主端）
//
// 只做一件事：把页面的请求转给 dsh-model 守护进程的 /control/*（设计 §14.1）。
// - 路由 /api-dsh-model/call 与 /api-dsh-model/token，挂在 dsh 自己的 webServer 上，所以先过 dsh 的登录校验；
// - 只收同源的 POST JSON，并且要带页面令牌（宿主经 index-inject / tapIndex 注入页面，跨站网页读不到）；
// - 守护进程的地址与控制密钥从 ~/.dsh-model/bridge.json 读（dsh 与守护进程是同一个用户），浏览器永远拿不到；
// - 只转发白名单里的控制接口。
```

**依据 2 · 源码核查**：[src/commands/uninstall.ts:64-99](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/commands/uninstall.ts#L64-L99)

插件移除告警、分步清理与保留home语义。

<details>
<summary>查看原文（36行）</summary>

```text
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
  info(L('最后可执行：npm uninstall -g dsh-model', 'Finally you can run: npm uninstall -g dsh-model'))
```

</details>

**依据 3 · 源码核查**：[src/commands/setup.ts:41-43](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/commands/setup.ts#L41-L43)

VPS权限和状态锁要求。

```text
export async function setup(ctx: Ctx, opts: SetupOptions): Promise<number> {
  requireRootInVps(ctx)
  return withLock(ctx, async () => {
```

#### 缺口

- 当前系统与账号下真实卸载回读未完成
  **影响**：残余服务/插件和凭据是否按预期保留未知
  **进一步探讨**：在隔离profile按步骤比对配置和服务清单，并核对告警路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 请求合格率的效果/成本与状态设计怎样核查？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

有价值的工程点包括资产校验、禁止combo递归、安装状态锁、分步错误汇总和清理失败留home。它们缩小下载损坏和重复接线风险，但不能证明第三方资产可信、账号授权或任务质量。首次有引擎/服务/登录维护，持续有上游账单、签到及后台常驻，失败可能向多个模型重复发送同一内容并累积费用。以完整工具结果或合格答案为单位，应将所有失败候选和人工核对计入；没有这类账单/质量/耗时对照，不能把统一地址或作者免费标签换算ROI。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/install.ts:112-134](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/engine/install.ts#L112-L134)

校验与落位支持安装完整性。

<details>
<summary>查看原文（23行）</summary>

```text
    if (actual !== asset.sha256) {
      throw new DshModelError(
        'engine_checksum_mismatch',
        L(`引擎文件校验失败：期望 ${asset.sha256}，实际 ${actual}`, `Engine checksum mismatch: expected ${asset.sha256}, got ${actual}`),
        L('文件可能被篡改或下载不完整，已中止。', 'The file may be tampered with or incomplete; aborted.'),
      )
    }
    if (local) {
      const { writeFile } = await import('node:fs/promises')
      await writeFile(archive, data, { mode: 0o600 })
    }
    await rm(partial, { recursive: true, force: true })
    await mkdir(partial, { recursive: true })
    const tar = await extract(archive, partial)
    if (tar.code !== 0) throw new DshModelError('engine_extract_failed', L(`解压引擎失败：${tar.stderr.trim()}`, `Failed to extract engine: ${tar.stderr.trim()}`))
    if (!(await exists(join(partial, ENGINE_BIN)))) throw new DshModelError('engine_extract_failed', L(`压缩包里没有 ${ENGINE_BIN}`, `${ENGINE_BIN} not found in archive`))
    if (process.platform !== 'win32') await chmod(join(partial, ENGINE_BIN), 0o755)
    await rename(partial, join(ctx.paths.versionsDir, version))
    if (ctx.owner) await run('chown', ['-R', `${ctx.owner.uid}:${ctx.owner.gid}`, ctx.paths.engineDir])
    return true
  } finally {
    await rm(archive, { force: true })
    await rm(partial, { recursive: true, force: true })
```

</details>

**依据 2 · 源码核查**：[src/combo.ts:81-115](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L81-L115)

多候选转发扩大请求次数。

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

**依据 3 · 源码核查**：[src/commands/uninstall.ts:92-99](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/commands/uninstall.ts#L92-L99)

错误时保留home供恢复。

```text
  if (errors.length) {
    warn(L(`有 ${errors.length} 步失败，保留了 ${ctx.paths.home} 以便重试（再次执行 uninstall）`, `${errors.length} step(s) failed; kept ${ctx.paths.home} so you can retry (run uninstall again)`))
    return 1
  }
  // Windows：刚结束的进程可能还没完全退出、还占着目录，删除会短暂报 EBUSY / EPERM，重试一会儿
  await rm(ctx.paths.home, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 })
  ok(L(`已删除 ${ctx.paths.home}，卸载完成`, `Deleted ${ctx.paths.home}; uninstall complete`))
  info(L('最后可执行：npm uninstall -g dsh-model', 'Finally you can run: npm uninstall -g dsh-model'))
```

#### 缺口

- 同任务组合与单模型的合格率、总费用和人工时间未知
  **影响**：无法评估fallback成本是否值得
  **进一步探讨**：相同预算和输入记录所有候选请求、完整输出、人工修正与账单

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能力契约加流边界回退能否减少假成功，适合谁试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是给组合声明工具、图像、上下文和可接受参数的能力交集，并区分首包前可回退、首包后必须报告不完整的提交边界。不能在已经输出工具动作后自动全量重试，否则可能重复副作用；需可确认的请求收据和上层恢复协议。用兼容/不兼容模型及首包前后故障矩阵比较合格输出率和重复动作，若开销或重放风险上升应否定。已有多账号且能维护本地服务的人可在非关键任务限定试用，先验收流完整与卸载，不建议依赖自动fallback完成不可逆操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/combo.ts:97-110](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L97-L110)

当前提交边界只看HTTP成功。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 2 · 源码核查**：[src/combo.ts:85-89](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/combo.ts#L85-L89)

模型替换需要显式能力约束。

```text
      upstream = await fetch(`http://127.0.0.1:${run.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${run.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, model }),
        signal: run.signal,
```

**依据 3 · 源码核查**：[src/commands/uninstall.ts:92-99](https://github.com/AIcivilization/dsh-model/blob/44c466cbbf62769b91f0647469dc529ecdc125ee/src/commands/uninstall.ts#L92-L99)

退出路径可作为试用结束验收。

```text
  if (errors.length) {
    warn(L(`有 ${errors.length} 步失败，保留了 ${ctx.paths.home} 以便重试（再次执行 uninstall）`, `${errors.length} step(s) failed; kept ${ctx.paths.home} so you can retry (run uninstall again)`))
    return 1
  }
  // Windows：刚结束的进程可能还没完全退出、还占着目录，删除会短暂报 EBUSY / EPERM，重试一会儿
  await rm(ctx.paths.home, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 })
  ok(L(`已删除 ${ctx.paths.home}，卸载完成`, `Deleted ${ctx.paths.home}; uninstall complete`))
  info(L('最后可执行：npm uninstall -g dsh-model', 'Finally you can run: npm uninstall -g dsh-model'))
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
