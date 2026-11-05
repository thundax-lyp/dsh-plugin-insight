# sieve 开发工作区

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1479158](https://github.com/Sev7eEn7/dsh-sieve/tree/147915819213e5f97841db512c07181d3af839e6)

<!-- BEGIN META -->
[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sev7eEn7/dsh-sieve)
<!-- END META -->

> **功能**：包含 dsh-sieve 上下文处理插件与 Web 面板的开发工作区。

> **亮点**：根工作区清晰区分后端判断处理与浏览器面板，并用统一脚本构建；价值在开发组织，不把根目录重复计算为另一套上下文算法。[Q01](#research-q01)

> **主要限制**：根包private且无bundle补丁，目录收录的根URL不能被当成可直接启用的插件；界面可见也不证明判断器和净节省已成立。[Q01](#research-q01) [Q03](#research-q03)

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
  - [Q01 · 根工作区与可安装的dsh-sieve是什么关系，适合谁？](#detail-section-11)
  - [Q02 · 工作区内上下文功能怎样接线，原文保全是否等于无损效果？](#detail-section-12)
  - [Q03 · 维护工作区与安装子包分别有什么条件和持续负担？](#detail-section-13)
  - [Q04 · 开发者能借鉴什么分工，如何验证后续设计而不误装根包？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者可从此根工作区研究上下文处理与Web面板的分包方式；终端用户应选择实际子包。[Q01](#research-q01)

相比一个包同时承担所有界面和宿主职责，分包支持按宿主需要选装；根开发脚本不能替代子包安装补丁。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 双包构建脚本 | 维护后端和Web产物 | 仅开发入口，未执行构建 |
| 独立发布子包组织 | 按宿主需要选择组件 | 实际激活依赖子包补丁，根包private |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19.0或>=24、pnpm 11.21.0 | 开发必需，声明值 | 构建双包 | 无法按作者脚本构建 |
| dsh-sieve子包与匹配DSH | 实际运行必需 | 后端事件处理 | 根工作区自身不激活 |
| Jev或Laya | 上下文处理必需 | 独立判断 | 处理可能不生效 |
| dsh-sieve-web与connection | 可选浏览器界面 | 状态和凭据管理 | Web包等待连接，后端分开 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 识别 | 用户确认根包private与子包 | 终端安装目标为真实子包 |
| 开发 | 维护者安装开发依赖并构建 | 后端与客户端产物齐备，本次未执行 |
| 配置 | 用户配置宿主与判断器 | 分别检查服务状态与界面连接 |
| 验收 | 同任务比较质量和总费用 | 不用面板删字符代替收益 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 开发依赖与构建资源，量未知 | 理解双包版本与安装路径 | private根包不供直接激活 |
| 持续 | 独立判断器与档案存储，费用未知 | 同步宿主API及两个子包发布 | 维护耗时未知 |
| 失败恢复 | 构建重试和归档存储，量未知 | 区分挂载、判断器和界面故障 | 无本次运行记录 |
| 退出 | 历史归档保留量未知 | 停用实际子包并核对会话指针 | 根源码删除不等于运行层退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 开发分工 | 后端与Web分包且统一构建 | 发布维护是否更省时 |
| 上下文处理 | 子包确有原件与事件机制 | 当前任务净收益 |
| 根目录使用 | 可作为源码研究入口 | 不能按根包宣称安装通过 |

> **思考**：根包private且无bundle补丁，目录收录的根URL不能被当成可直接启用的插件；界面可见也不证明判断器和净节省已成立。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：根工作区清晰区分后端判断处理与浏览器面板，并用统一脚本构建；价值在开发组织，不把根目录重复计算为另一套上下文算法。[Q01](#research-q01)

private根工作区统一编译并保留独立运行包，是可借鉴的职责划分；移植仍需宿主服务与客户端模块契约。归档与原生替换的工程机制属于后端子包，本条目不另计为根包能力。

<a id="detail-section-5"></a>

### 1.4 主要限制

根包private且无bundle补丁，目录收录的根URL不能被当成可直接启用的插件；界面可见也不证明判断器和净节省已成立。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅把根仓库作为维护和研究资料，先确认需要后端还是Web包，再阅读子包补丁与版本范围；不要把根URL交给用户当作完成安装。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根包的开发工作区身份和子包接线已有源码支持；三状态自检是假设，安装及收益未执行验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-sieve/package.json、packages/dsh-sieve/cordis.patch.yml、packages/dsh-sieve/src/index.ts、packages/dsh-sieve/src/features/admission.ts、packages/dsh-sieve/src/features/forgetting.ts、packages/dsh-sieve/src/features/skills.ts、packages/dsh-sieve/src/runtime/config.ts、packages/dsh-sieve/src/features/checkpoint/index.ts、packages/dsh-sieve/src/features/hive/index.ts、packages/dsh-sieve-web/package.json、packages/dsh-sieve-web/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦根工作区分发、后端/面板分工与关键上下文处理；未完整审计Web路由或全部监督模块。
- 下一步：比较三状态自检说明与现有安装说明，记录使用者是否选对包以及判读生效状态的错误；不安排本次安装实验。

**分析版本**

- **仓库**：[Sev7eEn7/dsh-sieve](https://github.com/Sev7eEn7/dsh-sieve)
- **版本号**：未声明（[固定提交 1479158](https://github.com/Sev7eEn7/dsh-sieve/tree/147915819213e5f97841db512c07181d3af839e6)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把自检分成后端挂载、判断来源与界面连接三个状态，减少把根工作区或面板当功能生效的误判；以首次安装判读和排障时间对照，不能改善就放弃。[Q04](#research-q04)

比较三状态自检说明与现有安装说明，记录使用者是否选对包以及判读生效状态的错误；不安排本次安装实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 79 | 13446 | 10015 | 2391 | — |
| .tsx | source | 2 | 531 | 458 | 41 | — |
| .md | source | 4 | 1410 | — | — | 19163 |
| .mjs | source | 2 | 175 | 134 | 24 | — |

</details>

**活跃度**

[![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/Sev7eEn7/dsh-sieve/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Sev7eEn7/dsh-sieve/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这个私有工作区根入口能否作为可安装插件使用，仓库如何分配后端与界面职责？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工作区与可安装的dsh-sieve是什么关系，适合谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根 package 名为 sieve，标记 private，脚本编译两个子包且没有 dsh.bundle.patch，因此它是维护者开发和研究入口，不是一个可直接启用的原生插件包。README 指向 dsh-sieve@0.4.1 与 dsh-sieve-web@0.4.1；前者提供后端服务，后者需要 sieve 与 connection 并把状态端点注册进认证连接。合格使用结果是维护者能理解分包关系并按所需宿主选择子包，而不是把根仓库 URL 等同于可安装包。相比把后端、Web入口和开发脚本混在单包，分包让无浏览器配置能只保留后端；这属于工程组织增量，不是新的上下文算法，也不证明安装通过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-26](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/package.json#L1-L26)

private工作区、双包构建与开发脚本。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "sieve",
  "private": true,
  "type": "module",
  "description": "Token-saving judgment plugins for DeepSeek Harness",
  "packageManager": "pnpm@11.21.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "typecheck": "tsc -p packages/dsh-sieve/tsconfig.test.json && tsc -p packages/dsh-sieve-web/tsconfig.test.json && tsc -p packages/dsh-sieve-web/tsconfig.client.json",
    "build": "tsc -p packages/dsh-sieve/tsconfig.json && tsc -p packages/dsh-sieve-web/tsconfig.json && node scripts/build-client.mjs",
    "test": "vitest --run",
    "smoke:package": "node scripts/packaging-smoke.mjs",
    "release:pack": "node scripts/release-pack.mjs",
    "measure": "node --env-file-if-exists=.env scripts/measure.mjs",
    "measure:approval": "node --env-file-if-exists=.env scripts/measurement/approval-live.mjs",
    "measure:shadow": "node scripts/measurement/shadow-report.mjs",
    "measure:hive": "node --env-file-if-exists=.env scripts/measurement/hive-ablation.mjs"
  },
  "devDependencies": {
    "@types/node": "24.19.1",
    "rolldown": "1.2.12",
    "typescript": "6.0.3",
    "vitest": "4.1.8"
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-sieve-web/src/index.ts:18-35](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve-web/src/index.ts#L18-L35)

Web后端显式依赖sieve与connection并挂载路由。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = 'sieve-web'
export const inject = ['sieve', 'connection']

/**
 * The Host Connection face. Its package declares no `Context` member for it,
 * so it is read by name, as DSH's own Session-log export route does.
 */
function connectionOf(ctx: Context): Pick<HostConnectionHandle, 'fetch'> {
  return Reflect.get(ctx, 'connection') as Pick<HostConnectionHandle, 'fetch'>
}

/**
 * Register the panel routes; Connection removes them with this plugin.
 * @param ctx - plugin context with `sieve` and `connection`.
 */
export function apply(ctx: Context): void {
  const connection = connectionOf(ctx)
  for (const route of sieveRoutes(sieveEndpoints(ctx.sieve))) connection.fetch.register(route)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-sieve/cordis.patch.yml:1-6](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/cordis.patch.yml#L1-L6)

真正的后端子包提供插入补丁。

```text
- insert:
    - id: sieve
      name: dsh-sieve
      config:
        checkpoint:
          root: !!js dshHomePath('sieve', 'checkpoints')
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区内上下文功能怎样接线，原文保全是否等于无损效果？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

真正接线位于 packages/dsh-sieve，而不在根清单。后端服务按所需宿主服务分挂 admission、forgetting 和 skills；Web子包只读取状态、管理凭据和提供页面，不承担删减。输出处理在接受的纯文本结果上计算净删减，先归档后改写；历史通过原生事件保留替换记录。文件内容不会按普通日志方式有损分块，但旧读取可经判断器替换成边缘内容和指针。归档保证字节可追溯，不保证模型会恢复需要的部分；规则删减在判断超时时仍可生效。因此仓库提供可检查机制而不提供任意任务无损或固定节省比例保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-sieve/src/index.ts:165-172](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/index.ts#L165-L172)

功能实际挂载在后端子包。

```text
    ctx.plugin({
      name: 'sieve-runtime',
      inject: ['sessionProjections'],
      apply: (child: Context) => {
        const runtime = new SessionRuntime(child, agent => this.engineFor(agent))
        child.plugin({ name: 'sieve-admission', inject: ['tools', 'spillStore'], apply: (feature: Context) => { registerAdmission(feature, this, runtime) } })
        child.plugin({ name: 'sieve-forgetting', inject: ['spillStore'], apply: (feature: Context) => { registerForgetting(feature, this, runtime) } })
        child.plugin({ name: 'sieve-skills', inject: ['skills'], apply: (feature: Context) => { registerSkills(feature, this, runtime) } })
```

**依据 2 · 源码核查**：[packages/dsh-sieve/src/features/admission.ts:240-280](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/admission.ts#L240-L280)

净门槛、归档、规则回退和文本改写。

<details>
<summary>查看原文（41行）</summary>

```text
      const early = rulesSaved > 0 ? archive() : undefined
      let omitted = new Set<number>()
      if (judging !== undefined) {
        const decisions = await untilAbort(judging, wait)
        // Late, failed or aborted: the rules result.
        if (decisions !== undefined && !decisions.some(decision => decision.reason?.startsWith('error:') === true)) {
          omitted = dropped(decisions.flatMap(decision => decision.outcome))
        }
      }
      const body = bodyWith(omitted)
      if (!valid() || finish(body, ESTIMATE_LOCATOR, '') === original) return undefined
      const ref = archived ?? await untilAbort(early ?? archive(), wait)
      if (ref === undefined || !valid()) return undefined
      const replacement = finish(body, ref.locator, ref.retrievalHint)
      if (replacement === original) return undefined
      const records: { id: string, changed: boolean }[] = []
      if (rulesId !== undefined) records.push({ id: rulesId, changed: true })
      if (judgeId !== undefined) records.push({ id: judgeId, changed: replacement !== finish(rulesBody, ref.locator, ref.retrievalHint) })
      return { sessionId, replacement, records }
    } finally {
      bound.dispose()
    }
  }

  ctx.on('tools/post-execute', async (exec, result, next): Promise<PostToolDecision> => {
    // Downstream exceptions and blocking decisions are not sieve failures.
    const decision = await next()
    const agent = exec.agent
    if (!config.enabled || decision.kind !== 'accept' || 'value' in decision || result.isError || exec.signal.aborted
      || agent === undefined || config.passThrough.includes(exec.name)) return decision
    const content = decision.content ?? result.content
    if (content.some(block => block.type !== 'text')) return decision
    const original = textOf(content)
    if (original.length < config.minChars || isSieveResult(original)) return decision
    const rewrite = await host.track(transform(exec, agent, original)).catch(() => {
      ctx.logger.warn('sieve: admission failed; keeping the original tool output')
      return undefined
    })
    if (rewrite === undefined) return decision
    receipts.set(exec, rewrite)
    return { ...decision, content: [{ type: 'text', text: rewrite.replacement }] }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-sieve/src/features/forgetting.ts:329-347](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/features/forgetting.ts#L329-L347)

原生事件替换前完成归档。

<details>
<summary>查看原文（19行）</summary>

```text
        const apply = async (selected: readonly ForgetCandidate[]): Promise<boolean> => {
          let applied = false
          for (const candidate of selected) {
            if (!valid() || bound.signal.aborted || !onSurface(candidate.seq)) break
            let ref
            try {
              ref = await untilAbort(host.track(ctx.spillStore.saveText({ owner: { sessionId },
                source: { kind: 'tool', toolName: candidate.call?.name ?? 'tool', callId: candidate.data.message.toolCallId, label: 'sieve-forgotten' },
                suggestedName: 'forgotten-output.txt', content: textOf(candidate.data.message.content),
              })), bound.signal)
            } catch { ctx.logger.warn('sieve: archive failed; keeping this tool result'); continue }
            if (ref === undefined || !valid() || !onSurface(candidate.seq)) continue
            const text = replacement(candidate, superseded.has(candidate.seq), config.edgeChars, ref.locator, ref.retrievalHint)
            if (text.length >= candidate.chars) continue
            const seq = SessionSeq(candidate.seq)
            agent.session.append('compaction/prune', { shadowedRange: { start: seq, end: seq }, shadowedSeqs: [seq], shadowedTokenCount: estimateMessage(candidate.data.message) })
            agent.session.append('tool/result', { ...candidate.data, message: freezeMessage<ToolResultMessage>({ ...candidate.data.message, content: [{ type: 'text', text }] }) }, {
              surfaceOp: { op: 'replace', startSeq: seq, endSeq: seq }, sourceEventSeqs: [seq],
            })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-sieve-web/src/index.ts:18-35](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve-web/src/index.ts#L18-L35)

Web路由与后端功能分工。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = 'sieve-web'
export const inject = ['sieve', 'connection']

/**
 * The Host Connection face. Its package declares no `Context` member for it,
 * so it is read by name, as DSH's own Session-log export route does.
 */
function connectionOf(ctx: Context): Pick<HostConnectionHandle, 'fetch'> {
  return Reflect.get(ctx, 'connection') as Pick<HostConnectionHandle, 'fetch'>
}

/**
 * Register the panel routes; Connection removes them with this plugin.
 * @param ctx - plugin context with `sieve` and `connection`.
 */
export function apply(ctx: Context): void {
  const connection = connectionOf(ctx)
  for (const route of sieveRoutes(sieveEndpoints(ctx.sieve))) connection.fetch.register(route)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 维护工作区与安装子包分别有什么条件和持续负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

维护根工作区需要声明的 Node ^22.19.0 或 >=24、pnpm 11.21.0，以及TypeScript/Vitest和DSH开发依赖；根脚本编译后端、Web服务和客户端。终端用户应选实际子包，其后端宿主范围是 >=0.2.1-rc.2 <0.2.2-0；Web包还需匹配dsh-sieve 0.4.1与浏览器客户端服务。上下文处理依赖单独Jev或Laya判断来源，不能从会话模型配置推断已生效。维护者还要承担双包发布、宿主事件适配、归档和检查点存储。根清单中的measure命令只是工具入口，未执行便不能确认当前主模型总成本；开发与终端运行的费用/耗时也不能混算。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-26](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/package.json#L1-L26)

Node、pnpm和双包编译/测量脚本。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "sieve",
  "private": true,
  "type": "module",
  "description": "Token-saving judgment plugins for DeepSeek Harness",
  "packageManager": "pnpm@11.21.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "typecheck": "tsc -p packages/dsh-sieve/tsconfig.test.json && tsc -p packages/dsh-sieve-web/tsconfig.test.json && tsc -p packages/dsh-sieve-web/tsconfig.client.json",
    "build": "tsc -p packages/dsh-sieve/tsconfig.json && tsc -p packages/dsh-sieve-web/tsconfig.json && node scripts/build-client.mjs",
    "test": "vitest --run",
    "smoke:package": "node scripts/packaging-smoke.mjs",
    "release:pack": "node scripts/release-pack.mjs",
    "measure": "node --env-file-if-exists=.env scripts/measure.mjs",
    "measure:approval": "node --env-file-if-exists=.env scripts/measurement/approval-live.mjs",
    "measure:shadow": "node scripts/measurement/shadow-report.mjs",
    "measure:hive": "node --env-file-if-exists=.env scripts/measurement/hive-ablation.mjs"
  },
  "devDependencies": {
    "@types/node": "24.19.1",
    "rolldown": "1.2.12",
    "typescript": "6.0.3",
    "vitest": "4.1.8"
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-sieve/package.json:54-65](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/package.json#L54-L65)

后端版本范围和bundle补丁。

<details>
<summary>查看原文（12行）</summary>

```text
    "THIRD_PARTY_NOTICES.md"
  ],
  "engines": {
    "dsh": ">=0.2.1-rc.2 <0.2.2-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "zod": "4.4.3"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-sieve-web/package.json:45-65](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve-web/package.json#L45-L65)

Web包声明客户端服务。

<details>
<summary>查看原文（21行）</summary>

```text
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-shortcuts": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-dockkit": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.2",
```

</details>

**依据 4 · 源码核查**：[packages/dsh-sieve/src/runtime/config.ts:409-434](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/runtime/config.ts#L409-L434)

判断来源与旧配置拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
export function resolveConfig(config: Partial<Config> | undefined): ResolvedConfig {
  // The schema drops unknown keys; a profile written for the removed session-model judge must not load as if it worked.
  const raw = (config ?? {}) as Record<string, unknown>
  const rawJudge = typeof raw['judge'] === 'object' && raw['judge'] !== null ? raw['judge'] as Record<string, unknown> : {}
  if (rawJudge['type'] === 'llm' || rawJudge['type'] === 'off' || 'routes' in raw || 'provider' in rawJudge || 'maxOutputTokens' in rawJudge) {
    throw new Error('sieve: the session-model judge was removed (judge.type llm or off, judge.provider, judge.maxOutputTokens, routes); configure Jev or Laya')
  }

  const value = Config((config ?? {}) as Config)
  const judge = value.judge

  let resolved: ResolvedJudge
  if (judge.type === 'auto') {
    resolved = { type: 'auto', timeoutMs: judge.timeoutMs }
  } else if (judge.type === 'laya') {
    resolved = { type: 'laya', baseUrl: nonEmpty(judge.baseUrl), timeoutMs: judge.timeoutMs }
  } else {
    const apiKey = nonEmpty(judge.apiKey)
    if (apiKey === undefined) throw new Error('sieve: judge.type system-one needs judge.apiKey')
    resolved = {
      type: 'system-one',
      apiKey,
      baseUrl: nonEmpty(judge.baseUrl),
      model: nonEmpty(judge.model),
      timeoutMs: judge.timeoutMs,
    }
```

</details>

#### 缺口

- 未取得判断服务当期账单、Laya设备消耗与合格任务耗时。
  **影响**：无法判定总费用是否因主模型输入减少而下降。
  **进一步探讨**：在限定任务样本记录判断调用、主模型账单、归档大小和人工处理时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 开发者能借鉴什么分工，如何验证后续设计而不误装根包？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可借鉴处是把核心事件处理放在无浏览器后端，把界面状态和凭据管理放在依赖connection的包，再用根脚本一致构建。迁移这一分工仍需适配宿主服务发现、原生事件和前端模块加载，不能只复制根package。未验证设计假设是将安装说明与自检按“后端是否挂载、判断器是否就绪、界面是否连接”分成三个状态，可能减少把工作区或面板可见当作优化生效的误判。最小验证应让不熟悉仓库的人按说明完成一次后端安装，并制造缺判断器和缺connection两类配置；若他们仍把面板数字当净收益，或者分层状态增加排障时间，假设应被否定。当前采用对象是研究/维护代码的开发者；终端使用者改选子包，根包不作为安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-21](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/package.json#L11-L21)

根构建与验证脚本边界。

<details>
<summary>查看原文（11行）</summary>

```text
    "typecheck": "tsc -p packages/dsh-sieve/tsconfig.test.json && tsc -p packages/dsh-sieve-web/tsconfig.test.json && tsc -p packages/dsh-sieve-web/tsconfig.client.json",
    "build": "tsc -p packages/dsh-sieve/tsconfig.json && tsc -p packages/dsh-sieve-web/tsconfig.json && node scripts/build-client.mjs",
    "test": "vitest --run",
    "smoke:package": "node scripts/packaging-smoke.mjs",
    "release:pack": "node scripts/release-pack.mjs",
    "measure": "node --env-file-if-exists=.env scripts/measure.mjs",
    "measure:approval": "node --env-file-if-exists=.env scripts/measurement/approval-live.mjs",
    "measure:shadow": "node scripts/measurement/shadow-report.mjs",
    "measure:hive": "node --env-file-if-exists=.env scripts/measurement/hive-ablation.mjs"
  },
  "devDependencies": {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-sieve/src/index.ts:165-172](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve/src/index.ts#L165-L172)

后端功能依赖。

```text
    ctx.plugin({
      name: 'sieve-runtime',
      inject: ['sessionProjections'],
      apply: (child: Context) => {
        const runtime = new SessionRuntime(child, agent => this.engineFor(agent))
        child.plugin({ name: 'sieve-admission', inject: ['tools', 'spillStore'], apply: (feature: Context) => { registerAdmission(feature, this, runtime) } })
        child.plugin({ name: 'sieve-forgetting', inject: ['spillStore'], apply: (feature: Context) => { registerForgetting(feature, this, runtime) } })
        child.plugin({ name: 'sieve-skills', inject: ['skills'], apply: (feature: Context) => { registerSkills(feature, this, runtime) } })
```

**依据 3 · 作者声明**：[packages/dsh-sieve-web/src/index.ts:1-8](https://github.com/Sev7eEn7/dsh-sieve/blob/147915819213e5f97841db512c07181d3af839e6/packages/dsh-sieve-web/src/index.ts#L1-L8)

无浏览器时Web子包等待连接，不阻止后端。

```text
/**
 * dsh-sieve-web, Host half: answers the panel on Connection's authenticated
 * `/api` channel with a session's context reduction and the judge's Jev keys,
 * and stores or removes those keys in DSH's credential store. The browser
 * half is `./client`, discovered by DSH Client Modules from `dsh.client`.
 *
 * `connection` exists only in Web compositions; in a headless profile this
 * plugin stays pending and dsh-sieve runs unchanged.
```

#### 缺口

- 分层自检方案没有使用者任务对照。
  **影响**：不能确认它减少安装误判或排障时间。
  **进一步探讨**：比较现有说明与三状态说明，观察首次安装判读与人工排障时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
